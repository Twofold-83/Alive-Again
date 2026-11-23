/* Child's room, part 2: dens and hiding places, the wardrobe, the thing under the bed. */
module.exports = (H) => {
  const { C, K, hex, mix, blend, D, L, rnd, setting, dots, panel, drawer, legs, body, sideBody, slab, books, eyes, arm, paper, glow, figure } = H;
  const { bedSide, pillowSide, duvetSide, bedFront, pillowFront, duvetFront, chairSide, chairFront, table } = H;
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
    LILAC = hex('#7a6a8c'),
    FUR = hex('#8a6a44'),
    CLAW = hex('#2b2a33');

  /* ---------- the loft bed with its den ---------- */
  kid(
    'loft-bed-ladder',
    'loft bed high sleeper ladder den curtain underneath pine child',
    true,
    (c, u) => {
      const b = 39;
      c.rect(2, 14, 29, 36, u ? IN : BLUE); // the den under the bed
      if (u) {
        c.rect(2, 14, 12, 36, BLUE); // the curtain pulled half back
        for (let x = 4; x < 12; x += 3) c.col(x, 15, 36, D(BLUE));
        c.poly([[16, 36], [20, 26], [27, 30], [27, 36]], hex('#6b6338')); // torch light on the floor in there
        c.rect(15, 34, 17, 35, C.steel);
        c.set(18, 34, C.flameLight);
        eyes(c, 22, 20, 3);
      } else {
        for (let x = 5; x < 29; x += 4) c.col(x, 15, 36, D(BLUE));
        dots(c, YEL, [8, 20, 16, 26, 23, 18, 12, 31, 26, 30]); // stars on the curtain
      }
      c.row(14, 2, 29, C.brass);
      c.rect(0, 0, 1, b, PINE);
      c.col(0, 0, b, L(PINE));
      c.rect(36, 0, 37, b, PINE);
      c.rect(2, 11, 35, 13, PINE); // the bed's side
      c.row(11, 2, 35, L(PINE));
      c.row(13, 2, 35, D(PINE));
      c.rect(2, 8, 35, 10, C.cream);
      c.row(8, 2, 35, L(C.cream));
      c.rect(3, 6, 8, 7, C.white);
      c.rect(11, 7, 35, 9, LILAC);
      c.row(7, 11, 35, L(LILAC));
      c.row(3, 2, 26, PINE); // the guard rail
      c.col(14, 4, 7, PINE);
      c.col(26, 3, 7, PINE);
      c.col(30, 6, b, PINE); // the ladder
      c.col(35, 6, b, D(PINE));
      for (let y = 17; y < b; y += 5) c.row(y, 31, 34, PINE);
    },
    (c, u) => {
      const b = 39;
      c.rect(2, 14, 17, 38, IN);
      if (u) {
        c.poly([[4, 38], [9, 24], [15, 30], [15, 38]], hex('#6b6338'));
        eyes(c, 9, 20, 3);
      } else c.rect(2, 14, 17, 22, BLUE), dots(c, D(BLUE), [5, 22, 9, 22, 13, 22, 16, 22]);
      c.rect(0, 0, 1, b, PINE);
      c.col(0, 0, b, L(PINE));
      c.rect(18, 0, 19, b, PINE);
      c.rect(2, 3, 17, 13, PINE); // the foot end
      c.row(3, 2, 17, L(PINE));
      panel(c, 4, 5, 15, 11, PINE);
      c.row(13, 2, 17, D(PINE));
      c.col(5, 14, b, PINE); // the ladder, face on
      c.col(14, 14, b, PINE);
      for (let y = 17; y < b; y += 5) c.row(y, 6, 13, L(PINE));
    },
    { base: 'side' },
  );

  /* ---------- dressing-up box ---------- */
  kid(
    'dressing-up-box',
    'dressing up box costumes chest fancy dress mask crown cape',
    true,
    (c, u) => {
      const W = hex('#7c5a3c');
      body(c, 0, 5, 19, 13, W);
      c.frame(0, 5, 19, 13, D(W));
      c.col(0, 5, 13, L(W));
      c.set(9, 8, C.brass);
      c.set(10, 8, C.brass);
      if (u) {
        c.rect(0, -6, 19, -4, W); // the lid thrown back
        c.row(-6, 0, 19, L(W));
        c.rect(1, -3, 18, 4, IN);
        c.rect(1, 2, 18, 4, C.plum); // a cape, a crown
        c.row(2, 1, 18, L(C.plum));
        c.rect(3, 0, 7, 1, C.gold);
        dots(c, C.gold, [3, -1, 5, -1, 7, -1]);
        c.rect(11, -2, 16, 2, C.white); // a mask looking over the edge
        c.set(12, -1, K);
        c.set(15, -1, K);
        c.row(1, 13, 14, K);
        c.clear(11, -2);
        c.clear(16, -2);
      } else {
        c.rect(0, 2, 19, 4, W); // lid
        c.row(2, 0, 19, L(W));
        c.row(4, 0, 19, D(W));
        c.rect(13, 4, 15, 10, PINK); // a sleeve hanging out
        c.set(15, 11, PINK);
        c.rect(3, 4, 5, 6, YEL);
        c.poly([[4, 1], [8, -4], [12, 1]], K); // a witch's hat on top
        c.row(1, 3, 13, K);
        c.row(0, 6, 10, C.plum);
      }
    },
    (c, u) => {
      const W = hex('#7c5a3c');
      sideBody(c, 0, 5, 10, 13, W);
      if (u) {
        c.rect(-3, -6, -1, 4, W); // the lid standing behind
        c.col(-3, -6, 4, L(W));
        c.rect(0, 2, 10, 4, C.plum);
        c.rect(5, -2, 9, 2, C.white);
        c.set(8, -1, K);
        c.row(1, 7, 8, K);
      } else {
        c.rect(0, 2, 10, 4, W);
        c.row(2, 0, 10, L(W));
        c.row(4, 0, 10, D(W));
        c.poly([[2, 1], [5, -4], [8, 1]], K);
        c.row(1, 1, 9, K);
        c.rect(9, 4, 10, 9, PINK);
      }
    },
  );

  /* ---------- puppet theatre ---------- */
  function stripes(c, x0, y0, x1, y1, a, b2, step = 3) {
    for (let x = x0; x <= x1; x++) c.col(x, y0, y1, ((x - x0) / step) & 1 ? b2 : a);
  }
  kid(
    'puppet-theatre',
    'puppet theatre booth punch and judy striped curtains show',
    true,
    (c, u) => {
      stripes(c, 0, 20, 21, 37, RED, C.bone);
      c.col(0, 20, 37, L(RED));
      c.rect(0, 5, 21, 19, RED);
      c.rect(3, 7, 18, 17, IN); // the stage
      c.rect(1, 18, 20, 19, PINE); // the play board
      c.row(18, 1, 20, L(PINE));
      c.poly([[0, 4], [10, -2], [11, -2], [21, 4]], YEL); // the pediment
      c.row(4, 0, 21, D(YEL));
      dots(c, RED, [10, 1, 11, 1, 10, 2, 11, 2]);
      if (u) {
        c.rect(3, 7, 4, 17, C.wine); // curtains drawn back
        c.rect(17, 7, 18, 17, C.wine);
        c.rect(6, 12, 9, 17, GRN); // a crocodile
        c.rect(6, 12, 11, 13, GRN);
        c.set(7, 12, C.white);
        dots(c, C.white, [9, 14, 11, 14]);
        c.rect(13, 10, 15, 12, C.flesh); // and Mr Punch, who has turned to look at you
        c.rect(13, 13, 15, 17, RED);
        c.poly([[12, 9], [14, 6], [16, 9]], RED);
        c.set(13, 11, K);
        c.set(15, 11, K);
      } else {
        c.rect(3, 7, 18, 17, C.wine);
        for (let x = 4; x < 18; x += 3) c.col(x, 8, 17, D(C.wine));
        c.col(10, 7, 17, mix(C.wine, 0.45));
        c.row(7, 3, 18, C.gold);
      }
    },
    (c, u) => {
      stripes(c, 0, 20, 9, 37, RED, C.bone);
      c.rect(0, 5, 9, 19, RED);
      c.col(0, 5, 37, L(RED));
      c.col(9, 5, 37, D(RED));
      c.rect(8, 18, 10, 19, PINE);
      c.poly([[0, 4], [0, 1], [9, 1], [9, 4]], YEL);
      c.row(4, 0, 9, D(YEL));
      c.col(9, -2, 4, YEL);
      if (u) {
        c.rect(10, 13, 13, 15, RED); // an arm out over the play board
        c.set(14, 14, C.flesh);
        c.rect(10, 10, 11, 12, C.flesh);
        c.set(12, 11, C.flesh);
      }
    },
  );

  /* ---------- play teepee ---------- */
  kid(
    'play-teepee',
    'play tent teepee wigwam canvas poles child den',
    true,
    (c, u) => {
      const CV = hex('#c9bd9c');
      c.poly([[0, 33], [11, 3], [13, 3], [24, 33]], CV);
      c.line(0, 33, 11, 3, L(CV));
      c.line(8, 0, 14, 6, C.wood); // the poles crossing
      c.line(16, 0, 10, 6, C.wood);
      c.line(12, -1, 12, 4, C.wood);
      for (let x = 3; x < 22; x += 4) c.set(x, 26, RED), c.set(x + 1, 25, RED), c.set(x + 2, 26, RED); // zigzag
      c.row(28, 2, 22, BLUE);
      if (u) {
        c.poly([[8, 33], [12, 12], [16, 33]], hex('#8a7a3c')); // lit from inside
        c.poly([[9, 33], [12, 16], [15, 33]], C.glow);
        figure(c, 12, 33, 9, IN);
        c.set(10, 27, IN); // its long fingers
        c.set(15, 27, IN);
        c.set(9, 28, IN);
        c.set(16, 28, IN);
        c.line(8, 33, 6, 22, D(CV));
        c.line(16, 33, 18, 22, D(CV));
      } else {
        c.line(12, 12, 12, 33, D(CV));
        c.line(13, 12, 13, 33, mix(CV, 0.5));
        dots(c, C.wood, [12, 18, 12, 24]);
      }
    },
    (c, u) => {
      const CV = hex('#c9bd9c');
      c.poly([[0, 33], [11, 3], [13, 3], [24, 33]], CV);
      c.line(0, 33, 11, 3, L(CV));
      c.line(8, 0, 14, 6, C.wood);
      c.line(16, 0, 10, 6, C.wood);
      for (let x = 3; x < 22; x += 4) c.set(x, 26, RED), c.set(x + 1, 25, RED), c.set(x + 2, 26, RED);
      c.row(28, 2, 22, BLUE);
      c.line(12, 6, 10, 33, D(CV)); // a seam
      if (u) {
        glow(c, 6, 12, 19, 33, C.glow);
        figure(c, 14, 33, 9, mix(CV, 0.4)); // a shadow on the cloth
        c.set(12, 27, mix(CV, 0.4));
        c.set(17, 27, mix(CV, 0.4));
        c.line(23, 33, 26, 33, C.glow); // light under the flap
      }
    },
  );

  /* ---------- the little rocking chair with a teddy ---------- */
  function teddy(c, x, b, lying) {
    if (lying) {
      c.rect(x, b - 2, x + 6, b, FUR);
      c.rect(x + 7, b - 3, x + 9, b, FUR);
      c.set(x + 8, b - 4, FUR);
      c.set(x, b - 3, FUR);
      c.row(b, x, x + 9, D(FUR));
      return;
    }
    c.rect(x + 1, b - 4, x + 5, b, FUR);
    c.rect(x + 1, b - 8, x + 5, b - 5, FUR);
    c.set(x + 1, b - 9, FUR);
    c.set(x + 5, b - 9, FUR);
    c.set(x, b - 3, FUR);
    c.set(x + 6, b - 3, FUR);
    c.rect(x + 2, b - 6, x + 4, b - 5, L(FUR));
    c.set(x + 2, b - 7, K);
    c.set(x + 4, b - 7, K);
    c.rect(x, b - 1, x + 1, b, D(FUR));
    c.rect(x + 5, b - 1, x + 6, b, D(FUR));
  }
  kid(
    'rocking-chair-teddy',
    'small rocking chair child teddy bear sitting nursery',
    true,
    (c, u) => {
      const W = PAINT,
        t = u ? -2 : 0; // tipped back when used
      c.line(0 + t, 1, 1, 12, W);
      c.line(1 + t, 1, 2, 12, D(W));
      c.rect(1, 11, 10, 12, W);
      c.row(11, 1, 10, L(W));
      c.col(9, 13, 16, W);
      c.col(2, 13, 16, W);
      c.poly([[-2, 15 + (u ? -1 : 1)], [-2, 16 + (u ? -1 : 1)], [13, 17 + (u ? 1 : -1)], [13, 16 + (u ? 1 : -1)]], D(W)); // the rocker
      c.row(17, 2, 9, D(W));
      c.rect(8, 8, 10, 8, W); // arm rest
      c.col(9, 9, 10, W);
      if (u) teddy(c, 15, 17, true);
      else teddy(c, 2, 10, false);
    },
    (c, u) => {
      const W = PAINT;
      c.rect(0, 1, 11, 12, mix(W, 0.5));
      c.col(0, 1, 16, W);
      c.col(11, 1, 16, W);
      c.rect(0, 1, 11, 2, W);
      c.row(1, 0, 11, L(W));
      for (let x = 3; x < 11; x += 3) c.col(x, 3, 10, W);
      c.rect(0, 11, 11, 12, W);
      c.row(11, 0, 11, L(W));
      c.rect(-1, 16, 1, 17, D(W));
      c.rect(10, 16, 12, 17, D(W));
      if (u) teddy(c, 14, 17, true);
      else teddy(c, 2, 10, false);
    },
    { base: 'side' },
  );

  /* ---------- the wardrobe with its door ajar ---------- */
  function clawHand(c, x, y, dir = 1) {
    c.rect(x, y, x + 2 * dir, y + 1, CLAW);
    dots(c, CLAW, [x + 3 * dir, y - 1, x + 3 * dir, y + 1, x + 3 * dir, y + 3, x + 2 * dir, y + 2]);
    dots(c, C.bone, [x + 4 * dir, y - 1, x + 4 * dir, y + 1, x + 4 * dir, y + 3]);
  }
  kid(
    'wardrobe-ajar-eyes',
    'child wardrobe white door ajar eyes inside something watching stickers',
    true,
    (c, u) => {
      const W = PAINT;
      body(c, 0, 1, 21, 35, W);
      c.rect(-1, 0, 22, 1, W);
      c.row(0, -1, 22, L(W));
      legs(c, [0, 20], 36, 37, D(W));
      panel(c, 2, 4, 9, 32, W); // the left door
      c.set(8, 18, PINK);
      dots(c, YEL, [4, 8, 6, 12]); // stickers
      dots(c, RED, [5, 22]);
      dots(c, SKY, [4, 27, 6, 28]);
      if (u) {
        c.rect(11, 3, 20, 33, IN); // open: clothes, and what was looking has moved lower
        c.row(5, 11, 20, C.steel);
        c.rect(12, 6, 14, 15, RED);
        c.rect(15, 6, 16, 13, YEL);
        c.rect(17, 6, 19, 17, BLUE);
        eyes(c, 14, 28, 3);
        clawHand(c, 17, 30, 1);
        slab(c, 22, 5, 35, 6, W); // the door swung right out
        c.set(23, 19, PINK);
      } else {
        c.rect(11, 3, 14, 33, IN); // the gap
        eyes(c, 11, 12, 2);
        panel(c, 14, 4, 20, 32, W); // the right door, standing a little open
        c.col(14, 3, 33, L(W));
        c.set(15, 18, PINK);
        dots(c, GRN, [17, 9, 18, 24]);
      }
    },
    (c, u) => {
      const W = PAINT;
      sideBody(c, 0, 1, 9, 35, W);
      c.rect(-1, 0, 10, 1, W);
      c.row(0, -1, 10, L(W));
      legs(c, [0, 8], 36, 37, D(W));
      if (u) {
        slab(c, 10, 4, 34, 9, W);
        c.set(17, 19, PINK);
        clawHand(c, 10, 28, 1); // fingers round the edge
        c.col(9, 4, 33, IN);
      } else {
        slab(c, 10, 4, 33, 3, W);
        c.col(9, 4, 33, IN);
        c.set(9, 12, C.glow);
      }
    },
  );

  /* ---------- the bed with something under it ---------- */
  const checks = (c, col) => (x0, y0, x1, y1) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (((x >> 1) + (y >> 1)) & 1 && c.get(x, y)) c.set(x, y, col);
  };
  kid(
    'bed-monster-under',
    'child bed something under it monster eyes peeking dark checked blanket',
    true,
    (c, u) => {
      const g = bedSide(c, 0, 35, 19, { frame: PAINT, mh: 10, head: 16, foot: 11 });
      c.rect(2, 15, 33, 19, IN); // the dark under the bed
      c.row(14, 2, 33, D(PAINT));
      pillowSide(c, g);
      duvetSide(c, g, YEL, false, checks(c, hex('#9a6a3a')));
      if (u) {
        c.rect(22, 12, 30, 17, YEL); // the blanket dragged down
        checks(c, hex('#9a6a3a'))(22, 12, 30, 17);
        c.rect(23, 18, 29, 19, D(YEL));
        eyes(c, 9, 17, 3, C.flameLight);
        c.line(14, 18, 36, 18, CLAW); // a long arm out across the floor
        c.line(14, 19, 36, 19, D(CLAW));
        clawHand(c, 37, 17, 1);
      } else eyes(c, 15, 17, 3);
    },
    (c, u) => {
      const g = bedFront(c, 0, 17, 0, 33, { frame: PAINT, head: 16, foot: 9, mh: 10 });
      pillowFront(c, g);
      duvetFront(c, g, YEL, false, checks(c, hex('#9a6a3a')));
      const fb = 33 - 12;
      c.rect(0, fb, 17, 28, PAINT); // the foot end stands on tall legs
      c.row(fb, 0, 17, L(PAINT));
      c.col(0, fb, 33, L(PAINT));
      panel(c, 2, fb + 2, 15, 26, PAINT);
      c.row(28, 0, 17, D(PAINT));
      c.rect(2, 29, 15, 33, IN);
      c.rect(0, 29, 1, 33, PAINT);
      c.rect(16, 29, 17, 33, D(PAINT));
      if (u) {
        eyes(c, 6, 30, 4, C.flameLight);
        c.rect(9, 32, 12, 35, CLAW); // the hand comes out towards you
        dots(c, CLAW, [8, 36, 10, 36, 12, 36, 13, 35]);
        dots(c, C.bone, [8, 37, 10, 37, 12, 37]);
      } else eyes(c, 7, 31, 3);
    },
    { base: 'side' },
  );

  /* ---------- ball pit ---------- */
  const BALLS = [RED, YEL, GRN, SKY, PINK];
  function balls(c, x0, y0, x1, y1, seed) {
    const r = rnd(seed);
    for (let y = y0; y <= y1; y += 2)
      for (let x = x0 + ((y - y0) & 2 ? 1 : 0); x < x1; x += 2) {
        const col = BALLS[(r() * BALLS.length) | 0];
        c.rect(x, y, x + 1, y + 1, col);
        c.set(x, y, L(col));
      }
  }
  kid(
    'ball-pit',
    'ball pit soft play balls padded pool coloured',
    true,
    (c, u) => {
      balls(c, 2, 1, 28, 6, 4);
      c.clear(2, 1), c.clear(3, 1), c.clear(26, 1), c.clear(27, 1), c.clear(28, 1);
      body(c, 0, 5, 29, 13, BLUE);
      c.row(5, 0, 29, L(BLUE));
      for (let x = 7; x < 29; x += 8) c.col(x, 6, 13, D(BLUE)); // the padded sections
      c.rect(0, 5, 1, 13, L(BLUE));
      if (u) {
        c.rect(11, 1, 19, 4, IN); // a hollow, and a hand coming up out of it
        arm(c, 15, 4, 15, -2, C.bone);
        balls(c, 31, 12, 36, 13, 9);
        balls(c, -5, 12, -2, 13, 3);
      }
    },
    (c, u) => {
      balls(c, 2, 1, 16, 6, 6);
      c.clear(2, 1), c.clear(3, 1), c.clear(14, 1), c.clear(15, 1);
      body(c, 0, 5, 17, 13, BLUE);
      c.row(5, 0, 17, L(BLUE));
      c.col(8, 6, 13, D(BLUE));
      if (u) {
        c.rect(6, 1, 11, 4, IN);
        arm(c, 8, 4, 8, -2, C.bone);
        balls(c, 19, 12, 23, 13, 9);
      }
    },
  );

  /* ---------- plastic playhouse ---------- */
  kid(
    'playhouse-plastic',
    'playhouse wendy house plastic toy house door window child',
    true,
    (c, u) => {
      const WALL = hex('#c2b68e');
      body(c, 1, 12, 24, 35, WALL);
      c.poly([[-1, 12], [4, 2], [21, 2], [26, 12]], RED);
      c.line(-1, 12, 4, 2, L(RED));
      c.row(2, 4, 21, L(RED));
      c.row(12, -1, 26, D(RED));
      for (let x = 2; x < 24; x += 5) c.line(x + 2, 3, x, 11, D(RED));
      c.rect(19, 4, 21, 9, RED); // a chimney
      c.rect(19, 0, 21, 3, hex('#7a4a3a'));
      // window
      c.rect(14, 16, 22, 24, u ? IN : hex('#3a4650'));
      c.frame(14, 16, 22, 24, C.white);
      c.col(18, 16, 24, C.white);
      c.row(25, 13, 23, GRN);
      if (u) {
        c.rect(15, 19, 17, 22, C.bone); // a face at the window
        c.set(15, 20, K);
        c.set(17, 20, K);
        c.rect(3, 17, 11, 35, IN); // the door open
        slab(c, 0, 17, 35, 3, GRN);
      } else {
        body(c, 3, 17, 11, 35, GRN);
        c.row(26, 3, 11, D(GRN)); // a stable door
        c.set(10, 22, YEL);
        c.set(10, 30, YEL);
      }
    },
    (c, u) => {
      const WALL = hex('#c2b68e');
      body(c, 1, 12, 16, 35, WALL);
      c.rect(0, 2, 17, 12, RED);
      c.row(2, 0, 17, L(RED));
      c.row(12, 0, 17, D(RED));
      for (let y = 5; y < 12; y += 3) c.row(y, 0, 17, D(RED));
      c.rect(11, 0, 13, 1, hex('#7a4a3a'));
      c.rect(5, 16, 12, 24, u ? IN : hex('#3a4650'));
      c.frame(5, 16, 12, 24, C.white);
      c.row(25, 4, 13, GRN);
      if (u) {
        c.rect(8, 19, 10, 22, C.bone);
        c.set(8, 20, K);
        c.set(10, 20, K);
        slab(c, 17, 17, 35, 5, GRN);
      }
    },
  );

  /* ---------- chest of drawers with stickers ---------- */
  kid(
    'drawers-stickers',
    'chest of drawers child white stickers knobs clothes',
    true,
    (c, u) => {
      body(c, 0, 1, 19, 21, PAINT);
      c.rect(-1, 0, 20, 1, PAINT);
      c.row(0, -1, 20, L(PAINT));
      const knobs = [RED, YEL, GRN, BLUE];
      for (let i = 0; i < 4; i++) {
        if (u && i === 1) {
          c.rect(1, 7, 18, 11, IN);
          continue;
        }
        drawer(c, 1, 2 + i * 5, 18, 6 + i * 5, PAINT, knobs[i]);
      }
      dots(c, YEL, [9, 3, 10, 4, 8, 4]); // stickers
      dots(c, PINK, [14, 13, 15, 13, 14, 14]);
      dots(c, GRN, [5, 18, 6, 18, 6, 19, 7, 18]);
      if (u) {
        drawer(c, 0, 9, 19, 13, PAINT, YEL); // pulled out, a sock hanging
        c.rect(3, 7, 9, 8, RED);
        c.rect(11, 7, 16, 8, SKY);
        c.rect(13, 9, 14, 15, C.white);
        c.set(15, 15, C.white);
        c.row(12, 13, 14, RED);
      }
      legs(c, [0, 18], 22, 23, D(PAINT));
    },
    (c, u) => {
      sideBody(c, 0, 1, 9, 21, PAINT);
      c.rect(-1, 0, 10, 1, PAINT);
      c.row(0, -1, 10, L(PAINT));
      legs(c, [0, 8], 22, 23, D(PAINT));
      if (u) {
        slab(c, 10, 7, 11, 6, PAINT);
        c.row(7, 10, 14, RED);
        c.rect(13, 8, 14, 14, C.white);
      }
    },
  );

  /* ---------- bedside cabinet with a night light ---------- */
  function mushroom(c, x, b, on) {
    const cap = on ? C.flameLight : hex('#a8584a'),
      stem = on ? C.glow : C.bone;
    c.rect(x + 1, b - 2, x + 3, b, stem);
    c.rect(x, b - 5, x + 4, b - 3, cap);
    c.row(b - 6, x + 1, x + 3, cap);
    c.set(x + 1, b - 5, on ? C.white : C.bone);
    c.set(x + 3, b - 4, on ? C.white : C.bone);
    if (on) dots(c, C.glow, [x - 2, b - 5, x + 6, b - 4, x + 2, b - 8, x - 1, b - 7, x + 5, b - 7, x - 2, b - 2, x + 6, b - 1]);
  }
  kid(
    'bedside-night-light',
    'bedside cabinet night light mushroom lamp glass of water child',
    true,
    (c, u) => {
      body(c, 0, 8, 11, 19, PINE);
      c.rect(-1, 7, 12, 8, PINE);
      c.row(7, -1, 12, L(PINE));
      drawer(c, 1, 10, 10, 13, PINE, RED);
      panel(c, 1, 15, 10, 18, PINE);
      legs(c, [0, 10], 20, 21, D(PINE));
      mushroom(c, 1, 6, u);
      c.rect(8, 4, 9, 6, C.glassLight); // a glass of water
      c.set(8, 6, C.glass);
      if (u) glow(c, 0, 7, 6, 9, C.glow);
    },
    (c, u) => {
      sideBody(c, 0, 8, 8, 19, PINE);
      c.rect(-1, 7, 9, 8, PINE);
      c.row(7, -1, 9, L(PINE));
      legs(c, [0, 7], 20, 21, D(PINE));
      mushroom(c, 2, 6, u);
      if (u) glow(c, 1, 7, 7, 9, C.glow);
    },
  );

  /* ---------- the homework desk ---------- */
  kid(
    'desk-homework-lamp',
    'child desk homework lamp exercise book pencils drawers',
    true,
    (c, u) => {
      const b = 25;
      table(c, 0, 25, 11, b, PINE, { apron: false });
      body(c, 16, 13, 24, b - 1, PINE);
      drawer(c, 17, 14, 23, 17, PINE, C.steel);
      drawer(c, 17, 19, 23, 23, PINE, C.steel);
      // the lamp
      c.rect(1, 9, 5, 10, RED);
      c.line(3, 8, 5, 3, C.iron);
      c.line(5, 3, 9, 1, C.iron);
      c.poly([[8, 0], [12, 0], [13, 3], [8, 3]], RED);
      c.row(4, 9, 12, u ? C.flameLight : IN);
      paper(c, 9, 9, 15, 10); // the exercise book
      c.set(12, 9, D(C.paper));
      c.rect(20, 7, 22, 10, BLUE); // pencil pot
      dots(c, YEL, [20, 6, 22, 5]);
      c.set(21, 6, RED);
      if (u) {
        c.poly([[9, 5], [12, 5], [16, 8], [7, 8]], C.glow); // the light, and what has been written
        c.dither(7, 5, 16, 8, C.flameLight);
        c.rect(9, 9, 15, 10, C.white);
        dots(c, RED, [10, 9, 11, 10, 12, 9, 13, 10, 14, 9]);
      }
    },
    (c, u) => {
      const b = 25;
      table(c, 0, 12, 11, b, PINE, { apron: false });
      sideBody(c, 1, 13, 11, b - 1, PINE);
      c.rect(3, 9, 6, 10, RED);
      c.col(4, 3, 8, C.iron);
      c.rect(3, 0, 9, 3, RED);
      c.col(10, 1, 4, u ? C.flameLight : IN);
      paper(c, 8, 10, 11, 10);
      if (u) c.poly([[10, 5], [12, 5], [13, 9], [9, 9]], C.glow), c.dither(9, 5, 13, 9, C.flameLight);
    },
  );
};
