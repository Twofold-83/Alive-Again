/* env-suburban, part 2: the back garden — lawn, play things, shed. Part of tools/big/env2-ruin.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, slab, txt, scribble, wheel, rim, ring } = X;
  const { bricks, planks, boards, rust, tins, tin, bottle, litter, flame, fire, smoke, pool, crate, mesh, grass, leaves, hedge, pane, drip } = X;
  const { TYRE, DARK, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, CARD, WATER, WATERL, SMOKE, LAWN, LAWND, HEDGE, VINYL, WARM } = X;
  setCat('env-suburban', 'Suburban');

  const RED = hex('#a8403a'),
    YEL = hex('#b8a03a'),
    POOLB = hex('#4f7a9a'),
    POOLL = hex('#9ab8c2'),
    SWG = hex('#4a6a50'),
    KETTLE = hex('#26242c'),
    GNOMEB = hex('#3d5a8a'),
    FLAM = hex('#c07a88'),
    TURT = hex('#4f7a4a'),
    SHED = hex('#7a5a3c'),
    FELT = hex('#3a3a40'),
    STONE = hex('#9a978e'),
    SOIL = hex('#4a3628'),
    LEAFC = [hex('#a05a2a'), hex('#b8963a'), hex('#84482a'), hex('#6b4630'), hex('#a8403a')];

  T('suburban-lawn-mower-push', 'lawn mower petrol push mower red grass box running clippings sunday', {
    w: 16, h: 22, solid: true, base: 'side', sum: [0, 0, 8],
    sw: 30,
    s(c, u) {
      const b = c.h - 2;
      c.line(11, b - 6, 3, 3, C.steel);
      c.line(12, b - 6, 4, 3, C.iron);
      c.rect(1, 2, 4, 3, DARK);
      /* grass box */
      c.poly([[3, b - 9], [10, b - 8], [10, b - 2], [4, b - 2]], hex('#5a5d54'));
      c.line(3, b - 9, 10, b - 8, hex('#73766c'));
      /* deck and engine */
      c.poly([[10, b - 6], [25, b - 6], [27, b - 3], [10, b - 3]], RED);
      c.row(b - 6, 10, 25, L(RED));
      c.rect(14, b - 11, 20, b - 7, hex('#4a4a52'));
      c.row(b - 11, 14, 20, hex('#6a6a72'));
      c.rect(16, b - 13, 18, b - 12, DARK);
      c.rect(21, b - 9, 22, b - 7, C.steel);
      for (const x of [12, 24]) {
        c.oval(x - 2, b - 4, x + 2, b, TYRE);
        c.set(x, b - 2, C.bone);
      }
      if (u) {
        smoke(c, 22, b - 10, 6, hex('#9a9a94'), 4);
        const r = rnd(5);
        for (let i = 0; i < 16; i++) c.set(28 + ((r() * 9) | 0), b - ((r() * 8) | 0), r() < 0.25 ? RED : r() < 0.5 ? L(LAWN) : LAWN);
        c.row(b, 27, 35, LAWND);
        dots(c, hex('#7a2a26'), [26, b - 3, 27, b - 2]);
      } else grass(c, 26, 29, b, 3, LAWN, 3);
    },
    f(c, u) {
      const b = c.h - 2;
      for (const x of [3, 12]) c.col(x, 3, b - 7, C.steel);
      c.row(2, 3, 12, DARK);
      c.rect(2, b - 6, 13, b - 2, RED);
      c.row(b - 6, 2, 13, L(RED));
      c.rect(5, b - 11, 10, b - 7, hex('#4a4a52'));
      c.row(b - 11, 5, 10, hex('#6a6a72'));
      c.rect(7, b - 13, 8, b - 12, DARK);
      c.rect(1, b - 4, 2, b, TYRE);
      c.rect(13, b - 4, 14, b, TYRE);
      c.row(b - 1, 3, 12, DARK);
      if (u) {
        dots(c, LAWN, [2, b - 8, 13, b - 9, 4, b, 9, b, 11, b - 8]);
        dots(c, RED, [6, b, 12, b]);
        dots(c, hex('#7a2a26'), [5, b - 2, 9, b - 3]);
        smoke(c, 11, b - 12, 5, hex('#9a9a94'), 4);
      }
    },
  });

  T('suburban-sprinkler-lawn', 'lawn sprinkler garden hose spray water arc left running all night', {
    w: 14, h: 8, solid: false, um: [8, 14, 8], same: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 1, 10, b, YEL);
      c.row(b - 1, 3, 10, L(YEL));
      c.rect(6, b - 4, 7, b - 2, C.steel);
      c.rect(4, b - 5, 9, b - 5, C.iron);
      c.row(b, -6, 2, hex('#3f6a52'));
      if (u) {
        for (let i = 1; i < 12; i++) {
          const y = b - 5 - Math.round(12 * Math.sin((i / 12) * Math.PI * 0.62));
          if (i % 2) {
            c.set(4 - i, y + (i > 8 ? (i - 8) * 3 : 0), WATERL);
            c.set(9 + i, y + (i > 8 ? (i - 8) * 3 : 0), WATERL);
          } else {
            c.set(4 - i, y + 1 + (i > 8 ? (i - 8) * 3 : 0), WATER);
            c.set(9 + i, y + 1 + (i > 8 ? (i - 8) * 3 : 0), WATER);
          }
        }
        dots(c, WATERL, [6, b - 9, 7, b - 12, 5, b - 14, 8, b - 16]);
        c.row(b, 11, 20, WATER);
        c.row(b, -7, -3, WATER);
      } else grass(c, 0, 13, b, 4, LAWN, 2);
    },
  });

  T('suburban-garden-hose-reel', 'garden hose reel cart green hose nozzle tap unreeled water running', {
    w: 20, h: 20, solid: true, um: [0, 0, 10],
    f(c, u) {
      const b = c.h - 2,
        H = hex('#3f6a52');
      c.rect(3, 3, 4, b, C.iron);
      c.rect(15, 3, 16, b, C.iron);
      c.row(2, 3, 16, C.steel);
      c.rect(2, b, 5, b, TYRE);
      c.rect(14, b, 17, b, TYRE);
      c.rect(5, 6, 14, 14, u ? C.ironDark : H);
      if (!u) for (let y = 7; y <= 14; y += 2) c.row(y, 5, 14, L(H));
      else {
        c.rect(5, 11, 14, 14, H);
        c.row(11, 5, 14, L(H));
      }
      c.rect(17, 9, 18, 10, C.iron);
      c.set(19, u ? 8 : 11, DARK);
      if (u) {
        /* the hose snaking away, the nozzle spitting */
        c.line(14, 14, 18, b, H);
        for (let x = 18; x <= 26; x++) c.set(x, b - (x % 4 < 2 ? 1 : 0), H);
        c.rect(27, b - 1, 28, b - 1, YEL);
        c.row(b, 24, 29, WATER);
        dots(c, WATERL, [29, b - 1, 28, b]);
      } else {
        c.line(14, 13, 16, 17, H);
        c.rect(15, 17, 16, 18, YEL);
      }
    },
    sw: 12, sum: [0, 0, 4],
    s(c, u) {
      const b = c.h - 2,
        H = hex('#3f6a52');
      c.line(5, 2, 2, b, C.iron);
      c.line(6, 2, 9, b, C.iron);
      ring(c, 5.5, 10, 4, u ? C.ironDark : H);
      if (!u) ring(c, 5.5, 10, 3, L(H));
      c.set(5, 10, C.steel);
      c.set(6, 10, C.steel);
      c.rect(1, b, 3, b, TYRE);
      c.rect(8, b, 10, b, TYRE);
      if (u) {
        c.line(8, 13, 11, b, H);
        c.row(b, 11, 14, H);
      }
    },
  });

  {
    const kettle = (c, u, shelf) => {
      const b = c.h - 2;
      c.line(5, 17, 3, b - 1, C.steel);
      c.line(12, 17, 14, b - 1, C.steel);
      c.col(8, 18, b - 5, C.steel);
      c.rect(2, b - 1, 4, b, TYRE);
      c.rect(13, b - 1, 15, b, TYRE);
      c.rect(6, b - 6, 11, b - 5, C.iron);
      c.oval(2, 6, 15, 19, KETTLE);
      c.rect(2, 12, 15, 12, hex('#4a4852'));
      c.line(4, 9, 6, 7, hex('#4a4852'));
      if (shelf) {
        c.rect(16, 12, 20, 12, C.woodLight);
        c.set(18, 11, RED);
        c.set(19, 11, C.steel);
      }
      if (u) {
        c.clearRect(2, 5, 15, 11);
        c.row(11, 3, 14, C.steel);
        c.rect(4, 10, 8, 10, hex('#7a3a2a'));
        c.rect(10, 10, 13, 10, hex('#8a4a30'));
        dots(c, C.flame, [5, 12, 9, 12, 12, 12]);
        c.row(12, 3, 14, hex('#6a3a2a'));
        dots(c, C.flameLight, [7, 12, 11, 12]);
        smoke(c, 6, 9, 9, hex('#9a9a94'), 3);
        smoke(c, 11, 9, 7, hex('#8a8a86'), 8);
        /* the lid on the grass */
        c.oval(shelf ? 16 : 10, b - 4, shelf ? 22 : 15, b + 3, KETTLE);
        c.clearRect(shelf ? 16 : 10, b + 1, 23, b + 3);
      } else {
        c.rect(8, 4, 9, 5, C.woodDark);
        c.set(8, 6, C.steel);
        c.set(9, 6, C.steel);
      }
    };
    T('suburban-barbecue-kettle', 'kettle barbecue grill black charcoal sausages burning smoke garden party nobody came', {
      w: 22, h: 30, solid: true,
      f: (c, u) => kettle(c, u, true),
      sw: 18,
      s: (c, u) => kettle(c, u, false),
    });
  }

  T('suburban-garden-gnome-fishing', 'garden gnome fishing red hat white beard ornament it turned its head', {
    w: 14, h: 18, solid: false,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[5, 1], [6, 1], [9, 6], [3, 6]], RED);
      c.line(5, 1, 3, 6, L(RED));
      c.rect(4, 7, 8, 9, C.flesh);
      c.rect(3, 9, 9, 12, C.white);
      c.rect(4, 13, 8, 13, C.white);
      c.rect(2, 10, 3, 14, GNOMEB);
      c.rect(9, 10, 10, 14, GNOMEB);
      c.rect(3, 13, 9, b - 2, GNOMEB);
      c.rect(4, 13, 8, 14, C.white);
      c.row(b - 4, 3, 9, hex('#4a3a2a'));
      c.rect(3, b - 1, 5, b, hex('#3a2e26'));
      c.rect(7, b - 1, 9, b, hex('#3a2e26'));
      if (u) {
        /* eyes open now, the rod dropped */
        dots(c, RED, [5, 8, 7, 8]);
        c.row(10, 5, 7, hex('#8a2a26'));
        c.row(b, 10, 13, C.woodLight);
        c.set(10, 14, C.flesh);
      } else {
        c.row(8, 5, 5, DARK);
        c.row(8, 7, 7, DARK);
        c.set(6, 9, hex('#b08a6a'));
        c.line(10, 13, 13, 5, C.woodLight);
        c.col(13, 6, 12, hex('#8a8a80'));
        c.set(13, 13, RED);
      }
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[4, 1], [5, 1], [8, 6], [2, 6]], RED);
      c.line(4, 1, 2, 6, L(RED));
      c.rect(3, 7, 7, 9, C.flesh);
      c.rect(3, 10, 7, b - 2, GNOMEB);
      c.col(3, 10, b - 2, L(GNOMEB));
      c.row(b - 4, 3, 7, hex('#4a3a2a'));
      c.rect(4, b - 1, 8, b, hex('#3a2e26'));
      if (u) {
        c.rect(4, 9, 7, 12, C.white);
        dots(c, RED, [4, 8, 6, 8]);
      } else {
        c.rect(6, 9, 8, 12, C.white);
        c.set(8, 8, C.flesh);
        c.set(6, 8, DARK);
        c.line(8, 13, 11, 6, C.woodLight);
      }
    },
  });

  T('suburban-flamingo-plastic', 'plastic pink flamingo lawn ornament on a wire leg neck snapped', {
    w: 14, h: 26, solid: false,
    f(c, u) {
      const b = c.h - 2;
      c.col(6, 15, b, C.iron);
      c.col(8, 15, b - 3, C.iron);
      c.oval(2, 9, 10, 15, FLAM);
      c.row(9, 4, 8, L(FLAM));
      c.line(2, 12, 0, 14, D(FLAM));
      c.line(5, 13, 8, 12, D(FLAM));
      if (u) {
        c.line(10, 10, 12, 8, FLAM);
        c.line(12, 8, 12, 14, FLAM);
        c.rect(11, 15, 12, 17, FLAM);
        c.set(12, 18, DARK);
        c.set(11, 16, DARK);
        c.set(13, 7, hex('#8a8a80'));
      } else {
        c.line(10, 10, 11, 5, FLAM);
        c.line(11, 5, 9, 2, FLAM);
        c.rect(7, 1, 9, 2, FLAM);
        c.set(8, 1, DARK);
        c.rect(5, 2, 6, 2, C.bone);
        c.set(5, 3, DARK);
      }
      grass(c, 3, 11, b, 3, LAWN, 2);
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2;
      c.col(3, 15, b, C.iron);
      c.oval(1, 9, 5, 15, FLAM);
      c.col(1, 10, 14, L(FLAM));
      if (u) {
        c.col(4, 8, 9, FLAM);
        c.rect(5, 10, 6, 15, FLAM);
        c.set(6, 16, DARK);
      } else {
        c.col(3, 3, 8, FLAM);
        c.rect(2, 1, 4, 2, FLAM);
        c.set(3, 3, C.bone);
        dots(c, DARK, [2, 1, 4, 1]);
      }
      c.set(2, b, LAWN);
    },
  });

  T('suburban-swing-set-frame', 'garden swing set green steel frame two swings one still moving chain broken', {
    w: 44, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [5, 38]) {
        c.line(x, 3, x - 3, b, SWG);
        c.line(x, 3, x + 3, b, D(SWG));
        c.line(x - 1, 3, x - 4, b, L(SWG));
      }
      c.rect(4, 2, 39, 3, SWG);
      c.row(2, 4, 39, L(SWG));
      const seat = (x0, x1, y, col) => {
        c.rect(x0, y, x1, y + 1, col);
        c.row(y, x0, x1, L(col));
      };
      c.col(12, 4, b - 10, C.steel);
      c.col(19, 4, b - 10, C.steel);
      seat(11, 20, b - 9, RED);
      if (u) {
        /* the far swing has snapped; the near one is still going */
        c.col(26, 4, b - 4, C.steel);
        c.col(33, 4, 12, C.steel);
        c.line(26, b - 4, 28, b - 1, RED);
        c.line(27, b - 4, 29, b - 1, D(RED));
        dots(c, C.steel, [33, 13, 30, b, 31, b, 33, b]);
        c.clearRect(11, b - 9, 20, b - 8);
        c.clearRect(12, b - 14, 12, b - 10);
        c.clearRect(19, b - 14, 19, b - 10);
        seat(10, 21, b - 14, RED);
        c.set(11, b - 15, C.steel);
        c.set(20, b - 15, C.steel);
        dots(c, hex('#8a8a80'), [8, b - 13, 23, b - 13, 7, b - 11, 24, b - 11]);
      } else {
        c.col(26, 4, b - 10, C.steel);
        c.col(33, 4, b - 10, C.steel);
        seat(25, 34, b - 9, YEL);
      }
      rust(c, 1, 2, 42, b, 26, 3);
      c.row(b, 12, 19, hex('#6a5a40'));
      c.row(b, 26, 33, hex('#6a5a40'));
      grass(c, 0, 10, b, 3, LAWN, 2);
      grass(c, 35, 43, b, 4, LAWN, 2);
    },
    sw: 22, sum: [0, 0, 6],
    s(c, u) {
      const b = c.h - 2;
      c.line(10, 3, 2, b, SWG);
      c.line(11, 3, 19, b, D(SWG));
      c.line(9, 3, 1, b, L(SWG));
      c.rect(9, 2, 12, 3, SWG);
      c.row(20, 6, 15, SWG);
      if (u) {
        c.line(11, 4, 20, b - 16, C.steel);
        c.rect(20, b - 15, 22, b - 14, RED);
        dots(c, hex('#8a8a80'), [24, b - 16, 25, b - 13]);
        c.col(9, 4, 12, C.steel);
      } else {
        c.col(10, 4, b - 10, C.steel);
        c.rect(9, b - 9, 12, b - 8, RED);
      }
      c.row(b, 8, 13, hex('#6a5a40'));
    },
  });

  T('suburban-slide-plastic', 'garden slide yellow plastic chute ladder child play one shoe left behind', {
    w: 16, h: 30, solid: true, base: 'side',
    sw: 38,
    s(c, u) {
      const b = c.h - 2,
        BL = hex('#4a6a8a');
      /* ladder */
      c.line(3, b, 7, 7, BL);
      c.line(9, b, 11, 7, D(BL));
      for (let i = 1; i < 5; i++) c.row(b - i * 4, 4 + ((i * 4) / 5 | 0), 9 + ((i * 2) / 5 | 0), L(BL));
      c.rect(6, 6, 14, 7, BL);
      c.line(7, 6, 7, 2, BL);
      c.line(13, 6, 13, 2, BL);
      c.row(2, 7, 13, L(BL));
      /* the chute */
      for (let x = 14; x <= 35; x++) {
        const t = (x - 14) / 21,
          y = Math.round(7 + (b - 9) * (t * t * 0.4 + t * 0.6));
        c.col(x, y, y + 2, YEL);
        c.set(x, y - 1, L(YEL));
        c.set(x, y + 2, D(YEL));
      }
      c.rect(33, b - 3, 36, b - 1, YEL);
      c.row(b - 4, 33, 36, L(YEL));
      c.col(34, b, b, D(BL));
      c.line(22, 13, 22, b, D(BL));
      if (u) {
        c.rect(30, b - 1, 32, b, RED);
        c.set(30, b - 2, RED);
        c.row(b - 1, 31, 32, C.white);
        for (let x = 20; x <= 30; x += 3) c.set(x, Math.round(7 + (b - 9) * ((((x - 14) / 21) ** 2) * 0.4 + ((x - 14) / 21) * 0.6)), hex('#6a5a40'));
        c.line(13, 3, 15, 8, hex('#7a3a4a'));
        c.set(15, 9, hex('#7a3a4a'));
      }
      grass(c, 12, 30, b, 3, LAWN, 2);
    },
    f(c, u) {
      const b = c.h - 2,
        BL = hex('#4a6a8a');
      for (const x of [3, 12]) c.col(x, 2, b, D(BL));
      c.row(2, 3, 12, L(BL));
      c.rect(3, 6, 12, 7, BL);
      c.poly([[5, 8], [10, 8], [12, b - 1], [3, b - 1]], YEL);
      c.line(5, 8, 3, b - 1, L(YEL));
      c.line(10, 8, 12, b - 1, D(YEL));
      c.line(7, 9, 7, b - 2, mix(YEL, 1.1));
      c.rect(3, b - 1, 12, b, D(YEL));
      if (u) {
        c.rect(8, b - 2, 10, b - 1, RED);
        c.row(b - 2, 9, 10, C.white);
        dots(c, hex('#6a5a40'), [6, 14, 8, 18, 7, 22]);
        c.line(12, 3, 13, 8, hex('#7a3a4a'));
      }
    },
  });

  T('suburban-paddling-pool', 'inflatable paddling pool blue rings rubber duck summer deflated murky water', {
    w: 34, h: 13, solid: true, um: [0, 0, 0], same: true,
    f(c, u) {
      const b = c.h - 2;
      if (u) {
        c.poly([[2, b], [3, b - 3], [12, b - 2], [20, b - 4], [30, b - 2], [31, b]], POOLB);
        c.line(3, b - 3, 12, b - 2, POOLL);
        c.line(12, b - 2, 20, b - 4, POOLL);
        c.line(14, b - 1, 18, b - 2, D(POOLB));
        c.line(22, b - 3, 26, b - 1, D(POOLB));
        c.row(b, 0, 33, hex('#4a5a4a'));
        c.row(b, 6, 14, hex('#6a7a6a'));
        /* the duck, on its side */
        c.rect(25, b - 1, 27, b, YEL);
        c.set(28, b, hex('#b05a2e'));
        c.set(24, b - 6, C.steel);
      } else {
        for (const [y, col] of [[b - 8, POOLL], [b - 5, POOLB], [b - 2, POOLL]]) {
          c.rect(2, y, 31, y + 2, col);
          c.row(y, 2, 31, L(col));
          c.row(y + 2, 2, 31, D(col));
          c.clear(2, y);
          c.clear(31, y);
          c.clear(2, y + 2);
          c.clear(31, y + 2);
        }
        c.row(b - 9, 4, 29, WATERL);
        c.rect(20, b - 11, 22, b - 10, YEL);
        c.rect(22, b - 12, 23, b - 11, YEL);
        c.set(24, b - 11, hex('#b05a2e'));
        c.set(23, b - 12, DARK);
        c.set(4, b - 4, C.steel);
      }
    },
  });

  T('suburban-trampoline-net', 'trampoline with safety net garden bounce blue pads torn net', {
    w: 40, h: 34, solid: true, same: true,
    f(c, u) {
      const b = c.h - 2,
        N = hex('#55585e');
      for (const x of [3, 14, 25, 36]) {
        c.col(x, 2, b - 10, hex('#3d5a8a'));
        c.set(x, 2, hex('#62749a'));
      }
      mesh(c, 4, 4, 35, b - 11, N);
      c.row(3, 3, 36, N);
      if (u) {
        /* torn outward, the mat split */
        c.clearRect(16, 8, 24, b - 11);
        c.line(15, 8, 13, 16, N);
        c.line(25, 8, 27, 15, N);
        dots(c, N, [14, 18, 13, 20, 27, 17, 28, 19, 20, 7, 18, 9]);
      }
      c.rect(2, b - 10, 37, b - 8, hex('#3d5a8a'));
      c.row(b - 10, 2, 37, hex('#62749a'));
      c.rect(6, b - 10, 33, b - 9, hex('#1e2026'));
      if (u) {
        c.line(18, b - 10, 22, b - 9, hex('#5a5d64'));
        c.rect(19, b - 8, 21, b - 6, hex('#1e2026'));
        c.rect(29, b - 1, 31, b, hex('#a8403a'));
      }
      for (const x of [5, 15, 24, 34]) {
        c.col(x, b - 7, b, C.steel);
        c.row(b, x - 2, x + 2, C.steel);
      }
      for (let x = 7; x <= 32; x += 3) c.set(x, b - 7, C.steel);
      grass(c, 8, 12, b, 3, LAWN, 2);
    },
  });

  T('suburban-sandbox-turtle', 'turtle sandpit green plastic sandbox lid toys bucket spade something buried', {
    w: 30, h: 15, solid: true, um: [0, 6, 0], sum: [0, 6, 0],
    f(c, u) {
      const b = c.h - 2;
      /* head and feet */
      c.oval(1, b - 7, 7, b - 2, L(TURT));
      c.set(3, b - 5, DARK);
      c.set(2, b - 3, D(TURT));
      for (const x of [8, 22]) c.rect(x, b - 1, x + 3, b, L(TURT));
      c.rect(6, b - 4, 27, b - 1, TURT);
      c.row(b - 4, 6, 27, L(TURT));
      c.row(b - 1, 6, 27, D(TURT));
      if (u) {
        c.row(b - 5, 7, 26, hex('#b8a47a'));
        c.rect(7, b - 4, 26, b - 4, hex('#a3906a'));
        /* bucket, spade, a small pale hand */
        c.rect(10, b - 9, 13, b - 5, RED);
        c.row(b - 9, 10, 13, L(RED));
        c.line(16, b - 5, 18, b - 9, YEL);
        c.rect(20, b - 6, 21, b - 5, C.flesh);
        dots(c, C.flesh, [20, b - 7, 22, b - 7]);
        /* lid leaning behind */
        c.poly([[14, b - 6], [20, -4], [28, b - 8], [27, b - 5]], D(TURT));
        c.line(20, -4, 28, b - 8, TURT);
        c.poly([[10, b - 9], [13, b - 9], [13, b - 5], [10, b - 5]], RED);
        c.row(b - 9, 10, 13, L(RED));
      } else {
        c.oval(6, b - 11, 27, b + 2, TURT);
        c.clearRect(6, b - 3, 27, b + 2);
        c.rect(6, b - 4, 27, b - 1, TURT);
        c.row(b - 4, 6, 27, D(TURT));
        c.row(b - 1, 6, 27, D(TURT));
        for (const [x, y] of [[11, b - 8], [16, b - 10], [21, b - 8], [14, b - 6], [19, b - 6]]) c.frame(x, y, x + 3, y + 2, D(TURT));
        c.row(b - 11, 13, 20, L(TURT));
      }
    },
    sw: 20,
    s(c, u) {
      const b = c.h - 2;
      c.oval(6, b - 7, 12, b - 2, L(TURT));
      dots(c, DARK, [8, b - 5, 10, b - 5]);
      c.rect(2, b - 4, 17, b - 1, TURT);
      c.row(b - 1, 2, 17, D(TURT));
      for (const x of [2, 14]) c.rect(x, b, x + 3, b, L(TURT));
      if (u) {
        c.row(b - 5, 3, 16, hex('#b8a47a'));
        c.rect(3, b - 9, 5, b - 6, RED);
        c.col(1, -3, b - 5, D(TURT));
        c.col(2, -3, b - 5, TURT);
        c.oval(6, b - 7, 12, b - 2, L(TURT));
        dots(c, DARK, [8, b - 5, 10, b - 5]);
      } else {
        c.oval(2, b - 11, 17, b + 2, TURT);
        c.clearRect(2, b - 3, 17, b + 2);
        c.rect(2, b - 4, 17, b - 1, TURT);
        c.row(b - 4, 2, 17, D(TURT));
        c.row(b - 11, 6, 13, L(TURT));
        c.oval(6, b - 7, 12, b - 1, L(TURT));
        dots(c, DARK, [8, b - 5, 10, b - 5]);
      }
    },
  });

  T('suburban-doghouse-chain', 'doghouse kennel red roof name board rex chain dog bowl empty broken collar', {
    w: 26, h: 24, solid: true, um: [0, 0, 8],
    f(c, u) {
      const b = c.h - 2,
        ROOF = hex('#7a3a34');
      planks(c, 4, 10, 21, b, hex('#a8855c'), 4);
      c.poly([[1, 11], [12, 2], [13, 2], [24, 11]], ROOF);
      c.line(1, 11, 12, 2, L(ROOF));
      c.line(4, 11, 12, 4, D(ROOF));
      c.line(21, 11, 13, 4, D(ROOF));
      c.poly([[5, 11], [12, 5], [13, 5], [20, 11]], hex('#a8855c'));
      c.rect(9, 14, 16, b, DARK);
      c.rect(10, 13, 15, 13, DARK);
      c.rect(8, 8, 17, 11, C.bone);
      txt(c, 9, 7, 'REX', hex('#4a3a2a'), { sp: 0 });
      c.set(7, 16, C.iron);
      if (u) {
        /* the chain lies slack, the collar torn */
        for (let x = 7; x <= 28; x += 2) c.set(x, b - (x % 4 ? 0 : 1), C.steel);
        c.line(7, 16, 7, b - 1, C.steel);
        c.rect(29, b - 1, 31, b, RED);
        c.set(32, b, C.brass);
        c.rect(22, b - 1, 26, b, C.steel);
        c.row(b, 20, 21, hex('#6a4a34'));
        dots(c, C.blood, [27, b, 30, b - 2]);
      } else {
        c.line(7, 16, 10, b - 2, C.steel);
        c.row(b - 1, 10, 13, C.steel);
        dots(c, hex('#8a8a50'), [12, 17, 14, 17]);
        c.rect(19, b - 2, 24, b, C.steel);
        c.row(b - 2, 20, 23, hex('#6a4a34'));
      }
    },
    sw: 26,
    s(c, u) {
      const b = c.h - 2,
        ROOF = hex('#7a3a34');
      planks(c, 3, 11, 22, b, mix(hex('#a8855c'), 0.9), 4);
      c.rect(1, 3, 24, 10, ROOF);
      c.row(3, 1, 24, L(ROOF));
      for (const y of [6, 9]) c.row(y, 1, 24, D(ROOF));
      for (let x = 4; x < 24; x += 5) c.col(x, 4, 5, D(ROOF));
      for (let x = 2; x < 24; x += 5) c.col(x, 7, 8, D(ROOF));
      c.col(23, 11, b, DARK);
      if (u) {
        c.row(b, 22, 25, C.steel);
      } else {
        c.set(24, b - 1, C.steel);
        c.set(25, b, C.steel);
      }
    },
  });

  T('suburban-garden-shed-wooden', 'garden shed wooden hut tools padlock window cobweb door open dark inside', {
    w: 32, h: 42, solid: true, um: [0, 0, 8],
    f(c, u) {
      const b = c.h - 2;
      planks(c, 3, 10, 28, b, SHED, 3);
      c.poly([[1, 11], [15, 2], [16, 2], [30, 11]], FELT);
      c.line(1, 11, 15, 2, L(FELT));
      c.poly([[5, 11], [15, 5], [16, 5], [26, 11]], SHED);
      for (let x = 7; x < 26; x += 3) c.col(x, 9, 10, D(SHED));
      c.rect(1, 11, 30, 12, D(FELT));
      /* window */
      c.rect(20, 17, 26, 24, GLASSD);
      c.frame(19, 16, 27, 25, C.woodDark);
      c.col(23, 17, 24, C.woodDark);
      dots(c, C.ash, [20, 17, 21, 18, 20, 19, 22, 17, 25, 24]);
      /* door */
      if (u) {
        c.rect(5, 15, 15, b, DARK);
        c.col(8, 16, 30, C.wood);
        c.rect(7, 31, 9, 33, C.steel);
        c.col(12, 17, 28, C.wood);
        for (const x of [11, 13]) c.col(x, 29, 32, C.steel);
        c.row(28, 11, 13, C.steel);
        c.rect(10, 16, 10, 17, hex('#55585e'));
        c.rect(9, 18, 11, 19, WARM);
        dots(c, mix(WARM, 0.6), [8, 20, 12, 20, 10, 21]);
        dots(c, C.white, [13, 36, 15, 36]);
        c.rect(16, 15, 22, b, mix(SHED, 0.8));
        c.frame(16, 15, 22, b, C.woodDark);
        c.line(17, 16, 21, b - 1, C.woodDark);
        c.rect(20, 17, 26, 24, GLASSD);
        c.clearRect(29, 0, 40, b);
        c.rect(27, 15, 34, b, mix(SHED, 0.8));
        c.frame(27, 15, 34, b, C.woodDark);
        c.line(28, 16, 33, b - 1, C.woodDark);
        planks(c, 16, 13, 28, b, SHED, 3);
        c.rect(20, 17, 26, 24, GLASSD);
        c.frame(19, 16, 27, 25, C.woodDark);
        c.col(23, 17, 24, C.woodDark);
        c.rect(29, 15, 36, b, mix(SHED, 0.8));
        c.frame(29, 15, 36, b, C.woodDark);
        c.line(30, 16, 35, b - 1, C.woodDark);
        c.rect(27, 15, 28, b, SHED);
      } else {
        c.rect(5, 15, 15, b, mix(SHED, 1.1));
        c.frame(5, 15, 15, b, C.woodDark);
        c.line(6, 16, 14, b - 1, C.woodDark);
        c.row(22, 6, 14, C.woodDark);
        c.rect(13, 26, 15, 27, C.iron);
        c.rect(13, 28, 14, 30, C.brass);
      }
      grass(c, 1, 4, b, 3, LAWN, 3);
      grass(c, 24, 30, b, 4, LAWN, 3);
    },
    sw: 26,
    s(c, u) {
      const b = c.h - 2;
      planks(c, 3, 11, 22, b, mix(SHED, 0.9), 3);
      c.rect(1, 3, 24, 11, FELT);
      c.row(3, 1, 24, L(FELT));
      c.row(11, 1, 24, D(FELT));
      c.speckle(1, 3, 24, 11, hex('#4f6b3c'), 9, 3);
      c.line(22, b - 8, 24, b, C.woodLight);
      c.rect(23, b - 9, 25, b - 9, C.steel);
      if (u) {
        c.col(22, 15, b, DARK);
        c.set(23, 19, WARM);
      }
      grass(c, 1, 8, b, 3, LAWN, 3);
    },
  });

  {
    const line = (c, u, w) => {
      const b = c.h - 2,
        m = w >> 1;
      c.rect(m - 1, 8, m, b, C.steel);
      c.col(m, 8, b, C.iron);
      c.line(m - 1, 9, 2, 4, C.steel);
      c.line(m, 9, w - 3, 4, C.iron);
      c.row(5, 3, w - 4, hex('#8a8a80'));
      c.row(7, 7, w - 8, hex('#8a8a80'));
      /* a sheet, a shirt, small things */
      const sx1 = Math.min(m - 3, 15);
      c.rect(4, 6, sx1, 22, C.white);
      c.col(4, 6, 22, L(C.white));
      c.line(7, 7, 8, 21, mix(C.white, 0.9));
      c.row(22, 4, sx1, mix(C.white, 0.85));
      const x = m + 3;
      if (!u || w < 30) {
        c.rect(x, 6, x + 6, 13, hex('#6a8aa8'));
        c.rect(x - 1, 6, x - 1, 9, hex('#6a8aa8'));
        c.rect(x + 7, 6, x + 7, 9, hex('#6a8aa8'));
      }
      if (w >= 30) {
        c.rect(x + 10, 6, x + 13, 10, hex('#b87a84'));
        c.rect(x + 10, 11, x + 10, 12, hex('#b87a84'));
        c.rect(x + 13, 11, x + 13, 12, hex('#b87a84'));
      }
      dots(c, C.woodLight, [5, 5, sx1 - 1, 5, x + 1, 5, x + 5, 5]);
      if (u) {
        /* a hand print on the sheet, the shirt in the grass */
        pat(c, 7, 12, ['r.r.r', 'rrrrr', 'rrrrr', '.rrr.', '.rrr.'], C.blood);
        drip(c, 9, 17, 4, C.blood);
        drip(c, 7, 17, 2, C.blood);
        if (w >= 30) {
          c.rect(x + 1, b - 1, x + 8, b, hex('#6a8aa8'));
          c.row(b - 2, x + 3, x + 6, hex('#6a8aa8'));
        }
      }
      grass(c, m - 4, m + 4, b, 3, LAWN, 2);
    };
    T('suburban-washing-line-rotary', 'rotary washing line clothes airer sheets shirts drying in the garden stain', {
      w: 40, h: 40, solid: true,
      f: (c, u) => line(c, u, 40),
      sw: 26,
      s: (c, u) => line(c, u, 26),
    });
  }

  T('suburban-bird-bath-stone', 'stone bird bath pedestal garden water sparrow drinking dead bird', {
    w: 18, h: 26, solid: true, same: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, b - 2, 13, b, STONE);
      c.row(b - 2, 4, 13, L(STONE));
      c.rect(7, 10, 10, b - 3, STONE);
      c.col(7, 10, b - 3, L(STONE));
      c.rect(6, 12, 11, 12, D(STONE));
      c.poly([[1, 6], [16, 6], [13, 9], [4, 9]], STONE);
      c.row(6, 1, 16, L(STONE));
      c.row(5, 3, 14, u ? hex('#6a8a90') : WATERL);
      c.speckle(1, 6, 16, b, hex('#6a7a5a'), 9, 3);
      if (u) {
        /* on its back at the foot */
        c.rect(13, b - 1, 16, b, hex('#6a5a48'));
        c.set(12, b, hex('#b8963a'));
        c.col(15, b - 3, b - 2, hex('#4a3a2a'));
        dots(c, hex('#8a7a66'), [3, 4, 11, 3, 6, 2, 2, b - 1]);
        c.set(8, 5, hex('#8a3a3a'));
      } else {
        c.rect(10, 2, 13, 4, hex('#6a5a48'));
        c.set(9, 4, hex('#6a5a48'));
        c.rect(12, 1, 13, 2, hex('#6a5a48'));
        c.set(14, 2, hex('#b8963a'));
        c.set(13, 1, DARK);
      }
      grass(c, 1, 16, b, 4, LAWN, 2);
    },
  });

  T('suburban-wheelbarrow-soil', 'wheelbarrow green tray load of soil spade gardening tipped out something in the earth', {
    w: 16, h: 20, solid: true, base: 'side', sum: [0, 0, 8],
    sw: 30,
    s(c, u) {
      const b = c.h - 2,
        G = hex('#4a6a50');
      if (u) {
        /* tipped up on its nose */
        c.poly([[14, 3], [24, 6], [23, b - 3], [17, b - 5]], G);
        c.line(14, 3, 24, 6, L(G));
        c.line(14, 3, 6, 0, C.woodLight);
        c.line(17, b - 5, 10, 6, C.iron);
        c.oval(20, b - 6, 26, b, TYRE);
        c.set(23, b - 3, C.steel);
        c.poly([[24, b], [28, b - 5], [33, b - 3], [36, b]], SOIL);
        c.speckle(24, b - 5, 36, b, hex('#5e4636'), 4, 2);
        c.rect(30, b - 4, 32, b - 4, C.bone);
        c.set(33, b - 5, C.bone);
        c.set(29, b - 3, C.bone);
      } else {
        c.poly([[7, 7], [26, 7], [22, b - 5], [11, b - 5]], G);
        c.row(7, 7, 26, L(G));
        c.line(7, 7, 11, b - 5, L(G));
        c.poly([[9, 6], [13, 3], [19, 2], [24, 6]], SOIL);
        c.speckle(9, 2, 24, 6, hex('#5e4636'), 4, 2);
        c.line(17, 3, 21, -1, C.woodLight);
        c.line(7, 8, 1, 6, C.woodLight);
        c.set(0, 6, DARK);
        c.line(12, b - 4, 9, b, C.iron);
        c.line(21, b - 4, 24, b - 4, C.iron);
        c.oval(22, b - 6, 28, b, TYRE);
        c.set(25, b - 3, C.steel);
        rust(c, 7, 7, 26, b - 5, 14, 3);
      }
    },
    f(c, u) {
      const b = c.h - 2,
        G = hex('#4a6a50');
      if (u) {
        c.rect(3, 3, 12, b - 4, G);
        c.row(3, 3, 12, L(G));
        c.rect(5, 5, 10, b - 6, D(G));
        c.rect(6, b - 5, 9, b, TYRE);
        c.poly([[1, b], [4, b - 3], [11, b - 3], [14, b]], SOIL);
        c.rect(7, b - 3, 8, b - 3, C.bone);
      } else {
        c.poly([[2, 7], [13, 7], [11, b - 5], [4, b - 5]], G);
        c.row(7, 2, 13, L(G));
        c.poly([[3, 6], [6, 3], [10, 3], [12, 6]], SOIL);
        c.speckle(3, 3, 12, 6, hex('#5e4636'), 4, 2);
        c.col(9, 0, 3, C.woodLight);
        c.rect(6, b - 5, 9, b, TYRE);
        c.col(7, b - 4, b - 1, hex('#34323c'));
        for (const x of [3, 12]) c.col(x, b - 4, b, C.iron);
      }
    },
  });

  T('suburban-leaf-pile-rake', 'pile of raked autumn leaves rake heap garden kicked apart something under it', {
    w: 28, h: 18, solid: false,
    f(c, u) {
      const b = c.h - 2,
        r = rnd(4);
      const heap = (pts) => {
        c.poly(pts, LEAFC[0]);
        for (let y = 0; y <= b; y++) for (let x = 0; x < c.w; x++) if (c.get(x, y) === LEAFC[0]) c.set(x, y, LEAFC[(r() * 5) | 0]);
      };
      if (u) {
        heap([[1, b], [4, b - 3], [10, b - 2], [14, b - 4], [22, b - 2], [26, b]]);
        for (let i = 0; i < 9; i++) c.set((r() * 27) | 0, b - 5 - ((r() * 6) | 0), LEAFC[(r() * 5) | 0]);
        /* a shoe, and what wears it */
        c.rect(10, b - 3, 13, b - 2, hex('#2e2a2a'));
        c.set(13, b - 4, hex('#2e2a2a'));
        c.rect(14, b - 3, 15, b - 3, C.flesh);
        c.row(b, 20, 27, C.woodLight);
        for (const x of [21, 23, 25]) c.set(x, b - 1, C.steel);
      } else {
        heap([[2, b], [5, b - 6], [10, b - 10], [16, b - 10], [21, b - 5], [24, b]]);
        c.line(18, b - 8, 24, 1, C.woodLight);
        c.row(b - 7, 15, 21, C.steel);
        for (let x = 15; x <= 21; x += 2) c.set(x, b - 6, C.steel);
      }
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2,
        r = rnd(6);
      c.poly(u ? [[1, b], [4, b - 3], [10, b - 2], [14, b]] : [[1, b], [4, b - 7], [8, b - 10], [12, b - 6], [14, b]], LEAFC[0]);
      for (let y = 0; y <= b; y++) for (let x = 0; x < c.w; x++) if (c.get(x, y) === LEAFC[0]) c.set(x, y, LEAFC[(r() * 5) | 0]);
      if (u) {
        c.rect(6, b - 3, 8, b - 2, hex('#2e2a2a'));
        dots(c, LEAFC[1], [3, b - 8, 11, b - 6]);
      } else {
        c.col(9, 1, b - 8, C.woodLight);
        c.rect(8, b - 7, 10, b - 7, C.steel);
      }
    },
  });

  {
    const tree = (c, u, w) => {
      const b = c.h - 2,
        m = w >> 1,
        BARK = hex('#4f3a2c');
      c.rect(m - 4, 20, m + 3, b, BARK);
      c.col(m - 4, 20, b, L(BARK));
      for (const x of [m - 2, m + 1]) c.line(x, 24, x, b - 2, D(BARK));
      c.poly([[m - 4, b - 4], [m - 7, b], [m + 6, b], [m + 3, b - 4]], BARK);
      c.line(m - 3, 22, m - 10, 14, BARK);
      c.line(m + 2, 22, m + 10, 13, BARK);
      leaves(c, 2, 1, w - 3, 18, hex('#3a5a38'), 3);
      leaves(c, 0, 8, m - 4, 22, hex('#33503a'), 5);
      leaves(c, m + 5, 9, w - 1, 22, hex('#33503a'), 8);
      /* the house in the fork */
      const x0 = m - 9,
        x1 = m + 8;
      c.rect(x0 - 2, 35, x1 + 2, 36, C.woodLight);
      c.row(36, x0 - 2, x1 + 2, C.wood);
      planks(c, x0, 22, x1, 34, hex('#8a6a48'), 3);
      c.poly([[x0 - 2, 22], [m - 1, 17], [m, 17], [x1 + 2, 22]], hex('#5a4a3a'));
      c.row(22, x0 - 2, x1 + 2, hex('#3e3228'));
      c.line(x0 - 1, 37, m - 4, 41, C.wood);
      c.line(x1 + 1, 37, m + 3, 41, C.wood);
      if (w > 40) {
        c.rect(m - 6, 25, m - 1, 30, u ? WARM : DARK);
        c.frame(m - 7, 24, m, 31, C.woodDark);
        if (u) {
          c.rect(m - 4, 27, m - 3, 30, hex('#3a2e30'));
          c.set(m - 4, 26, hex('#3a2e30'));
          c.set(m - 3, 26, hex('#3a2e30'));
        }
        c.rect(m + 2, 26, m + 7, 28, C.bone);
        scribble(c, m + 3, 27, m + 6, 27, RED, 2);
      } else if (u) c.col(x1, 26, 30, WARM);
      /* the rope ladder: down, then pulled up */
      const lx = w > 40 ? x1 - 2 : x1 - 1;
      if (u) {
        c.rect(lx, 33, lx + 3, 36, hex('#a8904e'));
        c.row(34, lx, lx + 3, C.wood);
      } else {
        for (const x of [lx, lx + 3]) c.col(x, 37, b - 1, hex('#a8904e'));
        for (let y = 39; y < b; y += 3) c.row(y, lx, lx + 3, C.wood);
      }
      grass(c, m - 12, m + 12, b, 3, LAWN, 2);
    };
    T('suburban-treehouse-oak', 'tree house in an oak rope ladder den children club keep out light in the window', {
      w: 44, h: 62, solid: true,
      f: (c, u) => tree(c, u, 44),
      sw: 36,
      s: (c, u) => tree(c, u, 36),
    });
  }
};
