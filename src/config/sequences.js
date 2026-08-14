/**
 * ============================================================
 *  EDITE AQUI: textos, áudios, imagens, PDFs e tempos de espera
 * ============================================================
 */

export const MINUTOS_SEM_ESCOLHA_ANTES_DE_REENGAJAR = 20;
export const HORAS_SEM_PAGAMENTO_ANTES_DE_LEMBRAR = 2;

// ============ SEQUÊNCIA 1: BOAS-VINDAS (lead novo) ============
export const sequenciaBoasVindas = [
  {
    type: "text",
    text: `Olá querida {nome}, tudo bem 💖?

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
    text: `Eu vou te enviar o material antecipadamente pois trabalhamos na honestidade *mas antes de responder, verifique se realmente possa pagar, acredito que você seja uma pessoa de Deus e honesta e que vai me pagar certinho. Se não puder me pagar nem responda pois vai prejudicar o meu trabalho❤️*`,
    delayAfter: 3,
  },
  {
    type: "buttons",
    text: "*Qual das 2 opções você prefere amada?*",
    options: ["Opção 1 - R$10", "Opção 2 - R$17"],
    delayAfter: 0,
  },
];

// ============ SEQUÊNCIA 2: OPÇÃO 1 ESCOLHIDA (só torta, R$10) ============
export const sequenciaCobrancaOpcao1 = [
  { type: "text", text: "Maravilha, vou te enviar abaixo a apostila e logo em seguida meu pix. 🥰", delayAfter: 3 },
  {
    type: "document",
    url: "https://raw.githubusercontent.com/Dayanybentorondon119/WhatsApp-Funil/main/src/Tortas-Geladas-Gourmetda%20Maria_Copinho%20%28DEMO%29%202.pdf",
    filename: "Demo-Tortas-Geladas-Gourmet.pdf",
    caption: "",
    delayAfter: 3,
  },
  { type: "text", text: "Prontinho.. Para abrir a apostila é só clicar logo acima👆👆👆\n\nVou te mandar agora meu pix!", delayAfter: 3 },
  { type: "text", text: "💳 Valor: R$10,00 via Pix\n🔢 Chave Pix (E-Mail):", delayAfter: 2 },
  { type: "text", text: "ceciliarondonweb@gmail.com", delayAfter: 2 },
  { type: "text", text: "Está em nome de *Cecilia Ferreira Dias Rondon*\nMinha Mãe", delayAfter: 3 },
  { type: "text", text: "✅ Após o pagamento, me ENVIE o comprovante em PDF aqui por gentileza!", delayAfter: 3 },
  {
    type: "text",
    text: "Aguardo você honrar seu compromisso comigo e me enviar o comprovante abaixo. Na fé de Deus🙏🏻. *SEI QUE VOCÊ É UMA PESSOA HONESTA E VAI CUMPRIR COM SUA PALAVRA, POIS VOCÊ É UM EXEMPLO PARA SUA FAMÍLIA*",
    delayAfter: 3,
  },
  {
    type: "text",
    text: "😍🔥 *PRESENTE ESPECIAL* 😍🔥\n\nMe enviando o pix em até 10 minutos eu vou te dar um *BÔNUS MUITO ESPECIAL*!!\n\nEsse é o segredo que muita gente usa para dobrar o faturamento trabalhando em casa...",
    delayAfter: 0,
  },
];

// ============ SEQUÊNCIA 3: OPÇÃO 2 ESCOLHIDA (torta + pudim, R$17) ============
export const sequenciaCobrancaOpcao2 = [
  { type: "text", text: "Maravilha, vou te enviar abaixo a apostila e logo em seguida meu pix. 🥰", delayAfter: 3 },
  {
    type: "document",
    url: "https://raw.githubusercontent.com/Dayanybentorondon119/WhatsApp-Funil/main/src/Tortas-Geladas-Gourmetda%20Maria_Copinho%20%28DEMO%29%202.pdf",
    filename: "Demo-Tortas-Geladas-Gourmet.pdf",
    caption: "",
    delayAfter: 2,
  },
  {
    type: "document",
    url: "https://raw.githubusercontent.com/Dayanybentorondon119/WhatsApp-Funil/main/src/Pudins%20Sem%20Fogo%20Gourmet%20da%20Maria%28DEMO%29%202.pdf",
    filename: "Demo-Pudins-Sem-Forno.pdf",
    caption: "",
    delayAfter: 3,
  },
  { type: "text", text: "Prontinho.. Para abrir a apostila é só clicar logo acima👆👆👆\n\nVou te mandar agora meu pix!", delayAfter: 3 },
  { type: "text", text: "💳 Valor: R$17,00 via Pix\n🔢 Chave Pix (E-Mail):", delayAfter: 2 },
  { type: "text", text: "ceciliarondonweb@gmail.com", delayAfter: 2 },
  { type: "text", text: "Está em nome de *Cecilia Ferreira Dias Rondon*\nMinha Mãe", delayAfter: 3 },
  { type: "text", text: "✅ Após o pagamento, me ENVIE o comprovante em PDF aqui por gentileza!", delayAfter: 3 },
  {
    type: "text",
    text: "Aguardo você honrar seu compromisso comigo e me enviar o comprovante abaixo. Na fé de Deus🙏🏻. *SEI QUE VOCÊ É UMA PESSOA HONESTA E VAI CUMPRIR COM SUA PALAVRA, POIS VOCÊ É UM EXEMPLO PARA SUA FAMÍLIA*",
    delayAfter: 3,
  },
  {
    type: "text",
    text: "😍🔥 *PRESENTE ESPECIAL* 😍🔥\n\nMe enviando o pix em até 10 minutos eu vou te dar um *BÔNUS MUITO ESPECIAL*!!\n\nEsse é o segredo que muita gente usa para dobrar o faturamento trabalhando em casa...",
    delayAfter: 0,
  },
];

// ============ SEQUÊNCIA 4: PAGAMENTO CONFIRMADO (liberado manualmente por você) ============
export const sequenciaPagamentoConfirmadoOpcao1 = [
  { type: "text", text: "Pagamento confirmado! Muito obrigada 💛 Já vou te mandar o material completo.", delayAfter: 3 },
  {
    type: "document",
    url: "https://raw.githubusercontent.com/Dayanybentorondon119/WhatsApp-Funil/main/src/Tortinhas%20Geladas%20Gourmet%20Copinho.pdf",
    filename: "Tortas-Geladas-Gourmet-Completo.pdf",
    caption: "Aqui está seu material completo! 🥧",
    delayAfter: 3,
  },
  {
    type: "document",
    url: "https://raw.githubusercontent.com/Dayanybentorondon119/WhatsApp-Funil/main/src/Coxinhas-Gourmet.pdf",
    filename: "Bonus-Coxinhas-Gourmet.pdf",
    caption: "E aqui seu BÔNUS especial 🎁",
    delayAfter: 0,
  },
];

export const sequenciaPagamentoConfirmadoOpcao2 = [
  { type: "text", text: "Pagamento confirmado! Muito obrigada 💛 Já vou te mandar o material completo.", delayAfter: 3 },
  {
    type: "document",
    url: "https://raw.githubusercontent.com/Dayanybentorondon119/WhatsApp-Funil/main/src/Tortinhas%20Geladas%20Gourmet%20Copinho.pdf",
    filename: "Tortas-Geladas-Gourmet-Completo.pdf",
    caption: "Aqui está seu material completo! 🥧",
    delayAfter: 2,
  },
  {
    type: "document",
    url: "https://raw.githubusercontent.com/Dayanybentorondon119/WhatsApp-Funil/main/src/Pudim%20Gourmet%20Sem%20fogo.pdf",
    filename: "Pudins-Sem-Forno-Completo.pdf",
    caption: "Aqui está seu material completo de pudins! 🍮",
    delayAfter: 3,
  },
  {
    type: "document",
    url: "https://raw.githubusercontent.com/Dayanybentorondon119/WhatsApp-Funil/main/src/Coxinhas-Gourmet.pdf",
    filename: "Bonus-Coxinhas-Gourmet.pdf",
    caption: "E aqui seu BÔNUS especial 🎁",
    delayAfter: 0,
  },
];

// ============ SEQUÊNCIA 5: LEAD NÃO ESCOLHEU NENHUMA OPÇÃO ============
export const sequenciaReengajamentoEscolha = [
  {
    type: "text",
    text: "Oi {nome}! Vi que você chegou a ver as 2 opções — ficou alguma dúvida? Qual você prefere, a 1 ou a 2? 🥧",
    delayAfter: 0,
  },
];

// ============ SEQUÊNCIA 6: LEMBRETE DE PAGAMENTO PENDENTE ============
export const sequenciaLembretePagamento = [
  {
    type: "text",
    text: "Oi! Passando aqui só pra lembrar que seu acesso ao material ainda está reservado. Se já pagou, me manda o comprovante que eu libero na hora! Qualquer dúvida, me chama 🥧",
    delayAfter: 0,
  },
];

// ============ MENSAGEM PARA QUEM JÁ PAGOU E MANDOU MENSAGEM DE NOVO ============
export const mensagemJaPago =
  "Já te enviei seu material! Qualquer dúvida sobre as receitas, é só chamar por aqui. 🥧";

export const mensagemAguardandoPagamento =
  "Recebi sua mensagem! Assim que eu conferir seu comprovante, libero seu material completo por aqui. Qualquer dúvida, me chama.";
