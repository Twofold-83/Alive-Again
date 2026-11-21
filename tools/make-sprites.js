#!/usr/bin/env node
/*
 * Generates the pixel-art sprite pack in public/px/ : 1965 PNGs plus index.json
 * (the original 500 sprites, the level-editor tile sets and level props, then 1000
 * everyday and modern sprites).
 *
 *   node tools/make-sprites.js
 *
 * No dependencies and no network: every sprite is drawn from the hand-made
 * templates below (small ASCII pictures, or tiny drawing routines for tiles and
 * effects), then multiplied by swapping palettes and parts (hats, hair, weapons,
 * open/closed states). The output is deterministic.
 *
 * Template language: one character per pixel.
 *   .            transparent           _   erase what a lower layer drew
 *   abc def ghi jkl mno pqr   six recolourable slots, each dark/mid/light
 *   t s u        the skin slot (shadow, mid, light)
 *   anything in FIX   a fixed palette colour (K outline, W white, R red, ...)
 * A dark 1px outline is added automatically around everything that asks for it.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT = path.join(__dirname, '..', 'public', 'px');

// ───────────────────────── palette (33 colours) ─────────────────────────
const PAL = {
  k: '#1b1524', w0: '#f6f4ee', g1: '#c5ccd6', g2: '#8d96a6', g3: '#5a6072', g4: '#343648',
  r1: '#7e1f32', r2: '#cf3b3b', r3: '#f47c64',
  o1: '#a8501f', o2: '#ea8a2c', o3: '#ffc55a',
  y2: '#f6d23c', y3: '#fff3a6',
  n1: '#1e6a40', n2: '#40a84c', n3: '#96dc5c',
  b1: '#26458c', b2: '#3f82dc', b3: '#92d4f6',
  p1: '#4b2b7c', p2: '#8b52c4', p3: '#c9a0f2',
  t1: '#4c2e20', t2: '#80502c', t3: '#b98448',
  s1: '#c88860', s2: '#f0bf96', d2: '#9a6238',
  m2: '#e86aa2', m3: '#f9b4cc',
  c1: '#1f6e74', c2: '#3ab4a4',
};
const FIX = {
  K: 'k', W: 'w0', w: 'g1', x: 'g2', X: 'g3', V: 'g4',
  R: 'r2', Z: 'r1', I: 'r3', O: 'o2', D: 'o1', F: 'o3', Y: 'y2', E: 'y3',
  G: 'n2', N: 'n1', H: 'n3', B: 'b2', U: 'b1', A: 'b3', P: 'p2', Q: 'p1', J: 'p3',
  T: 't2', C: 't1', L: 't3', S: 's2', y: 's1', M: 'm2', z: 'm3', 1: 'c1', 2: 'c2',
};
const RAMPS = {
  red: ['r1', 'r2', 'r3'], orange: ['o1', 'o2', 'o3'], gold: ['o2', 'y2', 'y3'], yellow: ['o3', 'y2', 'y3'],
  green: ['n1', 'n2', 'n3'], lime: ['n2', 'n3', 'y3'], forest: ['g4', 'n1', 'n2'],
  blue: ['b1', 'b2', 'b3'], navy: ['g4', 'b1', 'b2'], ice: ['b2', 'b3', 'w0'], teal: ['c1', 'c2', 'b3'],
  purple: ['p1', 'p2', 'p3'], violet: ['g4', 'p1', 'p2'], pink: ['r1', 'm2', 'm3'], rose: ['m2', 'm3', 'w0'],
  brown: ['t1', 't2', 't3'], tan: ['t2', 't3', 'y3'], cream: ['t3', 'y3', 'w0'], copper: ['t1', 'o1', 'o2'],
  grey: ['g3', 'g2', 'g1'], steel: ['g2', 'g1', 'w0'], dark: ['g4', 'g3', 'g2'], black: ['k', 'g4', 'g3'],
  white: ['g1', 'w0', 'w0'], maroon: ['g4', 'r1', 'r2'], fire: ['r2', 'o2', 'y2'], lava: ['r1', 'r2', 'o2'],
  skin: ['s1', 's2', 's2'], skin2: ['t2', 'd2', 's1'], skin3: ['d2', 's1', 's2'], pale: ['g2', 'g1', 'w0'],
  gob: ['n1', 'n2', 'n3'], orc: ['g4', 'n1', 'n2'], zombie: ['c1', 'c2', 'n3'], devil: ['r1', 'r2', 'r3'],
  frost: ['b1', 'b2', 'b3'], shade: ['k', 'p1', 'p2'],
};
const SLOT = {};
'abc def ghi jkl mno pqr'.split(' ').forEach((s) => [...s].forEach((ch, i) => { SLOT[ch] = [s[0], i]; }));
SLOT.t = ['s', 0]; SLOT.s = ['s', 1]; SLOT.u = ['s', 2];

// ───────────────────────── PNG encoder ─────────────────────────
const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
function crc32(buf) { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
/** grid: rows of hex strings ('#rrggbb') or null for transparent. */
function png(grid) {
  const h = grid.length, w = grid[0].length;
  const raw = Buffer.alloc(h * (1 + w * 4));
  let o = 0;
  for (const row of grid) {
    raw[o++] = 0;
    for (const c of row) {
      if (c) { raw[o] = parseInt(c.slice(1, 3), 16); raw[o + 1] = parseInt(c.slice(3, 5), 16); raw[o + 2] = parseInt(c.slice(5, 7), 16); raw[o + 3] = 255; }
      o += 4;
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

// ───────────────────────── templates ─────────────────────────
const TPL = {};
function art(src) {
  let cur = null;
  for (const line of src.split('\n')) {
    const l = line.trim();
    if (!l || l.startsWith('//')) continue;
    if (l[0] === '@') {
      const [name, ...kv] = l.slice(1).split(/\s+/);
      if (TPL[name]) throw new Error('duplicate template ' + name);
      cur = TPL[name] = { name, rows: [], x: 0, y: 0, def: {} };
      for (const p of kv) { const [k, v] = p.split('='); if (k === 'x' || k === 'y') cur[k] = +v; else cur.def[k] = v; }
    } else cur.rows.push(l);
  }
}
/** "name:a=red,d=blue+dx,dy" → { t, c, dx, dy } */
function parseLayer(spec) {
  let dx = 0, dy = 0, c = {};
  const plus = spec.indexOf('+');
  if (plus >= 0) { [dx, dy] = spec.slice(plus + 1).split(',').map(Number); spec = spec.slice(0, plus); }
  const colon = spec.indexOf(':');
  if (colon >= 0) { for (const p of spec.slice(colon + 1).split(',')) { const [k, v] = p.split('='); c[k] = v; } spec = spec.slice(0, colon); }
  if (!TPL[spec]) throw new Error('unknown template ' + spec);
  return { t: TPL[spec], c, dx, dy };
}
function ramp(name) { const r = RAMPS[name]; if (!r) throw new Error('unknown ramp ' + name); return r; }
/** Draw layers into a sparse map of "x,y" → hex. */
function compose(layers, colors) {
  const pix = new Map();
  for (const spec of layers) {
    const L = parseLayer(spec);
    L.t.rows.forEach((row, ry) => [...row].forEach((ch, rx) => {
      if (ch === '.') return;
      const key = (rx + L.t.x + L.dx) + ',' + (ry + L.t.y + L.dy);
      if (ch === '_') { pix.delete(key); return; }
      let col;
      if (SLOT[ch]) {
        const [slot, i] = SLOT[ch];
        col = PAL[ramp(L.c[slot] || colors[slot] || L.t.def[slot] || (slot === 's' ? 'skin' : 'grey'))[i]];
      } else if (FIX[ch]) col = PAL[FIX[ch]];
      else throw new Error(`bad char "${ch}" in ${L.t.name}`);
      pix.set(key, col);
    }));
  }
  return pix;
}
/** Place a sparse picture on a square canvas, add the outline. */
function finalize(pix, o = {}) {
  for (let i = 0; i < (o.rot || 0); i++) { const turned = new Map(); for (const [key, col] of pix) { const [x, y] = key.split(',').map(Number); turned.set(-y + ',' + x, col); } pix = turned; }
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const key of pix.keys()) { const [x, y] = key.split(',').map(Number); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  const w = x1 - x0 + 1, h = y1 - y0 + 1, outline = o.o !== false, m = outline ? 1 : 0;
  const need = Math.max(w, h) + 2 * m;
  const size = o.size || (need <= 16 ? 16 : need <= 24 ? 24 : 32);
  if (need > size) throw new Error(`picture ${w}x${h} does not fit ${size}`);
  const ox = Math.floor((size - w) / 2) - x0;
  const oy = (o.anchor === 'center' ? Math.floor((size - h) / 2) : o.anchor === 'top' ? m : size - m - h) - y0;
  const grid = Array.from({ length: size }, () => Array(size).fill(null));
  for (const [key, col] of pix) { const [x, y] = key.split(',').map(Number); grid[y + oy][o.flip ? size - 1 - (x + ox) : x + ox] = col; }
  if (outline) {
    const edge = [];
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      if (grid[y][x]) continue;
      if ((grid[y - 1] && grid[y - 1][x]) || (grid[y + 1] && grid[y + 1][x]) || grid[y][x - 1] || grid[y][x + 1]) edge.push([x, y]);
    }
    for (const [x, y] of edge) grid[y][x] = PAL.k;
  }
  return grid;
}

// ───────────────────────── catalog building ─────────────────────────
const CATS = [];
let cat = null;
function category(id, label, group) { cat = { id, label, group, items: [] }; CATS.push(cat); }
/** A sprite made of template layers. layers: space separated layer specs. */
function S(slug, name, layers, colors = {}, opts = {}) {
  cat.items.push({ slug, name, make: () => finalize(compose(layers.trim().split(/\s+/), colors), { o: cat.group !== 'tile', anchor: cat.group === 'fx' ? 'center' : 'bottom', ...opts }) });
}
/** A sprite drawn by a routine: fn(canvas) on a 16x16 (or opts.size) canvas. */
function D(slug, name, fn, opts = {}) {
  cat.items.push({ slug, name, make: () => {
    const size = opts.size || 16;
    const grid = Array.from({ length: size }, () => Array(size).fill(null));
    fn(canvas(grid, slug));
    if (!opts.o) return grid;
    const pix = new Map();
    grid.forEach((row, y) => row.forEach((c, x) => { if (c) pix.set(x + ',' + y, c); }));
    return finalize(pix, { size: opts.fit ? undefined : size, ...opts });
  } });
}
function hash(str) { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
/** Small drawing helper for routines. Colours are palette keys ('n2') . */
function canvas(grid, seed) {
  const size = grid.length;
  let s = hash(seed);
  const c = {
    size,
    rnd() { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; },
    int(n) { return Math.floor(c.rnd() * n); },
    px(x, y, col) { if (x >= 0 && y >= 0 && x < size && y < size) grid[y][x] = col ? PAL[col] : null; return c; },
    get(x, y) { return grid[y] && grid[y][x]; },
    rect(x, y, w, h, col) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) c.px(x + i, y + j, col); return c; },
    fill(col) { return c.rect(0, 0, size, size, col); },
    h(x, y, w, col) { return c.rect(x, y, w, 1, col); },
    v(x, y, h, col) { return c.rect(x, y, 1, h, col); },
    /** scatter n pixels of col over a rectangle */
    speck(n, col, x = 0, y = 0, w = size, h = size) { for (let i = 0; i < n; i++) c.px(x + c.int(w), y + c.int(h), col); return c; },
    disc(cx, cy, r, col) { for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r + 0.3) c.px(x, y, col); return c; },
    /** rows of template characters stamped at x,y (fixed colours only) */
    stamp(x, y, rows) { rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== '.') c.px(x + i, y + j, ch === '_' ? null : FIX[ch]); })); return c; },
  };
  return c;
}

// ═════════════════════════ ART: characters ═════════════════════════
art(`
// ── humanoid parts, all on one 14x14 grid ──
@hum d=green g=brown j=brown
..............
....ssssss....
...ssssssss...
...ssssssss...
...ssKssKss...
...ssKssKss...
....tsssst....
..ddeeeeeedd..
..d.eefeee.d..
..s.jjkkjj.s..
....hhhhhh....
....hhgghh....
....hh..hh....
....jj..jj....

@kid y=4 d=red g=blue j=brown
....ssssss....
...ssssssss...
...ssssssss...
...ssKssKss...
...ssKssKss...
....tsssst....
...deeeeeed...
...seeeeees...
....hh..hh....
....jj..jj....

@hair_short y=1 a=brown
....bbbbbb....
...bcbbbbbb...
...bbbb..ab...
...b......a...

@hair_long y=1 a=brown
....bbbbbb....
...bcbbbbbb...
..bbbb..bbbb..
..bb......bb..
..bb......bb..
..ab......ba..
..a........a..

@hair_spiky y=0 a=brown
....b.b.b.b...
....bbbbbbb...
...bcbbbbbb...
...bb.b..bb...
...b......b...

@hair_pony y=1 a=brown
....bbbbbb....
...bcbbbbbbbb.
...bbb..bb.bb.
...b......bbb.
...........bb.
...........a..

@hair_bun y=0 a=brown
......bb......
....bbbbbb....
...bcbbbbbb...
...bb....bb...
...b......b...

@hair_sides y=2 a=grey
...b......b...
...bb....bb...
...b......b...

@beard y=5 a=brown
...b......b...
....bbbbbb....
.....bbbb.....

@beard_long y=5 a=white
...b......b...
....bbbbbb....
....bbbbbb....
.....bbbb.....
......bb......

@helm_open y=0 m=steel
......nn......
....nnnooo....
...nnnnnnoo...
...nnnnnnnn...
...m......m...
...m......m...

@helm_full y=1 m=steel
....nnnooo....
...nnnnnnoo...
...nnnnnnnn...
...nKKKKKKn...
...nnnmmnnn...
....mnmmnm....

@plume y=0
......RR......
.....RRII.....

@wizhat y=0 m=blue
.......no.....
.....nnnno....
....nnnnnno...
..mmmEmmmmmm..

@hood y=1 m=dark
....nnnnnn....
...nnonnnnn...
...nn....nn...
...n......n...
...n......n...
...mn....nm...

@crown y=0
....Y.YY.Y....
....YEYRYY....

@tiara y=1
.....YYBY.....

@cap y=1 m=blue
....nnnnnn....
...nnonnnnn...
...mmmmmmmmmm.

@strawhat y=0 m=tan
.....nnnn.....
....nonnnn....
.mmmmmmmmmmmm.

@hornhelm y=0 m=steel
..W........W..
..WWnnnoooWW..
...nnnnnnoo...
...nnnnnnnn...
...m......m...

@bandana y=2 m=red
...nnnnnnnn...
...mnnnnnnmnn.
............n.

@tophat y=0 m=black
....nnnnnn....
....nnnnnn....
....RRRRRR....
..mmmmmmmmmm..

@chefhat y=0
....WWWWWW....
...WWWWWWWW...
...WWWwWWwW...
....wwwwww....

@feathercap y=0 m=green
..........R...
....nnnnnRR...
...nnonnnnR...
..mmmmmmmmm...

@jesterhat y=0
..Y........Y..
..RR......BB..
...RRRR.BBBB..
...RRRRBBBB...

@eyepatch y=4
...KKK........
....KK........

@mask y=5 m=dark
...nn.nn.nn...
....nnnnnn....

@robe y=7 d=blue j=gold
..ddeeeeeedd..
..d.eefeee.d..
..s.kkkkkk.s..
....eeeeee....
...deeeeeed...
...deefeeed...
...dddddddd...

@dress y=7 d=pink j=gold
..ddeeeeeedd..
..s.eefeee.s..
..s.kkkkkk.s..
...eeeeeeee...
...eefeeeee...
..eeeefeeeee..
..dddddddddd..

@armor y=7 m=steel
.oonnnnnnnnoo.
..n.nonnnn.n..

@apron y=8
.....WWWW.....
....WWWWWW....
....WWWWWW....
....wwwwww....

@cape y=7 m=red
.nn........nn.
.n..........n.
.n..........n.
.nn...nn...nn.
.mn...nn...nm.
..m...mm...m..

@wings_h y=5
WW..........WW
WWW........WWW
wWWW......WWWw
.wWW......WWw.
..ww......ww..

@sword_r y=2 p=steel
............r.
............r.
............r.
............r.
............q.
............q.
...........YYY
............T.

@staff_r y=0 p=blue
............q.
...........qrq
............q.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.

@bow_r y=3
............T.
............wT
............wT
............wT
............wT
............wT
............wT
............wT
............T.

@shield_l y=7 p=steel
.qqqq.........
qrqqqq........
qqYYqp........
qqqqqp........
.qppp.........

@axe_r y=3
...........wwW
...........wWW
............TW
............T.
............T.
............T.
............T.
............T.

@spear_r y=0
............W.
...........wWw
............w.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.

@wand_r y=5
...........E.E
............Y.
............T.
............T.
............T.

@dagger_r y=6 p=steel
............r.
............q.
...........YYY
............T.

@torch_r y=4
............O.
...........OYO
...........RYR
............T.
............T.
............T.

@pitchfork_r y=1
...........x.x
...........x.x
...........xxx
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.

@hammer_r y=4
...........xww
...........xxw
............T.
............T.
............T.
............T.

@mace_r y=3
............x.
...........xwx
............x.
............T.
............T.
............T.
............T.

@book_l y=8 p=red
.qqq..........
.qEq..........
.ppp..........

@lantern_r y=8
............x.
...........xYx
...........xEx
...........xxx

@broom_r y=0
...........FFF
...........FFF
...........LLL
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.

@scythe_r y=0
.........wwW..
........w..WT.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.
............T.

@pickaxe_r y=3
..........wwww
.........w..Tw
............T.
............T.
............T.
............T.
............T.

@rod_r y=1
.............T
............Tw
............Tw
...........T.w
...........T.w
...........T.R
...........T..
...........T..
...........T..

@mug_r y=7
...........WWW
...........OOx
...........OOx

@lute_r y=6
.............T
............T.
..........LLL.
..........LKL.
..........LLL.

@flower_r y=6
............R.
...........RYR
............R.
............G.

@sack_l y=6
.LLL..........
.TLLL.........
TLLLL.........
TLLLL.........
.TTT..........

@ears y=3
.ss........ss.
..t........t..

@tusks y=6
....W....W....

@horns y=0
...W......W...
...w......w...

@fangs y=6
.....W..W.....

@redeyes y=4
.....R..R.....
.....R..R.....

@skullhead y=1
....WWWWWW....
...WWWWWWWW...
...WWWWWWWW...
...WKKWWKKW...
...WKKWWKKW...
....WWKKWW....

@bones y=7
..WWwWWWWwWW..
..W.KWKKWK.W..
..W.wWWWWw.W..
....KWKKWK....
....WWWWWW....
....WW__WW....
....WW__WW....

@wraps y=2
...wwwwwwww...
..............
..............
..............
....wwwwww....
..............
....wwwwww....
..............
....wwwwww....
..............
....ww..ww....

@armsout y=7
..........ddss
..........._..
..........._..

@pumpkinhead y=1
......GG......
...OOFOOOOO...
...OFOOOOOO...
...OKKOOKKO...
...OOOOOOOO...
....OKOKOO....

// ── monsters ──
@slime a=green
....bbbb....
..bbccbbbb..
.bbccbbbbbb.
.bcbbbbbbbb.
bbbWKbbWKbbb
bbbKKbbKKbbb
bbbbbbbbbbbb
abbbbbbbbbba
.aaaaaaaaaa.

@slime_small a=green
..bbbb..
.bcbbbb.
bbKbbKbb
bbbbbbbb
.aaaaaa.

@flame_s
..R..
.ROR.
ROYOR

@icespikes
...A...A....
..AWA.AWA.A.

@crown_s
Y.YY.Y
YERRYY

@bat a=purple
.b..........b.
bbb..b..b..bbb
bbbb.bbbb.bbbb
bbbbbbbbbbbbbb
babbbRbbRbbbab
a.a.bbbbbb.a.a
.....bWWb.....

@ghost a=steel
...cccccc...
..cccccccc..
.cccccccccc.
.ccKKccKKcc.
.ccKKccKKcc.
.cccccccccc.
.ccccKKcccc.
.ccccKKccbc.
.cccccccccb.
.ccccccccbb.
.cbccbccbcb.
.b.bb.bb.b..

@spider a=dark
..a........a..
.a..a....a..a.
.a..abbbba..a.
.a.abbbbbba.a.
..abbRbbRbba..
.aabbbbbbbbaa.
a..abbcbbba..a
a.a..bbbb..a.a
..a........a..

@skull
..WWWWWW..
.WWWWWWWW.
WWWWWWWWWW
WKKKWWKKKW
WKKKWWKKKW
WWWWKKWWWw
.WWWWWWWw.
.WKWKWKWw.
..WwWwWw..

@flame_big
....R.......
...RR...R...
..RROR.RR...
..ROORRROR..
.RROOOROOR..
.ROOYOOOYOR.

@eye a=purple
....bbbb....
..bbbbbbbb..
.bbWWWWWWbb.
.bWWWRRWWWb.
bbWWRKKRWWbb
bbWWRKKRWWbb
.bWWWRRWWWb.
.bbWWWWWWbb.
..abbbbbba..
...a.aa.a...
..a..a..a...

@shroom a=red
....bbbbbb....
..bbWbbbbWbb..
.bbbbbbWbbbbb.
.bWbbbbbbbbWb.
.aaaaaaaaaaaa.
...EEEEEEEE...
...EKEEEEKE...
...EKEEEEKE...
...EEEKKEEE...
....LEEEEL....
....LL..LL....

@snake a=green
....bbbb....
...bbKbbb...
...bbbbbbRR.
....abbb....
..bbbbba....
.bcbbbbbbb..
.bbbbbbbbbb.
.abbccbbbba.
..aaaaaaaa..

@rat a=grey
........bb...
..bbbbbbbbb..
.bbbbbbbbKbb.
.bbbbbbbbbbbM
M.abbaabbab..
MM.a...a.a...

@dragon a=green d=gold
..............b.b.....
.............bbbbb....
....a.......bbKbbbb...
...aba......bbbbbbbb..
..abbba.....bbbbbWbW..
..abbbba....bbbb......
.abbbbbba..bbbee......
.abbbbbbbabbbeee......
.ab.abbbbbbbbeee......
.a...abbbbbbeeee......
......bbbbbbeeeb......
.....bbbbbbbeeebb.....
b....bbbbbbbbeebbb....
bb..bbbbbbbbbbbb.bb...
.bbbbbbb.bbb.bbb......
..bbbbb..bbb.bbb......
.........WbW.WbW......

@golem a=grey
....bbbbbb....
...bcbbbbbb...
...bYYbbYYb...
...bbbbbbbb...
.bbbabbbbabbb.
bcbb.bbbb.bbbb
bbbb.bcbb.bbbb
bbba.bbbb.abbb
bbb..bbbb..bbb
bbb..abba..bbb
aba.bbbbbb.aba
....bbb.bbb...
....bbb.bbb...
...abbb.bbba..

@mimic a=brown
.bbbbbbbbbbbb.
bccccccccccccb
bYbbbbbbbbbbYb
bWbWbWbWbWbWbb
KKYKKKKKKYKKKK
KKKKKRRRRKKKKK
bWbWbRRRRWbWbb
bYbbbbRRbbbbYb
bbbbbbbbbbbbbb
aaaaaaaaaaaaaa

@imp a=red
...W......W...
...bbbbbbbb...
...bbbbbbbb...
a..bYKbbYKb..a
aa.bbbbbbbb.aa
aaa.bWWWWb.aaa
aaaabbbbbbaaaa
a.aabbbbbbaa.a
....bbbbbb....
....bb..bb..b.
....bb..bb.b..
...bbb..bbb...

@brute d=brown j=dark
......ssssss......
.....ssssssss.....
.....sKKssKKs.....
.....ssKssKss.....
.....ssssssss.....
....tsWssssWst....
..sssstttttssss...
.sssssddddddssss..
ssss.dddddddd.ssss
sss..dddddddd..sss
sss..dddddddd..sss
sss..jjkkkkjj..sss
tss..dddddddd..sst
.....ddd..ddd.....
.....sss..sss.....
.....sss..sss.....
....ttss..sstt....

@oneeye y=2 x=5
sssWWsss
ssWBKWss

@wolf a=grey
..........b.b.
.........bbbb.
a.......bbbKbb
aa......bbbbbK
.abbbbbbbbbbb.
..bbbbbbbbbb..
..bbbbbbbbbb..
..bbbccccbbb..
..bab....bab..
..ba.....ba...

@wisp a=fire
.....b......
....bb...b..
...bbbb.bb..
..bbbcbbbb..
.bbbcccbbbb.
.bbcKccKcbb.
.bbcKccKcbb.
.bbbccccbbb.
..abbccbba..
...aabbaa...

@scorpion a=orange
.........bb...
........b..b..
.......b...bK.
..b....b......
.b.b...bb.....
.bb..bbbbbb...
..bbbbRbRbbb..
.bb.bbbbbb.bb.
.b..a.aa.a..b.

@jelly a=pink
...bbbbbb...
..bccbbbbb..
.bcbbbbbbbb.
.bbKbbbbKbb.
.bbbbbbbbbb.
.aaaaaaaaaa.
..b.b..b.b..
..b.b..b.b..
.b..b..b..b.
.b.b....b.b.

@piranha a=blue
..........b...
....bbbbbbb..b
..bbbbbbbbb.bb
.bWKbbbbcbbbbb
.bbbbbbbbbbbbb
WKWKWbbbbbb.bb
.RRRRbbbbb...b
.WKWKbbb......

@plant a=green d=red
...eeeee......
..eeWeeee.....
.eeeeeeWee....
.eWKKKKKKKK...
.eeWKWKWKW....
..eeeeeee.....
....bb........
.....bb....b..
..b...bb..bbb.
.bbb..bb.bbb..
..bbb.bbbb....
....bbbbb.....

@worm a=pink
..bbbb........
.bbKbKb.......
.bbbbbb.......
.bcbbbb.......
..bbbba....bb.
..abbbbb..bbbb
...abbbbbbbbab
....aabbbbaa..

@tentacle a=purple
...bbb......
..bbbbb.....
..bb.bbb....
..b...bbb...
.......bbb..
.......bzb..
......bbzb..
.....bbzbb..
.....bzbb...
.....bzbb...
.AAbbbzbbAA.
AABbbbbbbBAA

@wasp
....WW..WW....
...WwwW.Www...
....WwW.wW....
..YYYKKYYKKY..
.YKYYKKYYKKYYK
.YYYYKKYYKKY..
..YY..........
...R..........

@robot a=steel
......R.......
......x.......
...bbbbbbbb...
...bAAbbAAb...
...bAAbbAAb...
...bbbbbbbb...
....aXXXXa....
.bbbbbbbbbbbb.
.b.bbcbbRb.b..
.b.bbbbbGb.b..
.a.bbbbbbb.a..
...aaa.aaa....
...bb...bb....
..bbb...bbb...

@treant a=brown d=green
...eeee.eee...
..eefeeeeeee..
.eeeeeefeeeee.
.eefeeeeeeefe.
..eeebbbeeee..
b..bbbbbbb..b.
bb.bKKbbKKb.bb
.bbbbbbbbbbbb.
...bbKKKKbb...
...bbbbbbbb...
...abbbbbba...
..abb.bb.bba..

// ── animals ──
@cat a=orange
.b......b.
.bb....bb.
.bbbbbbbb.
.bGKbbGKb.
.bbbMMbbb.
..bWWWWb...
.bbbbbbbb.b
.bbcccbbb.b
.bbcccbbbbb
.bb.bb.bb..

@dog a=brown
.........aa...
........abbbb.
b.......abKbbb
b.......abbbbK
bbbbbbbbbbbbb.
.bbbbbbbbbbR..
.bbbbbbbbbb...
.bbccccccbb...
.bb.bb.bb.bb..
.bb.....bb....

@chicken a=white
.....RR...
....bbbb..
....bbKbO.
....bbbbR.
b..bbbbb..
bbbbbbbb..
bbbaabbb..
.bbbbbb...
..bbbb....
...O.O....
..OO.OO...

@chick
..YYYY..
.YYYKYO.
.YYYYY..
YYYEYY..
.YYYYY..
..O.O...

@cow a=white d=black
W...........W.
.bbbbbbbbbbbbb
.bbeebbbbbeeKb
.beeeebbbbbbbb
.bbeebbeebbzzz
.bbbbbbeebbzKz
.bbbbbbbbbb...
.bb.bbzz.bb...
.bb.bb...bb...
.XX.XX...XX...

@pig a=rose
.........b..b.
..bbbbbbbbbbb.
.bbbbbbbbbKbbb
bbbbbbbbbbbaaa
b.bbbbbbbbbaKa
..bbbbbbbbbb..
..bbccccccbb..
..bb.bb..bb...
..aa.aa..aa...

@sheep a=white d=dark
..bbbbbbbb....
.bbbbbbbbbbee.
bbbcbbbcbbeeKe
bbbbbbbbbbeeee
bbcbbbcbbbbee.
.bbbbbbbbbb...
..bbbbbbbb....
..ee.e..ee....
..ee.e..ee....

@horse a=brown d=dark
..........e.b.
.........ebbbb
.........ebbKb
e.......eebbbb
ee.bbbbbbbbbbb
e.bbbbbbbbbb..
e.bbbbbbbbbb..
..bbbbbbbbbb..
..bbb....bbb..
..bb.b..b.bb..
..bb......bb..
..ee......ee..

@rabbit a=white
....b..b..
....bz.bz.
....bz.bz.
....bbbbb.
...bbKbbKb
...bbbMbbb
.bbbbbbbb.
bbbbbbbbb.
Wbbbcccbb.
.bbb..bbb.

@bird a=blue
....bbbb...
...bbbKbO..
a..bbbbbOO.
aabbccbb...
.aabcccb...
..abbbbb...
...bbbb....
....O.O....

@duck a=white
.....bbb...
....bbKbOO.
....bbbbOOO
b...bbb....
bbbbbbbb...
bbbccbbb...
.bbbbbbb...
..bbbbb....
...O.O.....

@frog a=green
.bbb....bbb.
bWKb....bWKb
bbbbbbbbbbbb
bbbbbbbbbbbb
bRRRRRRRRRRb
.bbbccccbbb.
bbbbccccbbbb
bb.bb..bb.bb
bb........bb

@fish a=orange
...bbbb.....
.bbbbbbb..b.
bbKbbcbbbbbb
bbbbccbbbbbb
.bbbbbbb..b.
...bbbb.....

@turtle a=green d=green
...bbbbbb.....
..bbcbbcbb....
.bbbbbbbbbb.ff
.bcbbccbbcbffK
.bbbbbbbbbbfff
eebbbbbbbbee..
.ee.e..e.ee...

@fox a=orange
.b.b..........
.bbbb.........
bbKbbb.......b
KbbbbW......bb
.WWbbbbbbbbbbW
..bbbbbbbbbbW.
..bbbbbbbbb...
..bbWWWWbbb...
..aa.a..aa....
..K..K...K....

@bear a=brown
..bb....bb..
.bbbbbbbbbb.
.bbKbbbbKbb.
.bbbbccbbbb.
.bbbcKKcbbb.
..bbbccbbb..
.bbbbbbbbbb.
bbbbccccbbbb
bbbbccccbbbb
bb.bbbbbb.bb
...bbb.bbb..
..abbb.bbba.

@deer a=brown
.........W.W.W
..........WWW.
.........bbb..
.........bbKb.
.........bbbbK
c.bbbbbbbbb...
.bbbbbbbbbb...
.bbbbbbbbbb...
.bbcccccbb....
.b.b....b.b...
.b.b....b.b...
.a.a....a.a...

@owl a=brown
.b......b.
.bbbbbbbb.
.bWWbbWWb.
.bWKOOKWb.
.bbbOObbb.
abbccccbba
abcbccbcba
abbccccbba
.abbbbbba.
..O....O..

@butterfly a=blue
.bb.....bb.
bccb.K.bccb
bcWcbKbcWcb
.bccbKbccb.
..bbbKbbb..
.bccbKbccb.
.bbb.K.bbb.

@bee
....WW.WW...
...WwwWwwW..
..YYKYYKYY..
.YYYKYYKYYYK
.KYYKYYKYY..
..YYKYYKYY..

@crab a=red
.bb......bb.
b..b....b..b
bb.b....b.bb
.b.K....K.b.
.bbbbbbbbbb.
bbbcbbbbcbbb
.bbbbbbbbbb.
b.b.b..b.b.b

@snail a=orange
......bbbb...
.Y.Y.bbccbb..
.Y.Y.bcbbcb..
.YKYKbcbccb..
.YYYYbbcbbb..
.YYYYYbbbbYY.
..YYYYYYYYYYY

@penguin
...VVVVVV...
..VVVVVVVV..
..VWKWWKWV..
..VWWOOWWV..
.VVWWWWWWVV.
.VVWWWWWWVV.
.VVWWWWWWVV.
..VWWWWWWV..
..VVWWWWVV..
..OOO..OOO..

@octopus a=purple
...bbbbbb...
..bbcbbbbb..
.bbcbbbbbbb.
.bbWKbbWKbb.
.bbbbbbbbbb.
..bbbbbbbb..
.bbbbbbbbbb.
bb.bb.bb.bb.
b..b..b..b.b
.b..b..b..b.

@ladybug
...KKKK...
..KWKKWK..
.RRRKKRRR.
RRKRKKRKRR
RRRRKKRRRR
RKRRKKRRKR
.RRRKKRRR.

@mouse a=grey
.bb...bb...
bzzb.bzzb..
bzzbbbzzb..
.bbbbbbbb..
.bKbbbKbb..
.bbbMbbbb.M
..bbbbbbbM.
.bb.bb.bb..

@squirrel a=copper
.......bbb..
.b.b..bbcbb.
.bbbb.bbccb.
.bKbb..bccb.
bbbbb..bbcb.
.bbbbbbbbbb.
.bbccbbbbb..
.bbccbbbb...
.bb.bbb.....

@shark a=steel
.......a......
......aa......
....bbbbbbb..a
..bbbbbbbbbbaa
.bKbbbbbbbbbbb
bbbbbccccccbaa
.WKWcccccc...a
..ccccc.......

@monkey a=brown
...bbbbbb...
.ssbssssbss.
.sbsKssKsbs.
..bssssssb..
...sKKKKs...
...bbbbbb..b
..bbbssbbb.b
..b.bssb.b.b
..b.bbbb.bbb
...bb..bb...

@goat a=white
.x..x.........
..xx..........
.bbbb.........
bKbbbb.......b
bbbbbbbbbbbbb.
.bb.bbbbbbbbb.
.w..bbbbbbbbb.
.w..bbcccbbb..
....b.b..b.b..
....X.X..X.X..
`);

// ═════════════════════════ CATALOG: characters ═════════════════════════
category('heroes', 'Heroes', 'char');
S('hero', 'hero adventurer default player', 'cape hum hair_short', { d: 'blue', g: 'brown', j: 'brown', a: 'brown' });
S('heroine', 'heroine adventurer girl', 'cape:m=green hum hair_pony', { d: 'red', g: 'navy', j: 'brown', a: 'orange' });
S('adventurer-torch', 'adventurer explorer with torch', 'hum hair_spiky torch_r', { d: 'tan', g: 'brown', j: 'dark', a: 'black' });
S('knight', 'knight with sword and shield', 'hum helm_open armor sword_r shield_l', { d: 'grey', g: 'grey', j: 'dark', p: 'steel' });
S('knight-red', 'red knight with plume', 'hum helm_full plume armor sword_r shield_l:p=red', { d: 'red', g: 'grey', j: 'dark' });
S('paladin', 'paladin gold knight with hammer', 'cape:m=white hum hair_short:a=yellow armor:m=gold hammer_r shield_l:p=gold', { d: 'white', g: 'steel', j: 'gold' });
S('swordswoman', 'swordswoman warrior girl', 'hum hair_long:a=red armor sword_r', { d: 'teal', g: 'dark', j: 'brown' });
S('lancer', 'lancer spearman soldier', 'hum helm_open:m=copper armor:m=copper spear_r', { d: 'blue', g: 'navy', j: 'brown' });
S('gladiator', 'gladiator with spear and shield', 'hum helm_full:m=gold plume spear_r shield_l:p=copper', { d: 'skin', g: 'red', j: 'brown' });
S('mage', 'mage wizard blue with staff', 'hum hair_short:a=grey wizhat robe staff_r', { d: 'blue', j: 'gold' });
S('mage-fire', 'fire mage red wizard', 'hum hair_short:a=orange wizhat:m=red robe staff_r:p=fire', { d: 'red', j: 'gold' });
S('mage-ice', 'ice mage frost wizard', 'hum hair_long:a=white wizhat:m=ice robe staff_r:p=ice', { d: 'ice', j: 'blue' });
S('sorceress', 'sorceress purple witch mage', 'hum hair_long:a=black wizhat:m=purple robe wand_r', { d: 'purple', j: 'pink' });
S('druid', 'druid nature mage green', 'hum hood:m=green beard robe staff_r:p=lime', { d: 'forest', j: 'brown' });
S('warlock', 'warlock dark mage', 'hum hood:m=violet robe staff_r:p=red', { d: 'violet', j: 'red', s: 'pale' });
S('cleric', 'cleric healer priest', 'hum hair_short:a=yellow robe mace_r', { d: 'white', j: 'gold' });
S('priestess', 'priestess healer white robe', 'hum hair_long:a=yellow tiara robe staff_r:p=gold', { d: 'white', j: 'blue' });
S('monk', 'monk orange robe', 'hum hair_sides:a=black robe', { d: 'orange', j: 'brown', s: 'skin3' });
S('rogue', 'rogue thief hooded dagger', 'hum hood mask dagger_r', { d: 'dark', g: 'black', j: 'brown' });
S('thief', 'thief bandana dagger', 'hum hair_short:a=black bandana:m=blue dagger_r', { d: 'navy', g: 'dark', j: 'brown', s: 'skin3' });
S('assassin', 'assassin red hood', 'cape:m=maroon hum hood:m=maroon mask:m=maroon dagger_r', { d: 'black', g: 'black', j: 'red' });
S('ninja', 'ninja black', 'hum hood:m=black mask:m=black sword_r', { d: 'black', g: 'black', j: 'dark' });
S('archer', 'archer with bow', 'hum hair_short:a=yellow feathercap bow_r', { d: 'green', g: 'brown', j: 'brown' });
S('ranger', 'ranger hooded bow', 'cape:m=forest hum hood:m=forest bow_r', { d: 'brown', g: 'forest', j: 'brown', s: 'skin2' });
S('elf', 'elf archer pointy ears', 'hum ears hair_long:a=yellow bow_r', { d: 'lime', g: 'forest', j: 'brown' });
S('barbarian', 'barbarian with axe', 'hum hair_spiky:a=red beard:a=red axe_r', { d: 'skin', g: 'brown', j: 'brown' });
S('viking', 'viking horned helmet axe', 'hum hornhelm beard:a=yellow axe_r shield_l:p=brown', { d: 'brown', g: 'dark', j: 'brown' });
S('dwarf', 'dwarf warrior beard hammer', 'hum helm_open:m=copper beard_long:a=orange hammer_r', { d: 'maroon', g: 'brown', j: 'dark' });
S('samurai', 'samurai red armor sword', 'hum hornhelm:m=red armor:m=red sword_r', { d: 'black', g: 'black', j: 'red' });
S('pirate-hero', 'pirate captain eyepatch sword', 'hum hair_short:a=black bandana eyepatch sword_r', { d: 'white', g: 'navy', j: 'black' });
S('bard', 'bard minstrel with lute', 'hum hair_short:a=orange feathercap:m=purple lute_r', { d: 'purple', g: 'gold', j: 'brown' });
S('valkyrie', 'valkyrie winged warrior spear', 'wings_h hum hair_long:a=yellow helm_open:m=gold spear_r', { d: 'ice', g: 'steel', j: 'gold' });
S('witch-hero', 'witch with broom', 'hum hair_long:a=green wizhat:m=black robe broom_r', { d: 'black', j: 'purple' });
S('alchemist', 'alchemist green robe book', 'hum hair_bun:a=brown robe book_l:p=green wand_r', { d: 'green', j: 'gold' });

category('townsfolk', 'Townsfolk', 'char');
S('king', 'king crown red robe', 'cape hum hair_short:a=grey beard:a=grey crown robe', { d: 'red', j: 'gold' });
S('queen', 'queen crown purple dress', 'hum hair_long:a=brown crown dress', { d: 'purple', j: 'gold' });
S('prince', 'prince young royal', 'cape:m=blue hum hair_short:a=yellow tiara', { d: 'white', g: 'blue', j: 'gold' });
S('princess', 'princess pink dress tiara', 'hum hair_long:a=yellow tiara dress', { d: 'pink', j: 'gold' });
S('guard', 'guard soldier with spear', 'hum helm_open armor spear_r', { d: 'red', g: 'dark', j: 'dark' });
S('guard-captain', 'guard captain blue plume', 'cape:m=blue hum helm_open:m=gold plume armor:m=gold sword_r', { d: 'blue', g: 'navy', j: 'dark' });
S('merchant', 'merchant trader with sack', 'hum hair_sides:a=brown beard cap:m=purple sack_l', { d: 'purple', g: 'brown', j: 'gold', s: 'skin3' });
S('shopkeeper', 'shopkeeper apron', 'hum hair_bun:a=red apron', { d: 'teal', g: 'brown', j: 'brown' });
S('farmer', 'farmer straw hat pitchfork', 'hum strawhat pitchfork_r', { d: 'blue', g: 'brown', j: 'brown' });
S('farmer-woman', 'farmer woman straw hat', 'hum hair_long:a=orange strawhat dress', { d: 'green', j: 'brown' });
S('boy', 'child boy kid', 'kid hair_short+0,3', { d: 'red', g: 'blue' });
S('girl', 'child girl kid', 'kid hair_pony:a=yellow+0,3', { d: 'pink', g: 'purple' });
S('elder', 'elder old man beard cane', 'hum hair_sides:a=white beard_long robe staff_r:p=brown', { d: 'brown', j: 'tan' });
S('granny', 'elder old woman granny', 'hum hair_bun:a=white dress', { d: 'violet', j: 'grey' });
S('blacksmith', 'blacksmith hammer apron', 'hum hair_sides:a=black beard:a=black apron hammer_r', { d: 'skin2', g: 'dark', j: 'dark', s: 'skin2' });
S('chef', 'chef cook white hat', 'hum chefhat apron', { d: 'white', g: 'dark', j: 'dark' });
S('innkeeper', 'innkeeper barkeep with mug', 'hum hair_short:a=orange beard:a=orange apron mug_r', { d: 'maroon', g: 'brown', j: 'brown' });
S('fisherman', 'fisherman fishing rod', 'hum strawhat rod_r', { d: 'yellow', g: 'navy', j: 'dark', s: 'skin3' });
S('miner', 'miner pickaxe helmet', 'hum cap:m=yellow pickaxe_r', { d: 'grey', g: 'navy', j: 'dark' });
S('lumberjack', 'lumberjack woodcutter axe', 'hum hair_short beard cap:m=red axe_r', { d: 'red', g: 'navy', j: 'brown' });
S('priest', 'priest black robe', 'hum hair_sides:a=grey robe book_l:p=brown', { d: 'black', j: 'white' });
S('scholar', 'scholar librarian with book', 'hum hair_bun:a=grey robe book_l:p=blue', { d: 'tan', j: 'brown' });
S('nobleman', 'nobleman rich top hat', 'hum hair_short:a=black tophat', { d: 'violet', g: 'dark', j: 'black' });
S('noblewoman', 'noblewoman lady blue dress', 'hum hair_bun:a=black tiara dress', { d: 'blue', j: 'white' });
S('maid', 'maid servant apron dress', 'hum hair_bun:a=brown dress apron', { d: 'black', j: 'white' });
S('jester', 'jester clown fool', 'hum jesterhat', { d: 'red', g: 'blue', j: 'gold' });
S('beggar', 'beggar poor hooded', 'hum hood:m=brown beard:a=grey robe', { d: 'tan', j: 'brown' });
S('sailor', 'sailor white cap', 'hum hair_short:a=brown cap:m=white', { d: 'white', g: 'blue', j: 'black' });
S('pirate', 'pirate red bandana', 'hum bandana eyepatch beard:a=black dagger_r', { d: 'maroon', g: 'dark', j: 'black', s: 'skin3' });
S('shepherd', 'shepherd with crook staff', 'hum hair_short:a=tan hood:m=cream staff_r:p=brown', { d: 'cream', g: 'brown', j: 'brown' });
S('gravedigger', 'gravedigger with lantern', 'hum hood:m=black lantern_r', { d: 'dark', g: 'black', j: 'dark', s: 'pale' });
S('fortune-teller', 'fortune teller mystic', 'hum hair_long:a=purple bandana:m=gold dress', { d: 'teal', j: 'gold', s: 'skin2' });
S('villager', 'villager man', 'hum hair_short:a=black', { d: 'tan', g: 'green', j: 'brown', s: 'skin2' });
S('florist', 'florist girl with flower', 'hum hair_pony:a=brown flower_r dress', { d: 'lime', j: 'pink' });

category('monsters', 'Monsters', 'char');
S('slime-green', 'green slime blob', 'slime');
S('slime-blue', 'blue slime water blob', 'slime', { a: 'blue' });
S('slime-fire', 'fire slime red with flame', 'slime flame_s+3,-3', { a: 'lava' });
S('slime-ice', 'ice slime frozen spikes', 'slime icespikes+0,-2', { a: 'ice' });
S('slime-poison', 'poison slime purple', 'slime', { a: 'purple' });
S('slime-gold', 'gold slime rare', 'slime', { a: 'gold' });
S('slime-king', 'king slime with crown', 'slime crown_s+3,-2', { a: 'teal' });
S('slime-tiny', 'tiny baby slime pink', 'slime_small', { a: 'pink' });
S('skeleton', 'skeleton undead', 'hum skullhead bones');
S('skeleton-warrior', 'skeleton warrior sword shield', 'hum skullhead bones helm_open:m=copper sword_r shield_l:p=copper');
S('skeleton-archer', 'skeleton archer bow', 'hum skullhead bones hood:m=green bow_r');
S('lich', 'lich skeleton mage necro', 'hum skullhead robe hood:m=purple staff_r:p=lime redeyes', { d: 'purple', j: 'gold', s: 'cream' });
S('zombie', 'zombie undead green', 'hum hair_sides:a=black armsout', { d: 'tan', g: 'navy', j: 'dark', s: 'zombie' });
S('mummy', 'mummy bandages', 'hum wraps redeyes', { d: 'cream', g: 'cream', j: 'cream', s: 'cream' });
S('vampire', 'vampire dracula cape fangs', 'cape:m=maroon hum hair_spiky:a=black fangs', { d: 'black', g: 'black', j: 'red', s: 'pale' });
S('witch', 'evil witch green skin', 'hum hair_long:a=black wizhat:m=black robe broom_r', { d: 'violet', j: 'lime', s: 'gob' });
S('goblin', 'goblin green', 'hum ears fangs', { d: 'brown', g: 'tan', j: 'dark', s: 'gob' });
S('goblin-warrior', 'goblin warrior dagger', 'hum ears fangs helm_open:m=copper dagger_r shield_l:p=brown', { d: 'red', g: 'brown', j: 'dark', s: 'gob' });
S('goblin-archer', 'goblin archer bow', 'hum ears hood:m=brown bow_r', { d: 'brown', g: 'tan', j: 'dark', s: 'gob' });
S('goblin-shaman', 'goblin shaman staff', 'hum ears feathercap:m=red robe staff_r:p=fire', { d: 'purple', j: 'tan', s: 'gob' });
S('orc', 'orc warrior axe', 'hum ears tusks hair_spiky:a=black axe_r', { d: 'brown', g: 'dark', j: 'dark', s: 'orc' });
S('orc-chief', 'orc chief armored', 'cape:m=red hum ears tusks hornhelm:m=dark armor:m=dark mace_r', { d: 'dark', g: 'dark', j: 'red', s: 'orc' });
S('dark-knight', 'dark knight black armor', 'cape:m=violet hum helm_full:m=dark redeyes armor:m=dark sword_r:p=red shield_l:p=dark', { d: 'black', g: 'dark', j: 'black' });
S('cultist', 'cultist hooded red robe', 'hum hood:m=maroon robe redeyes dagger_r', { d: 'maroon', j: 'black', s: 'black' });
S('bandit', 'bandit masked robber', 'hum hair_short:a=black mask:m=red dagger_r', { d: 'brown', g: 'dark', j: 'black', s: 'skin3' });
S('necromancer', 'necromancer scythe', 'hum hood:m=black robe scythe_r', { d: 'black', j: 'purple', s: 'pale' });
S('reaper', 'grim reaper death scythe', 'hum skullhead robe hood:m=black scythe_r', { d: 'black', j: 'dark', s: 'white' });
S('pumpkin-man', 'pumpkin head scarecrow monster', 'hum pumpkinhead', { d: 'violet', g: 'black', j: 'dark', s: 'orange' });
S('demon', 'demon devil horns', 'wings_h hum horns fangs', { d: 'devil', g: 'black', j: 'black', s: 'devil' });
S('bat', 'bat purple', 'bat', {}, { anchor: 'center' });
S('bat-red', 'vampire bat red', 'bat', { a: 'red' }, { anchor: 'center' });
S('ghost', 'ghost white spooky', 'ghost');
S('ghost-blue', 'specter blue ghost', 'ghost', { a: 'ice' });
S('spider', 'spider black', 'spider');
S('spider-red', 'red spider', 'spider', { a: 'red' });
S('flaming-skull', 'flaming skull fire', 'skull+1,5 flame_big');
S('evil-eye', 'evil eye floating eyeball', 'eye');
S('mushroom-monster', 'mushroom monster red', 'shroom');
S('snake', 'snake green', 'snake');
S('rat', 'rat grey', 'rat');
S('dragon', 'dragon green', 'dragon');
S('dragon-red', 'red fire dragon', 'dragon', { a: 'red', d: 'orange' });
S('dragon-blue', 'blue ice dragon', 'dragon', { a: 'blue', d: 'ice' });
S('dragon-black', 'black shadow dragon', 'dragon', { a: 'dark', d: 'purple' });
S('golem', 'stone golem', 'golem');
S('golem-ice', 'ice golem', 'golem', { a: 'ice' });
S('golem-lava', 'lava golem fire', 'golem', { a: 'lava' });
S('mimic', 'mimic chest monster teeth', 'mimic');
S('imp', 'imp red little devil', 'imp');
S('gargoyle', 'gargoyle stone winged', 'imp', { a: 'grey' });
S('ogre', 'ogre big brute', 'brute', { s: 'gob' });
S('troll', 'troll blue big', 'brute', { s: 'teal', d: 'tan' });
S('cyclops', 'cyclops one eye giant', 'brute oneeye', { s: 'skin3', d: 'red' });
S('yeti', 'yeti snow monster', 'brute', { s: 'pale', d: 'pale', j: 'ice' });
S('dire-wolf', 'dire wolf black', 'wolf', { a: 'dark' });
S('wisp-fire', 'fire elemental wisp', 'wisp');
S('wisp-ice', 'ice elemental wisp', 'wisp', { a: 'ice' });
S('scorpion', 'scorpion orange', 'scorpion');
S('jellyfish', 'jellyfish pink', 'jelly');
S('piranha', 'piranha fish teeth', 'piranha');
S('man-eating-plant', 'carnivorous plant man eater', 'plant');
S('worm', 'giant worm pink', 'worm');
S('tentacle', 'tentacle kraken purple', 'tentacle');
S('wasp', 'giant wasp hornet', 'wasp', {}, { anchor: 'center' });
S('robot', 'robot steel', 'robot');
S('treant', 'treant tree monster', 'treant');

category('animals', 'Animals', 'char');
S('cat', 'cat orange', 'cat');
S('cat-black', 'black cat', 'cat', { a: 'dark' });
S('dog', 'dog brown', 'dog');
S('dog-white', 'white dog', 'dog', { a: 'cream' });
S('wolf', 'wolf grey', 'wolf');
S('fox', 'fox orange', 'fox');
S('chicken', 'chicken hen white', 'chicken');
S('chick', 'chick baby chicken yellow', 'chick');
S('cow', 'cow black and white', 'cow');
S('cow-brown', 'brown cow', 'cow', { a: 'tan', d: 'brown' });
S('pig', 'pig pink', 'pig');
S('boar', 'wild boar brown', 'pig', { a: 'brown' });
S('sheep', 'sheep white wool', 'sheep');
S('sheep-black', 'black sheep', 'sheep', { a: 'dark', d: 'black' });
S('goat', 'goat white', 'goat');
S('horse', 'horse brown', 'horse');
S('horse-white', 'white horse', 'horse', { a: 'white', d: 'grey' });
S('rabbit', 'rabbit bunny white', 'rabbit');
S('bird-blue', 'blue bird', 'bird');
S('bird-red', 'red bird cardinal', 'bird', { a: 'red' });
S('bird-yellow', 'yellow bird canary', 'bird', { a: 'yellow' });
S('crow', 'crow raven black bird', 'bird', { a: 'black' });
S('duck', 'duck white', 'duck');
S('frog', 'frog green', 'frog');
S('frog-blue', 'blue poison frog', 'frog', { a: 'blue' });
S('fish', 'fish orange goldfish', 'fish');
S('fish-blue', 'blue fish', 'fish', { a: 'blue' });
S('turtle', 'turtle green', 'turtle', { a: 'forest', d: 'lime' });
S('bear', 'bear brown', 'bear');
S('polar-bear', 'polar bear white', 'bear', { a: 'steel' });
S('deer', 'deer stag antlers', 'deer');
S('owl', 'owl brown', 'owl');
S('butterfly', 'butterfly blue', 'butterfly', {}, { anchor: 'center' });
S('butterfly-orange', 'orange butterfly', 'butterfly', { a: 'orange' }, { anchor: 'center' });
S('bee', 'bee honeybee', 'bee', {}, { anchor: 'center' });
S('crab', 'crab red', 'crab');
S('snail', 'snail', 'snail');
S('penguin', 'penguin', 'penguin');
S('octopus', 'octopus purple', 'octopus');
S('ladybug', 'ladybug red beetle', 'ladybug');
S('mouse', 'mouse grey', 'mouse');
S('squirrel', 'squirrel', 'squirrel');
S('shark', 'shark', 'shark');
S('monkey', 'monkey', 'monkey');

// ═════════════════════════ ART: things ═════════════════════════
art(`
// ── weapons and armour ──
@sword p=steel d=gold
............rr
...........rrq
..........rrq.
.........rrq..
........rrq...
.......rrq....
..e...rrq.....
..ee.rrq......
...eeeq.......
....ee........
...T.ee.......
..T...e.......
.e............

@dagger p=steel d=gold
.......rr
......rrq
.....rrq.
.e..rrq..
.eeeeq...
..Tee....
.T..e....
e........

@axe p=steel
....T.qq..
....Tqrrq.
....Trrrrq
....Tqqqqq
....Tqqqp.
....T.pp..
....T.....
....T.....
....T.....
....T.....
....T.....
....C.....

@battleaxe p=steel
..qq..T..qq..
.qrrq.T.qrrq.
qrrrrqTqrrrrq
qqqqqqTqqqqqq
.qqqp.T.qqqp.
..pp..T..pp..
......T......
......T......
......T......
......T......
......T......
......C......

@hammer p=steel
.qqqqqqqq.
qrrrrrrrrp
qqqqqqqqqp
qqqqqqqqqp
.pppppppp.
....TL....
....TL....
....TL....
....TL....
....TL....
....TL....
....CC....

@mace p=steel
....q.q....
..q.qqq.q..
...qrrqq...
.qqrrqqqpq.
...qqqqp...
..q.ppp.q..
....qTq....
.....T.....
.....T.....
.....T.....
.....T.....
.....C.....

@spear p=steel
..r..
.rrq.
.rrq.
.rqq.
..q..
.RTR.
..T..
..T..
..T..
..T..
..T..
..T..
..T..
..C..

@trident p=gold
q..q..q
r..r..r
q..q..q
q..q..q
qqqqqqq
.pqqqp.
...T...
...T...
...T...
...T...
...T...
...T...
...T...
...C...

@bow
...TTT....
..w..TT...
..w...TT..
..w....T..
..w....TL.
..w....TL.
..w....T..
..w...TT..
..w..TT...
...TTT....

@crossbow
......w......
.....wWw.....
..TTTTwTTTT..
.TxxxxwxxxxT.
T.....T.....T
......T......
......T......
......T......
......C......

@staff p=blue
..qqq.
.qrqqq
.qqqqp
.Tqpp.
..TT..
..T...
..T...
..T...
..T...
..T...
..T...
..T...
..T...
..C...

@wand
.......E...
......EYE..
.....EYYYE.
......EYE..
.....T.E...
....T......
...T.......
..T........
.C.........

@arrow
.........rrr
..........qr
.........T.r
........T...
.......T....
......T.....
.....T......
....T.......
.R.T........
.RR.........
..RR........

@bomb
.......Y..
......O.Y.
.....T....
...VVVV...
..VVVVVV..
.VVWVVVVV.
.VWVVVVVV.
.VVVVVVVV.
.VVVVVVVV.
..VVVVVV..
...VVVV...

@boomerang
.TTTTT...
TLLLLLT..
.TTTLLLT.
....TLLT.
.....TLT.
.....TLT.
.....TLT.
......T..

@club
......TTT.
.....TLLTT
.....TLTTT
....TTTTT.
....TTT...
...TT.....
..TT......
.CT.......
.C........

@scythe p=steel
.qqqqqq...
qrrrrrqT..
.qq...qT..
.......T..
.......T..
.......T..
.......T..
.......T..
.......T..
.......T..
.......T..
.......C..

@pickaxe p=steel
..qqqqqqq..
.qrrrTrrrq.
qq...T...qq
q....T....q
.....T.....
.....T.....
.....T.....
.....T.....
.....T.....
.....C.....

@shovel p=steel
...TTT...
...T.T...
...TTT...
....T....
....T....
....T....
....T....
..qqTqq..
..qrrrq..
..qrrrq..
..qrrrp..
...qqp...

@shield_round p=steel d=brown
...pppppp...
..peeeeeep..
.peeffeeeep.
.pefeeeeeep.
.peeeeYYeep.
.peeeeYYeep.
.peeeeeeeep.
.peeeeeedep.
..peeeedep..
...pppppp...

@shield_kite p=steel d=blue
pppppppppp
peeeeeeeep
peefeeeeep
peeeYYeeep
peeYYYYeep
peeeYYeedp
.peeYYedp.
.peeeeedp.
..peeedp..
...pedp...
....pp....

@helmet p=steel
...qqqqqq...
..qrrqqqqq..
.qrqqqqqqqq.
.qqqqqqqqqp.
.qqKKKqKKKp.
.qqqqpqqqqp.
.qqqqpqqqpp.
..qq.p.qq...

@chestplate p=steel
.qq......qq.
qrqq....qqqp
qqqqqqqqqqqp
.qqrqqqqqqp.
..qrqqqqqp..
..qqqqqqqp..
..qqqYYqqp..
..qqqqqqqp..
..pppppppp..

@boot d=brown
..eeee....
..effe....
..eeee....
..eeee....
..eeee....
..eeeee...
..eeeeeee.
..eeeeeeee
..dddddddd

@gauntlet p=steel
.q.q.q...
.q.q.q.q.
.qqqqq.q.
.qrqqqqq.
.qqqqqqp.
..qqqqp..
..pppp...
..qqqq...

@ring d=red
....ff....
...feee...
....ee....
...YYYY...
..YY..YY..
..Y....Y..
..Y....Y..
..YY..YY..
...YYYY...

@amulet d=teal
.Y......Y.
.Y......Y.
..Y....Y..
...Y..Y...
....YY....
...YffY...
...YeeY...
....YY....

@crown_item
Y...YY...Y
YY.YYYY.YY
YYEYYYYEYY
YRYYBBYYRY
YYYYYYYYYY
OOOOOOOOOO

@wizhat_item m=blue
......nn....
.....nnno...
....nnnno...
....nnnnno..
...nnEnnnn..
...nnnnnnn..
.mmmYYYmmmmm
mmmmmmmmmmmm

// ── items ──
@potion a=red
....TT....
...wWWw...
....WA....
....WA....
...WAAA...
..WbbbbA..
.WbcbbbbA.
.WbcbbbbA.
.Wbbbbbba.
..abbbba..
...aaaa...

@vial a=red
..TT..
.wWWw.
.WAAA.
.bbbb.
.bcbb.
.bcbb.
.bbbb.
.bbbb.
.abba.
..aa..

@flask a=orange
....TT....
....WA....
....WA....
...WAAA...
...WAAA...
..WbbbbA..
..bbcbbb..
.bbcbbbbb.
.bcbbbbbb.
bbbbbbbbba
aaaaaaaaaa

@skull_label y=6 x=3
.WW.
WKWK
.WW.

@gem_diamond a=ice
..cccccc..
.cWccbbbb.
cWccbbbbba
.cccbbbba.
..ccbbba..
...cbba...
....ba....

@gem_cut a=green
.cccccc.
cWcccbbb
cccbbbbb
cccbbbba
ccbbbbba
ccbbbbaa
cbbbbbaa
.bbaaaa.

@gem_round a=orange
..cccc..
.cWccbb.
cWccbbbb
ccccbbbb
ccbbbbba
cbbbbbba
.bbbbaa.
..baaa..

@crystal a=blue
.....c....
....cWb...
....ccb...
.c..ccb...
cWb.ccb.c.
ccb.ccbcWb
ccb.ccbccb
ccbcccbccb
cbbccbbcbb
.bbbbbbbb.

@key a=gold
..bbbb....
.bc..bb...
.b....b...
.bb..bb...
..bbbb....
...bb.....
...bb.....
...bb.....
...bbbb...
...bb.....
...bbbb...

@key_boss a=gold
.bb..bb.
bcbbbbbb
bb.bb.bb
bbbbbbbb
.bbRRbb.
...bb...
...bb...
...bb...
...bbbb.
...bb...
...bbbb.
...bbb..

@coin a=gold
..cccc..
.cbbbba.
cbbccbba
cbcbbaba
cbcbbaba
cbbaabba
.abbbba.
..aaaa..

@coins a=gold
..cccccc..
.cbbbbbba.
.abbbbbba.
.caaaaaac.
.cbbbbbba.
.abbbbbba.
.caaaaaac.
.cbbbbbba.
.abbbbbba.
..aaaaaa..

@moneybag
....TT.TT...
.....TTT....
....LYYL....
...LLLLLL...
..LLELLLLL..
.LLELYYLLLL.
.LLLYLLLLLT.
.LLLLYYLLLT.
.LLLLLLYLLT.
.LLLLYYLLTT.
..LTTTTTTT..

@scroll
.EEEEEEEEE..
ELEEEEEEEEL.
.LEEEEEEEE..
..ELLLLLEE..
..EEEEEEEE..
..ELLLLEEE..
..EEEEEEEE..
..ELLLLLEE..
.EEEEEEEEE..
ELEEEEEEEEL.
.LLLLLLLLL..

@book a=red
.bbbbbbbbb.
bbccbbbbbba
bbcbbbbbbba
bbbbYYYbbba
bbbbYYYbbba
bbbbbbbbbba
bbbbbbbbbba
bbbbbbbbbba
bWWWWWWWWWa
.aaaaaaaaaa

@map
.EEEE..EEEE.
EEEEEEEEEEEE
EEGGEEELEEEE
EGGGELLEERER
EEGELEEEEERE
EEEELEEEERER
EEBEELLEEEEE
EBBBEEELEEEE
EEEEEEEEEEEE
.EEEE..EEEE.

@letter
WWWWWWWWWWWW
WwWWWWWWWWwW
WWwwWWWWwwWW
WWWWwwwwWWWW
WWWWWRRWWWWW
WWWWWRRWWWWW
WWWWWWWWWWWW
wwwwwwwwwwww

@bone
.WW......WW.
WWWW....WWWW
.WWWWWWWWWW.
WWWWwwwwWWWW
.Ww......wW.

@bell
.....OO.....
....YYYY....
...YEYYYY...
...YEYYYY...
..YEYYYYYY..
..YEYYYYYO..
.YYYYYYYYYO.
.OOOOOOOOOO.
.....OO.....

@compass
...YYYYYY...
..YWWWWWWY..
.YWWWRWWWWY.
.YWWWRRWWWY.
.YWWWKKWWWO.
.YWWWWKWWWO.
.YWWWWWWWWO.
..YWWWWWWO..
...OOOOOO...

@hourglass
TTTTTTTT
.WAAAAW.
.WEEEEW.
..WEEW..
...WW...
..WAEW..
.WAEEAW.
.WEEEEW.
TTTTTTTT

@torch
...R...
..ROR..
.ROYOR.
.ROYOR.
..OYO..
..TTT..
..xTx..
...T...
...T...
...T...
...C...

@candle
...O...
..OYO..
..OYO..
...K...
..WWW..
..WWw..
..WWw..
..WWw..
.YYYYY.
OOOOOOO

@lantern
...xx...
..x..x..
.xxxxxx.
.xEYYEx.
.xYOOYx.
.xYOOYx.
.xEYYEx.
.xxxxxx.
..XXXX..

@feather
........WW
......WWWw
....WWWWw.
...WWWww..
..WWWwW...
.WWwwW....
.Www......
.x........
x.........

@orb a=purple
..cccc..
.cWccbb.
cWccbbbb
ccccbbbb
ccbbbbba
.bbbbaa.
..TTTT..
.TLLLLT.

@backpack
...TTTT...
..T....T..
.LLLLLLLL.
LLLLLLLLLL
LTTTTTTTTL
LLLLYYLLLL
LLLLLLLLLL
LLLLLLLLLT
.LLLLLLLT.

@ingot a=gold
...ccccccc
..cbbbbbba
.cbbbbbbaa
cccccccaa.
bbbbbbbaa.
aaaaaaaa..

@dice
.WWWWWWWW.
WWWWWWWWWw
WWKWWWKWWw
WWWWWWWWWw
WWWWKWWWWw
WWWWWWWWWw
WWKWWWKWWw
WWWWWWWWWw
.wwwwwwww.

@trophy
.YYYYYYYY.
YYEYYYYYYY
Y.YEYYYY.Y
YYYEYYYYYY
..YYYYYY..
...YYYY...
....OO....
....OO....
..TTTTTT..
..CCCCCC..

@rope
..LLLLLL..
.LTTTTTTL.
LTLLLLLLTL
LTL....LTL
LTL....LTL
LTLLLLLLTL
.LTTTTTTL.
..LLLLLL.L
.........L
........L.

// ── food ──
@apple a=red
.....T....
....T.GG..
..bb.bGb..
.bcbbbbbb.
bcbbbbbbbb
bcbbbbbbbb
bbbbbbbbba
bbbbbbbbba
.bbbbbbaa.
..bb.aa...

@bread
..LLLLLLLL..
.LEELELELLL.
LLELELELLLLT
LLLLLLLLLLTT
.TTTTTTTTTT.

@cheese
......YYYY
...YYYYEEY
YYYEEEEYYY
YYYYYYYYYY
YOYYYYOOYY
YYYYOYOOYY
YYOYYYYYYY

@meat a=copper
....bbbb....
..bbbcbbb...
.bbccbbbbb..
.bcbbbbbbb..
.bbbbbbbba..
..bbbbbbaa..
...aaaaaWW..
........WWW.
.........WWW
.........W.W

@cake
.....R......
....WWW.....
.WWWWWWWWW..
WWWzWWWzWWW.
MMMMMMMMMMM.
LLLLLLLLLLL.
WWWWWWWWWWW.
LLLLLLLLLLL.
LLLLLLLLLLL.

@pie
...LLLLLL...
.LLELLELLLL.
LLELLELLELLL
TLTLTLTLTLTL
.xxxxxxxxxx.

@carrot
.......G.G
......GGG.
.....OOG..
....OFOO..
...OFOO...
..OOOO....
.OOOD.....
.OD.......
D.........

@egg
..EEEE..
.EWEEEE.
EWEEEEEE
EWEEEEEL
EEEEEEEL
EEEEEELL
.EEELLL.
..LLLL..

@cherry
.....GG...
....T.GG..
...T.T....
..T...T...
.RR...RR..
RIRR.RIRR.
RRRR.RRRR.
.RR...RR..

@grapes a=purple
....T.G...
....TGG...
..bbbbbb..
.bcbbcbbb.
.bbbbbbbb.
..bcbbcb..
..bbbbbb..
...bcbb...
...bbbb...
....bb....

@pumpkin
.....GG.....
....GG......
..OOOOOOOO..
.OFOOFOODOO.
OFOOFOOODOOD
OFOOFOOODOOD
OFOOFOOODOOD
.OOOFOODOOD.
..OOOOOOOD..

@melon
WGGGGGGGGGGW
GWRRRRRRRRWG
.GWRKRRKRWG.
..GWRRRRWG..
...GWWWWG...
....GGGG....

@cookie
..LLLL..
.LLCLLL.
LLLLLCLL
LCLLLLLL
LLLCLLCL
LLLLLLLL
.LCLLLL.
..LLLL..

@mug
.WWWWWW...
WWWWWWWW..
.OOOOOOxx.
.OFOOOOx.x
.OFOOOOx.x
.OFOOOOxx.
.OOOOOO...
.xxxxxx...

@wine
...TT...
...NN...
...NN...
..NNNN..
..NHNN..
..WWWW..
..WRRW..
..WWWW..
..NHNN..
..NNNN..

@stew
....w...w...
.....w...w..
.bbbbbbbbbb.
bbOOFOOGOObb
bbbbbbbbbbba
.bbbbbbbbba.
..bbbbbbaa..
...aaaaaa...

@banana
.........T
........YY
.......YYY
......YYYO
.....YEYO.
...YYEYYO.
YYYYYYYO..
.OOOOOO...

@corn
...YY.....
..YEYY....
..YYEY....
.GYEYYG...
.GYYEYG...
.GGYYGG...
..GGGG....
...GG.....

@candy
M.........M
MM..RRR..MM
MMMRzRRRMMM
MM.RRRzR.MM
M...RRR...M

@donut
..MMMMMM..
.MzMMMMMM.
MMMMMMMWMM
MMWM..MMMM
MMMM..MMYM
LMMMMMMMML
.LLLLLLLL.
..LLLLLL..

@pizza
LLLLLLLLLLL
.YYRRYYYYY.
.YYRRYYRY..
..YYYYYRY..
..YYRYYY...
...YYYY....
...YYRY....
....YY.....
....Y......

@icecream
..MMMM..
.MzMMMM.
.MMMMMM.
.WWWWWW.
.LTLTLT.
..LTLT..
..TLTL..
...LT...
...TL...
....L...

@strawberry
..GG.GG.
.GGGGGG.
.RRGGRR.
RRIRRRRR
RRRRERRR
REIRRRRR
.RRRRER.
.RERRRR.
..RRRR..
...RR...

@mushroom a=red
...bbbb...
.bbWbbbbb.
bbbbbbWWbb
bWWbbbbbbb
aaaaaaaaaa
...EEEE...
...EEEL...
..EEEELL..

@cookedfish
...LLLL.....
.LLLLLLL..L.
LLKLLTLLLLLL
LLLLTTLLLLLL
.LLLLLLL..L.
xxxxxxxxxxxx
.xxxxxxxxxx.

// ── containers, furniture, props ──
@chest a=brown d=gold
.bbbbbbbbbbbb.
bccccccccccccb
bbbbbbbbbbbbbb
ebbbbbeebbbbbe
eeeeeeYYeeeeee
ebbbbbYYbbbbbe
ebbbbbbbbbbbbe
ebbbbbbbbbbbbe
eaaaaaaaaaaaae

@chest_open a=brown d=gold
.bbbbbbbbbbbb.
bVVVVVVVVVVVVb
bVVVVVVVVVVVVb
ebbbbbbbbbbbbe
YEYYEYYYYEYYEY
eYYYYYEYYYYYYe
eeeeeeYYeeeeee
ebbbbbYYbbbbbe
ebbbbbbbbbbbbe
eaaaaaaaaaaaae

@chest_empty a=brown d=gold
.bbbbbbbbbbbb.
bVVVVVVVVVVVVb
bVVVVVVVVVVVVb
ebbbbbbbbbbbbe
eVVVVVVVVVVVVe
eVVVVVVVVVVVVe
eeeeeeYYeeeeee
ebbbbbYYbbbbbe
ebbbbbbbbbbbbe
eaaaaaaaaaaaae

@barrel a=brown
..bbbbbbbb..
.bcbbbbbbbb.
xxxxxxxxxxxx
bcbbabbabbab
bcbbabbabbab
bcbbabbabbab
bcbbabbabbab
xxxxxxxxxxxx
bbbbabbabbab
.bbbabbabba.
..aaaaaaaa..

@crate a=brown
bbbbbbbbbbbb
bccccccccccb
bcabbbbbbacb
bcbabbbbabcb
bcbbabbabbcb
bcbbbaabbbcb
bcbbbaabbbcb
bcbbabbabbcb
bcbabbbbabcb
bcabbbbbbacb
bccccccccccb
baaaaaaaaaab

@pot a=copper
...bbbbbb...
...aaaaaa...
....bbbb....
..bbcbbbbb..
.bbcbbbbbbb.
.bcbbbbbbbb.
.bcbbbbbbba.
.bbbbbbbbba.
..bbbbbbaa..
...aaaaaa...

@pot_broken a=copper
.b..........
.bb...b...b.
.bcb.bbb.bb.
.bcbbbbbbba.
.bbbbbbbbba.
..bbbbbbaa.b
bb.aaaaaa.ba

@sack
....LL.LL...
.....TTT....
....LLLL....
..LLLLLLLL..
.LLELLLLLLL.
.LELLLLLLLT.
.LLLLLLLLLT.
.LLLLLLLLTT.
..LTTTTTTT..

@bucket a=brown
...xxxxxx...
..x......x..
.bVVVVVVVVb.
.bbbbbbbbbb.
.bcbbbbbbba.
..xxxxxxxx..
..bcbbbbba..
..bcbbbbba..
...bbbbba...
...xxxxxx...

@water_in y=2 x=2
AAWAAAAA

@table a=brown
bbbbbbbbbbbbbb
bccccccccccccb
aaaaaaaaaaaaaa
.bb........bb.
.bb........bb.
.bb........bb.
.bb........bb.
.aa........aa.

@chair a=brown
.bb.......
.bc.......
.bc.......
.bc.......
.bc.......
.bbbbbbbb.
.bccccccb.
.aaaaaaaa.
.bb....bb.
.bb....bb.
.aa....aa.

@stool a=brown
.bbbbbbbb.
bccccccccb
.aaaaaaaa.
..b....b..
..b....b..
.bb....bb.

@bed a=brown p=red
bb............
bbWWW.........
bbWWWWqqqqqqqb
bbWWWqrqqqqqqb
bbqqqqqqqqqqqb
bbppppppppppab
bbbbbbbbbbbbbb
aa..........aa

@bookshelf a=brown
bbbbbbbbbbbb
bRRBGGYPPRBb
bRRBGGYPPRBb
bRRBGGYPPRBb
bbbbbbbbbbbb
bGYYRBBGRPPb
bGYYRBBGRPPb
bGYYRBBGRPPb
bbbbbbbbbbbb
bBPRRGYYBGRb
bBPRRGYYBGRb
bBPRRGYYBGRb
bbbbbbbbbbbb
aa........aa

@cupboard a=brown
bbbbbbbbbbbb
bccccccccccb
bbbbbbbbbbbb
bccccbbccccb
bcccYbbYcccb
bccccbbccccb
bbbbbbbbbbbb
bccccYYccccb
bccccccccccb
bbbbbbbbbbbb
aa........aa

@throne
..Y.YYYY.Y..
..YYYYYYYY..
..YRRRRRRY..
..YRRIRRRY..
..YRRRRRRY..
..YRRRRRRY..
.YYRRRRRRYY.
.YYYYYYYYYY.
.YYRRRRRRYY.
.YOOOOOOOOY.
.YY......YY.
.OO......OO.

@campfire
.....R......
....RO.R....
...ROOROR...
...ROYOOR...
..ROYYYOR...
..ROYEYOR...
.TTLTTTLTT..
TTLLTTTLLTT.

@cauldron a=green
..b..c...b..
.....b......
.VVVVVVVVVV.
VVbbcbbbbbVV
.VVVVVVVVVV.
.VXVVVVVVVV.
.VXVVVVVVVV.
.VVXVVVVVVV.
..VVVVVVVV..
.VV.VVVV.VV.

@anvil
XxxxxxxxxxX.
.XXxxxxxxXXX
..XXXXXXXX..
....XXXX....
....XXXX....
...XXXXXX...
..XXXXXXXX..
..VVVVVVVV..

@clock a=brown
..bbbbbb..
.bWWWWWWb.
bWWWKWWWWb
bWWWKWWWWb
bWWWKKKWWb
bWWWWWWWWb
.bWWWWWWb.
..bbbbbb..
..bVVVVb..
..bVYYVb..
..bVYYVb..
..bVVVVb..
..bbbbbb..
.aaaaaaaa.

@painting
YYYYYYYYYYYY
YAAAAAAAEEAY
YAAAAAAAEEAY
YAAGAAAAAAAY
YAGGGAAGAAAY
YGGGGGGGGGGY
OOOOOOOOOOOO

@banner a=red
TTTTTTTTTT
.bbbbbbbb.
.bcbbbbbb.
.bbbYYbbb.
.bbYYYYbb.
.bbbYYbbb.
.bbbbbbbb.
.bbbbbbba.
.bbb..bba.
.bb....ba.

@statue
....xxxx....
...xwwxxx...
...xwxxxx...
....xxxx....
..xxxxxxxx..
.xxwxxxxxxx.
.x.xwxxxx.x.
.x.xxxxxx.x.
...xxxxxx...
...xx..xx...
..XXXXXXXX..
.XXxxxxxxXX.
.XXXXXXXXXX.

@gravestone
...xxxxxx...
..xwxxxxxx..
.xwxxxxxxxx.
.xxxXXXXxxx.
.xxxxxxxxxx.
.xxXXXXXXxx.
.xxxxxxxxxx.
.xxxXXXXxxX.
.xxxxxxxxxX.
GGxxxxxxxXGG

@gravecross
....TT....
....TL....
.TTTTLTTT.
.TLLLLLLT.
....TL....
....TL....
....TL....
....TL....
..GGTLGG..

@coffin a=brown
...bbbbbb...
..bccccccb..
.bcbbbbbbcb.
bcbbbYYbbbcb
bcbbYYYYbbcb
.bcbbYYbbcb.
.bcbbYYbbcb.
..bcbbbbcb..
..bcbbbbcb..
..bccccccb..
...aaaaaa...

@signpost a=brown
.bbbbbbbbbb.
bccccccccccb
bcaaacaaaacb
bccccccccccb
bcaaaaacaccb
bccccccccccb
.aaaaaaaaaa.
.....bb.....
.....bb.....
.....bb.....
.....ab.....

@sign_arrow a=brown
.bbbbbbbb...
bccccccccb..
bcaaaaaaccb.
bccccccccb..
.aaaaaaaa...
....bb......
....bb......
....bb......
....bb......
....ab......

@lever
.R..........
.RR.........
..xx........
...xx.......
....xx......
.....xx.....
..XXXXXXXX..
.XxxxxxxxxX.
.XXXXXXXXXX.

@button a=red
...bbbbbb...
..bcbbbbbb..
..bbbbbbba..
.xxxxxxxxxx.
XXXXXXXXXXXX

@button_down a=red
..bbbbbbbb..
.xxxxxxxxxx.
XXXXXXXXXXXX

@door a=brown
...bbbbbb...
..bcbbabcb..
.bbcbbabcbb.
.bbcbbabcbb.
.bbcbbabcbb.
.xxxxxxxxxx.
.bbcbbabcbb.
.bbcbbabcYb.
.bbcbbabcYb.
.bbcbbabcbb.
.xxxxxxxxxx.
.bbcbbabcbb.
.bbcbbabcbb.
.bbcbbabcbb.

@door_open a=brown
...bbbbbb...
..bVVVVVVb..
.bVVVVVVVVb.
.bVVVVVVVbb.
.bVVVVVVbcb.
.bVVVVVVbcb.
.bVVVVVVbcb.
.bVVVVVVbcb.
.bVVVVVVYcb.
.bVVVVVVbcb.
.bVVVVVVbcb.
.bVVVVVVbcb.
.bVVVVVVbcb.
.bVVVVVVbbb.

@padlock y=6 x=4
.YY.
Y..Y
YYYY
YKKY
YYYY

@portcullis
xxxxxxxxxxxxxx
xVxVVxVVxVVxVx
xxxxxxxxxxxxxx
xVxVVxVVxVVxVx
xVxVVxVVxVVxVx
xxxxxxxxxxxxxx
xVxVVxVVxVVxVx
xVxVVxVVxVVxVx
xxxxxxxxxxxxxx
xVxVVxVVxVVxVx
xVxVVxVVxVVxVx
x.x..x..x..x.x

@stairs
..........xx
..........wx
.......xxxxx
.......wwwxx
....xxxxxxxx
....wwwwwwxx
.xxxxxxxxxxx
.wwwwwwwwwxx
xXXXXXXXXXXX

@lamppost
..xxxx..
.xEYYEx.
.xYOOYx.
.xEYYEx.
..xxxx..
...XX...
...XX...
...XX...
...XX...
...XX...
...XX...
...XX...
..XXXX..

@cage
....xxxx....
...x....x...
.xxxxxxxxxx.
.wVwVVwVVwX.
.wVwVVwVVwX.
.wVwVVwVVwX.
.wVwVVwVVwX.
.wVwVVwVVwX.
.xxxxxxxxxx.

@fountain
.....AA.....
....AWWA....
...A.AA.A...
..A.xxxx.A..
....xwxx....
.xxxxxxxxxx.
xAAWAAAAWAAx
xxxxxxxxxxxx
.XXXXXXXXXX.

@flag a=red
x.........
xbbbbbb...
xbcbbbbbb.
xbbbbbbbbb
xbbbbbbbb.
xbbbbbb...
x.........
x.........
x.........
x.........
x.........
X.........

@mirror
..YYYYYY..
.YAAAAAAY.
YAWAAAAAAY
YAAWAAAAAY
YAAAAAAAAY
YAAAAAWAAY
YAAAAAAWAY
.YAAAAAAY.
..YYYYYY..
....OO....
..OOOOOO..

// ── nature ──
@tree a=green d=brown
......bbbbbb......
....bbbccbbbbb....
...bbccccbbbbbb...
..bbccbbbbbbcbbb..
.bbcbbbbbbbccbbbb.
.bbbbbbbcbbbbbbbb.
bbbbbccbbbbbbbbbab
bbbbccbbbbbbcbbbab
bbbbbbbbbbbccbbaab
.bbbbbbbbbbbbbaab.
.abbbbbabbbbbaaab.
..aabbaaabbaaaaa..
...aaaaaaaaaaaa...
......aeeeda......
.......eeed.......
.......efed.......
.......eeed.......
.......efed.......
......eeeedd......
.....eeeeeddd.....

@fruit y=3 x=3
..R......R..
.....R......
R.......R...
...R.......R
......R.....
.R.......R..

@pine a=forest d=brown
.......bb.......
......bbbb......
......bcbb......
.....bbcbbb.....
....bbccbbbb....
...abbbbbbbba...
.....bbcbbb.....
....bbccbbbb....
...bbccbbbbbb...
..abbbbbbbbbba..
....bbccbbbb....
...bbccbbbbbb...
..bbccbbbbbbbb..
.bbcbbbbbbbbbbb.
abbbbbbbbbbbbbba
.aaaaaaeeaaaaaa.
.......ee.......
.......ed.......
......eedd......

@snowcap
.......WW.......
......WWWW......
......WWW.......
.....WW.........
................
................
.....WWW........
....WWW.........
...WW...........
................
....WWW.........
...WWW..........
..WWW...........
.WW.............

@palm a=green d=brown
..bbbb....bbbb....
.bccbbb..bbccbb...
bcb..bbbbbb..bbb..
b...bbbccbbb...b..
...bbccbbbcbb.....
..bbcb.ee.bcbb....
..bb...ed..bbb....
..b....ee...bb....
.......ed...b.....
......ee..........
......ed..........
......ee..........
.....eed..........
.....ee...........
.....ed...........
....eeed..........

@deadtree d=brown
..e.....e....e
..ee...ee...e.
...e...e...ee.
e..ee.ee..ee..
ee..eeee.ee...
.ee..eeeee....
..eeeeede.....
....eeed......
....eeed......
....eeed......
....eeed......
...eeeedd.....
..eeeeeddd....

@bush a=green
....bbbb....
..bbbccbbb..
.bbccbbbbbb.
bbcbbbbbcbbb
bbbbbbbbbbab
abbbabbbbaab
.aaaaaaaaaa.

@berries y=1 x=2
..R....R
.....R..
R..R....
......R.

@rock a=grey
....bbbb....
..bbcccbbb..
.bccbbbbbbb.
bccbbbbbabbb
bcbbbbbbbaab
bbbbabbbbbab
.aaaaaaaaaa.

@moss
....GGGG....
..GGHGGGG...
.GHGG..G....
GGG.........

@rock_small a=grey
..bbbb..
.bccbbb.
bcbbbbab
.aaaaaa.

@flower a=red
...bb....
.bbccbb..
.bcYYcb..
.bbccbb..
...bb....
....G....
..G.G....
..GGG.GG.
...GGGG..
....G....

@tulip a=pink
.b.b.b.
.bcbcb.
.bbbbb.
..bbb..
...G...
.G.G...
.GGG.G.
..GGGG.
...G...

@sunflower
...YYYY...
.YYYYYYYY.
.YYTTTTYY.
YYTCTTCTYY
YYTTCTTTYY
.YYTTTTYY.
.YYYYYYYY.
...YGGY...
....GG.G..
..G.GGGG..
..GGGG....
....GG....
....GG....

@grasstuft a=green
..b...b...b.
.bb..bb..bb.
.bcb.bcb.bc.
.bcbbbcbbbcb
abcbabcbabcb

@cactus a=green
....bbb.....
....bcb.....
....bcb..bb.
.bb.bcb..bb.
.bb.bcb..bb.
.bb.bcbbbbb.
.bbbbcbbbb..
..bbbcb.....
....bcb.....
....bcb.....
....bcb.....
....bba.....

@stump
..LLLLLLLL..
.LLELLLELLL.
.LELLTLLELL.
.TLLLLLLLLT.
.TTTTTTTTTT.
.TTCTTTTCTT.
.TTCTTTTCTT.
TTTCTTTTTTTT
T.TT.TTT.TTT

@log
.TTTTTTTTTT...
TTTTTTTTTTLLL.
TTCCTTTCTLELL.
TTTTTTTTTLLEL.
TCTTTCCTTLLLL.
.TTTTTTTTTLL..

@lilypad
....zz....
...zWMz...
..GGzzGGG.
.GHGGG.GGG
GHGGGGGGGG
GGGGGGGGGG
.NNNNNNNN.

@stalagmite a=grey
.....b....
....bcb...
....bcb...
...bbcb...
...bcbba..
..bbcbba.b
..bcbbbabc
.bbcbbbabb
.bcbbbbaba

@snowman
....VVVV....
...VVVVVV...
...WWWWWW...
..WWKWWKWW..
..WWWOOWWW..
...WWWWWW...
..RRRRRRRR..
.WWWWKWWWWW.
TWWWWWWWWWWT
.WWWWKWWWWw.
.WWWWWWWWww.
..WWWWWWww..

@haybale
.YYYYYYYYYY.
YEYYEYYYEYYY
YYYYYYYEYYYO
TTTTTTTTTTTT
YYEYYYYYYEYO
YYYYEYYYYYYO
TTTTTTTTTTTT
YEYYYYEYYYYO
.OOOOOOOOOO.

@fence a=brown
.bb......bb.
.bc......bc.
bbbbbbbbbbbb
bccccccccccb
.bc......bc.
bbbbbbbbbbbb
baaaaaaaaaab
.bc......bc.
.ba......ba.

@wheat
.Y...Y...Y.
YEY.YEY.YEY
YEY.YEY.YEY
.Y...Y...Y.
.O...O...O.
.O.G.O.G.O.
.OG..OG..O.
.O...O...O.

@coral a=pink
.b...b..b.
.bb.bb..b.
..b.b..bb.
..bbb.bb..
b..bcbb..b
bb.bcb..bb
.bbbcbbbb.
...bcb....
..aaaaa...

@shell
...zzzz...
..zWzWzz..
.zWzWzWzz.
zWzWzWzWzM
zWzWzWzWzM
.MzzzzzzM.
...MMMM...

@starfish
....O....
...OFO...
OOOOFOOOO
.OFFFFFO.
..OFFFO..
..OFOFO..
.OFO.OFO.
.OO...OO.

@cloud
....WWWW......
..WWWWWWWWW...
.WWWWWWWWWWWW.
WWWWWWWWWWWWWW
WWWWWWWWWWWWww
.wwwwwwwwwwww.

@scarecrow_pole y=7
TTTT......TTTT
..............
..............
..............
......TT......
......TT......
......TT......

// ── buildings and vehicles (hand-drawn ones) ──
@well
.TTTTTTTTTT.
TLLLLLLLLLLT
.T........T.
.T...xx...T.
.T...xx...T.
.T..TTTT..T.
.xxxxxxxxxx.
xwxxxwxxxwxx
xxxwxxxwxxxx
xwxxxwxxxwxx
.XXXXXXXXXX.

@tent a=red
......Rb......
......bb......
.....bbcb.....
....bbbccb....
...bbbVVccb...
..bbbVVVVccb..
.bbbbVVVVbccb.
bbbbVVVVVVbccb
aaaaVVVVVVaaaa

@stall a=brown
RWWRRWWRRWWRRW
RWWRRWWRRWWRRW
.RW.RW..RW.RW.
.T..........T.
.T..........T.
.TROYGROYGROT.
bbbbbbbbbbbbbb
bccccccccccccb
baaaaaaaaaaaab

@mine
..xxxxxxxxxx..
.xxwxxxxxxxxx.
xxTTTTTTTTTTxx
xwTVVVVVVVVTxx
xxTVVVVVVVVTxx
xxTVVVVVVVVTwx
xxTVVVVVVVVTxx
xXTVVVVVVVVTxX

@bridge
T............T
TT..........TT
TTTTTTTTTTTTTT
LLTLLTLLTLLTLL
TTTTTTTTTTTTTT
.x..........x.

@pillar
.wwwwwwww.
wWwwwwwwwx
.xwwwwwwx.
..wWwwxx..
..wWwwxx..
..wWwwxx..
..wWwwxx..
..wWwwxx..
..wWwwxx..
..wWwwxx..
.wwwwwwww.
wWwwwwwwxx
XXXXXXXXXX

@pillar_broken
...w......
..wW..x...
..wWw.xx..
..wWwwxx..
..wWwwxx..
..wWwwxx..
.wwwwwwww.
wWwwwwwwxx
XXXXXXXXXX

@cart a=brown
bbbbbbbbbbbbb...
bcbbcbbcbbcba...
bcbbcbbcbbcbabb.
bbbbbbbbbbbbb..b
.aaaaaaaaaaa....
..VVV...VVV.....
.VVxVV.VVxVV....
.VxxxV.VxxxV....
.VVxVV.VVxVV....
..VVV...VVV.....

@minecart
x............x
xxxxxxxxxxxxxx
.xwxxxxxxxxxX.
.xwxxxxxxxxxX.
.xxxxxxxxxxXX.
..XXXXXXXXXX..
..VVV....VVV..
..VxV....VxV..
..VVV....VVV..

@load a=gold
....bb...bb...
..bbcbbbbcbb..
.bcbbbcbbbbbb.

@rowboat a=brown
b............b
bb..........bb
bcbbbbbbbbbbba
.bccccccccbba.
..aaaaaaaaaa..

@sailboat a=brown p=white
......T.......
......Tqq.....
......Tqqq....
......Tqqqq...
......Tqqqqq..
......Tqqqqqp.
......Tqqqppp.
......T.......
bbbbbbbbbbbbbb
.bcccccccccba.
..bbbbbbbbba..
...aaaaaaaa...

@ship a=brown p=white
..........T...........
.........RT...........
..........T...........
....qqqqqqTqqqqq......
....qqqqqqTqqqqqq.....
...qqqqqqqTqqqqqq.....
...qqqqqqqTqqqqqqq....
...qqqqqqqTqqqqqqq....
....ppppppTpppppp.....
..........T...........
b.........T........bbb
bb........T.......bbcb
bbbbbbbbbbbbbbbbbbbbbb
.bcYccYccYccYccYccbba.
.bbbbbbbbbbbbbbbbbba..
..bbbbbbbbbbbbbbbbaa..
...aaaaaaaaaaaaaaa....

@jolly y=5 x=7
V.V
.V.

@wagon a=brown
...WWWWWWWW...
..WWWWWWWWWW..
.WWwWWwWWwWWW.
.WWwWWwWWwWWW.
.WWwWWwWWwWWW.
bbbbbbbbbbbbbb
baaaaaaaaaaaab
..VVV....VVV..
.VVxVV..VVxVV.
.VVxVV..VVxVV.
..VVV....VVV..

@raft
......T.......
......TRR.....
......TR......
......T.......
LLLLLLLLLLLLLL
LTLLTLLTLLTLLT
TTTTTTTTTTTTTT

@balloon a=red d=yellow
....bbbbbb....
..bbcbbebbbb..
.bbcbbeebbbbb.
.bcbbbeebbbbb.
.bcbbbeebbbba.
.bbbbbeebbbba.
..bbbbeebbba..
...bbbeebba...
....x....x....
.....x..x.....
.....LLLL.....
.....LTTL.....
.....TTTT.....
`);

// ═════════════════════════ routines: buildings ═════════════════════════
const BUILD = { size: 32, o: true, anchor: 'bottom' };
/** shaded wall block with a few brick marks */
function wall(c, x, y, w, h, r) {
  const [d, m, l] = ramp(r);
  c.rect(x, y, w, h, m).rect(x + w - 2, y, 2, h, d).rect(x, y, 1, h, l);
  for (let j = y + 2; j < y + h - 1; j += 3) for (let i = x + 2 + ((j / 3) & 1) * 3; i < x + w - 4; i += 6) c.h(i, j, 2, d);
}
/** pitched roof: rows from top width tw to bottom width bw, centred on cx */
function roof(c, cx, y, h, tw, bw, r) {
  const [d, m, l] = ramp(r);
  for (let j = 0; j < h; j++) {
    const w = Math.round(tw + (bw - tw) * j / (h - 1)), x = Math.round(cx - w / 2);
    c.h(x, y + j, w, j % 3 === 2 ? d : m).px(x, y + j, l).px(x + 1, y + j, l).px(x + w - 1, y + j, d);
  }
}
function door(c, x, y, w = 4, h = 7) { c.rect(x, y, w, h, 't2').rect(x, y, 1, h, 't3').h(x, y, w, 't1').px(x + w - 2, y + (h >> 1), 'y2'); }
function win(c, x, y, lit) { c.rect(x, y, 4, 4, 't1').rect(x + 1, y + 1, 2, 2, lit ? 'y2' : 'b3').px(x + 1, y + 1, lit ? 'y3' : 'w0'); }
function house(c, o) {
  const top = o.tall ? 13 : 17;
  wall(c, 5, top, 22, 31 - top, o.wall || 'cream');
  if (o.chimney) c.rect(20, 4, 3, 6, 'g2').rect(22, 4, 1, 6, 'g3').h(19, 3, 5, 'g3');
  roof(c, 16, o.tall ? 3 : 7, 11, o.flat ? 22 : 8, 28, o.roof || 'red');
  door(c, 14, 24, 4, 7);
  win(c, 7, o.tall ? 15 : 20, o.lit); win(c, 21, o.tall ? 15 : 20, o.lit);
  if (o.tall) { win(c, 7, 23, o.lit); win(c, 21, 23, o.lit); }
  if (o.sign) { c.rect(12, 18, 8, 4, 't3').rect(12, 21, 8, 1, 't2'); c.stamp(13, 19, o.sign); }
  if (o.timber) { c.v(12, top, 31 - top, 't2').v(19, top, 31 - top, 't2').h(5, top + 6, 22, 't2'); door(c, 14, 24, 4, 7); }
}
function tower(c, o) {
  const [d, m, l] = ramp(o.wall || 'grey');
  wall(c, 10, 10, 12, 21, o.wall || 'grey');
  if (o.cone) roof(c, 16, 1, 10, 2, 16, o.cone);
  else { c.rect(8, 7, 16, 4, m).rect(22, 7, 2, 4, d); for (let i = 8; i < 24; i += 4) c.rect(i, 5, 2, 2, m).px(i, 5, l); }
  door(c, 14, 24, 4, 7);
  c.rect(15, 14, 2, 4, 'g4').px(15, 14, o.cone ? 'y2' : 'g4');
  if (o.star) c.px(16, 5, 'y2').px(13, 20, 'y2').px(19, 20, 'y2');
  if (o.flag) c.v(16, 1, 5, 'g3').rect(17, 1, 4, 3, o.flag);
}
function castle(c) {
  const cren = (x, y, w, r) => { const [d, m, l] = ramp(r); c.rect(x, y + 2, w, 2, m); for (let i = x; i < x + w; i += 4) c.rect(i, y, 2, 2, m).px(i, y, l); };
  wall(c, 6, 15, 20, 16, 'grey'); cren(6, 12, 20, 'grey');
  wall(c, 1, 8, 8, 23, 'grey'); cren(1, 5, 8, 'grey');
  wall(c, 23, 8, 8, 23, 'grey'); cren(23, 5, 8, 'grey');
  c.rect(12, 22, 8, 9, 't1').rect(13, 21, 6, 1, 't1').rect(13, 23, 6, 8, 't2').v(16, 23, 8, 't1').h(13, 26, 6, 'g2');
  c.rect(4, 13, 2, 4, 'g4').rect(26, 13, 2, 4, 'g4').rect(15, 16, 2, 3, 'g4');
  c.v(5, 1, 4, 'g3').rect(6, 1, 3, 2, 'r2').v(27, 1, 4, 'g3').rect(28, 1, 3, 2, 'r2');
}
function church(c) {
  wall(c, 6, 18, 20, 13, 'white');
  roof(c, 16, 12, 7, 12, 24, 'blue');
  wall(c, 12, 8, 8, 10, 'white');
  roof(c, 16, 3, 6, 2, 10, 'blue');
  c.v(16, 1, 3, 'y2').h(15, 2, 3, 'y2');
  door(c, 14, 24, 4, 7);
  c.rect(15, 11, 2, 4, 'b2').px(15, 11, 'y2').px(16, 12, 'r2');
  win(c, 8, 22); win(c, 20, 22);
}
function windmill(c) {
  const [d, m, l] = ramp('cream');
  for (let y = 10; y < 31; y++) { const w = 8 + Math.floor((y - 10) / 4), x = 16 - (w >> 1); c.h(x, y, w, m).px(x, y, l).px(x + w - 1, y, d).px(x + w - 2, y, d); }
  roof(c, 16, 6, 5, 4, 12, 'red');
  door(c, 14, 25, 4, 6); c.rect(15, 18, 2, 3, 'g4');
  for (let i = 1; i < 9; i++) for (const [sx, sy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    c.px(16 + sx * i, 11 + sy * i, 't2');
    if (i > 2) c.px(16 + sx * i - sy, 11 + sy * i + sx, 'w0').px(16 + sx * i - 2 * sy, 11 + sy * i + 2 * sx, i % 2 ? 'g1' : 'w0');
  }
  c.rect(15, 10, 3, 3, 'g3');
}
function barn(c) {
  wall(c, 4, 15, 24, 16, 'red');
  roof(c, 16, 5, 6, 10, 22, 'brown'); roof(c, 16, 11, 5, 22, 28, 'brown');
  c.rect(11, 20, 10, 11, 'w0').rect(12, 21, 8, 10, 'r1');
  for (let i = 0; i < 8; i++) c.px(12 + i, 21 + i, 'w0').px(19 - i, 21 + i, 'w0').px(12 + i, 22 + i, 'w0').px(19 - i, 22 + i, 'w0');
  c.rect(14, 13, 4, 4, 'w0').rect(15, 14, 2, 2, 'g4');
}
function lighthouse(c) {
  for (let y = 9; y < 31; y++) { const w = 8 + Math.floor((y - 9) / 6), x = 16 - (w >> 1); const col = Math.floor((y - 9) / 4) % 2 ? 'r2' : 'w0'; c.h(x, y, w, col).px(x + w - 1, y, col === 'r2' ? 'r1' : 'g1').px(x + w - 2, y, col === 'r2' ? 'r1' : 'g1'); }
  c.rect(10, 8, 12, 2, 'g3').rect(12, 4, 8, 4, 'y2').rect(13, 5, 3, 2, 'y3').v(12, 4, 4, 'g3').v(19, 4, 4, 'g3');
  roof(c, 16, 1, 3, 2, 10, 'red');
  door(c, 14, 25, 4, 6);
}
function pyramid(c) {
  for (let y = 5; y < 31; y++) { const hw = Math.round((y - 4) * 0.56); for (let x = 16 - hw; x < 16 + hw; x++) c.px(x, y, x >= 16 + hw * 0.25 ? 't3' : (y % 4 === 0 ? 't3' : 'o3')); c.px(16 - hw, y, 'y3'); }
  for (let y = 8; y < 31; y += 4) for (let x = 3 + (y % 8); x < 19; x += 5) if (c.get(x, y - 1) === PAL.o3) c.v(x, y - 2, 2, 't3');
  c.rect(13, 25, 5, 6, 'g4').h(14, 24, 3, 'g4');
}
function igloo(c) {
  for (let y = 14; y < 31; y++) for (let x = 2; x < 30; x++) {
    const dx = (x - 15.5) / 14, dy = (y - 31) / 17;
    if (dx * dx + dy * dy <= 1) c.px(x, y, dx > 0.45 ? 'b3' : 'w0');
  }
  for (let y = 18; y < 31; y += 4) for (let x = 2; x < 30; x++) if (c.get(x, y)) c.px(x, y, 'b3');
  for (let y = 15; y < 31; y++) for (let x = 4 + ((y >> 2) & 1) * 3; x < 30; x += 6) if (c.get(x, y) && y % 4 !== 2) c.px(x, y, 'b3');
  c.rect(11, 22, 10, 9, 'b3').rect(12, 21, 8, 1, 'b3').rect(13, 24, 6, 7, 'g4').h(14, 23, 4, 'g4');
}

// ═════════════════════════ CATALOG: things ═════════════════════════
category('weapons', 'Weapons & Armour', 'thing');
S('sword', 'iron sword', 'sword');
S('sword-gold', 'golden sword', 'sword', { p: 'gold', d: 'red' });
S('sword-fire', 'fire sword flame blade', 'sword', { p: 'fire', d: 'dark' });
S('sword-ice', 'ice sword frost blade', 'sword', { p: 'ice', d: 'blue' });
S('sword-dark', 'dark cursed sword purple', 'sword', { p: 'purple', d: 'dark' });
S('dagger', 'dagger knife', 'dagger');
S('axe', 'axe hatchet', 'axe');
S('battle-axe', 'battle axe double', 'battleaxe');
S('hammer', 'war hammer', 'hammer');
S('mace', 'spiked mace', 'mace');
S('club', 'wooden club', 'club');
S('spear', 'spear lance', 'spear');
S('trident', 'golden trident', 'trident');
S('scythe', 'scythe', 'scythe');
S('bow', 'wooden bow', 'bow');
S('crossbow', 'crossbow', 'crossbow');
S('arrow', 'arrow', 'arrow');
S('staff-blue', 'magic staff blue orb', 'staff');
S('staff-red', 'fire staff red orb', 'staff', { p: 'fire' });
S('wand', 'magic wand star', 'wand');
S('boomerang', 'boomerang', 'boomerang');
S('bomb', 'bomb black fuse', 'bomb');
S('pickaxe', 'pickaxe mining tool', 'pickaxe');
S('shovel', 'shovel spade', 'shovel');
S('shield-wood', 'wooden round shield', 'shield_round');
S('shield-iron', 'iron kite shield blue', 'shield_kite');
S('shield-gold', 'golden shield red', 'shield_kite', { p: 'gold', d: 'red' });
S('helmet', 'iron helmet', 'helmet');
S('helmet-gold', 'golden helmet', 'helmet', { p: 'gold' });
S('chestplate', 'iron chestplate armor', 'chestplate');
S('boot', 'leather boot', 'boot');
S('gauntlet', 'iron gauntlet glove', 'gauntlet');
S('ring-ruby', 'gold ring ruby', 'ring');
S('amulet', 'amulet necklace', 'amulet');
S('crown', 'golden crown', 'crown_item');
S('wizard-hat', 'wizard hat blue', 'wizhat_item');

category('items', 'Items & Treasure', 'thing');
S('potion-red', 'red health potion', 'potion');
S('potion-blue', 'blue mana potion', 'potion', { a: 'blue' });
S('potion-green', 'green stamina potion', 'potion', { a: 'green' });
S('potion-purple', 'purple magic potion', 'potion', { a: 'purple' });
S('vial-red', 'small red vial', 'vial');
S('vial-pink', 'love potion pink vial', 'vial', { a: 'pink' });
S('flask-orange', 'big orange elixir flask', 'flask');
S('poison', 'poison flask skull', 'flask skull_label', { a: 'green' });
S('bottle-empty', 'empty glass bottle', 'potion', { a: 'ice' });
S('diamond', 'diamond gem white', 'gem_diamond');
S('ruby', 'ruby gem red', 'gem_diamond', { a: 'red' });
S('sapphire', 'sapphire gem blue', 'gem_cut', { a: 'blue' });
S('emerald', 'emerald gem green', 'gem_cut');
S('amethyst', 'amethyst gem purple', 'gem_cut', { a: 'purple' });
S('topaz', 'topaz gem orange', 'gem_round');
S('pearl', 'pearl white', 'gem_round', { a: 'steel' });
S('mana-crystal', 'mana crystal blue', 'crystal');
S('key-gold', 'gold key', 'key');
S('key-silver', 'silver key', 'key', { a: 'steel' });
S('key-boss', 'boss key ornate', 'key_boss');
S('coin-gold', 'gold coin', 'coin');
S('coin-silver', 'silver coin', 'coin', { a: 'steel' });
S('coin-copper', 'copper coin', 'coin', { a: 'copper' });
S('coin-stack', 'stack of gold coins', 'coins');
S('money-bag', 'money bag gold sack', 'moneybag');
S('gold-bar', 'gold bar ingot', 'ingot');
S('scroll', 'scroll parchment', 'scroll');
S('book-red', 'red spell book', 'book');
S('map', 'treasure map', 'map');
S('letter', 'letter envelope mail', 'letter');
S('bone', 'bone', 'bone');
S('skull', 'skull remains', 'skull');
S('bell', 'golden bell', 'bell');
S('compass', 'compass', 'compass');
S('hourglass', 'hourglass timer', 'hourglass');
S('torch', 'torch burning', 'torch');
S('candle', 'candle', 'candle');
S('lantern', 'lantern lamp', 'lantern');
S('feather', 'feather quill', 'feather');
S('crystal-ball', 'crystal ball orb', 'orb');
S('backpack', 'backpack bag', 'backpack');
S('dice', 'dice', 'dice');
S('trophy', 'gold trophy cup', 'trophy');
S('rope', 'rope coil', 'rope');

category('food', 'Food', 'thing');
S('apple', 'red apple', 'apple');
S('bread', 'bread loaf', 'bread');
S('cheese', 'cheese wedge', 'cheese');
S('meat', 'meat drumstick', 'meat');
S('cooked-fish', 'cooked fish on plate', 'cookedfish');
S('stew', 'stew soup bowl', 'stew', { a: 'brown' });
S('cake', 'cake with cherry', 'cake');
S('pie', 'pie', 'pie');
S('cookie', 'cookie', 'cookie');
S('donut', 'donut pink', 'donut');
S('candy', 'candy sweet', 'candy');
S('ice-cream', 'ice cream cone', 'icecream');
S('pizza', 'pizza slice', 'pizza');
S('egg', 'egg', 'egg');
S('carrot', 'carrot', 'carrot');
S('corn', 'corn cob', 'corn');
S('pumpkin', 'pumpkin', 'pumpkin');
S('mushroom-food', 'mushroom red', 'mushroom');
S('cherry', 'cherries', 'cherry');
S('strawberry', 'strawberry', 'strawberry');
S('grapes', 'grapes purple', 'grapes');
S('banana', 'banana', 'banana');
S('melon', 'watermelon slice', 'melon');
S('mug', 'mug of ale beer', 'mug');
S('wine', 'wine bottle', 'wine');

category('props', 'Furniture & Props', 'thing');
S('chest', 'wooden treasure chest closed', 'chest');
S('chest-open', 'wooden treasure chest open gold', 'chest_open');
S('chest-empty', 'wooden treasure chest open empty', 'chest_empty');
S('chest-gold', 'golden treasure chest closed', 'chest', { a: 'gold', d: 'red' });
S('chest-gold-open', 'golden treasure chest open', 'chest_open', { a: 'gold', d: 'red' });
S('chest-iron', 'iron chest locked', 'chest', { a: 'grey', d: 'dark' });
S('barrel', 'wooden barrel', 'barrel');
S('crate', 'wooden crate box', 'crate');
S('pot', 'clay pot vase', 'pot');
S('pot-broken', 'broken pot', 'pot_broken');
S('sack', 'sack bag of grain', 'sack');
S('bucket', 'empty bucket', 'bucket');
S('bucket-water', 'bucket of water', 'bucket water_in');
S('table', 'wooden table', 'table');
S('chair', 'wooden chair', 'chair');
S('stool', 'stool', 'stool');
S('bed', 'bed red blanket', 'bed');
S('bed-blue', 'bed blue blanket', 'bed', { p: 'blue' });
S('bookshelf', 'bookshelf books', 'bookshelf');
S('cupboard', 'cupboard dresser', 'cupboard');
S('throne', 'royal throne', 'throne');
S('clock', 'grandfather clock', 'clock');
S('mirror', 'mirror', 'mirror');
S('painting', 'painting picture', 'painting');
S('banner-red', 'red banner', 'banner');
S('flag-red', 'red flag', 'flag');
S('statue', 'stone statue', 'statue');
S('gravestone', 'gravestone tombstone', 'gravestone');
S('grave-cross', 'wooden grave cross', 'gravecross');
S('coffin', 'coffin', 'coffin');
S('campfire', 'campfire', 'campfire');
S('cauldron', 'cauldron green brew', 'cauldron');
S('anvil', 'anvil', 'anvil');
S('signpost', 'wooden sign', 'signpost');
S('sign-right', 'arrow sign right', 'sign_arrow');
S('sign-left', 'arrow sign left', 'sign_arrow', {}, { flip: true });
S('lever-left', 'lever switch left off', 'lever');
S('lever-right', 'lever switch right on', 'lever', {}, { flip: true });
S('button', 'red button switch', 'button');
S('button-pressed', 'red button pressed', 'button_down');
S('door', 'wooden door closed', 'door');
S('door-open', 'wooden door open', 'door_open');
S('door-iron', 'iron door locked', 'door padlock', { a: 'grey' });
S('portcullis', 'portcullis iron gate', 'portcullis');
S('stairs', 'stone stairs', 'stairs');
S('lamp-post', 'street lamp post', 'lamppost');
S('cage', 'iron cage', 'cage');
S('fountain', 'fountain', 'fountain');

category('nature', 'Nature', 'thing');
S('tree', 'oak tree green', 'tree');
S('tree-autumn', 'autumn tree orange', 'tree', { a: 'orange' });
S('tree-cherry', 'cherry blossom tree pink', 'tree', { a: 'pink' });
S('tree-apple', 'apple tree', 'tree fruit');
S('pine', 'pine tree', 'pine');
S('pine-snow', 'snowy pine tree', 'pine snowcap', { a: 'teal' });
S('palm', 'palm tree', 'palm');
S('dead-tree', 'dead tree', 'deadtree');
S('bush', 'bush green', 'bush');
S('bush-berry', 'berry bush', 'bush berries');
S('rock', 'rock boulder', 'rock');
S('rock-mossy', 'mossy rock', 'rock moss');
S('rock-small', 'small stone', 'rock_small');
S('flower-red', 'red flower', 'flower');
S('flower-blue', 'blue flower', 'flower', { a: 'blue' });
S('flower-white', 'white daisy flower', 'flower', { a: 'white' });
S('tulip', 'pink tulip', 'tulip');
S('sunflower', 'sunflower', 'sunflower');
S('mushroom-brown', 'brown mushroom', 'mushroom', { a: 'tan' });
S('mushroom-glow', 'glowing blue mushroom', 'mushroom', { a: 'teal' });
S('grass', 'grass tuft', 'grasstuft');
S('cactus', 'cactus', 'cactus');
S('stump', 'tree stump', 'stump');
S('log', 'wooden log', 'log');
S('lily-pad', 'lily pad flower', 'lilypad');
S('crystal-purple', 'purple crystal cluster', 'crystal', { a: 'purple' });
S('stalagmite', 'stalagmite cave rock', 'stalagmite');
S('snowman', 'snowman', 'snowman');
S('hay-bale', 'hay bale', 'haybale');
S('fence', 'wooden fence', 'fence');
S('wheat', 'wheat crop', 'wheat');
S('scarecrow', 'scarecrow', 'scarecrow_pole hum strawhat', { d: 'red', g: 'brown', j: 'tan', s: 'tan' });
S('coral', 'coral pink', 'coral');
S('shell', 'sea shell', 'shell');
S('starfish', 'starfish', 'starfish');
S('cloud', 'cloud', 'cloud', {}, { anchor: 'center' });

category('buildings', 'Buildings & Vehicles', 'thing');
D('house', 'house red roof', (c) => house(c, { chimney: true }), BUILD);
D('house-blue', 'house blue roof', (c) => house(c, { roof: 'blue', wall: 'white', lit: true }), BUILD);
D('cottage', 'cottage thatched roof', (c) => house(c, { roof: 'gold', wall: 'tan', timber: true, chimney: true }), BUILD);
D('shop', 'shop store', (c) => house(c, { roof: 'green', wall: 'cream', flat: true, sign: ['YYY.Y.', '.YY.YY'] }), BUILD);
D('inn', 'inn tavern', (c) => house(c, { roof: 'brown', wall: 'cream', tall: true, lit: true, timber: true, chimney: true }), BUILD);
D('tower', 'stone tower', (c) => tower(c, { flag: 'r2' }), BUILD);
D('wizard-tower', 'wizard tower purple', (c) => tower(c, { cone: 'purple', wall: 'steel', star: true }), BUILD);
D('castle', 'castle', castle, BUILD);
D('church', 'church chapel', church, BUILD);
D('windmill', 'windmill', windmill, BUILD);
D('barn', 'red barn', barn, BUILD);
D('lighthouse', 'lighthouse', lighthouse, BUILD);
D('pyramid', 'pyramid', pyramid, BUILD);
D('igloo', 'igloo', igloo, BUILD);
S('tent', 'tent camp red', 'tent');
S('market-stall', 'market stall', 'stall');
S('well', 'stone well', 'well');
S('mine-entrance', 'mine entrance cave', 'mine');
S('bridge', 'wooden bridge', 'bridge');
S('pillar', 'stone pillar column', 'pillar');
S('pillar-broken', 'broken pillar ruin', 'pillar_broken');
S('cart', 'wooden cart', 'cart');
S('wagon', 'covered wagon', 'wagon');
S('minecart', 'minecart empty', 'minecart');
S('minecart-gold', 'minecart full of gold', 'minecart load+0,-2');
S('minecart-coal', 'minecart full of coal', 'minecart load:a=black+0,-2');
S('rowboat', 'rowboat small boat', 'rowboat');
S('sailboat', 'sailboat', 'sailboat');
S('ship', 'sailing ship', 'ship');
S('pirate-ship', 'pirate ship black sails', 'ship jolly', { p: 'dark', a: 'copper' });
S('raft', 'raft', 'raft');
S('balloon', 'hot air balloon', 'balloon');

// ═════════════════════════ ART: tiles with see-through parts, effects ═════════════════════════
art(`
@t_ladder
..KTLK....KTLK..
..KTLKKKKKKTLK..
..KTLLLLLLLTLK..
..KTLTTTTTTTLK..
..KTLKKKKKKTLK..
..KTLK....KTLK..
..KTLK....KTLK..
..KTLK....KTLK..
..KTLK....KTLK..
..KTLKKKKKKTLK..
..KTLLLLLLLTLK..
..KTLTTTTTTTLK..
..KTLKKKKKKTLK..
..KTLK....KTLK..
..KTLK....KTLK..
..KTLK....KTLK..

@t_spikes
...KK......KK...
...KK......KK...
..KWxK....KWxK..
..KWxK....KWxK..
.KWwxxK..KWwxxK.
.KWwxxK..KWwxxK.
KWwwxxxKKWwwxxxK
KWwwxxxKKWwwxxxK
KXXXXXXXXXXXXXXK
KKKKKKKKKKKKKKKK

@t_chain
......KKKK......
.....KxwwxK.....
.....KxKKxK.....
.....KxKKxK.....
.....KxwwxK.....
......KxxK......
......KwxK......
......KxxK......
......KKKK......
.....KxwwxK.....
.....KxKKxK.....
.....KxKKxK.....
.....KxwwxK.....
......KxxK......
......KwxK......
......KxxK......

@t_vines
..G....N...G....
..GH...NG..G..N.
.NG....G...GH.N.
..G...HG..NG..G.
..GH...G...G..GH
..N....N..HG..G.
.HG....G...N..N.
..G....GH.....G.
..N....N......GH
.......G......N.
.......N........

@t_platform_wood
KKKKKKKKKKKKKKKK
LLLLLLLLLLLLLLLL
TTTTLTTTTTTLTTTT
TTTTTTTTTTTTTTTT
CCCCCCCCCCCCCCCC
KKTTKKKKKKKKTTKK
.KTCK......KTCK.
.KTCK......KTCK.
..KK........KK..

@t_platform_stone
KKKKKKKKKKKKKKKK
wwwwwwwwwwwwwwww
xxxxxxXxxxxxxXxx
xxxxxxXxxxxxxXxx
XXXXXXXXXXXXXXXX
KKKKKKKKKKKKKKKK

@t_spring
.KKKKKKKKKKKKKK.
KRRIIRRRRRRRRRRK
KZZZZZZZZZZZZZZK
.KKKKKKKKKKKKKK.
....KxwwwwxK....
.....KxxxxK.....
....KxwwwwxK....
.....KxxxxK.....
....KxwwwwxK....
..KKKKKKKKKKKK..
..KXXXXXXXXXXK..
..KKKKKKKKKKKK..

// ── effects and symbols ──
@heart a=red
.bb...bb.
bccb.bbbb
bcbbbbbbb
bbbbbbbbb
bbbbbbbba
.bbbbbba.
..bbbba..
...bba...
....a....

@heart_left a=red
.bb......
bccb.....
bcbbb....
bbbbb....
bbbbb....
.bbbb....
..bbb....
...bb....
....a....

@star a=gold
.....b.....
.....b.....
....bcb....
bbbbbcbbbbb
.bbccbbbba.
..bcbbbba..
..bbbbbba..
.bbbbabbba.
.bba...aba.
ba.......ab

@arrow_up a=green
....bb....
...bccb...
..bccbbb..
.bccbbbbb.
bbbbbbbbba
...bbba...
...bbba...
...bbba...
...bbba...
...aaaa...

@bubble_speech
..WWWWWWWWWW..
.WWWWWWWWWWWW.
WWWWWWWWWWWWWW
WWWWWWWWWWWWWW
WWWWWWWWWWWWWW
WWWWWWWWWWWWWW
.WWWWWWWWWWWw.
..WWWWwwwwww..
...WWW........
...WW.........
...W..........

@b_dots y=3 x=3
XX.XX.XX
XX.XX.XX

@b_excl y=1 x=6
RR
RR
RR
..
RR

@b_quest y=1 x=5
.BBB.
B...B
...B.
..B..
.....
..B..

@bubble_thought
...WWWW.WWW...
.WWWWWWWWWWWW.
WWWWWWWWWWWWWW
WWWWWWWWWWWWWW
WWWWWWWWWWWWWW
.WWWWWWWWWWWw.
..WWWWwwwww...
..............
..WW..........
..Ww..........
..............
W.............

@excl a=gold
.bbb.
.bcb.
.bcb.
.bcb.
.bcb.
.bbb.
..b..
.....
.bbb.
.bcb.
.bbb.

@quest a=blue
..bbbb..
.bccccb.
bcb..bcb
.b...bcb
....bcb.
...bcb..
...bbb..
........
...bbb..
...bcb..
...bbb..

@sparkle a=gold
....b....
....b....
...bcb...
..bcWcb..
bbcWWWcbb
..bcWcb..
...bcb...
....b....
....b....

@smoke
....www.....
..wwWWWww...
.wWWWWWWWw..
.wWWWWWWWwx.
wWWWWWWwwwx.
wWWWwwwwwxx.
.wwwwwwxxx..
..xxxwwxx...
.....xx.....

@bolt a=blue
........bbb.
a.....bbccb.
..a.bbbcWWcb
.a.abbbcWWcb
a.....bbccb.
........bbb.

@fireball
.R......ROOR..
..R.RRROOYYOR.
R..RROOOYYEYOR
.R.RROOOYYEYOR
..R.RRROOYYOR.
.R......ROOR..

@fire a=fire
.....a....
....aa....
....aba.a.
.a.aaba.a.
.aaabbaaa.
.ababcbaa.
aabbccbba.
abbccWcbba
abccWWccba
.abcWWcba.
..aaaaaa..

@iceshard
.....W....
....WAW...
...WAAAW..
...WAABA..
..WAAABA..
..WAABBA..
.WAABBBA..
.WABBBU...
..ABBU....
...BU.....

@lightning
.....YYYY
....YEEY.
...YEEY..
..YEEYYY.
.YYYEEEY.
....YEY..
...YEY...
..YEY....
.YYY.....
.Y.......

@slash
......wWWW..
....wWWWWWW.
...wWWW...WW
..wWWW......
..wWW.......
.wWWW.......
.wWW........
.wWW........
..wW........

@poison
.....GG.....
....GHHG....
....GHGG..G.
.GGG.GG..GHG
GHHHG.....G.
GHGGG.GG....
GHGGGGHHG...
.GGG.GHGG...
.....GGG....

@zzz
....BBBBBB
.......BB.
.....BBB..
....BB....
....BBBBBB
BBBB......
..BB......
.BB.......
BBBB......

@note
....BBBBBB
....BAAAAB
....B....B
....B....B
....B....B
....B....B
..BBB..BBB
.BABB.BABB
.BBB..BBB.

@crosshair
....RRRR....
..RR.RR.RR..
.R...RR...R.
.R........R.
R..........R
RRR..RR..RRR
RRR..RR..RRR
R..........R
.R........R.
.R...RR...R.
..RR.RR.RR..
....RRRR....

@check a=green
.........bb
........bbb
.......bbb.
bb....bbb..
bbb..bbb...
.bbbbbb....
..bbbb.....
...bb......

@xmark a=red
bb.....bb
bbb...bbb
.bbb.bbb.
..bbbbb..
...bbb...
..bbbbb..
.bbb.bbb.
bbb...bbb
bb.....bb

@plus a=green
...bbb...
...bcb...
...bcb...
bbbbcbbbb
bccccccba
bbbbcbbaa
...bcb...
...bcb...
...baa...

@tornado
.wwwwwwwwwww.
wWWWWWWwwwwwx
.xwwwwwwwxx..
..wWWWWwwww..
...xwwwwxx...
...wWWWww....
....xwwx.....
.....wWw.....
.....xw......
......w......

@drop a=blue
...b...
...b...
..bcb..
..bcb..
.bcbbb.
bcbbbbb
bcbbbba
bbbbbba
.bbbaa.
..aaa..

@snowflake
.....W.....
...W.W.W...
....WWW....
.W...W...W.
..W..W..W..
WWWWWAWWWWW
..W..W..W..
.W...W...W.
....WWW....
...W.W.W...
.....W.....

@leaf a=green
......bbb.
....bbccb.
...bccbcb.
..bccbccb.
.bccbccb..
.bcbccbb..
.bbccbb...
.abbbb....
a.........

@portal a=blue
...bbbbbb...
..bccccccb..
.bccbbbbccb.
bccbbaabbccb
bcbbaVVabbcb
bcbaVVVVabcb
bcbaVVVVabcb
bcbaVVVVabcb
bcbbaVVabbcb
bccbbaabbccb
.bccbbbbccb.
..bccccccb..
...bbbbbb...

@rune a=purple
....bbbbbb....
..bb..cc..bb..
.b..cc..cc..b.
b..c..cc..c..b
b.c..c..c..c.b
b..c..cc..c..b
.b..cc..cc..b.
..bb..cc..bb..
....bbbbbb....

@anger
.RR...RR.
.RR...RR.
RRR...RRR
.........
.........
RRR...RRR
.RR...RR.
.RR...RR.

@lock
...xxxx...
..xx..xx..
..x....x..
..x....x..
.YYYYYYYY.
.YEYYYYYO.
.YYYKKYYO.
.YYYKKYYO.
.YYYYYYYO.
.OOOOOOOO.

@xporb a=lime
.bbbb.
bcWcbb
bWccbb
bccbba
bbbbaa
.baaa.

@sun
.....Y......
.Y...Y...Y..
..Y.....Y...
....YYYY....
...YEEYYY...
YY.YEYYYO.YY
...YYYYYO...
...YYYYOO...
....OOOO....
..Y.....Y...
.Y...Y...Y..
.....Y......

@moon
...EEEE...
.EEEEE....
.EEEE.....
EEEE......
EEEE......
EEEE......
EEEEE....w
.EEEEE..ww
.EEEEEEww.
...Ewww...

@hand
....WW......
...WWWW.....
...WWWW.....
...WWWW.....
...WWWWWW...
...WWWWWWWW.
.WWWWWWWWWWW
WWWWWWWWWWWW
WWWWWWWWWWWW
.WWWWWWWWWWw
..WWWWWWWWw.
..wwwwwwww..

@web
WWWWWWWWWWWW
WW..W...W..W
W.W.W..W..W.
W..WW.W..W..
WWWWWW..W...
W...W.WW....
W..W..W.....
W.W..W......
WW..W.......
W..W........
W.W.........
WW..........

@airbubble
..AAAA..
.AW...A.
AW.....A
A......A
A......A
A.....BA
.A...BA.
..AAAA..

@impact
....W......
....W...W..
.W..WW.WW..
..WWWWWW...
...WWEWWWWW
WWWWWEWW...
...WWWWWW..
..WW.WW..W.
..W...W....
......W....
`);

// ═════════════════════════ routines: tiles and blasts ═════════════════════════
function bricks(c, r, mortar, bh = 4, bw = 8) {
  const [d, m, l] = ramp(r);
  c.fill(m);
  for (let y = 0; y < 16; y++) {
    const off = (Math.floor(y / bh) % 2) * (bw / 2);
    if (y % bh === bh - 1) { c.h(0, y, 16, mortar); continue; }
    for (let x = 0; x < 16; x++) {
      const k = (x + off) % bw;
      if (k === bw - 1) c.px(x, y, mortar);
      else if (y % bh === 0) c.px(x, y, l);
      else if (k === bw - 2 && y % bh === bh - 2) c.px(x, y, d);
    }
  }
}
function waves(c, base, hi, glint) {
  c.fill(base);
  for (let y = 1; y < 16; y += 4) {
    const x = (y * 5) % 16;
    for (let i = 0; i < 5; i++) c.px((x + i) % 16, y + (i === 0 || i === 4 ? 1 : 0), hi);
    for (let i = 0; i < 3; i++) c.px((x + 9 + i) % 16, y + 2, hi);
    if (glint) c.px((x + 2) % 16, y, glint);
  }
}
function ore(c, r) {
  const [d, m, l] = ramp(r);
  TILES.stone(c);
  for (const [x, y] of [[2, 2], [10, 3], [6, 7], [12, 10], [3, 11]]) c.rect(x, y, 2, 2, m).px(x, y, l).px(x + 2, y + 1, d).px(x + 1, y + 2, d).px(x + 2, y + 2, 'g3');
}
function grassTop(c, body, top, hi, lo) {
  body(c);
  c.rect(0, 0, 16, 3, top);
  for (let x = 0; x < 16; x++) { if ((x * 7 + 3) % 5 < 3) c.px(x, 3, top); if ((x * 5) % 7 === 0) c.px(x, 4, top); c.px(x, 0, hi); if ((x * 3) % 4 === 0) c.px(x, 3, lo); }
}
const TILES = {
  grass(c) { c.fill('n2').speck(10, 'n3').speck(6, 'n1'); for (let i = 0; i < 5; i++) { const x = c.int(15), y = 1 + c.int(14); c.px(x, y, 'n1').px(x + 1, y - 1, 'n3'); } },
  grassFlowers(c) { TILES.grass(c); for (const [x, y, col] of [[3, 3, 'r2'], [11, 5, 'y2'], [6, 11, 'w0'], [13, 12, 'm2']]) c.px(x, y, col).px(x - 1, y, col).px(x + 1, y, col).px(x, y - 1, col).px(x, y + 1, col).px(x, y, 'y3'); },
  dirt(c) { c.fill('t2').speck(14, 't1').speck(8, 't3'); c.rect(3, 4, 2, 1, 'g2').rect(11, 10, 2, 1, 'g2').px(7, 13, 'g2'); },
  grassDirt(c) { grassTop(c, TILES.dirt, 'n2', 'n3', 'n1'); },
  path(c) { c.fill('t3').speck(12, 'y3').speck(8, 't2'); c.rect(4, 3, 2, 2, 'g1').rect(10, 9, 3, 2, 'g1').px(12, 10, 'g2').px(5, 4, 'g2').px(2, 12, 'g1'); },
  farmland(c) { c.fill('t2'); for (let y = 0; y < 16; y += 4) c.h(0, y, 16, 't3').h(0, y + 2, 16, 't1').h(0, y + 3, 16, 't1'); c.speck(8, 't1'); for (let x = 2; x < 16; x += 5) c.px(x, 1, 'n3').px(x, 9, 'n3'); },
  sand(c) { c.fill('o3').speck(12, 'y3').speck(6, 't3'); for (const [x, y] of [[2, 4], [9, 9], [5, 13]]) c.h(x, y, 4, 't3').px(x + 4, y + 1, 't3'); },
  sandstone(c) { bricks(c, 'tan', 't2'); },
  snow(c) { c.fill('w0').speck(10, 'g1').speck(5, 'b3'); },
  snowDirt(c) { grassTop(c, TILES.dirt, 'w0', 'w0', 'b3'); },
  ice(c) { c.fill('b3'); for (let i = 0; i < 16; i++) c.px(i, (20 - i) % 16, 'w0').px(i, (27 - i) % 16, 'w0').px(i, (26 - i) % 16, 'w0'); c.h(2, 12, 3, 'b2').px(5, 13, 'b2').h(10, 4, 2, 'b2').px(12, 5, 'b2'); },
  water(c) { waves(c, 'b2', 'b3', 'w0'); },
  deepWater(c) { waves(c, 'b1', 'b2'); },
  lava(c) { waves(c, 'o2', 'y2', 'y3'); for (const [x, y] of [[3, 7], [12, 3], [9, 12]]) c.rect(x, y, 3, 2, 'r2').px(x + 1, y - 1, 'r2').px(x + 1, y, 'r1'); },
  stone(c) { c.fill('g2').speck(10, 'g1').speck(8, 'g3'); c.h(2, 5, 4, 'g3').px(6, 6, 'g3').h(9, 11, 3, 'g3').px(9, 12, 'g3'); },
  crackedStone(c) { c.fill('g2').speck(8, 'g1'); let x = 7; for (let y = 0; y < 16; y++) { c.px(x, y, 'g4').px(x + 1, y, 'g3'); if (y === 6) for (let i = 1; i < 6; i++) c.px(x + i, y + (i >> 1), 'g4'); if (y === 10) for (let i = 1; i < 5; i++) c.px(x - i, y + (i >> 1), 'g4'); x += [0, 1, -1, 1, 0, -1][y % 6]; } },
  cobble(c) {
    c.fill('g3');
    for (let row = 0; row < 4; row++) { let x = -(row % 2) * 3; while (x < 16) { const w = 3 + c.int(3); c.rect(x, row * 4, w, 3, 'g2').h(x, row * 4, w, 'g1').px(x, row * 4, 'g3').px(x + w - 1, row * 4 + 2, 'g3'); x += w + 1; } }
  },
  stoneBrick(c) { bricks(c, 'grey', 'g4'); },
  mossyBrick(c) { bricks(c, 'grey', 'g4'); c.speck(16, 'n2').speck(8, 'n1'); c.rect(1, 1, 3, 2, 'n2').rect(10, 9, 4, 2, 'n2').px(11, 9, 'n3').px(2, 1, 'n3'); },
  redBrick(c) { bricks(c, 'red', 'g1'); },
  dungeonWall(c) { bricks(c, 'violet', 'k'); },
  dungeonFloor(c) { c.fill('g3'); for (let i = 0; i < 16; i += 8) c.h(0, i + 7, 16, 'g4').v(i + 7, 0, 16, 'g4').h(0, i, 16, 'g2').v(i, 0, 16, 'g2'); c.speck(6, 'g4'); },
  checker(c) { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) c.px(x, y, ((x >> 3) + (y >> 3)) % 2 ? 'g4' : 'w0'); c.h(0, 7, 8, 'g1').h(8, 15, 8, 'g1').h(8, 7, 8, 'k').h(0, 15, 8, 'k'); },
  planks(c) { c.fill('t2'); for (let y = 0; y < 16; y += 4) { c.h(0, y, 16, 't3').h(0, y + 3, 16, 't1'); const x = (y * 3 + 5) % 16; c.v(x, y, 3, 't1').px((x + 6) % 16, y + 1, 't1').px((x + 7) % 16, y + 1, 't1').px((x + 2) % 16, y + 2, 'y2' === 0 ? 't1' : 't3'); } },
  woodFloor(c) { c.fill('t1'); for (let x = 0; x < 16; x += 4) { c.v(x, 0, 16, 't2').v(x + 1, 0, 16, 't2').v(x + 2, 0, 16, 't2'); c.h(x, (x * 3 + 2) % 16, 3, 't1').px(x + 1, (x * 5 + 9) % 16, 't3'); } },
  carpet(c) { c.fill('r2').speck(10, 'r1'); c.rect(0, 0, 16, 1, 'y2').rect(0, 15, 16, 1, 'y2').rect(0, 0, 1, 16, 'y2').rect(15, 0, 1, 16, 'y2'); c.rect(2, 2, 12, 1, 'r1').rect(2, 13, 12, 1, 'r1').rect(2, 2, 1, 12, 'r1').rect(13, 2, 1, 12, 'r1'); c.stamp(6, 6, ['.YY.', 'YIIY', 'YIIY', '.YY.']); },
  roofTiles(c) { c.fill('r2'); for (let y = 0; y < 16; y += 4) for (let x = 0; x < 16; x++) { const k = (x + (y % 8 ? 2 : 0)) % 4; c.px(x, y, 'r3'); c.px(x, y + 3, k === 0 || k === 3 ? 'r1' : 'r2'); if (k === 3) c.px(x, y + 2, 'r1').px(x, y + 1, 'r1'); } },
  thatch(c) { c.fill('y2'); for (let i = 0; i < 26; i++) { const x = c.int(16), y = c.int(14); c.v(x, y, 2 + c.int(2), i % 3 ? 'o2' : 'y3'); } for (let y = 3; y < 16; y += 6) c.h(0, y, 16, 'o1'); },
  hedge(c) { c.fill('n1'); for (let i = 0; i < 16; i++) { const x = c.int(15), y = c.int(15); c.px(x, y, 'n2').px(x + 1, y, 'n2').px(x, y + 1, 'n2'); if (i % 3 === 0) c.px(x + 1, y, 'n3'); } },
  caveWall(c) { c.fill('g4'); for (const [x, y, w, h] of [[1, 1, 5, 4], [8, 0, 6, 3], [5, 6, 6, 4], [0, 8, 3, 4], [12, 5, 4, 5], [2, 12, 6, 3], [10, 11, 5, 4]]) c.rect(x, y, w, h, 'g3').h(x, y, w - 1, 'g2').px(x, y, 'g4').px(x + w - 1, y + h - 1, 'g4'); },
  obsidian(c) { c.fill('g4').speck(8, 'k'); for (const [x, y] of [[2, 3], [9, 2], [5, 9], [12, 11]]) c.px(x, y, 'p2').px(x + 1, y + 1, 'p1').px(x + 1, y, 'p1').px(x + 2, y + 2, 'p1'); },
  metal(c) { c.fill('g2'); c.h(0, 0, 16, 'g1').v(0, 0, 16, 'g1').h(0, 15, 16, 'g3').v(15, 0, 16, 'g3'); for (const [x, y] of [[2, 2], [13, 2], [2, 13], [13, 13]]) c.px(x, y, 'g4').px(x, y - 1, 'w0'); c.h(4, 7, 8, 'g3').h(4, 8, 8, 'g1'); },
  grate(c) { c.fill('k'); for (let i = 1; i < 16; i += 4) c.v(i, 0, 16, 'g2').v(i + 1, 0, 16, 'g3'); for (let i = 1; i < 16; i += 4) c.h(0, i, 16, 'g2').h(0, i + 1, 16, 'g3'); c.h(0, 0, 16, 'g3').v(0, 0, 16, 'g3'); },
  oreGold(c) { ore(c, 'gold'); },
  oreCoal(c) { ore(c, 'black'); },
  oreIron(c) { ore(c, 'copper'); },
  oreDiamond(c) { ore(c, 'ice'); },
  questionBlock(c) { c.fill('y2'); c.h(0, 0, 16, 'y3').v(0, 0, 16, 'y3').h(0, 15, 16, 'o1').v(15, 0, 16, 'o1').h(1, 14, 14, 'o2').v(14, 1, 14, 'o2'); for (const [x, y] of [[2, 2], [13, 2], [2, 13], [13, 13]]) c.px(x, y, 'o1'); c.stamp(5, 3, ['.DDDD.', 'DD..DD', '....DD', '...DD.', '..DD..', '..DD..', '......', '..DD..', '..DD..']); },
  crateTile(c) { c.fill('t2'); c.rect(0, 0, 16, 2, 't3').rect(0, 14, 16, 2, 't1').rect(0, 0, 2, 16, 't3').rect(14, 0, 2, 16, 't1'); for (let i = 2; i < 14; i++) c.px(i, i, 't1').px(i + 1, i, 't3').px(15 - i, i, 't1').px(14 - i, i, 't3'); c.h(0, 0, 16, 't1').h(0, 15, 16, 'k').v(0, 0, 16, 't1').v(15, 0, 16, 'k'); },
  rail(c) { c.fill('t3').speck(14, 't2').speck(8, 'g2'); for (let y = 1; y < 16; y += 5) c.rect(1, y, 14, 2, 't1').h(1, y, 14, 't2'); c.v(3, 0, 16, 'g2').v(4, 0, 16, 'g3').v(11, 0, 16, 'g2').v(12, 0, 16, 'g3'); },
  trapdoor(c) { TILES.planks(c); c.h(0, 0, 16, 't1').h(0, 15, 16, 't1').v(0, 0, 16, 't1').v(15, 0, 16, 't1'); c.rect(1, 3, 3, 2, 'g3').rect(1, 11, 3, 2, 'g3').stamp(10, 6, ['.xx.', 'x..x', 'x..x', '.XX.']); },
  windowWall(c) { bricks(c, 'grey', 'g4'); c.rect(4, 3, 8, 10, 't1').rect(5, 4, 6, 8, 'b3').v(7, 4, 8, 't1').v(8, 4, 8, 't1').h(5, 8, 6, 't1').px(5, 4, 'w0').px(6, 5, 'w0').px(9, 9, 'w0'); c.h(3, 13, 10, 'g1'); },
  torchWall(c) { bricks(c, 'grey', 'g4'); c.stamp(5, 2, ['..KK..', '.KRRK.', 'KROORK', 'KROYRK', 'KOYYOK', '.KOOK.', '.KTTK.', 'KxTTxK', '.KTTK.', '.KTTK.', '..KK..']); },
};
/** jagged burst: yellow core, orange, red rim */
function burst(c, cx, cy, R, cols, spikes = 7) {
  for (let y = 0; y < c.size; y++) for (let x = 0; x < c.size; x++) {
    const dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
    const rad = R * (0.7 + 0.3 * Math.cos(a * spikes + 1) ** 3);
    const f = r / rad;
    if (f <= 1) c.px(x, y, f < 0.3 ? cols[3] : f < 0.55 ? cols[2] : f < 0.8 ? cols[1] : cols[0]);
  }
}

// ═════════════════════════ CATALOG: tiles, effects ═════════════════════════
category('tiles', 'Tiles & Terrain', 'tile');
D('tile-grass', 'grass tile ground', TILES.grass);
D('tile-grass-flowers', 'grass with flowers tile meadow', TILES.grassFlowers);
D('tile-grass-dirt', 'grass on dirt ground top tile', TILES.grassDirt);
D('tile-dirt', 'dirt earth tile', TILES.dirt);
D('tile-path', 'path road gravel tile', TILES.path);
D('tile-farmland', 'farmland field soil tile', TILES.farmland);
D('tile-sand', 'sand desert beach tile', TILES.sand);
D('tile-sandstone', 'sandstone brick tile', TILES.sandstone);
D('tile-snow', 'snow tile', TILES.snow);
D('tile-snow-dirt', 'snow on dirt ground top tile', TILES.snowDirt);
D('tile-ice', 'ice tile frozen', TILES.ice);
D('tile-water', 'water tile', TILES.water);
D('tile-deep-water', 'deep water sea tile', TILES.deepWater);
D('tile-lava', 'lava tile', TILES.lava);
D('tile-stone', 'stone rock tile', TILES.stone);
D('tile-stone-cracked', 'cracked stone tile', TILES.crackedStone);
D('tile-cobble', 'cobblestone tile', TILES.cobble);
D('tile-stone-brick', 'stone brick wall tile', TILES.stoneBrick);
D('tile-mossy-brick', 'mossy stone brick tile', TILES.mossyBrick);
D('tile-brick', 'red brick wall tile', TILES.redBrick);
D('tile-dungeon-wall', 'dark dungeon wall tile', TILES.dungeonWall);
D('tile-dungeon-floor', 'dungeon floor slab tile', TILES.dungeonFloor);
D('tile-checker', 'checker floor black white tile', TILES.checker);
D('tile-planks', 'wood planks tile', TILES.planks);
D('tile-wood-floor', 'dark wood floor tile', TILES.woodFloor);
D('tile-carpet', 'red carpet rug tile', TILES.carpet);
D('tile-roof', 'red roof tiles', TILES.roofTiles);
D('tile-thatch', 'thatch straw roof tile', TILES.thatch);
D('tile-hedge', 'hedge leaves bush tile', TILES.hedge);
D('tile-cave', 'cave rock wall tile', TILES.caveWall);
D('tile-obsidian', 'obsidian dark tile', TILES.obsidian);
D('tile-metal', 'metal plate tile', TILES.metal);
D('tile-grate', 'iron grate tile', TILES.grate);
D('tile-ore-gold', 'gold ore tile', TILES.oreGold);
D('tile-ore-coal', 'coal ore tile', TILES.oreCoal);
D('tile-ore-iron', 'iron copper ore tile', TILES.oreIron);
D('tile-ore-diamond', 'diamond ore tile', TILES.oreDiamond);
D('tile-question', 'question block mystery', TILES.questionBlock);
D('tile-crate', 'crate block tile', TILES.crateTile);
D('tile-rail', 'rail track tile', TILES.rail);
D('tile-trapdoor', 'trapdoor hatch tile', TILES.trapdoor);
D('tile-window', 'window in stone wall tile', TILES.windowWall);
D('tile-wall-torch', 'stone wall with torch tile', TILES.torchWall);
S('tile-platform', 'wooden platform', 't_platform_wood', {}, { anchor: 'top' });
S('tile-platform-stone', 'stone platform ledge', 't_platform_stone', {}, { anchor: 'top' });
S('tile-spikes', 'spikes trap', 't_spikes');
S('tile-ladder', 'ladder', 't_ladder');
S('tile-chain', 'hanging chain', 't_chain');
S('tile-vines', 'hanging vines', 't_vines', {}, { anchor: 'top' });
S('tile-spring', 'spring bounce pad', 't_spring');

category('effects', 'Effects', 'fx');
D('explosion', 'explosion blast boom', (c) => burst(c, 7.5, 7.5, 7.4, ['r2', 'o2', 'y2', 'y3']), { o: true, anchor: 'center' });
D('explosion-big', 'big explosion', (c) => burst(c, 11.5, 11.5, 11.4, ['r2', 'o2', 'y2', 'y3'], 9), { size: 24, o: true, anchor: 'center' });
S('smoke', 'smoke puff', 'smoke');
S('fire', 'fire flame', 'fire', {}, { anchor: 'bottom' });
S('fire-blue', 'blue spirit flame', 'fire', { a: 'frost' }, { anchor: 'bottom' });
S('fireball', 'fireball', 'fireball');
S('magic-bolt', 'blue magic bolt', 'bolt');
S('magic-bolt-purple', 'purple dark magic bolt', 'bolt', { a: 'purple' });
S('ice-shard', 'ice shard', 'iceshard');
S('lightning', 'lightning bolt', 'lightning');
S('slash', 'sword slash swipe', 'slash');
S('impact', 'hit impact star', 'impact');
S('sparkle', 'sparkle shine gold', 'sparkle');
S('poison-bubbles', 'poison bubbles', 'poison');
S('tornado', 'tornado whirlwind', 'tornado', {}, { anchor: 'bottom' });
S('water-drop', 'water drop tear', 'drop');
S('snowflake', 'snowflake', 'snowflake', {}, { o: false });
S('leaf', 'falling leaf', 'leaf');
S('air-bubble', 'air bubble', 'airbubble', {}, { o: false });
S('portal', 'blue portal', 'portal', {}, { anchor: 'bottom' });
S('portal-purple', 'purple dark portal', 'portal', { a: 'purple' }, { anchor: 'bottom' });
S('rune-circle', 'magic rune circle', 'rune', {}, { o: false, anchor: 'bottom' });
S('cobweb', 'cobweb spider web', 'web', {}, { o: false });
S('xp-orb', 'experience orb green', 'xporb');
S('sun', 'sun', 'sun');
S('moon', 'moon crescent', 'moon');

category('symbols', 'Signs & Symbols', 'fx');
S('heart', 'heart full life', 'heart');
S('heart-half', 'half heart', 'heart:a=dark heart_left');
S('heart-empty', 'empty heart', 'heart', { a: 'dark' });
S('star', 'gold star', 'star');
S('star-empty', 'empty star grey', 'star', { a: 'dark' });
S('arrow-up', 'arrow up', 'arrow_up');
S('arrow-right', 'arrow right', 'arrow_up', {}, { rot: 1 });
S('arrow-down', 'arrow down', 'arrow_up', {}, { rot: 2 });
S('arrow-left', 'arrow left', 'arrow_up', {}, { rot: 3 });
S('speech-bubble', 'speech bubble empty', 'bubble_speech');
S('speech-dots', 'speech bubble talking dots', 'bubble_speech b_dots');
S('speech-exclaim', 'speech bubble exclamation alert', 'bubble_speech b_excl');
S('speech-question', 'speech bubble question', 'bubble_speech b_quest');
S('thought-bubble', 'thought bubble', 'bubble_thought');
S('exclamation', 'exclamation mark alert', 'excl');
S('question', 'question mark', 'quest');
S('zzz', 'zzz sleep', 'zzz');
S('music-note', 'music note', 'note');
S('anger', 'anger mark', 'anger');
S('check', 'check mark yes', 'check');
S('cross', 'cross mark no', 'xmark');
S('plus', 'plus heal green cross', 'plus');
S('crosshair', 'crosshair target', 'crosshair', {}, { o: false });
S('lock', 'padlock locked', 'lock');
S('pointer', 'pointing hand cursor', 'hand');

// ═════════════════════════ LEVEL EDITOR: tile sets that join ═════════════════════════
// Everything below was added for the tile-based level editor (16x12 grid, seen from
// above / three-quarter view). Tiles carry kind 'floor' (walkable) or 'wall' (blocks).
// Sets join through two small systems:
//   form()     wobbly, rounded borders for natural things (shores, lava, cliffs, pits)
//   edgeDist() straight borders for built things (wall tops, carpets)
// Edge names say where the border is: "water-edge-top" is the top row of a pond (the
// grass shore is at its top), "water-corner-tl" its top left corner, "water-inner-tl"
// a water tile with only a nub of land in its top left corner (for L-shaped ponds).
const KEY = Object.fromEntries(Object.entries(PAL).map(([k, v]) => [v, k]));
/** A full 16x16 level tile; fn(canvas, slug). */
function T(slug, name, kind, fn) { D(slug, name, (c) => fn(c, slug)); cat.items[cat.items.length - 1].kind = kind; }
/** Draw a routine on its own little canvas (own random seed) and return the pixels. */
function sub(seed, fn) { const g = Array.from({ length: 16 }, () => Array(16).fill(null)); fn(canvas(g, seed)); return g; }
function each(fn) { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) fn(x, y); }
/** stamp with a dark outline around it, for things hanging on walls */
function ostamp(c, x, y, rows, line = 'k') {
  const on = (i, j) => rows[j] && rows[j][i] && rows[j][i] !== '.';
  for (let j = -1; j <= rows.length; j++) for (let i = -1; i <= rows[0].length; i++) if (!on(i, j) && (on(i - 1, j) || on(i + 1, j) || on(i, j - 1) || on(i, j + 1))) c.px(x + i, y + j, line);
  return c.stamp(x, y, rows);
}
/** mirror / transpose a painter: 'x' flips left-right, 'y' flips up-down, 't' swaps x and y */
function turned(how, fn) {
  return (c, slug) => {
    const g = sub(slug, (c2) => fn(c2, slug));
    each((x, y) => { let sx = x, sy = y; for (const h of how) { if (h === 'x') sx = 15 - sx; else if (h === 'y') sy = 15 - sy; else [sx, sy] = [sy, sx]; } c.px(x, y, KEY[g[sy][sx]]); });
  };
}

// ── natural borders ──
const WOB = [0, 0, 1, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, 0, 0, 0];
const FORMS = ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br'];
const INNER = ['itl', 'itr', 'ibl', 'ibr'];
const FORM_SLUG = { t: 'edge-top', b: 'edge-bottom', l: 'edge-left', r: 'edge-right', tl: 'corner-tl', tr: 'corner-tr', bl: 'corner-bl', br: 'corner-br', itl: 'inner-tl', itr: 'inner-tr', ibl: 'inner-bl', ibr: 'inner-br' };
const FORM_NAME = { t: 'edge top', b: 'edge bottom', l: 'edge left', r: 'edge right', tl: 'corner top left', tr: 'corner top right', bl: 'corner bottom left', br: 'corner bottom right', itl: 'inner corner top left', itr: 'inner corner top right', ibl: 'inner corner bottom left', ibr: 'inner corner bottom right' };
/** → mask(x, y): true where the border material (the shore) is. Works beyond 0..15 so neighbours can be asked. */
function form(name, o = {}) {
  const b = o.band === undefined ? 4 : o.band, R = o.round !== 0;
  const wb = (i) => (o.wob === 0 ? 0 : WOB[i & 15]);
  const top = (x, y) => y < b + wb(x);
  const tl = (x, y) => y < b + wb(x) || x < b + wb(y) || (R && x < b + 4 && y < b + 4 && Math.hypot(x - (b + 3.5), y - (b + 3.5)) > 3.7);
  const itl = (x, y) => (R ? Math.hypot(x + 0.5, y + 0.5) < b + 0.4 : x < b && y < b);
  switch (name) {
    case 'c': return () => false;
    case 't': return top;
    case 'b': return (x, y) => top(x, 15 - y);
    case 'l': return (x, y) => top(y, x);
    case 'r': return (x, y) => top(y, 15 - x);
    case 'h': return (x, y) => top(x, y) || top(x, 15 - y);
    case 'v': return (x, y) => top(y, x) || top(y, 15 - x);
    case 'tl': return tl;
    case 'tr': return (x, y) => tl(15 - x, y);
    case 'bl': return (x, y) => tl(x, 15 - y);
    case 'br': return (x, y) => tl(15 - x, 15 - y);
    case 'itl': return itl;
    case 'itr': return (x, y) => itl(15 - x, y);
    case 'ibl': return (x, y) => itl(x, 15 - y);
    case 'ibr': return (x, y) => itl(15 - x, 15 - y);
    case 'o': return (x, y) => tl(x, y) || tl(15 - x, y) || tl(x, 15 - y) || tl(15 - x, 15 - y);
  }
  throw new Error('unknown form ' + name);
}
/** o: { land, liquid: painters; rim: colour of the land's edge; bank: colours seen below a top shore; foam } */
function shore(c, slug, f, o) {
  const M = form(f, o), land = sub(slug + '/land', o.land), liq = sub('liquid', o.liquid), bank = o.bank || [];
  each((x, y) => {
    let col;
    if (M(x, y)) col = o.rim && (!M(x, y + 1) || !M(x, y - 1) || !M(x - 1, y) || !M(x + 1, y)) ? o.rim : KEY[land[y][x]];
    else {
      col = KEY[liq[y][x]];
      const depth = bank.findIndex((_, i) => M(x, y - 1 - i));
      if (depth >= 0) col = bank[depth];
      else if (o.foam && (M(x - 1, y) || M(x + 1, y) || M(x, y + 1) || M(x, y - 1 - bank.length)) && (x * 3 + y * 5) % 7 > 1) col = o.foam;
    }
    c.px(x, y, col);
  });
}
/** the whole joining set: centre, 4 edges, 4 corners (and inner corners, single pool) */
function shoreSet(prefix, words, kind, o, extra = []) {
  T(prefix, `${words} centre middle`, kind, (c, s) => shore(c, s, 'c', o));
  for (const f of [...FORMS, ...extra.filter((e) => INNER.includes(e))]) T(`${prefix}-${FORM_SLUG[f]}`, `${words} ${FORM_NAME[f]} shore`, kind, (c, s) => shore(c, s, f, o));
  if (extra.includes('o')) T(`${prefix}-pool`, `${words} small pool pond single hole`, kind, (c, s) => shore(c, s, 'o', o));
  if (extra.includes('h')) T(`${prefix}-stream-h`, `${words} stream river channel horizontal`, kind, (c, s) => shore(c, s, 'h', o));
  if (extra.includes('v')) T(`${prefix}-stream-v`, `${words} stream river channel vertical`, kind, (c, s) => shore(c, s, 'v', o));
}

// ── straight borders ──
const EDGES = ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br'];
const EDGE_INNER = ['1', '2', '3', '4'];
const EDGE_SLUG = { t: 'edge-top', b: 'edge-bottom', l: 'edge-left', r: 'edge-right', tl: 'corner-tl', tr: 'corner-tr', bl: 'corner-bl', br: 'corner-br', 1: 'inner-tl', 2: 'inner-tr', 3: 'inner-bl', 4: 'inner-br' };
const EDGE_NAME = { t: 'edge top', b: 'edge bottom', l: 'edge left', r: 'edge right', tl: 'corner top left', tr: 'corner top right', bl: 'corner bottom left', br: 'corner bottom right', 1: 'inner corner top left', 2: 'inner corner top right', 3: 'inner corner bottom left', 4: 'inner corner bottom right' };
/** distance of a pixel to the nearest bordered side; f: letters t b l r, digits 1-4 for inner corners (tl tr bl br) */
function edgeDist(f, x, y) {
  let d = 99;
  for (const ch of f) d = Math.min(d, ch === 't' ? y : ch === 'b' ? 15 - y : ch === 'l' ? x : ch === 'r' ? 15 - x : ch === '1' ? Math.max(x, y) : ch === '2' ? Math.max(15 - x, y) : ch === '3' ? Math.max(x, 15 - y) : Math.max(15 - x, 15 - y));
  return d;
}
/** The dark top of a wall seen from above, with a lighter bevel where it borders the room. */
function wallTop(c, f, o) {
  c.fill(o.base).speck(9, o.dark).speck(o.light ? 5 : 0, o.light);
  if (o.dots) each((x, y) => { if (x % 8 === 3 && y % 8 === 3) c.px(x, y, o.dots); });
  each((x, y) => { const d = edgeDist(f, x, y); if (d === 0) c.px(x, y, 'k'); else if (d === 1) c.px(x, y, o.hi); else if (d === 2) c.px(x, y, o.rim); else if (d === 3) c.px(x, y, o.dark); });
}
function wallTopSet(prefix, words, o) {
  T(prefix, `${words} wall top dark roof`, 'wall', (c) => wallTop(c, '', o));
  for (const f of [...EDGES, ...EDGE_INNER]) T(`${prefix}-${EDGE_SLUG[f]}`, `${words} wall top ${EDGE_NAME[f]}`, 'wall', (c) => wallTop(c, f, o));
}
function carpet(c, f, r, trim) {
  const [d, m, l] = ramp(r);
  each((x, y) => {
    const e = edgeDist(f, x, y);
    c.px(x, y, e === 0 ? d : e === 1 ? trim : e === 2 ? d : x % 8 === 3 && y % 8 === 3 ? l : (x + 4) % 8 === 3 && (y + 4) % 8 === 3 ? d : (x % 8 === 3 && (y % 8 === 2 || y % 8 === 4)) || (y % 8 === 3 && (x % 8 === 2 || x % 8 === 4)) ? d : m);
  });
}
function carpetSet(prefix, words, r, trim) {
  T(prefix, `${words} carpet rug centre middle`, 'floor', (c) => carpet(c, '', r, trim));
  for (const f of EDGES) T(`${prefix}-${EDGE_SLUG[f]}`, `${words} carpet rug ${EDGE_NAME[f]}`, 'floor', (c) => carpet(c, f, r, trim));
}

// ── paths and rails: pieces named by where they lead ──
const WOB2 = [0, 0, 0, 1, 1, 0, 0, 0, 0, -1, -1, 0, 0, 1, 0, 0];
const ROADS = [
  ['h', 'ew', 'straight horizontal'], ['v', 'ns', 'straight vertical'],
  ['corner-tl', 'es', 'corner top left turn'], ['corner-tr', 'sw', 'corner top right turn'], ['corner-bl', 'ne', 'corner bottom left turn'], ['corner-br', 'nw', 'corner bottom right turn'],
  ['t-up', 'new', 't junction up fork'], ['t-down', 'esw', 't junction down fork'], ['t-left', 'nsw', 't junction left fork'], ['t-right', 'nes', 't junction right fork'],
  ['cross', 'nesw', 'crossing crossroads'],
  ['end-up', 's', 'dead end top'], ['end-down', 'n', 'dead end bottom'], ['end-left', 'e', 'dead end left'], ['end-right', 'w', 'dead end right'],
];
function road(c, slug, conn, o) {
  const has = (d) => conn.includes(d);
  const M = (x, y) => {
    const inV = x >= 3 + WOB2[y & 15] && x <= 12 + WOB2[(y + 5) & 15], inH = y >= 3 + WOB2[x & 15] && y <= 12 + WOB2[(x + 5) & 15];
    return (has('n') && y < 8 && inV) || (has('s') && y >= 8 && inV) || (has('w') && x < 8 && inH) || (has('e') && x >= 8 && inH) || Math.hypot(x - 7.5, y - 7.5) < 4.9;
  };
  const ground = sub(slug + '/ground', o.ground), way = sub(slug + '/way', o.way);
  each((x, y) => {
    if (M(x, y)) c.px(x, y, !M(x, y + 1) || !M(x, y - 1) || !M(x - 1, y) || !M(x + 1, y) ? o.edge : KEY[way[y][x]]);
    else c.px(x, y, o.shade && M(x, y - 1) ? o.shade : KEY[ground[y][x]]);
  });
}
function roadSet(prefix, words, o, ends = true) {
  for (const [slug, conn, name] of ROADS) if (ends || !slug.startsWith('end')) T(`${prefix}-${slug}`, `${words} ${name}`, 'floor', (c, s) => road(c, s, conn, o));
}
function rails(c, conn, ground) {
  ground(c);
  const line = (P, sleepers = true) => { if (sleepers) for (let i = 1; i < 16; i += 4) for (let k = 2; k < 14; k++) { P(k, i, 't2'); P(k, i + 1, 't1'); } for (let i = 0; i < 16; i++) { P(4, i, 'g1'); P(5, i, 'g3'); P(10, i, 'g1'); P(11, i, 'g3'); } };
  const curve = (P) => {
    for (const a of [18, 45, 72]) { const r = (a * Math.PI) / 180; for (let d = 2.5; d <= 13.5; d += 0.5) { const x = Math.floor(16 - d * Math.cos(r)), y = Math.floor(d * Math.sin(r)); P(x, y, 't2'); P(x, y + 1, 't1'); } }
    each((x, y) => { const d = Math.hypot(15.5 - x, y + 0.5); for (const r of [5, 11]) if (Math.abs(d - r) < 0.95) P(x, y, d < r ? 'g1' : 'g3'); });
  };
  const px = (x, y, col) => c.px(x, y, col);
  if (conn === 'ns') line(px);
  else if (conn === 'ew') line((x, y, col) => c.px(y, x, col));
  else if (conn === 'nesw') { line((x, y, col) => c.px(y, x, col)); line(px, false); }
  else curve((x, y, col) => c.px(conn.includes('e') ? x : 15 - x, conn.includes('n') ? y : 15 - y, col));
}

// ── walls seen from the front ──
/** brick wall face: light lip on top (where the dark wall top begins), shadow at its foot */
function face(c, r, mortar) {
  const [d, , l] = ramp(r);
  bricks(c, r, mortar);
  c.h(0, 0, 16, l);
  for (let x = 0; x < 16; x++) if (c.get(x, 14) !== PAL[mortar]) c.px(x, 14, d);
  c.h(0, 15, 16, 'k');
}
function faceEnd(c, left, dark, mid) { const x = left ? 0 : 15, s = left ? 1 : -1; c.v(x, 0, 16, 'k').v(x + s, 1, 14, dark); for (let y = 1; y < 15; y += 2) c.px(x + 2 * s, y, mid); }
function boulders(c, gap, body, hi, lo) { c.fill(gap); for (const [x, y, w, h] of [[1, 1, 5, 4], [8, 0, 6, 3], [5, 6, 6, 4], [0, 8, 3, 4], [12, 5, 4, 5], [2, 12, 6, 3], [10, 11, 5, 4], [0, 5, 3, 2], [7, 4, 4, 1]]) c.rect(x, y, w, h, body).h(x, y, w - 1, hi).px(x, y, gap).px(x + w - 1, y + h - 1, gap).h(x + 1, y + h - 1, w - 2, lo); }
/** an opening in a wall face: frame colours [light, mid, dark], inside painter */
function arch(c, fr, inside) {
  c.rect(2, 2, 12, 14, fr[1]).h(3, 1, 10, fr[1]).h(3, 1, 10, fr[0]).v(2, 3, 13, fr[0]).px(2, 2, fr[0]).v(13, 3, 13, fr[2]);
  for (let y = 5; y < 16; y += 4) c.px(2, y, fr[2]).px(3, y, fr[2]).px(12, y, fr[2]).px(13, y, fr[2]);
  c.px(7, 1, fr[2]).px(8, 1, fr[2]).px(5, 2, fr[2]).px(10, 2, fr[2]);
  c.rect(4, 4, 8, 12, 'k').h(5, 3, 6, 'k');
  if (inside) inside(c);
}
function doorLeaf(c, x, y, w, h, r = 'brown') {
  const [d, m, l] = ramp(r);
  c.rect(x, y, w, h, m);
  for (let i = x + 2; i < x + w - 1; i += 3) c.v(i, y, h, d);
  for (let i = x; i < x + w; i += 3) c.v(i, y + 1, h - 1, l);
  c.h(x, y + 2, w, 'g3').h(x, y + h - 4, w, 'g3').px(x + w - 2, y + (h >> 1), 'y2').px(x + w - 2, y + (h >> 1) + 1, 'o2');
}
const PADLOCK = ['.xx.', 'x..x', 'YYYY', 'YKEY', 'YYOY'];
function steps(c, cols, x = 0, w = 16) { for (let i = 0; i < 4; i++) c.rect(x, i * 4, w, 4, cols[1]).h(x, i * 4, w, cols[0]).h(x, i * 4 + 3, w, cols[2]); }

// ── shared ground painters ──
const G = TILES.grass;
const GROUND = {
  flowers(c, col, col2) { G(c); for (const [x, y] of [[3, 3], [11, 11]]) c.px(x - 1, y, col).px(x + 1, y, col).px(x, y - 1, col).px(x, y + 1, col).px(x, y, 'y3'); for (const [x, y] of [[12, 3], [7, 7], [3, 12], [14, 8]]) c.px(x, y, col2 || col).px(x, y + 1, 'n1'); },
  tallGrass(c) { c.fill('n2').speck(8, 'n1'); for (let row = 0; row < 4; row++) for (let i = 0; i < 4; i++) { const x = (i * 4 + row * 2 + 1) % 16, y = row * 4 + 3; c.px(x, y, 'n1').px(x, y - 1, 'n1').px(x, y - 2, 'n3').px((x + 1) % 16, y, 'n3').px((x + 1) % 16, y - 1, 'n3').px((x + 2) % 16, y, 'n1').px((x + 2) % 16, y - 1, 'n1').px((x + 15) % 16, y - 1, 'n3'); } },
  mud(c) { c.fill('t1').speck(12, 't2').speck(5, 'k'); for (const [x, y, w] of [[2, 3, 5], [9, 6, 5], [4, 11, 6], [12, 13, 3]]) c.h(x, y, w, 't2').h(x + 1, y + 1, w - 1, 'k').px(x + 1, y, 't3'); },
  dirt2(c) { c.fill('t2').speck(12, 't1').speck(6, 't3'); },
  caveFloor(c) { c.fill('g3').speck(12, 'g4').speck(7, 't1').speck(5, 'g2'); for (const [x, y] of [[3, 4], [11, 2], [8, 9], [2, 12], [13, 13]]) c.px(x, y, 'g2').px(x + 1, y, 'g2').px(x, y + 1, 'g4').px(x + 1, y + 1, 'g4'); },
  basalt(c) { c.fill('g4').speck(10, 'g3').speck(8, 'k'); },
  rockTop(c) { c.fill('t3').speck(8, 't2').speck(4, 'y3'); },
  dunFloor: TILES.dungeonFloor,
  sandFloor(c) { c.fill('o3'); for (let i = 0; i < 16; i += 8) c.h(0, i + 7, 16, 't3').v(i + 7, 0, 16, 't3').h(0, i, 16, 'y3').v(i, 0, 16, 'y3'); c.speck(6, 't3'); },
  metalFloor(c) { c.fill('g2').h(0, 0, 16, 'g1').v(0, 0, 16, 'g1').h(0, 15, 16, 'g3').v(15, 0, 16, 'g3'); for (const [x, y] of [[2, 2], [13, 2], [2, 13], [13, 13]]) c.px(x, y, 'g3'); },
  darkMetal(c) { c.fill('g3').h(0, 0, 16, 'g2').v(0, 0, 16, 'g2').h(0, 15, 16, 'g4').v(15, 0, 16, 'g4').h(1, 8, 14, 'g4').v(8, 1, 14, 'g4').h(1, 7, 14, 'g2'); },
  shallow(c) { waves(c, 'b3', 'w0'); c.speck(7, 'b2'); for (const [x, y] of [[4, 5], [12, 10], [7, 14]]) c.px(x, y, 'o3').px(x + 1, y, 'o3'); },
  swamp(c) { c.fill('c1').speck(10, 'n1'); for (const [x, y, w] of [[1, 2, 4], [9, 5, 5], [3, 9, 5], [11, 13, 4]]) c.h(x, y, w, 'c2').px(x + w, y + 1, 'c2'); for (const [x, y] of [[13, 1], [6, 6], [1, 13]]) c.px(x, y, 'n3').px(x + 1, y + 1, 'n2'); },
  voidDark(c) { c.fill('k'); },
};
const WATER = { land: G, liquid: TILES.water, rim: 'n1', bank: ['t2', 't1'], foam: 'b3' };
const LAVA = { land: GROUND.basalt, liquid: TILES.lava, rim: 'k', bank: ['r1'], foam: 'y3', band: 3 };
const OASIS = { land: TILES.sand, liquid: TILES.water, rim: 't3', bank: ['t2'], foam: 'b3' };
const FROZEN = { land: TILES.snow, liquid: TILES.ice, rim: 'g1', bank: ['b2'], foam: 'w0' };
const PIT = { land: GROUND.dunFloor, liquid: GROUND.voidDark, rim: 'g2', bank: ['g4', 'g4', 'g4'], band: 3, wob: 0, round: 0 };
const CLIFF = { land: GROUND.rockTop, liquid: G, rim: 't1', band: 3 };

// ═════════════════════════ CATALOG: level tiles ═════════════════════════
category('outdoor', 'Outdoor ground', 'tile');
T('grass-short', 'grass short plain lawn ground', 'floor', (c) => c.fill('n2').speck(7, 'n3').speck(3, 'n1'));
T('grass-tufts', 'grass tufts meadow ground', 'floor', (c) => { G(c); for (const [x, y] of [[2, 4], [9, 2], [12, 8], [5, 10], [10, 14]]) c.stamp(x, y, ['H.H', 'NHN']); });
T('grass-dark', 'dark grass shade forest floor ground', 'floor', (c) => { c.fill('n1').speck(14, 'n2').speck(5, 'g4'); for (const [x, y] of [[3, 3], [11, 6], [6, 12]]) c.px(x, y, 'n2').px(x + 1, y - 1, 'n2'); });
T('grass-dry', 'dry light grass sunny savanna ground', 'floor', (c) => { c.fill('n3').speck(12, 'n2').speck(6, 'y3'); for (const [x, y] of [[4, 5], [12, 11], [8, 14]]) c.px(x, y, 'n2').px(x + 1, y - 1, 'y3'); });
T('grass-tall', 'tall grass bush wild meadow', 'floor', GROUND.tallGrass);
T('grass-clover', 'grass with clover leaves', 'floor', (c) => { G(c); for (const [x, y] of [[2, 2], [10, 4], [5, 9], [13, 12]]) c.px(x, y, 'n3').px(x + 1, y, 'n3').px(x, y + 1, 'n3').px(x + 1, y + 1, 'n1').px(x - 1, y + 1, 'n1'); });
T('grass-flowers-red', 'grass with red flowers poppies', 'floor', (c) => GROUND.flowers(c, 'r2'));
T('grass-flowers-yellow', 'grass with yellow flowers dandelions', 'floor', (c) => GROUND.flowers(c, 'y2', 'w0'));
T('grass-flowers-blue', 'grass with blue flowers', 'floor', (c) => GROUND.flowers(c, 'b3', 'b2'));
T('grass-flowers-pink', 'grass with pink white flowers', 'floor', (c) => GROUND.flowers(c, 'm3', 'w0'));
T('grass-stones', 'grass with small stones pebbles', 'floor', (c) => { G(c); for (const [x, y, w] of [[3, 4, 3], [10, 9, 4], [5, 12, 2]]) c.h(x, y, w, 'g1').h(x, y + 1, w, 'g2').h(x, y + 2, w, 'n1'); });
T('grass-leaves', 'grass with autumn leaves', 'floor', (c) => { G(c); for (const [x, y, col] of [[2, 3, 'o2'], [9, 2, 'r2'], [13, 6, 'y2'], [5, 8, 'r2'], [10, 11, 'o2'], [3, 13, 'y2'], [14, 13, 'o2']]) c.px(x, y, col).px(x + 1, y, col).px(x + 1, y + 1, 'o1'); });
T('grass-mushrooms', 'grass with red mushrooms', 'floor', (c) => { G(c); for (const [x, y] of [[3, 4], [11, 10]]) c.stamp(x, y, ['.RR.', 'RWRR', '.WW.']).h(x, y + 3, 4, 'n1'); c.stamp(8, 4, ['RR', '.W']); });
T('dirt-plain', 'dirt earth plain brown ground', 'floor', GROUND.dirt2);
T('dirt-pebbles', 'dirt with pebbles stones gravel', 'floor', (c) => { GROUND.dirt2(c); for (const [x, y, w] of [[2, 2, 2], [9, 4, 3], [5, 8, 2], [12, 11, 2], [3, 13, 3]]) c.h(x, y, w, 'g1').h(x, y + 1, w, 'g3'); });
T('mud', 'mud wet dirt swampy ground', 'floor', GROUND.mud);
T('sand-plain', 'sand plain beach ground', 'floor', (c) => c.fill('o3').speck(9, 'y3').speck(3, 't3'));
T('sand-shells', 'sand with shells beach', 'floor', (c) => { c.fill('o3').speck(9, 'y3').speck(4, 't3'); c.stamp(3, 3, ['.zz', 'zMz']).stamp(10, 9, ['WW.', 'WwW']).px(6, 12, 'w0').px(13, 4, 'm3'); });
T('cobble-brown', 'cobblestone brown road stones', 'floor', (c) => { c.fill('t1'); for (let row = 0; row < 4; row++) { let x = -(row % 2) * 2; while (x < 16) { const w = 3 + ((x + row * 3) % 2); c.rect(x, row * 4, w, 3, 't2').h(x, row * 4, w, 't3').px(x, row * 4, 't1').px(x + w - 1, row * 4 + 2, 't1'); x += w + 1; } } });
T('cobble-mossy', 'mossy cobblestone old road', 'floor', (c) => { TILES.cobble(c); each((x, y) => { if (c.get(x, y) === PAL.g3 && (x * 7 + y * 3) % 5 < 2) c.px(x, y, 'n1'); }); c.speck(6, 'n2'); });
T('paving', 'paving flagstones plaza square stone', 'floor', (c) => { c.fill('g2').speck(8, 'g1'); c.h(0, 7, 16, 'g3').h(0, 15, 16, 'g3').v(5, 0, 7, 'g3').v(12, 0, 7, 'g3').v(2, 8, 7, 'g3').v(9, 8, 7, 'g3'); c.h(0, 0, 16, 'g1').h(0, 8, 16, 'g1'); });
T('farmland-v', 'farmland field soil furrows vertical', 'floor', turned('t', TILES.farmland));
T('farmland-sprouts', 'farmland with green sprouts seedlings', 'floor', (c) => { TILES.farmland(c); for (let y = 0; y < 16; y += 4) for (let x = 1; x < 16; x += 4) c.px(x, y + 1, 'n2').px(x + 1, y, 'n3').px(x - 1, y, 'n3'); });
T('farmland-crops', 'farmland with crops cabbage vegetables', 'floor', (c) => { TILES.farmland(c); for (const [x, y] of [[1, 1], [9, 1], [5, 9], [13, 9]]) c.stamp(x - 1, y, ['.HH.', 'HGHG', 'GHGN', '.NN.']); });
T('farmland-wheat', 'farmland wheat field golden', 'floor', (c) => { c.fill('y2'); each((x, y) => { const k = (x + (y >> 2) * 2) % 4; if (y % 4 === 3) c.px(x, y, 'o1'); else if (k === 0) c.px(x, y, 'o2'); else if (k === 2 && y % 4 === 0) c.px(x, y, 'y3'); }); });
T('farmland-wet', 'watered farmland dark wet soil', 'floor', (c) => { c.fill('t1'); for (let y = 0; y < 16; y += 4) c.h(0, y, 16, 't2').h(0, y + 3, 16, 'k'); c.speck(5, 't2'); });
const bridgeH = (c) => { c.fill('t2'); for (let x = 0; x < 16; x += 4) c.v(x, 0, 16, 't3').v(x + 3, 0, 16, 't1').px(x + 1, (x * 3 + 5) % 12 + 2, 't1'); c.h(0, 0, 16, 't1').h(0, 1, 16, 't3').h(0, 2, 16, 't1').h(0, 13, 16, 't1').h(0, 14, 16, 't3').h(0, 15, 16, 'k'); for (let x = 1; x < 16; x += 4) c.px(x, 1, 'g2').px(x, 14, 'g2'); };
T('bridge-h', 'wooden bridge planks horizontal east west', 'floor', bridgeH);
T('bridge-v', 'wooden bridge planks vertical north south', 'floor', (c) => { c.fill('t2'); for (let y = 0; y < 16; y += 4) c.h(0, y, 16, 't3').h(0, y + 3, 16, 't1').px((y * 3 + 5) % 10 + 3, y + 1, 't1'); c.v(0, 0, 16, 't1').v(1, 0, 16, 't3').v(2, 0, 16, 't1').v(13, 0, 16, 't1').v(14, 0, 16, 't3').v(15, 0, 16, 'k'); for (let y = 1; y < 16; y += 4) c.px(1, y, 'g2').px(14, y, 'g2'); });
T('forest', 'forest trees canopy dense woods', 'wall', (c) => { c.fill('g4'); for (const [cx, cy] of [[4, 3], [12, 3], [20, 3], [-4, 3], [0, 11], [8, 11], [16, 11], [4, 19], [12, 19], [8, -5], [0, -5], [16, -5]]) { c.disc(cx, cy + 1, 4.2, 'g4').disc(cx, cy, 3.9, 'n1').disc(cx - 1, cy - 1, 2.3, 'n2').px(cx - 2, cy - 2, 'n3').px(cx - 1, cy - 3, 'n3').px(cx + 1, cy - 1, 'n3'); } });
T('rocks', 'rocks boulders rocky wall mountain', 'wall', (c) => boulders(c, 'g4', 'g2', 'g1', 'g3'));
const PATH = { ground: G, way: TILES.path, edge: 't2', shade: 'n1' };
roadSet('road', 'path road dirt track', PATH);
roadSet('paved', 'paved stone road street cobble', { ground: G, way: TILES.cobble, edge: 'g4', shade: 'n1' }, false);

category('water', 'Water & lava', 'tile');
shoreSet('water', 'water pond lake', 'wall', WATER, [...INNER, 'o', 'h', 'v']);
T('water-shallow', 'shallow water ford wade', 'floor', GROUND.shallow);
T('water-lily', 'water with lily pad flower', 'wall', (c) => { TILES.water(c); c.stamp(4, 5, ['.NNNN.', 'NGGGHN', 'NGG.GN', 'NGGGGN', '.NNNN.']).stamp(10, 10, ['.z.', 'zEz', '.z.']); });
T('water-rocks', 'water with rocks stepping stones', 'wall', (c) => { TILES.water(c); for (const [x, y, w] of [[2, 3, 5], [9, 9, 5]]) c.h(x + 1, y - 1, w - 2, 'g1').rect(x, y, w, 2, 'g2').h(x + 1, y, 2, 'g1').h(x, y + 2, w, 'g3').h(x - 1, y + 3, w + 2, 'b3'); });
T('water-reeds', 'water with reeds cattails', 'wall', (c) => { TILES.water(c); for (const [x, y] of [[3, 3], [6, 6], [11, 4], [13, 10], [8, 12]]) c.v(x, y, 4, 'n1').v(x, y - 2, 2, 't1').px(x + 1, y + 2, 'n2').px(x, y + 4, 'b3'); });
T('waterfall', 'waterfall falling water cascade', 'wall', (c) => { c.fill('b2'); for (let x = 0; x < 16; x++) { const k = (x * 7) % 5; for (let y = 0; y < 16; y++) { const p = (y + x * 5) % 8; if (k < 2 && p < 5) c.px(x, y, 'b3'); else if (k === 3 && p < 2) c.px(x, y, 'w0'); else if (k === 4 && p > 5) c.px(x, y, 'b1'); } } });
T('waterfall-top', 'waterfall top edge river falls', 'wall', (c) => { TILES.water(c); c.rect(0, 10, 16, 6, 'b2'); for (let x = 0; x < 16; x++) { c.px(x, 9 + ((x * 3) % 2), 'w0').px(x, 11, (x * 7) % 5 < 2 ? 'b3' : 'b2'); if ((x * 7) % 5 < 2) c.v(x, 12, 4, 'b3'); if ((x * 7) % 5 === 3) c.v(x, 13, 2, 'w0'); } });
T('waterfall-bottom', 'waterfall bottom splash foam', 'wall', (c) => { TILES.water(c); for (let x = 0; x < 16; x++) { const h = 3 + ((x * 5) % 3); c.v(x, 0, h, (x * 7) % 5 < 2 ? 'b3' : 'w0'); c.px(x, h, 'w0'); if (x % 3 === 0) c.px(x, h + 2, 'w0').px(x + 1, h + 1, 'b3'); } });
T('swamp', 'swamp water bog murky marsh', 'wall', GROUND.swamp);
T('swamp-lily', 'swamp water with lily pads', 'wall', (c) => { GROUND.swamp(c); c.stamp(2, 4, ['.NNN.', 'NGGHN', 'NG.GN', '.NNN.']).stamp(9, 9, ['.NNN.', 'NHGGN', 'NGG.N', '.NNN.']); });
T('swamp-shallow', 'shallow swamp mud water wade', 'floor', (c) => { c.fill('c2').speck(10, 'c1').speck(6, 'n3'); for (const [x, y, w] of [[2, 3, 4], [9, 7, 5], [4, 12, 4]]) c.h(x, y, w, 'b3'); c.stamp(11, 2, ['N.N', 'NGN']).stamp(3, 8, ['N.N', 'NGN']); });
shoreSet('lava', 'lava magma fire', 'wall', LAVA, [...INNER, 'o']);
T('lava-bubbles', 'lava bubbling hot bubbles', 'wall', (c) => { TILES.lava(c); for (const [x, y] of [[4, 3], [11, 8], [5, 12]]) c.stamp(x - 1, y - 1, ['.EE.', 'E..Y', 'Y..Y', '.YY.']); });
T('lava-cooled', 'cooled lava rock basalt cracks glowing', 'floor', (c) => { GROUND.basalt(c); let x = 3; for (let y = 0; y < 16; y++) { c.px(x, y, 'o2').px(x + 8, 15 - y, 'r2'); if (y % 5 === 2) c.px(x + 1, y, 'y2').px(x + 2, y + 1, 'r2'); x += [0, 1, 0, -1, 1, 0, -1, 0][y % 8]; } });
T('basalt', 'basalt dark volcanic rock ground', 'floor', GROUND.basalt);

category('cliffs', 'Cliffs', 'tile');
for (const f of FORMS) T(`cliff-${FORM_SLUG[f]}`, `cliff top ${FORM_NAME[f]} raised ground plateau`, 'floor', (c, s) => shore(c, s, f, CLIFF));
for (const f of INNER) T(`cliff-${FORM_SLUG[f]}`, `cliff top ${FORM_NAME[f]} raised ground plateau`, 'floor', (c, s) => shore(c, s, f, CLIFF));
function cliffRock(c) { c.fill('t2'); for (let x = 0; x < 16; x++) { const k = (x * 11 + 3) % 7, y0 = (x * 5) % 9; if (k === 0) c.v(x, 0, 16, 't1'); else if (k === 1) c.v(x, y0, 9, 't3'); else if (k === 4) c.v(x, (y0 + 5) % 16, 5, 't1').v(x, (y0 + 12) % 16, 3, 't1'); else if (k === 5) c.v(x, (y0 + 2) % 12, 4, 't3'); } }
function cliffFace(c) { cliffRock(c); c.h(0, 0, 16, 't1'); for (let x = 0; x < 16; x += 2) c.px(x, 1, 't1'); c.h(0, 14, 16, 't1').h(0, 15, 16, 'k'); }
T('cliff-face', 'cliff face rock wall front', 'wall', cliffFace);
T('cliff-face-left', 'cliff face left end corner', 'wall', (c) => { cliffFace(c); faceEnd(c, true, 't1', 't1'); });
T('cliff-face-right', 'cliff face right end corner', 'wall', (c) => { cliffFace(c); faceEnd(c, false, 't1', 't1'); });
T('cliff-rock', 'cliff rock wall tall middle', 'wall', cliffRock);
T('cliff-face-vines', 'cliff face with vines ivy', 'wall', (c) => { cliffFace(c); for (const [x, h] of [[3, 9], [7, 5], [11, 11], [13, 6]]) for (let y = 0; y < h; y++) { const o = (y >> 1) % 2; c.px(x + o, y, y % 3 === 1 ? 'n3' : 'n2'); if (y % 4 === 0) c.px(x + 1 - o, y, 'n1'); } });
T('cliff-face-cracked', 'cliff face cracked rock', 'wall', (c) => { cliffFace(c); let x = 6; for (let y = 2; y < 14; y++) { c.px(x, y, 'k'); if (y === 6) c.px(x + 1, y, 'k').px(x + 2, y + 1, 'k').px(x + 3, y + 1, 'k'); x += [1, 0, -1, 0, 1, 1][y % 6]; } });
T('cliff-stairs', 'stairs carved in cliff steps up', 'floor', (c) => { cliffFace(c); steps(c, ['y3', 't3', 't1'], 3, 10); c.v(2, 0, 16, 't1').v(13, 0, 16, 't1'); });
T('cliff-cave', 'cave entrance in cliff opening', 'floor', (c) => { cliffFace(c); c.rect(3, 4, 10, 12, 'k').h(4, 3, 8, 'k').h(6, 2, 4, 'k').h(5, 2, 1, 't1').px(3, 4, 't1').px(12, 4, 't1').h(4, 15, 8, 'g4').h(6, 14, 4, 'g4'); });
T('cliff-waterfall', 'waterfall down cliff face', 'wall', (c) => { cliffFace(c); for (let x = 4; x < 12; x++) for (let y = 0; y < 16; y++) { const p = (y + x * 5) % 8; c.px(x, y, (x * 7) % 5 < 2 && p < 5 ? 'b3' : (x * 7) % 5 === 3 && p < 2 ? 'w0' : 'b2'); } c.v(3, 0, 16, 't1').v(12, 0, 16, 't1'); });
T('rock-wall', 'grey rock cliff wall stone mountain face', 'wall', (c) => { boulders(c, 'g4', 'g3', 'g2', 'g4'); c.h(0, 0, 16, 'g2').h(0, 14, 16, 'g4').h(0, 15, 16, 'k'); });
T('rock-wall-top', 'grey rock top mountain plateau', 'wall', (c) => { c.fill('g3').speck(12, 'g4').speck(8, 'g2'); for (const [x, y] of [[3, 3], [10, 6], [6, 11], [13, 13]]) c.h(x, y, 3, 'g2').h(x, y + 1, 3, 'g4'); });

category('dungeon', 'Dungeon', 'tile');
const DF = GROUND.dunFloor;
T('dungeon-flagstone', 'dungeon stone floor plain flagstones', 'floor', (c) => { c.fill('g3').speck(8, 'g2').speck(5, 'g4'); c.h(0, 15, 16, 'g4').v(15, 0, 16, 'g4').h(0, 0, 16, 'g2').v(0, 0, 16, 'g2').h(1, 9, 9, 'g4').v(9, 1, 8, 'g4').v(5, 10, 5, 'g4'); });
T('dungeon-floor-cracked', 'dungeon stone floor cracked broken', 'floor', (c) => { DF(c); let x = 4; for (let y = 1; y < 15; y++) { c.px(x, y, 'k'); if (y === 5) c.px(x + 1, y, 'k').px(x + 2, y - 1, 'k').px(x + 3, y - 1, 'k'); if (y === 10) c.px(x - 1, y + 1, 'k').px(x - 2, y + 1, 'k'); x += [1, 1, 0, 1, -1, 1, 0][y % 7]; } });
T('dungeon-floor-mossy', 'dungeon stone floor mossy overgrown', 'floor', (c) => { DF(c); c.speck(14, 'n1').speck(6, 'n2'); c.rect(1, 1, 3, 2, 'n1').rect(10, 9, 4, 3, 'n1').px(11, 10, 'n2').px(12, 10, 'n2').px(2, 1, 'n2').rect(4, 12, 3, 2, 'n1').px(5, 12, 'n2'); });
T('dungeon-floor-checker', 'dungeon floor checkered dark tiles', 'floor', (c) => { each((x, y) => c.px(x, y, ((x >> 3) + (y >> 3)) % 2 ? 'g4' : 'g2')); for (let i = 0; i < 16; i += 8) c.h(0, i + 7, 16, 'k').v(i + 7, 0, 16, 'k'); each((x, y) => { if (x % 8 === 0 && y % 8 < 7 || y % 8 === 0 && x % 8 < 7) c.px(x, y, ((x >> 3) + (y >> 3)) % 2 ? 'g3' : 'g1'); }); });
T('dungeon-floor-drain', 'dungeon floor with drain grate sewer', 'floor', (c) => { DF(c); c.rect(4, 4, 8, 8, 'g4').rect(5, 5, 6, 6, 'k'); for (let x = 6; x < 11; x += 2) c.v(x, 5, 6, 'g2'); c.h(4, 4, 8, 'g2').h(4, 11, 8, 'g4'); });
T('dungeon-floor-rune', 'dungeon floor with magic rune glowing', 'floor', (c) => { DF(c); c.stamp(3, 3, ['...JJJJ...', '..J....J..', '.J..PP..J.', 'J..P..P..J', 'J.PPJJPP.J', 'J..P..P..J', 'J...PP...J', '.J..PP..J.', '..J....J..', '...JJJJ...']); });
T('dungeon-floor-slab', 'dungeon floor big stone slab', 'floor', (c) => { c.fill('g3').speck(10, 'g2').speck(6, 'g4'); c.h(0, 0, 16, 'g2').v(0, 0, 16, 'g2').h(0, 15, 16, 'g4').v(15, 0, 16, 'g4'); });
T('dungeon-floor-bones', 'dungeon floor with bones remains', 'floor', (c) => { DF(c); ostamp(c, 2, 3, ['W..W', '.WW.', 'W..W'], 'g4'); ostamp(c, 9, 9, ['.WWW.', 'WKWKW', '.WWW.', '.W.W.'], 'g4'); c.px(12, 3, 'w0').px(13, 4, 'w0').px(4, 12, 'w0').px(5, 12, 'w0'); });
T('dungeon-floor-puddle', 'dungeon floor with water puddle wet', 'floor', (c) => { DF(c); c.stamp(3, 5, ['...UUUUU..', '.UUBBBBBU.', 'UBBABBBBBU', 'UBBBBBBABU', '.UUBBBBUU.', '...UUUU...']); });
T('dungeon-wall', 'dungeon stone wall face front bricks', 'wall', (c) => face(c, 'grey', 'g4'));
T('dungeon-wall-left', 'dungeon wall face left end corner', 'wall', (c) => { face(c, 'grey', 'g4'); faceEnd(c, true, 'g4', 'g3'); });
T('dungeon-wall-right', 'dungeon wall face right end corner', 'wall', (c) => { face(c, 'grey', 'g4'); faceEnd(c, false, 'g4', 'g3'); });
T('dungeon-wall-cracked', 'dungeon wall cracked damaged', 'wall', (c) => { face(c, 'grey', 'g4'); let x = 9; for (let y = 1; y < 13; y++) { c.px(x, y, 'k'); if (y === 4) c.px(x - 1, y, 'k').px(x - 2, y + 1, 'k'); if (y === 8) c.px(x + 1, y, 'k').px(x + 2, y + 1, 'k').px(x + 3, y + 1, 'k'); x += [0, -1, 0, 1, 1, -1][y % 6]; } });
T('dungeon-wall-mossy', 'dungeon wall mossy vines damp', 'wall', (c) => { face(c, 'grey', 'g4'); c.speck(12, 'n1', 0, 0, 16, 14); c.rect(1, 1, 4, 2, 'n1').h(1, 1, 3, 'n2').rect(9, 5, 5, 2, 'n1').h(10, 5, 3, 'n2').v(3, 3, 5, 'n1').v(11, 7, 4, 'n1').px(3, 5, 'n2').px(11, 9, 'n2'); });
T('dungeon-wall-torch', 'dungeon wall with torch fire light', 'wall', (c) => { face(c, 'grey', 'g4'); c.stamp(5, 1, ['..KK..', '.KRRK.', 'KROORK', 'KROYRK', 'KOYYOK', '.KOOK.', '.KTTK.', 'KxTTxK', '.KTTK.', '.KTTK.', '..KK..']); });
const BANNER = ['xxxxxxxx', '.abbbba.', '.abccba.', '.abccba.', '.abbbba.', '.abbbba.', '.ab..ba.', '.a....a.'];
const banner = (c, r, x = 4, y = 2) => { const [d, m] = ramp(r); const rows = BANNER.map((row) => row.replace(/a/g, 'Q').replace(/b/g, 'P').replace(/c/g, 'Y')); ostamp(c, x, y, rows); each((px, py) => { if (c.get(px, py) === PAL.p1 && py >= y && py < y + 8) c.px(px, py, d); else if (c.get(px, py) === PAL.p2 && py >= y && py < y + 8) c.px(px, py, m); }); };
T('dungeon-wall-banner', 'dungeon wall with red banner flag', 'wall', (c) => { face(c, 'grey', 'g4'); banner(c, 'red'); });
T('dungeon-wall-banner-blue', 'dungeon wall with blue banner flag', 'wall', (c) => { face(c, 'grey', 'g4'); banner(c, 'blue'); });
T('dungeon-wall-chains', 'dungeon wall with chains shackles prison', 'wall', (c) => { face(c, 'grey', 'g4'); for (const x of [3, 10]) ostamp(c, x, 1, ['.ww', '.x.', '.w.', '.x.', '.w.', '.x.', 'www', 'w.w', 'www']); });
T('dungeon-wall-bars', 'dungeon wall with window bars prison cell', 'wall', (c) => { face(c, 'grey', 'g4'); c.rect(3, 2, 10, 10, 'g4').rect(4, 3, 8, 8, 'k'); for (const x of [5, 7, 9]) c.v(x, 3, 8, 'g1').v(x + 1, 3, 8, 'g3'); c.h(3, 12, 10, 'g1').h(3, 2, 10, 'k'); });
T('dungeon-wall-shield', 'dungeon wall with shield crest swords', 'wall', (c) => { face(c, 'grey', 'g4'); ostamp(c, 4, 2, ['RRRRBBBB', 'RRRRBBBB', 'RRYYYYBB', 'RRRYYBBB', 'BBBYYRRR', '.BBBRRR.', '..BBRR..', '...BR...']); });
T('dungeon-wall-skull', 'dungeon wall with skull niche alcove', 'wall', (c) => { face(c, 'grey', 'g4'); c.rect(4, 3, 8, 9, 'k').h(5, 2, 6, 'k').h(4, 12, 8, 'g1'); c.stamp(5, 5, ['.WWWW.', 'WWWWWW', 'WKWWKW', 'WWWWWW', '.WKKW.', '.wWWw.']); });
T('dungeon-wall-fountain', 'dungeon wall with water spout drain', 'wall', (c) => { face(c, 'grey', 'g4'); ostamp(c, 5, 3, ['wwwwww', 'wxKKxw', '.xKKx.']); c.v(7, 6, 9, 'b2').v(8, 6, 9, 'b3').px(6, 14, 'b3').px(9, 14, 'b3').h(5, 15, 6, 'b2'); });
wallTopSet('dungeon-top', 'dungeon stone', { base: 'g4', dark: 'k', light: null, rim: 'g3', hi: 'g2' });
T('dungeon-doorway', 'dungeon doorway open arch door passage', 'floor', (c) => { face(c, 'grey', 'g4'); arch(c, ['g1', 'g2', 'g3'], (k) => k.rect(4, 13, 8, 3, 'g4').h(5, 12, 6, 'g4').h(4, 15, 8, 'g3')); });
T('dungeon-door', 'dungeon closed wooden door in wall', 'wall', (c) => { face(c, 'grey', 'g4'); arch(c, ['g1', 'g2', 'g3'], (k) => doorLeaf(k, 4, 4, 8, 12)); c.px(4, 4, 'k').px(11, 4, 'k'); });
T('dungeon-door-locked', 'dungeon locked door padlock in wall', 'wall', (c) => { face(c, 'grey', 'g4'); arch(c, ['g1', 'g2', 'g3'], (k) => doorLeaf(k, 4, 4, 8, 12)); c.px(4, 4, 'k').px(11, 4, 'k'); ostamp(c, 6, 7, PADLOCK); });
T('dungeon-door-iron', 'dungeon iron door gate portcullis bars closed', 'wall', (c) => { face(c, 'grey', 'g4'); arch(c, ['g1', 'g2', 'g3'], (k) => { for (let x = 4; x < 12; x += 2) k.v(x, 4, 12, 'g2').v(x + 1, 4, 12, 'k'); k.h(4, 7, 8, 'g1').h(4, 11, 8, 'g1'); for (let x = 4; x < 12; x += 2) k.px(x, 15, 'g1'); }); c.px(4, 4, 'k').px(11, 4, 'k'); });
T('dungeon-stairs-up', 'stairs up stone steps staircase', 'floor', (c) => { steps(c, ['w0', 'g1', 'g3'], 2, 12); c.rect(0, 0, 2, 16, 'g4').rect(14, 0, 2, 16, 'g4').v(1, 0, 16, 'g3').v(14, 0, 16, 'g3'); });
T('dungeon-stairs-down', 'stairs down stone steps descend cellar', 'floor', (c) => { c.fill('k'); const cols = ['g4', 'g4', 'g3', 'g2']; for (let i = 0; i < 4; i++) c.rect(2 + (3 - i), i * 4, 12 - 2 * (3 - i), 4, cols[i]).h(2 + (3 - i), i * 4, 12 - 2 * (3 - i), i ? cols[i - 1] : 'k').h(2 + (3 - i), i * 4 + 3, 12 - 2 * (3 - i), i < 3 ? cols[i + 1] : 'g1'); c.rect(0, 0, 2, 16, 'g3').rect(14, 0, 2, 16, 'g3').v(0, 0, 16, 'g2').v(15, 0, 16, 'g4').h(0, 0, 16, 'g2'); c.rect(2, 0, 12, 2, 'k'); });
shoreSet('pit', 'pit hole chasm drop', 'wall', PIT, ['o']);
const spikeFloor = (c, up) => { DF(c); for (const [x, y] of [[3, 3], [11, 3], [3, 11], [11, 11], [7, 7]]) { c.rect(x - 1, y, 3, 2, 'k'); if (up) c.px(x, y - 3, 'w0').v(x, y - 2, 3, 'g1').px(x - 1, y, 'g2').px(x + 1, y, 'g3').px(x + 1, y - 1, 'g3'); } };
T('dungeon-spikes-up', 'floor spikes up trap raised danger', 'floor', (c) => spikeFloor(c, true));
T('dungeon-spikes-down', 'floor spikes down trap holes retracted', 'floor', (c) => spikeFloor(c, false));
T('dungeon-plate', 'pressure plate floor switch raised', 'floor', (c) => { DF(c); c.rect(3, 3, 10, 10, 'g2').h(3, 3, 10, 'w0').v(3, 3, 10, 'g1').h(3, 12, 10, 'g4').v(12, 3, 10, 'g4').h(3, 13, 10, 'k').rect(6, 6, 4, 4, 'g1').h(6, 9, 4, 'g3').v(9, 6, 4, 'g3'); });
T('dungeon-plate-down', 'pressure plate floor switch pressed down', 'floor', (c) => { DF(c); c.rect(3, 3, 10, 10, 'g3').h(3, 3, 10, 'k').v(3, 3, 10, 'k').h(4, 12, 9, 'g2').v(12, 4, 9, 'g2').rect(6, 6, 4, 4, 'o2').h(6, 6, 4, 'o1').v(6, 6, 4, 'o1'); });
T('dungeon-trapdoor', 'trapdoor closed wooden hatch in floor', 'floor', (c) => { DF(c); c.rect(2, 2, 12, 12, 't2'); for (let x = 2; x < 14; x += 4) c.v(x, 2, 12, 't3').v(x + 3, 2, 12, 't1'); c.h(2, 4, 12, 'g3').h(2, 11, 12, 'g3').h(2, 2, 12, 't1').h(2, 13, 12, 'k').v(1, 2, 12, 'k').v(14, 2, 12, 'k').h(2, 1, 12, 'k').h(2, 14, 12, 'k'); c.stamp(6, 6, ['.xx.', 'x..x', 'x..x', '.XX.']); });
T('dungeon-trapdoor-open', 'trapdoor open hole hatch in floor', 'wall', (c) => { DF(c); c.rect(2, 2, 12, 12, 'k').rect(2, 2, 12, 3, 'g4').v(1, 2, 12, 'g4').v(14, 2, 12, 'g2').h(2, 14, 12, 'g2').h(1, 1, 14, 'g4'); c.rect(2, 0, 12, 3, 't2').h(2, 0, 12, 't3').h(2, 2, 12, 't1').v(5, 0, 3, 't1').v(9, 0, 3, 't1'); for (let y = 5; y < 13; y += 2) c.h(6, y, 4, 't2'); c.v(6, 4, 9, 't3').v(9, 4, 9, 't3'); });

category('house', 'House & castle', 'tile');
const woodH = (c, r = 'brown') => { const [d, m, l] = ramp(r); c.fill(m); for (let y = 0; y < 16; y += 4) { c.h(0, y, 16, l).h(0, y + 3, 16, d); const x = (y * 3 + 5) % 16; c.v(x, y, 3, d).px((x + 6) % 16, y + 1, d).px((x + 7) % 16, y + 1, d).px((x + 11) % 16, y + 2, l); } };
T('wood-floor-h', 'wooden floor planks horizontal boards', 'floor', (c) => woodH(c));
T('wood-floor-v', 'wooden floor planks vertical boards', 'floor', turned('t', (c) => woodH(c)));
T('wood-floor-light', 'light wooden floor pine planks', 'floor', (c) => woodH(c, 'tan'));
T('wood-floor-parquet', 'parquet wooden floor pattern', 'floor', (c) => { each((x, y) => { const q = ((x >> 3) + (y >> 3)) % 2, k = (q ? x : y) % 4, e = (q ? y : x) % 8; c.px(x, y, k === 3 || e === 7 ? 't1' : k === 0 ? 't3' : 't2'); }); });
carpetSet('carpet-red', 'red', 'red', 'y2');
carpetSet('carpet-blue', 'blue', 'blue', 'w0');
T('carpet-green', 'green carpet rug centre middle', 'floor', (c) => carpet(c, '', 'green', 'y2'));
T('carpet-purple', 'purple royal carpet rug centre middle', 'floor', (c) => carpet(c, '', 'purple', 'y2'));
T('kitchen-floor', 'kitchen tiled floor blue white tiles bathroom', 'floor', (c) => each((x, y) => c.px(x, y, x % 4 === 3 || y % 4 === 3 ? 'g1' : ((x >> 2) + (y >> 2)) % 2 ? 'b3' : 'w0')));
T('marble-floor', 'marble floor white palace castle', 'floor', (c) => { c.fill('w0').speck(6, 'g1'); for (let i = 0; i < 16; i++) { c.px(i, (i * 2 + 3 + (i >> 2)) % 16, 'g1'); if (i % 3) c.px((i + 7) % 16, (22 - i) % 16, 'b3'); } c.h(0, 15, 16, 'g1').v(15, 0, 16, 'g1'); });
T('marble-floor-diamond', 'marble floor diamond pattern black white hall', 'floor', (c) => each((x, y) => { const a = Math.abs((x % 8) - 3.5) + Math.abs((y % 8) - 3.5); c.px(x, y, a < 3.5 ? 'g3' : a < 4.5 ? 'g1' : 'w0'); }));
T('castle-floor', 'castle floor red stone tiles hall', 'floor', (c) => { each((x, y) => c.px(x, y, x % 8 === 7 || y % 8 === 7 ? 'g4' : x % 8 === 0 || y % 8 === 0 ? 'r3' : ((x >> 3) + (y >> 3)) % 2 ? 'r1' : 'r2')); });
/** wallpaper wall face with wooden skirting; a/b: paper colours */
function paper(c, a, b) {
  c.fill(a); each((x, y) => { if (x % 4 === 1) c.px(x, y, b); });
  for (let x = 3; x < 16; x += 8) for (let y = 4; y < 10; y += 4) c.px(x, y, b).px((x + 4) % 16, y + 2, b);
  c.h(0, 0, 16, 't3').h(0, 1, 16, 't1').h(0, 11, 16, 't3').rect(0, 12, 16, 3, 't2').h(0, 15, 16, 'k');
  for (let x = 3; x < 16; x += 4) c.v(x, 12, 3, 't1');
}
const PAPER = (c) => paper(c, 'y3', 'o3');
T('house-wall', 'house wall wallpaper cream yellow inside', 'wall', PAPER);
T('house-wall-blue', 'house wall wallpaper blue inside', 'wall', (c) => paper(c, 'b3', 'b2'));
T('house-wall-green', 'house wall wallpaper green inside', 'wall', (c) => paper(c, 'n3', 'n2'));
T('house-wall-left', 'house wall left end corner', 'wall', (c) => { PAPER(c); faceEnd(c, true, 't1', 't2'); });
T('house-wall-right', 'house wall right end corner', 'wall', (c) => { PAPER(c); faceEnd(c, false, 't1', 't2'); });
T('house-wall-brick', 'brick wall face red bricks house', 'wall', (c) => face(c, 'red', 'g1'));
T('house-wall-wood', 'wooden wall planks cabin hut', 'wall', (c) => { c.fill('t2'); for (let x = 0; x < 16; x += 4) c.v(x, 0, 16, 't3').v(x + 3, 0, 16, 't1').px(x + 1, (x * 3 + 4) % 11 + 2, 't1'); c.h(0, 0, 16, 't3').h(0, 1, 16, 't1').h(0, 14, 16, 't1').h(0, 15, 16, 'k'); });
T('house-wall-plaster', 'white plaster wall timber frame tavern', 'wall', (c) => { c.fill('w0').speck(8, 'g1'); c.h(0, 0, 16, 't3').h(0, 1, 16, 't1').v(0, 2, 13, 't2').v(15, 2, 13, 't1').rect(0, 12, 16, 3, 't2').h(0, 12, 16, 't3').h(0, 15, 16, 'k'); });
T('house-wall-window', 'house wall with window glass curtains', 'wall', (c) => { PAPER(c); c.rect(3, 2, 10, 9, 't1').rect(4, 3, 8, 7, 'b3').v(7, 3, 7, 't1').v(8, 3, 7, 't2').h(4, 6, 8, 't1').px(5, 4, 'w0').px(6, 4, 'w0').px(5, 5, 'w0').px(10, 8, 'w0').v(4, 3, 7, 'r2').v(11, 3, 7, 'r2').px(4, 3, 'r3').px(11, 3, 'r3').h(2, 11, 12, 't3').h(2, 2, 12, 't2'); });
T('house-wall-painting', 'house wall with painting picture frame', 'wall', (c) => { PAPER(c); ostamp(c, 3, 2, ['YYYYYYYYYY', 'YAAAAAEEAO', 'YAAWAAEEAO', 'YAAAAGAAAO', 'YAGGGGGHAO', 'YGGHGGGGGO', 'YOOOOOOOOO']); });
T('house-wall-bookshelf', 'wall with bookshelf books library', 'wall', (c) => { c.fill('t1'); const cols = ['r2', 'b2', 'n2', 'y2', 'p2', 'o2', 'g1', 'c2']; for (let s = 0; s < 3; s++) { const y = 1 + s * 5; for (let x = 1; x < 15; x++) { const k = (x * 5 + s * 3) % 8, h = 4 - ((x + s) % 3 === 0 ? 1 : 0); c.v(x, y + 4 - h, h, cols[k]); if ((x + s) % 4 === 1) c.px(x, y + 2, 'y3'); } c.h(0, y + 4, 16, 't3'); } c.v(0, 0, 16, 't2').v(15, 0, 16, 't2').h(0, 0, 16, 't3').h(0, 15, 16, 'k'); });
T('house-wall-fireplace', 'wall with fireplace fire hearth chimney', 'wall', (c) => { PAPER(c); c.rect(1, 3, 14, 12, 'g2').h(0, 3, 16, 'g1').h(0, 4, 16, 'g3'); for (let y = 6; y < 15; y += 3) c.h(1, y, 14, 'g3'); for (let y = 5; y < 15; y++) c.px((y % 6 < 3 ? 2 : 13), y, 'g3'); c.rect(4, 7, 8, 8, 'k').h(5, 6, 6, 'k'); c.stamp(5, 8, ['..R...', '.ROR.R', '.OYOR.', 'ROYYOR', 'OYEEYO']).h(4, 13, 8, 't2').h(5, 14, 6, 't1'); c.h(0, 15, 16, 'k'); });
T('house-wall-clock', 'wall with clock time', 'wall', (c) => { PAPER(c); ostamp(c, 4, 2, ['..TTTT..', '.TWWWWT.', 'TWWKWWWT', 'TWWKWWWT', 'TWWKKKWT', 'TWWWWWWT', '.TWWWWT.', '..TTTT..']); });
T('house-wall-candle', 'wall with candle sconce light', 'wall', (c) => { PAPER(c); ostamp(c, 6, 2, ['.Y..', 'YEY.', '.Y..', '.W..', '.W..', 'xxxx', '.xx.']); });
T('house-wall-shelf', 'wall with shelf pots jars kitchen', 'wall', (c) => { PAPER(c); ostamp(c, 2, 3, ['.RR..BB..OO.', '.RR.BBBB.OO.', 'RRRRBBBBOOOO', 'TTTTTTTTTTTT', '.C........C.']); });
T('house-wall-mirror', 'wall with mirror', 'wall', (c) => { PAPER(c); ostamp(c, 4, 1, ['..YYYY..', '.YAAAAY.', 'YAWAAAAY', 'YAAWAAAY', 'YAAAAAAY', 'YAAAAWAY', 'YAAAAAAY', '.YAAAAY.', '..YYYY..']); });
T('house-door', 'house door closed in wall wooden', 'wall', (c) => { PAPER(c); c.rect(3, 1, 10, 15, 't1'); doorLeaf(c, 4, 2, 8, 14, 'tan'); c.h(4, 15, 8, 'k'); });
T('house-door-open', 'house door open doorway in wall', 'floor', (c) => { PAPER(c); c.rect(3, 1, 10, 15, 't1').rect(4, 2, 8, 14, 'k').rect(4, 13, 8, 3, 't1').h(4, 15, 8, 't2').rect(4, 2, 2, 13, 't3').v(5, 2, 13, 't2'); });
T('house-stairs', 'wooden stairs up staircase steps', 'floor', (c) => { steps(c, ['y3', 't3', 't1'], 2, 12); c.rect(0, 0, 2, 16, 't2').rect(14, 0, 2, 16, 't2').v(0, 0, 16, 't3').v(15, 0, 16, 't1'); });
wallTopSet('house-top', 'house wooden', { base: 't1', dark: 'k', light: null, rim: 't2', hi: 't3' });

category('cave', 'Cave & mine', 'tile');
const CF = GROUND.caveFloor;
const caveFace = (c) => { boulders(c, 'k', 'g4', 'g2', 'k'); c.h(0, 14, 16, 'k').h(0, 15, 16, 'k'); };
T('cave-floor', 'cave floor rock ground', 'floor', CF);
T('cave-floor-pebbles', 'cave floor with pebbles gravel', 'floor', (c) => { CF(c); for (const [x, y, w] of [[5, 2, 3], [12, 7, 2], [3, 8, 2], [8, 13, 3]]) c.h(x, y, w, 'g1').h(x, y + 1, w, 'g4'); });
T('cave-floor-cracked', 'cave floor cracked glowing lava cracks', 'floor', (c) => { CF(c); let x = 5; for (let y = 0; y < 16; y++) { c.px(x, y, y % 4 === 1 ? 'y2' : 'o2').px(x - 1, y, 'g4'); if (y === 7) c.px(x + 1, y, 'o2').px(x + 2, y + 1, 'r2').px(x + 3, y + 1, 'r2'); x += [1, 0, 1, -1, 0, 1, -1, -1][y % 8]; } });
T('cave-floor-mushrooms', 'cave floor with glowing mushrooms', 'floor', (c) => { CF(c); for (const [x, y] of [[2, 3], [10, 5], [5, 10]]) c.stamp(x, y, ['.22.', '2A22', '.WW.']).h(x, y + 3, 4, 'g4'); c.stamp(12, 12, ['22', '.W']); });
T('cave-floor-moss', 'cave floor mossy damp', 'floor', (c) => { CF(c); c.speck(12, 'n1').rect(2, 9, 4, 3, 'n1').rect(9, 2, 5, 2, 'n1').px(3, 10, 'n2').px(11, 2, 'n2').px(10, 3, 'n2'); });
T('cave-wall', 'cave wall rock face front', 'wall', caveFace);
T('cave-wall-top', 'cave rock top dark ceiling', 'wall', (c) => { c.fill('k').speck(12, 'g4'); for (const [x, y] of [[2, 3], [9, 1], [12, 8], [5, 11], [1, 13]]) c.h(x, y, 3, 'g4').px(x + 1, y + 1, 'g4'); });
const crystals = (c, a) => { caveFace(c); for (const [x, y] of [[2, 2], [9, 6], [4, 9]]) c.stamp(x, y, a); };
T('cave-wall-crystal', 'cave crystal wall blue crystals', 'wall', (c) => crystals(c, ['..A.', '.AW.', '.AB.', 'ABBU']));
T('cave-wall-crystal-purple', 'cave crystal wall purple amethyst', 'wall', (c) => crystals(c, ['..J.', '.JW.', '.JP.', 'JPPQ']));
const nuggets = (c, r) => { const [d, m, l] = ramp(r); caveFace(c); for (const [x, y] of [[2, 2], [10, 1], [6, 6], [12, 9], [3, 10]]) c.rect(x, y, 2, 2, m).px(x, y, l).px(x + 2, y + 1, d).px(x + 1, y + 2, d); };
T('cave-wall-gold', 'cave ore wall gold vein', 'wall', (c) => nuggets(c, 'gold'));
T('cave-wall-iron', 'cave ore wall iron copper vein', 'wall', (c) => nuggets(c, 'copper'));
T('cave-wall-gems', 'cave ore wall ruby gems red', 'wall', (c) => nuggets(c, 'red'));
T('cave-wall-emerald', 'cave ore wall emerald green gems', 'wall', (c) => nuggets(c, 'lime'));
T('cave-wall-beams', 'mine wall wooden support beams timber', 'wall', (c) => { caveFace(c); c.rect(1, 0, 3, 16, 't2').v(1, 0, 16, 't3').v(3, 0, 16, 't1').rect(12, 0, 3, 16, 't2').v(12, 0, 16, 't3').v(14, 0, 16, 't1').rect(0, 1, 16, 3, 't2').h(0, 1, 16, 't3').h(0, 3, 16, 't1').px(2, 2, 'g1').px(13, 2, 'g1').h(0, 15, 16, 'k'); });
T('cave-entrance', 'cave entrance tunnel mine opening dark', 'floor', (c) => { caveFace(c); c.rect(3, 4, 10, 12, 'k').h(4, 3, 8, 'k').h(6, 2, 4, 'k').h(4, 15, 8, 'g3').h(5, 14, 6, 'g4'); for (const [x, y] of [[2, 6], [13, 6], [2, 11], [13, 11], [5, 2], [10, 2]]) c.px(x, y, 'g2'); });
T('mine-entrance-beams', 'mine entrance tunnel wooden frame', 'floor', (c) => { caveFace(c); c.rect(2, 1, 12, 15, 't2').v(2, 1, 15, 't3').v(13, 1, 15, 't1').h(1, 1, 14, 't3').h(1, 2, 14, 't2').h(1, 3, 14, 't1').rect(4, 4, 8, 12, 'k').h(4, 15, 8, 'g3').h(5, 14, 6, 'g4'); });
for (const [slug, conn, name] of [['h', 'ew', 'straight horizontal'], ['v', 'ns', 'straight vertical'], ['curve-tl', 'es', 'curve corner top left'], ['curve-tr', 'sw', 'curve corner top right'], ['curve-bl', 'ne', 'curve corner bottom left'], ['curve-br', 'nw', 'curve corner bottom right'], ['cross', 'nesw', 'crossing']]) T(`rails-${slug}`, `mine rails track ${name}`, 'floor', (c) => rails(c, conn, CF));
T('rails-end', 'mine rails track end buffer stop', 'floor', (c) => { rails(c, 'ns', CF); c.rect(0, 0, 16, 7, null); const g = sub('rails-end/g', CF); each((x, y) => { if (y < 7) c.px(x, y, KEY[g[y][x]]); }); c.rect(2, 5, 12, 3, 't2').h(2, 5, 12, 't3').h(2, 7, 12, 't1').rect(3, 3, 2, 2, 'r2').rect(11, 3, 2, 2, 'r2'); });
T('void', 'dark void black nothing abyss', 'wall', (c) => { c.fill('k'); for (const [x, y] of [[3, 4], [12, 9]]) c.px(x, y, 'g4'); });
T('void-stars', 'void with stars space night sky', 'wall', (c) => { c.fill('k').speck(5, 'g4').speck(3, 'p1'); c.px(3, 3, 'w0').px(11, 6, 'g1').px(6, 12, 'b3').px(13, 13, 'g2'); });

category('wild', 'Snow & desert', 'tile');
T('snow-plain', 'snow plain smooth white ground', 'floor', (c) => c.fill('w0').speck(4, 'b3'));
T('snow-drifts', 'snow drifts wind deep snow', 'floor', (c) => { c.fill('w0').speck(5, 'g1'); for (const [x, y, w] of [[1, 3, 6], [9, 6, 6], [3, 10, 7], [11, 14, 4]]) c.h(x, y, w, 'b3').px(x - 1, y - 1, 'b3').px(x + w, y - 1, 'b3').h(x + 1, y + 1, w - 2, 'g1'); });
T('snow-tracks', 'snow with footprints tracks', 'floor', (c) => { TILES.snow(c); for (const [x, y] of [[4, 2], [9, 5], [5, 9], [10, 12]]) c.rect(x, y, 2, 3, 'b3').h(x, y + 2, 2, 'g2'); });
T('snow-grass', 'snow with grass poking through thaw', 'floor', (c) => { TILES.snow(c); for (const [x, y] of [[2, 4], [9, 2], [12, 9], [5, 11]]) c.stamp(x, y, ['G.G', 'NGN']); });
T('snow-rocks', 'snow with rocks stones', 'floor', (c) => { TILES.snow(c); for (const [x, y, w] of [[3, 4, 4], [10, 10, 3]]) c.h(x, y - 1, w, 'w0').h(x, y, w, 'g1').rect(x, y + 1, w, 2, 'g2').h(x, y + 3, w, 'b3'); });
T('snow-path', 'trodden snow path packed', 'floor', (c) => { c.fill('g1').speck(14, 'w0').speck(8, 'b3').speck(4, 'g2'); });
T('ice-cracked', 'cracked ice thin frozen lake', 'floor', (c) => { TILES.ice(c); let x = 6; for (let y = 0; y < 16; y++) { c.px(x, y, 'b1'); if (y === 5) c.px(x + 1, y, 'b1').px(x + 2, y + 1, 'b1').px(x + 3, y + 1, 'b2'); if (y === 11) c.px(x - 1, y, 'b1').px(x - 2, y + 1, 'b2'); x += [1, 0, -1, 1, 0, -1][y % 6]; } });
shoreSet('ice-pond', 'ice frozen pond lake snow', 'floor', FROZEN);
T('snow-wall', 'snowy rock wall face cliff', 'wall', (c) => { boulders(c, 'g4', 'g3', 'g2', 'g4'); c.rect(0, 0, 16, 3, 'w0'); for (let x = 0; x < 16; x++) { if ((x * 7 + 3) % 5 < 3) c.px(x, 3, 'w0'); if ((x * 5) % 7 === 0) c.px(x, 4, 'w0'); if ((x * 3) % 4 === 0) c.px(x, 3, 'b3'); } c.h(0, 14, 16, 'g4').h(0, 15, 16, 'k'); });
T('snow-wall-top', 'snowy wall top rock covered in snow', 'wall', (c) => { c.fill('b3'); for (const [x, y, r] of [[3, 3, 3], [11, 4, 3.4], [6, 11, 3.6], [14, 12, 2.5], [-1, 10, 2.5], [14, -1, 2], [3, 16, 2]]) c.disc(x, y, r, 'w0'); c.speck(4, 'g2'); });
T('ice-wall', 'ice brick wall face igloo frozen', 'wall', (c) => face(c, 'ice', 'b1'));
T('snow-pines', 'snowy pine forest trees winter woods', 'wall', (c) => { c.fill('g4'); for (const [cx, cy] of [[4, 3], [12, 3], [20, 3], [-4, 3], [0, 11], [8, 11], [16, 11], [4, 19], [12, 19], [8, -5], [0, -5], [16, -5]]) c.disc(cx, cy + 1, 4.2, 'g4').disc(cx, cy, 3.9, 'n1').disc(cx - 1, cy - 1, 2.3, 'w0').px(cx + 1, cy + 1, 'n2').px(cx - 1, cy, 'b3').px(cx + 2, cy - 1, 'w0'); });
T('sand-dunes', 'sand dunes desert waves', 'floor', (c) => { c.fill('o3').speck(6, 'y3'); for (let x = 0; x < 16; x++) for (const [y0, ph] of [[2, 0], [7, 5], [12, 10]]) { const y = y0 + Math.round(1.4 * Math.sin(((x + ph) / 16) * 2 * Math.PI)); c.px(x, y, 't3').px(x, y + 1, 'y3'); } });
T('desert-cracked', 'cracked desert ground dry earth', 'floor', (c) => { c.fill('t3').speck(8, 'o3'); for (const [x, y, dx, dy, n] of [[0, 5, 1, 0, 6], [5, 5, 0, -1, 6], [5, 5, 1, 1, 5], [9, 9, 1, 0, 7], [9, 9, 0, 1, 7], [3, 11, 1, 0, 6], [3, 11, 0, 1, 5], [3, 6, 0, 1, 6], [12, 0, 0, 1, 4], [12, 3, 1, 1, 4], [0, 14, 1, 0, 3]]) for (let i = 0; i < n; i++) c.px((x + dx * i + 16) % 16, (y + dy * i + 16) % 16, 't2'); });
T('sand-bones', 'sand with bones skull desert', 'floor', (c) => { TILES.sand(c); ostamp(c, 9, 3, ['.WWW.', 'WKWKW', '.WWW.', '.W.W.'], 't3'); ostamp(c, 2, 10, ['W...W', '.WWW.', 'W...W'], 't3'); });
T('sand-stones', 'sand with stones rocks desert', 'floor', (c) => { TILES.sand(c); for (const [x, y, w] of [[3, 4, 3], [10, 9, 4], [6, 12, 2]]) c.h(x, y, w, 'y3').h(x, y + 1, w, 't3').h(x, y + 2, w, 't2'); });
T('sandstone-floor', 'sandstone floor slabs temple pyramid', 'floor', GROUND.sandFloor);
T('sandstone-floor-glyph', 'sandstone floor with glyph eye symbol', 'floor', (c) => { GROUND.sandFloor(c); c.stamp(4, 5, ['..TTTT..', '.T....T.', 'T..CC..T', '.T.CC.T.', '..TTTT..', '...T....', '..T.....']); });
T('sandstone-wall', 'sandstone wall face bricks temple', 'wall', (c) => face(c, 'tan', 't2'));
T('sandstone-wall-left', 'sandstone wall left end corner', 'wall', (c) => { face(c, 'tan', 't2'); faceEnd(c, true, 't1', 't2'); });
T('sandstone-wall-right', 'sandstone wall right end corner', 'wall', (c) => { face(c, 'tan', 't2'); faceEnd(c, false, 't1', 't2'); });
T('sandstone-wall-glyphs', 'sandstone wall hieroglyphs carvings', 'wall', (c) => { face(c, 'tan', 't2'); c.rect(1, 3, 14, 9, 't3').h(1, 3, 14, 'y3').h(1, 11, 14, 't2'); c.stamp(2, 5, ['.C..CCC.C.C.', 'CCC.C.C.CCC.', '.C..CCC..C..', 'C.C..C..C.C.', '.C...C..C.C.']); });
T('sandstone-wall-torch', 'sandstone wall with torch', 'wall', (c) => { face(c, 'tan', 't2'); c.stamp(5, 1, ['..KK..', '.KRRK.', 'KROORK', 'KROYRK', 'KOYYOK', '.KOOK.', '.KTTK.', 'KxTTxK', '.KTTK.', '.KTTK.', '..KK..']); });
T('sandstone-doorway', 'sandstone doorway temple entrance open', 'floor', (c) => { face(c, 'tan', 't2'); arch(c, ['y3', 't3', 't2'], (k) => k.rect(4, 13, 8, 3, 't1').h(4, 15, 8, 't2')); });
T('sandstone-door', 'sandstone sealed door stone slab closed', 'wall', (c) => { face(c, 'tan', 't2'); arch(c, ['y3', 't3', 't2'], (k) => { k.rect(4, 4, 8, 12, 't3').h(5, 3, 6, 't3').v(4, 4, 12, 'y3').v(11, 4, 12, 't2').stamp(6, 6, ['.CC.', 'C..C', 'CCCC', '.CC.', '.CC.', '.CC.']); }); });
wallTopSet('sandstone-top', 'sandstone', { base: 't2', dark: 't1', light: null, rim: 't3', hi: 'y3' });
shoreSet('oasis', 'oasis water sand beach', 'wall', OASIS, INNER);

category('scifi', 'Sci-fi', 'tile');
const MF = GROUND.metalFloor, DM = GROUND.darkMetal;
T('scifi-floor', 'metal floor panel light spaceship lab', 'floor', MF);
T('scifi-floor-dark', 'dark metal floor plates', 'floor', DM);
T('scifi-floor-tread', 'metal tread plate floor diamond', 'floor', (c) => { c.fill('g2'); each((x, y) => { if (y % 4 === 0 && x % 4 < 2) c.px(x, y, 'g1'); if (y % 4 === 2 && (x + 2) % 4 < 2) c.px(x, y, 'g3'); }); });
T('scifi-floor-light', 'metal floor with light strip glowing', 'floor', (c) => { MF(c); c.rect(3, 6, 10, 4, 'g4').rect(4, 7, 8, 2, 'c2').h(5, 7, 5, 'b3').px(5, 7, 'w0'); });
T('scifi-floor-grate', 'metal grated floor grille vent', 'floor', (c) => { c.fill('g4'); each((x, y) => { if (y % 3 === 0) c.px(x, y, 'g2'); else if (y % 3 === 1) c.px(x, y, 'g3'); }); c.v(0, 0, 16, 'g1').v(15, 0, 16, 'g3').v(7, 0, 16, 'g3').v(8, 0, 16, 'g1'); });
T('scifi-floor-hazard', 'warning stripes floor yellow black hazard', 'floor', (c) => each((x, y) => c.px(x, y, ((x + y) >> 2) % 2 ? 'y2' : 'g4')));
T('scifi-floor-hazard-h', 'floor with warning stripe line horizontal', 'floor', (c) => { MF(c); each((x, y) => { if (y >= 6 && y < 10) c.px(x, y, ((x + y) >> 1) % 2 ? 'y2' : 'g4'); }); c.h(0, 5, 16, 'g3').h(0, 10, 16, 'g3'); });
T('scifi-floor-hazard-v', 'floor with warning stripe line vertical', 'floor', (c) => { MF(c); each((x, y) => { if (x >= 6 && x < 10) c.px(x, y, ((x + y) >> 1) % 2 ? 'y2' : 'g4'); }); c.v(5, 0, 16, 'g3').v(10, 0, 16, 'g3'); });
T('scifi-floor-arrow', 'floor with arrow up direction marker', 'floor', (c) => { DM(c); c.stamp(4, 3, ['...YY...', '..YYYY..', '.YYYYYY.', 'YY.YY.YY', '...YY...', '...YY...', '...YY...', '...YY...', '...YY...']); });
const sfWall = (c) => { c.fill('g3').h(0, 0, 16, 'g1').h(0, 1, 16, 'g2'); for (const x of [7, 15]) c.v(x, 2, 12, 'g4'); for (const x of [0, 8]) c.v(x, 2, 12, 'g2'); c.h(0, 4, 16, 'b1').h(0, 5, 16, 'b2').h(0, 11, 16, 'g4').h(0, 12, 16, 'g2').h(0, 14, 16, 'g4').h(0, 15, 16, 'k'); };
T('scifi-wall', 'metal wall face panels spaceship lab', 'wall', sfWall);
T('scifi-wall-left', 'metal wall left end corner', 'wall', (c) => { sfWall(c); faceEnd(c, true, 'g4', 'g4'); });
T('scifi-wall-right', 'metal wall right end corner', 'wall', (c) => { sfWall(c); faceEnd(c, false, 'g4', 'g4'); });
T('scifi-wall-screen', 'wall with screen monitor computer display', 'wall', (c) => { sfWall(c); c.rect(2, 2, 12, 9, 'k').rect(3, 3, 10, 7, 'c1').h(4, 4, 5, 'c2').h(4, 6, 7, 'c2').h(4, 8, 3, 'n3').px(11, 4, 'n3').px(10, 8, 'r2').px(11, 8, 'y2').px(3, 3, 'c2'); });
T('scifi-wall-pipes', 'wall with pipes tubes plumbing', 'wall', (c) => { sfWall(c); for (const y of [3, 8]) c.h(0, y, 16, 'g1').h(0, y + 1, 16, 'g2').h(0, y + 2, 16, 'g4').rect(4, y - 1, 2, 5, 'g2').v(4, y - 1, 5, 'g1').rect(11, y - 1, 2, 5, 'g2').v(11, y - 1, 5, 'g1'); ostamp(c, 7, 6, ['R.R', '.R.', 'R.R']); });
T('scifi-wall-vent', 'wall with vent grille air duct', 'wall', (c) => { sfWall(c); c.rect(3, 3, 10, 8, 'g1').rect(4, 4, 8, 6, 'k'); for (let y = 5; y < 10; y += 2) c.h(4, y, 8, 'g2'); c.h(3, 10, 10, 'g4').px(3, 3, 'w0').px(12, 3, 'g4'); });
T('scifi-wall-light', 'wall with lamp light bright', 'wall', (c) => { sfWall(c); c.rect(4, 6, 8, 4, 'g4').rect(5, 7, 6, 2, 'y3').h(5, 7, 6, 'w0').h(4, 10, 8, 'y2'); });
T('scifi-wall-window', 'wall with window to space stars porthole', 'wall', (c) => { sfWall(c); c.rect(2, 2, 12, 9, 'g1').rect(3, 3, 10, 7, 'k').px(5, 4, 'w0').px(10, 5, 'g1').px(7, 8, 'b3').px(11, 8, 'w0').disc(4, 9, 1.5, 'b1').px(4, 8, 'b2').h(2, 10, 12, 'g4').v(13, 2, 9, 'g4'); });
T('scifi-wall-lockers', 'wall with lockers cabinets storage', 'wall', (c) => { sfWall(c); for (const x of [1, 6, 11]) c.rect(x, 2, 4, 12, 'b2').v(x, 2, 12, 'b3').v(x + 3, 2, 12, 'b1').h(x + 1, 4, 2, 'b1').h(x + 1, 5, 2, 'b1').px(x + 2, 9, 'y2'); });
T('scifi-door', 'airlock door closed metal sliding door', 'wall', (c) => { sfWall(c); c.rect(2, 1, 12, 15, 'g1').rect(3, 2, 10, 14, 'g2').v(7, 2, 14, 'g4').v(8, 2, 14, 'k').v(3, 2, 14, 'w0').v(9, 2, 14, 'g1'); each((x, y) => { if (y >= 3 && y < 5 && x >= 3 && x < 13) c.px(x, y, ((x + y) >> 1) % 2 ? 'y2' : 'g4'); }); c.rect(5, 8, 2, 3, 'g4').rect(9, 8, 2, 3, 'g4').px(7, 1, 'r2').px(8, 1, 'r2').h(3, 15, 10, 'g4'); });
T('scifi-door-open', 'airlock door open passage', 'floor', (c) => { sfWall(c); c.rect(2, 1, 12, 15, 'g1').rect(3, 2, 10, 14, 'k').rect(3, 2, 2, 14, 'g2').v(3, 2, 14, 'w0').rect(11, 2, 2, 14, 'g2').v(12, 2, 14, 'g4').rect(5, 13, 6, 3, 'g4').h(5, 15, 6, 'g3').px(7, 1, 'n3').px(8, 1, 'n3'); });
T('scifi-teleporter', 'teleporter pad transporter warp floor', 'floor', (c) => { DM(c); each((x, y) => { const d = Math.hypot(x - 7.5, y - 7.5); if (d < 7.2) c.px(x, y, d > 6 ? 'g1' : d > 5 ? 'c1' : d > 3.6 ? 'c2' : d > 2.4 ? 'b3' : d > 1.2 ? 'c2' : 'w0'); }); });
const energy = (c) => { DM(c); each((x, y) => { if (y >= 4 && y < 12) { const k = (x * 3 + y * 5) % 7; c.px(x, y, y === 4 || y === 11 ? 'c1' : (y === 7 || y === 8) ? (k < 2 ? 'b3' : 'w0') : k < 2 ? 'w0' : k < 5 ? 'b3' : 'c2'); } }); c.h(0, 3, 16, 'g4').h(0, 12, 16, 'g4'); };
T('scifi-energy-h', 'energy field force field barrier laser horizontal', 'wall', energy);
T('scifi-energy-v', 'energy field force field barrier laser vertical', 'wall', turned('t', energy));
T('scifi-coolant', 'coolant acid toxic green liquid pool', 'wall', (c) => { waves(c, 'n2', 'n3', 'y3'); for (const [x, y] of [[4, 8], [12, 13]]) c.px(x, y, 'y3').px(x + 1, y, 'n1'); });
T('scifi-glass-floor', 'glass floor window to space', 'floor', (c) => { c.fill('b1').speck(4, 'k'); for (let i = 0; i < 16; i++) c.px(i, (20 - i) % 16, 'b2').px(i, (21 - i) % 16, 'b2'); c.px(4, 4, 'w0').px(11, 9, 'b3'); c.h(0, 0, 16, 'g1').v(0, 0, 16, 'g1').h(0, 15, 16, 'g3').v(15, 0, 16, 'g3'); });
wallTopSet('scifi-top', 'metal sci-fi', { base: 'g4', dark: 'k', light: null, rim: 'g2', hi: 'g1', dots: 'g3' });

// ═════════════════════════ LEVEL EDITOR: props to dress a level ═════════════════════════
// Free-standing things on a transparent background. Unlike finalize() the outline is
// drawn inside the canvas, so fences and walls may run right up to the tile border and
// join the next piece. solid: true marks things that normally block walking.
function outlineIn(grid) {
  const n = grid.length, edge = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!grid[y][x] && ((grid[y - 1] && grid[y - 1][x]) || (grid[y + 1] && grid[y + 1][x]) || grid[y][x - 1] || grid[y][x + 1])) edge.push([x, y]);
  for (const [x, y] of edge) grid[y][x] = PAL.k;
  return grid;
}
/** prop drawn by a routine. opts: solid, o (false = no outline), size */
function PD(slug, name, fn, opts = {}) {
  const item = { slug, name, make: () => { const size = opts.size || 16; const grid = Array.from({ length: size }, () => Array(size).fill(null)); fn(canvas(grid, slug)); return opts.o === false ? grid : outlineIn(grid); } };
  if (opts.solid) item.solid = true;
  cat.items.push(item);
}
/** prop from an ASCII picture (fixed colours): centred, standing on the bottom row but one, unless opts.x / opts.y say otherwise. opts.swap: 'AB' pairs of characters to recolour, opts.flip */
function PA(slug, name, src, opts = {}) {
  let rows = src.trim().split('\n').map((r) => r.trim());
  if (opts.swap) { const m = {}; opts.swap.split(' ').forEach((p) => { m[p[0]] = p[1]; }); rows = rows.map((r) => [...r].map((ch) => m[ch] || ch).join('')); }
  const size = opts.size || 16, w = Math.max(...rows.map((r) => r.length));
  if (w > size || rows.length > size) throw new Error(`${slug}: picture ${w}x${rows.length} too big`);
  if (opts.flip) rows = rows.map((r) => [...r.padEnd(w, '.')].reverse().join(''));
  const x = opts.x === undefined ? (size - w) >> 1 : opts.x, y = opts.y === undefined ? size - 1 - rows.length : opts.y;
  PD(slug, name, (c) => c.stamp(x, y, rows), opts);
}
/** fence piece: rails towards the sides in conn (n e s w) and a post in the middle */
function fence(c, conn, st) {
  const [l, m, d] = st.cols, has = (ch) => conn.includes(ch);
  const rows = st.single ? [7] : [7, 10];
  if (has('n')) c.v(7, 0, 9, l).v(8, 0, 9, m);
  if (has('s')) c.v(7, 9, 7, l).v(8, 9, 7, m);
  for (const y of rows) { if (has('w')) c.h(0, y, 8, l).h(0, y + 1, 8, m); if (has('e')) c.h(8, y, 8, l).h(8, y + 1, 8, m); }
  if (st.pickets) for (let x = 1; x < 16; x += 3) if ((x < 8 && has('w')) || (x > 8 && has('e'))) c.v(x, 5, 8, m).px(x, 4, l);
  c.rect(6, 4, 4, 10, m).v(6, 4, 10, l).v(9, 4, 10, d).h(6, 13, 4, d).h(6, 4, 3, l);
  if (st.cap) c.h(6, 3, 4, st.cap).px(7, 2, st.cap).px(8, 2, st.cap);
}
function lowWall(c, conn) {
  const has = (ch) => conn.includes(ch);
  const part = (x, y, w, h) => { c.rect(x, y, w, h, 'g2'); for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const X = x + i, Y = y + j; if (Y % 3 === 0) c.px(X, Y, 'g3'); else if ((X + (Y % 6 < 3 ? 0 : 2)) % 5 === 0) c.px(X, Y, 'g3'); } };
  if (has('n')) part(5, 0, 6, 9); if (has('s')) part(5, 8, 6, 8); if (has('w')) part(0, 5, 9, 9); if (has('e')) part(8, 5, 8, 9);
  if (has('n')) c.v(5, 0, 6, 'g1'); if (has('s')) c.v(5, 9, 7, 'g1');
  if (has('w')) c.h(0, 5, 8, 'w0').h(0, 6, 8, 'g1').h(0, 13, 8, 'g4'); if (has('e')) c.h(8, 5, 8, 'w0').h(8, 6, 8, 'g1').h(8, 13, 8, 'g4');
}
const FENCE_PIECES = [['h', 'ew', 'horizontal'], ['v', 'ns', 'vertical'], ['corner-tl', 'es', 'corner top left'], ['corner-tr', 'sw', 'corner top right'], ['corner-bl', 'ne', 'corner bottom left'], ['corner-br', 'nw', 'corner bottom right']];

category('barriers', 'Fences & barriers', 'thing');
const WOODF = { cols: ['t3', 't2', 't1'] }, IRONF = { cols: ['g1', 'g3', 'g4'], pickets: true, cap: 'g2' };
for (const [s, conn, n] of FENCE_PIECES) PD(`fence-${s}`, `wooden fence ${n}`, (c) => fence(c, conn, WOODF), { solid: true });
PD('fence-post', 'wooden fence post single end', (c) => fence(c, '', WOODF), { solid: true });
PD('fence-cross', 'wooden fence crossing junction', (c) => fence(c, 'nesw', WOODF), { solid: true });
PA('fence-gate', 'wooden fence gate closed', `
LTC..........LTC
LTCLLLLLLLLLLLTC
LTCTTTTTTTTTTLTC
LTC.LT.LT.LT.LTC
LTCLLLLLLLLLLLTC
LTCTTTTTTTTTTLTC
LTC.LT.LT.LT.LTC
LTC..........LTC
CCC..........CCC`, { x: 0, y: 5, solid: true });
PA('fence-gate-open', 'wooden fence gate open', `
LTC..........LTC
LTCL.........LTC
LTCT.........LTC
LTCL.........LTC
LTCT.........LTC
LTCL.........LTC
LTCT.........LTC
LTC..........LTC
CCC..........CCC`, { x: 0, y: 5 });
PA('fence-broken', 'broken wooden fence damaged', `
......LT........
.....LTTC.......
LL...LTTC.....L.
TTLL.LTTC...LLT.
.....LTTC..LT...
LLLL.LTTC.......
TTTTLLTTC..LLT..
.....LTTC.L..TT.
.....CCCC.......`, { x: 0, y: 5, solid: true });
for (const [s, conn, n] of FENCE_PIECES) PD(`iron-fence-${s}`, `iron fence railing ${n} graveyard`, (c) => fence(c, conn, IRONF), { solid: true });
PA('iron-gate', 'iron gate closed bars graveyard', `
.x............x.
xwX.x..xx..x.xwX
xwXxwxxwwxxwxxwX
xwX.w..ww..w.xwX
xwX.w..ww..w.xwX
xwX.w..wY..w.xwX
xwX.w..ww..w.xwX
xwXxwxxwwxxwxxwX
xwX.w..ww..w.xwX
XXX..........XXX`, { x: 0, y: 4, solid: true });
for (const [s, conn, n] of FENCE_PIECES) PD(`stone-wall-${s}`, `low stone wall ${n} garden`, (c) => lowWall(c, conn), { solid: true });
const hedge = (c, x, y, w, h) => { c.rect(x, y, w, h, 'n1'); for (let i = 0; i < w * h / 5; i++) { const X = x + c.int(w - 1), Y = y + c.int(h - 2); c.px(X, Y, 'n2').px(X + 1, Y, 'n2').px(X, Y + 1, 'n2'); if (i % 3 === 0) c.px(X + 1, Y, 'n3'); } c.h(x, y + h - 1, w, 'g4').h(x, y, w, 'n2'); };
PD('hedge-h', 'hedge horizontal green bush wall garden', (c) => hedge(c, 0, 4, 16, 10), { solid: true });
PD('hedge-v', 'hedge vertical green bush wall garden', (c) => hedge(c, 3, 0, 10, 16), { solid: true });
PD('hedge-block', 'hedge block square bush maze', (c) => hedge(c, 1, 2, 14, 13), { solid: true });
PA('hedge-round', 'round hedge topiary garden bush', `
...NGGN...
..NGHGGN..
.NGHGGGGN.
.NGGGGGNN.
.NGGGNGGN.
..NNGGNN..
....TC....
....TC....
...CTCC...`, { solid: true });
PD('bridge-rail-h', 'bridge rail railing horizontal rope', (c) => { fence(c, 'ew', { cols: ['t3', 't2', 't1'], single: true }); c.rect(0, 5, 2, 8, 't2').v(0, 5, 8, 't3').rect(14, 5, 2, 8, 't2').v(15, 5, 8, 't1'); }, { solid: true });
PD('bridge-rail-v', 'bridge rail railing vertical rope', (c) => { fence(c, 'ns', { cols: ['t3', 't2', 't1'], single: true }); }, { solid: true });
PA('barricade', 'wooden barricade spikes barrier', `
w....w....w..w
.L...L...L..L.
..L.L.L.L.LL..
LLLLLLLLLLLLLL
TTTTTTTTTTTTTT
..L.L.L.L.L.L.
.L.L...L.L...L
C..C.....C...C`, { solid: true });
PA('rope-barrier', 'rope barrier posts velvet museum', `
.YY........YY.
.YOZ......ZYO.
.YO.RRRRRR.YO.
.YO........YO.
.YO........YO.
.YO........YO.
OOOO......OOOO`, { solid: true });
PA('laser-gate', 'laser gate barrier red beams sci-fi', `
xwX........xwX
wRXIRIRIRIRwRX
xwX........xwX
xwXRIRIRIRIxwX
xwX........xwX
wRXIRIRIRIRwRX
xwX........xwX
XXX........XXX`, { solid: true });
PA('laser-gate-off', 'laser gate off posts sci-fi open', `
xwX........xwX
wVX........wVX
xwX........xwX
xwX........xwX
xwX........xwX
wVX........wVX
xwX........xwX
XXX........XXX`);

category('levelprops', 'Level props', 'thing');
const PILLAR = `
.wwwwwwww.
wWWWWWWWWx
.xxxxxxxx.
..WwwwxX..
..WwwwxX..
..WwwwxX..
..WwwwxX..
..WwwwxX..
..WwwwxX..
..WwwwxX..
.wwwwwwww.
wWWWWWWWWx
XXXXXXXXXX`;
PA('pillar-short', 'stone pillar column short', PILLAR, { solid: true });
PA('pillar-sandstone', 'sandstone pillar column desert temple', PILLAR, { solid: true, swap: 'WE wF xL XT' });
PA('pillar-short-broken', 'broken stone pillar ruin stump', `
....w.....
..Ww.wx...
..WwwwxX..
..WwwwxX.x
..WwwwxX..
.wwwwwwww.
wWWWWWWWWx
XXXXXXXXXX`, { solid: true });
PA('statue-knight', 'stone statue knight warrior', `
....ww....
...wWWx...
...wWWx...
..wwwwxx.w
.wWwwwxXxw
.wWwwwxX.w
.w.wwxX..w
...wwxX...
...w..X...
..wwwwxx..
.wWWWWWWx.
.XXXXXXXX.`, { solid: true });
PA('statue-angel', 'stone statue angel wings', `
....ww....
...wWWx...
w..wWWx..x
ww.wwxx.xx
wWwwWwxxXx
.wWwwwxXx.
..wwwwxx..
...wwxx...
...wwxx...
..wwwwxx..
.wWWWWWWx.
.XXXXXXXX.`, { solid: true });
PA('statue-broken', 'broken statue ruin pedestal', `
...w......
...wx..x..
...wwxxX..
..wwwwxx..
.wWWWWWWx.
.XXXXXXXX.`, { solid: true });
PA('fountain-small', 'small fountain water plaza', `
.....AA.....
....A..A....
...A.BB.A...
.....BB.....
..wwwBBwww..
.wWAABBAAWx.
wWABBBBBBAWx
wxABBBBBBAxX
.wxxxxxxxxX.
..XXXXXXXX..`, { solid: true });
PA('well-stone', 'stone well with roof village', `
.CCCCCCCCCC.
CTLLLLLLLLTC
.C........C.
.T...xx...T.
.T...xx...T.
.wwwwwwwwww.
wWKKKKKKKKWx
wwxwwxwwxwwx
wxwwxwwxwwxX
.XXXXXXXXXX.`, { solid: true });
PA('well-water', 'round well water hole from above', `
...wwwwww...
.wwWWWWWWxx.
wWWUUUUUUWxX
wWUBBABBBUxX
wWUBBBBABUxX
wwWUUUUUUWxX
.wxWWWWWWxX.
..xxxxxxXX..`, { solid: true });
PA('well-dry', 'dry empty well dark hole', `
...wwwwww...
.wwWWWWWWxx.
wWWKKKKKKWxX
wWKKKKKKKKxX
wWKKVKKKKKxX
wwWKKKKKKWxX
.wxWWWWWWxX.
..xxxxxxXX..`, { solid: true });
PA('sign-warning', 'warning sign skull danger signpost', `
.CCCCCCCC.
CLLLLLLLLC
CLLKLLKLLC
CLLLKKLLLC
CLLKLLKLLC
CTTTTTTTTC
.CCCTTCCC.
....TC....
....TC....
....TC....`, { solid: true });
PA('sign-board', 'notice board quest board papers', `
CCCCCCCCCCCC
CLWWLLLWWWLC
CLWWLEELWWLC
CLLLLEELLLLC
CLWWWLLLWWLC
CTTTTTTTTTTC
.TC......TC.
.TC......TC.
.TC......TC.`, { solid: true });
PA('street-lamp', 'street lamp post lit light town', `
..XXXX..
.XYEEYX.
.XEWWEX.
.XYEEYX.
..XXXX..
...XV...
...XV...
...XV...
...XV...
...XV...
...XV...
..XXVV..
.XXXVVV.`, { solid: true });
PA('lantern-post', 'lantern on wooden post light', `
.TTTTTTT.
.TC...x..
.TC..xYx.
.TC..YEY.
.TC..xYx.
.TC......
.TC......
.TC......
.TC......
.TC......
TTCC.....`, { solid: true });
PA('brazier-lit', 'brazier fire bowl lit burning', `
....R.....
...RO.R...
..ROYOR...
..OYEYOR..
.ROYEYYO..
XxxxxxxxxV
.XxxxxxxV.
..XVVVVV..
...X..V...
..X....V..
.XX....VV.`, { solid: true });
PA('brazier-unlit', 'brazier fire bowl unlit cold coals', `
.VKVVKVKV.
XxxxxxxxxV
.XxxxxxxV.
..XVVVVV..
...X..V...
..X....V..
.XX....VV.`, { solid: true });
PA('torch-stand', 'standing torch lit pole fire', `
..R...
.ROR..
.OYO..
.OEO..
XxxxV.
.TC...
.TC...
.TC...
.TC...
.TC...
.TC...
XTCV..`, { solid: true });
PA('stalagmite-tall', 'tall stalagmite cave rock spike', `
....x.....
...xwX....
...xwX....
..xwwX....
..xwxXX.x.
.xwwxXX.xX
.xwxxXVxwX
xwwxxXVxxX
xwxxXXVxXV`, { solid: true });
PA('stalagmites', 'stalagmites cluster small cave rocks', `
...x......
..xwX...x.
..xwX..xwX
.xwxX..xxX
.xwxXVxwxX
xwxxXVxxXV`, { solid: true });
const CRYSTAL = `
....A.....
...AWA..A.
...AWB.AWB
..AAWB.ABU
..AWBBUABU
.AAWBBUBBU
.AWBBBUBUU
.UBBBUUUU.`;
PA('crystal-blue', 'blue crystal cluster gem cave', CRYSTAL, { solid: true });
PA('crystal-green', 'green crystal cluster emerald cave', CRYSTAL, { solid: true, swap: 'AH BG UN' });
PA('crystal-red', 'red crystal cluster ruby cave', CRYSTAL, { solid: true, swap: 'AI BR UZ' });
PA('rubble', 'rubble pile stones debris ruin', `
.....xx.....
..ww.xXX.w..
.wxxX..wwxX.
wwxXXxwxxXXx
xXXVxxXXVxXV`);
PA('rubble-wood', 'broken planks wood debris wreck', `
..L.....T...
.LT..LL.TC..
..LTLTC.TC.L
.CLTTCLLTCLT
TTCCLTTCCTTC`);
PA('bones-pile', 'pile of bones remains skeleton', `
....WWW.....
...WKWKW....
.W.WWWWW..W.
WWW.WKW.WWW.
.WWWwwWWWw..
WWwWWWWwWWW.
.w.wWWw..ww.`);
PA('skull-pile', 'pile of skulls heap', `
.....WWW....
....WKWKW...
..WWWWWWWWW.
.WKWKWWKWKW.
.WWWWWWWWWW.
..WwW.WwW...`);
const WEB = `
WwwWwwwWwwwW....
wW..w...w.......
w.W..w...W......
W..W..ww........
ww..W...........
w.w..W..........
w..w..W.........
W..w............
w...W...........
w...............
w...............
W...............`;
PA('cobweb-corner', 'cobweb corner top left spider web', WEB, { x: 0, y: 0, o: false });
PA('cobweb-corner-right', 'cobweb corner top right spider web', WEB, { x: 0, y: 0, o: false, flip: true });
PA('floor-cracks', 'cracks decal broken floor crack', `
.....K......
....K.......
..K.K..K....
...KK.K.....
....KK......
..KK.K......
.K...KK.....
......K..K..
.......KK...
........K...`, { o: false, y: 3 });
PA('puddle', 'water puddle wet', `
...UUUUUU...
.UUBBBBBBUU.
UBBAABBBBBBU
UBBBBBBBABBU
.UUBBBBBBUU.
...UUUUU....`, { o: false, y: 6 });
PA('scorch-mark', 'scorch mark burnt ground ash', `
...VVVV...
.VVKKKKVV.
VKKKVKKKKV
VKKKKKVKKV
.VVKKKKVV.
...VVV....`, { o: false, y: 6 });
PA('floor-hole', 'hole in the floor pit small', `
..VVVVVV..
.VKKKKKKV.
VKKKKKKKKV
VKKKKKKKKV
.xKKKKKKx.
..xxxxxx..`, { o: false, y: 6 });
PA('grass-tuft', 'grass tuft blades weeds', `
.H...H..
.HG.HG.H
NHG.HGHG
NGGNGGGN
.NNNNNN.`);
PA('flower-patch', 'flower patch red yellow pink flowers', `
.R...Y....
RER.YEY.M.
.RG..YGMEM
.GH.GHG.MG
GHGGHGGHG.
.NNNNNNNN.`);
PA('stairs-wood', 'wooden stairs steps prop', `
........LLLL
........TTTC
....LLLLTTTC
....TTTCTTTC
LLLLTTTCTTTC
TTTCTTTCTTTC
TTTCTTTCTTTC`);
PA('ladder-hole', 'ladder down hole in floor cellar', `
..VVVVVVVV..
.VKKKKKKKKV.
VKTKKKKKKTKV
VKTLLLLLLTKV
VKTKKKKKKTKV
VKTLLLLLLTKV
VKTKKKKKKTKV
.VKTLLLLTKV.
..VVVVVVVV..`, { o: false, y: 4 });
const LEVER = `
.R........
RIX.......
.RxX......
...xX.....
....xX....
.wwwwwww..
wWWWWWWWx.
XXXXXXXXX.`;
PA('lever-floor-off', 'floor lever switch off red', LEVER);
PA('lever-floor-on', 'floor lever switch on green', LEVER, { flip: true, swap: 'RG IH' });
PA('floor-switch', 'floor switch button red round', `
..wwwwwwww..
.wRRRRRRRRx.
wRIIRRRRRRZx
wRRRRRRRRRZx
.xZZZZZZZZX.
..XXXXXXXX..`);
PA('floor-switch-pressed', 'floor switch button pressed green', `
..wwwwwwww..
.wGGGGGGGGx.
wxGHGGGGGNxX
.xXXXXXXXXX.`);
const BLOCK = `
WWWWWWWWWWWx
WwwwwwwwwwxX
WwwwwXXwwwxX
WwwwXxxXwwxX
WwwXxxxxXwxX
WwwXxxxxXwxX
WwwwXxxXwwxX
WwwwwXXwwwxX
WwwwwwwwwwxX
WxxxxxxxxxxX
xXXXXXXXXXXX`;
PA('push-block', 'pushable stone block puzzle', BLOCK, { solid: true });
PA('push-block-ice', 'pushable ice block puzzle frozen', BLOCK, { solid: true, swap: 'wA xB XU' });
PA('push-block-gold', 'pushable golden block puzzle', BLOCK, { solid: true, swap: 'WE wY xO XD' });
const BOULDER = `
...wwwww....
..wWWwwxxx..
.wWWwwwxxxX.
wWWwwwxxxxXX
wWwwwxxxxxXX
wwwwxxxxxXXX
wwxxxxxxXXXV
.xxxxxXXXXV.
..XXXXXXVV..`;
PA('boulder-round', 'round boulder big rock', BOULDER, { solid: true });
PA('boulder-mossy', 'mossy boulder rock green', `
...HHHHH....
..HHGGGGGx..
.wHGGwGGxxX.
wWWGwwxGxxXX
wWwwwxxxxxXX
wwwwxxxxxXXX
wwxxxxxxXXXV
.xxxxxXXXXV.
..XXXXXXVV..`, { solid: true });
PA('boulder-snowy', 'snowy boulder rock winter', `
...WWWWW....
..WWWWWWWA..
.wWWWAWWAxX.
wWAWwwxAxxXX
wWwwwxxxxxXX
wwwwxxxxxXXX
wwxxxxxxXXXV
.xxxxxXXXXV.
..XXXXXXVV..`, { solid: true });
PA('boulder-sandstone', 'sandstone boulder desert rock', BOULDER, { solid: true, swap: 'WE wF xL XT VC' });
PA('minecart-rails', 'minecart on rails mine cart track', `
..VVVVVVVVVV..
.VxxxxxxxxxxV.
.VXwwwwwwwwXV.
.VXxxxxxxxxXV.
..VXXXXXXXXV..
..VKXVVVVXKV..
TxVKKxTTxKKVxT
CCXXCCCCCCXXCC`, { solid: true });
PA('treasure-pile', 'treasure pile gold coins heap', `
......B.....
....YYAY.R..
..YEYYYYYIY.
.YYYOYEYYYYY
YEYYYYYOYYEY
OYYOYYYYYOYO
.OOOOOOOOOO.`);
PA('treasure-pile-big', 'big treasure hoard gold crown gems', `
.....YRY......
....YYEYY..B..
..W.YOOOY.BA..
.YYYEYYYYYYYE.
YEYYYOYYEYYOYY
YYOYYYYYYYYYEY
OYYYEYOYYOYYYO
.OOOOOOOOOOOO.`);
PA('cage-empty', 'empty iron cage prison small', `
...xxxxxx...
..xwwwwwwX..
..w.w.w.wX..
..w.w.w.wX..
..w.w.w.wX..
..w.w.w.wX..
..w.w.w.wX..
.xwwwwwwwwX.
.XXXXXXXXXX.`, { solid: true });
const ALTAR = `
..Y......Y..
..W......W..
.wWwwwwwwWw.
wWWWWWWWWWWx
.xRRRYYRRRX.
.xRRYRRYRRX.
.xwRRYYRRxX.
.xwwwwwwxxX.
wWWWWWWWWWWx
XXXXXXXXXXXX`;
PA('altar', 'stone altar with candles temple shrine', ALTAR, { solid: true });
PA('altar-dark', 'dark altar purple cult ritual', ALTAR, { solid: true, swap: 'RP YJ wX WX xV XK' });
PA('throne-stone', 'stone throne seat king', `
..ww....ww..
..wWwwwwWx..
..wWRRRRWx..
..wWRIRRWx..
..wWRRRRWx..
.wwWRRRRWxx.
.wWwwwwwwxX.
.wWRRRRRRxX.
.wxwwwwwwxX.
.wx......xX.
.XX......XX.`, { solid: true });
PA('stall-small', 'small market stall stand shop', `
.RRWWRRWWRRWW.
RRWWRRWWRRWWRR
ZZwwZZwwZZwwZZ
.T..........T.
.T..........T.
.T.R.Y.G.O..T.
LLLLLLLLLLLLLL
TTTTTTTTTTTTTT
.TC........TC.
.TC........TC.`, { solid: true });
PA('tent-small', 'small tent camp', `
......CC......
.....LLTT.....
....LLLTTT....
...LLLLTTTT...
..LLLLKKTTTT..
.LLLLKKKKTTTT.
LLLLLKKKKTTTTT
LLLLKKKKKKTTTT`, { solid: true });
PA('campfire-big', 'campfire lit burning fire stones', `
.....R......
....ROR..R..
...ROYOR....
...OYEYO....
..ROYEYOR...
.xTOYYYOTx..
xwTTCTTCTTwx
.xXCCxxCCXx.`, { solid: true });
PA('campfire-out', 'campfire unlit out cold ashes smoke', `
.....x......
....x.......
.....x......
............
.xTTVVVVTx..
xwTTCTTCTTwx
.xXCCxxCCXx.`);
PA('bedroll', 'bedroll sleeping bag camp bed', `
.WWW.........
WWwwBBBBBBBB.
WwwBBABBBBBBU
WwwBBBBBBABBU
.xxUUUUUUUUU.`);
const GATE = `
...wwwwwwww...
..wWxxxxxxWx..
.wWxPPJJPPxWx.
.wxPJJPPJJPxX.
.wxPJPWWPJPxX.
.wxJPWJJWPJxX.
.wxJPWJJWPJxX.
.wxPJPWWPJPxX.
.wxPJJPPJJPxX.
.wxPPJJPPJPxX.
.wxPJPPJJPPxX.
wWWxxxxxxxxWWx
XXXXXXXXXXXXXX`;
PA('portal-gate', 'stone portal gate active magic purple', GATE);
PA('portal-gate-off', 'stone portal gate inactive dark closed', GATE, { swap: 'PK JV WK', solid: true });
PA('scifi-crate', 'sci-fi metal crate container cargo', `
wwwwwwwwwwww
wWWWWWWWWWxX
wWxxxxxxxxxX
wWxOOKOOKOxX
wWxxxxxxxxxX
wWx22xxxxRxX
wWxxxxxxxxxX
wxxxxxxxxxxX
XXXXXXXXXXXX`, { solid: true });
PA('console', 'computer console terminal screen sci-fi', `
.VVVVVVVVVV.
.V11111111V.
.V1H1H2221V.
.V12221H11V.
.VVVVVVVVVV.
xwwwwwwwwwwX
wRwGwYwxxBwX
xxxxxxxxxxxX
.XV......VX.
.XV......VX.`, { solid: true });
PA('generator', 'generator machine power reactor sci-fi', `
..X......X..
.YXY....YXY.
..x......x..
xwwwwwwwwwwX
wxVVVVVVVVxX
wxV2A22A2VxX
wxVA2AA2AVxX
wxVVVVVVVVxX
wxOOKOOKOOxX
xXXXXXXXXXXX`, { solid: true });
PA('canister', 'toxic canister green barrel sci-fi', `
.xwwwwx.
xWwwwwxX
xNNNNNNX
wGHGGGNX
wGHGGGNX
wGHGKGNX
wGHGGGNX
xNNNNNNX
.XXXXXX.`, { solid: true });
PA('urn', 'urn vase clay pot desert', `
..OOOO..
...DD...
..OOOO..
.OFOOOD.
OFOYYODD
OFOOOODD
.OOOODD.
..DDDD..`, { solid: true });
PA('bench', 'wooden bench seat park', `
LLLLLLLLLLLL
TTTTTTTTTTTT
.C........C.
LLLLLLLLLLLL
TTTTTTTTTTTT
.TC......TC.
.TC......TC.`, { solid: true });
PA('log-pile', 'log pile firewood stack', `
....CLLC....
...CLTCLC...
.CLLCLLCLLC.
CLTCLCLTCLLC
CLLLCCLLLLCC
.CCCC.CCCCC.`, { solid: true });
PA('banner-stand', 'banner on stand flag pole red', `
.xxxxxx.
.RRRRRRX
.RRYYRRX
.RYRRYRX
.RRYYRRX
.RRRRRRX
.RR..RRX
.R....RX
.......X
.......X
.......X
.....XXX`, { solid: true });

// what the 50 older tiles normally are in a level
const OLD_WALLS = 'tile-water tile-deep-water tile-lava tile-sandstone tile-stone-brick tile-mossy-brick tile-brick tile-dungeon-wall tile-roof tile-thatch tile-hedge tile-cave tile-obsidian tile-ore-gold tile-ore-coal tile-ore-iron tile-ore-diamond tile-question tile-crate tile-window tile-wall-torch'.split(' ');
for (const it of CATS.find((c) => c.id === 'tiles').items) it.kind = OLD_WALLS.includes(it.slug) ? 'wall' : 'floor';

// ═════════════════════════ 1000 MORE SPRITES: everyday and modern things ═════════════════════════
// Sprites declared from here on remember their own category (see the note on S() further
// down), so adding them does not disturb how the older sprites are drawn.
//
// pack() reads a small listing language, one sprite per header line:
//   @slug | search name | default colours | options     a new picture (rows follow) and its sprite
//   #part x=.. y=.. m=red                               a picture used only as a layer (rows follow)
//   =slug | search name | layers | colours | options    a sprite made of layers of earlier pictures
// Layer names are looked up among the new pictures first, then among the older templates.
let NEW_TPL = 0;
const NEW_FN = new Set();
function newLayer(spec) { return TPL['n-' + /^[^:+]+/.exec(spec)[0]] ? 'n-' + spec : spec; }
function NS(slug, name, layers, colors = {}, opts = {}) {
  const anchor = cat.group === 'fx' ? 'center' : 'bottom', specs = layers.trim().split(/\s+/);
  cat.items.push({ slug, name, make: () => finalize(compose(specs.map(newLayer), colors), { anchor, ...opts }) });
}
/** like D(), outlined, and counted as a new drawing routine */
function ND(slug, name, fn, opts = {}, key = fn) {
  NEW_FN.add(key);
  D(slug, name, fn, { o: true, anchor: cat.group === 'fx' ? 'center' : 'bottom', ...opts });
}
function pairs(str) { const o = {}; for (const p of (str || '').split(/\s+/)) if (p) { const [k, v] = p.split('='); o[k] = v; } return o; }
function optsOf(str) { const o = pairs(str); for (const k in o) o[k] = o[k] === 'false' ? false : o[k] === 'true' ? true : isNaN(o[k]) ? o[k] : +o[k]; return o; }
function newTpl(name, def) {
  if (TPL['n-' + name]) throw new Error('duplicate new template ' + name);
  NEW_TPL++;
  return (TPL['n-' + name] = { name: 'n-' + name, rows: [], x: +(def.x || 0), y: +(def.y || 0), def });
}
function pack(src) {
  let cur = null;
  for (const line of src.split('\n')) {
    const l = line.trim();
    if (!l || l.startsWith('//')) continue;
    if (l[0] !== '@' && l[0] !== '#' && l[0] !== '=') { cur.rows.push(l); continue; }
    const f = l.slice(1).split('|').map((s) => s.trim());
    if (l[0] === '=') { NS(f[0], f[1], f[2], pairs(f[3]), optsOf(f[4])); cur = null; }
    else if (l[0] === '#') { const [name, ...rest] = f[0].split(/\s+/); cur = newTpl(name, pairs(rest.join(' '))); }
    else { cur = newTpl(f[0], pairs(f[2])); NS(f[0], f[1], f[0], {}, optsOf(f[3])); }
  }
}

// ───────────────────────── modern people ─────────────────────────
category('people', 'Modern people', 'char');
pack(`
// clothes and hair for the older "hum" and "kid" bodies (kid: shift by +0,3)
#coat y=7 m=white
..mnn....nnm..
..m.nn..nn.m..
....nn..nn....
....nn..nn....
#tie y=7 m=red
......nn......
......n.......
#shirtfront y=7
.....WWWW.....
......WW......
#vest y=7 m=orange
....nEnnEn....
....nEnnEn....
#stripes y=8
..x.xxxxxx.x..
#overalls y=7 m=blue
....n....n....
....nnnnnn....
....nnonnn....
#bib y=8 m=green
.....nnnn.....
....nnnnnn....
....nnnnnn....
....mmmmmm....
#steth y=7
.....V..V.....
.....VVVx.....
#badge y=8
.....Y........
#scarf y=7 m=red
....nnnnnn....
........nm....
#bowtie y=7 m=red
.....nmmn.....
#necklace y=7
.....Y..Y.....
......YY......
#skirt y=10 g=blue
...hhhhhhhh...
...ghhhihhg...
....ss..ss....
#shorts y=12
....ss..ss....
#tutu y=9
..zzzzzzzzzz..
.zzMzzMzzMzzz.
....ss__ss....
....ss..ss....
#eyemask y=4 m=black
...nnWnnWnn...
....nKnnKn....
#shades y=4
...KKKKKKKK...
....KK..KK....
#glasses y=4
....AKxxKA....
....AK..KA....
#mustache y=6 a=brown
.....bbbb.....
#clownnose y=5
......RR......
#straps y=7
....T....T....
....T....T....
#emblem y=7
......YY......
.....YYYY.....
#refstripes y=7
....eKeKeK....
....eKeKeK....
#hawaii y=7
.....Y..H.....
....H..M..Y...
#chestpack y=8
.....xBRx.....
#gloves y=8 m=red
.nn........nn.
.nn........nn.
#bibno y=7
.....WWWW.....
.....WKKW.....
#policecap y=0 m=navy
....nnnnnn....
...nnnYYnnn...
...nnnnnnnn...
...KKKKKKKK...
#firehat y=0 m=red
.....nnnn.....
....nnYYnn....
...nnnYYnnn...
..mmmmmmmmmmm.
#hardhat y=0 m=yellow
.....nnnn.....
....nonnnn....
...nnonnnnn...
..mmmmmmmmmm..
#nursecap y=0
....WWWWWW....
...WWWRRWWW...
#scrubcap y=1 m=green
....nnnnnn....
...nnonnnnn...
...mnnnnnnm...
#spacehelm y=0
....wWWWWw....
...WWWWWWWW...
..WW......WW..
..WA.......W..
..W........w..
..W........w..
..WW......ww..
...WWwwwwww...
#phones y=1
....VVVVVV....
...V......V...
...V......V...
..RR......RR..
..RR......RR..
#helmet y=0 m=red
....nnnnnn....
...nonnnnnn...
...nmnmnmnm...
#cowboyhat y=0 m=brown
....nn.nn.....
....nnnnnn....
.o..mmmmmm..o.
..nnnnnnnnnn..
#fedora y=0 m=brown
.....nnnnn....
....nnnnnn....
....KKKKKK....
..mmmmmmmmmm..
#beanie y=0 m=red
......WW......
....nnnnnn....
...nnnnnnnn...
...mnmnmnmn...
#beret y=0 m=red
........K.....
....nnnnnn....
..nnnonnnnn...
#partyhat y=0
......Y.......
......RR......
.....RYRR.....
....RRRYRR....
#afro y=0 a=black
....bbbbbb....
..bbbcbbbbbb..
..bbb....bbb..
..bb......bb..
..bb......bb..
#pigtails y=1 a=brown
....bbbbbb....
...bcbbbbbb...
.bbbb....bbbb.
.bb........bb.
.a..........a.
#mohawk y=0 a=pink
......bb......
.....bcbb.....
......bb......
#hijab y=1 m=teal
....nnnnnn....
...nnonnnnn...
...nn....nn...
...n......n...
...n......n...
...nn....nn...
...mnnnnnnm...
#turban y=0 m=orange
.....nnnn.....
....nonnnn....
...nnnonnnn...
...mnnnnnnm...
#bob y=1 a=black
....bbbbbb....
...bcbbbbbb...
...bbbbbbbb...
..bb......bb..
..bb......bb..
#curly y=0 a=brown
....b.bb.b....
...bbbbbbbb...
..bbcbbbbbbb..
..bb.b..b.bb..
..b........b..
#sunhat y=0 m=cream
.....nnnn.....
....nRRRRn....
.mmmmmmmmmmmm.
#veil y=0
....WWWWWW....
..WWWWWWWWWW..
..WWWWWWWWWW..
.WWWWWWWWWWWW.
.WwWWWWWWWWwW.
.WwWWWWWWWWwW.
.Www......wwW.
.ww........ww.
#gradcap y=0
..VVVVVVVVVV..
....VVVVVV.Y..
...........Y..
#visor y=4
...AAAAAAAA...
...BBBBBBBB...
#antenna y=0
.......R......
.......x......
#dpack y=5 m=orange
.nnn......nnn.
.non......nnn.
.nnn......nnn.
.mmm......mmm.
// things in the hands
#briefcase_r y=9
...........CC.
..........TTTT
..........TLTT
..........TTTT
#clipboard_l y=7
.LLL..........
.WWW..........
.WxW..........
.WWW..........
#wrench_r y=5
...........x.x
...........xxx
............x.
............x.
............x.
#mic_r y=6
...........xw.
...........xx.
............V.
............V.
#brush_r y=5
............R.
............L.
............T.
............T.
............T.
#palette_l y=7
.LLL..........
LRLBL.........
LLGLL.........
.LL...........
#magnifier_r y=5
...........xx.
..........xAAx
..........xAAx
...........xx.
............T.
#camera_c y=8
.....VVVV.....
.....VAAV.....
#parcel_l y=7
.LLLL.........
.LRLL.........
.TRTT.........
#letter_r y=7
...........WWW
...........WRW
...........WWW
#tray_l y=5
.R.A..........
xxxx..........
#racket_r y=3
...........RR.
..........RWWR
..........RWWR
...........RR.
............T.
............T.
#gavel_r y=6
..........TTT.
..........TTT.
............L.
............L.
#flask_r y=6
...........W..
...........W..
..........GGG.
..........GHG.
#balloon_r y=0 m=red
..........nn..
.........noon.
.........nnnn.
..........nn..
...........x..
...........x..
...........x..
...........x..
...........x..
#phone_r y=7
...........VV.
...........AV.
...........VV.
#stopsign_r y=2
...........RR.
..........RWWR
..........RWWR
...........RR.
............x.
............x.
............x.
............x.
#cane_r y=7
...........TT.
............T.
............T.
............T.
............T.
............T.
............T.
#baguette_l y=5
L.............
LL............
.LL...........
..L...........
#ball_f y=12
..........WK..
..........KW..
#bball_r y=8
...........OO.
...........DO.
#dumbbell_r y=8
..........V.V.
..........VVV.
..........V.V.
#guitar_r y=4 m=red
.............L
............L.
...........L..
..........L...
.........nnn..
.........nKn..
.........nnn..
#medkit_r y=9
..........WWWW
..........WRRW
..........WWWW
#box_l y=7
WWWW..........
WRRW..........
#satchel y=7
....T.........
.....T........
.TTT..........
.TLT..........
.TTT..........
#scissors_r y=6
...........x.x
............x.
...........R.R
#card_r y=5 m=yellow
...........nn.
...........nn.
...........nn.

// everyday adults
=man | man adult blue shirt | hum hair_short | d=blue g=navy j=dark a=brown
=woman | woman adult red top long hair skirt | hum hair_long skirt | d=red g=navy j=dark a=black s=skin3
=man-beard | man with beard green jumper | hum hair_short beard | d=green g=dark j=black a=black s=skin2
=woman-bun | woman hair bun yellow dress | hum hair_bun dress | d=yellow j=orange a=copper
=man-afro | man afro hair orange hoodie | hum afro | d=orange g=grey j=white a=black s=skin2
=woman-curly | woman curly hair purple top | hum curly skirt | d=purple g=dark j=black a=black s=skin2
=woman-hijab | woman hijab headscarf | hum dress hijab:m=purple | d=teal j=gold s=skin3
=man-turban | man turban beard | hum turban beard:a=black | d=white g=tan j=brown s=skin3
=man-bald-glasses | bald man glasses mustache | hum glasses mustache | d=cream g=brown j=dark a=brown
=woman-bob-glasses | woman bob haircut glasses | hum bob glasses | d=teal g=dark j=black a=red
=mum | mum mother woman ponytail | hum hair_pony necklace | d=pink g=blue j=white a=brown
=dad | dad father man mustache | hum hair_short mustache | d=red g=blue j=brown a=black s=skin3
=woman-sunhat | woman sun hat summer dress | hum hair_long sunhat dress | d=ice j=blue a=yellow
=man-beanie | man beanie hat scarf winter | hum beanie scarf:m=yellow | d=navy g=dark j=black a=brown
=woman-winter | woman winter coat beanie scarf | hum hair_long beanie:m=pink scarf:m=white | d=purple g=dark j=black a=brown
// teens and kids
=teen-boy | teen boy teenager hoodie headphones | hum hair_spiky phones | d=dark g=blue j=white a=black
=teen-girl | teen girl teenager phone pigtails | hum pigtails phone_r skirt | d=lime g=navy j=white a=orange
=punk | punk rocker mohawk | hum mohawk shades | d=black g=dark j=black a=pink
=skater | skater helmet shorts | hum hair_short helmet shorts | d=yellow g=teal j=red a=brown s=skin3
=kid-boy-cap | boy kid child with cap | kid hair_short+0,3 cap:m=red+0,3 | d=green g=blue j=white a=black s=skin3
=kid-girl-pigtails | girl kid child pigtails | kid pigtails+0,3 | d=yellow g=red a=brown
=kid-boy-curly | boy kid child curly hair | kid curly+0,3 | d=orange g=navy a=black s=skin2
=kid-girl-bob | girl kid child bob hair | kid bob+0,3 | d=purple g=pink a=black s=skin3
=schoolboy | schoolboy pupil uniform tie | kid hair_short+0,3 tie+0,3 | d=white g=navy j=black a=yellow
=schoolgirl | schoolgirl pupil uniform | kid hair_pony+0,3 tie:m=blue+0,3 | d=white g=maroon j=black a=black s=skin2
=kid-balloon | kid child holding balloon | kid hair_spiky+0,3 balloon_r+-1,2 | d=teal g=brown a=orange
=birthday-kid | birthday kid party hat | kid hair_long+0,3 partyhat+0,3 | d=pink g=purple a=orange
=kid-football | kid playing football soccer | kid hair_short+0,3 ball_f | d=red g=white j=black a=brown s=skin2
@baby | baby in diaper | a=brown
....bb....
..ssbsss..
.ssssssss.
.ssKssKss.
.ssssssss.
..tsMMst..
.ssssssss.
.s.WWWW.s.
...WWWW...
..ss..ss..
=baby-dark | baby dark skin curly | baby | a=black s=skin2
// elders
=grandpa | grandpa old man cane glasses | hum hair_sides:a=white mustache:a=white glasses cane_r | d=tan g=brown j=dark
=grandma | grandma old woman glasses | hum hair_bun:a=white glasses dress | d=rose j=purple
=old-man-cap | old man flat cap grey beard | hum beard:a=grey cap:m=grey | d=forest g=dark j=black s=skin2
=old-woman-cane | old woman grey curly hair cane | hum curly:a=grey cane_r skirt | d=violet g=grey j=black s=skin3
// health and rescue
=doctor | doctor man white coat stethoscope | hum hair_short coat steth | d=blue g=navy j=black a=black s=skin3
=doctor-woman | doctor woman with stethoscope | hum hair_pony coat steth | d=teal g=dark j=black a=brown
=nurse | nurse woman first aid | hum hair_bun nursecap medkit_r | d=ice g=ice j=white a=yellow
=nurse-man | nurse man scrubs clipboard | hum hair_short clipboard_l | d=teal g=teal j=white a=black s=skin2
=surgeon | surgeon mask scrubs | hum scrubcap mask:m=ice | d=green g=green j=white
=paramedic | paramedic ambulance medic | hum hair_short stripes medkit_r | d=green g=forest j=black a=red
=police-officer | police officer man cop | hum hair_short policecap badge | d=navy g=navy j=black a=brown
=police-woman | police officer woman cop | hum hair_pony policecap badge | d=blue g=navy j=black a=black s=skin2
=firefighter | firefighter with axe | hum firehat stripes axe_r | d=gold g=gold j=black
=firefighter-woman | firefighter woman yellow helmet | hum hair_pony firehat:m=yellow stripes | d=dark g=dark j=black a=copper s=skin3
// food and service
=cook | cook chef white hat mustache | hum hair_short chefhat mustache | d=white g=dark j=black a=black s=skin3
=baker | baker with bread baguette | hum hair_bun chefhat apron baguette_l | d=tan g=brown j=brown a=copper
=waiter | waiter with tray bow tie | hum hair_short bowtie:m=black tray_l | d=white g=black j=black a=black
=waitress | waitress apron tray | hum hair_pony apron tray_l | d=black g=black j=black a=red
=barista | barista coffee green apron | hum hair_short beard bib mug_r | d=white g=dark j=brown a=brown
=shop-assistant | shop assistant cashier red apron | hum hair_pony bib:m=red | d=white g=navy j=black a=black s=skin2
=hairdresser | hairdresser barber scissors | hum bob bib:m=black scissors_r | d=pink g=dark j=black a=purple
=cleaner | cleaner janitor broom | hum hair_short bib:m=blue broom_r | d=grey g=grey j=black a=grey s=skin3
// school and office
=teacher | teacher woman with book glasses | hum bob glasses book_l skirt | d=green g=brown j=black a=brown
=teacher-man | teacher man tie book | hum hair_short tie:m=green book_l:p=blue | d=cream g=brown j=dark a=black s=skin2
=professor | professor old wild white hair bow tie | hum curly:a=white mustache:a=white coat bowtie | d=brown g=dark j=black
=student | student with backpack and book | hum hair_short straps book_l | d=lime g=blue j=white a=black s=skin3
=student-girl | student girl backpack | hum hair_long straps book_l:p=purple skirt | d=yellow g=dark j=red a=brown s=skin2
=graduate | graduate cap gown graduation | hum hair_long robe gradcap | d=black j=gold a=brown
=office-worker | office worker man tie briefcase | hum hair_short shirtfront tie briefcase_r | d=dark g=dark j=black a=brown
=businesswoman | businesswoman suit briefcase | hum hair_bun shirtfront briefcase_r skirt | d=navy g=navy j=black a=black s=skin2
=boss | boss manager black suit gold tie | hum hair_sides mustache:a=grey shirtfront tie:m=gold | d=black g=black j=black
=programmer | programmer coder headphones glasses hoodie | hum hair_long phones glasses | d=violet g=dark j=white a=brown
=librarian | librarian woman books glasses | hum hair_bun:a=grey glasses book_l:p=green skirt | d=maroon g=brown j=black
=reporter | news reporter microphone | hum hair_long mic_r shirtfront skirt | d=red g=dark j=black a=yellow
// trades
=builder | builder construction worker hard hat | hum hardhat vest hammer_r | d=blue g=navy j=brown s=skin3
=builder-woman | builder woman hard hat vest | hum hair_pony hardhat:m=white vest:m=lime | d=dark g=blue j=brown a=black s=skin2
=engineer | engineer hard hat clipboard | hum hardhat:m=white clipboard_l tie:m=blue | d=ice g=navy j=black
=mechanic | mechanic wrench overalls | hum hair_short overalls wrench_r | d=grey g=blue j=black a=black s=skin2
=plumber | plumber red cap mustache overalls | hum cap:m=red mustache overalls wrench_r | d=red g=blue j=brown
=house-painter | house painter decorator brush | hum cap:m=white overalls:m=white brush_r | d=ice g=white j=grey a=brown
=farmer-overalls | farmer overalls straw hat pitchfork | hum strawhat overalls pitchfork_r | d=red g=blue j=brown
=gardener | gardener woman sun hat flower | hum hair_long sunhat bib flower_r | d=tan g=brown j=dark a=copper
// travel
=pilot | pilot airline captain | hum hair_short policecap:m=white shirtfront tie:m=black | d=navy g=navy j=black a=brown
=flight-attendant | flight attendant air hostess scarf | hum hair_bun scarf skirt | d=blue g=blue j=black a=yellow
=astronaut | astronaut white space suit | hum spacehelm chestpack | d=white g=white j=grey
=astronaut-orange | astronaut orange suit | hum spacehelm chestpack | d=orange g=orange j=dark s=skin2
=ship-captain | ship captain white beard cap | hum beard:a=white policecap:m=white shirtfront | d=navy g=white j=black
=bus-driver | bus driver cap tie | hum hair_short cap:m=navy tie:m=blue | d=ice g=navy j=black a=grey s=skin2
=train-conductor | train conductor ticket | hum policecap:m=maroon mustache card_r:m=white | d=maroon g=dark j=black a=black
=mail-carrier | mail carrier postman letter | hum hair_short cap:m=blue satchel letter_r | d=ice g=navy j=black a=orange
=delivery-rider | delivery rider courier helmet box | dpack hum helmet:m=teal box_l | d=teal g=dark j=black s=skin3
=courier | courier delivery parcel | hum cap:m=brown parcel_l | d=tan g=brown j=dark a=black s=skin2
=crossing-guard | crossing guard lollipop stop sign | hum hair_long cap:m=yellow vest:m=yellow stopsign_r | d=dark g=dark j=black a=grey
=tourist | tourist camera hawaiian shirt | hum sunhat:m=tan shades hawaii camera_c shorts | d=orange g=tan j=brown
=hiker | hiker backpack walking stick | dpack:m=green hum hair_short beanie:m=green cane_r shorts | d=red g=tan j=brown a=brown
// science and arts
=scientist | scientist lab coat flask glasses | hum hair_spiky:a=grey glasses coat flask_r | d=purple g=dark j=black
=scientist-woman | scientist woman lab coat | hum hair_pony coat flask_r | d=pink g=navy j=black a=black s=skin2
=artist | artist painter beret palette | hum hair_long beret brush_r palette_l | d=black g=blue j=brown a=brown
=photographer | photographer with camera | hum hair_short camera_c cap:m=dark | d=tan g=forest j=brown a=copper
=guitarist | musician guitar player | hum hair_long guitar_r | d=black g=blue j=black a=black
=singer | singer with microphone | hum afro mic_r dress | d=purple j=gold a=black s=skin2
=dj | dj headphones sunglasses | hum hair_short phones shades | d=lime g=black j=white a=blue s=skin3
=ballerina | ballerina dancer tutu | hum hair_bun tutu | d=pink g=pink j=pink a=brown
// sport
=runner | athlete runner sprinter number | hum hair_short bibno shorts | d=red g=red j=white a=black s=skin2
=footballer | footballer soccer player ball | hum hair_short shorts ball_f | d=blue g=white j=black a=yellow
=basketball-player | basketball player | hum afro bandana:m=white shorts bball_r | d=yellow g=purple j=white a=black s=skin2
=tennis-player | tennis player racket | hum hair_pony racket_r skirt | d=white g=white j=white a=yellow
=swimmer | swimmer swim cap | hum scrubcap:m=blue shorts | d=skin g=blue j=skin
=boxer | boxer red gloves | hum hair_short gloves shorts | d=skin3 g=red j=black a=black s=skin3
=cyclist | cyclist bike helmet sunglasses | hum helmet:m=blue shades shorts | d=lime g=black j=white
=referee | referee striped shirt yellow card | hum hair_short refstripes shorts card_r | d=white g=black j=black a=brown
=coach | coach trainer cap clipboard | hum cap:m=red clipboard_l | d=red g=dark j=white a=brown s=skin3
=lifeguard | lifeguard beach sunglasses | hum hair_short shades shorts | d=red g=red j=skin a=yellow
// law and order, and trouble
=detective | detective trench coat hat magnifier | hum fedora coat:m=tan magnifier_r | d=cream g=brown j=dark
=judge | judge wig gavel robe | hum hair_long:a=white robe gavel_r | d=black j=white
=security-guard | security guard sunglasses | hum policecap:m=black shades badge | d=black g=black j=black s=skin2
=soldier | soldier army green helmet | hum helmet:m=forest | d=forest g=forest j=black s=skin3
=burglar | burglar robber striped shirt mask sack | hum beanie:m=black refstripes eyemask sack_l | d=white g=dark j=black
// big days and shows
=bride | bride wedding dress veil bouquet | veil hum hair_long dress flower_r | d=white j=white a=brown
=groom | groom wedding suit bow tie | hum hair_short shirtfront bowtie:m=black | d=black g=black j=black a=black s=skin3
=clown | clown red nose wig | hum afro:a=red clownnose bowtie:m=blue | d=yellow g=blue j=red s=pale
=magician | magician top hat wand | cape hum hair_short tophat shirtfront bowtie wand_r | d=black g=black j=black a=black
=superhero | superhero cape mask | cape hum hair_short eyemask:m=navy emblem | d=blue g=blue j=red a=black
=superheroine | superheroine cape mask | cape:m=gold hum hair_long eyemask:m=navy emblem | d=red g=red j=gold a=yellow
=supervillain | villain supervillain dark cape | cape:m=violet hum beard:a=black eyemask | d=purple g=dark j=black s=pale
// robot helpers
=android | android robot helper humanoid | hum visor antenna | s=pale d=steel g=steel j=grey
@robot-helper | robot helper friendly white
.....R......
.....x......
..WWWWWWWW..
.WVVVVVVVVw.
.WVAVVVVAVw.
.WVVVAAVVVw.
..WWWWWWww..
...xXXXXx...
.xWWWWWWWWx.
.x.WWBBWw.x.
.A.WWWWWw.A.
...wwwwww...
...VV..VV...
@robot-butler | robot butler waiter with tray
......YY......
.....YEYY.....
....YKYYKY....
....YYYYYO....
.A...VRRV.....
.A..VVVVVV....
xxxxVVWWVVVx..
....VVWWVV.x..
....VVVVVV.x..
.....V..V.....
.....V..V.....
....VV..VV....
`);

// ───────────────────────── adventure cast ─────────────────────────
category('cast', 'Adventure cast', 'char');
pack(`
#tricorn y=0 m=black
....nnnnnn....
..nnnnWWnnnn..
.nYYYYYYYYYYn.
#parrot_l y=4
.RR...........
YRK...........
.RG...........
#hook_r y=8
............x.
...........xx.
#santahat y=0
..........W...
....RRRRRRR...
...RRRRRRR....
...WWWWWWWW...
#elfhat y=0 m=green
.........Y....
.....nnnnn....
....nnnnnn....
...RRRRRRRR...
#bunnyears y=-3
....WW..WW....
....WM..MW....
....WM..MW....
....WW..WW....
#bunnynose y=5
......MM......
#nemes y=0
....YYBBYY....
...BYYBBYYB...
.YB........BY.
.BY........YB.
.YB........BY.
.BY........YB.
.YB........BY.
#club_r y=4
...........TT.
...........TLT
...........TT.
............T.
............T.
............T.
#whip_r y=3
..........TT..
.........T..T.
............T.
...........T..
...........T..
............T.
#juggle y=-3
......BB......
......BB......
..RR......YY..
..RR......YY..
#scubamask y=3
...BBBBBBBB...
...BAKAAKAB...
...BBBBBBBB...
#snorkel y=1
..Y...........
..Y...........
..Y...........
..Y...........
..YY..........
#pumpkinbucket_r y=8
...........xx.
..........OOOO
..........OKKO
..........DOOD
#lasso_r y=4
..........LLL.
.........L...L
..........LLL.
............L.
............L.
#hoop_r y=5
..........MM..
.........M..M.
.........M..M.
..........MM..
#cybereye y=4
.......xxRx...
.......xxxx...
#metalarm y=7
..........xx..
...........x..
...........x..
#blaster_r y=8
..........VVVV
...........V..
#laptop_l y=8
xxx...........
xAx...........
xxxx..........
#waistcoat y=7 m=brown
....nn..nn....
....nn..nn....
#santatrim y=7
......WW......
......WW......
#basket_r y=7
...........LL.
..........L..L
..........RYBL
..........TTTT
..........TTTT
#wolfhead y=0
..xx......xx..
..xxx....xxx..
...xxxxxxxx...
...xxxxxxxx...
...xYxxxxYx...
...xxwKKwxx...
....wWwwWw....
#flattop y=0
...KKKKKKKK...
...KKKKKKKK...
...K.K..K.K...
#bolts y=5
..x........x..
..............
// pirates
=pirate-captain | pirate captain hook hat beard | cape:m=maroon hum beard:a=black tricorn eyepatch sword_r hook_r | d=maroon g=dark j=black
=pirate-girl | pirate girl bandana sword | hum hair_long bandana sword_r | d=white g=maroon j=brown a=red
=pirate-first-mate | pirate with parrot striped shirt | hum bandana:m=blue beard refstripes parrot_l | d=white g=navy j=brown a=brown s=skin2
=cabin-boy | cabin boy kid pirate | kid hair_short+0,3 bandana:m=red+0,3 | d=ice g=brown a=yellow
// wild west
=cowboy | cowboy hat lasso | hum cowboyhat scarf lasso_r | d=blue g=navy j=brown
=cowgirl | cowgirl hat ponytail | hum hair_pony cowboyhat:m=cream skirt | d=red g=tan j=brown a=yellow
=sheriff | sheriff star badge mustache | hum cowboyhat:m=tan mustache waistcoat badge | d=cream g=dark j=black
=outlaw | outlaw bandit wild west masked | hum cowboyhat:m=black mask:m=red sack_l | d=dark g=black j=black
=prospector | prospector gold miner beard pickaxe | hum strawhat:m=brown beard_long:a=grey overalls pickaxe_r | d=red g=blue j=brown
// space
=space-captain | space captain starship uniform | hum hair_short emblem | d=gold g=black j=black a=brown
=space-trooper | space trooper soldier white armour blaster | hum helm_full:m=white armor:m=white blaster_r | d=white g=white j=dark
=space-girl | space girl pink space suit astronaut | hum spacehelm chestpack | d=pink g=pink j=purple s=skin3
=cyborg | cyborg half robot red eye | hum hair_spiky cybereye metalarm | d=dark g=black j=grey a=white
// spies
=spy | spy trench coat hat sunglasses | hum fedora:m=dark shades coat:m=dark | d=black g=black j=black
=secret-agent | secret agent black suit sunglasses | hum hair_short shades shirtfront tie:m=black | d=black g=black j=black a=black
=spy-woman | spy woman black suit sunglasses | hum hair_pony shades blaster_r | d=black g=black j=black a=red
=hacker | hacker hood laptop | hum hood:m=dark laptop_l | d=dark g=black j=black
// martial arts
=ninja-red | red ninja sword | hum hood:m=red mask:m=red sword_r | d=red g=maroon j=black
=ninja-blue | blue ninja | hum hood:m=navy mask:m=navy dagger_r | d=navy g=navy j=dark
=sensei | sensei old karate master white beard | hum hair_sides:a=white beard_long robe cane_r | d=white j=black
=karate-kid | karate kid white suit black belt | kid hair_short+0,3 bandana:m=white+0,3 | d=white g=white j=black a=black s=skin3
// circus
=ringmaster | circus ringmaster top hat red coat | hum tophat mustache:a=black shirtfront bowtie:m=black whip_r | d=red g=white j=black
=acrobat | circus acrobat hoop | hum hair_bun hoop_r shorts | d=teal g=teal j=teal a=black
=strongman | circus strongman dumbbell mustache | hum mustache:a=black overalls:m=red dumbbell_r shorts | d=skin g=red j=black
=juggler | juggler juggling balls | hum hair_short juggle | d=purple g=yellow j=red
=lion-tamer | lion tamer whip | hum hair_short whip_r waistcoat:m=red | d=cream g=tan j=black a=black s=skin2
// outdoors
=scout | scout kid hat neckerchief camping | kid cowboyhat:m=tan+0,3 scarf:m=yellow+0,3 | d=green g=tan j=brown
=park-ranger | park ranger hat green uniform | hum hair_short cowboyhat:m=tan badge | d=forest g=tan j=brown a=brown s=skin3
=safari-explorer | safari explorer pith helmet | hum hardhat:m=cream mustache camera_c shorts | d=cream g=tan j=brown
=scuba-diver | scuba diver mask snorkel tank | dpack:m=yellow hum scrubcap:m=dark scubamask snorkel | d=dark g=dark j=lime
=mountaineer | mountaineer climber pickaxe backpack | dpack:m=red hum beanie:m=blue scarf:m=white pickaxe_r | d=orange g=dark j=brown
// holidays
=santa | santa claus father christmas sack | hum santahat beard_long santatrim sack_l | d=red g=red j=black
=mrs-claus | mrs claus christmas | hum hair_bun:a=white glasses dress apron | d=red j=white
=christmas-elf | christmas elf santa helper | kid ears+0,3 elfhat+0,3 | d=green g=red j=green
=easter-bunny | easter bunny rabbit costume basket eggs | hum bunnyears bunnynose basket_r | d=white g=white j=white s=white
@ghost-costume-kid | kid in ghost sheet costume halloween
...WWWWWW...
..WWWWWWWW..
..WWKWWKWW..
..WWKWWKWW..
..WWWWWWWW..
.WWWWWWWWWW.
.WWWWWWWWwW.
.WWWWWWWWwW.
.WwWWwWWwWw.
..TT....TT..
=witch-kid | kid witch costume halloween trick or treat | kid hair_long:a=purple+0,3 wizhat:m=black+0,3 pumpkinbucket_r+-1,2 | d=purple g=black j=black
=vampire-kid | kid vampire costume halloween | kid hair_short:a=black+0,3 fangs+0,3 bowtie+0,3 | d=black g=black j=black s=pale
=pumpkin-kid | kid pumpkin head costume halloween | kid pumpkinhead+0,3 | d=black g=green j=black
=leprechaun | leprechaun green hat orange beard | hum tophat:m=green beard:a=orange | d=green g=green j=black
// myths and far away
@mermaid | mermaid with green tail | a=red d=teal
....bbbbbb....
...bcbbbbbb...
..bbssssssbb..
..bbsKssKsbb..
..bbsKssKsbb..
..ab.tsst.ba..
..a.sMssMs.a..
....s.ss.s....
.....eeee.....
.....eeffe....
......eeee..d.
.......eeeedd.
........eeedd.
...........d..
@genie | genie from lamp blue
.....YY.....
....KKKK....
...AAAAAA...
...AKAAKA...
...AKAAKA...
....BAAB....
.YAAPPPPAAY.
.A..PPPP..A.
.A..RRRR..A.
....BAAB....
.....AAB....
......AB....
.......B....
=fairy | fairy wings wand | wings_h hum hair_bun dress wand_r | d=lime j=yellow a=pink
=pharaoh | pharaoh egypt king | hum nemes robe staff_r:p=gold | d=white j=gold s=skin3
=caveman | caveman club stone age | hum hair_long beard club_r shorts | d=copper g=copper j=skin a=black
=werewolf | werewolf wolf man | hum wolfhead | d=maroon g=navy j=grey s=grey
=frankenstein | frankenstein monster green bolts | hum flattop bolts | d=dark g=black j=black s=zombie
`);

// ───────────────────────── more creatures ─────────────────────────
category('creatures', 'More creatures', 'char');
pack(`
// pets
@kitten | kitten small cat sitting | a=grey
b.....b.
bb...bb.
bbbbbbb.
bKbbbKb.
bbbMbbb.
.bcccb.b
.bcccb.b
.bbbbbbb
@cat-sleeping | cat sleeping curled up | a=orange
..........b.
...bbbbb.bb.
.bbbbbbbbbbb
bbabbbbbKbKb
bbbabbbbbMbb
abbbbbbbbbb.
.aaaaaaaaa..
@puppy | puppy small dog sitting | a=tan
.aa....aa.
abbbbbbbba
abbKbbKbba
.bbbbbbbb.
.bbcKKcbb.
..bcRRcb..
..bbbbbb.b
.bbccccbbb
.bbccccbb.
.bb.bb.bb.
@dachshund | dachshund sausage dog | a=copper
..........aab.
b.........abbb
.b........aKbK
.bbbbbbbbbbbb.
.bbbbbbbbbbb..
..bcccccccbb..
..b.b....b.b..
@bulldog | bulldog pug dog | a=tan
.a........a.
aabbbbbbbbaa
.bKbbbbbbKb.
.bbcKKKKcbb.
.bcWccccWcb.
..bbbRRbbb..
.bbbbbbbbbb.
.bbccccccbb.
.bb.bb.bb.bb
@poodle | poodle fluffy dog | a=steel
.........ccc..
........ccccc.
.cc.....bcKcc.
.cc......bbbbK
..b.....bbb...
..bccccccc....
...cccccccc...
...ccccccc....
...b.b..b.b...
...c.c..c.c...
@hamster | hamster pet | a=orange
.zz....zz.
.bbbbbbbb.
bbKbbbbKbb
bWWWMMWWWb
bWWWWWWWWb
.bWWWWWWb.
.zz....zz.
=guinea-pig | guinea pig pet brown | hamster | a=brown
@goldfish-bowl | goldfish in bowl pet fish
...wwwwww...
..w......w..
.wAAAAAAAAw.
wAAAOOAAAAAw
wAAOOOKAAWAw
wAAAOOAAAAAw
.wAAAAGAAAw.
..wYYYGYYw..
...wwwwww...
@parrot | parrot red macaw | a=red
...bbbb...
..bbWKbY..
..bbWWYY..
..bbbbbY..
.bbbGGb...
.bbGGBb...
.bbBBBb...
..bBBb....
.TTTbTTT..
...bb.....
...Ab.....
=parrot-blue | blue and gold parrot macaw | parrot | a=blue
@hedgehog | hedgehog
..C.C.C.C...
.CTCTCTCTC..
CTCTCTCTCLL.
TCTCTCTCLLKL
CTCTCTCLLLLK
.TCTCTLLLLL.
..L.L..L.L..
// farm
@rooster | rooster cockerel
........RR..
.N.....RRR..
NNN....WWKO.
1NN...WWWWOO
.NNW.WWWWR..
.NWWWWWWWR..
..WWwwWWW...
..WWWwwWW...
...WWWWW....
....O.O.....
...OO.OO....
@turkey | turkey bird thanksgiving
..T.O.T.O...
.O.TTOTT.T..
.TTOTTOTTO..
OTTTTLLTTLL.
TTOTLLLLLKL.
.TTLLLLLLLOO
..TLLLLLLR..
...LLLLLLR..
....LLLL....
....O..O....
...OO.OO....
#donkeyears y=-2 a=grey
..........b.b.
..........b.b.
..........b.b.
=donkey | donkey grey long ears | horse donkeyears | a=grey d=dark
@llama | llama alpaca | a=cream
.........b.b.
.........bbb.
.........bKbb
.........bbbT
.........bb..
.........bb..
..bbbbbbbbb..
.bbbbbbbbbb..
.bcbbbbbbbb..
.bbbbbbbbbb..
..bb.b..bb.b.
..bb.b..bb.b.
..aa.a..aa.a.
#bullhorns y=-1
.........W...W
.........WW.WW
..............
..............
..............
..............
..............
............Y.
=bull | bull brown horns nose ring | cow bullhorns | a=brown d=dark
=goose | goose grey farm bird | duck | a=grey
@swan | swan white bird
....WWW....
...WWKWOO..
...WW......
...WW......
....WW.....
W...WW.....
WWWWWWWW...
WWWwwWWWW..
.WWWwwWWW..
..WWWWWW...
// zoo and savanna
@lion | lion with mane | a=tan
.........TTTT.
........TTTTTT
........CTbbKT
T.......CTbbbK
T.......CTTbb.
.bbbbbbbbCTT..
.bbbbbbbbbCT..
.bbbbbbbbbb...
.bbccccccbb...
.bb.bb..bb.b..
.bb.....bb....
#bigcat a=orange
..........b..b
.........bbbbb
bb.......bKbKb
.b.......WbbMW
.bbbbbbbbbbWW.
.bbbbbbbbbbb..
.bbbbbbbbbbb..
.bWWWWWWWbb...
.bb.bb..bb.b..
.bb.....bb....
#tigerstripes
..............
...........K..
.K............
..............
....K..K......
...K..K..K....
....K..K......
#leopardspots
..............
..............
.C............
..............
...C..C.C.....
..C..C..C.C...
....C..C......
=tiger | tiger orange stripes | bigcat tigerstripes
=leopard | leopard cheetah spots | bigcat:a=yellow leopardspots
=panther | black panther big cat | bigcat:a=dark
=lioness | lioness female lion | bigcat:a=tan
@elephant | elephant grey trunk | a=grey
....bbbbbbb.........
..bbbbbbbbbbb.bbbb..
.bbbbbbbbbbbbbbbbbb.
.bbbbbbbbbbbaabbKbb.
.bbbbbbbbbbbaabbbbb.
abbbbbbbbbbbbabbbbb.
a.bbbbbbbbbbbbbWWbb.
a.bbbbbbbbbbbbW..bb.
..bbbbbbbbbbbb...bb.
..bbbbbbbbbbbb...bb.
..bbb.bbb.bbbb..bbc.
..bbb.....bbb.......
..bbb.....bbb.......
..cWc.....cWc.......
@giraffe | giraffe tall long neck | a=yellow
.........T.T.
.........bbb.
.........bKbb
.........bbbb
.........bT..
.........bb..
.........Tb..
.........bb..
.........bT..
..bbbbbbbbb..
.TbTbbTbbTb..
Tbbbbbbbbbb..
T.bTbbTbbb...
..bb.b.bb.b..
..bb.b.bb.b..
..bT.b.bT.b..
..bb.b.bb.b..
..CC.C.CC.C..
#zebrastripes
..............
..............
..............
..............
...K.K.K.K.K..
...K.K.K.K....
...K.K.K.K....
...K.K.K.K....
...K......K...
..............
..K........K..
=zebra | zebra striped horse | horse:a=white,d=black zebrastripes
@hippo | hippo hippopotamus | a=grey
.........b..b.
..bbbbbbbbbbbb
.bbbbbbbbbbKbb
bbbbbbbbbccccc
bbbbbbbbbcKccK
bbbbbbbbbccccc
.bbbbbbbbbWbW.
.bbb.bb.bbb...
.aaa.aa.aaa...
@rhino | rhino rhinoceros horn | a=grey
........b....W
..bbbbbbbb..WW
.bbbbbbbbbbbW.
abbbbbbbbbKbb.
abbbbbabbbbbb.
.bbbbbabbbbb..
.bbbbbbbbbb...
.bbb.bb.bbb...
.aaa.aa.aaa...
@gorilla | gorilla ape | a=black
....bbbb....
...bbbbbb...
...bxKxKb...
...bxxxxb...
.bbbbxxbbbb.
bbbbbbbbbbbb
bbbcbbbbcbbb
bb.bbbbbb.bb
bb.bbbbbb.bb
xx.bb..bb.xx
...bbb.bbb..
#pandamarks
..VV....VV..
............
..VWV..VWV..
............
............
............
VVVV....VVVV
VVV......VVV
VV........VV
VV........VV
...VVV.VVV..
..VVVV.VVVV.
=panda | panda bear black and white | bear:a=white pandamarks
@koala | koala | a=grey
bbb......bbb
bcbbbbbbbbcb
bbbbbbbbbbbb
.bbKbbbbKbb.
.bbbbKKbbbb.
.bbbbKKbbbb.
..bbbbbbbb..
.bbbccccbbb.
.bbbccccbbb.
..bb.bb.bb..
@kangaroo | kangaroo | a=copper
.........b.b..
.........bbb..
.........bKbb.
.........bbbb.
........bbb...
......bbbbb...
.....bbbbbbb..
....bbbbcc.b..
...bbbbbcc....
..abbbbbbb....
.aa.bbbbb.....
aa...bb.b.....
a....bbbbb....
@camel | camel desert hump | a=tan
...........bb.
....bb.....bKb
...bbbb....bbb
..bbbbbb...bb.
.bbbbbbbbbbbb.
.bbbbbbbbbbb..
.bbbbbbbbbb...
..bbbccbbb....
..b.b..b.b....
..b.b..b.b....
..a.a..a.a....
@crocodile | crocodile alligator | a=green
....a.a.a.bb..
a..bbbbbbbbKbb
bbbbbbbbbbbbbb
.bbbbccccWKWKW
...bb..bb.....
@flamingo | flamingo pink bird
....MMM.
...MMKMK
...MM.zK
...MM...
....M...
..MMMM..
.MMMzMM.
.MMzzMM.
..MMMM..
...M....
...M....
...MM...
...M....
@ostrich | ostrich big bird
.......xx.
......xxKO
.......x..
.......x..
.......x..
.WVVVVVx..
WWVVVVVV..
.WVVVVVV..
..VVVVV...
...z.z....
...z.z....
...z.z....
..zz.zz...
@peacock | peacock tail feathers
.Y2.Y2.Y2.Y2.
2B2G2B2B2G2B2
2G2B2GBG2B2G2
.2B2GBBBG2B2.
.2G2BKBKB2G2.
..2GBBOBBG2..
...2BBBBB2...
....BBBBB....
.....BBB.....
....O...O....
@sloth | sloth hanging on branch | a=tan
TTTTTTTTTTT
.b.......b.
.b.bbbbb.b.
.bbbcccbbb.
.bbcKcKcbb.
..bccMccb..
..bbbbbbb..
..bbbbbbb..
...bb.bb...
@meerkat | meerkat standing | a=tan
..bbbb..
.bKbbKb.
.bbKKbb.
..bbbb..
..bccb..
.bbccbb.
.b.cc.b.
..bccb..
..bccb..
..bbbb.a
..b..baa
.bb..bb.
// forest and sky
@raccoon | raccoon masked | a=grey
b......b....
bb....bb....
bbbbbbbb..aa
bVKbbKVb.bVb
WWbKKbWW.bbb
.bbbbbb.bVb.
.bbccbbbbb..
.bbccbbbb...
.bb.bb.bb...
@skunk | skunk black white stripe
.WWW..........
WVVWW.....V.V.
WV.VW....VVVV.
WV..WWWWWWVKVV
.VV.VVVVVVVVVK
..VVVVVVVVVV..
...VVVVVVVV...
...VV.V.VV.V..
@beaver | beaver flat tail | a=brown
........bb.b
.......bbbbb
......bbbKbb
.....bbbbbbK
..bbbbbbbWW.
.bbbbbbbbb..
CCbbbcccbb..
CVCbbcccb...
.CCbb.bb....
@moose | moose elk antlers | a=brown
.......LL.L.LL
........LLLLL.
.........bbb..
.........bKbb.
.........bbbbb
..bbbbbbbbbbba
.bbbbbbbbbb.b.
.bbbbbbbbbb...
.bbbbbbbbb....
.bb.b...b.b...
.aa.a...a.a...
.aa.a...a.a...
@badger | badger | a=grey
..........V...
..bbbbbbbVWW..
.bbbbbbbbWVVWW
abbbbbbbbWWWVK
abbbbbbbbbWWW.
.VVV.VV.VVV...
.VV..VV..VV...
@mole | mole digging out of dirt
....VVVV....
...VVVVVV...
..zVVKVKVz..
..zzVVMVzz..
.TTTVVVVTTT.
TLTTTTTTTTLT
TTTTLTTTTTTT
@woodpecker | woodpecker bird on trunk
.RR....TTT
RVVK...TCT
VVVxxx.TTT
WVV....TCT
WWVV...TTT
WWVV...TCT
.WVV.x.TTT
..VVV..TCT
...V...TTT
@eagle | eagle flying bird of prey | a=brown
bb..........bb
bbb...WW...bbb
abbb.WKKW.bbba
.abbbbYYbbbba.
..aabbbbbbaa..
.....bbbb.....
....Y.WW.Y....
@pigeon | pigeon city bird
...xxx....
..xxKxO...
..2PPx....
.xxxxxx...
xwwwxxxx..
.xwwwxxVV.
..xxxx....
...M.M....
@seagull | seagull sea bird
....WWW....
...WWKWYY..
...WWWW.R..
x..WWWW....
xxwwwWWW...
.xxwwwWW...
..WWWWW....
...O.O.....
@toucan | toucan tropical bird big beak
..VVVV.....
.VVWKOOOO..
.VWWOOOYOO.
.VWWW.OOR..
.VVVV......
.VVVVV.....
..VVVVV....
...VVV.....
..TOTOTT...
....VV.....
@hummingbird | hummingbird tiny bird
.GG.......
GGGG.22...
.NGG2K2xxx
..G2222...
..NH22....
.NN.......
// sea
@whale | blue whale spout | a=blue
.....A.A............
......A.............
....bbbbbbbbbb......
..bbbbbbbbbbbbbb..a.
.bbKbbbbbbbbbbbbbaa.
.bbbbbbbbbbbbbbbbba.
.cbbbbbbbbbbbbbbb.a.
..ccccccccbbbb......
....cccccc..........
@dolphin | dolphin jumping | a=blue
.......bb.....
......bbbb....
....bbbbbbb...
..bbbbbbbbbb..
.bbKbbbbbbbbb.
abbbbcccc.bbb.
.acccc.....bb.
............bb
...........bbb
..........b..b
#orcapatch
..............
..............
..............
....WW........
..............
.....WWWW.....
..WWWW........
=orca | orca killer whale black white | dolphin:a=black orcapatch
@seal | seal sea lion | a=grey
........bbb.
.......bbKbK
.......bbbbW
......bbbb..
.....bbbb...
...bbbbbb...
.bbbbbbbb.a.
abbbccccbbaa
aa.bb..bbb..
@walrus | walrus tusks | a=brown
...bbbbbb...
..bbKbbKbb..
..bLLKKLLb..
..bLLLLLLb..
.bbbWbbWbbb.
bbbbWbbWbbbb
bbbbbbbbbbbb
abbbbbbbbbba
aab......baa
@seahorse | seahorse | a=orange
..b.b...
..bbb...
.bbKbcc.
.bbbb...
..bb....
..bbb...
.bbccb..
.bbccb..
..bbb...
...bb...
....b...
..b.b...
..bbb...
@lobster | lobster red claws | a=red
bb.....bb..
bbb...bbb..
.bb...bb...
..b.K.K.b..
..bbbbbbb..
...bbcbb...
..abbbbba..
.a.bbcbb.a.
...bbbbb...
....bbb....
...bbbbb...
@shrimp | shrimp prawn pink
.K........
I.IIII....
.IIzIIII..
KIIIIzIII.
..I.I.IzII
.......III
......IzI.
.....III..
....II....
@squid | squid | a=pink
....bb....
...bbbb...
..bbbbbb..
.bbbbbbbb.
..bbbbbb..
..bKbbKb..
..bbbbbb..
..b.bb.b..
.b..bb..b.
.b.b..b.b.
b..b..b..b
@stingray | stingray manta ray | a=navy
....bbbb.....
..bbbbbbbb...
.bbKbbbbKbb..
bbbbbbbbbbbb.
.bbbbccbbbb..
..bbbbbbbb...
....bbbb.....
.....aa......
......a......
......a......
.......a.....
@pufferfish | pufferfish blowfish spiky
..T..T..T..
...YYYYY...
T.YYYYYYY.T
.YYWKYYYYY.
.YYWWYYYYYO
TYYYYYYEEYT
.YYYYEEEEY.
..EEEEEEE..
T..EEEEE..T
..T..T..T..
@clownfish | clownfish orange white stripes
....OOO.....
..OKOWOOWO.O
.OOOOWOOWOWO
.OOOOWOOWOWO
..OOOWOOWO.O
....OOO.....
@angelfish | angelfish tropical fish yellow stripes
.....YY...
....YYY...
...YKYYK..
..YYKYYKY.Y
.YKYKYYKYYY
..YYKYYKY.Y
...YKYYK..
....YYY...
.....YY...
@eel | eel sea snake | a=teal
..........bbb.
.........bbKbb
....bbb..bbbW.
...bbbbb.bb...
bb.bb.bbbbb...
.bbbb..bbb....
..bb..........
@clam | clam shell with pearl
..zzzzzzzz..
.zzMzzMzzMz.
zzMzzMzzMzzz
zMzzMzzMzzMz
VVVVWWWVVVVV
zzzzWWWzzzzz
.zzzzzzzzzz.
..MMMMMMMM..
@swordfish | swordfish | a=blue
........a.....
.......aa.....
a....bbbbbb...
aa.bbbbbbKbxxx
.abbbbbbbbb...
aa.ccccccc....
a.....a.......
@narwhal | narwhal horned whale | a=ice
.............L
a...........L.
aa..bbbbbb.L..
.abbbbbbbbbb..
..bbbbbbbKbb..
..bccccccccb..
....cccccc....
// insects and reptiles
@ant | ant insect
........C.C.
.ZZ..ZZ.ZZ..
ZRZZZRZZZKZ.
.ZZ..ZZ.ZZ..
C.C.C.C.C...
@caterpillar | caterpillar green bug
.........K.K
..........G.
.GG.GG.GGHHG
GHGGHGGHGKGK
GGGGGGGGGGMG
.N..N..N....
@dragonfly | dragonfly
.AAA..22..AAA.
AAAAA.KK.AAAAA
.AAAAA22AAAAA.
..AAA.22.AAA..
.AAAA.22.AAAA.
.AA...22...AA.
......22......
......11......
......22......
@grasshopper | grasshopper cricket green
.......N...K
.....NNG..K.
....NG.GGGG.
.GGGGGGGGKG.
NGHHHHGGGGG.
..N.NGG.N...
.N..N.N..N..
@beetle | beetle bug | a=teal
..V....V..
...VVVV...
V.bbVVbb.V
.bbcbVbbb.
VbbbbVbbbV
.bbbbVbbb.
V.bbbVbb.V
...bbbb...
@fly | fly housefly
.AA....AA.
AAAA..AAAA
.AAVVVVAA.
..VRVVRV..
..VVVVVV..
...VVVV...
..V.VV.V..
@mosquito | mosquito
..AA.AA....
...AAA.....
..VVVVVKV..
.VVVVVVVVxxR
..V.V.V....
.V..V..V...
@firefly | firefly glowing bug
.....AA...
....AAAA..
EYYVVVVKV.
EYYVVVVVV.
.E.V.V.V..
@slug | slug slimy | a=tan
..........K.K
..........b.b
....bbbbbbbbb
..bbbcbbbbbKb
bbbbbbbbbbbbb
@lizard | lizard green | a=green
...........bbb
..........bbKb
.a..bbbbbbbbb.
a..bbccccbb...
a.bb.b..b.b...
.ab..b....b...
=gecko | gecko orange lizard | lizard | a=orange
@chameleon | chameleon on branch
.....HH.......
...GGGGGG.GG..
..GGHGGGGGGGG.
.GG.GGHGGGWKG.
.G.GGGGGGGGGGR
.GG.GGGGGG.GG.
..GNN.GG......
TTTTTTTTTTTTTT
@cobra | cobra snake hooded | a=tan
...bbbb...
..bbbbbb..
.bbKbbKbb.
.bbbbbbbb.
.bbcRRcbb.
..bccccb..
...bccb...
...bccb.b.
.bbbccbbb.
bbbbbbbb..
.bbbbbb...
// dinosaurs
@t-rex | t-rex tyrannosaurus dinosaur | a=green
..........bbbbbbb.
.........bbbKbbbbb
.........bbbbbbbbb
.........bbbbWKWKW
.........bbbbbbbb.
........bbbbWKWK..
a......bbbbb......
aa....bbbbbbbb....
.aa..bbbbbcc.b....
..abbbbbbbcc......
...abbbbbbcc......
....abbbbbc.......
.....bbb.bb.......
.....bb..bb.......
.....bbb.bbb......
@triceratops | triceratops dinosaur three horns | a=teal
..........cc........
.........cccc.W..W..
.....bbbbccccbW.W...
...bbbbbbbcccbbbb...
..bbbbbbbbbccbKbbb.W
.bbbbbbbbbbbcbbbbbW.
abbbbbbbbbbbbbbbbbb.
a.bbbbbbbbbbb.bbbb..
..bbb.bb.bbbb.......
..bbb.....bbb.......
..aaa.....aaa.......
@stegosaurus | stegosaurus dinosaur back plates | a=green
......O..O..O.......
.....OOOOOOOOO......
....ObbObbObbbO.....
W..bbbbbbbbbbbbb....
.Wbbbbbbbbbbbbbbbbb.
W.abbbbbbbbbbbbbbKb.
...abbbbbbbbbbb.bb..
....bbb.bb.bbb......
....bbb....bbb......
....aaa....aaa......
@brontosaurus | brontosaurus long neck dinosaur diplodocus | a=blue
...............bbb..
..............bbKbb.
..............bbbbb.
..............bb....
.............bbb....
.............bb.....
.....bbbbbbbbbb.....
...bbbbbbbbbbbb.....
a.bbbbbbbbbbbbb.....
.abbbbbbbbbbbb......
...bbb.bb.bbb.......
...bbb....bbb.......
...aaa....aaa.......
@pterodactyl | pterodactyl flying dinosaur | a=copper
b............b
bb....a.....bb
bbb...ab...bbb
.bbbb.bbb.bbbb
..bbbbbKbbbbb.
...bbbbbOObb..
.....bbb.OO...
.....b.b......
@raptor | raptor velociraptor dinosaur | a=orange
.........bbbb.
........bbKbbb
........bbbWWW
a.......bb....
.a....bbbb....
..abbbbbbb.b..
...bbbbbcc....
....bbbb......
....b..b......
....bb.bb.....
@dino-egg | dinosaur egg spotted
...EEEE...
..EEEGEE..
.EEGEEEEE.
.EEEEEEGE.
EEEEGEEEEE
EGEEEEEEEF
EEEEEEGEFF
.EEGEEEFF.
..EEEFFF..
@baby-dino | baby dinosaur hatching from egg
...GGGG...
..GKGGKG..
..GGGGGG..
...GHHG...
.E.GGGG.E.
EEE.EE.EEE
EEEEEEEEEF
EEEEEEEEFF
.EEEEEEFF.
..EEEFFF..
// aliens and robots
@alien-green | alien little green man antenna | a=green
..b......b..
...b....b...
..bbbbbbbb..
.bbbbbbbbbb.
.bKKbbbbKKb.
.bKKbbbbKKb.
..bbbbbbbb..
...bbaabb...
..PPPPPPPP..
.bPPPYPPPPb.
.b.PPPPPP.b.
...PP..PP...
...VV..VV...
@alien-grey | grey alien big eyes
...wwwwww...
..wwwwwwww..
.wwwwwwwwww.
.wKKwwwwKKw.
.wKKKwwKKKw.
..wKKwwKKw..
...wwwwww...
....wxxw....
...wwwwww...
..ww.ww.ww..
..w..ww..w..
....ww.ww...
....w...w...
@alien-blob | alien blob purple three eyes | a=purple
.W...W...W.
.K...K...K.
.b...b...b.
.bbbbbbbbb.
bbbbbbbbbbb
bbcbbbbbbbb
bbbbKKKbbbb
bbbbbbbbbbb
.bbbbbbbbb.
b.b.b.b.b.b
b.b.b.b.b.b
@alien-one-eye | alien one eye teal cyclops | a=teal
....R.....
....b.....
..bbbbbb..
.bbWWWWbb.
.bWWKKWWb.
.bWWKKWWb.
.bbWWWWbb.
..bbbbbb..
.bbbccbbb.
b.bbccbb.b
b.bbbbbb.b
..bb..bb..
.bbb..bbb.
@robot-dog | robot dog pet
..........x.x.
R.........xxxx
x.........xAxx
x.........xxxV
.xxxxxxxxxxx..
.xwwwwwwwwx...
.xxxxxxxxxx...
.VV.VV.VV.VV..
.x...x.x...x..
.V...V.V...V..
@robot-ball | round robot ball droid
....WWWW....
...WWOOWW...
...WVAAVW...
...xxxxxx...
..WWWWWWWW..
.WWOWWWWOWW.
.WOOOWWWWOW.
.WWOWWxxWWW.
.WWWWWxxWWw.
..WWOWWWWw..
...wwwwww...
@robot-tank | robot on tracks treads claws
....R.......
....x.......
..YYYYYYY...
..YAAYAAY...
..YYYYYYY...
...xXXXx....
.OOOOOOOOO.x
xO.OOROOO.xx
.OOOOOOOOO.x
.VVVVVVVVVV.
VxVxVxVxVxVV
.VVVVVVVVVV.
// storybook beasts
#unihorn y=-2
.............Y
............Y.
=unicorn | unicorn white horse horn pink mane | horse:a=white,d=pink unihorn
#pegwing y=0
....xx......
...xWWx.....
..xWWWWx....
..xwWWWx....
...xxwWx....
=pegasus | pegasus winged horse | horse:a=white,d=ice pegwing
@phoenix | phoenix fire bird
Y..........Y
OY...YY...YO
OOY.YOOK.YOO
ROOYOOOOYOOR
.ROOOOOOOOR.
..RROOOORR..
....OOOO....
....ROOR....
...R.RR.R...
..Y..OO..Y..
.....YY.....
@sea-serpent | sea serpent loch ness monster | a=green
.bbb..........
bbKbb.........
bbbbW.........
.bbb..........
.bbb...bbb....
.bbb..bbbbb..b
.bbbb.bbcbbb.b
AAbbAAAbbbAAbA
.AAAAAAAAAAAA.
@swamp-monster | swamp monster creature green
....NNNN....
..NNGGGGNN..
.NGGYKGYKGN.
.NGGGGGGGGN.
NGGNKKKKNGGN
NGGGNNNNGGGN
GGNGGGGGGNGG
GG.GGHGGG.GG
N..GGGGGG..N
...GG..GG...
..NGG..GGN..
@furry-monster | cute furry monster purple one eye horns | a=purple
W..........W
WW........WW
.bbbbbbbbbb.
bbbbWWWWbbbb
bbbWWKKWWbbb
bbbWWKKWWbbb
bbbbWWWWbbbb
bbKKKKKKKKbb
bbbWKWKWKbbb
.bbbbbbbbbb.
.bb.bbbb.bb.
.aa......aa.
@baby-dragon | baby dragon cute green | a=green
..R.....R...
..bb...bb...
..bbbbbbb...
.bbKbbbKbb..
.bbbbbbbbb.W
..bbKKbb..WW
..bbbbbb.WWb
.bbccccbbbb.
.bbccccbb...
a.bccccb....
aa.bb.bb....
.aabb.bb....
`);

// ───────────────────────── home ─────────────────────────
category('home', 'Home & garden', 'thing');
pack(`
// living room
@sofa | sofa couch red | a=red
..bbbbbbbbbb..
..bcbbbbbbbb..
..bbbbbabbbb..
bbbbbbbabbbbbb
bcbccccacccbbb
bbbbbbbbbbbbbb
baaaaaaaaaaaab
C............C
=sofa-blue | blue sofa couch | sofa | a=blue
@armchair | armchair comfy chair | a=green
..bbbbbb..
..bcbbbb..
..bbbbbb..
bbbbbbbbbb
bcbccccbbb
bbbbbbbbbb
baaaaaaaab
C........C
@coffee-table | coffee table low
LLLLLLLLLLLL
TTTTTTTTTTTT
.T........T.
.T........T.
.C........C.
@floor-lamp | floor lamp standing lamp
..EEEE..
.EYYYYE.
.YYYYYY.
YYYYYYYO
...x....
...x....
...x....
...x....
...x....
...x....
...x....
.VVVVV..
@table-lamp | table lamp bedside lamp | a=blue
..EEEE..
.EYYYYE.
EYYYYYYO
...x....
..bbb...
.bcbbb..
.bbbbb..
..aaa...
@rug | rug carpet mat | a=red
Y.Y.Y.Y.Y.Y.Y.
bbbbbbbbbbbbbb
bYYYYYYYYYYYYb
bYbbcbbbbcbbYb
bYbcbbccbbcbYb
bYbbcbbbbcbbYb
bYYYYYYYYYYYYb
bbbbbbbbbbbbbb
Y.Y.Y.Y.Y.Y.Y.
@fireplace | fireplace hearth fire
TTTTTTTTTTTTTT
LLLLLLLLLLLLLL
.xxxxxxxxxxxx.
.xwxVVVVVVxwx.
.xxVVVVYVVVxx.
.xwVVYVOVVVwx.
.xxVVOYOYVVxx.
.xwVVOOOOVVwx.
.xxVCTCTCTVxx.
XXXXXXXXXXXXXX
@photo-frame | photo frame family portrait picture
TTTTTTTT
TAAAAAAT
TAACCAAT
TAASSAAT
TAASSAAT
TARRRRAT
TRRRRRRT
TTTTTTTT
@houseplant | houseplant potted plant
...G..G...
.G.GG.G.G.
.GGHGGGGG.
GGGGHGGGHG
.GHGGGGGG.
..GGNGGG..
...NNN....
..OOOOOO..
..DOOOOD..
...OOOO...
...DOOD...
@vase-flowers | vase of flowers bouquet
.R..Y..M.
RYR.YO.MM
.R.GY.GM.
..G.G.G..
...GGG...
..AAAAA..
..ABBBA..
..BBBBB..
...BBB...
..BBBBB..
@window-curtains | window with curtains
TTTTTTTTTTTT
RRRAAAAAARRR
RRRAAWAAARRR
RRAAAAAAAARR
RRAAAAAWAARR
RZAAAAAAAAZR
RRAAAAAAAARR
RRRAAAAAARRR
TTTTTTTTTTTT
@cushion | cushion pillow purple | a=purple
b........b
.bbbbbbbb.
.bcbbbbbb.
.bbbYbbbb.
.bbbbbbbb.
.baaaaaab.
b........b
@fan | electric fan
..xxxxx..
.xwAxAwx.
xwAAxAAwx
xxxxVxxxx
xwAAxAAwx
.xwAxAwx.
..xxxxx..
....x....
....x....
..VVVVV..
// bedroom
@double-bed | double bed blue blanket | a=blue
TTTTTTTTTTTTTT
TLTTTTTTTTTTLT
TWWWWWTTWWWWWT
TWWWWwTTWWWWwT
bbbbbbbbbbbbbb
bcbbbbbbbbbbbb
bbbbbbbcbbbbbb
bbbbbbbbbbbbbb
aaaaaaaaaaaaaa
T............T
@bunk-bed | bunk bed
T..........T
TWWBBBBBBBBT
TTTTTTTTTTTT
T........L.T
T........L.T
TWWRRRRRRLRT
TTTTTTTTTTTT
T........L.T
T..........T
@crib | baby crib cot
W..........W
WWWWWWWWWWWW
W.W.W.W.W.WW
WzWzWzWzWzWW
WzWzWzWzWzWW
WWWWWWWWWWWW
W..........W
@wardrobe | wardrobe closet
TTTTTTTTTT
TLLLLTLLLT
TLLLLTLLLT
TLLLLTLLLT
TLLLYTYLLT
TLLLLTLLLT
TLLLLTLLLT
TLLLLTLLLT
TTTTTTTTTT
TLLLLLLLYT
TTTTTTTTTT
C........C
@dresser | dresser chest of drawers
LLLLLLLLLLLL
TTTTTTTTTTTT
TLLLLYYLLLLT
TTTTTTTTTTTT
TLLLLYYLLLLT
TTTTTTTTTTTT
TLLLLYYLLLLT
TTTTTTTTTTTT
C..........C
@pillow | pillow white
.WWWWWWWWWW.
WWWWWWWWWWWW
WWWWWWWWWWWw
WWWWWWWWWwww
.wwwwwwwwww.
@laundry-basket | laundry basket clothes
..RR.AAA....
.RRRWAAABB..
LLLLLLLLLLLL
.LTLTLTLTLL.
.LLTLTLTLTL.
.LTLTLTLTLL.
..LLLLLLLL..
@coat-rack | coat rack stand
.T..T..T.
..T.T.T..
...TTT...
.RR.T....
.RR.T.BB.
.RR.T.BB.
....T.BB.
....T....
....T....
....T....
..TTTTT..
// kitchen
@fridge | fridge refrigerator
WWWWWWWW
WWWWWWWw
WWWWWxWw
WWWWWxWw
xxxxxxxx
WWWWWxWw
WWWWWxWw
WWWWWWWw
WWWWWWWw
WWWWWWWw
WWWWWWWw
wwwwwwww
V......V
@cooker | cooker stove oven
VxVxxVxVxx
WWWWWWWWWW
WRWRWWRWRW
WWWWWWWWWW
WVVVVVVVVW
WVVOOOOVVW
WVVOYYOVVW
WVVVVVVVVW
WWWWWWWWWW
wwwwwwwwww
@microwave | microwave oven
wwwwwwwwwwww
wVVVVVVVVwGw
wVAAVVVVVwxw
wVAVVVVVVwxw
wVVVVVVVVwxw
wwwwwwwwwwww
@toaster | toaster with toast
..LLL.LLL..
..LFL.LFL..
.xxxxxxxxx.
xwwwwwwwwwx
xwwwwwwwwRx
xwwwwwwwwwx
xxxxxxxxxxx
V.........V
@kettle | kettle red | a=red
....VV....
...bbbb...
..bbbbbb.V
bbbcbbbbbV
.bbcbbbbbV
..bbbbbbbV
..bbbbbb..
..aaaaaa..
@blender | blender mixer smoothie
..VVVVV..
..AAAAA.x
..AMMMA.x
..AMMMAx.
...AMA...
...AAA...
..xxxxx..
..xRxxx..
.xxxxxxx.
@kitchen-sink | kitchen sink tap
.....xx.....
....xx.x....
....x..A....
wwwwwwwwwwww
wxAAAAAAAAxw
wwxxxxxxxxww
TTTTTTTTTTTT
TLLLLTTLLLLT
TLLLYTTYLLLT
TLLLLTTLLLLT
TTTTTTTTTTTT
@washing-machine | washing machine laundry
WWWWWWWWWW
WBWxxxWRWW
wwwwwwwwww
WWWxxxxWWW
WWxAAAAxWW
WWxABBAxWW
WWxAAAAxWW
WWWxxxxWWW
WWWWWWWWWW
wwwwwwwwww
@frying-pan | frying pan with fried egg
..VVVVVV......
.VXWWWXXV.....
VXWWYYWXXVTTTT
VXWWYYWWXVTTTT
.VXWWWWXV.....
..VVVVVV......
@cooking-pot | cooking pot saucepan steam
...w...w....
....w...w...
.xxxxxxxxxx.
VxwwxxxxxxxV
VxwxxxxxxxxV
.xxxxxxxxxx.
.xxxxxxxxxx.
..XXXXXXXX..
@kitchen-knife | kitchen knife
.........ww
.......wwWw
.....wwWWw.
...wwWWww..
..VwWww....
.VVVw......
VVV........
VV.........
@fork | fork cutlery
.w.w.w.
.w.w.w.
.w.w.w.
.wwwww.
..www..
...w...
...w...
...w...
...w...
...w...
...x...
@spoon | spoon cutlery
..www..
.wWwww.
.wWwww.
.wwwww.
..www..
...w...
...w...
...w...
...w...
...w...
...x...
@plate | plate dish empty
..wwwwwwww..
.wWWWWWWWWw.
wWWwwwwwwWWw
wWWwWWWWwWWw
wWWwwwwwwWWw
.wWWWWWWWWw.
..wwwwwwww..
@bowl | bowl blue empty | a=blue
bbbbbbbbbbbb
bWWWWWWWWWWb
.bcbbbbbbbb.
.bbbbbbbbbb.
..bbbbbbbb..
...aaaaaa...
@glass | glass of water
A......A
AWWWWWWA
ABBBBBBA
ABWBBBBA
ABWBBBBA
.ABBBBA.
.ABBBBA.
.AAAAAA.
@teacup | teacup cup of tea saucer
..w..w....
...w..w...
WWWWWWWW..
WTTTTTTWWW
WWWWWWWW.W
.WWWWWWWW.
..WWWWW...
wwwwwwwww.
@teapot | teapot | a=blue
.....YY.....
....bbbb....
..bbbbbbbb..
b.bbcbbbbbaa
bbbbcbbbbb.a
.bbbbbbbbb.a
..bbbbbbbbaa
..bbbbbbbb..
...aaaaaa...
@chopping-board | chopping board cutting board tomato
..LLLLLLLLLLL
..LLLLLLLLLLL
TTLLRRLLLLTLL
TTLRRRRLLLLLL
..LLRRLLGGLLL
..LLLLLLLLLLL
..TTTTTTTTTTT
@rolling-pin | rolling pin baking
..........TT
.........TT.
.......LLL..
.....LLLLL..
...LLLFLL...
..LLLFLL....
..LLLLL.....
.TTLL.......
TT..........
@whisk | whisk baking
..xxx..
.x.x.x.
x..x..x
x..x..x
x..x..x
.x.x.x.
..xxx..
...V...
...V...
...V...
...V...
@spatula | spatula kitchen turner
.VVVVV.
.V.V.V.
.V.V.V.
.VVVVV.
..VVV..
...R...
...R...
...R...
...R...
...R...
@oven-glove | oven glove mitt | a=red
...bbbb..
..bbbbbb.
..bbcbbb.
b.bbbbbb.
bbbbbbbb.
bbbbbbbb.
.bbbbbbb.
..bbbbb..
..WWWWW..
..WWWWW..
@bin | trash can rubbish bin
....xx....
.xxxxxxxx.
xxxxxxxxxx
.xwxxwxxx.
.xwxxwxxX.
.xwxxwxxX.
.xwxxwxxX.
.xwxxwxxX.
..xxxxxX..
@jar | jar of jam | a=red
..YYYYYY..
..YYYYYY..
.AAAAAAAA.
.AbbbbbbA.
.AWWWWWbA.
.AWbbWWbA.
.AbbbbbbA.
.AbbbbbbA.
..AAAAAA..
@salt-pepper | salt and pepper shakers
.xxx...xxx.
.xxx...xxx.
WWWWW.VVVVV
WWKWW.VVWVV
WWWWW.VVVVV
WWWWW.VVVVV
WWWWW.VVVVV
@dining-table | dining table with tablecloth
WWWWWWWWWWWWWW
WRWRWRWRWRWRWW
WWWWWWWWWWWWWW
.WRWRWRWRWRWW.
..T........T..
..T........T..
..T........T..
..C........C..
// bathroom
@bathtub | bathtub bath bubbles
....W..W.....x
..WWWWWWWW..xx
.WWAWWAWWWW.x.
WWWWWWWWWWWWWW
WWWWWWWWWWWWWw
.WWWWWWWWWWWw.
.WWWWWWWWWWww.
..wwwwwwwwww..
..Y........Y..
@shower | shower
xxxxxxx..
x.....x..
x....xxx.
x...xxxxx
x...A.A.A
x....A.A.
x...A.A.A
x....A.A.
x...A.A.A
x........
x........
XXXXXXXXX
@toilet | toilet loo
WWWWWW....
WWWWxW....
WWWWWW....
WWWWWW....
.WWWW.....
wwwwwwwwww
WWWWWWWWWW
.WWWWWWWW.
..WWWWWW..
...WWWW...
..wwwwww..
@bathroom-sink | bathroom sink wash basin
....xx....
...xx.x...
...x..A...
WWWWWWWWWW
WwAAAAAAwW
.WWWWWWWW.
...WWWW...
....WW....
....WW....
....WW....
...wwww...
@toilet-paper | toilet paper roll
..WWWWWW..
.WWwwwwWW.
.WwxVVxwW.
.WWwwwwWWW
.WWWWWWWWW
.WWWWWWWWW
..WWWWWWWW
........Ww
@toothbrush | toothbrush | a=blue
.........WW
........WWW
.......bWW.
......bb...
.....bb....
....bb.....
...bb......
..bc.......
.bb........
bb.........
@toothpaste | toothpaste tube
.........xx
.......WWx.
.....WWBWW.
....WBBBWW.
...WWRRWW..
..WWWWWW...
.WWWWWW....
WWWWW......
WW.........
@soap | soap bar bubbles
........A.
..A...AA..
....A.....
.zzzzzzzz.
zzWWzzzzzz
zzzzzzzzzM
zzzzzzzzMM
.MMMMMMMM.
@towel | towel folded | a=teal
bbbbbbbbbbbb
bcccccccccbb
bbbbbbbbbbbb
bWWWWWWWWWbb
bbbbbbbbbbbb
aaaaaaaaaaaa
bbbbbbbbbbbb
aaaaaaaaaaaa
@rubber-duck | rubber duck bath toy
...YYYY....
..YYKYYOO..
..YYYYYO...
Y..YYYY....
YYYYYYYYY..
YYYEEYYYY..
.YYYYYYY...
..YYYYY....
@shampoo | shampoo bottle
...VV...
...VVV..
...xx...
..PPPP..
.PPPPPP.
.PWWWWP.
.PWJJWP.
.PWWWWP.
.PPPPPP.
.QQQQQQ.
@hairdryer | hair dryer
.MMMMMMM..
MMMMMMMMxx
MMzMMMMMxx
MMMMMMMMxx
.MMMMMMM..
...MM.....
...MM.....
...MM.....
...VV.....
@comb | comb hair
TTTTTTTTTTTT
TTTTTTTTTTTT
T.T.T.T.T.T.
T.T.T.T.T.T.
T.T.T.T.T.T.
// garden
@lawnmower | lawn mower garden
.........VV
........V..
.......V...
......V....
.RRRRRV....
RRRRRRRR...
RRRYRRRR...
VVRRRRVV...
VxV..VxV...
.V....V....
@watering-can | watering can garden
........xxx.
A......x...x
.A..GGGGGG.x
A.xGGGGGGGx.
...xGHGGGG..
....GGGGGG..
....GGGGGG..
....NNNNNN..
@garden-hose | garden hose coiled
...GGGGGG...
..GNNNNNNG..
.GN.GGGG.NG.
.GNG.NN.GNG.
.GNG.NN.GNG.
.GN.GGGG.NG.
..GNNNNNNGGY
...GGGGGG.YY
@flower-pot | flower pot terracotta empty
OOOOOOOOOO
DOOOOOOOOD
.OTTTTTTO.
.OOOOOOOO.
.DOOOOOOD.
..OOOOOO..
..DOOOOD..
@wheelbarrow | wheelbarrow garden
..TTTTTTTT....
RRRRRRRRRRR...
.RRRRRRRRR.TTT
..RRRRRRR.T...
...xxxxxxT....
..VVx...x.....
.VxxV...x.....
..VV....x.....
@garden-gnome | garden gnome red hat
....R.....
...RRR....
...RRR....
..RRRRR...
..SKSKS...
..WWSWW...
.BWWWWWB..
.BBWWWBB..
.SBBWBBS..
..BBBBB...
..GGGGG...
..VV.VV...
@bird-house | bird house nest box
....RR....
...RRRR...
..RRRRRR..
.RRRRRRRR.
..LLLLLL..
..LLVVLL..
..LLVVLL..
..LLLLLL..
..LLTTLL..
....TT....
....TT....
....TT....
@barbecue | barbecue grill bbq
..w..w..w...
...w..w.....
.ZZIZZIZZIZ.
VVVVVVVVVVVV
.VVVVVVVVVV.
..VVVVVVVV..
...VV..VV...
..V......V..
.V........V.
.V........V.
@deck-chair | deck chair beach chair striped
T.........
TR........
.TWR......
.TRWR.....
..TWRW....
..TTRWRW..
.T..TTTTTT
T.....T..T
T....T...T
@parasol | beach umbrella parasol
.....RWWR.....
...RRWWWWRR...
.RRRWWRRWWRRR.
RRRWWWRRWWWRRR
......T.......
......T.......
......T.......
......T.......
......T.......
......T.......
@paddling-pool | paddling pool kids pool
..RRRRRRRRRR..
.RAAAAAAAAAAR.
RYAAWAAAAAAAYR
RYYAAAAAWAAYYR
.RYYYYYYYYYYR.
..RRRRRRRRRR..
@swing-set | swing playground
RRRRRRRRRRRR
R..x..x....R
R..x..x....R
R..x..x....R
R..x..x....R
R..x..x....R
R..BBBB....R
R..........R
R..........R
@slide | playground slide
.BB.........
.BYY........
.B.YYY......
.BB..YYY....
.B.....YYY..
.BB......YYY
.B.........Y
.BB.........
.B..........
@dog-house | dog house kennel
.....RR.....
....RRRR....
...RRRRRR...
..RRRRRRRR..
.RRRRRRRRRR.
..LLLLLLLL..
..LLLVVLLL..
..LLVVVVLL..
..LLVVVVLL..
..TLVVVVLT..
@hammock | hammock between posts
T............T
TW..........WT
T.WW......WW.T
T..RWRWRWRW..T
T...RWRWRW...T
T............T
T............T
@washing-line | washing line clothes drying
T............T
TxxxxxxxxxxxxT
T.RR..WWW.BB.T
T.RR..W.W.BB.T
T.RR......B..T
T............T
T............T
T............T
// garage and around the house
@step-ladder | step ladder
...xx...
..xYYx..
..x..x..
..xYYx..
.x....x.
.xYYYYx.
.x....x.
xYYYYYYx
x......x
x......x
@paint-can | paint can tin blue | a=blue
..xxxxxx..
.x......x.
xbbbbbbbbx
wwwwwwwwww
wxbbbbxxxw
wxbcbbxxxw
wxxbbxxxxw
wxxxxxxxxw
.xxxxxxxx.
@tyre | tyre tire wheel
..VVVVVV..
.VVKKKKVV.
VVKxxxxKVV
VKxxwwxxKV
VKxwVVwxKV
VKxwVVwxKV
VKxxwwxxKV
VVKxxxxKVV
.VVKKKKVV.
..VVVVVV..
@fuel-can | fuel can petrol jerrycan
.YY..RRRR.
.Y..RR..R.
RRRRRRRRR.
RRIRRRRRR.
RRRZRRZRR.
RRRRZZRRR.
RRRZRRZRR.
RRRRRRRRR.
ZZZZZZZZZ.
@cardboard-box | cardboard box moving box
.LLLLLLLLLL.
LLLLLFFLLLLL
TTTTTFFTTTTT
LLLLLFFLLLLL
LLLLLLLLLLLL
LLLLLLLLLTLL
LLLLLLLLLLLL
TTTTTTTTTTTT
@vacuum-cleaner | vacuum cleaner hoover
........VV
.......V..
......V...
.RRRR.V...
RRIRRRV...
RRRRRRV...
RRRRRR.V..
VVRRVV.V..
VV..VVxxxx
@iron | clothes iron
....VVVVVV..
...V.....V..
..AAAAAAAAA.
.AAWAAAAAAA.
AAAAAAAAAAA.
xxxxxxxxxxx.
@light-bulb | light bulb idea
..EEEE..
.EYYYYE.
EYYWYYYE
EYYWYYYE
EYYYYYYE
.EYOOYE.
..EOOE..
..xxxx..
..XXXX..
...xx...
@front-door | front door house door red | a=red
TTTTTTTTTT
TbbbbbbbbT
TbAAbbAAbT
TbAAbbAAbT
TbbbbbbbbT
TbccbbccbT
TbcbbbcbYT
TbcbbbcbbT
TbccbbccbT
TbbbbbbbbT
TbbbbbbbbT
@house-window | house window glass panes
WWWWWWWWWW
WAAAWAAAAW
WAWAWAAAAW
WAAAWAAAAW
WWWWWWWWWW
WAAAWAAAAW
WAAAWAAWAW
WAAAWAAAAW
WWWWWWWWWW
wwwwwwwwww
@doormat | doormat welcome mat
TLTLTLTLTLTL
LTTTTTTTTTTT
TTLLTLTLLLTL
LTTTTTTTTTTT
TLTLTLTLTLTL
`);

// ───────────────────────── food and drink ─────────────────────────
category('meals', 'Food & drink', 'thing');
pack(`
// fruit
@orange | orange fruit
.....GG..
...OOGOO.
..OOOOOOO
.OOFOOOOO
.OFFOOOOO
.OOOOOOOD
.OOOOOODD
..OOOODD.
...DDDD..
@lemon | lemon yellow fruit | a=yellow
...bbbbb...
.bbbccbbbb.
bbbccbbbbbb
bbbbbbbbbba
.bbbbbbbaa.
...aaaaa...
=lime | lime green fruit | lemon | a=green
@pear | pear green fruit
....T....
....T.G..
...HHGG..
...HHH...
..HHHHH..
.HHEHHHG.
.HEEHHHG.
.HHHHHGG.
..HHGGG..
@peach | peach fruit
....T.G..
...TGG...
..FFIFF..
.FFFIIFF.
.FFFIIIF.
.FFFIIIF.
.FFIIIII.
..FIIII..
@pineapple | pineapple
...G.G...
.G.GGG.G.
..GGGGG..
...GGG...
..YOYOY..
.YOYOYOY.
.OYOYOYO.
.YOYOYOY.
.OYOYOYO.
.YOYOYOY.
..OYOYO..
@watermelon-slice | watermelon slice
RRRRRRRRRRRR
RRKRRRKRRKRR
WRRRKRRRRRRW
GWRRRRRKRRWG
.GWRRRRRRWG.
..GGWWWWGG..
....GGGG....
@kiwi | kiwi fruit half
..TTTTTT..
.THHHHHHT.
THHKHHKHHT
THKHEEHKHT
THHHEEHHHT
THKHHHHKHT
.THHKKHHT.
..TTTTTT..
@blueberries | blueberries berries
....G.....
..BBGBB...
.BABBBAB..
.BBBUBBBU.
..UBBBBB..
..BABBU...
...BBU....
@coconut | coconut half
..TTTTTT..
.TWWWWWWT.
TWWWWWWWWT
TWWwwwwWWT
TTWWWWWWTT
.CTTTTTTC.
..CCCCCC..
@avocado | avocado half
...NNN...
..NHHHN..
..NHHHN..
.NHHHHHN.
.NHTTTHN.
NHHTLTHHN
NHHTTTHHN
.NHHHHHN.
..NNNNN..
@raspberry | raspberry berry
...GGG...
..GGGGG..
..RIRIR..
.RIRIRIR.
.IRIRIRI.
..IRIRI..
...RIR...
....R....
=green-apple | green apple | apple | a=green
// vegetables
@tomato | tomato
...GGG...
..RGGGR..
.RRRGRRR.
RRIRRRRRR
RIIRRRRRR
RRRRRRRRZ
.RRRRRRZ.
..RRRZZ..
@potato | potato
..LLLL.....
.LLLLLLLL..
LLTLLLLLLL.
LLLLLLTLLLL
LLLLLLLLLTL
.LLTLLLLLL.
..TTLLLTT..
@onion | onion
....G....
....GG...
...FF....
..FFFFF..
.FFEFFFD.
FFEFFFFDD
FFEFFFDDD
.FFFFDDD.
..DDDDD..
...W.W...
@broccoli | broccoli
..GG.GGG..
.GGGGGGGG.
GGHGGGHGGG
GGGGGGGGGN
.GGNGGGNN.
...HHHH...
...HHH....
...HHH....
@lettuce | lettuce cabbage green
..HHHHHH..
.HHGHHGHH.
HHGHHHHGHH
HGHHGGHHGH
HHHGHHGHHH
.HHGHHGHG.
..GGGGGG..
@cucumber | cucumber
..........NN
........NGGN
......NGGHN.
....NGGHGN..
..NGGHGGN...
.NGHGGGN....
NGGGGN......
.NNN........
@bell-pepper | red bell pepper | a=red
....GG...
....G....
.bbbGbbb.
bbcbbbbbb
bcbbbbbbb
bcbbbbbba
bbbbbbbba
.bbbabba.
..bb.aa..
=bell-pepper-yellow | yellow bell pepper | bell-pepper | a=yellow
@chili | chili pepper hot
.G.........
.GG........
..RRR......
..RIRRR....
...RRRRRR..
.....RRRRR.
.......RRRR
.........RR
@eggplant | eggplant aubergine
.......GG.
......GGG.
.....PGG..
....PPPP..
...PPJPP..
..PPJPPP..
.PPPPPPQ..
.PPPPPQQ..
.PPPPQQ...
..QQQQ....
@peas | peas in pod
.G.........
.GNNNNNNN..
NGHGHGHGHN.
NHHGHHGHHGN
.NNGHGHGHN.
...NNNNNN..
@garlic | garlic bulb
....L....
....W....
...WWW...
..WWWWW..
.WWwWwWW.
.WWwWwWW.
.WWwWwWW.
..WwwwW..
...LLL...
@radish | radish beetroot
.G..G..G.
.GG.G.GG.
..GGGGG..
...MMM...
..MMzMM..
.MMzMMMM.
.MMMMMMM.
..MMMMM..
...WWW...
....W....
@salad-bowl | salad bowl
..HG.RR.HH..
.HHGHRRGHHG.
WWWWWWWWWWWW
.WWWWWWWWWW.
.WWWWWWWWWw.
..WWWWWWww..
...wwwwww...
// meals
@burger | burger hamburger cheeseburger
..LLLLLLLL..
.LLFLLFLLLL.
LLLLLLLLFLLL
HGHHGHHGHHGH
YYYYYYYYYYYY
CTCCTCCCTCCC
RRRRRRRRRRRR
LLLLLLLLLLLL
.LLLLLLLLLL.
@hot-dog | hot dog sausage in bun
..ZZZZZZZZZ..
.ZIYIIYIIYIZ.
LLIIYIIYIIYLL
LLLLLLLLLLLLL
.LLLLLLLLLLL.
..TTTTTTTTT..
@fries | fries chips french fries
.Y.Y.YY.Y.
.YYYEYYYY.
.YEYYYEYY.
RYYEYYYYYR
RRRRRRRRRR
RRRYYRRRRR
.RRYYRRRR.
.RRRRRRRR.
..RRRRRR..
@pizza-slice | pizza slice pepperoni
LLLLLLLLLLL
.YYRRYYYYY.
.YYRRYYGYY.
..YYYYRRY..
..YGYYRRY..
...YYYYY...
...YRRYY...
....YYY....
....YY.....
.....Y.....
@taco | taco
...HGRHYRH...
..YHRGHRHGY..
.YYYYYYYYYYY.
YYFYYYYYYFYYY
YYYYYFYYYYYYY
.YYYYYYYYYYY.
@sandwich | sandwich
LLLLLLLLLLLL
EEEEEEEEEEEL
HGHHGHGHHGHG
IIIIIIIIIIII
YYYYYYYYYYYY
EEEEEEEEEEEL
LLLLLLLLLLLL
@sushi | sushi roll
..OOOIOOO.
.OIOOOOIOO
.WWWWWWWWW
VWWWWWWWWV
VVVVVVVVVV
VVVVVVVVVV
.VVVVVVVV.
@ramen | ramen noodles bowl chopsticks
..........T.
.........T.T
..EYEYEW.T..
.EYEYEWYW...
RRRRRRRRRRRR
.RWRRRRRRRR.
.RRRRRRRRRZ.
..RRRRRRZZ..
...ZZZZZZ...
@spaghetti | spaghetti pasta meatballs
...EYERRYE...
..EYRRREYEY..
.wEYERYEYEYw.
wWWWWWWWWWWWw
.wWWWWWWWWWw.
...wwwwwww...
@rice-bowl | rice bowl
...WWWWWW...
..WWWwWWWW..
.WWwWWWWwWW.
BBBBBBBBBBBB
.BBABBBBBBB.
.BBBBBBBBBU.
..BBBBBBUU..
...UUUUUU...
@fried-egg | fried egg sunny side up
..WWWW.....
.WWWWWWWW..
WWWYYYWWWW.
WWYEYYYWWWW
WWYYYYYWWW.
.WWYYYWWWW.
..WWWWWW...
@bacon | bacon rashers
ZZ..ZZZ..ZZ.
RIZZRIIZZRIZ
IRRIIRRIIRRI
ZIIZZIIZZIIZ
.ZZ..ZZ..ZZ.
@pancakes | pancakes stack syrup
....YY......
.LLLYYLLLL..
LTTTTTTTTTL.
.LLLLLLLLL..
LTTCTTTTTTL.
.LLLCLLLLL..
LTTTTTTTTTL.
.LLLLLLLLL..
wwwwwwwwwwww
@waffle | waffle
FFFFFFFFF
FOFFOFFOF
FFFFFFFFF
FOFFOFFOF
FFFFFFFFF
FOFFOFFOF
FFFFFFFFF
@toast | toast slice butter
.TTT..TTT.
TLLLTTLLLT
TLLLLLLLLT
TLLYYYLLLT
TLLYYYLLLT
.TLLLLLLT.
.TLLLLLLT.
.TTTTTTTT.
@croissant | croissant
....FFFF....
..FFOFFOFF..
.FOFFOFFOFF.
FFOFFOFFOFFF
FFF.DDDD.FFF
.DD......DD.
@pretzel | pretzel
..TTT..TTT..
.TL.TTTT.LT.
.T...TT...T.
.TL.TTTT.LT.
..TTT..TTT..
...TTLLTT...
....TTTT....
@soup | bowl of soup tomato
....w..w....
...w..w.....
WWWWWWWWWWWW
WRRRRIRRRRRW
.WRRRRRRRRW.
.WWWWWWWWWW.
..WWWWWWWW..
...wwwwww...
@steak | steak meat
..ZZZZZZ....
.ZRRRRRRZZ..
ZRRIRRRRRRZ.
ZRRRRWWRRRRZ
ZRRRRWWRRRZ.
.ZRRRRRRRZ..
..ZZZZZZZ...
@roast-chicken | roast chicken turkey dinner
W..........W
.L..LLLL..L.
.LLLLFLLLLL.
..LLFLLLLL..
.LLLLLLLLLL.
.TLLLLLLLLT.
wwTTTTTTTTww
.wwwwwwwwww.
@sausage | sausage
.........ZZ.
.......ZRRIZ
.....ZRRIRZ.
...ZRRIRRZ..
.ZRRIRRZ....
ZRRRRZ......
.ZZZ........
@kebab | kebab skewer
..........x.
.........RR.
........RRR.
......GGG...
.....GGG....
...TTT......
..TTT.......
.YY.........
x...........
@dumpling | dumpling
....W.W.W...
...WWWWWWW..
.WWWwWwWwWW.
WWWWWWWWWWWW
WWWWWWWWWWWw
.wwwwwwwwww.
@popcorn | popcorn box
.E.EE.EE.E.
EEEYEEEYEEE
.EYEEEYEEE.
RWRWRWRWRWR
RWRWRWRWRWR
.WRWRWRWRW.
.WRWRWRWRW.
.WRWRWRWRW.
..RWRWRWR..
@cereal | cereal bowl milk spoon
.........xx.
........x...
.WOWWYWOx...
AAAAAAAAAAA.
.AAWAAAAAA..
.AAAAAAAAB..
..BBBBBBB...
@lunchbox | lunch box
....VVVV....
...V....V...
BBBBBBBBBBBB
BAABBBBBBBBB
BBBBBwwBBBBB
UUUUUwwUUUUU
BBBBBBBBBBBB
BBBBBBBBBBBB
UUUUUUUUUUUU
@burrito | burrito wrap
........HRH.
......EEGRE.
....EEEEEEE.
...EEEFEEE..
..EEEFEEE...
.xxEEEEE....
xwxxEE......
.xwx........
// sweets
@cupcake | cupcake pink frosting cherry
....RR....
...zRz....
..zzzzzz..
.zzMzzzzz.
zzzzzzMzzz
.LTLTLTLT.
.LTLTLTLT.
..LTLTLT..
@birthday-cake | birthday cake with candles
..Y..Y..Y...
..R..B..G...
..R..B..G...
.WWWWWWWWWW.
.WzWWzWWzWW.
.MMMMMMMMMM.
.zzzzzzzzzz.
.MMMMMMMMMM.
wwwwwwwwwwww
@chocolate-bar | chocolate bar
.TTTTTTTT
.TCTTCTTC
.TTTTTTTT
.TCTTCTTC
RRRRRRRRR
RRWWRRRRR
RRRRRRRRR
RRRRRRRRR
@lollipop | lollipop swirl candy
..RRRR..
.RWWWRR.
RWRRRWRR
RWRWRWRR
RWRWWRWR
.RWRRRW.
..RRRR..
...W....
...W....
...W....
...W....
@ice-lolly | ice lolly popsicle
..RRRR..
.RRIRRR.
.RIRRRR.
.OOOOOO.
.OFOOOO.
.YYYYYY.
.YEYYYY.
.YYYYYY.
...LL...
...LL...
...LL...
@jelly | jelly jello dessert wobbly
...RRRR...
..RIRRRR..
..RIRRRR..
.RRRRRRRR.
.RIRRRRRR.
RRRRRRRRRR
wWWWWWWWWw
.wwwwwwww.
@muffin | muffin blueberry
..TTTTTT..
.TLTTUTTT.
TTTUTTTLTT
TTTTTTTUTT
.YEYEYEYE.
.YEYEYEYE.
..YEYEYE..
@cake-slice | slice of cake strawberry
.......R....
......WWW...
....WWWWWW..
..WWWWWWWWW.
.EEEEEEEEEE.
.RRRRRRRRRR.
.EEEEEEEEEE.
.EEEEEEEEEE.
wwwwwwwwwwww
@cotton-candy | cotton candy candyfloss
..zzzzz..
.zzMzzzz.
zzzzzzMzz
zMzzzzzzz
zzzzMzzzz
.zzzzzzz.
..zzMzz..
...zzz...
....W....
....W....
....W....
@honey-pot | honey pot
...YYYY.T..
..YEYYYT...
.OOOOOOOO..
.OFOOOOOO..
OOOWWWWOOO.
OFOWYYWOOO.
OOOWWWWOOD.
.OOOOOODD..
..DDDDDD...
@macaron | macaron sweet pink | a=rose
..bbbbbb..
.bcbbbbbb.
bbbbbbbbbb
WWWWWWWWWW
bbbbbbbbbb
.aaaaaaaa.
@sundae | ice cream sundae
.....R....
...WWWW...
..WWzWWW..
.AzzzzWWA.
.AzMzzzzA.
..AzzzzA..
...AzzA...
....AA....
....AA....
..AAAAAA..
@gummy-bear | gummy bear sweet | a=red
.bb..bb.
.bbbbbb.
.bKbbKb.
.bbccbb.
bbbbbbbb
.bbcbbb.
.bbbbbb.
.bb..bb.
// drinks
@coffee-cup | coffee cup takeaway
.VVVVVVVV.
VVVVVVVVVV
.WWWWWWWW.
.TTTTTTTT.
.TTLTTTTT.
.TTTTTTTT.
..WWWWWW..
..WWWWWW..
@milk-carton | milk carton
...WWWW..
..WWWWWW.
.WWWWWWWW
.BBBBBBBB
.WWWWWWWW
.WBBWWWWW
.WBBWWWWW
.WWWWWWWW
.BBBBBBBB
.wwwwwwww
@juice-box | juice box straw
......W..
.....W...
.OOOOWOO.
.OOOOOOO.
.OFFOOOO.
.OYYYOOO.
.OYOYOOO.
.OYYYOOO.
.OOOOOOO.
.DDDDDDD.
@orange-juice | glass of orange juice
A......A.O
AOOOOOOAOO
AOFOOOOA.
AOFOOOOA.
AOOOOOOA.
.AOOOOA..
.AOOOOA..
.AAAAAA..
@soda-can | soda can fizzy drink cola | a=red
.xxxxxx.
xwwwwxxx
bbbbbbbb
bcbbbbba
bWWWWWba
bcWWbbba
bWWWWWba
bcbbbbba
bbbbbbbb
.xxxxxx.
@soda-cup | soda cup with straw fast food drink
.....R...
....R....
.WWWRWWW.
WWWWWWWWW
.RRRRRRR.
.RWWRRRR.
.RWRRRRR.
..RRRRR..
..RRRRR..
..ZZZZZ..
@water-bottle | water bottle plastic
..BBB..
..BBB..
..AAA..
.AAAAA.
.AWAAA.
.BBBBB.
.BBBBB.
.AWAAA.
.AWAAA.
.AAAAA.
.AAAAA.
@milkshake | milkshake strawberry
.....R.W.
...WWWW..
..WWWWWW.
.AzzzzzzA
.AzzMzzzA
..AzzzzA.
..AzMzzA.
...AzzA..
...AzzA..
..AAAAAA.
@lemonade | lemonade jug pitcher
.AAAAAAA...
.AEYEEEYAAA
.AEEWEEEA.A
.AEEEEYEA.A
.AYEEEEEAAA
.AEEEYEEA..
.AEWEEEEA..
..AAAAAA...
@hot-chocolate | hot chocolate mug marshmallows
..w...w....
...w...w...
.WWzWWzW...
RRRRRRRRRR.
RRIRRRRR.R.
RRIRRRRR.R.
RRRRRRRRR..
.RRRRRRR...
@bubble-tea | bubble tea boba
.....P...
....P....
.WWWPWWW.
.ALLLLLA.
.ALLLLLA.
.ALLLLLA.
..ALLLA..
..AKLKA..
..AKKKA..
..AAAAA..
@baby-bottle | baby bottle milk
...FF...
..FFFF..
..BBBB..
.AWWWWA.
.AWWWWA.
.AxWWWA.
.AWWWWA.
.AxWWWA.
.AWWWWA.
.AAAAAA.
// pantry
@ketchup | ketchup bottle | a=red
...WW...
...WW...
..bbbb..
.bbbbbb.
.bcbbbb.
.bWWWWb.
.bWbbWb.
.bWWWWb.
.bbbbbb.
.aaaaaa.
=mustard | mustard bottle yellow | ketchup | a=yellow
@butter | butter block
..EEEEEEEEE.
.EEEEEEEEEY.
EEEEEEEEEYY.
YYYYYYYYYYY.
YYYYYYYYYY..
wwwwwwwwwwww
@egg-carton | egg carton box of eggs
.WW.WW.WW.WW.
WWWWWWWWWWWWW
xWWxWWxWWxWWx
xxxxxxxxxxxxx
xwxxwxxwxxwxx
XXXXXXXXXXXXX
@flour-bag | flour bag sack baking
.WWWWWWW.
.wwwwwww.
WWWWWWWWW
WWWLLLWWW
WWLLFLLWW
WWWLLLWWW
WWWWWWWWW
WWBBBBBWW
wwwwwwwww
`);

// ───────────────────────── clothes and accessories ─────────────────────────
category('clothes', 'Clothes & accessories', 'thing');
pack(`
// hats
@baseball-cap | baseball cap red | a=red
...bbbbbb...
..bcbbbbbb..
.bbbbWWbbb..
.bbbbbbbbbb.
.bbbbbbbaaaa
........aaaa
@top-hat | top hat black
..VVVVVV..
..VXVVVV..
..VXVVVV..
..VVVVVV..
..VVVVVV..
..RRRRRR..
VVVVVVVVVV
.VVVVVVVV.
@cowboy-hat | cowboy hat brown
....TT.TT.....
...TLTTTTT....
...TTTTTTT....
T..CCCCCCC..T.
TTTTTTTTTTTTT.
.TTLLLLLLTTT..
@straw-hat | straw hat sun hat ribbon
....EEEEE....
...EEYEEEE...
...RRRRRRR...
.EEEEEEEEEEE.
EYEYEYEYEYEYE
.EEEEEEEEEEE.
@woolly-hat | woolly hat beanie bobble | a=blue
....WW....
...WWWW...
..bbbbbb..
.bbcbbbbb.
.bbbbbbbb.
.WbWbWbWb.
.bWbWbWbW.
@party-hat | party hat cone
....Y....
....Y....
...BB....
...BMB...
..BBBBB..
..MBBMB..
.BBBMBBB.
.BMBBBBM.
YYYYYYYYY
@hard-hat | hard hat yellow safety helmet
....YY.....
..YYEYYY...
.YYEYYYYY..
.YYEYYYYY..
.YYYYYYYY..
OOOOOOOOOOO
@chef-hat | chef hat white
..WWW.WWW.
.WWWWWWWWW
WWWWWWWWWW
WWWWWWWWWW
.WWWWWWWW.
..WwWwWw..
..WwWwWw..
..wwwwww..
@police-cap | police cap hat
...UUUUUU...
.UUUUUUUUUU.
UUUUUYYUUUUU
.UUUUYYUUUU.
.KKKKKKKKKK.
.VVVVVVVVVVV
...VVVVVVVV.
@pirate-hat | pirate hat skull
.....VV.....
....VVVV....
...VVWWVV...
..VVWKKWVV..
.VVVVWWVVVV.
VVVVWVVWVVVV
YYYYYYYYYYYY
@bike-helmet | bike helmet cycling
...RRRRRR...
..RRIRRRRR..
.RRVRRVRRVR.
.RRVRRVRRVR.
RRRRRRRRRRRR
.x........x.
..x......x..
// clothes
@t-shirt | t-shirt tee red | a=red
..bba..abb..
.bbbbaabbbb.
bbbbbbbbbbbb
bb.bbbbbb.bb
...bcbbbb...
...bcbbbb...
...bbbbbb...
...bbbbbb...
...aaaaaa...
=t-shirt-blue | blue t-shirt tee | t-shirt | a=blue
#teestripes y=3
...WWWWWW...
............
...WWWWWW...
............
...WWWWWW...
=striped-shirt | striped t-shirt sailor top | t-shirt:a=navy teestripes
@hoodie | hoodie sweatshirt grey | a=grey
...bbbbbb...
..bbaaaabb..
.bbbaaaabbb.
bbbbWbbWbbbb
bb.bWbbWb.bb
bb.bbbbbb.bb
bb.baaaab.bb
bb.baaaab.bb
...bbbbbb...
@sweater | sweater jumper knitted | a=green
..bbb..bbb..
.bbbbbbbbbb.
bbbbbbbbbbbb
bbWbWbWbWbbb
bbbWbWbWbWbb
bb.bbbbbb.bb
bb.bbbbbb.bb
aa.bbbbbb.aa
...aaaaaa...
@jacket | jacket coat brown leather | a=brown
..bbb..bbb..
.bbbba.bbbb.
bbbbba.bbbbb
bbbbbaYbbbbb
bb.bba.bb.bb
bb.bbaYbb.bb
bb.bba.bb.bb
aa.bba.bb.aa
...bbabbb...
@raincoat | raincoat yellow rain jacket
...YYYYYY...
..YYOOOOYY..
.YYYYOOYYYY.
YYYYYOYYYYYY
YY.YYOKYY.YY
YY.YYOYYY.YY
YY.YYOKYY.YY
OO.YYOYYY.OO
...YYOYYY...
...YYYYYY...
@pink-dress | dress pink | a=pink
...b....b...
...bb..bb...
...bbbbbb...
...bbbbbb...
....YYYY....
...bbbbbb...
..bbbcbbbb..
..bbbcbbbb..
.bbbbcbbbbb.
.bbbbbcbbbb.
.aaaaaaaaaa.
@pleated-skirt | skirt pleated blue | a=blue
..aaaaaa..
..bbbbbb..
.bbbabbbb.
.bbabbabb.
bbbabbabbb
bbabbbabbb
aaaaaaaaaa
@jeans | jeans trousers blue
.BBBBBBBB.
.BYBBBBYB.
.BBBBUBBB.
.BBBBUBBB.
.BBBUUBBB.
.BBB..BBB.
.BBB..BBB.
.BBB..BBB.
.BBB..BBB.
.UUU..UUU.
@orange-shorts | shorts orange
.OOOOOOOO.
.OYOOOOYO.
.OOOODOOO.
.OOOODOOO.
.OOO..OOO.
.DDD..DDD.
@swimsuit | swimsuit swimming costume
..R....R..
..R....R..
..RR..RR..
..RRRRRR..
..RRWWRR..
...RRRR...
..RRWWRR..
..RRRRRR..
...R..R...
@pyjamas | pyjamas pajamas striped
..AAA..AAA..
.AAAAWWAAAA.
AABAABABAABA
AA.ABAAAB.AA
AA.AAAABA.AA
...ABAAAA...
...AAABAA...
...AB..BA...
...AA..AA...
...AB..AB...
// shoes
@trainer | trainer sneaker running shoe | a=red
......bbb...
.....bbbb...
....bbWbbb..
.bbbbWbWbbb.
bbbbWbbbbbbb
WWWWWWWWWWWW
.wwwwwwwwww.
@rain-boots | rain boots wellies yellow
.YYYY.YYYY..
.YEYY.YEYY..
.YEYY.YEYY..
.YYYY.YYYY..
.YYYY.YYYY..
.YYYYYYYYYYY
.YYYYYYYYYYY
.OOOOOOOOOOO
@high-heel | high heel shoe red
RR........
RRR.......
RRRR......
RRRRRR....
RZRRRRRRR.
R..RRRRRRR
R....ZZZZZ
R.........
@flip-flops | flip flops sandals
.BBB...BBB.
BBABB.BBABB
BA.AB.BA.AB
BBABB.BBABB
BBBBB.BBBBB
BBBBB.BBBBB
.BBB...BBB.
@slippers | slippers fluffy pink
.zzz...zzz.
zzWzz.zzWzz
zMMMz.zMMMz
zMMMz.zMMMz
zMMMz.zMMMz
.MMM...MMM.
@socks | socks pair striped
.WWWW..WWWW..
.RRRR..RRRR..
.WWWW..WWWW..
.RRRR..RRRR..
.WWWW..WWWW..
.WWWWW.WWWWW.
.WWWWWW.WWWWW
..wwwww..wwww
// bags
@handbag | handbag purse | a=pink
...aaaa...
..a....a..
..a....a..
bbbbbbbbbb
bcbbbbbbbb
bbbbYYbbbb
bbbbbbbbbb
.aaaaaaaa.
@suitcase | suitcase luggage travel | a=teal
....VVVV....
....V..V....
bbbbbbbbbbbb
bcbbbbbbbbbb
aaaaaaaaaaaa
bbYbbbbbbYbb
bbbbbbbbbbbb
bbbbbbbbbbbb
aaaaaaaaaaaa
.V........V.
@shopping-bag | shopping bag paper
...x....x...
..x......x..
..x......x..
.MMMMMMMMMM.
.MzMMMMMMMM.
.MMMMWWMMMM.
.MMMWWWWMMM.
.MMMMWWMMMM.
.MMMMMMMMMM.
.MMMMMMMMMM.
@briefcase | briefcase office bag
....CCCC....
...C....C...
TTTTTTTTTTTT
TLTTTTTTTTTT
TTTTTYYTTTTT
CCCCCYYCCCCC
TTTTTTTTTTTT
TTTTTTTTTTTT
@gym-bag | gym bag sports bag duffel
...VVVVVV...
..V......V..
.BBBBBBBBBB.
BBBWWWWWWBBB
BABBBBBBBBBB
BBBBBBBBBBBB
.UUUUUUUUUU.
// jewellery and glasses
@pearl-necklace | pearl necklace jewellery
W........W
W........W
.W......W.
.W......W.
..W....W..
...WwwW...
....AA....
....AA....
@diamond-ring | diamond ring engagement
...AWA...
...AAA...
....A....
..YYYYY..
.YY...YY.
.Y.....Y.
.Y.....Y.
.YY...YY.
..YYYYY..
@earrings | earrings gold jewellery
.Y.....Y.
.Y.....Y.
YYY...YYY
YRY...YRY
YYY...YYY
.Y.....Y.
@bracelet | bracelet bangle beads
..RYBGRY..
.B......B.
G........G
Y........R
R........Y
.B......G.
..YRGBYR..
@wristwatch | wrist watch
...TTT...
...TTT...
..YYYYY..
.YWWKWWY.
.YWWKKWY.
.YWWWWWY.
..YYYYY..
...TTT...
...TTT...
@tiara | tiara princess crown silver
.....A.....
..w..W..w..
.wMw.W.wMw.
.wwwwWwwww.
wwwwwwwwwww
@eyeglasses | glasses spectacles
.VVVV...VVVV.
VAAAAVVVAAAAV
VAWAAV.VAWAAV
VAAAAV.VAAAAV
.VVVV...VVVV.
@sunglasses | sunglasses shades
VVVVVVVVVVVVV
VUUUUUVUUUUUV
.UBUUU.UBUUU.
.UUUUU.UUUUU.
..UUU...UUU..
@swim-goggles | swimming goggles
..BBB...BBB..
VBAAABVBAAABV
VBAWABVBAWABV
..BBB...BBB..
// accessories
@wool-scarf | scarf woolly striped
..RRRRRRR..
.RWRRWRRWR.
.RRRRRRRRR.
..RRR.RRW..
..RWR..RR..
..RRR..RW..
..RWR..RR..
..R.R..R.R.
@glove | glove winter | a=purple
..b.b.b...
..b.b.b.b.
..bbbbb.b.
b.bbbbbbb.
bbbcbbbbb.
.bbbbbbb..
..bbbbb...
..WWWWW...
..WWWWW...
@neck-tie | tie necktie red striped
..RRRR..
...RR...
..RRRR..
..RWRR..
..RRWR..
..RWRR..
..RRWR..
..RWRR..
...RR...
@bow-tie | bow tie | a=red
bb......bb
bbbb..bbbb
bcbbaabbbb
bbbbaabbbb
bbbb..bbbb
bb......bb
@belt | belt leather buckle
TTTTTTTTTTTTTT
TLTYYYYTLTLTLT
TTTYTTYTTTTTTT
TLTYYYYTLTLTLT
TTTTTTTTTTTTTT
@umbrella | umbrella open rain | a=red
....bbbbbb....
..bbbcbbbbbb..
.bbbcbbbbbbbb.
bbbcbbbbbbbbbb
b..b..bT.b...b
.......T......
.......T......
.......T......
.......T......
....T..T......
.....TT.......
@hair-bow | hair bow ribbon pink
MM......MM
MMMM..MMMM
MzMMRRMMMM
MMMMRRMMMM
MMMM..MMMM
MM.M..M.MM
...M..M...
@coat-hanger | coat hanger clothes
......xx......
.....x..x.....
........x.....
.......x......
......TT......
....TTTTTT....
..TTT....TTT..
TTT........TTT
TTTTTTTTTTTTTT
// dressing up
@carnival-mask | carnival mask masquerade party
Y..........Y
PP...YY...PP
PPPPPPPPPPPP
PPKKKPPKKKPP
PJKKKPPKKKPP
.PPPPPPPPPP.
..PPP..PPP..
@hero-cape | superhero cape red
..YRRRRRRY..
..RRRRRRRR..
..RRIRRRRR..
.RRRIRRRRRR.
.RRRIRRRRRR.
.RRRRRRRRRR.
RRRRRRRRRRRR
RRRRRRRRRRRR
RZRRZRRRZRRZ
Z..ZZ.Z.ZZ.Z
@fairy-wings | fairy wings costume
.AAA....AAA.
AAJAA..AAJAA
AJJJAAAAJJJA
AAJJAWWAJJAA
.AAAAWWAAAA.
..AAJAAJAA..
.AAJA..AJAA.
.AAA....AAA.
@bunny-ears | bunny ears headband costume
.WW....WW.
.WMW..WMW.
.WMW..WMW.
.WMW..WMW.
.WMW..WMW.
..WW..WW..
.VVVVVVVV.
V........V
V........V
@disguise-glasses | disguise fake glasses nose mustache
.VVVV..VVVV.
VAAAAVVAAAAV
VAAAAVVAAAAV
.VVVVSSVVVV.
....SSSS....
..CCCCCCCC..
.CCC....CCC.
`);

// ───────────────────────── city and travel ─────────────────────────
category('city', 'City & travel', 'thing');
pack(`
// cars: one body, different paint and fittings
#car a=red
......bbbbbbbb......
.....bAAAbbAAAb.....
....bbAWAbbAWAbb....
.bbbbbbbbbbbbbbbbbb.
bbbbbbbbbbbbbbbbbbbY
bcccbbbbbbbbbKbbbbbb
RbbVVVbbbbbbbbVVVbbx
..VVxVV......VVxVV..
...VVV........VVV...
#taxisign y=-2
.........YY.........
........YKKY........
#checker y=5
..KWKWKWKWKWKWKWKW..
#lightbar y=-1
........RRBB........
#polstripe y=5
.BBBBBBBBBBBBBBBBBB.
=car-red | red car | car
=car-blue | blue car | car | a=blue
=taxi | yellow taxi cab | car:a=yellow taxisign checker
=police-car | police car with light bar | car:a=white lightbar polstripe
@sports-car | red sports car fast | a=red
.......bbbbbb.......
.....bbAAAbAAb......
a..bbbAAAAbAAAbbb...
bbbbbbbbbbbbbbbbbbb.
bcccbbbbbbbbbbbbbbbY
RbVVVbbbbbbbbbVVVbbb
..VxVV........VxVV..
...VV..........VV...
#van a=white
.bbbbbbbbbbbbbbb....
.bbbbbbbbbbbbbbbb...
.bbbbbbbbbbbbAAAbb..
.bbbbbbbbbbbbAAWAb..
.bbbbbbbbbbbbAAAAbb.
.bbbbbbbbbbbbbbbbbbb
.bbbbbbbbbbbbKbbbbbY
.accccccccccbbbbbbbb
RbbVVVbbbbbbbbVVVbbx
...VxV........VxV...
...VVV........VVV...
#parcelmark y=2
....LLLL....
....LTTL....
....LLLL....
#ambmarks y=-1
......BB............
....................
....................
.....R..............
....RRR.............
.....R..............
....................
.RRRRRRRRRRR........
#roofcone y=-4
.....zzz......
....zzMzz.....
.....LLL......
......L.......
#servewin y=1
..RWRWRWRWR.
..VAAAAAAAV.
..VAAAAAAAV.
..VVVVVVVVV.
#camperwin y=2
...AAA.AAA...
...AAA.AAA...
....................
.OOOOOOOOOOOOOOOOOO.
=delivery-van | delivery van white parcel | van parcelmark
=ambulance | ambulance emergency | van ambmarks
=ice-cream-van | ice cream van truck | van:a=rose roofcone servewin
=camper-van | camper van holiday | van:a=cream camperwin
@pickup-truck | pickup truck blue | a=blue
.........bbbbbb.....
........bbAAAbAb....
........bAAAAbAAb...
bbbbbbbbbbbbbbbbbbb.
bcccccccbbbbbKbbbbbY
RbbbbbbbbbbbbbbbbbbY
bbbVVVbbbbbbbbVVVbbx
...VxV........VxV...
...VVV........VVV...
#bus a=red
.bbbbbbbbbbbbbbbbbbbb.
bbbbbbbbbbbbbbbbbbbbbb
bAAAbAAAbAAAbAAAbbAAAb
bAAAbAAAbAAAbAAAbbAAAb
bAAAbAAAbAAAbAAAbbAAAb
bbbbbbbbbbbbbbbbbbAAAb
bcccccccccccccccbbAAAb
bbbbbbbbbbbbbbbbbbAAAY
RbVVVbbbbbbbbbVVVbbbbb
...VxV........VxV.....
...VVV........VVV.....
#busstripe y=6
.KKKKKKKKKKKKKKK......
=city-bus | city bus red | bus
=school-bus | school bus yellow | bus:a=yellow busstripe
@truck | truck lorry delivery | a=blue
wwwwwwwwwwwwww........
wWWWWWWWWWWWWw.bbbbb..
wWWWWWWWWWWWWw.bAAAbb.
wWWWWWWWWWWWWw.bAAAAb.
wWWWWWWWWWWWWw.bbbbbbb
wWWWWWWWWWWWWw.bbKbbbY
wwwwwwwwwwwwww.bbbbbbb
VVVVVVVVVVVVVVVVVVVVVx
..VVV..VVV.......VVV..
..VxV..VxV.......VxV..
..VVV..VVV.......VVV..
@fire-engine | fire engine fire truck ladder
..xxxxxxxxxxxxxxx.....
..x.x.x.x.x.x.x.xB....
.RRRRRRRRRRRRRRRRRRR..
.RRWWRRRRRRRRRRRAAARR.
.RRWWRRYYYYYYRRRAAAAR.
.RRRRRRRRRRRRRRRRRRRRR
.RRxxxRRRRRRRRRRRKRRRY
.WWWWWWWWWWWWWWWWWWWWW
.RRVVVRRRRRRRRRRVVVRRx
...VxV..........VxV...
...VVV..........VVV...
@dump-truck | dump truck tipper construction
OOOOOOOOOOOOOO......
.OOFOOOOOOOOO.YYYYY.
.OOOOOOOOOOOO.YAAAY.
..OOOOOOOOOOO.YAAAAY
..OOOOOOOOOOO.YYYYYY
...DDDDDDDDDD.YYKYYY
VVVVVVVVVVVVVVVVVVVx
..VVV..VVV.....VVV..
..VxV..VxV.....VxV..
..VVV..VVV.....VVV..
@tractor | tractor farm green
....VVVVVVV.....
....VAAAAAV..V..
....VAAAAAV..V..
....VAAAAAV..V..
..GGGGGGGGGGGGGG
.VVVVVGGGGGGHGGG
VVxxxVVGGGGGGGGY
VxxYxxVGGGGVVVG.
VxYYYxVVVVVVxVV.
VxxYxxV...VxYxV.
VVxxxVV...VVxVV.
.VVVVV.....VVV..
@digger | digger excavator construction yellow
..........YYYY......
.........YY..YY.....
........YY....YY....
..YYYYYYY......YY...
..YAAAYY........YY..
..YAAAYY........YY..
..YAAAYYYY......VV..
.YYYYYYYYYY....VVVV.
.YYYYYYOYYY....V.VV.
VVVVVVVVVVVV........
VxVxVxVxVxVV........
.VVVVVVVVVV.........
@race-car | racing car formula one
VV..................
VVV......WW.........
BBB....BBWWBB.......
.BBBBBBBBBBBBBBBB...
VVVBBYYBBBBBBBVVVBBB
VxVVBBBBBBBBBVVxVV..
VVV...........VVV...
// two wheels and small wheels
@motorbike | motorbike motorcycle | a=red
........V.......
....VVVV.bbb..x.
...bbbbbbbbbbx..
..bbbbbbbbcbbxY.
.VVVbbxxxbbVVV..
VVxVV.xxx.VVxVV.
VxxxV.....VxxxV.
VVxVV.....VVxVV.
.VVV.......VVV..
@moped | moped scooter | a=teal
..........xx..
...........b..
..VVVVV...bb..
.bbbbbbb..bbY.
.bbbbbbbbbbb..
.bbcbbbbbbbb..
.VVVbbbbbVVV..
VVxVV...VVxVV.
VVxVV...VVxVV.
.VVV.....VVV..
@bicycle | bicycle bike | a=red
....VVV.....xx..
.....b......x...
....bbbbbbbbb...
...b..b....bb...
.VVb...b..b.bVV.
V.b.V...bb.V.b.V
V.bbVbbbbb.V..bV
V...V......V...V
.VVV........VVV.
@kick-scooter | kick scooter kids
.......VVV
........x.
........x.
........x.
........x.
........x.
.......xx.
BBBBBBBBx.
VV.....VV.
VV.....VV.
@pram | pram stroller baby buggy
..........xx
....BBBBB.x.
...BBBBBBx..
..BBUBBBBx..
..BUBBBBx...
AAAAAAAAA...
AAWAAAAAA...
.AAAAAAA....
..x....x....
.VVV..VVV...
.VVV..VVV...
@wheelchair | wheelchair
..V........
..V........
..VBBB.....
..VBBB.....
..VBBB.....
..VVVVVVV..
.VVVV...V..
VV..VV..V..
V.xx.V..VV.
VV..VV...xx
.VVVV......
@shopping-trolley | shopping trolley cart supermarket
R...........
RR..........
.xxxxxxxxxxx
.x.x.x.x.x.x
.xxxxxxxxxxx
.x.x.x.x.xx.
..xxxxxxxxx.
..x.........
..xxxxxxxx..
..VV....VV..
..VV....VV..
// rail, air and water
@steam-train | steam train locomotive engine
....www...............
...wwwww..............
....VV.........RRRRRR.
....VV....YY...RAAAAR.
....VV....YY...RAAAAR.
..VVVVVVVVVVVVVRRRRRR.
.VVVVVVVVVVVVVVRRRRRRR
.VVxVVVVVVVVVVVRRRRRRR
RRRRRRRRRRRRRRRRRRRRRR
RVVVVRRVVVVRRVVVVRRRR.
.VxxV..VxxV..VxxV.....
.VxxV..VxxV..VxxV.....
..VV....VV....VV......
@metro-train | train metro subway tram modern
..WWWWWWWWWWWWWWWWWW..
.WWWWWWWWWWWWWWWWWWWW.
WAAAWWAAAAWWAAAAWWAAAW
WAAAWWAAAAWWAAAAWWAAAW
WWWWWWAAAAWWAAAAWWWWWW
BBBBBBBBBBBBBBBBBBBBBB
WWWWWWWWWWWWWWWWWWWWWY
xxxxxxxxxxxxxxxxxxxxxx
..VVV..VVV....VVV.VVV.
..VVV..VVV....VVV.VVV.
@train-carriage | train carriage wagon passenger
.GGGGGGGGGGGGGGGGGG.
GGGGGGGGGGGGGGGGGGGG
GAAAGAAAGAAAGAAAGAAG
GAAAGAAAGAAAGAAAGAAG
GGGGGGGGGGGGGGGGGGGG
GYYYYYYYYYYYYYYYYYYG
GGGGGGGGGGGGGGGGGGGG
VVVVVVVVVVVVVVVVVVVV
..VVV..VVV..VVV.VVV.
..VVV..VVV..VVV.VVV.
@airplane | airplane plane airliner jet
.B....................
.BB...................
.BBB..................
.WBBB....WWWWWWWWW....
.WWWWWWWWWWWWWWWWWWW..
WWWAWAWAWAWAWAWAWWAAW.
WWWWWWWWWWWWWWWWWWWWWW
.wwwwwwwwWWWWWwwwwww..
.........BWWWB........
..........xBWWB.......
...........xxBB.......
@small-plane | small plane propeller red
..RRRRRRRRRRRRR...
........x.x.......
R.......x.x.....V.
RR....RRAARRR...V.
RRRRRRRRAARRRRRxV.
.RRRWRRRRRRRRRR.V.
....RRRRRRRRRRR.V.
........x.x.......
.......VV.VV......
@helicopter | helicopter chopper
..xxxxxxxxxxxxxxx.
.........x........
........RRRRR.....
x.....RRRAAAARR...
xx...RRRRAAAAARR..
.RRRRRRRRAAAAARR..
x....RRRRRRRRRRR..
......RRRRRRRRR...
.......V....V.....
.....VVVVVVVVVV...
@rocket | rocket spaceship launch
....WW....
...WWWW...
...WWWW...
..WWWWWW..
..WBBBBW..
..WBAABW..
..WBAABW..
..WBBBBW..
..WWWWWW..
..WWWWWW..
.RWWWWWWR.
RRWWWWWWRR
RR.VVVV.RR
R..OYYO..R
....OO....
....Y.....
@speedboat | speedboat motor boat
.........AAA........
........AAAAx.......
...xxxxxAAAAxx......
WWWWWWWWWWWWWWWWWW..
.WRRRRRRRRRRRRRRRRRR
..WWWWWWWWWWWWWWWW..
V..WWWWWWWWWWWWW....
@cruise-ship | cruise ship ocean liner
........RR...RR.......
........RR...RR.......
.......VVVV.VVVV......
.....WWWWWWWWWWWWW....
.....WAWAWAWAWAWAW....
...WWWWWWWWWWWWWWWWW..
...WAWAWAWAWAWAWAWAW..
WWWWWWWWWWWWWWWWWWWWWW
.WWKWWKWWKWWKWWKWWKWW.
..UUUUUUUUUUUUUUUUUU..
...UUUUUUUUUUUUUUUU...
@fishing-boat | fishing boat trawler tugboat
.....x..........
.....x..VV......
.....x..VV......
....WWWWWWW.....
....WAAWAAW.....
....WAAWAAW.....
....WWWWWWW...x.
BBBBBBBBBBBBBBB.
.BBWBBBBBBBBBB..
.BBBBBBBBBBBBB..
..RRRRRRRRRRR...
@submarine | submarine yellow
.........x........
.........xx.......
.......YYYY.......
.......YYYY.......
V..YYYYYYYYYYYYY..
VVYYYAAYYAAYYAAYY.
VVYYYAAYYAAYYAAYYY
V..YYYYYYYYYYYYYY.
....OOOOOOOOOOO...
@kayak | kayak canoe with paddle
..........TT....
.........T......
RR......T.....RR
.RRRRRRTVVRRRRR.
..RIIIIIIIIIRR..
...RRRRRRRRRR...
// in the street
#tlight
.VVVV.
VVXXVV
VXXXXV
VVXXVV
VVXXVV
VXXXXV
VVXXVV
VVXXVV
VXXXXV
VVXXVV
.VVVV.
..xx..
..xx..
..xx..
#tl-red x=2 y=1
RR
RR
#tl-amber x=2 y=4
YY
YY
#tl-green x=2 y=7
GG
GG
=traffic-light-red | traffic light red stop | tlight tl-red
=traffic-light-amber | traffic light amber yellow wait | tlight tl-amber
=traffic-light-green | traffic light green go | tlight tl-green
@stop-sign | stop sign road sign
..RRRRRR..
.RRRRRRRR.
RRRRRRRRRR
RWWWWWWWWR
RWWWWWWWWR
RRRRRRRRRR
.RRRRRRRR.
..RRRRRR..
....xx....
....xx....
....xx....
....xx....
@road-warning-sign | warning road sign triangle
.....RR.....
....RRRR....
....RYYR....
...RYKKYR...
...RYKKYR...
..RYYKKYYR..
..RYYYYYYR..
.RYYYKKYYYR.
.RRRRRRRRRR.
.....xx.....
.....xx.....
.....xx.....
@crossing-sign | pedestrian crossing sign blue
BBBBBBBBBB
BBBBWWBBBB
BBBBWWBBBB
BBBWWWWBBB
BBWBWWBWBB
BBBBWWBBBB
BBBWBBWBBB
BBWBBBBWBB
BBBBBBBBBB
....xx....
....xx....
....xx....
@speed-limit-sign | speed limit sign 30
..RRRRRR..
.RWWWWWWR.
RWKKWKKKWR
RWWKWKWKWR
RWKKWKWKWR
RWWKWKWKWR
RWKKWKKKWR
.RWWWWWWR.
..RRRRRR..
....xx....
....xx....
....xx....
@one-way-sign | one way arrow sign street sign
BBBBBBBBBBBB
BBBBBBWBBBBB
BWWWWWWWBBBB
BWWWWWWWWBBB
BWWWWWWWBBBB
BBBBBBWBBBBB
BBBBBBBBBBBB
.....xx.....
.....xx.....
.....xx.....
.....xx.....
@bus-stop | bus stop shelter
BBBBBBBBBBBBBB
.x..........x.
.xAAAAAAAAAAx.
.xAAAAAAAAAAx.
.xAAAAAAAAAAx.
.x..........x.
.x.TTTTTTTT.x.
.x.T......T.x.
.x..........x.
@park-bench | park bench green
V............V
VGGGGGGGGGGGGV
VNNNNNNNNNNNNV
VGGGGGGGGGGGGV
VVVVVVVVVVVVVV
GGGGGGGGGGGGGG
.V..........V.
.V..........V.
@post-box | post box red letter box
..RRRRRR..
.RRRRRRRR.
.RRRRRRRR.
.RVVVVVVR.
.RRRRRRRR.
.RRWWWWRR.
.RRWWWWRR.
.RRRRRRRR.
.RRRRRRRR.
.RRRRRRRR.
.ZZZZZZZZ.
VVVVVVVVVV
@mailbox | mailbox on post letters
........R.
.BBBBBB.R.
BBBBBBBBR.
BBWWBBBBB.
BBBBBBBBB.
BBBBBBBBB.
...TT.....
...TT.....
...TT.....
...TT.....
@fire-hydrant | fire hydrant
...RR...
..RRRR..
.RRRRRR.
..RIRR..
RRRIRRRR
RRRxxRRR
..RxxRR.
..RIRR..
..RIRR..
.RRRRRR.
.ZZZZZZ.
@parking-meter | parking meter
..xxxx..
.xVVVVx.
.xVGGVx.
.xVVVVx.
.xxRRxx.
..xxxx..
...xx...
...xx...
...xx...
...xx...
...xx...
..XXXX..
@phone-box | phone box telephone booth red
.RRRRRRRR.
RRRWWWWRRR
RRRRRRRRRR
RAARAARAAR
RAARAARAAR
RRRRRRRRRR
RAARAARAAR
RAARAARAAR
RRRRRRRRRR
RAARAARAAR
RAARAARAAR
RRRRRRRRRR
RRRRRRRRRR
@litter-bin | litter bin street trash can green
.NNNNNNNN.
NNNNNNNNNN
.GVVVVVVG.
.GGGGGGGG.
.GGHWWGGG.
.GGWHWGGG.
.GGWWHGGG.
.GGGGGGGG.
.NNNNNNNN.
@traffic-cone | traffic cone orange
....OO....
....OO....
...OOOO...
...WWWW...
..OOOOOO..
..OOOOOO..
.WWWWWWWW.
.OOOOOOOO.
DDDDDDDDDD
@road-barrier | road barrier roadworks
Y............Y
RRWWRRWWRRWWRR
RWWRRWWRRWWRRW
.x..........x.
.x..........x.
.x..........x.
xxx........xxx
@billboard | billboard advert sign
VVVVVVVVVVVVVV
VYYYYYYYYYYYYV
VYYRRYYYYOOYYV
VYRRRRYYOOOOYV
VYYRRYYYYOOYYV
VYYYYYYYYYYYYV
VVVVVVVVVVVVVV
...x......x...
...x......x...
...x......x...
@atm | atm cash machine
xxxxxxxxxx
xBBBBBBBBx
xBAAAAAABx
xBAGGAAABx
xBAAAAAABx
xBBBBBBBBx
xVVVVxwwwx
xVGGVxwKwx
xxxxxxwwwx
xXXXXXXXXx
xXXXXXXXXx
xxxxxxxxxx
@news-kiosk | newsstand kiosk
.GGGGGGGGGGGG.
GGGGGGGGGGGGGG
.GWGWGWGWGWGW.
.NVVVVVVVVVVN.
.NVVVSSVVVVVN.
.NVVRRRRVVVVN.
.NNNNNNNNNNNN.
.NWRWBWYWRWBN.
.NWRWBWYWRWBN.
.NNNNNNNNNNNN.
.NNNNNNNNNNNN.
@hot-dog-cart | hot dog cart food stand
..RWRWRWRWRW..
.RWRWRWRWRWRW.
......x.......
......x.......
......x.......
.WWWWWWWWWWW..
.WWWIIIIWWWWxx
.WWLLLLLLWWW..
.WWWWWWWWWWW..
..VVV...VVV...
..VVV...VVV...
@petrol-pump | petrol pump gas station fuel
.RRRRRRR...
.RWWWWWR.V.
.RWKKKWR.VV
.RWWWWWR..V
.RRRRRRR..V
.RRRYRRR..V
.RRRRRRRVVV
.RRRRRRR...
.RRRRRRR...
.RRRRRRR...
VVVVVVVVV..
`);

// modern buildings, 32x32: one routine for ordinary blocks and shops, a few special ones
function bld(c, o) {
  const w = o.w || 24, h = o.h || 16, x = 16 - (w >> 1), y = 31 - h, [d, m, l] = ramp(o.wall || 'cream');
  c.rect(x, y, w, h, m).rect(x + w - 2, y, 2, h, d).rect(x, y, 1, h, l);
  if (o.brick) for (let j = y + 2; j < 30; j += 3) for (let i = x + 2 + ((j / 3) & 1) * 3; i < x + w - 4; i += 6) c.h(i, j, 2, d);
  if (o.pitch) roof(c, 16, y - o.pitch, o.pitch, o.top || 4, Math.min(w + 4, 30), o.roof || 'red');
  else { const [rd, rm] = ramp(o.roof || 'dark'); c.rect(x - 1, y - 2, w + 2, 2, rm).h(x - 1, y - 1, w + 2, rd); }
  const cols = o.cols || 3;
  const pane = (wx, wy, k) => c.rect(wx, wy, 3, 3, o.lit && k % 3 === 1 ? 'y2' : 'b3').px(wx, wy, 'w0').h(wx, wy + 3, 3, d);
  for (let f = 0; f < (o.floors || 0); f++) for (let k = 0; k < cols; k++) pane(x + Math.round((k + 0.5) * w / cols) - 2, 18 - 5 * f, k + f * 2);
  if (o.shop) for (const gx of [x + 2, x + w - 8]) c.rect(gx, 24, 6, 5, 'g4').rect(gx + 1, 25, 4, 3, 'b3').px(gx + 1, 25, 'w0').px(gx + 2, 26, 'w0');
  else if (!o.plain) { pane(x + 3, 25, 0); pane(x + w - 6, 25, 0); }
  if (o.door === 'glass') c.rect(13, 24, 6, 7, 'g4').rect(14, 25, 2, 6, 'b3').rect(16, 25, 2, 6, 'b2').px(14, 25, 'w0');
  else if (o.door === 'shutter') for (const gx of [x + 3, x + w - 11]) { c.rect(gx, 21, 8, 10, 'g4').rect(gx + 1, 22, 6, 9, o.shutter || 'g1'); for (let j = 24; j < 31; j += 2) c.h(gx + 1, j, 6, 'g2'); }
  else if (o.door !== 'none') door(c, 14, 24, 4, 7);
  if (o.awning) { const am = ramp(o.awning)[1]; for (let i = -1; i <= w; i++) { const col = (i >> 1) & 1 ? 'w0' : am; c.v(x + i, 21, 2, col); if (i & 1) c.px(x + i, 23, col); } }
  if (o.sign) {
    const sw = Math.max(...o.sign.map((r) => r.length)), sx = 16 - (sw >> 1), sy = o.signy || y + 2;
    if (o.board !== '') c.rect(sx - 1, sy - 1, sw + 2, o.sign.length + 2, o.board || 'w0');
    c.stamp(sx, sy, o.sign);
  }
  if (o.extra) o.extra(c, x, y, w, h);
}
function glassTower(c, o) {
  const w = o.w, x = 16 - (w >> 1), y = o.top, [d, m, l] = ramp(o.glass || 'blue');
  c.rect(x, y, w, 31 - y, m);
  for (let j = y; j < 31; j++) for (let i = x; i < x + w; i++) {
    if ((j - y) % 3 === 2) c.px(i, j, d);
    else if ((i - x) % 3 === 2) c.px(i, j, d);
    else if (((i - x) / 3 | 0) * 5 % 7 === ((j - y) / 3 | 0) % 7) c.px(i, j, l);
  }
  c.rect(x + w - 2, y, 2, 31 - y, d).v(x, y, 31 - y, l).rect(x - 1, y - 1, w + 2, 1, 'g2');
  if (o.step) c.rect(x + 3, y - 4, w - 6, 3, m).h(x + 3, y - 2, w - 6, d).rect(x + 2, y - 5, w - 4, 1, 'g2');
  if (o.spire) c.v(16, y - (o.step ? 10 : 6), o.step ? 5 : 5, 'g2').px(16, y - (o.step ? 11 : 7), 'r2');
  c.rect(13, 27, 6, 4, 'g4').rect(14, 28, 2, 3, 'b3').rect(16, 28, 2, 3, 'b3');
}
function factory(c) {
  wall(c, 2, 17, 28, 14, 'grey');
  for (let t = 0; t < 3; t++) for (let j = 0; j < 5; j++) { c.h(2 + t * 7, 16 - j, 7 - j, 'g3').px(2 + t * 7, 16 - j, 'b3'); }
  for (const cx of [24, 28]) { c.rect(cx - 1, 7, 3, 10, 'r2').v(cx + 1, 7, 10, 'r1').h(cx - 1, 7, 3, 'g1').h(cx - 1, 10, 3, 'w0'); }
  c.disc(24, 4, 1.5, 'g1').disc(27, 3, 1.2, 'g1').px(22, 3, 'w0');
  c.rect(4, 23, 8, 8, 'g4').rect(5, 24, 6, 7, 'g2'); for (let j = 25; j < 31; j += 2) c.h(5, j, 6, 'g3');
  for (const wx of [15, 20, 25]) c.rect(wx, 21, 3, 3, 'y2').px(wx, 21, 'y3');
  door(c, 20, 26, 3, 5);
}
function stadium(c) {
  for (let y = 9; y < 31; y++) for (let x = 0; x < 32; x++) {
    const dx = (x - 15.5) / 14.5, dy = (y - 20) / 10, r = dx * dx + dy * dy;
    if (r > 1) continue;
    const ix = (x - 15.5) / 10, iy = (y - 19) / 5.5, ri = ix * ix + iy * iy;
    if (ri <= 1) c.px(x, y, (x >> 2) & 1 ? 'n2' : 'n3');
    else if (y > 22 && r > 0.55) c.px(x, y, y > 27 ? 'g3' : 'g2');
    else c.px(x, y, ['r2', 'b2', 'y2', 'w0', 'r2', 'b3'][(x * 7 + y * 13) % 6]);
  }
  c.v(15, 14, 11, 'w0').disc(15.5, 19, 1.6, 'w0').disc(15.5, 19, 0.8, 'n2');
  for (const fx of [3, 28]) c.v(fx, 3, 8, 'g3').rect(fx - 1, 2, 3, 2, 'y3').px(fx, 2, 'w0');
  c.rect(13, 28, 5, 3, 'g4');
}
function petrolStation(c) {
  c.rect(1, 9, 22, 3, 'r2').h(1, 10, 22, 'w0').h(1, 12, 22, 'r1');
  c.rect(3, 13, 2, 18, 'g1').rect(19, 13, 2, 18, 'g1').v(4, 13, 18, 'g2').v(20, 13, 18, 'g2');
  for (const px of [8, 13]) c.rect(px, 22, 4, 9, 'r2').rect(px + 1, 23, 2, 2, 'w0').h(px, 30, 4, 'g4').px(px + 3, 26, 'g4');
  wall(c, 23, 17, 8, 14, 'white'); c.rect(22, 15, 9, 2, 'g3'); c.rect(25, 20, 4, 3, 'b3').px(25, 20, 'w0'); door(c, 25, 25, 4, 6);
  c.rect(24, 12, 6, 3, 'y2').px(26, 13, 'r2').px(27, 13, 'r2');
}
function controlTower(c) {
  for (let y = 12; y < 31; y++) { const w = 6 + ((y - 12) >> 3) * 2, x = 16 - (w >> 1); c.h(x, y, w, 'g1').px(x, y, 'w0').rect(x + w - 2, y, 2, 1, 'g2'); }
  c.rect(8, 5, 16, 7, 'g2').rect(9, 6, 14, 4, 'b3').h(8, 11, 16, 'g3');
  for (const x of [12, 16, 20]) c.v(x, 6, 4, 'g2'); c.px(10, 6, 'w0').px(14, 7, 'w0');
  c.rect(10, 3, 12, 2, 'g3').v(16, 1, 2, 'g3').px(16, 1, 'r2');
  for (let y = 15; y < 28; y += 4) c.rect(15, y, 2, 2, 'b2');
  c.rect(14, 28, 4, 3, 'g4');
}
function greenhouse(c) {
  for (let j = 0; j < 7; j++) { const w = 8 + j * 3, x = 16 - (w >> 1); c.h(x, 9 + j, w, 'b3').px(x, 9 + j, 'w0').px(x + w - 1, 9 + j, 'w0'); }
  c.rect(3, 16, 26, 15, 'b3');
  for (let x = 3; x < 29; x += 5) c.v(x, 16, 15, 'w0');
  c.v(28, 16, 15, 'w0').h(3, 16, 26, 'w0').h(3, 23, 26, 'w0').h(3, 30, 26, 'g1').v(16, 9, 7, 'w0');
  for (const [x, y] of [[5, 27], [10, 26], [20, 27], [25, 26], [6, 20], [24, 20]]) c.rect(x, y, 2, 3, 'n2').px(x, y - 1, 'n3').px(x + 1, y - 1, x % 2 ? 'r2' : 'y2');
  c.rect(14, 24, 4, 7, 'b2').v(16, 24, 7, 'w0');
}
const SIGNS = {
  cup: ['x.x..', 'TTTT.', 'TTTTT', 'TTTT.'], bread: ['.LLLL.', 'LTLTLL', '.LLLL.'], toys: ['RR.BB', 'RR.BB', '.YY..', '.YY..'],
  books: ['RRR.BBB', 'RWR.BWB', 'RRR.BBB'], flowers: ['R.M.Y', 'G.G.G'], pizza: ['YYYYY', '.YRY.', '..Y..'],
  cart: ['W......', '.WWWWW.', '.WWWW..', '..W.W..'], post: ['WWWWWWW', 'WxWWWxW', 'WWxxxWW', 'WWWWWWW'],
  pharmacy: ['.GG.', 'GGGG', 'GGGG', '.GG.'], cross: ['.RR.', 'RRRR', 'RRRR', '.RR.'], star: ['..Y..', 'YYYYY', '.YYY.', 'Y...Y'],
  dollar: ['.YYY.', 'YY...', '.YYY.', '...YY', '.YYY.'], h: ['W..W', 'WWWW', 'W..W'], wrench: ['x.x...', 'xxxxxx', '....x.'],
};
const clockFace = (c, x, y) => c.rect(x, y, 4, 4, 'w0').px(x + 1, y + 1, 'k').px(x + 2, y + 1, 'k').px(x + 1, y + 2, 'k');
const B = (slug, name, fn, key) => ND(slug, name, fn, BUILD, key || fn);
B('modern-house', 'modern house flat roof', (c) => bld(c, { w: 24, h: 15, wall: 'white', roof: 'dark', floors: 0, extra: (c, x, y) => { c.rect(x + 2, y + 2, 9, 5, 'g4').rect(x + 3, y + 3, 7, 3, 'b3').px(x + 3, y + 3, 'w0').px(x + 4, y + 4, 'w0').rect(x + 14, y + 1, 10, 3, 't2').h(x + 14, y + 3, 10, 't1'); } }));
B('town-house', 'town house terraced brick house', (c) => bld(c, { w: 16, h: 21, wall: 'copper', brick: true, pitch: 7, top: 4, roof: 'dark', floors: 2, cols: 2, lit: true, extra: (c, x, y) => c.rect(x + 11, y - 8, 3, 5, 'r1').h(x + 10, y - 9, 5, 'g3') }));
B('apartment-block', 'apartment block flats tower block', (c) => bld(c, { w: 22, h: 25, wall: 'tan', floors: 3, cols: 4, lit: true, door: 'glass', extra: (c, x, y) => { for (let f = 0; f < 3; f++) c.h(x + 1, 12 + f * 5, 20, 't2'); c.rect(20, y - 5, 3, 3, 'g2'); } }));
B('school', 'school building clock', (c) => bld(c, { w: 28, h: 14, wall: 'red', brick: true, roof: 'dark', cols: 4, floors: 1, extra: (c) => { wall(c, 12, 9, 8, 8, 'red'); roof(c, 16, 5, 4, 2, 10, 'dark'); clockFace(c, 14, 11); c.v(16, 1, 4, 'g3').rect(17, 1, 3, 2, 'y2'); door(c, 14, 24, 4, 7); } }));
B('hospital', 'hospital red cross', (c) => bld(c, { w: 26, h: 23, wall: 'white', roof: 'blue', floors: 2, cols: 4, door: 'glass', sign: SIGNS.cross, signy: 10, extra: (c) => c.rect(10, 21, 12, 2, 'b2').h(10, 22, 12, 'b1') }));
B('police-station', 'police station', (c) => bld(c, { w: 24, h: 17, wall: 'ice', roof: 'navy', floors: 1, cols: 2, sign: SIGNS.star, board: 'b1', signy: 16, extra: (c) => { c.rect(15, 10, 2, 2, 'b2').px(15, 10, 'b3').rect(11, 22, 10, 1, 'b1'); } }));
B('fire-station', 'fire station', (c) => bld(c, { w: 26, h: 18, wall: 'red', brick: true, roof: 'dark', door: 'shutter', shutter: 'w0', plain: true, extra: (c, x, y) => { c.rect(11, y + 2, 10, 4, 'w0').stamp(13, y + 3, ['R.O.R', 'OYOYO']); wall(c, 24, 4, 5, 9, 'red'); c.rect(23, 3, 7, 1, 'g3').rect(25, 6, 2, 2, 'y2'); } }));
B('supermarket', 'supermarket grocery store shop', (c) => bld(c, { w: 28, h: 15, wall: 'white', roof: 'green', shop: true, door: 'glass', awning: 'green', sign: SIGNS.cart, board: 'r2' }));
B('cafe', 'cafe coffee shop', (c) => bld(c, { w: 20, h: 21, wall: 'cream', brick: true, roof: 'brown', floors: 1, cols: 2, shop: true, awning: 'red', sign: SIGNS.cup, board: 'y3', signy: 12, extra: (c) => { c.rect(3, 28, 3, 1, 'w0').v(4, 29, 2, 'g3').rect(26, 28, 3, 1, 'w0').v(27, 29, 2, 'g3'); } }));
B('bakery', 'bakery bread shop', (c) => bld(c, { w: 20, h: 16, wall: 'tan', pitch: 5, top: 12, roof: 'brown', shop: true, awning: 'orange', sign: SIGNS.bread, board: 'y3' }));
B('toy-shop', 'toy shop store', (c) => bld(c, { w: 20, h: 16, wall: 'rose', roof: 'purple', shop: true, awning: 'blue', sign: SIGNS.toys, board: 'w0', extra: (c) => c.px(8, 26, 'r2').px(9, 27, 'y2').px(22, 26, 'n2').px(23, 27, 'r2') }));
B('book-shop', 'book shop library', (c) => bld(c, { w: 20, h: 21, wall: 'teal', roof: 'dark', floors: 1, cols: 3, shop: true, sign: SIGNS.books, board: 'y3', signy: 12, extra: (c) => c.rect(8, 27, 4, 1, 'r2').rect(21, 27, 4, 1, 'o2') }));
B('flower-shop', 'flower shop florist', (c) => bld(c, { w: 20, h: 16, wall: 'lime', roof: 'forest', shop: true, awning: 'pink', sign: SIGNS.flowers, board: 'w0', extra: (c) => { for (const [x, col] of [[3, 'r2'], [5, 'y2'], [26, 'm2'], [28, 'r3']]) c.px(x, 28, col).v(x, 29, 2, 'n1'); } }));
B('pizzeria', 'pizzeria pizza restaurant', (c) => bld(c, { w: 22, h: 16, wall: 'cream', roof: 'red', shop: true, awning: 'green', sign: SIGNS.pizza, board: 'r1' }));
B('post-office', 'post office mail', (c) => bld(c, { w: 22, h: 16, wall: 'yellow', brick: true, roof: 'blue', shop: true, sign: SIGNS.post, board: 'b1', extra: (c) => c.rect(2, 26, 3, 5, 'r2').h(2, 27, 3, 'g4') }));
B('pharmacy', 'pharmacy chemist drugstore', (c) => bld(c, { w: 20, h: 16, wall: 'white', roof: 'teal', shop: true, door: 'glass', sign: SIGNS.pharmacy, board: 'w0', extra: (c, x, y) => c.rect(x, 21, 20, 1, 'n2') }));
B('bank', 'bank building columns', (c) => bld(c, { w: 24, h: 17, wall: 'steel', pitch: 6, top: 2, roof: 'grey', plain: true, sign: SIGNS.dollar, board: '', signy: 9, extra: (c, x, y) => { for (const cx of [x + 2, x + 6, x + 15, x + 19]) c.rect(cx, y + 2, 3, 15, 'w0').v(cx + 2, y + 2, 15, 'g2'); c.rect(x - 1, y, 26, 2, 'g1').rect(x - 1, 30, 26, 1, 'g2'); door(c, 14, 23, 4, 8); } }));
B('hotel', 'hotel tall building', (c) => bld(c, { w: 18, h: 24, wall: 'maroon', floors: 3, cols: 3, lit: true, door: 'glass', sign: SIGNS.h, board: 'b1', signy: 2, extra: (c) => c.rect(11, 22, 10, 2, 'y2').h(11, 23, 10, 'o2') }));
B('cinema', 'cinema movie theatre', (c) => bld(c, { w: 24, h: 21, wall: 'purple', roof: 'violet', plain: true, door: 'glass', extra: (c, x, y) => { c.rect(x + 2, y + 2, 20, 7, 'w0').rect(x + 3, y + 3, 18, 5, 'g4'); for (let i = 0; i < 18; i += 2) c.px(x + 3 + i, y + 3, 'y2').px(x + 4 + i, y + 7, 'y2'); c.stamp(x + 7, y + 4, ['R.RR.R.RR', 'RR.R.RR.R']); c.rect(x + 2, 22, 20, 1, 'y2').rect(x + 2, 24, 4, 6, 'r2').rect(x + 18, 24, 4, 6, 'b2').px(x + 3, 26, 'y2').px(x + 19, 26, 'w0'); } }));
B('warehouse', 'warehouse storage depot', (c) => bld(c, { w: 28, h: 15, wall: 'grey', pitch: 4, top: 20, roof: 'dark', door: 'shutter', shutter: 'b2', plain: true }));
B('car-garage', 'garage car repair workshop', (c) => bld(c, { w: 24, h: 16, wall: 'cream', roof: 'orange', door: 'shutter', plain: true, sign: SIGNS.wrench, board: 'g4', signy: 17 }));
B('train-station', 'train station railway', (c) => bld(c, { w: 28, h: 13, wall: 'tan', brick: true, pitch: 4, top: 22, roof: 'teal', cols: 4, extra: (c) => { wall(c, 13, 7, 6, 8, 'tan'); roof(c, 16, 3, 4, 2, 8, 'teal'); clockFace(c, 14, 9); c.rect(12, 23, 8, 8, 'g4').rect(13, 24, 6, 7, 't2').h(13, 23, 6, 'g4').v(16, 24, 7, 't1'); } }));
B('skyscraper', 'skyscraper tall glass tower', (c) => glassTower(c, { w: 12, top: 12, step: true, spire: true }), 'tower-a');
B('office-block', 'office block building glass', (c) => glassTower(c, { w: 20, top: 9, glass: 'teal' }), 'tower-b');
B('factory', 'factory chimneys smoke', factory);
B('stadium', 'stadium sports arena football', stadium);
B('petrol-station', 'petrol station gas station garage', petrolStation);
B('control-tower', 'airport control tower', controlTower);
B('greenhouse', 'greenhouse glass house plants', greenhouse);

// ───────────────────────── school, office and tech ─────────────────────────
category('tech', 'School, office & tech', 'thing');
pack(`
// school and desk
@open-book | open book reading
.WWWWW.WWWWW.
WWxxxWTWxxxWW
WWWWWWTWWWWWW
WWxxxWTWxxxWW
WWWWWWTWWWWWW
WWxxxWTWxxWWW
BWWWWWTWWWWWB
BBBBBBBBBBBBB
@notebook | notebook spiral exercise book
xGGGGGGGG
GGGGGGGGG
xGWWWWWGG
GGWxxxWGG
xGWWWWWGG
GGGGGGGGG
xGGGGGGGG
GGGGGGGGG
xGGGGGGGG
NNNNNNNNN
@book-stack | stack of books pile
..RRRRRRRRR.
..RWWWWWWWZ.
.BBBBBBBBBB.
.BYBBBBBBBU.
.WWWWWWWWWU.
GGGGGGGGGGG.
GWWWWWWWWWN.
GGGGGGGGGGN.
@pencil | pencil yellow
.........MM
........MMM
.......xxM.
......YYx..
.....YYO...
....YYO....
...YYO.....
..YYO......
.LYO.......
.LL........
K..........
@pen | pen ballpoint blue
.........BB
........BBU
.......BBU.
......BBU..
.....BBU...
....BBU....
...WWU.....
..WW.......
.xx........
x..........
@crayons | crayons box colours
.R.Y.G.B.P.
.R.Y.G.B.P.
.R.Y.G.B.P.
YYYYYYYYYYY
YOOYYYYYOOY
YYYGGGYYYYY
YYYYYYYYYYY
OOOOOOOOOOO
@eraser | eraser rubber pink
...MMMMMM.
..MMMMMMz.
.BBBBBBzz.
BBBBBBBzz.
BBWBBBBz..
BBBBBBB...
@ruler | ruler measure
YYYYYYYYYYYYYY
YKYKYKYKYKYKYY
YKYYYKYYYKYYYY
YYYYYYYYYYYYYY
OOOOOOOOOOOOOO
@scissors | scissors
.w.....w..
.ww...ww..
..ww.ww...
...wVw....
...www....
..RR.RR...
.R.R.R.R..
.R.R.R.R..
..R...R...
@glue-stick | glue stick
..WWWW..
..WWWW..
.RRRRRR.
.RRRRRR.
.YYYYYY.
.YWWWWY.
.YYYYYY.
.YYYYYY.
.RRRRRR.
@pencil-case | pencil case
.PPPPPPPPPPPP.
PPJPPPPPPPPPPP
PxxxxxxxxxxxYP
PPPPPPPPPPPPPP
PPPPPPPPPPPPPP
.QQQQQQQQQQQQ.
@school-bag | school bag backpack rucksack red | a=red
...VVVV...
..V....V..
.bbbbbbbb.
bbcbbbbbbb
bbbbbbbbbb
baaaaaaaab
bbYYYYYYbb
bbYbbbbYbb
bbbbbbbbbb
.aaaaaaaa.
@globe | globe world map earth
...BBBB....
..BGGBBB.x.
.BGGGBBGB.x
.BBGGBGGB.x
.BBBGBBGB.x
.BBBGBBBB.x
..BBBBBB.x.
...BBBBxx..
....TT.....
..TTTTTT...
@blackboard | blackboard chalkboard school
TTTTTTTTTTTTTT
TNNNNNNNNNNNNT
TNWNWNNNNWWNNT
TNWWWNWNNNWNNT
TNWNWNNNNWWNNT
TNNNNNNNNNNNNT
TNWWWWWNNNNNNT
TNNNNNNNNNNNNT
TTTTTTTTTWWTTT
.T..........T.
.T..........T.
@school-desk | school desk with chair
........TTTTTT
........TLLLLL
...T....T....T
...T....T....T
...TTTT.T....T
...T..T.T....T
...T..T.T....T
@calculator | calculator
VVVVVVVV
VHHHHHHV
VHHHHKHV
VVVVVVVV
VwVwVwVR
VVVVVVVV
VwVwVwVR
VVVVVVVV
VwVwVwVO
VVVVVVVV
@paperclip | paperclip
..xxxx..
.x....x.
.x.xx.x.
.x.x.xx.
.x.x..x.
.x.x..x.
.x.x..x.
.x.x..x.
...x..x.
...x..x.
....xx..
@stapler | stapler
.RRRRRRRRRR.
RRRRRRRRRRRR
RIRRRRRRRRR.
.xxxxxxxxx..
.V..........
VVVVVVVVVVVV
@sticky-note | sticky note post-it yellow
YYYYYYYYY
YYYYYYYYY
YKKKKKYYY
YYYYYYYYY
YKKKKYYYY
YYYYYYYYY
YYYYYYOOO
YYYYYYOO.
YYYYYYO..
@folder | folder files documents
.FFFFF......
FFFFFFF.....
OOOOOOOOOOOO
OFFFFFFFFFFO
OFFFFFFFFFFO
OFFFFFFFFFFO
OFFFFFFFFFFO
OOOOOOOOOOOO
@clipboard | clipboard checklist
...xxxx...
.TTxxxxTT.
.TWWWWWWT.
.TWGWxxWT.
.TWWWWWWT.
.TWGWxxWT.
.TWWWWWWT.
.TWRWxxWT.
.TWWWWWWT.
.TTTTTTTT.
@newspaper | newspaper news
WWWWWWWWWWWW
WKKKKWKKKKKW
WWWWWWWWWWWW
WxxxxWxxWxxW
WxxxxWWWWWWW
WxxxxWxxWxxW
WWWWWWxxWxxW
WxxWxxWWWWWW
wwwwwwwwwwww
@certificate | certificate diploma award
YYYYYYYYYYYY
YWWWWWWWWWWY
YWWKKKKKKWWY
YWWWWWWWWWWY
YWxxxxxxxxWY
YWWWWWWWRRWY
YWxxxxWRRRRY
YWWWWWWWRRWY
YYYYYYYR..RY
@test-paper | test paper exam homework top marks
WWWWWWWWW
WWRRWWWWW
WRWWRWRWW
WRRRRRRRW
WRWWRWRWW
WWWWWWWWW
WxxxxxxWW
WWWWWWWWW
WxxxxWWWW
wwwwwwwww
// screens and gadgets
@laptop | laptop computer
.VVVVVVVVVV.
.VAAAAAAAAV.
.VAWAAAAAAV.
.VAAAAAAAAV.
.VAAAAAAAAV.
.VVVVVVVVVV.
xxxxxxxxxxxx
xwxwxwxwxwxx
XXXXXXXXXXXX
@desktop-computer | desktop computer pc monitor
VVVVVVVVVVVV
VAAAAAAAAAAV
VAWAAAAAAAAV
VAAAAGGAAAAV
VAAAAAAAAAAV
VVVVVVVVVVVV
....xxxx....
...xxxxxx...
wwwwwwwwwwww
wxwxwxwxwxww
@keyboard | keyboard computer
wwwwwwwwwwwwww
wVwVwVwVwVwVww
wwVwVwVwVwVwVw
wVwVVVVVVwVwVw
xxxxxxxxxxxxxx
@computer-mouse | computer mouse
....V...
....V...
..wwVww.
.wwwVwww
.wwxxxww
.wwwwwww
.wwwwwww
.wwwwwww
..wwwww.
@smartphone | phone smartphone mobile
VVVVVVV
VAAAAAV
VARABAV
VAAAAAV
VAGAYAV
VAAAAAV
VAPAOAV
VAAAAAV
VVVxVVV
VVVVVVV
@telephone | telephone old phone landline red
.RRRRRRRRRR.
RRRRRRRRRRRR
RR.RRRRRR.RR
...RRRRRR...
..RRWWWWRR..
.RRRWKKWRRR.
.RRRWWWWRRR.
.RRRRRRRRRR.
.ZZZZZZZZZZ.
@tablet | tablet computer touchscreen
VVVVVVVVVVVV
VAAAAAAAAAAV
VARRAGGAYYAV
VARRAGGAYYAV
VAAAAAAAAAAV
VABBAPPAOOAV
VABBAPPAOOAV
VAAAAAAAAAAV
VVVVVVVVVVVV
@camera | camera photo
..VVV.......
.VVVVVVVVRV.
VVVVxxxxVVVV
VwVxAAAAxVVV
VVVxAWAAxVVV
VVVxAAAAxVVV
VVVVxxxxVVVV
.VVVVVVVVVV.
@video-camera | video camera film movie camera
..VVV.VVV...
.VxxxVxxxV..
..VVV.VVV...
VVVVVVVVVV.x
VVRVVVVVVVxx
VVVVVVVVVVxx
VVVVVVVVVV.x
...V..V.....
..V....V....
@tv | tv television flat screen
VVVVVVVVVVVVVV
VAAAAAAAAAAAAV
VAAAEAAAAAAAAV
VAAAAAAAGGAAAV
VGGAAAAGGGGAAV
VGGGGGGGGGGGGV
VVVVVVVVVVVVVV
......VV......
....VVVVVV....
@retro-tv | old tv retro television antenna
..x......x..
...x....x...
....x..x....
TTTTTTTTTTTT
TVVVVVVVVTYT
TVAAAAAAVTTT
TVAWAAAAVTYT
TVAAAAAAVTTT
TVVVVVVVVTxT
TTTTTTTTTTTT
.C........C.
@radio | radio music
.........x..
........x...
.......x....
RRRRRRRRRRRR
RVVVVVRWWWWR
RVxVxVRWRWWR
RVVVVVRRRRRR
RVxVxVRYRRYR
ZZZZZZZZZZZZ
@headphones | headphones music
...VVVVVV...
..VV....VV..
.VV......VV.
.V........V.
.V........V.
RRV......VRR
RRV......VRR
RRV......VRR
RR........RR
@speaker | speaker loudspeaker music
VVVVVVVV
VVVxxVVV
VVVxxVVV
VVVVVVVV
VVxxxxVV
VxxVVxxV
VxVwwVxV
VxxVVxxV
VVxxxxVV
VVVVVVVV
@game-console | game console video games
WWWWWWWWWWWW
WVVVVVVVWBWW
wwwwwwwwwwww
.....V......
.VVVVVVVVVV.
VVKVVVVVRVBV
VKKKVVVVVYVV
VVKVV..VVVVV
.VVV....VVV.
@gamepad | gamepad game controller
.xxxx....xxxx.
xxxxxxxxxxxxxx
xxVxxxxxxxxBxx
xVVVxxwwxxRxYx
xxVxxxxxxxxGxx
xxxxx....xxxxx
xxxx......xxxx
.xx........xx.
@handheld-game | handheld game console
RRRRRRRRRRRRRR
RVRAAAAAAAARYR
VVVAAGAAAAARRB
RVRAAAAAWAARYR
RRRAAAAAAAARRR
RRRRRRRRRRRRRR
@printer | printer office
...WWWWWW...
...WxxxxW...
...WWWWWW...
wwwwwwwwwwww
wwwwwwwwwGww
wVVVVVVVVVVw
wwWWWWWWWWww
..WxxxxxxW..
..WWWWWWWW..
@usb-stick | usb stick memory flash drive
..xxxx..
..xVVx..
..xxxx..
.BBBBBB.
.BBBBBB.
.BAABBB.
.BBBBBB.
.BBBBBB.
.BBBBBB.
..UUUU..
@battery | battery power
...xx...
.YYYYYY.
.YYYYYY.
.VVVVVV.
.VVGVVV.
.VGGGVV.
.VVGVVV.
.VVVVVV.
.VVVVVV.
.VVVVVV.
@satellite-dish | satellite dish antenna
.....wwww...
...wwWWWWw..
..wWWWWWWw..
.wWWWWWWw..R
.wWWWWWxxxx.
.wWWWWWw....
..wWWWw.....
...www......
....xx......
....xx......
..xxxxxx....
@drone | drone quadcopter flying camera
xxxxx....xxxxx
..V........V..
..VVVVVVVVVV..
....VVRVVV....
....VVVVVV....
.....VAAV.....
...V......V...
@remote-control | remote control tv
.VVVVV.
.VRVVV.
.VVVVV.
.VwVwV.
.VVVVV.
.VwVwV.
.VVVVV.
.VwVwV.
.VVVVV.
.VVVVV.
.VVVVV.
@vr-headset | vr headset virtual reality goggles
..VVVVVVVVVV..
VVWWWWWWWWWWVV
V.WWWWWWWWWW.V
V.WBBBBBBBBW.V
..WWWWWWWWWW..
...WWW..WWW...
@security-camera | security camera cctv
x...........
xx..........
xxxWWWWWWWW.
xx.WWWWWWWVV
x..WWWWWWWVA
...WWRWWWWVV
....wwwwww..
@robot-vacuum | robot vacuum cleaner
...VVVVVV...
.VVVVVVVVVV.
VVVVxxxxVVVV
VVVxGGxxxVVV
VVVVxxxxVVVV
.VVVVVVVVVV.
..xx....xx..
// time, post, money and cards
@wall-clock | wall clock time round
...BBBB...
.BBWWWWBB.
.BWWWKWWB.
BWWWWKWWWB
BWWWWKKKWB
BWWWWWWWWB
BWWWWWWWWB
.BWWWWWWB.
.BBWWWWBB.
...BBBB...
@alarm-clock | alarm clock ringing wake up
.RR....RR.
RRR.xx.RRR
.RRRRRRRR.
.RWWWKWWR.
RWWWWKWWWR
RWWWWKKWWR
RWWWWWWWWR
.RWWWWWWR.
.RRRRRRRR.
.V......V.
@calendar | calendar date
.x..x..x..
RRRRRRRRRR
RRRRRRRRRR
WWWWWWWWWW
WxWxWxWxWW
WWWWWWWWWW
WxWRWxWxWW
WWWWWWWWWW
WxWxWxWWWW
wwwwwwwwww
@postcard | postcard holiday
WWWWWWWWWWWW
WAAAAAAWWRRW
WAAEAAAWWRRW
WAAAAAAWWWWW
WGGAAGGWxxxW
WYYYYYYWxxxW
WWWWWWWWWWWW
@parcel | parcel package delivery box
LLLLLRRLLLLL
LLLLLRRLLLLL
LLLLLRRLLLLL
RRRRRRRRRRRR
LLLLLRRLLLLL
LWWWLRRLLLLL
LWxWLRRLLLLL
TTTTTZZTTTTT
@stamp | postage stamp
W.W.W.W.W
.WWWWWWW.
WWBBBBBWW
.WBAEABW.
WWBGGGBWW
.WBBBBBW.
WWWWWWWWW
.W.W.W.W.
@banknote | banknote money cash dollar bill
GGGGGGGGGGGGGG
GHHHHHHHHHHHHG
GHGHHHNNHHHGHG
GHHHHNHHNHHHHG
GHGHHHNNHHHGHG
GHHHHHHHHHHHHG
GGGGGGGGGGGGGG
@cash-stack | stack of cash money bundle
.GGGGGGGGGGGG.
GHHHHWWWHHHHHG
GHHHHWWWHHHHHG
GGGGGWWWGGGGGG
NHHHHWWWHHHHHN
GGGGGGGGGGGGGG
NHHHHHHHHHHHHN
NNNNNNNNNNNNNN
@credit-card | credit card bank card
BBBBBBBBBBBBB
BBBBBBBBBBBBB
VVVVVVVVVVVVV
BBBBBBBBBBBBB
BYYBBBBBBBBBB
BYYBBwwwBwwwB
BBBBBBBBBBBBB
UUUUUUUUUUUUU
@wallet | wallet money
..GGGGGGGG..
.HHHHHHHHHH.
TTTTTTTTTTTT
TLTTTTTTTTTT
TTTTTTTTYYTT
TTTTTTTTYYTT
TTTTTTTTTTTT
CCCCCCCCCCCC
@piggy-bank | piggy bank savings
......YY.....
.zz..VVVV....
.zzzzzzzzzz..
zzzzzzzzzKzz.
Mzzzzzzzzzzzz
.zzzzzzzzzzMM
.zzzzzzzzzzz.
..zzzzzzzzz..
..MM....MM...
@safe | safe vault strongbox
xxxxxxxxxxxx
xXXXXXXXXXXx
xXxxxxxxxxXx
xXxxxwwxxxXx
xXxxwVVwxYXx
xXxxwVVwxYXx
xXxxxwwxxxXx
xXxxxxxxxxXx
xXXXXXXXXXXx
xxxxxxxxxxxx
V..........V
@cash-register | cash register till shop
.....VVVVVV.
.....VGGGGV.
.....VVVVVV.
xxxxxxxxxxxx
xwVwVwVxxxxx
xVwVwVwxRRxx
xwVwVwVxxxxx
XXXXXXXXXXXX
XXXXXYYXXXXX
XXXXXXXXXXXX
@price-tag | price tag label sale
...OOOOOOOO
..OOOOOOOOO
.OOOOOWWOWO
OOVOOOOOOOO
OOOOOOWOWWO
.OOOOOOOOOO
..OOOOOOOOO
...OOOOOOOO
@playing-card | playing card ace of hearts
WWWWWWWWW
WRWWWWWWW
WWWWWWWWW
WWRRWRRWW
WWRRRRRWW
WWWRRRWWW
WWWWRWWWW
WWWWWWWWW
WWWWWWWRW
WWWWWWWWW
@id-card | id card badge pass
....VVV.....
WWWWWWWWWWWW
WAAAAWWWWWWW
WACCAWxxxxxW
WASSAWWWWWWW
WABBAWxxxxWW
WAAAAWWWWWWW
BBBBBBBBBBBB
@ticket | ticket admit one
OOOOOOOOOOOOOO
OYYYYYYYYYWYYO
.YKKKKKKYYWYY.
.YYYYYYYYYWYY.
OYKKKKYYYYWYYO
OOOOOOOOOOOOOO
@passport | passport travel document
UUUUUUUU
UBBBBBBB
UBBYYBBB
UBYBBYBB
UBYBBYBB
UBBYYBBB
UBBBBBBB
UBYYYYBB
UBBBBBBB
UUUUUUUU
`);

// ───────────────────────── sports, music and toys ─────────────────────────
category('play', 'Sports, music & toys', 'thing');
pack(`
// sport
@football | football soccer ball
..WWWWWW..
.WWKKWWWW.
WWWKKWWKWW
WKWWWWWKKW
WKKWWKWWWW
WWWWKKKWWW
WWKWWKWWKW
.WKKWWWKK.
..WWWWWW..
@basketball | basketball ball
..OOOOOO..
.OODOOKOO.
OOODOKOOOO
ODDDKDDDDO
OOOKDOOOOO
OOKODOOOOO
OOKOODOOOO
.OKOODOOO.
..OOOOOO..
@tennis-ball | tennis ball
..HHHH..
.HHHWHH.
HHHWHHHH
HWWHHHHH
HHHHHWWH
HHHHWHHH
.HHWHHH.
..HHHH..
@tennis-racket | tennis racket
....RRRR...
...RWxWxR..
..RxWxWxWR.
..RWxWxWxR.
..RxWxWxWR.
...RWxWxR..
....RRRR...
.....BB....
.....BB....
.....VV....
.....VV....
@baseball | baseball ball
..WWWWWW..
.WRWWWWRW.
WWRWWWWRWW
WRWWWWWWRW
WRWWWWWWRW
WWRWWWWRWW
.WRWWWWRW.
..WWWWWW..
@baseball-bat | baseball bat wooden
.........LL
........LLL
.......LLL.
......LLL..
.....LLL...
....LLT....
...LLT.....
..LT.......
.VV........
VV.........
@american-football | american football rugby ball
....TTTTT...
..TTTTTTTTT.
.TTLWWWWWTTT
TTLLWTWTWTTT
.TTTTTTTTTT.
..TTTTTTTC..
....CCCCC...
@volleyball | volleyball ball
..WWWWWW..
.WWxWWWWW.
WWxWWWxxWW
WxWWxxWWWW
WxxxWWWWxW
WWWxWWWxWW
.WWWxxxWW.
..WWWWWW..
@beach-ball | beach ball colourful
..RRWWYY..
.RRRWWYYY.
RRRRWWYYYY
RRRRWWYYYY
BBBBWWGGGG
BBBBWWGGGG
.BBBWWGGG.
..BBWWGG..
@golf-club | golf club and ball
.........x
........x.
.......x..
......x...
.....x....
....x.....
...x......
xxxx...WW.
xxx....WW.
GGGGGGGGGG
@bowling-ball | bowling ball
..PPPPPP..
.PPJPPPPP.
PPJPKPKPPP
PPPPPPPPPP
PPPPPKPPPP
PPPPPPPPPQ
.PPPPPPQQ.
..PPQQQQ..
@bowling-pin | bowling pin skittle
..WWW..
.WWWWW.
.WWWWW.
..RRR..
..WWW..
.WWWWW.
WWWWWWW
WWWWWWW
WWWWWWW
.WWWWW.
.wwwww.
@ping-pong-paddle | ping pong table tennis paddle bat
..RRRRR...
.RRRRRRR..
.RRIRRRR..
.RRRRRRR.W
.RRRRRRR..
..RRRRR...
...LLL....
...LLL....
...TTT....
@shuttlecock | badminton shuttlecock
W.W.W.W
WWWWWWW
.W.W.W.
.WWWWW.
..W.W..
..WWW..
..RRR..
..RRR..
@hockey-stick | hockey stick and puck
.........T
........T.
.......T..
......T...
.....T....
....T.....
...T......
TTTT...VVV
RRR....VVV
@ice-skate | ice skate
.WWWW.....
.WWWW.....
.WAWW.....
.WWWWW....
.WAWWWWW..
.WWWWWWWW.
.WWWWWWWW.
..x....x..
xxxxxxxxxx
@roller-skate | roller skate
.MMMM.....
.MMMM.....
.MWMM.....
.MMMMM....
.MWMMMMM..
.MMMMMMMM.
YYYYYYYYYY
.VV....VV.
.VV....VV.
@skateboard | skateboard
B............B
.BBBBBBBBBBBB.
..RRRRRRRRRR..
..VV......VV..
..VV......VV..
@surfboard | surfboard
....AA....
...AAAA...
...ARRA...
..AARRAA..
..AARRAA..
..AARRAA..
..AARRAA..
..AARRAA..
..AARRAA..
...ARRA...
...ARRA...
....AA....
@skis | skis and poles skiing
.R..x..x.R.
.R..x..x.R.
.R..x..x.R.
.R..x..x.R.
.R..x..x.R.
.R..x..x.R.
.R..x..x.R.
.R.xxxxxxR.
.R..x..x.R.
RR..V..V.RR
@sled | sled sledge toboggan
.T.........T
.TRRRRRRRRRT
..RRRRRRRRR.
..x.......x.
x.x.......x.
xxxxxxxxxxxx
@boxing-glove | boxing glove red
..RRRRR...
.RRIRRRR..
RRRRRRRRR.
RRRRRRRRRR
RRRRRRRRRR
.RRRRRRRR.
..RRRRRR..
..WWWWWW..
..WWWWWW..
@dumbbell | dumbbell weights gym
VV........VV
VVV......VVV
VVVxxxxxxVVV
VVVxxxxxxVVV
VVV......VVV
VV........VV
@whistle | whistle referee
......xx....
.....x......
.YYYYYYYYYY.
YYYEYYYYYYYY
YYYKKYYY....
YYYYYYYY....
.YYYYYY.....
@stopwatch | stopwatch timer
....VV....
...VVVV.V.
..xxxxxx..
.xWWWKWWx.
xWWWWKWWWx
xWWWWKWWWx
xWWWWWRWWx
.xWWWWWWx.
..xxxxxx..
@medal-gold | gold medal first place | a=gold
RR.....BB
.RR...BB.
..RR.BB..
...RBB...
..bbbbb..
.bbcbbbb.
.bcbbabb.
.bbbbabb.
.bbbbbab.
..aaaaa..
=medal-silver | silver medal second place | medal-gold | a=steel
=medal-bronze | bronze medal third place | medal-gold | a=copper
@podium | podium winners first second third
.....YYYY.....
.....YKKY.....
.xxxxYYKYYY...
.xKKxYYKYooo..
.xxKxYYYYoKKo.
.xKxxYYYYooKo.
.xKKxYYYYoKKo.
.xxxxYYYYoooo.
@football-goal | football goal net soccer
WWWWWWWWWWWWWW
WxWxWxWxWxWxWW
WWxWxWxWxWxWxW
WxWxWxWxWxWxWW
WWxWxWxWxWxWxW
WxWxWxWxWxWxWW
W............W
W............W
@basketball-hoop | basketball hoop net
.WWWWWWWWWW.
.WWWWWWWWWW.
.WWWRRRRWWW.
.WWWRWWRWWW.
.WWWRRRRWWW.
..OOOOOOOO..
...WxWxWx...
...xWxWxW...
....xWxW....
.....x......
.....x......
.....x......
@dartboard | dartboard darts
...KKKKKK...
..KWWKKWWK..
.KWRRWWGGWK.
KWRKKGGKKGWK
KWRKGRRGKGWK
KKWWRYYRWWKK
KWGKGRRGKRWK
KWGKKGGKKRWK
.KWGGWWRRWK.
..KWWKKWWK..
...KKKKKK...
@archery-target | archery target bullseye arrow
...WWWWWW...
..WWKKKKWW..
.WKKBBBBKKW.
WWKBBRRBBKWW
WKBBRYYRBBKW
WKBBRYYRBBKW
WWKBBRRBBKWW
.WKKBBBBKKW.
..WWKKKKWW..
...WWWWWW...
....T..T....
...T....T...
@fishing-rod | fishing rod
..........T.
.........T.x
........T..x
.......T...x
......T....x
.....T.....x
....T......x
...Tx......x
..TV.......R
.TT........W
TT..........
@swim-ring | swim ring rubber ring float
...RRRRRR...
..WWRRRRWW..
.WWW....WWW.
RRR......RRR
RRR......RRR
RRR......RRR
.WWW....WWW.
..WWRRRRWW..
...RRRRRR...
@chequered-flag | chequered flag finish race
TKWKWKWKW..
TWKWKWKWK..
TKWKWKWKW..
TWKWKWKWK..
TKWKWKWKW..
T..........
T..........
T..........
T..........
T..........
@jump-rope | jump rope skipping rope
.RR......RR.
.RR......RR.
.RR......RR.
..x......x..
.x........x.
.x........x.
.x........x.
..x......x..
...xx..xx...
.....xx.....
@frisbee | frisbee flying disc
...OOOOOO...
.OOOFFFFOOO.
OOFFOOOOFFOO
.OOOOOOOOOD.
...DDDDDD...
// music
@acoustic-guitar | acoustic guitar
..........CC
.........LCC
........L...
.......L....
..TTT.L.....
.TLLLTT.....
TLLLLLLT....
TLLKKLLT....
TLLKKLLT....
.TLLLLT.....
..TTTT......
@electric-guitar | electric guitar rock
..........VV
.........xVV
........x...
.......x....
.R..RRx.....
.RRRRRR.....
RRRWWRRR....
RRRWWRR.....
RRRRRRR.....
.RRR.RR.....
@piano-keyboard | piano keyboard keys
VVVVVVVVVVVVVV
VRVVxxVVxxVVGV
VVVVVVVVVVVVVV
WKWKWWKWKWKWWW
WKWKWWKWKWKWWW
WWWWWWWWWWWWWW
wwwwwwwwwwwwww
@drum | drum with sticks
L..........L
.L........L.
..L......L..
.WWWWWWWWWW.
RWWWWWWWWWWR
RYRRYRRYRRYR
RRYRRYRRYRRR
RYRRYRRYRRYR
.RRRRRRRRRR.
@drum-kit | drum kit drums cymbals
YYYY......YYYY
..x........x..
..x..BBBB..x..
..x.BWWWWB.x..
.RRRBWWWWBRRR.
RWWRBBBBBBRWWR
RRRR.BBBB.RRRR
.x..x....x..x.
x...x....x...x
@trumpet | trumpet brass
......x.x.x...
YYYYYYYYYYYYY.
Y..YYEYEYEYYYY
....YYYYYY..YY
.....Y..Y...YY
.....YYYY....Y
@saxophone | saxophone sax
......VV.
.....YY..
.....Y...
.....YY..
.....YE..
.....YY..
Y....YE..
YY..YYY..
YYYYYY...
.YYYY....
@violin | violin fiddle
.........CC
........TC.
.......T...
..OO..T....
.OOOOT.....
.OOKOO.....
OOOKOOO....
OOOOOOO....
.OOOOO.....
..DDD......
@recorder | recorder flute pipe
.........LL
........LL.
.......LK..
......LL...
.....LK....
....LL.....
...LK......
..LL.......
.TT........
TT.........
@xylophone | xylophone glockenspiel
.........T.T..
..........W.W.
RROOYYGGBBPP..
RROOYYGGBBPP..
RROOYYGGBBPP..
.ROOYYGGBBP...
.ROOYYGGBB....
..OOYYGGB.....
TTTTTTTTTTTT..
@tambourine | tambourine
...LLLLLL...
..LWWWWWWL..
YLWWWWWWWWLY
.LWWWWWWWWL.
.LWWWWWWWWL.
YLWWWWWWWWLY
..LWWWWWWL..
...LLYYLL...
@maracas | maracas shakers
.RR.....GG.
RYRR...GYGG
RRRR...GGGG
RYRR...GGYG
.RR.....GG.
..T.....T..
..T.....T..
...T...T...
...T...T...
@microphone | microphone mic sing
..xxxx..
.xVxVxx.
.xxVxVx.
.xVxVxx.
..xxxx..
..VVVV..
...VV...
...VV...
...VV...
...VV...
@harp | harp
.YYYYYYY...
YY.x.x.xY..
Y..x.x.x.Y.
Y..x.x.x.Y.
Y..x.x.xY..
Y..x.x.Y...
Y..x.xY....
Y..x.Y.....
Y..xY......
YYYY.......
OOOO.......
// toys and parties
@teddy-bear | teddy bear soft toy
.TT....TT.
TLTTTTTTLT
.TTTTTTTT.
.TKTTTTKT.
.TTLLLLTT.
..TLKKLT..
.TTTTTTTT.
TTTLLLLTTT
TTTLLLLTTT
.TTTTTTTT.
.TT....TT.
@doll | doll toy girl
..YYYYYY..
.YYYYYYYY.
.YSSSSSSY.
YYSKSSKSYY
YYSSSSSSYY
Y..SMMS..Y
..MMMMMM..
.SMMzMMMS.
..MMMMMM..
.MMMMMMMM.
...S..S...
...R..R...
@toy-car | toy car wind up
....x.......
...xxx......
...BBBBBB...
..BBAABAAB..
.BBBBBBBBBB.
BBBBBBBBBBBY
BBVVBBBBVVBB
..VV....VV..
@toy-train | toy train wooden
....V.........
....V..RRRR...
..GGGG.RAAR...
.GGGGGGRRRR...
YYYYYYYYYYYY..
.VV..VV..VV...
.VV..VV..VV...
@toy-robot | toy robot wind up
....R.....
....x.....
..BBBBBB..
..BWKBKW..
..BBBBBB..
.xRRRRRRx.
.xRYYGGRx.
.xRRRRRRx.
...BB.BB..
..VVV.VVV.
@building-blocks | building blocks abc toy cubes
....RRRR....
....RWWR....
....RWRR....
....RRRR....
.BBBB..GGGG.
.BWBB..GWWG.
.BWWB..GWGG.
.BBBB..GGGG.
@toy-brick | toy brick building block plastic
..RR..RR..
.RIIRRIIR.
RRRRRRRRRR
RIRRRRRRRR
RRRRRRRRRR
RRRRRRRRRZ
ZZZZZZZZZZ
@yo-yo | yo-yo toy
....x...
....x...
....x...
...x....
..RRRR..
.RRIRRR.
RRIYYRRR
RRRYYRRR
.RRRRRR.
..RRRR..
@spinning-top | spinning top toy
....R....
....R....
..YYYYY..
.BBBBBBB.
RRRRRRRRR
.YYYYYYY.
..GGGGG..
...BBB...
....x....
@kite | kite flying
....RR.....
...RRYY....
..RRRYYY...
.RRRRYYYY..
..BBBGGG...
...BBGG....
....BG.....
.....x.....
....R.x....
.......xB..
........x..
@party-balloon | balloon party red | a=red
..bbbb..
.bbcbbb.
bbcbbbbb
bbcbbbbb
bbbbbbbb
.bbbbbb.
..bbbb..
...bb...
...x....
....x...
...x....
....x...
@balloon-bunch | bunch of balloons party
..RR..YY...
.RRRRYYYY..
.RRRRYYYY..
..RRBBYY...
...BBBB....
...BBBB....
....BB.....
....xx.....
....x......
....x......
....x......
@rocking-horse | rocking horse toy
.......TT.L.
......TTLLL.
T.....TLLKL.
T..RRRRLLLL.
.LLRRRRLL...
.LLLLLLLL...
.LL....LL...
RL......LR..
.RRRRRRRR...
@jack-in-the-box | jack in the box toy clown
...R..B...
...RRBB...
..SSSSSS..
..SKSSKS..
..SSRRSS..
...xxxx...
...xxxx...
BBBBBBBBBB
BYBBBBBBYB
BBBBYYBBBB
BYBBBBBBYB
BBBBBBBBBB
@puzzle-piece | puzzle piece jigsaw | a=green
....bb....
...bbbb...
....bb....
bbbbbbbbb.
bcbbbbbbbbb
bbbbbbbbbbb
bbbbbbbbb.
bbbb..bbb.
bbbb..bbb.
bbbbbbbbb.
@puzzle-cube | puzzle cube colour cube toy
RRRWWWBBB
RRRWWWBBB
YYYGGGRRR
YYYGGGRRR
BBBOOOYYY
BBBOOOYYY
GGGRRRWWW
GGGRRRWWW
@board-game | board game dice pawns
GGGGGGGGGGGG
GWRWYWBWGWWG
GWGGGGGGGGRG
GYGG.R.GGGWG
GWGGRRRGGGBG
GBGGGGGGGGWG
GWYWRWBWYWGG
GGGGGGGGGGGG
@chess-knight | chess piece knight horse
...VV....
..VVVVV..
.VVKVVVV.
.VVVVVVVV
.VV.VVVVV
....VVVV.
...VVVV..
...VVVV..
..VVVVVV.
.VVVVVVVV
@marbles | marbles glass balls
....BBB....
...BABBB...
...BBBBB...
.RRRBBGGG..
RIRRR.GHGG.
RRRRR.GGGG.
.RRR...GG..
@paper-boat | paper boat origami
.....W.....
....WWW....
...WWwWW...
..WWWwWWW..
WWWWWwWWWWW
.WWWWWWWWW.
..wwwwwww..
@paper-plane | paper plane airplane
..........W
.......WWWW
....WWWWWW.
.WWWWWWWWw.
WWWWWWWww..
...WWwww...
....Ww.....
....w......
@water-pistol | water pistol squirt gun toy
.....OO.....
GGGGGOOGGGG.
GHGGGGGGGGGA
GGGGGGGGGG..
..GGG.O.....
..GGG.......
..GGG.......
@bucket-and-spade | bucket and spade sand beach toys
.xxxxxx.....
x......x..R.
RRRRRRRR..R.
RIRRRRRR..R.
.RRRRRR...R.
.RIRRRR..YYY
.RRRRRR..YYY
..RRRR...YY.
@pinwheel | pinwheel windmill toy
..RR.BBBB.
..RRRBBB..
YYYRRB....
YYYYxGGGG.
.YY.GGGG..
....xGG...
....x.....
....x.....
....x.....
....x.....
@rattle | baby rattle
..AAAA...
.AAWAAA..
.AARRAA..
.AAAAAA..
..AAAA...
....YY...
.....YY..
......MM.
.....M..M
......MM.
@gift | gift present wrapped box bow | a=blue
..RR..RR..
.R..RR..R.
..RRRRRR..
bbbbRRbbbb
bcbbRRbbbb
RRRRRRRRRR
bbbbRRbbbb
bbbbRRbbbb
aaaaRRaaaa
@party-popper | party popper confetti celebration
.....R..Y.B
...G..B..R.
..Y.M..G...
.....Y..M..
...OOY.R...
..OYOO.....
.OYOOO.....
OYOOO......
YOOO.......
OO.........
@pinata | pinata party donkey
........M.M.
.......YYYY.
.......BBKB.
M.BBBBBBBBB.
.RRRRRRRRR..
.YYYYYYYYY..
.GGGGGGGGG..
.MM.MM.MM.M.
.BB.BB.BB.B.
@bunting | bunting party flags banner
xxxxxxxxxxxxxx
RRR.YYY.BBB.GG
RRR.YYY.BBB.GG
.R...Y...B...G
@disco-ball | disco ball mirror ball party
.....x....
.....x....
...wwww...
..wWwAwww.
.wwAwwWwAw
.wWwwAwwww
.wwwAwwWwx
..wAwwwwx.
...wwxx...
`);

// ───────────────────────── tools, science and medical ─────────────────────────
category('tools', 'Tools, science & medical', 'thing');
pack(`
// hand tools
@claw-hammer | hammer claw tool
.xxxxxx...
xxxxxxxx..
xx.TT.....
x..TT.....
...TT.....
...TT.....
...TT.....
...TT.....
...RR.....
...RR.....
@screwdriver | screwdriver tool
.........x
........x.
.......x..
......x...
.....x....
...RR.....
..RRIR....
.RRIR.....
RRRR......
.RR.......
@spanner | spanner wrench tool
.......x.x
.......xxx
......xxx.
.....xx...
....xx....
...xx.....
.xxx......
xxx.......
x.x.......
@pliers | pliers tool
.x....x.
.xx..xx.
..xxxx..
...xx...
..xVVx..
..R..R..
.RR..RR.
.R....R.
.R....R.
.R....R.
@hand-saw | saw hand saw tool
TTT.........
T.Twwwwwwww.
T.Twwwwwwwww
TTTwwwwwwww.
...w.w.w.w..
@power-drill | power drill electric
.OOOOOOO....
OOOOOOOOxxxx
OOFOOOOOx...
.OOOOOOO....
..OOO.......
..OOO.......
..OOO.......
.VVVVV......
.VVVVV......
@tape-measure | tape measure
.YYYYYYY...
YYYYYYYYY..
YYVVVVYYY..
YYVxxVYYY..
YYVVVVYYY..
YYYYYYYYYEE
.YYYYYYYEKE
@toolbox | toolbox red tools
....VVVV....
...V....V...
RRRRRRRRRRRR
RIRRRRRRRRRR
RRRRRYYRRRRR
ZZZZZYYZZZZZ
RRRRRRRRRRRR
RRRRRRRRRRRR
ZZZZZZZZZZZZ
@screw | screw nail
xxxxxx
xVVVVx
.xxxx.
..xw..
..wx..
..xw..
..wx..
..xw..
..wx..
...x..
@nut-and-bolt | nut and bolt
.xxxx.....
xwwwwx....
.xxxx.....
..xw......
..wx.xxxx.
..xw.xVVx.
..wx.xVVx.
..xw.xxxx.
@paint-roller | paint roller decorating
BBBBBBBBBB.
BABBBBBBBBx
BBBBBBBBBBx
.....xxxxxx
.....x.....
.....R.....
.....R.....
.....R.....
.....R.....
@paintbrush | paintbrush paint brush
.........BB
........BBB
.......xBB.
......xx...
.....LL....
....LL.....
...LL......
..LL.......
.TL........
TT.........
@crowbar | crowbar
..xx......
.x..x.....
.x..x.....
....x.....
....x.....
....x.....
....x.....
....x.....
....x.....
....xx....
@flashlight | flashlight torch electric
........xxEE
.VVVVVVxxEEE
VVVVVVVxxEYE
VVRVVVVxxEEE
.VVVVVVxxEEE
........xxEE
@duct-tape | duct tape roll sticky tape
..xxxxxx..
.xxwwwwxx.
xxwVVVVwxx
xxwV..Vwxx
xxwV..Vwxx
xxwVVVVwxxx
.xxwwwwxxxx
..xxxxxx.xx
@chainsaw | chainsaw
...VVVV.......
..V....V......
.OOOOOOOxxxxxx
OOOOOOOOxVxVxx
OOKKOOOOxxxxxx
OOOOOOO.......
.VVV..........
#magnet
.RRR..RRR.
.RRR..RRR.
.RRR..RRR.
.RRR..RRR.
.RRR..RRR.
.RRRRRRRR.
..RRRRRR..
...RRRR...
#magtips
.www..www.
.www..www.
=magnet | magnet horseshoe red | magnet magtips
@cog | cog gear wheel machine
...xx.xx...
.x.xxxxx.x.
.xxxxxxxxx.
xxxx...xxxx
.xxx...xxx.
xxxx...xxxx
.xxxxxxxxx.
.x.xxxxx.x.
...xx.xx...
// garden tools
@rake | rake garden tool
.....T.....
.....T.....
.....T.....
.....T.....
.....T.....
.....T.....
.....T.....
.xxxxxxxxx.
.x.x.x.x.x.
.x.x.x.x.x.
@garden-fork | garden fork pitchfork tool
....RR....
....RR....
....TT....
....TT....
....TT....
....TT....
..xxxxxx..
..x.xx.x..
..x.xx.x..
..x.xx.x..
@trowel | trowel garden spade small
.......GG.
......GG..
.....GG...
....xx....
..xxx.....
.xxwx.....
xxwx......
xxx.......
x.........
@garden-shears | garden shears secateurs clippers
.w.....w.
.ww...ww.
..ww.ww..
...wVw...
...GGG...
..GG.GG..
.GG...GG.
.G.....G.
.G.....G.
@seed-packet | seed packet seeds
WWWWWWWW
WGGGGGGW
WGRGGYGW
WGGGGGGW
WGNGGNGW
WWWWWWWW
WxxxxxxW
WWWWWWWW
// science
@microscope | microscope science
....VVV...
....VVV...
...VVV....
...VVV.VV.
..xVV...V.
..xx....V.
........V.
..AAAA..V.
.......VV.
.VVVVVVVV.
VVVVVVVVVV
@telescope | telescope stars astronomy
.........xBB
.......xxBBB
.....xWWBB..
...xxWWW....
..YWWW......
..YW.T......
....T.T.....
...T...T....
..T.....T...
@test-tube | test tube science green
.WWWW.
..AA..
..AA..
..AA..
..GG..
..GH..
..GG..
..GG..
..GG..
...G..
@test-tube-rack | test tubes rack science
.A...A...A..
.A...A...A..
.R...A...A..
TRTTTYTTTBTT
.R...Y...B..
.R...Y...B..
TTTTTTTTTTTT
T..........T
@beaker | beaker science glass blue liquid
A.......A.
AA.....AA.
.A.....A..
.Ax....A..
.ABBBBBA..
.AxBBBBA..
.ABBABBA..
.AxBBBBA..
.AAAAAAA..
@science-flask | flask erlenmeyer science bubbling
..W.W...
...W....
..AAAA..
...AA...
...AA...
..AMMA..
.AMMMMA.
AMMzMMMA
AMMMMMMA
AAAAAAAA
@bunsen-burner | bunsen burner flame science
....A.....
...ABA....
...BAB....
...BBB....
....x.....
....x.....
....x.....
....xxxx..
...Vx.....
.VVVVVVV..
@magnifying-glass | magnifying glass search detective
..xxxx....
.xAAAAx...
xAAWAAAx..
xAWAAAAx..
xAAAAAAx..
.xAAAAx...
..xxxxTT..
......TTT.
.......TTT
........TT
@atom | atom science
....BBBB....
..BB....BB..
.B.BB..BB.B.
.B...BB...B.
B...BRRB...B
B...BRRB...B
.B...BB...B.
.B.BB..BB.B.
..BB....BB..
....BBBB....
@dna | dna double helix genes
.B....R.
..BWWR..
...RB...
..RWWB..
.R....B.
..RWWB..
...BR...
..BWWR..
.B....R.
..BWWR..
...RB...
@petri-dish | petri dish bacteria germs
..AAAAAAAA..
.AWWWWWWWWA.
AWWGGWWWWHWA
AWWGGWWMWWWA
AWHWWWWMMWWA
.AWWWWWWWWA.
..AAAAAAAA..
@dropper | dropper pipette
..RRR..
.RRRRR.
.RRRRR.
..RRR..
..AAA..
..AAA..
..ABA..
..ABA..
...A...
...A...
...B...
@balance-scale | balance scale weighing justice
.....YY.....
YYYYYYYYYYYY
Y....YY....Y
Y....YY....Y
YYY..YY..YYY
OOO..YY..OOO
.....YY.....
.....YY.....
...YYYYYY...
..OOOOOOOO..
// medical
@first-aid-kit | first aid kit medical box
....WWWW....
...W....W...
WWWWWWWWWWWW
WWWWWRRWWWWW
WWWRRRRRRWWW
WWWRRRRRRWWW
WWWWWRRWWWWW
WWWWWWWWWWWW
wwwwwwwwwwww
@syringe | syringe injection needle
.........xx
........xx.
.......AA.x
......AAA..
.....GAA...
....GGA....
...GGA.....
..xGA......
.x.........
x..........
@pill | pill capsule medicine
......RRR.
.....RRRRR
....RRIRRR
...WRRRRR.
..WWWRRR..
.WWWWWR...
WWWWWW....
WWWWW.....
.www......
@pill-bottle | pill bottle medicine tablets
..WWWWWW..
..WWWWWW..
.OOOOOOOO.
.OWWWWWWO.
.OWRRWWWO.
.OWWWWWWO.
.OWxxxxWO.
.OOOOOOOO.
.DDDDDDDD.
@plaster | plaster band-aid sticking plaster
.........FF.
.......FFFFF
.....FFEEFF.
...FFEEEEF..
.FFFEEEFF...
FFFFFEFF....
.FFFFF......
..FF........
@bandage-roll | bandage roll
...WWWWWW...
..WWwwwwWW..
.WWwWWWWwWW.
.WWwWxxWwWW.
.WWwWWWWwWWW
..WWwwwwWWWW
...WWWWWW.WW
..........ww
@thermometer | thermometer temperature fever
..WWW..
..WxW..
..WRW..
..WxW..
..WRW..
..WRW..
..WRW..
.WRRRW.
.WRRRW.
..WWW..
@stethoscope | stethoscope doctor
.V.....V..
.V.....V..
.V.....V..
.V.....V..
..V...V...
...VVV....
....V.....
....V..xx.
....V.xwwx
.....Vxwwx
......Vxx.
@crutches | crutches walking aids
.TTT...TTT.
..x.....x..
..x.....x..
..x.....x..
.xVx...xVx.
..x.....x..
..x.....x..
..x.....x..
..x.....x..
..V.....V..
@medicine-bottle | medicine bottle syrup cough
...WWW...
...WWW...
..TTTTT..
.TTTTTTT.
.TWWWWWT.
.TWRWWWT.
.TWWWWWT.
.TTTTTTT.
.CCCCCCC.
@tooth | tooth dentist
.WWW..WWW.
WWWWWWWWWW
WWAWWWWWWW
WWWWWWWWWW
WWWWWWWWWw
.WWWWWWWw.
.WWW..WWw.
.WW....Ww.
.WW....Ww.
@x-ray | x-ray skeleton scan
VVVVVVVVVV
VVVwwwwVVV
VVwVwwVwVV
VVwwwwwwVV
VVVwwwwVVV
VwwVwwVwwV
VVVwwwwVVV
VwwVwwVwwV
VVVVwwVVVV
VVVVVVVVVV
@surgical-mask | surgical mask medical face mask
x..........x
.xAAAAAAAAx.
.xAAAAAAAAx.
..ABBBBBBA..
.xAAAAAAAAx.
.xABBBBBBAx.
x..AAAAAA..x
@hospital-bed | hospital bed
x............x
x.WW.........x
xWWWAAAAAAAAAx
xxxxxxxxxxxxxx
x............x
V............V
// cleaning and safety
@broom | broom sweeping brush
.....T.....
.....T.....
.....T.....
.....T.....
.....T.....
.....T.....
...RRRRR...
..YYYYYYY..
..YOYOYOY..
..YOYOYOY..
@mop-bucket | mop and bucket cleaning
.........T..
.........T..
.x.....x.T..
x.......xT..
BBBBBBBBBT..
BABBBBBB.T..
.BBBBBB.WWW.
.BABBBB.WWWW
..BBBB..W.WW
@sponge | sponge washing up
.YYYYYYYYYY.
YYOYYYYOYYYY
YYYYOYYYYOYY
YOYYYYYOYYYY
GGGGGGGGGGGG
.NNNNNNNNNN.
@spray-bottle | spray bottle cleaner
..RRRRR.
.RR..R..
..RRR...
...W....
..AAAA..
.AAAAAA.
.AWWWWA.
.AWBBWA.
.AAAAAA.
.BBBBBB.
@dustpan | dustpan and brush
.........TT.
........TT..
..RRRR.TT...
.RRRRRRR....
RRRRRRRR.YYY
RIRRRRRR.YOY
RRRRRRRR.YOY
@feather-duster | feather duster cleaning
..MM.zz..
.MzMMzMM.
MMzMMMzMz
.zMMzMMM.
..MMzMM..
...MMM...
....T....
....T....
....T....
....T....
@plunger | plunger toilet sink
....T....
....T....
....T....
....T....
....T....
....T....
..RRRRR..
.RRIRRRR.
RRRRRRRRR
@fire-extinguisher | fire extinguisher
..VVV....
.xxRxxVV.
...R...V.
..RRRR.V.
.RRRRRRV.
.RWWWWR..
.RWWWWR..
.RRRRRR..
.RRRRRR..
.RRRRRR..
.ZZZZZZ..
`);

// ───────────────────────── adventure themes and holidays ─────────────────────────
category('adventure', 'Adventure & holidays', 'thing');
pack(`
// pirates
@pirate-flag | pirate flag jolly roger skull
TVVVVVVVVV.
TVVWWWWVVV.
TVWKWWKWVV.
TVVWWWWVVV.
TVWVWWVWVV.
TVVVVVVVVV.
T..........
T..........
T..........
T..........
@cannon | cannon pirate ship gun
.........VVV
...VVVVVVVVV
VVVVVVVVVVVV
VVXVVVVVVVVV
.VVVVVVVVVV.
...TTTTT....
..TTCCCTT...
..TCCTCCT...
...TCCCT....
@spyglass | spyglass pirate telescope
.........YY
........TTY
.......TTT.
......YTT..
.....TTY...
....TTT....
...YTT.....
..TTY......
.AT........
@anchor | anchor ship
....xx....
...x..x...
....xx....
..xxxxxx..
....xx....
....xx....
x...xx...x
xx..xx..xx
.xx.xx.xx.
..xxxxxx..
....xx....
@ship-wheel | ship wheel helm steering
....T.T....
.T..TTT..T.
..TTT.TTT..
..T.T.T.T..
TTT.TYT.TTT
..TTTYTTT..
TTT.TYT.TTT
..T.T.T.T..
..TTT.TTT..
.T..TTT..T.
....T.T....
@message-in-bottle | message in a bottle
.........TT.
........AA..
.....AAAAA..
...AAAAAA...
..AAEEEAA...
.AAEEEAAA...
.AAAEAAA....
.AAAAAA.....
..AAAA......
@treasure-island | treasure island palm tree x marks the spot
.....GG.GGG...
...GGGGGG.....
..GG..TGGGG...
......T...G...
.....T........
.....T....R.R.
..EEETEEEE.R..
.EEEEEEEEER.R.
AEEEEEEEEEEEEA
AAAAAAAAAAAAAA
@cutlass | cutlass pirate sword curved
.........ww
........wWw
.......wWw.
......wWw..
.....wWw...
....wWw....
.Y.wWw.....
.YYYw......
.TYY.......
T..Y.......
@treasure-map-x | treasure map x marks the spot
EE........EE
.EEEEEEEEEE.
.EEKEKEEEEE.
.EEEEEKEAAE.
.EGEEEEKEAE.
.EGGEEKEEEE.
.EEEEEEREREE
.EEEEEEEREE.
.EEEEEEREREE
EE........EE
// wild west
@sheriff-star | sheriff star badge
.....Y.....
....YYY....
YYYYYYYYYYY
.YYYEEEYYY.
..YYEYEYY..
..YYYYYYY..
.YYYY.YYYY.
.YY.....YY.
@horseshoe | horseshoe lucky
.xxx...xxx.
.xVx...xVx.
.xxx...xxx.
.xVx...xVx.
.xxx...xxx.
.xVxx.xxVx.
..xxxxxxx..
...xxVxx...
@wanted-poster | wanted poster outlaw
EEEEEEEEE
EKKEKEKKE
EEEEEEEEE
EELLLLLEE
EELCCCLEE
EELSSSLEE
EELLLLLEE
EEEEEEEEE
EKKKKKKKE
EEEEEEEEE
@tumbleweed | tumbleweed desert
..L.TLT...
.T.LT.LT..
L.TL.T.TL.
.TL.TL.L.T
T.LT.LT.L.
.T.TL.TL.T
..LT.T.LT.
...TLTL...
@lasso | lasso rope cowboy
...LLLLLL...
.LL......LL.
L..........L
.LL......LL.
...LLLLLL...
.......L....
......L.....
.....L......
....LL......
@cowboy-boot | cowboy boot spur
..TTTT....
..TLTT....
..TTTT....
..TLTT....
..TTTT....
..TTTTT...
..TTTTTTT.
xYTTTTTTTT
..CC.CCCCC
@dynamite | dynamite tnt sticks fuse
......Y...
.....x.O..
....x.....
.RR.RR.RR.
.RR.RR.RR.
VVVVVVVVVV
.RR.RR.RR.
.RR.RR.RR.
VVVVVVVVVV
.RR.RR.RR.
@cow-skull | cow skull desert bones
W.........W
WW.......WW
.WWWWWWWWW.
..WKKWKKW..
..WKKWKKW..
...WWWWW...
...WWWWW...
....WKW....
....WWW....
@gold-nugget | gold nugget
...YYY....
.YYEEYYY..
YYEYYYYYY.
YYYYYOYYYY
.YYYYYYYO.
..OOYYOO..
// space
@ufo | ufo flying saucer alien spaceship
....AAAAAA....
...AAWAAAAA...
...AAAAAAAA...
.xxxxxxxxxxxx.
xxRxxYxxGxxBxx
.XXXXXXXXXXXX.
...XXXXXXXX...
....E....E....
...E......E...
@planet-earth | planet earth world globe space
...BBBBBB...
..BBGGBBBB..
.BGGGGBBGBB.
BBGGGBBGGGBB
BBBGGBBBGGBB
BBBGBBBBBGBB
BBBBBGGBBBBB
.BBBGGGGBBB.
..BBBGGBBB..
...WWWWWW...
#planet a=orange
...bbbbbb...
..bbcccbbb..
.bbccbbbbbb.
bbcbbbbabbbb
bbbbbbbbbbbb
bbbabbbbbbab
bbbbbbbbbbbb
.bbbbbabbba.
..bbbbbbaa..
...aaaaaa...
#rings y=4 x=-1
EEEEEEEEEEEEEE
.FFFFFFFFFFFF.
=planet-ringed | ringed planet saturn | planet rings
=planet-red | red planet mars | planet:a=red
=planet-ice | ice planet blue neptune | planet:a=ice
@satellite | satellite space orbit
BBB......BBB
BAB.wwww.BAB
BBBxwWWwxBBB
BAB.wwww.BAB
BBB..xx..BBB
....xxxx....
.....R......
@space-station | space station orbit
....B..B....
....B..B....
BBB.wwww.BBB
BABxwAAwxBAB
BBB.wwww.BBB
....wwww....
BBB.wAAw.BBB
BABxwwwwxBAB
BBB..xx..BBB
@asteroid | asteroid meteor space rock
...xxxxx...
.xxxwxxxxx.
xxwwxxxXxxx
xxxxxxXXxxx
xXxxxxxxxxX
xXXxxwxxxX.
.xxxxxxXX..
...XXXX....
@ray-gun | ray gun laser blaster space
..........G.
RRRRRRRR.G..
RRIRRRRRxxY.
RRRRRRRR.G..
..RRR.Y...G.
..RRR.......
..ZZZ.......
@space-helmet | space helmet astronaut
...WWWWWW...
..WWWWWWWW..
.WWBBBBBBWW.
.WBBABBBBBW.
.WBABBBBBBW.
.WBBBBBBBBW.
.WWBBBBBBWW.
..WWWWWWWW..
.wwRwwwwBww.
..wwwwwwww..
@moon-rover | moon rover space buggy
.........x....
........xxx...
...WWWW..x....
..WWAAWW.x....
xxxxxxxxxxxx..
.xYxxxxxxxx...
.VV..VV..VV...
VxxVVxxVVxxV..
.VV..VV..VV...
@space-shuttle | space shuttle
......WW......
.....WWWW.....
.....WVVW.....
.....WWWW.....
.....WWWW.....
....WWWWWW....
...VWWWWWWV...
..VVWWWWWWVV..
.VVVWWWWWWVVV.
.VV.xx..xx.VV.
....OO..OO....
@comet | comet shooting space
.........AA.
......AAAAWA
....AABBWWWA
..ABBBAWWWA.
.AB.BAAAAA..
A..B..A.....
..A.........
// spies and detectives
@binoculars | binoculars
.VVV..VVV.
.VVV..VVV.
VVVVVVVVVV
VVVVxxVVVV
VVVV..VVVV
VAAV..VAAV
VAAV..VAAV
.VV....VV.
@walkie-talkie | walkie talkie radio
.x......
.x......
.x......
VVVVVV..
VxxxxV..
VxxxxV..
VVVVVV..
VGVVRV..
VVVVVV..
VVVVVV..
@fingerprint | fingerprint clue detective
..BBBBB..
.B.....B.
B..BBB..B
B.B...B.B
B.B.B.B.B
B.B.B.B.B
..B.B.B..
.B..B.B..
....B..B.
@secret-file | top secret file folder
.LLLLL......
LLLLLLLLLLLL
LLLLLLLLLLLL
LLRRRRRRRRLL
LLRWRWRWWRLL
LLRRRRRRRRLL
LLLLLLLLLLLL
TTTTTTTTTTTT
@footprints | footprints tracks clue
..TT.......
.TTTT......
.TTTT..TT..
..TT..TTTT.
......TTTT.
.TT....TT..
.TT........
.......TT..
.......TT..
@handcuffs | handcuffs police
.xxxx...xxxx.
x....x.x....x
x....xxx....x
x....x.x....x
.xxxx...xxxx.
@police-badge | police badge shield
YYY.YYY.YYY
YYYYYYYYYYY
YYYBBBBBYYY
YYBBYBYBBYY
.YBBBYBBBY.
.YYBBBBBYY.
..YYYYYYY..
...YYYYY...
.....Y.....
// ninja and far east
@shuriken | shuriken ninja star throwing star
.....x.....
....xx.....
....xxx....
xxxxxVxxx..
..xxxVxxxxx
....xxx....
.....xx....
.....x.....
@nunchucks | nunchucks ninja
..xxxxxx..
.x......x.
T........T
TT......TT
TT......TT
TT......TT
TT......TT
TT......TT
@katana | katana samurai ninja sword
..........w
.........wW
........wW.
.......wW..
......wW...
.....wW....
....wW.....
..YYW......
..VY.......
.VR........
VR.........
@paper-lantern | paper lantern red festival
...VVVV...
....YY....
..RRRRRR..
.RRIRRRRR.
RRIRRYRRRR
RRIRRYRRRR
.RRIRRRRR.
..RRRRRR..
....YY....
....YY....
// circus and funfair
@circus-tent | circus tent big top
......RR......
......R.......
.....RWR......
....RWWRR.....
..RRWWRRWWR...
.RWWRRWWRRWW..
RRWWRRWWRRWWR.
.RWWRRVVRRWW..
.RWWRRVVRRWW..
.RWWRVVVVRWW..
@juggling-balls | juggling balls clubs
....BB....
....BB....
.RR....YY.
.RR....YY.
..........
..W....W..
..GG..GG..
..GG..GG..
@unicycle | unicycle circus
...RRRR...
....VV....
....xx....
....xx....
..VVVVVV..
.VV.xx.VV.
.V.xxxx.V.
.VV.xx.VV.
..VVVVVV..
@ring-of-fire | ring of fire hoop flaming circus
..Y.O..Y.O..
.OYOROOYORO.
OROO....OORY
YO........OO
OR........RO
YO........OY
ORO......ORO
.OYOO..OOYO.
..OROYYORO..
.....VV.....
.....VV.....
....VVVV....
@rabbit-in-hat | magic hat rabbit magician trick
...WW.WW...
...WM.MW...
...WWWWW...
...WKWKW...
...WWMWW...
VVVVVVVVVVV
.VVVVVVVVV.
..VVVVVVV..
..RRRRRRR..
..VVVVVVV..
..VVVVVVV..
// camping
@camping-tent | camping tent green
......NN......
.....NGGN.....
....NGGGGN....
...NGGVVGGN...
..NGGGVVGGGN..
.NGGGVVVVGGGN.
NGGGGVVVVGGGGN
x............x
@sleeping-bag | sleeping bag camping
.SSS........
SKSKBBBBBBB.
SSSSBABBBBBB
.CCBBBBBBBBB
..UUUUUUUUU.
@marshmallow-stick | marshmallow on stick campfire toasting
.........WW
........WWW
........FW.
.......T...
......T....
.....T.....
....T......
...T.......
..T........
.T.........
@hiking-boot | hiking boot walking
..TTTT....
..TYTT....
..TTTT....
..TYTTT...
..TTTTTTT.
..TLTTTTTT
..TTTTTTTT
.VVVVVVVVV
.V.V.V.V.V
@canteen | canteen water flask camping
....xx....
...VxxV...
..NNNNNN..
.NGGGGGGN.
NGGHGGGGGN
NGGHGGGGGN
NGGGGGGGGN
.NGGGGGGN.
..NNNNNN..
@camp-stove | camp stove gas cooker
..B.A.B...
.xxxxxxx..
..xxxxx...
...xxx....
.BBBBBBB..
.BABBBBB..
.BBBBBBB..
.UUUUUUU..
@pocket-knife | pocket knife swiss army
......ww...
.....wWw...
....wWw..x.
...wWw..x..
.RRRRRRRR..
RRRWRRRRRR.
RRWWWRRRRR.
RRRWRRRRRR.
.RRRRRRRR..
// christmas, halloween, easter and more
@christmas-tree | christmas tree decorated star
.....Y.....
....YYY....
.....G.....
....GGG....
...GRGGG...
....GGG....
...GGGYG...
..GBGGGGG..
...GGGGG...
..GGGRGGG..
.GGYGGGGBG.
.....T.....
....RRR....
@christmas-stocking | christmas stocking sock
..WWWWW...
..WWWWW...
..RRRRR...
..RRGRR...
..RRRRR...
..RGRRR...
..RRRRRRR.
..RRRRRRRR
..RRRRRRRR
...RRRRRR.
@candy-cane | candy cane christmas sweet
..RWRW...
.W....R..
.R....W..
......R..
.....W...
.....R...
.....W...
.....R...
.....W...
.....R...
@bauble | christmas bauble ornament ball
....YY....
....xx....
..RRRRRR..
.RRIRRRRR.
RRIRRRRRRR
WYWYWYWYWY
RRRRRRRRRR
.RRRRRRRZ.
..RRRRZZ..
@snow-globe | snow globe christmas
...AAAAAA...
..AAWAAAAA..
.AAAAAGAWAA.
.AWAAGGGAAA.
.AAAAGGGAAA.
.AAWGGGGGAA.
..AAAATAAA..
..WWWWWWWW..
.RRRRRRRRRR.
.RRRRRRRRRR.
@gingerbread-man | gingerbread man biscuit christmas
...TTTT...
...TKTKT..
...TTTT...
.TTTRRTTT.
TTTTTTTTTT
...TWTT...
...TTTT...
...TWTT...
..TTT.TTT.
..TT...TT.
@wreath | christmas wreath holly door
...GGGGGG...
..GNGRRGNG..
.GNG....GNG.
GGR......GGG
GNG......GNG
GGG......RGG
.GNG....GNG.
..GNGGGGNG..
...GGRRGG...
....RRRR....
@sleigh | santa sleigh sled christmas presents
.........BYG..
Y........BGR..
YR.......RRRR.
.RRRRRRRRRRRR.
.RRIRRRRRRRR..
..RRRRRRRRR...
...x.....x....
Y..x.....x..Y.
.YYYYYYYYYYY..
@jack-o-lantern | jack o lantern halloween pumpkin carved
.....GG.....
....GG......
..OOOGOOOO..
.OOFOOOOOOO.
OOKKOOOKKOOO
OOKKOOOKKOOO
OOOOOKOOOOOO
OKOKOKOKOKOO
.OKKKKKKKOO.
..OODOOODO..
@candy-bag | trick or treat bag halloween sweets
.R.Y.M.G..
RRRYYMMGG.
OOOOOOOOOO
OOOOOOOOOO
OKKOOOKKOO
OOOOKOOOOO
OKOKOKOKOO
OOKKKKKOOD
.OOOOOODD.
@candy-corn | candy corn halloween sweet
...WW...
...WW...
..WWWW..
..OOOO..
.OOOOOO.
.OFOOOO.
YYYYYYYY
YEYYYYYY
.YYYYYY.
#egg a=yellow
...bbbb...
..bbcbbb..
.bbcbbbbb.
.bcbbbbbb.
bbbbbbbbbb
bbbbbbbbbb
bbbbbbbbba
bbbbbbbbba
.bbbbbbaa.
..bbaaaa..
#eggzigzag y=3
.M.M.M.M..
M.M.M.M.MM
..........
BBBBBBBBBB
..........
.M.M.M.M..
#eggdots y=2
...W..W...
.W..W...W.
....W.W...
W.W....W.W
...W.W....
.W....W.W.
....W.....
=easter-egg | easter egg painted zigzag | egg eggzigzag
=easter-egg-dotty | easter egg blue spotted | egg:a=blue eggdots
=easter-egg-pink | easter egg pink spotted | egg:a=pink eggdots
@easter-basket | easter basket eggs
....TTTT....
..TT....TT..
.T........T.
.T.MM.BB.YT.
.TMMMBBBBYYT
LLLLLLLLLLLL
.LTLTLTLTLL.
.LLTLTLTLTL.
..LLLLLLLL..
@chocolate-bunny | chocolate bunny easter rabbit
..TT.TT..
..TC.TC..
..TC.TC..
..TTTTT..
..TKTKT..
..TTLTT..
.TTTTTTT.
.TTRRRTT.
.TTTYTTT.
.TTTTTTT.
.CC...CC.
@fireworks | fireworks rocket celebration new year
.Y...R...B..
..Y.R.R.B...
Y.YRRWRRB.B.
..Y.RRR.B...
.Y...R...B..
...G..x.....
..GGG.x.....
...G..x.....
......x.....
.....xx.....
@heart-box | box of chocolates valentine heart
.RRR..RRR.
RRIRRRRRRR
RIRRWWRRRR
RRRWWWWRRR
RRRRWWRRRR
.RRRRRRRR.
..RRRRRR..
...RRRR...
....RR....
`);
function ferrisWheel(c) {
  for (let a = 0; a < 360; a += 3) { const r = a * Math.PI / 180; c.px(Math.round(15.5 + 12 * Math.cos(r)), Math.round(14 + 12 * Math.sin(r)), 'g1').px(Math.round(15.5 + 6 * Math.cos(r)), Math.round(14 + 6 * Math.sin(r)), 'g2'); }
  for (let k = 0; k < 8; k++) { const r = k * Math.PI / 4; for (let i = 1; i < 12; i++) c.px(Math.round(15.5 + i * Math.cos(r)), Math.round(14 + i * Math.sin(r)), 'g2'); }
  for (let i = 0; i < 16; i++) c.px(15 - (i >> 1), 14 + i, 'g3').px(16 + (i >> 1), 14 + i, 'g3');
  c.rect(5, 29, 22, 2, 'g3');
  for (let k = 0; k < 8; k++) { const r = k * Math.PI / 4, x = Math.round(15.5 + 12 * Math.cos(r)) - 1, y = Math.round(14 + 12 * Math.sin(r)); c.rect(x, y, 3, 3, ['r2', 'y2', 'b2', 'n2'][k % 4]).h(x, y, 3, 'w0'); }
  c.rect(15, 13, 2, 2, 'y2');
}
ND('ferris-wheel', 'ferris wheel funfair big wheel', ferrisWheel, { size: 32 });

// ───────────────────────── plants and landscape ─────────────────────────
category('outdoors', 'Plants & landscape', 'thing');
pack(`
@birch-tree | birch tree white trunk
...HHHHHH...
.HHHGHHHHH..
HHGHHHHGHHH.
HHHHGHHHHGHH
.HGHHHHGHHH.
..HHHWWHHH..
.....WK.....
.....WW.....
.....KW.....
.....WW.....
.....WK.....
....WWWW....
@willow-tree | willow tree weeping
....GGGGG....
..GGGHGGGGG..
.GGHGGGGGHGG.
GGGGGGTGGGGGG
GHG.GGTGG.GHG
G.G.G.TT.G.GG
G.G.G.TT.G.G.
G...G.TT.G.G.
G.....TT...G.
.....TTTT....
@round-tree | round tree topiary lollipop tree park
...GGGGGG...
..GGHHGGGG..
.GGHHGGGGGG.
.GGHGGGGGGN.
.GGGGGGGGNN.
..GGGGGGNN..
...GGNNNN...
.....TT.....
.....TT.....
.....TT.....
....TTTT....
@bamboo | bamboo stalks
..G....H..
.GG..G.HH.
..G..G.H..
..N..G.N..
..G..N.H..
..G..G.H..
..N..G.N..
..G..N.H..
..G..G.H..
..N..G.N..
..G..G.H..
@fern | fern plant leaves
G....G....G
.G..GG...G.
.GG.G.G.GG.
G.G.GG.G.G.
.G.GG.GG.G.
..GG.G.GG..
...G.GG.G..
....GGG....
.....N.....
@reeds | reeds cattails bulrush pond plants
..T....T...
..T..T.T...
..T..T.T.G.
..T..T.G.G.
G.G..G.G.G.
G.G.GG.G.G.
G.G.G..GG..
.GG.G.GG...
..GGGGG....
@clover | four leaf clover lucky shamrock
..GG.GG..
.GHGGGHG.
.GGGGGGG.
..GGNGG..
.GGGGGGG.
.GHGGGHG.
..GG.GG..
....N....
.....N...
@sprout | sprout seedling young plant growing
.HH...HH.
HHGH.HGHH
.HHGGGHH.
...HGH...
....G....
....G....
.TTTTTTT.
TTCTTTCTT
@rose | rose red flower
..RRRR...
.RRIRRR..
RRIRRZRR.
RRRZZRRR.
.RRRRRR..
..RRRR...
....G....
..GGG.G..
...GGGG..
....G....
....G....
@daisy | daisy white flower
..W.W.W..
.WWWWWWW.
..WYYYW..
.WWYYYWW.
..WYYYW..
.WWWWWWW.
..W.G.W..
....G.G..
..G.GG...
...GG....
....G....
@lavender | lavender purple flowers
.P...P...P.
.PP.PP..PP.
.JP.PJ..PJ.
.PP.PP..PP.
..P.P...P..
..G.G...G..
..G..G.G...
...G.G.G...
....GGG....
@dandelion | dandelion seed head wish
...W.W.W...
..W.W.W.W..
.W.WWWWW.W.
..WWWwWWW..
.W.WWWWW.W.
..W.W.W.W..
...W.G.W...
.....G.....
.....G.....
....GGG....
@lotus-flower | lotus flower water lily pink pond
....zz.....
..z.zz.z...
..zzMMzz...
.zzMYYMzz..
GGzzMMzzGGG
GGGGGGGGGGG
.GGGNGGGGG.
@acorn | acorn oak nut
....T....
...TT....
.CCCCCCC.
CTCTCTCTC
.LLLLLLL.
.LFLLLLL.
.LLLLLLL.
..LLLLL..
...LLL...
@pine-cone | pine cone fir cone
...TT...
..TLTT..
.TLTTLT.
.TTLTTT.
TLTTLTLT
TTLTTLTT
.TLTLTT.
.TTLTLT.
..TTLT..
...TT...
@maple-leaf | maple leaf autumn red
....R....
.R.RRR.R.
.RRRRRRR.
RRRROORRR
.RRROORR.
RRRROORRR
..RRORR..
.R..O..R.
....O....
@leaf-pile | pile of leaves autumn
.....O..R...
...OORROYO..
..ROYOORROO.
.OORROYOORY.
ROYOOROORROO
OROORYOROOYR
@stick | stick branch twig wood
.........TL.
.......TTT..
..L...TT....
...TTTT.....
..TTT.......
.TT..T......
TT....L.....
@bird-nest | bird nest eggs
....AA.WW...
...AAAWWWA..
.TLAAAWWAAT.
TLTLTLTLTLTL
.TLTLTLTLTL.
..TTLTLTLT..
...TTTTTT...
@beehive | beehive bees honey
....YYYY....
...YYYYYY...
..OOOOOOOO..
..YYYYYYYY..
.OOOOOOOOOO.
.YYYYVVYYYY.
.OOOOVVOOOO.
..YYYYYYYY..
...OOOOOO...
@anthill | anthill ants mound
.....CC.....
....TTTT....
...TTLTTT...
..TTTTTTLT..
.TTLTTTTTTT.
TTTTTTLTTTTT
Z..Z.....Z..
@pond | pond water lily pads
...AAAAAAA....
.AAABBBBBAAA..
ABBBBGGBBBBBA.
ABWBBGGBBBBBBA
ABBBBBBBBGGBBA
.AABBBBBBGBAA.
...AAAAAAAA...
@pebbles | pebbles small stones
.....xxx....
....xwxxx...
.xx.xxxxX...
xwxx.XXX.xx.
xxxX....xwxx
.XX.....xxXX
@mountain | mountain peak grey
......xx......
.....xxxx.....
....xxwxxX....
...xxwxxxXX...
..xxwxxxxxXX..
.xxwxxxXxxxXX.
xxxxxxXXxxxxXX
xxxxxXXxxxxxXX
#snowpeak
......WW......
.....WWWW.....
....WWWWWW....
...WW.WW.WW...
=snowy-mountain | snowy mountain snow peak | mountain snowpeak
@volcano | volcano erupting lava
....R.Y.R.....
.....OYO......
....ROYOR.....
....TOOOT.....
...TTROTTT....
..TTTRTTTCC...
.TTTTRRTTTCC..
TTTTTTRTTTTCC.
TTTTTTTTTTTTCC
@hill | green hill grassy
.....GGGG.....
...GGHGGGGG...
..GHHGGGGGGG..
.GHGGGGGGGGGN.
GGGGGGGGGGGGNN
GGGGGGGGGGNNNN
@waterfall-rocks | waterfall river cliff
xxxAAAAAAxxx
xXxABAABAxXx
xxxAABAAAxxx
xXxABAABAxxx
xxxAABAAAxXx
xXxABAABAxxx
xxxAABAAAxxx
.WWWAAAAWWW.
WAWWWWWWWWAW
.AAWAAAWAAA.
@sand-castle | sand castle beach
.....R......
.....TR.....
..E..T..E...
.EFE.EE.EFE.
.EEEEEEEEEE.
.EFEEEEEEFE.
.EEEEVVEEEE.
EEFEEVVEEFEE
EEEEEEEEEEEE
@iceberg | iceberg ice floating
.....WW.....
....WWWA....
...WWWWAA...
..WWAWWWAA..
.WWWWWAWWAA.
BBBBBBBBBBBB
.BAAAAAAAAB.
..BAAAAAAB..
....BAAB....
@seaweed | seaweed kelp underwater plant
.G....G...
..G..G..G.
..G..G.G..
.G....G.G.
.G...G..G.
..G..G.G..
..G...GG..
.G...G.G..
.GG..GG...
..GGGG....
@vegetable-patch | vegetable patch garden carrots growing
.G.G..H.H..G.G
.GGG..HHH..GGG
..O....H....O.
TTTTTTTTTTTTTT
TCTTCTTTCTTCTT
CCCCCCCCCCCCCC
`);

// ───────────────────────── sky and weather ─────────────────────────
category('weather', 'Sky & weather', 'fx');
pack(`
#cl a=white
....bbb.....
..bbbbbbbb..
.bbbbbbbbbb.
bbbbbbbbbbbb
bbbbbbbbbbbb
.aaaaaaaaaa.
#rainfall y=7
..A...A...A.
..B...B...B.
#snowfall y=7
..W...W...W.
............
....W...W...
#hailfall y=7
.ww...ww....
.ww...ww.ww.
....ww...ww.
....ww......
#cloudbolt y=6
.....YY.....
....YY......
....YYY.....
.....Y......
....Y.......
#sunbit x=6 y=-3
..Y.Y.
.YYYYY
YYEEYY
.YEEYY
..YYY.
=partly-cloudy | sun behind cloud partly cloudy weather | sunbit cl
=rain-cloud | rain cloud raining weather | cl:a=grey rainfall
=storm-cloud | storm cloud thunder lightning | cl:a=dark cloudbolt
=snow-cloud | snow cloud snowing weather | cl snowfall
=hail-cloud | hail cloud hailstones ice | cl:a=grey hailfall
@full-moon | full moon night
...EEEEEE...
..EEEEEEEE..
.EEEwEEEEEE.
EEEwwEEEEwEE
EEEEEEEEEEEE
EEEEEEwwEEEE
EEwEEEwwEEEE
.EEEEEEEEEF.
..EEEEEEFF..
...EFFFF....
@night-sky | night sky crescent moon and stars
.....EE....W.
...EEE.......
..EEE....W...
..EEE........
.EEEE......W.
.EEEE........
..EEEE...E...
..EEEEEEEE...
W...EEEEE....
......W......
@star-cluster | stars twinkling night sky
....Y.......
...YYY....W.
....Y.......
.........Y..
.W......YYY.
.........Y..
...Y........
..YYY...W...
...Y........
@shooting-star | shooting star falling wish
..........Y.
.........YYY
.......EEYY.
.....EE.EY..
...EE..E....
.EE..EE.....
E...E.......
@rainbow | rainbow colours
...RRRRRRRR...
.RROOOOOOOORR.
RROYYYYYYYYORR
ROYGGGGGGGGYOR
ROYGBBBBBBGYOR
ROYGB....BGYOR
ROYG......GYOR
ROY........YOR
@raindrops | raindrops rain falling
.A....A....
.B..A.B..A.
....B....B.
..A....A...
..B..A.B...
.....B....A
A.........B
B...A......
....B......
@snowflakes | snow falling snowflakes winter
.W.....W...
WWW...WWW..
.W..W..W...
...WWW.....
....W....W.
.W......WWW
WWW..W...W.
.W..WWW....
.....W.....
@wind-gust | wind gust blowing air
....wwww....
.wwww...w...
........w...
wwwwwwww....
............
..wwwwwwwww.
...........w
.wwww.....w.
@fog | fog mist haze
..wwwwwwww..
wwwWWWWWWwww
............
.wwwWWWWwwww
wwWWWWWWWww.
............
..wwwWWWWwww
@sunrise | sunrise sunset sun horizon
.Y....Y....Y.
..Y...Y...Y..
....OOOOO....
Y..OYYYYYO..Y
..OYYEEYYYO..
..OYYEYYYYO..
BBBBBBBBBBBBB
.AABBBAABBBA.
@big-fire | big fire flames blaze burning
.....R......
....RR...R..
.R..ROR..R..
.RR.ROOR.RR.
.RORROYORRR.
RROOOYYOOOR.
ROOYOYEYOOR.
ROYYYEEYYOR.
.ROYEEEEYR..
..RRYYYYR...
@water-splash | water splash drops
A....A....A
.A..AAA..A.
..A.ABA.A..
.A.AABAA.A.
A.ABBBBBA.A
.AABBWBBAA.
AABBBBBBBAA
.AAAAAAAAA.
@sea-wave | sea wave ocean surf
....WWWW.....
..WWAAAAW....
.WAABBBBAW...
WABBBB..WAW..
WABBB....W...
ABBBBB.......
ABBBBBBAAAAAA
BBBBBBBBBBBBB
@bubbles | bubbles soap bubbles floating
...AAA.....
..A.W.A....
..A...A.AA.
...AAA.A.WA
.AA....A..A
A.WA....AA.
A..A.......
.AA...AA...
.....A.WA..
......AA...
@dust-cloud | dust cloud puff running
....LLL.....
..LLLFLLL...
.LLFLLLLLL.L
LLLLLLFLLLL.
.LLTLLLLLTL.
..TT.LTT....
@steam | steam hot vapour rising
..WW....WW..
.WW....WW...
.Ww.....Ww..
..WW.....WW.
...Ww...WW..
..WW...Ww...
.WW....WW...
.Ww.....WW..
@icicles | icicles ice hanging frozen
AAAAAAAAAAAA
AWAABAAWAABA
.WA.BA.WA.B.
.WA.B..WA...
..A....W....
..A....A....
`);

// ───────────────────────── emotes and icons ─────────────────────────
category('emotes', 'Emotes & icons', 'fx');
pack(`
// faces: one head, different eyes, mouths and extras
#face a=yellow
...bbbbbb...
..bcccbbbb..
.bccbbbbbbb.
bbcbbbbbbbbb
bbbbbbbbbbbb
bbbbbbbbbbbb
bbbbbbbbbbbb
bbbbbbbbbbba
bbbbbbbbbbba
.bbbbbbbbaa.
..bbbbbaaa..
...aaaaaa...
#e-dot y=4
...K....K...
...K....K...
#e-happy y=4
...K....K...
..K.K..K.K..
#e-closed y=5
..KKK..KKK..
#e-heart y=3
..R.R..R.R..
..RRR..RRR..
...R....R...
#e-star y=3
...O....O...
..OWO..OWO..
...O....O...
#e-wide y=3
..WWW..WWW..
..WKW..WKW..
..WWW..WWW..
#e-angry y=3
..K......K..
...KK..KK...
...K....K...
#e-x y=3
..K.K..K.K..
...K....K...
..K.K..K.K..
#e-shades y=3
KKKKKKKKKKKK
.KKKK..KKKK.
..KK....KK..
#e-wink y=4
...K........
...K...KKK..
#e-sad y=3
....K..K....
...K....K...
...K....K...
#e-brow y=3
.......KK...
...K....K...
...K....K...
#m-smile y=7
..K......K..
...KKKKKK...
#m-grin y=7
..KKKKKKKK..
..KWWWWWWK..
...KKKKKK...
#m-frown y=8
...KKKKKK...
..K......K..
#m-o y=7
.....KK.....
....KRRK....
.....KK.....
#m-flat y=8
...KKKKKK...
#m-wavy y=8
..K.KK.KK...
...K..K..K..
#m-tongue y=7
..KKKKKKKK..
.....MMM....
.....MMM....
#m-kiss y=7
.....RR.....
......R.....
.....RR.....
#m-grit y=7
..KKKKKKKK..
..KWKWKWKK..
..KKKKKKKK..
#m-open y=7
..KKKKKKKK..
..KRRRRRRK..
...KRMMRK...
....KKKK....
#m-small y=8
....KKKK....
#x-tears y=6
...A....A...
...A....A...
...A....A...
...A....A...
#x-laughtears y=4
A..........A
AA........AA
#x-sweat y=1
.........A..
.........AA.
.........AA.
#x-blush y=6
.MM......MM.
#x-zzz y=0
.........UUU
..........U.
.........UUU
#x-halo y=-2
...YYYYYY...
..Y......Y..
#x-horns y=-1
.R........R.
.RR......RR.
#x-thermo y=8
....KKKK....
.......WWWWR
#x-mask y=6
.WWWWWWWWWW.
WWWWWWWWWWWW
.WWwwwwwwWW.
..WWWWWWWW..
#x-chin y=9
..SSS.......
.SSSy.......
.SSy........
#x-glasses y=3
.VVVV..VVVV.
.VWKVVVVWKV.
.VVVV..VVVV.
#x-nose y=5
.....RR.....
.....RR.....
#x-kissheart y=6
.........R.R
.........RRR
..........R.
=face-happy | happy face smile emoji | face e-dot m-smile
=face-grin | grinning face big smile happy | face e-happy m-grin
=face-laughing | crying laughing face lol funny | face e-happy m-open x-laughtears
=face-sad | sad face unhappy | face e-sad m-frown
=face-crying | crying face tears sad | face e-closed m-frown x-tears
=face-angry | angry face mad cross | face e-angry m-frown
=face-furious | furious red angry face rage | face:a=red e-angry m-grit
=face-scared | scared face afraid fear sweat | face e-wide m-o x-sweat
=face-surprised | surprised shocked face wow | face e-wide m-o
=face-love | love face heart eyes | face e-heart m-smile
=face-kiss | kiss face blowing kiss wink | face e-wink m-kiss x-kissheart
=face-sleeping | sleeping face asleep zzz | face e-closed m-o x-zzz
=face-yawning | sleepy tired yawning face | face e-closed m-open
=face-sick | sick face green ill queasy | face:a=lime e-sad m-wavy
=face-fever | sick face thermometer fever ill | face e-sad x-thermo
=face-mask | face with medical mask ill | face e-dot x-mask
=face-cool | cool face sunglasses | face e-shades m-smile
=face-thinking | thinking face hmm wondering | face e-brow m-flat x-chin
=face-wink | winking face wink | face e-wink m-smile
=face-silly | silly face tongue out cheeky | face e-wink m-tongue
=face-confused | confused face unsure worried | face e-dot m-wavy
=face-neutral | neutral face blank meh | face e-dot m-flat
=face-shy | shy blushing face embarrassed | face e-happy m-small x-blush
=face-star-eyes | excited face star eyes amazed | face e-star m-grin
=face-dizzy | dizzy face knocked out | face e-x m-wavy
=face-nerd | nerd face glasses clever | face x-glasses m-grin
=face-devil | devil face naughty purple horns | face:a=purple e-angry m-smile x-horns
=face-angel | angel face halo innocent good | face e-happy m-smile x-halo
=face-cold | cold freezing face blue shivering | face:a=ice e-wide m-grit
=face-clown | clown face red nose | face:a=white e-dot m-open x-nose
@poo | poo poop emoji funny
.....TT.....
....TTTT....
...TTLTTT...
..TTTTTTTT..
..TWKTTWKT..
.TTWKTTWKTT.
.TLTTTTTTTT.
TTTKTTTTKTTT
TTTTKKKKTTTT
.TTTTTTTTTT.
// hands
@thumbs-up | thumbs up like good yes hand
.....ss...
.....ss...
....sss...
....ss....
BBsssssss.
BBsssssst.
BBsssssss.
BBsssssst.
BBsssssss.
BB.sssst..
=thumbs-down | thumbs down dislike bad no hand | thumbs-up | | rot=2
@waving-hand | waving hand hello goodbye hi
..s.s.s...
..s.s.s.s.
..s.s.s.s.
..sssss.s.
s.sssssss.
sssssssss.
.ssssssss.
..ssssss..
...sssst..
...BBBB...
@peace-sign | peace sign victory hand two fingers
.s...s...
.ss.ss...
..s.s....
..sss....
..sssss..
.sstssts.
.sssssss.
..sssss..
..tssst..
..BBBB...
@fist-bump | fist punch hand
.ssssssss.
sstststsss
ssssssssss
ssssssssss
tsssssssss
.tsssssss.
..BBBBBB..
@point-up | finger pointing up hand
...ss....
...ss....
...ss....
...ss....
...sssss.
.sstststs
.ssssssss
.ssssssss
..ssssst.
..BBBBB..
@clapping-hands | clapping hands applause bravo
.Y..Y..Y..
..Y....Y..
..ss.ss...
.sss.sss..
.sssssss..
ssstssss..
ssssstss..
.sssssss..
..sssst...
@flexed-arm | strong arm muscle flex
....sss....
...sssss...
...ssssss..
....sssss..
.....sssss.
..ss.sssss.
.sssssssss.
.sssstssst.
..ssssssst.
...ttttt...
// bubbles and marks
#b-heart x=4 y=2
.R.R.
RRRRR
.RRR.
..R..
#b-scribble x=3 y=2
R.R.RR.
.R.R..R
RR.R.R.
=speech-heart | speech bubble heart love | bubble_speech b-heart
=speech-angry | speech bubble angry scribble swearing grumble | bubble_speech b-scribble
@curved-arrow | curved arrow turn back return | a=blue
..bbbbbb..
.bbbbbbbb.
.bb....bb.
.bb....bb.
.bb....bb.
bbbbbb.bb.
.bbbb..bb.
..bb...bb.
@tick-box | tick box done green check mark
GGGGGGGGGG
GGGGGGGGWG
GGGGGGGWWG
GGGGGGWWGG
GWWGGWWGGG
GGWWWWGGGG
GGGWWGGGGG
GGGGGGGGGG
@cross-box | cross box wrong red x mark
RRRRRRRRRR
RWWRRRRWWR
RRWWRRWWRR
RRRWWWWRRR
RRRWWWWRRR
RRWWRRWWRR
RWWRRRRWWR
RRRRRRRRRR
@broken-heart | broken heart sad love
.RRR..RRR.
RRIRR.RRRR
RIRR.RRRRR
RRRRR.RRRR
.RRR.RRRR.
..RRR.RR..
...R.RR...
....RR....
@sparkling-heart | sparkling heart pink love shine
W........W.
.zzz..zzz..
zzWzzzzzzz.
zzzzzzzzzz.
.zzzzzzzzW.
..zzzzzz...
W..zzzz....
....zz...W.
@heart-arrow | heart with arrow cupid love valentine
.........xx
.RRR..RRxx.
RRIRRRRxRR.
RIRRRRxRRR.
.RRRRxRRR..
..RRxRRR...
.TxRRRR....
TT..RR.....
@two-hearts | two hearts love couple
.RR.RR.....
RRRRRRR....
RRRRRMM.MM.
.RRRMMMMMMM
..RRMMMMMMM
...R.MMMMM.
......MMM..
.......M...
=heart-blue | blue heart | heart | a=blue
@glowing-star | glowing star shining bright
.....E.....
.E...E...E.
....EYE....
...EYYYE...
EEEYYYYYEEE
..EYYYYYE..
...EYYYE...
..EYYEYYE..
.EE.....EE.
@warning-triangle | warning sign danger caution
.....YY.....
....YYYY....
....YKKY....
...YYKKYY...
...YYKKYY...
..YYYKKYYY..
..YYYYYYYY..
.YYYYKKYYYY.
.YYYYYYYYYY.
@no-entry | no entry forbidden not allowed stop
...RRRRRR...
..RRWWWWRR..
.RRRWWWWWRR.
RRWRRWWWWWRR
RWWWRRWWWWWR
RWWWWRRWWWWR
RWWWWWRRWWWR
RRWWWWWRRWRR
.RRWWWWWRRR.
..RRWWWWRR..
...RRRRRR...
@music-notes | music notes song singing
....PPPPPP.
....PJPPPP.
....P....P.
....P....P.
....P....P.
..PPP..PPP.
.PJPP.PJPP.
..PP...PP..
@twinkle | twinkle sparkle four point star white
.....W.....
.....W.....
....WWW....
..WWWAWWW..
WWWWAAAWWWW
..WWWAWWW..
....WWW....
.....W.....
.....W.....
@sparkles | sparkles three stars magic glitter
....Y......
...YYY...Y.
..YYEYY.YYY
...YYY...Y.
....Y......
.Y.....Y...
YYY...YYY..
.Y.....Y...
@poof | poof smoke puff vanish cloud
..ww..www...
.wWWwwWWWw..
wWWWWWWWWWw.
wWWW...WWWWw
.wWW....WWw.
wWWW...WWWw.
wWWWWWWWWWw.
.wwWWwwWWw..
...ww..ww...
@sweat-drops | sweat drops nervous phew
....A.....
...AA.....
...AA...A.
.......AA.
.A.....AA.
AA........
AA........
@dizzy-stars | dizzy stars seeing stars spinning
....Y.......
...YYY....Y.
....Y....YYY
..........Y.
.Y...xxxx...
YYY.x....x..
.Y...xxxx...
@paw-print | paw print animal track pet
..TT..TT..
..TT..TT..
TT......TT
TT.TTTT.TT
..TTTTTT..
.TTTTTTTT.
.TTTTTTTT.
..TT..TT..
@kiss-mark | kiss mark lips lipstick
..RRR.RRR..
.RRRRRRRRR.
RRIRRRRRRRR
.ZZZZZZZZZ.
RRRRRRRRRRR
.RRRRRRRRR.
...RRRRR...
@skull-crossbones | skull and crossbones danger poison pirate
W.........W
WW.WWWWW.WW
..WWWWWWW..
..WKKWKKW..
..WKKWKKW..
...WWKWW...
...WKWKW...
WW.......WW
W.........W
@map-pin | map pin location marker place
..RRRRR..
.RRRRRRR.
RRRWWWRRR
RRRWWWRRR
RRRWWWRRR
.RRRRRRR.
..RRRRR..
...RRR...
....R....
@sound-on | sound on speaker volume loud
...x....A..
..xx..A..A.
wwxx...A.A.
wwxx.A.A.A.
wwxx...A.A.
..xx..A..A.
...x....A..
@play-button | play button start go green
..GGGGGG..
.GGGGGGGG.
GGGWGGGGGG
GGGWWWGGGG
GGGWWWWWGG
GGGWWWGGGG
GGGWGGGGGG
.GGGGGGGG.
..GGGGGG..
`);
const DIGITS = ['.WWW. W...W W..WW W.W.W WW..W W...W .WWW.', '..W.. .WW.. ..W.. ..W.. ..W.. ..W.. .WWW.', '.WWW. W...W ....W ...W. ..W.. .W... WWWWW', 'WWWW. ....W ....W .WWW. ....W ....W WWWW.', '...W. ..WW. .W.W. W..W. WWWWW ...W. ...W.',
  'WWWWW W.... WWWW. ....W ....W W...W .WWW.', '.WWW. W.... W.... WWWW. W...W W...W .WWW.', 'WWWWW ....W ...W. ..W.. ..W.. ..W.. ..W..', '.WWW. W...W W...W .WWW. W...W W...W .WWW.', '.WWW. W...W W...W .WWWW ....W ....W .WWW.'];
const DIGIT_NAMES = 'zero one two three four five six seven eight nine'.split(' ');
// each glyph drawn at double size with a grey foot, so it stays readable when small
pack(DIGITS.map((g, n) => `@number-${n} | number ${n} ${DIGIT_NAMES[n]} digit\n` + g.split(' ').map((row, j) => { const wide = [...row].map((ch) => (ch === '.' ? '..' : j > 4 ? 'ww' : 'WW')).join(''); return wide + '\n' + wide; }).join('\n')).join('\n'));
ND('shout-bubble', 'shout bubble loud yell exclamation', (c) => { burst(c, 7.5, 7.5, 7.4, ['w0', 'w0', 'w0', 'w0'], 9); c.rect(7, 4, 2, 5, 'r2').rect(7, 10, 2, 2, 'r2'); }, {}, 'shout');
ND('pow-burst', 'pow comic hit burst yellow bang', (c) => { burst(c, 7.5, 7.5, 7.4, ['r2', 'y2', 'y2', 'y3'], 11); c.stamp(4, 6, ['R.R.R.RR', 'RR.R.R.R', 'R.R.R.RR']); }, {}, 'pow');
ND('explosion-blue', 'blue magic explosion blast', (c) => burst(c, 7.5, 7.5, 7.4, ['b1', 'b2', 'b3', 'w0']), {}, 'blast-blue');

// ═════════════════════════ OLD HOUSE PACK: room tile sets, doors, furniture, eerie things ═════════════════════════
// The eerie old-house pack: complete room sets (top, wall, wall details, floor, floor
// variants), more floors and carpets, doors and stairs, and furniture for every room.
// A few extra muted colours keep it dim; they are only used from here on.
Object.assign(PAL, {
  q1: '#6e3f50', q2: '#a8707a', q3: '#c9a3a0', v1: '#3d5540', v2: '#6f8a62', v3: '#a3b396',
  u1: '#2a2f52', u2: '#4a5f85', u3: '#8fa3b8', h1: '#7d7359', h2: '#a89c7c', h3: '#d2c8a8',
  i1: '#33211c', j2: '#a88a3c', z1: '#561420',
});
for (const k of ['q1', 'q2', 'q3', 'v1', 'v2', 'v3', 'u1', 'u2', 'u3', 'h1', 'h2', 'h3', 'i1', 'j2', 'z1']) { if (KEY[PAL[k]]) throw new Error('colour clash ' + k); KEY[PAL[k]] = k; }
// stamp letters for them (lower case a-p are free in stamps; templates never see these)
//   a b c rose dark/mid/pale   d e f moss/sage/pale sage   g h i indigo/dull blue/pale blue
//   j k l khaki/cream/bone     m darkest wood   n ochre   o dried blood   p orange-brown
Object.assign(FIX, { a: 'q1', b: 'q2', c: 'q3', d: 'v1', e: 'v2', f: 'v3', g: 'u1', h: 'u2', i: 'u3', j: 'h1', k: 'h2', l: 'h3', m: 'i1', n: 'j2', o: 'z1', p: 'd2' });
Object.assign(RAMPS, { oak: ['i1', 't1', 't2'], moss: ['v1', 'v2', 'v3'], dusk: ['u1', 'u2', 'u3'], bone: ['h1', 'h2', 'h3'], rosy: ['q1', 'q2', 'q3'], wine: ['z1', 'r1', 'q2'], soot: ['k', 'g4', 'g3'], ochre: ['t1', 'h1', 'h2'], stage: ['t1', 'd2', 't3'], plum: ['u1', 'p1', 'q2'] });
const DARKER = { w0: 'g1', g1: 'g2', g2: 'g3', g3: 'g4', g4: 'k', t3: 't2', t2: 't1', t1: 'i1', i1: 'k', h3: 'h2', h2: 'h1', h1: 'g4', v3: 'v2', v2: 'v1', v1: 'g4', u3: 'u2', u2: 'u1', u1: 'k', q3: 'q2', q2: 'q1', q1: 'z1', r2: 'r1', r1: 'z1', z1: 'k', j2: 'h1', d2: 't1', s1: 'd2', c1: 'g4', c2: 'c1', n1: 'g4', b1: 'u1', p1: 'u1', o1: 't1', y3: 'h3', b3: 'u3' };
function dim(c) { each((x, y) => { const k = KEY[c.get(x, y)]; if (DARKER[k]) c.px(x, y, DARKER[k]); }); }
/** copy a painter's picture, drawn with its own fixed seed, so details share exactly the same background */
function base(c, seed, fn) { const g = sub(seed, fn); each((x, y) => c.px(x, y, KEY[g[y][x]])); }
/** repeat a small ASCII pattern (stamp letters) over the whole tile */
function pat(c, rows) { const h = rows.length, w = rows[0].length; each((x, y) => c.px(x, y, FIX[rows[y % h][x % w]])); return c; }
function blob(c, cx, cy, r, col, n = 4) { c.disc(cx, cy, r, col); for (let i = 0; i < n; i++) c.disc(cx + c.int(2 * r + 1) - r, cy + c.int(2 * r + 1) - r, r * 0.6, col); return c; }
function crackLine(c, x, y, len, col, vert = true) {
  for (let i = 0; i < len; i++) {
    if (vert) c.px(x, y + i, col); else c.px(x + i, y, col);
    const r = c.int(3);
    if (vert) x += r - 1; else y += r - 1;
    if (i === (len >> 1)) { if (vert) c.px(x + 1, y + i, col).px(x + 2, y + i - 1, col).px(x + 3, y + i - 1, col); else c.px(x + i, y + 1, col).px(x + i - 1, y + 2, col).px(x + i - 1, y + 3, col); }
  }
}
const oldBoards = (c, r = 'oak') => woodH(c, r);
function slabs(c, list, gap, body, hi, lo) { c.fill(gap); for (const [x, y, w, h] of list) { c.rect(x, y, w, h, body).h(x, y, w, hi).h(x, y + h - 1, w, lo); } }
const FLAGS = [[0, 0, 7, 5], [8, 0, 8, 7], [0, 6, 5, 5], [6, 8, 10, 4], [0, 12, 9, 4], [10, 13, 6, 3], [6, 6, 1, 1]];

// ── wall details shared by the sets: drawn over the set's own wall. o.fr: frame colours [dark, mid, light] ──
function winBase(c, o, glass, paint, after) {
  const [d, m, l] = o.fr;
  c.rect(3, 2, 10, 11, d).rect(4, 3, 8, 9, glass);
  if (paint) paint(c);
  c.v(7, 3, 9, d).v(8, 3, 9, m).h(4, 7, 8, d).h(3, 2, 10, m).v(3, 3, 10, m).h(2, 13, 12, l).h(2, 14, 12, d).h(3, 1, 10, 'k').v(2, 2, 11, 'k').v(13, 2, 11, 'k').px(1, 13, 'k').px(14, 13, 'k').px(1, 14, 'k').px(14, 14, 'k').h(2, 15, 12, 'k');
  if (after) after(c);
}
const FACE = ['.lll.', 'lllll', 'lKlKl', 'lllll', '.lKl.', '.lll.'];
const WD = {
  window: (c, o) => winBase(c, o, 'u2', (c) => c.rect(4, 9, 8, 3, 'g3').h(4, 8, 8, 'u3').v(10, 6, 5, 'k').px(9, 7, 'k').px(11, 8, 'k').px(11, 5, 'k').px(5, 4, 'u3').px(6, 4, 'u3')),
  'window-night': (c, o) => winBase(c, o, 'u1', (c) => c.rect(10, 4, 2, 2, 'h3').px(11, 4, 'u1').px(5, 5, 'u3').px(6, 10, 'u3').px(10, 9, 'u3').px(4, 9, 'u3')),
  'window-broken': (c, o) => winBase(c, o, 'u2', (c) => c.stamp(4, 3, ['........', '..K.....', '.KKK..K.', 'KKKKK...', '.KKKK...', '..KK.K..', '...K....', '........', '....KK..']).px(9, 5, 'w0').px(10, 6, 'w0').px(11, 7, 'w0').px(9, 9, 'w0').px(4, 4, 'w0').px(6, 9, 'w0'), (c) => c.px(5, 14, 'u3').px(9, 14, 'u3').px(10, 14, 'u3')),
  'window-boarded': (c, o) => winBase(c, o, 'k', null, (c) => { for (const [x, y, w] of [[2, 3, 12], [3, 7, 11], [2, 10, 12]]) c.rect(x, y, w, 2, 't1').h(x, y, w, 't2').h(x, y + 2, w, 'k').px(x + 1, y + 1, 'g1').px(x + w - 2, y, 'g1'); }),
  'window-face': (c, o) => winBase(c, o, 'u1', (c) => c.px(11, 4, 'u3').px(4, 10, 'u3'), (c) => c.stamp(5, 4, FACE)),
  'window-bars': (c, o) => winBase(c, o, 'u2', (c) => c.rect(4, 9, 8, 3, 'g3').px(5, 4, 'u3'), (c) => c.v(5, 3, 9, 'k').v(10, 3, 9, 'k')),
  'window-round': (c, o) => { c.disc(7.5, 7, 5.2, 'k').disc(7.5, 7, 4.2, 't2').disc(7.5, 7, 3.2, 'u2').v(7, 4, 7, 't1').v(8, 4, 7, 't2').h(4, 7, 8, 't1').px(10, 5, 'h3').px(5, 9, 'u3'); },
  door: (c, o) => { const [d, m, l] = o.door || ['i1', 't1', 't2']; c.rect(2, 0, 12, 16, 'k').rect(3, 1, 10, 15, o.fr[1]).v(3, 1, 15, o.fr[2]).rect(4, 2, 8, 14, m).rect(5, 3, 6, 4, d).rect(5, 9, 6, 5, d).h(5, 7, 6, l).h(5, 14, 6, l).v(4, 2, 14, l).h(6, 4, 4, m).h(6, 10, 4, m).px(10, 8, 'j2').px(10, 9, 'k'); },
  picture: (c) => ostamp(c, 3, 3, ['nnnnnnnnnn', 'nhhhhhlhhj', 'nhhhhhhhhj', 'nhhdhhhddj', 'nddddhdddj', 'nddddddddj', 'njjjjjjjjj']),
  portrait: (c) => ostamp(c, 3, 2, ['nnnnnnnnnn', 'nmmmCCCmmj', 'nmmCyyyCmj', 'nmmyKyKymj', 'nmmyyyyymj', 'nmmmyyymmj', 'nmVVVyVVVj', 'nmVVVVVVVj', 'njjjjjjjjj']),
  'portrait-scratched': (c) => { WD.portrait(c); c.stamp(5, 3, ['..K...K', '.K.K.K.', 'K.K.K..', '.K.K.K.']); },
  shelf: (c) => ostamp(c, 2, 4, ['.hh..xx.Z...', '.hh.xXXxZZk.', '.hh.xXXxZZk.', 'TTTTTTTTTTTT', '.C........C.']),
  crack: (c, o) => { crackLine(c, 6, 0, 16, o.crackc || 'k'); c.px(4, 3, o.crackc || 'k').px(3, 4, o.crackc || 'k'); },
  stain: (c, o) => { const s = o.stainc || 'g4'; blob(c, 8, 4, 3, s); c.v(5, 6, 6, s).v(8, 7, 8, s).v(11, 5, 4, s).v(9, 6, 4, s); },
  lamp: (c) => { c.px(5, 3, 'j2').px(10, 3, 'j2').px(4, 6, 'j2').px(11, 6, 'j2').px(7, 2, 'j2'); ostamp(c, 6, 4, ['.ll.', 'lEEl', 'lEEl', 'lEEl', '.xx.', 'XXXX', '.XX.']); },
  clock: (c) => ostamp(c, 4, 1, ['..CCCC..', '.CllllC.', 'CllKlllC', 'CllKlllC', 'CllKKllC', 'CllllllC', '.CllllC.', '..CCCC..', '..CmmC..', '..CnmC..', '..CmnC..', '..CCCC..']),
  mirror: (c) => ostamp(c, 4, 2, ['..nnnn..', '.niiiin.', 'niWiiiin', 'niiWiiin', 'niiiiiij', 'niiiiiij', 'niiiiWij', 'niiiiiij', '.jiiiij.', '..jjjj..']),
  'mirror-cracked': (c) => { WD.mirror(c); c.stamp(5, 3, ['...K..', '..K...', 'KKK...', '..KK..', '...KKK', '..K...', '.K....']); },
  vent: (c) => ostamp(c, 4, 5, ['XXXXXXXX', 'XKKKKKKX', 'XxxxxxxX', 'XKKKKKKX', 'XxxxxxxX', 'XKKKKKKX', 'XXXXXXXX']),
  pipe: (c) => { c.rect(9, 0, 5, 16, 'k').rect(10, 0, 3, 16, 'g2').v(10, 0, 16, 'g1').v(12, 0, 16, 'g4').rect(9, 6, 5, 3, 'g3').h(9, 6, 5, 'g2').h(8, 5, 7, 'k').h(8, 9, 7, 'k').px(8, 6, 'k').px(8, 7, 'k').px(8, 8, 'k').px(14, 6, 'k').px(14, 7, 'k').px(14, 8, 'k').px(11, 11, 'o1').px(11, 12, 'o1').px(10, 12, 'o1').px(7, 10, 'c1').px(7, 13, 'c1'); },
  hooks: (c) => ostamp(c, 2, 3, ['TTTTTTTTTTTT', 'CCCCCCCCCCCC', '.x....x....x', '.x...VVV...x', '....VVVVV...', '....VXVXV...', '....VXVXV...', '....VVVVV...', '....VV.VV...']),
  curtain: (c, o) => { const [d, m, l] = o.curt || ['z1', 'r1', 'q2']; c.rect(1, 2, 14, 13, 'k').rect(6, 3, 4, 11, 'u1').px(8, 5, 'u3'); for (const x0 of [2, 10]) for (let i = 0; i < 4; i++) c.v(x0 + i, 3, 11, [d, m, l, m][i]); c.px(5, 12, 'k').px(5, 13, 'k').px(10, 12, 'k').px(10, 13, 'k').h(1, 2, 14, 'j2').px(0, 2, 'k').px(15, 2, 'k').h(1, 1, 14, 'k'); },
  cross: (c) => ostamp(c, 5, 2, ['..TT..', '..TC..', 'TTTTTT', 'CCTCCC', '..TC..', '..TC..', '..TC..', '..TC..', '..TC..', '..CC..']),
  poster: (c) => ostamp(c, 4, 2, ['llllllll', 'lKKKKKKl', 'llllllll', 'lVVllXXl', 'lVVlllll', 'lVVlXXXl', 'llllllll', 'lXXXXXkl', 'llllllk.', 'lllllk..']),
  switch: (c) => { c.v(7, 0, 6, 'g4').v(8, 0, 6, 'g3'); ostamp(c, 6, 6, ['llll', 'lKKl', 'lxKl', 'lxxl', 'llll']); },
  cobweb: (c) => c.stamp(0, 0, ['wwwwwwwww', 'w.w..w...', 'ww.w..w..', 'w.w.w....', 'w..w.w...', 'ww..w....', 'w.w......', 'w........', 'w........']).px(5, 7, 'k').px(5, 6, 'g1'),
  candle: (c) => { c.px(7, 3, 'j2').px(5, 5, 'j2').px(10, 5, 'j2'); ostamp(c, 6, 4, ['.Y..', 'YEY.', '.l..', '.l..', '.l..', 'xxxx', '.XX.']); },
  fusebox: (c) => { c.v(7, 0, 4, 'g4').v(11, 12, 4, 'g4'); ostamp(c, 4, 4, ['XXXXXXXX', 'XxxxxxxV', 'XxKKxKKV', 'XxZKxKKV', 'XxxxxxxV', 'XxKKxnKV', 'XxKKxKKV', 'XVVVVVVV']); },
};
const DWORDS = { window: 'window glass dusk', 'window-night': 'window night moon dark', 'window-broken': 'broken window smashed glass', 'window-boarded': 'boarded up window planks nailed', 'window-face': 'window with face ghost watching', 'window-bars': 'barred window bars', 'window-round': 'round window porthole', door: 'door closed in wall', picture: 'picture painting landscape frame', portrait: 'portrait painting person frame', 'portrait-scratched': 'portrait scratched out face', lamp: 'wall lamp sconce light', 'mirror-cracked': 'cracked broken mirror', crack: 'crack cracked damage', stain: 'stain damp dirty mould', hooks: 'coat hooks rail coat', pipe: 'pipe plumbing', vent: 'vent grille air', switch: 'light switch', poster: 'poster notice paper', cobweb: 'cobweb spider web corner', candle: 'candle sconce flame', fusebox: 'fuse box electric' };
// floor variants shared by the sets
const FV = {
  worn: (c, o) => c.speck(16, o.wornc || 'h2', 3, 4, 10, 8).speck(6, o.wornc || 'h2', 5, 6, 6, 4),
  cracked: (c, o) => { crackLine(c, 5, 0, 16, o.crackc || 'k'); crackLine(c, 9, 9, 7, o.crackc || 'k', false); },
  stained: (c, o) => { blob(c, 8, 8, 3, o.stainc || 'g4'); c.px(3, 4, o.stainc || 'g4').px(12, 12, o.stainc || 'g4'); },
  dark: (c) => dim(c),
  bloody: (c) => { blob(c, 7, 8, 3, 'z1'); c.speck(5, 'r1', 5, 6, 5, 4).px(12, 4, 'z1').px(13, 11, 'z1').px(3, 13, 'z1').px(12, 3, 'z1'); },
  dusty: (c, o) => { c.speck(26, o.dustc || 'h2').speck(8, 'h3'); },
  rug: (c, o) => { const [d, m, l] = o.rug || ['z1', 'r1', 'q2']; c.rect(2, 3, 12, 10, m).rect(3, 4, 10, 8, d).rect(4, 5, 8, 6, m).rect(7, 7, 2, 2, l).px(5, 6, l).px(10, 6, l).px(5, 9, l).px(10, 9, l); for (let y = 3; y < 13; y += 2) c.px(1, y, 'h2').px(14, y, 'h2'); c.h(2, 13, 12, 'k'); },
  drain: (c) => { c.rect(4, 4, 8, 8, 'k').rect(5, 5, 6, 6, 'g3').h(5, 5, 6, 'g2'); for (let y = 6; y < 11; y += 2) c.h(6, y, 4, 'k'); c.px(4, 4, 'g4').px(11, 11, 'g4'); },
  hatch: (c) => { c.rect(2, 2, 12, 12, 'k').rect(3, 3, 10, 10, 't1'); for (let x = 3; x < 13; x += 3) c.v(x, 3, 10, 't2'); c.h(3, 5, 10, 'g3').h(3, 10, 10, 'g3').h(3, 12, 10, 'i1'); c.stamp(7, 7, ['xx', 'xK', 'xx']); },
  puddle: (c) => { blob(c, 8, 9, 3, 'u1', 5); c.h(6, 8, 3, 'u2').px(10, 10, 'u2').px(5, 10, 'u2'); },
};
const VWORDS = { worn: 'worn scuffed', cracked: 'cracked broken', stained: 'stained dirty', dark: 'dark shadow', bloody: 'bloody blood stain', dusty: 'dusty dust', rug: 'with small rug mat', drain: 'with drain grate', hatch: 'with hatch trapdoor', puddle: 'puddle water wet' };
/** One complete room set. details / variants: names of shared painters, or [name, words, painter(c, o)]. */
function roomSet(id, words, o) {
  o.fr = o.fr || ['i1', 't1', 't2'];
  T(`${id}-top`, `${words} wall top dark ceiling edge`, 'wall', (c) => { c.fill(o.top[0]).speck(12, o.top[1]); if (o.top[2]) c.speck(5, o.top[2]); });
  T(`${id}-wall`, `${words} wall plain`, 'wall', o.wall);
  for (const d of o.details) {
    const [n, w, f] = typeof d === 'string' ? [d, DWORDS[d] || d, WD[d]] : d;
    T(`${id}-wall-${n}`, `${words} wall ${w}`, 'wall', (c) => { base(c, `${id}-wall`, o.wall); f(c, o); });
  }
  T(`${id}-floor`, `${words} floor`, 'floor', o.floor);
  for (const d of o.variants) {
    const [n, w, f] = typeof d === 'string' ? [d, VWORDS[d] || d, FV[d]] : d;
    T(`${id}-floor-${n}`, `${words} floor ${w}`, 'floor', (c) => { base(c, `${id}-floor`, o.floor); f(c, o); });
  }
}
const wrap = (c) => (x, y, col) => c.px(x & 15, y & 15, col);

category('rooms', 'Rooms: old house', 'tile');
roomSet('rosepaper', 'faded rose wallpaper room', {
  top: ['i1', 'k', 't1'], fr: ['i1', 't1', 't2'], stainc: 'q2', crackc: 'q1', wornc: 't3',
  wall: (c) => { c.fill('q3'); const p = wrap(c); for (const [x, y] of [[1, 1], [9, 1], [5, 5], [13, 5], [1, 9], [9, 9], [5, 13], [13, 13]]) { p(x + 1, y, 'q2'); p(x, y + 1, 'q2'); p(x + 1, y + 1, 'q1'); p(x + 2, y + 1, 'q2'); p(x + 1, y + 2, 'q2'); p(x + 3, y + 2, 'v2'); p(x + 2, y + 3, 'v2'); } c.speck(5, 'h3'); },
  details: ['window', 'window-night', 'door', 'portrait', 'lamp', 'stain', ['peeling', 'peeling torn wallpaper plaster', (c) => { c.stamp(8, 0, ['kkkkkk.', 'jkkkkkk', '.jkkkkk', '.jkkkk.', '..jkkk.', '..jckk.', '...cck.', '...ccc.', '....cc.']).px(4, 12, 'h2').px(5, 12, 'h2').px(4, 13, 'h1'); }]],
  floor: (c) => oldBoards(c, 'brown'),
  variants: ['worn', 'dark', 'rug', 'stained'],
});
roomSet('stripepaper', 'green striped wallpaper room', {
  top: ['i1', 'k', 't1'], stainc: 'v1', crackc: 'g4', rug: ['v1', 'v2', 'j2'], wornc: 't2',
  wall: (c) => { each((x, y) => c.px(x, y, ['v1', 'v1', 'v2', 'v2', 'v2', 'v3', 'v2', 'v2'][x % 8])); for (let y = 3; y < 16; y += 8) c.px(0, y, 'j2').px(8, y + 4, 'j2'); },
  details: ['window', 'window-broken', 'door', 'picture', 'clock', 'crack', 'mirror'],
  floor: (c) => turned('t', (c2) => oldBoards(c2, 'oak'))(c, 'stripepaper-floor'),
  variants: ['worn', 'dusty', 'rug', 'cracked'],
});
roomSet('damask', 'dark blue damask wallpaper room', {
  top: ['k', 'u1', 'g4'], fr: ['k', 'i1', 't1'], stainc: 'k', crackc: 'k', rug: ['u1', 'u2', 'j2'], wornc: 't2',
  wall: (c) => each((x, y) => { const s = Math.abs((x % 8) - 3.5) + Math.abs((y % 8) - 3.5); c.px(x, y, s === 3 || s === 4 ? 'u2' : s < 1.5 ? 'u2' : (x % 8 === 7 || x % 8 === 0) && (y % 8 === 7 || y % 8 === 0) ? 'p1' : 'u1'); }),
  details: ['window-night', 'window-face', 'door', 'portrait', 'portrait-scratched', 'mirror-cracked', 'lamp'],
  floor: (c) => oldBoards(c, 'oak'),
  variants: ['dark', 'rug', 'bloody', 'dusty'],
});
roomSet('panel', 'dark wood panelling panelled room', {
  top: ['k', 'i1'], fr: ['k', 'i1', 't1'], door: ['k', 'i1', 't1'], stainc: 'k', crackc: 'k', wornc: 't3',
  wall: (c) => each((x, y) => { const a = x % 8; c.px(x, y, a === 0 || y === 0 ? 'i1' : (a === 2 && y >= 2 && y <= 13) || (y === 2 && a >= 2 && a <= 6) ? 'i1' : (a === 6 && y >= 3 && y <= 13) || (y === 13 && a >= 3 && a <= 6) ? 't2' : 't1'); }),
  details: ['window', 'door', 'portrait', 'clock', 'candle', ['trophy', 'mounted deer head antlers trophy', (c) => ostamp(c, 3, 1, ['l..l..l..l', 'l.ll..ll.l', '.ll....ll.', '..lTTTTl..', '..TKTTKT..', '..TTTTTT..', '...TTTT...', '...TKKT...', '.CCCCCCCC.', '..CCCCCC..'])], ['secret', 'secret panel door ajar hidden', (c) => { c.rect(8, 1, 7, 15, 'k').rect(9, 2, 2, 14, 'i1').v(9, 2, 14, 't1').px(13, 6, 'g4').px(12, 9, 'g4'); }]],
  floor: (c) => each((x, y) => { const q = ((x >> 3) + (y >> 3)) % 2, k = (q ? x : y) % 4, e = (q ? y : x) % 8; c.px(x, y, k === 3 || e === 7 ? 'i1' : k === 0 ? 't2' : 't1'); }),
  variants: ['worn', 'dark', 'rug', 'hatch'],
});
roomSet('crackplaster', 'cracked plaster room', {
  top: ['g4', 'k', 'g3'], fr: ['i1', 't1', 't2'], stainc: 'h1', crackc: 'g4', wornc: 'h1', dustc: 'h2',
  wall: (c) => { c.fill('h2').speck(14, 'h1').speck(8, 'h3'); for (const [x, y] of [[2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [11, 10], [12, 11], [12, 12], [13, 13], [10, 9], [14, 1], [15, 2]]) c.px(x, y, 'h1'); },
  details: ['window-broken', 'window-boarded', 'door', 'crack', 'stain', 'switch', ['lath', 'hole broken plaster laths', (c) => { blob(c, 8, 7, 3, 'k', 5); for (let y = 5; y < 11; y += 2) for (let x = 4; x < 13; x++) if (c.get(x, y) === PAL.k) c.px(x, y, 't1'); c.px(4, 12, 'h3').px(6, 13, 'h3').px(10, 13, 'h3').px(11, 12, 'h1'); }]],
  floor: (c) => oldBoards(c, 'ochre'),
  variants: ['dusty', 'cracked', 'dark', 'stained'],
});
roomSet('nursery', 'pale peeling nursery wallpaper room', {
  top: ['g4', 'k', 'g3'], fr: ['h1', 'h2', 'h3'], door: ['h1', 'h2', 'h3'], stainc: 'h1', crackc: 'g3', rug: ['u2', 'u3', 'h3'], wornc: 'h3',
  wall: (c) => { c.fill('h3'); for (const [x, y] of [[2, 2], [10, 2], [6, 10], [14, 10]]) c.px(x, y, 'q2').px((x + 15) & 15, y, 'q3').px((x + 1) & 15, y, 'q3').px(x, y - 1, 'q3').px(x, y + 1, 'q3'); for (const [x, y] of [[6, 4], [14, 4], [2, 12], [10, 12]]) c.px(x, y, 'u3').px(x + 1, y, 'u3').px(x, y + 1, 'u2'); for (const [x, y] of [[0, 7], [8, 15], [4, 7], [12, 15]]) c.px(x, y, 'v3'); c.stamp(11, 6, ['.kk.', 'kkkj', '.kj.']).stamp(2, 6, ['kk', 'kj']); },
  details: ['window', 'window-night', 'door', 'crack', ['picture', 'picture animal lamb child frame', (c) => ostamp(c, 4, 3, ['llllllll', 'liiiiiil', 'liiWWiil', 'liWWWWKl', 'lfWfWfll', 'lfffffll', 'llllllll'])], ['handprints', 'small handprints hands child marks', (c) => { for (const [x, y] of [[3, 8], [9, 5]]) c.stamp(x, y, ['a.a.a', 'a.a.a', 'aaaa.', '.aaaa', '.aaa.']); }], ['scribble', 'crayon scribble drawing child scrawl', (c) => c.stamp(3, 5, ['..Z..Z....', '.Z.ZZ.Z...', '.Z....Z.hh', '..ZZZZ.h.h', '..Z..Z.hhh', '.Z....Z...', '....K.K...', '...K.K.K..'])]],
  floor: (c) => oldBoards(c, 'bone'),
  variants: ['worn', 'rug', 'dark', ['blocks', 'toy blocks scattered', (c) => { ostamp(c, 3, 4, ['aa', 'ab']); ostamp(c, 9, 9, ['hh', 'hi']); ostamp(c, 11, 3, ['ee', 'ef']); }]],
});
roomSet('bathroom', 'bathroom white tiles', {
  top: ['g4', 'k', 'g3'], fr: ['g3', 'g2', 'g1'], door: ['h1', 'h2', 'h3'], stainc: 'v2', crackc: 'g4', wornc: 'g2',
  wall: (c) => { each((x, y) => c.px(x, y, x % 4 === 3 || y % 4 === 3 ? 'g2' : x % 4 === 0 && y % 4 === 0 ? 'w0' : 'g1')); c.px(5, 6, 'u3').px(13, 2, 'u3').px(10, 13, 'u3'); },
  details: ['window', 'door', 'mirror', 'mirror-cracked', 'stain', 'pipe', ['towel', 'towel rail hanging towel', (c) => ostamp(c, 3, 4, ['xxxxxxxxxx', '..iiiiii..', '..iiiiii..', '..iWWWWi..', '..iiiiii..', '..iiiiii..', '..hhhhhh..'])], ['cabinet', 'medicine cabinet mirror cupboard', (c) => ostamp(c, 3, 3, ['wwwwwwwwww', 'wiiiiXiiiw', 'wiWiiXiiiw', 'wiiWiXiiix', 'wiiiiXiWix', 'wiiiixxiix', 'wxxxxxxxxx'])]],
  floor: (c) => each((x, y) => c.px(x, y, ((x >> 1) + (y >> 1)) % 2 ? 'u3' : 'g3')),
  variants: ['drain', 'stained', 'bloody', 'puddle', 'cracked'],
});
const BOOKC = ['q1', 'u2', 'v1', 'h1', 'z1', 't2', 'u1', 'v2', 'g3', 'j2', 't1', 'q2'];
const books = (c, gaps) => {
  c.fill('k');
  for (let s = 0; s < 3; s++) {
    const y = s * 5 + (s === 2 ? 0 : 0), hgt = s === 2 ? 5 : 4;
    for (let x = 1; x < 16; x++) { const k = (x * 7 + s * 5 + (x >> 2)) % BOOKC.length, h = hgt - ((x * 3 + s) % 5 === 0 ? 1 : 0); c.v(x, y + hgt - h, h, BOOKC[k]); if ((x + s * 2) % 5 === 1) c.px(x, y + hgt - 2, 'h3'); if ((x + s) % 7 === 3) c.px(x, y + hgt - h, 'h2'); }
    c.h(0, y + hgt, 16, 't2');
  }
  c.v(0, 0, 16, 't1').h(0, 15, 16, 'i1');
};
roomSet('library', 'library walls of books bookshelf', {
  top: ['k', 'i1'], fr: ['k', 'i1', 't1'], door: ['k', 'i1', 't1'], wornc: 't3',
  wall: (c) => books(c),
  details: ['window-night', 'door', 'lamp',
    ['gap', 'missing books gap leaning book', (c) => { c.rect(5, 5, 6, 4, 'k').rect(9, 6, 1, 3, 'q1').px(8, 8, 'q1').px(8, 7, 'q1').px(7, 8, 'q1').px(5, 8, 'h2').px(6, 8, 'h2'); }],
    ['skull', 'skull on shelf books', (c) => { c.rect(4, 5, 8, 4, 'k'); c.stamp(6, 5, ['.ll.', 'llll', 'KlKl', '.ll.']); }],
    ['ladder', 'library ladder leaning', (c) => { for (let y = 0; y < 16; y++) { const x = 4 + (y >> 2); c.px(x, y, 't3').px(x + 5, y, 't3').px(x - 1, y, 'k').px(x + 6, y, 'k'); if (y % 3 === 1) c.h(x + 1, y, 4, 't2'); } }],
    ['secret', 'secret bookcase door ajar passage', (c) => { c.rect(10, 0, 6, 16, 'k').v(10, 0, 16, 't2').v(11, 0, 16, 't1').px(13, 5, 'g4').px(14, 10, 'g4').px(13, 12, 'g4'); }]],
  floor: (c) => oldBoards(c, 'oak'),
  variants: ['rug', 'dark', 'dusty', ['books', 'fallen books scattered pile', (c) => { ostamp(c, 2, 4, ['aaaa', 'alla', 'aaaa']); ostamp(c, 8, 8, ['.hhhh', 'hhhhl', 'dddd.', 'ddddl']); ostamp(c, 10, 2, ['ll.ll', 'lXKXl', 'll.ll']); }]],
});
roomSet('study', 'dark green study room', {
  top: ['k', 'i1'], fr: ['k', 'i1', 't1'], stainc: 'g4', crackc: 'k', rug: ['z1', 'r1', 'j2'], wornc: 't3',
  wall: (c) => { c.fill('v1'); each((x, y) => { if (x % 8 === 3) c.px(x, y, 'g4'); if (x % 8 === 7 && y % 4 === 1) c.px(x, y, 'j2'); }); },
  details: ['window', 'door', 'portrait', 'picture', 'clock', 'lamp',
    ['map', 'old map chart pinned', (c) => ostamp(c, 2, 3, ['llllllllllll', 'lkkllllkkkll', 'lkkklllkkkkl', 'llkklllllkkl', 'llkllZllkkll', 'lllllllkklll', 'llllllllllll'])],
    ['safe', 'wall safe hidden strongbox', (c) => ostamp(c, 4, 4, ['XXXXXXXX', 'XxxxxxxV', 'XxxKKxxV', 'XxKwwKnV', 'XxxKKxxV', 'XxxxxxxV', 'XVVVVVVV'])]],
  floor: (c) => each((x, y) => { const d = (x + y) % 8, e = (x - y + 16) % 8, q = (x >> 2) % 2; c.px(x, y, (q ? d : e) === 0 ? 'i1' : x % 4 === 0 ? 'i1' : (q ? d : e) < 4 ? 't1' : 't2'); }),
  variants: ['rug', 'dark', 'worn', ['papers', 'scattered papers pages', (c) => { ostamp(c, 2, 3, ['.lll', 'lXXl', 'llll', 'lXl.']); ostamp(c, 9, 8, ['lll.', 'lXll', 'lXXl', '.lll']); ostamp(c, 9, 2, ['ll', 'lX', 'll']); }]],
});
roomSet('scullery', 'old kitchen scullery cream tiles', {
  top: ['g4', 'k', 'g3'], fr: ['h1', 'h2', 'h3'], door: ['v1', 'v2', 'v3'], stainc: 'h1', crackc: 'g4', wornc: 'h3',
  wall: (c) => { each((x, y) => c.px(x, y, y % 8 === 7 ? 'h1' : (x + (y >> 3) * 4) % 8 === 7 ? 'h1' : y % 8 === 0 ? 'h3' : 'h2')); c.px(3, 4, 'h1').px(12, 11, 'h1').px(9, 3, 'h3'); },
  details: ['window', 'door', 'clock', 'stain', 'crack',
    ['pots', 'hanging pots pans rail', (c) => ostamp(c, 1, 2, ['XXXXXXXXXXXXXX', '.x....x.....x.', '.x....x.....x.', 'VVV..DDDD..xxx', 'VVV.DDFDDD.xxx', 'VVV.DDDDDD.xxx', '.V...DDDD...x.'])],
    ['shelf', 'shelf jars preserves tins', (c) => ostamp(c, 2, 3, ['.ll..kk..ll.', '.Zo.dddd.no.', '.Zo.deed.no.', '.Zo.dddd.no.', 'TTTTTTTTTTTT', '.C........C.'])],
    ['knives', 'knife rack knives cleaver', (c) => ostamp(c, 2, 4, ['CCCCCCCCCCCC', '.m..m..m.mm.', '.w..w..w.ww.', '.w..w..w.ww.', '.w..w....ww.', '.w.......w..'])]],
  floor: (c) => each((x, y) => c.px(x, y, x % 8 === 7 || y % 8 === 7 ? 'g4' : ((x >> 3) + (y >> 3)) % 2 ? 'd2' : 't1')),
  variants: ['worn', 'stained', 'bloody', 'drain'],
});

category('rooms2', 'Rooms: attic, cellar & yard', 'tile');
roomSet('attic', 'attic bare boards rafters', {
  top: ['k', 'i1'], fr: ['k', 'i1', 't1'], stainc: 'k', crackc: 'y3', dustc: 'h1', wornc: 't3',
  wall: (c) => { each((x, y) => c.px(x, y, x % 4 === 3 ? 'k' : (x * 7 + y * 3) % 11 === 0 ? 't1' : 'i1')); c.rect(0, 0, 16, 3, 't1').h(0, 0, 16, 't2').h(0, 3, 16, 'k'); for (let x = 2; x < 16; x += 8) c.px(x, 1, 'k'); },
  details: ['window-round', 'cobweb', 'hooks', 'stain',
    ['bulb', 'bare light bulb hanging wire', (c) => { c.v(7, 0, 6, 'k'); c.px(5, 6, 'j2').px(10, 8, 'j2').px(5, 10, 'j2').px(8, 11, 'j2'); ostamp(c, 7, 6, ['xx', 'EE', 'EY', 'EE']); }],
    ['gap', 'gap in boards light shining through', (c) => { c.v(7, 4, 12, 'y3').v(6, 7, 5, 'j2').px(8, 9, 'j2').px(8, 10, 'j2'); }],
    ['brace', 'rafter beam diagonal brace', (c) => { for (let i = 0; i < 16; i++) c.px(i, 15 - i, 't2').px(i, 16 - i, 't1').px(i, 17 - i, 't1').px(i, 18 - i, 'k'); }]],
  floor: (c) => { oldBoards(c, 'ochre'); dim(c); for (let y = 1; y < 16; y += 4) c.px((y * 5) % 16, y, 'k').px((y * 5 + 9) % 16, y + 1, 'k'); },
  variants: ['dusty', 'hatch', 'dark', ['hole', 'hole broken boards', (c) => { blob(c, 8, 8, 3, 'k', 3); c.px(4, 7, 't3').px(12, 9, 't3').px(8, 4, 't3').px(7, 12, 't3'); }]],
});
roomSet('cabin', 'log cabin walls plank floor', {
  top: ['i1', 'k', 't1'], fr: ['i1', 't1', 't2'], door: ['i1', 't1', 'd2'], stainc: 'i1', crackc: 'k', rug: ['t1', 'h1', 'h3'], wornc: 't3',
  wall: (c) => { each((x, y) => c.px(x, y, ['d2', 't2', 't1', 'i1'][y % 4])); for (let y = 0; y < 16; y += 4) { const x = (y * 5 + 3) % 16; c.px(x, y + 1, 't1').px((x + 1) & 15, y + 1, 't1').px((x + 7) & 15, y + 2, 'i1').px((x + 11) & 15, y, 't2'); } },
  details: ['window', 'window-night', 'door', 'hooks', 'shelf',
    ['antlers', 'antlers mounted skull trophy', (c) => ostamp(c, 3, 3, ['l..l..l..l', 'l.ll..ll.l', '.ll....ll.', '..llllll..', '...lKKl...', '...llll...', '....ll....'])],
    ['lantern', 'oil lantern hanging lamp', (c) => { c.px(4, 6, 'j2').px(11, 6, 'j2').px(5, 10, 'j2').px(10, 10, 'j2'); ostamp(c, 6, 2, ['.XX.', '.X..', 'XXXX', 'XEEX', 'XYEX', 'XEEX', 'XXXX']); }],
    ['rifle', 'rifle gun rack hunting', (c) => ostamp(c, 1, 5, ['.X...........X', 'XXXXXXXXXXTTTT', '.X......X.TTTC', '.X...........X'])]],
  floor: (c) => turned('t', (c2) => oldBoards(c2, 'brown'))(c, 'cabin-floor'),
  variants: ['worn', 'rug', 'hatch', 'bloody'],
});
roomSet('basement', 'basement concrete damp', {
  top: ['k', 'g4'], fr: ['k', 'g4', 'g3'], door: ['g4', 'g3', 'g2'], stainc: 'g4', crackc: 'k', wornc: 'g3',
  wall: (c) => { c.fill('g3').speck(16, 'g4').speck(6, 'g2'); for (let x = 0; x < 16; x += 2) c.px(x, 7, 'g4').px(x + 1, 15, 'g4'); c.px(3, 3, 'k').px(11, 11, 'k').px(11, 3, 'k').px(3, 11, 'k'); },
  details: ['pipe', 'stain', 'crack', 'vent', 'fusebox', 'door', 'window-bars',
    ['mould', 'black mould damp patch', (c) => { blob(c, 5, 11, 3, 'v1', 5); c.speck(8, 'k', 2, 8, 8, 7).speck(5, 'v2', 2, 8, 8, 7); }]],
  floor: (c) => { c.fill('g4').speck(18, 'g3').speck(8, 'k'); c.px(4, 5, 'u1').px(5, 5, 'u1').px(11, 12, 'u1'); },
  variants: ['puddle', 'drain', 'cracked', 'bloody', 'stained'],
});
roomSet('cellar', 'cellar brick walls dirt floor', {
  top: ['k', 'i1'], fr: ['k', 'i1', 't1'], stainc: 'k', crackc: 'k', wornc: 't2',
  wall: (c) => { each((x, y) => { const off = (y >> 2) % 2 ? 4 : 0, bx = (x + off) % 8; c.px(x, y, y % 4 === 3 || bx === 7 ? 'i1' : y % 4 === 0 ? 'r1' : ((x + off) >> 3) % 2 === (y >> 2) % 3 ? 'r1' : 'z1'); }); c.speck(6, 't1'); },
  details: ['crack', 'stain', 'pipe', 'candle', 'door', 'cobweb',
    ['arch', 'bricked up arch doorway sealed', (c) => { c.rect(3, 3, 10, 13, 'k').rect(4, 4, 8, 12, 'g3'); for (let y = 4; y < 16; y++) for (let x = 4; x < 12; x++) if (y % 3 === 0 || (x + (y / 3 | 0) * 2) % 4 === 0) c.px(x, y, 'g4'); c.px(3, 3, 'r1').px(12, 3, 'r1'); }],
    ['chains', 'chains shackles manacles hanging', (c) => { for (const x of [4, 11]) { ostamp(c, x, 1, ['X', 'x', 'X', 'x', 'X', 'x', 'X']); ostamp(c, x - 1, 9, ['xxx', 'x.x', 'xxx']); } }]],
  floor: (c) => { c.fill('t1').speck(20, 'i1').speck(10, 't2').speck(3, 'g3'); },
  variants: ['puddle', 'dark', 'hatch', ['mound', 'disturbed earth mound dug', (c) => { blob(c, 8, 8, 4, 't2', 3); c.speck(10, 't1', 4, 5, 8, 7).speck(5, 't3', 5, 5, 6, 4); }], ['bones', 'bones in the dirt', (c) => { c.stamp(3, 5, ['l.....l', '.lllll.', 'l.....l']).stamp(8, 10, ['.ll.', 'lKlK', '.ll.']); }]],
});
roomSet('barn', 'barn rough planks straw', {
  top: ['i1', 'k', 't1'], fr: ['i1', 't1', 't2'], door: ['i1', 't1', 'd2'], stainc: 'i1', crackc: 'y3',
  wall: (c) => { const w = [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0]; each((x, y) => c.px(x, y, x === 3 || x === 7 || x === 10 || x === 13 ? 'k' : w[x] ? 't1' : 't2')); for (const [x, y] of [[1, 4], [5, 11], [9, 2], [14, 8], [11, 13]]) c.px(x, y, 'i1').px(x, y + 1, 'i1'); c.px(0, 9, 't3').px(8, 6, 't3').px(15, 2, 't3'); },
  details: ['window', 'door', 'cobweb',
    ['tools', 'tools hanging scythe pitchfork', (c) => { ostamp(c, 2, 2, ['.xxxx', 'x...T', '....T', '....T', '....T', '....T', '....T', '....T', '....T', '....T', '....T']); ostamp(c, 9, 2, ['x.x.x', 'x.x.x', 'xxxxx', '..T..', '..T..', '..T..', '..T..', '..T..', '..T..', '..T..', '..T..']); }],
    ['lantern', 'oil lantern hanging lamp', (c) => { c.px(4, 6, 'j2').px(11, 6, 'j2').px(5, 10, 'j2').px(10, 10, 'j2'); ostamp(c, 6, 2, ['.XX.', '.X..', 'XXXX', 'XEEX', 'XYEX', 'XEEX', 'XXXX']); }],
    ['harness', 'horse harness collar tack', (c) => ostamp(c, 4, 2, ['..x.....', '.CCCCCC.', 'CC....CC', 'C......C', 'C......C', 'CC....CC', '.CCCCCC.', '..C..C..', '..C..C..', '..x..x..'])],
    ['gap', 'gap in planks light through', (c) => { c.v(7, 2, 12, 'y3').px(6, 6, 'j2').px(8, 9, 'j2').v(10, 9, 5, 'j2'); }]],
  floor: (c) => { c.fill('t1'); for (let i = 0; i < 26; i++) { const x = c.int(16), y = c.int(16), d = c.int(2) ? 1 : -1, col = i % 3 ? 'j2' : 'h2'; c.px(x, y, col).px((x + 1) & 15, (y + d) & 15, col).px((x + 2) & 15, (y + d) & 15, col); } c.speck(8, 'i1'); },
  variants: ['dark', 'bloody', 'hatch', ['bare', 'bare earth less straw', (c) => { blob(c, 8, 8, 5, 't1', 4); c.speck(8, 'i1', 3, 3, 10, 10); }]],
});
roomSet('greenhouse', 'greenhouse glass panes stone path', {
  top: ['g4', 'k', 'g3'], fr: ['g3', 'h2', 'h3'], door: ['g3', 'h2', 'h3'], stainc: 'v1', crackc: 'w0',
  wall: (c) => { c.fill('c1'); each((x, y) => { if ((x + y) % 8 === 2 && x % 8 > 1 && x % 8 < 6) c.px(x, y, 'u2'); }); blob(c, 12, 12, 2, 'v1', 3); blob(c, 3, 13, 1, 'v1', 2); c.px(12, 10, 'v2').px(4, 12, 'v2'); each((x, y) => { if (x % 8 === 0 || y % 8 === 0) c.px(x, y, 'h2'); else if (x % 8 === 1 || y % 8 === 1) c.px(x, y, 'g4'); }); },
  details: ['door', 'hooks',
    ['broken', 'broken pane smashed glass', (c) => { c.stamp(2, 2, ['..K...', '.KKK.w', 'KKKKK.', '.KKKK.', '..K.K.', 'w.....']); c.px(9, 15, 'u3').px(4, 9, 'k').px(5, 10, 'k'); }],
    ['vine', 'ivy vine creeping leaves', (c) => { let x = 4; for (let y = 15; y >= 0; y--) { c.px(x, y, 'v1'); if (y % 3 === 0) c.px(x + 1, y, 'v2').px(x + 2, y - 1, 'v2'); if (y % 3 === 1) c.px(x - 1, y, 'v2').px(x - 2, y, 'n1'); x += [1, 0, 1, 0, -1, 1, 0, 1][y % 8]; } }],
    ['handprint', 'handprint on fogged glass condensation', (c) => { c.rect(2, 2, 6, 6, 'u3').rect(10, 2, 5, 6, 'u3').rect(2, 10, 6, 5, 'u3'); c.stamp(3, 2, ['c.c.c', 'c.c.c', 'c1c1c', '.111c', '.111.']).v(11, 3, 5, 'c1').v(13, 2, 3, 'c1'); }],
    ['shelf', 'shelf flower pots dead plants', (c) => ostamp(c, 1, 5, ['.d....e...j...', 'd.d..e.e..j...', 'DDD..DDD..DDD.', '.D....D....D..', 'TTTTTTTTTTTTTT', '.C..........C.'])]],
  floor: (c) => { slabs(c, FLAGS, 'v1', 'g2', 'g1', 'g3'); c.px(7, 5, 'v2').px(5, 11, 'v2').px(9, 12, 'v2'); },
  variants: ['cracked', 'puddle', 'dark',
    ['weeds', 'weeds overgrown moss', (c) => { c.speck(14, 'v2').speck(8, 'v1'); c.stamp(4, 6, ['e.e', '.e.', 'ede']).stamp(10, 10, ['.e.', 'ede']); }],
    ['soil', 'spilled soil broken pot', (c) => { blob(c, 8, 9, 3, 't1', 4); ostamp(c, 4, 4, ['DD.', 'DDD', '.DD']); c.px(9, 8, 'v2').px(10, 7, 'v2'); }]],
});

category('rooms3', 'Rooms: institutions', 'tile');
roomSet('hotel', 'hotel corridor wallpaper carpet', {
  top: ['i1', 'k', 't1'], fr: ['i1', 't1', 't2'], door: ['i1', 't1', 'd2'], stainc: 'z1', crackc: 'k', curt: ['u1', 'u2', 'u3'],
  wall: (c) => { c.fill('q1'); each((x, y) => { if (x % 8 === 0) c.px(x, y, 'z1'); }); for (const [x, y] of [[4, 2], [12, 6], [4, 10], [12, 14]]) c.px(x, y, 'j2').px(x - 1, (y + 1) & 15, 'j2').px(x + 1, (y + 1) & 15, 'j2').px(x, (y + 2) & 15, 'h1'); },
  details: ['lamp', 'picture', 'mirror', 'stain', 'window-night',
    ['door', 'hotel room door number', (c, o) => { WD.door(c, o); c.rect(7, 4, 2, 2, 'j2').px(7, 5, 'k'); }],
    ['door-ajar', 'hotel room door ajar open dark', (c, o) => { c.rect(2, 0, 12, 16, 'k').v(3, 1, 15, 't2').v(12, 1, 15, 't1').rect(4, 2, 3, 14, 't1').v(4, 2, 14, 't2').px(6, 8, 'j2'); }],
    ['lift', 'lift elevator doors brass', (c) => { c.rect(2, 1, 12, 15, 'k').rect(3, 2, 5, 14, 'h1').rect(8, 2, 5, 14, 'h1').v(3, 2, 14, 'j2').v(8, 2, 14, 'j2').v(7, 2, 14, 'g4').rect(6, 0, 4, 1, 'j2').px(14, 8, 'j2').px(14, 9, 'k'); for (let y = 4; y < 16; y += 4) c.h(4, y, 3, 'j2').h(9, y, 3, 'j2'); }]],
  floor: (c) => pat(c, ['oooZZooo', 'ooZppZoo', 'oZpmmpZo', 'ZpmoompZ', 'ZpmoompZ', 'oZpmmpZo', 'ooZppZoo', 'oooZZooo']),
  variants: ['worn', 'dark', 'bloody', 'stained'],
  wornc: 'q1',
});
roomSet('theatre', 'theatre red curtain stage', {
  top: ['k', 'z1'], fr: ['k', 'i1', 't1'], door: ['k', 'i1', 't1'], stainc: 'k', crackc: 'k', wornc: 't3',
  wall: (c) => { each((x, y) => c.px(x, y, ['k', 'z1', 'r1', 'r1', 'q2', 'r1', 'z1', 'z1'][x % 8])); for (let x = 4; x < 16; x += 8) c.px(x, 5, 'r1').px(x, 13, 'r1').px(x - 2, 9, 'z1').px(x + 1, 2, 'z1'); },
  details: ['poster', 'door',
    ['gap', 'curtain parted gap backstage dark', (c) => { c.rect(5, 0, 6, 16, 'k'); for (let y = 0; y < 16; y++) { const w = y < 6 ? 0 : y < 11 ? 1 : 2; c.rect(5, y, 2 - Math.min(2, w), 1, 'r1').rect(9 + Math.min(2, w), y, 2 - Math.min(2, w), 1, 'r1'); } c.px(8, 7, 'h3').px(8, 8, 'k'); }],
    ['masks', 'theatre masks comedy tragedy', (c) => { ostamp(c, 2, 3, ['lllll', 'lKlKl', 'lllll', 'lKKKl', '.lKl.', '.lll.']); ostamp(c, 9, 6, ['kkkkk', 'kKkKk', 'kkkkk', 'kkKkk', '.KkK.', '.kkk.']); }],
    ['rope', 'ropes sandbag rigging', (c) => { c.v(4, 0, 16, 'h2').v(5, 0, 16, 'h1').v(10, 0, 9, 'h2'); ostamp(c, 9, 9, ['.k.', 'kkk', 'kjk', 'kkk', '.j.']); }],
    ['tassel', 'gold tassel tie back cord', (c) => { for (let i = 0; i < 6; i++) c.px(3 + i, 4 + (i > 2 ? 5 - i : i), 'j2').px(12 - i, 4 + (i > 2 ? 5 - i : i), 'j2'); ostamp(c, 7, 6, ['nn', 'nn', 'jn', 'nj', 'jn']); }],
    ['lights', 'dressing room mirror bulbs', (c) => ostamp(c, 2, 2, ['EnEnEnEnEnEn', 'niiiiiiiiiiE', 'EiWiiiiiiiin', 'niiWiiiiiiiE', 'EiiiiiiiWiin', 'niiiiiiiiiiE', 'EnEnEnEnEnEn'])]],
  floor: (c) => oldBoards(c, 'stage'),
  variants: ['worn', 'hatch', 'dark', ['mark', 'stage mark cross tape', (c) => { for (let i = 0; i < 5; i++) c.px(6 + i, 6 + i, 'h3').px(10 - i, 6 + i, 'h3'); }], ['spot', 'spotlight pool of light', (c) => { each((x, y) => { const d = Math.hypot(x - 7.5, y - 7.5); if (d < 6 && (d < 5 || (x + y) % 2)) { const k = KEY[c.get(x, y)]; c.px(x, y, k === 'd2' ? 't3' : k === 't3' ? 'h3' : k === 't1' ? 't2' : k); } }); }]],
});
roomSet('chapel', 'chapel stone walls flagstones', {
  top: ['k', 'g4'], fr: ['k', 'g4', 'g3'], door: ['k', 'i1', 't1'], stainc: 'g4', crackc: 'k', rug: ['z1', 'r1', 'j2'], wornc: 'g2',
  wall: (c) => { each((x, y) => { const off = (y >> 2) % 2 ? 4 : 0, bx = (x + off) % 8; c.px(x, y, y % 4 === 3 || bx === 7 ? 'g4' : y % 4 === 0 ? 'g2' : 'g3'); }); c.speck(5, 'g4').px(2, 6, 'v1').px(13, 13, 'v1'); },
  details: ['cross', 'candle', 'crack',
    ['window', 'stained glass window arch', (c) => { c.rect(4, 2, 8, 13, 'k').h(5, 1, 6, 'k').rect(5, 3, 6, 11, 'u2').h(6, 2, 4, 'u2'); c.stamp(5, 3, ['aahhaa', 'ahnnha', 'hhnnhh', 'ddhhdd', 'dhaahd', 'hhaahh', 'aahhdd', 'ahddha', 'hhddhh', 'ddhhaa', 'dahhad']); c.v(7, 2, 12, 'k').h(5, 6, 6, 'k').h(5, 10, 6, 'k').px(8, 2, 'k'); }],
    ['door', 'arched church door iron studs', (c) => { c.rect(3, 2, 10, 14, 'k').h(4, 1, 8, 'k').rect(4, 3, 8, 13, 't1').h(5, 2, 6, 't1').v(7, 2, 14, 'i1').v(4, 3, 13, 't2'); for (let y = 5; y < 16; y += 4) c.h(4, y, 8, 'g4').px(5, y, 'g2').px(10, y, 'g2'); c.px(9, 9, 'j2'); }],
    ['plaque', 'memorial plaque inscription stone', (c) => ostamp(c, 3, 4, ['wwwwwwwwww', 'wxXXxXXXxX', 'wxxxxxxxxX', 'wxXXXXxXxX', 'wxxxxxxxxX', 'wxXXxXXxxX', 'XXXXXXXXXX'])],
    ['niche', 'niche alcove statue saint', (c) => { c.rect(4, 3, 8, 12, 'k').h(5, 2, 6, 'k'); c.stamp(6, 5, ['.ww.', '.ww.', 'xwwx', 'xwwx', '.ww.', '.ww.', '.xx.', 'xxxx', 'XXXX']); }]],
  floor: (c) => slabs(c, FLAGS, 'k', 'g3', 'g2', 'g4'),
  variants: ['cracked', 'rug', 'bloody', 'dark', ['grave', 'grave slab tomb inscription cross', (c) => { c.rect(2, 1, 12, 14, 'k').rect(3, 2, 10, 12, 'g2').h(3, 2, 10, 'g1').v(12, 3, 11, 'g3'); c.stamp(6, 4, ['.X.', 'XXX', '.X.', '.X.']).h(5, 10, 6, 'g3').h(6, 12, 4, 'g3'); }]],
});
roomSet('lab', 'laboratory metal walls grated floor', {
  top: ['k', 'g4'], fr: ['k', 'g4', 'g2'], door: ['g4', 'g3', 'g2'], stainc: 't2', crackc: 'k',
  wall: (c) => { each((x, y) => c.px(x, y, x % 8 === 0 || y % 8 === 0 ? 'g4' : x % 8 === 1 || y % 8 === 1 ? 'g2' : 'g3')); for (const [x, y] of [[2, 2], [6, 2], [2, 6], [6, 6]]) c.px(x, y, 'g1').px(x + 8, y, 'g1').px(x, y + 8, 'g1').px(x + 8, y + 8, 'g1'); },
  details: ['vent', 'pipe', 'stain', 'window-bars',
    ['door', 'iron door porthole bulkhead', (c) => { c.rect(2, 0, 12, 16, 'k').rect(3, 1, 10, 15, 'g3').v(3, 1, 15, 'g2').v(12, 1, 15, 'g4').rect(6, 3, 4, 4, 'k').rect(7, 4, 2, 2, 'c1').px(7, 4, 'c2'); for (const y of [2, 8, 14]) c.px(4, y, 'g1').px(11, y, 'g1'); c.rect(9, 9, 2, 3, 'g1').px(10, 11, 'k').h(4, 12, 4, 'j2').h(4, 13, 4, 'k'); }],
    ['screen', 'monitor screen green readout', (c) => ostamp(c, 3, 3, ['XXXXXXXXXX', 'XKKKKKKKKV', 'XK2K22K2KV', 'XKKKKKKKKV', 'XK222K22KV', 'XKKKK2KKKV', 'XK2KKKKKKV', 'XVVVVVVVVV', '.X.Z.n.xX.'])],
    ['gauges', 'gauges dials pressure meters', (c) => { for (const [x, y, n] of [[2, 3, 'Z'], [9, 3, 'K'], [5, 9, 'K']]) ostamp(c, x, y, ['.xx.', 'xllx', 'xl' + n + 'x', '.xx.']); c.h(6, 5, 3, 'g4').v(7, 7, 2, 'g4'); }],
    ['lever', 'big lever switch power', (c) => { ostamp(c, 5, 3, ['XXXXXX', 'XKKKKV', 'XKKKKV', 'XKKKKV', 'XKKKKV', 'XKKKKV', 'XKKKKV', 'XVVVVV']); ostamp(c, 7, 2, ['ZZ', 'ZZ', 'xx', 'xx', 'xx']); c.px(6, 12, 'n2').px(9, 12, 'r1'); }]],
  floor: (c) => each((x, y) => c.px(x, y, x % 4 < 2 && y % 4 < 2 ? 'k' : y % 4 === 2 || x % 4 === 2 ? 'g3' : 'g4')),
  variants: ['dark', 'bloody', 'hatch',
    ['plate', 'metal floor plate rivets', (c) => { c.rect(0, 0, 16, 16, 'g3').h(0, 0, 16, 'g2').v(0, 0, 16, 'g2').h(0, 15, 16, 'g4').v(15, 0, 16, 'g4'); for (const [x, y] of [[2, 2], [13, 2], [2, 13], [13, 13]]) c.px(x, y, 'g1').px(x, y + 1, 'g4'); for (let i = 4; i < 12; i += 2) c.px(i, i, 'g2').px(i + 1, i, 'g4').px(15 - i, i, 'g2'); }],
    ['spill', 'chemical spill green slime', (c) => { blob(c, 8, 8, 3, 'n1', 4); c.px(7, 7, 'n2').px(8, 7, 'n2').px(9, 9, 'n3').px(12, 12, 'n1'); }]],
});
roomSet('asylum', 'asylum padded cell walls checker floor', {
  top: ['g4', 'k', 'g3'], fr: ['g4', 'g3', 'g2'], door: ['g4', 'g3', 'g2'], stainc: 'h1', crackc: 'g4',
  wall: (c) => each((x, y) => { const s = Math.abs((x % 8) - 3.5) + Math.abs((y % 8) - 3.5); c.px(x, y, s > 3.4 ? 'h1' : s < 1.6 ? 'h3' : 'h2'); }),
  details: ['window-bars', 'stain', 'vent',
    ['door', 'cell door hatch steel', (c) => { c.rect(2, 0, 12, 16, 'k').rect(3, 1, 10, 15, 'g3').v(3, 1, 15, 'g2').v(12, 1, 15, 'g4').rect(5, 3, 6, 3, 'k').v(7, 3, 3, 'g2').v(9, 3, 3, 'g2').rect(5, 11, 6, 2, 'g4').h(5, 11, 6, 'g2').px(11, 8, 'g1').px(11, 9, 'k'); for (const y of [2, 14]) c.px(4, y, 'g1').px(11, y, 'g1'); }],
    ['tally', 'tally marks scratched counting days', (c) => { const g = ['V.V.V.V', 'V.V.VVV', 'V.VVV.V', 'VVV.V.V']; c.stamp(1, 2, g).stamp(8, 2, g).stamp(1, 9, g).v(9, 9, 4, 'g4').v(11, 9, 4, 'g4'); }],
    ['torn', 'torn padding ripped stuffing', (c) => { c.stamp(4, 3, ['..K....', '.KKK...', '.KwKK..', 'KKwwK..', '.KKwKK.', '..KKwK.', '...KKK.', '....K..']); c.px(7, 12, 'g1').px(8, 13, 'g1').px(6, 14, 'w0'); }],
    ['writing', 'writing on wall scrawled blood words', (c) => c.stamp(1, 4, ['o.o.ooo.o..oo.', 'o.o.o...o..o.o', 'ooo.oo..o..oo.', 'o.o.o...o..o..', 'o.o.ooo.oo.o..', '..............', '...o.o.ooo....', '...ooo.o......', '...o.o.ooo....'])],
    ['restraint', 'wall restraint straps ring', (c) => { ostamp(c, 6, 2, ['.xx.', 'x..x', 'x..x', '.xx.']); c.v(7, 6, 6, 't1').v(8, 6, 6, 't2'); ostamp(c, 6, 11, ['TTTT', 'TxxT', 'TTTT']); }]],
  floor: (c) => each((x, y) => c.px(x, y, ((x >> 2) + (y >> 2)) % 2 ? 'g4' : (x % 4 === 0 || y % 4 === 0) ? 'h3' : 'h2')),
  variants: ['bloody', 'stained', 'drain', 'cracked', 'dark'],
});
roomSet('morgue', 'morgue steel walls pale tiles', {
  top: ['k', 'g4'], fr: ['g4', 'g3', 'g2'], door: ['g4', 'g3', 'g2'], stainc: 'h1', crackc: 'g4',
  wall: (c) => { each((x, y) => c.px(x, y, x % 8 === 0 ? 'g3' : x % 8 === 1 ? 'g1' : (y * 5 + x * 3) % 7 === 0 ? 'g2' : 'u3')); c.h(0, 0, 16, 'g3'); for (let x = 0; x < 16; x += 8) c.px(x + 1, 0, 'g2').px(x + 4, 1, 'g1'); },
  details: ['vent', 'clock', 'switch', 'stain', 'door',
    ['drawers', 'body drawers cold chamber lockers', (c) => { c.rect(1, 1, 14, 14, 'k'); for (const [x, y] of [[2, 2], [8, 2], [2, 8], [8, 8]]) c.rect(x, y, 6, 6, 'g2').rect(x, y, 5, 5, 'g1').rect(x + 1, y + 1, 4, 4, 'u3').h(x + 2, y + 3, 2, 'g4').px(x + 1, y + 1, 'h3'); }],
    ['drawer-open', 'body drawer open feet toe tag corpse', (c) => { c.rect(1, 1, 14, 14, 'k'); for (const [x, y] of [[2, 2], [8, 2], [8, 8]]) c.rect(x, y, 6, 6, 'g2').rect(x, y, 5, 5, 'g1').rect(x + 1, y + 1, 4, 4, 'u3').h(x + 2, y + 3, 2, 'g4'); c.rect(2, 8, 6, 6, 'k').rect(2, 12, 6, 2, 'g2').h(2, 12, 6, 'g1'); c.stamp(3, 9, ['ll.ll', 'll.ll', 'll.ll']).px(7, 10, 'h2').px(7, 11, 'j2'); }],
    ['hose', 'hose reel tap wash down', (c) => { ostamp(c, 4, 3, ['.xxxxx.', 'xdddddx', 'xdxxxdx', 'xdxKxdx', 'xdxxxdx', 'xdddddx', '.xxxxx.']); c.v(10, 10, 5, 'v1').px(11, 14, 'v1').px(12, 14, 'j2'); }]],
  floor: (c) => { each((x, y) => c.px(x, y, x % 8 === 7 || y % 8 === 7 ? 'g2' : x % 8 === 0 || y % 8 === 0 ? 'h3' : 'v3')); c.px(4, 5, 'h3').px(12, 11, 'g1'); },
  variants: ['drain', 'bloody', 'puddle', 'cracked', ['trail', 'blood trail drag marks smear', (c) => { for (let y = 0; y < 16; y++) { const x = 6 + [0, 0, 1, 1, 0, 0, -1, 0][y % 8]; c.px(x, y, 'z1').px(x + 3, y, y % 3 ? 'z1' : 'r1'); if (y % 4 === 1) c.px(x + 1, y, 'z1'); if (y % 5 === 2) c.px(x + 2, y, 'r1'); } }]],
});
roomSet('school', 'school classroom green walls linoleum', {
  top: ['g4', 'k', 'g3'], fr: ['i1', 't1', 't2'], door: ['i1', 't1', 't2'], stainc: 'g4', crackc: 'g4', wornc: 'h3',
  wall: (c) => { c.fill('v1').speck(10, 'g4').speck(4, 'v2'); c.h(0, 3, 16, 'v2').h(0, 4, 16, 'g4'); },
  details: ['window', 'door', 'clock', 'poster', 'hooks', 'switch',
    ['blackboard', 'blackboard chalk writing', (c) => { c.rect(0, 3, 16, 10, 'k').rect(1, 4, 14, 7, 'g4').h(0, 11, 16, 't2').h(0, 12, 16, 't1'); c.stamp(2, 5, ['w.ww.w.w..ww', '............', 'ww.w.www.w..', '............', '.w.ww..w....']).px(12, 10, 'w0').px(13, 10, 'w0').px(3, 10, 'q3'); }],
    ['map', 'wall map chart roller', (c) => ostamp(c, 2, 2, ['TTTTTTTTTTTT', 'liiiiiiiiiil', 'liieeiiieeil', 'lieeeiieeeel', 'liieiiiieeil', 'liiieiiieiil', 'liiiiiiiiiil', 'llllllllllll', '.....K......'])],
    ['lockers', 'lockers metal row', (c) => { c.rect(0, 1, 16, 15, 'k'); for (let x = 1; x < 16; x += 5) { c.rect(x, 2, 4, 13, 'u2').v(x, 2, 13, 'u3').h(x + 1, 4, 2, 'k').h(x + 1, 5, 2, 'k').px(x + 3, 9, 'g1'); } c.rect(6, 6, 4, 9, 'k').v(6, 6, 9, 'u1'); }]],
  floor: (c) => { each((x, y) => c.px(x, y, ((x >> 3) + (y >> 3)) % 2 ? 'h1' : 'h2')); c.speck(10, 'g3').speck(6, 'h3'); },
  variants: ['worn', 'stained', 'dark', 'cracked', ['chalk', 'chalk outline hopscotch marks', (c) => { c.h(3, 2, 10, 'h3').h(3, 13, 10, 'h3').v(3, 2, 12, 'h3').v(12, 2, 12, 'h3').h(3, 7, 10, 'h3').v(8, 2, 5, 'h3'); }]],
});
roomSet('shop', 'old shop shelves goods wooden floor', {
  top: ['i1', 'k', 't1'], fr: ['i1', 't1', 't2'], door: ['v1', 'v2', 'v3'], stainc: 'i1', crackc: 'k', wornc: 't3',
  wall: (c) => { pat(c, ['mlllmmjjjjmmhhmm', 'mZoomXxxxXmhhhhm', 'mZoomXxxxXmhiihm', 'mZoomXxxxXmhhhhm', 'TTTTTTTTTTTTTTTT', 'mmmmmmmmmmmmmmmm', 'mmkkkkmmddmddmmm', 'mmknnkmmdemdemmm', 'mmkkkkmmdemdemmm', 'TTTTTTTTTTTTTTTT', 'mmmmmmmmmmmmmmmm', 'mmmjjmmmaaammmmm', 'mxmjjmxmabamllml', 'mxmjjmxmaaamlkml', 'mxmjjmxmaaamllml', 'CCCCCCCCCCCCCCCC']); },
  details: ['door', 'clock', 'poster',
    ['empty', 'empty shelves bare dusty', (c) => { for (const [y, h] of [[0, 4], [5, 4], [10, 5]]) c.rect(0, y, 16, h, 'i1'); c.px(3, 3, 'h1').px(4, 3, 'h1').px(11, 8, 'h1').stamp(8, 12, ['.kk.', 'kkkk', 'kkkk']).px(2, 14, 'g3'); }],
    ['window', 'shop window display blind', (c) => { c.rect(1, 1, 14, 14, 'k').rect(2, 2, 12, 12, 'u1').rect(2, 2, 12, 4, 'h2').h(2, 5, 12, 'h1').px(8, 6, 'h1').px(8, 7, 'h2').stamp(3, 9, ['.l...kk...', 'lll.kkkk.Z', 'lKl.kkkk.Z']).h(2, 12, 12, 't1').h(2, 13, 12, 't2').v(13, 2, 10, 'u2'); }],
    ['drawers', 'apothecary drawers small labelled', (c) => { c.rect(0, 0, 16, 16, 'i1'); for (let y = 1; y < 15; y += 5) for (let x = 1; x < 15; x += 5) c.rect(x, y, 4, 4, 't1').h(x, y, 4, 't2').h(x + 1, y + 1, 2, 'h3').px(x + 1, y + 2, 'j2').px(x + 2, y + 2, 'j2'); }],
    ['sign', 'shop sign closed notice board', (c) => { c.px(5, 2, 'g3').px(10, 2, 'g3').px(4, 3, 'g3').px(11, 3, 'g3'); ostamp(c, 3, 4, ['llllllllll', 'lKlKlKKlKl', 'lKlKlKllKl', 'lKKllKKlKl', 'llllllllll']); }]],
  floor: (c) => oldBoards(c, 'brown'),
  variants: ['worn', 'dark', 'hatch', 'dusty', ['glass', 'broken glass shards on floor', (c) => { for (const [x, y] of [[3, 4], [7, 9], [11, 5], [5, 12], [12, 12]]) c.px(x, y, 'u3').px(x + 1, y, 'w0').px(x, y + 1, 'u2'); c.px(9, 3, 'w0').px(2, 9, 'u3'); }]],
});


category('floors', 'Floors & carpets', 'tile');
function carpetEdges(prefix, words, r, trim) { for (const f of EDGES) T(`${prefix}-${EDGE_SLUG[f]}`, `${words} carpet rug ${EDGE_NAME[f]}`, 'floor', (c) => carpet(c, f, r, trim)); }
carpetEdges('carpet-green', 'green', 'green', 'y2');
carpetEdges('carpet-purple', 'purple royal', 'purple', 'y2');
carpetSet('carpet-brown', 'brown old', 'oak', 'h2');
carpetSet('carpet-grey', 'grey gray dark', 'dark', 'g1');
carpetSet('carpet-maroon', 'maroon dark red wine', 'wine', 'j2');
carpetSet('carpet-navy', 'navy dark blue', 'dusk', 'h3');
carpetSet('carpet-moss', 'moss dull green', 'moss', 'h2');
T('carpet-threadbare', 'threadbare worn out carpet holes', 'floor', (c) => { carpet(c, '', 'wine', 'j2'); blob(c, 5, 6, 2, 'h1', 3); blob(c, 11, 11, 2, 'h1', 3); each((x, y) => { if (c.get(x, y) === PAL.h1 && (x + y) % 2) c.px(x, y, 'g4'); }); c.px(9, 4, 'h1').px(3, 12, 'h1'); });
T('floor-herringbone', 'herringbone wooden floor parquet zigzag', 'floor', (c) => each((x, y) => { const d = (x + y) % 8, e = (x - y + 16) % 8, q = (x >> 2) % 2, k = q ? d : e; c.px(x, y, k === 0 || x % 4 === 0 ? 't1' : k < 4 ? 't2' : 'd2'); }));
T('floor-boards-dark', 'dark floorboards old boards black wood', 'floor', (c) => { oldBoards(c, 'oak'); dim(c); c.px(3, 5, 'g4').px(11, 13, 'g4'); });
T('floor-boards-wide', 'wide floorboards planks old', 'floor', (c) => { c.fill('t2'); for (let y = 0; y < 16; y += 8) { c.h(0, y, 16, 'd2').h(0, y + 7, 16, 'i1'); const x = y ? 11 : 4; c.v(x, y, 7, 'i1').px(x + 1, y + 1, 'g2').px(x - 1, y + 1, 'g2'); c.h((x + 4) & 15, y + 3, 4, 't1').h((x + 9) & 15, y + 5, 3, 't1').px((x + 6) & 15, y + 2, 't1'); } });
T('floor-boards-rotten', 'rotten floorboards rot mould holes', 'floor', (c) => { oldBoards(c, 'oak'); blob(c, 4, 5, 1, 'k', 3); blob(c, 11, 10, 2, 'k', 3); c.speck(10, 'v1').speck(5, 'v2').px(6, 4, 'h1').px(7, 4, 'h2').px(13, 8, 'h1').px(2, 13, 'h2').px(3, 13, 'h1'); });
T('floor-boards-missing', 'floorboards missing plank gap hole joists', 'floor', (c) => { oldBoards(c, 'brown'); c.rect(0, 4, 16, 4, 'k').rect(4, 4, 2, 4, 'i1').rect(12, 4, 2, 4, 'i1').h(0, 8, 16, 't3').px(2, 4, 't2').px(3, 4, 't2').px(9, 7, 't1'); });
T('floor-boards-bloody', 'bloodstained floorboards blood stain', 'floor', (c) => { oldBoards(c, 'brown'); FV.bloody(c); c.v(7, 11, 4, 'z1').px(8, 13, 'z1'); });
T('floor-boards-scorched', 'scorched burnt floorboards fire damage ash', 'floor', (c) => { oldBoards(c, 'brown'); blob(c, 8, 8, 4, 'g4', 5); blob(c, 8, 8, 2, 'k', 4); c.speck(6, 'g3', 4, 4, 8, 8).px(6, 6, 'o1').px(10, 9, 'o1').px(9, 11, 'r1'); });
T('floor-boards-patched', 'patched floorboards new plank nails repair', 'floor', (c) => { oldBoards(c, 'oak'); c.rect(4, 4, 9, 3, 'h1').h(4, 4, 9, 'h2').h(4, 7, 9, 'k').v(3, 4, 3, 'k').v(13, 4, 3, 'k').px(5, 5, 'g4').px(11, 5, 'g4'); });
T('floor-checker-bw', 'checker floor black white tiles hall', 'floor', (c) => { each((x, y) => c.px(x, y, ((x >> 3) + (y >> 3)) % 2 ? (x % 8 === 0 || y % 8 === 0 ? 'g3' : 'g4') : (x % 8 === 7 || y % 8 === 7 ? 'h2' : 'h3'))); c.px(3, 2, 'h2').px(12, 13, 'h2').px(11, 4, 'k'); });
T('floor-checker-red', 'checker floor red black tiles', 'floor', (c) => { each((x, y) => c.px(x, y, ((x >> 3) + (y >> 3)) % 2 ? (x % 8 === 0 || y % 8 === 0 ? 'g4' : 'k') : (x % 8 === 0 || y % 8 === 0 ? 'q1' : x % 8 === 7 || y % 8 === 7 ? 'z1' : 'r1'))); });
T('floor-hex', 'hexagon hex tiles floor honeycomb', 'floor', (c) => each((x, y) => { let d1 = 99, d2 = 99; for (const [cx, cy] of [[4, 2], [0, 6], [8, 6], [4, 10], [12, 2], [12, 10], [0, -2], [8, -2], [16, 6], [-4, 2], [-4, 10], [0, 14], [8, 14], [16, 14], [4, 18], [12, 18], [20, 2], [20, 10], [16, -2]]) { const dx = Math.abs(x + 0.5 - cx), dy = Math.abs(y + 0.5 - cy), d = Math.max(dx, dx * 0.5 + dy * 1.0); if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; } c.px(x, y, d2 - d1 < 0.8 ? 'g3' : 'h3'); }));
T('floor-mosaic', 'mosaic floor small tiles pattern', 'floor', (c) => { each((x, y) => { const s = Math.abs((x >> 1) - 3.5) + Math.abs((y >> 1) - 3.5); c.px(x, y, ['q1', 'h3', 'u2', 'h3', 'v1', 'h2', 'u1', 'h2'][Math.floor(s)]); }); each((x, y) => { if ((x * 7 + y * 13) % 23 === 0) c.px(x, y, 'h1'); }); });
T('floor-lino', 'linoleum lino floor brown marbled', 'floor', (c) => { c.fill('q1').speck(30, 'z1').speck(14, 'q2'); c.v(15, 0, 16, 'z1'); for (let i = 0; i < 16; i++) c.px(i, (i * 3 + (i >> 2)) % 16, 'q2'); });
T('floor-lino-green', 'linoleum lino floor green hospital', 'floor', (c) => { c.fill('v2').speck(26, 'v1').speck(14, 'v3'); c.h(0, 15, 16, 'v1'); });
T('floor-concrete', 'concrete floor grey cement', 'floor', (c) => { c.fill('g3').speck(18, 'g2').speck(10, 'g4'); c.h(0, 15, 16, 'g4').v(15, 0, 16, 'g4').px(5, 6, 'g4').px(6, 7, 'g4').px(7, 7, 'g4'); });
T('floor-dirt-cellar', 'dirt cellar floor earth stones', 'floor', (c) => { c.fill('t1').speck(22, 'i1').speck(8, 't2'); for (const [x, y] of [[3, 4], [11, 2], [8, 10], [13, 13], [2, 12]]) c.px(x, y, 'g3').px(x + 1, y, 'g2').px(x, y + 1, 'g4'); });
T('floor-flagstones', 'flagstones stone slabs floor brown', 'floor', (c) => { slabs(c, FLAGS, 'i1', 'h1', 'h2', 'g4'); c.speck(6, 'g4'); });
T('floor-terracotta', 'terracotta tiles floor clay', 'floor', (c) => { each((x, y) => c.px(x, y, x % 8 === 7 || y % 8 === 7 ? 'i1' : x % 8 === 0 || y % 8 === 0 ? 's1' : 'd2')); c.speck(8, 't2').px(4, 11, 'i1').px(5, 12, 'i1'); });
T('floor-cobbles-dark', 'dark cobbles cobblestone cellar yard', 'floor', (c) => boulders(c, 'k', 'g4', 'g3', 'k'));
T('floor-tiles-broken', 'broken white tiles missing tile floor', 'floor', (c) => { each((x, y) => c.px(x, y, x % 8 === 7 || y % 8 === 7 ? 'g3' : x % 8 === 0 || y % 8 === 0 ? 'w0' : 'g1')); c.rect(8, 8, 7, 7, 'g4').speck(8, 'g3', 8, 8, 7, 7).px(12, 9, 'g1').px(13, 9, 'g1').px(13, 10, 'g1'); crackLine(c, 3, 0, 8, 'g3'); });
T('floor-brick', 'brick floor herringbone bricks red dark', 'floor', (c) => each((x, y) => { const q = ((x >> 3) + (y >> 3)) % 2, k = (q ? x : y) % 4, e = (q ? y : x) % 8; c.px(x, y, k === 3 || e === 7 ? 'i1' : k === 0 ? 'r1' : 'z1'); }));
T('floor-ash', 'ash cinders burnt floor soot', 'floor', (c) => { c.fill('g4').speck(30, 'k').speck(14, 'g3').speck(4, 'g2').px(4, 9, 'o1').px(11, 5, 'r1'); });
T('floor-sawdust', 'sawdust floor butcher workshop', 'floor', (c) => { oldBoards(c, 'oak'); c.speck(46, 'h2').speck(20, 'h3').speck(10, 'j2'); });
T('floor-grave-earth', 'freshly dug earth grave soil', 'floor', (c) => { c.fill('i1').speck(26, 't1').speck(10, 'k').speck(5, 't2'); c.stamp(9, 10, ['.l.', 'lll']).px(4, 4, 'g3'); });


// ── free-standing props for the old house. props(): "@slug* | search name | options" then the picture; * = solid ──
function props(src) {
  let cur = null;
  const flush = () => { if (cur) PA(cur.slug, cur.name, cur.rows.join('\n'), cur.opts); };
  for (const line of src.split('\n')) {
    const l = line.trim();
    if (!l || l.startsWith('//')) continue;
    if (l[0] !== '@') { cur.rows.push(l); continue; }
    flush();
    const f = l.slice(1).split('|').map((s) => s.trim());
    const o = optsOf(f[2]);
    if (o.swap) o.swap = String(o.swap).replace(/,/g, ' ');
    const solid = f[0].endsWith('*');
    cur = { slug: solid ? f[0].slice(0, -1) : f[0], name: f[1], rows: [], opts: { ...o, ...(solid ? { solid: true } : {}) } };
  }
  flush();
}

category('doors', 'Doors, windows & stairs', 'thing');
const DOOR_SHUT = `
CCCCCCCCCC
CLTTTTTTTC
CLTCCCCTTC
CLTCTTCTTC
CLTCTTCTTC
CLTCCCCTTC
CLTTTTTTnC
CLTCCCCTTC
CLTCTTCTTC
CLTCTTCTTC
CLTCTTCTTC
CLTCCCCTTC
CLTTTTTTTC`;
const DOOR_AJAR = `
CCCCCCCCCC
CLTTTTTCKC
CLTCCCTCKC
CLTCTCTCKC
CLTCTCTCKC
CLTCCCTCKC
CLTTTTnCKC
CLTCCCTCKC
CLTCTCTCKC
CLTCTCTCKC
CLTCTCTCKC
CLTCCCTCKC
CLTTTTTCKC`;
const DOOR_OPEN = `
CCCCCCCCCC
CTCKKKKKKC
CTTCKKKKKC
CLTCKKKKKC
CLTCKKKKKC
CLTCKKKKKC
CLnCKKKKKC
CLTCKKKKKC
CLTCKKKKKC
CLTCKKKKKC
CLTCKKKKVC
CLTCKKKVVC
CLTCKKVVVC`;
const DOOR_COLS = [['oak', 'brown wooden', null], ['dark', 'dark wood black', 'Cm TC LT'], ['white', 'white painted pale', 'CX Tl LW'], ['green', 'green painted', 'CV Td Le'], ['red', 'dull red painted', 'Cm To LZ'], ['blue', 'blue painted', 'CV Tg Lh']];
for (const [id, w, swap] of DOOR_COLS) {
  PA(`door-${id}`, `${w} door closed shut`, DOOR_SHUT, { solid: true, swap: swap || undefined });
  PA(`door-${id}-ajar`, `${w} door ajar slightly open gap`, DOOR_AJAR, { solid: true, swap: swap || undefined });
  if (id === 'oak' || id === 'dark' || id === 'white') PA(`door-${id}-open`, `${w} door open doorway`, DOOR_OPEN, { swap: swap || undefined });
}
props(`
@door-double* | double doors closed hall wooden
CCCCCCCCCCCCCC
CLTTTTCCLTTTTC
CLCCCTCCLCCCTC
CLCTCTCCLCTCTC
CLCTCTCCLCTCTC
CLCCCTCCLCCCTC
CLTTTnCCnTTTTC
CLCCCTCCLCCCTC
CLCTCTCCLCTCTC
CLCTCTCCLCTCTC
CLCTCTCCLCTCTC
CLCCCTCCLCCCTC
CLTTTTCCLTTTTC
@door-double-open | double doors open wide doorway
CCCCCCCCCCCCCC
CTCKKKKKKKKCTC
CLCKKKKKKKKCTC
CLCKKKKKKKKCTC
CLCKKKKKKKKCTC
CLCKKKKKKKKCTC
CLnKKKKKKKKnTC
CLCKKKKKKKKCTC
CLCKKKKKKKKCTC
CLCKKKKKKKKCTC
CLCKKKKKKKKCTC
CLCKKVVVVKKCTC
CLCKVVVVVVKCTC
@door-glass* | glass door glazed french door
CCCCCCCCCC
CLTTTTTTTC
CLhhhChhTC
CLhihChhTC
CLhhhChhTC
CLCCCCCCTC
CLhhhChhTC
CLhhhChinC
CLhhhChhTC
CLTTTTTTTC
CLTCCCCTTC
CLTCCCCTTC
CLTTTTTTTC
@door-cell* | cell door bars prison jail
XXXXXXXXXX
XKxKxKxKxX
XKxKxKxKxX
XKxKxKxKxX
XXXXXXXXXX
XKxKxKxKxX
XKxKxKnnxX
XKxKxKnKxX
XKxKxKxKxX
XXXXXXXXXX
XKxKxKxKxX
XKxKxKxKxX
XXXXXXXXXX
@door-cell-open | cell door open bars prison
XXXXXXXXXX
XxXKKKKKKX
XxXKKKKKKX
XXXKKKKKKX
XxXKKKKKKX
XxXKKKKKKX
XxnKKKKKKX
XXXKKKKKKX
XxXKKKKKKX
XxXKKKKKKX
XXXKKKKKVX
XxXKKKKVVX
XxXKKKVVVX
@door-iron-riveted* | iron door rivets heavy metal hatch
VVVVVVVVVV
VxXXXXXXXV
VXwXXXXwXV
VXXXXXXXXV
VXXVVVVXXV
VXXVKKVXXV
VXXVVVVXXV
VXwXXXXwXV
VXXXXXXnXV
VXXXXXXXXV
VXwXXXXwXV
VXXXXXXXXV
VXXXXXXXXV
@door-boarded* | boarded up door planks nailed shut
.CCCCCCCCCC.
.CLTTTTTTTC.
LLLLLLLLLLLL
TwTTTTTTTTwT
.CLTCTTCTTC.
.CLTCCCCTTC.
.LLLLLLLLLLL
LTwTTTTTTwTT
.CLTCTTCTTC.
LLLLLLLLLLL.
TwTTTTTTTwT.
.CLTCCCCTTC.
.CLTTTTTTTC.
@door-broken* | broken door smashed hole splintered
CCCCCCCCCC
CLTTTTTTTC
CLTCCCCTTC
CLTCKKCTTC
CLTKKKKKTC
CLKKKKKKTC
CLTKKKKKnC
CLTCKKKTTC
CLTCTKCTTC
CLTCTTCTTC
CLTCTTCTTC
CLTCCCCTTC
CLTTTTTTTC
@door-chained* | chained door padlock locked chain
CCCCCCCCCC
CLTTTTTTTC
CLTCCCCTTC
CLTCTTCTTC
CxTCTTCTxC
CLxXCCxXTC
CLTTxXTTnC
CLTCnnCTTC
CLTCnKCTTC
CLTCTTCTTC
CLTCTTCTTC
CLTCCCCTTC
CLTTTTTTTC
@door-bloody* | door bloody handprint blood smear
XXXXXXXXXX
XWllllllllX
XWlXXXXllX
XWlXllXllX
XWoXolXllX
XWoXooXllX
XWooooolnX
XWloooXllX
XWlXolXllX
XWlXloXllX
XWlXllXllX
XWlXXXXllX
XWlllollX
@door-arched* | arched door church oak iron studs
..CCCCCC..
.CLTTCTTC.
CLTTTCTTTC
CLTTTCTTTC
CVVVVCVVVC
CLwTTCTTwC
CLTTTCTTTC
CLTTnCTTTC
CVVVVCVVVC
CLwTTCTTwC
CLTTTCTTTC
CLTTTCTTTC
CVVVVCVVVC
@door-nailed-shut* | nursery door pale peeling child height marks
XXXXXXXXXX
XWcccccccX
XWcbbbbccX
XWcbccbccX
XWcbccbccX
XWcbbbbccX
XWccccccnX
XWcbbbbccX
XWcbccbccX
XWcXcXbccX
XWcbccbccX
XWcbbbbccX
XWcccccccX
@trapdoor-closed | trapdoor closed hatch in floor ring
CCCCCCCCCCCC
CLTLTLTLTLTC
CTTTTTTTTTTC
CXXXXXXXXXXC
CTTTTTTTTTTC
CTTTTxxTTTTC
CTTTTxKTTTTC
CXXXXXXXXXXC
CTTTTTTTTTTC
CCCCCCCCCCCC
@trapdoor-open | trapdoor open hatch hole ladder down
.CCCCCCCCCC.
.CTLTLTLTTC.
.CTTTTTTTTC.
.CXXXXXXXXC.
CCCCCCCCCCCC
CKKKKKKKKKKC
CKKKLKKLKKKC
CKKKLLLLKKKC
CKKKLKKLKKKC
CKKKLLLLKKKC
CCCCCCCCCCCC
@cellar-hatch* | cellar hatch doors storm cellar outside
XXXXXXXXXXXXXX
XCCCCCCCCCCCCX
XCTTTTCCTTTTCX
XCTLTTCCTTLTCX
XCTTTTxxTTTTCX
XCTLTTCCTTLTCX
XCTTTTCCTTTTCX
XCCCCCCCCCCCCX
xxxxxxxxxxxxxx
@cellar-hatch-open | cellar hatch open steps down dark
XXXXXXXXXXXXXX
XCKKKKKKKKKKCX
CTKKKKKKKKKKTC
CTKKVVVVVVKKTC
CTKKKKKKKKKKTC
CTKXXXXXXXXKTC
CTKKKKKKKKKKTC
XCxxxxxxxxxxCX
xxxxxxxxxxxxxx
@bookcase-door* | secret bookcase door closed hidden
CCCCCCCCCCCC
CaahedZjgheC
CaahedZjgheC
CTTTTTTTTTTC
CgdZjahhedaC
CgdZjahhedaC
CTTTTTTTTTTC
ChZadegjZhdC
ChZadegjZhdC
CTTTTTTTTTTC
CdjhgZaedhZC
CdjhgZaedhZC
CTTTTTTTTTTC
@bookcase-door-open | secret bookcase door open passage
CCCCCCCCCCCCCC
CaheCKKKKKKKKC
CaheCKKKKKKKKC
CTTTCKKKKKKKKC
CgdZCKKKKKKKKC
CgdZCKKKKKKKKC
CTTTCKKKKKKKKC
ChZaCKKKKKKKKC
ChZaCKKKKKKKKC
CTTTCKKKKKKKKC
CdjhCKKKKKKVVC
CdjhCKKKKVVVVC
CTTTCKKVVVVVVC
@curtain-doorway | curtain doorway red drapes entrance
nnnnnnnnnnnn
CoZZaZoZZaZC
CoZZaZoZZaZC
CoZZaZoZZaZC
CoZZaZoZZaZC
CoZZaZoZZaZC
CoZZaKKZZaZC
CoZZKKKKZaZC
CoZaKKKKoaZC
CoZaKKKKoaZC
CoZKKKKKKaZC
CoZKKKKKKaZC
CoKKKKKKKKZC
@bead-curtain | bead curtain doorway strings
CCCCCCCCCCCC
CnKjKnKjKnKC
CjKnKjKnKjKC
CnKjKnKjKnKC
CjKnKjKnKjKC
CnKjKnKjKnKC
CjKnKjKnKjKC
CnKjKnKjKnKC
CjKnKjKnKjKC
CnKjKKKjKnKC
CjKnKKKnKjKC
CnKKKKKKKnKC
CjKKKKKKKjKC
@archway-stone | stone archway arch opening
...xxxxxx...
.xxwwwwwwxx.
xwwXKKKKXwwx
xwXKKKKKKXwx
xwKKKKKKKKwX
xwKKKKKKKKwX
xwKKKKKKKKwX
xwKKKKKKKKwX
xwKKKKKKKKwX
xwKKKKKKKKwX
xwKKKKKKKKwX
xwKKKKKKKKwX
xXKKKKKKKKXX
@archway-wood | wooden doorway frame empty opening no door
CCCCCCCCCCCC
CLTTTTTTTTCC
CLCKKKKKKCTC
CLKKKKKKKKTC
CLKKKKKKKKTC
CLKKKKKKKKTC
CLKKKKKKKKTC
CLKKKKKKKKTC
CLKKKKKKKKTC
CLKKKKKKKKTC
CLKKKKKKVVTC
CLKKKKVVVVTC
CLKKVVVVVVTC
@garden-gate* | garden gate wooden picket closed
.L..L..L..L.
.T..T..T..T.
LTLLTLLTLLTL
CTCCTCCTCCTC
.T..T.nT..T.
.T..T..T..T.
LTLLTLLTLLTL
CTCCTCCTCCTC
.T..T..T..T.
@gate-wrought* | wrought iron gate tall closed cemetery
.....VV.....
..V.VXXV.V..
.VXVXVVXVXV.
VX.X.XX.X.XV
VX.X.XX.X.XV
VXVXVXXVXVXV
VX.X.XX.X.XV
VX.X.XXnX.XV
VX.X.XX.X.XV
VXVXVXXVXVXV
VX.X.XX.X.XV
VX.X.XX.X.XV
@gate-wrought-open | wrought iron gate open cemetery
V............V
XV..........VX
XXV........VXX
X.X........X.X
X.X........X.X
XVX........XVX
X.X........X.X
X.X........X.X
X.X........X.X
XVX........XVX
X.X........X.X
X.X........X.X
@window-frame-lit* | window lit warm light yellow glowing
CCCCCCCCCCCC
CTTTTTTTTTTC
CTEEEFCEEEFC
CTEEFFCEFFFC
CTFFFFCFFFnC
CTCCCCCCCCCC
CTEFFFCFFFnC
CTFFFnCFFnnC
CTFnnnCnnnnC
CTTTTTTTTTTC
LLLLLLLLLLLL
.CCCCCCCCCC.
@window-frame-dark* | window dark night unlit
CCCCCCCCCCCC
CTTTTTTTTTTC
CTgigggCggggC
CTgiggCggggC
CTggggCggggC
CTCCCCCCCCCC
CTggggCggggC
CTggggCggigC
CTggggCggggC
CTTTTTTTTTTC
LLLLLLLLLLLL
.CCCCCCCCCC.
@window-frame-broken* | window broken smashed glass shards
CCCCCCCCCCCC
CTTTTTTTTTTC
CTggKgCggggC
CTgKKKCgWggC
CTKKKKCggWgC
CTCCKCCCCCCC
CTgKKKCggggC
CTggKgCgKKgC
CTggggCKKKKC
CTTTTTTTTTTC
LLLLLLLLLLLL
.CCCCCCCCCC.
@window-frame-face* | window with pale face watching ghost
CCCCCCCCCCCC
CTTTTTTTTTTC
CTgggllllggC
CTgglllllllC
CTgglKllKlgC
CTCClllllCCC
CTggllKKlggC
CTggglllgggC
CTggggCggggC
CTTTTTTTTTTC
LLLLLLLLLLLL
.CCCCCCCCCC.
@window-frame-shutters* | window closed shutters louvre green
CCCCCCCCCCCC
CdddddCdddddC
CdeeedCdeeedC
CdddddCdddddC
CdeeedCdeeedC
CdddddCdddddC
CdeeedCdeeedC
CdddddCdddddC
CdeeedCdeeedC
CdddddCdddddC
LLLLLLLLLLLL
.CCCCCCCCCC.
@window-frame-curtains* | window drawn curtains closed drapes
CCCCCCCCCCCC
CnnnnnnnnnnC
CoZaZooZaZoC
CoZaZooZaZoC
CoZaZooZaZoC
CoZaZooZaZoC
CoZaZooZaZoC
CoZaZooZaZoC
CoZaZooZaZoC
CTTTTTTTTTTC
LLLLLLLLLLLL
.CCCCCCCCCC.
@staircase-up* | staircase up stairs wooden steps going up
..CLLLLLLLLC..
..CTTTTTTTTC..
..CCCCCCCCCC..
.CLLLLLLLLLLC.
.CTTTTTTTTTTC.
.CCCCCCCCCCCC.
CLLLLLLLLLLLLC
CTTTTTTTTTTTTC
CCCCCCCCCCCCCC
CLLLLLLLLLLLLC
CTTTTTTTTTTTTC
CCCCCCCCCCCCCC
@staircase-down | staircase down stairs descending dark cellar steps
CCCCCCCCCCCCCC
CLLLLLLLLLLLLC
CTTTTTTTTTTTTC
CCTTTTTTTTTTCC
.CCCCCCCCCCCC.
.CCmmmmmmmmCC.
.CmmmmmmmmmmC.
..CmmmmmmmmC..
..CmKKKKKKmC..
..CKKKKKKKKC..
..CKKKKKKKKC..
@staircase-carpet* | grand staircase red carpet runner stairs
..CLLZZZZLLC..
..CTToooTTTC..
..CCCCCCCCCC..
.CLLLZZZZLLLC.
.CTTToooTTTTC.
.CCCCCCCCCCCC.
CLLLLZZZZLLLLC
CTTTTooooTTTTC
CCCCCCCCCCCCCC
CLLLLZZZZLLLLC
CTTTTooooTTTTC
CCCCCCCCCCCCCC
@ladder-wood | wooden ladder leaning climb
.T......T.
.TLLLLLLT.
.T......T.
.T......T.
.TLLLLLLT.
.T......T.
.T......T.
.TLLLLLLT.
.T......T.
.T......T.
.TLLLLLLT.
.T......T.
.C......C.
@ladder-broken | broken ladder snapped rungs missing
.T........
.TLLLLL...
.T......T.
.T......T.
.T....LLT.
.T......T.
.T......T.
.TLLLLLLT.
.T......T.
.T......T.
.TLL....T.
.T......T.
.C......C.
@spiral-stairs* | spiral staircase iron winding
.....VV.....
...xxVVww...
..xxxVVwwW..
.....VVXXXX.
.....VV.XXX.
...wwVV.....
.WwwwVVxx...
XXXXXVVxxx..
.XXX.VV.....
.....VVww...
...xxVVwwW..
..xxxVVXXXX.
.....VV.....
@banister* | banister railing balusters stair rail
LLLLLLLLLLLLLL
CCCCCCCCCCCCCC
.T..T..T..T..T
.L..L..L..L..L
.T..T..T..T..T
.T..T..T..T..T
.L..L..L..L..L
.T..T..T..T..T
CCCCCCCCCCCCCC
@banister-post* | newel post banister end stair post
..LL..
.LTTC.
.LTTC.
..TC..
.LTTC.
.LTTC.
.LTTC.
.LTTC.
.LTTC.
.LTTC.
.LTTC.
LTTTTC
CCCCCC
@banister-broken* | broken banister railing snapped gap
LLLL.......LLL
CCCCC.....CCCC
.T..T........T
.L..L........L
.T..T..T.....T
.T..T..L.....T
.L..L..T..L..L
.T..T..T.TT..T
CCCCCCCCCCCCCC
@stairs-attic | attic stairs pull down ladder steep
.....CCCCCC.
....CLLLLLC.
....CTTTTC..
...CLLLLLC..
...CTTTTC...
..CLLLLLC...
..CTTTTC....
.CLLLLLC....
.CTTTTC.....
CLLLLLC.....
CTTTTC......
CCCCCC......
@dumbwaiter* | dumbwaiter hatch small lift in wall
CCCCCCCCCC
CLTTTTTTTC
CLKKKKKKTC
CLKxKKxKTC
CLKxKKxKTC
CLKVVVVKTC
CLKXXXXKTC
CLKKKKKKTC
CLTTTTTTTC
CCCCCCCCCC
@fire-escape | fire escape iron steps outside rusty
VVVVVVVVVVVV
V.V.V.V.V.VV
XXXXXXXXXXXX
.......DX...
......XX....
.....DX.....
....XX......
...XD.......
..XX........
.XX.........
XXXXXXXXXXXX
V..........V
`);
// ═════════════════════════ end of the old house pack ═════════════════════════

// S() reads the current category when a sprite is drawn, not when it is declared, so the
// older sprites were all drawn with the last category of the original pack current. Keep it so.
cat = CATS.find((c) => c.id === 'symbols');

// ───────────────────────── write everything ─────────────────────────
const EXPECT = 1965;   // 500 original sprites + 362 level tiles + 103 level props + 1000 everyday and modern sprites
function main() {
  const all = CATS.flatMap((c) => c.items);
  const seen = new Set();
  for (const c of CATS) if (c.group === 'tile') for (const it of c.items) if (it.kind !== 'floor' && it.kind !== 'wall') throw new Error('tile without kind ' + it.slug);
  for (const it of all) {
    if (!/^[a-z0-9-]+$/.test(it.slug)) throw new Error('bad slug ' + it.slug);
    if (seen.has(it.slug)) throw new Error('duplicate slug ' + it.slug);
    seen.add(it.slug);
  }
  if (!process.env.PX_DRAFT && all.length !== EXPECT) throw new Error(`expected ${EXPECT} sprites, have ${all.length}: ` + CATS.map((c) => `${c.id} ${c.items.length}`).join(', '));
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (/\.png$/.test(f) && !seen.has(f.slice(0, -4))) fs.unlinkSync(path.join(OUT, f));
  for (const it of all) {
    let grid;
    try { grid = it.make(); } catch (e) { throw new Error(`${it.slug}: ${e.message}`); }
    fs.writeFileSync(path.join(OUT, it.slug + '.png'), png(grid));
  }
  const index = { categories: CATS.map((c) => ({ id: c.id, label: c.label, group: c.group, items: c.items.map(({ slug, name, kind, solid }) => ({ slug, name, ...(c.group === 'tile' ? { kind } : {}), ...(solid ? { solid: true } : {}) })) })) };
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1) + '\n');
  console.log(`${all.length} sprites in ${CATS.length} categories → ${path.relative(process.cwd(), OUT)}`);
  console.log(CATS.map((c) => `${c.id} ${c.items.length}`).join(', ') + ` | templates ${Object.keys(TPL).length} (${NEW_TPL} new, plus ${NEW_FN.size} new drawing routines)`);
}
main();
