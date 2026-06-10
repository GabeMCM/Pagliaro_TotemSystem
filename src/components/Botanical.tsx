import React from 'react';

export const Botanical = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-30 mix-blend-multiply">
    {/* Forma orgânica silenciosa - Placeholder para Botanical */}
    <svg viewBox="0 0 800 800" className="w-[120%] h-[120%] text-taupe animate-float-slow" fill="currentColor">
      <path d="M 400 100 C 600 100, 700 300, 700 500 C 700 700, 500 700, 400 700 C 300 700, 100 700, 100 500 C 100 300, 200 100, 400 100 Z" opacity="0.05" />
    </svg>
  </div>
);
