/* env-suburban, part 1: the drive and the kerb — cars (large), garage, front door, fence, bins. Part of tools/big/env2-ruin.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, slab, txt, scribble, wheel, rim, ring } = X;
  const { bricks, planks, boards, hazard, rust, tins, tin, bottle, litter, smoke, pool, crate, mesh, grass, leaves, hedge, pane, drip, carSide, carFront, tyreEnd } = X;
  const { TYRE, DARK, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, CARD, CARDD, WATER, WATERL, SMOKE, LAWN, LAWND, HEDGE, VINYL, WARM } = X;
  setCat('env-suburban', 'Suburban');

  const SEDAN = hex('#9a8a6a'),
    WAGON = hex('#5f7466'),
    WOODP = hex('#8a6a44'),
    ICE = hex('#c9c2aa'),
    PINK = hex('#b0707a'),
    MINT = hex('#7aa08c'),
    BUSY = hex('#b8963a'),
    BOXW = hex('#bdb9aa'),
    CABO = hex('#a8623a'),
    MAILB = hex('#3d5a8a'),
    MAILR = hex('#a8403a'),
    GARAGE = hex('#b3ad9c'),
    DOORR = hex('#7a2e2e'),
    BING = hex('#3f5a48'),
    BINB = hex('#3a4a66'),
    WREATH = hex('#3a5a38');
  /** A box of cardboard. */
  const box = (c, x0, y0, x1, y1, tape = true) => {
    c.rect(x0, y0, x1, y1, CARD);
    c.row(y0, x0, x1, L(CARD));
    c.col(x1, y0, y1, CARDD);
    if (tape) c.col((x0 + x1) >> 1, y0, y1, hex('#b9a070'));
  };
  /** A car seen from behind (estate): o.open = tailgate up. */
  function carBack(c, o) {
    const w = c.w,
      b = c.h - 2,
      col = o.col,
      by = b - 3,
      wy = b - 11,
      ry = wy - 6;
    c.rect(1, wy, w - 2, by, col);
    c.row(wy, 2, w - 3, L(col));
    c.clear(1, wy);
    c.clear(w - 2, wy);
    c.poly([[3, wy - 1], [4, ry], [w - 5, ry], [w - 4, wy - 1]], col);
    c.row(ry, 4, w - 5, L(col));
    if (o.open) {
      c.rect(5, ry + 2, w - 6, by - 2, DARK);
      c.rect(3, ry - 6, w - 4, ry, D(col));
      c.row(ry - 6, 3, w - 4, col);
      c.rect(5, ry - 5, w - 6, ry - 2, mix(C.glass, 0.7));
    } else {
      c.rect(5, ry + 2, w - 6, wy - 1, o.lit ? WARM : GLASSD);
      if (!o.lit) c.line(7, wy - 2, 9, ry + 2, mix(C.glass, 0.9));
      c.rect(3, wy + 2, w - 4, by - 3, o.panel || col);
      c.row(wy + 3, (w >> 1) - 1, w >> 1, C.steel);
    }
    for (const x of [2, w - 5]) c.rect(x, wy + 1, x + 2, wy + 3, o.lit ? REDL : hex('#7a2a26'));
    c.rect(1, by - 1, w - 2, by, C.steel);
    c.row(by, 1, w - 2, D(C.steel));
    c.rect((w >> 1) - 3, by - 1, (w >> 1) + 2, by, C.bone);
    for (const x of [2, w - 6]) c.rect(x, by + 1, x + 3, b, TYRE);
    c.rect(6, by + 1, w - 7, by + 1, DARK);
    return { wy, ry, by, b };
  }

  /* ---------- the large things ---------- */
  T('suburban-family-car-sedan', 'large family car beige saloon sedan parked in the drive door open engine running', {
    w: 26, h: 22, solid: true, base: 'side', um: [0, 0, 6],
    sw: 48,
    s(c, u) {
      const g = carSide(c, { col: SEDAN, lit: u, inside: u, door: u, seat: hex('#6a4a3a') });
      c.row(g.wy + 5, 4, 44, mix(SEDAN, 0.86));
      c.rect(5, g.wy + 2, 7, g.wy + 3, C.bone);
      if (u) {
        dots(c, LAMP, [47, g.wy + 3]);
        c.set(g.mid + 9, g.by - 2, C.brass);
        smoke(c, 0, g.by, 4, hex('#9a9a94'), 3);
      } else {
        /* a child seat, a toy on the parcel shelf */
        c.rect(g.c0 + 6, g.ry + 3, g.c0 + 8, g.wy - 1, hex('#4a5a78'));
        c.set(g.c0 + 3, g.wy - 2, MAILR);
      }
    },
    f(c, u) {
      const g = carFront(c, { col: SEDAN, lit: u, inside: u, door: u });
      if (!u) {
        c.rect(8, g.ry + 3, 9, g.wy - 2, hex('#22303a'));
        c.rect(16, g.ry + 3, 17, g.wy - 2, hex('#22303a'));
        c.set(13, g.ry + 2, hex('#6a8a4a'));
        c.set(13, g.ry + 3, hex('#6a8a4a'));
      } else {
        c.rect(15, g.ry + 3, 18, g.wy - 1, hex('#6a4a3a'));
        dots(c, LAMP, [2, g.wy + 6, 6, g.wy + 6, 19, g.wy + 6, 23, g.wy + 6]);
      }
    },
  });

  T('suburban-station-wagon-woodgrain', 'large station wagon estate car wood panel sides roof rack tailgate luggage holiday', {
    w: 26, h: 24, solid: true, base: 'side', um: [0, 6, 0], sum: [5, 6, 0],
    sw: 50,
    s(c, u) {
      const g = carSide(c, { col: WAGON, est: true, cab: [3, 36], lit: u, hub: C.bone });
      c.rect(4, g.wy + 2, 43, g.by - 2, WOODP);
      c.frame(4, g.wy + 2, 43, g.by - 2, hex('#a8855c'));
      for (const x of [16, 34]) c.col(x, g.wy + 2, g.by - 2, D(WOODP));
      c.row(g.wy + 4, 12, 13, C.steel);
      c.row(g.wy + 4, 30, 31, C.steel);
      for (const x of [10, 38]) {
        c.oval(x - 4, g.b - 8, x + 4, g.b, DARK);
        wheel(c, x, g.b - 3, 3, C.bone);
      }
      /* the roof rack */
      c.row(g.ry - 2, 6, 28, C.steel);
      for (const x of [7, 17, 27]) c.set(x, g.ry - 1, C.steel);
      if (u) {
        /* tailgate up, cases out */
        c.line(4, g.ry, -1, g.ry - 5, WAGON);
        c.line(4, g.ry + 1, -2, g.ry - 4, D(WAGON));
        c.rect(5, g.ry + 2, 9, g.wy - 1, DARK);
        c.rect(6, g.wy - 3, 9, g.wy - 1, hex('#7a4a3a'));
        c.rect(-4, g.b - 6, 1, g.b, hex('#7a4a3a'));
        c.row(g.b - 6, -4, 1, hex('#9a6450'));
        c.rect(-2, g.b - 7, -1, g.b - 7, DARK);
        c.rect(-3, g.b - 10, 0, g.b - 8, hex('#4a5a78'));
        c.rect(9, g.ry - 5, 20, g.ry - 3, hex('#4a5a78'));
        c.row(g.ry - 5, 9, 20, hex('#62749a'));
      } else {
        c.rect(6, g.ry + 3, 9, g.wy - 1, hex('#22303a'));
        c.rect(11, g.ry - 4, 22, g.ry - 3, hex('#4a5a78'));
        c.row(g.ry - 4, 11, 22, hex('#62749a'));
        dots(c, C.bone, [12, g.ry - 2, 21, g.ry - 2]);
      }
    },
    f(c, u) {
      /* seen from behind */
      const g = carBack(c, { col: WAGON, open: u, lit: u, panel: WOODP });
      if (u) {
        c.rect(6, g.wy - 2, 11, g.by - 2, hex('#7a4a3a'));
        c.row(g.wy - 2, 6, 11, hex('#9a6450'));
        c.rect(13, g.wy, 17, g.by - 2, hex('#4a5a78'));
        c.rect(18, g.wy - 3, 20, g.by - 2, CARD);
        c.set(19, g.wy - 4, hex('#6a8a4a'));
        c.row(g.by - 1, 5, 20, hex('#2a2428'));
      } else {
        c.frame(3, g.wy + 2, 22, g.by - 3, hex('#a8855c'));
        c.rect(7, g.ry + 3, 10, g.wy - 1, hex('#22303a'));
        c.rect(14, g.ry + 4, 17, g.wy - 1, hex('#22303a'));
      }
      c.row(g.ry - 2, 5, 20, C.steel);
      dots(c, C.steel, [6, g.ry - 1, 19, g.ry - 1]);
      if (!u) c.rect(8, g.ry - 4, 17, g.ry - 3, hex('#4a5a78'));
    },
  });

  T('suburban-ice-cream-van', 'large ice cream van truck pink cream chimes serving hatch cone on the roof melting', {
    w: 28, h: 32, solid: true, base: 'side', um: [0, 3, 0], sum: [0, 3, 0],
    sw: 48,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 7, 34, 24, ICE);
      c.row(7, 3, 33, L(ICE));
      c.col(2, 8, 24, L(ICE));
      c.clear(2, 7);
      c.poly([[35, 11], [41, 11], [45, 17], [46, 18], [46, 24], [35, 24]], ICE);
      c.row(11, 35, 41, L(ICE));
      c.poly([[36, 12], [40, 12], [43, 17], [36, 17]], GLASSD);
      c.line(37, 16, 39, 13, mix(C.glass, 0.9));
      c.rect(2, 19, 46, 24, PINK);
      c.row(19, 2, 46, L(PINK));
      c.row(24, 2, 46, D(PINK));
      txt(c, 26, 13, 'ICE', PINK, { sp: 0 });
      /* the hatch and its awning */
      for (let x = 6; x <= 23; x++) c.col(x, 8, 9, (x >> 1) % 2 ? PINK : C.white);
      c.rect(7, 10, 22, 17, u ? hex('#3a2e30') : hex('#5d7f8c'));
      c.frame(6, 10, 23, 18, C.steel);
      if (u) {
        c.rect(8, 12, 10, 17, C.steel);
        c.rect(8, 11, 10, 11, MINT);
        c.rect(17, 14, 18, 17, hex('#a8855c'));
        c.rect(16, 12, 19, 13, PINK);
        /* whoever is serving */
        c.rect(12, 11, 15, 14, hex('#22181c'));
        c.rect(11, 15, 16, 17, hex('#22181c'));
        dots(c, C.white, [13, 12, 15, 12]);
        dots(c, PINK, [19, 0, 23, -2, 27, 1]);
        dots(c, D(PINK), [20, -1, 24, -3, 28, 0]);
      } else {
        c.col(14, 10, 17, C.steel);
        c.line(8, 15, 12, 11, hex('#9ebcc2'));
        for (const [x, col] of [[16, PINK], [18, MINT], [20, hex('#b0a058')]]) c.rect(x, 12, x, 14, col);
      }
      /* the cone on the roof, melting down the side */
      c.poly([[13, 6], [18, 6], [16, 2], [15, 2]], hex('#a8855c'));
      c.oval(12, 0, 19, 4, PINK);
      c.row(0, 14, 16, L(PINK));
      drip(c, 12, 5, 4, PINK);
      drip(c, 19, 5, u ? 7 : 2, PINK);
      if (u) {
        drip(c, 25, 19, 5, hex('#8f3b44'));
        drip(c, 5, 7, 6, PINK);
      }
      c.rect(45, 20, 46, 21, u ? LAMP : C.glassLight);
      c.rect(2, 25, 46, 25, DARK);
      for (const x of [10, 38]) {
        c.oval(x - 5, b - 9, x + 5, b, DARK);
        wheel(c, x, b - 4, 4, C.bone);
      }
    },
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 7, 24, 24, ICE);
      c.row(7, 4, 23, L(ICE));
      c.clear(3, 7);
      c.clear(24, 7);
      c.rect(5, 10, 22, 17, GLASSD);
      c.line(7, 16, 11, 11, mix(C.glass, 0.9));
      if (u) {
        c.rect(15, 12, 18, 14, hex('#22181c'));
        c.rect(14, 15, 19, 17, hex('#22181c'));
        dots(c, C.white, [16, 13, 18, 13]);
      }
      c.rect(3, 19, 24, 24, PINK);
      c.row(19, 3, 24, L(PINK));
      for (const x of [5, 20]) c.rect(x, 20, x + 2, 22, u ? LAMP : C.glassLight);
      c.rect(10, 21, 17, 22, DARK);
      c.rect(11, 20, 16, 20, DARK);
      c.rect(2, 25, 25, 26, C.steel);
      c.col(2, 12, 14, C.steel);
      c.col(25, 12, 14, C.steel);
      c.poly([[11, 6], [16, 6], [14, 2], [13, 2]], hex('#a8855c'));
      c.oval(10, 0, 17, 4, PINK);
      c.row(0, 12, 14, L(PINK));
      drip(c, 10, 5, 3, PINK);
      drip(c, 17, 5, u ? 9 : 2, PINK);
      if (u) {
        dots(c, PINK, [20, 0, 23, -2]);
        drip(c, 7, 7, 5, PINK);
      }
      tyreEnd(c, 3, 27, b, 5);
      tyreEnd(c, 20, 27, b, 5);
      c.row(27, 8, 19, DARK);
    },
  });

  T('suburban-school-bus-short', 'large short yellow school bus stop arm children at the windows door open empty', {
    w: 28, h: 30, solid: true, base: 'side', um: [0, 0, 6],
    sw: 48,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 5, 37, 22, BUSY);
      c.row(4, 4, 35, BUSY);
      c.row(4, 4, 35, L(BUSY));
      c.col(2, 5, 22, L(BUSY));
      c.poly([[38, 13], [44, 14], [46, 16], [46, 22], [38, 22]], BUSY);
      c.row(13, 38, 43, L(BUSY));
      c.row(15, 2, 37, DARK);
      c.row(22, 2, 46, DARK);
      txt(c, 19, 16, 'BUS', DARK);
      for (const x of [4, 11, 18, 25]) {
        pane(c, x, 7, x + 5, 13, false);
        /* small heads, all facing out */
        if (!u) {
          c.rect(x + 2, 10, x + 4, 13, hex('#1a1c22'));
          c.set(x + 3, 11, hex('#8a8a80'));
        }
      }
      c.rect(32, 7, 36, 21, u ? DARK : hex('#22303a'));
      c.frame(31, 6, 37, 22, D(BUSY));
      if (u) {
        c.row(18, 32, 36, C.iron);
        c.row(20, 32, 36, C.iron);
        c.rect(32, 7, 33, 21, mix(BUSY, 0.7));
        dots(c, REDL, [3, 5, 36, 5]);
        dots(c, hex('#e86a5a'), [2, 3, 37, 3]);
      } else {
        c.col(34, 7, 21, D(BUSY));
        dots(c, hex('#7a2a26'), [3, 5, 36, 5]);
      }
      c.rect(45, 17, 46, 18, u ? LAMP : C.glassLight);
      c.rect(44, 21, 47, 22, C.iron);
      for (const x of [11, 40]) {
        c.oval(x - 5, b - 9, x + 5, b, DARK);
        wheel(c, x, b - 4, 4, C.ironDark);
      }
      c.row(23, 17, 34, DARK);
    },
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 5, 24, 22, BUSY);
      c.row(4, 5, 22, L(BUSY));
      c.rect(6, 5, 21, 7, DARK);
      for (const x of [7, 19]) c.rect(x, 6, x + 1, 6, u ? REDL : hex('#7a2a26'));
      c.rect(11, 6, 16, 6, hex('#8a6a2a'));
      c.rect(5, 9, 22, 14, GLASSD);
      c.col(13, 9, 14, BUSY);
      c.line(7, 13, 10, 10, mix(C.glass, 0.9));
      if (!u) {
        c.rect(16, 11, 18, 14, hex('#1a1c22'));
        c.set(17, 12, hex('#8a8a80'));
      }
      c.rect(5, 16, 22, 22, BUSY);
      c.row(16, 5, 22, L(BUSY));
      c.rect(10, 17, 17, 20, DARK);
      for (let x = 11; x <= 16; x += 2) c.col(x, 17, 20, C.iron);
      for (const x of [5, 20]) c.rect(x, 18, x + 2, 20, u ? LAMP : C.glassLight);
      c.rect(2, 22, 25, 23, C.iron);
      c.row(22, 2, 25, C.steel);
      c.col(2, 10, 12, C.ironDark);
      c.col(25, 10, 12, C.ironDark);
      tyreEnd(c, 3, 24, b, 5);
      tyreEnd(c, 20, 24, b, 5);
      c.row(24, 8, 19, DARK);
      if (u) {
        /* the stop arm swung out */
        c.row(12, 26, 27, C.iron);
        pat(c, 27, 9, ['.rrr.', 'rrrrr', 'rwwwr', 'rrrrr', '.rrr.'], { r: MAILR, w: C.white });
      }
    },
  });

  T('suburban-moving-truck', 'large moving truck removal van boxes someone moving out in a hurry ramp', {
    w: 28, h: 32, solid: true, base: 'side', um: [0, 0, 0],
    sw: 48,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 31, 23, BOXW);
      c.row(3, 2, 31, L(BOXW));
      c.col(2, 3, 23, L(BOXW));
      c.col(31, 4, 23, D(BOXW));
      c.rect(2, 16, 31, 18, CABO);
      txt(c, 5, 8, 'MOVERS', hex('#5a5648'), { sp: 0 });
      for (let x = 8; x < 31; x += 8) c.col(x, 4, 6, mix(BOXW, 0.9));
      c.poly([[33, 11], [40, 11], [43, 16], [46, 17], [46, 23], [33, 23]], CABO);
      c.row(11, 33, 40, L(CABO));
      c.poly([[35, 12], [39, 12], [42, 16], [35, 16]], GLASSD);
      c.line(36, 15, 38, 13, mix(C.glass, 0.9));
      c.col(34, 17, 22, D(CABO));
      c.col(41, 17, 22, D(CABO));
      c.rect(45, 19, 46, 20, C.glassLight);
      c.rect(44, 23, 47, 24, C.iron);
      c.row(24, 2, 44, DARK);
      for (const x of [9, 38]) {
        c.oval(x - 5, b - 9, x + 5, b, DARK);
        wheel(c, x, b - 4, 4, C.steel);
      }
      if (u) {
        /* boxes and a lamp left on the kerb */
        box(c, 15, b - 7, 22, b);
        box(c, 23, b - 5, 29, b, false);
        box(c, 17, b - 12, 22, b - 8, false);
        c.col(26, b - 13, b - 6, C.brass);
        c.poly([[24, b - 14], [28, b - 14], [29, b - 11], [23, b - 11]], C.cream);
        c.rect(35, 12, 40, 22, DARK);
        c.rect(40, 12, 41, 22, L(CABO));
        c.rect(36, 18, 38, 21, hex('#4a3a34'));
      }
    },
    f(c, u) {
      /* seen from behind */
      const b = c.h - 2;
      c.rect(2, 3, 25, 23, BOXW);
      c.row(3, 2, 25, L(BOXW));
      c.col(2, 3, 23, L(BOXW));
      if (u) {
        c.rect(4, 5, 23, 22, DARK);
        c.rect(4, 5, 23, 6, C.steel);
        box(c, 5, 15, 11, 22);
        box(c, 6, 9, 10, 14, false);
        box(c, 17, 17, 22, 22, false);
        c.rect(12, 12, 16, 22, hex('#6a4a5a'));
        c.row(12, 12, 16, hex('#8a6276'));
        c.poly([[6, 23], [21, 23], [24, b], [3, b]], C.steel);
        for (let y = 25; y < b; y += 2) c.row(y, 5, 22, C.iron);
      } else {
        c.rect(4, 5, 23, 22, mix(BOXW, 0.88));
        for (let y = 6; y <= 22; y += 2) c.row(y, 4, 23, D(BOXW));
        c.rect(12, 20, 15, 21, C.iron);
        c.rect(13, 14, 15, 17, C.brass);
        c.set(14, 16, DARK);
      }
      for (const x of [2, 24]) c.rect(x, 20, x + 1, 22, hex('#7a2a26'));
      c.rect(2, 23, 25, 24, C.iron);
      if (!u) c.row(23, 2, 25, C.steel);
      tyreEnd(c, 3, 25, b, 5);
      tyreEnd(c, 20, 25, b, 5);
      if (!u) c.row(25, 8, 19, DARK);
    },
  });

  T('suburban-mail-truck', 'large mail truck post van white blue red stripes delivery parcels postman gone', {
    w: 24, h: 28, solid: true, base: 'side', um: [0, 0, 0],
    sw: 44,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 4, 36, 21, BOXW);
      c.row(4, 3, 35, L(BOXW));
      c.col(2, 5, 21, L(BOXW));
      c.clear(2, 4);
      c.clear(36, 4);
      c.rect(37, 13, 42, 21, BOXW);
      c.row(13, 37, 41, L(BOXW));
      c.rect(2, 15, 42, 16, MAILB);
      c.row(17, 2, 42, MAILR);
      pane(c, 31, 6, 35, 13, false);
      /* the envelope */
      c.rect(6, 7, 13, 12, MAILB);
      c.line(6, 7, 9, 10, C.white);
      c.line(13, 7, 10, 10, C.white);
      /* the sliding door */
      c.rect(22, 6, 28, 20, u ? DARK : mix(BOXW, 0.92));
      c.frame(21, 5, 29, 21, D(BOXW));
      if (u) {
        for (const y of [10, 15]) c.row(y, 22, 28, C.iron);
        box(c, 23, 7, 25, 9, false);
        box(c, 25, 12, 28, 14, false);
        box(c, 22, 17, 25, 20, false);
        c.rect(15, 6, 21, 20, mix(BOXW, 0.84));
        c.rect(15, 15, 21, 16, D(MAILB));
        /* dropped on the road */
        box(c, 24, b - 3, 28, b, true);
        c.rect(30, b, 33, b, C.white);
        c.rect(18, b, 21, b, C.paper);
        dots(c, AMBER, [1, 18, 43, 18]);
      } else {
        pane(c, 23, 7, 27, 12, false);
        c.set(27, 15, C.steel);
        c.rect(22, 15, 28, 16, MAILB);
        c.row(17, 22, 28, MAILR);
      }
      c.rect(41, 18, 42, 19, C.glassLight);
      c.rect(41, 21, 43, 22, C.iron);
      c.row(22, 2, 40, DARK);
      for (const x of [9, 34]) {
        c.oval(x - 4, b - 7, x + 4, b, DARK);
        wheel(c, x, b - 3, 3, C.steel);
      }
    },
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 4, 21, 21, BOXW);
      c.row(4, 3, 20, L(BOXW));
      c.clear(2, 4);
      c.clear(21, 4);
      c.rect(4, 6, 19, 13, GLASSD);
      c.line(6, 12, 9, 8, mix(C.glass, 0.9));
      c.rect(2, 15, 21, 16, MAILB);
      c.row(17, 2, 21, MAILR);
      for (const x of [3, 18]) c.rect(x, 18, x + 2, 20, u ? LAMP : C.glassLight);
      c.rect(8, 19, 15, 20, DARK);
      c.rect(1, 21, 22, 22, C.steel);
      c.col(1, 8, 10, C.ironDark);
      c.col(22, 8, 10, C.ironDark);
      for (const x of [3, 17]) c.rect(x, 23, x + 3, b, TYRE);
      c.row(23, 7, 16, DARK);
      if (u) {
        dots(c, AMBER, [2, 14, 21, 14]);
        c.rect(13, 9, 16, 13, hex('#22303a'));
        c.rect(18, b - 2, 21, b, CARD);
      } else {
        c.rect(13, 8, 16, 13, hex('#22303a'));
        c.rect(13, 8, 16, 9, MAILB);
      }
    },
  });

  /* ---------- the house front ---------- */
  T('suburban-garage-door-double', 'garage door double up and over white panels drive car inside tail lights', {
    w: 46, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 44, b, hex('#8a8474'));
      c.row(1, 1, 44, hex('#a8a290'));
      c.rect(1, 1, 44, 3, VINYL);
      c.rect(3, 5, 42, b, u ? DARK : GARAGE);
      if (u) {
        c.rect(3, 5, 42, 7, GARAGE);
        c.row(7, 3, 42, D(GARAGE));
        /* a car backed in, the engine ticking */
        c.rect(12, 15, 33, b - 3, hex('#2a2e36'));
        c.poly([[14, 15], [16, 10], [29, 10], [31, 15]], hex('#2a2e36'));
        c.rect(17, 11, 28, 14, hex('#1a1c22'));
        for (const x of [12, 31]) c.rect(x, 17, x + 2, 19, REDL);
        c.rect(19, b - 6, 26, b - 5, hex('#55584f'));
        for (const x of [13, 29]) c.rect(x, b - 2, x + 3, b, hex('#141218'));
        dots(c, hex('#7a2a26'), [11, 18, 34, 18, 12, 20, 33, 20]);
        c.rect(5, b - 8, 8, b, hex('#4a3a34'));
        c.rect(37, 9, 40, 12, hex('#3a3a44'));
        smoke(c, 15, b - 2, 5, hex('#55555f'), 3);
      } else {
        for (let y = 5; y <= b; y += 7) {
          c.row(y, 3, 42, L(GARAGE));
          c.row(y + 6, 3, 42, D(GARAGE));
          for (let x = 5; x < 40; x += 10) c.frame(x, y + 2, x + 7, y + 4, mix(GARAGE, 0.9));
        }
        c.rect(21, b - 3, 24, b - 2, C.steel);
        c.row(b, 3, 42, hex('#3a3830'));
        /* an oil stain creeping out */
        c.row(b, 17, 24, hex('#2a2428'));
      }
      c.rect(21, 1, 24, 2, C.ironDark);
      c.set(22, 3, u ? LAMP : C.bone);
      c.set(23, 3, u ? LAMP : C.bone);
    },
    sw: 8, sum: [0, 0, 10],
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 1, 5, b, hex('#8a8474'));
      c.rect(2, 1, 5, 3, VINYL);
      if (u) {
        c.rect(6, 5, 15, 6, GARAGE);
        c.row(7, 6, 15, D(GARAGE));
        c.set(6, 3, LAMP);
      } else {
        c.col(6, 5, b, GARAGE);
        c.set(6, 3, C.bone);
      }
    },
  });

  T('suburban-front-door-wreath', 'front door red with a wreath brass knocker letterbox welcome ajar dark hall', {
    w: 22, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 20, b, VINYL);
      c.row(1, 1, 20, L(VINYL));
      c.col(20, 1, b, D(VINYL));
      c.rect(3, 3, 18, b, u ? DARK : DOORR);
      const door = (x0, x1) => {
        c.rect(x0, 3, x1, b, DOORR);
        c.col(x0, 3, b, L(DOORR));
        c.col(x1, 3, b, D(DOORR));
      };
      if (u) {
        /* ajar: the hall beyond, a light far inside */
        door(3, 10);
        panel(c, 5, 22, 8, 34, D(DOORR));
        c.rect(14, 8, 16, 11, hex('#6e5a2e'));
        c.set(15, 9, WARM);
        c.rect(11, b - 1, 18, b, hex('#3a2e30'));
        /* the wreath fell */
        ring(c, 13.5, b - 3.5, 2.5, WREATH);
        dots(c, MAILR, [12, b - 5, 15, b - 2]);
        c.set(9, 20, C.brass);
      } else {
        door(3, 18);
        panel(c, 5, 22, 10, 34, D(DOORR));
        panel(c, 12, 22, 16, 34, D(DOORR));
        c.rect(6, 5, 15, 8, GLASSD);
        c.col(10, 5, 8, DOORR);
        ring(c, 10.5, 14.5, 4, WREATH);
        ring(c, 10.5, 14.5, 3, hex('#4f6b3c'));
        dots(c, MAILR, [8, 11, 13, 12, 7, 16, 12, 18, 10, 19]);
        c.rect(10, 18, 11, 20, MAILR);
        c.rect(8, 27, 13, 28, C.brass);
        c.set(17, 21, C.brass);
        c.set(17, 22, D(C.brass));
      }
      c.rect(1, b, 20, b, hex('#8a8474'));
    },
    sw: 8, sum: [0, 0, 8],
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 1, 5, b, VINYL);
      if (u) {
        c.rect(6, 3, 12, b, mix(DOORR, 0.85));
        c.col(12, 3, b, D(DOORR));
        panel(c, 7, 22, 11, 34, D(DOORR));
        c.rect(7, 5, 11, 8, GLASSD);
        c.set(7, 21, C.brass);
        c.rect(13, b - 1, 14, b, WREATH);
      } else {
        c.col(6, 3, b, DOORR);
        c.rect(6, 12, 6, 17, WREATH);
        c.set(7, 14, WREATH);
        c.set(6, 21, C.brass);
      }
    },
  });

  T('suburban-mailbox-post', 'mailbox on a post letter box red flag kerb letters nobody collects', {
    w: 10, h: 26, solid: true, base: 'side', sum: [0, 0, 0], um: [0, 0, 4],
    sw: 18,
    s(c, u) {
      const b = c.h - 2,
        M = hex('#4a5a6e');
      c.rect(8, 11, 9, b, C.woodLight);
      c.col(9, 11, b, C.wood);
      c.rect(3, 5, 14, 10, M);
      c.row(4, 4, 13, M);
      c.row(3, 5, 12, L(M));
      c.row(4, 4, 13, L(M));
      c.row(10, 3, 14, D(M));
      txt(c, 5, 5, '13', C.bone, { sp: 0 });
      if (u) {
        /* flag up, door down, a wad of letters sticking out */
        c.col(11, 0, 5, MAILR);
        c.rect(11, 0, 13, 1, MAILR);
        c.col(14, 5, 10, DARK);
        c.rect(15, 10, 17, 10, D(M));
        c.rect(14, 6, 16, 8, C.white);
        c.row(7, 14, 16, C.paper);
        c.rect(12, b, 15, b, C.white);
        c.set(11, b - 1, C.paper);
      } else {
        c.rect(10, 6, 13, 6, MAILR);
        c.rect(12, 6, 13, 7, MAILR);
        c.col(14, 5, 10, L(M));
      }
      grass(c, 5, 12, b, 3, LAWN, 2);
    },
    f(c, u) {
      const b = c.h - 2,
        M = hex('#4a5a6e');
      c.rect(4, 11, 5, b, C.woodLight);
      c.col(5, 11, b, C.wood);
      c.rect(2, 5, 7, 10, u ? DARK : M);
      c.row(4, 3, 6, M);
      c.row(3, 3, 6, L(M));
      c.col(2, 5, 10, M);
      c.col(7, 5, 10, D(M));
      if (u) {
        c.rect(3, 6, 6, 8, C.white);
        c.row(7, 3, 6, C.paper);
        c.rect(2, 11, 7, 12, D(M));
        c.col(8, 0, 6, MAILR);
        c.rect(8, 0, 10, 1, MAILR);
        c.rect(6, b, 9, b, C.white);
      } else {
        c.set(4, 6, C.brass);
        c.rect(8, 6, 8, 7, MAILR);
      }
      grass(c, 2, 7, b, 3, LAWN, 2);
    },
  });

  {
    const pickets = (c, x0, x1, b, miss = []) => {
      for (let x = x0, i = 0; x + 2 <= x1; x += 4, i++) {
        if (miss.includes(i)) continue;
        c.rect(x, 4, x + 2, b, VINYL);
        c.col(x, 4, b, L(VINYL));
        c.col(x + 2, 4, b, D(VINYL));
        c.set(x + 1, 3, VINYL);
        c.clear(x, 4);
        c.clear(x + 2, 4);
      }
    };
    T('suburban-picket-fence-white', 'white picket fence section garden boundary neat pickets broken through', {
      w: 34, h: 18, solid: true,
      f(c, u) {
        const b = c.h - 2;
        for (const y of [7, 12]) {
          c.rect(1, y, 32, y + 1, mix(VINYL, 0.8));
          c.row(y, 1, 32, mix(VINYL, 0.92));
        }
        pickets(c, 1, 33, b, u ? [3, 4] : []);
        if (u) {
          c.clearRect(13, 7, 20, 8);
          c.line(12, b, 17, b - 1, VINYL);
          c.line(15, 13, 19, b, D(VINYL));
          c.rect(21, 4, 23, 6, MAILR);
          dots(c, C.blood, [21, 7, 22, 9, 14, b]);
        }
        grass(c, 1, 32, b, 5, LAWN, 2);
      },
      sw: 6,
      s(c, u) {
        const b = c.h - 2;
        c.rect(2, 4, 3, b, mix(VINYL, 0.9));
        c.col(2, 4, b, VINYL);
        c.set(2, 3, VINYL);
        for (const y of [7, 12]) c.rect(4, y, 4, y + 1, mix(VINYL, 0.8));
        if (u) {
          c.set(4, 5, MAILR);
          c.row(b, 4, 5, VINYL);
        }
        c.set(1, b, LAWN);
      },
    });
    T('suburban-picket-gate', 'white picket garden gate latch path open swinging', {
      w: 22, h: 20, solid: true,
      f(c, u) {
        const b = c.h - 2;
        for (const x of [1, 18]) {
          c.rect(x, 2, x + 2, b, VINYL);
          c.col(x, 2, b, L(VINYL));
          c.col(x + 2, 2, b, D(VINYL));
          c.rect(x - 0, 1, x + 2, 1, mix(VINYL, 0.9));
        }
        if (u) {
          /* swung towards us on its hinges */
          c.rect(4, 6, 7, b, VINYL);
          c.col(4, 6, b, L(VINYL));
          c.col(7, 6, b, D(VINYL));
          c.col(8, 7, b, mix(VINYL, 0.7));
          c.rect(8, b, 17, b, hex('#8a8474'));
          dots(c, C.iron, [16, 10]);
        } else {
          for (const y of [8, 14]) c.rect(4, y, 17, y + 1, mix(VINYL, 0.8));
          for (let x = 4; x <= 15; x += 4) {
            c.rect(x, 6 - (x === 8 || x === 12 ? 1 : 0), x + 2, b - 1, VINYL);
            c.col(x, 6, b - 1, L(VINYL));
            c.col(x + 2, 6, b - 1, D(VINYL));
          }
          c.rect(15, 10, 18, 10, C.iron);
        }
        grass(c, 0, 3, b, 5, LAWN, 2);
        grass(c, 18, 21, b, 6, LAWN, 2);
      },
      sw: 6, sum: [0, 0, 14],
      s(c, u) {
        const b = c.h - 2;
        c.rect(2, 2, 3, b, mix(VINYL, 0.9));
        c.col(2, 2, b, VINYL);
        c.row(1, 2, 3, mix(VINYL, 0.9));
        if (u) {
          for (const y of [8, 14]) c.rect(4, y, 17, y + 1, mix(VINYL, 0.8));
          for (let x = 4; x <= 15; x += 4) {
            c.rect(x, 6, x + 2, b - 1, VINYL);
            c.col(x + 2, 6, b - 1, D(VINYL));
          }
        } else c.rect(4, 6, 4, b - 1, VINYL);
      },
    });
  }

  T('suburban-hedge-clipped', 'clipped privet hedge box hedge neat garden boundary hole torn through', {
    w: 36, h: 22, solid: true, m: [0, 2, 0], um: [0, 2, 0], sm: [0, 2, 0], sum: [0, 2, 0],
    f(c, u) {
      const b = c.h - 2;
      hedge(c, 1, 3, 34, b, HEDGE, 3);
      c.clear(1, 3);
      c.clear(34, 3);
      for (const x of [6, 17, 28]) c.rect(x, b - 1, x + 1, b, C.woodDark);
      if (u) {
        c.oval(12, 8, 22, b + 2, hex('#182018'));
        dots(c, hex('#4f6b3c'), [11, 12, 23, 11, 12, 17, 22, 16, 15, 7, 19, 8]);
        dots(c, C.white, [16, 13, 18, 13]);
        dots(c, HEDGE, [10, b, 24, b, 25, b - 1]);
      } else {
        /* the shears left in it */
        c.line(22, 2, 25, 6, C.steel);
        c.line(26, 2, 23, 6, C.steel);
        c.rect(21, 0, 22, 1, MAILR);
        c.rect(26, 0, 27, 1, MAILR);
      }
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2;
      hedge(c, 1, 3, 10, b, HEDGE, 5);
      c.clear(1, 3);
      c.clear(10, 3);
      c.rect(5, b - 1, 6, b, C.woodDark);
      if (u) dots(c, hex('#182018'), [10, 10, 10, 11, 10, 12, 10, 13, 9, 12, 10, 14, 10, 15]);
      else {
        c.col(5, 1, 3, C.steel);
        c.rect(5, 0, 6, 0, MAILR);
      }
    },
  });

  T('suburban-for-sale-sign', 'for sale sign estate agent board on a post front lawn sold sticker', {
    w: 24, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 4, b, VINYL);
      c.col(3, 2, b, L(VINYL));
      c.rect(3, 3, 21, 4, VINYL);
      c.row(3, 3, 21, L(VINYL));
      for (const x of [8, 19]) c.col(x, 5, 6, C.iron);
      c.rect(6, 7, 21, 20, C.white);
      c.rect(6, 7, 21, 9, MAILB);
      c.frame(6, 7, 21, 20, mix(C.white, 0.8));
      txt(c, 10, 11, 'FOR', MAILB);
      txt(c, 8, 16, 'SALE', MAILR, { sp: 0 });
      if (u) {
        c.rect(5, 11, 22, 19, MAILR);
        c.row(11, 5, 22, hex('#c05a50'));
        txt(c, 7, 13, 'SOLD', C.white);
      }
      grass(c, 1, 7, b, 4, LAWN, 3);
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 4, b, VINYL);
      c.col(3, 2, b, L(VINYL));
      c.col(5, 7, 20, C.white);
      if (u) c.rect(6, 11, 6, 17, MAILR);
      c.set(2, b, LAWN);
      c.set(5, b, LAWN);
    },
  });

  T('suburban-basketball-hoop-drive', 'basketball hoop on a pole driveway backboard net ball stuck', {
    w: 20, h: 58, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, b - 3, 13, b, hex('#2a2c32'));
      c.row(b - 3, 6, 13, hex('#484c56'));
      c.rect(9, 16, 10, b - 4, C.iron);
      c.col(9, 16, b - 4, C.steel);
      c.rect(2, 2, 17, 14, C.white);
      c.frame(2, 2, 17, 14, MAILR);
      c.frame(7, 7, 12, 12, MAILR);
      c.rect(6, 13, 13, 13, hex('#b05a2e'));
      const net = (y1) => {
        for (let y = 14; y <= y1; y++) for (let x = 6 + ((y - 14) >> 1); x <= 13 - ((y - 14) >> 1); x++) if ((x + y) % 2) c.set(x, y, C.bone);
      };
      if (u) {
        net(16);
        c.oval(7, 9, 12, 14, hex('#b05a2e'));
        c.line(7, 12, 12, 11, DARK);
        c.col(9, 9, 14, DARK);
        dots(c, C.bone, [7, 17, 8, 19, 12, 17]);
        c.line(3, 4, 6, 8, hex('#8a8a80'));
      } else net(19);
      c.speckle(2, 2, 17, 14, hex('#b9b6a8'), 12, 3);
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 3, 8, b, hex('#2a2c32'));
      c.rect(4, 16, 5, b - 4, C.iron);
      c.col(4, 16, b - 4, C.steel);
      c.rect(5, 2, 6, 14, C.white);
      c.col(6, 2, 14, MAILR);
      c.line(5, 16, 5, 9, C.iron);
      c.row(13, 7, 13, hex('#b05a2e'));
      for (let y = 14; y <= (u ? 16 : 19); y++) for (let x = 8 + ((y - 14) >> 1); x <= 13 - ((y - 14) >> 1); x++) if ((x + y) % 2) c.set(x, y, C.bone);
      if (u) {
        c.oval(8, 9, 13, 14, hex('#b05a2e'));
        c.col(10, 9, 14, DARK);
      }
    },
  });

  {
    const bin = (c, x, b, col, open, num) => {
      c.poly([[x, 6], [x + 9, 6], [x + 8, b - 1], [x + 1, b - 1]], col);
      c.line(x, 6, x + 1, b - 1, L(col));
      c.rect(x + 2, 10, x + 2, b - 3, mix(col, 0.85));
      c.rect(x + 7, 10, x + 7, b - 3, mix(col, 0.85));
      if (num) txt(c, x + 3, 11, num, C.bone, { sp: 0 });
      c.rect(x + 1, b, x + 2, b, TYRE);
      c.rect(x + 7, b, x + 8, b, TYRE);
      if (open) {
        c.rect(x, 5, x + 9, 6, DARK);
        c.rect(x - 1, -2, x + 10, -1, D(col));
        c.rect(x, -3, x + 9, -3, col);
        c.col(x + 9, -1, 5, D(col));
      } else {
        c.rect(x - 1, 4, x + 10, 5, D(col));
        c.row(4, x - 1, x + 10, col);
        c.row(3, x + 1, x + 8, col);
      }
    };
    T('suburban-wheelie-bins-pair', 'two wheelie bins rubbish and recycling by the kerb collection day lid up something inside', {
      w: 26, h: 24, solid: true, um: [0, 5, 0], sum: [0, 5, 0],
      f(c, u) {
        const b = c.h - 2;
        bin(c, 2, b, BING, false, '13');
        bin(c, 14, b, BINB, u, '');
        if (u) {
          c.rect(15, 2, 22, 5, hex('#2a2c32'));
          c.oval(16, 0, 21, 4, hex('#2a2c32'));
          c.line(17, 2, 16, 4, hex('#484c56'));
          /* a hand over the rim */
          c.rect(21, 4, 22, 7, C.flesh);
          c.set(22, 8, C.flesh);
          dots(c, C.paper, [12, b, 25, b]);
        }
      },
      sw: 14,
      s(c, u) {
        const b = c.h - 2,
          col = BINB;
        c.poly([[2, 6], [11, 6], [10, b - 1], [3, b - 1]], mix(col, 0.9));
        c.line(2, 6, 3, b - 1, col);
        c.rect(8, b - 2, 11, b, TYRE);
        c.set(9, b - 1, C.steel);
        c.rect(11, 7, 12, 8, D(col));
        if (u) {
          c.rect(2, 5, 11, 6, DARK);
          c.rect(11, -3, 12, 5, D(col));
          c.oval(4, 0, 9, 4, hex('#2a2c32'));
          c.rect(3, 4, 4, 7, C.flesh);
        } else {
          c.rect(1, 4, 12, 5, D(col));
          c.row(4, 1, 12, col);
          c.row(3, 3, 10, col);
        }
      },
    });
  }

  T('suburban-newspaper-stack-paperboy', "paper boy's stack of newspapers bundle tied with string kerb undelivered headline", {
    w: 20, h: 14, solid: false, um: [0, 0, 6],
    f(c, u) {
      const b = c.h - 2;
      const n = u ? 3 : 5;
      for (let i = 0; i < n; i++) {
        const y = b - 1 - i * 2;
        c.rect(2, y, 16, y + 1, i % 2 ? C.paper : C.white);
        c.row(y + 1, 2, 16, C.parchment);
        dots(c, C.slate, [4, y, 7, y, 11, y, 14, y]);
      }
      const top = b - 1 - (n - 1) * 2;
      if (u) {
        /* one opened out beside it */
        c.rect(17, b - 2, 25, b, C.white);
        c.col(21, b - 2, b, C.parchment);
        c.row(b - 2, 18, 20, DARK);
        scribble(c, 22, b - 2, 24, b, C.slate, 2);
        c.rect(18, b - 1, 20, b, hex('#6a6a70'));
        c.line(3, top - 1, 6, top - 3, hex('#a8904e'));
        c.row(b, 0, 3, hex('#a8904e'));
      } else {
        c.col(6, top, b, hex('#a8904e'));
        c.col(12, top, b, hex('#a8904e'));
        c.row(top, 3, 9, DARK);
        c.set(9, top - 1, hex('#a8904e'));
      }
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2;
      const n = u ? 3 : 5;
      for (let i = 0; i < n; i++) {
        const y = b - 1 - i * 2;
        c.rect(2, y, 9, y + 1, i % 2 ? C.paper : C.white);
        c.row(y + 1, 2, 9, C.parchment);
      }
      if (u) c.rect(8, b, 11, b, C.white);
      else c.col(5, b - 9, b, hex('#a8904e'));
    },
  });

  T('suburban-neighbourhood-watch-sign', 'neighbourhood watch sign on a pole eye we are watching street warning', {
    w: 16, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(7, 14, 8, b, C.steel);
      c.col(8, 14, b, C.iron);
      c.rect(2, 2, 13, 14, hex('#b8963a'));
      c.frame(2, 2, 13, 14, DARK);
      /* the eye: shut, then open */
      if (u) {
        c.oval(4, 4, 11, 9, C.white);
        c.oval(6, 5, 9, 8, hex('#3d5a6e'));
        c.rect(7, 6, 8, 7, DARK);
        c.set(7, 6, C.white);
      } else {
        c.line(4, 6, 7, 8, DARK);
        c.line(8, 8, 11, 6, DARK);
        dots(c, DARK, [5, 9, 7, 10, 9, 10, 10, 9]);
      }
      c.row(11, 4, 11, DARK);
      c.row(12, 5, 10, DARK);
      grass(c, 5, 10, b, 3, LAWN, 2);
    },
    sw: 6,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 14, 3, b, C.steel);
      c.col(3, 14, b, C.iron);
      c.rect(2, 2, 2, 14, hex('#b8963a'));
      c.col(3, 2, 14, DARK);
      if (u) c.set(4, 6, C.white);
      c.set(1, b, LAWN);
    },
  });
};
