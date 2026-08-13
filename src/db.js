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
      cpf: null,
      payment_id: null,
      reminder_sent: false,
      reengagement_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveDb(data);
  }
  return data.leads[phone];
}
export function updateStage(phone, stage, paymentId = null) {
  const data = loadDb();
  if (!data.leads[phone]) return;
  data.leads[phone].stage = stage;
  if (paymentId) data.leads[phone].payment_id = paymentId;
  data.leads[phone].reminder_sent = false;
  data.leads[phone].reengagement_sent = false;
  data.leads[phone].updated_at = new Date().toISOString();
  saveDb(data);
}
export function saveCpf(phone, cpf) {
  const data = loadDb();
  if (!data.leads[phone]) return;
  data.leads[phone].cpf = cpf;
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
export function findLeadByPaymentId(paymentId) {
  const data = loadDb();
  return Object.values(data.leads).find((lead) => lead.payment_id === paymentId);
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
export function findLeadsWithoutInteraction(minutes) {
  const data = loadDb();
  const cutoff = Date.now() - minutes * 60 * 1000;
  return Object.values(data.leads).filter(
    (lead) =>
      lead.stage === "aguardando_interesse" &&
      !lead.reengagement_sent &&
      new Date(lead.updated_at).getTime() <= cutoff
  );
}
