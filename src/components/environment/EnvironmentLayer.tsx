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
