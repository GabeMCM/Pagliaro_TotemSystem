"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TotemScreen } from '../../components/TotemScreen';
import { StepBar } from '../../components/StepBar';
import { useHomenagem } from '../../lib/homenagem-store';
import { Loader2, MessageSquareQuote } from 'lucide-react';

export default function FaixaPage() {
  const navigate = useRouter();
  const { homenagem, frase, setFrase } = useHomenagem();
  const [frasesProntas, setFrasesProntas] = useState<{id: string, texto: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redireciona se a página foi acessada sem escolher uma homenagem
    if (!homenagem) {
      navigate.push('/catalogo');
      return;
    }

    const fetchFrases = async () => {
      try {
        const res = await fetch('/api/frases');
        const data = await res.json();
        if (Array.isArray(data)) {
          setFrasesProntas(data.filter((f: any) => f.ativo));
        } else {
          console.error("Retorno inesperado da API:", data);
          setFrasesProntas([]);
        }
      } catch (e) {
        console.error("Erro ao buscar frases prontas");
      } finally {
        setLoading(false);
      }
    };
    fetchFrases();
  }, [homenagem, navigate]);

  const handleNext = () => {
    navigate.push('/instituicoes-escolha');
  };

  const handleSkip = () => {
    setFrase(""); // Limpa a frase
    handleNext();
  };

  if (!homenagem) return null;

  return (
    <TotemScreen back={`/colecao/${homenagem.id}`}>
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <StepBar currentStep={1} />
        
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-ui-text mb-3 flex justify-center items-center gap-3">
            <MessageSquareQuote className="w-8 h-8 text-primary" />
            Mensagem da Faixa
          </h1>
          <p className="text-taupe text-lg">
            Escreva uma breve mensagem ou escolha uma de nossas opções.
          </p>
        </div>

        <div className="flex flex-col gap-8 bg-card border border-border/70 p-6 md:p-8 rounded-3xl shadow-soft flex-1">
          
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="font-medium text-ui-text text-lg">Sua Mensagem</label>
              <span className={`text-sm font-medium ${frase.length > 100 ? 'text-red-500' : 'text-taupe'}`}>
                {frase.length}/100
              </span>
            </div>
            <textarea
              maxLength={100}
              value={frase}
              onChange={(e) => setFrase(e.target.value)}
              placeholder="Ex: Saudades eternas da sua família."
              className="w-full bg-muted/20 border-2 border-border/70 rounded-2xl p-5 text-xl text-ui-text focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all resize-none h-32"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-ui-text text-lg">Ou escolha uma mensagem pronta:</h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {frasesProntas.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFrase(f.texto)}
                    className="text-left p-4 bg-muted/30 border border-border/50 hover:border-primary hover:bg-primary/5 rounded-xl text-ui-text transition-colors"
                  >
                    "{f.texto}"
                  </button>
                ))}
                {frasesProntas.length === 0 && (
                  <p className="text-taupe col-span-2 text-center py-4">Nenhuma frase padrão encontrada.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center bg-card p-6 rounded-3xl border border-border/70 shadow-soft">
          <button 
            onClick={handleSkip}
            className="text-taupe font-medium hover:text-ui-text px-6 py-3 rounded-xl transition-colors"
          >
            Pular / Sem Faixa
          </button>
          <button 
            onClick={handleNext}
            disabled={!frase.trim() || frase.length > 100}
            className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-medium tracking-wide text-lg shadow-soft hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Avançar
          </button>
        </div>

      </div>
    </TotemScreen>
  );
}
