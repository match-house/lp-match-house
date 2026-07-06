#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

const API_VERSION = 'v20.0';
const GRAPH_API = 'https://graph.facebook.com';
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;

console.log('🚀 Iniciando criação de anúncios...\n');
console.log(`📊 Conta: ${AD_ACCOUNT_ID}`);
console.log(`🔐 Token: ${ACCESS_TOKEN.substring(0, 20)}...\n`);

async function criar() {
  try {
    // 1. Obter ID da campanha
    console.log('1️⃣  Buscando campanha "MH_Diagnostico_SP_2026"...');
    const campaignsResponse = await axios.get(
      `${GRAPH_API}/${API_VERSION}/act_${AD_ACCOUNT_ID}/campaigns`,
      {
        params: {
          access_token: ACCESS_TOKEN,
          fields: 'id,name,status',
          limit: 100
        }
      }
    );

    const campaign = campaignsResponse.data.data.find(
      c => c.name === 'MH_Diagnostico_SP_2026'
    );

    if (!campaign) {
      console.error('❌ Campanha não encontrada!');
      console.log('Campanhas disponíveis:');
      campaignsResponse.data.data.forEach(c => {
        console.log(`  - ${c.name} (${c.id})`);
      });
      return;
    }

    console.log(`✅ Campanha encontrada: ${campaign.id}\n`);

    // 2. Criar AdSet
    console.log('2️⃣  Criando AdSet...');
    const adsetResponse = await axios.post(
      `${GRAPH_API}/${API_VERSION}/act_${AD_ACCOUNT_ID}/adsets`,
      {
        name: 'Diagnostico_A_Targeting',
        campaign_id: campaign.id,
        daily_budget: 2000, // R$ 20,00 em centavos
        billing_event: 'IMPRESSIONS',
        optimization_goal: 'LINK_CLICKS',
        targeting: {
          geo_locations: {
            regions: [{ key: 'BR-SP' }]
          },
          age_min: 25,
          age_max: 65,
          facebook_positions: ['feed'],
          instagram_positions: ['feed']
        },
        status: 'PAUSED',
        access_token: ACCESS_TOKEN
      }
    );

    const adsetId = adsetResponse.data.id;
    console.log(`✅ AdSet criado: ${adsetId}\n`);

    // 3. Criar Ads com variações de copy
    const anuncios = [
      {
        name: 'Diagnostico_A_V1',
        message: 'Qual a nota do seu posicionamento digital?',
        description: 'Descubra em 2 minutos se está deixando dinheiro na mesa'
      },
      {
        name: 'Diagnostico_A_V2',
        message: 'Seu posicionamento digital está deixando dinheiro na mesa?',
        description: 'Teste grátis agora e veja o que você está perdendo!'
      }
    ];

    console.log('3️⃣  Criando anúncios...');
    for (const ad of anuncios) {
      try {
        const adResponse = await axios.post(
          `${GRAPH_API}/${API_VERSION}/act_${AD_ACCOUNT_ID}/ads`,
          {
            name: ad.name,
            adset_id: adsetId,
            creative: {
              object_story_spec: {
                link_data: {
                  message: ad.message,
                  headline: 'Diagnóstico Match House',
                  description: ad.description,
                  link: 'https://www.matchhouse.com.br/diagnostico',
                  image_hash: null, // Vamos deixar null por enquanto
                  call_to_action_type: 'LEARN_MORE'
                }
              }
            },
            status: 'PAUSED',
            access_token: ACCESS_TOKEN
          }
        );

        console.log(`  ✅ ${ad.name}: ${adResponse.data.id}`);
      } catch (error) {
        console.error(`  ❌ Erro em ${ad.name}:`);
        if (error.response?.data?.error) {
          console.error(`     ${error.response.data.error.message}`);
        } else {
          console.error(`     ${error.message}`);
        }
      }
    }

    console.log('\n✨ Processo concluído!');
    console.log(`\n📋 Resumo:`);
    console.log(`  Campanha: MH_Diagnostico_SP_2026`);
    console.log(`  AdSet: ${adsetId}`);
    console.log(`  Anúncios: 2 versões criadas`);
    console.log(`  Landing page: https://www.matchhouse.com.br/diagnostico`);
    console.log(`  Status: PAUSADO (ativar no Meta Ads Manager)\n`);

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    if (error.response?.data?.error) {
      console.error('Detalhes:', error.response.data.error);
    }
  }
}

criar();
