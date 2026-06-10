import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TotemScreen } from '../components/TotemScreen'
import { StepBar } from '../components/StepBar'
import { Homenagem } from '../data/catalogo'
import { homenagens } from '../data/homenagens'
import { useHomenagem } from '../lib/homenagem-store'
import { useState } from 'react'
import { Maximize2 } from 'lucide-react'
import { InteractiveCard } from '../components/InteractiveCard'
import { FadeImage } from '../components/FadeImage'
import { ImageLightbox } from '../components/ImageLightbox'
import { STRINGS } from '../data/strings'

export const Route = createFileRoute('/catalogo')({
  component: CatalogoPage,
})

function CatalogoPage() {
  const navigate = useNavigate()
  const { setHomenagem } = useHomenagem()
  const [expandedImage, setExpandedImage] = useState<{src: string, alt: string} | null>(null)

  const handleSelect = (h: Homenagem) => {
    if (h.modelos && h.modelos.length > 0) {
      // Vai para a coleção se houver modelos
      navigate({ to: `/colecao/${h.id}` })
    } else {
      setHomenagem(h)
      if (h.requerFotos) {
        navigate({ to: '/painel' })
      } else {
        navigate({ to: '/instituicoes-escolha' })
      }
    }
  }

  return (
    <TotemScreen back="/inicio">
      <div className="max-w-5xl mx-auto w-full flex flex-col flex-1">
        <StepBar currentStep={0} />
        
        <div className="text-center mb-12 animate-gentle-fade">
          <h1 className="font-serif text-3xl md:text-4xl text-ui-text mb-3">{STRINGS.catalogo.titulo}</h1>
          <p className="text-taupe">{STRINGS.catalogo.subtitulo}</p>
        </div>

        <div className="grid grid-cols-1 portrait:md:grid-cols-2 landscape:md:grid-cols-2 landscape:lg:grid-cols-3 landscape:xl:grid-cols-4 gap-6 md:gap-10 max-w-7xl mx-auto w-full">
          {homenagens.filter(h => h.ativo !== false).map((h, i) => (
            <InteractiveCard
              key={h.id}
              onClick={() => handleSelect(h)}
              animationDelay={`${i * 100}ms`}
            >
              <div className="aspect-[4/3] w-full bg-muted/30 overflow-hidden relative group/img">
                {h.imagem ? (
                  <>
                    <FadeImage 
                      src={h.imagem} 
                      alt={h.nome} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedImage({ src: h.imagem!, alt: h.nome });
                      }}
                      className="absolute bottom-4 right-4 bg-background/90 text-primary p-3 rounded-full md:opacity-0 md:translate-y-2 md:group-hover/img:opacity-100 md:group-hover/img:translate-y-0 transition-all duration-300 shadow-soft hover:bg-background z-10"
                      aria-label="Expandir imagem"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-primary/10 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center text-taupe/40 font-serif text-xl">
                    {h.nome}
                  </div>
                )}
              </div>
              
              <div className="p-4 pb-6 md:p-6 md:pb-8">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif text-xl md:text-2xl text-ui-text">{h.nome}</h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                    {h.faixa}
                  </span>
                </div>
                <p className="text-taupe text-sm mb-6">{h.descricao}</p>
                
                <div className="text-primary text-sm tracking-wide flex items-center transition-transform duration-500 group-hover:translate-x-1">
                  {h.modelos?.length ? STRINGS.catalogo.verModelos : STRINGS.catalogo.selecionar}
                </div>
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

