/* Village, part 1: the large things of the green (stall, wagons, cart, dray, caravan), the well and the pump,
 * the smithy, the bakehouse and the tavern. Part of tools/big/env2-country.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { P, D, L, dots, board, face, panel, post, legs, planksV, planksH, boards, boardsH, hollow, pane, flame, fire, wisp, stones, bricks } = H;
  const { wheel, wheelEdge, barrel, barrelLying, barrelEnd, sack, crate, thatch, hay, heap, blood, puddle, drip, shards, grass, crow, tankard, loaf, rope, chain, lantern, shape } = H;
  const add = H.reg('env-village', 'Village');
  const { OAK, GREYW, PALEW, TAR, THATCH, HAY, BRICK, LIME, STONE, SOIL, SOOT, TIN, WAT, ROPE, CANVAS, SACK, BREAD, PEWTER, FGREEN, LAMP } = P;
  const AWN = hex('#7a4038'),
    BACK = hex('#2e2826'),
    ALE = hex('#7c5c28'),
    WINE = hex('#5e1f2c'),
    WICK = hex('#8a6a3a'), // wicker
    CABB = hex('#5f7a48'),
    IRONG = hex('#45504a'),
    LEATH = hex('#4a3428'),
    DOUGH = hex('#cfc6a8'),
    SHROUD = hex('#b9b29c');
  const basket = (c, x0, x1, yb, full) => {
    c.rect(x0, yb - 2, x1, yb, WICK);
    c.row(yb - 2, x0, x1, L(WICK));
    for (let x = x0 + 1; x < x1; x += 2) c.set(x, yb - 1, D(WICK));
    c.set(x0, yb, null);
    c.set(x1, yb, null);
    if (full) c.row(yb - 3, x0 + 1, x1 - 1, full);
    else c.row(yb - 2, x0 + 1, x1 - 1, mix(WICK, 0.45));
  };
  const cabbage = (c, x, yb) => {
    c.rect(x, yb - 2, x + 3, yb, CABB);
    c.set(x, yb - 2, null);
    c.set(x + 3, yb - 2, D(CABB));
    c.set(x + 1, yb - 2, L(CABB));
    c.set(x + 2, yb - 1, D(CABB));
  };

  /* ---------- large things ---------- */
  add('village-market-stall-large', 'large market stall striped awning counter baskets cabbages onions hare village trader booth', {
    w: 48, h: 32, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 9, 44, 16, BACK);
      post(c, 2, 8, b, OAK);
      post(c, 44, 8, b, OAK);
      for (let x = 1; x <= 46; x++) {
        const s = Math.floor((x - 1) / 4) % 2 ? AWN : CANVAS;
        c.col(x, 2, 8, s);
        c.set(x, 2, L(s));
        if (Math.floor((x - 1) / 2) % 2 === 0) c.set(x, 9, D(s));
      }
      c.row(1, 1, 46, OAK);
      if (u) {
        c.poly([[30, 6], [36, 6], [34, 9], [31, 9]], BACK); // a rent in the awning
        c.set(30, 9, CANVAS);
      }
      board(c, 1, 17, 46, 18, PALEW);
      c.rect(3, 19, 44, 23, D(CANVAS)); // the cloth in front
      c.row(19, 3, 44, CANVAS);
      for (let x = 7; x < 44; x += 6) c.col(x, 20, 23, mix(CANVAS, 0.55));
      for (let x = 3; x <= 44; x += 2) c.set(x, 24, D(CANVAS));
      c.line(6, 24, 4, b, OAK); // the trestles
      c.line(7, 24, 9, b, OAK);
      c.line(40, 24, 38, b, OAK);
      c.line(41, 24, 43, b, OAK);
      crate(c, 13, 24, 22, b);
      sack(c, 26, 23, 32, b);
      // what hangs from the rail
      c.col(38, 10, 11, ROPE); // a hare
      c.rect(37, 12, 39, 15, hex('#7a6a58'));
      c.set(38, 12, hex('#94836c'));
      c.set(37, 16, hex('#7a6a58'));
      c.set(39, 16, hex('#5c4f42'));
      if (!u) {
        c.col(8, 10, 14, ROPE); // onions
        dots(c, hex('#a87a4a'), [7, 11, 9, 12, 7, 13, 9, 14, 8, 15]);
        basket(c, 5, 12, 16, hex('#b0a68e')); // turnips
        dots(c, hex('#8a6a8a'), [6, 13, 9, 13, 11, 13]);
        cabbage(c, 15, 16);
        cabbage(c, 20, 16);
        cabbage(c, 17, 13);
        basket(c, 26, 33, 16, hex('#8a3a2c')); // apples
        dots(c, hex('#a8563a'), [27, 13, 30, 13, 32, 13, 29, 12]);
        loaf(c, 40, 16, 5);
      } else {
        basket(c, 5, 12, 16);
        c.rect(27, 14, 29, 16, WICK); // a basket on its side
        c.col(30, 14, 16, mix(WICK, 0.45));
        c.set(27, 14, L(WICK));
        cabbage(c, 18, 16);
        cabbage(c, 34, b);
        dots(c, hex('#8a3a2c'), [33, 16, 36, 16, 24, b]);
        blood(c, [38, 17, 38, 18, 37, 17, 38, 20, 38, 22]); // the hare drips
      }
    },
    sw: 28, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.col(23, 4, 16, BACK);
      post(c, 4, 9, b, OAK);
      post(c, 22, 3, b, OAK);
      for (let i = 0; i < 2; i++) c.line(1, 8 + i, 25, 2 + i, i ? D(AWN) : AWN); // the awning, sloping to the front
      c.rect(1, 9, 2, 10, D(CANVAS));
      c.set(1, 8, CANVAS);
      board(c, 3, 17, 24, 18, PALEW);
      c.rect(4, 19, 23, 23, D(CANVAS));
      c.row(19, 4, 23, CANVAS);
      for (let x = 4; x <= 23; x += 2) c.set(x, 24, D(CANVAS));
      c.col(10, 20, 23, mix(CANVAS, 0.55));
      c.col(17, 20, 23, mix(CANVAS, 0.55));
      c.line(6, 24, 5, b, OAK);
      c.line(21, 24, 22, b, OAK);
      crate(c, 9, 24, 17, b);
      c.col(14, 6, 8, ROPE);
      c.rect(13, 9, 15, 12, hex('#7a6a58'));
      c.set(14, 9, hex('#94836c'));
      c.set(13, 13, hex('#7a6a58'));
      if (!u) {
        basket(c, 5, 11, 16, hex('#b0a68e'));
        dots(c, hex('#8a6a8a'), [6, 13, 9, 13]);
        cabbage(c, 17, 16);
        c.col(8, 8, 11, ROPE);
        dots(c, hex('#a87a4a'), [7, 9, 9, 10, 8, 12]);
      } else {
        basket(c, 5, 11, 16);
        cabbage(c, 1, b);
        blood(c, [14, 17, 14, 18, 14, 20, 13, 17]);
        dots(c, BACK, [9, 6, 10, 6, 11, 5]);
      }
    },
  });

  add('village-hay-wagon-large', 'large hay wagon four wheels ladders harvest wain farm cart loaded', {
    w: 48, h: 32, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      if (!u) thatch(c, [[5, 14], [3, 7], [9, 2], [37, 1], [45, 6], [44, 14]], 3, HAY);
      c.line(6, 14, 3, 4, OAK); // the ladders fore and aft
      c.line(42, 14, 45, 4, OAK);
      c.row(11, 5, 43, D(OAK));
      c.row(8, 4, 44, OAK);
      for (let x = 10; x < 42; x += 6) c.col(x, 8, 14, D(OAK));
      if (!u) {
        hay(c, 6, 3, 42, 7, 5, HAY);
        dots(c, HAY, [8, 9, 14, 10, 20, 9, 27, 10, 33, 9, 39, 10, 12, 12, 24, 13, 36, 12, 4, 15, 30, 18, 17, 18]);
        dots(c, L(HAY), [3, 8, 46, 7, 22, 12]);
      }
      board(c, 5, 15, 44, 17, GREYW);
      c.row(19, 9, 40, D(OAK));
      c.line(5, 18, 0, 21, OAK); // the pole
      c.line(5, 19, 1, 22, D(OAK));
      wheel(c, 11, b - 6, 6, hex('#4a372a'), C.iron, hex('#2e2a2e'));
      wheel(c, 36, b - 7, 7, hex('#4a372a'), C.iron, hex('#2e2a2e'));
      if (u) {
        c.rect(12, 11, 35, 14, SHROUD); // what lay under the hay: something long, sewn into a sheet
        c.row(11, 13, 34, L(SHROUD));
        c.row(14, 12, 35, D(SHROUD));
        c.set(12, 11, null);
        c.set(35, 11, null);
        c.rect(33, 10, 35, 10, SHROUD);
        for (const x of [17, 24, 30]) c.col(x, 11, 14, ROPE);
        dots(c, HAY, [8, 14, 20, 10, 27, 10, 40, 14, 38, 13, 15, 18, 30, 18, 44, 18, 3, b, 22, b, 23, b - 1, 45, b]);
        c.set(21, 14, C.blood);
        c.set(22, 14, C.blood);
      }
    },
    sw: 28, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      if (!u) thatch(c, [[5, 14], [3, 6], [8, 2], [19, 2], [24, 6], [22, 14]], 4, HAY);
      c.line(6, 14, 3, 4, OAK);
      c.line(21, 14, 24, 4, OAK);
      c.row(8, 4, 23, OAK);
      c.row(11, 5, 22, D(OAK));
      c.col(10, 8, 14, D(OAK));
      c.col(17, 8, 14, D(OAK));
      if (!u) {
        hay(c, 5, 3, 22, 7, 6, HAY);
        dots(c, HAY, [7, 9, 13, 10, 20, 9, 8, 12, 14, 13, 19, 12, 12, 18]);
      }
      board(c, 5, 15, 22, 17, GREYW);
      c.row(b - 7, 5, 22, D(OAK));
      c.rect(12, 18, 15, b - 8, D(OAK));
      wheelEdge(c, 3, b - 14, b, 2);
      wheelEdge(c, 23, b - 14, b, 2);
      if (u) {
        c.oval(10, 9, 17, 14, SHROUD);
        c.row(9, 12, 15, L(SHROUD));
        c.row(14, 11, 16, D(SHROUD));
        c.line(12, 10, 15, 13, ROPE);
        c.line(15, 10, 12, 13, ROPE);
        dots(c, HAY, [7, 14, 20, 14, 8, 18, 19, 18, 9, b, 16, b]);
      }
    },
  });

  add('village-horse-cart-large', 'large horse cart two wheels shafts tumbril farm cart wooden lantern', {
    w: 46, h: 30, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      if (u) {
        sack(c, 16, 2, 23, 9);
        sack(c, 23, 3, 30, 9, D(SACK));
        barrel(c, 32, 1, 40, 9);
      }
      boardsH(c, 13, 9, 43, 15, GREYW, 3);
      for (const x of [13, 22, 34, 42]) post(c, x, 7, 15, OAK);
      board(c, 12, 16, 44, 17, OAK);
      board(c, 12, 6, 19, 7, OAK); // the seat
      c.line(13, 16, 1, 19, OAK); // the shafts
      c.line(13, 17, 1, 20, D(OAK));
      c.col(4, 20, b, D(OAK)); // propped on a stick
      c.col(42, 18, b, D(OAK));
      wheel(c, 29, b - 9, 9, hex('#3a2c22'), C.iron, hex('#2e2a2e'));
      c.col(11, 3, 9, C.iron); // the lantern on its rod
      c.row(3, 8, 11, C.iron);
      lantern(c, 6, 4, u);
      grass(c, [9, 38], b);
      if (u) dots(c, HAY, [20, 16, 36, 17, 40, b]);
    },
    sw: 26, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      if (u) {
        sack(c, 6, 2, 12, 9);
        barrel(c, 13, 1, 19, 9);
      }
      boardsH(c, 5, 9, 20, 15, GREYW, 3);
      post(c, 5, 7, 15, OAK);
      post(c, 19, 7, 15, OAK);
      board(c, 4, 16, 21, 17, OAK);
      board(c, 6, 6, 19, 7, OAK);
      c.row(b - 9, 4, 21, D(OAK));
      for (const x of [7, 17]) {
        c.rect(x, 18, x + 1, 21, OAK); // the shafts, coming at us
        c.rect(x, 20, x + 1, 21, L(OAK));
      }
      c.col(8, 22, b, D(OAK));
      wheelEdge(c, 2, b - 18, b, 2);
      wheelEdge(c, 22, b - 18, b, 2);
      c.col(21, 3, 8, C.iron);
      lantern(c, 19, 1, u);
    },
  });

  add('village-brewers-dray-large', 'large brewers dray beer wagon barrels casks ale delivery cart four wheels', {
    w: 48, h: 30, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      barrel(c, 13, 3, 22, 14);
      if (!u) barrel(c, 24, 3, 33, 14);
      barrel(c, 35, 3, 44, 14);
      if (!u) rope(c, 12, 8, 45, 8);
      for (const x of [12, 23, 34, 45]) c.col(x, 10, 14, C.iron);
      board(c, 3, 15, 45, 17, FGREEN);
      dots(c, D(FGREEN), [10, 16, 20, 16, 30, 16, 40, 16]);
      c.rect(4, 10, 8, 14, FGREEN); // the driver's box
      c.col(4, 10, 14, L(FGREEN));
      board(c, 2, 8, 10, 9, OAK);
      c.line(3, 15, 1, 19, OAK); // footboard
      c.row(18, 6, 14, C.iron);
      c.row(18, 33, 41, C.iron);
      wheel(c, 10, b - 5, 5, FGREEN, C.iron, hex('#3f4a3c'));
      wheel(c, 37, b - 5, 5, FGREEN, C.iron, hex('#3f4a3c'));
      if (u) {
        tankard(c, 26, 14);
        c.set(34, 11, C.brass); // the tap left running
        c.set(33, 11, C.brass);
        c.col(33, 12, 14, ALE);
        drip(c, 33, 18, b - 1, ALE);
        puddle(c, 27, 36, b, ALE);
        c.row(b - 1, 31, 34, ALE);
        dots(c, D(ALE), [32, 16, 33, 17]);
        dots(c, ROPE, [24, 14, 25, 14, 30, 14, 31, 13, 23, 18, 23, 19]);
      }
    },
    sw: 26, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      barrel(c, 5, 3, 12, 14);
      barrel(c, 13, 3, 20, 14);
      if (!u) rope(c, 4, 8, 21, 8);
      board(c, 4, 15, 21, 17, FGREEN);
      c.row(b - 5, 4, 21, C.iron);
      c.rect(11, 18, 14, b - 6, D(FGREEN));
      wheelEdge(c, 2, b - 10, b, 2, FGREEN);
      wheelEdge(c, 22, b - 10, b, 2, FGREEN);
      if (u) {
        c.rect(16, 11, 17, 11, C.brass);
        c.col(16, 12, 14, ALE);
        drip(c, 16, 18, b - 1, ALE);
        puddle(c, 11, 20, b, ALE);
        c.row(b - 1, 14, 18, ALE);
        dots(c, ROPE, [4, 15, 4, 18, 5, 19]);
      }
    },
  });

  add('village-bowtop-caravan-large', 'large bow top caravan travellers wagon vardo canvas roof painted chimney', {
    w: 48, h: 34, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        TOP = hex('#6b6a50');
      c.rect(6, 5, 45, 16, TOP);
      c.row(4, 7, 44, L(TOP));
      c.row(5, 6, 45, L(TOP));
      for (let x = 13; x < 45; x += 8) c.col(x, 5, 16, D(TOP));
      for (let x = 6; x <= 45; x += 2) c.set(x, 17, D(TOP));
      c.speckle(6, 6, 45, 16, D(TOP), 16, 2);
      c.rect(8, 17, 44, 22, FGREEN);
      c.row(17, 8, 44, L(FGREEN));
      c.row(22, 8, 44, D(FGREEN));
      for (let x = 12; x < 44; x += 8) {
        panel(c, x - 2, 18, x + 3, 21, FGREEN);
        c.set(x, 19, C.mustard);
        c.set(x + 1, 20, C.mustard);
      }
      c.rect(26, 8, 32, 14, D(OAK)); // the window
      pane(c, 27, 9, 31, 13, u);
      c.col(29, 9, 13, D(OAK));
      c.rect(38, 1, 39, 4, C.iron); // stove pipe
      c.row(1, 37, 40, C.ironDark);
      c.row(23, 9, 43, C.ironDark);
      board(c, 2, 21, 8, 22, OAK); // the footboard in front
      c.line(8, 23, 1, 29, OAK); // shafts down
      c.line(8, 24, 2, 30, D(OAK));
      wheel(c, 15, b - 5, 5, hex('#8a6a3a'), C.iron, hex('#7a5a30'));
      wheel(c, 38, b - 5, 5, hex('#8a6a3a'), C.iron, hex('#7a5a30'));
      c.col(5, 12, 13, C.iron); // a lamp on the front
      lantern(c, 1, 13, u);
      if (u) {
        wisp(c, 38, 0, 3);
        c.set(40, -2, C.ash);
        c.set(41, -3, blend(C.ash, C.white, 0.4));
      }
      grass(c, [24, 30, 45], b);
    },
    u: [0, 4, 0],
    sw: 28, sh: 34,
    s(c, u) {
      const b = c.h - 2,
        TOP = hex('#6b6a50');
      c.oval(3, 3, 24, 24, TOP);
      c.rect(3, 13, 24, 22, TOP);
      c.oval(5, 5, 22, 24, FGREEN);
      c.rect(5, 13, 22, 22, FGREEN);
      c.col(5, 12, 22, L(FGREEN));
      dots(c, C.mustard, [7, 12, 7, 16, 7, 20, 20, 12, 20, 16, 20, 20, 13, 6, 14, 6]);
      c.rect(9, 8, 18, 22, D(OAK)); // the door
      if (!u) {
        face(c, 10, 9, 17, 22, hex('#6a5438'));
        pane(c, 11, 10, 13, 13, false);
        pane(c, 15, 10, 16, 13, false);
        panel(c, 11, 16, 16, 21, hex('#6a5438'));
        c.set(16, 15, C.brass);
      } else {
        c.rect(10, 9, 17, 22, hex('#8a7a40')); // open: lamplight, and somebody sitting far back
        c.rect(10, 9, 17, 10, hex('#6a5c30'));
        shape(c, 12, 14, 22, hex('#3a3024'));
        c.rect(18, 9, 19, 22, hex('#6a5438')); // the door edge on
        c.col(19, 9, 22, D(hex('#6a5438')));
      }
      board(c, 3, 23, 24, 24, OAK);
      for (let i = 0; i < 3; i++) board(c, 9 - i, 25 + i * 2 + (i > 1 ? 1 : 0), 18 + i, 26 + i * 2 + (i > 1 ? 1 : 0), GREYW); // steps
      wheelEdge(c, 1, b - 10, b, 2, hex('#8a6a3a'));
      wheelEdge(c, 25, b - 10, b, 2, hex('#8a6a3a'));
      c.rect(19, 1, 20, 3, C.iron);
      if (u) wisp(c, 19, 0, 3);
    },
    su: [0, 3, 0],
  });

  /* ---------- water ---------- */
  add('village-well-roofed', 'village well roofed thatch stone ring windlass bucket rope crank water', {
    w: 28, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 4, 8, 25, OAK);
      post(c, 22, 8, 25, OAK);
      c.rect(6, 13, 21, 14, OAK); // the windlass
      c.row(13, 6, 21, L(OAK));
      c.rect(10, 12, 16, 15, ROPE);
      for (let x = 11; x < 16; x += 2) c.col(x, 12, 15, D(ROPE));
      c.row(13, 24, 25, C.iron);
      c.col(25, u ? 10 : 13, u ? 13 : 17, C.iron);
      thatch(c, [[1, 9], [4, 2], [23, 2], [26, 9]], 2);
      c.row(1, 5, 22, D(THATCH));
      c.row(9, 1, 26, D(THATCH));
      dots(c, C.moss, [3, 7, 8, 4, 17, 8, 22, 5]);
      stones(c, 4, 27, 23, b, STONE, 4, 6, 3);
      c.rect(3, 25, 24, 26, L(STONE));
      c.row(26, 3, 24, STONE);
      c.rect(6, 25, 21, 25, SOOT);
      dots(c, C.moss, [5, b, 6, b - 1, 14, b, 22, b, 21, b - 2, 9, 30]);
      const bucket = (x, y) => {
        c.rect(x, y, x + 4, y + 4, PALEW);
        c.col(x, y, y + 4, L(PALEW));
        c.row(y + 1, x, x + 4, C.iron);
        c.row(y + 3, x, x + 4, C.iron);
      };
      if (!u) {
        c.col(13, 16, 19, ROPE);
        c.line(13, 19, 18, 18, ROPE);
        c.col(18, 18, 19, ROPE);
        bucket(16, 20);
      } else {
        c.col(13, 16, 17, ROPE); // hauled up, and what is in it is not water
        c.set(12, 18, ROPE);
        c.set(14, 18, ROPE);
        bucket(11, 19);
        c.row(19, 12, 14, C.blood);
        blood(c, [11, 24, 13, 24, 15, 23, 10, 26, 9, 27, 9, 28, 12, 26, 12, 27, 16, 26, 16, 29, 9, 31]);
      }
    },
    sw: 24, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      post(c, 11, 8, 25, OAK);
      thatch(c, [[1, 9], [11, 1], [12, 1], [22, 9]], 5);
      c.row(9, 1, 22, D(THATCH));
      c.line(1, 9, 11, 1, L(THATCH));
      dots(c, C.moss, [6, 7, 15, 6, 18, 8]);
      c.rect(10, 12, 13, 15, OAK); // the windlass end and its crank
      c.set(11, 13, C.iron);
      c.row(13, 12, 17, C.iron);
      c.col(17, u ? 10 : 13, u ? 13 : 16, C.iron);
      stones(c, 2, 27, 21, b, STONE, 4, 6, 5);
      c.rect(1, 25, 22, 26, L(STONE));
      c.row(26, 1, 22, STONE);
      c.rect(4, 25, 19, 25, SOOT);
      dots(c, C.moss, [3, b, 4, b - 1, 12, b, 20, b]);
      const bucket = (x, y) => {
        c.rect(x, y, x + 4, y + 4, PALEW);
        c.col(x, y, y + 4, L(PALEW));
        c.row(y + 1, x, x + 4, C.iron);
        c.row(y + 3, x, x + 4, C.iron);
      };
      if (!u) {
        c.line(11, 16, 8, 19, ROPE);
        bucket(5, 20);
      } else {
        c.col(8, 14, 18, ROPE);
        bucket(6, 19);
        c.row(19, 7, 9, C.blood);
        blood(c, [6, 24, 8, 24, 5, 26, 5, 27, 9, 26, 9, 28, 6, 30]);
      }
    },
  });

  add('village-pump-iron', 'village pump cast iron hand pump handle spout water stone slab', {
    w: 16, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(7, 7, 10, b - 2, IRONG);
      c.col(7, 7, b - 2, L(IRONG));
      c.col(10, 7, b - 2, D(IRONG));
      c.rect(6, 5, 11, 6, IRONG);
      c.row(5, 6, 11, L(IRONG));
      c.rect(8, 2, 9, 4, IRONG);
      c.set(8, 2, L(IRONG));
      c.row(14, 6, 11, D(IRONG));
      c.rect(3, 11, 6, 12, IRONG); // spout
      c.row(11, 3, 6, L(IRONG));
      c.set(3, 13, IRONG);
      if (!u) {
        c.line(11, 8, 13, 10, C.iron); // the handle hanging
        c.col(13, 10, 19, C.iron);
        c.set(13, 20, C.steel);
      } else {
        c.line(11, 8, 14, 4, C.iron); // pumped
        c.set(14, 3, C.steel);
        c.col(3, 14, b - 2, WAT);
        c.col(2, 16, b - 3, L(WAT));
        dots(c, L(WAT), [1, b - 2, 5, b - 3, 4, b - 2]);
        puddle(c, 1, 6, b, WAT);
      }
      c.rect(1, b - 1, 14, b, STONE);
      c.row(b - 1, 1, 14, L(STONE));
      if (u) c.row(b - 1, 1, 6, WAT);
      dots(c, C.rust, [8, 16, 9, 21, 7, 10]);
      dots(c, C.moss, [12, b, 13, b - 1]);
    },
    sw: 14, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.rect(5, 7, 8, b - 2, IRONG);
      c.col(5, 7, b - 2, L(IRONG));
      c.col(8, 7, b - 2, D(IRONG));
      c.rect(4, 5, 9, 6, IRONG);
      c.row(5, 4, 9, L(IRONG));
      c.rect(6, 2, 7, 4, IRONG);
      c.row(14, 4, 9, D(IRONG));
      c.rect(5, 10, 8, 13, IRONG); // the spout, mouth to us
      c.row(10, 5, 8, L(IRONG));
      c.rect(6, 12, 7, 13, SOOT);
      if (u) {
        c.rect(6, 0, 7, 1, C.iron); // the handle up behind
        c.set(6, 0, C.steel);
        c.rect(6, 13, 7, b - 2, WAT);
        c.col(6, 13, b - 2, L(WAT));
        dots(c, L(WAT), [4, b - 2, 9, b - 3]);
        c.row(b - 1, 3, 10, WAT);
      } else c.set(9, 8, C.iron);
      c.rect(1, b - 1, 12, b, STONE);
      if (!u) c.row(b - 1, 1, 12, L(STONE));
      else {
        c.row(b - 1, 1, 2, L(STONE));
        c.row(b - 1, 11, 12, L(STONE));
      }
      dots(c, C.rust, [6, 17, 7, 22]);
    },
  });

  /* ---------- the smithy ---------- */
  add('village-smithy-anvil', 'smithy anvil on a stump blacksmith hammer iron forge horseshoe', {
    w: 22, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, 11, 16, b, OAK); // the stump
      c.col(6, 11, b, L(OAK));
      for (const x of [9, 12, 14]) c.col(x, 12, b, D(OAK));
      c.row(13, 6, 16, C.iron);
      c.rect(3, 4, 18, 6, C.iron); // the anvil
      c.row(4, 3, 18, C.steel);
      c.row(5, 1, 3, C.iron); // horn
      c.set(1, 4, C.steel);
      c.set(2, 4, C.steel);
      c.set(18, 6, null);
      c.set(3, 6, null);
      c.rect(8, 7, 13, 8, C.ironDark);
      c.rect(6, 9, 15, 10, C.iron);
      c.row(9, 6, 15, C.steel);
      if (!u) {
        c.line(17, 10, 20, b, OAK); // the hammer leaning
        c.rect(15, 8, 18, 10, C.ironDark);
        c.set(15, 8, C.steel);
      } else {
        c.rect(7, 3, 14, 3, C.flame); // a bar left on it, still glowing
        c.rect(7, 3, 10, 3, C.flameLight);
        dots(c, C.flameLight, [5, 1, 12, 0, 16, 2, 2, 2]);
        dots(c, C.flame, [9, 1, 15, 0, 4, 9, 18, 9]);
        c.rect(14, 1, 17, 3, C.ironDark); // the hammer on the face
        c.row(1, 14, 17, C.steel);
        c.line(18, 2, 20, 2, OAK);
      }
    },
    u: [0, 1, 0],
    sw: 14, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 11, 11, b, OAK);
      c.col(2, 11, b, L(OAK));
      for (const x of [5, 8]) c.col(x, 12, b, D(OAK));
      c.row(13, 2, 11, C.iron);
      c.rect(4, 4, 9, 6, C.iron);
      c.row(4, 4, 9, C.steel);
      c.rect(5, 7, 8, 8, C.ironDark);
      c.rect(3, 9, 10, 10, C.iron);
      c.row(9, 3, 10, C.steel);
      if (!u) {
        c.line(10, 9, 12, b, OAK);
        c.rect(9, 7, 11, 9, C.ironDark);
      } else {
        c.rect(1, 3, 11, 3, C.flame);
        c.rect(5, 3, 8, 3, C.flameLight);
        dots(c, C.flameLight, [3, 1, 9, 0, 12, 2]);
        dots(c, C.flame, [6, 1, 2, 9]);
        c.rect(6, 1, 8, 2, C.ironDark);
        c.row(1, 6, 8, C.steel);
      }
    },
    su: [0, 1, 0],
  });

  add('village-smithy-forge', 'smithy forge brick hearth hood coals fire blacksmith chimney tongs', {
    w: 32, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, 10, 27, 17, mix(BRICK, 0.5)); // the sooty back
      c.poly([[3, 10], [11, 2], [20, 2], [28, 10]], C.ironDark); // the hood
      c.line(3, 10, 11, 2, C.iron);
      c.rect(11, 1, 20, 2, C.ironDark);
      c.row(1, 11, 20, C.iron);
      c.row(10, 3, 28, C.iron);
      dots(c, C.rust, [8, 7, 15, 5, 22, 8, 18, 3]);
      bricks(c, 2, 20, 29, b, BRICK, 4);
      c.rect(1, 18, 30, 19, STONE);
      c.row(18, 1, 30, L(STONE));
      hollow(c, 11, 28, 20, b); // where the coal is kept
      heap(c, 12, 19, b, 4, hex('#26232a'), 3);
      heap(c, 8, 23, 17, 3, hex('#26232a'), 5); // the fire bed
      c.line(26, 17, 29, 6, C.iron); // tongs
      c.line(27, 17, 28, 8, C.ironDark);
      if (u) {
        fire(c, 10, 21, 16, 6, 4);
        dots(c, C.flame, [9, 17, 12, 17, 16, 17, 20, 17, 22, 17]);
        dots(c, C.flameLight, [14, 17, 18, 17, 11, 8, 19, 7, 15, 9]);
        dots(c, hex('#7a4a2a'), [6, 11, 25, 11, 8, 12, 23, 12, 5, 14, 26, 14]); // the glow on the bricks
        c.row(10, 8, 23, hex('#7a4a2a'));
      } else dots(c, C.ash, [11, 16, 15, 15, 19, 16]);
    },
    sw: 22, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.rect(16, 10, 19, 17, mix(BRICK, 0.5));
      c.poly([[2, 10], [9, 2], [14, 2], [19, 10]], C.ironDark);
      c.line(2, 10, 9, 2, C.iron);
      c.rect(9, 1, 14, 2, C.ironDark);
      c.row(1, 9, 14, C.iron);
      c.row(10, 2, 19, C.iron);
      dots(c, C.rust, [7, 7, 12, 5, 15, 8]);
      bricks(c, 2, 20, 19, b, BRICK, 6);
      c.rect(1, 18, 20, 19, STONE);
      c.row(18, 1, 20, L(STONE));
      heap(c, 4, 15, 17, 3, hex('#26232a'), 6);
      c.line(3, 17, 2, 7, C.iron);
      if (u) {
        fire(c, 5, 14, 16, 6, 7);
        dots(c, C.flame, [4, 17, 8, 17, 12, 17, 15, 17]);
        dots(c, C.flameLight, [10, 17, 8, 8, 12, 7]);
        dots(c, hex('#7a4a2a'), [17, 11, 18, 13, 17, 15]);
        c.row(10, 6, 16, hex('#7a4a2a'));
      } else dots(c, C.ash, [7, 16, 11, 15]);
    },
  });

  add('village-smithy-bellows', 'smithy bellows great leather bellows forge blacksmith lever chain', {
    w: 32, h: 24, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        t = u ? 12 : 6; // how high the top board stands at the wide end
      post(c, 5, 10, b, OAK);
      post(c, 25, 4, b, OAK);
      c.poly([[7, 13], [27, t + 1], [27, 18], [7, 15]], LEATH);
      for (let i = 1; i < 4; i++) c.line(8, 14, 27, t + 1 + ((18 - t - 1) * i) / 4, D(LEATH));
      c.line(7, 12, 28, t, PALEW);
      c.line(7, 13, 28, t + 1, D(PALEW));
      c.line(7, 15, 28, 18, PALEW);
      c.line(7, 16, 28, 19, D(PALEW));
      dots(c, C.brass, [10, 14, 14, 14, 18, 14, 22, 14, 26, 14].map((v, i) => (i % 2 ? v + (i > 5 ? 1 : 0) : v)));
      c.rect(1, 13, 6, 14, C.iron); // the nozzle
      c.row(13, 1, 6, C.steel);
      c.rect(4, 19, 27, 20, OAK); // the frame
      c.row(19, 4, 27, L(OAK));
      c.line(8, u ? 1 : 5, 29, u ? 5 : 2, OAK); // the lever above
      c.set(25, 3, C.iron);
      chain(c, 29, u ? 6 : 3, 28, t - 1);
      chain(c, 8, u ? 2 : 6, 8, u ? 7 : 10);
      c.set(8, u ? 8 : 11, C.steel);
      if (u) dots(c, C.flameLight, [0, 12, 0, 15]);
      if (u) dots(c, C.flame, [0, 13, 0, 14, 1, 11]);
    },
    sw: 18, sh: 24,
    s(c, u) {
      const b = c.h - 2,
        t = u ? 12 : 6;
      post(c, 2, 4, b, OAK);
      post(c, 14, 4, b, OAK);
      c.oval(4, t, 13, 19, LEATH);
      c.row(t, 6, 11, PALEW);
      c.row(t + 1, 5, 12, D(PALEW));
      c.rect(5, 18, 12, 19, PALEW);
      c.row(19, 5, 12, D(PALEW));
      for (let y = t + 3; y < 18; y += 2) c.row(y, 5, 12, D(LEATH));
      c.rect(8, 13, 9, 14, C.iron);
      c.set(8, 13, C.steel);
      c.rect(2, 19, 15, 20, OAK);
      c.row(19, 2, 15, L(OAK));
      c.rect(8, u ? 3 : 1, 9, u ? 4 : 2, OAK); // the lever, end on
      c.col(8, u ? 5 : 3, t - 1, C.iron);
      if (u) dots(c, C.flameLight, [8, 15, 9, 16]);
    },
  });

  add('village-smithy-quench-trough', 'smithy quenching trough water tub slack tub wooden iron bands blacksmith', {
    w: 26, h: 15, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.poly([[2, 5], [23, 5], [22, b], [3, b]], GREYW);
      for (let y = 8; y < b; y += 3) c.row(y, 3, 22, D(GREYW));
      c.row(5, 2, 23, L(GREYW));
      c.col(6, 5, b, C.iron);
      c.col(19, 5, b, C.iron);
      c.row(4, 3, 22, hex('#2c3a40'));
      c.set(8, 4, hex('#4a5e68'));
      c.set(15, 4, hex('#4a5e68'));
      dots(c, C.moss, [4, b, 12, b, 21, b - 1]);
      if (!u) {
        c.line(14, 4, 20, 1, C.iron); // tongs across the rim
        c.line(15, 4, 21, 2, C.ironDark);
      } else {
        c.line(11, 4, 15, -1, C.ironDark); // a hot bar plunged in
        c.set(11, 4, C.flame);
        c.set(12, 3, C.flameLight);
        wisp(c, 9, 2, 4, C.ghost);
        wisp(c, 13, 1, 5, C.ghost);
        dots(c, C.ghost, [7, 3, 16, 2, 11, -2]);
        dots(c, WAT, [1, b, 24, b, 2, 8]);
      }
    },
    u: [0, 5, 0],
    sw: 14, sh: 15,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 5], [11, 5], [10, b], [3, b]], GREYW);
      for (let y = 8; y < b; y += 3) c.row(y, 3, 10, D(GREYW));
      c.row(5, 2, 11, L(GREYW));
      c.col(4, 6, b, D(GREYW));
      c.col(9, 6, b, D(GREYW));
      c.row(4, 3, 10, hex('#2c3a40'));
      c.set(6, 4, hex('#4a5e68'));
      if (!u) c.line(6, 4, 9, 2, C.iron);
      else {
        c.col(6, -1, 3, C.ironDark);
        c.set(6, 4, C.flame);
        wisp(c, 4, 2, 4, C.ghost);
        wisp(c, 8, 1, 5, C.ghost);
        dots(c, WAT, [1, b, 12, b]);
      }
    },
    su: [0, 5, 0],
  });

  /* ---------- the bakehouse ---------- */
  add('village-bakers-oven', 'bakers oven brick bread oven dome iron door hearth peel logs bakehouse', {
    w: 32, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[2, 11], [5, 5], [11, 2], [20, 2], [26, 5], [29, 11], [29, 23], [2, 23]], BRICK);
      bricks(c, 2, 11, 29, 23, BRICK, 3);
      c.speckle(4, 3, 27, 10, D(BRICK), 6, 2);
      c.speckle(4, 3, 27, 10, L(BRICK), 9, 4);
      c.line(2, 11, 5, 5, L(BRICK));
      c.line(5, 5, 11, 2, L(BRICK));
      bricks(c, 3, 26, 28, b, BRICK, 7);
      c.rect(1, 24, 30, 25, STONE);
      c.row(24, 1, 30, L(STONE));
      hollow(c, 9, 29, 22, b); // logs below
      for (const [x, y] of [[10, b - 2], [14, b - 2], [18, b - 2], [12, b - 5], [16, b - 5]]) {
        c.rect(x, y, x + 2, y + 2, OAK);
        c.set(x + 1, y + 1, PALEW);
      }
      dots(c, SOOT, [13, 9, 15, 8, 17, 9, 14, 6, 16, 5, 15, 3]); // soot above the mouth
      c.rect(9, 12, 22, 23, C.ironDark); // the mouth
      c.rect(11, 10, 20, 11, C.ironDark);
      if (!u) {
        c.rect(10, 13, 21, 23, C.iron);
        c.rect(12, 11, 19, 12, C.iron);
        c.row(11, 12, 19, C.steel);
        c.col(10, 13, 23, C.steel);
        c.rect(14, 17, 17, 18, C.ironDark);
        c.row(21, 11, 20, C.ironDark);
        dots(c, C.rust, [12, 15, 19, 20, 18, 14]);
      } else {
        c.rect(10, 13, 21, 23, SOOT);
        c.rect(12, 11, 19, 12, SOOT);
        fire(c, 16, 21, 22, 5, 3);
        loaf(c, 11, 22, 5);
        c.row(23, 10, 21, hex('#7a4a2a'));
        dots(c, hex('#7a4a2a'), [10, 14, 21, 15, 13, 12]);
        c.rect(6, 12, 8, 23, C.iron); // the door swung aside
        c.col(6, 12, 23, C.steel);
        wisp(c, 15, 1, 3);
      }
      c.col(27, 4, b, PALEW); // the peel
      c.rect(26, 1, 28, 6, PALEW);
      c.col(26, 1, 6, L(PALEW));
    },
    sw: 24, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[7, 11], [9, 5], [13, 2], [17, 2], [20, 5], [21, 11], [21, 23], [7, 23]], BRICK);
      bricks(c, 7, 11, 21, 23, BRICK, 5);
      c.speckle(9, 3, 20, 10, D(BRICK), 6, 2);
      c.line(7, 11, 9, 5, L(BRICK));
      bricks(c, 7, 26, 21, b, BRICK, 8);
      c.rect(3, 24, 22, 25, STONE);
      c.row(24, 3, 22, L(STONE));
      c.rect(5, 26, 6, b, D(BRICK));
      dots(c, SOOT, [8, 9, 9, 7, 8, 6]);
      if (!u) {
        c.rect(5, 12, 6, 23, C.iron);
        c.col(5, 12, 23, C.steel);
        c.set(4, 17, C.ironDark);
      } else {
        c.rect(1, 13, 5, 23, C.iron); // the door standing open
        c.row(13, 1, 5, C.steel);
        c.rect(6, 13, 6, 23, C.flame);
        dots(c, C.flameLight, [6, 18, 6, 21]);
        dots(c, hex('#7a4a2a'), [4, 24, 5, 24, 6, 24, 3, 24]);
        loaf(c, 1, 23, 4);
        wisp(c, 8, 1, 3);
      }
      c.col(18, 4, b, PALEW);
      c.rect(17, 1, 19, 6, PALEW);
    },
  });

  add('village-bread-rack', 'bread rack bakers shelves loaves cooling wooden rack bakehouse', {
    w: 24, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 2, 2, b, PALEW);
      post(c, 20, 2, b, PALEW);
      for (const y of [8, 15, 22, 29]) {
        board(c, 2, y, 21, y + 1, PALEW);
        c.row(y + 2, 4, 19, mix(PALEW, 0.5));
      }
      c.row(2, 2, 21, L(PALEW));
      if (!u) {
        for (const y of [7, 14, 21, 28]) {
          loaf(c, 5, y, 6);
          loaf(c, 13, y, 6, y % 2 ? BREAD : hex('#96683a'));
        }
        c.rect(9, 5, 12, 5, L(BREAD));
      } else {
        loaf(c, 13, 14, 6);
        c.set(15, 13, C.rot); // gone green
        c.set(17, 13, C.rot);
        c.set(16, 12, C.rot);
        dots(c, BREAD, [6, 7, 9, 7, 16, 7, 5, 21, 11, 28, 7, 14, 15, 28]); // crumbs
        c.rect(6, 20, 9, 21, hex('#5a5258')); // a rat
        c.set(10, 21, hex('#5a5258'));
        c.set(5, 20, hex('#a88a8a'));
        c.row(21, 11, 13, hex('#8a6a6a'));
        dots(c, BREAD, [10, b, 14, b, 15, b - 1]);
      }
    },
    sw: 12, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      post(c, 2, 2, b, PALEW);
      post(c, 8, 2, b, PALEW);
      for (const y of [8, 15, 22, 29]) board(c, 2, y, 9, y + 1, PALEW);
      c.row(2, 2, 9, L(PALEW));
      if (!u)
        for (const y of [7, 14, 21, 28]) {
          c.rect(4, y - 2, 7, y, BREAD);
          c.row(y - 2, 4, 7, L(BREAD));
          c.set(4, y - 2, null);
          c.set(7, y - 2, null);
        }
      else {
        c.rect(4, 12, 7, 14, BREAD);
        c.row(12, 5, 6, C.rot);
        dots(c, BREAD, [5, 7, 6, 28, 4, 21]);
        c.rect(5, 20, 7, 21, hex('#5a5258'));
        c.set(4, 20, hex('#a88a8a'));
        dots(c, BREAD, [10, b, 6, b]);
      }
    },
  });

  add('village-dough-trough', 'dough trough kneading trough bakers wooden bin lid flour bakehouse', {
    w: 30, h: 19, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.line(6, 12, 4, b, OAK);
      c.line(7, 12, 5, b, D(OAK));
      c.line(22, 12, 24, b, OAK);
      c.line(23, 12, 25, b, D(OAK));
      c.row(14, 6, 23, D(OAK));
      c.poly([[2, 6], [27, 6], [24, 12], [5, 12]], PALEW);
      c.row(6, 2, 27, L(PALEW));
      c.line(2, 6, 5, 12, L(PALEW));
      c.row(9, 4, 25, D(PALEW));
      c.row(12, 5, 24, D(PALEW));
      dots(c, C.white, [8, 8, 15, 10, 21, 7, 11, 11]);
      if (!u) {
        board(c, 1, 4, 28, 5, GREYW);
        c.rect(12, 3, 17, 3, OAK);
        c.rect(19, 4, 26, 8, C.white); // a floury cloth
        c.row(8, 20, 25, D(C.white));
        c.set(19, 8, null);
        c.set(26, 8, null);
      } else {
        c.rect(4, 3, 25, 5, DOUGH); // the dough has risen over the rim
        c.row(2, 7, 20, DOUGH);
        c.row(1, 10, 16, L(DOUGH));
        c.row(2, 7, 9, L(DOUGH));
        c.row(5, 4, 25, D(DOUGH));
        c.rect(2, 6, 4, 8, DOUGH);
        c.set(3, 9, DOUGH);
        dots(c, D(DOUGH), [12, 3, 18, 4, 9, 4]);
        c.rect(13, 3, 15, 4, hex('#8a7a66')); // the print of a hand
        dots(c, hex('#8a7a66'), [12, 2, 14, 2, 16, 2]);
        dots(c, C.white, [3, b, 9, b, 14, b - 1, 20, b, 26, b]);
      }
    },
    u: [0, 1, 0],
    sw: 16, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      c.col(4, 12, b, OAK);
      c.col(11, 12, b, D(OAK));
      c.row(14, 4, 11, D(OAK));
      c.poly([[2, 6], [13, 6], [11, 12], [4, 12]], PALEW);
      c.row(6, 2, 13, L(PALEW));
      c.line(2, 6, 4, 12, L(PALEW));
      c.row(9, 4, 12, D(PALEW));
      if (!u) {
        board(c, 1, 4, 14, 5, GREYW);
        c.rect(8, 4, 12, 8, C.white);
        c.row(8, 9, 11, D(C.white));
      } else {
        c.rect(3, 3, 12, 5, DOUGH);
        c.row(2, 5, 10, DOUGH);
        c.row(1, 6, 9, L(DOUGH));
        c.row(5, 3, 12, D(DOUGH));
        c.rect(2, 6, 3, 8, DOUGH);
        dots(c, C.white, [2, b, 8, b, 13, b]);
      }
    },
    su: [0, 1, 0],
  });

  /* ---------- the tavern ---------- */
  add('village-tavern-sign', 'tavern sign inn sign hanging post pub signboard crow moon chains', {
    w: 26, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 3, 2, b, OAK, 3);
      c.rect(2, 1, 6, 2, OAK);
      c.row(1, 2, 6, L(OAK));
      board(c, 3, 5, 23, 6, OAK);
      c.line(6, 13, 12, 7, D(OAK));
      c.set(23, 4, C.iron);
      const sign = (x, y) => {
        c.rect(x, y, x + 13, y + 14, OAK);
        c.rect(x + 1, y + 1, x + 12, y + 13, hex('#33423a'));
        c.row(y, x, x + 13, L(OAK));
        c.oval(x + 6, y + 2, x + 11, y + 7, C.bone); // a moon
        c.rect(x + 3, y + 8, x + 7, y + 10, SOOT); // and a crow
        c.rect(x + 6, y + 6, x + 8, y + 8, SOOT);
        c.set(x + 9, y + 7, C.mustard);
        c.set(x + 2, y + 9, SOOT);
        c.col(x + 5, y + 11, y + 12, SOOT);
        c.row(y + 13, x + 2, x + 11, C.mustard);
      };
      if (!u) {
        chain(c, 10, 7, 10, 9);
        chain(c, 21, 7, 21, 9);
        sign(9, 10);
      } else {
        chain(c, 10, 7, 10, 9); // one chain gone: it hangs by a corner
        c.set(21, 7, C.iron);
        const s2 = kit.canvas(14, 15); // the board drawn on a canvas of its own and put on turned
        (function (cv) {
          cv.rect(0, 0, 13, 14, OAK);
          cv.rect(1, 1, 12, 13, hex('#33423a'));
          cv.row(0, 0, 13, L(OAK));
          cv.oval(6, 2, 11, 7, C.bone);
          cv.rect(3, 8, 7, 10, SOOT);
          cv.rect(6, 6, 8, 8, SOOT);
          cv.set(9, 7, C.mustard);
          cv.set(2, 9, SOOT);
          cv.col(5, 11, 12, SOOT);
          cv.row(13, 2, 11, C.mustard);
        })(s2);
        for (let j = 0; j < 15; j++) for (let i = 0; i < 14; i++) if (s2.get(i, j)) c.set(10 + i * 0.86 - j * 0.42, 10 + j * 0.9 + i * 0.45, s2.get(i, j));
        dots(c, C.iron, [16, b, 17, b, 19, b - 1]);
      }
      grass(c, [2, 7], b);
    },
    sw: 10, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      post(c, 3, 2, b, OAK, 3);
      c.rect(2, 1, 6, 2, OAK);
      c.row(1, 2, 6, L(OAK));
      c.rect(3, 5, 5, 6, L(OAK));
      c.row(6, 3, 5, D(OAK));
      if (!u) {
        c.col(4, 7, 9, C.iron);
        c.rect(4, 10, 5, 24, hex('#33423a'));
        c.col(4, 10, 24, L(OAK));
        c.row(24, 4, 5, C.mustard);
      } else {
        c.col(4, 7, 9, C.iron);
        c.rect(5, 11, 7, 27, hex('#33423a'));
        c.line(4, 10, 6, 28, L(OAK));
        c.set(7, 28, C.mustard);
        dots(c, C.iron, [7, b, 8, b]);
      }
      grass(c, [2, 7], b);
    },
  });

  add('village-tavern-table-benches', 'tavern table and benches trestle table inn alehouse tankards candle jug', {
    w: 40, h: 20, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.line(11, 9, 9, b, D(OAK)); // trestles
      c.line(13, 9, 15, b, D(OAK));
      c.line(27, 9, 25, b, D(OAK));
      c.line(29, 9, 31, b, D(OAK));
      c.row(13, 11, 29, D(OAK));
      board(c, 5, 7, 35, 8, OAK);
      c.rect(8, 4, 10, 6, hex('#6a5a4a')); // jug
      c.set(9, 3, hex('#6a5a4a'));
      c.set(11, 5, hex('#6a5a4a'));
      c.set(8, 4, L(hex('#6a5a4a')));
      c.col(20, 5, 6, C.bone); // candle
      c.row(6, 19, 21, C.brass);
      tankard(c, 13, 6);
      if (!u) {
        tankard(c, 25, 6);
        tankard(c, 30, 6);
      } else {
        flame(c, 20, 4);
        c.rect(25, 5, 28, 6, PEWTER); // a tankard on its side
        c.col(28, 5, 6, hex('#d0c8b0'));
        c.row(6, 29, 33, ALE);
        drip(c, 34, 7, 14, ALE);
        puddle(c, 31, 37, b, ALE);
        c.line(16, 6, 17, 3, C.steel); // a knife stuck in the board
        c.set(17, 2, OAK);
        c.set(18, 1, OAK);
        dots(c, C.paper, [22, 6, 23, 6, 5, b, 6, b]);
      }
      board(c, 3, 12, 37, 13, GREYW); // the near bench
      legs(c, [5, 34], 14, b, GREYW);
      c.row(16, 7, 33, D(GREYW));
    },
    sw: 28, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      c.line(11, 9, 9, b, D(OAK));
      c.line(16, 9, 18, b, D(OAK));
      c.row(13, 10, 17, D(OAK));
      board(c, 8, 7, 19, 8, OAK);
      c.row(8, 8, 19, D(OAK));
      tankard(c, 10, 6);
      c.col(15, 5, 6, C.bone);
      for (const x of [1, 21]) {
        board(c, x, 12, x + 5, 13, GREYW);
        c.col(x + 1, 14, b, GREYW);
        c.col(x + 4, 14, b, D(GREYW));
      }
      if (u) {
        flame(c, 15, 4);
        c.rect(17, 5, 19, 6, PEWTER);
        drip(c, 20, 7, 14, ALE);
        puddle(c, 18, 23, b, ALE);
        c.col(12, 2, 6, C.steel);
        c.set(12, 1, OAK);
      }
    },
  });

  add('village-tavern-counter', 'tavern counter bar inn alehouse cask on the bar tap tankards', {
    w: 38, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2,
        DK = hex('#4f3a2c');
      face(c, 2, 13, 35, b, DK);
      for (let x = 4; x < 33; x += 11) panel(c, x, 15, x + 8, b - 3, DK);
      board(c, 1, 11, 36, 12, OAK);
      c.row(b - 1, 2, 35, C.brass);
      c.rect(4, 9, 12, 10, D(OAK)); // the cradle
      barrelEnd(c, 8, 5, 4);
      c.set(8, 8, C.brass);
      c.rect(27, 4, 29, 10, hex('#3a4a3a')); // a bottle
      c.col(28, 2, 3, hex('#3a4a3a'));
      c.set(27, 5, hex('#5a6a5a'));
      c.rect(31, 7, 33, 10, hex('#6a5a4a'));
      if (!u) {
        tankard(c, 15, 10);
        tankard(c, 20, 10);
      } else {
        drip(c, 8, 9, b - 1, ALE); // the tap left open
        c.row(12, 7, 10, ALE);
        c.row(b - 1, 6, 10, ALE);
        puddle(c, 3, 14, b, ALE);
        c.rect(15, 9, 18, 10, PEWTER);
        c.col(18, 9, 10, hex('#d0c8b0'));
        c.row(10, 19, 21, ALE);
        dots(c, C.steel, [17, 6, 19, 5]); // coins left lying
        dots(c, C.brass, [24, 10, 25, 10]);
      }
    },
    sw: 16, sh: 28,
    s(c, u) {
      const b = c.h - 2,
        DK = hex('#4f3a2c');
      face(c, 3, 13, 12, b, DK);
      panel(c, 5, 15, 10, b - 3, DK);
      board(c, 1, 11, 14, 12, OAK);
      c.set(2, b - 1, C.brass);
      c.rect(4, 9, 11, 10, D(OAK));
      barrelLying(c, 3, 2, 12, 8);
      c.set(2, 6, C.brass);
      c.set(1, 6, C.brass);
      if (!u) c.rect(6, 9, 8, 10, D(OAK));
      else {
        drip(c, 1, 7, 10, ALE);
        drip(c, 2, 13, b - 1, ALE);
        puddle(c, 0, 5, b, ALE);
      }
    },
  });

  add('village-tavern-settle', 'tavern settle high backed bench oak box seat inn fireside blanket', {
    w: 30, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2,
        DK = hex('#523c2c');
      boards(c, 2, 3, 27, 22, DK, 5);
      c.rect(1, 2, 28, 3, OAK);
      c.row(2, 1, 28, L(OAK));
      c.rect(1, 13, 2, 23, OAK); // the wings
      c.rect(27, 13, 28, 23, OAK);
      c.set(3, 13, OAK);
      c.set(26, 13, OAK);
      face(c, 2, 25, 27, b - 1, DK);
      panel(c, 4, 27, 13, b - 3, DK);
      panel(c, 16, 27, 25, b - 3, DK);
      c.rect(2, b, 4, b, OAK);
      c.rect(25, b, 27, b, OAK);
      if (!u) {
        board(c, 1, 23, 28, 24, OAK);
        c.rect(17, 19, 25, 22, hex('#5a3a44')); // a folded blanket
        c.row(19, 17, 25, hex('#74505a'));
        c.row(21, 17, 25, hex('#44283a'));
      } else {
        c.rect(3, 22, 26, 24, SOOT); // the seat is a lid, and it is up
        c.rect(3, 9, 26, 21, OAK);
        c.row(9, 3, 26, L(OAK));
        c.row(21, 3, 26, D(OAK));
        c.col(9, 10, 20, D(OAK));
        c.col(20, 10, 20, D(OAK));
        c.rect(8, 23, 15, 24, hex('#5a3a44')); // the blanket pushed in, and under it …
        c.rect(17, 23, 21, 23, C.bone);
        c.set(22, 24, C.bone);
        c.set(16, 24, C.bone);
      }
    },
    sw: 14, sh: 36,
    s(c, u) {
      const b = c.h - 2,
        DK = hex('#523c2c');
      c.poly([[9, 2], [11, 2], [11, b], [2, b], [2, 23], [3, 17], [6, 13], [9, 12]], DK);
      c.col(11, 2, b, D(DK));
      c.col(9, 2, 12, L(DK));
      c.line(9, 12, 6, 13, L(DK));
      c.line(5, 14, 3, 17, L(DK));
      c.col(2, 18, b, L(DK));
      panel(c, 4, 26, 9, b - 3, DK);
      c.row(24, 2, 11, D(DK));
      c.rect(8, 1, 12, 2, OAK);
      c.row(1, 8, 12, L(OAK));
      if (!u) c.rect(1, 23, 2, 24, OAK);
      else {
        c.line(8, 22, 3, 10, OAK); // the lid up
        c.line(9, 22, 4, 10, D(OAK));
        c.set(1, 23, hex('#5a3a44'));
        c.set(1, 24, hex('#5a3a44'));
      }
    },
  });

  add('village-barrel-stack', 'barrel stack three barrels casks wine ale lying cellar tavern yard', {
    w: 34, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      barrelEnd(c, 9, b - 7, 7);
      barrelEnd(c, 24, b - 7, 7);
      barrelEnd(c, 16, b - 19, 7);
      c.rect(1, b - 1, 2, b, OAK); // chocks
      c.rect(31, b - 1, 32, b, OAK);
      c.set(15, b - 12, C.woodDark);
      dots(c, C.moss, [4, b - 2, 28, b - 1]);
      if (u) {
        c.oval(20, b - 11, 28, b - 3, SOOT); // one head stove in
        c.set(21, b - 9, hex('#6a4c34'));
        c.set(27, b - 5, hex('#6a4c34'));
        c.line(20, b - 7, 23, b - 8, hex('#6a4c34'));
        c.line(28, b - 8, 26, b - 6, hex('#8a6a4a'));
        c.rect(22, b - 3, 26, b - 1, WINE);
        c.row(b, 14, 32, WINE);
        c.row(b - 1, 20, 28, WINE);
        c.set(18, b, L(WINE));
        dots(c, hex('#6a4c34'), [17, b - 1, 30, b - 1, 12, b]);
      }
    },
    sw: 20, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      barrelLying(c, 2, b - 14, 17, b);
      barrelLying(c, 2, b - 26, 17, b - 12);
      c.rect(8, b - 13, 11, b - 12, C.woodDark);
      if (u) {
        c.col(2, b - 10, b - 4, SOOT);
        c.col(1, b - 3, b, WINE);
        c.row(b, 0, 8, WINE);
        c.set(3, b - 1, WINE);
        c.set(0, b - 1, hex('#6a4c34'));
      }
    },
    su: [1, 0, 0],
  });

  add('village-stocks', 'village stocks punishment wooden stocks leg holes padlock pillory green', {
    w: 34, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2,
        up = u ? 5 : 0;
      post(c, 3, 3, b, OAK, 3);
      post(c, 28, 3, b, OAK, 3);
      c.row(2, 3, 5, L(OAK));
      c.row(2, 28, 30, L(OAK));
      face(c, 6, 14, 27, 18, GREYW);
      face(c, 6, 9 - up, 27, 13 - up, GREYW);
      for (const x of [9, 14, 19, 24]) {
        c.rect(x - 1, 14, x + 1, 15, u ? null : SOOT);
        if (u) {
          c.clearRect(x - 1, 14, x + 1, 15);
          c.clearRect(x - 1, 12 - up, x + 1, 13 - up);
        } else c.rect(x - 1, 12, x + 1, 13, SOOT);
      }
      c.rect(27, 12 - up, 28, 14 - up, C.iron);
      c.rect(1, 20, 32, 21, D(GREYW)); // the bench they sit on
      c.row(20, 1, 32, GREYW);
      dots(c, hex('#6a7a48'), [11, 17, 22, 10 - up]); // what was thrown
      dots(c, hex('#7a3a2c'), [17, 16, 8, 11 - up, 25, 17]);
      if (!u) {
        c.rect(27, 15, 28, 16, C.brass);
      } else {
        c.rect(30, 15, 31, 17, C.brass); // the padlock hanging open
        c.set(31, 14, C.iron);
        c.rect(12, b - 1, 16, b, hex('#3a2c24')); // a shoe left behind
        c.rect(15, b - 3, 16, b - 2, hex('#3a2c24'));
        c.set(12, b - 1, null);
        blood(c, [14, 14, 19, 15]);
      }
      grass(c, [2, 8, 31], b);
    },
    sw: 12, sh: 26,
    s(c, u) {
      const b = c.h - 2,
        up = u ? 5 : 0;
      post(c, 4, 3, b, OAK, 4);
      c.row(2, 4, 7, L(OAK));
      c.rect(3, 9 - up, 8, 9 - up, GREYW);
      c.rect(3, 13 - up, 8, 13 - up, D(GREYW));
      c.rect(3, 14, 8, 14, GREYW);
      c.rect(3, 18, 8, 18, D(GREYW));
      c.rect(1, 20, 10, 21, D(GREYW));
      c.row(20, 1, 10, GREYW);
      c.col(2, 22, b, D(GREYW));
      c.col(9, 22, b, D(GREYW));
      if (!u) c.rect(5, 13, 6, 15, C.brass);
      else {
        c.rect(8, 15, 9, 17, C.brass);
        c.rect(0, b - 1, 2, b, hex('#3a2c24'));
      }
      grass(c, [9], b);
    },
  });

  add('village-notice-board', 'village notice board posts little roof papers bills missing poster parish', {
    w: 28, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 4, 6, b, OAK);
      post(c, 22, 6, b, OAK);
      boards(c, 2, 8, 25, 22, GREYW, 6);
      c.frame(2, 8, 25, 22, OAK);
      c.poly([[1, 6], [4, 3], [23, 3], [26, 6]], TAR);
      c.row(3, 4, 23, hex('#5a5258'));
      c.row(7, 2, 25, D(OAK));
      const paper = (x0, y0, x1, y1, col = C.paper) => {
        c.rect(x0, y0, x1, y1, col);
        for (let y = y0 + 1; y < y1; y += 2) c.row(y, x0 + 1, x1 - 1, D(col));
        c.set(x0 + 1, y0, C.iron);
      };
      if (!u) {
        paper(4, 10, 9, 16);
        paper(11, 10, 16, 14, C.parchment);
        paper(18, 11, 23, 18);
        paper(6, 17, 12, 20, C.parchment);
        c.rect(19, 12, 22, 14, hex('#7a6a58')); // a likeness: somebody is missing
        c.set(20, 12, C.flesh);
        c.set(21, 12, C.flesh);
      } else {
        paper(9, 10, 18, 20, C.white); // one new bill over everything
        c.rect(11, 11, 16, 12, K);
        c.rect(12, 14, 15, 16, C.blood);
        dots(c, C.paper, [4, 10, 5, 10, 4, 11, 22, 11, 23, 11, 23, 12, 6, 20, 21, 18, 23, 19]); // torn corners
        dots(c, C.iron, [4, 10, 23, 11]);
        dots(c, C.paper, [7, b, 8, b, 14, b - 1, 15, b, 19, b]);
      }
      grass(c, [3, 24], b);
    },
    sw: 10, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      post(c, 4, 6, b, OAK, 3);
      c.rect(3, 8, 3, 22, GREYW);
      c.poly([[1, 6], [3, 3], [7, 3], [8, 6]], TAR);
      c.row(3, 3, 7, hex('#5a5258'));
      if (!u) dots(c, C.paper, [2, 10, 2, 11, 2, 13, 2, 14, 2, 17, 2, 19]);
      else {
        dots(c, C.white, [2, 10, 2, 11, 2, 12, 2, 13, 2, 14, 2, 15, 2, 16, 2, 17, 2, 18, 2, 19, 2, 20]);
        dots(c, C.paper, [1, b, 2, b, 0, b - 1]);
      }
      grass(c, [8], b);
    },
  });
};
