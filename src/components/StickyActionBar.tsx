import React from 'react';

interface StickyActionBarProps {
  children: React.ReactNode;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({ children }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background/90 to-transparent flex justify-center z-20 pointer-events-none">
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>
  );
};
