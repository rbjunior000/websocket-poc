# WebSocket POC - LicitaGov

POC simples para testar conexao WebSocket STOMP/SockJS do projeto LicitaGov.

## Como usar

1. Abra o arquivo `index.html` no navegador
2. Preencha a **URL Base** (ex: `https://api.licitagov.com.br`)
3. Insira o **Token JWT** manualmente
4. Clique em **Conectar**

## Funcionalidades

- **Conexao**: Conecta via STOMP sobre SockJS em `/ws/chat`
- **Subscricoes**: Inscreve-se em topics para receber mensagens
- **Publicar**: Envia mensagens para destinations
- **Log**: Visualiza todos os eventos em tempo real

## Topics disponiveis

| Topic | Descricao |
|-------|-----------|
| `/topic/chatroom` | Chat geral |
| `/topic/etapa/licitacao/{id}` | Etapa de uma licitacao |
| `/topic/lotes/licitacao/{id}` | Lotes de uma licitacao |
| `/topic/classificacao/lote/{id}` | Classificacao de um lote |
| `/topic/lances/lote/{id}` | Lances de um lote |

## Obtendo o Token

O token JWT pode ser obtido:
- Do localStorage do projeto LicitaGov (chave do Firebase Auth)
- Do header Authorization das requisicoes no DevTools
