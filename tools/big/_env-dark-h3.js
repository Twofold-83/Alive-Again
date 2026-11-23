/* Horror, part 3: the bodies, the signals, the ward and the yard. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, dots, part, turn, chain, thin, hook, rusty, drip, pool, bars, ring, shadowed } = H;
  const RU = C.rust,
    RD = D(C.rust),
    RL = hex('#a3602f'),
    IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    BL = C.blood,
    BD = hex('#5c1418'),
    PALE = hex('#b8a894'),
    MEAT = hex('#8e3b38'),
    MEATL = hex('#b3625a'),
    NI = C.night,
    CE = hex('#6f6c68'),
    CL = hex('#8b8882'),
    CD = D(CE),
    SACK = hex('#8f8168'),
    BAG = hex('#34343c'),
    SILK = hex('#b9b3a0'),
    PLAS = hex('#c2b49c'),
    W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight;

  /* ---------- the body bag ---------- */
  O('body-bag-trolley', 'body bag on a steel trolley black zip mortuary gurney corpse morgue', {
    w: 42,
    h: 22,
    base: 'side',
    f(c, u) {
      const b = 20;
      c.rect(2, 10, 39, 11, ST);
      c.row(10, 2, 39, L(ST));
      for (const x of [6, 34]) {
        c.col(x, 12, b - 2, IR);
        c.rect(x - 1, b - 1, x + 1, b, ID);
        c.set(x, b - 1, ST);
      }
      c.row(16, 7, 33, IR);
      c.line(1, 8, 3, 10, IR); // push handle
      c.set(1, 7, ID);
      if (!u) {
        c.rect(5, 6, 36, 9, BAG);
        c.rect(5, 5, 11, 5, BAG); // head
        c.rect(7, 4, 10, 4, BAG);
        c.rect(14, 5, 26, 5, BAG); // chest
        c.rect(32, 4, 35, 5, BAG); // feet
        c.row(6, 12, 31, L(BAG));
        c.row(4, 7, 10, L(BAG));
        for (let x = 8; x <= 34; x += 2) c.set(x, 7, ST); // the zip
        c.rect(36, 7, 37, 8, C.paper); // a tag
        c.row(9, 5, 36, D(BAG));
      } else {
        c.rect(5, 8, 36, 9, BAG); // empty, unzipped
        c.row(8, 7, 33, NI);
        c.row(7, 5, 12, BAG);
        c.rect(14, 6, 20, 7, BAG); // the flap thrown back
        c.row(6, 14, 20, L(BAG));
        dots(c, ST, [13, 7, 21, 7, 24, 8, 28, 8, 32, 8]);
        c.rect(36, 8, 37, 9, C.paper);
        dots(c, BL, [22, 10, 23, 10, 27, 10]);
        c.rect(26, 9, 30, 9, BD);
      }
      rusty(c, 2, 10, 39, b, 3, 6);
      return () => u && (drip(c, 23, 12, 2), dots(c, BL, [20, b, 16, b, 12, b - 0, 9, b]), dots(c, BD, [17, b, 10, b]));
    },
    sw: 18,
    sh: 32,
    s(c, u) {
      const b = 30;
      c.row(3, 3, 14, IR); // the handle at the far end
      c.col(3, 3, 8, IR);
      c.col(14, 3, 8, IR);
      c.rect(1, 8, 16, 22, ST);
      c.col(1, 8, 22, L(ST));
      c.row(8, 1, 16, L(ST));
      c.rect(1, 21, 16, 22, D(ST));
      for (const x of [2, 15]) {
        c.col(x, 23, b - 2, IR);
        c.rect(x - 1, b - 1, x + 1, b, ID);
      }
      c.row(26, 3, 14, IR);
      if (!u) {
        c.rect(4, 7, 13, 20, BAG);
        c.rect(6, 5, 11, 6, BAG);
        c.row(5, 7, 10, L(BAG));
        c.col(4, 8, 19, L(BAG));
        c.rect(5, 16, 12, 20, BAG);
        c.row(15, 6, 11, L(BAG)); // the feet, nearest
        c.row(20, 4, 13, D(BAG));
        for (let y = 7; y <= 14; y += 2) c.set(9, y, ST);
        c.rect(12, 18, 13, 19, C.paper);
      } else {
        c.rect(4, 9, 13, 20, BAG);
        c.rect(7, 9, 10, 18, NI);
        c.col(6, 9, 18, L(BAG));
        c.poly([[11, 9], [14, 10], [13, 15], [11, 14]], BAG);
        dots(c, ST, [7, 19, 10, 19, 6, 12, 11, 16]);
        dots(c, BL, [8, 21, 9, 21, 12, 21]);
        c.rect(8, 15, 9, 17, BD);
      }
      rusty(c, 1, 8, 16, b, 3, 7);
      return () => u && (drip(c, 9, 23, 2), dots(c, BL, [7, b, 5, b + 1]));
    },
  });

  /* ---------- the sack ---------- */
  function sack(c, x0, x1, u) {
    const m = (x0 + x1) >> 1;
    thin(c, m, 1, 8, C.straw);
    c.rect(m - 1, 9, m + 1, 11, SACK);
    c.row(10, m - 1, m + 1, C.straw);
    c.poly([[m - 1, 12], [m + 1, 12], [x1, 18], [x1, 30], [x1 - 2, 34], [x0 + 2, 34], [x0, 30], [x0, 18]], SACK);
    c.line(m - 1, 12, x0, 18, L(SACK));
    c.col(x0, 18, 29, L(SACK));
    c.oval(x0 + 1, 14, x0 + 5, 19, L(SACK)); // a head-shaped lump
    c.line(x0 + 3, 21, x1 - 1, 26, D(SACK));
    c.line(x1 - 2, 17, x1 - 3, 23, D(SACK));
    c.speckle(x0, 12, x1, 34, D(SACK), 9, 3);
    c.rect(x0 + 1, 30, x1 - 1, 34, BD);
    c.row(29, x0 + 2, x1 - 3, BD);
    dots(c, BL, [x0 + 2, 31, m, 33, x1 - 2, 32, m - 1, 30]);
    c.clear(x0, 34);
    c.clear(x0 + 1, 34);
    c.clear(x1, 34);
    c.clear(x1 - 1, 34);
  }
  O('sack-hanging-dripping', 'sack hanging from a rope dripping blood burlap bag body shape', {
    w: 14,
    h: 46,
    f(c, u) {
      sack(c, 2, 11, u);
      if (u) {
        c.poly([[6, 17], [8, 17], [9, 26], [8, 33], [6, 33], [5, 25]], NI); // slit open
        c.col(6, 20, 24, MEAT);
        c.rect(7, 23, 8, 28, MEATL);
        c.col(8, 26, 37, PALE); // an arm slides out
        c.set(8, 38, D(PALE));
        c.set(7, 38, PALE);
        c.set(8, 27, BL);
      }
      return () => {
        drip(c, 5, 35, u ? 4 : 2);
        drip(c, 9, 35, 1);
        pool(c, u ? 1 : 3, u ? 12 : 10, 44);
        if (u) c.set(8, 40, BL);
      };
    },
    sw: 12,
    s(c, u) {
      sack(c, 2, 9, u);
      if (u) {
        c.col(9, 18, 32, NI);
        c.col(8, 22, 28, MEAT);
        c.col(9, 26, 37, PALE);
        c.set(9, 38, D(PALE));
        c.set(10, 38, PALE);
      }
      return () => {
        drip(c, 5, 35, u ? 4 : 2);
        pool(c, u ? 1 : 3, u ? 10 : 8, 44);
      };
    },
  });

  /* ---------- the cocoon ---------- */
  O('cocoon-figure-wall', 'cocooned figure stuck to a wall wrapped in silk web body spider resin', {
    w: 18,
    h: 44,
    f(c, u) {
      const b = 42;
      c.line(1, 1, 6, 8, SILK);
      c.line(16, 1, 11, 8, SILK);
      c.line(1, 16, 4, 18, SILK);
      c.line(16, 20, 13, 21, SILK);
      c.line(2, b, 6, 36, SILK);
      c.line(15, b, 11, 36, SILK);
      c.oval(5, 4, 12, 13, SILK);
      c.poly([[5, 12], [12, 12], [14, 16], [14, 26], [11, 38], [6, 38], [3, 26], [3, 16]], SILK);
      c.col(4, 16, 26, L(SILK));
      c.set(6, 6, L(SILK));
      for (let y = 10; y <= 36; y += 4) c.line(4, y + 2, 13, y, D(SILK));
      c.line(5, 30, 11, 34, D(SILK));
      c.speckle(3, 4, 14, 38, D(SILK), 12, 2);
      if (!u) {
        c.rect(8, 7, 10, 10, PALE); // a patch of face left bare
        c.set(8, 8, NI);
        c.set(10, 8, NI);
        c.set(9, 10, NI);
      } else {
        c.poly([[8, 6], [10, 6], [11, 14], [12, 24], [9, 36], [8, 36], [6, 24], [7, 14]], NI);
        c.line(7, 6, 5, 16, L(SILK)); // the flaps
        c.line(11, 6, 13, 15, D(SILK));
        dots(c, C.rot, [8, 16, 10, 22, 9, 28, 8, 33]);
        c.col(9, 12, 15, D(C.rot));
      }
      return () => u && (drip(c, 9, 37, 3, C.rot), dots(c, C.rot, [7, b, 8, b, 9, b, 11, b + 1]));
    },
    sw: 12,
    s(c, u) {
      const b = 42;
      c.line(1, 1, 3, 8, SILK);
      c.line(1, b, 3, 36, SILK);
      c.oval(2, 4, 8, 13, SILK);
      c.poly([[2, 12], [8, 12], [9, 17], [9, 26], [6, 38], [2, 38]], SILK);
      c.col(2, 5, 38, L(SILK));
      for (let y = 10; y <= 36; y += 4) c.line(2, y + 2, 9, y, D(SILK));
      c.speckle(2, 4, 9, 38, D(SILK), 12, 2);
      if (!u) {
        c.rect(7, 7, 8, 10, PALE);
        c.set(8, 8, NI);
      } else {
        c.poly([[7, 6], [8, 6], [9, 16], [9, 26], [7, 35], [6, 24], [6, 14]], NI);
        c.line(9, 7, 10, 14, SILK);
        dots(c, C.rot, [7, 18, 8, 24, 7, 30]);
      }
      return () => u && (drip(c, 7, 37, 3, C.rot), dots(c, C.rot, [8, b, 9, b]));
    },
  });

  /* ---------- the mannequin ---------- */
  O('mannequin-bag-head', 'mannequin with a sack over its head shop dummy burlap bag rope faceless', {
    w: 18,
    h: 36,
    f(c, u) {
      const b = 34;
      c.rect(4, b, 13, b, ID); // stand
      c.rect(8, b - 3, 9, b - 1, IR);
      c.rect(5, b - 13, 7, b - 2, PLAS); // legs
      c.rect(10, b - 13, 12, b - 2, PLAS);
      c.rect(4, b - 1, 7, b - 1, PLAS);
      c.rect(10, b - 1, 13, b - 1, PLAS);
      c.rect(4, b - 23, 13, b - 13, PLAS); // torso
      c.row(b - 23, 3, 14, PLAS);
      c.rect(2, b - 22, 3, b - 11, PLAS); // arms
      c.rect(14, b - 22, 15, b - 11, PLAS);
      c.rect(2, b - 10, 3, b - 9, D(PLAS));
      c.rect(14, b - 10, 15, b - 9, D(PLAS));
      c.col(4, b - 22, b - 13, L(PLAS));
      c.col(5, b - 12, b - 2, L(PLAS));
      c.row(b - 13, 5, 12, D(PLAS)); // joints
      c.row(b - 7, 5, 7, D(PLAS));
      c.row(b - 7, 10, 12, D(PLAS));
      c.row(b - 16, 2, 3, D(PLAS));
      c.row(b - 16, 14, 15, D(PLAS));
      c.col(8, b - 12, b - 4, NI);
      c.col(9, b - 12, b - 4, NI);
      c.set(8, b - 18, D(PLAS));
      c.rect(8, b - 24, 9, b - 24, D(PLAS)); // neck
      if (!u) {
        c.rect(5, b - 33, 12, b - 25, SACK);
        c.row(b - 33, 6, 11, L(SACK));
        c.col(5, b - 32, b - 26, L(SACK));
        c.row(b - 25, 5, 12, C.straw);
        c.rect(4, b - 24, 5, b - 24, SACK);
        c.rect(12, b - 24, 13, b - 24, SACK);
        dots(c, BD, [7, b - 30, 10, b - 30, 7, b - 29, 10, b - 29, 8, b - 27, 9, b - 27]);
        c.speckle(5, b - 33, 12, b - 25, D(SACK), 9, 2);
      } else {
        c.oval(5, b - 33, 12, b - 24, PLAS);
        c.col(6, b - 31, b - 27, L(PLAS));
        c.rect(7, b - 30, 7, b - 29, NI); // hollow eyes, a stitched mouth
        c.rect(10, b - 30, 10, b - 29, NI);
        c.row(b - 26, 7, 10, BD);
        dots(c, NI, [7, b - 26, 9, b - 26]);
        c.line(11, b - 32, 12, b - 28, D(PLAS));
        c.rect(13, b - 2, 16, b, SACK); // the bag dropped at its feet
        c.row(b - 2, 14, 15, L(SACK));
        c.set(16, b, C.straw);
      }
    },
    sw: 14,
    s(c, u) {
      const b = 34;
      c.rect(3, b, 10, b, ID);
      c.rect(6, b - 3, 7, b - 1, IR);
      c.rect(5, b - 13, 8, b - 2, PLAS);
      c.rect(5, b - 1, 10, b - 1, PLAS);
      c.rect(4, b - 23, 9, b - 13, PLAS);
      c.set(10, b - 20, PLAS);
      c.set(10, b - 19, PLAS);
      c.rect(6, b - 22, 7, b - 11, D(PLAS)); // the arm
      c.rect(6, b - 10, 7, b - 9, mix(PLAS, 0.55));
      c.col(4, b - 22, b - 13, L(PLAS));
      c.col(5, b - 12, b - 2, L(PLAS));
      c.row(b - 13, 5, 8, D(PLAS));
      c.row(b - 7, 5, 8, D(PLAS));
      c.rect(6, b - 24, 7, b - 24, D(PLAS));
      if (!u) {
        c.rect(3, b - 33, 10, b - 25, SACK);
        c.row(b - 33, 4, 9, L(SACK));
        c.col(3, b - 32, b - 26, L(SACK));
        c.row(b - 25, 3, 10, C.straw);
        dots(c, BD, [9, b - 30, 9, b - 29, 10, b - 27]);
        c.speckle(3, b - 33, 10, b - 25, D(SACK), 9, 2);
      } else {
        c.oval(3, b - 33, 10, b - 24, PLAS);
        c.col(4, b - 31, b - 27, L(PLAS));
        c.set(11, b - 28, PLAS); // nose
        c.rect(9, b - 30, 9, b - 29, NI);
        c.row(b - 26, 9, 10, BD);
        c.rect(9, b - 2, 12, b, SACK);
        c.row(b - 2, 10, 11, L(SACK));
      }
    },
  });

  /* ---------- signals ---------- */
  const TVB = hex('#3d3230');
  function staticScreen(c, x0, y0, x1, y1, seed) {
    const r = rnd(seed);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) c.set(x, y, [C.ash, C.stoneDark, C.white, C.slate, C.stoneLight][(r() * 5) | 0]);
  }
  O('tv-static-handprint', 'television showing static with a bloody handprint on the screen old tv set snow', {
    w: 22,
    h: 22,
    f(c, u) {
      const b = 20;
      c.line(7, 1, 10, 3, ST);
      c.line(15, 1, 12, 3, ST);
      c.rect(1, 4, 20, b - 2, TVB);
      c.row(4, 1, 20, L(TVB));
      c.col(1, 4, b - 2, L(TVB));
      c.rect(2, b - 1, 4, b, ID);
      c.rect(17, b - 1, 19, b, ID);
      c.rect(3, 6, 15, 16, NI);
      staticScreen(c, 4, 7, 14, 15, 5);
      c.rect(17, 7, 18, 8, C.brass);
      c.rect(17, 10, 18, 11, C.brass);
      for (let y = 13; y <= 16; y++) c.row(y, 17, 18, y % 2 ? NI : D(TVB));
      if (!u) {
        c.rect(7, 11, 10, 13, BL); // the handprint
        dots(c, BL, [7, 9, 7, 10, 8, 8, 8, 9, 8, 10, 9, 8, 9, 9, 9, 10, 10, 9, 10, 10, 11, 11, 12, 10, 8, 14, 9, 14]);
        c.col(9, 14, 15, BD);
      } else {
        c.oval(6, 7, 12, 15, C.ghost); // a face comes to the glass
        c.rect(7, 10, 8, 11, NI);
        c.rect(10, 10, 11, 11, NI);
        c.rect(8, 13, 10, 14, NI);
        c.rect(4, 12, 5, 14, C.white);
        c.rect(13, 12, 14, 14, C.white);
        dots(c, C.white, [4, 11, 5, 11, 13, 11, 14, 11]);
      }
      return () => u && dots(c, C.ghost, [0, 9, 0, 13, 21, 10, 3, 2]);
    },
    sw: 18,
    suw: 24,
    s(c, u) {
      const b = 20;
      c.line(8, 1, 10, 3, ST);
      c.rect(6, 4, 14, b - 2, TVB);
      c.poly([[6, 6], [2, 8], [2, 14], [6, 16]], D(TVB)); // the tube behind
      c.row(4, 6, 14, L(TVB));
      c.col(6, 5, b - 2, L(TVB));
      c.rect(7, b - 1, 8, b, ID);
      c.rect(12, b - 1, 13, b, ID);
      c.col(15, 7, 15, u ? C.white : C.ash); // the glass bulging
      c.set(15, 9, C.white);
      c.set(15, 12, u ? C.white : BL);
      c.set(15, 11, u ? C.white : BL);
      c.col(14, 6, 16, NI);
      for (let y = 7; y <= 13; y += 2) c.row(y, 9, 11, NI);
      if (u) {
        c.rect(16, 10, 20, 11, C.ghost); // an arm out of the screen
        c.rect(20, 9, 21, 12, C.ghost);
        dots(c, C.ghost, [22, 8, 22, 10, 22, 12]);
        c.row(11, 16, 20, D(C.ghost));
      }
      return () => u && dots(c, C.ghost, [17, 6, 18, 15]);
    },
  });

  O('radio-hissing', 'old valve radio hissing wooden cathedral wireless dial static voices', {
    w: 18,
    h: 18,
    solid: false,
    f(c, u) {
      const b = 16;
      c.rect(1, 7, 16, b, W);
      c.oval(1, 3, 16, 12, W);
      c.row(b, 1, 16, WD);
      c.col(1, 8, b, WL);
      c.set(4, 4, WL);
      c.set(5, 4, WL);
      c.oval(5, 5, 12, 10, hex('#5a4a26')); // speaker cloth
      for (const x of [7, 10]) c.col(x, 5, 10, WD);
      if (u) c.rect(7, 7, 10, 8, NI), c.set(8, 9, NI), c.set(9, 9, NI);
      c.rect(5, 12, 12, 13, u ? C.glow : hex('#7d7448')); // the dial
      c.set(u ? 10 : 7, 12, C.red);
      c.set(3, 14, C.brass);
      c.set(14, 14, C.brass);
      c.speckle(1, 3, 16, b, WD, 12, 2);
      return () => {
        const g = C.ghost;
        if (u) dots(c, g, [0, 5, 0, 8, 17, 5, 17, 8, 3, 1, 14, 1, 8, 0, 9, 1]);
        else dots(c, g, [0, 6, 17, 7]);
      };
    },
    sw: 12,
    s(c, u) {
      const b = 16;
      c.rect(2, 4, 9, b, W);
      c.row(3, 3, 8, W);
      c.row(b, 2, 9, WD);
      c.col(2, 4, b, WL);
      c.col(9, 5, b - 1, WD);
      c.rect(3, 7, 4, 12, NI); // the open back, a valve glowing
      c.set(3, 10, u ? C.flameLight : C.flame);
      c.set(4, 9, u ? C.flame : RD);
      c.set(10, 14, C.brass);
      c.col(10, 6, 10, hex('#5a4a26'));
      c.set(10, 12, u ? C.glow : hex('#7d7448'));
      c.speckle(2, 3, 9, b, WD, 12, 2);
      return () => u && dots(c, C.ghost, [11, 4, 11, 8, 6, 1, 7, 0, 0, 9]);
    },
  });

  O('siren-pole', 'air raid siren on a pole warning horn alarm red lamp rusty', {
    w: 18,
    h: 58,
    f(c, u) {
      const b = 56;
      c.rect(8, 13, 9, b, IR);
      c.col(8, 13, b, L(IR));
      c.rect(5, b - 1, 12, b, ID);
      c.rect(7, b - 3, 10, b - 2, IR);
      c.rect(6, 5, 11, 12, hex('#6d5a36')); // the drum
      c.col(6, 5, 12, hex('#8a7446'));
      for (let y = 6; y <= 11; y += 2) c.row(y, 7, 10, NI);
      c.poly([[5, 7], [5, 10], [1, 12], [1, 5]], hex('#6d5a36')); // horns
      c.poly([[12, 7], [12, 10], [16, 12], [16, 5]], hex('#6d5a36'));
      c.col(1, 5, 12, hex('#8a7446'));
      c.col(16, 5, 12, D(hex('#6d5a36')));
      c.rect(7, 2, 10, 4, u ? C.red : BD); // the lamp
      c.set(8, 2, u ? hex('#e8a08a') : C.blood);
      c.row(4, 6, 11, ID);
      c.line(10, 13, 10, 30, ID); // cable
      c.rect(10, 31, 11, 35, ID);
      c.set(10, 33, u ? C.red : RU);
      rusty(c, 1, 5, 16, b, 3, 4);
      return () => {
        if (!u) return;
        dots(c, C.red, [5, 1, 12, 1, 5, 3, 12, 3, 8, 0, 9, 0]);
        dots(c, C.ghost, [0, 3, 0, 14, 17, 3, 17, 14]);
      };
    },
    sw: 14,
    s(c, u) {
      const b = 56;
      c.rect(6, 13, 7, b, IR);
      c.col(6, 13, b, L(IR));
      c.rect(3, b - 1, 10, b, ID);
      c.rect(5, b - 3, 8, b - 2, IR);
      c.oval(2, 4, 11, 13, hex('#6d5a36')); // the mouth of the horn
      ring(c, 2, 4, 11, 13, hex('#8a7446'));
      c.oval(4, 6, 9, 11, NI);
      c.rect(6, 8, 7, 9, ID);
      c.rect(5, 1, 8, 3, u ? C.red : BD);
      c.set(6, 1, u ? hex('#e8a08a') : C.blood);
      c.rect(8, 31, 9, 35, ID);
      c.set(8, 33, u ? C.red : RU);
      rusty(c, 1, 4, 12, b, 3, 4);
      return () => {
        if (!u) return;
        dots(c, C.red, [3, 0, 10, 0, 3, 2, 10, 2]);
        dots(c, C.ghost, [0, 6, 0, 11, 13, 6, 13, 11]);
      };
    },
  });

  const PHB = hex('#4b5868');
  O('payphone-off-hook', 'payphone with the receiver hanging off the hook public telephone on a post cord', {
    w: 16,
    h: 40,
    f(c, u) {
      const b = 38;
      c.rect(7, 22, 8, b, IR);
      c.col(7, 22, b, L(IR));
      c.rect(4, b - 1, 11, b, ID);
      c.rect(3, 3, 13, 5, D(PHB)); // hood
      c.row(3, 3, 13, PHB);
      c.rect(4, 6, 12, 21, PHB);
      c.col(4, 6, 21, L(PHB));
      c.rect(6, 7, 10, 8, u ? hex('#7fae6b') : NI); // display
      for (let y = 10; y <= 16; y += 2) for (let x = 6; x <= 10; x += 2) c.set(x, y, C.bone);
      c.rect(11, 9, 11, 11, NI);
      c.rect(6, 18, 10, 19, ID);
      c.set(8, 19, ST);
      rusty(c, 3, 3, 13, b, 2, 5);
      if (!u) {
        c.set(4, 9, ST); // the empty cradle
        for (let y = 22; y <= 28; y++) c.set(3 + (y % 2), y, NI); // the cord
        c.rect(2, 29, 4, 36, NI); // the receiver, dangling
        c.rect(2, 29, 4, 30, C.black);
        c.rect(2, 35, 4, 36, C.black);
        c.col(2, 29, 36, C.slate);
        dots(c, BL, [7, 12, 9, 14]);
      } else {
        c.rect(1, 8, 3, 16, NI); // hung up again
        c.rect(1, 8, 3, 9, C.black);
        c.rect(1, 15, 3, 16, C.black);
        c.col(1, 8, 16, C.slate);
        for (let y = 17; y <= 23; y++) c.set(2 + (y % 2), y, NI);
        dots(c, BL, [2, 11, 2, 12, 1, 13, 7, 12, 9, 14, 8, 16, 6, 14]);
      }
      return () => u && (drip(c, 2, 17, 1), dots(c, hex('#7fae6b'), [8, 1]), dots(c, C.ghost, [14, 7, 15, 8]));
    },
    sw: 14,
    s(c, u) {
      const b = 38;
      c.rect(4, 22, 5, b, IR);
      c.col(4, 22, b, L(IR));
      c.rect(1, b - 1, 8, b, ID);
      c.rect(2, 3, 9, 5, D(PHB));
      c.row(3, 2, 9, PHB);
      c.rect(2, 6, 7, 21, PHB);
      c.col(2, 6, 21, L(PHB));
      c.col(7, 7, 8, u ? hex('#7fae6b') : NI);
      c.col(7, 10, 16, C.bone);
      c.set(7, 11, PHB);
      c.set(7, 13, PHB);
      c.set(7, 15, PHB);
      rusty(c, 1, 3, 9, b, 2, 5);
      if (!u) {
        for (let y = 22; y <= 28; y++) c.set(8 + (y % 2), y, NI);
        c.rect(8, 29, 10, 36, NI);
        c.rect(8, 29, 10, 30, C.black);
        c.rect(8, 35, 10, 36, C.black);
        c.col(8, 29, 36, C.slate);
      } else {
        c.rect(8, 8, 9, 16, NI);
        c.rect(8, 8, 10, 9, C.black);
        c.rect(8, 15, 10, 16, C.black);
        for (let y = 17; y <= 23; y++) c.set(8 + (y % 2), y, NI);
        dots(c, BL, [9, 11, 9, 12]);
      }
      return () => u && drip(c, 9, 17, 1);
    },
  });

  /* ---------- the ward ---------- */
  const CLOTH = hex('#aeb7a4'),
    SHAD = hex('#5d6660');
  O('hospital-screen-shadow', 'hospital folding screen with a shadow behind it curtain partition ward figure silhouette', {
    w: 36,
    h: 42,
    f(c, u) {
      const b = 40;
      for (let i = 0; i < 3; i++) {
        const x0 = 2 + i * 11,
          x1 = x0 + 10;
        c.rect(x0 + 1, 4, x1 - 1, b - 5, CLOTH);
        c.row(4, x0 + 1, x1 - 1, L(CLOTH));
        for (let x = x0 + 3; x < x1; x += 4) c.col(x, 6, b - 6, blend(CLOTH, SHAD, 0.3));
        c.frame(x0, 3, x1, b - 4, ST);
        c.col(x0, 3, b - 4, L(ST));
        c.col(x0, b - 3, b - 1, IR);
        c.set(x0, b, ID);
      }
      c.col(34, b - 3, b - 1, IR);
      c.set(34, b, ID);
      // the shadow
      const sx = u ? 20 : 14,
        k = u ? 1 : 0;
      c.oval(sx - 3 - k, 9 - k * 2, sx + 2 + k, 16, SHAD);
      c.poly([[sx - 5 - k, 18], [sx + 4 + k, 18], [sx + 5 + k, b - 5], [sx - 6 - k, b - 5]], SHAD);
      c.rect(sx - 1, 16, sx, 18, SHAD);
      c.line(sx + 4 + k, 19, sx + 8 + k, 12, SHAD); // an arm raised, something in the hand
      c.line(sx + 5 + k, 19, sx + 9 + k, 12, SHAD);
      c.col(sx + 9 + k, 6, 11, SHAD);
      c.set(sx + 8 + k, 11, SHAD);
      for (let i = 0; i < 4; i++) {
        const x = 2 + i * 11;
        if (x <= 34) c.col(x, 3, b - 4, i === 0 ? L(ST) : ST);
      }
      dots(c, BD, [7, 30, 8, 31, 27, 26]);
      if (u) {
        c.rect(33, 16, 35 - 1, 16, PALE); // fingers round the edge
        c.rect(33, 18, 34, 18, PALE);
        c.rect(33, 20, 34, 20, PALE);
        c.rect(33, 22, 34, 22, D(PALE));
      }
      return () => u && dots(c, BL, [30, b + 1, 32, b + 1, 33, b]);
    },
    sw: 14,
    s(c, u) {
      const b = 40;
      // behind it (to the left): bare feet
      const fx = u ? 4 : 2;
      c.rect(fx, b - 3, fx + 1, b - 1, PALE);
      c.rect(fx, b, fx + 3, b, PALE);
      c.set(fx + 3, b, D(PALE));
      c.poly([[6, 3], [9, 3], [11, b - 4], [8, b - 4]], CLOTH);
      c.line(6, 3, 8, b - 4, L(ST));
      c.line(9, 3, 11, b - 4, ST);
      c.row(3, 6, 9, ST);
      c.row(b - 4, 8, 11, ST);
      c.line(8, 5, 9, b - 6, D(CLOTH));
      c.col(8, b - 3, b - 1, IR);
      c.col(11, b - 3, b - 1, IR);
      c.set(8, b, ID);
      c.set(11, b, ID);
      if (u) {
        c.rect(9, 16, 10, 16, PALE);
        c.rect(9, 18, 11, 18, PALE);
        c.rect(10, 20, 11, 20, PALE);
        c.set(10, 22, D(PALE));
      }
      return () => u && dots(c, BL, [5, b + 1, 9, b + 1]);
    },
  });

  const LOCK = hex('#5c6a62');
  function lockerDoor(c, x0, y0, x1, y1, n) {
    c.rect(x0, y0, x1, y1, LOCK);
    c.col(x0, y0, y1, L(LOCK));
    c.col(x1, y0, y1, D(LOCK));
    for (let y = y0 + 2; y <= y0 + 6; y += 2) c.row(y, x0 + 2, x1 - 2, NI);
    c.rect(x1 - 2, (y0 + y1) >> 1, x1 - 1, ((y0 + y1) >> 1) + 2, ST);
    c.rect(x0 + 3, y0 + 9, x1 - 3, y0 + 10, C.paper);
    c.set(x0 + 3 + (n % 3), y0 + 9, NI);
    for (let y = y1 - 5; y <= y1 - 3; y += 2) c.row(y, x0 + 2, x1 - 2, NI);
  }
  O('locker-row-rusty', 'row of rusty lockers dented metal doors changing room school factory something inside', {
    w: 34,
    h: 42,
    f(c, u) {
      const b = 40;
      c.rect(1, 2, 32, b - 2, D(LOCK));
      c.row(2, 1, 32, LOCK);
      for (let i = 0; i < 3; i++) {
        const x0 = 2 + i * 10;
        if (u && i === 1) {
          c.rect(x0, 4, x0 + 9, b - 3, NI);
          c.rect(x0, 4, x0 + 1, b - 3, D(LOCK)); // the door, edge on
          c.col(x0, 4, b - 3, LOCK);
          c.row(7, x0 + 3, x0 + 8, ID); // the rail and what hangs from it
          c.col(x0 + 6, 8, 10, ST);
          c.oval(x0 + 4, 10, x0 + 8, 15, mix(PALE, 0.6));
          c.rect(x0 + 3, 16, x0 + 9, 28, hex('#2a2a33'));
          c.rect(x0 + 4, 29, x0 + 5, 33, mix(PALE, 0.7));
          c.rect(x0 + 7, 29, x0 + 8, 33, mix(PALE, 0.7));
          c.set(x0 + 5, 12, NI);
          c.set(x0 + 7, 12, NI);
          c.row(b - 3, x0 + 2, x0 + 9, BD);
        } else lockerDoor(c, x0, 4, x0 + 9, b - 3, i);
      }
      c.rect(2, b - 1, 3, b, ID);
      c.rect(30, b - 1, 31, b, ID);
      c.rect(15, b - 1, 16, b, ID);
      c.line(25, 20, 28, 26, D(LOCK)); // a dent
      c.line(26, 20, 29, 25, L(LOCK));
      dots(c, D(LOCK), [5, 18, 6, 19, 7, 20, 6, 22, 7, 23]);
      rusty(c, 1, 2, 32, b - 2, 2, 4);
      if (!u) c.row(b - 3, 13, 20, BD);
      return () => {
        drip(c, 15, b - 2, 1);
        dots(c, BL, u ? [14, b, 17, b, 18, b, 19, b + 1, 21, b] : [17, b]);
      };
    },
    sw: 12,
    suw: 22,
    s(c, u) {
      const b = 40;
      c.rect(1, 2, 10, b - 2, D(LOCK));
      c.row(2, 1, 10, LOCK);
      c.col(1, 2, b - 2, LOCK);
      c.col(10, 3, b - 2, mix(LOCK, 0.5));
      c.rect(2, b - 1, 3, b, ID);
      c.rect(8, b - 1, 9, b, ID);
      for (let y = 6; y <= 10; y += 2) c.row(y, 4, 7, mix(LOCK, 0.5));
      rusty(c, 1, 2, 10, b - 2, 2, 4);
      if (u) {
        lockerDoor(c, 11, 4, 20, b - 3, 1);
        rusty(c, 11, 4, 20, b - 3, 5, 5);
        dots(c, BL, [14, 22, 15, 23, 15, 25]);
      } else c.rect(11, 20, 11, 22, ST);
      return () => u && dots(c, BL, [11, b, 13, b]);
    },
  });

  const TICK = hex('#b9b09a'),
    STRIPE = hex('#6f7888');
  O('mattress-bloody-upright', 'bloody mattress standing upright against the wall stained striped ticking torn', {
    w: 22,
    h: 42,
    uh: 24,
    f(c, u) {
      if (!u) {
        const b = 40;
        c.rect(2, 3, 19, b, TICK);
        c.row(2, 4, 17, TICK);
        for (let x = 4; x <= 18; x += 3) c.col(x, 3, b, STRIPE);
        c.col(2, 3, b, L(TICK));
        c.row(b, 2, 19, D(TICK));
        for (let y = 8; y <= b - 4; y += 8) for (let x = 6; x <= 16; x += 5) c.set(x, y, D(TICK));
        c.oval(6, 14, 16, 28, BD);
        c.oval(8, 17, 14, 25, BL);
        c.speckle(4, 11, 18, 32, BD, 9, 3);
        c.col(11, 28, 36, BD);
        c.col(13, 27, 31, BD);
        c.line(15, 3, 18, 7, NI); // a torn corner
        dots(c, C.white, [16, 3, 17, 5, 18, 4]);
        c.speckle(2, 3, 19, b, D(TICK), 25, 2);
        return;
      }
      // fallen flat, seen from its foot end
      const b = 22;
      c.rect(2, 4, 19, 17, TICK);
      for (let x = 4; x <= 18; x += 3) c.col(x, 4, 17, STRIPE);
      c.col(2, 4, 17, L(TICK));
      c.oval(6, 6, 16, 14, BD);
      c.oval(8, 8, 14, 12, BL);
      c.rect(2, 18, 19, b, D(TICK));
      c.row(18, 2, 19, TICK);
      for (let x = 4; x <= 18; x += 3) c.col(x, 19, b, D(STRIPE));
      c.row(20, 2, 19, mix(TICK, 0.55));
      return () => dots(c, C.ash, [0, 21, 21, 20, 1, 23, 20, 23]);
    },
    sw: 12,
    suw: 42,
    suh: 10,
    s(c, u) {
      if (!u) {
        const b = 40;
        c.poly([[2, b], [6, b], [9, 2], [5, 2]], D(TICK));
        c.line(2, b, 5, 2, TICK);
        c.line(4, b, 7, 2, mix(TICK, 0.55));
        c.line(6, b, 9, 2, STRIPE);
        dots(c, BD, [7, 18, 7, 22, 6, 30]);
        return;
      }
      const b = 8;
      c.rect(1, 3, 39, b, D(TICK));
      c.row(3, 1, 39, TICK);
      c.row(5, 1, 39, mix(TICK, 0.55));
      for (let x = 3; x <= 38; x += 3) c.set(x, 4, STRIPE), c.col(x, 6, b, D(STRIPE));
      c.row(3, 12, 26, BD);
      c.row(3, 15, 22, BL);
      dots(c, BD, [18, 4, 21, 5]);
      return () => dots(c, C.ash, [0, 6, 41, 6, 40, 3]);
    },
  });

  /* ---------- small and holy ---------- */
  const BN = C.bone,
    BNd = D(C.bone);
  const boneLantern = (side) => (c, u) => {
    const b = 22;
    ring(c, 4, 1, 7, 4, IR);
    c.oval(3, 4, 8, 9, BN); // the skull on top
    c.row(9, 4, 7, BNd);
    if (side) {
      c.set(8, 6, u ? C.flame : NI);
      c.set(7, 6, u ? C.flame : NI);
      c.set(9, 7, BN);
      c.set(8, 8, NI);
    } else {
      c.set(4, 6, u ? C.flame : NI);
      c.set(7, 6, u ? C.flame : NI);
      c.set(5, 8, NI);
      c.set(6, 8, NI);
    }
    c.rect(3, 10, 8, 19, u ? hex('#7a5a2a') : NI);
    if (u) {
      c.rect(4, 13, 7, 19, C.flame);
      c.rect(5, 14, 6, 18, C.flameLight);
      c.set(5, 12, C.flame);
    }
    c.col(5, 17, 19, BN); // the candle
    c.col(6, 17, 19, BNd);
    c.set(5, 16, u ? C.glow : C.black);
    c.col(2, 10, 20, BN); // bones for posts
    c.col(9, 10, 20, BN);
    c.set(1, 10, BN);
    c.set(1, 20, BN);
    c.set(10, 10, BNd);
    c.set(10, 20, BNd);
    if (!side) c.col(5 + 1, 10, 12, BNd);
    c.row(15, 3, 8, side ? BNd : u ? C.flame : NI);
    c.rect(2, 21, 9, b, BN);
    c.row(b, 2, 9, BNd);
    dots(c, BNd, [4, 21, 6, 21, 8, 21]);
    return () => u && dots(c, C.flame, [0, 13, 11, 15, 0, 17, 11, 12]);
  };
  O('lantern-bones', 'lantern made of bones with a skull on top candle light grisly lamp', {
    w: 12,
    h: 24,
    solid: false,
    f: boneLantern(false),
    sw: 12,
    s: boneLantern(true),
  });

  O('shrine-teeth', 'shrine of teeth cement alcove like a mouth candles bowl of teeth offering altar', {
    w: 24,
    h: 32,
    f(c, u) {
      const b = 30;
      c.rect(2, 6, 21, b, CE);
      c.oval(2, 1, 21, 14, CE);
      c.col(2, 7, b, CL);
      c.rect(1, b - 1, 22, b, CD);
      c.rect(5, 10, 18, 24, u ? hex('#3a2418') : NI);
      c.oval(5, 5, 18, 16, u ? hex('#3a2418') : NI);
      for (let x = 6; x <= 17; x += 2) {
        const t = 6 + Math.round(Math.abs(x - 11.5) * 0.45);
        c.col(x, t, t + 2, BN); // upper teeth
        c.set(x, t + 3, BNd);
        c.col(x, 22, 24, BN); // lower teeth
        c.set(x, 21, x % 4 ? BN : BNd);
      }
      c.rect(9, 17, 14, 19, C.rust); // a bowl heaped with teeth
      c.row(17, 9, 14, RL);
      dots(c, BN, [9, 16, 10, 15, 11, 16, 12, 15, 13, 16, 14, 16, 11, 14]);
      for (const x of [7, 16]) {
        c.col(x, 16, 19, BN);
        c.set(x, 15, u ? C.flameLight : C.black);
        if (u) c.set(x, 14, C.flame);
      }
      c.rect(5, 25, 18, 26, CL);
      c.speckle(2, 1, 21, b, CD, 20, 4);
      c.line(4, 27, 7, b, CD);
      if (u) {
        c.set(12, 14, BL); // a fresh one
        c.rect(11, 20, 12, 20, BL);
        c.row(25, 10, 13, BL);
      } else c.set(13, 25, BD);
      return () => u && (drip(c, 11, 27, 2), dots(c, C.flame, [7, 12, 16, 12]));
    },
    sw: 14,
    s(c, u) {
      const b = 30;
      c.rect(2, 6, 10, b, CE);
      c.oval(2, 1, 13, 14, CE);
      c.rect(11, 2, 13, 14, null);
      c.clearRect(11, 1, 13, 30);
      c.col(2, 4, b, CL);
      c.rect(1, b - 1, 11, b, CD);
      c.col(10, 6, 24, u ? hex('#3a2418') : NI);
      for (const y of [7, 9, 11]) c.set(11, y, BN);
      for (const y of [20, 22, 24]) c.set(11, y, BN);
      c.rect(10, 25, 11, 26, CL);
      c.col(11, 16, 19, BN);
      c.set(11, 15, u ? C.flameLight : C.black);
      c.speckle(2, 1, 10, b, CD, 20, 4);
      if (u) c.set(11, 27, BL);
      return () => u && dots(c, C.flame, [12, 13, 12, 17]);
    },
  });

  /* ---------- the well ---------- */
  function wellRing(c, x0, x1, b) {
    c.rect(x0, 23, x1, b, CE);
    c.oval(x0, 19, x1, 26, CL);
    c.oval(x0 + 2, 20, x1 - 2, 25, NI);
    for (let y = 27; y <= b; y += 3) {
      c.row(y, x0, x1, CD);
      for (let x = x0 + 2 + ((y / 3) % 2 | 0) * 3; x < x1; x += 6) c.col(x, y - 2, y - 1, CD);
    }
    c.col(x0, 23, b, CL);
    c.speckle(x0, 23, x1, b, C.moss, 16, 3);
  }
  O('well-rope-down', 'cement well with a rope going down into the dark pulley iron frame shaft', {
    w: 28,
    h: 36,
    f(c, u) {
      const b = 34;
      wellRing(c, 3, 24, b);
      for (const x of [3, 23]) {
        c.rect(x, 4, x + 1, 23, IR);
        c.col(x, 4, 23, L(IR));
      }
      c.rect(2, 3, 25, 4, IR);
      c.row(3, 2, 25, L(IR));
      ring(c, 11, 5, 16, 10, ST);
      c.rect(13, 7, 14, 8, ID);
      rusty(c, 2, 3, 25, 22, 3, 4);
      const R = C.straw;
      c.line(16, 8, 23, 16, R); // made fast to the post
      c.rect(22, 16, 25, 17, R);
      if (!u) thin(c, 11, 8, 22, R);
      else {
        thin(c, 11, 8, 12, R);
        hook(c, 11, 13, ST);
        c.rect(8, 16, 14, 21, hex('#5a5148')); // what came up: a bucket
        c.row(16, 8, 14, ST);
        c.row(19, 8, 14, IR);
        c.rect(13, 14, 14, 16, PALE); // and a hand over its rim
        c.col(15, 15, 19, PALE);
        c.set(15, 20, D(PALE));
        dots(c, BL, [9, 18, 12, 20]);
        c.rect(4, 20, 6, 20, BL); // wet prints on the rim
        c.set(5, 19, BL);
      }
      return () => u && (drip(c, 9, 22, 1, C.water), drip(c, 12, 22, 2, C.water), dots(c, BL, [1, b, 2, b]));
    },
    sw: 26,
    s(c, u) {
      const b = 34;
      wellRing(c, 2, 23, b);
      c.rect(12, 4, 13, 22, IR);
      c.col(12, 4, 22, L(IR));
      c.rect(11, 3, 14, 4, IR);
      c.line(7, 22, 12, 12, ID);
      c.line(18, 22, 13, 12, ID);
      c.rect(14, 5, 15, 10, ST); // pulley, edge on
      rusty(c, 7, 3, 18, 22, 3, 4);
      const R = C.straw;
      c.col(11, 8, 16, R);
      if (!u) thin(c, 16, 8, 22, R);
      else {
        thin(c, 16, 8, 12, R);
        hook(c, 16, 13, ST);
        c.rect(14, 16, 19, 21, hex('#5a5148'));
        c.row(16, 14, 19, ST);
        c.row(19, 14, 19, IR);
        c.rect(18, 14, 19, 16, PALE);
        c.col(20, 15, 19, PALE);
        c.set(20, 20, D(PALE));
        c.rect(5, 21, 7, 21, BL);
      }
      return () => u && (drip(c, 15, 22, 1, C.water), drip(c, 18, 22, 2, C.water));
    },
  });
};
