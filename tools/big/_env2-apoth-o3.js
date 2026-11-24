/* Old time, third part: the home — parlour, kitchen and scullery. Part of tools/big/env2-apoth.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, tleg, cabSide, hollow, pane, flame, fire, wisp, shards, glow, puddle, cartWheel, wheelEdge, doorOut, opened, pull, pullS } = H;
  const add = H.reg('env-oldtime', 'Old time');
  const OAK = hex('#6a4a32'),
    WAL = hex('#59402e'),
    PINE = hex('#94714a'),
    MAH = hex('#5a3226'),
    EB = hex('#2b242a'),
    CREAM = hex('#b9ad8a'),
    CHINA = hex('#d6d2c4'),
    DELFT = hex('#44506e'),
    MARB = hex('#b4aea0'),
    TIN = hex('#8a8c90'),
    BR = C.brass,
    GILT = C.gold,
    IRONB = hex('#2a2a30'),
    QUILT = hex('#5a4a6a'),
    MADDER = hex('#7a3a30'),
    WAT = hex('#6f8f98'),
    LIT = hex('#e0c868');

  add('oldtime-pot-belly-stove', 'old time pot bellied stove cast iron stove pipe coal heater waiting room', {
    w: 16, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(7, 1, 8, b - 23, IRONB);
      c.col(7, 1, b - 23, C.iron);
      c.row(10, 7, 8, C.iron);
      c.rect(5, b - 23, 10, b - 21, IRONB);
      c.row(b - 23, 5, 10, C.iron);
      c.oval(2, b - 21, 13, b - 6, IRONB);
      for (let i = 0; i < 6; i++) c.set(4 + (i >> 2), b - 10 - i, C.iron);
      c.row(b - 17, 3, 12, C.iron);
      c.row(b - 8, 4, 11, C.iron);
      c.rect(4, b - 6, 11, b - 4, IRONB);
      c.row(b - 4, 3, 12, C.iron);
      legs(c, [3, 11], b - 3, b, IRONB, 2);
      c.rect(6, b - 15, 9, b - 11, u ? C.flame : hex('#3a2a22')); // the door and its mica
      c.frame(5, b - 16, 10, b - 10, C.iron);
      c.set(10, b - 13, BR);
      if (u) {
        dots(c, C.flameLight, [7, b - 12, 8, b - 13, 7, b - 14]);
        dots(c, C.flame, [6, b - 5, 8, b - 5, 10, b - 5]);
        dots(c, hex('#5a3a30'), [3, b - 12, 12, b - 14]);
        dots(c, C.flame, [7, b - 2, 8, b - 1]); // a coal fallen out under it
        c.set(7, b - 1, C.red);
      }
    },
    sw: 16, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      c.rect(5, 1, 6, b - 23, IRONB);
      c.col(5, 1, b - 23, C.iron);
      c.row(10, 5, 6, C.iron);
      c.rect(1, 3, 5, 4, IRONB); // the pipe turns off to the wall
      c.rect(4, b - 23, 9, b - 21, IRONB);
      c.row(b - 23, 4, 9, C.iron);
      c.oval(1, b - 21, 12, b - 6, IRONB);
      for (let i = 0; i < 6; i++) c.set(3 + (i >> 2), b - 10 - i, C.iron);
      c.row(b - 17, 2, 11, C.iron);
      c.row(b - 8, 3, 10, C.iron);
      c.rect(3, b - 6, 10, b - 4, IRONB);
      c.row(b - 4, 2, 11, C.iron);
      legs(c, [2, 10], b - 3, b, IRONB, 2);
      c.col(13, b - 16, b - 10, C.iron); // the door edge on
      c.set(14, b - 13, BR);
      if (u) {
        dots(c, C.flame, [12, b - 14, 12, b - 12, 14, b - 15, 14, b - 11]);
        dots(c, C.flame, [5, b - 5, 8, b - 5, 13, b - 1]);
        c.set(13, b, C.red);
      }
    },
  });

  add('oldtime-grandfather-clock-oak', 'old time grandfather clock long case oak brass face pendulum weights hall', {
    w: 14, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[2, 3], [11, 3], [8, 1], [5, 1]], OAK);
      c.row(1, 5, 8, L(OAK));
      face(c, 2, 4, 11, 13, OAK);
      c.oval(3, 5, 10, 12, BR);
      c.oval(4, 6, 9, 11, CREAM);
      c.set(6, 8, K);
      if (!u) {
        c.line(6, 8, 6, 6, K);
        c.line(7, 8, 8, 9, K);
      } else {
        c.line(6, 8, 5, 6, K); // thirteen minutes to twelve, and it has stopped there
        c.line(6, 8, 6, 6, K);
      }
      c.row(14, 1, 12, L(OAK));
      face(c, 3, 15, 10, b - 9, OAK);
      if (!u) {
        panel(c, 4, 16, 9, b - 10, OAK);
        c.oval(5, 22, 8, 25, C.glass);
        c.set(6, 23, BR);
        c.set(9, 20, BR);
      } else {
        hollow(c, 4, 16, 9, b - 10, OAK); // the door open: weights, the pendulum hanging dead
        c.col(5, 16, 22, C.straw);
        c.rect(5, 23, 5, 26, BR);
        c.col(8, 16, 19, C.straw);
        c.rect(8, 20, 8, 23, BR);
        c.line(6, 16, 7, b - 14, C.steel);
        c.oval(6, b - 14, 8, b - 12, BR);
        c.col(3, 15, b - 9, L(OAK));
        c.set(5, b - 10, C.paper); // something folded small at the bottom
      }
      c.row(b - 8, 1, 12, L(OAK));
      face(c, 2, b - 7, 11, b, OAK);
      panel(c, 4, b - 5, 9, b - 2, OAK);
    },
    sw: 10, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 7, 3, OAK);
      c.row(1, 3, 6, L(OAK));
      cabSide(c, 2, 4, 7, 13, OAK);
      c.rect(4, 6, 5, 10, C.glass);
      c.row(14, 1, 8, L(OAK));
      cabSide(c, 3, 15, 6, b - 9, OAK, false);
      c.row(b - 8, 1, 8, L(OAK));
      cabSide(c, 2, b - 7, 7, b, OAK, false);
      c.col(8, 5, 12, BR);
      if (u) doorOut(c, 7, 16, b - 10, 5, OAK);
    },
    su: [0, 0, 4],
  });

  add('oldtime-wash-stand-jug', 'old time wash stand marble top jug and basin tiled splash back towel rail bedroom', {
    w: 22, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 3, b - 22, 17, b - 14, WAL); // splash back
      for (let x = 5; x <= 15; x += 3) {
        c.rect(x, b - 20, x + 1, b - 18, CHINA);
        c.rect(x, b - 17, x + 1, b - 15, DELFT);
        c.set(x, b - 20, DELFT);
      }
      board(c, 2, b - 13, 18, b - 12, MARB);
      face(c, 3, b - 11, 17, b - 1, WAL);
      drawer(c, 4, b - 10, 16, b - 8, WAL);
      panel(c, 4, b - 6, 9, b - 2, WAL);
      panel(c, 11, b - 6, 16, b - 2, WAL);
      legs(c, [3, 16], b, b, D(WAL));
      c.rect(19, b - 13, 20, b - 13, WAL); // towel rail
      c.col(20, b - 12, b - 11, WAL);
      c.rect(6, b - 15, 14, b - 14, CHINA); // the basin
      c.row(b - 16, 5, 15, CHINA);
      c.row(b - 14, 7, 13, D(CHINA));
      dots(c, DELFT, [7, b - 15, 10, b - 15, 13, b - 15]);
      if (!u) {
        c.rect(8, b - 21, 11, b - 16, CHINA); // the jug standing in it
        c.row(b - 22, 9, 12, CHINA);
        c.set(12, b - 21, CHINA);
        c.col(7, b - 20, b - 18, CHINA);
        c.row(b - 19, 8, 11, DELFT);
        c.col(8, b - 21, b - 17, L(CHINA));
        c.rect(19, b - 12, 20, b - 5, C.white);
        c.col(19, b - 12, b - 5, L(C.white));
        c.row(b - 6, 19, 20, MADDER);
      } else {
        c.row(b - 16, 6, 14, WAT); // water in the basin, pink
        dots(c, hex('#a8706a'), [8, b - 16, 9, b - 16, 12, b - 16]);
        c.rect(15, b - 19, 18, b - 14, CHINA); // the jug stood by
        c.row(b - 20, 16, 19, CHINA);
        c.row(b - 17, 15, 18, DELFT);
        c.rect(17, b - 1, 21, b, C.white); // the towel on the floor
        c.set(18, b - 1, C.blood);
        c.set(20, b, MADDER);
        c.set(3, b - 12, WAT);
        c.col(3, b - 11, b - 9, WAT);
      }
    },
    sw: 12, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 22, 3, b - 14, WAL);
      c.col(2, b - 22, b - 14, L(WAL));
      board(c, 1, b - 13, 10, b - 12, MARB);
      cabSide(c, 2, b - 11, 9, b - 1, WAL);
      legs(c, [2, 9], b, b, D(WAL), 1);
      c.rect(4, b - 15, 9, b - 14, CHINA);
      c.row(b - 16, 3, 10, CHINA);
      if (!u) {
        c.rect(5, b - 21, 8, b - 16, CHINA);
        c.row(b - 22, 6, 9, CHINA);
        c.row(b - 19, 5, 8, DELFT);
        c.col(5, b - 21, b - 17, L(CHINA));
        c.rect(4, b - 11, 7, b - 5, C.white); // the towel on its rail, this end
        c.row(b - 6, 4, 7, MADDER);
        c.row(b - 12, 3, 8, WAL);
      } else {
        c.row(b - 16, 4, 9, WAT);
        c.set(6, b - 16, hex('#a8706a'));
        c.row(b - 12, 3, 8, WAL);
        c.rect(5, b - 1, 9, b, C.white);
        c.set(7, b - 1, C.blood);
      }
    },
  });

  add('oldtime-treadle-sewing-machine', 'old time treadle sewing machine cast iron stand black gilt wooden top seamstress', {
    w: 24, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 13, 22, b - 12, WAL);
      drawer(c, 2, b - 11, 6, b - 9, WAL);
      drawer(c, 17, b - 11, 21, b - 9, WAL);
      for (const x of [3, 19]) {
        c.col(x, b - 8, b, IRONB);
        c.col(x + 1, b - 8, b, IRONB);
        c.set(x, b - 8, C.iron);
      }
      c.line(5, b - 8, 10, b - 3, IRONB);
      c.line(18, b - 8, 13, b - 3, IRONB);
      c.rect(8, b - 2, 15, b - 1, IRONB); // the treadle
      c.row(b - 2, 8, 15, C.iron);
      cartWheel(c, 17, b - 6, 3, IRONB);
      c.rect(7, b - 15, 18, b - 14, EB); // the machine
      c.rect(15, b - 21, 18, b - 16, EB);
      c.rect(7, b - 21, 15, b - 19, EB);
      c.rect(7, b - 18, 8, b - 16, EB);
      c.row(b - 21, 7, 18, hex('#4a4a55'));
      dots(c, GILT, [10, b - 20, 12, b - 20, 16, b - 18, 17, b - 17]);
      c.col(8, b - 15, b - 14, C.steel);
      c.oval(19, b - 20, 21, b - 17, C.steel); // hand wheel
      c.set(11, b - 22, MADDER); // the reel
      c.set(11, b - 23, MADDER);
      if (u) {
        c.poly([[2, b - 15], [11, b - 15], [11, b - 14], [2, b - 14]], C.white); // a seam half run: the cloth trailing to the floor
        c.poly([[1, b - 14], [5, b - 14], [6, b - 2], [0, b]], C.white);
        c.col(3, b - 13, b - 2, D(C.white));
        c.rect(0, b - 1, 7, b, C.white);
        dots(c, MADDER, [9, b - 15, 7, b - 15, 5, b - 15]);
        c.set(9, b - 16, C.blood);
      }
    },
    u: [1, 0, 0],
    sw: 13, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 13, 11, b - 12, WAL);
      c.rect(2, b - 11, 10, b - 9, WAL);
      c.row(b - 9, 2, 10, D(WAL));
      for (const x of [2, 9]) {
        c.col(x, b - 8, b, IRONB);
        c.col(x + 1, b - 8, b, IRONB);
      }
      c.row(b - 5, 3, 9, C.iron);
      c.line(3, b - 8, 9, b - 1, IRONB);
      c.rect(3, b - 2, 9, b - 1, IRONB);
      c.rect(4, b - 21, 8, b - 14, EB);
      c.row(b - 21, 4, 8, hex('#4a4a55'));
      c.oval(4, b - 20, 8, b - 16, C.steel);
      c.set(6, b - 18, IRONB);
      c.set(6, b - 22, MADDER);
      if (u) {
        c.rect(2, b - 15, 4, b - 14, C.white);
        c.poly([[1, b - 14], [3, b - 14], [4, b], [0, b]], C.white);
        c.col(2, b - 13, b - 2, D(C.white));
      }
    },
    su: [1, 0, 0],
  });

  add('oldtime-butter-churn-barrel', 'old time butter churn barrel on a stand crank dairy end over end wooden', {
    w: 18, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.line(3, b - 13, 1, b, OAK);
      c.line(14, b - 13, 16, b, D(OAK));
      c.row(b - 4, 2, 15, D(OAK));
      c.rect(4, b - 19, 13, b - 7, PINE);
      c.col(4, b - 19, b - 7, L(PINE));
      for (const x of [7, 10]) c.col(x, b - 19, b - 7, D(PINE));
      for (const y of [b - 17, b - 9]) c.row(y, 4, 13, C.iron);
      c.rect(2, b - 13, 3, b - 12, C.iron);
      c.rect(14, b - 13, 15, b - 12, C.iron);
      c.col(16, b - 13, b - 10, C.iron); // the crank
      c.set(17, b - 10, OAK);
      if (!u) {
        c.rect(4, b - 21, 13, b - 20, PINE);
        c.row(b - 21, 4, 13, L(PINE));
        dots(c, C.iron, [5, b - 20, 12, b - 20]);
        c.set(8, b - 22, C.iron);
      } else {
        c.row(b - 20, 5, 12, hex('#d8c888')); // the lid off: the butter has come
        dots(c, hex('#ead9a0'), [6, b - 20, 9, b - 21, 10, b - 20]);
        c.rect(4, b - 20, 4, b - 20, PINE);
        c.rect(13, b - 20, 13, b - 20, PINE);
        c.rect(6, b - 1, 12, b, PINE); // the lid on the floor
        c.col(8, b - 6, b - 5, hex('#c8c0a0')); // buttermilk running from the bung
        puddle(c, 6, 10, b - 2 + 2, hex('#c8c0a0'));
        c.rect(6, b - 1, 12, b - 1, PINE);
      }
    },
    sw: 16, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      c.col(7, b - 11, b, OAK);
      c.col(8, b - 11, b, D(OAK));
      c.rect(4, b, 11, b, OAK);
      c.rect(4, b - 19, 11, b - 7, PINE);
      c.col(4, b - 19, b - 7, L(PINE));
      c.col(8, b - 19, b - 7, D(PINE));
      for (const y of [b - 17, b - 9]) c.row(y, 4, 11, C.iron);
      c.set(7, b - 13, C.iron);
      c.line(8, b - 13, 11, b - 10, C.iron); // the crank on this end
      c.rect(11, b - 10, 13, b - 10, OAK);
      if (!u) {
        c.rect(4, b - 21, 11, b - 20, PINE);
        c.row(b - 21, 4, 11, L(PINE));
      } else {
        c.row(b - 20, 5, 10, hex('#d8c888'));
        c.set(7, b - 21, hex('#ead9a0'));
        c.rect(11, b - 1, 14, b, PINE);
      }
    },
  });

  add('oldtime-spinning-wheel-flax', 'old time spinning wheel flax wool distaff treadle wooden wheel cottage industry', {
    w: 26, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[5, b - 9], [23, b - 13], [23, b - 11], [5, b - 7]], OAK); // the sloping stock
      c.line(5, b - 9, 23, b - 13, L(OAK));
      c.line(6, b - 7, 3, b, OAK);
      c.line(21, b - 11, 23, b, D(OAK));
      c.line(13, b - 9, 12, b, D(OAK));
      for (const x of [7, 11]) c.col(x, b - 22, b - 9, OAK);
      cartWheel(c, 9, b - 15, 8, OAK);
      c.col(19, b - 21, b - 12, OAK); // the maidens and the flyer
      c.col(23, b - 21, b - 13, OAK);
      c.rect(19, b - 19, 23, b - 18, PINE);
      c.rect(20, b - 20, 22, b - 17, u ? QUILT : PINE);
      c.line(1, b - 15, 20, b - 19, hex('#3a3024')); // the driving band
      c.col(17, b - 27, b - 13, PINE); // the distaff
      c.oval(15, b - 27, 19, b - 22, u ? hex('#a89a78') : hex('#c8bc98'));
      c.set(16, b - 26, C.white);
      c.row(b, 8, 16, OAK); // treadle
      c.line(12, b - 1, 9, b - 13, IRONB);
      if (u) {
        c.line(18, b - 22, 21, b - 19, QUILT); // spun: thread to the bobbin, and skeins in the basket
        c.rect(20, b - 3, 25, b, hex('#8a6a3a'));
        c.row(b - 4, 20, 25, QUILT);
        dots(c, hex('#7a6a8a'), [21, b - 5, 23, b - 5, 24, b - 4]);
        c.set(22, b - 18, C.blood); // a drop on the spindle
      }
    },
    sw: 12, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [3, 8]) c.col(x, b - 22, b - 8, OAK);
      c.rect(2, b - 10, 9, b - 8, OAK);
      c.row(b - 10, 2, 9, L(OAK));
      c.line(3, b - 7, 1, b, OAK);
      c.line(8, b - 7, 10, b, D(OAK));
      wheelEdge(c, 5, b - 23, b - 7, OAK, 2);
      c.col(6, b - 27, b - 24, PINE);
      c.oval(4, b - 27, 8, b - 23, u ? hex('#a89a78') : hex('#c8bc98'));
      c.row(b, 3, 8, OAK);
      if (u) {
        c.rect(8, b - 3, 11, b, hex('#8a6a3a'));
        c.row(b - 4, 8, 11, QUILT);
      }
    },
    base: 'side',
  });

  add('oldtime-kitchen-range-iron', 'old time kitchen range cast iron black lead oven hob kettle coal fire cooking', {
    w: 30, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, b - 30, 27, b - 17, IRONB); // the back plate and its shelf
      board(c, 1, b - 31, 28, b - 30, IRONB);
      c.row(b - 31, 1, 28, C.iron);
      c.row(b - 24, 4, 25, BR); // the rail
      dots(c, BR, [4, b - 23, 25, b - 23]);
      c.rect(6, b - 23, 8, b - 20, C.white); // a cloth on it
      c.rect(11, b - 34 + 1, 14, b - 32, CHINA); // a tin and a jar on the shelf
      c.rect(20, b - 33, 22, b - 32, TIN);
      board(c, 1, b - 16, 28, b - 15, IRONB);
      c.row(b - 16, 1, 28, C.iron);
      face(c, 2, b - 14, 27, b, IRONB);
      panel(c, 3, b - 13, 10, b - 3, IRONB); // oven
      c.rect(5, b - 9, 8, b - 8, BR);
      c.rect(12, b - 13, 18, b - 4, hex('#1a1418')); // the grate
      for (let y = b - 11; y <= b - 5; y += 2) c.row(y, 12, 18, C.iron);
      panel(c, 20, b - 13, 26, b - 3, IRONB); // boiler
      c.rect(22, b - 6, 23, b - 5, BR);
      c.set(23, b - 4, BR);
      c.rect(12, b - 2, 18, b - 1, hex('#17151c'));
      c.oval(13, b - 21, 19, b - 17, hex('#a35f38')); // the kettle
      c.row(b - 22, 15, 17, hex('#a35f38'));
      c.line(19, b - 19, 21, b - 21, hex('#a35f38'));
      c.set(14, b - 20, hex('#c88a5a'));
      c.rect(22, b - 20, 26, b - 17, IRONB);
      c.row(b - 20, 21, 27, C.iron);
      if (u) {
        for (let y = b - 12; y <= b - 4; y += 2) c.row(y, 12, 18, C.flame);
        dots(c, C.flameLight, [13, b - 10, 15, b - 12, 16, b - 8, 14, b - 6, 17, b - 10]);
        dots(c, C.red, [13, b - 4, 17, b - 6]);
        c.row(b - 2, 13, 17, C.flame);
        wisp(c, 21, b - 22, 5, C.ghost);
        wisp(c, 24, b - 21, 3, C.ghost);
        dots(c, C.flame, [11, b - 8, 19, b - 9]);
      }
    },
    sw: 12, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 30, 3, b - 17, IRONB);
      c.col(2, b - 30, b - 17, C.iron);
      board(c, 1, b - 31, 6, b - 30, IRONB);
      c.rect(3, b - 33, 5, b - 32, CHINA);
      board(c, 1, b - 16, 10, b - 15, IRONB);
      c.row(b - 16, 1, 10, C.iron);
      cabSide(c, 2, b - 14, 9, b, IRONB);
      c.oval(4, b - 21, 9, b - 17, hex('#a35f38'));
      c.row(b - 22, 5, 7, hex('#a35f38'));
      c.set(5, b - 20, hex('#c88a5a'));
      if (u) {
        dots(c, C.flame, [10, b - 10, 10, b - 6, 10, b - 2]);
        wisp(c, 8, b - 22, 5, C.ghost);
      }
    },
  });

  add('oldtime-dresser-plates', 'old time kitchen dresser welsh dresser plates cups hooks drawers willow pattern', {
    w: 28, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 3, 24, b - 14, mix(PINE, 0.6));
      face(c, 1, 3, 2, b - 14, PINE);
      face(c, 25, 3, 26, b - 14, PINE);
      board(c, 1, 1, 26, 2, PINE);
      let k = 0;
      for (const y of [9, 16]) {
        c.row(y, 3, 24, L(PINE));
        for (let x = 4; x <= 20; x += 5, k++) {
          if (u && (k === 1 || k === 6)) continue;
          c.oval(x, y - 5, x + 3, y - 1, CHINA);
          c.set(x + 1, y - 3, DELFT);
          c.set(x + 2, y - 4, DELFT);
          c.set(x + 2, y - 2, DELFT);
        }
      }
      for (let x = 5; x <= 21; x += 4) {
        if (u && x === 13) continue;
        c.set(x, 17, IRONB);
        c.rect(x, 18, x + 1, 19, CHINA); // cups on hooks
        c.set(x + 2, 18, CHINA);
      }
      c.rect(4, b - 17, 7, b - 15, hex('#a35f38')); // a copper pan, a jug
      c.rect(20, b - 19, 22, b - 15, CHINA);
      c.row(b - 17, 20, 22, DELFT);
      board(c, 1, b - 14, 26, b - 13, PINE);
      face(c, 2, b - 12, 25, b, PINE);
      drawer(c, 3, b - 11, 13, b - 8, PINE);
      if (!u) drawer(c, 15, b - 11, 24, b - 8, PINE);
      panel(c, 3, b - 6, 13, b - 1, PINE);
      panel(c, 15, b - 6, 24, b - 1, PINE);
      if (u) {
        pull(c, 15, b - 11, 24, b - 9, PINE, C.steel);
        shards(c, 5, 14, b, CHINA, 5); // two plates on the flags
        dots(c, DELFT, [7, b, 11, b - 1 + 1]);
      }
    },
    sw: 11, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 1, 7, 2, PINE);
      cabSide(c, 2, 3, 5, b - 14, PINE, false);
      for (const y of [9, 16]) c.set(6, y, L(PINE));
      dots(c, CHINA, [6, 6, 6, 7, 6, 13, 6, 14]);
      board(c, 1, b - 14, 9, b - 13, PINE);
      cabSide(c, 2, b - 12, 8, b, PINE);
      if (u) {
        pullS(c, 9, b - 11, b - 8, 3, PINE, C.steel);
        shards(c, 9, 12, b, CHINA, 5);
      }
    },
    su: [0, 0, 4],
  });

  add('oldtime-mangle-wringer', 'old time mangle wringer cast iron wooden rollers laundry wash day big wheel', {
    w: 20, h: 31, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [2, 13]) {
        c.rect(x, b - 24, x + 1, b, IRONB);
        c.col(x, b - 24, b, C.iron);
        c.rect(x - 1, b, x + 2, b, IRONB);
      }
      c.rect(2, b - 26, 14, b - 25, IRONB);
      c.row(b - 26, 2, 14, C.iron);
      c.col(8, b - 28, b - 26, C.steel); // the pressure screw
      c.row(b - 28, 6, 10, IRONB);
      for (const y of [b - 20, b - 15]) {
        c.rect(4, y, 12, y + 3, PINE); // rollers
        c.row(y, 4, 12, L(PINE));
        c.row(y + 3, 4, 12, D(PINE));
      }
      board(c, 3, b - 10, 13, b - 9, PINE);
      c.row(b - 3, 4, 12, IRONB);
      c.rect(16, b - 23, 17, b - 9, IRONB); // the wheel, edge on
      c.col(16, b - 22, b - 10, C.iron);
      c.row(b - 16, 14, 15, C.iron);
      c.rect(18, b - 21, 18, b - 20, PINE);
      if (u) {
        c.rect(5, b - 16, 11, b - 4, C.white); // a sheet coming through
        c.col(7, b - 14, b - 5, D(C.white));
        c.col(10, b - 13, b - 6, D(C.white));
        c.row(b - 4, 5, 11, D(C.white));
        c.rect(5, b - 23, 11, b - 21, C.white);
        dots(c, hex('#a8706a'), [8, b - 10, 9, b - 9, 8, b - 8, 6, b - 12]); // not washed clean
        puddle(c, 5, 11, b, WAT);
      }
    },
    sw: 17, sh: 31,
    s(c, u) {
      const b = c.h - 2;
      c.rect(6, b - 24, 8, b, IRONB);
      c.col(6, b - 24, b, C.iron);
      c.rect(3, b, 11, b, IRONB);
      c.rect(5, b - 26, 9, b - 25, IRONB);
      c.col(7, b - 28, b - 27, C.steel);
      cartWheel(c, 7, b - 16, 7, IRONB, C.iron);
      c.rect(10, b - 22, 11, b - 21, PINE);
      c.rect(9, b - 10, 12, b - 9, PINE);
      if (u) {
        c.rect(12, b - 15, 13, b - 4, C.white);
        c.col(13, b - 14, b - 5, D(C.white));
        c.rect(2, b - 20, 3, b - 14, C.white);
        puddle(c, 10, 14, b, WAT);
      }
    },
  });

  add('oldtime-tin-bath-hip', 'old time tin bath hip bath in front of the fire zinc tub bath night', {
    w: 28, h: 16, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[2, b - 12], [6, b - 12], [9, b - 7], [25, b - 7], [24, b], [5, b]], TIN);
      c.line(2, b - 12, 5, b, L(TIN));
      c.row(b - 12, 2, 6, L(TIN));
      c.line(6, b - 12, 9, b - 7, L(TIN));
      c.row(b - 7, 9, 25, L(TIN));
      c.row(b, 5, 24, D(TIN));
      c.row(b - 3, 5, 24, mix(TIN, 0.85));
      c.rect(25, b - 6, 26, b - 5, TIN); // handle
      if (u) {
        c.row(b - 8, 9, 24, WAT);
        dots(c, C.glassLight, [11, b - 8, 16, b - 8, 21, b - 8]);
        wisp(c, 12, b - 9, 4, C.ghost);
        wisp(c, 19, b - 10, 4, C.ghost);
        c.poly([[1, b - 13], [6, b - 13], [5, b - 7], [2, b - 5]], C.white); // a towel over the high back
        c.col(3, b - 12, b - 6, D(C.white));
        puddle(c, 22, 27, b, WAT);
      }
    },
    u: [0, 2, 0],
    sw: 14, sh: 16,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, b - 12], [11, b - 12], [10, b], [3, b]], TIN);
      c.col(2, b - 12, b - 1, L(TIN));
      c.row(b - 12, 2, 11, L(TIN));
      c.rect(4, b - 11, 9, b - 8, mix(TIN, 0.7));
      c.row(b, 3, 10, D(TIN));
      if (u) {
        c.row(b - 8, 4, 9, WAT);
        wisp(c, 6, b - 13, 3, C.ghost);
        c.rect(3, b - 13, 8, b - 12, C.white);
        c.col(4, b - 11, b - 7, C.white);
      }
    },
    su: [0, 2, 0],
    base: 'side',
  });

  add('oldtime-commode-chair', 'old time commode chair night chair chamber pot under the seat sick room', {
    w: 14, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, b - 21, 11, b - 11, MAH);
      panel(c, 4, b - 19, 9, b - 13, MAH);
      for (const x of [1, 11]) {
        c.rect(x, b - 14, x + 1, b - 13, MAH);
        c.col(x + (x < 5 ? 0 : 1), b - 12, b - 9, MAH);
      }
      face(c, 2, b - 8, 11, b - 2, MAH);
      panel(c, 3, b - 7, 10, b - 3, MAH);
      legs(c, [2, 10], b - 1, b, D(MAH));
      if (!u) {
        board(c, 1, b - 10, 12, b - 9, MAH);
        c.rect(3, b - 11, 10, b - 11, MADDER); // its cushion
      } else {
        c.rect(2, b - 16, 11, b - 11, MAH); // the seat up against the back
        c.row(b - 16, 2, 11, L(MAH));
        c.rect(3, b - 10, 10, b - 9, CHINA); // the pot
        c.row(b - 10, 4, 9, hex('#3a3024'));
        c.row(b - 9, 3, 10, D(CHINA));
        c.set(1, b - 9, MAH);
        c.set(12, b - 9, MAH);
      }
    },
    sw: 13, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 21, 3, b - 9, MAH);
      c.col(2, b - 21, b - 9, L(MAH));
      c.row(b - 14, 4, 10, MAH);
      c.col(10, b - 13, b - 11, MAH);
      cabSide(c, 2, b - 8, 10, b - 2, MAH);
      legs(c, [2, 9], b - 1, b, D(MAH));
      if (!u) {
        board(c, 2, b - 10, 11, b - 9, MAH);
        c.row(b - 11, 4, 9, MADDER);
      } else {
        c.rect(4, b - 18, 5, b - 9, MAH);
        c.col(4, b - 18, b - 9, L(MAH));
        c.rect(6, b - 10, 10, b - 9, CHINA);
        c.row(b - 10, 7, 9, hex('#3a3024'));
      }
    },
  });
};
