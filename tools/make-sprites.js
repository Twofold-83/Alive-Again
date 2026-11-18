#!/usr/bin/env node
/*
 * Generates the pixel-art sprite pack in public/px/ : 500 PNGs plus index.json.
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

// ───────────────────────── write everything ─────────────────────────
function main() {
  const all = CATS.flatMap((c) => c.items);
  const seen = new Set();
  for (const it of all) {
    if (!/^[a-z0-9-]+$/.test(it.slug)) throw new Error('bad slug ' + it.slug);
    if (seen.has(it.slug)) throw new Error('duplicate slug ' + it.slug);
    seen.add(it.slug);
  }
  if (!process.env.PX_DRAFT && all.length !== 500) throw new Error(`expected 500 sprites, have ${all.length}: ` + CATS.map((c) => `${c.id} ${c.items.length}`).join(', '));
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (/\.png$/.test(f) && !seen.has(f.slice(0, -4))) fs.unlinkSync(path.join(OUT, f));
  for (const it of all) {
    let grid;
    try { grid = it.make(); } catch (e) { throw new Error(`${it.slug}: ${e.message}`); }
    fs.writeFileSync(path.join(OUT, it.slug + '.png'), png(grid));
  }
  const index = { categories: CATS.map((c) => ({ id: c.id, label: c.label, group: c.group, items: c.items.map(({ slug, name }) => ({ slug, name })) })) };
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1) + '\n');
  console.log(`${all.length} sprites in ${CATS.length} categories → ${path.relative(process.cwd(), OUT)}`);
  console.log(CATS.map((c) => `${c.id} ${c.items.length}`).join(', ') + ` | templates ${Object.keys(TPL).length}`);
}
main();
