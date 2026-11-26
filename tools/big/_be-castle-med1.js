/* Medieval creatures, first half: castle and town of the middle ages. See be-castle.js. */
module.exports = (k, mk) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, P, vd, fin } = k;
  const ST = C.steel,
    IR = C.iron,
    IRD = C.ironDark;
  const plate = (g, x0, y0, x1, y1, c = ST) => {
    g.rect(x0, y0, x1, y1, c);
    g.col(x0, y0, y1, lite(c));
    g.row(y1, x0, x1, dark(c));
  };

  /* ---- the empty armour ---- */
  mk('armour-hollow-walker', 'large tall empty suit of armour walking hollow knight nobody inside haunted plate steel sword monster', 24, 46, (g, r) => {
    for (const x of [7, 13]) {
      plate(g, x, 30, x + 3, 35);
      plate(g, x - 1, 37, x + 4, 38, IR);
      plate(g, x, 40, x + 3, 42);
      plate(g, x - 1, 43, x + 4, 44, IR);
    }
    plate(g, 6, 25, 17, 28, dark(ST));
    g.col(11, 26, 28, K);
    plate(g, 6, 13, 17, 21);
    plate(g, 7, 22, 16, 23, IR);
    g.row(17, 7, 16, dark(ST));
    g.col(12, 14, 20, lite(ST));
    g.oval(2, 12, 8, 16, ST);
    g.oval(15, 12, 21, 16, ST);
    g.row(12, 4, 6, lite(ST));
    plate(g, 3, 18, 5, 22);
    plate(g, 3, 24, 5, 28);
    plate(g, 2, 30, 5, 32, IR);
    if (!r) {
      plate(g, 18, 18, 20, 22);
      plate(g, 18, 24, 20, 28);
      plate(g, 18, 30, 20, 32, IR);
      g.col(21, 31, 44, lite(ST));
      g.row(30, 19, 22, C.brass);
      g.col(21, 27, 29, C.woodDark);
      g.set(21, 26, C.brass);
    } else {
      plate(g, 18, 5, 20, 10);
      plate(g, 18, -1, 20, 3);
      plate(g, 18, -5, 21, -3, IR);
      g.col(21, -15, -7, lite(ST));
      g.col(20, -13, -7, ST);
      g.row(-6, 18, 22, C.brass);
      g.poly([[11, 14], [12, 14], [15, 24], [8, 24]], K); // the breastplate has come open: nothing inside, but it looks back
      g.pts([[11, 17], [12, 20], [10, 22], [13, 23]], P.YEL);
      g.pts([[9, 19], [8, 20], [14, 18], [15, 19]], IRD);
    }
    const h = g.at(0, r ? -4 : 0);
    h.row(2, 9, 14, ST);
    h.rect(8, 3, 15, 10, ST);
    h.row(11, 9, 14, IR);
    h.col(8, 3, 10, lite(ST));
    h.col(11, 2, 5, lite(ST));
    h.rect(9, 6, 14, r ? 9 : 6, K);
    if (!r) h.pts([[10, 8], [12, 8], [14, 8], [11, 9], [13, 9]], IRD);
    else h.row(5, 9, 14, IR);
    h.pts([[12, 1], [13, 1], [14, 1], [15, 2], [16, 2], [16, 3], [17, 4]], C.wine);
  }, { uh: 62 });

  /* ---- rats ---- */
  const rat = (g, x, y, col, r) => {
    if (!r) {
      g.oval(x, y, x + 5, y + 3, col);
      g.rect(x + 5, y + 1, x + 6, y + 3, col);
      g.rect(x + 7, y + 2, x + 7, y + 3, col);
      g.row(y, x + 1, x + 3, lite(col));
      g.set(x + 8, y + 3, P.RAW);
      g.set(x + 5, y, P.RAW);
      g.set(x + 6, y + 2, P.RED);
      g.pts([[x + 1, y + 4], [x + 5, y + 4]], P.RAW);
    } else {
      g.oval(x, y - 3, x + 4, y + 3, col);
      g.rect(x + 3, y - 6, x + 6, y - 4, col);
      g.col(x, y - 1, y + 2, lite(col));
      g.set(x + 7, y - 5, P.RAW);
      g.set(x + 3, y - 7, P.RAW);
      g.set(x + 5, y - 6, P.RED);
      g.set(x + 6, y - 3, K);
      g.set(x + 7, y - 3, P.BONE);
      g.pts([[x + 5, y - 2], [x + 5, y]], P.RAW);
      g.pts([[x, y + 4], [x + 3, y + 4]], P.RAW);
    }
  };
  mk('rat-king-plague', 'rat king plague rats knotted tails tied together many rats one creature crown vermin swarm', 30, 16, (g, r) => {
    const G1 = hex('#5c5650'),
      G2 = hex('#474039'),
      G3 = hex('#6e6458');
    for (const [v, s] of [[g, 0], [g.flip(29), 1]]) {
      rat(v, r ? 15 : 19, r ? 6 : 4, s ? G2 : G3, r);
      v.line(15, 10, r ? 16 : 19, 7, P.RAW);
      v.line(15, 12, 20, 13, P.RAW);
      rat(v, r ? 20 : 19, 10, s ? G1 : G2, r);
    }
    g.oval(10, 8, 19, 14, P.RAW); // the knot of tails
    for (const [a, b, c2, d] of [[11, 10, 14, 9], [14, 13, 18, 10], [12, 13, 15, 11], [16, 9, 18, 13], [11, 12, 13, 13]]) g.line(a, b, c2, d, dark(P.RAW));
    g.pts([[13, 10], [16, 12]], lite(P.RAW));
    g.rect(13, 6, 16, 7, C.gold); // a crown someone gave it
    g.pts([[13, 5], [15, 5], [16, 5]], C.gold);
    g.set(14, 7, C.blood);
  }, { uh: 22 });
  mk('rat-plague-buboes', 'plague rat boils buboes sick vermin small bald swollen', 14, 9, (g, r) => {
    const G = hex('#5c5650'),
      B = hex('#8a6a78');
    g.line(3, r ? 6 : 5, 1, r ? 3 : 6, P.RAW);
    g.set(1, r ? 2 : 7, P.RAW);
    rat(g, 3, r ? 3 : 3, G, 0);
    if (r) {
      g.rect(8, 0, 11, 3, G);
      g.set(12, 2, P.RAW);
      g.set(11, 1, P.RED);
      g.rect(10, 4, 11, 5, K);
      g.pts([[10, 4], [11, 5]], P.BONE);
      g.set(8, -1, P.RAW);
    }
    g.oval(4, r ? 1 : 2, 6, r ? 3 : 4, B); // boils
    g.set(5, r ? 1 : 2, lite(B));
    g.pts([[7, 6], [3, 5]], B);
    g.set(7, 5, P.BILE);
  }, { uh: 12 });

  /* ---- the jester ---- */
  mk('jester-bell-skin', 'jester fool bells sewn into his skin motley grin stitched court clown wrong', 18, 36, (g, r) => {
    const WN = hex('#6b2f3a'),
      MU = hex('#8f7a3a'),
      SK = P.PALE;
    g.at(1, 2).man({
      skin: SK,
      top: SK,
      legs: MU,
      shoe: WN,
      arms: r ? 'up' : { l: 'down', r: 'hold' },
      face: 'none',
      body(v, yT, yL, yF) {
        v.rect(8, yL, 11, yF - 2, WN);
        v.row(yL, 4, 11, WN);
        for (const x of [4, 6, 8, 10]) v.set(x, yL + 1, MU);
        v.rect(8, yF - 1, 11, yF, MU);
        v.rect(4, yF - 1, 6, yF, WN);
        v.pts([[2, yF - 1], [13, yF - 1]], C.gold);
      },
      over(v, yT) {
        // bells stitched into the flesh
        for (const [x, y] of [[6, 14], [9, 15], [7, 17], [10, 18], [5, 19], [8, 20], [2, 16], [13, 15]]) {
          v.set(x, y - 1, vd(SK));
          v.set(x, y, C.gold);
        }
        // the cap, grown on
        v.row(2, 4, 11, WN);
        v.rect(3, 3, 7, 4, WN);
        v.rect(8, 3, 12, 4, MU);
        if (!r) {
          v.pts([[2, 3], [2, 4], [1, 4], [1, 5], [0, 5], [0, 6]], WN);
          v.pts([[13, 3], [13, 4], [14, 4], [14, 5], [15, 5], [15, 6]], MU);
          v.pts([[0, 7], [15, 7]], C.gold);
        } else {
          v.pts([[3, 2], [2, 1], [2, 0], [1, -1], [1, -2]], WN);
          v.pts([[12, 2], [13, 1], [13, 0], [14, -1], [14, -2]], MU);
          v.pts([[1, -3], [14, -3], [7, 1]], C.gold);
        }
        v.pts([[4, 8], [11, 8]], C.gold);
        if (!r) {
          v.pts([[6, 6], [9, 6]], K);
          v.row(9, 5, 10, K);
          v.pts([[4, 8], [11, 8]], K);
          v.pts([[6, 9], [8, 9], [10, 9]], C.white);
        } else {
          v.pts([[5, 6], [6, 6], [9, 6], [10, 6]], C.white);
          v.pts([[6, 6], [9, 6]], K);
          v.maw(5, 8, 10, 11, C.white);
          v.pts([[4, 7], [11, 7], [4, 9], [11, 9]], K);
          v.pts([[7, 12], [8, 12]], C.blood);
        }
      },
    });
  }, { uw: 24, uh: 40 });

  /* ---- the siege ogre ---- */
  mk('siege-ogre', 'large tall siege ogre giant battering ram wooden hoarding on its back arrows tusks brute monster', 32, 48, (g, r) => {
    const OG = hex('#7d7458'),
      W = C.wood;
    // the mantlet strapped to its back, full of arrows
    g.rect(6, 3, 25, 12, W);
    for (const x of [10, 15, 20]) g.col(x, 3, 12, C.woodDark);
    g.row(3, 6, 25, lite(W));
    g.row(7, 6, 25, IR);
    for (const [x, y] of [[8, 5], [18, 5], [23, 6]]) {
      g.line(x, y, x - 2, y - 3, C.woodPale);
      g.set(x - 2, y - 4, C.white);
    }
    g.rect(7, 36, 13, 46, dark(OG)); // legs
    g.rect(18, 36, 24, 46, dark(OG));
    g.rect(5, 45, 13, 46, OG);
    g.rect(18, 45, 26, 46, OG);
    g.pts([[5, 46], [7, 46], [9, 46], [20, 46], [22, 46], [24, 46]], P.BONED);
    g.oval(2, 10, 29, 25, OG); // shoulders
    g.oval(4, 16, 27, 39, OG); // belly
    g.row(31, 5, 26, IR); // an iron hoop, riveted to the flesh
    g.row(32, 5, 26, IRD);
    for (let x = 7; x < 26; x += 4) g.set(x, 31, ST);
    g.pts([[15, 27], [16, 27]], vd(OG));
    g.line(8, 20, 12, 22, dark(OG));
    g.line(23, 20, 19, 22, dark(OG));
    // the head, sunk between the shoulders
    g.rect(12, 7, 19, 12, OG);
    g.rect(11, 11, 20, 15, OG);
    g.row(7, 13, 18, lite(OG));
    g.pts([[13, 10], [18, 10]], P.YEL);
    g.row(9, 12, 19, dark(OG));
    if (!r) {
      g.row(13, 13, 18, K);
      g.pts([[12, 12], [12, 11], [19, 12], [19, 11]], P.BONE);
      g.rect(1, 17, 5, 35, OG); // left arm hanging
      g.col(1, 18, 34, lite(OG));
      g.rect(1, 34, 6, 39, OG);
      g.pts([[2, 39], [4, 39], [6, 39]], dark(OG));
      // the ram under the right arm
      g.rect(9, 26, 29, 30, W);
      g.row(26, 9, 29, lite(W));
      g.row(30, 9, 29, C.woodDark);
      g.rect(26, 25, 30, 31, IR);
      g.col(30, 26, 30, IRD);
      g.col(13, 26, 30, IR);
      g.col(20, 26, 30, IR);
      g.rect(24, 15, 28, 25, OG);
      g.rect(21, 24, 26, 28, OG);
      g.row(28, 21, 26, dark(OG));
    } else {
      g.maw(13, 12, 18, 15, P.BONE, { tongue: P.GUM });
      g.pts([[12, 12], [12, 10], [12, 11], [19, 12], [19, 11], [19, 10]], P.BONE);
      g.rect(1, -3, 5, 16, OG); // both arms up
      g.col(1, -3, 16, lite(OG));
      g.rect(26, -3, 30, 16, OG);
      g.rect(-3, -9, 34, -5, W); // the ram overhead
      g.row(-9, -3, 34, lite(W));
      g.row(-5, -3, 34, C.woodDark);
      g.rect(31, -10, 35, -4, IR);
      g.col(35, -9, -5, IRD);
      g.col(8, -9, -5, IR);
      g.col(22, -9, -5, IR);
      g.rect(0, -6, 6, -3, OG);
      g.rect(25, -6, 31, -3, OG);
      g.pts([[1, -6], [3, -6], [5, -6], [26, -6], [28, -6], [30, -6]], dark(OG));
    }
  }, { uw: 42, uh: 60 });

  /* ---- gallows fruit ---- */
  mk('gallows-fruit', 'large tall gallows fruit hanged men walking gibbet three corpses on one beam fused rope gallows tree monster', 32, 48, (g, r) => {
    const W = C.woodDark,
      F = P.CORPSE;
    g.rect(3, 2, 5, 45, W);
    g.col(3, 2, 45, lite(W));
    g.rect(3, 2, 29, 4, W);
    g.row(2, 3, 29, lite(W));
    g.line(6, 13, 14, 5, W);
    g.pts([[1, 46], [2, 46], [2, 45], [3, 46], [5, 46], [6, 46], [6, 45], [7, 46]], W); // the post has feet of its own
    const hang = (x, drop, col, tilt) => {
      const hy = 9 + drop,
        t = r ? 0 : tilt;
      g.col(x + 2, 5, hy, C.straw);
      // legs down to the ground: they walk it
      g.col(x + 1, hy + 16, 45, F);
      g.col(x + 3, hy + 16, 45, dark(F));
      g.pts([[x, 46], [x + 1, 46], [x + 3, 46], [x + 4, 46]], dark(F));
      g.rect(x, hy + 5, x + 4, hy + 16, col);
      g.col(x, hy + 6, hy + 16, lite(col));
      g.row(hy + 16, x, x + 4, dark(col));
      g.row(hy + 5, x + 1, x + 3, C.straw);
      g.rect(x + t, hy + (r ? -1 : 0), x + 4 + t, hy + 4 + (r ? -1 : 0), F);
      const ey = hy + (r ? 1 : 2);
      if (r) {
        g.pts([[x + 1, ey], [x + 3, ey]], P.YEL);
        g.rect(x + 1, ey + 1, x + 3, ey + 2, K);
        g.line(x, hy + 7, x - 2, hy + 3, F); // arms out
        g.line(x + 4, hy + 7, x + 7, hy + 4, F);
        g.pts([[x - 3, hy + 2], [x - 2, hy + 2], [x - 3, hy + 3], [x + 7, hy + 3], [x + 8, hy + 3], [x + 8, hy + 4]], lite(F));
      } else {
        g.pts([[x + 1 + t, ey], [x + 3 + t, ey]], K);
        g.set(x + 2 + t, ey + 2, vd(F));
        g.col(x - 1, hy + 6, hy + 13, dark(F));
        g.col(x + 5, hy + 6, hy + 13, dark(F));
      }
    };
    hang(9, 0, hex('#8a8068'), 1);
    hang(16, 4, hex('#6f6a6a'), -1);
    hang(23, 1, hex('#7a6850'), 1);
    if (!r) {
      // grown together at the shoulders
      g.rect(14, 16, 15, 18, F);
      g.rect(21, 17, 22, 19, F);
    }
  }, { uw: 36 });

  /* ---- the boar ---- */
  mk('boar-scythe-tusks', 'large long wild boar tusks like scythes giant hog bristles spears in its back beast monster', 46, 26, (g, r) => {
    const B = hex('#3f3630'),
      BL = hex('#56483c');
    g.line(15, 7, 12, 1, C.woodPale); // broken spears left in it
    g.line(21, 5, 20, 1, C.woodPale);
    g.pts([[3, 9], [2, 8], [1, 9], [1, 10]], B);
    for (const x of [8, 13]) {
      g.rect(x, 18, x + 2, 22, dark(B));
      g.rect(x, 23, x + 2, 24, K);
    }
    if (!r)
      for (const x of [27, 31]) {
        g.rect(x, 18, x + 2, 22, dark(B));
        g.rect(x, 23, x + 2, 24, K);
      }
    else
      for (const x of [27, 31]) {
        g.limb([[x, 18], [x + 4, 22]], 3, dark(B));
        g.rect(x + 4, 22, x + 6, 23, K);
      }
    g.oval(3, 6, 34, 20, B);
    g.oval(21, 3, 37, 19, B);
    g.oval(6, 8, 18, 13, BL);
    g.oval(23, 5, 32, 9, BL);
    g.ridge(5, 35, r ? 4 : 2, K, 2, 4);
    const hy = r ? -2 : 0;
    const h = g.at(0, hy);
    h.poly([[31, 8], [38, 9], [43, 14], [43, 17], [36, 20 - hy], [31, 19 - hy]], BL);
    h.rect(42, 14, 44, 17, hex('#6b5450'));
    h.set(44, 15, K);
    h.poly([[31, 5], [33, 4], [34, 8], [32, 8]], B);
    h.pts([[37, 11], [38, 11]], K);
    h.set(37, 11, P.RED);
    if (r) {
      g.poly([[36, 18], [43, 19], [42, 22], [37, 21]], BL);
      g.maw(37, 17, 42, 19, P.BONE, { in: P.GUM });
      g.pts([[40, 23], [41, 24]], P.EYE);
      h.set(38, 11, P.YEL);
    }
    // the tusks: two long sickles of bone
    h.worm([[36, 18], [39, 17], [41, 12], [38, 6]], 1.1, 0.5, P.BONED);
    h.worm([[39, 18], [43, 17], [44, 11], [41, 5]], 1.3, 0.5, P.BONE);
  }, { uw: 48, uh: 30 });

  /* ---- the leper knight ---- */
  mk('leper-knight', 'leper knight bandaged crusader rotting face clapper bell wrapped mail sword undead', 18, 35, (g, r) => {
    const SUR = hex('#a9a48e'),
      BD = P.SHROUD;
    g.at(1, 1).man({
      skin: BD,
      top: SUR,
      sleeve: IR,
      legs: IR,
      shoe: IRD,
      coat: SUR,
      coatLen: 6,
      arms: { l: 'hold', r: r ? 'up' : 'down' },
      face: 'none',
      body(v, yT, yL) {
        v.rect(7, yT + 2, 8, yL + 3, hex('#7a4a44'));
        v.row(yT + 5, 5, 10, hex('#7a4a44'));
        v.ragged(4, 11, yL + 6, 2, 4);
      },
      over(v) {
        v.row(1, 5, 10, ST);
        v.rect(4, 2, 11, 3, ST);
        v.row(4, 2, 13, dark(ST));
        v.row(1, 6, 8, lite(ST));
        for (const y of [6, 8, 10]) v.row(y, 4, 11, dark(BD));
        v.rect(5, 19, 7, 21, C.brass); // the clapper
        v.set(6, 22, IRD);
        v.set(5, 19, lite(C.brass));
        if (!r) {
          v.set(6, 7, K);
          v.col(14, 23, 31, lite(ST));
          v.row(22, 13, 15, C.brass);
        } else {
          v.rect(5, 5, 10, 10, hex('#5a5346')); // unwrapped: what the wrappings held together
          v.rect(7, 7, 8, 8, K);
          v.set(6, 6, C.white);
          v.rect(9, 5, 10, 6, K);
          for (const x of [5, 7, 9]) v.set(x, 10, P.BONE);
          for (const x of [6, 8, 10]) v.set(x, 10, K);
          v.strands(3, 5, 9, 4, 9, BD, 3);
          v.col(12, 10, 16, BD);
          v.col(15, -4, 1, lite(ST));
          v.row(2, 14, 16, C.brass);
        }
      },
    });
  }, { uw: 22, uh: 40 });

  /* ---- the wyrm in the moat ---- */
  mk('moat-wyrm', 'large long wyrm in the moat water serpent eel dragon coils rising from the water monster', 48, 24, (g, r) => {
    const W = hex('#3d4f4a'),
      E = hex('#a8a888');
    g.oval(1, 18, 46, 22, C.water);
    if (!r) {
      g.worm([[6, 20], [9, 8], [15, 6], [20, 12], [22, 20]], 3, 3, W);
      g.worm([[27, 20], [29, 10], [34, 8], [38, 13]], 3, 2.6, W);
      g.ridge(7, 20, 2, dark(W), 2);
      g.ridge(28, 35, 2, dark(W), 2, 2);
      g.oval(35, 11, 45, 17, W);
      g.row(11, 37, 42, lite(W));
      g.set(41, 13, P.YEL);
      g.row(16, 39, 45, K);
      g.pts([[40, 15], [42, 15], [44, 15]], P.BONE);
      g.line(45, 15, 46, 18, E);
      g.line(43, 17, 44, 19, E);
    } else {
      g.worm([[4, 20], [7, 12], [12, 11], [16, 20]], 3, 3, W);
      g.worm([[22, 20], [23, 4], [27, -9], [34, -11], [38, -7]], 3.6, 3, W);
      g.ridge(5, 15, 2, dark(W), 2);
      for (let y = -6; y < 18; y += 3) g.line(19, y, 17, y - 2, dark(W));
      g.poly([[35, -12], [45, -8], [46, -6], [37, -5]], W); // jaws
      g.poly([[36, -2], [45, 1], [44, 3], [35, 1]], W);
      g.poly([[37, -5], [46, -6], [45, 0], [36, -2]], K);
      for (const x of [39, 41, 43, 45]) g.set(x, -5, P.BONE);
      for (const x of [38, 40, 42, 44]) g.set(x, x > 40 ? 0 : -1, P.BONE);
      g.rect(39, -10, 40, -9, P.YEL);
      g.set(40, -9, K);
      g.line(37, -3, 41, -2, P.GUM);
      g.line(33, -13, 31, -16, E);
      g.line(36, -13, 35, -16, E);
    }
    g.clearRect(0, 23, 47, 26);
    for (const [x0, x1, y] of [[3, 12, 19], [18, 30, 20], [34, 44, 19], [10, 24, 21]]) g.row(y, x0, x1, lite(C.water));
    g.pts([[12, 9], [13, 10], [12, 11]], C.moss);
  }, { uh: 42 });

  /* ---- the basilisk ---- */
  mk('basilisk', 'basilisk cockatrice rooster headed serpent lizard many legs deadly stare comb monster', 26, 20, (g, r) => {
    const G = hex('#56633e'),
      CB = hex('#8a3a34');
    g.worm([[9, 14], [5, 16], [2, 13], [4, 9], [7, 10]], 1.6, 0.6, G);
    if (!r) {
      for (const x of [8, 11, 14, 17]) {
        g.line(x, 14, x - 1, 17, dark(G));
        g.row(18, x - 2, x, dark(G));
      }
      g.worm([[8, 14], [13, 12], [18, 12]], 2.6, 2.4, G);
      g.worm([[18, 11], [19, 7], [20, 5]], 2, 1.7, G);
      g.rect(19, 3, 22, 6, G);
      g.pts([[23, 5], [24, 5]], P.YEL);
      g.set(23, 6, dark(P.YEL));
      g.pts([[19, 2], [21, 2], [20, 1], [22, 2]], CB);
      g.pts([[22, 7], [22, 8]], CB);
      g.set(21, 4, P.YEL);
      g.ridge(8, 17, 1, dark(G), 3);
    } else {
      for (const x of [8, 11]) {
        g.line(x, 14, x - 1, 17, dark(G));
        g.row(18, x - 2, x, dark(G));
      }
      g.worm([[8, 15], [13, 13], [15, 6], [16, -1]], 2.6, 2, G);
      for (const y of [10, 6]) {
        g.line(16, y, 20, y + 2, dark(G)); // forelegs clawing
        g.pts([[21, y + 1], [21, y + 3]], P.BONE);
      }
      g.rect(14, -5, 19, 0, G);
      g.pts([[20, -4], [21, -4], [22, -3]], P.YEL);
      g.pts([[20, -1], [21, 0]], P.YEL);
      g.rect(19, -3, 20, -2, K);
      g.line(20, -2, 23, -1, P.RED);
      for (const [x, y] of [[14, -6], [16, -6], [18, -6], [15, -7], [17, -8], [16, -7], [13, -5]]) g.set(x, y, CB);
      g.pts([[19, 1], [19, 2], [18, 2]], CB);
      g.rect(16, -4, 18, -2, P.YEL); // the eye that kills
      g.col(17, -4, -2, K);
      g.pts([[12, -3], [12, -1], [11, 1], [12, 3]], dark(G));
    }
  }, { uw: 28, uh: 30 });

  /* ---- the thing from the rack ---- */
  mk('rack-stretched-thing', 'large long tortured thing from the rack stretched man too long limbs ropes crawling prisoner horror', 48, 18, (g, r) => {
    const S = hex('#b7a892'),
      D = dark(S);
    g.line(1, 14, 6, 16, C.straw); // the ropes, still on it
    g.limb([[13, 12], [7, 14], [2, 15]], 2, S);
    g.limb([[12, 13], [6, 16], [3, 16]], 1, D);
    g.rect(2, 13, 3, 14, C.straw);
    if (!r) {
      g.rect(12, 10, 36, 13, S);
      g.row(10, 12, 36, lite(S));
      for (let x = 14; x < 36; x += 2) g.set(x, 9, S);
      for (let x = 24; x < 35; x += 2) g.col(x, 11, 13, D);
      g.row(13, 12, 23, D);
      g.limb([[32, 10], [28, 3], [26, 16]], 2, S); // one arm bent up behind it
      g.pts([[25, 16], [27, 16]], S);
      g.rect(26, 11, 27, 12, C.straw);
      g.limb([[35, 12], [40, 14], [45, 15]], 2, S); // the other pulls it along
      g.pts([[46, 14], [46, 16], [45, 13]], S);
      g.rect(41, 14, 42, 15, C.straw);
      g.limb([[35, 10], [37, 8]], 2, S);
      g.rect(37, 3, 42, 8, S);
      g.row(3, 38, 41, hex('#4a4038'));
      g.col(37, 3, 6, hex('#4a4038'));
      g.set(41, 5, K);
      g.row(7, 39, 42, K);
    } else {
      g.tube([[10, 13], [22, 4], [33, -5]], 2.2, 2, S);
      for (let i = 0; i < 9; i++) g.set(13 + i * 2.3, 9 - i * 1.9, S);
      for (let i = 3; i < 9; i++) g.line(15 + i * 2.2, 12 - i * 1.8, 16 + i * 2.2, 14 - i * 1.8, D);
      g.limb([[32, -5], [29, 2], [34, 8], [30, 16]], 2, S);
      g.limb([[34, -6], [41, -1], [38, 7], [45, 16]], 2, S);
      g.pts([[29, 16], [31, 16], [44, 16], [46, 16], [46, 15]], S);
      g.rect(33, 6, 34, 7, C.straw);
      g.line(33, 8, 32, 13, C.straw);
      g.limb([[34, -7], [36, -10]], 2, S);
      g.rect(35, -15, 40, -10, S);
      g.row(-15, 36, 39, hex('#4a4038'));
      g.pts([[37, -13], [39, -13]], K);
      g.set(39, -13, P.YEL);
      g.rect(37, -11, 40, -5, K); // the jaw hangs to the chest
      g.rect(36, -5, 40, -4, S);
      g.pts([[37, -11], [39, -11], [38, -6], [40, -6]], P.BONE);
    }
  }, { uh: 36 });

  /* ---- headless, on foot ---- */
  mk('headless-footman', 'headless horseman on foot carries his own head by the hair rider no head ghost cloak spurs', 24, 29, (g, r) => {
    const CO = hex('#2a2630'),
      HA = hex('#231c18');
    const m = g.at(3, -8);
    m.man({
      head: false,
      top: CO,
      legs: hex('#3a3440'),
      shoe: IRD,
      tl: 12,
      ll: 12,
      coat: CO,
      coatLen: 7,
      belt: C.brass,
      hand: P.PALE,
      arms: { l: 'down', r: r ? 'up' : 'down' },
      over(v) {
        v.rect(4, 10, 11, 11, hex('#5a2630')); // the collar, and nothing in it
        v.row(10, 5, 10, K);
        v.pts([[7, 9], [8, 9], [7, 10]], P.BONE);
        v.pts([[5, 14], [5, 16], [5, 18]], C.brass);
        v.pts([[3, 34], [12, 34]], C.brass);
        v.line(2, 25, 0, 33, C.woodDark); // the crop
        const hx = 11,
          hy = r ? -6 : 27;
        if (!r) v.col(13, 25, 27, HA);
        v.rect(hx, hy, hx + 5, hy + 5, P.PALE);
        v.row(hy, hx, hx + 5, HA);
        v.col(hx, hy, hy + 3, HA);
        v.col(hx + 5, hy, hy + (r ? 8 : 2), HA);
        if (r) {
          v.col(hx - 1, hy + 1, hy + 7, HA);
          v.pts([[hx + 2, hy + 2], [hx + 4, hy + 2]], P.YEL);
          v.rect(hx + 2, hy + 4, hx + 4, hy + 5, K);
          v.pts([[7, 7], [8, 6], [7, 5], [9, 4], [8, 8]], P.DUSK);
        } else {
          v.pts([[hx + 2, hy + 2], [hx + 4, hy + 2]], K);
          v.row(hy + 4, hx + 2, hx + 4, vd(P.PALE));
        }
      },
    });
  }, { uh: 45 });

  /* ---- the witch-finder ---- */
  mk('witch-finder-nail-teeth', 'witch finder witchfinder inquisitor nails for teeth iron teeth black coat tall hat pricker hunter', 18, 38, (g, r) => {
    const BL = hex('#221f28'),
      SK = hex('#b4ad9c');
    g.at(1, 4).man({
      skin: SK,
      top: BL,
      robe: BL,
      arms: { l: r ? 'reach' : 'down', r: 'hold' },
      face: 'none',
      over(v) {
        v.row(12, 5, 10, C.white);
        v.rect(6, 13, 7, 14, C.white);
        v.rect(8, 13, 9, 14, dark(C.white));
        v.row(3, 1, 14, BL);
        v.rect(4, -2, 11, 2, BL);
        v.col(4, -2, 2, lite(BL));
        v.row(2, 4, 11, hex('#3a3440'));
        v.rect(7, 1, 8, 2, C.gold);
        v.rect(5, 6, 6, 6, K);
        v.rect(9, 6, 10, 6, K);
        v.rect(7, 17, 10, 20, hex('#4a3226')); // the book of names
        v.col(7, 17, 20, C.brass);
        if (!r) {
          v.row(9, 5, 10, K);
          v.pts([[5, 9], [7, 9], [9, 9]], ST);
          v.pts([[6, 10], [8, 10], [10, 10]], ST);
        } else {
          v.rect(5, 8, 10, 13, K);
          v.set(4, 9, K);
          v.set(11, 9, K);
          for (const x of [5, 7, 9]) v.col(x, 8, 9, lite(ST));
          for (const x of [6, 8, 10]) v.col(x, 12, 13, ST);
          v.row(11, 6, 9, P.GUM);
          v.pts([[5, 6], [9, 6]], P.RED);
          v.line(-5, 17, -6, 13, lite(ST)); // the pricking needle
          v.set(-5, 17, C.woodDark);
        }
      },
    });
  }, { uw: 24, ux: 6 });

  /* ---- the tapestry ---- */
  mk('tapestry-crawler', 'tapestry that crawls woven face hanging cloth alive wall hanging comes down fringe fingers', 22, 26, (g, r) => {
    const T = hex('#6f4a3a'),
      Y = hex('#9a8448'),
      F = hex('#c2b490');
    g.row(2, 1, 20, C.woodDark);
    g.pts([[1, 1], [20, 1], [1, 3], [20, 3]], C.brass);
    g.rect(3, 3, 18, 20, T);
    g.frame(3, 3, 18, 20, Y);
    g.col(4, 4, 19, lite(T));
    g.strands(3, 18, 21, 1, 3, Y, 6);
    for (const x of [3, 4, 5, 16, 17, 18]) g.col(x, 21, 24, dark(Y)); // it walks on its fringe
    g.pts([[2, 24], [6, 24], [15, 24], [19, 24]], dark(Y));
    g.pts([[8, 5], [10, 4], [12, 5], [9, 5], [11, 5]], Y); // the crowned lady woven into it
    if (!r) {
      g.oval(7, 6, 14, 14, F);
      g.pts([[9, 9], [12, 9]], K);
      g.row(12, 10, 11, vd(F));
      g.rect(8, 15, 13, 19, hex('#4a5a6a'));
      g.col(6, 7, 13, hex('#5a3a2a'));
      g.col(15, 7, 13, hex('#5a3a2a'));
    } else {
      g.oval(5, 5, 16, 18, F); // she pushes out of the weave
      g.col(5, 9, 14, lite(F));
      g.rect(8, 8, 9, 9, K);
      g.rect(12, 8, 13, 9, K);
      g.pts([[9, 9], [13, 9]], P.RED);
      g.maw(7, 12, 14, 16, C.cream, { in: hex('#2a1418') });
      g.limb([[3, 9], [0, 6], [-2, 2]], 2, T); // arms of cloth
      g.limb([[17, 9], [21, 6], [23, 2]], 2, T);
      g.pts([[-3, 1], [-2, 0], [-1, 1], [22, 1], [23, 0], [24, 1]], Y);
    }
  }, { uw: 30, uh: 28 });

  /* ---- the hound ---- */
  mk('hound-two-headed', 'hunting hound two heads stitched dog kennel lean greyhound second head sewn on beast', 28, 20, (g0, r) => {
    const H = hex('#7a6a54'),
      D = dark(H),
      g = g0.at(0, 2);
    g.line(5, 7, 2, r ? 3 : 11, H);
    g.set(1, r ? 2 : 10, H);
    g.limb([[6, 9], [5, 13], [7, 16]], 2, D);
    g.limb([[9, 10], [9, 16]], 2, H);
    g.limb([[17, 12], [17, 16]], 2, D);
    g.limb([[19, 12], [20, 16]], 2, H);
    g.pts([[10, 16], [21, 16], [22, 16]], H);
    g.poly([[5, 7], [14, 5], [21, 6], [21, 12], [16, 13], [9, 10], [5, 10]], H);
    g.row(6, 8, 19, lite(H));
    g.pts([[13, 9], [15, 10], [17, 9]], D); // ribs
    if (r) g.ridge(16, 20, 2, D, 2);
    // the first head
    g.poly([[19, 6], [22, 3], [24, 4], [22, 9]], H);
    g.rect(21, 2, 24, 5, H);
    g.rect(24, 3, 26, 5, H);
    g.pts([[21, 3], [20, 4], [20, 5]], D);
    g.set(23, 3, r ? P.RED : K);
    g.set(26, 3, K);
    g.line(19, 7, 21, 9, IRD);
    g.pts([[19, 6], [21, 8]], ST);
    // the second, sewn on behind the shoulders, looking back
    g.poly([[11, 6], [10, 1], [13, 1], [16, 6]], hex('#8a7a66'));
    g.rect(8, -1, 13, 2, hex('#8a7a66'));
    g.rect(5, 0, 8, 2, hex('#8a7a66'));
    g.pts([[13, -1], [14, 0], [14, 1]], D);
    g.set(10, 0, P.EYE);
    g.set(5, 0, K);
    for (const x of [10, 12, 14, 16]) g.set(x, 6, K);
    if (r) {
      g.rect(23, 6, 26, 6, K);
      g.rect(23, 7, 25, 7, H);
      g.pts([[24, 6], [26, 6]], P.BONE);
      g.rect(5, 3, 8, 3, K);
      g.rect(6, 4, 8, 4, hex('#8a7a66'));
      g.pts([[5, 3], [7, 3]], P.BONE);
      g.set(26, 8, P.EYE);
      g.set(10, 0, P.RED);
    }
  }, { uh: 22 });

  /* ---- the falcon ---- */
  mk('falcon-hooded-hands', 'hooded falcon hawk with human hands for feet bird of prey small wrong mews hunting bird', 12, 14, (g, r) => {
    const F = hex('#5e5244'),
      HD = C.wood;
    if (r) {
      for (const v of [g, g.flip(11)]) {
        v.poly([[8, 5], [16, 2], [17, 4], [14, 8], [9, 10]], dark(F));
        v.line(8, 5, 16, 2, F);
        v.pts([[17, 5], [15, 8], [13, 9], [16, 6]], F);
      }
    }
    g.oval(3, 4, 8, 11, F);
    g.pts([[4, 7], [6, 8], [5, 10], [7, 6]], C.cream);
    g.col(3, 6, 9, lite(F));
    g.rect(4, 2, 7, 5, HD);
    g.pts([[5, 1], [6, 1]], C.wine);
    g.set(8, 4, P.YEL);
    g.set(8, 5, dark(P.YEL));
    g.rect(5, 11, 6, 12, dark(F));
    g.pts([[2, 12], [3, 12], [4, 12], [3, 11], [7, 12], [8, 12], [9, 12], [8, 11]], P.PALE); // hands where the feet should be
    g.pts([[9, 10], [10, 11]], C.woodDark);
    if (r) {
      g.col(5, 2, 5, K); // the hood splits
      g.rect(5, 3, 6, 4, P.YEL);
      g.set(6, 3, K);
      g.set(8, 6, K);
      g.set(8, 7, dark(P.YEL));
    }
  }, { uw: 26, uh: 16 });

  /* ---- the man in the stocks ---- */
  mk('stocks-prisoner-fused', 'prisoner grown into the stocks pillory man carrying the board hands through the holes fused wood', 24, 26, (g, r) => {
    const W = C.wood,
      S = hex('#b5a58c'),
      T = hex('#5c4a38');
    g.rect(8, 13, 15, 19, T);
    g.col(8, 13, 19, lite(T));
    g.rect(8, 20, 10, 23, S);
    g.rect(13, 20, 15, 23, dark(S));
    g.row(24, 7, 10, S);
    g.row(24, 13, 16, S);
    g.ragged(8, 15, 19, 2, 2);
    g.rect(1, 3, 22, 12, W);
    g.row(3, 1, 22, lite(W));
    g.row(12, 1, 22, C.woodDark);
    g.row(7, 1, 22, C.woodDark);
    g.col(1, 3, 12, IR);
    g.col(22, 3, 12, IR);
    g.rect(20, 6, 21, 8, C.brass);
    for (const x of [3, 17]) {
      g.rect(x - 1, 5, x + 3, 9, K);
      g.rect(x, 6, x + 2, 8, S);
      g.pts([[x, 9], [x + 2, 9], [x + 1, 10]], S);
    }
    g.rect(8, 4, 15, 12, K);
    g.rect(9, 5, 14, 10, S);
    g.row(11, 10, 13, S);
    g.pts([[9, 4], [11, 4], [12, 4], [14, 5], [9, 5]], hex('#4a4038'));
    g.pts([[8, 12], [15, 12], [7, 13], [16, 13]], W); // the wood has grown into his neck
    if (!r) {
      g.pts([[10, 7], [13, 7]], K);
      g.row(9, 11, 12, vd(S));
    } else {
      g.rect(10, 7, 10, 7, P.YEL);
      g.set(13, 7, P.YEL);
      g.rect(10, 9, 13, 11, K);
      g.pts([[10, 9], [12, 9], [11, 11], [13, 11]], P.BONE);
      for (const v of [g, g.flip(23)]) {
        v.limb([[3, 8], [-1, 13], [1, 18]], 2, S); // more arms than holes
        v.pts([[0, 19], [2, 19], [1, 20]], S);
        v.col(3, 0, 4, S);
        v.pts([[2, -1], [3, -2], [4, -1], [5, 1], [5, 2]], S);
      }
    }
  }, { uw: 30, uh: 30 });
};
