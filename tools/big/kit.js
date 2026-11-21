/*
 * The drawing kit for the large-scale art (tools/make-big.js): a canvas of any size with the same look as the
 * paper-doll characters (tools/make-dolls.js) — flat colours from a muted palette, light from the left, a dark
 * line around the silhouette. One canvas pixel is one doll pixel: a person is 16 wide and 33 tall, a floor tile
 * is 16 x 16, so a single bed is about 34 x 18 and a door about 18 x 36.
 */
const zlib = require('zlib');

/* ---------- PNG out and in ---------- */
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
/** px: an array of w*h entries, each null (see-through) or [r, g, b] or [r, g, b, a]. */
function png(w, h, px) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const c = px[y * w + x],
        o = y * (w * 4 + 1) + 1 + x * 4;
      if (c) {
        raw[o] = c[0];
        raw[o + 1] = c[1];
        raw[o + 2] = c[2];
        raw[o + 3] = c[3] == null ? 255 : c[3];
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
/** Read a PNG (8 bit; grey, RGB, palette or RGBA; not interlaced) into { w, h, px } with px as for png(). */
function readPng(buf) {
  let o = 8,
    w = 0,
    h = 0,
    type = 6,
    pal = null,
    trns = null;
  const idat = [];
  while (o < buf.length) {
    const len = buf.readUInt32BE(o),
      t = buf.toString('latin1', o + 4, o + 8),
      d = buf.subarray(o + 8, o + 8 + len);
    if (t === 'IHDR') {
      w = d.readUInt32BE(0);
      h = d.readUInt32BE(4);
      type = d[9];
      if (d[8] !== 8 || d[12]) throw new Error('unsupported PNG');
    } else if (t === 'PLTE') pal = d;
    else if (t === 'tRNS') trns = d;
    else if (t === 'IDAT') idat.push(d);
    o += len + 12;
  }
  const n = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[type],
    raw = zlib.inflateSync(Buffer.concat(idat)),
    line = w * n,
    out = Buffer.alloc(line * h);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (line + 1)];
    for (let i = 0; i < line; i++) {
      const v = raw[y * (line + 1) + 1 + i],
        a = i >= n ? out[y * line + i - n] : 0,
        b = y ? out[(y - 1) * line + i] : 0,
        c = y && i >= n ? out[(y - 1) * line + i - n] : 0;
      let p = 0;
      if (f === 1) p = a;
      else if (f === 2) p = b;
      else if (f === 3) p = (a + b) >> 1;
      else if (f === 4) {
        const q = a + b - c,
          pa = Math.abs(q - a),
          pb = Math.abs(q - b),
          pc = Math.abs(q - c);
        p = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[y * line + i] = (v + p) & 255;
    }
  }
  const px = new Array(w * h).fill(null);
  for (let i = 0; i < w * h; i++) {
    const q = i * n;
    let c;
    if (type === 6) c = [out[q], out[q + 1], out[q + 2], out[q + 3]];
    else if (type === 2) c = [out[q], out[q + 1], out[q + 2], 255];
    else if (type === 3) c = [pal[out[q] * 3], pal[out[q] * 3 + 1], pal[out[q] * 3 + 2], trns && out[q] < trns.length ? trns[out[q]] : 255];
    else if (type === 4) c = [out[q], out[q], out[q], out[q + 1]];
    else c = [out[q], out[q], out[q], 255];
    px[i] = c[3] < 128 ? null : [c[0], c[1], c[2]];
  }
  return { w, h, px };
}

/* ---------- colours: the doll palette, plus materials ---------- */
const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
const mix = (c, k) => c.map((v) => Math.max(0, Math.min(255, Math.round(v * k))));
const blend = (a, b, t = 0.5) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const dark = (c) => mix(c, 0.68),
  lite = (c) => mix(c, 1.22);
const C = {
  K: '#0b0a10', // the outline
  white: '#e4dfd0',
  bone: '#d8d0b4',
  blood: '#8f1d1d',
  red: '#b3342c',
  gold: '#b8963a',
  brass: '#9a7a34',
  wood: '#6b4630',
  woodDark: '#4a2f22',
  woodLight: '#8c6240',
  woodPale: '#a8855c',
  stone: '#77747a',
  stoneDark: '#4f4d56',
  stoneLight: '#9a979a',
  iron: '#4a4a55',
  ironDark: '#2e2e38',
  steel: '#8b8e98',
  rust: '#84482a',
  glass: '#5d7f8c',
  glassLight: '#9ebcc2',
  water: '#34566b',
  moss: '#4a5e36',
  leaf: '#2e4835',
  leafLight: '#4f6b3c',
  earth: '#584031',
  straw: '#a8904e',
  paper: '#c8bea3',
  parchment: '#b5a47c',
  flame: '#d98b2b',
  flameLight: '#e9c45a',
  glow: '#d9d38a',
  ghost: '#aebfc4',
  flesh: '#c79f7c',
  rot: '#7c9668',
  wine: '#6b2332',
  navy: '#28304e',
  forest: '#2e4835',
  mustard: '#a07e2c',
  slate: '#565663',
  plum: '#48305a',
  teal: '#2e5658',
  cream: '#c8bea3',
  black: '#1e1b24',
  ash: '#8d8a84',
  night: '#16141d',
};
for (const k of Object.keys(C)) C[k] = hex(C[k]);
const K = C.K;

/** A small repeatable random number, so the same sprite comes out every time. */
const rnd = (seed) => {
  let s = seed * 9301 + 49297;
  return () => (s = (s * 233280 + 12345) % 2147483647) / 2147483647;
};

function canvas(w, h) {
  const px = new Array(w * h).fill(null);
  const c = {
    w,
    h,
    px,
    set(x, y, col) {
      x = Math.round(x);
      y = Math.round(y);
      if (x >= 0 && y >= 0 && x < w && y < h && col) px[y * w + x] = col;
    },
    get(x, y) {
      return x >= 0 && y >= 0 && x < w && y < h ? px[y * w + x] : null;
    },
    clear(x, y) {
      if (x >= 0 && y >= 0 && x < w && y < h) px[y * w + x] = null;
    },
    clearRect(x0, y0, x1, y1) {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) c.clear(x, y);
    },
    rect(x0, y0, x1, y1, col) {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) c.set(x, y, col);
    },
    /** A rectangle with a lighter top and left edge and a darker bottom and right edge. */
    box(x0, y0, x1, y1, col) {
      c.rect(x0, y0, x1, y1, col);
      c.row(y0, x0, x1, lite(col));
      c.col(x0, y0, y1, lite(col));
      c.row(y1, x0, x1, dark(col));
      c.col(x1, y0, y1, dark(col));
    },
    /** The edge of a rectangle only. */
    frame(x0, y0, x1, y1, col) {
      c.row(y0, x0, x1, col);
      c.row(y1, x0, x1, col);
      c.col(x0, y0, y1, col);
      c.col(x1, y0, y1, col);
    },
    row(y, x0, x1, col) {
      c.rect(x0, y, x1, y, col);
    },
    col(x, y0, y1, col) {
      c.rect(x, y0, x, y1, col);
    },
    line(x0, y0, x1, y1, col) {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
      for (let i = 0; i <= n; i++) c.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, col);
    },
    /** A filled ellipse inside the box x0..x1, y0..y1. */
    oval(x0, y0, x1, y1, col) {
      const cx = (x0 + x1) / 2,
        cy = (y0 + y1) / 2,
        rx = (x1 - x0 + 1) / 2,
        ry = (y1 - y0 + 1) / 2;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) c.set(x, y, col);
    },
    /** A filled shape from corner points [[x, y], ...]. */
    poly(pts, col) {
      const ys = pts.map((p) => p[1]);
      for (let y = Math.min(...ys); y <= Math.max(...ys); y++) {
        const xs = [];
        for (let i = 0; i < pts.length; i++) {
          const [ax, ay] = pts[i],
            [bx, by] = pts[(i + 1) % pts.length];
          if (ay === by) {
            if (ay === y) xs.push(ax, bx);
          } else if (y >= Math.min(ay, by) && y <= Math.max(ay, by)) xs.push(ax + ((bx - ax) * (y - ay)) / (by - ay));
        }
        if (xs.length) c.row(y, Math.round(Math.min(...xs)), Math.round(Math.max(...xs)), col);
      }
    },
    /** Sprinkle a second colour over what is already drawn in the box (wood grain, dirt, rust): every n-th pixel or so. */
    speckle(x0, y0, x1, y1, col, every = 5, seed = 1) {
      const r = rnd(seed + x0 * 7 + y0 * 13);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (c.get(x, y) && c.get(x, y) !== K && r() < 1 / every) c.set(x, y, col);
    },
    /** A checkerboard of a second colour over what is drawn in the box: a soft half-tone. */
    dither(x0, y0, x1, y1, col) {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if ((x + y) % 2 === 0 && c.get(x, y)) c.set(x, y, col);
    },
    /** Copy another canvas onto this one at x, y (optionally mirrored left to right). */
    stamp(o, x, y, flip = false) {
      for (let j = 0; j < o.h; j++)
        for (let i = 0; i < o.w; i++) {
          const p = o.get(flip ? o.w - 1 - i : i, j);
          if (p) c.set(x + i, y + j, p);
        }
    },
    /** Mirror the left half onto the right half (for things that are the same on both sides). */
    mirror() {
      for (let y = 0; y < h; y++) for (let x = 0; x < w >> 1; x++) px[y * w + (w - 1 - x)] = px[y * w + x];
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
    /** A dark line around the silhouette, where there is room for one. Leave a pixel free around the drawing. */
    outline(col = K) {
      const add = [];
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) if (!c.get(x, y) && (c.get(x - 1, y) || c.get(x + 1, y) || c.get(x, y - 1) || c.get(x, y + 1))) add.push([x, y]);
      for (const [x, y] of add) px[y * w + x] = col;
    },
  };
  return c;
}

/** Double a picture with the Scale2x rule: edges stay sharp, diagonals get smoother. */
function scale2x(src) {
  const { w, h } = src,
    out = canvas(w * 2, h * 2),
    key = (p) => (p ? (p[0] << 16) | (p[1] << 8) | p[2] : -1);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const P = src.get(x, y),
        A = src.get(x, y - 1),
        B = src.get(x + 1, y),
        Cc = src.get(x - 1, y),
        D = src.get(x, y + 1),
        a = key(A),
        b = key(B),
        cc = key(Cc),
        d = key(D);
      const put = (i, j, v) => {
        if (v) out.px[(y * 2 + j) * w * 2 + x * 2 + i] = v;
      };
      put(0, 0, cc === a && cc !== d && a !== b ? A || null : P);
      put(1, 0, a === b && a !== cc && b !== d ? B || null : P);
      put(0, 1, d === cc && d !== b && cc !== a ? Cc || null : P);
      put(1, 1, b === d && b !== a && d !== cc ? D || null : P);
    }
  return out;
}
function fromPng(buf) {
  const im = readPng(buf),
    c = canvas(im.w, im.h);
  im.px.forEach((p, i) => (c.px[i] = p));
  return c;
}

module.exports = { png, readPng, fromPng, canvas, scale2x, hex, mix, blend, dark, lite, rnd, C, K };
