"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TotemScreen } from '../../components/TotemScreen';
import { StepBar } from '../../components/StepBar';
import { useHomenagem } from '../../lib/homenagem-store';
import { StickyActionBar } from '../../components/StickyActionBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Loader2, User, Phone, CheckCircle2 } from 'lucide-react';
import { Obito } from '@prisma/client';

export default function IdentificacaoPage() {
  const navigate = useRouter();
  const { 
    obitoId, setObitoId,
    nomeCliente, setNomeCliente,
    telefoneCliente, setTelefoneCliente,
    anonimo, setAnonimo,
    homenagem
  } = useHomenagem();
  
  const [obitos, setObitos] = useState<Obito[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!homenagem) {
      navigate.push('/catalogo');
      return;
    }

    const fetchObitos = async () => {
      try {
        // Implementa um timeout manual de 5 segundos para a rede
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch('/api/obitos', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("Erro do servidor (possivelmente 503)");
        
        const data = await res.json();
        if (Array.isArray(data)) {
          const ativos = data.filter((o: any) => o.ativo);
          setObitos(ativos);
          // Salva no cache local para resiliência offline
          localStorage.setItem('@totem:obitos_cache', JSON.stringify(ativos));
        }
      } catch (e) {
        console.warn("Falha de rede ao buscar óbitos. Tentando recuperar do cache local...");
        const cached = localStorage.getItem('@totem:obitos_cache');
        if (cached) {
          try {
            setObitos(JSON.parse(cached));
          } catch (err) {
            console.error("Erro ao ler cache de óbitos");
          }
        } else {
          console.error("Sem cache disponível de óbitos");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchObitos();
  }, [homenagem, navigate]);

  const isValid = () => {
    if (!obitoId) return false;
    if (nomeCliente.trim().length < 3) return false;
    if (telefoneCliente.replace(/\D/g, '').length < 10) return false; // Minimo 10 digitos (DDD + numero)
    return true;
  };

  const formatTelefone = (value: string) => {
    const v = value.replace(/\D/g, '');
    let formatted = v;
    if (v.length > 2) {
      formatted = `(${v.substring(0, 2)}) ${v.substring(2)}`;
    }
    if (v.length > 7) {
      formatted = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7, 11)}`;
    }
    return formatted;
  };

  return (
    <TotemScreen back="/instituicoes-escolha">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">
        <StepBar currentStep={3} />
        
        <div className="text-center mb-10 animate-gentle-fade">
          <h1 className="font-serif text-3xl md:text-4xl text-ui-text mb-3">Quem você está homenageando?</h1>
          <p className="text-taupe text-lg">
            Informe o destinatário da homenagem e os seus dados para registro.
          </p>
        </div>

        <div className="flex flex-col gap-8 animate-rise" style={{ animationDelay: '100ms' }}>
          
          {/* Seleção do Óbito */}
          <div className="bg-card border border-border/70 p-6 md:p-8 rounded-3xl shadow-soft">
            <h2 className="text-xl font-medium text-ui-text mb-6">1. Selecione a pessoa homenageada</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : obitos.length === 0 ? (
              <p className="text-taupe text-center py-6 bg-muted/30 rounded-xl border border-border/50">Nenhum velório ativo no momento. Solicite apoio na recepção.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {obitos.map(obito => (
                  <button
                    key={obito.id}
                    onClick={() => setObitoId(obito.id)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all ${
                      obitoId === obito.id 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'border-border/70 hover:border-primary/50 hover:bg-muted/30'
                    }`}
                  >
                    <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      obitoId === obito.id ? 'bg-primary text-primary-foreground' : 'border-2 border-border text-transparent'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-ui-text text-lg">{obito.nome}</div>
                      {obito.localVelorio && (
                        <div className="text-taupe text-sm mt-1">Sala/Local: {obito.localVelorio}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dados do Cliente */}
          <div className="bg-card border border-border/70 p-6 md:p-8 rounded-3xl shadow-soft">
            <h2 className="text-xl font-medium text-ui-text mb-6">2. Seus Dados</h2>
            
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-taupe font-medium flex items-center gap-2">
                    <User className="w-4 h-4" /> Seu Nome
                  </label>
                  <input 
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    placeholder="Como deseja ser identificado?"
                    className="w-full bg-muted/20 border-2 border-border/70 rounded-xl p-4 text-lg text-ui-text focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-taupe font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Seu Telefone (WhatsApp)
                  </label>
                  <input 
                    value={telefoneCliente}
                    onChange={(e) => setTelefoneCliente(formatTelefone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className="w-full bg-muted/20 border-2 border-border/70 rounded-xl p-4 text-lg text-ui-text focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <label className="flex items-center gap-4 cursor-pointer group bg-muted/20 p-4 rounded-2xl border border-border/50 hover:bg-muted/40 transition-colors">
                <input 
                  type="checkbox"
                  checked={anonimo}
                  onChange={(e) => setAnonimo(e.target.checked)}
                  className="w-6 h-6 rounded border-border/70 text-primary focus:ring-primary focus:ring-offset-background"
                />
                <span className="text-lg text-ui-text group-hover:text-primary transition-colors">
                  Desejo fazer uma homenagem anônima
                </span>
              </label>

            </div>
          </div>

        </div>

        <StickyActionBar>
          <PrimaryButton
            onClick={() => navigate.push('/pagamento')}
            disabled={!isValid()}
          >
            Avançar para Pagamento
          </PrimaryButton>
        </StickyActionBar>

      </div>
    </TotemScreen>
  );
}
