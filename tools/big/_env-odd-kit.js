/* Helpers for env-odd.js (child's room, attic, weird). A thing is drawn by one function per perspective,
 * fn(c, used), on a roomy scratch canvas with free coordinates (negative ones too): the picture is cut out
 * afterwards, so a used picture may grow in any direction. In a side view the front of the thing faces right. */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark: D, lite: L, rnd, canvas } = kit;
  const out = {};
  const BIG = 128,
    OFF = 32;
  function scratch() {
    const c = canvas(BIG, BIG),
      s0 = c.set,
      g0 = c.get,
      c0 = c.clear;
    c.set = (x, y, col) => s0(Math.round(x) + OFF, Math.round(y) + OFF, col);
    c.get = (x, y) => g0(Math.round(x) + OFF, Math.round(y) + OFF);
    c.clear = (x, y) => c0(Math.round(x) + OFF, Math.round(y) + OFF);
    return c;
  }
  /** Draw fn(c, used) and cut the picture out: { w, h, draw } with a free pixel all round. */
  function cut(fn, used, what) {
    const s = scratch();
    fn(s, used);
    let x0 = BIG,
      y0 = BIG,
      x1 = -1,
      y1 = -1;
    for (let y = 0; y < BIG; y++)
      for (let x = 0; x < BIG; x++)
        if (s.px[y * BIG + x]) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
    if (x1 < 0) throw new Error(what + ' is empty');
    const w = x1 - x0 + 3,
      h = y1 - y0 + 3;
    if (w > 64 || h > 64) throw new Error(`${what} is ${w} x ${h}: larger than 64 x 64`);
    return {
      w,
      h,
      draw(c) {
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++) {
            const p = s.px[y * BIG + x];
            if (p) c.set(x - x0 + 1, y - y0 + 1, p);
          }
      },
    };
  }
  /**
   * A thing with its four pictures. main(c, used) is the main picture, other(c, used) the other perspective
   * (null: the thing looks the same from every side). o.base = 'side' if the main picture is the long side.
   */
  const setting = (cat, catLabel) => (slug, name, solid, main, other, o = {}) => {
    const m = cut(main, false, slug);
    const views = { used: cut(main, true, slug + '.used') };
    if (o.base) views.base = o.base;
    if (other) {
      views.side = cut(other, false, slug + '.side');
      views.sideUsed = cut(other, true, slug + '.sideUsed');
    } else if (o.round) {
      views.side = cut(main, false, slug + '.side');
      views.sideUsed = cut(main, true, slug + '.sideUsed');
    }
    // key order: side, used, sideUsed is how make-big walks them anyway
    out[slug] = { cat, catLabel, name, w: m.w, h: m.h, solid: !!solid, draw: m.draw, views };
  };

  /* ---------- small helpers ---------- */
  const dots = (c, col, pts) => {
    for (let i = 0; i < pts.length; i += 2) c.set(pts[i], pts[i + 1], col);
  };
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
    for (const x of xs) c.rect(x, y0, x + w - 1, y1, col);
  }
  /** A plain body: light top and left edge, dark bottom. */
  function body(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.col(x0, y0, y1, L(col));
    c.row(y1, x0, x1, D(col));
  }
  /** The side of a cabinet whose front faces right: plain boards, the front edge darker. */
  function sideBody(c, x0, y0, x1, y1, col) {
    body(c, x0, y0, x1, y1, col);
    c.col(x1, y0 + 1, y1, D(col));
    c.col(x1 - 1, y0 + 1, y1 - 1, mix(col, 0.85));
  }
  /** A door or lid standing open towards the viewer in a side view: a slab sticking out to the right of x. */
  function slab(c, x, y0, y1, w, col) {
    c.rect(x, y0, x + w - 1, y1, mix(col, 0.9));
    c.row(y0, x, x + w - 1, L(col));
    c.col(x + w - 1, y0, y1, D(col));
    c.row(y1, x, x + w - 1, D(col));
  }
  const BOOKS = [C.wine, C.navy, C.forest, C.mustard, C.slate, C.plum, C.teal, C.parchment, C.rust, C.black];
  function books(c, x0, x1, yb, mh, seed, fill = 1, pal = BOOKS) {
    const r = rnd(seed);
    let x = x0;
    while (x <= x1) {
      if (r() > fill) {
        x += 1 + ((r() * 3) | 0);
        continue;
      }
      const w = r() < 0.35 ? 2 : 1,
        h = mh - ((r() * 3) | 0),
        col = pal[(r() * pal.length) | 0],
        xe = Math.min(x1, x + w - 1);
      c.rect(x, yb - h + 1, xe, yb, col);
      if (h > 3) c.row(yb - h + 2, x, xe, L(col));
      x = xe + 1;
    }
  }
  /** A case with n open compartments; cb(i, x0, top, x1, base) fills each. */
  function shelves(c, x0, y0, x1, y1, col, n, cb) {
    c.rect(x0, y0, x1, y1, col);
    c.col(x0, y0, y1, L(col));
    c.row(y0, x0, x1, L(col));
    const ih = y1 - y0 - 1;
    for (let i = 0; i < n; i++) {
      const t = y0 + 1 + Math.round((i * (ih + 1)) / n),
        b = y0 + Math.round(((i + 1) * (ih + 1)) / n) - 1;
      c.rect(x0 + 1, t, x1 - 1, b, mix(col, 0.42));
      c.row(t, x0 + 1, x1 - 1, mix(col, 0.3));
      if (cb) cb(i, x0 + 1, t, x1 - 1, b);
    }
  }
  /** A cobweb in a corner at x, y spreading sx, sy. */
  function cobweb(c, x, y, sx, sy, n, col = C.ash) {
    for (let i = 0; i < n; i++) {
      c.set(x + sx * i, y + sy * i, col);
      if (i % 2 === 0 || i < 3) c.set(x + sx * i, y, col);
      if (i % 2 === 0 || i < 3) c.set(x, y + sy * i, col);
    }
    for (let i = 1; i < n - 1; i++) c.set(x + sx * (n - 1 - i), y + sy * i, col);
  }
  function candle(c, x, yt, yb, lit, col = C.bone) {
    c.col(x, yt, yb, col);
    if (lit) {
      c.set(x, yt - 1, C.flame);
      c.set(x, yt - 2, C.flameLight);
    } else c.set(x, yt - 1, C.black);
  }
  /** An eye: 3 wide, the pupil at px (0..2). */
  function eye(c, x, y, px = 1, col = C.white, pupil = K) {
    c.row(y, x, x + 2, col);
    c.set(x + px, y, pupil);
  }
  /** A pair of small lights in the dark. */
  function eyes(c, x, y, gap = 3, col = C.glow) {
    c.set(x, y, col);
    c.set(x + gap, y, col);
  }
  /** A round eyeball. */
  function eyeball(c, x, y, r = 1, iris = C.teal) {
    c.oval(x - r, y - r, x + r + 1, y + r + 1, C.white);
    c.set(x - r, y + r + 1, D(C.white));
    c.rect(x, y, x + 1, y + 1, iris);
    c.set(x + 1, y + 1, K);
  }
  /** A hand at the end of an arm coming from (x0, y0) to (x1, y1): fingers spread beyond the end. */
  function arm(c, x0, y0, x1, y1, col = C.flesh, thick = 2) {
    for (let t = 0; t < thick; t++) {
      const dx = Math.abs(y1 - y0) > Math.abs(x1 - x0) ? t : 0,
        dy = dx ? 0 : t;
      c.line(x0 + dx, y0 + dy, x1 + dx, y1 + dy, t ? D(col) : col);
    }
    const ux = Math.sign(x1 - x0),
      uy = Math.sign(y1 - y0);
    if (Math.abs(y1 - y0) > Math.abs(x1 - x0)) {
      c.rect(x1 - 1, y1 + uy, x1 + 2, y1 + 2 * uy, col);
      dots(c, col, [x1 - 1, y1 + 3 * uy, x1 + 1, y1 + 3 * uy, x1 + 2, y1 + 3 * uy, x1 - 2, y1 + uy]);
      c.set(x1, y1 + 4 * uy, col);
    } else {
      c.rect(x1 + ux, y1 - 1, x1 + 2 * ux, y1 + 2, col);
      dots(c, col, [x1 + 3 * ux, y1 - 1, x1 + 3 * ux, y1 + 1, x1 + 3 * ux, y1 + 2, x1 + ux, y1 - 2]);
      c.set(x1 + 4 * ux, y1, col);
    }
  }
  /** Blood (or anything) running down from x, y. */
  function drip(c, x, y, n, col = C.blood) {
    c.col(x, y, y + n - 1, col);
    c.set(x, y + n, D(col));
  }
  /** A pool on the floor: a flat oval on row y. */
  function pool(c, x0, x1, y, col) {
    c.row(y, x0, x1, col);
    c.row(y - 1, x0 + 2, x1 - 2, col);
    c.set(x0 + 3, y - 1, L(col));
  }
  /** A wheel with a hub. */
  function wheel(c, cx, cy, r, col = C.black, hub = C.steel) {
    c.oval(cx - r, cy - r, cx + r, cy + r, col);
    if (r > 2) c.oval(cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2, mix(col, 1.6));
    c.set(cx, cy, hub);
  }
  /** A wheel seen edge on. */
  function wheelEdge(c, x, cy, r, col = C.black, w = 2) {
    c.rect(x, cy - r, x + w - 1, cy + r, col);
    c.col(x, cy - r + 1, cy + r - 1, mix(col, 1.5));
  }
  /** A sheet of paper. */
  function paper(c, x0, y0, x1, y1, col = C.paper) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y1, x0, x1, D(col));
  }
  /** Bricks. */
  function bricks(c, x0, y0, x1, y1, col = hex('#7a4a3a'), seed = 1) {
    const r = rnd(seed),
      m = mix(col, 0.6);
    c.rect(x0, y0, x1, y1, col);
    for (let y = y0, i = 0; y <= y1; y += 3, i++) {
      c.row(y + 2, x0, x1, m);
      for (let x = x0 + (i % 2 ? 2 : 5); x <= x1; x += 6) c.col(x, y, Math.min(y1, y + 1), m);
      for (let x = x0; x <= x1; x += 6) if (r() < 0.3) c.rect(x, y, Math.min(x1, x + 2), Math.min(y1, y + 1), r() < 0.5 ? L(col) : D(col));
    }
  }
  /** Boards side by side (vertical) or one above the other. */
  function planks(c, x0, y0, x1, y1, col, step = 5, upright = true) {
    c.rect(x0, y0, x1, y1, col);
    if (upright) for (let x = x0 + step - 1; x < x1; x += step) c.col(x, y0, y1, D(col));
    else for (let y = y0 + step - 1; y < y1; y += step) c.row(y, x0, x1, D(col));
  }
  /** A cloth thrown over a shape given by its corner points: folds and a ragged hem. */
  function drape(c, pts, col = C.white, seed = 1) {
    const fold = blend(col, C.stone, 0.45),
      r = rnd(seed),
      xs = pts.map((p) => p[0]),
      ys = pts.map((p) => p[1]),
      b = Math.max(...ys);
    c.poly(pts, col);
    for (let x = Math.min(...xs); x <= Math.max(...xs); x++) {
      let t = Math.min(...ys);
      while (t <= b && c.get(x, t) !== col) t++;
      if (t > b) continue;
      c.set(x, t, L(col));
      if (r() < 0.3) c.col(x, t + 2 + ((r() * 3) | 0), b, fold);
      else if (r() < 0.25) c.col(x, b - 2 - ((r() * 4) | 0), b, fold);
      if (r() < 0.3) c.clear(x, b);
    }
  }
  /** Light spilling on what is drawn: a half-tone of col. */
  function glow(c, x0, y0, x1, y1, col = C.glow) {
    c.dither(x0, y0, x1, y1, col);
  }
  /** A screen: dark glass, or lit. */
  function screen(c, x0, y0, x1, y1, on, col = C.ghost) {
    c.rect(x0, y0, x1, y1, on ? col : hex('#23282c'));
    if (!on) {
      c.set(x0 + 1, y0 + 1, hex('#3f4a4f'));
      c.set(x0 + 2, y0 + 1, hex('#3f4a4f'));
    }
  }
  /** A little standing figure, n tall (a shadow, a doll, a far-off person). */
  function figure(c, x, b, n, col = K) {
    c.rect(x, b - n + 1, x + 1, b - n + 2, col); // head
    c.rect(x - 1, b - n + 3, x + 2, b - Math.max(2, (n / 3) | 0), col);
    c.col(x, b - 3, b, col);
    c.col(x + 1, b - 3, b, col);
  }

  /* ---------- beds ---------- */
  /** A bed from its long side, head on the left, standing on row b. Returns the mattress: { my, xa, xb }. */
  function bedSide(c, x0, x1, b, o = {}) {
    const fc = o.frame || C.woodPale,
      head = o.head || 15,
      foot = o.foot || 9,
      mh = o.mh || 8,
      tick = o.tick || C.cream;
    c.rect(x0, b - head + 1, x0 + 1, b, fc);
    c.col(x0, b - head + 1, b, L(fc));
    c.rect(x1 - 1, b - foot + 1, x1, b, fc);
    c.col(x1 - 1, b - foot + 1, b, L(fc));
    c.rect(x0 + 2, b - mh + 3, x1 - 2, b - 3, fc); // side rail
    c.row(b - mh + 3, x0 + 2, x1 - 2, L(fc));
    c.row(b - 3, x0 + 2, x1 - 2, D(fc));
    c.rect(x0 + 2, b - mh, x1 - 2, b - mh + 2, tick);
    c.row(b - mh, x0 + 2, x1 - 2, L(tick));
    c.row(b - mh + 2, x0 + 2, x1 - 2, D(tick));
    if (o.under !== false) c.rect(x0 + 2, b - 2, x1 - 2, b, o.under || null);
    return { my: b - mh, xa: x0 + 2, xb: x1 - 2, b };
  }
  function pillowSide(c, g, col = C.white) {
    c.rect(g.xa + 1, g.my - 2, g.xa + 6, g.my - 1, col);
    c.row(g.my - 1, g.xa + 1, g.xa + 6, D(col));
    c.clear(g.xa + 1, g.my - 2);
    c.clear(g.xa + 6, g.my - 2);
  }
  /** The duvet in the side view from xa to the foot; thrown back if back. pat(x0, y0, x1, y1) draws its pattern. */
  function duvetSide(c, g, col, back, pat) {
    const xa = g.xa + (back ? 17 : 8),
      y0 = g.my - 1,
      y1 = g.my + 3;
    if (back) {
      // the bare sheet with the dent of whoever lay there
      dots(c, D(o_tick(g)), [g.xa + 9, g.my, g.xa + 10, g.my, g.xa + 12, g.my + 1, g.xa + 14, g.my]);
      c.rect(xa, y0 - 2, g.xb, y1, col);
      c.row(y0 - 2, xa + 1, g.xb - 1, L(col));
      c.clear(xa, y0 - 2);
      c.clear(g.xb, y0 - 2);
      c.col(xa + 3, y0, y1, D(col));
      c.col(xa + 8, y0 - 1, y1 - 1, D(col));
      if (pat) pat(xa + 1, y0 - 1, g.xb - 1, y1 - 1);
      c.row(y1, xa, g.xb, D(col));
    } else {
      c.rect(xa, y0, g.xb, y1, col);
      c.row(y0, xa, g.xb, L(col));
      c.row(y1, xa, g.xb, D(col));
      if (pat) pat(xa + 1, y0 + 1, g.xb - 1, y1 - 1);
    }
  }
  const o_tick = () => C.cream;
  /** A bed seen from its foot end and a little from above, top row `top`, floor row b. Lay the bedding on the
   *  returned g (x0..x1 across, sy the far end of the mattress, ey its near edge), then call g.foot(). */
  function bedFront(c, x0, x1, top, b, o = {}) {
    const fc = o.frame || C.woodPale,
      head = o.head || 15,
      foot = o.foot || 9,
      mh = o.mh || 8,
      tick = o.tick || C.cream,
      sy = top + head - mh,
      ey = b - mh;
    c.rect(x0, top, x1, sy, fc);
    c.row(top, x0, x1, L(fc));
    c.col(x0, top, sy, L(fc));
    if (o.panel !== false && sy - top > 5) panel(c, x0 + 2, top + 2, x1 - 2, sy - 1, fc);
    c.rect(x0 + 1, sy, x1 - 1, ey, tick);
    c.row(sy, x0 + 1, x1 - 1, D(tick));
    c.rect(x0 + 1, ey + 1, x1 - 1, ey + mh - 4, D(tick));
    return {
      x0: x0 + 1,
      x1: x1 - 1,
      sy,
      ey,
      b,
      tick,
      foot() {
        const fb = b - foot + 1;
        c.rect(x0, fb, x1, b - 2, fc);
        c.row(fb, x0, x1, L(fc));
        c.col(x0, fb, b - 2, L(fc));
        if (o.panel !== false && b - 2 - fb > 4) panel(c, x0 + 2, fb + 2, x1 - 2, b - 4, fc);
        c.row(b - 2, x0, x1, D(fc));
        legs(c, [x0, x1 - 1], b - 1, b, D(fc));
      },
    };
  }
  function pillowFront(c, g, col = C.white) {
    c.rect(g.x0 + 2, g.sy + 1, g.x1 - 2, g.sy + 4, col);
    c.row(g.sy + 4, g.x0 + 2, g.x1 - 2, D(col));
    c.clear(g.x0 + 2, g.sy + 1);
    c.clear(g.x1 - 2, g.sy + 1);
    c.set(g.x0 + 2, g.sy + 1, g.tick);
    c.set(g.x1 - 2, g.sy + 1, g.tick);
  }
  /** The duvet in the front view; back = a corner thrown back. Returns the row it starts on. */
  function duvetFront(c, g, col, back, pat) {
    const by = g.sy + 7;
    c.rect(g.x0, by, g.x1, g.ey, col);
    c.row(by, g.x0, g.x1, L(col));
    c.rect(g.x0, g.ey + 1, g.x1, g.ey + 3, D(col));
    if (pat) pat(g.x0 + 1, by + 1, g.x1 - 1, g.ey - 1);
    if (back) {
      const ax = g.x1 - 3,
        k = Math.min(ax - g.x0 - 2, g.ey - by - 2);
      c.poly([[g.x0, by], [ax, by], [g.x0, by + k]], g.tick);
      dots(c, D(g.tick), [g.x0 + 2, by + 2, g.x0 + 3, by + 4, g.x0 + 5, by + 1, g.x0 + 1, by + 6]);
      c.poly([[ax, by + 1], [g.x0 + 1, by + k], [ax, by + k]], L(col));
      c.line(ax, by, g.x0, by + k, D(col));
      c.col(ax, by + 1, by + k, D(col));
      c.row(by + k, g.x0 + 1, ax, D(col));
    }
    return by;
  }

  /* ---------- chairs and tables ---------- */
  /** A chair from the side, facing right; x its back edge, b the floor. */
  function chairSide(c, x, b, o = {}) {
    const col = o.col || C.wood,
      sh = o.seat || 9,
      bh = o.back || 18,
      sw = o.w || 8;
    c.rect(x, b - bh + 1, x + 1, b, col);
    c.col(x, b - bh + 1, b, L(col));
    c.rect(x + sw - 2, b - sh + 1, x + sw - 1, b, col);
    c.rect(x, b - sh, x + sw - 1, b - sh + 1, o.pad || col);
    c.row(b - sh, x, x + sw - 1, L(o.pad || col));
    c.row(b - 3, x + 2, x + sw - 3, D(col));
  }
  /** A chair from the front; x its left edge. */
  function chairFront(c, x, b, o = {}) {
    const col = o.col || C.wood,
      sh = o.seat || 9,
      bh = o.back || 18,
      w = o.w || 10;
    c.rect(x, b - bh + 1, x + w - 1, b - sh - 1, mix(col, 0.45)); // through the back
    c.col(x, b - bh + 1, b, col);
    c.col(x + w - 1, b - bh + 1, b, col);
    c.rect(x, b - bh + 1, x + w - 1, b - bh + 2, col);
    c.row(b - bh + 1, x, x + w - 1, L(col));
    for (let i = x + 2; i < x + w - 1; i += 2) c.col(i, b - bh + 3, b - sh - 1, col);
    c.rect(x, b - sh, x + w - 1, b - sh + 1, o.pad || col);
    c.row(b - sh, x, x + w - 1, L(o.pad || col));
    c.row(b - 3, x + 1, x + w - 2, D(col));
  }
  /** A table: top from x0 to x1 on row `top`, legs to b. */
  function table(c, x0, x1, top, b, col = C.wood, o = {}) {
    c.rect(x0, top, x1, top + 1, col);
    c.row(top, x0, x1, L(col));
    c.row(top + 1, x0, x1, D(col));
    if (o.apron !== false) c.rect(x0 + 2, top + 2, x1 - 2, top + 3, mix(col, 0.8));
    legs(c, [x0 + 1, x1 - 2], top + 2, b, o.leg || D(col));
  }

  return {
    ...kit,
    D,
    L,
    out,
    setting,
    cut,
    dots,
    panel,
    drawer,
    legs,
    body,
    sideBody,
    slab,
    books,
    BOOKS,
    shelves,
    cobweb,
    candle,
    eye,
    eyes,
    eyeball,
    arm,
    drip,
    pool,
    wheel,
    wheelEdge,
    paper,
    bricks,
    planks,
    drape,
    glow,
    screen,
    figure,
    bedSide,
    pillowSide,
    duvetSide,
    bedFront,
    pillowFront,
    duvetFront,
    chairSide,
    chairFront,
    table,
  };
};
