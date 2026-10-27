// Gera stories/semana1.html a partir de uma lista simples (27/10/2026).
import fs from "node:fs";
const head = fs.readFileSync("_head.html", "utf8") + fs.readFileSync("_extra.css", "utf8");
const foot = `<div class="s-foot"><span><b>@matchhouse.br</b></span><span>A IA no link da bio</span></div>`;
const hd = (lbl, pill, aberto = true) =>
  `<div class="s-hd"><svg class="cad"><use href="#${aberto ? "aberto" : "fechado"}"/></svg><span class="lbl">${lbl}</span><span class="pill">${pill}</span></div>`;

const dica = (id, h1, passos, fim) => `
<div class="art f916 navy" id="${id}">
  ${hd("Dica do app", "1 minuto")}
  <div class="s-h1">${h1}</div>
  <div class="s-passos"><div class="passos"><div class="lb">Passo a passo</div><ol>${passos.map((p) => `<li><span>${p}</span></li>`).join("")}</ol><div class="fim">${fim}</div></div></div>
  ${foot}
</div>`;

const pergunta = (id, q, sub) => `
<div class="art f916 navy" id="${id}">
  ${hd("Pergunta do dia", "Responda")}
  <div class="s-q">${q}</div>
  <p class="s-txt" style="top:1180px">${sub}</p>
  <div class="s-resp"><svg><use href="#seta"/></svg>Responda aqui embaixo, em "Enviar mensagem".</div>
  ${foot}
</div>`;

const diag = (id, h1, txt) => `
<div class="art f916 navy" id="${id}">
  ${hd("Diagnóstico do Instagram", "2 minutos")}
  <div class="s-h1">${h1}</div>
  <p class="s-txt" style="top:900px">${txt}</p>
  <div class="s-assin" style="top:1180px"><div class="a1">Responda DIAGNÓSTICO<br>aqui embaixo</div><div class="a2">que a gente te manda o link do teste.</div></div>
  ${foot}
</div>`;

const noite = (id, h1, hora, msgs, ok) => `
<div class="art f916 navy" id="${id}">
  <div class="nota">*Personagem fictícia</div>
  ${hd("Modo Desbloqueado", "Desbloqueado")}
  <div class="s-h1">${h1}</div>
  <div class="s-mid" style="top:780px"><div class="chat">
    <div class="hd"><div class="av">C</div><div><div class="nm">IA de Camila</div><div class="st">tela do cliente · Smart Link</div></div><div class="hr">${hora}</div></div>
    <div class="msgs">${msgs.map(([q, t]) => `<div class="m ${q}">${t}</div>`).join("")}<div class="m ia ok">${ok}</div></div>
  </div></div>
  <div class="s-assin" style="top:1440px"><div class="a1">Faça o que quiser:<br>a IA está atendendo por você.</div></div>
  ${foot}
</div>`;

const artes = [
  // qua 28/10 (o ep. 7 da Camila sai às 19h: sem o das 17h)
  dica("d1028a", "Cole o link do anúncio. <span>A IA preenche.</span>", [
    "Em Imóveis, toque em <b>Novo imóvel</b>.",
    "Cole o link do seu anúncio ou o texto que você manda no WhatsApp.",
    "Toque em <b>Preencher com a IA</b>, confira e publique.",
  ], "Em 1 minuto o imóvel está no seu Smart Link."),
  pergunta("d1028b", "Quantos clientes te chamaram <span>depois das 22h</span> esta semana?", "Conta pra gente. A gente lê todas as respostas."),
  noite("d1028d", "22h41. Você no sofá. <span>A IA no atendimento.</span>", "22h41", [
    ["cli", "Boa noite! A casa de 3 quartos ainda está disponível?"],
    ["ia", "Boa noite! Está sim. Quer agendar uma visita? Me passa seu nome e celular que eu marco."],
    ["cli", "Marina, (11) 9••••-••••. Pode ser sábado de manhã."],
  ], "Visita marcada: sábado, 10h."),
  // qui 29/10
  dica("d1029a", "Ponha um QR na <span>placa de Vende-se.</span>", [
    "Em Imóveis, toque no ícone de <b>QR</b> do imóvel.",
    "Toque em <b>Baixar imagem</b> e mande imprimir.",
    "Quem aponta a câmera abre o imóvel e fala com a sua IA.",
  ], "Vale para placa, panfleto e cartão de visita."),
  pergunta("d1029b", "Que horário <span>mais chega cliente</span> para você?", "Manhã, tarde ou noite? Responda com uma palavra."),
  diag("d1029c", "Seu Instagram atrai cliente <span>ou só aparece?</span>", "O Diagnóstico de Posicionamento Digital mostra, em 2 minutos, o que ajustar no seu perfil para o cliente chamar você."),
  noite("d1029d", "23h05. Você dormindo. <span>A IA respondendo.</span>", "23h05", [
    ["cli", "Oi, esse apartamento aceita financiamento?"],
    ["ia", "Oi! Aceita sim, e também FGTS. Quer que a Camila te chame amanhã para simular? Me passa seu nome e celular."],
    ["cli", "Rafael, (11) 9••••-••••."],
  ], "Contato salvo para a Camila."),
  // sex 30/10 (story da série às 19h: sem o das 17h)
  dica("d1030a", "Faltou uma comodidade? <span>Escreva a sua.</span>", [
    "No imóvel, vá até <b>Comodidades</b>.",
    "No grupo certo, escreva no campo <b>Escreva aqui</b>.",
    "Toque em <b>Adicionar</b>. Ela aparece no seu Smart Link.",
  ], "Quantas quiser, em cada imóvel."),
  pergunta("d1030b", "Você responde cliente <span>no fim de semana?</span>", "Sim, não ou às vezes: responda aqui."),
  noite("d1030d", "Sexta, 21h30. Você no jantar. <span>A IA no atendimento.</span>", "21h30", [
    ["cli", "Vocês têm apartamento de 2 quartos perto do metrô?"],
    ["ia", "Tenho 2 opções no Smart Link da Camila. Te mostro as fotos? E me passa seu nome e celular para ela te chamar."],
    ["cli", "Pode mostrar! Lucas, (11) 9••••-••••."],
  ], "Fotos enviadas. Contato salvo."),
  // sáb 31/10 (story da série às 22h: sem o das 21h)
  dica("d1031a", "Seu link na bio <span>em 1 toque.</span>", [
    "No app, toque em <b>Divulgar</b>.",
    "Toque em <b>Cole o link na bio do Instagram</b>.",
    "Cole no campo de link do seu perfil e salve.",
  ], "Quem chega pelo seu Instagram é atendido na hora."),
  pergunta("d1031b", "Sábado à noite: <span>quem atende o seu cliente?</span>", "Conta pra gente aqui."),
  diag("d1031c", "Fim de semana é quando o cliente procura. <span>Seu perfil está pronto?</span>", "Faça o Diagnóstico de Posicionamento Digital: 2 minutos e você sabe o que ajustar no Instagram."),
  // dom 01/11
  noite("d1101a", "Domingo, 9h. Você com a família. <span>A IA no atendimento.</span>", "9h02", [
    ["cli", "Bom dia! Dá para visitar o apartamento hoje à tarde?"],
    ["ia", "Bom dia! Hoje às 15h está livre na agenda da Camila. Me passa seu nome e celular que eu marco."],
    ["cli", "Paula, (11) 9••••-••••."],
  ], "Visita marcada: hoje, 15h."),
  pergunta("d1101b", "Quantos imóveis você tem <span>no seu Smart Link</span> hoje?", "Responda com o número. A gente te manda uma dica."),
  dica("d1101c", "Imóvel sem foto <span>não vende.</span>", [
    "Em Imóveis, toque no quadro azul <b>Sem foto</b>.",
    "Suba as fotos do imóvel (até 30).",
    "Use <b>Tornar capa</b> para escolher a foto da frente.",
  ], "Com fotos, o cliente vê o imóvel antes de chamar."),
  noite("d1101d", "Domingo, 22h. Você descansando. <span>A IA trabalhando.</span>", "22h07", [
    ["cli", "Oi! Esse terreno ainda está à venda?"],
    ["ia", "Oi! Está sim. Quer receber a localização e as medidas pelo WhatsApp? Me passa seu nome e celular."],
    ["cli", "Bruno, (11) 9••••-••••."],
  ], "Contato salvo para a Camila."),
];
fs.writeFileSync("semana1.html", head + artes.join("\n") + "\n</body>\n</html>\n");
console.log(artes.length, "artes");
