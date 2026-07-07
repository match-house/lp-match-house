#!/usr/bin/env node

/**
 * Setup Automático - Google Sheets
 * Execute: node setup-google-sheets.js
 *
 * Este script:
 * 1. Autentica com sua conta Google
 * 2. Acessa a planilha
 * 3. Organiza tudo para Meta Ads + Google Ads
 * 4. Configura headers e abas
 */

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// IDs da planilha
const SPREADSHEET_ID = '1H7u-b0O0_tYUnGcxBa4mx8dp847F50nampiw_5y10xs';

async function setupSheets() {
  try {
    console.log('🚀 Iniciando setup da planilha Google Sheets...\n');

    // Para uso local, você precisa de credenciais OAuth
    // Opção 1: Usar credenciais de arquivo local
    // Opção 2: Usar credenciais de variável de ambiente

    console.log('⚠️  Para continuar, você precisa:');
    console.log('1. Baixar suas credenciais OAuth do Google Cloud Console');
    console.log('2. Salvar em credentials.json nesta pasta');
    console.log('3. Executar novamente\n');

    console.log('📋 Instruções rápidas:');
    console.log('1. Vá para: https://console.cloud.google.com/');
    console.log('2. Crie um projeto (se não tiver)');
    console.log('3. Ative Google Sheets API');
    console.log('4. Crie credenciais OAuth 2.0 (Desktop App)');
    console.log('5. Baixe como JSON e salve como credentials.json');
    console.log('6. Execute: node setup-google-sheets.js\n');

    // Se o arquivo de credenciais existir:
    const credPath = 'credentials.json';
    if (fs.existsSync(credPath)) {
      console.log('✅ credentials.json encontrado! Processando...\n');
      await processarPlanilha();
    } else {
      console.log('⏳ Aguardando credentials.json...');
      console.log('📁 Após baixar, coloque o arquivo nesta pasta e execute novamente.\n');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

async function processarPlanilha() {
  try {
    const creds = require('./credentials.json');

    // Conectar à planilha
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });

    await doc.loadInfo();

    console.log('✅ Conectado à planilha:', doc.title);
    console.log('📊 Abas encontradas:', Object.keys(doc.sheetsByIndex).length, '\n');

    // Limpar e recriar abas
    console.log('🔧 Configurando abas...\n');

    // Aba 1: Meta Ads
    let sheetMeta = doc.sheetsByTitle['Meta Ads'];
    if (!sheetMeta) {
      sheetMeta = await doc.addSheet({ title: 'Meta Ads' });
      console.log('✅ Aba "Meta Ads" criada');
    }

    // Aba 2: Google Ads
    let sheetGoogle = doc.sheetsByTitle['Google Ads'];
    if (!sheetGoogle) {
      sheetGoogle = await doc.addSheet({ title: 'Google Ads' });
      console.log('✅ Aba "Google Ads" criada');
    }

    // Headers da Aba Meta Ads
    console.log('\n📝 Configurando headers...\n');
    await sheetMeta.setHeaderRow([
      'Data/Hora',
      'Nome',
      'Email',
      'Telefone',
      'Campanha',
      'Score',
      'Notas'
    ]);
    console.log('✅ Headers - Meta Ads');

    // Headers da Aba Google Ads
    await sheetGoogle.setHeaderRow([
      'Data/Hora',
      'Nome',
      'Email',
      'Telefone',
      'Campanha',
      'Conversor',
      'Notas'
    ]);
    console.log('✅ Headers - Google Ads');

    // Adicionar exemplo de dados
    console.log('\n📌 Adicionando dados de exemplo...\n');

    await sheetMeta.addRow({
      'Data/Hora': new Date().toLocaleString('pt-BR'),
      'Nome': 'João Silva (Exemplo)',
      'Email': 'joao@example.com',
      'Telefone': '11 99999-9999',
      'Campanha': 'MH_Diagnostico_SP_2026',
      'Score': '7.5/10',
      'Notas': 'Lead capturado via Meta Ads'
    });

    await sheetGoogle.addRow({
      'Data/Hora': new Date().toLocaleString('pt-BR'),
      'Nome': 'Maria Santos (Exemplo)',
      'Email': 'maria@example.com',
      'Telefone': '11 88888-8888',
      'Campanha': 'Google Ads Campaign',
      'Conversor': 'Sim',
      'Notas': 'Lead capturado via Google Ads'
    });

    console.log('✅ Exemplos adicionados\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ PLANILHA CONFIGURADA COM SUCESSO! ✨');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📊 Estrutura criada:');
    console.log('   Aba 1: Meta Ads');
    console.log('   Aba 2: Google Ads\n');

    console.log('📝 Colunas em ambas abas:');
    console.log('   • Data/Hora');
    console.log('   • Nome');
    console.log('   • Email');
    console.log('   • Telefone');
    console.log('   • Campanha');
    console.log('   • Score/Conversor');
    console.log('   • Notas\n');

    console.log('🚀 Próximos passos:');
    console.log('   1. Acesse sua planilha no Google Drive');
    console.log('   2. Teste capturando um lead (dados de exemplo já estão lá)');
    console.log('   3. Configure os webhooks para receber dados automaticamente\n');

    console.log('🔗 Webhook URL:');
    console.log('   POST http://localhost:3000/api/leads\n');

  } catch (error) {
    console.error('❌ Erro ao processar planilha:', error.message);
    process.exit(1);
  }
}

setupSheets();
