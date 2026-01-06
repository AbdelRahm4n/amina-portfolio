"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ABOUT_CONTENT, CONTACT_CONTENT } from "@/src/lib/config";
import CloseButton from "./CloseButton";

type PanelType = "about" | "contact" | null;

interface SlidePanelProps {
  activePanel: PanelType;
  onClose: () => void;
}

// Replace with your Formspree form ID from https://formspree.io
const FORMSPREE_ID = "mpqwgqqr";

export default function SlidePanel({ activePanel, onClose }: SlidePanelProps) {
  const content = activePanel === "about" ? ABOUT_CONTENT : CONTACT_CONTENT;
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activePanel) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePanel, onClose]);

  // Reset form when panel closes
  useEffect(() => {
    if (!activePanel) {
      setFormState("idle");
      setFormData({ name: "", email: "", message: "" });
    }
  }, [activePanel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setFormState("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

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
            className="fixed right-0 top-0 h-full w-full md:w-[520px] px-8 md:px-12 py-16 z-50 flex flex-col justify-center bg-cream overflow-y-auto"
          >
            <CloseButton onClick={onClose} className="absolute top-8 right-8" />

            <div className="text-charcoal max-w-md">
              <h2 className="font-clash text-4xl md:text-5xl font-semibold mb-12">
                {content.title}
              </h2>

              {activePanel === "about" && (
                <div className="space-y-10">
                  {ABOUT_CONTENT.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm md:text-base leading-[2] font-light"
                      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {activePanel === "contact" && (
                <div className="space-y-8">
                  {formState === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <p className="text-2xl font-clash font-semibold mb-2">
                        Message sent!
                      </p>
                      <p className="text-charcoal/60">
                        Thank you for reaching out. I&apos;ll get back to you soon.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm mb-2 opacity-60 font-clash"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-transparent border border-charcoal/20 rounded-lg focus:outline-none focus:border-charcoal transition-colors font-clash"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm mb-2 opacity-60 font-clash"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-transparent border border-charcoal/20 rounded-lg focus:outline-none focus:border-charcoal transition-colors font-clash"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm mb-2 opacity-60 font-clash"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-transparent border border-charcoal/20 rounded-lg focus:outline-none focus:border-charcoal transition-colors resize-none font-clash"
                        />
                      </div>

                      {formState === "error" && (
                        <p className="text-red-600 text-sm">
                          Something went wrong. Please try again or email directly.
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={formState === "submitting"}
                        className="w-full py-4 bg-charcoal text-cream font-clash font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formState === "submitting" ? "Sending..." : "Send Message"}
                      </button>
                    </form>
                  )}

                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
