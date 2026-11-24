/*
 * Two more dark settings at paper-doll scale, every thing with its four pictures (main, the other perspective, and
 * both after someone used it):
 *   env-hell        the underworld as an old horror game shows it: bone, basalt, chains and fire
 *   env-nightmare   the things of bad dreams: quiet and wrong rather than gory
 * The things themselves are in _env2-hell-*.js. Each is written as one or two functions f(c, used) and s(c, used):
 * the main picture and the other perspective, drawn fresh for the unused and the used state. A function may
 * return another function, which is run after the picture got its shading and outline (for sparks, drips, light).
 */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, canvas } = kit;
  const out = {};
  const add = (slug, cat, catLabel, name, def) => {
    if (out[slug]) throw new Error('env2-hell: ' + slug + ' twice');
    out[slug] = { cat, catLabel, name, ...def };
  };
  /**
   * maker(cat, label)(slug, name, o) with o = {
   *   w, h, f(c, used)          the main picture
   *   sw, sh, s(c, used)        the other perspective (left out for round things)
   *   uw, uh / suw, suh         another canvas size for the used pictures
   *   base: 'side'              the main picture is the long side
   *   solid: false, shade: false, outline: false }
   */
  const maker = (cat, label) => (slug, name, o) => {
    const wrap = (fn, u) => (c) => {
      const after = fn(c, u);
      if (o.shade !== false) c.shade();
      if (o.outline !== false) c.outline();
      if (typeof after === 'function') after();
      return false;
    };
    const views = {};
    if (o.base) views.base = o.base;
    if (o.s) views.side = { w: o.sw, h: o.sh || o.h, draw: wrap(o.s, false) };
    views.used = { w: o.uw || o.w, h: o.uh || o.h, draw: wrap(o.f, true) };
    if (o.s) views.sideUsed = { w: o.suw || o.sw, h: o.suh || o.sh || o.h, draw: wrap(o.s, true) };
    add(slug, cat, label, name, { w: o.w, h: o.h, solid: o.solid !== false, draw: wrap(o.f, false), views });
  };

  /* ---------- shared helpers ---------- */
  const D = dark,
    L = lite;
  /* the colours of the pit */
  const P = {
    OBS: hex('#2b2533'), // obsidian
    OBL: hex('#4a4058'),
    BAS: hex('#463c42'), // basalt
    BASL: hex('#63565a'),
    BRIM: hex('#5e3029'), // red rock
    BRIML: hex('#7c4234'),
    EMBER: hex('#b8401f'),
    LAVA: hex('#d96a25'),
    LAVAL: hex('#eeb04a'),
    SULF: hex('#a79a3a'),
    SULFL: hex('#c9bd5c'),
    CHAR: hex('#2a2224'),
    BONE: C.bone,
    BONED: hex('#a89c7c'),
    BL: C.blood,
    BD: hex('#5c1418'),
    NI: C.night,
    SOUL: hex('#8fc0b4'), // a soul's light
    SOULD: hex('#4f8478'),
    HIDE: hex('#7a5a44'),
    DEMON: hex('#6a2a2a'),
    /* the colours of bad dreams */
    WALLP: hex('#7d7460'),
    SHEET: hex('#c4bfae'),
    SHEETD: hex('#9c9888'),
    PJ: hex('#6f7f8c'),
    SHADOW: hex('#18141c'),
    SKIN: hex('#b9a48e'),
    SICK: hex('#8a917a'),
    DWATER: hex('#1d2630'),
    DWATERL: hex('#33434e'),
    BUSY: hex('#a8892e'), // school-bus yellow, gone dull
    BUSYL: hex('#c2a443'),
    LINO: hex('#74806f'),
    SCREEN: hex('#9aa7a0'),
    CARP: hex('#6e3a3a'),
  };
  const dots = (c, col, pts) => {
    for (let i = 0; i < pts.length; i += 2) c.set(pts[i], pts[i + 1], col);
  };
  /** A picture of its own, not yet shaded or outlined, to stamp, turn or mirror. */
  const part = (w, h, draw) => {
    const t = canvas(w, h);
    draw(t);
    return t;
  };
  /** A picture fallen over: its top goes to the left (or to the right). */
  const turn = (t, right = false) => {
    const o = canvas(t.h, t.w);
    for (let y = 0; y < t.h; y++)
      for (let x = 0; x < t.w; x++) {
        const p = t.get(x, y);
        if (p) right ? o.set(t.h - 1 - y, x, p) : o.set(y, t.w - 1 - x, p);
      }
    return o;
  };
  /** A heavy chain, three pixels wide around x. */
  function chain(c, x, y0, y1, col = C.iron) {
    for (let y = y0; y <= y1; y++) {
      const k = (y - y0) % 5;
      if (k === 1 || k === 2) {
        c.set(x - 1, y, col);
        c.set(x + 1, y, D(col));
      } else c.set(x, y, k === 4 ? D(col) : col);
    }
  }
  /** A heavy chain lying along a row, or sagging between two points. */
  function chainH(c, x0, x1, y, col = C.iron, sag = 0) {
    const n = x1 - x0 || 1;
    for (let x = x0; x <= x1; x++) {
      const t = (x - x0) / n,
        yy = Math.round(y + sag * 4 * t * (1 - t)),
        k = (x - x0) % 4;
      if (k === 1 || k === 2) {
        c.set(x, yy - 1, col);
        c.set(x, yy + 1, D(col));
      } else c.set(x, yy, k === 3 ? D(col) : col);
    }
  }
  /** A thin chain or cord of two tones (any direction). */
  function thin(c, x0, y0, x1, y1, col = C.iron) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    for (let i = 0; i <= n; i++) c.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, i % 2 ? D(col) : col);
  }
  /** Rust or soot eating what is drawn in the box. */
  function rusty(c, x0, y0, x1, y1, seed = 1, every = 5, col = C.rust) {
    const r = rnd(seed + x0 * 3 + y1),
      n = Math.max(1, Math.round(((x1 - x0 + 1) * (y1 - y0 + 1)) / (every * 14))),
      put = (x, y, k) => c.get(x, y) && c.get(x, y) !== K && c.set(x, y, k);
    for (let i = 0; i < n * 3; i++) {
      const x = x0 + ((r() * (x1 - x0 + 1)) | 0),
        y = y0 + ((r() * (y1 - y0 + 1)) | 0);
      if (i % 3) {
        put(x, y, i % 2 ? col : D(col));
        continue;
      }
      put(x, y, col);
      put(x + 1, y, col);
      put(x, y + 1, col);
      if (r() < 0.6) put(x + 1, y + 1, D(col));
      if (r() < 0.5) put(x, y + 2, D(col));
    }
  }
  /** A drip running down from x, y. */
  function drip(c, x, y, n, col = P.BL) {
    c.col(x, y, y + n - 1, col);
    c.set(x, y + n, D(col));
  }
  /** A flat pool on the floor row b from x0 to x1. */
  function pool(c, x0, x1, b, col = P.BL) {
    c.row(b, x0, x1, col);
    c.row(b - 1, x0 + 2, x1 - 2, col);
    c.set(x0 + 3, b - 1, L(col));
  }
  /** Vertical bars from x0 to x1 every `step`. */
  function bars(c, x0, x1, y0, y1, col, step = 3) {
    for (let x = x0; x <= x1; x += step) c.col(x, y0, y1, col);
  }
  /** The edge of an ellipse in the box. */
  function ring(c, x0, y0, x1, y1, col) {
    const cx = (x0 + x1) / 2,
      cy = (y0 + y1) / 2,
      rx = (x1 - x0 + 1) / 2,
      ry = (y1 - y0 + 1) / 2,
      inside = (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++)
        if (inside(x, y) && !(inside(x - 1, y) && inside(x + 1, y) && inside(x, y - 1) && inside(x, y + 1))) c.set(x, y, col);
  }
  /** A tongue of fire standing on row b around x, h high, about 2w + 1 wide at its foot. */
  function flame(c, x, b, h, w = 2, seed = 0, cols = [P.EMBER, C.flame, C.flameLight]) {
    for (let i = 0; i < h; i++) {
      const t = i / h,
        hw = Math.max(0, Math.round(w * (1 - t * t) - (i === 0 && w > 1 ? 1 : 0))),
        sx = x + (i > h * 0.45 ? Math.round(Math.sin(i * 1.3 + seed) * 0.9) : 0);
      for (let d = -hw; d <= hw; d++) {
        const e = Math.abs(d) / (hw + 0.5);
        c.set(sx + d, b - i, t > 0.72 || e > 0.7 ? cols[0] : t < 0.4 && e < 0.4 ? cols[2] : cols[1]);
      }
    }
  }
  /** A row of flames between x0 and x1 on row b. */
  function fire(c, x0, x1, b, h, seed = 1, cols) {
    const r = rnd(seed + x0 + b);
    for (let x = x0 + 1; x <= x1 - 1; x += 3) flame(c, x, b, Math.max(2, Math.round(h * (0.55 + r() * 0.45))), 2, seed + x, cols);
    c.row(b, x0, x1, (cols || [P.EMBER])[0]);
  }
  /** Sparks: single bright pixels, to put on after the outline. */
  function sparks(c, pts, col = C.flameLight) {
    dots(c, col, pts);
  }
  /** A skull seen from the front: 5 x 5, or 7 x 7 when big. x, y is its top left corner. */
  function skull(c, x, y, big = false, col = P.BONE, eye = P.NI) {
    if (big) {
      c.rect(x, y + 1, x + 6, y + 4, col);
      c.row(y, x + 1, x + 5, L(col));
      c.rect(x + 1, y + 5, x + 5, y + 6, col);
      c.rect(x + 1, y + 2, x + 2, y + 3, eye);
      c.rect(x + 4, y + 2, x + 5, y + 3, eye);
      c.set(x + 3, y + 4, eye);
      dots(c, D(col), [x + 2, y + 6, x + 4, y + 6, x + 6, y + 4, x + 6, y + 3]);
    } else {
      c.rect(x, y + 1, x + 4, y + 3, col);
      c.row(y, x + 1, x + 3, L(col));
      c.row(y + 4, x + 1, x + 3, col);
      dots(c, eye, [x + 1, y + 2, x + 3, y + 2]);
      dots(c, D(col), [x + 2, y + 4, x + 4, y + 3]);
    }
  }
  /** A skull in profile looking right (or left): 5 x 5. */
  function skullS(c, x, y, left = false, col = P.BONE, eye = P.NI) {
    const f = (i) => (left ? x + 4 - i : x + i);
    for (let i = 0; i <= 4; i++) c.col(f(i), y + 1, y + 2, col);
    for (let i = 1; i <= 3; i++) c.set(f(i), y, L(col));
    for (let i = 1; i <= 4; i++) c.set(f(i), y + 3, col);
    c.set(f(2), y + 4, col);
    c.set(f(3), y + 4, D(col));
    c.set(f(3), y + 2, eye);
    c.set(f(0), y + 2, D(col));
  }
  /** A bone from one point to another, with a knob at each end. */
  function bone(c, x0, y0, x1, y1, col = P.BONE) {
    c.line(x0, y0, x1, y1, col);
    const dx = Math.abs(x1 - x0) >= Math.abs(y1 - y0);
    for (const [x, y] of [[x0, y0], [x1, y1]]) {
      if (dx) {
        c.set(x, y - 1, col);
        c.set(x, y + 1, D(col));
      } else {
        c.set(x - 1, y, col);
        c.set(x + 1, y, D(col));
      }
    }
  }
  /** A rough boulder or heap in the box: jagged on top, lit from the left. */
  function rock(c, x0, y0, x1, y1, col, seed = 1, peak = 0.45) {
    const r = rnd(seed + x0 + y1 * 3),
      w = x1 - x0 || 1;
    let j = 0;
    for (let x = x0; x <= x1; x++) {
      const t = (x - x0) / w,
        d = Math.abs(t - peak) / Math.max(peak, 1 - peak),
        dome = Math.pow(d, 2.4) * (y1 - y0);
      if (r() < 0.5) j = Math.round((r() - 0.5) * 2.6);
      const top = Math.min(y1, Math.max(y0, Math.round(y0 + dome + j)));
      c.col(x, top, y1, t > 0.7 ? D(col) : col);
      c.set(x, top, t < peak + 0.1 ? L(col) : col);
      if (r() < 0.25 && top + 2 < y1) c.set(x, top + 2 + ((r() * (y1 - top - 2)) | 0), D(col));
    }
  }
  /** A spike or stalagmite standing on row b: w wide at the foot, h high, leaning by `lean` pixels at the tip. */
  function spike(c, x, b, h, w, col, lean = 0) {
    for (let i = 0; i < h; i++) {
      const t = i / (h - 1 || 1),
        ww = Math.max(1, Math.round(w * (1 - t))),
        x0 = Math.round(x - ww / 2 + lean * t);
      c.row(b - i, x0, x0 + ww - 1, col);
      c.set(x0, b - i, L(col));
      if (ww > 2) c.set(x0 + ww - 1, b - i, D(col));
    }
  }
  /** A spoked wheel around cx, cy. */
  function wheel(c, cx, cy, r, rim, spoke = D(rim), hub = rim, n = 8) {
    for (let k = 0; k < n; k++) {
      const a = (k * Math.PI * 2) / n + 0.39;
      c.line(cx, cy, cx + Math.cos(a) * (r - 1), cy + Math.sin(a) * (r - 1), spoke);
    }
    ring(c, cx - r, cy - r, cx + r, cy + r, rim);
    c.rect(cx - 1, cy - 1, cx + 1, cy + 1, hub);
    c.set(cx, cy, D(hub));
  }
  /** A rubber tyre with a hubcap. */
  function tyre(c, cx, cy, r, cap = C.steel) {
    c.oval(cx - r, cy - r, cx + r, cy + r, C.black);
    ring(c, cx - r, cy - r, cx + r, cy + r, P.NI);
    c.oval(cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2, cap);
    c.set(cx, cy, D(cap));
    c.set(cx - 1, cy - 1, L(cap));
  }
  /** Two eyes. */
  function eyes(c, x, y, col = P.EMBER, gap = 2) {
    c.set(x, y, col);
    c.set(x + gap, y, col);
  }
  /** Stamp a picture with a dark pixel right of and under every pixel: for wire and thread, which an outline would drown. */
  function shadowed(c, t, x = 0, y = 0) {
    for (let j = 0; j < t.h; j++)
      for (let i = 0; i < t.w; i++)
        if (t.get(i, j)) {
          if (!t.get(i + 1, j)) c.set(x + i + 1, y + j, K);
          if (!t.get(i, j + 1)) c.set(x + i, y + j + 1, K);
        }
    c.stamp(t, x, y);
  }
  /** Planks: a wooden face with board lines every `step` rows (or columns when upright). */
  function planks(c, x0, y0, x1, y1, col, step = 4, upright = false) {
    c.rect(x0, y0, x1, y1, col);
    if (upright) for (let x = x0 + step - 1; x < x1; x += step) c.col(x, y0, y1, D(col));
    else for (let y = y0 + step - 1; y < y1; y += step) c.row(y, x0, x1, D(col));
    c.row(y0, x0, x1, L(col));
    c.col(x0, y0, y1, L(col));
  }
  /** A dark human shape standing on row b: head, shoulders, body. w is the shoulder width. */
  function shade(c, x, b, h, w = 6, col = P.SHADOW) {
    const top = b - h + 1,
      hw = Math.max(3, Math.round(w * 0.6)),
      hx = x - (hw >> 1);
    c.rect(hx, top, hx + hw - 1, top + hw - 1, col);
    c.rect(x - (w >> 1), top + hw + 1, x - (w >> 1) + w - 1, b, col);
    c.row(top + hw, x - (w >> 1) + 1, x - (w >> 1) + w - 2, col);
  }
  const H = { ...kit, P, D, L, dots, part, turn, chain, chainH, thin, rusty, drip, pool, bars, ring, flame, fire, sparks, skull, skullS, bone, rock, spike, wheel, tyre, eyes, shadowed, planks, shade };

  for (const f of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6']) {
    let m;
    try {
      m = require('./_env2-hell-' + f + '.js');
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && /_env2-hell-/.test(e.message)) continue;
      throw e;
    }
    m(H, f[0] === 'h' ? maker('env-hell', 'Hell') : maker('env-nightmare', 'Nightmare'));
  }
  return out;
};
