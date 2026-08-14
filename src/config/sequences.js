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

export const MINUTOS_SEM_INTERACAO_ANTES_DE_REENGAJAR = 10;

export const HORAS_SEM_PAGAMENTO_ANTES_DE_LEMBRAR = 3;

// ============ SEQUÊNCIA 1: BOAS-VINDAS (lead novo) ============
export const sequenciaBoasVindas = [
  {
    type: "text",
    text: `Olá querida {nome}, boa tarde, tudo bem 💖?

Eu *preparei 2 opções especiais de receitas de tortas geladas gourmet*, tudo simples, caseiro e lucrativo.

Você recebe direto no WhatsApp e só paga depois que eu te enviar tudinho 💸

Vou te enviar as opções, ok?

*Mas atenção:* Estou liberando essa condição somente para 50 primeiras pessoas que garantirem hoje. *E para garantir que você tenha essa condição especial e acesso a todo material poderia salvar meu contato por gentileza*.`,
    delayAfter: 3,
  },
  {
    type: "image",
    url: "https://i.imgur.com/C0CxYXh.jpeg",
    caption: `*OPÇÃO 1 - GUIA DE RECEITAS GOURMET DE TORTAS GELADAS*

GUIA COM 20 RECEITAS EXCLUSIVAS DE TORTAS GELADAS GOURMET.

Tortinha de Limão
Tortinha de Maracujá com Chocolate
Tortinha de Banoffe
Tortinha de Chocolate com Cereja
Tortinha Kinder Bueno

*E MUITO MAIS…*

*TUDO POR APENAS R$ 10*`,
    delayAfter: 3,
  },
  {
    type: "image",
    url: "https://i.imgur.com/AtkLx66.jpeg",
    caption: `*OPÇÃO 2 - GUIA DE RECEITAS GOURMET DE TORTAS GELADAS*
➕ *GUIA COM RECEITAS DE PUDIM GOURMET SEM FOGO*

*COM 20 RECEITAS EXCLUSIVAS:*

Pudim de Maracujá Sem Forno
Pudim de Frutas Tropicais Sem Forno
Pudim de Chocolate Cremoso Sem Forno
Pudim de Coco com Leite Condensado Sem Forno
Pudim de Nutella Sem Forno
*E MUITO MAIS…*

*TUDO POR APENAS R$ 17*`,
    delayAfter: 3,
  },
  {
    type: "text",
    text: `*Qual das 2 opções você prefere amada?*

*OPÇÃO 1 - R$10*
Inclui apenas 20 receitas de torta gelada gourmet

*OPÇÃO 2 - R$17 COMPLETA*
Inclui com todas as receitas de torta gelada gourmet + as receitas de pudim sem forno gourmet com todo conteúdo que te informei acima`,
    delayAfter: 3,
  },
  {
    type: "text",
    text: `Eu vou te enviar o material antecipadamente pois trabalhamos na honestidade *mas antes de responder, verifique se realmente possa pagar, acredito que você seja uma pessoa de Deus e honesta e que vai me pagar certinho. Se não puder me pagar nem responda pois vai prejudicar o meu trabalho❤️*

Só me responder se prefere a opção 1 ou a 2 e já te envio.`,
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

// ============ NOVO: PEDIR O CPF ANTES DE GERAR A COBRANÇA ============
export const mensagemPedirCpf =
  "Perfeito! 🎉 Pra eu gerar sua chave Pix, me manda seu CPF (só os números, sem pontos nem traço).";

export const mensagemCpfInvalido =
  "Esse CPF não parece completo 🤔 Manda só os 11 números, sem espaço nem pontuação.";

// ============ SEQUÊNCIA 3: CLIENTE ACEITOU (gera cobrança) ============
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
