/* Weird, part 1: house things that have gone wrong. Used = what happens when someone dares to touch them. */
module.exports = (H) => {
  const { C, K, hex, mix, blend, D, L, rnd, setting, dots, panel, drawer, legs, body, sideBody, slab, eye, eyes, eyeball, arm, drip, pool, paper, glow, figure, table, chairSide, chairFront } = H;
  const { bedSide, pillowSide, duvetSide, bedFront, pillowFront, duvetFront } = H;
  const odd = setting('env-weird', 'Weird');
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    IN = hex('#17151c'),
    VOID = hex('#120f1c'),
    DUSK = hex('#262040'), // another place's sky
    MEAT = hex('#9a4038'),
    MEATD = hex('#6e2a2a'),
    FAT = hex('#d0b49a'),
    GUM = hex('#a8606a'),
    ENAMEL = hex('#cfcabb'),
    ROOT = hex('#5a4630'),
    PALE = hex('#c9c4b0'); // skin that has not seen daylight

  /* ---------- a door standing alone ---------- */
  const DOORC = hex('#5f6a5c');
  odd(
    'door-standing-alone',
    'door standing alone in its frame nothing behind it free standing impossible',
    true,
    (c, u) => {
      c.rect(0, 0, 19, 39, WD);
      c.row(0, 0, 19, W);
      c.col(0, 0, 39, W);
      c.rect(-1, 40, 20, 40, W);
      if (u) {
        c.rect(2, 2, 17, 39, DUSK); // open: it is night in there, and there is a long way to go
        dots(c, C.white, [5, 6, 12, 4, 15, 10, 8, 13, 4, 18]);
        c.rect(12, 16, 14, 19, C.flameLight); // one lit window, far off
        c.poly([[10, 20], [16, 20], [17, 28], [9, 28]], VOID);
        c.poly([[8, 39], [10, 29], [12, 29], [14, 39]], hex('#3a3454')); // a path
        slab(c, -7, 3, 40, 7, DOORC);
        c.set(-6, 21, C.brass);
      } else {
        body(c, 2, 2, 17, 39, DOORC);
        panel(c, 4, 4, 15, 16, DOORC);
        panel(c, 4, 20, 15, 36, DOORC);
        c.rect(15, 18, 16, 19, C.brass);
        c.row(39, 2, 17, C.flameLight); // light under it, from no room
      }
    },
    (c, u) => {
      c.rect(0, 0, 3, 39, WD);
      c.col(0, 0, 39, W);
      c.rect(-1, 40, 4, 40, W);
      c.col(2, 2, 39, DOORC);
      if (u) {
        slab(c, 4, 3, 40, 12, DOORC);
        c.rect(14, 20, 15, 21, C.brass);
        c.col(3, 2, 39, DUSK);
      } else c.set(4, 19, C.brass);
    },
  );

  /* ---------- a staircase that ends ---------- */
  odd(
    'staircase-ends-nowhere',
    'staircase that ends in mid air stairs to nowhere broken off banister',
    true,
    (c, u) => {
      for (let i = 0; i < 8; i++) {
        c.rect(i * 4, 36 - i * 4, 33, 39 - i * 4, W);
        c.row(36 - i * 4, i * 4, i * 4 + 3, WL);
        c.col(i * 4, 37 - i * 4, 39 - i * 4, WD);
        c.col(i * 4 + 2, 27 - i * 4, 35 - i * 4, WD); // balusters
      }
      c.poly([[10, 39], [33, 16], [33, 39]], WD); // the dark under it
      c.poly([[6, 39], [33, 12], [33, 16], [10, 39]], W);
      c.line(1, 26, 31, -4, WL); // rail
      c.line(1, 27, 31, -3, W);
      c.rect(0, 23, 1, 36, WD);
      dots(c, WL, [34, 9, 35, 10, 34, 13, 34, 20, 35, 27, 34, 33]); // splintered where it stops
      if (u) {
        c.rect(27, -14, 33, 7, C.glow); // a door of light has opened at the top
        c.frame(27, -14, 33, 7, C.white);
        figure(c, 30, 7, 12, VOID);
      }
    },
    (c, u) => {
      for (let i = 0; i < 8; i++) {
        const k = i >> 1;
        c.rect(1 + k, 36 - i * 4, 14 - k, 39 - i * 4, mix(W, 1 - i * 0.05));
        c.row(36 - i * 4, 1 + k, 14 - k, WL);
      }
      c.line(0, 39, 4, 2, WD); // the rails closing in
      c.line(15, 39, 11, 2, WD);
      c.line(0, 27, 4, -4, WL);
      c.line(15, 27, 11, -4, W);
      c.col(0, 27, 39, WD);
      c.col(15, 27, 39, WD);
      if (u) {
        c.rect(5, -12, 10, 7, C.glow);
        c.frame(5, -12, 10, 7, C.white);
        figure(c, 7, 7, 11, VOID);
      } else dots(c, WL, [5, 7, 8, 6, 10, 7]);
    },
    { base: 'side' },
  );

  /* ---------- the wardrobe with stairs going down inside ---------- */
  odd(
    'wardrobe-stairs-down',
    'wardrobe with stairs going down inside secret staircase light below',
    true,
    (c, u) => {
      body(c, 1, 2, 22, 37, WD);
      c.rect(0, 0, 23, 2, WD);
      c.row(0, 0, 23, W);
      c.rect(1, 38, 22, 39, mix(WD, 0.7));
      if (u) {
        c.rect(3, 4, 20, 37, IN);
        c.row(6, 3, 20, C.brass);
        c.rect(3, 7, 5, 18, hex('#3d4a5c')); // coats pushed aside
        c.rect(18, 7, 20, 20, C.wine);
        for (let i = 0; i < 8; i++) {
          const y = 37 - i * 3,
            col = mix(W, 0.95 - i * 0.09);
          c.rect(4 + i, y - 2, 19 - i, y, D(col)); // steps going down and away
          c.row(y - 2, 4 + i, 19 - i, col);
        }
        c.rect(11, 12, 12, 14, C.flameLight); // a lamp a long way below
        c.set(11, 11, C.flame);
        slab(c, -5, 4, 37, 6, WD);
        slab(c, 23, 4, 37, 6, WD);
      } else {
        panel(c, 3, 5, 11, 35, WD);
        panel(c, 13, 5, 20, 35, WD);
        c.col(12, 4, 36, IN);
        c.set(11, 20, C.brass);
        c.set(13, 20, C.brass);
        c.row(37, 3, 20, C.flameLight); // light under the doors
        c.set(12, 36, C.flameLight);
        c.set(12, 35, C.flame);
      }
    },
    (c, u) => {
      sideBody(c, 1, 2, 10, 37, WD);
      c.rect(0, 0, 11, 2, WD);
      c.row(0, 0, 11, W);
      c.rect(1, 38, 10, 39, mix(WD, 0.7));
      if (u) {
        slab(c, 11, 4, 37, 9, WD);
        c.col(10, 5, 36, IN);
        c.rect(11, 38, 17, 39, hex('#8a7a3c')); // light and a cold draught on the floor
        c.set(10, 30, C.flameLight);
      } else c.set(10, 37, C.flameLight), c.set(11, 20, C.brass);
    },
  );

  /* ---------- a fridge full of eyes ---------- */
  function miniEye(c, x, y, bg = IN) {
    c.rect(x, y, x + 2, y + 2, C.white);
    c.set(x + 1, y + 1, K);
    c.set(x, y, bg);
    c.set(x + 2, y, bg);
    c.set(x, y + 2, D(C.white));
    c.set(x + 2, y + 2, bg);
  }
  odd(
    'fridge-of-eyes',
    'fridge full of eyes eyeballs refrigerator watching horror kitchen',
    true,
    (c, u) => {
      body(c, 0, 0, 13, 26, ENAMEL);
      c.clear(0, 0);
      c.clear(13, 0);
      c.rect(1, 27, 2, 27, C.ironDark);
      c.rect(11, 27, 12, 27, C.ironDark);
      if (u) {
        c.rect(1, 1, 12, 25, IN);
        c.row(1, 2, 11, C.glow); // the little light comes on
        for (let r = 0; r < 4; r++) {
          c.row(7 + r * 6, 1, 12, C.steel);
          for (let i = 0; i < 3; i++) miniEye(c, 1 + i * 4 + (r & 1), 4 + r * 6);
        }
        slab(c, -9, 1, 26, 9, ENAMEL); // the door, and there are more in it
        c.rect(-8, 3, -2, 24, hex('#9a9788'));
        miniEye(c, -7, 6, hex('#9a9788'));
        miniEye(c, -5, 14, hex('#9a9788'));
        miniEye(c, -7, 20, hex('#9a9788'));
        c.row(10, -8, -2, C.steel);
        c.row(18, -8, -2, C.steel);
      } else {
        c.row(8, 0, 13, D(ENAMEL));
        c.rect(11, 3, 11, 6, C.steel);
        c.rect(11, 11, 11, 16, C.steel);
        c.col(0, 9, 25, hex('#8a8e88')); // the seam, and something wet in it
        drip(c, 0, 20, 5, hex('#7a8a8c'));
        eye(c, 4, 4, 1); // a magnet? no
        dots(c, D(ENAMEL), [5, 14, 8, 20, 4, 22]);
      }
    },
    (c, u) => {
      sideBody(c, 0, 0, 11, 26, ENAMEL);
      c.clear(0, 0);
      c.rect(1, 27, 2, 27, C.ironDark);
      c.rect(9, 27, 10, 27, C.ironDark);
      if (u) {
        slab(c, 12, 1, 26, 10, ENAMEL);
        c.col(11, 2, 25, IN);
        miniEye(c, 13, 6, mix(ENAMEL, 0.9));
        miniEye(c, 15, 15, mix(ENAMEL, 0.9));
        c.rect(23, 25, 25, 27, C.white); // one has rolled out
        c.set(24, 26, K);
        c.set(23, 25, null);
      } else c.rect(12, 11, 12, 16, C.steel);
    },
  );

  /* ---------- the television that shows this room ---------- */
  odd(
    'television-shows-room',
    'television showing the room you are in screen figure watching old tv',
    true,
    (c, u) => {
      body(c, 0, 0, 19, 14, W);
      c.rect(2, 2, 13, 12, u ? hex('#8fa3a0') : hex('#56686a'));
      c.frame(1, 1, 14, 13, WD);
      c.rect(16, 3, 17, 4, C.bone); // knobs
      c.rect(16, 7, 17, 8, C.bone);
      dots(c, WD, [16, 11, 17, 11, 16, 12, 17, 12]);
      c.line(8, -1, 4, -6, C.steel); // aerial
      c.line(10, -1, 14, -6, C.steel);
      legs(c, [2, 16], 15, 21, WD);
      c.row(18, 3, 16, WD);
      if (u) {
        c.rect(5, 3, 10, 10, PALE); // it has turned round, and come right up to the glass
        c.rect(4, 2, 11, 3, IN);
        c.rect(5, 5, 6, 6, K);
        c.rect(9, 5, 10, 6, K);
        c.row(9, 6, 9, K);
        c.rect(2, 9, 3, 12, PALE); // one hand flat against it
        c.set(2, 8, PALE);
        c.rect(12, 10, 13, 12, PALE);
      } else {
        c.row(10, 2, 13, hex('#3a4648')); // the same room, from behind you
        c.rect(3, 6, 5, 9, W);
        c.set(4, 7, hex('#8fa3a0'));
        figure(c, 9, 11, 7, IN);
      }
    },
    (c, u) => {
      c.poly([[0, 3], [3, 1], [11, 0], [11, 14], [0, 13]], W);
      c.line(0, 3, 3, 1, WL);
      c.col(11, 0, 14, WD);
      c.col(10, 2, 12, u ? hex('#8fa3a0') : hex('#56686a'));
      c.line(6, -1, 3, -6, C.steel);
      legs(c, [1, 9], 15, 21, WD);
      if (u) {
        c.rect(12, 9, 14, 10, PALE); // fingers through the glass
        c.set(15, 9, PALE);
        c.rect(12, 5, 13, 5, PALE);
        c.col(12, 2, 4, hex('#8fa3a0'));
      }
    },
  );

  /* ---------- a clock with too many hands ---------- */
  odd(
    'clock-too-many-hands',
    'grandfather clock too many hands longcase clock wrong time',
    true,
    (c, u) => {
      body(c, 1, 2, 12, 12, WD);
      c.rect(0, 0, 13, 1, WD);
      c.row(0, 0, 13, W);
      c.oval(2, 2, 11, 11, C.bone);
      const cx = 6.5,
        cy = 6.5;
      if (u) for (const a of [1.2, 1.4, 1.57, 1.75, 1.95, 1.0, 2.15]) c.line(cx, cy, cx + 4.6 * Math.cos(a), cy + 4.6 * Math.sin(a), K); // all pointing down at you
      else for (const [a, r] of [[0.3, 4], [1.3, 3], [2.4, 4.5], [3.3, 3], [4.1, 4.5], [5.0, 3.5], [5.8, 4.5]]) c.line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a), K);
      c.rect(6, 6, 7, 7, C.brass);
      body(c, 3, 13, 10, 33, WD);
      body(c, 1, 34, 12, 41, WD);
      panel(c, 3, 36, 10, 39, WD);
      if (u) {
        c.rect(5, 15, 8, 31, IN); // the case open: hands of the other kind
        slab(c, 11, 15, 31, 3, WD);
        arm(c, 6, 18, 0, 17, PALE);
        arm(c, 7, 23, 13, 25, PALE);
        arm(c, 6, 28, 6, 33, PALE);
      } else {
        c.rect(5, 15, 8, 31, hex('#2c3338'));
        c.col(6, 15, 26, C.brass); // pendulum
        c.rect(5, 26, 7, 28, C.gold);
        c.set(4, 16, C.glass);
      }
    },
    (c, u) => {
      sideBody(c, 1, 2, 8, 12, WD);
      c.rect(0, 0, 9, 1, WD);
      c.row(0, 0, 9, W);
      c.col(8, 3, 11, C.bone);
      sideBody(c, 2, 13, 7, 33, WD);
      sideBody(c, 1, 34, 8, 41, WD);
      if (u) {
        slab(c, 8, 15, 31, 4, WD);
        arm(c, 8, 19, 14, 18, PALE);
        arm(c, 8, 26, 13, 28, PALE);
        c.rect(9, 5, 11, 6, K); // and the others, standing straight out
        c.rect(9, 8, 12, 8, K);
      } else c.set(9, 6, K), c.set(9, 8, K);
    },
  );

  /* ---------- a chair with human legs ---------- */
  odd(
    'chair-human-legs',
    'chair with human legs feet flesh walking furniture wrong',
    true,
    (c, u) => {
      const F = C.flesh,
        b = u ? 27 : 23; // it has stood up
      chairFront(c, 0, 13, { seat: 3, back: 14, w: 12 });
      for (const x of [0, 9]) {
        const lift = u && x === 9 ? 3 : 0;
        c.rect(x + 1, 14, x + 2, b - 2 - lift, D(F)); // the back pair
        c.rect(x, 14, x + 2, b - 1 - lift, F);
        c.col(x, 14, b - 1 - lift, L(F));
        c.row(14 + ((b - 14 - lift) >> 1), x, x + 2, D(F)); // a knee
        c.rect(x - 1, b - 1 - lift, x + 3, b - lift, F); // a foot
        dots(c, D(F), [x, b - lift, x + 2, b - lift]);
      }
    },
    (c, u) => {
      const F = C.flesh,
        b = u ? 27 : 23;
      c.rect(0, 0, 1, 13, W);
      c.col(0, 0, 13, WL);
      c.rect(0, 11, 9, 12, W);
      c.row(11, 0, 9, WL);
      const leg = (x, kx, fx, lift = 0) => {
        const k = 13 + ((b - 13 - lift) >> 1);
        c.line(x, 13, kx, k, F);
        c.line(x + 1, 13, kx + 1, k, D(F));
        c.line(kx, k, fx, b - 1 - lift, F);
        c.line(kx + 1, k, fx + 1, b - 1 - lift, D(F));
        c.rect(fx, b - lift, fx + 4, b - lift, F);
        c.rect(fx, b - 1 - lift, fx + 2, b - 1 - lift, F);
      };
      if (u) leg(1, 0, -3), leg(7, 10, 11, 2); // striding
      else leg(1, 2, 1), leg(7, 9, 7);
    },
  );

  /* ---------- a bed growing roots ---------- */
  function rootsFloor(c, x0, x1, b, seed) {
    const r = rnd(seed);
    c.row(b, x0, x1, ROOT);
    for (let x = x0; x <= x1; x += 2) if (r() < 0.6) c.set(x, b - 1, r() < 0.5 ? ROOT : D(ROOT));
    c.set(x0 - 1, b, D(ROOT));
    c.set(x1 + 1, b, D(ROOT));
  }
  const MOSSY = hex('#56634a');
  odd(
    'bed-growing-roots',
    'bed growing roots into the floor tree bed rooted moss shoots',
    true,
    (c, u) => {
      const g = bedSide(c, 0, 35, 19, { frame: WD, head: 17, foot: 11 });
      pillowSide(c, g);
      duvetSide(c, g, MOSSY, false);
      rootsFloor(c, -5, 41, 19, 3);
      for (const x of [0, 35]) c.line(x, 12, x + (x ? 3 : -3), 19, ROOT), c.line(x, 15, x + (x ? 5 : -5), 19, D(ROOT));
      c.line(8, 16, 4, 19, ROOT);
      c.line(20, 16, 24, 19, ROOT);
      c.line(1, 2, -2, -2, ROOT); // shoots from the headboard
      c.rect(-3, -4, -2, -3, C.leafLight);
      c.line(0, 4, 3, 0, ROOT);
      c.set(4, -1, C.leafLight);
      if (u) {
        c.oval(11, g.my - 3, 30, g.my + 2, MOSSY); // someone is under the roots now
        c.row(g.my - 3, 14, 27, L(MOSSY));
        for (const x of [12, 17, 22, 27]) c.line(x, g.my + 5, x + 3, g.my - 3, ROOT), c.line(x + 3, g.my - 3, x + 5, g.my + 3, D(ROOT));
        c.rect(30, g.my + 3, 31, g.my + 6, PALE); // a hand hangs out
        c.set(30, g.my + 7, PALE);
        c.set(32, g.my + 6, PALE);
      }
    },
    (c, u) => {
      const g = bedFront(c, 0, 17, 0, 33, { frame: WD, head: 17, foot: 11 });
      pillowFront(c, g);
      duvetFront(c, g, MOSSY, false);
      if (u) {
        c.oval(4, g.sy + 8, 13, g.ey, L(MOSSY));
        c.oval(5, g.sy + 9, 12, g.ey - 1, MOSSY);
        for (const y of [g.sy + 9, g.sy + 13, g.sy + 17]) c.line(1, y + 2, 9, y, ROOT), c.line(9, y, 16, y + 3, D(ROOT));
      }
      g.foot();
      rootsFloor(c, -4, 21, 33, 5);
      c.line(0, 25, -3, 33, ROOT);
      c.line(17, 25, 20, 33, ROOT);
      c.line(6, 28, 4, 33, ROOT);
      c.line(11, 27, 13, 33, D(ROOT));
      c.line(1, 1, -1, -3, ROOT);
      c.rect(-2, -5, -1, -4, C.leafLight);
      c.set(15, -1, ROOT);
      c.set(16, -2, C.leafLight);
      if (u) c.rect(3, 23, 4, 25, PALE), c.set(2, 26, PALE), c.set(4, 26, PALE);
    },
    { base: 'side' },
  );

  /* ---------- a bath of black water ---------- */
  odd(
    'bath-black-water-hand',
    'bath of black water hand rising clawfoot tub something in it',
    true,
    (c, u) => {
      c.poly([[1, 4], [35, 4], [32, 14], [5, 14]], ENAMEL);
      c.rect(0, 2, 36, 3, ENAMEL); // the rolled rim
      c.row(2, 0, 36, L(ENAMEL));
      c.row(4, 1, 35, D(ENAMEL));
      c.line(2, 5, 6, 13, L(ENAMEL));
      c.row(1, 2, 34, VOID); // brim full
      dots(c, hex('#3a3454'), [8, 1, 9, 1, 20, 1, 27, 1]);
      for (const x of [6, 29]) c.rect(x, 15, x + 2, 16, C.brass), c.rect(x - 1, 17, x + 3, 17, C.brass);
      c.rect(33, -3, 34, 1, C.steel); // tap
      c.rect(30, -3, 33, -2, C.steel);
      drip(c, 12, 4, 4, VOID);
      if (u) {
        arm(c, 17, 1, 17, -8, PALE); // it was waiting for that
        c.rect(22, 0, 25, 2, PALE); // and the other hand has the rim
        dots(c, PALE, [22, 3, 24, 3, 25, 3]);
        drip(c, 20, 4, 9, VOID);
        drip(c, 27, 4, 6, VOID);
        pool(c, 14, 30, 17, VOID);
      }
    },
    (c, u) => {
      c.poly([[1, 4], [16, 4], [14, 14], [3, 14]], ENAMEL);
      c.rect(0, 2, 17, 3, ENAMEL);
      c.row(2, 0, 17, L(ENAMEL));
      c.row(4, 1, 16, D(ENAMEL));
      c.line(2, 5, 4, 13, L(ENAMEL));
      c.row(1, 2, 15, VOID);
      for (const x of [3, 12]) c.rect(x, 15, x + 2, 16, C.brass), c.rect(x - 1, 17, x + 3, 17, C.brass);
      drip(c, 6, 4, 3, VOID);
      if (u) {
        arm(c, 8, 1, 8, -8, PALE);
        dots(c, PALE, [11, 2, 12, 2, 13, 2, 11, 3, 13, 3]);
        drip(c, 10, 4, 8, VOID);
        pool(c, 4, 15, 17, VOID);
      }
    },
    { base: 'side' },
  );

  /* ---------- a mirror reflecting someone else ---------- */
  odd(
    'mirror-someone-else',
    'mirror reflecting someone else wrong reflection cheval glass stranger',
    true,
    (c, u) => {
      const GL = hex('#3f5560');
      c.rect(0, 4, 1, 36, WD);
      c.rect(14, 4, 15, 36, WD);
      c.col(0, 4, 36, W);
      c.rect(-2, 36, 3, 37, WD);
      c.rect(12, 36, 17, 37, WD);
      c.rect(2, 0, 13, 33, WD);
      c.rect(3, 1, 12, 32, GL);
      c.row(0, 2, 13, W);
      c.line(4, 3, 7, 6, C.glass);
      if (u) {
        c.rect(5, 6, 10, 13, PALE); // right up against the glass now
        c.rect(4, 4, 11, 6, IN);
        c.col(4, 6, 16, IN);
        c.col(11, 6, 16, IN);
        c.rect(6, 9, 6, 9, K);
        c.rect(9, 9, 9, 9, K);
        c.rect(4, 15, 11, 32, hex('#8d8a7c'));
        c.rect(3, 17, 5, 20, PALE); // palms flat on it
        c.rect(10, 18, 12, 21, PALE);
        c.line(5, 21, 2, 27, C.glassLight); // and it is giving
        c.line(5, 21, 8, 26, C.glassLight);
        c.line(10, 22, 12, 28, C.glassLight);
      } else {
        figure(c, 8, 30, 15, hex('#8d8a7c')); // a woman in a pale dress, where you should be
        c.rect(7, 15, 10, 17, IN);
        c.rect(7, 18, 10, 19, PALE);
      }
    },
    (c, u) => {
      c.rect(2, 4, 3, 36, WD);
      c.col(2, 4, 36, W);
      c.rect(-1, 36, 7, 37, WD);
      c.line(2, 33, 5, 0, WD);
      c.line(3, 33, 6, 0, hex('#3f5560'));
      if (u) arm(c, 5, 18, 11, 19, PALE), c.set(5, 17, C.glassLight), c.set(6, 21, C.glassLight);
    },
  );

  /* ---------- a telephone made of meat ---------- */
  odd(
    'telephone-meat',
    'telephone made of meat flesh phone raw dripping hall table',
    true,
    (c, u) => {
      table(c, 0, 15, 12, 27, WD);
      c.poly([[3, 11], [12, 11], [11, 6], [4, 6]], MEAT);
      c.line(4, 6, 3, 11, L(MEAT));
      c.line(5, 9, 10, 8, FAT); // marbling
      c.set(11, 10, FAT);
      c.oval(6, 7, 9, 10, C.bone); // the dial
      c.rect(7, 8, 8, 9, MEATD);
      if (u) {
        c.rect(5, 4, 6, 5, MEATD); // the cradle, empty
        c.rect(9, 4, 10, 5, MEATD);
        c.line(12, 9, 17, 12, GUM); // the cord
        c.col(17, 12, 15, GUM);
        c.rect(16, 16, 18, 23, MEAT); // the receiver hanging, and it is breathing
        c.col(16, 16, 23, L(MEAT));
        c.rect(16, 16, 18, 17, C.bone);
        c.rect(16, 22, 18, 23, C.bone);
        drip(c, 17, 24, 2, C.blood);
        pool(c, 13, 21, 27, C.blood);
      } else {
        c.rect(2, 3, 13, 4, MEATD); // the receiver
        c.row(3, 3, 12, MEAT);
        c.rect(1, 3, 3, 6, C.bone);
        c.rect(12, 3, 14, 6, C.bone);
        c.line(13, 7, 15, 10, GUM);
        c.set(15, 11, GUM);
        drip(c, 14, 14, 3, C.blood);
      }
    },
    (c, u) => {
      table(c, 0, 9, 12, 27, WD);
      c.poly([[1, 11], [8, 11], [6, 6], [2, 6]], MEAT);
      c.line(2, 6, 1, 11, L(MEAT));
      c.line(6, 6, 8, 11, C.bone);
      c.set(4, 9, FAT);
      if (u) {
        c.line(8, 9, 11, 12, GUM);
        c.col(11, 12, 15, GUM);
        c.rect(10, 16, 12, 23, MEAT);
        c.rect(10, 16, 12, 17, C.bone);
        c.rect(10, 22, 12, 23, C.bone);
        pool(c, 8, 15, 27, C.blood);
      } else {
        c.rect(2, 3, 6, 5, MEATD);
        c.row(3, 2, 6, C.bone);
      }
    },
  );

  /* ---------- a piano with teeth ---------- */
  function teeth(c, x0, x1, y, h = 2, up = false) {
    for (let x = x0; x <= x1; x++) {
      const gap = (x - x0) % 3 === 2;
      c.col(x, y, y + h - 1, gap ? D(C.bone) : C.bone);
      if (gap) c.set(x, up ? y : y + h - 1, MEATD);
    }
  }
  odd(
    'piano-teeth',
    'piano with teeth instead of keys upright piano mouth gums',
    true,
    (c, u) => {
      const P = hex('#3a2a26');
      body(c, 0, 0, 29, 2, P);
      body(c, 0, 3, 29, 12, P);
      body(c, 0, 17, 29, 24, P);
      c.rect(0, 13, 29, 16, P);
      c.row(13, 2, 27, GUM); // gums
      teeth(c, 2, 27, 14, 2);
      c.set(9, 14, C.gold);
      c.set(9, 15, C.gold);
      legs(c, [0, 28], 25, 26, P);
      c.rect(12, 25, 13, 26, C.brass);
      c.rect(16, 25, 17, 26, C.brass);
      if (u) {
        c.rect(1, 3, 28, 12, MEATD); // the front has lifted: it was a mouth all along
        c.rect(3, 3, 26, 3, GUM);
        teeth(c, 3, 26, 4, 2, true);
        c.oval(8, 7, 21, 12, hex('#3a1418'));
        c.rect(14, 6, 15, 8, MEAT);
        c.poly([[10, 12], [19, 12], [20, 20], [17, 23], [12, 23], [9, 20]], GUM); // and the tongue
        c.col(14, 12, 22, D(GUM));
        c.line(10, 12, 9, 20, L(GUM));
        body(c, 0, -5, 29, -3, P);
        c.rect(0, -2, 1, 2, P);
        c.rect(28, -2, 29, 2, P);
      } else {
        panel(c, 3, 5, 26, 10, P);
        c.rect(11, 9, 18, 10, D(P)); // music rest
        panel(c, 3, 19, 26, 22, P);
      }
    },
    (c, u) => {
      const P = hex('#3a2a26');
      sideBody(c, 0, 0, 8, 24, P);
      c.rect(9, 13, 13, 16, P);
      c.row(13, 9, 13, GUM);
      c.rect(13, 14, 13, 15, C.bone);
      c.col(12, 17, 24, P);
      legs(c, [0, 11], 25, 26, P);
      if (u) {
        c.line(8, 3, 14, -3, P); // the jaw up
        c.line(9, 3, 15, -3, D(P));
        c.col(8, 4, 12, MEATD);
        c.poly([[9, 11], [14, 12], [16, 16], [16, 22], [14, 22], [13, 16]], GUM);
        c.line(14, 12, 16, 16, L(GUM));
      }
    },
  );
};
