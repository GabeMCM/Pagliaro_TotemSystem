"use client";

import React, { useEffect } from 'react';
import { startEnvironment, stopEnvironment } from '../../lib/environment/engine';
import { SkyLayer, StarsLayer, CelestialLayer, MountainLayer, GrassLayer, CloudsLayer, TreeLayer, WindLayer, GroundLayer, FallingLeavesLayer } from './Layers';

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
      <SkyLayer />
      <StarsLayer />
      <CelestialLayer />
      
      {/* Marca d'água Logo Grande no "Céu" Global - Versão DIA */}
      <div 
        className="absolute top-10 md:top-0 left-1/2 -translate-x-1/2 pointer-events-none mix-blend-multiply w-full max-w-full flex justify-center px-6"
        style={{ opacity: 'calc(0.4 * (1 - var(--night-opacity)))' }}
      >
        <img 
          src="/media/brand/logo_crop.png" 
          alt="" 
          className="w-full max-w-[32rem] md:max-w-[75rem] h-auto object-contain" 
        />
      </div>

      {/* Marca d'água Logo Grande no "Céu" Global - Versão NOITE */}
      <div 
        className="absolute top-10 md:top-0 left-1/2 -translate-x-1/2 pointer-events-none mix-blend-screen w-full max-w-full flex justify-center px-6"
        style={{ opacity: 'calc(0.25 * var(--night-opacity))' }}
      >
        <img 
          src="/media/brand/logo_crop.png" 
          alt="" 
          className="w-full max-w-[32rem] md:max-w-[75rem] h-auto object-contain invert drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
        />
      </div>

      <MountainLayer />
      <CloudsLayer />
      <TreeLayer />
      <GroundLayer />
      <GrassLayer />
      <FallingLeavesLayer />
      <WindLayer />
      
    </div>
  );
};
