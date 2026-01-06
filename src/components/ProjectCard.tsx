"use client";

import { memo, Suspense, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Project, ProjectId, ProjectView } from "@/src/lib/config";

const ModelPreview = dynamic(() => import("./ModelPreview"), {
  ssr: false,
});

interface ProjectCardProps {
  project: Project;
  isFocused: boolean;
  isAnyFocused: boolean;
  currentView: ProjectView | undefined;
  onClick: () => void;
  isMobile: boolean;
  index: number;
}

function ProjectCard({
  project,
  isFocused,
  isAnyFocused,
  currentView,
  onClick,
  isMobile,
  index,
}: ProjectCardProps) {
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Determine animation state
  const animateState = isFocused
    ? currentView?.type === "model"
      ? "focused"
      : "focusedHidden"
    : isAnyFocused
    ? "hidden"
    : "preview";

  // Desktop artistic positioning from config
  const desktopPreviewPosition = {
    top: project.position.top,
    left: project.position.left || "auto",
    right: project.position.right || "auto",
    x: "0%",
    y: project.position.translateY,
    scale: 1,
    opacity: 1,
  };

  // Mobile stacked positioning
  const mobilePreviewPosition = {
    position: "relative" as const,
    top: "auto",
    left: "auto",
    right: "auto",
    x: "0%",
    y: "0%",
    scale: 1,
    opacity: 1,
  };

  const variants = {
    preview: isMobile ? mobilePreviewPosition : desktopPreviewPosition,
    focused: {
      top: "50%",
      left: "50%",
      right: "auto",
      x: "-50%",
      y: "-50%",
      scale: 1.5,
      opacity: 1,
    },
    focusedHidden: {
      top: "50%",
      left: "50%",
      right: "auto",
      x: "-50%",
      y: "-50%",
      scale: 1.5,
      opacity: 0,
    },
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
  };

  return (
    <motion.div
      initial={false}
      animate={animateState}
      variants={variants}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      style={
        !isMobile
          ? {
              width: "clamp(200px, 30vw, 350px)",
              height: "clamp(200px, 30vw, 350px)",
            }
          : {
              width: "min(280px, 70vw)",
              height: "min(280px, 70vw)",
            }
      }
      onClick={!isAnyFocused ? onClick : undefined}
      role={!isAnyFocused ? "button" : undefined}
      tabIndex={!isAnyFocused ? 0 : -1}
      aria-label={!isAnyFocused ? `View ${project.name} project` : undefined}
      onKeyDown={(e) => {
        if (!isAnyFocused && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`${isMobile ? "relative" : "absolute"} ${
        isFocused ? "z-20" : "z-0"
      } group ${!isAnyFocused ? "cursor-pointer" : ""} ${
        !isAnyFocused ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2" : ""
      }`}
    >
      <div
        className={`w-full h-full transition-all duration-300 grayscale ${
          !isAnyFocused ? "hover:invert" : ""
        }`}
      >
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
            </div>
          }
        >
          <ModelPreview
            modelSrc={project.modelSrc}
            interactive={isFocused}
          />
        </Suspense>
      </div>
      {!isAnyFocused && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="font-clash text-sm text-charcoal whitespace-nowrap">
            {project.name}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default memo(ProjectCard);
