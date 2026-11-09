// Stories v3 (06/11): uma cor por tipo, título grande, pouco texto.
// Mateus, 06/11: "esses posts estão muito iguais, azul e branco" e "a dica do
// app tinha que estar escrito dica do app maior e embaixo a dica [...] o
// corretor não gosta muito de ler [...] bater o olho e saber do que se trata".
import fs from "node:fs";
const DS = "../lp-main/_ds/match-house-design-system-a2408f83-cade-4df4-bc51-545884a020be/fonts";
const head = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Stories v3</title><style>
@font-face{font-family:P;src:url("${DS}/Poppins-Regular.ttf");font-weight:400}
@font-face{font-family:P;src:url("${DS}/Poppins-Medium.ttf");font-weight:500}
@font-face{font-family:P;src:url("${DS}/Poppins-SemiBold.ttf");font-weight:600}
@font-face{font-family:P;src:url("${DS}/Poppins-Bold.ttf");font-weight:700}
@font-face{font-family:P;src:url("${DS}/Poppins-ExtraBold.ttf");font-weight:800}
:root{--navy:#00073e;--blue:#000f90;--blue5:#0a23c0;--cyan:#00efff;--cyan2:#c7faff;--paper:#f1f1f1;--g5:#6c7081}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#222;font-family:P,sans-serif;display:flex;flex-wrap:wrap;gap:40px;padding:40px;align-items:flex-start}
.art{position:relative;overflow:hidden;width:1080px;height:1920px}
.top{position:absolute;left:72px;right:72px;top:250px;display:flex;align-items:center;gap:16px;font-weight:600;font-size:30px}
.top svg{width:54px;height:54px;flex:none}
.top .pill{margin-left:auto;font-weight:700;font-size:24px;letter-spacing:.14em;text-transform:uppercase;padding:9px 22px;border-radius:999px;white-space:nowrap}
.rot{position:absolute;left:72px;right:72px;top:1620px;display:flex;justify-content:space-between;font-size:28px}
.rot b{font-weight:700}
.big{position:absolute;left:66px;right:66px;font-weight:800;letter-spacing:-.045em;line-height:.88;text-transform:uppercase}
/* DICA: ciano */
.dica{background:var(--cyan);color:var(--navy)}
.dica .top .pill{background:var(--navy);color:var(--cyan)}
.dica .big{top:350px;font-size:200px}
.dica .card{position:absolute;left:60px;right:60px;top:800px;background:#fff;border-radius:56px;padding:60px 56px 64px;box-shadow:0 30px 70px rgba(0,7,62,.18)}
.dica .t{font-weight:800;font-size:72px;line-height:1.04;letter-spacing:-.03em;text-wrap:balance}
.dica .onde{margin-top:44px;font-size:36px;color:var(--g5);font-weight:500}
.dica .btn{margin-top:18px;display:inline-flex;align-items:center;gap:22px;background:var(--blue);color:#fff;font-weight:700;font-size:54px;padding:26px 44px;border-radius:999px}
.dica .btn svg{width:56px;height:56px;color:var(--cyan);flex:none}
.dica .l{margin-top:40px;font-size:38px;line-height:1.3;font-weight:500}
.dica .rot{color:var(--navy)}
/* PERGUNTA: branco */
.perg{background:#fff;color:var(--navy)}
.perg .top{color:var(--blue)}
.perg .top .pill{background:var(--cyan);color:var(--navy)}
.perg .big{top:350px;font-size:170px;color:var(--blue)}
.perg .q{position:absolute;left:72px;right:72px;top:760px;font-weight:800;font-size:96px;line-height:1.02;letter-spacing:-.035em;text-wrap:balance}
.perg .sub{position:absolute;left:72px;right:72px;top:1200px;font-size:42px;color:var(--g5);font-weight:500}
.perg .resp{position:absolute;left:72px;right:72px;top:1340px;display:flex;align-items:center;gap:22px;background:var(--paper);border-radius:999px;padding:30px 40px;font-weight:700;font-size:40px}
.perg .resp svg{width:56px;height:56px;color:var(--blue);flex:none}
.perg .rot{color:var(--g5)} .perg .rot b{color:var(--navy)}
/* DIAGNÓSTICO: azul royal */
.diag{background:var(--blue);color:#fff}
.diag .top .pill{background:var(--cyan);color:var(--navy)}
.diag .top svg{color:var(--cyan)}
.diag .big{top:370px;font-size:120px;color:var(--cyan)}
.diag .t{position:absolute;left:72px;right:72px;top:660px;font-weight:800;font-size:84px;line-height:1.04;letter-spacing:-.03em;text-wrap:balance}
.diag .sub{position:absolute;left:72px;right:72px;top:900px;font-size:42px;line-height:1.3;color:var(--cyan2);font-weight:500}
.diag .cta{position:absolute;left:60px;right:60px;top:1100px;background:var(--cyan);color:var(--navy);border-radius:56px;padding:50px 56px}
.diag .cta .a{font-weight:800;font-size:62px;line-height:1.08;letter-spacing:-.02em}
.diag .cta .b{margin-top:14px;font-size:36px;font-weight:500}
.diag .rot{color:var(--cyan2)} .diag .rot b{color:#fff}
/* NOITE: navy, letra grande */
.noite{background:radial-gradient(110% 70% at 70% 0%,#0b1fa8 0%,#00073e 58%,#00031f 100%);color:#fff}
.noite .top .pill{background:var(--cyan);color:var(--navy)}
.noite .top svg{color:var(--cyan)}
.noite .t{position:absolute;left:72px;right:72px;top:350px;font-weight:800;font-size:88px;line-height:1.04;letter-spacing:-.035em}
.noite .t span{color:var(--cyan);display:block}
.noite .chat{position:absolute;left:72px;right:72px;top:800px;display:flex;flex-direction:column;gap:22px}
.noite .m{max-width:88%;padding:26px 32px;border-radius:38px;font-size:40px;line-height:1.3;font-weight:500}
.noite .cli{align-self:flex-end;background:#fff;color:var(--navy);border-bottom-right-radius:10px}
.noite .ia{align-self:flex-start;background:#243084;border-bottom-left-radius:10px}
.noite .ok{align-self:flex-start;background:var(--cyan);color:var(--navy);font-weight:700;border-bottom-left-radius:10px}
.noite .quem{font-size:26px;color:#9aa3e0;font-weight:600;margin-bottom:-8px}
.noite .rot{color:#9aa3e0} .noite .rot b{color:#fff}
.noite .nota{position:absolute;right:72px;top:1570px;font-size:22px;color:#9aa3e0}
</style></head><body>
<svg width="0" height="0" style="position:absolute"><defs>
<symbol id="cad" viewBox="0 0 48 48"><rect x="9" y="21" width="30" height="22" rx="5" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M15 21v-6a9 9 0 0 1 17.5-3" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><circle cx="24" cy="32" r="3" fill="currentColor"/></symbol>
<symbol id="toque" viewBox="0 0 48 48"><path d="M19 22V10a4 4 0 0 1 8 0v12m0-4a4 4 0 0 1 8 0v4m0 0a4 4 0 0 1 8 0v8c0 8-5 14-13 14h-2c-5 0-8-2-11-6l-6-9a4 4 0 0 1 6-5l3 4" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="seta" viewBox="0 0 48 48"><path d="M24 6v32M12 26l12 12 12-12" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
</defs></svg>
`;
const rot = `<div class="rot"><span><b>@matchhouse.br</b></span><span>A IA no link da bio</span></div>`;
const top = (txt, pill) => `<div class="top"><svg><use href="#cad"/></svg><span>${txt}</span><span class="pill">${pill}</span></div>`;

const dica = (id, t, onde, btn, l) => `
<div class="art dica" id="${id}">
  ${top("Match House", "1 minuto")}
  <div class="big">Dica<br>do app</div>
  <div class="card"><div class="t">${t}</div><div class="onde">${onde}</div><div class="btn"><svg><use href="#toque"/></svg>${btn}</div><div class="l">${l}</div></div>
  ${rot}
</div>`;
const pergunta = (id, q, sub) => `
<div class="art perg" id="${id}">
  ${top("Match House", "Responda")}
  <div class="big">Pergunta<br>do dia</div>
  <div class="q">${q}</div>
  <div class="sub">${sub}</div>
  <div class="resp"><svg><use href="#seta"/></svg>Responda aqui embaixo</div>
  ${rot}
</div>`;
const diag = (id, t, sub) => `
<div class="art diag" id="${id}">
  ${top("Match House", "2 minutos")}
  <div class="big">Diagnóstico<br>do Instagram</div>
  <div class="t">${t}</div>
  <div class="sub">${sub}</div>
  <div class="cta"><div class="a">Responda DIAGNÓSTICO aqui embaixo</div><div class="b">e a gente te manda o link do teste.</div></div>
  ${rot}
</div>`;
const noite = (id, t, cli, ia, ok) => `
<div class="art noite" id="${id}">
  ${top("Modo Desbloqueado", "Desbloqueado")}
  <div class="t">${t}</div>
  <div class="chat"><div class="quem">Cliente, no Smart Link da Camila</div><div class="m cli">${cli}</div><div class="m ia">${ia}</div><div class="m ok">${ok}</div></div>
  <div class="nota">*Personagem fictícia</div>
  ${rot}
</div>`;

// Semana 3 (09 a 15/11): 8h dica, 12h pergunta, 17h dica (diagnóstico na terça e na sexta), 21h Modo Desbloqueado.
const artes = [
  // segunda, 09/11
  dica("d1109a", "Tem o PDF do imóvel? A IA lê.", "Em Imóveis, toque em", "Anexar PDF", "Ficha, memorial ou matrícula."),
  pergunta("d1109b", "Qual bairro você mais atende?", "Responda com o nome do bairro."),
  dica("d1109c", "Escolha a foto de capa.", "Embaixo da foto, toque em", "Tornar capa", "É a primeira foto que o cliente vê."),
  noite("d1109d", "Segunda, 21h.<br>Você no violão.<span>A IA atendendo.</span>",
    "Tem apartamento de 2 quartos perto do metrô?", "Tenho 2 opções! Me passa seu nome e celular que eu marco a visita.", "Visita marcada: quarta, 19h."),
  // terça, 10/11
  dica("d1110a", "Vídeo do imóvel no anúncio.", "Em Fotos e mídia, cole o link em", "Vídeo", "YouTube ou link direto. Tem também o Tour 360°."),
  pergunta("d1110b", "Você ainda usa placa de Vende-se?", "Sim, não ou às vezes?"),
  diag("d1110c", "Seu perfil mostra onde você atende?", "Cidade, bairros e link, em 2 minutos."),
  noite("d1110d", "Terça, 21h30.<br>Você na pizzaria.<span>A IA atendendo.</span>",
    "Qual o valor do condomínio?", "R$ 680 por mês. Quer visitar? Me passa seu nome e celular.", "Contato salvo para a Camila."),
  // quarta, 11/11
  dica("d1111a", "A sua IA fala “da”, “do” ou “de” você?", "Em Editar perfil, escolha em", "<span style=\"font-size:44px;white-space:nowrap\">Como a sua IA fala de você</span>", "“Oi! Eu sou a IA da Camila.”"),
  pergunta("d1111b", "Seu cliente prefere ligação ou mensagem?", "Ligação, áudio ou texto?"),
  dica("d1111c", "Vendeu? Tire do ar sem apagar.", "Ao editar o imóvel, ligue", "Ocultar anúncio", "Volta para o ar quando você quiser."),
  noite("d1111d", "Quarta, 20h30.<br>Você na corrida.<span>A IA atendendo.</span>",
    "Aceita financiamento?", "Aceita sim! Me passa seu nome e celular que a Camila explica os detalhes.", "Contato salvo para a Camila."),
  // quinta, 12/11
  dica("d1112a", "A carteira inteira de uma vez.", "Em Imóveis, toque em", "Enviar XML do CRM", "Entram como rascunho para você conferir."),
  pergunta("d1112b", "Quantas visitas você faz por semana?", "Responda com o número."),
  dica("d1112c", "Leia o que o cliente perguntou.", "Em IA & Leads, toque em", "Ver conversa", "A conversa inteira, do primeiro oi."),
  noite("d1112d", "Quinta, 21h15.<br>Você no teatro.<span>A IA atendendo.</span>",
    "Tem vaga de garagem?", "Tem 2 vagas cobertas. Quer visitar no sábado?", "Visita marcada: sábado, 11h."),
  // sexta, 13/11
  dica("d1113a", "Seu link no Status do WhatsApp.", "Em Divulgar, marque no checklist", "Status do WhatsApp", "E veja onde mais o link precisa estar."),
  pergunta("d1113b", "O que mais toma o seu tempo no dia?", "Responder, visitar ou anunciar?"),
  diag("d1113c", "O cliente entende o que você vende?", "Nome, foto e bio, em 2 minutos."),
  noite("d1113d", "Sexta, 23h.<br>Você no casamento.<span>A IA atendendo.</span>",
    "Posso visitar com meu marido no domingo?", "Domingo às 11h está livre. Me passa seu nome e celular?", "Visita marcada: domingo, 11h."),
  // sábado, 14/11
  dica("d1114a", "Imóvel exclusivo? Arte pronta.", "Em Divulgar, escolha o estilo", "Fora dos portais", "Endereço tarjado. Só no seu link."),
  pergunta("d1114b", "Sábado é dia de visita?", "Sim, não ou só de manhã?"),
  dica("d1114c", "Não gostou da arte? Sorteie outra.", "Em Divulgar, toque em", "Surpreenda-me", "São 4 estilos prontos para o feed."),
  noite("d1114d", "Sábado, 22h.<br>Você no barzinho.<span>A IA atendendo.</span>",
    "Aceita pet?", "Aceita sim! Me passa seu nome e celular que eu marco a visita.", "Visita marcada: terça, 17h."),
  // domingo, 15/11
  dica("d1115a", "Endereço pelo CEP.", "Em Localização, digite o", "CEP", "Rua, bairro e cidade vêm sozinhos."),
  pergunta("d1115b", "Que pergunta você queria que a IA respondesse?", "Conta pra gente aqui."),
  dica("d1115c", "Seu link copiado em qualquer tela.", "No topo do app, toque em", "Copiar link", "Cole no WhatsApp, no e-mail, onde quiser."),
  noite("d1115d", "Domingo, 18h.<br>Você no parque.<span>A IA atendendo.</span>",
    "Dá para ver o terreno amanhã cedo?", "Amanhã às 9h está livre. Me passa seu nome e celular que eu marco.", "Visita marcada: segunda, 9h."),
];
fs.writeFileSync("semana3.html", head + artes.join("\n") + "\n</body></html>\n");
console.log(artes.length, "artes");
