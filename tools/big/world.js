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
    ring(c, 1, 1, 22, 22, C.stoneLight, 1);
    c.clearRect(1, 12, 22, 12); c.rect(1, 12, 3, 12, C.stone); c.rect(20, 12, 22, 12, C.stone);
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

  return S;
};
