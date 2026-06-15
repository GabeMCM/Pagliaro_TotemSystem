"use client";

import React, { useEffect } from 'react'
import { useRouter } from "next/navigation";
import { Flower } from 'lucide-react'

import { TotemScreen } from '../../components/TotemScreen'
import { useHomenagem } from '../../lib/homenagem-store'
import { CONFIG } from '../../data/config'
import { STRINGS } from '../../data/strings'
import { FlowGuard } from '../../components/FlowGuard'

import QRCode from "react-qr-code";

export default function ConfirmacaoPage() {
  const navigate = useRouter()
  const { homenagem, modelo, fotos, ong, frase, reset } = useHomenagem()

  const hasFotos = (homenagem?.requerFotos && fotos.length > 0) || false

  useEffect(() => {
    if (!homenagem || !ong) return;
    
    // Auto reset configurável
    const timer = setTimeout(() => {
      reset()
      navigate.push('/')
    }, CONFIG.totem.autoResetMs + CONFIG.totem.qrCodeExtraMs) // Dá tempo extra pro escaneamento do QR Code

    return () => clearTimeout(timer)
  }, [homenagem, ong, reset, navigate])

  if (!homenagem || !ong) {
    return null
  }

  const handleConcluir = () => {
    reset()
    navigate.push('/')
  }

  return (
    <FlowGuard require="both" fallback="/">
      <TotemScreen showHome={false}>
        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full pb-20 mt-10">
        
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 animate-float-slow">
          <Flower className="w-10 h-10" />
        </div>

        <div className="text-center mb-8 animate-gentle-fade">
          <h1 className="font-serif text-3xl md:text-5xl text-ui-text mb-4">
            {STRINGS.confirmacao.titulo}
          </h1>
          <p className="text-taupe text-lg">
            {hasFotos 
              ? STRINGS.confirmacao.comFotos
              : STRINGS.confirmacao.semFotos
            }
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full items-stretch animate-rise" style={{ animationDelay: '200ms' }}>
          
          {/* Coluna Esquerda: Resumo do Pedido */}
          <div className="flex-1 bg-card/80 p-6 md:p-8 rounded-3xl border border-border/70 shadow-soft backdrop-blur">
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

          {/* Coluna Direita: Avaliação */}
          <div className="flex-1 bg-primary/5 p-6 md:p-8 rounded-3xl border border-primary/20 shadow-soft backdrop-blur flex flex-col items-center justify-center text-center">
            <h3 className="font-serif text-xl md:text-2xl text-primary mb-3">{STRINGS.confirmacao.avalieTitulo}</h3>
            <p className="text-taupe text-sm mb-6 max-w-sm">
              {STRINGS.confirmacao.avalieCorpo}
            </p>
            
            <div className="bg-white p-3 rounded-2xl shadow-sm mb-6">
              <QRCode 
                value={STRINGS.confirmacao.formLink}
                size={160}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            
            <p className="text-xs text-taupe font-medium uppercase tracking-wider">{STRINGS.confirmacao.avalieTempo}</p>
          </div>

        </div>

        <div className="mt-12 animate-rise" style={{ animationDelay: '400ms' }}>
          <button
            onClick={handleConcluir}
            className="bg-transparent border border-primary text-primary px-8 md:px-12 py-4 rounded-full hover:bg-primary/5 active:scale-[0.99] transition-all duration-500 uppercase tracking-widest text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {STRINGS.confirmacao.concluir}
          </button>
        </div>

        </div>
      </TotemScreen>
    </FlowGuard>
  )
}
