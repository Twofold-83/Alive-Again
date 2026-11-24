/* Apothecary, third part: the large things, and what stands in the yard and the physic garden. Part of tools/big/env2-apoth.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, cabSide, hollow, pane, flame, fire, wisp, bottle, shards, bricks, pot, bush, jar, shelfRow, carboy, glow, puddle, wicker, cartWheel, wheelEdge, planksV, heap } = H;
  const add = H.reg('env-apothecary', 'Apothecary');
  const MAH = hex('#5a3226'),
    OAK = hex('#6a4a32'),
    PINE = hex('#94714a'),
    EB = hex('#2b242a'),
    BR = C.brass,
    GILT = C.gold,
    MARB = hex('#b4aea0'),
    CHINA = hex('#d6d2c4'),
    DELFT = hex('#44506e'),
    COPPER = hex('#a35f38'),
    RED = hex('#8a2f2c'),
    GREEN = hex('#3e6a4c'),
    BLUE = hex('#3d5a80'),
    AMBER = hex('#a8762c'),
    SHOPGREEN = hex('#2f4a3c'),
    WAGRED = hex('#6a2a26'),
    CANVAS = hex('#a39878'),
    SAGE = hex('#7a8a5a'),
    DRIED = hex('#7a6a45'),
    LAV = hex('#6a5a80'),
    TANSY = hex('#a8904e'),
    STRAWC = hex('#b09a58'),
    EARTH = C.earth,
    BONE = C.bone;
  const lamp = (c, x, y, on) => {
    c.rect(x, y, x + 1, y + 2, on ? C.flameLight : C.glass);
    c.row(y - 1, x, x + 1, BR);
    c.row(y + 3, x, x + 1, BR);
    if (on) glow(c, x, y - 2);
  };

  /* ---------- large ---------- */
  add('apoth-medicine-wagon-travelling', 'apothecary large travelling medicine wagon quack doctor caravan painted cart elixir show', {
    w: 48, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(36, 1, 37, 3, C.ironDark); // stove pipe
      c.row(1, 35, 38, C.iron);
      c.rect(5, 3, 45, 4, CANVAS);
      c.row(3, 6, 44, L(CANVAS));
      c.row(5, 5, 45, D(CANVAS));
      face(c, 7, 6, 44, b - 9, WAGRED);
      c.frame(9, 7, 42, b - 11, GILT);
      c.rect(7, b - 9, 44, b - 8, D(WAGRED));
      dots(c, GILT, [12, 9, 13, 9, 14, 9, 16, 9, 17, 9, 19, 9, 20, 9, 21, 9, 23, 9, 24, 9, 26, 9, 28, 9, 29, 9, 30, 9, 32, 9, 33, 9, 35, 9, 36, 9, 38, 9, 39, 9]);
      if (!u) {
        face(c, 15, 11, 31, 17, SHOPGREEN); // the hatch, shut
        c.col(23, 11, 17, D(SHOPGREEN));
        dots(c, BR, [22, 14, 24, 14]);
      } else {
        hollow(c, 15, 11, 31, 17, WAGRED);
        c.row(14, 16, 30, mix(WAGRED, 0.8));
        shelfRow(c, 16, 30, 13, 4, 3);
        shelfRow(c, 16, 30, 17, 9, 3, [2, 5]);
        c.rect(14, 18, 32, 18, PINE); // the counter flap down
        c.poly([[15, 10], [31, 10], [33, 8], [13, 8]], SHOPGREEN); // the shutter propped up
        c.row(8, 13, 33, L(SHOPGREEN));
        bottle(c, 20, 17, 5, AMBER, 2);
      }
      c.rect(11, 12, 12, 16, AMBER); // a painted bottle each side
      c.set(11, 11, CHINA);
      c.rect(35, 12, 36, 16, GREEN);
      c.set(35, 11, CHINA);
      dots(c, GILT, [17, 20, 18, 20, 20, 20, 21, 20, 22, 20, 24, 20, 25, 20, 27, 20, 28, 20, 29, 20]);
      c.rect(1, b - 12, 7, b - 11, OAK); // the driver's board and seat
      c.rect(2, b - 16, 6, b - 14, EB);
      c.row(b - 16, 2, 6, L(EB));
      c.col(6, b - 13, b - 12, OAK);
      c.line(5, b - 10, 1, b - 4, OAK); // a shaft, down
      lamp(c, 4, 8, u);
      c.col(6, 8, 10, C.iron);
      c.rect(45, b - 8, 46, b - 7, OAK); // back steps
      c.rect(45, b - 4, 46, b - 3, OAK);
      c.row(b - 8, 9, 42, C.ironDark);
      cartWheel(c, 13, b - 5, 5, OAK);
      cartWheel(c, 36, b - 6, 6, OAK);
    },
    sw: 28, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 2, b - 12, b, OAK, 2);
      wheelEdge(c, 24, b - 12, b, OAK, 2);
      c.row(b - 6, 4, 23, C.ironDark);
      c.rect(4, 3, 23, 4, CANVAS);
      c.row(3, 6, 21, L(CANVAS));
      c.clear(4, 3);
      c.clear(23, 3);
      c.row(5, 4, 23, D(CANVAS));
      face(c, 5, 6, 22, b - 9, WAGRED);
      c.rect(5, b - 9, 22, b - 8, D(WAGRED));
      dots(c, GILT, [7, 8, 8, 8, 10, 8, 11, 8, 16, 8, 17, 8, 19, 8, 20, 8]);
      if (!u) {
        face(c, 10, 10, 17, b - 10, SHOPGREEN); // the back door
        pane(c, 12, 12, 15, 16, C.glass);
        c.set(16, 19, BR);
      } else {
        c.rect(10, 10, 17, b - 10, hex('#3a2a20'));
        c.col(10, 10, b - 10, L(SHOPGREEN)); // the door edge on
        c.row(15, 11, 17, D(WAGRED));
        shelfRow(c, 12, 17, 14, 6, 3);
        c.rect(12, b - 14, 17, b - 11, hex('#7a3a30')); // a bunk in there
        c.row(b - 15, 12, 17, CHINA);
        dots(c, C.flameLight, [14, 11, 15, 11]);
        dots(c, C.glow, [13, 12, 16, 12]);
      }
      c.rect(9, b - 8, 18, b - 7, OAK);
      c.rect(10, b - 4, 17, b - 3, OAK);
      dots(c, D(OAK), [10, b - 6, 17, b - 6, 10, b - 5, 17, b - 5]);
      lamp(c, 2, 9, u);
      c.rect(19, 1, 20, 2, C.ironDark);
    },
    base: 'side',
  });

  add('apoth-dispensing-counter-long', 'apothecary large long dispensing counter glass screen hatch brass lamp chemist shop mahogany', {
    w: 48, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 16, 46, b - 15, MARB);
      face(c, 2, b - 14, 45, b - 1, MAH);
      c.rect(1, b, 46, b, D(MAH));
      for (let i = 0; i < 4; i++) {
        panel(c, 4 + i * 11, b - 12, 12 + i * 11, b - 3, MAH);
        c.row(b - 8, 6 + i * 11, 10 + i * 11, GILT);
      }
      /* the screen */
      face(c, 14, b - 29, 33, b - 17, MAH);
      c.row(b - 29, 13, 34, L(MAH));
      pane(c, 16, b - 26, 21, b - 18, C.glass);
      pane(c, 26, b - 26, 31, b - 18, C.glass);
      c.rect(22, b - 24, 25, b - 17, hex('#2a2024')); // the hatch
      c.row(b - 25, 23, 24, hex('#2a2024'));
      dots(c, GILT, [16, b - 28, 17, b - 28, 19, b - 28, 20, b - 28, 21, b - 28, 23, b - 28, 24, b - 28, 26, b - 28, 27, b - 28, 29, b - 28, 30, b - 28, 31, b - 28]);
      c.col(24, b - 31 + 1, b - 30, BR);
      /* left: scale and jars */
      c.col(7, b - 23, b - 17, BR);
      c.row(b - 23, 3, 11, BR);
      for (const x of [3, 11]) {
        c.col(x, b - 22, b - 21, D(BR));
        c.row(b - 20, x - 1, x + 1, BR);
      }
      c.row(b - 17, 6, 8, EB);
      /* right: a carboy, jars, the lamp */
      carboy(c, 38, b - 17, 2, 9, RED);
      jar(c, 42, b - 17, 3, 6, CHINA, DELFT, DELFT);
      c.col(35, b - 26, b - 23, BR); // gas bracket on the screen
      c.row(b - 27, 35, 37, BR);
      c.rect(37, b - 30, 38, b - 28, u ? C.flameLight : C.glassLight);
      if (u) {
        glow(c, 37, b - 31);
        c.set(39, b - 29, C.glow);
        c.rect(22, b - 19, 25, b - 17, C.paper); // a packet waiting in the hatch
        c.row(b - 18, 22, 25, RED);
        c.set(23, b - 20, C.paper);
        bottle(c, 17, b - 17, 5, BLUE, 2);
        bottle(c, 29, b - 17, 6, AMBER, 2);
        dots(c, CHINA, [12, b - 17, 13, b - 17, 2, b - 21 + 0]);
        c.rect(23, b - 23, 24, b - 22, hex('#5a4a44')); // someone behind the glass
        dots(c, C.glow, [27, b - 24, 17, b - 24]);
      }
    },
    sw: 15, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 16, 13, b - 15, MARB);
      cabSide(c, 2, b - 14, 12, b - 1, MAH);
      c.rect(1, b, 13, b, D(MAH));
      face(c, 5, b - 29, 7, b - 17, MAH);
      c.row(b - 29, 4, 8, L(MAH));
      c.col(8, b - 27, b - 18, C.glass);
      carboy(c, 10, b - 17, 2, 9, RED);
      c.row(b - 27, 8, 10, BR);
      c.rect(10, b - 30, 11, b - 28, u ? C.flameLight : C.glassLight);
      if (u) {
        glow(c, 10, b - 31);
        c.rect(3, b - 19, 4, b - 17, C.paper);
        c.set(12, b - 29, C.glow);
      }
    },
    base: 'side',
  });

  add('apoth-great-still', 'apothecary large great still copper pot brick furnace condenser worm tub spirit safe distillery', {
    w: 48, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.oval(3, b - 22, 21, b - 6, COPPER); // the pot
      for (let i = 0; i < 7; i++) c.set(5 + (i >> 1), b - 12 - i, L(COPPER));
      c.row(b - 14, 4, 20, D(COPPER));
      for (let x = 5; x <= 19; x += 2) c.set(x, b - 13, D(COPPER));
      c.oval(8, b - 28, 16, b - 20, COPPER); // the head
      c.set(10, b - 26, L(COPPER));
      c.row(b - 20, 9, 15, D(COPPER));
      c.line(15, b - 27, 19, b - 29, COPPER); // the lyne arm
      c.row(b - 29, 19, 36, L(COPPER));
      c.row(b - 28, 19, 36, COPPER);
      c.line(36, b - 28, 38, b - 22, COPPER);
      bricks(c, 1, b - 9, 23, b);
      c.row(b - 9, 1, 23, C.stoneLight);
      c.rect(8, b - 6, 15, b - 1, C.ironDark);
      c.row(b - 7, 9, 14, C.ironDark);
      dots(c, C.iron, [8, b - 5, 8, b - 2]);
      c.set(14, b - 3, BR);
      c.rect(18, b - 18, 19, b - 16, BR); // a gauge
      c.set(18, b - 17, CHINA);
      /* the condenser */
      face(c, 32, b - 21, 45, b - 3, OAK);
      for (let x = 35; x < 45; x += 3) c.col(x, b - 20, b - 3, D(OAK));
      for (const y of [b - 18, b - 11, b - 5]) c.row(y, 32, 45, C.iron);
      c.row(b - 21, 32, 45, C.water);
      dots(c, COPPER, [37, b - 22, 38, b - 22, 39, b - 22]);
      legs(c, [33, 43], b - 2, b, D(OAK));
      /* the spirit safe between them */
      c.row(b - 6, 28, 31, COPPER);
      c.frame(25, b - 9, 30, b - 3, BR);
      c.rect(26, b - 8, 29, b - 4, hex('#39474c'));
      c.rect(25, b - 2, 30, b, MAH);
      c.set(27, b - 8, COPPER);
      if (u) {
        hollow(c, 8, b - 6, 14, b - 1, C.rust);
        fire(c, 8, 14, b - 1, 5, 2);
        c.col(15, b - 6, b - 1, C.iron);
        dots(c, C.flame, [6, b, 17, b]);
        wisp(c, 12, b - 29, 4, C.ghost);
        wisp(c, 40, b - 23, 4, C.ghost);
        wisp(c, 35, b - 23, 3, C.ghost);
        c.col(27, b - 7, b - 6, AMBER);
        c.rect(26, b - 5, 29, b - 4, AMBER);
        c.set(18, b - 17, RED);
      }
    },
    sw: 26, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.oval(7, b - 28, 17, b - 18, COPPER); // the head of the pot behind
      c.set(9, b - 26, L(COPPER));
      c.rect(11, b - 29, 14, b - 28, COPPER);
      c.row(b - 29, 11, 14, L(COPPER));
      bricks(c, 2, b - 9, 23, b, hex('#7a4636'), 6);
      c.row(b - 9, 2, 23, C.stoneLight);
      c.oval(3, b - 20, 21, b - 6, COPPER);
      c.rect(2, b - 9, 23, b, hex('#7a4636'));
      bricks(c, 2, b - 9, 23, b, hex('#7a4636'), 6);
      c.row(b - 9, 2, 23, C.stoneLight);
      face(c, 5, b - 21, 19, b - 3, OAK); // the condenser tub in front
      for (let x = 8; x < 19; x += 3) c.col(x, b - 20, b - 3, D(OAK));
      for (const y of [b - 18, b - 11, b - 5]) c.row(y, 5, 19, C.iron);
      c.row(b - 21, 5, 19, C.water);
      dots(c, COPPER, [11, b - 22, 12, b - 22, 13, b - 22]);
      legs(c, [6, 17], b - 2, b, D(OAK));
      c.rect(20, b - 6, 21, b - 6, COPPER);
      c.frame(21, b - 9, 24, b - 3, BR);
      c.rect(22, b - 8, 23, b - 4, hex('#39474c'));
      c.rect(21, b - 2, 24, b, MAH);
      if (u) {
        dots(c, C.flame, [3, b, 4, b - 1, 21, b - 1 + 1, 2, b - 2]);
        dots(c, C.flameLight, [3, b - 1, 4, b]);
        wisp(c, 10, b - 23, 4, C.ghost);
        wisp(c, 15, b - 23, 3, C.ghost);
        wisp(c, 12, b - 30, 2, C.ghost);
        c.rect(22, b - 5, 23, b - 4, AMBER);
      }
    },
    base: 'side',
  });

  add('apoth-herb-cart', 'apothecary large herb cart hand barrow market herbs bundles baskets simples seller wheels', {
    w: 47, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [7, 37]) c.col(x, b - 27, b - 13, OAK);
      c.row(b - 27, 6, 38, OAK);
      c.row(b - 28, 6, 38, L(OAK));
      const cols = [SAGE, LAV, TANSY, DRIED, C.moss, SAGE, LAV];
      for (let i = 0; i < 7; i++) {
        if (u && ![1, 5].includes(i)) continue;
        const x = 10 + i * 4;
        c.set(x, b - 26, STRAWC);
        c.rect(x - 1, b - 25, x + 1, b - 21, cols[i]);
        c.col(x - 1, b - 25, b - 21, L(cols[i]));
        c.set(x, b - 20, D(cols[i]));
      }
      board(c, 5, b - 13, 39, b - 12, PINE);
      face(c, 6, b - 16, 38, b - 14, PINE);
      for (let x = 9; x < 38; x += 4) c.col(x, b - 16, b - 14, D(PINE));
      c.line(39, b - 13, 45, b - 11, PINE); // the handles
      c.set(45, b - 12, D(PINE));
      c.col(9, b - 11, b, D(PINE)); // the prop
      c.col(35, b - 11, b - 8, D(PINE));
      if (!u) {
        bush(c, 8, b - 20, 16, b - 15, 3, SAGE, hex('#98a878'));
        bush(c, 28, b - 20, 36, b - 15, 5, C.leaf, C.leafLight);
        wicker(c, 18, b - 20, 26, b - 16);
        dots(c, hex('#8a9278'), [19, b - 21, 21, b - 22, 23, b - 21, 25, b - 21]);
        dots(c, LAV, [30, b - 21, 33, b - 20, 35, b - 19]);
        c.rect(40, b - 20, 44, b - 15, C.paper); // the price board
        dots(c, C.slate, [41, b - 19, 42, b - 19, 43, b - 17, 41, b - 17]);
        c.col(42, b - 14, b - 13, OAK);
      } else {
        wicker(c, 18, b - 20, 26, b - 16); // sold out, or nearly
        c.row(b - 20, 19, 25, hex('#3a2a1a'));
        dots(c, SAGE, [9, b - 17, 12, b - 17, 30, b - 17, 33, b - 17, 14, b - 17]);
        dots(c, DRIED, [10, b, 15, b, 28, b, 31, b - 1 + 1, 40, b]);
        c.rect(40, b - 3, 44, b, C.paper); // the board fallen off
        c.set(42, b - 2, C.slate);
        dots(c, GILT, [29, b - 17, 31, b - 17]);
      }
      cartWheel(c, 22, b - 7, 7, OAK);
    },
    sw: 28, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 2, b - 14, b, OAK, 2);
      wheelEdge(c, 24, b - 14, b, OAK, 2);
      c.row(b - 7, 4, 23, C.ironDark);
      for (const x of [5, 22]) c.col(x, b - 27, b - 13, OAK);
      c.row(b - 27, 4, 23, OAK);
      c.row(b - 28, 4, 23, L(OAK));
      const cols = [LAV, SAGE, TANSY, C.moss];
      for (let i = 0; i < 4; i++) {
        if (u && i !== 2) continue;
        const x = 8 + i * 4;
        c.set(x, b - 26, STRAWC);
        c.rect(x - 1, b - 25, x + 1, b - 21, cols[i]);
        c.col(x - 1, b - 25, b - 21, L(cols[i]));
        c.set(x, b - 20, D(cols[i]));
      }
      board(c, 4, b - 13, 23, b - 12, PINE);
      face(c, 5, b - 16, 22, b - 14, PINE);
      for (let x = 8; x < 22; x += 4) c.col(x, b - 16, b - 14, D(PINE));
      for (const x of [7, 19]) {
        c.rect(x, b - 12, x + 1, b - 10, PINE); // the handles, end on
        c.set(x, b - 12, L(PINE));
      }
      c.col(13, b - 11, b, D(PINE));
      if (!u) {
        bush(c, 6, b - 20, 13, b - 15, 3, SAGE, hex('#98a878'));
        bush(c, 14, b - 20, 21, b - 15, 5, C.leaf, C.leafLight);
        dots(c, LAV, [16, b - 21, 19, b - 20]);
      } else {
        dots(c, SAGE, [8, b - 17, 12, b - 17, 18, b - 17]);
        dots(c, DRIED, [9, b, 17, b, 20, b]);
      }
    },
    base: 'side',
  });

  add('apoth-quack-show-stage', 'apothecary large quack doctor medicine show stage platform banner elixir bottles lanterns fair', {
    w: 48, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [3, 43]) {
        c.rect(x, 1, x + 1, b, OAK);
        c.col(x, 1, b, L(OAK));
      }
      if (!u) {
        c.rect(6, 2, 41, 12, CANVAS);
        c.row(2, 6, 41, L(CANVAS));
        c.row(12, 6, 41, D(CANVAS));
      } else {
        c.poly([[6, 2], [41, 2], [41, 6], [33, 12], [6, 12]], CANVAS); // a corner torn down
        c.row(2, 6, 41, L(CANVAS));
        c.poly([[41, 6], [42, 7], [40, 16], [36, 12]], D(CANVAS));
      }
      c.frame(7, 3, u ? 32 : 40, 11, RED);
      for (let x = 10; x < (u ? 30 : 32); x += 2) if (x % 8 !== 6) c.set(x, 5, RED);
      for (let x = 11; x < 30; x += 2) if (x % 6 !== 1) c.set(x, 8, hex('#3a3440'));
      if (!u) {
        c.rect(35, 5, 37, 9, AMBER); // the bottle on the banner
        c.set(36, 4, CHINA);
        c.set(36, 7, CHINA);
      }
      dots(c, C.straw, [5, 3, 5, 11, 42, 3]);
      board(c, 1, b - 9, 46, b - 8, PINE); // the platform
      c.rect(2, b - 7, 45, b - 6, D(PINE));
      for (const x of [8, 22, 36]) {
        c.col(x, b - 5, b, OAK);
        c.line(x + 1, b - 5, x + 6, b, D(OAK));
      }
      c.rect(39, b - 3, 46, b - 2, PINE); // steps
      c.rect(42, b - 6, 46, b - 5, PINE);
      c.rect(14, b - 16, 32, b - 10, C.wine); // the table under its cloth
      c.row(b - 16, 13, 33, L(C.wine));
      for (let x = 15; x < 32; x += 3) c.set(x, b - 10, GILT);
      c.col(20, b - 15, b - 11, D(C.wine));
      c.col(27, b - 15, b - 11, D(C.wine));
      for (let i = 0; i < 6; i++) if (!u || i === 1 || i === 4) bottle(c, 14 + i * 3, b - 17, 5, i % 2 ? AMBER : GREEN, 2);
      c.oval(29 + 2, b - 21, 34, b - 17, BONE); // a skull to draw the crowd
      dots(c, K, [32, b - 19, 34, b - 19]);
      c.rect(6, 14, 7, 14, C.iron); // lantern on the pole
      c.rect(6, 15, 8, 18, u ? C.flameLight : C.glass);
      c.frame(6, 15, 8, 18, C.ironDark);
      c.set(7, 16, u ? C.flameLight : C.glassLight);
      if (u) {
        glow(c, 7, 13);
        dots(c, C.glow, [9, 16, 5, 19, 9, 19]);
        dots(c, GILT, [16, b - 17, 22, b - 17, 23, b - 17]); // takings on the cloth
        c.rect(10, b - 11, 12, b - 10, hex('#6a5a36')); // an empty crate
        c.row(b - 12, 10, 12, PINE);
      }
    },
    sw: 20, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.rect(9, 1, 10, b, OAK);
      c.col(9, 1, b, L(OAK));
      c.col(11, 2, u ? 16 : 12, CANVAS); // the banner, edge on
      if (u) c.col(12, 7, 16, D(CANVAS));
      board(c, 1, b - 9, 18, b - 8, PINE);
      c.rect(2, b - 7, 17, b - 6, D(PINE));
      for (const x of [3, 16]) c.col(x, b - 5, b, OAK);
      c.line(4, b - 5, 15, b, D(OAK));
      c.rect(5, b - 16, 14, b - 10, C.wine);
      c.row(b - 16, 4, 15, L(C.wine));
      for (let x = 6; x < 14; x += 3) c.set(x, b - 10, GILT);
      if (!u) bottle(c, 6, b - 17, 5, GREEN, 2);
      bottle(c, 12, b - 17, 5, AMBER, 2);
      c.oval(8, b - 21, 11, b - 17, BONE);
      c.set(10, b - 19, K);
      c.rect(6, 15, 8, 18, u ? C.flameLight : C.glass);
      c.frame(6, 15, 8, 18, C.ironDark);
      c.row(14, 7, 9, C.iron);
      if (u) {
        glow(c, 7, 13);
        dots(c, C.glow, [5, 17, 5, 19]);
      }
    },
    base: 'side',
  });

  /* ---------- the yard and the physic garden ---------- */
  add('apoth-shop-window-bay', 'apothecary shop bay window display carboys small panes chemist front glazing', {
    w: 30, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 1, 2, 28, 5, SHOPGREEN); // fascia
      dots(c, GILT, [5, 3, 6, 3, 7, 3, 9, 3, 10, 3, 12, 3, 13, 3, 14, 3, 16, 3, 17, 3, 19, 3, 20, 3, 22, 3, 23, 3]);
      c.row(1, 1, 28, L(SHOPGREEN));
      c.rect(2, 6, 27, b - 9, u ? hex('#4a4a3a') : hex('#27323a'));
      /* what stands in the window */
      carboy(c, 8, b - 10, 3, 11, RED);
      carboy(c, 21, b - 10, 3, 11, BLUE);
      carboy(c, 14, b - 10, 2, 8, GREEN);
      shelfRow(c, 4, 25, 15, 7, 4);
      c.row(16, 3, 26, MAH);
      if (u) {
        dots(c, C.glow, [8, b - 22, 21, b - 22, 14, b - 19, 7, b - 14, 22, b - 14]); // the gas is lit behind them
        dots(c, hex('#c05a4a'), [8, b - 13, 9, b - 14]);
        dots(c, hex('#6a8ab8'), [21, b - 13, 22, b - 14]);
        c.rect(12, 18, 16, 21, hex('#2a2428')); // and a face is at the glass
        c.rect(13, 22, 15, 22, hex('#2a2428'));
        dots(c, C.glow, [13, 19, 15, 19]);
      }
      for (const x of [2, 10, 19, 27]) c.col(x, 6, b - 9, SHOPGREEN);
      for (const y of [6, 17]) c.row(y, 2, 27, SHOPGREEN);
      c.col(2, 6, b - 9, L(SHOPGREEN));
      board(c, 1, b - 8, 28, b - 7, SHOPGREEN);
      face(c, 2, b - 6, 27, b, SHOPGREEN);
      panel(c, 4, b - 5, 13, b - 1, SHOPGREEN);
      panel(c, 16, b - 5, 25, b - 1, SHOPGREEN);
    },
    sw: 9, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      face(c, 1, 2, 7, 5, SHOPGREEN);
      c.row(1, 1, 7, L(SHOPGREEN));
      c.rect(2, 6, 6, b - 9, u ? hex('#4a4a3a') : hex('#27323a'));
      c.rect(3, b - 17, 5, b - 10, BLUE);
      c.col(3, b - 17, b - 10, L(BLUE));
      c.set(4, b - 19, C.glassLight);
      c.set(4, b - 18, BLUE);
      c.frame(2, 6, 6, b - 9, SHOPGREEN);
      c.row(17, 2, 6, SHOPGREEN);
      c.col(2, 6, b - 9, L(SHOPGREEN));
      board(c, 1, b - 8, 7, b - 7, SHOPGREEN);
      cabSide(c, 2, b - 6, 6, b, SHOPGREEN, false);
      if (u) dots(c, C.glow, [4, b - 21, 3, b - 14, 5, 12]);
    },
  });

  add('apoth-herb-garden-bed', 'apothecary physic garden herb bed raised planks labels sage rue wormwood plants', {
    w: 34, h: 14, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 5, 31, b - 4, EARTH);
      const r = rnd(7);
      for (let x = 3; x <= 30; x += 4) {
        const col = [SAGE, C.leaf, hex('#8a9a78'), C.moss, LAV][(x >> 2) % 5];
        if (u && x > 12 && x < 26) {
          c.rect(x, b - 5, x + 2, b - 5, mix(EARTH, 0.55)); // dug out
          continue;
        }
        const h = 3 + Math.floor(r() * 3);
        c.rect(x, b - 5 - h, x + 2, b - 5, col);
        c.col(x, b - 5 - h, b - 5, L(col));
        c.set(x + 1, b - 6 - h, col);
        if (col === LAV) c.set(x + 1, b - 6 - h, hex('#8a78a8'));
        c.set(x + 2, b - 6, D(col));
      }
      face(c, 1, b - 3, 32, b, OAK);
      planksV(c, 1, b - 3, 32, b, D(OAK), 8);
      for (const x of [6, 18, 27]) {
        c.rect(x, b - 5, x + 1, b - 4, C.paper); // labels
        c.col(x, b - 3, b - 2, PINE);
      }
      if (u) {
        heap(c, 13, 20, b - 4, 3, EARTH, 3);
        c.line(24, b - 4, 27, b - 12, PINE); // the spade left standing
        c.rect(23, b - 5, 25, b - 3, C.steel);
        dots(c, BONE, [16, b - 5, 17, b - 5]); // and something pale turned up
      }
    },
    sw: 14, sh: 14,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 5, 11, b - 4, EARTH);
      if (!u) {
        for (const [x, col, h] of [[3, SAGE, 4], [7, LAV, 5]]) {
          c.rect(x, b - 5 - h, x + 2, b - 5, col);
          c.col(x, b - 5 - h, b - 5, L(col));
          c.set(x + 1, b - 6 - h, col);
        }
      } else {
        heap(c, 3, 9, b - 4, 3, EARTH, 3);
        c.col(6, b - 12, b - 5, PINE);
        c.set(5, b - 5, BONE);
      }
      face(c, 1, b - 3, 12, b, OAK);
      c.col(6, b - 3, b, D(OAK));
      c.rect(9, b - 5, 10, b - 4, C.paper);
    },
  });

  add('apoth-mandrake-pot', 'apothecary mandrake in a pot root shaped like a man magic plant pulled screaming', {
    w: 12, h: 16,
    f(c, u) {
      const b = c.h - 2;
      pot(c, 2, 8, b - 6, b);
      c.row(b - 6, 3, 7, EARTH);
      if (!u) {
        for (const [x0, y0, x1, y1] of [[5, b - 7, 2, b - 11], [5, b - 7, 5, b - 13], [5, b - 7, 8, b - 11], [5, b - 7, 3, b - 9], [5, b - 7, 7, b - 9]]) c.line(x0, y0, x1, y1, C.leaf);
        dots(c, C.leafLight, [2, b - 11, 5, b - 13, 8, b - 11]);
        dots(c, LAV, [4, b - 8, 6, b - 8]);
      } else {
        c.row(b - 6, 4, 6, mix(EARTH, 0.5));
        const ROOT = hex('#a88a5c'); // the root lies beside its pot: arms, legs, a mouth
        c.rect(1, b - 1, 3, b, C.leaf);
        c.rect(4, b - 1 + 2 - 2, 4, b, ROOT);
        c.clearRect(0, b - 1, 10, b);
        pot(c, 2, 8, b - 6, b);
        c.rect(9, b - 11, 10, b - 5, ROOT);
        c.col(9, b - 11, b - 5, L(ROOT));
        dots(c, ROOT, [8, b - 9, 11, b - 9, 11, b - 10, 9, b - 4, 10, b - 4, 9, b - 3, 11, b - 3]);
        dots(c, K, [9, b - 10, 10, b - 10, 10, b - 8]);
        dots(c, C.leaf, [9, b - 12, 10, b - 13, 8, b - 13, 11, b - 12]);
        dots(c, EARTH, [7, b - 7, 10, b, 11, b]);
      }
    },
    u: [0, 0, 1],
  });

  add('apoth-foxglove-clump', 'apothecary foxgloves tall purple flowers digitalis poison plant clump garden', {
    w: 14, h: 28,
    f(c, u) {
      const b = c.h - 2;
      const FOX = hex('#8a5a80'),
        FOXL = hex('#a878a0');
      bush(c, 1, b - 6, 12, b, 4, C.leaf, C.leafLight);
      for (const [x, top] of [[3, b - 19], [7, b - 25], [10, b - 16]]) {
        if (u && x !== 10) {
          c.col(x, b - 9, b - 5, C.leafLight); // cut
          c.set(x, b - 10, hex('#b8c08a'));
          continue;
        }
        c.col(x, top, b - 5, C.leafLight);
        for (let y = top; y < b - 8; y += 2) {
          c.set(x + ((y >> 1) % 2 ? 1 : -1), y + 1, FOX);
          c.set(x, y, FOXL);
          c.set(x + ((y >> 1) % 2 ? -1 : 1), y + 2, D(FOX));
        }
        c.set(x, top - 1, C.leaf);
      }
      if (u) dots(c, FOX, [2, b, 5, b - 1, 8, b]);
    },
  });

  add('apoth-poppy-patch', 'apothecary opium poppies patch seed heads red flowers garden laudanum plants', {
    w: 22, h: 18,
    f(c, u) {
      const b = c.h - 2;
      const POPPY = hex('#8a9278'),
        PET = hex('#a8443a');
      const r = rnd(11);
      for (let x = 2; x <= 19; x += 2) {
        const h = 7 + Math.floor(r() * 7),
          fl = r() < 0.45;
        c.col(x, b - h, b, C.leafLight);
        if (r() < 0.6) c.set(x + 1, b - 2 - Math.floor(r() * 3), C.leaf);
        if (u && !fl) {
          c.set(x, b - h, hex('#b8c08a')); // the heads cut and taken
          continue;
        }
        if (fl) {
          c.rect(x - 1, b - h - 1, x + 1, b - h, PET);
          c.set(x, b - h, K);
          c.set(x - 1, b - h - 1, L(PET));
        } else {
          c.rect(x, b - h - 1, x + 1, b - h, POPPY);
          c.set(x, b - h - 2, D(POPPY));
          c.set(x + 1, b - h - 2, D(POPPY));
          c.set(x, b - h - 1, L(POPPY));
        }
      }
      c.row(b, 1, 20, C.leaf);
      if (u) dots(c, PET, [4, b, 9, b, 15, b - 1, 12, b]);
    },
  });

  add('apoth-nightshade-trellis', 'apothecary deadly nightshade belladonna on a trellis black berries poison climber', {
    w: 18, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [2, 8, 14]) c.col(x, 2, b, PINE);
      for (const y of [4, 12, 20]) c.row(y, 1, 15, D(PINE));
      c.col(2, 2, b, L(PINE));
      const r = rnd(5);
      for (let i = 0; i < 46; i++) {
        const x = 1 + Math.floor(r() * 15),
          y = 3 + Math.floor(r() * (b - 5)),
          v = r();
        c.set(x, y, v < 0.5 ? C.leaf : C.leafLight);
        c.set(x + 1, y, C.leaf);
        if (v > 0.8) c.set(x, y + 1, D(C.leaf));
      }
      c.line(5, b, 9, 14, hex('#4a3e2c'));
      c.line(9, 14, 6, 5, hex('#4a3e2c'));
      const BERRY = hex('#1f1a2a');
      for (const [x, y] of [[4, 8], [11, 6], [6, 15], [12, 13], [3, 19], [10, 22], [13, 24], [5, 25]]) {
        if (u && y < 20) {
          c.set(x, y, C.leafLight); // picked
          continue;
        }
        c.set(x, y, BERRY);
        c.set(x, y - 1, hex('#6a5a80'));
      }
      if (u) {
        c.rect(10, b - 3, 15, b, CHINA); // a bowl of them at the foot
        c.row(b - 3, 10, 15, BERRY);
        dots(c, hex('#6a5a80'), [11, b - 3, 14, b - 3]);
        c.clear(10, b);
        c.clear(15, b);
      }
    },
    sw: 6, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.col(2, 2, b, PINE);
      c.col(2, 2, b, L(PINE));
      for (const y of [4, 12, 20]) c.set(3, y, D(PINE));
      const r = rnd(9);
      for (let i = 0; i < 16; i++) c.set(2 + Math.floor(r() * 3), 3 + Math.floor(r() * (b - 5)), r() < 0.5 ? C.leaf : C.leafLight);
      c.set(3, 24, hex('#1f1a2a'));
      if (!u) c.set(3, 9, hex('#1f1a2a'));
      else {
        c.rect(4, b - 2, 6, b, CHINA);
        c.row(b - 3, 4, 6, hex('#1f1a2a'));
      }
    },
    su: [0, 0, 2],
  });

  add('apoth-beehive-skep-bench', 'apothecary bee skeps straw hives on a bench honey wax bees garden', {
    w: 24, h: 21, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 6, 22, b - 5, OAK);
      legs(c, [3, 19], b - 4, b, OAK);
      const skep = (x) => {
        c.oval(x, b - 16, x + 8, b - 3, STRAWC);
        c.clearRect(x, b - 6, x + 8, b - 3);
        board(c, 1, b - 6, 22, b - 5, OAK);
        for (let y = b - 15; y < b - 6; y += 2) for (let i = x; i <= x + 8; i++) if (c.get(i, y) && c.get(i, y) !== K && y > b - 16) c.set(i, y, D(STRAWC));
        c.set(x + 4, b - 17, D(STRAWC));
        c.rect(x + 4, b - 8, x + 4, b - 7, K);
      };
      skep(2);
      if (!u) skep(13);
      else {
        c.oval(13, b - 14, 22, b - 6, STRAWC); // knocked on its side: the comb shows
        c.oval(14, b - 13, 20, b - 7, hex('#3a2a1a'));
        dots(c, AMBER, [15, b - 11, 17, b - 12, 18, b - 9, 16, b - 9, 19, b - 11]);
        dots(c, hex('#d0a848'), [16, b - 11, 18, b - 10]);
        board(c, 1, b - 6, 22, b - 5, OAK);
        c.col(17, b - 4, b - 1, AMBER); // honey running off the bench
        dots(c, K, [9, b - 19, 12, b - 16, 22, b - 17, 19, b - 18, 15, b - 20, 11, b - 12, 23, b - 12]); // bees
        dots(c, TANSY, [10, b - 19, 20, b - 18, 16, b - 20]);
      }
    },
    sw: 12, sh: 21,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        c.oval(2, b - 16, 9, b - 3, STRAWC);
        c.clearRect(2, b - 6, 9, b - 3);
        for (let y = b - 15; y < b - 6; y += 2) for (let i = 2; i <= 9; i++) if (c.get(i, y)) c.set(i, y, D(STRAWC));
        c.set(5, b - 17, D(STRAWC));
      } else {
        c.rect(2, b - 14, 9, b - 7, STRAWC);
        c.row(b - 15, 3, 8, STRAWC);
        for (let x = 3; x < 9; x += 2) c.col(x, b - 14, b - 7, D(STRAWC));
        c.col(9, b - 13, b - 8, hex('#3a2a1a'));
        dots(c, K, [5, b - 18, 10, b - 16, 1, b - 17]);
        dots(c, TANSY, [6, b - 18, 11, b - 16]);
        c.col(10, b - 4, b - 1, AMBER);
      }
      board(c, 1, b - 6, 10, b - 5, OAK);
      legs(c, [2, 8], b - 4, b, OAK);
    },
    u: [0, 2, 1], su: [0, 2, 1],
  });

  add('apoth-cold-frame-seedlings', 'apothecary cold frame glass lid seedlings garden frame wooden box herbs nursery', {
    w: 26, h: 13, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 1, b - 5, 24, b, OAK);
      c.row(b - 2, 1, 24, D(OAK));
      if (!u) {
        c.rect(1, b - 9, 24, b - 6, hex('#4a5e58'));
        for (let x = 3; x < 24; x += 3) c.set(x, b - 7, C.leafLight);
        c.frame(1, b - 9, 24, b - 6, CHINA);
        c.col(9, b - 9, b - 6, CHINA);
        c.col(17, b - 9, b - 6, CHINA);
        dots(c, C.glassLight, [3, b - 8, 11, b - 8, 19, b - 8]);
      } else {
        c.rect(2, b - 6, 23, b - 6, EARTH); // the lights lifted off: bare earth, the seedlings pulled
        dots(c, C.leafLight, [4, b - 7, 20, b - 7]);
        dots(c, mix(EARTH, 0.55), [8, b - 6, 12, b - 6, 15, b - 6]);
        c.poly([[25, b - 9], [28, b - 9], [30, b], [27, b]], hex('#4a5e58')); // a light leaning on the end
        c.line(25, b - 9, 27, b, CHINA);
        c.line(28, b - 9, 30, b, CHINA);
        shards(c, 3, 12, b, C.glassLight, 8);
      }
    },
    sw: 14, sh: 13,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[1, b - 8], [12, b - 5], [12, b], [1, b]], OAK);
      c.col(1, b - 8, b, L(OAK));
      c.row(b - 2, 1, 12, D(OAK));
      if (!u) {
        c.line(1, b - 10, 12, b - 7, CHINA);
        c.line(1, b - 9, 12, b - 6, hex('#4a5e58'));
      } else {
        c.line(2, b - 9, 12, b - 6, EARTH);
        c.set(5, b - 9, C.leafLight);
        shards(c, 9, 13, b, C.glassLight, 8);
      }
    },
    u: [0, 0, 6], su: [0, 0, 2],
  });

  add('apoth-wheelbarrow-herbs', 'apothecary wheelbarrow wooden full of cut herbs garden barrow one wheel', {
    w: 30, h: 17, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[6, b - 10], [22, b - 10], [20, b - 4], [9, b - 4]], OAK);
      c.row(b - 10, 6, 22, L(OAK));
      c.line(6, b - 10, 9, b - 4, L(OAK));
      for (let x = 11; x < 20; x += 3) c.col(x, b - 9, b - 4, D(OAK));
      c.line(21, b - 7, 28, b - 9, PINE); // handles
      c.set(28, b - 10, D(PINE));
      c.col(19, b - 3, b, OAK); // the leg
      c.line(9, b - 4, 5, b - 3, OAK);
      cartWheel(c, 5, b - 3, 3, OAK);
      if (!u) {
        bush(c, 7, b - 14, 21, b - 10, 4, SAGE, hex('#98a878'));
        dots(c, LAV, [10, b - 14, 15, b - 15, 18, b - 13]);
        dots(c, TANSY, [12, b - 13, 20, b - 12]);
      } else {
        dots(c, SAGE, [9, b - 11, 14, b - 11, 19, b - 11, 23, b, 25, b]);
        c.line(12, b - 11, 16, b - 14, C.steel); // a sickle left in it
        c.set(17, b - 13, C.steel);
        c.set(11, b - 11, EB);
      }
    },
    sw: 16, sh: 17,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, b - 10], [13, b - 10], [11, b - 4], [4, b - 4]], OAK);
      c.row(b - 10, 2, 13, L(OAK));
      c.col(7, b - 9, b - 4, D(OAK));
      wheelEdge(c, 7, b - 6, b, OAK, 2);
      for (const x of [3, 12]) c.col(x, b - 3, b, D(OAK));
      if (!u) {
        bush(c, 3, b - 14, 12, b - 10, 4, SAGE, hex('#98a878'));
        dots(c, LAV, [5, b - 14, 10, b - 13]);
      } else {
        dots(c, SAGE, [4, b - 11, 9, b - 11]);
        c.line(6, b - 11, 8, b - 14, C.steel);
      }
    },
    base: 'side',
  });

  add('apoth-viper-box-wire', 'apothecary viper box wire front snake cage adder venom wooden crate', {
    w: 18, h: 13, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 1, b - 9, 16, b, OAK);
      c.rect(3, b - 7, 14, b - 2, hex('#2a2620'));
      if (!u) {
        const SN = hex('#6a6a3a');
        dots(c, SN, [4, b - 3, 5, b - 3, 6, b - 4, 7, b - 4, 8, b - 3, 9, b - 3, 10, b - 4, 11, b - 5, 12, b - 5, 12, b - 6]);
        dots(c, hex('#3a3a22'), [6, b - 3, 9, b - 4, 11, b - 4]);
        c.set(13, b - 6, C.blood);
        for (let x = 4; x < 14; x += 2) c.col(x, b - 7, b - 2, mix(C.steel, 0.7));
        c.set(15, b - 5, BR);
      } else {
        for (let x = 4; x < 9; x += 2) c.col(x, b - 7, b - 2, mix(C.steel, 0.7));
        c.line(9, b - 6, 12, b - 3, mix(C.steel, 0.7)); // the wire bent out
        c.set(13, b - 2, C.steel);
        const SN = hex('#6a6a3a');
        dots(c, SN, [15, b, 16, b, 17, b - 1, 18, b - 1, 19, b]); // and it is out
        c.set(20, b - 1, SN);
      }
      dots(c, C.paper, [7, b - 9, 8, b - 9, 9, b - 9]);
    },
    sw: 12, sh: 13,
    s(c, u) {
      const b = c.h - 2;
      face(c, 1, b - 9, 10, b, OAK);
      c.row(b - 5, 1, 10, D(OAK));
      c.col(5, b - 9, b, D(OAK));
      if (u) dots(c, hex('#6a6a3a'), [11, b, 12, b - 1, 13, b]);
    },
    u: [0, 0, 4], su: [0, 0, 3],
  });

  add('apoth-crow-cage-stand', 'apothecary crow in a cage on a stand raven bird familiar iron wicker cage', {
    w: 14, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.col(6, b - 14, b - 1, EB);
      c.col(7, b - 14, b - 1, D(EB));
      c.rect(3, b, 10, b, EB);
      c.rect(5, b - 1, 8, b - 1, EB);
      c.row(b - 15, 2, 11, C.iron);
      c.rect(2, b - 28, 11, b - 16, hex('#55505a'));
      c.row(b - 29, 4, 9, C.iron);
      c.row(b - 30, 6, 7, C.iron);
      c.set(6, b - 31, BR);
      if (!u) {
        c.oval(5, b - 24, 9, b - 19, hex('#15131a')); // the crow
        c.rect(4, b - 26, 6, b - 24, hex('#15131a'));
        c.set(3, b - 25, hex('#4a4a55'));
        c.set(5, b - 25, C.bone);
        c.row(b - 18, 4, 9, PINE);
      } else {
        c.row(b - 18, 4, 9, PINE);
        c.rect(5, b - 24, 8, b - 17, hex('#3a363e')); // the door open
        c.set(8, b - 2, hex('#15131a')); // a feather
        c.set(9, b - 1, hex('#15131a'));
        c.set(10, b - 1, hex('#4a4a55'));
      }
      for (let x = 2; x <= 11; x += 3) c.col(x, b - 28, b - 16, C.ironDark);
      if (u) {
        c.clearRect(5, b - 23, 5, b - 18);
        c.rect(5, b - 24, 8, b - 17, hex('#3a363e'));
        c.col(12, b - 24, b - 17, C.iron);
        c.col(13, b - 24, b - 17, C.ironDark);
      }
    },
    sw: 14, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.col(6, b - 14, b - 1, EB);
      c.col(7, b - 14, b - 1, D(EB));
      c.rect(3, b, 10, b, EB);
      c.rect(5, b - 1, 8, b - 1, EB);
      c.row(b - 15, 2, 11, C.iron);
      c.rect(2, b - 28, 11, b - 16, hex('#55505a'));
      c.row(b - 29, 4, 9, C.iron);
      c.row(b - 30, 6, 7, C.iron);
      c.set(6, b - 31, BR);
      c.row(b - 18, 4, 9, PINE);
      if (!u) {
        c.oval(4, b - 24, 8, b - 19, hex('#15131a')); // the crow, in profile
        c.rect(7, b - 26, 9, b - 24, hex('#15131a'));
        c.set(10, b - 25, hex('#4a4a55'));
        c.set(8, b - 25, C.bone);
        c.line(4, b - 21, 2, b - 19, hex('#15131a'));
      } else dots(c, hex('#15131a'), [9, b - 17, 4, b - 2, 5, b - 1]);
      for (let x = 2; x <= 11; x += 3) c.col(x, b - 28, b - 16, C.ironDark);
    },
    u: [0, 0, 1],
  });

  add('apoth-plague-doctor-stand', 'apothecary plague doctor costume on a stand beak mask hat waxed coat cane', {
    w: 15, h: 39, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const COAT = hex('#2a2826');
      c.rect(4, b, 10, b, EB);
      c.col(7, b - 5, b - 1, EB);
      c.rect(4, 1, 9, 3, COAT); // the hat
      c.row(4, 2, 11, COAT);
      c.row(1, 4, 9, L(COAT));
      c.rect(5, 5, 8, 9, BONE); // the mask
      c.col(5, 5, 9, L(BONE));
      dots(c, u ? C.flameLight : hex('#3a4a50'), [5, 6, 8, 6]);
      c.rect(6, 8, 7, 11, D(BONE)); // the beak, coming at you
      c.set(6, 12, D(BONE));
      c.row(11, 2, 11, COAT); // shoulders, the coat
      c.rect(3, 12, 10, b - 5, COAT);
      c.rect(2, 12, 2, 24, COAT);
      c.rect(11, 12, 11, 24, COAT);
      c.col(3, 12, b - 5, L(COAT));
      c.col(7, 13, b - 6, K);
      dots(c, C.steel, [6, 15, 6, 19, 6, 23]);
      dots(c, D(BONE), [6, 12]);
      c.rect(2, 25, 2, 27, hex('#5a4a36')); // gloves
      c.rect(11, 25, 11, 27, hex('#5a4a36'));
      c.col(13, 14, b, EB); // the cane
      c.set(13, 13, BR);
      if (u) {
        c.rect(4, b - 1, 6, b, K); // somebody is standing in it
        c.rect(8, b - 1, 10, b, K);
        c.rect(4, b - 4, 10, b - 2, COAT);
        c.rect(11, 20, 12, 22, hex('#5a4a36')); // and has the cane
        c.clearRect(11, 25, 11, 27);
        c.rect(11, 23, 11, 24, COAT);
      }
    },
    sw: 14, sh: 39,
    s(c, u) {
      const b = c.h - 2;
      const COAT = hex('#2a2826');
      c.rect(3, b, 8, b, EB);
      c.col(5, b - 5, b - 1, EB);
      c.rect(3, 1, 7, 3, COAT);
      c.row(4, 1, 9, COAT);
      c.row(1, 3, 7, L(COAT));
      c.rect(3, 5, 6, 9, BONE);
      c.set(6, 6, u ? C.flameLight : hex('#3a4a50'));
      c.poly([[7, 7], [12, 10], [7, 10]], D(BONE)); // the beak
      c.row(7, 7, 8, BONE);
      c.row(10, 3, 6, D(BONE));
      c.rect(2, 11, 8, b - 5, COAT);
      c.col(2, 11, b - 5, L(COAT));
      c.col(8, 12, b - 6, K);
      c.rect(5, 13, 6, 24, mix(COAT, 1.25));
      c.rect(5, 25, 6, 27, hex('#5a4a36'));
      if (!u) c.col(10, 14, b, EB);
      else {
        c.rect(3, b - 1, 7, b, K);
        c.rect(2, b - 4, 8, b - 2, COAT);
        c.clearRect(5, 25, 6, 27);
        c.rect(7, 20, 10, 21, mix(COAT, 1.25)); // the arm out, the cane held
        c.rect(10, 20, 11, 22, hex('#5a4a36'));
        c.col(11, 16, b, EB);
      }
      c.set(u ? 11 : 10, u ? 15 : 13, BR);
    },
  });

  add('apoth-quack-banner-stand', 'apothecary quack banner on poles painted cure all elixir advertisement canvas sign fair', {
    w: 22, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [2, 18]) {
        c.col(x, 1, b, OAK);
        c.col(x + 1, 1, b, D(OAK));
        c.rect(x - 1, b, x + 2, b, D(OAK));
      }
      if (!u) {
        c.rect(4, 3, 17, 24, CANVAS);
        c.row(3, 4, 17, L(CANVAS));
      } else {
        c.poly([[4, 3], [17, 3], [17, 10], [10, 16], [4, 24]], CANVAS); // slashed across
        c.poly([[17, 13], [17, 24], [10, 24], [8, 22]], D(CANVAS));
        c.row(3, 4, 17, L(CANVAS));
      }
      c.frame(5, 4, 16, 23, RED);
      for (let x = 7; x < 15; x += 2) c.set(x, 6, RED);
      for (let x = 7; x < 15; x += 3) c.set(x, 8, hex('#3a3440'));
      c.rect(9, 12, 12, 19, u ? D(AMBER) : AMBER); // the bottle
      c.rect(10, 10, 11, 11, u ? D(AMBER) : AMBER);
      c.row(9, 10, 11, CHINA);
      c.rect(9, 14, 12, 16, CHINA);
      c.set(10, 15, RED);
      dots(c, GILT, [7, 11, 14, 11, 6, 14, 15, 14, 7, 18, 14, 18]); // rays
      for (let x = 7; x < 15; x += 2) c.set(x, 21, hex('#3a3440'));
      if (u) {
        for (let i = 0; i < 9; i++) c.clear(16 - i, 11 + i);
        for (let i = 0; i < 8; i++) c.clear(16 - i, 12 + i);
        dots(c, C.blood, [6, 20, 7, 21, 6, 22]);
      }
      dots(c, C.straw, [4, 3, 17, 3, 4, 24, 17, 24]);
    },
    sw: 6, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      c.col(2, 1, b, OAK);
      c.col(3, 1, b, D(OAK));
      c.rect(1, b, 4, b, D(OAK));
      c.col(4, 3, 24, CANVAS);
      if (u) {
        c.clearRect(4, 12, 4, 15);
        c.col(4, 16, 24, D(CANVAS));
        c.set(5, 14, D(CANVAS));
      }
    },
  });
};
