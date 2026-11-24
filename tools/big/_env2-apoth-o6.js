/* Old time, sixth part: small things carried about and left lying. Part of tools/big/env2-apoth.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, legs, hollow, flame, wisp, shards, glow, puddle, heap } = H;
  const add = H.reg('env-oldtime', 'Old time');
  const OAK = hex('#6a4a32'),
    PINE = hex('#94714a'),
    EB = hex('#2b242a'),
    CREAM = hex('#b9ad8a'),
    CHINA = hex('#d6d2c4'),
    TIN = hex('#8a8c90'),
    LEATHER = hex('#4a2e28'),
    COPPER = hex('#a35f38'),
    BR = C.brass,
    GILT = C.gold,
    IRONB = hex('#2a2a30'),
    FIRERED = hex('#8f2a24'),
    MADDER = hex('#7a3a30'),
    OMNI = hex('#2f4a3c'),
    WAT = hex('#6f8f98'),
    SLATE = hex('#3a3f48');

  add('oldtime-carpet-bag', 'old time carpet bag travelling bag tapestry leather handles luggage traveller', {
    w: 16, h: 13,
    f(c, u) {
      const b = c.h - 2;
      const CARPET = hex('#5a5236');
      c.rect(1, b - 6, 13, b, CARPET);
      c.col(1, b - 6, b, L(CARPET));
      for (let x = 3; x <= 12; x += 3) for (let y = b - 5; y < b; y += 2) c.set(x + (y % 4 ? 1 : 0), y, MADDER);
      dots(c, OMNI, [4, b - 2, 8, b - 4, 11, b - 2]);
      c.row(b, 1, 13, LEATHER);
      if (!u) {
        c.poly([[2, b - 7], [12, b - 7], [11, b - 9], [3, b - 9]], CARPET);
        c.row(b - 7, 1, 13, LEATHER);
        c.rect(5, b - 11, 9, b - 10, LEATHER);
        c.clearRect(6, b - 10, 8, b - 10);
        c.set(7, b - 7, BR);
      } else {
        c.row(b - 7, 1, 13, LEATHER); // open: a shirt, a razor, a bundle of letters
        c.rect(2, b - 8, 12, b - 8, hex('#1c1618'));
        c.row(b - 9, 1, 13, LEATHER);
        c.rect(3, b - 10, 7, b - 9, C.white);
        c.set(5, b - 11, C.white);
        c.rect(9, b - 10, 11, b - 9, CREAM);
        c.set(10, b - 10, FIRERED);
        c.rect(14, b - 1, 16, b, C.white); // a collar on the floor
        c.set(15, b, hex('#1c1618'));
        c.rect(13, b - 5, 14, b - 3, LEATHER);
      }
    },
    u: [0, 1, 2],
    sw: 10, sh: 13,
    s(c, u) {
      const b = c.h - 2;
      const CARPET = hex('#5a5236');
      c.rect(2, b - 6, 7, b, CARPET);
      c.col(2, b - 6, b, L(CARPET));
      dots(c, MADDER, [4, b - 4, 5, b - 2, 6, b - 5]);
      c.row(b, 2, 7, LEATHER);
      if (!u) {
        c.poly([[3, b - 7], [6, b - 7], [5, b - 9], [4, b - 9]], CARPET);
        c.row(b - 7, 2, 7, LEATHER);
        c.rect(4, b - 11, 5, b - 10, LEATHER);
      } else {
        c.row(b - 7, 1, 8, LEATHER);
        c.row(b - 8, 2, 7, hex('#1c1618'));
        c.row(b - 9, 1, 8, LEATHER);
        c.rect(3, b - 10, 5, b - 9, C.white);
      }
    },
    su: [0, 1, 0],
  });

  add('oldtime-coal-scuttle-brass', 'old time coal scuttle brass helmet shape shovel fireside coals', {
    w: 14, h: 13,
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        c.poly([[2, b - 8], [10, b - 6], [9, b - 1], [4, b - 1]], BR);
        c.line(2, b - 8, 4, b - 1, L(BR));
        c.row(b, 4, 9, D(BR));
        heap(c, 3, 9, b - 7, 2, hex('#1e1b24'), 2);
        c.line(10, b - 6, 12, b - 10, IRONB); // the shovel stuck in
        c.set(12, b - 11, PINE);
        c.set(6, b - 4, D(BR));
        c.line(3, b - 9, 8, b - 10, IRONB); // the bail
      } else {
        const m = c.h - 2; // kicked over, the coal across the hearth
        c.poly([[1, m - 6], [8, m - 5], [8, m], [1, m - 1]], BR);
        c.line(1, m - 6, 8, m - 5, L(BR));
        c.rect(1, m - 5, 1, m - 2, hex('#3a2a1a'));
        c.row(m, 2, 8, D(BR));
        heap(c, 8, 16, m, 2, hex('#1e1b24'), 4);
        dots(c, hex('#1e1b24'), [18, m, 20, m, 17, m - 1]);
        dots(c, hex('#4a4650'), [10, m - 1, 14, m - 2]);
        c.row(m, 21, 24, IRONB);
        c.set(25, m, PINE);
      }
    },
    us: [27, 9],
  });

  add('oldtime-bed-warmer-copper', 'old time bed warmer warming pan copper long handle hot coals bedroom', {
    w: 10, h: 30,
    f(c, u) {
      const b = c.h - 2;
      c.col(4, 2, b - 9, OAK);
      c.col(5, 2, b - 9, D(OAK));
      c.set(4, 1, BR);
      c.oval(1, b - 9, 8, b - 1, COPPER);
      c.oval(2, b - 8, 6, b - 3, hex('#c88a5a'));
      c.oval(3, b - 7, 7, b - 2, COPPER);
      dots(c, D(COPPER), [3, b - 6, 5, b - 4, 6, b - 6, 4, b - 7]);
      c.row(b, 3, 6, D(COPPER));
      if (u) {
        c.oval(2, b - 8, 7, b - 2, hex('#2a1a16')); // the lid swung open: the coals in it still red
        dots(c, C.flame, [3, b - 6, 5, b - 5, 4, b - 4, 6, b - 6]);
        dots(c, C.flameLight, [4, b - 6, 5, b - 4]);
        c.oval(8, b - 10, 12, b - 3, COPPER);
        c.col(8, b - 8, b - 5, hex('#c88a5a'));
        wisp(c, 5, b - 10, 3, C.ash);
      }
    },
    u: [0, 0, 4],
    sw: 6, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.col(2, 2, b - 9, OAK);
      c.set(2, 1, BR);
      c.rect(2, b - 9, 3, b - 1, COPPER);
      c.col(2, b - 9, b - 1, hex('#c88a5a'));
      c.row(b, 2, 3, D(COPPER));
      if (u) {
        c.line(4, b - 9, 7, b - 5, COPPER);
        dots(c, C.flame, [4, b - 6, 4, b - 4]);
        wisp(c, 3, b - 10, 3, C.ash);
      }
    },
    su: [0, 0, 3],
  });

  add('oldtime-steamer-trunk-domed', 'old time steamer trunk domed lid travelling chest brass bands leather straps labels', {
    w: 24, h: 17, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 1, b - 8, 21, b, LEATHER);
      for (const x of [5, 17]) c.col(x, b - 8, b, PINE);
      dots(c, BR, [1, b, 21, b, 1, b - 8, 21, b - 8]);
      c.rect(10, b - 7, 12, b - 5, BR);
      c.set(11, b - 6, K);
      c.rect(7, b - 4, 9, b - 2, CREAM); // a shipping label
      c.set(8, b - 3, FIRERED);
      if (!u) {
        c.rect(1, b - 12, 21, b - 9, LEATHER);
        c.row(b - 13, 3, 19, LEATHER);
        c.row(b - 13, 3, 19, L(LEATHER));
        for (const x of [5, 17]) c.col(x, b - 13, b - 9, PINE);
        c.row(b - 9, 1, 21, D(LEATHER));
      } else {
        c.rect(1, b - 19, 21, b - 12, LEATHER); // the lid back: its paper lining, the tray tumbled
        c.rect(2, b - 18, 20, b - 13, hex('#8a7a6a'));
        for (let x = 4; x < 20; x += 3) c.set(x, b - 16, hex('#6a5a80'));
        c.row(b - 11, 2, 20, hex('#1c1618'));
        c.rect(3, b - 11, 9, b - 9, C.white);
        c.rect(11, b - 12, 16, b - 9, hex('#5a4a6a'));
        c.row(b - 12, 11, 16, hex('#7a6a8a'));
        c.poly([[16, b - 10], [22, b - 9], [23, b - 2], [20, b - 3]], C.white); // a nightgown trailing out
        c.line(20, b - 8, 21, b - 3, D(C.white));
        c.set(6, b - 10, D(C.white));
      }
    },
    u: [0, 6, 1],
    sw: 14, sh: 17,
    s(c, u) {
      const b = c.h - 2;
      face(c, 1, b - 8, 11, b, LEATHER);
      dots(c, BR, [1, b, 11, b]);
      c.rect(5, b - 5, 7, b - 5, IRONB);
      dots(c, IRONB, [5, b - 4, 7, b - 4]);
      if (!u) {
        c.rect(1, b - 11, 11, b - 9, LEATHER);
        c.rect(2, b - 13, 10, b - 12, LEATHER);
        c.row(b - 13, 3, 9, L(LEATHER));
        c.row(b - 9, 1, 11, D(LEATHER));
      } else {
        c.rect(1, b - 19, 2, b - 9, LEATHER);
        c.col(1, b - 19, b - 9, L(LEATHER));
        c.col(3, b - 18, b - 12, hex('#8a7a6a'));
        c.row(b - 9, 3, 11, hex('#1c1618'));
        c.rect(4, b - 11, 8, b - 10, C.white);
        c.rect(10, b - 9, 12, b - 3, C.white);
      }
    },
    su: [0, 6, 1],
  });

  add('oldtime-hat-boxes-stack', 'old time hat boxes stack round band boxes striped bonnet milliner ribbon', {
    w: 14, h: 16,
    f(c, u) {
      const b = c.h - 2;
      const A = hex('#a89868'),
        Bc = hex('#6a7a8a');
      c.rect(1, b - 5, 11, b, A);
      for (let x = 2; x <= 11; x += 2) c.col(x, b - 4, b, hex('#8a3a34'));
      c.rect(1, b - 6, 11, b - 5, L(A));
      c.col(6, b - 6, b, FIRERED);
      c.rect(2, b - 11, 10, b - 7, Bc);
      c.rect(2, b - 12, 10, b - 11, L(Bc));
      dots(c, CREAM, [4, b - 9, 7, b - 8, 9, b - 10]);
      if (!u) {
        c.set(6, b - 13, FIRERED); // the string bow
        c.set(5, b - 14, FIRERED);
        c.set(7, b - 14, FIRERED);
      } else {
        c.rect(2, b - 12, 10, b - 11, hex('#1c1618')); // open: the bonnet in its tissue
        c.rect(3, b - 14, 8, b - 12, C.white);
        c.oval(4, b - 16, 9, b - 12, EB);
        c.row(b - 13, 4, 9, hex('#6a5a80'));
        c.set(10, b - 13, hex('#6a5a80'));
        c.rect(11, b - 3, 14, b - 2, L(Bc)); // its lid against the pile
        c.rect(11, b - 1, 14, b, Bc);
      }
    },
    u: [0, 2, 3],
  });

  add('oldtime-flat-irons-trivet', 'old time flat irons sad iron on a trivet laundry ironing heavy cast iron', {
    w: 14, h: 10,
    f(c, u) {
      const b = c.h - 2;
      c.row(b - 1, 1, 8, IRONB); // the trivet
      c.set(2, b, IRONB);
      c.set(7, b, IRONB);
      c.poly([[1, b - 2], [8, b - 2], [8, b - 4], [3, b - 4]], u ? hex('#6a3a30') : IRONB);
      c.row(b - 4, 3, 8, u ? C.flame : C.iron);
      c.line(4, b - 5, 4, b - 6, IRONB);
      c.line(7, b - 5, 7, b - 6, IRONB);
      c.row(b - 7, 4, 7, PINE);
      c.poly([[10, b], [12, b], [12, b - 3], [11, b - 3]], IRONB); // a second one stood on its heel
      c.set(11, b - 3, C.iron);
      if (u) {
        wisp(c, 5, b - 8, 2, C.ghost);
        c.set(1, b - 2, C.flame);
        c.rect(9, b, 13, b, hex('#3a2a22')); // and the scorch it left
        c.clearRect(10, b - 3, 12, b - 1);
        c.poly([[9, b - 1], [13, b - 1], [12, b - 2], [10, b - 2]], hex('#5a4030'));
      }
    },
    u: [0, 1, 0],
  });

  add('oldtime-chamberstick-candle', 'old time chamberstick candle holder brass snuffer bedtime light small', {
    w: 10, h: 12,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 1, 7, b, BR);
      c.row(b - 1, 1, 7, L(BR));
      c.rect(8, b - 2, 8, b - 1, BR); // the ring to carry it by
      c.rect(3, b - 3, 5, b - 2, BR);
      c.rect(4, b - (u ? 6 : 8), 4, b - 4, CHINA);
      c.col(5, b - (u ? 6 : 8), b - 4, D(CHINA));
      if (u) {
        flame(c, 4, b - 7, 3);
        dots(c, C.glow, [2, b - 9, 6, b - 9]);
        c.set(3, b - 5, CHINA); // run down
        c.set(3, b - 4, CHINA);
      } else c.set(4, b - 9, K);
    },
  });

  add('oldtime-railway-lantern', 'old time railway hand lantern guard signal lamp red glass tin handle', {
    w: 9, h: 14,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 7, 6, b - 1, IRONB);
      c.col(1, b - 7, b - 1, C.iron);
      c.rect(2, b - 6, 5, b - 3, u ? hex('#d0483a') : hex('#5a2420'));
      if (u) {
        c.rect(3, b - 5, 4, b - 4, C.flameLight);
        dots(c, hex('#c05a4a'), [0, b - 5, 7, b - 5, 0, b - 3, 7, b - 3]);
      } else c.set(2, b - 6, hex('#7a3a34'));
      c.row(b, 1, 6, IRONB);
      c.poly([[1, b - 8], [6, b - 8], [5, b - 10], [2, b - 10]], IRONB);
      c.row(b - 10, 2, 5, C.iron);
      c.set(3, b - 11, IRONB);
      c.row(b - 12, 2, 5, C.iron); // the handle
      c.set(2, b - 11, C.iron);
      c.set(5, b - 11, C.iron);
    },
    sw: 9, sh: 14,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 7, 6, b - 1, IRONB);
      c.col(1, b - 7, b - 1, C.iron);
      c.col(6, b - 6, b - 3, u ? hex('#d0483a') : hex('#5a2420')); // the glass is on the other face
      c.rect(2, b - 5, 3, b - 3, C.iron);
      c.row(b, 1, 6, IRONB);
      c.poly([[1, b - 8], [6, b - 8], [5, b - 10], [2, b - 10]], IRONB);
      c.row(b - 10, 2, 5, C.iron);
      c.rect(3, b - 12, 4, b - 11, C.iron);
      if (u) dots(c, hex('#c05a4a'), [7, b - 6, 7, b - 4, 7, b - 2]);
    },
  });

  add('oldtime-school-hand-bell', 'old time school hand bell brass wooden handle teacher town crier ringing', {
    w: 9, h: 12,
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        c.poly([[1, b], [6, b], [5, b - 5], [2, b - 5]], BR);
        c.line(1, b, 2, b - 5, L(BR));
        c.row(b, 1, 6, D(BR));
        c.rect(3, b - 9, 4, b - 6, EB);
        c.set(3, b - 10, EB);
      } else {
        const m = c.h - 2; // rung and thrown down
        c.poly([[1, m - 5], [6, m - 4], [6, m - 1], [1, m]], BR);
        c.line(1, m - 5, 6, m - 4, L(BR));
        c.col(1, m - 4, m - 1, hex('#3a2a1a'));
        c.rect(7, m - 3, 10, m - 2, EB);
        c.set(0, m - 2, C.steel);
        dots(c, C.white, [2, m - 7, 4, m - 8, 0, m - 6]);
      }
    },
    us: [12, 10],
  });

  add('oldtime-slate-and-chalk', 'old time school slate and chalk wooden frame writing tablet sums pupil', {
    w: 11, h: 12,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[2, b - 9], [9, b - 9], [8, b], [1, b]], PINE);
      c.poly([[3, b - 8], [8, b - 8], [7, b - 1], [2, b - 1]], SLATE);
      c.line(2, b - 9, 1, b, L(PINE));
      if (!u) {
        c.set(9, b, C.white); // the chalk by it
        c.set(10, b, C.white);
        c.set(4, b - 6, hex('#5a6068'));
      } else {
        dots(c, C.white, [3, b - 7, 4, b - 7, 5, b - 7, 7, b - 7, 3, b - 5, 5, b - 5, 6, b - 5, 4, b - 3, 5, b - 3, 6, b - 3, 7, b - 3]); // the same line written again and again
        c.set(9, b, C.white);
        dots(c, hex('#8a8c90'), [6, b - 7, 4, b - 5, 3, b - 3]);
      }
    },
    sw: 6, sh: 12,
    s(c, u) {
      const b = c.h - 2;
      c.line(3, b - 9, 1, b, PINE);
      c.line(4, b - 9, 2, b, D(PINE));
      c.set(4, b, C.white);
      if (u) c.set(3, b - 5, C.white);
    },
  });

  add('oldtime-yoke-and-pails', 'old time milkmaid yoke and two pails wooden buckets water carrier dairy', {
    w: 28, h: 15, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const pail = (x, full) => {
        c.poly([[x, b - 7], [x + 6, b - 7], [x + 5, b], [x + 1, b]], PINE);
        c.line(x, b - 7, x + 1, b, L(PINE));
        c.col(x + 3, b - 6, b, D(PINE));
        c.row(b - 5, x, x + 6, C.iron);
        c.row(b - 1, x + 1, x + 5, C.iron);
        c.row(b - 7, x + 1, x + 5, full ? hex('#d8d4c4') : hex('#3a2a1a'));
      };
      if (!u) {
        pail(2, true);
        pail(19, true);
        c.col(5, b - 10, b - 8, IRONB); // the chains
        c.col(22, b - 10, b - 8, IRONB);
        c.poly([[3, b - 11], [11, b - 12], [16, b - 12], [24, b - 11], [24, b - 10], [16, b - 10], [11, b - 10], [3, b - 10]], OAK);
        c.row(b - 12, 11, 16, L(OAK));
        c.rect(12, b - 10, 15, b - 10, D(OAK)); // the hollow for the neck
      } else {
        pail(2, false);
        c.poly([[15, b - 6], [22, b - 5], [22, b - 1], [15, b]], PINE); // one down: the milk across the yard
        c.line(15, b - 6, 22, b - 5, L(PINE));
        c.col(15, b - 5, b - 1, hex('#d8d4c4'));
        c.col(19, b - 5, b - 1, C.iron);
        c.row(b, 8, 16, hex('#d8d4c4'));
        dots(c, hex('#d8d4c4'), [10, b - 1, 12, b - 1, 13, b - 1, 6, b]);
        c.poly([[5, b - 10], [12, b - 9], [18, b - 8], [26, b - 4], [26, b - 3], [18, b - 6], [12, b - 7], [5, b - 8]], OAK);
        c.line(5, b - 10, 18, b - 8, L(OAK));
        c.set(9, b, C.blood);
      }
    },
    sw: 10, sh: 15,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[1, b - 7], [7, b - 7], [6, b], [2, b]], PINE);
      c.line(1, b - 7, 2, b, L(PINE));
      c.col(4, b - 6, b, D(PINE));
      c.row(b - 5, 1, 7, C.iron);
      c.row(b - 1, 2, 6, C.iron);
      c.row(b - 7, 2, 6, u ? hex('#3a2a1a') : hex('#d8d4c4'));
      if (!u) {
        c.col(4, b - 10, b - 8, IRONB);
        c.rect(3, b - 12, 5, b - 11, OAK);
        c.row(b - 12, 3, 5, L(OAK));
      } else {
        c.rect(6, b - 9, 8, b - 8, OAK);
        c.row(b, 7, 9, hex('#d8d4c4'));
      }
    },
  });

  add('oldtime-top-hat-cane-gloves', 'old time top hat cane and gloves gentleman silk hat walking stick left behind', {
    w: 16, h: 12,
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        c.rect(3, b - 8, 8, b - 1, EB);
        c.row(b, 1, 10, EB);
        c.col(3, b - 8, b - 1, hex('#4a4a55'));
        c.row(b - 8, 3, 8, hex('#3a3440'));
        c.row(b - 2, 3, 8, hex('#5a5a62'));
        c.rect(11, b - 1, 14, b, CHINA); // gloves
        c.set(13, b - 2, CHINA);
      } else {
        c.oval(1, b - 6, 8, b, EB); // on its side: you can see into it
        c.oval(2, b - 5, 6, b - 1, hex('#6a2a36'));
        c.rect(6, b - 5, 12, b - 1, EB);
        c.row(b - 5, 6, 12, hex('#4a4a55'));
        c.set(3, b - 3, CHINA); // a card in the lining
        c.rect(13, b, 15, b, CHINA);
        c.set(14, b, C.blood);
      }
      c.line(u ? 2 : 12, u ? b - 8 : b - 9, u ? 15 : 15, u ? b - 9 : b - 2, hex('#3a2a22')); // the cane
      c.set(u ? 1 : 12, u ? b - 8 : b - 10, GILT);
    },
  });
};
