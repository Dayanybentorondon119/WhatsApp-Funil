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
    url: "https://cdn.jsdelivr.net/gh/Dayanybentorondon119/WhatsApp-Funil@main/src/demo-torta.pdf.pdf",
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
    url: "https://cdn.jsdelivr.net/gh/Dayanybentorondon119/WhatsApp-Funil@main/src/demo-torta.pdf.pdf",
    filename: "Demo-Tortas-Geladas-Gourmet.pdf",
    caption: "",
    delayAfter: 2,
  },
  {
    type: "document",
    url: "https://cdn.jsdelivr.net/gh/Dayanybentorondon119/WhatsApp-Funil@main/src/demo-pudim.pdf.pdf",
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
    url: "https://cdn.jsdelivr.net/gh/Dayanybentorondon119/WhatsApp-Funil@main/src/Tortinhas%20Geladas%20Gourmet%20Copinho.pdf",
    filename: "Tortas-Geladas-Gourmet-Completo.pdf",
    caption: "Aqui está seu material completo! 🥧",
    delayAfter: 3,
  },
  {
    type: "document",
    url: "https://cdn.jsdelivr.net/gh/Dayanybentorondon119/WhatsApp-Funil@main/src/Coxinhas-Gourmet.pdf",
    filename: "Bonus-Coxinhas-Gourmet.pdf",
    caption: "E aqui seu BÔNUS especial 🎁",
    delayAfter: 0,
  },
];

export const sequenciaPagamentoConfirmadoOpcao2 = [
  { type: "text", text: "Pagamento confirmado! Muito obrigada 💛 Já vou te mandar o material completo.", delayAfter: 3 },
  {
    type: "document",
    url: "https://cdn.jsdelivr.net/gh/Dayanybentorondon119/WhatsApp-Funil@main/src/Tortinhas%20Geladas%20Gourmet%20Copinho.pdf",
    filename: "Tortas-Geladas-Gourmet-Completo.pdf",
    caption: "Aqui está seu material completo! 🥧",
    delayAfter: 2,
  },
  {
    type: "document",
    url: "https://cdn.jsdelivr.net/gh/Dayanybentorondon119/WhatsApp-Funil@main/src/Pudim%20Gourmet%20Sem%20fogo.pdf",
    filename: "Pudins-Sem-Forno-Completo.pdf",
    caption: "Aqui está seu material completo de pudins! 🍮",
    delayAfter: 3,
  },
  {
    type: "document",
    url: "https://cdn.jsdelivr.net/gh/Dayanybentorondon119/WhatsApp-Funil@main/src/Coxinhas-Gourmet.pdf",
    filename: "Bonus-Coxinhas-Gourmet.pdf",
    caption: "E aqui seu BÔNUS especial 🎁",
    delayAfter: 0,
  },
];

// ============ SEQUÊNCIA 4B: OFERTA DO UPSELL (enviada logo após a entrega principal) ============
export const sequenciaOfertaUpsell = [
  {
    type: "text",
    text: `🌸 Amiga, antes de encerrar, quero te mostrar algo que pode mudar ainda mais sua vida!

Estou falando do *COMBO ESPECIAL com 60 RECEITAS GOURMET* — tudo pronto para você começar a vender e lucrar sem precisar sair de casa.

🍰 *O que você vai receber nesse COMBO EXCLUSIVO:*

✅ 20 RECEITAS DE BOLO NO POTE GOURMET
(Morango com Ninho, Banana com Doce de Leite, MUITO mais…)

✅ 20 RECEITAS DE SOBREMESA GOURMET
(Pavê de Leite Ninho e Morango, Mousse de Maracujá com Chantilly, Sensação de Morango com Chocolate e MUITO mais…)

✅ 20 RECEITAS DE PASTEL GOURMET CROCANTES
(Camarão com Queijo, Frango com Catupiry, Chocolate com Morango e MUITO mais…)

🎁 *E ainda vem com BÔNUS INCRÍVEIS:*
✔️ Técnicas e Dicas de Montagem de Pratos Profissionais
✔️ Conservação e Validade
✔️ Precificação Inteligente
✔️ Estratégias de Divulgação nas Redes Sociais
✔️ E muito mais para você transformar receitas em uma fonte de renda real!

🔥 Esse combo custa R$97, MAS SOMENTE HOJE VOCÊ TEM A CHANCE DE ADQUIRIR POR APENAS *R$15*.`,
    delayAfter: 3,
  },
  {
    type: "text",
    text: `🚨 Você não vai deixar essa oportunidade passar de garantir hoje esse COMBO GOURMET COMPLETO que vai ainda mais aumentar sua renda sem sair de casa

Se você não quer perder essa oportunidade *DIGITE SIM*`,
    delayAfter: 0,
  },
];

// ============ SEQUÊNCIA 4C: COBRANÇA DO UPSELL (lead respondeu "SIM") ============
export const sequenciaCobrancaUpsell = [
  { type: "text", text: "Maravilha! Vou te mandar o pix pra garantir seu Combo Gourmet 🥰", delayAfter: 3 },
  { type: "text", text: "💳 Valor: R$15,00 via Pix\n🔢 Chave Pix (E-Mail):", delayAfter: 2 },
  { type: "text", text: "ceciliarondonweb@gmail.com", delayAfter: 2 },
  { type: "text", text: "Está em nome de *Cecilia Ferreira Dias Rondon*\nMinha Mãe", delayAfter: 3 },
  { type: "text", text: "✅ Após o pagamento, me ENVIE o comprovante em PDF aqui por gentileza que libero seu combo na hora!", delayAfter: 0 },
];

// ============ SEQUÊNCIA 4D: ENTREGA DO UPSELL (liberado manualmente por você) ============
export const sequenciaEntregaUpsell = [
  { type: "text", text: "Pagamento confirmado! Aqui está seu Combo Gourmet completo, com as 60 receitas 💛", delayAfter: 3 },
  {
    type: "document",
    url: "https://cdn.jsdelivr.net/gh/Dayanybentorondon119/WhatsApp-Funil@main/src/Receitas%20Gourmet%20de%20Bolo%20no%20Pote.pdf",
    filename: "Receitas-Bolo-no-Pote-Gourmet.pdf",
    caption: "20 Receitas de Bolo no Pote Gourmet 🍰",
    delayAfter: 2,
  },
  {
    type: "document",
    url: "https://cdn.jsdelivr.net/gh/Dayanybentorondon119/WhatsApp-Funil@main/src/RECEITAS%20GOURMET%20DE%20SOBREMESA.pdf",
    filename: "Receitas-Sobremesa-Gourmet-Copinho.pdf",
    caption: "20 Receitas de Sobremesa Gourmet no Copinho 🍮",
    delayAfter: 2,
  },
  {
    type: "document",
    url: "https://cdn.jsdelivr.net/gh/Dayanybentorondon119/WhatsApp-Funil@main/src/Receitas%20de%20Pastel%20Gourmet%20Deliciosos%20e%20Crocantes.pdf",
    filename: "Receitas-Pastel-Gourmet.pdf",
    caption: "20 Receitas de Pastel Gourmet Crocante 🥟",
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
    text: "Oi querida, notei que você ainda não finalizou o pagamento da sua apostila 🥹\nFicou alguma dúvida ou travou em algo? Tô aqui pra te ajudar!\n\nSe quiser, aqui está o pix de novo, é só copiar:\nceciliarondonweb@gmail.com\n\nAssim que enviar o comprovante, libero tudo certinho pra você 💖",
    delayAfter: 0,
  },
];

// ============ MENSAGENS PARA QUEM JÁ PAGOU E MANDOU MENSAGEM DE NOVO ============
export const mensagemJaPago =
  "Já te enviei seu material! Qualquer dúvida sobre as receitas, é só chamar por aqui. 🥧";

export const mensagemAguardandoPagamento =
  "Recebi sua mensagem! Assim que eu conferir seu comprovante, libero seu material completo por aqui. Qualquer dúvida, me chama.";

export const mensagemAguardandoPagamentoUpsell =
  "Recebi sua mensagem! Assim que eu conferir seu comprovante do Combo Gourmet, libero tudo certinho por aqui. Qualquer dúvida, me chama.";
