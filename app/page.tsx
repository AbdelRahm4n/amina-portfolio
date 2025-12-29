"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/src/components/Header";
import SlidePanel from "@/src/components/SlidePanel";
import CloseButton from "@/src/components/CloseButton";
import { useGLTF } from "@react-three/drei";

const ModelPreview = dynamic(() => import("@/src/components/ModelPreview"), {
  ssr: false,
});

// Preload all models after page load for smoother interactions
const MODEL_PATHS = [
  "/assets/projects/agora/agora.glb",
  "/assets/projects/duplex/duplex.glb",
  "/assets/projects/le reseau/reseau-optimized.glb",
];

if (typeof window !== "undefined") {
  // Preload models after initial render
  setTimeout(() => {
    MODEL_PATHS.forEach((path) => useGLTF.preload(path));
  }, 1000);
}

type PanelType = "about" | "contact" | null;
type FocusedProject = "agora" | "duplex" | "milcondos" | null;

const PROJECTS = {
  agora: {
    name: "Agora",
    modelSrc: "/assets/projects/agora/agora.glb",
    previewImg: "/assets/projects/agora/preview.png",
    subtitle: ["ARC3017 - Fall 2024", "14 weeks", "Teammate : Lyna Temmam", "Tutor : Ewan Branda"],
    views: [
      { type: "model" },
      {
        type: "text",
        content: "The \"Insertion Iconique\" studio focused on designing a public building for pickleball courts and related functions on an industrial-urban site in Pointe-Saint-Charles, Montreal. The project explored themes such as adapting suburban architectural typologies to dense urban contexts and leveraging parametric and AI tools to develop minimal and expressive forms.\n\nAgora, true to its name, embodies the essence of a public space where everyone can find purpose and connection. From the outset, our approach was guided by four clear objectives: creating a pedestrian path linking both sides of the site, increasing greenery, integrating seamlessly with the surrounding environment, and establishing a new hub to serve the adjacent Pôle Emploi.\n\nDrawing inspiration from Louis Kahn's Dominican Motherhouse and Bernard Tschumi's Parc de la Villette, we envisioned a walled garden where user experience took center stage. Secondary functions, such as the Timeout Market and library, were harmoniously integrated into a unified hub.\n\nRather than viewing the courts as constraints, we embraced them as the driving force of the project. Our ecological take on Brutalism featured CLT (cross-laminated timber) for the structure, with a strong emphasis on the expressive potential of the surrounding wall."
      },
      { type: "gallery", comingSoon: true }
    ]
  },
  "duplex": {
    name: "Rosemont Duplex",
    modelSrc: "/assets/projects/duplex/duplex.glb",
    previewImg: "/assets/projects/duplex/preview.png",
    subtitle: ["ARC2011", "Autumn 2023", "3 weeks", "Tutor: Sébastien St-Laurent"],
    views: [
      { type: "model" },
      {
        type: "text",
        content: "This project focuses on designing a building with two 300m² residential units for a multigenerational household, including an 80m² workshop. The design prioritizes universal accessibility, ensuring one of the units accommodates easy access from the street.\n\nThe site is in the Marconi-Alexandra district, an eclectic area undergoing urban transformation with a mix of industrial and residential buildings. The project emphasizes the relationship between the design and its context, ensuring sun exposure, comfort, and integration with the surrounding neighborhood while fostering a contemporary architectural expression.\n\nThe design of this duplex draws inspiration from Gerrit Rietveld's Schröder House, with a focus on maximizing sunlight and incorporating a biophilic approach, as well as creating double-height functional spaces.\n\nThe shared space, which is designed as a renovated garage, functions as a small flower shop, serving as a work-from-home area for the family business. This space is accessible to both families: unit one connects via a spiral staircase, while unit two is linked through exterior doors that lead to the courtyards."
      },
      { type: "gallery", comingSoon: true }
    ]
  },
  "milcondos": {
    name: "Mil Condos",
    modelSrc: "/assets/projects/le reseau/reseau-optimized.glb",
    previewImg: "/assets/projects/le reseau/preview.png",
    subtitle: ["ARC2011", "Autumn 2023", "9 weeks", "Teammate: Audrey Lefebvre", "Tutor: Sébastien St-Laurent"],
    views: [
      { type: "model" },
      {
        type: "text",
        content: "This project focuses on urban collective housing in the Nouvel Outremont area of Montreal, bordering the MIL Campus. It aims to design a mixed-use residential complex with at least 40 units, incorporating shared spaces, community services, and retail.\n\nThe design must blend with the site's evolving urban fabric, considering density, accessibility, and integration of public and private spaces. Emphasis is placed on sustainable design, universal accessibility, and urban regeneration, while respecting local building regulations and environmental context.\n\nOur primary goal was to optimize the user experience by maximizing sunlight and offering expansive views. To achieve this, we divided the building into five distinct blocks, interconnected by a network of corridors, ensuring each unit benefits from at least three unobstructed walls with views.\n\nThe three larger blocks along Thérèse Lavoie Roux Street create a cohesive façade that blends seamlessly with the new, gentrified area, while the three smaller blocks along Rue du Manoir reflect the classic townhouse style of Outremont, hence the choice of a brick finish.\n\nOn a more intimate scale, we applied this concept of fragmentation within the units by introducing tinted grey \"glass corners,\" enhancing the sense of luxury. The design accommodates a variety of living spaces, including two-story townhouses on the ground floor, as well as one-floor apartments and penthouses spread throughout the building."
      },
      { type: "gallery", comingSoon: true }
    ]
  },
};

export default function HomePage() {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [focusedProject, setFocusedProject] = useState<FocusedProject>(null);
  const [projectView, setProjectView] = useState(0);

  const handleAboutClick = () => setActivePanel("about");
  const handleContactClick = () => setActivePanel("contact");
  const handleClosePanel = () => setActivePanel(null);

  const handleProjectClick = (project: FocusedProject) => {
    setFocusedProject(project);
    setProjectView(0);
  };

  const handleCloseProject = () => {
    setFocusedProject(null);
    setProjectView(0);
  };

  const currentProject = focusedProject ? PROJECTS[focusedProject] : null;
  const totalViews = currentProject?.views.length || 1;
  const currentView = currentProject?.views[projectView];

  const handleNextView = () => setProjectView(prev => Math.min(prev + 1, totalViews - 1));
  const handlePrevView = () => setProjectView(prev => Math.max(0, prev - 1));

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-cream">
      {/* Header - hidden when project is focused */}
      <motion.div
        animate={{
          opacity: focusedProject ? 0 : 1,
          pointerEvents: focusedProject ? "none" : "auto"
        }}
        transition={{ duration: 0.3 }}
      >
        <Header onAboutClick={handleAboutClick} onContactClick={handleContactClick} />
      </motion.div>

      {/* Agora Project */}
      <motion.div
        initial={false}
        animate={
          focusedProject === "agora"
            ? (currentView?.type === "model" ? "focused" : "focusedHidden")
            : (focusedProject ? "hidden" : "preview")
        }
        variants={{
          preview: {
            top: "50%",
            right: "5%",
            left: "auto",
            x: "0%",
            y: "-40%",
            scale: 1,
            opacity: 1,
          },
          focused: {
            top: "50%",
            right: "auto",
            left: "50%",
            x: "-50%",
            y: "-50%",
            scale: 1.5,
            opacity: 1,
          },
          focusedHidden: {
            top: "50%",
            right: "auto",
            left: "50%",
            x: "-50%",
            y: "-50%",
            scale: 1.5,
            opacity: 0,
          },
          hidden: {
            opacity: 0,
            scale: 0.9,
          },
        }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: 'clamp(200px, 30vw, 350px)',
          height: 'clamp(200px, 30vw, 350px)',
        }}
        onClick={!focusedProject ? () => handleProjectClick("agora") : undefined}
        className={`absolute ${focusedProject === "agora" ? 'z-20' : 'z-0'} group ${!focusedProject ? 'cursor-pointer' : ''}`}
      >
        <div className={`w-full h-full transition-all duration-300 grayscale ${!focusedProject ? 'hover:invert' : ''}`}>
          <ModelPreview
            modelSrc="/assets/projects/agora/agora.glb"
            interactive={focusedProject === "agora"}
          />
        </div>
        {!focusedProject && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="font-clash text-sm text-charcoal">Agora</span>
          </div>
        )}
      </motion.div>

      {/* Duplex Project */}
      <motion.div
        initial={false}
        animate={
          focusedProject === "duplex"
            ? (currentView?.type === "model" ? "focused" : "focusedHidden")
            : (focusedProject ? "hidden" : "preview")
        }
        variants={{
          preview: {
            top: "60%",
            left: "10%",
            right: "auto",
            x: "0%",
            y: "-50%",
            scale: 1,
            opacity: 1,
          },
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
        }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: 'clamp(200px, 30vw, 350px)',
          height: 'clamp(200px, 30vw, 350px)',
        }}
        onClick={!focusedProject ? () => handleProjectClick("duplex") : undefined}
        className={`absolute ${focusedProject === "duplex" ? 'z-20' : 'z-0'} group ${!focusedProject ? 'cursor-pointer' : ''}`}
      >
        <div className={`w-full h-full transition-all duration-300 grayscale ${!focusedProject ? 'hover:invert' : ''}`}>
          <ModelPreview
            modelSrc="/assets/projects/duplex/duplex.glb"
            interactive={focusedProject === "duplex"}
          />
        </div>
        {!focusedProject && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="font-clash text-sm text-charcoal">Rosemont Duplex</span>
          </div>
        )}
      </motion.div>

      {/* Mil Condos Project */}
      <motion.div
        initial={false}
        animate={
          focusedProject === "milcondos"
            ? (currentView?.type === "model" ? "focused" : "focusedHidden")
            : (focusedProject ? "hidden" : "preview")
        }
        variants={{
          preview: {
            top: "35%",
            left: "35%",
            right: "auto",
            x: "0%",
            y: "-50%",
            scale: 1,
            opacity: 1,
          },
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
        }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: 'clamp(200px, 30vw, 350px)',
          height: 'clamp(200px, 30vw, 350px)',
        }}
        onClick={!focusedProject ? () => handleProjectClick("milcondos") : undefined}
        className={`absolute ${focusedProject === "milcondos" ? 'z-20' : 'z-0'} group ${!focusedProject ? 'cursor-pointer' : ''}`}
      >
        <div className={`w-full h-full transition-all duration-300 grayscale ${!focusedProject ? 'hover:invert' : ''}`}>
          <ModelPreview
            modelSrc="/assets/projects/le reseau/reseau-optimized.glb"
            interactive={focusedProject === "milcondos"}
          />
        </div>
        {!focusedProject && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="font-clash text-sm text-charcoal">Mil Condos</span>
          </div>
        )}
      </motion.div>

      {/* Focused Project UI - Title, Close, Navigation, Content Views */}
      <AnimatePresence>
        {focusedProject && (
          <>
            {/* Project Title & Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="fixed top-8 left-8 z-40"
            >
              <h1 className="font-clash text-2xl md:text-3xl font-semibold text-charcoal">
                {PROJECTS[focusedProject].name}
              </h1>
              <div className="font-clash text-xs text-charcoal/60 mt-3 space-y-0.5">
                {PROJECTS[focusedProject].subtitle.map((line: string, idx: number) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </motion.div>

            {/* Close Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="fixed top-8 right-8 z-50"
            >
              <CloseButton onClick={handleCloseProject} />
            </motion.div>

            {/* Text View Content */}
            <AnimatePresence mode="wait">
              {currentView?.type === "text" && (
                <motion.div
                  key="text-view"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="fixed inset-0 z-30 flex items-center justify-center px-8 py-24"
                >
                  <div className="max-w-3xl max-h-full overflow-y-auto scrollbar-hide">
                    <div className="columns-1 md:columns-2 gap-8 font-clash text-sm md:text-base leading-relaxed text-charcoal">
                      {currentView.content?.split('\n\n').map((paragraph: string, idx: number) => (
                        <p key={idx} className="mb-4 break-inside-avoid">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Gallery View Content */}
              {currentView?.type === "gallery" && (
                <motion.div
                  key="gallery-view"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="fixed inset-0 z-30 flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="font-clash text-2xl text-charcoal/50">Gallery</p>
                    <p className="font-clash text-sm text-charcoal/30 mt-2">Coming Soon</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation - only show if multiple views */}
            {totalViews > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-6"
              >
                {/* Previous Arrow */}
                <button
                  onClick={handlePrevView}
                  disabled={projectView === 0}
                  className={`w-10 h-10 flex items-center justify-center border border-charcoal/30 rounded-full transition-colors ${
                    projectView === 0
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:bg-charcoal hover:text-cream'
                  }`}
                  aria-label="Previous view"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* View Indicators */}
                <div className="flex gap-2">
                  {currentProject?.views.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setProjectView(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === projectView ? 'bg-charcoal' : 'bg-charcoal/30'
                      }`}
                      aria-label={`View ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Next Arrow */}
                <button
                  onClick={handleNextView}
                  disabled={projectView === totalViews - 1}
                  className={`w-10 h-10 flex items-center justify-center border border-charcoal/30 rounded-full transition-colors ${
                    projectView === totalViews - 1
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:bg-charcoal hover:text-cream'
                  }`}
                  aria-label="Next view"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      <SlidePanel activePanel={activePanel} onClose={handleClosePanel} />
    </main>
  );
}
