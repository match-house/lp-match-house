// Vercel Serverless Function — recebe os dados do Diagnóstico e registra o lead no HubSpot.
//
// Captura em dois momentos:
//   - status "iniciado": assim que a pessoa informa nome + WhatsApp (mesmo que não conclua)
//   - status "completo": quando ela termina o diagnóstico (com score e respostas)
// O mesmo contato é atualizado (upsert por telefone), evitando duplicidade.
//
// Configuração necessária (uma única vez), via variável de ambiente na Vercel:
//   HUBSPOT_TOKEN = token de um "Private App" do HubSpot com os escopos:
//     - crm.objects.contacts.write
//     - crm.objects.contacts.read   (necessário para o upsert por telefone)
//
// Enquanto o HUBSPOT_TOKEN não estiver configurado, a função não falha:
// apenas responde stored:false, sem registrar nada (o WhatsApp continua normal).

const HS = "https://api.hubapi.com";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  let data = req.body;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      data = {};
    }
  }
  data = data || {};

  const name = (data.name || "").trim();
  const whats = (data.whats || "").trim();
  const link = (data.link || "").trim();
  const linkType = (data.linkType || "").trim();
  const status = data.status === "iniciado" ? "iniciado" : "completo";
  const score = data.score != null ? String(data.score) : "";
  const tier = (data.tier || "").trim();

  const token = process.env.HUBSPOT_TOKEN;
  if (!token) {
    res.status(200).json({ ok: true, stored: false, reason: "HUBSPOT_TOKEN ausente" });
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  const parts = name.split(/\s+/).filter(Boolean);
  const firstname = parts[0] || "";
  const lastname = parts.slice(1).join(" ");
  const statusLabel = status === "iniciado" ? "INICIADO (não concluiu)" : "CONCLUÍDO";

  const resumo = [
    "Diagnóstico de Posicionamento Digital — " + statusLabel,
    status === "completo" ? "Score: " + score + "/100" + (tier ? " (" + tier + ")" : "") : null,
    link ? "Link atual: " + link : null,
    linkType ? "Tipo de link: " + linkType : null,
    "Origem: matchhouse.com.br/diagnostico",
  ]
    .filter(Boolean)
    .join("\n");

  const properties = {
    firstname: firstname,
    lastname: lastname,
    phone: whats,
    website: link,
    message: resumo,
    lifecyclestage: "lead",
    hs_lead_status: status === "completo" ? "NEW" : "OPEN",
  };

  try {
    // Procura um contato existente com o mesmo telefone (upsert).
    let existingId = null;
    if (whats) {
      const searchRes = await fetch(HS + "/crm/v3/objects/contacts/search", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          filterGroups: [
            { filters: [{ propertyName: "phone", operator: "EQ", value: whats }] },
          ],
          properties: ["phone"],
          limit: 1,
        }),
      });
      if (searchRes.ok) {
        const found = await searchRes.json();
        if (found.results && found.results.length > 0) {
          existingId = found.results[0].id;
        }
      }
    }

    let r;
    if (existingId) {
      r = await fetch(HS + "/crm/v3/objects/contacts/" + existingId, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify({ properties: properties }),
      });
    } else {
      r = await fetch(HS + "/crm/v3/objects/contacts", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ properties: properties }),
      });
    }

    if (!r.ok) {
      const detail = await r.text();
      res.status(200).json({ ok: false, stored: false, status: r.status, detail: detail.slice(0, 400) });
      return;
    }

    const saved = await r.json();
    res.status(200).json({ ok: true, stored: true, id: saved.id, action: existingId ? "updated" : "created" });
  } catch (e) {
    res.status(200).json({ ok: false, stored: false, error: String(e).slice(0, 200) });
  }
};
