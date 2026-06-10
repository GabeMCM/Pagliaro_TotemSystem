import React, { useEffect } from 'react';
import { startEnvironment, stopEnvironment } from '../../lib/environment/engine';
import { SkyLayer, StarsLayer, CelestialLayer, MountainLayer, GrassLayer, CloudsLayer, TreeLayer, WindLayer, GroundLayer, FallingLeavesLayer } from './Layers';

export const EnvironmentLayer = () => {
  useEffect(() => {
    // Inicia o motor Singleton temporal independente
    startEnvironment();
    return () => stopEnvironment();
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[var(--background)] z-0">
      <SkyLayer />
      <StarsLayer />
      <CelestialLayer />
      
      {/* Marca d'água Logo Grande no "Céu" Global */}
      <div className="absolute top-10 md:top-0 left-1/2 -translate-x-1/2 opacity-50 md:opacity-40 pointer-events-none mix-blend-multiply w-full max-w-full flex justify-center px-6">
        <img 
          src="/media/imagens/logo_crop.png" 
          alt="" 
          className="w-full max-w-[500px] md:max-w-[1200px] h-auto object-contain" 
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
