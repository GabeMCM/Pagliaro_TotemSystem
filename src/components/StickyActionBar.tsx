import React from 'react';

interface StickyActionBarProps {
  children: React.ReactNode;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({ children }) => {
  return (
    <div className="mt-auto sticky bottom-0 pt-8 pb-6 md:pb-10 -mx-5 px-5 md:-mx-10 md:px-10 z-20 flex justify-center bg-gradient-to-t from-card/90 via-card/60 to-transparent pointer-events-none">
      <div className="absolute top-full left-0 right-0 h-[150px] bg-card/90" />
      <div className="pointer-events-auto relative z-10">
        {children}
      </div>
    </div>
  );
};
