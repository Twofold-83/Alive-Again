/* Horror, part 2: the instruments and the machines. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, dots, part, turn, chain, thin, hook, rusty, drip, pool, bars, ring, shadowed } = H;
  const RU = C.rust,
    RD = D(C.rust),
    RL = hex('#a3602f'),
    IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    BL = C.blood,
    BD = hex('#5c1418'),
    PALE = hex('#b8a894'),
    MEAT = hex('#8e3b38'),
    MEATL = hex('#b3625a'),
    NI = C.night,
    CE = hex('#6f6c68'),
    CL = hex('#8b8882'),
    CD = D(CE),
    FM = hex('#9a7566'),
    W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    FLAME = C.flame,
    FLL = C.flameLight,
    CHAR = hex('#2a2224');

  /* ---------- the wall of dolls ---------- */
  function doll(c, x, y, col, o = {}) {
    c.rect(x + 1, y, x + 3, y + 2, o.head || C.bone);
    c.row(y, x + 1, x + 3, o.hair || WD);
    c.set(x + 1, y + 1, o.eye || NI);
    c.set(x + 3, y + 1, o.eye || NI);
    c.rect(x + 1, y + 3, x + 3, y + 6, col);
    c.row(y + 6, x, x + 4, D(col));
    if (!o.noArmL) c.set(x, y + 3, C.bone);
    c.set(x + 4, y + 3, C.bone);
    c.set(x + 1, y + 7, C.bone);
    if (!o.noLeg) c.set(x + 3, y + 7, C.bone);
    c.set(x + 2, y + 4, ST); // the nail
  }
  const DOLLS = [
    [4, 5, C.wine, {}],
    [13, 4, C.navy, { hair: C.straw }],
    [22, 6, C.mustard, { noLeg: 1 }],
    [3, 18, C.teal, { hair: C.black, noArmL: 1 }],
    [12, 17, hex('#8a5560'), { hair: C.rust }],
    [21, 19, C.slate, {}],
    [8, 29, C.plum, { hair: C.straw }],
    [18, 30, C.forest, { head: D(C.bone) }],
  ];
  function slab(c, x0, y0, x1, y1, seed) {
    c.rect(x0, y0, x1, y1, CE);
    c.col(x0, y0, y1, CL);
    c.row(y0, x0, x1, CL);
    c.speckle(x0, y0, x1, y1, CD, 22, seed);
    c.speckle(x0, y0, x1, y1, CL, 30, seed + 3);
  }
  O('wall-nailed-dolls', 'cement wall with dolls nailed to it nails toys children shrine creepy', {
    w: 30,
    h: 42,
    f(c, u) {
      const b = 40;
      slab(c, 1, 2, 28, b, 2);
      c.line(20, 2, 17, 12, CD);
      c.line(17, 12, 19, 16, CD);
      c.line(6, 27, 3, 38, CD);
      DOLLS.forEach(([x, y, col, o], i) => {
        if (u && i === 4) {
          c.set(x + 2, y + 4, ST); // only the nail is left
          c.col(x + 2, y + 5, y + 9, BD);
          c.set(x + 1, y + 6, BD);
          return;
        }
        doll(c, x, y, col, u ? { ...o, eye: C.red } : o);
        if (i % 3 === 1) c.col(x + 2, y + 8, y + 10, mix(CE, 0.75));
      });
      if (u) {
        const t = part(5, 8, (t) => doll(t, 0, 0, hex('#8a5560'), { hair: C.rust, eye: C.red }));
        c.stamp(turn(t), 11, b - 4);
        c.set(13, b - 2, CE);
      }
    },
    sw: 12,
    s(c, u) {
      const b = 40;
      slab(c, 1, 2, 5, b, 2);
      c.col(5, 2, b, CD);
      DOLLS.forEach(([x, y, col, o], i) => {
        if (i % 2) return;
        if (u && i === 4) return void c.col(6, y + 5, y + 9, BD);
        c.rect(6, y, 7, y + 2, o.head || C.bone);
        c.row(y, 6, 7, o.hair || WD);
        c.set(7, y + 1, u ? C.red : NI);
        c.rect(6, y + 3, 7, y + 6, col);
        c.set(8, y + 6, D(col));
        c.set(6, y + 7, C.bone);
        c.set(8, y + 4, ST);
      });
      if (u) {
        c.rect(7, b - 1, 10, b, hex('#8a5560'));
        c.rect(5 + 1, b - 1, 7, b, C.bone);
        c.set(6, b - 1, C.rust);
      }
    },
  });

  /* ---------- flesh ---------- */
  function face(c, x, y, u, col = PALE) {
    c.oval(x, y, x + 4, y + 5, col);
    c.set(x + 1, y + 2, u ? C.glow : NI);
    c.set(x + 3, y + 2, u ? C.glow : NI);
    c.set(x + 2, y + 4, NI);
    if (u) c.set(x + 2, y + 5, NI);
  }
  function fused(c, x0, x1, y0, y1, seed, faces, u) {
    const r = rnd(seed),
      w = x1 - x0 + 1;
    c.rect(x0, y0, x1, y1, FM);
    for (let i = 0; i < w * 0.9; i++) {
      const x = x0 + ((r() * (w - 4)) | 0),
        y = y0 + ((r() * (y1 - y0 - 6)) | 0),
        d = 2 + ((r() * 4) | 0);
      c.oval(x, y, x + d, y + d + 3, i % 3 ? L(FM) : blend(FM, PALE, 0.6));
      c.line(x + d, y + 1, x + d, y + d + 3, D(FM));
      c.set(x + (d >> 1), y + d + 3, D(FM));
    }
    for (let i = 0; i < w * 0.7; i++) {
      const x = x0 + ((r() * w) | 0),
        y = y0 + ((r() * (y1 - y0 - 6)) | 0);
      c.col(x, y, y + 2 + ((r() * 5) | 0), mix(FM, 0.5));
    }
    for (let y = y0; y <= y1; y++) {
      if (r() < 0.3) c.clear(x0, y);
      if (r() < 0.3) c.clear(x1, y);
    }
    c.col(x0 + 1, y0, y1, L(FM));
    for (const [x, y] of faces) face(c, x, y, u);
  }
  O('pillar-fused-bodies', 'pillar of fused bodies flesh column faces limbs melted together abstract horror', {
    w: 18,
    h: 48,
    uw: 25,
    f(c, u) {
      const b = 46;
      fused(c, 3, 14, 1, b, 5, [[5, 6], [9, 19], [4, 31]], u);
      c.col(13, 24, 33, PALE); // a hanging arm
      c.set(13, 34, D(PALE));
      c.rect(2, b - 1, 15, b, mix(FM, 0.6));
      if (u) {
        c.row(13, 14, 21, PALE); // one reaches out
        c.row(14, 14, 20, D(PALE));
        c.rect(21, 12, 22, 14, PALE);
        dots(c, PALE, [23, 11, 23, 13, 23, 15]);
      }
      return () => u && dots(c, BL, [8, b + 1, 12, b + 1]);
    },
    sw: 14,
    suw: 14,
    s(c, u) {
      const b = 46;
      fused(c, 3, 10, 1, b, 11, [[4, 12], [5, 34]], u);
      c.col(4, 20, 28, PALE);
      c.set(4, 29, D(PALE));
      c.rect(2, b - 1, 11, b, mix(FM, 0.6));
      if (u) {
        c.rect(6, 22, 9, 25, PALE); // the hand comes at you
        dots(c, PALE, [6, 21, 8, 21, 9, 21, 5, 23]);
        c.rect(7, 26, 8, 27, D(PALE));
        c.set(7, 24, D(PALE));
      }
    },
  });

  /* ---------- the box ---------- */
  const LACQ = hex('#2b1c1e');
  function plinth(c, x0, x1, y0, b) {
    c.rect(x0 + 1, y0, x1 - 1, b, CE);
    c.rect(x0, y0, x1, y0 + 1, CL);
    c.rect(x0, b - 1, x1, b, CE);
    c.row(y0 + 2, x0 + 1, x1 - 1, CD);
    c.col(x0 + 1, y0 + 3, b - 2, CL);
    c.speckle(x0, y0, x1, b, CD, 18, 4);
  }
  function puzzleBox(c, x, y, side) {
    c.rect(x, y, x + 5, y + 5, LACQ);
    c.frame(x, y, x + 5, y + 5, C.brass);
    if (side) {
      c.line(x + 1, y + 1, x + 4, y + 4, C.gold);
      c.set(x + 4, y + 1, C.gold);
      c.set(x + 1, y + 4, C.gold);
    } else {
      c.rect(x + 2, y + 2, x + 3, y + 3, C.gold);
      c.set(x + 1, y + 1, C.brass);
      c.set(x + 4, y + 4, C.brass);
    }
  }
  const boxDef = (side) => (c, u) => {
    const b = 30;
    plinth(c, 3, 12, 14, b);
    if (side) c.line(9, 16, 7, 24, CD);
    if (!u) return void puzzleBox(c, 5, 8, side);
    // opened: it turns in the air, and the light and the chains come
    c.poly([[8, 3], [11, 6], [8, 9], [4, 6]], LACQ);
    c.line(8, 3, 11, 6, C.brass);
    c.line(11, 6, 8, 9, C.brass);
    c.line(8, 9, 4, 6, C.gold);
    c.line(4, 6, 7, 3, C.gold);
    c.set(side ? 7 : 8, 6, C.glow);
    c.set(side ? 9 : 6, side ? 6 : 5, C.gold);
    return () => {
      const g = hex('#9fb6c9');
      dots(c, g, [7, 11, 8, 12, 7, 13, 2, 3, 1, 1, 13, 2, 14, 9, 1, 9]);
      dots(c, C.ghost, [8, 11, 7, 1, 13, 5]);
      thin(c, 14, 1, 7, IR);
      c.set(13, 8, ST);
      thin(c, 1, 11, 16, IR);
      c.set(2, 17, ST);
    };
  };
  O('puzzle-box-plinth', 'puzzle box on a cement plinth lacquer gold lament configuration pedestal cursed', {
    w: 16,
    h: 32,
    f: boxDef(false),
    sw: 16,
    s: boxDef(true),
  });

  /* ---------- the rack ---------- */
  O('torture-rack', 'torture rack wooden stretching table rollers ropes winch dungeon', {
    w: 46,
    h: 24,
    base: 'side',
    f(c, u) {
      const b = 22;
      c.rect(4, 11, 41, 13, W);
      c.row(11, 4, 41, WL);
      c.row(13, 4, 41, WD);
      for (const x of [6, 37]) {
        c.rect(x, 14, x + 2, b, W);
        c.col(x, 14, b, WL);
      }
      c.row(18, 9, 36, WD);
      for (const x of [2, 39]) {
        c.oval(x, 7, x + 4, 11, WD); // rollers
        c.set(x + 2, 9, IR);
        c.set(x + 1, 8, W);
      }
      // the ratchet lever at the head end
      if (u) c.line(4, 9, 1, 2, IR);
      else c.line(4, 9, 9, 3, IR);
      c.set(u ? 1 : 9, u ? 1 : 2, W);
      c.speckle(4, 11, 41, b, WD, 9, 2);
      const R = C.straw;
      if (u) {
        c.row(10, 7, 14, R);
        c.row(10, 31, 38, R);
        c.rect(15, 9, 16, 10, IR);
        c.rect(29, 9, 30, 10, IR);
        c.row(11, 17, 28, BL);
        dots(c, BD, [19, 12, 23, 12, 26, 12, 21, 13]);
      } else {
        dots(c, R, [7, 10, 8, 10, 9, 9, 10, 10, 11, 10, 12, 9, 13, 10, 32, 10, 33, 9, 34, 10, 35, 10, 36, 9, 37, 10]);
        c.rect(14, 9, 15, 10, IR);
        c.rect(30, 9, 31, 10, IR);
        dots(c, BD, [20, 11, 24, 11]);
      }
      return () => u && (drip(c, 22, 14, 3), drip(c, 26, 14, 1), pool(c, 18, 27, b));
    },
    sw: 20,
    sh: 30,
    s(c, u) {
      const b = 28;
      c.rect(2, 8, 17, 21, W); // the bed, running away
      for (const x of [6, 10, 14]) c.col(x, 8, 21, WD);
      c.col(2, 8, 21, WL);
      c.rect(1, 4, 18, 7, WD); // far roller
      c.row(4, 1, 18, W);
      c.col(18, 1, 5, IR);
      c.set(18, 0 + 1, W);
      c.rect(1, 19, 18, 22, WD); // near roller
      c.row(19, 1, 18, W);
      c.set(1, 20, IR);
      c.set(18, 20, IR);
      c.rect(2, 23, 4, b, W);
      c.rect(15, 23, 17, b, W);
      c.col(2, 23, b, WL);
      c.row(25, 5, 14, WD);
      const R = C.straw;
      for (const x of [6, 13]) {
        if (u) {
          c.col(x, 7, 11, R);
          c.col(x, 15, 19, R);
          c.rect(x, 12, x, 12, IR);
          c.rect(x, 14, x, 14, IR);
        } else {
          dots(c, R, [x, 7, x, 8, x + 1, 9, x, 10, x, 18, x + 1, 17, x, 16]);
          c.set(x, 11, IR);
          c.set(x, 15, IR);
        }
      }
      if (u) {
        c.oval(7, 11, 12, 16, BD);
        dots(c, BL, [8, 12, 10, 14, 9, 15, 11, 13]);
      }
    },
  });

  /* ---------- the iron maiden ---------- */
  function maidenBody(c, x0, x1, b, open) {
    const m = (x0 + x1) >> 1;
    c.poly([[x0 + 2, 9], [x1 - 2, 9], [x1, 16], [x1 - 1, b - 2], [x0 + 1, b - 2], [x0, 16]], open ? NI : IR);
    c.oval(m - 4, 2, m + 5, 12, open ? NI : IR);
    c.rect(x0, b - 1, x1, b, ID);
    return m;
  }
  O('iron-maiden', 'iron maiden spiked coffin torture cabinet face rusty', {
    w: 20,
    h: 44,
    uw: 36,
    f(c, u) {
      const b = 42,
        o = u ? 8 : 0,
        x0 = 2 + o,
        x1 = 17 + o;
      const m = maidenBody(c, x0, x1, b, u);
      if (!u) {
        c.col(x0 + 1, 16, b - 3, L(IR));
        c.col(m, 13, b - 3, ID);
        c.col(m + 1, 13, b - 3, NI);
        for (const y of [15, 24, 33]) {
          c.row(y, x0 + 1, x1 - 1, ID);
          dots(c, ST, [x0 + 3, y, m - 2, y, m + 3, y, x1 - 3, y]);
        }
        dots(c, NI, [m - 2, 6, m - 1, 6, m + 2, 6, m + 3, 6, m, 9, m + 1, 9]); // the face
        c.set(m, 7, L(IR));
        c.set(m + 1, 7, L(IR));
        c.row(4, m - 2, m + 3, L(IR));
        c.rect(m + 2, 23, m + 3, 25, C.brass);
        rusty(c, x0, 2, x1, b, 4, 4);
        return;
      }
      // open: the frame, the spikes, and a door to either side
      c.frame(x0, 14, x1, b - 2, IR);
      ring(c, m - 4, 2, m + 5, 12, IR);
      for (let y = 6; y <= b - 5; y += 4) for (let x = x0 + 2 + ((y >> 2) % 2) * 2; x <= x1 - 2; x += 4) if (c.get(x, y)) c.set(x, y, ST), c.set(x, y + 1, D(ST));
      dots(c, BL, [m - 2, 18, m + 2, 22, m, 27, m + 3, 31, m - 3, 34, m + 1, 14]);
      for (const s of [-1, 1]) {
        const a = s < 0 ? x0 - 7 : x1 + 2,
          e = a + 5;
        c.poly([[a + 1, 9], [e - 1, 9], [e, 16], [e, b - 2], [a, b - 2], [a, 16]], D(IR));
        c.rect(a + 1, 4, e - 1, 9, D(IR));
        c.col(s < 0 ? a : e, 16, b - 2, IR);
        for (let y = 7; y <= b - 5; y += 4) {
          c.set(a + 2 + ((y >> 2) % 2), y, ST);
          c.set(a + 4 - ((y >> 2) % 2), y + 2, ST);
        }
        dots(c, BL, [a + 2, 20, a + 3, 30, a + 3, 12]);
        c.rect(a, b - 1, e, b, ID);
      }
      rusty(c, 1, 2, 34, b, 4, 6);
      return () => (drip(c, m, b - 3, 1), pool(c, m - 5, m + 6, b + 1));
    },
    sw: 14,
    suw: 23,
    s(c, u) {
      const b = 42;
      c.poly([[3, 9], [10, 9], [11, 16], [11, b - 2], [2, b - 2], [2, 16]], IR);
      c.oval(3, 2, 10, 12, IR);
      c.rect(1, b - 1, 12, b, ID);
      c.col(3, 14, b - 3, L(IR));
      for (const y of [15, 24, 33]) {
        c.row(y, 2, 11, ID);
        dots(c, ST, [4, y, 8, y]);
      }
      c.set(11, 7, IR); // the nose
      c.set(10, 6, NI);
      if (!u) {
        c.col(9, 13, b - 3, ID);
        c.rect(11, 23, 11, 25, C.brass);
      } else {
        c.rect(9, 5, 11, b - 2, NI); // the door stands open toward the viewer's right
        c.poly([[12, 9], [19, 9], [20, 16], [20, b - 2], [12, b - 2]], D(IR));
        c.rect(13, 4, 18, 9, D(IR));
        for (let y = 7; y <= b - 5; y += 4) {
          c.set(14 + ((y >> 2) % 2) * 2, y, ST);
          c.set(18 - ((y >> 2) % 2) * 2, y + 2, ST);
        }
        dots(c, ST, [10, 10, 10, 18, 10, 26, 10, 34]);
        dots(c, BL, [15, 20, 17, 30, 16, 12, 10, 22]);
        c.rect(12, b - 1, 20, b, ID);
      }
      rusty(c, 1, 2, 21, b, 4, 5);
      return () => u && pool(c, 8, 18, b + 1);
    },
  });

  /* ---------- the guillotine ---------- */
  const WICK = hex('#8a7446');
  O('guillotine', 'guillotine blade scaffold execution basket wooden frame', {
    w: 24,
    h: 62,
    f(c, u) {
      const b = 60,
        by = u ? b - 22 : 6;
      for (const x of [4, 18]) {
        c.rect(x, 3, x + 1, b - 3, W);
        c.col(x, 3, b - 3, WL);
      }
      c.rect(3, 2, 20, 4, W);
      c.row(2, 3, 20, WL);
      c.row(4, 3, 20, WD);
      c.col(11, 5, by - 1, C.straw); // the rope
      c.rect(6, by, 17, by + 1, WD); // the mouton and the blade
      c.poly([[6, by + 2], [17, by + 2], [17, by + 8], [6, by + 4]], ST);
      c.line(6, by + 4, 17, by + 8, L(ST));
      c.row(by + 2, 6, 17, D(ST));
      // the lunette
      c.rect(6, b - 16, 17, b - 11, W);
      c.row(b - 16, 6, 17, WL);
      c.row(b - 13, 6, 17, WD);
      c.oval(10, b - 15, 13, b - 12, NI);
      c.rect(1, b - 2, 22, b, W);
      c.row(b - 2, 1, 22, WL);
      c.rect(7, b - 9, 16, b - 3, WICK); // the basket
      c.row(b - 9, 7, 16, L(WICK));
      for (let x = 8; x <= 15; x += 2) c.col(x, b - 8, b - 3, D(WICK));
      c.speckle(3, 2, 20, b, WD, 10, 3);
      if (u) {
        c.poly([[6, by + 2], [17, by + 2], [17, by + 8], [6, by + 4]], ST);
        c.row(by + 5, 8, 15, BL);
        c.row(by + 6, 10, 16, BL);
        c.row(by + 7, 13, 17, BL);
        c.rect(9, b - 15, 14, b - 12, BL);
        c.oval(9, b - 12, 14, b - 8, PALE); // a head in the basket
        c.row(b - 12, 10, 13, WD);
        c.row(b - 11, 9, 14, WD);
        c.col(8, b - 8, b - 4, BL);
        c.col(13, b - 8, b - 6, BL);
      } else dots(c, BD, [9, b - 11, 12, b - 11, 13, b - 10]);
      return () => u && (pool(c, 14, 22, b + 1), c.set(5, b + 1, BL));
    },
    sw: 34,
    s(c, u) {
      const b = 60,
        by = u ? b - 22 : 6;
      c.rect(1, b - 2, 32, b, W);
      c.row(b - 2, 1, 32, WL);
      c.rect(17, 3, 18, b - 3, W);
      c.col(17, 3, b - 3, WL);
      c.rect(16, 2, 19, 4, W);
      c.row(2, 16, 19, WL);
      c.line(8, b - 3, 16, b - 24, WD); // braces
      c.line(27, b - 3, 19, b - 24, WD);
      c.col(19, 5, by - 1, C.straw);
      c.rect(19, by, 20, by + 1, WD);
      c.col(19, by + 2, by + 8, ST);
      c.set(19, by + 8, L(ST));
      // the bench the body lies on, to the left
      c.rect(2, b - 13, 16, b - 12, W);
      c.row(b - 13, 2, 16, WL);
      c.rect(3, b - 11, 4, b - 3, WD);
      c.rect(12, b - 11, 13, b - 3, WD);
      c.rect(16, b - 16, 20, b - 11, W); // the lunette, edge on
      c.col(16, b - 16, b - 11, WL);
      c.rect(22, b - 9, 29, b - 3, WICK);
      c.row(b - 9, 22, 29, L(WICK));
      for (let x = 23; x <= 28; x += 2) c.col(x, b - 8, b - 3, D(WICK));
      c.speckle(1, 2, 32, b, WD, 10, 3);
      if (u) {
        c.col(19, by + 4, by + 8, BL);
        c.col(21, b - 15, b - 11, BL);
        c.oval(23, b - 12, 28, b - 8, PALE);
        c.row(b - 12, 24, 27, WD);
        c.rect(26, b - 11, 28, b - 10, WD);
        c.col(22, b - 8, b - 5, BL);
        c.row(b - 13, 13, 16, BL);
      } else c.set(18, b - 12, BD);
      return () => u && (pool(c, 18, 26, b + 1), drip(c, 15, b - 11, 2));
    },
  });

  /* ---------- the pillory ---------- */
  O('pillory-stocks-rusted', 'stocks pillory wooden boards holes for head and hands rusty iron padlock punishment', {
    w: 30,
    h: 30,
    f(c, u) {
      const b = 28,
        up = u ? 6 : 0;
      for (const x of [2, 25]) {
        c.rect(x, 4, x + 2, b, W);
        c.col(x, 4, b, WL);
        c.rect(x - 1, b - 1, x + 3, b, WD);
      }
      const board = (y, top) => {
        c.rect(5, y, 24, y + 4, W);
        c.row(y, 5, 24, WL);
        c.row(y + 4, 5, 24, WD);
        const e = top ? y + 4 : y;
        c.rect(13, top ? y + 3 : y, 16, top ? y + 4 : y + 1, NI);
        c.rect(7, e, 8, e, NI);
        c.rect(21, e, 22, e, NI);
      };
      board(13, false);
      if (u) {
        // the top board swung up on its hinge
        c.poly([[5, 12], [5, 8], [24, 2], [24, 6]], W);
        c.line(5, 8, 24, 2, WL);
        c.line(5, 12, 24, 6, WD);
        dots(c, NI, [13, 9, 14, 9, 15, 8, 7, 11, 21, 7]);
        dots(c, BL, [13, 13, 16, 13, 14, 15, 8, 14]);
      } else board(8, true);
      c.rect(5, 11 - (u ? 1 : 0), 6, 13, IR); // hinge
      if (!u) {
        c.rect(23, 11, 24, 14, IR);
        c.rect(23, 15, 24, 16, C.brass);
      } else c.rect(23, 13, 24, 16, IR), c.set(24, 17, C.brass);
      c.rect(5, 20, 24, 21, WD);
      rusty(c, 5, 8, 24, 16, 3, 9);
      c.speckle(2, 4, 27, b, WD, 10, 5);
    },
    sw: 12,
    s(c, u) {
      const b = 28;
      c.rect(4, 4, 6, b, W);
      c.col(4, 4, b, WL);
      c.rect(1, b - 1, 10, b, WD);
      c.line(2, b - 2, 4, b - 8, WD);
      c.line(9, b - 2, 6, b - 8, WD);
      c.rect(3, 13, 7, 17, W);
      c.row(13, 3, 7, WL);
      if (u) {
        c.rect(3, 2, 7, 6, W);
        c.row(2, 3, 7, WL);
        c.row(6, 3, 7, WD);
        c.set(7, 13, BL);
        c.rect(7, 14, 8, 16, IR);
        c.set(8, 17, C.brass);
      } else {
        c.rect(3, 8, 7, 12, W);
        c.row(8, 3, 7, WL);
        c.row(12, 3, 7, WD);
        c.rect(7, 11, 8, 14, IR);
        c.rect(7, 15, 8, 16, C.brass);
      }
      c.speckle(1, 2, 10, b, WD, 10, 5);
    },
  });

  /* ---------- the furnace ---------- */
  O('furnace-hand', 'iron furnace with a charred hand at the grate fire oven incinerator crematory', {
    w: 24,
    h: 42,
    uw: 30,
    f(c, u) {
      const b = 40,
        o = u ? 6 : 0;
      c.rect(9 + o, 1, 13 + o, 6, ID);
      c.col(9 + o, 1, 6, IR);
      c.rect(2 + o, 6, 21 + o, b, IR);
      c.col(2 + o, 6, b, L(IR));
      c.row(6, 2 + o, 21 + o, L(IR));
      c.rect(1 + o, b - 1, 22 + o, b, ID);
      for (const y of [9, 29, 37]) for (let x = 4 + o; x <= 20 + o; x += 4) c.set(x, y, ID);
      c.rect(7 + o, 31, 16 + o, 35, ID); // ash door
      c.row(33, 9 + o, 14 + o, NI);
      rusty(c, 2 + o, 1, 21 + o, b, 6, 4);
      if (!u) {
        c.rect(5, 13, 18, 27, ID);
        c.frame(5, 13, 18, 27, L(IR));
        c.rect(7, 15, 16, 25, FLAME); // the grate, the fire, the hand
        c.rect(8, 20, 15, 25, FLL);
        c.rect(9, 23, 13, 25, C.glow);
        for (let x = 7; x <= 16; x += 3) c.col(x, 15, 25, ID);
        c.rect(10, 19, 13, 23, CHAR);
        c.col(10, 17, 19, CHAR);
        c.col(12, 16, 19, CHAR);
        c.col(13, 17, 19, CHAR);
        c.set(14, 20, CHAR);
        c.set(11, 18, CHAR);
        c.rect(11, 24, 12, 25, CHAR);
        c.rect(19, 19, 20, 21, C.brass);
      } else {
        c.rect(5 + o, 13, 18 + o, 27, NI);
        c.rect(6 + o, 17, 17 + o, 27, FLAME);
        c.rect(8 + o, 20, 15 + o, 27, FLL);
        c.rect(10 + o, 23, 13 + o, 27, C.glow);
        dots(c, FLAME, [8 + o, 15, 12 + o, 14, 15 + o, 16, 10 + o, 16]);
        c.frame(5 + o, 13, 18 + o, 27, L(IR));
        c.rect(1, 12, 4 + o, 28, ID); // the door, open to the left
        c.frame(1, 12, 4 + o, 28, IR);
        for (let x = 3; x <= 8; x += 3) c.col(x, 14, 26, NI);
        c.rect(12, 27, 13, 33, CHAR); // the arm hangs out
        c.rect(11, 34, 13, 35, CHAR);
        dots(c, CHAR, [11, 36, 13, 36]);
        c.set(12, 30, FLAME);
        c.set(13, 28, BL);
      }
      return () => {
        dots(c, C.ash, [8 + o, b + 1, 11 + o, b + 1, 12 + o, b + 1]);
        if (u) dots(c, FLL, [14, 9, 20, 11, 17, 4, 23, 8]);
      };
    },
    sw: 16,
    suw: 23,
    s(c, u) {
      const b = 40;
      c.rect(5, 1, 9, 6, ID);
      c.col(5, 1, 6, IR);
      c.rect(2, 6, 13, b, IR);
      c.col(2, 6, b, L(IR));
      c.row(6, 2, 13, L(IR));
      c.rect(1, b - 1, 14, b, ID);
      for (const y of [9, 20, 29, 37]) for (let x = 4; x <= 12; x += 4) c.set(x, y, ID);
      c.col(13, 13, 27, u ? FLL : FLAME);
      rusty(c, 2, 1, 13, b, 6, 4);
      if (!u) c.rect(14, 19, 14, 21, C.brass);
      else {
        c.rect(14, 12, 20, 28, ID);
        c.frame(14, 12, 20, 28, IR);
        c.col(17, 14, 26, NI);
        c.rect(14, 29, 15, 34, CHAR);
        c.set(15, 35, CHAR);
        c.set(14, 31, FLAME);
      }
      return () => {
        c.set(15, b + 1, C.ash);
        if (u) dots(c, FLL, [15, 9, 18, 7, 16, 4, 21, 10]);
      };
    },
  });

  /* ---------- the boiler ---------- */
  function rustFace(c, x, y, u) {
    c.oval(x, y, x + 5, y + 6, RU);
    c.set(x + 1, y + 2, u ? FLL : RD);
    c.set(x + 4, y + 2, u ? FLL : RD);
    c.rect(x + 2, y + 4, x + 3, y + (u ? 5 : 4), u ? NI : RD);
    c.set(x + 5, y + 5, RD);
    c.col(x + 1, y + 7, y + 8, RD);
  }
  O('boiler-rust-faces', 'boiler tank with faces in the rust gauge valve pipes steam basement', {
    w: 22,
    h: 46,
    f(c, u) {
      const b = 44;
      c.rect(3, 7, 18, b - 4, IR);
      c.oval(3, 3, 18, 11, IR);
      c.col(4, 8, b - 5, L(IR));
      c.col(5, 8, b - 5, L(IR));
      c.col(17, 8, b - 5, ID);
      c.rect(4, b - 3, 5, b, ID);
      c.rect(16, b - 3, 17, b, ID);
      for (const y of [13, 27, b - 6]) {
        c.row(y, 3, 18, ID);
        for (let x = 5; x <= 17; x += 3) c.set(x, y + 1, L(IR));
      }
      c.rect(10, 1, 11, 4, ID); // pipe up
      c.rect(11, 1, 20, 2, ID);
      rustFace(c, 5, 15, u);
      rustFace(c, 11, 29, u);
      rustFace(c, 6, 32, u);
      rusty(c, 3, 3, 18, b, 9, 5);
      c.oval(12, 16, 16, 20, C.bone); // gauge
      ring(c, 12, 16, 16, 20, C.brass);
      c.set(14, 18, NI);
      c.set(u ? 15 : 13, u ? 17 : 17, u ? C.red : NI);
      c.rect(8, 23, 12, 23, RU); // valve wheel
      c.set(10, 22, RL);
      c.set(10, 24, RL);
      c.set(10, 23, ID);
      return () => {
        if (!u) return;
        dots(c, C.ghost, [12, 0, 13, 0, 19, 4, 20, 5, 1, 22, 0, 21, 1, 20, 20, 3, 2, 23]);
        dots(c, C.white, [19, 3, 1, 21]);
      };
    },
    sw: 20,
    s(c, u) {
      const b = 44;
      c.rect(3, 7, 16, b - 4, IR);
      c.oval(3, 3, 16, 11, IR);
      c.col(4, 8, b - 5, L(IR));
      c.col(5, 8, b - 5, L(IR));
      c.col(15, 8, b - 5, ID);
      c.rect(4, b - 3, 5, b, ID);
      c.rect(14, b - 3, 15, b, ID);
      for (const y of [13, 27, b - 6]) {
        c.row(y, 3, 16, ID);
        for (let x = 5; x <= 15; x += 3) c.set(x, y + 1, L(IR));
      }
      c.rect(9, 1, 10, 4, ID);
      rustFace(c, 7, 16, u);
      rustFace(c, 5, 30, u);
      rusty(c, 3, 3, 16, b, 9, 5);
      c.rect(17, 16, 18, 20, C.brass); // the gauge, edge on
      c.col(18, 17, 19, u ? C.red : C.bone);
      c.rect(17, 22, 18, 24, RU);
      return () => u && dots(c, C.ghost, [10, 0, 11, 0, 19, 13, 19, 14, 18, 12, 1, 26, 0, 25, 1, 24]);
    },
  });

  /* ---------- the grinder ---------- */
  O('meat-grinder-machine', 'industrial meat grinder mincer machine hopper steel tray butcher factory', {
    w: 28,
    h: 36,
    f(c, u) {
      const b = 34;
      c.poly([[5, 2], [22, 2], [18, 11], [9, 11]], ST); // hopper
      c.row(2, 5, 22, L(ST));
      c.line(5, 2, 9, 11, L(ST));
      c.row(3, 7, 20, NI);
      c.rect(4, 12, 23, 24, IR);
      c.col(4, 12, 24, L(IR));
      c.row(12, 4, 23, L(IR));
      c.oval(10, 14, 17, 21, ST); // the die
      ring(c, 10, 14, 17, 21, D(ST));
      dots(c, NI, [12, 16, 14, 16, 15, 18, 13, 18, 12, 19, 14, 20, 15, 16]);
      c.rect(6, 14, 8, 18, ID); // switch box
      c.set(7, 15, u ? C.red : BD);
      c.set(7, 17, u ? hex('#3d5a3a') : hex('#5f8a4f'));
      c.rect(20, 15, 22, 22, ID);
      for (let y = 16; y <= 21; y += 2) c.row(y, 20, 22, NI);
      c.rect(6, 26, 21, 28, ST); // tray
      c.row(26, 6, 21, L(ST));
      c.row(25, 7, 20, NI);
      c.rect(5, 25, 6, b, ID);
      c.rect(21, 25, 22, b, ID);
      c.row(31, 7, 20, ID);
      rusty(c, 4, 2, 23, b, 2, 5);
      dots(c, BD, [12, 22, 15, 23, 9, 27]);
      if (u) {
        for (const x of [11, 13, 14, 16]) c.col(x, 19 + (x % 2), 24, x % 2 ? MEAT : MEATL); // mince
        c.rect(9, 24, 18, 25, MEAT);
        dots(c, MEATL, [10, 24, 13, 24, 16, 25, 12, 25]);
        c.rect(15, 0 + 1, 16, 3, PALE); // a hand still up out of the hopper
        dots(c, PALE, [14, 1, 17, 1, 17, 2]);
        c.set(15, 3, BL);
        c.row(3, 9, 14, BL);
        dots(c, BL, [9, 5, 17, 7, 12, 9]);
      }
      return () => u && (drip(c, 8, 29, 2), drip(c, 19, 29, 3), pool(c, 9, 20, b));
    },
    sw: 30,
    s(c, u) {
      const b = 34;
      c.poly([[4, 2], [17, 2], [14, 11], [7, 11]], ST);
      c.row(2, 4, 17, L(ST));
      c.line(4, 2, 7, 11, L(ST));
      c.rect(3, 12, 19, 24, IR);
      c.col(3, 12, 24, L(IR));
      c.row(12, 3, 19, L(IR));
      c.rect(20, 14, 23, 21, ST); // the worm housing and die, facing right
      c.row(14, 20, 23, L(ST));
      c.col(23, 15, 20, D(ST));
      ring(c, 5, 14, 12, 21, ID); // belt wheel
      c.set(8, 17, ST);
      c.set(9, 18, ST);
      c.rect(14, 15, 16, 19, ID);
      c.set(15, 16, u ? C.red : BD);
      c.rect(19, 26, 28, 28, ST);
      c.row(26, 19, 28, L(ST));
      c.rect(4, 25, 5, b, ID);
      c.rect(17, 25, 18, b, ID);
      c.rect(26, 29, 27, b, ID);
      c.row(31, 6, 25, ID);
      rusty(c, 3, 2, 28, b, 2, 5);
      c.set(24, 22, BD);
      if (u) {
        for (const y of [15, 17, 19]) c.rect(24, y, 25, y, MEAT), c.col(25 + (y % 3 ? 0 : 1), y, 24, y % 3 ? MEATL : MEAT);
        c.rect(21, 24, 27, 25, MEAT);
        dots(c, MEATL, [22, 24, 25, 25]);
        c.rect(11, 1, 12, 2, PALE);
        dots(c, PALE, [10, 1, 13, 1]);
        dots(c, BL, [7, 4, 13, 7, 10, 9, 11, 2]);
      }
      return () => u && (drip(c, 22, 29, 3), pool(c, 18, 27, b));
    },
  });

  /* ---------- the fan ---------- */
  O('wall-fan-rusty', 'rusty ventilation fan in a wall frame blades light shafts vent industrial', {
    w: 26,
    h: 26,
    solid: false,
    f(c, u) {
      c.rect(1, 1, 24, 24, RU);
      c.frame(1, 1, 24, 24, RD);
      c.row(1, 1, 24, RL);
      c.col(1, 1, 24, RL);
      dots(c, ID, [3, 3, 22, 3, 3, 22, 22, 22]);
      c.oval(4, 4, 21, 21, NI);
      const sh = blend(NI, C.glow, 0.45);
      if (!u) {
        dots(c, sh, [7, 9, 8, 8, 16, 7, 17, 8, 9, 16, 8, 17, 17, 16]);
        c.poly([[12, 12], [9, 5], [14, 5]], IR);
        c.poly([[13, 12], [20, 9], [20, 14]], IR);
        c.poly([[13, 13], [16, 20], [11, 20]], ID);
        c.poly([[12, 13], [5, 16], [5, 11]], ID);
        c.line(9, 5, 12, 12, L(IR));
        c.line(20, 9, 13, 12, L(IR));
      } else {
        ring(c, 5, 5, 20, 20, IR);
        ring(c, 7, 7, 18, 18, ID);
        ring(c, 9, 9, 16, 16, IR);
        c.dither(6, 6, 19, 19, sh);
        ring(c, 4, 4, 21, 21, NI);
      }
      c.rect(11, 11, 14, 14, ST);
      c.rect(12, 12, 13, 13, ID);
      c.col(12, 2, 4, ID);
      c.col(12, 21, 23, ID);
      rusty(c, 1, 1, 24, 24, 4, 4);
      return () => u && dots(c, C.ash, [5, 25, 9, 25, 16, 25, 20, 25]);
    },
    sw: 9,
    s(c, u) {
      c.rect(2, 1, 4, 24, RU);
      c.col(2, 1, 24, RL);
      c.col(4, 1, 24, RD);
      c.rect(5, 11, 6, 14, ST);
      c.set(7, 12, ID);
      c.set(7, 13, ID);
      if (!u) {
        c.col(5, 5, 10, IR);
        c.col(5, 15, 20, ID);
        c.set(6, 6, IR);
        c.set(6, 19, ID);
      } else {
        for (let y = 5; y <= 20; y += 2) c.set(5, y, IR), c.set(6, y + 1, ID);
      }
      rusty(c, 2, 1, 4, 24, 4, 3);
    },
  });

  /* ---------- the grate ---------- */
  O('floor-grate-fingers', 'grate in the floor with fingers gripping through drain bars hand from below sewer', {
    w: 24,
    h: 11,
    uh: 22,
    solid: false,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[4, b - 6], [19, b - 6], [22, b], [1, b]], CE);
      c.row(b - 6, 4, 19, CL);
      c.poly([[5, b - 5], [18, b - 5], [20, b - 1], [3, b - 1]], NI);
      if (!u) {
        for (let i = 0; i < 6; i++) c.line(6 + i * 2.4, b - 5, 4.5 + i * 3, b - 1, IR);
        c.row(b - 3, 4, 19, IR);
        c.rect(9, b - 3, 9, b - 2, PALE); // fingers
        c.rect(11, b - 4, 11, b - 2, PALE);
        c.rect(13, b - 4, 13, b - 2, PALE);
        c.rect(15, b - 3, 15, b - 2, PALE);
        dots(c, D(PALE), [9, b - 1, 11, b - 1, 13, b - 1, 15, b - 1]);
      } else {
        // the grate thrown back, and an arm out of the hole
        c.poly([[3, b - 7], [8, b - 16], [20, b - 16], [18, b - 7]], ID);
        for (let i = 0; i < 5; i++) c.line(9 + i * 2.5, b - 16, 5 + i * 3, b - 7, IR);
        c.line(5, b - 11, 19, b - 11, IR);
        c.line(8, b - 16, 20, b - 16, ST);
        c.rect(11, b - 9, 13, b - 2, PALE);
        c.col(11, b - 9, b - 2, L(PALE));
        c.rect(10, b - 12, 14, b - 10, PALE);
        dots(c, PALE, [9, b - 13, 11, b - 14, 13, b - 14, 15, b - 13, 15, b - 11]);
        dots(c, BD, [12, b - 6, 13, b - 4, 12, b - 2]);
        c.set(10, b - 11, D(PALE));
      }
      c.speckle(1, b - 6, 22, b, CD, 8, 2);
    },
    sw: 14,
    suh: 22,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[3, b - 6], [10, b - 6], [12, b], [1, b]], CE);
      c.row(b - 6, 3, 10, CL);
      c.poly([[4, b - 5], [9, b - 5], [10, b - 1], [3, b - 1]], NI);
      if (!u) {
        for (let y = b - 5; y <= b - 1; y += 2) c.row(y, 3, 10, IR);
        c.col(6, b - 5, b - 1, IR);
        c.rect(8, b - 4, 10, b - 4, PALE);
        c.rect(8, b - 2, 10, b - 2, PALE);
        c.set(11, b - 3, D(PALE));
      } else {
        c.poly([[1, b - 7], [2, b - 16], [5, b - 16], [5, b - 7]], ID);
        c.col(2, b - 16, b - 7, IR);
        c.col(4, b - 16, b - 7, IR);
        c.rect(6, b - 9, 8, b - 2, PALE);
        c.col(6, b - 9, b - 2, L(PALE));
        c.rect(6, b - 12, 9, b - 10, PALE);
        dots(c, PALE, [10, b - 13, 10, b - 11, 8, b - 13, 6, b - 13]);
        dots(c, BD, [7, b - 5, 8, b - 3]);
      }
      c.speckle(1, b - 6, 12, b, CD, 8, 2);
    },
  });
};
