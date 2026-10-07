(() => {
'use strict';

/* =====================================================================
   PERSONALIZE HERE  ✎
   ===================================================================== */
const CONFIG = {
  name: "Aya",
  from: "Abderrahmane",       
  message: [
    "Happy 24th birthday! I hope today feels as cozy as your favorite REAL/DIGITAL socks.",
    "I'm so proud of how hard you work in school: the late night study sessions, the endless drug names, and the way you already care about every future patient you haven't even met yet. You are going to be an incredible pharmacist.",
    "And somehow you still made time for yarn, flowers and little handmade things that make the world softer. I picked forget-me-nots because I could never forget how fortunate I am to have you in  my life (and because you love them ofc).",
    "Here's to 24: may your yarn never tangle, your exams be kind, and your flowers never wilt. I love you to the moon and back! \u{1F49B}"
  ]
};

/* ===================================================================== */
const W = 480, H = 270, TOTAL = 24;
const WORLD_W = 3300, GROUND_Y = 240;
const GRAV_UP = 0.34, GRAV_DOWN = 0.43, JUMP = 7.4, MAXV = 2.3, MAXFALL = 8;
const LOWER = 0.75;   // 1 = original height, smaller = platforms closer to the ground
const lowerY = y => Math.round(GROUND_Y - (GROUND_Y - y) * LOWER);
const INK = '#4a3f55', PINK = '#f48fb1', PINK_D = '#e0709c', CREAM = '#fff8ec';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = W; canvas.height = H;
ctx.imageSmoothingEnabled = false;

/* ---------------------------------------------------------------------
   Pixel sprites (drawn from character maps)
--------------------------------------------------------------------- */
function makeSprite(rows, pal) {
  const c = document.createElement('canvas');
  c.width = rows[0].length; c.height = rows.length;
  const g = c.getContext('2d');
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch !== '.' && pal[ch]) { g.fillStyle = pal[ch]; g.fillRect(x, y, 1, 1); }
  }));
  return c;
}

const playerPal = { K:'#4a3f55', C:'#ffffff', P:'#f28fb0', H:'#7a4a3a', S:'#ffd9bf', M:'#d9657f', W:'#ffffff', D:'#6c8ebf', B:'#e58aae' };
const head = [
  "....KKKKKK....",
  "...KCCPPCCK...",
  "...KCCPPCCK...",
  "..KKKKKKKKKK..",
  "..KHHHHHHHHK..",
  ".KHHSSSSSSHHK.",
  ".KHSSKSSKSSHK.",
  ".KHSPSSSSPSHK.",
  ".KHSSSMMSSSHK.",
  "..KHSSSSSSHK..",
  "...KKWWWWKK...",
  "..KWWWWWWWWK..",
  ".KWWWWPPWWWWK.",
  ".KSWWWWWWWWSK.",
  ".KWWWWWWWWWWK.",
  "..KWWWWWWWWK..",
  "..KWWWWWWWWK.."
];
const legsA = ["...KDDKKDDK...", "...KDDK.KDDK..", "..KBBBK.KBBBK."];
const legsB = ["...KDDKKDDK...", "....KDKKDK....", "...KBBKKBBK..."];
const legsJ = ["..KDDK..KDDK..", ".KDDK....KDDK.", "KBBBK....KBBBK"];
const spr = {
  pStand: makeSprite([...head, ...legsA], playerPal),
  pWalk:  makeSprite([...head, ...legsB], playerPal),
  pJump:  makeSprite([...head, ...legsJ], playerPal),
  flower: makeSprite([
    "..bb.bb..",
    ".bbbbbbb.",
    ".bbbybbb.",
    ".bbbbbbb.",
    "..bb.bb..",
    "....g....",
    ".g..g....",
    ".gg.g....",
    "..ggg....",
    "....g...."
  ], { b:'#7aa7f0', y:'#ffe27a', g:'#6fbf73' }),
  yarn: makeSprite([
    "...KKKK...",
    "..KPPPPPK.",
    ".KPPpPPpPK",
    ".KpPPpPPPK",
    "KPPpPPpPPK",
    "KPpPPpPPpK",
    ".KPPpPPpPK",
    ".KPpPPpPPK",
    "..KPPPPPK.",
    "...KKKK.pp"
  ], { K:'#9c5a7a', P:'#f48fb1', p:'#fbc4d8' }),
  sock: makeSprite([
    "..KKKKKK..",
    "..KWWWWK..",
    "..KWwWwK..",
    "..KLLLLK..",
    "..KPPPPK..",
    "..KLLLLK..",
    "..KPPPPPPK",
    ".KLLLLLLLK",
    ".KPPPPPPPK",
    "..KKKKKKK."
  ], { K:'#5b4a7a', W:'#ffffff', w:'#e6e0f2', L:'#b9a3e8', P:'#f9b5cf' }),
  germA: makeSprite([
    "...KKKKKK...",
    "..KGGGGGGK..",
    ".KGGGGGGGGK.",
    ".KGWKGGWKGK.",
    ".KGGGGGGGGK.",
    ".KGGKKKKGGK.",
    "..KGGGGGGK..",
    "...KK..KK..."
  ], { K:'#3b4a3a', G:'#8fd18f', W:'#ffffff' }),
  germB: makeSprite([
    "...KKKKKK...",
    "..KGGGGGGK..",
    ".KGGGGGGGGK.",
    ".KGWKGGWKGK.",
    ".KGGGGGGGGK.",
    ".KGGKKKKGGK.",
    "..KGGGGGGK..",
    "..KK....KK.."
  ], { K:'#3b4a3a', G:'#8fd18f', W:'#ffffff' })
};
const ITEM_SIZE = { flower:[9,10], yarn:[10,10], sock:[10,10] };
const ITEM_COLORS = { flower:['#7aa7f0','#c9dcff','#ffe27a'], yarn:['#f48fb1','#fbc4d8','#ffffff'], sock:['#b9a3e8','#f9b5cf','#ffffff'] };
const ITEM_NAMES  = { flower:'Forget-me-not!', yarn:'Yarn ball!', sock:'Cozy sock!' };

/* ---------------------------------------------------------------------
   Level data
--------------------------------------------------------------------- */
const groundSegs = [[0,608],[656,1248],[1296,1904],[1952,2560],[2608,3300]];
const platforms = groundSegs.map(([a,b]) => ({ x:a, y:GROUND_Y, w:b-a, h:30, ground:true }));
[
  [200,188,64],[330,150,64],[470,190,80],
  [700,190,64],[820,145,64],[940,100,64],[1060,160,80],
  [1330,190,64],[1450,150,64],[1570,110,64],[1700,170,96],
  [1990,185,64],[2100,145,64],[2220,105,64],[2340,165,80],
  [2640,190,64],[2760,150,64],[2880,190,96]
].forEach(([x,y,w]) => platforms.push({ x, y:lowerY(y), w, h:12, ground:false }));

// 8 forget-me-nots, 8 yarn balls, 8 socks = 24
const ITEM_DEFS = [
  ['flower',100,222],['yarn',232,172],['sock',362,134],
  ['flower',510,174],['yarn',570,222],['sock',730,174],
  ['flower',852,129],['yarn',972,84],['sock',1100,144],
  ['flower',1180,222],['yarn',1362,174],['sock',1482,134],
  ['flower',1602,94],['yarn',1745,154],['sock',1850,222],
  ['flower',2022,169],['yarn',2132,129],['sock',2252,89],
  ['flower',2380,149],['yarn',2480,222],['sock',2672,174],
  ['flower',2792,134],['yarn',2925,174],['sock',3050,222]
];
const ENEMY_DEFS = [[300,560],[880,1180],[1400,1850],[2040,2500],[2690,3100]];
const FLAG_X = 3190;

/* ---------------------------------------------------------------------
   Game state
--------------------------------------------------------------------- */
let state = 'title';            // 'title' | 'play' | 'win'
let T = 0;                      // tick counter
let camX = 0;
let items = [], enemies = [], particles = [], confetti = [];
let count = 0, counts = { flower:0, yarn:0, sock:0 };
let toast = null;
let safe = { x:40, y:200 };
const P = { x:40, y:200, w:10, h:20, vx:0, vy:0, face:1, onGround:false, coyote:0, jumpBuf:0, anim:0, inv:0, stun:0, plat:null, prevBottom:0 };

function initLevel() {
  count = 0; counts = { flower:0, yarn:0, sock:0 };
  items = ITEM_DEFS.map(([type,x,y], i) => ({ type, x, y: y === 222 ? y : lowerY(y + 16) - 16, got:false, i }));
  enemies = ENEMY_DEFS.map(([a,b], i) => ({ x:a + (b-a)*0.4, y:GROUND_Y-8, w:12, h:8, min:a, max:b-12, dir: i%2 ? -1 : 1, alive:true, squash:0 }));
  Object.assign(P, { x:40, y:GROUND_Y-P.h-1, vx:0, vy:0, face:1, onGround:false, coyote:0, jumpBuf:0, inv:0, stun:0, plat:null });
  safe = { x:40, y:GROUND_Y-P.h-1 };
  camX = 0; particles = []; confetti = []; toast = null;
}

/* ---------------------------------------------------------------------
   Audio (tiny WebAudio chiptune blips)
--------------------------------------------------------------------- */
let actx = null, muted = false;
function initAudio() {
  if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (actx && actx.state === 'suspended') actx.resume();
}
function tone(f, dur, type = 'square', vol = 0.04, f2 = null, delay = 0) {
  if (!actx || muted) return;
  const t = actx.currentTime + delay, o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur + 0.02);
}
const sfx = {
  jump:   () => tone(380, .14, 'square', .035, 720),
  collect:() => { tone(880, .08, 'square', .04); tone(1320, .14, 'square', .04, null, .07); },
  stomp:  () => tone(260, .12, 'square', .05, 90),
  hit:    () => tone(180, .2, 'sawtooth', .05, 70),
  splash: () => tone(300, .25, 'triangle', .05, 80),
  win:    () => [523,659,784,1047,784,1047,1319].forEach((f,i) => tone(f, .18, 'square', .04, null, i*.12))
};

/* ---------------------------------------------------------------------
   Input
--------------------------------------------------------------------- */
const keys = { left:false, right:false, jump:false };
let jumpQueued = false;
function setKey(code, down) {
  switch (code) {
    case 'ArrowLeft': case 'KeyA': keys.left = down; return true;
    case 'ArrowRight': case 'KeyD': keys.right = down; return true;
    case 'Space': case 'ArrowUp': case 'KeyW':
      if (down && !keys.jump) jumpQueued = true;
      keys.jump = down; return true;
  }
  return false;
}
addEventListener('keydown', e => {
  if (e.code === 'KeyM') { muted = !muted; return; }
  if (state === 'title' && (e.code === 'Enter' || e.code === 'Space')) { e.preventDefault(); start(); return; }
  if (state === 'win' && e.code === 'Enter') { e.preventDefault(); restart(); return; }
  if (setKey(e.code, true)) e.preventDefault();
});
addEventListener('keyup', e => { if (setKey(e.code, false)) e.preventDefault(); });
addEventListener('blur', () => { keys.left = keys.right = keys.jump = false; });

document.querySelectorAll('#touch button').forEach(b => {
  const k = b.dataset.k;
  const press = e => { e.preventDefault(); b.classList.add('down'); if (k === 'jump') { if (!keys.jump) jumpQueued = true; keys.jump = true; } else keys[k] = true; };
  const release = e => { e.preventDefault(); b.classList.remove('down'); keys[k] = false; };
  b.addEventListener('pointerdown', press);
  ['pointerup','pointercancel','pointerleave'].forEach(ev => b.addEventListener(ev, release));
  b.addEventListener('contextmenu', e => e.preventDefault());
});
canvas.addEventListener('pointerdown', () => { if (state === 'title') start(); });

function start() { initAudio(); state = 'play'; }
function restart() {
  document.getElementById('win').hidden = true;
  initLevel(); state = 'play';
}

/* ---------------------------------------------------------------------
   Helpers
--------------------------------------------------------------------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function mulberry(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function pixCircle(cx, cy, r, col) {
  ctx.fillStyle = col;
  for (let dy = -r; dy <= r; dy++) {
    const dx = Math.floor(Math.sqrt(r*r - dy*dy) + 0.5);
    ctx.fillRect(cx - dx, cy + dy, dx*2 + 1, 1);
  }
}
function text(s, x, y, col, size = 10, align = 'left', shadow = null) {
  ctx.font = `bold ${size}px "Courier New", monospace`;
  ctx.textAlign = align; ctx.textBaseline = 'top';
  if (shadow) { ctx.fillStyle = shadow; ctx.fillText(s, x + 1, y + 1); }
  ctx.fillStyle = col; ctx.fillText(s, x, y);
}
function panel(x, y, w, h, fill, border) {
  ctx.fillStyle = border;
  ctx.fillRect(x+1, y, w-2, h); ctx.fillRect(x, y+1, w, h-2);
  ctx.fillStyle = fill;
  ctx.fillRect(x+2, y+1, w-4, h-2); ctx.fillRect(x+1, y+2, w-2, h-4);
}
function burst(x, y, cols, n = 10, grav = 0.08) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = 0.6 + Math.random() * 1.8;
    particles.push({ x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s - 0.8, life:26 + Math.random()*14|0, max:40, col:cols[i % cols.length], sz:2, grav });
  }
}
function showToast(s, t = 110) { toast = { s, t }; }

/* ---------------------------------------------------------------------
   Decorations (seeded so every load looks the same)
--------------------------------------------------------------------- */
const decor = [];
(() => {
  const r = mulberry(24);
  groundSegs.forEach(([a,b]) => {
    for (let x = a + 12; x < b - 12; x += 14 + r() * 26) {
      const k = r();
      decor.push({ x: Math.round(x), type: k < .18 ? 'bush' : k < .4 ? 'tuft' : k < .6 ? 'pink' : k < .78 ? 'white' : 'blue' });
    }
  });
})();
const clouds = [];
(() => { const r = mulberry(7); for (let i = 0; i < 9; i++) clouds.push({ x: i * 120 + r()*60, y: 18 + r()*70, s: 0.8 + r()*0.6 }); })();

/* ---------------------------------------------------------------------
   Update
--------------------------------------------------------------------- */
function physics(dir, jumpHeld) {
  if (P.stun > 0) { dir = 0; P.stun--; }
  if (dir !== 0) { P.vx = clamp(P.vx + dir * (P.onGround ? 0.4 : 0.25), -MAXV, MAXV); P.face = dir; }
  else {
    const f = P.onGround ? 0.35 : 0.1;
    if (Math.abs(P.vx) <= f) P.vx = 0; else P.vx -= Math.sign(P.vx) * f;
  }

  if (P.jumpBuf > 0) P.jumpBuf--;
  if (P.onGround) P.coyote = 6; else if (P.coyote > 0) P.coyote--;
  if (P.jumpBuf > 0 && P.coyote > 0) {
    P.vy = -JUMP; P.onGround = false; P.coyote = 0; P.jumpBuf = 0; sfx.jump();
    burst(P.x + 5, P.y + 20, ['#ffffff', '#e8f6e8'], 4, 0.02);
  }
  // letting go of jump gently trims the rise instead of snapping it
  if (!jumpHeld && P.vy < -2) P.vy *= 0.88;

  // lighter gravity on the way up, a touch heavier on the way down
  P.vy = Math.min(P.vy + (P.vy < 0 ? GRAV_UP : GRAV_DOWN), MAXFALL);
  P.x = clamp(P.x + P.vx, 0, WORLD_W - P.w);
  P.prevBottom = P.y + P.h;
  P.y += P.vy;

  P.onGround = false;
  if (P.vy >= 0) {
    for (const p of platforms) {
      if (P.x + P.w - 2 > p.x && P.x + 2 < p.x + p.w && P.prevBottom <= p.y + 1 && P.y + P.h >= p.y) {
        P.y = p.y - P.h; P.vy = 0; P.onGround = true; P.plat = p; break;
      }
    }
  }
  if (P.onGround && Math.abs(P.vx) > 0.3) P.anim += Math.abs(P.vx) * 0.12; else if (P.onGround) P.anim = 0;
}

function update() {
  T++;
  clouds.forEach(c => c.x += 0.04);

  if (state === 'play') {
    if (jumpQueued) { P.jumpBuf = 7; jumpQueued = false; }
    if (P.inv > 0) P.inv--;
    physics((keys.right ? 1 : 0) - (keys.left ? 1 : 0), keys.jump);

    // remember a safe spot to respawn
    if (P.onGround && P.plat) {
      const p = P.plat;
      safe = { x: clamp(P.x, p.x + 8, p.x + p.w - P.w - 8), y: p.y - P.h - 1 };
    }
    // fell in the stream
    if (P.y > 262) {
      sfx.splash(); burst(P.x + 5, 258, ['#c9eefb', '#8fd3ea', '#ffffff'], 14, 0.12);
      P.x = safe.x; P.y = safe.y; P.vx = P.vy = 0; P.inv = 70; P.stun = 0;
      showToast('Splash! Back to the bank.');
    }

    // enemies
    enemies.forEach(e => {
      if (!e.alive) { if (e.squash > 0) e.squash--; return; }
      e.x += e.dir * 0.5;
      if (e.x < e.min) { e.x = e.min; e.dir = 1; }
      if (e.x > e.max) { e.x = e.max; e.dir = -1; }
      if (P.x + P.w - 1 > e.x && P.x + 1 < e.x + e.w && P.y + P.h > e.y && P.y < e.y + e.h) {
        if (P.vy > 0 && P.prevBottom <= e.y + 4) {
          e.alive = false; e.squash = 24; P.vy = -5.2; P.jumpBuf = 0;
          sfx.stomp(); burst(e.x + 6, e.y + 4, ['#8fd18f', '#d4f2d0', '#ffffff'], 10);
        } else if (P.inv <= 0) {
          P.inv = 90; P.stun = 12; P.vx = (P.x + 5 < e.x + 6) ? -3 : 3; P.vy = -4; P.onGround = false;
          sfx.hit(); showToast('Ouch! Jump on the germs!');
        }
      }
    });

    // items
    items.forEach(it => {
      if (it.got) return;
      if (P.x < it.x + 7 && P.x + P.w > it.x - 7 && P.y < it.y + 7 && P.y + P.h > it.y - 7) {
        it.got = true; count++; counts[it.type]++;
        sfx.collect(); burst(it.x, it.y, ITEM_COLORS[it.type], 12, 0.04);
        showToast(count === TOTAL ? 'All 24 found! Run to the pharmacy flag!' : `${ITEM_NAMES[it.type]}  ${count} / ${TOTAL}`, count === TOTAL ? 220 : 90);
      }
    });

    // goal flag
    if (P.x + P.w > FLAG_X - 10 && P.x < FLAG_X + 14) {
      if (count === TOTAL) win();
      else showToast(`Collect all 24 first! ${TOTAL - count} left to find.`, 150);
    }
  } else if (state === 'win') {
    physics(0, false);
    if (P.onGround && T % 46 === 0) { P.vy = -4.6; P.onGround = false; }
    if (T % 4 === 0) spawnConfetti(2);
  }

  // camera
  const target = clamp(P.x + P.w/2 - W/2 + P.face * 24, 0, WORLD_W - W);
  camX += (target - camX) * 0.12;

  particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += p.grav; p.life--; });
  particles = particles.filter(p => p.life > 0);
  confetti.forEach(c => { c.x += c.vx + Math.sin((T + c.ph) / 14) * 0.4; c.y += c.vy; });
  confetti = confetti.filter(c => c.y < H + 6);
  if (toast && --toast.t <= 0) toast = null;
}

function spawnConfetti(n) {
  const cols = ['#f48fb1', '#7aa7f0', '#ffe27a', '#8fd18f', '#b9a3e8', '#ffffff'];
  for (let i = 0; i < n; i++) confetti.push({ x: Math.random() * W, y: -6, vx: (Math.random() - .5) * 0.8, vy: 0.7 + Math.random() * 1.3, col: cols[(Math.random() * cols.length) | 0], sz: Math.random() < .5 ? 2 : 3, ph: Math.random() * 100 });
}

function win() {
  state = 'win'; sfx.win(); toast = null;
  P.vx = 0; P.face = 1;
  for (let i = 0; i < 120; i++) { spawnConfetti(1); confetti[confetti.length-1].y = -Math.random() * 200; }
  document.getElementById('win').hidden = false;
  document.getElementById('again').focus({ preventScroll: true });
}

/* ---------------------------------------------------------------------
   Render
--------------------------------------------------------------------- */
const SKY = ['#8ecdf0','#9dd5f2','#addcf3','#bfe4f5','#d0ebf6','#e2f0f6','#f3eef2','#fbe6ee','#fadfe9'];

function drawBackground(cx) {
  const bh = Math.ceil(H / SKY.length);
  SKY.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(0, i * bh, W, bh); });

  // sun
  pixCircle(404, 52, 17, '#fff0c2'); pixCircle(404, 52, 12, '#ffe58f');

  // clouds
  const span = 1100;
  clouds.forEach(c => {
    const sx = (((c.x - cx * 0.25) % span) + span) % span - 120;
    const s = c.s, x = Math.round(sx), y = Math.round(c.y);
    pixCircle(x, y, Math.round(8*s), '#ffffff');
    pixCircle(x + Math.round(12*s), y - Math.round(5*s), Math.round(11*s), '#ffffff');
    pixCircle(x + Math.round(25*s), y, Math.round(8*s), '#ffffff');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x, y, Math.round(25*s), Math.round(8*s));
    ctx.fillStyle = '#f3e4ee'; ctx.fillRect(x - 2, y + Math.round(7*s), Math.round(29*s), 2);
  });

  // hills (parallax)
  ctx.fillStyle = '#c4e8bd';
  for (let sx = 0; sx < W; sx++) {
    const hx = sx + cx * 0.2;
    const h = Math.round(84 + Math.sin(hx / 70) * 18 + Math.sin(hx / 31) * 6);
    ctx.fillRect(sx, 256 - h, 1, h);
  }
  ctx.fillStyle = '#a6dba1';
  for (let sx = 0; sx < W; sx++) {
    const hx = sx + cx * 0.45;
    const h = Math.round(52 + Math.sin(hx / 45 + 2) * 12 + Math.sin(hx / 19) * 3);
    ctx.fillRect(sx, 256 - h, 1, h);
  }

  // stream under the gaps
  ctx.fillStyle = '#8fd3ea'; ctx.fillRect(0, 256, W, 14);
  ctx.fillStyle = '#c9eefb';
  for (let x = 0; x < W + 12; x += 12) ctx.fillRect((x + (T >> 1) - cx * 0.5 | 0) % (W + 12), 258 + ((x / 12) & 1) * 4, 6, 1);
}

function drawPlatform(p, cx) {
  if (p.x + p.w < cx - 8 || p.x > cx + W + 8) return;
  for (let tx = p.x; tx < p.x + p.w; tx += 8) {
    if (tx + 8 < cx || tx > cx + W) continue;
    const tw = Math.min(8, p.x + p.w - tx), idx = (tx - p.x) / 8;
    if (p.ground) {
      ctx.fillStyle = '#e0b08f'; ctx.fillRect(tx, p.y + 4, tw, p.h - 4);
      for (let r = p.y + 8, k = 0; r < p.y + p.h; r += 8, k++) {
        const hsh = (Math.imul(tx, 73856093) ^ Math.imul(r, 19349663)) >>> 0;
        if (hsh % 3 === 0) { ctx.fillStyle = '#c98f6c'; ctx.fillRect(tx + (hsh >> 3) % 6, r + (hsh >> 5) % 6, 2, 1); }
        if (hsh % 7 === 0) { ctx.fillStyle = '#efc7a8'; ctx.fillRect(tx + (hsh >> 4) % 6, r + (hsh >> 6) % 6, 1, 1); }
      }
    } else {
      ctx.fillStyle = '#f6cbdc'; ctx.fillRect(tx, p.y + 4, tw, p.h - 4);
      ctx.fillStyle = '#e9aec6'; ctx.fillRect(tx, p.y + 4, 1, p.h - 4); ctx.fillRect(tx, p.y + 8, tw, 1);
      ctx.fillStyle = '#d98fae'; ctx.fillRect(tx, p.y + p.h - 1, tw, 1);
    }
    ctx.fillStyle = '#8fd18f'; ctx.fillRect(tx, p.y, tw, 4);
    ctx.fillStyle = '#b4e8ab'; ctx.fillRect(tx, p.y, tw, 1);
    ctx.fillStyle = '#6fbf73';
    if (idx % 2 === 0) ctx.fillRect(tx + 2, p.y + 4, 3, 2); else ctx.fillRect(tx + 5, p.y + 4, 2, 1);
  }
}

function drawDecor(cx) {
  decor.forEach(d => {
    if (d.x < cx - 20 || d.x > cx + W + 20) return;
    const x = d.x, y = GROUND_Y;
    if (d.type === 'bush') {
      pixCircle(x, y - 5, 6, '#7fc383'); pixCircle(x + 8, y - 4, 5, '#8fd18f'); pixCircle(x - 7, y - 3, 4, '#8fd18f');
      ctx.fillStyle = '#7fc383'; ctx.fillRect(x - 10, y - 4, 22, 4);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 2, y - 7, 1, 1); ctx.fillRect(x + 6, y - 5, 1, 1);
    } else if (d.type === 'tuft') {
      ctx.fillStyle = '#6fbf73'; ctx.fillRect(x, y - 4, 1, 4); ctx.fillRect(x - 2, y - 3, 1, 3); ctx.fillRect(x + 2, y - 3, 1, 3);
    } else {
      const col = d.type === 'pink' ? '#f9a8c9' : d.type === 'white' ? '#ffffff' : '#7aa7f0';
      ctx.fillStyle = '#6fbf73'; ctx.fillRect(x, y - 5, 1, 5);
      ctx.fillStyle = col; ctx.fillRect(x - 1, y - 7, 3, 3); ctx.fillRect(x, y - 8, 1, 5); ctx.fillRect(x - 2, y - 6, 5, 1);
      ctx.fillStyle = '#ffe27a'; ctx.fillRect(x, y - 6, 1, 1);
    }
  });
}

function drawPharmacy() {
  const x = 3236, w = 56, top = GROUND_Y - 54;
  ctx.fillStyle = INK; ctx.fillRect(x - 1, top + 8, w + 2, 47);
  ctx.fillStyle = CREAM; ctx.fillRect(x, top + 9, w, 46);
  ctx.fillStyle = '#f2e3d4'; ctx.fillRect(x, top + 50, w, 5);
  // roof
  ctx.fillStyle = INK; ctx.fillRect(x - 5, top + 1, w + 10, 9);
  ctx.fillStyle = PINK; ctx.fillRect(x - 4, top + 2, w + 8, 7);
  ctx.fillStyle = '#fbc4d8'; for (let i = 0; i < w + 8; i += 8) ctx.fillRect(x - 4 + i, top + 2, 4, 7);
  // sign with green cross
  ctx.fillStyle = INK; ctx.fillRect(x + 17, top + 13, 22, 20);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 18, top + 14, 20, 18);
  ctx.fillStyle = '#6fbf73'; ctx.fillRect(x + 25, top + 16, 6, 14); ctx.fillRect(x + 21, top + 20, 14, 6);
  // door + windows
  ctx.fillStyle = INK; ctx.fillRect(x + 21, top + 36, 14, 19);
  ctx.fillStyle = '#8fd0e8'; ctx.fillRect(x + 22, top + 37, 12, 18);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 23, top + 38, 3, 7);
  ctx.fillStyle = INK; ctx.fillRect(x + 3, top + 38, 12, 10); ctx.fillRect(x + 41, top + 38, 12, 10);
  ctx.fillStyle = '#bfe3f5'; ctx.fillRect(x + 4, top + 39, 10, 8); ctx.fillRect(x + 42, top + 39, 10, 8);
  text('Rx', x + 28, top + 36 - 1, PINK_D, 8, 'center');
  // window flowers
  ctx.fillStyle = '#7aa7f0'; [5,8,11].forEach(o => ctx.fillRect(x + o, top + 45, 2, 2)); [44,47,50].forEach(o => ctx.fillRect(x + o, top + 45, 2, 2));
}

function drawFlag(unlocked) {
  const x = FLAG_X, top = GROUND_Y - 78;
  ctx.fillStyle = INK; ctx.fillRect(x - 1, top, 4, 78);
  ctx.fillStyle = unlocked ? '#fff3b8' : '#e9e4ef'; ctx.fillRect(x, top, 2, 78);
  pixCircle(x + 1, top - 2, 3, INK); pixCircle(x + 1, top - 2, 2, '#ffe27a');
  for (let i = 0; i < 22; i++) {
    const h = 15 - (i >> 1), wob = Math.round(Math.sin(T / 9 + i / 3) * 1.5);
    ctx.fillStyle = unlocked ? PINK : '#b9b3c6';
    ctx.fillRect(x + 3 + i, top + 3 + wob + (i >> 2), 1, h);
    if (i < 21) { ctx.fillStyle = unlocked ? '#fbc4d8' : '#cfcadb'; ctx.fillRect(x + 3 + i, top + 3 + wob + (i >> 2), 1, 1); }
  }
  if (unlocked) {   // little heart on the flag
    ctx.fillStyle = '#ffffff';
    [[6,6],[7,6],[9,6],[10,6],[5,7],[6,7],[7,7],[8,7],[9,7],[10,7],[11,7],[6,8],[7,8],[8,8],[9,8],[10,8],[7,9],[8,9],[9,9],[8,10]]
      .forEach(([a,b]) => ctx.fillRect(x + 3 + a, top + 5 + b - 1, 1, 1));
    if (T % 40 < 6) { ctx.fillStyle = '#fff3b8'; ctx.fillRect(x - 8, top + 12, 1, 3); ctx.fillRect(x - 9, top + 13, 3, 1); }
  }
  ctx.fillStyle = INK; ctx.fillRect(x - 3, GROUND_Y - 3, 8, 3);
}

function drawItems() {
  items.forEach(it => {
    if (it.got) return;
    const [w, h] = ITEM_SIZE[it.type];
    const bob = Math.round(Math.sin((T + it.i * 9) / 12) * 2);
    ctx.globalAlpha = 0.35; pixCircle(Math.round(it.x), it.y + bob, 9, '#ffffff'); ctx.globalAlpha = 1;
    ctx.drawImage(spr[it.type], Math.round(it.x - w/2), Math.round(it.y - h/2) + bob);
    if ((T + it.i * 13) % 90 < 5) { ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(it.x) + 6, it.y + bob - 8, 1, 3); ctx.fillRect(Math.round(it.x) + 5, it.y + bob - 7, 3, 1); }
  });
}

function drawEnemies() {
  enemies.forEach(e => {
    const x = Math.round(e.x), y = Math.round(e.y);
    if (!e.alive) { if (e.squash > 0) ctx.drawImage(spr.germA, x, y + 5, 12, 3); return; }
    ctx.drawImage((T >> 4) & 1 ? spr.germA : spr.germB, x, y);
  });
}

function drawPlayer() {
  if (P.inv > 0 && (T >> 2) & 1 && state === 'play') return;
  let s = spr.pStand;
  if (!P.onGround) s = spr.pJump;
  else if (Math.abs(P.vx) > 0.3 && Math.floor(P.anim) % 2 === 1) s = spr.pWalk;
  const px = Math.round(P.x) - 2, py = Math.round(P.y);
  // shadow
  if (P.onGround) { ctx.fillStyle = 'rgba(74,63,85,.2)'; ctx.fillRect(px + 2, py + 20, 10, 1); }
  ctx.save();
  if (P.face < 0) { ctx.translate(px + 14, py); ctx.scale(-1, 1); ctx.drawImage(s, 0, 0); }
  else ctx.drawImage(s, px, py);
  ctx.restore();
}

function drawHUD() {
  panel(6, 6, 148, 42, CREAM, PINK_D);
  text(`Items: ${count} / ${TOTAL}`, 13, 11, INK, 11);
  ['flower', 'yarn', 'sock'].forEach((t, i) => {
    const x = 13 + i * 46, [w, h] = ITEM_SIZE[t];
    ctx.drawImage(spr[t], x, 28 + (10 - h) / 2);
    text(`${counts[t]}/8`, x + 13, 29, INK, 9);
  });
  // progress bar
  ctx.fillStyle = INK; ctx.fillRect(160, 12, 82, 8);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(161, 13, 80, 6);
  ctx.fillStyle = PINK; ctx.fillRect(161, 13, Math.round(80 * count / TOTAL), 6);
  if (muted) text('MUTE', W - 8, 8, INK, 9, 'right', '#ffffffaa');
  if (toast) {
    const w = Math.max(160, toast.s.length * 6.4 + 20);
    panel(Math.round(W/2 - w/2), 54, Math.round(w), 18, '#ffffff', PINK_D);
    text(toast.s, W/2, 58, INK, 10, 'center');
  }
}

function drawTitle() {
  ctx.fillStyle = 'rgba(47,42,59,.28)'; ctx.fillRect(0, 0, W, H);
  panel(52, 22, 376, 188, CREAM, PINK_D);
  const name = CONFIG.name.trim();
  text('HAPPY 24TH BIRTHDAY' + (name ? ',' : '!'), W/2, 34, PINK_D, 20, 'center', '#f7b6cf');
  if (name) text(name.toUpperCase() + '!', W/2, 56, PINK_D, 20, 'center', '#f7b6cf');
  text('~ A Cozy Pharmacy Adventure ~', W/2, name ? 84 : 66, INK, 11, 'center');
  const y0 = name ? 104 : 92;
  text('Collect all 24 treasures:', W/2, y0, INK, 10, 'center');
  [['flower',9,10],['yarn',10,10],['sock',10,10]].forEach(([t], i) => {
    const [w, h] = ITEM_SIZE[t], bob = Math.round(Math.sin((T + i * 10) / 10) * 2);
    ctx.drawImage(spr[t], W/2 - 66 + i * 52 - w, y0 + 16 + bob, w * 2, h * 2);
  });
  text('Arrows / A D  = move      SPACE = jump', W/2, y0 + 46, INK, 9, 'center');
  text('Stomp germs, skip the stream, reach the flag!', W/2, y0 + 59, INK, 9, 'center');
  if ((T >> 5) & 1) text('PRESS ENTER OR TAP TO START', W/2, 187, PINK_D, 11, 'center');
}

function render() {
  const cx = Math.round(camX);
  ctx.clearRect(0, 0, W, H);
  drawBackground(cx);

  ctx.save();
  ctx.translate(-cx, 0);
  platforms.forEach(p => drawPlatform(p, cx));
  drawDecor(cx);
  drawPharmacy();
  drawFlag(count === TOTAL);
  drawItems();
  drawEnemies();
  drawPlayer();
  particles.forEach(p => { ctx.globalAlpha = Math.min(1, p.life / 14); ctx.fillStyle = p.col; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.sz, p.sz); });
  ctx.globalAlpha = 1;
  ctx.restore();

  if (state === 'title') drawTitle(); else drawHUD();
  confetti.forEach(c => { ctx.fillStyle = c.col; ctx.fillRect(Math.round(c.x), Math.round(c.y), c.sz, c.sz); });
}

/* ---------------------------------------------------------------------
   Layout + main loop
--------------------------------------------------------------------- */
function resize() {
  let s = Math.min((innerWidth - 24) / W, (innerHeight - 24) / H);
  if (s >= 1) s = Math.floor(s);
  canvas.style.width = Math.round(W * s) + 'px';
  canvas.style.height = Math.round(H * s) + 'px';
}
addEventListener('resize', resize); resize();

// Win-card content
(function fillWinCard() {
  const name = CONFIG.name.trim();
  document.getElementById('winTitle').textContent = 'HAPPY 24TH BIRTHDAY' + (name ? ', ' + name.toUpperCase() : '') + '!';
  const box = document.getElementById('msg');
  CONFIG.message.forEach(t => { const p = document.createElement('p'); p.textContent = t; box.appendChild(p); });
  document.getElementById('sig').textContent = '\u2014 ' + CONFIG.from;
  const icons = document.getElementById('winIcons');
  ['flower','yarn','sock','yarn','flower'].forEach(t => {
    const c = document.createElement('canvas'); c.width = 12; c.height = 12;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    const [w, h] = ITEM_SIZE[t]; g.drawImage(spr[t], Math.round((12 - w)/2), Math.round((12 - h)/2));
    icons.appendChild(c);
  });
})();
document.getElementById('again').addEventListener('click', restart);

initLevel();
let last = performance.now(), acc = 0;
const STEP = 1000 / 60;
function frame(now) {
  acc += Math.min(100, now - last); last = now;
  while (acc >= STEP) { update(); acc -= STEP; }
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();