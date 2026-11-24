/* Hell, part 1: the large things — the ferry, the carts, the great furnace, the organ, the wheel. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, chain, chainH, thin, rusty, drip, pool, bars, ring, flame, fire, sparks, skull, skullS, bone, rock, spike, wheel, eyes } = H;
  const { OBS, OBL, BAS, BASL, BRIM, BRIML, EMBER, LAVA, LAVAL, CHAR, BONE, BONED, BL, BD, NI, SOUL, SOULD } = P;
  const IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    WD = hex('#3c2a24'),
    WL = hex('#5a4034'),
    BR = hex('#8a7436');

  /** A soul: a pale hunched shape, sitting. x is its middle, y its top; 9 rows. */
  function soul(c, x, y, col = SOUL) {
    c.rect(x - 1, y, x + 1, y + 2, col);
    c.set(x - 2, y + 1, col);
    c.set(x + 2, y + 1, D(col));
    c.rect(x - 3, y + 4, x + 2, y + 8, col);
    c.row(y + 3, x - 2, x + 1, col);
    c.col(x + 2, y + 4, y + 8, SOULD);
    c.set(x - 1, y + 1, NI);
    c.set(x + 1, y + 1, NI);
    c.row(y + 6, x - 2, x + 1, SOULD);
  }

  /* ---------- the ferryman's boat ---------- */
  O('hell-ferryman-boat', 'large ferryman boat black skiff river styx charon ferry lantern pole souls of the dead', {
    w: 48,
    h: 30,
    base: 'side',
    f(c, u) {
      const b = 28;
      if (u) {
        soul(c, 17, 10);
        soul(c, 28, 10, hex('#a3c4b0'));
      }
      c.poly([[4, 19], [41, 19], [45, 15], [46, 15], [44, 23], [40, b], [9, b], [4, 23]], CHAR);
      c.row(19, 4, 42, BASL);
      c.row(20, 4, 43, BAS);
      c.row(23, 5, 43, NI);
      c.row(26, 8, 41, NI);
      for (let x = 7; x <= 39; x += 4) c.set(x, 21, BONED);
      // the stern post and its skull
      c.line(5, 19, 4, 10, BAS);
      c.line(6, 19, 5, 10, CHAR);
      skull(c, 2, 5);
      // the prow: a hooked neck with a lantern
      c.line(43, 17, 45, 5, BAS);
      c.line(44, 17, 46, 5, CHAR);
      dots(c, BAS, [44, 4, 43, 3, 42, 3, 41, 4]);
      c.set(41, 5, IR);
      c.set(41, 6, ID);
      c.frame(40, 7, 42, 11, IR);
      c.set(41, 7, ID);
      c.rect(41, 8, 41, 10, u ? SOUL : NI);
      if (u) c.set(41, 9, hex('#d5ead8'));
      // the pole
      if (u) {
        c.line(11, 1, 9, 19, WL);
        c.set(11, 1, C.woodLight);
      } else {
        c.line(8, 17, 38, 15, WL);
        c.line(8, 18, 38, 16, WD);
      }
      c.row(b, 12, 38, NI);
      return () => {
        if (u) dots(c, SOULD, [38, 9, 44, 9, 41, 13, 39, 6]);
        dots(c, BONED, [20, 24, 30, 24]);
      };
    },
    sw: 22,
    s(c, u) {
      const b = 28;
      if (u) {
        c.rect(4, 12, 7, 18, SOUL);
        c.rect(5, 10, 6, 11, SOUL);
        dots(c, NI, [5, 13, 7, 13]);
        c.rect(14, 12, 17, 18, hex('#a3c4b0'));
        c.rect(15, 10, 16, 11, hex('#a3c4b0'));
        dots(c, NI, [14, 13, 16, 13]);
        c.col(18, 1, 19, WL);
      }
      c.poly([[2, 19], [19, 19], [17, 24], [14, b], [7, b], [4, 24]], CHAR);
      c.row(19, 2, 19, BASL);
      c.row(20, 2, 19, BAS);
      c.line(4, 23, 9, 26, NI);
      c.line(17, 23, 12, 26, NI);
      // the stem, the hooked neck coming at you
      c.rect(10, 5, 11, b, BAS);
      c.col(11, 5, b, CHAR);
      dots(c, BAS, [10, 4, 9, 3, 8, 3, 7, 4]);
      c.set(7, 5, IR);
      c.set(7, 6, ID);
      c.frame(6, 7, 8, 11, IR);
      c.rect(7, 8, 7, 10, u ? SOUL : NI);
      if (u) c.set(7, 9, hex('#d5ead8'));
      dots(c, BONED, [5, 21, 16, 21]);
      if (!u) dots(c, WL, [14, 18, 15, 18, 16, 18]);
      return () => u && dots(c, SOULD, [4, 9, 10, 9 - 7, 7, 13]);
    },
  });

  /* ---------- the bone cart ---------- */
  O('hell-bone-cart', 'large bone cart wagon of ribs loaded with skulls dead cart tumbril ossuary wheels', {
    w: 48,
    h: 30,
    base: 'side',
    f(c, u) {
      const b = 28;
      if (u) {
        for (const x of [5, 11, 17, 23, 29, 35]) skull(c, x, 10, false, x % 2 ? BONE : BONED);
        for (const x of [8, 14, 20, 26, 32]) skull(c, x, 6, false, x % 4 ? BONE : BONED);
        for (const x of [12, 19, 27]) skull(c, x, 2);
        bone(c, 33, 4, 37, 6);
      } else {
        skull(c, 23, 10);
        bone(c, 28, 13, 35, 13);
        bone(c, 8, 14, 13, 12);
      }
      for (const x of [4, 10, 16, 22, 28, 34, 40]) {
        c.col(x, 7, 15, BONE);
        c.set(x + 1, 6, BONE);
        c.set(x + 2, 5, BONED);
        c.set(x, 11, BONED);
      }
      c.rect(3, 15, 41, 17, WD);
      c.row(15, 3, 41, WL);
      dots(c, IR, [6, 16, 20, 16, 38, 16]);
      // the shaft: one long thigh bone, resting on the ground
      c.line(41, 16, 46, b - 1, BONE);
      c.line(42, 16, 46, b - 2, BONED);
      c.rect(45, b - 1, 46, b, BONE);
      wheel(c, 12, 21, 7, WD, BONED, IR);
      wheel(c, 32, 21, 7, WD, BONED, IR);
      ring(c, 6, 15, 18, 27, WL);
      ring(c, 26, 15, 38, 27, WL);
      return () => u && dots(c, BD, [15, 17, 24, 18, 25, 19]);
    },
    sw: 26,
    s(c, u) {
      const b = 28;
      if (u) {
        skull(c, 7, 7);
        skull(c, 14, 7, false, BONED);
        skull(c, 10, 3);
        skull(c, 4 + 2, 11, false, BONED);
        skull(c, 15, 11);
      }
      // the ribs, an arch like a chest
      for (const [x, k] of [[5, 1], [20, -1]]) {
        c.col(x, 6, 13, BONE);
        c.set(x + k, 5, BONE);
        c.set(x + 2 * k, 4, BONE);
        c.set(x + 3 * k, 3, BONED);
        c.set(x + 4 * k, 3, BONED);
      }
      c.rect(5, 13, 20, 18, WD);
      c.row(13, 5, 20, WL);
      c.row(16, 5, 20, NI);
      skull(c, 9, 11, true);
      // wheels, edge on
      for (const x of [2, 21]) {
        c.rect(x, 14, x + 2, b, WD);
        c.col(x, 14, b, WL);
        dots(c, IR, [x + 1, 17, x + 1, 21, x + 1, 25]);
      }
      c.rect(5, 20, 20, 21, ID);
      c.rect(12, 19, 13, b - 2, BONE);
      c.rect(11, b - 1, 14, b, BONE);
      c.col(13, 19, b - 2, BONED);
      return () => u && dots(c, BD, [8, 19, 17, 19]);
    },
  });

  /* ---------- the great furnace mouth ---------- */
  function horn(c, flip) {
    const X = (x) => (flip ? 47 - x : x);
    [[2, 2], [2, 3], [2, 4], [3, 5], [3, 6], [4, 8], [5, 9]].forEach(([a, z], i) => {
      for (let x = a; x <= z; x++) c.set(X(x), 1 + i, x === a ? BONE : BONED);
    });
  }
  O('hell-furnace-mouth-great', 'large great furnace mouth demon face of iron and basalt horned oven fire maw', {
    w: 48,
    h: 32,
    f(c, u) {
      const b = 30;
      horn(c, false);
      horn(c, true);
      c.rect(5, 8, 42, b, BAS);
      c.row(7, 7, 40, BASL);
      c.col(5, 8, b, BASL);
      c.rect(8, 9, 39, 10, D(BAS));
      for (const [x, k] of [[11, 1], [36, -1]]) {
        // slanted eyes
        for (let i = 0; i < 3; i++) for (let j = i; j <= 5 + (i > 0 ? 1 : 0); j++) c.set(x + j * k, 11 + i, NI);
        c.set(x + 3 * k, 12, u ? LAVAL : EMBER);
        c.set(x + 4 * k, 12, u ? LAVA : BD);
        if (u) c.set(x + 3 * k, 13, LAVA);
      }
      dots(c, NI, [22, 15, 22, 16, 25, 15, 25, 16]);
      c.rect(9, 18, 38, b, IR);
      c.row(18, 9, 38, L(IR));
      dots(c, BAS, [9, 18, 38, 18]);
      dots(c, ST, [10, 21, 10, 27, 37, 21, 37, 27]);
      if (!u) {
        c.rect(11, 20, 36, 24, ID);
        c.rect(11, 25, 36, b, hex('#3a3a45'));
        for (let x = 11; x <= 36; x++) {
          const k = (x - 11) % 4;
          c.set(x, k < 2 ? 24 : 25, k < 2 ? EMBER : BD); // the seam of the jaws, a red line of teeth
          if (k === 0) c.set(x, 25, ID);
        }
        c.rect(22, 21, 25, 22, IR);
        c.rect(22, 27, 25, 28, IR);
        dots(c, ST, [13, 21, 34, 21, 13, 28, 34, 28]);
      } else {
        c.rect(11, 20, 36, b, BD);
        c.rect(12, 24, 35, b, EMBER);
        fire(c, 12, 35, b, 9, 3);
        for (let x = 12; x <= 35; x += 4) {
          c.rect(x, 20, x + 1, 21, ST); // upper teeth
          c.set(x, 22, ST);
        }
        for (let x = 14; x <= 35; x += 4) c.set(x, b, ID);
      }
      rusty(c, 5, 8, 42, 17, 4, 5, CHAR);
      rusty(c, 5, 18, 8, b, 6, 3, CHAR);
      rusty(c, 39, 18, 42, b, 7, 3, CHAR);
      return () => u && sparks(c, [14, 17, 30, 16, 23, 13, 8, 15]);
    },
    sw: 22,
    s(c, u) {
      const b = 30;
      c.rect(3, 2, 5, 7, IR); // the flue at the back
      c.rect(2, 1, 6, 2, ID);
      c.rect(3, 8, 14, b, BAS);
      c.row(7, 4, 13, BASL);
      c.col(3, 8, b, BASL);
      c.rect(13, 9, 15, 10, D(BAS));
      // the horn, forward and up
      [[10, 13], [11, 14], [12, 15], [14, 16], [15, 17], [17, 18]].forEach(([a, z], i) => c.row(6 - i, a, z, i > 3 ? BONE : BONED));
      c.set(13, 12, u ? LAVAL : EMBER);
      c.set(12, 12, NI);
      c.rect(15, 18, 17, b, IR);
      c.row(18, 15, 17, L(IR));
      dots(c, ST, [16, 21, 16, 27]);
      rusty(c, 3, 8, 14, b, 4, 5, CHAR);
      if (u) {
        c.col(17, 20, b, BD);
        flame(c, 18, b, 9, 1, 2);
        flame(c, 19, b - 2, 6, 1, 4);
        c.rect(17, b - 1, 20, b, EMBER);
      } else {
        c.col(17, 24, 25, EMBER);
      }
      return () => u && sparks(c, [20, 15, 18, 17, 20, 20]);
    },
  });

  /* ---------- the infernal organ ---------- */
  const CASE = hex('#3a2226'),
    CASEL = hex('#553238');
  O('hell-infernal-organ', 'large infernal organ pipe organ of brass and bone skull keys church of the damned music', {
    w: 46,
    h: 40,
    f(c, u) {
      const b = 38;
      for (let i = 0; i < 13; i++) {
        const x = 4 + i * 3,
          top = 8 + Math.abs(i - 6) * 2;
        c.rect(x, top, x + 1, 23, BR);
        c.col(x, top, 23, L(BR));
        c.set(x, 21, NI);
        c.set(x + 1, 21, NI);
        c.set(x, top - 1, BR);
        if (u && i % 2 === 0) flame(c, x + (i < 6 ? 0 : 1), top - 2, 5 + (i % 4 === 0 ? 2 : 0), 1, i);
      }
      for (const x of [2, 42]) {
        c.rect(x, 7, x + 1, 24, CASE);
        c.col(x, 7, 24, CASEL);
        c.set(x, 6, IR);
        c.set(x, 5, IR);
      }
      skull(c, 19, 15, true);
      if (u) {
        c.rect(20, 17, 21, 18, EMBER);
        c.rect(23, 17, 24, 18, EMBER);
      }
      c.rect(2, 24, 43, 24, IR);
      c.rect(3, 25, 42, b, CASE);
      c.col(3, 25, b, CASEL);
      for (const y of [26, 29]) {
        c.rect(9, y, 36, y + 1, BONE);
        for (let x = 10; x <= 36; x += 2) c.set(x, y + 1, BONED);
        for (let x = 11; x <= 36; x += 4) c.set(x, y, NI);
        if (u) for (const x of y === 26 ? [12, 13, 20, 28] : [16, 24, 25, 32]) c.rect(x, y, x, y + 1, D(BONED));
      }
      for (const x of [5, 7, 38, 40]) for (const y of [26, 28, 30]) c.set(x, y, (x + y) % 3 ? BONE : EMBER);
      c.frame(8, 33, 37, b - 2, D(CASE));
      c.rect(10, b - 1, 35, b, WD);
      for (let x = 11; x <= 35; x += 3) c.col(x, b - 1, b, NI);
      dots(c, BR, [14, 34, 31, 34, 22, 35, 23, 35]);
      return () => u && sparks(c, [8, 2, 21, 1, 30, 3, 39, 5]);
    },
    sw: 20,
    s(c, u) {
      const b = 38;
      c.rect(2, 7, 3, 24, CASE);
      c.col(2, 7, 24, CASEL);
      dots(c, IR, [2, 6, 2, 5]);
      for (const [x, top] of [[4, 12], [6, 9], [8, 8]]) {
        c.rect(x, top, x + 1, 23, BR);
        c.col(x, top, 23, L(BR));
        c.set(x + 1, 21, NI);
        c.set(x, top - 1, BR);
        if (u) flame(c, x, top - 2, top === 8 ? 6 : 4, 1, x);
      }
      c.rect(2, 24, 14, 24, IR);
      c.rect(2, 25, 10, b, CASE);
      c.col(2, 25, b, CASEL);
      c.rect(11, 26, 14, 27, BONE);
      c.rect(11, 29, 16, 30, BONE);
      c.row(27, 11, 14, BONED);
      c.row(30, 11, 16, BONED);
      c.rect(11, 28, 12, 28, CASE);
      c.rect(11, 31, 13, 32, CASE);
      c.rect(11, b - 1, 17, b, WD);
      c.set(17, b - 1, WL);
      dots(c, BONE, [6, 27, 6, 29]);
      return () => u && sparks(c, [5, 3, 10, 2, 12, 5]);
    },
  });

  /* ---------- the prison wagon ---------- */
  function wretch(c, x, y) {
    // a hunched pale prisoner, 9 wide, 11 high
    c.rect(x + 1, y + 4, x + 8, y + 10, hex('#8a8474'));
    c.rect(x + 3, y, x + 6, y + 3, P.SKIN);
    c.row(y + 4, x + 2, x + 7, hex('#a39c88'));
    dots(c, NI, [x + 4, y + 2, x + 6, y + 2]);
    c.row(y + 10, x, x + 8, hex('#6c6658'));
  }
  O('hell-prison-wagon', 'large prison wagon iron cage on wheels damned prisoner cart barred transport of sinners', {
    w: 48,
    h: 30,
    base: 'side',
    f(c, u) {
      const b = 28;
      c.rect(4, 6, 39, 16, CHAR);
      if (!u) wretch(c, 18, 6);
      else {
        thin(c, 12, 6, 12, 11, ST);
        c.frame(11, 12, 13, 14, ST);
        dots(c, BD, [22, 16, 25, 16, 26, 15]);
      }
      for (let x = 4; x <= 39; x += 3) {
        if (u && (x === 22 || x === 25)) continue;
        c.col(x, 6, 16, IR);
      }
      if (u) {
        // two bars forced apart
        dots(c, IR, [22, 6, 21, 7, 20, 8, 20, 9, 20, 10, 20, 11, 20, 12, 20, 13, 21, 14, 21, 15, 22, 16]);
        dots(c, IR, [25, 6, 26, 7, 27, 8, 27, 9, 27, 10, 27, 11, 27, 12, 27, 13, 26, 14, 26, 15, 25, 16]);
      }
      c.row(11, 4, 39, ID);
      if (u) c.row(11, 21, 26, CHAR);
      c.rect(3, 3, 40, 5, IR);
      c.row(3, 3, 40, L(IR));
      for (let x = 5; x <= 39; x += 6) {
        c.set(x, 2, ST);
        c.set(x, 1, ST);
      }
      c.rect(3, 17, 40, 19, WD);
      c.row(17, 3, 40, WL);
      dots(c, ST, [6, 18, 21, 18, 37, 18]);
      c.line(41, 18, 46, 25, IR);
      c.line(41, 19, 46, 26, ID);
      thin(c, 46, 26, 46, b, ST);
      rusty(c, 3, 3, 40, 16, 5, 6);
      wheel(c, 11, 22, 6, IR, WL, ST, 6);
      wheel(c, 33, 22, 6, IR, WL, ST, 6);
      if (!u) {
        c.set(22, 10, P.SKIN); // fingers round a bar
        c.set(25, 10, P.SKIN);
      }
    },
    sw: 26,
    suw: 32,
    s(c, u) {
      const b = 28;
      c.rect(5, 6, 20, 16, CHAR);
      if (!u) {
        c.rect(10, 8, 14, 12, P.SKIN);
        dots(c, NI, [11, 10, 13, 10]);
        c.rect(8, 13, 16, 16, hex('#8a8474'));
        bars(c, 5, 20, 6, 16, IR, 3);
        c.row(11, 5, 20, ID);
        c.frame(7, 6, 18, 16, ST); // the door
        c.rect(17, 10, 19, 12, BR);
        c.set(18, 9, ST);
      } else {
        bars(c, 5, 8, 6, 16, IR, 3);
        bars(c, 17, 20, 6, 16, IR, 3);
        c.frame(7, 6, 18, 16, ID);
        dots(c, BD, [11, 16, 13, 16, 14, 15]);
        c.frame(20, 6, 29, 16, ST); // the door swung out
        bars(c, 22, 28, 6, 16, IR, 3);
        c.row(11, 20, 29, ID);
        c.rect(27, 10, 28, 12, BR);
      }
      c.rect(4, 3, 21, 5, IR);
      c.row(3, 4, 21, L(IR));
      for (const x of [6, 12, 13, 19]) {
        c.set(x, 2, ST);
        c.set(x, 1, ST);
      }
      c.rect(4, 17, 21, 19, WD);
      c.row(17, 4, 21, WL);
      for (const x of [2, 21]) {
        c.rect(x, 16, x + 2, b, IR);
        c.col(x, 16, b, L(IR));
        dots(c, ST, [x + 1, 19, x + 1, 23, x + 1, 27]);
      }
      c.rect(5, 21, 20, 22, ID);
      c.rect(12, 20, 13, 25, IR);
      rusty(c, 4, 3, 21, 16, 5, 6);
    },
  });

  /* ---------- the treadwheel ---------- */
  O('hell-treadwheel-great', 'large great treadwheel wooden wheel of toil for sinners treadmill frame punishment', {
    w: 46,
    h: 32,
    base: 'side',
    f(c, u) {
      const b = 30,
        cx = 22,
        cy = 15,
        r = 14;
      const n = 8,
        off = u ? 0.39 : 0;
      for (let k = 0; k < n; k++) {
        const a = (k * Math.PI * 2) / n + off;
        c.line(cx, cy, cx + Math.cos(a) * (r - 2), cy + Math.sin(a) * (r - 2), WD);
      }
      ring(c, cx - r, cy - r, cx + r, cy + r, WL);
      ring(c, cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1, WD);
      for (let k = 0; k < 24; k++) {
        const a = (k * Math.PI * 2) / 24 + off;
        c.set(cx + Math.cos(a) * (r - 2), cy + Math.sin(a) * (r - 2), C.woodLight);
      }
      if (u) {
        // a soul walks the wheel
        const x = 27,
          y = 14;
        c.rect(x, y, x + 2, y + 2, SOUL);
        c.set(x + 2, y + 1, NI);
        c.rect(x - 1, y + 3, x + 2, y + 8, SOUL);
        c.col(x - 1, y + 3, y + 8, SOULD);
        c.line(x + 2, y + 9, x + 4, y + 11, SOUL);
        c.line(x, y + 9, x - 1, y + 12, SOUL);
        c.line(x + 3, y + 4, x + 5, y + 6, SOUL);
      } else {
        thin(c, cx + 1, cy + 2, cx + 1, cy + 7, ST);
        c.frame(cx, cy + 8, cx + 2, cy + 10, ST);
      }
      // the frame in front
      c.line(cx, cy, 10, b, WL);
      c.line(cx + 1, cy, 11, b, WD);
      c.line(cx, cy, 34, b, WL);
      c.line(cx + 1, cy, 35, b, WD);
      c.rect(4, b - 1, 41, b, WD);
      c.row(b - 1, 4, 41, WL);
      c.rect(cx - 1, cy - 1, cx + 2, cy + 2, IR);
      c.set(cx, cy, ST);
      return () => u && dots(c, C.ash, [38, 26, 40, 24, 5, 27]);
    },
    sw: 20,
    s(c, u) {
      const b = 30;
      c.rect(6, 1, 13, 29, WD);
      c.col(6, 1, 29, WL);
      c.col(13, 1, 29, NI);
      for (let y = u ? 3 : 2; y <= 28; y += 3) c.row(y, 7, 12, C.woodLight);
      for (let y = u ? 4 : 3; y <= 28; y += 3) c.row(y, 7, 12, NI);
      for (const x of [3, 15]) {
        c.rect(x, 14, x + 1, b, WL);
        c.col(x + 1, 14, b, WD);
        c.rect(x - 1, b - 1, x + 2, b, WD);
        c.set(x, 15, IR);
        c.set(x + 1, 15, ST);
      }
      c.rect(5, 15, 5, 15, IR);
      c.rect(14, 15, 14, 15, IR);
      if (u) {
        c.rect(5, 11, 6, 12, SOUL); // a hand on the rim
        c.set(7, 11, SOUL);
        c.rect(13, 9, 14, 10, SOUL);
      }
      return () => u && dots(c, C.ash, [17, 26, 2, 24]);
    },
  });
};
