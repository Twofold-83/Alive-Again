/* The cottage creatures of be-country.js: the cottage and its kitchen. draw(g, r): r is 1 when roused. */
module.exports = (k, be) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, P, vd, fig, face, arm, legs, spiderLegs, ribs, curve } = k;
  const GREYFUR = hex('#6a6662'),
    LINEN = hex('#b9b3a2'),
    BONNET = hex('#d2ccba'),
    BLACKFUR = hex('#2c2830'),
    CLAW = hex('#2a2628');

  /* ================= the large ones: tall ================= */
  be('cottage-grandmother-wolf', 'grandmother wolf large tall granny old woman nightgown bonnet disguise monster teeth werewolf', (g, r) => {
    const SH = C.wine;
    if (r) g.limb([[15, 37], [20, 35], [22, 28]], 1.8, 0.8, GREYFUR);
    else g.limb([[16, 39], [19, 40], [20, 42]], 1.4, 0.8, GREYFUR); // the tail under the hem
    g.poly([[7, 14], [14, 14], [18, 42], [3, 42]], LINEN); // the nightgown
    for (const x of [6, 10, 14]) g.line(x + 1, 24, x + (x - 10) / 2, 42, dark(LINEN));
    g.lit(3, 22, 10, 42);
    if (r) {
      g.hem(42, 3, 18, 5, 5);
      g.poly([[8, 15], [13, 15], [12, 27], [9, 25]], GREYFUR); // the gown torn open on fur
      g.speckle(8, 15, 13, 27, dark(GREYFUR), 3, 2);
      g.rect(8, 40, 10, 42, GREYFUR); // hind paws
      g.rect(12, 40, 14, 42, GREYFUR);
      g.pts([[7, 42], [9, 43], [11, 43], [15, 42]], CLAW);
      g.poly([[14, 14], [17, 15], [19, 27], [15, 24]], SH); // the shawl, slipping
      arm(g, [[5, 16], [1, 12], [-1, 5]], LINEN, GREYFUR, P.TOOTH, 1.7);
      arm(g.flip(21), [[5, 16], [1, 13], [-2, 8]], LINEN, GREYFUR, P.TOOTH, 1.7);
      g.ball(4, -3, 17, 7, BONNET); // the bonnet thrown back
      g.line(5, 7, 3, 12, BONNET);
      g.poly([[5, 0], [6, -5], [9, -1]], GREYFUR); // ears
      g.poly([[12, -1], [15, -5], [16, 0]], GREYFUR);
      g.pts([[6, -2], [15, -2]], vd(GREYFUR));
      g.ball(5, -2, 16, 8, GREYFUR);
      g.eye(7, 2, 2, P.YEL);
      g.eye(13, 2, 2, P.YEL);
      g.pts([[6, 1], [7, 1], [14, 1], [15, 1]], vd(GREYFUR)); // the brow
      g.rect(7, 6, 14, 9, GREYFUR); // the muzzle
      g.row(6, 8, 13, lite(GREYFUR));
      g.rect(10, 7, 11, 8, K);
      g.maw(7, 10, 14, 16, { len: 2, tongue: P.GUM });
      g.rect(7, 17, 14, 18, dark(GREYFUR)); // the lower jaw
      g.pts([[6, 10], [15, 10], [6, 16], [15, 16]], dark(GREYFUR));
    } else {
      g.poly([[5, 13], [16, 13], [18, 21], [3, 21]], SH); // the shawl
      g.row(21, 3, 18, dark(SH));
      for (let x = 3; x <= 18; x += 2) g.set(x, 22, dark(SH));
      g.rect(3, 20, 5, 28, LINEN); // sleeves, and what hangs out of them
      g.rect(16, 20, 18, 28, LINEN);
      g.rect(3, 29, 5, 31, GREYFUR);
      g.rect(16, 29, 18, 31, GREYFUR);
      g.claws(4, 32, 0, 1, CLAW, 3, 2);
      g.claws(17, 32, 0, 1, CLAW, 3, 2);
      g.ball(5, 1, 16, 13, BONNET); // the bonnet
      for (let x = 6; x <= 15; x += 2) g.set(x, 13, dark(BONNET));
      g.oval(7, 4, 14, 12, vd(GREYFUR)); // the face in its shadow
      g.rect(9, 7, 12, 13, GREYFUR); // too long a nose
      g.col(9, 7, 13, lite(GREYFUR));
      g.row(13, 10, 11, K);
      g.pts([[8, 6], [13, 6]], P.YEL);
      g.pts([[9, 14], [12, 14]], P.TOOTH);
      g.row(5, 8, 13, hex('#8a8680')); // a grey fringe
    }
  });

  be('cottage-chimney-crawler', 'chimney crawler large tall soot black thin sweep brush head long arms monster', (g, r) => {
    const S = P.SOOT,
      S2 = hex('#3e383a'),
      S3 = hex('#5a5452');
    g.leg([[8, 30], [5, 37], [8, 44]], S2, 2, -1); // legs that bend the wrong way
    g.leg([[11, 30], [14, 37], [11, 44]], S2, 2, 1);
    g.tube([[10, 12], [9, 21], [10, 30]], 2.3, 1.6, S2, S);
    for (const y of [15, 17, 19, 21]) g.row(y, 8, 11, S3); // ribs under the soot
    const A = r ? [[8, 13], [1, 9], [-5, 1]] : [[8, 13], [4, 27], [3, 40]];
    for (const v of [g, g.flip(19)]) {
      v.path(A, S2);
      v.path(A.map(([x, y]) => [x + 1, y]), S);
      const [x, y] = A[2];
      v.claws(x, y + (r ? -1 : 1), r ? -1 : 0, r ? -1 : 1, S3, 3, r ? 4 : 3);
    }
    for (let a = 0; a < 16; a++) {
      // the head is a sweep's brush
      const t = (a / 16) * Math.PI * 2,
        R = r ? 7.5 : 5.5;
      g.line(10, 6, 10 + Math.cos(t) * R, 6 + Math.sin(t) * R * 0.9, a % 2 ? S : S2);
    }
    g.ball(7, 3, 13, 9, S2, S3, S);
    if (r) {
      g.eye(7, 4, 2, C.flameLight, C.flame);
      g.eye(12, 4, 2, C.flameLight, C.flame);
      g.maw(8, 7, 12, 9, { col: C.flame, teeth: S, len: 1 });
      g.pts([[2, 18], [17, 22], [15, 3], [4, 30], [18, 34]], S); // soot shaken loose
    } else {
      g.pts([[8, 5], [12, 5]], P.EYE);
      g.row(8, 9, 11, S);
    }
  });

  be('cottage-smoke-figure', 'smoke figure large tall hearth ghost ember ash column grey spirit', (g, r) => {
    const S = hex('#77747a'),
      S2 = hex('#96939a'),
      SD = hex('#55525a');
    g.oval(6, 41, 17, 44, P.SOOT); // the embers it rises from
    g.pts([[8, 42], [11, 43], [14, 42], [10, 41], [15, 43]], C.flame);
    g.set(12, 42, C.flameLight);
    if (r) g.fire(8, 33, 15, 43);
    g.limb([[12, 40], [9, 34], [14, 28], [10, 21], [12, 14]], 1.6, 5.5, S, SD);
    if (r) {
      for (const v of [g, g.flip(23)]) {
        v.limb([[6, 17], [0, 15], [-3, 7]], 2.6, 1, S, SD);
        v.path([[-3, 6], [-4, 1]], S2);
        v.path([[-2, 6], [-1, 2]], S);
        v.path([[-4, 7], [-7, 4]], S);
      }
    } else {
      g.limb([[6, 17], [3, 26], [5, 35]], 2.2, 0.8, S, SD); // arms too long, trailing
      g.limb([[18, 17], [21, 27], [19, 37]], 2.2, 0.8, SD, SD);
    }
    g.ball(6, 1, 17, 17, S, S2, SD); // a long head
    g.ball(3, 13, 20, 20, S, S2, SD);
    g.pts([[9, 0], [12, -1], [14, 0], [11, -3], [15, -2]], S2); // it frays at the top
    g.rect(8, 6, 9, 10, vd(S)); // hollow eyes
    g.rect(14, 6, 15, 10, vd(S));
    g.pts([[8, 11], [14, 12], [8, 13]], SD);
    if (r) {
      g.pts([[8, 8], [14, 8]], C.flameLight);
      g.pts([[9, 9], [15, 9]], C.flame);
      g.maw(9, 12, 14, 21, { round: 1, teeth: false, col: vd(S) });
      g.pts([[11, 18], [12, 19]], C.flame);
    } else g.rect(10, 13, 13, 14, vd(S));
  });

  be('cottage-well-woman', 'well woman large tall drowned wet long hair bucket pale ghost stretched neck', (g, r) => {
    const SK = P.DROWN,
      HAIR = hex('#1e1d26'),
      GOWN = hex('#63747a'),
      hy = r ? -7 : 0;
    g.rect(4, 37, 15, 44, C.wood); // the bucket she stands in
    for (const x of [7, 10, 13]) g.col(x, 37, 44, C.woodDark);
    g.row(39, 4, 15, C.iron);
    g.row(43, 4, 15, C.iron);
    g.row(37, 5, 14, vd(C.water));
    g.tube([[10, 37], [9, 28], [10, 19]], 3.3, 2.6, GOWN);
    g.line(8, 22, 7, 36, dark(GOWN));
    g.line(11, 24, 12, 36, dark(GOWN));
    g.rect(9, 12 + hy, 10, 18, SK); // a neck that goes on
    g.col(10, 12 + hy, 18, dark(SK));
    g.ball(6, 4 + hy, 13, 13 + hy, SK);
    g.rect(5, 3 + hy, 14, 5 + hy, HAIR);
    g.row(2 + hy, 6, 13, HAIR);
    if (r) {
      for (const [x, n] of [[4, 22], [5, 28], [6, 12], [13, 13], [14, 30], [15, 20]]) g.col(x, 5 + hy, 5 + hy + n, HAIR);
      g.rect(7, 7 + hy, 8, 8 + hy, K);
      g.rect(11, 7 + hy, 12, 8 + hy, K);
      g.pts([[8, 8 + hy], [12, 8 + hy]], P.EYE);
      g.maw(8, 10 + hy, 11, 17 + hy, { round: 1, teeth: false });
      for (const v of [g, g.flip(19)]) {
        v.tube([[6, 21], [1, 20], [-3, 13]], 1.1, 0.8, SK);
        v.claws(-3, 11, 0, -1, SK, 4, 4);
      }
      g.pts([[2, 26], [17, 27], [-2, 20], [21, 22], [9, 20]], C.glassLight);
    } else {
      for (let x = 5; x <= 14; x++) g.col(x, 5, 16 + ((x * 7) % 5) * 2 + (x < 7 || x > 12 ? 6 : 0), x % 3 ? HAIR : hex('#2a2a36'));
      g.set(11, 8, P.EYE); // one eye, through the hair
      for (const v of [g, g.flip(19)]) {
        v.tube([[6, 21], [4, 28], [4, 34]], 1, 0.8, SK);
        v.claws(4, 35, 0, 1, SK, 3, 3);
      }
      g.pts([[3, 40], [16, 41], [10, 30]], C.glassLight);
    }
  });

  /* ================= the large ones: long ================= */
  be('cottage-cellar-toad', 'cellar toad large long huge pig sized warty wet frog human teeth monster', (g, r) => {
    const T = hex('#5e5a3c'),
      TB = hex('#8f8a66'),
      W = hex('#7c7850');
    g.ball(1, 12, 10, 23, dark(T)); // hind legs folded at its sides
    g.ball(33, 12, 42, 23, dark(T));
    g.ball(4, 7, 39, 23, T);
    g.oval(11, 16, 32, 23, TB); // the pale throat
    g.speckle(11, 16, 32, 23, dark(TB), 7, 3);
    for (const x of [9, 28]) {
      g.ball(x, 2, x + 7, 10, T);
      g.rect(x + 2, 4, x + 5, 7, r ? P.YEL : dark(P.YEL));
      if (r) g.rect(x + 3, 5, x + 4, 6, K);
      else g.row(6, x + 2, x + 5, K);
    }
    g.pts([[7, 10], [13, 12], [20, 9], [24, 11], [31, 12], [36, 10], [17, 8], [27, 13], [5, 14], [38, 15]], W); // warts
    g.pts([[8, 11], [21, 10], [32, 13], [37, 11]], dark(T));
    if (r) {
      g.maw(7, 12, 36, 22, { round: 1, teeth: false, tongue: P.GUM, tl: 1 });
      for (let x = 10; x <= 33; x++) if (x % 3) g.col(x, 13 + (x < 13 || x > 30 ? 1 : 0), 14 + (x < 13 || x > 30 ? 1 : 0), P.TOOTH); // a person's teeth
      for (let x = 12; x <= 31; x++) if (x % 3 !== 1) g.set(x, 21 - (x < 14 || x > 29 ? 1 : 0), P.TOOTH);
      g.limb([[33, 18], [40, 12], [46, 13]], 1.6, 1, P.RAW); // the tongue, and what it caught
      g.oval(45, 11, 49, 14, GREYFUR);
      g.path([[49, 13], [51, 15], [52, 14]], P.RAW);
      g.set(46, 12, K);
    } else {
      g.row(14, 8, 35, vd(T));
      g.pts([[7, 13], [36, 13], [6, 12], [37, 12]], vd(T));
    }
    for (const x of [8, 31]) {
      g.rect(x, 21, x + 4, 23, T);
      g.pts([[x - 1, 24], [x + 1, 24], [x + 3, 24], [x + 5, 24]], W);
      g.row(23, x, x + 4, dark(T));
    }
  });

  be('cottage-thatch-spider', 'thatch spider large long roof straw huge legs many eyes monster', (g, r) => {
    const L = hex('#3a2c22'),
      ST = C.straw;
    spiderLegs(g, 24, 13, r ? 3 : 4, 13, 22, L, { k0: 7, f0: 9, lift: 10, sag: 3, thick: 1 });
    if (r)
      for (const s of [-1, 1]) {
        // the front pair lifted to strike
        g.path([[24 + s * 3, 13], [24 + s * 9, -1], [24 + s * 13, -7], [24 + s * 11, 2]], L);
        g.path([[24 + s * 3, 14], [24 + s * 9, 0], [24 + s * 13, -6]], L);
      }
    g.ball(14, 4, 33, 18, ST); // a body of old thatch
    for (let i = 0; i < 9; i++) g.line(16 + i * 2, 6 + (i % 2), 15 + i * 2 + (i % 3), 17, dark(ST));
    for (const x of [16, 19, 23, 26, 30, 32]) g.line(x, 5, x + ((x % 3) - 1), 2 - (x % 2), x % 2 ? ST : dark(ST));
    g.row(10, 15, 32, C.woodDark); // a hazel spar still through it
    g.pts([[14, 10], [33, 10]], C.woodDark);
    g.speckle(14, 12, 33, 18, C.moss, 9, 4);
    g.ball(19, 13, 28, 21, L, hex('#54423a'), vd(L)); // the head, hanging under
    const e = r ? P.RED : hex('#9a9078');
    g.pts([[21, 15], [23, 15], [24, 15], [26, 15], [20, 17], [22, 17], [25, 17], [27, 17]], e);
    g.col(22, 20, r ? 23 : 21, P.TOOTH);
    g.col(25, 20, r ? 23 : 21, P.TOOTH);
  });

  be('cottage-quilt-thing', 'quilt thing large long patchwork blanket bed many feet hands eyes under crawling', (g, r) => {
    const cols = [C.wine, C.navy, C.mustard, C.forest, hex('#8d866e'), C.plum, C.teal, C.rust];
    for (let x = 2; x <= 43; x++) {
      const t = (x - 2) / 41,
        top = Math.round(19 - 14 * Math.pow(Math.sin(Math.PI * t), 0.5) + Math.sin(x * 0.45) * 1.3),
        bot = r && x > 25 ? 20 - Math.round(Math.min(7, (x - 25) * 0.8)) : 20;
      for (let y = top; y <= bot; y++) {
        const u = x + (y >> 2),
          col = cols[(((u / 6) | 0) * 3 + ((y / 5) | 0) * 5) % 8];
        g.set(x, y, u % 6 === 0 || y % 5 === 0 ? dark(col) : y === top ? lite(col) : col);
      }
    }
    for (const fx of [4, 10, 16, 22, 29, 36]) {
      // too many bare feet
      if (r && fx > 24) continue;
      g.rect(fx, 20, fx + 2, 22, P.PALE);
      g.set(fx + (fx % 4 ? 3 : -1), 22, P.PALE);
      g.row(22, fx, fx + 2, dark(P.PALE));
    }
    if (r) {
      g.rect(27, 15, 43, 22, P.MAW); // lifted: the dark under it
      for (let x = 27; x <= 43; x++) for (let y = 13; y <= 20; y++) if (!g.get(x, y)) g.set(x, y, P.MAW);
      g.pts([[30, 17], [33, 16], [35, 19], [38, 17], [41, 18], [31, 20]], P.EYE);
      g.pts([[31, 17], [34, 16], [39, 17]], P.YEL);
      arm(g, [[36, 20], [43, 17], [49, 19]], P.PALE, P.PALE, P.PALE, 1.1);
      arm(g, [[32, 21], [40, 22], [47, 22]], dark(P.PALE), P.PALE, P.PALE, 1.1);
      g.rect(27, 21, 29, 22, P.PALE);
    } else {
      g.rect(40, 19, 42, 21, P.PALE); // one hand, at the edge
      g.claws(43, 20, 1, 0, P.PALE, 3, 2);
    }
  });

  be('cottage-woodpile-crawler', 'woodpile crawler large long firewood logs centipede kindling legs splinter jaws monster', (g, r) => {
    const B = C.wood,
      E = C.woodPale,
      KIN = hex('#8c6f48');
    const seg = (i) => {
      const rear = r && i >= 4 ? (i - 3) * 4 : 0;
      return [2 + Math.round(i * 5.2), 7 + Math.round(Math.sin(i * 1.3) * 1.3) - rear, rear];
    };
    for (let i = 0; i < 8; i++) {
      const [x, y, rear] = seg(i);
      if (rear) {
        g.line(x + 2, y + 5, x + 6, y + 9, KIN); // legs off the ground
        g.line(x + 4, y + 5, x + 9, y + 7, dark(KIN));
      } else {
        g.path([[x + 1, y + 5], [x - 1, y + 7], [x, 16]], KIN);
        g.path([[x + 4, y + 5], [x + 6, y + 7], [x + 5, 16]], dark(KIN));
      }
    }
    for (let i = 0; i < 7; i++) {
      const [x, y] = seg(i);
      g.ball(x, y, x + 6, y + 6, i % 3 === 1 ? C.woodDark : B); // each joint a log, end on
      g.oval(x + 1, y + 1, x + 5, y + 5, E);
      g.oval(x + 2, y + 2, x + 4, y + 4, dark(E));
      g.set(x + 3, y + 3, i % 2 ? C.woodDark : E);
    }
    const [hx, hy] = seg(7);
    if (r) {
      g.ball(hx, hy - 3, hx + 7, hy + 2, B); // the head log split into jaws
      g.ball(hx, hy + 5, hx + 7, hy + 9, C.woodDark);
      g.rect(hx + 1, hy + 2, hx + 6, hy + 5, P.MAW);
      g.teeth(hy + 2, hx + 1, hx + 6, E, 2, 2, 1);
      g.teeth(hy + 5, hx + 2, hx + 6, E, 2, 2, -1);
      g.pts([[hx + 2, hy - 1], [hx + 5, hy - 1]], C.flameLight);
      g.path([[hx + 2, hy - 3], [hx + 1, hy - 6]], KIN);
      g.path([[hx + 5, hy - 3], [hx + 7, hy - 6]], KIN);
    } else {
      g.ball(hx, hy - 1, hx + 7, hy + 7, B);
      g.oval(hx + 1, hy, hx + 6, hy + 6, E);
      g.row(hy + 3, hx + 1, hx + 6, vd(B)); // the split it will open along
      g.pts([[hx + 2, hy + 1], [hx + 5, hy + 1]], vd(B));
      g.path([[hx + 3, hy - 1], [hx + 2, hy - 3]], KIN);
      g.path([[hx + 5, hy - 1], [hx + 7, hy - 3]], KIN);
    }
  });

  /* ================= dog- to person-sized ================= */
  be('cottage-dough-thing', 'dough thing bread rising faces pale yeast lump blob monster', (g, r) => {
    const D = P.DOUGH,
      DD = hex('#a8966a');
    if (r) {
      g.ball(1, 6, 18, 14, D);
      g.limb([[10, 10], [8, 0], [10, -9]], 5.5, 4, D, DD); // risen
      g.ball(4, -15, 15, -4, D);
      for (const v of [g, g.flip(19)]) {
        v.limb([[5, -2], [0, -3], [-3, 2]], 2, 1, D, DD);
        v.pts([[-4, 4], [-3, 5], [-2, 4]], D);
      }
      g.maw(7, -9, 12, -2, { round: 1, teeth: false, col: vd(DD) });
      for (const x of [8, 10, 12]) g.col(x, -9, -2, x === 10 ? D : DD); // strings of dough across the mouth
      g.rect(6, -12, 7, -11, vd(DD));
      g.rect(12, -12, 13, -11, vd(DD));
      g.pts([[3, 2], [15, 4], [9, 7], [13, 10]], DD);
    } else {
      g.ball(1, 3, 18, 14, D);
      g.ball(4, 1, 12, 8, D); // something pushes up from inside: a face
      g.pts([[6, 4], [10, 4]], DD);
      g.pts([[6, 5], [10, 5]], vd(DD));
      g.row(7, 7, 9, DD);
      g.pts([[14, 8], [15, 6], [4, 11], [12, 12], [16, 11]], DD); // bubbles
      g.pts([[15, 7], [13, 11]], lite(D));
    }
    g.row(14, 2, 17, DD);
  });

  be('cottage-broom-walker', 'broom walker walking besom twigs handle splits jaws witch monster', (g, r) => {
    const H = C.woodLight,
      B = C.straw,
      BD = dark(C.straw);
    if (r) {
      g.path([[6, 22], [6, 10], [4, 2]], H); // the handle bends, and splits into a jaw
      g.path([[7, 22], [7, 10], [8, 4], [11, 0]], dark(H));
      g.path([[5, 9], [3, 3], [1, -1]], H);
      g.pts([[5, 5], [6, 4], [7, 6], [6, 7]], P.MAW);
      g.pts([[5, 3], [7, 3], [9, 2]], P.TOOTH);
      g.set(7, 12, P.YEL); // the knot is an eye
      for (const [s, v] of [[-1, g], [1, g.flip(13)]]) {
        v.path([[6, 15], [1, 12], [-3, 14]], dark(H)); // twig arms
        v.claws(-4, 14, -1, 0, H, 3, 2);
      }
      for (let i = 0; i < 7; i++) g.path([[4 + (i % 4) + (i > 3 ? 1 : 0), 22], [-2 + i * 2.6, 27], [-3 + i * 2.9, 32]], i % 2 ? B : BD); // bristles spread to walk on
    } else {
      g.col(6, 1, 22, H);
      g.col(7, 2, 22, dark(H));
      g.set(7, 12, vd(H)); // a knot
      g.poly([[4, 22], [9, 22], [10, 32], [2, 32]], B);
      for (const x of [3, 5, 8]) g.line(x + 1, 24, x, 32, BD);
      g.clearRect(6, 28, 6, 32); // two bunches, like feet
      g.clear(5, 32);
      g.clear(7, 32);
    }
    g.row(22, 4, 9, C.rust); // the binding
    g.row(23, 4, 9, dark(C.rust));
  });

  be('cottage-cat-many-tails', 'cat many tails black too many witch familiar jaw wide monster', (g, r) => {
    const F = BLACKFUR,
      F2 = hex('#3e3944');
    const tails = r ? [[2, 0], [-2, -4], [5, -6], [9, -5], [0, 5], [-3, 1], [12, -3]] : [[3, 2], [1, 6], [6, 1], [9, 3], [0, 10]];
    tails.forEach(([tx, ty], i) => g.limb([[9, 14], [(9 + tx) / 2 - 2, (14 + ty) / 2 + 2], [tx, ty]], 1.3, 0.7, i % 2 ? F : F2, F));
    if (r) {
      legs(g, [10, 12, 18, 20], 12, 18, 2, F2);
      g.ball(8, 5, 22, 13, F, F2); // arched
      g.pts([[10, 4], [13, 3], [16, 3], [19, 4]], F); // hackles
      g.ball(18, 2, 25, 9, F, F2);
      g.poly([[18, 3], [19, -1], [21, 2]], F);
      g.poly([[22, 2], [24, -1], [25, 3]], F);
      g.pts([[20, 4], [23, 4]], P.YEL);
      g.maw(19, 6, 24, 14, { len: 2 }); // a jaw that drops to its chest
      g.col(18, 7, 14, F);
      g.col(25, 7, 13, F);
      g.row(15, 19, 24, F);
    } else {
      g.ball(8, 7, 20, 18, F, F2); // sitting
      g.rect(16, 13, 18, 18, F2);
      g.row(18, 15, 20, F);
      g.ball(15, 2, 22, 9, F, F2);
      g.poly([[15, 3], [16, 0], [18, 2]], F);
      g.poly([[19, 2], [21, 0], [22, 3]], F);
      g.pts([[17, 5], [20, 5]], P.YEL);
      g.row(8, 17, 20, vd(F2)); // the mouth runs ear to ear
      g.pts([[16, 7], [21, 7]], vd(F2));
    }
  });

  be('cottage-churn-creature', 'butter churn creature barrel plunger legs teeth lid butter tongue monster', (g, r) => {
    const W = C.woodLight,
      BUT = hex('#d9c98a'),
      lift = r ? 7 : 0;
    g.rect(4, 25, 5, 28, P.PALE); // it has bare feet
    g.rect(10, 25, 11, 28, P.PALE);
    g.row(28, 3, 5, P.PALE);
    g.row(28, 10, 12, P.PALE);
    g.poly([[5, 9], [10, 9], [12, 25], [3, 25]], W); // the churn
    for (const x of [6, 8, 10]) g.line(x, 9, x + (x - 8) / 2, 25, dark(W));
    g.row(12, 4, 11, C.iron);
    g.row(22, 3, 12, C.iron);
    g.lit(3, 9, 6, 25);
    if (r) {
      g.rect(4, 2, 11, 9, P.MAW); // the lid lifts on what is inside
      g.teeth(2, 4, 11, P.TOOTH, 2, 2, 1);
      g.teeth(9, 5, 11, P.TOOTH, 2, 2, -1);
      g.limb([[8, 8], [12, 12], [14, 20]], 1.6, 1, BUT, hex('#a8965a')); // a tongue of butter
      g.pts([[3, 10], [3, 13], [4, 16]], BUT);
    }
    g.rect(3, 7 - lift, 12, 8 - lift, W); // the lid
    g.row(7 - lift, 3, 12, lite(W));
    g.col(7, -2 - lift + (r ? 4 : 0), 6 - lift, C.woodPale); // the plunger staff
    g.col(8, -2 - lift + (r ? 4 : 0), 6 - lift, dark(C.woodPale));
    if (r) g.pts([[5, 1], [10, 1]], P.YEL);
    else g.pts([[6, 15], [9, 15]], vd(W)); // two knots, level
  });

  be('cottage-changeling-cradle', 'changeling cradle baby fairy child old face long arms grey wrong infant', (g, r) => {
    const W = C.wood,
      SK = hex('#a3a890'),
      BL = hex('#8d866e');
    g.path([[2, 17], [5, 18], [16, 18], [19, 17]], C.woodDark); // rockers
    g.rect(3, 9, 18, 16, W);
    g.rect(3, 2, 8, 9, W); // the hood
    g.row(2, 4, 8, lite(W));
    g.rect(5, 4, 8, 8, vd(W));
    g.col(11, 10, 16, dark(W));
    g.col(15, 10, 16, dark(W));
    g.row(16, 3, 18, dark(W));
    g.lit(3, 2, 5, 16);
    if (r) {
      g.rect(9, 7, 17, 9, BL);
      g.tube([[9, 8], [10, 1], [11, -3]], 1.8, 1.4, SK); // it sits up, and it is long
      for (const y of [-1, 1, 3, 5]) g.row(y, 9, 11, dark(SK));
      g.ball(7, -12, 16, -3, SK); // an old head
      g.rect(8, -9, 10, -8, K);
      g.rect(13, -9, 15, -8, K);
      g.pts([[9, -8], [14, -8]], P.EYE);
      g.maw(9, -6, 14, -5, { step: 1, bot: false });
      g.pts([[8, -11], [11, -10], [14, -11], [8, -6], [15, -6]], dark(SK)); // wrinkles
      g.path([[9, 0], [3, 3], [1, 12]], SK);
      g.path([[9, 1], [4, 4], [2, 12]], dark(SK));
      g.claws(1, 13, 0, 1, SK, 3, 4);
      g.path([[12, 0], [19, 4], [20, 13]], SK);
      g.path([[12, 1], [18, 4], [19, 13]], dark(SK));
      g.claws(20, 14, 0, 1, SK, 3, 3);
    } else {
      g.rect(9, 7, 17, 9, BL); // the blanket
      g.row(7, 9, 17, lite(BL));
      g.ball(5, 4, 10, 9, SK); // the head on the pillow
      g.pts([[6, 6], [9, 6]], K);
      g.pts([[7, 6]], K);
      g.path([[12, 7], [13, 9], [13, 12]], SK); // fingers over the side, too long
      g.path([[14, 7], [15, 9], [15, 13]], SK);
      g.path([[16, 7], [17, 9], [17, 11]], SK);
    }
  });

  be('cottage-spinner-hag', 'spinner hag spinning wheel old woman thread hair fused witch crone', (g, r) => {
    const W = C.wood,
      HAIR = hex('#c9c6ba'),
      SH = hex('#2c2a34'),
      SK = hex('#a89c88');
    g.line(4, 20, 2, 28, W); // the stand
    g.line(12, 20, 14, 28, W);
    g.line(21, 22, 22, 28, C.woodDark);
    g.rect(2, 20, 16, 21, W);
    for (let a = 0; a < 8; a++) g.line(8, 12, 8 + Math.cos((a * Math.PI) / 4 + (r ? 0.3 : 0)) * 6.5, 12 + Math.sin((a * Math.PI) / 4 + (r ? 0.3 : 0)) * 6.5, C.woodDark);
    for (let a = 0; a < 64; a++) {
      const t = (a / 64) * Math.PI * 2;
      g.set(8 + Math.cos(t) * 7.6, 12 + Math.sin(t) * 7.6, a % 8 < 5 ? W : HAIR); // her hair wound on the wheel
      g.set(8 + Math.cos(t) * 6.8, 12 + Math.sin(t) * 6.8, dark(W));
      if (r && a % 4 === 0) g.set(8 + Math.cos(t) * 5.6, 12 + Math.sin(t) * 5.6, P.TOOTH);
    }
    g.rect(7, 11, 9, 13, W);
    if (r) g.eye(6, 10, 5, P.EYE, K);
    g.poly([[18, 11], [24, 11], [27, 28], [15, 28]], SH); // the hag behind it
    g.lit(15, 11, 20, 28);
    g.ball(17, 3, 24, 11, SK);
    g.rect(17, 2, 24, 4, HAIR);
    g.col(24, 4, 13, HAIR);
    g.path([[17, 4], [13, 3], [9, 5]], HAIR); // the thread is her hair
    g.set(20, 8, dark(SK));
    if (r) {
      g.pts([[19, 6], [22, 6]], P.EYE);
      g.maw(19, 8, 22, 12, { len: 1 });
      g.path([[1, 9], [-4, 5], [-7, 8], [-10, 4]], HAIR); // threads lash out
      g.path([[2, 16], [-3, 19], [-8, 17]], HAIR);
      g.path([[3, 6], [-1, 0], [-5, -1]], HAIR);
      arm(g, [[24, 13], [28, 9], [29, 3]], SH, SK, SK, 1.1);
      g.path([[18, 13], [14, 14], [11, 12]], SH);
      g.claws(10, 12, -1, 0, SK, 3, 3);
    } else {
      g.pts([[19, 6], [22, 6]], K);
      g.row(9, 20, 21, vd(SK));
      g.path([[18, 13], [14, 15], [11, 13]], SH);
      g.rect(10, 12, 11, 13, SK);
      g.rect(23, 17, 25, 18, SK); // the other hand in her lap
    }
  });

  be('cottage-rocking-crone', 'rocking chair crone old woman fused chair legs spider shawl grandmother', (g, r) => {
    const W = C.woodDark,
      SH = hex('#4a3f52'),
      SK = hex('#b3a48c'),
      BL = hex('#7a6a4e'),
      HAIR = hex('#c9c6ba'),
      v = g.at(0, r ? -8 : 0);
    if (r) {
      for (const [s, u] of [[-1, g], [1, g.flip(19)]]) {
        u.leg([[4, 17], [-2, 13], [-5, 31]], W, 2, -1); // the chair gets up on its legs
        u.leg([[6, 18], [2, 22], [1, 31]], C.wood, 2, -1);
      }
    } else {
      g.col(4, 25, 30, W);
      g.col(15, 25, 30, W);
      g.path([[0, 29], [2, 31], [17, 31], [19, 29]], W); // rockers
    }
    v.rect(4, 2, 15, 20, C.wood); // the chair back
    for (const x of [6, 9, 12]) v.col(x, 3, 20, W);
    v.rect(3, 1, 16, 2, W);
    v.poly([[4, 14], [15, 14], [17, 23], [2, 23]], SH); // the shawl
    v.rect(3, 22, 16, 27, BL); // the blanket on her lap
    for (let x = 3; x <= 16; x += 3) v.col(x, 22, 27, dark(BL));
    v.row(24, 3, 16, dark(BL));
    if (r) v.hem(27, 3, 16, 3, 2);
    v.rect(1, 19, 3, 20, W); // the arm rests
    v.rect(16, 19, 18, 20, W);
    v.ball(6, 5, 13, 14, SK);
    v.rect(6, 4, 13, 6, HAIR);
    v.rect(9, 2, 10, 3, HAIR);
    v.set(9, 10, dark(SK));
    if (r) {
      v.rect(7, 8, 8, 9, K);
      v.rect(11, 8, 12, 9, K);
      v.pts([[8, 9], [12, 9]], P.EYE);
      v.maw(8, 11, 11, 18, { len: 1 }); // the jaw drops to her lap
      v.col(7, 12, 18, SK);
      v.col(12, 12, 18, dark(SK));
      for (const u of [v, v.flip(19)]) {
        u.path([[3, 16], [-3, 13], [-7, 20]], SH);
        u.path([[3, 17], [-3, 14], [-6, 20]], dark(SH));
        u.claws(-7, 21, 0, 1, SK, 3, 4);
      }
    } else {
      v.row(8, 7, 8, vd(SK)); // asleep
      v.row(8, 11, 12, vd(SK));
      v.row(12, 9, 10, vd(SK));
      v.rect(1, 18, 3, 18, SK); // hands grown into the wood
      v.rect(16, 18, 18, 18, SK);
      v.pts([[1, 19], [3, 19], [16, 19], [18, 19]], SK);
    }
  });

  be('cottage-cauldron-thing', 'cauldron thing pot stew boiled arms eyes hand broth black iron', (g, r) => {
    const I = C.ironDark,
      BR = hex('#6f7a4a'),
      SC = P.RAW;
    for (const x of [3, 9, 15]) g.rect(x, 19, x + 1, 21, I);
    g.ball(1, 5, 18, 20, I, C.iron, vd(I));
    g.oval(1, 2, 18, 8, C.iron);
    g.oval(3, 3, 16, 7, BR);
    g.pts([[5, 5], [12, 4], [14, 6]], lite(BR));
    if (r) {
      arm(g, [[5, 4], [2, -3], [0, -9]], SC, SC, SC, 1.2); // what was being boiled
      arm(g, [[15, 5], [19, 0], [22, -5]], dark(SC), SC, SC, 1.2);
      arm(g, [[12, 3], [14, -6], [12, -13]], SC, SC, SC, 1.2);
      g.ball(5, -4, 11, 4, SC);
      g.rect(6, -2, 7, -1, K);
      g.rect(9, -2, 10, -1, K);
      g.maw(7, 1, 9, 3, { teeth: false });
      g.col(3, 8, 14, BR); // it slops over
      g.col(4, 8, 11, BR);
      g.col(14, 8, 12, BR);
      g.pts([[8, -7], [16, -10], [3, -13]], C.ghost);
    } else {
      g.eye(7, 4, 2, P.EYE);
      g.eye(11, 5, 2, P.EYE);
      for (const x of [4, 6, 8]) g.col(x, 7, 10, SC); // fingers over the rim
      g.row(7, 4, 8, lite(SC));
    }
  });

  be('cottage-apron-ghost', 'apron ghost empty dress bonnet floating housewife no body hands faceless', (g, r) => {
    const D = hex('#4f5260'),
      AP = hex('#c4bfae'),
      V = P.MAW,
      F = hex('#34303c');
    g.poly([[5, 10], [10, 10], [13, 26], [2, 26]], D);
    g.lit(2, 10, 6, 26);
    g.hem(26, 2, 13, 3, 4);
    g.poly([[6, 12], [9, 12], [11, 23], [4, 23]], AP);
    g.rect(6, 10, 9, 12, AP);
    g.row(13, 5, 10, dark(AP));
    if (r) {
      for (const v of [g, g.flip(15)]) {
        v.poly([[4, 10], [5, 12], [-1, 15], [-2, 12]], D); // the sleeves fill
        v.path([[-2, 13], [-5, 10], [-5, 6]], F);
        v.claws(-5, 5, 0, -1, F, 3, 4);
      }
    } else {
      for (const v of [g, g.flip(15)]) {
        v.poly([[4, 10], [5, 10], [3, 19], [1, 19]], D); // empty sleeves
        v.row(19, 1, 3, V);
      }
    }
    g.ball(3, 0, 12, 10, BONNET);
    g.oval(5, 2, 10, 8, V); // nobody in the bonnet
    g.pts([[6, 10], [9, 10]], dark(BONNET));
    if (r) {
      g.pts([[6, 4], [9, 4]], P.EYE);
      g.row(6, 6, 9, P.TOOTH);
      g.set(7, 7, P.TOOTH);
    }
  }, { pad: 3 });

  be('cottage-goodwife-backwards', 'goodwife backwards woman head turned wrong way hair face behind housewife', (g, r) => {
    const HAIR = hex('#5a4630'),
      DR = hex('#5d5348');
    fig(g, { top: DR, robe: DR, head: false, skin: P.PALE, arms: r ? [[[2, 13], [-1, 17], [-3, 11]], [[2, 13], [-2, 16], [-4, 9]]] : ['down', 'down'], claws: r ? P.PALE : null });
    g.path([[5, 16], [8, 18], [10, 16]], LINEN); // apron strings tied in front: this is her back
    g.pts([[7, 19], [9, 19], [7, 20], [9, 21]], LINEN);
    g.row(21, 5, 10, LINEN);
    g.ball(4, 2, 11, 11, HAIR, lite(HAIR)); // the back of her head, facing us
    g.rect(7, 0, 8, 2, HAIR);
    g.set(7, 0, lite(HAIR));
    g.rect(7, 12, 8, 12, P.PALE);
    if (r) {
      g.rect(6, 4, 9, 10, P.PALE); // the hair parts on a face
      g.pts([[6, 5], [9, 6]], K);
      g.maw(7, 7, 8, 10, { teeth: false });
      g.pts([[7, 7], [8, 10]], P.TOOTH);
      g.pts([[5, 4], [10, 5], [5, 9], [10, 10]], HAIR);
    } else {
      g.line(8, 3, 7, 10, dark(HAIR));
      g.line(5, 5, 6, 10, dark(HAIR));
    }
    g.rect(4, 30, 6, 31, C.black); // and the shoes point at us
    g.rect(9, 30, 11, 31, C.black);
  });

  be('cottage-washtub-hands', 'washtub hands laundry tub many arms suds soap pale reaching', (g, r) => {
    const W = C.woodLight,
      SUD = hex('#d5d8d0'),
      SK = P.PALE;
    if (r) {
      [[[4, 6], [1, -2], [-2, -8]], [[7, 6], [6, -4], [4, -12]], [[11, 5], [11, -5], [9, -15]], [[14, 6], [16, -3], [19, -10]], [[17, 6], [21, 0], [24, -5]]].forEach((p, i) => {
        arm(g, p, i % 2 ? dark(SK) : SK, SK, SK, 1.1);
      });
    }
    g.poly([[1, 8], [20, 8], [18, 17], [3, 17]], W);
    for (const x of [5, 9, 13, 17]) g.line(x, 8, x + (x - 11) / -6, 17, dark(W));
    g.row(10, 1, 20, C.iron);
    g.row(15, 2, 19, C.iron);
    g.lit(1, 8, 4, 17);
    g.ball(2, 5, 8, 9, SUD); // suds
    g.ball(7, 4, 14, 9, SUD);
    g.ball(13, 5, 19, 9, SUD);
    if (r) {
      g.pts([[8, 6], [12, 6]], vd(SUD)); // a face in the suds
      g.row(8, 9, 11, vd(SUD));
      g.pts([[3, 2], [16, 1], [20, 4]], SUD);
    } else {
      for (const x of [3, 9, 15]) {
        g.rect(x, 7, x + 2, 8, SK); // hands on the rim, from inside
        g.pts([[x, 9], [x + 1, 10], [x + 2, 9], [x, 10], [x + 2, 10]], SK);
      }
    }
  });

  be('cottage-cupboard-child', 'cupboard child folded thin boy girl long limbs unfolds joints pale hiding', (g, r) => {
    const SK = hex('#b9b09a'),
      SM = hex('#6a6a5c'),
      HAIR = hex('#3a3028');
    if (r) {
      g.leg([[5, 14], [2, 20], [6, 26], [4, 33]], SK, 2, -1); // unfolded: a knee too many
      g.leg([[8, 14], [11, 20], [8, 26], [10, 33]], SK, 2, 1);
      g.poly([[4, 2], [9, 2], [11, 15], [3, 15]], SM);
      g.lit(3, 2, 6, 15);
      g.tube([[7, 2], [8, -3]], 1, 1, SK);
      g.ball(5, -11, 12, -3, SK);
      g.rect(5, -12, 12, -10, HAIR);
      g.col(5, -10, -7, HAIR);
      g.rect(6, -8, 7, -7, K);
      g.rect(10, -8, 11, -7, K);
      g.rect(8, -5, 9, -4, K);
      g.leg([[4, 3], [-1, 8], [3, 14], [-2, 22]], SK, 1);
      g.claws(-2, 23, 0, 1, SK, 3, 3);
      g.leg([[10, 3], [15, 7], [12, 14], [16, 21]], dark(SK), 1);
      g.claws(16, 22, 0, 1, SK, 3, 3);
    } else {
      g.ball(2, 5, 11, 15, SM); // folded up small
      g.rect(1, 4, 3, 14, SK); // shins, knees up by the ears
      g.rect(10, 4, 12, 14, dark(SK));
      g.rect(0, 14, 3, 15, SK);
      g.rect(10, 14, 13, 15, SK);
      g.ball(3, -2, 10, 7, SK); // the head on the knees
      g.rect(3, -3, 10, -1, HAIR);
      g.col(3, -1, 2, HAIR);
      g.rect(4, 2, 5, 3, K);
      g.rect(8, 2, 9, 3, K);
      g.row(5, 6, 7, vd(SK));
      g.row(10, 2, 11, SK); // arms round the lot
      g.row(11, 4, 9, dark(SK));
      g.pts([[1, 9], [12, 9]], SK);
    }
  });

  be('cottage-candle-weeper', 'candle weeper tallow wax melting figure face flame drips', (g, r) => {
    const WX = P.WAX,
      WD = hex('#a89c78');
    g.oval(0, 20, 11, 23, WX); // the pool it stands in
    g.row(23, 2, 9, WD);
    g.rect(3, 8, 8, 21, WX);
    g.ball(1, 10, 10, 16, WX);
    g.ball(2, 2, 9, 10, WX);
    g.col(5, 0, 1, K);
    g.fire(4, r ? -9 : -4, 7, 0);
    g.rect(3, 5, 4, 6, vd(WD));
    g.rect(7, 5, 8, 6, vd(WD));
    g.col(3, 7, 11, WD); // it weeps wax
    g.col(8, 7, 13, WD);
    g.col(2, 13, 18, WD);
    g.col(9, 15, 19, WD);
    g.pts([[5, 14], [6, 17], [4, 19]], WD);
    if (r) {
      g.maw(4, 7, 7, 12, { round: 1, teeth: false, col: vd(WD) });
      g.limb([[2, 12], [-2, 10], [-4, 3]], 1.5, 1, WX, WD);
      g.claws(-4, 1, 0, -1, WX, 3, 2);
      g.col(-3, 6, 9, WX);
      g.set(-3, 11, WX);
      g.col(-1, 12, 14, WX);
    } else g.row(8, 5, 6, vd(WD));
  });

  /* ================= vermin and small things ================= */
  be('cottage-hearth-imp', 'hearth imp small ember cinder soot demon fire horns grin', (g, r) => {
    const S = P.SOOT,
      S2 = hex('#4a403c'),
      S3 = hex('#62544e');
    g.path([[10, 10], [12, 11], [13, 8]], S2);
    g.col(4, 11, 13, S2);
    g.col(8, 11, 13, S2);
    g.row(13, 3, 4, S2);
    g.row(13, 8, 9, S2);
    g.ball(2, 5, 10, 11, S2, S3, S);
    g.ball(1, -1, 11, 7, S2, S3, S);
    g.pts([[2, -2], [1, -3], [10, -2], [11, -3]], S3); // horns
    g.pts([[4, 8], [5, 9], [7, 8], [6, 10], [3, 6]], C.flame); // it glows in the cracks
    g.pts([[4, 2], [8, 2]], r ? C.flameLight : C.flame);
    if (r) {
      g.maw(3, 4, 9, 6, { col: C.flame, teeth: C.flameLight });
      g.fire(3, -9, 9, -1);
      for (const v of [g, g.flip(12)]) {
        v.path([[2, 7], [-1, 5], [-2, 1]], S2);
        v.fire(-4, -4, -1, 1);
      }
    } else {
      g.row(5, 4, 8, C.flame);
      g.pts([[3, 4], [9, 4]], C.flame);
      for (const v of [g, g.flip(12)]) v.path([[2, 7], [0, 9], [1, 11]], S2);
    }
  });

  be('cottage-kettle-face', 'kettle face small black iron boiling steam legs spout scream', (g, r) => {
    const I = C.ironDark,
      I2 = C.iron;
    if (r) {
      g.path([[3, 10], [1, 13], [2, 16]], I2); // it stands up
      g.path([[7, 11], [7, 16]], I2);
      g.path([[10, 10], [12, 13], [11, 16]], I2);
    }
    g.path([[2, 3], [1, -2], [6, -4], [11, -2], [10, 3]], I2); // the handle
    g.ball(1, 3, 11, 11, I, I2, vd(I));
    g.path([[11, 8], [13, 6], [14, 3]], I2); // the spout
    g.path([[11, 7], [13, 5]], I);
    if (r) {
      g.rect(3, 0, 9, 1, I2); // the lid lifts
      g.set(6, -1, I2);
      g.maw(3, 2, 9, 4, { len: 1 });
      g.eye(3, 5, 2, P.YEL);
      g.eye(8, 5, 2, P.YEL);
      g.maw(4, 8, 8, 9, { teeth: false, col: C.flame });
      g.pts([[15, 1], [16, -1], [15, -3], [17, -2], [2, 1], [10, 0]], C.ghost); // steam
    } else {
      g.rect(3, 2, 9, 3, I2);
      g.set(6, 1, I2);
      g.pts([[4, 6], [8, 6]], C.steel); // two rivets
      g.row(9, 4, 8, vd(I));
      g.set(3, 8, vd(I));
      g.set(9, 8, vd(I));
    }
  });

  be('cottage-loaf-teeth', 'loaf teeth bread small crust mouth eye biting vermin', (g, r) => {
    const CR = hex('#9a6a3a'),
      CL = hex('#c49a5a');
    g.ball(0, r ? -1 : 2, 11, 8, CR, CL);
    g.pts([[3, r ? 0 : 3], [6, r ? -1 : 2], [8, r ? 0 : 3]], hex('#d8cfb4')); // flour
    g.row(8, 1, 10, dark(CR));
    if (r) {
      g.maw(1, 3, 10, 6, { len: 1, tongue: P.GUM });
      g.eye(7, 0, 2, P.YEL);
      g.pts([[-2, 8], [13, 7], [12, 8]], CL); // crumbs
    } else {
      g.line(2, 5, 9, 4, vd(CR)); // the baker's cut
      g.set(5, 3, vd(CR));
    }
  });

  be('cottage-hen-eyes', 'hen eyes black chicken covered in eyes small bird teeth beak vermin', (g, r) => {
    const F = BLACKFUR,
      F2 = hex('#45404c');
    g.col(5, 10, 12, C.mustard);
    g.col(8, 10, 12, C.mustard);
    g.row(12, 4, 6, C.mustard);
    g.row(12, 8, 10, C.mustard);
    g.poly([[1, 5], [-2, 1], [3, 3]], F);
    g.ball(1, 3, 11, 10, F, F2);
    g.ball(9, -1, 13, 4, F, F2);
    g.pts([[10, -2], [12, -2], [11, -3]], C.blood);
    g.set(12, 1, P.YEL);
    if (r) {
      g.poly([[3, 4], [-2, -5], [1, -5], [7, 2]], F2); // the wing lifts: more eyes
      g.poly([[5, 4], [3, -6], [6, -5], [8, 3]], F);
      g.pts([[14, 1], [15, 0], [14, 3], [15, 4]], C.mustard);
      g.set(14, 2, P.TOOTH);
      g.eye(2, 5, 2, P.EYE);
      g.eye(5, 7, 2, P.EYE);
      g.eye(7, 4, 2, P.EYE);
      g.pts([[0, -3], [4, -3], [2, 0], [5, 0]], P.EYE);
    } else {
      g.pts([[14, 2], [15, 2]], C.mustard);
      g.row(6, 3, 4, F2); // lids, shut
      g.row(8, 6, 7, F2);
      g.row(5, 7, 8, F2);
      g.set(3, 5, P.EYE); // one of them open
    }
  });

  be('cottage-mouse-knot', 'mouse knot rat king mice tails tied small vermin swarm', (g, r) => {
    const pal = { m: hex('#6e6660'), d: hex('#544c48'), e: hex('#8a7a74'), n: P.RAW, k: r ? P.RED : K, t: P.TOOTH };
    const mouse = r ? ['..e.e.', '.mmmkn', 'mmmmmt', 'mddm..', '.m..m.'] : ['..e...', '.mmmk.', 'mmmmmn', '.d..d.'];
    const at = [[15, 0, 0], [16, 7, 0], [-3, 1, 1], [-4, 8, 1], [7, 11, 0]];
    at.forEach(([x, y, f], i) => (f ? g.flip(2 * x + 5) : g).path([[x, y + 2], [(x + 9) / 2, y + 3 + (i % 2)], [f ? 2 * x - 4 : 9, 6]], P.RAW)); // every tail goes to the knot
    at.forEach(([x, y, f]) => (f ? g.flip(2 * x + 5) : g).pat(x, y - (r ? 1 : 0), mouse, pal));
    g.oval(7, 4, 11, 7, P.RAW);
    g.pts([[8, 5], [10, 6], [9, 4]], P.GUM);
  });

  be('cottage-spoon-crab', 'spoon crab wooden bowl cutlery legs knife fork small vermin kitchen', (g, r) => {
    const W = C.woodLight,
      SP = C.woodPale,
      ST = C.steel,
      up = r ? -3 : 2;
    if (r)
      for (let i = 0; i < 3; i++)
        for (const s of [-1, 1]) {
          g.path([[7 + s * 3, 6 + up], [7 + s * (6 + i * 1.5), 4 + up + i], [7 + s * (7 + i * 2), 9]], i % 2 ? dark(SP) : SP);
          g.set(7 + s * (8 + i * 2), 9, SP);
        }
    else
      for (const s of [-1, 1]) {
        g.row(9, 7 + s * 6, 7 + s * 9, SP); // spoons stick out from under it
        g.rect(Math.min(7 + s * 9, 7 + s * 10), 8, Math.max(7 + s * 9, 7 + s * 10), 9, SP);
        g.row(8, 7 + s * 6, 7 + s * 7, dark(SP));
      }
    g.poly([[4, 2 + up], [10, 2 + up], [12, 6 + up], [2, 6 + up]], W); // a bowl, upside down
    g.row(2 + up, 5, 9, lite(W));
    g.row(6 + up, 2, 12, dark(W));
    g.row(7 + up, 2, 12, r ? P.MAW : W);
    if (r) {
      g.rect(3, 7 + up, 11, 8 + up, P.MAW);
      g.pts([[5, 7 + up], [9, 7 + up]], P.YEL);
      g.path([[2, 5 + up], [-2, 0 + up], [-2, -4 + up]], ST); // a fork
      g.pts([[-3, -5 + up], [-1, -5 + up], [-3, -6 + up], [-1, -6 + up], [-2, -5 + up]], ST);
      g.path([[12, 5 + up], [16, 1 + up], [17, -6 + up]], ST); // a knife
      g.col(16, -5 + up, -1 + up, lite(ST));
    } else g.pts([[5, 8], [9, 8]], K);
  });

  be('cottage-pail-eel', 'pail eel milk bucket pale thing lamprey baby face small vermin', (g, r) => {
    const W = C.woodPale,
      MILK = hex('#dcd8c8'),
      E = hex('#c9b8ac');
    if (!r) g.path([[1, 5], [2, 1], [9, 1], [10, 5]], C.iron);
    g.poly([[1, 5], [10, 5], [9, 13], [2, 13]], W);
    for (const x of [4, 7]) g.col(x, 6, 13, dark(W));
    g.row(7, 1, 10, C.iron);
    g.row(11, 2, 9, C.iron);
    g.row(5, 2, 9, MILK);
    if (r) {
      g.limb([[6, 5], [4, -2], [7, -8], [5, -12]], 1.7, 1.5, E);
      g.ball(2, -18, 9, -10, E);
      g.maw(4, -16, 7, -12, { round: 1, len: 1, col: P.GUM });
      g.pts([[2, -14], [9, -14]], K);
      g.col(1, 6, 10, MILK); // the milk goes over
      g.col(10, 6, 8, MILK);
      g.pts([[0, 13], [-1, 13], [11, 13]], MILK);
    } else {
      g.limb([[3, 5], [5, 2], [8, 5]], 1.2, 1.2, E); // a pale back turns over in the milk
    }
  });

  be('cottage-wool-crawler', 'wool crawler yarn ball knitting needles legs thread small vermin', (g, r) => {
    const Y = hex('#6f7f8f'),
      YD = hex('#4f5d6c'),
      N = C.bone,
      up = r ? -3 : 0;
    if (r) for (let i = 0; i < 3; i++) for (const s of [-1, 1]) g.path([[6 + s * 3, 6 + up], [6 + s * (6 + i), 3 + i], [6 + s * (7 + i * 1.5), 9]], YD);
    g.ball(1, 1 + up, 11, 9 + up, Y, lite(Y), YD);
    g.line(2, 3 + up, 10, 7 + up, YD);
    g.line(3, 8 + up, 9, 2 + up, YD);
    g.line(1, 5 + up, 11, 5 + up, lite(Y));
    if (r) {
      g.line(3, 1 + up, -2, -6 + up, N); // the needles come out
      g.line(9, 1 + up, 14, -6 + up, N);
      g.maw(4, 5 + up, 8, 7 + up, {});
      g.pts([[4, 3 + up], [8, 3 + up]], P.YEL);
    } else {
      g.line(-2, 8, 13, 0, N);
      g.line(0, 0, 12, 9, dark(N));
      g.pts([[13, 0], [0, 0]], C.wine);
      g.path([[11, 8], [14, 9], [16, 8]], Y);
      g.pts([[5, 4], [7, 4]], K);
    }
  });

  be('cottage-herb-bat', 'herb bat dried bundle hanging leaves wings upside down small vermin', (g, r) => {
    const L = hex('#6a7048'),
      LD = hex('#4a5034');
    g.col(6, 0, 3, C.straw);
    if (r) {
      for (const v of [g, g.flip(12)]) {
        v.poly([[5, 5], [-5, 2], [-7, 8], [-2, 8], [2, 12]], L); // the leaves are wings
        v.line(5, 5, -5, 2, LD);
        v.line(5, 6, -2, 8, LD);
        v.clear(-4, 8);
        v.clear(0, 10);
      }
      g.ball(4, 4, 8, 12, LD);
      g.ball(3, 10, 9, 15, LD);
      g.pts([[3, 16], [9, 16]], LD); // it hangs head down
      g.pts([[5, 13], [7, 13]], P.RED);
      g.pts([[5, 11], [7, 11]], P.TOOTH);
    } else {
      g.ball(2, 3, 10, 14, L, lite(L), LD);
      g.line(4, 4, 3, 13, LD);
      g.line(8, 4, 9, 13, LD);
      g.line(6, 4, 6, 14, LD);
      g.hem(14, 2, 10, 2, 3);
      g.pts([[5, 12], [7, 12]], P.EYE);
    }
    g.row(4, 4, 8, C.straw);
  }, { pad: 5 });

  be('cottage-bellows-lung', 'bellows lung breathing leather flesh valve mouth hearth small vermin', (g, r) => {
    const W = C.wood,
      LU = P.RAW,
      b = r ? 2 : 0;
    g.ball(1 - b, 3, 12 + b, 14, LU, lite(LU), P.GUM); // what should be leather, between the boards
    if (r) {
      g.path([[-1, 6], [1, 9], [0, 12]], hex('#6a4468')); // veins
      g.path([[14, 7], [12, 10], [13, 12]], hex('#6a4468'));
    }
    g.ball(2, 3, 11, 14, W, C.woodLight); // the board
    g.poly([[5, 13], [8, 13], [7, 18], [6, 18]], W);
    g.rect(6, 17, 7, 19, C.iron); // the nozzle it stands on
    for (const v of [g, g.flip(13)]) {
      if (r) v.path([[4, 3], [1, 0], [-1, -3]], W); // the handles lift like arms
      else v.path([[4, 3], [3, 0], [3, -1]], W);
    }
    g.pts([[3, 6], [10, 6], [3, 11], [10, 11], [6, 4]], C.brass);
    if (r) {
      g.maw(4, 6, 9, 11, { round: 1, len: 1, col: P.GUM }); // the valve opens
      g.pts([[5, 5], [8, 5]], P.YEL);
      g.pts([[6, 21], [4, 22], [9, 21]], C.ghost);
    } else {
      g.oval(5, 7, 8, 10, vd(W));
      g.set(6, 8, LU);
    }
  });
  /* MORE */
};
