# Meta Ads Manager Integration

## Configuração da Integração com Meta Ads Manager

Sua Conta de Publicidade (Ad Account ID): **261171503755179**

### O que foi criado

✅ Interface de gerenciamento de anúncios (`/anuncios/`)
- Autenticação com Meta
- Listagem de anúncios
- Criar/editar/deletar anúncios
- Acompanhamento de performance (impressões, cliques, CTR, gasto)

### Próximos passos para ativar a integração real

#### 1. Criar App no Meta Business Suite

1. Vá para https://developers.facebook.com/
2. Crie um novo App (ou use um existente)
3. Selecione "Marketing API" como produto
4. Vá para Settings > Basic e copie:
   - **App ID**: `seu_app_id_aqui`
   - **App Secret**: `seu_app_secret_aqui`

#### 2. Gerar Access Token

Opção A: User Access Token (Recomendado para desenvolvimento)
```bash
# Via Graph API Explorer
# https://developers.facebook.com/tools/explorer

# Selecione seu app
# Selecione "Get User Access Token"
# Permissions necessárias:
# - ads_management
# - ads_read
```

Opção B: Long-lived Token (Para produção)
```bash
curl -X GET \
  "https://graph.instagram.com/v20.0/oauth/access_token" \
  -d "grant_type=fb_exchange_token" \
  -d "client_id=YOUR_APP_ID" \
  -d "client_secret=YOUR_APP_SECRET" \
  -d "fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
```

#### 3. Configurar Backend

Crie um arquivo `.env` na raiz do projeto:

```env
META_APP_ID=seu_app_id
META_APP_SECRET=seu_app_secret
META_ACCESS_TOKEN=seu_access_token
META_AD_ACCOUNT_ID=261171503755179
```

#### 4. Endpoints da API que você precisa implementar

O frontend espera esses endpoints:

```
POST /api/auth/meta
  - Autentica com Meta
  - Retorna: { token: 'access_token', accountId: 'act_...' }

GET /api/ads
  - Lista anúncios da conta
  - Retorna: [{ id, name, status, image, stats }]

POST /api/ads
  - Cria novo anúncio
  - Body: { name, headline, description, budget, creative_id }

PATCH /api/ads/:id
  - Atualiza anúncio
  - Body: { status, budget, ... }

DELETE /api/ads/:id
  - Deleta anúncio

GET /api/ads/:id/stats
  - Retorna estatísticas do anúncio
```

#### 5. Exemplo de Integração com Node.js + Express

```javascript
// routes/meta-ads.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_VERSION = 'v20.0';
const GRAPH_API = 'https://graph.facebook.com';
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

// List ads
router.get('/ads', async (req, res) => {
  try {
    const response = await axios.get(
      `${GRAPH_API}/${API_VERSION}/act_${AD_ACCOUNT_ID}/ads`,
      {
        params: {
          access_token: ACCESS_TOKEN,
          fields: 'id,name,status,adset_id,creative,updated_time'
        }
      }
    );

    // Formatar resposta
    const ads = response.data.data.map(ad => ({
      id: ad.id,
      name: ad.name,
      status: ad.status,
      // ... formatar outros campos
    }));

    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create ad
router.post('/ads', async (req, res) => {
  try {
    const { name, headline, description, budget, creative_id } = req.body;

    // Criar anúncio via Meta API
    const response = await axios.post(
      `${GRAPH_API}/${API_VERSION}/act_${AD_ACCOUNT_ID}/ads`,
      {
        name,
        status: 'PAUSED', // Começar pausado
        adset_id: 'seu_adset_id', // Você precisa criar um AdSet primeiro
        creative: { creative_id },
        access_token: ACCESS_TOKEN
      }
    );

    res.json({ id: response.data.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### 6. Criar Campaign e AdSet

Antes de criar anúncios, você precisa de:

```javascript
// Criar Campaign
POST /graph/v20.0/act_261171503755179/campaigns
{
  "name": "Diagnóstico Match House",
  "objective": "LINK_CLICKS",
  "status": "PAUSED",
  "access_token": "seu_token"
}

// Criar AdSet
POST /graph/v20.0/act_261171503755179/adsets
{
  "name": "Diagnóstico - Semana 1",
  "campaign_id": "campaign_id_criado",
  "daily_budget": 10000, // em centavos = R$ 100
  "billing_event": "IMPRESSIONS",
  "optimization_goal": "LINK_CLICKS",
  "targeting": {
    "geo_locations": { "countries": ["BR"] },
    "age_min": 25,
    "age_max": 65
  },
  "access_token": "seu_token"
}
```

#### 7. Upload de Creative (Imagem)

```javascript
// Upload criativo-a.png
POST /graph/v20.0/act_261171503755179/adimages
{
  "filename": "criativo-a.png",
  "bytes": <arquivo_binário>,
  "access_token": "seu_token"
}
// Retorna: { images: { criativo-a: { hash: '...', url: '...' } } }
```

### Permissões Necessárias do Token

```
ads_management
ads_read
```

### Documentação Oficial

- [Meta Marketing API Docs](https://developers.facebook.com/docs/marketing-api)
- [Create Ads](https://developers.facebook.com/docs/marketing-api/reference/ad)
- [Manage Campaigns](https://developers.facebook.com/docs/marketing-api/reference/campaign)
- [OAuth Flow](https://developers.facebook.com/docs/facebook-login/web)

### Testing com curl

```bash
# Listar anúncios
curl -X GET \
  "https://graph.facebook.com/v20.0/act_261171503755179/ads" \
  -d "access_token=YOUR_ACCESS_TOKEN" \
  -d "fields=id,name,status"

# Criar Campaign
curl -X POST \
  "https://graph.facebook.com/v20.0/act_261171503755179/campaigns" \
  -d "name=Diagnóstico Match House" \
  -d "objective=LINK_CLICKS" \
  -d "status=PAUSED" \
  -d "access_token=YOUR_ACCESS_TOKEN"
```

## Próximas Fases

- [ ] Implementar autenticação OAuth do Meta (não apenas token mockado)
- [ ] Criar Campaign "Diagnóstico Match House" na conta
- [ ] Upload do criativo-a.png para Meta
- [ ] Implementar endpoints de CRUD completo
- [ ] Adicionar dashboard com gráficos de performance
- [ ] Webhook para sincronizar dados em tempo real
- [ ] Configurar Pixel de conversão do Facebook
