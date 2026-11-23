/* Electronics, part 1: the big machines. See env-modern.js for obj() and the helpers. */
module.exports = (T, obj) => {
  const { C, hex, mix, blend, rnd, turn, D, L, X, dots, legs, panel, door, hole, scr, led, leds, vents, grille, cable, cord, wisp, puddle, wheel, bottle, cup, cloth, stuff } = T;
  const RACK = hex('#3a3c46'),
    IBM = hex('#51607a'),
    HAMMER = hex('#5c6a62'), // hammered green-grey machine paint
    KIOSK = hex('#4a5670'),
    TICKET = hex('#a08a3a'),
    SPARK = C.flameLight;
  /** A thick limb from a to b. */
  const limb = (c, x0, y0, x1, y1, w, col) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1,
      h = (w - 1) / 2;
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n,
        y = y0 + ((y1 - y0) * i) / n;
      c.rect(Math.round(x - h), Math.round(y - h), Math.round(x + h), Math.round(y + h), col);
    }
    c.line(Math.round(x0 - h), Math.round(y0 - h), Math.round(x1 - h), Math.round(y1 - h), L(col));
  };
  const joint = (c, x, y, r, col = X.BLK) => {
    c.oval(x - r, y - r, x + r, y + r, col);
    c.set(x, y, X.CHR);
  };
  const hazard = (c, x0, y, x1, y1 = y) => {
    for (let yy = y; yy <= y1; yy++) for (let x = x0; x <= x1; x++) c.set(x, yy, (x + yy) % 4 < 2 ? X.HAZ : X.BLK);
  };
  const sparks = (c, x, y) => dots(c, SPARK, [x, y, x - 2, y - 1, x + 2, y - 2, x + 1, y + 1, x - 1, y - 3, x + 3, y]);

  obj('arcade-cabinet-upright', 'arcade cabinet video game machine coin-op joystick amusement arcade', {
    w: 18,
    h: 36,
    f(c, u) {
      const b = 34;
      c.rect(2, 2, 15, b, X.BLK);
      c.col(2, 2, b, C.wine);
      c.col(15, 2, b, C.wine);
      c.rect(3, 3, 14, 5, u ? C.glow : hex('#6a6040')); // the marquee
      dots(c, u ? C.red : C.wine, [5, 4, 6, 4, 8, 4, 9, 4, 11, 4, 12, 4]);
      c.rect(3, 7, 14, 16, hex('#17151c'));
      scr(c, 4, 8, 13, 15, u, 'game', 3);
      c.rect(1, 18, 16, 20, mix(X.BLK, 1.7)); // the control panel
      c.row(18, 1, 16, mix(X.BLK, 2.3));
      c.col(5, 16, 18, X.CHR);
      c.rect(4, 15, 6, 16, C.red);
      dots(c, C.red, [9, 19, 13, 19]);
      dots(c, C.mustard, [11, 19]);
      c.box(6, 23, 11, 29, mix(X.BLK, 1.4)); // the coin door
      c.rect(7, 25, 7, 26, u ? X.LEDR : mix(X.LEDR, 0.4));
      c.rect(10, 25, 10, 26, u ? X.LEDR : mix(X.LEDR, 0.4));
      c.row(28, 7, 10, X.BLK);
      c.row(b, 2, 15, X.GREY);
    },
    sw: 17,
    sh: 36,
    s(c, u) {
      const b = 34;
      c.poly([[2, 2], [12, 2], [13, 6], [10, 8], [10, 17], [15, 18], [15, 21], [12, 22], [12, b], [2, b]], X.BLK);
      c.col(2, 2, b, mix(X.BLK, 1.6));
      c.line(4, 28, 10, 12, C.wine); // the side art: three tired stripes
      c.line(5, 28, 11, 12, C.wine);
      c.line(7, 28, 11, 17, C.mustard);
      c.line(4, 31, 11, 31, C.teal);
      c.col(11, 9, 16, u ? X.TUBEL : hex('#17151c'));
      c.rect(12, 3, 12, 5, u ? C.glow : hex('#6a6040'));
      c.rect(13, 16, 14, 17, C.red);
      c.row(b, 2, 12, X.GREY);
      if (u) dots(c, X.TUBE, [12, 10, 12, 13, 13, 12]);
    },
  });

  obj('pinball-table-wine', 'pinball table pinball machine flipper backglass arcade', {
    w: 38,
    h: 30,
    base: 'side',
    f(c, u) {
      const b = 28,
        R = C.wine;
      legs(c, [10, 11], 20, b, X.CHR);
      legs(c, [32, 33], 23, b, X.CHR);
      c.poly([[8, 13], [35, 17], [35, 23], [8, 21]], R);
      c.line(8, 13, 35, 17, C.glassLight); // the glass
      c.line(8, 14, 35, 18, C.glass);
      dots(c, C.mustard, [14, 17, 19, 18, 24, 19, 29, 20]);
      c.line(9, 20, 34, 22, D(R));
      c.set(33, 20, C.white); // the flipper button
      c.rect(36, 20, 36, 21, X.CHR); // the plunger
      c.box(2, 2, 10, 14, X.BLK); // the backbox
      c.col(10, 3, 13, u ? C.glow : hex('#5a4a40'));
      c.rect(3, 15, 9, 21, X.BLK);
      c.line(4, 5, 8, 11, C.wine);
      c.line(4, 8, 7, 12, C.mustard);
      if (u) {
        dots(c, C.flameLight, [11, 4, 11, 8, 11, 12, 12, 6, 12, 10]);
        dots(c, X.AMBER, [13, 14, 18, 15, 23, 15, 28, 16, 31, 17]);
        c.set(20, 14, X.CHR); // the ball
      }
    },
    sw: 18,
    sh: 36,
    s(c, u) {
      const b = 34,
        R = C.wine;
      c.box(2, 2, 15, 14, X.BLK);
      c.rect(3, 3, 14, 13, u ? hex('#7a4a2c') : hex('#3a2c2c')); // the backglass
      c.rect(5, 4, 12, 5, u ? C.glow : hex('#5a4a40'));
      c.oval(6, 7, 11, 12, u ? C.red : C.wine);
      c.set(8, 9, u ? C.flameLight : C.mustard);
      dots(c, u ? X.AMBER : hex('#5a4a40'), [4, 8, 4, 11, 13, 8, 13, 11]);
      c.poly([[4, 15], [13, 15], [15, 25], [2, 25]], hex('#2e4a44')); // the playfield runs away from the player
      dots(c, u ? C.flameLight : C.bone, [7, 17, 10, 17, 8, 19]);
      dots(c, u ? X.LEDR : C.rust, [5, 21, 12, 21, 9, 22]);
      c.line(6, 24, 8, 23, C.white);
      c.line(11, 24, 9, 23, C.white);
      c.line(4, 15, 2, 25, X.CHR);
      c.line(13, 15, 15, 25, X.CHR);
      c.box(2, 26, 15, 30, R);
      c.rect(7, 27, 10, 29, X.BLK);
      c.set(8, 28, u ? X.LEDR : mix(X.LEDR, 0.4));
      c.set(14, 27, X.CHR);
      legs(c, [2, 15], 31, b, X.CHR);
      if (u) c.set(9, 20, X.CHR);
    },
  });

  obj('server-rack-cabinet', 'server rack cabinet computers network data centre blinking lights', {
    w: 16,
    h: 40,
    f(c, u) {
      const b = 38,
        r = rnd(6);
      c.box(1, 2, 14, b, RACK);
      for (let y = 4; y <= b - 4; y += 4) {
        c.rect(2, y, 13, y + 2, mix(RACK, 0.6));
        c.row(y, 2, 13, X.GREY);
        c.rect(3, y + 1, 6, y + 1, X.BLK);
        for (let x = 8; x <= 12; x += 2) {
          const k = r();
          c.set(x, y + 1, u ? (k < 0.12 ? X.LEDR : k < 0.75 ? X.LEDG : X.AMBER) : mix(X.LEDG, 0.3));
        }
      }
      vents(c, 3, b - 2, 12, b - 1, mix(RACK, 0.6));
      if (u) cable(c, [[13, 9], [14, 14], [13, 21]], C.navy);
    },
    sw: 13,
    sh: 40,
    s(c, u) {
      const b = 38;
      c.box(1, 2, 11, b, RACK);
      panel(c, 3, 4, 9, b - 3, RACK);
      vents(c, 4, 6, 8, 14, mix(RACK, 0.6));
      for (let y = 5; y <= b - 4; y += 4) c.set(11, y, u ? (y % 3 ? X.LEDG : X.AMBER) : mix(X.LEDG, 0.3));
      c.set(4, 20, X.CHR);
    },
  });

  obj('mainframe-tape-unit', 'mainframe tape unit magnetic tape drive reels computer room cabinet', {
    w: 19,
    h: 37,
    f(c, u) {
      const b = 35;
      c.box(1, 2, 17, b, X.PL);
      c.rect(1, 2, 17, 3, IBM);
      c.rect(2, 5, 16, 20, hex('#23262c')); // behind glass
      for (const x of [3, 10]) {
        c.oval(x, 6, x + 5, 11, C.white);
        c.oval(x + 1, 7, x + 4, 10, hex('#4a3626'));
        c.set(x + 2, 8, X.CHR);
        c.set(x + 3, 9, X.CHR);
        if (u) c.dither(x, 6, x + 5, 11, X.GREYL);
      }
      cable(c, [[5, 12], [5, 18]], hex('#6a5038'));
      cable(c, [[13, 12], [13, 18]], hex('#6a5038'));
      c.rect(7, 13, 11, 14, X.GREY); // the head
      c.col(4, 15, 19, X.SCR0);
      c.col(14, 15, 19, X.SCR0);
      c.rect(2, 22, 16, 24, IBM);
      leds(c, 3, 23, 5, 2, u, [C.white, C.white, X.AMBER, X.LEDR, X.LEDG]);
      c.rect(14, 23, 15, 23, X.BLK);
      panel(c, 3, 26, 15, b - 2, X.PL);
      vents(c, 5, 28, 13, b - 4, D(X.PL));
      c.set(3, 6, C.glassLight);
      c.set(3, 7, C.glassLight);
    },
    sw: 13,
    sh: 37,
    s(c, u) {
      const b = 35;
      c.box(1, 2, 11, b, X.PL);
      c.rect(1, 2, 11, 3, IBM);
      c.col(11, 5, 20, hex('#23262c'));
      c.col(11, 22, 24, IBM);
      c.set(11, 23, u ? X.LEDG : mix(X.LEDG, 0.3));
      panel(c, 3, 6, 8, 18, X.PL);
      vents(c, 3, 24, 8, b - 3, D(X.PL));
    },
  });

  obj('tv-wall-nine-screens', 'wall of televisions crt video wall nine screens static shop window surveillance', {
    w: 36,
    h: 36,
    f(c, u) {
      const b = 34,
        kinds = ['static', 'cam', 'tube', 'tube', 'eye', 'static', 'cam', 'static', 'tube'];
      c.rect(1, 1, 34, b, X.BLK);
      for (let i = 0; i < 9; i++) {
        const x = 2 + (i % 3) * 11,
          y = 2 + ((i / 3) | 0) * 11;
        c.box(x, y, x + 9, y + 9, [X.GREY, hex('#5b4634'), mix(X.BLK, 1.6)][i % 3]);
        const k = kinds[i],
          on = u && i !== 6;
        scr(c, x + 1, y + 1, x + 7, y + 7, on, k === 'eye' ? 'tube' : k, i);
        if (on && k === 'eye') {
          c.oval(x + 2, y + 3, x + 6, y + 5, C.white);
          c.rect(x + 4, y + 3, x + 4, y + 5, C.black);
        }
        if (on && k === 'tube' && i !== 4) {
          c.rect(x + 3, y + 4, x + 5, y + 7, C.flesh);
          c.row(y + 3, x + 3, x + 5, C.woodDark);
        }
        c.set(x + 8, y + 2, X.CHR);
        c.set(x + 8, y + 8, on ? X.LEDR : mix(X.LEDR, 0.4));
      }
      c.line(15, 27, 19, 31, C.glassLight); // one is cracked
    },
    sw: 12,
    sh: 36,
    s(c, u) {
      const b = 34;
      c.rect(1, 1, 3, b, X.BLK);
      for (let j = 0; j < 3; j++) {
        const y = 2 + j * 11;
        c.poly([[3, y + 3], [6, y], [9, y], [9, y + 9], [3, y + 8]], [X.GREY, hex('#5b4634'), mix(X.BLK, 1.6)][j]);
        vents(c, 4, y + 3, 5, y + 6, X.BLK);
        c.col(10, y + 1, y + 8, u && j < 2 ? X.TUBEL : X.SCR0);
        c.row(y + 10, 1, 10, X.BLK);
      }
    },
  });

  {
    const DISH = hex('#a3a59c');
    obj('satellite-dish-ground', 'satellite dish ground mount big dish antenna receiver signal', {
      w: 28,
      h: 31,
      f(c, u) {
        const b = 29,
          x0 = u ? 8 : 2,
          x1 = u ? 19 : 25;
        c.rect(13, 20, 14, b - 1, X.GREY);
        c.line(13, b - 3, 7, b, X.GREY);
        c.line(14, b - 3, 20, b, X.GREY);
        c.row(b, 6, 21, X.GREY);
        c.oval(x0, 2, x1, 22, DISH);
        c.oval(x0 + 1, 3, x1 - 1, 21, D(DISH));
        c.dither(x0 + 1, 3, x1 - 1, 21, DISH);
        const fx = u ? 22 : 13;
        c.line(x0 + 2, 6, fx, 11, X.GREY); // the feed on its struts
        c.line(x0 + 2, 18, fx, 12, X.GREY);
        if (!u) c.line(x1 - 2, 6, fx + 1, 11, X.GREY);
        c.rect(fx, 11, fx + 1, 12, X.BLK);
        c.set(fx + 1, 11, u ? X.LEDG : X.GREY);
        c.speckle(x0, 12, x1, 22, C.rust, 16, 3);
      },
      sw: 20,
      sh: 31,
      s(c, u) {
        const b = 29;
        c.rect(5, 16, 6, b - 1, X.GREY);
        c.row(b, 2, 11, X.GREY);
        c.line(6, b - 3, 10, b, X.GREY);
        if (u) {
          c.oval(4, 2, 14, 22, DISH); // turned to look this way
          c.oval(5, 3, 13, 21, D(DISH));
          c.dither(5, 3, 13, 21, DISH);
          c.rect(9, 11, 10, 12, X.BLK);
          c.set(10, 11, X.LEDG);
          c.line(6, 6, 9, 11, X.GREY);
          c.line(6, 18, 9, 12, X.GREY);
          return;
        }
        for (let y = 2; y <= 22; y++) {
          const t = (y - 12) / 10.5,
            x = Math.round(10 - 7 * (1 - t * t));
          c.rect(x, y, x + 1, y, DISH);
          c.set(x, y, L(DISH));
        }
        c.line(11, 3, 17, 11, X.GREY);
        c.line(11, 21, 17, 12, X.GREY);
        c.line(5, 12, 17, 12, X.GREY);
        c.rect(17, 11, 18, 12, X.BLK);
      },
    });
  }

  {
    const tower = (c, xl, xr, tl, tr, b) => {
      for (let y = 3; y <= b; y++) {
        const t = (y - 3) / (b - 3),
          a = Math.round(tl + (xl - tl) * t),
          e = Math.round(tr + (xr - tr) * t),
          col = ((y - 3) / 12) % 2 < 1 ? C.red : C.white;
        c.set(a, y, col);
        c.set(e, y, D(col));
        if ((y - 3) % 6 === 0) c.row(y, a, e, col);
      }
      for (let y = 3; y + 6 <= b; y += 6) {
        const f = (yy) => [Math.round(tl + ((xl - tl) * (yy - 3)) / (b - 3)), Math.round(tr + ((xr - tr) * (yy - 3)) / (b - 3))];
        const [a0, e0] = f(y),
          [a1, e1] = f(y + 6);
        c.line(a0, y, e1, y + 6, X.GREY);
        c.line(e0, y, a1, y + 6, X.GREY);
      }
    };
    obj('radio-mast-base', 'radio mast base lattice tower transmitter aerial red white beacon equipment cabinet', {
      w: 24,
      h: 63,
      f(c, u) {
        const b = 61;
        tower(c, 2, 21, 9, 14, b);
        c.rect(11, 1, 12, 2, u ? X.LEDR : mix(X.LEDR, 0.45)); // the beacon
        if (u) dots(c, C.red, [10, 1, 13, 1, 10, 2, 13, 2]);
        c.rect(7, 8, 8, 15, C.white); // panel aerials
        c.rect(15, 8, 16, 15, C.white);
        cable(c, [[12, 3], [12, 30], [11, 49]], X.BLK);
        c.box(6, b - 12, 17, b, X.GREYL); // the equipment cabinet
        if (!u) {
          door(c, 7, b - 11, 16, b - 1, X.GREYL, 'r', X.BLK);
          c.rect(9, b - 9, 11, b - 7, X.HAZ);
          c.set(10, b - 8, X.BLK);
        } else {
          hole(c, 7, b - 11, 16, b - 1, hex('#2a2c32'));
          for (let y = b - 9; y <= b - 3; y += 3) {
            c.row(y, 8, 15, X.GREY);
            leds(c, 9, y + 1, 3, 2, true);
          }
          c.rect(18, b - 10, 20, b, L(X.GREYL));
          c.col(20, b - 10, b, D(X.GREYL));
        }
      },
      sw: 18,
      sh: 63,
      s(c, u) {
        const b = 61;
        tower(c, 2, 15, 6, 11, b);
        c.rect(8, 1, 9, 2, u ? X.LEDR : mix(X.LEDR, 0.45));
        if (u) dots(c, C.red, [7, 1, 10, 1, 9, 3]);
        c.rect(11, 8, 12, 15, C.white);
        cable(c, [[9, 3], [9, 49]], X.BLK);
        c.box(4, b - 12, 12, b, X.GREYL);
        c.col(12, b - 11, b - 1, u ? hex('#2a2c32') : D(X.GREYL));
        if (u) {
          c.rect(13, b - 10, 16, b - 1, L(X.GREYL));
          c.col(16, b - 10, b - 1, D(X.GREYL));
        }
      },
    });
  }

  obj('control-desk-levers', 'control desk console levers lamps dials signal box power station panel', {
    w: 34,
    h: 26,
    f(c, u) {
      const b = 24,
        M = HAMMER;
      c.box(2, 14, 31, b, M);
      panel(c, 4, 16, 14, b - 2, M);
      vents(c, 18, 17, 28, b - 3, D(M));
      c.rect(1, 9, 32, 13, L(M)); // the sloping top
      c.row(9, 1, 32, mix(M, 1.5));
      c.row(13, 1, 32, D(M));
      for (const x of [3, 27]) {
        c.oval(x, 10, x + 3, 12, C.white); // meters
        c.set(x + (u ? 2 : 1), 11, C.red);
      }
      leds(c, 9, 10, 8, 2, u, [X.LEDG, X.AMBER, X.LEDG, X.LEDR]);
      leds(c, 10, 12, 7, 2, u, [C.white, X.AMBER]);
      for (const x of [10, 16, 22]) {
        if (!u || x === 22) {
          c.col(x, 3, 8, X.CHR); // a lever standing
          c.rect(x - 1, 2, x + 1, 3, x === 16 ? C.red : X.BLK);
        } else {
          c.col(x, 7, 9, X.CHR); // thrown
          c.rect(x - 1, 9, x + 1, 11, x === 16 ? C.red : X.BLK);
          c.set(x, 9, L(x === 16 ? C.red : X.GREY));
        }
      }
      c.row(b, 3, 30, X.BLK);
    },
    sw: 17,
    sh: 26,
    s(c, u) {
      const b = 24,
        M = HAMMER;
      c.box(2, 14, 11, b, M);
      c.poly([[2, 8], [5, 8], [14, 12], [14, 14], [2, 14]], L(M));
      c.line(5, 8, 14, 12, mix(M, 1.5));
      c.row(14, 2, 14, D(M));
      vents(c, 4, 17, 8, b - 3, D(M));
      if (!u) {
        c.line(8, 9, 6, 3, X.CHR);
        c.rect(5, 2, 7, 3, C.red);
      } else {
        c.line(8, 9, 13, 6, X.CHR);
        c.rect(13, 5, 15, 6, C.red);
        dots(c, X.LEDG, [11, 10]);
        dots(c, X.AMBER, [6, 8]);
      }
      c.row(b, 3, 10, X.BLK);
    },
  });

  {
    const R = X.ROBOT;
    obj('robot-arm-pedestal', 'robot arm on pedestal small manipulator gripper laboratory automation', {
      w: 26,
      h: 31,
      f(c, u) {
        const b = 29;
        c.box(8, b - 7, 17, b - 1, X.GREY);
        hazard(c, 8, b, 17);
        led(c, 10, b - 4, u, X.LEDG);
        c.rect(13, b - 5, 15, b - 3, X.BLK);
        if (!u) {
          limb(c, 12, b - 9, 7, 9, 3, R); // folded up
          limb(c, 7, 9, 17, 4, 3, R);
          joint(c, 7, 9, 2);
          c.rect(18, 3, 19, 8, X.GREY);
          c.col(17, 8, 10, X.CHR);
          c.col(20, 8, 10, X.CHR);
          cable(c, [[9, 11], [11, 15], [10, 20]], X.BLK);
        } else {
          limb(c, 12, b - 9, 10, 7, 3, R); // reaching out and down
          limb(c, 10, 7, 21, 12, 3, R);
          joint(c, 10, 7, 2);
          c.rect(21, 12, 22, 17, X.GREY);
          c.col(20, 17, 19, X.CHR);
          c.col(23, 17, 19, X.CHR);
          c.rect(21, 19, 22, 21, C.flesh); // what it holds: a doll's arm
          c.set(21, 22, C.flesh);
          cable(c, [[12, 9], [14, 14], [12, 20]], X.BLK);
        }
        joint(c, 12, b - 9, 2);
      },
      sw: 14,
      sh: 31,
      s(c, u) {
        const b = 29;
        c.box(2, b - 7, 11, b - 1, X.GREY);
        hazard(c, 2, b, 11);
        const ey = u ? 7 : 9;
        limb(c, 6, b - 9, 6, ey, 3, R);
        joint(c, 6, b - 9, 2);
        joint(c, 6, ey, 2);
        if (!u) {
          c.box(4, 2, 9, 6, R); // the forearm points at us
          c.rect(6, 3, 7, 5, X.GREY);
        } else {
          limb(c, 7, ey, 10, 12, 3, R);
          c.rect(10, 12, 11, 17, X.GREY);
          c.col(9, 17, 19, X.CHR);
          c.col(12, 17, 19, X.CHR);
          c.rect(10, 19, 11, 22, C.flesh);
        }
      },
    });

    obj('industrial-robot-welder', 'industrial robot welding arm factory orange heavy sparks', {
      w: 36,
      h: 43,
      f(c, u) {
        const b = 41;
        hazard(c, 7, b - 1, 26, b);
        c.box(10, b - 11, 23, b - 2, R);
        c.rect(12, b - 8, 15, b - 5, X.BLK);
        led(c, 20, b - 8, u, X.LEDR);
        c.row(b - 4, 11, 22, D(R));
        if (!u) {
          limb(c, 16, b - 15, 10, 13, 5, R);
          limb(c, 10, 13, 26, 7, 4, R);
          joint(c, 10, 13, 3);
          c.rect(27, 5, 29, 10, X.GREY);
          c.rect(28, 11, 28, 15, X.CHR); // the torch
          cable(c, [[12, 16], [16, 22], [14, 28]], X.BLK);
          cable(c, [[24, 6], [20, 3], [13, 9]], X.BLK);
        } else {
          limb(c, 16, b - 15, 13, 12, 5, R);
          limb(c, 13, 12, 27, 22, 4, R);
          joint(c, 13, 12, 3);
          c.rect(27, 22, 29, 27, X.GREY);
          c.rect(28, 28, 28, 33, X.CHR);
          sparks(c, 28, 35);
          c.set(28, 34, C.white);
          dots(c, SPARK, [31, 38, 25, 37, 33, 36]);
          cable(c, [[15, 15], [19, 22], [16, 28]], X.BLK);
          cable(c, [[25, 19], [22, 12], [16, 9]], X.BLK);
        }
        joint(c, 16, b - 15, 4);
      },
      sw: 20,
      sh: 43,
      s(c, u) {
        const b = 41;
        hazard(c, 2, b - 1, 16, b);
        c.box(3, b - 11, 15, b - 2, R);
        c.row(b - 4, 4, 14, D(R));
        const ey = u ? 12 : 13;
        limb(c, 9, b - 15, 9, ey, 5, R);
        joint(c, 9, b - 15, 4);
        joint(c, 9, ey, 3);
        if (!u) {
          c.box(6, 4, 12, 10, R);
          c.rect(8, 6, 10, 8, X.GREY);
          c.rect(9, 11, 9, 15, X.CHR);
        } else {
          limb(c, 10, ey, 14, 22, 4, R);
          c.rect(13, 22, 15, 27, X.GREY);
          c.rect(14, 28, 14, 33, X.CHR);
          sparks(c, 14, 35);
          c.set(14, 34, C.white);
        }
      },
    });
  }

  obj('charging-pillar-cable', 'charging station pillar charger cable plug electric power point', {
    w: 13,
    h: 33,
    U: { w: 24, x(c) {
      cable(c, [[9, 24], [12, 29], [16, 31], [21, 30]], X.BLK); // the cable drawn out across the floor
      c.rect(21, 28, 22, 30, X.GREY);
    } },
    f(c, u) {
      const b = 31,
        B = hex('#b9bcb6');
      c.row(b, 2, 10, X.GREY);
      c.box(3, 4, 9, b - 1, B);
      c.rect(3, 4, 9, 5, C.teal);
      c.row(6, 4, 8, u ? X.LEDG : mix(X.LEDG, 0.35));
      scr(c, 4, 8, 8, 11, u, 'text', 2);
      c.rect(5, 13, 7, 14, X.BLK);
      c.rect(4, 20, 8, b - 3, mix(B, 0.85));
      c.set(6, 22, X.HAZ);
      if (!u) {
        c.rect(10, 13, 10, 17, X.GREY); // the plug in its holster
        cable(c, [[10, 18], [11, 24], [10, 28], [8, 25]], X.BLK);
      } else c.set(10, 14, X.BLK);
    },
    sw: 10,
    sh: 33,
    SU: { w: 18, x(c) {
      cable(c, [[7, 24], [9, 30], [15, 31]], X.BLK);
      c.rect(14, 29, 15, 30, X.GREY);
    } },
    s(c, u) {
      const b = 31,
        B = hex('#b9bcb6');
      c.row(b, 1, 8, X.GREY);
      c.box(2, 4, 7, b - 1, B);
      c.rect(2, 4, 7, 5, C.teal);
      c.col(7, 8, 11, u ? X.PHOS : X.SCR0);
      c.set(7, 6, u ? X.LEDG : mix(X.LEDG, 0.35));
      if (!u) {
        c.rect(4, 13, 5, 17, X.GREY);
        cable(c, [[4, 18], [3, 24], [5, 28], [6, 25]], X.BLK);
      } else c.rect(4, 14, 5, 15, X.BLK);
    },
  });

  obj('fuse-cabinet-grey', 'fuse cabinet distribution box street cabinet electricity high voltage fuses', {
    w: 19,
    h: 33,
    U: { w: 23, x(c) {
      c.rect(18, 7, 20, 29, L(hex('#8a8f86')));
      c.col(20, 7, 29, D(hex('#8a8f86')));
    } },
    f(c, u) {
      const b = 31,
        G = hex('#8a8f86');
      c.rect(2, b - 1, 16, b, X.CONC);
      c.box(1, 5, 17, b - 2, G);
      c.rect(1, 3, 17, 4, D(G));
      c.row(3, 1, 17, G);
      door(c, 2, 6, 9, b - 3, G, 'r', X.BLK);
      vents(c, 3, 8, 8, 12, D(G));
      if (!u) {
        door(c, 10, 6, 16, b - 3, G, 'l', X.BLK);
        vents(c, 11, 8, 15, 12, D(G));
        c.rect(11, 16, 15, 20, X.HAZ); // the warning
        c.line(14, 16, 12, 18, X.BLK);
        c.line(13, 18, 12, 20, X.BLK);
      } else {
        hole(c, 10, 6, 16, b - 3, hex('#2a2c32'));
        for (let y = 8; y <= 16; y += 4) {
          c.row(y + 2, 11, 15, hex('#a8642e')); // copper bars
          for (let x = 11; x <= 15; x += 2) c.rect(x, y, x, y + 1, C.white);
        }
        c.set(13, 12, C.black); // one fuse blown
        c.set(13, 11, hex('#5a4a40'));
        cable(c, [[11, 20], [12, 25], [11, b - 4]], C.red);
        cable(c, [[13, 20], [14, 24], [13, b - 4]], X.BLK);
        cable(c, [[15, 20], [15, b - 4]], C.navy);
      }
      c.speckle(1, 20, 9, b - 3, C.rust, 12, 4);
    },
    sw: 11,
    sh: 33,
    SU: { w: 18, x(c) {
      c.rect(9, 7, 15, 29, L(hex('#8a8f86')));
      c.col(15, 7, 29, D(hex('#8a8f86')));
      c.row(7, 9, 15, hex('#a6aba2'));
    } },
    s(c, u) {
      const b = 31,
        G = hex('#8a8f86');
      c.rect(2, b - 1, 8, b, X.CONC);
      c.box(1, 5, 9, b - 2, G);
      c.rect(1, 3, 9, 4, D(G));
      c.row(3, 1, 9, G);
      vents(c, 3, 8, 6, 12, D(G));
      c.col(9, 6, b - 3, u ? hex('#2a2c32') : D(G));
      c.speckle(1, 20, 8, b - 3, C.rust, 9, 4);
    },
  });

  {
    const G = HAMMER,
      PORC = hex('#7a4634');
    const insul = (c, x, y0, y1) => {
      for (let y = y0; y <= y1; y++) c.row(y, x - ((y - y0) % 2), x + 1 + ((y - y0) % 2), PORC);
      c.rect(x, y0 - 1, x + 1, y0 - 1, X.CHR);
    };
    obj('transformer-finned', 'transformer substation cooling fins insulators high voltage humming arcing', {
      w: 30,
      h: 29,
      f(c, u) {
        const b = 27;
        c.rect(3, b - 1, 26, b, X.BLK);
        c.box(7, 9, 22, b - 2, G);
        for (let x = 1; x <= 5; x += 2) c.col(x, 11, b - 3, G);
        for (let x = 24; x <= 28; x += 2) c.col(x, 11, b - 3, G);
        c.row(13, 1, 6, D(G));
        c.row(13, 23, 28, D(G));
        c.row(b - 5, 1, 6, D(G));
        c.row(b - 5, 23, 28, D(G));
        for (const x of [9, 14, 19]) insul(c, x, 4, 8);
        c.rect(11, 14, 15, 17, C.white); // the rating plate
        c.row(15, 12, 14, X.GREY);
        c.rect(17, 14, 20, 17, X.HAZ);
        c.line(19, 14, 18, 17, X.BLK);
        c.speckle(7, 18, 22, b - 2, C.rust, 14, 5);
        dots(c, D(G), [8, 10, 21, 10, 8, b - 3, 21, b - 3]);
        if (u) {
          cable(c, [[10, 2], [12, 1], [13, 3], [15, 2]], SPARK); // arcing over
          cable(c, [[15, 2], [17, 1], [18, 3], [20, 2]], C.white);
          dots(c, C.ghost, [11, 1, 16, 4, 21, 1]);
          c.col(13, 18, b - 2, C.black); // and losing oil
          puddle(c, 9, 18, b, hex('#1c1a20'));
        }
      },
      sw: 19,
      sh: 29,
      s(c, u) {
        const b = 27;
        c.rect(2, b - 1, 16, b, X.BLK);
        c.box(4, 9, 14, b - 2, G);
        for (let x = 5; x <= 13; x += 2) c.col(x, 11, b - 4, D(G)); // the fins face us
        c.row(13, 5, 13, mix(G, 0.5));
        c.row(b - 6, 5, 13, mix(G, 0.5));
        insul(c, 8, 4, 8);
        if (u) {
          cable(c, [[9, 2], [11, 1], [12, 3]], SPARK);
          dots(c, C.ghost, [7, 1, 13, 3]);
          puddle(c, 11, 17, b, hex('#1c1a20'));
        }
      },
    });

    obj('generator-set-skid', 'generator set diesel engine on skid emergency power exhaust smoke', {
      w: 34,
      h: 26,
      f(c, u) {
        const b = 24;
        c.rect(1, b - 1, 32, b, X.BLK);
        c.box(1, 9, 4, b - 2, X.GREY); // radiator
        vents(c, 2, 11, 3, b - 4, X.BLK);
        c.box(5, 11, 18, b - 2, G); // engine
        c.rect(7, 9, 15, 10, D(G));
        dots(c, X.CHR, [7, 13, 10, 13, 13, 13, 16, 13]);
        c.rect(7, 16, 12, 18, D(G));
        c.set(15, 19, C.red);
        c.rect(8, 5, 9, 9, X.GREY); // exhaust
        c.rect(8, 4, 10, 4, X.GREY);
        c.box(19, 12, 28, b - 2, X.GREYL); // alternator
        vents(c, 21, 14, 26, b - 4, X.GREY);
        c.box(23, 5, 30, 11, hex('#b9bcb6')); // control box
        c.oval(24, 6, 26, 8, C.white);
        c.set(25, 7, u ? C.red : X.BLK);
        led(c, 28, 7, u, X.LEDG);
        c.rect(28, 9, 29, 10, C.red);
        hazard(c, 29, 14, 31, b - 2);
        c.speckle(5, 12, 18, b - 2, hex('#2a2c2a'), 9, 3);
        if (u) {
          dots(c, X.GREY, [10, 2, 12, 1, 11, 3, 14, 2]);
          dots(c, hex('#4a4a50'), [9, 3, 13, 1, 15, 1]);
          puddle(c, 8, 13, b, hex('#1c1a20'));
        }
      },
      sw: 16,
      sh: 26,
      s(c, u) {
        const b = 24;
        c.rect(1, b - 1, 14, b, X.BLK);
        c.box(2, 9, 13, b - 2, X.GREY);
        vents(c, 3, 11, 12, b - 4, X.BLK);
        c.oval(5, 12, 10, 17, mix(X.GREY, 0.6)); // the fan behind the grille
        c.set(7, 14, X.CHR);
        c.rect(6, 5, 7, 8, X.GREY);
        c.rect(6, 4, 8, 4, X.GREY);
        c.rect(10, 5, 13, 8, hex('#b9bcb6'));
        if (u) {
          dots(c, X.GREY, [8, 2, 10, 1, 9, 3]);
          dots(c, hex('#4a4a50'), [7, 3, 11, 1]);
          c.dither(5, 12, 10, 17, X.GREYL);
        }
      },
    });
  }

  obj('cable-drum-wooden', 'cable drum wooden reel spool of cable building site', {
    w: 26,
    h: 25,
    base: 'side',
    U: { w: 36, x(c) {
      cable(c, [[14, 21], [20, 23], [26, 22], [30, 23], [34, 22]], X.BLK);
      c.set(34, 21, hex('#a8642e'));
    } },
    f(c, u) {
      const b = 23,
        W = C.woodPale;
      c.oval(1, 1, 23, b, W);
      for (let x = 4; x <= 22; x += 4) for (let y = 2; y < b; y++) if (c.get(x, y)) c.set(x, y, D(W));
      c.oval(8, 8, 16, 16, D(W));
      c.oval(10, 10, 14, 14, C.night);
      dots(c, X.GREY, [12, 4, 12, 20, 4, 12, 20, 12, 6, 6, 18, 6, 6, 18, 18, 18]);
      c.speckle(2, 2, 22, b - 1, C.wood, 12, 4);
      c.poly([[1, b], [4, b], [4, b - 2]], C.wood); // chocks
      c.poly([[20, b], [23, b], [20, b - 2]], C.wood);
      if (u) c.rect(13, 19, 14, 21, X.BLK);
    },
    sw: 17,
    sh: 25,
    SU: { x(c) {
      cable(c, [[9, 20], [11, 22], [8, 23], [12, 23]], X.BLK);
    } },
    s(c, u) {
      const b = 23,
        W = C.woodPale;
      c.rect(2, 1, 3, b, W);
      c.rect(12, 1, 13, b, W);
      c.col(2, 1, b, L(W));
      c.col(12, 1, b, L(W));
      const t = u ? 7 : 4;
      c.rect(4, 5, 11, b - 4, D(W));
      c.rect(4, t, 11, b - t + 1, X.BLK); // the windings
      for (let y = t; y <= b - t + 1; y += 2) c.row(y, 4, 11, mix(X.BLK, 1.6));
      c.rect(1, b - 1, 14, b, C.wood);
    },
  });

  obj('oscilloscope-trolley', 'oscilloscope on trolley test equipment signal generator workshop trace', {
    w: 17,
    h: 31,
    f(c, u) {
      const b = 29;
      legs(c, [2, 14], 12, b - 2, X.CHR);
      c.row(12, 2, 14, X.CHR);
      c.row(21, 2, 14, X.CHR);
      wheel(c, 2, b - 1, 1);
      wheel(c, 14, b - 1, 1);
      c.box(2, 3, 14, 11, X.PL);
      scr(c, 3, 4, 9, 10, u, 'text', 0);
      c.rect(3, 4, 9, 10, u ? mix(X.PHOS, 0.25) : X.SCR0);
      if (u) cable(c, [[3, 7], [4, 5], [5, 7], [6, 9], [7, 7], [8, 5], [9, 7]], X.PHOS);
      else c.set(4, 5, mix(X.SCR0, 1.9));
      dots(c, X.BLK, [11, 5, 13, 5, 11, 8, 13, 8]);
      led(c, 12, 10, u, X.LEDR);
      c.box(3, 15, 13, 20, hex('#4a4e58')); // the signal generator
      c.oval(4, 16, 7, 19, X.GREYL);
      c.set(5, 17, X.BLK);
      leds(c, 9, 17, 2, 2, u, [X.LEDG, X.AMBER]);
      c.rect(9, 19, 12, 19, X.BLK);
      cable(c, [[5, 24], [8, 26], [11, 24]], C.red); // leads
      cable(c, [[6, 25], [9, 27], [12, 25]], X.BLK);
      if (u) cable(c, [[12, 11], [15, 14], [15, 22]], X.BLK);
    },
    sw: 13,
    sh: 31,
    s(c, u) {
      const b = 29;
      legs(c, [2, 10], 12, b - 2, X.CHR);
      c.row(12, 2, 10, X.CHR);
      c.row(21, 2, 10, X.CHR);
      wheel(c, 2, b - 1, 1);
      wheel(c, 10, b - 1, 1);
      c.box(2, 3, 10, 11, X.PL);
      vents(c, 3, 5, 7, 9, D(X.PL));
      c.col(11, 4, 10, u ? X.PHOS : X.SCR0);
      c.box(3, 15, 10, 20, hex('#4a4e58'));
      c.set(11, 17, X.GREYL);
      cable(c, [[4, 25], [7, 26], [9, 24]], C.red);
    },
  });

  obj('soldering-bench', 'soldering bench electronics workbench soldering iron circuit board magnifier lamp', {
    w: 34,
    h: 27,
    f(c, u) {
      const b = 25,
        W = C.woodPale;
      c.rect(1, 13, 32, 14, W);
      c.row(13, 1, 32, L(W));
      legs(c, [2, 30], 15, b, X.GREY, 2);
      c.row(20, 4, 29, X.GREY);
      c.rect(6, 17, 11, 19, C.paper); // parts boxes
      c.rect(13, 16, 18, 19, hex('#6a5038'));
      c.rect(21, 17, 27, 19, C.navy);
      c.line(4, 12, 6, 6, X.BLK); // the lamp on its arm
      c.line(6, 6, 10, 3, X.BLK);
      c.rect(9, 2, 14, 3, X.GREY);
      c.row(4, 10, 13, u ? C.flameLight : X.GREYL);
      c.rect(12, 11, 20, 12, hex('#3f6a48')); // the board
      dots(c, X.BLK, [14, 11, 17, 11]);
      dots(c, C.brass, [13, 12, 16, 12, 19, 12]);
      c.rect(27, 8, 30, 12, C.mustard); // meter
      c.rect(28, 9, 29, 10, u ? X.PHOS : C.white);
      c.oval(22, 10, 24, 12, X.CHR); // solder
      dots(c, hex('#3a2c1c'), [8, 12, 21, 13, 25, 13]); // burns
      if (!u) {
        c.line(5, 12, 9, 9, hex('#2e5658')); // the iron in its stand
        c.set(5, 12, X.CHR);
      } else {
        for (let y = 5; y <= 10; y++) for (let x = 11 - ((y - 5) >> 1); x <= 13 + ((y - 5) >> 1); x++) if ((x + y) % 2 === 0) c.set(x, y, C.glow);
        c.line(18, 10, 22, 7, hex('#2e5658'));
        c.set(17, 11, X.CHR);
        wisp(c, 17, 9, 5);
        c.rect(12, 11, 20, 12, hex('#3f6a48'));
        dots(c, X.BLK, [14, 11]);
        dots(c, C.brass, [13, 12, 16, 12, 19, 12]);
        c.set(17, 11, C.flameLight);
      }
    },
    sw: 15,
    sh: 27,
    s(c, u) {
      const b = 25,
        W = C.woodPale;
      c.rect(1, 13, 13, 14, W);
      c.row(13, 1, 13, L(W));
      legs(c, [2, 11], 15, b, X.GREY, 2);
      c.row(20, 4, 10, X.GREY);
      c.rect(5, 17, 9, 19, C.paper);
      c.line(3, 12, 4, 5, X.BLK);
      c.line(4, 5, 8, 3, X.BLK);
      c.rect(7, 2, 11, 3, X.GREY);
      c.row(4, 8, 10, u ? C.flameLight : X.GREYL);
      c.rect(7, 11, 11, 12, hex('#3f6a48'));
      c.rect(3, 9, 5, 12, C.mustard);
      if (u) {
        dots(c, C.glow, [8, 6, 10, 6, 9, 8, 8, 9, 10, 9]);
        wisp(c, 11, 10, 5);
      }
    },
  });

  obj('electron-microscope-column', 'electron microscope column laboratory instrument console screen', {
    w: 24,
    h: 39,
    f(c, u) {
      const b = 37,
        M = X.PL;
      c.box(1, 23, 22, b, M);
      c.rect(2, 24, 21, 26, D(M));
      leds(c, 3, 25, 6, 2, u, [X.LEDG, X.AMBER, X.LEDG, X.LEDR]);
      dots(c, X.BLK, [16, 25, 18, 25, 20, 25]);
      panel(c, 3, 28, 11, b - 2, M);
      panel(c, 13, 28, 20, b - 2, M);
      c.rect(8, 3, 12, 22, X.CHR); // the column
      c.col(8, 3, 22, L(X.CHR));
      for (const y of [6, 11, 16]) c.rect(7, y, 13, y + 1, X.GREY);
      c.rect(9, 1, 11, 2, X.GREY);
      cable(c, [[10, 1], [5, 3], [4, 12], [5, 22]], X.BLK);
      c.box(5, 18, 15, 22, M); // the chamber and its window
      c.rect(8, 19, 12, 21, u ? X.PHOS : X.SCR0);
      c.box(15, 12, 22, 22, M);
      scr(c, 16, 13, 21, 19, u, 'static', 5);
      if (u) {
        c.oval(17, 14, 20, 18, C.stoneDark); // what it sees
        c.set(18, 16, C.white);
        c.set(19, 15, C.black);
      }
      dots(c, X.BLK, [17, 21, 20, 21]);
    },
    sw: 15,
    sh: 39,
    s(c, u) {
      const b = 37,
        M = X.PL;
      c.box(1, 23, 13, b, M);
      c.col(13, 24, 26, D(M));
      panel(c, 3, 28, 10, b - 2, M);
      c.rect(5, 3, 9, 22, X.CHR);
      c.col(5, 3, 22, L(X.CHR));
      for (const y of [6, 11, 16]) c.rect(4, y, 10, y + 1, X.GREY);
      c.rect(6, 1, 8, 2, X.GREY);
      cable(c, [[7, 1], [3, 4], [2, 14], [3, 22]], X.BLK);
      c.box(3, 18, 12, 22, M);
      c.col(13, 19, 21, u ? X.PHOS : X.SCR0);
      c.rect(10, 13, 12, 17, M);
      c.col(13, 13, 17, u ? C.stoneLight : X.SCR0);
    },
  });

  obj('cash-machine-kiosk', 'cash machine atm cashpoint bank hole in the wall money banknotes', {
    w: 18,
    h: 35,
    f(c, u) {
      const b = 33,
        B = KIOSK;
      c.box(1, 2, 16, b, B);
      c.rect(2, 3, 15, 6, u ? C.glow : hex('#8a8672')); // the sign
      dots(c, B, [4, 4, 5, 4, 5, 5, 7, 4, 7, 5, 8, 5, 10, 4, 11, 4, 10, 5, 13, 4, 13, 5]);
      c.rect(3, 8, 14, 21, X.CHR);
      c.row(8, 3, 14, L(X.CHR));
      scr(c, 4, 9, 10, 14, u, 'text', 7);
      c.rect(5, 16, 9, 20, X.GREY); // keys
      for (let y = 16; y <= 20; y += 2) dots(c, C.white, [5, y, 7, y, 9, y]);
      c.row(10, 12, 13, X.BLK); // card
      c.set(12, 12, u ? X.LEDG : mix(X.LEDG, 0.35));
      c.row(17, 11, 13, X.BLK); // money
      c.row(20, 11, 13, hex('#3a3d44'));
      panel(c, 3, 23, 14, b - 2, B);
      c.set(13, 27, X.CHR);
      c.row(b, 1, 16, D(B));
      if (u) {
        c.rect(11, 18, 13, 19, hex('#8a9a72')); // notes waiting
        c.row(18, 11, 13, hex('#a6b48c'));
        c.rect(6, b - 1, 8, b, C.white); // a receipt dropped
      }
    },
    sw: 13,
    sh: 35,
    SU: { w: 15, x(c) {
      c.rect(12, 18, 13, 19, hex('#8a9a72'));
      c.row(18, 12, 13, hex('#a6b48c'));
    } },
    s(c, u) {
      const b = 33,
        B = KIOSK;
      c.box(1, 2, 9, b, B);
      c.rect(10, 3, 10, 6, u ? C.glow : hex('#8a8672'));
      c.poly([[10, 8], [11, 9], [12, 15], [12, 21], [10, 21]], X.CHR);
      c.line(10, 9, 11, 14, u ? X.PHOS : X.SCR0);
      c.row(21, 9, 12, D(X.CHR));
      panel(c, 3, 8, 7, 20, B);
      c.row(b, 1, 9, D(B));
      vents(c, 3, 24, 7, 30, D(B));
    },
  });

  obj('ticket-machine-yellow', 'ticket machine station railway bus tickets coin slot buttons yellow', {
    w: 18,
    h: 35,
    f(c, u) {
      const b = 33,
        Y = TICKET;
      c.box(1, 2, 16, b, Y);
      c.rect(2, 3, 15, 5, X.BLK);
      dots(c, C.white, [4, 4, 5, 4, 7, 4, 9, 4, 10, 4, 12, 4, 13, 4]);
      c.rect(3, 7, 10, 17, D(Y));
      for (let y = 8; y <= 16; y += 2) for (let x = 4; x <= 9; x += 2) c.set(x, y, u && x === 6 && y === 12 ? X.LEDG : X.GREYL);
      scr(c, 12, 7, 14, 10, u, 'amber', 3);
      c.rect(12, 12, 14, 12, X.BLK); // coins
      c.rect(12, 14, 14, 15, X.CHR);
      c.set(13, 17, C.red);
      hole(c, 4, 20, 13, 23, hex('#2a2620')); // the tray
      c.row(20, 4, 13, X.CHR);
      panel(c, 3, 25, 14, b - 2, Y);
      c.set(13, 28, X.BLK);
      c.speckle(2, 24, 15, b - 1, C.rust, 14, 6);
      c.row(b, 1, 16, X.BLK);
      if (u) {
        c.rect(6, 22, 9, 23, hex('#d8b890')); // a ticket
        c.row(22, 6, 9, X.ORANGE);
        dots(c, C.brass, [11, 23, 12, 23]);
      }
    },
    sw: 12,
    sh: 35,
    s(c, u) {
      const b = 33,
        Y = TICKET;
      c.box(1, 2, 9, b, Y);
      c.rect(1, 3, 9, 5, X.BLK);
      c.col(10, 7, 17, D(Y));
      c.set(10, 8, u ? X.AMBER : X.SCR0);
      c.rect(10, 20, 10, 23, X.CHR);
      if (u) c.set(11, 22, hex('#d8b890'));
      panel(c, 3, 8, 7, 22, Y);
      c.speckle(2, 24, 8, b - 1, C.rust, 12, 6);
      c.row(b, 1, 9, X.BLK);
    },
  });

  {
    const B = hex('#48607a'),
      CURT = hex('#6b2f3a');
    obj('photo-booth-curtain', 'photo booth passport photos curtain flash coin operated station', {
      w: 28,
      h: 40,
      f(c, u) {
        const b = 38;
        c.box(1, 2, 26, b, B);
        c.rect(2, 3, 25, 6, u ? C.glow : hex('#8a8672'));
        for (let x = 4; x <= 22; x += 3) c.rect(x, 4, x + 1, 5, C.red);
        hole(c, 3, 8, 14, b - 1, hex('#23262c')); // the way in
        c.rect(15, 8, 25, b - 1, mix(B, 1.15));
        c.rect(17, 10, 19, 21, C.paper); // sample strips
        for (let y = 11; y <= 20; y += 3) {
          c.set(18, y, C.flesh);
          c.set(18, y + 1, C.navy);
        }
        c.rect(21, 10, 24, 16, C.glass); // a mirror
        c.set(22, 11, C.glassLight);
        c.rect(22, 19, 23, 19, X.BLK);
        c.rect(17, 25, 20, 28, X.BLK); // where the photographs come out
        c.row(25, 17, 20, X.CHR);
        if (!u) {
          c.rect(3, 8, 6, 30, CURT); // the curtain pushed aside
          c.col(3, 8, 30, L(CURT));
          c.col(5, 9, 30, D(CURT));
          c.rect(8, 24, 12, 25, X.GREY); // the stool
          c.rect(10, 26, 10, b - 1, X.CHR);
          c.rect(8, 12, 13, 18, hex('#3a3d44'));
        } else {
          c.rect(3, 8, 14, 29, CURT);
          for (let x = 3; x <= 14; x += 2) c.col(x, 9, 29, x % 4 === 3 ? L(CURT) : D(CURT));
          c.col(14, 8, 29, C.white); // the flash round the edges
          c.row(30, 4, 13, C.glow);
          c.rect(6, 31, 7, b - 2, X.DENIM); // somebody is in there
          c.rect(10, 31, 11, b - 2, X.DENIM);
          c.rect(5, b - 1, 7, b - 1, X.BLK);
          c.rect(10, b - 1, 12, b - 1, X.BLK);
          c.rect(18, 27, 19, 30, C.white);
          c.set(18, 28, C.flesh);
        }
        c.row(7, 3, 14, X.CHR);
      },
      sw: 21,
      sh: 40,
      s(c, u) {
        const b = 38;
        c.box(1, 2, 19, b, B);
        c.rect(2, 3, 18, 6, mix(B, 0.8));
        panel(c, 3, 9, 13, 30, B);
        c.rect(5, 11, 11, 20, C.paper); // a faded portrait on the side
        c.rect(7, 13, 9, 16, C.flesh);
        c.rect(6, 17, 10, 20, C.navy);
        c.row(12, 7, 9, C.woodDark);
        c.rect(16, 8, 18, u ? 29 : 30, CURT);
        c.col(16, 8, 29, L(CURT));
        if (u) {
          c.col(19, 8, 29, C.white);
          c.rect(17, 30, 18, 30, C.glow);
          c.rect(16, b - 1, 19, b - 1, X.BLK);
          c.rect(16, 31, 17, b - 2, X.DENIM);
        } else c.rect(16, 31, 18, b - 1, hex('#23262c'));
        c.speckle(2, 28, 14, b - 1, C.rust, 16, 3);
      },
    });
  }

  obj('payphone-hooded-pole', 'payphone public telephone on pole hood coin phone street receiver hanging', {
    w: 15,
    h: 37,
    f(c, u) {
      const b = 35,
        H = hex('#a8903a');
      c.rect(7, 22, 8, b - 1, X.GREY);
      c.row(b, 4, 11, X.GREY);
      c.box(1, 2, 13, 21, H); // the hood
      c.rect(2, 3, 12, 4, D(H));
      hole(c, 3, 5, 12, 20, hex('#3a3d44'));
      c.box(5, 6, 11, 18, X.BLK); // the telephone
      c.rect(6, 7, 10, 8, u ? X.PHOS : X.SCR0);
      for (let y = 10; y <= 14; y += 2) dots(c, X.GREYL, [7, y, 9, y, 10, y]);
      c.rect(9, 16, 10, 17, X.CHR);
      c.row(20, 3, 12, X.GREY); // the shelf
      if (!u) {
        c.rect(3, 7, 4, 15, X.GREY);
        c.col(3, 7, 15, X.GREYL);
        cable(c, [[4, 16], [3, 19], [5, 18]], X.CHR);
      } else {
        c.set(4, 8, X.CHR);
        cable(c, [[4, 16], [3, 22], [4, 26]], X.CHR);
        c.rect(3, 26, 4, 33, X.GREY);
        c.col(3, 26, 33, X.GREYL);
        c.rect(3, 26, 5, 27, X.GREY);
        c.rect(3, 32, 5, 33, X.GREY);
      }
    },
    sw: 13,
    sh: 37,
    s(c, u) {
      const b = 35,
        H = hex('#a8903a');
      c.rect(4, 22, 5, b - 1, X.GREY);
      c.row(b, 2, 8, X.GREY);
      c.poly([[1, 2], [8, 2], [11, 6], [11, 21], [1, 21]], H);
      c.col(1, 2, 21, L(H));
      c.line(8, 2, 11, 6, D(H));
      c.col(11, 7, 20, hex('#3a3d44'));
      c.rect(1, 2, 8, 3, D(H));
      if (u) {
        cable(c, [[10, 21], [9, 24], [10, 26]], X.CHR);
        c.rect(9, 26, 10, 33, X.GREY);
        c.set(11, 26, X.GREY);
        c.set(11, 33, X.GREY);
      }
    },
  });

  obj('security-camera-pole', 'security camera on pole cctv surveillance camera watching red light', {
    w: 14,
    h: 43,
    f(c, u) {
      const b = 41,
        H = hex('#b9bcb6');
      c.rect(6, 7, 7, b - 1, X.GREY);
      c.col(6, 7, b - 1, X.GREYL);
      c.row(b, 4, 9, X.GREY);
      c.rect(5, 22, 8, 26, X.HAZ); // the notice
      c.rect(6, 23, 7, 24, X.BLK);
      c.rect(6, 5, 7, 6, X.BLK);
      if (!u) {
        c.box(2, 2, 11, 5, H); // looking away along the fence
        c.rect(1, 1, 10, 1, D(H));
        c.rect(12, 3, 12, 4, X.BLK);
        c.set(3, 4, mix(X.LEDR, 0.4));
      } else {
        c.box(4, 2, 9, 6, H); // looking at you
        c.rect(3, 1, 10, 1, D(H));
        c.oval(5, 2, 8, 5, X.BLK);
        c.set(6, 3, C.glassLight);
        c.set(9, 6, X.LEDR);
      }
    },
    sw: 14,
    sh: 43,
    s(c, u) {
      const b = 41,
        H = hex('#b9bcb6');
      c.rect(6, 7, 7, b - 1, X.GREY);
      c.col(6, 7, b - 1, X.GREYL);
      c.row(b, 4, 9, X.GREY);
      c.rect(8, 22, 8, 26, X.HAZ);
      c.rect(6, 5, 7, 6, X.BLK);
      if (!u) {
        c.box(4, 1, 9, 6, H); // its back
        c.rect(6, 3, 7, 4, D(H));
        cable(c, [[6, 5], [5, 8], [6, 11]], X.BLK);
      } else {
        c.box(2, 2, 11, 5, H);
        c.rect(1, 1, 10, 1, D(H));
        c.rect(12, 3, 12, 4, X.BLK);
        c.set(10, 4, X.LEDR);
      }
    },
  });

  obj('intercom-post-gate', 'intercom on post gate entry phone speaker button camera door entry', {
    w: 11,
    h: 29,
    f(c, u) {
      const b = 27;
      c.rect(5, 13, 6, b - 1, X.GREY);
      c.row(b, 3, 8, X.GREY);
      c.box(1, 2, 9, 13, X.CHR);
      grille(c, 2, 3, 8, 6, X.GREY, X.BLK);
      c.set(5, 8, X.BLK); // its eye
      c.rect(2, 10, 5, 11, C.paper);
      c.rect(7, 10, 8, 11, u ? X.AMBER : X.GREY);
      c.set(8, 8, u ? X.LEDR : mix(X.LEDR, 0.4));
    },
    sw: 9,
    sh: 29,
    s(c, u) {
      const b = 27;
      c.rect(3, 13, 4, b - 1, X.GREY);
      c.row(b, 2, 6, X.GREY);
      c.poly([[2, 2], [5, 2], [7, 4], [7, 13], [2, 13]], X.CHR);
      c.col(2, 2, 13, L(X.CHR));
      c.col(7, 5, 7, X.BLK);
      c.set(7, 10, u ? X.AMBER : X.GREY);
      cable(c, [[3, 13], [2, 16], [3, 20]], X.BLK);
    },
  });
};
