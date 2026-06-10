import React, { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Flower } from 'lucide-react'
import { TotemScreen } from '../components/TotemScreen'
import { useHomenagem } from '../lib/homenagem-store'
import { CONFIG } from '../data/config'
import { STRINGS } from '../data/strings'
import { FlowGuard } from '../components/FlowGuard'

export const Route = createFileRoute('/confirmacao')({
  component: () => (
    <FlowGuard require="both" fallback="/">
      <ConfirmacaoPage />
    </FlowGuard>
  ),
})

function ConfirmacaoPage() {
  const navigate = useNavigate()
  const { homenagem, modelo, fotos, ong, frase, reset } = useHomenagem()

  if (!homenagem || !ong) {
    return null
  }

  const hasFotos = homenagem.requerFotos && fotos.length > 0

  useEffect(() => {
    // Auto reset configurável
    const timer = setTimeout(() => {
      reset()
      navigate({ to: '/' })
    }, CONFIG.totem.autoResetMs)

    return () => clearTimeout(timer)
  }, [reset, navigate])

  const handleConcluir = () => {
    reset()
    navigate({ to: '/' })
  }

  return (
    <TotemScreen showHome={false}>
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full pb-20">
        
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-10 animate-float-slow">
          <Flower className="w-12 h-12" />
        </div>

        <div className="text-center mb-12 animate-gentle-fade">
          <h1 className="font-serif text-3xl md:text-5xl text-ui-text mb-6">
            {STRINGS.confirmacao.titulo}
          </h1>
          <p className="text-taupe text-xl">
            {hasFotos 
              ? STRINGS.confirmacao.comFotos
              : STRINGS.confirmacao.semFotos
            }
          </p>
        </div>

        <div className="w-full bg-card/80 p-6 md:p-8 rounded-3xl border border-border/70 shadow-soft backdrop-blur mb-12 animate-rise" style={{ animationDelay: '200ms' }}>
          <h3 className="font-serif text-xl md:text-2xl text-ui-text mb-6 text-center">{STRINGS.confirmacao.resumo}</h3>
          
          <div className="space-y-4 text-center">
            <div>
              <p className="text-taupe text-sm uppercase tracking-wider mb-1">{STRINGS.confirmacao.homenagem}</p>
              <p className="text-lg text-ui-text">
                {homenagem.nome} {modelo ? `- ${modelo.nome}` : ''}
              </p>
            </div>
            
            {hasFotos && (
              <div>
                <p className="text-taupe text-sm uppercase tracking-wider mb-1">{STRINGS.confirmacao.lembrancas}</p>
                <p className="text-lg text-ui-text">{STRINGS.confirmacao.fotosAdicionadas(fotos.length)}</p>
              </div>
            )}
            
            <div>
              <p className="text-taupe text-sm uppercase tracking-wider mb-1">{STRINGS.confirmacao.destinoSolidario}</p>
              <p className="text-lg text-primary/90">{ong.nome}</p>
            </div>

            {frase && (
              <div className="pt-4 mt-4 border-t border-border/50">
                <p className="font-serif italic text-ui-text text-xl">"{frase}"</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleConcluir}
          className="bg-transparent border border-primary text-primary px-8 md:px-12 py-4 rounded-full hover:bg-primary/5 active:scale-[0.99] transition-all duration-500 uppercase tracking-widest text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          {STRINGS.confirmacao.concluir}
        </button>

      </div>
    </TotemScreen>
  )
}
