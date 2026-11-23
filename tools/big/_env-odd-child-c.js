/* Child's room, part 3: the drawings on the wall, pets, and things on wheels. */
module.exports = (H) => {
  const { C, K, hex, mix, blend, D, L, rnd, setting, dots, panel, legs, body, sideBody, slab, eyes, wheel, wheelEdge, paper, glow, figure, fallen, upturned } = H;
  const kid = setting('env-childroom', "Child's room");
  const PINE = hex('#b08e5e'),
    RED = hex('#a04a3c'),
    BLUE = hex('#4a6480'),
    YEL = hex('#b89a4a'),
    GRN = hex('#5f7f56'),
    PINK = hex('#a8697a'),
    SKY = hex('#7f9aa8'),
    PAINT = hex('#d2cdbd'),
    IN = hex('#1a1820'),
    ORANGE = hex('#b8703a');

  /* ---------- indoor slide ---------- */
  const slideSide = (c, u) => {
    for (let i = 0; i < 4; i++) {
      c.rect(i * 2, 16 - i * 4, 9, 19 - i * 4, BLUE); // the steps
      c.row(16 - i * 4, i * 2, 9, L(BLUE));
    }
    c.rect(6, 2, 11, 5, BLUE); // the platform
    c.row(2, 6, 11, L(BLUE));
    c.col(6, -3, 2, RED); // rails
    c.col(11, -3, 2, RED);
    c.row(-3, 6, 11, RED);
    c.poly([[11, 3], [11, 5], [26, 19], [31, 19], [31, 18], [28, 18]], YEL); // the chute
    c.line(11, 3, 28, 18, L(YEL));
    c.line(11, 1, 24, 13, D(YEL));
    c.line(11, 2, 26, 16, D(YEL));
    c.col(18, 13, 19, BLUE); // a prop under it
    if (u) {
      c.line(14, 6, 27, 18, C.blood); // something went down it
      c.row(19, 32, 35, C.blood);
      c.rect(34, 18, 37, 19, PINK); // and left a shoe
      c.set(34, 17, PINK);
    }
  };
  kid(
    'slide-indoor',
    'indoor slide plastic child steps chute yellow blue',
    true,
    slideSide,
    (c, u) => {
      c.rect(2, 2, 11, 6, BLUE); // the platform, behind
      c.col(2, -3, 2, RED);
      c.col(11, -3, 2, RED);
      c.row(-3, 2, 11, RED);
      c.poly([[3, 3], [10, 3], [13, 19], [0, 19]], YEL); // the chute coming at you
      c.line(3, 3, 0, 19, L(YEL));
      c.line(10, 3, 13, 19, D(YEL));
      c.line(4, 4, 2, 19, D(YEL));
      c.line(9, 4, 11, 19, D(YEL));
      c.row(19, 0, 13, D(YEL));
      if (u) {
        c.line(6, 4, 6, 19, C.blood);
        c.line(7, 9, 8, 19, C.blood);
        c.rect(15, 18, 18, 19, PINK);
        c.set(15, 17, PINK);
      }
    },
    { base: 'side' },
  );

  /* ---------- drawings pinned to the wall, each darker than the last ---------- */
  function pinned(slug, name, pic) {
    kid(
      slug,
      name,
      false,
      (c, u) => {
        paper(c, 0, 0, 12, 14);
        pic(c);
        if (u) {
          // torn down: a strip is left under the pin
          for (let x = 0; x <= 12; x++) c.clearRect(x, 4 + ((x * 7) % 3) + (x > 7 ? 1 : 0), x, 14);
          c.row(3, 0, 12, D(C.paper));
        } else c.set(12, 14, D(C.paper)), c.clear(0, 14);
        c.set(6, 0, RED); // the pin
        c.set(6, 1, D(RED));
      },
      (c, u) => {
        c.col(0, 0, u ? 5 : 14, C.paper);
        c.col(1, 0, u ? 4 : 13, D(C.paper));
        c.set(2, 0, RED);
        if (!u) c.set(2, 13, C.paper);
      },
    );
  }
  pinned('drawing-pinned-sun', 'child drawing pinned wall crayon sun house happy picture', (c) => {
    c.rect(8, 2, 10, 4, YEL);
    dots(c, YEL, [7, 5, 11, 5, 7, 1, 11, 1]);
    c.rect(2, 8, 6, 11, RED);
    c.poly([[1, 8], [4, 5], [7, 8]], ORANGE);
    c.set(4, 10, IN);
    c.row(12, 1, 11, GRN);
    c.col(9, 9, 11, GRN);
    c.set(9, 8, PINK);
  });
  pinned('drawing-pinned-family', 'child drawing pinned wall crayon family stick figures holding hands', (c) => {
    for (const [x, t, col] of [
      [2, 5, BLUE],
      [6, 4, RED],
      [10, 8, GRN],
    ]) {
      c.col(x, t + 1, 11, col);
      c.set(x, t, hex('#b08a6a'));
      c.set(x - 1, 12, col);
      c.set(x + 1, 12, col);
    }
    c.row(8, 3, 5, IN);
    c.row(9, 7, 9, IN);
    c.rect(1, 2, 2, 3, YEL);
    c.set(11, 4, IN); // someone small at the edge, crossed out later
  });
  pinned('drawing-pinned-tall-man', 'child drawing pinned wall crayon tall thin man black figure by the house', (c) => {
    c.rect(1, 9, 4, 12, RED);
    c.poly([[0, 9], [2, 7], [5, 9]], ORANGE);
    c.col(6, 10, 12, BLUE); // me
    c.set(6, 9, hex('#b08a6a'));
    c.col(9, 3, 12, IN); // him
    c.rect(9, 1, 10, 2, IN);
    c.line(8, 4, 7, 10, IN);
    c.line(10, 4, 11, 10, IN);
    c.row(13, 1, 11, GRN);
  });
  pinned('drawing-pinned-scribble', 'child drawing pinned wall black scribble eyes frightening crayon', (c) => {
    const r = rnd(5);
    c.rect(1, 2, 11, 12, IN);
    for (let i = 0; i < 26; i++) c.set(1 + ((r() * 11) | 0), 2 + ((r() * 11) | 0), C.paper);
    c.rect(2, 5, 5, 7, IN);
    c.rect(7, 5, 10, 7, IN);
    c.rect(3, 6, 4, 6, C.white);
    c.rect(8, 6, 9, 6, C.white);
    c.row(10, 3, 9, C.blood);
    dots(c, C.blood, [4, 11, 6, 11, 8, 11]);
  });

  /* ---------- growth chart ---------- */
  kid(
    'growth-chart-wall',
    'growth chart height wall giraffe ruler marks child measuring',
    false,
    (c, u) => {
      const G = hex('#bfa35a'),
        SP = hex('#8a6238');
      c.rect(1, 6, 6, 41, G);
      c.rect(2, 0, 7, 5, G); // the giraffe's head
      c.set(2, -1, SP);
      c.set(5, -1, SP);
      c.set(4, 2, K);
      c.rect(6, 3, 8, 5, G);
      c.set(8, 4, SP);
      for (let y = 8; y < 41; y += 5) c.rect(2 + ((y * 3) % 3), y, 3 + ((y * 3) % 3), y + 1, SP);
      for (let y = 7; y < 41; y += 2) c.set(1, y, K); // the scale
      for (const y of [36, 33, 30, 28]) c.row(y, 2, 5, hex('#3a3a44')); // pencil marks, year by year
      if (u) {
        c.row(4, 0, 7, C.blood); // and one that is much too high
        c.row(5, 3, 6, C.blood);
        c.set(8, 3, C.blood);
      }
    },
    (c, u) => {
      c.col(0, 0, 41, hex('#bfa35a'));
      c.col(1, 6, 41, D(hex('#bfa35a')));
      c.set(1, 2, hex('#bfa35a'));
      if (u) c.set(1, 4, C.blood), c.set(2, 4, C.blood);
    },
  );

  /* ---------- lava lamp ---------- */
  kid(
    'lava-lamp',
    'lava lamp glass bottle blobs light retro',
    false,
    (c, u) => {
      const liquid = u ? hex('#a8442c') : hex('#3e2a3c'),
        blob = u ? C.flameLight : hex('#5a3c50');
      c.poly([[2, 3], [4, 3], [5, 12], [1, 12]], liquid);
      c.col(2, 4, 11, L(liquid));
      c.rect(3, 9, 4, 11, blob);
      c.set(3, 6, blob);
      if (u) c.rect(2, 4, 3, 5, blob), c.set(4, 7, C.flame);
      c.rect(2, 1, 4, 2, C.steel); // cap
      c.poly([[1, 13], [5, 13], [6, 16], [0, 16]], C.steel); // base
      c.row(13, 1, 5, L(C.steel));
      c.row(16, 0, 6, D(C.steel));
    },
    null,
    { round: true },
  );

  /* ---------- goldfish bowl ---------- */
  kid(
    'fish-bowl-goldfish',
    'fish bowl goldfish glass water pet',
    false,
    (c, u) => {
      const W = u ? hex('#5f7a5a') : C.glass;
      c.oval(0, 1, 11, 10, W);
      c.clearRect(0, 0, 11, 1);
      c.row(2, 2, 9, C.glassLight); // the surface
      c.row(1, 3, 8, C.glassLight);
      c.row(10, 3, 8, C.straw); // gravel
      c.row(9, 2, 9, D(C.straw));
      c.col(3, 5, 8, C.leaf);
      c.set(4, 6, C.leaf);
      c.set(1, 5, C.glassLight);
      if (u) {
        c.rect(5, 2, 7, 3, hex('#cdb89a')); // belly up
        c.set(8, 2, ORANGE);
        c.set(6, 3, K);
      } else {
        c.rect(5, 5, 7, 6, ORANGE);
        c.set(8, 5, ORANGE);
        c.set(8, 6, D(ORANGE));
        c.set(5, 5, K);
        c.set(4, 4, C.glassLight);
      }
    },
    null,
    { round: true },
  );

  /* ---------- hamster cage ---------- */
  kid(
    'hamster-cage-wheel',
    'hamster cage wheel wire pet sawdust little house',
    true,
    (c, u) => {
      const BG = hex('#3c3a3c');
      c.rect(1, 0, 22, 10, BG);
      for (let x = 1; x <= 22; x += 2) c.col(x, 0, 10, C.steel);
      c.row(0, 1, 22, L(C.steel));
      c.row(5, 1, 22, C.steel);
      c.oval(3, 2, 10, 9, BG); // the wheel
      for (const [x, y] of [[3, 5], [4, 3], [6, 2], [7, 2], [9, 3], [10, 5], [10, 6], [9, 8], [7, 9], [6, 9], [4, 8], [3, 6]]) c.set(x, y, C.rust);
      c.set(6, 5, C.rust);
      c.rect(15, 6, 20, 10, RED); // its house
      c.poly([[14, 6], [17, 3], [18, 3], [21, 6]], D(RED));
      c.rect(17, 8, 18, 10, IN);
      body(c, 0, 11, 23, 14, BLUE);
      c.row(10, 2, 21, C.straw);
      if (u) {
        c.rect(11, 6, 14, 10, IN); // the door open, nobody home
        c.rect(11, 11, 14, 12, C.steel);
        c.rect(24, 13, 28, 14, C.straw); // sawdust kicked out
        dots(c, C.straw, [29, 14, 26, 12]);
      } else {
        c.rect(5, 7, 8, 8, hex('#c9a26a')); // the hamster in its wheel
        c.set(8, 6, hex('#c9a26a'));
        c.set(8, 7, K);
        c.frame(11, 6, 14, 10, L(C.steel));
      }
    },
    (c, u) => {
      const BG = hex('#3c3a3c');
      c.rect(1, 0, 11, 10, BG);
      for (let x = 1; x <= 11; x += 2) c.col(x, 0, 10, C.steel);
      c.row(0, 1, 11, L(C.steel));
      c.row(5, 1, 11, C.steel);
      c.rect(3, 2, 4, 9, C.rust); // the wheel edge on
      c.rect(7, 6, 10, 10, RED);
      body(c, 0, 11, 12, 14, BLUE);
      c.row(10, 2, 10, C.straw);
      if (u) {
        c.rect(12, 6, 16, 6, C.steel); // the door standing open
        c.rect(12, 10, 16, 10, C.steel);
        c.col(16, 6, 10, C.steel);
        c.rect(14, 13, 18, 14, C.straw);
      }
    },
  );

  /* ---------- ride-on car ---------- */
  const carSide = (c) => {
    c.poly([[0, 6], [4, 4], [15, 4], [19, 7], [21, 8], [21, 12], [0, 12]], RED);
    c.line(0, 6, 4, 4, L(RED));
    c.row(4, 4, 15, L(RED));
    c.rect(5, 2, 9, 4, IN); // the seat
    c.rect(4, 0, 5, 4, RED);
    c.line(13, 3, 15, 0, C.iron); // steering column
    c.rect(14, -1, 17, 0, YEL);
    c.rect(19, 9, 20, 10, C.flameLight); // a lamp
    c.row(10, 2, 17, D(RED));
    wheel(c, 4, 12, 3);
    wheel(c, 16, 12, 3);
  };
  const carFront = (c) => {
    body(c, 1, 5, 12, 12, RED);
    c.rect(2, 2, 11, 4, D(RED)); // seat back behind
    c.rect(5, 0, 8, 1, YEL); // the wheel
    c.col(6, 2, 4, C.iron);
    c.rect(2, 7, 4, 8, C.flameLight);
    c.rect(9, 7, 11, 8, C.flameLight);
    c.row(10, 4, 9, IN); // a grin of a grille
    c.set(3, 9, IN);
    c.set(10, 9, IN);
    wheelEdge(c, 0, 12, 3);
    wheelEdge(c, 12, 12, 3);
  };
  kid(
    'ride-on-car-red',
    'ride on car toy red plastic sit in push along child',
    true,
    (c, u) => (u ? upturned(c, carSide, 0, 15) : carSide(c)),
    (c, u) => (u ? upturned(c, carFront, 0, 15) : carFront(c)),
    { base: 'side' },
  );

  /* ---------- tricycle ---------- */
  const trikeSide = (c) => {
    wheel(c, 14, 12, 4);
    wheel(c, 3, 13, 3);
    c.line(4, 9, 13, 6, RED); // frame
    c.line(4, 10, 13, 7, D(RED));
    c.line(14, 12, 13, 2, C.steel); // fork
    c.rect(11, 1, 15, 1, C.steel);
    c.set(10, 2, K);
    c.rect(3, 7, 7, 8, IN); // saddle
    c.col(4, 9, 12, RED);
    c.set(16, 13, YEL); // pedal
  };
  const trikeFront = (c) => {
    wheelEdge(c, 6, 12, 4, K, 2);
    wheelEdge(c, 0, 13, 3);
    wheelEdge(c, 12, 13, 3);
    c.row(13, 2, 11, RED); // axle
    c.col(6, 2, 8, C.steel);
    c.col(7, 2, 8, D(C.steel));
    c.rect(1, 1, 12, 1, C.steel); // bars
    c.rect(0, 1, 1, 2, K);
    c.rect(12, 1, 13, 2, K);
    c.rect(5, 6, 8, 7, IN);
    c.set(4, 12, YEL);
    c.set(9, 13, YEL);
  };
  kid(
    'tricycle-child',
    'tricycle trike child red three wheels pedals',
    true,
    (c, u) => (u ? fallen(c, trikeSide, 0, 16, true) : trikeSide(c)),
    (c, u) => (u ? fallen(c, trikeFront, 0, 16, true) : trikeFront(c)),
    { base: 'side' },
  );

  /* ---------- scooter ---------- */
  const scootSide = (c) => {
    wheel(c, 2, 17, 2, K, C.steel);
    wheel(c, 15, 17, 2, K, C.steel);
    c.rect(3, 15, 12, 16, BLUE);
    c.row(15, 3, 12, L(BLUE));
    c.line(15, 16, 13, 1, C.steel);
    c.line(14, 15, 12, 1, D(C.steel));
    c.rect(11, 0, 15, 0, K);
    c.set(13, 6, RED); // a streamer
    c.set(14, 7, RED);
  };
  const scootFront = (c) => {
    wheelEdge(c, 3, 17, 2, K, 2);
    c.rect(2, 15, 5, 15, BLUE);
    c.col(3, 1, 14, C.steel);
    c.col(4, 1, 14, D(C.steel));
    c.rect(0, 0, 7, 0, C.steel);
    c.rect(0, 0, 1, 1, K);
    c.rect(6, 0, 7, 1, K);
    c.set(8, 1, RED);
    c.set(8, 2, RED);
  };
  kid(
    'scooter-child',
    'scooter child kick scooter blue handlebars two wheels',
    false,
    (c, u) => (u ? fallen(c, scootSide, 0, 19, true) : scootSide(c)),
    (c, u) => (u ? fallen(c, scootFront, 0, 19, true) : scootFront(c)),
    { base: 'side' },
  );
};
