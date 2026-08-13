import { sendText, sendAudio, sendImage, sendButtons, sendDocument } from "./whatsappClient.js";
import {
  getOrCreateLead,
  updateStage,
  saveCpf,
  markReminderSent,
  markReengagementSent,
  findLeadsAwaitingPaymentOlderThan,
  findLeadsWithoutInteraction,
} from "./db.js";
import { createPixCharge } from "./payment.js";
import * as cfg from "./config/sequences.js";

const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

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

export async function handleIncomingMessage({ from, name, text, buttonId }) {
  const lead = getOrCreateLead(from, name);

  if (lead.stage === "novo") {
    await enviarSequencia(from, cfg.sequenciaBoasVindas, { nome: name });
    updateStage(from, "aguardando_interesse");
    return;
  }

  if (lead.stage === "aguardando_interesse") {
    const quisAceitar = buttonId === "btn_0" || /sim/i.test(text || "");

    if (quisAceitar) {
      await sendText(from, cfg.mensagemPedirCpf);
      updateStage(from, "aguardando_cpf");
    } else {
      await enviarSequencia(from, cfg.sequenciaContarMais, { nome: name });
    }
    return;
  }

  if (lead.stage === "aguardando_cpf") {
    const cpfLimpo = (text || "").replace(/\D/g, "");

    if (cpfLimpo.length !== 11) {
      await sendText(from, cfg.mensagemCpfInvalido);
      return;
    }

    saveCpf(from, cpfLimpo);
    const charge = await createPixCharge({ phone: from, amount: cfg.PRECO_PRODUTO, name, cpf: cpfLimpo });
    await enviarSequencia(from, cfg.sequenciaCobranca, { link: charge.paymentLink });
    updateStage(from, "aguardando_pagamento", charge.paymentId);
    return;
  }

  if (lead.stage === "pago") {
    await sendText(from, cfg.mensagemJaPago);
    return;
  }

  if (lead.stage === "aguardando_pagamento") {
    await sendText(from, cfg.mensagemAguardandoPagamento);
  }
}

export async function handlePaymentConfirmed(lead) {
  await enviarSequencia(lead.phone, cfg.sequenciaPagamentoConfirmado, { nome: lead.name });
  updateStage(lead.phone, "pago");
}

export async function enviarLembretesPendentes() {
  const pendentes = findLeadsAwaitingPaymentOlderThan(cfg.HORAS_SEM_PAGAMENTO_ANTES_DE_LEMBRAR);

  for (const lead of pendentes) {
    await enviarSequencia(lead.phone, cfg.sequenciaLembretePagamento, { nome: lead.name });
    markReminderSent(lead.phone);
  }
}

export async function enviarReengajamentos() {
  const semInteracao = findLeadsWithoutInteraction(cfg.MINUTOS_SEM_INTERACAO_ANTES_DE_REENGAJAR);

  for (const lead of semInteracao) {
    await enviarSequencia(lead.phone, cfg.sequenciaReengajamento, { nome: lead.name });
    markReengagementSent(lead.phone);
  }
}
