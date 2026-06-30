// Vercel Serverless Function — encaminha os leads do Diagnóstico para a planilha do Google.
//
// Captura em dois momentos:
//   - status "iniciado": assim que a pessoa informa nome + WhatsApp (mesmo que não conclua)
//   - status "completo": quando ela termina o diagnóstico (com score)
// A planilha faz o upsert por "ID Sessão", então o mesmo lead é atualizado (não duplica).
//
// Configuração necessária (uma única vez), via variável de ambiente na Vercel:
//   GSHEET_WEBHOOK_URL = URL do Web App (Apps Script) publicado a partir da planilha.
//
// Enquanto a variável não estiver configurada, a função não falha:
// apenas responde stored:false (o botão de WhatsApp continua funcionando normalmente).

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

  const url = process.env.GSHEET_WEBHOOK_URL;
  if (!url) {
    res.status(200).json({ ok: true, stored: false, reason: "GSHEET_WEBHOOK_URL ausente" });
    return;
  }

  const payload = {
    status: data.status === "iniciado" ? "iniciado" : "completo",
    name: (data.name || "").trim(),
    whats: (data.whats || "").trim(),
    link: (data.link || "").trim(),
    linkType: (data.linkType || "").trim(),
    score: data.score != null ? data.score : "",
    tier: (data.tier || "").trim(),
    sessionId: (data.sessionId || "").trim(),
  };

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await r.text();
    res.status(200).json({ ok: r.ok, stored: r.ok, detail: text.slice(0, 200) });
  } catch (e) {
    res.status(200).json({ ok: false, stored: false, error: String(e).slice(0, 200) });
  }
};
