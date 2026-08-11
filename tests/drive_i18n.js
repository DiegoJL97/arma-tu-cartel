const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..', 'public');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');
const css = fs.readFileSync(path.join(root, 'css', 'styles.css'), 'utf-8');
const js = fs.readFileSync(path.join(root, 'js', 'app.js'), 'utf-8');
html = html
  .replace('<link rel="stylesheet" href="css/styles.css">', () => `<style>${css}</style>`)
  .replace('<script src="js/app.js"></script>', () => `<script>${js}</script>`);
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/' });
const { window } = dom;

const realSetTimeout = window.setTimeout.bind(window);
window.setTimeout = function(fn, delay, ...args){
  return realSetTimeout(fn, Math.min(delay, 15), ...args);
};

function makeFakeCtx(){
  return {
    fillRect(){}, beginPath(){}, moveTo(){}, lineTo(){}, stroke(){}, fill(){},
    arcTo(){}, closePath(){}, fillText(){}, measureText(){ return { width: 200 }; },
    createRadialGradient(){ return { addColorStop(){} }; },
    drawImage(){},
    set fillStyle(v){}, get fillStyle(){ return '#000'; },
    set strokeStyle(v){}, get strokeStyle(){ return '#000'; },
    set lineWidth(v){}, get lineWidth(){ return 1; },
    set font(v){}, get font(){ return ''; },
    set textAlign(v){}, get textAlign(){ return 'center'; },
    set globalCompositeOperation(v){}, get globalCompositeOperation(){ return 'source-over'; }
  };
}
window.HTMLCanvasElement.prototype.getContext = function(){ return makeFakeCtx(); };
window.HTMLCanvasElement.prototype.toDataURL = function(){ return 'data:image/png;base64,FAKE'; };
window.HTMLCanvasElement.prototype.toBlob = function(cb){ realSetTimeout(function(){ cb({ size: 123, type: 'image/png' }); }, 5); };

function FakeImage(){ this._src=''; this.onload=null; this.onerror=null; }
Object.defineProperty(FakeImage.prototype, 'src', {
  get(){ return this._src; },
  set(v){ this._src = v; var self=this; realSetTimeout(function(){ if(self.onload) self.onload(); }, 5); }
});
window.Image = FakeImage;

function wait(ms){ return new Promise(r => setTimeout(r, ms)); }
async function waitUntil(fn, timeoutMs){
  const start = Date.now();
  while(!fn()){
    if(Date.now() - start > timeoutMs) throw new Error('waitUntil timed out');
    await wait(10);
  }
}

let failures = 0;
function check(label, cond){
  if(cond){ console.log('PASS', label); }
  else { console.log('FAIL', label); failures++; }
}

(async () => {
  const doc = window.document;

  // 1. Default language is Spanish
  check('default lang attr = es', doc.documentElement.getAttribute('lang') === 'es');
  check('landing title default ES', doc.querySelector('#screen-landing h1.title').textContent === 'Arma tu Cartel');
  check('start btn default ES', doc.getElementById('startBtn').textContent.indexOf('Empezar a jugar') !== -1);
  check('disclaimer default ES', doc.querySelector('.hero-disclaimer').textContent.indexOf('Juego de fans con fines de entretenimiento') === 0);

  // 2. Toggle to English via the floating landing button
  const landingToggle = doc.querySelector('#screen-landing [data-lang-toggle]');
  check('landing toggle exists', !!landingToggle);
  landingToggle.click();

  check('lang attr now en', doc.documentElement.getAttribute('lang') === 'en');
  check('landing title EN', doc.querySelector('#screen-landing h1.title').textContent === 'Build Your Lineup');
  check('start btn EN', doc.getElementById('startBtn').textContent.indexOf('Start playing') !== -1);
  check('collage caption EN', doc.getElementById('heroCollageCaption').textContent.indexOf('over 100 real') !== -1);
  check('disclaimer EN', doc.querySelector('.hero-disclaimer').textContent.indexOf('Fan-made game for entertainment purposes') === 0);
  check('toggle button shows ES (next target)', landingToggle.textContent === 'ES');
  check('localStorage persisted en', window.localStorage.getItem('armaTuCartelLang') === 'en');

  // 3. Start game, verify translated in-game strings
  doc.getElementById('startBtn').click();
  await waitUntil(() => doc.querySelectorAll('.choice-card').length === 3, 8000);
  check('section title EN', doc.querySelector('.section-title').textContent === 'Pick an artist');
  check('round label EN', doc.querySelector('.topbar-round').textContent.indexOf('Round') !== -1);
  const firstCardText = doc.querySelector('.choice-card').textContent;
  check('stat label FEE present', firstCardText.indexOf('FEE') !== -1);
  check('stat label ATTENDANCE present', firstCardText.indexOf('ATTENDANCE') !== -1);
  check('stat label LIVE SHOW present', firstCardText.indexOf('LIVE SHOW') !== -1);
  check('aria-label EN', doc.querySelector('.choice-card').getAttribute('aria-label').indexOf('Choose ') === 0);

  // pick through all 10 rounds
  for (let round = 1; round <= 10; round++) {
    await waitUntil(() => doc.querySelectorAll('.choice-card').length === 3, 8000);
    const cards = doc.querySelectorAll('.choice-card');
    cards.forEach(c => { c.disabled = false; });
    cards[cards.length - 1].click();
  }
  await waitUntil(() => doc.querySelector('.screen.active').id === 'screen-simulation', 8000);
  check('sim live badge EN', doc.querySelector('.sim-live-badge').textContent.indexOf('Live simulation') !== -1);
  check('sim hype label EN', doc.querySelector('.sim-hype-label').textContent === 'CROWD HYPE');
  check('sim skip btn EN', doc.getElementById('simSkipBtn').textContent.indexOf('Skip simulation') !== -1);

  doc.getElementById('simSkipBtn').click();
  await waitUntil(() => doc.querySelector('.screen.active').id === 'screen-result', 8000);

  check('result eyebrow EN', doc.querySelector('.eyebrow').textContent === 'Result');
  check('result title EN', doc.querySelector('#screen-result h1.title').textContent === 'Your Lineup');
  const attrText = doc.getElementById('attrPanel').textContent;
  check('attrPanel FINAL HYPE EN', attrText.indexOf('FINAL HYPE') !== -1);
  check('attrPanel TOTAL ATTENDANCE EN', attrText.indexOf('TOTAL ATTENDANCE') !== -1);
  check('attrPanel GENRES EN', attrText.indexOf('GENRES') !== -1);
  check('attrPanel BUDGET EN', attrText.indexOf('BUDGET') !== -1);
  check('download btn EN', doc.getElementById('posterDownloadLink').textContent.indexOf('Download image') !== -1);
  check('suggestion btn EN', doc.getElementById('suggestionLink').textContent.indexOf('Send feedback') !== -1);
  check('suggestion mailto subject EN', decodeURIComponent(doc.getElementById('suggestionLink').href).indexOf('Suggestion - Build Your Lineup') !== -1);
  check('posterImg alt EN', doc.getElementById('posterImg').getAttribute('alt') === 'Your lineup poster');

  // 4. Toggle back to Spanish on the result screen and verify live refresh (no page reload)
  const resultToggle = doc.querySelector('#screen-result [data-lang-toggle]');
  check('result toggle exists', !!resultToggle);
  resultToggle.click();
  check('lang back to es', doc.documentElement.getAttribute('lang') === 'es');
  check('result title back to ES', doc.querySelector('#screen-result h1.title').textContent === 'Tu Cartel');
  const attrText2 = doc.getElementById('attrPanel').textContent;
  check('attrPanel back to ES', attrText2.indexOf('HYPE FINAL') !== -1 && attrText2.indexOf('PRESUPUESTO') !== -1);
  check('suggestion btn back to ES', doc.getElementById('suggestionLink').textContent.indexOf('Enviar sugerencia') !== -1);

  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
})().catch(err => { console.error('DRIVE FAILED:', err.stack || err); process.exit(1); });
