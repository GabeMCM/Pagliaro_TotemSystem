import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { FadeImage } from './FadeImage';

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-gentle-fade"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors z-[101] backdrop-blur"
      >
        <X className="w-6 h-6" />
      </button>
      <div 
        className="relative w-full max-w-5xl h-full max-h-[85vh] flex items-center justify-center animate-rise"
        onClick={e => e.stopPropagation()}
      >
        <FadeImage 
          src={src} 
          alt={alt} 
          className="max-w-full max-h-full object-contain"
          style={{ clipPath: 'inset(0 0 10% 0 round 2rem)' }}
        />
      </div>
    </div>
  );
}
