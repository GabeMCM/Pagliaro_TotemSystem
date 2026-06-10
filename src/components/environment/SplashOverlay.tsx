import React, { useEffect, useState } from 'react';
import { CONFIG } from '../../data/config';
import { ENV_STATIC } from '../../data/environment-palette';
import { STRINGS } from '../../data/strings';

export const SplashOverlay = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % STRINGS.splash.messages.length);
    }, CONFIG.totem.splashRotationMs);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
        <div className="relative w-full max-w-5xl px-10">
          {STRINGS.splash.messages.map((msg, idx) => (
            <h2 
              key={idx}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 text-center font-serif text-5xl transition-all duration-[3000ms] ease-in-out ${
                idx === msgIndex 
                  ? 'opacity-100 scale-100 blur-0' 
                  : 'opacity-0 scale-95 blur-sm'
              }`}
              style={{ 
                color: ENV_STATIC.splash.textColor,
                textShadow: '0 4px 40px var(--ui-shadow), 0 2px 10px var(--ui-shadow), 0 0 4px var(--ui-shadow)',
                lineHeight: '1.4'
              }}
            >
              {msg}
            </h2>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-50">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-12 h-12 rounded-full border border-white/60 animate-ripple" style={{ animationDelay: '0s' }}></div>
          <div className="absolute w-12 h-12 rounded-full border border-white/60 animate-ripple" style={{ animationDelay: '1.5s' }}></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"></div>
        </div>
        <p 
          className="uppercase tracking-[0.4em] text-xs font-medium animate-float-slow"
          style={{ 
            color: ENV_STATIC.splash.textColor,
            opacity: 0.9, 
            textShadow: '0 2px 10px var(--ui-shadow), 0 0 4px var(--ui-shadow)' 
          }}
        >
          {STRINGS.splash.cta}
        </p>
      </div>
    </>
  );
};

