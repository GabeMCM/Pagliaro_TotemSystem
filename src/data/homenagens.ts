import { Homenagem } from './catalogo';

export const homenagens: Homenagem[] = [
  {
    "id": "coroa-memorial",
    "nome": "Coroa Memorial",
    "descricao": "Uma homenagem tradicional e solene.",
    "faixa": "R$120–280",
    "valor": 120,
    "imagem": "/img/coroa-base.png",
    "ativo": true,
    "modelos": [
      {
        "id": "1",
        "nome": "",
        "imagem": "/media/coroas/1.png"
      },
      {
        "id": "2",
        "nome": "",
        "imagem": "/media/coroas/2.png"
      },
      {
        "id": "3",
        "nome": "",
        "imagem": "/media/coroas/3.png"
      },
      {
        "id": "4",
        "nome": "",
        "imagem": "/media/coroas/4.png"
      },
      {
        "id": "5",
        "nome": "",
        "imagem": "/media/coroas/5.png"
      },
      {
        "id": "6",
        "nome": "",
        "imagem": "/media/coroas/6.png"
      },
      {
        "id": "7",
        "nome": "",
        "imagem": "/media/coroas/7.png"
      },
      {
        "id": "8",
        "nome": "",
        "imagem": "/media/coroas/8.png"
      },
      {
        "id": "9",
        "nome": "",
        "imagem": "/media/coroas/9.png"
      },
      {
        "id": "10",
        "nome": "",
        "imagem": "/media/coroas/10.png"
      },
      {
        "id": "11",
        "nome": "",
        "imagem": "/media/coroas/11.png"
      }
    ]
  },
  {
    "id": "arranjo-memorial",
    "nome": "Arranjo Memorial",
    "descricao": "Uma homenagem acolhedora e delicada.",
    "faixa": "R$90–220",
    "valor": 90,
    "imagem": "/img/arranjo-base.png",
    "ativo": false,
    "modelos": [
      {
        "id": "a-vaso-classico",
        "nome": "Vaso Clássico",
        "imagem": "/img/arranjo-vaso.png"
      },
      {
        "id": "a-sereno",
        "nome": "Sereno",
        "imagem": "/img/arranjo-sereno.png"
      },
      {
        "id": "a-jardim",
        "nome": "Jardim",
        "imagem": "/img/arranjo-jardim.png"
      },
      {
        "id": "a-premium",
        "nome": "Premium",
        "imagem": "/img/arranjo-premium.png"
      }
    ]
  },
  {
    "id": "mural-memoria",
    "nome": "Mural da Memória",
    "descricao": "Compartilhe fotos e memórias afetuosas.",
    "faixa": "R$100–200",
    "valor": 100,
    "imagem": "/img/mural-base.png",
    "requerFotos": true,
    "ativo": false
  },
  {
    "id": "cartao-memorial",
    "nome": "Cartão ou mensagem memorial",
    "descricao": "Uma jornada simples de afeto.",
    "faixa": "R$40–90",
    "valor": 40,
    "imagem": "/img/cartao-base.png",
    "ativo": false
  }
];

