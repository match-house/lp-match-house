#!/usr/bin/env node

/**
 * Match House - Meta Ads Manager Server
 *
 * Para desenvolver localmente:
 * 1. npm init -y
 * 2. npm install express dotenv axios cors
 * 3. Criar arquivo .env com as variáveis do Meta
 * 4. node server.js
 */

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const META_API_VERSION = 'v20.0';
const META_GRAPH_API = 'https://graph.facebook.com';
const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || '261171503755179';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Meta Auth - OAuth Callback
app.get('/api/auth/meta/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.get(
      `${META_GRAPH_API}/oauth/access_token`,
      {
        params: {
          client_id: META_APP_ID,
          client_secret: META_APP_SECRET,
          redirect_uri: `http://localhost:${PORT}/api/auth/meta/callback`,
          code
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const userId = tokenResponse.data.user_id;

    // Get user's ad accounts
    const accountsResponse = await axios.get(
      `${META_GRAPH_API}/${META_API_VERSION}/${userId}/adaccounts`,
      {
        params: {
          access_token: accessToken
        }
      }
    );

    // Redirect back to front-end with token
    // Em produção, você armazenaria isso no server
    res.redirect(`/?token=${accessToken}&account=${META_AD_ACCOUNT_ID}`);
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get login URL
app.get('/api/auth/meta/login-url', (req, res) => {
  const redirectUri = encodeURIComponent(`http://localhost:${PORT}/api/auth/meta/callback`);
  const scope = 'ads_management,ads_read,email';
  const loginUrl = `https://www.facebook.com/${META_API_VERSION}/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${redirectUri}&scope=${scope}`;

  res.json({ loginUrl });
});

// List Ads
app.get('/api/ads', async (req, res) => {
  try {
    if (!META_ACCESS_TOKEN) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const response = await axios.get(
      `${META_GRAPH_API}/${META_API_VERSION}/act_${META_AD_ACCOUNT_ID}/ads`,
      {
        params: {
          access_token: META_ACCESS_TOKEN,
          fields: 'id,name,status,adset_id,creative,created_time,updated_time',
          limit: 100
        }
      }
    );

    const ads = await Promise.all(
      response.data.data.map(async (ad) => {
        try {
          // Get insights for each ad
          const insightsResponse = await axios.get(
            `${META_GRAPH_API}/${META_API_VERSION}/${ad.id}/insights`,
            {
              params: {
                access_token: META_ACCESS_TOKEN,
                fields: 'impressions,clicks,spend,ctr'
              }
            }
          );

          const insights = insightsResponse.data.data[0] || {};

          return {
            id: ad.id,
            name: ad.name,
            status: ad.status,
            image: './criativo-a.png',
            headline: 'Diagnóstico Match House',
            description: 'IA que qualifica leads 24h por dia',
            impressions: parseInt(insights.impressions) || 0,
            clicks: parseInt(insights.clicks) || 0,
            spent: parseFloat(insights.spend) || 0,
            budget: 100
          };
        } catch (e) {
          return {
            id: ad.id,
            name: ad.name,
            status: ad.status,
            image: './criativo-a.png',
            headline: 'Diagnóstico Match House',
            description: 'IA que qualifica leads 24h por dia',
            impressions: 0,
            clicks: 0,
            spent: 0,
            budget: 100
          };
        }
      })
    );

    res.json(ads);
  } catch (error) {
    console.error('Error fetching ads:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get Ad Details
app.get('/api/ads/:adId', async (req, res) => {
  try {
    const { adId } = req.params;

    if (!META_ACCESS_TOKEN) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const response = await axios.get(
      `${META_GRAPH_API}/${META_API_VERSION}/${adId}`,
      {
        params: {
          access_token: META_ACCESS_TOKEN,
          fields: 'id,name,status,adset_id,creative'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching ad:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update Ad Status
app.patch('/api/ads/:adId', async (req, res) => {
  try {
    const { adId } = req.params;
    const { status, budget } = req.body;

    if (!META_ACCESS_TOKEN) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (budget) updateData.daily_budget = Math.round(budget * 100); // Converter para centavos

    const response = await axios.post(
      `${META_GRAPH_API}/${META_API_VERSION}/${adId}`,
      {
        ...updateData,
        access_token: META_ACCESS_TOKEN
      }
    );

    res.json({ success: true, id: adId });
  } catch (error) {
    console.error('Error updating ad:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete Ad
app.delete('/api/ads/:adId', async (req, res) => {
  try {
    const { adId } = req.params;

    if (!META_ACCESS_TOKEN) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const response = await axios.delete(
      `${META_GRAPH_API}/${META_API_VERSION}/${adId}`,
      {
        params: {
          access_token: META_ACCESS_TOKEN
        }
      }
    );

    res.json({ success: true, id: adId });
  } catch (error) {
    console.error('Error deleting ad:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create Ad (simplified version)
app.post('/api/ads', async (req, res) => {
  try {
    const { name, headline, description, budget, adsetId } = req.body;

    if (!META_ACCESS_TOKEN) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // TODO: Você precisa ter um adset criado primeiro
    // Veja: POST /act_{AD_ACCOUNT_ID}/adsets

    res.status(501).json({
      error: 'Creating ads via API requires an existing AdSet',
      message: 'Please create an AdSet first using Meta Ads Manager or API'
    });
  } catch (error) {
    console.error('Error creating ad:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get Account Info
app.get('/api/account', async (req, res) => {
  try {
    if (!META_ACCESS_TOKEN) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const response = await axios.get(
      `${META_GRAPH_API}/${META_API_VERSION}/act_${META_AD_ACCOUNT_ID}`,
      {
        params: {
          access_token: META_ACCESS_TOKEN,
          fields: 'id,name,currency,timezone_name,created_time'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching account:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Webhook para receber leads (Meta ou Google)
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, campaign, source, score, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    // Preparar dados para enviar à planilha
    const leadData = {
      name,
      email,
      phone: phone || '',
      campaign: campaign || 'N/A',
      source: source || 'Direto',
      score: score || '',
      notes: notes || ''
    };

    // TODO: Enviar para Google Apps Script webhook
    console.log('📝 Lead recebido:', leadData);

    res.json({
      success: true,
      message: 'Lead registrado com sucesso',
      lead: leadData
    });
  } catch (error) {
    console.error('Erro ao processar lead:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   Match House - Meta Ads Manager Server        ║
║   Listening on http://localhost:${PORT}              ║
║                                                ║
║   Ad Account: ${META_AD_ACCOUNT_ID}   ║
║   API Version: ${META_API_VERSION}               ║
║                                                ║
║   📊 Gerenciador: http://localhost:${PORT}/anuncios/ ║
╚════════════════════════════════════════════════╝
  `);

  if (!META_ACCESS_TOKEN) {
    console.warn('\n⚠️  META_ACCESS_TOKEN não configurado!');
    console.warn('   Configure seu .env com as credenciais do Meta Ads Manager');
  }
});

module.exports = app;
