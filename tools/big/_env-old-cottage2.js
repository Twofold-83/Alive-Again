/* Cottage, second part: the yard and the dairy, tools and small things. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, cabSide, hollow, flame, fire, wisp, cloth, shards, doorOut, planksV, planksH, stones, heap } = H;
  const add = H.reg('env-cottage', 'Cottage');
  const PINE = hex('#94714a'),
    OAK = hex('#5c4432'),
    GREYW = hex('#7a6e60'),
    WHITEW = hex('#b4ae9c'),
    SOOT = hex('#221d22'),
    TIN = hex('#858a92'),
    EARTHEN = hex('#8a4f36'),
    MADDER = hex('#7a3a30'),
    BLUE = hex('#4f5f78'),
    CHINA = hex('#d6d2c4'),
    STRAW = C.straw,
    WAT = hex('#6f8f98'),
    PAINT = hex('#5f7a74');
  const planks = (c, x0, y0, x1, y1, col, step = 4) => {
    face(c, x0, y0, x1, y1, col);
    planksV(c, x0, y0 + 1, x1, y1, D(col), step);
  };

  /* ---------- tools on the wall ---------- */
  add('hay-fork-rack', 'hay fork rack pitchfork rake scythe farm tools wall pegs', {
    w: 26, h: 38,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 14, 24, 15, OAK); // the rail
      dots(c, C.iron, [2, 14, 23, 14]);
      if (!u) {
        c.col(5, 7, b, PINE); // pitchfork
        c.col(4, 1, 7, C.steel);
        c.col(6, 1, 7, C.iron);
        c.row(7, 4, 6, C.iron);
      } else dots(c, OAK, [4, 13, 6, 13]); // its pegs bare
      c.col(12, 4, b, PINE); // hay rake
      c.rect(8, 3, 16, 4, PINE);
      c.row(3, 8, 16, L(PINE));
      for (let x = 8; x <= 16; x += 2) c.set(x, 5, D(PINE));
      c.line(20, 5, 19, b, PINE); // scythe
      c.line(20, 5, 21, 3, PINE);
      c.poly([[21, 3], [24, 2], [17, 1], [14, 2]], C.steel);
      c.row(1, 16, 22, L(C.steel));
      c.set(18, 16, D(PINE)); // grips
      c.set(21, 22, D(PINE));
      c.rect(11, 13, 13, 13, OAK);
      c.rect(19, 13, 21, 13, OAK);
      if (u) {
        dots(c, C.blood, [15, 2, 16, 2, 17, 2, 15, 4, 16, 6]); // the scythe has been used, and not on hay
        c.set(15, 9, C.blood);
      }
    },
    sw: 8, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 14, 2, 15, OAK);
      c.set(1, 14, L(OAK));
      c.line(3, 4, 4, b, PINE);
      c.set(3, 3, PINE);
      c.rect(3, 1, 5, 2, C.steel); // the scythe blade coming out at us
      c.set(6, 2, C.steel);
      if (!u) {
        c.line(4, 7, 6, b, PINE);
        c.col(4, 1, 6, C.iron);
      } else {
        c.set(5, 3, C.blood);
        c.set(5, 6, C.blood);
      }
    },
  });
  add('herbs-drying-rack', 'herbs drying bunches hanging rail lavender sage onions garlic', {
    w: 28, h: 17,
    f(c, u) {
      board(c, 1, 2, 26, 3, OAK);
      c.set(3, 1, C.parchment);
      c.set(24, 1, C.parchment);
      const bunch = (x, col, hi, n = 9) => {
        c.col(x + 1, 4, 5, C.parchment);
        c.rect(x, 6, x + 2, 4 + n, col);
        c.rect(x - 1, 8, x + 3, 3 + n, col);
        dots(c, hi, [x, 7, x + 2, 9, x - 1, 10, x + 1, 12, x + 3, 11, x + 1, 4 + n]);
        c.set(x + 1, 6, C.parchment);
      };
      const cut = (x) => {
        c.col(x + 1, 4, 6, C.parchment); // only the string left
        c.set(x, 7, C.parchment);
      };
      bunch(3, hex('#5a6a4a'), hex('#7a8a5a'));
      u ? cut(8) : bunch(8, hex('#6a6a8a'), hex('#8a7aa8'), 10);
      bunch(13, hex('#6a6236'), hex('#8a8048'), 8);
      u ? cut(18) : bunch(18, hex('#4a6a4a'), hex('#6a8a5a'));
      for (let y = 5; y <= 13; y += 3) {
        c.rect(23, y, 24, y + 1, hex('#b08a4a')); // a string of onions
        c.set(23, y, hex('#c8a868'));
      }
      c.col(24, 4, 4, C.parchment);
      c.set(24, 15, C.parchment);
    },
    sw: 7, sh: 17,
    s(c, u) {
      c.rect(2, 2, 4, 3, OAK);
      c.set(2, 2, L(OAK));
      c.col(3, 4, 5, C.parchment);
      if (!u) {
        c.rect(2, 6, 4, 13, hex('#6a6a8a'));
        c.rect(1, 8, 5, 12, hex('#6a6a8a'));
        dots(c, hex('#8a7aa8'), [2, 7, 4, 9, 1, 10, 3, 12]);
      } else {
        c.rect(2, 6, 4, 11, hex('#6a6236'));
        dots(c, hex('#8a8048'), [2, 7, 4, 9]);
      }
    },
  });

  /* ---------- hens and bees ---------- */
  const hen = (c, x, yb, right = true) => {
    const X = (i) => (right ? x + i : x - i),
      f = hex('#7a4a2c');
    c.rect(Math.min(X(0), X(3)), yb - 3, Math.max(X(0), X(3)), yb - 1, f);
    c.set(X(-1), yb - 4, f); // tail
    c.set(X(3), yb - 4, f);
    c.set(X(4), yb - 5, f); // head
    c.set(X(4), yb - 6, C.red);
    c.set(X(5), yb - 5, C.mustard);
    c.set(X(1), yb - 2, hex('#9a6a3c'));
    c.set(X(1), yb, C.mustard);
    c.set(X(2), yb, C.mustard);
  };
  add('hen-coop-ramp', 'hen coop chicken house henhouse ramp pop hole eggs poultry', {
    w: 26, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      planks(c, 2, 8, 21, 18, GREYW, 4);
      c.poly([[1, 8], [2, 3], [21, 3], [22, 8]], hex('#3a3438')); // tarred roof
      c.row(3, 2, 21, hex('#5a5258'));
      c.row(8, 1, 22, hex('#2a2428'));
      legs(c, [3, 19], 19, b, OAK);
      c.rect(3, 11, 7, 14, mix(GREYW, 0.8)); // nest box lid
      c.frame(3, 11, 7, 14, D(GREYW));
      c.poly([[9, 19], [14, 19], [16, b], [7, b]], PINE); // the ramp, coming towards us
      for (let y = 20; y < b; y += 2) c.row(y, 8, 15, D(PINE));
      if (!u) {
        c.rect(9, 11, 14, 18, OAK); // the slide down
        c.row(11, 9, 14, L(OAK));
        c.col(11, 6, 10, C.parchment); // its cord
      } else {
        c.rect(9, 12, 14, 18, SOOT);
        c.rect(10, 11, 13, 11, SOOT);
        c.rect(9, 5, 14, 10, OAK); // slide up
        c.row(5, 9, 14, L(OAK));
        hen(c, 10, b - 1);
        c.rect(19, b - 1, 20, b, CHINA); // an egg
        c.set(19, b - 1, C.white);
        dots(c, STRAW, [5, b, 17, b - 1, 22, b]);
      }
    },
    sw: 22, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      planks(c, 2, 8, 13, 18, GREYW, 4);
      c.poly([[1, 9], [1, 6], [14, 3], [15, 5], [15, 8]], hex('#3a3438'));
      c.line(1, 6, 14, 3, hex('#5a5258'));
      legs(c, [3, 11], 19, b, OAK);
      c.line(14, 18, 20, b, PINE); // the ramp, going down to the right
      c.line(14, 19, 19, b, D(PINE));
      c.col(14, 11, 18, u ? SOOT : OAK);
      if (u) {
        hen(c, 15, b - 3);
        c.set(21, b, CHINA);
        c.col(14, 5, 10, OAK);
      }
    },
  });
  const skep = (c, x, yb) => {
    for (let i = 0; i < 8; i++) {
      const w = [7, 7, 7, 7, 5, 5, 3, 1][i],
        x0 = x + ((7 - w) >> 1);
      c.row(yb - i, x0, x0 + w - 1, i % 2 ? D(STRAW) : STRAW);
      c.set(x0, yb - i, L(STRAW));
    }
    c.set(x + 3, yb, SOOT);
    c.set(x + 3, yb - 1, SOOT);
  };
  add('bee-skeps-bench', 'bee skeps straw hives bench bees honey apiary', {
    w: 30, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 6, 28, b - 5, GREYW);
      c.rect(3, b - 4, 6, b, C.stone);
      c.rect(23, b - 4, 26, b, C.stone);
      c.row(b - 4, 3, 6, C.stoneLight);
      c.row(b - 4, 23, 26, C.stoneLight);
      skep(c, 2, b - 7);
      skep(c, 11, b - 7);
      if (!u) {
        skep(c, 20, b - 7);
        dots(c, K, [10, 4, 19, 6]);
        dots(c, C.mustard, [9, 4, 20, 6]);
      } else {
        for (let i = 0; i < 8; i++) {
          const h = [7, 7, 7, 7, 5, 5, 3, 1][i]; // one tipped off the bench, the comb torn out
          c.col(19 + i, b - 3 + ((7 - h) >> 1) - 3, b - 3 + ((7 - h) >> 1) - 3 + h - 1, i % 2 ? D(STRAW) : STRAW);
        }
        c.rect(16, b - 5, 18, b, hex('#3a3020'));
        c.rect(14, b - 1, 17, b, C.gold);
        dots(c, C.flameLight, [15, b - 1, 17, b]);
        const r = rnd(4);
        for (let i = 0; i < 16; i++) {
          const x = 12 + Math.round(r() * 16),
            y = 1 + Math.round(r() * 11);
          c.set(x, y, i % 3 ? K : C.mustard);
        }
      }
    },
    sw: 13, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 6, 11, b - 5, GREYW);
      c.rect(3, b - 4, 9, b, C.stone);
      c.row(b - 4, 3, 9, C.stoneLight);
      if (!u) {
        skep(c, 2, b - 7);
        dots(c, K, [10, 5]);
      } else {
        c.rect(10, b - 5, 12, b, STRAW);
        c.col(11, b - 5, b, D(STRAW));
        c.rect(12, b - 1, 14, b, C.gold);
        const r = rnd(7);
        for (let i = 0; i < 9; i++) c.set(4 + Math.round(r() * 9), 1 + Math.round(r() * 9), i % 3 ? K : C.mustard);
      }
    },
    su: [0, 0, 3],
  });

  /* ---------- light ---------- */
  add('lantern-storm-tin', 'lantern storm lantern tin oil lamp candle barn light', {
    w: 10, h: 16,
    f(c, u) {
      const b = c.h - 2;
      c.frame(3, 1, 6, 3, C.iron); // ring
      c.clear(4, 2);
      c.clear(5, 2);
      c.poly([[2, 6], [4, 4], [5, 4], [7, 6]], TIN);
      c.rect(2, 7, 7, b - 2, u ? C.flameLight : hex('#3f4a50'));
      c.col(2, 7, b - 2, TIN);
      c.col(7, 7, b - 2, D(TIN));
      c.col(4, 7, b - 2, u ? C.flame : TIN);
      if (u) {
        c.rect(5, 9, 6, 11, C.white);
        c.set(3, 10, C.white);
        dots(c, C.glow, [1, 9, 8, 10, 0, 11, 9, 8]);
      }
      c.rect(1, b - 1, 8, b, TIN);
      c.row(b - 1, 1, 8, L(TIN));
      c.set(2, b, C.rust);
    },
  });
  add('rushlight-holder', 'rushlight holder iron nip candle rush light poor light', {
    w: 9, h: 16,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 2, 6, b, OAK); // a block of wood
      c.row(b - 2, 2, 6, L(OAK));
      c.col(4, 6, b - 3, C.iron);
      c.set(3, 6, C.iron);
      c.set(5, 7, C.iron);
      c.line(2, 8, 6, 3, u ? hex('#8a8a5a') : hex('#b0a878')); // the rush in its nip
      if (u) {
        c.set(7, 2, C.flame);
        c.set(7, 1, C.flameLight);
        c.set(6, 3, K);
        wisp(c, 7, 0, 2, C.ash);
        c.set(3, b - 3, hex('#b0a878')); // a drip of fat
      }
    },
    u: [0, 2, 0],
  });

  /* ---------- the dairy ---------- */
  add('cheese-press-stone', 'cheese press stone weight screw wooden dairy whey', {
    w: 20, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2,
        d = u ? 3 : 0,
        whey = hex('#c9c39a');
      for (const x of [2, 13]) {
        c.rect(x, 3, x + 1, b, OAK);
        c.col(x, 3, b, L(OAK));
      }
      board(c, 1, 4, 16, 6, OAK);
      c.rect(8, 1, 9, 9 + d, PINE); // the screw
      for (let y = 7; y < 9 + d; y += 2) c.set(8, y, D(PINE));
      c.row(2, 5, 12, OAK); // its bar
      c.rect(5, 10 + d, 12, 14 + d, C.stone); // the stone
      c.row(10 + d, 5, 12, C.stoneLight);
      dots(c, C.stoneDark, [7, 12 + d, 10, 13 + d]);
      c.rect(6, 18, 11, 21, PINE); // the vat
      c.rect(6, u ? 18 : 16, 11, 17, CHINA); // the cheese in its cloth
      c.row(19, 6, 11, C.iron);
      board(c, 2, 22, 15, 23, PINE);
      c.rect(4, 24, 5, b, OAK);
      c.rect(10, 24, 11, b, OAK);
      c.set(16, 23, PINE); // the lip the whey runs off
      c.poly([[14, b - 4], [18, b - 4], [17, b], [15, b]], TIN);
      c.row(b - 4, 14, 18, L(TIN));
      if (u) {
        c.set(16, 24, whey);
        c.set(16, b - 6, whey);
        c.row(b - 4, 15, 17, whey);
        dots(c, whey, [5, 20, 12, 21, 12, 22]);
        c.row(17, 5, 12, CHINA);
      }
    },
    sw: 14, sh: 30,
    s(c, u) {
      const b = c.h - 2,
        d = u ? 3 : 0,
        whey = hex('#c9c39a');
      c.rect(4, 3, 7, b, OAK);
      c.col(4, 3, b, L(OAK));
      c.rect(3, 4, 8, 6, OAK);
      c.row(4, 3, 8, L(OAK));
      c.rect(5, 1, 6, 3, PINE);
      c.row(2, 5, 6, OAK);
      c.rect(3, 10 + d, 8, 14 + d, C.stone);
      c.row(10 + d, 3, 8, C.stoneLight);
      c.rect(3, 18, 8, 21, PINE);
      c.rect(3, u ? 18 : 16, 8, 17, CHINA);
      board(c, 2, 22, 10, 23, PINE);
      c.rect(3, 24, 4, b, OAK);
      c.rect(7, 24, 8, b, OAK);
      c.poly([[8, b - 4], [12, b - 4], [11, b], [9, b]], TIN);
      c.row(b - 4, 8, 12, L(TIN));
      if (u) {
        c.set(10, 24, whey);
        c.set(10, b - 6, whey);
        c.row(b - 4, 9, 11, whey);
      }
    },
  });
  const dolly = (end) => (c, u) => {
    const b = c.h - 2;
    c.poly([[2, 14], [13, 14], [12, b], [3, b]], OAK);
    c.line(2, 14, 3, b, L(OAK));
    for (const x of [5, 8, 10]) c.col(x, 15, b, D(OAK));
    c.row(17, 2, 13, C.iron);
    c.row(b - 2, 3, 12, C.iron);
    c.row(13, 2, 13, L(OAK));
    c.row(14, 3, 12, u ? C.white : hex('#4a5a64'));
    const tx = u ? 2 : 0; // the dolly, leaning when it has been worked
    c.line(7, 13, 7 + tx, 3, PINE);
    c.line(8, 13, 8 + tx, 3, D(PINE));
    if (end) c.rect(7 + tx, 2, 8 + tx, 3, PINE);
    else c.row(3, 4 + tx, 11 + tx, PINE), c.row(2, 4 + tx, 11 + tx, L(PINE));
    if (u) {
      dots(c, C.white, [3, 13, 5, 12, 10, 13, 12, 12, 6, 13, 2, 16, 3, 18, 1, b, 2, b]); // suds
      dots(c, C.ghost, [4, 13, 11, 13, 2, 19]);
      c.poly([[10, 13], [13, 13], [14, 21], [11, 20]], BLUE); // a shirt over the rim
      c.col(12, 14, 20, D(BLUE));
    }
  };
  add('washing-dolly-tub', 'washing dolly tub peg posser wash day laundry wooden tub suds', {
    w: 16, h: 26, solid: true,
    f: dolly(false),
    sw: 16, sh: 26,
    s: dolly(true),
  });
  add('dairy-shelf-pans', 'dairy shelf cream pans milk setting pans slate slab skimmer', {
    w: 30, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2,
        cream = hex('#d8d0a8');
      board(c, 1, 9, 28, 10, hex('#5f646c')); // slate slab
      stones(c, 3, 11, 7, b, WHITEW, 4, 6, 2);
      stones(c, 22, 11, 26, b, WHITEW, 4, 6, 3);
      const pan = (x, full) => {
        c.poly([[x, 6], [x + 8, 6], [x + 7, 8], [x + 1, 8]], EARTHEN);
        c.row(6, x, x + 8, L(EARTHEN));
        c.row(5, x + 1, x + 7, full ? cream : hex('#b9c0c0'));
        if (full) c.set(x + 2, 5, C.white);
      };
      pan(2, true);
      pan(11, !u);
      pan(20, true);
      c.rect(11, b - 4, 17, b, EARTHEN); // a crock under the slab
      c.row(b - 5, 12, 16, L(EARTHEN));
      c.row(b - 2, 11, 17, D(EARTHEN));
      if (!u) c.line(8, 4, 11, 2, TIN), c.set(8, 5, TIN); // skimmer
      else {
        c.rect(13, b - 6, 15, b - 6, cream); // the cream skimmed off into it
        c.line(16, b - 6, 19, b - 9, TIN);
        dots(c, cream, [10, 9, 10, 12, 19, 10]);
        // (and the cat has been at the third pan)
        c.set(22, 5, hex('#b9c0c0'));
        c.set(23, 5, hex('#b9c0c0'));
        c.set(21, 9, cream);
      }
    },
    sw: 13, sh: 20,
    s(c, u) {
      const b = c.h - 2,
        cream = hex('#d8d0a8');
      board(c, 1, 9, 11, 10, hex('#5f646c'));
      stones(c, 2, 11, 9, b, WHITEW, 4, 6, 2);
      c.poly([[2, 6], [10, 6], [9, 8], [3, 8]], EARTHEN);
      c.row(6, 2, 10, L(EARTHEN));
      c.row(5, 3, 9, u ? hex('#b9c0c0') : cream);
      if (u) dots(c, cream, [11, 9, 11, 12]);
    },
  });
  add('milk-pails-yoke', 'milk pails yoke buckets shoulder yoke dairy milkmaid', {
    w: 34, h: 16,
    f(c, u) {
      const b = c.h - 2,
        milk = hex('#dcd8c8');
      const pail = (x) => {
        c.poly([[x, b - 7], [x + 8, b - 7], [x + 7, b], [x + 1, b]], PINE);
        c.line(x, b - 7, x + 1, b, L(PINE));
        c.row(b - 5, x, x + 8, C.iron);
        c.row(b - 1, x + 1, x + 7, C.iron);
        c.row(b - 8, x + 1, x + 7, milk);
        c.set(x, b - 8, PINE);
        c.set(x + 8, b - 8, D(PINE));
      };
      pail(3);
      if (!u) {
        pail(22);
        c.poly([[1, 3], [13, 4], [16, 2], [19, 4], [32, 3], [32, 4], [19, 6], [16, 4], [13, 6], [1, 4]], OAK); // the yoke across them
        c.line(1, 3, 13, 4, L(OAK));
        c.col(7, 5, b - 9, C.iron);
        c.col(26, 5, b - 9, C.iron);
      } else {
        c.rect(21, b - 8, 30, b, PINE); // one kicked over
        c.col(21, b - 8, b, L(PINE));
        c.col(23, b - 8, b, C.iron);
        c.col(29, b - 8, b, C.iron);
        c.col(31, b - 7, b - 1, SOOT);
        c.rect(12, b, 20, b, milk); // and the milk gone over the floor
        c.rect(14, b - 1, 19, b - 1, milk);
        dots(c, C.white, [15, b - 1, 18, b]);
        c.poly([[2, 5], [14, 2], [17, 1], [19, 3], [20, 3], [18, 5], [15, 4], [3, 7]], OAK);
        c.line(2, 5, 14, 2, L(OAK));
      }
    },
    sw: 12, sh: 16,
    s(c, u) {
      const b = c.h - 2,
        milk = hex('#dcd8c8');
      if (!u) {
        c.poly([[1, b - 7], [9, b - 7], [8, b], [2, b]], PINE);
        c.line(1, b - 7, 2, b, L(PINE));
        c.row(b - 5, 1, 9, C.iron);
        c.row(b - 1, 2, 8, C.iron);
        c.row(b - 8, 2, 8, milk);
        c.rect(4, 2, 6, 5, OAK); // the yoke, end on
        c.set(4, 2, L(OAK));
        c.col(5, 6, b - 9, C.iron);
      } else {
        c.oval(1, b - 8, 9, b, PINE); // the pail on its side, mouth towards us
        c.oval(2, b - 7, 8, b - 1, SOOT);
        c.row(b - 1, 3, 7, milk);
        c.rect(2, b, 11, b, milk);
        c.set(6, b, C.white);
      }
    },
    su: [0, 0, 2],
  });
  add('crocks-pickling', 'crocks earthenware jars pickling stoneware pots salt glaze storage', {
    w: 22, h: 15,
    f(c, u) {
      const b = c.h - 2,
        up = hex('#b9a888'),
        lo = hex('#7a5236');
      const crock = (x, w, h, lid) => {
        c.rect(x, b - h + 1, x + w - 1, b, lo);
        c.rect(x, b - h + 1, x + w - 1, b - (h >> 1), up);
        c.col(x, b - h + 1, b, L(up));
        c.col(x + w - 1, b - h + 1, b, D(lo));
        if (lid) {
          c.rect(x - 1, b - h - 1, x + w, b - h, CHINA); // cloth tied over
          c.row(b - h + 1, x, x + w - 1, C.parchment);
        } else c.row(b - h, x, x + w - 1, SOOT);
      };
      crock(2, 6, 10, true);
      crock(9, 5, 7, !u);
      crock(15, 5, 9, true);
      if (u) {
        c.rect(10, b - 7, 12, b - 7, hex('#c9c39a')); // pickled eggs
        c.rect(7, b, 8, b, CHINA); // its cloth on the floor
        c.line(16, b - 6, 18, b - 2, K); // and one has cracked
        c.set(18, b - 1, hex('#8a9a5a'));
        c.rect(17, b, 20, b, hex('#8a9a5a'));
      }
    },
    sw: 14, sh: 15,
    s(c, u) {
      const b = c.h - 2,
        up = hex('#b9a888'),
        lo = hex('#7a5236');
      c.rect(2, b - 9, 7, b, lo);
      c.rect(2, b - 9, 7, b - 5, up);
      c.col(2, b - 9, b, L(up));
      c.rect(1, b - 11, 8, b - 10, CHINA);
      c.row(b - 9, 2, 7, C.parchment);
      c.rect(7, b - 6, 11, b, lo);
      c.rect(7, b - 6, 11, b - 3, up);
      c.col(7, b - 6, b, L(up));
      if (!u) c.rect(6, b - 8, 12, b - 7, CHINA);
      else {
        c.row(b - 7, 7, 11, SOOT);
        c.rect(8, b - 7, 10, b - 7, hex('#c9c39a'));
        c.rect(11, b, 12, b, CHINA);
      }
    },
  });

  /* ---------- water ---------- */
  add('well-windlass-bucket', 'well windlass bucket stone well rope roof draw water', {
    w: 30, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[1, 7], [14, 1], [15, 1], [28, 7]], hex('#5a4a3c')); // little roof
      c.line(1, 7, 14, 1, hex('#7a6650'));
      for (let x = 4; x < 27; x += 3) c.set(x, 6, hex('#3a2c24'));
      for (let x = 7; x < 24; x += 3) c.set(x, 4, hex('#3a2c24'));
      for (const x of [4, 24]) {
        c.rect(x, 8, x + 1, 24, OAK);
        c.col(x, 8, 24, L(OAK));
      }
      c.rect(6, 12, 23, 14, PINE); // the roller
      c.row(12, 6, 23, L(PINE));
      for (let x = 11; x <= 18; x++) c.col(x, 12, 14, x % 2 ? STRAW : D(STRAW)); // rope wound on it
      c.rect(26, 13, 27, 13, C.iron); // crank
      c.col(27, u ? 13 : 9, u ? 17 : 13, C.iron);
      c.set(28, u ? 17 : 9, PINE);
      stones(c, 3, 24, 26, b, C.stone, 4, 7, 5);
      c.row(23, 2, 27, C.stoneLight);
      c.row(24, 4, 25, SOOT);
      dots(c, C.moss, [4, b, 5, b - 1, 9, b, 22, b - 2, 25, b, 3, 27, 26, 29]);
      const bucket = (x, y, full) => {
        c.poly([[x, y], [x + 5, y], [x + 4, y + 5], [x + 1, y + 5]], OAK);
        c.col(x, y, y + 1, L(OAK));
        c.row(y + 1, x, x + 5, C.iron);
        c.row(y + 4, x + 1, x + 4, C.iron);
        c.row(y, x + 1, x + 4, full ? WAT : SOOT);
      };
      if (!u) {
        c.col(14, 15, 16, STRAW);
        c.line(12, 18, 14, 16, C.iron); // bail
        c.line(17, 18, 15, 16, C.iron);
        bucket(12, 18, false);
      } else {
        c.line(14, 15, 20, 17, STRAW); // drawn up full and stood on the wall
        bucket(18, 18, true);
        c.set(20, 18, C.white);
        c.col(22, 23, 28, WAT);
        dots(c, WAT, [19, 24, 19, 26, 23, 30]);
        c.rect(20, b, 27, b, WAT);
      }
    },
    sw: 20, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 6, 18, 7, hex('#5a4a3c')); // the roof, along its slope
      c.rect(1, 1, 18, 5, hex('#5a4a3c'));
      c.row(1, 1, 18, hex('#7a6650'));
      for (let y = 3; y <= 6; y += 2) for (let x = 2 + (y % 4); x < 18; x += 3) c.set(x, y, hex('#3a2c24'));
      c.rect(8, 8, 10, 24, OAK);
      c.col(8, 8, 24, L(OAK));
      c.oval(7, 11, 11, 15, PINE); // roller, end on
      c.set(9, 13, C.iron);
      c.line(9, 13, u ? 12 : 13, u ? 16 : 10, C.iron); // the crank
      c.set(u ? 13 : 14, u ? 17 : 10, PINE);
      stones(c, 2, 24, 16, b, C.stone, 4, 7, 6);
      c.row(23, 1, 17, C.stoneLight);
      dots(c, C.moss, [3, b, 4, b - 1, 14, b, 15, b - 3]);
      if (u) {
        c.poly([[11, 18], [16, 18], [15, 23], [12, 23]], OAK);
        c.row(19, 11, 16, C.iron);
        c.row(18, 12, 15, WAT);
        c.col(17, 23, 28, WAT);
        c.rect(15, b, 19, b, WAT);
      }
    },
  });

  /* ---------- seats and cupboards ---------- */
  add('rocking-chair-shawl', 'rocking chair shawl grandmother rocker wooden fireside', {
    w: 20, h: 26, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.line(4, 15, 2, 3, OAK); // the back, leaning
      c.line(5, 15, 3, 3, OAK);
      c.set(2, 2, L(OAK));
      dots(c, D(OAK), [5, 6, 5, 9, 6, 12]);
      c.rect(4, 15, 14, 16, OAK); // seat
      c.row(15, 4, 14, L(OAK));
      c.row(11, 5, 13, OAK); // arm
      c.col(13, 12, 14, OAK);
      c.col(5, 17, b - 1, OAK);
      c.col(13, 17, b - 1, OAK);
      c.row(b, 4, 14, OAK); // the rocker
      c.rect(2, b - 1, 4, b - 1, OAK);
      c.rect(14, b - 1, 16, b - 1, OAK);
      c.set(1, b - 2, OAK);
      c.set(17, b - 2, OAK);
      if (!u) {
        cloth(c, [[1, 3], [5, 2], [7, 10], [6, 15], [2, 14]], MADDER, [[3, 4, 4, 13]]); // her shawl over the back
        dots(c, hex('#a86a50'), [2, 15, 4, 16, 6, 16]);
        c.line(1, 3, 5, 2, L(MADDER));
      } else {
        c.rect(0, b - 1, 6, b, MADDER); // slid off behind; the chair still going
        c.row(b - 2, 1, 4, MADDER);
        c.row(b - 2, 1, 3, L(MADDER));
        dots(c, hex('#a86a50'), [0, b, 3, b, 6, b]);
        c.rect(8, 13, 10, 14, hex('#b9b09a')); // her knitting on the seat
        c.line(8, 12, 12, 10, C.steel);
        dots(c, C.white, [18, b - 4, 19, b - 6, 18, b - 1]);
      }
    },
    sw: 16, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [2, 12]) {
        c.rect(x, 3, x + 1, b - 1, OAK);
        c.col(x, 3, b - 1, L(OAK));
        c.set(x, 2, L(OAK));
        c.rect(x, b - 1, x + 1, b, D(OAK)); // rocker, end on
      }
      for (const y of [4, 7, 10]) board(c, 4, y, 11, y + 1, OAK);
      c.rect(1, 11, 2, 12, OAK); // arms
      c.rect(13, 11, 14, 12, OAK);
      c.rect(2, 15, 13, 16, OAK);
      c.row(15, 2, 13, L(OAK));
      c.row(b - 4, 4, 11, D(OAK));
      if (!u) {
        cloth(c, [[1, 2], [14, 2], [14, 9], [8, 13], [1, 9]], MADDER, [[4, 3, 5, 10], [10, 3, 9, 11]]);
        c.row(2, 1, 14, L(MADDER));
        dots(c, hex('#a86a50'), [2, 10, 5, 12, 8, 14, 11, 12, 13, 10]);
      } else {
        c.rect(6, 13, 9, 14, hex('#b9b09a'));
        c.line(6, 12, 10, 10, C.steel);
        c.rect(3, b - 1, 12, b, MADDER);
        c.row(b - 1, 4, 11, L(MADDER));
      }
    },
  });
  add('salt-box-wall', 'salt box wall hanging wooden lid kitchen salt', {
    w: 11, h: 15,
    f(c, u) {
      c.rect(2, 1, 8, 5, PINE); // the back, with its hole for the nail
      c.rect(3, 0, 7, 0, PINE);
      c.set(5, 2, SOOT);
      c.row(1, 2, 8, L(PINE));
      face(c, 1, 8, 9, 12, PINE);
      if (!u) {
        c.rect(1, 5, 9, 7, PINE);
        c.row(5, 1, 9, L(PINE));
        c.row(7, 1, 9, D(PINE));
      } else {
        c.rect(2, 3, 8, 5, L(PINE)); // lid up
        c.rect(2, 6, 8, 7, C.white);
        c.row(7, 2, 8, D(C.white));
        dots(c, C.white, [4, 9, 3, 12, 0, 13, 6, 13]);
      }
    },
    sw: 8, sh: 15,
    s(c, u) {
      c.rect(1, 1, 2, 12, PINE);
      c.col(1, 1, 12, L(PINE));
      c.poly([[3, 6], [6, 8], [6, 12], [3, 12]], PINE);
      if (!u) c.line(2, 5, 7, 7, D(PINE));
      else {
        c.col(3, 2, 5, L(PINE));
        c.line(3, 6, 6, 7, C.white);
        dots(c, C.white, [7, 10, 7, 13]);
      }
    },
    su: [0, 0, 1],
  });
  add('corner-cupboard-painted', 'corner cupboard painted blue green crockery jugs kitchen tall', {
    w: 18, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, 4, 15, b, PAINT);
      c.rect(1, 2, 16, 3, PAINT);
      c.row(2, 1, 16, L(PAINT));
      c.row(22, 2, 15, D(PAINT));
      panel(c, 4, 25, 13, b - 2, PAINT);
      dots(c, C.iron, [3, 27, 3, 33, 13, 29]);
      dots(c, PINE, [6, b - 1, 11, 24, 3, b - 4, 14, 30, 9, 3]); // paint worn to the wood
      if (!u) {
        panel(c, 4, 6, 13, 20, PAINT);
        c.rect(6, 8, 11, 8, D(PAINT));
        dots(c, C.iron, [3, 8, 3, 17, 13, 13]);
        dots(c, PINE, [5, 19, 12, 7]);
      } else {
        hollow(c, 4, 6, 13, 20, PAINT);
        c.col(3, 6, 20, L(PAINT)); // door open
        for (const y of [10, 15, 20]) c.row(y, 4, 13, L(PAINT));
        c.rect(5, 7, 7, 9, EARTHEN); // jug
        c.set(8, 8, EARTHEN);
        c.rect(10, 8, 12, 9, CHINA);
        c.rect(5, 13, 8, 14, CHINA); // bowls
        c.row(13, 5, 8, hex('#4f6a9a'));
        c.rect(11, 11, 12, 14, hex('#4a6a5a')); // a bottle of physic
        c.set(11, 10, C.parchment);
        c.rect(5, 17, 8, 19, TIN); // the money tin, open and empty
        c.row(16, 5, 8, L(TIN));
        c.rect(6, 18, 7, 18, SOOT);
        c.set(11, 19, C.brass);
      }
    },
    sw: 11, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 2, 4, 8, 21, PAINT);
      cabSide(c, 2, 22, 8, b, PAINT);
      c.rect(1, 2, 9, 3, PAINT);
      c.row(2, 1, 9, L(PAINT));
      dots(c, PINE, [4, b - 1, 7, 12]);
      if (u) {
        doorOut(c, 9, 6, 20, 9, PAINT);
        c.set(16, 13, C.iron);
      }
    },
    su: [0, 0, 9],
  });
  add('bench-form-plain', 'bench form plank seat long plain wooden school kitchen', {
    w: 30, h: 11, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        board(c, 1, 2, 28, 3, PINE);
        for (const x of [4, 23]) {
          c.rect(x, 4, x + 2, b, OAK);
          c.col(x, 4, b, L(OAK));
        }
        c.row(6, 7, 22, D(OAK));
      } else {
        c.line(1, 2, 28, 6, PINE); // a leg gone from under it
        c.line(1, 3, 28, 7, D(PINE));
        c.line(1, 1, 28, 5, L(PINE));
        c.rect(4, 4, 6, b, OAK);
        c.col(4, 4, b, L(OAK));
        c.rect(21, b - 1, 26, b, OAK); // the leg on the floor
        c.row(b - 1, 21, 26, L(OAK));
        c.set(23, 7, hex('#b89a6a'));
      }
    },
    sw: 10, sh: 11,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, u ? 4 : 2, 8, u ? 5 : 3, PINE);
      if (!u) {
        c.rect(2, 4, 7, b, OAK);
        c.col(2, 4, b, L(OAK));
        c.clear(4, b);
        c.clear(5, b);
        c.clear(4, b - 1);
        c.clear(5, b - 1);
      } else {
        c.rect(2, b - 1, 7, b, OAK);
        c.row(b - 1, 2, 7, L(OAK));
        dots(c, hex('#b89a6a'), [3, 6, 6, 6]);
      }
    },
  });
  add('cobblers-bench-last', 'cobblers bench shoemaker last boots hammer leather mending', {
    w: 28, h: 18, solid: true,
    f(c, u) {
      const b = c.h - 2,
        lea = hex('#4a3428');
      board(c, 1, 8, 26, 9, OAK);
      legs(c, [3, 23], 10, b, OAK);
      c.row(13, 5, 22, D(OAK));
      c.rect(15, 5, 26, 7, OAK); // the tray of nails and tools
      c.rect(16, 6, 25, 7, hex('#3a2c24'));
      dots(c, C.steel, [17, 7, 19, 6, 22, 7, 24, 6]);
      c.rect(2, 6, 9, 7, hex('#6a4a34')); // the leather seat
      c.col(12, 2, 7, C.iron); // the iron last
      c.rect(10, 1, 14, 2, C.iron);
      c.row(1, 10, 14, C.steel);
      if (!u) {
        c.rect(19, b - 4, 21, b, lea); // a pair of boots waiting
        c.rect(19, b - 1, 23, b, lea);
        c.rect(14, b - 3, 16, b, lea);
        c.rect(14, b - 1, 18, b, lea);
        c.set(19, b - 4, L(lea));
        c.line(4, 5, 8, 3, PINE); // hammer
        c.rect(8, 2, 9, 4, C.iron);
      } else {
        c.rect(10, -1, 14, 0, lea); // a boot on the last, sole up, half nailed
        c.rect(13, -4, 14, -1, lea);
        c.row(-1, 10, 14, hex('#8a6a44'));
        dots(c, C.steel, [10, -1, 12, -1]);
        c.rect(19, b - 4, 21, b, lea);
        c.rect(19, b - 1, 23, b, lea);
        c.line(18, 5, 22, 2, PINE); // the hammer put down across the tray
        c.rect(22, 1, 23, 3, C.iron);
        dots(c, C.steel, [8, b, 11, b, 13, b - 1]);
      }
    },
    u: [0, 4, 0],
    sw: 13, sh: 18,
    s(c, u) {
      const b = c.h - 2,
        lea = hex('#4a3428');
      board(c, 1, 8, 11, 9, OAK);
      legs(c, [2, 9], 10, b, OAK);
      c.rect(3, 5, 10, 7, OAK);
      c.col(6, 2, 4, C.iron);
      c.rect(5, 1, 7, 2, C.iron);
      c.row(1, 5, 7, C.steel);
      if (!u) {
        c.rect(5, b - 4, 7, b, lea);
        c.set(5, b - 4, L(lea));
      } else {
        c.rect(5, -1, 7, 0, lea);
        c.rect(5, -4, 7, -2, lea);
        c.row(-1, 5, 7, hex('#8a6a44'));
        c.rect(5, b - 4, 7, b, lea);
        c.set(10, b, C.steel);
      }
    },
    su: [0, 4, 0],
  });
  add('grindstone-treadle', 'grindstone treadle sharpening wheel stone whetstone knives sparks', {
    w: 24, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.oval(5, 3, 17, 15, C.stone);
      c.oval(7, 5, 15, 13, C.stoneLight);
      c.oval(8, 6, 14, 12, C.stone);
      dots(c, C.stoneDark, [9, 8, 12, 10, 13, 7, 8, 11]);
      c.rect(10, 8, 12, 10, C.iron); // axle
      c.set(11, 9, C.steel);
      c.line(11, 9, u ? 14 : 8, u ? 13 : 5, C.iron); // crank
      c.rect(2, 13, 20, 15, OAK); // trough frame
      c.row(13, 2, 20, L(OAK));
      c.rect(6, 14, 16, 14, hex('#4a5a64'));
      for (const x of [3, 18]) {
        c.line(x, 16, x + (x < 10 ? -1 : 1), b, OAK);
        c.line(x + 1, 16, x + (x < 10 ? 0 : 2), b, D(OAK));
      }
      c.line(u ? 5 : 4, b, 14, u ? b : b - 3, PINE); // the treadle
      c.line(14, u ? b - 1 : b - 3, u ? 14 : 11, 10, C.iron);
      if (u) {
        c.line(15, 4, 21, 1, C.steel); // a blade held to it
        c.rect(21, 0, 22, 1, OAK);
        dots(c, C.flameLight, [16, 5, 18, 6, 19, 8, 17, 8, 20, 5]);
        dots(c, C.flame, [18, 4, 20, 9, 21, 7]);
        dots(c, C.white, [4, 6, 4, 10, 6, 3]);
      }
    },
    u: [0, 1, 0],
    sw: 12, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      c.rect(5, 3, 7, 15, C.stone); // the stone, edge on
      c.col(5, 3, 15, C.stoneLight);
      c.rect(3, 9, 9, 9, C.iron);
      c.col(10, u ? 9 : 6, u ? 12 : 9, C.iron);
      c.rect(2, 13, 10, 15, OAK);
      c.row(13, 2, 10, L(OAK));
      c.col(2, 16, b, OAK);
      c.col(10, 16, b, D(OAK));
      c.rect(5, u ? b : b - 2, 7, b, PINE);
      if (u) {
        c.col(6, 0, 3, C.steel);
        dots(c, C.flameLight, [4, 2, 8, 3, 3, 4]);
        c.set(9, 1, C.flame);
      }
    },
    su: [0, 1, 0],
  });
};
