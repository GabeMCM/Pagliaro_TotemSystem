"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { TotemScreen } from '../../../components/TotemScreen';
import { StepBar } from '../../../components/StepBar';
import { useHomenagem } from '../../../lib/homenagem-store';
import { Homenagem, ModeloHomenagem } from '../../../data/catalogo';
import { InteractiveCard } from '../../../components/InteractiveCard';
import { FadeImage } from '../../../components/FadeImage';
import { ImageLightbox } from '../../../components/ImageLightbox';
import { STRINGS } from '../../../data/strings';
import { formatCurrency } from '../../../lib/utils';

export default function ColecaoClient({ homenagem }: { homenagem: Homenagem | null }) {
  const navigate = useRouter()
  const { setHomenagem, setModelo } = useHomenagem()
  const [expandedImage, setExpandedImage] = useState<{src: string, alt: string} | null>(null)

  if (!homenagem) {
    return (
      <TotemScreen back="/catalogo">
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-taupe text-xl">{STRINGS.errors.colecaoIndisponivel}</p>
        </div>
      </TotemScreen>
    )
  }

  const handleSelect = (m: ModeloHomenagem) => {
    setHomenagem(homenagem)
    setModelo(m)
    
    // Se for coroa memorial, vai para a página de Faixa
    if (homenagem.id === 'coroa-memorial') {
      navigate.push('/faixa')
    } else if (homenagem.requerFotos) {
      navigate.push('/painel')
    } else {
      navigate.push('/instituicoes-escolha')
    }
  }

  return (
    <TotemScreen back="/catalogo">
      <div className="max-w-5xl mx-auto w-full flex flex-col flex-1">
        <StepBar currentStep={0} />
        
        <div className="text-center mb-12 animate-gentle-fade">
          <h1 className="font-serif text-3xl md:text-4xl text-ui-text mb-3">
            {STRINGS.colecao.tituloPrefix} {homenagem.nome}
          </h1>
          <p className="text-taupe">{STRINGS.colecao.subtitulo}</p>
        </div>

        <div className="grid grid-cols-1 portrait:md:grid-cols-2 landscape:md:grid-cols-2 landscape:lg:grid-cols-3 landscape:xl:grid-cols-4 gap-6 md:gap-10 max-w-7xl mx-auto w-full">
          {homenagem.modelos?.map((m, i) => (
            <InteractiveCard
              key={m.id}
              onClick={() => handleSelect(m)}
              animationDelay={`${i * 100}ms`}
            >
              <div className={`${homenagem.id === 'coroa-memorial' ? 'aspect-[4/3]' : 'aspect-square'} w-full bg-muted/30 overflow-hidden relative group/img`}>
                {m.imagem ? (
                  <>
                    <FadeImage 
                      src={m.imagem} 
                      alt={m.nome} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedImage({ src: m.imagem!, alt: m.nome });
                      }}
                      className="absolute bottom-4 right-4 bg-background/90 text-primary p-3 rounded-full md:opacity-0 md:translate-y-2 md:group-hover/img:opacity-100 md:group-hover/img:translate-y-0 transition-all duration-300 shadow-soft hover:bg-background z-10"
                      aria-label="Expandir imagem"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-primary/10 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center text-taupe/40 font-serif text-xl">
                    {m.nome}
                  </div>
                )}
              </div>
              
              <div className="px-5 py-4 flex items-center justify-between border-t border-border/30 bg-background/40">
                <span className="text-sm uppercase text-ui-text/80 truncate pr-4">
                  {m.nome || homenagem.nome}
                </span>
                <span className="text-primary/70 text-sm font-medium uppercase whitespace-nowrap">
                  {formatCurrency(m.valor ?? homenagem.valor)}
                </span>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </div>

      {expandedImage && (
        <ImageLightbox 
          src={expandedImage.src} 
          alt={expandedImage.alt} 
          onClose={() => setExpandedImage(null)} 
        />
      )}
    </TotemScreen>
  )
}
