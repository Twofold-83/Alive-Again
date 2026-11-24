/* Nightmare, part 1: the large things — the gurney, the black car, the school bus, the carousel, the ice-cream van. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, chain, chainH, thin, rusty, drip, pool, bars, ring, flame, fire, sparks, skull, bone, rock, spike, wheel, tyre, eyes, planks, shade } = H;
  const { NI, SHEET, SHEETD, PJ, SHADOW, SKIN, SICK, DWATER, BUSY, BUSYL, LINO, SCREEN, CARP } = P;
  const IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    STL = hex('#b0b3ba'),
    CARK = hex('#1c1a22'),
    CARL = hex('#3a3846'),
    GLASSD = hex('#2a3442'),
    GLASSL = hex('#51627a'),
    LIT = hex('#8f9670'),
    LAMP = hex('#d8cf8a'),
    LAMPOFF = hex('#77745a'),
    VINYL = hex('#4d5a52'),
    BR = hex('#8a7436');

  /* ---------- the gurney ---------- */
  O('nightmare-gurney-hospital', 'large hospital gurney trolley stretcher on wheels white sheet drip stand something under the sheet', {
    w: 46,
    h: 30,
    base: 'side',
    f(c, u) {
      const b = 28;
      c.col(2, 1, 15, ST); // the drip stand
      c.rect(2, 1, 4, 1, ST);
      c.rect(4, 2, 6, 6, u ? hex('#3a4a52') : C.glass);
      c.frame(4, 2, 6, 6, C.glassLight);
      thin(c, 5, 7, 7, 10, C.glassLight);
      c.line(8, 16, 36, 23, IR);
      c.line(8, 23, 36, 16, IR);
      for (const x of [6, 38]) c.rect(x, 16, x + 1, 24, ST);
      c.rect(3, 14, 41, 15, ST);
      c.row(14, 3, 41, STL);
      c.rect(3, 11, 41, 13, VINYL);
      c.row(11, 3, 41, L(VINYL));
      c.col(42, 8, 15, ST);
      c.rect(42, 8, 43, 8, STL);
      if (!u) {
        c.rect(4, 9, 40, 10, SHEET);
        c.rect(5, 7, 11, 9, C.white);
        c.row(9, 5, 11, SHEETD);
        for (let x = 12; x <= 36; x++) c.col(x, 11, 13 + ((x * 5) % 3), x % 4 ? SHEET : SHEETD);
      } else {
        // someone lies under it
        const top = [8, 6, 5, 5, 6, 7, 6, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 7, 6, 5, 4, 4, 5, 7, 9];
        top.forEach((t, i) => {
          c.col(4 + i, t, 10, SHEET);
          c.set(4 + i, t, C.white);
        });
        dots(c, SHEETD, [10, 8, 11, 9, 16, 7, 22, 9, 28, 9, 33, 7, 34, 8, 37, 8]);
        for (let x = 10; x <= 38; x++) c.col(x, 11, 13 + ((x * 5) % 4), x % 4 ? SHEET : SHEETD);
        c.col(20, 13, 19, SKIN); // an arm has slipped out
        c.col(21, 13, 17, D(SKIN));
        dots(c, SKIN, [19, 20, 20, 20, 21, 19, 20, 21]);
      }
      for (const x of [17, 29]) {
        c.col(x, u ? 6 : 9, 13, P.HIDE);
        c.set(x, u ? 8 : 10, BR);
      }
      tyre(c, 6, 26, 2, ST);
      tyre(c, 39, 26, 2, ST);
    },
    sw: 20,
    s(c, u) {
      const b = 28;
      c.col(2, 1, 15, ST);
      c.rect(2, 1, 4, 1, ST);
      c.rect(4, 2, 5, 5, u ? hex('#3a4a52') : C.glass);
      c.rect(4, 7, 15, 10, SHEET); // the top, running away from you
      c.row(6, 5, 14, SHEET);
      c.rect(7, 4, 12, 5, C.white);
      c.row(10, 4, 15, SHEETD);
      if (u) {
        c.rect(5, 4, 14, 8, SHEET);
        c.row(3, 6, 13, C.white);
        c.rect(6, 5, 8, 9, C.white); // two feet under the sheet
        c.rect(11, 5, 13, 9, C.white);
        dots(c, SHEETD, [9, 6, 10, 7, 9, 8, 7, 9, 12, 9, 5, 6, 14, 7]);
        c.row(2, 8, 11, SHEET);
      }
      c.rect(3, 11, 16, 13, VINYL);
      c.row(11, 3, 16, L(VINYL));
      c.rect(3, 14, 16, 15, ST);
      c.row(14, 3, 16, STL);
      for (const x of [3, 15]) c.rect(x, 16, x + 1, 24, ST);
      c.row(20, 5, 14, IR);
      c.rect(3, 25, 5, b, CARK);
      c.rect(14, 25, 16, b, CARK);
      c.set(4, 26, ST);
      c.set(15, 26, ST);
      if (u) {
        c.col(17, 12, 18, SKIN);
        dots(c, SKIN, [16, 19, 17, 19, 17, 20]);
      }
    },
  });

  /* ---------- the black car ---------- */
  O('nightmare-car-black-driverless', 'large black car with no driver old saloon sedan dark windows engine running waiting at the kerb', {
    w: 48,
    h: 26,
    base: 'side',
    f(c, u) {
      const b = 24;
      c.poly([[9, 12], [14, 4], [30, 4], [36, 12]], CARK);
      c.line(14, 4, 30, 4, CARL);
      c.rect(2, 12, 45, 20, CARK);
      c.row(11, 3, 44, CARK);
      c.row(11, 36, 44, CARL);
      c.row(12, 2, 45, CARL);
      c.row(20, 3, 44, hex('#121016'));
      // glass
      const G = u ? hex('#5c5a44') : GLASSD;
      c.poly([[12, 11], [15, 6], [21, 6], [21, 11]], G);
      c.poly([[23, 11], [23, 6], [29, 6], [33, 11]], G);
      c.set(15, 7, GLASSL);
      c.set(16, 6, GLASSL);
      c.set(24, 7, GLASSL);
      c.rect(17, 8, 19, 11, CARK); // a seat back, and nobody
      c.rect(25, 8, 27, 11, CARK);
      c.col(22, 5, 19, hex('#121016'));
      c.col(33, 12, 19, hex('#121016'));
      c.set(24, 14, ST);
      c.set(14, 14, ST);
      c.rect(45, 17, 46, 18, ST);
      c.rect(1, 17, 2, 18, ST);
      c.rect(45, 13, 45, 14, u ? LAMP : LAMPOFF);
      c.set(2, 13, C.blood);
      c.row(17, 5, 43, hex('#2a2832'));
      if (u) {
        // the driver's door stands open
        c.rect(23, 12, 27, 19, NI);
        c.rect(24, 9, 26, 17, hex('#5a2a2e'));
        c.col(24, 9, 17, hex('#7a3a3c'));
        c.row(18, 23, 27, hex('#3a1c20'));
        c.rect(28, 5, 32, 19, CARK);
        c.frame(28, 5, 32, 19, CARL);
        c.rect(29, 6, 31, 10, GLASSD);
        c.set(29, 14, ST);
      }
      tyre(c, 11, 20, 4, ST);
      tyre(c, 37, 20, 4, ST);
      return () => u && dots(c, LAMP, [47, 13, 47, 14, 46, 15]);
    },
    sw: 28,
    sh: 24,
    s(c, u) {
      const b = 22;
      c.rect(5, 4, 22, 10, CARK);
      c.row(3, 7, 20, CARL);
      c.rect(7, 5, 20, 9, u ? hex('#5c5a44') : GLASSD);
      c.set(8, 6, GLASSL);
      c.set(9, 5, GLASSL);
      c.rect(8, 7, 11, 9, CARK); // two seat backs, nobody
      c.rect(16, 7, 19, 9, CARK);
      ring(c, 15, 7, 19, 10, hex('#121016'));
      c.rect(3, 10, 24, 19, CARK);
      c.row(10, 3, 24, CARL);
      c.rect(10, 13, 17, 17, ID);
      bars(c, 10, 17, 13, 17, ST, 2);
      for (const x of [4, 20]) {
        c.oval(x, 12, x + 3, 15, u ? LAMP : LAMPOFF);
        c.set(x + 1, 13, u ? hex('#f2ecc0') : hex('#9a9670'));
      }
      c.rect(2, 18, 25, 19, ST);
      c.row(18, 2, 25, STL);
      c.rect(11, 18, 16, 19, C.paper); // the plate, blank
      c.rect(4, 20, 7, b, CARK);
      c.rect(20, 20, 23, b, CARK);
      dots(c, CARK, [4, 8, 23, 8, 3, 8, 24, 8]);
      if (u) {
        c.rect(25, 5, 26, 17, CARK); // the door, open towards you
        c.col(25, 5, 17, CARL);
        c.rect(25, 6, 25, 9, GLASSD);
      }
      return () => u && dots(c, LAMP, [3, 16, 8, 16, 19, 16, 24, 16, 5, 17, 22, 17]);
    },
  });

  /* ---------- the school bus ---------- */
  function child(c, x, y) {
    c.rect(x, y, x + 2, y + 2, SHADOW);
    c.rect(x - 1, y + 3, x + 3, y + 4, SHADOW);
  }
  O('nightmare-school-bus-front', 'large school bus front half yellow bus dull and rusted empty seats waiting door', {
    w: 48,
    h: 32,
    base: 'side',
    f(c, u) {
      const b = 30,
        W = u ? LIT : GLASSD;
      c.rect(2, 4, 36, 25, BUSY);
      c.row(3, 4, 35, BUSYL);
      c.row(4, 2, 36, BUSYL);
      c.rect(36, 14, 45, 25, BUSY);
      c.row(13, 37, 44, BUSYL);
      c.row(14, 36, 45, BUSYL);
      for (const y of [16, 20]) c.row(y, 2, 36, CARK);
      c.rect(2, 24, 45, 25, hex('#2a2832'));
      [5, 13, 21].forEach((x, i) => {
        c.rect(x, 7, x + 6, 13, W);
        c.frame(x - 1, 6, x + 7, 14, D(BUSY));
        if (u) child(c, x + 2, 9 + (i % 2));
        else c.set(x + 1, 8, GLASSL);
      });
      c.poly([[34, 13], [34, 7], [36, 7], [38, 13]], W); // the windscreen
      c.set(35, 8, u ? LAMP : GLASSL);
      // the door
      c.rect(28, 6, 32, 23, u ? NI : GLASSD);
      c.frame(28, 6, 32, 23, CARK);
      if (u) {
        c.rect(29, 7, 31, 18, hex('#4e553e'));
        c.row(19, 29, 31, ST);
        c.row(21, 29, 31, ST);
        c.col(28, 6, 23, BUSY);
      } else {
        c.col(30, 7, 22, CARK);
        c.set(29, 8, GLASSL);
      }
      dots(c, C.blood, [34, 3]);
      dots(c, C.flame, [31, 3]);
      c.rect(45, 23, 46, 25, ST);
      c.rect(44, 18, 45, 19, u ? LAMP : LAMPOFF);
      // the torn end
      for (let y = 4; y <= 25; y++) if ((y * 7) % 5 < 2) c.clear(2, y);
      rusty(c, 2, 14, 45, 25, 6, 6);
      rusty(c, 2, 4, 8, 14, 3, 3);
      tyre(c, 11, 26, 4, hex('#5a5a55'));
      tyre(c, 39, 26, 4, hex('#5a5a55'));
      return () => u && dots(c, LAMP, [47, 18, 47, 19, 46, 20]);
    },
    sw: 28,
    s(c, u) {
      const b = 30,
        W = u ? LIT : GLASSD;
      c.rect(3, 4, 24, 24, BUSY);
      c.row(3, 5, 22, BUSYL);
      c.col(3, 4, 24, BUSYL);
      c.rect(8, 5, 19, 7, NI);
      c.rect(5, 9, 13, 15, W);
      c.rect(14, 9, 22, 15, W);
      c.col(13, 9, 15, D(BUSY));
      c.col(14, 9, 15, D(BUSY));
      if (u) {
        child(c, 7, 11);
        child(c, 17, 10);
        child(c, 11, 12);
      } else {
        c.line(6, 15, 9, 11, CARK);
        c.line(15, 15, 18, 11, CARK);
        dots(c, GLASSL, [6, 10, 15, 10]);
      }
      c.row(16, 3, 24, CARK);
      c.rect(9, 18, 18, 22, CARK);
      bars(c, 9, 18, 18, 22, ID, 2);
      for (const x of [4, 21]) {
        c.rect(x, 18, x + 2, 20, u ? LAMP : LAMPOFF);
        c.set(x + 1, 21, C.flame);
      }
      c.rect(2, 23, 25, 24, ST);
      c.row(23, 2, 25, STL);
      c.rect(4, 25, 7, b, CARK);
      c.rect(20, 25, 23, b, CARK);
      dots(c, CARK, [1, 10, 1, 11, 1, 12, 26, 10, 26, 11, 26, 12, 2, 11, 25, 11]);
      dots(c, C.blood, [6, 3, 21, 3]);
      rusty(c, 3, 16, 24, 24, 6, 5);
      return () => u && dots(c, LAMP, [3, 21, 8, 21, 19, 21, 24, 21]);
    },
  });

  /* ---------- the carousel ---------- */
  function horse(col, saddle) {
    // 13 x 10, looking right
    return part(13, 10, (t) => {
      t.rect(2, 3, 9, 6, col);
      t.row(2, 3, 8, L(col));
      t.rect(8, 1, 10, 4, col);
      t.rect(10, 0, 12, 2, col);
      t.set(12, 2, D(col));
      t.set(10, 0, D(col));
      t.set(11, 1, NI);
      t.rect(4, 3, 6, 4, saddle);
      t.set(5, 5, saddle);
      t.col(1, 2, 6, D(col)); // tail
      t.set(0, 5, D(col));
      t.line(3, 7, 1, 9, col);
      t.line(4, 7, 5, 9, D(col));
      t.line(8, 7, 10, 8, col);
      t.set(11, 9, col);
      t.line(7, 7, 7, 9, D(col));
      t.row(1, 8, 9, P.CARP); // mane
      t.set(8, 2, P.CARP);
    });
  }
  O('nightmare-carousel-horse-row', 'large carousel horses row merry go round fairground roundabout painted horses on poles faded', {
    w: 48,
    h: 32,
    f(c, u) {
      const b = 30,
        RED = hex('#8a4a44'),
        CRM = hex('#b5ad9a');
      for (let x = 2; x <= 45; x++) {
        c.col(x, 2, 6, ((x - 2) >> 2) % 2 ? RED : CRM);
        if (x % 2) c.set(x, 7, ((x - 2) >> 2) % 2 ? RED : CRM);
      }
      c.row(2, 2, 45, hex('#cfc8b4'));
      c.row(1, 4, 43, RED);
      for (let x = 4; x <= 44; x += 5) c.set(x, 6, u ? hex('#f2ecc0') : LAMPOFF);
      const ys = u ? [16, 0, 12] : [12, 16, 13];
      [9, 23, 37].forEach((x, i) => {
        for (let y = 8; y <= 26; y++) c.set(x, y, y % 2 ? BR : L(BR));
        if (u && i === 1) {
          thin(c, x + 1, 15, x + 1, 19, P.HIDE); // a strap, and no horse
          return;
        }
        c.stamp(horse([hex('#c9c2ae'), hex('#a8a294'), hex('#bdb49c')][i], [C.teal, C.wine, C.mustard][i]), x - 6, ys[i]);
        for (let y = ys[i] + 3; y <= ys[i] + 6; y++) c.set(x, y, y % 2 ? BR : L(BR));
      });
      c.rect(2, 27, 45, b, hex('#5e2f30'));
      c.row(27, 2, 45, RED);
      for (let x = 4; x <= 44; x += 4) c.set(x, 29, BR);
      return () => {
        if (u) for (let x = 4; x <= 44; x += 5) c.set(x, 8, LAMP);
      };
    },
    sw: 18,
    s(c, u) {
      const b = 30,
        RED = hex('#8a4a44'),
        CRM = hex('#b5ad9a'),
        col = hex('#c9c2ae'),
        y = u ? 16 : 12;
      for (let x = 2; x <= 15; x++) {
        c.col(x, 2, 6, ((x - 2) >> 2) % 2 ? RED : CRM);
        if (x % 2) c.set(x, 7, ((x - 2) >> 2) % 2 ? RED : CRM);
      }
      c.row(2, 2, 15, hex('#cfc8b4'));
      c.row(1, 4, 13, RED);
      for (const x of [4, 9, 14]) c.set(x, 6, u ? hex('#f2ecc0') : LAMPOFF);
      for (let yy = 8; yy <= 26; yy++) c.set(8, yy, yy % 2 ? BR : L(BR));
      // a horse, head on
      c.rect(6, y + 3, 11, y + 9, col);
      c.col(6, y + 3, y + 9, L(col));
      c.rect(7, y, 10, y + 4, col);
      dots(c, col, [7, y - 1, 10, y - 1]);
      dots(c, NI, [7, y + 1, 10, y + 1]);
      c.rect(8, y + 3, 9, y + 4, D(col));
      c.rect(6, y + 10, 7, y + 12, col);
      c.rect(10, y + 10, 11, y + 12, D(col));
      c.rect(5, y + 5, 12, y + 6, C.teal);
      c.col(8, y - 1, y, P.CARP);
      c.rect(2, 27, 15, b, hex('#5e2f30'));
      c.row(27, 2, 15, RED);
      dots(c, BR, [4, 29, 8, 29, 12, 29]);
      return () => u && dots(c, LAMP, [4, 8, 9, 8, 14, 8]);
    },
  });

  /* ---------- the ice-cream van ---------- */
  function cone(c, x, y) {
    c.oval(x, y, x + 4, y + 3, hex('#b88a8a'));
    c.set(x + 1, y, hex('#d0a8a4'));
    c.row(y + 3, x, x + 4, hex('#a8855c'));
    c.row(y + 4, x + 1, x + 3, hex('#a8855c'));
    c.set(x + 2, y + 5, hex('#8c6240'));
  }
  O('nightmare-ice-cream-van', 'large ice cream van faded pink and cream serving hatch cone on the roof chimes playing nobody inside', {
    w: 48,
    h: 32,
    base: 'side',
    f(c, u) {
      const b = 30,
        CRM = hex('#b5ad9a'),
        PINK = hex('#a07a78');
      c.rect(3, 7, 36, 25, CRM);
      c.row(6, 4, 35, hex('#cfc8b4'));
      c.rect(3, 19, 36, 25, PINK);
      c.rect(36, 13, 45, 25, CRM);
      c.rect(36, 19, 45, 25, PINK);
      c.row(12, 37, 43, hex('#cfc8b4'));
      c.poly([[36, 12], [36, 8], [39, 8], [42, 12]], u ? LIT : GLASSD);
      c.rect(37, 14, 41, 17, u ? LIT : GLASSD);
      c.col(36, 7, 25, D(CRM));
      c.rect(2, 24, 45, 25, hex('#2a2832'));
      cone(c, 12, 1);
      // the hatch
      c.rect(8, 10, 24, 17, u ? LIT : GLASSD);
      c.frame(7, 9, 25, 18, D(CRM));
      for (let x = 7; x <= 25; x++) c.col(x, 7, 8, (x >> 1) % 2 ? PINK : hex('#cfc8b4'));
      c.row(18, 6, 26, ST);
      if (!u) dots(c, GLASSL, [9, 11, 10, 11, 9, 12]);
      else {
        c.rect(10, 13, 13, 17, hex('#6e7556')); // jars on the counter, and nobody
        c.rect(20, 14, 22, 17, hex('#6e7556'));
      }
      dots(c, PINK, [28, 10, 30, 12, 29, 15, 31, 9]);
      dots(c, hex('#8a6a66'), [5, 21, 14, 22, 27, 21, 33, 23]);
      c.rect(45, 22, 46, 24, ST);
      c.rect(44, 19, 45, 20, u ? LAMP : LAMPOFF);
      rusty(c, 3, 19, 45, 25, 8, 7);
      tyre(c, 11, 26, 4, hex('#5a5a55'));
      tyre(c, 38, 26, 4, hex('#5a5a55'));
      return () => {
        if (!u) return;
        // an arm, much too long, holds out a cone
        c.line(16, 16, 20, 21, SKIN);
        c.line(20, 21, 18, 26, SKIN);
        c.set(18, 27, D(SKIN));
        c.rect(17, 27, 19, 28, hex('#b88a8a'));
        c.set(18, 29, hex('#a8855c'));
        dots(c, LAMP, [47, 19, 47, 20]);
      };
    },
    sw: 26,
    s(c, u) {
      const b = 30,
        CRM = hex('#b5ad9a'),
        PINK = hex('#a07a78');
      cone(c, 10, 1);
      c.rect(3, 8, 22, 25, CRM);
      c.row(7, 4, 21, hex('#cfc8b4'));
      c.col(3, 8, 25, hex('#cfc8b4'));
      c.rect(3, 19, 22, 25, PINK);
      c.rect(5, 10, 20, 16, u ? LIT : GLASSD);
      if (!u) dots(c, GLASSL, [6, 11, 7, 11, 6, 12]);
      else {
        c.rect(7, 13, 9, 16, hex('#6e7556')); // an empty seat
        ring(c, 14, 13, 18, 17, CARK);
      }
      c.rect(9, 19, 16, 22, ID);
      bars(c, 9, 16, 19, 22, ST, 2);
      for (const x of [4, 19]) c.rect(x, 19, x + 2, 21, u ? LAMP : LAMPOFF);
      c.rect(2, 23, 23, 24, ST);
      c.row(23, 2, 23, STL);
      c.rect(4, 25, 7, b, CARK);
      c.rect(18, 25, 21, b, CARK);
      dots(c, CARK, [1, 11, 1, 12, 24, 11, 24, 12]);
      rusty(c, 3, 17, 22, 22, 8, 6);
      return () => {
        if (!u) return;
        c.line(23, 14, 24, 20, SKIN);
        c.rect(23, 21, 24, 22, hex('#b88a8a'));
        c.set(24, 23, hex('#a8855c'));
        dots(c, LAMP, [3, 22, 8, 22, 17, 22, 22, 22]);
      };
    },
  });
};
