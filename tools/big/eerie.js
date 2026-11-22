/* Eerie things, the graveyard, the occult, the yard and the household at paper-doll scale (see kit.js). */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd, canvas }) => {
  const S = {};
  const def = (slug, w, h, draw, o = {}) => {
    S[slug] = { w, h, draw, ...o };
  };
  const solid = { solid: true },
    flat = { shade: false, outline: false },
    soft = { shade: false };

  /* ---------- colours ---------- */
  const deadwood = blend(C.woodDark, C.stoneDark, 0.45),
    bloodDark = dark(C.blood),
    enamel = hex('#b9b7a6'),
    copper = hex('#a0603a'),
    sepia = hex('#8e7450'),
    sepiaDark = hex('#5c4630'),
    poison = hex('#6f8a3c'),
    amber = hex('#7a4a22'),
    mud = hex('#4a3a2a'),
    cloth = hex('#3a3442');
  /* one letter per colour, for the small pictures drawn as text */
  const P = {
    s: C.stone, d: C.stoneDark, l: C.stoneLight, m: C.moss, M: C.leafLight, H: C.leaf,
    k: C.black, K, n: C.night, b: C.bone, B: dark(C.bone), w: C.white, W: dark(C.white),
    r: C.blood, R: C.red, D: bloodDark, i: C.iron, I: C.ironDark, t: C.steel, T: lite(C.steel),
    o: C.wood, O: C.woodDark, p: C.woodLight, q: C.woodPale, g: C.gold, G: C.brass,
    f: C.flame, F: C.flameLight, e: C.earth, E: dark(C.earth), y: C.straw, Y: dark(C.straw),
    c: C.cream, C: dark(C.cream), a: C.ash, A: dark(C.ash), u: C.rust, U: dark(C.rust), h: C.ghost,
    x: C.flesh, X: dark(C.flesh), z: C.rot, Z: dark(C.rot), v: C.wine, V: dark(C.wine),
    j: C.glass, J: C.glassLight, P: C.parchment, Q: dark(C.parchment), N: C.navy, S: C.slate,
    L: C.glow, 1: enamel, 2: copper, 3: sepia, 4: sepiaDark, 5: poison, 6: amber, 7: C.plum, 8: C.teal, 9: cloth,
  };
  /** Draw a small picture from rows of letters ('.' is empty). */
  const pat = (c, x, y, rows, m = P) =>
    rows.forEach((r, j) =>
      [...r].forEach((ch, i) => {
        if (ch !== '.' && ch !== ' ' && m[ch]) c.set(x + i, y + j, m[ch]);
      }),
    );
  /** Lighten the left-most pixel of every row of what is drawn in the box (light from the left). */
  const lit = (c, x0, y0, x1, y1, k = 1.2) => {
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++)
        if (c.get(x, y)) {
          c.set(x, y, mix(c.get(x, y), k));
          break;
        }
  };
  const litTop = (c, x0, y0, x1, y1, k = 1.2) => {
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++)
        if (c.get(x, y)) {
          c.set(x, y, mix(c.get(x, y), k));
          break;
        }
  };
  /** Keep the outer pixel free for the outline. */
  const trim = (c) => {
    for (let x = 0; x < c.w; x++) (c.clear(x, 0), c.clear(x, c.h - 1));
    for (let y = 0; y < c.h; y++) (c.clear(0, y), c.clear(c.w - 1, y));
  };
  /** The edge of an ellipse. */
  const ell = (c, cx, cy, rx, ry, col, a0 = 0, a1 = Math.PI * 2) => {
    const n = Math.ceil((rx + ry) * 4);
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      c.set(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, col);
    }
  };
  const thick = (c, x0, y0, x1, y1, th, col) => {
    for (let t = 0; t < th; t++) {
      const o = t - Math.floor((th - 1) / 2);
      if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) c.line(x0, y0 + o, x1, y1 + o, col);
      else c.line(x0 + o, y0, x1 + o, y1, col);
    }
  };

  /* ---------- small parts shared by many sprites ---------- */
  const flame = (c, x, y, col = C.flame, tip = C.flameLight) => {
    c.set(x, y, col);
    c.set(x, y - 1, tip);
  };
  /** A candle w wide standing on yb, h tall; the flame sits above it. */
  const candle = (c, x, yb, h, col = C.bone, lit_ = true, w = 1, fcol) => {
    c.rect(x, yb - h + 1, x + w - 1, yb, col);
    if (w > 1) c.col(x + w - 1, yb - h + 1, yb, dark(col));
    if (lit_) {
      if (fcol) flame(c, x, yb - h, fcol, lite(fcol));
      else flame(c, x, yb - h);
    } else c.set(x, yb - h, C.black);
  };
  const SKULL = ['.bbbbb.', 'bbbbbbb', 'bKKbKKb', 'bKKbKKb', 'bbbKbbb', '.bbbbb.', '.bBbBb.'];
  const SKULL_S = ['.bbb.', 'bbbbb', 'bKbKb', 'bbbbb', '.bBb.'];
  const skull = (c, x, y, small = false, m = P) => pat(c, x, y, small ? SKULL_S : SKULL, m);
  const stoneMap = { ...P, b: C.stone, B: C.stoneDark, K: C.stoneDark };
  const bone = (c, x0, y0, x1, y1, col = C.bone) => {
    c.line(x0, y0, x1, y1, col);
    c.set(x0, y0 - 1, col);
    c.set(x1, y1 + (y1 > y0 ? 1 : -1) * 0 + 1, col);
  };
  const chain = (c, x, y0, y1, a = C.steel, b = C.iron) => {
    for (let y = y0; y <= y1; y++) c.set(x, y, (y - y0) % 2 ? b : a);
  };
  const rope = (c, x0, y0, x1, y1) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    for (let i = 0; i <= n; i++) c.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, i % 3 === 2 ? dark(C.straw) : C.straw);
  };
  const noose = (c, x, y) => {
    c.col(x, y, y + 1, dark(C.straw));
    pat(c, x - 1, y + 2, ['.y.', 'y.y', 'y.y', '.y.']);
  };
  const wheel = (c, cx, cy, r, col = C.woodDark, hub = C.iron) => {
    ell(c, cx, cy, r, r, col);
    ell(c, cx, cy, r - 0.6, r - 0.6, col);
    for (let k = 0; k < 4; k++) {
      const a = (k * Math.PI) / 4 + 0.3;
      c.line(cx - Math.cos(a) * (r - 1), cy - Math.sin(a) * (r - 1), cx + Math.cos(a) * (r - 1), cy + Math.sin(a) * (r - 1), lite(col));
    }
    c.rect(Math.round(cx) - 0, Math.round(cy) - 0, Math.round(cx), Math.round(cy), hub);
  };
  /** A block of stone, wood ... with a light top and left. */
  const block = (c, x0, y0, x1, y1, col = C.stone) => {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, lite(col));
    c.col(x0, y0, y1, lite(col));
  };
  const planks = (c, x0, y0, x1, y1, col = C.wood, step = 4, horiz = false) => {
    c.rect(x0, y0, x1, y1, col);
    if (horiz) for (let y = y0 + step - 1; y < y1; y += step) c.row(y, x0, x1, dark(col));
    else for (let x = x0 + step - 1; x < x1; x += step) c.col(x, y0, y1, dark(col));
  };
  const moss = (c, x0, y0, x1, y1, every = 3, seed = 3) => c.speckle(x0, y0, x1, y1, C.moss, every, seed);
  /** A puddle seen from the side of the stage: a flat ellipse with a lighter glint. */
  const puddle = (c, x0, y0, x1, y1, col, glint = true) => {
    c.oval(x0, y0, x1, y1, col);
    if (glint) c.row(y0 + 1, x0 + 3, x0 + Math.max(4, ((x1 - x0) >> 2) + 2), lite(col));
  };
  /** A headstone: body x0..x1, y0..y1 with the given top. */
  const head = (c, x0, y0, x1, y1, top = 'round', col = C.stone) => {
    const w = x1 - x0 + 1,
      r = w >> 1;
    if (top === 'round') {
      c.oval(x0, y0, x1, y0 + w - 1, col);
      c.rect(x0, y0 + r, x1, y1, col);
    } else if (top === 'point') {
      for (let i = 0; i <= r; i++) c.row(y0 + i, x0 + r - i - (w % 2 ? 0 : 1) + (i ? 0 : 0), x1 - r + i + (w % 2 ? 0 : 1), col);
      c.rect(x0, y0 + r, x1, y1, col);
    } else if (top === 'shoulder') {
      c.rect(x0, y0 + 3, x1, y1, col);
      c.oval(x0 + 2, y0, x1 - 2, y0 + w - 5, col);
    } else c.rect(x0, y0, x1, y1, col);
    lit(c, x0, y0, x1, y1);
    litTop(c, x0 + 1, y0, x1 - 1, y0 + r);
  };
  const lines = (c, x0, x1, y, n, col = C.stoneDark) => {
    for (let i = 0; i < n; i++) c.row(y + i * 2, x0 + (i % 2), x1 - (i % 3 === 1 ? 1 : 0), col);
  };
  const grass = (c, x0, x1, y, seed = 1) => {
    const r = rnd(seed);
    for (let x = x0; x <= x1; x++) if (r() < 0.45) c.set(x, y - (r() < 0.3 ? 1 : 0), r() < 0.5 ? C.moss : C.leaf);
  };
  /** A bare branch that forks; a = angle (0 right, PI/2 up). */
  const limb = (c, x, y, a, len, th, r, col, depth = 0) => {
    const x1 = x + Math.cos(a) * len,
      y1 = y - Math.sin(a) * len;
    thick(c, x, y, x1, y1, Math.max(1, Math.round(th)), col);
    if (len < 4 || depth > 5) return;
    const k = 0.62 + r() * 0.14;
    limb(c, x1, y1, a + 0.45 + r() * 0.5, len * k, th * 0.6, r, col, depth + 1);
    limb(c, x1, y1, a - 0.4 - r() * 0.5, len * k, th * 0.6, r, col, depth + 1);
    if (r() < 0.5) limb(c, x + (x1 - x) * 0.5, y + (y1 - y) * 0.5, a + (r() < 0.5 ? 1 : -1) * 0.9, len * 0.5, 1, r, col, depth + 2);
  };
  const CROW = ['...kkk...', '..kkSkGG.', '.kkkkk...', 'kkkSkk...', 'kkSkkk...', '.kkkk....', '..I.I....'];
  const crow = (c, x, y, flip = false) => pat(c, x, y, flip ? CROW.map((r) => [...r].reverse().join('')) : CROW);

  /* ================= GRAVEYARD & RUINS ================= */
  def('grave-round', 12, 17, (c) => {
    head(c, 1, 1, 10, 15);
    pat(c, 4, 3, ['.d.', 'ddd', '.d.', '.d.']);
    lines(c, 3, 8, 9, 2);
    moss(c, 1, 12, 10, 15, 4);
    grass(c, 1, 10, 15, 2);
  }, solid);
  def('grave-celtic', 12, 22, (c) => {
    pat(c, 1, 1, ['....ls....', '....ls....', '..dlssdd..', '.d..ls..d.', 'llllssssss', 'ssssssssss', '.d..ls..d.', '..ddlsdd..']);
    c.rect(5, 9, 6, 16, C.stone);
    c.col(5, 9, 16, C.stoneLight);
    c.set(6, 11, C.stoneDark);
    c.set(6, 13, C.stoneDark);
    block(c, 3, 16, 8, 17);
    block(c, 2, 18, 9, 20);
    moss(c, 2, 17, 9, 20, 3);
  }, solid);
  def('grave-obelisk', 11, 30, (c) => {
    c.rect(4, 1, 5, 3, C.stone);
    c.rect(3, 4, 6, 20, C.stone);
    c.row(2, 4, 5, C.stone);
    c.col(3, 4, 20, C.stoneLight);
    c.set(4, 1, C.stoneLight);
    c.col(4, 2, 3, C.stoneLight);
    lines(c, 4, 5, 8, 4);
    block(c, 2, 21, 7, 23);
    block(c, 1, 24, 9, 28);
    c.clear(8, 21);
    lines(c, 3, 7, 25, 2);
    moss(c, 1, 25, 9, 28, 4);
  }, solid);
  def('grave-broken', 20, 13, (c) => {
    c.poly([[2, 11], [2, 5], [4, 7], [6, 4], [8, 7], [10, 5], [10, 11]], C.stone);
    lit(c, 2, 4, 10, 11);
    c.line(6, 6, 7, 10, C.stoneDark);
    lines(c, 4, 8, 9, 1);
    c.oval(12, 7, 18, 11, C.stone); // the top, fallen
    c.rect(12, 9, 17, 11, C.stone);
    c.line(12, 9, 17, 9, C.stoneLight);
    pat(c, 14, 8, ['.d.', 'ddd', '.d.']);
    grass(c, 1, 18, 11, 5);
  }, solid);
  def('grave-child', 10, 13, (c) => {
    head(c, 2, 4, 7, 11);
    pat(c, 2, 2, ['..ll..', 'llllsl', 'l.ll.s'], { l: C.stoneLight, s: C.stone }); // the lamb
    c.row(8, 4, 5, C.stoneDark);
    grass(c, 1, 8, 11, 4);
  }, solid);
  def('grave-skull', 13, 19, (c) => {
    head(c, 1, 1, 11, 17, 'shoulder');
    skull(c, 3, 3, false, { ...stoneMap, b: C.stoneLight });
    pat(c, 3, 11, ['d.....d', '.dd.dd.', '...d...', '.dd.dd.', 'd.....d']);
    grass(c, 1, 11, 17, 8);
  }, solid);
  def('grave-wooden', 10, 16, (c) => {
    c.rect(4, 2, 5, 14, C.wood);
    c.col(4, 2, 14, C.woodLight);
    c.rect(1, 3, 8, 7, C.woodLight);
    c.row(3, 1, 8, C.woodPale);
    c.row(7, 1, 8, C.wood);
    c.row(5, 2, 6, C.woodDark);
    c.set(7, 4, C.iron);
    c.set(2, 6, C.woodDark);
    grass(c, 2, 7, 14, 6);
  }, solid);
  def('grave-mossy', 12, 17, (c) => {
    head(c, 1, 1, 10, 15);
    lines(c, 3, 8, 7, 2);
    for (let y = 1; y <= 5; y++) for (let x = 1; x <= 10; x++) if (c.get(x, y) && (y < 3 || (x + y) % 2)) c.set(x, y, y < 2 ? C.leafLight : C.moss);
    c.line(2, 15, 8, 6, C.leaf);
    c.line(9, 15, 7, 10, C.leaf);
    pat(c, 3, 8, ['...M', '.M..', '....', 'M.M.', '....', '.M..']);
    moss(c, 1, 11, 10, 15, 2);
  }, solid);
  def('grave-double', 22, 16, (c) => {
    head(c, 1, 1, 10, 14);
    head(c, 11, 1, 20, 14);
    c.col(10, 6, 14, C.stoneDark);
    pat(c, 4, 4, ['.d.', 'ddd', '.d.']);
    pat(c, 14, 4, ['.d.', 'ddd', '.d.']);
    lines(c, 3, 8, 8, 2);
    lines(c, 13, 18, 8, 2);
    moss(c, 1, 12, 20, 14, 4);
    grass(c, 1, 20, 14, 9);
  }, solid);
  def('grave-urn-top', 12, 26, (c) => {
    pat(c, 3, 1, ['..ls..', '.lsss.', 'lsssss', 'lsssss', '.lssd.', '..sd..', '.lsss.']);
    c.col(8, 3, 11, C.stoneLight); // the drape
    c.col(7, 3, 6, C.stoneLight);
    block(c, 1, 8, 10, 9);
    block(c, 2, 10, 9, 21);
    c.frame(4, 12, 7, 18, C.stoneDark);
    block(c, 1, 22, 10, 24);
    moss(c, 1, 20, 10, 24, 4);
  }, solid);
  def('grave-gothic', 12, 20, (c) => {
    head(c, 1, 1, 10, 18, 'point');
    pat(c, 4, 6, ['.dd.', '.dd.', 'd..d', 'dd.dd'.slice(0, 4)]);
    lines(c, 3, 8, 12, 2);
    moss(c, 1, 15, 10, 18, 4);
    grass(c, 1, 10, 18, 3);
  }, solid);
  def('grave-sunken', 17, 12, (c) => {
    c.poly([[4, 10], [6, 3], [8, 1], [11, 1], [13, 3], [13, 5], [11, 10]], C.stone);
    lit(c, 3, 1, 14, 9);
    c.line(8, 4, 10, 4, C.stoneDark);
    c.line(8, 6, 10, 6, C.stoneDark);
    c.row(10, 1, 15, C.earth);
    c.row(9, 2, 13, C.earth);
    c.row(8, 3, 6, C.earth);
    grass(c, 1, 15, 9, 4);
    moss(c, 4, 1, 13, 8, 5);
  }, solid);
  def('grave-iron-cross', 11, 21, (c) => {
    c.col(5, 2, 17, C.iron);
    c.row(7, 2, 8, C.iron);
    pat(c, 3, 5, ['.u.u.', 'u...u', '.....', 'u...u', '.u.u.']);
    pat(c, 4, 1, ['.I.', 'I.I']);
    c.set(1, 7, C.ironDark);
    c.set(9, 7, C.ironDark);
    c.col(1, 6, 8, C.iron);
    c.col(9, 6, 8, C.iron);
    c.speckle(1, 1, 9, 17, C.rust, 3, 4);
    block(c, 3, 17, 7, 19);
    grass(c, 2, 8, 19, 2);
  }, solid);
  const chest = (c, x0, y0, x1, y1) => {
    block(c, x0, y0, x1, y0 + 2, C.stoneLight);
    c.row(y0 + 2, x0, x1, C.stone);
    block(c, x0 + 1, y0 + 3, x1 - 1, y1 - 2);
    const n = 3,
      pw = Math.floor((x1 - x0 - 3) / n);
    for (let i = 0; i < n; i++) c.frame(x0 + 3 + i * pw, y0 + 5, x0 + pw + i * pw, y1 - 4, C.stoneDark);
    block(c, x0, y1 - 1, x1, y1);
    moss(c, x0, y1 - 3, x1, y1, 4);
  };
  def('tomb-chest', 32, 15, (c) => {
    chest(c, 1, 1, 30, 13);
    c.line(20, 1, 22, 4, C.stoneDark);
  }, solid);
  def('tomb-effigy', 34, 21, (c) => {
    chest(c, 1, 7, 32, 19);
    block(c, 3, 5, 9, 6, C.stoneLight); // pillow
    c.oval(4, 2, 8, 5, C.stoneLight); // head
    c.set(7, 3, C.stoneDark);
    c.rect(9, 4, 28, 6, C.stone); // body
    c.row(4, 9, 28, C.stoneLight);
    c.rect(13, 2, 15, 3, C.stoneLight); // praying hands
    c.rect(11, 3, 17, 4, C.stone);
    c.rect(28, 2, 29, 6, C.stone); // feet
    c.col(28, 2, 6, C.stoneLight);
    c.row(5, 14, 26, C.stoneDark); // sword
    c.col(17, 4, 6, C.stoneDark);
  }, solid);
  def('tomb-cracked', 34, 17, (c) => {
    chest(c, 1, 3, 32, 15);
    c.rect(1, 3, 32, 5, null);
    c.clearRect(1, 3, 32, 5);
    c.rect(2, 5, 12, 5, C.night); // dark inside
    c.poly([[9, 4], [31, 1], [32, 3], [10, 6]], C.stoneLight); // the lid, shifted
    c.line(10, 6, 32, 3, C.stone);
    c.row(5, 2, 9, C.night);
    c.row(6, 2, 31, C.stone);
    c.row(5, 2, 8, C.night);
    pat(c, 13, 7, ['K....', '.K...', '.KK..', '...K.', '..K..', '..K..', '.K...'], { K: C.night });
    pat(c, 22, 3, ['d', '.d', 'd']);
  }, solid);
  const mausoleum = (c, open) => {
    c.poly([[1, 12], [14, 2], [15, 2], [28, 12]], C.stone); // pediment
    c.line(1, 12, 14, 2, C.stoneLight);
    c.poly([[6, 11], [14, 5], [15, 5], [23, 11]], C.stoneDark);
    pat(c, 13, 6, ['.l.', 'lll', '.l.', '.l.']);
    block(c, 1, 12, 28, 14, C.stoneLight);
    c.rect(3, 15, 26, 38, C.stoneDark); // wall
    for (const x of [3, 23]) {
      c.rect(x, 15, x + 3, 38, C.stone); // columns
      c.col(x, 15, 38, C.stoneLight);
      c.col(x + 2, 16, 37, C.stoneDark);
      c.row(15, x, x + 3, C.stoneLight);
      c.row(38, x, x + 3, C.stoneLight);
    }
    c.rect(9, 19, 20, 38, C.stone); // door frame
    c.row(18, 10, 19, C.stone);
    if (!open) {
      c.rect(10, 20, 19, 38, C.ironDark);
      c.col(10, 20, 38, C.iron);
      c.col(14, 20, 38, K);
      c.frame(11, 22, 13, 28, C.iron);
      c.frame(16, 22, 18, 28, C.iron);
      c.frame(11, 31, 13, 36, C.iron);
      c.frame(16, 31, 18, 36, C.iron);
      c.set(13, 30, C.brass);
      c.set(16, 30, C.brass);
      c.speckle(10, 20, 19, 38, dark(C.rust), 12, 2);
    } else {
      c.rect(10, 20, 19, 38, C.night);
      for (let i = 0; i < 4; i++) c.row(38 - i * 2, 12 + i, 19, mix(C.stoneDark, 0.9 - i * 0.18)); // steps down
      for (let i = 0; i < 4; i++) c.row(37 - i * 2, 12 + i, 19, mix(C.stoneDark, 0.6 - i * 0.12));
      c.rect(10, 20, 11, 38, C.iron); // the door, swung in
      c.col(10, 20, 38, lite(C.iron));
      c.set(11, 30, C.brass);
    }
    block(c, 2, 39, 27, 40);
    block(c, 1, 41, 28, 42, C.stoneLight);
    moss(c, 1, 34, 28, 42, 5);
    c.speckle(1, 3, 28, 30, C.stoneDark, 14, 5);
  };
  def('mausoleum-door', 30, 44, (c) => mausoleum(c, false), solid);
  def('mausoleum-door-open', 30, 44, (c) => mausoleum(c, true), solid);
  def('crypt-lid', 28, 8, (c) => {
    c.row(1, 3, 24, C.stoneLight);
    c.rect(2, 2, 25, 3, C.stoneLight);
    c.row(3, 1, 26, C.stoneLight);
    c.rect(1, 4, 26, 6, C.stone);
    c.row(6, 1, 26, C.stoneDark);
    pat(c, 11, 1, ['.IIII.', 'I....I', '.IIII.']);
    c.set(13, 3, C.ironDark);
    c.set(14, 3, C.ironDark);
    c.line(5, 2, 8, 3, C.stone);
    moss(c, 1, 4, 26, 6, 4);
  });
  def('crypt-lid-ajar', 30, 11, (c) => {
    c.rect(1, 6, 28, 9, C.stone); // the rim
    c.row(6, 1, 28, C.stoneLight);
    c.rect(3, 6, 13, 8, C.night); // the dark below
    c.poly([[11, 5], [27, 2], [28, 4], [12, 7]], C.stoneLight); // the slab, pushed aside
    c.line(12, 7, 28, 4, C.stone);
    c.line(12, 8, 28, 5, C.stoneDark);
    pat(c, 19, 3, ['.II.', 'I..I'], P);
    pat(c, 3, 3, ['.z.z...', 'z.z.z..', 'z.z.z..', 'zzzzz.z', '.zzzzz.', '..ZZ...']); // a hand creeping out
    moss(c, 14, 8, 28, 9, 3);
  });
  const ANGEL = [
    '.....lss......',
    '....lsssd.....',
    '.l..lsssd..l..',
    '.ls.lsssd.sd..',
    'lss..lsd..ssd.',
    'lsss.lsd.sssd.',
    'lssdlsssssdsd.',
    'lssdlssssddsd.',
    'lsddssllsdssd.',
    '.lsdlslldsdsd.',
    '.lsdlssssdsd..',
    '.lsdlsssddsd..',
    '..ldlsssdsdd..',
    '..ldlsssdsd...',
    '...dlsssdd....',
    '...lssssd.....',
    '...lsdssd.....',
    '...lsdssd.....',
    '..lssdssd.....',
    '..lssdsssd....',
    '..lssdsssd....',
    '..lsdssdsd....',
    '.lssdssdssd...',
    '.lssdssdssd...',
    '.lsssssssssd..',
  ];
  const plinth = (c, x0, y0, x1, y1) => {
    block(c, x0 + 1, y0, x1 - 1, y0 + 1, C.stoneLight);
    block(c, x0 + 1, y0 + 2, x1 - 1, y1 - 3);
    lines(c, x0 + 3, x1 - 3, y0 + 4, 2);
    block(c, x0, y1 - 2, x1, y1);
    moss(c, x0, y1 - 4, x1, y1, 3);
  };
  def('angel-praying', 15, 38, (c) => {
    pat(c, 1, 1, ANGEL);
    plinth(c, 1, 26, 12, 36);
  }, solid);
  def('angel-broken', 21, 38, (c) => {
    const rows = ANGEL.map((r, j) => {
      let a = [...r];
      if (j < 4) a = a.map((ch, i) => (i >= 4 && i <= 8 ? '.' : ch)); // no head
      if (j < 14) a = a.map((ch, i) => (i >= 9 ? '.' : ch)); // one wing gone
      return a.join('');
    });
    rows[4] = 'lss..d.d......';
    rows[5] = 'lsss.lsd......';
    pat(c, 1, 1, rows);
    c.set(9, 8, C.stoneDark);
    c.set(9, 10, C.stoneDark);
    plinth(c, 1, 26, 12, 36);
    c.line(4, 28, 7, 33, C.stoneDark);
    pat(c, 14, 32, ['.lss.', 'lsssd', 'ldsds', '.sss.']); // the head, in the grass
    pat(c, 15, 27, ['l.', 'ls', '.s', '.d']);
    grass(c, 13, 19, 36, 7);
    c.row(36, 14, 18, C.stoneDark);
  }, solid);
  const railing = (c, bent) => {
    for (let x = 1; x <= 25; x += 3) {
      const corner = x === 1 || x === 25;
      if (bent && (x === 10 || x === 13)) continue;
      if (bent && x === 16) {
        c.line(16, 11, 12, 4, C.iron);
        c.set(12, 3, C.steel);
        continue;
      }
      if (bent && x === 7) {
        c.line(7, 11, 8, 3, C.iron);
        c.set(8, 2, C.steel);
        continue;
      }
      c.col(x, corner ? 2 : 3, 11, C.iron);
      c.set(x, corner ? 1 : 2, C.steel);
      if (corner) c.col(x + (x === 1 ? 1 : -1), 3, 11, C.ironDark);
    }
    if (bent) {
      c.row(4, 1, 6, C.ironDark);
      c.row(9, 1, 7, C.ironDark);
      c.row(4, 19, 25, C.ironDark);
      c.row(9, 16, 25, C.ironDark);
      c.line(7, 9, 11, 11, C.ironDark);
      c.line(17, 4, 19, 4, C.ironDark);
    } else {
      c.row(4, 1, 25, C.ironDark);
      c.row(9, 1, 25, C.ironDark);
    }
    c.speckle(1, 1, 25, 11, C.rust, 4, 6);
  };
  def('grave-railing', 27, 13, (c) => railing(c, false), solid);
  def('grave-railing-bent', 27, 13, (c) => railing(c, true));
  def('lychgate', 46, 48, (c) => {
    c.poly([[1, 16], [22, 3], [23, 3], [44, 16]], C.slate); // roof
    for (let y = 6; y <= 16; y += 3) for (let x = 1; x <= 44; x++) if (c.get(x, y)) c.set(x, y, C.ironDark);
    for (let y = 4; y <= 16; y++) for (let x = 1; x <= 44; x++) if (c.get(x, y) && (y % 3 !== 0) && (x + ((y / 3) | 0) * 2) % 4 === 0) c.set(x, y, dark(C.slate));
    c.line(1, 16, 22, 3, lite(C.slate));
    pat(c, 21, 1, ['.O.', 'OOO', '.O.']);
    moss(c, 1, 8, 20, 16, 5);
    c.rect(2, 17, 43, 19, C.woodDark); // beam
    c.row(17, 2, 43, C.wood);
    for (const x of [5, 37]) {
      c.rect(x, 20, x + 3, 45, C.wood); // posts
      c.col(x, 20, 45, C.woodLight);
      c.col(x + 3, 20, 45, C.woodDark);
      block(c, x - 1, 44, x + 4, 46);
    }
    c.line(9, 26, 14, 20, C.woodDark); // braces
    c.line(9, 27, 15, 20, C.wood);
    c.line(36, 26, 31, 20, C.woodDark);
    c.line(36, 27, 30, 20, C.wood);
    for (let x = 10; x <= 35; x += 2) c.col(x, 32 - (Math.abs(x - 22.5) < 2 ? 2 : 0), 45, x % 4 ? C.woodLight : C.wood); // the gate
    c.row(34, 9, 36, C.woodDark);
    c.row(42, 9, 36, C.woodDark);
    c.col(22, 30, 45, C.woodDark);
    c.col(23, 30, 45, C.woodDark);
    c.set(21, 38, C.iron);
    c.set(24, 38, C.iron);
  }, solid);
  const wreath = (c, leafA, leafB, flowers, ribbon) => {
    ell(c, 5.5, 5, 4, 4, leafA);
    ell(c, 5.5, 5, 3.2, 3.2, leafB);
    ell(c, 5.5, 5, 4.5, 4.5, leafA);
    for (let k = 0; k < flowers.length; k++) {
      const a = k * 1.3 + 0.4;
      c.set(5.5 + Math.cos(a) * 4, 5 + Math.sin(a) * 4, flowers[k]);
    }
    c.rect(5, 8, 6, 9, ribbon);
    c.line(4, 10, 3, 11, ribbon);
    c.line(7, 10, 8, 11, dark(ribbon));
  };
  def('wreath-funeral', 12, 13, (c) => wreath(c, C.leaf, C.leafLight, [C.white, C.wine, C.white, C.cream, C.wine], C.wine));
  def('wreath-dead', 12, 13, (c) => {
    wreath(c, C.woodDark, C.earth, [C.rust, C.ash], C.ash);
    c.clear(8, 11);
    c.clear(2, 3);
    c.clear(9, 2);
    c.set(9, 11, C.earth);
  });
  def('grave-lantern', 7, 11, (c) => {
    pat(c, 1, 1, ['..I..', '.III.', 'IrRrI', 'IRFRI', 'IRfRI', 'IrbrI', 'IIIII', 'tIIIt', '.I.I.']);
  });
  def('grave-candles', 14, 9, (c) => {
    c.row(7, 1, 12, C.bone); // wax
    c.row(7, 5, 9, dark(C.bone));
    candle(c, 2, 7, 3, C.bone, false, 2);
    candle(c, 5, 7, 5, C.bone, true, 2);
    candle(c, 8, 7, 1, C.bone, false, 2);
    pat(c, 10, 3, ['JjJ', 'jfj', 'jRj', 'jRj', 'JjJ'].slice(0, 5));
    c.set(11, 4, C.flameLight);
  });
  def('flowers-wilted', 13, 8, (c) => {
    pat(c, 1, 1, ['........vV.', '.HMHHHHvVv.', 'c.HHMHHHvV.', 'cc.HHMH.Vv.', 'c....H.....', '......D..D.']);
    c.set(4, 2, C.cream);
    c.set(4, 3, C.cream);
  });
  def('grave-coffin-pit', 38, 14, (c) => {
    c.oval(1, 1, 36, 12, C.earth);
    c.speckle(1, 1, 36, 12, dark(C.earth), 4, 3);
    c.speckle(1, 1, 36, 12, lite(C.earth), 7, 5);
    c.oval(5, 3, 32, 11, C.night);
    c.poly([[8, 7], [12, 5], [27, 5], [29, 7], [27, 9], [12, 9]], C.woodDark);
    c.line(12, 5, 27, 5, C.wood);
    c.line(8, 7, 12, 5, C.wood);
    c.row(7, 12, 22, C.wood);
    c.col(14, 6, 8, C.wood);
    grass(c, 1, 36, 2, 4);
  });
  def('grave-hand', 18, 14, (c) => {
    c.oval(1, 8, 16, 16, C.earth);
    c.clearRect(0, 13, 17, 17);
    c.speckle(1, 8, 16, 12, dark(C.earth), 4, 2);
    c.speckle(1, 8, 16, 12, lite(C.earth), 8, 3);
    pat(c, 5, 1, ['.z.z.z.', '.z.z.z.', 'z.zzzz.', 'zzzzzz.', '.zzzzZ.', '..zzZ..', '..zzZ..', '..zzZ..']);
    c.set(4, 9, dark(C.earth));
    c.set(10, 9, dark(C.earth));
    c.set(12, 7, C.earth);
  });
  def('coffin-smashed', 38, 12, (c) => {
    c.poly([[2, 10], [2, 6], [16, 5], [18, 7], [15, 8], [19, 10]], C.wood);
    c.row(10, 2, 19, C.woodDark);
    c.line(2, 6, 16, 5, C.woodLight);
    c.rect(4, 7, 13, 8, C.night);
    thick(c, 20, 9, 30, 4, 2, C.woodLight); // planks
    thick(c, 14, 4, 22, 2, 1, C.wood);
    c.row(10, 22, 35, C.wood);
    c.row(9, 26, 33, C.woodLight);
    c.line(31, 8, 35, 5, C.woodDark);
    skull(c, 6, 5, true);
    c.line(11, 7, 14, 6, C.bone);
    c.line(23, 9, 27, 8, C.bone);
    c.set(22, 8, C.bone);
    c.set(28, 9, C.bone);
    c.set(32, 8, C.iron);
  });
  def('bone-heap', 24, 14, (c) => {
    c.poly([[1, 12], [4, 8], [8, 5], [12, 3], [16, 5], [19, 8], [22, 12]], dark(C.bone));
    const r = rnd(7);
    for (let i = 0; i < 16; i++) {
      const x = 3 + r() * 16,
        y = 6 + r() * 6,
        dx = 2 + r() * 3;
      c.line(x, y, x + dx, y + (r() - 0.5) * 3, r() < 0.3 ? mix(C.bone, 0.5) : C.bone);
    }
    for (let y = 1; y <= 12; y++) for (let x = 1; x <= 22; x++) if (c.get(x, y) && Math.abs(x - 11.5) > (y - 2) * 1.05 + 1) c.clear(x, y);
    skull(c, 9, 1);
    skull(c, 3, 8, true);
    skull(c, 15, 7, true);
    c.row(12, 1, 22, mix(C.bone, 0.5));
  }, solid);
  def('skull-stake', 9, 25, (c) => {
    c.rect(4, 8, 5, 23, C.wood);
    c.col(5, 8, 23, C.woodDark);
    skull(c, 1, 2);
    c.set(4, 1, C.woodDark);
    c.set(4, 12, C.woodDark);
    c.set(5, 9, bloodDark);
    grass(c, 2, 7, 23, 3);
  }, solid);
  const deadTree = (c, x, y, h, th, seed, lean = 0) => {
    const r = rnd(seed),
      col = deadwood;
    c.poly([[x - th, y], [x - th / 2, y - 4], [x + th / 2, y - 4], [x + th, y]], col); // root flare
    limb(c, x, y - 2, Math.PI / 2 + lean, h * 0.42, th, r, col);
    trim(c);
    lit(c, 0, 0, c.w - 1, c.h - 1, 1.35);
  };
  def('dead-tree-tall', 44, 64, (c) => {
    deadTree(c, 21, 62, 62, 5, 5);
    pat(c, 20, 44, ['K', 'K', 'K']);
    c.set(21, 52, K);
  }, solid);
  def('dead-tree-noose', 48, 62, (c) => {
    deadTree(c, 17, 60, 56, 5, 11, 0.1);
    thick(c, 17, 30, 40, 22, 2, deadwood); // the hanging bough
    c.line(40, 22, 45, 19, deadwood);
    c.line(34, 24, 38, 18, deadwood);
    lit(c, 19, 18, 46, 31, 1.3);
    rope(c, 36, 24, 36, 36);
    noose(c, 36, 36);
    trim(c);
  }, solid);
  const stump = (c, x0, y0, x1, y1) => {
    c.rect(x0, y0 + 2, x1, y1, deadwood);
    for (let x = x0 + 2; x < x1; x += 3) c.col(x, y0 + 4, y1, dark(deadwood));
    c.col(x0, y0 + 2, y1, lite(deadwood));
    c.oval(x0, y0, x1, y0 + 4, C.woodPale);
    c.row(y0 + 2, x0 + 3, x1 - 3, C.woodLight);
    c.set((x0 + x1) >> 1, y0 + 2, C.wood);
    c.set(x0 - 1, y1, deadwood);
    c.set(x0 - 2, y1, deadwood);
    c.set(x1 + 1, y1, deadwood);
    c.set(x1 + 2, y1, dark(deadwood));
    c.set(x0 - 1, y1 - 1, deadwood);
  };
  def('tree-stump-old', 20, 13, (c) => {
    stump(c, 4, 2, 15, 11);
    pat(c, 14, 6, ['cc.', 'cCc', '...', '.cc'], P); // bracket fungus
    pat(c, 2, 7, ['cc', 'C.']);
    c.rect(8, 8, 10, 11, K); // rotten hollow
    c.set(9, 7, K);
    moss(c, 3, 2, 15, 11, 6);
  }, solid);
  def('stump-axe', 20, 21, (c) => {
    stump(c, 4, 10, 15, 19);
    c.line(10, 9, 16, 1, C.woodLight); // handle
    c.line(11, 9, 17, 1, C.wood);
    pat(c, 6, 7, ['.tt..', 'Ttttt', 'Tttt.', '.tt..']);
  }, solid);
  def('crow-headstone', 12, 24, (c) => {
    head(c, 1, 8, 10, 22);
    pat(c, 4, 11, ['.d.', 'ddd', '.d.', '.d.']);
    lines(c, 3, 8, 17, 2);
    moss(c, 1, 19, 10, 22, 3);
    crow(c, 2, 1);
  }, solid);
  def('crows-feeding', 28, 11, (c) => {
    pat(c, 9, 6, ['..DrD.....', '.rDrrrDr..', 'DrrbrDrrD.', 'rDrrDrrrrD']);
    pat(c, 1, 2, ['.kkk......', 'kkkkkk....', 'kkSkkkkk..', '.kkSkkkk..', '..kkkkkGG.', '...I.I.kG.', '...I.I....', '..II.II...']);
    pat(c, 17, 1, ['.....kkk..', '....kkkkk.', '..kkkkSkk.', '.kkkSkkkk.', 'GGkkkkkk..', '.G.kkkk...', '....I.I...', '....I.I...', '...II.II..']);
  });
  def('mist-patch', 46, 13, (c) => {
    const a = (x0, y0, x1, y1, al) => {
      const t = canvas(46, 13);
      t.oval(x0, y0, x1, y1, [1, 1, 1]);
      for (let y = 0; y < 13; y++)
        for (let x = 0; x < 46; x++)
          if (t.get(x, y)) {
            const edge = !t.get(x - 2, y) || !t.get(x + 2, y) || !t.get(x, y - 1) || !t.get(x, y + 1);
            if (!edge || (x + y) % 2) c.set(x, y, [...C.ghost, edge ? al * 0.6 : al]);
          }
    };
    a(1, 5, 30, 11, 120);
    a(14, 2, 44, 9, 110);
    a(8, 1, 26, 6, 90);
    a(20, 6, 40, 11, 150);
  }, flat);
  def('standing-stone', 15, 31, (c) => {
    c.poly([[2, 29], [3, 12], [5, 3], [8, 1], [11, 4], [12, 14], [13, 29]], C.stone);
    lit(c, 1, 1, 13, 29);
    c.line(5, 4, 4, 12, C.stoneLight);
    pat(c, 5, 8, ['.ddd.', 'd...d', 'd.d.d', 'd.dd.', 'd....', '.ddd.']); // a carved spiral
    pat(c, 6, 17, ['d.d', '.d.', 'd.d']);
    c.line(10, 6, 11, 16, C.stoneDark);
    moss(c, 2, 20, 13, 29, 3);
    grass(c, 1, 13, 29, 3);
  }, solid);
  def('trilithon', 38, 44, (c) => {
    c.poly([[3, 42], [4, 10], [11, 10], [13, 42]], C.stone);
    c.poly([[25, 42], [26, 10], [33, 10], [34, 42]], C.stone);
    lit(c, 1, 10, 14, 42);
    lit(c, 24, 10, 35, 42);
    c.poly([[1, 9], [2, 3], [10, 1], [30, 2], [36, 4], [36, 9]], C.stone); // lintel
    c.line(2, 3, 10, 1, C.stoneLight);
    c.line(10, 1, 30, 2, C.stoneLight);
    c.row(9, 2, 35, C.stoneDark);
    c.speckle(1, 1, 36, 42, C.stoneDark, 9, 4);
    c.line(8, 14, 6, 26, C.stoneDark);
    c.line(30, 18, 31, 30, C.stoneDark);
    moss(c, 1, 34, 36, 42, 3);
    moss(c, 1, 1, 36, 4, 4);
    grass(c, 2, 35, 42, 6);
  }, solid);
  def('well-ruined', 28, 34, (c) => {
    c.rect(3, 21, 24, 31, C.stone); // the ring wall
    c.oval(3, 18, 24, 24, C.stoneLight);
    c.oval(6, 19, 21, 23, C.night);
    for (let y = 25; y <= 31; y += 3) c.row(y, 3, 24, C.stoneDark);
    for (let y = 25; y <= 31; y++) for (let x = 4; x <= 23; x++) if (y % 3 !== 1 && (x + (((y - 25) / 3) | 0) * 3) % 6 === 0) c.set(x, y, C.stoneDark);
    c.col(3, 21, 31, C.stoneLight);
    c.clearRect(20, 18, 24, 21); // a gap in the wall
    c.set(20, 21, C.stone);
    pat(c, 23, 29, ['.ls', 'lss', 'lsd']);
    c.rect(4, 4, 5, 22, C.wood); // one post still stands
    c.col(4, 4, 22, C.woodLight);
    c.rect(21, 13, 22, 21, C.wood); // the other snapped
    c.set(21, 12, C.wood);
    thick(c, 2, 6, 14, 2, 2, C.woodDark); // what is left of the roof
    c.line(2, 5, 14, 1, C.wood);
    c.line(5, 8, 12, 8, C.woodDark);
    c.line(12, 8, 12, 11, dark(C.straw)); // rope end
    moss(c, 3, 22, 24, 31, 4);
    grass(c, 1, 26, 31, 5);
  }, solid);
  def('gallows', 38, 60, (c) => {
    c.rect(26, 3, 28, 44, C.wood); // post
    c.col(26, 3, 44, C.woodLight);
    c.col(28, 3, 44, C.woodDark);
    c.rect(9, 3, 28, 5, C.wood); // beam
    c.row(3, 9, 28, C.woodLight);
    c.row(5, 9, 25, C.woodDark);
    thick(c, 18, 6, 25, 14, 2, C.woodDark); // brace
    rope(c, 13, 6, 13, 16);
    noose(c, 13, 16);
    c.rect(3, 42, 34, 44, C.wood); // platform
    c.row(42, 3, 34, C.woodLight);
    c.row(44, 3, 34, C.woodDark);
    c.rect(10, 43, 16, 43, K); // trapdoor
    for (const x of [4, 18, 32]) {
      c.rect(x, 45, x + 1, 58, C.woodDark);
      c.col(x, 45, 58, C.wood);
    }
    c.line(6, 46, 17, 57, C.woodDark);
    c.line(20, 57, 31, 46, C.woodDark);
    for (let i = 0; i < 4; i++) c.rect(34 + i * 0, 46 + i * 3, 36, 47 + i * 3, i % 2 ? C.wood : C.woodLight); // steps
    c.col(36, 46, 58, C.woodDark);
  }, solid);
  const cageBars = (c, x0, y0, x1, y1) => {
    for (let x = x0; x <= x1; x += 2) c.col(x, y0, y1, C.iron);
    c.row(y0, x0, x1, C.ironDark);
    c.row(y1, x0, x1, C.ironDark);
    c.row((y0 + y1) >> 1, x0, x1, C.ironDark);
    c.col(x0, y0, y1, C.steel);
  };
  const cagedBones = (c, x, y) => {
    skull(c, x, y, true);
    pat(c, x, y + 5, ['..b..', 'bbbbb', '.bBb.', 'bbbbb', '.bBb.', '..b..', '.b.b.', '.b.b.', '.b.b.', 'b...b']);
  };
  def('gibbet-cage', 28, 60, (c) => {
    c.rect(4, 3, 6, 57, C.wood);
    c.col(4, 3, 57, C.woodLight);
    c.col(6, 3, 57, C.woodDark);
    c.rect(4, 3, 21, 5, C.wood);
    c.row(3, 4, 21, C.woodLight);
    thick(c, 7, 14, 14, 6, 2, C.woodDark);
    chain(c, 19, 6, 12);
    c.rect(14, 15, 24, 37, C.night);
    cagedBones(c, 17, 18);
    c.poly([[14, 15], [19, 12], [24, 15]], C.iron);
    cageBars(c, 14, 15, 24, 37);
    c.oval(1, 55, 10, 60, C.earth);
    c.clearRect(0, 59, 27, 59);
    grass(c, 1, 10, 57, 3);
  }, solid);
  def('scarecrow-ragged', 34, 44, (c) => {
    c.rect(16, 10, 17, 42, C.wood); // pole
    c.rect(3, 15, 30, 16, C.wood); // arms
    c.row(15, 3, 30, C.woodLight);
    c.poly([[10, 14], [23, 14], [24, 30], [20, 28], [17, 32], [13, 28], [9, 31]], cloth); // coat
    c.rect(5, 14, 28, 17, cloth);
    c.line(16, 16, 16, 29, dark(cloth));
    c.col(10, 15, 29, lite(cloth));
    pat(c, 14, 20, ['Y', '.', '.', 'Y'], P);
    pat(c, 20, 24, ['uu', 'u.']); // patch
    pat(c, 1, 13, ['.y.', 'yyy', 'yYy', 'yyy', '.y.']); // straw hands
    pat(c, 30, 13, ['.y.', 'yyy', 'yYy', 'yyy', '.y.']);
    pat(c, 9, 29, ['y.y..y.....y.y', '.y....y...y...']);
    c.oval(12, 4, 21, 12, hex('#a8642a')); // pumpkin head
    c.col(14, 5, 11, hex('#8a4e22'));
    c.col(19, 5, 11, hex('#8a4e22'));
    c.col(12, 6, 10, hex('#c07c36'));
    pat(c, 14, 7, ['K..K.K', '......', 'KK.KKK', '.KKKK.'].map((r) => r), P);
    c.rect(16, 2, 17, 3, C.leaf);
    crow(c, 22, 8);
    grass(c, 13, 20, 42, 3);
  }, solid);
  def('shrine-roadside', 16, 34, (c) => {
    c.rect(7, 15, 8, 32, C.wood);
    c.col(7, 15, 32, C.woodLight);
    c.rect(3, 6, 12, 15, C.wood); // box
    c.rect(4, 7, 11, 14, C.night);
    c.poly([[1, 6], [7, 1], [8, 1], [14, 6]], C.woodDark); // roof
    c.line(1, 6, 7, 1, C.wood);
    c.row(6, 1, 14, C.woodDark);
    pat(c, 5, 8, ['.xx.', '.xx.', 'NNNN', 'NNNN', 'NcNN', 'NNNN', 'NNNN']); // the saint
    c.set(6, 7, C.gold);
    c.set(7, 7, C.gold);
    candle(c, 10, 14, 3, C.bone);
    c.row(15, 2, 13, C.woodLight);
    pat(c, 3, 16, ['v.', '.H']); // a dead flower
    grass(c, 5, 10, 32, 3);
  }, solid);
  def('ruin-arch', 40, 52, (c) => {
    const cx = 19.5;
    const brokenTop = (x) => (x < 22 ? 3 : x < 26 ? 8 + ((x * 7) % 3) : x < 30 ? 15 + ((x * 5) % 4) : 22 + ((x * 3) % 3));
    for (let y = 2; y <= 50; y++)
      for (let x = 2; x <= 37; x++) {
        const dy = 24 - y,
          hw = y >= 24 ? 10 : dy > 17 ? -1 : 10 - (dy * dy) / 30;
        const ogee = Math.abs(x - cx) < hw;
        const outer = y >= 14 ? Math.abs(x - cx) < 18 : Math.abs(x - cx) < 18 - ((14 - y) * (14 - y)) / 8.5;
        if (outer && !ogee && y >= brokenTop(x)) c.set(x, y, C.stone);
      }
    for (let y = 2; y <= 50; y++)
      for (let x = 2; x <= 37; x++) {
        if (!c.get(x, y)) continue;
        const row = (y / 4) | 0;
        if (y % 4 === 0 || (x + row * 3) % 7 === 0) c.set(x, y, C.stoneDark);
      }
    lit(c, 1, 1, 19, 50);
    for (let y = 24; y <= 50; y++) c.set(30, y, c.get(30, y) && C.stoneLight);
    block(c, 1, 47, 11, 50, C.stoneLight);
    block(c, 28, 47, 38, 50, C.stoneLight);
    pat(c, 14, 46, ['.lss.', 'lsssd', 'lssdd', 'lsssd', 'lsssd'].slice(1)); // fallen stones
    pat(c, 20, 48, ['lss', 'lsd', 'lsd'].slice(0, 3));
    c.line(6, 50, 4, 30, C.leaf); // ivy
    c.line(4, 30, 7, 18, C.leaf);
    c.line(5, 40, 8, 36, C.leaf);
    c.speckle(3, 16, 9, 50, C.leafLight, 6, 2);
    moss(c, 1, 2, 38, 12, 5);
  }, solid);
  const fluted = (c, x0, y0, x1, y1, horiz = false) => {
    c.rect(x0, y0, x1, y1, C.stone);
    if (horiz) {
      for (let y = y0; y <= y1; y += 2) c.row(y, x0, x1, C.stoneLight);
      c.row(y1, x0, x1, C.stoneDark);
    } else {
      for (let x = x0; x <= x1; x += 2) c.col(x, y0, y1, C.stoneLight);
      c.col(x1, y0, y1, C.stoneDark);
    }
  };
  def('ruin-column', 13, 25, (c) => {
    fluted(c, 3, 3, 9, 19);
    pat(c, 3, 1, ['l......', 'ls..l..', 'lsl.ls.']);
    c.clear(9, 3);
    c.clear(8, 3);
    c.clear(9, 4);
    c.clear(6, 3);
    c.row(11, 3, 9, C.stoneDark);
    block(c, 2, 20, 10, 21, C.stoneLight);
    block(c, 1, 22, 11, 23);
    moss(c, 1, 16, 11, 23, 4);
  }, solid);
  def('ruin-column-fallen', 40, 12, (c) => {
    fluted(c, 2, 4, 12, 10, true);
    fluted(c, 14, 5, 23, 10, true);
    fluted(c, 26, 4, 32, 10, true);
    c.poly([[25, 4], [26, 3], [26, 10], [25, 10]], C.stoneDark);
    block(c, 33, 3, 35, 10, C.stoneLight);
    block(c, 36, 2, 37, 10);
    c.col(2, 4, 10, C.stoneLight);
    c.col(12, 4, 10, C.stoneDark);
    c.col(14, 5, 10, C.stoneLight);
    c.clear(14, 5);
    c.clear(23, 5);
    grass(c, 1, 38, 10, 4);
    moss(c, 1, 4, 38, 7, 6);
  }, solid);
  const mound = (c, x0, y0, x1, y1, col = C.earth, seed = 2) => {
    const w = x1 - x0,
      h = y1 - y0;
    for (let y = y0; y <= y1; y++) {
      const t = (y - y0 + 1) / (h + 1),
        hw = (w / 2) * Math.sqrt(1 - (1 - t) * (1 - t));
      c.row(y, Math.round((x0 + x1) / 2 - hw), Math.round((x0 + x1) / 2 + hw), col);
    }
    litTop(c, x0, y0, (x0 + x1) >> 1, y1, 1.25);
    c.speckle(x0, y0 + 1, x1, y1, dark(col), 4, seed);
    c.speckle(x0, y0 + 1, x1, y1, lite(col), 9, seed + 3);
  };
  const spade = (c, x, y0, y1) => {
    c.col(x, y0, y1 - 4, C.woodLight);
    c.row(y0, x - 1, x + 1, C.wood);
    c.rect(x - 1, y1 - 4, x + 1, y1, C.steel);
    c.col(x - 1, y1 - 4, y1, lite(C.steel));
    c.set(x, y1 - 3, C.iron);
  };
  def('spade-mound', 26, 20, (c) => {
    spade(c, 17, 1, 15);
    mound(c, 1, 12, 24, 18);
    c.rect(16, 11, 18, 12, C.steel);
    c.set(16, 11, lite(C.steel));
  }, solid);
  def('hearse-cart', 48, 30, (c) => {
    c.rect(8, 16, 40, 18, C.black); // the bed
    c.row(16, 8, 40, C.slate);
    c.line(1, 14, 8, 17, C.black); // shafts
    c.line(1, 13, 3, 14, C.black);
    for (const x of [9, 39]) c.col(x, 4, 16, C.black); // corner posts
    c.rect(8, 3, 40, 4, C.black);
    c.row(3, 8, 40, C.slate);
    for (let x = 10; x <= 38; x++) c.set(x, 5 + ((x >> 1) % 2), C.plum); // fringe
    c.row(5, 10, 38, C.plum);
    c.poly([[12, 15], [12, 11], [15, 9], [35, 9], [37, 11], [37, 15]], C.woodDark); // the coffin
    c.row(9, 15, 35, C.wood);
    c.row(12, 12, 37, C.wood);
    c.set(18, 14, C.brass);
    c.set(31, 14, C.brass);
    pat(c, 23, 10, ['.G.', 'GGG', '.G.'].slice(0, 1));
    wheel(c, 15, 22, 6, C.black, C.steel);
    wheel(c, 33, 22, 6, C.black, C.steel);
    c.col(42, 19, 28, C.black); // prop
  }, solid);
  def('grave-bell', 14, 30, (c) => {
    c.rect(4, 4, 5, 26, C.wood);
    c.col(4, 4, 26, C.woodLight);
    c.row(3, 4, 11, C.wood);
    c.line(6, 7, 9, 4, C.woodDark);
    pat(c, 8, 4, ['.G.', '.g.', 'gGG', 'gGG', 'gGGG'.slice(0, 3), '.I.']);
    c.row(8, 7, 11, C.brass);
    c.set(7, 8, C.gold);
    c.col(11, 9, 11, dark(C.straw)); // the string, down into the grave
    c.line(11, 11, 8, 24, C.straw);
    mound(c, 1, 23, 12, 28);
    c.set(8, 24, dark(C.straw));
  }, solid);
  def('plague-cart', 48, 28, (c) => {
    c.rect(6, 14, 38, 19, C.wood);
    for (let x = 9; x <= 38; x += 5) c.col(x, 14, 19, C.woodDark);
    c.row(14, 6, 38, C.woodLight);
    c.row(19, 6, 38, C.woodDark);
    c.col(6, 8, 19, C.woodDark);
    c.col(38, 8, 19, C.woodDark);
    c.line(39, 16, 46, 13, C.wood); // handles
    c.line(39, 17, 46, 14, C.woodDark);
    // the dead, in shrouds
    c.oval(8, 8, 24, 13, C.cream);
    c.oval(18, 6, 36, 13, dark(C.cream));
    c.oval(12, 3, 30, 9, C.cream);
    c.row(13, 8, 36, dark(C.cream));
    c.line(14, 6, 26, 5, dark(C.cream));
    c.line(22, 10, 33, 9, mix(C.cream, 0.55));
    c.line(10, 11, 20, 11, dark(C.cream));
    pat(c, 30, 5, ['zz.', 'zZz', '.zz']); // a head
    pat(c, 4, 12, ['zz..', '.zzz', '.z..', '.z..', 'zz..'].map((r) => r)); // an arm hanging out
    pat(c, 34, 11, ['zz', 'zZ', 'zz']); // feet
    c.speckle(8, 3, 36, 13, bloodDark, 30, 4);
    wheel(c, 22, 20, 6, C.woodDark, C.iron);
    c.col(8, 20, 26, C.woodDark); // prop
    c.col(36, 20, 26, C.woodDark);
  }, solid);
  def('sundial-skull', 13, 25, (c) => {
    skull(c, 3, 1, false, { ...P, b: C.stoneLight, B: C.stone });
    block(c, 2, 8, 10, 9, C.stoneLight);
    block(c, 3, 10, 9, 20);
    pat(c, 4, 12, ['ddddd', '.ddd.', '..d..', '.d.d.', 'ddddd'].slice(0, 5)); // hourglass
    block(c, 2, 21, 10, 21);
    block(c, 1, 22, 11, 23);
    moss(c, 1, 18, 11, 23, 4);
  }, solid);
  const candlestick = (c, x, y0, y1, col = C.brass) => {
    c.col(x, y0 + 5, y1, col);
    c.row(y1, x - 1, x + 1, dark(col));
    c.row(y0 + 5, x - 1, x + 1, col);
    c.set(x, ((y0 + y1) >> 1) + 3, lite(col));
    candle(c, x, y0 + 4, 3, C.bone);
  };
  def('bier-candles', 48, 34, (c) => {
    for (const x of [3, 8, 39, 44]) candlestick(c, x, 2 + (x === 8 || x === 39 ? 2 : 0), 32);
    c.poly([[13, 21], [13, 15], [16, 12], [32, 12], [35, 15], [35, 21]], C.woodDark); // coffin
    c.row(12, 16, 32, C.wood);
    c.poly([[11, 16], [37, 16], [38, 26], [10, 26]], C.black); // the pall
    c.row(16, 11, 37, C.slate);
    for (let x = 10; x <= 38; x += 3) c.set(x, 27, C.black);
    pat(c, 22, 18, ['.g.', 'ggg', '.g.', '.g.', '.g.']);
    c.col(13, 17, 26, cloth);
    c.col(34, 17, 26, cloth);
    for (const x of [14, 33]) {
      c.col(x, 27, 32, C.woodDark);
      c.line(x - 2, 32, x, 28, C.woodDark);
      c.line(x + 2, 32, x, 28, C.woodDark);
    }
    c.row(29, 15, 32, C.woodDark);
  }, solid);

  /* ================= EERIE THINGS ================= */
  const finish = (c) => {
    c.shade();
    c.outline();
  };
  const raw = { shade: false, outline: false };
  const leather = hex('#5a3626'),
    canvasBg = hex('#2e2a26'),
    web = hex('#c4cac6'),
    murk = hex('#7d8c62');
  const rotated = (src, deg, w, h) => {
    const o = canvas(w, h),
      a = (deg * Math.PI) / 180,
      cs = Math.cos(a),
      sn = Math.sin(a);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const dx = x - (w - 1) / 2,
          dy = y - (h - 1) / 2;
        const p = src.get(Math.round(cs * dx + sn * dy + (src.w - 1) / 2), Math.round(-sn * dx + cs * dy + (src.h - 1) / 2));
        if (p) o.px[y * w + x] = p;
      }
    return o;
  };
  const SIT = {
    man: ['000000000', '000aaa000', '00axxxa00', '00xxxxx00', '00xKxKx00', '00xxxxx00', '00aaXaa00', '000aaa000', '00NwwwN00', '0NNNwNNN0', 'NNNNNNNNN', 'NNNNgNNNN', 'NNNNNNNNN'],
    woman: ['000000000', '000kkk000', '00kkkkk00', '00kxxxk00', '00xKxKx00', '00xxxxx00', '000xRx000', '0000x0000', '000xxx000', '00vxxxv00', '0vvvgvvv0', 'vvvvvvvvv', 'vvvvvvvvv'],
    child: ['000000000', '000000000', '00RR00000', '00yyyyy00', '0yyxxxyy0', '0yxKxKxy0', '0yxxxxxy0', '00yxXxy00', '000cxc000', '00ccccc00', '0ccccccc0', '0cccRccc0', '0ccccccc0'],
    skull: ['000000000', '000bbb000', '00bbbbb00', '00bKbKb00', '00bKbKb00', '00bbKbb00', '000bBb000', '000BbB000', '00NwwwN00', '0NNNwNNN0', 'NNNNNNNNN', 'NNNNgNNNN', 'NNNNNNNNN'],
  };
  /** A portrait in a gold frame, 13 x 17, with its corner at x, y. */
  const portrait = (c, who, x = 1, y = 1) => {
    c.box(x, y, x + 12, y + 16, C.brass);
    c.frame(x + 1, y + 1, x + 11, y + 15, dark(C.brass));
    c.set(x, y, C.gold);
    c.set(x + 12, y, C.gold);
    pat(c, x + 2, y + 2, SIT[who], { ...P, 0: canvasBg });
  };
  def('portrait-man', 15, 19, (c) => portrait(c, 'man'));
  def('portrait-woman', 15, 19, (c) => portrait(c, 'woman'));
  def('portrait-child', 15, 19, (c) => portrait(c, 'child'));
  def('portrait-scratched', 15, 19, (c) => {
    portrait(c, 'man');
    for (const dx of [0, 2, 4]) c.line(4 + dx, 4, 7 + dx, 10, C.parchment);
    c.line(5, 5, 7, 9, C.paper);
    c.set(11, 10, C.parchment);
  });
  def('portrait-eyeless', 15, 19, (c) => {
    portrait(c, 'woman');
    c.rect(5, 7, 6, 7, K);
    c.rect(8, 7, 9, 7, K);
    c.set(5, 8, dark(C.flesh));
    c.set(9, 8, dark(C.flesh));
  });
  def('portrait-torn', 15, 21, (c) => {
    portrait(c, 'man');
    c.line(10, 3, 5, 14, K);
    c.line(11, 3, 6, 14, K);
    c.line(9, 6, 10, 9, K);
    c.poly([[5, 14], [8, 12], [9, 16], [6, 19]], C.parchment); // the flap hangs
    c.line(5, 14, 6, 19, dark(C.parchment));
  });
  def('portrait-crooked', 19, 21, (c) => {
    const t = canvas(15, 19);
    portrait(t, 'woman');
    c.stamp(rotated(t, 14, 19, 21), 0, 0);
    c.set(9, 1, C.iron);
  });
  def('portrait-skull', 15, 19, (c) => portrait(c, 'skull'));
  const photo = (c, cracked) => {
    c.box(1, 1, 12, 9, C.woodDark);
    c.rect(2, 2, 11, 8, sepia);
    pat(c, 2, 3, ['..4...4...', '.444.444.4', '.4Q4.4Q444', '.444.4444Q', '44444444444'.slice(0, 10), '4444444444'], { 4: sepiaDark, Q: C.paper });
    c.set(3, 5, C.paper);
    c.set(8, 5, C.paper);
    if (cracked) {
      c.rect(6, 4, 8, 6, C.black); // a face burnt out
      c.line(2, 2, 6, 5, C.white);
      c.line(6, 5, 11, 4, C.white);
      c.line(6, 5, 8, 8, C.white);
      c.line(6, 5, 4, 8, C.white);
    }
  };
  def('family-photo', 14, 11, (c) => photo(c, false));
  def('family-photo-cracked', 14, 11, (c) => photo(c, true));
  def('photo-wedding', 11, 14, (c) => {
    c.oval(1, 1, 9, 12, C.brass);
    c.oval(2, 2, 8, 11, sepia);
    pat(c, 2, 4, ['.ww.44.', '.wQ.Q4.', 'wwww444', 'wwww444', 'wwww444', '.www44.', '..ww4..'], { w: C.paper, Q: C.parchment, 4: sepiaDark });
    c.set(5, 1, C.gold);
  });
  const mirror = (c, kind) => {
    for (const x of [2, 11]) {
      c.col(x, 6, 33, C.wood); // posts
      c.set(x, 5, C.woodLight);
    }
    c.col(2, 6, 33, C.woodLight);
    pat(c, 1, 33, ['OOO', 'O.O'.slice(0, 0)]);
    c.row(34, 1, 4, C.woodDark);
    c.row(34, 9, 12, C.woodDark);
    c.row(31, 3, 10, C.woodDark); // stretcher
    c.oval(3, 1, 10, 8, C.wood); // the glass in its frame
    c.rect(3, 4, 10, 28, C.wood);
    c.col(3, 4, 28, C.woodLight);
    c.oval(4, 2, 9, 8, C.glass);
    c.rect(4, 5, 9, 27, C.glass);
    c.line(5, 12, 8, 6, C.glassLight);
    c.line(5, 16, 8, 10, C.glassLight);
    c.line(6, 25, 8, 21, C.glassLight);
    c.set(2, 16, C.brass);
    c.set(11, 16, C.brass);
    if (kind === 'cracked') {
      c.line(7, 12, 4, 4, C.white);
      c.line(7, 12, 9, 6, C.white);
      c.line(7, 12, 4, 17, C.white);
      c.line(7, 12, 9, 20, C.white);
      c.line(7, 12, 9, 12, C.white);
      c.poly([[7, 12], [9, 13], [9, 18]], C.night); // a shard gone
      c.line(6, 20, 5, 27, C.white);
    } else if (kind === 'ghost') {
      c.rect(4, 5, 9, 27, mix(C.glass, 0.7));
      pat(c, 4, 8, ['.hhhh.', 'hhhhhh', 'hKhhKh', 'hKhhKh', 'hhhhhh', 'hhKKhh', '.hKKh.', '.hhhh.', '..hh..', '.hhhh.', 'hhhhhh', 'h.hh.h', '..hh..', '..h...'], { h: C.ghost, K: C.night });
    } else if (kind === 'covered') {
      c.poly([[1, 3], [4, 1], [9, 1], [12, 3], [12, 22], [10, 25], [8, 22], [6, 26], [4, 23], [2, 25], [1, 22]], C.black);
      c.line(2, 4, 2, 22, cloth);
      c.line(5, 3, 5, 22, cloth);
      c.line(8, 4, 9, 20, cloth);
      c.row(1, 4, 9, cloth);
    }
  };
  def('mirror-standing', 14, 36, (c) => mirror(c), solid);
  def('mirror-standing-cracked', 14, 36, (c) => mirror(c, 'cracked'), solid);
  def('mirror-covered', 14, 36, (c) => mirror(c, 'covered'), solid);
  def('mirror-ghost', 14, 36, (c) => mirror(c, 'ghost'), solid);
  def('ouija-board', 18, 11, (c) => {
    c.box(1, 1, 16, 9, C.woodPale);
    pat(c, 2, 2, ['O............O', '..O.O.O.O.O...', '.O.O.O.O.O.O..', '..............', '..O.O.O.O.O...', '..............', '.OO........OO.']);
    pat(c, 7, 5, ['.pp.', 'pKpp', '.pp.'], { p: C.wood, K }); // the planchette
  });
  def('pentagram-circle', 38, 15, (c) => {
    const col = C.white,
      cx = 18.5,
      cy = 7,
      rx = 17,
      ry = 6;
    ell(c, cx, cy, rx, ry, col);
    ell(c, cx, cy, rx - 2, ry - 1, dark(col));
    const pt = (k) => [cx + Math.sin((k * 4 * Math.PI) / 5) * (rx - 2), cy - Math.cos((k * 4 * Math.PI) / 5) * (ry - 1)];
    for (let k = 0; k < 5; k++) c.line(...pt(k), ...pt(k + 1), col);
  }, flat);
  def('candles-group', 13, 12, (c) => {
    c.row(10, 1, 11, dark(C.bone));
    candle(c, 2, 10, 5, C.bone, true, 2);
    candle(c, 5, 10, 8, C.bone, true, 2);
    candle(c, 8, 10, 4, C.bone, true, 2);
    candle(c, 10, 10, 6, C.bone, true, 1);
    c.set(4, 6, C.bone);
    c.set(7, 5, C.bone);
    c.set(1, 9, C.bone);
  });
  const darkFlame = hex('#7b6aa8');
  def('candles-black', 13, 12, (c) => {
    c.row(10, 1, 11, C.black);
    candle(c, 2, 10, 6, C.black, true, 2, darkFlame);
    candle(c, 5, 10, 8, C.black, true, 2, darkFlame);
    candle(c, 9, 10, 5, C.black, true, 2, darkFlame);
    c.col(2, 5, 10, cloth);
    c.col(5, 3, 10, cloth);
    c.col(9, 6, 10, cloth);
  });
  def('candle-skull', 9, 13, (c) => {
    skull(c, 1, 5);
    candle(c, 4, 4, 2, C.white, true, 2);
    c.row(5, 2, 6, C.white);
    c.set(1, 6, C.white);
    c.col(6, 6, 7, C.white);
    c.col(2, 6, 6, C.white);
  });
  def('ritual-bowl', 12, 8, (c) => {
    pat(c, 1, 1, ['GggggggggG', 'GrRRrrrrrG', '.GGGGGGGG.', '..GGGGGG..', '...UGGU...', '..GGGGGG..'], { ...P, U: dark(C.brass) });
    c.set(2, 3, C.gold);
    c.set(8, 3, C.blood);
    c.set(8, 4, C.blood);
  });
  const ball = (c, x0, y0, col, lightCol) => {
    c.oval(x0, y0, x0 + 6, y0 + 6, col);
    c.set(x0 + 2, y0 + 1, lightCol);
    c.set(x0 + 1, y0 + 2, lightCol);
    c.set(x0 + 2, y0 + 2, lightCol);
  };
  def('seance-table', 28, 24, (c) => {
    c.poly([[2, 11], [25, 11], [26, 22], [1, 22]], C.plum); // the cloth
    c.rect(2, 10, 25, 11, lite(C.plum));
    for (let x = 4; x <= 24; x += 4) c.line(x, 12, x - 1 + (x > 13 ? 2 : 0), 22, dark(C.plum));
    for (let x = 1; x <= 26; x += 2) c.set(x, 22, C.gold);
    block(c, 11, 8, 15, 9, C.brass);
    ball(c, 10, 2, C.glass, C.glassLight);
    c.set(13, 5, C.glow);
    candle(c, 20, 9, 5, C.bone, true, 1);
    c.row(9, 19, 21, C.brass);
    pat(c, 4, 8, ['PP.P', 'PPPP']); // cards
  }, solid);
  def('crystal-ball-seance', 9, 12, (c) => {
    ball(c, 1, 1, C.glassLight, C.white);
    c.set(4, 4, C.glow);
    c.set(5, 5, C.glow);
    c.set(3, 5, C.glass);
    c.set(5, 3, C.glass);
    pat(c, 1, 8, ['.GgGGG.', '..GGG..', 'GgGGGGG']);
  });
  const card = (c, x, y, back) => {
    c.rect(x, y, x + 4, y + 6, back ? C.wine : C.paper);
    if (back) c.frame(x + 1, y + 1, x + 3, y + 5, dark(C.wine));
  };
  def('tarot-cards', 23, 10, (c) => {
    card(c, 1, 2, true);
    card(c, 7, 1, false);
    pat(c, 8, 2, ['.g.', 'ggg', '.g.', 'N.N', 'NNN']);
    card(c, 12, 2, false);
    pat(c, 13, 3, ['KKK', 'KwK', 'KKK', '.K.', 'K.K']); // death
    card(c, 17, 1, true);
    c.col(6, 2, 8, K);
    c.col(11, 2, 8, K);
  });
  def('voodoo-doll', 11, 13, (c) => {
    const m = { ...P, y: hex('#9a8358'), Y: hex('#6e5c3c') };
    pat(c, 1, 1, ['...yyy...', '..yKyKy..', '..yyyyy..', '...yYy...', 'yyyyyyyyy', 'y.yyRyy.y', '..yyyyy..', '..yyYyy..', '..yy.yy..', '..yy.yy..', '.yyy.yyy.'], m);
    c.line(7, 1, 9, 0 + 1, C.steel); // pins
    c.set(9, 1, C.red);
    c.line(6, 6, 9, 9, C.steel);
    c.set(9, 9, C.red);
    c.set(1, 3, C.red);
    c.line(1, 3, 3, 4, C.steel);
  });
  def('spell-book', 16, 9, (c) => {
    c.poly([[1, 7], [1, 3], [6, 2], [7, 3], [8, 2], [13, 3], [13, 7], [8, 7], [7, 7]], C.paper);
    c.row(7, 1, 14, leather);
    c.col(7, 3, 7, dark(C.paper));
    c.col(14, 4, 7, leather);
    pat(c, 2, 3, ['.v.v..O.O.O', 'v.v...OO.O.', '.vvv..O.OO.', '..v....O.O.'].map((r) => r), P);
    c.set(7, 2, C.paper);
  });
  def('bell-jar', 10, 14, (c) => {
    c.oval(1, 1, 8, 8, C.glass);
    c.rect(1, 5, 8, 10, C.glass);
    c.oval(2, 2, 7, 8, C.night);
    c.rect(2, 5, 7, 10, C.night);
    c.col(2, 4, 9, C.glassLight);
    c.set(3, 2, C.glassLight);
    pat(c, 3, 6, ['a.a.', 'aAaa'.slice(0, 3), 'a.a.', '.A..']); // the moth, pinned
    c.col(4, 9, 10, C.steel);
    block(c, 1, 11, 8, 12, C.wood);
    c.set(4, 1, C.glassLight);
  });
  def('hand-of-glory', 11, 16, (c) => {
    const m = { ...P, x: hex('#8a7a5e'), X: hex('#5e523e') };
    pat(c, 1, 2, ['..F.F.F..', '..f.f.f..', 'F.x.x.x..', 'f.x.x.x.F', 'x.x.x.x.f', 'x.xxxxx.x', 'xxxxxxxxx', '.xxxxXxx.', '..xxxXx..', '..xxXxx..', '..xXxxx..'], m);
    block(c, 2, 13, 8, 14, C.woodDark);
  });
  /* --- marks on floors and walls: flat, no outline --- */
  const stain = (c, w, col, seed, glint) => {
    const r = rnd(seed);
    c.oval(3, 2, w - 5, 6, col);
    c.oval(1, 3, (w >> 1) + 1, 7, col);
    c.oval(w >> 1, 1, w - 2, 5, col);
    for (let i = 0; i < 7; i++) c.set(1 + r() * (w - 2), 1 + r() * 7, col);
    if (glint) {
      c.row(3, 5, 9, C.red);
      c.set(4, 4, C.red);
      c.row(2, (w >> 1) + 2, (w >> 1) + 4, C.red);
    } else c.speckle(1, 1, w - 2, 7, dark(col), 3, seed);
  };
  def('bloodstain', 22, 9, (c) => stain(c, 22, hex('#4e1a16'), 3, false), flat);
  def('blood-pool', 22, 9, (c) => stain(c, 22, C.blood, 5, true), flat);
  def('blood-trail', 40, 9, (c) => {
    const r = rnd(4);
    for (let i = 0; i < 4; i++) {
      const y = 2 + i * 1.4;
      for (let x = 2 + i; x < 36 - i * 2; x++) if (r() < 0.82) c.set(x, y + Math.sin(x / 5 + i) * 1.2, i % 2 ? bloodDark : C.blood);
    }
    c.oval(30, 2, 38, 7, C.blood);
    c.row(4, 32, 35, C.red);
    c.set(1, 3, bloodDark);
    c.set(3, 7, bloodDark);
  }, flat);
  def('blood-drips', 13, 16, (c) => {
    c.rect(1, 1, 11, 2, C.blood);
    c.oval(2, 1, 9, 4, C.blood);
    for (const [x, l] of [[2, 6], [4, 12], [6, 5], [8, 9], [10, 4]]) {
      c.col(x, 2, 2 + l, C.blood);
      c.set(x, 3 + l, bloodDark);
    }
    c.set(5, 15, C.blood);
    c.set(9, 14, C.blood);
    c.row(1, 3, 7, C.red);
  }, flat);
  const BOOT = ['.mmm', 'mmmm', 'mmmm', '.mm.', '....', '.mm.', '.mm.'];
  const FOOT = ['r.rr', 'rrrr', 'rrrr', '.rrr', '.rr.', '.rr.', '.rr.'];
  const prints = (c, rows, m) => {
    // side by side across the floor, walking to the right: each print lies on its side
    const lay = (x, y) => rows.forEach((r, j) => [...r].forEach((ch, i) => m[ch] && c.set(x + (6 - j), y + i, m[ch])));
    lay(1, 1);
    lay(8, 5);
    lay(16, 1);
    lay(23, 5);
  };
  def('footprints-muddy', 31, 10, (c) => {
    prints(c, BOOT, { m: mud });
    c.set(9, 2, mud);
    c.set(20, 8, mud);
    c.speckle(0, 0, 30, 9, dark(mud), 3, 2);
  }, flat);
  def('footprints-bloody', 31, 10, (c) => {
    prints(c, FOOT, { r: C.blood });
    c.set(12, 2, C.blood);
    c.speckle(0, 0, 30, 9, bloodDark, 4, 2);
  }, flat);
  def('scratch-marks', 12, 15, (c) => {
    for (let i = 0; i < 4; i++) {
      c.line(2 + i * 3, 1 + (i % 2), i * 3, 12 + (i % 2), K);
      c.line(3 + i * 3, 3, 1 + i * 3, 11, C.paper);
    }
  }, flat);
  def('handprint-bloody', 10, 14, (c) => {
    pat(c, 1, 1, ['..r.r...', '..r.r.r.', 'r.r.r.r.', 'r.r.r.r.', 'r.rrrrr.', '.rrrrrr.', '.rrDrrrr', '.rrrrr.r', '..rrrr..', '..rrr...', '..r.r...', '....r...']);
  }, flat);
  def('message-blood', 30, 12, (c) => {
    const F = {
      G: ['rrr', 'r..', 'r.r', 'r.r', 'rrr'],
      E: ['rrr', 'r..', 'rr.', 'r..', 'rrr'],
      T: ['rrr', '.r.', '.r.', '.r.', '.r.'],
      O: ['rrr', 'r.r', 'r.r', 'r.r', 'rrr'],
      U: ['r.r', 'r.r', 'r.r', 'r.r', 'rrr'],
    };
    let x = 1;
    for (const ch of 'GET OUT') {
      if (ch !== ' ') pat(c, x, 1 + (x % 3 === 0 ? 1 : 0), F[ch]);
      x += 4;
    }
    for (const [dx, l] of [[1, 3], [10, 2], [17, 4], [22, 2], [26, 3]]) c.col(dx, 6, 6 + l, bloodDark);
  }, flat);
  def('chalk-outline', 40, 15, (c) => {
    const pts = [[2, 7], [5, 5], [8, 6], [12, 4], [14, 1], [16, 2], [15, 5], [22, 5], [30, 2], [37, 3], [37, 5], [30, 6], [29, 8], [36, 10], [37, 12], [34, 13], [26, 10], [21, 10], [16, 9], [13, 12], [10, 13], [9, 11], [11, 9], [8, 9], [4, 10]];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i],
        b = pts[(i + 1) % pts.length];
      c.line(a[0], a[1], b[0], b[1], C.white);
    }
    c.oval(2, 6, 6, 9, null);
    ell(c, 4, 7.5, 2.4, 2, C.white); // the head
    c.speckle(0, 0, 39, 14, C.ash, 4, 3);
  }, flat);
  def('bullet-holes', 16, 12, (c) => {
    for (const [x, y] of [[3, 3], [9, 2], [12, 7], [5, 8]]) {
      c.rect(x, y, x + 1, y + 1, K);
      c.set(x - 1, y - 1, C.slate);
      c.set(x + 2, y + 2, C.slate);
      c.set(x + 2, y - 1, C.slate);
      c.set(x - 1, y + 2, C.paper);
    }
    c.line(5, 5, 8, 7, C.slate);
    c.line(11, 4, 13, 6, C.slate);
  }, flat);
  def('noose', 7, 30, (c) => {
    rope(c, 3, 0, 3, 16);
    c.rect(2, 15, 4, 19, C.straw); // the knot
    c.row(16, 2, 4, dark(C.straw));
    c.row(18, 2, 4, dark(C.straw));
    ell(c, 3, 24, 2, 4, C.straw);
    c.set(1, 23, dark(C.straw));
    c.set(5, 26, dark(C.straw));
  });
  /** A coffin lying on the floor, seen from its long side; the head is to the left. */
  const coffin = (c, x0, y0, len, o = {}) => {
    const col = o.col || C.wood,
      x1 = x0 + len - 1,
      sh = x0 + Math.round(len * 0.28);
    c.poly([[x0 + 2, y0 + 3], [sh, y0 + 4], [x1, y0 + 3], [x1, y0 + 7], [sh, y0 + 8], [x0 + 2, y0 + 7]], col); // the side
    c.row(y0 + 8, x0 + 2, x1, dark(col));
    c.row(y0 + 7, x0 + 2, x1, dark(col));
    c.col(sh, y0 + 4, y0 + 8, dark(col));
    c.set(sh + 5, y0 + 5, C.brass);
    c.set(x1 - 5, y0 + 5, C.brass);
    c.set(x0 + 4, y0 + 5, C.brass);
    const top = o.open ? o.lining || C.wine : lite(col);
    c.poly([[x0 + 4, y0], [sh + 1, y0], [x1 - 2, y0 + 1], [x1, y0 + 2], [x1, y0 + 3], [x0 + 1, y0 + 3], [x0 + 1, y0 + 2]], top); // the lid, or the inside
    c.row(y0 + 3, x0 + 1, x1, col);
    if (o.open) {
      c.row(y0, x0 + 4, sh + 1, col);
      c.row(y0 + 1, x0 + 3, x1 - 2, dark(top));
      c.rect(x0 + 4, y0 + 1, x0 + 8, y0 + 2, C.white); // pillow
    } else {
      c.row(y0 + 1, sh - 3, x1 - 6, o.cross || C.brass);
      c.col(sh, y0, y0 + 2, o.cross || C.brass);
    }
  };
  def('coffin-shut', 40, 11, (c) => coffin(c, 1, 1, 38), solid);
  def('coffin-open', 42, 18, (c) => {
    c.poly([[6, 9], [10, 1], [38, 2], [40, 5], [36, 9]], C.woodDark); // the lid, leaning behind
    c.line(6, 9, 10, 1, C.wood);
    c.line(10, 1, 38, 2, C.wood);
    c.row(5, 16, 30, C.brass);
    c.col(19, 3, 7, C.brass);
    coffin(c, 1, 8, 38, { open: true });
  }, solid);
  def('coffin-body', 40, 13, (c) => {
    coffin(c, 1, 3, 38, { open: true });
    c.rect(10, 3, 34, 5, C.black); // the dead
    c.oval(5, 2, 9, 6, hex('#b9b8a4'));
    c.set(6, 4, K);
    c.row(1, 5, 8, C.ash);
    c.rect(18, 2, 21, 3, hex('#b9b8a4')); // hands crossed
    c.set(13, 4, C.white);
    c.rect(33, 2, 35, 5, C.black);
    c.row(6, 3, 37, C.wood);
  }, solid);
  def('coffin-child', 24, 11, (c) => coffin(c, 1, 1, 22, { col: hex('#b4b0a0'), cross: C.gold }), solid);
  def('coffin-upright', 18, 42, (c) => {
    const shape = (dx, col) => c.poly([[5 + dx, 1], [11 + dx, 1], [14 + dx, 10], [11 + dx, 39], [5 + dx, 39], [2 + dx, 10]], col);
    shape(0, C.woodDark);
    c.poly([[5, 2], [11, 2], [13, 10], [10, 38], [6, 38], [3, 10]], C.night); // dark inside
    shape(2, C.wood); // the lid, ajar
    c.line(7, 1, 4, 10, C.woodLight);
    c.line(4, 10, 7, 39, C.woodLight);
    c.col(10, 6, 22, C.brass);
    c.row(11, 7, 13, C.brass);
    c.line(8, 26, 12, 26, C.woodDark);
    c.line(7, 32, 13, 32, C.woodDark);
    c.rect(1, 1, 3, 40, null);
    pat(c, 3, 18, ['z', 'z', 'Z']); // fingers on the edge of the lid
    c.row(40, 4, 14, C.woodDark);
  }, solid);
  const URN = ['..GG..', '.gGGG.', '..GG..', '.gGGG.', 'gGGGGG', 'gGgGGG', 'gGGGGG', '.gGGG.', '..GG..', '.gGGG.'];
  def('urn-funeral', 8, 12, (c) => pat(c, 1, 1, URN));
  def('urn-spilled', 18, 9, (c) => {
    URN.forEach((r, j) => [...r].forEach((ch, i) => P[ch] && c.set(10 - j, 1 + i, P[ch]))); // on its side
    c.clear(1, 3);
    c.clear(1, 4);
    c.oval(9, 4, 16, 7, C.ash);
    c.row(7, 3, 16, C.ash);
    c.speckle(3, 4, 16, 7, dark(C.ash), 3, 2);
    c.set(13, 5, C.bone);
    c.set(15, 6, C.bone);
    pat(c, 11, 2, ['G.', '.G']); // the lid
  });
  const jar = (c, x, y, w, h, liquid = murk) => {
    c.rect(x, y + 1, x + w - 1, y + h - 1, liquid);
    c.row(y + 1, x, x + w - 1, C.glass);
    c.col(x, y + 1, y + h - 1, C.glassLight);
    c.row(y + h - 1, x, x + w - 1, dark(liquid));
    c.rect(x + 1, y, x + w - 2, y, C.iron);
  };
  const CONTENT = {
    eye: ['.ww.', 'wNKw', 'wKNw', '.ww.', '..R.', '.R..'],
    brain: ['.xx.', 'xXxx', 'xxXx', 'XxxX', '.xx.'],
    hand: ['x.x.', 'x.xx', 'xxxx', 'xxxx', '.xx.', '.RR.'],
    creature: ['.77.', '7L7L', '7777', '7.7.', '7.77', '.7.7'],
  };
  for (const k of Object.keys(CONTENT))
    def('specimen-jar-' + k, 8, 13, (c) => {
      jar(c, 1, 1, 6, 11);
      pat(c, 2, 4, CONTENT[k], { ...P, x: k === 'brain' ? hex('#b08a84') : hex('#b9a58c'), X: hex('#7e5f5c'), 7: hex('#5a4a6a'), L: C.glow });
    });
  def('specimen-shelf', 30, 30, (c) => {
    for (const y of [9, 19, 28]) {
      c.rect(1, y, 28, y, C.wood);
      c.row(y, 1, 28, C.woodLight);
      c.set(2, y + 1, C.woodDark);
      c.set(27, y + 1, C.woodDark);
    }
    const ks = Object.keys(CONTENT);
    let n = 0;
    for (const y of [1, 11, 20])
      for (let x = 2; x <= 23; x += 7) {
        const k = ks[(n * 3 + 1) % 4],
          hgt = 8 - (n % 3 === 1 ? 2 : 0);
        jar(c, x + (n % 2), y + 8 - hgt, 5, hgt, n % 3 ? murk : hex('#8a7a52'));
        pat(c, x + 1 + (n % 2), y + 10 - hgt, CONTENT[k].slice(0, hgt - 3).map((r) => r.slice(0, 3)), { ...P, x: hex('#b9a58c'), X: hex('#7e5f5c'), 7: hex('#5a4a6a'), L: C.glow });
        n++;
      }
    c.col(1, 2, 28, C.woodDark);
    c.col(28, 2, 28, C.woodDark);
  }, solid);
  def('taxidermy-deer', 24, 25, (c) => {
    const fur = hex('#7a5638');
    c.oval(6, 11, 17, 23, C.woodDark); // plaque
    c.oval(7, 12, 16, 22, C.wood);
    c.line(9, 9, 5, 4, C.bone); // antlers
    c.line(5, 4, 5, 1, C.bone);
    c.line(7, 6, 8, 2, C.bone);
    c.line(5, 4, 2, 3, C.bone);
    c.line(2, 3, 1, 1, C.bone);
    c.rect(9, 9, 11, 17, fur);
    c.rect(10, 17, 11, 20, fur);
    pat(c, 6, 8, ['x..', 'xx.', '.xx'], { x: dark(fur) }); // ear
    c.set(9, 12, K);
    c.rect(11, 19, 11, 20, K);
    c.col(11, 10, 16, lite(fur));
    c.mirror();
    c.col(12, 10, 16, fur);
  });
  def('taxidermy-boar', 18, 16, (c) => {
    const fur = hex('#4a3a30');
    c.oval(2, 2, 15, 14, C.woodDark);
    c.oval(3, 3, 14, 13, C.wood);
    c.oval(4, 3, 8, 12, fur);
    c.rect(6, 4, 8, 13, fur);
    pat(c, 3, 2, ['k.', 'kk']);
    c.set(6, 7, C.gold);
    c.rect(7, 10, 8, 13, hex('#8a6a5e'));
    c.set(8, 12, K);
    c.col(5, 9, 11, C.white); // tusk
    c.set(4, 9, C.white);
    c.mirror();
  });
  def('taxidermy-crow', 12, 20, (c) => {
    crow(c, 1, 1);
    c.rect(3, 8, 8, 8, C.woodLight); // perch
    c.rect(5, 9, 6, 16, C.wood);
    block(c, 2, 17, 9, 18, C.woodDark);
    c.set(4, 2, C.gold);
  });
  const dome = (c, x0, y0, x1, y1) => {
    const w = x1 - x0 + 1;
    c.oval(x0, y0, x1, y0 + w - 1, C.glass);
    c.rect(x0, y0 + (w >> 1), x1, y1, C.glass);
    c.oval(x0 + 1, y0 + 1, x1 - 1, y0 + w - 2, C.night);
    c.rect(x0 + 1, y0 + (w >> 1), x1 - 1, y1, C.night);
    c.col(x0 + 1, y0 + 3, y1 - 1, C.glassLight);
  };
  def('stuffed-owl', 12, 18, (c) => {
    dome(c, 1, 1, 10, 14);
    pat(c, 3, 4, ['o....o', 'oooooo', 'oFKFKo'.replace(/F/g, 'g').replace('gKgK', 'gKgK'), 'ooGGoo'.replace('GG', 'gg').replace('gg', 'yo'), 'opopoo', 'oopopo', 'opopoo', '.oooo.', '.G..G.']);
    c.set(4, 6, C.gold);
    c.set(5, 6, K);
    c.set(6, 6, C.gold);
    c.set(7, 6, K);
    c.set(8, 6, C.wood);
    pat(c, 4, 6, ['gKgK'.replace(/./g, (m, i) => 'gK.g'[i])]);
    c.set(6, 6, C.wood);
    c.set(7, 6, C.gold);
    c.set(8, 6, K);
    c.set(4, 6, K);
    c.set(5, 6, C.gold);
    c.row(13, 3, 8, C.woodLight);
    block(c, 1, 15, 10, 16, C.woodDark);
  });
  def('stuffed-fox', 24, 14, (c) => {
    const f = { ...P, u: hex('#8a4a26'), U: hex('#5e3018') };
    pat(c, 1, 1, [
      '.u.u..................',
      '.uuu..................',
      'uuKuu.................',
      'wuuuuuuuuuuuuuu.......',
      '.wKwuuuuuuuuuuuu......',
      '..wwuuuuuuuuuuuUu.....',
      '...uuuuuuuuuuuuUuuu...',
      '...uUuu.....uUuu.uuuw.',
      '...uU.u.....uU.u..uuww',
      '...kk.k.....kk.k......',
    ], f);
    block(c, 2, 11, 20, 12, C.woodDark);
  });
  def('stuffed-cat', 11, 14, (c) => {
    pat(c, 1, 1, ['k...k....', 'kk.kk....', 'kkkkk....', 'kgkgk....', 'kkkkk....', '.kkkkk...', '.kkkkkk..', '.kkkkkk..', '.kkkkkk.k', '.kkkkkk.k', '.kkkkkkkk']);
    c.col(2, 6, 10, C.slate);
    block(c, 1, 12, 9, 12, C.woodDark);
  });
  const KEY = ['G', 'G', 'G', 'GG', 'G', 'GG'];
  def('key-rack', 20, 12, (c) => {
    c.box(1, 1, 18, 4, C.wood);
    for (let i = 0; i < 5; i++) {
      const x = 3 + i * 3 + (i > 2 ? 1 : 0);
      c.set(x, 3, C.iron);
      if (i === 3) continue; // one key is missing
      pat(c, x - 1, 4, ['.i.', 'i.i', '.i.', '.i.', '.ii', '.i.', '.ii'], { i: i % 2 ? C.brass : C.steel });
    }
    c.set(2, 2, C.paper);
    c.set(17, 2, C.paper);
  });
  def('locked-box', 14, 11, (c) => {
    c.box(1, 3, 12, 9, C.wood);
    c.rect(1, 1, 12, 3, C.woodLight);
    c.row(1, 2, 11, C.woodPale);
    c.clear(1, 1);
    c.clear(12, 1);
    c.row(4, 1, 12, C.woodDark);
    c.col(3, 1, 9, C.brass);
    c.col(10, 1, 9, C.brass);
    pat(c, 6, 3, ['.i.', 'i.i', 'ggg', 'gKg', 'ggg'], { i: C.steel, g: C.brass, K });
  }, solid);
  def('strongbox', 16, 12, (c) => {
    c.box(1, 2, 14, 10, C.iron);
    c.row(4, 1, 14, C.ironDark);
    for (const x of [2, 5, 10, 13]) for (const y of [3, 6, 9]) c.set(x, y, C.steel);
    c.rect(7, 5, 8, 7, C.brass);
    c.set(7, 6, K);
    c.rect(6, 1, 9, 1, C.steel);
    c.speckle(1, 2, 14, 10, C.rust, 12, 2);
  }, solid);
  def('letters-bundle', 11, 8, (c) => {
    c.rect(1, 2, 9, 6, C.paper);
    c.row(3, 1, 9, C.parchment);
    c.row(5, 1, 9, C.parchment);
    c.row(6, 1, 9, dark(C.parchment));
    c.col(5, 1, 6, C.wine);
    c.row(4, 1, 9, C.wine);
    pat(c, 4, 1, ['v.v']);
  });
  def('letter-unsealed', 13, 9, (c) => {
    c.rect(1, 3, 8, 7, C.parchment); // envelope
    c.line(1, 3, 4, 5, dark(C.parchment));
    c.line(8, 3, 5, 5, dark(C.parchment));
    c.set(4, 6, C.blood);
    c.set(5, 6, C.blood);
    c.poly([[5, 1], [11, 2], [10, 7], [6, 6]], C.paper); // the note
    c.line(7, 3, 9, 3, C.slate);
    c.line(7, 5, 9, 5, C.slate);
  });
  def('diary-old', 10, 9, (c) => {
    c.box(1, 1, 8, 7, leather);
    c.col(1, 1, 7, dark(leather));
    c.col(8, 2, 6, C.paper);
    c.row(4, 5, 8, C.brass);
    c.rect(6, 3, 7, 5, C.brass);
    c.set(6, 4, K);
    c.set(3, 2, C.gold);
  });
  def('photo-pile', 15, 9, (c) => {
    const ph = (x, y) => {
      c.rect(x, y, x + 5, y + 4, C.paper);
      c.rect(x + 1, y + 1, x + 4, y + 3, sepia);
      c.set(x + 2, y + 2, sepiaDark);
      c.set(x + 3, y + 2, sepiaDark);
    };
    ph(1, 3);
    ph(8, 2);
    ph(4, 1);
    c.col(3, 1, 5, K);
  });
  def('newspaper-old', 14, 9, (c) => {
    const pp = hex('#b3a57c');
    c.rect(1, 1, 12, 7, pp);
    c.rect(2, 2, 9, 3, C.slate); // headline
    c.rect(10, 2, 11, 4, sepiaDark);
    for (const y of [5, 6]) c.row(y, 2, 11 - (y % 2) * 2, dark(pp));
    c.row(7, 1, 12, dark(pp));
    c.clear(12, 1);
  });
  const bottle = (c, x, yb, h, col, label) => {
    c.rect(x, yb - h + 3, x + 2, yb, col);
    c.set(x + 1, yb - h + 2, col);
    c.set(x + 1, yb - h + 1, C.parchment);
    c.col(x, yb - h + 3, yb, lite(col));
    if (label) c.rect(x, yb - 3, x + 2, yb - 2, C.paper);
  };
  def('medicine-bottles', 15, 12, (c) => {
    bottle(c, 1, 10, 8, amber, true);
    bottle(c, 5, 10, 10, hex('#3e5a3a'), true);
    bottle(c, 9, 10, 7, amber, false);
    c.set(6, 7, K);
    c.rect(12, 8, 13, 10, hex('#3a4a66'));
    c.set(12, 7, C.parchment);
  });
  def('pill-box', 13, 7, (c) => {
    c.box(1, 2, 6, 5, C.steel);
    c.row(1, 2, 7, lite(C.steel));
    c.set(3, 3, C.red);
    for (const [x, y] of [[8, 5], [10, 4], [11, 5], [9, 3]]) c.set(x, y, C.white);
  });
  def('syringe-tray', 16, 7, (c) => {
    c.rect(1, 3, 14, 5, C.steel);
    c.row(3, 1, 14, lite(C.steel));
    c.row(5, 2, 13, dark(C.steel));
    c.clear(1, 5);
    c.clear(14, 5);
    c.row(2, 3, 8, C.glassLight); // syringe
    c.set(2, 2, C.iron);
    c.row(2, 9, 12, C.white);
    c.set(5, 2, poison);
    c.set(6, 2, poison);
    c.row(1, 6, 9, C.iron);
  });
  def('surgical-tools', 18, 8, (c) => {
    c.rect(1, 4, 16, 6, C.steel);
    c.row(4, 1, 16, lite(C.steel));
    c.row(6, 2, 15, dark(C.steel));
    c.clear(1, 6);
    c.clear(16, 6);
    c.line(2, 3, 6, 2, C.white); // scalpel
    c.set(2, 3, C.blood);
    c.line(8, 1, 8, 3, C.iron); // forceps
    c.line(10, 1, 9, 3, C.iron);
    c.rect(11, 2, 15, 3, C.white); // saw
    c.row(3, 11, 15, C.blood);
    c.set(16, 2, C.wood);
    c.set(4, 5, C.blood);
  });
  def('bone-saw', 18, 8, (c) => {
    c.rect(1, 2, 12, 5, lite(C.steel));
    for (let x = 1; x <= 12; x += 2) c.set(x, 6, C.steel);
    c.row(2, 1, 12, C.iron);
    c.rect(13, 1, 16, 6, C.woodDark);
    c.rect(14, 3, 15, 4, null);
    c.clearRect(14, 3, 15, 4);
    c.rect(2, 4, 7, 5, C.blood);
    c.set(4, 6, C.blood);
    c.set(8, 5, bloodDark);
  });
  def('knife-bloody', 16, 6, (c) => {
    c.poly([[1, 3], [4, 1], [10, 1], [10, 3]], lite(C.steel));
    c.row(3, 2, 10, C.steel);
    c.rect(11, 1, 14, 3, C.woodDark);
    c.set(12, 2, C.brass);
    c.rect(1, 2, 5, 3, C.blood);
    c.set(6, 3, C.blood);
    c.set(3, 4, bloodDark);
  });
  def('axe-bloody', 22, 22, (c) => {
    c.rect(4, 12, 16, 20, C.wood); // the block
    for (let x = 6; x < 16; x += 3) c.col(x, 14, 20, C.woodDark);
    c.col(4, 12, 20, C.woodLight);
    c.oval(4, 10, 16, 14, C.woodPale);
    c.line(11, 10, 19, 1, C.woodLight);
    c.line(12, 10, 20, 1, C.wood);
    pat(c, 7, 7, ['.tt..', 'Ttttt', 'rrtt.', '.rr..']);
    c.row(12, 6, 10, C.blood);
    c.col(7, 13, 16, C.blood);
    c.col(10, 13, 14, bloodDark);
  }, solid);
  def('straitjacket', 18, 18, (c) => {
    const cv = hex('#a39c84');
    c.poly([[5, 1], [11, 1], [14, 4], [14, 16], [3, 16], [2, 4]], cv);
    c.rect(1, 7, 15, 10, cv); // sleeves, crossed and tied
    c.row(10, 1, 15, dark(cv));
    c.row(7, 2, 14, lite(cv));
    c.rect(7, 1, 9, 2, C.night);
    for (const y of [4, 12, 14]) {
      c.row(y, 4, 13, leather);
      c.set(8, y, C.brass);
    }
    c.col(3, 4, 16, lite(cv));
    c.line(15, 8, 16, 14, leather);
    c.line(1, 9, 1, 14, leather);
  });
  def('wheelchair-old', 24, 28, (c) => {
    const wk = hex('#9a8452');
    c.rect(5, 3, 7, 16, wk); // back
    c.dither(5, 3, 7, 16, dark(wk));
    c.col(5, 2, 16, C.woodDark);
    c.line(2, 2, 5, 3, C.woodDark); // handle
    c.rect(6, 14, 17, 16, wk); // seat
    c.row(14, 6, 17, lite(wk));
    c.row(10, 8, 15, C.woodDark); // armrest
    c.col(15, 10, 14, C.woodDark);
    c.line(17, 16, 20, 23, C.woodDark); // footrest
    c.row(23, 19, 22, C.woodDark);
    wheel(c, 9, 18, 8, C.iron, C.steel);
    c.oval(17, 23, 20, 26, C.iron);
    c.set(18, 24, C.steel);
    c.speckle(1, 9, 22, 26, C.rust, 9, 3);
  }, solid);
  const gurney = (c, y) => {
    c.rect(2, y, 37, y + 1, hex('#b0ad9c')); // pad
    c.row(y, 2, 37, C.white);
    c.rect(2, y + 2, 37, y + 2, C.steel);
    c.line(6, y + 3, 30, y + 11, C.steel);
    c.line(33, y + 3, 9, y + 11, C.iron);
    c.col(5, y + 3, y + 11, C.steel);
    c.col(34, y + 3, y + 11, C.steel);
    c.row(y + 9, 5, 34, C.iron);
    for (const x of [4, 33]) {
      c.rect(x, y + 12, x + 2, y + 13, C.black);
      c.set(x + 1, y + 12, C.steel);
    }
    c.line(37, y - 2, 39, y - 3, C.steel);
    c.col(37, y - 2, y, C.steel);
  };
  def('gurney', 42, 20, (c) => {
    gurney(c, 5);
    c.rect(3, 3, 8, 4, C.white);
  }, solid);
  def('gurney-body', 42, 22, (c) => {
    gurney(c, 7);
    const sh = hex('#bdbaa8');
    c.poly([[2, 7], [3, 4], [6, 2], [9, 4], [12, 3], [26, 4], [32, 2], [34, 3], [36, 7]], sh);
    c.line(3, 4, 6, 2, C.white);
    c.line(12, 3, 26, 4, C.white);
    c.line(10, 5, 14, 7, dark(sh));
    c.line(22, 5, 27, 7, dark(sh));
    c.poly([[10, 8], [12, 11], [14, 8]], sh);
    c.rect(35, 3, 37, 5, hex('#a9a890')); // a foot, with a tag
    c.set(38, 6, C.paper);
    c.set(38, 5, K);
    c.set(19, 4, bloodDark);
    c.set(20, 5, bloodDark);
  }, solid);
  def('operating-table', 42, 38, (c) => {
    c.rect(3, 20, 36, 21, C.steel);
    c.row(20, 3, 36, lite(C.steel));
    c.rect(4, 18, 35, 19, hex('#59624e')); // pad
    c.row(18, 4, 35, hex('#6e775f'));
    c.rect(5, 16, 10, 17, hex('#59624e'));
    for (const x of [14, 24, 31]) {
      c.rect(x, 17, x + 1, 22, leather); // straps
      c.set(x, 20, C.brass);
    }
    c.rect(18, 22, 22, 33, C.iron);
    c.col(18, 22, 33, C.steel);
    c.rect(12, 34, 28, 35, C.iron);
    c.row(34, 12, 28, C.steel);
    c.set(25, 27, C.steel);
    c.row(27, 23, 25, C.steel);
    c.col(38, 4, 35, C.iron); // lamp pole
    c.row(35, 35, 40, C.iron);
    c.row(4, 20, 38, C.iron);
    c.col(20, 4, 6, C.iron);
    c.poly([[13, 9], [16, 6], [24, 6], [27, 9]], C.steel);
    c.row(6, 16, 24, lite(C.steel));
    c.row(10, 14, 26, C.glow);
    c.set(8, 21, C.blood);
    c.col(8, 22, 23, C.blood);
  }, solid);
  def('electric-chair', 20, 34, (c) => {
    c.rect(4, 5, 6, 30, C.wood); // back
    c.col(4, 5, 30, C.woodLight);
    c.rect(7, 7, 8, 18, C.woodDark);
    c.rect(4, 19, 15, 21, C.wood); // seat
    c.row(19, 4, 15, C.woodLight);
    c.rect(14, 22, 15, 30, C.wood);
    c.rect(7, 13, 15, 14, C.wood); // arm
    c.row(13, 7, 15, C.woodLight);
    c.col(14, 15, 18, C.woodDark);
    c.rect(11, 12, 12, 15, leather); // straps
    c.set(11, 13, C.brass);
    c.rect(13, 25, 16, 26, leather);
    c.set(15, 25, C.brass);
    c.rect(7, 9, 9, 10, leather);
    pat(c, 6, 2, ['.ttt.', 'ttttt', 't...t']); // the cap
    c.line(8, 1, 3, 1, K); // wires
    c.line(3, 1, 2, 8, K);
    c.line(2, 8, 2, 30, K);
    c.rect(1, 24, 3, 28, C.ironDark);
    c.set(2, 25, C.red);
    c.rect(2, 31, 18, 32, C.woodDark); // platform
    c.row(31, 2, 18, C.wood);
  }, solid);
  const ironBed = (c, y, mat) => {
    for (const x of [2, 37]) {
      c.col(x, y - 7 + (x > 20 ? 3 : 0), y + 9, C.iron);
      c.set(x, y - 8 + (x > 20 ? 3 : 0), C.brass);
    }
    c.col(4, y - 5, y, C.iron);
    c.row(y - 5, 2, 4, C.iron);
    c.col(35, y - 2, y, C.iron);
    c.row(y - 2, 35, 37, C.iron);
    c.rect(3, y, 36, y + 2, mat);
    c.row(y, 3, 36, lite(mat));
    c.row(y + 2, 3, 36, dark(mat));
    c.rect(3, y + 3, 36, y + 3, C.ironDark);
    c.rect(2, y + 4, 37, y + 4, C.iron);
  };
  def('restraint-bed', 40, 22, (c) => {
    ironBed(c, 10, hex('#9a957e'));
    c.rect(4, 8, 9, 9, C.white);
    for (const x of [12, 21, 30]) {
      c.rect(x, 9, x + 1, 14, leather);
      c.col(x, 9, 14, lite(leather));
      c.set(x, 11, C.brass);
      c.set(x + 1, 11, C.brass);
    }
    c.speckle(3, 10, 36, 12, hex('#6e5a44'), 9, 5);
    c.speckle(1, 1, 38, 20, C.rust, 14, 2);
  }, solid);
  def('cell-bunk', 40, 22, (c) => {
    chain(c, 3, 1, 10);
    chain(c, 36, 1, 10);
    c.set(3, 1, C.ironDark);
    c.set(36, 1, C.ironDark);
    c.rect(2, 11, 37, 12, C.wood);
    c.row(11, 2, 37, C.woodLight);
    c.row(13, 3, 36, C.woodDark);
    const tk = hex('#8f8c7c');
    c.rect(4, 9, 35, 10, tk); // thin mattress
    for (let x = 5; x <= 35; x += 3) c.col(x, 9, 10, C.slate);
    c.rect(26, 7, 34, 8, C.slate); // folded blanket
    c.row(7, 26, 34, lite(C.slate));
    for (const x of [4, 34]) {
      c.rect(x, 14, x + 1, 20, C.iron);
      c.line(x + 2, 14, x + 5, 14, C.ironDark);
    }
  }, solid);
  const flies = (c, pts) => pts.forEach(([x, y], i) => (c.set(x, y, K), c.set(x + (i % 2 ? 1 : -1), y - 1, C.ash)));
  def('slop-bucket', 12, 15, (c) => {
    c.poly([[2, 6], [9, 6], [8, 13], [3, 13]], C.iron);
    c.row(6, 2, 9, C.steel);
    c.row(7, 3, 8, hex('#4a3c22'));
    c.row(10, 3, 8, C.ironDark);
    c.col(3, 7, 13, C.steel);
    c.speckle(2, 6, 9, 13, C.rust, 5, 2);
    c.set(1, 7, C.ironDark);
    c.set(10, 7, C.ironDark);
    c.set(9, 11, hex('#4a3c22'));
    finish(c);
    flies(c, [[3, 2], [7, 1], [9, 3], [5, 4]]);
  }, raw);
  def('iv-stand', 12, 38, (c) => {
    c.col(5, 2, 34, C.steel);
    c.row(2, 3, 8, C.steel);
    c.set(3, 3, C.steel);
    c.set(8, 3, C.steel);
    c.row(35, 2, 9, C.iron);
    c.set(2, 36, C.black);
    c.set(9, 36, C.black);
    c.set(5, 36, C.black);
    c.rect(7, 4, 9, 10, C.glassLight); // the bag
    c.rect(7, 7, 9, 10, hex('#8a7a52'));
    c.col(8, 11, 20, C.glass); // tube
    c.line(8, 20, 10, 26, C.glass);
    c.col(10, 26, 30, C.glass);
    c.speckle(2, 2, 9, 36, C.rust, 8, 2);
  });
  def('dentist-chair', 28, 34, (c) => {
    const lt = hex('#4e2a24');
    c.poly([[3, 6], [6, 5], [10, 17], [7, 18]], lt); // back, reclined
    c.rect(2, 2, 5, 5, lt); // headrest
    c.set(2, 2, lite(lt));
    c.rect(7, 16, 17, 18, lt); // seat
    c.row(16, 8, 17, lite(lt));
    c.poly([[17, 16], [22, 22], [20, 23], [16, 18]], lt); // leg rest
    c.rect(20, 23, 24, 24, C.iron);
    c.row(13, 8, 14, C.iron); // arm
    c.col(14, 13, 16, C.iron);
    c.rect(10, 19, 13, 29, C.iron); // pedestal
    c.col(10, 19, 29, C.steel);
    c.rect(6, 30, 18, 31, C.iron);
    c.row(30, 6, 18, C.steel);
    c.col(24, 3, 31, C.iron); // the drill
    c.row(31, 22, 26, C.iron);
    c.line(24, 3, 17, 6, C.steel);
    c.line(17, 6, 14, 10, C.steel);
    c.set(14, 11, C.white);
    c.line(24, 8, 19, 11, K);
    c.rect(22, 13, 26, 13, C.steel); // tray
    c.set(23, 12, C.white);
    c.set(25, 12, C.blood);
    c.speckle(6, 19, 26, 31, C.rust, 10, 2);
  }, solid);
  def('whipping-post', 14, 38, (c) => {
    c.rect(5, 2, 8, 35, C.wood);
    c.col(5, 2, 35, C.woodLight);
    c.col(8, 2, 35, C.woodDark);
    c.col(7, 8, 30, C.woodDark);
    c.row(1, 6, 7, C.wood);
    c.rect(4, 5, 9, 6, C.iron); // band and ring
    chain(c, 3, 7, 13);
    chain(c, 10, 7, 12);
    pat(c, 2, 14, ['I.I', 'I.I', '.I.'].slice(0, 2));
    pat(c, 9, 13, ['I.I', 'I.I']);
    c.rect(5, 16, 6, 18, bloodDark);
    c.set(6, 21, bloodDark);
    c.set(5, 24, bloodDark);
    block(c, 3, 34, 10, 36, C.stoneDark);
  }, solid);
  def('rat-trap', 12, 6, (c) => {
    c.rect(1, 3, 10, 4, C.woodPale);
    c.row(4, 1, 10, C.wood);
    c.row(2, 2, 6, C.steel);
    c.set(2, 2, C.iron);
    c.line(6, 2, 8, 1, C.steel);
    c.rect(8, 2, 9, 2, C.mustard);
  });
  def('rat-dead', 14, 8, (c) => {
    pat(c, 1, 1, ['..x..x......', '..x..x......', '.SSSSSSx....', 'SSaSSSSS....', 'KSSSSSSSxx..', '.SSSSSS...xx'], { ...P, S: hex('#5e5650'), a: hex('#7a7068'), x: hex('#a88a7c') });
  });
  def('flies-swarm', 16, 14, (c) => {
    flies(c, [[2, 5], [5, 2], [7, 7], [10, 3], [12, 8], [4, 10], [9, 11], [13, 4], [6, 5], [11, 12], [2, 8]]);
  }, raw);
  def('cobweb-large', 28, 28, (c) => {
    const R = [7, 13, 19, 25],
      A = [0, 0.3, 0.62, 0.95, 1.27, Math.PI / 2];
    for (const a of A) c.line(0, 0, Math.cos(a) * 26, Math.sin(a) * 26, web);
    for (const r of R)
      for (let i = 0; i < A.length - 1; i++) {
        const k = 0.86; // the threads sag towards the corner
        const p = [Math.cos(A[i]) * r, Math.sin(A[i]) * r],
          q = [Math.cos(A[i + 1]) * r, Math.sin(A[i + 1]) * r],
          m = [((p[0] + q[0]) / 2) * k, ((p[1] + q[1]) / 2) * k];
        c.line(p[0], p[1], m[0], m[1], web);
        c.line(m[0], m[1], q[0], q[1], web);
      }
    pat(c, 12, 14, ['K.K', '.K.', 'K.K']);
  }, flat);
  def('cobweb-hanging', 30, 18, (c) => {
    c.row(0, 0, 29, web);
    const xs = [1, 5, 9, 14, 18, 23, 28],
      ls = [8, 14, 6, 16, 9, 12, 5];
    xs.forEach((x, i) => {
      c.line(x, 0, x + (i % 2 ? 1 : -1), ls[i], web);
      if (i < xs.length - 1) {
        const m = Math.min(ls[i], ls[i + 1]) - 2,
          x2 = xs[i + 1];
        c.line(x, m - 2, (x + x2) >> 1, m, web);
        c.line((x + x2) >> 1, m, x2, m - 2, web);
        c.line(x, 2, (x + x2) >> 1, 4, web);
        c.line((x + x2) >> 1, 4, x2, 2, web);
      }
    });
    c.speckle(0, 0, 29, 17, C.ash, 4, 3);
  }, flat);
  def('spider-thread', 7, 20, (c) => {
    c.col(3, 0, 14, web);
    pat(c, 0, 14, ['K.KKK.K', '.KKKKK.', 'K.KKK.K', 'K..K..K'].map((r) => r));
    c.set(2, 16, C.red);
    c.set(4, 16, C.red);
  }, flat);
  def('cobweb-doorway', 20, 38, (c) => {
    const cx = 9,
      cy = 16,
      ends = [[0, 0], [9, 0], [19, 0], [19, 12], [19, 26], [19, 37], [10, 37], [0, 37], [0, 24], [0, 10]];
    for (const [x, y] of ends) c.line(cx, cy, x, y, web);
    for (const k of [0.2, 0.4, 0.62, 0.85])
      for (let i = 0; i < ends.length; i++) {
        const a = ends[i],
          b = ends[(i + 1) % ends.length];
        if (k > 0.8 && i === 5) continue; // torn
        c.line(cx + (a[0] - cx) * k, cy + (a[1] - cy) * k, cx + (b[0] - cx) * k, cy + (b[1] - cy) * k, web);
      }
    c.speckle(0, 0, 19, 37, C.ash, 5, 2);
    pat(c, 12, 22, ['K.K', '.K.', 'K.K']);
  }, flat);
  def('floor-hole-boards', 32, 12, (c) => {
    c.oval(3, 3, 28, 9, C.night);
    c.rect(1, 2, 30, 2, null);
    const r = rnd(8);
    for (let x = 2; x <= 29; x += 3) {
      const up = 1 + ((r() * 3) | 0),
        dn = 1 + ((r() * 3) | 0);
      c.rect(x, 1, x + 1, 1 + up + (Math.abs(x - 15) > 9 ? 3 : 0), x % 2 ? C.wood : C.woodLight);
      c.rect(x, 10 - dn - (Math.abs(x - 15) > 9 ? 3 : 0), x + 1, 10, x % 2 ? C.woodLight : C.wood);
    }
    c.line(12, 6, 17, 4, C.woodDark); // a board hangs down inside
    c.line(12, 7, 17, 5, mix(C.woodDark, 0.7));
  }, soft);
  def('wall-hole', 24, 19, (c) => {
    const brick = hex('#7a4032');
    c.poly([[3, 9], [5, 4], [10, 1], [16, 2], [21, 6], [22, 12], [18, 16], [11, 17], [5, 15]], brick);
    for (let y = 1; y <= 17; y++) for (let x = 1; x <= 22; x++) if (c.get(x, y) && (y % 3 === 0 || (x + ((y / 3) | 0) * 3) % 6 === 0)) c.set(x, y, dark(brick));
    c.poly([[6, 9], [8, 5], [12, 4], [16, 5], [19, 8], [18, 13], [13, 15], [8, 13]], C.night);
    c.line(10, 1, 9, 0, C.slate);
    c.line(21, 6, 23, 4, C.slate);
    c.line(5, 15, 2, 17, C.slate);
    pat(c, 8, 17, ['.a.a', 'aaa.'].slice(0, 1));
  }, soft);
  def('loose-floorboard', 26, 10, (c) => {
    c.rect(2, 6, 22, 8, C.night); // the gap
    c.poly([[1, 6], [22, 1], [23, 3], [3, 8]], C.woodLight); // the board, lifted
    c.line(3, 8, 23, 3, C.wood);
    c.line(2, 7, 23, 2, C.woodPale);
    c.set(21, 2, C.iron);
    c.set(4, 6, C.iron);
    c.rect(14, 7, 17, 8, C.parchment); // something hidden
    c.set(18, 8, C.gold);
    c.row(8, 2, 22, mix(C.woodDark, 0.6));
    c.rect(14, 7, 17, 7, C.paper);
  }, soft);
  def('peephole', 11, 9, (c) => {
    c.oval(2, 2, 8, 6, K);
    c.rect(4, 3, 6, 5, C.white);
    c.set(5, 4, hex('#3e5a3a'));
    c.set(3, 4, C.white);
    c.set(7, 4, C.white);
    c.set(5, 3, C.white);
    c.row(3, 4, 6, dark(C.flesh));
    c.line(1, 1, 2, 2, C.slate);
    c.line(8, 6, 10, 8, C.slate);
    c.line(8, 2, 9, 0, C.slate);
  }, flat);
  def('rat-hole', 12, 9, (c) => {
    c.oval(2, 1, 9, 12, K);
    c.clearRect(0, 8, 11, 12);
    c.set(4, 5, C.glow);
    c.set(7, 5, C.glow);
    c.set(1, 7, C.woodLight);
    c.set(10, 7, C.woodPale);
    c.set(11, 6, C.woodPale);
  }, flat);
  def('bones-small', 15, 8, (c) => {
    pat(c, 1, 1, ['.bb..........', 'bKbb.b.b.b...', 'bbbbbbbbbbbbb', '.BB..b.b.b..b', '.....b.b.b...', '....b.....b..']);
  });
  def('skeleton-chained', 26, 28, (c) => {
    c.rect(2, 1, 3, 2, C.iron); // ring in the wall
    chain(c, 3, 3, 8);
    skull(c, 5, 6);
    pat(c, 3, 8, ['b', 'b', '.b', '.b']); // the arm, held up
    pat(c, 5, 13, ['..bbb..', 'bbbbbbb', 'b.bBb.b', 'bbbbbbb', 'b.bBb.b', 'bbbbbbb', 'b..B..b', 'b.bBb.b', 'B.bbb.b', '..bbbbbb'].map((r) => r));
    c.row(23, 7, 22, C.bone); // legs along the floor
    c.row(25, 8, 16, C.bone);
    c.line(16, 25, 19, 21, C.bone);
    c.line(19, 21, 22, 25, C.bone);
    pat(c, 22, 21, ['b.', 'bb', 'b.'].slice(0, 3));
    c.set(23, 25, C.bone);
    c.set(24, 25, C.bone);
    c.rect(14, 22, 15, 24, C.iron); // leg iron
    chain(c, 12, 22, 22);
    c.row(26, 4, 12, dark(C.bone));
    pat(c, 4, 22, ['B', 'b', 'b']);
  });
  def('hanging-cage', 15, 44, (c) => {
    chain(c, 7, 0, 8);
    c.rect(3, 12, 11, 40, C.night);
    cagedBones(c, 5, 22);
    c.poly([[2, 12], [7, 8], [12, 12]], C.iron);
    cageBars(c, 2, 12, 12, 40);
    c.row(41, 3, 11, C.ironDark);
    c.speckle(2, 9, 12, 41, C.rust, 9, 3);
  }, solid);

  /* ================= THE OTHER PICTURES OF EACH THING: side, used, side + used (see make-big.js) ================= */
  const V = (slug, v) => {
    if (!S[slug]) throw new Error('views for ' + slug + ', which is not drawn here');
    S[slug].views = v;
  };
  const pic = (w, h, draw, o) => ({ w, h, draw, ...o });
  const on = (from, draw, o) => ({ from, draw, ...o });
  /** The picture of another sprite of this file, as a view. */
  const same = (slug) => ({ w: S[slug].w, h: S[slug].h, draw: S[slug].draw, shade: S[slug].shade, outline: S[slug].outline });
  /** The finished picture of a sprite of this file (shaded and outlined), to stamp or to turn. */
  const done = (d) => {
    if (typeof d === 'string') d = S[d];
    const c = canvas(d.w, d.h);
    if (d.draw(c) !== false) {
      if (d.shade !== false) c.shade();
      if (d.outline !== false) c.outline();
    }
    return c;
  };
  /** A picture turned a quarter: fallen over to the right (cw) or to the left. */
  const turned = (src, cw = true) => {
    const o = canvas(src.h, src.w);
    for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) if (src.get(x, y)) o.px[(cw ? x : src.w - 1 - x) * o.w + (cw ? src.h - 1 - y : y)] = src.get(x, y);
    return o;
  };
  const fallen = (slug, cw = true) => {
    const t = turned(done(slug), cw);
    return { w: t.w, h: t.h, shade: false, outline: false, draw: (c) => c.stamp(t, 0, 0) };
  };
  /** Move everything in the box by dx, dy (on a copy: to push a lid aside). */
  const shove = (c, x0, y0, x1, y1, dx, dy = 0) => {
    const t = [];
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++)
        if (c.get(x, y)) {
          t.push([x + dx, y + dy, c.get(x, y)]);
          c.clear(x, y);
        }
    for (const [x, y, p] of t) c.set(x, y, p);
  };
  /** Splinters of glass on the floor. */
  const shards = (c, x, y) => pat(c, x, y, ['.w..J', 'J.Jw.']);
  const smoke = (c, x, y) => {
    c.set(x, y, C.ash);
    c.set(x + 1, y - 1, C.ash);
    c.set(x, y - 2, dark(C.ash));
  };

  /* --- coffins: lying ones are drawn from their long side; their front view runs away from the viewer --- */
  const hexa = (c, cx, y0, d, hw, col, skew = 0) => {
    const sh = Math.round(d * 0.28),
      nh = Math.max(2, hw - 3),
      s = (y) => Math.round((skew * y) / d);
    c.poly([[cx - nh, y0], [cx + nh, y0], [cx + hw + s(sh), y0 + sh], [cx + nh + skew, y0 + d - 1], [cx - nh + skew, y0 + d - 1], [cx - hw + s(sh), y0 + sh]], col);
  };
  const pale = hex('#b9b8a4');
  /** A coffin seen from its foot end and a little from above; the head is at the top. */
  const coffinFront = (c, cx, y0, d, hw, o = {}) => {
    const col = o.col || C.wood,
      nh = Math.max(2, hw - 3),
      sh = y0 + Math.round(d * 0.28);
    if (o.lid) {
      const lx = cx + hw * 2 + 2; // the lid, taken off and leaning against the far side
      hexa(c, lx, y0 + 2, d, hw - 1, dark(col), -2);
      hexa(c, lx, y0, d, hw - 1, o.lidCol || C.woodDark, -2);
      c.line(lx - hw + 1, sh, lx - nh + 1, y0, col);
      c.line(lx - hw + 1, sh, lx - nh - 1, y0 + d - 1, col);
      c.col(lx - 1, y0 + 3, y0 + Math.round(d * 0.6), o.cross || C.brass);
      c.row(sh, lx - 3, lx + 1, o.cross || C.brass);
    }
    hexa(c, cx, y0 + 3, d, hw, dark(col)); // the sides
    c.rect(cx - nh, y0 + d, cx + nh, y0 + d + 2, col); // the foot end
    c.row(y0 + d + 2, cx - nh, cx + nh, dark(col));
    c.set(cx, y0 + d + 1, C.brass);
    hexa(c, cx, y0, d, hw, o.open ? col : lite(col));
    if (o.open) {
      const lin = o.lining || C.wine;
      hexa(c, cx, y0 + 1, d - 2, hw - 1, lin);
      c.row(y0 + 1, cx - nh + 1, cx + nh - 1, dark(lin));
      c.line(cx + hw - 1, sh, cx + nh - 1, y0 + d - 2, dark(lin));
      c.rect(cx - 2, y0 + 2, cx + 2, y0 + 4, C.white);
      c.row(y0 + 4, cx - 2, cx + 2, dark(C.white));
    } else {
      c.col(cx, y0 + 2, y0 + Math.round(d * 0.62), o.cross || C.brass);
      c.row(sh, cx - 3, cx + 3, o.cross || C.brass);
      c.line(cx - hw, sh, cx - nh, y0 + d - 1, col);
    }
  };
  /** The dead lying in the open coffin, seen from the foot end. */
  const deadFront = (c, cx, y0, d) => {
    c.rect(cx - 3, y0 + 6, cx + 3, y0 + d - 5, C.black);
    c.rect(cx - 2, y0 + d - 4, cx + 2, y0 + d - 3, C.black);
    c.rect(cx - 2, y0 + 2, cx + 2, y0 + 5, pale); // the face
    c.row(y0 + 2, cx - 2, cx + 2, C.ash);
    c.set(cx - 1, y0 + 4, K);
    c.set(cx + 1, y0 + 4, K);
    c.rect(cx - 1, y0 + 9, cx + 1, y0 + 10, pale); // hands crossed
    c.set(cx, y0 + 7, C.white);
  };
  /** An open coffin from its long side with the lid leaning behind it (as coffin-open). */
  const coffinOpenSide = (c, len, o = {}) => {
    const col = o.lidCol || C.woodDark;
    c.poly([[6, 9], [10, 1], [len, 2], [len + 2, 5], [len - 2, 9]], col);
    c.line(6, 9, 10, 1, lite(col));
    c.line(10, 1, len, 2, lite(col));
    c.row(5, 16, len - 8, o.cross || C.brass);
    c.col(19, 3, 7, o.cross || C.brass);
    coffin(c, 1, 8, len, { ...o, open: true });
  };
  V('coffin-shut', {
    base: 'side',
    side: pic(15, 31, (c) => coffinFront(c, 7, 1, 26, 6)),
    used: same('coffin-open'),
    sideUsed: pic(27, 31, (c) => coffinFront(c, 7, 1, 26, 6, { open: true, lid: true })),
  });
  V('coffin-open', {
    base: 'side',
    side: pic(27, 31, (c) => coffinFront(c, 7, 1, 26, 6, { open: true, lid: true })),
    used: same('coffin-shut'),
    sideUsed: pic(15, 31, (c) => coffinFront(c, 7, 1, 26, 6)),
  });
  V('coffin-body', {
    base: 'side',
    side: pic(15, 31, (c) => {
      coffinFront(c, 7, 1, 26, 6, { open: true });
      deadFront(c, 7, 1, 26);
    }),
    used: pic(40, 20, (c) => {
      // the dead has sat up
      coffin(c, 1, 10, 38, { open: true });
      c.rect(16, 10, 34, 12, C.black); // legs
      c.rect(33, 9, 35, 12, C.black);
      c.rect(11, 5, 15, 12, C.black); // the back, upright
      c.rect(16, 7, 21, 8, C.black); // an arm, reaching
      c.rect(22, 7, 23, 8, pale);
      c.oval(10, 1, 15, 5, pale);
      c.row(1, 11, 14, C.ash);
      c.set(14, 3, K);
      c.set(15, 6, C.white);
      c.row(13, 3, 37, C.wood);
    }),
    sideUsed: pic(15, 34, (c) => {
      coffinFront(c, 7, 4, 26, 6, { open: true });
      c.rect(4, 13, 10, 25, C.black); // legs
      c.rect(5, 26, 9, 27, C.black);
      c.rect(3, 6, 11, 14, C.black); // sitting up, facing us
      c.rect(5, 1, 9, 5, pale);
      c.row(1, 5, 9, C.ash);
      c.set(6, 3, K);
      c.set(8, 3, K);
      c.row(5, 6, 8, dark(pale));
      c.set(7, 6, C.white);
      c.rect(3, 15, 4, 16, pale); // hands on the rim
      c.rect(10, 15, 11, 16, pale);
    }),
  });
  const childCol = hex('#b4b0a0');
  V('coffin-child', {
    base: 'side',
    side: pic(11, 21, (c) => coffinFront(c, 5, 1, 16, 4, { col: childCol, cross: C.gold })),
    used: pic(26, 18, (c) => coffinOpenSide(c, 22, { col: childCol, lidCol: dark(childCol), cross: C.gold })),
    sideUsed: pic(20, 21, (c) => coffinFront(c, 5, 1, 16, 4, { col: childCol, cross: C.gold, open: true, lid: true, lidCol: dark(childCol) })),
  });
  /** The standing coffin from the side: its box against the wall, the lid in front (to the left). */
  const coffinUpSide = (c, x) => {
    c.rect(x, 2, x + 5, 39, C.woodDark); // the box
    c.col(x, 2, 39, C.night);
    c.col(x + 1, 2, 39, C.wood);
    c.row(2, x + 1, x + 5, C.wood);
    c.row(10, x + 2, x + 5, mix(C.woodDark, 0.8));
    c.row(40, x - 2, x + 5, C.woodDark);
  };
  V('coffin-upright', {
    side: pic(10, 42, (c) => {
      coffinUpSide(c, 4);
      c.rect(1, 1, 2, 39, C.wood); // the lid, ajar
      c.col(1, 1, 39, C.woodLight);
      c.set(1, 26, C.woodDark);
      c.set(1, 32, C.woodDark);
      pat(c, 2, 18, ['zz', 'zz', 'ZZ']); // the fingers
    }),
    used: pic(22, 42, (c) => {
      const shape = (dx, col) => c.poly([[5 + dx, 1], [11 + dx, 1], [14 + dx, 10], [11 + dx, 39], [5 + dx, 39], [2 + dx, 10]], col);
      shape(0, C.woodDark);
      c.poly([[5, 2], [11, 2], [13, 10], [10, 38], [6, 38], [3, 10]], C.night);
      c.line(5, 1, 2, 10, C.wood);
      c.line(2, 10, 5, 39, C.wood);
      c.rect(6, 4, 10, 8, pale); // the one inside
      c.row(4, 6, 10, C.ash);
      c.set(7, 6, K);
      c.set(9, 6, K);
      c.row(8, 7, 9, dark(pale));
      c.rect(5, 10, 11, 30, cloth);
      c.rect(6, 31, 10, 37, cloth);
      c.col(5, 10, 30, lite(cloth));
      pat(c, 6, 14, ['z...z', '.zzz.', '.z.z.']);
      c.poly([[16, 2], [19, 1], [20, 10], [19, 39], [16, 38], [15, 10]], C.wood); // the lid, swung wide
      c.line(16, 2, 15, 10, C.woodLight);
      c.line(15, 10, 16, 38, C.woodLight);
      c.col(18, 6, 22, C.brass);
      c.row(40, 4, 19, C.woodDark);
    }),
    sideUsed: pic(22, 42, (c) => {
      coffinUpSide(c, 16);
      c.poly([[2, 10], [5, 1], [11, 1], [14, 10], [11, 39], [5, 39]], C.woodDark); // the inside of the lid, swung out
      c.poly([[4, 10], [6, 3], [10, 3], [12, 10], [10, 37], [6, 37]], dark(C.wine));
      c.line(5, 1, 2, 10, C.wood);
      c.line(2, 10, 5, 39, C.wood);
      c.col(14, 2, 39, C.wood);
      c.set(15, 8, C.brass);
      c.set(15, 30, C.brass);
      pat(c, 14, 17, ['zz.', '.zz', 'ZZ.']);
      c.row(40, 4, 21, C.woodDark);
    }),
  });

  /* --- tombs, crypt lids, the mausoleum --- */
  /** A chest tomb seen from its end and a little from above: x0..x1 wide, the slab dep deep. */
  const tombFront = (c, x0, y0, x1, dep, o = {}) => {
    const yf = y0 + dep;
    if (o.open) {
      c.rect(x0 + 1, y0, x1 - 1, yf - 1, C.stone); // the walls
      c.rect(x0 + 2, y0 + 1, x1 - 2, yf - 1, C.night);
      c.col(x0 + 1, y0, yf - 1, C.stoneLight);
      block(c, x0 + 1, yf, x1 - 1, yf + 9);
    } else {
      block(c, x0, y0, x1, yf - 1);
      c.row(yf, x0, x1, C.stoneDark);
      c.speckle(x0 + 1, y0 + 1, x1 - 1, yf - 1, C.stoneDark, 12, 4);
      block(c, x0, yf, x1, yf + 2, C.stoneLight);
      c.row(yf + 2, x0, x1, C.stone);
      block(c, x0 + 1, yf + 3, x1 - 1, yf + 9);
    }
    c.frame(x0 + 3, yf + 5, x1 - 3, yf + 8, C.stoneDark);
    block(c, x0, yf + 10, x1, yf + 11);
    moss(c, x0, yf + 8, x1, yf + 11, 4);
  };
  /** The slab of a tomb, pushed askew over the open box. */
  const slabAskew = (c, x0, y0, x1, y1) => {
    c.poly([[x0, y0], [x1, y0 + 2], [x1 - 1, y1], [x0 - 1, y1 - 2]], C.stone);
    c.line(x0, y0, x1, y0 + 2, C.stoneLight);
    c.line(x0, y0, x0 - 1, y1 - 2, C.stoneLight);
    c.line(x0 - 1, y1 - 1, x1 - 1, y1 + 1, C.stoneLight);
    c.line(x0 - 1, y1, x1 - 1, y1 + 2, C.stone);
  };
  const bonesIn = (c, x, y) => {
    skull(c, x, y, true);
    pat(c, x, y + 6, ['bbbbb', '.bBb.', 'bbbbb', '.bBb.', 'bbbbb', '..b..', '.b.b.', '.b.b.']);
  };
  V('tomb-chest', {
    base: 'side',
    side: pic(18, 33, (c) => {
      tombFront(c, 1, 1, 16, 19);
      c.line(9, 1, 11, 6, C.stoneDark);
    }),
    used: same('tomb-cracked'),
    sideUsed: pic(22, 34, (c) => {
      tombFront(c, 1, 2, 16, 19, { open: true });
      slabAskew(c, 6, 1, 20, 17);
      c.line(13, 2, 14, 7, C.stoneDark);
    }),
  });
  V('tomb-cracked', {
    base: 'side',
    side: pic(22, 34, (c) => {
      tombFront(c, 1, 2, 16, 19, { open: true });
      slabAskew(c, 6, 1, 20, 17);
      c.line(13, 2, 14, 7, C.stoneDark);
      pat(c, 5, 25, ['K..', '.K.', '.KK', '..K'], { K: C.night });
    }),
    used: on('base', (c) => {
      // the lid heaved right off: it leans against the far end, and the bones lie bare
      shove(c, 9, 0, 39, 6, 8, 3);
      c.rect(2, 4, 31, 5, C.night);
      c.rect(1, 3, 32, 3, K);
      c.clearRect(0, 0, 33, 2);
      c.set(1, 4, K);
      c.set(1, 5, K);
      skull(c, 4, 1, true, { ...P, K: C.night });
      c.row(5, 10, 24, C.bone);
      for (let x = 11; x <= 19; x += 2) c.set(x, 4, C.bone);
      c.rect(26, 4, 27, 5, C.bone);
    }, { w: 44, h: 20, outline: true }),
    sideUsed: pic(24, 34, (c) => {
      tombFront(c, 1, 2, 16, 19, { open: true });
      bonesIn(c, 6, 4);
      c.poly([[18, 6], [22, 4], [22, 30], [18, 32]], C.stone); // the slab, leaning against the side
      c.col(18, 6, 32, C.stoneLight);
      c.line(18, 6, 22, 4, C.stoneLight);
    }),
  });
  /** The knight on his slab, seen from above; the head at the top. */
  const effigyTop = (c, x, y) =>
    pat(c, x, y, [
      '..llll..',
      '.llssll.',
      '.lsllsl.',
      '..llll..',
      '.lsssss.',
      'lssllssd',
      'lssllssd',
      'lsssdssd',
      '.lssdsd.',
      '.lssdsd.',
      '.lssdsd.',
      '.lssdsd.',
      '.lssdsd.',
      '.ls.dsd.',
      '.ll.lld.',
      '.ll.lld.',
    ]);
  V('tomb-effigy', {
    base: 'side',
    side: pic(18, 33, (c) => {
      tombFront(c, 1, 1, 16, 19);
      c.rect(2, 2, 15, 18, C.stoneDark);
      c.rect(2, 2, 14, 17, C.stone);
      effigyTop(c, 5, 2);
    }),
    used: on('base', (c) => {
      shove(c, 0, 0, 33, 9, 6);
      c.rect(2, 9, 5, 9, C.night);
      c.rect(2, 8, 5, 8, K);
      c.set(1, 9, K);
    }, { w: 40, h: 21 }),
    sideUsed: pic(22, 34, (c) => {
      tombFront(c, 1, 2, 16, 19, { open: true });
      slabAskew(c, 6, 1, 20, 17);
      effigyTop(c, 9, 2);
    }),
  });
  const cryptSlab = (c, x0, y0, x1, top, o = {}) => {
    // a slab in the ground from its narrow end: the top runs away from the viewer
    c.row(y0, x0 + 2, x1 - 2, C.stoneLight);
    c.rect(x0 + 1, y0 + 1, x1 - 1, y0 + top - 2, C.stoneLight);
    c.row(y0 + top - 1, x0, x1, C.stoneLight);
    c.rect(x0, y0 + top, x1, y0 + top + 2, C.stone);
    c.row(y0 + top + 2, x0, x1, C.stoneDark);
    const mx = (x0 + x1) >> 1;
    if (!o.noRing) pat(c, mx - 1, y0 + 1, ['.II.', 'I..I', 'I..I', '.II.']);
    c.line(x0 + 2, y0 + top - 3, x0 + 4, y0 + top - 2, C.stone);
    moss(c, x0, y0 + top, x1, y0 + top + 2, 4);
  };
  const cryptAjar = (c, hand) => {
    c.rect(1, 6, 28, 9, C.stone); // the rim
    c.row(6, 1, 28, C.stoneLight);
    c.rect(3, 6, 13, 8, C.night); // the dark below
    c.poly([[11, 5], [27, 2], [28, 4], [12, 7]], C.stoneLight); // the slab, pushed aside
    c.line(12, 7, 28, 4, C.stone);
    c.line(12, 8, 28, 5, C.stoneDark);
    pat(c, 19, 3, ['.II.', 'I..I'], P);
    if (hand) pat(c, 3, 3, ['.z.z...', 'z.z.z..', 'z.z.z..', 'zzzzz.z', '.zzzzz.', '..ZZ...']);
    moss(c, 14, 8, 28, 9, 3);
  };
  const cryptAjarFront = (c, hand) => {
    c.rect(1, 5, 16, 15, C.stone); // the rim
    c.row(5, 1, 16, C.stoneLight);
    c.rect(3, 9, 14, 13, C.night);
    c.row(15, 1, 16, C.stoneDark);
    c.poly([[2, 2], [15, 1], [16, 7], [3, 9]], C.stoneLight); // the slab, pushed back
    c.line(3, 9, 16, 7, C.stone);
    c.line(3, 10, 16, 8, C.stoneDark);
    pat(c, 8, 3, ['.II.', 'I..I', '.II.']);
    if (hand) pat(c, 5, 9, ['.z.z.', 'z.z.z', 'z.z.z', 'zzzzz', '.zzz.', '.ZZ..']);
    moss(c, 1, 14, 16, 15, 3);
  };
  V('crypt-lid', {
    side: pic(18, 14, (c) => cryptSlab(c, 1, 1, 16, 9)),
    used: pic(30, 11, (c) => cryptAjar(c, false)),
    sideUsed: pic(18, 17, (c) => cryptAjarFront(c, false)),
  });
  V('crypt-lid-ajar', {
    side: pic(18, 17, (c) => cryptAjarFront(c, true)),
    used: same('crypt-lid'),
    sideUsed: pic(18, 14, (c) => cryptSlab(c, 1, 1, 16, 9)),
  });
  /** The mausoleum from the side: its front, with the columns and the door, is to the left. */
  const mausoleumSide = (c, open) => {
    c.rect(4, 3, 19, 11, C.stone); // the roof, running back
    c.row(3, 4, 19, C.stoneLight);
    for (let y = 5; y <= 11; y += 2) c.row(y, 5, 19, C.stoneDark);
    c.poly([[2, 12], [4, 3], [5, 3], [5, 12]], C.stoneLight); // the pediment, edge on
    block(c, 2, 12, 20, 14, C.stoneLight);
    c.rect(9, 15, 19, 38, C.stone); // the side wall
    for (let y = 18; y <= 38; y += 5) c.row(y, 9, 19, C.stoneDark);
    for (let y = 15; y <= 38; y++) for (let x = 10; x <= 19; x++) if (y % 5 !== 3 && (x + ((y / 5) | 0) * 3) % 6 === 0) c.set(x, y, C.stoneDark);
    c.rect(7, 15, 8, 38, C.stoneDark); // the porch, in shadow
    c.rect(4, 15, 6, 38, C.stone); // the near column
    c.col(4, 15, 38, C.stoneLight);
    c.col(6, 16, 37, C.stoneDark);
    c.row(15, 4, 6, C.stoneLight);
    c.row(38, 4, 6, C.stoneLight);
    if (open) {
      c.rect(1, 20, 3, 38, C.ironDark); // the door, standing open
      c.col(1, 20, 38, C.iron);
      c.row(20, 1, 3, C.iron);
      c.set(2, 30, C.brass);
      c.rect(7, 20, 8, 38, C.night);
    } else {
      c.rect(7, 20, 8, 38, C.ironDark);
      c.col(7, 20, 38, C.iron);
    }
    block(c, 3, 39, 19, 40);
    block(c, 1, 41, 20, 42, C.stoneLight);
    moss(c, 1, 34, 20, 42, 5);
  };
  V('mausoleum-door', {
    side: pic(22, 44, (c) => mausoleumSide(c, false)),
    used: same('mausoleum-door-open'),
    sideUsed: pic(22, 44, (c) => mausoleumSide(c, true)),
  });
  V('mausoleum-door-open', {
    side: pic(22, 44, (c) => mausoleumSide(c, true)),
    used: same('mausoleum-door'),
    sideUsed: pic(22, 44, (c) => mausoleumSide(c, false)),
  });

  return S;
};
