/* Rural, part 4: the muck heap and the loft ladder, walls and hurdles, tack and feed, edged tools, things
 * out on the land. Part of tools/big/env2-country.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { P, D, L, dots, board, face, panel, post, legs, planksV, planksH, boards, boardsH, hollow, pane, flame, fire, wisp, bush, stones, rubble, bricks } = H;
  const { wheel, tyre, tyreEdge, barrel, sack, crate, hay, heap, blood, puddle, drip, shards, grass, crow, rope, chain, lantern, shape } = H;
  const add = H.reg('env-rural', 'Rural');
  const { OAK, GREYW, PALEW, TAR, HAY, BRICK, LIME, STONE, SOIL, MUD, SOOT, TIN, ZINC, WAT, MILK, ROPE, SACK, TYRE, FRED, FGREEN, FBLUE, FYELLOW, LAMP } = P;
  const DUNG = hex('#4a3a2a'),
    LEATHER = hex('#5a3a28'),
    GRAIN = hex('#b09648'),
    WOOLC = hex('#b0a890'),
    CROWK = hex('#18161c');
  const rust = (c, x0, y0, x1, y1, seed = 1, n = 9) => c.speckle(x0, y0, x1, y1, C.rust, n, seed);

  /* ---------- the yard ---------- */
  add('rural-manure-heap-fork', 'manure heap dung heap muck straw fork steaming farm yard', {
    w: 34, h: 20, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      heap(c, 2, 31, b, u ? 9 : 11, DUNG, 3);
      dots(c, HAY, [6, b - 3, 10, b - 7, 14, b - 5, 19, b - 8, 23, b - 4, 27, b - 2, 12, b - 1, 21, b - 1, 17, b - 3]);
      dots(c, mix(DUNG, 0.7), [8, b - 4, 16, b - 7, 24, b - 6, 20, b - 2]);
      if (!u) {
        c.line(24, b - 8, 28, 1, PALEW); // the fork standing in it
        dots(c, C.iron, [23, b - 7, 24, b - 6, 25, b - 6, 23, b - 9]);
        wisp(c, 12, b - 11, 3, C.ghost);
      } else {
        c.rect(11, b - 8, 21, b - 5, mix(DUNG, 0.5)); // forked open: ribs
        for (const x of [12, 14, 16, 18, 20]) c.col(x, b - 8, b - 6, C.bone);
        c.row(b - 9, 12, 20, C.bone);
        c.rect(8, b - 9, 10, b - 7, C.bone); // and a long skull
        c.set(9, b - 8, SOOT);
        c.line(3, b, 0, b - 12, PALEW); // the fork thrown down
        dots(c, C.iron, [3, b - 1, 4, b, 2, b]);
        wisp(c, 23, b - 9, 4, C.ghost);
        dots(c, SOOT, [14, b - 12, 18, b - 13, 21, b - 11, 9, b - 12]);
      }
    },
    sw: 20, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      heap(c, 2, 17, b, u ? 9 : 11, DUNG, 5);
      dots(c, HAY, [5, b - 3, 9, b - 7, 13, b - 4, 11, b - 1]);
      if (!u) {
        c.col(10, 1, b - 9, PALEW);
        dots(c, C.iron, [9, b - 8, 11, b - 8, 10, b - 7]);
      } else {
        c.rect(6, b - 8, 12, b - 5, mix(DUNG, 0.5));
        for (const x of [7, 9, 11]) c.col(x, b - 8, b - 6, C.bone);
        wisp(c, 14, b - 8, 4, C.ghost);
        dots(c, SOOT, [8, b - 12, 12, b - 11]);
      }
    },
  });

  add('rural-loft-ladder', 'hay loft ladder wooden ladder barn rungs leaning', {
    w: 14, h: 50, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 2, 1, b, PALEW);
      post(c, 10, 1, b, PALEW);
      for (let y = 5, i = 0; y < b; y += 5, i++) {
        if (u && (i === 2 || i === 3)) {
          if (i === 2) c.line(4, y, 6, y + 3, GREYW); // two rungs gone through
          else c.line(9, y, 8, y + 2, GREYW);
          continue;
        }
        c.rect(4, y, 9, y, GREYW);
        c.set(4, y, L(GREYW));
      }
      c.rect(2, 1, 3, 1, C.iron);
      c.rect(10, 1, 11, 1, C.iron);
      if (u) {
        dots(c, GREYW, [6, b, 8, b - 1]);
        blood(c, [5, b, 7, b, 6, b - 1, 10, 22, 10, 24]);
        dots(c, HAY, [3, 6, 9, 3, 6, 12]);
      } else dots(c, HAY, [1, b, 12, b]);
    },
    sw: 16, sh: 50,
    s(c, u) {
      const b = c.h - 2;
      c.line(3, b, 12, 1, PALEW);
      c.line(4, b, 13, 1, D(PALEW));
      for (let y = 5, i = 0; y < b; y += 5, i++) {
        if (u && (i === 2 || i === 3)) continue;
        const x = Math.round(3 + ((b - y) / (b - 1)) * 9);
        c.set(x - 1, y, GREYW);
      }
      c.set(13, 1, C.iron);
      if (u) {
        blood(c, [5, b, 6, b, 2, b]);
        dots(c, GREYW, [7, b, 8, b - 1]);
      }
    },
  });

  const vane = (c, u, edge) => {
    const b = c.h - 2,
      IR = hex('#3a3a44');
    c.rect(9, 9, 10, b, IR);
    c.col(9, 9, b, C.iron);
    c.rect(8, b - 1, 11, b, IR);
    if (!edge) {
      c.row(14, 3, 16, IR); // the points of the compass
      dots(c, C.brass, [2, 14, 17, 14]);
    } else {
      c.rect(9, 14, 10, 14, C.brass);
      c.set(8, 14, IR);
      c.set(11, 14, IR);
    }
    c.rect(9, 12, 10, 12, C.brass);
    const f = u ? -1 : 1,
      X = (x) => 9.5 + (x - 9.5) * f;
    if (edge && !u) {
      c.rect(9, 2, 10, 8, IR); // the cock, edge on
      c.set(9, 1, FRED);
    } else {
      // the arrow and the cock on it
      const S = (x, y, col) => c.set(Math.round(X(x)), y, col);
      for (let x = 2; x <= 17; x++) S(x, 9, IR);
      S(1, 9, C.iron);
      S(3, 8, IR);
      S(3, 10, IR);
      for (const [x, y] of [[16, 8], [17, 8], [16, 10], [17, 10], [17, 7], [17, 11]]) S(x, y, IR);
      for (let x = 8; x <= 11; x++) for (let y = 5; y <= 7; y++) S(x, y, IR);
      S(10, 8, IR);
      for (let y = 3; y <= 5; y++) S(7, y, IR);
      S(6, 3, C.brass);
      S(7, 2, FRED);
      S(7, 5, FRED);
      for (let y = 3; y <= 6; y++) S(12, y, IR);
      S(13, 2, IR);
      S(13, 3, IR);
      S(14, 2, IR);
      S(9, 6, C.rust);
      S(15, 9, C.rust);
    }
    if (u) {
      dots(c, C.bone, edge ? [5, 6, 14, 4] : [2, 5, 18, 4, 3, 2]); // it has swung round against the wind
      if (!edge) crow(c, 12, 14, true);
    }
    grass(c, [6, 13], b);
  };
  add('rural-weather-vane-post', 'weather vane on a post iron cockerel arrow wind compass farm', {
    w: 20, h: 38, solid: true,
    f: (c, u) => vane(c, u, false),
    sw: 20, sh: 38,
    s: (c, u) => vane(c, u, true),
  });

  add('rural-dry-stone-wall', 'dry stone wall field wall rubble cope stones moss boundary', {
    w: 38, h: 18, solid: true,
    f(c, u) {
      const b = c.h - 2;
      rubble(c, 1, 5, 36, b, STONE, 3);
      for (let x = 1; x <= 36; x += 3) {
        c.rect(x, 2, x + 1, 4, x % 2 ? STONE : D(STONE)); // the cope, stones on edge
        c.set(x, 2, L(STONE));
      }
      dots(c, C.moss, [3, 6, 4, 6, 12, 9, 22, 5, 30, 8, 31, 8, 8, b, 26, b]);
      if (u) {
        c.clearRect(15, 2, 23, 9); // a gap pushed through from the far side
        c.clearRect(16, 10, 22, 11);
        c.set(15, 9, STONE);
        c.set(23, 8, STONE);
        for (const [x, y] of [[13, b], [16, b - 1], [19, b], [22, b - 1], [25, b], [18, b - 2], [21, b - 3]]) {
          c.rect(x, y - 1, x + 2, y, STONE);
          c.set(x, y - 1, L(STONE));
          c.set(x + 2, y, D(STONE));
        }
        dots(c, WOOLC, [14, 8, 24, 7, 23, 9]);
        blood(c, [15, 10, 24, 10]);
      }
      grass(c, [0, 10, 28, 37], b);
    },
    sw: 12, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[3, 5], [8, 5], [10, b], [1, b]], STONE);
      for (let y = 7; y < b; y += 3) c.row(y, 2, 9, D(STONE));
      c.line(3, 5, 1, b, L(STONE));
      dots(c, D(STONE), [5, 6, 6, 9, 4, 12, 7, 13]);
      c.rect(4, 2, 7, 4, STONE);
      c.row(2, 4, 7, L(STONE));
      dots(c, C.moss, [3, 8, 8, 11, 2, b]);
      if (u) {
        c.rect(0, b - 1, 2, b, STONE);
        c.rect(9, b - 2, 11, b, STONE);
        c.set(9, b - 2, L(STONE));
        dots(c, WOOLC, [8, 5, 9, 6]);
      }
    },
  });

  add('rural-sheep-hurdles', 'sheep hurdles lambing pen wooden hurdle fence panels twine', {
    w: 34, h: 16, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const hurdle = (x0, x1) => {
        for (const y of [4, 7, 10]) c.row(y, x0, x1, PALEW);
        c.col(x0, 2, b, GREYW);
        c.col(x1, 2, b, D(GREYW));
        c.line(x0 + 1, 10, (x0 + x1) >> 1, 4, D(PALEW));
        c.line(x1 - 1, 10, (x0 + x1) >> 1, 4, D(PALEW));
      };
      hurdle(1, 15);
      dots(c, hex('#5f6a8a'), [15, 5, 16, 5, 16, 9]); // baler twine
      if (!u) hurdle(17, 32);
      else {
        for (const y of [b - 4, b - 2, b]) c.row(y, 17, 32, PALEW); // one flat in the mud
        c.col(17, b - 5, b, GREYW);
        c.col(32, b - 5, b, D(GREYW));
        dots(c, WOOLC, [20, b - 5, 21, b - 6, 22, b - 5, 27, b - 3, 13, 7, 14, 8]);
        blood(c, [24, b - 3, 25, b - 1, 26, b - 3, 29, b]);
        dots(c, MUD, [19, b - 1, 23, b - 1, 30, b - 1]);
      }
      grass(c, [4, 12], b);
    },
    sw: 6, sh: 16,
    s(c, u) {
      const b = c.h - 2;
      post(c, 2, 2, b, GREYW);
      dots(c, PALEW, [2, 4, 2, 7, 2, 10]);
      if (u) {
        c.rect(0, b - 1, 1, b, PALEW);
        c.rect(4, b - 1, 5, b, PALEW);
        c.set(4, 7, WOOLC);
      }
    },
  });

  /* ---------- tack and feed ---------- */
  add('rural-saddle-rack', 'saddle on a rack saddle horse leather stirrup bridle tack room', {
    w: 24, h: 26, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.line(6, 12, 3, b, OAK);
      c.line(7, 12, 5, b, D(OAK));
      c.line(17, 12, 20, b, OAK);
      c.line(16, 12, 18, b, D(OAK));
      board(c, 3, 10, 20, 11, OAK);
      c.row(18, 5, 18, D(OAK));
      c.rect(5, 8, 18, 9, hex('#6a2c34')); // the blanket
      c.rect(6, 10, 9, 13, hex('#6a2c34'));
      c.col(7, 10, 13, hex('#4a1c24'));
      if (!u) {
        c.rect(6, 5, 17, 8, LEATHER); // the saddle
        c.rect(5, 3, 7, 6, LEATHER);
        c.rect(15, 4, 18, 6, LEATHER);
        c.row(5, 8, 14, L(LEATHER));
        c.set(5, 3, L(LEATHER));
        c.rect(10, 8, 14, 13, D(LEATHER)); // the flap
        c.col(12, 13, 17, LEATHER);
        c.rect(11, 18, 13, 19, C.steel); // stirrup
        c.set(12, 19, null);
      } else {
        c.rect(8, 6, 12, 8, LEATHER); // the saddle is gone; a cut girth is left
        c.line(12, 8, 14, 15, LEATHER);
        c.set(14, 16, WOOLC);
        c.rect(9, b - 1, 11, b, C.steel);
        c.set(10, b, null);
        dots(c, WOOLC, [13, 9, 15, 10, 8, b, 14, b]);
        blood(c, [16, 9, 17, 10]);
      }
    },
    sw: 14, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      c.line(5, 12, 3, b, OAK);
      c.line(8, 12, 10, b, D(OAK));
      c.rect(5, 10, 8, 11, L(OAK));
      c.rect(3, 8, 10, 9, hex('#6a2c34'));
      c.rect(3, 10, 4, 13, hex('#6a2c34'));
      if (!u) {
        c.poly([[5, 3], [8, 3], [10, 8], [3, 8]], LEATHER);
        c.line(5, 3, 3, 8, L(LEATHER));
        c.rect(6, 5, 7, 7, SOOT);
        c.rect(10, 8, 11, 13, D(LEATHER));
        c.rect(2, 8, 2, 13, D(LEATHER));
        c.col(11, 14, 17, LEATHER);
        c.rect(10, 18, 12, 19, C.steel);
      } else {
        c.col(10, 9, 15, LEATHER);
        c.set(10, 16, WOOLC);
        c.rect(5, b - 1, 7, b, C.steel);
        blood(c, [6, 9]);
      }
    },
  });

  const bin = (c, x0, yb, lid, open) => {
    const x1 = x0 + 9;
    c.poly([[x0, yb - 12], [x1, yb - 12], [x1 - 1, yb], [x0 + 1, yb]], ZINC);
    for (let x = x0 + 2; x < x1; x += 2) c.col(x, yb - 11, yb - 1, D(ZINC));
    c.line(x0, yb - 12, x0 + 1, yb, L(ZINC));
    c.row(yb - 9, x0, x1, C.iron);
    c.set(x0 - 1, yb - 8, C.iron);
    c.set(x1 + 1, yb - 8, C.iron);
    if (lid) {
      c.rect(x0 - 1, yb - 14, x1 + 1, yb - 13, ZINC);
      c.row(yb - 14, x0 - 1, x1 + 1, L(ZINC));
      c.rect(x0 + 4, yb - 15, x0 + 5, yb - 15, C.iron);
    } else c.row(yb - 12, x0 + 1, x1 - 1, open || SOOT);
  };
  add('rural-feed-bins', 'feed bins galvanised dustbins lids scoop grain meal store rats', {
    w: 28, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2;
      bin(c, 2, b, true);
      dots(c, C.rust, [5, b - 3, 8, b - 6]);
      if (!u) {
        bin(c, 15, b, true);
        c.rect(18, b - 17, 21, b - 16, ZINC); // the scoop on the lid
        c.set(22, b - 17, OAK);
      } else {
        bin(c, 15, b, false);
        dots(c, C.glow, [18, b - 12, 21, b - 12]); // the lid is off and something is in the meal
        c.rect(12, b - 1, 24, b, ZINC);
        c.clearRect(12, b - 1, 14, b);
        c.rect(3, b - 1, 0, b, ZINC);
        c.poly([[11, b - 5], [14, b - 6], [14, b], [12, b]], ZINC); // the lid against the other
        c.line(11, b - 5, 12, b, L(ZINC));
        heap(c, 23, 27, b, 2, GRAIN, 4);
        dots(c, GRAIN, [26, b - 4, 25, b - 6, 22, b]);
        c.row(b, 20, 23, hex('#8a6a6a'));
      }
    },
    sw: 14, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      if (!u) bin(c, 2, b, true);
      else {
        bin(c, 2, b, false);
        dots(c, C.glow, [5, b - 12, 8, b - 12]);
        heap(c, 0, 3, b, 2, GRAIN, 5);
        dots(c, GRAIN, [1, b - 4, 2, b - 6]);
      }
      dots(c, C.rust, [5, b - 3, 8, b - 6]);
    },
  });

  /* ---------- edges ---------- */
  add('rural-harrow-leaning', 'harrow leaning spike harrow iron tines field tool rusty against the wall', {
    w: 26, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2,
        IR = hex('#4a4038');
      for (let x = 3; x <= 23; x += 5) c.col(x, 2, b, IR);
      for (let y = 4; y <= b; y += 5) c.row(y, 2, 24, IR);
      for (let x = 3; x <= 23; x += 5)
        for (let y = 4; y <= b; y += 5) {
          c.rect(x - 1, y - 1, x + 1, y + 1, C.rust);
          c.set(x, y, u && (x === 13 || x === 8) && y > 8 && y < 22 ? C.blood : C.steel); // the points, towards us
        }
      c.col(3, 2, b, mix(IR, 1.3));
      rust(c, 2, 2, 24, b, 3, 7);
      if (u) {
        blood(c, [13, 10, 13, 11, 13, 12, 13, 15, 13, 16, 8, 15, 8, 16, 8, 17, 9, 20, 13, 20, 12, b, 14, b, 10, b]);
        c.rect(14, 12, 17, 14, hex('#4a5a7a')); // a piece of a shirt
        c.set(18, 15, hex('#4a5a7a'));
        c.set(15, 15, hex('#4a5a7a'));
      }
      grass(c, [1, 12, 24], b);
    },
    sw: 9, sh: 28,
    s(c, u) {
      const b = c.h - 2,
        IR = hex('#4a4038');
      c.line(6, b, 3, 2, IR);
      c.line(7, b, 4, 2, mix(IR, 0.8));
      for (let y = 4; y <= b; y += 5) {
        const x = Math.round(6 - ((b - y) / (b - 2)) * 3);
        c.rect(x - 3, y, x - 1, y, u && y > 8 && y < 22 ? C.blood : C.steel);
        c.set(x - 1, y, C.rust);
      }
      if (u) {
        blood(c, [2, 13, 1, b, 3, b]);
        c.set(1, 14, hex('#4a5a7a'));
      }
    },
  });

  add('rural-scythe-stump', 'scythe leaning on a stump whetstone blade reaper mowing', {
    w: 26, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(11, b - 7, 21, b, hex('#4a4038')); // the stump
      c.rect(11, b - 8, 21, b - 8, PALEW);
      c.row(b - 7, 11, 21, D(PALEW));
      c.col(11, b - 7, b, L(hex('#4a4038')));
      for (const x of [14, 17, 19]) c.col(x, b - 6, b, mix(hex('#4a4038'), 0.7));
      c.rect(15, b - 10, 19, b - 9, hex('#77736a')); // the whetstone
      c.line(5, b, 15, 3, PALEW); // the snath
      c.line(6, b, 16, 3, D(PALEW));
      c.rect(9, b - 9, 11, b - 9, OAK);
      c.rect(11, 12, 13, 12, OAK);
      const bl = u ? C.blood : C.steel;
      c.line(16, 2, 9, 3, C.steel); // the blade
      c.line(9, 3, 3, 7, C.steel);
      c.line(15, 3, 9, 4, bl);
      c.line(9, 4, 4, 7, u ? C.blood : C.iron);
      c.set(2, 8, C.steel);
      if (u) {
        drip(c, 3, 9, 14, C.blood);
        drip(c, 7, 6, 9, C.blood);
        blood(c, [3, b, 2, b, 4, b - 1]);
        for (const x of [20, 23]) {
          c.line(x, b, x + 2, b - 2, C.leafLight); // and what it cut lies in a swathe
          c.line(x - 1, b, x + 1, b - 1, C.moss);
        }
        dots(c, WOOLC, [22, b - 3]);
      }
      grass(c, [9, 23], b);
    },
    sw: 14, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 7, 12, b, hex('#4a4038'));
      c.rect(3, b - 8, 12, b - 8, PALEW);
      c.col(3, b - 7, b, L(hex('#4a4038')));
      c.col(8, b - 6, b, mix(hex('#4a4038'), 0.7));
      c.rect(7, b - 10, 10, b - 9, hex('#77736a'));
      c.line(4, b, 6, 3, PALEW);
      c.line(5, b, 7, 3, D(PALEW));
      c.rect(5, 2, 8, 2, C.steel); // the blade coming at us
      c.rect(4, 3, 5, 9, u ? C.blood : C.steel);
      c.col(4, 3, 9, C.steel);
      c.set(4, 10, C.steel);
      if (u) {
        drip(c, 4, 11, 16, C.blood);
        blood(c, [3, b, 2, b]);
      }
    },
  });

  add('rural-tractor-tyre-leaning', 'old tractor tyre leaning big rubber tyre tread weeds farm yard', {
    w: 26, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (let y = 1; y <= b; y++)
        for (let x = 1; x <= 24; x++) {
          const d = Math.hypot(x - 12.5, y - 12.5);
          if (d <= 11.8 && d > 5.2) c.set(x, y, d > 9.6 ? ((Math.atan2(y - 12.5, x - 12.5) * 12) / Math.PI + 24) % 2 < 1 ? TYRE : hex('#3a383f') : d > 8.6 ? hex('#1e1c22') : TYRE);
          else if (d <= 5.2 && u) c.set(x, y, hex('#1c1a1e'));
        }
      for (let a = 3.4; a < 5.2; a += 0.12) c.set(12.5 + Math.cos(a) * 7.5, 12.5 + Math.sin(a) * 7.5, hex('#44424a'));
      if (!u) {
        c.line(11, b - 6, 10, b - 9, C.leafLight); // weeds through the middle
        c.line(13, b - 6, 14, b - 10, C.moss);
        c.line(12, b - 6, 12, b - 8, C.leafLight);
      } else {
        c.rect(9, 12, 16, 16, hex('#4a4038')); // something has made its bed in it
        c.row(11, 10, 14, hex('#4a4038'));
        dots(c, C.glow, [11, 13, 14, 13]);
        dots(c, C.bone, [9, 17, 12, 17, 15, 16, 20, b, 22, b]);
        dots(c, HAY, [8, 16, 16, 17, 13, 18]);
      }
      grass(c, [1, 23], b);
    },
    sw: 10, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      for (let y = 1; y <= b; y++) {
        const x = Math.round(6 - ((b - y) / b) * 3);
        c.rect(x - 2, y, x + 1, y, y % 3 ? TYRE : hex('#3a383f'));
        c.set(x - 2, y, hex('#44424a'));
      }
      c.clear(1, 1);
      if (u) dots(c, C.bone, [8, b, 1, b]);
      else c.set(8, b, C.moss);
    },
  });

  add('rural-gas-bottles-chained', 'gas bottles propane cylinders chained regulator hose farmhouse wall', {
    w: 22, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const bottle = (x, col, tall) => {
        const t = tall ? 6 : 9;
        c.rect(x, t + 2, x + 7, b, col);
        c.row(t + 1, x + 1, x + 6, col);
        c.row(t, x + 2, x + 5, L(col));
        c.col(x, t + 2, b, L(col));
        c.col(x + 7, t + 2, b, D(col));
        c.row(b - 1, x, x + 7, D(col));
        c.rect(x + 2, t - 3, x + 5, t - 1, C.ironDark); // collar
        c.rect(x + 3, t - 2, x + 4, t - 1, C.brass);
        c.rect(x + 2, t + 6, x + 5, t + 8, LIME);
        rust(c, x, t + 2, x + 7, b, x, 9);
      };
      bottle(2, hex('#9a5a34'), true);
      bottle(12, FBLUE, false);
      if (!u) {
        chain(c, 1, 14, 20, 14);
        c.line(6, 4, 15, 7, SOOT); // the hose between
      } else {
        chain(c, 1, 14, 1, b); // unchained, a valve hissing
        chain(c, 20, 14, 21, 22);
        c.line(6, 4, 9, 9, SOOT);
        dots(c, C.ghost, [16, 5, 17, 4, 18, 3, 19, 3, 20, 1, 18, 1, 20, 4]);
        dots(c, C.white, [13, 12, 15, 13, 17, 12, 14, 15, 18, 16]); // frost
      }
    },
    sw: 12, sh: 28,
    s(c, u) {
      const b = c.h - 2,
        col = hex('#9a5a34');
      c.rect(2, 8, 9, b, col);
      c.row(7, 3, 8, col);
      c.row(6, 4, 7, L(col));
      c.col(2, 8, b, L(col));
      c.col(9, 8, b, D(col));
      c.rect(4, 3, 7, 5, C.ironDark);
      c.rect(5, 4, 6, 5, C.brass);
      c.rect(4, 12, 7, 14, LIME);
      rust(c, 2, 8, 9, b, 3, 9);
      if (!u) chain(c, 1, 16, 10, 16);
      else {
        chain(c, 10, 16, 10, b);
        dots(c, C.ghost, [8, 3, 9, 2, 10, 1, 9, 0 + 1]);
      }
    },
  });

  /* ---------- out on the land ---------- */
  const hide = (c, u, side) => {
    const b = c.h - 2;
    c.line(3, b, 6, 22, GREYW);
    c.line(20, b, 17, 22, D(GREYW));
    c.line(4, b, 7, 22, D(GREYW));
    c.line(19, b, 16, 22, GREYW);
    c.line(5, 40, 18, 28, D(GREYW));
    c.line(18, 40, 5, 28, D(GREYW));
    c.row(41, 4, 19, GREYW);
    boards(c, 3, 6, 20, 21, GREYW, 4);
    c.rect(2, 21, 21, 22, OAK);
    c.rect(1, 3, 22, 5, TAR);
    c.row(3, 1, 22, hex('#5a5258'));
    dots(c, C.moss, [4, 5, 15, 5, 5, 18, 18, 12]);
    if (!side) {
      c.rect(5, 10, 18, 12, SOOT); // the slit
      if (u) {
        c.rect(11, 11, 12, 11, C.steel); // a barrel, and a glint of glass
        c.rect(12, 12, 13, 13, C.ironDark);
        c.set(12, 10, C.glow);
        c.set(8, 11, hex('#3a342e'));
      }
    } else {
      for (const x of [9, 14]) c.col(x, 14, b, PALEW); // the ladder
      for (let y = 25; y < b; y += 4) c.row(y, 10, 13, D(PALEW));
      c.rect(8, 8, 15, 21, OAK);
      if (!u) {
        boards(c, 9, 9, 14, 21, PALEW, 3);
        c.set(13, 15, C.iron);
      } else {
        hollow(c, 9, 9, 14, 21);
        c.rect(15, 8, 17, 21, PALEW);
        c.col(17, 8, 21, D(PALEW));
        c.rect(10, 20, 13, 21, hex('#3a2c24')); // boots, toes up
        c.set(10, 19, hex('#3a2c24'));
        c.set(13, 19, hex('#3a2c24'));
        blood(c, [11, 23, 11, 26, 12, 30, 11, 35]);
      }
    }
    grass(c, [1, 11, 21], b);
  };
  add('rural-hunting-hide', 'hunting hide high seat raised shooting stand on legs ladder field edge', {
    w: 24, h: 60, solid: true,
    f: (c, u) => hide(c, u, false),
    sw: 24, sh: 60,
    s: (c, u) => hide(c, u, true),
  });

  add('rural-egg-honesty-stand', 'roadside egg stand honesty box eggs for sale table sign farm gate', {
    w: 24, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 2, 3, b, GREYW);
      post(c, 20, 3, b, GREYW);
      c.poly([[0, 5], [3, 1], [20, 1], [23, 5]], TAR);
      c.row(1, 3, 20, hex('#5a5258'));
      c.rect(4, 6, 19, 10, LIME); // the sign
      c.row(6, 4, 19, L(LIME));
      for (const [x, y] of [[6, 7], [6, 8], [6, 9], [7, 7], [7, 9], [9, 7], [9, 8], [9, 9], [10, 7], [10, 9], [11, 9], [13, 7], [13, 8], [13, 9], [14, 7], [14, 9], [15, 9], [17, 7], [17, 8], [18, 9], [18, 7]]) c.set(x, y, FRED);
      board(c, 1, 17, 22, 18, PALEW);
      c.rect(4, 19, 19, 19, D(PALEW));
      c.line(4, 20, 19, b, D(GREYW));
      if (!u) {
        for (const [x, y] of [[4, 14], [10, 14], [7, 11]]) {
          c.rect(x, y, x + 5, y + 2, hex('#8a8a80')); // egg boxes
          c.row(y, x, x + 5, hex('#a4a498'));
          c.row(y + 1, x + 1, x + 4, hex('#6f6f66'));
        }
        c.rect(17, 12, 20, 16, hex('#7a3a2c')); // the money tin
        c.row(12, 17, 20, hex('#94503c'));
        c.rect(18, 13, 19, 13, SOOT);
      } else {
        c.rect(4, 14, 9, 16, hex('#8a8a80'));
        c.row(14, 4, 9, hex('#6f6f66'));
        c.rect(15, 14, 19, 16, hex('#7a3a2c')); // the tin forced, on its side
        c.col(20, 14, 16, SOOT);
        c.line(20, 13, 22, 12, hex('#94503c'));
        dots(c, C.brass, [21, 16, 13, 16]);
        dots(c, C.white, [8, b, 10, b - 1, 13, b, 15, b, 11, 16, 12, 16]);
        dots(c, C.mustard, [9, b, 11, b, 14, b, 12, 17, 12, 19, 12, 21]);
        blood(c, [6, 15, 7, 15]);
      }
      grass(c, [0, 22], b);
    },
    sw: 14, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      post(c, 6, 3, b, GREYW);
      c.rect(2, 1, 11, 4, TAR);
      c.row(1, 2, 11, hex('#5a5258'));
      board(c, 2, 17, 11, 18, PALEW);
      c.col(4, 6, 10, LIME);
      if (!u) {
        c.rect(3, 14, 8, 16, hex('#8a8a80'));
        c.row(14, 3, 8, hex('#a4a498'));
        c.rect(4, 11, 7, 13, hex('#8a8a80'));
        c.rect(9, 12, 10, 16, hex('#7a3a2c'));
      } else {
        c.rect(3, 14, 6, 16, hex('#8a8a80'));
        c.rect(8, 14, 10, 16, hex('#7a3a2c'));
        dots(c, C.white, [3, b, 9, b - 1]);
        dots(c, C.mustard, [4, b, 10, b]);
      }
      grass(c, [9], b);
    },
  });

  add('rural-vermin-line', 'gamekeepers gibbet vermin line dead crows moles stoat hung on a wire fence', {
    w: 34, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 2, 2, b, GREYW);
      post(c, 30, 2, b, GREYW);
      c.line(3, 4, 16, 6, C.iron);
      c.line(16, 6, 30, 4, C.iron);
      const hang = (x, y, col, len, tip) => {
        c.set(x, y, ROPE);
        c.rect(x - 1, y + 1, x, y + len, col);
        c.set(x - 1, y + 1, null);
        if (tip) c.set(x, y + len + 1, tip);
        c.set(x + 1, y + 2, col);
      };
      hang(7, 5, CROWK, 5, hex('#55525c'));
      hang(11, 6, hex('#3a3438'), 3); // a mole
      hang(15, 7, CROWK, 5, hex('#55525c'));
      hang(25, 6, hex('#7a5a34'), 6, C.white); // a stoat
      c.set(24, 8, C.white);
      if (!u) hang(20, 7, hex('#3a3438'), 3);
      else {
        c.col(20, 7, 8, ROPE); // and now a doll
        c.rect(19, 9, 21, 11, C.flesh);
        c.set(19, 10, SOOT);
        c.set(21, 10, SOOT);
        c.row(8, 19, 21, hex('#a8904e'));
        c.rect(18, 12, 22, 16, hex('#7a8a9a'));
        c.set(17, 13, C.flesh);
        c.set(23, 13, C.flesh);
        c.set(19, 17, C.flesh);
        c.set(21, 17, C.flesh);
        dots(c, SOOT, [13, 3, 23, 2, 27, 12, 9, 13]);
      }
      grass(c, [1, 14, 29], b);
    },
    sw: 6, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      post(c, 2, 2, b, GREYW);
      c.set(1, 4, C.iron);
      c.rect(1, 6, 1, 10, CROWK);
      if (u) {
        c.rect(4, 9, 4, 11, C.flesh);
        c.rect(4, 12, 4, 16, hex('#7a8a9a'));
      }
      grass(c, [4], b);
    },
  });

  add('rural-bull-post-ring', 'bull post tethering post iron ring heavy chain trampled ground', {
    w: 18, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 6, 3, b, OAK, 5);
      c.rect(6, 2, 10, 2, L(OAK));
      c.row(6, 6, 10, C.iron);
      c.row(7, 6, 10, C.ironDark);
      c.rect(11, 7, 13, 9, C.iron); // the ring
      c.set(12, 8, null);
      dots(c, MUD, [2, b, 4, b, 13, b, 15, b]);
      if (!u) {
        chain(c, 13, 10, 14, b - 1);
        chain(c, 14, b, 16, b);
      } else {
        chain(c, 13, 10, 13, 13); // snapped short
        c.rect(7, 10, 9, 15, PALEW); // the post gouged white
        c.line(7, 10, 9, 15, OAK);
        dots(c, PALEW, [4, b - 1, 12, b, 3, b]);
        blood(c, [8, 12, 8, 17, 9, 19]);
        dots(c, SOIL, [1, b, 5, b, 14, b, 16, b - 1, 12, b - 1]);
      }
    },
    sw: 12, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      post(c, 3, 3, b, OAK, 5);
      c.rect(3, 2, 7, 2, L(OAK));
      c.row(6, 3, 7, C.iron);
      c.rect(4, 7, 6, 9, C.iron); // the ring, towards us
      c.set(5, 8, OAK);
      if (!u) {
        chain(c, 5, 10, 5, b - 1);
        chain(c, 6, b, 9, b);
      } else {
        chain(c, 5, 10, 5, 13);
        c.rect(4, 14, 5, 17, PALEW);
        blood(c, [4, 18]);
        dots(c, SOIL, [1, b, 9, b]);
      }
    },
  });

  const feeder = (c, u, seed) => {
    const b = c.h - 2,
      G = hex('#6f7780');
    if (!u) {
      hay(c, 5, 2, 28, 12, seed, HAY);
      c.set(5, 2, null);
      c.set(28, 2, null);
    } else {
      hay(c, 6, b - 2, 27, b, seed, mix(HAY, 0.8)); // eaten out; what lies in it is not hay
      c.rect(11, b - 6, 22, b - 3, WOOLC);
      c.row(b - 7, 13, 20, L(WOOLC));
      c.rect(22, b - 5, 24, b - 3, hex('#3a342e'));
      c.rect(14, b - 4, 18, b - 3, C.blood);
      dots(c, C.bone, [15, b - 5, 17, b - 5]);
      crow(c, 17, b - 7, seed % 2 === 0);
    }
    c.rect(2, 6, 31, 7, G);
    c.row(6, 2, 31, L(G));
    c.rect(2, b - 5, 31, b - 4, G);
    c.row(b, 3, 30, D(G));
    for (let x = 3; x <= 30; x += 3) {
      c.line(x, 7, x + (seed % 2 ? 1 : -1), b - 5, x % 2 ? G : D(G));
      c.col(x, b - 4, b, D(G));
    }
    if (u) {
      c.line(12, 7, 14, 12, hex('#3a3a44')); // two bars bent
      c.line(18, 7, 17, 12, hex('#3a3a44'));
    }
    c.speckle(2, 6, 31, b, C.rust, 9, seed);
    grass(c, [1, 32], b);
  };
  add('rural-round-bale-feeder', 'round bale feeder ring feeder cattle hay steel hoops field', {
    w: 34, h: 20, solid: true,
    f: (c, u) => feeder(c, u, 3),
    sw: 34, sh: 20,
    s: (c, u) => feeder(c, u, 6),
  });
};
