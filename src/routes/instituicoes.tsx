import { createFileRoute, Link } from '@tanstack/react-router'
import { TotemScreen } from '../components/TotemScreen'
import { instituicoes as ongsData } from '../data/instituicoes'
import { STRINGS } from '../data/strings'
import { InteractiveCard } from '../components/InteractiveCard'

export const Route = createFileRoute('/instituicoes')({
  component: InstituicoesPage,
})

function InstituicoesPage() {
  const ongs = ongsData

  return (
    <TotemScreen back="/inicio">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 mt-12">
        <div className="text-center mb-12 animate-gentle-fade">
          <h1 className="font-serif text-4xl text-ui-text mb-3">{STRINGS.instituicoes.titulo}</h1>
          <p className="text-taupe text-lg">{STRINGS.instituicoes.subtitulo}</p>
        </div>

        <div className="flex flex-col gap-6 pb-32">
          {ongs.map((ong, i) => (
            <InteractiveCard
              key={ong.id}
              className="flex items-start gap-6 p-6 border border-border/70 text-left bg-card/80 shadow-soft backdrop-blur animate-rise"
              animationDelay={`${i * 100}ms`}
            >
              <div className="flex-1 flex justify-between items-center w-full">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-serif text-ui-text">{ong.nome}</h2>
                    <span className="text-primary/80 font-semibold tracking-wide text-sm bg-primary/10 px-3 py-1 rounded-full">
                      {ong.causa}
                    </span>
                  </div>
                  <p className="text-taupe">{ong.descricao}</p>
                </div>
                
                <Link
                  to="/instituicao/$id"
                  params={{ id: ong.id }}
                  className="px-6 py-3 rounded-full border border-primary/30 text-primary font-medium tracking-wide hover:bg-primary/10 hover:border-primary/50 transition-all ml-4 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  {STRINGS.instituicoes.saberMais}
                </Link>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </div>
    </TotemScreen>
  )
}

