"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TotemScreen } from "../../components/TotemScreen";
import { StepBar } from "../../components/StepBar";
import { useHomenagem } from "../../lib/homenagem-store";
import { StickyActionBar } from "../../components/StickyActionBar";
import { PrimaryButton } from "../../components/PrimaryButton";
import { FlowGuard } from "../../components/FlowGuard";
import { formatCurrency } from "../../lib/utils";

const PRESET_AMOUNTS = [5, 10, 20, 50, 100];

export default function ValorLivrePage() {
  const navigate = useRouter();
  const { homenagem, setValorPersonalizado } = useHomenagem();
  
  const baseValue = homenagem?.valor || 5;
  const [customValue, setCustomValue] = useState<number>(baseValue);
  const [inputValue, setInputValue] = useState<string>("");

  if (!homenagem) return null;

  const handleNext = () => {
    // Garantir o mínimo do valor base
    const finalValue = Math.max(customValue, baseValue);
    setValorPersonalizado(finalValue);
    
    if (homenagem.requerFotos) {
      navigate.push('/painel');
    } else {
      navigate.push('/instituicoes-escolha');
    }
  };

  const handlePresetClick = (val: number) => {
    setCustomValue(val);
    setInputValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (!rawValue) {
      setInputValue("");
      setCustomValue(baseValue);
      return;
    }
    const numValue = parseInt(rawValue, 10) / 100;
    setInputValue(rawValue);
    setCustomValue(numValue);
  };

  return (
    <FlowGuard require="homenagem" fallback="/catalogo">
      <TotemScreen back="/catalogo">
        <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 pb-32">
          <StepBar currentStep={0} />

          <div className="text-center mb-10 animate-gentle-fade">
            <h1 className="font-serif text-3xl md:text-4xl text-ui-text mb-3">Escolha o Valor</h1>
            <p className="text-taupe text-lg">Qual o valor que você deseja destinar para esta ação?</p>
          </div>

          <div className="flex flex-col items-center gap-8 bg-card/50 border border-border/70 p-6 md:p-10 rounded-3xl backdrop-blur shadow-soft animate-rise">
            <div className="w-full max-w-lg">
              <label className="block text-center text-taupe font-medium mb-4 uppercase tracking-wider text-sm">
                Valor Escolhido
              </label>
              
              <div className="relative flex items-center justify-center">
                <span className="absolute left-4 md:left-8 text-2xl md:text-3xl font-serif text-taupe/70">R$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputValue ? (parseInt(inputValue, 10) / 100).toFixed(2) : customValue.toFixed(2)}
                  onChange={handleInputChange}
                  className="w-full bg-background border-2 border-primary/20 rounded-2xl text-center py-6 text-4xl md:text-5xl font-serif text-primary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="0.00"
                />
              </div>
              {customValue < baseValue && (
                <p className="text-red-500 text-sm text-center mt-3">
                  O valor mínimo sugerido é de {formatCurrency(baseValue)}
                </p>
              )}
            </div>

            <div className="w-full max-w-2xl">
              <p className="text-center text-taupe text-sm mb-4">Ou escolha um valor pré-definido:</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {PRESET_AMOUNTS.map((amt) => {
                  if (amt < baseValue && amt !== PRESET_AMOUNTS[PRESET_AMOUNTS.length - 1]) return null;
                  return (
                    <button
                      key={amt}
                      onClick={() => handlePresetClick(amt)}
                      className={`py-4 px-2 rounded-xl border-2 font-medium text-lg transition-all ${
                        customValue === amt && !inputValue
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/60 text-ui-text hover:border-primary/50 hover:bg-background'
                      }`}
                    >
                      R$ {amt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <StickyActionBar>
            <div className="flex flex-col items-center w-full max-w-2xl mx-auto gap-4">
              <PrimaryButton
                className="w-full md:w-auto text-center justify-center"
                onClick={handleNext}
                disabled={customValue < baseValue}
              >
                Confirmar Valor
              </PrimaryButton>
            </div>
          </StickyActionBar>
        </div>
      </TotemScreen>
    </FlowGuard>
  );
}
