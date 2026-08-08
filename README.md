# Bot de Funil de Vendas — WhatsApp Cloud API

Bot de resposta automática para leads que chegam via anúncio (Facebook/Instagram Ads → clique para WhatsApp).
Funciona com qualquer volume de leads simultâneos, porque cada mensagem recebida dispara seu próprio evento
processado de forma independente — não é um script de disparo em massa, é uma automação orientada por evento.

## Onde editar os textos, áudios, imagens e tempos de espera

Você não precisa mexer no código de lógica (`funnel.js`, `server.js`) pra mudar o conteúdo do bot.
Edite só o arquivo **`src/config/sequences.js`** — lá você encontra, em português:

- Os textos de cada mensagem (pode usar `{nome}`, `{preco}` e `{link}` como variáveis)
- As URLs de áudio, imagem e PDF
- O `delayAfter` de cada mensagem — quantos segundos esperar antes de mandar a próxima
- Quanto tempo esperar sem resposta do cliente antes de mandar um reengajamento
- Quanto tempo esperar sem pagamento antes de mandar o lembrete de cobrança

## Como funciona o fluxo completo

1. **Lead novo** → sequência de boas-vindas (texto → espera → áudio → espera → imagem → espera → botões)
2. **Cliente não responde em X minutos** → mensagem automática de reengajamento (pra não perder o lead)
3. **Cliente interage** → ou aceita (gera cobrança Pix) ou pede mais informação (nova sequência, sem pressão)
4. **Cliente paga** → agradecimento automático + entrega do PDF, com pausas naturais entre as mensagens
5. **Cliente não paga em X horas** → lembrete automático educado, sem cobrança por culpa

## Passo a passo de configuração

### 1. Meta Cloud API (WhatsApp)
1. Crie uma conta em [developers.facebook.com](https://developers.facebook.com) e um App do tipo "Business".
2. Adicione o produto **WhatsApp** ao App.
3. Em "API Setup", pegue o `Temporary Access Token` (depois troque por um permanente) e o `Phone Number ID`.
4. Coloque esses valores no arquivo `.env` (copie de `.env.example`).

### 2. Configurar o Webhook na Meta
1. No painel do App, vá em WhatsApp > Configuration > Webhook.
2. Coloque a URL: `https://SEU-DOMINIO/webhook/whatsapp`.
3. Coloque o `Verify Token` igual ao que você definiu em `WEBHOOK_VERIFY_TOKEN` no `.env`.
4. Inscreva-se no campo `messages`.

### 3. Provedor de pagamento (Pix com Asaas)
1. Crie conta em [asaas.com](https://www.asaas.com) com seu CPF.
2. Em **Integrações → Chaves de API**, gere uma chave (sem permissão de saque) e coloque em `PAYMENT_PROVIDER_API_KEY` no `.env`.
3. Em **Integrações → Webhooks**, configure a URL `https://SEU-DOMINIO/webhook/pagamento`, marque os eventos `PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED`, e defina um token de autenticação — coloque esse mesmo token em `PAYMENT_WEBHOOK_SECRET` no `.env`.
4. Para receber de verdade (não só testar), complete a verificação de identidade no Asaas (envio de documento), que libera o modo produção.
5. Para transferir o saldo recebido para sua conta Nubank, use a opção de transferência/saque do próprio Asaas quando quiser.

### 4. Hospedar os arquivos (áudio, imagem, PDF)
Suba o áudio de apresentação, a imagem de capa e o PDF final em um storage público
(Cloudflare R2, S3, ou até o storage do seu provedor de pagamento) e atualize as URLs em `src/funnel.js` (`ASSETS`).

### 5. Rodar localmente
```bash
npm install
cp .env.example .env   # preencha com seus dados reais
npm run dev
```

### 6. Deploy (Railway ou Render)
1. Suba este projeto para um repositório no GitHub.
2. Crie um novo serviço no [Railway](https://railway.app) ou [Render](https://render.com) e conecte o repositório.
3. Configure as variáveis de ambiente do `.env` no painel do serviço.
4. Após o deploy, use a URL pública gerada para configurar os webhooks (passos 2 e 3 acima).

## Estrutura do projeto

```
whatsapp-funil/
├── src/
│   ├── server.js          # Webhooks (WhatsApp + pagamento)
│   ├── funnel.js          # Lógica do fluxo de mensagens
│   ├── whatsappClient.js  # Envio de texto/áudio/imagem/documento/botões
│   ├── payment.js         # Criação de cobrança Pix
│   └── db.js               # Estado das conversas (SQLite local)
├── .env.example
└── package.json
```

## Por que isso é diferente de um "disparo em massa"

- Cada resposta é disparada por uma mensagem que o próprio lead mandou primeiro (opt-in).
- Não há lista de números sendo varrida e mensageada sem consentimento.
- O pagamento é rastreável (CNPJ, webhook de confirmação), sem depender de "confiança".
- Está dentro dos Termos de Serviço da Meta para uso comercial do WhatsApp.
