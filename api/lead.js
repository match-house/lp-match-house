// Vercel Serverless Function — recebe os dados do Diagnóstico e cria o lead no HubSpot.
//
// Configuração necessária (uma única vez):
//   - Variável de ambiente HUBSPOT_TOKEN no projeto da Vercel, com o token de um
//     "Private App" do HubSpot que tenha o escopo: crm.objects.contacts.write
//
// Enquanto o HUBSPOT_TOKEN não estiver configurado, a função não falha:
// apenas responde stored:false, sem registrar nada (o fluxo de WhatsApp continua normal).

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
  const score = data.score != null ? String(data.score) : "";
  const tier = (data.tier || "").trim();

  const token = process.env.HUBSPOT_TOKEN;
  if (!token) {
    res.status(200).json({ ok: true, stored: false, reason: "HUBSPOT_TOKEN ausente" });
    return;
  }

  const parts = name.split(/\s+/).filter(Boolean);
  const firstname = parts[0] || "";
  const lastname = parts.slice(1).join(" ");

  const resumo = [
    "Diagnóstico de Posicionamento Digital",
    "Score: " + score + "/100" + (tier ? " (" + tier + ")" : ""),
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
    hs_lead_status: "NEW",
  };

  try {
    const r = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ properties: properties }),
    });

    if (!r.ok) {
      const detail = await r.text();
      // Não propaga erro ao usuário final; apenas reporta no corpo para depuração.
      res.status(200).json({ ok: false, stored: false, status: r.status, detail: detail.slice(0, 400) });
      return;
    }

    const created = await r.json();
    res.status(200).json({ ok: true, stored: true, id: created.id });
  } catch (e) {
    res.status(200).json({ ok: false, stored: false, error: String(e).slice(0, 200) });
  }
};
