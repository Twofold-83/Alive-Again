/* The world at paper-doll scale: props, nature, level props, barriers, old technology, mad science, the city and
 * buildings. One pixel is one doll pixel (a person is 16 x 33). Each sprite is keyed by its slug in
 * public/px/index.json; def(slug, w, h, draw, opts) registers one. Helpers further down keep the variants of one
 * thing (chests, trees, cars, shop fronts ...) alike. Light comes from the left; the kit adds shade and outline. */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd, canvas }) => {
  const S = {};
  const def = (slug, w, h, draw, o) => {
    if (S[slug]) throw new Error('drawn twice in world.js: ' + slug);
    S[slug] = Object.assign({ w, h, draw }, o);
  };
  const solid = { solid: true },
    flat = { shade: false, outline: false },
    noShade = { shade: false };
  const D = dark,
    L = lite,
    DD = (c) => mix(c, 0.46);
  const X = {
    pink: hex('#b98a94'),
    orange: hex('#b5682c'),
    ice: hex('#9fc0cc'),
    snow: hex('#d6dde0'),
    sand: hex('#b39a6a'),
    purple: hex('#6a4a8a'),
    violet: hex('#9a78c0'),
    green: hex('#4f8a4a'),
    toxic: hex('#7fae3e'),
    yellow: hex('#c2a23a'),
    blue: hex('#3f5f8f'),
    sky: hex('#6f8fae'),
    brick: hex('#7d4a3c'),
    beige: hex('#b9ac8c'),
    screen: hex('#18241f'),
    phos: hex('#6fc27a'),
    rubber: hex('#25232b'),
    copper: hex('#a0623a'),
    thatch: hex('#9a8448'),
    plaster: hex('#a89f8a'),
    tile: hex('#8a4034'),
    canvas: hex('#9c9274'),
    organ: hex('#a85a5a'),
    laser: hex('#d8483c'),
  };

  /* ---------- shapes ---------- */
  const disc = (c, cx, cy, r, col) => c.oval(cx - r, cy - r, cx + r, cy + r, col);
  /** The rim of an ellipse, t pixels thick. */
  const ring = (c, x0, y0, x1, y1, col, t = 1) => {
    const cx = (x0 + x1) / 2,
      cy = (y0 + y1) / 2,
      rx = (x1 - x0 + 1) / 2,
      ry = (y1 - y0 + 1) / 2;
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const o = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2,
          i = rx - t > 0 && ry - t > 0 ? ((x - cx) / (rx - t)) ** 2 + ((y - cy) / (ry - t)) ** 2 : 2;
        if (o <= 1 && i > 1) c.set(x, y, col);
      }
  };
  const vplanks = (c, x0, y0, x1, y1, col, step = 4) => {
    c.rect(x0, y0, x1, y1, col);
    for (let x = x0 + step - 1; x < x1; x += step) c.col(x, y0, y1, D(col));
    c.col(x0, y0, y1, L(col));
  };
  const hplanks = (c, x0, y0, x1, y1, col, step = 4) => {
    c.rect(x0, y0, x1, y1, col);
    for (let y = y0 + step - 1; y < y1; y += step) c.row(y, x0, x1, D(col));
    c.row(y0, x0, x1, L(col));
  };
  const bricks = (c, x0, y0, x1, y1, col, bw = 6, bh = 3) => {
    const m = D(col);
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const r = Math.floor((y - y0) / bh);
        c.set(x, y, (y - y0) % bh === bh - 1 || (x - x0 + (r % 2 ? bw >> 1 : 0)) % bw === bw - 1 ? m : col);
      }
  };
  const wheel = (c, cx, cy, r, tyre = X.rubber, hub = C.steel) => {
    disc(c, cx, cy, r, tyre);
    if (r >= 2) disc(c, cx, cy, r - 2, hub);
    if (r >= 4) c.set(cx, cy, D(hub));
  };
  const cartwheel = (c, cx, cy, r, col = C.woodDark) => {
    ring(c, cx - r, cy - r, cx + r, cy + r, col, 1.5);
    c.line(cx - r, cy, cx + r, cy, col);
    c.line(cx, cy - r, cx, cy + r, col);
    if (r > 4) {
      const k = Math.round(r * 0.7);
      c.line(cx - k, cy - k, cx + k, cy + k, col);
      c.line(cx - k, cy + k, cx + k, cy - k, col);
    }
    c.set(cx, cy, C.iron);
  };
  /** A flame standing on row yb, h tall. */
  const flame = (c, cx, yb, h, w) => {
    w = w || Math.max(3, Math.round(h * 0.7));
    const a = w / 2;
    c.poly([[cx, yb - h + 1], [cx + a, yb - h * 0.35], [cx + a - 1, yb], [cx - a + 1, yb], [cx - a, yb - h * 0.35]], C.flame);
    if (h > 4) c.poly([[cx, yb - h * 0.6], [cx + a / 2, yb - h * 0.2], [cx, yb], [cx - a / 2, yb - h * 0.2]], C.flameLight);
    else c.set(cx, yb, C.flameLight);
  };
  const win = (c, x0, y0, x1, y1, o = {}) => {
    const g = o.lit ? C.glow : o.col || C.navy,
      f = o.frame || C.woodDark;
    c.rect(x0, y0, x1, y1, f);
    c.rect(x0 + 1, y0 + 1, x1 - 1, y1 - 1, g);
    if (!o.plain) {
      if (x1 - x0 > 5) c.col((x0 + x1) >> 1, y0, y1, f);
      if (y1 - y0 > 6) c.row((y0 + y1) >> 1, x0, x1, f);
    }
    if (!o.lit) c.line(x0 + 1, y0 + 2, x0 + 2, y0 + 1, L(g));
  };
  const doorw = (c, x0, y0, x1, y1, col = C.wood, o = {}) => {
    c.rect(x0, y0, x1, y1, DD(col));
    vplanks(c, x0 + 1, y0 + 1, x1 - 1, y1, col, o.step || 3);
    c.set(x1 - 2, (y0 + y1 + 2) >> 1, o.knob || C.brass);
  };
  /** A rectangle with a round top. */
  const arch = (c, x0, y0, x1, y1, col) => {
    c.oval(x0, y0, x1, y0 + (x1 - x0), col);
    c.rect(x0, y0 + ((x1 - x0 + 1) >> 1), x1, y1, col);
  };
  const pole = (c, x, y0, y1, col = C.iron, wd = 2) => {
    c.rect(x, y0, x + wd - 1, y1, col);
    if (wd > 1) c.col(x, y0, y1, L(col));
  };
  const scribble = (c, x0, y, x1, col) => {
    for (let x = x0; x <= x1; x++) if ((x * 7 + y * 3) % 5 !== 0) c.set(x, y, col);
  };
  /** Draw with fn on a spare canvas, shade it as a round lump (light top left, dark bottom right, in clumps), stamp it. */
  const lump = (c, fn, col, o = {}) => {
    const t = canvas(c.w, c.h),
      seed = o.seed || 1,
      g = o.grain || 2;
    fn(t);
    let x0 = c.w, x1 = 0, y0 = c.h, y1 = 0;
    for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) if (t.get(x, y)) (x0 = Math.min(x0, x)), (x1 = Math.max(x1, x)), (y0 = Math.min(y0, y)), (y1 = Math.max(y1, y));
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0 + 1) / 2, ry = (y1 - y0 + 1) / 2;
    const h = (x, y) => { const v = Math.sin((Math.floor(x / g) * 12.9898 + Math.floor(y / g) * 78.233 + seed * 3.7)) * 43758.5453; return v - Math.floor(v); };
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++)
        if (t.get(x, y)) {
          const v = -((x - cx) / rx) * 0.55 - ((y - cy) / ry) * 0.75 + (h(x + (y >> 1), y) - 0.5) * (o.noise == null ? 0.7 : o.noise);
          c.set(x, y, v > 0.5 ? L(col) : v < -0.75 ? DD(col) : v < -0.3 ? D(col) : col);
        }
  };
  /** A crown of leaves: several overlapping blobs. */
  const leaves = (c, cx, cy, rx, ry, col, seed = 1) => {
    const r = rnd(seed);
    lump(c, (t) => {
      t.oval(cx - rx, cy - ry, cx + rx, cy + ry, col);
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * 6.283 + r(), k = Math.min(rx, ry) * (0.4 + r() * 0.2), ox = Math.round(cx + Math.cos(a) * rx * 0.78), oy = Math.round(cy + Math.sin(a) * ry * 0.72);
        t.oval(ox - k, oy - k, ox + k, oy + k, col);
      }
      t.clearRect(0, 0, c.w - 1, 0); t.clearRect(0, 0, 0, c.h - 1); t.clearRect(c.w - 1, 0, c.w - 1, c.h - 1);
    }, col, { seed, grain: 2 });
  };
  /** A boulder sitting on row y1. */
  const boulder = (c, x0, y0, x1, y1, col, seed = 1, o = {}) => {
    const r = rnd(seed), hgt = y1 - y0 + 1;
    lump(c, (t) => {
      t.oval(x0, y0, x1, y1 + Math.round(hgt * 0.45), col);
      t.oval(x0 + Math.round((x1 - x0) * 0.1), y0 + Math.round(hgt * 0.25), x1, y1 + Math.round(hgt * 0.3), col);
      t.clearRect(0, y1 + 1, c.w - 1, c.h - 1);
      // knock a few corners off
      for (let i = 0; i < 3; i++) { const x = x0 + Math.round(r() * (x1 - x0)); if (r() < 0.5) t.clear(x, y0); }
    }, col, { seed, grain: o.grain || 3, noise: 0.5 });
    if (!o.plain && x1 - x0 > 8) {
      const mx = x0 + Math.round((x1 - x0) * (0.45 + r() * 0.2));
      c.line(mx, y0 + Math.round(hgt * 0.35), mx + 2, y0 + Math.round(hgt * 0.7), DD(col));
    }
  };
  /** A pointed crystal standing on row yb. */
  const shard = (c, x, yb, w, h, lean, col) => {
    const tx = x + w / 2 + lean, ty = yb - h + 1, m = x + (w - 1) / 2;
    c.poly([[x, yb], [x, yb - h * 0.3], [tx, ty], [x + w - 1, yb - h * 0.3], [x + w - 1, yb]], col);
    c.poly([[x, yb], [x, yb - h * 0.3], [tx, ty], [m, yb - h * 0.3], [m, yb]], L(col));
    c.line(Math.round(m), yb, Math.round(m), Math.round(yb - h * 0.3), blend(L(col), C.white, 0.5));
    c.col(x + w - 1, Math.round(yb - h * 0.3), yb, D(col));
  };
  /** A specimen jar; returns the box of the fluid inside. */
  const jar = (c, x0, y0, x1, y1, fluid, lid = C.brass) => {
    c.rect(x0 + 1, y0, x1 - 1, y0 + 1, lid);
    c.row(y0, x0 + 1, x1 - 1, L(lid));
    c.rect(x0, y0 + 2, x1, y1, C.glass);
    c.rect(x0 + 1, y0 + 4, x1 - 1, y1 - 1, fluid);
    c.row(y0 + 4, x0 + 1, x1 - 1, L(fluid));
    c.col(x0 + 1, y0 + 3, y1 - 2, C.glassLight);
    c.row(y1, x0, x1, D(C.glass));
    return [x0 + 2, y0 + 5, x1 - 1, y1 - 1];
  };
  /** A cathode-ray set; returns the box of the screen. */
  const crt = (c, x0, y0, x1, y1, cas = X.beige, scr = X.screen) => {
    c.box(x0, y0, x1, y1, cas);
    c.rect(x0 + 2, y0 + 2, x1 - 2, y1 - 3, D(cas));
    c.rect(x0 + 3, y0 + 3, x1 - 3, y1 - 4, scr);
    c.set(x1 - 2, y1 - 1, C.red);
    c.set(x1 - 4, y1 - 1, DD(cas));
    return [x0 + 3, y0 + 3, x1 - 3, y1 - 4];
  };
  /** A robed stone figure 12 wide and 27 tall, feet on row yb. */
  const figure = (c, x, yb, col) => {
    const t = yb - 26;
    c.poly([[x + 2, t + 16], [x + 9, t + 16], [x + 11, yb], [x, yb]], col);
    c.rect(x + 2, t + 9, x + 9, t + 17, col);
    c.rect(x + 1, t + 8, x + 10, t + 10, col);
    c.rect(x, t + 9, x + 1, t + 17, col);
    c.rect(x + 10, t + 9, x + 11, t + 17, D(col));
    c.col(x, t + 9, t + 17, L(col));
    c.col(x + 2, t + 11, t + 17, D(col));
    c.col(x + 9, t + 11, t + 17, D(col));
    c.row(t + 16, x + 3, x + 8, D(col));
    c.line(x + 4, t + 18, x + 3, yb, D(col));
    c.line(x + 7, t + 18, x + 9, yb, D(col));
    c.rect(x + 4, t + 7, x + 7, t + 7, D(col));
    c.oval(x + 3, t, x + 8, t + 6, col);
    c.col(x + 3, t + 2, t + 4, L(col));
    c.set(x + 5, t + 3, DD(col));
    c.set(x + 7, t + 3, DD(col));
  };
  const pedestal = (c, x0, y0, x1, y1, col) => {
    c.rect(x0 + 1, y0, x1 - 1, y1, col);
    c.rect(x0, y0, x1, y0 + 1, L(col));
    c.rect(x0, y1 - 1, x1, y1, D(col));
    c.col(x0 + 1, y0 + 2, y1 - 2, L(col));
  };
  const puff = (c, cx, cy, r, col = C.ash) => {
    disc(c, cx, cy, r, col);
    disc(c, cx - 1, cy - 1, Math.max(0, r - 2), L(col));
  };


  /* ================= props ================= */
  const pts = (c, list, col) => list.forEach(([x, y]) => c.set(x, y, col));
  const chest = (c, col, band, o = {}) => {
    const y = o.open ? 5 : 0;
    if (o.open) {
      c.rect(2, 1, 15, 8, D(col));
      c.row(1, 2, 15, col);
      c.rect(3, 3, 14, 8, DD(col));
      c.col(4, 1, 8, band);
      c.col(13, 1, 8, band);
      if (o.fill) {
        c.rect(3, 8, 14, 10, o.fill);
        c.row(7, 5, 12, o.fill);
        c.row(6, 7, 10, o.fill);
        pts(c, [[6, 7], [9, 6], [11, 8], [4, 9], [8, 9], [13, 9]], L(o.fill));
        pts(c, [[7, 8], [10, 9], [5, 8], [12, 10]], D(o.fill));
      } else c.rect(3, 9, 14, 10, C.night);
    } else {
      c.row(1, 2, 15, L(col));
      c.rect(1, 2, 16, 5, col);
      c.row(2, 1, 16, L(col));
      c.row(4, 1, 16, D(col));
    }
    c.rect(1, y + 6, 16, y + 12, col);
    c.row(y + 6, 1, 16, DD(col));
    c.row(y + 9, 1, 16, D(col));
    c.row(y + 12, 1, 16, D(col));
    for (const x of [3, 13]) {
      c.rect(x, o.open ? y + 6 : 1, x + 1, y + 12, band);
      c.col(x, o.open ? y + 6 : 1, y + 12, L(band));
    }
    c.rect(8, y + 5, 9, y + 8, o.lock || band);
    c.set(8, y + 7, K);
  };
  def('chest', 18, 14, (c) => chest(c, C.wood, C.iron, { lock: C.brass }), solid);
  def('chest-open', 18, 19, (c) => chest(c, C.wood, C.iron, { open: true, fill: C.gold, lock: C.brass }), solid);
  def('chest-empty', 18, 19, (c) => chest(c, C.wood, C.iron, { open: true, lock: C.brass }), solid);
  def('chest-gold', 18, 14, (c) => { chest(c, C.gold, C.brass, { lock: C.wine }); pts(c, [[6, 3], [11, 3], [6, 10], [11, 10]], C.red); }, solid);
  def('chest-gold-open', 18, 19, (c) => { chest(c, C.gold, C.brass, { open: true, fill: C.flameLight, lock: C.wine }); pts(c, [[6, 8], [11, 9]], C.red); c.set(9, 8, C.teal); }, solid);
  def('chest-iron', 18, 14, (c) => { chest(c, C.iron, C.ironDark, { lock: C.steel }); pts(c, [[1, 3], [6, 3], [11, 3], [16, 3], [1, 10], [6, 10], [11, 10], [16, 10]], C.steel); c.rect(7, 5, 10, 9, C.steel); c.rect(8, 7, 9, 8, K); }, solid);
  def('barrel', 14, 17, (c) => {
    c.rect(2, 1, 11, 15, C.wood);
    c.rect(1, 4, 12, 12, C.wood);
    for (const x of [4, 7, 10]) c.col(x, 1, 15, D(C.wood));
    c.col(2, 2, 14, C.woodLight);
    c.row(1, 3, 10, C.woodLight);
    c.row(3, 2, 11, C.iron);
    c.row(4, 1, 12, C.ironDark);
    c.row(12, 1, 12, C.iron);
    c.row(13, 2, 11, C.ironDark);
    c.set(7, 8, K);
  }, solid);
  def('crate', 16, 15, (c) => {
    vplanks(c, 1, 1, 14, 13, C.woodLight, 4);
    c.frame(1, 1, 14, 13, C.wood);
    c.frame(2, 2, 13, 12, D(C.woodLight));
    c.line(3, 3, 12, 11, C.wood);
    c.line(3, 4, 11, 11, D(C.wood));
    c.row(1, 1, 14, L(C.wood));
    pts(c, [[2, 2], [13, 2], [2, 12], [13, 12]], C.iron);
  }, solid);
  const CLAY = hex('#96603e');
  def('pot', 10, 13, (c) => {
    c.oval(1, 3, 8, 11, CLAY);
    c.rect(3, 1, 6, 3, CLAY);
    c.row(1, 2, 7, L(CLAY));
    c.row(2, 3, 6, D(CLAY));
    c.col(2, 5, 9, L(CLAY));
    c.row(6, 1, 8, C.cream);
    c.row(7, 1, 8, D(CLAY));
    c.row(11, 3, 6, D(CLAY));
  });
  def('pot-broken', 14, 10, (c) => {
    c.oval(1, 0, 8, 8, CLAY);
    c.clearRect(0, 0, 13, 3);
    pts(c, [[1, 3], [3, 3], [4, 2], [6, 3], [8, 3], [8, 2]], CLAY);
    c.row(4, 2, 7, DD(CLAY));
    c.col(2, 5, 7, L(CLAY));
    c.row(8, 3, 6, D(CLAY));
    c.poly([[10, 8], [11, 6], [12, 8]], CLAY);
    c.row(8, 9, 12, D(CLAY));
    c.set(10, 5, CLAY);
  });
  def('sack', 13, 15, (c) => {
    c.oval(1, 4, 11, 15, C.straw);
    c.clearRect(0, 14, 12, 14);
    c.rect(4, 2, 8, 4, C.straw);
    c.rect(3, 1, 9, 1, L(C.straw));
    c.row(4, 4, 8, C.earth);
    c.col(3, 6, 11, L(C.straw));
    c.line(8, 7, 9, 12, D(C.straw));
    c.line(5, 8, 5, 12, D(C.straw));
    c.row(13, 2, 10, D(C.straw));
  });
  const bucket = (c, water) => {
    ring(c, 1, 1, 8, 8, C.iron, 1);
    c.clearRect(0, 5, 9, 10);
    c.poly([[1, 5], [8, 5], [7, 10], [2, 10]], C.woodLight);
    c.row(5, 1, 8, water ? C.water : DD(C.wood));
    if (water) c.row(5, 3, 4, C.glassLight);
    c.row(7, 1, 8, C.iron);
    c.col(4, 6, 10, D(C.woodLight));
    c.row(10, 2, 7, D(C.woodLight));
  };
  def('bucket', 10, 12, (c) => bucket(c, false));
  def('bucket-water', 10, 12, (c) => bucket(c, true));
  def('table', 32, 17, (c) => {
    c.rect(4, 4, 6, 15, C.woodDark);
    c.rect(25, 4, 27, 15, C.woodDark);
    c.col(4, 6, 15, C.wood);
    c.col(25, 6, 15, C.wood);
    c.rect(3, 4, 28, 5, C.wood);
    c.row(5, 3, 28, D(C.wood));
    c.rect(1, 1, 30, 3, C.woodLight);
    c.row(1, 1, 30, L(C.woodLight));
    c.row(3, 1, 30, C.wood);
  }, solid);
  def('chair', 12, 21, (c) => {
    c.rect(2, 1, 3, 19, C.wood);
    c.rect(8, 1, 9, 19, C.wood);
    c.rect(2, 2, 9, 3, C.woodLight);
    c.rect(4, 6, 7, 7, C.wood);
    c.col(5, 4, 9, C.woodDark);
    c.col(7, 4, 9, C.woodDark);
    c.rect(1, 10, 10, 11, C.woodLight);
    c.row(12, 2, 9, C.woodDark);
    c.row(16, 3, 8, C.woodDark);
    c.col(2, 1, 19, C.woodLight);
  }, solid);
  def('stool', 10, 11, (c) => {
    c.rect(1, 1, 8, 2, C.woodLight);
    c.row(2, 1, 8, C.wood);
    c.line(2, 3, 1, 9, C.woodDark);
    c.line(3, 3, 2, 9, C.wood);
    c.line(7, 3, 8, 9, C.woodDark);
    c.line(6, 3, 7, 9, C.wood);
    c.row(6, 3, 6, C.woodDark);
  });
  const bed = (c, blanket) => {
    c.rect(1, 2, 3, 19, C.woodDark);
    c.rect(2, 4, 5, 13, C.wood);
    c.row(2, 1, 3, C.wood);
    c.rect(34, 9, 36, 19, C.woodDark);
    c.rect(4, 12, 34, 15, C.cream);
    c.rect(6, 10, 12, 12, C.white);
    c.row(12, 6, 12, D(C.white));
    c.rect(14, 11, 34, 16, blanket);
    c.row(11, 14, 34, L(blanket));
    c.rect(14, 12, 16, 12, C.white);
    c.row(13, 14, 34, D(blanket));
    c.line(20, 14, 21, 16, D(blanket));
    c.line(28, 14, 29, 16, D(blanket));
    c.rect(4, 16, 34, 17, C.wood);
    c.rect(14, 16, 33, 16, D(blanket));
    c.row(17, 4, 34, D(C.wood));
    c.rect(4, 18, 5, 19, C.woodDark);
    c.rect(32, 18, 33, 19, C.woodDark);
  };
  def('bed', 38, 22, (c) => bed(c, C.wine), solid);
  def('bed-blue', 38, 22, (c) => bed(c, C.navy), solid);
  const SPINES = [C.wine, C.navy, C.forest, C.mustard, C.slate, C.plum, C.cream, C.teal, C.rust];
  const books = (c, x0, y0, x1, y1, seed = 1) => {
    const r = rnd(seed);
    c.rect(x0, y0, x1, y1, DD(C.wood));
    for (let x = x0; x <= x1; ) {
      const w = r() < 0.3 ? 2 : 1, h = Math.round((y1 - y0) * (0.65 + r() * 0.35)), col = SPINES[Math.floor(r() * SPINES.length)];
      if (r() < 0.12) { x += 1; continue; }
      c.rect(x, y1 - h, Math.min(x1, x + w - 1), y1, col);
      c.set(x, y1 - h, L(col));
      if (w > 1 && h > 3) c.row(y1 - h + 2, x, Math.min(x1, x + 1), C.gold);
      x += w;
      if (w === 1 && r() < 0.5) c.col(x - 1, y1 - h, y1, D(col));
    }
  };
  def('bookshelf', 26, 38, (c) => {
    c.rect(1, 1, 24, 36, C.woodDark);
    c.rect(1, 1, 24, 2, C.wood);
    c.row(1, 1, 24, C.woodLight);
    for (let i = 0; i < 5; i++) {
      books(c, 3, 4 + i * 7, 22, 8 + i * 7, i + 3);
      c.row(9 + i * 7, 2, 23, C.wood);
    }
    c.col(1, 2, 36, C.wood);
    c.rect(1, 36, 24, 36, DD(C.wood));
  }, solid);
  def('cupboard', 24, 38, (c) => {
    c.rect(1, 2, 22, 36, C.wood);
    c.rect(1, 1, 22, 2, C.woodLight);
    c.col(1, 3, 36, C.woodLight);
    for (const x of [3, 12]) {
      c.rect(x, 5, x + 8, 19, C.woodDark);
      c.rect(x + 1, 6, x + 7, 18, C.wood);
      c.frame(x + 2, 7, x + 6, 17, D(C.wood));
    }
    pts(c, [[10, 12], [13, 12]], C.brass);
    c.rect(1, 21, 22, 22, C.woodLight);
    c.row(22, 1, 22, C.woodDark);
    for (const y of [24, 30]) {
      c.rect(3, y, 20, y + 4, C.woodDark);
      c.rect(4, y + 1, 19, y + 3, C.wood);
      c.rect(10, y + 2, 13, y + 2, C.brass);
    }
    c.rect(2, 36, 3, 36, C.woodDark);
    c.rect(20, 36, 21, 36, C.woodDark);
    c.clearRect(5, 36, 18, 36);
  }, solid);
  def('throne', 22, 40, (c) => {
    c.poly([[4, 6], [10, 1], [11, 1], [17, 6], [17, 24], [4, 24]], C.woodDark);
    c.poly([[6, 7], [10, 4], [11, 4], [15, 7], [15, 22], [6, 22]], C.wine);
    c.col(6, 8, 22, L(C.wine));
    pts(c, [[8, 10], [13, 10], [8, 15], [13, 15], [10, 12], [11, 18]], D(C.wine));
    c.rect(10, 1, 11, 2, C.gold);
    c.rect(3, 4, 4, 7, C.gold);
    c.rect(17, 4, 18, 7, C.gold);
    c.rect(1, 20, 4, 22, C.gold);
    c.rect(17, 20, 20, 22, C.gold);
    c.rect(2, 23, 4, 37, C.woodDark);
    c.rect(17, 23, 19, 37, C.woodDark);
    c.rect(4, 24, 17, 27, C.wine);
    c.row(24, 4, 17, L(C.wine));
    c.rect(4, 28, 17, 34, C.wood);
    c.frame(6, 29, 15, 33, C.woodDark);
    c.rect(1, 37, 20, 38, C.woodDark);
    c.row(37, 1, 20, C.gold);
  }, solid);
  def('clock', 14, 40, (c) => {
    c.rect(2, 12, 11, 34, C.wood);
    c.rect(1, 3, 12, 12, C.wood);
    c.poly([[1, 3], [6, 1], [7, 1], [12, 3]], C.woodDark);
    c.rect(1, 3, 12, 3, C.woodLight);
    disc(c, 6, 8, 3, C.cream);
    c.oval(3, 5, 10, 11, C.cream);
    c.line(6, 8, 6, 6, K);
    c.line(7, 8, 8, 9, K);
    c.rect(1, 12, 12, 13, C.woodDark);
    c.rect(4, 15, 9, 31, C.night);
    c.col(6, 15, 26, C.brass);
    c.rect(6, 26, 7, 28, C.gold);
    c.col(2, 14, 34, C.woodLight);
    c.rect(1, 34, 12, 38, C.woodDark);
    c.row(34, 1, 12, C.wood);
  }, solid);
  def('mirror', 14, 20, (c) => {
    c.oval(1, 1, 12, 18, C.gold);
    c.oval(3, 3, 10, 16, C.glass);
    c.line(5, 5, 4, 9, C.glassLight);
    c.line(8, 10, 6, 14, C.glassLight);
    ring(c, 1, 1, 12, 18, C.brass, 1);
    c.rect(6, 1, 7, 1, C.gold);
  });
  def('painting', 22, 17, (c) => {
    c.box(1, 1, 20, 15, C.gold);
    c.rect(3, 3, 18, 13, C.navy);
    c.rect(3, 10, 18, 13, C.leaf);
    c.poly([[3, 10], [8, 7], [12, 10]], C.forest);
    c.poly([[10, 10], [15, 6], [18, 9], [18, 10]], D(C.slate));
    disc(c, 14, 5, 1, C.bone);
    c.frame(2, 2, 19, 14, C.brass);
  });
  def('banner-red', 14, 30, (c) => {
    c.rect(1, 1, 12, 2, C.woodDark);
    c.row(1, 1, 12, C.wood);
    c.rect(2, 3, 11, 24, C.wine);
    c.poly([[2, 24], [6, 24], [2, 28]], C.wine);
    c.poly([[7, 24], [11, 24], [11, 28]], C.wine);
    c.col(2, 3, 27, L(C.wine));
    c.col(8, 4, 23, D(C.wine));
    c.rect(2, 4, 11, 4, C.gold);
    c.poly([[6, 9], [9, 13], [6, 17], [4, 13]], C.gold);
    c.set(6, 13, C.wine);
    c.row(22, 2, 11, C.gold);
  });
  def('flag-red', 20, 38, (c) => {
    pole(c, 3, 3, 35, C.woodLight);
    disc(c, 3, 2, 1, C.gold);
    c.poly([[5, 4], [11, 5], [17, 4], [17, 13], [11, 14], [5, 13]], C.wine);
    c.line(5, 4, 17, 4, L(C.wine));
    c.line(9, 6, 9, 13, D(C.wine));
    c.line(14, 5, 14, 13, D(C.wine));
    c.rect(1, 35, 6, 36, C.stoneDark);
  });
  def('statue', 18, 42, (c) => {
    pedestal(c, 1, 30, 16, 40, C.stone);
    figure(c, 3, 29, C.stoneLight);
    c.speckle(1, 2, 16, 40, C.moss, 14, 3);
  }, solid);
  def('gravestone', 14, 18, (c) => {
    arch(c, 1, 1, 12, 16, C.stone);
    c.col(2, 5, 16, C.stoneLight);
    ring(c, 1, 1, 12, 12, C.stoneLight, 1);
    c.clearRect(0, 7, 0, 7);
    c.rect(8, 6, 11, 16, C.stone);
    scribble(c, 4, 6, 9, C.stoneDark);
    scribble(c, 3, 8, 10, C.stoneDark);
    scribble(c, 4, 10, 8, C.stoneDark);
    c.line(9, 2, 8, 5, C.stoneDark);
    c.row(16, 1, 12, C.moss);
    pts(c, [[2, 15], [5, 15], [11, 15], [1, 14]], C.moss);
  }, solid);
  def('grave-cross', 14, 20, (c) => {
    c.rect(6, 1, 7, 16, C.wood);
    c.rect(2, 5, 11, 6, C.wood);
    c.col(6, 1, 16, C.woodLight);
    c.row(5, 2, 11, C.woodLight);
    c.set(7, 6, C.iron);
    c.oval(1, 15, 12, 20, C.earth);
    c.clearRect(0, 19, 13, 19);
    c.row(15, 4, 8, L(C.earth));
    pts(c, [[3, 17], [9, 17]], D(C.earth));
  }, solid);
  def('coffin', 18, 40, (c) => {
    const P = [[6, 1], [11, 1], [16, 11], [12, 38], [5, 38], [1, 11]];
    c.poly(P, C.wood);
    c.poly([[7, 3], [10, 3], [14, 11], [11, 36], [6, 36], [3, 11]], C.woodDark);
    c.poly([[7, 4], [10, 4], [13, 11], [10, 35], [7, 35], [4, 11]], C.wood);
    c.line(6, 1, 1, 11, C.woodLight);
    c.line(1, 11, 5, 38, C.woodLight);
    c.rect(8, 8, 9, 20, C.brass);
    c.rect(6, 11, 11, 12, C.brass);
    pts(c, [[3, 14], [14, 14], [5, 32], [12, 32]], C.iron);
  }, solid);
  const logs = (c, cx, yb) => {
    c.line(cx - 6, yb, cx + 4, yb - 3, C.woodDark);
    c.line(cx - 6, yb - 1, cx + 4, yb - 4, C.wood);
    c.line(cx + 6, yb, cx - 4, yb - 3, C.woodDark);
    c.line(cx + 6, yb - 1, cx - 4, yb - 4, C.wood);
    c.row(yb, cx - 3, cx + 3, DD(C.wood));
  };
  def('campfire', 18, 17, (c) => {
    flame(c, 8, 12, 11, 8);
    flame(c, 11, 12, 6, 4);
    logs(c, 8, 15);
  }, noShade);
  def('cauldron', 20, 19, (c) => {
    c.oval(2, 4, 17, 18, C.ironDark);
    c.clearRect(0, 16, 19, 18);
    c.rect(4, 15, 5, 17, C.ironDark);
    c.rect(14, 15, 15, 17, C.ironDark);
    c.oval(4, 7, 8, 13, C.iron);
    c.rect(1, 4, 18, 5, C.iron);
    c.row(4, 1, 18, C.steel);
    c.rect(3, 3, 16, 3, X.toxic);
    c.rect(5, 2, 8, 2, X.toxic);
    c.rect(11, 1, 12, 2, X.toxic);
    pts(c, [[6, 3], [12, 3], [14, 3]], L(X.toxic));
  }, solid);
  def('anvil', 20, 13, (c) => {
    c.poly([[1, 2], [18, 2], [18, 4], [14, 5], [5, 5], [1, 3]], C.iron);
    c.row(2, 1, 18, C.steel);
    c.rect(7, 6, 12, 8, C.ironDark);
    c.rect(5, 9, 14, 11, C.iron);
    c.row(9, 5, 14, C.steel);
    c.row(11, 5, 14, C.ironDark);
  }, solid);
  const signboard = (c, dir) => {
    pole(c, 7, 2, 22, C.wood);
    if (!dir) {
      c.box(1, 3, 14, 11, C.woodLight);
      scribble(c, 3, 5, 12, C.woodDark);
      scribble(c, 3, 7, 11, C.woodDark);
      scribble(c, 3, 9, 9, C.woodDark);
    } else {
      const p = [[1, 3], [11, 3], [15, 7], [11, 11], [1, 11]];
      c.poly(dir > 0 ? p : p.map(([x, y]) => [15 - x + 1, y]), C.woodLight);
      c.row(3, dir > 0 ? 1 : 5, dir > 0 ? 11 : 15, L(C.woodLight));
      c.row(11, dir > 0 ? 1 : 5, dir > 0 ? 11 : 15, C.wood);
      c.row(7, 4, 12, C.woodDark);
      const tx = dir > 0 ? 12 : 4;
      c.line(tx, 7, tx - dir * 2, 5, C.woodDark);
      c.line(tx, 7, tx - dir * 2, 9, C.woodDark);
    }
    c.set(8, 7, C.iron);
  };
  def('signpost', 16, 24, (c) => signboard(c, 0));
  def('sign-right', 17, 24, (c) => signboard(c, 1));
  def('sign-left', 17, 24, (c) => signboard(c, -1));
  const lever = (c, on) => {
    c.rect(1, 10, 9, 12, C.iron);
    c.row(10, 1, 9, C.steel);
    c.rect(4, 9, 6, 9, C.ironDark);
    const tx = on ? 9 : 1;
    c.line(5, 9, tx, 3, C.steel);
    c.line(5, 10, tx + (on ? -1 : 1), 3, C.iron);
    disc(c, tx, 2, 1, on ? X.green : C.red);
  };
  def('lever-left', 11, 14, (c) => lever(c, false));
  def('lever-right', 11, 14, (c) => lever(c, true));
  def('button', 10, 8, (c) => {
    c.rect(1, 4, 8, 6, C.stone);
    c.row(4, 1, 8, C.stoneLight);
    c.rect(3, 1, 6, 3, C.red);
    c.row(1, 3, 6, L(C.red));
  });
  def('button-pressed', 10, 8, (c) => {
    c.rect(1, 4, 8, 6, C.stone);
    c.row(4, 1, 8, C.stoneLight);
    c.rect(3, 3, 6, 3, C.blood);
  });
  const doorframe = (c, col) => {
    c.rect(1, 1, 18, 36, col);
    c.row(1, 1, 18, L(col));
    c.col(1, 1, 36, L(col));
  };
  def('door', 20, 38, (c) => {
    doorframe(c, C.woodDark);
    vplanks(c, 3, 3, 16, 36, C.wood, 4);
    c.frame(5, 5, 14, 15, C.woodDark);
    c.frame(5, 19, 14, 33, C.woodDark);
    c.rect(14, 18, 15, 19, C.brass);
    c.rect(3, 8, 4, 8, C.iron);
    c.rect(3, 30, 4, 30, C.iron);
  }, solid);
  def('door-open', 20, 38, (c) => {
    doorframe(c, C.woodDark);
    c.rect(3, 3, 16, 36, C.night);
    c.poly([[3, 3], [8, 5], [8, 36], [3, 36]], C.wood);
    c.col(8, 5, 36, C.woodDark);
    c.col(3, 3, 36, C.woodLight);
    c.col(5, 4, 36, D(C.wood));
    c.set(7, 20, C.brass);
    c.rect(9, 35, 16, 36, DD(C.wood));
  });
  def('door-iron', 20, 38, (c) => {
    doorframe(c, C.stoneDark);
    c.rect(3, 3, 16, 36, C.iron);
    c.col(3, 3, 36, C.steel);
    for (const y of [5, 14, 23, 32]) { c.row(y, 3, 16, C.ironDark); pts(c, [[4, y + 2], [9, y + 2], [15, y + 2]], C.steel); }
    c.rect(6, 7, 13, 11, K);
    for (const x of [8, 11]) c.col(x, 7, 11, C.steel);
    c.rect(12, 18, 15, 22, C.steel);
    c.rect(13, 20, 14, 21, K);
  }, solid);
  def('portcullis', 24, 38, (c) => {
    arch(c, 1, 1, 22, 36, C.stone);
    arch(c, 4, 4, 19, 36, C.night);
    c.col(1, 12, 36, C.stoneLight);
    for (const y of [10, 18, 26]) { c.row(y, 1, 3, C.stoneDark); c.row(y + 4, 20, 22, C.stoneDark); }
    for (let x = 5; x <= 18; x += 3) { c.col(x, 5, 35, C.iron); c.set(x, 36, C.steel); }
    for (const y of [9, 16, 23, 30]) c.row(y, 4, 19, C.ironDark);
    c.rect(4, 4, 4, 8, C.night);
  }, solid);
  def('stairs', 34, 26, (c) => {
    for (let i = 0; i < 6; i++) {
      const x = 1 + i * 5, y = 20 - i * 4;
      c.rect(x, y, 32, 24, C.stone);
      c.row(y, x, 32, C.stoneLight);
      c.col(x, y + 1, y + 3, C.stoneDark);
    }
    c.speckle(1, 1, 32, 24, C.stoneDark, 12, 4);
    c.row(24, 1, 32, C.stoneDark);
  }, solid);
  const lampHead = (c, cx, y, lit, o = {}) => {
    // a four-sided lantern, 9 wide and 11 tall, its top at row y
    c.rect(cx - 1, y, cx + 1, y, C.iron);
    c.poly([[cx - 4, y + 3], [cx - 2, y + 1], [cx + 2, y + 1], [cx + 4, y + 3]], C.ironDark);
    c.poly([[cx - 3, y + 4], [cx + 3, y + 4], [cx + 2, y + 9], [cx - 2, y + 9]], lit ? C.glow : D(C.glass));
    if (lit) { c.rect(cx - 1, y + 6, cx + 1, y + 8, C.flameLight); c.set(cx, y + 5, C.white); }
    c.line(cx - 3, y + 4, cx - 2, y + 9, C.iron);
    c.line(cx + 3, y + 4, cx + 2, y + 9, C.iron);
    c.row(y + 10, cx - 2, cx + 2, C.ironDark);
    if (o.broken) { c.rect(cx, y + 4, cx + 2, y + 7, K); c.set(cx - 1, y + 5, K); }
  };
  def('lamp-post', 14, 54, (c) => {
    lampHead(c, 6, 1, true);
    pole(c, 6, 12, 50, C.iron);
    c.rect(4, 14, 9, 14, C.iron);
    c.rect(5, 44, 8, 50, C.iron);
    c.rect(4, 51, 9, 52, C.ironDark);
    c.col(5, 44, 50, C.steel);
  }, solid);
  def('cage', 20, 32, (c) => {
    ring(c, 8, 1, 11, 4, C.iron, 1);
    c.poly([[3, 7], [9, 4], [10, 4], [16, 7]], C.iron);
    c.rect(2, 7, 17, 8, C.iron);
    c.row(7, 2, 17, C.steel);
    c.rect(3, 9, 16, 27, C.night);
    for (let x = 3; x <= 16; x += 3) c.col(x, 9, 27, C.iron);
    c.col(17, 9, 27, C.iron); c.clearRect(17, 9, 17, 27);
    c.row(18, 3, 16, C.ironDark);
    c.rect(12, 16, 14, 20, C.steel);
    c.set(13, 18, K);
    c.rect(2, 28, 17, 30, C.iron);
    c.row(28, 2, 17, C.steel);
  }, solid);
  const fountain = (c, w, yb, o = {}) => {
    // basin across the whole width, a stem and a bowl
    const cx = w >> 1, bt = yb - 8;
    c.rect(2, bt, w - 3, yb, C.stone);
    c.rect(1, bt, w - 2, bt + 1, C.stoneLight);
    c.row(bt + 2, 2, w - 3, C.stoneDark);
    c.rect(1, yb - 1, w - 2, yb, C.stoneDark);
    c.rect(3, bt - 1, w - 4, bt - 1, C.water);
    c.rect(cx - 2, bt - 12, cx + 1, bt - 1, C.stone);
    c.col(cx - 2, bt - 12, bt - 1, C.stoneLight);
    c.poly([[cx - 8, bt - 15], [cx + 7, bt - 15], [cx + 4, bt - 12], [cx - 5, bt - 12]], C.stone);
    c.row(bt - 15, cx - 8, cx + 7, C.stoneLight);
    c.row(bt - 16, cx - 6, cx + 5, C.water);
    c.rect(cx - 1, bt - 20, cx, bt - 16, C.stone);
    if (!o.dry) {
      c.rect(cx - 1, bt - 22, cx, bt - 21, C.glassLight);
      for (const s of [-1, 1]) {
        const x = s < 0 ? cx - 8 : cx + 7;
        c.col(x, bt - 14, bt - 2, C.glassLight);
        c.col(x + s, bt - 11, bt - 2, C.glass);
        c.set(x - s * 3, bt - 2, C.glassLight);
      }
      pts(c, [[cx - 3, bt - 17], [cx + 2, bt - 17], [6, bt - 2], [w - 8, bt - 2]], C.glassLight);
    }
  };
  def('fountain', 42, 34, (c) => fountain(c, 42, 32), solid);


  /* ================= nature ================= */
  const AUTUMN = hex('#a8642c'), BLOSSOM = hex('#a98089'), BARK = blend(C.wood, C.stoneDark, 0.35);
  const tree = (c, col, seed, fruit) => {
    c.rect(19, 34, 24, 59, C.wood);
    c.col(19, 34, 59, C.woodLight);
    c.rect(23, 34, 24, 59, C.woodDark);
    c.rect(17, 58, 26, 59, C.wood);
    c.rect(16, 59, 27, 59, C.woodDark);
    c.line(21, 42, 12, 33, C.woodDark);
    c.line(22, 42, 31, 32, C.woodDark);
    pts(c, [[21, 46], [22, 52], [20, 55]], C.woodDark);
    leaves(c, 21, 20, 14, 13, col, seed);
    if (fruit) { const r = rnd(seed + 5); for (let i = 0; i < 40; i++) { const x = 8 + Math.floor(r() * 9) * 3, y = 8 + Math.floor(r() * 8) * 3; if (i % 3) continue; if (c.get(x, y) && c.get(x + 1, y + 1) && c.get(x - 1, y - 1)) { c.rect(x, y, x + 1, y + 1, fruit); c.set(x, y, L(fruit)); } } }
  };
  def('tree', 44, 62, (c) => tree(c, C.leafLight, 2), solid);
  def('tree-autumn', 44, 62, (c) => tree(c, AUTUMN, 3), solid);
  def('tree-cherry', 44, 62, (c) => tree(c, BLOSSOM, 4), solid);
  def('tree-apple', 44, 62, (c) => tree(c, C.leaf, 6, C.red), solid);
  const pine = (c, snow) => {
    c.rect(15, 50, 18, 59, C.woodDark);
    c.col(15, 50, 59, C.wood);
    const col = C.leaf, tiers = [[2, 17, 6], [11, 29, 9], [21, 41, 12], [32, 52, 15]];
    lump(c, (t) => { for (const [ty, by, hw] of tiers) t.poly([[16, ty], [17, ty], [17 + hw, by], [16 - hw, by]], col); t.rect(16, 1, 17, 2, col); }, col, { seed: 4, noise: 0.5 });
    for (const [ty, by, hw] of tiers) {
      for (let x = 16 - hw; x <= 17 + hw; x++) if ((x * 3) % 4 < 2) c.set(x, by, DD(col)); else if (c.get(x, by + 1)) c.set(x, by + 1, DD(col));
      if (snow) {
        c.poly([[16, ty], [17, ty], [17 + hw * 0.5, ty + (by - ty) * 0.5], [16 - hw * 0.55, ty + (by - ty) * 0.55]], X.snow);
        for (let x = 16 - hw + 1; x <= 16; x += 2) c.set(x, by - 1, X.snow);
        c.line(16 - hw * 0.55, ty + (by - ty) * 0.55, 16 - hw + 1, by - 1, X.snow);
        pts(c, [[14, ty + (by - ty) * 0.6], [19, ty + (by - ty) * 0.62]], X.snow);
      }
    }
    if (snow) c.rect(16, 1, 17, 2, C.white);
  };
  def('pine', 34, 62, (c) => pine(c, false), solid);
  def('pine-snow', 34, 62, (c) => pine(c, true), solid);
  def('palm', 42, 58, (c) => {
    for (let y = 55; y >= 14; y--) {
      const x = 16 + Math.round(5 * Math.sin(((55 - y) / 41) * 1.6));
      c.rect(x, y, x + 3, y, y % 4 === 0 ? C.woodDark : C.woodPale);
      c.set(x, y, L(C.woodPale));
      c.set(x + 3, y, C.wood);
    }
    c.rect(15, 55, 20, 56, C.wood);
    const cx = 23, cy = 13;
    for (const [ex, ey, up] of [[3, 20, 9], [39, 21, 9], [2, 9, 7], [40, 10, 7], [10, 2, 3], [34, 2, 3], [21, 27, -2]]) {
      for (let i = 0; i <= 24; i++) {
        const t = i / 24, mx = (cx + ex) / 2, my = Math.min(cy, ey) - up;
        const x = Math.round((1 - t) * (1 - t) * cx + 2 * t * (1 - t) * mx + t * t * ex), y = Math.round((1 - t) * (1 - t) * cy + 2 * t * (1 - t) * my + t * t * ey);
        c.set(x, y, C.leafLight);
        c.set(x, y + 1, C.leaf);
        if (i % 2 === 0 && t > 0.15) { c.set(x, y + 2, C.leaf); if (t < 0.85) c.set(x, y + 3, D(C.leaf)); }
      }
    }
    disc(c, 21, 15, 1, C.woodDark);
    disc(c, 24, 16, 1, C.wood);
  }, solid);
  const branch = (c, x, y, a, len, w, col, r, depth) => {
    const ex = x + Math.cos(a) * len, ey = y - Math.sin(a) * len;
    for (let t = 0; t < w; t++) c.line(x + t, y, ex + t, ey, t === 0 && w > 1 ? L(col) : col);
    if (depth > 0) {
      branch(c, ex, ey, a + 0.45 + r() * 0.4, len * 0.68, Math.max(1, w - 1), col, r, depth - 1);
      branch(c, ex, ey, a - 0.4 - r() * 0.4, len * 0.7, Math.max(1, w - 1), col, r, depth - 1);
    }
  };
  def('dead-tree', 40, 56, (c) => {
    const r = rnd(7);
    c.poly([[15, 53], [17, 30], [21, 30], [24, 53]], BARK);
    c.line(16, 53, 18, 30, L(BARK));
    c.line(22, 53, 20, 32, D(BARK));
    c.rect(13, 53, 26, 53, D(BARK));
    branch(c, 17, 31, 2.1, 12, 3, BARK, r, 3);
    branch(c, 19, 31, 1.0, 13, 3, BARK, r, 3);
    branch(c, 21, 40, 0.5, 8, 2, BARK, r, 1);
    c.oval(18, 38, 20, 41, K);
  }, solid);
  const bush = (c, berry) => {
    leaves(c, 11, 8, 8, 5, C.leaf, 9);
    c.clearRect(0, 14, 23, 20);
    c.row(13, 4, 18, DD(C.leaf));
    if (berry) pts(c, [[6, 6], [10, 4], [14, 7], [8, 10], [16, 10], [12, 9], [4, 9], [18, 6]], C.red);
  };
  def('bush', 23, 15, (c) => bush(c, false), solid);
  def('bush-berry', 23, 15, (c) => bush(c, true), solid);
  def('rock', 20, 14, (c) => boulder(c, 1, 1, 18, 12, C.stone, 3), solid);
  def('rock-mossy', 20, 14, (c) => {
    boulder(c, 1, 1, 18, 12, C.stone, 5);
    for (let x = 2; x <= 16; x++) for (let y = 1; y <= 5 + ((x * 5) % 3); y++) if (c.get(x, y) && (x + y) % 5 !== 0 && y < 7 - Math.abs(x - 8) / 3) c.set(x, y, y < 3 ? L(C.moss) : C.moss);
  }, solid);
  def('rock-small', 9, 7, (c) => boulder(c, 1, 1, 7, 5, C.stone, 2, { plain: true, grain: 2 }));
  const flower = (c, col, mid, o = {}) => {
    const h = o.h || 11, cx = 3;
    c.col(cx, 4, h - 2, C.leafLight);
    c.set(cx - 1, h - 4, C.leaf); c.set(cx - 2, h - 5, C.leaf);
    c.set(cx + 1, h - 5, C.leaf); c.set(cx + 2, h - 6, C.leaf);
    if (o.tulip) { c.rect(2, 1, 4, 4, col); c.set(3, 1, null); c.clear(3, 1); c.col(2, 1, 4, L(col)); c.set(3, 4, D(col)); }
    else { c.rect(2, 1, 4, 5, col); c.rect(1, 2, 5, 4, col); c.set(3, 3, mid); c.set(2, 2, L(col)); }
  };
  def('flower-red', 7, 12, (c) => flower(c, C.red, C.flameLight));
  def('flower-blue', 7, 12, (c) => flower(c, X.sky, C.flameLight));
  def('flower-white', 7, 12, (c) => flower(c, C.white, C.mustard));
  def('tulip', 7, 12, (c) => flower(c, BLOSSOM, 0, { tulip: true }));
  def('sunflower', 11, 24, (c) => {
    c.rect(5, 9, 5, 22, C.leafLight);
    c.rect(2, 14, 4, 15, C.leaf); c.rect(6, 17, 8, 18, C.leaf);
    disc(c, 5, 5, 4, X.yellow);
    pts(c, [[1, 2], [9, 2], [1, 8], [9, 8]], null);
    c.clear(2, 2); c.clear(8, 2); c.clear(2, 8); c.clear(8, 8);
    disc(c, 5, 5, 2, C.woodDark);
    c.set(4, 4, C.wood);
  });
  const mushroom = (c, cap, spot) => {
    c.rect(4, 5, 6, 8, C.bone);
    c.col(6, 5, 8, D(C.bone));
    c.oval(1, 1, 9, 8, cap);
    c.clearRect(0, 6, 3, 9); c.clearRect(7, 6, 10, 9);
    c.row(5, 1, 9, D(cap));
    c.row(1, 4, 6, L(cap));
    pts(c, [[3, 3], [7, 2], [6, 4]], spot);
  };
  def('mushroom-brown', 11, 10, (c) => mushroom(c, C.rust, C.woodPale));
  def('mushroom-glow', 11, 10, (c) => mushroom(c, hex('#4f8aa8'), C.glassLight), noShade);
  const tuft = (c, w, col) => {
    for (let x = 1; x < w - 1; x++) {
      const h = 2 + ((x * 7) % 5);
      c.col(x, 6 - h + 1, 6, x % 2 ? col : D(col));
      if (x % 3 === 0) c.set(x, 6 - h + 1, L(col));
    }
  };
  def('grass', 11, 8, (c) => tuft(c, 11, C.leafLight));
  def('cactus', 16, 26, (c) => {
    const g = hex('#4f6e44');
    c.rect(6, 2, 9, 24, g); c.rect(7, 1, 8, 1, g);
    c.rect(1, 8, 3, 14, g); c.rect(1, 13, 6, 15, g); c.clear(1, 8); c.clear(3, 8); c.set(2, 7, g);
    c.rect(12, 5, 14, 12, g); c.rect(9, 11, 14, 13, g); c.set(13, 4, g);
    c.col(6, 2, 24, L(g)); c.col(1, 9, 14, L(g)); c.col(12, 6, 11, L(g));
    c.col(8, 2, 24, D(g));
    pts(c, [[7, 4], [7, 9], [7, 14], [7, 19], [2, 11], [13, 8]], C.bone);
    c.set(7, 1, BLOSSOM);
  }, solid);
  def('stump', 18, 12, (c) => {
    c.rect(3, 3, 14, 10, C.wood);
    c.rect(1, 9, 16, 10, C.wood); c.clearRect(5, 10, 6, 10);
    c.oval(3, 1, 14, 5, C.woodPale);
    ring(c, 5, 2, 12, 4, C.woodLight, 1);
    c.set(8, 3, C.wood);
    for (const x of [5, 8, 12]) c.col(x, 6, 10, C.woodDark);
    c.col(3, 4, 10, C.woodLight);
  }, solid);
  def('log', 26, 10, (c) => {
    c.rect(4, 1, 23, 8, C.wood);
    c.row(1, 4, 21, C.woodLight);
    for (const [x0, x1, y] of [[6, 12, 3], [14, 20, 5], [7, 16, 7]]) c.row(y, x0, x1, C.woodDark);
    c.oval(1, 1, 7, 8, C.woodPale);
    ring(c, 2, 2, 6, 7, C.woodLight, 1);
    c.set(4, 4, C.wood);
    c.rect(15, 1, 16, 1, C.moss);
  }, solid);
  def('lily-pad', 16, 8, (c) => {
    c.oval(1, 3, 14, 7, C.leafLight);
    c.oval(2, 3, 13, 5, L(C.leafLight));
    c.poly([[8, 5], [14, 3], [14, 5]], null); c.clearRect(11, 4, 14, 4);
    c.rect(4, 1, 7, 3, BLOSSOM); c.set(5, 0, BLOSSOM); c.clear(5, 0);
    c.rect(5, 2, 6, 2, C.flameLight);
    c.row(7, 3, 12, C.leaf);
  }, noShade);
  const cluster = (c, col) => {
    shard(c, 2, 16, 4, 8, -1, D(col));
    shard(c, 12, 16, 5, 10, 1, D(col));
    shard(c, 6, 16, 6, 16, 0, col);
    shard(c, 4, 16, 3, 5, 0, col);
    shard(c, 10, 16, 4, 7, 1, col);
    c.rect(2, 16, 16, 16, DD(col));
  };
  def('crystal-purple', 19, 19, (c) => cluster(c, X.purple), noShade);
  const stalag = (c, x0, x1, yb, h, col = C.stoneDark) => {
    const m = (x0 + x1) / 2;
    c.poly([[x0, yb], [m - 0.5, yb - h + 1], [m + 0.5, yb - h + 1], [x1, yb]], col);
    c.line(x0 + 1, yb, Math.floor(m), yb - h + 2, L(col));
    c.line(Math.ceil(m) + 1, yb - h * 0.5, x1 - 1, yb, D(col));
    for (let y = yb - 2; y > yb - h + 4; y -= 4) c.set(Math.round(m), y, D(col));
  };
  def('stalagmite', 12, 22, (c) => { stalag(c, 1, 10, 20, 20, C.stone); c.rect(1, 20, 10, 20, C.stoneDark); }, solid);
  def('snowman', 18, 28, (c) => {
    disc(c, 8, 20, 6, X.snow); c.clearRect(0, 26, 17, 27); c.row(25, 5, 11, C.ash);
    disc(c, 8, 11, 4, X.snow);
    disc(c, 8, 5, 3, X.snow);
    c.rect(6, 1, 10, 2, C.black); c.row(3, 4, 12, C.black);
    pts(c, [[7, 5], [9, 5]], K);
    c.rect(9, 6, 11, 6, X.orange);
    c.row(8, 5, 11, C.wine); c.col(10, 9, 11, C.wine);
    pts(c, [[8, 11], [8, 14], [8, 18]], K);
    c.line(4, 11, 1, 8, C.woodDark); c.line(12, 11, 15, 8, C.woodDark);
    for (let y = 16; y < 25; y++) c.set(13 - (y > 22 ? y - 22 : 0), y, C.ash);
  }, solid);
  def('hay-bale', 22, 15, (c) => {
    c.rect(1, 2, 20, 13, C.straw);
    c.row(1, 2, 19, L(C.straw));
    c.speckle(1, 2, 20, 13, D(C.straw), 4, 2);
    c.speckle(1, 2, 20, 13, L(C.straw), 6, 5);
    c.col(6, 1, 13, C.earth); c.col(15, 1, 13, C.earth);
    c.row(13, 1, 20, D(C.straw));
    pts(c, [[2, 14], [9, 14], [18, 14]], C.straw); c.clearRect(0, 14, 21, 14);
  }, solid);
  /** A span of picket fence: posts at the ends, two rails. */
  const fence = (c, w, o = {}) => {
    const col = o.col || C.woodLight, yb = 12;
    if (!o.noRails) { c.rect(o.x0 == null ? 1 : o.x0, 4, o.x1 == null ? w - 2 : o.x1, 5, col); c.rect(o.x0 == null ? 1 : o.x0, 8, o.x1 == null ? w - 2 : o.x1, 9, col); c.row(5, o.x0 == null ? 1 : o.x0, o.x1 == null ? w - 2 : o.x1, C.wood); c.row(9, o.x0 == null ? 1 : o.x0, o.x1 == null ? w - 2 : o.x1, C.wood); }
    for (const x of o.posts || [1, w - 4]) {
      c.rect(x, 2, x + 2, yb, col);
      c.set(x + 1, 1, col);
      c.col(x, 2, yb, L(col));
      c.col(x + 2, 2, yb, C.wood);
      c.set(x + 1, 5, C.iron); c.set(x + 1, 9, C.iron);
    }
  };
  def('fence', 18, 14, (c) => fence(c, 18, { posts: [1, 7, 14] }), solid);
  def('wheat', 14, 20, (c) => {
    for (const [x, t] of [[2, 4], [5, 1], [8, 3], [11, 2]]) {
      c.col(x, t + 4, 18, C.straw);
      c.rect(x - 1, t, x + 1, t + 4, C.gold); c.clear(x - 1, t); c.clear(x + 1, t);
      c.set(x, t + 1, C.flameLight); c.set(x, t + 3, C.mustard);
      c.set(x + 1, 14 + (x % 3), C.leafLight);
    }
  });
  def('scarecrow', 26, 40, (c) => {
    pole(c, 12, 10, 37, C.wood);
    c.rect(2, 13, 23, 14, C.wood);
    c.rect(6, 12, 19, 25, C.rust);
    c.rect(2, 12, 6, 16, C.rust); c.rect(19, 12, 23, 16, C.rust);
    c.col(6, 12, 25, L(C.rust));
    c.rect(11, 14, 13, 24, C.earth);
    pts(c, [[1, 13], [1, 15], [24, 13], [24, 15], [1, 14], [24, 14]], C.straw);
    for (let x = 6; x <= 19; x += 2) c.col(x, 26, 27 + (x % 3), C.straw);
    c.rect(8, 4, 16, 11, C.straw); c.clear(8, 4); c.clear(16, 4);
    c.col(8, 5, 11, L(C.straw));
    pts(c, [[10, 7], [14, 7]], K); c.row(9, 10, 14, K); pts(c, [[11, 10], [13, 10]], K);
    c.poly([[12, 0], [12, 0]], null);
    c.rect(6, 4, 18, 4, C.woodDark); c.rect(9, 1, 15, 3, C.woodDark); c.row(1, 10, 14, C.wood);
    c.rect(11, 12, 13, 12, C.wine);
  }, solid);
  def('coral', 16, 16, (c) => {
    const r = rnd(3), col = hex('#b07a84');
    c.rect(6, 11, 9, 14, col);
    branch(c, 6, 11, 2.2, 5, 2, col, r, 2);
    branch(c, 8, 11, 1.2, 6, 2, col, r, 2);
    branch(c, 7, 12, 1.6, 7, 2, col, r, 1);
    c.rect(4, 14, 11, 14, D(col));
  });
  def('shell', 10, 8, (c) => {
    c.poly([[1, 4], [4, 1], [6, 1], [8, 4], [6, 6], [3, 6]], C.bone);
    for (const x of [2, 4, 6]) c.line(4.5, 6, x + 0.5, 2, D(C.bone));
    c.row(1, 4, 5, C.white);
    c.rect(4, 6, 5, 6, BLOSSOM);
  });
  def('starfish', 12, 11, (c) => {
    const col = hex('#b5703a');
    c.poly([[5, 1], [6, 1], [7, 4], [10, 4], [8, 6], [9, 9], [5.5, 7], [2, 9], [3, 6], [1, 4], [4, 4]], col);
    pts(c, [[5, 3], [5, 5], [3, 5], [8, 5], [4, 7], [7, 7]], L(col));
  });
  def('cloud', 42, 16, (c) => {
    const w = hex('#b9bcc0');
    c.oval(2, 6, 16, 14, w); c.oval(10, 2, 26, 14, w); c.oval(22, 5, 34, 14, w); c.oval(30, 8, 40, 14, w);
    c.rect(4, 11, 38, 14, w);
    c.oval(12, 3, 22, 8, L(w)); c.oval(4, 7, 10, 10, L(w)); c.oval(24, 6, 30, 9, L(w));
    c.row(14, 5, 37, D(w)); c.row(13, 9, 30, D(w));
  }, flat);


  /* ================= level props ================= */
  const SANDSTONE = hex('#a88d62');
  /** A column: base on row yb, capital at row y0, w wide (even), on a canvas where x0 is its left edge. */
  const pillar = (c, x0, y0, yb, w, col, o = {}) => {
    const x1 = x0 + w - 1;
    c.rect(x0 + 2, y0, x1 - 2, yb, col);
    for (let x = x0 + 4; x < x1 - 2; x += 2) c.col(x, y0 + 4, yb - 4, D(col));
    c.col(x0 + 2, y0, yb, L(col));
    c.col(x1 - 2, y0, yb, D(col));
    if (!o.broken) { c.rect(x0, y0, x1, y0 + 1, L(col)); c.rect(x0 + 1, y0 + 2, x1 - 1, y0 + 3, col); c.row(y0 + 3, x0 + 1, x1 - 1, D(col)); }
    else { for (let x = x0 + 2; x <= x1 - 2; x++) c.clearRect(x, y0, x, y0 + ((x * 5 + 1) % 4)); }
    c.rect(x0 + 1, yb - 3, x1 - 1, yb - 2, col);
    c.row(yb - 3, x0 + 1, x1 - 1, L(col));
    c.rect(x0, yb - 1, x1, yb, D(col));
    c.row(yb - 1, x0, x1, col);
    if (o.cracks) { c.line(x0 + 5, y0 + 8, x0 + 7, y0 + 14, DD(col)); c.line(x0 + 7, y0 + 14, x0 + 6, y0 + 18, DD(col)); }
  };
  const chips = (c, list, col) => list.forEach(([x, y, w]) => { c.rect(x, y, x + w - 1, y + 1, col); c.row(y, x, x + w - 1, L(col)); });
  def('pillar-short', 14, 36, (c) => pillar(c, 1, 1, 34, 12, C.stone, { cracks: true }), solid);
  def('pillar-sandstone', 14, 36, (c) => { pillar(c, 1, 1, 34, 12, SANDSTONE); c.rect(3, 7, 10, 8, D(SANDSTONE)); pts(c, [[4, 6], [6, 6], [8, 6], [10, 6]], D(SANDSTONE)); c.rect(3, 27, 10, 28, D(SANDSTONE)); }, solid);
  def('pillar-short-broken', 20, 18, (c) => { pillar(c, 1, 3, 16, 12, C.stone, { broken: true }); chips(c, [[14, 15, 4], [15, 12, 3]], C.stone); c.speckle(1, 8, 12, 16, C.moss, 9, 2); }, solid);
  def('statue-knight', 22, 44, (c) => {
    const s = C.stoneLight;
    pedestal(c, 2, 32, 19, 42, C.stone);
    figure(c, 5, 31, s);
    c.rect(8, 4, 13, 6, C.stone); c.row(6, 9, 12, DD(s)); c.col(10, 6, 9, D(s)); // helm with visor
    c.rect(10, 2, 11, 4, s);
    c.rect(17, 8, 18, 31, s); c.col(17, 8, 31, L(s)); c.rect(15, 14, 20, 14, C.stone); c.rect(17, 6, 18, 7, s); // sword, point down
    c.poly([[2, 15], [9, 15], [9, 22], [5.5, 26], [2, 22]], C.stone); c.frame(3, 16, 8, 21, C.stoneDark); c.col(5, 17, 23, s); c.row(18, 4, 7, s); // shield
  }, solid);
  def('statue-angel', 30, 46, (c) => {
    const s = C.stoneLight;
    pedestal(c, 6, 34, 23, 44, C.stone);
    for (const d of [1, -1]) {
      const X0 = d > 0 ? 9 : 20;
      c.poly([[X0, 12], [X0 - d * 6, 3], [X0 - d * 8, 8], [X0 - d * 7, 20], [X0 - d * 4, 27], [X0, 22]], d > 0 ? s : C.stone);
      for (let i = 0; i < 4; i++) c.line(X0 - d * (2 + i * 2), 9 + i, X0 - d * (2 + i * 1.5), 21 - i, C.stoneDark);
    }
    figure(c, 9, 33, s);
    c.rect(12, 20, 17, 22, s); c.row(22, 12, 17, D(s)); // hands folded
    c.speckle(2, 3, 27, 44, C.moss, 16, 5);
  }, solid);
  def('statue-broken', 26, 26, (c) => {
    pedestal(c, 1, 14, 16, 24, C.stone);
    c.poly([[5, 6], [8, 4], [10, 7], [12, 5], [13, 8], [14, 13], [3, 13]], C.stoneLight);
    c.line(6, 8, 5, 13, C.stoneDark); c.line(10, 8, 11, 13, C.stoneDark);
    c.oval(18, 18, 24, 24, C.stoneLight); pts(c, [[20, 21], [23, 21]], DD(C.stoneLight)); c.row(23, 20, 22, C.stoneDark);
    c.line(6, 16, 9, 20, C.stoneDark); c.line(9, 20, 8, 23, C.stoneDark);
    chips(c, [[17, 14, 3]], C.stone);
  }, solid);
  def('fountain-small', 30, 34, (c) => fountain(c, 30, 32), solid);
  /** A round well wall seen from the side, with its mouth as a thin ellipse. */
  const wellWall = (c, x0, y0, x1, yb, inside) => {
    bricks(c, x0, y0 + 2, x1, yb, C.stone, 5, 3);
    c.col(x0, y0 + 2, yb, C.stoneLight);
    c.oval(x0, y0, x1, y0 + 4, C.stoneLight);
    c.oval(x0 + 2, y0 + 1, x1 - 2, y0 + 3, inside);
    c.row(yb, x0, x1, C.stoneDark);
  };
  def('well-stone', 30, 42, (c) => {
    pole(c, 3, 8, 30, C.wood); pole(c, 25, 8, 30, C.wood);
    c.rect(4, 14, 25, 15, C.woodDark); c.row(14, 4, 25, C.wood);
    c.col(14, 16, 24, C.straw);
    c.rect(12, 24, 17, 27, C.woodLight); c.row(26, 12, 17, C.iron);
    c.poly([[1, 9], [14, 1], [15, 1], [28, 9]], X.tile);
    c.line(1, 9, 14, 1, L(X.tile)); c.row(9, 1, 28, D(X.tile)); c.row(5, 8, 21, D(X.tile));
    wellWall(c, 2, 28, 27, 40, C.night);
  }, solid);
  def('well-water', 26, 14, (c) => { wellWall(c, 1, 1, 24, 12, C.water); c.row(2, 8, 12, C.glassLight); }, solid);
  def('well-dry', 26, 14, (c) => { wellWall(c, 1, 1, 24, 12, K); c.line(15, 6, 17, 10, C.stoneDark); pts(c, [[5, 7], [20, 9]], C.moss); }, solid);
  const skull = (c, x, y, col = C.bone) => {
    // 7 wide, 7 tall
    c.rect(x + 1, y, x + 5, y, col); c.rect(x, y + 1, x + 6, y + 4, col); c.rect(x + 1, y + 5, x + 5, y + 6, col);
    c.rect(x + 1, y + 2, x + 2, y + 3, K); c.rect(x + 4, y + 2, x + 5, y + 3, K);
    c.set(x + 3, y + 4, DD(col)); pts(c, [[x + 2, y + 6], [x + 4, y + 6]], DD(col));
    c.set(x + 1, y, L(col)); c.set(x, y + 1, L(col));
  };
  def('sign-warning', 16, 26, (c) => {
    pole(c, 7, 12, 24, C.wood);
    c.box(1, 1, 14, 13, C.woodLight);
    skull(c, 4, 3);
    c.line(2, 11, 4, 9, C.bone); c.line(13, 11, 11, 9, C.bone);
    pts(c, [[2, 2], [13, 2]], C.iron);
  });
  def('sign-board', 28, 30, (c) => {
    pole(c, 3, 6, 28, C.wood); pole(c, 23, 6, 28, C.wood);
    c.poly([[1, 5], [13, 1], [14, 1], [26, 5]], C.woodDark); c.line(1, 5, 13, 1, C.wood);
    c.box(2, 6, 25, 20, C.woodLight);
    for (const [x, y, w, h, col] of [[4, 8, 6, 7, C.paper], [12, 7, 5, 5, C.parchment], [18, 9, 6, 8, C.paper], [11, 13, 6, 6, C.white]]) {
      c.rect(x, y, x + w - 1, y + h - 1, col);
      for (let j = y + 2; j < y + h - 1; j += 2) scribble(c, x + 1, j, x + w - 2, C.stoneDark);
      c.set(x + (w >> 1), y, C.red);
    }
  });
  def('street-lamp', 16, 56, (c) => {
    pole(c, 4, 6, 52, C.ironDark);
    ring(c, 4, 2, 13, 11, C.ironDark, 1.5); c.clearRect(4, 7, 13, 11); c.rect(4, 6, 5, 12, C.ironDark);
    c.rect(11, 6, 13, 7, C.ironDark);
    disc(c, 12, 10, 2, C.glow); c.set(12, 10, C.white); c.row(13, 11, 13, C.ironDark);
    c.rect(3, 46, 6, 52, C.iron); c.rect(2, 53, 7, 54, C.ironDark); c.col(3, 46, 52, C.steel);
    c.col(4, 13, 45, C.iron);
  }, solid);
  const lantern = (c, cx, y, lit = true) => {
    // 5 wide, 8 tall, hangs from row y
    c.set(cx, y, C.iron); c.rect(cx - 2, y + 1, cx + 2, y + 1, C.ironDark);
    c.rect(cx - 2, y + 2, cx + 2, y + 6, lit ? C.glow : D(C.glass));
    if (lit) c.rect(cx, y + 4, cx, y + 5, C.flame);
    c.col(cx - 2, y + 2, y + 6, C.iron); c.col(cx + 2, y + 2, y + 6, C.iron);
    c.rect(cx - 2, y + 7, cx + 2, y + 7, C.ironDark);
  };
  def('lantern-post', 16, 36, (c) => {
    pole(c, 3, 2, 34, C.wood);
    c.rect(3, 4, 12, 5, C.wood); c.row(4, 3, 12, C.woodLight);
    c.line(5, 10, 9, 6, C.woodDark);
    lantern(c, 11, 6);
    c.rect(2, 33, 6, 34, C.woodDark);
  }, solid);
  const brazier = (c, lit) => {
    c.line(3, 13, 1, 25, C.ironDark); c.line(12, 13, 14, 25, C.ironDark); c.col(7, 14, 25, C.iron); c.col(8, 14, 25, C.ironDark);
    c.row(20, 3, 12, C.ironDark);
    c.poly([[1, 9], [14, 9], [11, 13], [4, 13]], C.iron);
    c.row(9, 1, 14, C.steel);
    if (lit) { c.row(8, 3, 12, C.flame); flame(c, 6, 8, 8, 6); flame(c, 10, 8, 6, 5); }
    else { c.row(8, 3, 12, C.black); pts(c, [[4, 7], [5, 7], [8, 7], [10, 7], [11, 7], [7, 8]], C.ironDark); pts(c, [[6, 8], [10, 8]], C.rust); }
  };
  def('brazier-lit', 16, 27, (c) => brazier(c, true), noShade);
  def('brazier-unlit', 16, 27, (c) => brazier(c, false));
  def('torch-stand', 10, 36, (c) => {
    pole(c, 4, 10, 32, C.iron);
    c.poly([[2, 7], [7, 7], [6, 11], [3, 11]], C.wood); c.row(7, 2, 7, C.iron);
    flame(c, 4.5, 6, 6, 5);
    c.rect(2, 33, 7, 34, C.ironDark); c.row(32, 3, 6, C.iron);
  }, noShade);
  def('stalagmite-tall', 14, 36, (c) => { stalag(c, 1, 12, 34, 34, C.stone); stalag(c, 8, 12, 34, 10, C.stoneDark); c.row(34, 1, 12, C.stoneDark); }, solid);
  def('stalagmites', 24, 16, (c) => { stalag(c, 1, 7, 14, 9, C.stoneDark); stalag(c, 14, 22, 14, 11, C.stoneDark); stalag(c, 6, 14, 14, 14, C.stone); stalag(c, 18, 22, 14, 5, C.stone); c.row(14, 1, 22, DD(C.stone)); }, solid);
  def('crystal-blue', 19, 19, (c) => cluster(c, hex('#4a78a0')), noShade);
  def('crystal-green', 19, 19, (c) => cluster(c, hex('#3f8a5e')), noShade);
  def('crystal-red', 19, 19, (c) => cluster(c, hex('#a03a3c')), noShade);
  def('rubble', 26, 12, (c) => {
    boulder(c, 12, 4, 23, 10, C.stoneDark, 4, { plain: true });
    boulder(c, 1, 5, 10, 10, C.stone, 2, { plain: true });
    boulder(c, 7, 1, 17, 10, C.stone, 6);
    chips(c, [[20, 9, 4], [3, 9, 3]], C.stoneLight);
  }, solid);
  def('rubble-wood', 28, 13, (c) => {
    for (const [x0, y0, x1, y1, col] of [[1, 10, 20, 5, C.wood], [6, 11, 26, 8, C.woodLight], [3, 5, 16, 11, C.woodDark], [12, 2, 22, 10, C.wood]]) {
      c.line(x0, y0, x1, y1, col); c.line(x0, y0 - 1, x1, y1 - 1, col); c.line(x0, y0 - 2, x1, y1 - 2, L(col));
    }
    c.rect(2, 10, 25, 11, C.woodDark); c.row(10, 4, 22, C.wood);
    pts(c, [[8, 6], [18, 5], [22, 9]], C.iron);
  }, solid);
  const bone = (c, x0, y0, x1, y1, col = C.bone) => { c.line(x0, y0, x1, y1, col); for (const [x, y] of [[x0, y0], [x1, y1]]) { c.set(x, y - 1, col); c.set(x, y + 1, col); } };
  def('bones-pile', 24, 12, (c) => {
    bone(c, 2, 8, 12, 4); bone(c, 6, 4, 19, 9); bone(c, 10, 9, 21, 5, D(C.bone)); bone(c, 2, 5, 9, 9, D(C.bone));
    c.rect(4, 9, 19, 10, D(C.bone)); c.row(9, 5, 18, C.bone);
    skull(c, 13, 1);
    for (let x = 5; x < 11; x += 2) c.col(x, 6, 8, C.bone);
  });
  def('skull-pile', 24, 17, (c) => {
    c.rect(2, 12, 21, 15, DD(C.bone));
    skull(c, 1, 9, D(C.bone)); skull(c, 16, 9, D(C.bone)); skull(c, 8, 9);
    skull(c, 5, 4); skull(c, 12, 5, D(C.bone)); skull(c, 9, 1);
  }, solid);
  const cobweb = (c, flip) => {
    const col = hex('#b9b9b4'), d = D(col), X_ = (x) => (flip ? 19 - x : x);
    for (const [ex, ey] of [[19, 0], [18, 7], [13, 13], [7, 18], [0, 19]]) c.line(X_(0), 0, X_(ex), ey, col);
    for (const r of [6, 11, 16]) for (let a = 0; a < 4; a++) {
      const p = [[r, 0], [r * 0.9, r * 0.36], [r * 0.66, r * 0.66], [r * 0.36, r * 0.9], [0, r]];
      const m = [(p[a][0] + p[a + 1][0]) / 2 * 0.86, (p[a][1] + p[a + 1][1]) / 2 * 0.86];
      c.line(X_(p[a][0]), p[a][1], X_(m[0]), m[1], d); c.line(X_(m[0]), m[1], X_(p[a + 1][0]), p[a + 1][1], d);
    }
  };
  def('cobweb-corner', 20, 20, (c) => cobweb(c, false), flat);
  def('cobweb-corner-right', 20, 20, (c) => cobweb(c, true), flat);
  def('floor-cracks', 24, 9, (c) => {
    const k = hex('#1c1820');
    c.line(1, 4, 7, 3, k); c.line(7, 3, 12, 6, k); c.line(12, 6, 18, 4, k); c.line(18, 4, 22, 5, k);
    c.line(7, 3, 9, 0, k); c.line(12, 6, 11, 8, k); c.line(18, 4, 20, 1, k); c.line(4, 4, 3, 7, k);
    c.row(5, 10, 13, k);
  }, flat);
  def('puddle', 26, 8, (c) => {
    c.oval(1, 1, 24, 6, C.water); c.oval(14, 3, 25, 7, C.water);
    c.row(2, 6, 12, C.glass); c.row(4, 16, 21, C.glass); pts(c, [[8, 3], [9, 3]], C.glassLight);
  }, flat);
  def('scorch-mark', 26, 9, (c) => {
    const k = hex('#1c1820');
    c.oval(3, 2, 22, 7, k);
    for (let x = 1; x < 25; x += 2) { c.set(x, 4 + ((x * 3) % 3) - 1, k); c.set(x + 1, x % 3 ? 1 : 8, k); }
    c.oval(8, 3, 17, 5, hex('#3a3238')); pts(c, [[10, 4], [14, 4], [12, 3]], C.ash);
  }, flat);
  def('floor-hole', 24, 9, (c) => {
    c.oval(1, 1, 22, 7, hex('#3a2a22')); c.oval(2, 2, 21, 7, K);
    pts(c, [[3, 1], [12, 0], [20, 2], [1, 5]], hex('#3a2a22'));
  }, flat);
  def('grass-tuft', 14, 8, (c) => tuft(c, 14, C.moss));
  def('flower-patch', 24, 11, (c) => {
    for (let x = 1; x < 23; x++) { const h = 2 + ((x * 7) % 3); c.col(x, 9 - h + 1, 9, x % 2 ? C.leafLight : C.leaf); }
    for (const [x, y, col] of [[3, 4, C.red], [8, 2, X.yellow], [13, 4, BLOSSOM], [18, 3, C.red], [21, 5, X.yellow]]) {
      c.col(x, y + 2, 8, C.leaf); c.rect(x - 1, y, x + 1, y + 2, col); c.clear(x - 1, y); c.clear(x + 1, y); c.clear(x - 1, y + 2); c.clear(x + 1, y + 2); c.set(x, y + 1, col === X.yellow ? C.wood : C.flameLight);
    }
  });
  def('stairs-wood', 32, 28, (c) => {
    for (let i = 0; i < 6; i++) {
      const x = 1 + i * 5, y = 22 - i * 4;
      vplanks(c, x, y, 30, 26, C.wood, 5);
      c.rect(x, y, 30, y + 1, C.woodLight);
      c.row(y, x, 30, L(C.woodLight));
      c.row(y + 2, x, x + 4, C.woodDark);
    }
    for (let i = 0; i < 6; i++) c.rect(1 + i * 5 + 5, 22 - i * 4, 30, 22 - i * 4 + 1, C.wood);
    for (let i = 1; i < 6; i++) c.col(1 + i * 5, 22 - i * 4 + 4, 26, C.woodDark);
    c.rect(26, 2, 30, 26, C.wood); c.rect(27, 6, 29, 24, C.woodDark); c.col(26, 2, 26, C.woodLight);
    c.row(26, 1, 30, C.woodDark);
  }, solid);
  def('ladder-hole', 24, 20, (c) => {
    c.oval(1, 11, 22, 18, hex('#3a2a22')); c.oval(2, 12, 21, 18, K);
    c.rect(8, 1, 9, 15, C.woodLight); c.rect(14, 1, 15, 15, C.wood);
    for (const y of [3, 7, 11, 14]) c.row(y, 9, 14, C.woodLight);
    c.row(15, 8, 15, C.woodDark);
  }, { shade: false, outline: false });
  const floorLever = (c, on) => {
    c.rect(1, 13, 10, 15, C.stoneDark); c.row(13, 1, 10, C.stone);
    c.rect(4, 11, 7, 12, C.iron);
    const tx = on ? 10 : 1;
    c.line(5, 11, tx, 3, C.steel); c.line(6, 11, tx + (on ? -1 : 1), 3, C.iron);
    c.rect(tx - 1, 1, tx + 1, 3, on ? X.green : C.red); c.set(tx - 1, 1, L(on ? X.green : C.red));
  };
  def('lever-floor-off', 12, 17, (c) => floorLever(c, false));
  def('lever-floor-on', 12, 17, (c) => floorLever(c, true));
  def('floor-switch', 16, 7, (c) => { c.rect(1, 4, 14, 5, C.stone); c.row(4, 1, 14, C.stoneLight); c.rect(4, 1, 11, 3, C.red); c.row(1, 5, 10, L(C.red)); c.clear(4, 1); c.clear(11, 1); });
  def('floor-switch-pressed', 16, 7, (c) => { c.rect(1, 4, 14, 5, C.stone); c.row(4, 1, 14, C.stoneLight); c.rect(4, 3, 11, 3, X.green); });
  const block = (c, col, o = {}) => {
    c.box(1, 1, 16, 16, col);
    c.frame(3, 3, 14, 14, D(col));
    c.row(4, 4, 13, L(col)); c.col(4, 4, 13, L(col));
    if (o.rune) { c.frame(7, 7, 10, 10, D(col)); c.set(8, 8, DD(col)); }
    if (o.ice) { c.line(5, 10, 10, 5, C.white); c.line(8, 12, 12, 8, C.white); c.line(4, 7, 6, 5, C.white); }
    if (o.gold) { c.poly([[8.5, 5], [12, 8.5], [8.5, 12], [5, 8.5]], L(col)); c.rect(8, 8, 9, 9, C.brass); }
  };
  def('push-block', 18, 18, (c) => { block(c, C.stone, { rune: true }); c.speckle(2, 2, 15, 15, C.stoneDark, 14, 2); }, solid);
  def('push-block-ice', 18, 18, (c) => block(c, X.ice, { ice: true }), solid);
  def('push-block-gold', 18, 18, (c) => block(c, C.gold, { gold: true }), solid);
  def('boulder-round', 28, 26, (c) => boulder(c, 1, 1, 26, 24, C.stone, 8), solid);
  def('boulder-mossy', 28, 26, (c) => {
    boulder(c, 1, 1, 26, 24, C.stone, 9);
    for (let x = 2; x <= 25; x++) for (let y = 1; y <= 12; y++) if (c.get(x, y) && y < 9 - Math.abs(x - 12) / 2.5 + ((x * 7) % 4) && (x * 3 + y * 5) % 7 !== 0) c.set(x, y, y < 4 ? L(C.moss) : (x + y) % 3 ? C.moss : D(C.moss));
  }, solid);
  def('boulder-snowy', 28, 26, (c) => {
    boulder(c, 1, 1, 26, 24, C.stoneDark, 10);
    for (let x = 2; x <= 25; x++) for (let y = 1; y <= 12; y++) if (c.get(x, y) && y < 8 - Math.abs(x - 12) / 2.5 + ((x * 7) % 3)) c.set(x, y, y > 5 && x > 14 ? D(X.snow) : X.snow);
  }, solid);
  def('boulder-sandstone', 28, 26, (c) => { boulder(c, 1, 1, 26, 24, SANDSTONE, 11); for (const y of [9, 15, 20]) for (let x = 2; x < 26; x++) if (c.get(x, y) && (x + y) % 6) c.set(x, y, D(SANDSTONE)); }, solid);
  /** A mine cart 22 wide: tub on row y0..y0+9, wheels under it. */
  const minecart = (c, x, yb, fill) => {
    const t = yb - 13;
    if (fill) { c.oval(x + 2, t - 3, x + 19, t + 4, fill); pts(c, [[x + 6, t - 2], [x + 11, t - 3], [x + 15, t - 1], [x + 8, t]], L(fill)); pts(c, [[x + 9, t - 1], [x + 14, t - 2], [x + 5, t], [x + 17, t]], D(fill)); }
    else c.rect(x + 2, t, x + 19, t + 1, K);
    c.poly([[x, t + 1], [x + 21, t + 1], [x + 19, yb - 4], [x + 2, yb - 4]], C.iron);
    c.rect(x, t + 1, x + 21, t + 2, C.steel);
    c.row(t + 3, x + 1, x + 20, C.ironDark);
    for (const k of [5, 10, 15]) c.col(x + k, t + 4, yb - 5, C.ironDark);
    pts(c, [[x + 2, t + 2], [x + 8, t + 2], [x + 13, t + 2], [x + 19, t + 2]], C.ironDark);
    c.speckle(x + 1, t + 4, x + 20, yb - 5, C.rust, 7, 3);
    c.rect(x + 3, yb - 4, x + 18, yb - 3, C.ironDark);
    wheel(c, x + 5, yb - 2, 2, C.ironDark, C.steel); wheel(c, x + 16, yb - 2, 2, C.ironDark, C.steel);
  };
  def('minecart-rails', 32, 22, (c) => {
    for (let x = 2; x < 30; x += 5) c.rect(x, 19, x + 2, 20, C.woodDark);
    c.row(18, 1, 30, C.steel); c.row(19, 1, 30, C.iron);
    minecart(c, 5, 18);
  }, solid);
  const hoard = (c, x0, x1, yb, h) => {
    const m = (x0 + x1) / 2;
    lump(c, (t) => { t.poly([[x0, yb], [x0 + 2, yb - h * 0.4], [m - 2, yb - h + 1], [m + 2, yb - h + 1], [x1 - 2, yb - h * 0.4], [x1, yb]], C.gold); }, C.gold, { seed: 3, grain: 1, noise: 1.1 });
    for (let x = x0; x <= x1; x += 3) c.set(x, yb, C.brass);
  };
  def('treasure-pile', 24, 12, (c) => { hoard(c, 1, 22, 10, 9); pts(c, [[7, 7], [15, 5]], C.red); c.set(11, 8, C.teal); pts(c, [[12, 3], [5, 8], [18, 8]], C.flameLight); });
  def('treasure-pile-big', 38, 24, (c) => {
    hoard(c, 1, 36, 22, 16);
    c.rect(15, 3, 22, 7, C.gold); c.row(7, 15, 22, C.brass); pts(c, [[15, 2], [18, 2], [19, 2], [22, 2], [15, 1], [22, 1]], C.gold); pts(c, [[17, 5], [20, 5]], C.red); c.col(15, 3, 6, C.flameLight);
    for (const [x, y, col] of [[8, 16, C.red], [27, 14, C.teal], [13, 19, X.purple], [22, 17, C.red], [30, 19, C.teal], [5, 20, C.glassLight]]) { c.rect(x, y, x + 1, y + 1, col); c.set(x, y, L(col)); }
    c.rect(25, 9, 28, 14, C.brass); c.rect(24, 8, 29, 8, C.gold); c.rect(25, 15, 28, 15, C.gold); // goblet
    pts(c, [[10, 12], [20, 10], [32, 17], [4, 18], [17, 14]], C.flameLight);
  }, solid);
  def('cage-empty', 18, 22, (c) => {
    c.rect(1, 1, 16, 2, C.iron); c.row(1, 1, 16, C.steel);
    c.rect(2, 3, 15, 17, C.night);
    for (let x = 2; x <= 15; x += 3) c.col(x, 3, 17, C.iron);
    c.col(15, 3, 17, C.iron);
    c.rect(9, 8, 14, 17, K); c.col(8, 3, 17, C.steel); // door standing open
    c.rect(1, 18, 16, 20, C.iron); c.row(18, 1, 16, C.steel);
  }, solid);
  const candle = (c, x, yb, h, col = C.bone, lit = true) => { c.rect(x, yb - h + 1, x + 1, yb, col); c.col(x + 1, yb - h + 1, yb, D(col)); if (lit) { c.rect(x, yb - h - 2, x + 1, yb - h, C.flame); c.set(x, yb - h, C.flameLight); c.clear(x + 1, yb - h - 2); } else c.set(x, yb - h, K); };
  const altar = (c, stone, cloth, darkOne) => {
    c.rect(4, 13, 27, 21, stone); c.col(4, 13, 21, L(stone));
    c.rect(2, 21, 29, 22, D(stone)); c.row(21, 2, 29, stone);
    c.rect(1, 9, 30, 12, stone); c.row(9, 1, 30, L(stone)); c.row(12, 1, 30, D(stone));
    c.frame(8, 14, 23, 19, D(stone));
    c.rect(10, 9, 21, 16, cloth); c.row(9, 10, 21, L(cloth)); c.row(16, 10, 21, C.gold); c.col(21, 10, 15, D(cloth));
    candle(c, 4, 8, 5, darkOne ? C.black : C.bone); candle(c, 26, 8, 4, darkOne ? C.black : C.bone);
    if (darkOne) { skull(c, 12, 2); c.rect(7, 9, 8, 13, C.blood); c.set(7, 14, C.blood); c.rect(23, 9, 23, 11, C.blood); c.poly([[16, 11], [18, 14], [14, 14]], C.gold); c.set(16, 13, cloth); }
    else { c.rect(15, 3, 16, 8, C.gold); c.rect(13, 5, 18, 5, C.gold); c.rect(15, 11, 16, 14, C.gold); c.row(12, 14, 17, C.gold); }
  };
  def('altar', 32, 24, (c) => altar(c, C.stoneLight, C.cream, false), solid);
  def('altar-dark', 32, 24, (c) => altar(c, C.stoneDark, C.plum, true), solid);
  def('throne-stone', 22, 40, (c) => {
    const s = C.stone;
    c.rect(4, 3, 17, 24, s); c.rect(6, 1, 15, 2, s); c.col(4, 3, 24, C.stoneLight); c.row(1, 6, 15, C.stoneLight);
    c.frame(7, 5, 14, 21, C.stoneDark); c.poly([[10.5, 8], [13, 12], [10.5, 16], [8, 12]], C.stoneDark);
    c.rect(1, 20, 4, 38, s); c.rect(17, 20, 20, 38, s); c.rect(1, 20, 4, 21, C.stoneLight); c.rect(17, 20, 20, 21, C.stoneLight); c.col(1, 22, 38, C.stoneLight);
    c.rect(5, 25, 16, 27, C.stoneLight); c.rect(5, 28, 16, 38, s); c.row(28, 5, 16, C.stoneDark);
    c.frame(7, 30, 14, 36, C.stoneDark);
    c.row(38, 1, 20, C.stoneDark);
    c.speckle(1, 1, 20, 38, C.stoneDark, 18, 6);
  }, solid);
  const stripes = (c, x0, y0, x1, y1, a, b, sw = 4) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) c.set(x, y, Math.floor((x - x0) / sw) % 2 ? b : a); };
  const stall = (c, w, a, b, goods) => {
    const h = 38;
    pole(c, 3, 9, h - 3, C.wood); pole(c, w - 5, 9, h - 3, C.wood);
    stripes(c, 1, 3, w - 2, 9, a, b); c.row(3, 1, w - 2, L(a));
    for (let x = 1; x < w - 1; x++) if (Math.floor((x - 1) / 4) % 2 === 0) c.set(x, 10, a); else c.set(x, 10, b);
    for (let x = 1; x < w - 1; x += 4) c.clear(x + 3, 10);
    c.rect(1, 22, w - 2, 24, C.woodLight); c.row(22, 1, w - 2, L(C.woodLight));
    vplanks(c, 2, 25, w - 3, h - 3, C.wood, 5); c.row(h - 3, 2, w - 3, C.woodDark);
    goods(c, 21);
  };
  const produce = (c, yb) => { for (const [x, col] of [[5, C.red], [9, X.orange], [13, C.leafLight], [18, X.yellow], [23, C.red], [27, C.leafLight]]) { c.rect(x, yb - 2, x + 2, yb, col); c.set(x, yb - 2, L(col)); c.set(x + 1, yb - 3, col); } };
  def('stall-small', 34, 38, (c) => stall(c, 34, C.wine, C.cream, produce), solid);
  const tent = (c, w, h, col, o = {}) => {
    const m = w / 2 - 0.5, yb = h - 2;
    c.poly([[1, yb], [m, 2], [w - 2, yb]], col);
    c.poly([[1, yb], [m, 2], [m, yb]], L(col));
    c.poly([[m - w * 0.14, yb], [m, yb - h * 0.55], [m + w * 0.14, yb]], C.night);
    c.line(m, 2, m + w * 0.14, yb, D(col)); c.line(m, 2, m - w * 0.14, yb, col);
    c.line(m - w * 0.25, yb, m - w * 0.14, yb - h * 0.35, D(L(col)));
    c.rect(Math.floor(m), 1, Math.ceil(m), 2, C.wood);
    if (o.patch) { c.rect(w - 12, yb - 7, w - 9, yb - 5, D(col)); }
  };
  def('tent-small', 40, 28, (c) => tent(c, 40, 28, X.canvas, { patch: true }), solid);
  const stones = (c, cx, yb, rx) => { for (const dx of [-rx, -rx + 4, rx - 6, rx - 2]) { c.rect(cx + dx, yb - 1, cx + dx + 2, yb, C.stone); c.row(yb - 1, cx + dx, cx + dx + 1, C.stoneLight); c.set(cx + dx + 2, yb, C.stoneDark); } };
  def('campfire-big', 26, 22, (c) => {
    flame(c, 12, 16, 15, 11); flame(c, 8, 16, 8, 5); flame(c, 17, 16, 9, 6);
    logs(c, 12, 19); stones(c, 12, 20, 11);
  }, noShade);
  def('campfire-out', 26, 20, (c) => {
    for (let i = 0; i < 12; i++) { const x = 12 + Math.round(Math.sin(i * 0.9) * 2); c.set(x, 13 - i, C.ash); if (i % 3 === 0) c.set(x + 1, 13 - i, C.stoneLight); }
    logs(c, 12, 17); c.rect(9, 15, 15, 16, C.black); pts(c, [[10, 15], [13, 14], [14, 16]], C.ash);
    stones(c, 12, 18, 11);
  });
  def('bedroll', 32, 10, (c) => {
    c.rect(4, 4, 30, 8, C.forest); c.row(4, 4, 30, L(C.forest)); c.row(8, 4, 30, D(C.forest));
    for (const x of [12, 20]) c.col(x, 4, 8, C.earth);
    c.oval(1, 2, 8, 8, C.cream); c.clearRect(0, 9, 31, 9); c.oval(3, 4, 6, 7, D(C.cream)); c.set(4, 5, C.forest);
    c.rect(24, 3, 30, 4, C.cream);
  });
  const portal = (c, on) => {
    arch(c, 1, 1, 28, 39, C.stone);
    arch(c, 5, 5, 24, 39, on ? X.purple : C.night);
    c.col(1, 14, 39, C.stoneLight);
    for (let i = 0; i < 9; i++) { const a = 3.14 + (i / 8) * 3.14, x = 14.5 + Math.cos(a) * 12, y = 15 + Math.sin(a) * 12; c.set(x, y, C.stoneDark); c.set(x + (x < 14 ? 1 : -1), y + 1, C.stoneDark); }
    for (const y of [20, 27, 34]) { c.row(y, 1, 4, C.stoneDark); c.row(y, 25, 28, C.stoneDark); }
    c.rect(13, 1, 16, 4, on ? X.violet : C.stoneDark); c.set(14, 2, on ? C.white : C.stone);
    c.rect(1, 38, 4, 39, C.stoneDark); c.rect(25, 38, 28, 39, C.stoneDark);
    if (on) {
      for (let i = 0; i < 70; i++) { const a = i * 0.45, r = 1 + i * 0.13, x = Math.round(14.5 + Math.cos(a) * r), y = Math.round(23 + Math.sin(a) * r * 1.5); if (x > 4 && x < 25 && y > 6 && y < 39) c.set(x, y, i % 4 ? X.violet : C.white); }
      c.rect(14, 22, 15, 24, C.white);
    } else { c.line(9, 12, 12, 20, DD(C.stone)); pts(c, [[7, 30], [20, 16], [18, 34]], hex('#221d2a')); }
  };
  def('portal-gate', 30, 42, (c) => portal(c, true), noShade);
  def('portal-gate-off', 30, 42, (c) => portal(c, false));
  def('scifi-crate', 18, 16, (c) => {
    c.box(1, 1, 16, 14, C.steel);
    c.rect(1, 6, 16, 8, C.iron); c.rect(3, 3, 5, 4, X.yellow); c.set(14, 3, X.phos);
    for (let x = 2; x < 16; x += 4) { c.set(x, 7, X.yellow); c.set(x + 1, 7, X.yellow); }
    c.frame(3, 10, 14, 12, C.slate); pts(c, [[2, 2], [15, 2], [2, 13], [15, 13]], C.ironDark);
  }, solid);
  def('console', 22, 26, (c) => {
    c.rect(2, 12, 19, 24, C.slate); c.col(2, 12, 24, L(C.slate)); c.row(24, 2, 19, C.ironDark);
    c.poly([[1, 12], [20, 12], [18, 9], [3, 9]], C.steel); c.row(9, 3, 18, L(C.steel));
    pts(c, [[5, 10], [7, 11], [9, 10], [13, 10]], C.red); pts(c, [[11, 11], [15, 10], [16, 11]], X.phos);
    c.rect(4, 1, 17, 8, C.iron); c.rect(5, 2, 16, 7, X.screen); scribble(c, 6, 3, 13, X.phos); scribble(c, 6, 5, 10, X.phos); c.row(1, 4, 17, C.steel);
    c.frame(5, 15, 16, 21, C.ironDark); c.rect(7, 17, 9, 17, X.phos);
  }, solid);
  def('generator', 28, 28, (c) => {
    c.box(1, 8, 26, 24, C.slate); c.rect(2, 25, 5, 26, C.ironDark); c.rect(22, 25, 25, 26, C.ironDark);
    disc(c, 9, 16, 5, C.ironDark); ring(c, 4, 11, 14, 21, C.steel, 1); disc(c, 9, 16, 2, hex('#5fb3c2')); c.set(9, 16, C.white);
    for (const y of [11, 14, 17, 20]) c.row(y, 17, 24, C.ironDark);
    c.rect(4, 3, 7, 7, C.iron); c.rect(3, 2, 8, 2, C.steel); c.rect(18, 4, 23, 7, C.iron); c.set(20, 5, X.phos); c.set(22, 5, C.red);
    c.line(8, 4, 17, 5, C.rust); c.rect(1, 8, 26, 8, C.steel);
    for (let x = 3; x < 26; x += 4) c.set(x, 23, X.yellow);
  }, solid);
  def('canister', 12, 18, (c) => {
    c.rect(2, 2, 9, 16, X.toxic); c.col(2, 2, 16, L(X.toxic)); c.col(8, 2, 16, D(X.toxic));
    c.rect(1, 2, 10, 3, C.iron); c.rect(1, 15, 10, 16, C.iron); c.rect(4, 1, 7, 1, C.steel);
    c.rect(3, 7, 8, 11, X.yellow); c.poly([[5.5, 8], [7, 10], [4, 10]], K);
  }, solid);
  def('urn', 14, 20, (c) => {
    const u = hex('#a07a4e');
    c.oval(1, 5, 12, 17, u); c.rect(4, 2, 9, 5, u); c.rect(3, 1, 10, 1, L(u)); c.rect(4, 17, 9, 18, D(u));
    c.col(3, 8, 14, L(u)); c.row(8, 2, 11, C.rust); c.row(10, 1, 12, C.rust); for (let x = 2; x < 12; x += 2) c.set(x, 9, C.woodDark);
    ring(c, 0, 5, 3, 9, u, 1); ring(c, 10, 5, 13, 9, D(u), 1); c.clearRect(0, 0, 0, 19); c.clearRect(13, 0, 13, 19);
  });
  const bench = (c, col) => {
    c.rect(2, 2, 3, 15, C.ironDark); c.rect(26, 2, 27, 15, C.ironDark);
    c.rect(1, 2, 28, 4, col); c.rect(1, 6, 28, 8, col); c.row(2, 1, 28, L(col)); c.row(6, 1, 28, L(col)); c.row(4, 1, 28, D(col)); c.row(8, 1, 28, D(col));
    c.rect(1, 10, 28, 11, col); c.row(10, 1, 28, L(col));
    c.rect(1, 15, 4, 15, C.ironDark); c.rect(25, 15, 28, 15, C.ironDark);
  };
  def('bench', 30, 17, (c) => bench(c, C.woodLight), solid);
  def('log-pile', 30, 19, (c) => {
    const end = (x, y) => { disc(c, x, y, 2, C.woodPale); c.rect(x - 1, y - 2, x + 1, y - 2, L(C.woodPale)); c.set(x, y, C.wood); c.set(x + 1, y + 1, C.woodLight); };
    c.rect(2, 12, 27, 17, C.woodDark); c.rect(5, 7, 24, 12, C.woodDark); c.rect(8, 2, 21, 7, C.woodDark);
    for (let i = 0; i < 5; i++) end(4 + i * 5.5, 14.5);
    for (let i = 0; i < 4; i++) end(7 + i * 5.5, 9.5);
    for (let i = 0; i < 3; i++) end(9.5 + i * 5.5, 4.5);
  }, solid);
  def('banner-stand', 16, 42, (c) => {
    pole(c, 7, 2, 38, C.wood); disc(c, 7, 1.5, 1, C.gold);
    c.rect(2, 4, 13, 5, C.wood);
    c.rect(3, 6, 12, 22, C.wine); c.poly([[3, 22], [7.5, 22], [3, 26]], C.wine); c.poly([[7.5, 22], [12, 22], [12, 26]], C.wine);
    c.col(3, 6, 25, L(C.wine)); c.rect(6, 10, 9, 15, C.gold); c.rect(7, 12, 8, 13, C.wine); c.row(20, 3, 12, C.gold);
    c.rect(3, 38, 12, 40, C.stoneDark); c.row(38, 4, 11, C.stone);
  }, solid);


  /* ================= barriers =================
   * A run of fence goes left-right ("h") or into the picture ("v": a far post and a near post). On the corner
   * pieces the far row stands on row 12 and the near row on row 18. */
  const mirrored = (fn) => (c) => { fn(c); const t = canvas(c.w, c.h); t.stamp(c, 0, 0, true); t.px.forEach((p, i) => (c.px[i] = p)); };
  const FAR = 12, NEAR = 18;
  const wpost = (c, x, yb, col = C.woodLight) => { c.rect(x, yb - 10, x + 2, yb, col); c.set(x + 1, yb - 11, col); c.col(x, yb - 10, yb, L(col)); c.col(x + 2, yb - 10, yb, C.wood); };
  const wrails = (c, x0, x1, yb, col = C.woodLight) => { for (const y of [yb - 8, yb - 4]) { c.rect(x0, y, x1, y + 1, col); c.row(y + 1, x0, x1, C.wood); } };
  const wside = (c, x) => { wpost(c, x, FAR, C.wood); c.col(x + 1, FAR - 8, NEAR - 8, C.woodDark); wpost(c, x, NEAR); };
  def('fence-h', 18, 14, (c) => { wrails(c, 1, 16, 12); wpost(c, 3, 12); wpost(c, 11, 12); }, solid);
  def('fence-v', 7, 20, (c) => wside(c, 2), solid);
  const wcornerT = (c) => { wrails(c, 3, 16, FAR); wpost(c, 11, FAR); wside(c, 2); };
  const wcornerB = (c) => { wpost(c, 2, FAR, C.wood); wrails(c, 3, 16, NEAR); wpost(c, 11, NEAR); wpost(c, 2, NEAR); };
  def('fence-corner-tl', 18, 20, wcornerT, solid);
  def('fence-corner-tr', 18, 20, mirrored(wcornerT), solid);
  def('fence-corner-bl', 18, 20, wcornerB, solid);
  def('fence-corner-br', 18, 20, mirrored(wcornerB), solid);
  def('fence-post', 7, 14, (c) => wpost(c, 2, 12), solid);
  def('fence-cross', 18, 20, (c) => { wpost(c, 8, FAR, C.wood); wrails(c, 1, 16, 15); wpost(c, 8, NEAR); }, solid);
  const gateLeaf = (c, x0, x1, yb) => {
    c.rect(x0, yb - 9, x1, yb - 8, C.woodPale); c.rect(x0, yb - 3, x1, yb - 2, C.woodPale); c.row(yb - 8, x0, x1, C.wood); c.row(yb - 2, x0, x1, C.wood);
    for (let x = x0; x <= x1; x += 3) c.col(x, yb - 10, yb - 1, C.woodPale);
    c.line(x0, yb - 3, x1, yb - 8, C.wood);
  };
  def('fence-gate', 22, 16, (c) => { gateLeaf(c, 4, 17, 14); wpost(c, 1, 14); wpost(c, 18, 14); c.rect(15, 8, 17, 8, C.iron); pts(c, [[4, 5], [4, 11]], C.iron); c.rect(1, 2, 3, 2, C.wood); c.rect(18, 2, 20, 2, C.wood); }, solid);
  def('fence-gate-open', 22, 19, (c) => {
    wpost(c, 1, 14); wpost(c, 18, 14);
    c.poly([[4, 4], [8, 6], [8, 17], [4, 13]], C.woodPale);
    c.line(4, 5, 8, 7, C.wood); c.line(4, 11, 8, 15, C.wood); c.col(6, 6, 14, C.wood); c.col(8, 6, 17, C.wood);
    pts(c, [[4, 6], [4, 11]], C.iron);
  });
  def('fence-broken', 20, 14, (c) => {
    wpost(c, 2, 12);
    c.rect(5, 4, 9, 5, C.woodLight); c.row(5, 5, 9, C.wood); c.set(10, 4, C.woodLight);
    c.line(5, 8, 13, 11, C.woodLight); c.line(5, 9, 12, 12, C.wood);
    c.line(14, 12, 18, 4, C.woodLight); c.line(15, 12, 18, 5, C.wood); c.line(13, 12, 17, 4, L(C.woodLight));
    pts(c, [[9, 12], [11, 12]], C.wood);
  }, solid);
  const ipost = (c, x, yb) => { c.rect(x, yb - 20, x + 1, yb, C.ironDark); c.col(x, yb - 20, yb, C.iron); c.rect(x, yb - 23, x + 1, yb - 22, C.iron); c.set(x, yb - 21, C.ironDark); c.rect(x - 1, yb, x + 2, yb, C.ironDark); };
  const ibars = (c, x0, x1, yb, o = {}) => {
    for (let x = x0 + 1; x <= x1; x += 3) { c.col(x, yb - 19, yb, C.iron); c.set(x, yb - 20, C.steel); c.set(x, yb - 21, C.steel); }
    c.row(yb - 17, x0, x1, C.ironDark); c.row(yb - 3, x0, x1, C.ironDark);
    if (!o.plain) for (let x = x0 + 1; x <= x1; x += 3) c.set(x, yb - 15, C.steel);
  };
  const iside = (c, x) => { ipost(c, x, 24); c.col(x, 5, 9, C.ironDark); ipost(c, x, 30); };
  def('iron-fence-h', 18, 24, (c) => ibars(c, 1, 16, 22), solid);
  def('iron-fence-v', 6, 32, (c) => iside(c, 2), solid);
  const icornerT = (c) => { ibars(c, 3, 16, 24); iside(c, 2); };
  const icornerB = (c) => { ipost(c, 2, 24); ibars(c, 3, 16, 30); ipost(c, 2, 30); };
  def('iron-fence-corner-tl', 18, 32, icornerT, solid);
  def('iron-fence-corner-tr', 18, 32, mirrored(icornerT), solid);
  def('iron-fence-corner-bl', 18, 32, icornerB, solid);
  def('iron-fence-corner-br', 18, 32, mirrored(icornerB), solid);
  def('iron-gate', 30, 36, (c) => {
    for (let x = 5; x <= 24; x++) {
      if ((x - 5) % 3 && x !== 14 && x !== 15) continue;
      const top = 6 + Math.round(Math.abs(x - 14.5) * 0.5);
      c.col(x, top, 33, C.iron); c.set(x, top - 1, C.steel);
    }
    for (let x = 4; x <= 25; x++) { c.set(x, 9 + Math.round(Math.abs(x - 14.5) * 0.5), C.ironDark); }
    c.row(21, 4, 25, C.ironDark); c.row(31, 4, 25, C.ironDark);
    c.rect(14, 4, 15, 33, C.ironDark); c.rect(13, 19, 16, 23, C.steel); c.set(14, 21, K);
    for (const x of [2, 26]) { c.rect(x, 5, x + 1, 34, C.ironDark); c.col(x, 5, 34, C.iron); disc(c, x + 0.5, 3, 1.5, C.iron); c.rect(x - 1, 34, x + 2, 34, C.ironDark); }
  }, solid);
  const wallFace = (c, x0, x1, yb) => { bricks(c, x0, yb - 8, x1, yb, C.stone, 6, 3); c.row(yb, x0, x1, C.stoneDark); };
  const wallCap = (c, x0, y0, x1, y1) => { c.rect(x0, y0, x1, y1, C.stoneLight); c.row(y0, x0, x1, L(C.stoneLight)); for (let x = x0 + 4; x < x1; x += 6) c.set(x, y1, C.stone); };
  const wallH = (c, x0, x1, yb) => { wallFace(c, x0, x1, yb); wallCap(c, x0, yb - 11, x1, yb - 9); };
  const wallV = (c, x0, x1) => { wallFace(c, x0, x1, NEAR); wallCap(c, x0, FAR - 11, x1, NEAR - 9); for (let y = FAR - 8; y < NEAR - 9; y += 3) c.row(y, x0 + 1, x1 - 1, C.stone); };
  def('stone-wall-h', 18, 14, (c) => { wallH(c, 1, 16, 12); pts(c, [[4, 11], [12, 12], [13, 11]], C.moss); }, solid);
  def('stone-wall-v', 10, 20, (c) => wallV(c, 1, 8), solid);
  const scornerT = (c) => { wallH(c, 1, 16, FAR); wallV(c, 1, 8); wallCap(c, 1, FAR - 11, 16, FAR - 9); c.rect(1, FAR - 8, 8, NEAR - 9, C.stoneLight); for (let y = FAR - 6; y < NEAR - 9; y += 3) c.row(y, 2, 7, C.stone); };
  const scornerB = (c) => { wallCap(c, 1, FAR - 11, 8, NEAR - 9); for (let y = FAR - 8; y < NEAR - 11; y += 3) c.row(y, 2, 7, C.stone); wallH(c, 1, 16, NEAR); };
  def('stone-wall-corner-tl', 18, 20, scornerT, solid);
  def('stone-wall-corner-tr', 18, 20, mirrored(scornerT), solid);
  def('stone-wall-corner-bl', 18, 20, scornerB, solid);
  def('stone-wall-corner-br', 18, 20, mirrored(scornerB), solid);
  /** A clipped hedge: the top `top` rows are its lit upper face. */
  const hedge = (c, x0, y0, x1, y1, top, seed = 1) => {
    lump(c, (t) => { t.rect(x0, y0, x1, y1, C.leaf); for (const [x, y] of [[x0, y0], [x1, y0]]) t.clear(x, y); }, C.leaf, { seed, noise: 1.3, grain: 2 });
    for (let y = y0; y < y0 + top; y++) for (let x = x0; x <= x1; x++) if (c.get(x, y)) c.set(x, y, (x * 3 + y * 5 + seed) % 4 ? C.leafLight : L(C.leafLight));
    for (let x = x0; x <= x1; x++) if ((x + seed) % 3) c.set(x, y0 + top, D(C.leaf));
    c.row(y1, x0, x1, DD(C.leaf));
  };
  def('hedge-h', 18, 18, (c) => hedge(c, 1, 1, 16, 16, 3, 1), solid);
  def('hedge-v', 12, 24, (c) => hedge(c, 1, 1, 10, 22, 9, 2), solid);
  def('hedge-block', 18, 22, (c) => hedge(c, 1, 1, 16, 20, 7, 3), solid);
  def('hedge-round', 18, 26, (c) => {
    c.rect(8, 16, 9, 22, C.woodDark); c.rect(5, 22, 12, 24, CLAY); c.row(22, 4, 13, L(CLAY)); c.clear(5, 24); c.clear(12, 24);
    leaves(c, 8.5, 9, 6, 6, C.leaf, 12);
  }, solid);
  const rpost = (c, x, yb, col = C.wood) => { c.rect(x, yb - 12, x + 1, yb, col); c.col(x, yb - 12, yb, L(col)); c.rect(x, yb - 13, x + 1, yb - 13, C.woodDark); };
  const sag = (c, x0, x1, y, drop, col) => { for (let x = x0; x <= x1; x++) { const t = (x - x0) / (x1 - x0 || 1); c.set(x, y + Math.round(4 * drop * t * (1 - t)), col); } };
  def('bridge-rail-h', 18, 17, (c) => { sag(c, 1, 16, 4, 2, C.straw); sag(c, 1, 16, 9, 2, D(C.straw)); rpost(c, 1, 15); rpost(c, 15, 15); c.row(5, 1, 2, C.straw); c.row(5, 15, 16, C.straw); }, solid);
  def('bridge-rail-v', 6, 23, (c) => { rpost(c, 2, 15, C.woodDark); c.col(2, 4, 10, C.straw); rpost(c, 2, 21); c.row(11, 2, 3, C.straw); }, solid);
  def('barricade', 32, 22, (c) => {
    c.rect(2, 13, 29, 15, C.wood); c.row(13, 2, 29, C.woodLight); c.row(15, 2, 29, C.woodDark);
    for (const x of [5, 13, 21]) {
      for (const d of [1, -1]) { const bx = x + (d > 0 ? 0 : 6); c.line(bx, 20, bx + d * 7, 2, C.woodLight); c.line(bx + 1, 20, bx + d * 7 + 1, 2, C.wood); c.set(bx + d * 7, 1, C.woodPale); }
      c.set(x + 3, 13, C.iron); c.set(x + 4, 12, C.straw);
    }
  }, solid);
  def('rope-barrier', 30, 20, (c) => {
    for (const x of [3, 25]) { c.rect(x, 3, x + 1, 16, C.brass); c.col(x, 3, 16, C.gold); disc(c, x + 0.5, 2, 1.5, C.gold); c.rect(x - 2, 17, x + 3, 18, C.brass); c.row(17, x - 1, x + 2, C.gold); }
    for (let x = 5; x <= 24; x++) { const t = (x - 5) / 19, y = 5 + Math.round(16 * t * (1 - t)); c.set(x, y, L(C.wine)); c.set(x, y + 1, C.wine); }
  }, solid);
  const laser = (c, on) => {
    for (const x of [1, 19]) { c.rect(x, 2, x + 3, 32, C.steel); c.col(x, 2, 32, L(C.steel)); c.col(x + 3, 2, 32, C.iron); c.rect(x, 1, x + 3, 2, C.iron); c.rect(x - 0, 31, x + 3, 33, C.ironDark); c.rect(x + 1, 4, x + 2, 5, on ? C.red : C.ironDark); }
    for (let y = 9; y <= 27; y += 6) {
      c.rect(4, y - 1, 4, y + 1, C.ironDark); c.rect(18, y - 1, 18, y + 1, C.ironDark);
      if (on) { c.row(y, 5, 17, X.laser); c.row(y, 9, 13, hex('#f0a090')); } else { c.set(4, y, C.blood); c.set(18, y, C.blood); }
    }
  };
  def('laser-gate', 24, 35, (c) => laser(c, true), { solid: true, shade: false });
  def('laser-gate-off', 24, 35, (c) => laser(c, false));

  return S;
};
