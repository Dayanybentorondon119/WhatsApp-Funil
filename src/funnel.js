import { sendText, sendImage, sendImageById, sendButtons, sendDocument } from "./whatsappClient.js";
import {
  getOrCreateLead,
  updateStage,
  markReminderSent,
  markReengagementSent,
  findLeadsAwaitingPaymentOlderThan,
  findLeadsWithoutChoice,
  findLeadByPhone,
  findLeadsAguardandoRespostaUpsell,
} from "./db.js";
import * as cfg from "./config/sequences.js";

// Número do SEU WhatsApp pessoal, que vai receber os avisos de comprovante.
const ADMIN_WHATSAPP_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER;

const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

async function enviarSequencia(to, passos, variaveis = {}) {
  for (const passo of passos) {
    const texto = passo.text ? substituirVariaveis(passo.text, variaveis) : undefined;
    switch (passo.type) {
      case "text":
        await sendText(to, texto);
        break;
      case "image":
        await sendImage(to, passo.url, passo.caption || "");
        break;
      case "document":
        await sendDocument(to, passo.url, passo.filename, passo.caption || "");
        break;
      case "buttons":
        await sendButtons(to, texto, passo.options);
        break;
    }
    if (passo.delayAfter) await sleep(passo.delayAfter);
  }
}

function substituirVariaveis(texto, variaveis) {
  return texto.replace("{nome}", variaveis.nome || "");
}

export async function handleIncomingMessage({ from, name, text, buttonId }) {
  const lead = getOrCreateLead(from, name);

  if (lead.stage === "novo") {
    await enviarSequencia(from, cfg.sequenciaBoasVindas, { nome: name });
    updateStage(from, "aguardando_interesse");
    return;
  }

  if (lead.stage === "aguardando_interesse") {
    const escolheuOpcao1 = buttonId === "btn_0" || /\b1\b/.test(text || "");
    const escolheuOpcao2 = buttonId === "btn_1" || /\b2\b/.test(text || "");
    if (escolheuOpcao1) {
      await enviarSequencia(from, cfg.sequenciaCobrancaOpcao1, { nome: name });
      updateStage(from, "aguardando_pagamento", "1");
    } else if (escolheuOpcao2) {
      await enviarSequencia(from, cfg.sequenciaCobrancaOpcao2, { nome: name });
      updateStage(from, "aguardando_pagamento", "2");
    }
    return;
  }

  if (lead.stage === "aguardando_pagamento") {
    await sendText(from, cfg.mensagemAguardandoPagamento);
    return;
  }

  // Lead já recebeu o material principal e a oferta do combo por R$15.
  if (lead.stage === "pago") {
    const respondeuSim = /\bsim\b/i.test(text || "");
    if (respondeuSim) {
      await enviarSequencia(from, cfg.sequenciaCobrancaUpsell, { nome: name });
      updateStage(from, "aguardando_pagamento_upsell");
    } else {
      // Não aceitou por R$15 — oferece a última chance por R$10.
      await enviarSequencia(from, cfg.sequenciaOfertaDownsellUpsell, { nome: name });
      updateStage(from, "pago_downsell_ofertado");
    }
    return;
  }

  // Lead recebeu a oferta de downsell (R$10) e ainda não respondeu.
  if (lead.stage === "pago_downsell_ofertado") {
    const respondeuSim = /\bsim\b/i.test(text || "");
    if (respondeuSim) {
      await enviarSequencia(from, cfg.sequenciaCobrancaUpsellDownsell, { nome: name });
      updateStage(from, "aguardando_pagamento_upsell");
    } else {
      await sendText(from, cfg.mensagemJaPago);
    }
    return;
  }

  if (lead.stage === "aguardando_pagamento_upsell") {
    await sendText(from, cfg.mensagemAguardandoPagamentoUpsell);
    return;
  }

  // Lead já comprou o combo também — não tem mais nada pra oferecer.
  if (lead.stage === "pago_upsell") {
    await sendText(from, cfg.mensagemJaPago);
    return;
  }
}

/**
 * Chamado quando VOCÊ libera manualmente pela página de admin
 * (pagamento do produto principal confirmado).
 */
export async function handlePaymentConfirmed(lead) {
  const sequencia =
    lead.opcao === "2" ? cfg.sequenciaPagamentoConfirmadoOpcao2 : cfg.sequenciaPagamentoConfirmadoOpcao1;
  await enviarSequencia(lead.phone, sequencia, { nome: lead.name });
  updateStage(lead.phone, "pago");

  // Logo em seguida, oferece o combo de upsell (R$15).
  await enviarSequencia(lead.phone, cfg.sequenciaOfertaUpsell, { nome: lead.name });
}

/**
 * Chamado quando VOCÊ libera manualmente pela página de admin
 * (pagamento do combo/upsell confirmado).
 */
export async function handleUpsellPaymentConfirmed(lead) {
  await enviarSequencia(lead.phone, cfg.sequenciaEntregaUpsell, { nome: lead.name });
  updateStage(lead.phone, "pago_upsell");
}

/**
 * Chamado quando um lead manda uma IMAGEM (provável comprovante).
 * Encaminha pro seu WhatsApp pessoal com os dados do lead, pra você
 * conferir e liberar pelo /admin sem depender do nome bater.
 */
export async function notificarComprovanteRecebido({ from, name, mediaId }) {
  if (!ADMIN_WHATSAPP_NUMBER) {
    console.error("ADMIN_WHATSAPP_NUMBER não configurado — não foi possível encaminhar o comprovante.");
    return;
  }
  const lead = findLeadByPhone(from);
  const situacao = lead ? `${lead.stage}${lead.opcao ? ` (Opção ${lead.opcao})` : ""}` : "lead não encontrado";

  await sendText(
    ADMIN_WHATSAPP_NUMBER,
    `📩 *Comprovante recebido!*\n\nNome: ${name || "(sem nome)"}\nTelefone: ${from}\nSituação: ${situacao}`
  );
  await sendImageById(ADMIN_WHATSAPP_NUMBER, mediaId, "Comprovante enviado pelo lead ☝️");
}

export async function enviarLembretesPendentes() {
  const pendentes = findLeadsAwaitingPaymentOlderThan(cfg.HORAS_SEM_PAGAMENTO_ANTES_DE_LEMBRAR);
  for (const lead of pendentes) {
    await enviarSequencia(lead.phone, cfg.sequenciaLembretePagamento, { nome: lead.name });
    markReminderSent(lead.phone);
  }
}

export async function enviarReengajamentos() {
  const semEscolha = findLeadsWithoutChoice(cfg.MINUTOS_SEM_ESCOLHA_ANTES_DE_REENGAJAR);
  for (const lead of semEscolha) {
    await enviarSequencia(lead.phone, cfg.sequenciaReengajamentoEscolha, { nome: lead.name });
    markReengagementSent(lead.phone);
  }
}

/**
 * Roda periodicamente: manda o downsell (R$10) automaticamente pra quem
 * recebeu a oferta de R$15 e ficou sem responder nada por 20 minutos.
 */
export async function enviarDownsellAutomatico() {
  const semResposta = findLeadsAguardandoRespostaUpsell(cfg.MINUTOS_SEM_RESPOSTA_UPSELL_ANTES_DE_DOWNSELL);
  for (const lead of semResposta) {
    await enviarSequencia(lead.phone, cfg.sequenciaOfertaDownsellUpsell, { nome: lead.name });
    updateStage(lead.phone, "pago_downsell_ofertado");
  }
}
