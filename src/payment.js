import axios from "axios";

const asaas = axios.create({
  baseURL: "https://api.asaas.com/v3",
  headers: {
    access_token: process.env.PAYMENT_PROVIDER_API_KEY,
    "Content-Type": "application/json",
  },
});

/**
 * O Asaas exige um "cliente" cadastrado antes de gerar qualquer cobrança.
 * Como não temos CPF do lead (só o telefone), criamos um cliente simples
 * usando o telefone como identificador. Se o cliente já existir (mesmo
 * telefone), reaproveitamos em vez de duplicar.
 */
async function getOrCreateAsaasCustomer(phone, name) {
  // Tenta achar um cliente já cadastrado com esse telefone
  const search = await asaas.get("/customers", {
    params: { externalReference: phone },
  });

  if (search.data.data.length > 0) {
    return search.data.data[0].id;
  }

  // Não existe ainda: cria um novo
  const created = await asaas.post("/customers", {
    name: name || `Lead ${phone}`,
    mobilePhone: phone,
    externalReference: phone, // usamos isso depois para reencontrar o cliente
  });

  return created.data.id;
}

/**
 * Cria a cobrança Pix e retorna o link de pagamento (QR code / copia-e-cola).
 */
export async function createPixCharge({ phone, amount, name }) {
  const customerId = await getOrCreateAsaasCustomer(phone, name);

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 1); // vencimento em 1 dia

  const payment = await asaas.post("/payments", {
    customer: customerId,
    billingType: "PIX",
    value: amount,
    dueDate: dueDate.toISOString().split("T")[0], // formato YYYY-MM-DD
    description: "Receitas de Saladas Premium",
    externalReference: phone,
  });

  // Busca o QR code / código copia-e-cola gerado para essa cobrança
  const pixInfo = await asaas.get(`/payments/${payment.data.id}/pixQrCode`);

  return {
    paymentId: payment.data.id,
    paymentLink: payment.data.invoiceUrl, // link de pagamento (página do Asaas)
    pixCopiaECola: pixInfo.data.payload,   // código Pix "copia e cola"
    qrCodeBase64: pixInfo.data.encodedImage, // imagem do QR code em base64
  };
}
