import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { TotemScreen } from '../components/TotemScreen'
import { StepBar } from '../components/StepBar'
import { useHomenagem } from '../lib/homenagem-store'
import { instituicoes as ongsData } from '../data/instituicoes'
import { StickyActionBar } from '../components/StickyActionBar'
import { PrimaryButton } from '../components/PrimaryButton'
import { STRINGS } from '../data/strings'

export const Route = createFileRoute('/instituicoes-escolha')({
  component: InstituicoesEscolhaPage,
})

function InstituicoesEscolhaPage() {
  const navigate = useNavigate()
  const { ong: selectedOng, setOng } = useHomenagem()
  const ongs = ongsData

  const handleSelect = (ong: import('../data/catalogo').Ong) => {
    setOng(ong)
  }

  return (
    <TotemScreen back="/catalogo">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">
        <StepBar currentStep={2} />

        <div className="text-center mb-12 animate-gentle-fade">
          <h1 className="font-serif text-4xl text-ui-text mb-3">{STRINGS.escolha.titulo}</h1>
          <p className="text-taupe text-lg">{STRINGS.escolha.subtitulo}</p>
        </div>

        <div className="flex flex-col gap-6 pb-32">
          {ongs.map((ong, i) => {
            const isSelected = selectedOng?.id === ong.id
            return (
              <button
                key={ong.id}
                onClick={() => handleSelect(ong)}
                className={`flex items-start gap-6 p-6 rounded-3xl border text-left bg-card/80 shadow-soft backdrop-blur transition-all duration-500 animate-rise group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${isSelected
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border/70 hover:-translate-y-1 hover:shadow-card'
                  }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${isSelected ? 'bg-primary text-primary-foreground' : 'border-2 border-border text-transparent'
                  }`}>
                  <Check className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-serif text-ui-text">{ong.nome}</h2>
                    <span className="text-primary/80 font-semibold tracking-wide text-sm bg-primary/10 px-3 py-1 rounded-full">
                      {ong.causa}
                    </span>
                  </div>
                  <p className="text-taupe">{ong.descricao}</p>
                </div>
              </button>
            )
          })}
        </div>

        <StickyActionBar>
          <PrimaryButton
            onClick={() => navigate({ to: '/pagamento' })}
            disabled={!selectedOng}
          >
            {STRINGS.escolha.continuar}
          </PrimaryButton>
        </StickyActionBar>
      </div>
    </TotemScreen>
  )
}

