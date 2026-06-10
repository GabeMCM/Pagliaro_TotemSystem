import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Botanical } from './Botanical';

interface TotemScreenProps {
  children: React.ReactNode;
  back?: string;
  showHome?: boolean;
}

export const TotemScreen = ({ children, back, showHome = true }: TotemScreenProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-0 md:p-10 pointer-events-none z-50">
      
      {/* O "Modal" de Vidro que contém o site */}
      <div 
        className="relative w-full h-full backdrop-blur-xl border border-white/40 shadow-[0_30px_100px_rgba(0,0,0,0.3)] rounded-none md:rounded-[3rem] flex flex-col font-sans text-taupe overflow-hidden pointer-events-auto transition-colors duration-1000"
        style={{ backgroundColor: 'var(--ui-glass)' }}
      >
        {/* Marca d'agua botânica dentro do modal para manter a elegância */}
        <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply">
          <Botanical />
        </div>
        
        <header className="z-10 px-5 md:px-10 pt-5 md:pt-8 flex items-center justify-between">
          <div className="flex-1">
            {back ? (
              <Link 
                to={back as any} 
                className="inline-flex items-center gap-2 md:gap-3 py-4 px-2 -ml-2 text-ui-text hover:text-primary transition-colors duration-500 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-6 h-6" />
                <span className="text-lg tracking-wide font-medium">Voltar</span>
              </Link>
            ) : (
              <span className="font-serif text-2xl md:text-3xl text-ui-text tracking-wide">Culto da Saudade</span>
            )}
          </div>
          
          {showHome && (
            <div className="flex-1 flex justify-end">
              <Link 
                to="/inicio" 
                className="py-4 px-3 md:px-6 text-ui-text font-medium hover:text-primary transition-colors duration-500 uppercase tracking-widest text-xs md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Início
              </Link>
            </div>
          )}
        </header>

        <main className="flex flex-col flex-1 px-5 md:px-10 py-6 md:py-8 z-10 relative overflow-y-auto overscroll-contain scrollbar-hide">
          <div className="flex flex-col flex-1 min-h-max pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
