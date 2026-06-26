# Integração de Óbitos (API Externa)

Esta documentação é direcionada aos desenvolvedores do sistema externo que fará o disparo dos dados de falecimento para o Totem.

## Endpoint (Produção)

- **URL:** `[URL_DO_SEU_SITE]/api/integracao/obitos`
- **Method:** `POST`

## Autenticação

A API é protegida por uma chave de integração. Você deve incluí-la nos **Headers** da requisição usando a chave `x-api-key`.

| Header | Valor | Obrigatório |
|---|---|---|
| `x-api-key` | A chave combinada (`PagliaroIntegracao2026*`) | Sim |
| `Content-Type` | `application/json` | Sim |

> [!WARNING]
> Mantenha a chave segura. Se necessário rotacioná-la no futuro, edite a variável `INTEGRATION_API_KEY` no arquivo `.env` do servidor e no sistema externo simultaneamente.

## Body (JSON Payload)

| Campo | Tipo | Descrição | Obrigatório |
|---|---|---|---|
| `nome` | String | O nome completo do falecido. | Sim |
| `dataNascimento` | String | Data de nascimento no formato ISO (YYYY-MM-DD). | Não |
| `dataFalecimento`| String | Data do óbito no formato ISO (YYYY-MM-DD). | Não |

### Exemplo de Requisição

```json
{
  "nome": "João Carlos Pereira",
  "dataNascimento": "1940-08-15",
  "dataFalecimento": "2026-06-25"
}
```

### Exemplo em JavaScript (Fetch)

```javascript
fetch('https://[URL_DO_SEU_SITE]/api/integracao/obitos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'PagliaroIntegracao2026*'
  },
  body: JSON.stringify({
    nome: 'João Carlos Pereira',
    dataNascimento: '1940-08-15',
    dataFalecimento: '2026-06-25'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Respostas da API

### Sucesso (201 Created)
Retorna quando o óbito foi inserido no banco com sucesso e já está disponível no Totem.
```json
{
  "success": true,
  "message": "Óbito registrado com sucesso.",
  "obito": {
    "id": "e4f8a92b-...",
    "nome": "João Carlos Pereira",
    "dataNascimento": "1940-08-15T00:00:00.000Z",
    "dataFalecimento": "2026-06-25T00:00:00.000Z",
    "ativo": true
  }
}
```

### Erro de Autenticação (401 Unauthorized)
Retorna se a `x-api-key` estiver ausente ou incorreta.
```json
{
  "error": "Acesso não autorizado. Chave de API (x-api-key) inválida ou não fornecida."
}
```

### Erro de Validação (400 Bad Request)
Retorna se faltar o campo `nome` ou se o formato das datas estiver incorreto.
```json
{
  "error": "O campo 'nome' é obrigatório e deve ser uma string."
}
```
