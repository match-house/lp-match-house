// Gera os pedidos (batchUpdate) do funil desenhado nas células H11:K26 do
// Painel, no lugar da pizza "Onde cada pessoa parou". Locale pt-BR:
// argumentos com ";", decimal com ",", colunas de matriz com "\".
const sheetId = Number(process.argv[2]);
const R = (r0, r1, c0, c1) => ({ sheetId, startRowIndex: r0, endRowIndex: r1, startColumnIndex: c0, endColumnIndex: c1 });
const rgb = (h) => ({ red: parseInt(h.slice(1, 3), 16) / 255, green: parseInt(h.slice(3, 5), 16) / 255, blue: parseInt(h.slice(5, 7), 16) / 255 });
const H = 7, I = 8, J = 9, K = 10;

const MX = 'MAX($M$3:$M$8)';
const etapas = [
  { nome: '1. Login', m: 'M3', cor: '#0B1F8F', parou: 'M15' },
  { nome: '2. SMS verificado', m: 'M4', ant: 'M3', cor: '#1D3FB8', parou: 'M16' },
  { nome: '3. Cadastro completo', m: 'M5', ant: 'M4', cor: '#2F64D6', parou: 'M12' },
  { nome: '4. Imóvel cadastrado', m: 'M6', ant: 'M5', cor: '#2B8BE6', texto: '#1F74C4', parou: 'M11' },
  { nome: '5. Conversa na IA', m: 'M7', ant: 'M6', cor: '#18AEDB', texto: '#0F87AD', parou: 'M13' },
  { nome: '6. Lead da IA', m: 'M8', ant: 'M7', cor: '#12C6C0', texto: '#0B8F8A', parou: 'M14', fim: true },
];

const barra = (e) => {
  const w = `IF(N(${e.m})>0;MAX(N(${e.m});${MX}*0,03);0)`;
  return `=IFERROR(SPARKLINE({(${MX}*1,08-${w})/2\\${w}};{"charttype"\\"bar";"max"\\${MX}*1,08;"color1"\\"#FFFFFF";"color2"\\"${e.cor}"});"")`;
};
const linha1 = (e) => `=IFERROR("${e.nome}  ·  "&TEXT(N(${e.m});"0");"${e.nome}")`;
const pararam = (e) => e.fim
  ? `N(${e.parou})&" com lead"`
  : `N(${e.parou})&IF(N(${e.parou})=1;" parou";" pararam")&" aqui"`;
const linha2 = (e) => e.ant
  ? `=IFERROR(TEXT(N(${e.m})/N(${e.ant});"0%")&" passaram  ·  "&${pararam(e)};"")`
  : `=IFERROR("início  ·  "&${pararam(e)};"")`;

const txt = (f, o = {}) => ({
  userEnteredValue: { formulaValue: f },
  userEnteredFormat: {
    textFormat: { fontFamily: 'Roboto', fontSize: o.size || 10, bold: !!o.bold, italic: !!o.italic, foregroundColorStyle: { rgbColor: rgb(o.cor || '#374151') } },
    horizontalAlignment: o.h || 'LEFT', verticalAlignment: o.v || 'MIDDLE', wrapStrategy: 'CLIP',
    backgroundColorStyle: { rgbColor: rgb('#FFFFFF') },
  },
});
const str = (s, o) => { const c = txt('', o); c.userEnteredValue = { stringValue: s }; return c; };

const req = [];
req.push({ unmergeCells: { range: R(10, 26, H, K + 1) } });
// limpa a área inteira (valor e formato) antes de desenhar
req.push({ repeatCell: { range: R(10, 26, H, K + 1), cell: { userEnteredFormat: { backgroundColorStyle: { rgbColor: rgb('#FFFFFF') } } }, fields: 'userEnteredValue,userEnteredFormat' } });
req.push({ mergeCells: { range: R(10, 11, H, K + 1), mergeType: 'MERGE_ALL' } });
req.push({ mergeCells: { range: R(11, 12, H, K + 1), mergeType: 'MERGE_ALL' } });
req.push({ mergeCells: { range: R(25, 26, H, K + 1), mergeType: 'MERGE_ALL' } });
etapas.forEach((e, i) => req.push({ mergeCells: { range: R(13 + 2 * i, 15 + 2 * i, H, I + 1), mergeType: 'MERGE_ALL' } }));

const cel = (r, c, cell) => req.push({ updateCells: { start: { sheetId, rowIndex: r, columnIndex: c }, rows: [{ values: [cell] }], fields: 'userEnteredValue,userEnteredFormat' } });
cel(10, H, str('Onde cada pessoa parou', { size: 13, bold: true, cor: '#0A1B3E', v: 'BOTTOM' }));
cel(11, H, str('funil desde 14/07 · % = quanto passou da etapa anterior', { size: 10, cor: '#5F6268', v: 'TOP' }));
etapas.forEach((e, i) => {
  const r = 13 + 2 * i;
  cel(r, H, txt(barra(e), { h: 'CENTER' }));
  cel(r, K, txt(linha1(e), { size: 11, bold: true, cor: '#111827', v: 'BOTTOM' }));
  cel(r + 1, K, txt(linha2(e), { size: 10, cor: e.texto || e.cor, v: 'TOP' }));
});
cel(25, H, txt('="Largura da barra = pessoas na etapa  ·  “pararam aqui” soma os "&N(M3)&" logins"', { size: 9, italic: true, cor: '#8A8F98', v: 'MIDDLE' }));
// moldura discreta, como a dos gráficos
const b = { style: 'SOLID', width: 1, colorStyle: { rgbColor: rgb('#D6D9DE') } };
req.push({ updateBorders: { range: R(10, 26, H, K + 1), top: b, bottom: b, left: b, right: b } });
process.stdout.write(JSON.stringify(req));
