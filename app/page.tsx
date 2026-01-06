"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/src/components/Header";
import SlidePanel from "@/src/components/SlidePanel";
import CloseButton from "@/src/components/CloseButton";
import ProjectCard from "@/src/components/ProjectCard";
import { PROJECTS, ProjectId, Project } from "@/src/lib/config";

type PanelType = "about" | "contact" | null;

// Hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [focusedProject, setFocusedProject] = useState<ProjectId | null>(null);
  const [projectView, setProjectView] = useState(0);

  // Sync URL to state on mount and URL changes
  useEffect(() => {
    const projectParam = searchParams.get("project") as ProjectId | null;
    if (projectParam && PROJECTS.find((p) => p.id === projectParam)) {
      setFocusedProject(projectParam);
      setProjectView(0);
    } else {
      setFocusedProject(null);
      setProjectView(0);
    }
  }, [searchParams]);

  const handleAboutClick = () => setActivePanel("about");
  const handleContactClick = () => setActivePanel("contact");
  const handleClosePanel = () => setActivePanel(null);

  const handleProjectClick = useCallback(
    (projectId: ProjectId) => {
      router.push(`/?project=${projectId}`, { scroll: false });
    },
    [router]
  );

  const handleCloseProject = useCallback(() => {
    router.push("/", { scroll: false });
  }, [router]);

  const currentProject = focusedProject
    ? PROJECTS.find((p) => p.id === focusedProject)
    : null;
  const totalViews = currentProject?.views.length || 1;
  const currentView = currentProject?.views[projectView];

  const handleNextView = () =>
    setProjectView((prev) => Math.min(prev + 1, totalViews - 1));
  const handlePrevView = () => setProjectView((prev) => Math.max(0, prev - 1));

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const projectParam = params.get("project") as ProjectId | null;
      if (projectParam && PROJECTS.find((p) => p.id === projectParam)) {
        setFocusedProject(projectParam);
        setProjectView(0);
      } else {
        setFocusedProject(null);
        setProjectView(0);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-cream">
      {/* Header - hidden when project is focused */}
      <motion.div
        animate={{
          opacity: focusedProject ? 0 : 1,
          pointerEvents: focusedProject ? "none" : "auto",
        }}
        transition={{ duration: 0.3 }}
      >
        <Header
          onAboutClick={handleAboutClick}
          onContactClick={handleContactClick}
        />
      </motion.div>

      {/* Projects Container */}
      {isMobile ? (
        // Mobile: Vertical stack layout
        <div className="flex flex-col items-center gap-8 pt-24 pb-16 px-4">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              isFocused={focusedProject === project.id}
              isAnyFocused={!!focusedProject}
              currentView={
                focusedProject === project.id ? currentView : undefined
              }
              onClick={() => handleProjectClick(project.id)}
              isMobile={true}
              index={index}
            />
          ))}
        </div>
      ) : (
        // Desktop: Artistic scattered layout (preserved)
        <div className="relative h-screen w-full">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              isFocused={focusedProject === project.id}
              isAnyFocused={!!focusedProject}
              currentView={
                focusedProject === project.id ? currentView : undefined
              }
              onClick={() => handleProjectClick(project.id)}
              isMobile={false}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Focused Project UI - Title, Close, Navigation, Content Views */}
      <AnimatePresence>
        {focusedProject && currentProject && (
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
                {currentProject.name}
              </h1>
              <div className="font-clash text-xs text-charcoal/60 mt-3 space-y-0.5">
                {currentProject.subtitle.map((line, idx) => (
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="fixed inset-0 z-30 pt-44 pb-24 px-8 md:px-16 overflow-y-auto"
                >
                  <div className="max-w-xl mx-auto">
                    {currentView.content?.split("\n\n").map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="mb-5 text-sm leading-relaxed text-charcoal/60"
                        style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 400 }}
                      >
                        {paragraph}
                      </p>
                    ))}
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
                    <p className="font-clash text-2xl text-charcoal/50">
                      Gallery
                    </p>
                    <p className="font-clash text-sm text-charcoal/30 mt-2">
                      Coming Soon
                    </p>
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
                  className={`w-10 h-10 flex items-center justify-center border border-charcoal/30 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal ${
                    projectView === 0
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-charcoal hover:text-cream"
                  }`}
                  aria-label="Previous view"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* View Indicators */}
                <div className="flex gap-2">
                  {currentProject.views.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setProjectView(idx)}
                      className={`w-2 h-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 ${
                        idx === projectView ? "bg-charcoal" : "bg-charcoal/30"
                      }`}
                      aria-label={`View ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Next Arrow */}
                <button
                  onClick={handleNextView}
                  disabled={projectView === totalViews - 1}
                  className={`w-10 h-10 flex items-center justify-center border border-charcoal/30 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal ${
                    projectView === totalViews - 1
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-charcoal hover:text-cream"
                  }`}
                  aria-label="Next view"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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

// Wrap in Suspense for useSearchParams
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-cream">
          <div className="w-10 h-10 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
