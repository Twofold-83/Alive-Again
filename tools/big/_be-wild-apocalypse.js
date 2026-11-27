/* Creatures of the apocalypse: what is left after the end. fn(g, r): r = 1 is the creature roused. */
module.exports = ({ mk, C, K, hex, mix, blend, dark, lite, rnd, P, vd, canvas, surface }) => {
  const B = C.bone,
    HAZ = hex('#b09a3c'),
    SK = hex('#b89a84'),
    TU = hex('#a8707a'),
    TU2 = hex('#8a5a6e'),
    TU3 = hex('#b8868a'),
    RUB = hex('#2a2c2e'),
    GL = P.glowG,
    N = hex('#1f1c26');

  /* ================= large and tall ================= */
  mk('fused-family', 'radiation fused family large tall three people melted together heads arms mutant mass', (g, r) => {
    const S = SK,
      fo = r ? { eyes: 'hollow', eye: GL, mouth: 'scream' } : { eyes: 'shut', mouth: 'line' };
    for (const [x, c] of [[7, hex('#3a4460')], [12, hex('#3a4460')], [18, hex('#6b3040')], [23, hex('#6b3040')]]) {
      g.rect(x, 34, x + 2, 44, c);
      g.rect(x - (x < 15 ? 1 : 0), 43, x + 2 + (x < 15 ? 0 : 1), 44, P.night);
    }
    g.rect(15, 34, 16, 39, S); // a small leg that does not reach the floor
    g.rect(15, 40, 17, 41, C.rust);
    g.limb([[15, 13], [15, 5]], 2, S); // an arm out of the back
    g.hand(15, 4, 0, -1, S, 3, 2);
    g.ball(5, 13, 26, 36, S);
    g.rect(6, 18, 11, 30, hex('#3a4460')); // what is left of their clothes
    g.pts([[8, 20], [10, 25], [7, 28], [11, 19], [11, 22], [11, 29], [6, 30]], S);
    g.rect(20, 19, 25, 33, hex('#6b3040'));
    g.pts([[20, 21], [22, 26], [20, 30], [24, 23], [20, 33], [25, 19]], S);
    g.rect(13, 22, 17, 27, C.mustard);
    g.pts([[13, 27], [17, 22], [15, 25]], S);
    g.rect(8, 11, 11, 13, S);
    g.face(6, 2, 8, 9, S, fo); // father
    g.row(2, 7, 12, hex('#3a3028'));
    g.pts([[6, 3], [13, 3]], hex('#3a3028'));
    g.rect(19, 13, 21, 14, S);
    g.face(17, 5, 7, 8, lite(S), fo); // mother
    g.row(4, 18, 22, hex('#5a4a3a'));
    g.col(16, 5, 14, hex('#5a4a3a'));
    g.col(24, 5, 16, hex('#5a4a3a'));
    g.face(12, 14, 6, 7, S, fo); // the child, in the chest
    if (!r) {
      g.rect(3, 16, 5, 30, S);
      g.rect(3, 31, 5, 32, dark(S));
      g.rect(26, 17, 28, 31, S);
      g.rect(26, 32, 28, 33, dark(S));
      g.rect(13, 29, 14, 33, S);
    } else {
      g.limb([[4, 17], [0, 20], [-2, 14]], 3, S);
      g.hand(-1, 12, 0, -1, S, 3, 2);
      g.limb([[26, 18], [30, 21], [32, 15]], 3, S);
      g.hand(33, 13, 0, -1, S, 3, 2);
      g.rect(12, 29, 15, 32, S);
      g.pts([[12, 33], [14, 33], [15, 34]], S);
    }
    g.pts([[9, 33], [17, 31], [22, 16], [7, 15]], r ? GL : P.sick); // sores
  });

  mk('tumour-giant', 'tumour giant large tall lumpy mutant huge arm growths swollen brute', (g, r) => {
    const S = SK;
    g.rect(9, 35, 14, 46, C.slate); // what is left of trousers
    g.rect(17, 35, 22, 46, C.slate);
    g.rect(9, 42, 14, 46, S);
    g.rect(17, 43, 22, 46, S);
    g.pts([[10, 41], [13, 41], [18, 42], [21, 42]], S);
    g.row(46, 8, 14, dark(S));
    g.row(46, 17, 23, dark(S));
    g.ball(6, 14, 25, 38, TU);
    g.ball(18, 20, 28, 30, TU2); // growths
    g.ball(17, 7, 27, 18, TU3);
    g.ball(3, 9, 12, 19, TU2);
    g.ball(9, 26, 17, 34, TU3);
    g.face(12, 8, 6, 7, S, r ? { eyes: 'wide', mouth: 'open' } : { eyes: 'dot', mouth: 'line' }); // a small head sunk between them
    g.path([[8, 22], [10, 25], [9, 29]], dark(TU2));
    g.path([[21, 31], [19, 34], [20, 36]], dark(TU2));
    g.line(26, 22, 28, 28, S); // the withered arm
    g.pts([[27, 29], [29, 29], [28, 30]], S);
    if (!r) {
      g.tube([[5, 17], [1, 30], [3, 41]], 3, 3.6, TU); // the great arm drags on the floor
      g.ball(-2, 38, 7, 46, TU3);
      g.pts([[0, 45], [2, 46], [4, 46]], dark(TU3));
      g.row(12, 20, 24, dark(TU3));
      g.row(30, 11, 15, dark(TU3));
    } else {
      g.tube([[5, 16], [0, 8], [3, -1]], 3, 3.6, TU);
      g.ball(-2, -9, 8, 0, TU3);
      g.pts([[0, -3], [3, -2], [6, -3]], dark(TU3));
      g.maw(10, 28, 16, 32); // a growth opens its mouth, another its eye
      g.oval(20, 10, 25, 15, K);
      g.oval(21, 11, 24, 14, P.eye);
      g.rect(22, 12, 23, 13, K);
    }
  });

  mk('bunker-dweller', 'bunker dweller gone blind and long large tall pale stretched eyeless thin man shelter mutant', (g, r) => {
    const S = hex('#cfc8bc'),
      D = dark(S),
      Su = hex('#55584e');
    g.row(46, 8, 12, S);
    g.row(46, 4, 8, D);
    if (!r) {
      g.limb([[5, 44], [7, 38], [6, 31]], 2, dark(Su)); // stooped, the hands on the floor
      g.limb([[8, 44], [11, 38], [7, 31]], 2, Su);
      g.limb([[10, 17], [10, 30], [9, 44]], 1, D);
      g.tube([[7, 30], [7, 22], [9, 16], [13, 12]], 2.6, 2, Su);
      g.pts([[4, 27], [4, 23], [5, 19], [7, 15]], S); // the spine through the cloth
      g.rect(7, 24, 8, 25, C.cream);
      g.tube([[13, 12], [16, 12]], 1.4, 1.4, S);
      g.ball(15, 8, 21, 15, S);
      g.pts([[15, 9], [14, 10], [14, 11], [15, 12]], S);
      g.row(11, 18, 20, D);
      g.row(14, 19, 21, K);
      g.limb([[11, 16], [13, 30], [12, 43]], 2, S);
      g.pts([[11, 45], [13, 45], [14, 46], [10, 46], [12, 46], [15, 45]], S);
    } else {
      g.limb([[5, 44], [6, 32], [7, 18]], 2, dark(Su)); // it unfolds
      g.limb([[8, 44], [9, 32], [8, 18]], 2, Su);
      g.tube([[8, 18], [8, 10], [9, 2]], 2.6, 2.2, Su);
      g.pts([[5, 15], [5, 11], [6, 7], [6, 3]], S);
      g.rect(8, 12, 9, 13, C.cream);
      g.pts([[7, 20], [9, 22], [8, 25], [9, 27]], S); // torn
      g.tube([[9, 2], [10, -4]], 1.4, 1.4, S);
      g.ball(8, -12, 14, -4, S);
      g.pts([[7, -10], [6, -9], [6, -8], [7, -7]], S);
      g.row(-9, 11, 13, D);
      g.rect(11, -7, 14, -5, P.maw);
      g.pts([[12, -7], [14, -7], [13, -5]], C.white);
      g.limb([[9, 6], [15, 14], [21, 13]], 2, S);
      g.hand(23, 13, 1, 0, S, 3, 3);
      g.limb([[9, 4], [16, 8], [22, 3]], 2, S);
      g.hand(23, 2, 1, -1, S, 3, 3);
    }
  });

  mk('pylon-walker', 'pylon walker large tall electricity pylon that walks steel lattice cables hanging husk machine', (g, r) => {
    const I = C.iron,
      L = C.steel,
      D = C.ironDark;
    g.line(9, 46, 13, 16, D); // far legs
    g.line(20, 46, 16, 16, D);
    const xl = (y) => 12 - ((y - 14) * 8) / 32,
      xr = (y) => 17 + ((y - 14) * 8) / 32;
    if (!r) {
      g.limb([[4, 45], [12, 14]], 2, I);
      g.limb([[24, 45], [16, 14]], 2, I);
      for (const y of [18, 26, 34]) {
        g.line(xl(y), y, xr(y + 8), y + 8, L);
        g.line(xr(y), y, xl(y + 8), y + 8, L);
        g.row(y, xl(y), xr(y), I);
      }
    } else {
      g.limb([[1, 45], [0, 31], [12, 14]], 2, I); // it strides
      g.limb([[28, 45], [22, 30], [16, 14]], 2, I);
      g.line(5, 24, 19, 24, L);
      g.line(8, 20, 18, 28, L);
      g.line(20, 20, 6, 28, L);
      g.row(31, 0, 3, L);
    }
    g.rect(r ? -1 : 2, 45, r ? 3 : 6, 46, C.stone); // feet of concrete
    g.rect(r ? 26 : 23, 45, r ? 30 : 27, 46, C.stone);
    g.rect(13, 3, 16, 14, I); // mast
    g.pts([[13, 5], [14, 6], [15, 7], [16, 8], [16, 10], [15, 11], [14, 12], [13, 13]], L);
    g.rect(14, 1, 15, 2, I);
    g.rect(3, 7, 26, 8, I); // cross arms
    g.rect(6, 13, 23, 14, I);
    g.line(3, 7, 13, 4, L);
    g.line(26, 7, 16, 4, L);
    for (const x of [4, 25]) g.col(x, 9, 12, hex('#8a9a8a')); // insulators
    for (const x of [7, 22]) g.col(x, 15, 17, hex('#8a9a8a'));
    g.pts([[14, 9], [15, 9]], r ? P.yel : K);
    const husk = (x, y) => {
      g.rect(x - 1, y, x + 1, y + 1, B);
      g.rect(x - 1, y + 2, x + 1, y + 6, C.ash);
      g.pts([[x - 1, y + 7], [x + 1, y + 7], [x - 1, y + 8], [x + 1, y + 8]], dark(C.ash));
    };
    if (!r) {
      g.worm([[4, 12], [2, 24], [4, 36]], 0.5, 0.5, D, D); // cables
      g.worm([[25, 12], [27, 20], [26, 27]], 0.5, 0.5, D, D);
      g.worm([[7, 17], [8, 26], [7, 32]], 0.5, 0.5, D, D);
      g.worm([[22, 17], [21, 28], [22, 38]], 0.5, 0.5, D, D);
      husk(26, 28);
    } else {
      g.worm([[4, 12], [-3, 8], [-5, -1]], 0.5, 0.5, D, D);
      g.worm([[25, 12], [31, 10], [33, 2]], 0.5, 0.5, D, D);
      g.worm([[7, 17], [4, 24], [-2, 26]], 0.5, 0.5, D, D);
      g.worm([[22, 17], [26, 24], [32, 24]], 0.5, 0.5, D, D);
      husk(33, 3);
      g.ink();
      g.pts([[-6, -2], [-4, -3], [-6, 0], [-3, 26], [-3, 28], [33, 23], [34, 25], [3, 12], [26, 13]], P.yel); // sparks
      return false;
    }
  });

  /* ================= large and long ================= */
  mk('dog-pack', 'dog pack grown together large long fused dogs many heads legs mange mutant hounds', (g, r) => {
    const F = hex('#6e5a46'),
      D = dark(F),
      M = hex('#a88a84'),
      o = r ? { open: 2, eye: GL } : {};
    for (const x of [10, 16, 25, 31]) g.rect(x, 15, x + 1, 22, D); // far legs
    g.worm([[7, 8], [4, 5], [3, 1]], 1.2, 0.6, F);
    g.ball(5, 6, 36, 17, F);
    g.ball(11, 3, 23, 11, F); // a second back, a third
    g.ball(24, 5, 33, 12, F);
    for (const [x, yb] of [[7, 22], [13, 22], [22, 22], [28, 22], [34, 22], [18, 19]]) {
      g.rect(x, 15, x + 1, yb, F);
      if (yb === 22) g.row(22, x, x + 2, vd(F));
      else g.pts([[x, yb + 1], [x + 1, yb]], M); // one that hangs
    }
    g.oval(13, 8, 17, 10, M); // mange
    g.oval(26, 12, 30, 14, M);
    g.pts([[8, 11], [21, 6], [32, 8], [9, 14]], M);
    for (const x of [10, 12, 20, 22]) g.col(x, 11, 14, D);
    if (r) for (const x of [9, 13, 17, 21, 25, 29]) g.col(x, x > 10 && x < 23 ? 1 : 4, x > 10 && x < 23 ? 2 : 5, D);
    g.tube([[33, 9], [38, r ? 8 : 11]], 2.4, 2.2, F); // the head in front
    g.doghead(38, r ? 4 : 8, F, { ...o, bare: true });
    g.tube([[20, 5], [23, 0]], 2, 1.8, F); // one out of the back
    g.doghead(22, -4, F, { ...o, len: 3 });
    const v = g.flip(9); // and one where the tail should be
    v.tube([[4, 12], [1, 14]], 2, 1.8, F);
    v.doghead(2, r ? 10 : 13, F, { ...o, len: 3 });
  });

  mk('rust-crawler', 'rust crawler machine with a rider grown in large long scrap walker legs engine wreck cyborg', (g, r) => {
    const Ru = C.rust,
      RD = dark(Ru),
      I = C.iron,
      St = C.steel,
      S = hex('#9a8a7c'),
      y0 = r ? 7 : 12,
      ky = r ? y0 + 4 : y0 - 1;
    for (const x of [13, 23, 33]) g.limb([[x, y0 + 7], [x + 3, ky + 1], [x + 4, 25]], 1, C.ironDark); // far legs
    g.rect(8, y0 - 6, 9, y0, I); // exhaust
    g.row(y0 - 7, 7, 10, C.ironDark);
    g.rect(6, y0, 36, y0 + 8, Ru); // hull
    g.clear(6, y0);
    g.clear(36, y0);
    g.clear(6, y0 + 8);
    g.row(y0, 7, 35, lite(Ru));
    g.rect(7, y0 + 6, 36, y0 + 8, RD);
    g.col(15, y0 + 1, y0 + 5, RD);
    g.col(28, y0 + 1, y0 + 5, RD);
    g.rect(31, y0 + 2, 34, y0 + 4, St);
    g.pts([[31, y0 + 2], [34, y0 + 4]], I);
    g.speckle(6, y0, 36, y0 + 8, C.woodDark, 9, 3);
    g.rect(37, y0 + 2, 39, y0 + 5, I); // lamp
    g.rect(38, y0 + 3, 39, y0 + 4, r ? P.yel : C.glass);
    for (const x of [10, 20, 30]) {
      g.limb([[x, y0 + 7], [x - 3, ky], [x - 4, 24]], 2, I); // jointed legs
      g.rect(x - 4, ky - 1, x - 2, ky, St);
      g.row(26, x - 6, x - 2, C.ironDark);
    }
    g.worm([[23, y0 - 11], [15, y0 - 9], [10, y0 - 2]], 0.5, 0.5, C.ironDark, C.ironDark); // cables from the head
    g.rect(21, y0 - 7, 26, y0, S); // the rider, grown into it
    g.dither(21, y0 - 2, 26, y0, Ru);
    g.pts([[22, y0 - 5], [25, y0 - 5], [22, y0 - 3], [25, y0 - 3]], dark(S));
    g.limb([[21, y0 - 6], [18, y0 - 3], [18, y0]], 2, S);
    g.limb([[26, y0 - 6], [29, y0 - 3], [29, y0]], 2, S);
    g.face(21, y0 - (r ? 15 : 13), 6, 7, S, r ? { eyes: 'hollow', eye: P.yel, mouth: 'scream' } : { eyes: 'shut', mouth: 'line' });
    if (!r) {
      g.limb([[36, y0 + 5], [41, y0 + 6], [43, y0 + 9]], 2, I); // claw arm
      g.pts([[42, y0 + 11], [45, y0 + 11], [43, y0 + 12], [44, y0 + 12]], St);
    } else {
      g.limb([[36, y0 + 4], [42, y0 - 2], [45, y0 + 3]], 2, I);
      g.line(45, y0 + 5, 43, y0 + 9, St);
      g.line(46, y0 + 5, 48, y0 + 9, St);
    }
  });

  mk('mutant-cattle', 'mutant cattle large long cow two heads extra legs swollen udder herd beast', (g, r) => {
    const W = hex('#c2b8a2'),
      Bl = hex('#2e2a2c'),
      Pk = P.raw;
    g.rect(13, 19, 14, 28, dark(W)); // far legs
    g.rect(26, 19, 27, 28, dark(W));
    g.path([[6, 9], [3, 15], [4, 22]], Bl);
    g.rect(3, 22, 5, 24, Bl);
    g.limb([[14, 7], [12, 1]], 2, W); // legs that grew on the back
    g.rect(11, -1, 13, 0, Bl);
    g.limb([[19, 6], [21, 2], [20, r ? -3 : -1]], 2, W);
    g.rect(20, r ? -5 : -3, 22, r ? -4 : -2, Bl);
    g.ball(5, 5, 35, 21, W);
    g.oval(8, 7, 15, 13, Bl);
    g.oval(22, 10, 29, 17, Bl);
    g.oval(17, 5, 21, 8, Bl);
    g.pts([[7, 8], [8, 7], [6, 10]], lite(W));
    for (const x of [17, 19, 21]) g.col(x, 12, 16, dark(W));
    for (const x of [9, 29]) {
      g.rect(x, 19, x + 2, 28, W);
      g.row(24, x, x + 2, dark(W));
      g.row(28, x, x + 2, Bl);
    }
    g.ball(16, 18, 25, 24, Pk); // the udder
    g.pts([[17, 25], [19, 25], [19, 26], [21, 25], [23, 25], [23, 26], [25, 24]], P.rawD);
    g.rect(30, 1, 34, 6, dark(W)); // the second head, small and dead
    g.rect(33, 5, 36, 7, Pk);
    g.pts([[31, 0], [30, -1]], B);
    if (!r) g.pts([[32, 3], [31, 3]], Bl);
    else g.rect(31, 3, 32, 3, GL);
    if (!r) {
      g.tube([[33, 11], [38, 13]], 3.4, 3, W);
      g.rect(37, 11, 43, 16, W);
      g.rect(42, 14, 46, 18, Pk);
      g.rect(38, 11, 40, 13, Bl);
      g.set(46, 15, K);
      g.set(41, 13, K);
      g.row(17, 43, 46, P.rawD);
      g.line(38, 10, 36, 6, B);
      g.pts([[42, 10], [43, 9]], B);
      g.pts([[36, 12], [35, 13]], W);
    } else {
      g.tube([[33, 11], [38, 8]], 3.4, 3, W); // it bellows, and the jaw opens the wrong way
      g.rect(37, 5, 43, 10, W);
      g.rect(38, 5, 40, 7, Bl);
      g.rect(42, 7, 47, 8, Pk);
      g.rect(42, 13, 46, 14, Pk);
      g.rect(42, 9, 46, 12, P.maw);
      g.teeth(9, 43, 46, C.white);
      g.teeth(12, 43, 46, C.white, 1);
      g.worm([[43, 11], [46, 14], [45, 18]], 1, 0.6, P.rawD);
      g.rect(41, 6, 42, 7, C.white);
      g.set(42, 7, K);
      g.line(38, 4, 36, 0, B);
      g.pts([[42, 4], [43, 3]], B);
      g.pts([[36, 6], [35, 7]], W);
    }
  });

  mk('sewer-leviathan', 'sewer leviathan head large long giant eel worm rising from a manhole teeth blind drain monster', (g, r) => {
    const E = hex('#7a8474'),
      D = dark(E),
      Bel = hex('#b0aa90'),
      Tar = hex('#3a3a40');
    g.oval(-2, 22, 17, 27, Tar); // the road, broken open
    g.poly([[15, 21], [21, 24], [17, 27]], Tar);
    g.poly([[-1, 21], [-5, 25], [1, 27]], Tar);
    g.oval(1, 23, 14, 26, K);
    if (!r) {
      g.worm([[8, 24], [14, 18], [24, 17], [36, 20]], 5, 5.5, E); // only the head, laid along the ground
      g.worm([[16, 23], [26, 22], [37, 24]], 1.2, 1.6, Bel, Bel);
      g.row(23, 34, 41, K);
      g.teeth(24, 34, 40, C.white);
      for (const [x, y] of [[30, 15], [34, 16], [37, 18], [39, 20]]) {
        g.rect(x, y, x + 1, y, K);
        g.set(x + 1, y, P.eye);
      }
      g.worm([[41, 20], [45, 17], [47, 20]], 0.6, 0.5, D, D);
      g.worm([[41, 23], [46, 25]], 0.6, 0.5, D, D);
    } else {
      g.worm([[8, 24], [8, 8], [18, -8], [30, -7]], 5, 6, E); // it comes up
      g.worm([[11, 22], [12, 8], [20, -3], [29, -2]], 1.2, 1.6, Bel, Bel);
      g.ball(28, -14, 41, 0, E);
      g.oval(32, -10, 40, -2, P.maw);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * 6.283;
        g.set(36 + Math.cos(a) * 4, -6 + Math.sin(a) * 3.6, C.white);
      }
      g.oval(35, -7, 37, -5, K);
      for (const [x, y] of [[26, -13], [30, -14], [34, -15]]) {
        g.rect(x, y, x + 1, y, K);
        g.set(x + 1, y, P.eye);
      }
      g.worm([[40, -9], [45, -12], [46, -8]], 0.6, 0.5, D, D);
      g.worm([[40, -3], [44, 1], [43, 5]], 0.6, 0.5, D, D);
      g.worm([[37, -5], [42, -4], [46, -2]], 0.8, 0.5, P.rawD);
    }
    g.rect(17, 26, 22, 27, C.iron); // the cover, thrown aside
    g.row(26, 18, 21, C.steel);
    g.ink();
    for (const [x, y] of r ? [[14, 2], [13, 9], [30, 3], [31, 6]] : [[20, 25], [28, 26], [38, 26]]) g.set(x, y, P.sick); // it drips
    return false;
  });

  /* ================= dog- to person-sized ================= */
  mk('gasmask-scavenger', 'gas mask scavenger whose mask is grown on survivor hood coat filter face mutant', (g, r) => {
    const Ct = hex('#5a5a48'),
      Gv = hex('#3a3830');
    g.rect(10, 14, 15, 23, hex('#4a4034')); // pack and bedroll
    g.rect(10, 12, 15, 13, hex('#7a6a4a'));
    const a = g.man(8, 34, { top: Ct, legs: Gv, head: false, armL: 'down', armR: r ? null : 'down', hand: Gv });
    g.rect(5, a.yL, 12, a.yL + 4, Ct);
    g.col(8, a.yL, a.yL + 4, vd(Ct));
    g.rect(6, a.yT + 5, 7, a.yT + 6, C.rust);
    g.ball(4, a.yH - 1, 13, a.yH + 9, dark(Ct)); // hood
    g.rect(5, a.yH + 2, 12, a.yH + 7, RUB); // the mask
    g.pts([[5, a.yH + 2], [12, a.yH + 2], [5, a.yH + 7], [12, a.yH + 6], [6, a.yH + 1], [4, a.yH + 5], [13, a.yH + 4]], SK); // skin has grown over its edge
    for (const x of [5, 10]) {
      g.rect(x, a.yH + 3, x + 2, a.yH + 5, C.iron);
      g.set(x + 1, a.yH + 4, r ? GL : C.glass);
    }
    if (!r) {
      g.rect(7, a.yH + 7, 10, a.yH + 10, C.iron); // filter
      g.row(a.yH + 8, 7, 10, C.ironDark);
      g.row(a.yH + 10, 7, 10, C.ironDark);
    } else {
      g.maw(6, a.yH + 7, 11, a.yH + 11); // the filter opens
      g.pts([[5, a.yH + 8], [5, a.yH + 10], [12, a.yH + 8], [12, a.yH + 10]], C.iron);
      g.limb([[13, a.yT + 2], [16, a.yT - 1], [15, a.yT - 6]], 2, Ct);
      g.rect(15, a.yT - 8, 16, a.yT - 7, Gv);
      g.line(16, a.yT - 4, 18, a.yT - 17, C.steel); // a length of pipe
      g.line(17, a.yT - 4, 19, a.yT - 17, C.iron);
    }
    g.path([[7, a.yH + 10], [6, a.yT + 3], [6, a.yT + 6]], RUB);
  });

  mk('ash-figure', 'ash figure burnt person made of ash cinders crumbling standing ember cracks', (g, r) => {
    const A = C.ash,
      D = dark(A);
    const a = g.man(8, 34, {
      skin: A,
      top: A,
      legs: D,
      shoe: false,
      armL: r ? null : 'down',
      face: { eyes: 'hollow', mouth: r ? 'scream' : 'open', sock: vd(A), in: r ? P.ember : vd(A), eye: r ? P.ember : null, nose: false },
    });
    if (!r) g.limb([[13, a.yT + 2], [15, a.yT - 1], [12, a.yT - 5]], 2, A); // an arm thrown up before the face
    else {
      g.rect(12, a.yT + 1, 13, a.yT + 3, A); // that arm has fallen off
      g.pts([[14, a.yT + 6], [13, a.yT + 10], [15, a.yT + 13]], D);
      g.rect(2, a.yT + 1, 4, a.yT + 5, A);
      g.rect(2, a.yT + 6, 4, a.yT + 8, lite(A));
      g.pts([[2, a.yT + 9], [4, a.yT + 9]], lite(A));
    }
    g.speckle(2, a.yH, 14, 34, D, 5, 3);
    g.speckle(2, a.yH, 14, 34, lite(A), 9, 5);
    for (const [x, y] of [[4, a.yT + 6], [12, a.yL + 3], [5, a.yL + 7], [10, 33], [11, a.yH + 1]]) g.clear(x, y);
    g.row(34, 2, 14, D);
    g.pts([[1, 34], [15, 34], [3, 33], [12, 33], [13, 33]], A);
    if (r) {
      g.path([[6, a.yT + 2], [8, a.yT + 5], [7, a.yT + 8], [9, a.yL + 2]], P.ember);
      g.pts([[10, a.yT + 4], [5, a.yL + 3], [6, a.yL + 4]], P.ember);
    } else g.path([[6, a.yT + 2], [8, a.yT + 5], [7, a.yT + 8]], vd(A));
  });

  mk('crow-two-headed', 'two headed crow the size of a man giant bird black feathers bald mutant', (g, r) => {
    const Wn = hex('#34303e'),
      Gy = hex('#5a5660'),
      Bk = hex('#8a8272');
    g.poly([[5, 22], [1, 30], [4, 31], [8, 26]], N); // tail
    for (const x of [8, 13]) {
      g.rect(x, 26, x + 1, 30, Gy);
      g.row(31, x - 1, x + 3, Gy);
    }
    if (r)
      g.both(21, (v) => {
        v.poly([[6, 12], [-5, 6], [-7, 14], [-3, 22], [5, 22]], N);
        for (const [x, y] of [[-7, 15], [-5, 19], [-2, 22]]) v.col(x, y, y + 2, N);
        v.line(5, 13, -4, 8, Wn);
      });
    g.ball(4, 9, 17, 27, N);
    if (!r) {
      g.poly([[5, 13], [9, 12], [10, 24], [6, 26]], Wn);
      g.poly([[12, 12], [16, 13], [15, 26], [11, 24]], Wn);
      g.col(7, 15, 24, N);
      g.col(14, 15, 24, N);
    }
    const hd = (v) => {
      v.tube([[9, 11], [7, 7], [6, 3]], 1.6, 1.4, N);
      v.pts([[7, 7], [8, 9], [6, 5]], P.raw); // bald necks
      v.ball(3, -2, 8, 3, N);
      if (!r) {
        v.pts([[2, 1], [1, 1], [0, 2], [2, 2], [1, 2], [-1, 3]], Bk);
        v.set(5, 0, P.eye);
      } else {
        v.pts([[2, 0], [1, -1], [0, -2], [2, -1]], Bk);
        v.pts([[2, 2], [1, 3], [0, 4], [2, 3]], Bk);
        v.pts([[2, 1], [1, 1], [1, 0], [1, 2]], P.maw);
        v.set(5, 0, P.red);
      }
    };
    hd(g);
    hd(g.flip(21).at(0, -3));
  });

  mk('sign-raider', 'road sign armour raider thing scrap armour stop sign shield signpost axe marauder wasteland', (g, r) => {
    const SR = hex('#9a3a30'),
      SY = hex('#b8963a'),
      SB = hex('#3a5a7a'),
      Wh = C.white,
      Dk = hex('#2e2a28');
    const a = g.man(8, 36, { top: Dk, legs: Dk, tl: 11, ll: 11, head: false });
    g.rect(5, a.yL + 3, 7, a.yL + 7, SY); // greaves
    g.rect(10, a.yL + 2, 12, a.yL + 6, C.steel);
    g.rect(12, a.yT + 1, 14, a.yL - 3, Dk);
    const post = (x, y0, y1) => {
      g.col(x, y0, y1, C.steel);
      g.poly([[x, y0 - 7], [x - 4, y0], [x + 4, y0]], SY); // a warning sign for an axe
      g.col(x, y0 - 4, y0 - 2, K);
    };
    if (!r) {
      g.rect(13, a.yL - 2, 14, a.yL - 1, hex('#6a5a50'));
      post(16, a.yH - 1, 36);
    } else {
      g.limb([[13, a.yT + 2], [16, a.yT - 2], [16, a.yT - 6]], 2, Dk);
      post(17, a.yH - 11, a.yT + 2);
    }
    g.rect(4, a.yH, 12, a.yH + 9, SB); // helmet: a sign bent round the head
    g.row(a.yH, 4, 12, Wh);
    g.row(a.yH + 9, 4, 12, Wh);
    g.row(a.yH + 6, 6, 10, Wh);
    g.pts([[9, a.yH + 5], [9, a.yH + 7]], Wh);
    g.row(a.yH + 3, 5, 11, K);
    if (r) g.pts([[6, a.yH + 3], [10, a.yH + 3]], P.red);
    if (!r) {
      g.rect(5, a.yT + 2, 11, a.yT + 8, SR); // a stop sign on the chest
      g.pts([[5, a.yT + 2], [11, a.yT + 2], [5, a.yT + 8], [11, a.yT + 8]], Dk);
      g.row(a.yT + 5, 6, 10, Wh);
    } else {
      g.maw(6, a.yT + 2, 11, a.yT + 8, { tongue: P.rawD }); // it swings open like a door
      g.rect(3, a.yT + 2, 5, a.yT + 8, dark(SR));
      g.col(3, a.yT + 2, a.yT + 8, Wh);
    }
    g.poly([[1, a.yT + 2], [4, a.yT - 1], [7, a.yT + 2], [4, a.yT + 5]], SY); // shoulder
    g.set(4, a.yT + 2, K);
    g.oval(-2, a.yT + 6, 5, a.yT + 13, SR); // shield
    g.oval(-1, a.yT + 7, 4, a.yT + 12, Wh);
    g.rect(1, a.yT + 9, 2, a.yT + 10, K);
  });

  mk('plague-swarm', 'plague swarm flies in the shape of a man cloud of insects skull inside buzzing pestilence', (g, r) => {
    const F1 = hex('#1e1c22'),
      F2 = hex('#3a3640'),
      rr = rnd(r ? 9 : 5),
      mc = canvas(60, 70),
      m = surface(mc, 20, 20);
    const a = m.man(8, 34, { arms: r ? null : 'down', face: { eyes: 'none', mouth: 'none' } });
    if (r)
      m.both(17, (v) => {
        v.limb([[3, a.yT + 2], [-2, a.yT], [-5, a.yT - 8]], 3, K);
        v.hand(-5, a.yT - 10, 0, -1, K, 3, 3);
      });
    g.skull(5, a.yH + 1, B, K, r ? 2 : 0);
    for (const y of [a.yT + 3, a.yT + 5, a.yT + 7]) g.row(y, 6, 11, B);
    for (let y = -20; y < 40; y++)
      for (let x = -14; x < 32; x++) {
        const inside = m.get(x, y);
        let near = false;
        if (!inside) for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2], [-3, -1], [3, 1], [1, -4], [-1, 4]]) near = near || !!m.get(x + dx, y + dy);
        const p = inside ? (g.get(x, y) ? 0.3 : 0.86) : near ? (r ? 0.3 : 0.25) : 0;
        if (rr() < p) g.set(x, y, rr() < 0.6 ? F1 : F2);
      }
    return false;
  });

  mk('trolley-thing', 'shopping trolley thing creature living in a cart arms through the wire flesh rags supermarket', (g, r) => {
    const St = C.steel,
      Fl = P.gut,
      Rg = hex('#5a4a44');
    g.line(7, 16, 6, 19, St); // frame and wheels
    g.line(17, 16, 18, 19, St);
    g.row(18, 6, 18, C.iron);
    g.rect(5, 20, 6, 21, P.night);
    g.rect(18, 20, 19, 21, P.night);
    g.line(20, 6, 23, 3, St);
    g.row(3, 22, 24, hex('#9a3a30'));
    g.poly([[4, 6], [20, 6], [18, 16], [6, 16]], Rg);
    g.ball(6, r ? 2 : 4, 17, 14, Fl); // what lives in it
    for (let x = 5; x <= 19; x += 2) for (let y = 7; y <= 15; y++) if (g.get(x, y) && g.get(x - 1, y) && g.get(x + 1, y)) g.set(x, y, St);
    g.row(6, 4, 20, St);
    g.row(11, 5, 19, St);
    g.row(16, 6, 18, St);
    if (!r) g.pts([[8, 9], [12, 9]], P.eye);
    else {
      g.pts([[8, 4], [9, 4], [13, 4], [14, 4]], K);
      g.pts([[9, 4], [14, 4]], P.eye);
      g.maw(8, 12, 15, 15);
      g.limb([[5, 9], [0, 12], [1, 20]], 2, Fl); // it walks the cart on its hands
      g.pts([[0, 21], [1, 21], [2, 21], [3, 21]], Fl);
      g.limb([[18, 9], [23, 13], [22, 20]], 2, Fl);
      g.pts([[21, 21], [22, 21], [23, 21], [24, 21]], Fl);
    }
  });

  mk('tyre-crawler', 'tyre crawler thing living in a stack of tyres pale neck arms rubber hermit scrap', (g, r) => {
    const Rb = hex('#2a2a30'),
      Tr = hex('#4a4a52'),
      S = hex('#cfc0b0'),
      up = r ? 4 : 0;
    const tyre = (x, y) => {
      g.rect(x, y, x + 13, y + 4, Rb);
      for (const [cx, cy] of [[x, y], [x + 13, y], [x, y + 4], [x + 13, y + 4]]) g.clear(cx, cy);
      for (let i = x + 1; i < x + 13; i += 2) g.set(i, y, Tr);
      g.row(y + 2, x + 2, x + 11, Tr);
      g.set(x + 1, y + 2, lite(Tr));
    };
    if (r) {
      for (const [x, d] of [[5, -2], [8, -1], [11, 1], [14, 2]]) g.path([[x, 16], [x + d, 18], [x + d * 2, 20]], S);
      g.both(19, (v) => {
        v.limb([[3, 6], [-1, 8], [-2, 13]], 2, S);
        v.hand(-2, 15, 0, 1, S, 3, 2);
      });
      g.worm([[9, 1], [8, -6], [11, -10]], 1.4, 1.2, S); // a neck comes up out of the middle
      g.ball(9, -15, 15, -10, S);
      g.rect(12, -12, 15, -11, P.maw);
      g.pts([[13, -12], [15, -12], [14, -11]], C.white);
      g.set(11, -13, K);
    }
    tyre(3, 15 - up);
    tyre(4, 10 - up);
    tyre(3, 5 - up);
    if (!r) {
      g.oval(5, 4, 13, 6, K);
      g.pts([[7, 5], [10, 5]], P.eye);
      g.pts([[4, 5], [4, 6], [14, 5], [14, 6]], S);
    }
  });

  mk('tv-head', 'television head man old tv set for a head static screen face wanderer cables', (g, r) => {
    const Jk = hex('#4a4640'),
      Bx = hex('#5a4a3a');
    g.path([[13, 12], [15, 22], [14, 30], [16, 35]], P.night); // the lead trails behind
    g.rect(16, 35, 17, 36, C.cream);
    const a = g.man(8, 36, { top: Jk, legs: hex('#2e2c30'), tl: 11, ll: 11, head: false, arms: r ? null : 'down', skin: P.pale });
    g.col(8, a.yT + 1, a.yT + 5, C.wine);
    g.rect(3, a.yH - 1, 13, a.yH + 8, Bx); // the set
    g.row(a.yH - 1, 3, 13, lite(Bx));
    g.rect(4, a.yH, 10, a.yH + 6, r ? hex('#c8d8c8') : hex('#6a7a78'));
    if (!r) g.dither(4, a.yH, 10, a.yH + 6, hex('#2a3030')); // snow
    else {
      g.pts([[5, a.yH + 1], [6, a.yH + 1], [8, a.yH + 1], [9, a.yH + 1], [5, a.yH + 2], [9, a.yH + 2]], K); // then a face
      g.rect(5, a.yH + 4, 9, a.yH + 5, K);
      g.pts([[6, a.yH + 4], [8, a.yH + 4]], C.white);
    }
    g.pts([[12, a.yH + 1], [12, a.yH + 3]], C.brass);
    g.col(12, a.yH + 5, a.yH + 6, K);
    g.line(6, a.yH - 2, r ? 1 : 4, a.yH - 7, C.steel);
    g.line(10, a.yH - 2, r ? 15 : 12, a.yH - 7, C.steel);
    g.pts([[7, a.yH + 9], [9, a.yH + 9]], K);
    if (r)
      g.both(17, (v) => {
        v.limb([[3, a.yT + 2], [0, a.yT + 5], [-2, a.yT + 1]], 2, Jk);
        v.hand(-2, a.yT - 1, 0, -1, P.pale, 3, 2);
      });
  });

  mk('glow-child', 'glowing child irradiated see through skeleton inside green glow small ghost toy', (g, r) => {
    const G1 = r ? hex('#b4d67a') : hex('#8aa878'),
      Bn = hex('#3a4a34');
    g.face(3, 2, 8, 8, G1, { eyes: 'hollow', sock: Bn, mouth: 'none', nose: false });
    g.rect(5, 10, 8, 17, G1);
    g.row(10, 4, 9, G1);
    g.rect(4, 18, 5, 24, G1);
    g.rect(8, 18, 9, 24, G1);
    g.row(18, 4, 9, G1);
    g.row(12, 5, 8, Bn); // the bones show through
    g.row(14, 5, 8, Bn);
    g.row(16, 6, 7, Bn);
    g.col(5, 19, 23, Bn);
    g.col(8, 19, 23, Bn);
    if (!r) {
      g.rect(2, 11, 3, 17, G1);
      g.rect(10, 11, 11, 17, G1);
      g.col(3, 12, 16, Bn);
      g.col(10, 12, 16, Bn);
      g.row(7, 5, 8, Bn);
      g.row(1, 4, 9, hex('#5a5a40'));
      g.pts([[3, 2], [10, 2], [3, 3]], hex('#5a5a40'));
      g.col(1, 18, 19, C.ash); // a toy rabbit, by the ear
      g.rect(0, 20, 2, 23, C.ash);
      g.set(1, 21, K);
      g.set(0, 24, C.ash);
    } else {
      g.limb([[3, 11], [0, 12], [-2, 9]], 2, G1);
      g.limb([[10, 11], [13, 12], [15, 9]], 2, G1);
      g.rect(5, 7, 8, 12, P.maw); // the jaw comes down to the chest
      g.pts([[5, 7], [7, 7], [6, 12], [8, 12]], C.white);
      for (const x of [3, 5, 7, 9]) g.col(x, -2 + (x % 4 === 1 ? 1 : 0), 1, hex('#5a5a40'));
      g.rect(-1, 23, 2, 24, C.ash);
      g.set(0, 23, K);
    }
    g.ink(hex('#2c3a2a'));
    return false;
  });

  mk('roach-face', 'giant cockroach with a human face dog sized roach insect antennae wrong vermin', (g, r) => {
    const Br = hex('#5a3a22'),
      D = dark(Br),
      L = hex('#8a5a32'),
      lift = r ? 3 : 0;
    for (const [x, dx] of [[7, -3], [11, -1], [15, 2]]) {
      g.path([[x, 9], [x + dx, 11], [x + dx - 1, 12]], D);
      g.set(x + dx + 1, 12, D);
    }
    g.path([[19, 9 - lift], [22, 10], [23, 12]], D);
    if (r) {
      g.poly([[6, 5], [3, -2], [13, 0], [15, 5]], Br); // the wing cases lift
      g.poly([[8, 5], [9, 1], [16, 4]], hex('#c8b890'));
    }
    g.oval(2, 4, 18, 10, Br);
    g.row(5, 5, 14, lite(Br));
    g.line(4, 7, 16, 7, D);
    g.col(4, 6, 9, D);
    g.col(6, 5, 9, D);
    g.oval(15, 2 - lift, 24, 10 - lift, L);
    g.face(17, 3 - lift, 7, 7, hex('#c2a084'), r ? { eyes: 'wide', mouth: 'scream' } : { eyes: 'shut', mouth: 'line' });
    if (!r) {
      g.worm([[22, 3], [14, 0], [6, 1]], 0.5, 0.5, D, D);
      g.worm([[23, 4], [18, 1], [10, 2]], 0.5, 0.5, D, D);
    } else {
      g.worm([[22, 0], [27, -4], [30, -1]], 0.5, 0.5, D, D);
      g.worm([[23, 1], [28, 0], [31, 4]], 0.5, 0.5, D, D);
    }
  });

  mk('hairless-hound', 'hairless hound mutant dog no eyes bare skin ribs jaw splits open wasteland beast', (g, r) => {
    const Sk = hex('#a88a84'),
      D = dark(Sk);
    g.rect(8, 11, 8, 16, D);
    g.rect(18, 11, 18, 16, D);
    g.pts([[4, 6], [3, 7], [2, 8], [1, 10], [1, 12]], B); // a tail of bare bone
    g.ball(4, 4, 20, 11, Sk);
    g.clearRect(9, 11, 14, 11);
    for (const x of [10, 12, 14]) g.col(x, 6, 9, D);
    for (const x of [7, 10, 13, 16]) g.col(x, r ? 1 : 3, 3, B);
    g.rect(5, 10, 6, 16, Sk);
    g.row(16, 5, 7, D);
    g.rect(16, 10, 17, 16, Sk);
    g.row(16, 16, 18, D);
    if (!r) {
      g.doghead(19, 3, Sk, { eye: null, len: 4, bare: true, ear: false });
      g.pts([[21, 4], [22, 5]], D);
    } else {
      g.rect(19, 2, 23, 7, Sk); // the muzzle opens in four
      g.poly([[24, 2], [28, 2], [28, 8], [24, 7]], P.maw);
      g.thick(23, 3, 27, -1, 2, Sk);
      g.thick(23, 6, 27, 9, 2, Sk);
      g.line(24, 4, 29, 3, Sk);
      g.line(24, 5, 29, 6, Sk);
      g.pts([[25, 1], [27, 0], [25, 8], [27, 9], [26, 4], [28, 5]], C.white);
      g.pts([[21, 3], [22, 4]], D);
    }
  });

  mk('hazmat-leaker', 'hazmat suit leaking black sludge empty suit visor goo walking contamination', (g, r) => {
    const Go = hex('#15131a'),
      Tp = hex('#8a8a80'),
      Gv = hex('#2a2a2e');
    g.rect(11, 14, 14, 23, hex('#6a6a5a')); // air tank
    const a = g.man(8, 34, { top: HAZ, legs: HAZ, shoe: Gv, head: false, arms: r ? null : 'down', hand: Gv });
    g.ball(3, a.yH - 1, 13, a.yH + 9, HAZ);
    g.rect(5, a.yH + 2, 11, a.yH + 6, hex('#3a4a4c')); // visor
    g.col(8, a.yT + 1, a.yL - 1, dark(HAZ));
    g.row(a.yL + 6, 5, 12, Tp);
    if (!r) {
      g.rect(5, a.yH + 4, 11, a.yH + 6, Go); // half full of something black
      g.set(6, a.yH + 2, C.glassLight);
      g.row(a.yL - 4, 3, 5, Tp);
      g.row(a.yL - 4, 12, 14, Tp);
      g.pts([[4, a.yL], [4, a.yL + 1], [13, a.yL], [6, 33]], Go);
      g.row(34, 1, 6, Go);
    } else {
      g.rect(5, a.yH + 2, 11, a.yH + 6, Go);
      g.pts([[6, a.yH + 3], [10, a.yH + 3]], P.eye);
      g.rect(7, a.yH + 5, 9, a.yH + 5, P.eye);
      g.col(8, a.yH + 7, a.yT + 3, Go);
      g.pts([[7, a.yH + 7], [9, a.yH + 8]], Go);
      g.both(17, (v) => {
        v.limb([[3, a.yT + 2], [0, a.yT + 4], [-1, a.yT + 8]], 2, HAZ);
        v.row(a.yT + 8, -1, 0, Tp);
        v.worm([[-1, a.yT + 10], [-3, a.yT + 14], [-1, a.yT + 19]], 1.2, 0.5, Go, Go);
      });
      g.row(34, -1, 9, Go);
      g.row(34, 13, 16, Go);
    }
  });

  mk('barrel-dweller', 'barrel dweller thing in a hazmat drum sludge arms eyes under the lid toxic waste', (g, r) => {
    const Ba = hex('#7a7438'),
      Sl = hex('#3c4a2e'),
      up = r ? 3 : 0,
      y0 = 6 - up;
    if (r) {
      g.rect(5, 20 - up, 6, 22, Sl);
      g.rect(9, 20 - up, 10, 22, Sl);
      g.row(22, 4, 6, Sl);
      g.row(22, 9, 11, Sl);
      g.both(15, (v) => {
        v.limb([[3, y0 + 5], [-1, y0 + 3], [-2, y0 + 8]], 2, Sl);
        v.hand(-2, y0 + 10, 0, 1, B, 3, 2);
      });
      g.worm([[7, y0], [8, y0 - 4]], 1.6, 1.4, Sl); // the lid goes up on a neck
      g.pts([[6, y0 - 4], [9, y0 - 4]], GL);
    }
    g.rect(3, y0, 12, y0 + 13, Ba);
    g.row(y0 + 3, 3, 12, dark(Ba));
    g.row(y0 + 9, 3, 12, dark(Ba));
    g.col(3, y0, y0 + 13, lite(Ba));
    g.speckle(3, y0, 12, y0 + 13, C.rust, 6, 4);
    g.rect(7, y0 + 5, 8, y0 + 6, K); // the mark
    g.pts([[6, y0 + 7], [9, y0 + 7], [7, y0 + 4]], K);
    g.pts([[5, y0 + 13], [10, y0 + 14], [11, y0 + 13]], Sl);
    const ly = r ? y0 - 6 : y0 - 1;
    g.row(ly, 3, 12, C.steel);
    g.row(ly + 1, 2, 13, C.iron);
    if (!r) {
      g.row(y0, 3, 12, K);
      g.pts([[6, y0], [9, y0]], GL);
      g.pts([[4, y0 + 1], [11, y0 + 1]], Sl);
    } else g.row(y0, 3, 12, vd(Ba));
  });

  mk('rebar-crawler', 'rebar crawler person fused with concrete slab and iron rods crawling rubble thing', (g, r) => {
    const Cn = C.stone,
      S = hex('#8f8a84'),
      Ru = C.rust,
      up = r ? 4 : 0;
    if (r) {
      g.limb([[18, 10 - up], [22, 14], [24, 16]], 2, S); // arms push it up
      g.limb([[8, 11 - up], [5, 14], [4, 16]], 2, S);
      g.rect(21, 7 - up, 25, 11 - up, S);
      g.face(24, 6 - up, 6, 7, hex('#b8a898'), { eyes: 'hollow', mouth: 'scream' }); // a head comes out from under it
    } else {
      g.rect(24, 15, 27, 16, S); // one hand shows
      g.pts([[28, 16], [26, 14]], S);
    }
    g.poly([[4, 8 - up], [22, 5 - up], [24, 12 - up], [6, 15 - up]], Cn); // the slab on its back
    g.line(4, 8 - up, 22, 5 - up, lite(Cn));
    g.line(9, 8 - up, 12, 12 - up, C.stoneDark);
    g.line(12, 12 - up, 11, 14 - up, C.stoneDark);
    g.line(17, 6 - up, 18, 9 - up, C.stoneDark);
    g.speckle(4, 5 - up, 24, 15 - up, C.stoneLight, 8, 2);
    if (!r) g.row(16, 5, 23, C.stoneDark);
    g.line(8, 8 - up, 7, 3 - up, Ru); // rods
    g.line(14, 7 - up, 15, 1 - up, Ru);
    g.line(15, 1 - up, 17, 0 - up, Ru);
    g.line(20, 5 - up, 22, 0 - up, Ru);
    g.line(5, 12 - up, 1, 11 - up, Ru);
  });

  mk('shadow-burned', 'burned shadow of a person nuclear shadow that peels off the wall flat dark silhouette ghost', (g, r) => {
    const Sh = hex('#2a2428');
    g.man(8, 34, { face: { eyes: 'none', mouth: 'none', nose: false } });
    if (!r)
      g.both(17, (v) => {
        v.limb([[3, 17], [-1, 14], [-2, 8]], 2, Sh); // the hands thrown up
        v.hand(-2, 6, 0, -1, Sh, 3, 2);
      });
    else {
      g.limb([[3, 17], [-3, 20], [-6, 29]], 2, Sh); // it comes away from the wall
      g.hand(-6, 31, 0, 1, Sh, 3, 5);
      g.limb([[13, 17], [16, 12], [15, 5]], 2, Sh);
      g.hand(15, 3, 0, -1, Sh, 3, 4);
      g.rect(5, 34, 12, 36, Sh);
      g.row(37, 2, 14, Sh);
    }
    const c = g.c;
    for (let y = 0; y < c.h; y++)
      for (let x = 0; x < c.w; x++)
        if (c.get(x, y)) {
          const edge = !c.get(x - 1, y) || !c.get(x + 1, y);
          c.px[y * c.w + x] = edge && (x + y) % 3 === 0 ? hex('#4a4046') : Sh;
        }
    if (r) g.pts([[6, 18 - 9], [9, 18 - 9]], P.eye);
    return false;
  });

  /* ================= vermin and small things ================= */
  mk('rat-glow', 'glowing rat two tails radioactive sores vermin small mutant', (g, r) => {
    const Rt = hex('#57525a'),
      Pk = P.raw;
    g.worm([[3, 6], [1, 4], [0, 1]], 0.5, 0.5, Pk, Pk);
    g.worm([[3, 7], [0, 8], [-2, 6]], 0.5, 0.5, Pk, Pk);
    g.ball(2, 3, 10, 8, Rt);
    g.poly([[9, 4], [12, 5], [14, 7], [10, 8]], Rt);
    g.pts([[9, 3], [10, 3]], Pk);
    g.set(14, 7, Pk);
    g.pts([[3, 9], [4, 9], [8, 9], [9, 9]], Pk);
    g.set(11, 5, r ? GL : P.red);
    if (!r) g.pts([[4, 4], [7, 5], [5, 7]], P.sick);
    else {
      g.row(3, 4, 8, GL); // the back splits
      g.pts([[5, 2], [7, 2], [4, 5], [7, 6]], GL);
      g.rect(11, 8, 13, 9, P.maw);
      g.pts([[12, 8], [13, 10], [11, 10]], C.white);
      g.row(10, 11, 12, Rt);
    }
  });

  mk('roach-swarm', 'cockroach swarm heap of roaches insects vermin small crawling', (g, r) => {
    const Br = hex('#5a3a22'),
      L = hex('#8a5a32');
    const pos = r
      ? [[0, 9], [7, 9], [14, 9], [21, 9], [3, 5], [11, 5], [18, 5], [7, 1], [15, 0], [-1, 1], [23, 2]]
      : [[1, 9], [8, 9], [15, 9], [4, 5], [12, 5], [8, 1]];
    pos.forEach(([x, y], i) => {
      const hx = i % 2 ? x : x + 3;
      g.rect(x, y, x + 3, y + 1, i % 3 ? Br : hex('#6e4526'));
      g.col(hx, y, y + 1, hex('#2e1e14'));
      g.set(i % 2 ? x + 2 : x + 1, y, L);
      g.set(i % 2 ? x - 1 : x + 4, y - 1, hex('#2e1e14')); // feelers
      if (r && y < 4) g.pts([[x, y - 1], [x + 3, y - 1], [x - 1, y - 2], [x + 4, y - 2]], hex('#c8b890')); // some take off
    });
  });

  mk('mask-crab', 'gas mask crab mask walking on fingers hermit small vermin lenses', (g, r) => {
    const y0 = r ? 0 : 3;
    if (!r) g.pts([[2, 10], [5, 10], [9, 10], [12, 10]], SK);
    else
      for (const [x, tx] of [[3, 0], [5, 3], [9, 11], [11, 14]]) {
        g.path([[x, y0 + 6], [tx, y0 + 7], [tx, 10]], SK);
        g.set(tx, y0 + 8, dark(SK));
      }
    g.rect(2, y0, 12, y0 + 6, RUB);
    for (const [x, y] of [[2, y0], [12, y0], [2, y0 + 6], [12, y0 + 6]]) g.clear(x, y);
    for (const x of [3, 9]) {
      g.rect(x, y0 + 1, x + 2, y0 + 3, C.iron);
      g.set(x + 1, y0 + 2, r ? GL : C.glassLight);
    }
    if (!r) {
      g.rect(6, y0 + 4, 8, y0 + 7, C.iron);
      g.row(y0 + 6, 6, 8, C.ironDark);
    } else g.maw(5, y0 + 5, 9, y0 + 7);
    g.pts([[1, y0 + 1], [0, y0 + 2], [13, y0 + 1], [14, y0 + 2]], hex('#4a4a44'));
  });

  mk('can-hermit', 'tin can hermit slug living in a can eye stalks small vermin rubbish', (g, r) => {
    const Tn = C.steel,
      Lb = hex('#8a4a3a'),
      Sl = P.sick;
    if (r) {
      g.worm([[7, 6], [11, 7], [14, 8]], 1.5, 1, Sl);
      g.line(12, 6, 13, 2, Sl);
      g.line(13, 6, 16, 3, Sl);
      g.pts([[13, 1], [16, 2]], P.eye);
      g.set(15, 8, C.white);
    }
    g.rect(1, 3, 7, 8, Tn);
    g.rect(3, 3, 5, 8, Lb);
    g.set(4, 5, C.cream);
    g.col(1, 3, 8, lite(Tn));
    g.pts([[8, 2], [9, 1]], Tn); // the lid, bent up
    if (!r) {
      g.col(8, 4, 7, K);
      g.set(8, 5, P.eye);
    }
  });

  mk('glow-slug', 'glowing slug with human teeth radioactive fat slug small vermin slime', (g, r) => {
    const Sl = hex('#8aa878');
    if (!r) {
      g.worm([[2, 5], [7, 3], [12, 5]], 2.2, 1.6, Sl);
      g.line(12, 3, 13, 0, Sl);
      g.line(13, 4, 16, 1, Sl);
      g.pts([[13, -1], [16, 0]], K);
      g.pts([[5, 3], [8, 2]], GL);
    } else {
      g.worm([[2, 5], [7, 4], [10, 1], [11, -4]], 2.2, 1.8, Sl); // it rears, and it has a man's teeth
      g.rect(11, -4, 13, 0, P.maw);
      g.pts([[12, -4], [13, -3], [13, -1], [12, 0]], C.white);
      g.line(10, -6, 9, -9, Sl);
      g.line(11, -6, 13, -9, Sl);
      g.pts([[9, -10], [13, -10]], K);
      g.pts([[5, 4], [8, 2], [9, -2]], GL);
    }
    g.ink();
    g.row(7, -2, 1, hex('#c8d8b0')); // its trail
    return false;
  });

  mk('doll-melted', 'melted doll crawling plastic baby doll half melted one eye small toy thing', (g, r) => {
    const Pl = hex('#d8b8a0'),
      D = dark(Pl);
    g.oval(0, 8, 13, 10, D); // a puddle of plastic
    g.ball(1, 4, 8, 9, Pl);
    g.rect(2, 6, 6, 8, hex('#8a6a7a'));
    if (!r) {
      g.ball(7, 3, 13, 9, Pl);
      g.pts([[12, 10], [13, 9]], Pl);
      g.row(6, 9, 10, vd(Pl));
      g.pts([[8, 3], [9, 2], [10, 3]], hex('#8a6a3a'));
      g.set(12, 7, D);
    } else {
      g.limb([[3, 4], [1, 0]], 2, Pl);
      g.pts([[0, -1], [2, -1], [1, -2]], Pl);
      g.ball(7, -1, 13, 6, Pl); // the head comes up
      g.pts([[8, -1], [9, -2], [10, -1]], hex('#8a6a3a'));
      g.rect(8, 1, 9, 2, C.white);
      g.set(9, 2, hex('#3f5f86'));
      g.rect(11, 1, 12, 3, K); // the other eye has run
      g.set(12, 4, K);
      g.rect(9, 4, 11, 5, P.maw);
      g.col(10, 6, 8, Pl);
    }
  });

  mk('tumour-pup', 'tumour pup lump of flesh with teeth and legs small mutant growth vermin', (g, r) => {
    g.pts([[2, 9], [5, 9], [8, 9], [10, 9]], dark(TU2));
    g.ball(1, 2, 10, 8, TU);
    g.ball(6, 1, 11, 5, TU3);
    g.path([[3, 6], [5, 7]], dark(TU));
    if (!r) {
      g.row(4, 3, 4, dark(TU2));
      g.row(6, 6, 10, dark(TU2));
    } else {
      g.maw(3, 5, 10, 8);
      g.rect(3, 2, 4, 3, P.eye);
      g.set(4, 3, K);
    }
  });

  mk('wire-rat', 'wire rat nest of cables in the shape of a rat copper teeth plug tail sparks small machine vermin', (g, r) => {
    const Cu = hex('#b06a3a'),
      In = hex('#2a2a30'),
      In2 = hex('#7a3a3a'),
      In3 = hex('#4a6a4a');
    g.worm([[3, 7], [0, 5], [-3, 8]], 0.5, 0.5, In, In); // a tail with a plug on it
    g.rect(-6, 7, -4, 9, C.cream);
    g.pts([[-7, 7], [-7, 9]], C.steel);
    g.oval(2, 2, 11, 9, In); // a body of coiled flex
    for (const [x0, x1, y, c] of [[3, 10, 3, In2], [2, 11, 5, In3], [2, 11, 7, In2], [4, 9, 9, Cu]]) g.row(y, x0, x1, c);
    g.pts([[4, 4], [8, 4], [6, 6], [10, 6], [3, 8], [7, 8]], Cu);
    g.poly([[10, 3], [14, 4], [17, 8], [11, 8]], In); // head
    g.pts([[10, 2], [11, 1], [12, 2]], In2); // an ear: a loop of wire
    g.set(14, 5, P.red);
    g.pts([[4, 10], [6, 10], [9, 10], [11, 10]], Cu);
    if (!r) g.pts([[18, 7], [18, 9]], Cu);
    else {
      g.rect(13, 9, 16, 9, P.maw);
      g.row(10, 12, 15, In);
      g.pts([[14, 9], [16, 9], [13, 10], [15, 10]], Cu); // teeth of stripped copper
      g.ink();
      g.pts([[19, 6], [20, 8], [18, 4], [-8, 6], [-9, 8]], P.yel);
      return false;
    }
  });
};
