export interface ModeloHomenagem {
  id: string;
  nome: string;
  descricao?: string;
  imagem: string;
}

export interface Homenagem {
  id: string;
  nome: string;
  descricao: string;
  faixa: string;
  valor: number;
  imagem: string;
  requerFotos?: boolean;
  modelos?: ModeloHomenagem[];
  ativo?: boolean;
}


export interface Ong {
  id: string;
  nome: string;
  causa: string;
  descricao: string;
  sobre?: string;
  midias?: {
    tipo: 'foto' | 'video';
    url: string;
    legenda?: string;
  }[];
}

