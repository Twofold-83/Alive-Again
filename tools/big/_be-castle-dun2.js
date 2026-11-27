/* Castle and dungeon creatures, second half. See be-castle.js. */
module.exports = (k, mk) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, P, vd, fin } = k;
  const ST = C.steel,
    IR = C.iron,
    IRD = C.ironDark;

  mk('chain-drake-starved', 'large long chained drake starved dragon on a chain wingless ribs clipped wings iron collar dungeon guard beast', 48, 24, (g, r) => {
    const D = hex('#5a6050'),
      DL = hex('#7a8068'),
      DD = dark(D);
    g.col(2, 15, 22, IRD); // the stake
    g.rect(1, 14, 3, 15, IR);
    if (!r) {
      g.chain(3, 22, 36, 22, IR);
      g.chain(33, 14, 35, 22, IR);
    } else g.chain(3, 15, 33, 3, IR);
    g.worm([[13, 13], [8, 18], [4, 21], [9, 21]], 2, 0.6, D);
    g.limb([[14, 14], [11, 18], [14, 22]], 2, DD);
    g.limb([[25, 14], [27, 18], [25, 22]], 2, DD);
    g.oval(11, 8, 29, 16, D);
    g.limb([[17, 15], [15, 19], [18, 22]], 2, D);
    g.limb([[28, 14], [30, 18], [29, 22]], 2, D);
    g.pts([[15, 22], [16, 22], [20, 22], [26, 22], [27, 22], [31, 22]], P.BONED);
    for (const x of [16, 18, 20, 22, 24, 26]) g.line(x, 10, x - 1, 15, DD);
    g.row(8, 14, 26, DL);
    g.ridge(12, 28, 2, DL, 2);
    g.line(21, 8, 19, r ? 2 : 4, P.BONED); // what is left of the wings
    g.line(24, 8, 25, r ? 1 : 3, P.BONED);
    g.pts([[19, r ? 1 : 3], [25, r ? 0 : 2]], P.BONE);
    if (!r) {
      g.worm([[28, 11], [34, 12], [38, 15], [40, 17]], 2.2, 1.8, D);
      g.col(32, 9, 14, IR);
      g.col(33, 9, 14, lite(IR));
      g.poly([[38, 14], [45, 16], [46, 19], [40, 20], [37, 18]], D);
      g.row(14, 39, 42, DL);
      g.set(41, 16, P.YEL);
      g.row(19, 41, 46, K);
      g.pts([[42, 18], [44, 18], [46, 18]], P.BONE);
    } else {
      g.worm([[28, 11], [33, 6], [34, -2], [38, -6]], 2.2, 1.8, D);
      g.row(2, 32, 36, IR);
      g.row(3, 32, 36, lite(IR));
      g.poly([[37, -9], [45, -7], [46, -5], [38, -4]], D);
      g.poly([[38, -2], [45, 0], [44, 2], [37, 0]], D);
      g.poly([[38, -4], [46, -5], [45, 0], [38, -2]], K);
      for (const x of [40, 42, 44]) g.set(x, -4, P.BONE);
      for (const x of [41, 43]) g.set(x, -1, P.BONE);
      g.pts([[39, -3], [40, -3], [39, -2]], C.flame);
      g.set(41, -3, C.flameLight);
      g.rect(40, -8, 41, -7, P.YEL);
      g.set(41, -7, K);
      g.pts([[36, -11], [34, -10], [38, -11]], DL);
    }
  }, { uh: 38 });

  mk('chain-wraith', 'chain wraith prisoner made of chains and manacles iron mask scold bridle empty shackles ghost', 16, 34, (g, r) => {
    const I = IR,
      L = lite(ST);
    g.frame(4, 2, 11, 9, I); // the bridle: a cage for a head, and no head
    g.row(5, 4, 11, I);
    g.col(7, 2, 9, IRD);
    g.row(2, 5, 10, L);
    g.pts([[5, 4], [9, 4]], r ? P.RED : P.EYE);
    if (r) g.pts([[5, 7], [6, 8], [9, 8], [10, 7], [8, 7]], L);
    g.rect(5, 10, 10, 11, I);
    g.row(10, 5, 10, L);
    for (const [x, e] of [[5, -1], [7, 0], [8, 0], [10, 1]]) g.chain(x, 12, x + e, 21, I);
    g.row(22, 4, 11, I);
    g.row(23, 4, 11, IRD);
    for (const v of [g, g.flip(15)]) {
      if (!r) {
        v.chain(5, 11, 2, 20, I);
        v.frame(1, 21, 3, 23, L);
      } else {
        v.chain(5, 11, -1, 5, I);
        v.chain(-1, 5, -4, 11, I);
        v.pts([[-5, 12], [-5, 13], [-5, 14], [-4, 15], [-3, 14], [-3, 12]], L); // the manacles gape
      }
    }
    for (const x of [5, 10]) {
      g.chain(x, 24, x, 29, I);
      g.frame(x - 1, 30, x + 1, 32, L);
    }
    g.oval(12, 29, 14, 32, IRD);
    g.set(12, 29, I);
  }, { uw: 28, uh: 34 });

  mk('lich-crowned', 'lich dead king sorcerer skeleton in a robe crown phylactery glowing undead wizard', 16, 36, (g, r) => {
    const RB = hex('#3a2c44'),
      GL = hex('#8fd0a0');
    g.at(0, 3).man({
      skin: P.BONE,
      face: 'skull',
      eye: r ? GL : null,
      top: RB,
      robe: RB,
      hand: P.BONE,
      arms: r ? 'up' : { l: 'down', r: 'hold' },
      body(v, yT, yL, yF) {
        v.ragged(3, 12, yF, 3, 7);
        v.col(5, yT + 1, yF - 4, hex('#6a5a2a'));
        if (r) {
          v.rect(6, yT + 2, 10, yT + 9, K); // the robe falls open
          v.ribs(8, yT + 2, 4, 2, P.BONE);
          v.pts([[7, yT + 5], [9, yT + 5], [8, yT + 7]], GL);
        }
      },
      over(v, yT) {
        v.row(3, 4, 11, C.gold);
        v.pts([[4, 2], [6, 2], [9, 2], [11, 2], [6, 1], [9, 1]], C.gold);
        v.set(7, 3, C.blood);
        v.pts([[3, 11], [3, 12], [12, 11], [12, 12]], lite(RB));
        if (!r) {
          v.rect(8, 14, 9, 16, hex('#4a7a5a'));
          v.set(8, 14, GL);
          v.row(13, 8, 9, C.brass);
        } else {
          v.rect(6, 10, 9, 12, K);
          v.row(13, 6, 9, P.BONE);
          v.pts([[6, 12], [8, 12]], P.BONED);
          for (const x of [0, 15]) {
            v.rect(x - 1, -3, x + 1, -2, GL);
            v.pts([[x, -4], [x, -1]], hex('#4a7a5a'));
          }
        }
      },
    });
  }, { uw: 24, uh: 40 });

  mk('owlbear-moulting', 'owlbear owl headed bear moulting bald patches great claws head turned upside down dungeon beast', 24, 28, (g, r) => {
    const F = hex('#5a4634'),
      FL = hex('#7a6248'),
      D = hex('#c2b490'),
      BK = hex('#8a7a4a');
    g.rect(6, 21, 10, 25, dark(F));
    g.rect(13, 21, 17, 25, dark(F));
    g.rect(5, 25, 10, 26, F);
    g.rect(13, 25, 18, 26, F);
    g.pts([[5, 26], [7, 26], [9, 26], [14, 26], [16, 26], [18, 26]], P.BONE);
    for (const v of [g, g.flip(23)]) {
      if (!r) {
        v.rect(2, 12, 5, 20, F);
        v.col(2, 13, 20, lite(F));
        v.claws(2, 21, 2, 1, P.BONE, 3, 3);
      } else {
        v.limb([[4, 12], [0, 8], [-2, 3]], 3, F);
        v.pts([[-3, 2], [-3, 1], [-1, 1], [-1, 0], [1, 2], [1, 1]], P.BONE);
      }
    }
    g.oval(4, 9, 19, 24, F);
    g.speckle(4, 9, 19, 24, FL, 4, 3);
    g.oval(8, 15, 12, 20, P.RAW); // bald, sore
    g.oval(15, 12, 17, 14, P.RAW);
    g.pts([[9, 17], [11, 18], [16, 13]], dark(P.RAW));
    g.oval(5, 2, 18, 11, F);
    g.oval(6, 3, 11, 9, D);
    g.oval(12, 3, 17, 9, D);
    if (!r) {
      g.pts([[5, 2], [5, 1], [6, 1], [18, 2], [18, 1], [17, 1]], F);
      g.oval(7, 4, 10, 7, P.YEL);
      g.rect(8, 5, 9, 6, K);
      g.oval(13, 4, 16, 7, P.YEL);
      g.rect(14, 5, 15, 6, K);
      g.rect(11, 7, 12, 9, BK);
      g.set(11, 10, dark(BK));
    } else {
      g.pts([[5, 11], [5, 12], [6, 12], [18, 11], [18, 12], [17, 12]], F); // the head has gone right round
      g.oval(7, 6, 10, 9, P.YEL);
      g.rect(8, 7, 9, 8, K);
      g.set(8, 7, P.RED);
      g.oval(13, 6, 16, 9, P.YEL);
      g.rect(14, 7, 15, 8, K);
      g.set(14, 7, P.RED);
      g.rect(10, 2, 13, 5, K);
      g.pts([[10, 2], [13, 2], [10, 3], [13, 3], [11, 6], [12, 6]], BK);
      g.pts([[11, 3], [12, 4]], P.GUM);
    }
  }, { uw: 30, uh: 30 });

  mk('jailer-key-fingers', 'jailer gaoler fat turnkey keys for fingers keyhole in his face key ring through the belly dungeon keeper', 22, 34, (g, r) => {
    const S = hex('#b09a84'),
      J = hex('#4a3a30');
    g.rect(6, 26, 9, 31, hex('#2a2630'));
    g.rect(12, 26, 15, 31, hex('#2a2630'));
    g.rect(5, 31, 9, 32, IRD);
    g.rect(12, 31, 16, 32, IRD);
    for (const v of [g, g.flip(21)]) {
      if (!r) {
        v.rect(1, 13, 3, 21, J);
        v.rect(1, 22, 3, 23, S);
        [1, 2, 3].forEach((x, i) => v.col(x, 24, 28 + (i % 2), i % 2 ? C.brass : IR));
        v.pts([[0, 28], [4, 29]], IR);
      } else {
        v.limb([[3, 13], [-1, 9], [-3, 4]], 3, J);
        v.rect(-4, 1, -1, 3, S);
        [[-7, -4], [-5, -6], [-2, -6], [1, -4]].forEach(([x, y], i) => {
          v.line(-3 + i, 1, x, y, i % 2 ? C.brass : lite(IR));
          v.set(x + 1, y, i % 2 ? C.brass : lite(IR));
        });
      }
    }
    g.oval(3, 11, 18, 27, J);
    g.oval(6, 17, 15, 26, S);
    g.col(6, 19, 24, lite(S));
    g.row(17, 7, 14, dark(J));
    for (const [x, y] of [[9, 20], [10, 19], [11, 19], [12, 20], [12, 22], [11, 23], [10, 23], [9, 22]]) g.set(x, y, IR); // the ring goes through him
    g.pts([[9, 21], [12, 21]], hex('#8a5a58'));
    g.col(10, 24, 28, C.brass);
    g.col(12, 24, 27, IR);
    g.pts([[11, 28], [13, 27]], C.brass);
    g.rect(7, 3, 14, 10, S);
    g.row(2, 8, 13, S);
    g.rect(6, 8, 15, 11, S);
    g.col(7, 3, 9, lite(S));
    g.pts([[9, 5], [12, 5]], K);
    g.rect(10, 6, 11, 8, K); // where the mouth should be
    g.row(9, 9, 12, K);
    if (r) {
      g.set(10, 7, P.YEL);
      g.pts([[9, 5], [12, 5]], P.RED);
    }
  }, { uw: 32, uh: 38 });

  mk('gorgon-blindfold', 'gorgon medusa blindfolded snakes for hair stone gaze woman scaled dungeon', 16, 35, (g, r) => {
    const GS = hex('#8f9a84'),
      GW = hex('#5a5a4a'),
      SN = hex('#4a5e36');
    g.at(0, 2).man({
      skin: GS,
      top: GW,
      robe: GW,
      arms: r ? 'reach' : 'down',
      face: 'none',
      body(v, yT, yL, yF) {
        v.ragged(3, 12, yF, 2, 9);
        v.pts([[6, yT + 3], [9, yT + 6], [6, yT + 9]], dark(GW));
      },
      over(v) {
        v.rect(4, 2, 11, 3, SN);
        const tips = r ? [[-3, 3], [-1, -3], [3, -6], [8, -7], [12, -6], [16, -3], [18, 3]] : [[2, 13], [3, 15], [5, 5], [10, 5], [12, 15], [13, 13]];
        tips.forEach(([x, y], i) => {
          const sx = 4 + (i * 7) / (tips.length - 1);
          v.worm([[sx, 3], [(sx + x) / 2 + (i % 2 ? 1 : -1), (3 + y) / 2], [x, y]], 1, 0.7, i % 2 ? SN : hex('#5f7a50'));
          if (r) v.set(x, y, P.RED);
        });
        v.row(9, 6, 9, K);
        v.pts([[6, 10], [9, 10]], C.white);
        if (!r) {
          v.rect(4, 6, 11, 7, hex('#4a2a30'));
          v.pts([[12, 7], [13, 8]], hex('#4a2a30'));
        } else {
          v.rect(5, 6, 6, 7, P.EYE);
          v.rect(9, 6, 10, 7, P.EYE);
          v.pts([[6, 6], [10, 6]], P.YEL);
          v.rect(6, 9, 9, 10, K);
          v.pts([[6, 9], [9, 9]], C.white);
          v.row(12, 4, 11, hex('#4a2a30'));
        }
      },
    });
  }, { uw: 32, uh: 40 });

  mk('hook-horror', 'hook horror vulture headed thing hooks for hands armoured chitin many eyes dungeon monster', 22, 30, (g, r) => {
    const CH = hex('#4a5258'),
      CL = hex('#6a747a'),
      BK = hex('#b9a070'),
      HD = hex('#8a6a68');
    for (const v of [g, g.flip(21)]) {
      v.limb([[8, 20], [6, 24], [8, 28]], 3, dark(CH));
      v.pts([[6, 28], [7, 28]], P.BONED);
      if (!r) {
        v.limb([[5, 10], [2, 16], [3, 20]], 2, CH);
        v.worm([[3, 21], [1, 24], [2, 27], [5, 28]], 1.1, 0.5, P.BONE);
      } else {
        v.limb([[5, 10], [0, 6], [-3, 0]], 2, CH);
        v.worm([[-3, 0], [-5, -4], [-2, -6], [1, -4]], 1.1, 0.5, P.BONE);
      }
    }
    g.oval(5, 8, 16, 22, CH);
    g.col(6, 11, 19, CL);
    for (const y of [12, 15, 18]) g.row(y, 8, 13, CL);
    g.pts([[5, 8], [4, 7], [16, 8], [17, 7]], CL);
    g.rect(9, 5, 12, 9, HD);
    g.oval(7, 1, 14, 7, HD);
    g.row(1, 9, 12, lite(HD));
    g.pts([[8, 3], [9, 4], [12, 4], [13, 3]], P.YEL);
    g.rect(10, 5, 11, 8, BK);
    g.set(11, 9, dark(BK));
    g.set(10, 5, lite(BK));
    if (r) {
      g.rect(9, 8, 12, 11, K);
      g.rect(10, 5, 11, 7, BK);
      g.pts([[10, 12], [11, 12], [10, 11]], BK);
      g.set(11, 9, P.GUM);
      g.ridge(6, 15, 2, CL, 3);
    }
  }, { uw: 36, uh: 38 });

  mk('hoard-crawler', 'treasure hoard that crawls pile of coins alive gold serpent crown eye among the coins dragon hoard thing', 26, 14, (g, r) => {
    const GD = hex('#a8883a'),
      GL = hex('#d0b45a'),
      GK = hex('#7a6228');
    g.poly([[1, 12], [4, 8], [9, 5], [16, 4], [21, 7], [24, 12]], GD);
    if (r) {
      g.worm([[13, 6], [10, -2], [14, -9], [19, -10]], 3.2, 2.8, GD);
      g.oval(15, -14, 24, -6, GD);
    }
    g.speckle(1, -14, 24, 12, GK, 3, 2);
    g.speckle(1, -14, 24, 12, GL, 5, 4);
    g.line(20, 7, 23, 4, ST);
    g.set(19, 8, C.brass);
    g.rect(3, 9, 5, 11, ST);
    g.set(4, 12, ST);
    g.set(18, 10, C.blood);
    const cx = r ? 17 : 12,
      cy = r ? -16 : 2;
    g.rect(cx, cy, cx + 4, cy + 1, GL);
    g.pts([[cx, cy - 1], [cx + 2, cy - 1], [cx + 4, cy - 1]], GL);
    g.set(cx + 2, cy + 1, C.blood);
    if (!r) {
      g.rect(8, 8, 10, 9, P.EYE);
      g.col(9, 8, 9, K);
    } else {
      g.rect(17, -12, 19, -11, P.EYE);
      g.col(18, -12, -11, K);
      g.maw(19, -10, 24, -7, GL, { in: hex('#2a1418') });
      g.pts([[9, 1], [7, 3], [15, -1], [5, 5]], GL);
    }
  }, { uw: 28, uh: 32 });

  mk('gate-maw', 'portcullis gate that walks castle gate with teeth mouth of stone and iron tongue eyes in the arch', 24, 30, (g, r) => {
    const SN = C.stone,
      SD = C.stoneDark;
    g.rect(3, 26, 8, 28, SD);
    g.rect(15, 26, 20, 28, SD);
    g.pts([[2, 28], [9, 28], [14, 28], [21, 28]], SD);
    g.oval(2, 1, 21, 18, SN);
    g.rect(2, 9, 21, 26, SN);
    g.col(2, 9, 26, lite(SN));
    for (const y of [11, 15, 19, 23]) {
      g.row(y, 2, 6, SD);
      g.row(y, 17, 21, SD);
    }
    g.pts([[4, 9], [4, 13], [19, 13], [4, 21], [19, 17]], SD);
    g.oval(7, 6, 16, 15, K);
    g.rect(7, 10, 16, 26, K);
    g.rect(10, 1, 13, 4, C.stoneLight);
    g.rect(5, 4, 7, 5, K);
    g.rect(16, 4, 18, 5, K);
    if (r) g.pts([[6, 4], [17, 4]], P.YEL);
    const bot = r ? 12 : 23;
    for (const x of [7, 9, 11, 13, 15]) {
      g.col(x, 7, bot, IR);
      g.col(x, bot + 1, bot + (r ? 3 : 2), lite(ST));
    }
    g.col(16, 9, bot, IRD);
    for (let y = 9; y <= bot; y += 4) g.row(y, 7, 16, IRD);
    if (r) {
      for (const x of [8, 10, 12, 14, 16]) g.col(x, 23, 26, C.stoneLight);
      g.pts([[11, 18], [12, 18], [11, 19]], P.GUM);
      g.worm([[12, 21], [12, 25], [9, 28]], 2, 1.4, hex('#8a4a50'));
    }
  }, {});

  mk('bat-human-face', 'giant bat with a human face man bat wings fangs pale face cave dungeon', 26, 18, (g, r) => {
    const F = hex('#3a3034'),
      M = hex('#54424e'),
      S = hex('#b9a892');
    if (!r) {
      g.poly([[6, 6], [12, 3], [19, 6], [21, 15], [13, 13], [4, 15]], M);
      g.line(7, 5, 4, 15, F);
      g.line(18, 5, 21, 15, F);
      g.pts([[6, 4], [19, 4]], P.BONE);
    } else {
      g.wing(9, 6, 16, 10, F, M, -1, 4);
      g.wing(16, 6, 16, 10, F, M, 1, 4);
    }
    g.oval(9, 6, 16, 14, F);
    g.pts([[10, 15], [10, 16], [11, 16], [14, 15], [15, 16], [14, 16]], dark(S));
    for (const v of [g, g.flip(25)]) v.pts([[9, 3], [9, 2], [8, 1], [8, 2], [10, 3], [10, 2]], F);
    g.rect(10, 3, 15, 8, S);
    g.row(9, 11, 14, S);
    g.col(10, 3, 8, lite(S));
    g.pts([[12, 6], [13, 6]], dark(S));
    if (!r) {
      g.pts([[11, 5], [14, 5]], K);
      g.row(8, 11, 14, vd(S));
    } else {
      g.pts([[11, 5], [14, 5]], P.RED);
      g.pts([[11, 4], [14, 4]], K);
      g.rect(11, 7, 14, 9, K);
      g.pts([[11, 7], [14, 7], [11, 8], [14, 8]], C.white);
    }
  }, { uw: 46, uh: 26 });

  mk('apprentices-fused', 'two wizard apprentices fused together two heads three arms one robe melted spell gone wrong', 22, 35, (g, r) => {
    const RB = hex('#3a4460'),
      S1 = hex('#c2a88c'),
      S2 = hex('#b4a8a0');
    for (const x of [4, 9, 15]) g.rect(x, 32, x + 2, 33, hex('#3a2c24'));
    g.poly([[4, 13], [17, 13], [19, 32], [2, 32]], RB);
    g.line(4, 13, 2, 32, lite(RB));
    g.row(32, 2, 19, dark(RB));
    g.row(22, 4, 17, C.straw);
    g.pts([[6, 19], [14, 26], [9, 29], [15, 17]], hex('#8f7a3a'));
    for (const v of [g, g.flip(21)]) {
      if (!r) {
        v.rect(1, 14, 3, 23, RB);
        v.rect(1, 24, 3, 25, v === g ? S1 : S2);
      } else {
        v.limb([[3, 14], [0, 8], [-1, 2]], 3, RB);
        v.rect(-2, -1, 1, 1, v === g ? S1 : S2);
        v.pts([[-2, -2], [0, -3], [2, -2]], v === g ? S1 : S2);
      }
    }
    g.rect(9, 7, 12, 13, blend(S1, S2)); // where the two run into each other
    g.face(2, 3, S1);
    g.face(12, 3, S2);
    g.row(2, 3, 8, hex('#5a3a24'));
    g.row(3, 2, 9, hex('#5a3a24'));
    g.pts([[13, 3], [15, 2], [18, 4]], dark(S2));
    if (!r) {
      g.pts([[4, 6], [7, 6], [14, 6], [17, 8]], K);
      g.row(9, 5, 6, vd(S1));
      g.line(14, 10, 17, 11, K);
      g.pts([[13, 12], [13, 13], [16, 12]], S2);
      g.rect(10, 15, 11, 23, lite(RB)); // the third arm
      g.rect(10, 24, 11, 25, S1);
    } else {
      g.pts([[4, 6], [7, 6]], C.white);
      g.rect(4, 8, 7, 10, K);
      g.set(14, 6, K);
      g.set(17, 10, K);
      g.poly([[14, 9], [16, 9], [17, 15], [14, 14]], K); // this one's face is still running
      g.pts([[13, 12], [13, 13], [13, 14], [18, 12], [18, 13]], S2);
      g.rect(9, 15, 12, 19, lite(RB));
      g.rect(8, 20, 13, 24, S1);
      g.pts([[8, 25], [10, 26], [12, 25], [13, 26]], S1);
      g.pts([[10, 22], [11, 23]], dark(S1));
    }
  }, { uw: 28, uh: 40 });

  mk('stirge-bloodsucker', 'stirge blood sucking bat mosquito needle beak small flying vermin dungeon', 12, 10, (g, r) => {
    const B = hex('#7a4a3a'),
      M = hex('#8a6a68'),
      N = hex('#2a2428');
    if (!r) {
      g.poly([[5, 3], [3, 1], [2, 2], [4, 4]], M);
      g.pts([[6, 2], [5, 1]], M);
      g.oval(4, 3, 8, 6, B);
      g.line(10, 5, 10, 8, N);
      g.pts([[5, 7], [5, 8], [7, 7], [7, 8]], N);
    } else {
      for (const v of [g, g.flip(12)]) {
        v.poly([[5, 3], [-3, -1], [-4, 1], [1, 4]], M);
        v.poly([[5, 4], [-2, 5], [-1, 7], [3, 6]], dark(M));
        v.line(5, 3, -3, -1, N);
      }
      g.oval(4, 3, 8, 8, B);
      g.oval(5, 5, 7, 8, C.blood);
      g.line(10, 5, 12, 9, N);
      g.pts([[4, 9], [8, 9]], N);
    }
    g.rect(8, 3, 9, 4, dark(B));
    g.set(9, 3, P.YEL);
    g.set(10, 4, N);
  }, { uw: 24, uh: 14 });

  mk('piercer-stalagmite', 'piercer stalagmite thing living stone spike splits open teeth cave dungeon small', 10, 20, (g, r) => {
    const SN = hex('#6a6a70'),
      SL = hex('#8a8a90');
    g.pts([[1, 18], [2, 18], [7, 18], [8, 18]], P.BONED);
    if (!r) {
      g.poly([[4, 1], [5, 1], [8, 17], [1, 17]], SN);
      g.line(4, 1, 1, 17, SL);
      for (const y of [6, 10, 14]) g.row(y, 3, 7, dark(SN));
      g.row(18, 1, 8, dark(SN));
      g.row(9, 4, 5, vd(SN));
      g.set(5, 4, C.glassLight);
    } else {
      g.poly([[4, 11], [5, 11], [8, 0], [1, 0]], K);
      for (const v of [g, g.flip(9)]) {
        v.poly([[1, 17], [4, 17], [4, 11], [0, -1], [-1, -1]], v === g ? SN : dark(SN));
        v.pts([[1, 2], [2, 5], [3, 8]], P.BONE);
      }
      g.line(-1, -1, 1, 17, SL);
      g.row(18, 1, 8, dark(SN));
      g.worm([[4.5, 11], [5, 5], [3, 1], [6, -3]], 1, 0.6, P.RAW);
      g.rect(1, 13, 2, 13, P.EYE);
      g.set(2, 13, K);
    }
  }, { uw: 14, uh: 25 });

  mk('goblin-runt', 'goblin runt small goblin big head big ears rusty dagger mouth too wide dungeon vermin', 12, 14, (g, r) => {
    const G = P.GOB;
    g.rect(4, 8, 7, 10, hex('#5a4634'));
    g.pts([[4, 11], [4, 12], [7, 11], [7, 12], [3, 8], [3, 9], [8, 8], [8, 9]], dark(G));
    g.rect(2, 2, 9, 7, G);
    g.row(1, 3, 8, IR);
    g.row(2, 2, 9, IR);
    g.col(2, 3, 6, lite(G));
    for (const v of [g, g.flip(11)]) v.pts(r ? [[1, 3], [0, 2], [-1, 1], [1, 4], [0, 3]] : [[1, 3], [1, 4], [1, 2]], dark(G));
    if (!r) {
      g.pts([[4, 4], [7, 4]], P.YEL);
      g.rect(5, 5, 6, 5, dark(G));
      g.row(6, 4, 7, K);
      g.col(9, 7, 10, C.rust);
    } else {
      g.pts([[4, 3], [7, 3]], P.YEL);
      g.maw(1, 5, 10, 8, P.BONE, { tongue: P.GUM });
      g.line(9, 8, 11, 2, C.rust);
      g.set(11, 1, ST);
    }
  }, { uw: 16, uh: 16 });

  mk('rot-grubs', 'rot grubs maggots burrowing in a severed arm worms in flesh small dungeon vermin', 15, 8, (g, r) => {
    const F = hex('#9a9484'),
      W = P.WAX;
    g.rect(1, 4, 8, 6, F);
    g.row(4, 2, 8, lite(F));
    g.set(1, 5, P.BONE);
    g.rect(9, 3, 11, 6, F);
    g.pts(r ? [[12, 2], [11, 1], [12, 4], [13, 3], [12, 6]] : [[12, 3], [13, 4], [12, 5], [12, 6]], F);
    g.pts([[3, 5], [6, 4]], K);
    if (!r) {
      g.pts([[3, 4], [3, 3], [4, 2]], W);
      g.pts([[7, 5], [8, 5], [9, 4]], W);
    } else
      for (const [x, h] of [[2, 4], [4, 6], [6, 3], [8, 5], [10, 4]]) {
        g.worm([[x, 4], [x + (h % 2 ? 1 : -1), 4 - h / 2], [x, 4 - h]], 0.8, 0.7, W);
        g.set(x, 4 - h, hex('#5a3a24'));
      }
  }, { uh: 12 });
};
