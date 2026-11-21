/*
 * Draws the body parts for paper-doll characters: 500 small sprites in a muted, eerie, old-home-computer
 * palette. A character is one head, one torso, one arm sprite (used for both arms) and one leg sprite (both legs).
 *
 *   node tools/make-dolls.js        writes public/doll/<id>.png and public/doll/index.json
 *
 * Everything is drawn in code from a few shapes and many combinations, so the set stays consistent and can be
 * regenerated. An art pack can replace any part later: same file names, any resolution of the same proportions.
 *
 * Canvas sizes (pixels):  head 14 x 13   torso 12 x 11   arm 5 x 12 (hangs down, shoulder at the top)
 *                         leg 6 x 12 (hangs down, hip at the top, foot pointing right)
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT = path.join(__dirname, '..', 'public', 'doll');
const EXPECT = 500;

/* ---------- a tiny PNG writer ---------- */
const CRC = (() => {
  const t = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
}
function png(w, h, px) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const c = px[y * w + x],
        o = y * (w * 4 + 1) + 1 + x * 4;
      if (c) {
        raw[o] = c[0];
        raw[o + 1] = c[1];
        raw[o + 2] = c[2];
        raw[o + 3] = 255;
      }
    }
  }
  const head = Buffer.alloc(13);
  head.writeUInt32BE(w, 0);
  head.writeUInt32BE(h, 4);
  head[8] = 8;
  head[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', head),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------- colours ---------- */
const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
const mix = (c, k) => c.map((v) => Math.max(0, Math.min(255, Math.round(v * k))));
const dark = (c) => mix(c, 0.68),
  lite = (c) => mix(c, 1.22);
const K = hex('#0b0a10'),
  WHITE = hex('#e4dfd0'),
  BONE = hex('#d8d0b4'),
  BLOOD = hex('#8f1d1d'),
  RED = hex('#b3342c'),
  GOLD = hex('#b8963a');
const SKINS = { pale: '#d6c2a6', fair: '#c79f7c', tan: '#a57a52', brown: '#6d4c36', ashen: '#9aa29a', rotten: '#7c9668', drowned: '#8fa6bb' };
const HAIR = { black: '#1b1722', brown: '#4b3122', red: '#853822', blond: '#bfa04e', grey: '#86837f', white: '#d3d0c6' };
const CLOTH = {
  wine: '#6b2332',
  navy: '#28304e',
  forest: '#2e4835',
  mustard: '#a07e2c',
  slate: '#565663',
  earth: '#584031',
  plum: '#48305a',
  teal: '#2e5658',
  cream: '#c8bea3',
  black: '#1e1b24',
  rust: '#84482a',
  ash: '#8d8a84',
};
for (const o of [SKINS, HAIR, CLOTH]) for (const k of Object.keys(o)) o[k] = hex(o[k]);

/* ---------- a canvas with an automatic dark outline ---------- */
function canvas(w, h) {
  const px = new Array(w * h).fill(null);
  const c = {
    w,
    h,
    px,
    set(x, y, col) {
      if (x >= 0 && y >= 0 && x < w && y < h && col) px[y * w + x] = col;
    },
    get(x, y) {
      return x >= 0 && y >= 0 && x < w && y < h ? px[y * w + x] : null;
    },
    clear(x, y) {
      if (x >= 0 && y >= 0 && x < w && y < h) px[y * w + x] = null;
    },
    rect(x0, y0, x1, y1, col) {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) c.set(x, y, col);
    },
    row(y, x0, x1, col) {
      c.rect(x0, y, x1, y, col);
    },
    col(x, y0, y1, col) {
      c.rect(x, y0, x, y1, col);
    },
    /** Darken the right-hand edge of whatever is drawn: light falls from the left. */
    shade(k = 0.72) {
      for (let y = 0; y < h; y++)
        for (let x = w - 1; x >= 0; x--)
          if (c.get(x, y) && !c.get(x + 1, y)) {
            const p = c.get(x, y);
            if (p !== K) px[y * w + x] = mix(p, k);
            break;
          }
    },
    /** A black line around the silhouette, where there is room for one. */
    outline() {
      const add = [];
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) if (!c.get(x, y) && (c.get(x - 1, y) || c.get(x + 1, y) || c.get(x, y - 1) || c.get(x, y + 1))) add.push([x, y]);
      for (const [x, y] of add) px[y * w + x] = K;
    },
  };
  return c;
}
const parts = { h: [], t: [], a: [], l: [] };
function emit(kind, name, c) {
  const id = kind + String(parts[kind].length + 1).padStart(3, '0');
  parts[kind].push({ id, name });
  fs.writeFileSync(path.join(OUT, id + '.png'), png(c.w, c.h, c.px));
}
/** A small repeatable random number, so the same sprite comes out every time. */
const rnd = (seed) => {
  let s = seed * 9301 + 49297;
  return () => (s = (s * 233280 + 12345) % 2147483647) / 2147483647;
};

/* =====================================================================================
 * HEADS  14 x 13.  The face is 8 wide (x 3..10), rows 3..11; hair and hats go around it.
 * ===================================================================================== */
function face(c, skin) {
  c.row(3, 4, 9, skin);
  c.rect(3, 4, 10, 9, skin);
  c.row(10, 4, 9, skin);
  c.row(11, 5, 8, skin);
  c.set(10, 5, dark(skin));
  c.set(10, 6, dark(skin));
  c.set(10, 7, dark(skin));
  c.set(10, 8, dark(skin));
  c.set(9, 10, dark(skin));
  c.set(7, 7, dark(skin));
  c.set(3, 4, lite(skin));
  c.set(4, 3, lite(skin));
}
const EXPR = {
  calm(c, s) {
    c.set(5, 6, K);
    c.set(8, 6, K);
    c.row(9, 6, 7, dark(dark(s)));
  },
  scared(c, s) {
    c.set(5, 5, WHITE);
    c.set(8, 5, WHITE);
    c.set(5, 6, K);
    c.set(8, 6, K);
    c.rect(6, 9, 7, 10, K);
  },
  angry(c, s) {
    c.set(4, 5, K);
    c.set(5, 5, K);
    c.set(8, 5, K);
    c.set(9, 5, K);
    c.set(5, 6, RED);
    c.set(8, 6, RED);
    c.row(9, 5, 8, K);
  },
  hollow(c, s) {
    c.rect(4, 5, 5, 6, K);
    c.rect(8, 5, 9, 6, K);
    c.row(9, 6, 7, dark(dark(s)));
  },
  grin(c, s) {
    c.set(5, 6, K);
    c.set(8, 6, K);
    c.set(4, 8, K);
    c.set(9, 8, K);
    c.row(9, 5, 8, K);
    c.set(6, 9, WHITE);
    c.set(7, 9, WHITE);
  },
  weeping(c, s) {
    c.set(5, 6, K);
    c.set(8, 6, K);
    c.col(5, 7, 8, hex('#6f8fae'));
    c.col(8, 7, 9, hex('#6f8fae'));
    c.row(9, 6, 7, K);
  },
};
const HAIRS = {
  bald() {},
  cropped(c, h) {
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    c.set(3, 4, h);
    c.set(10, 4, dark(h));
  },
  parted(c, h) {
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    c.row(4, 3, 7, h);
    c.set(3, 5, h);
    c.set(10, 4, dark(h));
    c.set(8, 2, lite(h));
  },
  long(c, h) {
    c.row(1, 4, 9, h);
    c.row(2, 3, 10, h);
    c.row(3, 2, 11, h);
    c.col(2, 4, 11, h);
    c.col(11, 4, 11, dark(h));
    c.col(3, 4, 6, h);
    c.set(10, 4, dark(h));
  },
  bob(c, h) {
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    c.col(2, 4, 8, h);
    c.col(11, 4, 8, dark(h));
    c.row(4, 3, 9, h);
  },
  ponytail(c, h) {
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    c.set(3, 4, h);
    c.set(11, 4, h);
    c.set(12, 5, h);
    c.col(12, 6, 8, dark(h));
  },
  mohawk(c, h) {
    c.col(6, 0, 3, h);
    c.col(7, 0, 3, dark(h));
    c.set(6, 0, lite(h));
  },
  curls(c, h) {
    c.row(1, 4, 9, h);
    c.row(2, 3, 10, h);
    c.row(3, 2, 11, h);
    c.set(2, 4, h);
    c.set(11, 4, dark(h));
    c.set(3, 1, h);
    c.set(10, 1, h);
    c.set(5, 0, h);
    c.set(8, 0, h);
    c.set(2, 5, h);
    c.set(11, 5, dark(h));
  },
  bun(c, h) {
    c.rect(6, 0, 7, 1, h);
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    c.set(3, 4, h);
    c.set(10, 4, dark(h));
  },
  wild(c, h) {
    c.row(3, 3, 10, h);
    c.row(2, 3, 10, h);
    for (const x of [3, 5, 7, 9]) c.set(x, 1, h);
    for (const x of [2, 6, 10]) c.set(x, 0, h);
    c.set(2, 3, h);
    c.set(11, 3, dark(h));
    c.set(2, 5, h);
    c.set(11, 5, dark(h));
  },
  pigtails(c, h) {
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    c.set(2, 5, h);
    c.col(1, 6, 8, h);
    c.set(11, 5, h);
    c.col(12, 6, 8, dark(h));
  },
  curtain(c, h) {
    c.row(1, 4, 9, h);
    c.row(2, 3, 10, h);
    c.rect(2, 3, 11, 5, h);
    c.col(2, 6, 11, h);
    c.col(3, 6, 9, h);
    c.col(4, 6, 7, h);
    c.col(11, 6, 11, dark(h));
    c.col(10, 6, 9, dark(h));
  },
  balding(c, h) {
    c.set(3, 4, h);
    c.set(3, 5, h);
    c.set(10, 4, dark(h));
    c.set(10, 5, dark(h));
    c.set(4, 3, h);
    c.set(9, 3, dark(h));
  },
  fringe(c, h) {
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    c.row(4, 3, 10, h);
    c.set(3, 5, h);
    c.set(10, 5, dark(h));
  },
};
const HATS = {
  hood(c, col) {
    c.row(1, 4, 9, col);
    c.row(2, 3, 10, col);
    c.rect(2, 3, 11, 4, col);
    c.col(2, 5, 11, col);
    c.col(3, 5, 11, col);
    c.col(11, 5, 11, dark(col));
    c.col(10, 5, 11, dark(col));
    c.row(12, 4, 9, dark(col));
  },
  tophat(c, col) {
    c.rect(4, 0, 9, 2, col);
    c.row(2, 4, 9, lite(col));
    c.row(3, 2, 11, col);
    c.col(9, 0, 1, dark(col));
  },
  cap(c, col) {
    c.row(2, 4, 9, col);
    c.row(3, 3, 10, col);
    c.row(4, 9, 12, dark(col));
  },
  bonnet(c, col) {
    c.row(1, 4, 9, col);
    c.row(2, 3, 10, col);
    c.row(3, 2, 11, col);
    c.col(2, 4, 8, col);
    c.col(11, 4, 8, dark(col));
    c.set(6, 12, col);
    c.set(7, 12, col);
  },
  nurse(c) {
    c.rect(4, 1, 9, 3, WHITE);
    c.set(6, 2, RED);
    c.set(7, 2, RED);
    c.set(6, 1, RED);
    c.set(7, 3, RED);
    c.row(3, 3, 10, WHITE);
  },
  bowler(c, col) {
    c.row(0, 5, 8, col);
    c.rect(4, 1, 9, 2, col);
    c.row(3, 2, 11, col);
    c.set(9, 1, dark(col));
  },
  bandana(c, col) {
    c.row(3, 3, 10, col);
    c.row(4, 3, 10, dark(col));
    c.set(11, 4, col);
    c.set(12, 5, col);
  },
  crown(c) {
    c.row(2, 4, 9, GOLD);
    c.set(4, 1, GOLD);
    c.set(6, 1, GOLD);
    c.set(7, 0, GOLD);
    c.set(9, 1, GOLD);
    c.set(6, 2, RED);
  },
};
const done = (c, shade = true) => {
  if (shade) c.shade();
  c.outline();
  return c;
};

function makeHeads() {
  /* ordinary people, 140 of them: every combination is a little different */
  const skins = Object.keys(SKINS),
    hairs = Object.keys(HAIRS),
    hcols = Object.keys(HAIR),
    exprs = Object.keys(EXPR),
    hats = Object.keys(HATS),
    cloths = Object.keys(CLOTH);
  const seen = new Set();
  for (let i = 0; seen.size < 140; i++) {
    const skin = skins[(i * 3 + Math.floor(i / 14)) % skins.length],
      hair = hairs[i % hairs.length],
      hc = hcols[(i * 5 + 2 + Math.floor(i / 9)) % hcols.length],
      ex = exprs[(i * 7 + Math.floor(i / 5)) % exprs.length];
    const hat = i % 5 === 3 ? hats[Math.floor(i / 5) % hats.length] : null,
      hatCol = cloths[(i * 2 + 1) % cloths.length];
    const key = [skin, hat || hair, hat ? hatCol : hc, ex].join();
    if (seen.has(key)) continue;
    seen.add(key);
    const c = canvas(14, 13);
    face(c, SKINS[skin]);
    if (hat) {
      if (hat !== 'hood' && hat !== 'bonnet') HAIRS.cropped(c, HAIR[hc]);
      HATS[hat](c, CLOTH[hatCol]);
    } else HAIRS[hair](c, HAIR[hc]);
    EXPR[ex](c, SKINS[skin]);
    emit(
      'h',
      `${hat ? hat + ' ' + (hat === 'nurse' || hat === 'crown' ? '' : hatCol) : hair + ' ' + hc + ' hair'} ${skin} ${ex}`.replace(/\s+/g, ' '),
      done(c),
    );
  }
  /* the others: 25 kinds, two of each */
  const special = (name, draw) => {
    for (let v = 0; v < 2; v++) {
      const c = canvas(14, 13);
      const outlineIt = draw(c, v);
      emit('h', name + (v ? ' variant' : ''), outlineIt === false ? c : done(c));
    }
  };
  special('skull', (c, v) => {
    const b = v ? hex('#a9a48f') : BONE;
    c.row(2, 5, 8, b);
    c.rect(3, 3, 10, 7, b);
    c.rect(4, 8, 9, 9, b);
    c.rect(5, 10, 8, 11, b);
    c.rect(4, 5, 5, 6, K);
    c.rect(8, 5, 9, 6, K);
    c.set(6, 8, K);
    c.set(7, 8, K);
    c.set(5, 10, K);
    c.set(7, 10, K);
    c.set(6, 11, dark(b));
    c.set(8, 11, dark(b));
    if (v) c.col(8, 2, 3, K);
  });
  special('pumpkin', (c, v) => {
    const o = v ? hex('#7d8a3a') : hex('#b8641f');
    c.row(2, 5, 8, o);
    c.rect(3, 3, 10, 10, o);
    c.row(11, 5, 8, o);
    c.col(2, 5, 8, o);
    c.col(11, 5, 8, dark(o));
    c.rect(6, 0, 7, 1, hex('#3d5a2a'));
    c.set(4, 5, K);
    c.set(5, 5, K);
    c.set(5, 4, K);
    c.set(8, 5, K);
    c.set(9, 5, K);
    c.set(8, 4, K);
    for (const [x, y] of [
      [4, 8],
      [5, 9],
      [6, 8],
      [7, 9],
      [8, 8],
      [9, 9],
    ])
      c.set(x, y, K);
    c.col(6, 3, 4, dark(o));
  });
  special('sack mask', (c, v) => {
    const s = v ? hex('#6f6652') : hex('#9c8a62');
    c.rect(3, 2, 10, 11, s);
    c.row(12, 4, 9, dark(s));
    c.set(5, 5, K);
    c.set(8, 6, K);
    c.set(9, 6, K);
    for (let x = 5; x <= 8; x++) c.set(x, 9, x % 2 ? K : dark(s));
    c.set(3, 2, dark(s));
    c.set(10, 2, dark(s));
    c.row(1, 5, 7, s);
    if (v) c.col(4, 3, 7, dark(s));
  });
  special('plague doctor', (c, v) => {
    const m = v ? hex('#3a2c22') : hex('#cfc6a8'),
      hd = hex('#1e1b24');
    HATS.hood(c, hd);
    c.rect(4, 4, 9, 8, m);
    c.rect(5, 9, 8, 10, m);
    c.row(8, 9, 12, m);
    c.row(9, 9, 13, dark(m));
    c.set(5, 6, K);
    c.set(8, 6, K);
    c.set(5, 5, hex('#7a2a2a'));
    c.set(8, 5, hex('#7a2a2a'));
    HATS.tophat(c, hd);
  });
  special('clown', (c, v) => {
    const w = WHITE;
    face(c, w);
    const hc = v ? hex('#2f5a5c') : RED;
    c.rect(1, 3, 2, 6, hc);
    c.rect(11, 3, 12, 6, dark(hc));
    c.set(2, 2, hc);
    c.set(11, 2, hc);
    c.set(5, 6, K);
    c.set(8, 6, K);
    c.set(5, 5, hex('#28304e'));
    c.set(8, 5, hex('#28304e'));
    c.rect(6, 7, 7, 8, RED);
    c.set(4, 9, RED);
    c.row(10, 5, 8, RED);
    c.set(9, 9, RED);
  });
  special('ghost sheet', (c, v) => {
    const w = v ? hex('#b9c4cc') : WHITE;
    c.row(1, 5, 8, w);
    c.rect(3, 2, 10, 12, w);
    c.col(2, 4, 12, w);
    c.col(11, 4, 12, dark(w));
    c.rect(4, 5, 5, 7, K);
    c.rect(8, 5, 9, 7, K);
    if (v) c.rect(6, 9, 7, 10, K);
    c.clear(4, 12);
    c.clear(7, 12);
    c.clear(10, 12);
  });
  special('mummy', (c, v) => {
    const b = v ? hex('#a59a78') : BONE;
    face(c, b);
    c.row(2, 4, 9, b);
    for (const y of [4, 6, 8, 10]) c.row(y, 3, 10, dark(b));
    c.rect(7, 5, 9, 5, K);
    c.set(8, 5, v ? RED : hex('#c9b84a'));
    c.set(11, 9, b);
    c.set(12, 10, dark(b));
  });
  special('vampire', (c, v) => {
    const s = hex('#cfcabb');
    face(c, s);
    const hh = v ? HAIR.white : HAIR.black;
    c.row(2, 4, 9, hh);
    c.row(3, 3, 10, hh);
    c.set(6, 4, hh);
    c.set(7, 4, hh);
    c.set(3, 4, hh);
    c.set(10, 4, hh);
    c.set(5, 6, RED);
    c.set(8, 6, RED);
    c.row(9, 5, 8, K);
    c.set(5, 10, WHITE);
    c.set(8, 10, WHITE);
    c.set(2, 6, s);
    c.set(11, 6, dark(s));
  });
  special('werewolf', (c, v) => {
    const f = v ? hex('#6b6b70') : hex('#5a3e2a');
    c.rect(3, 3, 10, 9, f);
    c.row(2, 4, 9, f);
    c.rect(5, 9, 8, 11, lite(f));
    c.set(3, 1, f);
    c.set(3, 2, f);
    c.set(10, 1, f);
    c.set(10, 2, f);
    c.set(5, 6, hex('#c9b84a'));
    c.set(8, 6, hex('#c9b84a'));
    c.set(6, 9, K);
    c.set(7, 9, K);
    c.set(5, 11, WHITE);
    c.set(8, 11, WHITE);
    c.set(2, 6, f);
    c.set(11, 6, dark(f));
  });
  special('porcelain doll', (c, v) => {
    const s = hex('#e2dccd');
    face(c, s);
    HAIRS.curls(c, v ? HAIR.black : HAIR.blond);
    c.rect(4, 5, 5, 6, K);
    c.rect(8, 5, 9, 6, K);
    c.set(4, 5, hex('#4d7a8a'));
    c.set(8, 5, hex('#4d7a8a'));
    c.set(4, 8, hex('#c98a8a'));
    c.set(9, 8, hex('#c98a8a'));
    c.row(9, 6, 7, RED);
    c.set(9, 3, K);
    c.set(8, 4, K);
    c.set(9, 5, K);
  });
  special('gas mask', (c, v) => {
    const r = v ? hex('#4a4f3a') : hex('#33323a');
    c.rect(3, 2, 10, 10, r);
    c.row(1, 5, 8, r);
    c.rect(4, 4, 5, 6, hex('#8fa6a0'));
    c.rect(8, 4, 9, 6, hex('#8fa6a0'));
    c.set(4, 4, WHITE);
    c.set(8, 4, WHITE);
    c.rect(5, 8, 8, 11, dark(r));
    c.rect(6, 9, 7, 12, hex('#6b6b70'));
    c.row(7, 3, 10, dark(r));
  });
  special('rabbit mask', (c, v) => {
    const w = v ? hex('#b7aca0') : WHITE;
    face(c, w);
    c.col(4, 0, 2, w);
    c.col(5, 0, 2, w);
    c.col(8, 0, 2, w);
    c.col(9, 0, 2, dark(w));
    c.set(4, 1, hex('#c98a8a'));
    c.set(8, 1, hex('#c98a8a'));
    c.rect(4, 5, 5, 6, K);
    c.rect(8, 5, 9, 6, K);
    c.set(6, 8, hex('#c98a8a'));
    c.set(7, 8, hex('#c98a8a'));
    c.col(6, 9, 10, K);
    if (v) c.set(9, 9, BLOOD);
  });
  special('crow head', (c, v) => {
    const b = v ? hex('#3a3442') : hex('#17141c');
    c.rect(3, 3, 9, 10, b);
    c.row(2, 4, 8, b);
    c.row(11, 5, 8, b);
    c.rect(9, 6, 12, 7, hex('#8a7a3a'));
    c.set(13, 7, hex('#6a5a2a'));
    c.set(7, 5, WHITE);
    c.set(8, 5, K);
    c.set(4, 1, b);
    c.set(6, 1, b);
    c.set(3, 6, lite(b));
  });
  special('television head', (c, v) => {
    const b = hex('#4a4338');
    c.rect(2, 3, 11, 11, b);
    c.rect(3, 4, 9, 10, v ? hex('#8fa6a0') : hex('#1e2a24'));
    c.set(10, 5, RED);
    c.set(10, 7, GOLD);
    c.col(5, 0, 2, K);
    c.col(8, 1, 2, K);
    c.set(4, 0, K);
    if (v) {
      for (let y = 4; y <= 10; y += 2) c.row(y, 3, 9, WHITE);
    } else {
      c.set(5, 6, hex('#7fd08a'));
      c.set(7, 6, hex('#7fd08a'));
      c.row(8, 5, 7, hex('#7fd08a'));
    }
  });
  special('paper bag', (c, v) => {
    const p = v ? hex('#8a7550') : hex('#b39a68');
    c.rect(3, 2, 10, 12, p);
    c.set(3, 2, null);
    for (const x of [3, 5, 7, 9]) c.set(x, 1, p);
    c.rect(5, 5, 5, 6, K);
    c.rect(8, 5, 8, 6, K);
    for (const [x, y] of [
      [4, 8],
      [5, 9],
      [6, 9],
      [7, 9],
      [8, 9],
      [9, 8],
    ])
      c.set(x, y, v ? RED : K);
    c.col(6, 2, 4, dark(p));
  });
  special('white mask', (c, v) => {
    const w = v ? hex('#c9c2ad') : WHITE;
    face(c, w);
    HAIRS.cropped(c, HAIR.black);
    c.rect(4, 5, 5, 6, K);
    c.rect(8, 5, 9, 6, K);
    for (const [x, y] of [
      [5, 8],
      [8, 8],
      [6, 9],
      [7, 9],
      [4, 9],
      [9, 9],
    ])
      c.set(x, y, dark(dark(w)));
    if (v) {
      c.set(4, 4, RED);
      c.set(5, 3, RED);
    }
  });
  special('diving helmet', (c, v) => {
    const m = v ? hex('#5a6b5a') : hex('#8a6a2e');
    c.rect(2, 2, 11, 11, m);
    c.row(1, 4, 9, m);
    c.row(12, 3, 10, dark(m));
    c.rect(4, 4, 9, 8, hex('#22323a'));
    c.set(5, 5, hex('#8fa6bb'));
    c.row(4, 4, 9, lite(m));
    c.col(4, 4, 8, lite(m));
    c.set(2, 6, GOLD);
    c.set(11, 6, GOLD);
    c.col(7, 4, 8, dark(m));
  });
  special('one eye', (c, v) => {
    const s = v ? SKINS.rotten : SKINS.ashen;
    face(c, s);
    c.rect(5, 5, 8, 7, WHITE);
    c.rect(6, 5, 7, 7, v ? hex('#8a6a2e') : hex('#3a6a7a'));
    c.set(6, 6, K);
    c.set(7, 6, K);
    c.row(9, 5, 8, K);
    c.set(6, 10, WHITE);
  });
  special('no face', (c, v) => {
    const s = v ? SKINS.ashen : SKINS.pale;
    face(c, s);
    if (v) HAIRS.curtain(c, HAIR.black);
    else HAIRS.long(c, HAIR.black);
    c.set(7, 7, s);
  });
  special('stitched', (c, v) => {
    const s = v ? hex('#8a947a') : SKINS.rotten;
    c.rect(3, 2, 10, 10, s);
    c.row(11, 4, 9, s);
    c.row(1, 3, 10, HAIR.black);
    c.row(2, 3, 10, HAIR.black);
    c.set(5, 6, K);
    c.set(8, 6, K);
    c.set(5, 5, WHITE);
    c.row(9, 5, 8, K);
    for (const x of [4, 6, 8]) c.set(x, 4, K);
    c.row(4, 3, 9, dark(s));
    c.set(2, 7, hex('#6b6b70'));
    c.set(11, 7, hex('#6b6b70'));
  });
  special('jester', (c, v) => {
    face(c, SKINS.pale);
    const a = v ? CLOTH.plum : CLOTH.wine,
      b = v ? CLOTH.mustard : CLOTH.forest;
    c.rect(3, 2, 6, 3, a);
    c.rect(7, 2, 10, 3, b);
    c.set(2, 1, a);
    c.set(1, 0, a);
    c.set(11, 1, b);
    c.set(12, 0, b);
    c.set(1, 1, GOLD);
    c.set(12, 1, GOLD);
    EXPR.grin(c, SKINS.pale);
    c.set(4, 6, a);
    c.set(9, 6, b);
  });
  special('old hag', (c, v) => {
    const s = v ? SKINS.rotten : SKINS.ashen;
    face(c, s);
    HAIRS.wild(c, HAIR.white);
    c.set(5, 6, K);
    c.set(8, 6, K);
    c.set(7, 8, dark(s));
    c.set(8, 8, dark(s));
    c.set(9, 8, hex('#5a3e2a'));
    c.row(10, 5, 7, K);
    c.set(6, 10, WHITE);
    c.row(5, 4, 5, dark(s));
    c.row(5, 8, 9, dark(s));
  });
  special('drowned girl', (c, v) => {
    const s = SKINS.drowned;
    face(c, s);
    HAIRS.curtain(c, v ? HAIR.brown : HAIR.black);
    c.set(8, 6, WHITE);
    c.set(8, 7, K);
    c.col(6, 3, 9, v ? HAIR.brown : HAIR.black);
    c.col(5, 3, 7, v ? HAIR.brown : HAIR.black);
    c.set(7, 10, K);
  });
  special('blindfold', (c, v) => {
    const s = v ? SKINS.tan : SKINS.pale;
    face(c, s);
    HAIRS.parted(c, v ? HAIR.black : HAIR.brown);
    c.rect(3, 5, 10, 6, v ? BLOOD : hex('#cfc8b4'));
    c.set(11, 6, hex('#cfc8b4'));
    c.set(12, 7, hex('#a8a08a'));
    c.set(5, 7, v ? BLOOD : null);
    c.row(9, 6, 7, K);
  });
  special('deer skull', (c, v) => {
    const b = v ? hex('#a9a48f') : BONE;
    c.rect(4, 3, 9, 7, b);
    c.rect(5, 8, 8, 11, b);
    c.rect(4, 5, 5, 6, K);
    c.rect(8, 5, 9, 6, K);
    c.col(6, 10, 11, K);
    for (const [x, y] of [
      [3, 2],
      [2, 1],
      [2, 0],
      [1, 2],
      [4, 1],
      [10, 2],
      [11, 1],
      [11, 0],
      [12, 2],
      [9, 1],
    ])
      c.set(x, y, hex('#8a7a5a'));
  });
}

/* =====================================================================================
 * TORSOS  12 x 11.  Shoulders row 1 (x 1..10), body rows 2..9 (x 2..9).
 * ===================================================================================== */
function body(c, col, wide = false) {
  c.row(1, 1, 10, col);
  c.rect(2, 2, 9, 9, col);
  if (wide) {
    c.rect(1, 6, 10, 9, col);
  }
  c.set(1, 1, lite(col));
  c.set(2, 2, lite(col));
  c.col(9, 2, 9, dark(col));
}
const TORSOS = {
  shirt(c, col, skin) {
    body(c, col);
    c.set(5, 1, skin);
    c.set(6, 1, skin);
    c.set(5, 2, dark(col));
    c.set(6, 2, dark(col));
  },
  suit(c, col) {
    body(c, col);
    c.rect(5, 1, 6, 6, WHITE);
    c.col(5, 2, 5, BLOOD);
    c.set(4, 2, dark(col));
    c.set(7, 2, dark(col));
    c.set(4, 3, dark(col));
    c.set(7, 3, dark(col));
    c.set(5, 8, GOLD);
  },
  dress(c, col, skin) {
    body(c, col, true);
    c.set(5, 1, skin);
    c.set(6, 1, skin);
    c.row(5, 2, 9, dark(col));
    c.clear(2, 5);
    c.clear(9, 5);
    c.clear(2, 4);
    c.clear(9, 4);
  },
  coat(c, col) {
    body(c, col);
    c.col(5, 1, 9, dark(col));
    for (const y of [3, 5, 7]) c.set(6, y, GOLD);
    c.set(4, 1, lite(col));
    c.set(7, 1, lite(col));
  },
  stripes(c, col) {
    body(c, col);
    for (const y of [2, 4, 6, 8]) c.row(y, 2, 9, WHITE);
    c.col(9, 2, 9, dark(col));
  },
  apron(c, col) {
    body(c, col);
    c.rect(3, 3, 8, 9, WHITE);
    c.set(3, 2, WHITE);
    c.set(8, 2, WHITE);
    c.set(5, 6, BLOOD);
    c.set(6, 7, BLOOD);
    c.set(4, 8, BLOOD);
    c.set(6, 5, BLOOD);
  },
  robe(c, col) {
    body(c, col, true);
    c.row(6, 2, 9, hex('#9c8a62'));
    c.col(6, 7, 9, hex('#9c8a62'));
    c.col(5, 1, 5, dark(col));
  },
  overalls(c, col, skin) {
    body(c, hex('#8d8a84'));
    c.rect(3, 4, 8, 9, col);
    c.col(3, 1, 3, col);
    c.col(8, 1, 3, col);
    c.set(3, 4, GOLD);
    c.set(8, 4, GOLD);
    c.set(5, 1, skin);
    c.set(6, 1, skin);
  },
  rags(c, col, skin) {
    body(c, col);
    c.clear(2, 9);
    c.clear(4, 9);
    c.clear(7, 9);
    c.clear(9, 8);
    c.clear(9, 9);
    c.set(4, 4, skin);
    c.set(5, 5, skin);
    c.set(7, 7, skin);
    c.set(3, 7, dark(col));
    c.set(6, 3, dark(col));
  },
  nightgown(c, col) {
    body(c, col, true);
    c.row(1, 4, 7, WHITE);
    c.row(2, 4, 7, WHITE);
    c.set(5, 3, WHITE);
    c.col(5, 4, 9, lite(col));
  },
  uniform(c, col) {
    body(c, col);
    c.row(6, 2, 9, K);
    c.set(5, 6, GOLD);
    c.set(3, 3, GOLD);
    c.col(5, 1, 5, dark(col));
    c.row(1, 1, 2, GOLD);
    c.row(1, 9, 10, GOLD);
  },
  ribs(c) {
    c.col(5, 1, 9, BONE);
    c.col(6, 1, 9, dark(BONE));
    for (const y of [2, 4, 6]) {
      c.row(y, 2, 9, BONE);
      c.set(2, y + 1, BONE);
      c.set(9, y + 1, dark(BONE));
    }
    c.row(9, 3, 8, BONE);
    c.row(1, 1, 10, BONE);
  },
  bandages(c, col) {
    body(c, col);
    for (const y of [2, 4, 6, 8]) c.row(y, 2, 9, dark(col));
    c.set(4, 5, BLOOD);
    c.set(10, 6, col);
  },
  straitjacket(c) {
    body(c, hex('#cfc5a8'));
    for (const y of [3, 6]) {
      c.row(y, 1, 10, hex('#584031'));
      c.set(5, y, GOLD);
    }
    c.row(8, 2, 9, dark(hex('#cfc5a8')));
  },
  vest(c, col) {
    body(c, WHITE);
    c.rect(2, 2, 4, 9, col);
    c.rect(7, 2, 9, 9, dark(col));
    c.row(1, 1, 3, col);
    c.row(1, 8, 10, col);
    c.col(5, 2, 8, hex('#a8a08a'));
  },
  jumper(c, col) {
    body(c, col);
    c.set(4, 1, WHITE);
    c.set(7, 1, WHITE);
    c.set(5, 2, WHITE);
    c.set(6, 2, WHITE);
    c.row(9, 2, 9, dark(col));
    c.row(8, 2, 9, dark(col));
    for (const x of [3, 5, 7]) c.set(x, 5, lite(col));
  },
  bloodied(c, col) {
    body(c, col);
    for (const [x, y] of [
      [4, 3],
      [5, 3],
      [5, 4],
      [6, 4],
      [6, 5],
      [4, 5],
      [7, 6],
      [5, 7],
      [6, 8],
      [3, 6],
    ])
      c.set(x, y, BLOOD);
    c.set(5, 5, RED);
  },
  cassock(c, col) {
    body(c, col, true);
    c.row(1, 4, 7, WHITE);
    c.col(5, 3, 6, GOLD);
    c.row(4, 4, 6, GOLD);
  },
  corset(c, col) {
    body(c, col);
    c.clear(2, 5);
    c.clear(9, 5);
    c.clear(2, 6);
    c.clear(9, 6);
    for (const y of [3, 4, 5, 6, 7]) c.set(5, y, y % 2 ? WHITE : K);
    c.row(1, 3, 8, WHITE);
  },
  waistcoat(c, col) {
    body(c, WHITE);
    c.rect(3, 3, 8, 9, col);
    for (const y of [4, 6, 8]) c.set(5, y, GOLD);
    c.set(3, 2, col);
    c.set(8, 2, col);
    c.set(5, 2, BLOOD);
    c.set(6, 2, BLOOD);
  },
};
function makeTorsos() {
  const styles = Object.keys(TORSOS),
    cloths = Object.keys(CLOTH),
    skins = Object.keys(SKINS);
  const fixed = { ribs: 4, straitjacket: 3 }; // these do not take a colour: a few shades of wear instead
  let n = 0;
  for (let round = 0; n < 130; round++) {
    for (const st of styles) {
      if (n >= 130) break;
      if (fixed[st] != null && round >= fixed[st]) continue;
      const col = cloths[(round * 5 + styles.indexOf(st) * 3) % cloths.length],
        skin = skins[(round + styles.indexOf(st)) % 5];
      const c = canvas(12, 11);
      TORSOS[st](c, CLOTH[col], SKINS[skin]);
      if (fixed[st] != null && round) {
        const r = rnd(round * 31 + st.length);
        for (let i = 0; i < round * 2; i++) {
          const x = 2 + Math.floor(r() * 8),
            y = 2 + Math.floor(r() * 8);
          if (c.get(x, y)) c.set(x, y, round % 2 ? BLOOD : dark(c.get(x, y)));
        }
      }
      emit('t', `${st} ${fixed[st] != null ? (round ? 'worn ' + round : '') : col}`.trim(), done(c, false));
      n++;
    }
  }
}

/* =====================================================================================
 * ARMS  5 x 12.  The arm is x 1..3, rows 0..10; the hand is the last two rows.
 * ===================================================================================== */
const ARMS = {
  sleeve(c, col, skin) {
    c.rect(1, 0, 3, 8, col);
    c.rect(1, 9, 3, 10, skin);
    c.col(3, 0, 8, dark(col));
  },
  short(c, col, skin) {
    c.rect(1, 0, 3, 3, col);
    c.rect(1, 4, 3, 10, skin);
    c.col(3, 4, 10, dark(skin));
  },
  bare(c, col, skin) {
    c.rect(1, 0, 3, 10, skin);
    c.col(3, 0, 10, dark(skin));
    c.set(1, 0, lite(skin));
  },
  glove(c, col) {
    c.rect(1, 0, 3, 7, col);
    c.rect(1, 8, 3, 10, K);
    c.row(8, 1, 3, hex('#33323a'));
    c.col(3, 0, 7, dark(col));
  },
  striped(c, col, skin) {
    c.rect(1, 0, 3, 8, col);
    for (const y of [1, 3, 5, 7]) c.row(y, 1, 3, WHITE);
    c.rect(1, 9, 3, 10, skin);
  },
  ragged(c, col, skin) {
    c.rect(1, 0, 3, 5, col);
    c.set(1, 6, col);
    c.set(3, 6, col);
    c.rect(1, 7, 3, 10, skin);
    c.set(2, 6, skin);
    c.col(3, 7, 10, dark(skin));
  },
  bone(c) {
    c.col(2, 0, 10, BONE);
    c.set(1, 0, BONE);
    c.set(3, 0, BONE);
    c.set(1, 5, BONE);
    c.set(3, 5, dark(BONE));
    c.set(1, 10, BONE);
    c.set(3, 10, BONE);
    c.set(1, 9, BONE);
    c.set(3, 9, dark(BONE));
  },
  bandaged(c, col) {
    c.rect(1, 0, 3, 10, BONE);
    for (const y of [1, 3, 5, 7, 9]) c.row(y, 1, 3, dark(BONE));
    c.set(4, 6, BONE);
    c.set(4, 7, dark(BONE));
  },
  claw(c, col, skin) {
    c.rect(1, 0, 3, 8, skin);
    c.col(3, 0, 8, dark(skin));
    c.set(0, 9, skin);
    c.set(2, 9, skin);
    c.set(4, 9, skin);
    c.set(0, 10, K);
    c.set(2, 10, K);
    c.set(4, 10, K);
    c.set(1, 9, skin);
    c.set(3, 9, skin);
  },
  puffed(c, col, skin) {
    c.rect(0, 0, 4, 2, col);
    c.rect(1, 3, 3, 8, col);
    c.rect(1, 9, 3, 10, skin);
    c.col(4, 0, 2, dark(col));
  },
  cuffed(c, col, skin) {
    c.rect(1, 0, 3, 7, col);
    c.row(8, 1, 3, WHITE);
    c.rect(1, 9, 3, 10, skin);
    c.col(3, 0, 7, dark(col));
    c.set(2, 8, GOLD);
  },
  bloody(c, col, skin) {
    c.rect(1, 0, 3, 6, col);
    c.rect(1, 7, 3, 10, BLOOD);
    c.set(2, 6, BLOOD);
    c.set(1, 11, BLOOD);
    c.col(3, 0, 6, dark(col));
    c.set(2, 9, RED);
  },
  hook(c, col) {
    c.rect(1, 0, 3, 7, col);
    c.row(8, 1, 3, hex('#584031'));
    c.set(2, 9, hex('#8d8a84'));
    c.set(2, 10, hex('#8d8a84'));
    c.set(3, 11, hex('#8d8a84'));
    c.set(4, 10, hex('#8d8a84'));
    c.col(3, 0, 7, dark(col));
  },
  robe(c, col, skin) {
    c.rect(1, 0, 3, 5, col);
    c.rect(0, 6, 4, 8, col);
    c.rect(1, 9, 3, 10, skin);
    c.col(4, 6, 8, dark(col));
  },
  chained(c, col, skin) {
    c.rect(1, 0, 3, 7, skin);
    c.row(8, 0, 4, hex('#6b6b70'));
    c.rect(1, 9, 3, 10, skin);
    c.set(4, 9, hex('#8d8a84'));
    c.set(4, 11, hex('#8d8a84'));
    c.set(3, 10, hex('#6b6b70'));
    c.col(3, 0, 7, dark(skin));
  },
};
function makeArms() {
  const styles = Object.keys(ARMS),
    cloths = Object.keys(CLOTH),
    skins = Object.keys(SKINS);
  const single = { bone: 3, bandaged: 3 };
  let n = 0;
  for (let round = 0; n < 90; round++)
    for (const st of styles) {
      if (n >= 90) break;
      if (single[st] != null && round >= single[st]) continue;
      const col = cloths[(round * 7 + styles.indexOf(st) * 2) % cloths.length],
        skin = skins[(round * 2 + styles.indexOf(st)) % skins.length];
      const c = canvas(5, 12);
      ARMS[st](c, CLOTH[col], SKINS[skin]);
      if (single[st] != null && round) {
        c.set(2, 3 + round * 2, round % 2 ? BLOOD : dark(BONE));
      }
      const usesCloth = !['bare', 'bone', 'bandaged', 'claw', 'chained'].includes(st),
        usesSkin = !['glove', 'bone', 'bandaged', 'hook'].includes(st);
      emit('a', `${st} ${usesCloth ? col : ''} ${usesSkin ? skin + ' hand' : ''}`.replace(/\s+/g, ' ').trim(), done(c, false));
      n++;
    }
}

/* =====================================================================================
 * LEGS  6 x 12.  The leg is x 1..4, rows 0..9; the foot is rows 10..11 and points right.
 * ===================================================================================== */
const shoe = (c, col) => {
  c.rect(1, 10, 5, 11, col);
  c.row(11, 1, 5, dark(col));
  c.clear(5, 10);
};
const LEGS = {
  trousers(c, col) {
    c.rect(1, 0, 4, 9, col);
    c.col(4, 0, 9, dark(col));
    shoe(c, K);
  },
  shorts(c, col, skin) {
    c.rect(1, 0, 4, 3, col);
    c.rect(1, 4, 4, 9, skin);
    c.col(4, 4, 9, dark(skin));
    shoe(c, hex('#584031'));
  },
  bare(c, col, skin) {
    c.rect(1, 0, 4, 9, skin);
    c.col(4, 0, 9, dark(skin));
    c.rect(1, 10, 5, 11, skin);
    c.clear(5, 10);
    c.set(5, 11, dark(skin));
  },
  boots(c, col) {
    c.rect(1, 0, 4, 5, col);
    c.rect(1, 6, 4, 9, hex('#3a2c22'));
    shoe(c, hex('#3a2c22'));
    c.row(6, 1, 4, hex('#584031'));
    c.col(4, 0, 5, dark(col));
  },
  stockings(c, col) {
    c.rect(1, 0, 4, 9, col);
    for (const y of [1, 3, 5, 7, 9]) c.row(y, 1, 4, WHITE);
    shoe(c, K);
  },
  ragged(c, col, skin) {
    c.rect(1, 0, 4, 6, col);
    c.set(1, 7, col);
    c.set(3, 7, col);
    c.rect(1, 8, 4, 9, skin);
    c.set(2, 7, skin);
    c.set(4, 7, skin);
    c.rect(1, 10, 5, 11, skin);
    c.clear(5, 10);
  },
  bone(c) {
    c.col(2, 0, 9, BONE);
    c.col(3, 0, 9, dark(BONE));
    c.row(0, 1, 4, BONE);
    c.row(5, 1, 4, BONE);
    c.rect(1, 10, 5, 11, BONE);
    c.clear(5, 10);
    c.set(1, 10, dark(BONE));
  },
  bandaged(c) {
    c.rect(1, 0, 4, 11, BONE);
    for (const y of [1, 3, 5, 7, 9]) c.row(y, 1, 4, dark(BONE));
    c.set(5, 11, BONE);
    c.set(0, 6, BONE);
  },
  skirt(c, col, skin) {
    c.rect(0, 0, 5, 4, col);
    c.row(4, 0, 5, dark(col));
    c.rect(2, 5, 3, 9, skin);
    shoe(c, K);
    c.clear(1, 10);
  },
  robe(c, col) {
    c.rect(0, 0, 5, 11, col);
    c.col(5, 0, 11, dark(col));
    c.row(11, 0, 5, dark(col));
    c.col(2, 3, 10, dark(col));
  },
  pyjamas(c, col) {
    c.rect(1, 0, 4, 9, WHITE);
    for (const x of [2, 4]) c.col(x, 0, 9, col);
    c.rect(1, 10, 5, 11, hex('#8d8a84'));
    c.clear(5, 10);
  },
  wellies(c, col) {
    c.rect(1, 0, 4, 3, hex('#565663'));
    c.rect(1, 4, 4, 9, col);
    shoe(c, col);
    c.row(4, 1, 4, lite(col));
    c.col(4, 5, 9, dark(col));
  },
  pegleg(c, col) {
    c.rect(1, 0, 4, 4, col);
    c.col(2, 5, 11, hex('#584031'));
    c.col(3, 5, 11, hex('#3a2c22'));
    c.row(5, 1, 4, hex('#6b6b70'));
  },
  shackled(c, col, skin) {
    c.rect(1, 0, 4, 5, col);
    c.rect(1, 6, 4, 9, skin);
    c.row(8, 0, 5, hex('#6b6b70'));
    c.rect(1, 10, 5, 11, skin);
    c.clear(5, 10);
    c.set(5, 9, hex('#8d8a84'));
  },
  bloody(c, col) {
    c.rect(1, 0, 4, 9, col);
    for (const [x, y] of [
      [2, 3],
      [3, 4],
      [2, 5],
      [3, 6],
      [2, 7],
      [1, 8],
      [3, 9],
    ])
      c.set(x, y, BLOOD);
    shoe(c, BLOOD);
  },
};
function makeLegs() {
  const styles = Object.keys(LEGS),
    cloths = Object.keys(CLOTH),
    skins = Object.keys(SKINS);
  const single = { bone: 3, bandaged: 3 };
  let n = 0;
  for (let round = 0; n < 90; round++)
    for (const st of styles) {
      if (n >= 90) break;
      if (single[st] != null && round >= single[st]) continue;
      const col = cloths[(round * 5 + styles.indexOf(st) * 3 + 1) % cloths.length],
        skin = skins[(round * 3 + styles.indexOf(st)) % skins.length];
      const c = canvas(6, 12);
      LEGS[st](c, CLOTH[col], SKINS[skin]);
      if (single[st] != null && round) c.set(2, 2 + round * 2, round % 2 ? BLOOD : dark(BONE));
      const usesSkin = ['shorts', 'bare', 'ragged', 'skirt', 'shackled'].includes(st),
        usesCloth = !['bare', 'bone', 'bandaged'].includes(st);
      emit('l', `${st} ${usesCloth ? col : ''} ${usesSkin ? skin : ''}`.replace(/\s+/g, ' ').trim(), done(c, false));
      n++;
    }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
makeHeads();
makeTorsos();
makeArms();
makeLegs();
const total = Object.values(parts).reduce((n, l) => n + l.length, 0);
fs.writeFileSync(
  path.join(OUT, 'index.json'),
  JSON.stringify({ size: { h: [14, 13], t: [12, 11], a: [5, 12], l: [6, 12] }, heads: parts.h, torsos: parts.t, arms: parts.a, legs: parts.l }),
);
console.log(`doll parts: ${parts.h.length} heads, ${parts.t.length} torsos, ${parts.a.length} arms, ${parts.l.length} legs = ${total}`);
if (total !== EXPECT) {
  console.error(`expected ${EXPECT}`);
  process.exit(1);
}
