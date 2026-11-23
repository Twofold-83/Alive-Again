/* Child's room, part 4: small toys and nursery things. */
module.exports = (H) => {
  const { C, K, hex, mix, blend, D, L, rnd, setting, dots, panel, legs, body, sideBody, slab, eyes, wheel, paper, glow, figure, fallen } = H;
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
    ORANGE = hex('#b8703a'),
    LILAC = hex('#7a6a8c');

  /* ---------- space hopper ---------- */
  kid(
    'space-hopper',
    'space hopper bouncy ball orange horns face toy',
    false,
    (c, u) => {
      if (u) {
        // all the air has gone out of it
        c.poly([[0, 15], [2, 11], [8, 9], [14, 11], [17, 15]], ORANGE);
        c.line(2, 11, 8, 9, L(ORANGE));
        c.line(4, 13, 7, 11, D(ORANGE));
        c.line(10, 11, 13, 14, D(ORANGE));
        c.rect(4, 7, 5, 9, D(ORANGE));
        c.rect(10, 8, 12, 9, D(ORANGE));
        c.set(6, 12, K);
        c.set(10, 13, K);
        c.line(6, 14, 11, 15, K);
        return;
      }
      c.oval(0, 3, 13, 15, ORANGE);
      c.line(2, 6, 4, 4, L(ORANGE));
      c.rect(3, 0, 4, 3, D(ORANGE)); // the horns
      c.rect(9, 0, 10, 3, D(ORANGE));
      c.rect(4, 7, 5, 8, K); // the face
      c.rect(8, 7, 9, 8, K);
      c.row(11, 4, 9, K);
      c.set(3, 10, K);
      c.set(10, 10, K);
    },
    (c, u) => {
      if (u) {
        c.poly([[0, 15], [2, 11], [7, 9], [12, 11], [14, 15]], ORANGE);
        c.line(2, 11, 7, 9, L(ORANGE));
        c.line(5, 13, 8, 11, D(ORANGE));
        c.rect(6, 7, 7, 9, D(ORANGE));
        c.set(11, 13, K);
        return;
      }
      c.oval(0, 3, 13, 15, ORANGE);
      c.line(2, 6, 4, 4, L(ORANGE));
      c.rect(6, 0, 7, 3, D(ORANGE));
      c.rect(11, 7, 12, 8, K);
      c.row(11, 11, 12, K);
    },
  );

  /* ---------- piggy bank ---------- */
  const PIG = hex('#b8808a');
  function shards(c, b, n) {
    c.poly([[0, b], [2, b - 3], [5, b]], PIG);
    c.poly([[7, b], [9, b - 4], [10, b - 4], [12, b]], PIG);
    c.set(9, b - 2, K);
    c.rect(4, b - 1, 5, b, L(PIG));
    if (n > 12) c.poly([[14, b], [15, b - 2], [17, b]], D(PIG));
    dots(c, C.gold, [3, b, 6, b, 6, b - 1, 13, b, n > 12 ? 18 : 11, b]);
    c.set(1, b, C.gold);
  }
  kid(
    'piggy-bank-china',
    'piggy bank china pig pink money box coins savings',
    false,
    (c, u) => {
      if (u) return shards(c, 9, 16); // smashed for what was in it
      c.oval(1, 2, 12, 8, PIG);
      c.row(2, 4, 9, L(PIG));
      c.rect(12, 4, 14, 6, PIG); // snout
      c.set(14, 5, D(PIG));
      c.set(11, 4, K);
      c.poly([[9, 2], [10, 0], [11, 2]], D(PIG)); // ear
      c.row(1, 5, 7, K); // the slot
      c.rect(2, 9, 3, 9, D(PIG));
      c.rect(9, 9, 10, 9, D(PIG));
      c.set(0, 4, PIG); // tail
      c.set(0, 3, D(PIG));
    },
    (c, u) => {
      if (u) return shards(c, 9, 10);
      c.oval(0, 2, 9, 8, PIG);
      c.row(2, 3, 6, L(PIG));
      c.rect(3, 5, 6, 6, D(PIG));
      c.set(4, 6, K);
      c.set(6, 6, K);
      c.set(2, 4, K);
      c.set(7, 4, K);
      c.set(1, 1, D(PIG));
      c.set(8, 1, D(PIG));
      c.rect(1, 9, 2, 9, D(PIG));
      c.rect(7, 9, 8, 9, D(PIG));
    },
  );

  /* ---------- walkie-talkies ---------- */
  function handset(c, x, b, live) {
    c.rect(x, b - 8, x + 4, b, hex('#3a3c40'));
    c.col(x, b - 8, b, hex('#55585c'));
    c.col(x + 1, b - 12, b - 9, K); // aerial
    c.rect(x + 1, b - 6, x + 3, b - 4, YEL); // speaker
    dots(c, K, [x + 1, b - 5, x + 3, b - 5]);
    c.set(x + 3, b - 7, live ? C.red : hex('#5a2a28'));
    c.rect(x + 1, b - 2, x + 3, b - 1, hex('#55585c'));
  }
  kid(
    'walkie-talkies',
    'walkie talkies pair toy radio handsets aerial yellow',
    false,
    (c, u) => {
      handset(c, 0, 12, false);
      handset(c, 7, 12, u);
      if (u) {
        // one of them is talking, and nobody is holding the other
        c.line(13, 3, 14, 5, C.glow);
        c.line(14, 5, 13, 7, C.glow);
        c.line(15, 2, 17, 5, C.glow);
        c.line(17, 5, 15, 8, C.glow);
      }
    },
    (c, u) => {
      c.rect(0, 4, 2, 12, hex('#3a3c40'));
      c.col(0, 4, 12, hex('#55585c'));
      c.col(1, 0, 3, K);
      c.col(3, 6, 8, YEL);
      if (u) c.set(3, 5, C.red), c.line(5, 4, 6, 6, C.glow), c.line(6, 6, 5, 8, C.glow);
    },
  );

  /* ---------- reading under the blanket by torch ---------- */
  kid(
    'torch-under-blanket',
    'blanket den torch light reading under the covers lump glow',
    false,
    (c, u) => {
      if (u) {
        // the blanket thrown off: a torch, a book, nobody
        c.poly([[0, 13], [2, 10], [9, 9], [13, 13]], LILAC);
        c.line(2, 10, 9, 9, L(LILAC));
        c.line(5, 13, 7, 10, D(LILAC));
        c.rect(15, 11, 19, 12, C.steel);
        c.rect(20, 10, 21, 13, C.steel);
        c.poly([[22, 10], [29, 7], [29, 13], [22, 13]], C.glow);
        c.dither(24, 7, 29, 13, C.flameLight);
        c.rect(23, 12, 28, 13, C.paper);
        c.col(25, 11, 13, D(C.paper));
        return;
      }
      c.poly([[0, 13], [1, 8], [6, 3], [12, 1], [18, 3], [23, 9], [24, 13]], LILAC);
      c.line(1, 8, 6, 3, L(LILAC));
      c.line(6, 3, 12, 1, L(LILAC));
      c.line(9, 4, 6, 12, D(LILAC));
      c.line(16, 4, 19, 12, D(LILAC));
      dots(c, PINK, [4, 9, 11, 6, 14, 10, 20, 9, 8, 11]);
      c.rect(10, 11, 17, 13, C.flameLight); // the light getting out underneath
      c.row(10, 11, 16, C.glow);
      glow(c, 8, 6, 18, 9, hex('#9a8a8c'));
    },
    (c, u) => {
      if (u) {
        c.poly([[0, 13], [2, 10], [7, 9], [10, 13]], LILAC);
        c.line(2, 10, 7, 9, L(LILAC));
        c.rect(12, 10, 13, 13, C.steel);
        c.poly([[14, 10], [19, 8], [19, 13], [14, 13]], C.glow);
        c.dither(15, 8, 19, 13, C.flameLight);
        return;
      }
      c.poly([[0, 13], [1, 7], [5, 2], [9, 1], [13, 4], [15, 13]], LILAC);
      c.line(1, 7, 5, 2, L(LILAC));
      c.line(8, 3, 6, 12, D(LILAC));
      dots(c, PINK, [3, 9, 10, 7, 12, 11]);
      c.rect(9, 11, 15, 13, C.flameLight);
      c.row(10, 10, 14, C.glow);
    },
    { base: 'side' },
  );

  /* ---------- musical carousel ---------- */
  kid(
    'music-carousel',
    'music carousel toy merry go round horses wind up tune',
    false,
    (c, u) => {
      c.poly([[0, 5], [6, 1], [7, 1], [13, 5]], RED);
      for (let x = 2; x < 13; x += 4) c.line(x + 1, 2 + Math.abs(6 - x) / 3, x, 5, C.bone);
      c.row(5, 0, 13, u ? C.flameLight : YEL);
      c.set(6, 0, C.gold);
      c.set(7, -1, C.gold);
      const ys = u ? [9, 7, 10] : [8, 9, 8];
      [2, 6, 10].forEach((x, i) => {
        c.col(x + 1, 6, 12, C.brass);
        c.rect(x, ys[i], x + 2, ys[i] + 1, i === 1 ? IN : C.white); // one horse is black
        c.set(x + 2, ys[i] - 1, i === 1 ? IN : C.white);
        c.set(x, ys[i] + 2, i === 1 ? IN : C.white);
      });
      body(c, 0, 13, 13, 15, BLUE);
      c.rect(14, 13, 15, 14, C.brass); // the key
      if (u) c.set(15, 12, C.brass), c.set(15, 15, C.brass);
      else c.set(16, 13, C.brass), c.set(16, 14, C.brass);
    },
    null,
    { round: true },
  );

  /* ---------- baby monitor ---------- */
  kid(
    'baby-monitor',
    'baby monitor listening device white aerial lights nursery',
    false,
    (c, u) => {
      body(c, 0, 4, 7, 13, PAINT);
      c.col(6, 0, 3, K);
      c.rect(2, 9, 5, 11, D(PAINT));
      dots(c, K, [2, 9, 4, 9, 3, 10, 5, 10, 2, 11, 4, 11]);
      for (let i = 0; i < 5; i++) c.set(1 + i, 6, u ? (i < 2 ? GRN : i < 4 ? C.flame : C.red) : hex('#59605a'));
      if (u) c.row(5, 1, 5, D(PAINT)), c.set(5, 5, C.red); // it hears something
    },
    (c, u) => {
      sideBody(c, 0, 4, 3, 13, PAINT);
      c.col(1, 0, 3, K);
      c.set(4, 6, u ? C.red : hex('#59605a'));
      c.rect(-1, 13, 4, 13, D(PAINT));
    },
  );

  /* ---------- baby gym ---------- */
  kid(
    'baby-gym-arch',
    'baby gym play mat arch hanging toys padded',
    false,
    (c, u) => {
      c.rect(0, 14, 27, 15, SKY);
      c.row(14, 0, 27, L(SKY));
      dots(c, YEL, [4, 15, 12, 15, 20, 15]);
      for (let x = 0; x <= 27; x++) {
        const y = Math.round(13 - 12 * Math.sin((Math.PI * x) / 27)) + (u && x > 13 ? Math.round((x - 13) / 5) : 0);
        c.set(x, y, RED);
        c.set(x, y + 1, D(RED));
      }
      const hang = (x, n, col) => {
        const y0 = Math.round(13 - 12 * Math.sin((Math.PI * x) / 27)) + 2;
        c.col(x, y0, y0 + n, C.ash);
        c.rect(x - 1, y0 + n + 1, x + 1, y0 + n + 2, col);
      };
      hang(8, 2, YEL);
      hang(13, 3, GRN);
      if (u) {
        c.col(19, 5, 6, C.ash); // one pulled off
        c.rect(21, 12, 23, 13, PINK);
        c.oval(8, 13, 16, 15, D(SKY)); // and the mat still pressed down
      } else hang(19, 2, PINK);
    },
    (c, u) => {
      c.rect(0, 14, 15, 15, SKY);
      c.row(14, 0, 15, L(SKY));
      c.line(1, 14, 14, 1, RED);
      c.line(14, 14, 1, 1, D(RED));
      c.col(7, 8, 10, C.ash);
      c.rect(6, 11, 8, 12, GRN);
      if (u) c.rect(11, 12, 13, 13, PINK), c.row(15, 4, 10, D(SKY));
    },
  );

  /* ---------- child's blackboard ---------- */
  const LETTERS = {
    R: ['11.', '1.1', '11.', '1.1', '1.1'],
    U: ['1.1', '1.1', '1.1', '1.1', '111'],
    N: ['1.1', '111', '111', '1.1', '1.1'],
    A: ['.1.', '1.1', '111', '1.1', '1.1'],
    B: ['11.', '1.1', '11.', '1.1', '11.'],
    C: ['.11', '1..', '1..', '1..', '.11'],
  };
  function chalk(c, text, x, y, col) {
    [...text].forEach((ch, i) => LETTERS[ch].forEach((row, j) => [...row].forEach((p, k) => p === '1' && c.set(x + i * 4 + k, y + j, col))));
  }
  kid(
    'blackboard-child',
    'child blackboard easel chalk board abc letters',
    true,
    (c, u) => {
      c.line(1, 2, 0, 25, PINE);
      c.line(16, 2, 17, 25, PINE);
      body(c, 0, 0, 17, 15, PINE);
      c.rect(2, 2, 15, 13, hex('#2c3430'));
      if (u) {
        c.dither(2, 2, 15, 13, hex('#3a443e')); // wiped, and written over
        chalk(c, 'RUN', 3, 5, C.white);
        c.set(14, 11, C.white);
      } else {
        chalk(c, 'ABC', 3, 3, hex('#b9bdb4'));
        c.rect(5, 10, 7, 12, YEL); // a chalk sun
        c.row(12, 9, 13, PINK);
      }
      c.rect(0, 16, 17, 17, PINE);
      c.row(16, 0, 17, L(PINE));
      c.rect(3, 15, 5, 15, C.white); // chalk
      c.rect(11, 14, 14, 15, D(C.stone));
    },
    (c, u) => {
      c.line(5, 0, 0, 25, PINE);
      c.line(6, 0, 11, 25, PINE);
      c.line(7, 0, 12, 25, D(PINE));
      c.line(8, 2, 10, 14, hex('#2c3430'));
      c.rect(10, 16, 13, 17, PINE);
      c.set(12, 15, C.white);
      c.row(20, 3, 9, D(PINE));
      if (u) c.set(13, 25, C.white), c.set(15, 25, C.white), c.set(14, 24, C.white); // chalk dropped and broken
    },
  );

  /* ---------- stair gate ---------- */
  function gate(c, x0, x1) {
    c.rect(x0, 2, x1, 3, PAINT);
    c.row(2, x0, x1, L(PAINT));
    c.rect(x0, 13, x1, 14, PAINT);
    for (let x = x0 + 1; x < x1; x += 3) c.col(x, 4, 12, PAINT);
  }
  kid(
    'stair-gate',
    'stair gate baby safety gate white bars doorway',
    true,
    (c, u) => {
      c.rect(0, 0, 1, 15, PAINT);
      c.col(0, 0, 15, L(PAINT));
      c.rect(22, 0, 23, 15, PAINT);
      if (u) {
        slab(c, 2, 1, 14, 3, PAINT); // swung open towards you
        c.set(21, 6, C.steel);
      } else {
        gate(c, 2, 21);
        c.rect(19, 5, 21, 7, C.steel); // the catch
      }
    },
    (c, u) => {
      c.rect(0, 0, 2, 15, PAINT);
      c.col(0, 0, 15, L(PAINT));
      if (u) gate(c, 3, 22), c.rect(21, 5, 23, 7, C.steel);
    },
  );

  /* ---------- tin robot ---------- */
  const TIN = hex('#7d8c84');
  kid(
    'robot-toy-tin',
    'tin robot toy wind up clockwork grey green antenna',
    false,
    (c, u) => {
      c.col(4, 0, 1, K);
      c.set(4, -1, u ? C.red : RED);
      body(c, 2, 2, 7, 5, TIN); // head
      c.set(3, 3, u ? C.flameLight : IN);
      c.set(6, 3, u ? C.flameLight : IN);
      c.row(5, 3, 6, IN);
      body(c, 1, 6, 8, 11, TIN);
      c.rect(3, 7, 6, 9, IN);
      c.set(4, 8, u ? C.red : RED);
      c.set(5, 8, YEL);
      if (u) c.rect(0, 3, 0, 7, D(TIN)), c.rect(9, 3, 9, 7, D(TIN)); // arms up
      else c.rect(0, 6, 0, 10, D(TIN)), c.rect(9, 6, 9, 10, D(TIN));
      c.rect(2, 12, 3, 14, D(TIN));
      c.rect(6, 12, 7, 14, D(TIN));
      c.set(1, 14, D(TIN));
      c.set(8, 14, D(TIN));
    },
    (c, u) => {
      c.col(3, 0, 1, K);
      c.set(3, -1, u ? C.red : RED);
      body(c, 1, 2, 5, 5, TIN);
      c.set(5, 3, u ? C.flameLight : IN);
      body(c, 1, 6, 5, 11, TIN);
      c.rect(-1, 8, 0, 9, C.brass); // the key in its back
      c.set(-2, u ? 7 : 8, C.brass);
      c.set(-2, u ? 10 : 9, C.brass);
      if (u) c.rect(4, 6, 8, 7, D(TIN)), c.set(9, 6, D(TIN)); // an arm out in front
      else c.rect(3, 6, 4, 10, D(TIN));
      c.rect(2, 12, 4, 14, D(TIN));
      c.set(5, 14, D(TIN));
      if (u) c.set(6, 14, D(TIN)), c.rect(1, 12, 2, 13, D(TIN));
    },
  );

  /* ---------- toy piano ---------- */
  kid(
    'toy-piano-small',
    'toy piano small red upright child keys plinky',
    true,
    (c, u) => {
      body(c, 0, 0, 17, 6, RED);
      panel(c, 2, 1, 15, 5, RED);
      c.rect(0, 7, 17, 9, C.white); // the keys
      for (let x = 2; x < 17; x += 2) c.set(x, 9, D(C.white)), x % 6 && c.rect(x, 7, x, 8, K);
      c.rect(0, 10, 17, 11, RED);
      legs(c, [0, 16], 12, 13, D(RED));
      c.rect(1, 12, 1, 13, D(RED));
      if (u) {
        c.rect(5, 8, 6, 9, D(C.white)); // two keys held down by nobody
        c.rect(11, 8, 11, 9, D(C.white));
        c.row(7, 5, 6, RED);
        c.set(11, 7, RED);
        paper(c, 5, -4, 12, 0); // and the music has opened itself
        c.col(8, -4, 0, D(C.paper));
        dots(c, K, [6, -2, 7, -3, 10, -2, 11, -1]);
      }
    },
    (c, u) => {
      sideBody(c, 0, 0, 5, 11, RED);
      c.rect(6, 7, 9, 9, C.white);
      c.row(9, 6, 9, D(C.white));
      c.rect(6, 10, 9, 11, RED);
      c.col(9, 12, 13, D(RED));
      legs(c, [0], 12, 13, D(RED));
      if (u) c.rect(5, -4, 6, 0, C.paper), c.set(9, 8, D(C.white));
    },
  );
};
