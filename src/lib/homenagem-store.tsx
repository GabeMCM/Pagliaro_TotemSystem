import React, { createContext, useContext, useState, ReactNode } from "react";
import { Homenagem, ModeloHomenagem, Ong } from "../data/catalogo";
import { CONFIG } from "../data/config";
import { STRINGS } from "../data/strings";

export const LIMITE_FOTOS = CONFIG.memorial.limiteFotos;
export const FOTOS_EXISTENTES = CONFIG.memorial.fotosExistentes; // Valor fixo do Memorial Simulado

export interface FotoMemorial {
  id: string;
  src: string;
  legenda: string;
}

interface HomenagemState {
  homenagem: Homenagem | null;
  modelo: ModeloHomenagem | null;
  fotos: FotoMemorial[];
  fotosExistentes: number;
  frase: string;
  ong: Ong | null;
  
  setHomenagem: (homenagem: Homenagem | null) => void;
  setModelo: (modelo: ModeloHomenagem | null) => void;
  setFotos: (fotos: FotoMemorial[] | ((prev: FotoMemorial[]) => FotoMemorial[])) => void;
  setFrase: (frase: string) => void;
  setOng: (ong: Ong | null) => void;
  reset: () => void;
}

const HomenagemContext = createContext<HomenagemState | undefined>(undefined);

export const HomenagemProvider = ({ children }: { children: ReactNode }) => {
  const [homenagem, setHomenagem] = useState<Homenagem | null>(null);
  const [modelo, setModelo] = useState<ModeloHomenagem | null>(null);
  const [fotos, setFotos] = useState<FotoMemorial[]>([]);
  const [frase, setFrase] = useState<string>("");
  const [ong, setOng] = useState<Ong | null>(null);

  const reset = () => {
    setHomenagem(null);
    setModelo(null);
    setFotos([]);
    setFrase("");
    setOng(null);
  };

  const value: HomenagemState = {
    homenagem,
    modelo,
    fotos,
    fotosExistentes: FOTOS_EXISTENTES,
    frase,
    ong,
    setHomenagem,
    setModelo,
    setFotos,
    setFrase,
    setOng,
    reset,
  };

  return (
    <HomenagemContext.Provider value={value}>
      {children}
    </HomenagemContext.Provider>
  );
};

export const useHomenagem = () => {
  const context = useContext(HomenagemContext);
  if (context === undefined) {
    throw new Error(STRINGS.errors.providerMissing);
  }
  return context;
};

