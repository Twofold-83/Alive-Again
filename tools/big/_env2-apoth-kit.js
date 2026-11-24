/* Helpers for tools/big/env2-apoth.js (Apothecary, Old time): how an object is registered with its four
 * pictures, and small drawing routines shared by the three settings. Not a module of its own (the name starts with _). */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, canvas } = kit;
  const D = dark,
    L = lite;
  const out = {};

  /** A view { w, h, draw } that calls fn(c, used). pad = [left, top, right]: extra room around the base picture;
   *  fn still draws in the coordinates of the base picture (x from -left, y from -top, x up to w - 1 + right). */
  const mk = (fn, w, h, pad, used, extra) => {
    const [l, t, r] = pad || [0, 0, 0];
    return {
      w: w + l + r,
      h: h + t,
      ...extra,
      draw(c) {
        if (!(l || t || r)) return fn(c, used);
        const { set, get, clear } = c,
          W0 = c.w,
          H0 = c.h;
        c.set = (x, y, col) => set(Math.round(x) + l, Math.round(y) + t, col);
        c.get = (x, y) => get(x + l, y + t);
        c.clear = (x, y) => clear(x + l, y + t);
        c.w = w;
        c.h = h;
        try {
          fn(c, used);
        } finally {
          Object.assign(c, { set, get, clear, w: W0, h: H0 });
        }
      },
    };
  };
  /**
   * reg(cat, label) gives add(slug, name, s) with s = {
   *   w, h, f(c, used)          the main picture (and its used state)
   *   sw, sh, s(c, used)        the other perspective; left out: the thing is round, f is used again
   *   base: 'side'              the main picture is the long side, s is the front
   *   u, su: [left, top, right] extra room the used pictures need
   *   us, sus: [w, h]           or a canvas of another size altogether for the used pictures (a thing fallen over)
   *   solid, o                  o: options for every picture (shade: false ...)
   * }
   */
  const reg = (cat, catLabel) => (slug, name, s) => {
    if (out[slug]) throw new Error('env2-apoth: ' + slug + ' twice');
    const side = s.s || s.f,
      sw = s.s ? s.sw : s.sw || s.w,
      sh = s.sh || s.h,
      o = s.o || {};
    out[slug] = {
      cat,
      catLabel,
      name,
      w: s.w,
      h: s.h,
      solid: !!s.solid,
      ...o,
      draw: (c) => s.f(c, false),
      views: {
        ...(s.base ? { base: 'side' } : {}),
        side: mk(side, sw, sh, null, false, o),
        used: s.us ? mk(s.f, s.us[0], s.us[1], null, true, o) : mk(s.f, s.w, s.h, s.u, true, o),
        sideUsed: s.sus || (!s.s && s.us) ? mk(side, (s.sus || s.us)[0], (s.sus || s.us)[1], null, true, o) : mk(side, sw, sh, s.su || (s.s ? null : s.u), true, o),
      },
    };
  };

  /* ---------- small routines ---------- */
  const dots = (c, col, pts) => {
    for (let i = 0; i < pts.length; i += 2) c.set(pts[i], pts[i + 1], col);
  };
  /** A board: lighter on top, darker below. */
  function board(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    if (y1 > y0) c.row(y1, x0, x1, D(col));
  }
  /** A plain wooden face lit from the left. */
  function face(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.col(x0, y0, y1, L(col));
    c.col(x1, y0, y1, D(col));
  }
  /** A sunk panel: dark above and left, light below and right. */
  function panel(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, D(col));
    c.col(x0, y0, y1, D(col));
    c.row(y1, x0, x1, L(col));
    c.col(x1, y0, y1, L(col));
  }
  function drawer(c, x0, y0, x1, y1, col, knob = C.brass) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.row(y1, x0, x1, D(col));
    c.col(x1, y0, y1, D(col));
    const y = (y0 + y1) >> 1;
    if (x1 - x0 > 11) {
      c.set(x0 + 3, y, knob);
      c.set(x1 - 3, y, knob);
    } else c.set((x0 + x1) >> 1, y, knob);
  }
  function legs(c, xs, y0, y1, col = C.woodDark, w = 2) {
    for (const x of xs) {
      c.rect(x, y0, x + w - 1, y1, col);
      if (w > 1) c.col(x, y0, y1, L(col));
    }
  }
  /** A turned leg, one or two pixels wide with a bulge. */
  function tleg(c, x, y0, y1, col) {
    c.col(x, y0, y1, col);
    const m = (y0 + y1) >> 1;
    c.set(x - 1, m, col);
    c.set(x + 1, m, D(col));
    c.set(x, y0, L(col));
  }
  /** Vertical joints of planks. */
  function planksV(c, x0, y0, x1, y1, col, step = 4) {
    for (let x = x0 + step - 1; x < x1; x += step) c.col(x, y0, y1, col);
  }
  function planksH(c, x0, y0, x1, y1, col, step = 4) {
    for (let y = y0 + step - 1; y < y1; y += step) c.row(y, x0, x1, col);
  }
  /** The side of a cupboard: a plain face with one sunk panel. */
  function cabSide(c, x0, y0, x1, y1, col, pan = true) {
    face(c, x0, y0, x1, y1, col);
    if (pan && x1 - x0 > 4 && y1 - y0 > 6) panel(c, x0 + 2, y0 + 2, x1 - 2, y1 - 2, col);
  }
  /** The dark inside of something opened. */
  function hollow(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, mix(col, 0.36));
    c.row(y0, x0, x1, mix(col, 0.24));
    c.col(x0, y0, y1, mix(col, 0.28));
  }
  /** A pane of glass with a streak of light. */
  function pane(c, x0, y0, x1, y1, col = C.glass) {
    c.rect(x0, y0, x1, y1, col);
    const n = Math.min(x1 - x0, y1 - y0, 3);
    for (let i = 0; i <= n; i++) c.set(x0 + 1 + i, y1 - 1 - i > y0 ? y1 - 1 - i : y0, blend(col, C.glassLight, 0.7));
  }
  /** A flame standing on x, yb. */
  function flame(c, x, yb, n = 2) {
    c.set(x, yb, C.flame);
    c.set(x, yb - 1, C.flameLight);
    if (n > 2) {
      c.set(x - 1, yb, C.flame);
      c.set(x + 1, yb, C.flame);
      c.set(x, yb - 2, C.flameLight);
      c.set(x, yb, C.flameLight);
      c.set(x, yb - 3, C.flame);
    }
  }
  /** A fire in the box x0..x1 with its feet on yb: h high. */
  function fire(c, x0, x1, yb, h, seed = 1) {
    const r = rnd(seed);
    for (let x = x0; x <= x1; x++) {
      const m = 1 - Math.abs((x - (x0 + x1) / 2) / ((x1 - x0) / 2 + 0.5)),
        t = Math.max(1, Math.round(h * (0.35 + 0.65 * m) * (0.6 + 0.4 * r())));
      c.col(x, yb - t + 1, yb, C.flame);
      if (t > 2) c.col(x, yb - t + 3, yb, C.flameLight);
      if (t > 3 && r() < 0.6) c.set(x, yb - t + 1, C.red);
    }
    c.row(yb, x0, x1, C.flame);
  }
  /** Wisps of steam or smoke going up from x, y. */
  function wisp(c, x, y, n = 4, col = C.ash) {
    for (let i = 0; i < n; i++) c.set(x + (i % 2 ? 1 : 0) + (i > 3 ? 1 : 0), y - i, i % 3 === 2 ? blend(col, C.white, 0.4) : col);
  }
  /** A tapered flowerpot standing on yb. */
  function pot(c, x0, x1, yt, yb, col = hex('#8a4f36')) {
    c.rect(x0, yt, x1, yt + 1, col);
    c.row(yt, x0, x1, L(col));
    c.rect(x0 + 1, yt + 2, x1 - 1, yb, col);
    c.col(x0 + 1, yt + 2, yb, L(col));
    c.row(yt + 2, x0 + 1, x1 - 1, D(col));
    c.col(x1 - 1, yt + 2, yb, D(col));
  }
  /** A bottle standing on yb. */
  function bottle(c, x, yb, h, col, w = 2) {
    c.rect(x, yb - h + 3, x + w - 1, yb, col);
    c.col(x, yb - h + 3, yb, L(col));
    c.col(x + (w > 2 ? 1 : 0), yb - h + 1, yb - h + 2, col);
    c.set(x + (w > 2 ? 1 : 0), yb - h + 1, C.parchment);
  }
  /** A clump of leaves filling an oval. */
  function bush(c, x0, y0, x1, y1, seed = 1, col = C.leaf, hi = C.leafLight) {
    c.oval(x0, y0, x1, y1, col);
    const r = rnd(seed);
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        if (!c.get(x, y) || c.get(x, y) !== col) continue;
        const v = r(),
          left = (x - x0) / (x1 - x0 + 1) + (y - y0) / (y1 - y0 + 1);
        if (v < 0.3 - left * 0.14) c.set(x, y, hi);
        else if (v > 0.83 - left * 0.1) c.set(x, y, D(col));
      }
  }
  /** Leaves in a rectangle (a hedge, a clipped block). */
  function hedge(c, x0, y0, x1, y1, seed = 1, col = C.leaf, hi = C.leafLight) {
    c.rect(x0, y0, x1, y1, col);
    const r = rnd(seed);
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const v = r();
        if (v < 0.2) c.set(x, y, hi);
        else if (v > 0.8) c.set(x, y, D(col));
      }
    c.row(y0, x0, x1, hi);
  }
  /** Masonry: blocks with dark joints. */
  function stones(c, x0, y0, x1, y1, col, bh = 4, bw = 7, seed = 1) {
    c.rect(x0, y0, x1, y1, col);
    const r = rnd(seed),
      j = mix(col, 0.62);
    let k = 0;
    for (let y = y0; y <= y1; y += bh, k++) {
      if (y > y0) c.row(y, x0, x1, j);
      c.row(y + 1 > y1 ? y1 : y + (y > y0 ? 1 : 0), x0, x1, L(col));
      for (let x = x0 + (k % 2 ? bw >> 1 : bw) - 1; x < x1; x += bw) c.col(x, y + (y > y0 ? 1 : 0), Math.min(y1, y + bh - 1), j);
    }
    c.speckle(x0, y0, x1, y1, D(col), 14, seed);
    void r;
  }
  function bricks(c, x0, y0, x1, y1, col = hex('#7a4636'), seed = 1) {
    c.rect(x0, y0, x1, y1, col);
    const j = mix(col, 0.6);
    let k = 0;
    for (let y = y0 + 2; y <= y1; y += 3, k++) c.row(y, x0, x1, j);
    k = 0;
    for (let y = y0; y <= y1; y += 3, k++) for (let x = x0 + (k % 2 ? 2 : 5); x <= x1; x += 6) c.col(x, y, Math.min(y1, y + 1), j);
    c.speckle(x0, y0, x1, y1, L(col), 9, seed);
    c.speckle(x0, y0, x1, y1, D(col), 11, seed + 3);
  }
  /** A spoked wheel. */
  function wheel(c, cx, cy, r, col, hub = C.iron) {
    c.oval(cx - r, cy - r, cx + r, cy + r, col);
    if (r > 2) c.oval(cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1, null);
    for (let y = cy - r + 1; y <= cy + r - 1; y++) for (let x = cx - r + 1; x <= cx + r - 1; x++) if (((x - cx) / (r - 0.5)) ** 2 + ((y - cy) / (r - 0.5)) ** 2 <= 1) c.clear(x, y);
    c.line(cx - r + 1, cy, cx + r - 1, cy, D(col));
    c.line(cx, cy - r + 1, cx, cy + r - 1, D(col));
    if (r > 4) {
      c.line(cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2, D(col));
      c.line(cx - r + 2, cy + r - 2, cx + r - 2, cy - r + 2, D(col));
    }
    c.set(cx, cy, hub);
  }
  /** A cloth shape with a light upper edge and a few folds. */
  function cloth(c, pts, col, folds = []) {
    c.poly(pts, col);
    for (const [x0, y0, x1, y1] of folds) c.line(x0, y0, x1, y1, D(col));
  }
  /** A small heap (earth, coal, ash, leaves): a mound between x0 and x1 standing on yb. */
  function heap(c, x0, x1, yb, h, col, seed = 1) {
    const r = rnd(seed),
      m = (x0 + x1) / 2,
      hw = (x1 - x0) / 2 + 0.5;
    for (let x = x0; x <= x1; x++) {
      const t = Math.max(1, Math.round(h * Math.sqrt(Math.max(0, 1 - ((x - m) / hw) ** 2)) + (r() - 0.5)));
      c.col(x, yb - t + 1, yb, col);
      c.set(x, yb - t + 1, L(col));
    }
    c.speckle(x0, yb - h, x1, yb, D(col), 4, seed);
  }
  /** A blood stain. */
  function blood(c, pts) {
    dots(c, C.blood, pts);
  }
  /** Broken glass or china on the floor. */
  function shards(c, x0, x1, y, col, seed = 2) {
    const r = rnd(seed);
    for (let x = x0; x <= x1; x++) if (r() < 0.45) c.set(x, y - (r() < 0.3 ? 1 : 0), r() < 0.5 ? col : L(col));
  }
  /** A cupboard door standing open, seen flat (in a side view it sticks out to the right of x). */
  function doorOut(c, x, y0, y1, wd, col, glass) {
    face(c, x, y0, x + wd - 1, y1, col);
    if (glass) pane(c, x + 1, y0 + 1, x + wd - 2, y1 - 1, glass);
    else if (wd > 4 && y1 - y0 > 5) panel(c, x + 1, y0 + 1, x + wd - 2, y1 - 1, col);
    c.set(x + wd - 2, (y0 + y1) >> 1, C.brass);
  }
  /** A front opened: the dark inside, and the two doors edge on at the sides. */
  function opened(c, x0, y0, x1, y1, col) {
    hollow(c, x0, y0, x1, y1, col);
    c.col(x0, y0, y1, L(col));
    c.col(x1, y0, y1, L(col));
  }
  /* ---------- more routines for the two settings of env2-apoth ---------- */
  /** A jar standing on yb: w wide, h high, with a lid and (h > 4) a paper label. */
  function jar(c, x, yb, w, h, col, lid = C.woodDark, label = C.paper) {
    c.rect(x, yb - h + 2, x + w - 1, yb, col);
    c.col(x, yb - h + 2, yb, L(col));
    if (w > 2) c.col(x + w - 1, yb - h + 2, yb, D(col));
    c.row(yb - h + 1, x, x + w - 1, lid);
    if (lid && w > 2) c.set(x + ((w - 1) >> 1), yb - h, lid);
    if (label && h > 4) c.rect(x + (w > 3 ? 1 : 0), yb - (h >> 1), x + w - 1 - (w > 3 ? 1 : 0), yb - (h >> 1) + (h > 6 ? 1 : 0), label);
  }
  const GLASSES = [hex('#5d7f8c'), hex('#6a5a36'), hex('#3e5a48'), hex('#7a3a30'), hex('#44506e'), hex('#8a7a4a'), hex('#b9ad8a')];
  /** A shelf row of bottles and jars standing on yb from x0 to x1. gone: indexes left out (a gap). Returns the x of each. */
  function shelfRow(c, x0, x1, yb, seed = 1, maxH = 6, gone = []) {
    const r = rnd(seed),
      xs = [];
    let x = x0,
      i = 0;
    while (x <= x1) {
      const w = r() < 0.45 && x + 2 <= x1 ? 3 : r() < 0.5 && x + 1 <= x1 ? 2 : 1,
        h = Math.max(3, maxH - Math.floor(r() * 3)),
        col = GLASSES[Math.floor(r() * GLASSES.length)];
      if (x + w - 1 > x1) break;
      xs.push(x);
      if (!gone.includes(i)) {
        if (w === 1) {
          c.col(x, yb - h + 1, yb, col);
          c.set(x, yb - h + 1, C.parchment);
        } else if (w === 2) bottle(c, x, yb, h, col, 2);
        else jar(c, x, yb, 3, Math.min(h, maxH - 1), col, r() < 0.5 ? C.woodDark : C.brass);
      }
      x += w + 1;
      i++;
    }
    return xs;
  }
  /** A carboy: a pear-shaped show globe of coloured water with a stopper, standing on yb around cx. */
  function carboy(c, cx, yb, r, h, col, stopper = C.glassLight) {
    c.oval(cx - r, yb - 2 * r, cx + r, yb, col);
    c.rect(cx - 1, yb - h + 2, cx + 1, yb - 2 * r + 1, col);
    c.col(cx - 1, yb - h + 2, yb - 2 * r + 1, L(col));
    c.rect(cx - 1, yb - h, cx + 1, yb - h + 1, stopper);
    c.set(cx, yb - h - 1, stopper);
    for (let i = 0; i < r; i++) c.set(cx - r + 1 + (i >> 1), yb - r - i + 1, blend(col, C.white, 0.55));
    c.row(yb, cx - r + 1, cx + r - 1, D(col));
  }
  /** A spoked cart wheel seen from the side: a rim, an iron tyre on the ground side, eight spokes, a hub. */
  function cartWheel(c, cx, cy, r, col = C.wood, hub = C.ironDark) {
    for (let y = cy - r; y <= cy + r; y++)
      for (let x = cx - r; x <= cx + r; x++) {
        const d = Math.hypot(x - cx, y - cy);
        if (d <= r + 0.35 && d >= r - 1.2) c.set(x, y, x - cx + (y - cy) < -r * 0.6 ? L(col) : x - cx + (y - cy) > r * 0.8 ? D(col) : col);
        else if (d < r - 1.2) c.clear(x, y);
      }
    const sp = D(col);
    c.line(cx - r + 1, cy, cx + r - 1, cy, sp);
    c.line(cx, cy - r + 1, cx, cy + r - 1, sp);
    if (r > 3) {
      const k = Math.round((r - 1) * 0.7);
      c.line(cx - k, cy - k, cx + k, cy + k, sp);
      c.line(cx - k, cy + k, cx + k, cy - k, sp);
    }
    if (r > 5) c.rect(cx - 1, cy - 1, cx + 1, cy + 1, hub);
    c.set(cx, cy, r > 5 ? L(hub) : hub);
  }
  /** A wheel seen edge on (from the front or back of the cart): a narrow upright strip from y0 to y1. */
  function wheelEdge(c, x, y0, y1, col = C.wood, w = 2) {
    c.rect(x, y0 + 1, x + w - 1, y1 - 1, col);
    c.rect(x + (w > 2 ? 1 : 0), y0, x + w - 1 - (w > 2 ? 1 : 0), y1, col);
    c.col(x, y0 + 1, y1 - 1, L(col));
    if (w > 1) c.col(x + w - 1, y0 + 1, y1 - 1, D(col));
    c.row(y1, x, x + w - 1, C.ironDark);
  }
  /** A paper label. */
  function label(c, x0, y0, x1, y1, ink = C.slate) {
    c.rect(x0, y0, x1, y1, C.paper);
    if (x1 - x0 > 1) for (let y = y0 + (y1 > y0 ? 0 : 0); y <= y1; y += 2) c.row(y, x0 + 1, x1 - 1, y1 > y0 ? ink : C.paper);
  }
  /** A grid of small labelled drawers in x0..x1, y0..y1: cols x rows; open(i, j) → pulled out (dark hole). */
  function drawerGrid(c, x0, y0, x1, y1, cols, rws, col, open = () => false) {
    const dw = (x1 - x0 + 1) / cols,
      dh = (y1 - y0 + 1) / rws;
    for (let j = 0; j < rws; j++)
      for (let i = 0; i < cols; i++) {
        const ax = Math.round(x0 + i * dw),
          bx = Math.round(x0 + (i + 1) * dw) - 2,
          ay = Math.round(y0 + j * dh),
          by = Math.round(y0 + (j + 1) * dh) - 2;
        if (open(i, j)) {
          hollow(c, ax, ay, bx, by, col);
        } else {
          c.rect(ax, ay, bx, by, col);
          c.row(ay, ax, bx, L(col));
          c.col(bx, ay, by, D(col));
          if (by - ay >= 2) {
            c.row(ay + 1, ax + 1, bx - 1, C.paper);
            c.set((ax + bx) >> 1, by, C.brass);
          } else c.set((ax + bx) >> 1, (ay + by + 1) >> 1, C.brass);
        }
      }
  }
  /** Glow around a light: a few pixels of pale yellow. */
  function glow(c, x, y, col = C.glow) {
    dots(c, col, [x - 1, y, x + 1, y, x, y - 1]);
  }
  /** A dark puddle or stain on the floor row yb. */
  function puddle(c, x0, x1, yb, col) {
    c.row(yb, x0, x1, col);
    c.set(x0 + 1, yb, L(col));
  }
  /** A drawer pulled out towards us (front view): its dark hole, what is in it, the front a little lower. */
  function pull(c, x0, y0, x1, y1, col, inside) {
    hollow(c, x0, y0, x1, y0 + 1, col);
    if (inside) for (let x = x0 + 1; x < x1; x += 2) c.set(x, y0 + 1, inside);
    drawer(c, x0 - 1, y0 + 2, x1 + 1, y1 + 2, col);
  }
  /** The same from the side: the drawer sticks out n pixels to the right of x. */
  function pullS(c, x, y0, y1, n, col, inside) {
    c.rect(x, y0, x + n - 1, y1, col);
    c.row(y0, x, x + n - 1, inside || L(col));
    c.col(x + n - 1, y0, y1, D(col));
    c.set(x + n, (y0 + y1) >> 1, C.brass);
  }
  const BOOKS = [C.wine, C.forest, C.navy, hex('#5a4630'), hex('#6a5a36'), C.plum, hex('#3a3a40'), C.mustard, hex('#7a3a30')];
  /** A row of book spines standing on yb from x0 to x1; gone(i) → that book is missing. */
  function books(c, x0, x1, yb, seed = 1, maxH = 6, gone = () => false) {
    const r = rnd(seed);
    for (let x = x0, i = 0; x <= x1; i++) {
      const w = r() < 0.3 && x < x1 ? 2 : 1,
        h = maxH - Math.floor(r() * 3),
        col = BOOKS[Math.floor(r() * BOOKS.length)];
      if (!gone(i)) {
        c.rect(x, yb - h + 1, x + w - 1, yb, col);
        c.set(x, yb - h + 1, L(col));
        if (w > 1) c.set(x + 1, yb - 2, C.gold);
        else if (r() < 0.3) c.set(x, yb - 1, C.parchment);
      } else r();
      x += w;
    }
  }
  /** Wicker: a woven face. */
  function wicker(c, x0, y0, x1, y1, col = hex('#8a6a3a')) {
    c.rect(x0, y0, x1, y1, col);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if ((x + y * 2) % 4 === 0) c.set(x, y, D(col));
    c.row(y0, x0, x1, L(col));
  }
  return { out, reg, doorOut, opened, mk, D, L, dots, board, face, panel, drawer, legs, tleg, planksV, planksH, cabSide, hollow, pane, flame, fire, wisp, pot, bottle, bush, hedge, stones, bricks, wheel, cloth, heap, blood, shards, jar, shelfRow, carboy, cartWheel, wheelEdge, label, drawerGrid, glow, puddle, pull, pullS, books, wicker, BOOKS, GLASSES };
};
