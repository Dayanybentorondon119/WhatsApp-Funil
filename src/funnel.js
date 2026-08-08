import { sendText, sendAudio, sendImage, sendButtons, sendDocument } from "./whatsappClient.js";
import {
  getOrCreateLead,
  updateStage,
  markReminderSent,
  markReengagementSent,
  findLeadsAwaitingPaymentOlderThan,
  findLeadsWithoutInteraction,
} from "./db.js";
import { createPixCharge } from "./payment.js";
import * as cfg from "./config/sequences.js";

const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

/**
 * Envia uma sequência de passos definida em config/sequences.js,
 * respeitando o "delayAfter" (em segundos) entre cada mensagem.
 * Faz a substituição de {nome}, {preco} e {link} no texto.
 */
async function enviarSequencia(to, passos, variaveis = {}) {
  for (const passo of passos) {
    const texto = passo.text ? substituirVariaveis(passo.text, variaveis) : undefined;

    switch (passo.type) {
      case "text":
        await sendText(to, texto);
        break;
      case "audio":
        await sendAudio(to, passo.url);
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
  return texto
    .replace("{nome}", variaveis.nome || "")
    .replace("{preco}", (cfg.PRECO_PRODUTO || 0).toFixed(2))
    .replace("{link}", variaveis.link || "");
}

/**
 * Chamado quando chega QUALQUER mensagem nova de um lead.
 * Estágios: novo -> aguardando_interesse -> aguardando_pagamento -> pago
 */
export async function handleIncomingMessage({ from, name, text, buttonId }) {
  const lead = getOrCreateLead(from, name);

  // ===== 1) LEAD NOVO: sequência de boas-vindas completa, com delay entre mensagens =====
  if (lead.stage === "novo") {
    await enviarSequencia(from, cfg.sequenciaBoasVindas, { nome: name });
    updateStage(from, "aguardando_interesse");
    return;
  }

  // ===== 2) CLIENTE INTERAGIU: decide com base na resposta =====
  if (lead.stage === "aguardando_interesse") {
    const quisAceitar = buttonId === "btn_0" || /sim/i.test(text || "");

    if (quisAceitar) {
      const charge = await createPixCharge({ phone: from, amount: cfg.PRECO_PRODUTO, name });
      await enviarSequencia(from, cfg.sequenciaCobranca, { link: charge.paymentLink });
      updateStage(from, "aguardando_pagamento", charge.paymentId);
    } else {
      await enviarSequencia(from, cfg.sequenciaContarMais, { nome: name });
    }
    return;
  }

  // ===== 3) CLIENTE JÁ PAGOU: reengajamento se mandar mensagem de novo =====
  if (lead.stage === "pago") {
    await sendText(from, cfg.mensagemJaPago);
    return;
  }

  // ===== 4) AGUARDANDO PAGAMENTO: cliente mandou mensagem antes de pagar =====
  if (lead.stage === "aguardando_pagamento") {
    await sendText(from, cfg.mensagemAguardandoPagamento);
  }
}

/**
 * Chamado pelo webhook do provedor de pagamento quando um Pix é confirmado.
 * ===== 5) AGRADECIMENTO + ENTREGA AUTOMÁTICA (com delay entre mensagens) =====
 */
export async function handlePaymentConfirmed(lead) {
  await enviarSequencia(lead.phone, cfg.sequenciaPagamentoConfirmado, { nome: lead.name });
  updateStage(lead.phone, "pago");
}

/**
 * ===== 6) LEMBRETE AUTOMÁTICO DE PAGAMENTO PENDENTE =====
 * Roda periodicamente. Manda lembrete educado pra quem ficou parado
 * em "aguardando_pagamento" por mais tempo que o configurado.
 */
export async function enviarLembretesPendentes() {
  const pendentes = findLeadsAwaitingPaymentOlderThan(cfg.HORAS_SEM_PAGAMENTO_ANTES_DE_LEMBRAR);

  for (const lead of pendentes) {
    await enviarSequencia(lead.phone, cfg.sequenciaLembretePagamento, { nome: lead.name });
    markReminderSent(lead.phone);
  }
}

/**
 * ===== 7) REENGAJAMENTO: CLIENTE NÃO INTERAGIU APÓS AS BOAS-VINDAS =====
 * Roda periodicamente. Detecta quem recebeu as boas-vindas mas não
 * respondeu nada, e manda uma mensagem pra não perder o lead.
 */
export async function enviarReengajamentos() {
  const semInteracao = findLeadsWithoutInteraction(cfg.MINUTOS_SEM_INTERACAO_ANTES_DE_REENGAJAR);

  for (const lead of semInteracao) {
    await enviarSequencia(lead.phone, cfg.sequenciaReengajamento, { nome: lead.name });
    markReengagementSent(lead.phone);
  }
}
