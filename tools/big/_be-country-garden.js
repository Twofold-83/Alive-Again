/* The garden creatures of be-country.js: the garden gone wrong. draw(g, r): r is 1 when roused. */
module.exports = (k, be) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, P, vd, fig, face, arm, legs, spiderLegs, ribs, curve } = k;
  const LEAF = C.leaf,
    LEAFL = C.leafLight,
    STEM = hex('#4f6b3c'),
    ROSE = hex('#8a3040'),
    STONE = C.stone,
    SACK = hex('#a08a5c'),
    SOIL = C.earth;
  const rose = (g, x, y) => {
    g.rect(x, y, x + 2, y + 2, ROSE);
    g.set(x + 1, y + 1, vd(ROSE));
    g.set(x, y, lite(ROSE));
  };

  /* ================= the large ones: tall ================= */
  be('garden-maneater-plant', 'man eating plant large tall flytrap carnivorous pod jaws teeth vines monster', (g, r) => {
    const POD = hex('#6a7a3a'),
      IN = hex('#8a3a44');
    g.oval(4, 42, 22, 46, SOIL);
    for (const v of [g, g.flip(26)]) {
      v.poly([[13, 43], [2, 35], [0, 38], [8, 44]], LEAF); // the leaves at its foot
      v.line(12, 42, 2, 36, LEAFL);
    }
    g.limb([[13, 43], [10, 34], [15, 26], r ? [14, 20] : [16, 20]], 2.4, 1.9, STEM, LEAF);
    g.pts([[9, 36], [16, 30], [12, 27], [15, 38]], P.TOOTH); // thorns
    if (r) {
      g.limb([[11, 36], [2, 28], [-4, 18], [-2, 11]], 1.2, 0.6, STEM, LEAF); // the vines lash
      g.limb([[15, 30], [24, 24], [31, 15], [29, 9]], 1.2, 0.6, STEM, LEAF);
      g.oval(5, -2, 25, 20, IN); // open
      g.ball(4, -9, 26, 5, POD);
      g.ball(6, 13, 24, 24, POD);
      g.rect(7, 4, 23, 13, IN);
      g.teeth(5, 7, 23, P.TOOTH, 3, 3, 1);
      g.teeth(13, 8, 23, P.TOOTH, 3, 3, -1);
      g.limb([[15, 13], [13, 9], [17, 7]], 1.5, 1, P.RAW);
      g.rect(23, 8, 26, 13, C.black); // a boot it has not finished
      g.rect(23, 13, 28, 14, C.black);
      g.row(8, 23, 26, C.earth);
      g.pts([[8, -5], [12, -7], [18, -6], [22, -3], [10, 20], [16, 21], [21, 19]], dark(POD));
    } else {
      g.limb([[11, 38], [5, 33], [4, 27], [6, 25]], 1.1, 0.5, STEM, LEAF);
      g.limb([[15, 31], [21, 28], [23, 23]], 1.1, 0.5, STEM, LEAF);
      g.ball(7, 4, 25, 20, POD); // the pod, shut
      g.path([[8, 13], [13, 15], [19, 14], [25, 11]], vd(POD));
      g.pts([[10, 14], [13, 16], [16, 15], [19, 15], [22, 13]], P.TOOTH); // not quite shut
      g.pts([[10, 7], [14, 6], [19, 7], [22, 9], [12, 18], [18, 18]], dark(POD));
      g.path([[16, 5], [15, 11]], dark(POD));
    }
  });

  be('garden-scarecrow-climbed', 'scarecrow climbed down large tall straw sack head pole walking stitched monster', (g, r) => {
    const COAT = hex('#4e4638'),
      TR = hex('#3e4450'),
      HAT = hex('#2c2830'),
      PO = C.woodPale;
    g.rect(8, 28, 9, 45, PO); // the pole it still walks on
    g.rect(5, 28, 7, 40, TR);
    g.rect(10, 28, 13, 41, dark(TR));
    g.hem(40, 5, 7, 2, 1);
    g.hem(41, 10, 13, 2, 2);
    g.pts([[5, 41], [6, 42], [11, 42], [12, 43], [13, 42]], C.straw);
    g.poly([[5, 14], [14, 14], [15, 30], [4, 30]], COAT);
    g.lit(4, 14, 8, 30);
    g.rect(11, 20, 13, 23, hex('#6a5a3e')); // a patch
    g.pts([[9, 17], [9, 21], [9, 25]], C.bone);
    g.pts([[7, 30], [9, 31], [12, 30], [14, 31]], C.straw);
    if (r) {
      g.row(15, 1, 4, PO); // the cross pole snapped
      g.row(15, 15, 17, PO);
      for (const v of [g, g.flip(19)]) {
        v.tube([[4, 16], [-1, 20], [-4, 27]], 1.5, 1.3, COAT);
        v.claws(-4, 28, 0, 1, C.straw, 4, 5);
        v.claws(-5, 28, -1, 1, dark(C.straw), 2, 3);
      }
    } else {
      g.row(15, -5, 24, PO);
      g.rect(-2, 14, 5, 17, COAT);
      g.rect(14, 14, 21, 17, dark(COAT));
      g.claws(-3, 16, -1, 0, C.straw, 3, 3);
      g.claws(22, 16, 1, 0, C.straw, 3, 3);
    }
    g.ball(5, 2, 14, 13, SACK); // the sack head
    g.row(13, 7, 12, C.rust);
    g.pts([[6, 14], [9, 14], [13, 14]], C.straw);
    g.row(3, 1, 18, HAT);
    g.rect(6, -1, 13, 2, HAT);
    g.row(2, 6, 13, C.rust);
    if (r) {
      g.pts([[7, 6], [12, 6]], P.YEL);
      g.maw(7, 8, 12, 12, { teeth: C.straw, len: 2 });
    } else {
      g.rect(7, 6, 8, 7, K);
      g.set(12, 6, K);
      g.row(10, 7, 12, vd(SACK)); // a stitched mouth
      g.pts([[8, 9], [10, 9], [12, 9], [8, 11], [10, 11], [12, 11]], vd(SACK));
    }
  });

  be('garden-sunflower-watcher', 'sunflower watcher large tall flower eye stalk petals teeth staring plant', (g, r) => {
    const PET = r ? hex('#c9a43a') : hex('#8f7a34'),
      DISC = hex('#4a3626');
    if (r) {
      g.path([[9, 43], [5, 45], [2, 44]], C.woodDark); // it has pulled its roots up
      g.path([[9, 43], [12, 45], [16, 45]], C.woodDark);
      g.path([[9, 43], [8, 45]], C.wood);
    } else g.oval(4, 43, 14, 45, SOIL);
    g.limb([[9, 44], [8, 34], [10, 24], [9, r ? 12 : 16]], 1.4, 1.2, STEM, LEAF);
    if (r) {
      for (const v of [g, g.flip(18)]) {
        v.limb([[9, 30], [3, 28], [-1, 22]], 1.2, 1, STEM, LEAF); // leaves like hands
        v.poly([[-3, 22], [1, 22], [0, 17], [-2, 17]], LEAFL);
        v.claws(-1, 16, 0, -1, LEAFL, 3, 3);
      }
    } else {
      g.poly([[8, 32], [1, 28], [0, 31], [6, 35]], LEAF);
      g.line(7, 33, 1, 29, LEAFL);
      g.poly([[10, 27], [17, 23], [18, 26], [12, 30]], LEAF);
      g.line(11, 28, 17, 24, LEAFL);
    }
    const cx = 9,
      cy = r ? 7 : 12,
      R = r ? 10 : 7;
    for (let a = 0; a < 16; a++) {
      const t = (a / 16) * Math.PI * 2 + 0.2;
      g.line(cx + Math.cos(t) * 3, cy + Math.sin(t) * 3, cx + Math.cos(t) * R, cy + Math.sin(t) * R * (r ? 1 : 0.8), a % 2 ? PET : dark(PET));
    }
    if (r) {
      g.ball(3, 1, 15, 13, DISC);
      g.oval(4, 3, 14, 11, P.EYE); // one eye
      g.oval(7, 4, 11, 10, hex('#7a8a3a'));
      g.rect(9, 5, 9, 9, K);
      g.pts([[5, 6], [13, 8], [6, 9]], P.RED);
      g.set(8, 5, C.white);
    } else {
      g.ball(5, 8, 13, 16, DISC);
      g.speckle(5, 8, 13, 16, hex('#6a5236'), 3, 2);
      g.row(12, 6, 12, vd(DISC)); // shut
      g.pts([[6, 13], [9, 14], [12, 13]], K);
    }
  });

  be('garden-rose-gardener', 'rose gardener large tall grown into roses briars thorns man bush shears overgrown', (g, r) => {
    const SK = hex('#a9a488'),
      BR = hex('#3e5236');
    const v = g.at(5, 13);
    g.ball(-1, 30, 26, 46, LEAF); // the bush he stands in
    fig(v, { skin: SK, top: hex('#6a6a4a'), legs: hex('#4a4034'), apron: hex('#55603e'), arms: r ? ['claw', 'wide'] : ['down', 'hold'], eye: r ? C.white : K });
    v.row(3, 2, 13, C.straw); // his straw hat
    v.rect(5, 0, 10, 2, C.straw);
    v.row(2, 5, 10, dark(C.straw));
    g.ball(0, 36, 12, 46, LEAF);
    g.ball(11, 34, 25, 46, LEAF);
    g.leaves(-1, 30, 26, 46, LEAF, 3, 3);
    // the briars have gone through him
    g.limb([[2, 44], [6, 34], [12, 28], [18, 20], [22, 8], [18, 1]], 1.3, 0.8, BR, vd(BR));
    g.limb([[22, 44], [17, 36], [10, 30], [4, 20], [3, 9], [8, 3]], 1.3, 0.8, BR, vd(BR));
    g.limb([[14, 44], [13, 30], [13, 24]], 1, 0.8, BR, vd(BR));
    g.pts([[5, 31], [15, 25], [20, 13], [3, 15], [7, 26], [21, 4], [16, 38], [9, 37]], P.TOOTH); // thorns
    for (const [x, y] of [[17, 0], [7, 1], [1, 22], [20, 26], [5, 38], [18, 40]]) rose(g, x, y);
    for (const [x, y] of [[20, 9], [2, 11], [15, 33], [23, 18], [0, 30]]) g.rect(x, y, x + 1, y + 1, LEAFL);
    if (r) {
      v.maw(6, 8, 9, 10, { teeth: false });
      g.limb([[13, 23], [15, 26], [21, 27], [27, 23]], 1.2, 0.7, BR, vd(BR)); // a stem out of his mouth
      rose(g, 26, 20);
      g.limb([[4, 20], [-4, 16], [-8, 20]], 1, 0.6, BR, vd(BR));
      g.pts([[-3, 16], [-6, 17], [23, 26]], P.TOOTH);
      g.path([[-1, 13], [-4, 6]], C.steel); // the shears, open
      g.path([[-1, 13], [2, 6]], C.steel);
      g.set(-1, 14, C.rust);
    } else {
      rose(g, 10, 20); // one grows where his eye was
      g.path([[14, 31], [14, 37]], C.steel);
      g.path([[15, 31], [16, 37]], dark(C.steel));
    }
  });

  /* ================= the large ones: long ================= */
  be('garden-slug-bench', 'slug large long giant bench sized slime teeth underside eye stalks wet monster', (g, r) => {
    const B = hex('#6a5a48'),
      U = hex('#a39478'),
      M = hex('#55473a');
    g.row(17, -2, 6, C.glassLight); // the slime it leaves
    g.pts([[-4, 17], [8, 17]], C.glassLight);
    g.tube([[3, 14], [12, 12], [22, 11]], 1.5, 5, B);
    if (r) {
      g.tube([[22, 11], [30, 11], [36, 5], [37, -5]], 5, 4, B); // it rears, and shows what is under it
      g.tube([[31, 14], [37, 8], [39, -3]], 1.6, 1.4, U, dark(U));
      for (let i = 0; i < 6; i++) g.pts([[36 + (i > 2 ? 2 : i), 10 - i * 2.4], [37 + (i > 2 ? 2 : i), 9 - i * 2.4]], i % 2 ? P.TOOTH : P.MAW);
      g.rect(38, -2, 39, 6, P.MAW);
      g.teeth(-2, 38, 39, P.TOOTH, 1, 9, 1);
      for (let y = -1; y <= 6; y += 2) g.row(y, 38, 39, P.MAW);
      g.path([[35, -8], [33, -13], [32, -16]], B);
      g.path([[38, -9], [40, -14], [42, -16]], B);
      g.eye(31, -18, 2, P.YEL);
      g.eye(42, -18, 2, P.YEL);
    } else {
      g.tube([[22, 11], [32, 11], [40, 12]], 5, 3.6, B);
      g.path([[41, 9], [43, 5], [44, 3]], B); // the eye stalks
      g.path([[43, 10], [46, 7], [47, 6]], B);
      g.pts([[44, 2], [47, 5]], P.EYE);
      g.pts([[44, 13], [45, 15]], dark(B));
    }
    g.row(16, 5, r ? 30 : 42, U); // the foot
    g.row(17, 7, r ? 29 : 41, dark(U));
    g.ball(13, 5, 27, 12, M, B, vd(M)); // the mantle
    g.set(23, 9, K);
    g.speckle(3, 6, 34, 15, dark(B), 8, 5);
    g.pts([[16, 7], [20, 6]], lite(B));
  });

  be('garden-vine-strangler', 'vine strangler large long greenhouse creeper coils wrapped body boots thorns plant monster', (g, r) => {
    const V = hex('#4a6238'),
      VD = hex('#2e4028');
    g.rect(0, 19, 3, 24, C.black); // somebody's boots
    g.rect(-2, 22, 0, 24, C.black);
    g.rect(1, 13, 4, 18, dark(C.black));
    g.limb([[4, 21], [12, 22], [22, 22], [34, 22], [42, 21]], 3.2, 2.6, hex('#6a6a5c'), hex('#4a4a40')); // the gardener, wound round
    g.limb([[2, 24], [10, 13], [20, 21], [30, 12], [40, 21], [47, 24]], 2.4, 1.6, V, VD);
    g.limb([[6, 24], [16, 16], [25, 24], [35, 17], [44, 24]], 2, 1.4, hex('#587242'), VD);
    for (const [x, y] of [[9, 12], [19, 17], [29, 10], [37, 15], [14, 21], [44, 19]]) {
      g.rect(x, y, x + 2, y + 1, LEAFL);
      g.set(x + 3, y, LEAF);
    }
    g.rect(44, 22, 47, 23, P.PALE); // a hand
    g.claws(48, 23, 1, 0, P.PALE, 3, 2);
    if (r) {
      g.limb([[12, 16], [8, 4], [14, -6], [10, -13]], 1.8, 0.8, V, VD); // the runners come up
      g.limb([[38, 16], [45, 6], [40, -4], [44, -10]], 1.8, 0.8, V, VD);
      g.limb([[26, 14], [30, 2], [24, -8], [26, -14]], 2.2, 1.6, V, VD);
      g.pts([[9, -14], [11, -15], [45, -11], [43, -12], [7, 5], [46, 5], [31, 3]], P.TOOTH); // hooks
      g.ball(21, -22, 31, -12, ROSE); // the flower it feeds with
      g.maw(23, -19, 29, -14, { round: 1, len: 2 });
      g.pts([[20, -17], [32, -17], [26, -23]], lite(ROSE));
      g.pts([[16, 0], [36, -2]], LEAFL);
    } else {
      g.limb([[30, 12], [32, 6], [29, 3]], 1, 0.5, V, VD);
      g.limb([[10, 13], [8, 8], [11, 6]], 1, 0.5, V, VD);
      g.ball(27, 0, 31, 4, dark(ROSE)); // a bud
      g.pts([[19, 20], [39, 18], [5, 20]], P.TOOTH);
    }
  });

  be('garden-pond-thing', 'pond thing large long water lily pad eyes weed mouth mud arms lurking monster', (g, r) => {
    const WA = C.water,
      WEED = hex('#3e5040'),
      PAD = hex('#56743e');
    g.path([[4, 11], [3, 2], [2, -2]], LEAFL); // reeds
    g.path([[6, 11], [7, 1]], LEAF);
    g.rect(6, 0, 7, 3, C.woodDark);
    g.oval(1, 10, 44, 19, WA);
    g.row(12, 8, 20, lite(WA));
    g.row(17, 22, 36, lite(WA));
    g.row(15, 5, 11, lite(WA));
    const ey = r ? 0 : 9;
    if (r) {
      for (const v of [g, g.flip(45)]) {
        v.limb([[5, 13], [-2, 7], [-6, 13]], 1.8, 1.2, WEED, vd(WEED)); // arms of weed
        v.claws(-6, 14, 0, 1, hex('#6a8a5a'), 3, 4);
      }
      g.ball(6, -2, 39, 16, WEED, hex('#56705a'), vd(WEED)); // the bottom of the pond gets up
      g.maw(10, 8, 35, 14, { round: 1, len: 2, step: 3 });
      g.pts([[8, 2], [20, -1], [24, 3], [37, 5], [14, 6], [31, 6]], hex('#56705a'));
      for (const x of [9, 22, 36, 41]) g.col(x, 14, 17 + (x % 3), C.glassLight); // it drips
    }
    for (const x of [10, 27]) {
      g.oval(x, ey, x + 8, ey + 4, PAD); // two lily pads, side by side
      g.row(ey, x + 2, x + 6, lite(PAD));
      if (r) {
        g.oval(x + 1, ey + 1, x + 7, ey + 3, P.YEL);
        g.col(x + 4, ey + 1, ey + 3, K);
      } else {
        g.row(ey + 2, x + 2, x + 6, vd(PAD));
        g.set(x + 4, ey + 2, P.YEL);
      }
    }
    if (!r) {
      g.rect(38, 12, 39, 13, hex('#c9b0b4')); // a bud
      g.oval(34, 13, 40, 15, PAD);
    }
  });

  be('garden-topiary-beast', 'topiary beast large long hedge clipped box hound lion twig teeth leaves monster', (g, r) => {
    const H = hex('#35553a');
    for (const x of [10, 17, 28, 34]) {
      g.rect(x, 20, x + 4, 30, x % 2 ? dark(H) : H);
      g.rect(x + 1, 29, x + 3, 31, C.woodDark); // the trunks it grew from
    }
    g.limb([[9, 12], [4, 8], [3, 2], [6, 0]], 2.2, 1.6, H, dark(H)); // the tail
    g.ball(7, 7, 37, 23, H);
    g.ball(29, r ? -3 : 0, 43, 13, H);
    g.poly([[31, r ? -2 : 1], [32, r ? -7 : -3], [35, r ? -2 : 1]], H); // clipped ears
    g.poly([[38, r ? -2 : 1], [40, r ? -7 : -3], [42, r ? -1 : 2]], H);
    if (r) {
      g.rect(39, 1, 47, 4, H); // the muzzle opens on twigs
      g.rect(39, 9, 46, 11, dark(H));
      g.rect(39, 5, 46, 8, P.MAW);
      g.teeth(5, 40, 46, C.woodPale, 2, 2, 1);
      g.teeth(8, 41, 46, C.woodPale, 2, 2, -1);
      g.rect(36, 0, 37, 1, P.RED);
      for (const x of [10, 14, 19, 23, 27, 31]) g.line(x, 7 - (x % 3), x + ((x % 4) - 1), 1 - (x % 5), x % 2 ? LEAFL : H); // unclipped shoots
      g.path([[42, 25], [45, 28], [47, 31]], C.woodPale); // twig claws
      g.path([[42, 26], [44, 30]], C.woodPale);
    } else {
      g.rect(39, 6, 46, 11, H);
      g.row(9, 41, 46, vd(H));
      g.rect(36, 3, 37, 4, vd(H));
    }
    g.leaves(3, -7, 47, 30, H, 2, 3);
    if (r) g.rect(36, 0, 37, 1, P.RED);
    g.lit(7, 7, 20, 23);
  });

  /* ================= dog- to person-sized ================= */
  be('garden-beehive-man', 'beehive man skep head bees swarm honey straw hive beekeeper monster', (g, r) => {
    const SK = hex('#b39a6a');
    fig(g, { head: false, top: hex('#5a5648'), legs: hex('#3e3a34'), skin: SK, arms: r ? ['claw', 'reach'] : ['down', 'down'] });
    g.ball(1, -2, 14, 14, C.straw); // a skep where his head should be
    for (let y = 1; y <= 13; y += 3) g.row(y, 2, 13, dark(C.straw));
    g.rect(7, -3, 8, -2, dark(C.straw));
    if (r) {
      g.maw(5, 7, 10, 12, { round: 1, teeth: false });
      g.pts([[5, 13], [6, 14], [6, 15], [9, 13], [9, 14], [9, 16], [9, 17]], C.gold); // honey
      g.pts([[-3, 2], [-5, 6], [18, 0], [20, 5], [16, -4], [-1, -5], [22, 10], [-6, 11], [12, 6], [3, 9], [17, 14], [-2, 16]], K); // the swarm
      g.pts([[-2, 2], [-4, 6], [19, 0], [21, 5], [17, -4], [0, -5], [23, 10], [-5, 11]], P.YEL);
    } else {
      g.rect(6, 9, 9, 11, P.MAW);
      g.set(8, 12, C.gold);
      g.pts([[4, 5], [11, 8], [15, 2]], K);
      g.pts([[5, 5], [16, 2]], P.YEL);
    }
  });

  be('garden-crow-parliament', 'crow parliament one figure made of crows birds black feathers beaks eyes flock man', (g, r) => {
    const F = hex('#24222c'),
      F2 = hex('#3a3846'),
      BK = hex('#8a7a4a');
    g.pts([[5, 32], [7, 33], [9, 32], [11, 33]], BK); // feet
    g.col(6, 29, 32, BK);
    g.col(10, 29, 32, BK);
    if (r) {
      for (const v of [g, g.flip(16)]) {
        v.poly([[5, 11], [-8, 4], [-11, 9], [-7, 12], [-9, 17], [-3, 16], [3, 22]], F); // wings of birds
        v.path([[4, 12], [-8, 5]], F2);
        v.path([[2, 15], [-7, 12]], F2);
        v.pat(-14, 0, ['.ff..', 'fffb.', '.ff..'], { f: F, b: BK }); // some break away
      }
    }
    g.poly([[5, 10], [11, 10], [14, 30], [2, 30]], F); // a tall coat of them
    g.hem(30, 2, 14, 3, 6);
    for (const [x, y] of [[4, 14], [9, 13], [6, 19], [11, 20], [4, 24], [9, 26]]) {
      g.path([[x, y], [x + 2, y + 1], [x + 3, y + 3]], F2); // each a folded wing
      g.set(x + 3, y, r ? P.EYE : hex('#7a7884'));
      if (r) g.pts([[x + 4, y + 1], [x + 5, y + 1]], BK);
    }
    g.ball(4, 2, 11, 10, F, F2); // and one for a head
    g.path([[11, 6], [14, 7], [16, 7]], BK);
    if (r) g.path([[11, 8], [14, 9], [15, 10]], BK);
    g.set(9, 5, r ? P.EYE : hex('#9a98a4'));
    g.pts([[5, 1], [7, 0], [3, 3]], F);
  });

  be('garden-sundial-shade', 'sundial shade shadow figure stone dial thin dark long fingers standing', (g, r) => {
    const SH = hex('#221d2c'),
      SH2 = hex('#3a3248');
    if (r) {
      g.poly([[12, 2], [17, 2], [19, 31], [11, 31]], SH); // the shadow has stepped out
      g.ball(11, -9, 18, 1, SH, SH2, SH);
      g.pts([[13, -6], [16, -6]], C.white);
      g.row(-3, 13, 16, C.white);
      g.path([[12, 4], [4, 8], [-2, 13]], SH);
      g.path([[12, 5], [4, 9], [-1, 13]], SH2);
      g.claws(-3, 14, -1, 1, SH, 3, 4);
      g.path([[17, 4], [23, 9], [24, 18]], SH);
      g.claws(24, 19, 0, 1, SH, 3, 4);
    } else {
      g.poly([[11, 6], [15, 6], [16, 31], [10, 31]], SH); // behind the dial: its shadow, standing
      g.ball(10, -2, 16, 6, SH, SH2, SH);
      g.set(14, 2, C.white);
      g.path([[11, 11], [9, 13]], SH);
      g.pts([[8, 14], [9, 15], [10, 14]], SH2);
    }
    g.rect(1, 28, 10, 31, STONE); // the sundial
    g.rect(3, 15, 8, 28, STONE);
    g.col(3, 15, 28, lite(STONE));
    g.col(8, 15, 28, dark(STONE));
    g.rect(0, 12, 11, 14, C.stoneLight);
    g.row(14, 0, 11, dark(STONE));
    g.poly([[4, 11], [8, 11], [8, 7]], C.brass);
    g.pts([[4, 20], [6, 24], [2, 29], [7, 17]], C.moss);
  });

  be('garden-moss-statue', 'moss statue stone lady garden figure cracked face hollow weeping walks', (g, r) => {
    const S = STONE,
      SL = C.stoneLight;
    g.rect(1, 34, 14, 37, dark(S)); // the plinth
    g.row(34, 1, 14, S);
    g.poly([[5, 12], [10, 12], [13, 33], [2, 33]], S); // robes
    for (const x of [5, 8, 11]) g.line(x, 18, x + (x - 8) / 2, 33, dark(S));
    g.lit(2, 12, 6, 33);
    if (r) {
      g.rect(-1, 34, 2, 36, S); // a foot off the plinth
      g.ball(4, 1, 11, 10, S, SL);
      g.maw(5, 3, 10, 9, { round: 1, teeth: false }); // the face has fallen in
      g.pts([[6, 5], [9, 6], [7, 8]], hex('#b99a8c')); // and something lives there
      g.pts([[7, 4], [9, 4]], P.EYE);
      for (const v of [g, g.flip(15)]) arm(v, [[4, 14], [-2, 15], [-6, 11]], S, SL, null, 1.4);
      g.path([[8, 12], [6, 17], [8, 22], [7, 27]], vd(S)); // cracks
      g.path([[11, 20], [9, 24]], vd(S));
    } else {
      g.ball(4, 2, 11, 11, S, SL); // head bowed
      g.rect(4, 2, 11, 5, dark(S));
      g.pts([[6, 7], [9, 7]], dark(S));
      g.row(9, 7, 8, dark(S));
      g.rect(3, 13, 4, 20, S);
      g.rect(11, 13, 12, 20, dark(S));
      g.rect(5, 19, 10, 21, SL); // hands folded
      g.row(21, 5, 10, dark(S));
    }
    g.speckle(1, 1, 14, 37, C.moss, 6, 4);
    g.pts([[3, 30], [4, 31], [12, 26], [10, 15], [2, 35], [3, 36]], C.leafLight);
  });

  be('garden-hedge-face', 'hedge face neighbour hedge with a face twig teeth branch arms leaves green', (g, r) => {
    const H = hex('#35553a');
    if (r) {
      for (const v of [g, g.flip(25)]) {
        v.path([[2, 10], [-4, 6], [-7, 9]], C.woodDark); // branch arms
        v.path([[2, 11], [-4, 7], [-8, 3]], C.wood);
        v.claws(-8, 2, 0, -1, C.wood, 3, 3);
        v.pts([[-3, 5], [-6, 8]], LEAFL);
      }
    }
    g.rect(1, 3, 24, 20, H);
    g.rect(2, 2, 23, 2, H);
    g.rect(4, 19, 5, 22, C.woodDark);
    g.rect(12, 20, 13, 22, C.woodDark);
    g.rect(20, 19, 21, 22, C.woodDark);
    g.leaves(1, 2, 24, 20, H, 5, 3);
    g.lit(1, 2, 5, 20);
    if (r) {
      g.oval(5, 5, 10, 9, P.MAW);
      g.oval(15, 5, 20, 9, P.MAW);
      g.pts([[8, 7], [17, 7]], P.YEL);
      g.maw(5, 12, 20, 18, { round: 1, teeth: C.woodPale, len: 2 });
      g.pts([[11, 1], [14, 0], [8, 1], [19, 1]], LEAFL);
    } else {
      g.oval(6, 6, 9, 8, vd(H)); // hollows where the birds will not nest
      g.oval(16, 6, 19, 8, vd(H));
      g.row(14, 8, 17, vd(H));
      g.pts([[7, 13], [18, 13]], vd(H));
    }
  });

  be('garden-compost-thing', 'compost thing heap rot muck eye arm fork flies rotting pile monster', (g, r) => {
    const M = hex('#4e4030'),
      M2 = hex('#665440'),
      up = r ? -6 : 0;
    g.ball(0, 6, 23, 18, M, M2, vd(M));
    g.rect(0, 14, 23, 16, M);
    g.ball(5, 1 + up, 18, 12, M, M2, vd(M)); // the top of the heap
    g.speckle(0, up, 23, 16, C.moss, 7, 2);
    g.pts([[4, 10], [15, 13], [20, 11]], C.bone); // eggshell
    g.pts([[8, 14], [9, 15], [17, 9]], hex('#7a8a4a')); // cabbage
    g.pts([[3, 2], [20, 3], [12, -3 + up]], K); // flies
    if (r) {
      g.eye(7, -2, 3, P.EYE);
      g.eye(13, -3, 2, P.EYE);
      g.maw(7, 3, 16, 8, { round: 1, teeth: C.bone, step: 3 });
      g.limb([[19, 8], [25, 2], [26, -6]], 2, 1.5, M, vd(M)); // an arm of muck, and the fork
      g.col(27, -16, -6, C.woodPale);
      g.row(-16, 25, 29, C.steel);
      for (const x of [25, 27, 29]) g.col(x, -20, -16, C.steel);
      g.pts([[23, 6], [24, 10], [-2, 4], [28, -2]], K);
    } else {
      g.eye(8, 4, 2, P.EYE);
      g.row(8, 9, 14, vd(M));
      g.pts([[19, 12], [20, 13], [21, 12], [22, 13]], M2); // fingers
    }
    g.row(17, 1, 22, vd(M));
  });

  be('garden-birdbath-drinker', 'birdbath drinker pale thing crouched in stone bowl long limbs tongue frog', (g, r) => {
    const SK = hex('#b8b89a'),
      S = STONE;
    g.rect(4, 22, 11, 24, dark(S));
    g.rect(6, 12, 9, 22, S);
    g.col(6, 12, 22, lite(S));
    g.poly([[0, 8], [15, 8], [12, 12], [3, 12]], S); // the bowl
    g.row(8, 0, 15, C.stoneLight);
    g.speckle(0, 8, 15, 24, C.moss, 6, 2);
    if (r) {
      g.ball(4, -1, 11, 8, SK); // it sits up in the bowl
      g.tube([[8, 0], [8, -4]], 1.4, 1.2, SK);
      g.ball(4, -12, 12, -4, SK);
      g.pts([[5, -10], [11, -10]], K);
      g.maw(5, -8, 11, -5, { len: 1 });
      g.limb([[8, -5], [7, 0], [9, 5], [8, 12]], 1, 0.6, P.RAW); // the tongue goes down to the ground
      for (const v of [g, g.flip(15)]) {
        v.leg([[4, 1], [-3, -3], [-5, 6]], SK, 1);
        v.claws(-5, 7, 0, 1, SK, 3, 3);
      }
    } else {
      g.ball(4, 2, 11, 9, SK); // a back, and knees
      g.pts([[7, 3], [7, 5], [8, 4], [8, 6]], dark(SK)); // the spine
      g.rect(1, 3, 3, 8, SK);
      g.rect(12, 3, 14, 8, dark(SK));
      g.pts([[1, 9], [2, 10], [3, 9], [12, 9], [13, 10], [14, 9]], SK); // fingers over the rim
      g.pat(11, 24, ['.bb', 'bbk'], { b: hex('#6a5a48'), k: K });
    }
  });

  be('garden-toadstool-walker', 'toadstool walker mushrooms fungus cluster legs gills teeth spores red caps', (g, r) => {
    const CAP = hex('#8a3a30'),
      STK = hex('#cfc4a8');
    const caps = [[1, 6, 9, 8], [7, 0, 16, 12], [13, 8, 19, 6]];
    if (r) {
      for (const x of [4, 8, 12, 16]) g.path([[x, 14], [x + (x < 10 ? -2 : 2), 16], [x + (x < 10 ? -1 : 1), 18]], dark(STK)); // root legs
    }
    for (const [x0, y0, x1, sh] of caps) {
      const y = y0 - (r ? 3 : 0),
        cx = (x0 + x1) >> 1;
      g.rect(cx - 1, y + 3, cx + 1, r ? 14 : 17, STK);
      g.col(cx + 1, y + 3, r ? 14 : 17, dark(STK));
      g.ball(x0, y, x1, y + 5, CAP);
      g.row(y + 5, x0, x1, vd(CAP));
      g.clearRect(x0, y + 6, x1, y + 6);
      g.pts([[x0 + 2, y + 1], [cx + 1, y + 2], [x1 - 2, y + 1]], STK);
      if (r) {
        g.maw(x0 + 1, y + 4, x1 - 1, y + 6, { teeth: STK, len: 1, bot: false }); // gills that bite
        g.pts([[cx - 1, y + 8], [cx + 1, y + 8]], K);
        g.row(y + 10, cx - 1, cx + 1, vd(STK));
      } else for (let x = x0 + 1; x < x1; x += 2) g.set(x, y + 5, STK);
    }
    if (r) g.pts([[0, -2], [5, -6], [18, -3], [20, 2], [12, -8], [-2, 4]], hex('#b9b08a')); // spores
    g.ball(3, r ? 12 : 15, 17, r ? 16 : 18, STK, lite(STK), dark(STK));
  });

  be('garden-pumpkin-crawler', 'pumpkin crawler rotten gourd vine legs split mouth seeds teeth spider', (g, r) => {
    const PU = hex('#b0682c'),
      PD = hex('#7c4420'),
      up = r ? -5 : 0;
    if (r) {
      for (let i = 0; i < 3; i++)
        for (const s of [-1, 1]) g.path([[10 + s * 6, 8 + up], [10 + s * (10 + i * 2), 5 + up + i * 2], [10 + s * (11 + i * 2.5), 14]], i % 2 ? STEM : LEAF); // vines to walk on
    } else {
      g.limb([[17, 11], [22, 12], [24, 9], [22, 7]], 1, 0.5, STEM, LEAF);
      g.limb([[3, 11], [-2, 13], [-4, 11]], 1, 0.5, STEM, LEAF);
    }
    g.ball(1, 2 + up, 19, 14 + up, PU, lite(PU), PD);
    for (const x of [5, 10, 15]) g.line(x, 3 + up, x + (x - 10) / 5, 13 + up, PD);
    g.rect(9, up, 11, 2 + up, STEM);
    g.set(11, up - 1, STEM);
    g.pts([[4, 12 + up], [15, 5 + up], [16, 11 + up]], hex('#5a5a3a')); // rot
    if (r) {
      g.maw(3, 7 + up, 17, 12 + up, { round: 1, teeth: hex('#d8cfa0'), len: 2, col: hex('#3a1a10') });
      g.pts([[6, 4 + up], [13, 4 + up]], C.flameLight);
      g.pts([[5, 4 + up], [14, 4 + up]], vd(PD));
      g.pts([[8, 14 + up], [8, 15 + up], [12, 14 + up]], hex('#c98a3a')); // pulp
    } else {
      g.path([[3, 9], [7, 10], [13, 10], [17, 9]], vd(PD)); // the split
      g.pts([[6, 6], [13, 6]], vd(PD));
    }
  });

  be('garden-hose-serpent', 'hose serpent garden hose snake coil brass nozzle fangs water green', (g, r) => {
    const H = hex('#4f6f48'),
      HD = hex('#35503a');
    for (let i = 0; i < 3; i++) {
      g.oval(1 + i, 8 - i * 3, 18 - i, 11 - i * 3, i % 2 ? HD : H); // the coil
      g.row(9 - i * 3, 3 + i, 16 - i, lite(H));
    }
    g.row(12, 3, 16, HD);
    if (r) {
      g.limb([[14, 3], [20, 0], [18, -8], [22, -13]], 1.5, 1.4, H, HD); // it rears
      g.rect(21, -17, 25, -15, C.brass);
      g.rect(21, -12, 24, -11, dark(C.brass));
      g.rect(22, -14, 25, -13, P.MAW);
      g.pts([[23, -14], [25, -14]], P.TOOTH);
      g.set(22, -16, P.RED);
      g.pts([[27, -13], [29, -12], [28, -14], [30, -13]], C.glassLight);
    } else {
      g.limb([[14, 3], [19, 4], [22, 9]], 1.4, 1.3, H, HD);
      g.rect(21, 10, 24, 12, C.brass); // the nozzle
      g.row(10, 21, 24, lite(C.brass));
      g.set(25, 11, vd(C.brass));
      g.set(26, 12, C.glassLight);
    }
  });

  be('garden-cabbage-heads', 'cabbage heads row vegetables faces leaves screaming root necks patch', (g, r) => {
    const CB = hex('#6a8a5a'),
      CD = hex('#46603e'),
      SK = hex('#a8b08a');
    g.oval(-1, 9, 26, 12, SOIL);
    [0, 9, 18].forEach((x, i) => {
      const up = r ? -4 - (i % 2) * 3 : 0;
      if (r) {
        g.tube([[x + 3, 10], [x + 4, 6 + up]], 1, 1, hex('#b9a88a')); // root necks
        g.poly([[x, 3 + up], [x - 2, 7 + up], [x + 2, 8 + up]], CD); // the leaves peel back
        g.poly([[x + 7, 3 + up], [x + 9, 7 + up], [x + 5, 8 + up]], CD);
        g.ball(x, up - 1, x + 7, 6 + up, SK);
        g.pts([[x + 2, 1 + up], [x + 5, 1 + up]], K);
        g.maw(x + 2, 3 + up, x + 5, 5 + up, { teeth: false });
        g.row(up - 1, x + 1, x + 6, CB);
      } else {
        g.ball(x, 2, x + 7, 10, CB, lite(CB), CD);
        g.path([[x + 1, 5], [x + 3, 3], [x + 6, 5]], CD);
        g.path([[x + 2, 8], [x + 5, 8]], CD);
        if (i === 1) g.pts([[x + 2, 6], [x + 5, 6]], K); // one of them is looking
        g.poly([[x, 6], [x - 1, 10], [x + 2, 10]], CD);
      }
    });
    g.row(12, 1, 24, vd(SOIL));
  });

  be('garden-root-child', 'root child mandrake small root baby leaves screaming pulled up turnip', (g, r) => {
    const RT = hex('#b39a72'),
      RD = hex('#806a4a');
    if (r) {
      g.path([[4, 10], [2, 14], [3, 18]], RT); // forked legs
      g.path([[5, 10], [3, 14], [4, 18]], RD);
      g.path([[7, 10], [9, 14], [8, 18]], RT);
      g.path([[8, 10], [10, 15], [10, 18]], RD);
      g.pts([[1, 17], [11, 17], [5, 15]], RD);
      g.ball(2, 1, 10, 11, RT, lite(RT), RD);
      g.rect(3, 4, 4, 5, K);
      g.rect(8, 4, 9, 5, K);
      g.maw(5, 6, 7, 9, { teeth: false });
      for (const v of [g, g.flip(12)]) {
        v.path([[2, 6], [-1, 4], [-2, 0]], RT);
        v.pts([[-3, -1], [-1, -1]], RD);
      }
    } else {
      g.oval(-1, 8, 13, 11, SOIL);
      g.ball(2, 3, 10, 10, RT, lite(RT), RD); // in the ground to its chin
      g.row(5, 3, 4, RD);
      g.row(5, 8, 9, RD);
      g.set(6, 7, RD);
      g.row(10, 1, 11, SOIL);
      g.row(11, 0, 12, vd(SOIL));
    }
    const ty = r ? 1 : 3;
    g.poly([[6, ty], [2, ty - 5], [4, ty - 6], [6, ty - 2]], LEAFL); // its leaves
    g.poly([[6, ty], [10, ty - 6], [8, ty - 6], [6, ty - 2]], LEAF);
    g.col(6, ty - 7, ty, LEAFL);
  });

  be('garden-cherub-teeth', 'stone cherub teeth statue angel baby wings fountain grin too many teeth', (g, r) => {
    const S = hex('#8a8880'),
      SL = hex('#a8a69c');
    g.rect(2, 18, 11, 21, dark(S));
    g.row(18, 1, 12, S);
    if (r) {
      for (const v of [g, g.flip(13)]) {
        v.poly([[3, 8], [-4, 1], [-5, 6], [-2, 7], [-3, 11], [2, 12]], S); // wings up
        v.line(2, 9, -4, 2, SL);
        arm(v, [[3, 10], [0, 13], [-3, 12]], S, SL, null, 1.2);
      }
    } else {
      for (const v of [g, g.flip(13)]) v.poly([[3, 8], [0, 6], [-1, 11], [2, 13]], S);
    }
    g.ball(3, 8, 10, 15, S, SL); // a fat little body
    g.rect(3, 15, 5, 17, S);
    g.rect(8, 15, 10, 17, dark(S));
    g.ball(2, 0, 11, 9, S, SL);
    g.pts([[3, 0], [5, -1], [8, -1], [10, 0], [2, 2], [11, 2]], SL); // curls
    if (r) {
      g.rect(4, 3, 5, 4, K);
      g.rect(8, 3, 9, 4, K);
      g.col(4, 5, 6, vd(S)); // it weeps something dark
      g.col(9, 5, 7, vd(S));
      g.maw(3, 6, 10, 8, { step: 1, len: 1 });
      g.row(7, 3, 10, P.MAW);
    } else {
      g.pts([[4, 4], [9, 4]], dark(S));
      g.row(7, 6, 7, vd(S));
      g.rect(5, 12, 8, 13, SL); // hands together
    }
    g.speckle(1, -1, 12, 21, C.moss, 8, 5);
  });

  /* ================= vermin and small things ================= */
  be('garden-worm-knot', 'worm knot ball of worms writhing eye small vermin pink', (g, r) => {
    const W1 = hex('#b99a8c'),
      W2 = hex('#cdbfa8');
    if (r) {
      [[[4, 6], [0, 1], [-2, -4]], [[7, 5], [6, -2], [8, -7]], [[10, 5], [13, 0], [12, -5]], [[12, 7], [17, 4], [19, -1]], [[3, 8], [-3, 6], [-5, 2]]].forEach((p, i) => {
        g.limb(p, 1, 0.8, i % 2 ? W1 : W2);
        g.set(p[2][0], p[2][1] - 1, P.MAW); // each ends in a mouth
      });
    }
    g.ball(1, 3, 14, 11, W1, W2, P.GUM);
    g.limb([[2, 8], [6, 4], [10, 8], [13, 5]], 1, 1, W2, dark(W1));
    g.limb([[3, 5], [8, 9], [13, 8]], 1, 1, W1, P.GUM);
    g.pts([[4, 10], [9, 6], [11, 10]], P.GUM);
    if (r) g.eye(6, 6, 3, P.EYE);
    else {
      g.limb([[13, 9], [16, 10], [18, 9]], 0.8, 0.6, W2);
      g.limb([[2, 9], [-1, 10], [-2, 8]], 0.8, 0.6, W1);
    }
  });

  be('garden-gnome-biter', 'gnome biter garden gnome small statue beard mouth teeth red hat', (g, r) => {
    const HAT = hex('#8a2e2a'),
      CO = hex('#3f5f76'),
      BE = hex('#c9c6ba');
    g.rect(2, 12, 7, 15, CO);
    g.rect(2, 15, 3, 16, C.black);
    g.rect(6, 15, 7, 16, C.black);
    g.rect(1, 16, 3, 16, C.black);
    g.rect(6, 16, 8, 16, C.black);
    g.poly([[4, -3], [5, -3], [8, 4], [1, 4]], HAT); // the hat
    g.rect(2, 5, 7, 7, C.flesh);
    g.pts([[3, 6], [6, 6]], K);
    g.poly([[2, 8], [7, 8], [6, 13], [3, 13]], BE); // the beard
    if (r) {
      g.maw(2, 8, 7, 12, { len: 1 }); // it is all mouth under there
      g.col(1, 8, 12, BE);
      g.col(8, 8, 12, dark(BE));
      g.path([[1, 12], [-1, 9], [-2, 5]], CO);
      g.col(-2, 0, 4, C.steel); // a trowel
      g.set(-2, -1, C.steel);
      g.path([[8, 12], [10, 9], [11, 6]], CO);
    } else {
      g.rect(1, 11, 1, 14, CO);
      g.rect(8, 11, 8, 14, dark(CO));
      g.set(6, 3, vd(HAT)); // chipped
      g.set(4, 9, dark(BE));
    }
  });

  be('garden-snail-skull', 'snail skull shell bone slug small vermin eye stalks slime', (g, r) => {
    const B = hex('#7a6a54');
    g.limb(r ? [[1, 9], [8, 9], [15, 8], [18, 4]] : [[2, 9], [8, 9], [13, 9]], 1.3, 1.5, B);
    g.ball(3, 1, 11, 8, C.bone); // its shell is a small skull
    g.rect(5, 3, 6, 5, K);
    g.rect(8, 3, 9, 5, K);
    g.set(7, 6, vd(C.bone));
    if (r) {
      g.rect(5, 8, 9, 10, P.MAW); // and the skull opens too
      g.teeth(8, 5, 9, C.bone, 2, 1, 1);
      g.row(11, 5, 9, C.bone);
      g.path([[18, 3], [17, 0], [16, -2]], B);
      g.path([[19, 3], [21, 0], [22, -1]], B);
      g.pts([[16, -3], [22, -2]], P.YEL);
      g.pts([[5, 4], [8, 4]], P.RED);
    } else {
      g.row(8, 5, 9, vd(C.bone));
      g.teeth(8, 5, 9, C.bone, 2, 1, 1);
      g.path([[14, 8], [15, 6]], B);
      g.set(15, 5, P.EYE);
    }
    g.row(11, r ? -1 : 0, r ? 2 : 3, C.glassLight);
  });

  be('garden-mole-hands', 'mole hands molehill human hands blind velvet small vermin digging', (g, r) => {
    const V = hex('#2e2a30'),
      HN = P.RAW;
    g.ball(0, r ? 6 : 3, 15, 12, SOIL, hex('#6e5440'), vd(SOIL)); // the molehill
    g.rect(0, 10, 15, 11, SOIL);
    g.row(11, 0, 15, vd(SOIL));
    if (r) {
      g.ball(3, -3, 12, 9, V, hex('#45404c'), vd(V));
      g.maw(6, 2, 9, 5, { len: 1 });
      g.rect(7, 0, 8, 1, HN); // a pink nose, and no eyes at all
      for (const v of [g, g.flip(15)]) {
        v.rect(-2, 3, 2, 7, HN); // a person's hands
        for (let i = 0; i < 4; i++) v.col(-3 + i * 2, 0, 3, HN);
        v.set(3, 6, dark(HN));
      }
    } else {
      g.rect(7, 1, 8, 2, HN);
      g.set(7, 0, V);
      g.set(8, 0, V);
      g.pts([[3, 3], [4, 2], [5, 3], [10, 3], [11, 2], [12, 3]], HN); // fingertips
    }
  });

  be('garden-wasp-pear', 'wasp pear rotten fruit wasps legs sting small vermin insect', (g, r) => {
    const PE = hex('#a8a04e'),
      RO = hex('#6a4a2a'),
      up = r ? -4 : 0;
    if (r) {
      for (let i = 0; i < 3; i++) for (const s of [-1, 1]) g.path([[4 + s * 2, 5 + up + i], [4 + s * (5 + i), 4 + up + i * 2], [4 + s * (6 + i), 10]], K);
      g.poly([[2, 1 + up], [-4, -4 + up], [-6, 0 + up], [1, 4 + up]], C.glassLight); // wings
      g.poly([[7, 1 + up], [13, -4 + up], [15, 0 + up], [8, 4 + up]], C.glassLight);
    }
    g.ball(0, 3 + up, 9, 11 + up, PE, lite(PE), dark(PE));
    g.ball(2, up - 1, 7, 6 + up, PE, lite(PE), dark(PE));
    g.col(4, up - 3, up - 1, C.woodDark);
    g.pts([[2, 8 + up], [3, 9 + up], [6, 5 + up], [7, 9 + up]], RO);
    if (r) {
      g.row(5 + up, 1, 8, K); // it is striped under the skin
      g.row(8 + up, 0, 9, K);
      g.maw(3, 1 + up, 6, 3 + up, { len: 1 });
      g.pts([[2, 0 + up], [7, 0 + up]], P.RED);
      g.col(4, 12 + up, 14 + up, K); // the sting
    } else {
      g.rect(5, 7, 6, 8, K); // a hole in it
      g.pts([[8, 3], [-1, 6], [10, 9]], K);
      g.pts([[9, 3], [0, 6]], P.YEL);
    }
  });

  be('garden-moth-faces', 'moth faces wings with human eyes face pattern insect small vermin flying', (g, r) => {
    const M = hex('#7a6a56'),
      MD = hex('#54463a');
    if (r) {
      for (const v of [g, g.flip(17)]) {
        v.poly([[8, 4], [1, -3], [-3, -1], [-2, 5], [8, 7]], M);
        v.poly([[8, 7], [1, 7], [0, 11], [4, 12], [8, 9]], MD);
        v.line(1, -3, 8, 4, lite(M));
        v.oval(0, 0, 5, 4, P.EYE); // each wing looks at you
        v.rect(2, 1, 3, 3, hex('#5a7a8a'));
        v.set(3, 2, K);
        v.row(0, 1, 4, MD);
        v.row(9, 2, 5, P.TOOTH);
      }
    } else {
      g.poly([[8, 1], [2, 11], [8, 12]], M); // wings shut like a roof
      g.poly([[9, 1], [15, 11], [9, 12]], MD);
      g.row(7, 5, 6, vd(M)); // a lid
      g.set(12, 7, vd(MD));
    }
    g.rect(8, 2, 9, 11, MD);
    g.pts([[8, 2], [9, 2]], hex('#a89a80'));
    g.path([[8, 1], [6, -2]], MD);
    g.path([[9, 1], [11, -2]], MD);
  }, { pad: 4 });

  be('garden-buried-digger', 'buried digger head hands out of soil flowerbed grave man earth small crawling', (g, r) => {
    const SK = hex('#8a7a62'),
      HAIR = hex('#3a3028');
    g.oval(-2, 6, 21, 10, SOIL);
    if (r) {
      g.ball(6, -5, 13, 6, SK); // out to the chin
      g.rect(6, -6, 13, -4, HAIR);
      g.pts([[8, -2], [11, -2]], C.white);
      g.maw(8, 1, 11, 4, { teeth: false, col: vd(SOIL) });
      g.set(9, 4, SOIL);
      for (const v of [g, g.flip(19)]) {
        v.tube([[4, 7], [1, 2], [-3, 6]], 1.2, 1, SK);
        v.claws(-4, 7, -1, 1, SK, 3, 2);
      }
    } else {
      g.ball(6, 2, 13, 8, HAIR, lite(HAIR)); // the top of a head
      g.pts([[2, 6], [3, 5], [4, 6], [15, 6], [16, 5], [17, 6]], SK); // fingertips
      g.col(0, 2, 6, STEM); // and the flowers go on growing
      g.rect(-1, 1, 1, 2, hex('#c9b0b4'));
      g.col(19, 3, 6, STEM);
      g.rect(18, 2, 20, 3, C.mustard);
    }
    g.row(8, 0, 19, SOIL);
    g.row(9, -1, 20, SOIL);
    g.row(10, 0, 19, vd(SOIL));
    g.pts([[3, 8], [9, 9], [15, 8]], hex('#6e5440'));
  });

  be('garden-finger-caterpillar', 'finger caterpillar fingers knuckles nails crawling small vermin flesh', (g, r) => {
    const F = hex('#c4a488'),
      FD = hex('#96785e');
    const n = 5;
    for (let i = 0; i < n; i++) {
      const up = r && i >= 3 ? (i - 2) * 4 : 0,
        x = 1 + i * 4 - (up ? (i - 2) * 1 : 0),
        y = 3 + (i % 2) - up;
      if (!up) g.pts([[x + 1, y + 4], [x + 3, y + 4]], FD);
      else g.pts([[x + 4, y + 2], [x + 5, y + 3]], FD);
      g.ball(x, y, x + 4, y + 3, F, lite(F), FD);
      g.col(x + 4, y + 1, y + 2, FD); // a knuckle crease
    }
    if (r) {
      g.ball(15, -9, 20, -4, F, lite(F), FD);
      g.rect(16, -9, 19, -8, hex('#e0d2c0')); // the nail lifts
      g.rect(16, -7, 19, -6, P.MAW);
      g.pts([[16, -7], [18, -7]], P.TOOTH);
    } else {
      g.ball(20, 3, 24, 7, F, lite(F), FD);
      g.rect(22, 3, 24, 5, hex('#e0d2c0')); // a nail
      g.set(21, 4, K);
    }
  });

  be('garden-frog-mouths', 'frog mouths split back second mouth teeth tongue small vermin pond', (g, r) => {
    const FR = hex('#5e7040'),
      FL = hex('#869a5a');
    g.ball(0, 6, 5, 11, dark(FR)); // haunches
    g.ball(8, 6, 13, 11, dark(FR));
    g.ball(1, 3, 12, 11, FR, FL, dark(FR));
    g.rect(2, 11, 4, 11, FL);
    g.rect(9, 11, 11, 11, FL);
    for (const x of [2, 9]) {
      g.ball(x, 1, x + 2, 4, FR, FL);
      g.set(x + 1, 2, r ? P.YEL : K);
    }
    g.row(8, 3, 10, vd(FR));
    if (r) {
      g.oval(2, -5, 11, 4, FR); // its back opens like a purse
      g.maw(3, -4, 10, 3, { round: 1, len: 2, tongue: P.GUM });
      g.limb([[7, 1], [9, -6], [13, -9]], 1, 0.7, P.RAW);
      g.pts([[2, 1], [11, 1]], FL);
    } else {
      g.path([[4, 5], [6, 4], [9, 5]], vd(FR)); // a seam along its back
      g.pts([[5, 4], [8, 4]], P.TOOTH);
    }
  });

  be('garden-shears-bird', 'shears bird rusty secateurs blades beak scissor small vermin crow metal', (g, r) => {
    const RU = C.rust,
      ST = C.steel;
    g.col(4, 9, 12, C.ironDark);
    g.col(7, 9, 12, C.ironDark);
    g.row(12, 3, 5, C.ironDark);
    g.row(12, 7, 9, C.ironDark);
    g.poly([[2, 5], [-3, 2], [0, 7]], dark(RU)); // tail
    g.ball(1, 3, 9, 9, RU, lite(RU), dark(RU));
    if (r) g.poly([[3, 5], [0, -4], [4, -3], [7, 4]], dark(RU));
    g.ball(7, 0, 11, 4, RU, lite(RU), dark(RU));
    g.set(9, 1, r ? P.YEL : K);
    g.set(10, 3, C.brass); // the pivot
    if (r) {
      g.path([[11, 2], [15, -2], [18, -4]], ST); // blades
      g.path([[11, 3], [15, 6], [18, 9]], ST);
      g.path([[12, 2], [16, -2]], lite(ST));
    } else {
      g.path([[11, 2], [18, 3]], ST);
      g.path([[11, 3], [17, 3]], dark(ST));
    }
    g.speckle(1, 0, 11, 9, C.woodDark, 6, 3);
  });
  /* MORE */
};
