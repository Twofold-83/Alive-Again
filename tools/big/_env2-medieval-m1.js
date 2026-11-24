/* Medieval, part 1: the large things (siege engines, wagons, the stall) and the furniture of the great hall.
 * Part of tools/big/env2-medieval.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, legs, hollow, flame, fire, wisp, cloth, heap, planksV, planksH, stones, wheel, wheelEdge, chain, rope, candle, beam, post, straps, barrel, barrelEnd } = H;
  const add = H.reg('env-medieval', 'Medieval');
  const P = H.MED;
  const { OAK, DOAK, PINE, CANVAS, HEMP, HIDE, RED, BLUE, SOOT, LEATHER, PEWTER, SHROUD, LOAF, DEADF } = P;
  const IRON = C.iron,
    STEEL = C.steel,
    GOLD = C.gold;

  /* ---------- siege engines ---------- */
  add('medieval-trebuchet-siege', 'large trebuchet siege engine counterweight catapult sling wooden war machine castle', {
    w: 48, h: 32, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      const weight = (x, y) => {
        face(c, x, y, x + 9, y + 7, DOAK);
        straps(c, x, x + 9, [y + 2, y + 6]);
        dots(c, C.stone, [x + 2, y, x + 5, y, x + 7, y, x + 3, y - 1, x + 6, y - 1]);
      };
      if (u) weight(18, 15);
      board(c, 3, b - 2, 44, b - 1, OAK); // the sill
      c.rect(2, b, 6, b, DOAK);
      c.rect(41, b, 45, b, DOAK);
      beam(c, 14, b - 3, 22, 8, OAK, 2); // the trestle
      beam(c, 33, b - 3, 25, 8, OAK, 2);
      c.row(20, 19, 30, DOAK);
      c.row(21, 19, 30, D(DOAK));
      if (!u) {
        beam(c, 17, 2, 44, 25, PINE, 2); // the arm, hauled down
        c.set(17, 4, IRON);
        weight(12, 6);
        rope(c, 44, 26, 39, b - 3); // the sling lies in its trough with a stone
        c.rect(36, b - 4, 38, b - 3, C.stone);
        c.set(36, b - 4, L(C.stone));
        rope(c, 44, 24, 46, b - 3, D(HEMP));
      } else {
        c.rect(23, -13, 24, 8, PINE); // the arm, flung up
        c.col(23, -13, 8, L(PINE));
        c.rect(22, 9, 23, 14, PINE);
        rope(c, 25, -13, 28, -6);
        rope(c, 28, -5, 27, -1);
        c.set(27, 0, LEATHER);
        c.set(28, 0, LEATHER);
      }
      c.rect(22, 7, 25, 9, IRON); // the axle
      c.set(23, 8, L(IRON));
    },
    u: [0, 14, 0],
    sw: 28, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.line(6, 14, 3, b - 2, DOAK);
      c.line(21, 14, 24, b - 2, DOAK);
      post(c, 6, 7, 8, b - 2, OAK);
      post(c, 20, 21, 8, b - 2, OAK);
      board(c, 2, b - 1, 25, b, OAK);
      c.rect(13, u ? -13 : 3, 14, u ? 14 : 25, PINE);
      c.col(13, u ? -13 : 3, u ? 14 : 25, L(PINE));
      c.rect(5, 8, 22, 9, DOAK);
      c.row(8, 5, 22, IRON);
      const y = u ? 15 : 6;
      face(c, 9, y, 18, y + 7, DOAK);
      straps(c, 9, 18, [y + 2, y + 6]);
      dots(c, C.stone, [11, y, 14, y, 16, y, 12, y - 1, 15, y - 1]);
      if (!u) {
        c.rect(12, b - 3, 15, b - 2, C.stone);
        c.row(b - 3, 12, 14, L(C.stone));
        rope(c, 13, 26, 13, b - 4);
      } else rope(c, 15, -12, 16, -3);
    },
    su: [0, 14, 0],
  });
  add('medieval-mangonel-catapult', 'large catapult mangonel onager siege engine throwing arm stone wooden war machine', {
    w: 44, h: 26, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.line(26, 6, 36, 16, DOAK); // the brace
      c.line(27, 6, 37, 16, D(DOAK));
      post(c, 24, 25, 4, 17, OAK);
      c.rect(22, 3, 27, 5, CANVAS); // the padded bar
      c.row(3, 22, 27, L(CANVAS));
      dots(c, D(CANVAS), [23, 5, 26, 5]);
      board(c, 3, 17, 40, 19, OAK);
      c.rect(21, 15, 26, 18, HEMP); // the twisted skein
      dots(c, D(HEMP), [22, 15, 24, 16, 22, 17, 25, 18, 25, 15]);
      wheel(c, 9, b - 3, 3, DOAK);
      wheel(c, 35, b - 3, 3, DOAK);
      c.rect(2, 14, 5, 17, DOAK); // the winch
      c.set(3, 15, IRON);
      c.line(5, 13, 7, 11, IRON);
      if (!u) {
        beam(c, 6, 11, 23, 15, PINE, 2);
        c.rect(4, 10, 9, 11, IRON); // the cup and its stone
        c.oval(4, 6, 9, 10, C.stone);
        dots(c, L(C.stone), [5, 7, 6, 6]);
        c.set(8, 9, D(C.stone));
        rope(c, 5, 12, 4, 14);
      } else {
        c.rect(22, -4, 23, 15, PINE);
        c.col(22, -4, 15, L(PINE));
        c.rect(20, -6, 25, -5, IRON);
        c.set(20, -7, IRON);
        c.set(25, -7, IRON);
        rope(c, 6, 17, 12, 20);
        rope(c, 12, 20, 16, 16);
      }
    },
    u: [0, 8, 0],
    sw: 26, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 2, 4, b - 6, b, DOAK);
      wheelEdge(c, 21, 23, b - 6, b, DOAK);
      post(c, 6, 7, 4, 17, OAK);
      post(c, 18, 19, 4, 17, OAK);
      c.rect(5, 3, 20, 5, CANVAS);
      c.row(3, 5, 20, L(CANVAS));
      dots(c, D(CANVAS), [8, 5, 12, 5, 16, 5]);
      board(c, 3, 17, 22, 19, OAK);
      c.rect(8, 15, 17, 17, HEMP);
      dots(c, D(HEMP), [9, 15, 11, 16, 13, 15, 15, 16, 10, 17, 14, 17]);
      c.row(b - 3, 5, 20, DOAK);
      if (!u) {
        c.rect(12, 13, 13, 16, PINE);
        c.rect(10, 12, 15, 13, IRON);
        c.oval(10, 8, 15, 12, C.stone);
        dots(c, L(C.stone), [11, 9, 12, 8]);
      } else {
        c.rect(12, -4, 13, 16, PINE);
        c.col(12, -4, 16, L(PINE));
        c.rect(10, -6, 15, -5, IRON);
        c.set(10, -7, IRON);
        c.set(15, -7, IRON);
      }
    },
    su: [0, 8, 0],
  });
  add('medieval-siege-ram-roofed', 'large battering ram siege engine roofed penthouse hides wheels iron head castle gate', {
    w: 48, h: 28, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        d = u ? 5 : 0;
      c.rect(3, 3, 42, 8, HIDE); // the roof of raw hides
      c.row(2, 5, 40, L(HIDE));
      planksV(c, 3, 3, 42, 8, D(HIDE), 7);
      c.row(8, 3, 42, D(HIDE));
      dots(c, L(HIDE), [6, 5, 14, 4, 20, 6, 27, 4, 33, 6, 39, 5]);
      dots(c, RED, [12, 6, 30, 5]);
      for (const x of [6, 22, 38]) post(c, x, x + 1, 9, 19, OAK);
      board(c, 4, 19, 41, 21, OAK);
      chain(c, 12, 9, 12 + d, 13);
      chain(c, 31, 9, 31 + d, 13);
      c.rect(2 + d, 14, 41 + d, 16, PINE); // the ram
      c.row(14, 2 + d, 41 + d, L(PINE));
      c.row(16, 2 + d, 41 + d, D(PINE));
      c.col(12 + d, 14, 16, IRON);
      c.col(31 + d, 14, 16, IRON);
      c.rect(40 + d, 13, 44 + d, 17, IRON); // its iron head
      c.row(13, 40 + d, 44 + d, L(IRON));
      c.set(45 + d, 15, IRON);
      c.set(45 + d, 14, IRON);
      c.set(42 + d, 15, K);
      wheel(c, 10, b - 4, 4, DOAK);
      wheel(c, 36, b - 4, 4, DOAK);
      if (u) dots(c, PINE, [51, 11, 52, 14, 51, 18, 52, 20, 49, 10]);
      if (u) dots(c, C.stoneLight, [50, 12, 51, 16, 50, 20]);
    },
    u: [0, 0, 6],
    sw: 28, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.rect(6, 11, 21, 18, SOOT);
      c.poly([[13, 2], [14, 2], [25, 10], [2, 10]], HIDE);
      c.line(13, 2, 2, 10, L(HIDE));
      c.row(10, 2, 25, D(HIDE));
      dots(c, D(HIDE), [10, 7, 16, 6, 19, 9, 8, 9, 14, 4]);
      post(c, 4, 5, 11, 20, OAK);
      post(c, 22, 23, 11, 20, OAK);
      board(c, 3, 19, 24, 21, OAK);
      wheelEdge(c, 2, 4, b - 8, b, DOAK);
      wheelEdge(c, 23, 25, b - 8, b, DOAK);
      c.row(b - 4, 5, 22, DOAK);
      chain(c, 13, 11, 13, 12);
      if (!u) {
        c.oval(11, 12, 16, 17, IRON);
        c.oval(12, 13, 15, 16, L(IRON));
        c.rect(13, 14, 14, 15, IRON);
      } else {
        c.oval(8, 10, 19, 20, IRON);
        c.oval(9, 11, 18, 19, L(IRON));
        c.oval(11, 13, 16, 17, IRON);
        dots(c, K, [13, 15, 14, 15]);
        dots(c, C.stoneLight, [7, 9, 20, 9, 6, 15, 21, 16]);
      }
    },
  });

  /* ---------- wagons and carts ---------- */
  add('medieval-covered-wagon', 'large covered wagon canvas tilt cart four wheels merchant travel wain', {
    w: 46, h: 28, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(5, 3, 35, 13, CANVAS); // the tilt on its hoops
      c.row(2, 7, 33, CANVAS);
      c.col(4, 5, 13, CANVAS);
      c.col(36, 5, 13, CANVAS);
      c.row(2, 7, 33, L(CANVAS));
      c.row(3, 5, 35, L(CANVAS));
      for (const x of [10, 17, 24, 31]) c.col(x, 3, 13, D(CANVAS));
      dots(c, D(CANVAS), [7, 9, 13, 11, 21, 8, 28, 11, 34, 7]);
      if (u) {
        hollow(c, 7, 6, 34, 13, OAK); // the side rolled up: the load
        c.rect(5, 4, 35, 5, L(CANVAS));
        dots(c, D(CANVAS), [9, 5, 16, 5, 23, 5, 30, 5]);
        barrel(c, 8, 8, 13, 13, PINE);
        c.rect(15, 10, 22, 13, HEMP);
        c.rect(16, 8, 20, 9, HEMP);
        c.row(8, 16, 20, L(HEMP));
        dots(c, D(HEMP), [18, 11, 21, 12, 16, 12]);
        face(c, 25, 9, 32, 13, DOAK);
        straps(c, 25, 32, [11]);
        c.set(23, 7, IRON);
        c.set(23, 8, C.flameLight);
        c.set(23, 9, C.flame);
      }
      face(c, 3, 14, 37, 19, OAK);
      planksH(c, 3, 14, 37, 19, D(OAK), 3);
      for (const x of [3, 14, 26, 37]) c.col(x, 14, 19, IRON);
      c.rect(38, 12, 42, 13, PINE); // the driver's board
      c.line(38, 19, 42, 16, DOAK);
      c.line(38, 20, 45, b, DOAK);
      c.line(39, 20, 45, b - 1, D(DOAK));
      wheel(c, 11, b - 6, 6, PINE);
      wheel(c, 31, b - 5, 5, PINE);
    },
    sw: 26, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 1, 3, b - 12, b, PINE);
      wheelEdge(c, 22, 24, b - 12, b, PINE);
      c.row(b - 6, 4, 21, DOAK);
      H.archRd(c, 4, 2, 21, 13, CANVAS);
      for (let x = 6; x <= 19; x++) for (let y = 2; y < 8; y++) if (c.get(x, y) && !c.get(x, y - 1)) c.set(x, y, L(CANVAS));
      if (!u) {
        H.archRd(c, 6, 4, 19, 13, D(CANVAS));
        c.col(12, 4, 13, CANVAS);
        c.col(13, 4, 13, mix(CANVAS, 0.5));
        dots(c, HEMP, [12, 6, 13, 8, 12, 10, 13, 12]);
      } else {
        H.archRd(c, 6, 4, 19, 13, mix(OAK, 0.3));
        c.col(6, 7, 13, L(CANVAS));
        c.col(19, 7, 13, CANVAS);
        barrel(c, 7, 8, 11, 13, PINE);
        c.rect(13, 10, 18, 13, HEMP);
        c.row(10, 13, 18, L(HEMP));
        dots(c, D(HEMP), [15, 12, 17, 11]);
        c.set(12, 5, IRON);
        c.set(12, 6, C.flameLight);
        c.set(12, 7, C.flame);
      }
      face(c, 4, 14, 21, 19, OAK);
      planksH(c, 4, 14, 21, 19, D(OAK), 3);
      c.col(4, 14, 19, IRON);
      c.col(21, 14, 19, IRON);
      c.set(12, 16, IRON);
      c.set(13, 16, IRON);
    },
  });
  add('medieval-royal-carriage', 'large royal carriage coach king queen red gold crest wheels horse drawn', {
    w: 46, h: 30, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        ROY = C.wine;
      c.row(22, 8, 37, IRON);
      c.row(23, 12, 32, D(IRON));
      c.poly([[8, 6], [33, 6], [34, 16], [31, 21], [10, 21], [7, 16]], ROY);
      c.line(8, 6, 7, 16, L(ROY));
      c.rect(7, 4, 34, 5, DOAK); // the roof
      c.row(4, 7, 34, L(DOAK));
      c.rect(19, 2, 22, 3, GOLD); // a crown on top
      dots(c, L(GOLD), [19, 1, 21, 1, 22, 1]);
      c.row(6, 8, 33, GOLD);
      c.row(14, 7, 34, GOLD);
      c.row(20, 10, 31, D(ROY));
      for (const x of [10, 27]) {
        c.rect(x, 8, x + 4, 12, SOOT); // windows with their curtains
        c.col(x, 8, 12, D(RED));
        c.col(x + 4, 8, 12, D(RED));
        c.set(x + 2, 9, C.glass);
      }
      if (!u) {
        c.frame(17, 7, 24, 20, D(ROY)); // the door and its crest
        c.rect(19, 8, 22, 12, SOOT);
        c.set(20, 9, C.glass);
        c.rect(20, 16, 21, 17, GOLD);
        c.set(20, 18, GOLD);
        c.set(23, 14, L(GOLD));
      } else {
        hollow(c, 17, 7, 24, 20, ROY);
        c.rect(18, 15, 24, 17, C.plum); // the seat inside
        c.row(15, 18, 24, L(C.plum));
        c.rect(22, 9, 24, 14, D(C.plum));
        c.rect(25, 7, 26, 20, L(ROY)); // the door, edge on
        c.col(26, 7, 20, GOLD);
        c.rect(18, 22, 23, 23, IRON); // the step let down
        c.row(22, 18, 23, L(IRON));
      }
      c.rect(35, 11, 41, 13, DOAK); // the box
      c.row(11, 35, 41, LEATHER);
      c.col(35, 14, 20, DOAK);
      c.line(36, 20, 41, 18, DOAK);
      c.rect(36, 6, 37, 9, IRON); // a lamp
      c.set(36, 7, u ? C.flameLight : C.glass);
      c.set(37, 8, u ? C.flame : D(C.glass));
      c.line(38, b - 7, 45, b - 9, DOAK);
      wheel(c, 13, b - 6, 6, C.brass, DOAK);
      wheel(c, 31, b - 5, 5, C.brass, DOAK);
    },
    sw: 26, sh: 30,
    s(c, u) {
      const b = c.h - 2,
        ROY = C.wine;
      wheelEdge(c, 1, 3, b - 12, b, C.brass);
      wheelEdge(c, 22, 24, b - 12, b, C.brass);
      c.row(b - 6, 4, 21, IRON);
      c.rect(12, b - 9, 13, b - 4, DOAK);
      face(c, 5, 6, 20, 20, ROY);
      c.rect(4, 4, 21, 5, DOAK);
      c.row(4, 4, 21, L(DOAK));
      c.rect(11, 2, 14, 3, GOLD);
      dots(c, L(GOLD), [11, 1, 13, 1, 14, 1]);
      c.row(6, 5, 20, GOLD);
      c.rect(9, 8, 16, 11, SOOT);
      c.col(9, 8, 11, D(RED));
      c.col(16, 8, 11, D(RED));
      c.set(11, 9, C.glass);
      board(c, 4, 13, 21, 15, DOAK); // the box seat
      c.row(13, 6, 19, LEATHER);
      c.rect(6, 16, 19, 20, D(ROY));
      c.row(20, 5, 20, IRON);
      for (const x of [2, 22]) {
        c.rect(x, 8, x + 1, 11, IRON);
        c.set(x, 9, u ? C.flameLight : C.glass);
        c.set(x + 1, 10, u ? C.flame : D(C.glass));
      }
      if (u) {
        face(c, 24, 7, 27, 20, L(ROY));
        c.col(27, 7, 20, GOLD);
        c.rect(25, 9, 26, 12, SOOT);
        c.rect(22, 22, 25, 23, IRON);
      }
    },
    su: [0, 0, 4],
  });
  add('medieval-plague-cart', 'large plague cart tumbril two wheels dead bodies shrouds bell corpse cart', {
    w: 44, h: 24, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      if (u) {
        c.oval(5, 3, 30, 13, SHROUD); // the dead, sewn in their shrouds
        c.line(7, 8, 28, 7, D(SHROUD));
        c.line(10, 5, 26, 4, D(SHROUD));
        dots(c, D(SHROUD), [12, 10, 18, 9, 24, 10, 15, 6, 21, 6]);
        dots(c, L(SHROUD), [9, 5, 14, 4, 20, 3]);
        c.rect(30, 8, 33, 9, DEADF); // feet
        c.set(33, 7, DEADF);
        c.rect(30, 5, 32, 5, DEADF);
      } else {
        c.rect(8, 10, 17, 11, SHROUD); // a folded shroud, waiting
        c.row(10, 8, 17, L(SHROUD));
      }
      for (const x of [4, 12, 22, 30]) c.col(x, 6, 12, DOAK);
      c.row(6, 4, 30, OAK);
      c.row(9, 4, 30, D(OAK));
      board(c, 3, 12, 31, 14, OAK);
      beam(c, 31, 13, 43, b - 1, OAK, 2); // the shafts rest on the ground
      c.col(6, 15, b, DOAK);
      c.col(3, 1, 6, DOAK); // the bell on its pole
      c.set(2, 1, DOAK);
      c.rect(1, 2, 2, 3, C.brass);
      c.set(1, 4, D(C.brass));
      wheel(c, 18, b - 6, 6, PINE);
      if (u) {
        c.col(14, 9, 13, DEADF); // an arm hangs over the side
        c.set(13, 14, DEADF);
        c.set(14, 14, D(DEADF));
        dots(c, K, [17, 1, 24, 2, 27, 0]);
      }
    },
    u: [0, 2, 0],
    sw: 24, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      if (u) {
        c.oval(5, 1, 18, 9, SHROUD);
        dots(c, D(SHROUD), [8, 4, 12, 3, 15, 5, 10, 6, 7, 6]);
        dots(c, L(SHROUD), [8, 2, 12, 1]);
      }
      wheelEdge(c, 2, 4, b - 12, b, PINE);
      wheelEdge(c, 19, 21, b - 12, b, PINE);
      c.row(b - 6, 5, 18, DOAK);
      face(c, 5, 7, 18, 14, OAK);
      planksH(c, 5, 7, 18, 14, D(OAK), 3);
      c.col(5, 5, 14, DOAK);
      c.col(18, 5, 14, DOAK);
      c.col(11, 15, b, DOAK);
      c.col(6, 0, 5, DOAK);
      c.rect(7, 1, 8, 2, C.brass);
      c.set(8, 3, D(C.brass));
      if (u) {
        c.rect(8, 7, 9, 9, DEADF); // the soles of two pairs of feet
        c.rect(11, 7, 12, 8, DEADF);
        c.rect(14, 6, 15, 8, DEADF);
        dots(c, D(DEADF), [8, 9, 14, 8]);
        dots(c, K, [12, -1, 16, 0]);
      }
    },
    su: [0, 2, 0],
  });
  add('medieval-market-stall-striped', 'large market stall striped awning counter bread fish cabbages trader booth', {
    w: 44, h: 32, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      post(c, 3, 4, 9, b, OAK);
      post(c, 39, 40, 9, b, OAK);
      c.row(10, 5, 38, DOAK); // the pole the wares hang from
      for (let x = 1; x <= 42; x++) {
        const s = ((x - 1) >> 2) % 2 ? CANVAS : RED;
        c.col(x, 3, 8, s);
        c.set(x, 3, L(s));
        if ((x - 1) % 4 < 3) c.set(x, 9, D(s));
      }
      c.row(2, 2, 41, DOAK);
      board(c, 2, 17, 41, 18, PINE);
      face(c, 3, 19, 40, 26, OAK);
      planksV(c, 3, 20, 40, 26, D(OAK), 5);
      c.rect(3, 27, 4, b, DOAK);
      c.rect(39, 27, 40, b, DOAK);
      if (!u) {
        for (const x of [6, 10]) {
          c.oval(x, 14, x + 4, 16, LOAF); // loaves
          c.row(14, x + 1, x + 3, L(LOAF));
        }
        c.oval(8, 12, 12, 14, LOAF);
        c.rect(16, 14, 23, 16, HEMP); // a basket of fish
        c.row(14, 16, 23, L(HEMP));
        dots(c, D(HEMP), [17, 15, 19, 16, 21, 15, 23, 16]);
        c.row(13, 16, 22, STEEL);
        c.row(12, 18, 23, L(STEEL));
        dots(c, K, [17, 13, 19, 12]);
        for (const x of [30, 34]) {
          c.oval(x, 13, x + 4, 16, C.leafLight); // cabbages
          c.set(x + 1, 14, L(C.leafLight));
          c.set(x + 3, 15, C.leaf);
        }
        c.rect(26, 15, 28, 16, C.mustard);
        for (const x of [25, 28]) {
          c.col(x, 11, 14, DEADF); // two hares hung by the heels
          c.set(x, 15, D(DEADF));
          c.set(x + 1, 13, DEADF);
        }
      } else {
        for (let x = 21; x <= 28; x++) c.clear(x, 9); // the awning slashed, the wares gone
        c.clearRect(23, 6, 26, 8);
        c.set(24, 5, null);
        c.clear(24, 5);
        c.col(27, 9, 13, RED);
        c.col(28, 9, 12, D(RED));
        c.col(22, 9, 11, CANVAS);
        dots(c, LOAF, [7, 16, 12, 16]);
        c.row(16, 18, 20, STEEL);
        c.set(18, 16, K);
        dots(c, C.leaf, [31, 16, 35, 16, 33, 16]);
        c.rect(30, b - 3, 36, b, HEMP); // the basket kicked over
        c.col(36, b - 3, b, D(HEMP));
        c.col(30, b - 3, b, L(HEMP));
        dots(c, D(HEMP), [32, b - 2, 34, b - 1, 33, b - 3]);
        dots(c, C.leafLight, [27, b, 28, b - 1]);
        dots(c, C.blood, [14, 18, 15, 18, 14, 19, 14, 21]);
      }
    },
    sw: 22, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      post(c, 4, 5, 11, b, OAK);
      post(c, 16, 17, 5, b, OAK);
      c.poly([[2, 9], [18, 2], [19, 3], [19, 5], [3, 12], [2, 11]], RED);
      c.line(2, 9, 18, 2, L(RED));
      c.line(3, 12, 19, 5, D(RED));
      c.set(2, 12, CANVAS);
      board(c, 3, 17, 18, 18, PINE);
      face(c, 5, 19, 16, 26, OAK);
      c.rect(5, 27, 6, b, DOAK);
      c.rect(15, 27, 16, b, DOAK);
      if (!u) {
        c.oval(5, 14, 9, 16, LOAF);
        c.row(14, 6, 8, L(LOAF));
        c.oval(11, 13, 15, 16, C.leafLight);
        c.set(12, 14, L(C.leafLight));
        c.col(8, 12, 13, DEADF);
      } else {
        c.col(2, 12, 16, RED);
        c.set(3, 13, D(RED));
        dots(c, LOAF, [7, 16]);
        dots(c, C.leaf, [13, 16]);
        c.rect(-4, b - 3, 1, b, HEMP);
        c.col(-4, b - 3, b, L(HEMP));
        dots(c, D(HEMP), [-2, b - 2, 0, b - 1]);
        c.set(2, b, C.leafLight);
      }
    },
    su: [5, 0, 0],
  });

  /* ---------- the great hall ---------- */
  add('medieval-great-hall-table', 'great hall table long trestle feast banquet oak goblets roast candle', {
    w: 44, h: 18, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (const x of [7, 35]) {
        c.line(x, 10, x - 2, b, DOAK); // trestles
        c.line(x + 1, 10, x + 3, b, DOAK);
        c.line(x, 10, x - 1, b, OAK);
      }
      c.row(13, 6, 37, D(OAK));
      board(c, 1, 8, 42, 9, OAK);
      c.rect(21, 6, 23, 7, PEWTER); // candlestick
      candle(c, 22, 5, u ? 2 : 4, u);
      c.rect(29, 4, 30, 7, PEWTER); // jug
      c.set(31, 5, PEWTER);
      c.set(29, 4, L(PEWTER));
      c.row(7, 6, 14, PEWTER); // the great dish
      if (!u) {
        c.oval(7, 4, 13, 7, hex('#7a4a2c')); // a roast
        dots(c, L(hex('#7a4a2c')), [8, 5, 10, 4]);
        c.set(14, 5, C.bone);
        c.rect(16, 6, 17, 7, PEWTER);
        c.rect(26, 6, 27, 7, PEWTER);
        c.oval(34, 5, 38, 7, LOAF);
        c.row(5, 35, 37, L(LOAF));
        c.rect(40, 6, 41, 7, PEWTER);
      } else {
        dots(c, C.bone, [7, 6, 8, 6, 9, 6, 11, 6, 12, 5, 13, 6]); // bones
        c.set(10, 6, D(C.bone));
        c.rect(16, 6, 17, 7, PEWTER);
        c.rect(25, 7, 27, 7, PEWTER); // a cup on its side, the wine running off the board
        c.set(27, 6, PEWTER);
        c.row(8, 24, 28, C.wine);
        c.col(24, 9, 11, C.wine);
        c.set(24, 13, C.wine);
        dots(c, C.wine, [23, b, 25, b]);
        dots(c, LOAF, [35, 7, 37, 7]);
        c.line(39, 7, 41, 4, STEEL); // a knife left standing in the oak
        c.set(41, 3, DOAK);
      }
    },
    sw: 16, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      c.line(5, 10, 2, b, OAK);
      c.line(10, 10, 13, b, DOAK);
      c.line(6, 10, 3, b, DOAK);
      c.row(13, 5, 10, D(OAK));
      board(c, 1, 8, 14, 9, OAK);
      c.rect(6, 6, 8, 7, PEWTER);
      candle(c, 7, 5, u ? 2 : 4, u);
      c.rect(11, 6, 12, 7, PEWTER);
      if (!u) {
        c.oval(2, 5, 5, 7, hex('#7a4a2c'));
        c.set(3, 5, L(hex('#7a4a2c')));
      } else {
        dots(c, C.bone, [2, 7, 3, 6, 4, 7]);
        c.row(8, 9, 12, C.wine);
        c.col(12, 9, 11, C.wine);
        c.set(12, 13, C.wine);
      }
    },
  });
  add('medieval-throne-carved', 'throne carved oak royal seat king red velvet gold crown high back', {
    w: 20, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 4, 4, 15, 24, OAK); // the high back
      c.poly([[4, 4], [9, 1], [10, 1], [15, 4]], OAK);
      c.line(4, 4, 9, 1, L(OAK));
      c.col(3, 2, 24, DOAK);
      c.col(16, 2, 24, DOAK);
      c.set(3, 1, GOLD);
      c.set(16, 1, GOLD);
      c.rect(6, 6, 13, 21, RED); // velvet
      c.row(6, 6, 13, D(RED));
      c.col(6, 6, 21, D(RED));
      c.rect(9, 9, 10, 10, GOLD);
      dots(c, GOLD, [8, 8, 11, 8, 9, 11, 10, 11, 9, 3, 10, 3]);
      for (const x of [1, 16]) {
        c.rect(x, 19, x + 2, 20, OAK); // arms
        c.row(19, x, x + 2, L(OAK));
        c.rect(x + (x < 8 ? 0 : 1), 21, x + (x < 8 ? 1 : 2), 25, DOAK);
        c.set(x + (x < 8 ? 0 : 2), 18, GOLD);
      }
      c.rect(3, 23, 16, 25, RED); // the cushion
      c.row(23, 3, 16, L(RED));
      c.row(25, 3, 16, D(RED));
      face(c, 2, 26, 17, b - 2, OAK);
      panel(c, 4, 28, 15, b - 4, OAK);
      dots(c, DOAK, [7, 30, 9, 31, 11, 30, 13, 31, 6, 31]);
      board(c, 1, b - 1, 18, b, DOAK);
      if (u) {
        dots(c, C.blood, [8, 12, 9, 12, 10, 12, 11, 13, 9, 13, 10, 13, 10, 14, 9, 15, 10, 16, 10, 18, 9, 20, 7, 24, 8, 24, 9, 23, 10, 24, 9, 25]);
        dots(c, D(C.blood), [9, 14, 10, 15, 8, 23]);
        c.rect(11, 21, 14, 22, GOLD); // the crown left on the seat
        dots(c, L(GOLD), [11, 20, 13, 20, 14, 20]);
        c.set(12, 22, RED);
        dots(c, C.blood, [8, 27, 8, 29]);
      }
    },
    sw: 14, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      post(c, 2, 4, 2, b - 2, OAK);
      c.set(3, 1, GOLD);
      c.col(5, 6, 22, RED);
      c.rect(2, 23, 11, 25, RED);
      c.row(23, 5, 11, L(RED));
      c.row(25, 2, 11, D(RED));
      c.rect(5, 19, 11, 20, OAK);
      c.row(19, 5, 11, L(OAK));
      c.set(11, 18, GOLD);
      c.rect(9, 21, 10, 22, DOAK);
      face(c, 2, 26, 11, b - 2, OAK);
      panel(c, 5, 28, 9, b - 4, OAK);
      board(c, 1, b - 1, 12, b, DOAK);
      if (u) {
        c.rect(6, 21, 9, 22, GOLD);
        dots(c, L(GOLD), [6, 20, 8, 20, 9, 20]);
        dots(c, C.blood, [5, 13, 5, 15, 5, 18, 10, 24, 11, 25, 11, 27, 11, 29]);
      }
    },
  });
  add('medieval-weapon-rack-polearms', 'weapon rack halberd spear sword mace armoury guard room wooden stand', {
    w: 26, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 2, 3, 8, b, OAK);
      post(c, 22, 23, 8, b, OAK);
      board(c, 1, b - 1, 5, b, DOAK);
      board(c, 20, b - 1, 24, b, DOAK);
      board(c, 2, 10, 23, 11, OAK);
      board(c, 2, 25, 23, 26, OAK);
      c.row(b - 3, 4, 21, DOAK);
      const slot = (x) => c.set(x, 10, SOOT);
      for (const x of [6, 10, 14, 18]) slot(x);
      if (!u) {
        c.col(6, 3, b - 3, PINE); // halberd
        c.rect(5, 3, 8, 6, STEEL);
        c.set(6, 1, STEEL);
        c.set(6, 2, L(STEEL));
        c.set(8, 3, null);
        c.set(4, 5, STEEL);
        c.col(8, 4, 5, L(STEEL));
        c.col(14, 12, 24, L(STEEL)); // sword
        c.col(14, 6, 9, LEATHER);
        c.row(10, 12, 16, GOLD);
        c.set(14, 5, GOLD);
        c.set(14, 24, STEEL);
      } else {
        c.line(12, b - 4, 16, b, LEATHER); // a belt dropped where the sword stood
        c.set(15, b, GOLD);
        dots(c, C.blood, [7, 26, 7, 28, 6, b - 3]);
      }
      c.col(10, 4, b - 3, PINE); // spear
      c.col(10, 1, 3, STEEL);
      c.set(10, 1, L(STEEL));
      c.set(9, 3, STEEL);
      c.set(11, 3, STEEL);
      c.col(18, 7, b - 3, DOAK); // mace
      c.rect(17, 3, 19, 6, IRON);
      dots(c, L(IRON), [17, 3, 16, 4, 20, 5, 18, 2]);
    },
    sw: 12, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      post(c, 4, 5, 8, b, OAK);
      board(c, 1, b - 1, 9, b, DOAK);
      c.line(2, b - 2, 4, b - 5, DOAK);
      c.line(8, b - 2, 6, b - 5, DOAK);
      c.rect(3, 10, 7, 11, OAK);
      c.rect(3, 25, 7, 26, OAK);
      c.line(8, b - 3, 7, 4, PINE);
      c.col(7, 1, 3, STEEL);
      c.set(7, 1, L(STEEL));
      c.rect(8, 4, 9, 6, IRON);
      if (!u) {
        c.line(8, b - 3, 6, 3, PINE);
        c.rect(5, 3, 7, 6, STEEL);
        c.set(6, 2, L(STEEL));
        c.set(4, 5, STEEL);
        c.col(9, 12, 24, L(STEEL));
        c.col(9, 6, 9, LEATHER);
        c.row(10, 8, 10, GOLD);
      } else {
        c.line(8, b - 3, 10, b, LEATHER);
        dots(c, C.blood, [6, 27, 6, b - 3]);
      }
    },
  });
  add('medieval-armour-stand-plate', 'armour stand suit of plate armor helmet breastplate knight steel wooden dummy', {
    w: 16, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(7, 6, 8, b - 1, OAK); // the pole and its foot
      c.col(7, 6, b - 1, L(OAK));
      board(c, 3, b - 1, 12, b, DOAK);
      c.line(4, b - 2, 6, b - 5, DOAK);
      c.line(11, b - 2, 9, b - 5, DOAK);
      if (!u) {
        c.rect(5, 2, 10, 8, STEEL); // great helm
        c.row(1, 6, 9, STEEL);
        c.row(1, 6, 9, L(STEEL));
        c.col(5, 2, 8, L(STEEL));
        c.row(5, 6, 9, K);
        c.col(8, 2, 8, D(STEEL));
        dots(c, K, [7, 7, 9, 7]);
        c.rect(4, 10, 11, 19, STEEL); // breastplate
        c.col(4, 10, 19, L(STEEL));
        c.line(7, 11, 7, 18, L(STEEL));
        c.col(8, 10, 19, D(STEEL));
        c.row(9, 5, 10, IRON);
        c.rect(1, 10, 3, 12, STEEL); // pauldrons
        c.rect(12, 10, 14, 12, STEEL);
        c.row(10, 1, 3, L(STEEL));
        c.row(10, 12, 14, L(STEEL));
        c.rect(2, 13, 3, 20, IRON); // mail sleeves, gauntlets
        c.rect(12, 13, 13, 20, IRON);
        dots(c, L(IRON), [2, 14, 3, 16, 2, 18, 12, 15, 13, 17, 12, 19]);
        c.rect(2, 21, 3, 22, STEEL);
        c.rect(12, 21, 13, 22, STEEL);
        c.row(20, 4, 11, LEATHER); // belt and tassets
        c.set(8, 20, GOLD);
        c.rect(4, 21, 11, 24, STEEL);
        c.col(7, 21, 24, K);
        c.row(24, 4, 11, D(STEEL));
        c.col(4, 21, 24, L(STEEL));
      } else {
        c.oval(6, 2, 9, 6, PINE); // the bare wooden head and yoke
        c.set(7, 3, L(PINE));
        board(c, 2, 10, 13, 11, OAK);
        c.set(2, 12, DOAK);
        c.set(13, 12, DOAK);
        c.rect(6, 13, 9, 14, IRON); // a scrap of mail left on the peg
        dots(c, L(IRON), [6, 13, 8, 14]);
        c.set(7, 15, IRON);
      }
    },
    sw: 12, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      c.rect(5, 6, 6, b - 1, OAK);
      c.col(5, 6, b - 1, L(OAK));
      board(c, 2, b - 1, 9, b, DOAK);
      c.line(3, b - 2, 4, b - 5, DOAK);
      c.line(8, b - 2, 7, b - 5, DOAK);
      if (!u) {
        c.rect(3, 2, 8, 8, STEEL);
        c.row(1, 4, 7, L(STEEL));
        c.col(3, 2, 8, L(STEEL));
        c.rect(7, 5, 8, 5, K);
        c.set(9, 6, STEEL);
        c.set(9, 7, STEEL);
        c.set(8, 7, K);
        c.rect(3, 10, 8, 19, STEEL);
        c.col(9, 12, 17, STEEL);
        c.col(3, 10, 19, L(STEEL));
        c.row(9, 4, 7, IRON);
        c.rect(4, 10, 7, 12, STEEL);
        c.row(10, 4, 7, L(STEEL));
        c.rect(5, 13, 6, 20, IRON);
        dots(c, L(IRON), [5, 14, 6, 16, 5, 18]);
        c.rect(5, 21, 6, 22, STEEL);
        c.row(20, 3, 8, LEATHER);
        c.rect(3, 21, 8, 24, STEEL);
        c.row(24, 3, 8, D(STEEL));
      } else {
        c.oval(4, 2, 7, 6, PINE);
        c.set(5, 3, L(PINE));
        c.rect(4, 10, 7, 11, OAK);
        c.rect(5, 13, 7, 14, IRON);
        c.set(6, 15, IRON);
      }
    },
  });
  void [K, mix, blend, rnd, legs, flame, fire, wisp, cloth, heap, stones, barrelEnd];
};
