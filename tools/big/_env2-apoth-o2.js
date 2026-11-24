/* Old time, second part: the street traders, the railway station, the undertaker, the photographer. Part of tools/big/env2-apoth.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, legs, cabSide, hollow, pane, flame, fire, wisp, shards, glow, puddle, cartWheel, wheelEdge, planksV, heap, wicker } = H;
  const add = H.reg('env-oldtime', 'Old time');
  const OAK = hex('#6a4a32'),
    PINE = hex('#94714a'),
    MAH = hex('#5a3226'),
    EB = hex('#2b242a'),
    CREAM = hex('#b9ad8a'),
    LEATHER = hex('#4a2e28'),
    FIRERED = hex('#8f2a24'),
    FADEBLUE = hex('#4f5f78'),
    OMNI = hex('#2f4a3c'),
    WHITEW = hex('#b4ae9c'),
    ELM = hex('#3a2c26'),
    BR = C.brass,
    GILT = C.gold,
    IRONB = hex('#2a2a30'),
    LIT = hex('#e0c868');
  const trunk = (c, x0, y0, x1, y1, col = LEATHER) => {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.col(x0 + 1, y0, y1, BR);
    c.col(x1 - 1, y0, y1, BR);
  };
  /** The edge of an ellipse: a wheel lying on the ground. */
  const ring = (c, cx, cy, rx, ry, col) => {
    for (let a = 0; a < 64; a++) c.set(cx + rx * Math.cos((a * Math.PI) / 32), cy + ry * Math.sin((a * Math.PI) / 32), col);
  };

  add('oldtime-costermonger-barrow', 'old time costermonger barrow street seller fruit vegetables hand cart market naphtha lamp', {
    w: 40, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.col(4, 2, b - 15, IRONB); // the flare lamp on its pole
      c.rect(3, 3, 5, 4, BR);
      if (u) {
        flame(c, 4, 1, 3);
        dots(c, C.glow, [2, 2, 6, 1, 6, 5]);
      }
      const APPLE = hex('#8f3a2c'),
        CAB = hex('#5a7a4a'),
        SPUD = hex('#8a6a45');
      heap(c, 6, 13, b - 15, u ? 2 : 4, APPLE, 2);
      heap(c, 14, 22, b - 15, u ? 1 : 5, CAB, 5);
      heap(c, 23, 31, b - 15, u ? 3 : 4, SPUD, 8);
      if (!u) {
        c.rect(9, b - 23, 11, b - 21, CREAM); // price tickets
        c.col(10, b - 20, b - 19, PINE);
        c.rect(26, b - 23, 28, b - 21, CREAM);
        c.col(27, b - 20, b - 19, PINE);
        dots(c, hex('#3a3440'), [10, b - 22, 27, b - 22]);
      }
      face(c, 5, b - 15, 32, b - 13, FADEBLUE);
      for (let x = 8; x < 31; x += 2) if (x % 8 !== 2) c.set(x, b - 14, CREAM);
      board(c, 4, b - 12, 33, b - 11, OAK);
      c.line(33, b - 12, 38, b - 10, OAK); // handles
      c.set(38, b - 11, D(OAK));
      c.col(30, b - 10, b, D(OAK));
      c.col(6, b - 10, b - 6, D(OAK));
      cartWheel(c, 17, b - 6, 6, OMNI);
      if (u) {
        dots(c, CAB, [8, b, 12, b - 1 + 1, 25, b, 27, b]);
        c.set(34, b, APPLE);
        c.rect(24, b - 19, 26, b - 16, hex('#8a8c90')); // the takings tin
        c.set(25, b - 19, GILT);
      }
    },
    sw: 22, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 2, b - 12, b, OMNI, 2);
      wheelEdge(c, 18, b - 12, b, OMNI, 2);
      c.row(b - 6, 4, 17, IRONB);
      c.col(5, 2, b - 15, IRONB);
      c.rect(4, 3, 6, 4, BR);
      if (u) {
        flame(c, 5, 1, 3);
        dots(c, C.glow, [3, 2, 7, 1]);
      }
      heap(c, 5, 16, b - 15, u ? 2 : 5, hex('#8a6a45'), 8);
      if (!u) {
        c.rect(9, b - 23, 11, b - 21, CREAM);
        c.col(10, b - 20, b - 19, PINE);
      }
      face(c, 4, b - 15, 17, b - 13, FADEBLUE);
      board(c, 4, b - 12, 17, b - 11, OAK);
      for (const x of [6, 14]) {
        c.rect(x, b - 11, x + 1, b - 9, OAK); // the handles end on
        c.set(x, b - 11, L(OAK));
      }
      c.col(10, b - 10, b, D(OAK));
      if (u) dots(c, hex('#5a7a4a'), [7, b, 13, b]);
    },
    base: 'side',
  });

  add('oldtime-knife-grinder-cart', 'old time knife grinder cart grindstone treadle wheel street trader scissors sharpening', {
    w: 26, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [15, 22]) c.col(x, b - 20, b, OAK);
      c.col(15, b - 20, b, L(OAK));
      board(c, 7, b - 20, 23, b - 19, OAK);
      c.line(7, b - 19, 2, b - 12, OAK); // the handles to push it by
      c.set(1, b - 12, D(OAK));
      c.row(b - 10, 11, 22, D(OAK));
      c.line(10, b - 8, 16, b - 22, IRONB); // the belt
      c.line(13, b - 15, 19, b - 22, IRONB);
      c.oval(15, b - 26, 21, b - 20, C.stone); // the stone
      c.oval(16, b - 25, 19, b - 22, C.stoneLight);
      c.set(18, b - 23, IRONB);
      c.rect(22, b - 27, 24, b - 25, hex('#8a8c90')); // the drip can
      c.set(21, b - 25, hex('#8a8c90'));
      c.row(b - 1, 14, 24, OAK); // treadle
      c.line(19, b - 2, 19, b - 9, IRONB);
      cartWheel(c, 9, b - 8, 8, OAK);
      c.rect(8, b - 23, 12, b - 21, PINE); // the box of work
      dots(c, C.steel, [9, b - 24, 11, b - 25, 11, b - 24]);
      if (u) {
        c.row(b - 24, 21, 25, C.steel); // a blade on the stone
        c.set(26, b - 24, EB);
        dots(c, C.flameLight, [14, b - 27, 13, b - 25, 12, b - 28, 15, b - 29]);
        dots(c, C.flame, [13, b - 27, 11, b - 26, 14, b - 29]);
        c.set(21, b - 22, hex('#6f8f98'));
        c.rect(14, b, 24, b, OAK);
        c.clearRect(14, b - 1, 24, b - 1);
      }
    },
    sw: 15, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [2, 11]) c.col(x, b - 20, b, OAK);
      c.col(2, b - 20, b, L(OAK));
      board(c, 1, b - 20, 12, b - 19, OAK);
      c.row(b - 10, 3, 10, D(OAK));
      wheelEdge(c, 5, b - 16, b, OAK, 2);
      c.rect(7, b - 26, 9, b - 20, C.stone); // the stone, edge on
      c.col(7, b - 26, b - 20, C.stoneLight);
      c.row(b - 23, 4, 11, IRONB);
      c.rect(10, b - 27, 12, b - 25, hex('#8a8c90'));
      c.row(b - 1, 4, 10, OAK);
      for (const x of [3, 10]) {
        c.rect(x, b - 18, x + 1, b - 17, OAK);
      }
      if (u) {
        c.col(8, b - 29, b - 27, C.steel);
        dots(c, C.flameLight, [6, b - 28, 5, b - 26, 10, b - 29]);
        dots(c, C.flame, [4, b - 28, 11, b - 28 - 2]);
      }
    },
    u: [0, 2, 1], su: [0, 2, 0],
    base: 'side',
  });

  add('oldtime-barrel-organ-street', 'old time barrel organ street organ grinder hand organ on wheels crank music painted', {
    w: 22, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 8, 16, b - 7, OAK); // the cart
      c.col(17, b - 8, b, D(OAK));
      face(c, 2, b - 22, 17, b - 9, MAH);
      c.row(b - 23, 1, 18, L(MAH));
      c.row(b - 9, 1, 18, D(MAH));
      c.col(4, b - 21, b - 10, GILT);
      c.col(15, b - 21, b - 10, GILT);
      if (!u) {
        c.rect(6, b - 20, 13, b - 14, CREAM); // the painted panel: a lake, a mountain
        c.rect(6, b - 16, 13, b - 14, hex('#56707a'));
        c.poly([[7, b - 16], [10, b - 19], [13, b - 16]], hex('#5a6a5a'));
        c.frame(5, b - 21, 14, b - 13, GILT);
        c.rect(6, b - 12, 13, b - 11, FIRERED);
        for (let x = 6; x <= 13; x += 2) c.set(x, b - 11, GILT);
      } else {
        hollow(c, 5, b - 21, 14, b - 11, MAH); // the front down: the pinned barrel and the pipes
        c.rect(6, b - 15, 13, b - 12, BR);
        c.row(b - 15, 6, 13, L(BR));
        dots(c, D(BR), [7, b - 14, 9, b - 13, 10, b - 14, 12, b - 13, 8, b - 12, 11, b - 12]);
        for (let x = 6; x <= 13; x++) c.col(x, b - 20, b - 17 - (x % 3), hex('#8a8c90'));
        c.rect(5, b - 10, 14, b - 9, MAH);
        c.rect(6, b - 26, 8, b - 24, FIRERED); // the monkey's cap left on top
        c.set(7, b - 27, GILT);
        c.rect(11, b - 25, 13, b - 24, hex('#8a8c90'));
        c.set(12, b - 25, GILT);
      }
      c.rect(18, b - 16, 19, b - 16, IRONB); // the crank
      c.col(19, u ? b - 15 : b - 19, u ? b - 13 : b - 17, IRONB);
      c.set(20, u ? b - 13 : b - 19, PINE);
      cartWheel(c, 6, b - 4, 4, FIRERED);
      cartWheel(c, 14, b - 4, 4, FIRERED);
    },
    sw: 16, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 2, b - 8, b, FIRERED, 2);
      wheelEdge(c, 11, b - 8, b, FIRERED, 2);
      c.rect(4, b - 8, 10, b - 7, OAK);
      cabSide(c, 3, b - 22, 11, b - 9, MAH);
      c.row(b - 23, 2, 12, L(MAH));
      c.row(b - 9, 2, 12, D(MAH));
      c.set(7, b - 16, IRONB); // the crank on this end
      c.line(7, b - 16, u ? 9 : 7, u ? b - 14 : b - 19, IRONB);
      c.rect(u ? 9 : 7, u ? b - 13 : b - 20, u ? 10 : 8, u ? b - 13 : b - 20, PINE);
      if (u) {
        c.rect(12, b - 12, 14, b - 10, MAH); // the flap hanging down in front
        c.rect(5, b - 26, 7, b - 24, FIRERED);
        c.set(6, b - 27, GILT);
      }
    },
    u: [0, 3, 0], su: [0, 3, 2],
  });

  add('oldtime-penny-farthing', 'old time penny farthing high wheel bicycle ordinary velocipede big wheel', {
    w: 30, h: 32, solid: true,
    f(c, u) {
      if (!u) {
        const b = c.h - 2;
        cartWheel(c, 12, b - 11, 11, IRONB, C.steel);
        cartWheel(c, 25, b - 3, 3, IRONB);
        c.line(12, b - 23, 20, b - 19, C.steel); // the backbone
        c.line(20, b - 19, 25, b - 3, C.steel);
        c.col(12, b - 25, b - 11, C.steel);
        c.rect(13, b - 26, 17, b - 25, LEATHER);
        c.row(b - 26, 13, 17, L(LEATHER));
        c.rect(9, b - 27, 12, b - 27, C.steel);
        c.set(8, b - 27, EB);
        c.rect(12, b - 9, 13, b - 9, EB); // a pedal
        c.col(12, b - 11, b - 9, C.steel);
      } else {
        const m = c.h - 2; // thrown down in the road, the big wheel buckled
        ring(c, 13, m - 4, 12, 4, IRONB);
        ring(c, 13, m - 4, 11, 3, C.steel);
        c.line(3, m - 4, 23, m - 4, C.iron);
        c.line(8, m - 7, 18, m - 1, C.iron);
        c.line(18, m - 7, 8, m - 1, C.iron);
        dots(c, IRONB, [24, m - 6, 25, m - 7, 26, m - 6]); // the kink
        ring(c, 30, m - 2, 3, 2, IRONB);
        c.line(14, m - 5, 24, m - 8, C.steel);
        c.line(24, m - 8, 30, m - 2, C.steel);
        c.rect(15, m - 9, 19, m - 8, LEATHER);
        c.line(11, m - 6, 9, m - 10, C.steel);
        c.rect(7, m - 11, 11, m - 11, C.steel);
        c.set(6, m - 11, EB);
        dots(c, C.blood, [20, m, 21, m, 23, m]);
      }
    },
    us: [36, 14],
    sw: 9, sh: 32,
    s(c, u) {
      if (!u) {
        const b = c.h - 2;
        c.rect(4, b - 22, 5, b, IRONB);
        c.col(4, b - 21, b - 1, C.iron);
        c.col(4, b - 25, b - 23, C.steel);
        c.rect(3, b - 26, 5, b - 25, LEATHER);
        c.rect(1, b - 27, 7, b - 27, C.steel);
        dots(c, EB, [1, b - 27, 7, b - 27]);
        c.rect(2, b - 11, 6, b - 11, C.steel);
        dots(c, EB, [1, b - 13, 7, b - 9]);
        c.col(2, b - 13, b - 11, C.steel);
        c.col(6, b - 11, b - 9, C.steel);
      } else {
        const m = c.h - 2;
        ring(c, 9, m - 3, 8, 3, IRONB);
        ring(c, 9, m - 3, 7, 2, C.steel);
        c.line(3, m - 3, 15, m - 3, C.iron);
        c.line(9, m - 5, 9, m - 1, C.iron);
        c.line(9, m - 4, 7, m - 9, C.steel);
        c.rect(5, m - 10, 10, m - 10, C.steel);
        c.rect(11, m - 7, 14, m - 6, LEATHER);
        c.set(17, m, C.blood);
      }
    },
    sus: [20, 13],
    base: 'side',
  });

  add('oldtime-station-bench-iron', 'old time railway station bench cast iron ends wooden slats platform seat waiting', {
    w: 30, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [2, 26]) {
        c.rect(x, b - 15, x + 1, b, IRONB);
        c.col(x, b - 15, b, C.iron);
        c.rect(x - 1, b, x + 2, b, IRONB);
        dots(c, C.iron, [x - 1, b - 10, x + 2, b - 10]);
      }
      for (const y of [b - 15, b - 13, b - 11]) {
        c.row(y, 3, 26, OMNI);
        c.set(3, y, L(OMNI));
      }
      board(c, 2, b - 8, 27, b - 7, OMNI);
      c.row(b - 6, 4, 25, D(OMNI));
      dots(c, PINE, [9, b - 13, 17, b - 8, 21, b - 15]); // the paint worn through
      if (u) {
        c.rect(8, b - 10, 14, b - 9, hex('#c8bea3')); // a newspaper, folded
        c.row(b - 9, 9, 13, C.slate);
        c.rect(18, b - 13, 21, b - 9, EB); // and a top hat
        c.row(b - 9, 17, 22, EB);
        c.row(b - 10, 18, 21, hex('#5a5a62'));
        c.col(18, b - 13, b - 11, hex('#3a3440'));
      }
    },
    sw: 13, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      c.line(3, b - 15, 4, b - 8, IRONB); // the cast end: back, arm scroll, legs
      c.line(2, b - 15, 3, b - 8, C.iron);
      c.rect(3, b - 8, 10, b - 7, OMNI);
      c.row(b - 8, 3, 10, L(OMNI));
      c.line(4, b - 6, 2, b, IRONB);
      c.line(9, b - 6, 10, b, IRONB);
      c.row(b - 11, 4, 9, IRONB);
      c.set(10, b - 10, IRONB);
      c.col(10, b - 9, b - 9, IRONB);
      c.row(b - 3, 4, 9, C.iron);
      if (u) {
        c.rect(5, b - 13, 8, b - 9, EB);
        c.row(b - 9, 4, 9, EB);
        c.row(b - 10, 5, 8, hex('#5a5a62'));
      }
    },
  });

  add('oldtime-station-clock-post', 'old time station clock on an iron post two faced railway platform town clock stopped', {
    w: 14, h: 48, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, b - 3, 9, b, IRONB);
      c.row(b - 3, 4, 9, C.iron);
      c.rect(6, 13, 7, b - 4, IRONB);
      c.col(6, 13, b - 4, C.iron);
      dots(c, C.iron, [5, 20, 8, 20, 5, b - 12, 8, b - 12]);
      c.line(3, 13, 5, 16, IRONB);
      c.line(10, 13, 8, 16, IRONB);
      c.oval(1, 1, 12, 12, IRONB);
      c.oval(2, 2, 11, 11, CREAM);
      dots(c, hex('#3a3440'), [6, 2, 7, 2, 11, 6, 11, 7, 6, 11, 7, 11, 2, 6, 2, 7]);
      c.set(6, 0, BR);
      c.set(7, 0, BR);
      if (!u) {
        c.line(6, 6, 6, 3, K);
        c.line(7, 6, 9, 8, K);
      } else {
        c.line(6, 7, 6, 10, K); // both hands dropped, the glass starred
        c.line(7, 7, 7, 9, K);
        dots(c, hex('#8a8272'), [4, 4, 5, 5, 3, 5, 5, 3, 4, 6, 8, 4, 9, 3]);
        dots(c, hex('#15131a'), [3, -1, 4, -2, 5, -2, 5, -1, 4, -1, 6, -1]); // and a crow sits on it
        c.set(2, -1, hex('#4a4a55'));
        c.set(7, -2, hex('#15131a'));
      }
    },
    sw: 8, sh: 48,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 3, 6, b, IRONB);
      c.row(b - 3, 1, 6, C.iron);
      c.rect(3, 13, 4, b - 4, IRONB);
      c.col(3, 13, b - 4, C.iron);
      dots(c, C.iron, [2, 20, 5, 20, 2, b - 12, 5, b - 12]);
      c.rect(2, 1, 5, 12, IRONB);
      c.col(1, 3, 10, CREAM);
      c.col(6, 3, 10, CREAM);
      c.col(2, 1, 12, C.iron);
      c.rect(3, 0, 4, 0, BR);
      if (u) {
        dots(c, hex('#15131a'), [2, -1, 3, -2, 4, -2, 4, -1, 3, -1, 5, -1]);
        c.set(6, -2, hex('#4a4a55'));
      }
    },
    u: [0, 3, 0], su: [0, 3, 0],
  });

  add('oldtime-luggage-trolley-trunks', 'old time station luggage trolley porter barrow trunks hat box travelling cases railway', {
    w: 28, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 2, b - 6, 23, b - 5, OAK);
      for (const x of [23, 24]) c.col(x, b - 22, b - 5, x === 23 ? L(OAK) : OAK);
      c.row(b - 22, 22, 26, OAK);
      c.row(b - 14, 23, 25, D(OAK));
      cartWheel(c, 6, b - 2, 2, IRONB);
      cartWheel(c, 19, b - 2, 2, IRONB);
      c.row(b - 4, 4, 21, IRONB);
      trunk(c, 3, b - 14, 19, b - 7);
      c.rect(10, b - 11, 12, b - 10, BR);
      c.rect(14, b - 13, 17, b - 11, CREAM); // a label
      if (!u) {
        trunk(c, 5, b - 20, 16, b - 15, OMNI);
        c.rect(8, b - 25, 13, b - 21, hex('#a89868')); // a hat box
        c.row(b - 25, 8, 13, L(hex('#a89868')));
        c.col(10, b - 24, b - 21, FIRERED);
        c.rect(17, b - 18, 21, b - 15, hex('#5a5236')); // a carpet bag
        c.row(b - 19, 18, 20, LEATHER);
      } else {
        c.rect(17, b - 18, 21, b - 15, hex('#5a5236'));
        c.row(b - 19, 18, 20, LEATHER);
        trunk(c, -9, b - 5, 0, b, OMNI); // the green trunk off and burst on the platform
        c.poly([[-9, b - 6], [0, b - 9], [0, b - 6]], L(OMNI));
        dots(c, C.white, [-7, b - 6, -5, b - 6, -4, b - 7, -10, b, -11, b]);
        dots(c, FIRERED, [-3, b - 6, -12, b - 1]);
        c.rect(6, b - 18, 11, b - 15, hex('#a89868')); // the hat box slid
        c.row(b - 18, 6, 11, L(hex('#a89868')));
        c.col(8, b - 17, b - 15, FIRERED);
      }
    },
    u: [13, 0, 0],
    sw: 18, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [3, 13]) {
        c.col(x, b - 22, b - 5, OAK);
        c.col(x + 1, b - 22, b - 5, D(OAK));
      }
      c.row(b - 22, 3, 14, OAK);
      c.row(b - 14, 4, 13, D(OAK));
      board(c, 2, b - 6, 15, b - 5, OAK);
      wheelEdge(c, 3, b - 4, b, IRONB, 2);
      wheelEdge(c, 13, b - 4, b, IRONB, 2);
      trunk(c, 4, b - 14, 13, b - 7);
      if (!u) {
        trunk(c, 5, b - 20, 12, b - 15, OMNI);
        c.rect(6, b - 25, 11, b - 21, hex('#a89868'));
        c.row(b - 25, 6, 11, L(hex('#a89868')));
        c.col(8, b - 24, b - 21, FIRERED);
      } else {
        c.rect(6, b - 18, 11, b - 15, hex('#a89868'));
        c.row(b - 18, 6, 11, L(hex('#a89868')));
        trunk(c, 16, b - 5, 22, b, OMNI);
        dots(c, C.white, [18, b - 6, 20, b - 6, 23, b]);
      }
    },
    su: [0, 0, 6],
    base: 'side',
  });

  add('oldtime-picket-gate-fence', 'old time picket fence with a garden gate white painted wooden pickets cottage front', {
    w: 34, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const picket = (x, top) => {
        c.rect(x, top + 1, x + 1, b, WHITEW);
        c.set(x, top, WHITEW);
        c.col(x, top + 1, b, L(WHITEW));
      };
      for (const y of [b - 9, b - 3]) {
        c.row(y, 1, 10, D(WHITEW));
        c.row(y, 23, 32, D(WHITEW));
      }
      for (let x = 1; x <= 8; x += 3) picket(x, b - 12);
      for (let x = 25; x <= 31; x += 3) picket(x, b - 12);
      for (const x of [10, 22]) {
        c.rect(x, b - 15, x + 1, b, OAK);
        c.col(x, b - 15, b, L(OAK));
        c.rect(x - 1, b - 16, x + 2, b - 16, OAK);
      }
      if (!u) {
        for (const y of [b - 10, b - 3]) c.row(y, 12, 21, D(WHITEW));
        c.line(12, b - 3, 21, b - 10, D(WHITEW));
        for (let i = 0; i < 4; i++) picket(12 + i * 3 - (i > 1 ? 1 : 0), b - 13 - (i === 1 || i === 2 ? 1 : 0));
        c.set(20, b - 8, IRONB);
      } else {
        c.rect(12, b - 14, 12, b - 1, WHITEW); // swung in: the gate edge on
        c.set(12, b - 10, IRONB);
        c.set(12, b - 3, IRONB);
        dots(c, C.earth, [15, b, 17, b, 19, b]);
        c.rect(16, b - 1, 18, b, hex('#7a3a30')); // a child's shoe in the gateway
        c.set(18, b - 1, null);
      }
      dots(c, C.moss, [2, b, 26, b - 1, 29, b]);
    },
    sw: 6, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 15, 3, b, OAK);
      c.col(2, b - 15, b, L(OAK));
      c.rect(1, b - 16, 4, b - 16, OAK);
      if (u) {
        for (const y of [b - 10, b - 3]) c.row(y, 4, 13, D(WHITEW));
        c.line(4, b - 3, 13, b - 10, D(WHITEW));
        for (let i = 0; i < 4; i++) {
          const x = 4 + i * 3 - (i > 1 ? 1 : 0),
            top = b - 13 - (i === 1 || i === 2 ? 1 : 0);
          c.rect(x, top + 1, x + 1, b - 1, WHITEW);
          c.set(x, top, WHITEW);
        }
        c.set(13, b - 8, IRONB);
      } else {
        c.rect(4, b - 12, 4, b, WHITEW);
        c.set(4, b - 9, D(WHITEW));
      }
    },
    sus: [16, 19],
  });

  add('oldtime-coffin-on-trestles', 'old time coffin on trestles undertaker elm brass handles wake parlour funeral', {
    w: 40, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [8, 30]) {
        c.line(x, b - 7, x - 2, b, OAK);
        c.line(x + 1, b - 7, x + 3, b, D(OAK));
        c.row(b - 3, x - 1, x + 2, D(OAK));
      }
      c.rect(2, b - 13, 37, b - 8, ELM);
      c.col(2, b - 13, b - 8, L(ELM));
      c.row(b - 8, 2, 37, D(ELM));
      for (const x of [9, 19, 29]) {
        c.rect(x, b - 11, x + 2, b - 11, BR);
        dots(c, BR, [x, b - 10, x + 2, b - 10]);
      }
      if (!u) {
        c.rect(1, b - 15, 38, b - 14, ELM);
        c.row(b - 15, 1, 38, L(ELM));
        c.rect(14, b - 16, 19, b - 16, BR); // the plate
      } else {
        c.row(b - 14, 3, 36, C.white); // open: the lining, and nobody in it
        dots(c, D(C.white), [8, b - 14, 15, b - 14, 24, b - 14, 31, b - 14]);
        c.rect(4, b - 15, 9, b - 15, C.white);
        c.line(38, b - 16, 42, b, ELM); // the lid stood against the end
        c.line(39, b - 16, 43, b, L(ELM));
        c.line(40, b - 16, 44, b, D(ELM));
        dots(c, C.earth, [14, b, 16, b, 20, b - 1 + 1, 23, b]); // earth on the floor
      }
    },
    sw: 16, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      c.line(5, b - 7, 2, b, OAK);
      c.line(10, b - 7, 13, b, D(OAK));
      c.row(b - 3, 4, 11, D(OAK));
      c.poly([[4, b - 13], [11, b - 13], [12, b - 10], [11, b - 8], [4, b - 8], [3, b - 10]], ELM);
      c.line(4, b - 13, 3, b - 10, L(ELM));
      c.set(7, b - 10, BR);
      c.set(8, b - 10, BR);
      if (!u) {
        c.rect(3, b - 15, 12, b - 14, ELM);
        c.row(b - 15, 3, 12, L(ELM));
      } else {
        c.row(b - 14, 4, 11, C.white);
        c.rect(13, b - 16, 14, b, ELM);
        c.col(13, b - 16, b, L(ELM));
        c.set(8, b, C.earth);
      }
    },
    u: [0, 0, 6], su: [0, 0, 1],
    base: 'side',
  });

  add('oldtime-daguerreotype-camera-tripod', 'old time daguerreotype camera on a tripod photographer wooden box brass lens black cloth flash', {
    w: 22, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.line(11, b - 18, 4, b, PINE);
      c.line(11, b - 18, 11, b, D(PINE));
      c.line(11, b - 18, 18, b, PINE);
      c.rect(9, b - 19, 13, b - 18, BR);
      face(c, 6, b - 27, 15, b - 20, MAH);
      c.rect(4, b - 26, 6, b - 21, D(MAH));
      c.rect(16, b - 25, 18, b - 22, BR); // the lens
      c.col(16, b - 25, b - 22, L(BR));
      if (!u) {
        c.col(19, b - 25, b - 22, EB); // capped
        c.poly([[2, b - 28], [9, b - 28], [9, b - 24], [6, b - 14], [2, b - 13]], EB); // the cloth over the back
        c.line(2, b - 28, 2, b - 13, hex('#3a3440'));
        c.line(5, b - 26, 4, b - 16, hex('#17151c'));
      } else {
        c.col(19, b - 25, b - 22, C.glassLight);
        c.set(18, b - 20, EB); // the cap hanging by its string
        c.col(18, b - 21, b - 21, C.straw);
        c.poly([[6, b - 29], [15, b - 29], [15, b - 27], [6, b - 27]], EB); // the cloth thrown forward over the box
        c.poly([[3, b - 28], [6, b - 29], [6, b - 20], [3, b - 22]], EB);
        c.col(1, b - 30, b - 16, PINE); // the flash pan held up, gone off
        c.rect(0, b - 31, 3, b - 31, hex('#8a8c90'));
        c.oval(-1, b - 37, 4, b - 32, C.white);
        dots(c, C.flameLight, [1, b - 35, 2, b - 34, 0, b - 33]);
        dots(c, C.ash, [3, b - 38, 5, b - 36, 4, b - 39, 6, b - 38]);
        dots(c, LIT, [-2, b - 33, 5, b - 33, 1, b - 38]);
      }
    },
    sw: 16, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.line(7, b - 18, 2, b, PINE);
      c.line(8, b - 18, 13, b, PINE);
      c.col(8, b - 18, b - 2, D(PINE));
      c.rect(5, b - 19, 10, b - 18, BR);
      if (!u) c.rect(2, b - 28, 13, b - 23, EB); // the cloth hangs down behind
      else c.rect(3, b - 29, 12, b - 27, EB);
      face(c, 3, b - 27, 12, b - 20, MAH);
      c.oval(5, b - 26, 10, b - 21, BR);
      c.oval(6, b - 25, 9, b - 22, u ? C.glass : EB);
      if (u) {
        c.set(7, b - 24, C.glassLight);
        c.oval(11, b - 37, 16, b - 32, C.white);
        dots(c, C.flameLight, [13, b - 35, 14, b - 34]);
        c.col(14, b - 31, b - 18, PINE);
        dots(c, C.ash, [12, b - 38, 15, b - 39]);
        dots(c, LIT, [10, b - 33, 17, b - 34]);
      }
    },
    u: [3, 9, 0], su: [0, 9, 2],
    base: 'side',
  });
};
