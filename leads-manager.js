#!/usr/bin/env node

/**
 * Gerenciador de Leads Local
 * Captura dados e salva em CSV para sincronizar com Google Sheets
 */

const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
app.use(express.json());

const LEADS_DIR = path.join(__dirname, 'leads-data');
const LEADS_META_FILE = path.join(LEADS_DIR, 'leads-meta-ads.csv');
const LEADS_GOOGLE_FILE = path.join(LEADS_DIR, 'leads-google-ads.csv');

// Criar diretório se não existir
if (!fs.existsSync(LEADS_DIR)) {
  fs.mkdirSync(LEADS_DIR, { recursive: true });
}

// Inicializar arquivos CSV
function inicializarCSV(file, headers) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, headers + '\n', 'utf8');
  }
}

inicializarCSV(LEADS_META_FILE, 'Data/Hora,Nome,Email,Telefone,Campanha,Score,Notas');
inicializarCSV(LEADS_GOOGLE_FILE, 'Data/Hora,Nome,Email,Telefone,Campanha,Conversor,Notas');

// Endpoint para receber leads
app.post('/api/leads', (req, res) => {
  try {
    const { name, email, phone, campaign, source, score, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    const timestamp = new Date().toLocaleString('pt-BR');
    const csvLine = `"${timestamp}","${name}","${email}","${phone || ''}","${campaign || 'N/A'}","${score || ''}","${notes || ''}"`;

    // Determinar arquivo baseado em source
    const file = (source === 'Google Ads') ? LEADS_GOOGLE_FILE : LEADS_META_FILE;

    // Anexar linha ao arquivo
    fs.appendFileSync(file, csvLine + '\n', 'utf8');

    console.log(`✅ Lead registrado: ${name} (${source})`);

    res.json({
      success: true,
      message: `Lead registrado em ${source}`,
      file: file
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para ver leads capturados
app.get('/api/leads/export', (req, res) => {
  try {
    const source = req.query.source || 'meta'; // 'meta' ou 'google'
    const file = (source === 'google') ? LEADS_GOOGLE_FILE : LEADS_META_FILE;

    if (!fs.existsSync(file)) {
      return res.json({ leads: [], message: 'Nenhum lead capturado ainda' });
    }

    const content = fs.readFileSync(file, 'utf8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');
    const leads = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/^"|"$/g, ''));
      const lead = {};
      headers.forEach((header, i) => {
        lead[header] = values[i];
      });
      return lead;
    });

    res.json({
      source: source === 'google' ? 'Google Ads' : 'Meta Ads',
      total: leads.length,
      leads: leads,
      csvFile: file
    });

  } catch (error) {
    console.error('Erro:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para download do CSV
app.get('/api/leads/download/:type', (req, res) => {
  try {
    const type = req.params.type; // 'meta' ou 'google'
    const file = (type === 'google') ? LEADS_GOOGLE_FILE : LEADS_META_FILE;

    if (!fs.existsSync(file)) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    const filename = (type === 'google') ? 'leads-google-ads.csv' : 'leads-meta-ads.csv';
    res.download(file, filename);

  } catch (error) {
    console.error('Erro:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   📊 GERENCIADOR DE LEADS                      ║
║   Escutando em http://localhost:${PORT}             ║
║                                                ║
║   POST /api/leads                              ║
║   GET  /api/leads/export?source=meta|google   ║
║   GET  /api/leads/download/meta|google         ║
╚════════════════════════════════════════════════╝

📁 Arquivos salvos em: ${LEADS_DIR}/
  • leads-meta-ads.csv
  • leads-google-ads.csv
  `);
});

module.exports = app;
