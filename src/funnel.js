import { sendText, sendImage, sendButtons, sendDocument } from "./whatsappClient.js";
import {
  getOrCreateLead,
  updateStage,
  markReminderSent,
  markReengagementSent,
  findLeadsAwaitingPaymentOlderThan,
  findLeadsWithoutChoice,
} from "./db.js";
import * as cfg from "./config/sequences.js";

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

  if (lead.stage === "pago") {
    await sendText(from, cfg.mensagemJaPago);
    return;
  }

  if (lead.stage === "aguardando_pagamento") {
    await sendText(from, cfg.mensagemAguardandoPagamento);
  }
}

/**
 * Chamado quando VOCÊ libera manualmente pela página de admin.
 */
export async function handlePaymentConfirmed(lead) {
  const sequencia =
    lead.opcao === "2" ? cfg.sequenciaPagamentoConfirmadoOpcao2 : cfg.sequenciaPagamentoConfirmadoOpcao1;
  await enviarSequencia(lead.phone, sequencia, { nome: lead.name });
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
  const semEscolha = findLeadsWithoutChoice(cfg.MINUTOS_SEM_ESCOLHA_ANTES_DE_REENGAJAR);

  for (const lead of semEscolha) {
    await enviarSequencia(lead.phone, cfg.sequenciaReengajamentoEscolha, { nome: lead.name });
    markReengagementSent(lead.phone);
  }
}
