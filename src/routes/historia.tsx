import { createFileRoute } from '@tanstack/react-router'
import { TotemScreen } from '../components/TotemScreen'
import { historiaData } from '../data/historia'

export const Route = createFileRoute('/historia')({
  component: HistoriaPage,
})

function HistoriaPage() {
  const { titulo, subtitulo, secoes } = historiaData

  return (
    <TotemScreen back="/inicio">
      <div className="max-w-4xl mx-auto w-full pb-20 animate-gentle-fade">
        <header className="mb-16 text-center">
          <span className="uppercase tracking-[0.3em] text-primary/70 text-sm font-semibold block mb-4">
            {subtitulo}
          </span>
          <h1 className="font-serif text-6xl text-ui-text mb-6">
            {titulo}
          </h1>
          <div className="w-24 h-px bg-primary/30 mx-auto"></div>
        </header>

        <article className="space-y-16 text-lg leading-relaxed text-ui-text-muted">
          {secoes.map((secao) => (
            <section key={secao.id} className="bg-card/40 rounded-[2.5rem] p-10 backdrop-blur-sm border border-white/40 shadow-soft">
              <h2 className="font-serif text-4xl text-ui-text mb-6">{secao.titulo}</h2>
              <div className="space-y-6">
                {secao.conteudo.map((item, index) => {
                  if (item.tipo === 'paragrafo') {
                    return <p key={index}>{item.texto}</p>
                  }
                  
                  if (item.tipo === 'citacao') {
                    return (
                      <p key={index} className="font-medium text-ui-text italic pt-4">
                        {item.texto}
                      </p>
                    )
                  }
                  
                  if (item.tipo === 'imagem') {
                    return (
                      <div key={index} className={`w-full ${item.altura || 'h-80'} bg-black/5 rounded-2xl border border-white/30 flex items-center justify-center my-8 shadow-inner relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500"></div>
                        <div className="text-center z-10 p-6">
                          <span className="block text-primary/70 font-medium mb-2">Espaço Reservado</span>
                          <p className="text-sm text-ui-text-muted">Imagem: {item.placeholder}</p>
                          <p className="text-xs text-ui-text-muted/60 mt-1">({item.dica})</p>
                        </div>
                      </div>
                    )
                  }

                  return null
                })}
              </div>
            </section>
          ))}
        </article>
      </div>
    </TotemScreen>
  )
}
