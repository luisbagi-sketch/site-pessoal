(function () {
  "use strict";

  var D = window.DADOS;
  if (!D) {
    console.error("js/dados.js não foi carregado. Confira se o arquivo existe e se o <script> está no index.html.");
    return;
  }
  document.documentElement.classList.add("js");

  var REDUZIR = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function lista(x) { return Array.isArray(x) ? x : []; }
  function pegar(obj, caminho) { return caminho.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
  function dois(n) { return (n < 10 ? "0" : "") + n; }

  function esc(valor) {
    return String(valor == null ? "" : valor).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  
  function url(u) {
    u = String(u || "").trim();
    if (!u) return "";
    if (/^(https?:\/\/|mailto:|tel:|#)/i.test(u)) return u;
    if (/^\.{0,2}\//.test(u)) return u;
    if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(u)) return "https://" + u;
    return "";
  }

  function dominio(u) {
    try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; }
  }

  
  function semente(n) {
    return function () {
      n |= 0; n = n + 0x6D2B79F5 | 0;
      var t = Math.imul(n ^ n >>> 15, 1 | n);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  var SETA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7m0 0H8m9 0v9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var ICONES = {
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1.6 2L12 12.6 19.4 7H4.6Z" fill="currentColor"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor"/><path fill="#F6EEDD" d="M6.2 9.5h2.4V18H6.2V9.5Zm1.2-3.9a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Zm3 3.9h2.3v1.2c.4-.7 1.3-1.4 2.7-1.4 2.6 0 3.1 1.7 3.1 3.9V18h-2.4v-4.3c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V18h-2.4V9.5Z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3 3.9c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3l-.4-.2-1.6-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.7-.7-1.2-1.5-1.4-1.8-.1-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4H9Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 1.8A3.2 3.2 0 0 0 3.8 7v10A3.2 3.2 0 0 0 7 20.2h10a3.2 3.2 0 0 0 3.2-3.2V7A3.2 3.2 0 0 0 17 3.8H7Zm5 3.2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.2-2.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"/></svg>',
    trofeu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v6a5 5 0 0 1-10 0V3Zm0 2H4v2a3 3 0 0 0 3 3m10-5h3v2a3 3 0 0 1-3 3M12 14v4m-4 3h8m-6-3h4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  
  document.title = (D.site && D.site.titulo) || document.title;
  var meta = $('meta[name="description"]');
  if (meta && D.site && D.site.descricao) meta.setAttribute("content", D.site.descricao);
  $$('meta[property="og:title"]').forEach(function (m) { m.setAttribute("content", D.site.titulo); });
  $$('meta[property="og:description"]').forEach(function (m) { m.setAttribute("content", D.site.descricao); });

  $$("[data-bind]").forEach(function (el) {
    var v = pegar(D, el.getAttribute("data-bind"));
    if (v != null && v !== "") el.textContent = v;
  });
  $$("[data-bind-src]").forEach(function (el) {
    var v = pegar(D, el.getAttribute("data-bind-src"));
    if (v) el.setAttribute("src", v);
    el.setAttribute("alt", "Foto de " + (D.pessoa.nome || "perfil"));
  });
  $("#ano").textContent = (D.site && D.site.ano) || new Date().getFullYear();

  
  var P = D.pessoa || {};
  var nomeCurto = String(P.nomeCurto || P.nome || "").trim();

  
  (function () {
    var ini = nomeCurto.split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p.charAt(0); }).join("");
    $("#logo-iniciais").textContent = (ini || "•").toLowerCase();
  })();

  $("#hero-rotulo").textContent = ((D.site && D.site.rotuloTopo) || "portfólio") + " · " + ((D.site && D.site.ano) || "");
  if (P.cidade) $("#hero-local").textContent = P.cidade; else $("#hero-local").hidden = true;

  var etiquetas = lista(D.site && D.site.etiquetas);
  ["a", "b"].forEach(function (k, i) {
    var el = $("#pilula-" + k);
    if (etiquetas[i]) { el.textContent = etiquetas[i]; el.hidden = false; }
  });

  var gh = url(D.contato && D.contato.github);
  if (gh) {
    var h = $("#hero-handle");
    h.textContent = gh.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    h.hidden = false;
  }

  
  
  var contagemTitulos = 0;
  $$("[data-wonky]").forEach(function (el) {
    var texto = el.textContent.replace(/\s+/g, " ").trim();
    if (!texto) return;
    var rnd = semente(++contagemTitulos * 977 + texto.length);
    var palavras = texto.split(" ");
    var idx = 0, maior = 0;
    el.setAttribute("aria-label", texto);
    el.innerHTML = palavras.map(function (p) {
      maior = Math.max(maior, p.length);
      var letras = p.split("").map(function (ch) {
        var r = (rnd() * 9 - 4.5).toFixed(1);
        var y = (rnd() * 0.1 - 0.05).toFixed(3);
        return '<span class="l" aria-hidden="true" style="--r:' + r + 'deg;--y:' + y + 'em;--i:' + (idx++) + '">' + esc(ch) + "</span>";
      }).join("");
      return '<span class="pal" aria-hidden="true">' + letras + "</span>";
    }).join(" ");
    el.style.setProperty("--n", Math.max(maior, 3));
  });

  
  (function () {
    var itens = lista(D.site && D.site.faixa).filter(Boolean);
    if (!itens.length) itens = [P.curso, P.instituicao, P.cidade].filter(Boolean);
    if (!itens.length) itens = [nomeCurto];

    function trilho(id, ordem) {
      var item = ordem.map(function (t) {
        return '<span class="fx-item">' + esc(t) + '</span><img class="fx-sep" src="images/stickers/brilho-preto.svg" alt="">';
      }).join("");
      var rep = Math.max(2, Math.ceil(10 / itens.length));
      var grupo = '<div class="fx-grupo">' + new Array(rep + 1).join(item) + "</div>";
      $("#" + id).innerHTML = grupo + grupo;
    }
    trilho("faixa-1", itens);
    trilho("faixa-2", itens.slice().reverse());
  })();

  
  $("#sobre-texto").innerHTML = lista(P.apresentacao).map(function (p) {
    return "<p>" + esc(p) + "</p>";
  }).join("");

  $("#sobre-destaques").innerHTML = lista(P.destaques).map(function (d) {
    return '<li><span class="etiqueta">' + esc(d.rotulo) + "</span><span>" + esc(d.valor) + "</span></li>";
  }).join("");

  var premios = lista(D.eventos).filter(function (e) { return e.premio; }).length;
  var numeros = [
    { n: lista(D.projetos).length, t: "Projetos" },
    { n: lista(D.sites).length, t: "Sites" },
    { n: lista(D.eventos).length, t: "Eventos" },
    { n: premios, t: "Premiações" },
    { n: lista(D.atividades).length, t: "Atividades" }
  ].filter(function (x) { return x.n > 0; }).slice(0, 4);
  $("#stats").innerHTML = numeros.map(function (x, i) {
    return '<li class="stat revelar" style="--rot:' + (i % 2 ? 2 : -2) + 'deg"><b class="stat-num" data-alvo="' + x.n + '">' + x.n + "</b><span>" + x.t + "</span></li>";
  }).join("");
  if (!numeros.length) $("#stats").hidden = true;

  
  var TIPOS = {
    trabalho: { nome: "Trabalho", cls: "tipo-trabalho" },
    curso: { nome: "Curso", cls: "tipo-curso" },
    outra: { nome: "Experiência", cls: "tipo-outra" }
  };

  $("#lista-atividades").innerHTML = lista(D.atividades).map(function (a, i) {
    var tipo = TIPOS[a.tipo] ? a.tipo : "outra";
    var t = TIPOS[tipo];
    var link = url(a.link);
    return '<article class="cartao atividade revelar ' + t.cls + '" data-tipo="' + tipo + '" style="--rot:' + (i % 2 ? 1 : -1) + 'deg">' +
      '<div class="atividade-topo"><span class="idx" aria-hidden="true">' + dois(i + 1) + '</span><span class="tag-preta">' + t.nome + "</span></div>" +
      "<h3>" + esc(a.titulo) + "</h3>" +
      '<p class="meta">' + esc(a.periodo) + (a.local ? '<span class="ponto" aria-hidden="true"></span>' + esc(a.local) : "") + "</p>" +
      "<p>" + esc(a.descricao) + "</p>" +
      (link ? '<a class="link-seta" href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">' + esc(a.linkTexto || "Ver mais") + SETA + "</a>" : "") +
      "</article>";
  }).join("");

  var filtros = $$(".filtro");
  filtros.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var alvo = btn.getAttribute("data-filtro");
      filtros.forEach(function (b) {
        var ativo = b === btn;
        b.classList.toggle("ativo", ativo);
        b.setAttribute("aria-pressed", ativo ? "true" : "false");
      });
      var visiveis = 0;
      $$("#lista-atividades .atividade").forEach(function (c) {
        var mostrar = alvo === "todas" || c.getAttribute("data-tipo") === alvo;
        c.hidden = !mostrar;
        if (mostrar) { visiveis++; c.classList.add("entrou"); }
      });
      $("#vazio-atividades").hidden = visiveis > 0;
    });
  });

  
  function tags(arr) {
    arr = lista(arr);
    if (!arr.length) return "";
    return '<ul class="tags" aria-label="Tecnologias">' + arr.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
  }

  function janela(img, titulo, barra, rotulo) {
    return '<button type="button" class="janela" data-ampliar="' + esc(img) + '" data-legenda="' + esc(titulo) + '" aria-label="Ampliar imagem: ' + esc(titulo) + '">' +
      '<span class="janela-barra" aria-hidden="true"><i></i><i></i><i></i><span class="url">' + esc(barra) + "</span></span>" +
      '<img src="' + esc(img) + '" alt="' + esc(rotulo) + '" loading="lazy">' +
      '<span class="lupa" aria-hidden="true">ampliar</span></button>';
  }

  $("#lista-projetos").innerHTML = lista(D.projetos).map(function (p, i) {
    var validos = lista(p.links).filter(function (l) { return url(l.url); });
    var barra = validos.length ? dominio(url(validos[0].url)) : "projeto";
    var botoes = validos.map(function (l, j) {
      return '<a class="btn ' + (j === 0 ? "btn-lima" : "btn-linha") + ' btn-pequeno" href="' + esc(url(l.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(l.texto) + SETA + "</a>";
    }).join("");
    return '<article class="projeto revelar">' +
      '<div class="projeto-midia">' + janela(p.imagem, p.titulo, barra, "Imagem do projeto " + p.titulo) +
      '<span class="selo-num" aria-hidden="true"><img src="images/stickers/selo-amarelo.svg" alt=""><b>' + dois(i + 1) + "</b></span></div>" +
      '<div class="projeto-texto">' +
      '<p class="periodo">' + esc(p.periodo) + "</p>" +
      "<h3>" + esc(p.titulo) + "</h3>" +
      '<p class="desc">' + esc(p.descricao) + "</p>" +
      (p.participacao ? '<p class="participacao"><span class="pilula-rosa">Minha participação</span>' + esc(p.participacao) + "</p>" : "") +
      tags(p.tecnologias) +
      (botoes ? '<div class="botoes">' + botoes + "</div>" : "") +
      "</div></article>";
  }).join("");

  
  if (lista(D.eventos).length === 1) $("#lista-eventos").classList.add("unico");
  $("#lista-eventos").innerHTML = lista(D.eventos).map(function (e, i) {
    return '<article class="ingresso revelar" style="--rot:' + (i % 2 ? 1 : -1) + 'deg">' +
      (e.premio ? '<span class="selo-premio" aria-hidden="true"><img src="images/stickers/selo-amarelo.svg" alt="">' + ICONES.trofeu + "</span>" : "") +
      (e.imagem ? '<button type="button" class="ingresso-foto" data-ampliar="' + esc(e.imagem) + '" data-legenda="' + esc(e.nome) + '" aria-label="Ampliar foto: ' + esc(e.nome) + '"><img src="' + esc(e.imagem) + '" alt="Foto do evento ' + esc(e.nome) + '" loading="lazy"><span class="lupa" aria-hidden="true">ampliar</span></button>' : "") +
      '<div class="perfura" aria-hidden="true"></div>' +
      '<div class="ingresso-corpo">' +
      '<p class="tag-preta">' + esc(e.tipo || "Evento") + "</p>" +
      "<h3>" + esc(e.nome) + "</h3>" +
      '<p class="meta">' + esc(e.data) + (e.local ? '<span class="ponto" aria-hidden="true"></span>' + esc(e.local) : "") + "</p>" +
      "<p>" + esc(e.descricao) + "</p>" +
      (e.premio ? '<p class="premio"><span class="premio-ico">' + ICONES.trofeu + "</span><span><b>Premiação:</b> " + esc(e.premio) + "</span></p>" : "") +
      "</div></article>";
  }).join("");

  
  var listaSites = lista(D.sites);
  var gradeSites = $("#lista-sites");
  if (listaSites.length === 1) gradeSites.classList.add("unico");
  gradeSites.innerHTML = listaSites.map(function (s, i) {
    var u = url(s.url), r = url(s.repositorio);
    var botoes = (u ? '<a class="btn btn-preto btn-pequeno" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">Visitar site' + SETA + "</a>" : "") +
      (r && r !== u ? '<a class="btn btn-linha-escura btn-pequeno" href="' + esc(r) + '" target="_blank" rel="noopener noreferrer">Repositório' + SETA + "</a>" : "");
    return '<article class="site revelar">' +
      '<div class="site-midia" style="--rot:' + (i % 2 ? 1.2 : -1.2) + 'deg">' + janela(s.imagem, s.titulo, dominio(u) || "seusite.com.br", "Print do site " + s.titulo) + "</div>" +
      '<div class="site-texto">' +
      '<p class="periodo">Site ' + dois(i + 1) + "</p>" +
      "<h3>" + esc(s.titulo) + "</h3>" +
      "<p>" + esc(s.descricao) + "</p>" +
      tags(s.tecnologias) +
      (botoes ? '<div class="botoes">' + botoes + "</div>" : "") +
      "</div></article>";
  }).join("");

  
  var CORES_CHIP = ["c-creme", "c-rosa", "c-amarelo", "c-verde", "c-branco"];
  var contaChip = 0;
  $("#lista-habilidades").innerHTML = lista(D.habilidades).map(function (g, i) {
    var itens = lista(g.itens).map(function (it) {
      var n = parseInt(it.nivel, 10);
      var nivel = "";
      if (n >= 1) {
        n = Math.min(n, 5);
        nivel = '<span class="nivel" role="img" aria-label="nível ' + n + ' de 5">';
        for (var k = 1; k <= 5; k++) nivel += '<i class="' + (k <= n ? "on" : "") + '"></i>';
        nivel += "</span>";
      }
      var cor = CORES_CHIP[contaChip++ % CORES_CHIP.length];
      var rot = ((contaChip * 37) % 5 - 2) * 0.8;
      return '<li class="chip ' + cor + '" style="--rot:' + rot.toFixed(1) + 'deg"><span>' + esc(it.nome) + "</span>" + nivel + "</li>";
    }).join("");
    return '<section class="cartao grupo revelar" style="--rot:' + (i % 2 ? 1 : -1) + 'deg">' +
      '<h3><span class="grupo-num" aria-hidden="true">' + dois(i + 1) + "</span>" + esc(g.grupo) + '</h3><ul class="chips">' + itens + "</ul></section>";
  }).join("");

  
  var C = D.contato || {};
  $("#contato-msg").textContent = C.mensagem || "";

  function linkContato(href, icone, nome, detalhe, extra, externo) {
    return '<li><a class="contato-link" href="' + esc(href) + '"' + (externo ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" +
      '<span class="cl-ico">' + icone + '</span><span class="cl-txt"><b>' + nome + "</b><small>" + esc(detalhe) + "</small></span>" +
      '<span class="cl-seta">' + SETA + "</span></a>" + (extra || "") + "</li>";
  }
  var links = [];
  if (C.email) links.push(linkContato("mailto:" + C.email, ICONES.email, "E-mail", C.email,
    '<button class="copiar" type="button" id="copiar-email" data-email="' + esc(C.email) + '">copiar</button>', false));
  if (url(C.github)) links.push(linkContato(url(C.github), ICONES.github, "GitHub", url(C.github).replace(/^https?:\/\/(www\.)?/, ""), "", true));
  if (url(C.linkedin)) links.push(linkContato(url(C.linkedin), ICONES.linkedin, "LinkedIn", url(C.linkedin).replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), "", true));
  if (C.whatsapp) links.push(linkContato("https://wa.me/" + String(C.whatsapp).replace(/\D/g, ""), ICONES.whatsapp, "WhatsApp", "Chamar no WhatsApp", "", true));
  if (url(C.instagram)) links.push(linkContato(url(C.instagram), ICONES.instagram, "Instagram", url(C.instagram).replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), "", true));
  $("#contato-links").innerHTML = links.join("");

  var botaoCopiar = $("#copiar-email");
  if (botaoCopiar) {
    botaoCopiar.addEventListener("click", function () {
      var email = botaoCopiar.getAttribute("data-email");
      var aviso = $("#aviso-copia");
      function ok() { aviso.textContent = "E-mail copiado!"; setTimeout(function () { aviso.textContent = ""; }, 2500); }
      function plano() {
        var t = document.createElement("textarea");
        t.value = email; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
        document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); ok(); } catch (e) { aviso.textContent = "Não deu para copiar. Selecione e copie manualmente."; }
        document.body.removeChild(t);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(ok, plano);
      else plano();
    });
  }

  var form = $("#form-contato");
  if (!C.email) {
    form.hidden = true;
  } else {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var nome = $("#f-nome").value.trim();
      var msg = $("#f-mensagem").value.trim();
      var assunto = "Contato pelo portfólio - " + nome;
      var corpo = msg + "\n\n— " + nome;
      window.location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent(assunto) + "&body=" + encodeURIComponent(corpo);
    });
  }

  
  [["atividades", D.atividades], ["projetos", D.projetos], ["eventos", D.eventos], ["sites", D.sites], ["habilidades", D.habilidades]].forEach(function (par) {
    if (lista(par[1]).length) return;
    var sec = document.getElementById(par[0]);
    if (sec) sec.hidden = true;
    $$('.menu a[href="#' + par[0] + '"]').forEach(function (a) { a.parentNode.remove(); });
  });

  
  (function () {
    var n = 0;
    var numerosMenu = {};
    $$("section[data-num]").forEach(function (sec) {
      if (sec.hidden) return;
      n++;
      var el = $("[data-numero]", sec);
      if (el) el.textContent = dois(n);
      numerosMenu["#" + sec.id] = dois(n);
    });
    $$(".menu a").forEach(function (a) {
      var num = $(".m-num", a);
      if (num && numerosMenu[a.getAttribute("href")]) num.textContent = numerosMenu[a.getAttribute("href")];
    });
    
  })();

  
  var botaoMenu = $(".menu-btn");
  var menu = $("#menu");
  var txtMenu = $(".menu-btn-txt");

  function definirMenu(abrir) {
    menu.classList.toggle("aberto", abrir);
    document.body.classList.toggle("menu-aberto", abrir);
    botaoMenu.setAttribute("aria-expanded", abrir ? "true" : "false");
    txtMenu.textContent = abrir ? "fechar" : "menu";
  }
  botaoMenu.addEventListener("click", function () { definirMenu(!menu.classList.contains("aberto")); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { definirMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") definirMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 900) definirMenu(false); });

  var linksMenu = $$(".menu a");
  if ("IntersectionObserver" in window) {
    var obsMenu = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        linksMenu.forEach(function (a) {
          if (a.getAttribute("href") === "#" + en.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { if (!s.hidden) obsMenu.observe(s); });
  }

  
  var revelar = $$(".revelar");
  if ("IntersectionObserver" in window && !REDUZIR) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("entrou"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    revelar.forEach(function (el) { obs.observe(el); });
  } else {
    revelar.forEach(function (el) { el.classList.add("entrou"); });
  }

  
  if ("IntersectionObserver" in window && !REDUZIR) {
    var obsTit = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("pulou"); obsTit.unobserve(en.target); }
      });
    }, { threshold: 0.3 });
    $$(".sec [data-wonky]").forEach(function (t) { obsTit.observe(t); });
  } else {
    $$("[data-wonky]").forEach(function (t) { t.classList.add("pulou"); });
  }

  
  var nums = $$(".stat-num");
  function contar(el) {
    var alvo = parseInt(el.getAttribute("data-alvo"), 10) || 0;
    if (REDUZIR || alvo < 2) { el.textContent = alvo; return; }
    var ini = null, dur = 900;
    function passo(t) {
      if (ini === null) ini = t;
      var k = Math.min((t - ini) / dur, 1);
      el.textContent = Math.round(alvo * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(passo);
    }
    el.textContent = 0;
    requestAnimationFrame(passo);
  }
  if ("IntersectionObserver" in window) {
    var obsNum = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { if (en.isIntersecting) { contar(en.target); obsNum.unobserve(en.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { obsNum.observe(n); });
  }

  
  var barra = $("#progresso");
  var topoBtn = $("#topo-btn");
  var agendado = false;
  function aoRolar() {
    agendado = false;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.transform = "scaleX(" + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ")";
    topoBtn.hidden = window.scrollY < 800;
  }
  window.addEventListener("scroll", function () {
    if (!agendado) { agendado = true; requestAnimationFrame(aoRolar); }
  }, { passive: true });
  aoRolar();
  topoBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: REDUZIR ? "auto" : "smooth" }); });

  
  if (!REDUZIR && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var adesivos = $$("[data-depth]");
    var alvoX = 0, alvoY = 0, atualX = 0, atualY = 0, rodando = false;
    function anima() {
      atualX += (alvoX - atualX) * 0.08;
      atualY += (alvoY - atualY) * 0.08;
      adesivos.forEach(function (el) {
        var d = parseFloat(el.getAttribute("data-depth")) || 10;
        el.style.translate = (atualX * d).toFixed(1) + "px " + (atualY * d).toFixed(1) + "px";
      });
      if (Math.abs(alvoX - atualX) > 0.001 || Math.abs(alvoY - atualY) > 0.001) requestAnimationFrame(anima);
      else rodando = false;
    }
    window.addEventListener("pointermove", function (e) {
      alvoX = (e.clientX / window.innerWidth - 0.5) * 2;
      alvoY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!rodando) { rodando = true; requestAnimationFrame(anima); }
    }, { passive: true });
  }

  
  var box = $("#lightbox");
  var boxImg = $("#lightbox-img");
  var boxLeg = $("#lightbox-legenda");

  document.addEventListener("click", function (e) {
    var gatilho = e.target.closest("[data-ampliar]");
    if (gatilho) {
      boxImg.src = gatilho.getAttribute("data-ampliar");
      boxImg.alt = "Imagem ampliada: " + gatilho.getAttribute("data-legenda");
      boxLeg.textContent = gatilho.getAttribute("data-legenda");
      if (typeof box.showModal === "function") box.showModal(); else box.setAttribute("open", "");
      return;
    }
    if (e.target === box || e.target.closest(".lightbox-fechar")) {
      if (typeof box.close === "function") box.close(); else box.removeAttribute("open");
    }
  });
})();
