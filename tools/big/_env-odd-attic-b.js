/* Attic, part 2: hobbies and keepsakes. */
module.exports = (H) => {
  const { C, K, hex, mix, blend, D, L, rnd, setting, dots, panel, drawer, legs, body, sideBody, slab, eyes, eyeball, arm, paper, glow, cobweb, table, fallen, plain } = H;
  const att = setting('env-attic', 'Attic');
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    IN = hex('#17151c'),
    ROSE = hex('#8a5560'),
    FRED = hex('#8a4038'), // faded red
    FBLUE = hex('#3d4a66');

  /* ---------- rolled maps ---------- */
  const mapsFn = (seed) => (c, u) => {
    const WK = C.straw;
    c.poly([[1, 12], [10, 12], [9, 25], [2, 25]], WK); // the basket
    c.dither(2, 13, 9, 25, D(WK));
    c.row(12, 1, 10, L(WK));
    c.row(25, 2, 9, D(WK));
    const tubes = seed ? [[2, 3], [5, 0], [8, 4]] : [[2, 2], [4, -1], [6, 3], [8, 0]];
    tubes.forEach(([x, t], i) => {
      if (u && i === 1) return;
      c.rect(x, t, x + 1, 11, i % 2 ? C.parchment : C.paper);
      c.col(x + 1, t, 11, D(i % 2 ? C.parchment : C.paper));
      c.set(x, t, IN);
      if (i === 0) c.row(6, x, x + 1, FRED);
    });
    if (u) {
      // one unrolled across the floor: a coast, a cross
      c.rect(12, 23, 27, 25, C.paper);
      c.row(23, 12, 27, L(C.paper));
      c.rect(27, 22, 28, 25, C.parchment);
      c.line(14, 24, 18, 23, hex('#4a6480'));
      c.line(18, 23, 22, 25, hex('#4a6480'));
      c.set(24, 24, C.red);
      c.set(20, 24, C.moss);
    }
  };
  att('maps-rolled-basket', 'rolled maps charts basket paper tubes old plans', false, mapsFn(0), mapsFn(1));

  /* ---------- the telescope ---------- */
  att(
    'telescope-tripod-attic',
    'telescope tripod brass dust cover astronomy attic window',
    true,
    (c, u) => {
      c.line(13, 14, 4, 33, W); // the tripod
      c.line(14, 14, 14, 33, WD);
      c.line(15, 14, 24, 33, W);
      c.rect(12, 12, 16, 14, C.brass);
      if (u) {
        // uncovered, and trained down on the houses opposite
        c.line(2, 6, 26, 14, C.brass);
        c.line(2, 7, 26, 15, C.brass);
        c.line(2, 8, 26, 16, D(C.brass));
        c.rect(0, 5, 2, 9, C.gold);
        c.rect(25, 13, 28, 17, C.gold);
        c.col(29, 14, 16, C.glassLight);
        c.poly([[16, 33], [18, 29], [24, 30], [26, 33]], C.white); // the cloth on the floor
        c.line(18, 29, 24, 30, L(C.white));
      } else {
        c.line(2, 16, 26, 6, C.brass);
        c.line(2, 17, 26, 7, D(C.brass));
        c.rect(0, 15, 2, 18, C.gold);
        c.poly([[9, 13], [12, 6], [27, 2], [30, 6], [29, 12], [24, 9], [16, 14], [12, 18]], C.white); // a dust cloth over it
        c.line(12, 6, 27, 2, L(C.white));
        c.line(18, 6, 17, 12, blend(C.white, C.stone, 0.45));
        c.line(25, 4, 26, 9, blend(C.white, C.stone, 0.45));
      }
    },
    (c, u) => {
      c.line(6, 14, 1, 33, W);
      c.line(7, 14, 7, 33, WD);
      c.line(8, 14, 12, 33, W);
      c.rect(5, 12, 9, 14, C.brass);
      if (u) {
        c.oval(3, 6, 11, 14, C.gold); // looking straight down the barrel
        c.oval(4, 7, 10, 13, C.glass);
        c.oval(6, 9, 8, 11, IN);
        c.set(5, 8, C.glassLight);
        c.poly([[13, 33], [15, 30], [19, 33]], C.white);
      } else {
        c.poly([[2, 4], [11, 4], [12, 13], [9, 12], [5, 13], [1, 12]], C.white);
        c.row(4, 2, 11, L(C.white));
        c.col(6, 6, 11, blend(C.white, C.stone, 0.45));
      }
    },
    { base: 'side' },
  );

  /* ---------- model railway ---------- */
  att(
    'model-railway-board',
    'model railway layout baseboard trestles trains station hills attic hobby',
    true,
    (c, u) => {
      const GR = hex('#5a6a44');
      c.rect(0, 12, 45, 14, W);
      c.row(12, 0, 45, WL);
      for (const x of [3, 39]) c.line(x, 15, x - 2, 25, WD), c.line(x + 2, 15, x + 4, 25, WD), c.row(20, x - 1, x + 3, WD);
      c.rect(1, 11, 44, 11, GR);
      c.oval(26, 4, 42, 16, GR); // a hill with a tunnel
      c.clearRect(26, 12, 42, 16);
      c.rect(0, 12, 45, 14, W);
      c.row(12, 0, 45, WL);
      c.rect(1, 11, 44, 11, GR);
      c.rect(30, 8, 33, 10, IN);
      c.row(10, 2, 30, C.ironDark); // track
      c.rect(4, 5, 11, 9, hex('#8a5a40')); // the station
      c.poly([[3, 5], [5, 3], [10, 3], [12, 5]], FBLUE);
      c.rect(6, 7, 6, 8, u ? C.flameLight : IN);
      c.rect(9, 7, 9, 8, u ? C.flameLight : IN);
      c.rect(14, 6, 17, 9, hex('#9a8f78')); // a house
      c.poly([[13, 6], [15, 4], [16, 4], [18, 6]], FRED);
      c.set(15, 8, u ? C.flameLight : IN);
      c.col(21, 4, 9, C.steel); // signal
      c.rect(21, 4, 23, 5, u ? hex('#5f8f56') : C.red);
      const tx = u ? 22 : 12; // the train, which runs with no current
      c.rect(tx, 8, tx + 3, 9, IN);
      c.set(tx + 3, 7, IN);
      c.rect(tx - 4, 8, tx - 1, 9, FRED);
      if (u) c.set(tx + 4, 9, C.flameLight), c.rect(tx + 2, 5, tx + 3, 6, C.ash);
      else cobweb(c, 44, 15, -1, 1, 5, C.ash, true);
    },
    (c, u) => {
      const GR = hex('#5a6a44');
      c.oval(3, 4, 17, 16, GR);
      c.clearRect(3, 12, 17, 16);
      c.rect(0, 12, 21, 14, W);
      c.row(12, 0, 21, WL);
      c.rect(1, 11, 20, 11, GR);
      c.col(3, 15, 25, WD);
      c.col(18, 15, 25, WD);
      c.row(20, 4, 17, WD);
      c.rect(15, 5, 19, 9, hex('#8a5a40'));
      c.row(4, 14, 20, FBLUE);
      c.set(17, 7, u ? C.flameLight : IN);
      if (u) c.rect(8, 8, 10, 10, IN), c.set(9, 9, C.flameLight);
    },
  );

  /* ---------- ship in a bottle ---------- */
  att(
    'ship-in-bottle',
    'ship in a bottle model sailing ship glass stand keepsake',
    false,
    (c, u) => {
      c.rect(2, 8, 4, 9, W); // the stand
      c.rect(11, 8, 13, 9, W);
      c.row(9, 1, 14, WD);
      const ship = (x, y) => {
        c.row(y, x, x + 5, hex('#4a3020'));
        c.col(x + 2, y - 4, y - 1, hex('#4a3020'));
        c.rect(x + 3, y - 4, x + 4, y - 2, C.white);
        c.set(x + 1, y - 2, C.white);
      };
      if (u) {
        c.rect(0, 2, 2, 7, C.glass); // the bottle broken, the ship out
        c.set(3, 3, C.glass);
        c.set(3, 6, C.glass);
        dots(c, C.glassLight, [5, 7, 7, 6, 9, 7, 1, 3]);
        c.rect(14, 7, 17, 7, C.glass);
        ship(17, 9);
      } else {
        c.rect(0, 2, 12, 7, C.glass);
        c.rect(13, 3, 16, 6, C.glass);
        c.rect(17, 4, 18, 5, hex('#9a7a50')); // cork
        c.row(2, 1, 11, C.glassLight);
        c.row(7, 1, 11, hex('#34566b'));
        ship(3, 6);
      }
    },
    (c, u) => {
      c.rect(0, 8, 7, 9, W);
      c.row(9, 0, 7, WD);
      if (u) {
        c.rect(1, 3, 2, 7, C.glass);
        c.rect(5, 5, 6, 7, C.glass);
        c.set(3, 7, C.glassLight);
        dots(c, C.glassLight, [9, 9, 11, 9]);
      } else {
        c.oval(1, 2, 6, 7, C.glass); // end on: the cork
        c.rect(3, 4, 4, 5, hex('#9a7a50'));
        c.set(2, 3, C.glassLight);
      }
    },
  );

  /* ---------- stamp albums ---------- */
  att(
    'stamp-albums',
    'stamp albums collection books magnifying glass philately',
    false,
    (c, u) => {
      const vol = (x0, x1, y, col) => {
        c.rect(x0, y, x1, y + 2, col);
        c.row(y, x0, x1, L(col));
        c.col(x1, y, y + 2, C.paper);
        c.set(x0 + 2, y + 1, C.gold);
      };
      vol(0, 14, 7, C.forest);
      vol(1, 13, 4, C.navy);
      if (u) {
        c.rect(-1, 2, 15, 3, C.paper); // the top one open: rows of stamps
        c.col(7, 1, 3, D(C.paper));
        c.row(4, -1, 15, C.wine);
        const st = [FRED, FBLUE, C.mustard, C.forest];
        for (let i = 0; i < 7; i++) if (i !== 3) c.set(i * 2, 2, st[i % 4]);
        c.set(14, 2, st[1]);
        c.set(4, 1, C.paper); // one lifted out
      } else {
        vol(0, 14, 1, C.wine);
        c.rect(5, -1, 8, 0, C.glass); // a magnifying glass on top
        c.set(4, 0, C.brass);
        c.rect(9, 0, 11, 0, WD);
      }
    },
    (c, u) => {
      const vol = (y, col) => (c.rect(0, y, 9, y + 2, C.paper), c.frame(0, y, 9, y + 2, col), c.row(y + 1, 1, 8, C.paper));
      vol(7, C.forest);
      vol(4, C.navy);
      if (u) c.rect(-3, 2, 12, 3, C.paper), c.row(4, -3, 12, C.wine), c.col(4, 1, 3, D(C.paper));
      else vol(1, C.wine), c.rect(3, 0, 6, 0, C.glass);
    },
  );

  /* ---------- cine projector in its case ---------- */
  att(
    'cine-projector-case',
    'cine projector case home movies film reels 8mm attic',
    true,
    (c, u) => {
      const CASE = hex('#4f4a44');
      body(c, 0, 5, 17, 15, CASE);
      c.rect(1, 14, 2, 15, C.steel);
      c.rect(15, 14, 16, 15, C.steel);
      if (u) {
        c.rect(0, 4, 17, 5, D(CASE));
        c.rect(4, -3, 12, 3, hex('#6d7078')); // set up on its case, and running
        c.oval(3, -10, 9, -4, IN);
        c.set(6, -7, C.steel);
        c.oval(9, -9, 14, -4, IN);
        c.set(11, -6, C.steel);
        c.rect(13, -1, 16, 1, C.steel);
        c.poly([[17, -1], [28, -5], [28, 5], [17, 1]], C.glow); // its beam
        c.dither(19, -5, 28, 5, C.white);
        c.set(6, 1, C.red);
      } else {
        c.rect(6, 2, 11, 3, WD); // handle
        c.rect(6, 4, 6, 4, WD);
        c.rect(11, 4, 11, 4, WD);
        c.rect(3, 6, 4, 8, C.brass); // clasps
        c.rect(13, 6, 14, 8, C.brass);
        paper(c, 6, 9, 11, 12);
        c.row(10, 7, 10, IN);
      }
    },
    (c, u) => {
      const CASE = hex('#4f4a44');
      sideBody(c, 0, 5, 9, 15, CASE);
      if (u) {
        c.rect(2, -3, 7, 3, hex('#6d7078'));
        c.rect(3, -10, 5, -4, IN);
        c.oval(3, -1, 7, 3, C.glow); // the lens, looking at you
        c.set(5, 1, C.white);
        c.row(4, 0, 9, D(CASE));
      } else {
        c.rect(3, 3, 6, 4, WD);
        c.rect(8, 6, 9, 8, C.brass);
      }
    },
  );

  /* ---------- typewriter in its case ---------- */
  att(
    'typewriter-case',
    'typewriter portable case black lid keys paper attic',
    false,
    (c, u) => {
      const CASE = hex('#2c2a2e');
      body(c, 0, 5, 17, 9, CASE);
      if (u) {
        c.rect(0, -5, 17, -3, CASE); // the lid stood up behind
        c.rect(1, -2, 16, 0, D(CASE));
        c.rect(2, 1, 15, 4, hex('#3d4a44')); // the machine
        c.row(4, 3, 14, C.bone);
        dots(c, K, [4, 4, 6, 4, 8, 4, 10, 4, 12, 4]);
        c.row(3, 4, 13, C.bone);
        paper(c, 5, -4, 12, 1); // and the page in it
        c.row(-2, 6, 10, IN);
        c.row(0, 6, 11, IN);
        c.row(-3, 6, 8, C.blood);
      } else {
        body(c, 0, 1, 17, 5, CASE);
        c.rect(7, -1, 10, 0, C.steel);
        c.rect(3, 4, 4, 6, C.steel);
        c.rect(13, 4, 14, 6, C.steel);
      }
    },
    (c, u) => {
      const CASE = hex('#2c2a2e');
      sideBody(c, 0, 5, 12, 9, CASE);
      if (u) {
        c.rect(-1, -5, 0, 4, CASE);
        c.poly([[2, 4], [3, 1], [9, 2], [12, 4]], hex('#3d4a44'));
        c.row(4, 8, 11, C.bone);
        c.line(3, 0, 2, -4, C.paper);
        c.line(4, 0, 3, -4, D(C.paper));
      } else {
        sideBody(c, 0, 1, 12, 5, CASE);
        c.rect(11, 4, 12, 6, C.steel);
      }
    },
  );

  /* ---------- a gramophone horn with no gramophone ---------- */
  att(
    'gramophone-horn-loose',
    'gramophone horn brass loose trumpet attic junk',
    false,
    (c, u) => {
      // lying with its mouth towards you
      c.oval(0, 0, 15, 15, C.brass);
      c.oval(1, 1, 14, 14, C.gold);
      c.oval(3, 3, 12, 12, C.brass);
      c.oval(5, 5, 10, 10, D(D(C.brass)));
      c.oval(6, 6, 9, 9, IN);
      for (let a = 0; a < 8; a++) c.set(7.5 + 6 * Math.cos((a * Math.PI) / 4), 7.5 + 6 * Math.sin((a * Math.PI) / 4), D(C.brass));
      c.line(3, 3, 5, 2, L(C.gold));
      c.set(12, 13, hex('#4d6b62')); // verdigris
      c.set(11, 14, hex('#4d6b62'));
      if (u) eyeball(c, 7, 7, 1, C.rust); // something in there has woken
    },
    (c, u) => {
      c.poly([[0, 0], [3, 2], [16, 6], [21, 6], [21, 9], [16, 9], [3, 13], [0, 15]], C.gold);
      c.line(0, 0, 16, 6, L(C.gold));
      c.line(0, 15, 16, 9, D(C.brass));
      c.col(0, 0, 15, C.brass);
      c.line(6, 4, 6, 11, C.brass);
      c.line(11, 5, 11, 10, C.brass);
      c.rect(20, 5, 21, 10, C.brass);
      if (u) c.rect(-3, 7, -1, 8, IN), c.set(-4, 9, IN), c.set(-4, 6, IN), c.set(-2, 6, IN); // a long leg feeling its way out
    },
  );

  /* ---------- stuffed owl under glass ---------- */
  const OWL = hex('#7a6248');
  att(
    'owl-stuffed-dome',
    'stuffed owl taxidermy glass dome bird branch victorian',
    false,
    (c, u) => {
      const ox = u ? -9 : 0; // the dome set down beside it
      c.rect(0, 22, 13, 24, WD);
      c.row(22, 0, 13, W);
      c.line(3, 21, 10, 19, W); // branch
      c.oval(4, 9, 10, 19, OWL);
      c.oval(4, 6, 10, 12, OWL);
      c.set(4, 6, OWL);
      c.set(10, 6, OWL);
      c.speckle(4, 12, 10, 19, C.bone, 3, 4);
      if (u) {
        c.rect(5, 8, 6, 9, C.flameLight); // its head has turned, and its eyes are lit
        c.rect(8, 8, 9, 9, C.flameLight);
        c.set(6, 9, K);
        c.set(9, 9, K);
        c.set(7, 10, C.mustard);
        c.poly([[-13, 24], [-13, 8], [-10, 5], [-6, 5], [-3, 8], [-3, 24]], C.glass);
        c.col(-12, 9, 22, C.glassLight);
        c.frame(-13, 24, -3, 24, WD);
      } else {
        c.rect(5, 8, 6, 9, C.mustard);
        c.rect(8, 8, 9, 9, C.mustard);
        c.set(5, 8, K);
        c.set(8, 8, K);
        c.set(7, 10, C.mustard);
        for (let y = 3; y <= 21; y++) for (let x = 1; x <= 12; x++) if (!c.get(x, y) && !((y < 5 && (x < 3 || x > 10)) || (y < 4 && (x < 4 || x > 9)))) c.set(x, y, hex('#46555a'));
        c.col(2, 6, 20, C.glassLight);
        c.set(3, 4, C.glassLight);
        c.set(7, 2, C.glass);
        c.row(3, 4, 9, C.glass);
      }
    },
    (c, u) => {
      c.rect(0, 22, 13, 24, WD);
      c.row(22, 0, 13, W);
      c.row(20, 3, 10, W);
      c.oval(4, 9, 9, 19, OWL); // in profile
      c.oval(5, 6, 11, 12, OWL);
      c.speckle(4, 12, 9, 19, C.bone, 3, 5);
      c.poly([[3, 14], [1, 21], [5, 19]], D(OWL)); // tail
      if (u) {
        c.rect(7, 8, 8, 9, C.flameLight); // face on now
        c.rect(10, 8, 11, 9, C.flameLight);
        c.set(9, 10, C.mustard);
      } else {
        c.rect(9, 8, 10, 9, C.mustard);
        c.set(10, 8, K);
        c.set(12, 10, C.mustard);
        for (let y = 3; y <= 21; y++) for (let x = 1; x <= 12; x++) if (!c.get(x, y) && !((y < 5 && (x < 3 || x > 10)) || (y < 4 && (x < 4 || x > 9)))) c.set(x, y, hex('#46555a'));
        c.col(2, 6, 20, C.glassLight);
        c.row(3, 4, 9, C.glass);
      }
    },
  );

  /* ---------- moth-eaten flags ---------- */
  att(
    'flags-moth-eaten',
    'old flags moth eaten poles furled regimental colours faded',
    false,
    (c, u) => {
      c.line(2, 0, 10, 45, W); // two staffs leaning in the corner
      c.line(3, 0, 11, 45, WD);
      c.line(20, 2, 13, 45, W);
      c.set(2, -1, C.brass);
      c.set(20, 1, C.brass);
      c.set(20, 0, C.brass);
      c.poly([[19, 4], [22, 5], [20, 26], [16, 25]], FBLUE); // one furled
      c.line(20, 6, 18, 24, D(FBLUE));
      c.row(14, 17, 21, C.gold);
      if (u) {
        c.poly([[3, 2], [-12, 5], [-10, 24], [7, 26]], FRED); // one shaken out: more hole than flag
        c.line(3, 2, -12, 5, L(FRED));
        c.rect(-5, 9, 2, 11, C.bone);
        c.rect(-3, 6, -2, 15, C.bone);
        for (const [x, y] of [[-8, 9], [-6, 16], [0, 19], [3, 13], [-9, 21], [-2, 22], [1, 5]]) c.clearRect(x, y, x + 1, y + 1);
        c.clear(-4, 12);
        c.clear(4, 24);
        dots(c, C.ash, [-6, 44, -2, 45, 2, 44]); // dead moths
      } else {
        c.poly([[3, 2], [6, 3], [10, 26], [6, 27]], FRED);
        c.line(5, 4, 8, 25, D(FRED));
        c.row(15, 5, 8, C.gold);
        c.clear(7, 20);
        c.clear(6, 9);
      }
    },
    (c, u) => {
      c.line(1, 0, 3, 45, W);
      c.line(2, 0, 4, 45, WD);
      c.line(6, 2, 5, 45, W);
      c.set(1, -1, C.brass);
      c.poly([[5, 4], [8, 5], [8, 26], [5, 25]], FBLUE);
      if (u) {
        c.poly([[2, 2], [5, 3], [14, 12], [12, 26], [4, 26]], FRED);
        c.line(5, 3, 14, 12, L(FRED));
        c.clearRect(8, 14, 9, 15);
        c.clear(10, 20);
        c.clear(6, 22);
      } else c.poly([[-1, 3], [2, 2], [3, 26], [0, 27]], FRED), c.clear(1, 12);
    },
  );

  /* ---------- skis and a sledge ---------- */
  const sledgeSide = (c) => {
    c.rect(0, 0, 21, 1, WL);
    c.row(1, 0, 21, W);
    for (const x of [3, 10, 17]) c.col(x, 2, 5, W);
    c.row(6, 0, 20, C.iron);
    c.line(20, 6, 23, 2, C.iron);
    c.set(22, 1, hex('#9a8a5a'));
  };
  att(
    'skis-sledge-old',
    'old skis ski poles wooden sledge toboggan winter attic',
    false,
    (c, u) => {
      for (const x of [0, 4]) {
        c.rect(x, 12, x + 2, 47, FRED); // the skis
        c.col(x, 12, 47, L(FRED));
        c.rect(x, 10, x + 1, 11, FRED);
        c.rect(x, 30, x + 2, 32, C.iron);
      }
      c.col(8, 18, 47, hex('#9a8a5a')); // poles
      c.rect(7, 43, 9, 43, C.ironDark);
      if (u) sledgePlace(c, 12, 41); // the sledge taken down
      else {
        // the sledge stood on end against the wall
        for (const x of [11, 14, 17]) c.rect(x, 25, x + 1, 46, WL), c.col(x + 1, 25, 46, W);
        for (const y of [28, 36, 43]) c.row(y, 11, 18, W);
        c.col(10, 24, 47, C.iron);
        c.col(19, 24, 47, C.iron);
        c.rect(10, 22, 11, 23, C.iron);
        c.rect(18, 22, 19, 23, C.iron);
      }
    },
    (c, u) => {
      c.line(0, 47, 3, 10, FRED);
      c.line(1, 47, 4, 10, D(FRED));
      c.set(4, 9, FRED);
      c.line(3, 47, 6, 18, hex('#9a8a5a'));
      if (u) {
        // the sledge end on, on the floor
        c.rect(9, 41, 18, 42, WL);
        c.col(10, 43, 46, W);
        c.col(17, 43, 46, W);
        c.rect(9, 47, 11, 47, C.iron);
        c.rect(16, 47, 18, 47, C.iron);
      } else {
        c.line(6, 47, 9, 24, WL);
        c.line(7, 47, 10, 24, W);
        c.line(9, 47, 12, 23, C.iron);
      }
    },
  );
  function sledgePlace(c, x, y) {
    const t = plain((s) => sledgeSide(s));
    c.stamp(t, x, y);
  }

  /* ---------- a cot taken to pieces ---------- */
  att(
    'cot-in-pieces',
    'cot dismantled pieces bars leaning attic baby bed stored',
    false,
    (c, u) => {
      const P = hex('#b7ae96');
      const side = (x0, y0, x1, y1) => {
        c.rect(x0, y0, x1, y0 + 1, P);
        c.row(y0, x0, x1, L(P));
        c.rect(x0, y1 - 1, x1, y1, P);
        for (let x = x0; x <= x1; x += 3) c.col(x, y0, y1, P);
      };
      if (u) {
        // half put together again: who is it for?
        c.rect(0, 3, 1, 23, P);
        c.rect(28, 3, 29, 23, P);
        side(2, 5, 27, 17);
        c.rect(2, 13, 27, 15, C.cream);
        c.rect(12, 12, 24, 13, hex('#6d7f8c'));
        c.rect(3, 11, 7, 12, C.white);
        c.rect(33, 20, 36, 23, hex('#8a8062')); // the bag of bolts
        c.set(38, 23, C.steel);
      } else {
        side(4, 2, 29, 14);
        side(0, 9, 25, 23);
        c.rect(27, 16, 30, 23, hex('#8a8062'));
        c.set(28, 15, hex('#8a8062'));
        c.row(18, 27, 30, C.straw);
        cobweb(c, 26, 3, -1, 1, 5);
      }
    },
    (c, u) => {
      const P = hex('#b7ae96');
      if (u) {
        c.rect(0, 3, 15, 15, P); // the end board
        c.row(3, 0, 15, L(P));
        panel(c, 2, 5, 13, 13, P);
        c.rect(0, 16, 1, 23, P);
        c.rect(14, 16, 15, 23, P);
      } else {
        c.line(0, 23, 5, 2, P);
        c.line(1, 23, 6, 2, D(P));
        c.line(3, 23, 9, 8, P);
        c.line(4, 23, 10, 8, D(P));
        c.rect(8, 16, 11, 23, hex('#8a8062'));
      }
    },
  );
};
