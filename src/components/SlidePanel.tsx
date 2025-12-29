"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ABOUT_CONTENT, CONTACT_CONTENT } from "@/src/lib/config";
import CloseButton from "./CloseButton";

type PanelType = "about" | "contact" | null;

interface SlidePanelProps {
  activePanel: PanelType;
  onClose: () => void;
}

export default function SlidePanel({ activePanel, onClose }: SlidePanelProps) {
  const content = activePanel === "about" ? ABOUT_CONTENT : CONTACT_CONTENT;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activePanel) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePanel, onClose]);

  return (
    <AnimatePresence>
      {activePanel && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[480px] px-12 py-16 z-50 flex flex-col justify-center bg-cream"
          >
            <CloseButton onClick={onClose} className="absolute top-8 right-8" />

            <div className="text-charcoal">
              <h2 className="font-clash text-3xl font-semibold mb-8">{content.title}</h2>

              {activePanel === "about" && (
                <div className="space-y-5">
                  {ABOUT_CONTENT.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-lg leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {activePanel === "contact" && (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm mb-1 opacity-50">Email</p>
                    <a
                      href={`mailto:${CONTACT_CONTENT.email}`}
                      className="text-lg hover:opacity-60 transition-opacity"
                    >
                      {CONTACT_CONTENT.email}
                    </a>
                  </div>

                  <div>
                    <p className="text-sm mb-1 opacity-50">Location</p>
                    <p className="text-lg">{CONTACT_CONTENT.location}</p>
                  </div>

                  <div>
                    <p className="text-sm mb-1 opacity-50">Social</p>
                    <div className="flex gap-4">
                      {CONTACT_CONTENT.social.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          className="text-lg hover:opacity-60 transition-opacity"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
