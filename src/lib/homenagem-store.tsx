"use client";

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
  valorPersonalizado: number | null;
  
  setHomenagem: (homenagem: Homenagem | null) => void;
  setModelo: (modelo: ModeloHomenagem | null) => void;
  setFotos: (fotos: FotoMemorial[] | ((prev: FotoMemorial[]) => FotoMemorial[])) => void;
  setFrase: (frase: string) => void;
  setOng: (ong: Ong | null) => void;
  setValorPersonalizado: (valor: number | null) => void;
  
  // Novos campos de Identificação
  obitoId: string;
  nomeCliente: string;
  telefoneCliente: string;
  anonimo: boolean;
  
  setObitoId: (id: string) => void;
  setNomeCliente: (nome: string) => void;
  setTelefoneCliente: (telefone: string) => void;
  setAnonimo: (anonimo: boolean) => void;
  
  reset: () => void;
}

const HomenagemContext = createContext<HomenagemState | undefined>(undefined);

export const HomenagemProvider = ({ children }: { children: ReactNode }) => {
  const [homenagem, setHomenagem] = useState<Homenagem | null>(null);
  const [modelo, setModelo] = useState<ModeloHomenagem | null>(null);
  const [fotos, setFotos] = useState<FotoMemorial[]>([]);
  const [frase, setFrase] = useState<string>("");
  const [ong, setOng] = useState<Ong | null>(null);
  const [valorPersonalizado, setValorPersonalizado] = useState<number | null>(null);

  const [obitoId, setObitoId] = useState<string>("");
  const [nomeCliente, setNomeCliente] = useState<string>("");
  const [telefoneCliente, setTelefoneCliente] = useState<string>("");
  const [anonimo, setAnonimo] = useState<boolean>(false);

  const reset = () => {
    setHomenagem(null);
    setModelo(null);
    setFotos([]);
    setFrase("");
    setOng(null);
    setValorPersonalizado(null);
    setObitoId("");
    setNomeCliente("");
    setTelefoneCliente("");
    setAnonimo(false);
  };

  const value: HomenagemState = {
    homenagem,
    modelo,
    fotos,
    fotosExistentes: FOTOS_EXISTENTES,
    frase,
    ong,
    valorPersonalizado,
    obitoId,
    nomeCliente,
    telefoneCliente,
    anonimo,
    setHomenagem,
    setModelo,
    setFotos,
    setFrase,
    setOng,
    setValorPersonalizado,
    setObitoId,
    setNomeCliente,
    setTelefoneCliente,
    setAnonimo,
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

