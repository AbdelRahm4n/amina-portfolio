"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  onAboutClick: () => void;
  onContactClick: () => void;
}

export default memo(function Header({ onAboutClick, onContactClick }: HeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-8 py-6 flex justify-between items-start">
      {/* Animated Logo */}
      <motion.div
        className="relative cursor-pointer overflow-hidden"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h1 className="font-clash text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-none flex">
          {/* A */}
          <span>A</span>

          {/* mina - expands after A */}
          <motion.span
            initial={false}
            animate={{
              width: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden whitespace-nowrap"
          >
            mina
          </motion.span>

          {/* Space between first and last name */}
          <motion.span
            initial={false}
            animate={{
              width: isExpanded ? "0.3em" : 0,
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* B - always visible but moves */}
          <motion.span
            initial={false}
            animate={{
              opacity: isExpanded ? 0 : 1,
              width: isExpanded ? 0 : "auto",
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            B
          </motion.span>

          {/* Elbattawy - expands to replace B */}
          <motion.span
            initial={false}
            animate={{
              width: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: isExpanded ? 0.1 : 0 }}
            className="overflow-hidden whitespace-nowrap"
          >
            Elbattawy
          </motion.span>
        </h1>
      </motion.div>

      {/* Navigation - top right */}
      <nav className="flex gap-8 md:gap-12 pt-2">
        <button
          onClick={onAboutClick}
          className="font-clash text-base md:text-lg text-charcoal hover:opacity-60 transition-opacity duration-200 focus:outline-none focus-visible:underline"
        >
          About
        </button>
        <button
          onClick={onContactClick}
          className="font-clash text-base md:text-lg text-charcoal hover:opacity-60 transition-opacity duration-200 focus:outline-none focus-visible:underline"
        >
          Contact
        </button>
      </nav>
    </header>
  );
});
