/* Garden: an overgrown garden. Part of tools/big/env-old.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, legs, hollow, pane, wisp, pot, bush, hedge, stones, bricks, planksV, planksH, heap, shards } = H;
  const add = H.reg('env-garden', 'Garden');
  const GREYW = hex('#7a6e60'),
    WHITEP = hex('#b0ac9c'),
    OAK = hex('#5c4432'),
    TERRA = hex('#8a4f36'),
    BRICK = hex('#7a4636'),
    GLASSD = hex('#3f5a58'),
    GLASSL = hex('#7fa39c'),
    SOIL = hex('#3f2e26'),
    WAT = hex('#5f8f98'),
    POND = hex('#2c4a44'),
    ROSE = hex('#a8566a'),
    TIN = hex('#858a92'),
    SOOT = hex('#1c1a1e'),
    STONE = hex('#8a8a84'),
    BROWNLEAF = hex('#7a5a34'),
    CHINA_ = hex('#d6d2c4');
  const planks = (c, x0, y0, x1, y1, col, step = 4) => {
    face(c, x0, y0, x1, y1, col);
    planksV(c, x0, y0 + 1, x1, y1, D(col), step);
  };
  /** Leaves scattered along a line (a climber). */
  const vine = (c, x0, y0, x1, y1, seed, col = C.leaf, hi = C.leafLight) => {
    const r = rnd(seed),
      n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / n),
        y = Math.round(y0 + ((y1 - y0) * i) / n);
      c.set(x, y, col);
      if (r() < 0.6) c.set(x + (r() < 0.5 ? 1 : -1), y, r() < 0.5 ? hi : col);
      if (r() < 0.4) c.set(x, y + (r() < 0.5 ? 1 : -1), hi);
    }
  };
  const moss = (c, pts) => dots(c, C.moss, pts);
  /** A greenhouse pane; lit: the lamp is on inside. */
  const gpane = (c, x0, y0, x1, y1, lit) => {
    c.rect(x0, y0, x1, y1, lit ? hex('#a8a868') : GLASSD);
    if (!lit) c.line(x0, y1 - 1, Math.min(x1, x0 + 2), Math.max(y0, y1 - 3), GLASSL);
  };

  /* ---------- glass ---------- */
  add('greenhouse-section', 'greenhouse glasshouse section glass panes brick base plants hothouse', {
    w: 36, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 34, 27, WHITEP);
      for (let i = 0; i < 4; i++) {
        const x = 2 + i * 8 + (i > 1 ? 1 : 0);
        gpane(c, x, 3, x + 6, 8, u); // the roof lights
        gpane(c, x, 11, x + 6, 26, u);
        c.col(x + 3, 11, 26, WHITEP);
        if (!u) c.line(x, 25, x + 2, 23, GLASSL);
      }
      c.row(1, 1, 34, L(WHITEP)); // ridge
      c.rect(1, 9, 34, 10, WHITEP);
      c.row(10, 1, 34, D(WHITEP));
      dots(c, C.moss, [3, 9, 12, 10, 20, 9, 30, 10, 1, 20, 34, 15]);
      const dk = u ? hex('#4a5236') : hex('#2c4038'); // what grows inside
      for (const [x, y] of [[4, 20], [7, 16], [13, 19], [16, 22], [22, 15], [25, 20], [31, 17]]) {
        c.line(x, 26, x, y, dk);
        c.set(x - 1, y + 1, dk);
        c.set(x + 1, y + 2, dk);
        c.set(x + 1, y, dk);
      }
      c.rect(29, 3, 33, 8, SOOT); // a pane long gone
      c.set(29, 8, GLASSL);
      c.set(33, 3, GLASSL);
      if (u) {
        c.rect(20, 14, 23, 17, hex('#3a3a2a')); // somebody is standing in there
        c.rect(19, 18, 24, 26, hex('#3a3a2a'));
        c.set(21, 13, hex('#3a3a2a'));
        c.set(22, 13, hex('#3a3a2a'));
        for (let i = 0; i < 4; i++) c.col(5 + i * 8 + (i > 1 ? 1 : 0), 11, 26, WHITEP);
      }
      bricks(c, 1, 28, 34, b, BRICK, 2);
      c.row(27, 1, 34, STONE);
      moss(c, [2, b, 3, b - 1, 14, b, 27, b, 33, b - 2]);
    },
    sw: 26, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[1, 10], [12, 1], [13, 1], [24, 10], [24, 27], [1, 27]], WHITEP);
      c.poly([[4, 9], [12, 3], [13, 3], [21, 9]], u ? hex('#a8a868') : GLASSD); // the gable
      c.col(12, 3, 9, WHITEP);
      gpane(c, 2, 12, 6, 26, u);
      gpane(c, 19, 12, 23, 26, u);
      bricks(c, 1, 28, 24, b, BRICK, 3);
      c.row(27, 1, 24, STONE);
      c.rect(8, 11, 17, b, WHITEP); // the door
      c.col(8, 11, b, L(WHITEP));
      if (!u) {
        gpane(c, 10, 13, 15, 22, false);
        c.row(17, 10, 15, WHITEP);
        panel(c, 10, 25, 15, b - 2, WHITEP);
        c.set(16, 23, C.rust);
      } else {
        c.rect(9, 12, 16, b, hex('#a8a868')); // open, the light falling out
        c.rect(9, 12, 10, b, WHITEP);
        c.col(9, 12, b, D(WHITEP));
        c.rect(12, 16, 14, 18, hex('#3a3a2a'));
        c.rect(11, 19, 15, b, hex('#3a3a2a'));
        c.line(12, 26, 12, 20, hex('#4a5236'));
      }
      moss(c, [2, b, 22, b - 1, 23, b, 3, 11]);
    },
  });
  add('cold-frame-glass', 'cold frame glass lights seedlings garden frame lettuces', {
    w: 30, h: 14, solid: true,
    f(c, u) {
      const b = c.h - 2;
      bricks(c, 1, 7, 28, b, BRICK, 4);
      moss(c, [2, b, 9, b, 20, b - 1, 27, b]);
      const lett = (x) => {
        c.rect(x, 5, x + 2, 6, hex('#5a8a4a'));
        c.set(x + 1, 4, hex('#7aa85a'));
      };
      if (!u) {
        c.rect(1, 2, 28, 6, WHITEP);
        for (let i = 0; i < 3; i++) {
          gpane(c, 2 + i * 9, 3, 9 + i * 9, 5, false);
          dots(c, hex('#4a6a44'), [4 + i * 9, 5, 7 + i * 9, 4]);
        }
        c.row(2, 1, 28, L(WHITEP));
      } else {
        c.rect(1, 5, 28, 6, SOIL); // a light propped open
        for (let x = 3; x < 27; x += 4) if (x !== 15) lett(x);
        c.rect(14, 5, 17, 6, SOIL);
        dots(c, hex('#7aa85a'), [15, 6, 20, b, 22, b - 1]); // one pulled, a trail of leaves
        c.rect(1, -4, 28, 0, WHITEP);
        for (let i = 0; i < 3; i++) gpane(c, 2 + i * 9, -3, 9 + i * 9, -1, false);
        c.row(-4, 1, 28, L(WHITEP));
        c.col(4, 1, 4, GREYW);
        c.col(25, 1, 4, GREYW);
      }
    },
    u: [0, 5, 0],
    sw: 18, sh: 14,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 4], [15, 7], [15, b], [2, b]], BRICK);
      c.col(2, 4, b, L(BRICK));
      for (let y = 8; y < b; y += 3) c.row(y, 3, 15, mix(BRICK, 0.6));
      moss(c, [3, b, 14, b]);
      if (!u) {
        c.line(1, 2, 16, 5, WHITEP);
        c.line(1, 3, 16, 6, D(WHITEP));
      } else {
        c.line(2, 3, 14, -4, WHITEP);
        c.line(2, 4, 15, -4, D(WHITEP));
        c.col(13, -2, 6, GREYW);
        c.set(8, 5, hex('#5a8a4a'));
        c.set(11, 6, hex('#7aa85a'));
        dots(c, hex('#7aa85a'), [16, b, 17, b - 1]);
      }
    },
    su: [0, 5, 1],
  });
  add('potting-bench', 'potting bench table flowerpots seed trays trowel compost garden work', {
    w: 30, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [2, 26]) {
        c.rect(x, 3, x + 1, b, GREYW);
        c.col(x, 3, b, L(GREYW));
      }
      board(c, 2, 5, 27, 6, GREYW); // top shelf
      board(c, 1, 15, 28, 16, GREYW);
      board(c, 3, 24, 26, 25, GREYW);
      c.rect(4, 17, 25, 17, D(GREYW));
      pot(c, 4, 7, 2, 4); // on the shelf
      pot(c, 9, 12, 2, 4);
      c.rect(16, 2, 21, 4, hex('#6a5a3a')); // a box of seed packets
      dots(c, C.paper, [17, 2, 19, 2, 20, 2]);
      c.rect(8, 19, 15, 23, hex('#9a8a62')); // a sack of compost below
      c.row(19, 8, 15, L(hex('#9a8a62')));
      pot(c, 18, 22, 20, 23);
      pot(c, 19, 21, 18, 19);
      if (!u) {
        pot(c, 3, 7, 10, 14);
        c.line(5, 9, 4, 6, C.leaf);
        c.line(5, 9, 7, 7, C.leafLight);
        c.rect(10, 12, 18, 14, GREYW); // seed tray
        c.row(12, 10, 18, SOIL);
        dots(c, hex('#7aa85a'), [11, 11, 13, 11, 15, 11, 17, 11]);
        c.line(20, 14, 24, 11, OAK); // trowel
        c.rect(19, 13, 21, 14, TIN);
      } else {
        c.rect(3, 12, 6, 14, TERRA); // the pot on its side and broken, earth everywhere
        c.set(7, 13, TERRA);
        c.set(8, 14, TERRA);
        c.rect(7, 13, 14, 14, SOIL);
        c.row(12, 9, 12, SOIL);
        c.line(10, 13, 14, 11, C.leaf);
        c.set(15, 10, C.leafLight);
        dots(c, SOIL, [6, 17, 12, 17, 12, 19, 16, 15, 20, b, 22, b]);
        c.rect(16, 12, 24, 14, GREYW);
        c.row(12, 16, 24, SOIL);
        c.col(21, 8, 12, TIN); // the trowel driven into the tray
        c.rect(21, 6, 21, 8, OAK);
        shards(c, 2, 8, b, TERRA, 5);
      }
    },
    sw: 13, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 3, b, GREYW);
      c.col(2, 3, b, L(GREYW));
      c.rect(9, 15, 10, b, GREYW);
      board(c, 2, 5, 7, 6, GREYW);
      board(c, 1, 15, 11, 16, GREYW);
      board(c, 3, 24, 10, 25, GREYW);
      pot(c, 3, 6, 2, 4);
      c.rect(4, 19, 8, 23, hex('#9a8a62'));
      if (!u) {
        pot(c, 4, 8, 10, 14);
        c.line(6, 9, 5, 6, C.leaf);
      } else {
        c.rect(4, 13, 9, 14, SOIL);
        c.set(5, 12, TERRA);
        dots(c, SOIL, [11, 17, 11, 20, 12, b]);
        shards(c, 10, 14, b, TERRA, 6);
      }
    },
    su: [0, 0, 2],
  });

  /* ---------- sheds and heaps ---------- */
  add('garden-shed-front', 'garden shed front wooden hut door padlock window tools tar roof', {
    w: 32, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[2, 13], [15, 3], [16, 3], [29, 13], [29, b], [2, b]], GREYW);
      planksV(c, 2, 5, 29, b, D(GREYW), 4);
      c.col(2, 13, b, L(GREYW));
      for (let i = 0; i < 2; i++) {
        c.line(0 + i, 13, 15, 1 + i, hex('#3a3438')); // tarred roof edge
        c.line(31 - i, 13, 16, 1 + i, hex('#3a3438'));
      }
      c.line(1, 12, 15, 1, hex('#5a5258'));
      c.rect(20, 18, 27, 26, WHITEP); // window
      gpane(c, 21, 19, 23, 21, false);
      gpane(c, 25, 19, 26, 21, false);
      gpane(c, 21, 23, 23, 25, false);
      gpane(c, 25, 23, 26, 25, false);
      dots(c, C.ash, [21, 19, 22, 19, 21, 20, 23, 19]); // cobweb
      if (!u) {
        c.frame(5, 17, 16, b, D(GREYW)); // the door
        c.row(21, 6, 15, D(GREYW));
        c.row(b - 5, 6, 15, D(GREYW));
        c.line(6, b - 6, 15, 22, D(GREYW));
        c.rect(15, 28, 17, 29, C.iron); // hasp and padlock
        c.rect(16, 30, 17, 32, C.brass);
        c.set(16, 31, K);
      } else {
        c.rect(5, 17, 16, b, SOOT);
        c.rect(3, 17, 4, b, L(GREYW)); // the door, edge on
        c.col(4, 17, b, D(GREYW));
        c.col(8, 20, b, hex('#3a342e')); // a spade and a fork in the dark
        c.rect(7, b - 5, 9, b, hex('#3a3a44'));
        c.col(12, 22, b, hex('#3a342e'));
        dots(c, hex('#3a3a44'), [11, b - 3, 13, b - 3, 11, b - 1, 13, b - 1, 12, b - 4]);
        c.rect(14, 24, 15, 24, C.glow); // and two eyes, low down
        c.set(13, 24, SOOT);
        c.set(14, 24, C.glow);
        c.set(15, 24, SOOT);
        c.set(16, 24, C.glow);
        c.rect(17, 28, 18, 29, C.iron);
        c.rect(18, 30, 19, 31, C.brass); // the padlock hanging open
      }
      moss(c, [3, b, 4, b - 1, 20, b, 28, b, 27, b - 1, 10, 9, 22, 11]);
    },
    sw: 26, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      planks(c, 2, 13, 22, b, GREYW, 4);
      c.rect(1, 2, 23, 12, hex('#3a3438')); // the roof, sloping to us
      c.row(2, 1, 23, hex('#5a5258'));
      c.row(12, 1, 23, hex('#221d22'));
      for (let x = 6; x < 23; x += 6) c.col(x, 3, 11, hex('#2c262a'));
      dots(c, C.moss, [3, 11, 4, 10, 10, 11, 17, 11, 18, 10, 3, b, 12, b, 20, b - 1]);
      c.col(22, 17, b, D(GREYW));
      if (u) {
        face(c, 23, 17, 33, b, GREYW);
        planksV(c, 23, 18, 33, b, D(GREYW), 4);
        c.row(21, 24, 32, D(GREYW));
        c.row(b - 5, 24, 32, D(GREYW));
        c.line(24, b - 6, 32, 22, D(GREYW));
        c.rect(31, 28, 32, 29, C.iron);
      }
    },
    su: [0, 0, 10],
  });
  add('compost-heap-slats', 'compost heap bin slats rotting garden waste fork worms', {
    w: 28, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      heap(c, 3, 24, 10, u ? 4 : 8, SOIL, 3);
      c.rect(3, 9, 24, b, SOIL);
      dots(c, C.straw, [6, 6, 12, 4, 18, 5, 21, 8, 9, 8]);
      dots(c, hex('#5a7a4a'), [8, 5, 15, 3, 19, 7, 11, 7]);
      dots(c, CHINA_, [14, 6, 17, 8]);
      for (let y = 9; y < b; y += 3) {
        c.rect(2, y, 25, y + 1, GREYW); // slats
        c.row(y, 2, 25, L(GREYW));
      }
      for (const x of [1, 25]) {
        c.rect(x, 7, x + 1, b, OAK);
        c.col(x, 7, b, L(OAK));
      }
      moss(c, [3, b, 10, b - 1, 22, b]);
      if (!u) {
        c.line(20, 7, 24, 0, OAK); // a fork left standing in it
        dots(c, C.iron, [19, 7, 20, 8, 19, 9, 21, 9]);
      } else {
        c.rect(9, 6, 16, 8, hex('#2a1e1a')); // dug into: something pale in the hole
        c.rect(11, 7, 14, 7, C.bone);
        c.set(10, 7, C.bone);
        c.set(15, 8, C.bone);
        c.set(15, 6, C.bone);
        c.line(4, 8, 2, 0, OAK); // the fork thrown down against the side
        dots(c, C.iron, [4, 9, 5, 10, 3, 10]);
        dots(c, SOIL, [8, b, 12, b, 17, b - 1, 26, b]);
      }
    },
    u: [0, 1, 0],
    sw: 18, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      heap(c, 3, 14, 10, u ? 4 : 8, SOIL, 5);
      c.rect(3, 9, 14, b, SOIL);
      dots(c, C.straw, [6, 6, 10, 5]);
      dots(c, hex('#5a7a4a'), [8, 4, 11, 7]);
      for (let y = 9; y < b; y += 3) {
        c.rect(2, y, 15, y + 1, GREYW);
        c.row(y, 2, 15, L(GREYW));
      }
      for (const x of [1, 15]) {
        c.rect(x, 7, x + 1, b, OAK);
        c.col(x, 7, b, L(OAK));
      }
      if (!u) c.line(11, 7, 12, 0, OAK);
      else {
        c.rect(7, 6, 11, 8, hex('#2a1e1a'));
        c.rect(8, 7, 10, 7, C.bone);
        dots(c, SOIL, [17, b, 16, b - 1]);
      }
    },
    su: [0, 1, 0],
  });
  add('water-tap-post-bucket', 'water tap standpipe post bucket garden tap pail', {
    w: 16, h: 26,
    f(c, u) {
      const b = c.h - 2;
      c.rect(8, 3, 10, b, GREYW);
      c.col(8, 3, b, L(GREYW));
      c.col(11, 6, b, hex('#5a6068')); // the lead pipe up the post
      c.row(6, 9, 11, hex('#5a6068'));
      c.rect(8, 7, 10, 8, C.brass); // the tap, pointing at us
      c.row(5, 8, 10, C.brass);
      c.set(9, 6, C.brass);
      c.set(9, 9, D(C.brass));
      moss(c, [8, b, 9, b - 1, 11, b]);
      c.poly([[4, b - 6], [12, b - 6], [11, b], [5, b]], TIN);
      c.row(b - 6, 4, 12, L(TIN));
      c.line(4, b - 6, 5, b, L(TIN));
      c.row(b - 3, 5, 11, D(TIN));
      c.row(b - 7, 5, 11, u ? WAT : SOOT);
      if (u) {
        c.col(9, 10, b - 8, WAT);
        dots(c, C.white, [9, 12, 9, b - 9, 8, b - 7, 10, b - 7]);
        c.col(3, b - 5, b, WAT);
        c.rect(1, b, 4, b, WAT);
      } else c.set(9, 11, WAT); // a drip
    },
    sw: 16, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 3, 5, b, GREYW);
      c.col(3, 3, b, L(GREYW));
      c.col(2, 6, b, hex('#5a6068'));
      c.row(7, 6, 8, C.brass); // the tap, pointing right
      c.col(9, 7, 9, C.brass);
      c.col(7, 5, 6, C.brass);
      c.row(5, 6, 8, C.brass);
      moss(c, [3, b, 4, b - 1]);
      c.poly([[5, b - 6], [13, b - 6], [12, b], [6, b]], TIN);
      c.row(b - 6, 5, 13, L(TIN));
      c.row(b - 3, 6, 12, D(TIN));
      c.row(b - 7, 6, 12, u ? WAT : SOOT);
      if (u) {
        c.col(9, 10, b - 8, WAT);
        dots(c, C.white, [9, 12, 9, b - 9]);
        c.col(14, b - 5, b, WAT);
      } else c.set(9, 11, WAT);
    },
  });

  /* ---------- climbers ---------- */
  const roseDots = (c, pts, col) => {
    for (let i = 0; i < pts.length; i += 2) {
      c.set(pts[i], pts[i + 1], col);
      c.set(pts[i] + 1, pts[i + 1], L(col));
    }
  };
  add('rose-arch-iron', 'rose arch iron arbour climbing roses garden archway', {
    w: 32, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2,
        ir = hex('#3a3f3a');
      for (const x of [3, 6, 24, 27]) c.col(x, 14, b, ir);
      for (let y = 18; y < b; y += 5) {
        c.row(y, 3, 6, ir);
        c.row(y, 24, 27, ir);
      }
      for (let a = 0; a <= 20; a++) {
        const t = (Math.PI * a) / 20;
        c.set(Math.round(15 - 12 * Math.cos(t)), Math.round(14 - 12 * Math.sin(t)), ir);
        c.set(Math.round(15.5 - 9 * Math.cos(t)), Math.round(14 - 9 * Math.sin(t)), ir);
      }
      const lf = u ? hex('#4a5236') : C.leaf,
        hi = u ? hex('#6a6a3c') : C.leafLight;
      vine(c, 4, b, 5, 14, 3, lf, hi);
      vine(c, 5, 14, 9, 5, 4, lf, hi);
      vine(c, 9, 5, 16, 2, 5, lf, hi);
      vine(c, 16, 2, 23, 6, 6, lf, hi);
      vine(c, 23, 6, 26, 16, 7, lf, hi);
      vine(c, 26, 16, 25, b, 8, lf, hi);
      vine(c, 6, 28, 3, 20, 9, lf, hi);
      vine(c, 25, 30, 28, 22, 10, lf, hi);
      const blooms = [4, 30, 6, 20, 3, 36, 7, 10, 11, 4, 16, 1, 20, 4, 24, 9, 27, 18, 25, 26, 27, 34, 5, 25, 13, 3];
      if (!u) roseDots(c, blooms, ROSE);
      else {
        roseDots(c, [6, 20, 24, 9, 27, 34], BROWNLEAF); // the roses cut, the rest gone over
        dots(c, ROSE, [9, b, 12, b - 1, 14, b, 18, b, 21, b - 1, 23, b, 7, b - 1, 16, b - 1]);
        dots(c, C.bone, [4, 29, 11, 4, 20, 5, 27, 19]); // the cut stems
      }
    },
    sw: 12, sh: 46,
    s(c, u) {
      const b = c.h - 2,
        ir = hex('#3a3f3a'),
        lf = u ? hex('#4a5236') : C.leaf,
        hi = u ? hex('#6a6a3c') : C.leafLight;
      c.col(3, 3, b, ir);
      c.col(8, 3, b, ir);
      for (let y = 3; y < b; y += 5) c.row(y, 3, 8, ir);
      c.line(3, 8, 8, 13, ir);
      c.line(3, 23, 8, 28, ir);
      vine(c, 4, b, 6, 24, 3, lf, hi);
      vine(c, 6, 24, 4, 12, 4, lf, hi);
      vine(c, 4, 12, 7, 2, 5, lf, hi);
      vine(c, 8, 30, 7, 18, 6, lf, hi);
      if (!u) roseDots(c, [4, 30, 6, 20, 3, 10, 7, 4, 8, 36, 5, 15], ROSE);
      else {
        roseDots(c, [6, 20, 7, 4], BROWNLEAF);
        dots(c, ROSE, [2, b, 5, b, 9, b - 1, 10, b]);
      }
    },
  });
  add('trellis-clematis', 'trellis lattice climber clematis ivy wall plant wooden', {
    w: 22, h: 38,
    f(c, u) {
      const b = c.h - 2,
        la = hex('#9a8f78');
      const top = u ? 10 : 2;
      for (let k = -40; k < 40; k += 5)
        for (let y = top; y <= b; y++) {
          const x1 = 2 + k + (y - 2),
            x2 = 19 - k - (y - 2);
          if (x1 >= 2 && x1 <= 19) c.set(x1, y, la);
          if (x2 >= 2 && x2 <= 19) c.set(x2, y, D(la));
        }
      c.frame(1, top, 20, b, la);
      c.col(1, top, b, L(la));
      const fl = hex('#7a5a9a');
      vine(c, 5, b, 4, 24, 2);
      vine(c, 4, 24, 9, 16, 3);
      vine(c, 9, 16, 8, top + 2, 4);
      vine(c, 9, 18, 15, 12, 5);
      vine(c, 6, 28, 13, 26, 6);
      vine(c, 13, 26, 17, 18, 7);
      for (const [x, y] of [[4, 22], [10, 15], [14, 13], [7, 28], [16, 20], [12, 24]]) if (y > top) {
        c.set(x, y, fl);
        c.set(x + 1, y, hex('#a88ac0'));
        c.set(x, y + 1, hex('#a88ac0'));
      }
      if (u) {
        c.line(1, 10, 6, 3, la); // the top torn away and hanging
        c.line(12, 10, 20, 6, D(la));
        c.line(20, 10, 22, 22, la);
        c.line(21, 10, 23, 22, D(la));
        vine(c, 9, 12, 13, 4, 8);
        vine(c, 20, 12, 22, 20, 9);
        dots(c, la, [3, b, 8, b, 9, b - 1, 15, b, 24, b]);
        dots(c, C.leafLight, [5, b, 12, b, 22, b]);
      }
    },
    u: [0, 0, 3],
    sw: 8, sh: 38,
    s(c, u) {
      const b = c.h - 2,
        la = hex('#9a8f78');
      c.col(2, u ? 10 : 2, b, la);
      c.col(3, u ? 10 : 2, b, D(la));
      vine(c, 4, b, 4, 22, 2);
      vine(c, 4, 22, 5, u ? 12 : 8, 3);
      dots(c, hex('#7a5a9a'), [5, 22, 4, 15, 6, 27]);
      if (u) {
        c.line(3, 10, 7, 18, la);
        vine(c, 4, 11, 7, 17, 5);
        dots(c, la, [6, b, 8, b]);
      }
    },
    su: [0, 0, 2],
  });

  /* ---------- stone ---------- */
  add('stone-bench-garden', 'stone bench garden seat slab mossy carved old', {
    w: 30, h: 15, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [4, 21]) {
        c.rect(x, 7, x + 4, b, STONE); // scrolled supports
        c.col(x, 7, b, L(STONE));
        c.set(x + 2, 9, D(STONE));
        c.set(x + 2, 11, D(STONE));
        c.rect(x - 1, b - 1, x + 5, b, D(STONE));
      }
      if (!u) {
        board(c, 1, 4, 28, 6, STONE);
        dots(c, D(STONE), [6, 5, 13, 5, 22, 5]);
        moss(c, [2, 4, 3, 4, 10, 4, 18, 4, 19, 4, 26, 5, 5, b, 24, b - 2]);
      } else {
        c.poly([[1, 4], [13, 9], [13, 11], [1, 6]], STONE); // the slab broken in two and fallen in
        c.line(1, 4, 13, 9, L(STONE));
        c.poly([[28, 4], [16, 10], [16, 12], [28, 6]], STONE);
        c.line(28, 4, 16, 10, L(STONE));
        c.line(13, 9, 13, 11, SOOT);
        dots(c, STONE, [14, b, 15, b - 1, 12, b]);
        moss(c, [3, 5, 24, 6, 5, b]);
      }
    },
    sw: 12, sh: 15,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[3, 7], [8, 7], [9, 10], [8, b], [3, b], [2, 10]], STONE);
      c.col(3, 7, b, L(STONE));
      c.oval(4, 8, 7, 11, D(STONE));
      c.set(5, 9, STONE);
      c.rect(2, b - 1, 9, b, D(STONE));
      if (!u) {
        board(c, 1, 4, 10, 6, STONE);
        moss(c, [2, 4, 8, 4]);
      } else {
        c.rect(2, 8, 9, 10, STONE);
        c.row(8, 2, 9, L(STONE));
        c.line(4, 8, 6, 10, SOOT);
      }
    },
  });
  add('fountain-basin-dry', 'fountain stone basin garden fountain dry tiered bowl water', {
    w: 34, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(15, 3, 18, 8, STONE); // a stone pineapple on top
      c.set(16, 2, STONE);
      c.set(17, 2, D(STONE));
      dots(c, D(STONE), [15, 4, 17, 5, 16, 7, 18, 6]);
      c.poly([[9, 9], [24, 9], [21, 13], [12, 13]], STONE); // upper bowl
      c.row(9, 9, 24, L(STONE));
      c.rect(15, 14, 18, 23, STONE); // baluster
      c.col(15, 14, 23, L(STONE));
      c.rect(14, 17, 19, 19, STONE);
      c.col(19, 17, 19, D(STONE));
      stones(c, 2, 25, 31, b, STONE, 4, 7, 4);
      c.rect(1, 23, 32, 24, STONE);
      c.row(23, 1, 32, L(STONE));
      c.row(24, 3, 30, u ? WAT : hex('#3a3a34'));
      moss(c, [2, b, 3, b - 1, 12, b, 22, b - 1, 30, b, 10, 10, 22, 11, 16, 20, 5, 26, 27, 27]);
      if (!u) {
        dots(c, BROWNLEAF, [6, 24, 11, 24, 21, 24, 27, 24, 13, 9, 19, 9]); // dead leaves where the water was
        c.col(12, 14, 19, hex('#5a6a4a')); // a green stain
      } else {
        c.col(16, -2, 1, WAT); // running again
        c.set(17, -1, C.white);
        dots(c, C.white, [15, 0, 18, 0, 14, 2, 19, 2]);
        c.row(8, 10, 23, WAT);
        for (const x of [9, 24]) {
          c.col(x, 10, 22, WAT);
          c.set(x, 13, C.white);
          c.set(x, 19, C.white);
        }
        c.col(13, 13, 22, blend(WAT, C.white, 0.3));
        c.col(20, 13, 22, blend(WAT, C.white, 0.3));
        dots(c, C.white, [8, 24, 10, 24, 13, 24, 20, 24, 23, 24, 25, 24]);
        dots(c, WAT, [1, 26, 32, 28, 0, b]);
      }
    },
    u: [0, 3, 0],
  });
  add('pond-lilies', 'pond garden pond water lilies reeds stone edge dark water', {
    w: 38, h: 20,
    f(c, u) {
      const b = c.h - 2;
      c.oval(1, 9, 36, b, STONE);
      c.oval(3, 10, 34, b - 2, POND);
      const r = rnd(5);
      for (let x = 2; x < 36; x += 3) if (r() < 0.7) c.set(x, b - (x > 8 && x < 29 ? 0 : 2), D(STONE));
      for (let x = 4; x < 34; x += 4) c.set(x, b - 1 - (x < 9 || x > 28 ? 2 : 0), L(STONE));
      c.row(11, 6, 31, mix(POND, 0.8));
      for (const x of [5, 7, 9, 30]) {
        c.col(x, 2 + (x % 4), 11, hex('#4a6a44')); // reeds
        c.col(x, 2 + (x % 4), 3 + (x % 4), hex('#5a4634'));
      }
      c.line(8, 11, 11, 5, hex('#5a7a4a'));
      const pad = (x, y, fl) => {
        c.rect(x, y, x + 3, y, hex('#4a7a4a'));
        c.set(x + 1, y, hex('#6a9a5a'));
        if (fl) {
          c.set(x + 2, y - 1, C.white);
          c.set(x + 1, y - 1, hex('#d0a8b0'));
        }
      };
      pad(13, 12, true);
      pad(22, 13, false);
      pad(27, 12, true);
      if (!u) {
        pad(17, 14, false);
        pad(9, 13, false);
      } else {
        c.oval(14, 12, 21, 16, mix(POND, 1.5)); // something has come up under the lilies
        c.oval(15, 13, 20, 15, hex('#8fa39a'));
        c.set(16, 14, SOOT);
        c.set(19, 14, SOOT);
        c.row(11, 12, 23, mix(POND, 1.7));
        c.row(17, 13, 22, mix(POND, 1.7));
        dots(c, mix(POND, 1.7), [11, 13, 24, 14, 10, 15, 25, 16]);
        pad(8, 14, false);
      }
    },
    sw: 22, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      c.oval(1, 9, 20, b, STONE);
      c.oval(3, 10, 18, b - 2, POND);
      for (let x = 3; x < 20; x += 3) c.set(x, b - (x > 6 && x < 15 ? 0 : 2), D(STONE));
      for (const x of [4, 6, 16]) {
        c.col(x, 3 + (x % 4), 11, hex('#4a6a44'));
        c.col(x, 3 + (x % 4), 4 + (x % 4), hex('#5a4634'));
      }
      c.rect(11, 12, 14, 12, hex('#4a7a4a'));
      c.set(13, 11, C.white);
      if (!u) c.rect(6, 14, 9, 14, hex('#4a7a4a'));
      else {
        c.oval(6, 12, 12, 16, mix(POND, 1.5));
        c.oval(7, 13, 11, 15, hex('#8fa39a'));
        c.set(8, 14, SOOT);
        c.set(10, 14, SOOT);
        c.row(17, 6, 12, mix(POND, 1.7));
      }
    },
  });
  add('statue-nymph-plinth', 'statue nymph stone figure woman urn plinth garden statue mossy', {
    w: 16, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2,
        st = hex('#9a9a90');
      c.rect(2, b - 1, 13, b, D(STONE)); // plinth
      c.rect(3, 32, 12, b - 2, STONE);
      c.col(3, 32, b - 2, L(STONE));
      c.rect(2, 30, 13, 31, STONE);
      c.row(30, 2, 13, L(STONE));
      panel(c, 5, 34, 10, b - 4, STONE);
      c.poly([[5, 29], [5, 18], [10, 18], [11, 29]], st); // the long skirt
      c.line(6, 19, 6, 29, D(st));
      c.line(8, 20, 9, 29, D(st));
      c.col(5, 18, 29, L(st));
      c.rect(5, 10, 10, 17, st); // body
      c.col(5, 10, 17, L(st));
      c.row(17, 5, 10, D(st));
      c.rect(6, 4, 9, 8, st); // head
      c.row(4, 6, 9, D(st));
      c.set(6, 5, D(st));
      c.set(9, 5, D(st));
      c.rect(7, 9, 8, 9, st);
      dots(c, D(st), [7, 6, 9, 6]);
      c.col(4, 11, 16, st); // one arm down
      if (!u) {
        c.col(11, 5, 12, st); // the other raised to the jar on her shoulder
        c.rect(10, 2, 13, 5, st);
        c.row(2, 10, 13, L(st));
        c.set(12, 3, D(st));
      } else {
        c.set(11, 11, st); // arm and jar broken off
        c.set(11, 10, D(st));
        c.rect(12, b - 4, 15, b - 2, st);
        c.row(b - 4, 12, 15, L(st));
        c.set(13, b - 3, SOOT);
        c.line(11, b - 1, 15, b, st);
        dots(c, st, [0, b, 1, b - 1, 14, b - 1]);
      }
      moss(c, [5, 28, 6, 29, 10, 27, 4, 15, 9, 12, 6, 4, 3, b - 3, 12, 33, 7, 22]);
    },
    u: [0, 0, 2],
    sw: 14, sh: 44,
    s(c, u) {
      const b = c.h - 2,
        st = hex('#9a9a90');
      c.rect(1, b - 1, 12, b, D(STONE));
      c.rect(2, 32, 11, b - 2, STONE);
      c.col(2, 32, b - 2, L(STONE));
      c.rect(1, 30, 12, 31, STONE);
      c.row(30, 1, 12, L(STONE));
      c.poly([[4, 29], [5, 18], [8, 18], [10, 29]], st);
      c.line(6, 19, 7, 29, D(st));
      c.col(5, 18, 29, L(st));
      c.rect(5, 10, 8, 17, st);
      c.set(9, 12, st); // breast
      c.col(5, 10, 17, L(st));
      c.rect(5, 4, 8, 8, st);
      c.rect(5, 4, 6, 7, D(st)); // hair knotted behind
      c.set(4, 6, D(st));
      c.set(9, 6, st); // nose
      c.set(8, 5, D(st));
      c.rect(6, 9, 7, 9, st);
      if (!u) {
        c.col(7, 3, 4, st);
        c.rect(5, 1, 9, 3, st); // the jar
        c.row(1, 5, 9, L(st));
        c.col(8, 10, 15, D(st));
      } else {
        c.rect(10, b - 4, 13, b - 2, st);
        c.row(b - 4, 10, 13, L(st));
        c.set(13, b - 3, SOOT);
        dots(c, st, [14, b, 13, b - 1]);
      }
      moss(c, [5, 28, 9, 27, 6, 13, 2, b - 3, 11, 33]);
    },
    su: [0, 0, 2],
  });
  add('urn-pedestal-ivy', 'urn stone pedestal garden vase ivy trailing ornament', {
    w: 16, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 1, 12, b, D(STONE)); // pedestal
      c.rect(4, 20, 11, b - 2, STONE);
      c.col(4, 20, b - 2, L(STONE));
      c.rect(3, 18, 12, 19, STONE);
      c.row(18, 3, 12, L(STONE));
      moss(c, [4, b - 2, 5, b - 3, 10, 22, 11, b - 5]);
      const urn = (ox, oy) => {
        c.rect(ox + 2, oy + 9, ox + 5, oy + 10, STONE); // foot
        c.rect(ox + 3, oy + 7, ox + 4, oy + 8, STONE);
        c.oval(ox, oy + 2, ox + 7, oy + 7, STONE);
        c.rect(ox, oy + 1, ox + 7, oy + 3, STONE);
        c.row(oy, ox - 1, ox + 8, L(STONE));
        c.col(ox, oy + 1, oy + 5, L(STONE));
        dots(c, D(STONE), [ox + 2, oy + 3, ox + 4, oy + 3, ox + 6, oy + 3, ox + 6, oy + 5]);
      };
      if (!u) {
        urn(4, 7);
        c.rect(5, 5, 10, 6, C.leaf); // ivy heaped in it, and trailing
        dots(c, C.leafLight, [6, 5, 9, 4, 7, 4]);
        vine(c, 4, 7, 3, 16, 2);
        vine(c, 11, 7, 12, 24, 3);
        vine(c, 3, 16, 2, 22, 4);
      } else {
        c.row(17, 5, 10, D(STONE)); // only the foot left; the urn in pieces below
        c.rect(6, 15, 9, 16, STONE);
        c.poly([[13, b - 5], [18, b - 6], [20, b - 2], [19, b], [13, b]], STONE);
        c.line(13, b - 5, 18, b - 6, L(STONE));
        c.rect(14, b - 4, 16, b - 2, SOOT);
        c.line(17, b - 5, 16, b, SOOT);
        dots(c, STONE, [21, b, 22, b - 1, 12, b - 1]);
        heap(c, 15, 21, b, 2, SOIL, 2);
        vine(c, 14, b - 1, 22, b - 3, 5);
        vine(c, 11, 19, 12, 24, 3);
      }
    },
    u: [0, 0, 8],
  });

  /* ---------- hedges and beds ---------- */
  add('hedge-gap-torn', 'hedge gap hole clipped yew hedge way through torn', {
    w: 44, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      hedge(c, 1, 4, 42, b, 7);
      c.row(3, 3, 40, C.leafLight);
      dots(c, C.leaf, [6, 2, 14, 2, 15, 1, 29, 2, 36, 2, 37, 1]); // growing out of its shape
      const gap = u ? [[18, b], [18, 12], [21, 7], [26, 6], [30, 9], [31, b]] : [[21, b], [21, 19], [24, 16], [27, 17], [28, b]];
      c.poly(gap, SOOT);
      const tw = hex('#4a3c2c');
      if (!u) dots(c, tw, [21, 19, 22, 17, 28, 18, 24, 15]);
      else {
        dots(c, tw, [18, 12, 17, 14, 19, 9, 22, 6, 27, 5, 31, 9, 32, 12, 17, 20, 32, 18]); // forced: broken twigs
        c.line(18, 16, 21, 15, tw);
        c.line(31, 14, 28, 13, tw);
        c.rect(30, 15, 31, 17, C.blood); // a rag of cloth caught on them
        c.set(29, 16, C.red);
        dots(c, C.leafLight, [16, b, 20, b, 25, b, 33, b, 23, b - 1]);
        dots(c, hex('#2a3a30'), [22, 12, 26, 14, 24, 20]);
      }
    },
    sw: 14, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      hedge(c, 2, 4, 11, b, 9);
      c.row(3, 3, 10, C.leafLight);
      dots(c, C.leaf, [5, 2, 8, 2]);
      if (u) {
        dots(c, C.leafLight, [12, b, 13, b, 1, b]);
        dots(c, hex('#4a3c2c'), [12, 14, 13, 15, 12, 18]);
        c.set(13, 16, C.blood);
      }
    },
  });
  add('topiary-peacock', 'topiary bird peacock clipped box yew tub garden shape', {
    w: 22, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 6, b - 7, 15, b, WHITEP); // the tub
      panel(c, 8, b - 5, 13, b - 2, WHITEP);
      c.set(6, b - 8, WHITEP);
      c.set(15, b - 8, WHITEP);
      dots(c, GREYW, [7, b - 1, 14, b - 6, 10, b]);
      c.rect(10, b - 11, 11, b - 8, hex('#4a3c2c'));
      bush(c, 5, 17, 16, b - 11, 3);
      bush(c, 6, 9, 14, 17, 4); // the body
      c.poly([[5, 16], [1, 12], [1, 7], [4, 10], [7, 12]], C.leaf); // tail
      dots(c, C.leafLight, [2, 9, 3, 12, 5, 13]);
      if (!u) {
        bush(c, 13, 3, 17, 9, 5); // neck and head
        c.set(18, 5, C.leaf);
        c.set(19, 5, C.leafLight); // beak
        c.set(15, 2, C.leaf);
        c.set(16, 1, C.leafLight);
        dots(c, C.leaf, [9, 8, 3, 6]); // a shoot or two
      } else {
        c.rect(13, 9, 15, 9, hex('#b0a070')); // the head lopped off: pale cut wood
        dots(c, C.leaf, [17, b, 18, b - 1, 19, b, 16, b, 3, b]);
        dots(c, C.leafLight, [18, b, 20, b, 17, b - 1, 4, b]);
        c.rect(17, b - 2, 20, b - 1, C.leaf);
        c.line(1, b, 5, b - 4, C.steel); // the shears
        c.line(2, b - 3, 5, b, C.steel);
        c.set(1, b - 1, OAK);
      }
    },
    sw: 16, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      face(c, 3, b - 7, 12, b, WHITEP);
      panel(c, 5, b - 5, 10, b - 2, WHITEP);
      c.set(3, b - 8, WHITEP);
      c.set(12, b - 8, WHITEP);
      c.rect(7, b - 11, 8, b - 8, hex('#4a3c2c'));
      bush(c, 2, 17, 13, b - 11, 3);
      bush(c, 4, 9, 11, 17, 6);
      if (!u) {
        bush(c, 6, 3, 9, 9, 7); // looking at us
        c.set(7, 6, C.leafLight);
        c.set(7, 1, C.leaf);
        c.set(8, 2, C.leaf);
      } else {
        c.rect(6, 9, 9, 9, hex('#b0a070'));
        c.rect(11, b - 2, 14, b - 1, C.leaf);
        dots(c, C.leafLight, [13, b, 12, b - 2, 1, b]);
      }
    },
  });
  add('vegetable-bed-rows', 'vegetable bed raised bed cabbages leeks carrots kitchen garden rows', {
    w: 38, h: 14, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 7, 36, 9, SOIL);
      dots(c, mix(SOIL, 1.4), [4, 8, 11, 9, 19, 8, 27, 9, 33, 8]);
      board(c, 1, 10, 36, b, GREYW);
      c.col(12, 10, b, D(GREYW));
      c.col(25, 10, b, D(GREYW));
      moss(c, [2, b, 13, b, 30, b - 1]);
      const cab = (x) => {
        c.rect(x, 6, x + 3, 8, hex('#4f7a5a'));
        c.rect(x + 1, 5, x + 2, 6, hex('#7aa07a'));
        c.set(x, 6, hex('#6a9a6a'));
      };
      cab(3);
      if (!u) cab(8), cab(13);
      for (let x = 19; x <= 25; x += 2) c.col(x, 3 + (x % 4 ? 0 : 1), 7, hex('#5a8a5a')); // leeks
      for (let x = 28; x <= 34; x += 2) {
        c.set(x, 6, hex('#6a9a4a')); // carrot tops
        c.set(x + (x % 4 ? 1 : -1), 5, hex('#6a9a4a'));
        c.set(x, 7, hex('#6a9a4a'));
      }
      c.col(36, 1, 9, hex('#9a8f78')); // a cane with the seed packet on it
      c.rect(35, 1, 37, 3, C.paper);
      c.set(36, 2, C.red);
      if (u) {
        c.rect(8, 7, 11, 8, hex('#241a16')); // two cabbages gone: holes, and earth thrown on the path
        c.rect(13, 7, 16, 8, hex('#241a16'));
        dots(c, hex('#6a9a6a'), [9, 6, 17, 7]);
        c.rect(9, b, 14, b, SOIL);
        dots(c, SOIL, [11, b - 1, 12, b - 1, 16, b, 7, b]);
        c.rect(30, 7, 31, 8, hex('#241a16'));
        c.rect(29, b - 1, 32, b - 1, hex('#b0602a')); // a carrot dropped
        c.set(28, b - 1, hex('#6a9a4a'));
      }
    },
    sw: 18, sh: 14,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 7, 16, 9, SOIL);
      board(c, 1, 10, 16, b, GREYW);
      moss(c, [2, b, 12, b]);
      c.rect(3, 6, 6, 8, hex('#4f7a5a'));
      c.rect(4, 5, 5, 6, hex('#7aa07a'));
      for (let x = 9; x <= 13; x += 2) c.col(x, 4, 7, hex('#5a8a5a'));
      if (u) {
        c.rect(3, 5, 6, 8, hex('#241a16'));
        c.clearRect(3, 5, 6, 6);
        dots(c, SOIL, [4, b, 5, b - 1, 7, b]);
        c.set(6, 6, hex('#6a9a6a'));
      }
    },
  });
};
