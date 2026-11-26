/* Medieval creatures, second half. See be-castle.js. */
module.exports = (k, mk) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, P, vd, fin } = k;
  const ST = C.steel,
    IR = C.iron,
    IRD = C.ironDark;

  mk('miller-millstone-head', 'miller with a millstone for a head grinding stone peasant flour headless wrong man', 18, 35, (g, r) => {
    const TU = hex('#6a5a40'),
      SN = C.stone;
    const m = g.at(1, 1);
    m.man({ head: false, skin: P.DEADF, top: TU, legs: hex('#3a3430'), shoe: false, coat: TU, coatLen: 3, belt: C.straw, arms: r ? 'fwd' : 'down' });
    m.pts([[4, 31], [6, 31], [9, 31], [11, 31]], P.DEADF);
    m.pts([[4, 12], [6, 13], [10, 12], [11, 13], [8, 14], [2, 13], [13, 14]], C.white); // flour
    const stone = (v, y0, y1) => {
      for (let y = y0; y <= y1; y++) {
        const d = Math.abs(y - 5.5),
          hw = Math.round(Math.sqrt(Math.max(0, 36 - d * d)));
        v.row(y, 8 - hw, 7 + hw, SN);
        v.set(8 - hw, y, lite(SN));
        v.set(7 + hw, y, dark(SN));
      }
    };
    if (!r) {
      stone(m, 0, 11);
      for (const [a, b] of [[3, 2], [12, 2], [2, 7], [13, 8], [5, 10], [10, 10], [7, 1]]) m.line(7.5, 5.5, a, b, C.stoneDark);
      m.rect(7, 5, 8, 6, K);
    } else {
      stone(m.at(0, -2), 0, 5); // the stone splits and grinds
      stone(m, 7, 11);
      m.rect(3, 4, 12, 6, K);
      for (const x of [3, 5, 7, 9, 11]) m.set(x, 4, C.stoneLight);
      for (const x of [4, 6, 8, 10, 12]) m.set(x, 6, C.stoneLight);
      m.pts([[7, 5], [8, 5]], P.RED);
      for (const [a, b] of [[3, 0], [12, 0], [7, -1]]) m.line(7.5, 3, a, b, C.stoneDark);
      m.pts([[6, 12], [9, 12], [7, 13]], C.white);
    }
  }, { uh: 37 });

  mk('executioner-hood-maw', 'executioner headsman black hood axe face is a mouth under the hood bare chest butcher', 22, 35, (g, r) => {
    const SK = hex('#a8866a'),
      HD = hex('#2a2228');
    g.at(2, 1).man({
      skin: SK,
      top: SK,
      legs: hex('#2a2630'),
      hood: HD,
      face: 'void',
      eye: r ? P.RED : P.EYE,
      arms: { l: 'down', r: r ? 'up' : 'down' },
      body(v, yT, yL) {
        v.rect(5, yT + 4, 10, yL + 4, C.woodDark);
        v.col(5, yT + 4, yL + 4, C.wood);
        v.rect(6, yT + 1, 6, yT + 3, C.woodDark);
        v.rect(9, yT + 1, 9, yT + 3, C.woodDark);
        v.pts([[8, yL], [7, yL + 2]], C.blood);
      },
      over(v) {
        if (!r) {
          v.col(15, 8, 31, C.wood);
          v.rect(16, 6, 17, 12, ST);
          v.col(18, 7, 11, lite(ST));
          v.set(14, 8, IR);
        } else {
          v.col(15, -7, 6, C.wood);
          v.rect(16, -8, 18, -3, ST);
          v.col(19, -7, -4, lite(ST));
          v.set(14, -6, IR);
          v.poly([[7, 3], [8, 3], [9, 7], [8, 12], [7, 12], [6, 7]], K); // the hood has a mouth of its own
          v.pts([[6, 5], [6, 7], [6, 9], [9, 6], [9, 8], [9, 10]], P.BONE);
          v.set(7, 8, P.GUM);
          v.set(8, 7, P.GUM);
          v.pts([[5, 6], [10, 6]], P.RED);
        }
      },
    });
  }, { uw: 26, ux: 2, uh: 44 });

  mk('mummer-goat-skull', 'mummer straw man goat skull mask is his face horns ribbons winter guiser pagan thing', 18, 37, (g, r) => {
    const SW = hex('#8a7a4a'),
      HN = hex('#5a4c3e');
    g.at(1, 4).man({
      skin: P.BONE,
      top: SW,
      robe: SW,
      arms: r ? 'out' : 'down',
      hand: hex('#4a4038'),
      face: 'none',
      head: false,
      over(v, yT, yL, yF) {
        for (const y of [13, 18, 23, 28]) v.strands(3, 12, y, 2, 4, dark(SW), y, 1);
        v.strands(1, 3, r ? 16 : 15, 2, 5, SW, 3);
        v.strands(12, 14, r ? 16 : 15, 2, 5, dark(SW), 4);
        if (r) {
          v.strands(-3, 0, 16, 2, 6, SW, 8);
          v.strands(15, 18, 16, 2, 6, dark(SW), 9);
        }
        v.pts([[5, 16], [9, 21], [6, 26]], hex('#6b2f3a'));
        v.pts([[10, 15], [5, 22]], C.teal);
        // the goat's skull
        v.rect(5, 3, 10, 8, P.BONE);
        v.row(2, 6, 9, P.BONE);
        v.rect(6, 9, 9, r ? 10 : 12, P.BONE);
        v.col(5, 3, 8, lite(P.BONE));
        v.rect(5, 5, 6, 6, K);
        v.rect(9, 5, 10, 6, K);
        v.col(7, 4, 8, P.BONED);
        for (const f of [v, v.flip(15)]) {
          f.pts([[4, 3], [3, 2], [2, 1], [1, 0], [1, -1], [2, -2], [3, 3], [2, 2], [1, 1]], HN);
          if (r) f.pts([[3, -2], [4, -1], [0, 0], [0, -1]], HN);
        }
        if (!r) v.pts([[7, 11], [8, 11]], vd(P.BONE));
        else {
          v.pts([[6, 6], [10, 6]], P.YEL);
          v.rect(6, 11, 9, 15, K);
          v.rect(6, 16, 9, 16, P.BONE);
          v.pts([[6, 11], [8, 11], [7, 15], [9, 15]], P.BONE);
          v.col(8, 12, 19, P.GUM);
          v.set(7, 13, P.GUM);
        }
      },
    });
  }, { uw: 26, uh: 39 });

  mk('anchoress-walled', 'anchoress walled in nun carries her wall masonry slab arms through the stones squint eye bricked up', 22, 30, (g, r) => {
    const SN = C.stone,
      S = hex('#b9aa94');
    g.rect(7, 25, 8, 27, S);
    g.rect(13, 25, 14, 27, dark(S));
    g.row(28, 6, 8, S);
    g.row(28, 13, 15, S);
    const arm = (v, y, up) => {
      v.limb(up ? [[4, y], [0, y - 4], [1, y - 9]] : [[4, y], [1, y + 4], [2, y + 9]], 2, S);
      const e = up ? y - 10 : y + 10;
      v.pts([[1, e], [3, e], [2, e + (up ? -1 : 1)]], S);
    };
    if (r)
      for (const v of [g, g.flip(21)]) {
        arm(v, 9, 1);
        arm(v, 19, 1);
      }
    for (const v of [g, g.flip(21)]) arm(v, 13, 0);
    g.rect(4, 2, 17, 24, SN);
    g.col(4, 2, 24, lite(SN));
    for (const y of [5, 9, 13, 17, 21]) g.row(y, 4, 17, C.stoneDark);
    for (let y = 2; y < 24; y += 4) for (let x = 6 + ((y >> 2) % 2) * 3; x < 17; x += 6) g.col(x, y, Math.min(24, y + 2), C.stoneDark);
    for (const [x, y] of [[4, 2], [5, 2], [17, 2], [17, 24], [4, 24], [16, 2], [17, 3]]) g.clear(x, y);
    g.pts([[5, 23], [7, 24], [12, 2]], C.moss);
    g.rect(10, 6, 11, 11, K); // the squint
    g.row(8, 8, 13, K);
    if (r) {
      g.rect(9, 7, 12, 9, P.EYE);
      g.rect(10, 7, 11, 9, hex('#6a7a5a'));
      g.set(11, 8, K);
      g.line(13, 9, 16, 14, K);
      g.line(8, 12, 6, 16, K);
    } else g.set(10, 10, S);
  }, { uw: 30, uh: 34 });

  mk('stilt-pilgrim', 'large tall pilgrim on stilts too long legs wide hat staff palmer thin walker harvestman face is a mouth', 20, 48, (g, r) => {
    const HT = hex('#4a4034'),
      CL = hex('#5a4a3a'),
      S = hex('#a8987e'),
      W = C.woodPale;
    const leg = (pts) => {
      g.limb(pts.slice(0, 2), 2, S);
      g.limb(pts.slice(1), 2, W);
      const [x, y] = pts[1];
      g.rect(x, y - 1, x + 1, y, C.straw);
      const f = pts[pts.length - 1];
      g.row(46, f[0] - 1, f[0] + 2, C.woodDark);
    };
    if (r) {
      leg([[7, 22], [0, 33], [-5, 46]]);
      leg([[12, 22], [19, 33], [24, 46]]);
    }
    leg([[8, 22], [7, 34], [8, 46]]);
    leg([[11, 22], [12, 34], [11, 46]]);
    g.poly([[6, 10], [13, 10], [15, 22], [4, 22]], CL);
    g.line(6, 10, 4, 22, lite(CL));
    g.ragged(4, 15, 22, 2, 5);
    g.pts([[9, 13], [10, 15], [9, 17]], vd(CL));
    if (!r) {
      g.col(2, 6, 46, C.woodDark); // the staff
      g.rect(1, 8, 3, 10, hex('#8a6a3a'));
      g.limb([[6, 12], [3, 17], [2, 21]], 2, CL);
      g.rect(1, 21, 3, 22, S);
      g.limb([[13, 12], [16, 22], [16, 31]], 2, CL);
      g.pts([[16, 32], [17, 32], [15, 33], [17, 34], [16, 34]], S);
      g.rect(7, 6, 12, 9, P.NIGHT);
      g.strands(8, 11, 9, 1, 3, C.ash, 2);
      g.row(5, 3, 16, HT);
      g.rect(7, 2, 12, 4, HT);
      g.row(2, 8, 11, lite(HT));
      g.rect(9, 3, 10, 4, C.white);
    } else {
      for (const v of [g, g.flip(19)]) {
        v.limb([[6, 12], [1, 7], [-3, 13]], 2, CL);
        v.pts([[-4, 14], [-3, 15], [-2, 14], [-5, 13]], S);
      }
      g.oval(6, 4, 13, 11, hex('#7a6a58'));
      g.oval(7, 5, 12, 10, K); // under the hat: a ring of teeth
      for (const [x, y] of [[8, 5], [11, 5], [7, 7], [12, 8], [8, 10], [11, 10], [9, 6], [10, 9]]) g.set(x, y, P.BONE);
      g.pts([[9, 7], [10, 8]], P.GUM);
      g.row(4, 4, 15, HT);
      g.rect(7, 1, 12, 3, HT);
      g.rect(9, 2, 10, 3, C.white);
    }
  }, { uw: 36 });

  /* the dancing plague: four dancers who cannot stop, grown together at the hands */
  mk('dancing-plague-chain', 'large long dancing plague dancers fused hand in hand chain of peasants cannot stop dancing mania crowd one creature', 48, 32, (g, r) => {
    const cols = [hex('#6a5a40'), hex('#565663'), hex('#6b2f3a'), hex('#4a5e36')];
    const S = hex('#b5a58c');
    const sh = [];
    for (let i = 0; i < 4; i++) {
      const x = 3 + i * 11,
        y = 3 + (i % 2) * 2 + (r ? (i % 2 ? -2 : 1) : 0),
        c = cols[i],
        d = i % 2 ? 1 : -1;
      g.limb([[x + 3, y + 16], [x + 1 + (r ? -d : 0), 23], [x + 3, 30]], 2, dark(c));
      g.limb([[x + 5, y + 16], [x + 7 + (r ? d : 0), 24 - (r ? 3 : 0)], [x + 6 + (r ? 2 * d : 0), 30 - (r && i % 2 ? 4 : 0)]], 2, dark(c));
      g.pts([[x + 2, 30], [x + 5, 30]], P.BONE);
      g.rect(x + 2, y + 6, x + 6, y + 16, c);
      g.col(x + 2, y + 6, y + 16, lite(c));
      g.ragged(x + 2, x + 6, y + 16, 2, i + 2);
      const hx = x + 2 + (r ? 0 : d);
      g.rect(hx, y, hx + 4, y + 4, S);
      g.row(y, hx, hx + 4, hex('#4a4038'));
      g.set(hx + 2, y + 5, dark(S));
      if (r) {
        g.pts([[hx + 1, y + 1], [hx + 3, y + 1]], P.YEL);
        g.rect(hx + 1, y + 3, hx + 3, y + 4, K);
      } else {
        g.pts([[hx + 1, y + 2], [hx + 3, y + 2]], K);
        g.set(hx + 2, y + 4, K);
      }
      sh.push([x, y]);
    }
    for (let i = 0; i < 3; i++) {
      const [x, y] = sh[i],
        [x2, y2] = sh[i + 1],
        my = r ? Math.min(y, y2) - 4 : Math.max(y, y2) + 13;
      g.limb([[x + 6, y + 7], [x + 9, my], [x2 + 1, y2 + 7]], 2, S); // one arm between two
      g.pts([[x + 9, my - (r ? 1 : -2)], [x + 10, my - (r ? 1 : -2)]], dark(S));
    }
    g.limb(r ? [[4, sh[0][1] + 7], [1, sh[0][1] - 2]] : [[4, sh[0][1] + 7], [1, sh[0][1] + 15]], 2, S);
    g.limb(r ? [[43, sh[3][1] + 7], [45, sh[3][1] - 3]] : [[43, sh[3][1] + 7], [45, sh[3][1] + 15]], 2, S);
    g.pts([[8, 30], [30, 30], [41, 30]], C.blood);
  }, { uh: 38 });

  mk('destrier-barded-hands', 'large long war horse in barding caparison no hooves human hands under the cloth riderless destrier armoured steed wrong', 46, 32, (g, r) => {
    const CL = hex('#5a2e36'),
      Y = hex('#8f7a3a'),
      S = hex('#b9aa94');
    g.strands(2, 4, 11, 7, 12, P.BLACK, 3);
    const hem = r ? 22 : 29;
    // what walks under the cloth
    if (r) {
      g.rect(6, 20, 36, 26, K);
      for (const [x, y, e] of [[8, 22, 0], [13, 23, 1], [19, 22, 0], [24, 23, 1], [29, 22, 0], [33, 23, 1]]) {
        g.limb([[x, y], [x + (e ? 2 : -1), 27], [x, 30]], 2, e ? dark(S) : S);
        g.pts([[x - 1, 30], [x + 2, 30]], S);
      }
      g.pts([[11, 22], [12, 22], [21, 23], [22, 23], [31, 22], [32, 22]], P.YEL);
    }
    g.poly([[4, 11], [30, 8], [36, 12], [36, hem], [4, hem]], CL);
    g.row(hem - 2, 4, 36, Y);
    for (let x = 6; x < 36; x += 6) g.poly([[x, 17], [x + 2, 14], [x + 4, 17], [x + 2, 20]], Y);
    g.col(4, 11, hem, lite(CL));
    g.ragged(4, 36, hem, 2, 7);
    if (!r)
      for (const x of [7, 14, 26, 32]) {
        g.row(29, x, x + 2, S); // hands, not hooves
        g.pts([[x - 1, 30], [x + 1, 30], [x + 3, 30]], S);
      }
    // the empty saddle
    g.rect(15, 6, 24, 9, C.woodDark);
    g.rect(15, 4, 16, 6, C.wood);
    g.rect(23, 5, 24, 6, C.wood);
    g.col(21, 10, 15, IRD);
    g.rect(20, 16, 22, 17, ST);
    const h = g.at(0, r ? -3 : 0);
    h.poly([[28, 10 - (r ? -3 : 0)], [34, 3], [38, 4], [36, 13 - (r ? -3 : 0)]], CL);
    h.line(34, 3, 29, 9, Y);
    h.poly([[35, 2], [39, 2], [44, 10], [44, 12], [41, 12], [36, 6]], ST);
    h.line(36, 2, 43, 10, lite(ST));
    h.pts([[35, 1], [37, 1]], ST);
    h.rect(38, 5, 39, 6, K);
    h.set(43, 11, K);
    h.line(41, 12, 25, 8, IRD);
    if (r) {
      h.set(38, 5, P.RED);
      h.poly([[40, 13], [44, 14], [43, 17], [40, 16]], ST);
      h.rect(40, 13, 44, 14, K);
      h.pts([[41, 13], [43, 13], [42, 14], [44, 14]], P.BONE);
    }
  }, { uh: 36 });

  mk('well-crawler-wet', 'thing from the well wet long black hair crawling drowned girl rope dripping ghost long arms', 20, 22, (g, r) => {
    const SH = hex('#8a938c'),
      S = hex('#c2c4b4'),
      HA = hex('#1a1a20');
    g.line(15, 15, 18, 20, C.straw);
    if (!r) {
      g.oval(4, 8, 15, 19, SH);
      g.limb([[5, 12], [2, 16], [3, 19]], 2, S);
      g.limb([[14, 12], [16, 16], [15, 19]], 2, dark(S));
      g.pts([[2, 20], [4, 20], [5, 19], [14, 20], [16, 20], [17, 19]], S);
      g.oval(6, 2, 13, 10, HA);
      g.strands(5, 14, 6, 6, 11, HA, 4);
      g.col(9, 6, 9, S);
      g.col(10, 6, 8, S);
      g.set(10, 7, K);
    } else {
      g.rect(8, 8, 9, 19, dark(S));
      g.rect(11, 8, 12, 19, dark(S));
      g.pts([[7, 20], [8, 20], [9, 20], [11, 20], [12, 20], [13, 20]], S);
      g.rect(6, -7, 13, 10, SH);
      g.col(6, -7, 10, lite(SH));
      g.ragged(6, 13, 10, 3, 6);
      g.pts([[8, -2], [10, 1], [9, 5], [11, -4]], dark(SH));
      for (const v of [g, g.flip(19)]) {
        v.limb([[6, -6], [3, 4], [2, 14]], 2, S);
        v.pts([[1, 15], [3, 15], [2, 16], [1, 17], [3, 17]], S);
      }
      g.oval(6, -15, 13, -7, HA);
      g.strands(5, 14, -11, 8, 14, HA, 4);
      g.rect(8, -12, 11, -7, S); // the hair parts
      g.rect(8, -11, 9, -10, C.white);
      g.set(9, -10, K);
      g.set(11, -11, K);
      g.rect(9, -8, 10, -5, K);
    }
    g.pts([[6, 20], [10, 20], [18, 18]], C.glassLight);
  }, { uw: 22, uh: 39 });

  mk('toad-human-face', 'toad with a human face witch familiar small warty old man face in a toad', 14, 11, (g, r) => {
    const T = hex('#5a5a3a'),
      F = hex('#b9a58c');
    g.oval(1, 3, 12, 9, T);
    g.oval(1, 6, 4, 9, dark(T));
    g.pts([[1, 9], [2, 9], [10, 9], [11, 9], [12, 9]], dark(T));
    g.pts([[3, 4], [5, 3], [6, 5], [4, 6]], lite(T));
    g.pts([[8, 2], [11, 2]], P.YEL);
    g.oval(7, 3, 12, 8, F);
    if (!r) {
      g.pts([[9, 5], [11, 5]], K);
      g.set(10, 6, dark(F));
      g.row(7, 9, 11, vd(F));
    } else {
      g.pts([[9, 4], [11, 4]], C.white);
      g.rect(8, 5, 12, 8, K);
      g.limb([[10, 7], [12, 2], [13, -2]], 2, P.PALE); // a hand for a tongue
      g.pts([[12, -3], [14, -3], [13, -4], [15, -2]], P.PALE);
    }
  }, { uw: 20, uh: 16 });

  mk('gauntlet-crawler', 'crawling gauntlet armoured hand walks on its fingers severed glove steel small eye in the palm', 11, 8, (g, r) => {
    if (!r) {
      g.rect(1, 1, 3, 4, ST);
      g.rect(3, 2, 8, 4, ST);
      g.row(2, 3, 8, lite(ST));
      g.col(3, 2, 4, IR);
      for (const x of [5, 7, 9]) g.col(x, 4, 6, x === 9 ? IR : ST);
      g.pts([[3, 5], [2, 6]], IR);
      g.pts([[5, 3], [7, 3]], IRD);
    } else {
      g.rect(3, 4, 7, 6, IR);
      g.rect(2, -1, 8, 3, ST);
      g.col(2, -1, 3, lite(ST));
      g.col(2, -4, -2, ST);
      g.col(4, -5, -2, ST);
      g.col(6, -5, -2, ST);
      g.col(8, -3, -2, IR);
      g.pts([[9, 1], [10, 0], [10, -1]], IR);
      g.rect(4, 0, 6, 2, P.EYE);
      g.set(5, 1, K);
      g.set(5, 0, P.RED);
    }
  }, { uw: 13, uh: 14 });

  mk('helmet-crab', 'helmet crab great helm on crab legs hermit thing living in a helmet scuttling small steel', 13, 11, (g, r) => {
    const L = hex('#8a5a48');
    const hy = r ? -3 : 0;
    for (const v of [g, g.flip(12)]) {
      if (!r) {
        v.pts([[2, 7], [1, 8], [1, 9], [3, 8], [2, 9], [4, 8], [4, 9]], L);
      } else {
        v.line(3, 6, -1, 4, L);
        v.line(-1, 4, -1, 9, L);
        v.line(4, 7, 1, 9, L);
        v.line(4, 5, 0, 0, L); // claws up
        v.pts([[-1, -1], [0, -2], [1, -1]], lite(L));
      }
    }
    if (r) {
      g.rect(4, 5, 8, 8, P.RAW); // the soft thing that lives in it
      g.row(9, 5, 7, P.RAW);
      g.pts([[5, 7], [7, 7]], K);
      g.pts([[5, 8], [6, 8], [7, 8]], P.BONE);
    }
    const h = g.at(0, hy);
    h.rect(3, 1, 9, 7, ST);
    h.col(3, 1, 7, lite(ST));
    h.row(1, 3, 9, lite(ST));
    h.row(4, 4, 8, K);
    h.col(6, 3, 6, K);
    h.pts([[4, 2], [8, 2], [4, 6], [8, 6]], IRD);
    if (r) h.pts([[5, 4], [7, 4]], P.YEL);
  }, { uw: 17, uh: 15 });

  mk('lamprey-pie', 'lamprey pie alive eels in a pie dish toothed sucker mouths feast vermin small', 14, 11, (g, r) => {
    const D = hex('#7a5a40'),
      CR = hex('#b89860'),
      L = hex('#5a6470');
    const lam = (pts) => {
      g.worm(pts, 1.3, 1.2, L);
      const [x, y] = pts[pts.length - 1];
      g.rect(x - 1, y - 1, x + 1, y + 1, P.RAW);
      g.set(x, y, K);
      g.pts([[x - 1, y - 1], [x + 1, y + 1]], P.BONE);
    };
    g.poly([[2, 7], [11, 7], [10, 9], [3, 9]], D);
    if (!r) {
      g.oval(1, 3, 12, 8, CR);
      g.row(3, 4, 9, lite(CR));
      for (let x = 2; x < 12; x += 2) g.set(x, 7, dark(CR));
      g.pts([[5, 4], [8, 5]], K);
      g.pts([[10, 3], [11, 2], [12, 2]], L);
    } else {
      g.oval(1, 4, 12, 8, CR);
      g.rect(3, 4, 10, 6, K);
      for (let x = 2; x < 12; x += 2) g.set(x, 7, dark(CR));
      lam([[4, 6], [2, 1], [3, -4]]);
      lam([[7, 6], [8, 0], [6, -6]]);
      lam([[9, 6], [12, 2], [12, -3]]);
      lam([[6, 6], [5, 3], [8, 2]]);
      g.pts([[1, 3], [12, 4]], CR);
    }
  }, { uw: 16, uh: 20 });

  mk('plague-flea', 'giant flea plague flea blood swollen jumping vermin insect small', 10, 8, (g, r) => {
    const F = hex('#5a2e24');
    if (!r) {
      g.oval(2, 2, 7, 5, F);
      g.row(2, 3, 6, lite(F));
      for (const x of [4, 6]) g.col(x, 3, 5, dark(F));
      g.rect(7, 3, 8, 4, dark(F));
      g.pts([[8, 5], [8, 6]], K);
      g.pts([[3, 5], [2, 4], [1, 3], [1, 5], [1, 6], [5, 6], [6, 6]], dark(F));
    } else {
      g.oval(1, -2, 8, 5, F);
      g.oval(2, 1, 7, 5, C.blood);
      g.row(-2, 3, 6, lite(F));
      g.pts([[3, 2], [4, 3]], hex('#b3342c'));
      g.rect(8, 0, 9, 1, dark(F));
      g.col(10, 1, 5, K);
      g.pts([[2, 5], [0, 3], [-1, 1], [-1, 6], [5, 6], [7, 6], [0, 6]], dark(F));
    }
  }, { uw: 14, uh: 11 });

  mk('changeling-cradle', 'changeling in the cradle fairy child swapped baby long fingers thing in the crib eyes in the dark', 16, 14, (g, r) => {
    const W = C.wood,
      CH = hex('#8a9078');
    g.pts([[1, 11], [2, 12], [13, 12], [14, 11]], C.woodDark);
    g.row(12, 3, 12, C.woodDark);
    g.rect(2, 6, 13, 10, W);
    g.row(6, 2, 13, lite(W));
    g.col(8, 7, 10, C.woodDark);
    g.rect(2, 2, 6, 6, W);
    g.row(2, 3, 5, lite(W));
    g.rect(3, 3, 5, 5, K);
    g.row(6, 7, 12, C.cream);
    if (!r) {
      g.pts([[3, 4], [5, 4]], P.YEL);
      g.pts([[8, 5], [10, 5], [12, 5], [8, 6], [10, 6], [12, 6], [10, 7]], CH); // fingers on the rim
    } else {
      for (const v of [g, g.flip(15)]) {
        v.limb([[6, 0], [1, 3], [-1, 11]], 1, CH);
        v.pts([[-2, 12], [0, 12], [-1, 12]], CH);
      }
      g.oval(6, -1, 10, 6, CH);
      g.oval(3, -10, 12, -2, CH);
      g.col(3, -8, -4, lite(CH));
      g.rect(5, -7, 6, -6, P.YEL);
      g.rect(9, -7, 10, -6, P.YEL);
      g.pts([[6, -6], [10, -6]], K);
      g.row(-4, 5, 10, K);
      g.pts([[5, -4], [7, -4], [9, -4]], C.white);
      g.pts([[4, -5], [11, -5]], K);
      g.pts([[7, -11], [9, -11]], hex('#4a4038'));
    }
  }, { uw: 22, uh: 26 });
};
