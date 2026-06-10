import React from 'react';
import { Navigate } from '@tanstack/react-router';
import { useHomenagem } from '../lib/homenagem-store';

interface FlowGuardProps {
  children: React.ReactNode;
  require: 'homenagem' | 'both';
  fallback?: string;
}

export const FlowGuard: React.FC<FlowGuardProps> = ({ children, require, fallback = '/' }) => {
  const { homenagem, ong } = useHomenagem();

  if (require === 'homenagem' && !homenagem) {
    return <Navigate to={fallback} />;
  }

  if (require === 'both' && (!homenagem || !ong)) {
    return <Navigate to={fallback} />;
  }

  return <>{children}</>;
};
