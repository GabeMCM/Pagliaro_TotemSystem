import { createFileRoute } from '@tanstack/react-router'
import { TotemScreen } from '../components/TotemScreen'
import { instituicoes } from '../data/instituicoes'
import { STRINGS } from '../data/strings'
import { FadeImage } from '../components/FadeImage'

export const Route = createFileRoute('/instituicao/$id')({
  component: InstituicaoDetalhesPage,
})

function InstituicaoDetalhesPage() {
  const { id } = Route.useParams()
  const ong = instituicoes.find(o => o.id === id)

  if (!ong) {
    return (
      <TotemScreen back="/instituicoes">
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl text-ui-text font-serif">{STRINGS.errors.instituicaoNotFound}</h1>
        </div>
      </TotemScreen>
    )
  }

  return (
    <TotemScreen back="/instituicoes">
      <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 pb-32 animate-gentle-fade mt-8">
        <header className="mb-10 text-center">
          <span className="text-primary/80 font-semibold tracking-wider uppercase text-sm bg-primary/10 px-4 py-1.5 rounded-full mb-4 inline-block">
            {ong.causa}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-ui-text mb-4">{ong.nome}</h1>
          <p className="text-taupe text-lg md:text-xl">{ong.descricao}</p>
        </header>

        {/* Carrossel */}
        {ong.midias && ong.midias.length > 0 && (
          <div className="relative mb-12">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 px-4">
              {ong.midias.map((midia, index) => (
                <div 
                  key={index} 
                  className="snap-center shrink-0 w-[85%] md:w-[70%] lg:w-[800px] h-[300px] md:h-[450px] bg-card rounded-[2rem] border border-white/20 overflow-hidden shadow-soft relative group cursor-pointer"
                >
                  {/* Placeholder/Fundo caso a imagem falhe */}
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-500">
                    <p className="text-primary/50 font-serif text-xl opacity-0">{midia.legenda}</p>
                  </div>
                  
                  {/* A tag de imagem ou video real */}
                  {midia.tipo === 'video' ? (
                    <video 
                      src={midia.url} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <FadeImage 
                      src={midia.url} 
                      alt={midia.legenda || ''} 
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-105" 
                    />
                  )}
                  
                  {midia.legenda && (
                    <div className="absolute bottom-0 left-0 right-0 p-8 pt-24 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white/95 text-2xl font-serif">{midia.legenda}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Indicador de Swipe */}
            <div className="flex justify-center mt-4">
              <span className="text-sm text-taupe/60 tracking-wider uppercase flex items-center gap-2">
                {STRINGS.instituicoes.deslize}
              </span>
            </div>
          </div>
        )}

        {/* Sobre a Instituição e Contatos */}
        <div className="bg-card/40 rounded-[2.5rem] p-6 md:p-10 lg:p-14 backdrop-blur-sm border border-white/40 shadow-soft max-w-5xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1">
              <h2 className="font-serif text-2xl md:text-3xl text-ui-text mb-6">{STRINGS.instituicoes.nossaHistoria}</h2>
              <div className="prose prose-lg">
                <p className="text-ui-text-muted leading-relaxed text-lg whitespace-pre-wrap">
                  {ong.sobre}
                </p>
              </div>
            </div>

            {/* Informações de Contato e QR Code */}
            {(ong.telefone || ong.email || ong.cnpj || ong.website) && (
              <div className="w-full lg:w-[340px] shrink-0 bg-background/50 rounded-[2rem] p-8 border border-white/40 shadow-sm flex flex-col gap-6 h-fit">
                <h3 className="font-serif text-xl text-ui-text border-b border-border/50 pb-4">Informações</h3>
                
                <div className="flex flex-col gap-4 text-sm text-taupe">
                  {ong.cnpj && (
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-taupe/70 mb-1">CNPJ</span>
                      <span className="font-medium text-ui-text">{ong.cnpj}</span>
                    </div>
                  )}
                  {ong.endereco && (
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-taupe/70 mb-1">Endereço</span>
                      <span className="font-medium text-ui-text">{ong.endereco} {ong.cep && `- CEP: ${ong.cep}`}</span>
                    </div>
                  )}
                  {ong.telefone && (
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-taupe/70 mb-1">Contato</span>
                      {Array.isArray(ong.telefone) ? ong.telefone.map((t, i) => <span key={i} className="block font-medium text-ui-text">{t}</span>) : <span className="font-medium text-ui-text">{ong.telefone}</span>}
                    </div>
                  )}
                  {ong.email && (
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-taupe/70 mb-1">E-mail</span>
                      <span className="font-medium text-ui-text break-all">{ong.email}</span>
                    </div>
                  )}
                </div>

                {ong.website && (
                  <div className="mt-4 pt-6 border-t border-border/50 flex flex-col items-center">
                    <span className="text-xs uppercase tracking-wider text-primary mb-4 font-semibold text-center">Acesse nosso site</span>
                    <div className="bg-white p-3 rounded-2xl shadow-sm">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ong.website)}`} 
                        alt="QR Code do site" 
                        className="w-32 h-32 opacity-90 hover:opacity-100 transition-opacity"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </TotemScreen>
  )
}

