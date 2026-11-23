/* Garden, second part: the kitchen garden, the lawn and its games, small buildings in brick and tin. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, legs, hollow, wisp, pot, bush, hedge, stones, bricks, planksV, heap, shards, wheel, fire, cloth } = H;
  const add = H.reg('env-garden', 'Garden');
  const GREYW = hex('#7a6e60'),
    WHITEP = hex('#b0ac9c'),
    OAK = hex('#5c4432'),
    TEAK = hex('#8a6a48'),
    TERRA = hex('#8a4f36'),
    BRICK = hex('#7a4636'),
    GLASSL = hex('#7fa39c'),
    SOIL = hex('#3f2e26'),
    WAT = hex('#5f8f98'),
    TIN = hex('#858a92'),
    SOOT = hex('#1c1a1e'),
    STONE = hex('#8a8a84'),
    CANE = hex('#a8946a'),
    IRON = hex('#3a3f3a'),
    CANVAS = hex('#b0a888'),
    STRIPE = hex('#5a7260'),
    DOORB = hex('#4a6a64'),
    SACK = hex('#9a8a62');
  const vine = (c, x0, y0, x1, y1, seed, col = C.leaf, hi = C.leafLight) => {
    const r = rnd(seed),
      n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / n),
        y = Math.round(y0 + ((y1 - y0) * i) / n);
      c.set(x, y, col);
      if (r() < 0.6) c.set(x + (r() < 0.5 ? 1 : -1), y, r() < 0.5 ? hi : col);
      if (r() < 0.4) c.set(x, y + (r() < 0.5 ? 1 : -1), hi);
    }
  };
  const moss = (c, pts) => dots(c, C.moss, pts);
  const striped = (c, x0, y0, x1, y1) => {
    c.rect(x0, y0, x1, y1, CANVAS);
    for (let x = x0 + 1; x <= x1; x += 3) c.col(x, y0, y1, STRIPE);
  };

  /* ---------- the kitchen garden ---------- */
  add('bean-poles-row', 'bean poles runner beans canes wigwam row kitchen garden pods', {
    w: 30, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (let i = 0; i < 4; i++) {
        const x = 2 + i * 6;
        c.line(x, b, x + 7, 2, CANE);
        c.line(x + 7, b, x, 2, D(CANE));
      }
      c.row(7, 2, 27, CANE);
      for (let i = 0; i < 4; i++) {
        const x = 2 + i * 6;
        vine(c, x, b - 1, x + 5, 10, 3 + i);
        vine(c, x + 7, b - 1, x + 2, 9, 9 + i);
      }
      dots(c, C.red, [5, 14, 12, 11, 18, 16, 24, 12, 9, 22, 21, 24]); // flowers
      const pods = [4, 20, 8, 27, 11, 17, 15, 25, 17, 30, 20, 19, 23, 28, 26, 21, 13, 31, 6, 31];
      if (!u) for (let i = 0; i < pods.length; i += 2) c.col(pods[i], pods[i + 1], pods[i + 1] + 3, hex('#6a9a4a'));
      else {
        c.col(4, 20, 23, hex('#6a9a4a')); // picked clean: a colander of them on the ground
        c.poly([[11, b - 3], [19, b - 3], [17, b], [13, b]], TIN);
        c.row(b - 3, 11, 19, L(TIN));
        c.rect(12, b - 5, 18, b - 4, hex('#6a9a4a'));
        dots(c, hex('#8ab85a'), [13, b - 5, 16, b - 4, 17, b - 5]);
        dots(c, D(TIN), [13, b - 2, 15, b - 1, 17, b - 2]);
        c.line(22, 14, 28, 9, CANE); // and a cane broken
        c.set(22, 14, hex('#d0c0a0'));
      }
    },
    sw: 16, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.line(2, b, 9, 2, CANE);
      c.line(13, b, 6, 2, D(CANE));
      c.rect(7, 6, 8, 7, CANE); // the ridge cane, end on
      vine(c, 3, b - 1, 8, 9, 3);
      vine(c, 12, b - 1, 7, 10, 9);
      vine(c, 5, 26, 11, 24, 5);
      dots(c, C.red, [5, 20, 10, 14, 9, 27]);
      if (!u) for (const [x, y] of [[4, 24], [8, 18], [11, 28], [6, 31]]) c.col(x, y, y + 3, hex('#6a9a4a'));
      else {
        c.poly([[4, b - 3], [11, b - 3], [10, b], [5, b]], TIN);
        c.row(b - 3, 4, 11, L(TIN));
        c.rect(5, b - 5, 10, b - 4, hex('#6a9a4a'));
      }
    },
  });
  add('scarecrow-frame-bare', 'scarecrow frame bare cross pole coat hat sack head field garden', {
    w: 26, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(12, 4, 13, b, GREYW);
      c.col(12, 4, b, L(GREYW));
      c.rect(2, 12, 23, 13, GREYW);
      c.row(12, 2, 23, L(GREYW));
      dots(c, C.iron, [12, 12, 13, 13]);
      moss(c, [12, b, 13, b - 2]);
      if (!u) {
        dots(c, C.straw, [2, 14, 3, 14, 22, 14, 23, 15, 11, 5, 14, 4, 12, 3]); // a few straws and a rag left on it
        c.rect(20, 14, 21, 17, hex('#5a5048'));
        c.set(21, 18, hex('#5a5048'));
      } else {
        const coat = hex('#3f3a36'); // dressed
        c.poly([[1, 11], [24, 11], [24, 15], [17, 15], [18, 30], [7, 30], [8, 15], [1, 15]], coat);
        c.row(11, 1, 24, L(coat));
        c.col(12, 15, 30, D(coat));
        dots(c, K, [13, 18, 13, 22, 13, 26]);
        c.line(8, 16, 9, 29, D(coat));
        dots(c, C.straw, [0, 13, 0, 15, 25, 12, 25, 14, 8, 31, 11, 31, 15, 31, 17, 32]);
        c.rect(9, 4, 16, 10, SACK); // a sack for a head
        c.col(9, 4, 10, L(SACK));
        c.set(11, 6, K);
        c.set(14, 6, K);
        c.row(8, 11, 14, K);
        dots(c, SACK, [11, 8, 13, 8]);
        c.rect(7, 3, 18, 3, hex('#2a2428')); // and a hat
        c.rect(9, 1, 16, 2, hex('#2a2428'));
        c.row(1, 9, 16, hex('#4a4448'));
      }
    },
    sw: 10, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 4, 5, b, GREYW);
      c.col(4, 4, b, L(GREYW));
      c.rect(3, 12, 6, 13, GREYW);
      moss(c, [4, b, 5, b - 2]);
      if (!u) dots(c, C.straw, [6, 14, 3, 5, 6, 4]);
      else {
        const coat = hex('#3f3a36');
        c.poly([[2, 11], [7, 11], [8, 30], [2, 30]], coat);
        c.col(2, 11, 30, L(coat));
        c.col(5, 14, 30, D(coat));
        dots(c, C.straw, [3, 31, 6, 31, 7, 32]);
        c.rect(2, 4, 7, 10, SACK);
        c.col(2, 4, 10, L(SACK));
        c.set(7, 6, K);
        c.rect(1, 3, 9, 3, hex('#2a2428'));
        c.rect(2, 1, 7, 2, hex('#2a2428'));
      }
    },
  });
  add('glass-cloches-row', 'glass cloches bell jars seedlings row garden glass domes', {
    w: 30, h: 13,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 1, 28, b, SOIL);
      c.row(b - 1, 1, 28, mix(SOIL, 1.3));
      const cl = (x) => {
        c.rect(x, 4, x + 6, b - 2, hex('#55706a'));
        c.rect(x + 1, 3, x + 5, 3, hex('#55706a'));
        c.col(x, 4, b - 2, GLASSL);
        c.row(3, x + 1, x + 5, GLASSL);
        c.rect(x + 3, 1, x + 3, 2, GLASSL); // knob
        c.col(x + 2, 5, 7, C.glassLight);
        c.set(x + 3, b - 2, hex('#7aa85a'));
        c.set(x + 3, b - 3, hex('#7aa85a'));
        c.set(x + 4, b - 4, hex('#5a8a4a'));
        c.set(x + 2, b - 3, hex('#5a8a4a'));
      };
      cl(2);
      cl(11);
      if (!u) cl(20);
      else {
        dots(c, hex('#5a8a4a'), [22, b - 2]); // one smashed, the plant bitten to the ground
        c.set(20, b - 2, GLASSL);
        c.set(20, b - 3, GLASSL);
        c.set(26, b - 2, GLASSL);
        shards(c, 19, 28, b - 1, GLASSL, 3);
        c.rect(24, b - 3, 24, b - 2, C.glassLight);
      }
    },
    sw: 11, sh: 13,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 1, 9, b, SOIL);
      c.row(b - 1, 1, 9, mix(SOIL, 1.3));
      if (!u) {
        c.rect(2, 4, 8, b - 2, hex('#55706a'));
        c.rect(3, 3, 7, 3, hex('#55706a'));
        c.col(2, 4, b - 2, GLASSL);
        c.row(3, 3, 7, GLASSL);
        c.rect(5, 1, 5, 2, GLASSL);
        c.col(4, 5, 7, C.glassLight);
        dots(c, hex('#7aa85a'), [5, b - 2, 5, b - 3, 6, b - 4]);
      } else {
        c.set(2, b - 2, GLASSL);
        c.set(2, b - 3, GLASSL);
        c.set(8, b - 2, GLASSL);
        shards(c, 2, 9, b - 1, GLASSL, 4);
        c.set(5, b - 2, hex('#5a8a4a'));
      }
    },
  });

  /* ---------- seats on the lawn ---------- */
  add('garden-swing-seat', 'garden swing seat canopy hammock swing bench striped awning frame', {
    w: 36, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2,
        o = u ? 3 : 0;
      for (const x of [3, 32]) {
        c.col(x, 6, b, WHITEP);
        c.col(x - 1, b - 1, b, WHITEP); // foot
        c.set(x + 1, b, D(WHITEP));
      }
      c.row(b - 3, 3, 32, D(WHITEP));
      striped(c, 1, 2, 34, 5); // the canopy
      c.row(2, 1, 34, L(CANVAS));
      for (let x = 1; x <= 34; x++) if (x % 2) c.set(x, 6, x % 3 ? CANVAS : STRIPE);
      c.line(8, 6, 8 + o, 19, IRON); // chains
      c.line(27, 6, 27 + o, 19, IRON);
      c.rect(6 + o, 15, 29 + o, 22, TEAK); // back slats
      for (let x = 8 + o; x < 29 + o; x += 3) c.col(x, 16, 22, D(TEAK));
      c.row(15, 6 + o, 29 + o, L(TEAK));
      c.rect(6 + o, 23, 29 + o, 25, hex('#7a6a70')); // faded cushion
      c.row(23, 6 + o, 29 + o, hex('#958a8a'));
      dots(c, hex('#8a5560'), [9 + o, 24, 15 + o, 24, 21 + o, 24, 26 + o, 24]);
      c.rect(5 + o, 19, 6 + o, 26, TEAK); // arms
      c.rect(29 + o, 19, 30 + o, 26, TEAK);
      c.row(26, 6 + o, 29 + o, D(TEAK));
      if (u) {
        c.rect(12, 22, 17, 23, hex('#6a5a78')); // a cardigan left on it, and it has not stopped moving
        c.rect(13, 24, 15, 28, hex('#6a5a78'));
        dots(c, C.white, [4, 22, 4, 25, 34, 24]);
      }
    },
    sw: 20, sh: 38,
    s(c, u) {
      const b = c.h - 2,
        o = u ? 4 : 0;
      c.line(9, 6, 2, b, WHITEP); // A-frame
      c.line(10, 6, 17, b, D(WHITEP));
      c.row(b - 8, 5, 14, D(WHITEP));
      striped(c, 2, 2, 17, 5);
      c.row(2, 2, 17, L(CANVAS));
      c.row(6, 2, 17, STRIPE);
      c.line(9, 6, 8 + o, 19, IRON);
      c.rect(6 + o, 15, 7 + o, 25, TEAK); // the seat in profile, facing right
      c.col(6 + o, 15, 25, L(TEAK));
      c.rect(6 + o, 24, 13 + o, 26, TEAK);
      c.rect(8 + o, 23, 13 + o, 23, hex('#7a6a70'));
      c.row(20, 7 + o, 12 + o, TEAK);
      c.col(12 + o, 20, 23, TEAK);
      if (u) {
        c.rect(12, 22, 15, 23, hex('#6a5a78'));
        dots(c, C.white, [7, 27, 5, 22]);
      }
    },
  });
  add('hammock-stand', 'hammock stand wooden frame canvas striped garden rest', {
    w: 44, h: 22, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, b - 1, 37, b, TEAK); // the base beam
      c.row(b - 1, 6, 37, L(TEAK));
      c.line(8, b - 2, 2, 3, TEAK); // arms
      c.line(9, b - 2, 3, 3, D(TEAK));
      c.line(35, b - 2, 41, 3, TEAK);
      c.line(34, b - 2, 40, 3, D(TEAK));
      c.rect(4, b, 11, b, D(TEAK));
      c.rect(32, b, 39, b, D(TEAK));
      dots(c, C.iron, [3, 4, 40, 4]);
      const sag = (x) => 5 + Math.round(7 * Math.sin((Math.PI * (x - 4)) / 35));
      if (!u) {
        for (let x = 4; x <= 39; x++) {
          const y = sag(x);
          c.col(x, y, y + (x > 8 && x < 35 ? 2 : 0), x % 4 === 0 ? STRIPE : CANVAS);
          c.set(x, y, L(CANVAS));
        }
        c.rect(10, 9, 14, 10, hex('#958a8a')); // a cushion
      } else {
        for (let x = 4; x <= 12; x++) {
          const y = 5 + (x - 4) * 1.5; // one end let go: it hangs to the ground
          c.col(x, Math.round(y), Math.round(y) + 2, x % 4 === 0 ? STRIPE : CANVAS);
        }
        c.rect(11, 15, 22, b - 2, CANVAS);
        for (let x = 12; x <= 22; x += 4) c.col(x, 15, b - 2, STRIPE);
        c.row(15, 11, 22, L(CANVAS));
        c.line(22, b - 2, 26, b - 3, C.parchment); // the rope
        c.rect(26, b - 3, 30, b - 2, hex('#958a8a'));
        c.line(40, 4, 39, 9, C.parchment);
      }
    },
    sw: 14, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      c.rect(6, 3, 7, b - 1, TEAK);
      c.col(6, 3, b - 1, L(TEAK));
      c.rect(2, b, 11, b, D(TEAK));
      c.rect(3, b - 1, 10, b - 1, TEAK);
      c.set(7, 4, C.iron);
      if (!u) {
        c.poly([[6, 5], [7, 5], [10, 11], [9, 14], [4, 14], [3, 11]], CANVAS);
        c.col(6, 6, 14, STRIPE);
        c.line(6, 5, 3, 11, L(CANVAS));
        c.row(14, 4, 9, D(CANVAS));
      } else {
        c.poly([[6, 5], [7, 5], [9, b - 2], [4, b - 2]], CANVAS);
        c.col(6, 6, b - 2, STRIPE);
        c.rect(9, b - 3, 12, b - 2, hex('#958a8a'));
      }
    },
  });
  add('sun-lounger-wood', 'sun lounger steamer chair deck lounger wooden slats cushion', {
    w: 38, h: 17, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(9, 9, 35, 10, TEAK); // the frame
      c.row(9, 9, 35, L(TEAK));
      legs(c, [11, 32], 11, b, TEAK);
      c.line(33, 11, 36, b, D(TEAK));
      if (!u) {
        c.line(9, 9, 3, 2, TEAK); // back raised
        c.line(10, 9, 4, 2, D(TEAK));
        c.line(5, 4, 7, b, D(TEAK)); // its prop
        striped(c, 11, 7, 34, 8);
        c.line(10, 7, 5, 1, CANVAS);
        c.line(11, 7, 6, 1, STRIPE);
      } else {
        c.rect(1, 9, 9, 10, TEAK); // dropped flat
        c.row(9, 1, 9, L(TEAK));
        c.col(3, 11, b, D(TEAK));
        striped(c, 2, 7, 22, 8);
        c.rect(23, 6, 33, 8, hex('#b9b0a0')); // a towel in a heap, a book, a glass on its side
        c.row(6, 24, 31, L(hex('#b9b0a0')));
        dots(c, D(hex('#b9b0a0')), [26, 7, 30, 8]);
        c.rect(13, 5, 17, 6, C.paper);
        c.row(6, 13, 17, C.wine);
        c.rect(36, b - 1, 37, b, C.glassLight);
        c.set(35, b, WAT);
      }
    },
    sw: 16, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 8, 13, b - 3, CANVAS); // seen from the foot, running away from us
      for (let x = 3; x <= 13; x += 3) c.col(x, 8, b - 3, STRIPE);
      c.rect(1, 8, 1, b, TEAK);
      c.rect(14, 8, 14, b, TEAK);
      c.rect(1, b - 2, 14, b - 2, TEAK);
      c.row(b - 3, 1, 14, L(TEAK));
      if (!u) {
        c.rect(1, 1, 14, 7, TEAK); // the back standing up
        c.row(1, 1, 14, L(TEAK));
        striped(c, 2, 2, 13, 7);
        c.row(7, 2, 13, D(CANVAS));
      } else {
        c.rect(1, 5, 14, 7, TEAK);
        c.row(5, 1, 14, L(TEAK));
        striped(c, 2, 6, 13, 7);
        c.rect(3, 10, 12, 13, hex('#b9b0a0'));
        c.row(10, 4, 11, L(hex('#b9b0a0')));
        c.rect(6, 8, 9, 9, C.paper);
      }
    },
  });

  /* ---------- machines ---------- */
  add('mower-cylinder-old', 'lawn mower push mower cylinder reel old grass box handle', {
    w: 26, h: 24, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        gr = hex('#3f5a44');
      c.line(13, b - 5, 3, 3, IRON); // handle
      c.line(14, b - 5, 4, 3, D(IRON));
      c.rect(1, 2, 5, 3, OAK);
      c.row(2, 1, 5, L(OAK));
      c.rect(10, b - 2, 12, b, GREYW); // roller behind
      c.rect(13, b - 8, 19, b - 2, gr); // side plate
      c.row(b - 8, 13, 19, L(gr));
      wheel(c, 16, b - 4, 4, IRON, C.rust);
      dots(c, C.rust, [14, b - 7, 18, b - 1, 19, b - 5]);
      c.poly([[20, b - 7], [25, b - 6], [25, b - 1], [20, b - 1]], gr); // the grass box
      c.line(20, b - 7, 25, b - 6, L(gr));
      c.set(22, b - 4, C.rust);
      if (u) {
        const g = hex('#5a8a4a');
        c.rect(20, b - 9, 24, b - 8, g); // full, and a stripe mown behind it
        c.set(21, b - 10, hex('#7aa85a'));
        c.set(23, b - 9, hex('#7aa85a'));
        dots(c, g, [1, b, 3, b, 4, b - 1, 6, b, 8, b, 9, b - 1, 25, b]);
        dots(c, hex('#7aa85a'), [2, b, 7, b]);
      }
    },
    sw: 18, sh: 24,
    s(c, u) {
      const b = c.h - 2,
        gr = hex('#3f5a44');
      c.col(8, 4, b - 9, IRON);
      c.col(9, 4, b - 9, D(IRON));
      c.rect(3, 2, 14, 3, OAK); // the handle bar
      c.row(2, 3, 14, L(OAK));
      for (const x of [1, 15]) {
        c.rect(x, b - 8, x + 1, b, IRON);
        c.col(x, b - 8, b, hex('#5a5f5a'));
      }
      face(c, 3, b - 7, 14, b - 1, gr); // the grass box, coming at us
      c.rect(4, b - 6, 13, b - 5, D(gr));
      dots(c, C.rust, [5, b - 3, 11, b - 2, 9, b - 4]);
      if (u) {
        const g = hex('#5a8a4a');
        c.rect(4, b - 9, 13, b - 8, g);
        dots(c, hex('#7aa85a'), [6, b - 10, 10, b - 9, 12, b - 10]);
        dots(c, g, [0, b, 17, b, 8, b]);
      }
    },
  });
  add('hose-reel-wall', 'hose reel wall garden hose coiled nozzle watering', {
    w: 18, h: 22,
    f(c, u) {
      const b = c.h - 2,
        red = hex('#6a3a30'),
        hz = hex('#3f6a4a');
      c.oval(2, 1, 15, 14, red);
      c.oval(3, 2, 14, 13, hz);
      c.oval(5, 4, 12, 11, D(hz));
      c.oval(6, 5, 11, 10, u ? red : hz);
      c.oval(7, 6, 10, 9, red);
      c.rect(8, 7, 9, 8, C.iron);
      dots(c, L(hz), [4, 5, 5, 3, 8, 2]);
      c.line(9, 8, 13, 4, C.iron); // crank
      c.set(14, 3, OAK);
      if (!u) {
        c.col(4, 13, 18, hz); // the end hanging, nozzle on
        c.rect(4, 19, 4, 20, C.brass);
      } else {
        c.oval(4, 3, 13, 12, red); // most of it run out across the grass
        c.oval(5, 4, 12, 11, hz);
        c.oval(6, 5, 11, 10, red);
        c.rect(8, 7, 9, 8, C.iron);
        c.line(9, 8, 5, 11, C.iron);
        c.col(4, 12, b - 1, hz);
        c.row(b, 4, 24, hz);
        c.row(b, 8, 12, L(hz));
        c.rect(25, b, 26, b, C.brass);
        dots(c, WAT, [27, b, 28, b - 1, 29, b]);
        c.set(28, b, C.white);
      }
    },
    u: [0, 0, 12],
    sw: 8, sh: 22,
    s(c, u) {
      const b = c.h - 2,
        red = hex('#6a3a30'),
        hz = hex('#3f6a4a');
      c.rect(1, 6, 2, 9, C.iron); // bracket
      c.rect(3, 1, 3, 14, red);
      c.rect(6, 1, 6, 14, red);
      c.rect(4, u ? 5 : 2, 5, u ? 10 : 13, hz);
      c.col(4, u ? 5 : 2, u ? 10 : 13, L(hz));
      c.set(7, 7, C.iron);
      c.col(5, 14, u ? b : 18, hz);
      if (!u) c.rect(5, 19, 5, 20, C.brass);
      else {
        c.row(b, 5, 9, hz);
        c.set(10, b, C.brass);
      }
    },
    su: [0, 0, 4],
  });
  add('wheelbarrow-soil-spade', 'wheelbarrow barrow soil earth spade wooden garden load', {
    w: 32, h: 20, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        heap(c, 9, 22, 7, 4, SOIL, 2);
        c.poly([[6, 8], [26, 8], [22, 13], [9, 13]], GREYW); // tray
        c.row(8, 6, 26, L(GREYW));
        c.line(9, 9, 11, 13, D(GREYW));
        c.line(18, 9, 18, 13, D(GREYW));
        c.line(1, 9, 10, 12, OAK); // handles
        c.line(10, 13, 25, 14, OAK);
        legs(c, [9], 14, b, OAK);
        wheel(c, 26, b - 3, 3, OAK, C.iron);
        c.line(15, 6, 19, 0, OAK); // the spade stuck in the load
        c.rect(13, 5, 15, 7, C.steel);
        moss(c, [7, 9, 24, 9]);
      } else {
        c.poly([[8, 4], [20, 12], [16, 16], [8, 12]], GREYW); // tipped up on its nose, the load out
        c.line(8, 4, 20, 12, L(GREYW));
        c.line(9, 8, 15, 14, D(GREYW));
        c.line(4, 1, 8, 8, OAK);
        c.line(8, 12, 18, b - 2, OAK);
        c.line(8, 12, 3, 13, OAK); // a leg in the air
        wheel(c, 19, b - 3, 3, OAK, C.iron);
        heap(c, 20, 30, b, 5, SOIL, 4);
        c.rect(1, b - 1, 12, b, OAK); // the spade thrown down
        c.rect(1, b - 2, 3, b, C.steel);
        dots(c, C.bone, [25, b - 2, 27, b - 3]); // and something white in the earth
      }
    },
    u: [0, 1, 0],
    sw: 18, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        heap(c, 4, 13, 7, 4, SOIL, 2);
        c.poly([[2, 8], [15, 8], [13, 13], [4, 13]], GREYW);
        c.row(8, 2, 15, L(GREYW));
        c.col(8, 9, 13, D(GREYW));
        c.rect(8, b - 6, 9, b, OAK); // the wheel, edge on
        c.col(8, b - 6, b, L(OAK));
        c.set(7, b - 3, C.iron);
        c.set(10, b - 3, C.iron);
        c.col(3, 14, b, D(OAK));
        c.col(14, 14, b, D(OAK));
        c.col(9, 0, 6, OAK);
        c.rect(8, 5, 10, 7, C.steel);
      } else {
        c.poly([[3, 4], [14, 4], [13, 14], [4, 14]], GREYW); // the tray's underside, stood on end
        c.row(4, 3, 14, L(GREYW));
        c.col(6, 5, 14, OAK);
        c.col(11, 5, 14, OAK);
        c.col(6, 1, 4, OAK);
        c.col(11, 1, 4, OAK);
        heap(c, 2, 15, b, 5, SOIL, 4);
        dots(c, C.bone, [7, b - 3, 10, b - 2]);
      }
    },
    su: [0, 1, 0],
  });

  /* ---------- brick ---------- */
  add('garden-door-wall', 'garden door wall brick arched door secret garden gate ivy', {
    w: 28, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      bricks(c, 1, 5, 26, b, BRICK, 5);
      board(c, 0, 3, 27, 4, STONE);
      c.clear(0, 3);
      c.clear(0, 4);
      c.clear(27, 3);
      c.clear(27, 4);
      c.rect(1, 3, 26, 4, STONE);
      c.row(3, 1, 26, L(STONE));
      c.rect(7, 13, 20, b, STONE); // the arch
      c.rect(9, 11, 18, 12, STONE);
      c.rect(11, 10, 16, 10, STONE);
      const door = u ? SOOT : DOORB;
      c.rect(9, 15, 18, b, door);
      c.rect(10, 13, 17, 14, door);
      c.rect(12, 12, 15, 12, door);
      if (!u) {
        planksV(c, 9, 13, 18, b, D(DOORB), 3);
        c.col(9, 15, b, L(DOORB));
        c.row(20, 9, 15, C.iron);
        c.row(b - 5, 9, 15, C.iron);
        c.oval(15, 26, 17, 28, C.iron); // ring
        c.set(16, 27, DOORB);
        dots(c, GREYW, [11, b, 13, b - 1, 16, b]);
      } else {
        c.rect(9, 15, 10, b, DOORB); // open: the door edge on, and another garden beyond
        c.col(10, 15, b, D(DOORB));
        c.rect(12, 26, 18, b, hex('#26382c'));
        c.rect(12, 18, 18, 25, hex('#2c3440'));
        dots(c, hex('#3f5a3c'), [13, 27, 16, 29, 14, 32, 17, 34, 13, 37]);
        c.rect(14, b - 3, 16, b, hex('#4a463c')); // a path
        c.set(15, 30, hex('#b8b0a0')); // and somebody small standing on it
        c.col(15, 31, 33, hex('#8a8478'));
      }
      vine(c, 26, 5, 21, 14, 3);
      vine(c, 22, 3, 14, 6, 4);
      vine(c, 24, 12, 23, 26, 5);
      vine(c, 3, 3, 5, 12, 6);
      moss(c, [2, b, 3, b - 1, 24, b, 7, b]);
    },
    sw: 9, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      bricks(c, 2, 5, 6, b, BRICK, 6);
      c.rect(1, 3, 7, 4, STONE);
      c.row(3, 1, 7, L(STONE));
      vine(c, 5, 3, 4, 14, 3);
      moss(c, [2, b, 6, b - 1]);
      if (u) {
        face(c, 7, 15, 16, b, DOORB);
        planksV(c, 7, 16, 16, b, D(DOORB), 3);
        c.rect(8, 13, 15, 14, DOORB);
        c.rect(10, 12, 13, 12, DOORB);
        c.row(20, 7, 13, C.iron);
        c.row(b - 5, 7, 13, C.iron);
        c.set(15, 27, C.iron);
      } else c.col(6, 13, b, D(STONE));
    },
    su: [0, 0, 10],
  });
  add('barbecue-pit-brick', 'barbecue pit brick grill charcoal garden fire cooking', {
    w: 26, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2;
      bricks(c, 2, 7, 23, b, BRICK, 7);
      c.rect(7, 12, 18, b, SOOT);
      c.rect(1, 6, 24, 6, STONE);
      c.rect(6, 7, 19, 8, SOOT); // the fire bed
      c.row(7, 5, 20, C.iron); // grate
      for (let x = 6; x <= 20; x += 2) c.set(x, 6, C.iron);
      c.rect(8, b - 2, 17, b, hex('#4a4448')); // charcoal sack and ash under
      dots(c, C.ash, [9, b - 1, 12, b, 15, b - 2, 10, 8, 14, 8, 17, 8]);
      moss(c, [2, b, 3, b - 1, 22, b, 23, 12]);
      if (!u) dots(c, hex('#7a5a34'), [9, 6, 13, 5, 16, 6, 11, 6]); // dead leaves on the grill
      else {
        c.row(8, 6, 19, C.flame);
        dots(c, C.flameLight, [7, 8, 10, 8, 13, 8, 16, 8, 19, 8]);
        dots(c, C.red, [8, 8, 15, 8]);
        for (const x of [7, 11, 15]) {
          c.rect(x, 5, x + 2, 5, hex('#6a3024')); // meat on it
          c.set(x, 5, hex('#8a4a34'));
        }
        dots(c, C.flame, [10, 4, 14, 3, 18, 5]);
        wisp(c, 9, 3, 4, C.ash);
        wisp(c, 15, 2, 5, C.ash);
        dots(c, hex('#a05a3a'), [8, 13, 17, 14, 12, 12]);
      }
    },
    u: [0, 3, 0],
    sw: 16, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      bricks(c, 2, 7, 13, b, BRICK, 8);
      c.rect(1, 6, 14, 6, STONE);
      moss(c, [2, b, 12, b - 1]);
      if (!u) dots(c, hex('#7a5a34'), [5, 5, 9, 5]);
      else {
        c.row(5, 3, 12, hex('#6a3024'));
        dots(c, C.flame, [5, 4, 9, 3, 11, 4]);
        wisp(c, 6, 3, 4, C.ash);
        wisp(c, 10, 2, 5, C.ash);
      }
    },
    su: [0, 3, 0],
  });
  add('incinerator-bin', 'incinerator garden bin burning rubbish dustbin fire smoke', {
    w: 14, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(5, 2, 8, 6, TIN); // chimney
      c.col(5, 2, 6, L(TIN));
      c.poly([[2, 9], [5, 6], [8, 6], [11, 9]], TIN);
      c.rect(2, 9, 11, b - 3, TIN);
      c.col(2, 9, b - 3, L(TIN));
      for (let x = 4; x <= 10; x += 2) c.col(x, 11, b - 4, D(TIN)); // ribs
      for (const y of [12, 16]) for (let x = 3; x <= 10; x += 2) c.set(x, y, u ? C.flame : SOOT);
      dots(c, C.rust, [3, b - 4, 9, 10, 10, b - 5, 6, 3]);
      dots(c, SOOT, [5, 5, 8, 4, 6, 7]);
      c.col(3, b - 2, b, TIN);
      c.col(10, b - 2, b, D(TIN));
      c.col(6, b - 2, b, D(TIN));
      if (u) {
        dots(c, C.flameLight, [5, 12, 9, 16, 7, 12]);
        c.rect(6, 0, 7, 1, C.flame);
        c.set(6, -1, C.flameLight);
        wisp(c, 7, -2, 4, C.ash);
        wisp(c, 5, -3, 3, C.ash);
        dots(c, C.red, [4, b, 8, b, 12, b - 1]);
      } else dots(c, C.ash, [4, b, 8, b]);
    },
    u: [0, 6, 0],
  });
  add('stone-trough-water', 'stone trough water sink garden trough duckweed mossy', {
    w: 30, h: 14, solid: true,
    f(c, u) {
      const b = c.h - 2,
        wat = hex('#3f5a4a');
      c.rect(1, 3, 28, b - 2, STONE);
      c.row(3, 1, 28, L(STONE));
      c.col(1, 3, b - 2, L(STONE));
      c.row(4, 3, 26, wat);
      dots(c, hex('#6a9a5a'), [5, 4, 9, 4, 10, 4, 17, 4, 23, 4, 24, 4]); // duckweed
      dots(c, D(STONE), [6, 7, 13, 8, 21, 6, 25, 9, 9, 9]);
      c.rect(3, b - 1, 7, b, D(STONE));
      c.rect(22, b - 1, 26, b, D(STONE));
      moss(c, [2, b - 2, 3, b - 3, 14, b - 2, 27, b - 2, 27, 6, 4, 5]);
      if (u) {
        c.row(4, 3, 26, mix(wat, 1.5)); // something has got out of it
        c.rect(12, 3, 16, 3, wat);
        for (const x of [12, 14, 16, 20]) c.col(x, 5, x % 4 ? 9 : 7, mix(wat, 1.3));
        c.rect(10, b, 22, b, wat);
        dots(c, wat, [23, b, 25, b, 27, b - 1, 29, b]);
        dots(c, hex('#6a9a5a'), [13, 6, 15, 8, 18, b]);
        dots(c, C.white, [7, 4, 21, 4]);
      }
    },
    sw: 14, sh: 14,
    s(c, u) {
      const b = c.h - 2,
        wat = hex('#3f5a4a');
      c.rect(1, 3, 12, b - 2, STONE);
      c.row(3, 1, 12, L(STONE));
      c.col(1, 3, b - 2, L(STONE));
      c.row(4, 3, 10, u ? mix(wat, 1.5) : wat);
      c.set(6, 4, hex('#6a9a5a'));
      c.rect(2, b - 1, 11, b, D(STONE));
      moss(c, [2, b - 2, 10, 7, 11, b - 3]);
      if (u) {
        c.col(12, 4, 9, mix(wat, 1.3));
        c.rect(11, b, 13, b, wat);
      }
    },
  });

  /* ---------- games, birds, graves ---------- */
  add('croquet-set-stand', 'croquet set mallets balls hoops stand lawn game', {
    w: 26, h: 20,
    f(c, u) {
      const b = c.h - 2,
        cols = [hex('#4f6a9a'), C.red, hex('#2a2428'), C.mustard];
      board(c, 2, b - 5, 21, b - 4, TEAK); // the stand
      c.rect(2, b - 3, 3, b, TEAK);
      c.rect(20, b - 3, 21, b, TEAK);
      c.rect(2, 8, 3, b - 6, TEAK);
      c.rect(20, 8, 21, b - 6, TEAK);
      c.row(8, 2, 21, TEAK);
      cols.forEach((col, i) => {
        const x = 5 + i * 4;
        if (u && i === 1) return;
        c.col(x + 1, 2, b - 9, CANE); // mallets, heads down
        c.rect(x, b - 9, x + 2, b - 6, TEAK);
        c.row(b - 8, x, x + 2, col);
        c.set(x + 1, 1, col);
      });
      cols.forEach((col, i) => {
        if (u && i === 1) return;
        c.rect(5 + i * 4, b - 2, 6 + i * 4, b - 1, col); // balls on the rail under
        c.set(5 + i * 4, b - 2, L(col));
      });
      c.row(b, 4, 19, D(TEAK));
      c.frame(22, 9, 24, 14, C.white); // hoops hung on the end
      c.clear(23, 14);
      c.clear(22, 14);
      c.clear(24, 14);
      if (u) {
        c.rect(22, b - 1, 25, b, TEAK); // the red mallet down on the grass, its head dark and wet
        c.col(23, b - 1, b, C.red);
        c.rect(26, b, 33, b, CANE);
        c.rect(22, b - 1, 22, b, C.blood);
        c.set(21, b, C.blood);
        c.rect(35, b - 1, 36, b, C.red); // and the red ball rolled off
      }
    },
    u: [0, 0, 12],
    sw: 10, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      board(c, 2, b - 5, 7, b - 4, TEAK);
      c.rect(4, 8, 5, b, TEAK);
      c.col(4, 8, b, L(TEAK));
      c.rect(1, b, 8, b, D(TEAK));
      c.col(6, 2, b - 9, CANE);
      c.rect(5, b - 9, 7, b - 6, TEAK);
      c.row(b - 8, 5, 7, hex('#4f6a9a'));
      c.rect(2, b - 2, 3, b - 1, C.mustard);
      c.rect(1, 9, 2, 14, C.white);
      if (u) {
        c.rect(9, b - 1, 11, b, TEAK);
        c.col(10, b - 1, b, C.red);
        c.set(9, b, C.blood);
        c.rect(13, b - 1, 14, b, C.red);
      }
    },
    su: [0, 0, 6],
  });
  add('bird-feeder-crook', 'bird feeder hanging nuts shepherds crook pole coconut garden birds', {
    w: 14, h: 34,
    f(c, u) {
      const b = c.h - 2;
      c.col(4, 4, b, IRON);
      c.line(4, 4, 6, 1, IRON);
      c.row(1, 6, 9, IRON);
      c.line(10, 2, 10, 4, IRON);
      c.col(10, 5, 7, C.iron); // chain
      c.rect(9, 8, 11, 16, hex('#6a6f68')); // the wire feeder
      c.row(8, 8, 12, IRON);
      c.row(17, 8, 12, IRON);
      for (let y = 9; y <= 16; y++) c.set(9 + (y % 3), y, u ? SOOT : hex('#a07a4a'));
      if (!u) {
        c.rect(9, 12, 11, 16, hex('#a07a4a')); // nuts
        dots(c, hex('#c09a6a'), [9, 13, 11, 15, 10, 12]);
        c.rect(6, 15, 7, 16, hex('#6a5a4a')); // a sparrow on the perch
        c.set(8, 15, hex('#6a5a4a'));
        c.set(5, 16, hex('#4a3c30'));
        c.set(8, 16, C.mustard);
      } else {
        c.rect(5, b - 1, 8, b, hex('#6a5a4a')); // empty; and the sparrow on its back underneath
        c.row(b - 1, 6, 7, hex('#b9a890'));
        c.set(6, b - 2, C.mustard);
        c.set(7, b - 2, C.mustard);
        dots(c, hex('#6a5a4a'), [10, b, 2, b, 11, b - 2]);
      }
      moss(c, [4, b, 3, b]);
    },
    sw: 8, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.col(3, 1, b, IRON);
      c.set(4, 1, IRON);
      c.col(4, 5, 7, C.iron);
      c.rect(3, 8, 5, 16, hex('#6a6f68'));
      c.row(8, 2, 6, IRON);
      c.row(17, 2, 6, IRON);
      if (!u) c.rect(3, 12, 5, 16, hex('#a07a4a')), dots(c, hex('#c09a6a'), [3, 13, 5, 15]);
      else {
        c.rect(4, b - 1, 6, b, hex('#6a5a4a'));
        c.set(5, b - 2, C.mustard);
      }
    },
  });
  add('dog-grave-cross', 'dog grave pet grave wooden cross collar mound garden burial', {
    w: 22, h: 18,
    f(c, u) {
      const b = c.h - 2,
        cross = (x, tilt) => {
          c.line(x, 2, x + tilt, b - 3, GREYW);
          c.line(x + 1, 2, x + 1 + tilt, b - 3, D(GREYW));
          c.line(x - 3, 6 - (tilt ? 1 : 0), x + 4, 6 + (tilt ? 2 : 0), GREYW);
        };
      if (!u) {
        heap(c, 3, 19, b, 4, SOIL, 2);
        cross(10, 0);
        c.row(7, 9, 12, C.red); // his collar hung on it
        c.set(10, 8, C.brass);
        dots(c, STONE, [3, b, 6, b, 16, b, 19, b]);
        c.rect(16, b - 5, 17, b - 3, GLASSL); // a jam jar of flowers, long dead
        c.line(16, b - 6, 15, b - 8, hex('#7a5a34'));
        c.set(17, b - 7, hex('#7a5a34'));
        dots(c, C.leafLight, [5, b - 2, 14, b - 3]);
      } else {
        c.rect(5, b - 1, 15, b, SOOT); // dug up, and from underneath
        c.row(b - 2, 6, 14, hex('#2a1e1a'));
        heap(c, 0, 5, b, 3, SOIL, 3);
        heap(c, 15, 21, b, 4, SOIL, 4);
        cross(12, 4);
        c.rect(1, b - 4, 4, b - 4, C.red); // the collar thrown clear
        c.set(2, b - 5, C.brass);
        dots(c, C.bone, [8, b - 1, 12, b]);
        dots(c, SOIL, [7, b - 3, 10, b - 4, 18, b - 5]);
        c.set(18, b - 1, GLASSL);
      }
    },
    sw: 14, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        heap(c, 2, 11, b, 4, SOIL, 5);
        c.rect(6, 2, 7, b - 3, GREYW);
        c.col(6, 2, b - 3, L(GREYW));
        c.set(7, 7, C.red);
        dots(c, STONE, [2, b, 11, b]);
      } else {
        c.rect(3, b - 1, 10, b, SOOT);
        heap(c, 10, 13, b, 4, SOIL, 6);
        c.line(7, 3, 9, b - 3, GREYW);
        c.set(2, b - 2, C.red);
        dots(c, C.bone, [5, b - 1]);
      }
    },
  });
};
