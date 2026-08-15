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
 * Baixa o arquivo da URL e faz upload direto pro servidor da Meta.
 * Retorna o media_id que a Meta gera — esse id é o que permite
 * o WhatsApp processar o PDF de verdade e gerar a capa/preview.
 */
async function uploadMediaFromUrl(fileUrl, filename) {
  const fileResponse = await fetch(fileUrl);
  if (!fileResponse.ok) {
    throw new Error(
      `Não consegui baixar o arquivo pra upload: ${fileUrl} (status ${fileResponse.status})`
    );
  }
  const fileBuffer = await fileResponse.arrayBuffer();
  const fileBlob = new Blob([fileBuffer], { type: "application/pdf" });

  const formData = new FormData();
  formData.append("messaging_product", "whatsapp");
  formData.append("type", "application/pdf");
  formData.append("file", fileBlob, filename);

  const uploadResponse = await fetch(`${BASE_URL}/media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    },
    body: formData,
  });

  const uploadData = await uploadResponse.json();
  if (!uploadData.id) {
    throw new Error(`Upload de mídia falhou: ${JSON.stringify(uploadData)}`);
  }
  return uploadData.id;
}

/**
 * Envia um documento (ex: o PDF do ebook).
 * Agora faz upload direto do arquivo pra Meta (em vez de mandar só o link),
 * pra o WhatsApp conseguir gerar a capa/preview da primeira página.
 */
export async function sendDocument(to, documentUrl, filename, caption = "") {
  const mediaId = await uploadMediaFromUrl(documentUrl, filename);
  return api.post("/messages", {
    messaging_product: "whatsapp",
    to,
    type: "document",
    document: { id: mediaId, filename, caption },
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
