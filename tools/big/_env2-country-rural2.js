/* Rural, part 2: the dairy and the barn floor, the silo, the dog and the dead tree, the farmhouse and its
 * porch, fuel and the freezer. Part of tools/big/env2-country.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { P, D, L, dots, board, face, panel, post, legs, planksV, planksH, boards, boardsH, hollow, pane, flame, fire, wisp, bush, stones, rubble, bricks } = H;
  const { wheel, tyre, barrel, sack, crate, churn, hay, heap, blood, puddle, drip, shards, grass, crow, rope, chain, lantern, shape } = H;
  const add = H.reg('env-rural', 'Rural');
  const { OAK, GREYW, PALEW, TAR, HAY, BRICK, LIME, STONE, SOIL, MUD, SOOT, TIN, ZINC, WAT, MILK, ROPE, SACK, FRED, FGREEN, FBLUE, FYELLOW, MEAT, LAMP } = P;
  const GRAIN = hex('#b09648'),
    BARK = hex('#4a4038'),
    ENAMEL = hex('#b8b6a8'),
    STOVE = hex('#2c2a30'),
    BOOT = hex('#3d4a3a'),
    OIL = hex('#1a1820'),
    PIG = hex('#c09a8a');
  const corr = (c, x0, y0, x1, y1, col = ZINC, vertical = true) => {
    c.rect(x0, y0, x1, y1, col);
    if (vertical) for (let x = x0; x <= x1; x += 2) c.col(x, y0, y1, x % 4 ? D(col) : L(col));
    else for (let y = y0; y <= y1; y += 2) c.row(y, x0, x1, (y - y0) % 4 ? D(col) : L(col));
  };
  const rust = (c, x0, y0, x1, y1, seed = 1, n = 9) => c.speckle(x0, y0, x1, y1, C.rust, n, seed);
  const pail = (c, x0, yb, w = 7, h = 8, fill) => {
    c.poly([[x0, yb - h + 1], [x0 + w - 1, yb - h + 1], [x0 + w - 2, yb], [x0 + 1, yb]], ZINC);
    c.row(yb - h + 1, x0, x0 + w - 1, L(ZINC));
    c.line(x0, yb - h + 1, x0 + 1, yb, L(ZINC));
    c.row(yb - h + 3, x0 + 1, x0 + w - 2, D(ZINC));
    if (fill) c.row(yb - h + 1, x0 + 1, x0 + w - 2, fill);
  };

  /* ---------- dairy and barn ---------- */
  add('rural-milking-stool-pail', 'milking stool and pail three legged stool zinc bucket milk cowshed', {
    w: 22, h: 16, solid: false,
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        board(c, 2, 7, 10, 8, OAK);
        c.line(3, 9, 2, b, OAK);
        c.line(9, 9, 10, b, D(OAK));
        c.col(6, 9, b, D(OAK));
        pail(c, 13, b, 7, 8, MILK);
        for (const x of [13, 19]) c.col(x, 3, 6, C.iron); // the handle up
        c.row(2, 14, 18, C.iron);
      } else {
        c.rect(2, b - 1, 10, b, OAK); // the stool over, the pail kicked
        c.row(b - 1, 2, 10, L(OAK));
        c.line(3, b - 2, 2, 7, OAK);
        c.line(9, b - 2, 10, 7, D(OAK));
        c.col(6, 8, b - 2, D(OAK));
        c.poly([[13, b - 6], [20, b - 5], [20, b - 1], [13, b]], ZINC);
        c.line(13, b - 6, 20, b - 5, L(ZINC));
        c.col(12, b - 5, b - 1, MILK);
        c.row(b, 3, 12, MILK);
        c.row(b - 1, 9, 11, MILK);
        c.set(4, b, L(MILK));
        blood(c, [7, b, 8, b]); // and a thread of red in the milk
      }
    },
    sw: 12, sh: 16,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        board(c, 1, 7, 10, 8, OAK);
        c.col(2, 9, b, OAK);
        c.col(9, 9, b, D(OAK));
        pail(c, 3, b, 6, 7, MILK);
        c.row(b - 8, 4, 7, C.iron);
      } else {
        c.rect(1, b - 1, 10, b, OAK);
        c.col(2, 8, b - 2, OAK);
        c.col(9, 8, b - 2, D(OAK));
        c.oval(3, b - 7, 9, b - 1, ZINC);
        c.oval(4, b - 6, 8, b - 2, SOOT);
        c.row(b, 2, 11, MILK);
        c.row(b - 2, 5, 7, MILK);
        blood(c, [6, b]);
      }
    },
  });

  add('rural-grain-sacks', 'grain sacks stacked sacks of corn wheat feed barn rat', {
    w: 30, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const lying = (x0, x1, y0, col = SACK) => {
        c.rect(x0, y0, x1, y0 + 5, col);
        c.row(y0, x0 + 1, x1 - 1, L(col));
        c.set(x0, y0, null);
        c.set(x1, y0, null);
        c.row(y0 + 5, x0, x1, D(col));
        c.col(x1, y0 + 1, y0 + 5, D(col));
        c.set(x1 + 1, y0 + 2, ROPE);
      };
      sack(c, 1, b - 11, 9, b);
      sack(c, 10, b - 12, 18, b, D(SACK));
      sack(c, 19, b - 11, 27, b);
      lying(3, 14, b - 17);
      if (!u) lying(15, 25, b - 17, mix(SACK, 0.9));
      dots(c, mix(SACK, 0.6), [4, b - 5, 5, b - 4, 6, b - 5, 13, b - 6, 14, b - 5, 22, b - 5, 23, b - 4]);
      if (u) {
        c.rect(15, b - 14, 24, b - 12, SACK); // one slit and running out
        c.row(b - 14, 16, 23, L(SACK));
        c.line(22, b - 8, 24, b - 3, SOOT);
        heap(c, 20, 29, b, 4, GRAIN, 3);
        drip(c, 24, b - 3, b - 4, GRAIN);
        dots(c, GRAIN, [23, b - 6, 24, b - 5, 17, b, 18, b]);
        c.rect(12, b - 1, 15, b, hex('#5a5258')); // a rat
        c.set(11, b, hex('#a88a8a'));
        c.row(b, 16, 18, hex('#8a6a6a'));
      }
    },
    sw: 16, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      sack(c, 2, b - 11, 10, b);
      sack(c, 6, b - 12, 14, b, D(SACK));
      c.rect(3, b - 17, 12, b - 12, SACK);
      c.row(b - 17, 4, 11, L(SACK));
      c.set(3, b - 17, null);
      c.set(12, b - 17, null);
      if (u) {
        c.line(4, b - 8, 5, b - 3, SOOT);
        heap(c, 0 + 1, 7, b, 3, GRAIN, 4);
        c.rect(11, b - 1, 13, b, hex('#5a5258'));
        c.set(14, b, hex('#8a6a6a'));
      }
    },
  });

  add('rural-pitchfork-rack', 'pitchfork rack tool rack barn wall hay fork shovel rake hoe', {
    w: 28, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 10, 26, 11, OAK);
      board(c, 1, 25, 26, 26, OAK);
      dots(c, C.iron, [3, 10, 9, 10, 15, 10, 21, 10, 25, 10]);
      if (!u) {
        c.col(5, 8, b, PALEW); // the fork
        c.row(8, 3, 7, C.iron);
        for (const x of [3, 5, 7]) c.col(x, 2, 7, C.steel);
      } else {
        blood(c, [5, 12, 5, 15, 5, 19, 4, b, 6, b, 5, b - 1]); // gone from its place, and its place is wet
        dots(c, HAY, [3, b, 8, b]);
      }
      c.col(12, 3, b - 7, PALEW); // shovel
      c.rect(11, 2, 13, 2, PALEW);
      c.rect(10, b - 6, 14, b, C.iron);
      c.col(10, b - 6, b, C.steel);
      c.set(10, b, null);
      c.set(14, b, null);
      c.col(19, 4, b, PALEW); // rake
      c.row(3, 15, 23, OAK);
      for (let x = 15; x <= 23; x += 2) c.set(x, 4, C.iron);
      c.col(24, 5, b, D(PALEW)); // hoe
      c.rect(24, 3, 26, 4, C.iron);
      if (u) blood(c, [15, 4, 17, 4, 17, 5, 16, 7]);
    },
    sw: 8, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      c.rect(5, 2, 6, b, D(GREYW)); // the wall behind
      c.rect(3, 10, 4, 11, OAK);
      c.rect(3, 25, 4, 26, OAK);
      c.line(2, b, 4, 4, PALEW);
      c.rect(1, b - 6, 2, b, C.iron);
      if (!u) {
        c.line(1, b, 3, 8, D(PALEW));
        c.col(3, 2, 7, C.steel);
      } else blood(c, [3, 13, 3, 18, 1, b]);
    },
  });

  add('rural-slaughter-block', 'slaughter block butchering table heavy bench cleaver knives farm killing', {
    w: 28, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 3, 13, b, OAK, 3);
      post(c, 22, 13, b, OAK, 3);
      c.row(16, 6, 21, D(OAK));
      c.rect(2, 8, 25, 12, PALEW);
      c.row(8, 2, 25, L(PALEW));
      c.row(12, 2, 25, D(PALEW));
      dots(c, D(PALEW), [5, 10, 9, 9, 13, 11, 17, 10, 21, 9, 7, 11]);
      dots(c, hex('#5a3a30'), [10, 8, 11, 8, 14, 8, 12, 9, 12, 11]); // old stains
      c.col(9, 13, 16, C.steel); // a knife hung under
      c.set(9, 13, OAK);
      pail(c, 10, b, 6, 5, u ? C.blood : null);
      if (!u) {
        c.rect(15, 3, 19, 7, C.steel); // the cleaver standing in the wood
        c.col(15, 3, 7, C.iron);
        c.rect(20, 4, 23, 5, OAK);
      } else {
        c.rect(6, 7, 20, 8, C.blood);
        c.row(8, 4, 22, C.blood);
        drip(c, 6, 9, 15, C.blood);
        drip(c, 19, 9, 12, C.blood);
        drip(c, 22, 9, b - 2, C.blood);
        c.rect(15, 6, 21, 7, C.steel); // the cleaver thrown down
        c.rect(22, 6, 24, 6, OAK);
        c.rect(5, 5, 10, 7, C.white); // feathers, and a wing
        dots(c, D(C.white), [6, 6, 8, 5, 9, 7]);
        dots(c, C.white, [3, 4, 12, 3, 2, b, 18, b, 24, b - 1, 26, 10]);
        c.row(b, 17, 26, C.blood);
      }
    },
    sw: 16, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      post(c, 3, 13, b, OAK, 3);
      post(c, 10, 13, b, OAK, 3);
      c.rect(2, 8, 13, 12, PALEW);
      c.row(8, 2, 13, L(PALEW));
      c.row(12, 2, 13, D(PALEW));
      for (let x = 4; x < 13; x += 3) c.col(x, 9, 11, D(PALEW));
      if (!u) {
        c.rect(7, 3, 8, 7, C.steel);
        c.rect(9, 4, 11, 5, OAK);
      } else {
        c.row(8, 3, 12, C.blood);
        drip(c, 5, 9, 14, C.blood);
        drip(c, 11, 9, b - 2, C.blood);
        c.rect(6, 6, 10, 7, C.steel);
        dots(c, C.white, [3, 6, 4, 5, 1, b, 14, b]);
        c.row(b, 9, 14, C.blood);
      }
    },
  });

  const silo = (c, u, side) => {
    const b = c.h - 2;
    c.oval(4, 2, 27, 18, ZINC);
    c.rect(4, 10, 27, b, ZINC);
    c.col(4, 10, b, L(ZINC));
    c.col(5, 10, b, L(ZINC));
    c.col(26, 10, b, D(ZINC));
    c.col(27, 10, b, D(ZINC));
    for (let y = 10; y < b; y += 6) c.row(y, 4, 27, D(ZINC));
    for (let x = 6; x < 27; x += 5) c.line(x, 9, 15 + (x - 15) * 0.2, 2, D(ZINC));
    c.rect(14, 1, 17, 2, C.iron);
    rust(c, 5, 5, 26, b, 7, 16);
    dots(c, C.rust, [9, 11, 9, 12, 9, 13, 21, 17, 21, 18, 21, 19, 12, 29, 12, 30]);
    const lx = side ? 12 : 21;
    for (const x of [lx, lx + 4]) c.col(x, 5, b, C.iron); // the ladder
    for (let y = 7; y < b; y += 3) c.row(y, lx + 1, lx + 3, C.ironDark);
    if (!side) {
      c.rect(8, b - 14, 17, b - 4, C.ironDark); // the hatch
      if (!u) {
        c.rect(9, b - 13, 16, b - 5, FRED);
        c.row(b - 13, 9, 16, L(FRED));
        c.rect(12, b - 10, 13, b - 9, C.steel);
        c.row(b - 7, 10, 15, D(FRED));
      } else {
        c.rect(9, b - 13, 16, b - 5, SOOT);
        c.rect(6, b - 13, 8, b - 5, FRED); // swung open
        c.col(6, b - 13, b - 5, L(FRED));
        heap(c, 5, 22, b, 7, GRAIN, 3); // the grain comes out, and a hand with it
        c.rect(10, b - 8, 15, b - 5, GRAIN);
        c.rect(13, b - 9, 14, b - 7, C.flesh);
        dots(c, C.flesh, [12, b - 10, 13, b - 10, 15, b - 10, 15, b - 8]);
        dots(c, D(GRAIN), [8, b - 2, 12, b - 3, 17, b - 1, 20, b]);
      }
    } else {
      c.rect(2, b - 14, 3, b - 4, C.ironDark); // the hatch on the side, edge on
      if (u) {
        c.rect(-3, b - 13, 1, b - 5, FRED);
        c.row(b - 13, -3, 1, L(FRED));
        heap(c, -3, 6, b, 6, GRAIN, 5);
        c.rect(0, b - 8, 1, b - 7, C.flesh);
      } else c.col(2, b - 13, b - 5, FRED);
    }
    c.rect(3, b, 28, b, STONE);
  };
  add('rural-silo-hatch', 'grain silo steel silo hatch ladder corrugated tower farm storage', {
    w: 32, h: 52, solid: true,
    f: (c, u) => silo(c, u, false),
    sw: 32, sh: 52,
    s: (c, u) => silo(c, u, true),
    su: [4, 0, 0],
  });

  /* ---------- the dog, the tree, the field ---------- */
  add('rural-kennel-chain', 'dog kennel farm dog house chain bowl wooden yard', {
    w: 26, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[3, 10], [10, 3], [11, 3], [18, 10], [18, b], [3, b]], GREYW);
      planksV(c, 3, 5, 18, b, D(GREYW), 4);
      c.col(3, 10, b, L(GREYW));
      for (let i = 0; i < 2; i++) {
        c.line(1, 10 - i + 1, 10, 2 - i + 1, i ? hex('#5a5258') : TAR);
        c.line(20, 10 - i + 1, 11, 2 - i + 1, TAR);
      }
      c.oval(7, 11, 14, 22, SOOT);
      c.rect(7, 17, 14, b, SOOT);
      c.rect(8, 8, 13, 9, PALEW); // a name once
      dots(c, D(PALEW), [9, 8, 11, 9, 12, 8]);
      if (!u) {
        dots(c, C.glow, [9, 16, 12, 16]); // he is in
        chain(c, 13, b - 1, 19, b);
        chain(c, 19, b, 22, b - 4);
        c.rect(22, b - 6, 23, b, C.iron);
        c.rect(20, b - 1, 24, b, hex('#7a3a2c'));
        c.clear(22, b - 7);
        c.rect(20, b - 2, 24, b - 2, hex('#8a6a4a'));
      } else {
        c.rect(22, b - 6, 23, b, C.iron);
        chain(c, 22, b - 4, 20, b); // the chain broken, and he did not break it
        c.set(19, b, C.steel);
        c.rect(14, b - 1, 18, b, hex('#7a3a2c'));
        c.set(14, b - 1, null);
        dots(c, hex('#8a6a4a'), [12, b, 13, b - 1, 19, b - 1]);
        blood(c, [9, b, 10, b, 11, b - 1, 8, b - 1, 6, b]);
        dots(c, hex('#6a5a48'), [5, b - 3, 16, b - 4, 10, b - 2]); // tufts of his coat
      }
      grass(c, [1, 25], b);
    },
    sw: 28, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      boardsH(c, 3, 10, 22, b, GREYW, 4);
      c.rect(1, 3, 24, 10, TAR);
      c.row(3, 1, 24, hex('#5a5258'));
      c.row(10, 1, 24, hex('#221d22'));
      for (let x = 6; x < 24; x += 6) c.col(x, 4, 9, hex('#2c262a'));
      c.col(3, 11, b, SOOT);
      if (!u) {
        chain(c, 2, b, 0, b);
        c.rect(0, b - 1, 1, b - 1, hex('#7a3a2c'));
      } else {
        blood(c, [1, b, 2, b, 0, b - 1]);
        dots(c, hex('#6a5a48'), [2, b - 3, 0, b - 2]);
      }
      dots(c, C.moss, [5, b, 14, b - 1, 21, b, 9, 9, 18, 9]);
    },
  });

  const deadTree = (c, u, flip) => {
    const b = c.h - 2,
      X = (x) => (flip ? 37 - x : x),
      ln = (x0, y0, x1, y1, col = BARK) => c.line(X(x0), y0, X(x1), y1, col);
    c.poly([[X(16), 22], [X(21), 22], [X(22), b - 4], [X(25), b], [X(12), b], [X(15), b - 4]], BARK);
    ln(16, 22, 15, b - 4, L(BARK));
    ln(19, 26, 19, b - 1, D(BARK));
    ln(21, 24, 22, b - 4, D(BARK));
    c.oval(X(17) - (flip ? 2 : 0), 34, X(17) + (flip ? 0 : 2), 39, SOOT); // a hollow
    for (const [x0, y0, x1, y1] of [[17, 22, 9, 10], [9, 10, 4, 7], [9, 10, 8, 3], [19, 22, 20, 8], [20, 8, 17, 2], [20, 12, 25, 5], [21, 22, 30, 14], [30, 14, 35, 13], [30, 14, 32, 8], [12, 15, 5, 16], [5, 16, 2, 13], [26, 18, 27, 23]]) {
      ln(x0, y0, x1, y1);
      ln(x0 + 1, y0, x1 + 1, y1, D(BARK));
    }
    ln(18, 22, 9, 11, L(BARK));
    dots(c, C.moss, [X(14), b, X(23), b - 1, X(16), b - 6]);
    if (!u) crow(c, X(30) - 2, 13, flip);
    else {
      crow(c, X(30) - 2, 13, flip); // they gather
      crow(c, X(5) - 2, 15, !flip);
      crow(c, X(8) - 2, 2, flip);
      crow(c, X(24) - 2, 4, !flip);
      crow(c, X(34) - 2, 12, flip);
      c.set(X(17) + (flip ? -1 : 1), 36, C.glow);
      dots(c, C.bone, [X(11), b, X(26), b, X(9), b]); // and under it, small bones
      c.set(X(10), b - 1, C.bone);
    }
    grass(c, [X(8), X(29)], b);
  };
  add('rural-dead-tree', 'dead tree bare branches lightning struck hollow crows lonely field', {
    w: 38, h: 58, solid: true,
    f: (c, u) => deadTree(c, u, false),
    sw: 38, sh: 58,
    s: (c, u) => deadTree(c, u, true),
  });

  add('rural-field-shrine', 'field shrine stone wayside shrine niche saint candle offering country road', {
    w: 16, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      rubble(c, 3, 12, 12, b, STONE, 3);
      c.col(3, 12, b, L(STONE));
      c.rect(2, b - 1, 13, b, STONE);
      c.rect(2, 6, 13, 11, STONE);
      c.poly([[1, 6], [7, 1], [8, 1], [14, 6]], TAR);
      c.line(1, 6, 7, 1, hex('#5a5258'));
      c.rect(5, 7, 10, 15, SOOT); // the niche
      c.rect(7, 9, 8, 14, hex('#7a8a9a')); // a little figure, blue once
      c.rect(7, 8, 8, 9, C.flesh);
      dots(c, C.moss, [4, b, 11, b - 2, 3, 20, 12, 9, 6, 3]);
      c.row(16, 4, 11, L(STONE));
      if (u) {
        c.col(6, 13, 14, C.bone);
        flame(c, 6, 12);
        dots(c, hex('#8a7a40'), [5, 11, 9, 10, 10, 13]);
        c.rect(9, 14, 10, 15, GRAIN); // an offering: ears of corn, and a lock of hair
        dots(c, GRAIN, [10, 13, 4, 16, 5, 17]);
        dots(c, hex('#3a2c24'), [8, 16, 9, 17, 10, 16]);
        blood(c, [7, 10]);
      }
      grass(c, [1, 13], b);
    },
    sw: 12, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      rubble(c, 2, 12, 9, b, STONE, 5);
      c.col(2, 12, b, L(STONE));
      c.rect(1, b - 1, 10, b, STONE);
      c.rect(1, 6, 10, 11, STONE);
      c.rect(1, 4, 10, 5, TAR);
      c.row(4, 1, 10, hex('#5a5258'));
      c.col(1, 7, 15, SOOT);
      c.row(16, 1, 9, L(STONE));
      dots(c, C.moss, [3, b, 8, b - 2, 9, 9]);
      if (u) {
        c.set(0, 12, C.flameLight);
        c.set(1, 12, C.flame);
        dots(c, GRAIN, [0, 16, 1, 17]);
      }
      grass(c, [10], b);
    },
  });

  add('rural-electric-fence-box', 'electric fence energiser box on a post wire insulators warning sign', {
    w: 18, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 8, 3, b, GREYW);
      c.row(5, 1, 16, C.iron); // the wire
      c.rect(7, 4, 10, 6, hex('#2c2a30'));
      c.rect(4, 9, 13, 17, FYELLOW);
      c.row(9, 4, 13, L(FYELLOW));
      c.col(13, 9, 17, D(FYELLOW));
      rust(c, 4, 9, 13, 17, 3, 7);
      c.rect(6, 11, 9, 13, SOOT); // the dial
      c.set(7, 12, C.bone);
      c.set(11, 11, u ? C.red : hex('#5a2c2c'));
      c.rect(5, 15, 12, 15, D(FYELLOW));
      c.line(10, 8, 10, 6, SOOT);
      c.rect(6, 19, 11, 22, hex('#b8a84a')); // the sign
      c.rect(8, 20, 9, 21, SOOT);
      if (u) {
        dots(c, C.glow, [2, 4, 3, 3, 1, 3, 3, 6, 2, 7]); // it ticks, and something touched it
        dots(c, C.flameLight, [2, 5, 12, 10, 12, 12]);
        c.rect(1, b - 1, 4, b, hex('#18161c'));
        c.set(5, b, hex('#55525c'));
        c.set(2, b - 2, hex('#18161c'));
      }
      grass(c, [6, 13], b);
    },
    sw: 10, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      post(c, 4, 3, b, GREYW);
      c.rect(3, 4, 6, 6, hex('#2c2a30'));
      c.set(4, 5, C.steel);
      c.rect(2, 9, 3, 17, FYELLOW);
      c.col(2, 9, 17, L(FYELLOW));
      c.set(1, 11, u ? C.red : hex('#5a2c2c'));
      c.rect(2, 19, 3, 22, hex('#b8a84a'));
      if (u) {
        dots(c, C.glow, [5, 3, 7, 4, 6, 7]);
        c.rect(6, b - 1, 8, b, hex('#18161c'));
      }
      grass(c, [7], b);
    },
  });

  /* ---------- the farmhouse ---------- */
  add('rural-farmhouse-stove', 'farmhouse stove cast iron range cooker stovepipe kettle oven kitchen', {
    w: 30, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(20, 1, 23, 21, C.ironDark); // the pipe
      c.col(20, 1, 21, C.iron);
      c.row(8, 20, 23, C.iron);
      c.rect(2, 22, 27, b - 2, STOVE);
      c.rect(1, 20, 28, 21, C.iron);
      c.row(20, 1, 28, C.steel);
      c.col(2, 22, b - 2, C.iron);
      c.rect(3, b - 1, 5, b, STOVE);
      c.rect(24, b - 1, 26, b, STOVE);
      c.rect(4, 24, 12, 30, u ? SOOT : C.ironDark); // the firebox
      c.frame(4, 24, 12, 30, C.iron);
      c.rect(15, 24, 25, 34, C.ironDark); // the oven
      c.frame(15, 24, 25, 34, C.iron);
      c.rect(18, 26, 22, 26, C.steel);
      c.rect(4, 32, 12, 35, C.ironDark); // ash drawer
      c.set(8, 33, C.steel);
      c.row(23, 3, 26, C.brass); // the rail
      c.rect(22, 23, 25, 27, hex('#8a8a7a')); // a cloth
      c.rect(6, 15, 12, 19, hex('#3a3a44')); // the kettle
      c.set(13, 16, hex('#3a3a44'));
      c.set(14, 15, hex('#3a3a44'));
      c.row(14, 7, 11, C.iron);
      c.set(6, 15, null);
      c.set(7, 16, C.steel);
      dots(c, C.rust, [14, 28, 26, 36, 5, 37]);
      if (!u) {
        for (let x = 6; x < 12; x += 2) c.col(x, 26, 28, C.iron);
      } else {
        fire(c, 5, 11, 29, 4, 3);
        c.rect(1, 24, 3, 30, C.iron); // the door swung back
        dots(c, hex('#7a4a2a'), [4, 31, 8, 31, 12, 31, 7, b, 10, b, 13, 30]);
        wisp(c, 15, 13, 4, C.ghost);
        dots(c, C.ghost, [16, 12, 17, 10]);
      }
    },
    sw: 16, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      c.rect(9, 1, 12, 21, C.ironDark);
      c.col(9, 1, 21, C.iron);
      c.row(8, 9, 12, C.iron);
      c.rect(3, 22, 13, b - 2, STOVE);
      c.rect(1, 20, 14, 21, C.iron);
      c.row(20, 1, 14, C.steel);
      c.col(3, 22, b - 2, C.iron);
      c.rect(3, b - 1, 5, b, STOVE);
      c.rect(11, b - 1, 13, b, STOVE);
      panel(c, 5, 25, 11, 35, STOVE);
      c.set(2, 23, C.brass);
      c.rect(4, 15, 9, 19, hex('#3a3a44'));
      c.set(3, 16, hex('#3a3a44'));
      c.row(14, 5, 8, C.iron);
      if (u) {
        c.rect(0, 24, 2, 30, C.iron);
        c.col(2, 25, 29, C.flame);
        dots(c, hex('#7a4a2a'), [1, 31, 0, b, 2, b]);
        wisp(c, 2, 14, 4, C.ghost);
      }
    },
  });

  add('rural-porch-rocking-chair', 'rocking chair on a porch wooden rocker blanket farmhouse veranda', {
    w: 18, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [3, 13]) post(c, x, 3, 16, OAK);
      c.rect(3, 2, 14, 3, OAK);
      c.row(2, 3, 14, L(OAK));
      for (let x = 6; x < 13; x += 3) c.col(x, 4, 14, D(OAK));
      board(c, 2, 15, 15, 16, PALEW);
      c.rect(1, 11, 2, 12, OAK);
      c.rect(15, 11, 16, 12, OAK);
      c.col(2, 13, 14, D(OAK));
      c.col(15, 13, 14, D(OAK));
      legs(c, [3, 13], 17, b - 1, OAK);
      c.row(20, 5, 12, D(OAK));
      c.rect(2, b, 5, b, OAK); // rockers, end on
      c.rect(12, b, 15, b, OAK);
      if (!u) {
        c.rect(5, 12, 12, 14, hex('#5a3a44')); // a blanket folded on the seat
        c.row(12, 5, 12, hex('#74505a'));
      } else {
        c.rect(4, 5, 13, 14, hex('#5a3a44')); // the blanket over the back, as if someone had just got up
        c.row(5, 4, 13, hex('#74505a'));
        for (const x of [6, 9, 12]) c.col(x, 6, 14, hex('#44283a'));
        c.rect(10, 15, 14, 21, hex('#5a3a44'));
        c.set(12, 22, hex('#5a3a44'));
        c.rect(5, 14, 8, 14, hex('#3a3a44')); // and what they were holding
        c.line(8, 14, 9, 9, C.iron);
      }
    },
    sw: 24, sh: 28,
    s(c, u) {
      const b = c.h - 2,
        t = u ? 2 : 0; // rocked back
      c.line(15 + t, 16, 18 + t * 2, 2, OAK); // the back
      c.line(16 + t, 16, 19 + t * 2, 2, D(OAK));
      board(c, 5, 15 - (u ? 1 : 0), 16 + t, 16 - (u ? 1 : 0), PALEW);
      c.line(5, 11 - t, 16 + t, 12, OAK); // the arm
      c.col(6, 12 - t, 14, D(OAK));
      c.line(6, 17, 5, b - 2 - t, OAK);
      c.line(15 + t, 17, 17 + t, b - 1, OAK);
      for (let x = 2; x <= 21; x++) {
        const y = b - Math.round(((x - (u ? 15 : 11)) / 10) ** 2 * 3);
        c.set(x, y, OAK); // the rocker
      }
      if (!u) {
        c.rect(7, 12, 13, 14, hex('#5a3a44'));
        c.row(12, 7, 13, hex('#74505a'));
      } else {
        c.line(16, 14, 20, 3, hex('#5a3a44'));
        c.line(17, 14, 21, 3, hex('#74505a'));
        c.line(15, 14, 19, 5, hex('#44283a'));
        c.rect(8, 13, 12, 13, hex('#3a3a44'));
      }
    },
    su: [0, 0, 2],
  });

  add('rural-mud-boots', 'mud boots wellingtons rubber boots pair by the door farm', {
    w: 16, h: 14, solid: false,
    f(c, u) {
      const b = c.h - 2;
      const boot = (x) => {
        c.rect(x, 2, x + 4, b, BOOT);
        c.col(x, 2, b, L(BOOT));
        c.row(2, x, x + 4, SOOT);
        c.row(b, x, x + 4, MUD);
        c.set(x + 2, b - 1, MUD);
      };
      boot(2);
      if (!u) boot(9);
      else {
        c.rect(7, b - 4, 14, b, BOOT); // one on its side, and it is not empty
        c.row(b - 4, 7, 14, L(BOOT));
        c.col(14, b - 4, b, SOOT);
        c.rect(15, b - 3, 15, b - 1, C.bone);
        c.row(b, 7, 13, MUD);
        dots(c, MUD, [1, b, 6, b, 10, b - 5]);
      }
    },
    sw: 16, sh: 14,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        c.rect(6, 2, 10, b, BOOT);
        c.rect(3, b - 3, 10, b, BOOT);
        c.set(3, b - 3, null);
        c.col(10, 2, b, D(BOOT));
        c.row(2, 6, 10, SOOT);
        c.row(b, 3, 10, MUD);
        c.col(6, 3, b - 4, L(BOOT));
        dots(c, MUD, [4, b - 1, 7, b - 2]);
      } else {
        c.rect(2, b - 4, 12, b, BOOT);
        c.rect(1, b - 8, 5, b - 4, BOOT);
        c.row(b - 4, 6, 12, L(BOOT));
        c.col(12, b - 4, b, SOOT);
        c.rect(13, b - 3, 14, b - 2, C.bone);
        c.row(b, 2, 12, MUD);
        c.set(1, b - 8, null);
      }
    },
  });

  /* ---------- fuel and cold ---------- */
  add('rural-fuel-tank-raised', 'raised fuel tank diesel tank on legs farm bowser hose nozzle', {
    w: 34, h: 30, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (const x of [6, 26]) {
        c.line(x, 15, x - 2, b, C.iron);
        c.line(x + 1, 15, x + 3, b, C.ironDark);
      }
      c.row(21, 5, 28, C.ironDark);
      c.rect(3, 3, 30, 14, FGREEN);
      c.col(2, 5, 12, FGREEN);
      c.col(31, 5, 12, D(FGREEN));
      c.row(3, 3, 30, L(FGREEN));
      c.row(4, 3, 30, L(FGREEN));
      c.row(14, 3, 30, D(FGREEN));
      c.col(8, 3, 14, D(FGREEN));
      c.col(25, 3, 14, D(FGREEN));
      rust(c, 3, 5, 30, 14, 4, 8);
      c.rect(15, 1, 18, 2, C.iron); // the filler
      c.rect(11, 7, 21, 10, LIME);
      dots(c, SOOT, [12, 8, 13, 9, 15, 8, 16, 9, 18, 8, 19, 9, 20, 8]);
      c.rect(28, 13, 29, 16, C.ironDark); // the tap
      if (!u) {
        c.line(29, 16, 30, 22, SOOT); // hose looped up
        c.line(30, 22, 26, 17, SOOT);
        c.rect(25, 15, 26, 17, C.steel);
      } else {
        c.line(29, 16, 31, b - 1, SOOT); // the nozzle left on the ground, running
        c.rect(27, b - 1, 30, b, C.steel);
        c.row(b, 12, 26, hex('#2a2430'));
        c.row(b - 1, 20, 25, hex('#2a2430'));
        dots(c, hex('#5a4a6a'), [15, b, 22, b - 1]);
        dots(c, hex('#4a6a5a'), [18, b, 24, b]);
      }
      grass(c, [1, 32], b);
    },
    sw: 18, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.col(4, 15, b, C.iron);
      c.col(13, 15, b, C.ironDark);
      c.row(21, 4, 13, C.ironDark);
      c.oval(3, 3, 14, 14, FGREEN);
      c.oval(4, 4, 13, 13, L(FGREEN));
      c.oval(5, 5, 14, 14, FGREEN);
      rust(c, 4, 4, 13, 13, 5, 6);
      c.rect(8, 1, 9, 2, C.iron);
      c.rect(8, 13, 9, 16, C.ironDark);
      if (!u) {
        c.col(9, 17, 21, SOOT);
        c.rect(10, 17, 11, 19, C.steel);
      } else {
        c.line(9, 17, 7, b - 1, SOOT);
        c.rect(5, b - 1, 7, b, C.steel);
        c.row(b, 1, 6, hex('#2a2430'));
        dots(c, hex('#5a4a6a'), [2, b]);
      }
    },
  });

  const drum = (c, x0, y0, x1, y1, col) => {
    c.rect(x0, y0, x1, y1, col);
    c.col(x0, y0, y1, L(col));
    c.col(x1, y0, y1, D(col));
    c.row(y0, x0, x1, L(col));
    const m = (y0 + y1) >> 1;
    c.row(m - 2, x0, x1, D(col));
    c.row(m + 2, x0, x1, D(col));
    c.row(y1, x0, x1, D(col));
  };
  add('rural-oil-drums', 'oil drums barrels steel drums diesel rusty farm yard', {
    w: 30, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      drum(c, 1, b - 13, 9, b, FBLUE);
      drum(c, 10, b - 13, 18, b, hex('#7a4a30'));
      rust(c, 1, b - 13, 18, b, 3, 6);
      c.rect(3, b - 14, 5, b - 14, C.iron);
      if (!u) {
        drum(c, 19, b - 13, 27, b, FGREEN);
        c.rect(12, b - 15, 16, b - 14, hex('#7a8a9a')); // a funnel
        c.set(14, b - 13, hex('#7a8a9a'));
      } else {
        c.rect(15, b - 8, 28, b, FGREEN); // one over, and the ground black
        c.row(b - 8, 15, 28, L(FGREEN));
        c.row(b, 15, 28, D(FGREEN));
        c.col(19, b - 8, b, D(FGREEN));
        c.col(24, b - 8, b, D(FGREEN));
        c.col(28, b - 7, b - 1, SOOT);
        c.clear(29, b);
        c.row(b, 20, 29, OIL);
        c.set(29, b - 1, OIL);
        c.row(b, 0, 14, OIL);
        dots(c, hex('#5a4a6a'), [4, b, 22, b]);
      }
    },
    sw: 14, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      drum(c, 2, b - 13, 10, b, FBLUE);
      rust(c, 2, b - 13, 10, b, 6, 6);
      if (u) {
        c.oval(3, b - 9, 12, b, FGREEN);
        c.oval(4, b - 8, 11, b - 1, D(FGREEN));
        c.set(6, b - 6, SOOT);
        c.row(b, 0, 13, OIL);
        c.row(b - 1, 5, 9, OIL);
      } else c.rect(4, b - 14, 6, b - 14, C.iron);
    },
  });

  add('rural-pig-sty', 'pig sty low wall shelter tin roof trough gate pig farm', {
    w: 38, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      boards(c, 3, 6, 20, 13, GREYW, 4); // the shelter behind
      corr(c, 1, 2, 22, 5, ZINC);
      c.row(2, 1, 22, L(ZINC));
      rust(c, 1, 2, 22, 5, 3, 6);
      hollow(c, 8, 8, 15, 13);
      if (!u) {
        c.rect(22, 10, 31, 14, PIG); // a pig's back over the wall
        c.row(10, 23, 30, L(PIG));
        c.rect(31, 11, 33, 13, PIG);
        c.set(33, 10, PIG);
        c.set(34, 12, hex('#a87a70'));
        c.set(32, 12, SOOT);
        c.set(21, 11, hex('#a87a70'));
      } else dots(c, C.glow, [10, 11, 12, 11]); // in the dark of the shelter, waiting
      bricks(c, 1, 14, 36, b, BRICK, 5);
      c.row(13, 1, 36, STONE);
      c.rect(24, 15, 33, b, SOOT);
      if (!u) {
        for (const y of [15, 18, 21]) c.row(y, 24, 33, GREYW); // the gate
        c.col(24, 15, b, GREYW);
        c.col(33, 15, b, D(GREYW));
        c.line(25, b - 1, 32, 16, D(GREYW));
        c.set(34, 18, C.iron);
      } else {
        c.rect(24, 15, 33, b, MUD); // the gate open on trodden mud
        c.rect(22, 15, 23, b, GREYW);
        dots(c, SOIL, [26, b, 29, b - 1, 31, b, 27, 18, 30, 20]);
        blood(c, [28, b, 29, b, 30, b - 1, 27, b - 3, 32, b - 2]);
        c.rect(26, b - 6, 28, b - 5, hex('#3a2c24')); // a boot in it
      }
      c.rect(3, b - 3, 14, b, STONE); // the trough
      c.row(b - 3, 4, 13, u ? C.blood : hex('#6a5a3a'));
      dots(c, C.moss, [2, b, 18, b, 35, b - 1, 20, 16]);
    },
    sw: 22, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      boards(c, 9, 6, 19, 13, GREYW, 4);
      for (let i = 0; i < 2; i++) c.line(7, 5 + i, 20, 2 + i, i ? D(ZINC) : ZINC);
      bricks(c, 1, 14, 20, b, BRICK, 7);
      c.row(13, 1, 20, STONE);
      c.rect(0 + 1, b - 3, 3, b, STONE);
      if (!u) {
        c.rect(3, 9, 8, 13, PIG);
        c.row(9, 4, 7, L(PIG));
        c.rect(4, 11, 7, 13, hex('#a87a70'));
        dots(c, SOOT, [5, 12, 6, 12, 3, 10, 8, 10]);
      } else {
        blood(c, [4, b, 5, b, 2, b - 3]);
        c.rect(0, 15, 1, b, GREYW);
      }
      dots(c, C.moss, [6, b, 17, b - 1]);
    },
  });

  add('rural-chest-freezer-barn', 'chest freezer in the barn white enamel rusty deep freeze padlock cable', {
    w: 32, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 6, 29, b - 1, ENAMEL);
      c.col(2, 6, b - 1, L(ENAMEL));
      c.col(29, 6, b - 1, D(ENAMEL));
      c.row(b - 1, 2, 29, D(ENAMEL));
      c.rect(3, b, 5, b, SOOT);
      c.rect(26, b, 28, b, SOOT);
      rust(c, 2, 8, 29, b - 1, 3, 9);
      dots(c, C.rust, [3, b - 2, 4, b - 1, 27, b - 2, 28, b - 1, 14, b - 1]);
      c.rect(22, 9, 27, 10, hex('#7a7a72')); // the badge
      c.set(24, 12, u ? hex('#5a8a5a') : hex('#5a5a52'));
      c.line(30, b - 3, 31, b, SOOT); // the cable
      if (!u) {
        c.rect(1, 3, 30, 5, ENAMEL);
        c.row(3, 1, 30, L(ENAMEL));
        c.row(5, 1, 30, hex('#55524a'));
        c.rect(14, 5, 17, 5, C.steel);
        c.rect(15, 6, 16, 8, C.brass); // padlocked
        dots(c, C.rust, [6, 4, 20, 3]);
      } else {
        c.rect(1, -7, 30, -5, ENAMEL); // the lid up; frost, and something long in a sheet of plastic
        c.row(-7, 1, 30, L(ENAMEL));
        c.rect(2, -4, 29, 4, hex('#8f9a9a'));
        c.row(4, 2, 29, hex('#6f7a7a'));
        c.rect(3, 5, 28, 6, hex('#c8d4d4'));
        c.rect(6, 4, 22, 5, hex('#9aa8b0'));
        c.rect(8, 4, 10, 4, C.flesh);
        dots(c, hex('#c8d4d4'), [5, 3, 12, 2, 20, 3, 26, 2, 16, 1]);
        wisp(c, 9, 2, 3, C.ghost);
        wisp(c, 21, 1, 4, C.ghost);
        c.rect(18, b, 20, b, C.brass);
        c.set(21, b - 1, C.iron);
      }
    },
    u: [0, 8, 0],
    sw: 16, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 6, 13, b - 1, ENAMEL);
      c.col(2, 6, b - 1, L(ENAMEL));
      c.col(13, 6, b - 1, D(ENAMEL));
      c.rect(3, b, 4, b, SOOT);
      c.rect(11, b, 12, b, SOOT);
      rust(c, 2, 8, 13, b - 1, 6, 8);
      for (let y = 9; y < b - 2; y += 2) c.row(y, 5, 10, D(ENAMEL)); // the grille
      if (!u) {
        c.rect(1, 3, 14, 5, ENAMEL);
        c.row(3, 1, 14, L(ENAMEL));
        c.row(5, 1, 14, hex('#55524a'));
        c.set(1, 6, C.brass);
      } else {
        c.rect(12, -7, 14, 4, ENAMEL);
        c.col(12, -7, 4, hex('#8f9a9a'));
        c.rect(3, 5, 12, 6, hex('#c8d4d4'));
        c.rect(4, 4, 9, 5, hex('#9aa8b0'));
        wisp(c, 6, 2, 3, C.ghost);
        c.set(1, b, C.brass);
      }
    },
    su: [0, 8, 0],
  });

  add('rural-outhouse-privy', 'outhouse privy earth closet wooden toilet shed crescent moon door tin roof', {
    w: 20, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      boards(c, 2, 6, 17, b, GREYW, 4);
      corr(c, 1, 2, 18, 5, ZINC);
      c.row(2, 1, 18, L(ZINC));
      rust(c, 1, 2, 18, 5, 4, 6);
      c.rect(4, 9, 15, b, OAK);
      if (!u) {
        boards(c, 5, 10, 14, b, PALEW, 3);
        c.row(14, 5, 14, D(PALEW));
        c.row(b - 6, 5, 14, D(PALEW));
        c.rect(9, 16, 10, 18, SOOT); // the moon cut in it
        c.set(11, 17, SOOT);
        c.set(9, 17, PALEW);
        c.rect(13, 24, 13, 25, C.iron);
      } else {
        hollow(c, 5, 10, 14, b);
        c.rect(5, 10, 6, b, PALEW); // the door back on its hinges
        c.col(6, 10, b, D(PALEW));
        board(c, 7, 27, 14, 28, PALEW); // the seat
        c.rect(7, 29, 14, b, mix(GREYW, 0.6));
        c.rect(10, 27, 12, 27, SOOT);
        c.rect(11, 25, 11, 26, C.flesh); // fingers on the rim of the hole
        c.set(12, 26, C.flesh);
        c.set(10, 26, C.flesh);
        dots(c, SOOT, [9, 15, 12, 18, 10, 21, 13, 13]); // flies
        c.rect(13, 20, 14, 23, C.paper);
      }
      dots(c, C.moss, [3, b, 16, b - 1, 2, 30]);
      grass(c, [1, 18], b);
    },
    sw: 18, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      boards(c, 2, 6, 15, b, GREYW, 4);
      for (let i = 0; i < 3; i++) c.line(1, 2 + i, 16, 5 + i, i === 0 ? L(ZINC) : i === 1 ? ZINC : D(ZINC));
      c.clearRect(2, 2, 15, 4);
      for (let i = 0; i < 3; i++) c.line(1, 2 + i, 16, 5 + i, i === 0 ? L(ZINC) : i === 1 ? ZINC : D(ZINC));
      c.rect(7, 12, 10, 14, SOOT); // a vent
      c.row(13, 7, 10, GREYW);
      if (u) {
        boards(c, -7, 10, 1, b, PALEW, 3); // the door open
        c.row(14, -7, 1, D(PALEW));
        c.row(b - 6, -7, 1, D(PALEW));
        c.rect(-4, 16, -3, 18, SOOT);
        dots(c, SOOT, [-2, 8, 0, 6]);
      } else c.col(1, 10, b, PALEW);
      dots(c, C.moss, [4, b, 13, b - 1]);
      grass(c, [16], b);
    },
    su: [8, 0, 0],
  });
};
