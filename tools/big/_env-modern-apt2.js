/* Apartment complex, part 2: the yard, the dumped things, the garages. See env-modern.js for obj() and the helpers. */
module.exports = (T, obj) => {
  const { C, hex, mix, blend, rnd, turn, D, L, X, dots, legs, panel, door, hole, scr, led, leds, vents, grille, cable, cord, wisp, puddle, wheel, bottle, cup, cloth, stuff, shoes } = T;
  const STEEL = hex('#8d9094'),
    FRAME = hex('#b3ab94'),
    GRIME = hex('#4a463c'),
    DEAD = hex('#7a6a3a'),
    TICK = hex('#bdb49c'),
    STAIN = hex('#8a7448'),
    DRAB = hex('#7a5c40'),
    CHAR = hex('#221f1c'),
    PLY = hex('#a88c5c'),
    TEALP = hex('#4a6068'),
    MOPED = hex('#8a3a34'),
    CARPET = hex('#6a3c36');
  const can = (c, x, y, col = X.CHR) => {
    c.rect(x, y - 1, x, y, col);
    c.set(x, y - 1, L(col));
  };

  obj('window-box-dead', 'window box planter dead plants geraniums dried stalks balcony', {
    w: 24,
    h: 13,
    p: true,
    f(c, u) {
      const b = 11,
        BOX = hex('#5a4a3a');
      c.box(1, b - 4, 22, b - 1, BOX);
      c.rect(3, b, 4, b, X.GREY); // brackets
      c.rect(19, b, 20, b, X.GREY);
      c.row(b - 5, 2, 21, C.earth);
      const r = rnd(4);
      for (let x = 3; x <= 20; x += 2) {
        if (u && x < 12) continue;
        const h = 2 + ((r() * 4) | 0);
        c.line(x, b - 6, x + ((r() * 3) | 0) - 1, b - 6 - h, r() < 0.3 ? C.leaf : DEAD);
      }
      c.set(16, b - 10, C.red); // one flower will not give up
      c.set(16, b - 9, C.leaf);
      dots(c, C.bone, [9, b - 5, 14, b - 5]); // stubs
      if (u) {
        c.rect(3, b - 7, 9, b - 5, C.earth); // dug over
        c.row(b - 8, 4, 7, D(C.earth));
        c.line(2, b - 6, 1, b - 2, DEAD); // pulled up and thrown over the edge
        c.line(4, b - 7, 2, b - 3, DEAD);
        c.set(7, b - 8, C.gold); // something was buried here
        c.set(6, b - 8, C.bone);
        dots(c, C.earth, [8, b, 11, b]);
      }
    },
    sw: 9,
    sh: 13,
    s(c, u) {
      const b = 11,
        BOX = hex('#5a4a3a');
      c.box(1, b - 4, 7, b - 1, BOX);
      c.rect(1, b, 2, b, X.GREY);
      c.row(b - 5, 2, 6, C.earth);
      if (!u) {
        c.line(3, b - 6, 2, b - 9, DEAD);
        c.line(5, b - 6, 6, b - 10, DEAD);
      } else {
        c.rect(2, b - 7, 6, b - 5, C.earth);
        c.line(7, b - 6, 7, b - 2, DEAD);
        c.set(4, b - 8, C.gold);
      }
      c.set(4, b - 7, C.leaf);
    },
  });

  {
    const side = (c) => {
      const b = 20;
      for (let x = 5; x <= 20; x += 2) c.line(x, 6, x - (x < 12 ? 0 : 1), 14, X.CHR); // the basket
      c.line(4, 5, 21, 7, X.CHR);
      c.line(5, 10, 20, 10, X.CHR);
      c.line(5, 14, 19, 14, STEEL);
      c.line(4, 5, 5, 14, STEEL);
      c.line(21, 7, 19, 14, STEEL);
      c.rect(1, 4, 4, 4, C.red); // handle
      c.line(6, 15, 19, 17, STEEL); // frame
      c.line(6, 15, 6, 18, STEEL);
      c.line(18, 15, 18, 18, STEEL);
      wheel(c, 6, b - 1, 1);
      wheel(c, 18, b - 1, 1);
      c.oval(8, 9, 15, 13, X.BAG); // one bag of somebody's things
      c.set(10, 10, mix(X.BAG, 1.9));
    };
    const front = (c) => {
      const b = 20;
      c.row(4, 1, 12, C.red);
      for (let x = 3; x <= 10; x += 2) c.col(x, 7, 14, X.CHR);
      c.frame(2, 6, 11, 14, STEEL);
      c.row(10, 2, 11, X.CHR);
      c.col(2, 15, 18, STEEL);
      c.col(11, 15, 18, STEEL);
      c.row(16, 2, 11, STEEL);
      wheel(c, 2, b - 1, 1);
      wheel(c, 11, b - 1, 1);
      c.oval(4, 9, 9, 13, X.BAG);
      c.set(5, 10, mix(X.BAG, 1.9));
    };
    obj('shopping-trolley-dumped', 'shopping trolley supermarket cart dumped wire basket tipped over', {
      w: 24,
      h: 22,
      base: 'side',
      U: { own: true, w: 30, h: 26 },
      f(c, u) {
        if (!u) return side(c);
        c.stamp(turn(24, 22, side, true), 0, 1); // on its side
        dots(c, C.paper, [22, 24, 25, 23]);
        can(c, 24, 24);
        can(c, 27, 24, C.red);
        c.oval(21, 19, 27, 22, X.BAG);
        c.set(23, 20, mix(X.BAG, 1.9));
      },
      sw: 14,
      sh: 22,
      SU: { own: true, w: 28, h: 16 },
      s(c, u) {
        if (!u) return front(c);
        c.stamp(turn(14, 22, front, true), 0, 1);
        can(c, 24, 14);
        can(c, 26, 14, C.red);
      },
    });
  }

  {
    const mat = (c, x0, y0, x1, y1) => {
      c.rect(x0, y0, x1, y1, TICK);
      for (let x = x0 + 2; x < x1; x += 3) c.col(x, y0, y1, hex('#7d8fa0'));
      c.frame(x0, y0, x1, y1, D(TICK));
    };
    obj('mattress-dumped-stained', 'mattress dumped stained old mattress leaning against wall springs fly tipping', {
      w: 20,
      h: 38,
      U: { own: true, w: 40, h: 9 },
      f(c, u) {
        if (u) {
          c.rect(1, 3, 38, 7, TICK); // slid down flat
          c.row(3, 1, 38, L(TICK));
          c.row(5, 1, 38, D(TICK));
          for (let x = 3; x < 38; x += 3) c.set(x, 4, hex('#7d8fa0'));
          c.rect(14, 3, 22, 3, STAIN);
          c.rect(26, 2, 27, 2, X.CHR); // a spring through
          c.set(27, 1, X.CHR);
          c.rect(30, 3, 33, 4, CHAR);
          return;
        }
        const b = 36;
        mat(c, 2, 2, 17, b);
        c.oval(5, 10, 13, 20, STAIN);
        c.oval(7, 12, 12, 18, D(STAIN));
        c.oval(9, 22, 14, 26, STAIN);
        c.rect(5, 28, 8, 31, CHAR); // a burn, the springs showing
        dots(c, X.CHR, [6, 29, 7, 30]);
        dots(c, D(TICK), [5, 5, 14, 5, 5, 33, 14, 33, 10, 8]);
        c.clear(2, 2);
        c.clear(17, 2);
      },
      sw: 9,
      sh: 38,
      SU: { own: true, w: 20, h: 9 },
      s(c, u) {
        if (u) {
          c.rect(1, 3, 18, 7, TICK);
          c.row(3, 1, 18, L(TICK));
          c.row(5, 1, 18, D(TICK));
          for (let x = 3; x < 18; x += 3) c.set(x, 4, hex('#7d8fa0'));
          c.rect(8, 3, 12, 3, STAIN);
          return;
        }
        const b = 36;
        for (let y = 2; y <= b; y++) {
          const x = Math.round(1 + ((b - y) * 3) / 34);
          c.rect(x, y, x + 3, y, TICK);
          c.set(x, y, L(TICK));
          c.set(x + 2, y, D(TICK));
        }
        dots(c, STAIN, [5, 12, 5, 13, 4, 20, 4, 21]);
      },
    });
  }

  obj('sofa-dumped-springs', 'sofa dumped old settee springs missing cushion burnt fly tipping yard', {
    w: 36,
    h: 21,
    f(c, u) {
      const b = 19,
        col = DRAB;
      c.rect(4, 3, 31, b - 6, col);
      c.row(3, 5, 30, L(col));
      for (let y = 5; y < b - 8; y += 3) for (let x = 6 + (y % 2) * 2; x < 31; x += 4) c.set(x, y, hex('#8a7a4a')); // a flower pattern, once
      c.rect(4, b - 8, 31, b - 5, col);
      c.row(b - 8, 4, 31, L(col));
      c.rect(14, b - 8, 22, b - 5, C.night); // the middle cushion gone
      cable(c, [[15, b - 5], [16, b - 8], [17, b - 5], [18, b - 8], [19, b - 5], [20, b - 8], [21, b - 5]], X.CHR);
      for (const x of [1, 31]) {
        c.rect(x, b - 11, x + 3, b - 2, col);
        c.rect(x, b - 11, x + 3, b - 10, L(col));
        c.row(b - 9, x, x + 3, D(col));
      }
      c.rect(5, b - 4, 30, b - 2, D(col));
      c.rect(2, b - 1, 3, b, C.woodDark); // one foot left
      c.rect(32, b - 1, 34, b - 1, D(col));
      dots(c, C.white, [2, b - 10, 3, b - 9, 26, 5, 27, 6]); // stuffing
      c.speckle(4, b - 4, 31, b - 2, GRIME, 4, 3);
      if (u) {
        c.rect(23, 3, 31, b - 5, CHAR); // somebody set light to it
        c.rect(31, b - 11, 34, b - 3, CHAR);
        c.speckle(18, 3, 26, b - 5, CHAR, 2, 5);
        dots(c, C.flame, [25, 8, 29, b - 7]);
        dots(c, hex('#5a4a40'), [24, 5, 28, 6, 30, 9, 33, b - 8]);
        wisp(c, 26, 2, 2);
        wisp(c, 30, 2, 2, X.GREY);
      }
    },
    sw: 16,
    sh: 21,
    s(c, u) {
      const b = 19,
        col = u ? CHAR : DRAB;
      c.rect(2, 3, 5, b - 2, col);
      c.col(2, 3, b - 2, L(col));
      c.rect(3, b - 11, 13, b - 2, col);
      c.rect(3, b - 11, 13, b - 10, L(col));
      c.row(b - 9, 3, 13, D(col));
      c.rect(2, b - 1, 3, b, C.woodDark);
      c.rect(11, b - 1, 13, b - 1, D(col));
      dots(c, C.white, [9, b - 10, 10, b - 9]);
      if (u) {
        dots(c, C.flame, [7, b - 6]);
        dots(c, hex('#5a4a40'), [5, 6, 9, b - 5, 11, b - 7]);
        wisp(c, 4, 2, 2);
      }
    },
  });

  obj('tv-dumped-smashed', 'television dumped smashed screen broken tv set fly tipping gutted', {
    w: 20,
    h: 17,
    f(c, u) {
      const b = 15,
        W = hex('#5b4634');
      c.box(1, 2, 17, b, W);
      c.rect(2, 3, 13, b - 1, X.BLK);
      c.rect(3, 4, 12, b - 2, u ? C.night : X.SCR0);
      c.rect(15, 4, 16, 5, u ? X.BLK : X.CHR);
      vents(c, 15, 8, 16, b - 2, D(W));
      c.speckle(1, 2, 17, b, GRIME, 12, 3);
      if (!u) {
        c.poly([[5, 6], [9, 5], [10, 9], [7, 11], [4, 9]], C.night); // a hole kicked in it
        c.line(9, 5, 12, 4, C.glassLight);
        c.line(4, 9, 3, 12, C.glassLight);
        c.line(10, 9, 12, 12, C.glassLight);
        c.line(7, 11, 7, 13, C.glassLight);
        dots(c, C.glassLight, [5, b, 8, b]);
      } else {
        cable(c, [[4, 6], [7, 9], [5, 12]], C.red); // gutted: only the wires
        cable(c, [[9, 5], [10, 10], [12, 12]], C.mustard);
        c.rect(7, 11, 9, 13, X.GREY);
        dots(c, C.glassLight, [3, 4, 12, 4, 3, b - 2, 12, b - 2]);
        dots(c, C.glassLight, [2, b, 5, b, 8, b, 13, b]);
      }
      cable(c, [[17, 11], [18, 14], [17, b]], X.BLK);
    },
    sw: 15,
    sh: 17,
    s(c, u) {
      const b = 15,
        W = hex('#5b4634');
      c.poly([[2, 5], [6, 2], [12, 2], [12, b], [2, b]], W);
      c.col(12, 2, b, L(W));
      vents(c, 3, 7, 6, 11, D(W));
      c.col(13, 4, b - 2, u ? C.night : X.SCR0);
      c.set(13, 7, C.glassLight);
      c.set(13, b, C.glassLight);
      if (u) cable(c, [[13, 6], [13, 10]], C.red);
      c.speckle(2, 4, 12, b, GRIME, 10, 3);
    },
  });

  obj('stray-cat-bowl', 'stray cat bowl saucer of milk tin of cat food feeding the strays', {
    w: 14,
    h: 8,
    p: true,
    f(c, u) {
      const b = 6;
      c.rect(1, b - 1, 7, b, C.white); // the bowl
      c.row(b - 1, 1, 7, C.navy);
      c.clear(1, b);
      c.clear(7, b);
      c.row(b - 2, 2, 6, u ? hex('#8a8c88') : C.white);
      if (!u) {
        c.rect(9, b - 2, 11, b, STEEL); // a tin, its lid bent up
        c.row(b - 1, 9, 11, C.red);
        c.line(9, b - 3, 11, b - 5, STEEL);
      } else {
        c.rect(9, b - 1, 12, b, STEEL); // licked clean, the tin on its side
        c.col(11, b - 1, b, C.red);
        c.set(8, b, hex('#7a5a30'));
        dots(c, GRIME, [3, b - 2, 5, b - 2]);
      }
    },
    sw: 9,
    sh: 8,
    s(c, u) {
      const b = 6;
      c.rect(1, b - 1, 7, b, C.white);
      c.row(b - 1, 1, 7, C.navy);
      c.row(b - 2, 2, 6, u ? hex('#8a8c88') : C.white);
      if (u) dots(c, GRIME, [3, b - 2, 5, b - 2]);
    },
  });

  obj('graffiti-hoarding-board', 'graffiti board plywood hoarding tags spray paint boarded up fence', {
    w: 34,
    h: 27,
    f(c, u) {
      const b = 25;
      legs(c, [2, 30], 3, b, C.wood, 2);
      c.box(1, 4, 32, b - 3, PLY);
      c.col(16, 4, b - 3, D(PLY));
      c.speckle(1, 4, 32, b - 3, mix(PLY, 0.9), 5, 3);
      c.rect(1, b, 4, b, X.CONC);
      c.rect(29, b, 32, b, X.CONC);
      cable(c, [[4, 9], [4, 16], [8, 16]], X.BLK); // old tags
      cable(c, [[10, 9], [8, 12], [12, 12], [10, 16]], X.BLK);
      cable(c, [[14, 9], [14, 16]], X.BLK);
      c.oval(20, 8, 26, 14, C.wine);
      c.oval(21, 9, 25, 13, PLY);
      dots(c, C.wine, [22, 11, 24, 11, 23, 16, 23, 17]);
      c.rect(27, 15, 30, 19, C.paper); // what is left of a poster
      c.row(16, 28, 29, C.red);
      c.clear(30, 19);
      if (u) {
        const NEW = hex('#c8d0c0');
        c.line(5, 6, 28, 19, NEW); // fresh, still running
        c.line(5, 7, 28, 20, NEW);
        c.line(28, 6, 5, 19, NEW);
        c.line(28, 7, 5, 20, NEW);
        c.col(9, 18, 21, NEW);
        c.col(17, 13, 18, NEW);
        c.col(25, 18, 21, NEW);
        c.rect(12, b - 1, 13, b, C.teal); // the can
        c.set(12, b - 2, C.white);
      }
    },
    sw: 11,
    sh: 27,
    s(c, u) {
      const b = 25;
      c.rect(6, 3, 7, b, C.wood);
      c.rect(8, 4, 8, b - 3, PLY);
      c.line(5, 12, 1, b, C.wood); // propped from behind
      c.rect(5, b, 8, b, X.CONC);
      if (u) c.rect(9, b - 1, 9, b, C.teal);
    },
  });

  obj('rubbish-bags-heap', 'rubbish bags heap bin bags black sacks pile refuse rats', {
    w: 24,
    h: 15,
    U: { w: 32, x(c) {
      dots(c, C.paper, [23, 13, 26, 12, 28, 13]);
      c.rect(24, 12, 25, 13, C.rust);
      c.row(13, 20, 22, hex('#7a5a30'));
      c.rect(27, 11, 29, 12, hex('#5a5860')); // a rat at it
      c.set(30, 12, hex('#5a5860'));
      c.set(26, 12, X.PINK);
      c.set(29, 10, hex('#5a5860'));
    } },
    f(c, u) {
      const b = 13,
        bag = (x0, y0, x1, y1) => {
          c.oval(x0, y0, x1, y1 + 2, X.BAG);
          c.set(x0 + 2, y0 + 1, mix(X.BAG, 1.9));
          c.set(x0 + 3, y0 + 1, mix(X.BAG, 1.5));
          c.rect(((x0 + x1) >> 1) - 0, y0 - 1, ((x0 + x1) >> 1) + 1, y0, X.BAG);
        };
      bag(8, 3, 16, 9);
      bag(1, 6, 9, b);
      bag(13, 6, 21, b);
      c.oval(7, 8, 14, b + 2, C.white); // a carrier bag
      c.set(9, 9, C.red);
      c.set(10, 7, C.white);
      c.clearRect(0, b + 1, 23, b + 3);
      if (u) {
        c.poly([[17, 8], [21, 9], [20, b], [16, b]], C.night); // torn open
        dots(c, C.paper, [18, 10, 19, 12]);
        dots(c, C.rust, [17, 11]);
        dots(c, hex('#7a5a30'), [19, b]);
      }
    },
    sw: 15,
    sh: 15,
    s(c, u) {
      const b = 13;
      c.oval(3, 3, 11, 11, X.BAG);
      c.oval(1, 6, 9, b + 2, X.BAG);
      c.oval(7, 7, 13, b + 2, u ? C.night : X.BAG);
      c.set(5, 4, mix(X.BAG, 1.9));
      c.set(3, 8, mix(X.BAG, 1.9));
      c.rect(6, 2, 7, 3, X.BAG);
      c.clearRect(0, b + 1, 14, b + 3);
      if (u) dots(c, C.paper, [9, 10, 11, 12, 12, b]);
    },
  });

  obj('boiler-wall-white', 'boiler wall gas boiler central heating pilot light pipes casing kitchen cupboard', {
    w: 15,
    h: 25,
    p: true,
    f(c, u) {
      const B = X.APW;
      c.rect(6, 1, 8, 2, X.GREY); // flue
      for (const x of [3, 5, 8, 10]) c.col(x, 18, 23, x === 8 ? C.mustard : hex('#a8642e')); // pipes
      c.box(1, 3, 13, 17, B);
      c.rect(2, 14, 12, 16, D(B));
      c.oval(3, 14, 5, 16, X.GREY);
      c.rect(9, 15, 11, 15, X.BLK);
      if (!u) {
        c.rect(6, 10, 8, 11, X.SCR0); // the little window on the pilot light
        c.rect(3, 5, 6, 7, C.paper);
        c.speckle(1, 3, 13, 13, hex('#b8b09a'), 9, 3);
      } else {
        hole(c, 2, 4, 12, 13, hex('#2a2c32')); // the front off
        c.rect(3, 5, 11, 7, hex('#a8642e'));
        vents(c, 3, 5, 11, 7, hex('#7a4a2c'));
        c.oval(8, 8, 11, 11, C.red);
        for (let x = 3; x <= 7; x += 2) c.set(x, 12, X.TUBEL); // burning
        for (let x = 3; x <= 7; x += 2) c.set(x, 11, X.TUBE);
        c.row(13, 3, 8, X.GREY);
        c.set(4, 20, X.WATERL);
      }
    },
    sw: 9,
    sh: 25,
    s(c, u) {
      const B = X.APW;
      c.rect(3, 1, 5, 2, X.GREY);
      c.col(3, 18, 23, hex('#a8642e'));
      c.col(5, 18, 23, hex('#a8642e'));
      c.box(1, 3, 7, 17, B);
      c.col(7, 4, 13, u ? hex('#2a2c32') : D(B));
      if (u) c.set(7, 12, X.TUBEL);
    },
  });

  obj('bench-concrete-yard', 'bench concrete and timber courtyard bench block of flats rough sleeper', {
    w: 34,
    h: 17,
    f(c, u) {
      const b = 15,
        W = hex('#7a6a56');
      for (const x of [3, 27]) {
        c.box(x, 9, x + 3, b, X.CONC);
        c.speckle(x, 9, x + 3, b, X.CONCD, 4, x);
      }
      c.rect(1, 7, 32, 8, W);
      c.row(7, 1, 32, L(W));
      dots(c, D(W), [8, 8, 15, 7, 16, 7, 22, 8]);
      dots(c, C.leafLight, [8, b, 9, b - 1, 24, b]); // weeds
      dots(c, X.PINK, [12, 8]); // gum
      if (u) {
        c.rect(5, 4, 24, 6, C.teal); // somebody sleeps here: a bag, a carrier, a can
        c.row(4, 6, 23, L(C.teal));
        for (let x = 8; x < 24; x += 4) c.col(x, 4, 6, D(C.teal));
        c.rect(2, 4, 5, 6, hex('#5a4a40'));
        c.rect(26, 3, 30, 6, C.white);
        c.set(27, 2, C.white);
        c.set(29, 2, C.white);
        can(c, 12, b);
        c.rect(14, b - 1, 22, b, hex('#8a6a4a')); // cardboard
      }
    },
    sw: 11,
    sh: 17,
    s(c, u) {
      const b = 15,
        W = hex('#7a6a56');
      c.box(2, 9, 8, b, X.CONC);
      c.speckle(2, 9, 8, b, X.CONCD, 4, 3);
      c.rect(1, 7, 9, 8, W);
      c.row(7, 1, 9, L(W));
      if (u) {
        c.rect(2, 3, 8, 6, C.teal);
        c.row(3, 3, 7, L(C.teal));
      }
    },
  });

  {
    const RED = hex('#9a4038');
    const horse = (c, dx, dy) => {
      c.poly([[3 + dx, 8 + dy], [12 + dx, 8 + dy], [13 + dx, 11 + dy], [3 + dx, 11 + dy]], RED); // the body
      c.poly([[11 + dx, 8 + dy], [12 + dx, 3 + dy], [15 + dx, 3 + dy], [16 + dx, 6 + dy], [13 + dx, 8 + dy]], RED); // head
      c.set(14 + dx, 4 + dy, C.white);
      c.set(12 + dx, 2 + dy, RED);
      c.line(2 + dx, 8 + dy, 1 + dx, 11 + dy, C.bone); // tail
      c.row(8 + dy, 4 + dx, 11 + dx, L(RED));
      c.rect(6 + dx, 7 + dy, 9 + dx, 7 + dy, X.BLK); // seat
      c.rect(11 + dx, 6 + dy, 11 + dx, 7 + dy, X.CHR); // handle
      c.speckle(3 + dx, 8 + dy, 13 + dx, 11 + dy, PLY, 6, 2);
    };
    obj('spring-rocker-horse', 'playground spring rocker horse spring rider play area swaying', {
      w: 19,
      h: 19,
      base: 'side',
      f(c, u) {
        const b = 17;
        c.rect(5, b, 12, b, X.CONC);
        if (!u) {
          horse(c, 0, 0);
          for (let y = 12; y < b; y++) c.row(y, 7 + (y % 2), 9 + (y % 2), y % 2 ? X.CHR : D(X.CHR));
        } else {
          horse(c, 2, 1); // rocking, and nobody on it
          for (let y = 13; y < b; y++) c.row(y, 7 + (y % 2) + ((b - y) >> 1), 9 + (y % 2) + ((b - y) >> 1), y % 2 ? X.CHR : D(X.CHR));
        }
      },
      sw: 11,
      sh: 19,
      s(c, u) {
        const b = 17,
          dy = u ? 1 : 0;
        c.rect(3, b, 7, b, X.CONC);
        for (let y = 12 + dy; y < b; y++) c.row(y, 4, 6, y % 2 ? X.CHR : D(X.CHR));
        c.rect(4, 8 + dy, 6, 11 + dy, RED);
        c.rect(4, 3 + dy, 6, 7 + dy, RED);
        c.col(4, 3 + dy, 11 + dy, L(RED));
        dots(c, C.white, [4, 4 + dy, 6, 4 + dy]);
        c.row(6 + dy, 2, 8, X.CHR); // handles
        c.row(11 + dy, 2, 8, X.BLK); // foot pegs
        if (u) c.set(8, 11, X.CHR);
      },
    });
  }

  obj('street-lamp-concrete-sodium', 'street lamp concrete lamp post sodium light orange estate car park', {
    w: 16,
    h: 63,
    f(c, u) {
      const b = 61,
        ON = hex('#d98b2b');
      c.rect(3, 4, 4, b, X.CONC);
      c.rect(2, 30, 5, b, X.CONC);
      c.col(2, 30, b, L(X.CONC));
      c.col(3, 4, 29, L(X.CONC));
      c.rect(3, 48, 4, 53, X.CONCD); // the little door
      c.rect(2, 40, 4, 42, C.paper); // a sticker
      c.speckle(2, b - 8, 5, b, GRIME, 3, 2);
      c.rect(4, 3, 9, 3, X.CONC);
      c.box(8, 2, 14, 4, X.GREY);
      c.row(5, 9, 13, u ? C.flameLight : hex('#8a7a5a'));
      if (u) {
        for (let y = 6; y <= 16; y++) for (let x = 11 - ((y - 4) >> 1); x <= 11 + ((y - 4) >> 2) + 1; x++) if ((x + y) % 2 === 0 && x > 5 && x < 15) c.set(x, y, ON);
        c.row(5, 9, 13, C.flameLight);
      }
    },
    sw: 10,
    sh: 63,
    s(c, u) {
      const b = 61,
        ON = hex('#d98b2b');
      c.rect(4, 6, 5, b, X.CONC);
      c.rect(3, 30, 6, b, X.CONC);
      c.col(3, 30, b, L(X.CONC));
      c.col(4, 6, 29, L(X.CONC));
      c.speckle(3, b - 8, 6, b, GRIME, 3, 2);
      c.box(2, 2, 7, 5, X.GREY);
      c.rect(3, 5, 6, 5, u ? C.flameLight : hex('#8a7a5a'));
      if (u) for (let y = 6; y <= 16; y++) for (let x = 2 - (y > 10 ? 1 : 0); x <= 7 + (y > 10 ? 1 : 0); x++) if ((x + y) % 2 === 0 && (x < 4 || x > 5 || y < 7)) c.set(x, y, ON);
    },
  });

  {
    const RUSTB = hex('#5a3a2c');
    obj('car-wreck-on-rims', 'burnt out car wreck abandoned car joyriders estate car park rust', {
      w: 62,
      h: 24,
      base: 'side',
      f(c, u) {
        const b = 22;
        c.poly([[2, 13], [14, 11], [20, 4], [40, 4], [47, 11], [58, 12], [59, 18], [2, 18]], RUSTB);
        c.line(20, 4, 40, 4, L(RUSTB));
        c.line(2, 13, 14, 11, L(RUSTB));
        c.poly([[17, 11], [21, 6], [29, 6], [29, 11]], C.night); // no glass left
        c.poly([[31, 6], [39, 6], [44, 11], [31, 11]], C.night);
        c.col(30, 5, 17, CHAR);
        c.row(18, 2, 59, CHAR);
        c.rect(3, 19, 58, 19, CHAR);
        for (const x of [12, 48]) {
          c.oval(x - 4, 14, x + 4, 21, C.night); // wheel arches; it sits on its rims
          c.oval(x - 2, 17, x + 2, 21, hex('#6a6058'));
          c.set(x, 19, CHAR);
        }
        c.rect(57, 13, 58, 14, C.night); // headlamp socket
        c.rect(2, 14, 2, 15, C.wine);
        c.speckle(2, 4, 59, 18, CHAR, 3, 7);
        c.speckle(2, 10, 59, 18, C.rust, 6, 4);
        c.row(b, 20, 22, C.glassLight);
        c.row(b, 36, 37, C.glassLight);
        dots(c, X.CHR, [22, 9, 24, 8, 34, 9, 36, 8]); // seat springs
        if (u) {
          c.rect(31, 12, 43, 19, mix(RUSTB, 1.3)); // a door hanging open
          c.frame(31, 12, 43, 19, CHAR);
          c.rect(31, 6, 43, 11, C.night);
          c.rect(34, 13, 40, 17, CHAR);
          c.rect(36, 14, 39, 16, hex('#8a6a4a')); // and a parcel on the seat that was not there
          c.row(15, 36, 39, C.bone);
          c.set(42, 15, X.CHR);
        }
      },
      sw: 30,
      sh: 24,
      SU: { h: 32, x(c) {
        c.poly([[5, 16], [24, 16], [22, 3], [7, 3]], RUSTB); // the bonnet up
        c.frame(8, 5, 21, 14, CHAR);
        c.speckle(6, 3, 23, 16, CHAR, 3, 3);
        c.rect(6, 17, 23, 19, C.night);
        c.rect(10, 17, 18, 19, CHAR);
        dots(c, X.CHR, [12, 18, 16, 18]);
      } },
      s(c, u) {
        const b = 22;
        c.poly([[7, 3], [22, 3], [25, 10], [27, 11], [27, 18], [2, 18], [2, 11], [4, 10]], RUSTB);
        c.poly([[8, 4], [21, 4], [23, 9], [6, 9]], C.night); // windscreen
        c.line(7, 3, 22, 3, L(RUSTB));
        c.row(10, 4, 25, CHAR);
        c.rect(9, 13, 20, 15, C.night); // grille
        vents(c, 9, 13, 20, 15, CHAR);
        c.rect(4, 12, 6, 14, C.night);
        c.rect(23, 12, 25, 14, C.night);
        c.rect(3, 17, 26, 18, CHAR);
        c.rect(3, 19, 6, 21, hex('#6a6058')); // rims
        c.rect(23, 19, 26, 21, hex('#6a6058'));
        c.speckle(2, 3, 27, 18, CHAR, 3, 7);
        c.speckle(2, 9, 27, 18, C.rust, 6, 4);
        dots(c, X.CHR, [11, 7, 17, 7]);
        c.row(b, 12, 14, C.glassLight);
      },
    });
  }

  obj('moped-chained-stripped', 'moped scooter chained learner plate stripped for parts stolen wheel', {
    w: 30,
    h: 23,
    base: 'side',
    f(c, u) {
      const b = 21;
      wheel(c, 6, b - 4, 4, X.BLK, X.CHR);
      if (!u) wheel(c, 23, b - 4, 4, X.BLK, X.CHR);
      else c.rect(21, b - 1, 24, b, X.BRICK); // the fork stood on a brick
      c.line(21, 6, 23, u ? b - 2 : b - 4, X.CHR); // fork
      c.rect(17, 8, 19, 15, MOPED); // leg shield
      c.col(17, 8, 15, L(MOPED));
      c.row(15, 10, 18, MOPED);
      c.row(16, 10, 18, D(MOPED));
      if (!u) {
        c.rect(4, 10, 12, 14, MOPED); // side panel
        c.row(10, 4, 12, L(MOPED));
        c.rect(4, 8, 12, 9, X.BLK); // seat
        c.row(8, 4, 12, mix(X.BLK, 1.6));
        c.rect(21, 7, 22, 8, C.glassLight); // lamp
      } else {
        c.rect(4, 10, 12, 14, hex('#3a3a42')); // the panel off: the engine bare
        dots(c, X.CHR, [6, 11, 8, 13, 10, 11]);
        c.row(10, 4, 12, X.GREY);
        c.row(9, 5, 11, X.GREY); // no seat, just the pan
        c.rect(21, 7, 22, 8, C.night);
        c.rect(12, b, 15, b, MOPED);
        dots(c, X.CHR, [16, b, 26, b]);
      }
      c.row(b - 3, 1, 8, X.CHR); // exhaust
      c.rect(18, 4, 22, 5, X.BLK); // bars
      c.set(17, 3, X.CHR);
      c.rect(1, 7, 3, 9, C.white); // L plate
      c.col(2, 7, 9, C.red);
      c.set(3, 9, C.red);
      dots(c, X.GREYL, [8, b - 1, 10, b, 12, b - 1, 13, b]); // the chain
    },
    sw: 13,
    sh: 23,
    s(c, u) {
      const b = 21;
      if (!u) {
        c.rect(5, b - 8, 7, b, X.BLK);
        c.col(5, b - 8, b, mix(X.BLK, 1.6));
        c.rect(5, b - 10, 7, b - 9, MOPED); // mudguard
      } else {
        c.rect(4, b - 1, 8, b, X.BRICK);
        c.col(6, b - 6, b - 2, X.CHR);
      }
      c.rect(3, 8, 9, 15, MOPED);
      c.col(3, 8, 15, L(MOPED));
      c.rect(5, 9, 7, 13, D(MOPED));
      c.oval(4, 5, 8, 8, X.GREY);
      c.rect(5, 6, 7, 7, u ? C.night : C.glassLight);
      c.row(4, 1, 11, X.BLK);
      c.set(1, 3, X.CHR);
      c.set(11, 3, X.CHR);
    },
  });

  obj('garage-door-up-and-over', 'garage door up and over lock-up garage steel door row of garages', {
    w: 36,
    h: 36,
    f(c, u) {
      const b = 34;
      c.box(1, 2, 34, b, X.CONC);
      c.speckle(1, 2, 34, b, X.CONCD, 6, 5);
      const y0 = u ? 5 : 5,
        y1 = u ? 17 : b;
      if (u) {
        c.rect(3, 5, 32, b, C.night);
        c.rect(6, 22, 29, b, hex('#1c1a22')); // something under a sheet in there
        c.poly([[8, b], [10, 23], [26, 23], [28, b]], hex('#3a3a42'));
        c.row(23, 10, 26, hex('#4a4a52'));
        c.set(17, 19, C.flameLight); // a bare bulb
        dots(c, C.glow, [16, 20, 18, 20, 17, 21]);
        c.col(17, 16, 18, X.BLK);
      }
      c.rect(3, y0, 32, y1, TEALP);
      for (let y = y0 + 3; y <= y1; y += 4) c.row(y, 3, 32, D(TEALP));
      c.row(y0, 3, 32, L(TEALP));
      if (u) c.rect(3, y1 - 1, 32, y1, L(TEALP));
      else {
        c.rect(17, 20, 18, 21, X.CHR);
        dots(c, C.white, [8, 9, 8, 10, 8, 11, 10, 9, 11, 9, 10, 10, 11, 11, 10, 11, 11, 10]);
        c.speckle(3, b - 6, 32, b, C.rust, 4, 3);
        cable(c, [[22, 24], [25, 27], [27, 23], [29, 27]], X.BLK);
      }
    },
    sw: 8,
    sh: 36,
    SU: { w: 22, x(c) {
      c.rect(6, 16, 19, 17, TEALP); // the door out flat over your head
      c.row(16, 6, 19, L(TEALP));
      c.set(19, 17, D(TEALP));
    } },
    s(c, u) {
      const b = 34;
      c.box(1, 2, 6, b, X.CONC);
      c.speckle(1, 2, 6, b, X.CONCD, 6, 5);
      c.col(6, 5, b, u ? C.night : TEALP);
    },
  });

  obj('fire-exit-door-bar', 'fire exit door push bar emergency exit stairwell green sign wired glass', {
    w: 22,
    h: 40,
    U: { w: 26, x(c) {
      c.rect(21, 9, 23, 38, L(hex('#6f7a70')));
      c.col(23, 9, 38, D(hex('#6f7a70')));
      c.rect(22, 21, 23, 22, X.CHR);
    } },
    f(c, u) {
      const b = 38,
        G = hex('#6f7a70'),
        EXIT = u ? hex('#62b45c') : hex('#3f6a48');
      c.box(1, 2, 20, b, FRAME);
      c.rect(6, 3, 15, 6, EXIT); // the running man
      dots(c, C.white, [8, 4, 9, 5, 10, 4, 12, 4, 13, 4, 13, 5]);
      if (!u) {
        door(c, 3, 8, 18, b, G, '');
        c.rect(7, 11, 14, 17, C.glass);
        for (let x = 8; x <= 14; x += 2) c.col(x, 11, 17, C.glassLight);
        c.row(14, 7, 14, C.glassLight);
        c.rect(4, 21, 17, 22, X.CHR); // the bar
        c.rect(4, 20, 5, 23, X.BLK);
        c.rect(16, 20, 17, 23, X.BLK);
        c.oval(9, 25, 12, 28, C.navy);
        c.set(10, 26, C.white);
        c.rect(3, b - 4, 18, b, STEEL);
        c.speckle(3, b - 4, 18, b, GRIME, 5, 2);
      } else {
        hole(c, 3, 8, 18, b, C.night);
        for (let i = 0; i < 5; i++) {
          c.rect(4 + i, b - 2 - i * 4, 17, b - i * 4, hex('#4a4a50')); // the stairs going down
          c.row(b - 2 - i * 4, 4 + i, 17, hex('#6a6a70'));
        }
        c.line(4, 22, 9, 12, X.GREY);
        dots(c, C.glow, [5, 9, 7, 9]);
      }
    },
    sw: 7,
    sh: 40,
    SU: { w: 16, x(c) {
      c.rect(6, 9, 13, 38, L(hex('#6f7a70')));
      c.col(13, 9, 38, D(hex('#6f7a70')));
      c.rect(8, 12, 11, 18, C.glass);
      c.row(22, 7, 12, X.CHR);
    } },
    s(c, u) {
      const b = 38;
      c.box(1, 2, 5, b, FRAME);
      c.col(5, 8, b, u ? C.night : hex('#6f7a70'));
      c.rect(5, 3, 5, 6, u ? hex('#62b45c') : hex('#3f6a48'));
      if (!u) c.rect(6, 21, 6, 22, X.CHR);
    },
  });

  obj('flat-door-steel-sheeted', 'flat door boarded up steel security screen void flat padlock squat', {
    w: 22,
    h: 40,
    f(c, u) {
      const b = 38;
      c.box(1, 2, 20, b, FRAME);
      c.speckle(1, 2, 2, b, GRIME, 6, 2);
      c.rect(3, 4, 18, b, hex('#3d4a45')); // the old door behind
      c.rect(2, 3, 19, b, STEEL);
      for (let y = 5; y < b; y += 2) for (let x = 4 + (y % 4 === 1 ? 1 : 0); x < 19; x += 2) c.set(x, y, D(STEEL));
      c.frame(2, 3, 19, b, D(STEEL));
      dots(c, X.BLK, [3, 4, 18, 4, 3, b - 1, 18, b - 1]);
      c.rect(6, 9, 15, 14, C.paper); // the council's notice
      c.row(10, 7, 14, C.red);
      c.row(12, 7, 13, hex('#8a877c'));
      cable(c, [[5, 26], [8, 30], [10, 25], [13, 30]], X.BLK);
      if (!u) {
        c.rect(17, 19, 19, 21, C.brass); // padlock
        c.set(18, 18, X.CHR);
      } else {
        c.poly([[2, b], [12, b], [2, 24]], C.night); // prised away at the corner
        c.line(12, b, 2, 24, L(STEEL));
        c.line(13, b, 3, 24, STEEL);
        c.rect(3, b - 4, 5, b, hex('#3d4a45'));
        c.rect(15, b, 16, b, C.brass); // the padlock, cut
        c.set(7, b - 2, C.flameLight); // a candle burning inside
      }
    },
    sw: 7,
    sh: 40,
    SU: { w: 10, x(c) {
      c.line(6, 37, 8, 26, STEEL);
      c.line(6, 38, 8, 38, C.night);
    } },
    s(c, u) {
      const b = 38;
      c.box(1, 2, 5, b, FRAME);
      c.col(6, 3, u ? 25 : b, STEEL);
      c.speckle(1, 2, 4, b, GRIME, 6, 2);
      if (!u) c.set(6, 20, C.brass);
    },
  });

  obj('ashtray-bin-wall', 'ashtray bin wall mounted cigarette bin butts smokers entrance smouldering', {
    w: 10,
    h: 21,
    p: true,
    f(c, u) {
      const b = 19;
      c.box(1, 7, 8, 16, STEEL);
      c.rect(2, 6, 7, 6, X.BLK); // the grid to stub out on
      c.rect(3, 9, 6, 9, X.BLK);
      c.rect(3, 12, 6, 14, C.paper);
      c.set(4, 13, C.red);
      for (let y = 17; y <= b; y++) c.set(3 + (y % 2), y, GRIME); // what runs down the wall under it
      dots(c, C.bone, [3, 5, 6, 5]);
      if (u) {
        dots(c, C.bone, [2, 5, 5, 5, 4, 4, 7, 5]);
        c.set(4, 5, C.flame);
        wisp(c, 5, 4, 4);
        dots(c, C.bone, [2, b, 7, b, 6, b - 1]);
        c.rect(7, 4, 8, 5, C.mustard); // a packet
      }
    },
    sw: 7,
    sh: 21,
    s(c, u) {
      const b = 19;
      c.box(1, 7, 4, 16, STEEL);
      c.rect(1, 6, 5, 6, X.BLK);
      c.set(2, 5, C.bone);
      c.set(2, b, GRIME);
      if (u) {
        c.set(3, 5, C.flame);
        wisp(c, 3, 4, 4);
        c.set(4, b, C.bone);
      }
    },
  });

  {
    const crate = (c, x, y, col, open) => {
      c.box(x, y, x + 6, y + 5, col);
      if (open) c.rect(x + 1, y + 1, x + 5, y + 4, C.night);
      else {
        for (let i = x + 2; i < x + 6; i += 2) c.col(i, y + 1, y + 4, D(col));
        c.row(y + 3, x + 1, x + 5, D(col));
      }
    };
    obj('milk-crate-seats', 'milk crates upturned crates seats hangout cans cigarette ends stairwell', {
      w: 24,
      h: 14,
      p: true,
      f(c, u) {
        const b = 12;
        crate(c, 1, b - 5, hex('#8a3a34'));
        if (!u) {
          crate(c, 10, b - 5, C.navy);
          can(c, 19, b);
          can(c, 21, b, C.red);
          c.rect(11, b - 7, 14, b - 6, C.paper); // a newspaper to sit on
        } else {
          crate(c, 12, b - 5, C.navy, true); // kicked over
          c.rect(8, b, 9, b, X.CHR); // cans stamped flat
          c.rect(20, b, 21, b, C.red);
          dots(c, C.bone, [5, b - 6, 10, b, 22, b - 1]);
          c.rect(3, b - 7, 4, b - 6, C.glassLight); // a bottle left on the other
          c.set(3, b - 8, C.glassLight);
          dots(c, C.blood, [17, b, 18, b]);
        }
        dots(c, C.bone, [8, b, 18, b]);
      },
      sw: 11,
      sh: 14,
      s(c, u) {
        const b = 12;
        crate(c, 2, b - 5, u ? C.navy : hex('#8a3a34'), u);
        if (!u) c.rect(3, b - 7, 6, b - 6, C.paper);
        else c.rect(1, b, 2, b, X.CHR);
      },
    });
  }

  {
    const PIG = hex('#6a6c78');
    const pigeon = (c, x, y, flip) => {
      c.rect(x, y - 2, x + 3, y - 1, PIG);
      c.set(flip ? x : x + 3, y - 3, PIG);
      c.set(flip ? x : x + 3, y - 2, hex('#4f7a6a'));
      c.set(flip ? x + 3 : x, y - 1, D(PIG));
      c.set(flip ? x + 4 : x - 1, y - 1, D(PIG));
      c.set(x + 1, y, X.PINK);
    };
    obj('pigeons-on-ledge', 'pigeons on concrete ledge birds spikes droppings feathers window sill', {
      w: 30,
      h: 14,
      p: true,
      f(c, u) {
        const b = 12;
        c.box(1, 8, 28, b, X.CONC);
        c.speckle(1, 8, 28, b, X.CONCD, 5, 2);
        for (let x = 18; x <= 27; x += 2) c.col(x, 5, 7, X.CHR); // spikes, where they bothered
        for (const x of [4, 9, 14, 22]) c.col(x, 8, 9 + (x % 3), C.white); // droppings
        if (!u) {
          pigeon(c, 3, 7, false);
          pigeon(c, 9, 7, true);
          pigeon(c, 13, 7, false);
        } else {
          dots(c, C.ghost, [5, 3, 6, 4, 12, 2, 13, 3, 16, 6]); // gone, all at once
          c.rect(9, 6, 10, 7, C.bone); // an egg
          c.set(3, 7, PIG);
          c.set(4, 7, PIG);
        }
      },
      sw: 9,
      sh: 14,
      s(c, u) {
        const b = 12;
        c.box(1, 8, 7, b, X.CONC);
        c.col(7, 8, 10, C.white);
        if (!u) {
          c.rect(3, 4, 5, 6, PIG);
          c.rect(4, 3, 5, 3, PIG);
          c.set(6, 4, C.mustard);
          c.set(4, 7, X.PINK);
        } else {
          dots(c, C.ghost, [3, 3, 4, 4]);
          c.rect(4, 6, 5, 7, C.bone);
        }
      },
    });
  }

  {
    const sign = (c) => {
      const b = 14;
      c.poly([[4, 2], [7, 2], [9, b], [2, b]], X.HAZ);
      c.line(4, 2, 2, b, L(X.HAZ));
      c.rect(5, 5, 6, 6, X.BLK); // a man going over
      c.line(4, 8, 7, 7, X.BLK);
      c.line(5, 9, 7, 11, X.BLK);
      c.row(12, 4, 7, X.BLK);
      c.rect(5, 1, 6, 1, X.HAZ);
    };
    obj('wet-floor-sign-yellow', 'wet floor sign yellow caution cleaning in progress slippery lobby', {
      w: 12,
      h: 16,
      p: true,
      U: { own: true, w: 22, h: 9 },
      f(c, u) {
        if (!u) return sign(c);
        c.rect(3, 5, 17, 6, X.HAZ); // flat in the wet
        c.row(5, 3, 17, L(X.HAZ));
        c.rect(7, 5, 12, 5, X.BLK);
        puddle(c, 1, 20, 7);
        c.rect(14, 7, 17, 7, C.blood);
      },
      sw: 9,
      sh: 16,
      SU: { own: true, w: 14, h: 9 },
      s(c, u) {
        if (!u) {
          c.line(4, 2, 2, 14, X.HAZ);
          c.line(5, 2, 7, 14, D(X.HAZ));
          c.rect(4, 1, 5, 1, X.HAZ);
          c.row(10, 3, 6, X.GREY);
          return;
        }
        c.rect(3, 5, 10, 6, X.HAZ);
        c.row(5, 3, 10, L(X.HAZ));
        puddle(c, 1, 12, 7);
      },
    });
  }

  obj('carpet-roll-dumped', 'rolled carpet dumped roll of carpet tied with string something inside', {
    w: 40,
    h: 11,
    base: 'side',
    U: { w: 46, x(c) {
      c.rect(38, 5, 41, 7, hex('#3f4f6e')); // a trouser leg and a shoe
      c.rect(42, 4, 44, 8, X.BLK);
      c.set(41, 6, C.flesh);
      c.set(44, 4, mix(X.BLK, 1.7));
    } },
    f(c, u) {
      const b = 9;
      c.rect(2, 2, 37, b, CARPET);
      c.row(2, 2, 37, L(CARPET));
      c.row(b, 2, 37, D(CARPET));
      for (let x = 5; x < 36; x += 4) c.set(x, 4 + (x % 3), hex('#8a6a4a')); // the pattern
      for (const x of [9, 20, 31]) c.col(x, 2, b, C.bone); // string
      c.oval(35, 2, 38, b, hex('#8a6a4a')); // the end: hessian, rolled
      c.oval(36, 4, 37, 7, u ? C.night : CARPET);
      c.clear(1, 2);
      c.speckle(2, 6, 34, b, GRIME, 7, 2);
      if (u) {
        c.rect(22, 5, 27, b, mix(CARPET, 0.6)); // and it has come through
        c.row(b, 20, 29, C.blood);
      }
    },
    sw: 11,
    sh: 11,
    s(c, u) {
      const b = 9;
      c.oval(1, 1, 9, b, hex('#8a6a4a'));
      c.oval(2, 2, 8, b - 1, CARPET);
      c.oval(3, 3, 7, b - 2, hex('#8a6a4a'));
      c.oval(4, 4, 6, b - 3, u ? X.BLK : CARPET);
      if (u) {
        c.rect(4, 4, 6, 6, X.BLK); // the sole of a shoe
        c.row(5, 4, 6, mix(X.BLK, 1.7));
      }
    },
  });

  obj('fridge-dumped-taped', 'fridge dumped taped shut old refrigerator do not open mould fly tipping', {
    w: 16,
    h: 31,
    U: { w: 20, x(c) {
      c.rect(15, 5, 17, 29, L(X.APW)); // the door swung out
      c.col(17, 5, 29, D(X.APW));
      c.rect(16, 12, 16, 14, hex('#8a6a4a'));
    } },
    f(c, u) {
      const b = 29,
        B = X.APW,
        TAPE = hex('#8a6a4a');
      c.box(1, 2, 14, b, B);
      c.row(10, 1, 14, D(B));
      c.rect(12, 5, 12, 8, X.GREY);
      c.rect(12, 12, 12, 17, X.GREY);
      c.speckle(1, 2, 14, b, C.rust, 22, 6);
      c.speckle(1, b - 5, 14, b, C.rust, 5, 2);
      c.rect(1, 6, 14, 7, TAPE); // taped round and round
      if (!u) {
        c.rect(1, 14, 14, 15, TAPE);
        c.rect(1, 21, 14, 22, TAPE);
        c.line(3, 17, 6, 19, C.red); // and a cross in red paint
        c.line(6, 17, 3, 19, C.red);
      } else {
        hole(c, 2, 11, 13, b - 1, C.night);
        c.row(16, 2, 13, X.GREYL);
        c.row(22, 2, 13, X.GREYL);
        c.speckle(2, 11, 13, b - 1, C.rot, 3, 4); // mould
        c.rect(4, 23, 10, b - 1, X.BAG); // and a bag, tied
        c.set(6, 24, mix(X.BAG, 1.9));
        c.rect(7, 22, 8, 22, X.BAG);
        c.rect(1, 14, 1, 15, TAPE);
        puddle(c, 3, 12, b, hex('#4a4a3a'));
      }
    },
    sw: 14,
    sh: 31,
    SU: { w: 22, x(c) {
      c.rect(12, 12, 19, 29, L(X.APW));
      c.col(19, 12, 29, D(X.APW));
      c.rect(12, 14, 14, 15, hex('#8a6a4a'));
    } },
    s(c, u) {
      const b = 29,
        B = X.APW,
        TAPE = hex('#8a6a4a');
      c.box(1, 2, 12, b, B);
      c.speckle(1, 2, 12, b, C.rust, 22, 6);
      c.speckle(1, b - 5, 12, b, C.rust, 5, 2);
      c.rect(1, 6, 12, 7, TAPE);
      if (!u) {
        c.rect(1, 14, 12, 15, TAPE);
        c.rect(1, 21, 12, 22, TAPE);
      } else c.col(12, 11, b - 1, C.night);
    },
  });
};
