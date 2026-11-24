/* Medieval, part 2: gatehouse, hall and market place. Part of tools/big/env2-medieval.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix } = kit;
  const { D, L, dots, board, face, panel, hollow, fire, wisp, planksV, planksH, stones, chain, rope, candle, post, straps, barrelEnd, barrelSide } = H;
  const add = H.reg('env-medieval', 'Medieval');
  const { OAK, DOAK, PINE, CANVAS, HEMP, RED, BLUE, SOOT, LEATHER, PEWTER, MSTONE, WAT } = H.MED;
  const IRON = C.iron,
    STEEL = C.steel,
    GOLD = C.gold,
    ALE = hex('#a8782c'),
    ROAST = hex('#7a4a2c');

  add('medieval-banner-heraldic-stand', 'banner standard flag heraldic red gold lion pole stand castle hall', {
    w: 16, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(7, 2, 8, b - 1, DOAK);
      c.col(7, 2, b - 1, OAK);
      c.set(7, 1, GOLD);
      c.set(8, 1, D(GOLD));
      board(c, 4, b - 1, 11, b, DOAK);
      c.line(5, b - 2, 6, b - 4, DOAK);
      c.line(10, b - 2, 9, b - 4, DOAK);
      c.row(4, 2, 13, DOAK);
      c.set(2, 5, GOLD);
      c.set(13, 5, GOLD);
      const yb = u ? 17 : 25;
      c.rect(3, 5, 12, yb, RED);
      c.col(3, 5, yb, L(RED));
      c.col(12, 5, yb, D(RED));
      c.row(5, 3, 12, GOLD);
      if (!u) {
        c.poly([[3, 26], [7, 26], [5, 29], [3, 29]], RED); // swallow tails
        c.poly([[8, 26], [12, 26], [12, 29], [10, 29]], RED);
        c.col(12, 26, 29, D(RED));
        c.col(3, 26, 29, L(RED));
        c.row(22, 3, 12, GOLD);
        c.rect(6, 10, 9, 13, GOLD); // a lion, more or less
        dots(c, GOLD, [5, 9, 6, 9, 10, 11, 10, 9, 6, 14, 9, 14, 6, 15, 9, 15, 10, 15, 5, 15]);
        c.set(6, 10, RED);
        dots(c, D(RED), [5, 18, 10, 19, 8, 24]);
      } else {
        c.rect(6, 10, 9, 13, GOLD); // burnt away below
        dots(c, GOLD, [5, 9, 6, 9, 10, 11, 10, 9, 6, 14, 9, 14]);
        c.set(6, 10, RED);
        for (const [x, y] of [[3, 17], [4, 17], [7, 17], [8, 17], [11, 17], [12, 17], [12, 16], [3, 16], [7, 16]]) c.clear(x, y);
        dots(c, SOOT, [3, 15, 4, 16, 5, 17, 6, 17, 7, 15, 8, 16, 9, 17, 10, 17, 11, 16, 12, 15, 6, 16, 10, 16]);
        dots(c, D(RED), [5, 18, 10, 19, 6, 20]);
        dots(c, SOOT, [4, b, 10, b - 2, 12, b]);
        c.set(11, b, RED);
      }
    },
    sw: 10, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 2, 5, b - 1, DOAK);
      c.col(4, 2, b - 1, OAK);
      c.set(4, 1, GOLD);
      c.set(5, 1, D(GOLD));
      board(c, 1, b - 1, 8, b, DOAK);
      c.line(2, b - 2, 3, b - 4, DOAK);
      c.line(7, b - 2, 6, b - 4, DOAK);
      c.rect(3, 4, 6, 4, DOAK);
      c.col(6, 5, u ? 15 : 28, RED);
      c.col(7, 6, u ? 14 : 26, D(RED));
      c.set(6, 5, GOLD);
      if (u) dots(c, SOOT, [6, 16, 7, 15, 7, b]);
      else c.set(6, 22, GOLD);
    },
  });
  add('medieval-portcullis-winch', 'portcullis winch windlass chain drum crank gatehouse iron oak machine', {
    w: 28, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      chain(c, 13, 1, 13, 10);
      chain(c, 14, 1, 14, 10, D(IRON));
      for (const x of [4, 20]) {
        post(c, x, x + 2, 6, b, OAK);
        c.row(6, x, x + 2, L(OAK));
        board(c, x - 2, b - 1, x + 4, b, DOAK);
      }
      c.row(b - 4, 7, 19, DOAK);
      c.rect(7, 10, 19, 15, PINE); // the drum
      c.row(10, 7, 19, L(PINE));
      c.row(15, 7, 19, D(PINE));
      if (!u) {
        for (let x = 8; x <= 18; x++) c.col(x, 9, 16, x % 2 ? IRON : L(IRON)); // wound full of chain
        c.row(16, 8, 18, D(IRON));
      } else {
        for (let x = 12; x <= 15; x++) c.col(x, 10, 15, x % 2 ? IRON : L(IRON)); // run out
        dots(c, D(PINE), [9, 12, 17, 13]);
        dots(c, C.flameLight, [3, 9, 2, 11]); // the ratchet still hot
      }
      c.rect(23, 11, 24, 14, IRON); // the crank
      if (!u) {
        c.col(25, 6, 12, IRON);
        c.rect(25, 5, 26, 6, PINE);
      } else {
        c.col(25, 13, 19, IRON);
        c.rect(25, 19, 26, 20, PINE);
      }
      c.rect(3, 11, 5, 13, IRON); // ratchet wheel
      dots(c, L(IRON), [3, 11, 5, 13]);
      c.set(4, 12, K);
    },
    sw: 14, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      chain(c, 6, 1, 6, 8);
      c.line(6, 6, 2, b - 1, OAK);
      c.line(7, 6, 11, b - 1, DOAK);
      c.line(7, 7, 3, b - 1, DOAK);
      c.row(b - 5, 4, 10, DOAK);
      board(c, 1, b - 1, 12, b, DOAK);
      if (!u) {
        c.oval(3, 8, 10, 15, IRON);
        c.oval(4, 9, 9, 14, L(IRON));
      }
      c.oval(4, 9, 9, 14, u ? PINE : IRON);
      c.oval(5, 10, 8, 13, u ? D(PINE) : L(IRON));
      c.rect(6, 11, 7, 12, IRON);
      if (!u) {
        c.line(7, 11, 10, 5, IRON);
        c.set(11, 4, PINE);
        c.set(10, 4, PINE);
      } else {
        c.line(7, 12, 10, 18, IRON);
        c.set(11, 19, PINE);
        c.set(10, 19, PINE);
      }
    },
  });
  add('medieval-drawbridge-counterweight', 'drawbridge chain counterweight stone block pulley iron gatehouse castle', {
    w: 18, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2,
        y = u ? b - 10 : 17;
      c.oval(5, 1, 12, 8, IRON); // the pulley
      c.oval(6, 2, 11, 7, D(IRON));
      c.rect(8, 4, 9, 5, L(IRON));
      c.rect(3, 3, 4, 5, DOAK);
      c.rect(13, 3, 14, 5, DOAK);
      for (let yy = 8; yy < y - 1; yy++) {
        const k = (yy - 8) % 4;
        if (k < 2) {
          c.set(8, yy, L(IRON));
          c.set(9, yy, IRON);
        } else {
          c.set(7, yy, IRON);
          c.set(10, yy, D(IRON));
        }
      }
      c.rect(7, y - 2, 10, y - 1, IRON); // the ring
      c.set(8, y - 1, K);
      c.set(9, y - 1, K);
      stones(c, 3, y, 14, y + 10, MSTONE, 4, 6, 3);
      c.col(3, y, y + 10, L(MSTONE));
      straps(c, 3, 14, [y + 5]);
      if (!u) {
        c.row(b, 4, 13, mix(MSTONE, 0.45)); // its shadow on the floor
      } else {
        dots(c, C.stoneLight, [1, b, 2, b - 1, 16, b, 15, b - 2]);
        c.line(5, y + 1, 7, y + 4, mix(MSTONE, 0.5));
        c.line(7, y + 6, 6, y + 9, mix(MSTONE, 0.5));
      }
    },
    sw: 12, sh: 46,
    s(c, u) {
      const b = c.h - 2,
        y = u ? b - 10 : 17;
      c.rect(5, 1, 6, 8, IRON);
      c.col(5, 1, 8, L(IRON));
      c.rect(3, 3, 8, 5, DOAK);
      c.row(3, 3, 8, OAK);
      for (let yy = 9; yy < y - 1; yy++) {
        c.set(5, yy, (yy >> 1) % 2 ? L(IRON) : IRON);
        if ((yy >> 1) % 2) c.set(6, yy, D(IRON));
      }
      c.rect(5, y - 2, 6, y - 1, IRON);
      stones(c, 2, y, 9, y + 10, MSTONE, 4, 5, 5);
      c.col(2, y, y + 10, L(MSTONE));
      straps(c, 2, 9, [y + 5]);
      if (!u) c.row(b, 3, 8, mix(MSTONE, 0.45));
      else dots(c, C.stoneLight, [1, b, 10, b, 10, b - 2]);
    },
  });
  add('medieval-hearth-with-spit', 'hearth great fireplace spit roast boar stone hood kitchen castle fire', {
    w: 38, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[8, 2], [29, 2], [35, 12], [2, 12]], MSTONE); // the hood
      c.line(8, 2, 2, 12, L(MSTONE));
      c.row(2, 8, 29, L(MSTONE));
      for (const y of [5, 9]) c.row(y, 5, 32, D(MSTONE));
      dots(c, D(MSTONE), [12, 3, 20, 4, 26, 3, 9, 7, 16, 8, 23, 6, 29, 8, 6, 11, 13, 10, 20, 11, 27, 10, 33, 11]);
      for (let x = 2; x <= 35; x++) for (const y of [5, 9]) if (!c.get(x, y - 1) || !c.get(x, y - 3)) void 0;
      board(c, 1, 13, 36, 15, DOAK); // the mantel beam
      stones(c, 1, 16, 7, b, MSTONE, 4, 5, 2);
      stones(c, 30, 16, 36, b, MSTONE, 4, 5, 4);
      c.rect(8, 16, 29, b, SOOT);
      c.row(16, 8, 29, K);
      dots(c, hex('#2c2830'), [10, 19, 15, 18, 22, 20, 27, 18, 12, 24, 25, 25]);
      if (u) {
        fire(c, 11, 26, b, 9, 5);
        dots(c, C.flameLight, [13, 21, 22, 20, 18, 19]);
        for (let x = 8; x <= 29; x++) if (x % 3 === 0) c.set(x, 17, hex('#4a2c22'));
      } else {
        c.rect(12, b - 1, 25, b, hex('#4a4a4c')); // cold ash, a charred log
        c.rect(14, b - 2, 22, b - 1, hex('#2e2826'));
        dots(c, C.ash, [13, b, 17, b - 1, 23, b]);
      }
      for (const x of [10, 27]) {
        c.col(x, 21, b, IRON); // the firedogs
        c.set(x, 20, L(IRON));
        c.set(x + (x < 19 ? -1 : 1), b, IRON);
      }
      c.row(22, 6, 32, IRON); // the spit and its handle
      c.row(22, 6, 9, L(IRON));
      c.col(33, 22, 24, IRON);
      c.set(34, 24, PINE);
      if (u) {
        c.oval(13, 19, 24, 25, ROAST); // a boar turning
        c.row(19, 15, 21, L(ROAST));
        c.rect(24, 21, 26, 23, ROAST);
        c.set(26, 21, C.bone);
        c.set(25, 21, K);
        dots(c, D(ROAST), [15, 24, 18, 25, 21, 24, 14, 22]);
        dots(c, L(ROAST), [16, 20, 19, 20]);
        c.set(12, 22, D(ROAST));
        dots(c, C.flameLight, [17, 27, 20, 26]);
      }
    },
    sw: 16, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 2], [7, 2], [12, 12], [2, 12]], MSTONE);
      c.col(2, 2, 12, L(MSTONE));
      for (const y of [5, 9]) c.row(y, 2, 10, D(MSTONE));
      dots(c, D(MSTONE), [5, 3, 4, 7, 8, 8, 6, 11, 10, 11]);
      board(c, 2, 13, 13, 15, DOAK);
      stones(c, 2, 16, 11, b, MSTONE, 4, 5, 2);
      c.col(11, 16, b, D(MSTONE));
      c.row(22, 12, 13, IRON);
      c.col(13, 22, 24, IRON);
      c.set(13, 25, PINE);
      if (u) {
        c.col(12, b - 4, b, C.flame);
        c.col(13, b - 2, b, C.flame);
        c.set(12, b - 5, C.red);
        c.col(12, b - 2, b, C.flameLight);
        c.set(12, 19, ROAST);
        c.set(12, 20, ROAST);
        wisp(c, 12, 11, 4);
      } else c.set(12, b, hex('#4a4a4c'));
    },
  });
  add('medieval-tapestry-frame', 'tapestry frame upright loom weaving hanging blue gold stag embroidery', {
    w: 30, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 2, 3, 2, b, OAK);
      post(c, 25, 26, 2, b, OAK);
      board(c, 1, b - 1, 5, b, DOAK);
      board(c, 23, b - 1, 27, b, DOAK);
      board(c, 2, 4, 26, 5, PINE); // rollers
      board(c, 2, 28, 26, 29, PINE);
      c.rect(5, 6, 23, 22, BLUE);
      c.frame(5, 6, 23, 22, RED);
      dots(c, GOLD, [5, 6, 23, 6, 5, 22, 23, 22, 14, 6, 14, 22]);
      c.rect(11, 13, 16, 16, GOLD); // a stag
      c.rect(16, 11, 17, 13, GOLD);
      dots(c, GOLD, [11, 17, 11, 18, 13, 17, 15, 17, 15, 18, 16, 17, 17, 9, 19, 9, 18, 10, 16, 10, 10, 13]);
      dots(c, C.leafLight, [7, 19, 8, 20, 9, 19, 19, 20, 20, 19, 21, 20, 8, 9, 20, 13]);
      dots(c, D(BLUE), [8, 12, 12, 9, 20, 16, 9, 16]);
      for (let x = 5; x <= 23; x++) c.col(x, 23, 27, x % 2 ? CANVAS : D(CANVAS)); // the bare warp
      if (u) {
        for (let i = 0; i < 11; i++) {
          c.clear(9 + i, 8 + i); // slashed across
          c.clear(10 + i, 8 + i);
          if (i > 3) c.clear(9 + i, 9 + i);
        }
        c.poly([[10, 9], [12, 11], [9, 15], [8, 12]], D(BLUE));
        c.line(10, 9, 8, 12, RED);
        dots(c, CANVAS, [12, 10, 16, 14, 19, 17, 14, 13]);
        c.line(21, b - 2, 23, b, STEEL); // the knife on the floor
        c.set(20, b - 3, DOAK);
      }
    },
    sw: 10, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      post(c, 4, 5, 2, b, OAK);
      board(c, 1, b - 1, 8, b, DOAK);
      c.line(2, b - 2, 3, b - 5, DOAK);
      c.line(7, b - 2, 6, b - 5, DOAK);
      c.rect(3, 4, 6, 5, PINE);
      c.rect(3, 28, 6, 29, PINE);
      c.col(6, 6, 22, BLUE);
      c.set(6, 6, RED);
      c.set(6, 22, RED);
      c.col(6, 23, 27, CANVAS);
      if (u) {
        c.set(7, 11, D(BLUE));
        c.set(8, 12, D(BLUE));
        c.set(7, 13, RED);
        c.set(7, b, STEEL);
      }
    },
  });
  add('medieval-scribe-desk-slanted', 'scribe desk writing slope monk clerk parchment quill ink candle manuscript', {
    w: 22, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 23, 4, b, DOAK);
      c.rect(17, 23, 18, b, DOAK);
      c.row(b - 2, 5, 16, D(OAK));
      face(c, 2, 17, 19, 22, OAK);
      panel(c, 5, 18, 16, 21, OAK);
      c.set(10, 20, IRON);
      c.rect(2, 9, 19, 16, PINE); // the slope
      c.row(9, 2, 19, L(PINE));
      c.row(16, 2, 19, DOAK);
      c.row(8, 2, 19, OAK);
      c.col(4, 4, 7, IRON); // a pricket candle
      candle(c, 4, 5, 3, u);
      c.rect(16, 6, 17, 7, SOOT); // ink horn
      c.set(16, 6, D(IRON));
      if (!u) {
        c.line(18, 1, 17, 5, C.white); // quill in the horn
        c.set(19, 2, C.paper);
        c.rect(6, 10, 14, 15, C.parchment);
        c.row(10, 6, 14, L(C.parchment));
        for (const y of [12, 14]) c.row(y, 7, 12, D(C.parchment));
      } else {
        c.rect(5, 10, 16, 15, C.paper); // a great book open, the ink knocked over it
        c.col(10, 10, 15, D(C.paper));
        c.col(11, 10, 15, L(C.paper));
        c.row(15, 5, 16, LEATHER);
        for (const y of [11, 13]) {
          c.row(y, 6, 9, D(C.parchment));
          c.row(y, 12, 15, D(C.parchment));
        }
        c.rect(6, 11, 7, 12, RED);
        c.rect(13, 12, 15, 14, SOOT);
        dots(c, SOOT, [12, 13, 16, 13, 14, 15, 14, 16, 14, 18, 15, 11]);
        c.line(7, 14, 9, 13, C.white);
      }
    },
    sw: 16, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 23, 4, b, DOAK);
      c.rect(11, 23, 12, b, DOAK);
      face(c, 2, 17, 13, 22, OAK);
      c.poly([[2, 14], [13, 9], [13, 16], [2, 16]], PINE);
      c.line(2, 14, 13, 9, L(PINE));
      c.line(2, 13, 13, 8, OAK);
      c.row(16, 2, 13, DOAK);
      c.col(13, 4, 7, IRON);
      candle(c, 13, 5, 3, u);
      if (!u) {
        c.line(4, 12, 10, 9, C.parchment);
        c.line(11, 3, 11, 7, C.white);
      } else {
        c.line(3, 12, 11, 8, C.paper);
        c.line(3, 13, 11, 9, LEATHER);
        c.set(8, 9, SOOT);
        c.set(6, 12, SOOT);
      }
      c.set(11, 8, SOOT);
    },
  });
  add('medieval-chest-of-coin', 'chest of coin treasure strongbox iron bound gold money hoard coffer', {
    w: 22, h: 16, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, 8, 19, b, OAK);
      planksH(c, 2, 8, 19, b, D(OAK), 3);
      for (const x of [5, 16]) c.col(x, 8, b, IRON);
      c.row(b, 2, 19, DOAK);
      if (!u) {
        c.rect(2, 4, 19, 7, OAK);
        c.row(3, 3, 18, OAK);
        c.row(3, 3, 18, L(OAK));
        c.row(7, 2, 19, D(OAK));
        for (const x of [5, 16]) c.col(x, 3, 7, IRON);
        c.rect(10, 7, 11, 9, IRON);
        c.set(10, 8, GOLD);
      } else {
        c.rect(2, -4, 19, 3, DOAK); // the lid thrown back
        c.row(-5, 3, 18, DOAK);
        c.row(-4, 2, 19, D(DOAK));
        for (const x of [5, 16]) c.col(x, -5, 3, D(IRON));
        c.rect(3, 4, 18, 7, GOLD); // the gold
        c.row(3, 5, 15, GOLD);
        c.row(2, 8, 12, GOLD);
        dots(c, L(GOLD), [5, 4, 8, 3, 10, 2, 12, 4, 15, 5, 7, 6, 17, 6]);
        dots(c, D(GOLD), [4, 6, 9, 5, 13, 6, 11, 3, 16, 4]);
        c.set(14, 3, RED);
        c.rect(10, 8, 11, 9, IRON);
        dots(c, GOLD, [22, b, 24, b, 23, b - 1, 20, b]);
        c.set(24, b, L(GOLD));
      }
    },
    u: [0, 6, 4],
    sw: 14, sh: 16,
    s(c, u) {
      const b = c.h - 2;
      face(c, 2, 8, 11, b, OAK);
      planksH(c, 2, 8, 11, b, D(OAK), 3);
      c.row(b, 2, 11, DOAK);
      c.rect(6, 10, 7, 11, IRON);
      c.set(6, 11, K);
      if (!u) {
        c.rect(2, 4, 11, 7, OAK);
        c.row(3, 3, 10, L(OAK));
        c.row(7, 2, 11, D(OAK));
        c.col(2, 4, 7, L(OAK));
      } else {
        c.rect(1, -5, 2, 7, DOAK);
        c.col(1, -5, 7, OAK);
        c.rect(3, 5, 10, 7, GOLD);
        c.row(4, 4, 9, GOLD);
        c.row(3, 5, 7, GOLD);
        dots(c, L(GOLD), [5, 4, 7, 5, 4, 6]);
        dots(c, D(GOLD), [8, 6, 6, 6]);
        dots(c, GOLD, [13, b, 14, b]);
      }
    },
    su: [0, 6, 4],
  });
  add('medieval-barrel-of-ale-trestle', 'barrel of ale beer cask keg on trestle tap tavern cellar tankard', {
    w: 26, h: 22, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (const x of [6, 16]) {
        c.line(x, 14, x - 2, b, DOAK);
        c.line(x + 2, 14, x + 4, b, DOAK);
        c.line(x + 1, 14, x - 1, b, OAK);
      }
      c.row(b - 2, 4, 20, D(OAK));
      barrelSide(c, 2, 3, 20, 14, PINE);
      c.set(11, 2, DOAK); // the bung
      c.rect(21, 11, 22, 11, C.brass); // the tap
      c.set(22, 10, C.brass);
      c.set(22, 12, D(C.brass));
      c.rect(22, b - 2, 24, b, PEWTER); // a tankard under it
      c.col(22, b - 2, b, L(PEWTER));
      if (u) {
        c.col(22, 13, b - 3, ALE);
        c.row(b - 3, 22, 24, C.white);
        dots(c, C.white, [21, b - 2, 25, b - 2, 23, b - 4]);
        c.row(b, 17, 21, ALE);
        dots(c, ALE, [16, b, 25, b]);
        c.set(19, b, L(ALE));
      }
    },
    sw: 18, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      c.line(4, 13, 2, b, OAK);
      c.line(13, 13, 15, b, DOAK);
      c.row(b - 2, 3, 14, D(OAK));
      c.row(15, 3, 14, DOAK);
      barrelEnd(c, 3, 3, 14, 14, PINE);
      c.rect(8, 10, 9, 11, C.brass);
      c.set(8, 12, D(C.brass));
      c.rect(7, b - 2, 10, b, PEWTER);
      c.col(7, b - 2, b, L(PEWTER));
      if (u) {
        c.col(8, 13, b - 3, ALE);
        c.row(b - 3, 7, 10, C.white);
        dots(c, C.white, [6, b - 2, 11, b - 2]);
        c.row(b, 3, 6, ALE);
        dots(c, ALE, [12, b, 13, b]);
      }
    },
  });
  add('medieval-stocks-pillory', 'stocks pillory punishment wooden boards holes head hands padlock market square', {
    w: 28, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2,
        up = u ? 5 : 0;
      for (const x of [3, 22]) {
        post(c, x, x + 2, 3, b, OAK);
        board(c, x - 2, b - 1, x + 4, b, DOAK);
        c.row(3, x, x + 2, L(OAK));
      }
      face(c, 6, 14, 21, 19, PINE); // the lower board
      c.row(19, 6, 21, D(PINE));
      face(c, 6, 9 - up, 21, 13 - up, PINE); // the upper one
      c.row(13 - up, 6, 21, D(PINE));
      const hole = (x0, x1, y0, y1) => c.rect(x0, y0, x1, y1, SOOT);
      hole(12, 15, 14, 15); // head
      hole(8, 9, 14, 14);
      hole(18, 19, 14, 14);
      hole(12, 15, 12 - up, 13 - up);
      hole(8, 9, 13 - up, 13 - up);
      hole(18, 19, 13 - up, 13 - up);
      c.set(13, 11 - up, SOOT);
      c.set(14, 11 - up, SOOT);
      c.rect(20, 12, 21, 15, IRON); // hasp
      if (!u) {
        c.rect(20, 14, 21, 16, IRON);
        c.set(20, 15, GOLD);
        c.set(8, 17, C.leaf); // something rotten thrown
        c.set(9, 17, C.moss);
        c.set(9, 18, C.moss);
      } else {
        c.clear(20, 12);
        c.clear(21, 12);
        c.clear(20, 13);
        c.clear(21, 13);
        c.rect(20, 14, 21, 15, IRON);
        c.rect(23, b - 2, 24, b - 1, IRON); // the lock on the ground
        c.set(24, b - 3, L(IRON));
        dots(c, C.blood, [12, 16, 13, 16, 15, 16, 13, 17, 14, 18, 8, 15, 19, 15]);
        dots(c, C.moss, [9, 17, 9, 18, 16, b, 10, b]);
        c.set(8, 17, C.leaf);
      }
    },
    sw: 12, sh: 28,
    s(c, u) {
      const b = c.h - 2,
        up = u ? 5 : 0;
      post(c, 4, 6, 3, b, OAK);
      c.row(3, 4, 6, L(OAK));
      board(c, 1, b - 1, 9, b, DOAK);
      c.line(2, b - 2, 3, b - 5, DOAK);
      c.line(8, b - 2, 7, b - 5, DOAK);
      c.rect(3, 14, 7, 19, PINE);
      c.col(3, 14, 19, L(PINE));
      c.row(19, 3, 7, D(PINE));
      c.rect(3, 9 - up, 7, 13 - up, PINE);
      c.col(3, 9 - up, 13 - up, L(PINE));
      c.row(13 - up, 3, 7, D(PINE));
      if (!u) c.rect(8, 13, 8, 15, IRON);
      else {
        c.set(8, 14, IRON);
        c.set(8, 16, C.blood);
        c.set(10, b - 2, IRON);
      }
    },
  });
  add('medieval-gallows-post', 'gallows gibbet hanging post noose rope scaffold trapdoor execution wooden', {
    w: 30, h: 54, solid: true,
    f(c, u) {
      const b = c.h - 2,
        py = b - 9;
      for (const x of [3, 14, 25]) c.rect(x, py + 3, x + 1, b, DOAK);
      c.line(5, b - 1, 13, py + 4, D(OAK));
      c.line(16, py + 4, 24, b - 1, D(OAK));
      post(c, 5, 7, 2, py, OAK);
      board(c, 5, 2, 25, 4, OAK); // the arm
      c.line(8, 14, 17, 5, DOAK);
      c.line(8, 15, 18, 5, D(DOAK));
      board(c, 1, py, 28, py + 2, PINE); // the platform
      planksV(c, 1, py + 1, 28, py + 2, D(PINE), 5);
      c.set(21, 4, IRON);
      if (!u) {
        rope(c, 21, 5, 21, 17);
        for (const [x, y] of [[20, 18], [19, 19], [19, 20], [19, 21], [20, 22], [21, 22], [22, 22], [23, 21], [23, 20], [23, 19], [22, 18]]) c.set(x, y, HEMP);
        dots(c, D(HEMP), [21, 16, 21, 17, 19, 20, 23, 20]);
        c.row(py + 1, 17, 25, D(PINE)); // the trap, shut
        c.set(17, py, IRON);
      } else {
        rope(c, 21, 5, 22, 27); // drawn out long and thin, still turning
        for (const [x, y] of [[21, 28], [21, 29], [21, 30], [21, 31], [22, 32], [23, 31], [23, 30], [23, 29], [23, 28]]) c.set(x, y, HEMP);
        dots(c, D(HEMP), [22, 26, 22, 27]);
        c.rect(17, py, 25, py + 2, SOOT); // the trap fallen open
        c.rect(17, py + 3, 18, py + 10, PINE);
        c.col(17, py + 3, py + 10, L(PINE));
        c.set(18, py + 10, IRON);
        c.rect(21, b - 1, 23, b, LEATHER); // one shoe below
        c.set(21, b - 2, LEATHER);
      }
    },
    sw: 16, sh: 54,
    s(c, u) {
      const b = c.h - 2,
        py = b - 9;
      for (const x of [2, 11]) c.rect(x, py + 3, x + 1, b, DOAK);
      c.line(4, b - 1, 10, py + 4, D(OAK));
      post(c, 6, 8, 5, py, OAK);
      c.rect(5, 2, 9, 4, OAK);
      c.row(2, 5, 9, L(OAK));
      c.rect(6, 3, 8, 3, DOAK);
      board(c, 1, py, 13, py + 2, PINE);
      planksV(c, 1, py + 1, 13, py + 2, D(PINE), 5);
      if (!u) {
        rope(c, 7, 5, 7, 17);
        for (const [x, y] of [[6, 18], [5, 19], [5, 20], [5, 21], [6, 22], [7, 22], [8, 22], [9, 21], [9, 20], [9, 19], [8, 18]]) c.set(x, y, HEMP);
        for (let y = 19; y <= 21; y++) for (let x = 6; x <= 8; x++) c.set(x, y, D(OAK));
        c.set(7, 16, D(HEMP));
      } else {
        rope(c, 7, 5, 7, 27);
        for (const [x, y] of [[6, 28], [6, 29], [6, 30], [6, 31], [7, 32], [8, 31], [8, 30], [8, 29], [8, 28]]) c.set(x, y, HEMP);
        for (let y = 28; y <= 31; y++) c.set(7, y, D(OAK));
        c.rect(4, py, 10, py + 1, SOOT);
        c.rect(4, py + 3, 10, py + 10, PINE);
        c.row(py + 3, 4, 10, L(PINE));
        planksV(c, 4, py + 4, 10, py + 10, D(PINE), 3);
        c.rect(5, b - 1, 6, b, LEATHER);
      }
    },
  });
  add('medieval-castle-well-iron-pulley', 'castle well stone ring iron arch pulley rope bucket courtyard water', {
    w: 26, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [4, 21]) c.col(x, 9, 24, IRON);
      for (const [x, y] of [[5, 8], [5, 7], [6, 6], [7, 5], [8, 4], [9, 4], [10, 3], [11, 3], [12, 3], [13, 3], [14, 3], [15, 3], [16, 4], [17, 4], [18, 5], [19, 6], [20, 7], [20, 8]]) c.set(x, y, IRON);
      dots(c, L(IRON), [7, 5, 10, 3, 4, 12, 4, 18]);
      c.set(12, 2, IRON); // a spike on top
      c.set(12, 1, L(IRON));
      c.oval(10, 5, 15, 10, DOAK); // the pulley
      c.oval(11, 6, 14, 9, OAK);
      c.set(12, 7, IRON);
      c.col(12, 4, 4, IRON);
      c.rect(2, 23, 23, 24, L(MSTONE)); // the rim
      c.row(24, 2, 23, MSTONE);
      stones(c, 3, 25, 22, b, MSTONE, 4, 6, 7);
      c.col(3, 25, b, L(MSTONE));
      dots(c, C.moss, [5, b, 6, b - 1, 18, b, 9, b, 20, 27]);
      const bucket = (x, y, full) => {
        c.rect(x, y, x + 5, y + 4, PINE);
        c.col(x, y, y + 4, L(PINE));
        c.row(y + 1, x, x + 5, IRON);
        c.row(y + 3, x, x + 5, IRON);
        if (full) c.row(y, x + 1, x + 4, WAT);
      };
      if (!u) {
        rope(c, 10, 8, 10, 22); // the bucket is down the shaft
        rope(c, 15, 8, 17, 22);
        c.set(17, 23, HEMP);
        c.set(18, 24, HEMP);
      } else {
        rope(c, 10, 8, 9, 16);
        rope(c, 15, 8, 17, 22);
        c.line(7, 16, 11, 16, IRON);
        c.set(6, 17, IRON);
        c.set(12, 17, IRON);
        bucket(6, 18, true);
        c.set(8, 17, C.bone); // and something came up with the water
        c.set(8, 16, C.bone);
        c.set(9, 15, C.bone);
        dots(c, WAT, [7, 24, 9, 25, 8, 27, 12, 23, 6, 26, 10, 29]);
        dots(c, L(WAT), [8, 24, 11, 22]);
      }
    },
    sw: 26, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      c.rect(12, 3, 13, 24, IRON);
      c.col(12, 3, 24, L(IRON));
      c.set(12, 2, IRON);
      c.set(12, 1, L(IRON));
      c.rect(11, 5, 14, 10, DOAK);
      c.col(11, 5, 10, OAK);
      c.rect(2, 23, 23, 24, L(MSTONE));
      c.row(24, 2, 23, MSTONE);
      stones(c, 3, 25, 22, b, MSTONE, 4, 6, 9);
      c.col(3, 25, b, L(MSTONE));
      dots(c, C.moss, [7, b, 15, b, 16, b - 1, 5, 28]);
      if (!u) {
        rope(c, 15, 9, 15, 22);
        rope(c, 10, 9, 8, 22);
        c.set(7, 23, HEMP);
      } else {
        rope(c, 15, 9, 17, 16);
        rope(c, 10, 9, 8, 22);
        c.rect(15, 18, 20, 22, PINE);
        c.col(15, 18, 22, L(PINE));
        c.row(19, 15, 20, IRON);
        c.row(21, 15, 20, IRON);
        c.row(18, 16, 19, WAT);
        c.line(16, 16, 19, 16, IRON);
        c.set(17, 17, C.bone);
        c.set(18, 16, C.bone);
        c.set(18, 15, C.bone);
        dots(c, WAT, [16, 24, 18, 25, 17, 27, 19, 29]);
      }
    },
  });
  add('medieval-market-cross-stone', 'market cross stone steps town square preaching cross monument proclamation', {
    w: 26, h: 48, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const steps = () => {
        for (const [x0, x1, y] of [[1, 24, b - 2], [4, 21, b - 5], [7, 18, b - 8]]) {
          c.rect(x0, y, x1, y + 2, MSTONE);
          c.row(y, x0, x1, L(MSTONE));
          c.row(y + 2, x0, x1, D(MSTONE));
          for (let x = x0 + 5; x < x1; x += 6) c.col(x, y + 1, y + 2, D(MSTONE));
        }
      };
      steps();
      c.rect(11, 11, 14, b - 9, MSTONE); // the shaft
      c.col(11, 11, b - 9, L(MSTONE));
      c.col(14, 11, b - 9, D(MSTONE));
      c.rect(10, 9, 15, 10, MSTONE);
      c.row(9, 10, 15, L(MSTONE));
      c.rect(11, 1, 14, 8, MSTONE); // the head
      c.rect(7, 3, 18, 6, MSTONE);
      c.row(3, 7, 18, L(MSTONE));
      c.col(11, 1, 2, L(MSTONE));
      c.row(6, 7, 18, D(MSTONE));
      c.rect(12, 4, 13, 5, D(MSTONE));
      dots(c, D(MSTONE), [12, 15, 13, 20, 12, 27, 13, 31]);
      dots(c, C.moss, [7, 4, 8, 3, 2, b - 2, 3, b - 1, 20, b - 5, 16, b - 8, 11, 12]);
      if (u) {
        c.rect(10, 18, 15, 25, C.parchment); // a proclamation nailed up
        c.row(18, 10, 15, L(C.parchment));
        for (const y of [20, 22]) c.row(y, 11, 14, D(C.parchment));
        c.set(12, 18, IRON);
        c.rect(13, 24, 14, 25, RED);
        c.set(15, 26, C.parchment);
        dots(c, C.blood, [9, b - 8, 10, b - 7, 10, b - 5, 11, b - 5, 11, b - 3, 12, b - 2, 9, b - 6]);
      }
    },
    sw: 26, sh: 48,
    s(c, u) {
      const b = c.h - 2;
      for (const [x0, x1, y] of [[1, 24, b - 2], [4, 21, b - 5], [7, 18, b - 8]]) {
        c.rect(x0, y, x1, y + 2, MSTONE);
        c.row(y, x0, x1, L(MSTONE));
        c.row(y + 2, x0, x1, D(MSTONE));
        for (let x = x0 + 3; x < x1; x += 6) c.col(x, y + 1, y + 2, D(MSTONE));
      }
      c.rect(11, 1, 14, b - 9, MSTONE);
      c.col(11, 1, b - 9, L(MSTONE));
      c.col(14, 1, b - 9, D(MSTONE));
      c.rect(10, 9, 15, 10, MSTONE);
      c.row(9, 10, 15, L(MSTONE));
      c.row(3, 11, 14, L(MSTONE));
      c.row(6, 11, 14, D(MSTONE));
      dots(c, D(MSTONE), [12, 17, 13, 24, 12, 30]);
      dots(c, C.moss, [22, b - 2, 5, b - 5, 9, b - 8, 12, 13]);
      if (u) {
        c.col(10, 18, 25, C.parchment);
        c.set(9, 26, C.parchment);
        dots(c, C.blood, [8, b - 8, 7, b - 6, 6, b - 5, 5, b - 3]);
      }
    },
  });
  void [K, hollow, straps, candle, STEEL];
};
