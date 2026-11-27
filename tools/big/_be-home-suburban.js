/* What lives in the too-neat suburb (see be-home.js): mk(slug, name, draw(g, roused)); the canvas is cut to fit. */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd }, { P, vd, curve }, mk) => {
  const { PALE, ASHEN, DEAD, SICK, BRUISE, RAW, GUM, MOUTH, EYE, YEL, REDEYE, TOOTH, HAIR, WET, MOULD, FUR, GREY, PLASTIC, LAMP } = P;
  const SHADE = hex('#26222c'),
    GRASS = hex('#5a7a44'),
    HOSE = hex('#4a6a3e'),
    TAN = hex('#c9a58c');

  /* ---------- the lawn-mower hound ---------- */
  mk('lawnmower-hound', 'lawn mower hound dog mower blades for teeth engine garden machine animal monster', (g, r) => {
    const D = hex('#8a3a34'),
      I = C.ironDark;
    for (const [x, d] of [[9, -1], [24, 1]]) {
      g.limb([[x + 3, 12], [x + 4 + d, 15], [x + 3, 19]], dark(I), 2); // far legs
      g.limb([[x, 12], [x - 1 + d, 15], [x, 19]], I, 2);
      g.rect(x - 1, 19, x + 1, 19, I);
    }
    g.line(27, 9, 34, 1, C.steel); // the handle, carried like a tail
    g.line(28, 9, 35, 1, C.iron);
    g.rect(34, 0, 37, 1, C.black);
    g.rect(8, 8, 28, 13, D); // the deck
    g.row(8, 8, 28, lite(D));
    g.row(13, 8, 28, dark(D));
    g.rect(15, 3, 23, 8, I); // the engine on its back
    g.row(3, 15, 23, C.iron);
    g.rect(17, 1, 19, 3, C.iron);
    g.pts([[16, 5], [18, 5], [20, 5], [22, 5]], C.iron);
    if (r) {
      g.poly([[9, 8], [8, 2], [-1, -3], [-3, 0], [3, 8]], D); // the front of the deck is a jaw
      g.line(-1, -3, 8, 2, lite(D));
      g.poly([[3, 8], [9, 8], [9, 12], [5, 12]], MOUTH);
      g.poly([[9, 12], [1, 15], [-2, 13], [4, 10]], D);
      for (let i = 0; i < 5; i++) {
        g.line(-1 + i * 2, 0 + i, -1 + i * 2, 2 + i, C.steel); // blades
        g.set(0 + i * 2, 12 - (i >> 1), C.steel);
      }
      g.worm([[7, 10], [2, 11], [-1, 16]], 0.8, 0.6, GUM); // the pull-cord, lolling
      g.set(6, 3, YEL);
      g.pts([[25, -1], [27, -3], [24, -4]], GREY); // exhaust
    } else {
      g.poly([[8, 7], [8, 13], [1, 13], [0, 11], [4, 7]], D);
      g.row(11, 0, 8, K);
      for (let x = 1; x < 8; x += 2) g.set(x, 12, C.steel);
      g.set(6, 9, YEL);
      g.pts([[-1, 19], [1, 18], [3, 19]], GRASS); // cuttings
    }
  });

  /* ---------- the neighbour whose face is a hedge ---------- */
  mk('hedge-faced-neighbour', 'neighbour with a hedge for a face privet head garden shears man clipped monster', (g, r) => {
    const L = C.leaf,
      LL = C.leafLight;
    g.man({ head: false, skin: TAN, top: hex('#a8a08c'), legs: hex('#6a6a58'), shirt: C.white, arms: r ? { l: 'up', r: 'down' } : { l: 'hold', r: 'down' } });
    g.rect(7, 10, 8, 12, TAN);
    g.rect(2, 0, 13, 10, L); // clipped square
    g.row(0, 2, 13, LL);
    g.col(2, 0, 10, LL);
    g.speckle(2, 0, 13, 10, LL, 4, 6);
    g.speckle(2, 0, 13, 10, dark(L), 5, 2);
    const shears = (x, y, open) => {
      g.line(x, y, x - open, y - 7, C.steel);
      g.line(x, y, x + open, y - 7, C.steel);
      g.rect(x - 1, y + 1, x - 1, y + 3, C.wood);
      g.rect(x + 1, y + 1, x + 1, y + 3, C.wood);
    };
    if (r) {
      g.rect(3, 5, 12, 8, MOUTH); // it opens
      for (let x = 3; x <= 12; x += 2) {
        g.set(x, 5, C.woodPale); // twigs for teeth
        g.set(x + 1, 8, C.woodPale);
      }
      g.set(5, 2, C.red);
      g.set(10, 2, C.red);
      shears(0, -1, 3);
      g.pts([[-2, 6], [15, 3], [16, 8], [-3, 1]], LL); // leaves fly
    } else {
      g.rect(4, 3, 5, 4, vd(L)); // dark places where a face would be
      g.rect(10, 3, 11, 4, vd(L));
      g.row(7, 5, 10, vd(L));
      shears(7, 15, 1);
    }
  });

  /* ---------- the sprinkler serpent ---------- */
  mk('sprinkler-serpent', 'sprinkler serpent garden hose snake lawn sprinkler head water coils large long', (g, r) => {
    const B = C.brass;
    for (const [y, x0, x1] of [[15, 30, 44], [12, 31, 43], [9, 33, 41]]) {
      g.oval(x0, y - 2, x1, y + 2, HOSE); // the coils
      g.row(y - 2, x0 + 3, x1 - 3, lite(HOSE));
      g.row(y + 2, x0 + 2, x1 - 2, vd(HOSE));
    }
    const p = curve(r ? [[32, 15], [24, 16], [17, 10], [15, -2], [9, -9], [3, -8]] : [[32, 15], [24, 16], [16, 13], [9, 16], [4, 14]], 6);
    g.tube(p, 1.6, 1.4, HOSE);
    for (let i = 2; i < p.length; i += 5) g.set(p[i][0], p[i][1] - 1, mix(HOSE, 1.4));
    const [hx, hy] = r ? [2, -8] : [3, 13];
    g.rect(hx - 3, hy - 2, hx + 1, hy + 1, B); // the sprinkler head
    g.row(hy - 3, hx - 2, hx + 2, B);
    g.rect(hx + 1, hy - 5, hx + 2, hy - 3, dark(B));
    g.set(hx - 1, hy - 1, r ? REDEYE : K);
    if (r) {
      g.rect(hx - 4, hy, hx - 2, hy + 1, MOUTH);
      g.pts([[hx - 4, hy - 1], [hx - 2, hy + 2], [hx - 4, hy + 2]], C.steel);
      for (const [x, y] of [[-6, -2], [-8, -5], [-5, -10], [-9, -9], [-7, 2], [-10, -1], [-3, -13], [-11, -5]]) g.set(hx + x + 3, hy + y + 2, C.glassLight); // spray
    } else {
      g.col(hx - 1, hy + 2, hy + 3, C.steel); // on its spike
      g.pts([[hx - 5, hy - 2], [hx - 7, hy - 1]], C.glassLight);
    }
  });

  /* ---------- the barbecue ---------- */
  mk('barbecue-ribs', 'barbecue with ribs of its own kettle grill rib cage coals legs smoke monster', (g, r) => {
    const E = hex('#2a2a32'),
      BN = C.bone;
    g.limb([[6, 15], [3, r ? 20 : 22], [r ? 0 : 3, 27]], C.steel, 1); // its legs
    g.limb([[15, 15], [18, r ? 20 : 22], [r ? 21 : 18, 27]], C.steel, 1);
    g.limb([[10, 16], [10, 22], [r ? 12 : 10, 27]], C.iron, 1);
    g.oval(1, 25, 4, 28, C.ironDark);
    g.set(r ? 0 : 3, 27, r ? C.steel : C.ironDark);
    g.ball(2, 8, 19, 18, E); // the bowl
    g.rect(2, 8, 19, 11, E);
    if (r) {
      g.rect(3, 6, 18, 9, C.blood); // coals
      g.pts([[5, 7], [9, 6], [13, 7], [16, 6]], C.flame);
      g.pts([[7, 4], [11, 3], [14, 5], [8, 2]], C.flameLight);
      g.poly([[14, 5], [22, -6], [27, 0], [20, 8]], E); // the lid, thrown back
      g.line(22, -6, 14, 5, hex('#4a4a58'));
      for (let i = 0; i < 4; i++) {
        g.limb(curve([[4 + i * 2, 11], [-2 - i, 9 - i * 2], [-4 - i, 2 - i * 2], [-1 - i, -1 - i * 2]], 4), BN, 1); // its ribs open like fingers
        g.limb(curve([[12 + i * 2, 13], [16 + i, 20], [22 + i, 18 - i], [24 + i, 13 - i]], 4), dark(BN), 1);
      }
      g.pts([[10, -2], [12, -5], [9, -7]], GREY);
    } else {
      g.ball(2, 1, 19, 11, E, hex('#4a4a58')); // the lid
      g.rect(2, 9, 19, 9, hex('#4a4a58'));
      g.rect(9, -1, 12, 0, C.wood); // its handle
      g.set(6, 4, C.steel); // the vent
      g.set(7, 3, C.steel);
      for (let i = 0; i < 5; i++) g.limb(curve([[4 + i * 3, 10], [3 + i * 3, 13], [5 + i * 3, 17]], 3), i % 2 ? dark(BN) : BN, 1); // ribs laid round the bowl
      g.pts([[16, -3], [17, -6]], GREY);
    }
  });

  /* ---------- the mailbox ---------- */
  mk('mailbox-mimic', 'mailbox mimic letter box on a post mouth tongue teeth flag kerb monster', (g, r) => {
    const M = hex('#6a7484');
    if (r) {
      g.limb([[7, 10], [4, 17], [5, 24]], C.wood, 2); // the post has come apart into legs
      g.limb([[9, 10], [12, 17], [11, 24]], C.woodDark, 2);
      g.rect(3, 24, 6, 24, C.wood);
      g.rect(10, 24, 13, 24, C.woodDark);
    } else {
      g.rect(7, 10, 9, 24, C.wood);
      g.col(9, 10, 24, C.woodDark);
      g.pts([[5, 24], [6, 23], [11, 24], [10, 23]], GRASS);
    }
    g.rect(2, 4, 15, 10, M);
    g.rect(3, 2, 14, 3, M);
    g.row(1, 5, 12, M);
    g.row(1, 5, 12, lite(M));
    g.row(10, 2, 15, dark(M));
    if (r) {
      g.rect(1, 3, 3, 9, MOUTH); // the door drops
      g.poly([[0, 10], [3, 10], [-3, 14], [-5, 12]], M);
      g.pts([[1, 3], [3, 3], [2, 9]], TOOTH);
      g.pts([[2, 4], [1, 8], [3, 8]], TOOTH);
      g.worm([[3, 7], [-2, 9], [-6, 16], [-4, 20]], 1.2, 0.8, GUM);
      g.rect(12, -4, 13, 5, C.steel); // flag up
      g.rect(10, -4, 12, -2, C.red);
      g.orb(6, 0, 1, [-1, 0], K, YEL);
      g.orb(10, 0, 1, [-1, 0], K, YEL);
    } else {
      g.col(2, 4, 9, dark(M));
      g.set(1, 6, C.steel);
      g.rect(8, 6, 13, 6, C.steel); // flag down
      g.rect(11, 5, 13, 7, C.red);
      g.rect(0, 8, 2, 8, C.white); // a letter, not quite inside
      g.pts([[5, 12], [5, 13]], dark(C.wood));
    }
  });

  /* ---------- the smiling family ---------- */
  mk('smiling-family', 'smiling family as one creature father mother children fused many heads one jumper large', (g, r) => {
    const SW = hex('#8a9a8e'),
      face = r ? 'grin' : 'smile';
    for (const [x, col, bare] of [[4, C.navy], [9, hex('#6a6a58')], [14, C.navy, TAN], [19, hex('#5a4a3a')], [24, C.navy, TAN]]) g.leg(x, 34, 44, col, x < 14 ? -1 : 1, C.black, bare); // more legs than it should have
    g.poly([[5, 13], [26, 13], [29, 35], [2, 35]], SW); // one jumper for all of them
    g.col(4, 16, 34, lite(SW));
    g.row(35, 2, 29, dark(SW));
    for (let x = 6; x < 27; x += 4) g.pts([[x, 20], [x + 2, 22], [x, 28], [x + 2, 30]], C.cream);
    const necks = r ? [[-2, -5], [14, -6], [-6, 9], [18, 10]] : [[1, 0], [13, 1], [-3, 11], [17, 12]];
    const who = [['parted', C.woodDark], ['bob', hex('#a08a4a')], ['crop', hex('#a08a4a')], ['long', C.woodDark, 9]];
    who.forEach((h, i) => {
      const [hx, hy] = necks[i];
      if (r) g.worm([[i % 2 ? 22 : 9, 16 + (i > 1 ? 8 : 0)], [hx + 8, hy + 12]], 1.4, 1.4, TAN); // their necks give
      g.head(hx, hy, i > 1 ? PALE : TAN, face, h, K);
    });
    for (const v of [g, g.flip(31)]) {
      if (r) {
        v.arm([[3, 18], [-4, 22], [-8, 18]], SW, 2, 'l', TAN, 3);
        v.arm([[4, 28], [-3, 31], [-6, 36]], SW, 2, 'd', TAN, 3);
      } else {
        v.rect(1, 15, 3, 28, SW);
        v.col(1, 15, 28, lite(SW));
        v.rect(1, 29, 3, 31, TAN);
      }
    }
    if (!r) {
      g.rect(13, 26, 18, 28, TAN); // hands folded, three of them
      g.pts([[13, 29], [15, 29], [17, 29]], dark(TAN));
    }
  });

  /* ---------- the paperboy ---------- */
  mk('paperboy-faceless', 'paperboy with no face newspaper boy blank face cap bag of papers child thing', (g, r) => {
    const SK = TAN;
    g.man({ skin: SK, top: hex('#7a8a6a'), legs: C.navy, tl: 8, ll: 8, face: 'none', hair: ['cap', C.wine], arms: r ? { l: 'up', r: 'down' } : { l: 'hold', r: 'down' } });
    g.line(4, 12, 11, 19, C.straw); // the strap
    g.rect(9, 18, 14, 23, hex('#8a744e')); // the bag
    g.row(18, 9, 14, C.straw);
    for (const x of [10, 12]) g.rect(x, 15, x + 1, 17, C.white);
    g.set(10, 16, C.stone);
    if (r) {
      g.oval(5, 5, 10, 10, K); // where the face is not
      g.pts([[7, 7], [8, 8]], hex('#3a2a30'));
      g.rect(-2, -2, 1, 1, C.white); // he throws
      g.set(0, 0, C.stone);
      for (const [x, y] of [[17, 8], [21, 3], [19, 14]]) {
        g.poly([[x, y], [x + 3, y - 2], [x + 4, y], [x + 1, y + 2]], C.white); // the papers go out like birds
        g.set(x + 2, y, C.stone);
      }
    } else {
      g.set(7, 7, dark(SK));
      g.rect(6, 15, 7, 18, C.white); // a paper, rolled
      g.set(6, 16, C.stone);
    }
  });

  /* ---------- garden gnomes ---------- */
  mk('gnome-swarm', 'garden gnome swarm gnomes ornaments little men red hats knives many small', (g, r) => {
    const gnome = (x, y, hat, coat, armed) => {
      const v = g.at(x, y);
      v.poly([[2, 0], [3, 0], [5, 4], [0, 4]], hat);
      v.rect(1, 5, 4, 6, TAN);
      v.set(1, 5, r ? REDEYE : K);
      v.set(4, 5, r ? REDEYE : K);
      v.rect(1, 7, 4, 9, C.white); // beard
      if (r) v.rect(2, 7, 3, 7, MOUTH);
      v.rect(0, 8, 5, 11, coat);
      v.rect(1, 7, 4, 9, C.white);
      if (r) v.rect(2, 7, 3, 7, MOUTH);
      v.rect(0, 12, 2, 12, C.black);
      v.rect(3, 12, 5, 12, C.black);
      if (armed) {
        v.col(6, 4, 9, C.steel); // a knife from the kitchen
        v.set(6, 10, C.wood);
      }
    };
    const RD = hex('#9a3a34'),
      BL = hex('#3f5270'),
      GN = hex('#4a6a3e');
    if (r) {
      gnome(8, -9, RD, GN, 1); // they climb on one another
      gnome(3, 1, RD, BL, 0);
      gnome(12, 2, RD, GN, 1);
      gnome(-3, 3, RD, BL, 1);
      gnome(19, 3, RD, BL, 0);
      gnome(7, 4, RD, BL, 1);
    } else {
      gnome(2, 1, RD, BL);
      gnome(16, 2, RD, GN);
      gnome(9, 3, RD, BL);
      gnome(22, 3, RD, BL);
      g.line(21, 5, 26, 0, C.wood); // one of them fishes
      g.col(26, 0, 6, C.stone);
    }
  });

  /* ---------- the thing under the pool cover ---------- */
  mk('pool-thing', 'pool thing under the cover swimming pool tarpaulin bulge wet arms eyes large long', (g, r) => {
    const T = hex('#3f5f86'),
      SK = hex('#8fa6a0');
    const top = (x) => (r ? 10 - 22 * Math.exp(-(((x - 22) / 9) ** 2)) : 10 - 5 * Math.exp(-(((x - 26) / 7) ** 2)));
    for (let x = 1; x <= 46; x++) {
      const y = Math.round(top(x));
      g.col(x, y, 13, T);
      g.set(x, y, lite(T));
      if (x % 6 === 0) g.col(x, y + 1, 13, dark(T)); // folds
    }
    g.row(13, 1, 46, dark(T));
    for (const x of [3, 14, 33, 44]) g.oval(x - 2, 10, x + 2, 13, hex('#b9b7a6')); // the weights that hold it down
    if (r) {
      g.poly([[15, 13], [29, 13], [26, 2], [18, 2]], K); // it lifts the cover and looks out
      for (const [x, y] of [[19, 5], [24, 4], [21, 8], [26, 9], [18, 11]]) g.eye(x, y, 2, 1, 0, 0, K, YEL);
      g.arm([[17, 11], [9, 8], [3, 14]], SK, 2, 'd', SK, 3);
      g.arm([[27, 11], [36, 7], [42, 14]], SK, 2, 'd', SK, 3);
      g.drips(4, 42, 9, C.water, 5, 3, 5);
    } else {
      g.rect(-1, 12, 1, 13, SK); // a hand at the edge
      g.pts([[-2, 13], [-1, 11]], SK);
      g.pts([[24, 6], [28, 6]], dark(T)); // two dents in the bulge
      g.oval(36, 14, 44, 15, C.water);
    }
  });

  /* ---------- the dog the size of a station wagon ---------- */
  mk('station-wagon-dog', 'dog the size of a station wagon huge family dog retriever too big jaws animal large long', (g, r) => {
    const F = hex('#a8854e'),
      FD = dark(F);
    for (const x of [16, 27, 38]) g.rect(x, 18, x + 3, 27, FD); // legs, six of them
    g.worm([[45, 10], [50, 6], [51, 0]], 2, 1.2, F); // the tail still wags
    g.ball(10, 4, 47, 21, F);
    g.rect(14, 5, 44, 8, F);
    g.row(4, 16, 42, lite(F));
    for (const x of [12, 23, 34, 43]) {
      g.rect(x, 17, x + 3, 28, F);
      g.rect(x - 1, 28, x + 3, 29, FD);
    }
    g.speckle(10, 4, 47, 21, FD, 14, 3);
    g.col(12, 6, 18, C.red); // the collar
    g.set(11, 19, C.gold);
    if (r) {
      g.poly([[12, 5], [8, -6], [-2, -8], [-6, -3], [2, 6]], F); // the head opens back to the shoulders
      g.poly([[12, 20], [8, 25], [-3, 27], [-6, 23], [2, 17]], F);
      g.poly([[11, 6], [2, 6], [1, 17], [11, 19]], MOUTH);
      for (let i = 0; i < 5; i++) {
        g.col(-3 + i * 3, -1 + i * 2, 1 + i * 2, TOOTH);
        g.col(-2 + i * 3, 21 - i, 23 - i, TOOTH);
      }
      g.worm([[9, 13], [2, 14], [-4, 20]], 2.2, 1.6, GUM);
      g.eye(2, -5, 2, 2, 0, 0);
      g.poly([[8, -6], [12, -4], [13, 3], [10, 2]], FD);
    } else {
      g.ball(0, 3, 13, 17, F); // a kind face
      g.rect(-3, 9, 4, 15, F);
      g.rect(-4, 10, -3, 12, K);
      g.poly([[9, 3], [13, 5], [14, 14], [11, 13]], FD); // ear
      g.eye(4, 7, 2, 2, 0, 1); // a person's eye
      g.row(15, -3, 6, K);
      g.pts([[-2, 14], [0, 14], [2, 14], [4, 14]], TOOTH); // and a person's teeth
      g.pts([[-2, 16], [0, 16], [2, 16], [4, 16]], TOOTH);
    }
  });

  /* ---------- the giant of the cul-de-sac ---------- */
  mk('cul-de-sac-giant', 'cul-de-sac giant in a cardigan enormous neighbour small head huge hands tall large', (g, r) => {
    const CA = hex('#8a744e'),
      TR = hex('#6a6a58'),
      SK = TAN;
    for (const x of [7, 17]) {
      g.rect(x, 38, x + 6, 56, TR);
      g.col(x, 38, 56, lite(TR));
      g.col(x + 6, 38, 56, dark(TR));
      g.rect(x - 1, 56, x + 7, 58, hex('#6a3a40')); // slippers
    }
    g.poly([[6, 11], [24, 11], [28, 22], [27, 40], [3, 40], [2, 22]], CA);
    g.col(4, 20, 39, lite(CA));
    g.poly([[12, 11], [18, 11], [15, 19]], C.white);
    g.col(15, 19, 40, dark(CA));
    for (const y of [23, 28, 33, 38]) g.set(17, y, C.woodDark);
    for (let y = 14; y < 40; y += 3) g.pts([[8, y], [22, y + 1]], dark(CA)); // the knit
    g.rect(14, 8, 16, 11, SK);
    g.head(7, -2, SK, r ? 'grin' : 'smile', ['thin', GREY], K); // a small kind head
    for (const v of [g, g.flip(30)]) {
      if (r) {
        v.tube([[4, 14], [-4, 22], [-9, 32]], 3, 2.6, CA);
        v.ball(-13, 31, -6, 39, SK); // hands like spades
        for (const x of [-13, -11, -9, -7]) v.col(x, 39, 43, SK);
        v.col(-5, 34, 38, SK);
      } else {
        v.tube([[4, 14], [1, 26], [1, 38]], 3, 2.6, CA);
        v.ball(-2, 38, 4, 45, SK);
        for (const x of [-2, 0, 2, 4]) v.col(x, 45, 48, SK);
      }
    }
  });

  /* ---------- the plastic flamingo ---------- */
  mk('flamingo-thing', 'plastic flamingo lawn ornament pink bird human eye neck splits teeth thing', (g, r) => {
    const PK = hex('#c08a90');
    g.col(7, 16, 27, C.steel); // wire legs
    g.col(10, 16, 27, C.iron);
    if (r) {
      g.limb([[6, 16], [2, 21], [3, 27]], C.steel, 1);
      g.limb([[11, 16], [15, 21], [14, 27]], C.iron, 1);
      g.poly([[6, 12], [1, 4], [-3, 6], [4, 15]], PK); // wings like blades
      g.poly([[12, 12], [18, 5], [21, 8], [13, 15]], dark(PK));
    }
    g.ball(3, 9, 14, 17, PK);
    g.poly([[13, 11], [17, 10], [16, 14]], PK); // tail
    if (r) {
      g.worm([[5, 11], [2, 4], [4, -3]], 1.4, 1.2, PK); // the neck comes apart in two
      g.worm([[6, 11], [8, 3], [5, -2], [8, -6]], 1.4, 1.2, PK);
      g.rect(4, 0, 6, 6, MOUTH);
      g.pts([[4, 1], [6, 2], [4, 3], [6, 4], [4, 5]], TOOTH);
      g.poly([[8, -8], [11, -7], [12, -3], [10, -4]], K);
      g.orb(8, -7, 1, [0, 0], K, EYE);
      g.poly([[3, -5], [1, -2], [3, 0]], K);
    } else {
      g.worm([[5, 11], [2, 6], [5, 2], [3, -1]], 1.3, 1.2, PK);
      g.rect(1, -3, 4, -1, PK);
      g.poly([[1, -1], [-1, 1], [0, 3], [2, 0]], K); // beak
      g.set(0, 0, C.white);
      g.orb(8, 12, 2, [-1, 0], hex('#4a6a7a')); // the eye is not a bird's, and not there
      g.set(3, -2, K);
    }
  });

  mk('welcome-mat-mouth', 'welcome mat mouth doormat bristles teeth front door bites ankles vermin small', (g, r) => {
    const M = hex('#7a5a3c');
    if (r) {
      g.poly([[1, 4], [16, 4], [14, -3], [3, -3]], M); // the near half lifts
      g.rect(1, 4, 16, 6, MOUTH);
      g.rect(5, 5, 12, 6, GUM);
      g.teeth(1, 16, 4, 1, C.straw, 2, false);
      g.rect(1, 7, 16, 8, M);
      g.teeth(2, 16, 7, -1, C.straw, 2, false);
      g.set(5, -1, YEL);
      g.set(12, -1, YEL);
      g.row(-3, 3, 14, lite(M));
    } else {
      g.rect(1, 4, 16, 8, M);
      g.row(4, 1, 16, lite(M));
      g.frame(2, 5, 15, 7, dark(M));
      for (let x = 4; x < 14; x += 2) g.set(x, 6, C.straw); // WELCOME
      g.row(8, 1, 16, dark(M));
    }
    for (let x = 1; x <= 16; x += 2) g.set(x, 9, dark(M)); // bristles
  });

  /* ---------- the man with a wasps' nest ---------- */
  mk('wasp-nest-head', 'man with a wasp nest for a head wasps hornets paper nest gardener swarm monster', (g, r) => {
    const N = hex('#a8a08c'),
      ND = hex('#7a745e');
    g.man({ head: false, skin: TAN, top: hex('#5e6a54'), legs: hex('#5a4a3a'), apron: hex('#8a744e'), arms: r ? { l: 'reach', r: 'down' } : 'down' });
    g.rect(7, 10, 8, 12, TAN);
    g.ball(2, -3, 13, 11, N);
    for (let y = -1; y < 11; y += 2) g.each(2, y, 13, y, (p, x) => (p !== K && (x + y) % 5 !== 0 ? ND : null)); // paper, layer on layer
    g.lit(2, -3, 13, 11);
    g.rect(6, 5, 8, 7, K); // the way in
    const wasp = (x, y) => {
      g.set(x, y, C.mustard);
      g.set(x + 1, y, K);
    };
    if (r) {
      g.rect(5, 3, 10, 9, K); // it breaks open
      g.pts([[6, 4], [9, 4]], YEL);
      const R = rnd(8);
      for (let i = 0; i < 26; i++) {
        const t = R();
        wasp(4 - t * 20 + R() * 4, 6 - t * 4 + R() * 9 - 4 + t * t * 14); // and they pour out towards you
      }
    } else {
      wasp(11, 2);
      wasp(14, 6);
      wasp(1, -2);
      wasp(-1, 9);
    }
  });

  /* ---------- the neighbour with the casserole ---------- */
  mk('casserole-lady', 'neighbour lady with a casserole dish smile head opens like a lid apron housewife monster', (g, r) => {
    const SK = TAN,
      DR = hex('#8a9aa0');
    g.man({ head: false, skin: SK, top: DR, robe: DR, apron: C.white, shoe: false, arms: 'hold' });
    g.rect(7, 11, 8, 12, SK);
    if (r) {
      g.face(4, 3, SK, 'none');
      g.rect(4, 6, 11, 8, MOUTH); // the head lifts at the smile
      g.teeth(4, 11, 8, -1, TOOTH, 1, false);
      const h = g.at(1, -5);
      h.rect(3, 3, 10, 7, SK); // and the top of it tips back
      h.row(2, 4, 9, SK);
      h.teeth(3, 10, 8, 1, TOOTH, 1, false);
      h.rect(1, 0, 11, 3, hex('#8a6a4a'));
      h.rect(0, 1, 1, 6, hex('#8a6a4a'));
      h.rect(11, 1, 12, 6, hex('#6a4a2e'));
      h.eye(4, 5, 2, 1, 1);
      h.eye(8, 5, 2, 1, 0);
      g.worm([[7, 7], [8, 4], [10, 2]], 0.8, 0.6, GUM);
    } else {
      g.head(0, 0, SK, 'grin', ['perm', hex('#8a6a4a')], K);
    }
    g.rect(3, 15, 12, 19, hex('#b0603a')); // the dish
    g.row(15, 3, 12, hex('#c98a5a'));
    g.pts([[2, 16], [13, 16]], hex('#b0603a'));
    if (r) {
      g.rect(4, 14, 11, 15, MOUTH);
      g.orb(7, 14, 2, [0, 0], REDEYE); // what she has brought
      g.poly([[5, 9], [12, 8], [13, 10], [6, 11]], hex('#c98a5a')); // the lid goes up by itself
    } else {
      g.rect(3, 13, 12, 14, hex('#c98a5a')); // lid
      g.rect(7, 12, 8, 12, C.black);
      g.pts([[6, 10], [9, 9]], C.ghost); // steam
    }
  });

  /* ---------- the trampoline ---------- */
  mk('trampoline-spider', 'trampoline spider garden trampoline steel legs net springs fangs under the mat large long', (g, r) => {
    const ST = C.steel,
      PAD = hex('#3f5f86');
    const up = r ? -9 : 0;
    for (const [x, d] of [[6, -1], [14, -1], [22, -1], [26, 1], [34, 1], [42, 1]]) {
      if (r) g.limb([[x, 10 + up], [x + d * 6, -4 + up + Math.abs(24 - x) / 3], [x + d * 9, 22]], ST, 2);
      else g.limb([[x, 11], [x + d * 3, 14], [x + d * 4, 22]], ST, 2);
    }
    if (r) {
      g.ball(15, 9 + up, 33, 22 + up, SHADE); // what hangs under the mat
      g.maw(18, 15 + up, 30, 20 + up, { step: 2 });
      for (const [x, y] of [[19, 12], [23, 11], [27, 12], [21, 13], [25, 13]]) g.set(x, y + up, YEL);
      g.pts([[20, 21 + up], [28, 21 + up]], C.steel); // spring fangs
      g.pts([[20, 22 + up], [28, 22 + up]], C.steel);
      g.pts([[20, 23 + up], [28, 23 + up]], C.steel);
    } else {
      g.oval(16, 11, 32, 16, SHADE);
      g.set(21, 14, YEL);
      g.set(26, 14, YEL);
    }
    g.rect(2, 8 + up, 46, 11 + up, PAD); // the pad round the edge
    g.row(8 + up, 3, 45, lite(PAD));
    g.rect(6, 8 + up, 42, 9 + up, hex('#22222a')); // the mat
    g.row(11 + up, 2, 46, dark(PAD));
    for (let x = 4; x < 46; x += 4) g.set(x, 10 + up, C.steel); // springs
    g.clear(2, 8 + up);
    g.clear(46, 8 + up);
  });

  /* ---------- the wheelie bin ---------- */
  mk('wheelie-bin-lurker', 'wheelie bin lurker dustbin rubbish bin lid eyes arms something lives in it monster', (g, r) => {
    const B = hex('#3e5a48'),
      SK = DEAD;
    g.oval(9, 22, 14, 27, C.ironDark); // wheel
    g.set(11, 24, C.steel);
    g.poly([[2, 6], [14, 6], [13, 25], [3, 25]], B);
    g.col(3, 7, 24, lite(B));
    g.rect(5, 12, 8, 14, C.white); // its number
    g.set(6, 13, K);
    g.row(9, 2, 14, dark(B));
    if (r) {
      g.rect(3, 3, 13, 6, K);
      g.poly([[13, 6], [15, 6], [19, -6], [17, -7]], B); // lid flung back
      g.ball(4, -5, 12, 4, SK);
      g.rect(5, -2, 6, -1, K);
      g.rect(9, -2, 10, -1, K);
      g.row(2, 5, 11, K);
      g.pts([[5, 2], [7, 2], [9, 2], [11, 2]], TOOTH);
      g.arm([[3, 5], [-3, 8], [-5, 17]], SK, 2, 'd', SK, 3);
      g.arm([[13, 5], [19, 9], [20, 17]], dark(SK), 2, 'd', SK, 3);
      g.arm([[4, 4], [-2, -1], [-5, -6]], SK, 1, 'u', SK, 3);
    } else {
      g.rect(1, 3, 15, 5, B); // lid, not quite down
      g.row(3, 1, 15, lite(B));
      g.rect(2, 6, 14, 6, K);
      g.set(5, 6, YEL);
      g.set(8, 6, YEL);
      g.rect(11, 6, 13, 7, SK); // fingers
      g.set(12, 8, SK);
    }
  });

  /* ---------- small things of the lawn ---------- */
  mk('mole-lawn-hands', 'mole with hands molehill in the lawn big pink digging hands blind snout vermin small', (g, r) => {
    const E = C.earth,
      PK = hex('#c9a0a0');
    g.ball(2, 5, 15, 12, E);
    g.rect(2, 10, 15, 11, E);
    g.speckle(2, 5, 15, 11, dark(E), 4, 3);
    g.pts([[0, 11], [17, 11], [1, 10]], GRASS);
    if (r) {
      g.ball(5, -2, 12, 7, hex('#3a3238')); // it comes up
      g.ball(7, 0, 10, 3, PK); // a nose like a hand
      g.pts([[6, -1], [11, -1], [6, 4], [11, 4], [8, -2], [9, 5]], PK);
      g.rect(7, 5, 10, 6, MOUTH);
      g.pts([[7, 5], [10, 5]], TOOTH);
      g.hand(0, 1, 'u', PK, 3);
      g.hand(15, 1, 'u', PK, 3);
      g.col(1, 3, 6, PK);
      g.col(16, 3, 6, PK);
    } else {
      g.hand(1, 6, 'l', PK, 2); // only the hands show
      g.hand(15, 6, 'r', PK, 2);
      g.rect(7, 4, 10, 5, K);
      g.set(8, 4, PK);
    }
    g.row(11, 2, 15, dark(E));
  });

  mk('squirrel-skull', 'squirrel with a skull for a head bushy tail bone rodent tree garden vermin small', (g, r) => {
    const F = hex('#8a5a3a'),
      up = r ? -3 : 0;
    g.worm(r ? [[9, 10], [14, 6], [13, -4], [9, -8]] : [[9, 10], [13, 8], [13, 2], [10, 0]], 2, r ? 3.2 : 2.6, F); // the tail
    if (r) g.pts([[15, -7], [12, -10], [7, -10], [16, -2]], F);
    g.ball(4, 5 + up, 10, 12, F);
    g.rect(4, 11, 6, 12, F);
    g.rect(8, 11, 10, 12, dark(F));
    g.rect(2, 1 + up, 7, 5 + up, C.bone); // the skull
    g.rect(1, 3 + up, 2, 5 + up, C.bone);
    g.rect(4, 2 + up, 5, 3 + up, K);
    g.set(1, 4 + up, K);
    g.pts([[6, 0 + up], [7, 0 + up]], F); // ears, still
    if (r) {
      g.set(5, 2 + up, REDEYE);
      g.rect(1, 6 + up, 5, 7 + up, MOUTH);
      g.rect(1, 8 + up, 6, 8 + up, C.bone);
      g.pts([[1, 6 + up], [3, 6 + up], [2, 7 + up]], TOOTH);
      g.limb([[5, 7 + up + 2], [1, 8], [0, 5]], F, 1);
    } else {
      g.row(6, 2, 5, dark(C.bone));
      g.pts([[2, 6], [4, 6]], K);
      g.rect(2, 8, 3, 9, C.wood); // it has a nut, at least
      g.set(4, 8, F);
    }
  });

  mk('raccoon-hands', 'raccoon with human hands masked animal bin raider long fingers stands up vermin small', (g, r) => {
    const F = GREY,
      SK = PALE;
    if (r) {
      g.worm([[9, 12], [14, 12], [17, 8]], 1.6, 1.3, F);
      g.pts([[13, 12], [16, 10]], K);
      g.ball(5, 3, 11, 13, F); // it stands up like a man
      g.rect(5, 13, 6, 15, dark(F));
      g.rect(9, 13, 10, 15, dark(F));
      g.rect(5, 6, 9, 11, lite(F));
      g.ball(4, -4, 12, 3, F);
      g.pts([[4, -5], [12, -5]], F);
      g.rect(5, -1, 11, 0, K); // the mask
      g.set(6, -1, YEL);
      g.set(10, -1, YEL);
      g.rect(7, 1, 9, 2, C.white);
      g.set(8, 1, K);
      g.arm([[5, 5], [0, 4], [-3, 0]], F, 1, 'u', SK, 3);
      g.arm([[11, 5], [16, 3], [18, -1]], F, 1, 'u', SK, 3);
    } else {
      g.worm([[12, 8], [16, 9], [19, 6]], 1.6, 1.3, F); // ringed tail
      g.pts([[15, 9], [18, 7]], K);
      g.ball(4, 5, 13, 11, F);
      g.rect(10, 10, 11, 13, dark(F));
      g.ball(0, 3, 7, 9, F);
      g.pts([[1, 2], [6, 2]], F);
      g.rect(0, 5, 5, 6, K);
      g.set(1, 5, C.white);
      g.set(4, 5, C.white);
      g.set(-1, 7, K);
      g.rect(4, 10, 5, 12, F);
      g.hand(3, 13, 'l', SK, 3); // hands like yours
      g.set(11, 14, SK);
      g.row(14, 9, 12, SK);
    }
  });

  /* ---------- the street lamp ---------- */
  mk('streetlamp-watcher', 'street lamp that watches lamp post bends down eye for a light tall thin thing large', (g, r) => {
    const I = hex('#4a5a54');
    g.rect(5, 54, 11, 57, I); // the foot
    g.row(54, 5, 11, lite(I));
    g.limb([[5, 56], [2, 57], [0, 58]], I, 1); // it has pulled up roots
    g.limb([[11, 56], [14, 57], [16, 58]], I, 1);
    g.set(8, 58, I);
    const p = curve(r ? [[8, 54], [8, 34], [9, 18], [4, 8], [-5, 8], [-9, 14]] : [[8, 54], [8, 30], [8, 10], [10, 3], [15, 2]], 8);
    g.tube(p, 1.3, 1, I);
    if (r) {
      g.poly([[-13, 14], [-5, 14], [-4, 18], [-14, 18]], I); // the lamp looks down at you
      g.oval(-13, 17, -5, 23, LAMP);
      g.oval(-11, 18, -7, 22, C.white);
      g.rect(-10, 20, -9, 21, K);
      g.pts([[-15, 25], [-9, 27], [-3, 25]], LAMP);
      g.arm([[8, 30], [2, 34], [-2, 42]], I, 1, 'd', I, 3); // and it has arms, after all
      g.arm([[9, 26], [15, 31], [17, 39]], I, 1, 'd', I, 3);
    } else {
      g.poly([[13, 2], [21, 2], [22, 5], [12, 5]], I);
      g.row(6, 13, 21, dark(LAMP)); // not lit
      g.set(17, 6, K);
      g.limb([[8, 30], [7, 36]], I, 1);
      g.limb([[9, 28], [10, 34]], I, 1);
      g.rect(7, 40, 10, 43, C.white); // a notice about a lost cat
      g.set(8, 41, K);
    }
  });

  /* ---------- the garden shed ---------- */
  mk('shed-dweller', 'garden shed dweller shed on legs door ajar eyes arm tools hut walks tall large', (g, r) => {
    const W = hex('#7a5a3c'),
      RF = hex('#3a3a44'),
      SK = DEAD,
      up = r ? -16 : 0,
      v = g.at(0, up);
    if (r) {
      for (const [x, k, f] of [[5, 1, 4], [11, 13, 10], [17, 15, 18], [23, 27, 24]]) {
        g.limb([[x, 34 + up], [k, 26], [f, 35]], hex('#8a744e'), 2); // legs like a hen's
        g.pts([[f - 2, 36], [f, 36], [f + 2, 36]], hex('#8a744e'));
      }
    }
    v.rect(3, 10, 25, 34, W);
    for (let x = 3; x <= 25; x += 3) v.col(x, 10, 34, dark(W)); // boards
    v.col(3, 10, 34, lite(W));
    v.poly([[1, 10], [27, 10], [20, 3], [8, 3]], RF); // the roof
    v.row(3, 8, 20, lite(RF));
    v.row(10, 1, 27, K);
    v.rect(17, 15, 23, 20, C.glass); // a window
    v.frame(17, 15, 23, 20, C.woodDark);
    v.col(20, 15, 20, C.woodDark);
    v.row(35, 3, 25, C.woodDark);
    if (r) {
      v.rect(6, 15, 14, 34, K); // the door is open
      v.rect(4, 15, 5, 34, dark(W));
      v.eye(8, 19, 2, 2, 0, 1, K, YEL);
      v.eye(11, 19, 2, 2, 0, 1, K, YEL);
      v.teeth(7, 13, 24, 1, TOOTH, 2);
      v.eye(18, 17, 2, 1, 0, 0, K, YEL);
      v.arm([[7, 28], [-1, 30], [-5, 38]], SK, 2, 'd', SK, 3);
      v.line(-6, 36, -6, 48, C.wood); // it has the garden fork
      v.pts([[-7, 49], [-6, 49], [-5, 49], [-7, 50], [-5, 50], [-7, 51], [-6, 50], [-6, 51], [-5, 51]], C.steel);
    } else {
      v.rect(6, 15, 14, 34, dark(W)); // the door
      v.col(10, 16, 34, vd(W));
      v.col(14, 15, 34, K); // ajar
      v.col(13, 15, 34, K);
      v.set(13, 20, YEL);
      v.rect(11, 25, 12, 26, C.brass); // padlock, hanging open
      v.rect(14, 27, 15, 27, SK);
      v.rect(14, 29, 15, 29, SK);
    }
  });

  /* ---------- the sunbather ---------- */
  mk('sunbather-leather', 'sunbather tanned to leather woman grown into her sun lounger crab walks sunglasses monster', (g, r) => {
    const SK = hex('#7a4a2e'),
      SW = hex('#3f5f86'),
      FR = C.white;
    if (r) {
      // she gets up the wrong way round, on the lounger's legs and her own
      for (const [x, k, f] of [[6, 2, 4], [13, 9, 12], [22, 26, 23], [30, 34, 32]]) g.limb([[x, 8], [k, 13], [f, 20]], x % 2 ? FR : SK, 2);
      g.worm([[6, 6], [18, 2], [31, 6]], 3, 2.6, SK); // arched
      g.rect(14, 1, 22, 5, SW);
      g.ball(0, 6, 8, 14, SK); // the head hangs upside down
      g.rect(1, 10, 7, 11, K);
      g.pts([[2, 10], [6, 10]], REDEYE);
      g.rect(2, 7, 6, 8, MOUTH);
      g.teeth(2, 6, 8, -1, TOOTH, 1, false);
      g.strands(0, 8, 14, 5, hex('#b5a47c'), 4, 0.5);
      g.pts([[4, 20], [12, 20], [23, 20], [32, 20]], FR);
    } else {
      g.line(2, 8, 10, 14, FR); // the lounger
      g.rect(10, 14, 36, 15, FR);
      g.col(12, 15, 20, FR);
      g.col(32, 15, 20, FR);
      g.line(4, 9, 8, 20, FR);
      g.worm([[5, 9], [11, 12], [24, 12], [35, 12]], 2.4, 1.6, SK);
      g.rect(12, 10, 20, 13, SW);
      g.ball(1, 3, 8, 10, SK);
      g.rect(2, 6, 7, 7, K); // sunglasses
      g.row(9, 3, 6, C.white); // the smile
      g.row(2, 2, 7, hex('#b5a47c'));
      g.rect(36, 10, 38, 12, SK); // feet
      g.worm([[14, 12], [18, 16], [19, 20]], 1.2, 1, SK); // an arm trails
      g.each(8, 13, 36, 14, (p) => (p === SK ? dark(SK) : null)); // where she ends and it begins, no one can say
    }
  });

  /* ---------- the child on the tricycle ---------- */
  mk('tricycle-balloon-child', 'child on a tricycle with a balloon for a head trike string face toddler thing', (g, r) => {
    const TR = hex('#9a3a34'),
      BA = hex('#c9a0a0');
    g.oval(1, 17, 7, 23, C.ironDark); // front wheel
    g.oval(3, 19, 5, 21, C.steel);
    g.oval(12, 19, 16, 23, C.ironDark);
    g.line(4, 20, 6, 12, TR);
    g.line(6, 16, 14, 18, TR);
    g.row(11, 3, 8, C.steel); // handlebars
    g.rect(8, 9, 12, 15, hex('#a8904e')); // a small body in a yellow coat
    g.rect(7, 15, 9, 17, C.navy);
    g.set(6, 18, C.black);
    if (r) {
      g.limb([[8, 10], [5, 6], [3, 3]], hex('#a8904e'), 1); // look, no hands
      g.limb([[12, 10], [15, 6], [17, 3]], hex('#a8904e'), 1);
      g.set(3, 2, PALE);
      g.set(17, 2, PALE);
      g.col(10, 2, 8, C.white);
      g.ball(4, -11, 16, 2, BA);
      g.rect(6, -4, 14, -1, MOUTH); // the face it has is not drawn on
      g.teeth(6, 14, -4, 1, TOOTH, 2);
      g.teeth(7, 14, -1, -1, TOOTH, 2, false);
      g.rect(6, -8, 7, -7, K);
      g.rect(12, -8, 13, -7, K);
      g.set(7, -8, C.white);
      g.set(13, -8, C.white);
    } else {
      g.limb([[8, 10], [6, 11]], hex('#a8904e'), 1);
      g.col(10, 4, 8, C.white); // the string
      g.ball(6, -5, 14, 4, BA);
      g.set(8, -2, K); // a face in felt-tip
      g.set(12, -2, K);
      g.pts([[8, 1], [9, 2], [10, 2], [11, 2], [12, 1]], K);
      g.set(8, -4, lite(BA));
    }
  });

  mk('newspaper-grubs', 'newspaper grubs rolled newspapers on the drive larvae paper maggots teeth vermin small', (g, r) => {
    const W = hex('#c9c6b8');
    const roll = (pts) => {
      const p = curve(pts, 5);
      g.tube(p, 1.6, 1.6, W);
      for (let i = 2; i < p.length - 1; i += 3) g.set(p[i][0], p[i][1], C.stone); // print
      const [x, y] = pts[0];
      g.set(x, y, r ? MOUTH : C.stoneDark);
      if (r) g.pts([[x, y - 1], [x - 1, y + 1], [x + 1, y + 1]], TOOTH);
    };
    if (r) {
      roll([[3, -3], [4, 3], [9, 6]]);
      roll([[14, 0], [12, 4], [16, 7]]);
      roll([[9, 9], [14, 10], [19, 9]]);
    } else {
      roll([[2, 5], [8, 4]]);
      roll([[11, 7], [18, 6]]);
      roll([[5, 9], [11, 10]]);
      g.col(6, 3, 6, C.red); // rubber bands
      g.col(15, 5, 8, C.red);
    }
  });

  /* ---------- the salesman ---------- */
  mk('salesman-teeth-case', 'door to door salesman with a case full of teeth suit hat smile sample case monster', (g, r) => {
    const SU = hex('#5a5a66');
    g.man({ skin: PALE, top: SU, legs: SU, shirt: C.white, tie: C.wine, arms: r ? { l: 'out', r: 'down' } : 'down', face: 'grin', eye: r ? REDEYE : K });
    g.rect(4, 1, 11, 3, SU); // his hat
    g.row(4, 2, 13, SU);
    g.row(3, 4, 11, C.black);
    if (r) {
      g.rect(-12, 10, -3, 16, hex('#6a4a2e')); // the case, open: his samples
      g.rect(-12, 17, -3, 23, hex('#6a4a2e'));
      g.rect(-11, 11, -4, 15, GUM);
      g.rect(-11, 18, -4, 22, GUM);
      g.teeth(-11, -4, 12, 1, TOOTH, 1, true);
      g.teeth(-11, -4, 14, 1, TOOTH, 1, false);
      g.teeth(-11, -4, 19, 1, TOOTH, 1, false);
      g.teeth(-11, -4, 21, -1, TOOTH, 1, true);
      g.rect(-4, 13, -3, 15, PALE);
    } else {
      g.rect(0, 22, 6, 27, hex('#6a4a2e')); // his case
      g.row(22, 0, 6, hex('#8a6a4a'));
      g.rect(2, 21, 4, 21, C.black);
      g.set(3, 24, C.brass);
      g.set(6, 25, TOOTH); // something has caught in the lid
    }
  });

  mk('hamster-ball', 'hamster ball pet in a plastic ball too many eyes legs through the air holes vermin small', (g, r) => {
    if (r) for (const [k, f] of [[-2, -3], [1, 0], [10, 11], [13, 14]]) g.limb([[5 + (k > 5 ? 1 : 0), 6], [k, 3], [f, 12]], K, 1); // legs through the air holes
    g.ball(0, 0, 11, 11, hex('#9ebcc2'), C.white, C.glass);
    g.ball(3, 4, 9, 10, hex('#5a4030')); // what is in it
    g.pts([[4, 6], [6, 5], [8, 6], [5, 8], [7, 8]], r ? YEL : K);
    g.line(1, 5, 5, 0, C.white);
    if (r) {
      g.line(6, 0, 7, 3, K); // cracked
      g.line(7, 3, 5, 4, K);
      g.rect(5, 9, 7, 10, MOUTH);
      g.pts([[5, 9], [7, 9]], TOOTH);
    }
    g.row(11, 3, 8, C.glass);
  });

  mk('sand-child', 'sand child sandcastle with a face sandbox figure of sand crumbling bucket spade small', (g, r) => {
    const S = hex('#b5a47c'),
      W = C.wood;
    if (r) {
      g.poly([[5, 12], [12, 12], [11, 2], [6, 2]], S); // it stands up, child-high
      g.ball(4, -7, 13, 3, S);
      g.rect(4, -8, 5, -7, S); // battlements for hair
      g.rect(8, -8, 9, -7, S);
      g.rect(12, -8, 13, -7, S);
      g.rect(6, -4, 7, -3, K);
      g.rect(10, -4, 11, -3, K);
      g.rect(7, -1, 10, 1, MOUTH);
      g.worm([[5, 4], [1, 7], [0, 11]], 1.4, 1, S);
      g.worm([[12, 4], [16, 7], [17, 11]], 1.4, 1, S);
      g.drips(0, 17, 9, S, 3, 3, 3);
    } else {
      g.rect(5, 6, 12, 12, S); // a castle someone made
      g.rect(5, 4, 6, 5, S);
      g.rect(8, 4, 9, 5, S);
      g.rect(11, 4, 12, 5, S);
      g.set(7, 8, K); // shells for eyes
      g.set(10, 8, K);
      g.row(10, 7, 10, dark(S));
      g.col(15, 6, 12, C.red); // a spade
      g.rect(14, 5, 16, 6, C.red);
    }
    g.speckle(0, -8, 17, 12, dark(S), 6, 2);
    g.ball(1, 11, 16, 14, S);
    g.rect(0, 13, 17, 15, W); // the sandbox
    g.row(13, 0, 17, lite(W));
  });

  /* ---------- the leaf pile ---------- */
  mk('leaf-pile-crawler', 'leaf pile crawler heap of autumn leaves twig arms rake something under it large long', (g, r) => {
    const cols = [hex('#8a4a2a'), hex('#a07e2c'), hex('#6a4630'), hex('#9a6a34')],
      R = rnd(9);
    const top = (x) => (r ? 14 - 26 * Math.exp(-(((x - 15) / 8) ** 2)) - 5 * Math.exp(-(((x - 30) / 9) ** 2)) : 14 - 9 * Math.exp(-(((x - 20) / 12) ** 2)));
    if (r) {
      g.arm([[12, -2], [3, -6], [-3, -14]], C.woodDark, 1, 'u', C.woodDark, 4); // twig arms
      g.arm([[19, -3], [28, -8], [34, -4]], C.woodDark, 1, 'r', C.woodDark, 4);
    }
    for (let x = 1; x <= 42; x++) {
      const y0 = Math.round(top(x) + R() * 2);
      for (let y = y0; y <= 15; y++) g.set(x, y, cols[Math.floor(R() * 4)]);
      g.set(x, y0, hex('#b08a3a'));
    }
    g.row(15, 1, 42, hex('#5a3a22'));
    if (r) {
      g.rect(11, -6, 19, -1, K); // the dark inside it
      g.eye(12, -5, 2, 2, 1, 1, K, YEL);
      g.eye(17, -5, 2, 2, 0, 1, K, YEL);
      g.teeth(12, 18, -1, -1, C.woodPale, 2);
      for (const [x, y] of [[2, -8], [26, -16], [36, 2], [-2, 3], [22, -18], [40, -6]]) g.rect(x, y, x + 1, y, cols[(x + 20) % 4]); // leaves in the air
    } else {
      g.rect(16, 8, 21, 9, K);
      g.set(17, 8, YEL);
      g.set(20, 8, YEL);
      g.line(34, 15, 44, -4, C.wood); // the rake, where it was left
      g.rect(32, 14, 37, 14, C.steel);
      g.pts([[32, 15], [34, 15], [36, 15]], C.steel);
      g.pts([[-1, 15], [45, 14]], cols[0]);
    }
  });

  /* ---------- the neighbourhood watch ---------- */
  mk('neighbourhood-watch', 'neighbourhood watch tall woman with a window for a head venetian blinds eyes pointing large', (g, r) => {
    const GO = hex('#8a8474'),
      SK = PALE;
    g.man({ head: false, skin: SK, top: GO, robe: GO, tl: 16, ll: 18, shoe: false, arms: r ? { l: 'none', r: 'down' } : 'down' });
    g.col(7, 13, 45, dark(GO));
    g.row(27, 5, 10, C.wine);
    g.rect(7, 9, 8, 12, SK);
    g.box(1, -3, 14, 9, C.white); // a window where the head should be
    g.rect(3, -1, 12, 7, K);
    if (r) {
      for (const [x, y] of [[4, 0], [9, 0], [6, 3], [10, 4], [4, 5]]) g.eye(x, y, 2, 2, 0, 1); // the blind goes up
      g.row(-1, 3, 12, hex('#c8bea3'));
      g.limb([[3, 13], [-6, 14], [-16, 12]], GO, 2); // and she points
      g.rect(-19, 11, -17, 13, SK);
      g.row(12, -24, -20, SK);
    } else {
      for (let y = -1; y <= 7; y += 2) g.row(y, 3, 12, hex('#c8bea3')); // venetian blinds
      g.rect(6, 4, 9, 4, K); // two slats held apart
      g.set(7, 4, C.white);
      g.col(13, 0, 6, C.stone);
      g.pts([[5, 5], [10, 5]], SK); // by fingers that are not hers
    }
    g.pts([[5, 46], [10, 46]], hex('#6a3a40'));
  });

  /* ---------- the dog walker ---------- */
  mk('dog-walker-leashes', 'dog walker whose arms are leashes small dogs with her face tracksuit leads monster', (g, r) => {
    const TS = hex('#7a5a70'),
      F = C.white,
      g2 = g.at(8, 0);
    g2.man({ skin: TAN, top: TS, legs: TS, shoe: C.white, arms: 'none', face: r ? 'hollow' : 'smile', hair: ['bob', hex('#a08a4a')] });
    const dog = (x, d, up) => {
      const v = d > 0 ? g.at(x, 0) : g.flip(0).at(-x, 0),
        y = up ? 19 : 25;
      if (up) v.poly([[0, 31], [3, 31], [6, 24], [3, 23]], F);
      else v.rect(0, 27, 6, 30, F);
      v.rect(0, 31, 1, 31, dark(F));
      v.rect(5, 31, 6, 31, dark(F));
      v.rect(4, y, 9, y + 5, F); // fluffy
      v.pts([[4, y - 1], [9, y - 1]], F);
      v.rect(5, y + 1, 8, y + 4, TAN); // with her face
      v.set(6, y + 2, K);
      v.set(8, y + 2, K);
      if (up) v.rect(6, y + 3, 8, y + 4, MOUTH);
      else v.row(y + 4, 6, 7, C.white);
      v.set(-1, up ? 30 : 27, F);
      return [x + d * 5, y];
    };
    const a = dog(27, 1, r),
      b = dog(5, -1, r);
    // her sleeves go on and on, and end in collars
    g.limb(curve([[19, 13], [24, 18], [a[0], a[1] + 6]], 5), TS, 2);
    g.limb(curve([[12, 13], [6, 18], [b[0], b[1] + 6]], 5), TS, 2);
    g.row(a[1] + 6, a[0] - 1, a[0] + 2, C.red);
    g.row(b[1] + 6, b[0] - 2, b[0] + 1, C.red);
  });
};
