"use client";

import { useRef, useMemo, Suspense, useEffect, useState, memo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// SE isometric camera position (no model rotation needed)
// Camera positioned at SE angle looking at center
const INITIAL_CAMERA_POSITION: [number, number, number] = [5, 4, 5];
const PREVIEW_ZOOM = 65;
const INTERACTIVE_ZOOM = 85;

interface GLBModelProps {
  modelSrc: string;
}

function GLBModel({ modelSrc }: GLBModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelSrc);

  const processedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Center and scale the model
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 4 / maxDim;

    const wrapper = new THREE.Group();
    wrapper.add(clone);
    clone.position.set(-center.x, -center.y, -center.z);
    wrapper.scale.setScalar(scale);

    // Optimize materials for better performance
    wrapper.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.frustumCulled = true;
        if (child.material) {
          // Disable unnecessary features
          const mat = child.material as THREE.MeshStandardMaterial;
          if (mat.map) mat.map.anisotropy = 1;
        }
      }
    });

    return wrapper;
  }, [scene]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={processedScene} />
    </group>
  );
}

function CameraController({ interactive, controlsRef }: { interactive: boolean; controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const { camera, size } = useThree();
  const hasMounted = useRef(false);
  const wasInteractive = useRef(interactive);
  const isAnimating = useRef(false);
  const targetPosition = useRef(new THREE.Vector3(...INITIAL_CAMERA_POSITION));
  const targetZoom = useRef(PREVIEW_ZOOM);

  // Set initial state on mount (no animation)
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      wasInteractive.current = interactive;
      return;
    }
  }, []);

  // Handle mode changes (only animate when CLOSING, not when opening)
  useEffect(() => {
    if (!hasMounted.current) return;

    if (wasInteractive.current !== interactive) {
      // Only animate when going from interactive to preview (closing)
      if (wasInteractive.current && !interactive) {
        isAnimating.current = true;
        targetPosition.current.set(...INITIAL_CAMERA_POSITION);
        targetZoom.current = PREVIEW_ZOOM;

        // Disable OrbitControls during animation
        if (controlsRef.current) {
          controlsRef.current.enabled = false;
        }
      }
      wasInteractive.current = interactive;
    }
  }, [interactive, controlsRef]);

  // Update camera on resize
  useEffect(() => {
    if ('updateProjectionMatrix' in camera) {
      camera.updateProjectionMatrix();
    }
  }, [size, camera]);

  // Animate camera position and zoom smoothly
  useFrame(() => {
    if (!isAnimating.current) return;

    const speed = 0.03; // Slower = smoother animation
    camera.position.lerp(targetPosition.current, speed);
    camera.lookAt(0, 0, 0);

    // Animate zoom for orthographic camera
    if ('zoom' in camera) {
      camera.zoom += (targetZoom.current - camera.zoom) * speed;
      camera.updateProjectionMatrix();
    }

    // Check if we're close enough to target
    const positionDone = camera.position.distanceTo(targetPosition.current) < 0.01;
    const zoomDone = 'zoom' in camera ? Math.abs(camera.zoom - targetZoom.current) < 0.1 : true;

    if (positionDone && zoomDone) {
      camera.position.copy(targetPosition.current);
      if ('zoom' in camera) {
        camera.zoom = targetZoom.current;
        camera.updateProjectionMatrix();
      }
      isAnimating.current = false;

      // Re-enable OrbitControls after animation
      if (controlsRef.current) {
        controlsRef.current.reset();
        controlsRef.current.enabled = true;
      }
    }
  });

  return null;
}

interface SceneProps {
  modelSrc: string;
  interactive: boolean;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

function Scene({ modelSrc, interactive, controlsRef }: SceneProps) {
  return (
    <>
      <CameraController interactive={interactive} controlsRef={controlsRef} />

      {/* Simplified lighting - 2 lights instead of 4 */}
      <ambientLight intensity={1.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />

      <Suspense fallback={null}>
        <GLBModel modelSrc={modelSrc} />
      </Suspense>

      {interactive && (
        <OrbitControls
          ref={controlsRef as React.RefObject<OrbitControlsImpl>}
          enablePan={false}
          enableZoom={true}
          enableDamping
          dampingFactor={0.05}
          minDistance={4}
          maxDistance={15}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
        />
      )}
    </>
  );
}

interface ModelPreviewProps {
  modelSrc?: string;
  className?: string;
  interactive?: boolean;
}

// Component to trigger initial render then stop
function InitialRender({ onRendered }: { onRendered: () => void }) {
  const hasRendered = useRef(false);

  useFrame(() => {
    if (!hasRendered.current) {
      hasRendered.current = true;
      // Wait a few frames to ensure model is loaded and rendered
      setTimeout(onRendered, 100);
    }
  });

  return null;
}

export default function ModelPreview({
  modelSrc,
  className = "",
  interactive = false
}: ModelPreviewProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [hasInitialRender, setHasInitialRender] = useState(false);
  const [isAnimatingBack, setIsAnimatingBack] = useState(false);
  const wasInteractive = useRef(interactive);

  // Track when closing (interactive -> not interactive) to keep rendering during animation
  useEffect(() => {
    if (wasInteractive.current && !interactive) {
      // Started closing - keep rendering for the animation
      setIsAnimatingBack(true);
      // Animation takes about 2 seconds, then switch to demand mode
      const timer = setTimeout(() => {
        setIsAnimatingBack(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (interactive) {
      setHasInitialRender(false);
    }
    wasInteractive.current = interactive;
  }, [interactive]);

  if (!modelSrc) {
    return <div className={`w-full h-full ${className}`} />;
  }

  // Use demand-based rendering for previews (only render when needed)
  // Use continuous rendering when interactive OR when animating back to preview
  const frameloop = (interactive || isAnimatingBack) ? "always" : (hasInitialRender ? "demand" : "always");

  return (
    <div className={`w-full h-full ${className} relative`}>
      <Canvas
        gl={{
          antialias: interactive, // Only antialias when interactive
          alpha: true,
          powerPreference: "high-performance",
          precision: interactive ? "highp" : "mediump", // Lower precision for previews
          stencil: false, // Disable stencil buffer
          depth: true
        }}
        dpr={interactive ? [1, 2] : 1} // Lower DPR for previews
        frameloop={frameloop}
        flat={!interactive} // Disable tone mapping for previews (faster)
        orthographic
        camera={{
          position: INITIAL_CAMERA_POSITION,
          zoom: PREVIEW_ZOOM,
          near: 0.1,
          far: 100
        }}
        style={{ background: "transparent" }}
      >
        {!hasInitialRender && (
          <InitialRender onRendered={() => setHasInitialRender(true)} />
        )}
        <Scene
          modelSrc={modelSrc}
          interactive={interactive}
          controlsRef={controlsRef}
        />
        <Preload all />
      </Canvas>
    </div>
  );
}
