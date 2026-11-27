/* The weird: the uncanny, the side-show, bodies put together wrongly. Drawn for be-dream.js (see _be-dream-kit.js). */
module.exports = (kit, H, mk) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const { man, face, FACES, vd, NIGHT, EYE, GUM, TOOTH } = H;
  const PALE = hex('#d6c2a6'),
    MANQ = hex('#cdb898'),
    COAT = hex('#6a6052'),
    MEAT = hex('#9a4a48'),
    FAT = hex('#d8c4b0'),
    HAIRC = hex('#30262a'),
    RING = hex('#8a2f2c'),
    RED = hex('#c23a2e'),
    SUIT = hex('#2e2c3a'),
    DOG = hex('#8a5a3a'),
    TNG = hex('#b0606a'),
    PUTTY = hex('#9a9690'),
    WOOLC = hex('#7a8a6a'),
    YEL = hex('#d9c04a');

  /** A head of the doll's size with a cap of hair: its face at x, y (8 x 9). */
  const head = (g, x, y, skin, hair, kind, eye = K) => {
    face(g, x, y, skin);
    (FACES[kind] || FACES.calm)(g, x, y, skin, eye);
    if (hair) {
      g.row(y - 1, x + 1, x + 6, hair);
      g.row(y, x, x + 7, hair);
      g.set(x, y + 1, hair);
      g.set(x + 7, y + 1, dark(hair));
    }
  };

  /* ---------- the tall ones ---------- */
  mk('crowd-coat', 'a crowd in one coat many heads hands and feet in a single overcoat tall', 26, 48, (g, r) => {
    for (const x of [3, 7, 11, 15, 19]) g.rect(x, 45, x + 2, 46, x % 2 ? NIGHT : C.woodDark);
    g.rect(1, 15, 4, 32, COAT); // sleeves
    g.rect(21, 15, 24, 32, COAT);
    g.poly([[5, 13], [20, 13], [23, 44], [2, 44]], COAT);
    g.row(12, 6, 19, COAT);
    head(g, 9, 2, hex('#c9b090'), C.woodDark, r ? 'scream' : 'shut');
    head(g, 3, 5, PALE, C.rust, r ? 'scream' : 'calm');
    head(g, 14, 5, hex('#c0a888'), C.ash, r ? 'wide' : 'stare');
    for (const [x, d] of [[0, 1], [22, 1]]) {
      g.rect(x + 1, 33, x + 3, 34, PALE); // more hands than sleeves
      g.pts([[x, 33], [x + 4, 33], [x + 1, 35], [x + 3, 35], [x, 35], [x + 4, 36], [x + 2, 36]], PALE);
    }
    g.bevel();
    g.poly([[9, 14], [12, 20], [8, 20], [6, 15]], dark(COAT)); // lapels
    g.poly([[16, 14], [13, 20], [17, 20], [19, 15]], dark(COAT));
    g.col(4, 16, 31, dark(COAT));
    g.col(21, 16, 31, dark(COAT));
    if (!r) {
      g.col(12, 20, 43, vd(COAT));
      for (const y of [23, 28, 33]) g.set(14, y, C.brass);
      g.set(11, 31, PALE); // a finger between the buttons
    } else {
      g.poly([[12, 18], [13, 18], [18, 44], [7, 44]], K); // it opens
      for (const [x, y] of [[11, 24], [13, 29], [10, 35], [14, 39]]) {
        g.set(x, y, EYE);
        g.set(x + 2, y, EYE);
      }
      head(g, 9, 30, hex('#b8a48c'), null, 'scream');
      g.limb([[12, 24], [20, 22], [27, 25]], 2, PALE);
      g.hand(28, 25, 'r', PALE, 1);
      g.limb([[11, 27], [3, 26], [-3, 30]], 2, PALE);
      g.hand(-4, 30, 'l', PALE, 1);
    }
  }, { w: 40, dx: 7 });

  mk('ringmaster', 'ringmaster of nothing tall thin red tailcoat top hat no face moustache whip circus', 22, 48, (g, r) => {
    const f = g.at(3, 5);
    man(f, { skin: PALE, face: 'none', hat: ['top', SUIT, C.gold], top: RING, sleeve: RING, legs: C.cream, shoe: NIGHT, tl: 13, ll: 17, coat: RING, coatLen: 8, shirt: C.cream, arms: r ? 'up' : 'down', al: 15 });
    f.rect(4, 36, 11, 41, NIGHT); // boots
    f.col(7, 36, 41, K);
    g.bevel();
    f.pts([[5, 15], [5, 18], [5, 21], [10, 15], [10, 18], [10, 21]], C.gold);
    f.set(8, 7, PALE);
    if (!r) {
      f.row(9, 3, 12, HAIRC); // a moustache, and nothing else
      f.pts([[2, 8], [13, 8], [1, 7], [14, 7]], HAIRC);
      f.path([[2, 28], [0, 34], [3, 38], [0, 41]], C.woodDark); // the whip
    } else {
      f.disc(7.5, 7, 3, K); // the face is a hole to shout through
      f.pts([[5, 5], [7, 4], [9, 4], [10, 6], [5, 9], [7, 10], [9, 10]], C.white);
      f.pts([[2, 4], [13, 4], [1, 3], [14, 3]], HAIRC);
      f.rect(6, 14, 9, 30, K); // and the coat is empty
      f.rect(5, 16, 10, 27, K);
      f.oval(5, 22, 10, 25, C.gold); // but for a ring, far away
      f.oval(6, 23, 9, 24, K);
      f.path([[0, 2], [-4, -3], [3, -8], [14, -6], [20, 0], [18, 8]], C.woodDark);
    }
  }, { w: 32, h: 54, dx: 5 });

  mk('neck-woman', 'woman with a neck far too long tall dark dress long black hair head high above', 20, 48, (g, r) => {
    const DR = hex('#4a3a5a');
    const f = g.at(2, 17);
    man(f, { head: false, top: DR, robe: DR, tl: 9, ll: 9, hand: PALE });
    f.row(12, 6, 9, C.cream);
    const [hx, hy] = r ? [25, 20] : [6, 2];
    g.tube(r ? [[9.5, 29], [10, 17], [17, 7], [26, 8], [29, 19]] : [[9.5, 29], [8, 22], [11, 15], [9.5, 10]], 1.6, 1.6, PALE);
    g.rect(hx - 1, hy, hx + 8, hy + (r ? 14 : 11), HAIRC); // hair
    g.row(hy - 1, hx, hx + 7, HAIRC);
    g.bevel();
    head(g, hx, hy + 1, PALE, HAIRC, r ? 'smile' : 'shut', r ? RED : K);
    f.col(7, 14, 29, dark(DR));
    f.row(21, 4, 11, C.wine); // a sash
  }, { w: 38 });

  mk('legs-only', 'pair of very tall striped legs with nothing above the waist stilt walker circus', 16, 48, (g, r) => {
    const ST = hex('#b8ad90');
    if (!r) {
      g.rect(3, 6, 7, 44, ST);
      g.rect(9, 6, 13, 44, ST);
      g.rect(2, 45, 7, 46, NIGHT);
      g.rect(9, 45, 14, 46, NIGHT);
    } else {
      g.limb([[4, 6], [-1, 24], [-3, 41]], 5, ST); // striding
      g.limb([[9, 6], [15, 22], [12, 41]], 5, ST);
      g.rect(-6, 45, 1, 46, NIGHT);
      g.rect(11, 45, 18, 46, NIGHT);
    }
    g.rect(3, 3, 13, 7, ST);
    if (r) {
      for (const [x, y, d] of [[6, -4, 'u'], [10, -7, 'u'], [3, -1, 'l'], [14, -2, 'r']]) {
        g.line(8, 3, x, y, PALE); // what was inside comes up
        g.hand(x, y - (d === 'u' ? 1 : 0), d, PALE, 1);
      }
    }
    g.bevel();
    g.over(r ? -5 : 2, 6, r ? 20 : 14, 44, C.wine, (x) => ((x % 3) + 3) % 3 === 0); // stripes
    g.row(6, 3, 13, C.woodDark); // belt
    g.rect(7, 5, 9, 7, C.brass);
    g.oval(4, 2, 12, 4, K); // nobody in them
    if (!r) {
      g.col(2, 6, 15, C.woodDark); // braces hanging loose
      g.col(14, 6, 13, C.woodDark);
      g.pts([[2, 16], [14, 14]], C.brass);
    } else g.pts([[6, 3], [10, 3]], EYE);
  }, { w: 30, h: 58, dx: 8 });

  /* ---------- the long ones ---------- */
  mk('mannequin-centipede', 'mannequin centipede chain of shop dummy torsos on many arms egg head long', 48, 22, (g, r) => {
    const ys = r ? [6, 6, 6, 1, -6] : [6, 6, 6, 6, 6];
    for (let i = 0; i < 5; i++) {
      const x = 2 + i * 8,
        y = ys[i],
        col = i % 2 ? dark(MANQ) : MANQ,
        up = y < 2;
      g.limb(up ? [[x + 5, y + 5], [x + 9, y + 8], [x + 12, y + 5]] : [[x + 5, y + 6], [x + 6, 15], [x + 5, 18]], 2, dark(MANQ)); // far arm
      g.oval(x, y, x + 7, y + 7, col);
      g.disc(x + 8, y + 4, 1.5, C.wood); // the joint between two
      g.limb(up ? [[x + 2, y + 5], [x + 6, y + 10], [x + 10, y + 9]] : [[x + 2, y + 6], [x + 1, 15], [x + 2, 18]], 2, MANQ);
      if (!up) g.row(19, x + 1, x + 4, MANQ);
    }
    const [hx, hy] = r ? [38, -16] : [40, 0];
    g.rect(hx + 1, hy + 8, hx + 2, hy + 10, C.wood);
    g.oval(hx - 1, hy + 1, hx + 5, hy + 9, MANQ);
    g.bevel();
    for (let i = 0; i < 5; i++) g.path([[4 + i * 8, ys[i] + 2], [7 + i * 8, ys[i] + 3]], vd(MANQ)); // seams
    if (!r) g.col(hx + 2, hy + 2, hy + 8, dark(MANQ));
    else {
      g.rect(hx + 1, hy + 4, hx + 4, hy + 7, K); // the head cracks across
      g.pts([[hx + 1, hy + 4], [hx + 3, hy + 4], [hx + 2, hy + 7], [hx + 4, hy + 7]], C.white);
      g.pts([[hx, hy + 3], [hx + 5, hy + 8]], K);
    }
  }, { h: 40, w: 50 });

  mk('stair-crawler', 'crawling figure with a staircase for a back on all fours hair over its face long', 46, 26, (g, r) => {
    g.limb([[8, 16], [4, 19], [8, 22]], 3, dark(PALE)); // hind legs, kneeling
    g.limb([[12, 16], [9, 20], [14, 22]], 3, PALE);
    g.row(24, 8, 12, PALE);
    g.limb([[31, 15], [33, 19], [32, 22]], 3, dark(PALE));
    if (!r) g.limb([[35, 14], [37, 19], [36, 22]], 3, PALE);
    else g.limb([[35, 13], [42, 14], [47, 10]], 3, PALE);
    g.rect(6, 13, 36, 17, PALE);
    for (let i = 0; i < 6; i++) g.rect(6 + i * 5, 13 - i * 2, 10 + i * 5, 14, C.wood);
    g.rect(31, 3, 36, 14, C.wood);
    const [hx, hy] = r ? [37, 1] : [37, 10];
    g.tube([[35, 7], [38, hy + 3]], 1.6, 1.6, PALE, PALE);
    g.rect(hx - 1, hy - 1, hx + 8, hy + (r ? 6 : 12), HAIRC);
    g.bevel();
    for (let i = 0; i < 6; i++) {
      g.row(13 - i * 2, 6 + i * 5, 10 + i * 5, C.wine); // the runner
      g.set(6 + i * 5, 14 - i * 2, dark(C.wine));
      if (r && i > 0) g.set(8 + i * 5, 16 - i * 2 + 1, C.flameLight); // lights on, in there
    }
    g.row(17, 7, 35, dark(PALE));
    if (!r) {
      for (const x of [38, 40, 43]) g.col(x, hy + 2, hy + 12, dark(HAIRC)); // you cannot see the face
      g.row(24, 35, 39, PALE);
    } else {
      head(g, hx, hy + 1, PALE, HAIRC, 'smile', RED);
      g.hand(48, 10, 'r', PALE, 2);
    }
  }, { w: 54, h: 28 });

  mk('long-dog', 'the long dog far too long many legs friendly face mouth along its side', 48, 18, (g, r) => {
    for (const x of [8, 13, 19, 25, 31, 36]) {
      g.rect(x, 11, x + 1, 15, x % 2 ? DOG : dark(DOG));
      g.row(16, x, x + 2, dark(DOG));
    }
    g.path(r ? [[6, 7], [3, 4], [2, 1]] : [[6, 7], [3, 6], [1, 8]], DOG);
    g.rect(6, 6, 38, 11, DOG);
    g.rect(5, 7, 5, 10, DOG);
    g.oval(36, 2, 44, 10, DOG);
    g.rect(42, 5, 46, 8, DOG);
    g.bevel();
    g.rect(37, 3, 38, 8, dark(DOG)); // ear
    g.rect(35, 6, 35, 11, C.wine); // collar
    g.set(35, 11, C.brass);
    g.set(46, 5, K);
    g.row(12, 7, 37, lite(DOG));
    if (!r) {
      g.set(41, 5, K);
      g.row(8, 43, 46, vd(DOG));
      g.set(42, 9, TNG);
    } else {
      g.eye(41, 5, 1, K);
      g.rect(42, 7, 46, 8, GUM);
      g.teeth(42, 46, 7, C.white, 1);
      g.jaws((v) => v.rect(8, 7, 33, 10, 1), { len: 2 }); // it opens all the way along
      g.row(9, 14, 28, TNG);
    }
  });

  mk('pantomime-horse', 'pantomime horse costume with too many human legs something inside the seam cloth', 42, 30, (g, r) => {
    const CL = hex('#8a6a4a'),
      PT = hex('#6a7a5a');
    [[8, 0], [12, 1], [17, 0], [21, 1], [26, 0], [30, 1]].forEach(([x, f], i) => {
      if (r && i === 5) {
        g.limb([[x, 17], [x + 5, 20], [x + 4, 25]], 3, SUIT); // kicking
        g.rect(x + 4, 26, x + 8, 27, NIGHT);
      } else g.hleg(x, 16, 27, f ? SUIT : dark(SUIT), i % 2 ? 1 : -1);
    });
    g.strands(4, 6, 9, 20, C.straw, 3); // a tail of wool
    g.rect(6, 8, 31, 17, CL);
    g.row(7, 8, 29, CL);
    const [hx, hy] = r ? [31, 9] : [31, 2];
    g.poly([[27, 8], [31, 16], [hx + 5, hy + 5], [hx, hy]], CL); // neck
    g.rect(hx, hy, hx + 7, hy + 5, CL);
    g.rect(hx + 5, hy + 3, hx + 9, hy + 7, CL);
    g.pts([[hx + 1, hy - 1], [hx + 3, hy - 1]], CL);
    g.bevel();
    g.rect(10, 9, 15, 13, PT); // patches
    g.rect(22, 12, 26, 16, C.wine);
    for (const y of [9, 11, 13, 15]) g.set(19, y, K); // the seam where the two of them meet
    g.strands(27, 30, hy + 1, hy + 7, C.straw, 5);
    g.rect(hx + 3, hy + 1, hx + 4, hy + 2, C.white); // a button eye
    g.set(hx + 4, hy + 2, K);
    g.row(hy + 6, hx + 6, hx + 9, K);
    g.pts([[hx + 6, hy + 5], [hx + 8, hy + 5]], C.white);
    if (r) {
      g.rect(17, 8, 21, 17, K); // and the seam comes open
      g.rect(18, 9, 20, 12, PALE);
      g.pts([[18, 10], [20, 10]], K);
      g.set(19, 12, K);
      g.limb([[19, 14], [17, 20], [20, 25]], 2, PALE);
      g.hand(20, 25, 'd', PALE, 1);
      g.rect(hx + 5, hy + 7, hx + 9, hy + 9, GUM);
      g.teeth(hx + 5, hx + 9, hy + 7, C.white, 1);
    }
  }, { w: 44 });

  mk('accordion-man', 'man pulled out like an accordion bellows body head at one end feet at the other long', 46, 20, (g, r) => {
    const L = r ? 46 : 28,
      top = (x) => (r ? 9 - Math.round(Math.sin(((x - 10) / L) * Math.PI) * 9) : 6),
      BL = hex('#5a2a30');
    for (let x = 10; x < 10 + L; x++) {
      const t = top(x) + (x % 4 < 2 ? 0 : 1),
        b = (r ? top(x) + 9 : 15) + (x % 4 < 2 ? 1 : 0);
      g.col(x, t, b, x % 4 < 2 ? BL : SUIT);
    }
    const ex = 10 + L;
    g.rect(ex, 5, ex + 3, 16, C.wood); // the far end: hips, and the feet beyond
    g.rect(ex + 4, 11, ex + 6, 16, SUIT);
    g.rect(ex + 4, 15, ex + 7, 16, NIGHT);
    g.rect(7, 5, 9, 16, C.wood);
    g.rect(8, 15, 11, 17, PALE); // hands on the floor
    g.rect(ex - 1, 15, ex + 2, 17, PALE);
    g.bevel();
    head(g, 1, 6, PALE, C.woodDark, r ? 'scream' : 'dead');
    for (const y of [7, 10, 13]) g.set(ex + 2, y, C.cream); // keys
    g.pts([[8, 7], [8, 9], [8, 11]], C.cream);
  }, { w: 64, h: 30 });

  /* ---------- people, more or less ---------- */
  mk('folded-man', 'man folded the wrong way bent backwards head hanging upside down between his legs', 18, 24, (g, r) => {
    const SH = hex('#b8b4a4');
    g.hleg(2, 8, 21, SUIT, -1);
    g.hleg(13, 8, 21, SUIT, 1);
    g.rect(2, 5, 15, 9, SUIT); // hips, uppermost
    g.oval(3, 2, 14, 7, SH); // the belly, bent right over
    if (!r) {
      g.limb([[5, 9], [5, 15], [6, 20]], 2, SH); // arms hang to the floor
      g.limb([[11, 9], [11, 15], [10, 20]], 2, SH);
    } else {
      g.limb([[4, 8], [-2, 10], [-5, 5]], 2, SH);
      g.limb([[12, 8], [18, 10], [21, 5]], 2, SH);
      g.hand(-4, 4, 'u', PALE, 1);
      g.hand(22, 4, 'u', PALE, 1);
    }
    g.bevel();
    g.row(8, 3, 14, C.woodDark); // belt
    g.col(8, 3, 7, C.wine); // tie, falling the wrong way
    // the face, upside down
    const up = H.view((x, y, c) => g.set(x, 28 - y, c), (x, y) => g.get(x, 28 - y), (x, y) => g.clear(x, 28 - y));
    up.root = g.root;
    head(up, 5, 9, PALE, C.woodDark, r ? 'smile' : 'stare', r ? RED : K);
    if (!r) g.rect(5, 21, 7, 21, PALE), g.rect(10, 21, 12, 21, PALE);
  }, { w: 30, dx: 6 });

  mk('hair-thing', 'hair creature a heap of long dark hair to the floor with feet something inside', 18, 26, (g, r) => {
    g.rect(5, 23, 7, 24, PALE);
    g.rect(10, 23, 12, 24, PALE);
    g.oval(3, 1, 14, 12, HAIRC);
    g.poly([[4, 6], [13, 6], [16, 23], [1, 23]], HAIRC);
    if (r) {
      g.tube([[4, 10], [-2, 8], [-5, 2]], 1.5, 0.6, HAIRC); // it reaches
      g.tube([[13, 10], [19, 8], [22, 2]], 1.5, 0.6, HAIRC);
    }
    g.bevel();
    for (let x = 2; x <= 15; x += 2) g.line(x < 9 ? 6 + x / 3 : 8 + x / 4, 3, x, 22, lite(HAIRC));
    for (const x of [3, 8, 13]) g.col(x, 20, 23, vd(HAIRC));
    if (!r) g.pts([[9, 2], [10, 3], [11, 2]], C.bone); // a comb, stuck
    else {
      g.poly([[8, 4], [9, 4], [11, 20], [6, 20]], K); // it parts
      g.rect(7, 7, 10, 15, PALE);
      for (const y of [8, 10, 12]) g.pts([[7, y], [10, y]], K); // a long face, and too many eyes
      g.rect(8, 14, 9, 15, K);
    }
  }, { w: 30, dx: 6 });

  mk('conjoined-acrobats', 'conjoined acrobats two tumblers fused in one striped body three legs four arms', 24, 34, (g, r) => {
    const LE = hex('#b0a890');
    const gap = r ? 2 : 0;
    g.hleg(4 - gap, 23, 31, LE, -1, PALE);
    g.hleg(10, 23, 31, LE, 1, PALE);
    g.hleg(16 + gap, 23, 31, LE, 1, PALE);
    g.rect(4 - gap, 13, 19 + gap, 24, LE);
    for (const v of [g.at(-gap, 0), g.flip(23).at(-gap, 0)]) {
      if (!r) {
        v.limb([[3, 14], [0, 8], [1, 3]], 2, PALE); // ta-da
        v.limb([[10, 14], [11, 20]], 2, PALE);
      } else {
        v.limb([[3, 14], [-3, 16], [-5, 22]], 2, PALE);
        v.limb([[9, 13], [8, 8], [11, 5]], 2, PALE);
      }
    }
    g.bevel();
    g.over(2, 13, 21, 31, C.wine, (x, y) => y % 3 === 0 && y < 27);
    head(g, 3 - gap, 3, PALE, C.woodDark, r ? 'scream' : 'grin');
    head(g, 13 + gap, 3, PALE, C.rust, r ? 'scream' : 'grin');
    if (!r) g.col(11, 14, 23, vd(LE)); // where one stops and the other starts
    else {
      g.rect(10, 12, 13, 23, GUM); // they try to part
      g.rect(11, 13, 12, 22, K);
      for (const y of [14, 17, 20]) g.row(y, 10, 13, TNG);
    }
  }, { w: 36, dx: 6 });

  mk('balloon-face', 'face on a string like a balloon swollen head floating knot at the neck', 14, 34, (g, r) => {
    const cy = r ? 7 : 8,
      rad = r ? 6.4 : 5.4;
    g.path([[7, 15], [6, 19], [8, 23], [6, 27], [7, 31]], C.woodDark); // string
    g.rect(6, 13, 8, 14, dark(PALE)); // tied off
    g.disc(7, cy, rad, PALE);
    g.bevel();
    g.pts([[5, 15], [9, 15]], dark(PALE));
    g.pts([[3, cy - 3], [4, cy - 4]], lite(PALE)); // a shine on it
    if (!r) {
      g.pts([[5, cy - 1], [9, cy - 1]], K);
      g.row(cy + 2, 6, 8, vd(PALE));
      g.set(7, cy, dark(PALE));
    } else {
      g.eye(4, cy - 2, 1, K);
      g.eye(10, cy - 2, 1, K);
      g.rect(3, cy + 1, 11, cy + 3, GUM);
      g.teeth(3, 11, cy + 1, C.white, 1);
      g.teeth(4, 10, cy + 3, C.white, 2);
      g.hand(7, 31, 'd', PALE, 0); // and the string has hold of something
    }
    g.shadow(4, 10, 32);
  }, { w: 18, dx: 2 });

  mk('pose-copier', 'the thing that copies your pose grey unfinished figure standing like you no face', 16, 33, (g, r) => {
    if (!r) {
      man(g, { skin: PUTTY, top: PUTTY, legs: dark(PUTTY), shoe: dark(PUTTY), hand: PUTTY, face: 'blank', neck: false });
      g.row(6, 6, 9, lite(PUTTY)); // where a face would go
      g.pts([[5, 21], [10, 22]], lite(PUTTY));
      g.pts([[2, 24], [2, 25], [13, 24]], PUTTY); // it has not set yet
    } else {
      man(g, { skin: PUTTY, top: PUTTY, legs: dark(PUTTY), shoe: dark(PUTTY), hand: PUTTY, face: 'blank', neck: false, arms: { l: 'up', r: 'out' } });
      man(g, { head: false, legs: false, top: PUTTY, hand: PUTTY, arms: { l: 'reach', r: 'up' } }); // it tries every pose at once
      g.pts([[5, 5], [8, 8]], K); // and a face, as near as it can get
      g.col(10, 6, 9, K);
      g.set(5, 4, C.white);
      g.set(11, 7, C.white);
    }
  }, { w: 30, dx: 7 });

  mk('meat-moth', 'meat moth wings of raw marbled flesh bone body flying insect wet', 24, 18, (g, r) => {
    for (const v of [g, g.flip(23)]) {
      if (!r) {
        v.poly([[10, 6], [3, 2], [1, 5], [2, 9], [10, 10]], MEAT);
        v.poly([[10, 10], [3, 10], [4, 14], [8, 15], [10, 12]], dark(MEAT));
      } else {
        v.poly([[10, 6], [5, -4], [1, -2], [1, 5], [10, 10]], MEAT);
        v.poly([[10, 10], [2, 8], [2, 13], [7, 15], [10, 12]], dark(MEAT));
      }
    }
    g.rect(11, 4, 12, 14, C.bone); // a bone for a body
    g.pts([[10, 3], [13, 3], [10, 15], [13, 15]], C.bone);
    g.bevel();
    for (const v of [g, g.flip(23)]) {
      v.path(r ? [[9, 6], [5, 1], [3, -2]] : [[9, 7], [5, 5], [3, 4]], FAT); // marbling
      v.path(r ? [[9, 8], [4, 5]] : [[9, 9], [4, 8]], FAT);
      v.pts([[5, 12], [7, 13]], FAT);
      if (r) v.eye(4, 2, 1, K);
      v.line(11, 3, 9, r ? -1 : 1, K); // feelers
    }
    if (r) {
      g.rect(11, 6, 12, 8, GUM);
      g.pts([[11, 6], [12, 8]], C.white);
      g.after(() => g.pts([[5, 16], [18, 15], [11, 16]], C.blood));
    }
  }, { h: 24 });

  mk('backwards-walker', 'man with his head on backwards walking towards you back of the head knees wrong', 16, 33, (g, r) => {
    man(g, { skin: PALE, face: 'none', top: C.teal, legs: C.earth, shirt: C.cream, tie: C.wine, arms: r ? 'up' : 'down' });
    if (!r) {
      g.rect(4, 2, 11, 9, C.woodDark); // only hair, where the face should be
      g.row(1, 5, 10, C.woodDark);
      g.row(10, 5, 10, C.woodDark);
      for (const x of [5, 7, 9]) g.col(x, 3, 9, dark(C.woodDark));
      g.pts([[3, 5], [12, 5]], dark(PALE)); // ears
    } else {
      // it turns all the way round, and comes up the wrong way
      const up = H.view((x, y, c) => g.set(x, 14 - y, c), (x, y) => g.get(x, 14 - y), (x, y) => g.clear(x, 14 - y));
      up.root = g.root;
      head(up, 4, 3, PALE, null, 'smile', RED);
      g.row(11, 5, 10, C.woodDark);
      g.row(10, 4, 11, C.woodDark);
    }
    g.row(27, 4, 6, dark(C.earth)); // the knees bend the other way
    g.row(27, 9, 11, dark(C.earth));
    g.pts([[3, 27], [12, 27]], C.earth);
  }, { h: 43, w: 20, dx: 2 });

  mk('dummy-master', 'ventriloquist dummy grown large with a small limp man on its knee wooden jaw', 22, 34, (g, r) => {
    const WD = hex('#c9a878');
    const f = g.at(1, 1);
    man(f, { skin: WD, face: 'none', hair: ['parted', NIGHT], top: SUIT, legs: SUIT, shirt: C.white, tie: RED, hand: WD, arms: { l: 'down', r: 'hold' } });
    // the little man it holds
    const m = g.at(13, 14);
    m.rect(1, 6, 5, 11, C.mustard);
    m.rect(1, 12, 2, r ? 16 : 17, C.navy);
    m.rect(4, 12, 5, r ? 16 : 17, C.navy);
    m.rect(1, r ? 0 : 1, 5, r ? 5 : 6, PALE);
    m.row(r ? -1 : 0, 1, 5, C.woodDark);
    m.col(0, 7, r ? 9 : 12, C.mustard);
    m.col(6, 7, 12, C.mustard);
    g.bevel();
    f.pts([[5, 6], [10, 6]], K); // painted eyes
    f.pts([[5, 5], [10, 5]], C.white);
    f.pts([[4, 8], [11, 8]], hex('#c07a6a')); // painted cheeks
    f.col(5, 9, r ? 13 : 11, K); // the lines of the jaw
    f.col(10, 9, r ? 13 : 11, K);
    if (!r) {
      f.row(9, 6, 9, K);
      m.pts([[2, 3], [4, 3]], K);
      m.row(5, 2, 4, vd(PALE));
    } else {
      f.rect(6, 9, 9, 12, K); // the jaw drops to its chest
      f.rect(6, 13, 9, 14, WD);
      f.teeth(6, 9, 9, C.white, 1);
      f.pts([[6, 6], [11, 6]], K);
      f.pts([[5, 6], [10, 6]], C.white);
      m.pts([[2, 2], [4, 2]], C.white);
      m.rect(2, 4, 4, 5, K); // and the little man does the talking
      m.set(0, 6, PALE);
    }
  });

  mk('umbrella-bat', 'umbrella that is a bat black ribs like wings eyes under the canopy hooked handle', 22, 26, (g, r) => {
    const UB = hex('#2a2834');
    if (!r) {
      g.col(10, 3, 22, C.woodDark); // it stands on its handle
      g.path([[10, 22], [11, 24], [13, 24], [14, 22]], C.woodDark);
      g.poly([[10, 2], [14, 8], [15, 18], [10, 20], [6, 18], [7, 8]], UB); // furled
      g.bevel();
      for (const x of [8, 10, 12]) g.line(10, 3, x + (x - 10), 18, lite(UB));
      g.pts([[9, 12], [12, 12]], YEL);
      g.pts([[6, 19], [8, 20], [12, 20], [15, 19]], C.steel); // rib tips
    } else {
      g.col(10, 8, 18, C.woodDark);
      g.path([[10, 18], [11, 20], [13, 20], [14, 18]], C.woodDark);
      g.poly([[10, 0], [22, 6], [24, 12], [18, 10], [14, 13], [10, 10], [6, 13], [2, 10], [-4, 12], [-2, 6]], UB); // open: wings
      g.bevel();
      for (const x of [-3, 3, 10, 17, 23]) g.line(10, 1, x, 11, lite(UB));
      g.pts([[-4, 13], [2, 11], [6, 14], [14, 14], [18, 11], [24, 13]], C.steel);
      g.rect(8, 10, 12, 12, K);
      g.pts([[8, 10], [12, 10]], YEL);
      g.pts([[9, 12], [11, 12]], C.white);
      g.shadow(4, 16, 23);
    }
  }, { w: 32, dx: 5 });

  mk('knitted-unraveler', 'knitted wool figure coming unravelled button eyes loose thread needles', 16, 30, (g, r) => {
    const f = g.at(0, 0);
    man(f, { skin: WOOLC, top: C.wine, legs: WOOLC, shoe: dark(WOOLC), hand: WOOLC, face: 'none', tl: 8, ll: 8, neck: false, arms: r ? { l: 'reach', r: 'none' } : { l: 'down', r: 'none' } });
    g.bevel();
    g.over(1, 1, 14, 28, dark(WOOLC), (x, y) => (x + y) % 2 === 0 && y < 12);
    g.over(1, 12, 14, 19, dark(C.wine), (x, y) => (x + y) % 2 === 0);
    g.line(11, 0, 13, 6, C.steel); // a needle left in
    const TH = lite(WOOLC);
    if (!r) {
      g.pts([[5, 6], [10, 6]], K); // buttons
      g.row(9, 6, 9, K);
      g.pts([[6, 8], [9, 8]], K);
      g.path([[12, 13], [13, 16], [12, 19], [14, 22], [12, 25], [13, 28]], TH); // one arm is only thread now
    } else {
      g.pts([[5, 6], [10, 6]], RED);
      g.rect(6, 8, 9, 11, K);
      g.path([[7, 9], [9, 10], [7, 11], [9, 13], [7, 15]], TH); // and it is coming out of the mouth
      g.path([[12, 13], [16, 11], [19, 14], [22, 10], [24, 13]], TH);
      g.path([[11, 20], [15, 22], [18, 20], [21, 23]], TH);
      g.path([[4, 2], [1, -2], [3, -4]], TH);
    }
  }, { w: 34, h: 35, dx: 8 });

  mk('deflated-clown', 'deflated clown flat empty skin on the floor red nose big shoes filling up again', 26, 16, (g, r) => {
    const CS = hex('#b8a060');
    g.rect(21, 9, 23, 13, NIGHT); // shoes, toes up
    g.rect(20, 12, 24, 13, NIGHT);
    if (!r) {
      g.oval(7, 10, 21, 14, CS);
      g.oval(1, 8, 9, 14, C.white); // the face, flat
      g.pts([[1, 7], [2, 6], [8, 6], [9, 7]], RING); // hair
    } else {
      g.oval(7, 3, 21, 14, CS); // something blows it up
      g.tube([[8, 8], [5, 3], [5, -2]], 1.5, 1.5, C.white, C.white);
      g.oval(1, -9, 9, -1, C.white);
      g.pts([[0, -8], [0, -6], [10, -8], [10, -6], [1, -10], [9, -10]], RING);
    }
    g.bevel();
    const fy = r ? -5 : 11;
    g.pts([[3, fy - 1], [7, fy - 1]], K);
    g.rect(4, fy, 5, fy + 1, RED);
    if (!r) g.path([[2, 13], [5, 13], [8, 12]], RING);
    else {
      g.rect(2, fy + 2, 8, fy + 3, GUM);
      g.teeth(2, 8, fy + 2, C.white, 1);
      g.pts([[1, fy + 1], [9, fy + 1]], RING);
    }
    for (const [x, y] of r ? [[12, 6], [15, 9], [12, 12]] : [[11, 12], [15, 12], [18, 12]]) g.rect(x, y, x + 1, y + (r ? 1 : 0), RING); // pom-poms
    g.path(r ? [[9, 12], [13, 14], [19, 13]] : [[9, 13], [14, 14], [19, 13]], dark(CS));
  }, { h: 28 });

  mk('contortionist-box', 'contortionist folded into a small glass box face pressed to the pane limbs coming out', 18, 18, (g, r) => {
    if (r) {
      g.limb([[4, 6], [-3, 9], [-5, 15]], 2, PALE); // it gets up without unfolding
      g.limb([[13, 6], [20, 9], [22, 15]], 2, PALE);
      g.limb([[5, 14], [2, 13], [1, 15]], 2, dark(PALE));
      g.limb([[12, 14], [15, 13], [16, 15]], 2, dark(PALE));
      g.row(16, -6, -3, PALE);
      g.row(16, 22, 25, PALE);
    }
    const y0 = r ? 1 : 3;
    g.box(2, y0, 15, y0 + 13, C.wood);
    g.rect(4, y0 + 2, 13, y0 + 11, C.glass);
    g.bevel();
    const b = g.at(0, y0);
    b.rect(5, 3, 10, 8, PALE); // the face against the glass
    b.rect(4, 9, 13, 11, C.wine);
    b.rect(11, 3, 13, 6, PALE); // a knee, a foot
    b.rect(4, 2, 6, 3, PALE);
    b.pts([[6, 5], [9, 5]], K);
    b.row(7, 6, 9, r ? K : vd(PALE));
    if (r) {
      b.rect(6, 6, 9, 8, K);
      b.teeth(6, 9, 6, C.white, 2);
      b.pts([[6, 5], [9, 5]], RED);
    }
    b.pts([[12, 8], [11, 10]], PALE); // fingers
    b.line(4, 10, 8, 2, C.glassLight);
    if (!r) g.rect(7, y0 + 13, 10, y0 + 13, C.brass);
  }, { w: 34, dx: 8 });

  mk('strongman', 'strongman with a tiny head huge chest leopard skin dumbbell mouth across his chest', 24, 34, (g, r) => {
    const LP = hex('#b8904a');
    g.hleg(7, 24, 31, PALE, -1, PALE);
    g.hleg(13, 24, 31, PALE, 1, PALE);
    g.poly([[3, 9], [20, 9], [16, 25], [7, 25]], PALE); // the chest
    g.rect(7, 20, 16, 26, LP);
    g.poly([[3, 9], [12, 9], [7, 20]], LP);
    if (!r) {
      g.limb([[2, 10], [0, 17], [2, 23]], 4, PALE);
      g.limb([[18, 10], [20, 17], [18, 23]], 4, PALE);
    } else {
      g.limb([[2, 10], [-3, 6], [-1, -1]], 4, PALE);
      g.limb([[18, 10], [23, 6], [21, -1]], 4, PALE);
    }
    g.rect(10, 4, 13, 8, PALE); // a very small head
    g.bevel();
    g.over(3, 9, 16, 26, SUIT, (x, y) => (x * 5 + y * 3) % 7 === 0 && g.get(x, y) && g.get(x, y)[2] < 100);
    g.row(3, 10, 13, HAIRC);
    g.row(7, 9, 14, HAIRC); // moustache
    g.pts([[11, 5], [13, 5]], K);
    if (!r) {
      g.rect(1, 25, 4, 27, C.ironDark); // dumbbell
      g.rect(5, 26, 6, 26, C.iron);
      g.path([[9, 14], [12, 15], [15, 14]], dark(PALE));
    } else {
      g.jaws((v) => v.poly([[6, 12], [18, 12], [16, 18], [8, 18]], 1), { len: 2 }); // the chest opens
      g.row(-3, -4, 24, C.iron);
      g.rect(-6, -5, -3, -1, C.ironDark);
      g.rect(23, -5, 26, -1, C.ironDark);
    }
  }, { w: 36, h: 41, dx: 7 });

  mk('upright-goat', 'goat standing upright like a man in a waistcoat horns slot eyes hooves cane', 16, 36, (g, r) => {
    const GT = hex('#b0a898');
    const f = g.at(0, 3);
    man(f, { head: false, top: C.forest, sleeve: GT, legs: GT, shoe: NIGHT, hand: r ? PALE : NIGHT, shirt: C.cream, arms: r ? 'reach' : 'down' });
    f.rect(5, 3, 10, 9, GT);
    f.rect(6, 9, 9, 12, GT); // the long nose
    f.path([[5, 3], [3, 1], [3, -2]], C.bone); // horns
    f.path([[10, 3], [12, 1], [12, -2]], C.bone);
    f.pts([[3, 5], [12, 5]], GT); // ears
    g.bevel();
    f.rect(5, 5, 6, 5, YEL);
    f.rect(9, 5, 10, 5, YEL);
    f.pts([[6, 5], [9, 5]], K);
    f.pts([[6, 11], [9, 11]], vd(GT));
    f.col(7, 13, 15, C.white); // beard
    f.pts([[7, 16], [8, 14]], C.white);
    f.over(4, 28, 11, 31, NIGHT, (x, y) => y > 29);
    if (!r) f.col(14, 14, 31, C.woodDark); // a cane
    else {
      f.rect(6, 10, 9, 14, K); // it has a man's teeth
      f.teeth(6, 9, 10, C.white, 1);
      f.teeth(6, 9, 14, C.white, 1);
      f.rect(5, 5, 6, 5, RED);
      f.rect(9, 5, 10, 5, RED);
    }
  }, { w: 30, dx: 7 });

  /* ---------- small ---------- */
  mk('teeth-on-legs', 'set of teeth on legs dentures running pink gums small', 12, 12, (g, r) => {
    const GM = hex('#b0606a');
    g.col(3, 8, 10, PALE);
    g.col(8, 8, 10, PALE);
    g.pts([[2, 10], [9, 10]], PALE);
    const o = r ? 3 : 0;
    g.rect(2, 2 - o + (r ? 1 : 0), 9, 4 - o + (r ? 1 : 0), GM);
    g.rect(2, 5, 9, 8, GM);
    g.bevel();
    if (r) g.rect(3, 3, 8, 5, K);
    g.teeth(2, 9, 4 - o + (r ? 1 : 0), C.white, 1);
    g.teeth(2, 9, 5 + (r ? 1 : 0), C.white, 1);
    if (r) {
      g.rect(5, 4, 6, 5, TNG);
      g.pts([[1, 3], [10, 3]], GM);
    }
  }, { h: 14 });

  mk('eye-snail', 'snail with an eyeball for a shell small slow watching', 12, 10, (g, r) => {
    const SL = hex('#9a8a6a');
    g.rect(1, 7, 10, 8, SL);
    g.rect(9, 4, 10, 7, SL);
    g.col(9, r ? 0 : 2, 4, SL);
    g.col(11, r ? 1 : 3, 5, SL);
    g.disc(4.5, 4.5, 3.5, EYE);
    g.bevel();
    g.disc(4.5, 4.5, 1.6, r ? RED : hex('#5a7a8a'));
    g.set(5, 5, K);
    if (r) {
      g.pts([[2, 2], [7, 7]], RED);
      g.pts([[9, 0], [11, 1]], K);
      g.row(6, 9, 10, K);
    }
  }, { h: 12 });

  mk('finger-worms', 'severed fingers crawling like worms nails small vermin', 16, 8, (g, r) => {
    const FN = hex('#c9a688');
    const list = r ? [[2, 0], [7, 1], [12, 0]] : [[1, 0], [6, 1], [11, 0]];
    for (const [x, k] of list) {
      if (!r) {
        g.rect(x, 4 + k, x + 3, 5 + k, FN);
        g.rect(x + 1, 3 + k, x + 2, 3 + k, FN); // the hump of the knuckle
        g.set(x + 3, 4 + k, C.bone); // nail
        g.set(x, 5 + k, C.blood);
        g.set(x + 2, 4 + k, dark(FN));
      } else {
        g.rect(x, 5, x + 2, 6, FN);
        g.rect(x + 1, -1 + k, x + 2, 5, FN);
        g.set(x, 6, C.blood);
        g.row(-1 + k, x + 1, x + 2, K); // the tip opens
        g.set(x + 1, k, C.white);
        g.row(2 + k, x + 1, x + 2, dark(FN));
      }
    }
  }, { h: 12 });

  mk('glove-crab', 'leather glove scuttling on its fingertips empty cuff small', 12, 10, (g, r) => {
    const GL = hex('#5a4030');
    for (const x of [2, 4, 6, 8]) g.col(x, 5, r && x > 5 ? 3 : 8, GL);
    if (r) g.pts([[6, 2], [8, 2], [9, 1]], GL);
    g.rect(2, 3, 8, 6, GL);
    g.rect(3, 1, 7, 3, GL); // cuff
    g.path([[9, 5], [10, 6], [10, 8]], GL); // thumb
    g.bevel();
    g.row(1, 4, 6, K);
    for (const x of [3, 5, 7]) g.col(x, 4, 5, dark(GL));
    if (r) {
      g.rect(4, 1, 6, 2, K);
      g.pts([[4, 2], [6, 2]], YEL);
    }
  });

  mk('shoe-walkers', 'pair of small shoes walking by themselves ankles and nothing above', 14, 9, (g, r) => {
    const SHO = hex('#7a3a30');
    for (const [x, k] of [[1, 0], [8, r ? -1 : 0]]) {
      g.rect(x + 1, 2 + k, x + 2, 5 + k, C.white); // sock
      g.rect(x, 5 + k, x + 4, 7 + k, SHO);
      g.row(1 + k, x + 1, x + 2, hex('#a0626a')); // the stump of an ankle
      if (r) {
        g.row(6 + k, x + 2, x + 4, K); // the toe opens
        g.pts([[x + 2, 6 + k], [x + 4, 6 + k]], C.white);
      }
    }
    g.bevel();
    g.pts([[4, 5], [11, r ? 4 : 5]], C.brass);
  });

  mk('tongue-slug', 'tongue crawling like a slug wet pink small', 14, 7, (g, r) => {
    if (!r) {
      g.oval(1, 2, 12, 5, TNG);
      g.bevel();
      g.row(3, 3, 10, dark(TNG));
      g.pts([[5, 2], [8, 4], [10, 3]], lite(TNG));
    } else {
      g.oval(1, 3, 9, 5, TNG);
      g.rect(8, -2, 11, 4, TNG); // the tip lifts
      g.bevel();
      g.rect(9, -2, 10, -1, K);
      g.pts([[9, -2], [10, -1]], C.white);
      g.row(4, 2, 7, dark(TNG));
      g.pts([[8, -4], [11, -4]], EYE);
      g.pts([[8, -3], [11, -3]], TNG);
    }
  }, { h: 12 });

  mk('ear-moths', 'ears fluttering like moths pairs of ears small swarm listening', 16, 16, (g, r) => {
    const EA = hex('#c0977e');
    const list = r ? [[1, 1], [9, 2], [4, 7], [10, 9]] : [[2, 2], [9, 5], [4, 9]];
    for (const [x, y] of list) {
      g.rect(x, y, x + 1, y + 3, EA);
      g.rect(x + 3, y, x + 4, y + 3, EA);
      g.set(x + 2, y + 1, K);
      g.set(x + 2, y + 2, K);
      g.pts([[x, y + 4], [x + 4, y + 4]], dark(EA));
      g.pts([[x + 1, y + 1], [x + 3, y + 1]], r ? RED : vd(EA));
    }
    g.shadow(4, 12, 14);
  });

  mk('one-foot-head', 'bald head hopping on one foot growing from its chin small', 10, 14, (g, r) => {
    const o = r ? -3 : 0;
    g.rect(4, 8 + o, 5, 11, PALE); // the one leg
    g.rect(3, 11, 7, 12, PALE);
    g.rect(1, 1 + o, 8, 8 + o, PALE);
    g.bevel();
    g.pts([[3, 4 + o], [6, 4 + o]], K);
    if (!r) g.row(6, 3, 6, vd(PALE));
    else {
      g.rect(2, 3, 7, 5, K);
      g.teeth(2, 7, 3, C.white, 2);
      g.rect(4, 5, 5, 6, TNG);
      g.pts([[3, 0], [6, 0]], C.white);
    }
    g.set(7, 12, dark(PALE));
  }, { h: 17 });
};
