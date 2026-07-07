# Setup Google Sheets - Meta Ads + Google Ads

## 🚀 Como Executar (Super Simples!)

### Passo 1: Copie este comando

```bash
npm install && node setup-google-sheets.js
```

### Passo 2: Autorize no Google

Quando executar, verá um link. Clique nele:
```
https://accounts.google.com/o/oauth2/v2/auth?...
```

1. Faça login com sua conta (matchhouse.br@gmail.com)
2. Autorize o acesso
3. Copie o código que aparece
4. Cole no terminal e aperte ENTER

### Passo 3: Pronto! ✅

A planilha será configurada automaticamente com:
- ✅ Aba "Meta Ads"
- ✅ Aba "Google Ads"
- ✅ Headers configurados
- ✅ Exemplos de dados

---

## 📋 O Que Será Criado

### Aba 1: Meta Ads
```
Data/Hora | Nome | Email | Telefone | Campanha | Score | Notas
2026-07-07 14:30 | João Silva | joao@... | 11999... | MH_Diagnostico_SP_2026 | 7.5/10 | ...
```

### Aba 2: Google Ads
```
Data/Hora | Nome | Email | Telefone | Campanha | Conversor | Notas
2026-07-07 14:25 | Maria Santos | maria@... | 11888... | Google Campaign | Sim | ...
```

---

## 🔄 Como os Leads Chegam Automaticamente

### Opção A: Pelo Diagnóstico (Recomendado)

Quando alguém completa o diagnóstico em `/diagnostico`, o sistema automaticamente:
1. Captura nome, email, telefone, score
2. Envia para a aba "Meta Ads"
3. Registra data/hora e campanha

### Opção B: Webhook Manual

Envie dados via POST:

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

## ⚠️ Troubleshooting

**Erro: "credentials.json não encontrado"**
- Baixe suas credenciais OAuth do Google Cloud Console
- Salve como `credentials.json` na pasta do projeto

**Erro: "Planilha não encontrada"**
- Verifique se o ID da planilha está correto
- ID atual: `1H7u-b0O0_tYUnGcxBa4mx8dp847F50nampiw_5y10xs`

**Erro: "Permissão negada"**
- Verifique se sua conta tem acesso de editor à planilha
- Tente autorizar novamente com a conta correta

---

## ✅ Checklist

- [ ] `npm install` executado
- [ ] `node setup-google-sheets.js` rodou com sucesso
- [ ] Planilha tem 2 abas (Meta Ads + Google Ads)
- [ ] Headers aparecem corretamente
- [ ] Dados de exemplo foram adicionados
- [ ] Leads começam a chegar automaticamente

---

## 📞 Suporte

Se tiver problemas, execute:
```bash
node setup-google-sheets.js --debug
```

Isso mostrará logs detalhados do que está acontecendo.
