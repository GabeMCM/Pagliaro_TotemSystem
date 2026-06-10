import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TotemScreen } from '../components/TotemScreen'
import { StepBar } from '../components/StepBar'
import { useHomenagem } from '../lib/homenagem-store'
import { formatCurrency } from '../lib/utils'
import { StickyActionBar } from '../components/StickyActionBar'
import { PrimaryButton } from '../components/PrimaryButton'
import { STRINGS } from '../data/strings'
import { FlowGuard } from '../components/FlowGuard'

export const Route = createFileRoute('/pagamento')({
  component: () => (
    <FlowGuard require="both" fallback="/catalogo">
      <PagamentoPage />
    </FlowGuard>
  ),
})

const QRCodePlaceholder = () => {
  const cells = []
  for (let i = 0; i < 64; i++) {
    const isFilled = (i * 7 + (i % 5) + (i % 3)) % 3 === 0
    cells.push(
      <div 
        key={i} 
        className={`w-full h-full ${isFilled ? 'bg-primary' : 'bg-transparent'} rounded-sm`}
      />
    )
  }
  return (
    <div className="grid grid-cols-8 grid-rows-8 gap-1 w-48 h-48">
      {cells}
    </div>
  )
}

function PagamentoPage() {
  const navigate = useNavigate()
  const { homenagem, ong } = useHomenagem()

  if (!homenagem || !ong) {
    return null
  }


  return (
    <TotemScreen back="/instituicoes-escolha">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">
        <StepBar currentStep={2} />

        <div className="text-center mb-12 animate-gentle-fade">
          <h1 className="font-serif text-3xl md:text-4xl text-ui-text mb-3">{STRINGS.pagamento.titulo}</h1>
          <p className="text-taupe text-base md:text-lg">{STRINGS.pagamento.subtitulo}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center justify-center pb-32">
          
          <div className="flex flex-col items-center animate-rise" style={{ animationDelay: '100ms' }}>
            <div className="bg-card shadow-card p-6 rounded-3xl mb-6">
              <QRCodePlaceholder />
            </div>
            <p className="text-taupe uppercase tracking-widest text-xs mb-2">{STRINGS.pagamento.metodo}</p>
            <p className="font-serif text-3xl md:text-4xl text-primary">{formatCurrency(homenagem.valor)}</p>
          </div>

          <div className="w-full md:w-96 bg-muted/60 p-6 md:p-8 rounded-3xl animate-rise" style={{ animationDelay: '200ms' }}>
            <h3 className="font-serif text-xl md:text-2xl text-ui-text mb-6">{STRINGS.pagamento.resumo}</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-taupe text-sm uppercase tracking-wider mb-1">{STRINGS.pagamento.gesto}</p>
                <p className="text-lg text-ui-text">{homenagem.nome}</p>
              </div>
              
              <div className="h-px w-full bg-border/50" />
              
              <div>
                <p className="text-taupe text-sm uppercase tracking-wider mb-1">{STRINGS.pagamento.destino}</p>
                <p className="text-lg text-primary/90">{ong.nome}</p>
                <p className="text-taupe text-sm mt-1">{ong.causa}</p>
              </div>
            </div>
          </div>

        </div>

        <StickyActionBar>
          <PrimaryButton
            onClick={() => navigate({ to: '/confirmacao' })}
          >
            {STRINGS.pagamento.botao}
          </PrimaryButton>
        </StickyActionBar>
      </div>
    </TotemScreen>
  )
}

