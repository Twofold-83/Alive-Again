/* env-basement, second half: what is hidden down there. Part of tools/big/env-city.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, txt, scribble, wheel, ring } = X;
  const { bricks, planks, hazard, cobweb, tins, bottles, litter, flame, smoke, pool } = X;
  const { TYRE, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, BLUEL, CARD, CARDD, BAG, DIRTW, WATER, WATERL, SMOKE, POLE, DARK } = X;
  setCat('env-basement', 'Basement');

  const VOID = hex('#0e0c12'),
    HESS = hex('#8a7a58'),
    BRICKO = hex('#5a3a34'),
    BRICKN = hex('#7a4a3c'),
    LIMEW = hex('#d6d2c4'),
    GALV = hex('#8a9096');
  const eyes = (c, x, y, gap = 3) => {
    c.set(x, y, C.white);
    c.set(x + gap, y, C.white);
  };

  /* ---------- the floor ---------- */
  T('floor-hatch-iron-ring', 'hatch in the floor trapdoor iron ring cellar below steps open', {
    w: 28, h: 9, solid: false, um: [0, 16, 0], sum: [0, 16, 0],
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 26, b, C.iron);
      if (u) {
        c.rect(2, 3, 25, b - 1, VOID);
        c.col(9, 3, b - 1, C.woodDark);
        c.col(18, 3, b - 1, C.woodDark);
        c.row(5, 9, 18, C.wood);
        dots(c, hex('#6e5a2e'), [12, b - 1, 15, b - 1, 13, b - 2]);
        planks(c, 2, -13, 25, 1, mix(C.wood, 0.7), 6);
        c.frame(1, -14, 26, 2, C.iron);
        for (const y of [-10, -3]) c.row(y, 2, 25, C.woodDark);
        c.rect(13, -7, 14, -5, C.steel);
      } else {
        planks(c, 2, 3, 25, b - 1, C.wood, 6);
        c.row(3, 2, 25, C.woodLight);
        for (const x of [5, 21]) c.rect(x, 2, x + 1, 4, C.ironDark);
        ring(c, 13.5, 5, 1.6, C.steel);
      }
    },
    sw: 20,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 18, b, C.iron);
      if (u) {
        c.rect(3, 3, 17, b - 1, VOID);
        c.row(5, 3, 17, C.wood);
        c.rect(1, -14, 2, 2, mix(C.wood, 0.7));
        c.col(1, -14, 2, C.iron);
        c.set(3, -6, C.steel);
      } else {
        planks(c, 2, 3, 17, b - 1, mix(C.wood, 0.9), 5);
        c.row(3, 2, 17, C.woodLight);
        c.rect(9, 4, 10, 5, C.steel);
      }
    },
  });
  {
    const shovelUp = (c, x, yt, yb) => {
      c.col(x, yt + 2, yb - 3, C.woodLight);
      c.rect(x - 1, yt, x + 1, yt + 1, C.wood);
      c.set(x, yt + 1, VOID);
      c.rect(x - 1, yb - 3, x + 1, yb, C.steel);
      c.col(x - 1, yb - 3, yb, L(C.steel));
    };
    T('floor-hole-dug-shovel', 'hole dug in the cellar floor grave earth mound shovel wrapped bundle', {
      w: 34, h: 18, solid: true,
      f(c, u) {
        const b = c.h - 2;
        c.oval(2, b - 4, 23, b + 1, CONCD);
        c.oval(4, b - 3, 21, b, VOID);
        dots(c, CONC, [2, b - 1, 5, b - 4, 13, b - 5, 20, b - 4, 23, b - 1]);
        c.poly([[20, b], [23, b - 6], [28, b - 8], [32, b]], C.earth);
        c.line(23, b - 6, 28, b - 8, L(C.earth));
        dots(c, D(C.earth), [24, b - 3, 28, b - 4, 30, b - 1, 26, b - 1]);
        dots(c, L(C.earth), [25, b - 5, 29, b - 2]);
        if (u) {
          c.rect(6, b - 4, 19, b - 2, C.white);
          c.row(b - 5, 8, 17, C.white);
          c.row(b - 2, 6, 19, C.ash);
          for (const x of [9, 13, 17]) c.col(x, b - 5, b - 2, C.straw);
          c.set(6, b - 4, VOID);
          c.set(19, b - 4, VOID);
          dots(c, LIMEW, [5, b - 1, 11, b - 1, 20, b - 1, 15, b]);
          c.line(21, b - 7, 31, b - 3, C.woodLight);
          c.rect(31, b - 3, 32, b - 1, C.steel);
        } else shovelUp(c, 27, 1, b - 6);
      },
      sw: 22,
      s(c, u) {
        const b = c.h - 2;
        c.oval(1, b - 4, 14, b + 1, CONCD);
        c.oval(3, b - 3, 12, b, VOID);
        c.poly([[11, b], [13, b - 6], [17, b - 8], [20, b]], C.earth);
        c.line(13, b - 6, 17, b - 8, L(C.earth));
        dots(c, D(C.earth), [14, b - 3, 17, b - 2]);
        if (u) {
          c.oval(4, b - 5, 11, b - 1, C.white);
          c.row(b - 1, 5, 10, C.ash);
          c.col(7, b - 5, b - 1, C.straw);
          c.line(13, b - 7, 19, b - 3, C.woodLight);
        } else shovelUp(c, 16, 1, b - 6);
      },
    });
  }
  T('floor-patch-fresh-cement', 'fresh cement patch in the floor trowel bucket something buried handprint crack', {
    w: 32, h: 12,
    f(c, u) {
      const b = c.h - 2,
        WET = hex('#9a9890');
      c.poly([[2, b], [4, b - 2], [20, b - 2], [23, b]], WET);
      c.row(b - 2, 5, 19, L(WET));
      dots(c, CONCD, [3, b, 22, b, 12, b - 2]);
      c.poly([[24, 3], [30, 3], [29, b], [25, b]], GALV);
      c.row(3, 24, 30, L(GALV));
      c.col(25, 4, b, L(GALV));
      c.row(6, 25, 29, D(GALV));
      c.line(23, 2, 27, 0, C.iron);
      c.line(27, 0, 31, 2, C.iron);
      dots(c, WET, [26, 4, 28, 5, 27, 8]);
      if (u) {
        c.line(4, b, 10, b - 2, DARK);
        c.line(10, b - 2, 14, b, DARK);
        c.line(14, b, 21, b - 1, DARK);
        pat(c, 15, b - 3, ['f.f', 'fff', '.f.'], { f: hex('#a08f8c') });
        c.set(16, b - 4, hex('#a08f8c'));
        dots(c, CONC, [8, b - 3, 12, b - 3]);
      } else {
        c.rect(8, b - 3, 12, b - 3, C.steel);
        c.rect(13, b - 4, 15, b - 3, C.wood);
        c.set(7, b - 2, C.steel);
      }
    },
    sw: 18,
    s(c, u) {
      const b = c.h - 2,
        WET = hex('#9a9890');
      c.poly([[1, b], [3, b - 2], [9, b - 2], [11, b]], WET);
      c.row(b - 2, 4, 8, L(WET));
      c.poly([[11, 3], [16, 3], [15, b], [12, b]], GALV);
      c.row(3, 11, 16, L(GALV));
      c.line(10, 2, 13, 0, C.iron);
      c.line(13, 0, 17, 2, C.iron);
      if (u) {
        c.line(2, b, 6, b - 2, DARK);
        c.line(6, b - 2, 10, b, DARK);
        c.rect(6, b - 4, 7, b - 3, hex('#a08f8c'));
      } else c.rect(4, b - 3, 7, b - 3, C.steel);
    },
  });
  {
    const SK = hex('#b5ae98');
    const sack = (c, x, y, w, name) => {
      c.rect(x, y, x + w - 1, y + 5, SK);
      c.row(y, x, x + w - 1, L(SK));
      c.col(x + w - 1, y, y + 5, D(SK));
      c.row(y + 5, x, x + w - 1, D(SK));
      c.clear(x, y);
      c.clear(x + w - 1, y);
      c.rect(x + 1, y + 4, x + w - 2, y + 4, hex('#4f6470'));
      if (name) txt(c, x + 1, y, name, hex('#4f6470'));
    };
    T('lime-sacks-pile', 'sacks of lime quicklime paper bags cellar white powder slit open', {
      w: 26, h: 18, solid: true,
      f(c, u) {
        const b = c.h - 2;
        sack(c, 1, b - 5, 12);
        sack(c, 13, b - 5, 12);
        sack(c, 4, b - 12, 17);
        c.rect(5, b - 11, 19, b - 7, SK);
        txt(c, 5, b - 11, 'LIME', hex('#34465a'));
        dots(c, LIMEW, [2, b, 12, b, 23, b]);
        if (u) {
          c.rect(12, b - 12, 16, b - 10, VOID);
          c.poly([[12, b - 10], [16, b - 10], [20, b], [8, b]], LIMEW);
          c.line(13, b - 10, 10, b, C.white);
          dots(c, C.ash, [14, b - 5, 16, b - 2, 12, b - 3]);
          c.rect(18, b - 3, 20, b - 2, C.steel);
          c.rect(21, b - 4, 23, b - 3, C.wood);
          pat(c, 3, b - 4, ['w.w', 'www', '.w.'], { w: C.white });
        } else c.row(b - 13, 8, 12, LIMEW);
      },
      sw: 14,
      s(c, u) {
        const b = c.h - 2;
        sack(c, 1, b - 5, 11);
        sack(c, 2, b - 12, 9);
        if (u) {
          c.poly([[9, b - 10], [11, b - 10], [12, b], [7, b]], LIMEW);
          c.set(10, b - 11, VOID);
        }
      },
    });
  }

  /* ---------- kept in ---------- */
  {
    const bars = (c, x0, x1, y0, y1) => {
      for (let x = x0; x <= x1; x += 2) c.col(x, y0, y1, C.iron);
      c.frame(x0, y0, x1, y1, C.steel);
      c.row((y0 + y1) >> 1, x0, x1, C.iron);
    };
    T('dog-cage-wire', 'wire dog cage crate kennel blanket bowl door open empty', {
      w: 28, h: 22, solid: true, um: [0, 0, 8], sum: [0, 0, 6],
      f(c, u) {
        const b = c.h - 2;
        c.rect(2, b - 1, 25, b, hex('#2a2a36'));
        if (u) {
          c.rect(15, b - 3, 25, b - 2, hex('#6a4a48'));
          c.rect(22, b - 2, 32, b, hex('#6a4a48'));
          dots(c, hex('#8a6a60'), [24, b - 1, 28, b, 30, b - 1]);
          c.rect(5, b - 2, 9, b - 2, GALV);
          c.row(b - 3, 6, 8, GALV);
          bars(c, 2, 13, 2, b - 2);
          c.rect(14, 3, 25, b - 2, hex('#15131a'));
          c.frame(13, 2, 25, b - 2, C.steel);
          c.rect(15, b - 3, 25, b - 2, hex('#6a4a48'));
          c.rect(26, 2, 31, b - 2, VOID);
          c.clearRect(26, 2, 31, b - 4);
          for (const x of [27, 29, 31]) c.col(x, 3, b - 4, C.iron);
          c.frame(26, 2, 32, b - 3, C.steel);
          c.line(15, 6, 17, 10, C.bone);
          c.line(17, 5, 19, 9, C.bone);
          c.line(19, 6, 20, 9, C.bone);
        } else {
          c.rect(4, b - 3, 16, b - 2, hex('#6a4a48'));
          c.row(b - 3, 5, 15, hex('#8a6a60'));
          c.rect(19, b - 3, 23, b - 2, GALV);
          c.row(b - 3, 20, 22, hex('#4a4038'));
          bars(c, 2, 25, 2, b - 2);
          c.frame(13, 3, 24, b - 3, C.steel);
          c.rect(23, 9, 25, 10, C.brass);
        }
      },
      sw: 18,
      s(c, u) {
        const b = c.h - 2;
        c.rect(2, b - 1, 15, b, hex('#2a2a36'));
        c.rect(4, b - 3, 12, b - 2, hex('#6a4a48'));
        bars(c, 2, 15, 2, b - 2);
        if (u) {
          bars(c, 16, 21, 2, b - 3);
          c.rect(13, b - 2, 20, b, hex('#6a4a48'));
        } else c.rect(16, 9, 16, 10, C.brass);
      },
    });
  }
  T('wall-ring-shackle-bowl', 'iron ring in the wall chain shackle manacle bowl prisoner kept unlocked', {
    w: 20, h: 20,
    f(c, u) {
      const b = c.h - 2;
      c.rect(8, 1, 11, 4, C.ironDark);
      dots(c, C.steel, [8, 1, 11, 1, 8, 4, 11, 4]);
      ring(c, 9.5, 6.5, 2, C.iron);
      const path = [[9, 9], [9, 10], [10, 11], [10, 12], [11, 13], [12, 14], [13, 15], [14, b - 2], [15, b - 1]];
      path.forEach(([x, y], i) => c.set(x, y, i % 2 ? C.steel : C.iron));
      c.rect(2, b - 2, 7, b, DIRTW);
      c.row(b - 2, 1, 8, C.white);
      c.row(b, 3, 6, D(DIRTW));
      if (u) {
        c.line(14, b, 16, b - 3, C.iron);
        c.line(17, b - 3, 19, b, C.iron);
        c.set(16, b, C.iron);
        c.rect(11, b, 12, b, C.brass);
        c.set(10, b, C.brass);
        dots(c, hex('#6a4a38'), [3, b - 3, 9, b, 10, b - 1]);
        dots(c, C.blood, [15, b - 1, 18, b - 1]);
      } else {
        ring(c, 16, b - 2, 2, C.iron);
        c.set(16, b - 4, C.steel);
        c.row(b - 3, 3, 6, hex('#6a4a38'));
      }
    },
    sw: 9,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 2, 4, C.ironDark);
      c.rect(3, 5, 4, 8, C.iron);
      for (let y = 9; y <= b - 3; y++) c.set(4 + ((y / 3) | 0) % 2, y, y % 2 ? C.steel : C.iron);
      if (u) {
        c.row(b, 3, 7, C.iron);
        c.set(5, b - 1, C.blood);
      } else c.rect(4, b - 2, 6, b, C.iron);
      if (!u) c.set(5, b - 1, VOID);
    },
  });
  T('chair-cobwebbed-ropes', 'wooden chair covered in cobwebs cellar cut ropes someone was tied', {
    w: 14, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2,
        W = C.wood;
      for (const x of [2, 10]) {
        c.rect(x, 2, x + 1, b, W);
        c.col(x, 2, b, C.woodLight);
      }
      c.rect(2, 2, 11, 4, W);
      c.row(2, 2, 11, C.woodLight);
      for (const x of [5, 8]) c.col(x, 5, 11, C.woodDark);
      c.rect(1, 12, 12, 14, C.woodLight);
      c.row(14, 1, 12, C.woodDark);
      c.row(b - 4, 3, 10, C.woodDark);
      if (u) {
        for (const y of [6, 8]) {
          c.row(y, 2, 4, C.straw);
          c.row(y, 9, 11, C.straw);
        }
        c.col(4, 9, 11, C.straw);
        c.col(9, 9, 13, C.straw);
        c.row(b - 6, 2, 3, C.straw);
        c.row(b - 6, 10, 11, C.straw);
        c.col(12, b - 6, b - 2, C.straw);
        c.row(b, 4, 8, C.straw);
        c.rect(5, 12, 8, 13, hex('#5a3a2a'));
        c.set(7, 15, hex('#5a3a2a'));
      } else {
        cobweb(c, 3, 5, 1, 1, 6);
        cobweb(c, 10, 15, -1, 1, 6);
        cobweb(c, 3, 15, 1, 1, 4);
        dots(c, C.ash, [6, 12, 9, 12, 12, 11, 1, 11]);
      }
    },
    sw: 13,
    s(c, u) {
      const b = c.h - 2,
        W = C.wood;
      c.rect(2, 2, 3, b, W);
      c.col(2, 2, b, C.woodLight);
      c.rect(2, 12, 10, 14, C.woodLight);
      c.row(14, 2, 10, C.woodDark);
      c.rect(9, 15, 10, b, W);
      c.row(b - 4, 4, 8, C.woodDark);
      c.set(4, 3, C.woodDark);
      c.set(4, 7, C.woodDark);
      if (u) {
        c.row(6, 1, 5, C.straw);
        c.row(8, 1, 4, C.straw);
        c.col(5, 8, 11, C.straw);
        c.row(b - 6, 8, 11, C.straw);
        c.col(11, b - 6, b - 1, C.straw);
      } else {
        cobweb(c, 4, 15, 1, 1, 5);
        cobweb(c, 4, 4, 1, 1, 6);
      }
    },
  });
  T('shrine-photo-candles', 'shrine little table framed photograph candles dried flowers lace remembrance lit', {
    w: 22, h: 26, solid: true, um: [0, 2, 0], sum: [0, 2, 0],
    f(c, u) {
      const b = c.h - 2;
      legs(c, [3, 17], 16, b, C.woodDark, 2);
      c.rect(2, 13, 19, 14, C.wood);
      c.rect(2, 13, 19, 13, C.white);
      for (let x = 2; x <= 19; x++) c.col(x, 14, 15 + (x % 3 === 0 ? 2 : x % 3 === 1 ? 1 : 0), x % 3 === 0 ? C.ash : C.white);
      c.rect(8, 4, 13, 12, C.brass);
      c.row(4, 8, 13, L(C.brass));
      c.rect(9, 5, 12, 11, hex('#8a7a5c'));
      c.rect(10, 6, 11, 8, hex('#c9b99a'));
      c.row(6, 10, 11, hex('#4a3a2c'));
      c.rect(9, 9, 12, 11, hex('#3a3026'));
      for (const [x, yt] of [[5, 7], [16, 9]]) {
        c.col(x, yt, 11, C.bone);
        c.rect(x - 1, 12, x + 1, 12, C.brass);
        if (u) {
          c.set(x, yt - 1, C.flame);
          c.set(x, yt - 2, C.flameLight);
          c.set(x, yt - 3, C.flameLight);
          c.set(x + 1, yt + 1, C.white);
        } else c.set(x, yt - 1, C.black);
      }
      c.rect(1, 9, 3, 12, mix(C.glassLight, 0.75));
      dots(c, C.rust, [1, 6, 3, 5, 2, 7]);
      dots(c, C.mustard, [2, 5, 1, 8]);
      c.col(2, 7, 9, hex('#5a5a3a'));
      dots(c, C.wine, [14, 12, 15, 12, 18, 12]);
      if (u) c.rect(10, 6, 11, 8, hex('#e0d0b0'));
      if (u) c.row(6, 10, 11, hex('#4a3a2c'));
    },
    sw: 13,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [2, 9], 16, b, C.woodDark, 2);
      c.rect(1, 13, 11, 14, C.white);
      for (let x = 1; x <= 11; x++) c.col(x, 14, 15 + (x % 3 === 0 ? 2 : 0), x % 3 === 0 ? C.ash : C.white);
      c.line(5, 4, 7, 12, C.brass);
      c.line(6, 4, 8, 12, hex('#8a7a5c'));
      c.col(3, 7, 11, C.bone);
      c.set(3, 12, C.brass);
      if (u) {
        c.set(3, 6, C.flame);
        c.set(3, 5, C.flameLight);
      } else c.set(3, 6, C.black);
      c.rect(9, 10, 10, 12, mix(C.glassLight, 0.75));
      dots(c, C.rust, [9, 8, 10, 7]);
    },
  });
  T('twin-tub-washer-old', 'old twin tub washing machine enamel lids grey water hose cellar', {
    w: 28, h: 22, solid: true, um: [0, 8, 0], sum: [0, 8, 0],
    f(c, u) {
      const b = c.h - 2,
        E = hex('#8fa0a0');
      c.rect(1, 5, 24, b - 1, E);
      c.col(1, 5, b - 1, L(E));
      c.row(b - 1, 1, 24, D(E));
      c.rect(2, 6, 23, 9, mix(E, 0.8));
      dots(c, DARK, [5, 7, 6, 8, 5, 8, 6, 7, 17, 7, 18, 8, 17, 8, 18, 7]);
      c.rect(10, 7, 13, 8, C.steel);
      c.col(12, 10, b - 2, D(E));
      c.speckle(1, 10, 24, b - 1, C.rust, 34, 3);
      legs(c, [2, 22], b, b, C.ironDark, 2);
      c.col(25, 6, b - 3, C.ash);
      c.set(26, 6, C.ash);
      c.row(b - 3, 25, 26, C.ash);
      c.col(26, 7, 12, C.ash);
      c.rect(13, 3, 24, 4, L(E));
      c.row(4, 13, 24, D(E));
      if (u) {
        c.rect(1, -5, 12, 2, mix(E, 0.8));
        c.frame(1, -5, 12, 2, L(E));
        c.rect(2, 3, 11, 4, hex('#5a6a6a'));
        dots(c, C.white, [3, 3, 5, 4, 8, 3, 10, 3]);
        c.rect(6, 3, 8, 9, hex('#7a4a5a'));
        c.col(7, 10, 12, hex('#7a4a5a'));
        c.set(7, 13, hex('#5a6a6a'));
        c.set(7, b, hex('#5a6a6a'));
      } else {
        c.rect(1, 3, 12, 4, L(E));
        c.row(4, 1, 12, D(E));
        c.set(6, 2, C.steel);
        c.set(18, 2, C.steel);
      }
    },
    sw: 15,
    s(c, u) {
      const b = c.h - 2,
        E = hex('#8fa0a0');
      sideBox(c, 1, 5, 12, b - 1, E);
      c.speckle(1, 10, 12, b - 1, C.rust, 34, 3);
      legs(c, [2, 10], b, b, C.ironDark, 2);
      if (u) {
        c.rect(1, -5, 2, 4, mix(E, 0.8));
        c.col(1, -5, 4, L(E));
        c.rect(3, 3, 12, 4, hex('#5a6a6a'));
        c.rect(12, 3, 13, 9, hex('#7a4a5a'));
      } else {
        c.rect(1, 3, 12, 4, L(E));
        c.row(4, 1, 12, D(E));
      }
    },
  });
  T('tin-bath-hung-nail', 'tin bath hung on a nail galvanised tub cellar taken down filled water', {
    w: 16, h: 34, um: [0, 0, 20], sum: [0, 0, 12],
    f(c, u) {
      const b = c.h - 2;
      c.set(7, 1, C.iron);
      c.set(8, 1, C.iron);
      if (u) {
        c.poly([[2, b - 8], [33, b - 8], [31, b], [4, b]], GALV);
        c.rect(1, b - 9, 34, b - 8, L(GALV));
        c.row(b - 8, 3, 32, hex('#5a7078'));
        dots(c, WATERL, [8, b - 8, 16, b - 8, 26, b - 8]);
        c.line(2, b - 7, 4, b, L(GALV));
        for (const x of [12, 23]) c.col(x, b - 6, b - 1, D(GALV));
        c.rect(0, b - 7, 1, b - 6, C.iron);
        c.rect(34, b - 7, 35, b - 6, C.iron);
        smoke(c, 12, b - 10, 5, C.ash, 2);
        smoke(c, 22, b - 10, 4, C.ash, 5);
        c.rect(29, b - 11, 33, b - 9, C.white);
        return;
      }
      c.oval(2, 3, 13, b - 1, GALV);
      c.oval(3, 4, 12, b - 2, L(GALV));
      c.oval(4, 5, 12, b - 2, mix(GALV, 0.7));
      c.oval(5, 7, 11, b - 4, mix(GALV, 0.8));
      c.line(6, 9, 6, 20, GALV);
      c.rect(7, 2, 8, 3, C.iron);
      c.rect(7, b - 1, 8, b, C.iron);
      c.speckle(3, 5, 12, b - 2, C.rust, 20, 2);
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2;
      c.set(1, 1, C.iron);
      if (u) {
        c.poly([[2, b - 8], [17, b - 8], [16, b], [3, b]], GALV);
        c.rect(1, b - 9, 18, b - 8, L(GALV));
        c.oval(6, b - 7, 13, b - 5, C.iron);
        c.oval(7, b - 6, 12, b - 6, GALV);
        smoke(c, 9, b - 10, 5, C.ash, 2);
        return;
      }
      c.poly([[1, 3], [3, 3], [5, 6], [5, b - 4], [3, b - 1], [1, b - 1]], GALV);
      c.col(1, 3, b - 1, L(GALV));
      c.col(4, 6, b - 4, mix(GALV, 0.7));
      c.set(2, 2, C.iron);
    },
  });
  T('gas-meter-coin-slot', 'coin gas meter shilling in the slot dials pipes cellar broken open coins', {
    w: 15, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2,
        M = hex('#6a6e70'),
        LEAD = hex('#5a5c66');
      for (const x of [3, 10]) c.rect(x, 1, x + 1, 5, LEAD);
      c.rect(6, 16, 7, b, LEAD);
      c.rect(2, 5, 12, 15, M);
      c.row(5, 2, 12, L(M));
      c.col(2, 5, 15, L(M));
      c.rect(3, 7, 9, 9, C.bone);
      for (const x of [4, 6, 8]) c.set(x, 8, DARK);
      c.set(u ? 7 : 5, 7, DARK);
      c.rect(10, 7, 11, 8, C.brass);
      c.set(12, 8, C.brass);
      c.speckle(2, 5, 12, 15, C.rust, 16, 2);
      if (u) {
        c.rect(4, 11, 9, 14, VOID);
        c.rect(1, 12, 3, 15, D(M));
        c.col(1, 12, 15, M);
        dots(c, C.brass, [4, b, 9, b, 11, b - 1, 5, 14]);
        c.set(10, 13, C.brass);
      } else {
        c.rect(4, 11, 9, 14, D(M));
        c.row(11, 4, 9, M);
        c.rect(6, 12, 7, 13, C.brass);
      }
    },
    sw: 9,
    s(c, u) {
      const b = c.h - 2,
        M = hex('#6a6e70');
      c.rect(3, 1, 4, 5, hex('#5a5c66'));
      c.rect(3, 16, 4, b, hex('#5a5c66'));
      sideBox(c, 1, 5, 6, 15, M);
      c.rect(7, 7, 7, 8, C.brass);
      if (u) {
        c.rect(7, 11, 8, 14, D(M));
        c.set(7, b, C.brass);
      }
    },
  });
  {
    const DX = hex('#5a6470');
    const box = (c, x, yb, w = 7) => {
      c.rect(x, yb - 6, x + w - 1, yb, CARD);
      c.row(yb - 6, x, x + w - 1, L(CARD));
      c.row(yb - 4, x, x + w - 1, CARDD);
      c.rect(x + 2, yb - 3, x + w - 3, yb - 1, C.paper);
      c.set(x + 3, yb - 2, C.slate);
    };
    T('shelving-steel-boxes', 'steel shelving archive boxes files cellar records box fallen photographs', {
      w: 30, h: 40, solid: true,
      f(c, u) {
        const b = c.h - 2;
        c.rect(3, 2, 26, b, hex('#1e1c24'));
        [10, 20, 30, b].forEach((y, r) => {
          c.rect(1, y, 28, y, L(DX));
          if (y < b) c.row(y + 1, 3, 26, DARK);
          for (let i = 0; i < 3; i++) {
            if (u && r === 1 && i === 1) continue;
            if (r === 3 && i === 2) tins(c, 20, 25, y - 1, 6, 5, 1);
            else box(c, 4 + i * 8, y - 1);
          }
        });
        for (const x of [1, 27]) {
          c.rect(x, 1, x + 1, b, DX);
          c.col(x, 1, b, L(DX));
          for (let y = 3; y < b; y += 3) c.set(x + 1, y, DARK);
        }
        c.row(1, 1, 28, L(DX));
        cobweb(c, 26, 3, -1, 1, 5);
        if (u) {
          c.poly([[9, b], [9, b - 5], [16, b - 7], [18, b - 1], [17, b]], CARD);
          c.line(9, b - 5, 16, b - 7, L(CARD));
          c.rect(11, b - 4, 14, b - 2, VOID);
          for (const [x, y] of [[18, b], [21, b - 1], [15, b]]) {
            c.rect(x, y - 1, x + 2, y, C.paper);
            c.set(x + 1, y - 1, hex('#8a7a5c'));
          }
          c.rect(22, b, 25, b, C.white);
        }
      },
      sw: 11,
      s(c, u) {
        const b = c.h - 2;
        c.rect(1, 1, 2, b, DX);
        c.col(1, 1, b, L(DX));
        c.rect(8, 1, 9, b, DX);
        c.row(1, 1, 9, L(DX));
        [10, 20, 30, b].forEach((y, r) => {
          c.row(y, 1, 9, L(DX));
          if (!(u && r === 1)) {
            c.rect(3, y - 7, 7, y - 1, mix(CARD, 0.88));
            c.row(y - 7, 3, 7, CARD);
          }
        });
        if (u) c.rect(10, b - 1, 12, b, C.paper);
      },
    });
  }
  {
    const TR = hex('#8a2a26');
    T('tool-chest-red-drawers', 'red tool chest roll cabinet drawers mechanic cellar drawer pulled out', {
      w: 20, h: 26, solid: true, sum: [0, 0, 5],
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 3, 18, b - 2, TR);
        c.col(1, 3, b - 2, L(TR));
        c.row(3, 1, 18, L(TR));
        c.row(2, 2, 17, D(TR));
        for (let i = 0; i < 5; i++) {
          const y = 5 + i * 4;
          if (u && i === 1) {
            c.rect(2, y, 17, y + 1, VOID);
            dots(c, C.steel, [4, y, 7, y, 8, y, 12, y]);
            dots(c, C.wood, [5, y, 13, y, 14, y]);
            c.rect(1, y + 2, 18, y + 5, L(TR));
            c.row(y + 5, 1, 18, D(TR));
            c.row(y + 3, 5, 14, C.steel);
            i++;
            continue;
          }
          c.rect(2, y, 17, y + 2, mix(TR, 0.9));
          c.row(y + 3, 2, 17, D(TR));
          c.row(y + 1, 5, 14, C.steel);
        }
        c.rect(3, b - 1, 5, b, TYRE);
        c.rect(14, b - 1, 16, b, TYRE);
        dots(c, DARK, [3, 6, 16, 14, 4, 18]);
      },
      sw: 12,
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 3, 9, b - 2, TR);
        c.row(2, 2, 8, D(TR));
        c.rect(2, b - 1, 3, b, TYRE);
        c.rect(7, b - 1, 8, b, TYRE);
        c.rect(4, 8, 6, 9, C.steel);
        if (u) {
          c.rect(10, 9, 14, 12, L(TR));
          c.row(12, 10, 14, D(TR));
          c.set(15, 10, C.steel);
          c.rect(11, 7, 12, 8, C.wood);
          c.set(13, 8, C.steel);
        } else for (let i = 0; i < 5; i++) c.set(10, 6 + i * 4, C.steel);
      },
    });
  }
  T('paraffin-heater-cellar', 'paraffin heater oil stove cellar warmth blue flame lit', {
    w: 13, h: 22, solid: true, um: [0, 3, 0], same: true,
    f(c, u) {
      const b = c.h - 2,
        G = hex('#35503e'),
        CH = hex('#6a6e70');
      c.rect(2, b - 5, 10, b, G);
      c.col(2, b - 5, b, L(G));
      c.row(b - 5, 2, 10, L(G));
      c.set(10, b - 6, C.brass);
      c.rect(3, 5, 9, b - 6, CH);
      c.col(3, 5, b - 6, L(CH));
      c.col(9, 5, b - 6, D(CH));
      c.rect(3, 4, 9, 4, D(CH));
      for (let x = 4; x <= 8; x += 2) c.set(x, 6, u ? AMBER : DARK);
      c.rect(5, 9, 7, 12, u ? hex('#3a4a8a') : DARK);
      if (u) {
        c.rect(5, 11, 7, 12, hex('#6a8ad0'));
        c.set(6, 10, LAMP);
        dots(c, C.ash, [5, 1, 7, -1, 6, 3, 8, 2]);
      }
      c.line(2, 5, 4, 2, C.iron);
      c.line(10, 5, 8, 2, C.iron);
      c.row(2, 4, 8, C.iron);
      c.speckle(2, 5, 10, b, C.rust, 14, 2);
    },
  });
  {
    const SPUD = hex('#7a6248'),
      SPROUT = hex('#c9b8c0');
    T('potato-sacks-sprouting', 'sacks of potatoes sprouting hessian cellar pale shoots tipped over', {
      w: 24, h: 18, solid: true, um: [0, 0, 6], sum: [0, 0, 5],
      f(c, u) {
        const b = c.h - 2;
        c.rect(2, 5, 11, b, HESS);
        c.col(2, 5, b, L(HESS));
        c.col(11, 5, b, D(HESS));
        c.rect(4, 3, 9, 4, HESS);
        c.row(4, 3, 10, C.straw);
        c.clear(2, b);
        c.speckle(2, 5, 11, b, D(HESS), 5, 3);
        c.line(5, 2, 4, -1 + 2, SPROUT);
        c.line(8, 2, 9, 1, SPROUT);
        c.line(11, 9, 13, 6, SPROUT);
        c.set(14, 5, SPROUT);
        c.oval(11, 9, 22, b + 2, HESS);
        c.clearRect(11, b + 1, 22, b + 2);
        c.speckle(11, 9, 22, b, D(HESS), 5, 4);
        c.row(9, 14, 19, L(HESS));
        if (u) {
          c.rect(21, 11, 22, b, VOID);
          for (const [x, y] of [[23, b], [25, b - 1], [27, b], [24, b - 2], [20, b]]) {
            c.rect(x, y - 1, x + 1, y, SPUD);
            c.set(x, y - 1, L(SPUD));
          }
          c.line(26, b - 2, 28, b - 6, SPROUT);
          c.line(24, b - 3, 23, b - 7, SPROUT);
          c.line(28, b - 1, 29, b - 4, SPROUT);
          c.set(22, b - 8, SPROUT);
        } else {
          c.line(17, 9, 18, 5, SPROUT);
          c.line(20, 10, 22, 7, SPROUT);
          c.set(19, 4, SPROUT);
        }
      },
      sw: 13,
      s(c, u) {
        const b = c.h - 2;
        c.rect(2, 5, 10, b, HESS);
        c.col(2, 5, b, L(HESS));
        c.rect(4, 3, 8, 4, HESS);
        c.row(4, 3, 9, C.straw);
        c.speckle(2, 5, 10, b, D(HESS), 5, 3);
        c.line(6, 2, 5, 1, SPROUT);
        c.line(10, 9, 11, 6, SPROUT);
        if (u) {
          c.rect(11, b - 1, 12, b, SPUD);
          c.rect(14, b - 1, 15, b, SPUD);
          c.line(14, b - 2, 15, b - 5, SPROUT);
        }
      },
    });
  }
  {
    const well = (c, u) => {
      const b = c.h - 2;
      bricks(c, 2, 7, 23, b, BRICKO);
      c.col(2, 7, b, L(BRICKO));
      c.col(23, 7, b, D(BRICKO));
      c.rect(1, 5, 24, 6, C.stone);
      c.row(5, 1, 24, C.stoneLight);
      c.speckle(2, 7, 23, b, C.moss, 14, 2);
      if (u) {
        c.rect(3, 4, 22, 5, VOID);
        c.row(5, 5, 20, hex('#16222a'));
        c.rect(18, 2, 24, 3, C.woodPale);
        c.row(3, 18, 24, C.wood);
        c.line(22, 4, 26, b, C.woodPale);
        c.line(23, 4, 27, b, C.wood);
        c.col(9, 5, 5, C.straw);
        c.col(9, 2, 4, C.straw);
        c.line(9, 6, 5, b, C.straw);
        c.rect(3, b - 1, 5, b, C.iron);
        dots(c, WATERL, [12, 6, 13, 7, 14, 6, 12, 8]);
      } else {
        for (const y of [1, 3]) {
          c.rect(1 + (y & 2), y, 23 + (y & 2 ? 1 : 0), y + 1, C.woodPale);
          c.row(y + 1, 1, 24, C.wood);
        }
        for (const x of [8, 16]) c.col(x, 1, 4, C.wood);
        c.rect(11, -1, 15, 0, C.stoneDark);
        c.row(-1, 12, 14, C.stone);
      }
    };
    T('cellar-well-planks', 'old well in the cellar floor brick rim covered with planks stone weight rope', {
      w: 26, h: 16, solid: true, um: [0, 2, 3], m: [0, 2, 0], sm: [0, 2, 0], sum: [0, 2, 3],
      f: well,
      sw: 26,
      s: well,
    });
  }
  T('doorway-bricked-up', 'bricked up doorway fresh bricks walled in sealed hole knocked through hand', {
    w: 26, h: 42, solid: true, sum: [0, 0, 5],
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 24, b, C.stoneDark);
      c.rect(1, 1, 24, 4, C.stone);
      c.row(1, 1, 24, C.stoneLight);
      c.col(1, 1, b, C.stone);
      bricks(c, 4, 5, 21, b, BRICKN, hex('#b0a590'));
      dots(c, hex('#b0a590'), [6, 9, 15, 14, 9, 22, 18, 28, 12, 33]);
      for (const [x, y, n] of [[7, 12, 3], [16, 20, 4], [11, 30, 2]]) c.col(x, y, y + n, hex('#b0a590'));
      if (u) {
        c.poly([[8, 14], [13, 11], [18, 13], [19, 20], [17, 27], [11, 28], [7, 23]], VOID);
        dots(c, VOID, [6, 17, 19, 16, 13, 10, 9, 28, 20, 22]);
        dots(c, D(BRICKN), [7, 14, 18, 12, 19, 26, 10, 29]);
        c.rect(7, 20, 8, 22, hex('#a08f8c'));
        c.set(9, 20, hex('#a08f8c'));
        c.set(9, 22, hex('#a08f8c'));
        eyes(c, 12, 16, 3);
        for (const [x, y] of [[6, b], [11, b], [15, b - 1], [19, b]]) {
          c.rect(x, y - 1, x + 2, y, BRICKN);
          c.row(y - 1, x, x + 2, L(BRICKN));
        }
        dots(c, hex('#b0a590'), [9, b, 14, b, 22, b]);
      } else {
        c.rect(18, b - 3, 22, b, GALV);
        c.row(b - 3, 18, 22, hex('#b0a590'));
        c.line(21, b - 5, 23, b - 9, C.wood);
      }
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 1, 1, 5, b, C.stoneDark);
      c.rect(1, 1, 5, 4, C.stone);
      c.col(5, 5, b, BRICKN);
      if (u) {
        c.col(5, 12, 27, VOID);
        c.rect(6, 20, 6, 21, hex('#a08f8c'));
        c.rect(7, b - 1, 9, b, BRICKN);
        c.rect(10, b, 12, b, BRICKN);
      } else c.rect(6, b - 3, 7, b, GALV);
    },
  });
  T('soil-pipe-hatch', 'cast iron soil pipe drain stack inspection hatch cellar leaking rat tail', {
    w: 12, h: 44, solid: true, um: [0, 0, 6], same: true,
    f(c, u) {
      const b = c.h - 2,
        P = hex('#34343e');
      c.rect(4, 1, 7, b, P);
      c.col(4, 1, b, C.iron);
      c.col(7, 1, b, D(P));
      for (const y of [6, 22, 36]) {
        c.rect(3, y, 8, y + 1, P);
        c.col(3, y, y + 1, C.iron);
      }
      c.rect(1, 12, 3, 13, C.iron);
      c.speckle(3, 1, 8, b, C.rust, 22, 3);
      if (u) {
        c.rect(4, 26, 7, 31, VOID);
        c.line(6, 30, 9, 33, hex('#b08a84'));
        c.set(10, 33, hex('#b08a84'));
        c.col(5, 32, b, hex('#4a4a2e'));
        c.col(6, 32, 38, hex('#4a4a2e'));
        c.row(b, 3, 10, hex('#4a4a2e'));
        c.oval(9, b - 2, 15, b, P);
        dots(c, C.steel, [10, b - 1, 14, b - 1]);
        eyes(c, 5, 27, 1);
      } else {
        c.rect(3, 25, 8, 32, P);
        c.frame(3, 25, 8, 32, C.iron);
        dots(c, C.steel, [4, 26, 7, 26, 4, 31, 7, 31]);
        c.col(5, 33, 37, hex('#4a4a2e'));
      }
    },
  });
  {
    const TARP = hex('#4a5a50');
    T('tarpaulin-bundle-rope', 'long bundle wrapped in tarpaulin tied with rope body shaped shoe sticking out', {
      w: 14, h: 13, solid: true, base: 'side',
      sw: 38,
      s(c, u) {
        const b = c.h - 2;
        c.oval(2, 3, 35, b + 3, TARP);
        c.clearRect(1, b + 1, 36, b + 3);
        c.row(b, 4, 33, D(TARP));
        for (let x = 6; x < 33; x += 5) c.set(x, 4 + (x % 2), L(TARP));
        c.line(5, 5, 12, 4, L(TARP));
        c.line(14, 4, 26, 4, L(TARP));
        for (const x of [14, 20, 25]) c.line(x, 5, x + 2, b, mix(TARP, 0.75));
        for (const x of [8, 16, 23, 30]) if (!(u && x === 30)) c.col(x, 3 + (x === 8 || x === 30 ? 1 : 0), b, C.straw);
        c.rect(4, b - 2, 7, b, mix(TARP, 0.6));
        if (u) {
          c.poly([[28, 4], [35, 6], [35, b], [28, b]], VOID);
          c.clearRect(33, 3, 36, 6);
          c.poly([[27, 3], [30, 5], [29, b], [26, b]], L(TARP));
          c.rect(30, b - 4, 33, b - 2, hex('#3a3a4e'));
          c.rect(33, b - 6, 35, b, hex('#3a2c22'));
          c.col(36, b - 5, b, hex('#2a2018'));
          c.row(b, 28, 35, C.straw);
          c.set(33, b - 6, hex('#5a4638'));
        }
      },
      f(c, u) {
        const b = c.h - 2;
        c.oval(2, 3, 11, b + 1, TARP);
        c.clearRect(1, b + 1, 12, b + 1);
        c.line(4, 4, 8, 3, L(TARP));
        if (u) {
          c.oval(3, 4, 10, b, VOID);
          c.rect(4, 6, 6, b, hex('#3a2c22'));
          c.rect(8, 6, 10, b, hex('#3a2c22'));
          c.row(6, 4, 6, hex('#5a4638'));
          c.row(6, 8, 10, hex('#5a4638'));
          dots(c, hex('#2a2018'), [5, 9, 9, 9]);
          c.row(b, 1, 3, C.straw);
        } else {
          c.col(6, 3, b, C.straw);
          c.row(7, 2, 11, C.straw);
          c.set(6, 7, D(C.straw));
          c.line(4, 9, 5, b, mix(TARP, 0.75));
        }
      },
    });
  }
  T('darkroom-bench-trays', 'darkroom bench developing trays red safelight prints hung to dry photographs faces', {
    w: 34, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2,
        RED = hex('#c8382e');
      c.rect(1, 16, 32, 17, C.wood);
      c.row(16, 1, 32, C.woodLight);
      legs(c, [2, 29], 18, b, C.woodDark, 2);
      c.row(b - 4, 4, 28, C.woodDark);
      bottles(c, 6, 20, b - 5, 6, 4, 1, [hex('#5a3a22'), hex('#4a3020')]);
      c.rect(23, b - 9, 27, b - 5, GALV);
      for (const x of [3, 12, 21]) {
        c.rect(x, 14, x + 7, 15, C.white);
        c.row(14, x + 1, x + 6, u ? hex('#5a2a2a') : hex('#2a3038'));
        c.row(15, x, x + 7, C.ash);
      }
      c.row(3, 1, 26, C.straw);
      for (const [x, i] of [[4, 0], [11, 1], [18, 2]]) {
        c.set(x + 1, 3, C.wood);
        c.rect(x, 4, x + 3, 9, u ? hex('#b9b0a0') : C.white);
        if (u) {
          c.rect(x + 1, 5, x + 2, 7, i === 1 ? hex('#3a3430') : hex('#5a524a'));
          c.row(8, x + 1, x + 2, hex('#3a3430'));
          if (i === 1) c.row(6, x + 1, x + 2, C.white);
        }
      }
      c.col(29, 1, 4, DARK);
      c.poly([[27, 7], [28, 5], [30, 5], [31, 7]], hex('#2a2a36'));
      c.rect(28, 8, 30, 9, u ? RED : hex('#5a2622'));
      if (u) {
        dots(c, hex('#e8605a'), [29, 8]);
        dots(c, mix(RED, 0.8), [27, 10, 31, 10, 29, 11, 26, 9, 32, 9]);
        dots(c, mix(RED, 0.6), [3, 13, 12, 13, 21, 13, 28, 13]);
        c.rect(24, 14, 26, 14, C.steel);
      }
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2,
        RED = hex('#c8382e');
      c.rect(1, 16, 12, 17, C.wood);
      c.row(16, 1, 12, C.woodLight);
      legs(c, [2, 9], 18, b, C.woodDark, 2);
      c.row(b - 4, 4, 9, C.woodDark);
      c.rect(3, 14, 10, 15, C.white);
      c.row(15, 3, 10, C.ash);
      c.col(4, 3, 9, u ? hex('#b9b0a0') : C.white);
      c.set(4, 3, C.straw);
      c.col(8, 1, 4, DARK);
      c.poly([[6, 7], [7, 5], [9, 5], [10, 7]], hex('#2a2a36'));
      c.rect(7, 8, 9, 9, u ? RED : hex('#5a2622'));
      if (u) dots(c, mix(RED, 0.8), [6, 10, 10, 10, 8, 11]);
    },
  });
  T('newspaper-bundles-tied', 'bundles of old newspapers tied with string yellowed cuttings cut out scissors', {
    w: 20, h: 17, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const bundle = (x, y, w, h) => {
        for (let j = 0; j < h; j++) c.row(y + j, x, x + w - 1, j % 2 ? C.parchment : C.paper);
        c.col(x, y, y + h - 1, D(C.parchment));
        c.col(x + (w >> 1), y, y + h - 1, C.straw);
        c.row(y, x, x + w - 1, C.black);
      };
      bundle(1, b - 5, 9, 6);
      bundle(10, b - 6, 9, 7);
      if (u) {
        c.rect(3, b - 8, 16, b - 6, C.paper);
        c.row(b - 8, 3, 16, C.white);
        c.col(9, b - 8, b - 6, C.parchment);
        c.rect(4, b - 7, 6, b - 7, VOID);
        c.rect(11, b - 7, 14, b - 7, VOID);
        scribble(c, 4, b - 6, 15, b - 6, C.slate, 2);
        c.line(13, b - 10, 17, b - 12, C.steel);
        c.line(13, b - 12, 17, b - 10, C.steel);
        c.set(12, b - 9, hex('#8f3b30'));
        c.set(12, b - 13, hex('#8f3b30'));
        dots(c, C.paper, [19, b, 0, b]);
      } else bundle(5, b - 11, 10, 6);
    },
    sw: 13,
    s(c, u) {
      const b = c.h - 2;
      for (let j = 0; j < 6; j++) c.row(b - 5 + j, 1, 11, j % 2 ? C.parchment : C.paper);
      c.col(6, b - 5, b, C.straw);
      c.row(b - 5, 1, 11, C.black);
      if (u) {
        c.rect(2, b - 7, 10, b - 6, C.paper);
        c.set(5, b - 7, VOID);
        c.line(6, b - 9, 9, b - 11, C.steel);
      } else {
        for (let j = 0; j < 6; j++) c.row(b - 11 + j, 2, 10, j % 2 ? C.parchment : C.paper);
        c.col(6, b - 11, b - 6, C.straw);
        c.row(b - 11, 2, 10, C.black);
      }
    },
  });
  T('punchbag-hanging-chain', 'punch bag hanging on a chain leather boxing cellar gym split leaking sand', {
    w: 12, h: 46, um: [0, 0, 4], same: true,
    f(c, u) {
      const b = c.h - 2,
        LE = hex('#5a3a2a'),
        o = u ? 1 : 0;
      c.col(5 + o, 1, 4, C.iron);
      c.line(5 + o, 4, 3 + o, 8, C.steel);
      c.line(6 + o, 4, 8 + o, 8, C.steel);
      c.rect(2 + o, 9, 9 + o, 35, LE);
      c.col(2 + o, 9, 35, L(LE));
      c.col(3 + o, 9, 35, L(LE));
      c.col(9 + o, 9, 35, D(LE));
      c.row(36, 3 + o, 8 + o, D(LE));
      c.row(8, 3 + o, 8 + o, LE);
      for (const y of [16, 27]) c.rect(2 + o, y, 9 + o, y + 1, GALV);
      dots(c, D(LE), [5 + o, 12, 7 + o, 20, 4 + o, 23, 6 + o, 31]);
      c.rect(5 + o, 20, 6 + o, 22, hex('#4a2a22'));
      if (u) {
        const SAND = hex('#b5a47c');
        c.line(7, 29, 9, 33, VOID);
        c.col(9, 33, b, SAND);
        c.set(8, 32, SAND);
        c.poly([[9, b - 3], [5, b], [13, b]], SAND);
        c.col(9, b - 3, b, L(SAND));
        dots(c, C.white, [8, 31, 10, 34]);
      }
    },
  });
  T('damp-patch-mushrooms', 'damp patch on the wall mould pale mushrooms toadstools growing cellar picked', {
    w: 24, h: 17, um: [0, 0, 0],
    f(c, u) {
      const b = c.h - 2,
        DAMP = hex('#3a4438'),
        CAP = hex('#cfc8b4');
      c.poly([[2, b], [3, 8], [7, 4], [13, 2], [18, 5], [21, 10], [22, b]], DAMP);
      c.oval(6, 6, 14, 13, mix(DAMP, 0.8));
      c.oval(13, 9, 19, b, mix(DAMP, 0.85));
      dots(c, C.moss, [4, 11, 8, 13, 17, 14, 12, 5, 9, 4, 19, 8]);
      for (const [x, n] of [[9, 3], [16, 4]]) c.col(x, 13, 13 + n, mix(DAMP, 0.6));
      const sh = [[4, 5, 2], [8, 7, 3], [13, 4, 2], [17, 6, 2], [20, 3, 1]];
      for (const [x, h, r] of sh) {
        c.col(x, b - h + 1, b, hex('#a8a08a'));
        if (u) {
          c.clearRect(x, b - h, x, b - 2);
          c.col(x, b - 1, b, hex('#a8a08a'));
          c.set(x, b - 1, C.white);
        } else {
          c.rect(x - r, b - h, x + r, b - h + 1, CAP);
          c.row(b - h - 1, x - r + 1, x + r - 1, C.white);
          c.row(b - h + 1, x - r, x + r, hex('#6a6456'));
        }
      }
      if (u) {
        c.rect(10, b - 1, 13, b, CAP);
        c.row(b, 10, 13, hex('#8a8272'));
        dots(c, CAP, [2, b, 19, b]);
      }
    },
    sw: 10,
    s(c, u) {
      const b = c.h - 2,
        CAP = hex('#cfc8b4');
      c.poly([[1, b], [1, 3], [3, 6], [3, b]], hex('#3a4438'));
      for (const [x, h, r] of [[4, 6, 2], [7, 4, 1]]) {
        c.col(x, b - (u ? 1 : h - 1), b, hex('#a8a08a'));
        if (!u) {
          c.rect(x - r, b - h, x + r, b - h + 1, CAP);
          c.row(b - h + 1, x - r, x + r, hex('#8a8272'));
        }
      }
      if (u) c.set(8, b, CAP);
    },
  });
};
