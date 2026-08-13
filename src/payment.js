import axios from "axios";
const asaas = axios.create({
  baseURL: "https://api.asaas.com/v3",
  headers: {
    access_token: process.env.PAYMENT_PROVIDER_API_KEY,
    "Content-Type": "application/json",
  },
});

async function getOrCreateAsaasCustomer(phone, name, cpf) {
  const search = await asaas.get("/customers", {
    params: { externalReference: phone },
  });

  if (search.data.data.length > 0) {
    const existing = search.data.data[0];
    // Se o cliente já existe mas ainda não tem CPF salvo, atualiza agora
    if (!existing.cpfCnpj && cpf) {
      await asaas.post(`/customers/${existing.id}`, { cpfCnpj: cpf });
    }
    return existing.id;
  }

  const created = await asaas.post("/customers", {
    name: name || `Lead ${phone}`,
    mobilePhone: phone,
    cpfCnpj: cpf,
    externalReference: phone,
  });
  return created.data.id;
}

export async function createPixCharge({ phone, amount, name, cpf }) {
  const customerId = await getOrCreateAsaasCustomer(phone, name, cpf);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 1);
  const payment = await asaas.post("/payments", {
    customer: customerId,
    billingType: "PIX",
    value: amount,
    dueDate: dueDate.toISOString().split("T")[0],
    description: "Receitas de Saladas Premium",
    externalReference: phone,
  });
  const pixInfo = await asaas.get(`/payments/${payment.data.id}/pixQrCode`);
  return {
    paymentId: payment.data.id,
    paymentLink: payment.data.invoiceUrl,
    pixCopiaECola: pixInfo.data.payload,
    qrCodeBase64: pixInfo.data.encodedImage,
  };
}
