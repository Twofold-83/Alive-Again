/* The dream world: beings of sleep that turn on the sleeper. Drawn for be-dream.js (see _be-dream-kit.js). */
module.exports = (kit, H, mk) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const { man, face, FACES, vd, NIGHT, EYE, GUM, TOOTH } = H;
  const MOON = hex('#d8d3a8'),
    MOOND = hex('#aaa67e'),
    CLOUD = hex('#bcc4d2'),
    CLOUDD = hex('#8b97ae'),
    STORM = hex('#5a6074'),
    DUSK = hex('#2f3558'),
    DUSKL = hex('#4a5282'),
    WOOL = hex('#cdc6b2'),
    LILAC = hex('#8878a6'),
    PALE = hex('#d6c2a6'),
    PJ = hex('#7083aa'),
    STAR = hex('#e6d478'),
    INK = hex('#262231'),
    RED = hex('#c23a2e'),
    SHEET = hex('#d9d5c8'),
    LIP = hex('#a8626a'),
    FUR = hex('#6a5440');

  /* ---------- the sky ---------- */
  mk('moon-mouth', 'moon with a mouth face in the sky pale floating teeth monster', 24, 28, (g, r) => {
    g.disc(11.5, 11.5, 10, MOON);
    g.bevel();
    for (const [x, y, s] of [[6, 4, 1], [16, 3, 0], [18, 16, 1], [3, 12, 0], [11, 19, 0]]) {
      g.rect(x, y, x + s, y + s, MOOND);
      g.set(x + s, y + s, dark(MOOND));
    }
    if (!r) {
      g.row(9, 5, 8, vd(MOON)); // asleep
      g.row(9, 14, 17, vd(MOON));
      g.pts([[5, 8], [17, 8]], vd(MOON));
      g.path([[5, 14], [7, 15], [16, 15], [18, 14]], vd(MOON));
      g.pts([[9, 16], [11, 16], [13, 16]], TOOTH); // the tips of its teeth
    } else {
      g.eye(7, 7, 2, RED);
      g.eye(16, 7, 2, RED);
      g.jaws((v) => v.poly([[3, 11], [20, 11], [19, 16], [15, 20], [8, 20], [4, 16]], 1), { len: 2 });
      g.rect(10, 16, 13, 17, LIP); // a tongue
    }
    g.shadow(5, 18, 25);
  });

  mk('cloud-whale', 'whale of cloud with teeth inside floating sky beast grey monster', 48, 28, (g, r) => {
    g.tube([[10, 13], [6, 10], [3, 6]], 3, 1.2, CLOUD, CLOUD); // the tail
    g.poly([[1, 2], [6, 5], [2, 9]], CLOUD);
    g.cloud(7, 2, 45, 20, CLOUD, 5);
    g.oval(7, 6, 45, 20, CLOUD);
    g.over(8, 15, 45, 20, CLOUDD, (x, y) => y > 16 || (x + y) % 2 === 0);
    g.bevel();
    for (const [x, y] of [[14, 8], [22, 6], [30, 7], [18, 12]]) g.row(y, x, x + 2, lite(CLOUD)); // puffs
    for (const x of [22, 25, 28]) g.col(x, 17, 19, STORM); // the pleats of the throat
    g.rect(38, 10, 39, 11, K);
    g.set(38, 10, EYE);
    if (!r) {
      g.path([[29, 15], [36, 15], [44, 13]], STORM);
      g.pts([[32, 16], [35, 16], [38, 15], [41, 15]], TOOTH);
    } else {
      g.jaws((v) => v.poly([[27, 13], [45, 11], [46, 16], [40, 21], [31, 21], [27, 17]], 1), { len: 2 });
      g.pts([[31, 16], [34, 16], [37, 16], [40, 16], [33, 18], [36, 18], [39, 18]], TOOTH); // and more teeth behind
      g.set(39, 10, RED);
      g.after(() => {
        for (const [x, y] of [[12, 22], [17, 23], [23, 22], [28, 24], [20, 25], [14, 25]]) g.col(x, y, y + 1, CLOUDD); // it rains
      });
    }
    g.shadow(10, 40, 26);
  });

  mk('star-eater', 'star eater tall gaunt dark thing with a belly full of stars night sky demon', 24, 48, (g, r) => {
    g.limb([[9, 35], [8, 41], [8, 44]], 3, DUSK); // legs
    g.limb([[13, 35], [14, 41], [14, 44]], 3, DUSK);
    g.row(46, 6, 9, DUSK);
    g.row(46, 13, 17, DUSK);
    g.oval(5, 22, 16, 36, DUSK); // the belly
    g.rect(8, 15, 13, 24, DUSK);
    g.rect(10, 8, 11, 15, DUSK); // the neck
    if (!r) {
      g.limb([[7, 16], [4, 26], [3, 37]], 2, DUSK); // arms down to the knees
      g.limb([[14, 16], [18, 24], [19, 30]], 2, DUSK);
      g.disc(10.5, 5, 3.5, DUSK);
    } else {
      g.limb([[7, 16], [3, 8], [2, -4]], 2, DUSK); // one arm up for another star
      g.limb([[14, 16], [18, 24], [19, 30]], 2, DUSK);
      g.poly([[4, -3], [17, -3], [13, 7], [8, 7]], DUSK); // the head thrown back, all mouth
    }
    g.bevel();
    g.oval(7, 25, 14, 34, NIGHT); // you can see into it
    for (const [x, y] of r ? [[9, 27], [12, 29], [8, 31], [11, 32], [13, 26], [10, 30]] : [[9, 27], [12, 30], [10, 32]]) {
      g.set(x, y, STAR);
      g.set(x + 1, y, DUSKL);
      g.set(x, y + 1, DUSKL);
    }
    if (!r) {
      g.pts([[9, 4], [12, 4]], EYE);
      g.row(6, 8, 13, K);
      g.hand(3, 38, 'd', DUSK, 2);
      g.rect(19, 31, 21, 33, STAR); // a star in its fist
      g.pts([[20, 30], [20, 34], [18, 32], [22, 32]], STAR);
      g.set(20, 32, lite(STAR));
    } else {
      g.jaws((v) => v.poly([[5, -3], [16, -3], [12, 4], [9, 4]], 1), { len: 2, bot: false });
      g.pts([[7, 5], [14, 5]], EYE);
      g.hand(2, -5, 'u', DUSK, 2);
      g.rect(18, 30, 20, 32, STAR);
      g.set(19, 31, lite(STAR));
      g.after(() => {
        g.rect(10, -8, 11, -7, STAR); // the next one, falling in
        g.pts([[10, -9], [11, -6], [9, -7], [12, -8]], STAR);
      });
    }
  }, { h: 60, w: 26, dx: 1 });

  /* ---------- sheep ---------- */
  const sheepHead = (g, x, y, r, flip) => {
    // a black face, looking at you: 5 wide, 7 tall
    g.rect(x, y, x + 4, y + 5, INK);
    g.row(y + 6, x + 1, x + 3, INK);
    g.pts([[x - 1, y + 1], [x + 5, y + 1]], INK); // ears
    g.pts([[x + 1, y + 2], [x + 3, y + 2]], r ? RED : EYE);
    if (r) {
      g.rect(x + 1, y + 4, x + 3, y + 6, GUM);
      g.pts([[x + 1, y + 4], [x + 3, y + 4], [x + 2, y + 6]], TOOTH);
    } else g.set(x + 2, y + 5, dark(LIP));
  };
  mk('sheep-counter', 'sheep that counts you tally marks on its wool staring animal gone wrong', 22, 18, (g, r) => {
    for (const x of [5, 8, 13, 16]) g.col(x, 11, 16, INK);
    g.cloud(2, 2, 17, 12, WOOL, 3);
    g.bevel();
    g.speckle(3, 4, 16, 11, dark(WOOL), 7, 2);
    sheepHead(g, 15, 3, r);
    if (!r) {
      for (const x of [5, 7, 9, 11]) g.col(x, 6, 9, vd(WOOL)); // it keeps count
      g.line(4, 9, 12, 6, vd(WOOL));
    } else {
      g.jaws((v) => v.oval(3, 5, 13, 11, 1), { len: 2 }); // the flank opens
      g.pts([[16, 4], [18, 4]], EYE);
      g.pts([[4, 3], [9, 2]], RED);
    }
  });
  mk('sheep-chain', 'chain of sheep fused in one long woolly body leaping a fence many legs heads', 48, 24, (g, r) => {
    g.rect(21, 14, 22, 22, C.wood); // the fence they jump
    g.rect(27, 14, 28, 22, C.wood);
    g.row(16, 18, 31, C.woodLight);
    g.row(19, 18, 31, C.woodLight);
    const legs = [[5, 22], [8, 22], [13, 17], [17, 14], [24, 12], [31, 14], [35, 17], [40, 22], [43, 22]];
    for (const [x, y] of legs) g.col(x, 8, y, INK);
    const p = g.tube([[7, 16], [15, 10], [24, 7], [33, 10], [41, 16]], 4.6, 4.6, WOOL, WOOL);
    for (let i = 0; i < p.length; i += 3) g.disc(p[i][0], p[i][1] - 4, 2, WOOL);
    g.bevel();
    g.speckle(2, 2, 46, 20, dark(WOOL), 7, 4);
    for (const x of [13, 22, 31, 38]) g.line(x, 10, x + 1, 14, vd(WOOL)); // where one sheep ends and the next begins
    sheepHead(g.flip(47), 41, 13, r);
    sheepHead(g, 41, 13, r);
    if (r) {
      g.rect(21, -2, 26, 3, WOOL); // a third looks up out of the middle
      sheepHead(g, 21, -3, r);
    }
  }, { h: 29 });

  /* ---------- sleepers ---------- */
  mk('pillow-sleeper', 'pillow faced sleeper tall figure in a nightshirt with a pillow for a head sleepwalker', 20, 46, (g, r) => {
    const f = g.at(2, 1);
    man(f, { head: false, top: PJ, robe: PJ, sleeve: PJ, tl: 14, ll: 18, hand: PALE, al: 18, claw: 2, arms: r ? 'reach' : 'down' });
    f.over(3, 12, 12, 43, dark(PJ), (x) => x % 3 === 0); // stripes
    f.rect(5, 43, 6, 43, PALE); // bare toes
    f.rect(9, 43, 10, 43, PALE);
    f.rect(7, 10, 8, 12, PALE);
    f.rect(1, 2, 14, 10, SHEET); // the pillow
    f.pts([[0, 1], [15, 1], [0, 11], [15, 11], [1, 1], [14, 1], [1, 11], [14, 11]], SHEET);
    g.bevel();
    f.row(10, 2, 13, dark(SHEET));
    if (!r) {
      f.pts([[4, 5], [5, 5], [10, 5], [11, 5]], dark(SHEET)); // a face pressed into it from inside
      f.pts([[4, 6], [11, 6]], vd(SHEET));
      f.rect(7, 7, 8, 8, dark(SHEET));
      f.row(9, 6, 9, vd(SHEET));
    } else {
      f.rect(3, 3, 5, 4, K);
      f.rect(10, 3, 12, 4, K);
      f.pts([[4, 4], [11, 4]], RED);
      f.jaws((v) => v.rect(2, 6, 13, 9, 1), {});
      g.after(() => f.pts([[-2, 2], [17, 0], [16, 6], [-3, 8], [5, -1], [11, -2]], SHEET)); // feathers
    }
  }, { w: 32, h: 49, dx: 6 });

  mk('double', 'the friend who has your face double doppelganger wearing a face like a mask person', 16, 33, (g, r) => {
    const SH = hex('#4a4456'),
      MASK = hex('#dcc9ad');
    if (!r) {
      man(g, { skin: MASK, hand: C.flesh, face: 'hollow', hair: ['parted', C.woodDark], top: C.mustard, legs: C.navy, shirt: C.cream });
      g.pts([[3, 6], [12, 6], [4, 11], [11, 11]], K); // the string, and the edge of it
      g.row(9, 6, 9, vd(MASK));
      g.pts([[5, 8], [10, 8]], vd(MASK)); // a smile that is drawn on
    } else {
      man(g, { skin: SH, hand: C.flesh, face: 'none', hair: ['parted', C.woodDark], top: C.mustard, legs: C.navy, shirt: C.cream, arms: 'hold' });
      g.pts([[5, 5], [7, 6], [9, 5], [10, 7], [6, 8], [8, 9]], EYE); // what was under it
      face(g, 4, 14, MASK); // your face, in its hands
      FACES.hollow(g, 4, 14, MASK, K);
      g.row(20, 6, 9, vd(MASK));
      g.pts([[5, 19], [10, 19]], vd(MASK));
      g.rect(3, 17, 4, 19, C.flesh);
      g.rect(11, 17, 12, 19, dark(C.flesh));
    }
  });

  mk('crawling-bed', 'bed that crawls on many arms and hands blanket mouth furniture monster', 48, 26, (g, r) => {
    const Q = hex('#6e5a84');
    for (let i = 0; i < 6; i++) {
      const x = 7 + i * 7,
        up = r && i > 3;
      if (up) g.limb([[x, 18], [x + 4, 16], [x + 7, 12 - (i - 4) * 4]], 2, PALE); // the front ones reach
      else g.limb([[x, 18], [x - 2 + (i % 2) * 4, 21], [x, 23]], 2, PALE);
      if (!up) g.row(24, x - 1, x + 2, dark(PALE));
    }
    g.box(2, 3, 4, 20, C.wood); // head board
    g.rect(1, 2, 5, 3, C.woodLight);
    g.box(42, 9, 44, 20, C.wood); // foot board
    g.rect(5, 17, 41, 18, C.woodDark); // the rail
    g.rect(5, 12, 41, 16, SHEET);
    g.oval(6, 8, 14, 12, C.white); // pillow
    g.rect(15, r ? 7 : 10, 41, r ? 10 : 15, Q); // blanket
    g.oval(17, r ? 3 : 6, 34, r ? 9 : 13, Q); // and who is under it
    g.bevel();
    for (const x of [20, 27, 34]) g.col(x, r ? 6 : 9, r ? 10 : 15, dark(Q)); // quilting
    g.row(r ? 10 : 15, 15, 41, dark(Q));
    if (r) {
      g.jaws((v) => v.rect(15, 11, 41, 15, 1), { len: 2 });
      g.rect(24, 13, 30, 14, LIP);
      g.pts([[22, 6], [28, 6]], STAR); // eyes through the wool
      for (const [x, y] of [[41, 5], [46, 1]]) g.hand(x, y, 'u', PALE, 1);
    } else {
      g.pts([[22, 9], [28, 9]], vd(Q));
      g.row(16, 15, 41, dark(SHEET));
    }
  }, { h: 30, w: 52 });

  mk('nightgown-jelly', 'empty nightgown floating like a jellyfish hair tendrils ghost no head', 16, 32, (g, r) => {
    const W = hex('#cfd3d0'),
      HAIRC = hex('#3a3240');
    g.strands(3, 12, 19, r ? 30 : 27, r ? HAIRC : hex('#9aa4ac'), 4, r ? 1 : 2);
    g.poly([[5, 8], [10, 8], [13, 20], [2, 20]], W);
    g.rect(5, 3, 10, 8, W);
    if (!r) {
      g.rect(2, 4, 4, 11, W); // limp sleeves
      g.rect(11, 4, 13, 11, W);
    } else {
      g.limb([[4, 4], [0, 6], [-3, 3]], 3, W);
      g.limb([[11, 4], [15, 6], [18, 3]], 3, W);
      g.strands(-4, -2, 2, -3, HAIRC, 2);
      g.strands(17, 19, 2, -3, HAIRC, 3);
    }
    g.bevel();
    for (const x of [5, 8, 11]) g.line(x, 10, x - 1 + (x > 7 ? 2 : 0), 19, dark(W));
    g.row(20, 2, 13, dark(W));
    g.rect(6, 2, 9, 3, K); // nobody in the collar
    if (r) {
      g.strands(5, 10, 3, -4, HAIRC, 7);
      g.rect(6, -1, 9, 2, HAIRC);
      g.eye(8, 1, 1, RED);
    }
    g.shadow(3, 12, 30);
  }, { w: 28, h: 38, dx: 6 });

  mk('sandman-sack', 'sandman sack that moves bag of sand with feet and a hand creeping out', 18, 24, (g, r) => {
    const J = hex('#9a8862'),
      ARM = hex('#8f8a80');
    g.rect(4, 21, 6, 22, PALE); // it has feet
    g.rect(10, 21, 13, 22, PALE);
    g.oval(2, 7, 15, 21, J);
    g.rect(3, 15, 14, 20, J);
    g.rect(6, 3, 10, 8, J);
    g.pts([[5, 2], [7, 1], [8, 2], [10, 1], [11, 2]], J);
    if (r) {
      g.limb([[5, 5], [-1, 6], [-4, 1]], 2, ARM);
      g.limb([[11, 5], [17, 8], [21, 5]], 2, ARM);
      g.hand(-4, 0, 'u', ARM, 2);
      g.hand(22, 5, 'r', ARM, 2);
    }
    g.bevel();
    g.row(8, 5, 11, C.straw);
    g.speckle(2, 9, 15, 21, dark(J), 6, 9);
    g.line(5, 10, 4, 20, dark(J));
    g.rect(9, 14, 12, 17, LILAC); // a patch
    g.set(10, 15, STAR);
    if (!r) {
      g.pts([[6, 12], [9, 12]], K); // eye holes
      g.col(12, 2, 6, ARM); // a hand over the edge
      g.pts([[11, 3], [13, 4], [12, 7]], ARM);
      g.after(() => g.pts([[14, 9], [15, 13], [14, 17]], STAR)); // sand
    } else {
      g.rect(6, 2, 10, 6, K); // the neck gapes
      g.pts([[7, 4], [9, 4]], STAR);
      g.pts([[6, 12], [9, 12]], STAR);
      g.after(() => g.pts([[20, 8], [22, 10], [19, 12], [23, 13], [21, 16], [-3, 5], [-5, 8]], STAR));
    }
  }, { w: 36, h: 30, dx: 7 });

  /* ---------- things that carry you off ---------- */
  mk('stair-walker', 'staircase with legs walking stairs bare human legs carpet tongue furniture monster', 30, 46, (g, r) => {
    const tops = [];
    for (let i = 0; i < 5; i++) tops.push([2 + 5 * i, 24 - 4 * i]);
    for (const [x, y] of tops) g.rect(x, y, 26, y + 7, C.wood);
    const under = (x) => Math.round(31 - (x - 2) * 0.8);
    for (let x = 2; x <= 26; x++) g.clearRect(x, under(x) + 1, x, 45);
    // the long legs under it
    const F = C.flesh;
    [[5, -1], [11, 1], [18, -1], [23, 1]].forEach(([x, d], i) => {
      const y0 = under(x + 1),
        kn = Math.round((y0 + 44) / 2);
      if (r && i % 2) {
        g.limb([[x + 1, y0], [x + 5, kn], [x, 40]], 3, F); // striding
        g.rect(x - 2, 40, x + 2, 41, dark(F));
      } else {
        g.rect(x, y0, x + 2, 44, F);
        g.rect(x, y0, x + 3, kn - 2, F); // thigh
        g.col(x + 2, kn, 44, dark(F));
        g.row(kn, x, x + 2, dark(F)); // knee
        g.rect(d > 0 ? x : x - 2, 43, d > 0 ? x + 4 : x + 2, 44, F);
        g.set(d > 0 ? x + 4 : x - 2, 44, dark(F));
      }
    });
    g.rect(26, 2, 27, 12, C.woodDark); // newel post
    g.rect(25, 1, 28, 2, C.woodLight);
    g.bevel();
    for (const [x, y] of tops) {
      g.row(y, x, x + 5, C.wine); // the runner
      g.col(x, y, y + 3, dark(C.wine));
      if (r) {
        g.col(x, y + 1, y + 3, K); // every riser a mouth
        g.col(x + 1, y + 1, y + 3, GUM);
        g.pts([[x + 1, y + 1], [x + 1, y + 3]], TOOTH);
      }
    }
    if (!r) g.pts([[20, 13], [22, 12]], EYE); // something looks out from under the top step
    else {
      g.pts([[20, 13], [22, 12]], RED);
      g.limb([[2, 27], [-2, 34], [-7, 42]], 3, C.wine); // the carpet rolls out
      g.row(44, -8, -3, C.wine);
    }
  }, { w: 42, dx: 9 });

  mk('night-mare', 'night mare black horse with a neck far too long white eyes human teeth', 30, 48, (g, r) => {
    const B = hex('#2c2836'),
      M = hex('#151219');
    for (const [x, f] of [[5, 0], [9, 0], [17, 1], [20, 1]]) {
      if (r && x === 20) {
        g.limb([[20, 37], [25, 38], [25, 43]], 2, B); // a hoof raised
        g.row(44, 24, 26, M);
      } else {
        g.rect(x, 37, x + 1, 45, f ? B : dark(B));
        g.row(46, x - 1, x + 1, M);
        g.set(x + 1, 41, lite(B));
      }
    }
    g.oval(3, 30, 22, 39, B);
    g.strands(2, 3, 31, 45, M, 5);
    let p;
    if (!r) {
      p = g.tube([[19, 32], [21, 22], [20, 12], [22, 5]], 3, 2, B);
      g.oval(20, 2, 27, 7, B); // the head, high up
      g.rect(24, 5, 28, 9, B);
      g.pts([[21, 1], [23, 1]], B);
    } else {
      p = g.tube([[19, 32], [20, 20], [25, 9], [33, 8], [36, 16]], 3, 2, B);
      g.oval(32, 15, 38, 22, B); // the head comes down to you
      g.rect(33, 21, 37, 27, B);
      g.pts([[32, 14], [37, 14]], B);
    }
    g.bevel();
    for (let i = 4; i < p.length - 3; i += 2) g.col(p[i][0] - 3, p[i][1], p[i][1] + 3 + (i % 3), M); // the mane
    if (!r) {
      g.set(23, 4, EYE);
      g.set(27, 8, M);
      g.row(9, 25, 28, M);
    } else {
      g.pts([[33, 17], [37, 17]], RED);
      g.rect(33, 23, 37, 26, GUM);
      g.teeth(33, 37, 23, C.white, 1);
      g.teeth(33, 37, 26, C.white, 1);
      g.row(24, 34, 36, K);
      g.row(25, 34, 36, K);
    }
  }, { w: 41 });

  mk('paper-ferryman', 'paper boat ferryman hooded figure in a folded paper boat pole lantern river', 44, 32, (g, r) => {
    const P = hex('#cfc8b4'),
      ROBE = hex('#2b2838');
    g.oval(1, 25, 42, 30, C.water);
    g.line(17, 2, 19, 26, C.woodDark); // the pole
    g.rect(9, 9, 14, 21, ROBE); // the ferryman
    g.rect(8, 14, 15, 21, ROBE);
    g.rect(9, 4, 14, 10, ROBE);
    g.row(3, 10, 13, ROBE);
    if (!r) g.limb([[14, 12], [17, 14]], 2, ROBE);
    else g.limb([[14, 12], [24, 10], [33, 12]], 2, ROBE); // the fare
    g.poly([[3, 20], [40, 20], [33, 28], [10, 28]], P);
    g.poly([[16, 20], [22, 9], [28, 20]], P);
    g.col(38, 12, 20, C.woodDark); // lantern on the bow
    g.rect(36, 12, 38, 12, C.woodDark);
    g.rect(35, 13, 37, 16, C.ironDark);
    g.bevel();
    g.rect(35, 14, 37, 15, r ? C.flameLight : C.flame);
    g.line(22, 9, 22, 28, dark(P)); // folds
    g.line(16, 20, 10, 28, dark(P));
    g.line(28, 20, 33, 28, dark(P));
    g.row(20, 4, 39, lite(P));
    for (const [x, y, n] of [[13, 23, 5], [14, 25, 4], [24, 22, 6], [25, 24, 5], [24, 26, 4]]) g.row(y, x, x + n, hex('#9d988c')); // newsprint
    g.row(28, 3, 40, lite(C.water));
    g.pts([[5, 29], [12, 30], [30, 30], [38, 29]], lite(C.water));
    g.rect(10, 5, 13, 9, r ? P : NIGHT); // under the hood
    if (r) {
      g.rect(10, 6, 11, 7, K);
      g.set(13, 6, K);
      g.set(13, 7, K);
      g.row(9, 11, 12, K);
      g.hand(34, 12, 'r', P, 2);
      g.after(() => g.pts([[34, 12], [38, 12], [36, 11], [36, 17]], C.flameLight));
    } else g.pts([[11, 7], [13, 7]], hex('#5a5870'));
  }, { w: 46 });

  /* ---------- birds and beasts ---------- */
  mk('lullaby-bird', 'lullaby bird with a child face and voice singing songbird wrong', 16, 22, (g, r) => {
    const B = hex('#6e7f96'),
      HAIRC = hex('#5a4030');
    g.col(6, 17, 20, C.straw);
    g.col(9, 17, 20, C.straw);
    g.pts([[5, 20], [7, 20], [8, 20], [10, 20]], C.straw);
    g.poly([[3, 12], [1, 18], [5, 16]], dark(B)); // tail
    g.oval(3, 8, 12, 17, B);
    if (r) {
      g.poly([[4, 10], [-6, 3], [-7, 9], [-3, 13], [3, 14]], dark(B));
      g.poly([[11, 10], [21, 3], [22, 9], [18, 13], [12, 14]], dark(B));
    }
    g.rect(5, 2, 10, 8, PALE);
    g.rect(4, 3, 11, 6, PALE);
    g.bevel();
    if (r) for (const x of [-4, -1, 2, 14, 17, 20]) g.line(x, 6 + Math.abs(x - 8) * 0.2, x + (x < 8 ? 2 : -2), 12, vd(B));
    else g.oval(6, 10, 11, 15, dark(B)); // a folded wing
    g.row(1, 5, 10, HAIRC); // a child's fringe
    g.row(2, 4, 11, HAIRC);
    g.pts([[4, 3], [4, 4], [11, 3], [11, 4]], HAIRC);
    if (!r) {
      g.pts([[6, 5], [9, 5]], K);
      g.set(8, 7, K);
      g.pts([[5, 6], [10, 6]], hex('#c9a092'));
    } else {
      g.rect(5, 4, 6, 5, K);
      g.rect(9, 4, 10, 5, K);
      g.rect(6, 7, 9, 12, K); // it opens much too far
      g.pts([[6, 7], [8, 7], [7, 12], [9, 12]], C.white);
    }
  }, { w: 32, dx: 8 });

  mk('swan-hand', 'swan whose neck is a human arm and whose head is a hand white bird wrong', 20, 24, (g, r) => {
    const W = hex('#d4d2c6'),
      A = hex('#c9a688');
    g.pts([[5, 22], [6, 22], [10, 22], [11, 22]], hex('#3a3540'));
    g.oval(2, 13, 14, 21, W);
    g.poly([[1, 12], [5, 14], [2, 16]], W);
    if (r) g.poly([[4, 14], [1, 3], [5, 6], [8, 4], [11, 14]], W); // wings up
    const p = g.tube([[12, 16], [15, 11], [12, 6], [15, 3]], 1.6, 1.4, A);
    if (!r) {
      g.rect(15, 1, 17, 4, A);
      g.row(2, 17, 18, A); // fingers pinched to a beak
      g.row(3, 17, 18, dark(A));
    } else {
      g.rect(15, 0, 18, 4, A);
      for (const [x, y] of [[14, -4], [17, -5], [20, -4], [22, -1], [21, 4]]) g.line(17, 2, x, y, A); // it opens
    }
    g.bevel();
    g.path([[5, 16], [8, 18], [12, 17]], dark(W));
    g.path([[4, 18], [7, 20], [11, 19]], dark(W));
    if (!r) g.set(16, 2, K);
    else {
      g.rect(16, 1, 17, 3, EYE);
      g.set(17, 2, RED);
      for (const x of [3, 6, 9]) g.line(x, 6, x + 1, 12, dark(W));
    }
  }, { w: 24, h: 30 });

  mk('tooth-fairy', 'tooth fairy tall gaunt with ragged moth wings pliers and a necklace of teeth', 26, 44, (g, r) => {
    const D = hex('#b5a8ae'),
      WG = hex('#8a86a0');
    const f = g.at(5, 2);
    for (const v of [f, f.flip(15)]) {
      if (!r) {
        v.poly([[4, 13], [-3, 10], [-4, 20], [-1, 27], [4, 22]], WG); // wings folded
        v.clearRect(-2, 17, -2, 18);
      } else {
        v.poly([[4, 13], [-8, 2], [-11, 9], [-9, 18], [4, 20]], WG);
        v.poly([[4, 19], [-7, 21], [-8, 29], [-2, 31], [4, 24]], dark(WG));
        v.clearRect(-6, 9, -5, 10);
        v.clearRect(-5, 25, -4, 26);
      }
    }
    man(f, { skin: PALE, face: r ? 'scream' : 'hollow', hair: ['wild', C.white], top: D, robe: D, tl: 12, ll: 16, arms: r ? { l: 'down', r: 'up' } : { l: 'down', r: 'hold' }, al: 14, claw: 2 });
    g.bevel();
    for (const v of [f, f.flip(15)]) {
      if (!r) v.line(3, 14, -2, 24, vd(WG));
      else {
        v.line(3, 14, -8, 5, vd(WG));
        v.line(3, 15, -8, 14, vd(WG));
        v.pts([[-6, 14], [-7, 7]], hex('#c9b458')); // eye spots
      }
    }
    f.pts([[5, 13], [6, 14], [7, 15], [8, 15], [9, 14], [10, 13]], TOOTH); // what she has collected
    f.pts([[7, 16], [8, 16]], TOOTH);
    if (!r) {
      f.col(8, 12, 15, C.steel); // pliers
      f.col(9, 11, 15, C.steel);
      f.set(8, 11, C.ironDark);
    } else {
      f.rect(7, 8, 8, 11, GUM); // not a tooth of her own
      f.col(15, -2, 1, C.steel);
      f.col(16, -3, 1, C.steel);
      f.set(15, -3, TOOTH); // yours
      f.set(15, -4, TOOTH);
      f.pts([[6, 5], [9, 5]], RED);
    }
  }, { w: 40, h: 48, dx: 7 });

  mk('lantern-fish', 'lantern fish angler swimming in the air with a light on a stalk needle teeth', 24, 22, (g, r) => {
    const B = hex('#33404e');
    g.poly([[5, 10], [1, 6], [2, 11], [1, 15]], dark(B)); // tail
    g.oval(4, 5, 19, r ? 15 : 14, B);
    g.pts([[8, 4], [10, 3], [12, 4], [10, 4]], dark(B)); // spines
    g.poly([[9, 13], [8, 17], [12, 14]], dark(B));
    g.path([[13, 5], [14, 2], [18, 1], [21, 2]], B); // the stalk
    g.bevel();
    g.speckle(5, 6, 14, 13, dark(B), 6, 3);
    if (!r) {
      g.rect(13, 10, 19, 12, K);
      g.fangs(13, 19, 10, 2, 1, C.white);
      g.fangs(14, 19, 12, 2, -1, C.white);
      g.eye(15, 7, 0, EYE);
    } else {
      g.jaws((v) => v.poly([[11, 8], [20, 7], [21, 12], [19, 17], [12, 16]], 1), { len: 3, col: C.white });
      g.eye(13, 6, 1, RED);
    }
    g.rect(21, 2, 22, 3, STAR); // the light
    g.after(() => {
      g.set(21, 2, lite(STAR));
      if (r) g.pts([[20, 1], [23, 1], [20, 4], [23, 4], [21, 0], [22, 5], [19, 2]], STAR);
    });
    g.shadow(6, 17, 20);
  }, { w: 26, h: 24 });

  mk('hourglass-spider', 'hourglass spider sand timer on eight legs glass brass time running out', 30, 22, (g, r) => {
    const BR = C.brass,
      GL = hex('#a9c0c2');
    for (const v of [g, g.flip(29)])
      for (let i = 0; i < 4; i++) {
        const kx = 7 - i * 1.5,
          up = r && i === 0;
        if (up) v.jleg(10, 8, 5, 6, 3, 1, hex('#3a3a46')); // the front pair lifted
        else v.jleg(10, 8 + i, kx, 3 + i * 2, kx - 2, 20, i % 2 ? C.ironDark : hex('#3a3a46'));
      }
    g.poly([[11, 4], [18, 4], [15, 9], [14, 9]], GL);
    g.poly([[14, 10], [15, 10], [18, 15], [11, 15]], GL);
    g.rect(9, 3, 20, 3, BR);
    g.rect(9, 16, 20, 16, BR);
    g.col(9, 3, 16, BR);
    g.col(20, 3, 16, dark(BR));
    g.row(2, 10, 19, lite(BR));
    g.row(17, 10, 19, dark(BR));
    g.bevel();
    const SAND = hex('#c9a860');
    if (!r) {
      g.rect(12, 5, 17, 6, SAND);
      g.rect(13, 7, 16, 7, SAND);
      g.col(14, 8, 13, SAND);
      g.rect(13, 14, 16, 15, SAND);
    } else {
      g.eye(14, 6, 2, RED); // somebody is in the top glass
      g.rect(12, 12, 17, 15, SAND); // and the sand has all run through
      g.row(11, 13, 16, SAND);
      g.fangs(12, 17, 18, 3, 1, C.bone, 5);
    }
    g.pts([[12, 5], [12, 13]], lite(GL));
  });

  mk('shadow-wolf', 'shadow puppet wolf made of hands flat black finger ears finger paws', 26, 18, (g, r) => {
    const S = hex('#1c1924'),
      SL = hex('#3a3548');
    g.rect(4, 7, 17, 11, S);
    g.rect(14, 6, 18, 12, S);
    g.path([[4, 7], [2, 5], [1, 2]], S); // tail
    for (const x of [5, 8, 14, 17]) {
      g.rect(x, 11, x + 1, 15, S);
      g.pts([[x - 1, 16], [x + 1, 16], [x + 3, 16], [x, 15], [x + 2, 15]], S); // paws that are hands
    }
    g.poly([[17, 4], [24, 6], [24, r ? 7 : 8], [17, 9]], S); // muzzle: four fingers
    g.poly([[17, r ? 11 : 9], [23, r ? 12 : 9], [17, r ? 12 : 10]], S); // jaw: the thumb
    g.col(17, 2, 4, S); // ears: two fingers up
    g.col(19, 1, 4, S);
    if (r) for (const x of [6, 8, 10, 12]) g.col(x, 4 - (x % 4 ? 1 : 0), 6, S); // more fingers along the back
    g.row(7, 6, 15, SL); // you can see the knuckles
    g.pts([[19, 5], [21, 6], [14, 9], [8, 9]], SL);
    g.set(19, 6, r ? RED : EYE);
    if (r) {
      g.teeth(18, 23, 8, C.white, 2);
      g.teeth(18, 22, 10, C.white, 2);
      g.rect(18, 9, 22, 9, GUM);
    }
  });

  mk('kite-child', 'kite with a child face stretched on it tail of bows floating paper', 16, 32, (g, r) => {
    const P = hex('#cfc3a4');
    g.path([[8, 19], [7, 22], [9, 25], [7, 28]], C.woodDark); // tail
    g.poly([[8, 1], [14, 9], [8, 19], [2, 9]], P);
    if (r) {
      g.clearRect(13, 9, 14, 9);
      g.clearRect(3, 10, 3, 11);
    }
    g.bevel();
    g.col(8, 1, 19, dark(P)); // the cross
    g.row(9, 2, 14, dark(P));
    if (!r) {
      g.pts([[6, 7], [10, 7]], K);
      g.row(12, 7, 9, vd(P));
      g.pts([[5, 10], [11, 10]], hex('#c09a8e'));
      for (const [x, y, c] of [[6, 22, C.wine], [8, 25, C.teal], [6, 28, C.mustard]]) {
        g.row(y, x, x + 2, c);
        g.pts([[x, y - 1], [x + 2, y - 1], [x, y + 1], [x + 2, y + 1]], c);
      }
    } else {
      g.rect(5, 6, 6, 7, K);
      g.rect(10, 6, 11, 7, K);
      g.set(6, 7, RED);
      g.set(10, 7, RED);
      g.rect(6, 11, 10, 15, K); // torn open
      g.pts([[6, 11], [8, 11], [10, 11], [7, 15], [9, 15]], P);
      for (const [x, y, d] of [[5, 22, 'l'], [10, 25, 'r'], [5, 28, 'l']]) g.hand(x, y, d, PALE, 1); // the bows are hands
    }
    g.shadow(4, 11, 30);
  }, { w: 20, dx: 2 });

  mk('rain-weeper', 'weeping rain cloud with a sad face crying storm small floating', 18, 26, (g, r) => {
    const CL = r ? STORM : CLOUDD;
    g.oval(3, 22, 14, 24, C.water); // its puddle
    g.cloud(1, 1, r ? 15 : 16, 11, CL, r ? 9 : 4);
    g.bevel();
    g.row(23, 5, 11, lite(C.water));
    if (!r) {
      g.pts([[5, 6], [6, 6], [11, 6], [12, 6]], K);
      g.pts([[4, 5], [13, 5]], vd(CL)); // drooping lids
      g.row(9, 8, 9, vd(CL));
      g.pts([[7, 10], [10, 10]], vd(CL));
    } else {
      g.rect(4, 5, 6, 6, C.white);
      g.rect(11, 5, 13, 6, C.white);
      g.pts([[5, 6], [12, 6]], K);
      g.rect(6, 8, 11, 10, K); // it howls
      g.teeth(6, 11, 8, C.white, 2);
      g.path([[9, 12], [7, 16], [10, 16], [8, 21]], STAR);
    }
    g.after(() => {
      for (const [x, y] of [[4, 13], [7, 15], [11, 13], [13, 16], [5, 18], [10, 19], [14, 20]]) g.col(x, y, y + 1, r ? C.glassLight : C.glass);
    });
  });

  mk('owl-clock', 'owl with clock faces for eyes bird of the small hours turning its head', 16, 20, (g, r) => {
    g.pts([[5, 18], [6, 18], [9, 18], [10, 18]], C.straw);
    g.oval(3, 6, 12, 17, FUR);
    if (r) {
      g.poly([[4, 9], [-5, 5], [-6, 12], [-2, 15], [4, 14]], dark(FUR));
      g.poly([[11, 9], [20, 5], [21, 12], [17, 15], [11, 14]], dark(FUR));
    }
    g.rect(3, 2, 12, 9, FUR);
    if (!r) g.pts([[3, 1], [12, 1], [4, 1], [11, 1]], FUR); // ear tufts
    else g.pts([[2, 10], [13, 10], [2, 9], [13, 9], [1, 11], [14, 11]], FUR); // the head has gone right round
    g.bevel();
    for (const [x, y] of [[6, 12], [9, 12], [7, 14], [5, 14], [10, 14], [8, 16]]) g.set(x, y, lite(FUR));
    if (!r) {
      g.col(3, 9, 14, dark(FUR));
      g.col(12, 9, 14, vd(FUR));
    }
    const ey = r ? 6 : 5;
    for (const x of [5, 10]) {
      g.disc(x, ey, 2, EYE);
      if (!r) {
        g.col(x, ey - 1, ey, K);
        g.set(x + 1, ey, K);
      } else {
        g.col(x, ey, ey + 2, RED); // midnight, upside down
        g.set(x, ey, K);
      }
    }
    if (!r) g.rect(7, 7, 8, 8, C.straw);
    else {
      g.rect(7, 2, 8, 3, C.straw);
      g.set(7, 4, K);
      g.set(8, 4, K);
    }
  }, { w: 30, dx: 7 });

  mk('watch-hare', 'hare standing upright with a pocket watch for a belly late rabbit thin', 14, 27, (g, r) => {
    const HR = hex('#8a7a66');
    g.rect(3, 24, 6, 25, HR); // long feet
    g.rect(8, 24, 11, 25, HR);
    g.rect(5, 19, 6, 24, HR);
    g.rect(8, 19, 9, 24, HR);
    g.rect(4, 12, 10, 20, HR);
    g.oval(3, 7, 11, 12, HR);
    const e = r ? 0 : 1;
    g.rect(4, e, 5, 7, HR); // ears
    g.rect(9, e + (r ? 0 : 1), 10, 7, HR);
    g.col(3, 13, r ? 15 : 18, HR);
    g.col(11, 13, r ? 15 : 18, HR);
    g.bevel();
    g.col(5, e + 1, 6, hex('#b08a86'));
    g.col(9, e + 2, 6, hex('#b08a86'));
    g.rect(4, 13, 10, 18, C.wine); // waistcoat
    g.disc(7, 16, 2, r ? K : EYE); // the watch where its belly should be
    g.pts([[5, 13], [6, 13], [8, 13], [9, 13]], C.brass);
    if (!r) {
      g.col(7, 15, 16, K);
      g.set(8, 16, K);
      g.pts([[5, 9], [9, 9]], K);
      g.set(7, 11, vd(HR));
    } else {
      g.pts([[6, 14], [8, 14], [5, 16], [9, 16], [6, 18], [8, 18]], TOOTH); // the numbers are teeth
      g.set(7, 16, RED);
      g.pts([[5, 9], [9, 9]], RED);
      g.rect(6, 11, 8, 12, K);
      g.col(6, 11, 13, C.white); // incisors
      g.col(8, 11, 13, C.white);
      g.hand(2, 12, 'u', HR, 1);
      g.hand(12, 12, 'u', HR, 1);
    }
  }, { w: 18, h: 29, dx: 2 });

  /* ---------- small things of the bedroom ---------- */
  mk('nightcap-imp', 'imp in a nightcap small squat grey thing that sits on the bedpost', 12, 14, (g, r) => {
    const I = hex('#7d7890');
    g.oval(2, 5, 9, 12, I);
    g.rect(2, 11, 4, 12, I);
    g.rect(7, 11, 9, 12, I);
    if (r) {
      g.col(1, 3, 8, I);
      g.col(10, 3, 8, I);
      g.pts([[0, 2], [2, 2], [9, 2], [11, 2]], I);
    }
    g.poly([[2, 5], [5, 1], [9, 5]], PJ);
    g.rect(8, 2, 9, 3, PJ);
    g.bevel();
    g.pts([[3, 4], [5, 3], [7, 4], [6, 2]], lite(PJ));
    g.rect(9, 4, 10, 5, C.white);
    if (!r) {
      g.row(7, 3, 4, K);
      g.row(7, 7, 8, K);
      g.row(9, 4, 7, vd(I));
      g.col(2, 8, 10, dark(I));
      g.col(9, 8, 10, dark(I));
    } else {
      g.rect(3, 6, 4, 7, STAR);
      g.rect(7, 6, 8, 7, STAR);
      g.pts([[4, 7], [7, 7]], K);
      g.rect(3, 9, 8, 10, K);
      g.teeth(3, 8, 9, C.white, 2);
      g.teeth(4, 8, 10, C.white, 2);
    }
  }, { w: 14, h: 15, dx: 1 });

  mk('tooth-moth', 'moth with wings like molars carrying a tooth small pale flying thing', 12, 12, (g, r) => {
    const W = hex('#d6d0bc');
    for (const v of [g, g.flip(11)]) {
      if (!r) {
        v.rect(1, 2, 4, 5, W);
        v.pts([[1, 6], [1, 7], [4, 6], [3, 6]], W); // two roots
      } else {
        v.poly([[5, 4], [1, 0], [0, 4], [1, 7]], W);
        v.pts([[1, 8], [3, 7]], W);
      }
    }
    g.rect(5, 2, 6, 7, hex('#4a4038'));
    g.bevel();
    for (const v of [g, g.flip(11)]) {
      v.set(2, 3, r ? RED : dark(W));
      if (r) v.set(2, 5, dark(W));
    }
    g.pts([[5, 1], [6, 1]], hex('#4a4038'));
    g.rect(5, 8, 6, 9, TOOTH); // the one it has taken
    g.set(5, 10, r ? C.blood : TOOTH);
    g.after(() => g.row(11, 3, 8, NIGHT));
  }, { w: 14, h: 14, dx: 1 });

  mk('yawn', 'a yawn floating mouth with no face lips teeth small', 14, 16, (g, r) => {
    if (!r) {
      g.oval(2, 6, 11, 10, LIP);
      g.bevel();
      g.row(8, 3, 10, vd(LIP));
      g.pts([[2, 7], [11, 7]], vd(LIP));
      g.pts([[5, 6], [8, 6]], lite(LIP));
    } else {
      g.oval(1, 1, 12, 13, LIP);
      g.bevel();
      g.jaws((v) => v.oval(3, 3, 10, 11, 1), { col: C.white });
      g.set(6, 5, LIP); // and far down the throat, an eye
      g.eye(7, 8, 1, RED);
    }
    g.shadow(3, 10, r ? 15 : 14);
  }, { h: 17 });

  mk('candle-walker', 'night candle walking on little legs chamberstick flame with a face', 10, 18, (g, r) => {
    g.col(3, 14, 16, C.ironDark);
    g.col(6, 14, 16, C.ironDark);
    g.pts([[2, 16], [7, 16]], C.ironDark);
    g.rect(1, 12, 8, 13, C.brass);
    g.set(8, 11, C.brass);
    g.rect(4, 6, 5, 11, C.cream);
    if (r) {
      g.path([[3, 8], [1, 7], [0, 4]], C.cream); // arms of wax
      g.path([[6, 8], [8, 7], [9, 4]], C.cream);
    }
    g.bevel();
    g.set(3, 8, C.cream);
    g.set(6, 9, dark(C.cream));
    if (!r) {
      g.rect(4, 3, 5, 5, C.flame);
      g.set(4, 2, C.flame);
      g.set(5, 4, C.flameLight);
    } else {
      g.oval(2, -4, 7, 5, C.flame);
      g.pts([[4, -6], [5, -5], [4, -5]], C.flame);
      g.rect(3, 0, 6, 4, C.flameLight);
      g.pts([[3, 0], [6, 0]], K);
      g.rect(4, 2, 5, 3, K);
    }
  }, { h: 25, w: 12, dx: 1 });

  mk('teddy-unstitched', 'teddy bear coming unstitched with human teeth in its belly toy button eye', 12, 15, (g, r) => {
    const T = hex('#8c6a44');
    g.rect(2, 11, 4, 13, T);
    g.rect(7, 11, 9, 13, T);
    g.oval(2, 6, 9, 12, T);
    if (!r) {
      g.col(1, 7, 10, T);
      g.col(10, 7, 10, T);
    } else {
      g.path([[1, 8], [0, 6], [0, 4]], T);
      g.path([[10, 8], [11, 6], [11, 4]], T);
    }
    g.disc(5.5, 4, 3, T);
    g.rect(2, 1, 3, 2, T);
    g.rect(8, 1, 9, 2, T);
    g.bevel();
    g.rect(5, 4, 6, 5, lite(T));
    g.set(5, 4, K);
    g.set(4, 3, K);
    g.pts([[7, 2], [8, 4]], vd(T)); // where the other eye was
    g.set(7, 3, r ? RED : vd(T));
    if (r) {
      g.col(8, 5, 7, K); // it hangs by its thread
      g.set(8, 8, K);
    }
    if (!r) {
      g.col(5, 7, 11, vd(T));
      g.pts([[6, 8], [6, 10]], vd(T));
      g.pts([[4, 9], [6, 9]], C.white); // stuffing
    } else {
      g.rect(3, 8, 8, 11, GUM);
      g.teeth(3, 8, 8, C.white, 1);
      g.teeth(3, 8, 11, C.white, 1);
      g.row(9, 4, 7, K);
      g.row(10, 4, 7, K);
    }
  }, { w: 14, dx: 1 });

  mk('keyhole-beetle', 'beetle with a brass keyhole in its back small black insect something looks out', 12, 9, (g, r) => {
    const B = hex('#2b2f44');
    for (const x of [2, 5, 8]) {
      g.line(x, 5, x - 1, r ? 3 : 7, K);
      g.line(x + 1, 6, x + 2, 7, K);
    }
    g.oval(1, 2, 9, 6, B);
    g.rect(9, 3, 10, 5, dark(B));
    g.bevel();
    g.row(2, 3, 6, lite(B));
    g.rect(4, 3, 6, 5, C.brass);
    g.set(5, 3, r ? EYE : K);
    g.set(5, 4, r ? RED : K);
    g.set(5, 5, K);
    g.pts([[11, 2], [11, 6]], r ? C.bone : K);
    if (r) {
      g.poly([[2, 1], [0, -3], [4, -1]], C.ghost);
      g.poly([[7, 1], [9, -3], [5, -1]], C.ghost);
    }
  }, { h: 13, w: 14, dx: 1 });

  mk('feather-worms', 'pillow feathers that are worms white larvae small swarm vermin', 16, 8, (g, r) => {
    const F = hex('#d9d6cc'),
      WM = hex('#c9b8a0');
    for (const [x, y, n] of [[1, 5, 5], [6, 6, 5], [10, 4, 4]]) {
      g.row(y, x, x + n, F);
      g.row(y - 1, x + 1, x + n - 1, F);
      g.row(y, x + 1, x + n - 1, dark(F));
    }
    const worms = r ? [[3, 5, -3], [8, 6, -4], [12, 4, -3]] : [[3, 3, 0], [8, 4, 0], [12, 2, 0]];
    for (const [x, y, up] of worms) {
      if (!up) {
        g.row(y, x - 1, x + 2, WM);
        g.set(x, y, dark(WM));
        g.set(x + 3, y, K);
      } else {
        g.col(x, y + up, y, WM);
        g.pts([[x, y - 1], [x, y + up + 2]], dark(WM));
        g.set(x, y + up - 1, K);
        g.pts([[x - 1, y + up - 1], [x + 1, y + up - 1]], RED);
      }
    }
  }, { h: 13 });

  mk('eye-fish', 'school of little flying fish that are mostly eye small swarm watching', 18, 15, (g, r) => {
    const fish = r ? [[3, 2], [10, 2], [1, 7], [8, 6], [13, 8], [5, 10]] : [[3, 3], [10, 2], [6, 8], [12, 7]];
    for (const [x, y] of fish) {
      g.pts([[x, y], [x, y + 2]], LILAC); // tail
      g.rect(x + 1, y, x + 3, y + 2, EYE);
      g.set(x + 2, y - 1, LILAC);
      g.set(x + (r ? 2 : 3), y + 1, r ? RED : K);
      if (r) g.pts([[x + 1, y + 3], [x + 3, y + 3]], C.white);
    }
    g.shadow(4, 13, 13);
  });
};
