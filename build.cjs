// Genera site/index.html (pàgina del prompt) i caducada/index.html a partir del prompt i l'estil de la presentació.
// Ús: node build.cjs "<carpeta d'icones Tabler outline>"
const fs = require('fs');
const path = require('path');
const PRES = 'C:/Users/Fran/Documents/CLAUDE/presentacio-claustre-videos';
const ICONS = process.argv[2];
const ic = (n) => fs.readFileSync(path.join(ICONS, n + '.svg'), 'utf8')
  .replace(/<path stroke="none" d="M0 0h24v24H0z" fill="none"\/>/, '')
  .replace(/\s*width="24"\s*height="24"/, '')
  .replace(/class="[^"]*"/, 'aria-hidden="true"')
  .replace(/\n\s*/g, ' ').replace(/\s+>/g, '>').trim();
const fonts = fs.readFileSync(path.join(PRES, 'fonts.css'), 'utf8');
const prompt = fs.readFileSync(path.join(PRES, 'prompt-cervell.txt'), 'utf8').split('------------------------------------------------------------')[1].trim();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const END = '2026-11-17T23:59:00+01:00';

fs.mkdirSync('site', { recursive: true });
fs.mkdirSync('caducada', { recursive: true });
fs.copyFileSync(path.join(PRES, 'media/obsidian-graf.png'), 'site/graf.png');
fs.copyFileSync(path.join(PRES, 'idees-per-materia.pdf'), 'site/idees.pdf');
fs.copyFileSync(path.join(PRES, 'encarrecs.pdf'), 'site/encarrecs.pdf');
const size = (f) => { const b = fs.statSync(path.join('site', f)).size; return b > 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.round(b / 1024) + ' KB'; };

const css = `
:root{--navy:#0b2176;--navy2:#1d3db0;--green:#10892c;--mint:#8fe3a4;--ink:#0f1222;--paper:#f6f6f2;--muted:#5b6072;--line:#e6e6df}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{font-family:'PJS',system-ui,-apple-system,sans-serif;color:var(--ink);background:var(--paper);line-height:1.5;-webkit-font-smoothing:antialiased;padding-bottom:92px}
.wrap{max-width:680px;margin:0 auto;padding:0 20px}
svg{width:1.3em;height:1.3em;flex:0 0 auto}

.hero{position:relative;overflow:hidden;color:#fff;padding:24px 0 100px;background:radial-gradient(120% 90% at 88% -12%,#2c52dc 0%,rgba(44,82,220,0) 56%),linear-gradient(165deg,#0b2176 0%,#0a1b63 58%,#071550 100%)}
.glow{position:absolute;border-radius:50%;filter:blur(64px);pointer-events:none}
.g1{width:260px;height:260px;left:-110px;bottom:-130px;background:rgba(143,227,164,.3)}
.g2{width:200px;height:200px;right:-70px;top:120px;background:rgba(104,140,255,.3)}
.graf{position:absolute;right:-180px;top:-120px;width:470px;height:470px;opacity:.6;mix-blend-mode:lighten;-webkit-mask-image:radial-gradient(circle,#000 46%,transparent 69%);mask-image:radial-gradient(circle,#000 46%,transparent 69%);pointer-events:none;animation:gira 260s linear infinite}
@keyframes gira{to{transform:rotate(360deg)}}
.time{position:relative;display:inline-flex;align-items:center;gap:10px;font-size:14px;font-weight:700;color:#ffe9b8;background:rgba(255,205,96,.14);box-shadow:inset 0 0 0 1px rgba(255,205,96,.5);padding:8px 15px 8px 12px;border-radius:999px;line-height:1.25}
.time b{color:#fff;font-weight:800}
.dot{flex:0 0 9px;width:9px;height:9px;border-radius:50%;background:#ffcd60;animation:pols 1.8s ease-out infinite}
@keyframes pols{0%{box-shadow:0 0 0 0 rgba(255,205,96,.75)}100%{box-shadow:0 0 0 11px rgba(255,205,96,0)}}
.eyebrow{position:relative;font-size:12.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--mint);margin-top:28px}
h1{position:relative;font-size:48px;line-height:.98;font-weight:800;letter-spacing:-.045em;margin-top:10px}
.grad{background:linear-gradient(92deg,#8fe3a4 0%,#d3f7dc 55%,#9dbcff 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.lead{position:relative;font-size:18px;font-weight:600;color:#d5dcf7;margin-top:14px;max-width:24em}

.panel{position:relative;margin-top:-70px;background:#fff;border-radius:28px;padding:16px;box-shadow:0 1px 0 rgba(15,18,34,.04),0 26px 50px -26px rgba(11,33,118,.42)}
.btn{position:relative;overflow:hidden;display:flex;align-items:center;gap:14px;width:100%;min-height:68px;border:0;border-radius:20px;font:inherit;font-size:19.5px;font-weight:800;letter-spacing:-.01em;cursor:pointer;text-decoration:none;padding:11px 18px 11px 11px;color:#fff;transition:transform .15s cubic-bezier(.2,.8,.2,1),filter .2s;-webkit-tap-highlight-color:transparent}
.btn:active{transform:scale(.975)}
.btn:focus-visible{outline:3px solid #8fb8ff;outline-offset:3px}
.bi{flex:0 0 46px;height:46px;border-radius:14px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center}
.bi svg{width:24px;height:24px}
.bl{flex:1;text-align:left}
.go{opacity:.7;width:20px;height:20px}
.primary{background:linear-gradient(135deg,#0a5f1f 0%,#10892c 55%,#15a23b 100%);box-shadow:0 16px 28px -16px rgba(16,137,44,.8),inset 0 1px 0 rgba(255,255,255,.22)}
.primary::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 36%,rgba(255,255,255,.3) 50%,transparent 64%);transform:translateX(-120%);animation:brilla 4.2s ease-in-out 1.4s infinite;pointer-events:none}
@keyframes brilla{0%,62%{transform:translateX(-120%)}90%,100%{transform:translateX(120%)}}
.primary.ok{background:linear-gradient(135deg,#0b4f1c,#0c6f24)}
.primary.ok .bi{animation:pop .45s cubic-bezier(.3,1.6,.5,1)}
@keyframes pop{0%{transform:scale(.6)}100%{transform:scale(1)}}
.navy{background:linear-gradient(135deg,#0b2176 0%,#1d3db0 100%);box-shadow:0 16px 28px -18px rgba(11,33,118,.85),inset 0 1px 0 rgba(255,255,255,.16);margin-top:10px}
.note{display:flex;gap:9px;align-items:flex-start;font-size:14px;font-weight:700;color:#7a4b00;background:#fff5d9;border-radius:14px;padding:11px 13px;margin-top:12px;line-height:1.35}
.note svg{width:18px;height:18px;margin-top:1px;color:#b57600}
.or{display:flex;align-items:center;gap:12px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);margin:18px 2px 10px}
.or::before,.or::after{content:"";flex:1;height:1px;background:var(--line)}
.ias{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.ia{display:flex;align-items:center;justify-content:center;gap:5px;min-height:54px;border-radius:16px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);font-size:16px;font-weight:800;color:var(--ink);text-decoration:none;transition:transform .15s,background .2s,box-shadow .2s;-webkit-tap-highlight-color:transparent}
.ia svg{width:15px;height:15px;color:#8a8fa3}
.ia:active{transform:scale(.97);background:#eef1fb;box-shadow:inset 0 0 0 1px #c3ccf0}
.ia:focus-visible,.file:focus-visible,.more:focus-visible{outline:3px solid var(--navy2);outline-offset:2px}
.hint{font-size:13.5px;color:var(--muted);text-align:center;margin-top:10px}

.sec{margin-top:36px}
h2{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--green);margin-bottom:14px}
h2 small{font-size:12px;letter-spacing:.01em;text-transform:none;color:#7a4b00;background:#fff5d9;padding:3px 10px;border-radius:999px;font-weight:800}
.tl{list-style:none}
.tl li{display:grid;grid-template-columns:44px 1fr;gap:14px;padding-bottom:20px;position:relative}
.tl li:last-child{padding-bottom:0}
.tl li:not(:last-child)::before{content:"";position:absolute;left:21px;top:48px;bottom:4px;width:2px;border-radius:2px;background:linear-gradient(#c9d2f3,#e6e6df)}
.n{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;background:linear-gradient(135deg,#0b2176,#2c52dc);box-shadow:0 10px 18px -10px rgba(11,33,118,.7)}
.tl h3{font-size:19px;font-weight:800;letter-spacing:-.02em;line-height:1.25;padding-top:1px}
.tl em{font-style:normal;display:inline-block;font-size:11.5px;font-weight:800;padding:2px 9px;border-radius:999px;background:#e7ebf8;color:var(--navy);vertical-align:2px;margin-left:4px;letter-spacing:0}
.tl em.free{background:#e3f4e7;color:#0d6b24}
.tl p{font-size:15.5px;color:var(--muted);margin-top:4px}

.pcard{position:relative;background:#fff;border-radius:24px;box-shadow:inset 0 0 0 1px var(--line);overflow:hidden}
.prompt{padding:18px 18px 24px;font-size:15px;white-space:pre-wrap;word-break:break-word;max-height:236px;overflow:hidden;transition:max-height .6s cubic-bezier(.2,.8,.2,1)}
.pcard.open .prompt{max-height:4200px}
.pcard::after{content:"";position:absolute;left:1px;right:1px;bottom:54px;height:96px;background:linear-gradient(rgba(255,255,255,0),#fff);pointer-events:none;transition:opacity .3s}
.pcard.open::after{opacity:0}
.more{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:54px;border:0;border-top:1px solid var(--line);background:#fff;font:inherit;font-size:15.5px;font-weight:800;color:var(--navy);cursor:pointer;-webkit-tap-highlight-color:transparent}
.more svg{transition:transform .3s}.pcard.open .more svg{transform:rotate(180deg)}

.files{display:grid;gap:8px}
.file{display:flex;align-items:center;gap:14px;background:#fff;border-radius:18px;padding:12px 16px 12px 12px;text-decoration:none;color:var(--ink);box-shadow:inset 0 0 0 1px var(--line);transition:transform .15s,box-shadow .2s;-webkit-tap-highlight-color:transparent}
.file:active{transform:scale(.985);box-shadow:inset 0 0 0 1px #c3ccf0}
.fi{flex:0 0 46px;height:46px;border-radius:14px;background:#fdecea;color:#b42318;display:flex;align-items:center;justify-content:center}
.fi svg{width:24px;height:24px}
.ft{flex:1;min-width:0}
.ft b{display:block;font-size:16.5px;font-weight:800;letter-spacing:-.01em;line-height:1.2}
.ft i{font-style:normal;font-size:13px;color:var(--muted)}
.file > svg{color:var(--navy);width:22px;height:22px}

footer{padding:40px 0 4px;font-size:13.5px;color:var(--muted);text-align:center;line-height:1.6}
footer b{color:var(--ink)}
.fab{position:fixed;left:0;right:0;bottom:0;z-index:5;padding:14px 16px calc(14px + env(safe-area-inset-bottom));background:linear-gradient(rgba(246,246,242,0),rgba(246,246,242,.94) 38%);transform:translateY(110%);transition:transform .4s cubic-bezier(.2,.8,.2,1);pointer-events:none}
.fab.on{transform:none;pointer-events:auto}
.fab .btn{max-width:640px;margin:0 auto;min-height:60px}
.fab .bi{flex-basis:40px;height:40px;border-radius:12px}
#toast{position:fixed;left:50%;bottom:100px;z-index:6;transform:translate(-50%,16px);background:var(--ink);color:#fff;font-weight:700;font-size:15.5px;padding:11px 20px;border-radius:999px;opacity:0;transition:opacity .2s,transform .25s cubic-bezier(.2,.8,.2,1);pointer-events:none;white-space:nowrap;box-shadow:0 14px 30px -14px rgba(15,18,34,.6)}
#toast.on{opacity:1;transform:translate(-50%,0)}

.rise{animation:puja .8s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:calc(var(--d,0) * 95ms)}
@keyframes puja{from{opacity:0;transform:translateY(20px)}}
.js .reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1)}
.js .reveal.in{opacity:1;transform:none}

.gone{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:30px;color:#fff;background:radial-gradient(120% 90% at 88% -12%,#2c52dc 0%,rgba(44,82,220,0) 56%),linear-gradient(165deg,#0b2176 0%,#0a1b63 58%,#071550 100%)}
.gone h1{font-size:38px}.gone p{font-size:18px;color:#d5dcf7;margin-top:14px;font-weight:600}
.gone p.eyebrow{font-size:12.5px;color:var(--mint);font-weight:800;margin-top:0}

@media (min-width:640px){h1{font-size:66px}.hero{padding:44px 0 116px}.graf{width:600px;height:600px;right:-140px;top:-150px;opacity:.75}.lead{font-size:20px}.panel{padding:22px}.btn{min-height:72px;font-size:21px}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.js .reveal{opacity:1;transform:none}}
`;
const gone = '<div class="gone"><div><p class="eyebrow">La IA, la teva aliada</p><h1>Aquesta pàgina ja no està disponible.</h1><p>Es va esborrar el 17/11/2026 a les 23:59.<br>Si necessites el prompt, demana-l\u2019hi a Fran Martín.</p></div></div>';

const script = `
(() => {
  document.documentElement.classList.add('js');
  const END = Date.parse(${JSON.stringify(END)});
  const gone = ${JSON.stringify(gone)};
  const tick = () => {
    const ms = END - Date.now();
    if (ms <= 0) { document.getElementById('app').innerHTML = gone; const f = document.getElementById('fab'); if (f) f.remove(); return false; }
    const h = Math.floor(ms / 3600000), m = Math.floor(ms % 3600000 / 60000);
    document.getElementById('left').textContent = ' · queden ' + (h ? h + ' h ' : '') + m + ' min';
    return true;
  };
  if (!tick()) return;
  setInterval(tick, 30000);
  const P = document.getElementById('prompt').textContent.trim();
  const toast = (t) => { const e = document.getElementById('toast'); e.textContent = t; e.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('on'), 2200); };
  const copy = () => {
    const done = () => toast('Copiat! Ja el pots enganxar.');
    const legacy = () => { const t = document.createElement('textarea'); t.value = P; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0'; document.body.appendChild(t); t.focus({ preventScroll: true }); t.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Obre el prompt i copia-te\u2019l a mà.'); } t.remove(); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(P).then(done, legacy); else legacy();
  };
  const ICON_COPY = ${JSON.stringify(ic('copy'))}, ICON_OK = ${JSON.stringify(ic('check'))};
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', () => {
    copy();
    b.classList.add('ok'); b.querySelector('.bl').textContent = 'Copiat'; b.querySelector('.bi').innerHTML = ICON_OK;
    clearTimeout(b.t); b.t = setTimeout(() => { b.classList.remove('ok'); b.querySelector('.bl').textContent = 'Copia el prompt'; b.querySelector('.bi').innerHTML = ICON_COPY; }, 2500);
  }));
  document.getElementById('share').addEventListener('click', () => {
    if (navigator.share) navigator.share({ title: 'Prompt guia · cervell virtual', text: P }).catch(() => {});
    else location.href = 'mailto:?subject=' + encodeURIComponent('Prompt guia · cervell virtual') + '&body=' + encodeURIComponent(P);
  });
  const q = encodeURIComponent(P);
  document.querySelectorAll('.ia').forEach((a) => {
    if (a.dataset.ia === 'chatgpt') a.href = 'https://chatgpt.com/?q=' + q;
    if (a.dataset.ia === 'claude') a.href = 'https://claude.ai/new?q=' + q;
    a.addEventListener('click', copy);
  });
  const pc = document.getElementById('pcard'), more = document.getElementById('more');
  more.addEventListener('click', () => { const o = pc.classList.toggle('open'); more.firstChild.textContent = o ? 'Amaga\u2019l ' : 'Mostra\u2019l sencer '; more.setAttribute('aria-expanded', o); });
  const fab = document.getElementById('fab');
  if ('IntersectionObserver' in window) {
    const rv = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach((e) => rv.observe(e));
    new IntersectionObserver((es) => fab.classList.toggle('on', !es[0].isIntersecting)).observe(document.getElementById('copy'));
  } else document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in'));
})();
`;

const file = (href, name, title, f) => `<a class="file" href="${href}" download="${name}"><span class="fi">${ic('file-type-pdf')}</span><span class="ft"><b>${title}</b><i>PDF · ${size(f)}</i></span>${ic('download')}</a>`;
const step = (n, t, tagCls, tag, p) => `<li><span class="n">${n}</span><div><h3>${t} <em class="${tagCls}">${tag}</em></h3><p>${p}</p></div></li>`;

const page = `<!doctype html>
<html lang="ca">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#0b2176">
<link rel="icon" href="data:,">
<title>El prompt per començar · La IA, la teva aliada</title>
<meta name="description" content="El prompt guia per muntar el teu cervell virtual amb Obsidian i començar a treballar amb IA. Pàgina temporal: s'esborra el 17/11/2026 a les 23:59.">
<style>${fonts}${css}</style>
</head>
<body>
<div id="app">
<header class="hero">
  <div class="glow g1"></div><div class="glow g2"></div>
  <img class="graf" src="graf.png" alt="" width="470" height="470">
  <div class="wrap">
    <p class="time rise" role="status"><span class="dot"></span><span>S'esborra <b>avui a les 23:59</b><span id="left"></span></span></p>
    <p class="eyebrow rise" style="--d:1">La IA, la teva aliada · Claustre 17/11/2026</p>
    <h1 class="rise" style="--d:2">El prompt<br><span class="grad">per començar.</span></h1>
    <p class="lead rise" style="--d:3">Enganxa'l a la teva IA i et guiarà pas a pas per muntar el teu cervell virtual.</p>
  </div>
</header>
<main class="wrap">
  <section class="panel rise" style="--d:4" aria-label="Emporta't el prompt">
    <button class="btn primary" id="copy" data-copy type="button"><span class="bi">${ic('copy')}</span><span class="bl">Copia el prompt</span></button>
    <button class="btn navy" id="share" type="button"><span class="bi">${ic('share-2')}</span><span class="bl">Desa-te'l al mòbil</span></button>
    <p class="note">${ic('hourglass-high')}<span>Copia'l o desa-te'l ara: a partir de les 23:59 d'avui aquesta pàgina deixarà d'existir.</span></p>
    <div class="or"><span>o obre'l a la teva IA</span></div>
    <div class="ias">
      <a class="ia" data-ia="chatgpt" href="https://chatgpt.com/" target="_blank" rel="noopener">ChatGPT${ic('arrow-up-right')}</a>
      <a class="ia" data-ia="claude" href="https://claude.ai/new" target="_blank" rel="noopener">Claude${ic('arrow-up-right')}</a>
      <a class="ia" data-ia="gemini" href="https://gemini.google.com/app" target="_blank" rel="noopener">Gemini${ic('arrow-up-right')}</a>
    </div>
    <p class="hint">Es copia sol. Si no surt escrit, enganxa'l i envia'l.</p>
  </section>

  <section class="sec reveal">
    <h2>Per on començar</h2>
    <ol class="tl">
      ${step(1, 'Un cervell a Obsidian', 'free', 'Gratuït', 'Uneix el que saps i les teves eines en notes teves. La IA només en llegeix el que necessita.')}
      ${step(2, 'Claude Code o Codex', '', 'Subscripció', 'No és un xat: treballa dins les teves carpetes. Llegeix el cervell, crea fitxers i apps, i automatitza. (Codex és el de ChatGPT.)')}
      ${step(3, 'Higgsfield o Magnific', '', 'Subscripció', 'Per generar imatges, vídeo i àudio amb acabat professional.')}
    </ol>
  </section>

  <section class="sec reveal">
    <h2>El prompt</h2>
    <div class="pcard" id="pcard">
      <div class="prompt" id="prompt">${esc(prompt)}</div>
      <button class="more" id="more" type="button" aria-expanded="false">Mostra'l sencer ${ic('chevron-down')}</button>
    </div>
  </section>

  <section class="sec reveal">
    <h2>Per baixar <small>només avui</small></h2>
    <div class="files">
      ${file('presentacio.pdf', 'La IA, la teva aliada (Fran Martín).pdf', 'La presentació', 'presentacio.pdf')}
      ${file('idees.pdf', 'Idees per a cada matèria.pdf', 'Idees per a cada matèria', 'idees.pdf')}
      ${file('encarrecs.pdf', '4 encàrrecs per començar.pdf', '4 encàrrecs per començar', 'encarrecs.pdf')}
    </div>
  </section>
</main>
<footer class="wrap"><b>Fran Martín</b> · CFGM Tècniques de Dansa Urbana<br>Pàgina temporal: s'esborra el 17/11/2026 a les 23:59.</footer>
</div>
<div class="fab" id="fab"><button class="btn primary" data-copy type="button"><span class="bi">${ic('copy')}</span><span class="bl">Copia el prompt</span></button></div>
<div id="toast" role="status" aria-live="polite"></div>
<script>${script}</script>
</body>
</html>
`;
fs.writeFileSync('site/index.html', page);
const goneDoc = `<!doctype html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><link rel="icon" href="data:,"><title>Pàgina no disponible</title><style>${fonts}${css}</style></head><body style="padding:0">${gone}</body></html>\n`;
fs.writeFileSync('caducada/index.html', goneDoc);
fs.writeFileSync('caducada/404.html', goneDoc);
console.log('site/index.html', (fs.statSync('site/index.html').size / 1024).toFixed(0), 'KB · prompt', prompt.length, 'caràcters');
