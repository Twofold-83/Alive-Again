/* Rural, part 3: cellar and stable doors, the cattle crush, the workshop, the farmhouse kitchen, things at the
 * lane's end, poles and crops. Part of tools/big/env2-country.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { P, D, L, dots, board, face, panel, post, legs, planksV, planksH, boards, boardsH, hollow, pane, flame, fire, wisp, bush, stones, rubble, bricks } = H;
  const { wheel, tyre, barrel, sack, crate, hay, heap, blood, puddle, drip, shards, grass, crow, rope, chain, lantern, shape, loaf } = H;
  const add = H.reg('env-rural', 'Rural');
  const { OAK, GREYW, PALEW, TAR, HAY, BRICK, LIME, STONE, SOIL, MUD, SOOT, TIN, ZINC, WAT, MILK, ROPE, SACK, FRED, FGREEN, FBLUE, FYELLOW, LAMP } = P;
  const HORSE = hex('#4a3428'),
    CHINA = hex('#cfcab8'),
    BLUE = hex('#4a6a8a'),
    STALK = hex('#6f7a40'),
    DRY = hex('#a89650'),
    AMBER = hex('#a8782a'),
    GRAIN = hex('#b09648');
  const rust = (c, x0, y0, x1, y1, seed = 1, n = 9) => c.speckle(x0, y0, x1, y1, C.rust, n, seed);
  const bees = (c, x0, y0, x1, y1, n, seed) => {
    const r = rnd(seed);
    for (let i = 0; i < n; i++) c.set(x0 + Math.floor(r() * (x1 - x0 + 1)), y0 + Math.floor(r() * (y1 - y0 + 1)), r() < 0.5 ? C.mustard : SOOT);
  };

  /* ---------- doors ---------- */
  add('rural-storm-cellar-doors', 'storm cellar doors root cellar bulkhead sloping double doors padlock chain', {
    w: 32, h: 17, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 11, 30, b, STONE);
      c.row(11, 1, 30, L(STONE));
      c.col(10, 12, b, D(STONE));
      c.col(21, 12, b, D(STONE));
      c.poly([[3, 10], [28, 10], [26, 3], [5, 3]], GREYW);
      c.row(3, 5, 26, L(GREYW));
      for (const x of [9, 12, 19, 22]) c.line(x, 4, x + (x < 15 ? -1 : 1), 10, D(GREYW));
      c.row(5, 6, 25, D(GREYW));
      c.row(9, 4, 27, D(GREYW));
      dots(c, C.iron, [5, 5, 26, 5, 4, 9, 27, 9]);
      dots(c, C.moss, [2, b, 14, b, 29, b - 1, 6, 10]);
      if (!u) {
        c.col(15, 3, 10, SOOT);
        c.col(16, 3, 10, D(GREYW));
        chain(c, 12, 7, 19, 7);
        c.rect(15, 8, 16, 9, C.brass);
      } else {
        c.poly([[16, 10], [28, 10], [26, 3], [16, 3]], SOOT); // one leaf thrown back, and a light below
        c.rect(16, 8, 26, 8, hex('#6a5c30'));
        c.rect(17, 6, 25, 6, hex('#4a4028'));
        c.rect(16, 9, 27, 10, hex('#8a7a40'));
        c.col(15, 3, 10, D(GREYW));
        c.rect(27, -5, 29, 9, GREYW); // the leaf standing open
        c.col(27, -5, 9, L(GREYW));
        c.col(29, -5, 9, D(GREYW));
        c.set(28, 0, C.iron);
        chain(c, 12, 7, 13, 12);
        c.rect(12, b - 1, 13, b, C.brass);
        blood(c, [18, 9, 19, 10, 21, 10]);
      }
    },
    u: [0, 6, 0],
    sw: 22, sh: 17,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[3, 3], [5, 3], [19, 10], [19, b], [3, b]], STONE);
      c.col(3, 3, b, L(STONE));
      c.row(11, 4, 19, D(STONE));
      c.col(11, 8, b, D(STONE));
      for (let i = 0; i < 2; i++) c.line(4, 2 + i - 1 + 1, 19, 9 + i, i ? D(GREYW) : GREYW);
      dots(c, C.moss, [4, b, 16, b, 8, 9]);
      if (!u) dots(c, C.iron, [7, 4, 16, 8]);
      else {
        c.line(6, 3, 12, -5, GREYW); // the near leaf up
        c.line(7, 3, 13, -5, L(GREYW));
        c.line(12, 6, 18, -2, GREYW);
        c.line(12, 6, 6, 3, GREYW);
        c.line(18, -2, 12, -5, GREYW);
        dots(c, hex('#8a7a40'), [8, 4, 10, 5, 12, 5]);
      }
    },
    su: [0, 6, 0],
  });

  add('rural-stable-door', 'stable door split door half door horse loose box farm green paint bolt', {
    w: 22, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 20, b, OAK);
      c.row(2, 1, 20, L(OAK));
      c.col(1, 2, b, L(OAK));
      boards(c, 3, 21, 18, b, FGREEN, 4); // the lower half
      c.row(21, 3, 18, L(FGREEN));
      c.line(4, b - 1, 17, 23, D(FGREEN));
      c.rect(15, 24, 18, 25, C.iron);
      dots(c, hex('#8a8f86'), [6, 27, 10, 33, 14, 30, 5, 35]);
      if (!u) {
        boards(c, 3, 5, 18, 19, FGREEN, 4);
        c.line(4, 18, 17, 6, D(FGREEN));
        c.rect(15, 12, 18, 13, C.iron);
        c.row(20, 3, 18, SOOT);
      } else {
        hollow(c, 3, 5, 18, 20); // the top half open, and the horse standing far too still
        c.rect(8, 8, 13, 14, HORSE);
        c.rect(9, 14, 12, 19, HORSE);
        c.col(8, 8, 14, L(HORSE));
        c.set(8, 7, HORSE);
        c.set(13, 7, HORSE);
        c.rect(10, 9, 11, 16, hex('#b0a890')); // a blaze
        c.set(9, 11, C.white);
        c.set(12, 11, C.white);
        c.rect(10, 18, 11, 19, SOOT);
        c.rect(3, 5, 4, 20, FGREEN);
        c.col(4, 5, 20, D(FGREEN));
      }
      c.rect(1, b + 0, 20, b, STONE);
      dots(c, HAY, [5, b, 9, b, 16, b]);
    },
    sw: 8, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 5, b, OAK);
      c.col(2, 2, b, L(OAK));
      c.row(2, 2, 5, L(OAK));
      c.col(6, 21, b, FGREEN);
      if (!u) c.col(6, 5, 19, FGREEN);
      else {
        boards(c, 7, 5, 15, 19, FGREEN, 4);
        c.line(8, 18, 14, 6, D(FGREEN));
        c.rect(13, 12, 15, 13, C.iron);
        c.rect(5, 10, 6, 13, HORSE); // a nose
        c.set(4, 12, hex('#b0a890'));
      }
      dots(c, HAY, [3, b, 7, b]);
    },
    su: [0, 0, 9],
  });

  add('rural-cattle-crush', 'cattle crush squeeze chute steel head gate stock handling farm', {
    w: 38, h: 30, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        ST = hex('#5f6a70');
      for (const x of [3, 14, 25, 34]) {
        c.rect(x, 3, x + 1, b, ST);
        c.col(x, 3, b, L(ST));
      }
      c.rect(3, 2, 35, 3, ST);
      c.row(2, 3, 35, L(ST));
      for (const y of [9, 14, 19, 24]) c.row(y, 5, 33, D(ST));
      c.rect(2, b - 1, 36, b, C.ironDark);
      rust(c, 3, 2, 35, b, 4, 9);
      c.line(4, 4, 1, 1, C.iron); // the lever of the head gate
      c.rect(0, 1, 1, 2, FRED);
      c.rect(34, 6, 36, 22, ST); // the back gate
      c.row(13, 34, 36, D(ST));
      dots(c, hex('#6a5a3a'), [8, b - 2, 18, b - 2, 28, b - 2]); // muck
      if (u) {
        c.line(4, 4, 0, 7, C.iron); // shut on something
        c.rect(-1, 7, 0, 8, FRED);
        blood(c, [2, 10, 3, 12, 2, 14, 4, 16, 3, 20, 5, b - 2, 6, b - 2, 2, b, 1, b, 7, 14, 8, 15]);
        c.rect(5, 11, 8, 13, hex('#6a5a48')); // hide and hair on the bars
        dots(c, hex('#6a5a48'), [9, 12, 6, 14, 16, 19]);
        chain(c, 20, 4, 20, 12);
        c.set(20, 13, C.steel);
        c.set(19, 13, C.steel);
      }
    },
    u: [1, 0, 0],
    sw: 18, sh: 30,
    s(c, u) {
      const b = c.h - 2,
        ST = hex('#5f6a70');
      for (const x of [2, 14]) {
        c.rect(x, 3, x + 1, b, ST);
        c.col(x, 3, b, L(ST));
      }
      c.rect(2, 2, 15, 3, ST);
      c.row(2, 2, 15, L(ST));
      c.rect(1, b - 1, 16, b, C.ironDark);
      rust(c, 2, 2, 15, b, 6, 9);
      const g = u ? 1 : 3; // how far the yoke stands open
      c.line(8 - g - 2, 4, 8 - g, 14, ST);
      c.line(8 - g, 14, 8 - g - 2, b - 2, ST);
      c.line(9 + g + 2, 4, 9 + g, 14, D(ST));
      c.line(9 + g, 14, 9 + g + 2, b - 2, D(ST));
      c.rect(15, 1, 16, 2, FRED);
      if (u) {
        blood(c, [8, 12, 9, 13, 8, 15, 9, 17, 8, 20, 8, b - 2, 9, b - 2, 7, b]);
        dots(c, hex('#6a5a48'), [7, 11, 10, 12]);
      }
    },
  });

  /* ---------- workshop and kitchen ---------- */
  add('rural-workbench-vice', 'workbench with a vice farm workshop tools oil can hammer saw shed', {
    w: 32, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      legs(c, [2, 27], 12, b, OAK, 3);
      c.rect(1, 9, 30, 11, PALEW);
      c.row(9, 1, 30, L(PALEW));
      c.row(11, 1, 30, D(PALEW));
      board(c, 5, 17, 26, 18, GREYW);
      c.rect(7, 13, 10, 16, FRED); // tins on the shelf
      c.rect(12, 14, 14, 16, FBLUE);
      c.rect(16, 13, 19, 16, hex('#6a6a5a'));
      c.set(20, 12, hex('#6a6a5a'));
      c.set(21, 11, hex('#6a6a5a'));
      c.rect(4, 5, 9, 8, C.iron); // the vice
      c.rect(3, 3, 4, 6, C.iron);
      c.rect(8, 3, 9, 6, C.ironDark);
      c.row(3, 3, 4, C.steel);
      c.row(7, 0 + 1, 3, C.steel);
      c.set(1, 8, C.steel);
      dots(c, C.steel, [22, 12, 23, 13, 24, 12]);
      if (!u) {
        c.line(14, 8, 20, 8, OAK); // hammer
        c.rect(20, 7, 22, 8, C.iron);
        c.rect(24, 5, 29, 8, C.steel); // a saw laid down
        c.rect(27, 5, 29, 8, OAK);
        for (let x = 24; x < 27; x++) c.set(x, 8, x % 2 ? C.iron : C.steel);
      } else {
        c.rect(5, 1, 7, 5, C.bone); // something clamped in the vice, half sawn
        c.rect(5, 0, 7, 0, hex('#b0a890'));
        c.set(6, 3, hex('#7a2c2c'));
        c.line(8, 3, 16, 5, C.steel); // the saw left in the cut
        c.rect(16, 4, 19, 7, OAK);
        dots(c, C.bone, [10, 8, 12, 8, 4, 8, 6, b, 9, b, 3, b - 1]); // dust
        blood(c, [6, 6, 5, 9, 5, 10, 6, 12, 5, b]);
        c.line(22, 8, 27, 8, OAK);
        c.rect(27, 7, 29, 8, C.iron);
      }
    },
    u: [0, 1, 0],
    sw: 14, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [2, 9], 12, b, OAK, 3);
      c.rect(1, 9, 12, 11, PALEW);
      c.row(9, 1, 12, L(PALEW));
      c.row(11, 1, 12, D(PALEW));
      board(c, 3, 17, 10, 18, GREYW);
      c.rect(5, 13, 8, 16, FRED);
      c.rect(4, 3, 8, 8, C.iron);
      c.row(3, 4, 8, C.steel);
      c.col(6, 4, 8, C.ironDark);
      if (u) {
        c.rect(5, 0, 7, 3, C.bone);
        c.row(2, 2, 10, C.steel);
        blood(c, [6, 9, 6, 10, 5, 12, 6, b]);
        dots(c, C.bone, [3, 8, 10, 8, 2, b]);
      }
    },
    su: [0, 1, 0],
  });

  add('rural-farmhouse-table', 'farmhouse kitchen table scrubbed pine oil lamp plates bread supper', {
    w: 34, h: 22, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      legs(c, [3, 28], 12, b, PALEW, 3);
      c.rect(2, 10, 31, 12, PALEW);
      c.row(9, 1, 32, L(PALEW));
      c.row(10, 1, 32, PALEW);
      c.row(12, 2, 31, D(PALEW));
      c.rect(13, 11, 20, 12, D(PALEW)); // the drawer
      c.set(16, 12, C.brass);
      c.rect(15, 7, 18, 8, C.brass); // the lamp
      c.rect(16, 3, 17, 6, u ? LAMP : hex('#5d7f8c'));
      c.set(16, 2, hex('#9ebcc2'));
      if (u) {
        c.set(16, 5, C.flame);
        dots(c, LAMP, [14, 4, 19, 4, 15, 2, 18, 2]);
      }
      c.rect(5, 8, 10, 8, CHINA); // plates
      c.rect(23, 8, 28, 8, CHINA);
      loaf(c, 11, 8, 4);
      if (!u) {
        c.rect(21, 6, 22, 8, hex('#7a8a9a')); // a mug
        c.row(7, 6, 9, hex('#7a6a4a'));
      } else {
        c.row(7, 6, 9, hex('#5a6a3a')); // supper left three days: mould, flies
        c.row(7, 24, 27, hex('#5a6a3a'));
        dots(c, SOOT, [7, 5, 10, 4, 25, 5, 22, 3, 12, 5]);
        c.rect(20, 7, 22, 8, hex('#7a8a9a')); // the mug over
        c.row(8, 18, 19, hex('#4a3a2a'));
        drip(c, 19, 9, 13, hex('#4a3a2a'));
        c.line(29, 8, 30, 5, C.steel); // a knife upright in the board
        c.set(30, 4, OAK);
        shards(c, 6, 11, b, CHINA, 4);
      }
    },
    sw: 20, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [3, 14], 12, b, PALEW, 3);
      c.rect(2, 10, 17, 12, PALEW);
      c.row(9, 1, 18, L(PALEW));
      c.row(12, 2, 17, D(PALEW));
      c.rect(8, 7, 11, 8, C.brass);
      c.rect(9, 3, 10, 6, u ? LAMP : hex('#5d7f8c'));
      c.set(9, 2, hex('#9ebcc2'));
      c.rect(3, 8, 6, 8, CHINA);
      c.rect(13, 8, 16, 8, CHINA);
      if (u) {
        c.set(9, 5, C.flame);
        dots(c, LAMP, [7, 4, 12, 4]);
        dots(c, SOOT, [4, 5, 14, 4, 6, 3]);
        c.row(7, 13, 15, hex('#5a6a3a'));
        shards(c, 12, 17, b, CHINA, 5);
      }
    },
  });

  const plate = (c, x, y) => {
    c.rect(x, y, x + 3, y + 3, CHINA);
    c.set(x, y, null);
    c.set(x + 3, y, null);
    c.set(x, y + 3, BLUE);
    c.set(x + 3, y + 3, BLUE);
    c.rect(x + 1, y + 1, x + 2, y + 2, BLUE);
    c.set(x + 1, y + 1, CHINA);
  };
  add('rural-farmhouse-dresser', 'farmhouse dresser kitchen dresser plates willow pattern cups cupboard drawers', {
    w: 28, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2,
        W = hex('#6a5038');
      face(c, 2, 3, 25, 23, mix(W, 0.7));
      c.rect(1, 2, 26, 3, W);
      c.row(2, 1, 26, L(W));
      for (const y of [9, 16, 23]) board(c, 2, y, 25, y + 1, W);
      c.col(2, 4, 23, L(W));
      c.col(25, 4, 23, D(W));
      face(c, 1, 25, 26, b - 1, W);
      for (const x of [3, 14]) {
        c.rect(x, 27, x + 10, 29, D(W)); // drawers
        c.set(x + 5, 28, C.brass);
        panel(c, x, 31, x + 10, b - 2, W);
      }
      c.rect(2, b, 4, b, W);
      c.rect(23, b, 25, b, W);
      for (const x of [4, 9, 14]) plate(c, x, 12);
      plate(c, 4, 5);
      plate(c, 19, 5);
      for (const x of [6, 10, 14, 18]) {
        c.rect(x, 18, x + 1, 19, CHINA); // cups on hooks
        c.set(x + 2, 18, CHINA);
      }
      c.rect(18, 20, 22, 22, hex('#7a6a4a')); // a crock
      if (!u) {
        plate(c, 9, 5);
        plate(c, 14, 5);
        plate(c, 19, 12);
        c.set(24, 35, C.brass);
        c.set(13, 35, C.brass);
      } else {
        shards(c, 3, 24, b, CHINA, 3);
        dots(c, BLUE, [6, b, 12, b - 1, 20, b]);
        dots(c, CHINA, [10, 8, 15, 8, 21, 15, 12, 24]);
        hollow(c, 14, 31, 24, b - 2); // one door open: jars, and one of them looks back
        c.rect(25, 31, 27, b - 2, W);
        c.col(27, 31, b - 2, D(W));
        c.rect(16, 33, 18, b - 2, hex('#6a7a5a'));
        c.rect(20, 34, 22, b - 2, hex('#7a6a4a'));
        c.set(17, 35, C.bone);
        c.set(17, 36, SOOT);
        c.set(13, 35, C.brass);
      }
    },
    u: [0, 0, 2],
    sw: 12, sh: 42,
    s(c, u) {
      const b = c.h - 2,
        W = hex('#6a5038');
      face(c, 6, 3, 10, 23, W);
      c.rect(5, 2, 11, 3, W);
      c.row(2, 5, 11, L(W));
      for (const y of [9, 16]) c.rect(4, y, 5, y + 1, W);
      face(c, 2, 25, 10, b - 1, W);
      c.rect(1, 24, 11, 25, W);
      c.row(24, 1, 11, L(W));
      panel(c, 4, 28, 8, b - 3, W);
      c.rect(2, b, 3, b, W);
      c.rect(9, b, 10, b, W);
      dots(c, CHINA, [4, 6, 5, 7, 4, 13, 5, 14]);
      c.rect(3, 22, 5, 23, hex('#7a6a4a'));
      if (u) {
        shards(c, 0, 3, b, CHINA, 5);
        c.rect(-3, 31, 1, b - 2, W);
        c.col(-3, 31, b - 2, L(W));
        c.set(4, 13, null);
        c.set(5, 14, null);
      }
    },
    su: [4, 0, 0],
  });

  /* ---------- at the lane's end ---------- */
  add('rural-mailbox-post', 'mailbox on a post rural letter box tin flag lane end', {
    w: 18, h: 26, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      post(c, 8, 11, b, GREYW);
      c.line(8, 15, 5, 11, D(GREYW));
      c.rect(3, 5, 14, 10, ZINC);
      c.row(4, 4, 13, L(ZINC));
      c.row(5, 3, 14, L(ZINC));
      c.row(10, 3, 14, D(ZINC));
      rust(c, 3, 5, 14, 10, 3, 7);
      dots(c, SOOT, [6, 8, 7, 7, 8, 8, 10, 7, 11, 8]); // a name, worn off
      if (!u) {
        c.col(2, 5, 10, D(ZINC));
        c.rect(10, 3, 13, 4, FRED); // the flag down
        c.set(13, 5, C.iron);
      } else {
        c.col(2, 5, 10, SOOT); // open, the flag up, and what came is not a letter
        c.rect(0, 10, 1, 10, ZINC);
        c.rect(12, 0, 14, 2, FRED);
        c.col(13, 3, 5, C.iron);
        c.rect(0, 8, 2, 9, C.paper);
        blood(c, [1, 9, 1, 11, 1, 13, 2, 16, 1, b]);
      }
      grass(c, [6, 11], b);
    },
    sw: 12, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      post(c, 5, 11, b, GREYW);
      c.rect(3, 5, 8, 10, ZINC);
      c.row(4, 4, 7, L(ZINC));
      c.col(3, 5, 10, L(ZINC));
      c.col(8, 5, 10, D(ZINC));
      c.set(5, 6, C.iron);
      if (!u) c.set(9, 4, FRED);
      else {
        c.rect(4, 5, 7, 9, SOOT);
        c.rect(3, 11, 8, 12, ZINC); // the flap hanging
        c.rect(4, 8, 6, 9, C.paper);
        c.rect(9, 0, 10, 2, FRED);
        c.col(9, 3, 5, C.iron);
        blood(c, [5, 9, 5, 13, 6, 15, 5, b]);
      }
      grass(c, [3, 8], b);
    },
  });

  add('rural-keep-out-sign', 'keep out sign hand painted board stakes warning trespassers farm lane', {
    w: 24, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 4, 4, b, GREYW);
      if (!u) post(c, 18, 4, b, GREYW);
      const sign = (dy) => {
        // dy(x): how much the board drops at x
        for (let x = 2; x <= 21; x++) {
          const o = dy(x);
          c.col(x, 4 + o, 14 + o, LIME);
          c.set(x, 4 + o, L(LIME));
          c.set(x, 14 + o, D(LIME));
          c.set(x, 9 + o, D(LIME));
        }
        const R = C.blood;
        for (const [x, y] of [[4, 6], [4, 7], [5, 6], [6, 7], [8, 6], [8, 7], [9, 6], [11, 6], [11, 7], [12, 6], [14, 6], [14, 7], [15, 7], [15, 6], [7, 11], [7, 12], [8, 11], [8, 12], [10, 11], [10, 12], [11, 12], [12, 11], [12, 12], [14, 11], [15, 11], [16, 11], [15, 12]]) c.set(x, y + dy(x), R);
        c.set(18, 6 + dy(18), SOOT); // a shot hole
        c.set(19, 12 + dy(19), SOOT);
      };
      if (!u) sign(() => 0);
      else {
        c.rect(18, b - 6, 19, b, GREYW); // one stake snapped: it hangs askew
        c.set(18, b - 7, PALEW);
        sign((x) => Math.round((x - 4) * 0.35));
        c.rect(15, 13, 18, 16, C.blood); // and a hand has been laid on it
        dots(c, C.blood, [15, 11, 16, 11, 17, 12, 18, 12, 19, 14, 16, 17, 16, 19, 17, 21]);
      }
      c.set(4, 6, C.iron);
      grass(c, [2, 7, 21], b);
    },
    sw: 6, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      post(c, 2, 4, b, GREYW);
      c.col(1, 4, u ? 18 : 14, LIME);
      c.set(1, 4, L(LIME));
      if (u) blood(c, [1, 13, 1, 15]);
      grass(c, [4], b);
    },
  });

  add('rural-generator-diesel', 'diesel generator portable genset engine frame fuel tank exhaust farm power', {
    w: 28, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.frame(2, 4, 25, b - 2, C.iron);
      c.row(4, 2, 25, C.steel);
      c.rect(4, 5, 16, 9, FYELLOW); // the tank
      c.row(5, 4, 16, L(FYELLOW));
      c.rect(9, 3, 11, 4, SOOT);
      c.rect(4, 10, 14, b - 3, hex('#3a3a44')); // the engine
      for (let y = 11; y < b - 3; y += 2) c.row(y, 5, 13, C.iron);
      c.rect(15, 10, 23, b - 3, FRED); // the alternator
      c.col(15, 10, b - 3, L(FRED));
      c.rect(18, 6, 23, 9, hex('#2c2a30')); // the panel
      c.set(19, 7, u ? hex('#5aa85a') : hex('#3a4a3a'));
      c.set(21, 7, C.bone);
      c.set(22, 8, C.bone);
      rust(c, 4, 5, 23, b - 3, 5, 9);
      c.rect(24, 8, 26, 9, C.ironDark); // exhaust
      c.rect(3, b - 1, 6, b, hex('#27252b'));
      c.rect(21, b - 1, 24, b, hex('#27252b'));
      c.line(23, 12, 27, b, SOOT); // a cable off to somewhere
      if (u) {
        wisp(c, 26, 7, 4, hex('#5a5258'));
        dots(c, hex('#77736a'), [25, 3, 24, 1, 26, 0]);
        dots(c, C.steel, [1, 7, 1, 12, 26, 13, 0, 10]); // shaking
        dots(c, hex('#1a1820'), [8, b, 10, b, 12, b, 11, b - 1]);
      } else {
        c.set(3, 12, SOOT); // the pull cord
        c.set(2, 13, OAK);
      }
    },
    u: [0, 3, 0],
    sw: 16, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      c.frame(2, 4, 13, b - 2, C.iron);
      c.row(4, 2, 13, C.steel);
      c.rect(4, 5, 11, 9, FYELLOW);
      c.row(5, 4, 11, L(FYELLOW));
      c.rect(4, 10, 11, b - 3, hex('#3a3a44'));
      c.oval(5, 11, 10, 16, C.iron); // the recoil starter
      c.set(7, 13, SOOT);
      c.rect(3, b - 1, 5, b, hex('#27252b'));
      c.rect(10, b - 1, 12, b, hex('#27252b'));
      rust(c, 4, 5, 11, b - 3, 7, 8);
      if (u) {
        wisp(c, 12, 3, 4, hex('#5a5258'));
        dots(c, C.steel, [1, 8, 14, 12, 0, 13]);
      } else c.set(8, 15, OAK);
    },
    su: [0, 3, 0],
  });

  add('rural-rabbit-hutch', 'rabbit hutch on legs wire mesh felt roof pet rabbits farm yard', {
    w: 30, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      legs(c, [3, 25], 18, b, GREYW);
      boards(c, 2, 6, 27, 17, GREYW, 4);
      c.poly([[1, 6], [28, 4], [28, 5], [1, 7]], TAR);
      c.line(1, 5, 28, 3, hex('#5a5258'));
      c.rect(14, 8, 26, 16, SOOT); // the run behind the wire
      hay(c, 14, 15, 26, 16, 3, HAY);
      if (!u) {
        c.rect(17, 12, 22, 14, C.white); // a rabbit
        c.rect(22, 11, 24, 13, C.white);
        c.set(23, 9, C.white);
        c.set(24, 10, C.white);
        c.set(24, 12, hex('#a83a3a'));
        c.set(16, 13, hex('#8f8a78'));
        for (let y = 8; y <= 16; y++) for (let x = 14 + (y % 2); x <= 26; x += 2) c.set(x, y, hex('#6a6a6a'));
        panel(c, 4, 8, 12, 16, GREYW);
        c.rect(12, 11, 13, 12, C.iron);
      } else {
        for (let y = 8; y <= 16; y++) for (let x = 14 + (y % 2); x <= 26; x += 2) if (x < 18 || y < 10) c.set(x, y, hex('#6a6a6a')); // the wire torn out
        c.line(18, 10, 24, 16, hex('#8a8a8a'));
        c.line(19, 9, 26, 13, hex('#8a8a8a'));
        hollow(c, 4, 8, 12, 16);
        c.rect(2, 8, 3, 16, GREYW);
        dots(c, C.white, [20, 14, 22, 15, 16, 19, 19, 21, 23, b, 13, b, 9, b - 1, 26, 20]);
        blood(c, [21, 16, 20, 17, 21, 19, 22, b, 18, b]);
        dots(c, hex('#a83a3a'), [7, 13, 9, 13]); // and in the sleeping box, eyes
      }
      grass(c, [1, 14, 28], b);
    },
    sw: 16, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [2, 12], 18, b, GREYW);
      boards(c, 2, 7, 13, 17, GREYW, 4);
      c.rect(1, 4, 14, 6, TAR);
      c.row(4, 1, 14, hex('#5a5258'));
      c.rect(5, 10, 10, 13, D(GREYW));
      if (u) {
        dots(c, C.white, [3, 20, 9, b, 14, b - 1]);
        blood(c, [2, 17, 2, 19, 4, b]);
      }
      grass(c, [14], b);
    },
  });

  add('rural-bee-boxes', 'bee boxes white hives langstroth apiary bees honey frames tin lids', {
    w: 28, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 1, 26, b, GREYW); // a pallet
      c.set(5, b, null);
      c.set(13, b, null);
      c.set(21, b, null);
      const hive = (x, tiers, lid) => {
        const top = b - 2 - tiers * 6;
        for (let i = 0; i < tiers; i++) {
          const y = b - 2 - (i + 1) * 6 + 1;
          c.rect(x, y, x + 10, y + 5, LIME);
          c.row(y, x, x + 10, L(LIME));
          c.row(y + 5, x, x + 10, D(LIME));
          c.col(x + 10, y, y + 5, D(LIME));
          c.rect(x + 4, y + 2, x + 6, y + 2, D(LIME));
        }
        c.rect(x + 3, b - 3, x + 7, b - 3, SOOT);
        if (lid) {
          c.rect(x - 1, top - 1, x + 11, top, ZINC);
          c.row(top - 1, x - 1, x + 11, L(ZINC));
          c.rect(x + 3, top - 3, x + 6, top - 2, BRICK);
        } else {
          c.row(top, x + 1, x + 9, SOOT);
          for (let i = x + 1; i < x + 10; i += 2) c.set(i, top, AMBER); // the frames
        }
        return top;
      };
      hive(2, 3, true);
      dots(c, D(LIME), [5, 12, 9, 17, 4, 9]);
      if (!u) {
        hive(15, 2, true);
        bees(c, 12, 12, 20, 22, 4, 3);
      } else {
        const t = hive(15, 2, false);
        c.line(26, b - 2, 27, t, ZINC); // the lid off, leaning
        c.line(25, b - 2, 26, t, L(ZINC));
        bees(c, 8, -3, 26, t - 1, 30, 5);
        dots(c, AMBER, [19, t + 2, 19, t + 3, 22, t + 2, 20, t + 6]);
        dots(c, hex('#18161c'), [16, t - 1, 18, t - 1, 21, t - 1]);
      }
      grass(c, [0, 27], b);
    },
    u: [0, 4, 0],
    sw: 14, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 1, 12, b, GREYW);
      for (let i = 0; i < 3; i++) {
        const y = b - 2 - (i + 1) * 6 + 1;
        c.rect(2, y, 11, y + 5, LIME);
        c.row(y, 2, 11, L(LIME));
        c.row(y + 5, 2, 11, D(LIME));
        c.col(11, y, y + 5, D(LIME));
        c.rect(5, y + 2, 8, y + 2, D(LIME));
      }
      const t = b - 20;
      if (!u) {
        c.rect(1, t - 1, 12, t, ZINC);
        c.row(t - 1, 1, 12, L(ZINC));
        c.rect(5, t - 3, 8, t - 2, BRICK);
        bees(c, 3, 9, 12, 20, 2, 5);
      } else {
        c.rect(1, t - 1, 12, t, ZINC);
        c.row(t - 1, 1, 12, L(ZINC));
        bees(c, 0, -3, 13, t - 2, 18, 8);
        bees(c, 2, 8, 12, 20, 6, 9);
      }
    },
    su: [0, 4, 0],
  });

  add('rural-burn-barrel', 'burn barrel oil drum incinerator rubbish fire holes rusty farm yard', {
    w: 16, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2,
        R = hex('#6a4030');
      c.rect(2, 6, 13, b, R);
      c.col(2, 6, b, L(R));
      c.col(13, 6, b, D(R));
      c.row(11, 2, 13, D(R));
      c.row(16, 2, 13, D(R));
      c.rect(2, 6, 13, 8, hex('#2e2826')); // scorched
      c.row(5, 3, 12, SOOT);
      c.speckle(2, 9, 13, b, hex('#2e2826'), 6, 3);
      c.speckle(2, 9, 13, b, C.rust, 5, 5);
      for (const [x, y] of [[5, 13], [9, 14], [7, 18], [11, 18], [4, 18]]) c.set(x, y, u ? C.flame : SOOT);
      if (!u) {
        c.line(6, 5, 4, 2, GREYW); // what was put in to burn and did not
        c.rect(8, 3, 11, 5, hex('#5a5048'));
        c.set(9, 2, hex('#5a5048'));
        dots(c, C.ash, [1, b, 14, b, 4, b]);
      } else {
        fire(c, 3, 12, 5, 8, 4);
        dots(c, C.flameLight, [4, -4, 10, -5, 13, -2, 1, -1]);
        wisp(c, 7, -4, 4, hex('#5a5258'));
        dots(c, hex('#7a4a2a'), [3, 7, 8, 7, 12, 7, 6, 8]);
        c.rect(10, 3, 12, 5, hex('#2e2826')); // a sleeve hanging over the rim
        c.rect(12, 6, 13, 8, hex('#4a5a7a'));
        dots(c, C.ash, [1, b, 14, b]);
      }
    },
    u: [0, 8, 0],
  });

  /* ---------- poles ---------- */
  add('rural-telephone-pole', 'telephone pole telegraph pole wires insulators crossarm lonely road', {
    w: 22, h: 62, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 9, 2, b, hex('#5a4a3c'), 3);
      c.rect(2, 6, 19, 7, hex('#5a4a3c'));
      c.row(6, 2, 19, L(hex('#5a4a3c')));
      c.line(8, 12, 5, 8, C.iron);
      c.line(12, 12, 16, 8, C.iron);
      for (const x of [3, 7, 14, 18]) {
        c.rect(x, 4, x, 5, hex('#6f9a8a')); // glass insulators
        c.set(x, 3, hex('#9ec2b2'));
      }
      c.rect(9, 22, 11, 24, ZINC); // a number plate
      c.set(10, 23, SOOT);
      dots(c, SOOT, [10, 30, 9, 38, 11, 45]);
      for (const [x, d] of [[18, 1], [14, 1]]) c.line(x, 5, 21, 6 + (x === 14 ? 1 : 0), SOOT);
      c.line(7, 5, 0, 7, SOOT);
      if (!u) {
        c.line(3, 5, 0, 6, SOOT);
        crow(c, 14, 5, false);
      } else {
        c.line(3, 5, 2, 20, SOOT); // one wire down
        c.line(2, 20, 4, 40, SOOT);
        c.line(4, 40, 2, b - 2, SOOT);
        c.line(2, b - 2, 6, b, SOOT);
        dots(c, C.glow, [7, b, 6, b - 2, 8, b - 1]);
        dots(c, C.flameLight, [5, b - 1]);
        c.rect(12, 26, 16, 31, C.paper); // and a bill nailed up: have you seen
        c.rect(13, 27, 15, 28, hex('#7a6a58'));
        c.row(30, 13, 15, D(C.paper));
      }
      grass(c, [7, 13], b);
    },
    sw: 10, sh: 62,
    s(c, u) {
      const b = c.h - 2;
      post(c, 4, 2, b, hex('#5a4a3c'), 3);
      c.rect(3, 6, 7, 7, L(hex('#5a4a3c')));
      c.rect(5, 4, 5, 5, hex('#6f9a8a'));
      c.set(5, 3, hex('#9ec2b2'));
      c.rect(4, 22, 6, 24, ZINC);
      if (u) {
        c.line(5, 5, 8, 30, SOOT);
        c.line(8, 30, 7, b, SOOT);
        dots(c, C.glow, [8, b, 9, b - 2]);
        c.rect(3, 26, 3, 31, C.paper);
      }
      grass(c, [2, 8], b);
    },
  });

  const yardLight = (c, u, side) => {
    const b = c.h - 2;
    post(c, 6, 4, b, hex('#5a4a3c'));
    const x = side ? 6 : 10; // where the lamp hangs
    if (!side) {
      c.line(7, 5, 12, 3, C.iron);
      c.line(7, 9, 10, 4, C.iron);
    }
    c.rect(x - 2, 4, x + 3, 5, hex('#3a4a44')); // the shade
    c.row(4, x - 1, x + 2, hex('#55665e'));
    c.rect(x - 3, 6, x + 4, 6, hex('#3a4a44'));
    c.rect(x, 7, x + 1, 8, u ? C.glow : hex('#77736a'));
    c.line(7, 12, 7, b - 8, SOOT); // the cable stapled down the pole
    c.rect(5, b - 10, 8, b - 7, hex('#2c2a30'));
    c.set(6, b - 9, u ? C.red : C.steel);
    if (u) {
      c.rect(x - 2, 7, x + 3, 7, LAMP);
      c.rect(x - 1, 9, x + 2, 9, mix(LAMP, 0.8));
      c.rect(x, 10, x + 1, 10, mix(LAMP, 0.6));
      dots(c, C.bone, [x - 3, 9, x + 5, 8, x + 3, 11, x - 2, 12]); // moths
    }
    grass(c, [4, 9], b);
  };
  add('rural-yard-light-pole', 'yard light on a pole farmyard lamp enamel shade cable switch moths', {
    w: 18, h: 56, solid: true,
    f: (c, u) => yardLight(c, u, false),
    sw: 14, sh: 56,
    s: (c, u) => yardLight(c, u, true),
  });

  /* ---------- crops ---------- */
  const stalk = (c, x, b, h, seed, dry) => {
    const r = rnd(seed),
      col = dry ? DRY : STALK;
    c.col(x, b - h, b, col);
    c.set(x, b - h - 1, DRY);
    c.set(x - 1, b - h - 2, DRY);
    c.set(x + 1, b - h - 2, DRY);
    for (let y = b - 4; y > b - h + 3; y -= 4 + Math.floor(r() * 3)) {
      const s = r() < 0.5 ? -1 : 1,
        lc = r() < 0.3 ? DRY : dry ? D(DRY) : C.leafLight;
      c.set(x + s, y, lc);
      c.set(x + 2 * s, y - 1, lc);
      c.set(x + 3 * s, y, D(lc));
      if (r() < 0.5) c.rect(x - s, y - 3, x - s, y - 1, hex('#b8a45a')); // a cob
    }
  };
  add('rural-maize-rows', 'maize rows corn stalks cornfield tall crop field edge', {
    w: 36, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (let i = 0; i < 8; i++) {
        const x = 3 + i * 4 + (i % 2);
        if (u && (i === 3 || i === 4)) continue;
        stalk(c, x, b, 34 + ((i * 5) % 6), i + 2, i % 3 === 0);
      }
      c.row(b, 1, 34, SOIL);
      if (u) {
        c.line(15, b, 10, b - 9, DRY); // two broken down: something went in here
        c.line(10, b - 9, 6, b - 7, DRY);
        c.line(20, b, 24, b - 7, STALK);
        c.line(24, b - 7, 29, b - 4, STALK);
        dots(c, C.leafLight, [9, b - 10, 26, b - 7, 13, b - 3]);
        c.rect(16, b - 20, 19, b - 1, mix(SOOT, 0.9));
        c.rect(15, b - 12, 20, b - 1, mix(SOOT, 0.9));
        dots(c, C.glow, [17, b - 16, 19, b - 16]);
        c.rect(17, b - 1, 20, b, hex('#7a2c2c')); // a child's red shoe
        dots(c, MUD, [14, b, 22, b]);
      }
    },
    sw: 12, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      stalk(c, 4, b, 36, 4, false);
      stalk(c, 7, b, 33, 9, true);
      c.row(b, 1, 10, SOIL);
      if (u) {
        c.line(9, b, 11, b - 8, DRY);
        c.rect(0, b - 1, 2, b, hex('#7a2c2c'));
      }
    },
  });

  const stook = (c, x0, x1, b, seed) => {
    const m = (x0 + x1) >> 1,
      r = rnd(seed);
    c.poly([[x0, b], [m - 2, b - 15], [m + 2, b - 15], [x1, b]], HAY);
    for (let x = x0 + 1; x < x1; x += 2) c.line(x, b, m + (x - m) * 0.3, b - 13, r() < 0.5 ? D(HAY) : L(HAY));
    for (let x = m - 4; x <= m + 4; x++) {
      c.set(x, b - 16 - Math.floor(r() * 3), GRAIN); // the ears
      c.set(x, b - 15, GRAIN);
    }
    c.row(b - 11, m - 3, m + 3, ROPE);
  };
  add('rural-wheat-stooks', 'wheat stooks sheaves of corn shocks harvest field straw', {
    w: 30, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      stook(c, 1, 13, b, 3);
      if (!u) stook(c, 15, 28, b, 5);
      else {
        hay(c, 14, b - 3, 28, b, 4, HAY); // one pulled apart: something slept in it
        c.row(b - 4, 17, 25, L(HAY));
        dots(c, GRAIN, [27, b - 3, 28, b - 2, 15, b - 4, 13, b]);
        c.rect(18, b - 3, 23, b - 2, hex('#3a342e'));
        c.set(24, b - 2, hex('#3a342e'));
        dots(c, C.bone, [20, b - 1, 22, b]);
        c.line(26, b - 4, 28, b - 9, ROPE);
      }
      dots(c, HAY, [14, b, 0 + 1, b]);
    },
    sw: 16, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      if (!u) stook(c, 1, 14, b, 7);
      else {
        hay(c, 1, b - 3, 14, b, 6, HAY);
        c.row(b - 4, 4, 11, L(HAY));
        c.rect(5, b - 3, 9, b - 2, hex('#3a342e'));
        dots(c, GRAIN, [2, b - 4, 13, b - 3]);
      }
    },
  });
};
