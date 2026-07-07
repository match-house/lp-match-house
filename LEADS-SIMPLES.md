# Sistema de Leads - Simples e Funcional

## 🎯 Como Funciona

1. **Diagnóstico** → Captura dados do lead
2. **Servidor** → Salva em arquivo CSV (separado por campanha)
3. **Dashboard** → Você vê os leads e baixa CSV
4. **Google Sheets** → Você copia e cola (super rápido!)

---

## 🚀 Para Usar

### Opção A: Servidor Separado (Recomendado)

Abra um terminal E execute:

```bash
npm install
node leads-manager.js
```

Vai rodar em: `http://localhost:3001`

Acesse: `http://localhost:3001` (em outro navegador aba)

---

### Opção B: Integrado no Server Principal

Se quiser integrar no `server.js` existente:

```bash
npm start
```

Ele já tem o endpoint `/api/leads` pronto!

---

## 📊 Dashboard

Acesse: `http://localhost:3001/leads-dashboard.html`

**Você verá:**
- ✅ Total de leads capturados
- ✅ Tabela com últimos 10 leads
- ✅ Botão para baixar CSV

---

## 💾 Arquivos Gerados

Pasta: `leads-data/`

```
leads-meta-ads.csv      ← Leads do Meta Ads (diagnóstico)
leads-google-ads.csv    ← Leads do Google Ads
```

---

## 📋 Estrutura do CSV

### Meta Ads
```
Data/Hora,Nome,Email,Telefone,Campanha,Score,Notas
07/07/2026 14:30,João Silva,joao@email.com,11999999999,MH_Diagnostico_SP_2026,7.5,Lead do diagnóstico
```

### Google Ads
```
Data/Hora,Nome,Email,Telefone,Campanha,Conversor,Notas
07/07/2026 14:25,Maria Santos,maria@email.com,11888888888,Google Campaign,Sim,Lead do Google
```

---

## 📡 API Endpoints

### Enviar Lead
```bash
POST /api/leads
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "campaign": "MH_Diagnostico_SP_2026",
  "source": "Meta Ads",      # ou "Google Ads"
  "score": "7.5",
  "notes": "Lead do diagnóstico"
}
```

### Ver Leads
```bash
GET /api/leads/export?source=meta
GET /api/leads/export?source=google
```

### Baixar CSV
```bash
GET /api/leads/download/meta
GET /api/leads/download/google
```

---

## 🔄 Fluxo Completo

1. **Usuário** acessa `/diagnostico`
2. **Diagnóstico** coleta: nome, email, telefone, score
3. **JavaScript** envia para `/api/leads`
4. **Servidor** salva em CSV
5. **Você** clica em "Baixar CSV" no dashboard
6. **Você** copia dados do CSV
7. **Você** cola na planilha Google Sheets (Ctrl+V)

**Tempo total:** 2 minutos!

---

## ✅ Checklist

- [ ] Terminal: `npm install` OK
- [ ] Terminal: `node leads-manager.js` rodando
- [ ] Dashboard abrindo em `http://localhost:3001`
- [ ] Dados salvando em `leads-data/`
- [ ] CSVs baixando corretamente
- [ ] Dados colando na planilha Google

---

## 🆘 Problemas?

**"Porta 3001 já está em uso"**
- Use `node leads-manager.js --port 3002`

**"Arquivo não encontrado"**
- Deixa-me criar primeiro lead: abra `/diagnostico` e envie

**"CSV vazio"**
- Verifique em `leads-data/leads-meta-ads.csv`
