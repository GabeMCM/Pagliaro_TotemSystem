import React from 'react';
import { Link } from '@tanstack/react-router';

interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  animationDelay?: string;
  className?: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  onClick,
  to,
  animationDelay,
  className = '',
}) => {
  const baseClass = `group rounded-3xl border border-border/70 bg-card/80 shadow-soft backdrop-blur hover:-translate-y-1.5 hover:shadow-card transition-all duration-500 animate-rise focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 overflow-hidden ${className}`;
  const style = animationDelay ? { animationDelay } : undefined;

  if (to) {
    return (
      <Link to={to} className={baseClass} style={style}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={baseClass} style={style}>
        {children}
      </button>
    );
  }

  return (
    <div className={baseClass} style={style}>
      {children}
    </div>
  );
};
