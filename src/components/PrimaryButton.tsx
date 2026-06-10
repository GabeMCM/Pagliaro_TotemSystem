import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  disabled = false,
  icon = <ArrowRight className="w-5 h-5" />,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 md:gap-3 bg-primary text-primary-foreground px-6 md:px-12 py-4 md:py-5 rounded-full shadow-soft hover:brightness-105 active:scale-[0.99] transition-all duration-500 disabled:opacity-50 disabled:pointer-events-none text-base md:text-xl tracking-wide font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${className}`}
    >
      <span>{children}</span>
      {icon}
    </button>
  );
};
