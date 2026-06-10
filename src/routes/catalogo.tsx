import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TotemScreen } from '../components/TotemScreen'
import { StepBar } from '../components/StepBar'
import { Homenagem } from '../data/catalogo'
import { homenagens } from '../data/homenagens'
import { useHomenagem } from '../lib/homenagem-store'
import { InteractiveCard } from '../components/InteractiveCard'
import { STRINGS } from '../data/strings'

export const Route = createFileRoute('/catalogo')({
  component: CatalogoPage,
})

function CatalogoPage() {
  const navigate = useNavigate()
  const { setHomenagem } = useHomenagem()

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
          <h1 className="font-serif text-4xl text-ui-text mb-3">{STRINGS.catalogo.titulo}</h1>
          <p className="text-taupe">{STRINGS.catalogo.subtitulo}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
          {homenagens.filter(h => h.ativo !== false).map((h, i) => (
            <InteractiveCard
              key={h.id}
              onClick={() => handleSelect(h)}
              animationDelay={`${i * 100}ms`}
            >
              <div className="aspect-[4/3] w-full bg-muted/30 overflow-hidden relative">
                {h.imagem ? (
                  <img 
                    src={h.imagem} 
                    alt={h.nome} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-primary/10 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center text-taupe/40 font-serif text-xl">
                    {h.nome}
                  </div>
                )}
              </div>
              
              <div className="p-6 pb-8">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif text-2xl text-ui-text">{h.nome}</h3>
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
    </TotemScreen>
  )
}

