import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TotemScreen } from '../components/TotemScreen'
import { StepBar } from '../components/StepBar'
import { useHomenagem } from '../lib/homenagem-store'
import { homenagens } from '../data/homenagens'
import { ModeloHomenagem } from '../data/catalogo'
import { InteractiveCard } from '../components/InteractiveCard'
import { STRINGS } from '../data/strings'

export const Route = createFileRoute('/colecao/$categoria')({
  component: ColecaoPage,
})

function ColecaoPage() {
  const { categoria } = Route.useParams()
  const navigate = useNavigate()
  const { setHomenagem, setModelo } = useHomenagem()

  const homenagem = homenagens.find(h => h.id === categoria && h.ativo !== false)


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
    if (homenagem.requerFotos) {
      navigate({ to: '/painel' })
    } else {
      navigate({ to: '/instituicoes-escolha' })
    }
  }

  return (
    <TotemScreen back="/catalogo">
      <div className="max-w-5xl mx-auto w-full flex flex-col flex-1">
        <StepBar currentStep={0} />
        
        <div className="text-center mb-12 animate-gentle-fade">
          <h1 className="font-serif text-4xl text-ui-text mb-3">
            {STRINGS.colecao.tituloPrefix} {homenagem.nome}
          </h1>
          <p className="text-taupe">{STRINGS.colecao.subtitulo}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
          {homenagem.modelos?.map((m, i) => (
            <InteractiveCard
              key={m.id}
              onClick={() => handleSelect(m)}
              animationDelay={`${i * 100}ms`}
            >
              <div className={`${homenagem.id === 'coroa-memorial' ? 'aspect-[4/3]' : 'aspect-square'} w-full bg-muted/30 overflow-hidden relative`}>
                {m.imagem ? (
                  <img 
                    src={m.imagem} 
                    alt={m.nome} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-primary/10 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center text-taupe/40 font-serif text-xl">
                    {m.nome}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="font-serif text-2xl text-ui-text mb-2">{m.nome}</h3>
                {m.descricao && <p className="text-taupe text-sm mb-4">{m.descricao}</p>}
                
                <div className="text-primary text-sm tracking-wide flex items-center transition-transform duration-500 group-hover:translate-x-1">
                  {STRINGS.colecao.selecionar}
                </div>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </div>
    </TotemScreen>
  )
}

