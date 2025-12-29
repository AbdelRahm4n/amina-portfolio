"use client";

import { memo } from "react";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export default memo(function CloseButton({ onClick, className = "" }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-charcoal hover:opacity-60 transition-opacity ${className}`}
      aria-label="Close"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
});
