// Gera stories/semana2.html (02 a 08/11/2026), mesmo modelo da semana 1.
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
  // seg 02/11
  dica("d1102a", "Cole o texto do WhatsApp. <span>A IA monta o anúncio.</span>", [
    "Em Imóveis, toque em <b>Cadastrar outro imóvel</b>.",
    "Toque em <b>Colar o texto</b> e cole o que você já manda ao cliente.",
    "Toque em <b>Preencher com a IA</b>, confira e publique.",
  ], "É o jeito mais rápido de pôr um imóvel no ar."),
  pergunta("d1102b", "Qual pergunta o cliente faz <span>20 vezes por dia?</span>", "Conta pra gente aqui. A gente lê todas as respostas."),
  dica("d1102c", "Cliente deixou o celular? <span>Assuma na hora.</span>", [
    "Em <b>IA & Leads</b>, toque em <b>Ver conversa</b>.",
    "Leia o que o cliente perguntou para a sua IA.",
    "Toque em <b>Assumir conversa</b>: o WhatsApp abre com a mensagem pronta.",
  ], "O botão aparece quando o cliente deixa o celular."),
  noite("d1102d", "Segunda, 21h. Você na academia. <span>A IA no atendimento.</span>", "21h04", [
    ["cli", "Oi! Esse apartamento tem vaga de garagem?"],
    ["ia", "Oi! Tem sim, uma vaga coberta. Quer agendar uma visita? Me passa seu nome e celular que eu marco."],
    ["cli", "Carla, (11) 9••••-••••. Pode ser quinta à tarde?"],
  ], "Visita marcada: quinta, 16h."),
  // ter 03/11
  dica("d1103a", "Qual imóvel <span>chama mais atenção?</span>", [
    "Abra <b>Métricas</b> e escolha <b>7d</b>.",
    "Em <b>Desempenho por anúncio</b>, o olho mostra as visualizações.",
    "Compare os imóveis e divulgue mais o que mais aparece.",
  ], "O cursor mostra os cliques; a seta, os compartilhamentos."),
  pergunta("d1103b", "Você atende <span>venda, locação ou os dois?</span>", "Responda com uma palavra aqui embaixo."),
  diag("d1103c", "Seu perfil convence <span>em 5 segundos?</span>", "O Diagnóstico de Posicionamento Digital avalia o seu Instagram em 2 minutos e mostra o que ajustar para o cliente chamar você."),
  noite("d1103d", "Terça, 22h. Você vendo série. <span>A IA respondendo.</span>", "22h11", [
    ["cli", "Boa noite! O apartamento aceita animais?"],
    ["ia", "Boa noite! Aceita sim, o condomínio permite pets. Quer que a Camila te mande mais fotos? Me passa seu nome e celular."],
    ["cli", "Diego, (11) 9••••-••••."],
  ], "Contato salvo para a Camila."),
  // qua 04/11
  dica("d1104a", "Post pronto <span>em 1 toque.</span>", [
    "Em <b>Divulgar</b>, veja <b>Seu anúncio pronto para postar</b>.",
    "Escolha um estilo ou toque em <b>Surpreenda-me</b>.",
    "Toque em <b>Compartilhar imagem</b> e poste no feed.",
  ], "A arte já sai com o seu link."),
  pergunta("d1104b", "Seu link já está <span>na bio do Instagram?</span>", "Sim ou ainda não: responda aqui que a gente te ajuda."),
  dica("d1104c", "Seu Instagram <span>dentro do Smart Link.</span>", [
    "No app, toque em <b>Redes</b>.",
    "Toque em <b>Adicionar rede social</b> e escolha Instagram.",
    "Digite o seu @ e toque em <b>Adicionar</b>.",
  ], "Vale também para Facebook, TikTok, LinkedIn e YouTube."),
  noite("d1104d", "Quarta, 20h45. Você no futebol. <span>A IA no atendimento.</span>", "20h47", [
    ["cli", "Qual o valor do condomínio dessa casa?"],
    ["ia", "É R$ 450 por mês. Quer visitar no sábado? Me passa seu nome e celular que eu marco com a Camila."],
    ["cli", "Ana, (11) 9••••-••••. Sábado de manhã."],
  ], "Visita marcada: sábado, 11h."),
  // qui 05/11
  dica("d1105a", "Seu rosto <span>no seu Smart Link.</span>", [
    "Na Visão, toque em <b>Editar perfil</b>.",
    "Toque em <b>Foto de perfil</b> e escolha uma foto sua.",
    "Toque em <b>Salvar alterações</b>.",
  ], "O cliente confia mais quando vê com quem vai falar."),
  pergunta("d1105b", "Quanto tempo você leva <span>para responder um cliente novo?</span>", "Minutos, horas ou no dia seguinte? Responda aqui."),
  dica("d1105c", "As visitas marcadas <span>num lugar só.</span>", [
    "Abra <b>IA & Leads</b> e entre em <b>Visitas</b>.",
    "Veja, dia a dia, as visitas que a IA marcou.",
    "Toque em <b>Chamar no WhatsApp</b> para confirmar com o cliente.",
  ], "Mudou o plano? Use Cancelar visita e avise o cliente."),
  noite("d1105d", "Quinta, 21h20. Você no aniversário do seu filho. <span>A IA no atendimento.</span>", "21h22", [
    ["cli", "Tem algum apartamento de 3 quartos em Moema?"],
    ["ia", "Tenho 2 opções no Smart Link da Camila. Te mostro? Me passa seu nome e celular para ela te chamar."],
    ["cli", "Mostra sim! Pedro, (11) 9••••-••••."],
  ], "Opções enviadas. Contato salvo."),
  // sex 06/11
  dica("d1106a", "Só tem as fotos? <span>A IA escreve o anúncio.</span>", [
    "Em Imóveis, toque em <b>Cadastrar outro imóvel</b>.",
    "Toque em <b>Mandar fotos</b> e escolha as fotos do imóvel.",
    "A IA monta a descrição. Confira e publique.",
  ], "Ela olha até 8 fotos para escrever."),
  pergunta("d1106b", "De onde vem <span>a maioria dos seus clientes?</span>", "Instagram, placa, indicação ou portal? Responda aqui."),
  diag("d1106c", "Bio, destaques e link: <span>o que falta no seu perfil?</span>", "Faça o Diagnóstico de Posicionamento Digital e veja, em 2 minutos, o que ajustar primeiro no seu Instagram."),
  noite("d1106d", "Sexta, 22h30. Você no show. <span>A IA no atendimento.</span>", "22h33", [
    ["cli", "Esse imóvel aceita permuta?"],
    ["ia", "Vou confirmar com a Camila. Me passa seu nome e celular que ela te responde amanhã cedo."],
    ["cli", "Juliana, (11) 9••••-••••."],
  ], "Contato salvo para a Camila."),
  // sáb 07/11 (story da série às 9h: sem o das 8h)
  pergunta("d1107b", "Qual imóvel você mais quer <span>vender este mês?</span>", "Casa, apartamento, terreno? Conta pra gente aqui."),
  dica("d1107c", "Legenda pronta <span>para o seu post.</span>", [
    "Em <b>Divulgar</b>, vá até <b>Legenda pronta</b>.",
    "Toque em <b>Copiar legenda</b>.",
    "Cole no seu post e publique.",
  ], "A legenda já leva o seu smartli.ink."),
  noite("d1107d", "Sábado, 21h. Você no churrasco. <span>A IA no atendimento.</span>", "21h09", [
    ["cli", "Dá para visitar a casa amanhã de manhã?"],
    ["ia", "Amanhã às 10h está livre na agenda da Camila. Me passa seu nome e celular que eu marco."],
    ["cli", "Rodrigo, (11) 9••••-••••."],
  ], "Visita marcada: domingo, 10h."),
  // dom 08/11
  dica("d1108a", "Seu QR <span>no cartão de visita.</span>", [
    "Em <b>Divulgar</b>, vá até <b>QR do seu Smart Link</b>.",
    "Toque em <b>Ver QR code</b> e depois em <b>Baixar imagem</b>.",
    "Ponha no cartão, no panfleto ou na mesa do plantão.",
  ], "Quem aponta a câmera fala com a sua IA."),
  pergunta("d1108b", "Domingo é dia de <span>responder cliente?</span>", "Sim, não ou só os importantes: responda aqui."),
  dica("d1108c", "Lançamento? <span>Marque a fase.</span>", [
    "Em Imóveis, toque no lápis do imóvel.",
    "Logo abaixo do Subtipo, escolha a <b>Fase</b>.",
    "Toque em <b>Salvar alterações</b>.",
  ], "Lançamento, Em construção ou Pronto: o selo aparece no seu Smart Link."),
  noite("d1108d", "Domingo, 20h. Você no cinema. <span>A IA no atendimento.</span>", "20h06", [
    ["cli", "A casa ainda está disponível?"],
    ["ia", "Está sim! Quer agendar uma visita? Me passa seu nome e celular que eu marco com a Camila."],
    ["cli", "Fernanda, (11) 9••••-••••. Terça depois do trabalho."],
  ], "Visita marcada: terça, 18h."),
];
fs.writeFileSync("semana2.html", head + artes.join("\n") + "\n</body>\n</html>\n");
console.log(artes.length, "artes");
