import { createFileRoute } from '@tanstack/react-router'
import { Flower2, HelpCircle, HeartHandshake, BookOpen } from 'lucide-react'
import { TotemScreen } from '../components/TotemScreen'
import { InteractiveCard } from '../components/InteractiveCard'
import { STRINGS } from '../data/strings'

export const Route = createFileRoute('/inicio')({
  component: InicioPage,
})

function InicioPage() {
  return (
    <TotemScreen back="/" showHome={false}>
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
        <div className="text-center mb-16 animate-gentle-fade">
          <span className="uppercase tracking-[0.3em] text-primary/70 text-sm font-semibold block mb-4">
            {STRINGS.inicio.bemVindo}
          </span>
          <h1 className="font-serif text-5xl text-ui-text mb-6">
            {STRINGS.inicio.titulo}
          </h1>
        </div>

        <div className="flex flex-col gap-6">
          <InteractiveCard 
            to="/catalogo"
            animationDelay="100ms"
            className="flex items-center gap-6 p-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-500">
              <Flower2 className="w-8 h-8" />
            </div>
            <div className="text-left flex-none">
              <h2 className="text-2xl font-serif text-ui-text">{STRINGS.inicio.opcoes.homenagens}</h2>
            </div>
          </InteractiveCard>

          <InteractiveCard 
            to="/historia"
            animationDelay="200ms"
            className="flex items-center gap-6 p-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-500">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="text-left flex-none">
              <h2 className="text-2xl font-serif text-ui-text">{STRINGS.inicio.opcoes.historia}</h2>
            </div>
          </InteractiveCard>

          <InteractiveCard 
            onClick={() => {}}
            animationDelay="300ms"
            className="flex items-center gap-6 p-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-500">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div className="text-left flex-none">
              <h2 className="text-2xl font-serif text-ui-text">{STRINGS.inicio.opcoes.comoFunciona}</h2>
            </div>
          </InteractiveCard>

          <InteractiveCard 
            to="/instituicoes"
            animationDelay="400ms"
            className="flex items-center gap-6 p-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-500">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <div className="text-left flex-none">
              <h2 className="text-2xl font-serif text-ui-text">{STRINGS.inicio.opcoes.instituicoes}</h2>
            </div>
          </InteractiveCard>
        </div>
      </div>
    </TotemScreen>
  )
}

