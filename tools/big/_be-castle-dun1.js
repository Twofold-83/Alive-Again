/* Castle and dungeon creatures, first half: the dungeon adventure, but hideous. See be-castle.js. */
module.exports = (k, mk) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, P, vd, fin } = k;
  const ST = C.steel,
    IR = C.iron,
    IRD = C.ironDark;

  mk('gelatinous-cube', 'large tall gelatinous cube jelly slime block skeleton and sword inside its last meal dissolving dungeon ooze monster', 34, 36, (g, r) => {
    const J = hex('#7fa392'),
      JD = hex('#5d8273'),
      JL = hex('#a4c2ae');
    const inn = (c, t = 0.4) => blend(c, J, t);
    g.poly([[2, 8], [6, 3], [32, 3], [28, 8]], JL);
    g.poly([[28, 8], [32, 3], [32, 29], [28, 34]], JD);
    g.rect(2, 8, 28, 34, J);
    if (r) {
      g.oval(22, 11, 38, 31, J); // it leans out towards you
      g.oval(31, 17, 37, 25, blend(K, J, 0.35));
      g.oval(32, 18, 36, 24, blend(K, J, 0.15));
    }
    g.row(34, 1, 29, JD);
    g.col(3, 10, 22, JL);
    g.pts([[5, 10], [6, 10], [5, 11], [8, 5], [9, 5], [10, 4]], hex('#d8e6d6'));
    // the last meal
    const s = g.at(r ? 9 : 0, r ? 1 : 0);
    s.skull(9, 11, inn(P.BONE, 0.25), inn(K, 0.3));
    if (r) {
      s.rect(11, 19, 14, 21, inn(K, 0.3));
      s.row(22, 11, 14, inn(P.BONE, 0.25));
    }
    s.ribs(13, r ? 24 : 21, 3, 3, inn(P.BONE, 0.3));
    s.line(9, 22, 7, 29, inn(P.BONE, 0.3));
    if (!r) s.line(17, 22, 19, 28, inn(P.BONE, 0.3));
    else {
      g.line(26, 23, 33, 21, inn(P.BONE, 0.2));
      g.line(34, 21, 40, 19, P.BONE); // a hand through the skin, still reaching
      g.pts([[41, 18], [41, 20], [40, 17], [42, 19]], P.BONE);
    }
    g.line(21, 11, 24, 30, inn(ST, 0.3));
    g.row(14, 19, 24, inn(C.brass, 0.3));
    g.rect(5, 28, 10, 31, inn(IR, 0.3));
    g.row(28, 6, 9, inn(ST, 0.3));
    g.pts([[14, 31], [16, 32], [18, 31], [12, 32], [26, 32]], inn(C.gold, 0.2));
    g.rect(15, 29, 17, 30, inn(C.woodDark, 0.3));
    g.pts([[6, 34], [13, 34], [22, 34]], JL);
  }, { uw: 46, ux: 2, uh: 36 });

  mk('eye-tyrant', 'eye tyrant beholder floating eye ball eye stalks great eye teeth dungeon monster many eyes', 26, 30, (g, r) => {
    const B = hex('#6a4a5a'),
      BL = hex('#86647a');
    g.oval(7, 27, 18, 28, K);
    const stalk = (pts) => {
      g.worm(pts, 1.2, 1, B);
      const [x, y] = pts[pts.length - 1];
      g.rect(x - 1, y - 1, x + 1, y + 1, P.EYE);
      g.set(x, y, r ? P.RED : K);
    };
    if (!r) {
      stalk([[6, 10], [3, 7], [3, 11]]);
      stalk([[9, 8], [8, 4], [10, 3]]);
      stalk([[13, 8], [14, 4], [16, 3]]);
      stalk([[17, 9], [20, 6], [21, 9]]);
      stalk([[20, 12], [23, 12], [22, 16]]);
    } else {
      stalk([[5, 11], [1, 8], [-1, 3]]);
      stalk([[8, 8], [5, 2], [5, -3]]);
      stalk([[12, 8], [12, 1], [11, -4]]);
      stalk([[15, 8], [18, 1], [18, -3]]);
      stalk([[19, 10], [23, 5], [25, 0]]);
      stalk([[21, 13], [24, 11], [25, 7]]);
    }
    g.oval(3, 7, 22, 24, B);
    g.oval(5, 8, 14, 13, BL);
    g.speckle(3, 16, 22, 24, dark(B), 5, 3);
    g.bigEye(12, 13, 5, r ? 4 : 3, hex('#9a9a4a'), { slit: r, lid: r ? 0 : 2, lidCol: dark(B) });
    if (!r) {
      g.row(20, 7, 18, K);
      g.pts([[8, 21], [11, 21], [14, 21], [17, 21]], P.BONE);
    } else {
      g.maw(6, 19, 19, 23, P.BONE, { round: true, tongue: P.GUM });
      g.pts([[9, 25], [15, 26]], hex('#a4c2ae'));
    }
  }, { uw: 32, uh: 36 });

  mk('mimic-chest-biting', 'mimic treasure chest with teeth and tongue biting false chest trap monster', 20, 16, (g, r) => {
    const W = C.wood,
      T = hex('#a05a60');
    const y0 = r ? -2 : 0;
    const b = g.at(0, y0);
    if (r) {
      for (const x of [3, 7, 11, 15]) g.rect(x, 12, x + 1, 14, hex('#8a6a5a')); // it has feet
      g.pts([[2, 14], [6, 14], [13, 14], [17, 14]], hex('#8a6a5a'));
    }
    b.rect(2, 7, 17, 14, W);
    b.col(2, 7, 14, lite(W));
    b.row(14, 2, 17, C.woodDark);
    for (const x of [4, 15]) b.col(x, 7, 14, IR);
    b.row(10, 2, 17, C.woodDark);
    if (!r) {
      g.rect(2, 3, 17, 5, W);
      g.row(2, 3, 16, lite(W));
      for (const x of [4, 15]) g.col(x, 2, 5, IR);
      g.row(6, 2, 17, K);
      g.pts([[6, 6], [9, 6], [13, 6]], P.BONE);
      g.rect(9, 7, 10, 9, C.brass);
      g.set(9, 8, P.YEL);
      g.set(10, 8, K);
      g.pts([[16, 6], [17, 7], [18, 7]], T);
    } else {
      b.poly([[2, -4], [17, -7], [17, -3], [2, 1]], W);
      b.line(2, -4, 17, -7, lite(W));
      b.poly([[2, 1], [17, -3], [17, 6], [2, 6]], hex('#3a141c'));
      for (const x of [4, 15]) b.line(x, -4 - (x > 9 ? 2 : 0), x, 0 - (x > 9 ? 3 : 0), IR);
      for (let x = 3; x < 17; x += 3) {
        b.col(x, Math.round(1 - (x - 2) * 0.27), Math.round(3 - (x - 2) * 0.27), P.BONE);
        b.col(x + 1, 5, 6, P.BONE);
      }
      b.worm([[9, 5], [14, 8], [19, 12], [22, 15]], 2, 1.2, T);
      b.pts([[6, 2], [12, 1]], P.YEL);
      b.rect(9, 8, 10, 10, C.brass);
    }
  }, { uw: 28, ux: 2, uh: 27 });

  mk('troll-belly-face', 'large tall troll with a second face in its belly belly mouth eyes in the gut giant green warty monster', 28, 46, (g, r) => {
    const T = P.TROLL,
      D = dark(T);
    g.rect(6, 34, 11, 44, D);
    g.rect(16, 34, 21, 44, D);
    g.rect(4, 43, 11, 44, T);
    g.rect(16, 43, 23, 44, T);
    g.pts([[4, 44], [6, 44], [8, 44], [18, 44], [20, 44], [22, 44]], P.BONED);
    for (const v of [g, g.flip(27)]) {
      v.rect(1, 13, 4, 33, T);
      v.rect(1, 32, 5, 36, T);
      v.pts([[1, 37], [3, 38], [5, 37]], P.BONED);
    }
    g.col(1, 14, 33, lite(T));
    g.oval(4, 8, 23, 21, T);
    g.oval(3, 14, 24, 37, T);
    g.col(5, 17, 32, vd(T));
    g.col(22, 17, 32, vd(T));
    for (const [x, y] of [[4, 9], [5, 9], [4, 10], [23, 9], [22, 9], [23, 10], [1, 13], [26, 13]]) g.clear(x, y);
    g.rect(5, 35, 22, 38, hex('#4a3a2c'));
    g.ragged(5, 22, 38, 3, 5);
    g.pts([[6, 12], [9, 10], [20, 11], [22, 16], [5, 19]], lite(T));
    g.pts([[8, 9], [19, 9], [21, 13]], C.moss);
    // the head on top: small, slow
    g.rect(10, 2, 17, 9, T);
    g.row(1, 11, 16, T);
    g.pts([[9, 4], [8, 3], [18, 4], [19, 3]], T);
    g.rect(13, 5, 14, 9, D);
    g.set(13, 10, D);
    g.pts([[11, 4], [16, 4]], r ? C.white : P.YEL);
    g.row(8, 11, 16, vd(T));
    g.pts([[11, 7], [16, 7]], P.BONE);
    if (!r) {
      g.row(22, 7, 10, vd(T)); // the other face, asleep
      g.row(22, 17, 20, vd(T));
      g.rect(13, 24, 14, 26, D);
      g.row(30, 7, 20, vd(T));
      g.pts([[6, 29], [21, 29]], vd(T));
    } else {
      g.bigEye(8, 22, 3, 2, P.RED, { k: 0.7 });
      g.bigEye(19, 22, 3, 2, P.RED, { k: 0.7 });
      g.rect(13, 24, 14, 26, D);
      g.maw(5, 28, 22, 34, P.BONE, { round: true, tongue: P.GUM, step: 3 });
      g.pts([[12, 35], [14, 36]], hex('#a4c2ae'));
    }
  }, { uw: 30, uh: 46 });

  mk('dungeon-worm', 'large long dungeon worm purple worm burrowing giant ringed worm round mouth rings of teeth rubble monster', 48, 28, (g, r) => {
    const W = hex('#5a3f52'),
      M = hex('#8a5a60');
    const mouth = (x0, y0, x1, y1) => {
      g.oval(x0, y0, x1, y1, M);
      g.oval(x0 + 2, y0 + 2, x1 - 2, y1 - 2, K);
      const cx = (x0 + x1) / 2,
        cy = (y0 + y1) / 2;
      for (let a = 0; a < 8; a++) {
        const an = (a * Math.PI) / 4 + 0.3;
        g.set(cx + Math.cos(an) * ((x1 - x0) / 2 - 2), cy + Math.sin(an) * ((y1 - y0) / 2 - 2), P.BONE);
        if (r) g.set(cx + Math.cos(an + 0.4) * ((x1 - x0) / 2 - 4), cy + Math.sin(an + 0.4) * ((y1 - y0) / 2 - 4), P.BONED);
      }
      if (r) g.rect(Math.round(cx) - 1, Math.round(cy) - 1, Math.round(cx), Math.round(cy), P.GUM);
    };
    if (!r) {
      g.segworm([[9, 24], [11, 10], [22, 5], [33, 8], [39, 17]], 4.5, 4, W, 4);
      mouth(35, 13, 45, 23);
    } else {
      g.segworm([[10, 24], [10, 6], [17, -8], [28, -9]], 5, 4.5, W, 4);
      mouth(25, -16, 40, -1);
      g.pts([[22, 14], [26, 10], [3, 12], [30, 18]], C.stoneDark);
    }
    g.clearRect(0, 27, 47, 31);
    // the rubble it came up through
    for (const [x, y, w] of [[2, 22, 6], [7, 23, 5], [13, 22, 6], [18, 24, 4], [1, 25, 4]]) {
      g.rect(x, y, x + w, 26, C.stoneDark);
      g.row(y, x, x + w - 1, C.stone);
    }
    g.pts([[24, 26], [27, 25], [28, 26]], C.stoneDark);
  }, { uh: 46 });

  mk('rust-thing', 'rust monster rust thing eats iron feelers plated bug corroded armour on its back dungeon beast', 24, 16, (g, r) => {
    const R = C.rust,
      RL = hex('#a8663a');
    g.line(5, 9, 2, 5, dark(R));
    g.pts([[1, 3], [2, 3], [3, 4], [1, 5], [1, 4]], RL);
    for (const x of [7, 10, 14, 17]) {
      g.line(x, 11, x - 1, 13, dark(R));
      g.set(x - 1, 14, dark(R));
    }
    g.oval(5, 5, 18, 12, R);
    for (const x of [8, 11, 14]) g.line(x, 5, x + 1, 11, dark(R));
    g.row(5, 8, 14, RL);
    g.rect(9, 2, 13, 5, blend(ST, R, 0.5)); // a helmet it has half eaten, grown into the back
    g.row(2, 10, 12, ST);
    g.set(11, 4, K);
    g.rect(18, 8, 21, 11, dark(R));
    g.set(20, 9, P.YEL);
    if (!r) {
      g.worm([[20, 8], [22, 5], [22, 9]], 0.8, 0.6, RL);
      g.worm([[20, 10], [22, 12], [21, 14]], 0.8, 0.6, RL);
    } else {
      g.ridge(6, 17, 3, RL, 3);
      g.worm([[20, 8], [23, 3], [22, -2]], 0.9, 0.6, RL);
      g.worm([[20, 9], [23, 8], [25, 4]], 0.9, 0.6, RL);
      g.rect(20, 11, 22, 12, K);
      g.pts([[20, 11], [22, 12]], P.BONE);
      g.pts([[4, 13], [12, 14], [19, 14], [23, 12]], RL);
    }
  }, { uw: 28, ux: 1, uh: 20 });

  /* a heap of skeletons that moves as one */
  mk('skeleton-heap', 'large long pile of skeletons moving as one bone heap many skulls arms of bones ossuary monster undead', 46, 28, (g, r) => {
    const SH = hex('#6a6450'),
      B = P.BONE,
      GL = r ? hex('#9ebcc2') : null;
    g.poly([[2, 26], [6, 17], [14, 11], [26, 9], [36, 13], [43, 20], [44, 26]], SH);
    g.speckle(3, 10, 43, 26, dark(SH), 4, 2);
    for (const [a, b, c2, d] of [[5, 22, 13, 19], [16, 24, 25, 25], [30, 22, 38, 24], [12, 14, 19, 12], [27, 13, 34, 16], [8, 25, 12, 25], [36, 19, 41, 21]]) g.bone(a, b, c2, d, B);
    g.ribs(22, 15, 3, 3, B);
    g.ribs(34, 19, 2, 2, P.BONED);
    for (const [x, y] of [[8, 16], [15, 19], [27, 19], [38, 14], [4, 21]]) g.skullS(x, y, B, GL, r);
    g.line(19, 21, 22, 26, C.rust);
    if (!r) {
      g.skullS(20, 6, B);
      g.limb([[6, 18], [3, 12], [5, 8]], 1, B); // two arms feel their way
      g.pts([[4, 7], [6, 7], [5, 6]], B);
      g.limb([[40, 18], [43, 13], [41, 10]], 1, B);
      g.pts([[40, 9], [42, 9]], B);
    } else {
      // it stands: a neck of spines, a head of heads, arms of arms
      for (let y = 9; y > -10; y -= 2) {
        g.row(y, 21, 25, B);
        g.row(y - 1, 22, 24, P.BONED);
      }
      g.skullS(21, -15, B, GL, 1);
      g.skullS(17, -11, B, GL, 1);
      g.skullS(25, -11, B, GL, 1);
      for (const [v, e] of [[g, 0], [g.flip(46), 1]]) {
        v.limb([[20, -2], [12, -8], [6, -2], [3, 6]], 2, B, P.BONED);
        v.pts([[11, -9], [5, -3]], P.BONED);
        v.pts([[2, 7], [4, 7], [3, 8], [1, 6]], B);
      }
      g.line(43, 5, 45, -6, ST);
    }
  }, { uw: 48, uh: 46 });

  mk('carrion-crawler', 'large long carrion crawler giant caterpillar tentacles round its mouth many legs segmented corpse eater dungeon monster', 48, 18, (g, r) => {
    const G = hex('#6f7a48'),
      BL = hex('#a8a472'),
      T = hex('#b89a8c');
    const n = 11;
    const pos = (i) => {
      const x = 3 + i * 2.9,
        up = r ? Math.max(0, i - 6) : 0;
      return [x - up * 0.8, 8 - up * 4.2 + Math.round(Math.sin(i * 1.1) * (r ? 0 : 1))];
    };
    for (let i = 0; i < n; i++) {
      const [x, y] = pos(i);
      if (!r || i <= 7) {
        g.line(x + 1, y + 6, x, 16, dark(G));
        g.line(x + 3, y + 6, x + 4, 16, dark(G));
      } else {
        g.line(x + 4, y + 3, x + 8, y + 5, dark(G));
        g.set(x + 9, y + 5, BL);
      }
    }
    for (let i = 0; i < n; i++) {
      const [x, y] = pos(i);
      g.oval(x, y, x + 5, y + 6, G);
      g.row(y + 6, x + 1, x + 4, BL);
      g.row(y, x + 1, x + 3, lite(G));
      g.set(x + 5, y + 3, dark(G));
    }
    const [hx, hy] = pos(n);
    g.oval(hx, hy - 1, hx + 6, hy + 6, dark(G));
    g.pts([[hx + 2, hy], [hx + 5, hy]], P.YEL);
    g.rect(hx + 3, hy + 3, hx + 5, hy + 5, K);
    const tips = r
      ? [[8, -6], [11, -2], [12, 3], [11, 8], [7, 11], [3, 10], [9, -8], [4, -7]]
      : [[6, 3], [7, 5], [5, 5], [3, 5], [7, 1], [6, -1]];
    for (const [tx, ty] of tips) g.worm([[hx + 4, hy + 3], [hx + 4 + tx * 0.6, hy + 3 + ty * 0.3], [hx + 4 + tx, hy + 3 + ty]], 0.9, 0.5, T);
    if (r) g.pts([[hx + 3, hy + 3], [hx + 5, hy + 5]], P.BONE);
  }, { uw: 50, ux: 0, uh: 38 });

  mk('minotaur-starved-blind', 'large tall minotaur gone thin and blind starved bull man of the labyrinth long arms white eyes horns monster', 22, 48, (g, r) => {
    const H = hex('#6a5548'),
      F = hex('#3f322c'),
      D = dark(H);
    for (const v of [g, g.flip(21)]) {
      v.limb([[7, 36], [8, 40], [5, 43], [6, 46]], 2, D);
      v.rect(5, 45, 7, 46, K);
    }
    g.rect(7, 33, 14, 36, F);
    g.ragged(7, 14, 36, 2, 3);
    g.rect(9, 29, 12, 33, H);
    g.rect(7, 19, 14, 29, H);
    g.rect(5, 17, 16, 20, F);
    g.col(7, 21, 29, lite(H));
    for (const y of [22, 24, 26, 28]) {
      g.row(y, 8, 13, D);
      g.set(10, y, H);
      g.set(11, y, H);
    }
    if (!r)
      for (const v of [g, g.flip(21)]) {
        v.limb([[4, 19], [2, 28], [2, 37]], 2, H);
        v.pts([[1, 38], [3, 38], [2, 39], [1, 40], [3, 40]], P.BONED);
      }
    else
      for (const v of [g, g.flip(21)]) {
        v.limb([[4, 19], [-1, 13], [-4, 5]], 2, H); // groping
        v.pts([[-5, 4], [-3, 4], [-4, 3], [-6, 3], [-2, 3], [-4, 2]], P.BONED);
      }
    // the head: gaunt, the eyes grown over
    const h = g.at(0, r ? -2 : 0);
    h.rect(7, 6, 14, 13, F);
    h.rect(8, 13, 13, 17, H);
    h.col(7, 7, 12, hex('#4f4038'));
    for (const v of [h, h.flip(21)]) {
      v.pts([[6, 7], [5, 6], [4, 6], [3, 5], [2, 4], [2, 3], [6, 8], [5, 7], [4, 7], [3, 6]], P.BONE);
      v.pts([[5, 9], [4, 10]], F);
    }
    h.clear(19, 3);
    h.clear(19, 4);
    h.pts([[8, 9], [9, 9], [12, 9], [13, 9]], r ? C.white : hex('#b9b7a6'));
    h.pts([[9, 15], [12, 15]], K);
    h.rect(10, 17, 11, 18, C.brass);
    g.chain(10, 19, 9, 25, IR);
    if (r) {
      h.rect(9, 16, 12, 19, K);
      h.pts([[9, 16], [12, 16], [10, 19]], P.BONE);
      h.row(20, 9, 12, H);
      h.pts([[8, 8], [13, 8]], C.white);
    }
  }, { uw: 36, uh: 50 });

  const gob = (g, y, r, G) => {
    g.rect(4, y, 11, y + 6, G);
    g.row(y - 1, 5, 10, G);
    g.col(4, y, y + 5, lite(G));
    for (const v of [g, g.flip(15)]) v.pts([[3, y + 1], [2, y + 1], [1, y], [3, y + 2], [2, y + 2], [3, y + 3]], dark(G));
    g.pts([[5, y + 2], [10, y + 2]], P.YEL);
    g.rect(7, y + 3, 8, y + 4, dark(G));
    if (r) {
      g.maw(5, y + 5, 10, y + 7, P.BONE);
      g.pts([[5, y + 1], [10, y + 1]], K);
    } else g.row(y + 6, 6, 9, K);
  };
  mk('goblin-totem', 'large tall goblin totem three goblins tall stacked in one coat grown together three heads six arms knives', 16, 46, (g, r) => {
    const CO = hex('#4a3a30'),
      G = P.GOB;
    g.rect(4, 10, 11, 43, CO);
    g.col(4, 10, 43, lite(CO));
    g.col(11, 10, 43, dark(CO));
    g.rect(3, 38, 12, 43, CO);
    g.ragged(3, 12, 43, 2, 4);
    g.pts([[5, 44], [6, 44], [9, 44], [10, 44]], G);
    g.pts([[7, 12], [7, 26], [7, 40]], C.brass);
    for (const [y, v] of [[12, 0], [26, 1]]) {
      if (!r) {
        g.col(3, y, y + 5, CO);
        g.col(12, y, y + 5, dark(CO));
      }
    }
    if (!r) {
      g.rect(2, 11, 3, 18, CO);
      g.rect(12, 11, 13, 18, dark(CO));
      g.pts([[2, 19], [3, 19], [12, 19], [13, 19]], G);
    } else
      [11, 25, 37].forEach((y, i) => {
        for (const [v, e] of [[g, 0], [g.flip(15), 1]]) {
          v.limb([[4, y], [0, y - 2 + i], [-3, y - 5 + i * 2]], 2, CO);
          v.rect(-4, y - 7 + i * 2, -3, y - 6 + i * 2, G);
          v.line(-4, y - 8 + i * 2, -5, y - 12 + i * 2, lite(ST)); // each has a knife
        }
      });
    gob(g, 2, r, G);
    gob(g, 16, r, hex('#5f7a50'));
    gob(g, 30, r, hex('#7a7c48'));
  }, { uw: 30, uh: 50 });

  mk('oubliette-dweller', 'oubliette dweller thing in the pit under the grate pale prisoner forgotten fingers through the bars blind eyes', 22, 18, (g, r) => {
    const S = hex('#c9c6b4'),
      SN = C.stone;
    g.oval(1, 9, 20, 16, SN);
    g.row(9, 6, 15, lite(SN));
    g.oval(3, 10, 18, 15, K);
    if (!r) {
      for (const x of [6, 9, 12, 15]) g.col(x, 10, 15, IR);
      g.row(12, 3, 18, IR);
      g.row(13, 3, 18, IRD);
      g.pts([[8, 14], [13, 14]], P.EYE);
      for (const x of [4, 5, 7, 14, 16, 17]) g.col(x, 9, 11, S); // fingers through the bars
      g.pts([[4, 8], [7, 8], [14, 8], [17, 8]], S);
    } else {
      g.poly([[15, 4], [23, 1], [24, 3], [16, 7]], IR); // the grate, thrown off
      g.line(17, 4, 18, 6, K);
      g.line(20, 3, 21, 5, K);
      for (const v of [g, g.flip(21)]) {
        v.limb([[8, -4], [3, 2], [3, 10]], 2, S);
        v.pts([[1, 11], [2, 11], [4, 11], [5, 11], [2, 12], [4, 12]], S);
      }
      g.rect(8, -6, 13, 12, S);
      g.col(8, -5, 12, lite(S));
      for (const y of [0, 2, 4, 6]) g.row(y, 9, 12, dark(S));
      g.oval(6, -15, 15, -6, S);
      g.oval(7, -12, 9, -10, C.white);
      g.oval(12, -12, 14, -10, C.white);
      g.pts([[8, -11], [13, -11]], hex('#aeb4b0'));
      g.rect(10, -8, 11, -8, K);
      g.pts([[7, -13], [14, -13]], dark(S));
    }
  }, { uw: 28, ux: 2, uh: 36 });

  mk('dragon-egg-thing', 'the dragon unhatched egg thing cracked egg half formed wyrmling too many eyes yolk hatching wrong', 20, 24, (g, r) => {
    const E = hex('#4f5a52'),
      EL = hex('#6f7c6e'),
      F = hex('#b08a86');
    for (const [a, b, c2, d] of [[2, 21, 8, 21], [11, 21, 17, 21]]) g.bone(a, b, c2, d, P.BONED);
    g.pts([[3, 22], [9, 22], [15, 22], [17, 22], [6, 21]], C.gold);
    g.oval(4, 4, 15, 21, E);
    g.oval(5, 3, 14, 12, E);
    for (let y = 6; y < 20; y += 3) for (let x = 6 + (y % 2) * 2; x < 14; x += 3) g.set(x, y, EL);
    g.col(5, 8, 16, EL);
    if (!r) {
      for (const [x, y] of [[9, 3], [10, 4], [9, 5], [10, 6], [11, 7], [10, 8], [9, 9], [8, 12], [9, 13], [11, 12], [12, 13]]) g.set(x, y, K);
      g.rect(9, 10, 11, 11, K);
      g.set(10, 10, P.YEL);
      g.pts([[12, 16], [13, 17], [13, 16]], F);
      g.set(12, 15, K);
    } else {
      g.clearRect(4, 2, 15, 7);
      g.rect(6, 8, 13, 9, K);
      for (const x of [5, 8, 11, 14]) g.set(x, 7, E);
      g.worm([[10, 9], [8, 3], [11, -2], [14, -4]], 1.8, 1.4, F);
      g.oval(10, -10, 19, -3, F);
      g.rect(17, -6, 21, -4, F);
      g.row(-3, 17, 21, K);
      g.pts([[18, -3], [20, -3]], P.BONE);
      g.rect(12, -8, 13, -7, P.YEL);
      g.set(13, -7, K);
      g.pts([[16, -8], [15, -5], [11, -5]], P.YEL);
      g.limb([[5, 12], [0, 6], [1, 0]], 1, F); // one wing, all bone
      g.line(0, 6, -2, 2, F);
      g.line(0, 6, 3, 2, F);
      g.pts([[9, 11], [12, 13], [7, 15]], P.BILE);
    }
  }, { uw: 28, ux: 4, uh: 36 });

  mk('slime-bones', 'green slime ooze puddle with bones in it crawling jelly small dungeon vermin', 14, 9, (g, r) => {
    const S = P.SLIME,
      B = blend(P.BONE, S, 0.3);
    if (!r) {
      g.oval(1, 3, 12, 7, S);
      g.oval(3, 2, 8, 5, S);
      g.row(3, 4, 7, lite(S));
      g.line(4, 6, 8, 5, B);
      g.pts([[9, 6], [10, 5], [3, 5]], B);
    } else {
      g.oval(1, 4, 12, 7, S);
      g.rect(4, -5, 9, 5, S);
      g.oval(3, -8, 10, -1, S);
      g.col(4, -6, 4, lite(S));
      g.skullS(5, -6, B, null, 1);
      g.limb([[4, 0], [1, -2], [0, -5]], 1, S);
      g.limb([[9, 0], [12, -2], [13, -5]], 1, dark(S));
      g.line(6, 2, 8, 5, B);
    }
    g.pts([[2, 7], [11, 7]], dark(S));
  }, { uw: 16, uh: 18 });

  mk('rat-half-skeleton', 'dungeon rat half skeleton front fur back bones undead rat vermin small', 15, 9, (g, r) => {
    const G = hex('#4f4a48');
    g.line(1, 6, 4, 5, P.BONED);
    g.pts([[2, 6], [1, 5]], P.BONE);
    for (const x of [4, 6]) g.col(x, 3, 6, P.BONE); // ribs and spine behind
    g.row(3, 3, 7, P.BONE);
    g.set(5, 7, P.BONE);
    const h = g.at(0, r ? -2 : 0);
    h.oval(7, 3, 11, 6 + (r ? 2 : 0), G);
    h.rect(10, 3, 12, 5, G);
    h.set(9, 2, P.RAW);
    h.set(11, 3, P.RED);
    g.pts([[8, 7], [10, 7]], P.RAW);
    if (!r) h.set(13, 5, P.RAW);
    else {
      h.set(13, 4, P.RAW);
      h.rect(11, 6, 12, 6, K);
      h.set(12, 6, P.BONE);
      h.set(12, 7, G);
    }
  }, { uh: 11 });

  mk('skull-spider', 'skull spider human skull on spider legs scuttling bone small dungeon vermin', 14, 10, (g, r) => {
    const L = hex('#3a3034');
    const y = r ? -3 : 0;
    if (!r) for (const v of [g, g.flip(13)]) v.pts([[3, 5], [2, 6], [2, 7], [1, 8], [3, 7], [3, 8], [4, 8]], L);
    else g.spiderLegs(6.5, 3, 3, 8, L, { n: 4, step: 1, rise: 6, splay: 0 });
    const h = g.at(0, y);
    h.rect(4, 2, 9, 5, P.BONE);
    h.row(1, 5, 8, P.BONE);
    h.row(6, 5, 8, P.BONE);
    h.col(4, 2, 4, lite(P.BONE));
    h.rect(5, 3, 6, 4, K);
    h.rect(8, 3, 9, 4, K);
    h.pts([[5, 7], [7, 7]], P.BONED);
    if (r) {
      h.pts([[5, 4], [8, 4]], P.RED);
      h.pts([[5, 8], [8, 8], [5, 9], [8, 9]], P.BONE);
      h.row(7, 5, 8, K);
    }
  }, { uw: 26, uh: 14 });

  mk('key-crawler', 'jailer key ring that crawls keys for legs iron ring scuttling small eye', 13, 10, (g, r) => {
    g.oval(3, 1, 9, 6, IR);
    g.oval(5, 2, 7, 5, r ? P.EYE : K);
    if (r) g.set(6, 3, K);
    if (r) g.set(6, 4, P.RED);
    g.row(1, 5, 7, lite(IR));
    const key = (x0, y0, x1, y1, c) => {
      g.line(x0, y0, x1, y1, c);
      g.set(x1 + 1, y1, c);
      g.set(x1 + 1, y1 - 1, c);
    };
    if (!r) for (const [x, c] of [[2, C.brass], [4, ST], [6, IR], [8, C.brass], [10, ST]]) key(x, 6, x, 8, c);
    else {
      key(3, 5, 0, 8, C.brass);
      key(4, 6, 3, 8, ST);
      key(8, 6, 9, 8, IR);
      key(9, 5, 11, 8, C.brass);
      g.line(3, 2, 0, -2, ST);
      g.line(9, 2, 12, -2, lite(ST));
      g.pts([[0, -3], [1, -3], [12, -3], [13, -3]], ST);
    }
  }, { uw: 17, uh: 14 });
};
