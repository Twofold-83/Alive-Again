/* Modern home, part 2: the hall, the small rooms, the things that stand about. See env-modern.js. */
module.exports = (T, obj) => {
  const { C, hex, mix, blend, rnd, turn, D, L, X, dots, legs, panel, door, hole, scr, led, leds, vents, grille, cable, cord, wisp, puddle, wheel, bottle, cup, cloth, stuff, shoes } = T;
  const PHONE = hex('#b7a98a'),
    UV = hex('#8f86c8'),
    UVL = hex('#c3bce6'),
    TERRA = hex('#8a5238');

  obj('radiator-panel-socks', 'radiator white panel central heating thermostat valve socks drying', {
    w: 26,
    h: 18,
    f(c, u) {
      const b = 16;
      c.col(3, 13, b, C.brass);
      c.col(22, 13, b, C.brass);
      c.box(2, 4, 23, 13, X.APW);
      for (let x = 5; x <= 21; x += 3) c.col(x, 5, 12, D(X.APW));
      c.row(4, 2, 23, mix(X.APW, 0.6));
      c.rect(1, 12, 2, 14, C.white); // the valve
      c.set(1, 13, X.GREY);
      c.speckle(3, 10, 22, 12, C.rust, 14, 2);
      if (u) {
        cloth(c, 5, 2, 6, 8, C.wine); // socks and a tea towel
        c.set(7, 8, C.wine);
        cloth(c, 9, 2, 10, 7, C.wine);
        c.set(11, 7, C.wine);
        c.rect(14, 2, 20, 9, C.white);
        c.row(2, 14, 20, L(C.white));
        c.row(8, 14, 20, C.navy);
        c.col(17, 3, 7, D(C.white));
        c.set(15, 15, X.WATERL);
      }
    },
    sw: 8,
    sh: 18,
    p: false,
    s(c, u) {
      const b = 16;
      c.col(3, 13, b, C.brass);
      c.rect(2, 4, 4, 13, X.APW);
      c.col(2, 4, 13, L(X.APW));
      c.row(4, 2, 4, mix(X.APW, 0.6));
      c.rect(5, 12, 6, 13, C.white);
      if (u) {
        c.rect(1, 2, 5, 3, C.white);
        c.rect(5, 3, 5, 9, C.white);
        c.set(5, 8, C.navy);
        c.col(1, 3, 7, C.wine);
      }
    },
  });

  obj('pedestal-fan-ribbons', 'standing fan pedestal fan electric fan cage ribbons summer', {
    w: 15,
    h: 33,
    f(c, u) {
      const b = 31;
      c.row(b, 3, 11, X.GREY);
      c.row(b - 1, 4, 10, X.GREYL);
      c.rect(7, 14, 7, b - 2, X.CHR);
      c.rect(6, 20, 8, 22, X.GREY); // the switch box
      led(c, 7, 21, u, X.LEDG);
      c.oval(1, 1, 13, 13, X.CHR); // the cage
      c.oval(2, 2, 12, 12, u ? hex('#8e9aa0') : hex('#4a5058'));
      if (u) c.dither(2, 2, 12, 12, hex('#aab6ba'));
      else {
        c.line(7, 7, 4, 3, X.GREYL); // three blades standing still
        c.line(7, 7, 11, 5, X.GREYL);
        c.line(7, 7, 6, 11, X.GREYL);
        c.line(7, 7, 5, 3, X.GREYL);
        c.line(7, 7, 11, 6, X.GREYL);
        c.line(7, 7, 7, 11, X.GREYL);
      }
      c.line(1, 7, 13, 7, X.CHR);
      c.line(7, 1, 7, 13, X.CHR);
      c.rect(6, 6, 8, 8, X.GREY);
      c.set(7, 7, X.CHR);
      if (u) {
        c.line(4, 13, 2, 17, C.red); // ribbons flying
        c.line(8, 13, 10, 18, C.red);
        c.line(11, 12, 13, 16, C.red);
      } else {
        c.col(4, 13, 17, C.red);
        c.col(8, 13, 18, C.red);
        c.col(11, 12, 16, C.red);
      }
    },
    sw: 12,
    sh: 33,
    SU: { w: 19, x(c) {
      c.line(10, 5, 16, 3, C.red);
      c.line(10, 8, 17, 9, C.red);
      c.line(10, 11, 15, 14, C.red);
    } },
    s(c, u) {
      const b = 31;
      c.row(b, 2, 9, X.GREY);
      c.row(b - 1, 3, 8, X.GREYL);
      c.rect(5, 14, 5, b - 2, X.CHR);
      c.rect(4, 20, 6, 22, X.GREY);
      c.rect(2, 5, 6, 9, X.GREY); // the motor
      c.row(5, 2, 6, X.GREYL);
      c.rect(5, 10, 5, 13, X.GREY);
      c.oval(6, 1, 9, 13, X.CHR);
      c.col(8, 3, 11, u ? hex('#aab6ba') : hex('#4a5058'));
      c.col(7, 2, 12, X.CHR);
      if (!u) {
        c.col(9, 12, 17, C.red);
        c.col(9, 4, 5, C.red);
      }
    },
  });

  obj('answerphone-hall-table', 'telephone table answering machine hall table phone book answerphone message', {
    w: 17,
    h: 24,
    f(c, u) {
      const b = 22,
        W = X.TEAK;
      c.rect(1, 11, 15, 12, W);
      c.row(11, 1, 15, L(W));
      legs(c, [2, 13], 13, b, W, 2);
      c.row(18, 4, 12, D(W));
      c.rect(5, 15, 11, 17, C.mustard); // the phone book
      c.row(15, 5, 11, L(C.mustard));
      c.row(17, 5, 11, C.paper);
      c.box(2, 8, 8, 10, PHONE); // telephone
      dots(c, X.GREY, [4, 9, 6, 9]);
      c.rect(10, 8, 14, 10, X.BLK); // the machine
      c.rect(11, 9, 12, 9, X.GREY);
      led(c, 14, 9, u);
      if (!u) {
        c.row(7, 1, 9, PHONE);
        c.set(1, 8, PHONE);
        c.set(9, 8, PHONE);
        c.row(6, 2, 8, L(PHONE));
      } else {
        dots(c, X.BLK, [3, 7, 7, 7]); // the cradle empty, the receiver hanging
        cord(c, 2, 11, 17, PHONE);
        c.rect(1, 17, 2, b - 1, PHONE);
        c.set(1, 17, L(PHONE));
        c.set(15, 8, X.LEDR);
        c.set(14, 7, mix(X.LEDR, 0.6));
      }
    },
    sw: 13,
    sh: 24,
    s(c, u) {
      const b = 22,
        W = X.TEAK;
      c.rect(1, 11, 11, 12, W);
      c.row(11, 1, 11, L(W));
      legs(c, [2, 9], 13, b, W, 2);
      c.row(18, 4, 8, D(W));
      c.rect(4, 15, 8, 17, C.mustard);
      c.row(17, 4, 8, C.paper);
      c.box(3, 8, 8, 10, PHONE);
      c.rect(3, 6, 4, 7, X.BLK);
      led(c, 4, 7, u);
      if (!u) {
        c.rect(5, 6, 8, 7, PHONE);
        c.row(6, 5, 8, L(PHONE));
      } else {
        cord(c, 9, 11, 17, PHONE);
        c.rect(9, 17, 10, b - 1, PHONE);
      }
    },
  });

  obj('shoe-rack-hall', 'shoe rack hall shoes boots wellingtons trainers mud', {
    w: 26,
    h: 16,
    p: true,
    f(c, u) {
      const b = 14;
      c.col(1, 3, b, X.CHR);
      c.col(24, 3, b, X.CHR);
      c.row(8, 2, 23, X.PINE);
      c.row(b - 1, 2, 23, X.PINE);
      c.row(3, 1, 24, X.CHR);
      if (!u) {
        shoes(c, 3, 7, 5, 3);
        shoes(c, 4, b - 2, 5, 8);
      } else {
        shoes(c, 3, 7, 2, 3);
        shoes(c, 16, b - 2, 2, 8);
        for (const x of [5, 9]) {
          c.rect(x, b - 7, x + 1, b - 2, C.forest); // wellingtons, wet
          c.rect(x, b - 3, x + 2, b - 2, C.forest);
          c.set(x, b - 7, L(C.forest));
          c.set(x + 1, b - 2, C.earth);
        }
        c.row(b, 4, 13, C.earth);
        dots(c, C.earth, [15, b, 18, b, 21, b]);
      }
    },
    sw: 11,
    sh: 16,
    s(c, u) {
      const b = 14;
      c.col(1, 3, b, X.CHR);
      c.col(9, 3, b, X.CHR);
      c.row(3, 1, 9, X.CHR);
      c.row(8, 2, 8, X.PINE);
      c.row(b - 1, 2, 8, X.PINE);
      if (!u) {
        c.rect(3, 6, 7, 7, X.BLK);
        c.rect(3, 5, 5, 5, X.BLK);
        c.rect(3, b - 3, 7, b - 2, C.wine);
        c.rect(3, b - 4, 5, b - 4, C.wine);
      } else {
        c.rect(3, 6, 7, 7, X.BLK);
        c.rect(3, 5, 5, 5, X.BLK);
        c.rect(3, b - 7, 5, b - 2, C.forest);
        c.rect(3, b - 3, 7, b - 2, C.forest);
        c.row(b, 3, 9, C.earth);
      }
    },
  });

  obj('coat-hooks-rail', 'coat hooks rail hall coats anorak duffle coat raincoat scarf pegs', {
    w: 28,
    h: 26,
    p: true,
    f(c, u) {
      const b = 24;
      c.rect(1, 2, 26, 3, X.PINE);
      c.row(2, 1, 26, L(X.PINE));
      for (let x = 4; x <= 24; x += 5) c.set(x, 4, C.brass);
      const RAIN = hex('#9a927a');
      c.rect(13, 4, 19, 22, RAIN); // the long raincoat stays
      c.col(13, 4, 22, L(RAIN));
      c.col(16, 6, 22, D(RAIN));
      c.row(14, 13, 19, D(RAIN));
      c.set(15, 4, C.brass);
      if (!u) {
        c.rect(2, 4, 8, 18, C.navy); // duffle coat
        c.col(2, 4, 18, L(C.navy));
        c.col(5, 6, 18, D(C.navy));
        dots(c, C.bone, [4, 8, 4, 11, 4, 14]);
        c.rect(9, 5, 12, 14, C.mustard); // anorak
        c.col(9, 5, 14, L(C.mustard));
        c.row(14, 9, 12, D(C.mustard));
        c.rect(21, 4, 22, 14, C.wine); // scarf
        c.rect(23, 4, 24, 11, C.wine);
        dots(c, C.bone, [21, 15, 22, 15, 23, 12, 24, 12]);
      } else {
        c.rect(20, b - 1, 26, b, C.wine); // the scarf on the floor
        dots(c, C.bone, [26, b - 1, 20, b]);
        c.set(18, 12, C.blood);
        c.set(18, 13, C.blood);
      }
    },
    sw: 8,
    sh: 26,
    s(c, u) {
      const b = 24,
        RAIN = hex('#9a927a');
      c.rect(1, 2, 2, 3, X.PINE);
      c.set(3, 4, C.brass);
      c.rect(2, 5, 5, 22, RAIN);
      c.col(5, 6, 22, D(RAIN));
      if (!u) {
        c.rect(3, 5, 6, 18, C.navy);
        c.col(3, 5, 18, L(C.navy));
        c.col(6, 6, 14, C.wine);
      } else c.rect(3, b - 1, 6, b, C.wine);
    },
  });

  obj('umbrella-pot-glazed', 'umbrella stand pot brown glazed umbrellas walking stick hall', {
    w: 11,
    h: 22,
    p: true,
    f(c, u) {
      const b = 20,
        POT = hex('#6a3f2c');
      c.col(7, 4, 12, C.woodLight); // the stick
      c.row(3, 7, 8, C.woodLight);
      c.set(8, 4, C.woodLight);
      if (!u) {
        c.col(3, 3, 12, C.black); // two umbrellas
        c.rect(3, 6, 4, 12, C.black);
        c.row(2, 2, 3, C.woodDark);
        c.set(2, 3, C.woodDark);
        c.col(5, 5, 12, C.wine);
        c.rect(5, 8, 6, 12, C.wine);
        c.row(4, 5, 6, C.bone);
      } else {
        c.col(4, 5, 12, C.wine);
        c.rect(4, 8, 5, 12, C.wine);
        c.row(4, 4, 5, C.bone);
        puddle(c, 1, 5, b);
      }
      c.box(2, 12, 8, b, POT);
      c.row(14, 2, 8, D(POT));
      c.row(15, 3, 7, L(POT));
      c.set(3, 17, mix(POT, 1.5));
    },
    sw: 11,
    sh: 22,
    s(c, u) {
      const b = 20,
        POT = hex('#6a3f2c');
      c.col(3, 3, 12, C.woodLight);
      if (!u) {
        c.rect(5, 3, 6, 12, C.black);
        c.col(5, 2, 3, C.woodDark);
        c.rect(7, 5, 7, 12, C.wine);
        c.set(7, 4, C.bone);
      } else {
        c.rect(6, 5, 6, 12, C.wine);
        c.set(6, 4, C.bone);
        puddle(c, 5, 9, b);
      }
      c.box(2, 12, 8, b, POT);
      c.row(14, 2, 8, D(POT));
      c.row(15, 3, 7, L(POT));
    },
  });

  obj('wall-phone-slimline', 'wall telephone slimline phone coiled cord kitchen phone off the hook', {
    w: 10,
    h: 24,
    p: true,
    f(c, u) {
      c.box(2, 2, 7, 13, PHONE);
      if (!u) {
        c.rect(3, 1, 6, 14, D(PHONE)); // the receiver on its hook
        c.col(3, 1, 14, PHONE);
        c.rect(3, 1, 6, 3, PHONE);
        c.rect(3, 12, 6, 14, PHONE);
        cord(c, 4, 15, 20, D(PHONE));
        c.set(6, 20, D(PHONE));
        cord(c, 6, 15, 19, D(PHONE));
      } else {
        for (let y = 5; y <= 11; y += 2) dots(c, X.GREY, [3, y, 5, y, 6, y]);
        c.rect(3, 3, 6, 3, X.BLK);
        cord(c, 4, 14, 16, D(PHONE));
        c.rect(3, 17, 5, 22, D(PHONE)); // dangling
        c.col(3, 17, 22, PHONE);
        c.rect(3, 17, 5, 18, PHONE);
        c.rect(3, 21, 5, 22, PHONE);
      }
    },
    sw: 8,
    sh: 24,
    s(c, u) {
      c.rect(1, 2, 3, 13, PHONE);
      c.col(1, 2, 13, L(PHONE));
      if (!u) {
        c.rect(4, 1, 5, 14, PHONE);
        c.col(4, 4, 11, D(PHONE));
        c.set(6, 2, PHONE);
        c.set(6, 13, PHONE);
        cord(c, 4, 15, 20, D(PHONE));
      } else {
        c.set(4, 3, X.BLK);
        cord(c, 4, 14, 16, D(PHONE));
        c.rect(4, 17, 5, 22, PHONE);
        c.set(6, 17, PHONE);
        c.set(6, 22, PHONE);
      }
    },
  });

  obj('fuse-cupboard-hall', 'fuse cupboard consumer unit hall electricity meter trip switches', {
    w: 17,
    h: 16,
    p: true,
    U: { w: 20, x(c) {
      c.rect(16, 3, 18, 14, L(X.APW));
      c.col(18, 3, 14, D(X.APW));
    } },
    f(c, u) {
      c.box(1, 1, 15, 14, X.APW);
      if (!u) {
        door(c, 2, 2, 14, 13, X.APW, 'l', X.GREY);
        c.oval(8, 5, 12, 9, C.glass); // the little window on the meter
        c.set(10, 7, C.red);
        c.set(9, 6, C.glassLight);
      } else {
        hole(c, 2, 2, 14, 13, hex('#3a3a40'));
        c.box(3, 3, 7, 8, X.BLK); // the meter
        c.rect(4, 4, 6, 5, C.white);
        c.row(7, 4, 6, C.red);
        for (let x = 9; x <= 13; x += 2) {
          c.rect(x, 4, x, 7, X.BLK);
          c.set(x, x === 11 ? 6 : 4, x === 11 ? C.red : C.white); // one has tripped
        }
        c.rect(3, 10, 5, 12, C.red);
        c.set(4, 11, C.white);
        cable(c, [[8, 10], [10, 12], [13, 10]], C.rust);
        cable(c, [[7, 11], [12, 12]], C.navy);
      }
    },
    sw: 7,
    sh: 16,
    SU: { w: 16, x(c) {
      c.rect(6, 3, 13, 14, L(X.APW));
      c.col(13, 3, 14, D(X.APW));
      c.row(3, 6, 13, C.white);
    } },
    s(c, u) {
      c.box(1, 1, 5, 14, X.APW);
      c.col(5, 2, 13, u ? hex('#3a3a40') : D(X.APW));
    },
  });

  obj('bean-bag-orange', 'bean bag orange seat beanbag teenager room', {
    w: 21,
    h: 14,
    p: true,
    f(c, u) {
      const b = 12,
        O = X.ORANGE;
      c.oval(1, 4, 19, b + 3, O);
      c.oval(4, 2, 16, 9, O);
      c.clearRect(0, b + 1, 20, b + 4);
      c.line(5, 4, 3, 10, D(O));
      c.line(15, 4, 17, 10, D(O));
      c.row(3, 7, 13, L(O));
      c.set(10, 2, D(O));
      if (u) {
        c.clearRect(6, 1, 14, 3); // someone sat a hollow into it
        c.rect(6, 4, 14, 6, D(O));
        c.row(4, 7, 13, mix(O, 0.5));
        c.row(7, 7, 13, L(O));
        dots(c, C.white, [18, b, 19, b - 1, 16, b]); // and it loses its beans
      }
    },
    sw: 17,
    sh: 14,
    s(c, u) {
      const b = 12,
        O = X.ORANGE;
      c.oval(1, 4, 15, b + 3, O);
      c.oval(3, 2, 12, 9, O);
      c.clearRect(0, b + 1, 16, b + 4);
      c.line(4, 4, 3, 10, D(O));
      c.line(11, 4, 13, 10, D(O));
      c.row(3, 6, 10, L(O));
      if (u) {
        c.clearRect(5, 1, 11, 3);
        c.rect(5, 4, 11, 6, D(O));
        c.row(4, 6, 10, mix(O, 0.5));
        c.row(7, 6, 10, L(O));
        dots(c, C.white, [14, b, 15, b - 1]);
      }
    },
  });

  obj('lava-lamp-plum', 'lava lamp retro lamp plum wax glow', {
    w: 8,
    h: 18,
    p: true,
    f(c, u) {
      const b = 16,
        G = u ? hex('#a8482e') : hex('#3c2a3a');
      c.rect(3, 1, 4, 3, X.CHR);
      c.rect(2, 4, 5, 11, G);
      c.rect(3, 3, 4, 3, G);
      c.col(2, 5, 10, L(G));
      if (u) {
        c.rect(3, 9, 4, 10, C.flameLight);
        c.set(4, 6, C.flameLight);
        c.set(3, 5, X.AMBER);
        c.set(3, 7, X.AMBER);
      } else c.rect(3, 10, 4, 11, hex('#5a4458'));
      c.rect(2, 12, 5, 13, X.CHR);
      c.rect(1, 14, 6, b, X.CHR);
      c.row(14, 2, 5, L(X.CHR));
      c.clear(1, 14);
      c.clear(6, 14);
    },
  });

  obj('portable-tv-red', 'portable television small tv red plastic aerial kitchen bedroom static', {
    w: 16,
    h: 17,
    f(c, u) {
      const b = 15,
        R = hex('#8a3a34');
      c.line(7, 5, 3, 1, X.CHR);
      c.line(8, 5, 12, 1, X.CHR);
      c.row(5, 5, 10, X.BLK); // the handle
      c.box(1, 6, 14, b - 1, R);
      c.rect(2, 7, 10, b - 2, X.BLK);
      scr(c, 3, 8, 9, b - 3, u, 'static', 6);
      dots(c, X.CHR, [12, 8, 12, 10]);
      vents(c, 12, 12, 13, b - 2, D(R));
      legs(c, [2, 12], b, b, X.BLK, 2);
    },
    sw: 13,
    sh: 17,
    s(c, u) {
      const b = 15,
        R = hex('#8a3a34');
      c.line(6, 5, 2, 1, X.CHR);
      c.row(5, 5, 8, X.BLK);
      c.poly([[2, 8], [6, 6], [10, 6], [10, b - 1], [2, b - 2]], R);
      c.col(10, 6, b - 1, L(R));
      vents(c, 3, 9, 5, 12, D(R));
      c.col(11, 7, b - 2, u ? C.stoneLight : X.SCR0);
      if (u) dots(c, C.white, [11, 8, 11, 11]);
      legs(c, [3, 9], b, b, X.BLK, 2);
    },
  });

  obj('vhs-tape-tower', 'video tape rack vhs cassettes tower films tape pulled out', {
    w: 12,
    h: 28,
    U: { w: 19, x(c) {
      c.rect(11, 24, 16, 26, X.BLK); // tapes on the floor, one gutted
      c.rect(12, 25, 15, 25, C.paper);
      cable(c, [[13, 23], [16, 21], [14, 18], [17, 15], [15, 13]], hex('#4a3626'));
      cable(c, [[16, 23], [17, 20]], hex('#4a3626'));
    } },
    f(c, u) {
      const b = 26,
        r = rnd(5);
      c.box(1, 2, 10, b, X.BLK);
      for (let y = 4; y <= b - 2; y += 2) {
        const gone = u && [8, 10, 14, 20].includes(y);
        c.row(y, 2, 9, gone ? C.night : mix(X.BLK, 1.5));
        if (!gone) c.row(y, 4, 7, [C.paper, C.white, C.mustard, C.paper, C.wine, C.paper][(r() * 6) | 0]);
        else r();
      }
      c.row(b, 1, 10, X.GREY);
    },
    sw: 9,
    sh: 28,
    SU: { w: 15, x(c) {
      c.rect(8, 24, 12, 26, X.BLK);
      cable(c, [[10, 23], [12, 21], [10, 18], [12, 15]], hex('#4a3626'));
    } },
    s(c, u) {
      const b = 26;
      c.box(1, 2, 7, b, X.BLK);
      for (let y = 4; y <= b - 2; y += 2) c.set(7, y, u && [8, 10, 14, 20].includes(y) ? C.night : C.paper);
      c.row(b, 1, 7, X.GREY);
      vents(c, 3, 6, 4, 20, mix(X.BLK, 1.4));
    },
  });

  obj('sunbed-canopy-home', 'sunbed tanning bed solarium canopy uv tubes violet light spare room', {
    w: 44,
    h: 27,
    base: 'side',
    f(c, u) {
      const b = 25,
        B = X.APW,
        T0 = u ? UVL : hex('#8a8898');
      c.rect(2, 4, 4, b, X.GREY); // the stand at the head end
      c.col(2, 4, b, X.GREYL);
      c.row(b, 1, 8, X.GREY);
      c.box(3, 3, 41, 8, B); // the canopy
      c.row(9, 5, 39, T0);
      c.rect(8, 5, 12, 6, X.GREY); // the timer
      led(c, 14, 5, u, X.LEDR);
      c.box(5, 16, 41, 20, B); // the bench
      c.row(15, 6, 40, T0);
      legs(c, [7, 37], 21, b, X.GREY, 2);
      c.row(b, 36, 40, X.GREY);
      c.speckle(4, 4, 40, 7, mix(B, 0.85), 12, 2);
      if (u) {
        for (let y = 10; y <= 14; y++) for (let x = 6; x <= 39; x++) if ((x + y) % 2 === 0) c.set(x, y, UV);
        c.row(10, 5, 39, UV);
        c.row(14, 6, 40, UV);
        c.rect(20, 14, 22, 14, X.BLK); // goggles left behind
        c.rect(24, 14, 26, 14, X.BLK);
      }
    },
    sw: 18,
    sh: 27,
    s(c, u) {
      const b = 25,
        B = X.APW,
        T0 = u ? UVL : hex('#8a8898');
      c.rect(7, 4, 10, b, X.GREY);
      c.col(7, 4, b, X.GREYL);
      c.row(b, 3, 14, X.GREY);
      c.box(1, 3, 16, 8, B);
      c.row(9, 2, 15, T0);
      c.box(2, 16, 15, 20, B);
      c.row(15, 3, 14, T0);
      c.rect(7, 10, 10, 14, X.GREY);
      if (u) {
        for (let y = 10; y <= 14; y++) for (let x = 2; x <= 15; x++) if ((x + y) % 2 === 0) c.set(x, y, UV);
        c.row(10, 2, 15, UV);
        c.row(14, 3, 14, UV);
      }
    },
  });

  {
    const SEA = hex('#6d7460'),
      LAND = C.parchment;
    const globe = (seed) => (c, u) => {
      const b = c.h - 2,
        oy = b - 25,
        r = rnd(seed);
      // the stand
      c.line(4, oy + 14, 2, b - 1, C.wood);
      c.line(13, oy + 14, 15, b - 1, C.wood);
      c.rect(8, oy + 15, 9, b - 1, C.wood);
      c.row(oy + 21, 3, 14, C.woodLight);
      c.row(oy + 22, 3, 14, C.woodDark);
      dots(c, C.brass, [2, b, 15, b, 8, b]);
      c.oval(2, oy + 1, 15, oy + 14, SEA);
      for (let i = 0; i < 26; i++) {
        const x = 3 + ((r() * 12) | 0),
          y = oy + 2 + ((r() * 12) | 0);
        if (c.get(x, y) && c.get(x + 1, y)) c.rect(x, y, x + 1, y, LAND);
      }
      c.row(oy + 8, 1, 16, C.brass); // the brass band where it opens
      if (u) {
        for (let y = oy + 1; y <= oy + 7; y++) for (let x = 1; x <= 16; x++) c.clear(x, y);
        c.oval(2, oy - 5, 15, oy + 7, SEA); // the lid tipped back
        c.oval(3, oy - 3, 14, oy + 7, mix(SEA, 0.45));
        c.row(oy + 8, 1, 16, C.brass);
        bottle(c, 4, oy + 7, 6, C.forest);
        bottle(c, 7, oy + 7, 7, hex('#7a5a22'));
        bottle(c, 10, oy + 7, 5, C.glassLight);
        c.rect(13, oy + 5, 13, oy + 7, C.glassLight);
        c.set(7, oy, C.red);
      }
    };
    obj('globe-drinks-cabinet', 'globe drinks cabinet bar world globe cocktail bottles living room', {
      w: 18,
      h: 28,
      U: { own: true, h: 33 },
      f: globe(3),
      sw: 18,
      sh: 28,
      SU: { own: true, h: 33 },
      s: globe(11),
    });
  }

  obj('trouser-press-teak', 'trouser press teak electric bedroom valet trousers', {
    w: 13,
    h: 30,
    f(c, u) {
      const b = 28,
        W = X.TEAK;
      c.row(b, 1, 11, X.BLK);
      c.box(2, 4, 10, b - 1, W);
      c.row(2, 1, 11, X.BLK); // the bar across the top
      c.set(1, 3, X.BLK);
      c.set(11, 3, X.BLK);
      panel(c, 4, 6, 8, b - 6, W);
      c.rect(4, b - 4, 5, b - 3, X.BLK); // the timer
      led(c, 8, b - 4, u);
      if (u) {
        c.rect(3, 1, 9, 3, C.slate); // trouser bottoms coming out at the top
        c.col(6, 1, 3, D(C.slate));
        c.col(11, 6, 18, X.BLK);
        wisp(c, 5, 0, 1);
      }
    },
    sw: 9,
    sh: 30,
    SU: { own: true, w: 13 },
    s(c, u) {
      const b = 28,
        W = X.TEAK;
      c.row(b, 1, c.w - 3, X.BLK);
      c.rect(2, 4, 4, b - 1, W);
      c.col(2, 4, b - 1, L(W));
      c.rect(2, 2, 4, 3, X.BLK);
      if (!u) {
        c.rect(5, 4, 6, b - 1, D(W));
        c.set(6, 12, X.BLK);
      } else {
        c.line(5, b - 1, 9, 5, D(W)); // the front let down a little
        c.line(6, b - 1, 10, 5, W);
        c.rect(5, 2, 6, b - 6, C.slate);
        c.set(10, 4, X.BLK);
      }
    },
  });

  obj('bedside-cabinet-clock-radio', 'bedside cabinet clock radio alarm glass of water night table pills', {
    w: 15,
    h: 19,
    f(c, u) {
      const b = 17,
        F = hex('#c2b8a2');
      c.box(1, 7, 13, b, F);
      c.row(7, 1, 13, X.TEAK);
      door(c, 2, 13, 12, b - 1, F, 't', X.TEAK);
      c.rect(2, 4, 9, 6, hex('#4a3626')); // the clock radio
      c.rect(3, 5, 7, 5, u ? X.LEDR : mix(X.LEDR, 0.4));
      if (u) c.set(5, 5, hex('#4a3626'));
      c.set(8, 5, X.GREY);
      if (!u) {
        door(c, 2, 9, 12, 11, F, 'm', X.TEAK);
        c.rect(11, 4, 12, 6, C.glassLight);
        c.row(6, 11, 12, X.WATERL);
      } else {
        c.rect(2, 9, 12, 9, C.night); // the drawer out
        door(c, 2, 10, 12, 12, F, 'm', X.TEAK);
        c.rect(4, 9, 5, 9, C.white);
        c.set(8, 9, X.AMBER);
        c.rect(10, 6, 12, 6, C.glassLight); // the glass over
        c.col(13, 7, 11, X.WATERL);
      }
    },
    sw: 13,
    sh: 19,
    SU: { w: 16, x(c) {
      c.rect(11, 10, 13, 12, hex('#c2b8a2'));
      c.row(9, 11, 13, C.night);
      c.col(13, 10, 12, D(hex('#c2b8a2')));
    } },
    s(c, u) {
      const b = 17,
        F = hex('#c2b8a2');
      c.box(1, 7, 11, b, F);
      c.row(7, 1, 11, X.TEAK);
      c.rect(4, 4, 9, 6, hex('#4a3626'));
      c.set(10, 5, u ? X.LEDR : mix(X.LEDR, 0.4));
      if (!u) c.rect(2, 4, 3, 6, C.glassLight);
      else c.rect(1, 6, 3, 6, C.glassLight);
    },
  });

  obj('sewing-machine-table', 'sewing machine on table electric sewing fabric thread spare room', {
    w: 27,
    h: 25,
    f(c, u) {
      const b = 23,
        W = X.TEAK,
        M = hex('#bdb8a6'),
        FAB = hex('#9a6a72');
      c.rect(1, 13, 25, 14, W);
      c.row(13, 1, 25, L(W));
      c.rect(2, 15, 3, b, W);
      c.box(17, 15, 24, b, W);
      door(c, 18, 16, 23, 18, W, 'm', C.brass);
      door(c, 18, 19, 23, b - 1, W, 'm', C.brass);
      c.rect(6, 11, 19, 12, M); // the machine
      c.rect(15, 5, 19, 10, M);
      c.rect(6, 4, 19, 7, M);
      c.rect(6, 8, 8, 9, M);
      c.row(4, 6, 19, L(M));
      c.col(7, 10, 10, X.CHR); // needle
      c.rect(20, 5, 20, 8, X.GREY); // hand wheel
      c.set(17, 9, X.BLK);
      c.rect(12, 2, 13, 3, C.red); // a reel of thread
      c.rect(8, b - 1, 11, b, X.BLK); // the pedal
      cable(c, [[11, b - 1], [14, 18], [16, 15]], X.BLK);
      if (u) {
        c.rect(1, 11, 13, 12, FAB); // cloth running through
        c.rect(1, 13, 5, 19, FAB);
        c.col(3, 13, 19, D(FAB));
        dots(c, C.bone, [2, 11, 5, 12, 9, 11, 2, 15, 4, 17]);
        c.rect(1, 20, 6, b, FAB);
        c.row(b, 1, 8, D(FAB));
        c.set(9, 8, C.flameLight); // its little lamp
        c.set(9, 9, C.glow);
      }
    },
    sw: 14,
    sh: 25,
    s(c, u) {
      const b = 23,
        W = X.TEAK,
        M = hex('#bdb8a6'),
        FAB = hex('#9a6a72');
      c.rect(1, 13, 12, 14, W);
      c.row(13, 1, 12, L(W));
      c.box(2, 15, 11, b, W);
      c.rect(4, 4, 9, 12, M);
      c.row(4, 4, 9, L(M));
      c.oval(5, 5, 8, 8, X.GREY); // the hand wheel faces us
      c.set(6, 6, X.CHR);
      c.rect(6, 2, 7, 3, C.red);
      if (u) {
        c.rect(10, 12, 12, 12, FAB);
        c.rect(12, 13, 12, 20, FAB);
      }
    },
  });

  obj('electric-fire-two-bar', 'electric fire two bar heater fake coals teak surround glow', {
    w: 23,
    h: 17,
    f(c, u) {
      const b = 15,
        W = X.TEAK,
        BAR = u ? X.AMBER : hex('#8a8478');
      c.box(1, 2, 21, b, W);
      c.rect(3, 4, 19, 9, u ? hex('#7a4a2c') : hex('#6a6a70')); // the reflector
      c.row(4, 3, 19, u ? hex('#a8642e') : X.CHR);
      c.row(5, 4, 18, BAR);
      c.row(8, 4, 18, BAR);
      if (u) {
        c.row(6, 4, 18, hex('#a8482e'));
        c.row(9, 4, 18, hex('#a8482e'));
      }
      for (let x = 6; x <= 16; x += 5) c.col(x, 4, 9, X.GREY); // the guard
      c.rect(3, 11, 19, 13, C.black); // the coals
      const r = rnd(4);
      for (let x = 3; x <= 19; x++) if (r() < 0.5) c.set(x, 11 + ((r() * 2) | 0), u ? (r() < 0.5 ? C.flame : C.red) : C.stoneDark);
      c.row(b, 1, 21, C.woodDark);
      dots(c, X.GREY, [20, 5]);
      led(c, 20, 7, u);
    },
    sw: 9,
    sh: 17,
    SU: { w: 12, x(c) {
      dots(c, T.X.AMBER, [9, 6, 9, 9, 10, 12]);
      dots(c, C.flame, [9, 12]);
    } },
    s(c, u) {
      const b = 15,
        W = X.TEAK;
      c.box(1, 2, 7, b, W);
      c.col(7, 4, 9, u ? X.AMBER : X.CHR);
      c.col(7, 11, 13, u ? C.red : C.black);
      c.row(b, 1, 7, C.woodDark);
      vents(c, 3, 4, 4, 8, D(W));
    },
  });

  obj('hostess-trolley-teak', 'hostess trolley heated food trolley teak dinner party dishes castors', {
    w: 29,
    h: 24,
    f(c, u) {
      const b = 22,
        W = X.TEAK;
      c.box(2, 9, 26, 18, W);
      c.rect(1, 7, 27, 8, X.CHR);
      c.row(7, 1, 27, L(X.CHR));
      c.rect(1, 9, 1, 12, X.BLK); // handles
      c.rect(27, 9, 27, 12, X.BLK);
      door(c, 4, 11, 13, 17, W, 'r', X.BLK);
      c.rect(22, 11, 24, 13, X.BLK);
      led(c, 23, 15, u);
      legs(c, [3, 24], 19, b - 2, X.CHR, 2);
      wheel(c, 4, b - 1, 1);
      wheel(c, 25, b - 1, 1);
      const FOOD = [hex('#6f8a3c'), hex('#7a5a30'), hex('#c8b98a')];
      for (let i = 0; i < 3; i++) {
        const x = 4 + i * 8;
        if (!u) {
          c.rect(x, 5, x + 5, 6, C.glassLight); // glass lids
          c.row(4, x + 1, x + 4, C.glassLight);
          c.set(x + 2, 3, X.BLK);
          c.set(x + 3, 3, X.BLK);
        } else {
          c.rect(x, 6, x + 5, 6, FOOD[i]);
          dots(c, L(FOOD[i]), [x + 1, 6, x + 4, 6]);
          wisp(c, x + 2, 5, 4);
        }
      }
      if (u) {
        hole(c, 14, 11, 20, 17, mix(W, 0.3));
        for (let y = 13; y <= 16; y++) c.row(y, 15, 19, y % 2 ? C.white : D(C.white)); // plates keeping warm
      } else door(c, 14, 11, 20, 17, W, 'l', X.BLK);
    },
    sw: 15,
    sh: 24,
    s(c, u) {
      const b = 22,
        W = X.TEAK;
      c.box(2, 9, 12, 18, W);
      c.rect(1, 7, 13, 8, X.CHR);
      c.row(7, 1, 13, L(X.CHR));
      c.row(10, 4, 10, X.BLK);
      legs(c, [3, 10], 19, b - 2, X.CHR, 2);
      wheel(c, 4, b - 1, 1);
      wheel(c, 11, b - 1, 1);
      if (!u) {
        c.rect(4, 5, 10, 6, C.glassLight);
        c.row(4, 5, 9, C.glassLight);
        c.set(7, 3, X.BLK);
      } else {
        c.rect(4, 6, 10, 6, hex('#c8b98a'));
        wisp(c, 6, 5, 4);
        wisp(c, 9, 5, 3);
      }
    },
  });

  {
    const BIN = hex('#c9bf9f');
    const bin = (side) => (c, u) => {
      const b = c.h - 2;
      c.box(2, b - 9, 8, b - 1, BIN);
      c.row(b, 2, 8, X.BLK);
      dots(c, X.ORANGE, [4, b - 7, 6, b - 7, 4, b - 5, 6, b - 5]); // a flower on it
      c.set(5, b - 6, C.mustard);
      c.set(5, b - 4, C.leafLight);
      c.rect(side ? 8 : 4, b, side ? 9 : 6, b, X.BLK); // the pedal
      if (!u) {
        c.rect(2, b - 11, 8, b - 10, BIN);
        c.row(b - 12, 3, 7, L(BIN));
        c.set(5, b - 13, X.BLK);
      } else {
        if (side) c.line(2, b - 11, 1, b - 17, BIN);
        else {
          c.rect(2, b - 17, 8, b - 12, D(BIN)); // the lid up
          c.row(b - 17, 3, 7, BIN);
        }
        c.rect(3, b - 11, 7, b - 10, C.paper); // full to the top
        c.set(4, b - 12, C.white);
        c.rect(6, b - 12, 7, b - 11, C.mustard);
        c.set(8, b - 10, C.mustard);
        c.set(3, b - 10, C.rust);
        dots(c, C.paper, [9, b, 9, b - 1]);
      }
    };
    obj('pedal-bin-flower', 'pedal bin kitchen bin rubbish flower pattern overflowing', {
      w: 11,
      h: 16,
      p: true,
      U: { own: true, h: 20 },
      f: bin(false),
      sw: 11,
      sh: 16,
      SU: { own: true, h: 20 },
      s: bin(true),
    });
  }

  obj('floor-speaker-teak', 'loudspeaker floor speaker hi-fi teak cabinet cloth grille woofer', {
    w: 13,
    h: 25,
    U: { w: 18, x(c) {
      c.poly([[12, 23], [14, 4], [16, 4], [15, 23]], hex('#3a2c24')); // the cloth front leant against it
      c.line(12, 23, 14, 4, hex('#5a463a'));
    } },
    f(c, u) {
      const b = 23,
        W = X.TEAK;
      c.box(1, 2, 11, b, W);
      if (!u) {
        grille(c, 2, 3, 10, b - 2, hex('#3a2c24'), hex('#4a3a30'));
        c.set(9, b - 3, C.brass);
      } else {
        c.rect(2, 3, 10, b - 2, hex('#2c2a30'));
        c.oval(5, 4, 7, 6, X.GREY); // tweeter
        c.set(6, 5, X.CHR);
        c.oval(3, 8, 9, 14, X.GREY); // woofer
        c.oval(4, 9, 8, 13, X.BLK);
        c.set(6, 11, X.GREY);
        c.oval(3, 15, 9, 20, X.GREY);
        c.oval(4, 16, 8, 19, X.BLK);
        c.line(5, 16, 7, 19, C.night); // slashed
      }
    },
    sw: 11,
    sh: 25,
    SU: { w: 15, x(c) {
      c.line(10, 23, 12, 4, hex('#5a463a'));
      c.line(11, 23, 13, 4, hex('#3a2c24'));
    } },
    s(c, u) {
      const b = 23,
        W = X.TEAK;
      c.box(1, 2, 9, b, W);
      c.col(9, 3, b - 2, u ? hex('#2c2a30') : hex('#3a2c24'));
      c.speckle(2, 3, 8, b - 1, mix(W, 0.85), 7, 4);
      dots(c, C.brass, [3, b - 4, 3, b - 6]);
    },
  });

  {
    const LEAFD = hex('#7a6a3a');
    const yucca = (seed) => (c) => {
      const b = 30,
        r = rnd(seed);
      c.poly([[4, 24], [10, 24], [9, b], [5, b]], TERRA);
      c.row(24, 3, 11, L(TERRA));
      c.row(25, 4, 10, C.earth);
      c.rect(6, 12, 8, 23, C.woodPale);
      for (let y = 13; y <= 23; y += 3) c.row(y, 6, 8, D(C.woodPale));
      for (let i = 0; i < 11; i++) {
        const a = Math.PI * (0.05 + (0.9 * i) / 10) + (r() - 0.5) * 0.2,
          len = 8 + r() * 3,
          col = i % 3 === 0 ? C.leaf : i % 4 === 1 ? LEAFD : C.leafLight;
        c.line(7, 11, 7 - Math.cos(a) * 6, 11 - Math.sin(a) * len + 1, col);
      }
      c.line(7, 11, 2, 14, C.leaf);
      c.line(7, 11, 12, 15, LEAFD);
    };
    const fall = (seed, right) => (c, u) => {
      if (!u) return yucca(seed)(c);
      c.stamp(turn(15, 32, yucca(seed), right), right ? 0 : 0, 3);
      const x = right ? 9 : 21;
      dots(c, C.earth, [x - 2, 16, x, 16, x + 1, 16, x + 3, 16]); // the soil out
    };
    obj('yucca-plant-pot', 'yucca house plant palm in pot terracotta living room knocked over soil', {
      w: 15,
      h: 32,
      p: true,
      U: { own: true, w: 32, h: 18 },
      f: fall(3, false),
      sw: 15,
      sh: 32,
      SU: { own: true, w: 32, h: 18 },
      s: fall(8, true),
    });
  }

  {
    const QUILT = hex('#7a3a3c'),
      BASE = hex('#a89c84'),
      HB = hex('#5a4a40');
    obj('divan-bed-teenager', 'divan bed single bed teenager duvet striped quilt headboard bedroom', {
      w: 40,
      h: 18,
      base: 'side',
      f(c, u) {
        const b = 16;
        c.rect(1, 2, 2, b - 2, HB);
        c.col(1, 2, b - 2, L(HB));
        c.box(3, 10, 38, b - 1, BASE);
        for (let x = 6; x < 38; x += 4) c.set(x, 12, D(BASE));
        legs(c, [4, 36], b, b, X.BLK, 2);
        c.rect(3, 8, 38, 9, C.white); // mattress
        c.row(9, 3, 38, D(C.white));
        c.rect(4, 6, 9, 7, C.white); // pillow
        c.row(6, 5, 8, L(C.white));
        if (!u) {
          c.rect(10, 6, 38, 9, QUILT);
          c.row(6, 11, 37, L(QUILT));
          for (let x = 12; x < 38; x += 5) c.col(x, 7, 9, C.navy);
          c.rect(34, 10, 38, 11, QUILT);
        } else {
          c.poly([[24, 9], [27, 4], [35, 4], [38, 7], [38, 11], [24, 11]], QUILT);
          c.line(24, 9, 27, 4, L(QUILT));
          c.row(4, 27, 35, L(QUILT));
          c.col(30, 5, 11, C.navy);
          c.col(35, 5, 11, C.navy);
          dots(c, D(C.white), [12, 8, 15, 8, 19, 8, 6, 7]);
          c.rect(13, 7, 15, 7, X.BLK); // a cassette player left in the bed
          c.set(16, 7, X.GREY);
        }
      },
      sw: 20,
      sh: 32,
      s(c, u) {
        const b = 30;
        c.box(1, 2, 18, 10, HB);
        dots(c, D(HB), [5, 5, 9, 5, 13, 5]);
        c.rect(2, 9, 17, b - 8, C.white);
        c.rect(5, 10, 14, 13, C.white);
        c.row(13, 5, 14, D(C.white));
        c.row(9, 2, 17, D(C.white));
        c.rect(2, 16, 17, b - 8, QUILT);
        c.row(16, 2, 17, L(QUILT));
        for (let x = 4; x < 17; x += 4) c.col(x, 17, b - 8, C.navy);
        if (u) {
          c.poly([[2, 14], [14, 14], [2, b - 10]], C.white);
          dots(c, D(C.white), [4, 16, 7, 15, 4, 19]);
          c.line(14, 14, 2, b - 10, D(QUILT));
          c.poly([[15, 15], [15, b - 9], [4, b - 9]], L(QUILT));
          c.rect(5, 17, 7, 17, X.BLK);
        }
        c.rect(2, b - 7, 17, b - 6, D(QUILT));
        c.box(1, b - 5, 18, b - 1, BASE);
        for (let x = 4; x < 18; x += 4) c.set(x, b - 3, D(BASE));
        legs(c, [2, 16], b, b, X.BLK, 2);
      },
    });
  }
};
