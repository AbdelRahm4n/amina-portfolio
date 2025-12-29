"use client";

import { memo } from "react";

interface HeaderProps {
  onAboutClick: () => void;
  onContactClick: () => void;
}

export default memo(function Header({ onAboutClick, onContactClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-8 py-6 flex justify-between items-start">
      {/* Logo - top left */}
      <h1 className="font-clash text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-none">
        AB
      </h1>

      {/* Navigation - top right */}
      <nav className="flex gap-8 md:gap-12 pt-2">
        <button
          onClick={onAboutClick}
          className="font-clash text-base md:text-lg text-charcoal hover:opacity-50 transition-opacity duration-200"
        >
          About
        </button>
        <button
          onClick={onContactClick}
          className="font-clash text-base md:text-lg text-charcoal hover:opacity-50 transition-opacity duration-200"
        >
          Contact
        </button>
      </nav>
    </header>
  );
});
