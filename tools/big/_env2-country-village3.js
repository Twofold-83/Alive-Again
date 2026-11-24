/* Village, part 3: the gibbet and the bonfire, trades and their tools, the market's smaller wares, things by
 * the road. Part of tools/big/env2-country.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { P, D, L, dots, board, face, panel, post, legs, planksV, planksH, boards, boardsH, hollow, pane, flame, fire, wisp, bush, stones, bricks } = H;
  const { wheel, wheelEdge, barrel, sack, crate, thatch, hay, heap, blood, puddle, drip, shards, grass, crow, loaf, rope, chain, lantern, shape } = H;
  const add = H.reg('env-village', 'Village');
  const { OAK, GREYW, PALEW, TAR, THATCH, HAY, BRICK, LIME, STONE, SOIL, SOOT, TIN, ZINC, WAT, MILK, ROPE, CANVAS, SACK, LAMP } = P;
  const DK = hex('#4f3a2c'),
    BARK = hex('#4a3a30'),
    WICK = hex('#8a6a3a'),
    TILE = hex('#6a4a40'),
    ELM = hex('#6a543a'),
    CHEESE = hex('#b89a4a'),
    TURNIP = hex('#b0a68e'),
    JUICE = hex('#9a7a30'),
    WOOL = hex('#cfc8b4'),
    BOOT = hex('#3a2c24');
  const bucket = (c, x, y, w = 6, h = 6, water) => {
    c.rect(x, y, x + w - 1, y + h - 1, PALEW);
    c.col(x, y, y + h - 1, L(PALEW));
    c.col(x + w - 1, y, y + h - 1, D(PALEW));
    c.row(y + 1, x, x + w - 1, C.iron);
    c.row(y + h - 2, x, x + w - 1, C.iron);
    if (water) c.row(y, x + 1, x + w - 2, water);
  };

  /* ---------- on the hill ---------- */
  const gibbetCage = (c, x0, u) => {
    // an iron cage 11 wide, hanging from y = 11 to 33
    const x1 = x0 + 10,
      IR = hex('#3a3a44');
    if (!u) {
      c.rect(x0 + 4, 14, x0 + 6, 16, C.bone); // what is left of him
      c.set(x0 + 4, 15, SOOT);
      c.set(x0 + 6, 15, SOOT);
      c.rect(x0 + 3, 18, x0 + 7, 26, hex('#5a5048'));
      for (let y = 19; y < 24; y += 2) c.row(y, x0 + 4, x0 + 6, C.bone);
      c.rect(x0 + 4, 27, x0 + 4, 31, C.bone);
      c.rect(x0 + 6, 27, x0 + 6, 30, C.bone);
      c.set(x0 + 2, 22, hex('#5a5048'));
      c.set(x0 + 8, 24, hex('#5a5048'));
    }
    for (const x of [x0, x0 + 3, x0 + 7, x1]) c.col(x, 13, 31, x === x0 ? C.iron : IR);
    if (!u) c.col(x0 + 5, 11, 13, IR);
    for (const y of [12, 18, 25, 32]) {
      c.row(y, x0 + (y === 12 || y === 32 ? 1 : 0), x1 - (y === 12 || y === 32 ? 1 : 0), IR);
      c.set(x0 + 1, y, C.iron);
    }
    c.row(11, x0 + 3, x0 + 7, IR);
    dots(c, C.rust, [x0, 20, x0 + 7, 15, x0 + 3, 28, x1, 27]);
    if (u) {
      c.line(x1, 18, x1 + 3, 21, IR); // the front hangs open
      c.line(x1 + 3, 21, x1 + 3, 31, IR);
      c.line(x1, 32, x1 + 3, 31, IR);
      c.set(x1 + 2, 26, C.rust);
      c.set(x0 + 5, 31, hex('#5a5048'));
      c.set(x0 + 4, 31, hex('#5a5048'));
    }
  };
  add('village-gibbet-cage', 'gibbet iron cage on a post hanging in chains gallows hill crow bones', {
    w: 26, h: 56, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 4, 3, b, BARK, 3);
      c.line(2, b, 4, b - 6, BARK);
      c.line(8, b, 6, b - 6, D(BARK));
      board(c, 3, 4, 21, 5, BARK);
      c.line(7, 13, 13, 6, D(BARK));
      chain(c, 17, 6, 17, 10);
      gibbetCage(c, 12, u);
      if (!u) crow(c, 7, 3, true);
      else {
        dots(c, hex('#5a5048'), [14, b, 15, b, 17, b - 1, 20, b]);
        c.set(18, b, C.bone);
      }
      grass(c, [1, 10, 22], b);
    },
    sw: 15, sh: 56,
    s(c, u) {
      const b = c.h - 2;
      post(c, 5, 3, b, BARK, 4);
      c.line(3, b, 5, b - 5, BARK);
      c.line(10, b, 8, b - 5, D(BARK));
      c.rect(5, 4, 8, 5, L(BARK));
      chain(c, 6, 6, 6, 10);
      gibbetCage(c, 1, u);
      if (u) dots(c, hex('#5a5048'), [3, b, 9, b]);
      grass(c, [2, 11], b);
    },
  });

  const bonfire = (c, u, wide) => {
    const b = c.h - 2,
      r = rnd(wide ? 4 : 9);
    c.poly([[2, b], [13, 18], [20, 18], [31, b]], hex('#3a2e26'));
    for (let i = 0; i < 26; i++) {
      const x = 4 + Math.floor(r() * 26),
        up = 6 + Math.floor(r() * 16),
        col = [OAK, GREYW, BARK, PALEW][Math.floor(r() * 4)],
        tx = 16 + (x - 16) * 0.25;
      c.line(x, b, x + (tx - x) * (up / 24), b - up, col);
    }
    c.col(16, 4, 18, OAK);
    c.col(17, 4, 18, D(OAK));
    const st = u ? hex('#2a2422') : THATCH;
    c.rect(14, 8, 19, 16, st); // the guy
    if (wide) {
      c.row(9, 9, 24, st);
      c.row(10, 10, 23, u ? SOOT : D(THATCH));
      dots(c, u ? C.flame : L(THATCH), [8, 8, 8, 10, 25, 8, 25, 10]);
    }
    c.rect(14, 3, 19, 7, u ? hex('#3a302a') : SACK);
    c.row(3, 15, 18, u ? hex('#3a302a') : L(SACK));
    if (wide) {
      dots(c, SOOT, [15, 5, 18, 5]);
      c.row(7, 15, 18, hex('#5a2c2c'));
    }
    c.rect(13, 2, 20, 2, hex('#2c2a30')); // an old hat
    c.rect(15, 0 + 1, 18, 1, hex('#2c2a30'));
    if (!u) {
      for (let y = 10; y < 16; y += 2) c.row(y, 14, 19, D(THATCH));
      c.row(12, 13, 20, ROPE);
    } else {
      fire(c, 4, 29, b, 22, wide ? 3 : 5);
      fire(c, 11, 22, 17, 9, 7);
      dots(c, C.flameLight, [9, 14, 24, 12, 6, 20, 27, 22, 16, -1, 12, 4]);
      dots(c, C.flame, [22, 6, 10, 9, 27, 16]);
      wisp(c, 17, 0, 4, hex('#5a5258'));
      wisp(c, 13, -1, 3, hex('#5a5258'));
      c.rect(14, 3, 19, 6, hex('#3a302a'));
      if (wide) dots(c, C.flameLight, [15, 5, 18, 5]);
    }
  };
  add('village-bonfire-guy', 'bonfire stack of wood with a straw guy effigy on a pole village festival burning', {
    w: 34, h: 46, solid: true,
    f: (c, u) => bonfire(c, u, true),
    u: [0, 4, 0],
    sw: 34, sh: 46,
    s: (c, u) => bonfire(c, u, false),
    su: [0, 4, 0],
  });

  /* ---------- trades ---------- */
  add('village-cider-press', 'cider press apple press wooden screw tub juice bucket orchard', {
    w: 28, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2,
        pl = u ? 23 : 18;
      post(c, 2, 2, b, OAK, 3);
      post(c, 23, 2, b, OAK, 3);
      c.rect(1, 3, 26, 6, OAK);
      c.row(3, 1, 26, L(OAK));
      c.row(6, 1, 26, D(OAK));
      c.rect(13, 7, 14, pl - 1, C.iron); // the screw
      for (let y = 8; y < pl - 1; y += 2) c.set(13, y, C.steel);
      board(c, 7, u ? 12 : 9, 20, u ? 12 : 9, PALEW); // the bar
      c.rect(6, 20, 21, 28, hex('#2e2620'));
      for (let x = 6; x <= 21; x += 3) {
        c.rect(x, 20, x + 1, 28, PALEW);
        c.col(x, 20, 28, L(PALEW));
      }
      c.row(22, 6, 21, C.iron);
      c.row(27, 6, 21, C.iron);
      board(c, 7, pl, 20, pl + 1, OAK);
      board(c, 2, 29, 25, 30, OAK);
      c.rect(13, 31, 14, 31, OAK);
      bucket(c, 11, b - 4, 6, 5, u ? JUICE : null);
      if (!u) {
        dots(c, hex('#8a3a2c'), [8, 19, 10, 19, 12, 19, 16, 19, 18, 19, 9, 18, 17, 18, 19, 19]); // apples heaped in
        dots(c, hex('#6f7a48'), [11, 19, 15, 18]);
      } else {
        drip(c, 13, 32, b - 5, JUICE);
        c.col(14, 31, b - 5, JUICE);
        dots(c, JUICE, [8, 26, 11, 28, 17, 25, 20, 28, 9, 29, 18, 29]);
        dots(c, hex('#8a6a3a'), [8, 24, 14, 26, 17, 27]);
        dots(c, SOOT, [5, 15, 21, 13, 10, 16]); // wasps
        dots(c, C.mustard, [6, 15, 22, 13, 11, 16]);
      }
    },
    sw: 16, sh: 38,
    s(c, u) {
      const b = c.h - 2,
        pl = u ? 23 : 18;
      post(c, 6, 2, b, OAK, 4);
      c.rect(5, 3, 10, 6, OAK);
      c.row(3, 5, 10, L(OAK));
      c.rect(2, 20, 13, 28, hex('#2e2620'));
      for (let x = 2; x <= 13; x += 3) {
        c.rect(x, 20, x + 1, 28, PALEW);
        c.col(x, 20, 28, L(PALEW));
      }
      c.row(22, 2, 13, C.iron);
      c.row(27, 2, 13, C.iron);
      board(c, 3, pl, 12, pl + 1, OAK);
      board(c, 1, 29, 14, 30, OAK);
      c.rect(1, u ? 12 : 9, 4, u ? 12 : 9, PALEW);
      c.rect(11, u ? 12 : 9, 14, u ? 12 : 9, PALEW);
      c.set(1, 31, OAK);
      bucket(c, 0 + 1, b - 4, 5, 5, u ? JUICE : null);
      if (u) {
        c.col(1, 32, b - 5, JUICE);
        dots(c, JUICE, [3, 26, 9, 28, 12, 25]);
      } else dots(c, hex('#8a3a2c'), [4, 19, 7, 19, 10, 19, 6, 18]);
    },
  });

  add('village-spinning-wheel', 'spinning wheel wool distaff spindle treadle cottage industry', {
    w: 28, h: 28, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.line(3, 21, 24, 17, OAK); // the sloping bench
      c.line(3, 22, 24, 18, D(OAK));
      c.line(5, 22, 3, b, OAK);
      c.line(22, 19, 24, b, OAK);
      c.line(19, 19, 18, b, D(OAK));
      c.col(17, 12, 17, OAK);
      c.col(18, 12, 17, D(OAK));
      wheel(c, 17, 10, 8, PALEW, C.iron, OAK);
      c.col(6, 14, 20, OAK); // the flyer
      c.col(9, 14, 20, OAK);
      c.row(15, 4, 10, C.iron);
      c.rect(6, 14, 8, 16, u ? WOOL : hex('#8a8474'));
      c.line(9, 14, 13, 4, hex('#a8a08c')); // the band
      c.col(3, 3, 20, D(OAK)); // the distaff
      c.line(11, b - 1, 20, b - 2, D(OAK));
      if (!u) {
        c.oval(1, 2, 5, 8, WOOL);
        c.set(2, 3, L(WOOL));
        c.set(4, 7, D(WOOL));
        c.line(4, 8, 6, 13, WOOL);
      } else {
        c.set(3, 3, WOOL);
        c.set(4, 15, C.blood); // pricked
        blood(c, [4, 17, 4, 20, 5, b, 3, b]);
        c.line(2, 9, 1, 14, WOOL); // the thread broken
        c.set(1, 15, WOOL);
      }
    },
    sw: 12, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.rect(5, 2, 6, 18, PALEW); // the wheel, edge on
      c.col(5, 2, 18, OAK);
      c.set(5, 10, C.iron);
      c.rect(2, 17, 9, 18, OAK);
      c.col(2, 19, b, OAK);
      c.col(9, 19, b, D(OAK));
      c.rect(3, 14, 4, 16, u ? WOOL : hex('#8a8474'));
      c.col(8, 3, 18, D(OAK));
      if (!u) {
        c.oval(6, 2, 10, 8, WOOL);
        c.set(7, 3, L(WOOL));
      } else {
        c.set(8, 3, WOOL);
        c.line(9, 9, 10, 14, WOOL);
        blood(c, [4, 20, 5, b]);
      }
      c.row(b - 1, 4, 7, D(OAK));
    },
  });

  add('village-grindstone-treadle', 'grindstone sharpening wheel treadle whetstone trough knife grinder', {
    w: 24, h: 22, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.line(6, 11, 3, b, OAK);
      c.line(7, 11, 4, b, D(OAK));
      c.line(16, 11, 19, b, OAK);
      c.line(17, 11, 20, b, D(OAK));
      c.rect(4, 13, 19, 16, GREYW);
      c.row(13, 4, 19, L(GREYW));
      c.oval(5, 2, 17, 14, STONE);
      c.oval(6, 3, 16, 13, L(STONE));
      c.oval(7, 4, 16, 13, STONE);
      c.speckle(6, 3, 16, 13, D(STONE), 7, 3);
      c.rect(10, 7, 12, 9, C.iron);
      c.set(11, 8, C.steel);
      c.row(8, 13, 20, C.iron); // the crank
      c.col(20, 8, 11, C.iron);
      c.line(8, b - 1, 20, b - 2, D(OAK));
      c.col(14, 14, b - 2, C.iron);
      if (u) {
        c.line(1, 1, 7, 4, C.steel); // a blade held to it
        c.line(0, 1, 1, 1, OAK);
        dots(c, C.flameLight, [8, 2, 10, 1, 9, 0, 12, 1, 6, 0]);
        dots(c, C.flame, [11, 0, 13, 2, 7, 1]);
        dots(c, WAT, [8, 15, 12, 14]);
      } else dots(c, hex('#3c5560'), [8, 14, 12, 14]);
    },
    u: [0, 1, 0],
    sw: 12, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      c.col(2, 11, b, OAK);
      c.col(9, 11, b, D(OAK));
      c.rect(2, 13, 9, 16, GREYW);
      c.row(13, 2, 9, L(GREYW));
      c.rect(5, 2, 7, 13, STONE);
      c.col(5, 2, 13, L(STONE));
      c.col(7, 3, 13, D(STONE));
      c.row(8, 2, 10, C.iron);
      c.col(10, 8, 11, C.iron);
      c.row(b - 1, 3, 8, D(OAK));
      if (u) {
        c.line(1, 3, 5, 1, C.steel);
        dots(c, C.flameLight, [6, 0, 8, 1, 4, 0]);
        dots(c, C.flame, [7, 0, 9, 2]);
      }
    },
    su: [0, 1, 0],
  });

  const logEnd = (c, x, y, col = OAK) => {
    c.rect(x, y, x + 3, y + 3, col);
    c.set(x, y, null);
    c.set(x + 3, y, null);
    c.set(x, y + 3, null);
    c.set(x + 3, y + 3, null);
    c.rect(x + 1, y + 1, x + 2, y + 2, PALEW);
    c.set(x + 2, y + 2, D(PALEW));
  };
  add('village-woodpile-chopping-block', 'woodpile and chopping block logs firewood axe stump village yard', {
    w: 36, h: 22, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (let j = 0; j < 4; j++) for (let i = 0; i < 5 - (j > 2 ? 1 : 0); i++) logEnd(c, 1 + i * 4 + (j % 2) * 2, b - 3 - j * 4 + (j ? j : 0) - (j ? j : 0), (i + j) % 3 ? OAK : BARK);
      c.rect(24, b - 7, 33, b, BARK); // the block
      c.rect(24, b - 8, 33, b - 8, PALEW);
      c.row(b - 7, 24, 33, D(PALEW));
      for (const x of [26, 29, 31]) c.col(x, b - 6, b, D(BARK));
      c.col(24, b - 7, b, L(BARK));
      if (!u) {
        c.line(28, b - 9, 33, 3, OAK); // the axe
        c.line(29, b - 9, 34, 3, D(OAK));
        c.rect(26, b - 11, 29, b - 9, C.iron);
        c.row(b - 11, 26, 29, C.steel);
      } else {
        c.rect(27, b - 8, 30, b - 8, C.blood); // the axe is gone and the block is wet
        drip(c, 28, b - 7, b - 2, C.blood);
        drip(c, 30, b - 7, b - 4, C.blood);
        c.row(b, 26, 34, C.blood);
        c.rect(20, b - 1, 23, b, PALEW); // a log split and left
        c.set(20, b - 1, null);
        dots(c, PALEW, [19, b, 22, b - 2]);
      }
    },
    sw: 18, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      for (let j = 0; j < 4; j++) {
        c.rect(2 + (j > 2 ? 2 : 0), b - 3 - j * 4, 15 - (j % 2), b - j * 4, j % 2 ? BARK : OAK);
        c.row(b - 3 - j * 4, 2 + (j > 2 ? 2 : 0), 15 - (j % 2), L(OAK));
        c.row(b - j * 4, 2 + (j > 2 ? 2 : 0), 15 - (j % 2), D(BARK));
        c.set(2 + (j > 2 ? 2 : 0), b - 2 - j * 4, PALEW);
      }
      c.rect(4, b - 7, 12, b, BARK);
      c.rect(4, b - 8, 12, b - 8, PALEW);
      c.col(4, b - 7, b, L(BARK));
      c.col(8, b - 6, b, D(BARK));
      if (!u) {
        c.col(8, 3, b - 9, OAK);
        c.rect(6, b - 11, 10, b - 9, C.iron);
        c.row(b - 11, 6, 10, C.steel);
      } else {
        c.rect(6, b - 8, 9, b - 8, C.blood);
        drip(c, 7, b - 7, b - 2, C.blood);
        c.row(b, 5, 13, C.blood);
      }
    },
  });

  add('village-coffin-trestles', 'coffin on trestles plain elm coffin lid wake funeral village', {
    w: 40, h: 20, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (const x of [9, 29]) {
        c.line(x, 12, x - 2, b, OAK);
        c.line(x + 1, 12, x + 3, b, D(OAK));
        c.row(14, x - 1, x + 2, D(OAK));
      }
      c.rect(3, 11, 36, 11, OAK);
      c.poly([[2, 6], [36, 6], [37, 8], [37, 10], [2, 10]], ELM);
      c.row(6, 2, 36, L(ELM));
      c.row(10, 2, 37, D(ELM));
      for (const x of [9, 19, 29]) c.rect(x, 8, x + 2, 8, C.brass);
      if (!u) {
        c.rect(2, 4, 36, 5, ELM);
        c.row(4, 2, 36, L(ELM));
        c.row(5, 2, 36, D(ELM));
        c.rect(15, 3, 22, 3, C.brass); // the plate
        dots(c, C.iron, [4, 5, 12, 5, 26, 5, 34, 5]);
      } else {
        c.row(5, 3, 35, SOOT); // open and empty
        c.rect(8, 4, 20, 5, C.white);
        c.rect(10, 6, 13, 8, C.white);
        c.set(11, 9, D(C.white));
        c.line(37, b, 33, 0, ELM); // the lid stood against it
        c.line(38, b, 34, 0, L(ELM));
        c.line(39, b, 35, 0, D(ELM));
        dots(c, C.iron, [2, b, 5, b, 14, b, 22, b - 0]); // the nails drawn
      }
    },
    u: [0, 1, 2],
    sw: 16, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      c.line(5, 12, 3, b, OAK);
      c.line(10, 12, 12, b, D(OAK));
      c.row(14, 4, 11, D(OAK));
      c.rect(3, 11, 12, 11, OAK);
      c.poly([[4, 6], [11, 6], [13, 8], [12, 10], [3, 10], [2, 8]], ELM);
      c.row(6, 4, 11, L(ELM));
      c.row(10, 3, 12, D(ELM));
      if (!u) {
        c.rect(4, 4, 11, 5, ELM);
        c.row(4, 4, 11, L(ELM));
        c.row(5, 4, 11, D(ELM));
      } else {
        c.row(5, 4, 11, SOOT);
        c.rect(6, 4, 9, 5, C.white);
        c.rect(13, 2, 14, b, ELM);
        c.col(13, 2, b, L(ELM));
        dots(c, C.iron, [2, b, 7, b]);
      }
    },
  });

  add('village-cobblers-bench', 'cobblers bench shoemaker last boots tools hammer village trade', {
    w: 28, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2;
      legs(c, [3, 23], 13, b, OAK);
      c.row(16, 5, 22, D(OAK));
      board(c, 1, 11, 26, 12, OAK);
      c.rect(14, 7, 25, 10, DK); // the tool tray
      c.row(7, 14, 25, L(DK));
      c.col(19, 8, 10, D(DK));
      dots(c, C.steel, [15, 6, 16, 5, 21, 6, 23, 6, 23, 5]);
      dots(c, PALEW, [15, 7, 21, 7]);
      c.col(8, 8, 10, C.iron); // the last
      c.rect(6, 7, 10, 7, C.iron);
      for (const x of [7, 11, 17]) {
        c.rect(x, 14, x + 1, 17, BOOT); // pairs hung under the bench
        c.set(x + 2, 17, BOOT);
      }
      if (!u) {
        c.rect(6, 2, 9, 6, BOOT); // a boot on the last
        c.rect(10, 5, 11, 6, BOOT);
        c.col(6, 2, 6, L(BOOT));
        c.row(7, 6, 11, hex('#6a543a'));
      } else {
        c.rect(3, 9, 6, 10, hex('#7a3a2c')); // only a child's shoe, never fetched
        c.rect(3, 8, 4, 8, hex('#7a3a2c'));
        c.line(21, b, 25, b - 2, OAK); // the hammer dropped
        c.rect(19, b - 1, 20, b, C.iron);
        dots(c, C.iron, [12, b, 14, b, 9, b]);
      }
    },
    sw: 12, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [2, 8], 13, b, OAK);
      board(c, 1, 11, 10, 12, OAK);
      c.rect(2, 7, 9, 10, DK);
      c.row(7, 2, 9, L(DK));
      dots(c, C.steel, [3, 6, 4, 5, 8, 6]);
      c.rect(5, 14, 6, 17, BOOT);
      if (!u) {
        c.rect(4, 2, 7, 6, BOOT);
        c.col(4, 2, 6, L(BOOT));
      } else {
        c.rect(5, 5, 6, 6, C.iron);
        c.rect(3, b - 1, 4, b, C.iron);
        c.line(5, b, 9, b - 1, OAK);
      }
    },
  });

  add('village-weavers-loom', 'weavers loom hand loom warp cloth shuttle treadles cottage weaving', {
    w: 34, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2,
        r = rnd(5);
      post(c, 2, 2, b, OAK);
      post(c, 30, 2, b, OAK);
      board(c, 1, 2, 32, 3, OAK);
      for (let x = 5; x <= 28; x++) {
        if (x % 2) continue;
        if (!u) c.col(x, 5, 20, WOOL);
        else {
          const cut = 8 + Math.floor(r() * 8);
          c.col(x, 5, cut, WOOL); // the warp slashed through
          if (r() < 0.4) c.col(x, cut + 5, 20, D(WOOL));
        }
      }
      c.row(4, 4, 29, PALEW);
      board(c, 3, 12, 30, 12, OAK); // heddles
      if (!u) {
        board(c, 3, 17, 30, 18, PALEW); // the beater
        c.rect(5, 19, 28, 24, hex('#5a3a44'));
        for (let y = 20; y < 24; y += 2) c.row(y, 5, 28, hex('#77736a'));
        c.rect(12, 16, 17, 16, DK); // shuttle
      } else {
        c.line(3, 17, 30, 20, PALEW);
        c.rect(5, 21, 28, 24, hex('#5a3a44'));
        c.row(22, 5, 28, hex('#77736a'));
        c.line(13, 21, 19, 24, SOOT); // and the cloth too
        c.line(14, 21, 20, 24, SOOT);
        c.rect(22, b - 1, 27, b - 1, DK);
        dots(c, WOOL, [7, b, 12, b - 1, 18, b, 21, b]);
      }
      board(c, 3, 25, 30, 26, PALEW);
      board(c, 8, 30, 25, 31, OAK); // the weaver's seat
      c.col(9, 32, b, D(OAK));
      c.col(24, 32, b, D(OAK));
      c.line(13, b, 15, 33, D(OAK));
      c.line(19, b, 18, 33, D(OAK));
      c.row(b, 4, 6, OAK);
      c.row(b, 27, 29, OAK);
    },
    sw: 22, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      post(c, 4, 2, b, OAK);
      post(c, 18, 2, b, OAK);
      board(c, 3, 2, 20, 3, OAK);
      c.row(14, 4, 19, D(OAK));
      c.row(27, 4, 19, OAK);
      c.rect(17, 5, 19, 7, PALEW); // the warp beam at the back
      c.rect(4, 24, 6, 26, hex('#5a3a44')); // the cloth beam in front
      if (!u) {
        c.line(18, 6, 5, 24, WOOL);
        c.line(18, 7, 6, 24, D(WOOL));
        c.col(9, 12, 19, PALEW);
      } else {
        c.line(18, 6, 14, 12, WOOL);
        c.line(8, 20, 5, 24, D(WOOL));
        c.col(15, 12, 17, WOOL);
        c.line(9, 12, 11, 19, PALEW);
        dots(c, WOOL, [10, b, 14, b]);
      }
      c.col(11, 4, 12, D(OAK));
      board(c, 0 + 1, 30, 5, 31, OAK);
      c.col(2, 32, b, D(OAK));
      c.line(7, b, 14, 34, D(OAK));
    },
  });

  /* ---------- the market's smaller wares ---------- */
  add('village-market-scales', 'market scales balance on a table brass pans weights weighing village', {
    w: 26, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2,
        t = u ? 3 : 0;
      legs(c, [3, 21], 19, b, OAK);
      c.rect(4, 19, 21, 20, D(OAK));
      board(c, 1, 17, 24, 18, OAK);
      c.rect(10, 16, 15, 16, C.brass);
      c.rect(12, 5, 13, 15, C.brass);
      c.col(12, 5, 15, L(C.brass));
      c.set(12, 3, C.brass);
      c.set(13, 4, C.brass);
      c.line(4, 6 + t, 21, 6 - t, C.brass); // the beam
      for (const [x, d] of [[4, t], [21, -t]]) {
        c.line(x, 7 + d, x - 2, 12 + d, C.iron);
        c.line(x, 7 + d, x + 2, 12 + d, C.iron);
        c.row(13 + d, x - 3, x + 3, C.brass);
        c.row(14 + d, x - 2, x + 2, D(C.brass));
      }
      if (!u) {
        dots(c, C.ironDark, [16, 16, 17, 16, 17, 15, 19, 16, 21, 16]); // the weights
        sack(c, 4, 11, 8, 16, hex('#b0a890'));
      } else {
        c.rect(3, 13, 5, 15, hex('#6a2028')); // something heavy and wet in the low pan
        c.set(4, 12, hex('#8a3038'));
        c.set(6, 14, hex('#6a2028'));
        blood(c, [3, 18, 4, 19, 4, 21, 2, 17]);
        dots(c, C.ironDark, [20, 9, 21, 9, 22, 9, 21, 8]);
        dots(c, C.ironDark, [16, 16, 18, b]);
      }
    },
    sw: 14, sh: 30,
    s(c, u) {
      const b = c.h - 2,
        t = u ? 3 : 0;
      legs(c, [2, 10], 19, b, OAK);
      board(c, 1, 17, 12, 18, OAK);
      c.rect(5, 16, 8, 16, C.brass);
      c.rect(6, 5, 7, 15, C.brass);
      c.col(6, 5, 15, L(C.brass));
      c.set(6, 3, C.brass);
      c.set(7, 4, C.brass);
      c.rect(5, 5 + t, 8, 7 + t, C.brass);
      c.col(6, 8 + t, 12 + t, C.iron);
      c.row(13 + t, 3, 10, C.brass);
      c.row(14 + t, 4, 9, D(C.brass));
      if (u) {
        c.rect(5, 14, 8, 15, hex('#6a2028'));
        c.set(6, 13, hex('#8a3038'));
        blood(c, [4, 18, 5, 20]);
      } else dots(c, C.ironDark, [10, 16, 11, 16]);
    },
  });

  add('village-cheese-table', 'cheese table market trestle cloth cheeses wheels wedge knife dairy', {
    w: 30, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.line(6, 16, 4, b, OAK);
      c.line(7, 16, 9, b, D(OAK));
      c.line(22, 16, 20, b, OAK);
      c.line(23, 16, 25, b, D(OAK));
      c.rect(1, 10, 28, 15, hex('#a8a290'));
      c.row(10, 1, 28, C.white);
      for (let x = 3; x < 28; x += 4) c.col(x, 11, 15, hex('#8f8a78'));
      for (let x = 1; x <= 28; x += 2) c.set(x, 16, hex('#8f8a78'));
      const wheelC = (x0, x1, y0, col = CHEESE) => {
        c.rect(x0, y0, x1, 9, col);
        c.row(y0, x0 + 1, x1 - 1, L(col));
        c.set(x0, y0, null);
        c.set(x1, y0, null);
        c.col(x1, y0 + 1, 9, D(col));
      };
      wheelC(3, 11, 6);
      wheelC(4, 10, 3, hex('#a88a3a'));
      wheelC(20, 26, 6, hex('#c8b070'));
      if (!u) {
        wheelC(13, 18, 7, hex('#a8563a'));
        c.line(19, 9, 16, 9, C.steel);
      } else {
        c.rect(8, 6, 11, 9, hex('#d8c888')); // cut into, and blue with mould
        c.line(8, 6, 11, 9, CHEESE);
        dots(c, hex('#5a7a6a'), [5, 4, 7, 5, 9, 4, 4, 7, 6, 8, 21, 7, 23, 8, 25, 7, 22, 6]);
        c.col(15, 5, 9, C.steel); // the knife upright in the board
        c.rect(15, 3, 15, 4, OAK);
        c.rect(12, 9, 13, 9, hex('#5a5258')); // a mouse
        c.set(14, 9, hex('#8a6a6a'));
        dots(c, CHEESE, [17, 9, 18, 9, 12, b]);
      }
    },
    sw: 16, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      c.line(4, 16, 3, b, OAK);
      c.line(11, 16, 12, b, D(OAK));
      c.rect(1, 10, 14, 15, hex('#a8a290'));
      c.row(10, 1, 14, C.white);
      for (let x = 3; x < 14; x += 4) c.col(x, 11, 15, hex('#8f8a78'));
      for (let x = 1; x <= 14; x += 2) c.set(x, 16, hex('#8f8a78'));
      c.rect(3, 6, 11, 9, CHEESE);
      c.row(6, 4, 10, L(CHEESE));
      c.rect(4, 3, 10, 5, hex('#a88a3a'));
      c.row(3, 5, 9, L(hex('#a88a3a')));
      if (u) {
        c.rect(3, 6, 6, 9, hex('#d8c888'));
        dots(c, hex('#5a7a6a'), [5, 4, 8, 5, 9, 7, 10, 8]);
        c.col(12, 5, 9, C.steel);
        c.set(12, 4, OAK);
      }
    },
  });

  const eggs = (c, x0, x1, y) => {
    for (let x = x0; x <= x1; x += 2) {
      c.set(x, y, C.bone);
      c.set(x + 1, y, D(C.bone));
      c.set(x + (x % 4 ? 0 : 1), y - 1, C.white);
    }
  };
  const wicker = (c, x0, y0, x1, y1) => {
    c.rect(x0, y0, x1, y1, WICK);
    c.row(y0, x0, x1, L(WICK));
    for (let y = y0 + 1; y <= y1; y++) for (let x = x0 + ((y + x0) % 2); x <= x1; x += 2) c.set(x, y, D(WICK));
    c.set(x0, y1, null);
    c.set(x1, y1, null);
  };
  add('village-egg-baskets', 'egg baskets wicker baskets of eggs market hen eggs straw', {
    w: 24, h: 14, solid: false,
    f(c, u) {
      const b = c.h - 2;
      wicker(c, 13, 7, 21, b);
      c.row(6, 14, 20, HAY);
      eggs(c, 14, 19, 5);
      if (!u) {
        wicker(c, 1, 6, 10, b);
        eggs(c, 2, 8, 5);
        for (const x of [2, 9]) c.col(x, 2, 5, WICK); // the handle
        c.row(1, 3, 8, WICK);
      } else {
        wicker(c, 1, 7, 7, b); // one on its side
        c.col(8, 7, b, mix(WICK, 0.45));
        c.set(8, 7, null);
        dots(c, C.white, [9, b, 11, b - 1, 12, b, 10, b - 2, 3, 5]);
        dots(c, C.mustard, [10, b, 11, b, 9, b - 1]);
        c.set(12, b - 1, C.bone);
      }
    },
    sw: 12, sh: 14,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        wicker(c, 2, 6, 9, b);
        eggs(c, 3, 7, 5);
        c.col(5, 1, 4, WICK);
        c.col(6, 1, 4, D(WICK));
      } else {
        c.oval(2, 5, 9, b, WICK);
        c.oval(3, 6, 8, b - 1, mix(WICK, 0.45));
        dots(c, C.white, [4, b, 9, b, 10, b - 1, 1, b]);
        dots(c, C.mustard, [5, b, 6, b - 1, 10, b]);
      }
    },
  });

  const turnips = (c, x0, x1, y, rot) => {
    for (let x = x0; x <= x1; x += 3) {
      c.rect(x, y, x + 1, y + 1, rot ? hex('#5a5040') : TURNIP);
      c.set(x, y, rot ? hex('#4a3a4a') : hex('#8a6a8a'));
      if (!rot) c.set(x + 1, y - 1, hex('#5f7a48'));
    }
  };
  add('village-turnip-crates', 'turnip crates stacked crates of turnips swedes market vegetables', {
    w: 32, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      crate(c, 1, 10, 14, b);
      crate(c, 16, 10, 30, b);
      turnips(c, 2, 12, 8);
      if (!u) {
        turnips(c, 17, 28, 8);
        crate(c, 8, 2 + 1, 22, 9);
        turnips(c, 10, 20, 1);
      } else {
        turnips(c, 17, 28, 8, true); // gone bad overnight
        c.rect(17, 8, 29, 9, hex('#4a4034'));
        dots(c, hex('#5a5040'), [18, 8, 22, 8, 26, 8]);
        dots(c, SOOT, [19, 5, 24, 4, 27, 6, 21, 3]);
        c.rect(22, 9, 23, 13, hex('#3a3a2a')); // and running out between the slats
        c.set(22, 14, hex('#3a3a2a'));
        dots(c, hex('#3a3a2a'), [26, 12, 26, 13, 19, 11]);
        c.row(b, 18, 31, hex('#3a3a2a'));
      }
    },
    sw: 14, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      crate(c, 2, 10, 11, b);
      if (!u) {
        crate(c, 2, 3, 11, 9);
        turnips(c, 3, 9, 1);
      } else {
        turnips(c, 3, 9, 8, true);
        c.rect(3, 8, 10, 9, hex('#4a4034'));
        dots(c, SOOT, [5, 5, 8, 4]);
        c.col(6, 10, 14, hex('#3a3a2a'));
        c.row(b, 3, 13, hex('#3a3a2a'));
      }
    },
  });

  add('village-tithe-chest', 'tithe chest parish chest ironbound oak three locks strongbox coins', {
    w: 26, h: 18, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, 7, 23, b - 1, DK);
      c.rect(2, b, 4, b, DK);
      c.rect(21, b, 23, b, DK);
      for (const x of [6, 12, 13, 19]) c.col(x, 7, b - 1, C.ironDark);
      c.row(b - 2, 2, 23, C.ironDark);
      if (!u) {
        c.rect(2, 4, 23, 6, DK);
        c.row(3, 3, 22, L(DK));
        c.row(4, 2, 23, L(DK));
        for (const x of [6, 12, 13, 19]) c.col(x, 3, 6, C.ironDark);
        for (const x of [6, 12, 19]) {
          c.rect(x, 7, x + (x === 12 ? 1 : 0), 9, C.brass);
          c.set(x, 8, K);
        }
      } else {
        c.rect(3, 5, 22, 6, SOOT);
        c.rect(2, -3, 23, 4, mix(DK, 0.7)); // the lid thrown back
        c.row(-3, 2, 23, DK);
        for (const x of [6, 12, 13, 19]) c.col(x, -3, 4, C.ironDark);
        dots(c, C.brass, [9, 6, 16, 6, 4, b, 7, b, 25, b]);
        c.rect(14, 5, 18, 5, C.paper);
        c.line(19, 9, 20, 11, C.brass);
      }
    },
    u: [0, 4, 0],
    sw: 14, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      face(c, 2, 7, 11, b - 1, DK);
      c.rect(2, b, 3, b, DK);
      c.rect(10, b, 11, b, DK);
      c.row(b - 2, 2, 11, C.ironDark);
      c.rect(6, 10, 7, 11, C.iron);
      c.set(6, 12, C.iron);
      c.set(7, 12, C.iron);
      if (!u) {
        c.rect(2, 4, 11, 6, DK);
        c.row(3, 3, 10, L(DK));
        c.row(4, 2, 11, L(DK));
        c.set(1, 8, C.brass);
      } else {
        c.row(6, 3, 10, SOOT);
        c.rect(10, -3, 12, 5, mix(DK, 0.7));
        c.col(10, -3, 5, DK);
        dots(c, C.brass, [1, b, 0 + 1, 9]);
      }
    },
    su: [0, 4, 1],
  });

  /* ---------- by the road ---------- */
  const cote = (c, u, side) => {
    const b = c.h - 2;
    post(c, 8, 21, b, GREYW, 3);
    c.line(8, 26, 4, 21, D(GREYW));
    c.line(10, 26, 14, 21, D(GREYW));
    boards(c, 2, 9, 16, 20, LIME, 5);
    c.rect(1, 20, 17, 20, GREYW);
    c.rect(1, 14, 17, 14, GREYW);
    c.poly([[0, 8], [8, 1], [10, 1], [18, 8]], TILE);
    c.line(0, 8, 8, 1, L(TILE));
    c.row(8, 0, 18, D(TILE));
    c.set(9, 0 + 1, TILE);
    for (const y of [11, 17])
      for (const x of side ? [5, 12] : [3, 8, 13]) {
        c.rect(x, y, x + 1, y + 2, SOOT);
        c.set(x, y, LIME);
      }
    const dove = (x, y) => {
      c.rect(x, y - 1, x + 2, y, C.white);
      c.set(x + 3, y - 2, C.white);
      c.set(x + 4, y - 2, hex('#a88a5a'));
      c.set(x - 1, y, D(C.white));
    };
    if (!u) {
      dove(side ? 8 : 5, 13);
      if (!side) dove(11, 19);
      dove(11, 3);
    } else {
      dots(c, C.white, side ? [3, 23, 13, 28, 6, 33, 4, b] : [3, 24, 14, 27, 5, 31, 13, 35, 4, b, 15, b]); // feathers coming down
      blood(c, side ? [5, 14, 6, 15, 5, 16] : [8, 14, 9, 15, 8, 16, 9, 19]);
      c.set(side ? 12 : 13, 18, C.glow);
      c.set(side ? 13 : 14, 18, C.glow);
    }
    grass(c, [6, 13], b);
  };
  add('village-dovecote-post', 'dovecote on a post pigeon house doves white birds tiled roof village', {
    w: 20, h: 46, solid: true,
    f: (c, u) => cote(c, u, false),
    sw: 20, sh: 46,
    s: (c, u) => cote(c, u, true),
  });

  add('village-stile-fence', 'stile over a fence wooden steps footpath field boundary village', {
    w: 34, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 2, 6, b, GREYW);
      post(c, 29, 6, b, GREYW);
      if (!u) board(c, 1, 8, 31, 9, GREYW);
      else {
        c.line(1, 8, 12, 9, GREYW); // the top rail snapped
        c.line(13, 10, 15, 14, GREYW);
        c.line(31, 8, 21, 9, GREYW);
        c.set(20, 10, PALEW);
        c.set(13, 9, PALEW);
      }
      board(c, 1, 14, 31, 15, GREYW);
      post(c, 16, 1, b, OAK); // the hand post
      board(c, 8, 17, 24, 18, PALEW); // the steps
      c.col(10, 19, b, D(GREYW));
      c.col(22, 19, b, D(GREYW));
      board(c, 11, 11, 21, 12, PALEW);
      if (u) {
        c.rect(17, 5, 19, 7, hex('#7a2c2c')); // a scrap of red cloth on the post
        c.set(20, 8, hex('#7a2c2c'));
        c.set(18, 8, hex('#7a2c2c'));
        dots(c, SOIL, [12, 17, 13, 17, 18, 11]);
      }
      grass(c, [5, 13, 26, 31], b);
    },
    sw: 18, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      post(c, 8, 6, b, GREYW);
      post(c, 8, 1, 6, OAK);
      c.rect(8, 8, 9, 9, L(GREYW));
      c.rect(8, 14, 9, 15, L(GREYW));
      board(c, 2, 17, 15, 18, PALEW);
      c.col(4, 19, b, D(GREYW));
      c.col(13, 19, b, D(GREYW));
      board(c, 5, 11, 12, 12, PALEW);
      c.col(6, 13, 16, D(GREYW));
      c.col(11, 13, 16, D(GREYW));
      if (u) {
        c.rect(10, 5, 11, 7, hex('#7a2c2c'));
        c.set(12, 8, hex('#7a2c2c'));
        c.rect(8, 8, 9, 9, PALEW);
        dots(c, SOIL, [4, 17, 9, 11]);
      }
      grass(c, [2, 15], b);
    },
  });

  add('village-wayside-crucifix', 'wayside crucifix wooden cross little roof roadside calvary flowers candle', {
    w: 18, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[3, 8], [8, 3], [9, 3], [14, 8]], DK);
      post(c, 8, 4, b, OAK);
      c.rect(4, 13, 13, 14, OAK);
      c.row(13, 4, 13, L(OAK));
      for (let i = 0; i < 2; i++) {
        c.line(1, 8 - i, 8, 1 - i + 1, i ? hex('#5a5258') : TAR);
        c.line(16, 8 - i, 9, 1 - i + 1, TAR);
      }
      c.rect(8, 10, 9, 11, C.bone); // the figure
      c.row(13, 5, 12, C.bone);
      c.rect(8, 14, 9, 20, C.bone);
      c.col(9, 14, 20, D(C.bone));
      c.rect(8, 17, 9, 18, hex('#8f8a78'));
      c.rect(6, b - 3, 8, b, hex('#5d7f8c')); // a jar
      c.set(6, b - 3, hex('#9ebcc2'));
      if (!u) {
        c.line(7, b - 4, 6, b - 7, hex('#6a5a3a'));
        c.line(7, b - 4, 9, b - 6, hex('#6a5a3a'));
        dots(c, hex('#5a4a3a'), [5, b - 8, 10, b - 7]);
      } else {
        c.line(7, b - 4, 6, b - 7, C.leafLight); // fresh flowers, a candle, and the figure weeping
        c.line(7, b - 4, 9, b - 6, C.leafLight);
        dots(c, hex('#a83a3a'), [5, b - 8, 6, b - 8, 10, b - 7, 7, b - 6]);
        c.col(12, b - 2, b, C.bone);
        flame(c, 12, b - 3);
        blood(c, [8, 12, 8, 15, 9, 16, 5, 14, 12, 14, 12, 15]);
      }
      grass(c, [3, 14], b);
    },
    sw: 12, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      post(c, 5, 4, b, OAK, 3);
      c.rect(2, 2, 9, 3, TAR);
      c.row(2, 2, 9, hex('#5a5258'));
      c.rect(3, 4, 4, 8, DK);
      c.rect(5, 13, 7, 14, L(OAK));
      c.rect(4, 10, 4, 20, C.bone);
      c.set(3, 11, C.bone);
      c.rect(2, b - 3, 4, b, hex('#5d7f8c'));
      if (!u) dots(c, hex('#5a4a3a'), [3, b - 5, 2, b - 6]);
      else {
        dots(c, hex('#a83a3a'), [3, b - 5, 2, b - 6, 4, b - 6]);
        c.col(9, b - 2, b, C.bone);
        flame(c, 9, b - 3);
        blood(c, [4, 12, 4, 15]);
      }
      grass(c, [9], b);
    },
  });

  add('village-door-boarded-cross', 'boarded door nailed shut red cross plague house cottage door planks', {
    w: 22, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 20, b - 1, OAK);
      c.row(2, 1, 20, L(OAK));
      c.col(1, 2, b - 1, L(OAK));
      c.rect(1, b, 20, b, STONE);
      if (!u) {
        boards(c, 3, 6, 18, b - 1, DK, 4);
        c.rect(10, 9, 11, 22, C.blood); // the cross
        c.rect(6, 13, 15, 14, C.blood);
        drip(c, 7, 15, 18, C.blood);
        c.rect(1, 17, 20, 19, PALEW); // boards across
        c.row(17, 1, 20, L(PALEW));
        c.poly([[1, 27], [20, 24], [20, 26], [1, 29]], PALEW);
        c.line(1, 27, 20, 24, L(PALEW));
        dots(c, C.iron, [2, 18, 19, 18, 2, 28, 19, 25]);
      } else {
        hollow(c, 3, 6, 18, b - 1);
        boards(c, 3, 6, 9, b - 1, DK, 3); // broken in from outside
        c.col(10, 6, b - 1, mix(DK, 0.5));
        c.rect(6, 13, 9, 14, C.blood);
        c.rect(1, 17, 5, 19, PALEW);
        c.set(6, 18, PALEW);
        c.rect(18, 24, 20, 26, PALEW);
        c.line(11, b, 19, b - 3, PALEW); // a board on the step
        c.line(11, b - 1, 19, b - 4, L(PALEW));
        dots(c, C.glow, [14, 20, 16, 20]); // and something looking out
        dots(c, PALEW, [8, b, 10, b - 1]);
      }
    },
    sw: 8, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 5, b - 1, OAK);
      c.col(2, 2, b - 1, L(OAK));
      c.row(2, 2, 5, L(OAK));
      c.rect(1, b, 6, b, STONE);
      if (!u) {
        c.col(1, 6, b - 1, DK);
        c.rect(0, 17, 1, 19, PALEW);
        c.rect(0, 25, 1, 27, PALEW);
      } else {
        c.set(1, 18, PALEW);
        c.rect(-4, b - 1, 1, b, PALEW);
        c.row(b - 1, -4, 1, L(PALEW));
        c.col(6, 6, b - 1, DK);
        c.col(7, 6, b - 1, D(DK));
      }
    },
    su: [5, 0, 0],
  });

  add('village-yoke-buckets', 'milkmaids yoke and two buckets water carrier wooden pails chains', {
    w: 32, h: 18, solid: true,
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        bucket(c, 1, b - 7, 8, 8, hex('#3c5560'));
        bucket(c, 22, b - 7, 8, 8, hex('#3c5560'));
        c.rect(4, 3, 26, 4, OAK); // the yoke lying across them
        c.row(3, 4, 26, L(OAK));
        c.rect(12, 5, 18, 5, D(OAK));
        c.set(3, 4, OAK);
        c.set(27, 4, OAK);
        chain(c, 4, 5, 4, b - 8);
        chain(c, 26, 5, 26, b - 8);
      } else {
        bucket(c, 1, b - 7, 8, 8, hex('#3c5560'));
        c.rect(18, b - 6, 26, b, PALEW); // one pail over
        c.row(b - 6, 18, 26, L(PALEW));
        c.col(20, b - 6, b, C.iron);
        c.col(24, b - 6, b, C.iron);
        c.col(27, b - 5, b - 1, hex('#3a2c22'));
        c.row(b, 27, 30, WAT);
        c.row(b, 10, 17, WAT);
        c.set(28, b - 1, WAT);
        c.line(5, 5, 24, b - 8, OAK); // the yoke dropped
        c.line(5, 6, 24, b - 7, D(OAK));
        chain(c, 5, 6, 5, b - 8);
        chain(c, 24, b - 7, 22, b - 6);
      }
    },
    sw: 12, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        bucket(c, 2, b - 7, 8, 8, hex('#3c5560'));
        c.rect(5, 3, 6, 4, L(OAK));
        c.set(6, 4, D(OAK));
        chain(c, 5, 5, 5, b - 8);
      } else {
        c.oval(2, b - 7, 9, b, PALEW);
        c.oval(3, b - 6, 8, b - 1, hex('#3a2c22'));
        c.row(b, 3, 11, WAT);
        c.row(b - 1, 4, 7, WAT);
        c.rect(5, b - 10, 6, b - 9, L(OAK));
      }
    },
  });

  add('village-wheelbarrow-wood', 'wooden wheelbarrow barrow old cart one wheel handles village', {
    w: 34, h: 18, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      if (u) {
        c.rect(9, 3, 24, 6, SACK); // loaded with something tied up in sacking
        c.row(2, 11, 21, SACK);
        c.row(2, 11, 16, L(SACK));
        c.row(3, 9, 24, L(SACK));
        for (const x of [13, 19]) c.col(x, 2, 6, ROPE);
        c.rect(25, 5, 27, 6, BOOT);
        c.rect(27, 3, 28, 4, BOOT);
        c.col(8, 7, 10, C.flesh); // a hand over the side
        c.set(7, 11, C.flesh);
        c.set(8, 11, C.flesh);
      }
      c.poly([[7, 7], [25, 7], [22, 12], [10, 12]], GREYW);
      c.row(7, 7, 25, L(GREYW));
      c.row(10, 9, 23, D(GREYW));
      c.line(7, 7, 10, 12, L(GREYW));
      c.line(5, b - 4, 31, 8, OAK); // the shafts
      c.line(5, b - 3, 31, 9, D(OAK));
      c.rect(30, 7, 32, 8, OAK);
      c.col(22, 13, b, OAK);
      c.col(23, 13, b, D(OAK));
      wheel(c, 5, b - 4, 4, PALEW, C.iron, OAK);
      if (u) blood(c, [14, 12, 15, 13, 15, b, 16, b]);
    },
    sw: 16, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      if (u) {
        c.rect(4, 3, 11, 6, SACK);
        c.row(2, 5, 10, L(SACK));
        c.line(5, 3, 10, 6, ROPE);
        c.col(2, 7, 10, C.flesh);
      }
      c.poly([[2, 7], [13, 7], [11, 12], [4, 12]], GREYW);
      c.row(7, 2, 13, L(GREYW));
      c.row(10, 3, 12, D(GREYW));
      c.col(3, 13, b, OAK);
      c.col(12, 13, b, D(OAK));
      c.rect(7, b - 8, 8, b, PALEW);
      c.col(7, b - 8, b, C.iron);
      c.row(b - 4, 4, 11, D(OAK));
      if (u) blood(c, [9, 12, 9, 14, 10, b]);
    },
  });

  add('village-cartwheel-leaning', 'cartwheel leaning spoked wooden wheel iron tyre wheelwright spare', {
    w: 22, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2;
      wheel(c, 10, b - 9, 9, PALEW, C.iron, hex('#4a3e36'));
      if (u) {
        for (let y = 1; y < b - 9; y++) for (let x = 11; x < 21; x++) if (x - 11 + (b - 9 - y) > 3) c.clear(x, y); // a quarter stove in
        c.line(11, b - 10, 14, b - 14, D(PALEW));
        c.set(15, b - 15, PALEW);
        c.line(14, b, 20, b - 1, hex('#4a3e36'));
        dots(c, PALEW, [16, b, 18, b - 2, 20, b, 19, b - 4]);
        c.set(11, 1, hex('#4a3e36'));
        c.set(19, b - 9, hex('#4a3e36'));
      }
      grass(c, [2, 17], b);
    },
    sw: 8, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      for (let i = 0; i < 2; i++) c.line(2 + i, b, 4 + i, u ? 8 : 1, i ? D(PALEW) : C.iron);
      c.set(3, b - 9, C.iron);
      c.set(2, b - 9, C.steel);
      if (u) {
        dots(c, PALEW, [5, 6, 6, b, 1, b]);
        c.set(4, 7, hex('#4a3e36'));
      }
    },
  });

  add('village-hitching-rail', 'hitching rail horse rail posts tavern yard nosebag rope ring', {
    w: 34, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 3, 3, b, OAK, 3);
      post(c, 27, 3, b, OAK, 3);
      if (!u) {
        c.rect(1, 6, 31, 7, GREYW);
        c.row(6, 1, 31, L(GREYW));
        c.rect(10, 8, 14, 13, SACK); // a nosebag
        c.col(10, 6, 7, ROPE);
        c.col(14, 6, 7, ROPE);
        c.row(8, 10, 14, L(SACK));
      } else {
        c.line(1, 6, 14, 7, GREYW); // the rail broken through
        c.line(1, 7, 13, 8, D(GREYW));
        c.line(15, 9, 17, 14, GREYW);
        c.line(31, 6, 21, 7, GREYW);
        c.line(31, 7, 21, 8, D(GREYW));
        dots(c, PALEW, [15, 8, 20, 8, 16, 11]);
        rope(c, 23, 8, 22, 15); // a rein torn off
        c.set(23, 16, ROPE);
        c.rect(9, b - 2, 13, b, SACK);
        dots(c, SOIL, [6, b, 15, b, 18, b - 1, 21, b, 25, b]); // the ground cut up
        dots(c, HAY, [14, b, 8, b]);
      }
      c.rect(4, 10, 4, 11, C.iron);
      c.rect(28, 10, 28, 11, C.iron);
      grass(c, [1, 32], b);
    },
    sw: 8, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      post(c, 2, 3, b, OAK, 4);
      c.rect(3, 6, 4, 7, L(GREYW));
      c.set(6, 10, C.iron);
      if (!u) c.rect(0 + 1, 8, 1, 13, SACK);
      else {
        c.rect(3, 6, 4, 7, PALEW);
        rope(c, 6, 8, 6, 15);
        dots(c, SOIL, [1, b, 6, b]);
      }
    },
  });

  add('village-millstone-leaning', 'millstone leaning old mill stone grooves round stone miller', {
    w: 22, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.oval(1, 1, 20, b, STONE);
      c.oval(2, 2, 19, b - 1, L(STONE));
      c.oval(3, 3, 19, b - 1, STONE);
      for (let a = 0; a < 8; a++) {
        const dx = Math.cos((a * Math.PI) / 4 + 0.3),
          dy = Math.sin((a * Math.PI) / 4 + 0.3);
        c.line(10.5 + dx * 3, 10 + dy * 3, 10.5 + dx * 8, 10 + dy * 8, D(STONE));
      }
      c.rect(9, 9, 12, 11, SOOT);
      c.speckle(2, 2, 19, b, L(STONE), 12, 4);
      dots(c, C.moss, [4, b - 3, 5, b - 2, 15, b - 1, 3, 6]);
      if (u) {
        c.line(12, 1, 9, 8, SOOT); // split
        c.line(12, 12, 14, b, SOOT);
        c.line(13, 12, 15, b, D(STONE));
        blood(c, [8, 12, 7, 13, 8, 14, 7, 16]);
        dots(c, STONE, [18, b, 21, b]);
      }
      grass(c, [1, 19], b);
    },
    sw: 9, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[1, b], [4, b], [7, 1], [4, 1]], STONE);
      c.line(1, b, 4, 1, L(STONE));
      c.line(4, b, 7, 1, D(STONE));
      c.set(4, 10, SOOT);
      if (u) {
        c.line(3, 9, 6, 9, SOOT);
        blood(c, [3, 12, 2, 15]);
      }
      c.set(2, b, C.moss);
    },
  });
};
