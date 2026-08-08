import axios from "axios";

const BASE_URL = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    "Content-Type": "application/json",
  },
});

/**
 * Envia uma mensagem de texto simples.
 */
export async function sendText(to, body) {
  return api.post("/messages", {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body },
  });
}

/**
 * Envia um áudio a partir de uma URL pública (ex: um .mp3/.ogg hospedado no seu bucket).
 */
export async function sendAudio(to, audioUrl) {
  return api.post("/messages", {
    messaging_product: "whatsapp",
    to,
    type: "audio",
    audio: { link: audioUrl },
  });
}

/**
 * Envia uma imagem com legenda opcional.
 */
export async function sendImage(to, imageUrl, caption = "") {
  return api.post("/messages", {
    messaging_product: "whatsapp",
    to,
    type: "image",
    image: { link: imageUrl, caption },
  });
}

/**
 * Envia um documento (ex: o PDF do ebook após confirmação de pagamento).
 */
export async function sendDocument(to, documentUrl, filename, caption = "") {
  return api.post("/messages", {
    messaging_product: "whatsapp",
    to,
    type: "document",
    document: { link: documentUrl, filename, caption },
  });
}

/**
 * Envia botões de resposta rápida (até 3), úteis para qualificar o lead sem parecer robótico.
 */
export async function sendButtons(to, bodyText, buttons) {
  return api.post("/messages", {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: {
        buttons: buttons.map((label, i) => ({
          type: "reply",
          reply: { id: `btn_${i}`, title: label },
        })),
      },
    },
  });
}
