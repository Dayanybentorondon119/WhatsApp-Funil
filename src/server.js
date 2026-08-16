import "dotenv/config";
import express from "express";
import {
  handleIncomingMessage,
  handlePaymentConfirmed,
  handleUpsellPaymentConfirmed,
  notificarComprovanteRecebido,
  enviarLembretesPendentes,
  enviarReengajamentos,
  enviarDownsellAutomatico,
} from "./funnel.js";
import { findLeadsAwaitingPayment, findLeadsAwaitingUpsellPayment, findLeadByPhone } from "./db.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ WEBHOOK DO WHATSAPP ============
app.get("/webhook/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post("/webhook/whatsapp", async (req, res) => {
  res.sendStatus(200);
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];
    if (!message) return;
    const from = message.from;
    const contactName = change?.contacts?.[0]?.profile?.name;
    const text = message.text?.body;
    const buttonId = message.interactive?.button_reply?.id;

    if (message.type === "image") {
      await notificarComprovanteRecebido({ from, name: contactName, mediaId: message.image?.id });
    }

    await handleIncomingMessage({ from, name: contactName, text, buttonId });
  } catch (err) {
    console.error("Erro processando mensagem do WhatsApp:", JSON.stringify(err.response?.data || err.message || err, null, 2));
  }
});

// ============ PÁGINA DE LIBERAÇÃO MANUAL ============
function checarSenha(req, res, next) {
  const senha = req.query.senha || req.body.senha;
  if (senha !== process.env.ADMIN_PASSWORD) {
    return res.status(401).send("Senha incorreta.");
  }
  next();
}

app.get("/admin", checarSenha, (req, res) => {
  const pendentes = findLeadsAwaitingPayment();
  const pendentesUpsell = findLeadsAwaitingUpsellPayment();
  const senha = req.query.senha;

  const linhas = pendentes.map((lead) => `
    <tr>
      <td>${lead.name || "(sem nome)"}</td>
      <td>${lead.phone}</td>
      <td>Opção ${lead.opcao}</td>
      <td>
        <form method="POST" action="/admin/liberar">
          <input type="hidden" name="senha" value="${senha}">
          <input type="hidden" name="phone" value="${lead.phone}">
          <button type="submit">Liberar</button>
        </form>
      </td>
    </tr>
  `).join("");

  const linhasUpsell = pendentesUpsell.map((lead) => `
    <tr>
      <td>${lead.name || "(sem nome)"}</td>
      <td>${lead.phone}</td>
      <td>Combo R$15</td>
      <td>
        <form method="POST" action="/admin/liberar-upsell">
          <input type="hidden" name="senha" value="${senha}">
          <input type="hidden" name="phone" value="${lead.phone}">
          <button type="submit" class="upsell">Liberar Combo</button>
        </form>
      </td>
    </tr>
  `).join("");

  res.send(`
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          td { padding: 10px; border-bottom: 1px solid #ccc; }
          button { background: #25D366; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 16px; }
          button.upsell { background: #E1306C; }
        </style>
      </head>
      <body>
        <h2>Leads aguardando pagamento (${pendentes.length})</h2>
        <table>${linhas || "<tr><td>Nenhum lead pendente</td></tr>"}</table>

        <h2>Leads aguardando pagamento do Combo (${pendentesUpsell.length})</h2>
        <table>${linhasUpsell || "<tr><td>Nenhum lead pendente</td></tr>"}</table>
      </body>
    </html>
  `);
});

app.post("/admin/liberar", checarSenha, async (req, res) => {
  const phone = req.body.phone;
  const lead = findLeadByPhone(phone);
  if (!lead) {
    return res.status(404).send("Lead não encontrado.");
  }
  await handlePaymentConfirmed(lead);
  res.redirect(`/admin?senha=${req.body.senha}`);
});

app.post("/admin/liberar-upsell", checarSenha, async (req, res) => {
  const phone = req.body.phone;
  const lead = findLeadByPhone(phone);
  if (!lead) {
    return res.status(404).send("Lead não encontrado.");
  }
  await handleUpsellPaymentConfirmed(lead);
  res.redirect(`/admin?senha=${req.body.senha}`);
});

// ============ LEMBRETES AUTOMÁTICOS ============
setInterval(async () => {
  try {
    await enviarLembretesPendentes();
  } catch (err) {
    console.error("Erro ao enviar lembretes pendentes:", JSON.stringify(err.response?.data || err.message || err, null, 2));
  }
}, 15 * 60 * 1000);

setInterval(async () => {
  try {
    await enviarReengajamentos();
  } catch (err) {
    console.error("Erro ao enviar reengajamentos:", JSON.stringify(err.response?.data || err.message || err, null, 2));
  }
}, 5 * 60 * 1000);

setInterval(async () => {
  try {
    await enviarDownsellAutomatico();
  } catch (err) {
    console.error("Erro ao enviar downsell automático:", JSON.stringify(err.response?.data || err.message || err, null, 2));
  }
}, 5 * 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
