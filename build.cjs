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

const css = `
:root{--navy:#0b2176;--navy2:#1d3db0;--green:#10892c;--mint:#8fe3a4;--ink:#0f1222;--paper:#f6f6f2;--muted:#5b6072;--line:#e2e2da}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{font-family:'PJS',system-ui,-apple-system,sans-serif;color:var(--ink);background:var(--paper);line-height:1.45;-webkit-font-smoothing:antialiased}
.wrap{max-width:720px;margin:0 auto;padding:0 20px}
svg{width:1.35em;height:1.35em;flex:0 0 auto}
.warn{background:#fff3d6;color:#6b4200;font-weight:700;font-size:15px;text-align:center;padding:10px 16px;line-height:1.3}
.warn b{font-weight:800}
.hero{background:var(--navy);color:#fff;position:relative;overflow:hidden;padding:34px 0 30px}
.hero .graf{position:absolute;right:-150px;top:-90px;width:440px;height:440px;opacity:.5;mix-blend-mode:lighten;-webkit-mask-image:radial-gradient(circle,#000 48%,transparent 70%);mask-image:radial-gradient(circle,#000 48%,transparent 70%);pointer-events:none}
.eyebrow{font-size:13px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--mint);position:relative}
h1{font-size:44px;line-height:.98;font-weight:800;letter-spacing:-.04em;margin-top:10px;position:relative}
.lead{font-size:19px;font-weight:600;color:#dfe5fb;margin-top:14px;max-width:30em;position:relative}
.lead b{color:var(--mint);font-weight:800}
main{padding:22px 0 10px}
.btn{display:flex;align-items:center;justify-content:center;gap:12px;width:100%;min-height:64px;border:0;border-radius:18px;font:inherit;font-size:20px;font-weight:800;letter-spacing:-.01em;cursor:pointer;text-decoration:none;padding:14px 20px;transition:transform .12s ease,background .2s ease}
.btn:active{transform:scale(.98)}
.btn:focus-visible{outline:3px solid var(--navy2);outline-offset:3px}
.b1{background:var(--green);color:#fff;font-size:22px;min-height:72px}
.b1.ok{background:#0b6a22}
.b2{background:var(--navy);color:#fff;margin-top:12px}
.b3{background:#fff;color:var(--navy);box-shadow:inset 0 0 0 2px var(--navy);margin-top:26px}
.hint{font-size:14px;color:var(--muted);text-align:center;margin-top:8px}
h2{font-size:14px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--green);margin:30px 0 10px}
.ias{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.ia{display:flex;align-items:center;justify-content:center;min-height:60px;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);font-size:18px;font-weight:800;color:var(--ink);text-decoration:none}
.ia:active{background:#eef1fb}.ia:focus-visible{outline:3px solid var(--navy2);outline-offset:2px}
.steps{display:grid;gap:10px}
.step{display:flex;gap:14px;align-items:flex-start;background:#fff;border-radius:18px;padding:16px 18px;box-shadow:inset 0 0 0 1px var(--line)}
.sic{flex:0 0 46px;height:46px;border-radius:14px;background:#e7ebf8;color:var(--navy);display:flex;align-items:center;justify-content:center}
.sic svg{width:26px;height:26px}
.step h3{font-size:19px;font-weight:800;letter-spacing:-.02em;line-height:1.2}
.step h3 span{display:inline-block;font-size:12px;font-weight:800;letter-spacing:0;padding:2px 9px;border-radius:999px;background:#e7ebf8;color:var(--navy);vertical-align:2px;margin-left:4px}
.step h3 span.free{background:#e3f4e7;color:#0d6b24}
.step p{font-size:15.5px;color:var(--muted);margin-top:4px}
.prompt{background:#fff;border-radius:18px;box-shadow:inset 0 0 0 1px var(--line);padding:18px 18px 20px;font-size:15.5px;white-space:pre-wrap;word-break:break-word}
footer{padding:26px 0 40px;font-size:14px;color:var(--muted);text-align:center}
footer b{color:var(--ink)}
#toast{position:fixed;left:50%;bottom:22px;transform:translate(-50%,20px);background:var(--ink);color:#fff;font-weight:700;font-size:16px;padding:12px 20px;border-radius:999px;opacity:0;transition:opacity .2s,transform .2s;pointer-events:none;white-space:nowrap}
#toast.on{opacity:1;transform:translate(-50%,0)}
.gone{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--navy);color:#fff;text-align:center;padding:30px}
.gone h1{font-size:38px}.gone p{font-size:18px;color:#dfe5fb;margin-top:14px;font-weight:600}
.gone p.eyebrow{font-size:13px;color:var(--mint);font-weight:800;margin-top:0}
@media (min-width:640px){h1{font-size:60px}.hero{padding:54px 0 46px}.hero .graf{width:560px;height:560px;right:-120px;top:-120px;opacity:.7}.lead{font-size:21px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;
const gone = '<div class="gone"><div><p class="eyebrow">La IA, la teva aliada</p><h1>Aquesta pàgina ja no està disponible.</h1><p>Es va esborrar el 17/11/2026 a les 23:59.<br>Si necessites el prompt, demana-l\u2019hi a Fran Martín.</p></div></div>';

const script = `
(() => {
  const END = Date.parse(${JSON.stringify(END)});
  const gone = ${JSON.stringify(gone)};
  const tick = () => {
    const ms = END - Date.now();
    if (ms <= 0) { document.getElementById('app').innerHTML = gone; return false; }
    const h = Math.floor(ms / 3600000), m = Math.floor(ms % 3600000 / 60000);
    document.getElementById('left').textContent = ' (queden ' + (h ? h + ' h ' : '') + m + ' min)';
    return true;
  };
  if (!tick()) return;
  setInterval(tick, 30000);
  const P = document.getElementById('prompt').textContent.trim();
  const toast = (t) => { const e = document.getElementById('toast'); e.textContent = t; e.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('on'), 2200); };
  const copy = () => {
    const done = () => toast('Copiat! Ja el pots enganxar.');
    const legacy = () => { const t = document.createElement('textarea'); t.value = P; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Selecciona el text de sota i copia-te\u2019l.'); } t.remove(); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(P).then(done, legacy); else legacy();
  };
  for (const id of ['copy', 'copy2']) document.getElementById(id).addEventListener('click', (e) => { const b = e.currentTarget, s = b.querySelector('span'); copy(); s.textContent = 'Copiat \u2713'; b.classList.add('ok'); setTimeout(() => { s.textContent = 'Copia el prompt'; b.classList.remove('ok'); }, 2500); });
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
})();
`;

const page = `<!doctype html>
<html lang="ca">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#0b2176">
<link rel="icon" href="data:,">
<title>El prompt per començar · La IA, la teva aliada</title>
<meta name="description" content="El prompt guia per muntar el teu cervell virtual amb Obsidian i començar a treballar amb IA. Pàgina temporal: s'esborra el 17/11/2026 a les 23:59.">
<style>${fonts}${css}</style>
</head>
<body>
<div id="app">
<p class="warn" role="status">Aquesta pàgina <b>s'esborra avui, 17/11, a les 23:59</b><span id="left"></span>. Copia't el prompt o desa-te'l ara.</p>
<header class="hero">
  <img class="graf" src="graf.png" alt="" width="440" height="440">
  <div class="wrap">
    <p class="eyebrow">La IA, la teva aliada · Claustre 17/11/2026</p>
    <h1>El prompt<br>per començar.</h1>
    <p class="lead">Enganxa'l a la teva IA i et guiarà <b>pas a pas</b> per muntar el teu cervell virtual.</p>
  </div>
</header>
<main class="wrap">
  <button class="btn b1" id="copy" type="button">${ic('copy')}<span>Copia el prompt</span></button>
  <button class="btn b2" id="share" type="button">${ic('device-floppy')}<span>Desa-te'l al mòbil</span></button>
  <p class="hint">Envia-te'l per WhatsApp o correu, o desa'l a les notes.</p>

  <h2>Obre'l a la teva IA</h2>
  <div class="ias">
    <a class="ia" data-ia="chatgpt" href="https://chatgpt.com/" target="_blank" rel="noopener">ChatGPT</a>
    <a class="ia" data-ia="claude" href="https://claude.ai/new" target="_blank" rel="noopener">Claude</a>
    <a class="ia" data-ia="gemini" href="https://gemini.google.com/app" target="_blank" rel="noopener">Gemini</a>
  </div>
  <p class="hint">Es copia sol. Si no surt escrit, enganxa'l i envia'l.</p>

  <h2>Per on començar</h2>
  <div class="steps">
    <div class="step"><div class="sic">${ic('brain')}</div><div><h3>1 · Un cervell a Obsidian <span class="free">Gratuït</span></h3><p>Uneix el que saps i les teves eines en notes teves. La IA només en llegeix el que necessita.</p></div></div>
    <div class="step"><div class="sic">${ic('terminal-2')}</div><div><h3>2 · Claude Code o Codex <span>Subscripció</span></h3><p>No és un xat: treballa dins les teves carpetes. Llegeix el cervell, crea fitxers i apps, i automatitza. (Codex és el de ChatGPT.)</p></div></div>
    <div class="step"><div class="sic">${ic('photo-ai')}</div><div><h3>3 · Higgsfield o Magnific <span>Subscripció</span></h3><p>Per generar imatges, vídeo i àudio amb acabat professional.</p></div></div>
  </div>

  <h2>El prompt</h2>
  <div class="prompt" id="prompt">${esc(prompt)}</div>
  <button class="btn b1" id="copy2" type="button" style="margin-top:12px">${ic('copy')}<span>Copia el prompt</span></button>

  <h2>Per baixar</h2>
  <a class="btn b3" style="margin-top:0" href="presentacio.pdf" download="La IA, la teva aliada (Fran Martín).pdf">${ic('download')}<span>La presentació (PDF)</span></a>
  <a class="btn b3" style="margin-top:10px" href="idees.pdf" download="Idees per a cada matèria.pdf">${ic('download')}<span>Idees per a cada matèria (PDF)</span></a>
  <a class="btn b3" style="margin-top:10px" href="encarrecs.pdf" download="4 encàrrecs per començar.pdf">${ic('download')}<span>4 encàrrecs per començar (PDF)</span></a>
  <p class="hint">Baixa-te'ls avui: demà ja no hi seran.</p>
</main>
<footer class="wrap"><b>Fran Martín</b> · CFGM Tècniques de Dansa Urbana<br>Pàgina temporal: s'esborra el 17/11/2026 a les 23:59.</footer>
</div>
<div id="toast" role="status" aria-live="polite"></div>
<script>${script}</script>
</body>
</html>
`;
fs.mkdirSync('site', { recursive: true });
fs.mkdirSync('caducada', { recursive: true });
fs.writeFileSync('site/index.html', page);
const goneDoc = `<!doctype html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Pàgina no disponible</title><style>${fonts}${css}</style></head><body>${gone}</body></html>\n`;
fs.writeFileSync('caducada/index.html', goneDoc);
fs.writeFileSync('caducada/404.html', goneDoc);
fs.copyFileSync(path.join(PRES, 'media/obsidian-graf.png'), 'site/graf.png');
fs.copyFileSync(path.join(PRES, 'idees-per-materia.pdf'), 'site/idees.pdf');
fs.copyFileSync(path.join(PRES, 'encarrecs.pdf'), 'site/encarrecs.pdf');
console.log('site/index.html', (fs.statSync('site/index.html').size / 1024).toFixed(0), 'KB · prompt', prompt.length, 'caràcters · URL q', encodeURIComponent(prompt).length);
