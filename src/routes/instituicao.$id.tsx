import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { TotemScreen } from '../components/TotemScreen'
import { instituicoes } from '../data/instituicoes'
import { STRINGS } from '../data/strings'
import { FadeImage } from '../components/FadeImage'
import { Play, X } from 'lucide-react'

export const Route = createFileRoute('/instituicao/$id')({
  component: InstituicaoDetalhesPage,
})

function InstituicaoDetalhesPage() {
  const { id } = Route.useParams()
  const ong = instituicoes.find(o => o.id === id)
  const [videoOpen, setVideoOpen] = useState<string | null>(null)

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
    <>
      <TotemScreen back="/instituicoes">
        <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 pb-32 animate-gentle-fade mt-8">
          <header className="mb-10 text-center">
            <span className="text-primary/80 font-semibold tracking-wider uppercase text-sm bg-primary/10 px-4 py-1.5 rounded-full mb-4 inline-block">
              {ong.causa}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-ui-text mb-4">{ong.nome}</h1>
            <p className="text-taupe text-lg md:text-xl">{ong.descricao}</p>
          </header>

          {/* Vídeo Institucional */}
          {ong.midias && ong.midias.length > 0 && ong.midias[0].tipo === 'video' && (
            <div className="relative mb-12 flex justify-center px-4">
              <div 
                onClick={() => setVideoOpen(ong.midias![0].url)}
                className="w-full max-w-[20rem] md:max-w-[28rem] aspect-square bg-card rounded-[2.5rem] border border-white/20 overflow-hidden shadow-soft relative group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-primary/10"></div>
                <video 
                  src={ong.midias[0].url} 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-105" 
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-primary/80 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 ml-1" fill="currentColor" />
                  </div>
                </div>
                {ong.midias[0].legenda && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 pt-20 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white/95 text-xl font-serif text-center">{ong.midias[0].legenda}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sobre a Instituição e Contatos */}
          <div className="bg-card/40 rounded-[2.5rem] p-6 md:p-10 lg:p-14 backdrop-blur-sm border border-white/40 shadow-soft max-w-5xl mx-auto w-full">
            <div className="flex flex-col landscape:lg:flex-row gap-8 landscape:lg:gap-12">
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
                <div className="w-full lg:w-[22rem] shrink-0 bg-background/50 rounded-[2rem] p-8 border border-white/40 shadow-sm flex flex-col gap-6 h-fit">
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

      {/* Modal de Vídeo Expandido */}
      {videoOpen && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex flex-col animate-gentle-fade">
          <div className="absolute top-0 left-0 right-0 p-6 md:p-10 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
            <button 
              onClick={() => setVideoOpen(null)}
              className="inline-flex items-center gap-3 text-white hover:text-primary transition-colors focus-visible:outline-none bg-black/40 px-6 py-3 rounded-full backdrop-blur-md border border-white/10"
            >
              <X className="w-7 h-7" />
              <span className="text-xl tracking-wider font-medium uppercase">Voltar</span>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <video 
              src={videoOpen}
              controls
              autoPlay
              className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl bg-black"
            />
          </div>
        </div>
      )}
    </>
  )
}

