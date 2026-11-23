/* Electronics, part 2: sound and picture, office machines, gadgets. See env-modern.js for obj() and the helpers. */
module.exports = (T, obj) => {
  const { C, hex, mix, blend, rnd, turn, D, L, X, dots, legs, panel, door, hole, scr, led, leds, vents, grille, cable, cord, wisp, puddle, wheel, bottle, cup, cloth, stuff } = T;
  const TOLEX = hex('#2e2c34'),
    DESK = hex('#3a3d46'),
    HAMMER = hex('#5c6a62'),
    NAVYG = hex('#4a5560'),
    PAPER = hex('#d9d4c2'),
    INK = hex('#6a6a70');
  /** A loudspeaker cone. */
  const cone = (c, x0, y0, x1, y1, on) => {
    c.oval(x0, y0, x1, y1, X.GREY);
    c.oval(x0 + 1, y0 + 1, x1 - 1, y1 - 1, hex('#1c1a20'));
    c.set((x0 + x1) >> 1, (y0 + y1) >> 1, on ? C.white : X.GREY);
    if (on) c.set(x0 + 1, y0 + 1, X.GREYL);
  };
  /** A printed sheet: lines of grey on paper. */
  const sheet = (c, x0, y0, x1, y1) => {
    c.rect(x0, y0, x1, y1, PAPER);
    for (let y = y0 + 1; y < y1; y += 2) c.row(y, x0 + 1, x1 - 1 - ((y * 3) % 3), INK);
  };

  obj('speaker-stack-pa', 'speaker stack pa system loudspeakers amplifier concert bass bin', {
    w: 22,
    h: 43,
    f(c, u) {
      const b = 41;
      c.box(1, 24, 20, b, TOLEX); // the bass bin
      cone(c, 2, 26, 10, 34, u);
      cone(c, 11, 26, 19, 34, u);
      vents(c, 4, 36, 17, 38, hex('#1c1a20'));
      c.box(2, 10, 19, 23, TOLEX);
      cone(c, 3, 12, 9, 18, u);
      cone(c, 12, 12, 18, 18, u);
      c.rect(7, 20, 14, 21, hex('#1c1a20')); // the horn
      c.box(3, 3, 18, 9, hex('#4a4640')); // the amplifier on top
      c.rect(4, 4, 17, 5, X.BLK);
      dots(c, X.CHR, [5, 7, 7, 7, 9, 7, 11, 7]);
      leds(c, 13, 7, 2, 2, u, [X.LEDR, X.LEDG]);
      c.row(4, 5, 12, u ? X.AMBER : mix(X.AMBER, 0.35));
      dots(c, X.CHR, [1, 24, 20, 24, 1, b, 20, b, 2, 10, 19, 10]);
      if (u) {
        cable(c, [[18, 8], [20, 12], [20, 22]], X.BLK);
        dots(c, X.GREYL, [5, 29, 14, 29, 5, 14, 14, 14]);
      }
    },
    sw: 15,
    sh: 43,
    s(c, u) {
      const b = 41;
      c.box(1, 24, 13, b, TOLEX);
      c.rect(5, 29, 9, 30, hex('#1c1a20')); // carrying grips
      c.box(2, 10, 12, 23, TOLEX);
      c.rect(5, 15, 9, 16, hex('#1c1a20'));
      c.box(2, 3, 12, 9, hex('#4a4640'));
      c.col(12, 4, 8, X.BLK);
      c.set(12, 7, u ? X.LEDR : mix(X.LEDR, 0.35));
      c.col(13, 26, 34, X.GREY);
      dots(c, X.CHR, [1, 24, 1, b, 13, 24, 13, b]);
    },
  });

  obj('mixing-desk-stand', 'mixing desk sound desk faders studio console recording meters', {
    w: 34,
    h: 23,
    f(c, u) {
      const b = 21;
      c.line(7, 14, 26, b, X.CHR);
      c.line(26, 14, 7, b, X.CHR);
      c.row(b, 5, 9, X.CHR);
      c.row(b, 24, 28, X.CHR);
      c.rect(1, 3, 32, 5, X.BLK); // the meter bridge
      c.rect(2, 6, 31, 12, DESK);
      c.rect(1, 3, 1, 13, X.TEAK);
      c.rect(32, 3, 32, 13, X.TEAK);
      c.row(13, 1, 32, X.TEAK);
      const r = rnd(8);
      for (let x = 3; x <= 30; x += 2) {
        const k = r(),
          lv = u ? 1 + ((k * 3) | 0) : 0;
        c.set(x, 4, lv > 2 ? X.LEDR : lv > 1 ? X.AMBER : lv ? X.LEDG : mix(X.LEDG, 0.3));
        c.set(x, 6, [C.red, C.navy, C.mustard][(x >> 1) % 3]);
        c.set(x, 7, X.GREYL);
        c.col(x, 9, 12, X.BLK);
        c.set(x, u ? 9 + ((k * 3) | 0) : 12, C.white);
      }
      if (u) {
        c.rect(22, 1, 27, 2, X.BLK); // headphones left on it
        c.set(21, 2, X.GREY);
        c.set(28, 2, X.GREY);
      }
    },
    sw: 15,
    sh: 23,
    s(c, u) {
      const b = 21;
      c.line(4, 14, 11, b, X.CHR);
      c.line(11, 14, 4, b, X.CHR);
      c.row(b, 3, 12, X.CHR);
      c.poly([[2, 3], [5, 3], [13, 10], [13, 13], [2, 13]], X.TEAK);
      c.line(5, 3, 13, 10, L(X.TEAK));
      c.col(2, 3, 13, L(X.TEAK));
      c.line(6, 3, 13, 9, u ? X.LEDG : X.BLK);
      if (u) c.rect(3, 1, 5, 2, X.BLK);
    },
  });

  obj('film-camera-tripod', 'film camera on tripod movie camera cine reels wooden legs film set', {
    w: 26,
    h: 37,
    base: 'side',
    f(c, u) {
      const b = 35,
        W = C.woodLight,
        M = hex('#3a3a42');
      c.line(12, 19, 4, b, W);
      c.line(13, 19, 21, b, W);
      c.line(12, 19, 12, b, D(W));
      c.rect(10, 17, 15, 18, X.GREY);
      c.line(10, 18, 4, 23, X.GREY); // the pan handle
      c.box(7, 9, 18, 16, M);
      c.rect(3, 10, 6, 12, X.BLK); // eyepiece
      c.rect(19, 11, 22, 14, X.GREY); // lens
      c.rect(23, 9, 23, 16, X.BLK);
      c.col(22, 11, 14, C.glass);
      c.rect(9, 11, 12, 14, D(M));
      c.set(16, 10, u ? X.LEDR : mix(X.LEDR, 0.35));
      for (const x of [6, 13]) {
        c.oval(x, 2, x + 6, 8, M); // the magazine
        c.oval(x + 2, 4, x + 4, 6, X.GREY);
      }
      if (u) {
        c.oval(13, 2, 19, 8, hex('#17151c')); // the back reel open: the film is out
        c.set(16, 5, X.CHR);
        cable(c, [[15, 8], [17, 13], [14, 20], [17, 26], [15, b]], hex('#4a3626'));
        cable(c, [[17, 8], [20, 17], [18, 23]], hex('#4a3626'));
        c.row(b, 14, 19, hex('#4a3626'));
      }
    },
    sw: 18,
    sh: 37,
    s(c, u) {
      const b = 35,
        W = C.woodLight,
        M = hex('#3a3a42');
      c.line(8, 19, 2, b, W);
      c.line(9, 19, 15, b, W);
      c.line(8, 19, 8, b, W);
      c.rect(6, 17, 11, 18, X.GREY);
      c.box(3, 9, 14, 16, M);
      c.rect(2, 8, 15, 8, X.BLK); // the matte box
      c.rect(2, 8, 2, 16, X.BLK);
      c.rect(15, 8, 15, 16, X.BLK);
      c.oval(5, 9, 12, 16, X.GREY);
      c.oval(6, 10, 11, 15, C.glass);
      c.set(7, 11, C.glassLight);
      c.rect(7, 2, 10, 7, M);
      c.col(7, 2, 7, L(M));
      c.set(13, 9, u ? X.LEDR : mix(X.LEDR, 0.35));
      if (u) {
        cable(c, [[10, 7], [13, 12], [12, 20], [14, 27], [12, b]], hex('#4a3626'));
        c.row(b, 10, 14, hex('#4a3626'));
      }
    },
  });

  obj('slide-projector-table', 'slide projector on folding table carousel slides holiday pictures beam', {
    w: 22,
    h: 27,
    base: 'side',
    U: { w: 34, x(c) {
      for (let x = 21; x <= 32; x++) for (let y = 12 - ((x - 20) >> 1); y <= 12 + ((x - 20) >> 1); y++) if ((x + y) % 2 === 0) c.set(x, y, C.glow);
    } },
    f(c, u) {
      const b = 25;
      c.rect(1, 15, 19, 16, X.TEAK);
      c.row(15, 1, 19, L(X.TEAK));
      c.line(4, 17, 16, b, X.CHR);
      c.line(16, 17, 4, b, X.CHR);
      c.box(3, 10, 16, 14, X.GREYL); // the projector
      vents(c, 4, 11, 8, 13, u ? X.AMBER : X.GREY);
      c.rect(17, 11, 19, 13, X.BLK);
      c.col(20, 11, 13, u ? C.white : C.glass);
      c.rect(5, 6, 13, 9, X.BLK); // the carousel
      for (let x = 6; x <= 12; x += 2) c.col(x, 7, 8, C.white);
      c.rect(8, 5, 10, 5, X.GREY);
      c.rect(2, 13, 4, 14, C.mustard); // a box of slides
      cable(c, [[3, 12], [1, 17], [2, b]], X.BLK);
    },
    sw: 16,
    sh: 27,
    s(c, u) {
      const b = 25;
      c.rect(1, 15, 14, 16, X.TEAK);
      c.row(15, 1, 14, L(X.TEAK));
      legs(c, [2, 13], 17, b, X.CHR);
      c.row(21, 3, 12, X.CHR);
      c.box(3, 10, 12, 14, X.GREYL);
      c.oval(5, 10, 9, 14, X.BLK);
      c.oval(6, 11, 8, 13, u ? C.white : C.glass);
      if (u) dots(c, C.glow, [4, 9, 10, 9, 4, 15, 10, 15, 7, 9]);
      c.rect(4, 6, 11, 9, X.BLK);
      c.rect(5, 7, 10, 8, mix(X.BLK, 1.5));
    },
  });

  obj('fax-machine-stand', 'fax machine on stand office facsimile paper printout telephone', {
    w: 16,
    h: 25,
    f(c, u) {
      const b = 23,
        F = hex('#b9ad92');
      c.box(2, 14, 13, b, F);
      c.rect(1, 12, 14, 13, F);
      c.row(12, 1, 14, L(F));
      door(c, 3, 15, 12, b - 1, F, 'r', X.BLK);
      c.rect(5, 3, 11, 7, PAPER); // paper waiting
      c.row(3, 5, 11, C.white);
      c.box(2, 7, 13, 11, X.PL);
      c.rect(2, 7, 3, 11, D(X.PL)); // the receiver
      c.rect(10, 8, 12, 8, u ? X.PHOS : X.SCR0);
      dots(c, X.GREY, [10, 10, 12, 10]);
      c.row(10, 5, 8, X.BLK);
      led(c, 9, 8, u, X.LEDG);
      if (u) {
        sheet(c, 4, 10, 9, 19); // a long message coming through
        c.rect(5, 20, 10, 21, PAPER);
        c.row(b, 6, 11, PAPER);
        c.set(6, 20, INK);
      }
    },
    sw: 13,
    sh: 25,
    SU: { w: 17, x(c) {
      cable(c, [[11, 10], [13, 11], [14, 15], [13, 20], [14, 23]], PAPER);
      c.row(23, 12, 15, PAPER);
    } },
    s(c, u) {
      const b = 23,
        F = hex('#b9ad92');
      c.box(2, 14, 10, b, F);
      c.rect(1, 12, 11, 13, F);
      c.row(12, 1, 11, L(F));
      c.line(3, 7, 5, 3, PAPER);
      c.line(4, 7, 6, 3, C.white);
      c.poly([[2, 7], [7, 7], [11, 9], [11, 11], [2, 11]], X.PL);
      c.row(7, 2, 7, L(X.PL));
      c.set(9, 8, u ? X.LEDG : X.GREY);
    },
  });

  obj('mobile-phone-brick', 'mobile phone brick phone old cellphone aerial eighties yuppie', {
    w: 7,
    h: 17,
    p: true,
    U: { own: true, h: 21 },
    f(c, u) {
      const b = c.h - 2;
      c.col(2, u ? 1 : b - 14, b - 12, X.BLK); // the aerial, pulled out
      c.box(1, b - 11, 5, b, hex('#4a4a52'));
      c.rect(2, b - 10, 4, b - 9, X.BLK);
      c.rect(2, b - 8, 4, b - 7, u ? X.PHOS : hex('#5a6a52'));
      for (let y = b - 5; y <= b - 1; y += 2) dots(c, u ? C.glow : X.GREYL, [2, y, 4, y]);
    },
    sw: 6,
    sh: 17,
    SU: { own: true, h: 21 },
    s(c, u) {
      const b = c.h - 2;
      c.col(2, u ? 1 : b - 14, b - 12, X.BLK);
      c.rect(1, b - 11, 2, b, hex('#4a4a52'));
      c.rect(3, b - 9, 4, b, X.BLK); // the battery
      c.col(1, b - 11, b, L(hex('#4a4a52')));
    },
  });

  obj('games-console-pad', 'games console with joypad cartridge video game eight bit', {
    w: 18,
    h: 9,
    p: true,
    f(c, u) {
      const b = 7;
      c.box(1, 3, 11, b, hex('#a39e94'));
      c.rect(1, 3, 11, 4, hex('#5a5860'));
      c.rect(3, b - 1, 4, b - 1, C.plum);
      led(c, 9, b - 1, u);
      if (u) {
        c.rect(4, 1, 8, 3, hex('#6a6a70')); // a cartridge in
        c.rect(5, 2, 7, 2, C.mustard);
      } else c.row(3, 4, 8, X.BLK);
      c.rect(14, b - 1, 16, b, hex('#5a5860')); // the pad
      c.set(15, b - 1, C.red);
      cable(c, u ? [[11, b], [13, b - 2], [14, b - 1]] : [[11, b], [13, b]], X.BLK);
    },
    sw: 11,
    sh: 9,
    s(c, u) {
      const b = 7;
      c.box(1, 3, 9, b, hex('#a39e94'));
      c.rect(1, 3, 9, 4, hex('#5a5860'));
      c.set(9, b - 1, u ? X.LEDR : mix(X.LEDR, 0.35));
      if (u) c.rect(3, 1, 6, 3, hex('#6a6a70'));
      else c.row(3, 3, 6, X.BLK);
    },
  });

  obj('boombox-twin-deck', 'boombox ghetto blaster radio cassette recorder portable stereo aerial', {
    w: 24,
    h: 14,
    p: true,
    U: { h: 20, x(c) {
      c.line(19, 8, 22, 1, X.CHR);
    } },
    f(c, u) {
      const b = 12,
        S = hex('#8a8c92');
      c.row(1, 5, 18, X.BLK); // the handle
      c.set(5, 2, X.BLK);
      c.set(18, 2, X.BLK);
      c.box(1, 3, 22, b, S);
      c.rect(1, 3, 22, 4, X.BLK);
      dots(c, X.CHR, [9, 4, 11, 4, 13, 4, 15, 4]);
      cone(c, 2, 5, 8, 11, u);
      cone(c, 15, 5, 21, 11, u);
      c.rect(10, 6, 13, 6, u ? X.AMBER : hex('#6a6040')); // the dial
      c.rect(10, 8, 13, 10, X.SCR0);
      dots(c, u ? C.white : X.GREY, [11, 9, 12, 9]);
      leds(c, 10, 11, 2, 3, u, [X.LEDR, X.LEDG]);
      if (!u) c.row(2, 14, 21, X.CHR);
    },
    sw: 9,
    sh: 14,
    SU: { h: 20, x(c) {
      c.line(5, 8, 6, 1, X.CHR);
    } },
    s(c, u) {
      const b = 12,
        S = hex('#8a8c92');
      c.rect(3, 1, 5, 2, X.BLK);
      c.box(1, 3, 7, b, S);
      c.rect(1, 3, 7, 4, X.BLK);
      vents(c, 3, 6, 5, 10, D(S));
      if (!u) c.set(6, 2, X.CHR);
    },
  });

  obj('security-monitor-desk', 'security desk cctv monitors guard room surveillance recorder joystick', {
    w: 32,
    h: 29,
    f(c, u) {
      const b = 27,
        kinds = ['cam', 'static', 'cam', 'cam'];
      c.rect(1, 15, 30, 16, DESK);
      c.row(15, 1, 30, L(DESK));
      c.box(2, 17, 29, b, DESK);
      panel(c, 4, 19, 14, b - 2, DESK);
      c.rect(17, 19, 27, 22, X.BLK); // the recorder
      c.row(21, 18, 22, X.GREY);
      led(c, 26, 20, u);
      vents(c, 18, 24, 26, b - 2, D(DESK));
      for (let i = 0; i < 4; i++) {
        const x = 2 + (i % 2) * 10,
          y = 1 + ((i / 2) | 0) * 7;
        c.box(x, y, x + 9, y + 6, X.BLK);
        scr(c, x + 1, y + 1, x + 8, y + 5, u, kinds[i], i + 2);
        if (u && i === 2) c.rect(x + 4, y + 2, x + 5, y + 5, C.black); // somebody stands in the corridor
        if (u && i === 2) c.set(x + 4, y + 2, C.bone);
      }
      c.rect(23, 11, 29, 14, X.GREY); // the controls
      c.col(25, 8, 11, X.BLK);
      c.set(25, 8, C.red);
      dots(c, C.white, [27, 12, 28, 12, 27, 13, 28, 13]);
      cup(c, 23, 9, C.white);
      c.clearRect(23, 7, 26, 7);
    },
    sw: 15,
    sh: 29,
    s(c, u) {
      const b = 27;
      c.rect(1, 15, 13, 16, DESK);
      c.row(15, 1, 13, L(DESK));
      c.box(2, 17, 12, b, DESK);
      for (const y of [1, 8]) {
        c.poly([[3, y + 2], [6, y], [10, y], [10, y + 6], [3, y + 5]], X.BLK);
        c.col(10, y, y + 6, mix(X.BLK, 1.6));
        c.col(11, y + 1, y + 5, u ? hex('#7d8882') : X.SCR0);
      }
      c.rect(11, 13, 12, 14, X.GREY);
      vents(c, 4, 20, 9, b - 3, D(DESK));
    },
  });

  obj('photocopier-office', 'photocopier office copier xerox lid light paper tray', {
    w: 27,
    h: 25,
    U: { h: 33, x(c) {
      c.rect(2, 2, 19, 11, hex('#8a877c')); // the lid up
      c.rect(3, 3, 18, 10, C.white);
      c.row(2, 2, 19, X.PL);
    } },
    f(c, u) {
      const b = 23;
      c.box(1, 7, 21, b - 1, X.PL);
      c.rect(22, 12, 25, 12, X.GREY); // where the copies come out
      c.rect(22, 11, 24, 11, u ? PAPER : X.GREY);
      if (u) c.rect(22, 10, 25, 10, PAPER);
      if (!u) {
        c.rect(2, 4, 19, 6, hex('#8a877c'));
        c.row(4, 2, 19, X.PL);
      } else {
        c.rect(2, 5, 19, 6, C.glassLight);
        c.rect(6, 5, 9, 6, hex('#dff0d0')); // the light going across
        c.col(5, 5, 6, X.PHOS);
      }
      c.rect(14, 8, 20, 10, D(X.PL));
      c.set(19, 9, u ? X.LEDG : mix(X.LEDG, 0.4));
      dots(c, X.GREY, [15, 9, 17, 9]);
      door(c, 2, 12, 20, 15, X.PL, 'm', X.BLK);
      door(c, 2, 16, 20, 19, X.PL, 'm', X.BLK);
      vents(c, 3, 20, 10, b - 2, D(X.PL));
      wheel(c, 3, b, 1);
      wheel(c, 19, b, 1);
    },
    sw: 17,
    sh: 25,
    SU: { h: 33, x(c) {
      c.line(2, 12, 6, 3, hex('#8a877c'));
      c.line(3, 12, 7, 3, C.white);
    } },
    s(c, u) {
      const b = 23;
      c.box(1, 7, 14, b - 1, X.PL);
      if (!u) {
        c.rect(2, 4, 13, 6, hex('#8a877c'));
        c.row(4, 2, 13, X.PL);
      } else c.rect(3, 6, 13, 6, hex('#dff0d0'));
      c.col(14, 8, 10, D(X.PL));
      c.col(14, 12, 19, D(X.PL));
      vents(c, 3, 10, 8, 16, D(X.PL));
      wheel(c, 3, b, 1);
      wheel(c, 12, b, 1);
    },
  });

  obj('dot-matrix-printer-stand', 'dot matrix printer on stand fanfold paper computer printout listing', {
    w: 18,
    h: 27,
    f(c, u) {
      const b = 25;
      legs(c, [2, 14], 15, b, X.GREY);
      c.rect(1, 13, 16, 14, X.GREY);
      c.row(13, 1, 16, X.GREYL);
      c.rect(4, 20, 12, b, hex('#8a6a4a')); // the carton of paper under it
      c.row(20, 4, 12, PAPER);
      c.col(8, 15, 19, PAPER);
      c.rect(4, 3, 12, 8, PAPER); // paper going through
      for (let y = 4; y <= 8; y += 2) c.row(y, 5, 11, hex('#bcd0b0'));
      for (let y = 3; y <= 8; y += 2) dots(c, X.GREY, [4, y, 12, y]);
      c.box(2, 8, 14, 12, X.PL);
      c.rect(3, 9, 13, 9, hex('#5a5048'));
      c.rect(15, 10, 15, 11, X.BLK);
      led(c, 12, 11, u, X.LEDG);
      if (u) {
        sheet(c, 4, 10, 12, 17); // the listing pours over the front
        c.row(18, 3, 11, PAPER);
        sheet(c, 3, 19, 11, 23);
        c.rect(5, b - 1, 14, b, PAPER);
        c.row(b - 1, 6, 13, INK);
      }
    },
    sw: 13,
    sh: 27,
    SU: { w: 17, x(c) {
      cable(c, [[11, 9], [13, 11], [12, 16], [14, 20], [12, 24]], PAPER);
      c.rect(11, 24, 15, 25, PAPER);
    } },
    s(c, u) {
      const b = 25;
      legs(c, [2, 10], 15, b, X.GREY);
      c.rect(1, 13, 11, 14, X.GREY);
      c.row(13, 1, 11, X.GREYL);
      c.rect(3, 20, 9, b, hex('#8a6a4a'));
      c.row(20, 3, 9, PAPER);
      c.line(4, 19, 3, 14, PAPER);
      c.line(4, 8, 6, 3, PAPER);
      c.line(5, 8, 7, 3, hex('#bcd0b0'));
      c.box(2, 8, 10, 12, X.PL);
      c.set(10, 11, u ? X.LEDG : X.GREY);
    },
  });

  obj('microfiche-reader-table', 'microfiche reader microfilm viewer library archive newspaper screen', {
    w: 18,
    h: 31,
    f(c, u) {
      const b = 29,
        W = C.wood;
      c.rect(1, 18, 16, 19, W);
      c.row(18, 1, 16, L(W));
      legs(c, [2, 14], 20, b, W, 2);
      door(c, 5, 20, 12, 22, W, 'm', C.brass);
      c.box(2, 2, 15, 13, hex('#4a4e58'));
      if (!u) c.rect(3, 3, 14, 11, hex('#6a7078'));
      else {
        c.rect(3, 3, 14, 11, PAPER); // an old front page
        c.rect(4, 4, 13, 4, X.BLK);
        c.rect(4, 6, 8, 9, hex('#5a5a60'));
        c.set(6, 7, PAPER);
        for (let y = 6; y <= 10; y += 2) c.row(y, 10, 13, INK);
        c.row(10, 4, 8, INK);
      }
      c.rect(1, 14, 16, 16, hex('#4a4e58'));
      c.row(15, 3, 12, u ? C.glow : C.glass);
      c.rect(14, 15, 15, 15, X.CHR);
      c.row(17, 3, 14, X.BLK);
    },
    sw: 13,
    sh: 31,
    s(c, u) {
      const b = 29,
        W = C.wood;
      c.rect(1, 18, 11, 19, W);
      c.row(18, 1, 11, L(W));
      legs(c, [2, 9], 20, b, W, 2);
      c.poly([[2, 4], [6, 2], [10, 2], [10, 13], [2, 13]], hex('#4a4e58'));
      c.col(10, 3, 11, u ? PAPER : hex('#6a7078'));
      c.rect(2, 14, 11, 16, hex('#4a4e58'));
      c.set(11, 15, u ? C.glow : C.glass);
      c.row(17, 3, 10, X.BLK);
    },
  });

  obj('coffee-vending-machine', 'coffee machine vending hot drinks plastic cup canteen waiting room', {
    w: 17,
    h: 35,
    f(c, u) {
      const b = 33,
        B = hex('#5a4030');
      c.box(1, 2, 15, b, B);
      c.rect(2, 3, 14, 12, u ? hex('#b0703a') : hex('#6a4a34')); // the picture: a steaming cup
      c.rect(6, 7, 10, 10, u ? C.white : C.bone);
      c.set(11, 8, u ? C.white : C.bone);
      wisp(c, 8, 6, 3, u ? C.white : hex('#8a7a6a'));
      hole(c, 3, 15, 9, 23, hex('#23201c')); // where the cup drops
      c.row(23, 3, 9, X.CHR);
      for (let y = 15; y <= 21; y += 2) {
        c.rect(11, y, 13, y, C.bone);
        c.set(11, y, u && y === 17 ? X.LEDG : X.GREY);
      }
      c.rect(11, 23, 13, 23, X.BLK);
      c.rect(11, 25, 13, 26, u ? X.AMBER : mix(X.AMBER, 0.35));
      panel(c, 3, 26, 9, b - 2, B);
      vents(c, 11, 28, 13, b - 2, D(B));
      c.row(b, 1, 15, X.BLK);
      if (u) {
        c.row(15, 4, 8, C.glow);
        c.rect(5, 20, 7, 22, C.white);
        c.row(20, 5, 7, hex('#6a4a34'));
        wisp(c, 6, 19, 3);
        c.col(4, 24, 27, hex('#3a2a1c')); // it drips
      }
    },
    sw: 13,
    sh: 35,
    s(c, u) {
      const b = 33,
        B = hex('#5a4030');
      c.box(1, 2, 11, b, B);
      c.col(11, 3, 12, u ? hex('#b0703a') : hex('#6a4a34'));
      c.col(11, 15, 23, hex('#23201c'));
      if (u) c.set(11, 15, C.glow);
      panel(c, 3, 5, 8, 20, B);
      vents(c, 3, 24, 8, b - 3, D(B));
      c.row(b, 1, 11, X.BLK);
    },
  });

  obj('battery-bank-rack', 'battery bank rack of batteries accumulators backup power acid cables', {
    w: 28,
    h: 23,
    f(c, u) {
      const b = 21,
        CASE = hex('#2e3440');
      legs(c, [1, 25], 2, b, X.GREY);
      c.row(11, 1, 25, X.GREY);
      c.row(b - 1, 1, 25, X.GREY);
      c.row(2, 1, 25, X.GREY);
      for (let j = 0; j < 2; j++)
        for (let i = 0; i < 4; i++) {
          const x = 3 + i * 6,
            y = j ? 14 : 5;
          c.box(x, y, x + 4, y + 5, CASE);
          c.row(y, x, x + 4, C.white);
          dots(c, C.brass, [x + 1, y - 1, x + 3, y - 1]);
          if (i < 3) c.row(y - 2, x + 3, x + 7, j ? X.BLK : C.red);
          if (i < 3) dots(c, j ? X.BLK : C.red, [x + 3, y - 1, x + 7, y - 1]);
        }
      cable(c, [[22, 4], [24, 8], [22, 12]], C.red);
      if (u) {
        c.line(11, 15, 12, 19, C.night); // one has split
        c.col(11, 17, b - 2, hex('#a8a84a'));
        c.rect(9, b, 14, b, hex('#a8a84a'));
        dots(c, C.ghost, [9, 13, 10, 12, 12, 13, 10, 13]); // crust on the terminals
        dots(c, C.flameLight, [16, 3, 17, 2, 15, 2]);
        c.set(16, 4, C.white);
      }
    },
    sw: 13,
    sh: 23,
    s(c, u) {
      const b = 21,
        CASE = hex('#2e3440');
      legs(c, [1, 10], 2, b, X.GREY);
      c.row(11, 1, 10, X.GREY);
      c.row(b - 1, 1, 10, X.GREY);
      c.row(2, 1, 10, X.GREY);
      for (const y of [5, 14]) {
        c.box(3, y, 8, y + 5, CASE);
        c.row(y, 3, 8, C.white);
        dots(c, C.brass, [5, y - 1]);
      }
      if (u) {
        c.col(8, 17, b - 2, hex('#a8a84a'));
        c.rect(8, b, 11, b, hex('#a8a84a'));
        dots(c, C.flameLight, [6, 3, 7, 2]);
      }
    },
  });

  obj('radar-console-round', 'radar console round screen sweep blips control tower ship bridge', {
    w: 21,
    h: 27,
    f(c, u) {
      const b = 25,
        M = NAVYG;
      c.box(3, 15, 17, b, M);
      panel(c, 5, 17, 15, b - 2, M);
      c.box(1, 2, 19, 14, M);
      c.oval(2, 3, 12, 13, X.CHR);
      c.oval(3, 4, 11, 12, u ? hex('#1e3a26') : hex('#1c2420'));
      if (u) {
        for (let a = 0; a < 16; a++) c.set(Math.round(7 + 2.6 * Math.cos((a * Math.PI) / 8)), Math.round(8 + 2.6 * Math.sin((a * Math.PI) / 8)), mix(X.PHOS, 0.6));
        c.line(7, 8, 10, 5, X.PHOS); // the sweep
        c.line(7, 8, 9, 5, mix(X.PHOS, 0.6));
        dots(c, C.white, [5, 6, 9, 10]);
        c.set(4, 10, X.PHOS);
      } else c.set(5, 6, mix(X.SCR0, 1.9));
      for (let y = 4; y <= 10; y += 3) dots(c, X.BLK, [15, y, 17, y]);
      leds(c, 14, 12, 3, 2, u, [X.LEDG, X.AMBER, X.LEDR]);
      c.row(b, 3, 17, X.BLK);
    },
    sw: 15,
    sh: 27,
    s(c, u) {
      const b = 25,
        M = NAVYG;
      c.box(2, 15, 11, b, M);
      c.poly([[2, 2], [8, 2], [11, 5], [11, 14], [2, 14]], M);
      c.col(2, 2, 14, L(M));
      c.poly([[9, 3], [13, 4], [13, 12], [11, 13]], X.BLK); // the rubber hood
      if (u) c.col(12, 6, 10, mix(X.PHOS, 0.6));
      vents(c, 4, 6, 7, 11, D(M));
      c.row(b, 2, 11, X.BLK);
    },
  });

  obj('teleprinter-telex', 'teleprinter telex teletype machine punched tape newsroom message', {
    w: 19,
    h: 27,
    f(c, u) {
      const b = 25,
        M = HAMMER;
      c.box(5, 15, 13, b, X.GREY);
      c.row(b, 3, 15, X.BLK);
      c.box(1, 6, 17, 14, M);
      c.rect(5, u ? 1 : 3, 12, 6, PAPER);
      if (u) for (let y = 2; y <= 5; y += 2) c.row(y, 6, 10, INK);
      c.rect(4, 6, 13, 7, X.BLK);
      c.rect(3, 9, 15, 9, D(M));
      for (let y = 11; y <= 13; y += 2) for (let x = 3 + (y === 13 ? 1 : 0); x <= 15; x += 2) c.set(x, y, C.bone);
      c.rect(1, 9, 2, 12, X.BLK); // the tape punch
      led(c, 16, 8, u, X.AMBER);
      if (u) {
        cable(c, [[1, 12], [2, 16], [1, 20], [3, b - 1]], C.mustard); // punched tape running out
        cable(c, [[3, b - 1], [5, b], [2, b]], C.mustard);
        dots(c, X.BLK, [2, 15, 1, 18, 2, 21]);
      }
    },
    sw: 13,
    sh: 27,
    s(c, u) {
      const b = 25,
        M = HAMMER;
      c.box(3, 15, 9, b, X.GREY);
      c.row(b, 2, 10, X.BLK);
      c.poly([[2, 6], [8, 6], [11, 10], [11, 14], [2, 14]], M);
      c.col(2, 6, 14, L(M));
      c.rect(4, u ? 1 : 3, 5, 6, PAPER);
      c.line(8, 7, 11, 11, C.bone);
      if (u) {
        cable(c, [[10, 14], [11, 18], [10, 22], [11, b]], C.mustard);
      }
    },
  });

  obj('walkie-talkie-charger', 'walkie talkies in charger two-way radios handsets security guard', {
    w: 14,
    h: 15,
    p: true,
    f(c, u) {
      const b = 13;
      c.box(1, 10, 12, b, X.BLK);
      c.row(10, 1, 12, mix(X.BLK, 1.7));
      for (const x of [2, 8]) {
        if (u && x === 8) {
          c.rect(8, 10, 11, 10, C.night); // one is gone
          continue;
        }
        c.col(x, 1, 3, X.BLK);
        c.box(x, 4, x + 3, 9, hex('#4a4a52'));
        grille(c, x + 1, 5, x + 2, 6, X.BLK, X.GREY);
        c.set(x + 3, 4, C.red);
      }
      led(c, 3, 12, u, X.LEDG);
      led(c, 9, 12, u, X.LEDR);
    },
    sw: 9,
    sh: 15,
    s(c, u) {
      const b = 13;
      c.box(1, 10, 7, b, X.BLK);
      c.row(10, 1, 7, mix(X.BLK, 1.7));
      c.col(3, 1, 3, X.BLK);
      c.rect(3, 4, 5, 9, hex('#4a4a52'));
      c.col(3, 4, 9, L(hex('#4a4a52')));
      c.set(7, 12, u ? X.LEDG : mix(X.LEDG, 0.35));
    },
  });

  obj('overhead-projector-cart', 'overhead projector on cart classroom transparency lecture light', {
    w: 18,
    h: 35,
    f(c, u) {
      const b = 33;
      legs(c, [2, 14], 20, b - 2, X.GREY);
      c.rect(1, 19, 15, 20, X.GREY);
      c.row(26, 2, 14, X.GREY);
      wheel(c, 2, b - 1, 1);
      wheel(c, 14, b - 1, 1);
      c.box(2, 13, 13, 18, X.PL);
      vents(c, 3, 15, 7, 17, D(X.PL));
      c.row(12, 3, 12, u ? C.white : C.glass); // the stage
      c.rect(14, 4, 15, 18, X.GREY); // the post
      c.rect(8, 2, 15, 5, X.BLK);
      c.rect(9, 6, 11, 6, u ? C.white : C.glass);
      c.rect(4, 23, 10, 25, C.paper); // transparencies on the shelf
      if (u) {
        for (let y = 7; y <= 11; y++) for (let x = 5; x <= 11; x++) if ((x + y) % 2 === 0) c.set(x, y, C.glow);
        c.set(10, 14, X.LEDG);
        c.row(12, 5, 8, INK);
      }
    },
    sw: 15,
    sh: 35,
    SU: { w: 23, x(c) {
      for (let x = 13; x <= 21; x++) for (let y = 4 - ((x - 12) >> 2); y <= 4 + ((x - 12) >> 2); y++) if ((x + y) % 2 === 0) c.set(x, y, C.glow);
    } },
    s(c, u) {
      const b = 33;
      legs(c, [2, 11], 20, b - 2, X.GREY);
      c.rect(1, 19, 12, 20, X.GREY);
      c.row(26, 2, 11, X.GREY);
      wheel(c, 2, b - 1, 1);
      wheel(c, 11, b - 1, 1);
      c.box(2, 13, 11, 18, X.PL);
      c.row(12, 3, 10, u ? C.white : C.glass);
      c.rect(3, 4, 4, 12, X.GREY);
      c.rect(3, 2, 11, 5, X.BLK);
      c.col(12, 3, 5, u ? C.white : C.glass);
      if (u) for (let y = 7; y <= 11; y++) for (let x = 5; x <= 9; x++) if ((x + y) % 2 === 0) c.set(x, y, C.glow);
    },
  });

  obj('floodlight-tripod-site', 'floodlight on tripod work light site lamp halogen yellow stand', {
    w: 17,
    h: 39,
    f(c, u) {
      const b = 37,
        Y = X.HAZ;
      c.line(8, 24, 2, b, Y);
      c.line(8, 24, 14, b, Y);
      c.rect(8, 9, 8, b, Y);
      c.row(9, 3, 13, Y);
      for (const x of [1, 9]) {
        c.box(x, 2, x + 6, 8, X.BLK);
        c.rect(x + 1, 3, x + 5, 7, u ? C.white : hex('#6a7078'));
        if (u) c.rect(x + 2, 4, x + 4, 6, C.flameLight);
        else {
          c.col(x + 3, 3, 7, X.GREY);
          c.row(5, x + 1, x + 5, X.GREY);
        }
      }
      cable(c, [[8, 20], [10, 28], [12, b - 1], [15, b]], X.BLK);
    },
    sw: 11,
    sh: 39,
    SU: { w: 16, x(c) {
      dots(c, C.glow, [10, 3, 12, 2, 10, 5, 13, 5, 10, 7, 12, 8, 14, 3, 14, 7]);
    } },
    s(c, u) {
      const b = 37,
        Y = X.HAZ;
      c.line(5, 24, 2, b, Y);
      c.line(5, 24, 8, b, Y);
      c.rect(5, 9, 5, b, Y);
      c.poly([[3, 3], [8, 2], [8, 8], [3, 7]], X.BLK);
      c.col(9, 2, 8, u ? C.white : hex('#6a7078'));
      vents(c, 4, 4, 6, 6, X.GREY);
    },
  });

  obj('synthesizer-on-stand', 'synthesizer keyboard on stand electric piano keys band music', {
    w: 34,
    h: 20,
    f(c, u) {
      const b = 18;
      c.line(8, 10, 25, b, X.CHR);
      c.line(25, 10, 8, b, X.CHR);
      c.row(b, 6, 10, X.CHR);
      c.row(b, 23, 27, X.CHR);
      c.box(1, 3, 32, 9, X.BLK);
      c.rect(3, 4, 8, 5, u ? mix(X.AMBER, 0.9) : hex('#3a3426')); // display
      for (let x = 11; x <= 23; x += 2) c.set(x, 4, [C.red, C.white, C.navy][(x >> 1) % 3]);
      leds(c, 25, 4, 3, 2, u, [X.LEDR, X.LEDG]);
      c.rect(2, 7, 31, 8, C.white); // keys
      for (let x = 3; x <= 30; x += 2) if ((x >> 1) % 7 !== 3 && (x >> 1) % 7 !== 6) c.set(x, 7, X.BLK);
      if (u) {
        c.rect(12, 8, 12, 8, X.GREYL); // a chord held down by nobody
        c.rect(16, 8, 16, 8, X.GREYL);
        c.rect(20, 8, 20, 8, X.GREYL);
        c.rect(14, b - 1, 17, b, X.BLK);
        cable(c, [[17, 9], [19, 13], [16, b - 1]], X.BLK);
      }
    },
    sw: 12,
    sh: 20,
    s(c, u) {
      const b = 18;
      c.line(3, 10, 8, b, X.CHR);
      c.line(8, 10, 3, b, X.CHR);
      c.row(b, 2, 9, X.CHR);
      c.poly([[2, 4], [4, 3], [9, 6], [9, 9], [2, 9]], X.BLK);
      c.line(5, 4, 9, 6, C.white);
      c.set(3, 4, u ? X.LEDR : mix(X.LEDR, 0.35));
    },
  });

  obj('camcorder-vhs-shoulder', 'camcorder video camera vhs home movies viewfinder tape', {
    w: 19,
    h: 13,
    base: 'side',
    p: true,
    U: { h: 17, x(c) {
      c.rect(6, 2, 12, 5, hex('#3a3a42')); // the flap up, a tape half out
      c.rect(7, 3, 11, 5, X.BLK);
      c.rect(8, 4, 10, 4, C.paper);
    } },
    f(c, u) {
      const b = 11,
        M = hex('#3a3a42');
      c.box(4, 4, 13, b - 1, M);
      c.rect(14, 5, 16, 8, X.BLK); // lens
      c.col(17, 5, 8, C.glass);
      c.rect(1, 3, 6, 4, X.BLK); // viewfinder
      c.rect(1, 2, 1, 5, X.GREY);
      c.rect(11, 2, 15, 3, X.GREY); // microphone
      c.rect(6, 6, 11, 8, u ? C.night : D(M));
      c.rect(6, b, 9, b, X.BLK);
      c.set(13, 5, u ? X.LEDR : mix(X.LEDR, 0.35));
      c.rect(7, 9, 9, 9, C.paper);
    },
    sw: 11,
    sh: 13,
    SU: { h: 17, x(c) {
      c.rect(2, 2, 3, 5, hex('#3a3a42'));
      c.set(3, 4, C.paper);
    } },
    s(c, u) {
      const b = 11,
        M = hex('#3a3a42');
      c.box(2, 4, 8, b - 1, M);
      c.oval(3, 5, 7, 9, X.BLK);
      c.oval(4, 6, 6, 8, C.glass);
      c.set(4, 6, C.glassLight);
      c.rect(4, 2, 6, 3, X.GREY);
      c.set(8, 4, u ? X.LEDR : mix(X.LEDR, 0.35));
      c.rect(3, b, 6, b, X.BLK);
    },
  });

  obj('handheld-game-grey', 'handheld game console pocket video game falling blocks batteries', {
    w: 8,
    h: 13,
    p: true,
    f(c, u) {
      const b = 11,
        G = hex('#a39e94'),
        LCD = u ? hex('#9aa85a') : hex('#6a7450');
      c.box(1, 1, 6, b, G);
      c.rect(2, 2, 5, 5, LCD);
      if (u) dots(c, hex('#2e3a22'), [2, 5, 3, 5, 5, 5, 3, 4, 4, 2, 4, 3]);
      c.set(6, 3, u ? X.LEDR : mix(X.LEDR, 0.4));
      dots(c, X.BLK, [2, 8, 3, 7, 3, 9]);
      dots(c, C.wine, [5, 7, 4, 8]);
      c.row(b - 1, 4, 5, D(G));
    },
    sw: 5,
    sh: 13,
    s(c, u) {
      const G = hex('#a39e94');
      c.rect(1, 1, 3, 11, G);
      c.col(1, 1, 11, L(G));
      c.col(3, 2, 5, u ? hex('#9aa85a') : hex('#6a7450'));
      c.set(2, 7, D(G));
    },
  });

  obj('till-electronic-drawer', 'electronic till cash register shop counter drawer money receipt', {
    w: 19,
    h: 19,
    f(c, u) {
      const b = 17,
        M = hex('#6a665c');
      c.box(1, 11, 17, b, M);
      c.poly([[2, 10], [16, 10], [15, 6], [3, 6]], L(M)); // the keys
      for (let y = 7; y <= 9; y++) for (let x = 4; x <= 14; x += 2) c.set(x, y, x > 11 ? [C.red, C.mustard, X.LEDG][y - 7] : C.bone);
      c.box(9, 2, 16, 5, X.BLK);
      c.rect(10, 3, 15, 4, u ? X.PHOS : mix(X.PHOS, 0.3));
      c.rect(3, 3, 6, 5, M);
      c.rect(4, u ? 1 : 2, 5, 3, PAPER);
      if (!u) {
        c.rect(3, 13, 15, 13, D(M));
        c.set(9, 14, X.CHR);
      } else {
        hole(c, 2, 11, 16, 13, C.night); // the drawer out
        for (let x = 3; x <= 9; x += 3) c.rect(x, 12, x + 1, 13, [hex('#8a9a72'), C.paper, hex('#a87a6a')][(x / 3) | 0]);
        dots(c, C.brass, [12, 13, 13, 13, 15, 13, 14, 12]);
        c.rect(1, 14, 17, b, M);
        c.row(14, 1, 17, L(M));
        c.set(9, 15, X.CHR);
      }
    },
    sw: 15,
    sh: 19,
    SU: { w: 20, x(c) {
      c.rect(14, 12, 18, 15, hex('#6a665c'));
      c.row(12, 13, 17, C.night);
      c.col(18, 12, 15, D(hex('#6a665c')));
      c.set(15, 11, hex('#8a9a72'));
    } },
    s(c, u) {
      const b = 17,
        M = hex('#6a665c');
      c.box(1, 11, 13, b, M);
      c.poly([[3, 6], [6, 6], [13, 9], [13, 10], [3, 10]], L(M));
      c.rect(2, 2, 5, 5, X.BLK);
      c.col(6, 3, 4, u ? X.PHOS : mix(X.PHOS, 0.3));
      c.rect(8, u ? 3 : 5, 9, 7, PAPER);
    },
  });

  obj('power-strip-overloaded', 'power strip extension lead adaptors plugs tangle overloaded socket fire hazard', {
    w: 20,
    h: 13,
    p: true,
    f(c, u) {
      const b = 11;
      c.box(1, b - 2, 13, b, C.white);
      c.rect(2, b - 1, 2, b - 1, u ? mix(X.LEDR, 0.4) : X.LEDR);
      for (const x of [4, 7, 10]) {
        c.rect(x, b - 5, x + 1, b - 3, x === 7 ? C.white : X.BLK); // plugs, and adaptors on adaptors
        if (x === 7) c.rect(6, b - 8, 9, b - 6, C.white);
        if (x === 7) dots(c, X.BLK, [6, b - 9, 9, b - 9, 7, b - 7]);
      }
      cable(c, [[5, b - 5], [4, b - 8], [1, b - 6]], X.BLK);
      cable(c, [[6, b - 9], [3, b - 10], [2, b - 9]], X.GREY);
      cable(c, [[9, b - 9], [13, b - 9], [16, b - 4], [18, b]], X.BLK);
      cable(c, [[11, b - 5], [14, b - 5], [15, b]], C.white);
      cable(c, [[13, b - 1], [17, b - 1]], C.white);
      if (u) {
        c.rect(6, b - 7, 9, b - 3, hex('#2a2420')); // burnt black
        c.rect(5, b - 2, 10, b - 2, hex('#4a3a2a'));
        dots(c, C.flameLight, [8, b - 9, 10, b - 7]);
        c.set(9, b - 8, C.flame);
        wisp(c, 7, b - 9, 2);
      }
    },
    sw: 9,
    sh: 13,
    s(c, u) {
      const b = 11;
      c.box(1, b - 2, 6, b, C.white);
      c.rect(3, b - 5, 4, b - 3, u ? hex('#2a2420') : C.white);
      c.rect(2, b - 8, 5, b - 6, u ? hex('#2a2420') : C.white);
      cable(c, [[5, b - 7], [7, b - 4], [7, b]], X.BLK);
      if (u) {
        c.set(4, b - 9, C.flameLight);
        wisp(c, 3, b - 9, 2);
      }
    },
  });
};
