/* env-urban, second half: yards, roofs, bars and arcades. Part of tools/big/env-city.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, txt, scribble, wheel, ring } = X;
  const { bricks, planks, hazard, tins, bottles, litter, flame, smoke, pool, carSide, carFront } = X;
  const { TYRE, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, BLUEL, CARD, CARDD, BAG, DIRTW, WATER, WATERL, SMOKE, POLE, DARK } = X;
  setCat('env-urban', 'Urban');

  const WARM = hex('#6e5a2e'),
    I = hex('#2c2f36'),
    CLOTH = [hex('#7a4a5a'), hex('#4f6470'), hex('#8a8a70'), hex('#5a6a4a'), hex('#8a5a3a'), hex('#3a3a4e'), hex('#9a8f80')];
  const eyes = (c, x, y, gap = 3) => {
    c.set(x, y, C.white);
    c.set(x + gap, y, C.white);
  };

  /* ---------- fences and gates ---------- */
  T('razor-wire-coil', 'razor wire coil barbed wire concertina fence top cloth caught blood', {
    w: 34, h: 12,
    f(c, u) {
      for (let i = 0; i < 6; i++) ring(c, 5 + i * 5, 5, 4, i % 2 ? C.steel : mix(C.steel, 0.75));
      for (let i = 0; i < 6; i++) dots(c, C.white, [5 + i * 5, 1, 2 + i * 5, 8, 8 + i * 5, 3]);
      if (u) {
        c.rect(14, 6, 16, 8, hex('#7a3a34'));
        c.set(15, 9, hex('#7a3a34'));
        c.set(14, 10, hex('#5a2a26'));
        dots(c, C.blood, [19, 9, 21, 7, 20, 10]);
      }
    },
    sw: 12,
    s(c, u) {
      ring(c, 5, 5, 4, C.steel);
      ring(c, 6, 5, 4, mix(C.steel, 0.75));
      dots(c, C.white, [5, 1, 2, 8, 9, 3, 10, 7]);
      if (u) c.rect(6, 6, 7, 8, hex('#7a3a34'));
      if (u) c.set(7, 10, C.blood);
    },
  });
  {
    const bars = (c, x0, x1, y0, y1, step) => {
      for (let x = x0 + step; x < x1; x += step) c.col(x, y0, y1, I);
      c.frame(x0, y0, x1, y1, C.iron);
      c.col(x0, y0, y1, L(C.iron));
      c.row((y0 + y1) >> 1, x0, x1, C.iron);
    };
    T('security-gate-bars', 'security gate steel bars yard door locked barred swung open', {
      w: 24, h: 40, solid: true, sum: [0, 0, 16],
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 1, 2, b, C.ironDark);
        c.rect(21, 1, 22, b, C.ironDark);
        c.row(1, 1, 22, C.ironDark);
        if (u) {
          c.poly([[3, 2], [9, 5], [9, b], [3, b]], I);
          c.clearRect(4, 4, 8, b - 1);
          for (const x of [3, 5, 7, 9]) c.col(x, 2 + Math.round((x - 3) / 2), b, x === 9 ? C.iron : I);
          c.line(3, 2, 9, 5, C.iron);
          c.row(b, 3, 9, C.iron);
          c.row(20, 3, 9, C.iron);
          c.rect(8, 19, 9, 22, C.steel);
        } else {
          bars(c, 3, 20, 2, b, 3);
          c.rect(16, 18, 20, 23, C.steel);
          c.set(18, 21, DARK);
          c.row(18, 16, 20, L(C.steel));
        }
      },
      sw: 7,
      s(c, u) {
        const b = c.h - 2;
        c.rect(2, 1, 4, b, C.ironDark);
        c.col(2, 1, b, C.iron);
        if (u) {
          bars(c, 5, 20, 2, b, 3);
          c.rect(16, 18, 20, 23, C.steel);
          c.set(18, 21, DARK);
        } else c.rect(5, 19, 5, 22, C.steel);
      },
    });
  }
  {
    const CAMW = hex('#b9b6a8');
    const face = (c, x, y, on) => {
      c.rect(x, y, x + 5, y + 5, CAMW);
      c.row(y - 1, x - 1, x + 6, C.steel);
      c.rect(x + 1, y + 1, x + 4, y + 4, DARK);
      c.rect(x + 2, y + 2, x + 3, y + 3, on ? hex('#3a4a66') : C.ironDark);
      c.set(x + 2, y + 2, on ? C.glassLight : C.iron);
      c.set(x + 5, y + 5, on ? REDL : hex('#5a2622'));
      if (on) c.set(x + 6, y + 5, REDL);
    };
    const profile = (c, x, y, on) => {
      c.poly([[x, y], [x + 8, y + 2], [x + 8, y + 5], [x, y + 4]], CAMW);
      c.line(x - 1, y - 1, x + 9, y + 1, C.steel);
      c.rect(x + 8, y + 3, x + 9, y + 5, DARK);
      c.set(x + 6, y + 5, on ? REDL : hex('#5a2622'));
      c.row(y + 4, x + 1, x + 5, C.ash);
    };
    const pole = (c, x) => {
      const b = c.h - 2;
      c.rect(x, 9, x + 1, b, POLE);
      c.col(x, 9, b, L(POLE));
      c.rect(x - 1, b - 1, x + 2, b, D(POLE));
      c.rect(x, 7, x + 4, 8, POLE);
      c.rect(x - 1, 20, x + 2, 24, C.slate);
      c.set(x, 22, C.mustard);
    };
    T('cctv-pole-camera', 'cctv camera on a pole security surveillance watching red light turns', {
      w: 16, h: 46, solid: true,
      f(c, u) {
        pole(c, 3);
        if (u) face(c, 6, 3, true);
        else profile(c, 5, 2, false);
      },
      sw: 16,
      s(c, u) {
        pole(c, 3);
        if (u) profile(c, 5, 2, true);
        else face(c, 6, 3, false);
      },
    });
  }

  /* ---------- roofs ---------- */
  {
    const WD = hex('#7a6a58'),
      FELT = hex('#2e2c34');
    const bird = (c, x, y, col = hex('#8a8e98')) => pat(c, x, y, ['.gg.', 'gggg', '.ggg'], { g: col });
    T('pigeon-coop-rooftop', 'pigeon coop loft rooftop shed wire birds feathers', {
      w: 32, h: 32, solid: true, um: [0, 0, 0],
      f(c, u) {
        const b = c.h - 2;
        legs(c, [3, 27], b - 3, b, C.woodDark, 2);
        planks(c, 2, 9, 29, b - 4, WD, 4);
        c.poly([[1, 8], [30, 5], [30, 7], [1, 10]], FELT);
        c.line(1, 8, 30, 5, hex('#46444e'));
        c.rect(4, 12, 17, 23, hex('#17151c'));
        if (u) {
          c.rect(4, 12, 5, 23, WD);
          c.frame(1, 12, 3, 23, C.woodDark);
          dots(c, C.white, [8, b, 11, b - 1, 14, b, 20, b, 9, 20, 13, 22, 23, b - 1]);
          dots(c, hex('#8a8e98'), [10, b, 17, b, 12, 21]);
          c.set(15, b, C.blood);
        } else {
          c.row(19, 5, 16, C.woodDark);
          bird(c, 6, 16);
          bird(c, 11, 16, hex('#6a6e78'));
          for (let y = 12; y <= 23; y += 2) for (let x = 4 + (y % 4 ? 0 : 1); x <= 17; x += 2) if (!((x + y) % 3)) c.set(x, y, C.steel);
          c.frame(4, 12, 17, 23, C.woodDark);
        }
        for (const x of [21, 25]) {
          c.rect(x, 15, x + 2, 18, hex('#17151c'));
          c.set(x, 15, WD);
          c.set(x + 2, 15, WD);
        }
        c.rect(20, 19, 28, 19, C.woodLight);
        dots(c, C.white, [22, 20, 22, 21, 26, 20, 7, 24, 7, 25, 14, 9]);
        if (!u) bird(c, 20, 3);
      },
      sw: 20,
      s(c, u) {
        const b = c.h - 2;
        legs(c, [3, 14], b - 3, b, C.woodDark, 2);
        planks(c, 2, 9, 16, b - 4, mix(WD, 0.9), 4);
        c.rect(1, 6, 17, 8, FELT);
        c.row(6, 1, 17, hex('#46444e'));
        c.rect(17, 19, 18, 19, C.woodLight);
        c.col(16, 9, b - 4, C.woodDark);
        if (u) {
          c.rect(17, 12, 18, 23, C.woodDark);
          dots(c, C.white, [15, b, 18, b, 12, b - 1]);
        } else bird(c, 8, 3);
      },
    });
  }
  {
    const tower = (c, u) => {
      const b = c.h - 2,
        ST = hex('#6a5444');
      for (const x of [6, 24]) {
        c.rect(x, 31, x + 1, b, C.iron);
        c.col(x, 31, b, L(C.iron));
      }
      c.line(7, 33, 24, 44, C.ironDark);
      c.line(24, 33, 7, 44, C.ironDark);
      c.line(7, 45, 24, b - 1, C.ironDark);
      c.line(24, 45, 7, b - 1, C.ironDark);
      c.row(44, 6, 25, C.iron);
      c.rect(15, 31, 16, b, hex('#5a4438'));
      c.rect(4, 30, 27, 31, C.woodDark);
      planks(c, 4, 7, 27, 29, ST, 3);
      for (let y = 7; y <= 29; y++) {
        for (const x of [25, 26, 27]) c.set(x, y, mix(c.get(x, y), 0.75));
        c.set(4, y, L(ST));
      }
      for (const y of [10, 18, 26]) c.row(y, 4, 27, C.iron);
      c.poly([[3, 6], [15, 1], [16, 1], [28, 6]], hex('#2e2c34'));
      c.line(3, 6, 15, 1, hex('#46444e'));
      for (let y = 9; y <= b; y += 3) c.row(y, 21, 23, C.rust);
      c.col(21, 8, b, C.rust);
      c.col(23, 8, b, C.rust);
      if (u) {
        c.col(10, 19, b, WATER);
        c.col(11, 22, b - 3, WATER);
        dots(c, WATERL, [10, 21, 10, 27, 11, 33, 10, 40, 10, 48]);
        for (let y = 19; y <= 29; y++) c.set(9, y, mix(ST, 0.6));
        c.row(b, 7, 14, WATER);
        dots(c, WATERL, [8, b - 1, 13, b - 1, 12, b]);
      }
    };
    T('water-tower-rooftop', 'rooftop water tower wooden tank on steel legs ladder leaking', {
      w: 32, h: 58, solid: true,
      f: tower,
      sw: 32,
      s: flip(32, 58, tower),
    });
  }
  T('aircon-unit-wall', 'air conditioning unit wall box fan condenser dripping humming', {
    w: 22, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2,
        col = hex('#a9a698');
      c.rect(1, 2, 20, 13, col);
      c.row(2, 1, 20, L(col));
      c.col(1, 2, 13, L(col));
      c.row(13, 1, 20, D(col));
      c.oval(3, 3, 12, 12, DARK);
      if (u) {
        c.line(4, 4, 11, 11, C.steel);
        c.line(11, 4, 4, 11, C.steel);
        c.line(7, 3, 8, 12, C.ash);
        c.line(3, 7, 12, 8, C.ash);
      } else {
        for (let y = 4; y <= 11; y += 2) c.row(y, 4, 11, C.iron);
        c.rect(7, 7, 8, 8, C.steel);
      }
      for (let y = 4; y <= 10; y += 2) c.row(y, 14, 18, D(col));
      c.set(18, 12, u ? GREENL : DARK);
      for (const x of [4, 16]) {
        c.col(x, 14, 16, C.iron);
        c.set(x + 1, 14, C.iron);
      }
      c.col(10, 13, 15, mix(col, 0.6));
      if (u) {
        dots(c, WATERL, [10, 15, 10, 17]);
        c.row(b, 7, 13, WATER);
        c.set(9, b, WATERL);
      } else c.set(10, b, hex('#4a4038'));
    },
    sw: 11,
    s(c, u) {
      const b = c.h - 2,
        col = hex('#a9a698');
      sideBox(c, 2, 2, 8, 13, col);
      c.col(1, 3, 16, C.iron);
      c.line(2, 16, 7, 14, C.iron);
      for (let y = 4; y <= 10; y += 2) c.row(y, 4, 6, D(col));
      if (u) {
        dots(c, WATERL, [6, 15, 6, 17]);
        c.row(b, 4, 8, WATER);
      }
    },
  });
  T('graffiti-wall-slab', 'concrete wall slab graffiti tag spray paint help red letters', {
    w: 38, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 36, b, CONC);
      c.row(2, 1, 36, L(CONC));
      c.col(1, 2, b, L(CONC));
      c.col(18, 3, b, CONCD);
      c.row(b - 3, 1, 36, CONCD);
      c.speckle(1, 3, 36, b, CONCD, 12, 4);
      for (const [x, y, n] of [[6, 3, 7], [25, 3, 11], [31, 3, 5]]) c.col(x, y, y + n, mix(CONC, 0.8));
      const TG = hex('#4f3a6a'),
        TL = hex('#3f6a6a');
      scribble(c, 4, 8, 16, 12, TG, 4);
      c.line(4, 14, 17, 13, TG);
      txt(c, 22, 6, 'K', TL, { k: 2 });
      c.line(20, 18, 33, 17, TL);
      pat(c, 5, 24, ['x...x', '.x.x.', '..x..', '.x.x.', 'x...x'], { x: hex('#2a2a36') });
      if (u) {
        txt(c, 4, 14, 'HELP', C.blood, { k: 2 });
        for (const [x, y, n] of [[5, 24, 5], [12, 24, 3], [21, 24, 6], [29, 22, 4], [16, 24, 2]]) c.col(x, y, y + n, C.blood);
        c.rect(30, b - 1, 33, b, hex('#8a8e98'));
        c.set(34, b - 1, C.blood);
      }
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 5, b, mix(CONC, 0.88));
      c.col(2, 2, b, CONC);
      c.col(5, 2, b, CONCD);
      c.rect(1, b - 2, 6, b, CONCD);
      if (u) c.col(5, 14, 26, C.blood);
      if (u) c.rect(6, b - 4, 6, b - 3, hex('#8a8e98'));
    },
  });

  /* ---------- wrecks and junk ---------- */
  {
    const BURNT = hex('#3a302c');
    T('car-burnt-out', 'burnt out car wreck torched joyrider shell rust still burning', {
      w: 26, h: 21, solid: true, base: 'side', um: [0, 9, 0], sum: [0, 9, 0],
      sw: 48,
      s(c, u) {
        const g = carSide(c, { col: BURNT, noGlass: true, noTyres: true, dead: true, trim: C.ironDark });
        c.speckle(2, g.ry, 45, g.by, C.rust, 9, 3);
        c.speckle(2, g.ry, 45, g.by, hex('#1e1a1c'), 8, 8);
        c.line(36, g.wy, 44, g.wy - 4, BURNT);
        c.line(36, g.wy - 1, 43, g.wy - 4, C.rust);
        dots(c, C.ash, [5, g.b, 15, g.b, 22, g.b, 30, g.b]);
        if (u) {
          flame(c, 15, g.wy - 1, 6);
          flame(c, 20, g.wy - 1, 4);
          flame(c, 27, g.wy - 1, 7);
          flame(c, 39, g.wy - 1, 5);
          smoke(c, 22, g.ry - 1, 10, SMOKE, 3);
          smoke(c, 27, g.ry - 2, 8, hex('#4a4850'), 6);
          smoke(c, 16, g.ry - 1, 6, SMOKE, 9);
        }
      },
      f(c, u) {
        const g = carFront(c, { col: BURNT, noGlass: true, noTyres: true, dead: true, trim: C.ironDark, noPlate: true });
        c.speckle(2, g.ry, 23, g.by, C.rust, 9, 3);
        c.speckle(2, g.ry, 23, g.by, hex('#1e1a1c'), 8, 8);
        if (u) {
          flame(c, 9, g.wy - 1, 6);
          flame(c, 14, g.wy - 1, 4);
          flame(c, 18, g.wy - 1, 5);
          smoke(c, 12, g.ry - 1, 10, SMOKE, 3);
          smoke(c, 16, g.ry - 2, 7, hex('#4a4850'), 6);
        }
      },
    });
  }
  {
    const tyre = (c, x, y) => {
      c.rect(x, y, x + 13, y + 3, TYRE);
      c.clear(x, y);
      c.clear(x + 13, y);
      c.clear(x, y + 3);
      c.clear(x + 13, y + 3);
      c.row(y, x + 2, x + 11, hex('#3a3842'));
      for (let i = x + 1; i < x + 13; i += 2) c.set(i, y + 2, hex('#34323c'));
    };
    T('tyre-stack-yard', 'stack of old tyres car tires pile scrapyard toppled', {
      w: 18, h: 24, solid: true, um: [0, 0, 16], same: true,
      f(c, u) {
        const b = c.h - 2;
        const n = u ? 2 : 5;
        for (let i = 0; i < n; i++) tyre(c, 2 + (i % 2), b - 3 - i * 4);
        dots(c, C.moss, [1, b, 16, b]);
        if (u) {
          tyre(c, 18, b - 3);
          c.oval(22, b - 14, 32, b - 4, TYRE);
          c.oval(25, b - 11, 29, b - 7, hex('#0e0c12'));
          c.oval(24, b - 12, 30, b - 6, hex('#3a3842'));
          c.oval(25, b - 11, 29, b - 7, hex('#0e0c12'));
          c.clearRect(26, b - 10, 28, b - 8);
        } else c.set(8, b - 20, C.moss);
      },
    });
  }
  {
    const basket = (c, x0, y0, x1, y1) => {
      for (let x = x0; x <= x1; x += 2) c.col(x, y0, y1, C.steel);
      for (let y = y0; y <= y1; y += 3) c.row(y, x0, x1, C.steel);
      c.frame(x0, y0, x1, y1, L(C.steel));
    };
    T('trolley-overturned-junk', 'overturned shopping trolley cart on its side junk spilled alley', {
      w: 14, h: 15, base: 'side', sum: [0, 0, 8],
      sw: 24,
      s(c, u) {
        const b = c.h - 2;
        basket(c, 4, 3, 17, b);
        c.rect(1, 3, 2, 4, hex('#8f3b30'));
        c.col(3, 3, b, C.iron);
        c.rect(18, 4, 21, 5, C.iron);
        c.rect(18, b - 2, 21, b - 1, C.iron);
        c.rect(21, 3, 22, 6, TYRE);
        if (!u) c.rect(21, b - 3, 22, b, TYRE);
        c.oval(7, 6, 13, b, BAG);
        c.set(8, 8, hex('#4a4852'));
        if (u) {
          c.rect(21, b, 28, b, CLOTH[0]);
          c.rect(24, b - 2, 26, b, X.TINS[2]);
          c.rect(28, b - 1, 30, b, CARD);
          c.set(19, b, TYRE);
          c.set(31, b, C.paper);
        } else {
          c.rect(14, b - 3, 16, b, hex('#b0602a'));
          c.set(15, b - 4, hex('#b0602a'));
        }
      },
      f(c, u) {
        const b = c.h - 2;
        basket(c, 2, 3, 11, b);
        c.row(2, 2, 11, hex('#8f3b30'));
        c.rect(3, 4, 4, 5, TYRE);
        if (!u) c.rect(9, 4, 10, 5, TYRE);
        c.oval(4, 7, 9, b, BAG);
        if (u) c.rect(5, b - 1, 12, b, CLOTH[0]);
      },
    });
  }
  T('payphone-hooded-post', 'payphone public telephone hood on a post receiver dangling off the hook', {
    w: 14, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2,
        S = C.steel;
      c.rect(6, 15, 7, b, POLE);
      c.col(6, 15, b, L(POLE));
      c.rect(4, b - 1, 9, b, D(POLE));
      c.rect(1, 1, 12, 14, S);
      c.row(1, 1, 12, L(S));
      c.col(1, 1, 14, L(S));
      c.rect(3, 3, 10, 13, DARK);
      c.rect(5, 4, 10, 12, hex('#2a3246'));
      for (const x of [6, 7, 8]) for (const y of [7, 8, 9]) if ((x + y) % 2 === 0 || true) c.set(x, y, (x + y) % 2 ? C.bone : C.ash);
      c.rect(6, 5, 9, 5, u ? hex('#7fae7a') : hex('#2c4a30'));
      c.set(9, 11, S);
      if (u) {
        c.col(4, 11, 20, C.ironDark);
        c.rect(3, 20, 4, 25, hex('#17151c'));
        c.set(5, 20, hex('#17151c'));
        c.set(5, 25, hex('#17151c'));
        c.set(4, 6, S);
      } else {
        c.rect(3, 4, 4, 10, hex('#0e0c12'));
        c.set(4, 4, C.iron);
        c.set(4, 10, C.iron);
        c.set(4, 12, C.ironDark);
      }
    },
    sw: 11,
    s(c, u) {
      const b = c.h - 2,
        S = C.steel;
      c.rect(4, 15, 5, b, POLE);
      c.col(4, 15, b, L(POLE));
      c.rect(2, b - 1, 7, b, D(POLE));
      sideBox(c, 2, 1, 8, 14, S);
      c.rect(7, 3, 8, 13, DARK);
      if (u) {
        c.col(8, 12, 19, C.ironDark);
        c.rect(8, 19, 9, 24, hex('#17151c'));
        c.set(8, 5, hex('#7fae7a'));
      } else c.rect(7, 4, 7, 10, hex('#3a3842'));
    },
  });
  {
    const DOOR = hex('#4a3a3a');
    T('alley-door-steel-slot', 'steel back door alley peephole slot speakeasy club eyes watching', {
      w: 22, h: 40, solid: true, sum: [0, 0, 2],
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 1, 20, b, C.ironDark);
        c.rect(2, 2, 19, b, DOOR);
        c.col(2, 2, b, L(DOOR));
        c.row(2, 2, 19, L(DOOR));
        for (const y of [4, 20, b - 8]) for (const x of [4, 17]) c.set(x, y, D(DOOR));
        c.rect(3, b - 6, 18, b - 1, mix(C.steel, 0.7));
        c.row(b - 6, 3, 18, C.steel);
        c.rect(16, 21, 17, 23, C.steel);
        c.set(17, 25, DARK);
        scribble(c, 5, 26, 12, 28, C.plum, 6);
        c.rect(5, 15, 8, 18, C.paper);
        c.set(8, 18, DOOR);
        if (u) {
          c.rect(6, 8, 15, 11, DARK);
          c.row(8, 6, 15, WARM);
          eyes(c, 8, 10, 4);
          c.set(9, 10, DARK);
          c.set(13, 10, DARK);
          c.set(8, 10, C.white);
          c.set(12, 10, C.white);
          c.rect(6, 12, 15, 12, C.steel);
        } else {
          c.rect(6, 8, 15, 11, mix(C.steel, 0.75));
          c.row(8, 6, 15, C.steel);
          c.set(15, 10, DARK);
        }
        c.speckle(2, 3, 19, b - 7, C.rust, 70, 2);
      },
      sw: 6,
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 1, 4, b, C.ironDark);
        c.col(4, 2, b, DOOR);
        c.set(5, 22, C.steel);
        if (u) {
          c.rect(5, 12, 6, 12, C.steel);
          c.col(4, 8, 11, WARM);
        }
      },
    });
  }
  {
    const CR = [hex('#8f3b30'), hex('#3d5a8e'), hex('#4f6b50')];
    const crate = (c, x, y, col, bot) => {
      c.rect(x, y, x + 11, y + 5, col);
      c.row(y, x, x + 11, L(col));
      c.col(x + 11, y, y + 5, D(col));
      for (let i = x + 2; i < x + 11; i += 3) c.rect(i, y + 2, i + 1, y + 4, mix(col, 0.45));
      if (bot) for (let i = x + 1; i < x + 11; i += 3) {
        c.col(i, y - 3, y - 1, C.glassLight);
        c.set(i, y - 3, C.steel);
      }
    };
    T('milk-crates-stack', 'milk crates plastic stack empty bottles back door knocked over broken glass', {
      w: 16, h: 24, solid: true, um: [0, 0, 14], same: true,
      f(c, u) {
        const b = c.h - 2;
        crate(c, 2, b - 5, CR[0]);
        crate(c, 1, b - 11, CR[1]);
        if (u) {
          crate(c, 15, b - 5, CR[2]);
          dots(c, C.glassLight, [14, b, 20, b - 6, 24, b - 6, 28, b, 27, b - 6]);
          c.row(b, 16, 26, C.white);
          dots(c, C.glassLight, [18, b, 23, b]);
        } else crate(c, 2, b - 17, CR[2], true);
      },
    });
  }
  T('pavement-cellar-flaps', 'pavement cellar flaps iron doors bulkhead hatch beer cellar open ladder', {
    w: 30, h: 12, solid: true, um: [0, 11, 0], sum: [0, 11, 0],
    f(c, u) {
      const b = c.h - 2,
        P = hex('#3a3c44');
      c.rect(1, 5, 28, b, CONC);
      c.row(5, 1, 28, L(CONC));
      c.row(b, 1, 28, CONCD);
      if (u) {
        c.rect(3, 6, 26, b - 1, hex('#0e0c12'));
        for (const x of [2, 24]) {
          c.rect(x, -8, x + 3, 6, P);
          c.col(x, -8, 6, C.iron);
          c.col(x + 3, -8, 6, I);
          dots(c, C.steel, [x + 1, -5, x + 2, -1, x + 1, 3]);
        }
        c.col(11, 3, b - 1, C.rust);
        c.col(17, 3, b - 1, C.rust);
        c.row(6, 11, 17, C.rust);
        dots(c, WARM, [8, b - 1, 20, b - 1, 14, b - 2, 9, b - 2, 21, b - 2]);
      } else {
        for (const x of [3, 15]) {
          c.rect(x, 4, x + 11, b - 1, P);
          c.row(4, x, x + 11, C.iron);
          c.col(x, 4, b - 1, C.iron);
          for (let y = 5; y < b; y += 2) for (let i = x + 1 + (y % 4 ? 1 : 0); i < x + 11; i += 2) c.set(i, y, I);
        }
        c.set(13, 7, C.steel);
        c.set(16, 7, C.steel);
        c.rect(14, 8, 15, 9, C.brass);
      }
    },
    sw: 20,
    s(c, u) {
      const b = c.h - 2,
        P = hex('#3a3c44');
      c.poly([[1, 3], [17, 7], [17, b], [1, b]], mix(CONC, 0.88));
      c.row(b, 1, 17, CONCD);
      c.col(1, 3, b, CONC);
      if (u) {
        c.line(1, 2, 4, -8, P);
        c.line(2, 2, 5, -8, C.iron);
        c.line(2, 3, 17, 7, hex('#0e0c12'));
        c.col(9, 0, 5, C.rust);
      } else {
        c.line(1, 2, 17, 6, P);
        c.line(1, 1, 17, 5, C.iron);
      }
    },
  });

  /* ---------- bars and arcades ---------- */
  {
    const BAIZE = hex('#3f6a4a');
    const tbl = (c, u, x1) => {
      const b = c.h - 2,
        W = C.woodDark;
      c.rect(2, 7, x1, 12, W);
      c.row(7, 2, x1, C.wood);
      c.col(2, 7, 12, C.wood);
      c.rect(3, 4, x1 - 1, 6, BAIZE);
      c.row(4, 3, x1 - 1, L(BAIZE));
      c.rect(1, 5, 2, 7, W);
      c.rect(x1, 5, x1 + 1, 7, W);
      c.row(3, 2, x1, C.wood);
      for (const x of [2, (2 + x1) >> 1, x1 - 1]) c.rect(x, 4, x + 1, 5, DARK);
      for (const x of [4, x1 - 6]) {
        c.rect(x, 13, x + 4, b, W);
        c.col(x, 13, b, C.wood);
        c.row(b - 2, x, x + 4, C.wood);
      }
      c.row(12, 2, x1, hex('#2a1c16'));
      return b;
    };
    T('pool-table-hall', 'pool table billiards green baize balls cue snooker hall blood', {
      w: 26, h: 20, solid: true, base: 'side',
      sw: 46,
      s(c, u) {
        const b = tbl(c, u, 43);
        c.rect(20, 9, 25, 10, C.brass);
        c.set(22, 9, DARK);
        if (u) {
          c.rect(24, 4, 31, 5, C.blood);
          c.row(6, 26, 29, C.blood);
          c.col(28, 7, 10, C.blood);
          dots(c, C.white, [10, 4]);
          dots(c, DARK, [16, 5]);
          c.line(30, b, 38, b - 1, C.woodPale);
          c.row(b, 22, 27, C.woodPale);
          c.set(28, b, C.blood);
        } else {
          dots(c, C.white, [10, 4]);
          dots(c, hex('#a83a30'), [28, 4, 30, 5, 33, 4]);
          dots(c, hex('#b0a050'), [31, 4, 36, 5]);
          dots(c, DARK, [34, 5]);
          c.line(12, 3, 26, 2, C.woodPale);
        }
      },
      f(c, u) {
        const b = tbl(c, u, 23);
        c.rect(9, 9, 16, 10, hex('#17151c'));
        if (u) {
          c.rect(8, 4, 14, 5, C.blood);
          c.row(6, 10, 13, C.blood);
          c.col(12, 7, 9, C.blood);
          c.set(18, 4, C.white);
        } else {
          dots(c, hex('#a83a30'), [8, 4, 12, 5, 16, 4]);
          dots(c, C.white, [19, 5]);
          dots(c, hex('#b0a050'), [14, 4]);
        }
      },
    });
  }
  {
    const BARW = hex('#4a2f22');
    const stool = (c, x, b) => {
      c.rect(x, b - 12, x + 5, b - 11, hex('#7a2b26'));
      c.row(b - 12, x, x + 5, hex('#96403a'));
      c.rect(x + 2, b - 10, x + 3, b - 1, C.steel);
      c.row(b - 4, x + 1, x + 4, C.steel);
      c.row(b, x, x + 5, C.iron);
    };
    T('bar-counter-taps', 'bar counter beer taps pub stools brass rail pint spilled', {
      w: 42, h: 28, solid: true,
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 11, 40, b, BARW);
        c.col(1, 11, b, C.wood);
        for (let x = 3; x < 38; x += 9) panel(c, x, 13, x + 7, b - 5, BARW);
        c.rect(1, 9, 40, 10, C.woodLight);
        c.row(10, 1, 40, C.wood);
        c.row(b - 3, 1, 40, C.brass);
        for (const x of [4, 20, 36]) c.col(x, b - 2, b, C.brass);
        c.rect(18, 4, 26, 8, C.brass);
        c.row(4, 18, 26, L(C.brass));
        for (const [x, col] of [[19, DARK], [22, C.bone], [25, hex('#7a2b26')]]) c.rect(x, 1, x, 3, col);
        c.rect(5, 6, 6, 8, mix(C.glassLight, 0.9));
        c.rect(9, 6, 10, 8, mix(C.glassLight, 0.9));
        c.rect(33, 8, 37, 8, C.white);
        if (u) {
          c.rect(21, 5, 23, 8, hex('#b0803a'));
          c.row(5, 21, 23, C.white);
          c.row(9, 27, 33, hex('#b0803a'));
          c.col(30, 10, 16, hex('#b0803a'));
          c.col(32, 10, 13, hex('#b0803a'));
          stool(c, 5, b);
          c.rect(27, b - 5, 28, b, hex('#7a2b26'));
          c.rect(29, b - 3, 37, b - 2, C.steel);
          c.col(38, b - 5, b, C.iron);
        } else {
          stool(c, 5, b);
          stool(c, 29, b);
        }
      },
      sw: 16,
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 2, 11, 9, b, BARW);
        c.rect(1, 9, 11, 10, C.woodLight);
        c.row(10, 1, 11, C.wood);
        c.rect(10, b - 3, 10, b - 3, C.brass);
        c.rect(5, 4, 7, 8, C.brass);
        c.col(6, 1, 3, C.bone);
        if (u) {
          c.rect(8, 5, 9, 8, hex('#b0803a'));
          c.row(5, 8, 9, C.white);
          c.col(10, 10, 15, hex('#b0803a'));
          c.rect(10, b - 2, 14, b, hex('#7a2b26'));
          c.row(b - 3, 11, 14, C.steel);
        } else {
          c.rect(10, b - 12, 14, b - 11, hex('#7a2b26'));
          c.rect(12, b - 10, 13, b - 1, C.steel);
          c.row(b, 10, 14, C.iron);
        }
      },
    });
  }
  {
    const PIN = hex('#4a2f5a'),
      FIELD = hex('#24304a');
    T('pinball-machine-arcade', 'pinball machine arcade table flippers bumpers backbox lights', {
      w: 16, h: 34, solid: true,
      f(c, u) {
        const b = c.h - 2;
        c.rect(2, 1, 13, 12, PIN);
        c.col(2, 1, 12, L(PIN));
        c.rect(3, 2, 12, 9, u ? hex('#8a3a4a') : hex('#2a2230'));
        pat(c, 5, 3, ['.www.', 'wkwkw', 'wwwww', '.wkw.', '.www.'], { w: u ? C.bone : hex('#4a4450'), k: u ? DARK : hex('#2a2230') });
        c.rect(4, 10, 11, 11, DARK);
        if (u) dots(c, AMBER, [5, 10, 7, 10, 9, 10, 5, 11, 7, 11, 9, 11, 10, 10]);
        c.poly([[3, 14], [12, 14], [14, 23], [1, 23]], FIELD);
        c.line(3, 14, 1, 23, C.steel);
        c.line(12, 14, 14, 23, C.steel);
        for (const [x, y, col] of [[6, 16, REDL], [9, 16, LAMP], [7, 19, GREENL]]) c.set(x, y, u ? col : mix(col, 0.4));
        c.line(4, 21, 6, 22, C.bone);
        c.line(11, 21, 9, 22, C.bone);
        if (u) c.set(10, 18, C.white);
        c.rect(1, 24, 14, 28, PIN);
        c.row(24, 1, 14, L(PIN));
        c.rect(6, 25, 9, 27, C.ironDark);
        c.set(13, 25, C.steel);
        c.set(3, 26, u ? REDL : hex('#5a2622'));
        legs(c, [2, 12], 29, b, C.steel, 2);
      },
      sw: 32,
      s(c, u) {
        const b = c.h - 2;
        c.poly([[5, 15], [28, 20], [28, 25], [5, 25]], PIN);
        c.line(5, 15, 28, 20, C.steel);
        c.line(5, 14, 28, 19, u ? mix(LAMP, 0.7) : C.glassLight);
        c.line(8, 19, 25, 22, hex('#8a3a4a'));
        c.rect(2, 1, 8, 15, PIN);
        c.col(2, 1, 15, L(PIN));
        c.col(9, 2, 12, u ? hex('#8a3a4a') : hex('#2a2230'));
        if (u) dots(c, LAMP, [10, 4, 10, 8, 11, 6]);
        c.rect(29, 21, 30, 22, C.steel);
        legs(c, [6, 25], 26, b, C.steel, 2);
        c.rect(3, 16, 5, 25, D(PIN));
      },
    });
    const CAB = hex('#2a2a36');
    T('arcade-cabinet-dead', 'arcade cabinet video game machine screen joystick coin face on the screen', {
      w: 16, h: 38, solid: true,
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 1, 14, b, CAB);
        c.col(1, 1, b, C.slate);
        c.rect(2, 2, 13, 7, u ? hex('#8a3a4a') : hex('#3a2a30'));
        txt(c, 3, 2, 'ZAP', u ? LAMP : hex('#6a5a50'));
        c.rect(3, 9, 12, 18, DARK);
        if (u) {
          c.rect(4, 10, 11, 17, hex('#2c4a30'));
          pat(c, 5, 10, ['.gggg.', 'gggggg', 'gkggkg', 'gggggg', '.gkkg.', '.gggg.', '..gg..'], { g: hex('#9fd09a'), k: hex('#16301c') });
        } else {
          c.rect(4, 10, 11, 17, hex('#1c2420'));
          c.line(5, 14, 8, 11, hex('#2e3a34'));
        }
        c.rect(1, 20, 14, 22, C.slate);
        c.row(20, 1, 14, L(C.slate));
        c.col(5, 18, 20, C.steel);
        c.rect(4, 17, 6, 18, C.red);
        dots(c, u ? LAMP : C.mustard, [9, 21, 11, 21]);
        c.rect(5, 26, 10, 31, C.ironDark);
        c.set(6, 28, u ? REDL : hex('#5a2622'));
        c.set(9, 28, u ? REDL : hex('#5a2622'));
        c.row(b, 1, 14, DARK);
        for (const y of [24, 33]) c.row(y, 2, 13, hex('#8a3a4a'));
      },
      sw: 18,
      s(c, u) {
        const b = c.h - 2;
        c.poly([[2, 1], [12, 1], [12, 7], [10, 9], [10, 18], [15, 20], [15, 23], [12, 24], [12, b], [2, b]], mix(CAB, 0.9));
        c.col(2, 1, b, C.slate);
        c.line(4, 5, 9, 30, hex('#8a3a4a'));
        c.line(5, 5, 10, 30, hex('#8a3a4a'));
        c.col(12, 2, 6, u ? hex('#8a3a4a') : hex('#3a2a30'));
        if (u) {
          c.col(11, 10, 17, hex('#9fd09a'));
          dots(c, hex('#5a8a5a'), [12, 11, 12, 15, 13, 13]);
        }
        c.rect(13, 18, 13, 19, C.steel);
        c.set(13, 17, C.red);
      },
    });
  }
  {
    const CM = hex('#5a3a2e');
    T('cigarette-machine-pub', 'cigarette machine vending pub wall packets pull knobs', {
      w: 14, h: 30, solid: true, sum: [0, 0, 1],
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 1, 12, b - 4, CM);
        c.col(1, 1, b - 4, L(CM));
        c.row(1, 1, 12, C.steel);
        c.rect(2, 3, 11, 9, u ? hex('#b9a860') : hex('#3a3026'));
        for (let i = 0; i < 3; i++) {
          const col = [C.white, hex('#8f3b30'), hex('#3d5a6e')][i];
          c.rect(3 + i * 3, 4, 4 + i * 3, 8, u ? col : mix(col, 0.6));
          c.row(4, 3 + i * 3, 4 + i * 3, u ? C.red : hex('#6a2622'));
        }
        for (let i = 0; i < 3; i++) c.rect(3 + i * 3, 12, 4 + i * 3, 12, C.steel);
        if (u) c.rect(6, 12, 7, 14, C.steel);
        c.set(11, 12, DARK);
        scribble(c, 3, 15, 10, 17, D(CM), 2);
        c.rect(3, b - 9, 10, b - 7, DARK);
        if (u) c.rect(5, b - 8, 7, b - 7, C.white);
        if (u) c.row(b - 8, 5, 7, C.red);
        c.row(b - 6, 2, 11, C.steel);
        legs(c, [2, 10], b - 3, b, C.iron, 2);
      },
      sw: 9,
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 1, 6, b - 4, CM);
        c.row(1, 1, 6, C.steel);
        c.set(7, 12, C.steel);
        if (u) c.rect(7, 13, 8, 13, C.steel);
        if (u) c.col(6, 3, 9, hex('#b9a860'));
        if (u) c.set(7, b - 8, C.white);
        legs(c, [1, 5], b - 3, b, C.iron, 2);
      },
    });
  }
  {
    const PBOX = hex('#4a4a5e'),
      CURT = hex('#8a4a34');
    T('photo-booth-arcade-flash', 'photo booth passport photos curtain flash legs strip of pictures', {
      w: 24, h: 42, solid: true,
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 1, 22, b, PBOX);
        c.col(1, 1, b, L(PBOX));
        c.rect(2, 2, 21, 7, u ? hex('#c9b870') : hex('#6a644e'));
        txt(c, 5, 2, 'FOTO', u ? hex('#7a2a2c') : hex('#3a2a26'));
        c.rect(2, 9, 14, b - 1, hex('#121016'));
        c.row(9, 2, 14, C.steel);
        const end = u ? b - 8 : b - 12;
        for (let x = 2; x <= (u ? 14 : 10); x++) c.col(x, 10, end - (x % 3 === 0 ? 1 : 0), x % 3 === 1 ? D(CURT) : CURT);
        if (u) {
          for (const x of [2, 14]) c.col(x, 10, end, hex('#e9d9a0'));
          c.row(end + 1, 3, 13, hex('#e9d9a0'));
          c.rect(5, b - 6, 6, b - 2, hex('#3a3a4e'));
          c.rect(9, b - 6, 10, b - 2, hex('#3a3a4e'));
          c.rect(4, b - 1, 6, b, hex('#3a2c22'));
          c.rect(9, b - 1, 11, b, hex('#3a2c22'));
        } else {
          c.rect(11, 22, 14, 23, C.steel);
          c.col(12, 24, b - 1, C.iron);
        }
        c.rect(17, 11, 20, 26, C.white);
        for (let y = 12; y < 26; y += 4) {
          c.rect(18, y, 19, y + 2, C.flesh);
          c.row(y, 18, 19, C.woodDark);
        }
        c.rect(17, 30, 20, 32, DARK);
        if (u) c.rect(18, 31, 19, 35, C.white);
        if (u) c.set(18, 33, C.flesh);
        c.set(19, 28, C.brass);
      },
      sw: 20,
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 1, 16, b, PBOX);
        c.rect(3, 9, 12, 24, C.white);
        c.rect(5, 12, 10, 19, C.flesh);
        c.rect(5, 11, 10, 13, C.woodDark);
        dots(c, DARK, [6, 15, 9, 15]);
        c.row(17, 7, 8, hex('#8f3b30'));
        c.row(22, 5, 10, C.slate);
        c.col(17, 10, u ? b - 8 : b - 12, CURT);
        if (u) {
          c.col(18, 10, b - 9, hex('#e9d9a0'));
          c.rect(17, b - 1, 18, b, hex('#3a2c22'));
        }
      },
    });
  }
  {
    const coat = (c, x, w, len, col) => {
      c.rect(x, 6, x + w - 1, 6 + len, col);
      c.col(x, 6, 6 + len, L(col));
      c.col(x + w - 1, 7, 6 + len, D(col));
      c.set(x + (w >> 1), 5, C.steel);
      c.set(x + (w >> 1), 4, C.steel);
    };
    const COATS = [[4, 4, 20, 5], [8, 3, 14, 0], [11, 4, 23, 1], [15, 3, 12, 4], [18, 4, 18, 6], [22, 3, 22, 3], [25, 3, 15, 2]];
    T('clothes-rail-secondhand', 'clothes rail second hand coats dresses hangers charity shop rack', {
      w: 32, h: 36, solid: true,
      f(c, u) {
        const b = c.h - 2;
        for (const x of [2, 29]) {
          c.col(x, 3, b - 1, C.steel);
          c.rect(x - 1, b, x + 1, b, C.iron);
        }
        c.row(3, 2, 29, L(C.steel));
        c.row(b - 3, 3, 28, mix(C.steel, 0.7));
        COATS.forEach(([x, w, len, ci], i) => {
          if (u && (i === 2 || i === 4)) {
            pat(c, x, 4, ['.s..', 's.s.', 'ssss'], { s: C.steel });
          } else coat(c, x, w, len, CLOTH[ci]);
        });
        dots(c, C.paper, [5, 12, 23, 14]);
        if (u) {
          c.poly([[10, b], [12, b - 3], [18, b - 4], [22, b]], CLOTH[1]);
          c.line(12, b - 3, 18, b - 4, L(CLOTH[1]));
          c.set(15, b - 2, D(CLOTH[1]));
        }
      },
      sw: 10,
      s(c, u) {
        const b = c.h - 2;
        c.col(4, 3, b - 1, C.steel);
        c.row(b, 1, 8, C.iron);
        c.rect(2, 6, 7, u ? 22 : 28, CLOTH[5]);
        c.col(2, 6, u ? 22 : 28, L(CLOTH[5]));
        c.row(6, 3, 6, CLOTH[5]);
        c.set(4, 4, C.steel);
        if (u) c.rect(5, b - 2, 9, b, CLOTH[1]);
      },
    });
  }
  T('parking-barrier-arm', 'car park barrier boom gate arm red white striped raised', {
    w: 44, h: 22, solid: true, um: [0, 28, 0], sum: [0, 28, 0],
    f(c, u) {
      const b = c.h - 2,
        CABC = hex('#9a6a30');
      c.rect(39, 11, 40, b, C.iron);
      c.rect(38, 9, 41, 10, C.iron);
      if (u) {
        for (let i = 0; i <= 34; i++) {
          const x = 7 + Math.round(i * 0.35),
            y = 8 - i,
            col = Math.floor(i / 4) % 2 ? C.bone : hex('#a83a30');
          c.rect(x, y, x + 2, y, col);
        }
      } else hazard(c, 8, 7, 41, 9, hex('#a83a30'), C.bone, 4);
      c.rect(1, 5, 8, b, CABC);
      c.col(1, 5, b, L(CABC));
      c.row(5, 1, 8, L(CABC));
      c.rect(2, 4, 7, 4, D(CABC));
      c.rect(1, b - 1, 8, b, CONCD);
      c.rect(5, 6, 7, 9, C.ironDark);
      c.rect(4, 2, 5, 3, u ? LAMP : hex('#8a5a22'));
      if (u) dots(c, AMBER, [3, 1, 6, 1, 2, 3, 7, 3]);
      scribble(c, 3, 12, 6, 14, D(CABC), 2);
    },
    sw: 9,
    s(c, u) {
      const b = c.h - 2,
        CABC = hex('#9a6a30');
      sideBox(c, 1, 5, 7, b, CABC);
      c.rect(1, b - 1, 7, b, CONCD);
      c.rect(3, 2, 4, 3, u ? LAMP : hex('#8a5a22'));
      if (u) {
        for (let y = -26; y <= 8; y++) c.rect(3, y, 5, y, Math.floor((8 - y) / 4) % 2 ? C.bone : hex('#a83a30'));
      } else {
        c.rect(3, 7, 5, 9, hex('#a83a30'));
        c.row(7, 3, 5, C.bone);
      }
    },
  });
  {
    const CYL = [hex('#9a4a30'), hex('#3d5a6e'), hex('#9a4a30'), hex('#6a6e58')];
    const cyl = (c, x, b, col) => {
      c.rect(x, 9, x + 3, b - 2, col);
      c.col(x, 9, b - 2, L(col));
      c.col(x + 3, 9, b - 2, D(col));
      c.row(8, x + 1, x + 2, col);
      c.rect(x + 1, 6, x + 2, 7, C.brass);
      c.row(14, x, x + 3, D(col));
    };
    const mesh = (c, x0, y0, x1, y1) => {
      for (let y = y0; y <= y1; y += 2) for (let x = x0 + (y % 4 ? 1 : 0); x <= x1; x += 2) if ((x * 3 + y) % 5 < 2) c.set(x, y, C.steel);
    };
    T('gas-bottles-cage', 'gas bottles cylinders cage propane yard padlock hissing leak', {
      w: 26, h: 32, solid: true, um: [0, 0, 6], sum: [0, 0, 8],
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, b - 1, 24, b, C.ironDark);
        CYL.forEach((col, i) => {
          if (!(u && i === 2)) cyl(c, 3 + i * 5, b, col);
        });
        mesh(c, 2, 4, u ? 12 : 23, b - 2);
        c.frame(1, 2, 24, b, C.iron);
        c.col(1, 2, b, L(C.iron));
        c.col(13, 3, b - 1, C.iron);
        if (u) {
          c.rect(25, 2, 29, b, I);
          c.col(25, 2, b, C.iron);
          c.col(29, 2, b, C.ironDark);
          mesh(c, 26, 4, 28, b - 2);
          dots(c, C.white, [19, 5, 20, 4, 21, 2, 22, 3, 20, 1, 23, 1]);
          dots(c, C.ash, [21, 4, 22, 1]);
        } else {
          pat(c, 5, 16, ['..y..', '.yky.', 'yykyy', '.yyy.', '..y..'], { y: C.mustard, k: DARK });
          c.rect(12, 14, 14, 16, C.brass);
          c.set(13, 13, C.steel);
        }
      },
      sw: 12,
      s(c, u) {
        const b = c.h - 2;
        c.rect(1, b - 1, 10, b, C.ironDark);
        cyl(c, 4, b, CYL[3]);
        mesh(c, 2, 4, 9, b - 2);
        c.frame(1, 2, 10, b, C.iron);
        c.col(1, 2, b, L(C.iron));
        if (u) {
          c.frame(11, 2, 18, b, C.iron);
          mesh(c, 12, 4, 17, b - 2);
          dots(c, C.white, [8, 5, 9, 3, 11, 1]);
        }
      },
    });
  }
  {
    const MX = hex('#9a5a30'),
      CEM = hex('#8a8880');
    T('cement-mixer-yard', 'cement mixer concrete builders yard drum orange tipped wet cement', {
      w: 20, h: 26, solid: true, base: 'side', sum: [0, 0, 7],
      sw: 26,
      s(c, u) {
        const b = c.h - 2;
        c.line(11, 13, 5, b, C.iron);
        c.line(12, 13, 19, b, C.iron);
        c.row(b - 4, 7, 18, C.ironDark);
        wheel(c, 5, b - 3, 3, C.iron);
        c.rect(14, 15, 20, 20, hex('#3d4654'));
        c.row(15, 14, 20, C.slate);
        ring(c, 22, 17, 2, C.iron);
        if (u) {
          c.poly([[6, 6], [12, 3], [20, 9], [21, 14], [14, 15], [8, 12]], MX);
          c.line(6, 6, 12, 3, L(MX));
          c.oval(17, 9, 22, 15, hex('#1e1a1c'));
          c.line(10, 5, 16, 12, D(MX));
          c.poly([[20, 14], [23, 14], [27, b], [21, b]], CEM);
          c.col(21, 14, b, L(CEM));
          c.oval(18, b - 2, 30, b + 1, CEM);
          c.row(b - 2, 21, 27, L(CEM));
        } else {
          c.poly([[6, 9], [9, 3], [17, 2], [20, 8], [17, 14], [9, 15]], MX);
          c.line(6, 9, 9, 3, L(MX));
          c.oval(14, 1, 20, 7, hex('#1e1a1c'));
          c.line(9, 5, 14, 13, D(MX));
        }
        c.speckle(6, 2, 21, 15, CEM, 9, 3);
      },
      f(c, u) {
        const b = c.h - 2;
        c.col(3, 12, b, C.iron);
        c.col(16, 12, b, C.iron);
        c.row(b - 4, 3, 16, C.ironDark);
        c.rect(1, b - 5, 2, b, TYRE);
        c.rect(17, b - 5, 18, b, TYRE);
        c.oval(3, 2, 16, 15, MX);
        c.oval(4, 3, 15, 14, L(MX));
        c.oval(5, 4, 15, 14, MX);
        c.oval(6, u ? 6 : 4, 13, u ? 13 : 11, hex('#1e1a1c'));
        if (u) {
          c.rect(8, 12, 11, b, CEM);
          c.col(8, 12, b, L(CEM));
          c.oval(4, b - 2, 15, b + 1, CEM);
          c.row(b - 2, 7, 12, L(CEM));
        } else c.rect(7, 9, 12, 10, CEM);
        c.speckle(3, 2, 16, 15, CEM, 9, 3);
      },
    });
  }
};
