"use client";

import React, { useEffect } from 'react';
import { startEnvironment, stopEnvironment } from '../../lib/environment/engine';
import { EnvironmentCanvas } from './EnvironmentCanvas';

export const EnvironmentLayer = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Inicia o motor Singleton temporal independente
    startEnvironment();
    return () => stopEnvironment();
  }, []);

  if (!isMounted) return <div className="absolute inset-0 bg-[var(--background)] z-0" />;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[var(--background)] z-0">
      <EnvironmentCanvas />
      
      {/* Marca d'água Logo Grande no "Céu" Global - Unificada */}
      <div 
        className="absolute top-24 md:top-20 left-1/2 -translate-x-1/2 pointer-events-none w-full max-w-full flex justify-center px-6"
        style={{ opacity: 0.18 }}
      >
        <img 
          src="/media/brand/logo_crop.png" 
          alt="" 
          className="w-full max-w-[32rem] md:max-w-[75rem] h-auto object-contain transition-all duration-[3000ms]" 
          style={{ 
            filter: 'var(--night-opacity) > 0.5 ? drop-shadow(0 0 15px rgba(255,255,255,0.3)) : none' 
          }}
        />
      </div>

    </div>
  );
};
