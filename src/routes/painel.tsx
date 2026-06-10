import React, { useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { X, Plus } from 'lucide-react'
import { TotemScreen } from '../components/TotemScreen'
import { StepBar } from '../components/StepBar'
import { useHomenagem, LIMITE_FOTOS } from '../lib/homenagem-store'
import { CONFIG } from '../data/config'
import { STRINGS } from '../data/strings'
import { StickyActionBar } from '../components/StickyActionBar'
import { PrimaryButton } from '../components/PrimaryButton'
import { calcFotosRestantes } from '../lib/utils'
import { FlowGuard } from '../components/FlowGuard'
import { FadeImage } from '../components/FadeImage'

export const Route = createFileRoute('/painel')({
  component: () => (
    <FlowGuard require="homenagem" fallback="/catalogo">
      <PainelPage />
    </FlowGuard>
  ),
})

const ROTATIONS = ["-2.5deg", "1.8deg", "-1.2deg", "2.2deg", "-2deg", "1.4deg"]

function PainelPage() {
  const navigate = useNavigate()
  const { homenagem, fotos, fotosExistentes, setFotos } = useHomenagem()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Redireciona se não houver homenagem selecionada
  if (!homenagem) {
    return null
  }


  const restantes = calcFotosRestantes(LIMITE_FOTOS, fotosExistentes, fotos.length)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const maxAllowed = Math.min(newFiles.length, restantes)
      
      const newFotos = newFiles.slice(0, maxAllowed).map(file => ({
        id: crypto.randomUUID(),
        src: URL.createObjectURL(file),
        legenda: ""
      }))

      setFotos(prev => [...prev, ...newFotos])
    }
  }

  const removeFoto = (id: string) => {
    setFotos(prev => prev.filter(f => f.id !== id))
  }

  const updateLegenda = (id: string, legenda: string) => {
    setFotos(prev => prev.map(f => f.id === id ? { ...f, legenda } : f))
  }

  return (
    <TotemScreen back="/catalogo">
      <div className="max-w-6xl mx-auto w-full flex flex-col flex-1">
        <StepBar currentStep={1} />

        <div className="text-center mb-10 animate-gentle-fade">
          <h1 className="font-serif text-3xl md:text-4xl text-ui-text mb-3">{STRINGS.painel.titulo}</h1>
          <p className="text-taupe text-sm md:text-base">
            {restantes > 0 
              ? STRINGS.painel.contagem(fotosExistentes, restantes)
              : STRINGS.painel.completo
            }
          </p>
        </div>

        <div className="flex-1 flex flex-wrap items-start justify-center gap-7 pb-24">
          {fotos.map((foto, idx) => (
            <div 
              key={foto.id} 
              className="w-40 md:w-52 bg-card p-2 pb-3 md:p-3 md:pb-4 shadow-card rounded-sm animate-rise relative group"
              style={{ transform: `rotate(${ROTATIONS[idx % ROTATIONS.length]})` }}
            >
              <button 
                onClick={() => removeFoto(foto.id)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-background shadow-soft rounded-full flex items-center justify-center text-taupe hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label={STRINGS.painel.removerFoto}
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="aspect-square bg-muted/30 mb-3 overflow-hidden">
                <FadeImage src={foto.src} alt="Lembrança" className="w-full h-full object-cover" loading="lazy" />
              </div>
              
              <input 
                type="text"
                value={foto.legenda}
                onChange={(e) => updateLegenda(foto.id, e.target.value)}
                maxLength={CONFIG.memorial.legendaMaxLength}
                placeholder={STRINGS.painel.placeholderLegenda}
                className="w-full text-center font-serif italic text-sm text-ui-text bg-transparent border-b border-transparent focus:border-taupe/30 focus:outline-none transition-colors"
              />
            </div>
          ))}

          {restantes > 0 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-40 md:w-52 aspect-[3/4] border-2 border-dashed border-border/70 rounded-sm flex flex-col items-center justify-center text-taupe hover:text-primary hover:border-primary/50 transition-colors duration-500 animate-rise"
            >
              <Plus className="w-8 h-8 mb-4 opacity-50" />
              <span className="font-serif italic">{STRINGS.painel.adicionarFotos}</span>
            </button>
          )}
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          multiple 
          onChange={handleFileChange}
        />

        <StickyActionBar>
          <PrimaryButton
            onClick={() => navigate({ to: '/instituicoes-escolha' })}
            disabled={fotos.length === 0}
          >
            {STRINGS.painel.botao}
          </PrimaryButton>
        </StickyActionBar>
      </div>
    </TotemScreen>
  )
}

