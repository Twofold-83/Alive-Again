/* env-street: things on a street at night. Part of tools/big/env-city.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, txt, scribble, wheel, ring } = X;
  const { bricks, planks, hazard, tins, litter, flame, smoke, pool, carSide, carFront } = X;
  const { TYRE, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, BLUEL, CARD, CARDD, BAG, DIRTW, WATER, WATERL, SMOKE } = X;
  setCat('env-street', 'Street');

  const POLE = C.iron,
    HOUSING = hex('#22212a'),
    DARK = hex('#17151c'),
    PBRED = hex('#8f2a24'),
    BENCHG = hex('#35503e'),
    HYD = hex('#a08a3a'),
    FADEDRED = hex('#7a3a34'),
    BLUEB = hex('#3a4a66'),
    TEALB = hex('#2f4f52');
  const LAMPS = { r: [hex('#5a2622'), REDL], a: [hex('#5e4a22'), AMBER], g: [hex('#24452e'), GREENL] };
  const MAN = { stand: ['.x.', 'xxx', '.x.', '.x.', '.x.'], walk: ['.x.', 'xx.', '.xx', '.x.', 'x.x'] };
  /** A sheet of newspaper: paper with dark lines. */
  const paperSheet = (c, x0, y0, x1, y1, seed = 1) => {
    c.rect(x0, y0, x1, y1, C.paper);
    c.row(y0, x0, x1, C.black);
    if (y1 - y0 > 1) scribble(c, x0 + 1, y0 + 2, x1 - 1, y1, C.slate, seed);
  };
  /** A small poster of someone missing. */
  const missing = (c, x, y) => {
    c.rect(x, y, x + 4, y + 6, C.white);
    c.row(y, x, x + 4, C.blood);
    c.rect(x + 1, y + 2, x + 3, y + 4, C.flesh);
    c.row(y + 2, x + 1, x + 3, C.woodDark);
    c.row(y + 6, x + 1, x + 3, C.slate);
  };

  /* ---------- signals ---------- */
  T('traffic-light-pole', 'traffic light on a pole red amber green signal crossing junction', {
    w: 10, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, 16, 5, b, POLE);
      c.col(4, 16, b, L(POLE));
      c.rect(3, b - 1, 6, b, D(POLE));
      c.rect(2, 1, 7, 15, HOUSING);
      c.col(2, 1, 15, C.iron);
      for (const [k, y, on] of [['r', 2, !u], ['a', 6, false], ['g', 10, u]]) {
        c.row(y, 3, 7, C.iron);
        c.rect(3, y + 1, 6, y + 3, LAMPS[k][on ? 1 : 0]);
        if (on) c.rect(4, y + 1, 5, y + 2, L(LAMPS[k][1]));
      }
      c.rect(3, 27, 6, 31, C.mustard);
      c.set(4, 28, u ? GREENL : REDL);
      c.set(5, 30, C.black);
    },
    sw: 10,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 16, 3, b, POLE);
      c.col(2, 16, b, L(POLE));
      c.rect(1, b - 1, 4, b, D(POLE));
      c.rect(1, 1, 4, 15, HOUSING);
      c.col(1, 1, 15, C.iron);
      for (const [k, y, on] of [['r', 2, !u], ['a', 6, false], ['g', 10, u]]) {
        c.row(y, 5, 8, C.iron);
        c.col(5, y + 1, y + 3, LAMPS[k][on ? 1 : 0]);
        if (on) dots(c, L(LAMPS[k][1]), [6, y + 2, 7, y + 2, 6, y + 1]);
      }
      c.rect(4, 27, 5, 31, C.mustard);
      c.set(6, 29, u ? GREENL : REDL);
    },
  });
  T('crossing-signal-man', 'pedestrian crossing light red man green man walk wait button', {
    w: 10, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, 15, 5, b, POLE);
      c.col(4, 15, b, L(POLE));
      c.rect(3, b - 1, 6, b, D(POLE));
      c.rect(1, 1, 8, 14, HOUSING);
      c.col(1, 1, 14, C.iron);
      c.row(1, 1, 8, C.iron);
      c.row(7, 2, 7, C.ironDark);
      pat(c, 3, 2, MAN.stand, u ? LAMPS.r[0] : REDL);
      pat(c, 3, 8, MAN.walk, u ? GREENL : LAMPS.g[0]);
      c.rect(2, 23, 7, 28, C.mustard);
      c.row(23, 2, 7, L(C.mustard));
      c.rect(4, 25, 5, 26, C.black);
      c.set(6, 24, u ? LAMP : C.iron);
    },
    sw: 9,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 15, 3, b, POLE);
      c.col(2, 15, b, L(POLE));
      c.rect(1, b - 1, 4, b, D(POLE));
      c.rect(1, 1, 4, 14, HOUSING);
      c.col(1, 1, 14, C.iron);
      c.row(1, 1, 7, C.iron);
      c.row(7, 5, 7, C.iron);
      c.col(5, 2, 6, u ? LAMPS.r[0] : REDL);
      c.col(5, 8, 12, u ? GREENL : LAMPS.g[0]);
      if (u) c.set(6, 10, L(GREENL));
      else c.set(6, 4, L(REDL));
      c.rect(4, 23, 5, 28, C.mustard);
      c.set(6, 25, C.black);
      c.set(6, 24, u ? LAMP : C.iron);
    },
  });

  /* ---------- waiting ---------- */
  T('bus-shelter-glass', 'bus stop shelter glass panes bench timetable waiting night', {
    w: 46, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2,
        G = mix(C.glass, 0.6);
      c.rect(4, 6, 41, b - 3, G);
      for (const x of [10, 18, 34]) c.line(x, 7, x - 5, 15, mix(C.glass, 0.82));
      c.rect(4, b - 10, 41, b - 3, mix(C.steel, 0.62));
      c.row(b - 10, 4, 41, C.steel);
      c.rect(1, 1, 44, 3, C.ironDark);
      c.row(1, 1, 44, C.iron);
      c.row(4, 2, 43, DARK);
      for (const x of [2, 22, 42]) {
        c.rect(x, 5, x + 1, b, POLE);
        c.col(x, 5, b, L(POLE));
      }
      c.rect(27, 8, 38, 22, C.ironDark);
      c.rect(28, 9, 37, 21, C.paper);
      c.rect(28, 9, 37, 10, C.wine);
      scribble(c, 29, 12, 36, 20, C.slate, 3);
      c.rect(6, b - 8, 19, b - 7, FADEDRED);
      c.row(b - 8, 6, 19, L(FADEDRED));
      legs(c, [7, 18], b - 6, b, POLE, 1);
      litter(c, 9, 16, b, 5);
      if (u) {
        c.poly([[8, 11], [13, 9], [17, 12], [16, 17], [11, 19], [7, 15]], DARK);
        for (const [x, y] of [[4, 7], [20, 8], [5, 20], [19, 21], [12, 6]]) c.line(12, 14, x, y, C.glassLight);
        c.poly([[9, 12], [13, 11], [15, 13], [14, 16], [11, 17], [9, 15]], DARK);
        dots(c, C.glassLight, [6, b, 9, b - 1, 12, b, 15, b, 17, b - 1, 20, b, 10, b - 6, 14, b - 7]);
      }
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2,
        G = mix(C.glass, 0.6);
      c.rect(4, 6, 10, b - 3, G);
      c.line(8, 7, 5, 13, mix(C.glass, 0.82));
      c.rect(4, b - 10, 10, b - 3, mix(C.steel, 0.62));
      c.row(b - 10, 4, 10, C.steel);
      c.col(10, 6, b - 3, C.iron);
      c.rect(1, 1, 14, 3, C.ironDark);
      c.row(1, 1, 14, C.iron);
      c.rect(2, 4, 3, b, POLE);
      c.col(2, 4, b, L(POLE));
      c.rect(5, b - 8, 9, b - 7, FADEDRED);
      c.col(8, b - 6, b, POLE);
      if (u) {
        c.line(5, 16, 9, 9, C.glassLight);
        c.line(6, 12, 9, 15, C.glassLight);
        dots(c, C.glassLight, [6, b, 9, b, 11, b - 1, 13, b, 12, b]);
      }
    },
  });
  T('street-bench-newspaper', 'street bench with newspaper slats iron ends park seat', {
    w: 32, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const y of [3, 6, 9]) {
        c.rect(3, y, 28, y + 1, BENCHG);
        c.row(y, 3, 28, L(BENCHG));
      }
      c.rect(2, 12, 29, 13, BENCHG);
      c.row(12, 2, 29, L(BENCHG));
      for (const x of [1, 29]) {
        c.rect(x, 2, x + 1, b, C.ironDark);
        c.row(10, x - (x > 5 ? 0 : 0), x + 1, C.iron);
      }
      c.col(15, 3, 13, D(BENCHG));
      c.col(16, 14, b, C.ironDark);
      if (u) {
        c.poly([[10, 12], [13, 5], [19, 4], [22, 11], [24, 12]], C.paper);
        c.line(13, 5, 16, 12, C.parchment);
        scribble(c, 12, 8, 21, 11, C.slate, 4);
        c.row(6, 14, 18, C.black);
        paperSheet(c, 5, b - 1, 12, b, 2);
      } else {
        paperSheet(c, 17, 9, 24, 11, 2);
        c.row(12, 17, 24, D(BENCHG));
      }
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2;
      c.line(3, 2, 4, 12, C.ironDark);
      c.line(4, 2, 5, 12, BENCHG);
      c.rect(4, 12, 11, 13, BENCHG);
      c.row(12, 4, 11, L(BENCHG));
      c.line(4, 13, 2, b, C.ironDark);
      c.col(10, 14, b, C.ironDark);
      c.row(9, 5, 11, C.iron);
      c.col(11, 9, 12, C.iron);
      if (u) {
        c.poly([[5, 11], [6, 5], [10, 11]], C.paper);
        c.line(6, 5, 7, 11, C.parchment);
        c.row(b, 5, 8, C.paper);
      } else c.rect(6, 10, 10, 11, C.paper);
    },
  });
  T('pillar-box-red', 'red pillar box post box letters mail royal cast iron', {
    w: 12, h: 25, solid: true, um: [0, 0, 5], sum: [0, 0, 4],
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 9, b - 2, PBRED);
      c.col(2, 3, b - 2, L(PBRED));
      c.col(3, 3, b - 2, L(PBRED));
      c.col(8, 3, b - 2, D(PBRED));
      c.rect(1, 2, 10, 4, PBRED);
      c.row(1, 3, 8, PBRED);
      c.row(2, 1, 10, L(PBRED));
      c.row(5, 2, 9, D(PBRED));
      c.rect(2, b - 1, 9, b, C.black);
      c.row(7, 4, 7, DARK);
      c.rect(4, 10, 7, 13, C.paper);
      c.row(11, 5, 6, C.slate);
      c.frame(3, 9, 8, b - 4, D(PBRED));
      c.rect(4, 10, 7, 13, C.paper);
      c.row(12, 5, 6, C.slate);
      c.set(8, 16, C.brass);
      if (u) {
        c.rect(3, 9, 8, b - 4, DARK);
        c.rect(4, b - 7, 7, b - 5, C.paper);
        dots(c, C.white, [4, b - 8, 6, b - 9, 5, b - 7]);
        dots(c, C.slate, [5, b - 6, 7, b - 5]);
        c.rect(10, 9, 13, b - 4, D(PBRED));
        c.col(10, 9, b - 4, PBRED);
        c.col(13, 9, b - 4, mix(PBRED, 0.5));
        c.rect(11, b - 1, 14, b, C.paper);
        c.set(12, b - 1, C.slate);
      }
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 9, b - 2, PBRED);
      c.col(2, 3, b - 2, L(PBRED));
      c.col(3, 3, b - 2, L(PBRED));
      c.col(8, 3, b - 2, D(PBRED));
      c.rect(1, 2, 10, 4, PBRED);
      c.row(1, 3, 8, PBRED);
      c.row(2, 1, 10, L(PBRED));
      c.row(5, 2, 9, D(PBRED));
      c.rect(2, b - 1, 9, b, C.black);
      c.row(7, 8, 9, DARK);
      c.set(10, 6, PBRED);
      if (u) {
        c.rect(10, 9, 12, b - 4, D(PBRED));
        c.col(13, 9, b - 4, mix(PBRED, 0.5));
        c.col(9, 9, b - 4, DARK);
        c.rect(11, b - 1, 13, b, C.paper);
      }
    },
  });
  T('kiosk-newsagent-night', 'street kiosk news stand booth shutter magazines sweets cigarettes', {
    w: 32, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2,
        col = BENCHG;
      c.rect(2, 9, 29, b, col);
      c.col(2, 9, b, L(col));
      c.rect(1, 2, 30, 8, D(col));
      c.row(2, 1, 30, col);
      c.row(8, 1, 30, DARK);
      c.rect(7, 3, 24, 7, C.bone);
      txt(c, 9, 3, 'NEWS', C.wine);
      c.set(8, 5, C.wine);
      c.rect(4, 11, 27, 27, DARK);
      panel(c, 4, 29, 27, b - 2, col);
      c.rect(8, 31, 14, b - 4, C.paper);
      scribble(c, 9, 33, 13, b - 5, C.slate, 2);
      c.row(31, 8, 14, C.blood);
      c.rect(3, 27, 28, 28, C.woodLight);
      c.row(28, 3, 28, C.wood);
      if (u) {
        c.rect(5, 12, 26, 26, hex('#6e5a2e'));
        c.rect(5, 11, 26, 12, C.steel);
        for (const y of [16, 21, 26]) {
          c.row(y, 5, 26, C.woodDark);
          tins(c, 6, 25, y - 1, 4, y, 0.9);
        }
        c.rect(13, 19, 18, 26, hex('#3b2f26'));
        c.rect(14, 16, 17, 19, C.flesh);
        c.row(16, 14, 17, C.woodDark);
        dots(c, C.black, [14, 18, 17, 18]);
        c.set(15, 13, LAMP);
        c.set(16, 13, LAMP);
        c.row(14, 14, 17, mix(LAMP, 0.8));
      } else {
        for (let y = 12; y <= 26; y += 2) c.row(y, 5, 26, C.steel);
        for (let y = 13; y <= 26; y += 2) c.row(y, 5, 26, mix(C.steel, 0.7));
        c.rect(15, 25, 16, 26, C.brass);
        txt(c, 18, 19, 'X', C.blood);
        scribble(c, 7, 15, 14, 17, C.plum, 5);
      }
    },
    sw: 18,
    s(c, u) {
      const b = c.h - 2,
        col = BENCHG;
      sideBox(c, 2, 9, 14, b, col);
      c.rect(1, 2, 16, 8, D(col));
      c.row(2, 1, 16, col);
      c.row(8, 1, 16, DARK);
      panel(c, 4, 13, 10, b - 3, col);
      c.set(9, 25, C.brass);
      c.rect(15, 27, 16, 28, C.woodLight);
      c.col(15, 11, 26, u ? hex('#6e5a2e') : C.steel);
      if (u) {
        c.col(16, 12, 14, LAMP);
        c.row(10, 15, 16, C.steel);
      }
      c.rect(5, 4, 12, 7, C.bone);
      scribble(c, 6, 5, 11, 6, C.wine, 1);
    },
  });
  T('headline-board-papers', 'newspaper stand headline board bundle of papers evening news', {
    w: 20, h: 20,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 10, 14, C.ironDark);
      c.rect(2, 3, 9, 13, C.white);
      c.rect(2, 3, 9, 4, C.blood);
      for (const y of [6, 8, 10]) c.row(y, 3, 8, C.black);
      c.row(12, 3, 6, C.slate);
      legs(c, [1, 10], 15, b, C.ironDark, 1);
      if (u) {
        c.rect(12, b - 2, 18, b, C.paper);
        c.row(b - 1, 12, 18, C.parchment);
        dots(c, C.straw, [13, b - 3, 12, b - 4, 17, b - 3]);
        paperSheet(c, 11, b - 5, 16, b - 4, 3);
        c.set(17, b - 4, C.paper);
      } else {
        c.rect(12, b - 7, 18, b, C.paper);
        for (let y = b - 6; y < b; y += 2) c.row(y, 12, 18, C.parchment);
        c.row(b - 7, 12, 18, C.black);
        c.col(15, b - 7, b, C.straw);
        c.row(b - 4, 12, 18, C.straw);
      }
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2;
      c.line(4, 2, 2, b, C.ironDark);
      c.line(5, 2, 7, b, C.ironDark);
      c.line(5, 3, 6, 13, C.white);
      c.row(11, 4, 5, C.iron);
      if (u) {
        c.rect(8, b - 2, 12, b, C.paper);
        c.row(b - 1, 8, 12, C.parchment);
        c.row(b - 4, 8, 11, C.paper);
        c.row(b - 5, 8, 11, C.black);
      } else {
        c.rect(8, b - 7, 12, b, C.paper);
        for (let y = b - 6; y < b; y += 2) c.row(y, 8, 12, C.parchment);
        c.row(b - 7, 8, 12, C.black);
        c.row(b - 4, 8, 12, C.straw);
      }
    },
  });
  {
    const stripe = (c, x0, x1, y0, y1, top) => {
      for (let y = y0; y <= y1; y++) {
        const k = (y - y0) / Math.max(1, y1 - y0),
          a = Math.round(top[0] + (x0 - top[0]) * k),
          e = Math.round(top[1] + (x1 - top[1]) * k);
        for (let x = a; x <= e; x++) c.set(x, y, Math.floor((x - a) / ((e - a + 1) / 6)) % 2 ? C.bone : FADEDRED);
      }
    };
    const brolly = (c, x0, x1) => {
      const m = (x0 + x1) >> 1;
      stripe(c, x0, x1, 2, 8, [m - 3, m + 3]);
      c.row(9, x0, x1, D(FADEDRED));
      for (let x = x0; x <= x1; x += 2) c.set(x, 10, FADEDRED);
      c.set(m, 1, C.iron);
      c.col(m, 10, 24, C.iron);
    };
    T('hotdog-cart-night', 'hot dog cart street food stand umbrella sausages steam vendor', {
      w: 36, h: 40, solid: true,
      f(c, u) {
        const b = c.h - 2;
        brolly(c, 3, 31);
        c.rect(4, 24, 30, 33, C.steel);
        c.row(24, 4, 30, L(C.steel));
        c.rect(4, 31, 30, 33, mix(C.steel, 0.7));
        c.rect(3, 22, 31, 23, C.iron);
        c.rect(7, 26, 21, 31, FADEDRED);
        txt(c, 9, 26, 'HOT', C.bone);
        c.set(21, 28, C.bone);
        c.rect(24, 26, 28, 30, DARK);
        c.set(26, 28, u ? AMBER : C.rust);
        wheel(c, 9, b - 3, 3);
        c.col(27, 34, b, C.iron);
        c.line(31, 25, 34, 22, C.iron);
        c.set(34, 21, C.woodDark);
        for (const x of [6, 10]) {
          c.rect(x, 19, x + 2, 21, x === 6 ? C.red : C.mustard);
          c.set(x + 1, 18, C.white);
        }
        if (u) {
          c.rect(14, 16, 24, 17, C.steel);
          c.col(24, 16, 21, C.iron);
          c.rect(14, 20, 23, 21, hex('#3a2a22'));
          for (const x of [15, 18, 21]) c.row(20, x, x + 1, hex('#a0563a'));
          smoke(c, 16, 15, 5, C.ash, 2);
          smoke(c, 20, 14, 4, C.ash, 5);
        } else {
          c.rect(14, 20, 24, 21, L(C.steel));
          c.set(19, 19, C.black);
        }
      },
      sw: 34,
      s(c, u) {
        const b = c.h - 2;
        brolly(c, 3, 31);
        c.rect(10, 24, 24, 33, C.steel);
        c.col(10, 24, 33, L(C.steel));
        c.rect(10, 31, 24, 33, mix(C.steel, 0.7));
        c.rect(9, 22, 25, 23, C.iron);
        c.rect(13, 26, 21, 30, mix(FADEDRED, 0.85));
        c.rect(15, b - 6, 17, b, TYRE);
        c.col(22, 34, b, C.iron);
        c.rect(11, 19, 13, 21, C.red);
        c.set(12, 18, C.white);
        if (u) {
          c.rect(15, 15, 23, 16, C.steel);
          c.rect(15, 20, 23, 21, hex('#3a2a22'));
          c.row(20, 16, 22, hex('#a0563a'));
          smoke(c, 18, 14, 5, C.ash, 2);
        } else c.rect(15, 20, 23, 21, L(C.steel));
      },
    });
  }

  /* ---------- kerb and gutter ---------- */
  T('hydrant-street-yellow', 'fire hydrant yellow rusty street water plug', {
    w: 12, h: 15, solid: true, um: [0, 0, 9], sum: [0, 0, 9],
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, 3, 7, b, HYD);
      c.col(4, 3, b, L(HYD));
      c.row(2, 4, 7, HYD);
      c.row(1, 5, 6, HYD);
      c.rect(3, 4, 8, 4, D(HYD));
      c.rect(1, 6, 2, 8, D(HYD));
      c.rect(9, 6, 10, 8, D(HYD));
      c.rect(3, b - 1, 8, b, D(HYD));
      c.rect(5, 6, 6, 8, u ? DARK : C.rust);
      c.speckle(3, 3, 8, b, C.rust, 7, 2);
      if (u) {
        c.poly([[6, 7], [12, 6], [18, b - 1], [19, b], [10, b], [9, 9]], WATER);
        c.line(7, 7, 12, 6, WATERL);
        c.line(12, 6, 17, b - 2, WATERL);
        dots(c, WATERL, [10, 9, 13, 10, 15, b - 2, 12, b - 1, 19, b - 3, 16, 7]);
        c.row(b, 9, 19, WATER);
      }
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 3, 6, b, HYD);
      c.col(3, 3, b, L(HYD));
      c.row(2, 3, 6, HYD);
      c.row(1, 4, 5, HYD);
      c.rect(2, 4, 7, 4, D(HYD));
      c.rect(7, 6, 9, 8, D(HYD));
      if (!u) c.col(10, 6, 8, C.rust);
      c.rect(4, 6, 5, 8, D(HYD));
      c.rect(2, b - 1, 7, b, D(HYD));
      c.speckle(2, 3, 7, b, C.rust, 7, 2);
      if (u) {
        c.poly([[10, 6], [15, 6], [19, b - 2], [19, b], [12, b], [14, 9], [10, 8]], WATER);
        c.line(10, 6, 15, 6, WATERL);
        c.line(15, 6, 19, b - 2, WATERL);
        dots(c, WATERL, [13, 8, 16, 10, 15, b - 1]);
      }
    },
  });
  T('parking-meter-coin', 'parking meter coin expired pole kerb', {
    w: 8, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 10, 4, b, POLE);
      c.col(3, 10, b, L(POLE));
      c.rect(1, 2, 6, 9, C.slate);
      c.row(1, 2, 5, C.slate);
      c.col(1, 2, 9, L(C.slate));
      c.rect(2, 3, 5, 5, u ? C.bone : hex('#a03028'));
      if (u) {
        c.line(3, 5, 5, 3, C.black);
      } else c.row(4, 2, 5, C.bone);
      c.set(5, 7, DARK);
      c.set(2, 8, C.brass);
    },
    sw: 7,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 10, 3, b, POLE);
      c.col(2, 10, b, L(POLE));
      c.rect(1, 2, 4, 9, C.slate);
      c.row(1, 2, 3, C.slate);
      c.col(1, 2, 9, L(C.slate));
      c.col(4, 3, 5, u ? C.bone : hex('#a03028'));
      c.set(5, 7, C.steel);
    },
  });
  T('roadworks-barrier-lamp', 'road works barrier red white plank trestle amber warning lamp', {
    w: 34, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [4, 27]) {
        c.line(x, 7, x - 2, b, C.wood);
        c.line(x + 1, 7, x + 3, b, C.wood);
        c.row(b - 3, x - 1, x + 2, C.woodDark);
      }
      hazard(c, 1, 7, 32, 11, hex('#a83a30'), C.bone, 4);
      c.row(7, 1, 32, L(C.bone));
      c.row(11, 1, 32, hex('#6a2622'));
      c.rect(14, 5, 18, 6, DARK);
      c.rect(15, 2, 17, 4, u ? LAMP : hex('#8a5a22'));
      c.set(16, 1, u ? AMBER : DARK);
      if (u) {
        c.set(16, 3, C.white);
        dots(c, AMBER, [14, 3, 18, 3, 13, 1, 19, 1, 12, 3, 20, 3]);
      }
    },
    sw: 11,
    s(c, u) {
      const b = c.h - 2;
      c.line(5, 6, 2, b, C.wood);
      c.line(5, 6, 8, b, C.wood);
      c.row(b - 3, 3, 7, C.woodDark);
      c.rect(4, 7, 6, 11, hex('#a83a30'));
      c.row(7, 4, 6, C.bone);
      c.rect(4, 5, 6, 6, DARK);
      c.rect(4, 2, 6, 4, u ? LAMP : hex('#8a5a22'));
      c.set(5, 1, u ? AMBER : DARK);
      if (u) dots(c, AMBER, [2, 3, 8, 3, 2, 1, 8, 1]);
    },
  });
  {
    const man = (cover) => (c, u) => {
      const b = c.h - 2;
      if (!u) {
        c.oval(2, b - 4, 21, b, C.iron);
        c.oval(4, b - 3, 19, b - 1, C.ironDark);
        for (let x = 5; x < 19; x += 2) c.set(x, b - 2, C.iron);
        c.row(b - 4, 7, 16, L(C.iron));
        smoke(c, 14, b - 5, 3, C.ash, 3);
        return;
      }
      c.oval(2, b - 4, 21, b, C.iron);
      c.oval(4, b - 3, 19, b - 1, hex('#0e0c12'));
      const lx = cover ? 13 : 7;
      c.col(lx, b - 9, b - 1, C.rust);
      c.col(lx + 4, b - 9, b - 1, C.rust);
      c.row(b - 7, lx, lx + 4, C.rust);
      c.row(b - 4, lx, lx + 4, mix(C.rust, 0.8));
      c.set(lx, b - 10, C.iron);
      c.set(lx + 4, b - 10, C.iron);
      const cx = cover ? -6 : 20; // the cover, pulled aside
      c.oval(cx, b - 2, cx + 9, b, C.iron);
      c.row(b - 1, cx + 2, cx + 7, C.ironDark);
      c.row(b - 2, cx + 3, cx + 6, L(C.iron));
    };
    T('manhole-cover-ladder', 'manhole cover sewer lid iron steam ladder down hole street', {
      w: 24, h: 8, um: [0, 6, 7], sum: [6, 6, 0], shade: false,
      f: man(false),
      sw: 24,
      s: man(true),
    });
  }
  T('storm-drain-kerb', 'storm drain gutter kerb grating sewer opening paper boat', {
    w: 28, h: 10,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 26, 5, CONC);
      c.row(1, 1, 26, L(CONC));
      c.rect(1, 6, 26, b, CONCD);
      for (const x of [9, 18]) c.col(x, 1, 3, CONCD);
      c.rect(5, 4, 22, 7, hex('#0e0c12'));
      for (let x = 7; x < 22; x += 3) c.col(x, 4, 7, C.iron);
      c.row(b, 1, 26, hex('#3a3a42'));
      litter(c, 2, 25, b, 4, [C.leaf, C.rust, C.paper]);
      if (u) {
        c.row(b, 1, 26, WATER);
        c.row(b - 1, 4, 23, WATER);
        dots(c, WATERL, [3, b, 7, b - 1, 12, b, 17, b - 1, 22, b, 25, b]);
        c.rect(6, 6, 21, 7, mix(WATER, 0.6));
        pat(c, 11, b - 4, ['..w..', '.ww..', 'wwwww', '.www.'], { w: C.white });
      }
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 6, b, CONC);
      c.row(1, 1, 6, L(CONC));
      c.col(6, 1, b, CONCD);
      c.rect(5, 4, 6, 7, hex('#0e0c12'));
      c.row(b, 7, 10, hex('#3a3a42'));
      if (u) {
        c.rect(7, b - 1, 10, b, WATER);
        c.set(8, b - 1, WATERL);
        pat(c, 7, b - 4, ['.w.', 'ww.', 'www'], { w: C.white });
      } else c.set(8, b, C.leaf);
    },
  });

  /* ---------- cars ---------- */
  const MAROON = hex('#5e2a2e'),
    TAXIY = hex('#a8882e'),
    NAVY = C.navy,
    OLIVE = hex('#4f5548');
  T('car-saloon-parked', 'parked car saloon maroon old sedan automobile night kerb', {
    w: 48, h: 22, solid: true, base: 'side',
    s(c, u) {
      const g = carSide(c, { col: MAROON, lit: u, inside: u });
      c.speckle(2, g.wy, 45, g.by, mix(MAROON, 0.8), 14, 3);
      if (u) pat(c, g.c1 - 9, g.ry + 2, ['.kk', 'kkk', 'kkk', 'kkk'], { k: DARK });
    },
    sw: 48,
    w: 26,
    f(c, u) {
      const g = carFront(c, { col: MAROON, lit: u, inside: u });
      if (u) pat(c, 14, g.ry + 2, ['.kk.', 'kkkk', 'kkkk', 'kkkk'], { k: DARK });
    },
  });
  T('police-car-patrol-night', 'police car patrol cruiser blue lights siren cop squad', {
    w: 26, h: 24, solid: true, base: 'side',
    sw: 48,
    s(c, u) {
      const g = carSide(c, { col: DIRTW, lit: u });
      c.rect(g.c0 + 4, g.wy + 3, g.c1 - 3, g.wy + 7, NAVY);
      txt(c, g.c0 + 5, g.wy + 3, 'POLICE', C.bone, { sp: 0 });
      c.rect(g.mid - 4, g.ry - 2, g.mid + 4, g.ry - 1, C.ironDark);
      c.rect(g.mid - 4, g.ry - 2, g.mid - 1, g.ry - 1, u ? hex('#7fa8e8') : hex('#2c3c66'));
      c.rect(g.mid + 1, g.ry - 2, g.mid + 4, g.ry - 1, u ? hex('#e8605a') : hex('#662c2c'));
      if (u) dots(c, C.white, [g.mid - 3, g.ry - 2, g.mid + 2, g.ry - 2]);
      if (u) dots(c, BLUEL, [g.mid - 6, g.ry - 3, g.mid - 3, g.ry - 4, g.mid - 6, g.ry - 1]);
      if (u) dots(c, REDL, [g.mid + 6, g.ry - 3, g.mid + 3, g.ry - 4, g.mid + 6, g.ry - 1]);
    },
    f(c, u) {
      const g = carFront(c, { col: DIRTW, lit: u });
      c.rect(2, g.wy + 1, 23, g.wy + 2, NAVY);
      c.rect(7, g.ry - 2, 18, g.ry - 1, C.ironDark);
      c.rect(7, g.ry - 2, 11, g.ry - 1, u ? hex('#7fa8e8') : hex('#2c3c66'));
      c.rect(14, g.ry - 2, 18, g.ry - 1, u ? hex('#e8605a') : hex('#662c2c'));
      if (u) dots(c, C.white, [8, g.ry - 2, 15, g.ry - 2]);
      if (u) dots(c, BLUEL, [5, g.ry - 3, 8, g.ry - 4, 5, g.ry - 1]);
      if (u) dots(c, REDL, [20, g.ry - 3, 17, g.ry - 4, 20, g.ry - 1]);
    },
  });
  T('taxi-cab-night', 'taxi cab yellow checker roof sign for hire night', {
    w: 26, h: 25, solid: true, base: 'side',
    sw: 48,
    s(c, u) {
      const g = carSide(c, { col: TAXIY, lit: u, inside: u });
      for (let x = 4; x < 44; x++) c.set(x, g.wy + 2, x % 2 ? DARK : C.bone);
      txt(c, g.c0 + 6, g.wy + 4, 'TAXI', DARK);
      c.rect(g.mid - 4, g.ry - 3, g.mid + 4, g.ry - 1, u ? LAMP : hex('#6e5a2e'));
      c.row(g.ry - 2, g.mid - 2, g.mid + 2, u ? C.white : DARK);
      if (u) dots(c, AMBER, [g.mid - 6, g.ry - 2, g.mid + 6, g.ry - 2, g.mid, g.ry - 5]);
    },
    f(c, u) {
      const g = carFront(c, { col: TAXIY, lit: u, inside: u });
      for (let x = 2; x < 24; x++) c.set(x, g.wy + 1, x % 2 ? DARK : C.bone);
      c.rect(9, g.ry - 3, 16, g.ry - 1, u ? LAMP : hex('#6e5a2e'));
      c.row(g.ry - 2, 11, 14, u ? C.white : DARK);
      if (u) dots(c, AMBER, [7, g.ry - 2, 18, g.ry - 2, 12, g.ry - 5]);
    },
  });
  T('car-estate-clamped', 'estate car wheel clamp parking ticket abandoned station wagon', {
    w: 26, h: 22, solid: true, base: 'side',
    sw: 50,
    s(c, u) {
      const g = carSide(c, { col: OLIVE, est: true, cab: [4, 34], dead: true });
      c.speckle(2, g.wy, 47, g.by, C.rust, 12, 5);
      c.poly([[35, g.b], [38, g.b - 7], [41, g.b]], C.mustard);
      c.rect(36, g.b - 4, 40, g.b - 2, C.mustard);
      c.set(38, g.b - 3, DARK);
      c.set(g.c1 - 5, g.wy - 2, C.white);
      if (u) {
        c.poly([[g.mid + 2, g.wy - 1], [g.mid + 2, g.ry + 3], [g.mid + 6, g.ry + 2], [g.mid + 8, g.wy - 1]], DARK);
        dots(c, C.glassLight, [g.mid + 3, g.ry + 2, g.mid + 7, g.ry + 4, g.mid + 4, g.wy, g.mid + 6, g.b, g.mid + 3, g.b, g.mid + 8, g.b - 1]);
      }
    },
    f(c, u) {
      const g = carFront(c, { col: OLIVE, dead: true });
      c.speckle(2, g.wy, 23, g.by, C.rust, 10, 5);
      c.rect(1, g.b - 4, 6, g.b, C.mustard);
      c.set(3, g.b - 2, DARK);
      c.rect(15, g.wy - 3, 17, g.wy - 2, C.white);
      if (u) {
        c.poly([[7, g.wy - 1], [7, g.ry + 3], [11, g.ry + 2], [12, g.wy - 1]], DARK);
        for (const [x, y] of [[6, g.ry + 2], [13, g.ry + 2], [14, g.wy - 2]]) c.line(9, g.ry + 4, x, y, C.glassLight);
        dots(c, C.glassLight, [9, g.wy, 11, g.wy + 1]);
      }
    },
  });
  {
    const VAN = hex('#a9a698');
    T('van-white-rusty', 'white van rusty transit panel van sliding door delivery kidnap', {
      w: 28, h: 32, solid: true, base: 'side',
      sw: 56,
      s(c, u) {
        const b = c.h - 2,
          by = b - 3;
        c.poly([[1, 3], [42, 3], [47, 5], [51, 14], [54, 16], [54, by], [1, by]], VAN);
        c.row(3, 1, 42, L(VAN));
        c.col(1, 3, by, L(VAN));
        c.rect(1, by - 1, 54, by, mix(VAN, 0.7));
        c.poly([[41, 7], [46, 7], [50, 14], [41, 14]], u ? hex('#b9a860') : GLASSD);
        if (!u) c.line(43, 8, 45, 12, L(GLASSD));
        else pat(c, 43, 9, ['.kk', 'kkk', 'kkk', 'kkk', 'kkk'], { k: DARK });
        c.col(39, 5, by - 1, D(VAN));
        c.col(40, 16, by - 2, D(VAN));
        c.row(18, 42, 43, C.iron);
        c.col(22, 5, by - 1, D(VAN));
        c.row(15, 2, 38, mix(VAN, 0.85));
        c.rect(53, by - 2, 54, by - 1, C.iron);
        c.rect(1, by - 2, 1, by - 1, C.iron);
        c.rect(53, 17, 54, 19, u ? LAMP : C.glassLight);
        c.rect(1, 16, 1, 19, u ? REDL : hex('#7a2a26'));
        for (const x of [11, 44]) {
          c.oval(x - 5, b - 9, x + 5, b, DARK);
          wheel(c, x, b - 4, 4);
        }
        c.speckle(2, 4, 38, by - 2, C.rust, 16, 4);
        for (const [x, y, n] of [[6, 22, 4], [18, 20, 5], [30, 24, 3], [35, 5, 4]]) c.col(x, y, y + n, C.rust);
        scribble(c, 5, 9, 18, 11, mix(VAN, 0.78), 2);
        if (u) {
          c.rect(23, 6, 38, by - 2, hex('#121016'));
          c.rect(24, by - 4, 38, by - 2, hex('#2a2620'));
          c.rect(26, by - 7, 34, by - 5, hex('#5c5a48'));
          c.row(by - 7, 26, 34, hex('#77745e'));
          c.line(30, 7, 31, 13, C.straw);
          c.set(31, 14, C.straw);
          c.col(22, 5, by - 1, C.iron);
        }
      },
      f(c, u) {
        const b = c.h - 2,
          by = b - 3;
        c.rect(2, 3, 25, by, VAN);
        c.row(3, 2, 25, L(VAN));
        c.col(2, 3, by, L(VAN));
        c.clear(2, 3);
        c.clear(25, 3);
        c.rect(4, 6, 23, 14, u ? hex('#b9a860') : GLASSD);
        if (!u) c.line(7, 12, 10, 7, L(GLASSD));
        else pat(c, 16, 8, ['.kkk.', 'kkkkk', 'kkkkk', 'kkkkk', 'kkkkk', 'kkkkk', 'kkkkk'], { k: DARK });
        c.rect(1, 12, 1, 14, VAN);
        c.rect(26, 12, 26, 14, VAN);
        c.rect(9, 18, 18, 21, hex('#1e1c24'));
        for (let x = 10; x < 18; x += 2) c.col(x, 18, 21, C.iron);
        for (const x of [3, 21]) c.rect(x, 18, x + 3, 20, u ? LAMP : C.glassLight);
        c.rect(1, by - 2, 26, by, C.iron);
        c.row(by, 1, 26, C.ironDark);
        c.rect(10, by - 2, 17, by - 1, C.bone);
        for (const x of [2, 21]) c.rect(x, by + 1, x + 4, b, TYRE);
        c.row(by + 1, 7, 20, DARK);
        c.speckle(3, 15, 24, by - 3, C.rust, 12, 4);
      },
    });
  }

  /* ---------- two wheels and trolleys ---------- */
  {
    const BIKE = hex('#3f5f5c');
    T('bicycle-chained-post', 'bicycle chained to a post bike lock stolen wheel street', {
      w: 9, h: 26, solid: true, base: 'side',
      sw: 32,
      s(c, u) {
        const b = c.h - 2;
        c.rect(15, 1, 16, b, POLE);
        c.col(15, 1, b, L(POLE));
        c.rect(12, 2, 19, 6, hex('#34507a'));
        c.frame(12, 2, 19, 6, C.bone);
        c.set(15, 4, C.bone);
        c.set(16, 4, C.bone);
        ring(c, 24, b - 5, 5, TYRE, u ? C.steel : C.steel);
        if (!u) {
          ring(c, 7, b - 5, 5, TYRE, C.steel);
          c.line(7, b - 5, 11, b - 12, BIKE);
          c.line(11, b - 12, 21, b - 12, BIKE);
          c.line(11, b - 12, 15, b - 5, BIKE);
          c.line(15, b - 5, 21, b - 12, BIKE);
          c.line(7, b - 5, 15, b - 5, BIKE);
          c.line(24, b - 5, 21, b - 14, BIKE);
          c.row(b - 15, 19, 22, C.black);
          c.col(11, b - 14, b - 12, C.iron);
          c.row(b - 15, 9, 12, C.black);
          c.set(15, b - 4, C.iron);
        } else {
          c.line(24, b - 5, 22, b - 11, BIKE);
          c.set(22, b - 12, C.steel);
          dots(c, C.steel, [8, b, 10, b, 5, b]);
          c.row(b, 6, 7, C.black);
        }
        for (const [x, y] of [[17, b - 9], [18, b - 8], [19, b - 7], [20, b - 6], [21, b - 5], [17, b - 7], [14, b - 8]]) c.set(x, y, C.brass);
        c.rect(16, b - 9, 17, b - 8, C.brass);
      },
      f(c, u) {
        const b = c.h - 2;
        c.rect(3, 1, 4, b, POLE);
        c.col(3, 1, b, L(POLE));
        c.rect(1, 2, 6, 6, hex('#34507a'));
        c.frame(1, 2, 6, 6, C.bone);
        if (!u) {
          c.col(5, b - 10, b, TYRE);
          c.col(6, b - 9, b - 1, C.steel);
          c.col(5, b - 14, b - 10, BIKE);
          c.row(b - 15, 2, 7, C.black);
          c.set(1, b - 14, C.black);
          c.set(7, b - 14, C.black);
          c.rect(4, b - 17, 6, b - 16, C.black);
        } else {
          c.col(5, b - 10, b, TYRE);
          c.col(6, b - 9, b - 1, C.steel);
          c.col(5, b - 12, b - 10, BIKE);
        }
        dots(c, C.brass, [3, b - 8, 4, b - 8, 5, b - 7, 6, b - 8]);
      },
    });
  }
  T('motorbike-black-parked', 'motorbike motorcycle parked black chrome headlamp exhaust biker', {
    w: 12, h: 22, solid: true, base: 'side',
    sw: 34,
    s(c, u) {
      const b = c.h - 2,
        TANK = hex('#5a1f22');
      wheel(c, 6, b - 4, 4, C.iron);
      wheel(c, 27, b - 4, 4, C.iron);
      c.line(27, b - 4, 23, 6, C.steel);
      c.line(26, b - 4, 22, 6, C.steel);
      c.row(5, 20, 23, C.black);
      c.set(20, 4, C.black);
      c.rect(24, 6, 25, 8, u ? LAMP : C.glassLight);
      if (u) dots(c, LAMP, [27, 7, 29, 6, 29, 8, 31, 7, 31, 5, 31, 9]);
      c.rect(11, b - 9, 20, b - 3, C.iron);
      c.rect(13, b - 8, 18, b - 4, C.steel);
      for (let y = b - 8; y <= b - 4; y += 2) c.row(y, 13, 18, C.ironDark);
      c.rect(13, 8, 21, 10, TANK);
      c.row(8, 14, 20, L(TANK));
      c.rect(5, 9, 12, 10, C.black);
      c.row(9, 5, 12, hex('#3a3640'));
      c.row(11, 3, 8, hex('#2a2830'));
      c.row(b - 2, 2, 14, C.steel);
      c.row(b - 3, 1, 4, C.steel);
      c.line(16, b - 3, 14, b, C.iron);
      c.set(2, 10, u ? REDL : hex('#7a2a26'));
      if (u) {
        smoke(c, 1, b - 4, 6, SMOKE, 3);
        c.set(2, b - 5, SMOKE);
      }
    },
    f(c, u) {
      const b = c.h - 2;
      c.rect(5, 10, 6, b, TYRE);
      c.col(4, 5, b - 4, C.steel);
      c.col(7, 5, b - 4, C.steel);
      c.row(4, 1, 10, C.black);
      c.set(1, 3, C.steel);
      c.set(10, 3, C.steel);
      c.rect(4, 5, 7, 8, C.iron);
      c.rect(5, 5, 6, 7, u ? LAMP : C.glassLight);
      if (u) dots(c, LAMP, [2, 6, 9, 6, 3, 8, 8, 8]);
      c.rect(4, 10, 7, 11, hex('#5a1f22'));
      c.rect(3, b - 8, 3, b - 5, C.iron);
      c.rect(8, b - 8, 8, b - 5, C.iron);
    },
  });
  {
    const cart = (c, u) => {
      const b = c.h - 2;
      for (let x = 4; x <= 17; x += 2) c.line(x, 5, x + (x < 10 ? 1 : 0), 12, C.steel);
      c.row(5, 3, 17, L(C.steel));
      c.row(9, 4, 17, C.steel);
      c.row(12, 5, 17, C.steel);
      c.col(17, 5, 12, C.steel);
      c.line(3, 5, 5, 12, C.steel);
      c.rect(1, 3, 3, 4, hex('#8f3b30'));
      c.line(5, 12, 4, b - 2, C.iron);
      c.line(16, 12, 16, b - 2, C.iron);
      c.row(b - 2, 4, 16, C.iron);
      c.rect(4, b - 1, 5, b, TYRE);
      c.rect(15, b - 1, 16, b, TYRE);
      if (u) {
        c.oval(5, 2, 11, 9, BAG);
        c.oval(10, 1, 16, 8, BAG);
        dots(c, hex('#3a3842'), [7, 3, 12, 2, 13, 4]);
        c.rect(6, 9, 16, 11, BAG);
        c.rect(12, 7, 15, 10, CARD);
        c.set(8, 1, BAG);
        pat(c, 15, 1, ['.f', 'ff', '.f'], { f: C.flesh });
      } else {
        pat(c, 8, 10, ['.kk..', 'kkkkk'], { k: C.woodDark });
      }
    };
    T('shopping-trolley-abandoned', 'shopping trolley cart abandoned supermarket wire basket bags', {
      w: 20, h: 20, base: 'side',
      sw: 20,
      s: cart,
      f(c, u) {
        const b = c.h - 2;
        for (let x = 3; x <= 13; x += 2) c.col(x, 5, 12, C.steel);
        c.row(5, 2, 14, L(C.steel));
        c.row(9, 3, 13, C.steel);
        c.row(12, 3, 13, C.steel);
        c.col(2, 5, 9, C.steel);
        c.col(14, 5, 9, C.steel);
        c.row(3, 2, 14, hex('#8f3b30'));
        c.col(4, 13, b - 2, C.iron);
        c.col(12, 13, b - 2, C.iron);
        c.rect(3, b - 1, 4, b, TYRE);
        c.rect(12, b - 1, 13, b, TYRE);
        if (u) {
          c.oval(3, 1, 9, 8, BAG);
          c.oval(8, 2, 13, 8, BAG);
          dots(c, hex('#3a3842'), [5, 3, 10, 4]);
          c.rect(4, 8, 12, 11, BAG);
          c.rect(8, 7, 11, 10, CARD);
        } else c.row(11, 6, 9, C.woodDark);
      },
      w: 17,
    });
  }

  /* ---------- rubbish ---------- */
  const bag = (c, x0, y0, x1, y1, knot = true) => {
    c.oval(x0, y0, x1, y1 + 2, BAG);
    c.clearRect(x0, y1 + 1, x1, y1 + 2);
    c.row(y1, x0 + 1, x1 - 1, BAG);
    const m = (x0 + x1) >> 1;
    if (knot) {
      c.set(m, y0 - 1, BAG);
      c.set(m + 1, y0 - 2, BAG);
      c.set(m - 1, y0 - 2, BAG);
    }
    c.line(x0 + 2, y0 + 2, x0 + 1, y0 + 4, hex('#4a4852'));
    c.set(m + 1, y0 + 2, hex('#3a3842'));
  };
  T('wheelie-bin-green', 'wheelie bin green plastic rubbish bin lid number refuse', {
    w: 15, h: 22, solid: true, um: [0, 7, 0], sum: [0, 7, 0],
    f(c, u) {
      const b = c.h - 2,
        col = BENCHG;
      c.poly([[2, 5], [12, 5], [11, b - 1], [3, b - 1]], col);
      c.line(2, 5, 3, b - 1, L(col));
      for (const x of [5, 9]) c.col(x, 8, b - 3, D(col));
      c.rect(2, b - 1, 3, b, TYRE);
      c.rect(11, b - 1, 12, b, TYRE);
      txt(c, 4, 9, '13', C.bone);
      if (u) {
        c.rect(1, -4, 13, 0, D(col));
        c.row(-4, 1, 13, col);
        c.rect(2, 1, 12, 4, DARK);
        bag(c, 3, 0, 8, 4, true);
        bag(c, 8, 1, 12, 4, false);
        c.row(5, 1, 13, col);
      } else {
        c.rect(1, 3, 13, 5, col);
        c.row(3, 1, 13, L(col));
        c.row(5, 1, 13, D(col));
        c.row(2, 5, 9, D(col));
      }
    },
    sw: 15,
    s(c, u) {
      const b = c.h - 2,
        col = BENCHG;
      c.poly([[3, 5], [12, 5], [11, b - 1], [4, b - 1]], mix(col, 0.88));
      c.line(3, 5, 4, b - 1, col);
      c.row(10, 4, 11, D(col));
      wheel(c, 4, b - 2, 2, C.iron);
      c.rect(1, 6, 2, 7, C.iron);
      if (u) {
        c.rect(2, -5, 3, 4, D(col));
        c.col(2, -5, 4, col);
        c.rect(4, 2, 11, 4, DARK);
        bag(c, 5, 0, 10, 4, true);
        c.row(5, 3, 12, col);
      } else {
        c.rect(2, 3, 13, 5, col);
        c.row(3, 2, 13, L(col));
        c.row(5, 2, 13, D(col));
      }
    },
  });
  T('bin-bags-heap', 'bin bags black rubbish sacks heap pile garbage torn rat', {
    w: 26, h: 15,
    f(c, u) {
      const b = c.h - 2;
      bag(c, 9, 3, 17, 9);
      bag(c, 1, 6, 10, b);
      bag(c, 15, 6, 24, b);
      bag(c, 8, 8, 16, b, false);
      if (u) {
        c.poly([[10, 9], [15, 9], [14, b], [9, b]], hex('#4a3a2c'));
        dots(c, C.paper, [11, 10, 13, 11, 10, b]);
        dots(c, C.bone, [12, b - 1, 13, b]);
        dots(c, hex('#8f3b30'), [14, 10, 11, b - 1]);
        c.row(b, 6, 9, C.paper);
        c.set(5, b, hex('#8f3b30'));
        pat(c, 17, b - 2, ['.rr..', 'rrrr.', '....t'], { r: hex('#5a5048'), t: hex('#8a6a60') });
      }
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2;
      bag(c, 4, 3, 12, 9);
      bag(c, 1, 6, 9, b);
      bag(c, 7, 7, 14, b, false);
      if (u) {
        c.poly([[9, 9], [13, 9], [12, b], [8, b]], hex('#4a3a2c'));
        dots(c, C.paper, [10, 10, 11, b - 1, 12, b]);
        dots(c, hex('#8f3b30'), [9, b - 1]);
      }
    },
  });
  T('litter-bin-cast-iron', 'litter bin street rubbish cast iron hooded smouldering smoke', {
    w: 11, h: 19, solid: true, um: [0, 6, 0], same: true,
    f(c, u) {
      const b = c.h - 2,
        col = hex('#2c2f36');
      c.rect(2, 6, 8, b, col);
      c.col(2, 6, b, C.iron);
      c.col(3, 6, b, C.iron);
      c.rect(1, 2, 9, 3, col);
      c.row(1, 3, 7, col);
      c.row(2, 1, 9, C.iron);
      c.rect(2, 4, 8, 5, DARK);
      c.col(2, 4, 5, col);
      c.col(8, 4, 5, col);
      c.row(9, 2, 8, C.brass);
      c.rect(1, b - 1, 9, b, D(col));
      c.set(5, 4, CARD);
      c.set(6, 5, C.paper);
      if (u) {
        c.row(5, 4, 6, AMBER);
        c.set(5, 4, LAMP);
        smoke(c, 5, 0, 6, SMOKE, 4);
        smoke(c, 7, 1, 4, C.ash, 2);
      }
    },
  });
  {
    const SK = hex('#a08a3a');
    T('skip-builders-rubble', 'builders skip yellow rubble dumped carpet roll shoes body', {
      w: 28, h: 24, solid: true, base: 'side',
      sw: 48,
      s(c, u) {
        const b = c.h - 2;
        // rubble
        c.poly([[6, 8], [12, 4], [20, 5], [30, 3], [40, 8]], CONCD);
        bricks(c, 14, 5, 22, 7, hex('#7a4034'));
        c.line(24, 2, 36, 7, C.woodPale);
        c.line(24, 3, 36, 8, C.wood);
        c.rect(8, 6, 12, 7, C.stone);
        dots(c, C.stoneLight, [18, 4, 27, 6, 33, 5]);
        c.poly([[1, 8], [46, 8], [40, b - 1], [7, b - 1]], SK);
        c.rect(1, 7, 46, 8, D(SK));
        c.row(7, 1, 46, L(SK));
        c.line(1, 9, 7, b - 1, L(SK));
        for (const x of [14, 24, 34]) c.col(x, 9, b - 2, D(SK));
        c.rect(4, 10, 5, 11, C.ironDark);
        c.rect(42, 10, 43, 11, C.ironDark);
        c.speckle(3, 9, 44, b - 1, C.rust, 9, 6);
        scribble(c, 17, 13, 22, 15, D(SK), 7);
        c.row(b, 8, 10, C.ironDark);
        c.row(b, 37, 39, C.ironDark);
        if (u) {
          c.rect(10, 3, 37, 6, hex('#6a3a40'));
          c.row(3, 10, 37, hex('#84505a'));
          c.row(6, 10, 37, hex('#4a2830'));
          for (const x of [15, 22, 30]) c.col(x, 3, 6, C.straw);
          c.rect(9, 3, 9, 6, C.parchment);
          c.rect(38, 4, 41, 5, DARK);
          c.rect(40, 3, 41, 5, hex('#3a2c22'));
          c.set(38, 4, C.flesh);
        }
      },
      w: 28,
      f(c, u) {
        const b = c.h - 2;
        c.poly([[5, 8], [10, 4], [18, 3], [22, 8]], CONCD);
        bricks(c, 9, 5, 15, 7, hex('#7a4034'));
        c.line(16, 2, 20, 7, C.woodPale);
        c.rect(2, 8, 25, b - 1, SK);
        c.rect(1, 7, 26, 8, D(SK));
        c.row(7, 1, 26, L(SK));
        c.col(2, 9, b - 1, L(SK));
        panel(c, 5, 11, 22, b - 4, SK);
        c.rect(12, 9, 15, 10, C.ironDark);
        c.speckle(3, 9, 24, b - 1, C.rust, 9, 6);
        c.row(b, 3, 5, C.ironDark);
        c.row(b, 22, 24, C.ironDark);
        if (u) {
          c.oval(9, 1, 16, 7, hex('#6a3a40'));
          c.oval(10, 2, 15, 6, C.parchment);
          c.oval(11, 3, 14, 5, hex('#4a2830'));
          c.rect(11, 3, 12, 5, hex('#3a2c22'));
          c.rect(13, 3, 14, 5, hex('#3a2c22'));
          c.row(5, 11, 14, DARK);
        }
      },
    });
  }
  {
    const pal = (c, x0, x1, y, end) => {
      c.row(y, x0, x1, C.woodPale);
      c.row(y + 1, x0, x1, hex('#2a2018'));
      if (end) c.row(y + 1, x0, x1, C.wood);
      else for (const x of [x0, ((x0 + x1) >> 1) - 1, x1 - 2]) c.rect(x, y + 1, x + 2, y + 1, C.wood);
      c.row(y + 2, x0, x1, D(C.woodPale));
    };
    T('pallets-stack-yard', 'wooden pallets stack pile timber skids toppled', {
      w: 24, h: 17, solid: true, um: [0, 0, 12], sum: [0, 0, 10],
      f(c, u) {
        const b = c.h - 2;
        const n = u ? 3 : 5;
        for (let i = 0; i < n; i++) pal(c, 1 + (i % 2), 21 + (i % 2), b - 2 - i * 3);
        if (u) {
          c.line(20, b - 8, 32, b - 1, C.woodPale);
          c.line(20, b - 7, 31, b - 1, C.wood);
          c.line(20, b - 6, 30, b - 1, D(C.woodPale));
          c.rect(26, b - 2, 34, b, C.woodPale);
          c.row(b - 1, 26, 34, hex('#2a2018'));
          dots(c, C.wood, [26, b - 1, 30, b - 1, 34, b - 1]);
          c.row(b, 26, 34, D(C.woodPale));
        }
      },
      sw: 18,
      s(c, u) {
        const b = c.h - 2;
        const n = u ? 3 : 5;
        for (let i = 0; i < n; i++) pal(c, 1 + (i % 2), 15 + (i % 2), b - 2 - i * 3, true);
        if (u) {
          c.line(15, b - 8, 24, b - 1, C.woodPale);
          c.line(15, b - 7, 23, b - 1, C.wood);
          c.rect(19, b - 2, 26, b, C.woodPale);
          c.row(b - 1, 19, 26, C.wood);
          c.row(b, 19, 26, D(C.woodPale));
        }
      },
    });
  }
};
