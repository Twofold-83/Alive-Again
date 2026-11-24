/* Gothic, part 4: the churchyard and the ruined abbey, the funeral, the works in the tower.
 * Part of tools/big/env2-medieval.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, rnd } = kit;
  const { D, L, dots, board, face, panel, stones, wheel, wheelEdge, chain, candle, archPt, skull, heap } = H;
  const add = H.reg('env-gothic', 'Gothic');
  const { SOOT, WAX, EBONY, BLACKW, GSTONE, GDARK, PURPLE, PALL, SHROUD, DEADF } = H.MED;
  const IRON = C.iron,
    BRASS = C.brass,
    GOLD = C.gold,
    RUBY = hex('#7a2c34'),
    SAPPH = hex('#34446a'),
    GLGREEN = hex('#3c5a40'),
    COFFIN = hex('#4a3226'),
    VOID = hex('#141218'),
    BOOK = hex('#4a2626'),
    YEW = hex('#1f3328'),
    YEWL = hex('#2f4a36'),
    BARK = hex('#4a3a34'),
    SLATE = hex('#4a4a56'),
    TAN = hex('#8a6a44'),
    HEMPc = H.MED.HEMP,
    PEWT = H.MED.PEWTER;

  add('gothic-yew-tree-churchyard', 'yew tree churchyard ancient dark evergreen hollow trunk berries graveyard', {
    w: 44, h: 54, solid: true,
    f(c, u) {
      const b = c.h - 2,
        r = rnd(7);
      c.poly([[18, 30], [26, 30], [27, 44], [30, b], [14, b], [17, 44]], BARK); // the trunk
      c.line(18, 30, 15, b, L(BARK));
      for (const x of [20, 23, 25]) c.line(x, 31, x + (x > 22 ? 2 : -1), b, D(BARK));
      c.line(22, 36, 13, 26, BARK);
      c.line(23, 34, 33, 25, BARK);
      c.rect(11, b, 13, b, BARK);
      c.rect(31, b, 33, b, BARK);
      for (const [x0, y0, x1, y1] of [[3, 14, 22, 32], [20, 12, 41, 31], [9, 3, 32, 22], [1, 22, 14, 34], [30, 22, 42, 35], [14, 20, 30, 33]]) {
        c.oval(x0, y0, x1, y1, YEW);
      }
      for (let y = 3; y <= 35; y++)
        for (let x = 1; x <= 42; x++) {
          if (c.get(x, y) !== YEW) continue;
          const v = r();
          if (v < 0.16 - (x + y) * 0.0012) c.set(x, y, YEWL);
          else if (v > 0.9) c.set(x, y, mix(YEW, 0.7));
          else if (!c.get(x, y - 1) || (!c.get(x - 1, y) && x < 20)) c.set(x, y, YEWL);
        }
      dots(c, RUBY, [8, 20, 15, 9, 27, 14, 34, 27, 21, 25, 5, 29, 38, 22, 24, 6]);
      c.rect(21, 38, 23, 45, VOID); // the hollow
      c.set(22, 37, VOID);
      c.set(22, 46, VOID);
      if (u) {
        c.rect(20, 37, 24, 46, VOID);
        c.set(21, 40, C.glow); // something lives in it
        c.set(23, 40, C.glow);
        c.rect(27, b - 1, 28, b, WAX);
        c.set(27, b - 2, C.flame);
        c.set(27, b - 3, C.flameLight);
        c.rect(30, b, 32, b, C.white); // things left at the root
        c.set(31, b - 1, RUBY);
        dots(c, RUBY, [18, b, 22, b - 1]);
      }
    },
  });
  add('gothic-lychgate-roofed', 'large lychgate roofed churchyard gate timber slate corpse gate entrance', {
    w: 44, h: 48, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[1, 14], [21, 2], [22, 2], [42, 14], [42, 15], [1, 15]], SLATE); // the roof
      c.line(1, 14, 21, 2, L(SLATE));
      c.poly([[9, 15], [21, 7], [22, 7], [34, 15]], VOID);
      c.line(9, 15, 21, 7, BLACKW);
      c.line(34, 15, 22, 7, EBONY);
      c.col(21, 8, 15, BLACKW);
      c.col(22, 8, 15, EBONY);
      c.rect(21, 0, 22, 1, BLACKW);
      for (let y = 5; y <= 13; y += 3) for (let x = 3; x <= 40; x++) if (c.get(x, y) === SLATE) c.set(x, y, D(SLATE));
      dots(c, C.moss, [6, 12, 12, 9, 30, 8, 37, 12, 16, 6]);
      board(c, 2, 15, 41, 17, BLACKW);
      for (const x of [4, 37]) {
        c.rect(x, 18, x + 2, 31, BLACKW);
        c.col(x, 18, 31, L(BLACKW));
        c.line(x + (x < 9 ? 3 : -1), 22, x + (x < 9 ? 7 : -5), 18, EBONY);
      }
      stones(c, 2, 32, 8, b, GSTONE, 4, 5, 3);
      stones(c, 35, 32, 41, b, GSTONE, 4, 5, 5);
      c.row(31, 1, 9, L(GSTONE));
      c.row(31, 34, 42, L(GSTONE));
      dots(c, C.moss, [3, b, 40, b - 1, 36, 34]);
      if (!u) {
        for (const x0 of [9, 22]) {
          for (let x = x0 + 1; x <= x0 + 11; x += 2) c.col(x, 29, b, x % 4 === 1 ? BLACKW : EBONY); // the gates
          c.row(31, x0, x0 + 12, BLACKW);
          c.row(b - 2, x0, x0 + 12, BLACKW);
          c.line(x0, b - 3, x0 + 12, 32, EBONY);
        }
        c.rect(20, 34, 23, 35, IRON);
      } else {
        c.rect(9, 28, 10, b, BLACKW); // thrown open
        c.rect(33, 28, 34, b, EBONY);
        c.col(9, 28, b, L(BLACKW));
        c.rect(15, b - 5, 28, b - 4, L(GSTONE)); // the coffin stone, and a lamp left burning
        c.rect(17, b - 3, 26, b, GSTONE);
        c.col(17, b - 3, b, L(GSTONE));
        c.col(21, 18, 21, IRON);
        c.rect(20, 22, 22, 25, IRON);
        c.set(21, 23, C.flameLight);
        c.set(21, 24, C.flame);
        dots(c, C.white, [19, b - 6, 22, b - 6, 24, b - 6]);
        c.set(21, b - 6, C.leaf);
      }
    },
    sw: 22, sh: 48,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 3, 20, 15, SLATE);
      c.row(2, 2, 19, L(SLATE));
      for (let y = 5; y <= 13; y += 3) c.row(y, 1, 20, D(SLATE));
      for (let x = 4; x <= 18; x += 5) c.col(x, 3, 14, D(SLATE));
      dots(c, C.moss, [6, 11, 14, 8, 9, 5]);
      c.rect(10, 0, 11, 1, BLACKW);
      board(c, 2, 15, 19, 17, BLACKW);
      for (const x of [3, 16]) {
        c.rect(x, 18, x + 2, 31, BLACKW);
        c.col(x, 18, 31, L(BLACKW));
      }
      stones(c, 2, 32, 19, b, GSTONE, 4, 6, 3);
      c.row(31, 1, 20, L(GSTONE));
      if (!u) c.rect(10, 28, 11, 31, EBONY);
      else {
        for (let x = 6; x <= 15; x += 2) c.col(x, 21, 31, x % 4 === 0 ? BLACKW : EBONY);
        c.row(22, 6, 15, BLACKW);
        c.row(30, 6, 15, BLACKW);
      }
      dots(c, C.moss, [3, b, 18, b - 1]);
    },
  });
  add('gothic-abbey-ruin-window-wall', 'large abbey ruin wall empty window tracery broken stone ivy ruined church', {
    w: 40, h: 54, solid: true,
    f(c, u) {
      const b = c.h - 2,
        M = hex('#010203');
      stones(c, 1, 1, 38, b, GSTONE, 5, 8, 6);
      c.col(1, 1, b, L(GSTONE));
      const top = [1, 1, 2, 2, 1, 3, 3, 2, 4, 4, 3, 3, 2, 2, 3, 4, 6, 6, 5, 7, 9, 9, 8, 10, 12, 12, 14, 14, 13, 16, 18, 18, 20, 22, 22, 24, 27, 28];
      for (let x = 1; x <= 38; x++) for (let y = 1; y < top[x - 1]; y++) c.clear(x, y);
      archPt(c, 10, 9, 27, 38, L(GSTONE), 12);
      archPt(c, 12, 11, 25, 37, M, 10);
      for (let y = 9; y <= 38; y++) for (let x = 10; x <= 27; x++) if (c.get(x, y) === M) c.clear(x, y);
      c.col(18, 22, 37, GSTONE); // what is left of the tracery
      c.col(19, 22, 37, D(GSTONE));
      c.line(18, 22, 14, 16, GSTONE);
      c.line(19, 22, 23, 16, D(GSTONE));
      c.clear(19, 30);
      c.clear(19, 31);
      c.clear(18, 31);
      c.rect(9, 38, 28, 39, L(GSTONE));
      for (let x = 1; x <= 38; x++) for (let y = 1; y <= 30; y++) if (c.get(x, y) && !c.get(x, y - 1) && y < 9) c.set(x, y, L(GSTONE));
      const r = rnd(4);
      for (let y = 14; y <= b; y++) {
        const w = 2 + Math.round(3 * Math.sin(y / 5) + 3 * r());
        for (let x = 1; x <= Math.min(8, w); x++) c.set(x, y, r() < 0.3 ? C.leafLight : r() < 0.5 ? YEW : C.leaf); // ivy
      }
      c.rect(30, b - 2, 37, b, GSTONE); // fallen stones
      c.rect(33, b - 4, 36, b - 3, GSTONE);
      c.row(b - 4, 33, 36, L(GSTONE));
      c.row(b - 2, 30, 32, L(GSTONE));
      dots(c, C.moss, [12, b, 20, b - 1, 30, 30, 26, 42, 15, 45]);
      if (u) {
        const G = C.ghost,
          G2 = mix(C.ghost, 0.75);
        c.poly([[16, 19], [21, 19], [23, 26], [23, 37], [14, 37], [14, 26]], G2); // a monk stands in the window
        c.rect(16, 18, 21, 24, G);
        c.rect(17, 20, 20, 24, VOID);
        c.set(18, 22, G);
        c.set(20, 22, G);
        c.col(14, 27, 37, G);
        c.line(17, 27, 16, 37, G);
        c.rect(17, 30, 20, 31, G);
      }
    },
    sw: 12, sh: 54,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 3, 3, 8, b, GSTONE, 5, 5, 6);
      c.col(3, 3, b, L(GSTONE));
      c.rect(4, 1, 6, 2, GSTONE);
      c.clear(8, 3);
      c.clear(8, 4);
      c.clear(7, 3);
      c.rect(2, 38, 9, 39, L(GSTONE));
      dots(c, C.leaf, [3, 20, 4, 24, 3, 28, 5, 33, 4, 40, 3, 45, 5, 47]);
      dots(c, C.leafLight, [4, 22, 3, 31, 4, 43]);
      c.rect(9, b - 1, 10, b, GSTONE);
      if (u) {
        c.rect(9, 19, 10, 24, C.ghost);
        c.col(9, 25, 37, mix(C.ghost, 0.75));
        c.set(10, 22, VOID);
      }
    },
  });
  add('gothic-chained-library-shelf', 'chained library bookshelf books chains reading desk monastery scriptorium lectern', {
    w: 32, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2,
        cols = [BOOK, GLGREEN, TAN, SAPPH, BOOK, hex('#3a3238'), TAN, GLGREEN, BOOK];
      face(c, 1, 2, 30, b, BLACKW);
      c.row(2, 1, 30, L(BLACKW));
      for (const y0 of [4, 16]) {
        c.rect(3, y0, 28, y0 + 9, VOID);
        for (let i = 0; i < 9; i++) {
          const x = 3 + i * 3 - (i > 5 ? 1 : 0),
            h = 7 + ((i * 5 + y0) % 3);
          if (u && y0 === 4 && i === 4) continue;
          c.rect(x, y0 + 10 - h, x + 1, y0 + 9, cols[(i + y0) % 9]);
          c.col(x, y0 + 10 - h, y0 + 9, L(cols[(i + y0) % 9]));
          c.set(x, y0 + 6, BRASS);
          c.set(x + 1, y0 + 12, IRON); // its chain
          c.set(x + 1, y0 + 13, D(IRON));
        }
        c.row(y0 + 10, 2, 29, BLACKW);
        c.row(y0 + 11, 3, 28, IRON); // the rod
      }
      c.rect(1, 31, 30, 33, hex('#4a3a34')); // the desk
      c.row(31, 1, 30, L(hex('#4a3a34')));
      panel(c, 4, 35, 14, b - 2, BLACKW);
      panel(c, 17, 35, 27, b - 2, BLACKW);
      if (u) {
        chain(c, 16, 15, 14, 29);
        c.rect(9, 29, 18, 30, C.paper); // one taken down and left open
        c.col(13, 29, 30, D(C.paper));
        c.row(31, 9, 18, BOOK);
        c.set(10, 29, RUBY);
        c.set(21, 30, BRASS);
        candle(c, 21, 29, 3, true, WAX);
        dots(c, K, [15, 7, 16, 9]);
      }
    },
    sw: 14, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      face(c, 2, 2, 7, b, BLACKW);
      panel(c, 3, 5, 6, 26, BLACKW);
      c.poly([[8, 31], [12, 33], [12, 34], [8, 34]], hex('#4a3a34'));
      c.line(8, 30, 12, 32, L(hex('#4a3a34')));
      c.rect(8, 35, 9, b, BLACKW);
      c.col(8, 15, 16, IRON);
      c.col(8, 27, 28, IRON);
      if (u) {
        c.line(8, 29, 12, 31, C.paper);
        c.line(8, 17, 9, 28, D(IRON));
        candle(c, 11, 30, 3, true, WAX);
      }
    },
  });
  add('gothic-mourning-wreath-stand', 'mourning wreath funeral flowers lilies ribbon easel stand memorial grave', {
    w: 18, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2,
        LEAF = u ? hex('#5a4a30') : YEWL,
        LEAF2 = u ? hex('#463826') : YEW;
      c.line(8, 2, 3, b, IRON); // the easel
      c.line(9, 2, 14, b, D(IRON));
      c.col(8, 14, b - 2, D(IRON));
      c.row(22, 5, 12, IRON);
      c.oval(2, 3, 15, 17, LEAF);
      for (let y = 3; y <= 17; y++) for (let x = 2; x <= 15; x++) if (c.get(x, y) === LEAF && (x * 3 + y * 5) % 4 === 0) c.set(x, y, LEAF2);
      for (let y = 7; y <= 13; y++) for (let x = 6; x <= 11; x++) if (((x - 8.5) / 3) ** 2 + ((y - 10) / 3.5) ** 2 <= 1) c.clear(x, y);
      c.col(8, 7, 13, D(IRON));
      const fl = u ? hex('#8a8068') : C.white;
      dots(c, fl, [4, 6, 12, 5, 14, 10, 3, 12, 7, 4, 11, 15]);
      if (!u) dots(c, L(C.white), [5, 6, 13, 10]);
      c.rect(7, 16, 10, 17, PURPLE); // the bow
      c.line(7, 18, 5, 24, PURPLE);
      if (!u) c.line(10, 18, 12, 25, D(PURPLE));
      else {
        c.line(10, 18, 11, 20, D(PURPLE));
        dots(c, hex('#8a8068'), [4, b, 7, b - 1, 12, b, 10, b]);
        dots(c, LEAF, [6, b, 13, b - 1, 2, b]);
        c.set(12, b - 2, PURPLE);
      }
      c.rect(8, 19, 9, 20, C.paper);
    },
    sw: 10, sh: 34,
    s(c, u) {
      const b = c.h - 2,
        LEAF = u ? hex('#5a4a30') : YEWL;
      c.line(4, 2, 2, b, IRON);
      c.line(5, 2, 8, b, D(IRON));
      c.rect(2, 3, 4, 17, LEAF);
      c.col(2, 3, 17, u ? hex('#463826') : YEW);
      dots(c, u ? hex('#8a8068') : C.white, [2, 6, 3, 11, 2, 14]);
      c.col(2, 18, 24, PURPLE);
      if (u) dots(c, hex('#8a8068'), [1, b, 5, b]);
    },
  });
  add('gothic-funeral-bier-handles', 'bier funeral stretcher carrying handles wooden frame shrouded body corpse pall', {
    w: 42, h: 18, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (const x of [9, 31]) {
        c.rect(x, 11, x + 1, b, EBONY);
        c.col(x, 11, b, BLACKW);
        c.set(x - 1, 13, EBONY);
        c.set(x + 2, 13, EBONY);
      }
      c.row(b - 3, 11, 30, EBONY);
      board(c, 1, 9, 40, 10, BLACKW);
      c.rect(1, 9, 5, 9, hex('#4a3a34'));
      c.rect(36, 9, 40, 9, hex('#4a3a34'));
      if (!u) {
        c.rect(26, 6, 34, 8, PALL); // the pall, folded
        c.row(6, 26, 34, GDARK);
        c.row(8, 26, 34, K);
        for (let x = 8; x <= 24; x += 4) c.set(x, 9, EBONY);
      } else {
        c.rect(7, 6, 34, 8, SHROUD); // somebody under a sheet
        c.rect(7, 4, 11, 5, SHROUD);
        c.rect(12, 5, 28, 5, SHROUD);
        c.rect(30, 3, 32, 5, SHROUD);
        c.row(4, 7, 11, L(SHROUD));
        c.row(5, 12, 28, L(SHROUD));
        c.set(30, 3, L(SHROUD));
        c.col(12, 6, 8, D(SHROUD));
        c.col(29, 5, 8, D(SHROUD));
        dots(c, D(SHROUD), [16, 7, 22, 8, 26, 7, 9, 7]);
        c.col(19, 9, 12, DEADF); // one hand has slipped out
        c.set(19, 13, D(DEADF));
        c.set(20, 12, DEADF);
        dots(c, C.blood, [17, 6, 18, 6, 18, 7]);
        c.rect(15, 4, 17, 4, GLGREEN);
        c.set(16, 3, GLGREEN);
      }
    },
    sw: 16, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [3, 11]) {
        c.rect(x, 11, x + 1, b, EBONY);
        c.col(x, 11, b, BLACKW);
      }
      c.row(b - 3, 5, 10, EBONY);
      board(c, 2, 9, 13, 10, BLACKW);
      c.rect(1, 9, 1, 10, hex('#4a3a34'));
      c.rect(14, 9, 14, 10, hex('#4a3a34'));
      if (!u) {
        c.rect(4, 6, 11, 8, PALL);
        c.row(6, 4, 11, GDARK);
      } else {
        c.oval(4, 3, 11, 8, SHROUD);
        c.rect(4, 6, 11, 8, SHROUD);
        c.row(3, 6, 9, L(SHROUD));
        c.col(7, 5, 8, D(SHROUD));
        c.col(12, 9, 12, DEADF);
      }
    },
  });
  add('gothic-turret-clock-works', 'turret clock works tower mechanism gears pendulum weight iron frame belfry', {
    w: 30, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [2, 26]) {
        c.rect(x, 3, x + 1, b, IRON);
        c.col(x, 3, b, L(IRON));
      }
      for (const y of [4, 20, b - 1]) {
        c.rect(2, y, 27, y, IRON);
        c.row(y + 1, 3, 26, D(IRON));
      }
      const gear = (cx, cy, r, col, ph) => {
        c.oval(cx - r, cy - r, cx + r, cy + r, col);
        c.oval(cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2, VOID);
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 4 + ph;
          c.line(cx - Math.cos(a) * (r - 1), cy - Math.sin(a) * (r - 1), cx + Math.cos(a) * (r - 1), cy + Math.sin(a) * (r - 1), i % 2 ? D(col) : col);
        }
        for (let i = 0; i < r * 3; i++) {
          const a = (i * 2 * Math.PI) / (r * 3) + ph;
          c.set(cx + Math.cos(a) * (r + 0.6), cy + Math.sin(a) * (r + 0.6), D(col));
        }
        c.set(cx, cy, L(IRON));
      };
      gear(10, 13, 6, BRASS, u ? 0.4 : 0);
      gear(20, 11, 4, IRON, u ? 0.5 : 0.1);
      gear(19, 25, 3, BRASS, u ? 0.3 : 0.8);
      c.col(24, 6, u ? 26 : 14, HEMPc); // the weight on its line
      const wy = u ? 27 : 15;
      c.rect(23, wy, 25, wy + 5, GSTONE);
      c.col(23, wy, wy + 5, L(GSTONE));
      c.row(wy + 2, 23, 25, IRON);
      const px = u ? 10 : 6;
      c.line(8, 6, px, b - 4, PEWT); // the pendulum
      c.oval(px - 2, b - 5, px + 2, b - 1, BRASS);
      c.set(px - 1, b - 4, L(BRASS));
      c.rect(7, 5, 9, 6, IRON);
      if (u) {
        c.line(14, 21, 17, 17, IRON); // the hammer lifted to strike
        c.rect(17, 15, 18, 17, IRON);
        dots(c, C.ash, [5, 9, 15, 3]);
      } else {
        c.line(14, 21, 18, 20, IRON);
        c.rect(18, 19, 19, 21, IRON);
      }
    },
    sw: 16, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [3, 11]) {
        c.rect(x, 3, x + 1, b, IRON);
        c.col(x, 3, b, L(IRON));
      }
      for (const y of [4, 20, b - 1]) c.rect(3, y, 12, y + 1, D(IRON));
      c.rect(6, 7, 7, 19, BRASS);
      c.col(6, 7, 19, L(BRASS));
      for (let y = 8; y < 19; y += 2) c.set(7, y, D(BRASS));
      c.rect(9, 7, 9, 15, IRON);
      c.rect(8, 22, 9, 28, BRASS);
      c.col(14, 6, u ? 26 : 14, HEMPc);
      const wy = u ? 27 : 15;
      c.rect(13, wy, 15, wy + 5, GSTONE);
      c.col(13, wy, wy + 5, L(GSTONE));
      c.row(wy + 2, 13, 15, IRON);
      c.col(u ? 6 : 5, 6, b - 5, PEWT);
      c.rect(u ? 5 : 4, b - 5, u ? 7 : 6, b - 1, BRASS);
    },
  });
  add('gothic-gravedigger-barrow', 'gravedigger wheelbarrow barrow earth spade sexton grave digging wooden', {
    w: 36, h: 22, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      heap(c, 10, 24, 9, u ? 4 : 6, C.earth, 3);
      c.poly([[7, 8], [27, 7], [25, 14], [11, 14]], BARK); // the tray
      c.line(7, 8, 27, 7, L(BARK));
      c.line(11, 14, 25, 14, D(BARK));
      for (const x of [13, 18, 23]) c.line(x, 9, x, 13, D(BARK));
      c.line(25, 13, 34, 8, BARK); // handles
      c.line(25, 14, 34, 9, D(BARK));
      c.col(23, 15, b, BARK);
      c.line(10, 14, 6, b - 4, BARK);
      wheel(c, 6, b - 4, 4, BARK, IRON);
      if (!u) {
        c.line(18, 6, 22, -3, TAN); // the spade stuck in the load
        c.rect(16, 5, 19, 8, GDARK);
        c.row(5, 16, 19, IRON);
        c.rect(21, -4, 23, -4, TAN);
      } else {
        skull(c, 13, 2); // what the spade turned up
        c.line(19, 6, 23, 4, C.bone);
        c.set(24, 3, C.bone);
        c.set(18, 7, C.bone);
        c.rect(27, b - 1, 30, b, GDARK); // the spade thrown down
        c.line(30, b, 35, b - 1, TAN);
        dots(c, C.earth, [12, b, 15, b, 14, b - 1, 26, b]);
      }
    },
    u: [0, 5, 0],
    sw: 16, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      heap(c, 3, 12, 9, u ? 4 : 6, C.earth, 5);
      c.poly([[2, 8], [13, 8], [11, 14], [4, 14]], BARK);
      c.row(8, 2, 13, L(BARK));
      c.row(14, 4, 11, D(BARK));
      c.col(7, 9, 13, D(BARK));
      wheelEdge(c, 7, 8, b - 8, b, BARK);
      c.col(3, 15, b, BARK);
      c.col(12, 15, b, BARK);
      if (!u) {
        c.col(8, -3, 5, TAN);
        c.rect(7, 5, 9, 7, GDARK);
        c.rect(7, -4, 9, -4, TAN);
      } else {
        skull(c, 5, 2);
        dots(c, C.earth, [2, b, 14, b]);
      }
    },
    su: [0, 5, 0],
  });
  add('gothic-sexton-lantern-pole', 'sexton lantern on pole hook horn lantern graveyard night watch light', {
    w: 12, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 3, b, BARK);
      c.set(3, 2, L(BARK));
      c.row(2, 3, 7, IRON);
      c.set(7, 3, IRON);
      c.rect(2, b, 5, b, C.earth);
      c.set(4, b - 1, C.earth);
      c.set(7, 4, IRON);
      c.rect(5, 6, 9, 12, IRON); // the lantern
      c.rect(6, 5, 8, 5, IRON);
      c.rect(6, 7, 8, 11, u ? C.glow : hex('#6a5c3c'));
      c.col(7, 7, 11, u ? C.flameLight : hex('#5a4c30'));
      c.set(5, 6, L(IRON));
      if (u) {
        c.set(7, 10, C.flame);
        dots(c, D(C.glow), [10, 8, 4, 9, 7, 13, 10, 11]);
      }
    },
  });
  add('gothic-chalice-and-paten', 'chalice and paten gold cup communion wine wafer host altar vessel', {
    w: 16, h: 14,
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        c.rect(2, 2, 7, 5, GOLD); // the cup
        c.row(2, 2, 7, L(GOLD));
        c.row(2, 3, 6, RUBY);
        c.row(6, 3, 6, D(GOLD));
        c.rect(4, 7, 5, b - 2, GOLD);
        c.rect(3, 8, 6, 8, GOLD);
        c.rect(2, b - 1, 7, b, GOLD);
        c.row(b, 2, 7, D(GOLD));
        c.col(2, 2, 5, L(GOLD));
        c.set(4, 8, RUBY);
      } else {
        c.rect(1, b - 4, 4, b, GOLD); // on its side
        c.col(1, b - 4, b, L(GOLD));
        c.rect(5, b - 2, 7, b - 1, GOLD);
        c.set(6, b - 3, GOLD);
        c.rect(8, b - 4, 8, b, D(GOLD));
        c.set(1, b - 2, RUBY);
        c.row(b + 1, 0, 9, C.blood);
        c.row(b, 0, 0, C.blood);
        dots(c, C.blood, [10, b + 1, 12, b + 1]);
      }
      c.rect(10, b - 1, 14, b, GOLD); // the paten
      c.row(b - 1, 10, 14, L(GOLD));
      if (!u) c.rect(11, b - 2, 13, b - 2, C.white);
      else {
        c.set(11, b - 2, C.white);
        c.set(13, b - 2, C.white);
        c.set(15, b, C.white);
      }
    },
    us: [18, 15],
  });
  add('gothic-missal-on-stand', 'missal on stand prayer book brass rest altar book ribbon mass', {
    w: 16, h: 14,
    f(c, u) {
      const b = c.h - 2;
      c.line(4, b, 7, 6, BRASS);
      c.line(11, b, 8, 6, D(BRASS));
      c.row(b, 3, 12, BRASS);
      c.row(9, 2, 13, BRASS);
      if (!u) {
        c.rect(3, 2, 12, 8, BOOK);
        c.row(2, 3, 12, L(BOOK));
        c.col(3, 2, 8, L(BOOK));
        dots(c, BRASS, [4, 3, 11, 3, 4, 7, 11, 7]);
        c.rect(7, 4, 8, 6, GOLD);
        c.rect(6, 5, 9, 5, GOLD);
        c.col(10, 9, 11, RUBY);
      } else {
        c.rect(1, 2, 14, 8, C.paper);
        c.col(7, 2, 8, D(C.paper));
        c.col(8, 2, 8, L(C.paper));
        for (const y of [4, 6]) {
          c.row(y, 2, 5, K);
          c.row(y, 10, 13, K);
        }
        c.rect(2, 3, 3, 4, RUBY);
        c.row(5, 10, 12, RUBY);
        c.col(8, 9, 12, RUBY);
        c.row(9, 1, 14, BOOK);
      }
    },
    sw: 10, sh: 14,
    s(c, u) {
      const b = c.h - 2;
      c.line(2, b, 6, 4, BRASS);
      c.line(7, b, 5, 7, D(BRASS));
      c.row(b, 1, 8, BRASS);
      c.line(2, 9, 6, 2, u ? C.paper : BOOK);
      c.line(3, 9, 7, 2, u ? C.paper : L(BOOK));
      c.set(2, 10, BRASS);
      if (u) {
        c.line(4, 9, 8, 3, BOOK);
        c.set(4, 10, RUBY);
      }
    },
  });
  add('gothic-skull-candle', 'skull candle memento mori wax dripping bone candlestick vanitas', {
    w: 12, h: 16,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 7, 9, 11, C.bone);
      c.rect(3, 6, 8, 6, C.bone);
      c.rect(3, 12, 8, b, C.bone);
      c.row(6, 3, 6, L(C.bone));
      c.col(2, 7, 10, L(C.bone));
      c.rect(3, 9, 4, 10, u ? C.flame : K);
      c.rect(7, 9, 8, 10, u ? C.flame : K);
      if (u) {
        c.set(4, 10, C.flameLight);
        c.set(7, 10, C.flameLight);
      }
      c.set(5, 11, D(C.bone));
      c.set(6, 12, D(C.bone));
      for (let x = 3; x <= 8; x += 2) c.set(x, b, K);
      c.row(b - 1, 3, 8, D(C.bone));
      c.rect(5, u ? 4 : 2, 6, 5, WAX);
      c.set(4, 6, WAX);
      c.set(7, 6, WAX);
      c.set(7, 7, WAX);
      c.set(4, 7, D(WAX));
      if (u) {
        c.set(5, 3, C.flame);
        c.set(5, 2, C.flameLight);
        c.set(8, 8, WAX);
        c.set(2, 8, WAX);
      } else c.set(5, 1, K);
    },
    sw: 12, sh: 16,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 7, 8, 11, C.bone);
      c.rect(3, 6, 7, 6, C.bone);
      c.rect(5, 12, 9, b, C.bone);
      c.rect(8, 8, 9, 11, C.bone);
      c.row(6, 3, 5, L(C.bone));
      c.col(2, 7, 10, L(C.bone));
      c.rect(7, 9, 8, 10, u ? C.flame : K);
      c.set(9, 11, D(C.bone));
      for (let x = 6; x <= 9; x += 2) c.set(x, b, K);
      c.row(b - 1, 5, 9, D(C.bone));
      c.set(3, 12, D(C.bone));
      c.rect(4, u ? 4 : 2, 5, 5, WAX);
      c.set(3, 6, WAX);
      c.set(6, 6, WAX);
      if (u) {
        c.set(4, 3, C.flame);
        c.set(4, 2, C.flameLight);
        c.set(6, 7, WAX);
      } else c.set(4, 1, K);
    },
  });
  add('gothic-requiem-catafalque', 'large catafalque requiem black pall draped coffin tall candles lying in state funeral', {
    w: 44, h: 36, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 3, 41, b, PALL); // the step
      c.row(b - 3, 2, 41, GDARK);
      c.rect(6, 17, 37, b - 4, PALL);
      c.col(6, 17, b - 4, hex('#33303c'));
      for (const x of [12, 20, 28, 34]) c.line(x, 18, x + 1, b - 4, hex('#33303c'));
      c.rect(20, 20, 23, 21, C.steel); // a silver cross on the pall
      c.rect(21, 18, 22, 26, C.steel);
      for (let x = 6; x <= 37; x += 2) c.set(x, b - 4, C.steel);
      if (!u) {
        c.rect(8, 11, 35, 16, PALL); // the coffin under it
        c.row(10, 10, 33, PALL);
        c.row(10, 10, 33, GDARK);
        c.row(11, 8, 9, GDARK);
        c.row(16, 6, 37, hex('#33303c'));
        c.line(34, 11, 37, 17, PALL);
        c.line(9, 11, 6, 17, GDARK);
      } else {
        c.rect(8, 11, 35, 16, COFFIN); // the pall dragged half off
        c.row(10, 10, 33, COFFIN);
        c.row(10, 10, 33, L(COFFIN));
        c.row(12, 8, 35, D(COFFIN));
        for (const x of [12, 21, 30]) c.rect(x, 14, x + 2, 14, BRASS);
        c.poly([[22, 10], [35, 10], [38, 17], [26, 17]], PALL);
        c.line(22, 10, 26, 17, GDARK);
        c.line(30, 11, 32, 17, hex('#33303c'));
        c.row(9, 10, 17, hex('#141218')); // and the lid not quite shut
        c.set(13, 9, DEADF);
        c.set(14, 9, DEADF);
        dots(c, C.white, [16, 8, 18, 8, 17, 7]);
      }
      for (const x of [3, 39]) {
        c.rect(x, 9, x + 1, b - 4, BRASS); // tall candlesticks
        c.col(x, 9, b - 4, L(BRASS));
        c.rect(x - 1, b - 5, x + 2, b - 4, BRASS);
        c.rect(x - 1, 8, x + 2, 8, BRASS);
        c.rect(x - 1, 17, x + 2, 17, D(BRASS));
        candle(c, x, 7, u ? 4 : 6, u, WAX);
        candle(c, x + 1, 7, u ? 4 : 6, false, D(WAX));
        if (u) c.set(x + 2, 9, WAX);
      }
    },
    sw: 24, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 3, 21, b, PALL);
      c.row(b - 3, 2, 21, GDARK);
      c.rect(6, 17, 17, b - 4, PALL);
      c.col(6, 17, b - 4, hex('#33303c'));
      c.line(10, 18, 9, b - 4, hex('#33303c'));
      c.line(14, 18, 15, b - 4, hex('#33303c'));
      for (let x = 6; x <= 17; x += 2) c.set(x, b - 4, C.steel);
      if (!u) {
        c.poly([[8, 16], [9, 11], [11, 10], [12, 10], [14, 11], [15, 16]], PALL);
        c.line(8, 16, 9, 11, GDARK);
        c.row(10, 11, 12, GDARK);
        c.rect(11, 20, 12, 25, C.steel);
        c.rect(10, 21, 13, 22, C.steel);
      } else {
        c.poly([[8, 16], [9, 11], [11, 10], [12, 10], [14, 11], [15, 16]], COFFIN);
        c.line(8, 16, 9, 11, L(COFFIN));
        c.rect(11, 13, 12, 14, BRASS);
        c.poly([[12, 16], [17, 16], [19, 24], [13, 22]], PALL);
        c.row(10, 10, 13, hex('#141218'));
      }
      for (const x of [3, 19]) {
        c.rect(x, 9, x + 1, b - 4, BRASS);
        c.col(x, 9, b - 4, L(BRASS));
        c.rect(x - 1, b - 5, x + 2, b - 4, BRASS);
        c.rect(x - 1, 8, x + 2, 8, BRASS);
        candle(c, x, 7, u ? 4 : 6, u, WAX);
        candle(c, x + 1, 7, u ? 4 : 6, false, D(WAX));
      }
    },
  });
  add('gothic-organ-bellows-pump', 'organ bellows pump blower lever wind chest leather wedge church loft', {
    w: 30, h: 26, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        ty = u ? 6 : 14;
      c.rect(1, 2, 3, 20, BLACKW); // the wind trunk
      c.col(1, 2, 20, L(BLACKW));
      for (const x of [5, 20]) c.rect(x, 21, x + 1, b, EBONY);
      board(c, 3, 19, 23, 20, BLACKW);
      for (let x = 4; x <= 22; x++) {
        const y0 = Math.round(17 - ((17 - ty) * (x - 4)) / 18);
        for (let y = y0; y <= 18; y++) c.set(x, y, (y - y0) % 3 === 0 ? hex('#6e4a30') : hex('#4a3226')); // the leather folds
        c.set(x, y0 - 1, BLACKW);
        c.set(x, y0 - 2, L(BLACKW));
      }
      const wy = Math.round(17 - ((17 - ty) * 12) / 18) - 3;
      c.rect(14, wy - 2, 18, wy, GSTONE); // lead weights on the top board
      c.row(wy - 2, 14, 18, L(GSTONE));
      c.rect(25, 5, 26, b, BLACKW); // the pump handle on its post
      c.col(25, 5, b, L(BLACKW));
      c.rect(24, b, 27, b, EBONY);
      if (!u) {
        c.line(21, 12, 28, 3, hex('#6a5038'));
        c.line(22, 12, 28, 4, hex('#4a3a34'));
        c.set(28, 2, hex('#6a5038'));
      } else {
        c.line(21, 5, 28, 13, hex('#6a5038'));
        c.line(22, 5, 28, 12, hex('#4a3a34'));
        c.set(28, 14, hex('#6a5038'));
        dots(c, C.ash, [2, 0, 3, -1, 1, -1]);
      }
      c.set(25, 8, IRON);
    },
    u: [0, 2, 0],
    sw: 14, sh: 26,
    s(c, u) {
      const b = c.h - 2,
        ty = u ? 6 : 14;
      for (const x of [3, 9]) c.rect(x, 21, x + 1, b, EBONY);
      board(c, 2, 19, 11, 20, BLACKW);
      for (let y = ty; y <= 18; y++) c.row(y, 3, 10, (y - ty) % 3 === 0 ? hex('#6e4a30') : hex('#4a3226'));
      c.rect(2, ty - 2, 11, ty - 1, BLACKW);
      c.row(ty - 2, 2, 11, L(BLACKW));
      c.rect(5, ty - 4, 8, ty - 3, GSTONE);
      c.rect(12, u ? 12 : 2, 12, u ? 14 : 4, hex('#6a5038'));
    },
  });
  void [K, SOOT, face, GOLD, SAPPH, PURPLE];
};
