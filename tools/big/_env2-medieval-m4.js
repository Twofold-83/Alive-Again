/* Medieval, part 4: fire and light, the kitchen, the yard and the tilt-yard. Part of tools/big/env2-medieval.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix } = kit;
  const { D, L, dots, board, face, hollow, fire, wisp, planksV, stones, wheel, wheelEdge, chain, rope, post, barrel, barrelEnd, barrelSide, heap } = H;
  const add = H.reg('env-medieval', 'Medieval');
  const { OAK, DOAK, PINE, CANVAS, HEMP, HIDE, RED, BLUE, SOOT, LEATHER, PEWTER, MSTONE, WAT, DEADF } = H.MED;
  const IRON = C.iron,
    STEEL = C.steel,
    GOLD = C.gold,
    COAL = hex('#2a2428');

  add('medieval-brazier-iron-tripod', 'brazier iron fire basket tripod coals guard post warmth castle wall', {
    w: 14, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.line(5, 13, 2, b, IRON);
      c.line(8, 13, 11, b, D(IRON));
      c.col(6, 13, b - 1, D(IRON));
      c.row(18, 4, 9, IRON);
      c.rect(2, 8, 11, 9, IRON); // the basket
      c.rect(3, 10, 10, 12, IRON);
      c.row(8, 2, 11, L(IRON));
      for (const x of [4, 6, 8]) c.col(x, 10, 12, COAL);
      c.row(7, 3, 10, COAL);
      dots(c, C.ash, [4, 7, 7, 7, 9, 7]);
      if (u) {
        fire(c, 3, 10, 7, 7, 3);
        for (const x of [4, 6, 8]) c.col(x, 10, 12, C.flame);
        dots(c, C.flameLight, [5, -1, 9, -2]);
        c.set(7, -3, C.flame);
      }
    },
    u: [0, 4, 0],
  });
  add('medieval-torch-sconce-wall', 'torch wall sconce iron bracket flame pitch castle corridor light', {
    w: 10, h: 20,
    f(c, u) {
      c.rect(4, 14, 5, 18, IRON); // the plate on the wall
      c.row(13, 2, 7, IRON);
      c.row(13, 2, 3, L(IRON));
      c.rect(4, 7, 5, 16, PINE);
      c.col(4, 7, 16, L(PINE));
      c.rect(3, 3, 6, 7, COAL); // the head, wound with pitched rag
      c.row(5, 3, 6, HEMP);
      c.set(3, 3, hex('#3a3236'));
      if (u) {
        c.rect(3, 0, 6, 3, C.flame);
        c.rect(4, -2, 5, 2, C.flameLight);
        c.set(4, -3, C.flame);
        c.set(6, -1, C.flame);
        c.set(3, -1, C.red);
        c.set(5, -4, C.red);
      }
    },
    u: [0, 5, 0],
    sw: 10, sh: 20,
    s(c, u) {
      c.rect(1, 10, 2, 18, IRON);
      c.col(1, 10, 18, L(IRON));
      c.line(3, 16, 6, 13, IRON);
      c.row(12, 4, 8, IRON);
      c.line(3, 15, 6, 6, PINE);
      c.line(4, 15, 7, 6, D(PINE));
      c.rect(5, 2, 8, 6, COAL);
      c.row(4, 5, 8, HEMP);
      if (u) {
        c.rect(5, -1, 8, 2, C.flame);
        c.rect(6, -3, 7, 1, C.flameLight);
        c.set(6, -4, C.flame);
        c.set(8, -2, C.red);
      }
    },
    su: [0, 5, 0],
  });
  add('medieval-arrow-barrel-fletched', 'arrows barrel fletched quiver archers store battlement wooden tub', {
    w: 14, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const arrow = (x0, x1, col) => {
        c.line(x0, 10, x1, 2, PINE);
        c.set(x1, 1, col);
        c.set(x1 - 1, 2, col);
        c.set(x1 + 1, 2, col);
        c.set(x1, 3, col);
      };
      if (!u) {
        arrow(4, 2, C.white);
        arrow(6, 5, RED);
        arrow(8, 8, C.white);
        arrow(9, 11, C.white);
        arrow(5, 7, C.bone);
      } else {
        arrow(8, 10, C.white);
        c.line(13, b, 16, b - 6, PINE); // one dropped
        c.set(16, b - 7, RED);
        c.set(17, b - 6, RED);
        c.set(13, b, STEEL);
      }
      barrel(c, 2, 10, 11, b, OAK);
      c.row(10, 3, 10, SOOT);
    },
    u: [0, 0, 5],
  });
  add('medieval-archery-butt-straw', 'archery butt straw target rings bullseye practice bow tilt yard', {
    w: 22, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.line(5, 18, 2, b, OAK);
      c.line(16, 18, 19, b, DOAK);
      c.col(11, 20, b - 2, DOAK);
      c.oval(2, 2, 19, 20, C.straw);
      c.oval(3, 3, 18, 19, D(C.straw));
      c.oval(4, 4, 17, 18, C.straw);
      c.oval(6, 6, 15, 16, RED);
      c.oval(8, 8, 13, 14, CANVAS);
      c.rect(10, 10, 11, 12, SOOT);
      dots(c, L(C.straw), [5, 6, 4, 9, 7, 4]);
      dots(c, D(C.straw), [16, 14, 14, 17, 17, 11]);
      if (u) {
        for (const [x, y] of [[11, 11], [7, 8], [14, 14]]) {
          c.set(x, y, K); // arrows, seen from behind the nock
          c.line(x + 1, y + 1, x + 3, y + 3, PINE);
          c.set(x + 4, y + 3, C.white);
          c.set(x + 3, y + 4, C.white);
          c.set(x + 4, y + 4, D(C.white));
        }
        c.line(3, b, 8, b - 1, PINE); // and one that missed
        c.set(8, b - 2, C.white);
      }
    },
    sw: 14, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.line(6, 20, 4, b, OAK);
      c.line(8, 12, 12, b, DOAK);
      for (let y = 2; y <= 20; y++) {
        const x = 5 + Math.round((20 - y) / 9);
        c.rect(x, y, x + 2, y, C.straw);
        c.set(x, y, y > 6 && y < 16 ? RED : L(C.straw));
        c.set(x + 2, y, D(C.straw));
      }
      if (u) {
        for (const [x, y] of [[5, 11], [6, 8], [5, 14]]) {
          c.line(x - 5, y, x - 1, y, PINE);
          c.set(x - 5, y - 1, C.white);
          c.set(x - 6, y, C.white);
        }
        c.line(1, b, 5, b, PINE);
      }
    },
    su: [2, 0, 0],
  });
  add('medieval-hall-bench-oak', 'bench long form oak great hall seat plank trestle refectory', {
    w: 32, h: 13, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        for (const x of [4, 24]) {
          c.rect(x, 6, x + 2, b, DOAK);
          c.col(x, 6, b, OAK);
        }
        c.row(8, 7, 23, D(OAK));
        board(c, 1, 4, 29, 5, OAK);
      } else {
        c.rect(24, 6, 26, b, DOAK); // one leg gone from under it
        c.col(24, 6, b, OAK);
        c.line(1, b - 1, 29, 4, L(OAK));
        c.line(1, b, 29, 5, OAK);
        c.line(3, b, 20, 7, D(OAK));
        c.rect(6, b - 3, 10, b - 2, DOAK);
        c.rect(12, b, 16, b, DOAK);
        dots(c, PINE, [5, b - 4, 11, b - 1, 4, b - 2]);
        c.rect(19, b - 1, 21, b, PEWTER); // a cup rolled away
        c.set(22, b, C.wine);
        c.set(23, b, C.wine);
      }
    },
    sw: 12, sh: 13,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        face(c, 2, 6, 8, b, DOAK);
        c.rect(4, b - 1, 6, b, null);
        c.clearRect(4, b - 1, 6, b);
        c.set(5, b - 2, SOOT);
        board(c, 1, 4, 9, 5, OAK);
      } else {
        c.line(1, b - 1, 9, 5, L(OAK));
        c.line(1, b, 9, 6, OAK);
        c.rect(7, 7, 8, b, DOAK);
        c.rect(2, b, 5, b, DOAK);
        c.set(10, b, PEWTER);
      }
    },
  });
  add('medieval-cauldron-on-tripod', 'cauldron on tripod iron pot chain camp fire stew kitchen yard boiling', {
    w: 22, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.line(10, 2, 2, b, DOAK);
      c.line(11, 2, 19, b, D(DOAK));
      c.line(11, 2, 12, b - 3, mix(DOAK, 0.7));
      c.rect(10, 1, 11, 2, HEMP);
      chain(c, 10, 3, 10, 11);
      c.oval(5, 12, 16, 21, IRON); // the pot
      c.rect(5, 12, 16, 13, IRON);
      c.row(12, 4, 17, L(IRON));
      c.line(6, 15, 7, 19, L(IRON));
      dots(c, D(IRON), [14, 16, 15, 18, 13, 20]);
      c.line(7, 11, 10, 9, IRON);
      c.line(14, 11, 11, 9, IRON);
      c.rect(6, b - 1, 15, b, DOAK); // the logs
      c.set(6, b - 1, PINE);
      c.set(15, b, PINE);
      c.line(7, b, 14, b - 2, OAK);
      if (u) {
        fire(c, 6, 15, b, 5, 8);
        c.row(13, 6, 15, hex('#6a6a3c'));
        dots(c, hex('#8a8a54'), [8, 13, 12, 13]);
        c.set(10, 12, C.bone);
        wisp(c, 7, 10, 4);
        wisp(c, 13, 9, 5);
        wisp(c, 16, 10, 3);
      } else dots(c, C.ash, [8, b, 12, b, 10, b - 1]);
    },
  });
  add('medieval-kitchen-chopping-block', 'chopping block butcher cleaver kitchen wooden stump meat goose blood', {
    w: 18, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.line(4, 12, 2, b, DOAK);
      c.line(13, 12, 15, b, DOAK);
      c.col(9, 12, b - 1, D(DOAK));
      c.rect(3, 7, 14, 11, OAK);
      c.row(6, 4, 13, PINE);
      c.row(7, 3, 14, L(PINE));
      for (const x of [6, 9, 12]) c.col(x, 8, 11, D(OAK));
      c.row(9, 3, 14, IRON);
      c.rect(10, 2, 13, 5, STEEL); // the cleaver
      c.col(10, 2, 5, L(STEEL));
      c.row(6, 10, 13, D(STEEL));
      c.rect(14, 2, 16, 2, DOAK);
      if (u) {
        c.rect(3, 4, 8, 6, C.bone); // a goose, plucked
        c.row(3, 4, 7, C.bone);
        c.set(4, 3, L(C.bone));
        c.col(2, 6, 11, C.bone);
        c.set(2, 12, C.mustard);
        dots(c, D(C.bone), [5, 5, 7, 6, 8, 5]);
        dots(c, C.blood, [9, 6, 9, 7, 10, 8, 10, 10, 11, 5, 12, 4, 10, 12, 8, b]);
      }
    },
    sw: 14, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      c.line(4, 12, 2, b, DOAK);
      c.line(9, 12, 11, b, DOAK);
      c.rect(3, 7, 10, 11, OAK);
      c.row(6, 4, 9, PINE);
      c.row(7, 3, 10, L(PINE));
      for (const x of [5, 8]) c.col(x, 8, 11, D(OAK));
      c.row(9, 3, 10, IRON);
      c.col(8, 2, 6, STEEL);
      c.set(8, 1, DOAK);
      c.set(9, 2, DOAK);
      if (u) {
        c.rect(3, 4, 6, 6, C.bone);
        c.set(4, 3, L(C.bone));
        dots(c, C.blood, [7, 6, 7, 8, 8, 5, 7, 11, 6, b]);
      }
    },
  });
  add('medieval-wine-tun-great', 'wine tun great barrel cask vat cellar oak hoops tap vintage', {
    w: 30, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 25, 8, b, DOAK); // the cradle
      c.rect(19, 25, 24, b, DOAK);
      c.row(b, 3, 24, D(OAK));
      c.oval(1, 1, 26, 27, IRON);
      c.oval(2, 2, 25, 26, OAK);
      c.oval(4, 4, 23, 24, L(OAK));
      c.oval(5, 5, 22, 23, OAK);
      for (const x of [9, 13, 17]) for (let y = 5; y <= 23; y++) if (c.get(x, y)) c.set(x, y, D(OAK));
      c.row(14, 5, 22, DOAK);
      dots(c, C.white, [7, 9, 7, 10, 7, 11, 9, 9, 9, 10, 9, 11, 11, 9, 11, 10, 11, 11]); // the cellarer's tally
      c.rect(13, 20, 14, 22, C.brass);
      c.set(13, 23, D(C.brass));
      if (u) {
        c.poly([[15, 5], [21, 8], [22, 13], [17, 12], [14, 9]], SOOT); // the head stove in
        dots(c, K, [17, 8, 19, 10]);
        dots(c, L(OAK), [14, 8, 16, 12, 22, 14]);
        c.line(14, 9, 12, 7, PINE);
        c.line(18, 13, 19, 15, PINE);
        dots(c, C.wine, [17, 13, 17, 15, 18, 16, 18, 18, 17, 20, 18, 23, 18, 26]);
        c.row(b, 9, 29, C.wine);
        c.row(b - 1, 15, 25, C.wine);
        dots(c, L(C.wine), [17, b - 1, 22, b, 27, b]);
      }
    },
    u: [0, 0, 3],
    sw: 38, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [6, 26]) {
        c.rect(x, 25, x + 4, b, DOAK);
        c.row(25, x, x + 4, OAK);
      }
      c.row(b, 6, 30, D(OAK));
      barrelSide(c, 2, 1, 34, 27, OAK);
      c.row(1, 4, 32, L(OAK));
      for (const x of [9, 14, 22, 27]) c.col(x, 1, 27, IRON);
      c.rect(17, 0, 18, 1, DOAK);
      c.rect(35, 20, 36, 21, C.brass);
      c.set(36, 22, D(C.brass));
      if (u) {
        dots(c, PINE, [35, 6, 36, 9, 35, 12]);
        dots(c, C.wine, [35, 13, 35, 16, 36, 19, 35, 24]);
        c.row(b, 31, 39, C.wine);
        c.row(b - 1, 33, 37, C.wine);
        c.set(35, b - 1, L(C.wine));
      }
    },
    su: [0, 0, 3],
  });
  add('medieval-shield-crossed-swords', 'shield crossed swords wall trophy heraldic blue gold coat of arms hall', {
    w: 22, h: 24,
    f(c, u) {
      const sword = (x0, x1) => {
        c.line(x0, 3, x1, 21, STEEL);
        c.line(x0 + (x0 < x1 ? 1 : -1), 3, x1 + (x0 < x1 ? 1 : -1), 21, D(STEEL));
        c.rect(x0 - 1, 4, x0 + 2, 4, GOLD);
        c.set(x0 + (x0 < x1 ? -1 : 1), 2, LEATHER);
        c.set(x0 + (x0 < x1 ? -1 : 1), 1, GOLD);
      };
      sword(4, 17);
      if (!u) sword(17, 4);
      else {
        c.set(16, 5, IRON); // the hook it hung on
        c.set(17, 5, IRON);
        c.set(5, 19, IRON);
      }
      c.rect(6, 5, 15, 13, BLUE);
      c.poly([[6, 14], [15, 14], [11, 20], [10, 20]], BLUE);
      c.frame(6, 5, 15, 13, GOLD);
      c.line(6, 14, 10, 20, GOLD);
      c.line(15, 14, 11, 20, D(GOLD));
      c.line(7, 12, 10, 9, GOLD);
      c.line(14, 12, 11, 9, GOLD);
      c.col(7, 6, 13, L(BLUE));
      dots(c, C.white, [10, 7, 11, 7, 10, 14, 11, 14]);
      if (u) dots(c, C.blood, [12, 15, 12, 17, 13, 16]);
    },
    sw: 8, sh: 24,
    s(c, u) {
      c.col(2, 5, 19, BLUE);
      c.col(3, 6, 18, BLUE);
      c.col(4, 8, 15, D(BLUE));
      c.set(2, 5, GOLD);
      c.set(2, 19, GOLD);
      c.set(3, 20, GOLD);
      c.col(1, 3, 21, STEEL);
      c.set(1, 2, LEATHER);
      c.set(1, 1, GOLD);
      c.set(2, 4, GOLD);
      if (!u) {
        c.set(3, 4, GOLD);
        c.set(3, 3, LEATHER);
        c.set(3, 21, STEEL);
      } else c.set(4, 16, C.blood);
    },
  });
  add('medieval-pavilion-tent-striped', 'large pavilion tent striped knight tournament camp red canvas pennant', {
    w: 40, h: 46, solid: true,
    f(c, u) {
      H.tent(c, u, true);
    },
    sw: 40, sh: 46,
    s(c, u) {
      H.tent(c, u, false);
    },
  });
  add('medieval-horse-trough-stone', 'horse trough stone water drinking stable yard mossy basin', {
    w: 32, h: 14, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      stones(c, 1, 5, 30, b, MSTONE, 5, 10, 4);
      c.rect(1, 3, 30, 4, L(MSTONE));
      c.row(4, 2, 29, u ? hex('#5a3438') : WAT);
      c.row(4, 5, 9, u ? hex('#7a4448') : L(WAT));
      c.col(1, 3, b, L(MSTONE));
      dots(c, C.moss, [3, b, 4, b, 5, b - 1, 20, b, 27, 6, 28, 7, 12, b]);
      c.rect(14, 7, 15, 8, IRON);
      c.set(14, 9, IRON);
      c.set(15, 9, IRON);
      if (u) {
        c.rect(18, 3, 21, 4, LEATHER); // a glove floats in it
        c.set(22, 3, LEATHER);
        dots(c, hex('#5a3438'), [8, 5, 8, 7, 9, 9, 24, 5, 24, 6]);
        dots(c, C.blood, [8, b, 7, b]);
      }
    },
    sw: 14, sh: 14,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 2, 5, 11, b, MSTONE, 5, 6, 6);
      c.rect(2, 3, 11, 4, L(MSTONE));
      c.row(4, 3, 10, u ? hex('#5a3438') : WAT);
      c.col(2, 3, b, L(MSTONE));
      dots(c, C.moss, [3, b, 9, b, 10, 7]);
      if (u) {
        c.rect(5, 3, 7, 4, LEATHER);
        dots(c, hex('#5a3438'), [4, 5, 4, 7, 5, 9]);
      }
    },
  });
  add('medieval-hitching-rail-posts', 'hitching rail post horse tie reins stable inn yard wooden bar nosebag', {
    w: 30, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 3, 5, 3, b, OAK);
      post(c, 23, 25, 3, b, OAK);
      c.row(3, 3, 5, L(OAK));
      c.row(3, 23, 25, L(OAK));
      if (!u) {
        board(c, 1, 5, 27, 6, PINE);
        c.rect(11, 4, 12, 7, LEATHER); // reins made fast
        c.line(12, 8, 14, 13, LEATHER);
        c.set(14, 14, IRON);
        c.col(19, 7, 8, HEMP);
        c.rect(17, 9, 21, 13, HEMP); // a nosebag
        c.row(9, 17, 21, D(HEMP));
        c.col(17, 9, 13, L(HEMP));
      } else {
        board(c, 1, 5, 12, 6, PINE); // the rail broken through
        c.line(13, 6, 15, 9, PINE);
        c.line(16, 9, 18, 6, PINE);
        board(c, 19, 5, 27, 6, PINE);
        c.set(15, 10, L(PINE));
        c.rect(10, 4, 11, 7, LEATHER);
        c.col(10, 8, 9, LEATHER);
        c.rect(17, b - 2, 21, b, HEMP);
        c.col(17, b - 2, b, L(HEMP));
        dots(c, C.straw, [22, b, 23, b - 1, 15, b]);
        dots(c, IRON, [8, b, 9, b - 1, 10, b - 1, 11, b]); // a cast shoe
      }
    },
    sw: 10, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      post(c, 3, 5, 3, b, OAK);
      c.row(3, 3, 5, L(OAK));
      c.rect(3, 5, 5, 6, PINE);
      c.row(5, 3, 5, L(PINE));
      if (!u) {
        c.rect(6, 5, 6, 7, LEATHER);
        c.rect(6, 9, 8, 13, HEMP);
        c.col(7, 7, 8, HEMP);
      } else {
        c.set(6, 6, LEATHER);
        c.rect(6, b - 2, 8, b, HEMP);
        c.set(2, b, IRON);
      }
    },
  });
  add('medieval-hay-rick-pitchfork', 'hay rick haystack pitchfork straw heap stable barn yard fodder', {
    w: 30, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      heap(c, 2, 25, b, u ? 13 : 17, C.straw, 4);
      const r = kit.rnd(5);
      for (let i = 0; i < 26; i++) {
        const x = 3 + Math.floor(r() * 22),
          y = b - Math.floor(r() * (u ? 9 : 13));
        if (c.get(x, y) && c.get(x + 1, y - 1)) {
          c.set(x, y, L(C.straw));
          c.set(x + 1, y - 1, L(C.straw));
        }
      }
      if (!u) {
        c.line(21, 1, 17, 12, PINE); // the fork stuck in it
        c.line(22, 1, 18, 12, D(PINE));
      } else {
        c.oval(9, b - 6, 16, b, mix(C.straw, 0.35)); // someone burrowed in, and has not come out
        c.rect(15, b - 1, 18, b, DEADF);
        c.set(19, b, DEADF);
        c.set(18, b - 2, DEADF);
        c.line(22, b, 28, b - 1, PINE);
        c.rect(27, b - 3, 28, b - 2, IRON);
        c.set(26, b - 2, IRON);
        dots(c, C.straw, [1, b, 26, b, 27, b, 24, b - 3]);
      }
    },
    sw: 22, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      heap(c, 2, 18, b, u ? 13 : 17, C.straw, 9);
      dots(c, L(C.straw), [6, b - 3, 7, b - 4, 12, b - 6, 13, b - 7, 9, b - 9, 10, b - 10, 14, b - 2, 15, b - 3]);
      if (!u) {
        c.line(10, 1, 10, 9, PINE);
        c.set(11, 1, D(PINE));
      } else {
        c.rect(17, b - 1, 19, b, DEADF);
        c.set(20, b, DEADF);
        dots(c, C.straw, [1, b, 20, b - 2]);
      }
    },
  });
  add('medieval-grain-sacks-pile', 'grain sacks pile flour corn store mill granary hessian bags rat', {
    w: 24, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const sack = (x, y, w, h) => {
        c.rect(x, y + 1, x + w - 1, y + h - 1, HEMP);
        c.row(y, x + 1, x + w - 2, HEMP);
        c.row(y, x + 1, x + w - 3, L(HEMP));
        c.col(x, y + 1, y + h - 1, L(HEMP));
        c.row(y + h - 1, x, x + w - 1, D(HEMP));
        c.set(x + w - 1, y, D(HEMP));
        dots(c, D(HEMP), [x + 3, y + 3, x + w - 3, y + 4, x + 5, y + h - 3]);
      };
      sack(2, 9, 10, 9);
      sack(12, 9, 10, 9);
      sack(7, 2, 10, 8);
      if (u) {
        c.line(12, 4, 14, 8, SOOT); // slit, and running out
        for (const [x, y] of [[14, 9], [14, 10], [15, 11], [15, 12], [15, 13], [16, 14], [16, 15]]) c.set(x, y, C.straw);
        c.rect(14, b - 1, 19, b, C.straw);
        c.row(b - 2, 15, 17, C.straw);
        dots(c, L(C.straw), [16, b - 2, 15, b - 1, 18, b]);
        c.rect(20, b - 1, 22, b, hex('#4a4240')); // a rat at it
        c.set(23, b, hex('#4a4240'));
        c.set(20, b - 2, hex('#4a4240'));
        c.set(24, b, C.flesh);
        c.set(25, b - 1, C.flesh);
      }
    },
    u: [0, 0, 3],
    sw: 14, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      for (const [x, y, w, h] of [[2, 9, 10, 9], [3, 2, 8, 8]]) {
        c.rect(x, y + 1, x + w - 1, y + h - 1, HEMP);
        c.row(y, x + 1, x + w - 2, L(HEMP));
        c.col(x, y + 1, y + h - 1, L(HEMP));
        c.row(y + h - 1, x, x + w - 1, D(HEMP));
        c.rect(x + w / 2 - 1, y + 2, x + w / 2, y + 3, D(HEMP)); // the tied neck
      }
      if (u) {
        for (const [x, y] of [[9, 8], [10, 10], [10, 12], [11, 14]]) c.set(x, y, C.straw);
        c.rect(10, b - 1, 13, b, C.straw);
        c.set(11, b - 2, L(C.straw));
        c.set(14, b, hex('#4a4240'));
      }
    },
    su: [0, 0, 2],
  });
  add('medieval-spinning-wheel-great', 'spinning wheel great wheel walking wheel wool distaff spindle thread', {
    w: 28, h: 30, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.line(5, 20, 3, b, DOAK);
      c.line(22, 19, 24, b, DOAK);
      c.line(13, 20, 13, b, D(DOAK));
      board(c, 3, 19, 24, 20, OAK);
      post(c, 9, 10, 12, 19, OAK);
      wheel(c, 10, 10, 8, PINE, IRON);
      post(c, 21, 22, 11, 19, OAK);
      c.row(11, 20, 26, IRON); // the spindle
      c.line(10, 2, 21, 10, HEMP);
      c.col(25, 3, 19, DOAK); // the distaff
      if (!u) {
        c.oval(23, 2, 27, 9, CANVAS);
        dots(c, D(CANVAS), [25, 4, 24, 7, 26, 6]);
        dots(c, L(CANVAS), [24, 3]);
      } else {
        c.oval(24, 3, 26, 6, CANVAS);
        c.rect(22, 10, 24, 12, C.white); // a full spindle
        c.row(11, 22, 24, D(C.white));
        c.line(25, 12, 26, b - 1, C.white);
        c.row(b, 22, 27, C.white);
        c.set(26, 11, C.blood); // and a pricked finger
        c.set(27, 13, C.blood);
      }
    },
    sw: 12, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.line(4, 20, 2, b, DOAK);
      c.line(7, 20, 9, b, DOAK);
      c.rect(3, 19, 8, 20, OAK);
      c.row(19, 3, 8, L(OAK));
      wheelEdge(c, 5, 6, 2, 18, PINE, PINE);
      c.set(5, 10, IRON);
      c.col(9, 3, 19, DOAK);
      if (!u) {
        c.oval(7, 2, 10, 9, CANVAS);
        dots(c, D(CANVAS), [8, 5, 9, 7]);
      } else {
        c.oval(8, 3, 10, 6, CANVAS);
        c.rect(7, 10, 8, 12, C.white);
        c.line(8, 13, 9, b - 1, C.white);
        c.row(b, 7, 10, C.white);
        c.set(7, 13, C.blood);
      }
    },
  });
  void [K, hollow, wheel, rope, barrelEnd, HIDE, BLUE, CANVAS, planksV];
};
