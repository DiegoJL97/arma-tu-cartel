const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
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

let lastCanvasWidth = null, lastCanvasHeight = null, drawImageCalls = 0;
function makeFakeCtx(){
  return {
    fillRect(){}, beginPath(){}, moveTo(){}, lineTo(){}, stroke(){}, fill(){},
    arcTo(){}, closePath(){}, fillText(){}, measureText(){ return { width: 200 }; },
    createRadialGradient(){ return { addColorStop(){} }; },
    drawImage(){ drawImageCalls++; },
    set fillStyle(v){}, get fillStyle(){ return '#000'; },
    set strokeStyle(v){}, get strokeStyle(){ return '#000'; },
    set lineWidth(v){}, get lineWidth(){ return 1; },
    set font(v){}, get font(){ return ''; },
    set textAlign(v){}, get textAlign(){ return 'center'; },
    set globalCompositeOperation(v){}, get globalCompositeOperation(){ return 'source-over'; }
  };
}
window.HTMLCanvasElement.prototype.getContext = function(){ return makeFakeCtx(); };
window.HTMLCanvasElement.prototype.toDataURL = function(){
  lastCanvasWidth = this.width; lastCanvasHeight = this.height;
  return 'data:image/png;base64,FAKE';
};
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

async function playOnce(doc, label){
  doc.getElementById('startBtn').click();
  for (let round = 1; round <= 10; round++) {
    await waitUntil(() => doc.querySelectorAll('.choice-card').length === 3, 8000);
    const cards = doc.querySelectorAll('.choice-card');
    cards.forEach(c => { c.disabled = false; });
    cards[cards.length - 1].click();
  }
  await waitUntil(() => doc.querySelector('.screen.active').id === 'screen-simulation', 8000);
  doc.getElementById('simSkipBtn').click();
  await waitUntil(() => doc.querySelector('.screen.active').id === 'screen-result', 8000);
  console.log(label, '-> hype final logged in attrPanel, finalScore/label set. canvas:', lastCanvasWidth, 'x', lastCanvasHeight, 'drawImageCalls:', drawImageCalls);
}

(async () => {
  const doc = window.document;
  for (let i = 1; i <= 5; i++) {
    await playOnce(doc, 'play ' + i);
    if (i < 5) {
      drawImageCalls = 0;
      doc.getElementById('playAgainBtn').click();
    }
  }
  process.exit(0);
})().catch(err => { console.error('DRIVE FAILED:', err.stack || err); process.exit(1); });
