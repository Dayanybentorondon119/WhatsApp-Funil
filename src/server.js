import "dotenv/config";
import express from "express";
import { handleIncomingMessage, handlePaymentConfirmed, enviarLembretesPendentes, enviarReengajamentos } from "./funnel.js";
import { findLeadByPaymentId } from "./db.js";

const app = express();
app.use(express.json());

// ============ WEBHOOK DO WHATSAPP ============

// 1) Verificação inicial exigida pela Meta ao configurar o webhook no painel
app.get("/webhook/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
console.log("DEBUG mode:", mode, "| token recebido:", JSON.stringify(token), "| token esperado:", JSON.stringify(process.env.WEBHOOK_VERIFY_TOKEN));
  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// 2) Recebimento de mensagens — cada requisição é UM lead, processado de forma independente.
//    Se chegarem 100 leads ao mesmo tempo, chegam 100 requisições em paralelo,
//    cada uma respondida individualmente e automaticamente por este mesmo handler.
app.post("/webhook/whatsapp", async (req, res) => {
  // Responde rápido para a Meta não reenviar o evento por timeout
  res.sendStatus(200);

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];
    if (!message) return; // pode ser evento de status (entregue/lido), ignoramos

    const from = message.from; // telefone do lead
    const contactName = change?.contacts?.[0]?.profile?.name;
    const text = message.text?.body;
    const buttonId = message.interactive?.button_reply?.id;

    await handleIncomingMessage({ from, name: contactName, text, buttonId });
  } catch (err) {
  console.error("Erro processando mensagem do WhatsApp:", JSON.stringify(err.response?.data || err.message || err, null, 2));
  }
});

// ============ WEBHOOK DE PAGAMENTO ============

// Chamado pelo provedor de pagamento (Mercado Pago/Asaas/etc.) quando o Pix é confirmado
app.post("/webhook/pagamento", async (req, res) => {
  res.sendStatus(200);

  try {
    // Validação básica: o Asaas envia esse token no header, configurado no painel
    const tokenRecebido = req.headers["asaas-access-token"];
    if (process.env.PAYMENT_WEBHOOK_SECRET && tokenRecebido !== process.env.PAYMENT_WEBHOOK_SECRET) {
      console.warn("Webhook de pagamento com token inválido, ignorando.");
      return;
    }

    // Formato do Asaas: { event: "PAYMENT_CONFIRMED", payment: { id, externalReference, status, ... } }
    const { event, payment } = req.body;
    const eventosDeConfirmacao = ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"];
    if (!eventosDeConfirmacao.includes(event)) return;

    const paymentId = payment.id;
    const lead = findLeadByPaymentId(paymentId);
    if (!lead) {
      console.warn("Pagamento confirmado mas lead não encontrado:", paymentId);
      return;
    }

    await handlePaymentConfirmed(lead);
  } catch (err) {
    console.error("Erro processando webhook de pagamento:", err);
  }
});

// ============ LEMBRETE AUTOMÁTICO (3H SEM PAGAMENTO) ============

// Verifica a cada 15 minutos se há leads parados há mais de X horas em "aguardando_pagamento"
setInterval(async () => {
  try {
    await enviarLembretesPendentes();
  } catch (err) {
    console.error("Erro ao enviar lembretes pendentes:", err);
  }
}, 15 * 60 * 1000);

// Verifica a cada 5 minutos se há leads que não interagiram após as boas-vindas
setInterval(async () => {
  try {
    await enviarReengajamentos();
  } catch (err) {
    console.error("Erro ao enviar reengajamentos:", err);
  }
}, 5 * 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
