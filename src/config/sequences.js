/**
 * ============================================================
 *  EDITE AQUI: textos, áudios, imagens, PDFs e tempos de espera
 * ============================================================
 * Esse é o único arquivo que você precisa mexer pra mudar o
 * conteúdo do funil. A lógica (o "motor") fica em funnel.js e
 * você não precisa tocar nela.
 *
 * Cada sequência é uma lista de passos. Tipos possíveis:
 *   - { type: "text", text: "..." }
 *   - { type: "audio", url: "..." }
 *   - { type: "image", url: "...", caption: "..." }
 *   - { type: "document", url: "...", filename: "...", caption: "..." }
 *   - { type: "buttons", text: "...", options: ["...", "..."] }
 *
 * "delayAfter" = quantos segundos esperar DEPOIS de mandar esse
 * passo, antes de mandar o próximo (evita parecer robô disparando
 * tudo de uma vez).
 * ============================================================
 */

export const PRECO_PRODUTO = 10.0;

// Quantos minutos esperar sem resposta do cliente antes de mandar
// uma mensagem de reengajamento (pra não perder o lead)
export const MINUTOS_SEM_INTERACAO_ANTES_DE_REENGAJAR = 10;

// Quantas horas esperar sem pagamento antes de mandar o lembrete de cobrança
export const HORAS_SEM_PAGAMENTO_ANTES_DE_LEMBRAR = 3;

// ============ SEQUÊNCIA 1: BOAS-VINDAS (lead novo) ============
export const sequenciaBoasVindas = [
  {
    type: "text",
    text: "Oi {nome}! Que bom te ver por aqui 🥗 Sou especialista em receitas de saladas gourmet.",
    delayAfter: 10,
  },
  {
    type: "audio",
    url: "https://SEU-DOMINIO.com/assets/apresentacao.ogg",
    delayAfter: 12,
  },
  {
    type: "image",
    url: "https://SEU-DOMINIO.com/assets/capa-ebook.jpg",
    caption: "80+ receitas de saladas premium para secar comendo bem ✨",
    delayAfter: 8,
  },
  {
    type: "buttons",
    text: "Quer receber o material completo agora?",
    options: ["Sim, quero!", "Me conta mais"],
    delayAfter: 0,
  },
];

// ============ SEQUÊNCIA 2: CLIENTE QUIS SABER MAIS (não decidiu ainda) ============
export const sequenciaContarMais = [
  {
    type: "text",
    text: "São mais de 80 receitas práticas, com opções para emagrecer de forma saudável, ideais pra quem treina ou quer variar a alimentação.",
    delayAfter: 8,
  },
  {
    type: "buttons",
    text: "Posso liberar o acesso pra você?",
    options: ["Sim, quero!"],
    delayAfter: 0,
  },
];

// ============ SEQUÊNCIA 3: CLIENTE ACEITOU (gera cobrança) ============
// O {link} é substituído automaticamente pelo link de pagamento gerado.
export const sequenciaCobranca = [
  {
    type: "text",
    text: "Perfeito! O material completo custa R${preco}. Assim que o pagamento for confirmado, eu libero tudo automaticamente aqui:\n\n{link}",
    delayAfter: 0,
  },
];

// ============ SEQUÊNCIA 4: PAGAMENTO CONFIRMADO ============
export const sequenciaPagamentoConfirmado = [
  {
    type: "text",
    text: "Pagamento confirmado! Muito obrigada 💛 Já vou te mandar o material completo.",
    delayAfter: 6,
  },
  {
    type: "document",
    url: "https://SEU-DOMINIO.com/assets/receitas-saladas.pdf",
    filename: "Receitas-Saladas-Premium.pdf",
    caption: "Aqui está seu material completo! 🥗",
    delayAfter: 5,
  },
  {
    type: "text",
    text: "Bom apetite e qualquer dúvida sobre as receitas, chama por aqui!",
    delayAfter: 0,
  },
];

// ============ SEQUÊNCIA 5: CLIENTE NÃO INTERAGIU (reengajamento) ============
export const sequenciaReengajamento = [
  {
    type: "text",
    text: "Oi {nome}! Vi que você chegou a ver o material das receitas — ficou alguma dúvida? Tô por aqui se precisar 🥗",
    delayAfter: 0,
  },
];

// ============ SEQUÊNCIA 6: LEMBRETE DE PAGAMENTO PENDENTE ============
export const sequenciaLembretePagamento = [
  {
    type: "text",
    text: "Oi! Passando aqui só pra lembrar que seu acesso ao material ainda está reservado. Se quiser finalizar, o link de pagamento continua valendo. Qualquer dúvida, me chama! 🥗",
    delayAfter: 0,
  },
];

// ============ MENSAGENS DE REENGAJAMENTO PARA QUEM JÁ PAGOU ============
export const mensagemJaPago =
  "Já te enviei seu material! Qualquer dúvida sobre as receitas, é só chamar por aqui. 🥗";

export const mensagemAguardandoPagamento =
  "Assim que o pagamento for confirmado, libero seu material automaticamente por aqui! Qualquer dúvida, me chama.";
