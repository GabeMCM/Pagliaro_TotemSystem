import React from 'react';

interface StickyActionBarProps {
  children: React.ReactNode;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({ children }) => {
  return (
    <div className="sticky bottom-0 mt-8 pt-8 pb-6 md:pb-10 -mx-5 px-5 md:-mx-10 md:px-10 z-20 flex justify-center bg-gradient-to-t from-[#E9E4DB]/95 via-[#E9E4DB]/80 to-transparent pointer-events-none">
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>
  );
};
