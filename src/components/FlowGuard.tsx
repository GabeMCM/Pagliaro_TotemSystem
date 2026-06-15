"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHomenagem } from '../lib/homenagem-store';

interface FlowGuardProps {
  children: React.ReactNode;
  require: 'homenagem' | 'both';
  fallback?: string;
}

export const FlowGuard: React.FC<FlowGuardProps> = ({ children, require, fallback = '/' }) => {
  const { homenagem, ong } = useHomenagem();
  const router = useRouter();

  const isMissingHomenagem = require === 'homenagem' && !homenagem;
  const isMissingBoth = require === 'both' && (!homenagem || !ong);
  const shouldRedirect = isMissingHomenagem || isMissingBoth;

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(fallback);
    }
  }, [shouldRedirect, router, fallback]);

  if (shouldRedirect) {
    return null; // Return nothing while redirecting
  }

  return <>{children}</>;
};
