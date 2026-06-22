"use client";

import React, { useEffect, useRef } from 'react';
import { startCanvas, stopCanvas } from '../../lib/environment/canvasEngine';

export const EnvironmentCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      startCanvas(canvasRef.current);
    }
    return () => {
      stopCanvas();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: 'block' }}
    />
  );
};
