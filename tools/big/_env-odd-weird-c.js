/* Weird, part 3: things growing where they should not, and things that watch. */
module.exports = (H) => {
  const { C, K, hex, mix, blend, D, L, rnd, setting, dots, panel, legs, body, sideBody, slab, eye, eyes, eyeball, arm, drip, pool, paper, glow, figure, books, shelves } = H;
  const odd = setting('env-weird', 'Weird');
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    IN = hex('#17151c'),
    VOID = hex('#120f1c'),
    SHADOW = hex('#2a2630'),
    MEAT = hex('#9a4038'),
    MEATD = hex('#6e2a2a'),
    GUM = hex('#a8606a'),
    PALE = hex('#c9c4b0'),
    ENAMEL = hex('#cfcabb'),
    SLIME = hex('#7c9668'),
    HAIR = hex('#1e1a1c');

  /* ---------- a pillar of televisions ---------- */
  function tv(c, x, y, w, h, col, on, seed) {
    body(c, x, y, x + w - 1, y + h - 1, col);
    const sx1 = x + w - 5,
      sy1 = y + h - 3;
    c.rect(x + 2, y + 2, sx1, sy1, on ? hex('#9aa8a4') : hex('#4a5052'));
    if (on) {
      const mx = (x + 2 + sx1) >> 1,
        my = (y + 2 + sy1) >> 1;
      c.oval(mx - 3, my - 2, mx + 3, my + 2, C.white); // every screen the same eye
      c.oval(mx - 1, my - 1, mx + 1, my + 1, hex('#4a6a5a'));
      c.set(mx, my, K);
      c.row(y + 2, x + 2, sx1, hex('#6a7672'));
    } else c.speckle(x + 2, y + 2, sx1, sy1, hex('#a9b0ac'), 3, seed), c.speckle(x + 2, y + 2, sx1, sy1, hex('#23282c'), 4, seed + 5);
    c.set(x + w - 3, y + 3, C.bone);
    c.set(x + w - 3, y + 5, C.bone);
    c.set(x + w - 3, y + h - 3, on ? C.red : hex('#5a2a28'));
  }
  const SETS = [
    [3, 0, 12, 9, hex('#4a3a30')],
    [2, 9, 14, 10, hex('#9a9788')],
    [1, 19, 16, 11, hex('#3a3c40')],
    [0, 30, 18, 13, hex('#6b4630')],
  ];
  odd(
    'televisions-pillar',
    'pillar of televisions stacked tv sets static screens tower',
    true,
    (c, u) => {
      SETS.forEach(([x, y, w, h, col], i) => tv(c, x, y, w, h, col, u, i + 2));
      c.line(8, -1, 5, -5, C.steel);
      c.line(10, -1, 13, -5, C.steel);
    },
    (c, u) => {
      SETS.forEach(([x, y, w, h, col]) => {
        const d = w - 4;
        c.poly([[10 - d + 2, y + 2], [10 - d + 4, y], [10, y], [10, y + h - 1], [10 - d + 2, y + h - 1]], col);
        c.col(10, y, y + h - 1, D(col));
        c.row(y, 10 - d + 4, 10, L(col));
        c.col(9, y + 2, y + h - 3, u ? hex('#9aa8a4') : hex('#4a5052'));
        if (u) c.set(11, y + (h >> 1), C.white), c.set(11, y + (h >> 1) - 1, hex('#9aa8a4'));
      });
      c.line(6, -1, 4, -5, C.steel);
    },
  );

  /* ---------- a cocoon ---------- */
  odd(
    'cocoon-corner',
    'cocoon in a corner silk pod man sized something inside threads',
    true,
    (c, u) => {
      const SILK = hex('#b5b09a');
      c.line(6, 3, -2, -3, C.ash); // threads holding it
      c.line(7, 3, 15, -3, C.ash);
      c.line(6, 3, 6, -3, C.ash);
      c.line(2, 20, -3, 26, C.ash);
      c.line(11, 22, 16, 29, C.ash);
      c.oval(1, 2, 12, 35, SILK);
      c.rect(3, 33, 10, 35, SILK);
      for (let y = 6; y < 34; y += 4) c.line(2, y + 2, 11, y - 1, D(SILK));
      c.line(3, 6, 2, 28, L(SILK));
      if (u) {
        c.poly([[6, 5], [8, 9], [9, 20], [8, 31], [6, 34], [4, 28], [5, 16], [4, 9]], IN); // split from inside, and empty
        c.line(4, 9, 3, 14, D(SILK));
        c.line(9, 20, 11, 25, D(SILK));
        drip(c, 5, 30, 5, SLIME);
        drip(c, 8, 28, 4, SLIME);
        pool(c, 3, 22, 35, SLIME);
        c.rect(20, 34, 21, 35, SLIME);
        c.set(24, 35, SLIME);
      } else {
        c.oval(5, 8, 8, 12, blend(SILK, IN, 0.45)); // a head, and shoulders
        c.rect(4, 14, 9, 27, blend(SILK, IN, 0.3));
        c.dither(4, 14, 9, 27, SILK);
      }
    },
    null,
    { round: true },
  );

  /* ---------- a hole in the air ---------- */
  odd(
    'hole-in-air',
    'hole in the air tear in nothing black rip hovering void',
    false,
    (c, u) => {
      const pts = u ? [[7, 0], [12, 2], [16, 8], [14, 16], [9, 20], [3, 17], [-1, 10], [2, 3]] : [[7, 2], [11, 4], [13, 9], [12, 15], [8, 18], [4, 15], [2, 9], [4, 4]];
      c.poly(pts, VOID);
      dots(c, C.white, [6, 7, 10, 12]);
      c.set(8, 10, hex('#3a3454'));
      c.rect(u ? -2 : 1, 9, u ? -1 : 1, 11, C.bone); // the air curling back at the edges
      c.rect(u ? 17 : 14, 7, u ? 18 : 14, 8, C.bone);
      c.set(u ? 9 : 8, u ? 21 : 19, C.bone);
      c.row(29, 3, 12, SHADOW);
      if (u) {
        arm(c, 8, 10, 13, 22, PALE, 2); // and something reaches through
        c.rect(13, 23, 15, 25, PALE);
        dots(c, PALE, [12, 26, 14, 27, 16, 26, 16, 23]);
      }
    },
    (c, u) => {
      c.rect(1, 2, 2, 18, VOID);
      c.set(0, 9, C.bone);
      c.set(3, 7, C.bone);
      c.row(29, 0, 3, SHADOW);
      if (u) arm(c, 3, 10, 11, 12, PALE), c.rect(1, 0, 2, 20, VOID);
    },
  );

  /* ---------- egg sacs ---------- */
  odd(
    'egg-sacs-cluster',
    'egg sacs cluster slimy eggs pods something growing inside',
    true,
    (c, u) => {
      const SAC = hex('#9aa884');
      const sac = (x0, y0, x1, y1, burst) => {
        c.oval(x0, y0, x1, y1, SAC);
        c.set(x0 + 1, y0 + 2, L(SAC));
        c.set(x0 + 2, y0 + 1, L(SAC));
        if (burst) {
          c.clearRect(x0, y0, x1, y0 + ((y1 - y0) >> 1) - 1);
          for (let x = x0; x <= x1; x += 2) c.set(x, y0 + ((y1 - y0) >> 1) - 1, D(SAC));
          c.row(y0 + ((y1 - y0) >> 1), x0 + 1, x1 - 1, IN);
        } else {
          c.oval(x0 + 2, y0 + 3, x1 - 2, y1 - 2, hex('#4a5240'));
          c.set(x0 + 3, y0 + 4, K);
          c.line(x0 + 1, y1 - 2, x1 - 1, y0 + 2, hex('#6e7a58'));
        }
      };
      pool(c, -2, 22, 15, SLIME);
      sac(0, 6, 6, 15, false);
      sac(14, 5, 20, 15, u);
      sac(5, 0, 14, 14, u);
      sac(10, 8, 16, 15, false);
      sac(3, 9, 8, 15, u);
      if (u) {
        pool(c, -5, 27, 15, SLIME);
        for (const x of [24, 29, 33]) c.rect(x, 14, x + 1, 15, hex('#2e3228')), c.set(x + 2, 14, hex('#2e3228')), c.set(x - 1, 15, SLIME); // and off they go
      }
    },
    null,
    { round: true },
  );

  /* ---------- a heart in a jar ---------- */
  odd(
    'heart-jar-beating',
    'heart in a jar that beats specimen pickled alive glass',
    false,
    (c, u) => {
      const G = hex('#6d8a80');
      c.rect(1, 3, 8, 15, G);
      c.col(1, 3, 15, C.glassLight);
      c.row(15, 1, 8, D(G));
      c.rect(1, u ? -1 : 0, 8, u ? 1 : 2, C.steel);
      c.row(u ? -1 : 0, 1, 8, L(C.steel));
      if (u) {
        c.oval(2, 4, 8, 13, MEAT); // one great beat
        c.rect(4, 3, 5, 5, MEATD);
        c.set(3, 6, hex('#c8605a'));
        c.line(6, 6, 5, 12, MEATD);
        c.line(8, 5, 10, 8, C.white); // the glass has gone
        c.line(8, 9, 9, 12, C.white);
        drip(c, 9, 9, 6, C.blood);
        pool(c, 5, 14, 16, C.blood);
        c.row(2, 1, 8, G);
      } else {
        c.oval(3, 7, 7, 12, MEAT);
        c.rect(4, 5, 5, 7, MEATD);
        c.set(4, 8, hex('#c8605a'));
        c.line(6, 8, 5, 11, MEATD);
        c.set(8, 5, C.glassLight);
      }
    },
    null,
    { round: true },
  );

  /* ---------- a vending machine of teeth ---------- */
  odd(
    'vending-machine-teeth',
    'vending machine of teeth dispenser coin slot molars glass front',
    true,
    (c, u) => {
      const M = hex('#3e5a58');
      body(c, 0, 0, 21, 39, M);
      c.rect(1, 1, 20, 4, C.bone); // the sign
      for (const x of [4, 9, 14]) c.rect(x, 2, x + 2, 3, M), c.set(x + 1, 3, C.bone);
      c.rect(2, 6, 14, 28, u ? hex('#59685c') : hex('#22282a'));
      for (let r = 0; r < 4; r++) {
        const y = 8 + r * 5;
        c.row(y + 4, 2, 14, C.steel);
        for (let i = 0; i < 3; i++) {
          if (u && r === 2 && i === 1) continue; // one sold
          const x = 3 + i * 4;
          c.rect(x, y, x + 2, y + 1, C.bone);
          c.set(x, y + 2, C.bone);
          c.set(x + 2, y + 2, C.bone);
          c.set(x + 1, y, C.white);
        }
      }
      if (u) c.row(6, 2, 14, C.glow);
      c.rect(16, 7, 19, 9, IN); // display
      c.set(17, 8, u ? C.red : hex('#5a2a28'));
      c.set(18, 8, u ? C.red : hex('#5a2a28'));
      for (let y = 12; y < 20; y += 2) c.set(16, y, C.steel), c.set(18, y, C.steel);
      c.rect(17, 22, 18, 25, IN); // the slot
      c.rect(3, 31, 14, 36, IN); // the tray
      c.row(31, 3, 14, C.steel);
      if (u) {
        c.rect(8, 33, 10, 34, C.bone); // it came out wet
        c.set(8, 35, C.bone);
        c.set(10, 35, C.bone);
        c.row(36, 6, 11, C.blood);
        c.set(9, 35, C.blood);
      }
      c.rect(1, 40, 3, 40, C.ironDark);
      c.rect(18, 40, 20, 40, C.ironDark);
    },
    (c, u) => {
      const M = hex('#3e5a58');
      sideBody(c, 0, 0, 13, 39, M);
      for (let y = 4; y < 12; y += 2) c.row(y, 3, 9, D(M)); // vents
      c.col(13, 6, 28, u ? C.glow : hex('#22282a'));
      c.rect(1, 40, 3, 40, C.ironDark);
      c.rect(10, 40, 12, 40, C.ironDark);
      if (u) c.rect(14, 33, 15, 35, C.bone), c.set(14, 36, C.blood);
    },
  );

  /* ---------- a tiny door in the skirting ---------- */
  odd(
    'door-tiny-skirting',
    'tiny door in the skirting board little door mouse sized who lives there',
    false,
    (c, u) => {
      const WALLP = hex('#7d7a66'),
        SK = hex('#b9b29a');
      c.rect(0, 0, 23, 4, WALLP);
      dots(c, D(WALLP), [2, 1, 7, 3, 12, 1, 17, 3, 22, 1]);
      body(c, 0, 5, 23, 13, SK);
      c.row(6, 0, 23, D(SK));
      if (u) {
        c.rect(9, 7, 14, 13, C.flameLight); // open, and lit inside
        c.rect(10, 6, 13, 6, C.flameLight);
        c.rect(6, 7, 8, 13, hex('#3d5a40'));
        c.col(6, 7, 13, hex('#587a5a'));
        c.rect(11, 10, 12, 13, IN); // someone in the doorway
        c.set(11, 9, IN);
        dots(c, PALE, [9, 9, 9, 11]); // and long fingers round the door
        c.rect(8, 9, 8, 9, PALE);
        c.rect(8, 11, 8, 11, PALE);
        c.poly([[9, 14], [14, 14], [18, 15], [7, 15]], hex('#8a7a3c'));
      } else {
        c.rect(9, 7, 14, 13, hex('#3d5a40'));
        c.rect(10, 6, 13, 6, hex('#3d5a40'));
        c.col(9, 7, 13, hex('#587a5a'));
        c.set(13, 10, C.brass);
        c.row(13, 9, 14, C.flameLight); // light under it
        c.rect(8, 14, 15, 14, hex('#6a5438')); // a doormat
      }
    },
    (c, u) => {
      c.rect(0, 0, 1, 4, hex('#7d7a66'));
      c.rect(0, 5, 2, 13, hex('#b9b29a'));
      c.col(0, 0, 13, L(hex('#b9b29a')));
      if (u) {
        c.rect(3, 7, 7, 13, hex('#3d5a40'));
        c.col(2, 7, 13, C.flameLight);
        c.rect(3, 14, 9, 14, hex('#8a7a3c'));
        c.set(8, 9, PALE);
      } else c.set(3, 10, C.brass), c.rect(3, 14, 6, 14, hex('#6a5438'));
    },
  );

  /* ---------- a radiator of ribs ---------- */
  odd(
    'radiator-ribs',
    'radiator made of ribs bone rib cage heating breathing',
    true,
    (c, u) => {
      const n = 7,
        gap = u ? 4 : 3,
        w = (n - 1) * gap + 2;
      c.rect(1, 3, w - 1, 17, u ? MEATD : hex('#3a1418'));
      if (u) c.oval((w >> 1) - 3, 6, (w >> 1) + 3, 14, MEAT), c.set((w >> 1) - 1, 8, hex('#c8605a')), c.rect(w >> 1, 9, w >> 1, 12, MEATD); // breathing in: there is something to breathe with
      for (let i = 0; i < n; i++) {
        const x = i * gap;
        c.rect(x, 3, x + 1, 17, C.bone);
        c.col(x, 4, 16, L(C.bone));
        c.set(x + 1, 17, D(C.bone));
        c.set(x, 3, D(C.bone));
      }
      for (let x = 0; x <= w; x += 2) c.rect(x, 0, x, 2, C.bone), c.set(x + 1, 1, D(C.bone)); // the spine along the top
      c.row(18, 0, w, C.iron);
      c.rect(-2, 16, -1, 18, C.brass); // the valve
      legs(c, [1, w - 2], 19, 20, C.ironDark);
      if (u) c.line(w >> 1, -2, (w >> 1) + 1, -5, C.ash), c.line((w >> 1) + 3, -1, (w >> 1) + 4, -3, C.ash);
    },
    (c, u) => {
      const k = u ? 2 : 0;
      c.rect(0, 0, 2, 2, C.bone);
      c.line(1, 3, 4 + k, 8, C.bone);
      c.line(2, 3, 5 + k, 8, D(C.bone));
      c.line(4 + k, 9, 1, 17, C.bone);
      c.line(5 + k, 9, 2, 17, D(C.bone));
      c.col(1, 4, 16, u ? MEATD : hex('#3a1418'));
      c.row(18, 0, 3, C.iron);
      legs(c, [0], 19, 20, C.ironDark);
    },
  );

  /* ---------- a sink growing hair ---------- */
  odd(
    'sink-hair-growing',
    'sink with hair growing from the plughole washbasin black hair drain',
    true,
    (c, u) => {
      c.poly([[0, 8], [15, 8], [13, 14], [2, 14]], ENAMEL);
      c.rect(-1, 7, 16, 8, ENAMEL);
      c.row(7, -1, 16, L(ENAMEL));
      c.poly([[5, 15], [10, 15], [9, 27], [6, 27]], ENAMEL);
      c.col(5, 15, 20, L(ENAMEL));
      c.rect(4, 27, 11, 27, D(ENAMEL));
      c.rect(7, 2, 8, 6, C.steel); // tap
      c.rect(6, 2, 9, 2, C.steel);
      c.rect(5, 6, 10, 6, HAIR); // out of the plughole and over the edge
      const len = u ? [19, 21, 20, 21, 18, 21] : [6, 9, 11, 8, 10, 5];
      len.forEach((n, i) => {
        c.col(5 + i, 7, 7 + n, i & 1 ? HAIR : hex('#2e282c'));
        if (n > 8) c.set(5 + i + (i & 1 ? 1 : -1), 7 + n, HAIR);
      });
      if (u) {
        c.col(8, 3, 6, VOID); // the tap on: more
        c.row(28, -3, 18, HAIR);
        c.row(27, 0, 4, HAIR);
        c.row(27, 12, 15, HAIR);
        dots(c, HAIR, [-4, 27, 19, 27, 20, 28]);
        drip(c, 1, 9, 5, VOID);
        drip(c, 14, 9, 4, VOID);
      }
    },
    (c, u) => {
      c.rect(0, 2, 1, 27, hex('#8d8672')); // the wall it hangs on
      c.poly([[2, 8], [12, 8], [10, 14], [2, 14]], ENAMEL);
      c.rect(2, 7, 13, 8, ENAMEL);
      c.row(7, 2, 13, L(ENAMEL));
      c.poly([[3, 15], [7, 15], [6, 27], [3, 27]], ENAMEL);
      c.rect(3, 3, 4, 6, C.steel);
      c.rect(3, 3, 7, 3, C.steel);
      const n = u ? 20 : 9;
      c.rect(9, 6, 12, 6, HAIR);
      c.col(12, 7, 7 + n, HAIR);
      c.col(13, 7, 5 + n, hex('#2e282c'));
      if (u) c.row(28, 9, 19, HAIR), c.col(7, 4, 6, VOID);
    },
  );

  /* ---------- an armchair with a mouth ---------- */
  odd(
    'armchair-mouth',
    'armchair with a mouth teeth chair that eats tongue upholstered',
    true,
    (c, u) => {
      const A = hex('#6e2a2e');
      c.rect(3, 1, 18, 14, A); // back
      c.row(0, 4, 17, A);
      c.row(1, 3, 18, L(A));
      c.rect(1, 2, 3, 12, A); // wings
      c.rect(18, 2, 20, 12, D(A));
      for (const x of [0, 17]) c.rect(x, 9, x + 4, 21, A), c.row(9, x, x + 4, L(A)), c.row(11, x, x + 4, D(A));
      c.rect(5, 15, 16, 18, A); // seat
      c.row(15, 5, 16, L(A));
      c.rect(5, 19, 16, 21, D(A));
      legs(c, [1, 19], 22, 23, WD);
      if (u) {
        c.rect(5, 4, 16, 16, hex('#3a1418')); // it opens
        for (let x = 5; x <= 16; x += 2) c.rect(x, 4, x, 5, C.bone), c.rect(x, 15, x, 16, C.bone);
        c.oval(8, 7, 13, 12, VOID);
        c.poly([[7, 14], [14, 14], [15, 21], [13, 25], [9, 25], [7, 21]], GUM); // and wants you to sit down
        c.col(10, 14, 24, D(GUM));
        c.line(7, 14, 7, 21, L(GUM));
      } else {
        dots(c, D(A), [7, 4, 11, 6, 15, 4, 9, 9, 13, 9]); // buttons
        c.row(14, 5, 16, hex('#3a1418'));
        for (let x = 5; x <= 16; x += 2) c.set(x, 14, C.bone); // a trim of something like teeth
      }
    },
    (c, u) => {
      const A = hex('#6e2a2e');
      c.rect(0, 0, 4, 21, A);
      c.col(0, 0, 21, L(A));
      c.rect(2, 2, 8, 12, A); // the wing
      c.row(2, 2, 8, L(A));
      c.rect(1, 9, 14, 21, A); // the arm
      c.row(9, 1, 14, L(A));
      c.row(11, 1, 14, D(A));
      c.col(14, 10, 21, D(A));
      legs(c, [0, 13], 22, 23, WD);
      if (u) {
        c.poly([[12, 14], [18, 15], [20, 20], [19, 25], [16, 25], [15, 19]], GUM);
        c.line(12, 14, 18, 15, L(GUM));
        c.rect(9, 4, 9, 8, C.bone);
      }
    },
  );

  /* ---------- a bookcase with eyes ---------- */
  const EYES = [[4, 6], [12, 5], [17, 7], [6, 15], [15, 14], [3, 24], [10, 23], [17, 25], [8, 32], [15, 33]];
  odd(
    'bookcase-eyes',
    'bookcase with eyes books that watch spines eyes open library wrong',
    true,
    (c, u) => {
      shelves(c, 0, 0, 21, 37, WD, 4, (i, x0, t, x1, b) => books(c, x0, x1 - (u && i === 2 ? 3 : 0), b, b - t - 1, 31 + i * 7));
      c.rect(-1, 0, 22, 1, WD);
      c.row(0, -1, 22, W);
      c.rect(0, 38, 21, 39, mix(WD, 0.7));
      for (const [x, y] of EYES) {
        if (u) eye(c, x, y, 1, C.white, K), c.row(y - 1, x, x + 2, IN), c.row(y + 1, x, x + 2, IN);
        else c.row(y, x, x + 2, IN), c.set(x + 1, y + 1, IN); // shut, for now
      }
      if (u) {
        c.rect(24, 38, 32, 39, C.paper); // one has thrown itself down, and it is looking too
        c.col(28, 37, 39, D(C.paper));
        c.row(37, 24, 32, C.wine);
        eye(c, 25, 38, 1);
      }
    },
    (c, u) => {
      sideBody(c, 0, 0, 8, 37, WD);
      c.rect(-1, 0, 9, 1, WD);
      c.row(0, -1, 9, W);
      c.rect(0, 38, 8, 39, mix(WD, 0.7));
      if (u) c.rect(11, 38, 18, 39, C.paper), c.row(37, 11, 18, C.wine), c.set(8, 15, C.white), c.set(8, 24, C.white), c.set(8, 6, C.white);
    },
  );

  /* ---------- a window on the wrong sky ---------- */
  odd(
    'window-wrong-sky',
    'window with the wrong view underwater outside sash window sea deep',
    true,
    (c, u) => {
      const SEA = hex('#2e5658'),
        WH = hex('#c4bfae');
      c.rect(0, 0, 19, 27, WH);
      c.row(0, 0, 19, L(WH));
      c.rect(2, 2, 17, 25, SEA);
      c.line(4, 2, 7, 12, hex('#3f6f6a')); // light coming down through it
      c.line(11, 2, 13, 9, hex('#3f6f6a'));
      c.col(4, 18, 25, hex('#2e4835')); // weed
      c.set(5, 20, hex('#2e4835'));
      c.col(15, 21, 25, hex('#2e4835'));
      dots(c, C.glassLight, [8, 16, 9, 12, 14, 6]);
      c.rect(-1, 28, 20, 29, WH); // sill
      c.row(28, -1, 20, L(WH));
      if (u) {
        c.rect(2, 2, 17, 4, WH); // the sash thrown up: and in it comes
        c.row(13, 2, 17, WH);
        c.row(14, 2, 17, D(WH));
        c.rect(2, 15, 17, 25, hex('#3f6f6a'));
        c.rect(3, 26, 16, 40, C.water);
        for (const x of [5, 9, 13]) c.col(x, 26, 40, C.glass);
        c.rect(-1, 28, 2, 29, WH);
        c.rect(17, 28, 20, 29, WH);
        pool(c, -6, 25, 41, C.water);
        c.rect(7, 17, 11, 21, PALE); // a face, coming with it
        c.set(8, 19, K);
        c.set(10, 19, K);
      } else {
        c.row(13, 2, 17, WH);
        c.row(14, 2, 17, D(WH));
        c.col(9, 2, 25, WH);
        c.poly([[10, 18], [15, 16], [17, 18], [15, 20]], hex('#1e3a3e')); // something large goes by
        c.set(15, 18, C.bone);
        c.rect(2, 40, 17, 41, hex('#8d8672')); // the wall under it
        c.rect(2, 30, 17, 39, hex('#8d8672'));
        c.col(2, 30, 41, L(hex('#8d8672')));
      }
    },
    (c, u) => {
      const WH = hex('#c4bfae');
      c.rect(0, 0, 2, 27, WH);
      c.col(0, 0, 27, L(WH));
      c.rect(0, 28, 4, 29, WH);
      c.rect(0, 30, 2, 41, hex('#8d8672'));
      c.col(2, 2, 25, hex('#2e5658'));
      if (u) {
        c.poly([[3, 15], [8, 17], [11, 26], [12, 40], [8, 40], [7, 28], [3, 25]], C.water);
        c.line(3, 15, 8, 17, C.glass);
        c.line(8, 17, 11, 26, C.glass);
        pool(c, 3, 22, 41, C.water);
      }
    },
  );
};
