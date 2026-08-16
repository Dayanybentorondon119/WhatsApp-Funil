import fs from "fs";

const DB_FILE = "funil.json";

function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ leads: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function getOrCreateLead(phone, name) {
  const data = loadDb();
  if (!data.leads[phone]) {
    data.leads[phone] = {
      phone,
      name: name || null,
      stage: "novo",
      opcao: null,
      reminder_sent: false,
      reengagement_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveDb(data);
  }
  return data.leads[phone];
}

export function updateStage(phone, stage, opcao = null) {
  const data = loadDb();
  if (!data.leads[phone]) return;
  data.leads[phone].stage = stage;
  if (opcao) data.leads[phone].opcao = opcao;
  data.leads[phone].reminder_sent = false;
  data.leads[phone].reengagement_sent = false;
  data.leads[phone].updated_at = new Date().toISOString();
  saveDb(data);
}

export function markReminderSent(phone) {
  const data = loadDb();
  if (!data.leads[phone]) return;
  data.leads[phone].reminder_sent = true;
  saveDb(data);
}

export function markReengagementSent(phone) {
  const data = loadDb();
  if (!data.leads[phone]) return;
  data.leads[phone].reengagement_sent = true;
  saveDb(data);
}

export function findLeadByPhone(phone) {
  const data = loadDb();
  return data.leads[phone] || null;
}

export function findLeadsAwaitingPaymentOlderThan(hours) {
  const data = loadDb();
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return Object.values(data.leads).filter(
    (lead) =>
      lead.stage === "aguardando_pagamento" &&
      !lead.reminder_sent &&
      new Date(lead.updated_at).getTime() <= cutoff
  );
}

export function findLeadsWithoutChoice(minutes) {
  const data = loadDb();
  const cutoff = Date.now() - minutes * 60 * 1000;
  return Object.values(data.leads).filter(
    (lead) =>
      lead.stage === "aguardando_interesse" &&
      !lead.reengagement_sent &&
      new Date(lead.updated_at).getTime() <= cutoff
  );
}

export function findLeadsAwaitingPayment() {
  const data = loadDb();
  return Object.values(data.leads).filter((lead) => lead.stage === "aguardando_pagamento");
}

export function findLeadsAwaitingUpsellPayment() {
  const data = loadDb();
  return Object.values(data.leads).filter((lead) => lead.stage === "aguardando_pagamento_upsell");
}

export function findLeadsAguardandoRespostaUpsell(minutes) {
  const data = loadDb();
  const cutoff = Date.now() - minutes * 60 * 1000;
  return Object.values(data.leads).filter(
    (lead) => lead.stage === "pago" && new Date(lead.updated_at).getTime() <= cutoff
  );
}
