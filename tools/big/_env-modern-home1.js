/* Modern home, part 1: the living room, the kitchen, the big bedroom. See env-modern.js for obj() and the helpers. */
module.exports = (T, obj) => {
  const { C, hex, mix, blend, rnd, D, L, X, dots, legs, panel, door, hole, scr, led, leds, vents, grille, cable, wisp, puddle, wheel, bottle, cup, cloth, stuff, shoes } = T;
  const VEL = X.VEL,
    CHECK = hex('#8a7a3a'),
    SAGE = hex('#5e6a52'),
    VINYL = hex('#5a3328'),
    LAM = hex('#5a4636'), // dark worktop laminate
    TRIM = hex('#8a6238'), // the oak strip on fitted kitchen doors
    DUVET = hex('#58707a'),
    BLADDER = hex('#232c44');

  /* ---------- seats ---------- */
  const sofaBody = (c, x0, x1, top, b, col, n) => {
    c.rect(x0, top, x1, b - 6, col);
    c.row(top, x0, x1, L(col));
    c.row(b - 9, x0, x1, D(col));
    c.rect(x0, b - 8, x1, b - 5, col);
    c.row(b - 8, x0, x1, L(col));
    for (let i = 1; i < n; i++) c.col(x0 + Math.round((i * (x1 - x0)) / n), top + 1, b - 5, D(col));
    c.rect(x0, b - 4, x1, b - 2, D(col));
    c.row(b - 4, x0, x1, mix(col, 0.5));
  };
  const sofaArm = (c, x, b, col, aw = 3) => {
    c.rect(x, b - 11, x + aw, b - 2, col);
    c.rect(x, b - 11, x + aw, b - 10, L(col));
    c.row(b - 9, x, x + aw, D(col));
  };
  const blanket = (c, x0, y0, x1, y1) => {
    c.rect(x0, y0, x1, y1, CHECK);
    for (let x = x0 + 1; x <= x1; x += 3) c.col(x, y0, y1, D(CHECK));
    for (let y = y0 + 1; y <= y1; y += 3) c.row(y, x0, x1, C.wine);
    c.row(y0, x0, x1, L(CHECK));
  };
  obj('corner-sofa-brown', 'corner sofa brown velour sectional couch l-shaped settee', {
    w: 44,
    h: 20,
    f(c, u) {
      const b = 18;
      sofaBody(c, 4, 31, 2, b, VEL, 3);
      sofaArm(c, 1, b, VEL);
      c.rect(39, 2, 42, b - 1, VEL); // the return comes towards the viewer: its back seen end on
      c.col(39, 2, b - 1, L(VEL));
      c.row(2, 39, 42, L(VEL));
      c.rect(30, b - 10, 38, b - 7, L(VEL)); // its seat, seen from above
      c.row(b - 10, 30, 38, mix(VEL, 1.4));
      c.col(34, b - 10, b - 7, VEL);
      c.rect(30, b - 6, 38, b - 3, VEL);
      c.row(b - 3, 30, 38, D(VEL));
      c.rect(30, b - 2, 38, b - 1, D(VEL));
      legs(c, [2, 30, 41], b - 1, b, C.woodDark);
      c.speckle(5, 3, 30, 9, mix(VEL, 0.85), 9, 3);
      if (u) {
        c.rect(5, b - 11, 10, b - 9, C.white); // a pillow and a blanket: someone slept here
        c.row(b - 9, 5, 10, D(C.white));
        blanket(c, 11, b - 9, 27, b - 4);
        c.rect(24, b - 3, 28, b - 1, CHECK);
        c.col(26, b - 3, b - 1, D(CHECK));
      }
    },
    sw: 30,
    sh: 20,
    s(c, u) {
      const b = 18;
      c.rect(1, 2, 4, b - 2, VEL); // the long part seen end on
      c.col(1, 2, b - 2, L(VEL));
      c.row(2, 1, 4, L(VEL));
      sofaBody(c, 12, 24, 2, b, VEL, 2); // the return, from its open side
      c.rect(2, b - 11, 11, b - 2, VEL);
      c.rect(2, b - 11, 11, b - 10, L(VEL));
      c.row(b - 9, 2, 11, D(VEL));
      c.col(11, b - 8, b - 2, D(VEL));
      sofaArm(c, 25, b, VEL);
      legs(c, [2, 27], b - 1, b, C.woodDark);
      if (u) {
        c.rect(5, b - 13, 9, b - 12, C.white);
        blanket(c, 6, b - 12, 10, b - 6);
        c.set(6, b - 5, CHECK);
        c.set(9, b - 5, CHECK);
      }
    },
  });

  obj('recliner-velour-green', 'recliner armchair reclining chair green velour footrest lever', {
    w: 18,
    h: 24,
    base: 'side',
    U: { own: true, w: 29, h: 24 },
    f(c, u) {
      const b = 22,
        col = SAGE,
        ox = u ? 7 : 0;
      if (u) {
        c.poly([[ox - 6, 9], [ox - 3, 6], [ox + 8, b - 11], [ox + 3, b - 9]], col); // the back let down
        c.line(ox - 6, 9, ox - 3, 6, L(col));
        c.line(ox - 3, 6, ox + 7, b - 12, L(col));
        c.rect(ox - 5, 7, ox - 2, 9, L(col));
        c.line(ox + 14, b - 4, ox + 19, b - 9, X.CHR); // the footrest out on its scissor
        c.line(ox + 14, b - 8, ox + 18, b - 5, X.CHR);
        c.rect(ox + 16, b - 10, ox + 20, b - 9, col);
        c.row(b - 10, ox + 16, ox + 20, L(col));
      } else {
        c.poly([[2, 3], [6, 2], [8, b - 11], [3, b - 11]], col);
        c.col(2, 3, b - 11, L(col));
        c.rect(3, 2, 7, 5, L(col)); // head cushion
        c.row(5, 3, 7, D(col));
      }
      c.rect(ox + 3, b - 12, ox + 14, b - 3, col); // the arm and the side
      c.rect(ox + 3, b - 12, ox + 14, b - 11, L(col));
      c.row(b - 10, ox + 3, ox + 14, D(col));
      c.rect(ox + 13, b - 9, ox + 15, b - 6, col); // the seat's front edge
      c.row(b - 9, ox + 13, ox + 15, L(col));
      c.rect(ox + 4, b - 3, ox + 14, b - 2, D(col));
      c.col(ox + 10, b - 8, b - 6, C.woodDark); // the lever
      c.set(ox + 10, b - (u ? 6 : 9), C.woodLight);
      legs(c, [ox + 4, ox + 13], b - 1, b, C.woodDark);
    },
    sw: 18,
    sh: 24,
    s(c, u) {
      const b = 22,
        col = SAGE,
        t = u ? 6 : 2;
      c.rect(4, t, 13, b - 6, col);
      c.row(t, 4, 13, L(col));
      c.rect(5, t + 1, 12, t + 4, L(col)); // head cushion
      c.row(t + 4, 5, 12, D(col));
      c.rect(4, b - 8, 13, b - 5, col);
      c.row(b - 8, 4, 13, L(col));
      c.rect(4, b - 4, 13, b - 2, D(col));
      for (const x of [1, 13]) {
        c.rect(x, b - 12, x + 3, b - 2, col);
        c.rect(x, b - 12, x + 3, b - 11, L(col));
        c.row(b - 10, x, x + 3, D(col));
      }
      legs(c, [2, 14], b - 1, b, C.woodDark);
      c.set(16, b - 8, C.woodLight);
      if (u) {
        c.rect(4, b - 7, 13, b - 4, L(col)); // the footrest, up
        c.row(b - 7, 4, 13, mix(col, 1.45));
        c.row(b - 3, 5, 12, mix(col, 0.4));
        c.set(5, b - 2, X.CHR);
        c.set(12, b - 2, X.CHR);
      }
    },
  });

  obj('coffee-table-smoked-glass', 'coffee table smoked glass chrome low table magazines ashtray', {
    w: 28,
    h: 14,
    f(c, u) {
      const b = 12;
      c.row(6, 1, 26, C.glassLight);
      c.row(7, 1, 26, C.glass);
      legs(c, [2, 24], 8, b, X.CHR, 2);
      c.row(b - 2, 4, 23, mix(C.glass, 0.7));
      c.rect(6, b - 4, 12, b - 3, C.paper); // magazines below
      c.row(b - 4, 6, 12, C.wine);
      c.rect(19, 5, 21, 5, C.stoneDark); // ashtray
      if (u) {
        cup(c, 5, 5, C.mustard);
        cup(c, 23, 5, C.white);
        c.rect(10, 5, 16, 5, C.paper); // an open magazine
        c.set(13, 5, D(C.paper));
        c.row(4, 19, 21, C.bone); // stubs
        wisp(c, 20, 3, 3);
        c.clearRect(6, b - 4, 12, b - 3);
        c.row(b - 3, 9, 12, C.paper);
      }
    },
    sw: 16,
    sh: 14,
    s(c, u) {
      const b = 12;
      c.row(6, 1, 14, C.glassLight);
      c.row(7, 1, 14, C.glass);
      legs(c, [2, 12], 8, b, X.CHR, 2);
      c.row(b - 2, 4, 11, mix(C.glass, 0.7));
      c.rect(5, b - 4, 9, b - 3, C.paper);
      c.row(b - 4, 5, 9, C.wine);
      c.rect(9, 5, 11, 5, C.stoneDark);
      if (u) {
        cup(c, 3, 5, C.mustard);
        c.row(4, 9, 11, C.bone);
        wisp(c, 10, 3, 3);
        c.clearRect(5, b - 4, 9, b - 3);
        c.row(b - 3, 6, 9, C.paper);
      }
    },
  });

  obj('tv-unit-vcr', 'television on tv unit with vcr video recorder tapes teak stand', {
    w: 28,
    h: 30,
    f(c, u) {
      const b = 28;
      c.box(1, 18, 26, b - 1, X.TEAK);
      hole(c, 3, 20, 24, 23, mix(X.TEAK, 0.35));
      c.rect(4, 21, 16, 23, X.BLK); // the video recorder
      c.row(21, 4, 16, mix(X.BLK, 1.6));
      c.rect(5, 22, 9, 22, mix(X.BLK, 0.6));
      c.rect(12, 22, 15, 22, u ? X.PHOS : mix(X.PHOS, 0.3));
      stuff(c, 18, 23, 23, 3, 5, [X.BLK, C.paper, C.wine, C.navy]); // tapes
      door(c, 3, 25, 13, b - 2, X.TEAK, 'r', C.brass);
      door(c, 14, 25, 24, b - 2, X.TEAK, 'l', C.brass);
      legs(c, [2, 24], b, b, C.woodDark, 2);
      c.box(4, 2, 23, 16, hex('#5b4634')); // the set: wood-effect case
      c.rect(5, 3, 18, 15, X.BLK);
      scr(c, 6, 4, 17, 14, u, 'tube', 2);
      if (u) {
        c.rect(9, 8, 11, 12, C.flesh); // somebody on the screen
        c.rect(9, 7, 11, 7, C.black);
        c.rect(8, 12, 12, 14, C.wine);
      }
      c.rect(20, 4, 22, 15, mix(X.BLK, 1.5));
      dots(c, X.CHR, [21, 5, 21, 7]);
      vents(c, 20, 10, 22, 14, X.BLK);
      led(c, 21, 15, u);
      legs(c, [5, 21], 17, 17, X.BLK, 2);
    },
    sw: 15,
    sh: 30,
    s(c, u) {
      const b = 28;
      c.box(1, 18, 13, b - 1, X.TEAK);
      c.col(13, 20, 23, mix(X.TEAK, 0.35));
      legs(c, [2, 11], b, b, C.woodDark, 2);
      c.poly([[3, 6], [8, 2], [11, 2], [11, 16], [3, 14]], hex('#5b4634')); // the tube runs back
      c.col(11, 2, 16, L(hex('#5b4634')));
      vents(c, 4, 8, 7, 12, mix(hex('#5b4634'), 0.6));
      c.col(12, 4, 14, u ? X.TUBEL : X.SCR0);
      if (u) c.col(13, 5, 13, blend(X.TUBE, X.TUBEL, 0.5));
      legs(c, [5, 10], 17, 17, X.BLK, 2);
    },
  });

  obj('hifi-tower-glass', 'hi-fi tower stereo stack system record player turntable cassette deck tuner glass door', {
    w: 15,
    h: 34,
    U: { h: 40, x(c) {
      c.rect(2, 2, 12, 8, mix(C.glass, 0.8)); // the lid up
      c.row(2, 2, 12, C.glassLight);
      c.line(4, 7, 8, 3, C.glassLight);
    } },
    f(c, u) {
      const b = 32;
      c.box(1, 8, 13, b, X.BLK);
      c.rect(2, 4, 12, 7, u ? X.BLK : mix(C.glass, 0.7)); // dust cover over the turntable
      if (!u) c.row(4, 2, 12, C.glassLight);
      else {
        c.row(6, 3, 10, hex('#17151c')); // the record
        c.row(7, 3, 10, hex('#3a3842'));
        c.set(6, 6, C.red);
        c.line(11, 4, 9, 6, X.CHR);
      }
      c.rect(2, 9, 12, 12, X.GREYL); // tuner
      c.row(10, 3, 11, u ? X.AMBER : mix(X.AMBER, 0.4));
      c.set(11, 12, X.BLK);
      c.rect(2, 14, 12, 17, X.GREYL); // amplifier
      dots(c, X.BLK, [4, 16, 7, 16, 10, 16]);
      leds(c, 3, 15, 4, 2, u, [X.LEDG, X.LEDG, X.AMBER, X.LEDR]);
      c.rect(2, 19, 12, 23, X.GREYL); // twin cassette deck
      c.rect(3, 20, 6, 22, X.SCR0);
      c.rect(8, 20, 11, 22, X.SCR0);
      if (u) dots(c, C.bone, [4, 21, 5, 21, 9, 21, 10, 21]);
      const r = rnd(4);
      for (let x = 2; x <= 12; x++) c.col(x, 25, b - 1, [C.wine, C.navy, C.paper, C.mustard, C.forest, C.black, C.rust][(r() * 7) | 0]); // records
      c.row(24, 2, 12, mix(X.BLK, 0.6));
    },
    sw: 11,
    sh: 34,
    SU: { h: 40, x(c) {
      c.line(2, 9, 5, 2, C.glassLight);
      c.line(3, 9, 6, 2, mix(C.glass, 0.8));
    } },
    s(c, u) {
      const b = 32;
      c.box(1, 8, 9, b, X.BLK);
      c.col(9, 9, 23, X.GREYL);
      c.set(9, 10, u ? X.AMBER : mix(X.AMBER, 0.4));
      c.set(9, 15, u ? X.LEDG : mix(X.LEDG, 0.35));
      if (!u) {
        c.rect(2, 4, 8, 7, mix(C.glass, 0.7));
        c.row(4, 2, 8, C.glassLight);
      } else c.row(7, 2, 8, hex('#3a3842'));
      c.col(9, 25, b - 1, C.wine);
      vents(c, 3, 12, 6, 18, mix(X.BLK, 1.5));
    },
  });

  obj('wall-unit-teak-bar', 'wall unit teak shelf unit sideboard display cabinet books ornaments drinks bar flap', {
    w: 34,
    h: 38,
    f(c, u) {
      const b = 36,
        W = X.TEAK,
        IN = mix(W, 0.4);
      c.box(1, 2, 32, b - 1, W);
      legs(c, [2, 29], b, b, C.woodDark, 3);
      hole(c, 3, 4, 11, 12, IN); // glass doors: the good glasses
      dots(c, C.glassLight, [4, 7, 6, 7, 8, 7, 10, 7, 5, 11, 7, 11, 9, 11]);
      c.row(8, 3, 11, W);
      c.col(7, 4, 12, mix(W, 0.7));
      hole(c, 13, 4, 21, 12, IN); // books
      c.row(8, 13, 21, W);
      stuff(c, 13, 21, 7, 3, 2, [C.wine, C.navy, C.forest, C.mustard, C.slate, C.paper]);
      stuff(c, 13, 20, 12, 3, 7, [C.plum, C.teal, C.rust, C.paper, C.black]);
      if (u) {
        hole(c, 23, 4, 31, 12, C.night); // the bar, lit, the flap let down
        c.rect(24, 5, 30, 5, C.glow);
        bottle(c, 24, 11, 5, C.forest);
        bottle(c, 27, 11, 6, hex('#7a5a22'));
        bottle(c, 29, 11, 4, C.glassLight);
        c.rect(23, 13, 31, 14, L(W));
        c.row(15, 23, 31, D(W));
        c.set(25, 12, C.glassLight);
      } else door(c, 23, 4, 31, 12, W, 't', C.brass);
      hole(c, 3, 15, 31, 22, IN); // the long open shelf
      if (u) c.rect(23, 15, 31, 15, D(W));
      c.rect(5, 18, 9, 22, C.bone); // a plate on a stand
      c.rect(6, 19, 8, 21, C.teal);
      c.rect(12, 20, 13, 22, C.brass); // a carriage clock
      c.rect(16, 17, 20, 22, C.black); // framed photograph
      c.rect(17, 18, 19, 21, C.flesh);
      c.set(18, 18, C.woodDark);
      c.rect(24, 20, 26, 22, X.AVO); // a vase
      c.set(25, 19, C.leaf);
      c.set(26, 18, C.leaf);
      door(c, 3, 25, 11, b - 2, W, 'r', C.brass);
      door(c, 13, 25, 21, b - 2, W, 'm', C.brass);
      door(c, 23, 25, 31, b - 2, W, 'l', C.brass);
      c.row(24, 2, 31, D(W));
    },
    sw: 10,
    sh: 38,
    SU: { w: 15, x(c) {
      c.rect(9, 13, 13, 14, L(X.TEAK)); // the flap
      c.row(15, 9, 13, D(X.TEAK));
      c.line(9, 9, 13, 13, C.brass);
      c.col(11, 9, 12, C.forest);
    } },
    s(c, u) {
      const b = 36,
        W = X.TEAK;
      c.box(1, 2, 8, b - 1, W);
      c.col(8, 15, 22, mix(W, 0.4));
      c.row(24, 1, 8, D(W));
      c.col(8, 4, 12, u ? C.glow : D(W));
      legs(c, [2, 6], b, b, C.woodDark, 2);
      c.speckle(2, 3, 7, b - 2, mix(W, 0.85), 8, 6);
    },
  });

  obj('dining-table-oilcloth', 'dining table oilcloth tablecloth checked fruit bowl family dinner', {
    w: 36,
    h: 20,
    f(c, u) {
      const b = 18,
        CL = hex('#b9b09a');
      legs(c, [3, 31], 10, b, X.PINE, 2);
      c.rect(1, 6, 34, 7, CL);
      c.row(6, 1, 34, L(CL));
      c.rect(2, 8, 33, 10, CL);
      for (let x = 2; x <= 33; x += 2) c.set(x, 9, C.wine); // the check
      for (let x = 3; x <= 33; x += 4) c.set(x, 10, D(CL));
      if (!u) {
        c.rect(15, 4, 20, 5, C.stoneLight); // the fruit bowl
        dots(c, C.red, [16, 3, 19, 3]);
        c.set(17, 3, X.AMBER);
        c.set(18, 2, C.leafLight);
      } else {
        for (const x of [5, 14, 25]) {
          c.row(5, x, x + 4, C.white); // plates, half eaten
          c.row(4, x + 1, x + 2, hex('#7a5a30'));
          c.set(x + 3, 4, X.AVO);
        }
        c.rect(11, 3, 11, 5, C.glassLight);
        bottle(c, 21, 5, 5, C.forest);
        c.rect(31, 4, 32, 5, C.glassLight); // a glass fallen
        c.row(5, 29, 30, C.wine);
        c.col(30, 6, 9, C.wine);
      }
    },
    sw: 22,
    sh: 20,
    s(c, u) {
      const b = 18,
        CL = hex('#b9b09a');
      legs(c, [3, 17], 10, b, X.PINE, 2);
      c.rect(1, 6, 20, 7, CL);
      c.row(6, 1, 20, L(CL));
      c.rect(2, 8, 19, 10, CL);
      for (let x = 2; x <= 19; x += 2) c.set(x, 9, C.wine);
      for (let x = 3; x <= 19; x += 4) c.set(x, 10, D(CL));
      if (!u) {
        c.rect(8, 4, 13, 5, C.stoneLight);
        dots(c, C.red, [9, 3, 12, 3]);
        c.set(10, 3, X.AMBER);
        c.set(11, 2, C.leafLight);
      } else {
        for (const x of [3, 13]) {
          c.row(5, x, x + 4, C.white);
          c.row(4, x + 1, x + 2, hex('#7a5a30'));
        }
        bottle(c, 10, 5, 5, C.forest);
        c.row(5, 17, 18, C.wine);
        c.col(18, 6, 9, C.wine);
      }
    },
  });

  obj('dining-chair-cantilever', 'dining chair chrome cantilever brown vinyl kitchen chair tube', {
    w: 12,
    h: 22,
    base: 'side',
    f(c, u) {
      const b = 20;
      c.col(2, 2, 12, X.CHR);
      c.rect(3, 3, 4, 9, VINYL);
      c.col(3, 3, 9, L(VINYL));
      c.rect(2, 12, 9, 13, VINYL);
      c.row(12, 2, 9, L(VINYL));
      c.col(9, 14, b - 1, X.CHR);
      c.row(b, 2, 9, X.CHR);
      c.set(9, b, D(X.CHR));
      if (u) {
        cloth(c, 1, 2, 5, 11, X.DENIM); // a jacket over the back
        c.row(2, 1, 5, L(X.DENIM));
        c.set(1, 12, X.DENIM);
      }
    },
    sw: 12,
    sh: 22,
    s(c, u) {
      const b = 20;
      c.col(2, 2, b, X.CHR);
      c.col(9, 2, b, X.CHR);
      c.rect(2, 3, 9, 9, VINYL);
      c.row(3, 2, 9, L(VINYL));
      dots(c, D(VINYL), [4, 6, 7, 6]);
      c.rect(2, 12, 9, 14, VINYL);
      c.row(12, 2, 9, L(VINYL));
      c.row(b, 2, 9, X.CHR);
      if (u) {
        c.rect(1, 2, 10, 10, X.DENIM);
        c.row(2, 1, 10, L(X.DENIM));
        c.col(5, 3, 10, D(X.DENIM));
        dots(c, C.brass, [6, 5, 6, 8]);
        c.rect(1, 11, 2, 13, X.DENIM);
        c.rect(9, 11, 10, 14, X.DENIM);
      }
    },
  });

  obj('breakfast-bar-pine', 'breakfast bar kitchen counter pine cladding worktop cereal', {
    w: 36,
    h: 27,
    f(c, u) {
      const b = 25;
      c.rect(1, 7, 34, 8, LAM);
      c.row(7, 1, 34, L(LAM));
      c.rect(3, 9, 32, b - 1, X.PINE);
      for (let x = 6; x <= 32; x += 4) c.col(x, 9, b - 1, D(X.PINE)); // tongue and groove
      c.row(9, 3, 32, mix(X.PINE, 0.6));
      c.row(b, 4, 31, C.woodDark);
      dots(c, mix(X.PINE, 0.6), [8, 14, 16, 19, 25, 12, 29, 21]);
      if (!u) {
        c.rect(27, 4, 30, 6, C.rust); // a biscuit tin
        c.row(4, 27, 30, L(C.rust));
      } else {
        c.rect(6, 2, 9, 6, C.mustard); // cereal box
        c.rect(7, 3, 8, 4, C.red);
        c.rect(12, 5, 16, 6, C.white); // bowl
        c.set(17, 4, X.CHR);
        c.rect(20, 3, 21, 6, C.white); // milk carton, on its side soon
        c.set(20, 2, C.navy);
        c.row(6, 22, 26, C.white); // spilt milk
        c.col(25, 7, 13, C.white);
        c.col(24, 7, 10, C.white);
        c.rect(27, 4, 30, 6, C.rust);
      }
    },
    sw: 13,
    sh: 27,
    s(c, u) {
      const b = 25;
      c.rect(1, 7, 11, 8, LAM);
      c.row(7, 1, 11, L(LAM));
      c.rect(2, 9, 9, b - 1, X.PINE);
      c.col(9, 9, b - 1, D(X.PINE));
      c.col(5, 9, b - 1, D(X.PINE));
      c.row(9, 2, 9, mix(X.PINE, 0.6));
      c.row(b, 3, 8, C.woodDark);
      if (!u) c.rect(5, 4, 8, 6, C.rust);
      else {
        c.rect(3, 2, 5, 6, C.mustard);
        c.rect(7, 5, 9, 6, C.white);
        c.row(6, 10, 11, C.white);
        c.col(11, 7, 12, C.white);
      }
    },
  });

  obj('bar-stool-chrome', 'bar stool chrome kitchen stool round seat vinyl footrest', {
    w: 11,
    h: 20,
    p: true,
    U: { own: true, w: 20, h: 11 },
    f(c, u) {
      if (u) {
        // kicked over
        c.rect(1, 2, 3, 9, VINYL);
        c.col(1, 2, 9, L(VINYL));
        c.rect(4, 5, 16, 6, X.CHR);
        c.col(10, 2, 9, X.CHR);
        c.col(17, 2, 9, X.CHR);
        c.col(18, 3, 8, D(X.CHR));
        return;
      }
      const b = 18;
      c.rect(2, 2, 8, 4, VINYL);
      c.row(2, 3, 7, L(VINYL));
      c.rect(5, 5, 5, b - 2, X.CHR);
      c.row(11, 2, 8, X.CHR);
      c.row(b - 1, 3, 7, X.CHR);
      c.row(b, 2, 8, D(X.CHR));
    },
    sw: 11,
    sh: 20,
    SU: { own: true, w: 11, h: 11 },
    s(c, u) {
      if (u) {
        c.oval(1, 1, 9, 9, X.CHR); // the foot, seen from below
        c.oval(2, 2, 8, 8, D(X.CHR));
        c.oval(4, 4, 6, 6, X.CHR);
        c.row(9, 3, 7, VINYL);
        return;
      }
      const b = 18;
      c.rect(2, 2, 8, 4, VINYL);
      c.row(2, 3, 7, L(VINYL));
      c.rect(5, 5, 5, b - 2, X.CHR);
      c.row(11, 3, 7, X.CHR);
      c.set(8, 11, X.CHR);
      c.row(b - 1, 3, 7, X.CHR);
      c.row(b, 2, 8, D(X.CHR));
    },
  });

  /* ---------- the fitted kitchen: melamine fronts with an oak strip ---------- */
  const kdoor = (c, x0, y0, x1, y1) => {
    door(c, x0, y0, x1, y1, X.MEL, '');
    c.row(y0, x0, x1, TRIM);
    c.row(y0 + 1, x0, x1, D(TRIM));
  };
  const kside = (c, x0, y0, x1, y1) => {
    c.box(x0, y0, x1, y1, X.MEL);
    c.col(x1, y0, y1, TRIM);
  };
  /** An open door seen from the front: the leaf stands out towards the viewer, hinged at x. */
  const leaf = (c, x, y0, y1, col = X.MEL) => {
    c.rect(x, y0, x + 2, y1 + 1, L(col));
    c.col(x + 2, y0, y1 + 1, D(col));
    c.set(x + 1, y0 + 1, TRIM);
  };
  obj('kitchen-unit-base-fitted', 'fitted kitchen base unit cupboard drawers worktop melamine oak trim', {
    w: 26,
    h: 20,
    U: { w: 29, dx: 3, x(c) {
      leaf(c, 1, 7, 17);
    } },
    f(c, u) {
      const b = 18;
      c.rect(1, 2, 24, 3, LAM);
      c.row(2, 1, 24, L(LAM));
      c.rect(2, 4, 23, b - 2, X.MEL);
      kdoor(c, 2, 4, 12, 6);
      kdoor(c, 13, 4, 23, 6);
      kdoor(c, 13, 7, 23, b - 2);
      if (u) {
        hole(c, 2, 7, 12, b - 2, mix(X.MEL, 0.3));
        c.row(12, 2, 12, mix(X.MEL, 0.5));
        c.rect(4, 9, 9, 11, X.GREYL); // pans
        c.row(9, 3, 10, X.CHR);
        c.rect(5, 14, 10, b - 3, C.ironDark);
        c.row(13, 5, 11, C.iron);
      } else kdoor(c, 2, 7, 12, b - 2);
      c.rect(3, b - 1, 22, b, mix(LAM, 0.7));
    },
    sw: 14,
    sh: 20,
    SU: { w: 22, x(c) {
      c.rect(12, 8, 19, 17, L(X.MEL));
      c.row(8, 12, 19, TRIM);
      c.col(19, 8, 17, D(X.MEL));
    } },
    s(c, u) {
      const b = 18;
      c.rect(1, 2, 12, 3, LAM);
      c.row(2, 1, 12, L(LAM));
      kside(c, 1, 4, 11, b - 2);
      c.rect(2, b - 1, 10, b, mix(LAM, 0.7));
      if (u) c.col(11, 7, b - 2, mix(X.MEL, 0.3));
    },
  });

  obj('kitchen-unit-wall-fitted', 'fitted kitchen wall cupboard hanging unit melamine mugs plates tins', {
    w: 26,
    h: 18,
    U: { w: 29, x(c) {
      leaf(c, 25, 2, 12);
    } },
    f(c, u) {
      c.rect(1, 1, 24, 13, X.MEL);
      kdoor(c, 1, 1, 12, 13);
      if (u) {
        hole(c, 13, 1, 24, 13, mix(X.MEL, 0.3));
        c.row(7, 13, 24, X.MEL);
        stuff(c, 14, 23, 6, 4, 3);
        for (let x = 14; x <= 20; x += 2) c.col(x, 9, 12, C.white); // plates on edge
        c.rect(21, 10, 23, 12, C.wine);
      } else kdoor(c, 13, 1, 24, 13);
      c.row(14, 1, 24, D(X.MEL));
      for (const x of [4, 9, 15]) {
        c.set(x, 15, X.CHR); // mugs on hooks
        c.rect(x - 1, 16, x + 1, 17, [C.mustard, C.white, X.AVO][(x >> 2) % 3]);
      }
      if (u) c.clearRect(8, 16, 10, 17);
    },
    sw: 9,
    sh: 18,
    SU: { w: 17, x(c) {
      c.rect(8, 2, 14, 13, L(X.MEL));
      c.row(2, 8, 14, TRIM);
      c.col(14, 2, 13, D(X.MEL));
    } },
    s(c, u) {
      kside(c, 1, 1, 7, 13);
      c.row(14, 1, 7, D(X.MEL));
      c.set(5, 15, X.CHR);
      c.rect(4, 16, 6, 17, C.mustard);
      if (u) c.col(7, 2, 12, mix(X.MEL, 0.3));
    },
  });

  obj('kitchen-unit-sink-fitted', 'fitted kitchen sink unit stainless steel mixer tap draining board washing up', {
    w: 26,
    h: 25,
    f(c, u) {
      const b = 23;
      c.rect(1, 7, 24, 8, X.CHR);
      c.row(7, 1, 24, L(X.CHR));
      c.rect(5, 7, 13, 7, mix(X.CHR, 0.6)); // the bowl
      c.col(9, 3, 6, X.CHR); // mixer tap
      c.row(2, 9, 12, X.CHR);
      c.set(12, 3, X.CHR);
      dots(c, C.red, [7, 6]);
      dots(c, C.navy, [11, 6]);
      c.rect(2, 9, 23, b - 2, X.MEL);
      kdoor(c, 2, 9, 12, b - 2);
      kdoor(c, 13, 9, 23, b - 2);
      c.rect(3, b - 1, 22, b, mix(LAM, 0.7));
      c.rect(21, 3, 22, 6, hex('#6f8a3c')); // washing-up liquid
      c.set(21, 2, C.white);
      if (u) {
        c.col(12, 4, 6, X.WATERL); // running
        c.row(6, 6, 13, C.white); // suds
        dots(c, C.white, [7, 5, 10, 5]);
        for (let x = 15; x <= 19; x += 2) c.col(x, 4, 6, C.white); // plates in the rack
        c.row(6, 14, 20, X.CHR);
        c.col(13, 9, 14, X.WATERL); // and running over
        puddle(c, 10, 17, b);
      }
    },
    sw: 14,
    sh: 25,
    s(c, u) {
      const b = 23;
      c.rect(1, 7, 12, 8, X.CHR);
      c.row(7, 1, 12, L(X.CHR));
      c.col(3, 3, 6, X.CHR);
      c.row(2, 3, 7, X.CHR);
      c.set(7, 3, X.CHR);
      kside(c, 1, 9, 11, b - 2);
      c.rect(2, b - 1, 10, b, mix(LAM, 0.7));
      if (u) {
        c.col(7, 4, 6, X.WATERL);
        c.row(6, 5, 9, C.white);
        c.col(12, 9, 14, X.WATERL);
        puddle(c, 10, 12, b);
      }
    },
  });

  obj('larder-unit-tall', 'tall larder unit kitchen cupboard food packets tins pantry melamine', {
    w: 16,
    h: 38,
    U: { w: 19, x(c) {
      leaf(c, 15, 3, 23);
    } },
    f(c, u) {
      const b = 36;
      c.rect(1, 2, 14, b - 2, X.MEL);
      if (u) {
        hole(c, 2, 3, 13, 23, mix(X.MEL, 0.3));
        for (const y of [8, 13, 18, 23]) {
          c.row(y, 2, 13, X.MEL);
          stuff(c, 3, 12, y - 1, 4, y);
        }
        c.rect(5, 20, 7, 22, C.white); // flour
        c.row(23, 4, 9, C.white);
      } else kdoor(c, 2, 3, 13, 23);
      kdoor(c, 2, 25, 13, b - 2);
      c.col(1, 2, b - 2, L(X.MEL));
      c.rect(2, b - 1, 13, b, mix(LAM, 0.7));
    },
    sw: 14,
    sh: 38,
    SU: { w: 23, x(c) {
      c.rect(12, 4, 20, 24, L(X.MEL));
      c.row(4, 12, 20, TRIM);
      c.col(20, 4, 24, D(X.MEL));
    } },
    s(c, u) {
      const b = 36;
      kside(c, 1, 2, 11, b - 2);
      c.rect(2, b - 1, 10, b, mix(LAM, 0.7));
      if (u) c.col(11, 3, 23, mix(X.MEL, 0.3));
    },
  });

  obj('dishwasher-open-rack', 'dishwasher white kitchen appliance racks plates', {
    w: 16,
    h: 20,
    f(c, u) {
      const b = 18;
      c.box(1, 2, 14, b - 1, X.APW);
      c.rect(2, 3, 13, 5, hex('#5a5048'));
      dots(c, X.APW, [3, 4, 5, 4]);
      c.rect(10, 3, 12, 5, X.GREYL);
      led(c, 7, 4, u, X.LEDG);
      c.rect(3, b, 12, b, X.BLK);
      if (!u) {
        c.row(7, 3, 12, D(X.APW)); // the grip along the top of the door
        c.row(8, 3, 12, mix(X.APW, 0.55));
      } else {
        hole(c, 2, 6, 13, b - 5, hex('#3a3d40'));
        c.row(9, 2, 13, X.CHR); // racks
        c.row(13, 2, 13, X.CHR);
        for (let x = 3; x <= 9; x += 2) c.col(x, 10, 12, C.white);
        dots(c, C.glassLight, [4, 8, 6, 8, 9, 8, 11, 8]);
        c.rect(11, 11, 12, 12, C.mustard);
        c.rect(1, b - 4, 14, b - 1, X.CHR); // the door let down, its steel inside
        c.row(b - 4, 1, 14, L(X.CHR));
        c.rect(5, b - 3, 10, b - 2, D(X.CHR));
        wisp(c, 7, 5, 3);
      }
    },
    sw: 14,
    sh: 20,
    SU: { w: 24, x(c) {
      c.rect(12, 16, 21, 17, X.APW); // the door flat
      c.row(16, 12, 21, X.CHR);
      c.row(13, 12, 19, X.CHR); // the lower rack drawn out
      for (let x = 13; x <= 18; x += 2) c.col(x, 10, 12, C.white);
      c.set(20, 12, C.ghost);
      c.set(19, 9, C.ghost);
    } },
    s(c, u) {
      const b = 18;
      c.box(1, 2, 12, b - 1, X.APW);
      c.col(12, 3, 5, hex('#5a5048'));
      c.rect(2, b, 10, b, X.BLK);
      if (u) c.col(12, 6, b - 3, hex('#3a3d40'));
      else c.set(12, 7, mix(X.APW, 0.55));
    },
  });

  obj('tumble-dryer-almond', 'tumble dryer almond beige laundry appliance drum clothes', {
    w: 16,
    h: 20,
    U: { w: 19, dx: 3, x(c) {
      c.rect(1, 7, 3, 14, L(X.PL)); // the door swung out
      c.col(1, 8, 13, C.glass);
    } },
    f(c, u) {
      const b = 18,
        B = X.PL;
      c.box(1, 2, 14, b - 1, B);
      c.rect(2, 3, 13, 5, hex('#6a5444'));
      c.rect(11, 3, 12, 4, X.CHR); // the timer
      led(c, 3, 4, u, X.AMBER);
      c.oval(4, 7, 11, 14, D(B));
      c.oval(5, 8, 10, 13, u ? hex('#2c2a30') : mix(C.glass, 0.6));
      if (!u) c.set(6, 9, C.glassLight);
      vents(c, 4, 16, 11, 16, D(B));
      c.rect(3, b, 12, b, X.BLK);
      if (u) {
        c.rect(6, 11, 9, 13, C.wine); // washing coming out
        c.rect(7, 13, 10, b - 1, X.DENIM);
        c.rect(9, 12, 10, 14, C.white);
        c.rect(8, b, 13, b, C.white);
        c.set(6, 10, C.mustard);
      }
    },
    sw: 14,
    sh: 20,
    SU: { w: 21, x(c) {
      c.row(7, 12, 18, L(X.PL)); // the door edge on
      c.row(8, 12, 18, C.glass);
      c.rect(12, 12, 14, 17, X.DENIM);
      c.rect(13, 11, 15, 13, C.wine);
      c.rect(12, 17, 17, 17, C.white);
    } },
    s(c, u) {
      const b = 18,
        B = X.PL;
      c.box(1, 2, 12, b - 1, B);
      c.col(12, 3, 5, hex('#6a5444'));
      c.col(12, 8, 13, u ? hex('#2c2a30') : D(B));
      c.rect(2, b, 10, b, X.BLK);
      vents(c, 2, 6, 4, 10, D(B)); // the hot air comes out at the back
    },
  });

  obj('chest-freezer-rusty', 'chest freezer white rusty garage freezer lid frost frozen meat', {
    w: 30,
    h: 19,
    U: { h: 30, x(c) {
      c.rect(1, 2, 28, 12, X.APW); // the lid up, its inside
      c.frame(2, 3, 27, 11, D(X.APW));
      c.row(2, 1, 28, L(X.APW));
      c.speckle(3, 4, 26, 10, C.ghost, 6, 2);
    } },
    f(c, u) {
      const b = 17,
        B = X.APW;
      c.box(1, 5, 28, b - 1, B);
      if (!u) {
        c.rect(1, 2, 28, 4, B);
        c.row(2, 1, 28, L(B));
        c.row(4, 1, 28, D(B));
        c.rect(13, 4, 16, 4, X.GREY);
      } else {
        c.rect(2, 3, 27, 4, C.ghost); // frost, and what is kept in it
        c.row(4, 2, 27, C.white);
        c.rect(5, 3, 8, 4, C.blood);
        c.rect(12, 2, 15, 4, hex('#8a6a5a'));
        c.rect(19, 3, 23, 4, C.blood);
        c.set(13, 2, C.white);
        dots(c, C.ghost, [9, 2, 17, 1, 24, 2]);
      }
      vents(c, 20, 11, 26, 15, D(B));
      c.set(14, 7, X.GREY); // the lock
      c.speckle(1, 10, 18, b - 1, C.rust, 14, 5);
      c.row(b - 1, 1, 28, blend(B, C.rust, 0.4));
      legs(c, [2, 26], b, b, X.BLK, 2);
    },
    sw: 16,
    sh: 19,
    SU: { h: 30, x(c) {
      c.rect(1, 2, 2, 13, X.APW);
      c.col(1, 2, 13, L(X.APW));
      c.col(3, 3, 12, C.ghost);
    } },
    s(c, u) {
      const b = 17,
        B = X.APW;
      c.box(1, 5, 14, b - 1, B);
      if (!u) {
        c.rect(1, 2, 14, 4, B);
        c.row(2, 1, 14, L(B));
        c.row(4, 1, 14, D(B));
      } else {
        c.rect(2, 3, 13, 4, C.ghost);
        c.rect(6, 3, 9, 4, C.blood);
        dots(c, C.ghost, [5, 2, 11, 1]);
      }
      c.speckle(1, 9, 14, b - 1, C.rust, 12, 8);
      c.row(b - 1, 1, 14, blend(B, C.rust, 0.4));
      legs(c, [2, 12], b, b, X.BLK, 2);
    },
  });

  obj('ironing-board-iron', 'ironing board with iron laundry shirt steam scorch burn', {
    w: 32,
    h: 21,
    base: 'side',
    p: true,
    f(c, u) {
      const b = 19,
        COVER = hex('#7d8fa0');
      c.line(7, 9, 23, b, X.CHR);
      c.line(23, 9, 7, b, X.CHR);
      c.rect(2, 7, 27, 8, COVER);
      c.row(7, 2, 28, L(COVER));
      c.set(28, 8, COVER);
      c.set(29, 7, COVER);
      dots(c, D(COVER), [6, 8, 10, 8, 14, 8, 18, 8, 22, 8]);
      c.row(9, 3, 26, X.GREY);
      if (!u) {
        c.rect(3, 4, 7, 6, X.APW); // the iron lying on its rest
        c.row(6, 3, 8, X.CHR);
        c.rect(4, 3, 6, 3, X.BLK);
        cable(c, [[3, 5], [1, 8], [2, 14]], X.BLK);
      } else {
        c.rect(9, 7, 22, 12, C.white); // a shirt
        c.rect(11, 13, 20, 13, C.white);
        c.col(15, 7, 13, D(C.white));
        c.poly([[16, 8], [20, 8], [20, 11], [18, 11]], hex('#6a4a2a')); // scorched
        c.rect(3, 2, 5, 6, X.APW); // the iron stood on end
        c.col(6, 2, 6, X.CHR);
        c.set(4, 1, X.BLK);
        wisp(c, 8, 4, 4);
        cable(c, [[3, 5], [1, 8], [2, 14]], X.BLK);
      }
    },
    sw: 14,
    sh: 21,
    s(c, u) {
      const b = 19,
        COVER = hex('#7d8fa0');
      c.line(6, 9, 3, b, X.CHR);
      c.line(7, 9, 10, b, X.CHR);
      c.row(b, 2, 4, X.CHR);
      c.row(b, 9, 11, X.CHR);
      c.rect(2, 7, 11, 8, COVER);
      c.row(7, 2, 11, L(COVER));
      c.row(9, 4, 9, X.GREY);
      if (!u) {
        c.rect(5, 4, 8, 6, X.APW);
        c.row(6, 5, 8, X.CHR);
        c.rect(6, 3, 7, 3, X.BLK);
      } else {
        c.rect(1, 7, 12, 8, C.white);
        c.rect(1, 9, 2, 13, C.white);
        c.rect(11, 9, 12, 12, C.white);
        c.rect(6, 7, 8, 8, hex('#6a4a2a'));
        c.rect(5, 2, 8, 6, X.APW);
        c.row(6, 5, 8, X.CHR);
        c.set(6, 1, X.BLK);
        wisp(c, 10, 5, 4);
      }
    },
  });

  obj('exercise-bike-home', 'exercise bike home trainer fitness cycle flywheel spare room', {
    w: 26,
    h: 27,
    base: 'side',
    f(c, u) {
      const b = 25,
        F = hex('#c9c4b4');
      c.row(b, 3, 9, X.BLK);
      c.row(b, 16, 23, X.BLK);
      c.line(6, b - 1, 12, b - 7, F); // frame
      c.line(12, b - 7, 19, b - 6, F);
      c.rect(8, 9, 9, b - 7, F); // seat post
      c.rect(5, 7, 11, 8, X.BLK); // saddle
      c.row(7, 5, 10, mix(X.BLK, 1.6));
      c.line(19, b - 6, 19, 6, F); // the handlebar post
      c.line(20, b - 6, 20, 6, D(F));
      wheel(c, 19, b - 6, 5, X.GREY, X.CHR);
      c.oval(16, b - 9, 22, b - 3, X.GREYL);
      c.set(19, b - 6, X.BLK);
      c.rect(18, 3, 21, 5, X.BLK); // the little computer
      c.set(19, 4, u ? X.LEDR : mix(X.LEDR, 0.35));
      c.set(20, 4, u ? X.LEDR : mix(X.LEDR, 0.35));
      c.row(6, 15, 18, X.BLK); // grips
      c.set(15, 5, X.BLK);
      if (u) {
        c.line(12, b - 7, 14, b - 3, X.CHR); // the pedals gone round
        c.row(b - 2, 13, 15, X.BLK);
        cloth(c, 14, 6, 17, 13, C.white); // a towel
        c.row(8, 14, 17, C.teal);
        bottle(c, 1, b, 5, C.glassLight);
      } else {
        c.line(12, b - 7, 12, b - 3, X.CHR);
        c.row(b - 2, 11, 13, X.BLK);
      }
    },
    sw: 14,
    sh: 27,
    s(c, u) {
      const b = 25,
        F = hex('#c9c4b4');
      c.row(b, 2, 11, X.BLK);
      c.rect(6, b - 11, 7, b - 1, X.GREY); // the flywheel edge on
      c.col(6, b - 11, b - 1, X.GREYL);
      c.rect(6, 6, 7, b - 12, F);
      c.row(6, 2, 11, X.BLK);
      c.set(2, 5, X.BLK);
      c.set(11, 5, X.BLK);
      c.rect(5, 3, 8, 5, X.BLK);
      c.set(6, 4, u ? X.LEDR : mix(X.LEDR, 0.35));
      c.set(7, 4, u ? X.LEDR : mix(X.LEDR, 0.35));
      c.rect(4, 8, 9, 9, mix(X.BLK, 1.5)); // the saddle behind
      c.row(b - 4, 3, 5, X.BLK);
      c.row(b - 8, 8, 10, X.BLK);
      if (u) {
        cloth(c, 2, 6, 4, 13, C.white);
        c.row(8, 2, 4, C.teal);
        bottle(c, 11, b, 5, C.glassLight);
      }
    },
  });

  obj('office-desk-computer', 'home office desk with computer monitor keyboard beige pc desk lamp study', {
    w: 34,
    h: 27,
    f(c, u) {
      const b = 25,
        TOP = X.MEL;
      c.rect(1, 14, 32, 15, TOP);
      c.row(14, 1, 32, L(TOP));
      c.rect(2, 16, 3, b, D(TOP));
      c.box(22, 16, 31, b, TOP);
      for (const y of [16, 19, 22]) door(c, 23, y, 30, y + 2, TOP, 'm', X.BLK);
      c.row(17, 4, 21, D(TOP)); // the rail under the top
      c.box(4, 10, 18, 13, X.PL); // the computer: a flat case, the monitor on it
      c.row(12, 12, 16, X.BLK);
      led(c, 6, 12, u, X.LEDG);
      c.box(5, 1, 16, 9, X.PL);
      scr(c, 6, 2, 14, 8, u, 'text', 4);
      c.set(15, 8, X.GREY);
      c.rect(6, 13, 17, 13, L(X.PL)); // keyboard
      dots(c, X.GREY, [7, 13, 9, 13, 11, 13, 13, 13, 15, 13]);
      c.rect(27, 13, 30, 13, X.BLK); // desk lamp
      c.line(28, 12, 26, 8, X.BLK);
      c.line(26, 8, 23, 6, X.BLK);
      c.rect(20, 5, 23, 6, X.BLK);
      c.row(7, 20, 22, u ? C.flameLight : X.GREY);
      if (u) {
        dots(c, C.glow, [20, 8, 22, 8, 21, 9]);
        c.rect(19, 13, 23, 13, C.paper);
        cup(c, 1, 13, C.wine);
      }
    },
    sw: 17,
    sh: 27,
    s(c, u) {
      const b = 25,
        TOP = X.MEL;
      c.rect(1, 14, 15, 15, TOP);
      c.row(14, 1, 15, L(TOP));
      c.box(2, 16, 13, b, TOP);
      c.col(13, 16, 23, D(TOP));
      c.rect(3, 10, 12, 13, X.PL);
      c.row(10, 3, 12, L(X.PL));
      c.poly([[3, 4], [7, 1], [11, 1], [11, 9], [3, 8]], X.PL);
      c.col(11, 1, 9, L(X.PL));
      vents(c, 4, 4, 6, 7, D(X.PL));
      c.col(12, 2, 8, u ? X.PHOS : X.SCR0);
      c.rect(11, 13, 14, 13, L(X.PL));
      if (u) c.set(13, 5, mix(X.PHOS, 0.6));
    },
  });

  obj('office-chair-swivel-grey', 'office chair swivel chair castors grey fabric computer chair', {
    w: 14,
    h: 23,
    f(c, u) {
      const b = 21,
        F = hex('#55607a');
      if (u) {
        c.rect(3, 2, 10, 13, X.BLK); // turned its back
        c.row(2, 4, 9, mix(X.BLK, 1.6));
        c.col(3, 3, 12, mix(X.BLK, 1.4));
        c.rect(6, 5, 7, 10, mix(X.BLK, 0.7));
        c.rect(2, 13, 11, 14, F);
      } else {
        c.rect(3, 2, 10, 9, F);
        c.row(2, 4, 9, L(F));
        c.col(3, 3, 9, L(F));
        c.rect(6, 10, 7, 11, X.BLK);
        c.rect(2, 12, 11, 14, F);
        c.row(12, 2, 11, L(F));
        c.row(14, 2, 11, D(F));
        c.rect(1, 9, 1, 12, X.BLK);
        c.rect(12, 9, 12, 12, X.BLK);
      }
      c.rect(6, 15, 7, b - 2, X.CHR);
      c.row(b - 2, 2, 11, X.BLK);
      c.row(b - 1, 4, 9, X.BLK);
      dots(c, X.GREY, [2, b - 1, 2, b, 11, b - 1, 11, b, 6, b, 7, b]);
    },
    sw: 14,
    sh: 23,
    s(c, u) {
      const b = 21,
        F = hex('#55607a'),
        m = (x) => (u ? 13 - x : x);
      for (let y = 2; y <= 10; y++) {
        c.set(m(2), y, X.BLK); // the shell of the back
        c.set(m(3), y, F);
        c.set(m(4), y, y < 4 ? L(F) : F);
      }
      c.line(m(3), 11, m(5), 13, X.BLK);
      for (let x = 3; x <= 11; x++) {
        c.set(m(x), 12, L(F));
        c.set(m(x), 13, F);
        c.set(m(x), 14, D(F));
      }
      c.set(m(8), 10, X.BLK);
      c.set(m(9), 10, X.BLK);
      c.set(m(8), 11, X.BLK);
      c.rect(6, 15, 7, b - 2, X.CHR);
      c.row(b - 2, 2, 11, X.BLK);
      c.row(b - 1, 4, 9, X.BLK);
      dots(c, X.GREY, [2, b - 1, 2, b, 11, b - 1, 11, b, 6, b, 7, b]);
    },
  });

  /* ---------- the big bedroom ---------- */
  obj('waterbed-pine-frame', 'waterbed water bed pine frame double bed duvet vinyl mattress leak', {
    w: 44,
    h: 19,
    base: 'side',
    f(c, u) {
      const b = 17;
      c.box(1, 2, 5, b - 2, X.PINE); // the headboard with its shelf
      c.row(6, 2, 4, mix(X.PINE, 0.6));
      c.set(3, 5, C.wine);
      c.box(5, 9, 42, b - 2, X.PINE);
      dots(c, mix(X.PINE, 0.7), [12, 12, 22, 13, 31, 11, 37, 13]);
      c.rect(4, b - 1, 40, b, C.woodDark);
      c.rect(6, 7, 12, 8, C.white); // pillows
      c.row(7, 7, 11, L(C.white));
      if (!u) {
        c.rect(13, 6, 41, 8, DUVET);
        c.row(6, 14, 40, L(DUVET));
        for (let x = 15; x < 40; x += 4) c.set(x, 7, C.bone);
        c.clear(41, 6);
      } else {
        c.rect(13, 7, 30, 8, BLADDER); // the bare bladder
        dots(c, mix(BLADDER, 1.8), [15, 7, 19, 8, 22, 7, 27, 7]);
        c.poly([[28, 8], [31, 4], [38, 4], [41, 7], [41, 8]], DUVET); // the duvet in a heap
        c.line(28, 8, 31, 4, L(DUVET));
        c.row(4, 31, 38, L(DUVET));
        dots(c, C.bone, [33, 6, 37, 6]);
        c.col(24, 9, b - 2, X.WATERL); // and it leaks
        c.col(25, 11, b - 2, C.water);
        puddle(c, 18, 32, b);
      }
    },
    sw: 30,
    sh: 32,
    s(c, u) {
      const b = 30;
      c.box(1, 2, 28, 12, X.PINE); // headboard
      hole(c, 3, 4, 26, 7, mix(X.PINE, 0.5));
      stuff(c, 4, 12, 7, 3, 3, [C.wine, C.navy, C.paper]);
      c.rect(20, 5, 22, 7, C.glassLight);
      c.rect(2, 10, 27, b - 8, DUVET);
      c.rect(4, 10, 12, 13, C.white);
      c.rect(16, 10, 24, 13, C.white);
      c.row(13, 4, 12, D(C.white));
      c.row(13, 16, 24, D(C.white));
      c.rect(2, 14, 27, 15, C.white); // the sheet turned down
      c.row(16, 2, 27, L(DUVET));
      for (let y = 18; y < b - 8; y += 3) for (let x = 4 + (y % 2) * 2; x < 27; x += 4) c.set(x, y, C.bone);
      if (u) {
        c.poly([[2, 14], [20, 14], [2, b - 10]], BLADDER);
        dots(c, mix(BLADDER, 1.8), [4, 16, 8, 15, 5, 19, 11, 16, 3, 22]);
        c.line(20, 14, 2, b - 10, D(DUVET));
        c.poly([[21, 15], [21, b - 9], [4, b - 9]], L(DUVET));
      }
      c.box(1, b - 7, 28, b - 2, X.PINE);
      dots(c, mix(X.PINE, 0.7), [8, b - 5, 19, b - 4]);
      c.rect(3, b - 1, 26, b, C.woodDark);
      if (u) {
        c.col(9, b - 7, b - 2, X.WATERL);
        puddle(c, 5, 16, b);
      }
    },
  });

  obj('wardrobe-sliding-mirror', 'sliding wardrobe mirror door fitted wardrobe clothes shoe boxes bedroom', {
    w: 34,
    h: 38,
    f(c, u) {
      const b = 36,
        F = hex('#c2b8a2');
      c.rect(1, 2, 32, b, F);
      c.rect(1, 2, 32, 3, X.TEAK);
      c.row(b, 1, 32, X.TEAK);
      const mirror = (x0, x1) => {
        c.rect(x0, 4, x1, b - 1, C.glass);
        c.frame(x0, 4, x1, b - 1, X.CHR);
        c.line(x0 + 3, 14, x0 + 8, 7, C.glassLight);
        c.line(x0 + 5, 20, x0 + 11, 11, C.glassLight);
        c.line(x0 + 4, b - 6, x0 + 6, b - 9, C.glassLight);
      };
      const plain = (x0, x1) => {
        door(c, x0, 4, x1, b - 1, F, '');
        c.rect(x0 + 1, 18, x0 + 1, 22, X.TEAK);
      };
      if (!u) {
        mirror(2, 16);
        plain(17, 31);
      } else {
        hole(c, 2, 4, 16, b - 1, C.night);
        c.row(7, 2, 16, X.CHR); // the rail
        const r = rnd(9);
        for (let x = 3; x <= 15; x += 2) cloth(c, x, 8, x + 1, 20 + ((r() * 7) | 0), [C.wine, C.navy, C.slate, C.mustard, C.plum, C.white, X.DENIM][(r() * 7) | 0]);
        c.rect(3, b - 5, 8, b - 2, C.paper); // shoe boxes
        c.row(b - 5, 3, 8, L(C.paper));
        c.rect(5, b - 8, 10, b - 6, hex('#8a6a4a'));
        shoes(c, 10, b - 2, 2, 5);
        mirror(17, 31);
        c.col(16, 4, b - 1, X.CHR);
      }
    },
    sw: 13,
    sh: 38,
    SU: { w: 17, x(c) {
      cloth(c, 12, 12, 14, 22, C.wine); // a sleeve hanging out
      c.rect(12, 33, 15, 36, C.paper);
      c.row(33, 12, 15, L(C.paper));
    } },
    s(c, u) {
      const b = 36,
        F = hex('#c2b8a2');
      c.box(1, 2, 11, b, F);
      c.rect(1, 2, 11, 3, X.TEAK);
      c.row(b, 1, 11, X.TEAK);
      c.col(11, 4, b - 1, u ? C.night : X.CHR);
      c.col(10, 4, b - 1, X.CHR);
    },
  });

  obj('dressing-table-bulbs', 'dressing table mirror with light bulbs vanity make-up hollywood mirror drawers', {
    w: 28,
    h: 33,
    f(c, u) {
      const b = 31,
        F = hex('#cfc8b6'),
        BU = u ? C.flameLight : hex('#a8a48f');
      c.rect(1, 18, 26, 19, F);
      c.row(18, 1, 26, L(F));
      c.box(2, 20, 9, b, F);
      c.box(18, 20, 25, b, F);
      for (const y of [21, 25]) {
        door(c, 3, y, 8, y + 3, F, 'm', C.brass);
        door(c, 19, y, 24, y + 3, F, 'm', C.brass);
      }
      c.rect(10, 20, 17, 22, F);
      c.row(22, 10, 17, D(F));
      c.box(4, 1, 23, 17, F); // the mirror in its frame of bulbs
      c.rect(6, 3, 21, 15, u ? blend(C.glass, C.glow, 0.35) : C.glass);
      c.line(8, 10, 13, 5, C.glassLight);
      c.line(10, 13, 16, 7, C.glassLight);
      for (let x = 5; x <= 22; x += 3) c.set(x, 2, BU);
      for (let y = 5; y <= 14; y += 3) {
        c.set(5, y, BU);
        c.set(22, y, BU);
      }
      bottle(c, 6, 17, 3, C.wine); // scent, a brush, a lipstick
      c.rect(11, 17, 14, 17, X.PINK);
      c.set(20, 17, C.red);
      c.set(20, 16, C.gold);
      if (u) {
        dots(c, C.glow, [4, 2, 8, 1, 14, 1, 20, 1, 23, 2]);
        c.rect(3, 26, 8, 28, hex('#8a8272')); // a drawer drawn out
        c.rect(3, 26, 8, 26, C.night);
        dots(c, C.red, [5, 26]);
        dots(c, C.gold, [7, 26]);
        c.rect(15, 16, 17, 17, C.white); // tissue
        c.set(16, 17, C.red);
      }
    },
    sw: 13,
    sh: 33,
    SU: { w: 16, x(c) {
      c.rect(11, 26, 13, 28, hex('#cfc8b6'));
      c.row(25, 11, 13, C.night);
      c.col(13, 26, 28, D(hex('#cfc8b6')));
    } },
    s(c, u) {
      const b = 31,
        F = hex('#cfc8b6'),
        BU = u ? C.flameLight : hex('#a8a48f');
      c.rect(1, 18, 11, 19, F);
      c.row(18, 1, 11, L(F));
      c.box(2, 20, 10, b, F);
      c.col(10, 21, 28, D(F));
      c.rect(2, 1, 3, 17, F);
      c.col(2, 1, 17, L(F));
      for (let y = 2; y <= 14; y += 3) c.set(4, y, BU);
      if (u) dots(c, C.glow, [5, 2, 5, 8, 5, 14]);
      bottle(c, 6, 17, 3, C.wine);
      c.set(9, 17, C.red);
    },
  });

  obj('aquarium-on-stand', 'aquarium fish tank on stand tropical fish hood light living room', {
    w: 26,
    h: 29,
    f(c, u) {
      const b = 27,
        WAT = u ? hex('#4d7f8a') : mix(C.water, 0.75);
      c.box(2, 16, 23, b - 1, X.BLK);
      door(c, 3, 17, 12, b - 2, mix(X.BLK, 1.3), 'r');
      door(c, 13, 17, 22, b - 2, mix(X.BLK, 1.3), 'l');
      legs(c, [3, 21], b, b, X.BLK, 2);
      c.rect(1, 2, 24, 3, X.BLK); // hood
      if (u) c.row(4, 2, 23, C.glow);
      c.rect(1, u ? 5 : 4, 24, 15, WAT);
      c.frame(1, 4, 24, 15, X.BLK);
      if (u) c.row(4, 2, 23, C.glow);
      c.row(14, 2, 23, u ? hex('#9a8f6a') : C.stoneDark); // gravel
      const PLT = u ? C.leafLight : C.leaf;
      c.col(4, 8, 13, PLT);
      c.col(6, 10, 13, PLT);
      c.col(19, 7, 13, PLT);
      c.col(21, 10, 13, PLT);
      c.rect(11, 12, 14, 13, u ? C.stone : C.stoneDark); // a little castle
      c.set(12, 11, u ? C.stone : C.stoneDark);
      if (u) {
        c.rect(8, 8, 9, 8, X.AMBER);
        c.set(7, 8, D(X.AMBER));
        c.rect(15, 10, 16, 10, C.red);
        c.set(17, 10, D(C.red));
        c.rect(21, 7, 22, 7, C.steel);
        dots(c, C.glassLight, [10, 6, 10, 9, 11, 11]);
        c.rect(15, 5, 17, 5, C.bone); // one floats belly up
      } else dots(c, mix(X.AMBER, 0.5), [8, 8, 16, 10]);
      c.set(2, 5, C.glassLight);
      c.set(2, 6, C.glassLight);
    },
    sw: 13,
    sh: 29,
    s(c, u) {
      const b = 27,
        WAT = u ? hex('#4d7f8a') : mix(C.water, 0.75);
      c.box(2, 16, 10, b - 1, X.BLK);
      legs(c, [3, 8], b, b, X.BLK, 2);
      c.rect(1, 2, 11, 3, X.BLK);
      c.rect(1, 5, 11, 15, WAT);
      c.frame(1, 4, 11, 15, X.BLK);
      if (u) c.row(4, 2, 10, C.glow);
      c.row(14, 2, 10, u ? hex('#9a8f6a') : C.stoneDark);
      c.col(4, 8, 13, u ? C.leafLight : C.leaf);
      c.col(8, 10, 13, u ? C.leafLight : C.leaf);
      if (u) {
        c.rect(6, 9, 7, 9, X.AMBER);
        c.rect(6, 5, 8, 5, C.bone);
      } else c.set(6, 9, mix(X.AMBER, 0.5));
      c.set(2, 5, C.glassLight);
    },
  });

  {
    const CP = hex('#9c8a6c'),
      RO = hex('#b59a58'),
      CAT = hex('#3b3840');
    const post = (c, x, y0, y1) => {
      c.rect(x, y0, x + 2, y1, RO);
      for (let y = y0; y <= y1; y += 2) c.row(y, x, x + 2, D(RO));
      c.col(x, y0, y1, L(RO));
    };
    const slab = (c, x0, y0, x1, y1) => {
      c.rect(x0, y0, x1, y1, CP);
      c.row(y0, x0, x1, L(CP));
      c.row(y1, x0, x1, D(CP));
      c.dither(x0, y0 + 1, x1, y1 - 1, mix(CP, 0.9));
    };
    obj('cat-tree-carpet', 'cat tree scratching post carpet tower cat furniture sisal', {
      w: 19,
      h: 40,
      f(c, u) {
        const b = 38;
        slab(c, 1, b - 2, 17, b);
        post(c, 3, 14, b - 3);
        post(c, 12, 30, b - 3);
        c.box(8, 20, 16, 29, CP); // the box to hide in
        c.oval(10, 22, 14, 27, C.night);
        slab(c, 1, 11, 12, 13);
        post(c, 8, 7, 10);
        slab(c, 4, 4, 15, 6);
        c.speckle(3, 22, 5, b - 4, C.bone, 4, 3); // clawed
        if (!u) {
          c.col(2, 14, 17, C.bone); // a ball on a string
          c.rect(1, 18, 2, 19, C.red);
        } else {
          c.rect(6, 2, 12, 3, CAT); // the cat is up there now
          c.rect(11, 1, 13, 3, CAT);
          c.set(12, 2, C.flameLight);
          c.col(5, 3, 8, CAT);
          c.set(4, 9, CAT);
          c.col(2, 14, 15, C.bone);
          c.rect(15, b - 4, 16, b - 3, C.red); // the ball torn off
        }
      },
      sw: 15,
      sh: 40,
      s(c, u) {
        const b = 38;
        slab(c, 1, b - 2, 13, b);
        post(c, 6, 14, 19);
        post(c, 6, 30, b - 3);
        c.box(3, 20, 11, 29, CP);
        c.col(11, 22, 27, C.night);
        slab(c, 2, 11, 12, 13);
        post(c, 6, 7, 10);
        slab(c, 3, 4, 11, 6);
        if (!u) {
          c.col(11, 14, 17, C.bone);
          c.rect(10, 18, 11, 19, C.red);
        } else {
          c.rect(5, 2, 9, 3, CAT);
          c.rect(8, 1, 10, 3, CAT);
          c.set(10, 2, C.flameLight);
          c.col(4, 3, 8, CAT);
          c.col(11, 14, 15, C.bone);
          c.rect(12, b - 4, 13, b - 3, C.red);
        }
      },
    });
  }
};
