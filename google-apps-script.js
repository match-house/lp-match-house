// Google Apps Script para Match House
// Copie este código para: Extensions > Apps Script na sua planilha

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSheet();

    // Detecta origem (Meta ou Google)
    const source = payload.source || 'Desconhecida';
    const campaign = payload.campaign || 'N/A';
    const timestamp = new Date();

    // Adiciona linha com os dados
    sheet.appendRow([
      timestamp,                    // Data/Hora
      payload.name || '',           // Nome
      payload.email || '',          // Email
      payload.phone || '',          // Telefone
      campaign,                     // Campanha
      source,                       // Origem (Meta/Google)
      payload.score || '',          // Score (se houver)
      payload.notes || ''           // Notas
    ]);

    // Log para debug
    Logger.log(`Lead recebido: ${payload.name} - ${source}`);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Lead registrado com sucesso'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Erro: ' + error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Para testar localmente:
function testWebhook() {
  const testPayload = {
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '11999999999',
    campaign: 'MH_Diagnostico_SP_2026',
    source: 'Meta Ads',
    score: '7.5',
    notes: 'Teste'
  };

  doPost({
    postData: {
      contents: JSON.stringify(testPayload)
    }
  });
}
