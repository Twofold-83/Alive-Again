/* Gothic, part 1: the large things of cathedral and churchyard road, and the furniture of the nave.
 * Part of tools/big/env2-medieval.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, hollow, wisp, stones, wheel, wheelEdge, chain, candle, post, archPt, skull } = H;
  const add = H.reg('env-gothic', 'Gothic');
  const { SOOT, PEWTER, WAX, EBONY, BLACKW, GSTONE, GDARK, PURPLE, PALL, WAT, SHROUD } = H.MED;
  const IRON = C.iron,
    BRASS = C.brass,
    GOLD = C.gold,
    RUBY = hex('#7a2c34'),
    SAPPH = hex('#34446a'),
    AMBER = hex('#a07e2c'),
    GLGREEN = hex('#3c5a40'),
    LEAD = hex('#1e1b24'),
    HGLASS = hex('#3a4a54'),
    COFFIN = hex('#4a3226');

  add('gothic-pipe-organ-great', 'large pipe organ great church cathedral pipes keyboard console black oak music', {
    w: 44, h: 54, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 3, 12, 40, b, BLACKW);
      const tower = (x0, x1, y0) => {
        c.rect(x0, y0, x1, 29, EBONY);
        for (let x = x0 + 1; x < x1; x += 2) {
          const t = y0 + 3 + Math.abs(x - (x0 + x1) / 2) * 0.8;
          c.rect(x, Math.round(t), x + 1, 27, PEWTER);
          c.col(x, Math.round(t), 27, L(PEWTER));
          c.set(x, 25, u ? C.glow : LEAD);
          c.set(x + 1, 25, LEAD);
        }
        c.poly([[x0 - 1, y0 + 1], [(x0 + x1) >> 1, y0 - 3], [((x0 + x1) >> 1) + 1, y0 - 3], [x1 + 1, y0 + 1]], BLACKW);
        c.line(x0 - 1, y0 + 1, (x0 + x1) >> 1, y0 - 3, L(BLACKW));
        c.set((x0 + x1) >> 1, y0 - 4, GOLD);
        c.row(y0 + 2, x0, x1, BRASS);
      };
      tower(4, 12, 9);
      tower(31, 39, 9);
      tower(13, 17, 14);
      tower(26, 30, 14);
      tower(18, 25, 5);
      c.rect(3, 28, 40, 29, BLACKW);
      c.row(28, 3, 40, L(BLACKW));
      c.rect(15, 30, 28, 35, EBONY); // the music desk
      face(c, 5, 30, 13, 36, EBONY);
      face(c, 30, 30, 38, 36, EBONY);
      for (const x0 of [6, 31])
        for (let i = 0; i < 6; i++) c.set(x0 + (i % 3) * 3 + (u && i === 4 ? 0 : 0), 31 + ((i / 3) | 0) * 3, u && (i === 1 || i === 4) ? C.white : C.bone);
      c.rect(12, 37, 31, 39, EBONY); // the keys
      c.row(37, 13, 30, C.bone);
      for (let x = 14; x <= 29; x += 2) c.set(x, 37, x % 3 ? C.bone : LEAD);
      c.row(38, 13, 30, C.bone);
      for (let x = 13; x <= 30; x += 3) c.set(x, 38, D(C.bone));
      panel(c, 6, 41, 18, b - 6, BLACKW);
      panel(c, 25, 41, 37, b - 6, BLACKW);
      c.rect(14, b - 9, 29, b - 8, EBONY); // the bench
      c.row(b - 9, 14, 29, L(BLACKW));
      c.rect(15, b - 7, 16, b, EBONY);
      c.rect(27, b - 7, 28, b, EBONY);
      c.row(b - 1, 17, 26, BRASS); // pedals
      for (let x = 18; x <= 26; x += 2) c.set(x, b, D(BRASS));
      for (const x of [14, 29]) {
        c.rect(x, 35, x, 36, BRASS);
        candle(c, x, 34, u ? 2 : 3, u, WAX);
      }
      if (!u) {
        c.rect(18, 32, 25, 34, hex('#5a2c2c')); // the book shut
        c.row(32, 18, 25, L(hex('#5a2c2c')));
      } else {
        c.rect(17, 31, 26, 35, C.paper);
        c.col(21, 31, 35, D(C.paper));
        for (const y of [32, 34]) {
          c.row(y, 18, 20, LEAD);
          c.row(y, 23, 25, LEAD);
        }
        dots(c, LEAD, [19, 33, 24, 33]);
        dots(c, C.glow, [8, 6, 35, 4, 21, 0, 16, 9]);
        dots(c, D(C.glow), [9, 4, 34, 6, 27, 10]);
        c.rect(17, 37, 18, 37, D(C.bone));
        c.rect(24, 38, 26, 38, D(C.bone));
      }
    },
    sw: 22, sh: 54,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 4, 13, 12, EBONY);
      for (let x = 4; x <= 12; x += 2) {
        c.rect(x, 3 + (x % 3), x + 1, 12, PEWTER);
        c.col(x, 3 + (x % 3), 12, L(PEWTER));
      }
      face(c, 3, 12, 14, b, BLACKW);
      c.row(12, 3, 14, BRASS);
      panel(c, 5, 15, 12, 26, BLACKW);
      panel(c, 5, 30, 12, b - 3, BLACKW);
      c.rect(3, 28, 14, 29, BLACKW);
      c.row(28, 3, 14, L(BLACKW));
      c.line(15, 35, 17, 30, EBONY); // the desk
      c.rect(15, 37, 18, 39, EBONY);
      c.row(37, 15, 18, C.bone);
      c.rect(16, b - 9, 20, b - 8, EBONY);
      c.row(b - 9, 16, 20, L(BLACKW));
      c.rect(17, b - 7, 18, b, EBONY);
      c.row(b, 15, 16, BRASS);
      c.set(16, 36, BRASS);
      candle(c, 16, 35, u ? 2 : 3, u, WAX);
      if (u) {
        c.line(16, 34, 18, 30, C.paper);
        dots(c, C.glow, [7, 1, 11, 0]);
      } else c.line(16, 34, 18, 31, hex('#5a2c2c'));
    },
  });
  add('gothic-hearse-funeral-carriage', 'large hearse funeral carriage black glass coffin plumes horse drawn undertaker', {
    w: 48, h: 32, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.row(23, 8, 38, IRON);
      c.rect(6, 8, 35, 21, EBONY);
      c.rect(5, 6, 36, 7, EBONY); // roof
      c.row(6, 5, 36, GDARK);
      for (const x of [7, 20, 33]) {
        c.col(x, 3, 5, EBONY); // plumes
        c.rect(x - 1, 1, x + 1, 3, PALL);
        c.set(x - 1, 1, GDARK);
        c.set(x, 0, PALL);
      }
      for (const x0 of [8, 17, 26]) {
        c.rect(x0, 10, x0 + 7, 19, HGLASS); // the glass
        c.row(10, x0, x0 + 7, PURPLE);
        c.set(x0, 11, PURPLE);
        c.set(x0 + 7, 11, PURPLE);
        c.set(x0 + 1, 12, L(HGLASS));
        c.set(x0 + 2, 11, L(HGLASS));
      }
      c.row(20, 6, 35, BRASS);
      if (!u) {
        for (const x0 of [8, 17, 26]) {
          c.rect(x0, 14, x0 + 7, 18, COFFIN); // the coffin inside
          c.row(14, x0, x0 + 7, L(COFFIN));
          c.set(x0 + 3, 16, BRASS);
        }
        c.rect(8, 13, 9, 13, HGLASS);
        dots(c, C.white, [20, 13, 22, 13, 21, 12]); // lilies on the lid
        c.set(21, 13, C.leaf);
      } else {
        for (const x0 of [8, 17, 26]) c.row(19, x0, x0 + 7, PURPLE); // empty: only the cloth
        dots(c, D(PURPLE), [12, 19, 22, 19, 30, 19]);
        c.rect(9, 17, 12, 18, PURPLE);
        c.rect(2, 8, 4, 21, EBONY); // the back door standing open
        c.col(2, 8, 21, GDARK);
        c.rect(3, 10, 3, 18, HGLASS);
        c.line(4, 22, 2, b - 2, PURPLE);
        dots(c, C.white, [3, b, 5, b - 1]);
        c.set(4, b, C.leaf);
      }
      c.rect(37, 11, 43, 13, EBONY); // the box
      c.row(11, 37, 43, GDARK);
      c.col(37, 14, 21, EBONY);
      c.line(38, 21, 43, 19, EBONY);
      c.rect(37, 6, 38, 9, IRON);
      c.set(37, 7, u ? C.flameLight : HGLASS);
      c.set(38, 8, u ? C.flame : D(HGLASS));
      c.line(40, b - 7, 47, b - 9, EBONY);
      wheel(c, 13, b - 6, 6, GDARK, BRASS);
      wheel(c, 32, b - 5, 5, GDARK, BRASS);
    },
    u: [0, 0, 0],
    sw: 26, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 1, 3, b - 12, b, GDARK);
      wheelEdge(c, 22, 24, b - 12, b, GDARK);
      c.row(b - 6, 4, 21, IRON);
      face(c, 5, 8, 20, 21, EBONY);
      c.rect(4, 6, 21, 7, EBONY);
      c.row(6, 4, 21, GDARK);
      for (const x of [6, 19]) {
        c.col(x, 3, 5, EBONY);
        c.rect(x - 1, 1, x + 1, 3, PALL);
        c.set(x - 1, 1, GDARK);
      }
      c.row(20, 5, 20, BRASS);
      for (const x of [2, 22]) {
        c.rect(x, 9, x + 1, 12, IRON);
        c.set(x, 10, u ? C.flameLight : HGLASS);
        c.set(x + 1, 11, u ? C.flame : D(HGLASS));
      }
      if (!u) {
        H.archRd(c, 8, 10, 17, 19, HGLASS); // the door glass, the coffin's foot behind it
        c.rect(10, 14, 15, 19, COFFIN);
        c.row(14, 10, 15, L(COFFIN));
        c.rect(12, 16, 13, 17, BRASS);
        c.set(9, 12, L(HGLASS));
        c.col(12, 10, 13, EBONY);
        c.set(13, 15, BRASS);
      } else {
        c.rect(7, 9, 18, 19, hex('#141218'));
        c.rect(7, 18, 18, 19, PURPLE);
        dots(c, D(PURPLE), [10, 19, 15, 18]);
        c.rect(4, 9, 6, 19, EBONY); // both leaves open
        c.col(4, 9, 19, GDARK);
        c.rect(19, 9, 21, 19, EBONY);
        c.col(5, 11, 17, HGLASS);
        c.col(20, 11, 17, HGLASS);
        c.poly([[11, 20], [15, 20], [16, b - 2], [14, b], [10, b - 1]], PURPLE);
        c.line(11, 20, 10, b - 1, L(PURPLE));
        dots(c, C.white, [17, b, 8, b]);
      }
    },
  });
  add('gothic-stained-glass-window-great', 'large stained glass window great cathedral lancet saints tracery stone frame coloured', {
    w: 34, h: 54, solid: true,
    f(c, u) {
      const b = c.h - 2,
        M = hex('#010203'),
        cols = [RUBY, SAPPH, AMBER, GLGREEN, SAPPH, RUBY, hex('#48305a')],
        r = rnd(11),
        cell = {};
      archPt(c, 1, 1, 32, b - 3, GSTONE, 16);
      c.rect(1, b - 2, 32, b, GSTONE); // the sill
      c.row(b - 2, 1, 32, L(GSTONE));
      for (let y = 2; y < 18; y++) for (let x = 1; x <= 16; x++) if (c.get(x, y) && !c.get(x - 1, y)) c.set(x, y, L(GSTONE));
      c.col(1, 17, b - 3, L(GSTONE));
      archPt(c, 4, 5, 29, b - 4, M, 14);
      for (let y = 5; y <= b - 4; y++)
        for (let x = 4; x <= 29; x++) {
          if (c.get(x, y) !== M) continue;
          const k = ((x + (((y / 4) | 0) % 2) * 2) >> 2) + ',' + ((y / 4) | 0);
          if (!(k in cell)) cell[k] = cols[Math.floor(r() * cols.length)];
          c.set(x, y, (x + (((y / 4) | 0) % 2) * 2) % 4 === 0 || y % 4 === 0 ? LEAD : cell[k]);
        }
      c.rect(16, 16, 17, b - 4, GSTONE); // the mullion and the eye above it
      c.col(16, 16, b - 4, L(GSTONE));
      c.oval(13, 7, 20, 14, GSTONE);
      c.oval(14, 8, 19, 13, AMBER);
      c.rect(16, 8, 17, 13, LEAD);
      c.rect(14, 10, 19, 11, LEAD);
      c.rect(16, 10, 17, 11, RUBY);
      const saint = (x, robe) => {
        c.oval(x - 3, 19, x + 3, 25, AMBER); // halo
        c.oval(x - 1, 21, x + 1, 24, C.flesh);
        c.set(x, 23, LEAD);
        for (let y = 26; y <= 42; y++) for (let xx = x - 2 - (y > 32 ? 1 : 0); xx <= x + 2 + (y > 32 ? 1 : 0); xx++) c.set(xx, y, y % 4 === 0 ? LEAD : xx === x ? D(robe) : robe);
        c.set(x - 2, 30, C.flesh);
        c.set(x + 2, 30, C.flesh);
      };
      saint(10, RUBY);
      saint(23, SAPPH);
      if (u) {
        const N = C.night;
        c.poly([[20, 22], [26, 19], [28, 27], [25, 35], [21, 31]], N); // a hole in the saint, the night beyond
        dots(c, N, [19, 24, 27, 18, 26, 36, 24, 37, 29, 30]);
        c.set(25, 23, C.ghost);
        c.set(23, 27, hex('#3a3a50'));
        c.line(20, 22, 18, 20, LEAD);
        c.line(25, 35, 26, 40, LEAD);
        c.line(28, 27, 29, 25, LEAD);
        dots(c, SAPPH, [22, b - 3, 25, b - 3, 27, b - 4]);
        dots(c, AMBER, [24, b - 3, 20, b - 3]);
        dots(c, C.flesh, [26, b - 3]);
      }
      dots(c, D(GSTONE), [3, 30, 31, 22, 2, 44, 30, 40, 10, b - 1, 22, b]);
    },
    sw: 10, sh: 54,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 2, 1, 6, b - 3, GSTONE, 6, 5, 3);
      c.col(2, 1, b - 3, L(GSTONE));
      c.col(7, 5, b - 4, LEAD);
      for (let y = 6; y < b - 4; y += 4) c.set(7, y, [RUBY, SAPPH, AMBER, GLGREEN][(y >> 2) % 4]);
      c.rect(1, b - 2, 8, b, GSTONE);
      c.row(b - 2, 1, 8, L(GSTONE));
      if (u) {
        for (let y = 20; y <= 34; y++) c.clear(7, y);
        dots(c, SAPPH, [8, b - 3, 10, b]);
        dots(c, AMBER, [9, b, 11, b - 1]);
      }
    },
    su: [0, 0, 3],
  });
  add('gothic-sarcophagus-on-bier', 'large sarcophagus on bier stone tomb chest coped lid crypt cathedral arcade', {
    w: 46, h: 26, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        d = u ? 8 : 0;
      c.rect(2, b - 2, 43, b, GSTONE); // plinth
      c.row(b - 2, 2, 43, L(GSTONE));
      c.rect(5, 16, 40, b - 3, hex('#2a2a32'));
      for (const x of [5, 16, 27, 38]) {
        c.rect(x, 16, x + 2, b - 3, GSTONE); // little columns
        c.col(x, 16, b - 3, L(GSTONE));
        c.set(x - 1, 16, GSTONE);
        c.set(x + 3, 16, GSTONE);
      }
      c.rect(3, 9, 42, 15, GSTONE); // the chest
      c.row(9, 3, 42, L(GSTONE));
      c.row(15, 3, 42, D(GSTONE));
      for (let x = 6; x <= 36; x += 6) {
        c.rect(x, 11, x + 3, 13, D(GSTONE)); // quatrefoils
        c.set(x + 1, 12, GDARK);
        c.set(x + 2, 12, GDARK);
      }
      if (u) {
        c.rect(4, 8, 10, 9, SOOT); // open at the head
        c.rect(4, 8, 4, 8, GSTONE);
        c.col(8, 8, 12, C.bone); // a hand over the rim
        c.col(9, 9, 11, C.bone);
        c.set(7, 9, C.bone);
        c.set(8, 13, D(C.bone));
      }
      c.rect(4 + d, 6, 41 + d, 8, L(GSTONE)); // the lid
      c.rect(6 + d, 4, 39 + d, 5, L(GSTONE));
      c.row(4, 7 + d, 38 + d, C.stoneLight);
      c.row(8, 4 + d, 41 + d, GSTONE);
      c.row(6, 10 + d, 35 + d, D(GSTONE)); // a long cross on it
      c.col(14 + d, 5, 7, D(GSTONE));
      dots(c, C.moss, [3, b, 20, b - 1, 41, b]);
      if (u) dots(c, C.stoneLight, [12, 9, 44, 11, 46, b, 48, b]);
    },
    u: [0, 0, 8],
    sw: 22, sh: 26,
    s(c, u) {
      const b = c.h - 2,
        d = u ? 4 : 0;
      c.rect(2, b - 2, 19, b, GSTONE);
      c.row(b - 2, 2, 19, L(GSTONE));
      c.rect(5, 16, 16, b - 3, hex('#2a2a32'));
      for (const x of [4, 15]) {
        c.rect(x, 16, x + 2, b - 3, GSTONE);
        c.col(x, 16, b - 3, L(GSTONE));
      }
      c.rect(3, 9, 18, 15, GSTONE);
      c.row(9, 3, 18, L(GSTONE));
      c.row(15, 3, 18, D(GSTONE));
      c.rect(9, 11, 12, 13, D(GSTONE));
      c.set(10, 12, GDARK);
      c.set(11, 12, GDARK);
      if (u) {
        c.rect(4, 8, 7, 9, SOOT);
        c.col(5, 8, 12, C.bone);
        c.set(6, 9, C.bone);
      }
      c.poly([[4 + d, 8], [10 + d, 3], [11 + d, 3], [17 + d, 8]], L(GSTONE));
      c.row(8, 4 + d, 17 + d, GSTONE);
      c.line(4 + d, 8, 10 + d, 3, C.stoneLight);
      c.col(10 + d, 5, 7, D(GSTONE));
    },
    su: [0, 0, 4],
  });
  add('gothic-confessional-booth', 'confessional booth box church confession curtains purple lattice dark wood priest', {
    w: 34, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, 8, 31, b - 2, BLACKW);
      c.rect(1, 5, 32, 7, EBONY); // cornice
      c.row(5, 1, 32, L(BLACKW));
      c.poly([[11, 5], [16, 1], [17, 1], [22, 5]], BLACKW);
      c.line(11, 5, 16, 1, L(BLACKW));
      c.rect(16, 2, 17, 4, BRASS);
      c.rect(15, 3, 18, 3, BRASS);
      board(c, 1, b - 1, 32, b, EBONY);
      for (const x0 of [3, 23]) {
        archPt(c, x0, 10, x0 + 7, b - 2, hex('#141218'), 5);
        if (!(u && x0 === 3)) {
          for (let x = x0; x <= x0 + 7; x++) for (let y = 10; y <= b - 4; y++) if (c.get(x, y) && c.get(x, y)[0] === 0x14) c.set(x, y, (x - x0) % 3 === 2 ? D(PURPLE) : PURPLE);
          for (let y = 11; y <= b - 4; y++) if (c.get(x0, y) && c.get(x0, y) !== BLACKW) c.set(x0, y, L(PURPLE));
          c.row(b - 4, x0, x0 + 7, BRASS);
        } else {
          c.col(x0, 12, b - 3, PURPLE); // drawn aside
          c.col(x0 + 1, 13, b - 3, D(PURPLE));
          c.set(x0 + 1, 22, BRASS);
          c.rect(x0 + 3, b - 6, x0 + 7, b - 5, BLACKW); // the kneeler
          c.row(b - 6, x0 + 3, x0 + 7, L(BLACKW));
          c.rect(x0 + 6, 20, x0 + 7, 24, BRASS); // the little grille
          c.set(x0 + 6, 21, K);
          c.set(x0 + 7, 23, K);
        }
      }
      face(c, 12, 10, 21, b - 2, BLACKW); // the priest's door
      panel(c, 14, 26, 19, b - 5, BLACKW);
      c.rect(14, 13, 19, 21, hex('#141218'));
      for (let y = 13; y <= 21; y++) for (let x = 14; x <= 19; x++) if ((x + y) % 3 === 0) c.set(x, y, BRASS);
      c.set(20, 24, BRASS);
      if (u) {
        c.set(15, 16, C.glow); // somebody is already in there
        c.set(18, 16, C.glow);
        c.set(15, 17, hex('#141218'));
        c.set(18, 17, hex('#141218'));
      }
    },
    sw: 16, sh: 46,
    s(c, u) {
      const b = c.h - 2;
      face(c, 3, 8, 12, b - 2, BLACKW);
      c.rect(2, 5, 13, 7, EBONY);
      c.row(5, 2, 13, L(BLACKW));
      c.rect(7, 2, 8, 4, BLACKW);
      panel(c, 5, 11, 10, 24, BLACKW);
      panel(c, 5, 27, 10, b - 5, BLACKW);
      board(c, 2, b - 1, 13, b, EBONY);
      c.col(13, 12, b - 3, PURPLE);
      if (u) {
        c.col(14, 14, b - 4, D(PURPLE));
        c.set(14, 22, BRASS);
      }
    },
  });
  add('gothic-pulpit-carved', 'pulpit carved church sermon preacher sounding board dark oak stair bible', {
    w: 24, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(10, 6, 13, 18, EBONY); // the back post
      c.rect(3, 2, 20, 5, BLACKW); // sounding board
      c.row(2, 3, 20, L(BLACKW));
      c.row(5, 3, 20, EBONY);
      dots(c, BRASS, [3, 6, 20, 6, 11, 1, 12, 1]);
      c.rect(9, 30, 14, b - 3, BLACKW); // stem
      c.col(9, 30, b - 3, L(BLACKW));
      c.rect(6, b - 2, 17, b, EBONY);
      c.row(b - 2, 6, 17, L(BLACKW));
      c.poly([[4, 29], [19, 29], [15, 32], [8, 32]], EBONY);
      face(c, 3, 18, 20, 28, BLACKW); // the tub
      c.rect(2, 16, 21, 17, EBONY);
      c.row(16, 2, 21, L(BLACKW));
      for (const x0 of [4, 16]) {
        archPt(c, x0, 20, x0 + 3, 27, EBONY, 3);
      }
      c.rect(9, 18, 14, 25, PURPLE); // the fall
      c.col(9, 18, 25, L(PURPLE));
      c.rect(11, 19, 12, 23, BRASS);
      c.rect(10, 20, 13, 20, BRASS);
      for (let x = 9; x <= 14; x += 2) c.set(x, 26, BRASS);
      c.set(5, 15, BRASS);
      candle(c, 5, 14, 3, u, WAX);
      if (!u) {
        c.rect(9, 14, 14, 15, hex('#4a2626')); // the bible shut
        c.row(14, 9, 14, L(hex('#4a2626')));
        c.set(14, 15, BRASS);
      } else {
        c.rect(8, 14, 15, 15, C.paper);
        c.col(11, 14, 15, D(C.paper));
        c.row(13, 9, 14, C.paper);
        c.set(12, 13, RUBY);
        c.col(12, 16, 19, RUBY); // the marker ribbon hangs out
        dots(c, C.blood, [17, 19, 18, 20, 17, 21, 18, 22, 17, 24]);
      }
    },
    sw: 24, sh: 46,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 6, 4, 18, EBONY);
      c.rect(1, 2, 15, 5, BLACKW);
      c.row(2, 1, 15, L(BLACKW));
      c.row(5, 1, 15, EBONY);
      c.set(15, 6, BRASS);
      c.rect(6, 30, 10, b - 3, BLACKW);
      c.col(6, 30, b - 3, L(BLACKW));
      c.rect(4, b - 2, 12, b, EBONY);
      c.poly([[3, 29], [13, 29], [10, 32], [6, 32]], EBONY);
      face(c, 2, 18, 13, 28, BLACKW);
      c.rect(1, 16, 14, 17, EBONY);
      c.row(16, 1, 14, L(BLACKW));
      archPt(c, 4, 20, 7, 27, EBONY, 3);
      c.col(13, 18, 25, PURPLE);
      for (let i = 0; i < 4; i++) {
        const x = 14 + i * 2,
          y = 24 + i * 5;
        c.rect(x, y, x + 2, b, BLACKW); // the stair
        c.row(y, x, x + 2, L(BLACKW));
        c.col(x + 2, y + 1, b, EBONY);
      }
      c.line(15, 16, 22, 34, EBONY);
      c.col(22, 34, b, EBONY);
      candle(c, 11, 14, 3, u, WAX);
      c.set(11, 15, BRASS);
      if (!u) c.rect(12, 14, 14, 15, hex('#4a2626'));
      else {
        c.rect(12, 14, 14, 15, C.paper);
        c.set(13, 13, C.paper);
        c.set(14, 17, RUBY);
      }
    },
  });
  add('gothic-pew-oak-carved', 'pew church bench carved dark oak poppy head seat kneeler hymn book', {
    w: 34, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 4, 7, 29, 15, BLACKW);
      for (let x = 8; x <= 26; x += 6) panel(c, x - 3, 9, x + 1, 14, BLACKW);
      c.row(6, 4, 29, EBONY);
      c.rect(4, 16, 29, 17, hex('#4a3a34')); // the seat
      c.row(16, 4, 29, L(hex('#4a3a34')));
      c.rect(4, 18, 29, b - 3, EBONY);
      c.rect(5, b - 2, 28, b - 1, BLACKW); // kneeler
      c.row(b - 2, 5, 28, L(BLACKW));
      for (const x of [1, 29]) {
        c.rect(x, 6, x + 3, b, BLACKW); // the ends
        c.col(x, 6, b, L(BLACKW));
        c.rect(x + 1, 2, x + 2, 5, BLACKW);
        c.set(x, 3, BLACKW);
        c.set(x + 3, 3, BLACKW);
        c.set(x + 1, 1, L(BLACKW));
        c.rect(x + 1, 9, x + 2, 12, EBONY);
      }
      if (!u) {
        c.rect(8, 14, 11, 15, hex('#4a2626'));
        c.row(14, 8, 11, L(hex('#4a2626')));
      } else {
        c.rect(7, 14, 12, 15, C.paper); // a hymn book left open
        c.col(9, 14, 15, D(C.paper));
        c.rect(19, 5, 25, 11, PALL); // and a black shawl over the back
        c.row(5, 19, 25, GDARK);
        c.col(19, 6, 11, hex('#33303c'));
        dots(c, PALL, [19, 12, 21, 12, 23, 12, 25, 12, 20, 13, 24, 13]);
        c.rect(20, 15, 24, 15, C.rot); // a wilted posy
        c.set(22, 14, C.white);
        dots(c, WAT, [14, b, 17, b - 1, 20, b]);
      }
    },
    sw: 14, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, b], [2, 7], [3, 6], [5, 6], [6, 7], [6, 15], [11, 16], [11, b]], BLACKW);
      c.rect(3, 2, 4, 5, BLACKW);
      c.set(2, 3, BLACKW);
      c.set(5, 3, BLACKW);
      c.set(3, 1, L(BLACKW));
      c.col(2, 7, b, L(BLACKW));
      c.rect(3, 9, 4, 13, EBONY);
      c.rect(4, 17, 9, b - 2, EBONY);
      c.row(16, 6, 11, L(hex('#4a3a34')));
      c.rect(11, b - 2, 12, b - 1, BLACKW);
      if (u) {
        c.rect(5, 5, 7, 11, PALL);
        c.row(5, 5, 7, GDARK);
        c.set(6, 12, PALL);
        c.rect(8, 15, 9, 15, C.paper);
      }
    },
  });
  add('gothic-altar-with-candles', 'altar with candles stone church crucifix chalice purple frontal cloth holy table', {
    w: 38, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 4, 16, 33, b, GSTONE);
      for (const x0 of [5, 27]) archPt(c, x0, 18, x0 + 5, b - 1, GDARK, 4);
      c.rect(2, 14, 35, 15, L(GSTONE)); // the mensa
      c.row(15, 2, 35, GSTONE);
      c.rect(3, 13, 34, 14, C.white); // the fair linen
      c.rect(3, 15, 5, 19, C.white);
      c.rect(32, 15, 34, 19, C.white);
      dots(c, D(C.white), [3, 20, 5, 20, 32, 20, 34, 20, 4, 17, 33, 17]);
      c.rect(11, 16, 26, b - 3, PURPLE); // the frontal
      c.col(11, 16, b - 3, L(PURPLE));
      c.rect(18, 18, 19, 25, GOLD);
      c.rect(16, 20, 21, 21, GOLD);
      for (let x = 11; x <= 26; x += 2) c.set(x, b - 2, GOLD);
      c.rect(18, 2, 19, 11, BRASS); // the cross
      c.rect(16, 4, 21, 5, BRASS);
      c.col(18, 2, 11, L(BRASS));
      c.rect(17, 12, 20, 12, BRASS);
      for (const x of [7, 30]) {
        c.rect(x - 1, 12, x + 1, 12, BRASS);
        c.col(x, 9, 11, BRASS);
        c.set(x - 1, 9, BRASS);
        c.set(x + 1, 9, BRASS);
        candle(c, x, 8, u ? 4 : 6, u, WAX);
        if (u) c.set(x - 1, 8, WAX);
      }
      c.rect(24, 11, 28, 12, hex('#4a2626')); // the missal
      if (!u) {
        c.rect(11, 8, 13, 9, GOLD); // the chalice
        c.set(12, 10, GOLD);
        c.set(12, 11, GOLD);
        c.rect(11, 12, 13, 12, D(GOLD));
        c.row(8, 11, 13, L(GOLD));
        c.row(11, 24, 28, L(hex('#4a2626')));
      } else {
        c.rect(10, 11, 12, 12, GOLD); // knocked over
        c.col(10, 11, 12, L(GOLD));
        c.row(12, 13, 14, GOLD);
        c.col(15, 11, 12, D(GOLD));
        dots(c, C.blood, [9, 13, 10, 13, 11, 13, 12, 14, 13, 14, 13, 13, 14, 14, 13, 15, 13, 16, 14, 17, 13, 18, 14, 20, 13, 22]);
        c.rect(23, 11, 29, 12, C.paper);
        c.col(26, 11, 12, D(C.paper));
      }
    },
    sw: 16, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      face(c, 3, 16, 12, b, GSTONE);
      archPt(c, 5, 18, 10, b - 1, GDARK, 4);
      c.rect(2, 14, 13, 15, L(GSTONE));
      c.rect(2, 13, 13, 14, C.white);
      c.rect(2, 15, 13, 19, C.white);
      for (let x = 2; x <= 13; x += 2) c.set(x, 20, D(C.white));
      c.row(17, 3, 12, D(C.white));
      c.col(4, 2, 12, BRASS);
      c.set(5, 12, BRASS);
      c.set(3, 12, BRASS);
      c.rect(8, 12, 10, 12, BRASS);
      c.col(9, 9, 11, BRASS);
      candle(c, 9, 8, u ? 4 : 6, u, WAX);
      if (u) {
        dots(c, C.blood, [11, 13, 12, 14, 12, 16, 11, 18, 12, 19]);
        c.set(12, 12, GOLD);
      } else {
        c.rect(11, 9, 12, 9, GOLD);
        c.col(12, 10, 12, GOLD);
      }
    },
  });
  add('gothic-reliquary-casket', 'reliquary casket shrine gold relic saint bone crystal enamel chasse', {
    w: 18, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 10, 14, b - 1, GOLD);
      c.row(10, 3, 14, L(GOLD));
      c.row(b - 1, 3, 14, D(GOLD));
      for (const x0 of [4, 12]) {
        c.rect(x0, 12, x0 + 1, b - 3, SAPPH); // enamel saints
        c.set(x0, 12, C.flesh);
      }
      c.rect(7, 12, 10, b - 3, HGLASS); // the crystal
      c.set(7, 12, L(HGLASS));
      c.set(9, 14, C.bone);
      c.set(8, 15, C.bone);
      c.rect(3, b, 4, b, D(GOLD));
      c.rect(13, b, 14, b, D(GOLD));
      dots(c, RUBY, [6, 11, 11, 11]);
      if (!u) {
        c.poly([[2, 9], [5, 5], [12, 5], [15, 9]], GOLD);
        c.line(2, 9, 5, 5, L(GOLD));
        c.row(9, 2, 15, D(GOLD));
        for (let x = 5; x <= 12; x += 2) c.set(x, 4, GOLD);
        c.col(8, 1, 4, GOLD);
        c.set(7, 2, GOLD);
        c.set(9, 2, GOLD);
        dots(c, RUBY, [8, 7]);
        dots(c, D(GOLD), [5, 7, 11, 7, 6, 8, 10, 6]);
      } else {
        c.poly([[3, 1], [14, -1], [14, 1], [3, 3]], D(GOLD)); // the roof lifted back
        c.line(3, 1, 14, -1, GOLD);
        c.rect(3, 8, 14, 9, PURPLE);
        skull(c, 6, 4);
        c.set(12, 8, C.bone);
        c.set(13, 7, C.bone);
        dots(c, C.glow, [4, 5, 13, 4, 9, 2]);
      }
    },
    u: [0, 2, 0],
    sw: 12, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 10, 8, b - 1, GOLD);
      c.col(3, 10, b - 1, L(GOLD));
      c.row(b - 1, 3, 8, D(GOLD));
      c.rect(5, 12, 6, b - 3, SAPPH);
      c.set(5, 12, C.flesh);
      c.set(3, b, D(GOLD));
      c.set(8, b, D(GOLD));
      if (!u) {
        c.poly([[2, 9], [5, 5], [6, 5], [9, 9]], GOLD);
        c.line(2, 9, 5, 5, L(GOLD));
        c.row(9, 2, 9, D(GOLD));
        c.set(5, 7, RUBY);
        c.col(5, 1, 4, GOLD);
        c.set(6, 2, GOLD);
      } else {
        c.rect(1, 0, 2, 8, D(GOLD));
        c.col(1, 0, 8, GOLD);
        c.rect(3, 8, 8, 9, PURPLE);
        c.rect(4, 5, 7, 7, C.bone);
        c.set(5, 6, K);
        dots(c, C.glow, [6, 3, 9, 5]);
      }
    },
    su: [0, 2, 0],
  });
  /** The censer on its stand: dx shifts the arm (front) or puts the pot before the pole (side). */
  const censer = (side) => (c, u) => {
    const b = c.h - 2,
      px = side ? 6 : 3,
      cx = (side ? 6 : 9) + (u ? 1 : 0);
    c.rect(px, 3, px, b - 1, IRON);
    c.line(px, b - 2, px - 2, b, IRON);
    c.line(px, b - 2, px + 3, b, D(IRON));
    if (!side) {
      c.row(3, 3, 9, IRON);
      c.set(4, 4, IRON);
      c.set(9, 4, IRON);
    } else c.rect(5, 2, 7, 3, IRON);
    const tx = side ? 6 : 9;
    chain(c, tx, 5, cx - 2, 15, BRASS);
    chain(c, tx, 5, cx + 2, 15, BRASS);
    chain(c, tx, 5, cx, 13, D(BRASS));
    c.rect(cx - 2, 16, cx + 2, 18, BRASS); // the pierced lid
    c.row(15, cx - 1, cx + 1, BRASS);
    c.set(cx, 14, L(BRASS));
    dots(c, u ? C.flame : K, [cx - 1, 17, cx + 1, 17, cx, 16]);
    c.oval(cx - 3, 19, cx + 3, 23, BRASS);
    c.row(19, cx - 3, cx + 3, L(BRASS));
    c.set(cx - 2, 20, L(BRASS));
    c.rect(cx - 1, 24, cx + 1, 24, D(BRASS));
    if (u) {
      wisp(c, cx - 1, 13, 5, C.ghost);
      wisp(c, cx + 1, 11, 6);
      wisp(c, cx + 2, 7, 5, C.ghost);
      dots(c, C.ash, [cx + 3, 3, cx + 4, 1, cx - 2, 6]);
    }
  };
  add('gothic-censer-on-stand', 'censer thurible incense burner brass chains iron stand smoke church', {
    w: 15, h: 38,
    f: censer(false),
    sw: 14, sh: 38,
    s: censer(true),
  });
  add('gothic-gargoyle-waterspout', 'gargoyle waterspout stone grotesque demon winged crouching plinth cathedral', {
    w: 24, h: 26, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 3, 19, b, GDARK); // plinth
      c.row(b - 3, 3, 19, GSTONE);
      c.poly([[4, 3], [9, 6], [11, 13], [6, 14]], GDARK); // the wing
      c.line(4, 3, 6, 14, GSTONE);
      c.line(6, 6, 8, 13, GSTONE);
      c.oval(4, 12, 13, b - 4, GSTONE); // haunch
      c.rect(10, 9, 16, 17, GSTONE); // chest
      c.rect(14, 16, 16, b - 4, GSTONE); // foreleg
      c.rect(14, b - 5, 18, b - 4, GSTONE);
      c.rect(13, 4, 19, 9, GSTONE); // head
      c.rect(19, 6, 21, 7, GSTONE); // snout
      c.rect(19, 9, 21, 9, GSTONE); // jaw
      c.rect(18, 8, 20, 8, K);
      c.set(14, 3, GSTONE); // horn
      c.set(13, 2, L(GSTONE));
      c.row(4, 13, 19, L(GSTONE));
      c.line(10, 9, 5, 14, L(GSTONE));
      dots(c, D(GSTONE), [8, 17, 11, 15, 15, 12, 12, 19, 7, 20, 16, 20]);
      c.line(3, b - 4, 2, b - 8, GSTONE); // tail
      c.set(3, b - 9, GSTONE);
      c.set(17, 6, u ? C.flame : K);
      dots(c, C.moss, [5, b - 3, 12, 9, 6, 13, 17, b - 2]);
      if (u) {
        c.set(16, 6, C.red);
        for (const [x, y] of [[21, 8], [22, 8], [23, 9], [24, 10], [24, 11], [25, 12], [25, 13], [25, 15], [25, 17], [25, 19], [25, 21]]) c.set(x, y, WAT);
        dots(c, L(WAT), [22, 8, 24, 10, 25, 14]);
        c.row(b, 22, 27, WAT);
        c.set(24, b - 1, L(WAT));
      }
    },
    u: [0, 0, 5],
    sw: 18, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 3, 15, b, GDARK);
      c.row(b - 3, 2, 15, GSTONE);
      for (const s of [0, 1]) {
        const m = (x) => (s ? 17 - x : x);
        c.poly([[m(1), 3], [m(4), 6], [m(5), 13], [m(2), 12]], GDARK);
        c.line(m(1), 3, m(2), 12, GSTONE);
        c.set(m(5), 2, GSTONE); // horns
        c.set(m(4), 1, s ? GSTONE : L(GSTONE));
        c.rect(m(5), b - 5, m(6), b - 4, GSTONE);
      }
      c.rect(4, 10, 13, b - 4, GSTONE);
      c.col(4, 10, b - 4, L(GSTONE));
      c.rect(5, 3, 12, 9, GSTONE);
      c.row(3, 5, 12, L(GSTONE));
      c.rect(7, 7, 10, 10, GSTONE);
      c.rect(7, 9, 10, 9, K); // the mouth
      c.set(6, 6, u ? C.flame : K);
      c.set(11, 6, u ? C.flame : K);
      c.col(8, 13, b - 5, D(GSTONE));
      c.col(9, 13, b - 5, D(GSTONE));
      dots(c, D(GSTONE), [5, 15, 12, 17, 6, 19]);
      dots(c, C.moss, [4, b - 3, 12, 10, 13, b - 2]);
      if (u) {
        c.col(8, 10, b - 4, WAT);
        c.col(9, 10, b - 5, L(WAT));
        c.row(b, 6, 12, WAT);
      }
    },
  });
  void [K, mix, blend, hollow, post, GDARK, SHROUD];
};
