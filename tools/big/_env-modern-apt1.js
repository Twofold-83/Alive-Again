/* Apartment complex, part 1: hall, stairwell, laundry room, balcony. See env-modern.js for obj() and the helpers. */
module.exports = (T, obj) => {
  const { C, hex, mix, blend, rnd, turn, D, L, X, dots, legs, panel, door, hole, scr, led, leds, vents, grille, cable, cord, wisp, puddle, wheel, bottle, cup, cloth, stuff, shoes } = T;
  const STEEL = hex('#8d9094'),
    FRAME = hex('#b3ab94'), // cream gloss, long ago
    BLUE = hex('#4f6170'),
    GREEN = hex('#4a5e50'),
    BIN = hex('#3d5a45'),
    FIRE = hex('#a8302a'),
    CORK = hex('#9a7a52'),
    GRIME = hex('#4a463c'),
    DISH = hex('#a3a59c');
  const LAUNDRY = [C.white, X.DENIM, C.wine, C.mustard, X.PINK, hex('#7d8fa0'), C.teal, C.bone];

  /** A flat's front door in its frame, 20 wide: number plate, spyhole, letter slot. Returns nothing; ajar opens a dark gap. */
  const flatDoor = (c, col, num, ajar) => {
    const b = c.h - 2;
    c.box(1, 2, 18, b, FRAME);
    c.rect(3, 4, 16, b, col);
    c.col(3, 4, b, L(col));
    c.row(4, 3, 16, L(col));
    panel(c, 5, 6, 14, 17, col);
    panel(c, 5, 23, 14, b - 3, col);
    c.rect(8, 8, 11, 10, C.brass); // the number
    dots(c, C.black, num);
    c.set(10, 13, C.black); // spyhole
    c.set(9, 13, C.brass);
    c.rect(7, 20, 12, 20, C.brass); // letters
    c.set(15, 20, X.CHR);
    c.rect(14, 21, 15, 22, X.CHR);
    c.set(17, 16, C.white); // the bell
    c.speckle(3, b - 6, 16, b, mix(col, 0.7), 5, 4);
    c.speckle(1, 2, 2, b, GRIME, 6, 2);
    if (ajar) {
      hole(c, 13, 4, 16, b, C.night);
      c.col(12, 4, b, D(col));
    }
  };
  obj('flat-door-number-12', 'flat door apartment front door number twelve spyhole letterbox blue door chain', {
    w: 20,
    h: 40,
    f(c, u) {
      flatDoor(c, BLUE, [9, 9, 9, 10, 11, 8, 10, 10], u);
      if (u) {
        dots(c, C.brass, [13, 19, 14, 20, 15, 19, 16, 20]); // on the chain
        c.set(14, 13, C.white); // and somebody looks out
        c.set(15, 13, C.black);
      }
    },
    sw: 7,
    sh: 40,
    SU: { w: 12, dx: 5, x(c) {
      c.rect(1, 5, 5, 38, BLUE);
      c.col(1, 5, 38, L(BLUE));
      c.row(5, 1, 5, L(BLUE));
    } },
    s(c, u) {
      const b = 38;
      c.box(1, 2, 5, b, FRAME);
      c.col(5, 4, b, u ? C.night : BLUE);
      c.speckle(1, 2, 4, b, GRIME, 7, 2);
    },
  });

  obj('flat-door-police-tape', 'flat door sealed police tape crime scene do not cross apartment green door', {
    w: 20,
    h: 40,
    f(c, u) {
      flatDoor(c, GREEN, [9, 8, 10, 8, 10, 9, 10, 10], u);
      const tape = (x0, y0, x1, y1) => {
        const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
        for (let i = 0; i <= n; i++) {
          const x = Math.round(x0 + ((x1 - x0) * i) / n),
            y = Math.round(y0 + ((y1 - y0) * i) / n);
          c.set(x, y, i % 4 < 2 ? C.white : C.navy);
          c.set(x, y + 1, i % 4 < 2 ? C.navy : C.white);
        }
      };
      if (!u) {
        tape(1, 10, 18, 22);
        tape(1, 27, 18, 15);
        c.rect(15, 18, 17, 20, C.paper); // the seal
        c.set(16, 19, C.red);
      } else {
        tape(1, 10, 4, 13); // cut, hanging from the frame
        tape(4, 13, 3, 24);
        tape(1, 27, 3, 26);
        tape(18, 15, 17, 30);
        c.rect(15, 18, 15, 20, C.paper);
        c.rect(6, 37, 9, 37, C.white);
      }
    },
    sw: 7,
    sh: 40,
    SU: { w: 12, dx: 5, x(c) {
      c.rect(1, 5, 5, 38, GREEN);
      c.col(1, 5, 38, L(GREEN));
      c.row(5, 1, 5, L(GREEN));
      c.col(11, 15, 30, C.white);
      dots(c, C.navy, [11, 17, 11, 21, 11, 25, 11, 29]);
    } },
    s(c, u) {
      const b = 38;
      c.box(1, 2, 5, b, FRAME);
      c.col(5, 4, b, u ? C.night : GREEN);
      if (!u) {
        c.rect(5, 15, 5, 16, C.white);
        c.rect(5, 21, 5, 22, C.white);
        c.set(5, 19, C.paper);
      }
      c.speckle(1, 2, 4, b, GRIME, 7, 2);
    },
  });

  obj('letterboxes-row-flats', 'letter boxes row mailboxes block of flats post mail hall junk mail', {
    w: 32,
    h: 31,
    f(c, u) {
      const b = 29,
        r = rnd(7);
      legs(c, [3, 27], 20, b, STEEL, 2);
      c.box(1, 2, 30, 20, STEEL);
      for (let j = 0; j < 3; j++)
        for (let i = 0; i < 6; i++) {
          const x = 2 + i * 5 - (i > 5 ? 1 : 0),
            y = 3 + j * 6,
            open = u && i === 2 && j === 1;
          if (open) {
            hole(c, x, y, x + 3, y + 4, C.night);
            c.rect(x + 1, y + 2, x + 3, y + 3, C.paper);
            c.set(x + 2, y + 2, C.red);
            c.rect(x + 4, y + 1, x + 4, y + 5, L(STEEL));
            continue;
          }
          door(c, x, y, x + 3, y + 4, STEEL, '');
          c.row(y + 1, x + 1, x + 2, X.BLK);
          const k = r();
          c.rect(x + 1, y + 3, x + 2, y + 3, k < 0.2 ? X.BLK : C.paper);
          if (k > 0.7) c.rect(x + 1, y, x + 2, y + 1, k > 0.85 ? C.mustard : C.white); // junk mail sticking out
        }
      c.rect(27, 4, 28, 5, C.red); // someone's sticker
      if (u) {
        c.rect(11, b - 1, 15, b, C.paper); // letters on the floor
        c.rect(14, b - 2, 17, b - 1, C.white);
        c.set(12, b - 1, C.red);
        c.rect(19, b, 21, b, C.mustard);
      }
    },
    sw: 7,
    sh: 31,
    s(c, u) {
      const b = 29;
      legs(c, [3], 20, b, STEEL, 2);
      c.box(1, 2, 5, 20, STEEL);
      c.col(5, 3, 19, D(STEEL));
      dots(c, C.paper, [5, 4, 5, 16]);
      if (u) {
        c.rect(5, 9, 5, 13, C.night);
        c.rect(4, b - 1, 5, b, C.paper);
      }
    },
  });

  obj('lift-doors-steel', 'lift elevator doors steel block of flats call button floor indicator', {
    w: 26,
    h: 40,
    f(c, u) {
      const b = 38;
      c.box(1, 2, 24, b, X.CONCD);
      c.rect(8, 3, 16, 5, X.BLK);
      dots(c, u ? X.LEDR : mix(X.LEDR, 0.4), [11, 4, 12, 4, 13, 4]);
      c.set(23, 20, u ? X.AMBER : X.GREYL);
      c.set(23, 22, X.GREYL);
      if (!u) {
        door(c, 3, 7, 12, b, STEEL, '');
        door(c, 13, 7, 21, b, STEEL, '');
        c.col(12, 7, b, X.BLK);
        c.line(5, 14, 9, 19, D(STEEL)); // scratched into the steel
        c.line(9, 14, 6, 20, D(STEEL));
        c.line(15, 24, 19, 22, D(STEEL));
        c.rect(15, 11, 19, 14, C.paper); // a notice
        c.row(12, 16, 18, C.red);
        c.speckle(3, b - 6, 21, b, GRIME, 5, 3);
      } else {
        c.rect(3, 7, 5, b, STEEL); // the doors drawn back
        c.rect(19, 7, 21, b, STEEL);
        c.col(5, 7, b, D(STEEL));
        c.col(19, 7, b, L(STEEL));
        c.rect(6, 7, 18, b, hex('#3a3f3a'));
        c.rect(6, 7, 18, 8, C.glow); // its light
        c.rect(8, 12, 16, 22, hex('#5d6f72')); // the mirror at the back
        c.line(9, 20, 13, 13, hex('#8aa0a2'));
        c.row(25, 6, 18, X.CHR); // rail
        c.rect(6, b - 2, 18, b, hex('#2a2c2a'));
        c.rect(13, b - 3, 15, b - 2, X.BLK); // one shoe
        c.set(13, b - 4, X.BLK);
        dots(c, C.blood, [9, b - 1, 10, b - 1, 11, b]);
      }
    },
    sw: 8,
    sh: 40,
    s(c, u) {
      const b = 38;
      c.box(1, 2, 6, b, X.CONCD);
      c.col(6, 7, b, u ? hex('#3a3f3a') : STEEL);
      c.set(6, 20, u ? X.AMBER : X.GREYL);
      if (u) dots(c, C.glow, [6, 7, 6, 8]);
      c.speckle(1, 20, 5, b, GRIME, 6, 3);
    },
  });

  obj('stair-railing-section', 'stairwell railing landing banister iron bars handrail block of flats', {
    w: 30,
    h: 21,
    f(c, u) {
      const b = 19,
        RAIL = hex('#6b2f32');
      c.rect(1, 2, 28, 3, RAIL);
      c.row(2, 1, 28, L(RAIL));
      c.row(b - 2, 1, 28, C.iron);
      for (let x = 2; x <= 27; x += 3) {
        if (u && (x === 11 || x === 14)) continue;
        c.col(x, 4, b - 3, C.iron);
      }
      legs(c, [1, 27], b - 1, b, C.ironDark, 2);
      c.speckle(1, 4, 28, b - 2, C.rust, 9, 3);
      if (u) {
        c.line(11, 4, 9, 10, C.iron); // forced apart
        c.line(9, 10, 11, b - 3, C.iron);
        c.line(14, 4, 16, 10, C.iron);
        c.line(16, 10, 14, b - 3, C.iron);
        c.rect(20, 1, 22, 3, hex('#7d8fa0')); // a child's mitten left on the rail
        c.set(23, 2, hex('#7d8fa0'));
      }
    },
    sw: 6,
    sh: 21,
    s(c, u) {
      const b = 19,
        RAIL = hex('#6b2f32');
      c.rect(2, 2, 3, 3, RAIL);
      c.set(2, 2, L(RAIL));
      c.col(2, 4, b - 1, C.iron);
      c.col(3, 4, b - 3, C.ironDark);
      c.rect(1, b, 4, b, C.ironDark);
      if (u) c.rect(2, 1, 3, 1, hex('#7d8fa0'));
    },
  });

  obj('doormat-with-shoes', 'doormat with shoes outside flat door slippers boots mat coir', {
    w: 20,
    h: 9,
    p: true,
    f(c, u) {
      const b = 7,
        MAT = hex('#8a6f42');
      c.rect(1, b - 1, 18, b, MAT);
      c.row(b - 1, 1, 18, L(MAT));
      dots(c, D(MAT), [3, b, 7, b, 11, b, 15, b]);
      if (!u) {
        shoes(c, 3, b - 2, 2, 4);
        for (const x of [12, 15]) {
          c.rect(x, b - 6, x + 1, b - 2, C.red); // small wellingtons
          c.set(x + 2, b - 2, C.red);
        }
      } else {
        dots(c, C.earth, [4, b - 1, 5, b - 1, 9, b - 1, 10, b - 1, 14, b, 15, b]); // only the prints
        c.rect(15, b - 3, 16, b - 2, C.red); // and one small boot, on its side
        c.rect(13, b - 2, 16, b - 2, C.red);
        c.set(7, b - 2, C.brass); // a key
      }
    },
    sw: 12,
    sh: 9,
    s(c, u) {
      const b = 7,
        MAT = hex('#8a6f42');
      c.rect(1, b - 1, 10, b, MAT);
      c.row(b - 1, 1, 10, L(MAT));
      if (!u) {
        c.rect(3, b - 3, 6, b - 2, X.BLK);
        c.rect(7, b - 6, 8, b - 2, C.red);
        c.set(9, b - 2, C.red);
      } else {
        dots(c, C.earth, [3, b - 1, 4, b - 1, 7, b]);
        c.rect(5, b - 2, 8, b - 2, C.red);
      }
    },
  });

  obj('rubbish-chute-hatch', 'rubbish chute hatch refuse hopper block of flats landing bin bag', {
    w: 16,
    h: 40,
    f(c, u) {
      const b = 38;
      c.box(1, 2, 14, b, X.CONC);
      c.speckle(1, 2, 14, b, X.CONCD, 7, 4);
      c.box(3, 13, 12, 25, STEEL);
      c.rect(5, 8, 10, 10, C.paper);
      c.row(9, 6, 9, C.red);
      for (let y = 26; y <= b - 2; y++) if (y % 2) c.set(6 + (y % 3), y, GRIME); // what ran down
      c.speckle(3, 26, 12, 33, GRIME, 3, 6);
      if (!u) {
        door(c, 4, 14, 11, 24, STEEL, 't', X.BLK);
        c.row(22, 5, 10, D(STEEL));
      } else {
        hole(c, 4, 14, 11, 19, C.night); // the hopper let down, a bag stuck in it
        c.rect(4, 20, 11, 25, L(STEEL));
        c.row(26, 4, 11, D(STEEL));
        c.oval(5, 15, 10, 21, X.BAG);
        c.set(6, 16, mix(X.BAG, 1.9));
        c.set(8, 14, X.BAG);
        dots(c, C.paper, [3, b, 9, b]);
        c.rect(11, b - 1, 12, b, C.rust);
      }
    },
    sw: 11,
    sh: 40,
    SU: { w: 15, x(c) {
      c.line(10, 25, 13, 15, STEEL);
      c.line(10, 24, 12, 16, X.BAG);
      c.set(13, 14, X.BLK);
    } },
    s(c, u) {
      const b = 38;
      c.box(1, 2, 9, b, X.CONC);
      c.speckle(1, 2, 9, b, X.CONCD, 7, 4);
      c.col(10, 13, 25, STEEL);
      if (u) c.col(10, 14, 19, C.night);
    },
  });

  {
    const body = (c, b) => {
      c.poly([[2, 7], [10, 7], [9, b - 1], [3, b - 1]], BIN);
      c.line(2, 7, 3, b - 1, L(BIN));
      c.row(9, 3, 9, D(BIN));
      dots(c, C.white, [5, 13, 5, 14, 5, 15, 7, 13, 8, 14, 7, 15]); // a number in house paint
      c.rect(2, b - 1, 3, b, X.BLK);
      c.rect(9, b - 1, 10, b, X.BLK);
      c.speckle(3, 16, 9, b - 2, GRIME, 6, 2);
    };
    obj('wheelie-bin-flats-numbered', 'wheelie bin green dustbin rubbish refuse household bin lid', {
      w: 13,
      h: 22,
      U: { h: 31, x(c) {
        c.rect(1, 2, 11, 12, D(BIN)); // the lid thrown back
        c.row(2, 1, 11, BIN);
        c.oval(2, 10, 7, 15, X.BAG);
        c.oval(6, 9, 10, 15, C.white);
        c.set(3, 11, mix(X.BAG, 1.9));
        c.set(8, 9, C.bone);
        c.rect(9, 12, 10, 14, C.mustard);
      } },
      f(c, u) {
        const b = 20;
        body(c, b);
        if (!u) {
          c.rect(1, 5, 11, 6, BIN);
          c.row(5, 1, 11, L(BIN));
          c.row(4, 2, 10, BIN);
        } else c.row(6, 2, 10, C.night);
      },
      sw: 14,
      sh: 22,
      SU: { h: 31, x(c) {
        c.rect(2, 2, 3, 13, BIN);
        c.col(2, 2, 13, L(BIN));
        c.oval(5, 10, 9, 15, X.BAG);
        c.oval(8, 9, 11, 15, C.white);
        c.set(6, 11, mix(X.BAG, 1.9));
      } },
      s(c, u) {
        const b = 20;
        c.poly([[3, 7], [11, 7], [10, b - 1], [5, b - 1]], BIN);
        c.line(3, 7, 5, b - 1, L(BIN));
        c.row(9, 4, 10, D(BIN));
        c.rect(1, 6, 3, 7, X.BLK); // the handle
        wheel(c, 4, b - 2, 2);
        c.rect(9, b, 10, b, BIN);
        c.speckle(5, 14, 10, b - 2, GRIME, 6, 2);
        if (!u) {
          c.rect(2, 5, 12, 6, BIN);
          c.row(5, 2, 12, L(BIN));
          c.row(4, 3, 11, BIN);
        } else c.row(6, 4, 10, C.night);
      },
    });
  }

  obj('communal-bin-steel', 'communal bin big steel bin on wheels dumpster refuse block of flats', {
    w: 30,
    h: 26,
    f(c, u) {
      const b = 24,
        G = hex('#7d8580'),
        LID = hex('#3f4a5a');
      c.box(2, 9, 27, b - 3, G);
      for (let x = 6; x <= 24; x += 6) c.col(x, 10, b - 4, D(G));
      c.rect(1, 12, 1, 13, X.BLK); // trunnions
      c.rect(28, 12, 28, 13, X.BLK);
      dots(c, C.white, [11, 14, 12, 14, 13, 14, 12, 15, 12, 16, 12, 17]);
      c.speckle(3, 16, 26, b - 4, C.rust, 9, 4);
      c.speckle(15, 10, 26, 15, hex('#2a2620'), 3, 5); // scorched
      legs(c, [4, 24], b - 2, b - 2, X.GREY, 2);
      wheel(c, 4, b - 1, 1);
      wheel(c, 25, b - 1, 1);
      if (!u) {
        c.poly([[2, 8], [4, 4], [25, 4], [27, 8]], LID);
        c.row(4, 4, 25, L(LID));
        c.row(8, 2, 27, D(LID));
        c.rect(13, 6, 16, 6, X.BLK);
      } else {
        c.rect(2, 2, 27, 4, LID); // the lid slid back
        c.row(2, 2, 27, L(LID));
        c.rect(3, 7, 26, 8, C.night);
        c.oval(4, 4, 10, 9, X.BAG);
        c.oval(9, 5, 14, 9, X.BAG);
        c.set(6, 5, mix(X.BAG, 1.9));
        c.poly([[15, 8], [17, 3], [22, 3], [23, 8]], hex('#8a6a4a')); // cardboard
        c.rect(23, 6, 25, 8, C.white);
        dots(c, X.BLK, [12, 2, 19, 1, 24, 3]); // flies
      }
    },
    sw: 18,
    sh: 26,
    s(c, u) {
      const b = 24,
        G = hex('#7d8580'),
        LID = hex('#3f4a5a');
      c.box(2, 9, 15, b - 3, G);
      c.col(8, 10, b - 4, D(G));
      c.rect(7, 12, 9, 13, X.BLK);
      c.speckle(3, 15, 14, b - 4, C.rust, 8, 4);
      wheel(c, 4, b - 1, 1);
      wheel(c, 13, b - 1, 1);
      if (!u) {
        c.poly([[2, 8], [3, 5], [8, 4], [15, 8]], LID);
        c.line(3, 5, 8, 4, L(LID));
        c.row(8, 2, 15, D(LID));
      } else {
        c.rect(1, 3, 6, 5, LID);
        c.rect(3, 7, 14, 8, C.night);
        c.oval(7, 4, 13, 9, X.BAG);
        c.set(9, 5, mix(X.BAG, 1.9));
      }
    },
  });

  {
    const BIKE = hex('#3d6468');
    const hoop = (c, x, b) => {
      c.col(x, 9, b, STEEL);
      c.col(x + 4, 9, b, D(STEEL));
      c.row(8, x + 1, x + 3, STEEL);
    };
    obj('bike-rack-one-bike', 'bike rack bicycle stand hoops one bike chained stolen wheel', {
      w: 36,
      h: 23,
      base: 'side',
      f(c, u) {
        const b = 21;
        c.row(b, 1, 34, X.CONC);
        hoop(c, 2, b - 1);
        hoop(c, 28, b - 1);
        wheel(c, 23, b - 5, 4, X.BLK, X.CHR); // the front wheel, locked to the hoop
        if (!u) {
          wheel(c, 8, b - 5, 4, X.BLK, X.CHR);
          c.line(8, b - 5, 13, b - 11, BIKE);
          c.line(13, b - 11, 21, b - 12, BIKE);
          c.line(13, b - 11, 15, b - 5, BIKE);
          c.line(15, b - 5, 21, b - 12, BIKE);
          c.line(8, b - 5, 15, b - 5, BIKE);
          c.line(21, b - 13, 23, b - 5, X.CHR);
          c.rect(11, b - 13, 14, b - 13, X.BLK); // saddle
          c.col(13, b - 12, b - 11, X.CHR);
          c.rect(20, b - 15, 23, b - 15, X.BLK);
          c.col(21, b - 14, b - 13, X.CHR);
          c.set(15, b - 4, X.CHR);
        } else {
          cable(c, [[14, b], [17, b - 1], [19, b]], X.CHR); // a cut cable, and that is all
          c.set(13, b - 1, C.red);
        }
        hoop(c, 15, b - 1);
        dots(c, C.navy, [19, b - 6, 20, b - 5, 19, b - 4]); // the lock
      },
      sw: 13,
      sh: 23,
      s(c, u) {
        const b = 21;
        c.row(b, 1, 11, X.CONC);
        c.rect(3, 8, 4, b - 1, STEEL);
        c.col(3, 8, b - 1, L(STEEL));
        c.rect(7, b - 10, 8, b - 1, X.BLK); // the wheel edge on
        c.col(7, b - 10, b - 1, mix(X.BLK, 1.6));
        if (!u) {
          c.col(8, b - 14, b - 10, X.CHR);
          c.row(b - 15, 4, 11, X.BLK);
          c.rect(7, b - 13, 8, b - 12, BIKE);
        } else c.set(5, b - 1, C.red);
        dots(c, C.navy, [5, b - 6, 6, b - 5]);
      },
    });
  }

  {
    const PRAM = C.navy,
      BL = hex('#b8a0a4');
    obj('pram-under-stairs', 'pram baby carriage under the stairs hood blanket old pram wheels', {
      w: 26,
      h: 25,
      base: 'side',
      f(c, u) {
        const b = 23;
        wheel(c, 7, b - 3, 3, C.white, X.CHR);
        wheel(c, 18, b - 3, 3, C.white, X.CHR);
        c.line(5, 16, 20, 18, X.CHR); // springs
        c.line(5, 18, 20, 16, X.CHR);
        c.poly([[3, 9], [21, 9], [19, 15], [5, 15]], PRAM);
        c.row(9, 3, 21, C.white);
        c.row(12, 4, 20, D(PRAM));
        c.line(21, 9, 24, 4, X.CHR); // handle
        c.rect(23, 3, 24, 4, X.BLK);
        if (!u) {
          c.poly([[2, 9], [3, 4], [7, 2], [12, 3], [12, 9]], PRAM); // the hood up
          c.line(3, 4, 12, 9, D(PRAM));
          c.line(7, 2, 12, 9, D(PRAM));
          c.line(3, 4, 7, 2, L(PRAM));
          c.rect(13, 7, 20, 8, BL); // tucked in
          c.row(7, 13, 20, L(BL));
        } else {
          c.rect(1, 7, 4, 9, PRAM); // the hood folded
          c.row(7, 1, 4, L(PRAM));
          c.row(8, 5, 20, C.night); // nobody in it
          c.rect(14, 8, 18, 15, BL); // the blanket pulled out over the side
          c.rect(15, 16, 18, 19, BL);
          c.col(16, 9, 19, D(BL));
          c.set(18, 20, BL);
        }
      },
      sw: 16,
      sh: 25,
      s(c, u) {
        const b = 23;
        c.rect(2, b - 6, 3, b, C.white);
        c.rect(12, b - 6, 13, b, C.white);
        c.row(b - 3, 4, 11, X.CHR);
        c.row(17, 3, 12, X.CHR);
        if (!u) {
          c.oval(2, 2, 13, 14, PRAM); // the hood behind
          c.oval(4, 4, 11, 12, D(PRAM));
        } else c.rect(3, 7, 12, 9, PRAM);
        c.box(3, 9, 12, 15, PRAM);
        c.row(9, 3, 12, C.white);
        c.row(4, 2, 13, X.CHR); // the handle towards us
        c.set(2, 5, X.CHR);
        c.set(13, 5, X.CHR);
        if (!u) c.rect(5, 8, 10, 8, BL);
        else {
          c.row(8, 4, 11, C.night);
          c.rect(8, 8, 11, 16, BL);
          c.col(9, 9, 16, D(BL));
        }
      },
    });
  }

  obj('notice-board-hall', 'notice board hall cork board notices missing poster residents association', {
    w: 28,
    h: 20,
    p: true,
    f(c, u) {
      c.box(1, 1, 26, 18, C.wood);
      c.rect(2, 2, 25, 17, CORK);
      c.speckle(2, 2, 25, 17, D(CORK), 6, 3);
      const note = (x0, y0, x1, y1, col, head) => {
        c.rect(x0, y0, x1, y1, col);
        if (head) c.row(y0 + 1, x0 + 1, x1 - 1, head);
        for (let y = y0 + 3; y < y1; y += 2) c.row(y, x0 + 1, x1 - 1, hex('#8a877c'));
        c.set((x0 + x1) >> 1, y0, C.red);
      };
      note(3, 3, 8, 10, C.white, C.navy);
      note(4, 12, 9, 16, hex('#c8b860'));
      note(18, 9, 24, 16, X.PINK, X.BLK);
      if (!u) {
        note(11, 3, 16, 12, C.white, C.red); // MISSING
        c.rect(12, 6, 15, 9, hex('#8a877c'));
        c.rect(13, 7, 14, 8, C.flesh);
        note(19, 3, 23, 7, C.paper);
      } else {
        c.rect(11, 3, 16, 12, L(CORK)); // torn down: the pale place where it hung
        c.rect(11, 3, 14, 4, C.white);
        c.set(13, 3, C.red);
        c.set(12, 5, C.white);
        c.line(19, 3, 24, 7, C.blood); // and something scrawled
        c.line(24, 3, 19, 7, C.blood);
        c.line(11, 14, 16, 15, C.blood);
      }
    },
    sw: 5,
    sh: 20,
    s(c, u) {
      c.rect(1, 1, 2, 18, C.wood);
      c.col(1, 1, 18, L(C.wood));
      c.col(3, 3, 16, C.white);
      c.set(3, 11, X.PINK);
      c.set(3, 13, X.PINK);
      if (u) c.rect(3, 5, 3, 9, CORK);
    },
  });

  obj('caretaker-cupboard-door', 'caretaker cupboard janitor store private door mop broom bucket bleach', {
    w: 22,
    h: 40,
    U: { w: 26, x(c) {
      c.rect(21, 5, 23, 38, L(hex('#7a7f78')));
      c.col(23, 5, 38, D(hex('#7a7f78')));
    } },
    f(c, u) {
      const b = 38,
        G = hex('#7a7f78');
      c.box(1, 2, 20, b, FRAME);
      if (!u) {
        door(c, 3, 4, 18, b, G, '', X.BLK);
        vents(c, 5, 7, 16, 13, D(G));
        vents(c, 5, 28, 16, 34, D(G));
        c.rect(7, 17, 14, 20, C.white);
        c.row(18, 8, 13, C.red);
        c.rect(16, 21, 17, 23, X.CHR);
        c.set(16, 25, X.BLK);
      } else {
        hole(c, 3, 4, 18, b, C.night);
        c.row(11, 3, 18, G);
        bottle(c, 5, 10, 5, C.navy); // bleach and worse
        bottle(c, 8, 10, 4, C.mustard);
        bottle(c, 11, 10, 5, C.white);
        c.rect(14, 8, 16, 10, C.rust);
        c.line(6, 14, 8, b - 1, C.woodPale); // the mop
        c.rect(4, 12, 8, 15, C.ghost);
        dots(c, D(C.ghost), [5, 14, 7, 13]);
        c.line(12, 13, 11, b - 1, C.woodPale); // a broom
        c.rect(9, b - 3, 13, b - 1, hex('#8a6f42'));
        c.poly([[13, b - 7], [18, b - 7], [17, b - 1], [14, b - 1]], C.red); // bucket
        c.row(b - 7, 13, 18, L(C.red));
        c.row(b - 6, 14, 17, C.blood);
        c.rect(15, 16, 17, 22, hex('#5a6a52')); // his coat on a nail
        c.set(16, 15, X.CHR);
      }
      c.speckle(1, 2, 2, b, GRIME, 6, 2);
    },
    sw: 8,
    sh: 40,
    SU: { w: 17, x(c) {
      c.rect(7, 5, 14, 38, L(hex('#7a7f78')));
      c.col(14, 5, 38, D(hex('#7a7f78')));
      vents(c, 8, 8, 13, 14, hex('#7a7f78'));
      vents(c, 8, 28, 13, 34, hex('#7a7f78'));
    } },
    s(c, u) {
      const b = 38;
      c.box(1, 2, 6, b, FRAME);
      c.col(6, 4, b, u ? C.night : hex('#7a7f78'));
      c.speckle(1, 2, 5, b, GRIME, 6, 2);
    },
  });

  obj('electricity-meters-row', 'electricity meters row meter board block of flats coin meter wires bypass', {
    w: 30,
    h: 22,
    p: true,
    f(c, u) {
      c.box(1, 3, 28, 19, hex('#3a2c24'));
      for (let i = 0; i < 4; i++) {
        const x = 3 + i * 6;
        c.col(x + 2, 1, 4, X.GREY); // conduit
        c.box(x, 5, x + 4, 13, X.BLK);
        c.rect(x + 1, 6, x + 3, 8, C.white);
        c.row(7, x + 1, x + 3, hex('#8a877c'));
        c.row(10, x + 1, x + 3, X.CHR); // the wheel going round
        c.set(x + 1 + ((i + (u ? 1 : 0)) % 3), 10, C.red);
        c.rect(x + 1, 15, x + 3, 16, C.paper);
        c.set(x + 2, 12, i === 2 ? C.red : C.brass); // the seal
      }
      c.box(25, 6, 27, 12, X.GREY); // the main switch
      c.rect(26, u ? 10 : 7, 26, u ? 11 : 8, C.red);
      if (u) {
        cable(c, [[11, 14], [13, 18], [17, 18], [19, 14]], C.red); // somebody has bridged one
        dots(c, C.flameLight, [11, 13, 19, 13]);
        c.set(17, 12, X.BLK);
      }
    },
    sw: 7,
    sh: 22,
    s(c, u) {
      c.rect(1, 3, 2, 19, hex('#3a2c24'));
      c.rect(3, 5, 5, 13, X.BLK);
      c.col(5, 6, 8, C.white);
      c.col(3, 1, 4, X.GREY);
      if (u) cable(c, [[4, 14], [5, 17], [4, 19]], C.red);
    },
  });

  obj('fire-hose-reel-red', 'fire hose reel red wall hose nozzle emergency block of flats', {
    w: 19,
    h: 21,
    p: true,
    U: { w: 32, h: 26, dy: 0, x(c) {
      cable(c, [[13, 16], [15, 21], [19, 24], [29, 24]], C.bone);
      cable(c, [[14, 16], [16, 21], [20, 23], [28, 23]], D(C.bone));
      c.rect(29, 23, 30, 24, C.brass);
      c.row(24, 22, 26, X.WATERL);
    } },
    f(c, u) {
      c.rect(8, 1, 10, 3, X.GREY); // the arm it swings on
      c.oval(1, 2, 17, 18, FIRE);
      c.oval(3, 4, 15, 16, u ? D(FIRE) : C.bone);
      if (!u) for (let a = 0; a < 20; a++) c.set(Math.round(9 + 4.4 * Math.cos(a / 3.2)), Math.round(10 + 4.4 * Math.sin(a / 3.2)), D(C.bone));
      else c.oval(5, 6, 13, 14, C.bone);
      c.oval(7, 8, 11, 12, FIRE);
      c.set(9, 10, X.CHR);
      c.set(4, 4, L(FIRE));
      if (!u) {
        c.col(15, 14, 18, C.bone);
        c.rect(15, 18, 16, 19, C.brass);
      }
    },
    sw: 10,
    sh: 21,
    SU: { w: 14, h: 26, dy: 0, x(c) {
      cable(c, [[6, 17], [7, 22], [11, 24]], C.bone);
      c.rect(11, 23, 12, 24, C.brass);
    } },
    s(c, u) {
      c.rect(1, 8, 2, 12, X.GREY);
      c.rect(3, 2, 4, 18, FIRE);
      c.rect(7, 2, 8, 18, FIRE);
      c.col(3, 2, 18, L(FIRE));
      c.rect(5, u ? 6 : 4, 6, u ? 14 : 16, C.bone);
      for (let y = 5; y <= 15; y += 2) c.row(y, 5, 6, D(C.bone));
      if (u) {
        c.rect(5, 4, 6, 5, D(FIRE));
        c.rect(5, 15, 6, 16, D(FIRE));
      }
    },
  });

  {
    const ext = (flip) => (c) => {
      const b = 16,
        m = (x) => (flip ? 7 - x : x);
      c.rect(2, 5, 5, b, FIRE);
      c.col(m(2) > 3 ? 5 : 2, 5, b, L(FIRE));
      c.rect(2, 9, 5, 11, C.paper);
      c.row(10, 3, 4, X.BLK);
      c.rect(3, 3, 4, 4, X.CHR);
      c.rect(m(2), 2, m(4), 2, X.BLK); // the lever
      c.set(m(5), 3, C.mustard);
      c.col(m(6), 4, 10, X.BLK); // hose
      c.set(m(5), 4, X.BLK);
      c.row(b, 2, 5, D(FIRE));
      c.row(7, 2, 5, X.GREY); // the bracket's strap
    };
    const fire = (flip) => (c, u) => {
      if (!u) return ext(flip)(c);
      c.stamp(turn(8, 18, ext(flip), flip), flip ? 0 : 6, 2);
      const x0 = flip ? 17 : 1; // what came out of it
      for (let i = 0; i < 3; i++) c.oval(x0 + i * 2 - (i ? 1 : 0), 6 - (i % 2), x0 + i * 2 + 2, 9, i % 2 ? C.white : C.ghost);
    };
    obj('fire-extinguisher-bracket', 'fire extinguisher red on bracket wall emergency foam powder', {
      w: 8,
      h: 18,
      p: true,
      U: { own: true, w: 24, h: 11 },
      f: fire(false),
      sw: 8,
      sh: 18,
      SU: { own: true, w: 24, h: 11 },
      s: fire(true),
    });
  }

  obj('radiator-cast-iron-hall', 'radiator cast iron column radiator hall leaking rusty valve', {
    w: 30,
    h: 19,
    f(c, u) {
      const b = 17,
        P = hex('#b8b09a');
      for (let x = 3; x <= 24; x += 3) {
        c.rect(x, 3, x + 1, b - 2, P);
        c.col(x, 3, b - 2, L(P));
        c.set(x, 2, P);
        c.set(x + 1, 2, D(P));
        c.col(x + 2, 4, b - 3, mix(P, 0.45));
      }
      c.clearRect(26, 4, 26, b - 3);
      c.row(4, 3, 25, D(P));
      c.row(b - 3, 3, 25, D(P));
      legs(c, [3, 24], b - 1, b, P, 2);
      c.rect(26, b - 5, 27, b - 4, C.brass); // valve
      c.rect(27, b - 7, 27, b - 6, X.BLK);
      c.col(27, b - 3, b, C.brass);
      c.speckle(3, 9, 25, b - 2, C.rust, 7, 5);
      if (u) {
        c.col(26, b - 3, b - 1, X.WATERL);
        c.col(24, 8, b - 2, C.rust);
        puddle(c, 18, 28, b, hex('#5a4a3a'));
        wisp(c, 28, b - 8, 3);
      }
    },
    sw: 8,
    sh: 19,
    s(c, u) {
      const b = 17,
        P = hex('#b8b09a');
      c.rect(2, 2, 5, b - 2, P);
      c.col(2, 2, b - 2, L(P));
      c.col(4, 4, b - 3, mix(P, 0.45));
      c.rect(2, b - 1, 5, b, P);
      c.speckle(2, 8, 5, b - 2, C.rust, 5, 5);
      c.rect(6, b - 5, 6, b - 4, C.brass);
      if (u) puddle(c, 3, 6, b, hex('#5a4a3a'));
    },
  });

  obj('strip-light-flickering', 'strip light fluorescent tube ceiling light flickering dead flies stairwell', {
    w: 28,
    h: 9,
    p: true,
    f(c, u) {
      const M = hex('#b0ada0');
      c.rect(1, 1, 26, 2, M);
      c.row(1, 1, 26, L(M));
      c.rect(2, 3, 3, 4, X.GREY);
      c.rect(24, 3, 25, 4, X.GREY);
      c.rect(4, 3, 23, 4, u ? C.white : hex('#8a8c88'));
      c.rect(4, 3, 6, 4, hex('#5a5a58')); // one end gone black
      c.rect(21, 3, 23, 4, u ? C.glow : hex('#5a5a58'));
      dots(c, X.BLK, [10, 2, 15, 2, 16, 2]); // flies in the fitting
      if (u) {
        for (let y = 5; y <= 7; y++) for (let x = 6 + (y - 5); x <= 22 - (y - 5); x++) if ((x + y) % 2 === 0) c.set(x, y, C.glow);
      } else {
        c.set(25, 5, C.ash); // a thread of web
        c.set(24, 6, C.ash);
        c.set(24, 7, C.ash);
      }
    },
    sw: 7,
    sh: 9,
    s(c, u) {
      const M = hex('#b0ada0');
      c.rect(1, 1, 5, 2, M);
      c.row(1, 1, 5, L(M));
      c.rect(2, 3, 4, 4, u ? C.white : hex('#8a8c88'));
      if (u) dots(c, C.glow, [2, 5, 4, 5, 3, 6]);
    },
  });

  obj('intercom-panel-flats', 'intercom panel door entry buzzers name plates block of flats bell push', {
    w: 12,
    h: 21,
    p: true,
    f(c, u) {
      c.box(1, 1, 10, 19, STEEL);
      grille(c, 3, 3, 8, 5, X.GREY, X.BLK);
      for (let j = 0; j < 5; j++) {
        const y = 7 + j * 2;
        c.rect(2, y, 4, y, j === 3 ? hex('#2a2420') : C.paper); // one name burnt out
        c.set(5, y, u && j === 1 ? X.AMBER : X.GREYL);
        c.rect(7, y, 9, y, j === 0 ? STEEL : C.paper);
        c.set(6, y, X.GREYL);
      }
      c.set(5, 17, X.BLK);
      dots(c, D(STEEL), [2, 18, 9, 18, 2, 2, 9, 2]);
      if (u) {
        c.rect(2, 9, 4, 9, STEEL); // and a name pulled out
        c.set(9, 4, X.LEDR);
      }
    },
    sw: 5,
    sh: 21,
    s(c, u) {
      c.rect(1, 1, 2, 19, STEEL);
      c.col(1, 1, 19, L(STEEL));
      c.col(3, 7, 15, X.GREYL);
      if (u) c.set(3, 9, X.AMBER);
    },
  });

  obj('laundry-washer-coin', 'laundry room washing machine coin operated launderette suds flood', {
    w: 16,
    h: 25,
    f(c, u) {
      const b = 23,
        M = hex('#c2c2b8');
      c.box(1, 6, 14, b - 1, M);
      c.box(8, 1, 14, 6, X.GREY); // the coin box
      c.rect(10, 2, 12, 2, X.BLK);
      c.rect(9, 4, 12, 4, u ? X.LEDR : mix(X.LEDR, 0.35));
      c.rect(2, 4, 6, 6, D(M)); // soap
      c.oval(3, 9, 12, 18, X.CHR);
      c.oval(4, 10, 11, 17, u ? X.WATERL : mix(C.glass, 0.55));
      if (u) {
        c.rect(5, 13, 10, 16, C.water);
        c.row(12, 5, 10, C.white);
        dots(c, C.white, [6, 11, 9, 11]);
        c.rect(6, 15, 8, 16, C.wine);
        dots(c, C.white, [4, 19, 6, 20, 5, 21, 8, b - 1]); // suds coming out under the door
        puddle(c, 2, 13, b);
        dots(c, C.white, [4, b, 9, b]);
      } else c.set(5, 11, C.glassLight);
      c.rect(2, b, 13, b, X.BLK);
      c.speckle(2, 19, 13, b - 2, C.rust, 12, 2);
    },
    sw: 14,
    sh: 25,
    s(c, u) {
      const b = 23,
        M = hex('#c2c2b8');
      c.box(1, 6, 12, b - 1, M);
      c.rect(7, 1, 12, 6, X.GREY);
      c.col(12, 9, 18, X.CHR);
      c.rect(2, b, 11, b, X.BLK);
      vents(c, 3, 9, 6, 13, D(M));
      if (u) {
        c.set(12, 4, X.LEDR);
        puddle(c, 9, 12, b);
      }
    },
  });

  obj('laundry-dryers-stacked', 'laundry room tumble dryers stacked launderette big dryer sheets', {
    w: 18,
    h: 40,
    U: { w: 21, dx: 3, x(c) {
      c.rect(1, 24, 3, 35, STEEL); // the lower door swung out
      c.col(1, 26, 33, C.glass);
      c.rect(8, 36, 16, 38, C.white); // sheets coming out onto the floor
      c.row(36, 9, 15, D(C.white));
      c.rect(14, 37, 18, 38, X.PINK);
    } },
    f(c, u) {
      const b = 38;
      c.box(1, 2, 16, b, STEEL);
      c.oval(3, 4, 14, 15, X.CHR);
      c.oval(4, 5, 13, 14, u ? hex('#7a4a2c') : mix(C.glass, 0.55));
      if (u) c.dither(4, 5, 13, 14, X.AMBER); // the top one going round, hot
      else c.set(6, 7, C.glassLight);
      c.rect(2, 17, 15, 21, X.BLK);
      c.oval(4, 18, 6, 20, X.CHR);
      leds(c, 9, 19, 3, 2, u, [X.LEDR, X.AMBER, X.LEDG]);
      c.oval(3, 23, 14, 34, X.CHR);
      c.oval(4, 24, 13, 33, u ? C.night : mix(C.glass, 0.55));
      if (!u) c.set(6, 26, C.glassLight);
      else {
        c.rect(6, 29, 12, 33, C.white);
        c.rect(7, 34, 13, 36, C.white);
        c.col(9, 29, 36, D(C.white));
        c.rect(10, 30, 12, 32, X.PINK);
      }
      vents(c, 4, 36, 13, 37, D(STEEL));
    },
    sw: 14,
    sh: 40,
    SU: { w: 21, x(c) {
      c.row(24, 12, 19, STEEL);
      c.row(25, 12, 19, C.glass);
      c.rect(12, 30, 15, 37, C.white);
      c.col(13, 31, 37, D(C.white));
      c.rect(13, 37, 18, 38, C.white);
    } },
    s(c, u) {
      const b = 38;
      c.box(1, 2, 12, b, STEEL);
      c.col(12, 5, 14, X.CHR);
      c.col(12, 24, 33, u ? C.night : X.CHR);
      c.col(12, 17, 21, X.BLK);
      vents(c, 3, 6, 6, 12, D(STEEL));
      vents(c, 3, 25, 6, 31, D(STEEL));
      if (u) c.set(12, 19, X.LEDG);
    },
  });

  obj('drying-rack-folding', 'drying rack clothes airer washing laundry folding rack socks shirts', {
    w: 28,
    h: 21,
    p: true,
    f(c, u) {
      const b = 19,
        r = rnd(5);
      c.line(8, 4, 19, b, X.GREYL);
      c.line(19, 4, 8, b, X.GREYL);
      c.row(3, 1, 26, C.white);
      c.row(4, 1, 26, X.GREYL);
      if (!u) {
        for (let x = 2; x <= 23; ) {
          const w = 1 + ((r() * 3) | 0),
            col = LAUNDRY[(r() * LAUNDRY.length) | 0];
          cloth(c, x, 3, x + w, 7 + ((r() * 7) | 0), col);
          c.row(3, x, x + w, L(col));
          x += w + 2;
        }
      } else {
        cloth(c, 21, 3, 22, 7, C.red); // one small sock forgotten
        c.set(23, 7, C.red);
        dots(c, C.woodPale, [4, 2, 9, 2, 14, 2]); // pegs
        c.row(b, 3, 6, X.WATERL);
      }
    },
    sw: 15,
    sh: 21,
    s(c, u) {
      const b = 19;
      c.line(7, 4, 3, b, X.GREYL);
      c.line(7, 4, 11, b, X.GREYL);
      c.row(11, 5, 9, X.GREYL);
      c.row(3, 1, 13, C.white);
      c.row(4, 1, 13, X.GREYL);
      if (!u) {
        cloth(c, 1, 3, 3, 13, X.DENIM);
        cloth(c, 5, 3, 6, 9, C.white);
        cloth(c, 8, 3, 9, 11, C.wine);
        cloth(c, 11, 3, 13, 12, C.mustard);
      } else cloth(c, 11, 3, 12, 7, C.red);
    },
  });

  obj('balcony-railing-washing', 'balcony railing with washing line wired glass panels concrete block of flats', {
    w: 36,
    h: 24,
    f(c, u) {
      const b = 22,
        GL = hex('#6f8582'),
        r = rnd(11);
      c.rect(1, b - 1, 34, b, X.CONC);
      c.row(b - 1, 1, 34, L(X.CONC));
      c.speckle(1, b - 1, 34, b, X.CONCD, 4, 2);
      c.col(2, 1, 9, X.GREY); // the poles of the line
      c.col(33, 1, 9, X.GREY);
      c.row(2, 2, 33, C.bone);
      for (const x of [1, 12, 23, 33]) c.rect(x, 9, x + 1, b - 2, C.iron);
      c.row(9, 1, 34, C.ironDark);
      for (const x of [3, 14, 25]) {
        c.rect(x, 11, x + (x === 25 ? 7 : 8), b - 3, GL);
        for (let y = 12; y < b - 3; y += 3) c.row(y, x, x + (x === 25 ? 7 : 8), D(GL));
        c.set(x + 1, 11, L(GL));
      }
      c.line(15, b - 4, 19, 13, C.glassLight); // cracked
      c.line(19, 13, 21, 16, C.glassLight);
      c.speckle(1, 10, 34, b - 2, C.rust, 14, 4);
      if (!u) {
        for (let x = 4; x <= 30; ) {
          const w = 1 + ((r() * 4) | 0),
            col = LAUNDRY[(r() * LAUNDRY.length) | 0];
          cloth(c, x, 3, x + w, 5 + ((r() * 4) | 0), col);
          x += w + 2;
        }
      } else {
        dots(c, C.woodPale, [6, 3, 11, 3, 17, 3, 24, 3]); // pegs, and one sheet that got away
        c.rect(26, 8, 31, 14, C.white);
        c.col(28, 9, 14, D(C.white));
        c.rect(27, 15, 30, 16, C.white);
      }
    },
    sw: 9,
    sh: 24,
    s(c, u) {
      const b = 22;
      c.rect(1, b - 1, 7, b, X.CONC);
      c.row(b - 1, 1, 7, L(X.CONC));
      c.col(6, 1, 9, X.GREY);
      c.rect(6, 9, 7, b - 2, C.iron);
      c.row(9, 5, 7, C.ironDark);
      if (!u) cloth(c, 5, 3, 7, 8, X.DENIM);
      else c.rect(7, 8, 7, 15, C.white);
    },
  });

  {
    const dish = (c, x, y, d, lx = 1) => {
      c.oval(x, y, x + d, y + d, DISH);
      c.oval(x + 1, y + 1, x + d - 1, y + d - 1, mix(DISH, 0.82));
      c.oval(x + 1, y + 1, x + d - 2, y + d - 2, mix(DISH, 0.92));
      c.set(x + 2, y + 2, L(DISH));
      const cx = x + (d >> 1),
        cy = y + (d >> 1);
      c.line(x + 1, y + d - 1, cx + lx, cy, X.GREY);
      c.rect(cx + lx, cy, cx + lx + 1, cy, X.BLK);
    };
    obj('satellite-dishes-wall', 'satellite dishes on wall cluster of dishes cables block of flats television', {
      w: 26,
      h: 24,
      p: true,
      f(c, u) {
        c.rect(5, 9, 6, 12, X.GREY); // brackets
        c.rect(19, 7, 20, 10, X.GREY);
        c.rect(12, 19, 13, 21, X.GREY);
        dish(c, 1, 1, 9);
        dish(c, 16, 2, 7, 0);
        if (!u) dish(c, 9, 12, 8);
        else {
          c.oval(12, 14, 16, 22, DISH); // one hangs by its cable, face to the wall
          c.oval(13, 15, 15, 21, D(DISH));
          cable(c, [[13, 19], [14, 13]], X.BLK);
          c.set(12, 18, C.rust);
        }
        cable(c, [[6, 11], [8, 15], [7, 22]], X.BLK);
        cable(c, [[20, 9], [22, 14], [21, 22]], X.BLK);
        cable(c, [[13, 21], [14, 22]], X.BLK);
        c.speckle(1, 1, 24, 20, C.rust, 22, 3);
        for (let y = 11; y <= 16; y += 2) c.set(4, y, C.rust); // rust runs down the wall
      },
      sw: 14,
      sh: 24,
      s(c, u) {
        const arc = (x, y0, y1) => {
          const m = (y0 + y1) / 2,
            h = (y1 - y0) / 2;
          for (let y = y0; y <= y1; y++) {
            const t = (y - m) / h,
              xx = Math.round(x + 3 - 3 * (1 - t * t));
            c.rect(xx, y, x + 3, y, DISH);
            c.set(xx, y, L(DISH));
          }
          c.line(x + 4, y1 - 1, x + 6, Math.round(m), X.GREY);
          c.rect(x + 6, Math.round(m) - 1, x + 7, Math.round(m), X.BLK);
        };
        c.rect(1, 5, 3, 6, X.GREY);
        c.rect(1, 15, 3, 16, X.GREY);
        arc(3, 1, 10);
        if (!u) arc(3, 12, 20);
        else {
          c.rect(3, 15, 4, 22, DISH);
          c.col(3, 15, 22, L(DISH));
          c.col(5, 12, 15, X.BLK);
        }
        cable(c, [[2, 7], [1, 12], [2, 22]], X.BLK);
      },
    });
  }
};
