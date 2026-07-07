# Setup de Captura de Leads - Meta Ads + Google Ads

## 📋 Estrutura da Planilha

Use as seguintes colunas:
```
A: Data/Hora
B: Nome
C: Email
D: Telefone
E: Campanha
F: Origem (Meta Ads / Google Ads)
G: Score
H: Notas
```

---

## 🔧 Configuração do Google Apps Script

### Passo 1: Abra a Planilha
1. Acesse: https://docs.google.com/spreadsheets/d/1H7u-b0O0_tYUnGcxBa4mx8dp847F50nampiw_5y10xs
2. Clique em **Extensions** → **Apps Script**

### Passo 2: Cole o Script
1. Copie todo o conteúdo de `google-apps-script.js`
2. Cole no editor do Apps Script
3. Clique em **Deploy** → **New Deployment**
4. Escolha **Type**: Web app
5. **Execute as**: Seu email
6. **Who has access**: Anyone
7. Copie a **Deployment URL** (vai parecer com: `https://script.google.com/macros/s/...`)

### Passo 3: Configure as Colunas
Adicione headers na planilha (linha 1):
```
Data/Hora | Nome | Email | Telefone | Campanha | Origem | Score | Notas
```

---

## 🎯 Capturando Leads do Diagnóstico

Na página `/diagnostico`, adicione este código para enviar leads:

```javascript
async function enviarLeadParaPlanilha(nome, email, telefone, score) {
  const webhook = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent';
  
  await fetch(webhook, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({
      name: nome,
      email: email,
      phone: telefone,
      campaign: 'MH_Diagnostico_SP_2026',
      source: 'Meta Ads',
      score: score,
      notes: 'Lead do diagnóstico'
    })
  });
}

// Chamar quando o diagnóstico for concluído:
// enviarLeadParaPlanilha('João Silva', 'joao@email.com', '11999999999', 7.5);
```

---

## 📊 Separação de Campanhas

A planilha separará automaticamente:

**Coluna F (Origem):**
- `Google Ads` → Leads do Google Ads Manager
- `Meta Ads` → Leads do Meta Ads (diagnóstico)
- `Direto` → Leads enviados diretamente

**Coluna E (Campanha):**
- `MH_Diagnostico_SP_2026` → Campanha Meta
- `Google_Ads_Campaign_Name` → Campanha Google
- Etc.

Crie filtros na planilha para separar facilmente!

---

## ✅ Testar

1. No Google Apps Script, execute: `testWebhook()`
2. Verifique se uma linha foi adicionada à planilha
3. Se sim, pronto! 🎉

---

## 🔗 Webhook do Servidor (Alternativa)

Se preferir usar o servidor Node.js como intermediário:

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999",
    "campaign": "MH_Diagnostico_SP_2026",
    "source": "Meta Ads",
    "score": "7.5"
  }'
```

---

## 📌 Checklist

- [ ] Google Apps Script criado
- [ ] Webhook URL copiada
- [ ] Colunas configuradas na planilha
- [ ] Teste do webhook executado
- [ ] Código de captura adicionado ao diagnóstico
- [ ] Filtros criados para Meta + Google
