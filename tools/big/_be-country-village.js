/* The village creatures of be-country.js: the old village. draw(g, r): r is 1 when roused. */
module.exports = (k, be) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, P, vd, fig, face, arm, legs, spiderLegs, ribs, curve } = k;
  const BLACKFUR = hex('#2c2830'),
    FUR2 = hex('#45404c'),
    LINEN = hex('#b9b3a2'),
    SACK = hex('#a08a5c'),
    FLOUR = hex('#d8d4c4'),
    HORN = hex('#b8ab8a'),
    CLOTH = hex('#7a6a50');

  /* ================= the large ones: tall ================= */
  be('village-well-dweller', 'well dweller large tall long arms stone well wet pale thing rising rope monster', (g, r) => {
    const SK = hex('#8f9e8c'),
      HAIR = hex('#22232a'),
      ST = C.stone;
    for (const x of [3, 19]) g.rect(x, 6, x + 1, 33, C.wood); // the well's frame
    g.rect(1, 4, 22, 6, C.woodDark);
    g.row(4, 1, 22, C.wood);
    g.rect(5, 11, 18, 13, C.woodLight); // the windlass
    g.row(13, 5, 18, dark(C.woodLight));
    if (r) {
      g.tube([[11, 34], [12, 22], [11, 9]], 2.4, 2, SK); // it comes up, and up
      for (let y = 14; y <= 28; y += 3) g.row(y, 10, 13, dark(SK));
      g.ball(7, -5, 16, 7, SK);
      g.rect(7, -6, 16, -3, HAIR);
      for (const [x, n] of [[6, 14], [7, 9], [16, 11], [17, 16]]) g.col(x, -4, -4 + n, HAIR);
      g.rect(9, -1, 10, 0, K);
      g.rect(13, -1, 14, 0, K);
      g.pts([[10, 0], [14, 0]], P.EYE);
      g.maw(9, 2, 14, 6, { len: 1 });
      for (const v of [g, g.flip(23)]) {
        v.path([[9, 11], [-2, 14], [-6, 26], [-5, 42]], SK); // arms long enough to reach you from there
        v.path([[9, 12], [-1, 15], [-5, 26], [-4, 42]], dark(SK));
        v.claws(-5, 43, 0, 1, SK, 3, 3);
      }
      g.pts([[11, 30], [14, 20], [2, 20], [21, 24]], C.glassLight);
    } else {
      g.col(11, 13, 26, C.straw); // the rope goes down
      g.col(12, 13, 26, dark(C.straw));
      g.ball(7, 27, 16, 36, SK); // the top of a head over the rim
      g.rect(7, 26, 16, 29, HAIR);
      g.col(7, 29, 33, HAIR);
      g.col(16, 29, 33, HAIR);
      g.pts([[10, 31], [13, 31]], P.EYE);
    }
    g.rect(2, 34, 21, 45, ST); // the well
    g.rect(1, 33, 22, 34, C.stoneLight);
    for (let y = 37; y <= 45; y += 3) g.row(y, 2, 21, dark(ST));
    for (let i = 0; i < 12; i++) g.col(3 + ((i * 5) % 18), 35 + (i % 3) * 3, 36 + (i % 3) * 3, dark(ST));
    g.lit(2, 34, 4, 45);
    g.pts([[4, 44], [5, 45], [18, 43], [8, 40]], C.moss);
    if (!r) {
      for (const x of [3, 17]) {
        g.rect(x, 32, x + 3, 33, SK); // and its hands, on the outside
        for (let i = 0; i < 4; i++) g.col(x + i, 34, 37 + (i % 2) * 2, i % 2 ? SK : dark(SK));
      }
    }
  });

  be('village-black-goat', 'black goat on two legs large tall devil horns hooves beast standing baphomet', (g, r) => {
    const F = BLACKFUR;
    for (const v of [g, g.flip(21)]) {
      v.leg([[7, 28], [5, 35], [8, 40], [7, 44]], FUR2, 2); // goat's legs
      v.rect(6, 44, 8, 45, HORN);
      v.set(7, 45, vd(HORN)); // cloven
    }
    g.ball(4, 21, 17, 32, F, FUR2);
    g.speckle(4, 21, 17, 32, FUR2, 4, 3);
    g.poly([[7, 12], [14, 12], [15, 25], [6, 25]], F);
    g.col(7, 13, 24, FUR2);
    for (const y of [15, 17, 19]) g.row(y, 9, 12, FUR2); // a man's ribs
    if (r) {
      for (const v of [g, g.flip(21)]) arm(v, [[7, 13], [1, 11], [-4, 5]], F, FUR2, HORN, 1.3);
    } else {
      for (const v of [g, g.flip(21)]) v.tube([[6, 13], [4, 21], [9, 26]], 1.3, 1.1, F, vd(F));
      g.rect(9, 25, 12, 27, FUR2); // hands folded, like a deacon
    }
    const hy = r ? -3 : 0;
    for (const v of [g, g.flip(21)]) {
      v.limb([[8, 3 + hy], [5, -3 + hy], [1, -3 + hy], [0, 2 + hy]], 1.4, 0.7, HORN, dark(HORN)); // horns
      v.path([[6, 5 + hy], [3, 6 + hy], [2, 8 + hy]], F); // ears
    }
    g.poly([[7, 1 + hy], [14, 1 + hy], [13, 12 + hy], [8, 12 + hy]], F);
    g.col(7, 2 + hy, 8 + hy, FUR2);
    g.rect(9, 9 + hy, 12, 12 + hy, hex('#55505a')); // the muzzle
    g.pts([[9, 10 + hy], [12, 10 + hy]], K);
    for (const x of [8, 12]) {
      g.rect(x, 5 + hy, x + 1, 6 + hy, r ? P.YEL : dark(P.YEL));
      g.row(r ? 5 + hy : 6 + hy, x, x + 1, K); // the slot of a goat's eye
      if (r) g.row(6 + hy, x, x + 1, P.YEL), g.set(x, 5 + hy, P.YEL), g.set(x + 1, 6 + hy, K);
    }
    if (r) {
      g.maw(9, 11 + hy, 12, 15 + hy, { step: 1, len: 1 }); // a man's teeth
      g.row(16 + hy, 9, 12, F);
      g.col(10, 14, 18, HORN); // the beard
      g.col(11, 14, 17, dark(HORN));
    } else {
      g.col(10, 13, 17, HORN);
      g.col(11, 13, 16, dark(HORN));
    }
  });

  be('village-bell-ringer', 'bell ringer large tall fused to his rope hanging church bell sexton stretched arms', (g, r) => {
    const SK = hex('#a89a84'),
      up = r ? -5 : 0,
      v = g.at(2, 14 + up);
    if (r) g.poly([[4, 2], [8, -4], [15, 0], [14, 6]], C.brass); // the bell swings
    else g.poly([[7, 0], [12, 0], [14, 6], [5, 6]], C.brass);
    g.row(r ? 5 : 6, 5, 14, dark(C.brass));
    g.set(r ? 5 : 9, 7, C.ironDark);
    g.rect(9, 7, 10, 26 + up, C.straw);
    g.col(10, 7, 26 + up, dark(C.straw));
    for (let y = 12; y <= 18; y++) g.row(y + up, 8, 11, y % 2 ? C.wine : C.cream); // the sally
    fig(v, { skin: SK, top: hex('#3e3a40'), legs: hex('#2e2c34'), arms: [null, null], eyes: false, ll: r ? 9 : 10, shoe: r ? false : undefined });
    for (const u of [v, v.flip(15)]) {
      u.tube([[3, 13], [3, 6], [6, 0]], 1.3, 1, C.straw, dark(C.straw)); // his arms have gone to rope
      u.pts([[3, 9], [4, 5], [5, 2]], dark(C.straw));
    }
    v.rect(6, -2, 9, 0, SK); // what is left of his hands
    v.rect(7, 12, 8, 13, C.straw); // and it runs down into his collar
    if (r) {
      v.pts([[6, 6], [9, 6]], C.white);
      v.maw(6, 8, 9, 10, { teeth: false });
      v.path([[7, 10], [7, 16], [9, 20]], C.straw); // more of it comes out of him
      v.rect(4, 31, 5, 33, SK); // off the ground: bare feet
      v.rect(9, 31, 11, 32, SK);
    } else {
      v.pts([[5, 6], [6, 6], [9, 6], [10, 6]], vd(SK));
      v.row(9, 7, 8, vd(SK));
    }
  }, { padUsed: 5 });

  be('village-maypole-thing', 'maypole thing large tall ribbons hands pole face flower crown dancing tentacles', (g, r) => {
    const cols = [C.wine, C.cream, C.mustard, C.teal, hex('#8a5a6a'), C.forest];
    const hand = (x, y, d) => {
      g.rect(x - 1, y, x + 1, y + 1, P.PALE);
      g.claws(x, y + 2 * (d ? 0 : 1), d, d ? 0 : 1, P.PALE, 3, 2);
    };
    cols.forEach((col, i) => {
      const s = i % 2 ? 1 : -1,
        n = (i >> 1) + 1;
      if (r) {
        const p = [[8, 3], [8 + s * (6 + n * 2), 4 + n * 3], [8 + s * (10 + n * 3), 12 + n * 6], [8 + s * (15 + n * 2), 10 + n * 8]];
        g.limb(p, 1, 0.9, col, dark(col)); // the ribbons reach
        hand(p[3][0] + s, p[3][1], s);
      } else {
        const x = 8 + s * (1 + n * 2);
        g.path([[8, 3], [x, 8], [x, 30 + n * 3]], col);
        g.path([[8 + s, 3], [x + s, 9], [x + s, 30 + n * 3]], dark(col));
        hand(x, 31 + n * 3, 0);
      }
    });
    g.rect(7, 2, 9, 45, C.woodPale);
    g.col(9, 2, 45, dark(C.woodPale));
    for (let y = 6; y < 45; y += 4) g.set(7 + ((y >> 2) % 3), y, C.wine); // a painted spiral
    g.ball(4, -2, 12, 4, C.leafLight, lite(C.leafLight), C.leaf); // the crown
    g.pts([[5, 0], [8, -2], [11, 1], [7, 3]], hex('#c9b0b4'));
    g.pts([[10, -1], [5, 3]], C.mustard);
    if (r) {
      g.rect(7, 8, 9, 15, C.woodPale); // the pole has a face
      g.pts([[7, 9], [9, 9]], P.YEL);
      g.maw(7, 11, 9, 15, { step: 2, len: 1 });
    } else g.pts([[7, 10], [9, 10], [8, 13]], vd(C.woodPale)); // knots
  });

  /* ================= the large ones: long ================= */
  be('village-plague-cart-puller', 'plague cart puller large long dead cart shrouds bodies hooded thing harness bell bring out your dead', (g, r) => {
    const W = C.wood,
      HO = hex('#5a5040'),
      SK = hex('#9a9a84');
    g.line(26, 17, 44, r ? 19 : 20, C.woodDark); // the shafts
    g.line(26, 18, 44, r ? 20 : 21, W);
    g.ball(3, 6, 15, 15, LINEN); // the load, in its sheets
    g.ball(12, 4, 26, 15, dark(LINEN), LINEN);
    g.path([[5, 9], [9, 12], [13, 10]], dark(LINEN));
    g.path([[15, 8], [20, 11], [24, 8]], vd(LINEN));
    g.rect(0, 12, 2, 13, P.PALE); // feet
    g.rect(0, 9, 1, 10, dark(P.PALE));
    g.rect(2, 14, 27, 18, W); // the cart
    g.row(14, 2, 27, lite(W));
    g.row(18, 2, 27, dark(W));
    for (let a = 0; a < 8; a++) g.line(13, 22, 13 + Math.cos((a * Math.PI) / 4) * 6, 22 + Math.sin((a * Math.PI) / 4) * 6, C.woodDark);
    for (let a = 0; a < 48; a++) {
      const t = (a / 48) * Math.PI * 2;
      g.set(13 + Math.cos(t) * 7, 22 + Math.sin(t) * 7, C.woodLight);
      g.set(13 + Math.cos(t) * 6.2, 22 + Math.sin(t) * 6.2, W);
    }
    g.rect(12, 21, 14, 23, C.iron);
    if (r) {
      arm(g, [[8, 8], [6, 1], [9, -5]], dark(LINEN), P.PALE, P.PALE, 1.1); // the load wakes
      arm(g, [[20, 6], [23, -1], [21, -7]], LINEN, P.PALE, P.PALE, 1.1);
      g.ball(13, -1, 19, 6, LINEN);
      g.pts([[15, 2], [17, 2]], vd(LINEN));
      g.row(4, 15, 17, vd(LINEN));
      g.leg([[33, 20], [31, 25], [33, 29]], HO, 2, 1);
      g.leg([[37, 20], [39, 25], [37, 29]], dark(HO), 2, 1);
      g.limb([[34, 22], [35, 12], [37, 3]], 4, 3.2, HO, vd(HO)); // it straightens between the shafts
      g.ball(32, -8, 42, 4, HO, lite(HO), vd(HO));
      g.oval(34, -5, 40, 3, P.MAW); // nothing in the hood but teeth
      g.pts([[35, -3], [39, -3]], P.YEL);
      g.teeth(0, 35, 39, P.TOOTH, 2, 3, 1);
      for (const s of [-1, 1]) {
        g.path([[36 + s * 3, 8], [36 + s * 9, 4], [36 + s * 11, -4]], SK);
        g.claws(36 + s * 11, -5, 0, -1, SK, 3, 3);
      }
    } else {
      g.rect(18, 15, 20, 16, P.PALE); // a hand over the side
      g.pts([[18, 17], [20, 17], [19, 18]], P.PALE);
      g.leg([[32, 21], [30, 25], [32, 29]], HO, 2, 1);
      g.leg([[36, 21], [38, 25], [36, 29]], dark(HO), 2, 1);
      g.limb([[32, 21], [37, 14], [43, 13]], 4, 3.2, HO, vd(HO)); // bent to the pull
      g.ball(40, 9, 48, 18, HO, lite(HO), vd(HO));
      g.oval(43, 12, 47, 17, P.MAW);
      g.path([[41, 16], [43, 23], [44, 28]], SK); // arms that drag
      g.claws(44, 29, 0, 1, SK, 3, 1);
      g.path([[38, 17], [39, 24], [40, 28]], dark(SK));
    }
    g.rect(29, 16, 30, 18, C.brass); // the bell
    g.set(29, 19, C.ironDark);
    g.line(28, 17, 36, r ? 12 : 16, C.rust); // harness
  });

  be('village-gossips', 'gossips large long three old women one shared mouth joined heads shawls whispering teeth', (g, r) => {
    const SK = hex('#bba78c'),
      DR = [hex('#3e3a46'), hex('#4f4438'), hex('#353c44')],
      BON = [hex('#d2ccba'), hex('#8d8a84'), hex('#2c2a34')];
    if (r)
      for (const [v, n] of [[g, 0], [g.flip(42), 1]]) {
        arm(v, [[5, 16], [-1, 12], [-5, 5]], DR[n * 2], SK, SK, 1.2); // every hand points
        arm(v, [[4, 19], [-3, 20], [-8, 16]], dark(DR[n * 2]), SK, SK, 1.2);
      }
    g.poly([[4, 14], [38, 14], [42, 30], [0, 30]], DR[1]);
    g.poly([[4, 14], [15, 14], [14, 30], [0, 30]], DR[0]);
    g.poly([[28, 14], [38, 14], [42, 30], [29, 30]], DR[2]);
    for (const x of [6, 11, 18, 24, 32, 37]) g.line(x, 18, x + (x - 21) / 8, 30, vd(DR[1]));
    g.lit(0, 14, 6, 30);
    g.rect(7, 5, 35, 12, SK); // one face between them
    [4, 16, 28].forEach((x, i) => {
      g.ball(x, 0, x + 10, 12, BON[i]);
      g.oval(x + 1, 3, x + 9, 12, SK);
      if (r) {
        g.eye(x + 2, 4, 2, C.white);
        g.eye(x + 6, 4, 2, C.white);
      } else {
        g.pts([[x + 3, 5], [x + 7, 5]], K);
        g.pts([[x + 2, 4], [x + 8, 4]], dark(SK));
      }
      g.set(x + 5, 7, dark(SK));
      g.row(13, x + 2, x + 8, BON[i]);
    });
    g.rect(13, 6, 16, 12, SK);
    g.rect(25, 6, 28, 12, SK);
    if (r) {
      g.maw(6, 8, 36, 12, { len: 2 }); // and one mouth
      g.row(13, 7, 35, SK);
      g.row(14, 9, 33, dark(SK));
    } else {
      g.row(10, 7, 35, vd(SK));
      g.pts([[6, 9], [36, 9], [14, 11], [27, 11]], vd(SK));
      g.rect(9, 20, 12, 21, SK); // hands in their laps
      g.rect(19, 21, 23, 22, SK);
      g.rect(30, 20, 33, 21, SK);
    }
  });

  be('village-harvest-procession', 'harvest mask procession large long many legs straw masks corn dolly stag skull sun one creature', (g, r) => {
    const LEG = hex('#2e2a2c');
    const masks = [
      (v) => {
        v.poly([[3, 0], [4, 0], [7, 8], [0, 8]], C.straw); // a sheaf
        v.row(5, 1, 6, C.rust);
        v.pts([[2, -1], [5, -1], [3, -2]], dark(C.straw));
      },
      (v) => {
        v.ball(0, 1, 7, 8, SACK); // a sack
        v.pts([[1, 0], [6, 0]], SACK);
      },
      (v) => {
        v.ball(1, 1, 6, 8, C.gold); // the sun
        for (let a = 0; a < 8; a++) v.set(3.5 + Math.cos((a * Math.PI) / 4) * 4.6, 4.5 + Math.sin((a * Math.PI) / 4) * 4.6, C.gold);
      },
      (v) => {
        v.poly([[1, 1], [6, 1], [5, 8], [2, 8]], C.bone); // a stag's skull
        v.path([[1, 0], [-1, -3], [-3, -4]], HORN);
        v.path([[-1, -3], [0, -6]], HORN);
        v.path([[6, 0], [8, -3], [10, -4]], HORN);
        v.path([[8, -3], [7, -6]], HORN);
      },
      (v) => {
        v.ball(0, 0, 7, 8, C.straw); // a corn dolly's plaited ring
        v.oval(2, 2, 5, 6, vd(C.straw));
        v.dither(0, 0, 7, 8, dark(C.straw));
        v.oval(2, 2, 5, 6, vd(C.straw));
      },
    ];
    for (let i = 0; i < 5; i++) {
      const up = r && i === 4 ? 7 : r && i === 3 ? 2 : 0,
        x = 2 + i * 9;
      for (const dx of [1, 6]) {
        if (r) g.leg([[x + dx + 1, 20 - up], [x + dx + (dx > 3 ? 4 : -2), 23 - up / 2], [x + dx + (dx > 3 ? 2 : 0), 29 - (up > 5 && dx > 3 ? 8 : 0)]], LEG, 1); // what walks under the cloth
        else g.rect(x + dx, 22, x + dx + 1, 29, dx > 3 ? vd(CLOTH) : LEG);
        if (!r) g.set(x + dx + 2, 29, LEG);
      }
    }
    for (let i = 0; i < 5; i++) {
      const up = r && i === 4 ? 7 : r && i === 3 ? 2 : 0,
        x = 2 + i * 9;
      g.ball(x - 1, 11 - up, x + 10, 24 - up, i % 2 ? CLOTH : hex('#84745a'), lite(CLOTH), dark(CLOTH)); // one long cloth over all of them
      g.line(x + 3, 14 - up, x + 2, 23 - up, dark(CLOTH));
      g.line(x + 7, 15 - up, x + 8, 23 - up, dark(CLOTH));
    }
    g.hem(24, 1, 46, 2, 3);
    for (let i = 0; i < 5; i++) {
      const up = r && i === 4 ? 7 : r && i === 3 ? 2 : 0,
        v = g.at(3 + i * 9, 3 - up - (i % 2));
      masks[i](v);
      if (r) {
        v.pts([[2, 4], [5, 4]], i === 2 ? K : P.YEL);
        v.rect(2, 6, 5, 7, P.MAW);
        v.pts([[2, 6], [4, 6]], P.TOOTH);
      } else {
        v.pts([[2, 4], [5, 4]], K);
        if (i !== 4) v.row(6, 3, 4, K);
      }
    }
    if (r) {
      g.path([[46, 8], [52, 4], [54, -2], [51, -6]], C.steel); // sickles
      g.path([[46, 9], [49, 7]], C.woodDark);
      g.path([[2, 14], [-4, 9], [-5, 3], [-2, 0]], C.steel);
      g.path([[2, 15], [-1, 13]], C.woodDark);
    } else {
      g.col(0, 4, 20, C.woodPale); // a pole with a corn dolly
      g.rect(-1, 1, 1, 5, C.straw);
      g.row(3, -2, 2, dark(C.straw));
    }
  });

  be('village-church-grim', 'church grim large long black dog graveyard hound guardian ribs red eyes chain monster', (g, r) => {
    const F = BLACKFUR;
    if (r) {
      g.limb([[6, 10], [1, 6], [0, 0]], 1.8, 0.9, F, vd(F)); // tail
      legs(g, [8, 13, 30, 35], 16, 27, 3, FUR2);
      for (const x of [8, 13, 30, 35]) g.pts([[x, 28], [x + 2, 28], [x + 4, 28]], HORN);
      g.ball(5, 5, 38, 19, F, FUR2, vd(F));
      ribs(g, 17, 11, 26, 17, hex('#8a8474'), P.MAW); // you can see into it
      g.pts([[20, 14], [23, 14]], P.RED); // and something sees out
      for (const x of [8, 12, 16, 20, 24, 28, 32]) g.line(x, 5, x - 1, 2 - (x % 3), F); // hackles
      g.ball(32, -2, 45, 11, F, FUR2, vd(F));
      g.poly([[33, 0], [34, -5], [37, -1]], F);
      g.poly([[40, -1], [42, -5], [43, 0]], F);
      g.rect(42, 2, 49, 5, F); // the jaws
      g.rect(42, 10, 48, 11, FUR2);
      g.rect(42, 6, 48, 9, P.MAW);
      g.teeth(6, 43, 48, P.TOOTH, 2, 2, 1);
      g.teeth(9, 44, 48, P.TOOTH, 2, 2, -1);
      g.row(8, 42, 45, P.GUM);
      g.eye(38, 2, 2, P.RED, C.flameLight);
      g.set(49, 2, K);
    } else {
      g.limb([[5, 16], [1, 17], [-1, 14]], 1.6, 0.9, F, vd(F));
      g.ball(3, 7, 37, 19, F, FUR2, vd(F)); // lying across the church path
      g.ball(4, 12, 13, 19, FUR2, FUR2, F); // a haunch
      g.rect(33, 16, 46, 18, FUR2); // forelegs out in front
      g.pts([[47, 17], [47, 18], [46, 19]], HORN);
      g.ball(33, 5, 45, 16, F, FUR2, vd(F)); // the head on them
      g.rect(41, 11, 48, 15, F);
      g.poly([[34, 6], [35, 2], [38, 5]], F);
      g.poly([[40, 5], [42, 2], [43, 6]], F);
      g.row(14, 42, 48, vd(F));
      g.set(48, 12, K);
      g.pts([[38, 9], [42, 9]], P.RED); // not asleep
      for (const y of [11, 13, 15]) g.row(y, 19, 25, hex('#4a4650')); // its ribs show
    }
    g.path(r ? [[34, 11], [30, 16], [27, 22], [24, 28]] : [[33, 14], [29, 18], [24, 19], [20, 20]], C.steel); // a broken chain
    g.speckle(3, 5, 38, 19, FUR2, 6, 4);
  });

  /* ================= dog- to person-sized ================= */
  be('village-miller-flour', 'miller ground to flour white dust man crumbling walking mill ghost', (g, r) => {
    const F = FLOUR,
      FD = hex('#a8a494');
    g.ball(-1, 28, 16, 33, F, lite(F), FD); // he ends in a heap of himself
    if (r) g.ball(-4, 29, 5, 33, F, lite(F), FD);
    fig(g, { skin: F, top: F, legs: FD, shoe: false, apron: hex('#c4bfae'), eyes: false, ll: 8, arms: r ? [[[2, 13], [-2, 14], [-6, 12]], 'reach'] : ['down', 'down'] });
    g.rect(4, 0, 11, 2, F); // the miller's cap
    g.row(3, 3, 12, FD);
    g.rect(5, 5, 6, 6, K);
    g.rect(9, 5, 10, 6, K);
    if (r) {
      g.maw(6, 8, 9, 12, { teeth: false, col: vd(FD) });
      g.clearRect(11, 2, 13, 7); // his head is pouring away
      g.pts([[12, 4], [13, 7], [12, 10], [14, 13], [13, 17]], F);
      g.col(-6, 13, 27, F); // and his arm
      g.col(-5, 14, 22, FD);
      g.pts([[-8, 18], [-3, 24], [18, 8], [16, 2], [-9, 26], [19, 20]], F); // dust
    } else {
      g.row(9, 6, 9, vd(FD));
      g.col(2, 22, 27, F); // it runs out of his cuffs
      g.col(13, 22, 26, FD);
    }
    g.speckle(1, 12, 14, 30, FD, 6, 3);
  });

  be('village-oven-child', 'oven child baker burnt bread crust small boy girl glowing cracks ember', (g, r) => {
    const CR = hex('#6a4426'),
      CL = hex('#96683a'),
      CH = hex('#2e2420');
    g.rect(4, 15, 5, 19, CR);
    g.rect(8, 15, 9, 19, dark(CR));
    g.row(19, 3, 5, CH);
    g.row(19, 8, 10, CH);
    g.ball(2, 8, 11, 16, CR, CL, CH); // a little body like a loaf
    g.ball(1, -1, 12, 9, CR, CL, CH); // and a head like a bun
    const glow = r ? C.flameLight : vd(CR);
    g.path([[3, 12], [6, 11], [10, 13]], glow); // the baker's cuts
    g.path([[4, 14], [9, 15]], r ? C.flame : vd(CR));
    g.rect(3, 3, 4, 4, r ? C.flameLight : CH);
    g.rect(8, 3, 9, 4, r ? C.flameLight : CH);
    if (r) {
      g.maw(4, 6, 9, 8, { teeth: false, col: C.flame });
      g.row(7, 5, 8, C.flameLight);
      for (const v of [g, g.flip(13)]) {
        v.path([[2, 10], [-1, 9], [-3, 6]], CR); // it wants to be picked up
        v.path([[2, 11], [-1, 10], [-3, 7]], CH);
        v.pts([[-4, 5], [-3, 4], [-2, 5]], CH);
      }
      g.pts([[3, -3], [6, -5], [9, -4], [7, -8], [5, -10]], hex('#77747a')); // smoke
    } else {
      g.row(7, 5, 8, CH);
      for (const v of [g, g.flip(13)]) v.rect(1, 9, 2, 14, v === g ? CR : dark(CR));
      g.pts([[5, -3], [7, -5]], hex('#77747a'));
    }
    g.speckle(1, -1, 12, 16, CH, 7, 2);
  });

  be('village-straw-effigy', 'straw effigy guy bonfire burning man bundle stake wicker walking fire', (g, r) => {
    const S = C.straw,
      SD = dark(C.straw);
    if (r) {
      g.poly([[5, 26], [8, 26], [6, 36], [3, 36]], S); // it has come off its stake
      g.poly([[9, 26], [12, 26], [14, 36], [11, 36]], SD);
    } else {
      g.col(8, 30, 37, C.woodDark);
      g.poly([[5, 26], [12, 26], [11, 36], [6, 36]], S);
      g.col(8, 27, 34, SD);
    }
    g.row(33, r ? 3 : 6, r ? 14 : 11, C.rust);
    g.poly([[5, 11], [12, 11], [13, 27], [4, 27]], S);
    for (const x of [6, 8, 11]) g.line(x, 12, x + (x - 8) / 2, 26, SD);
    g.row(19, 4, 13, C.rust);
    g.row(11, 5, 12, C.rust);
    if (r) {
      arm(g, [[5, 13], [0, 16], [-4, 13]], S, SD, S, 1.4);
      arm(g.flip(17), [[5, 13], [1, 9], [-2, 3]], SD, S, S, 1.4);
      g.fire(13, -8, 20, 6); // the arm they lit
      g.fire(6, -9, 12, 1);
    } else {
      g.rect(-2, 12, 5, 14, S); // arms out on the cross piece
      g.rect(12, 12, 19, 14, SD);
      g.pts([[-3, 12], [-4, 13], [-3, 14], [20, 12], [21, 13], [20, 14]], S);
    }
    g.ball(4, 1, 13, 11, S, lite(S), SD); // no face
    g.pts([[5, 0], [8, -1], [11, 0], [7, 0]], SD);
    if (r) {
      g.rect(5, 4, 6, 6, K); // until it burns
      g.rect(10, 4, 11, 6, K);
      g.pts([[5, 6], [10, 6]], C.flameLight);
      g.maw(6, 8, 11, 10, { teeth: false, col: C.flame });
      g.pts([[2, 20], [14, 23], [9, 15]], C.flame);
    } else g.line(6, 4, 11, 8, SD);
  });

  be('village-smithy-golem', 'smithy iron golem anvil head hammer tongs furnace belly forge blacksmith metal monster', (g, r) => {
    const I = C.iron,
      ID = C.ironDark;
    for (const x of [5, 14]) {
      g.rect(x, 26, x + 4, 33, ID); // short heavy legs
      g.rect(x - 1, 33, x + 5, 34, I);
      g.col(x, 26, 32, I);
    }
    g.ball(2, 9, 21, 28, I, C.steel, ID); // a barrel of plates
    g.col(8, 10, 27, ID);
    g.col(15, 10, 27, ID);
    g.pts([[5, 13], [11, 12], [18, 13], [5, 23], [18, 23]], C.steel); // rivets
    g.rect(8, 17, 15, 23, K); // the grate
    for (const x of [9, 11, 13, 15]) g.col(x, 17, 23, ID);
    for (const x of [8, 10, 12, 14]) g.col(x, 18, 22, r ? C.flameLight : dark(C.blood));
    if (r) g.pts([[10, 19], [12, 21], [14, 18]], C.flame);
    // the head is an anvil
    g.rect(6, 2, 17, 5, I);
    g.row(2, 6, 17, C.steel);
    g.poly([[17, 2], [23, 3], [17, 5]], I);
    g.rect(9, 6, 14, 7, ID);
    g.rect(7, 8, 16, 9, I);
    g.pts([[8, 4], [12, 4]], r ? C.flameLight : ID);
    g.pts([[9, 4], [13, 4]], r ? C.flame : ID);
    if (r) {
      g.tube([[3, 12], [-2, 7], [-3, -1]], 1.8, 1.6, ID, K); // the hammer goes up
      g.rect(-7, -7, 1, -2, I);
      g.row(-7, -7, 1, C.steel);
      g.tube([[20, 12], [26, 12], [28, 6]], 1.8, 1.6, ID, K);
      g.path([[28, 4], [27, -2], [29, -6]], I); // tongs
      g.path([[29, 4], [31, -1], [29, -6]], C.steel);
      g.pts([[1, -9], [4, -6], [-9, -4], [20, 0], [24, -3]], C.flameLight); // sparks
    } else {
      g.tube([[3, 12], [0, 20], [0, 26]], 1.8, 1.6, ID, K);
      g.rect(-3, 27, 3, 31, I); // a hammer for a hand
      g.row(27, -3, 3, C.steel);
      g.tube([[20, 12], [23, 20], [23, 25]], 1.8, 1.6, ID, K);
      g.path([[22, 26], [21, 31], [23, 33]], I);
      g.path([[24, 26], [25, 31], [23, 33]], C.steel);
    }
  });

  be('village-drowned-man', 'tavern drowned man bloated wet blue tankard water pouring eel drunk corpse', (g, r) => {
    const SK = hex('#8fa0a6'),
      CO = hex('#4a4a44');
    g.oval(1, 31, 15, 33, hex('#34566b')); // he stands in what runs off him
    fig(g, { skin: SK, top: CO, legs: hex('#3a3a3c'), hair: hex('#2a3030'), eyes: false, arms: r ? ['reach', 'down'] : ['down', 'hold'] });
    g.ball(3, 15, 12, 24, CO, lite(CO), dark(CO)); // swollen
    g.pts([[7, 17], [7, 20]], C.bone);
    g.pts([[3, 5], [12, 6], [4, 8]], hex('#5d7f8c'));
    if (r) {
      g.pts([[6, 6], [9, 6]], C.white);
      g.maw(6, 8, 9, 11, { teeth: false });
      g.rect(7, 10, 8, 30, hex('#5d7f8c')); // it all comes back up
      g.col(8, 10, 30, hex('#34566b'));
      g.pts([[6, 30], [9, 29], [5, 31]], hex('#9ebcc2'));
      g.limb([[10, 20], [15, 22], [18, 18], [17, 14]], 1.2, 0.8, hex('#3a4438')); // and something that lived in him
      g.set(17, 13, P.YEL);
    } else {
      g.pts([[5, 6], [6, 6], [9, 6], [10, 6]], vd(SK));
      g.row(9, 6, 9, vd(SK));
      g.col(7, 10, 12, hex('#5d7f8c'));
      g.rect(9, 15, 12, 19, C.steel); // his tankard, still
      g.row(15, 9, 12, lite(C.steel));
      g.col(13, 16, 18, C.steel);
    }
    g.pts([[1, 24], [14, 26], [5, 29], [11, 31]], hex('#9ebcc2')); // drips
  });

  be('village-sexton-lantern', 'sexton lantern head gravedigger spade tall thin coat flame skull churchyard', (g, r) => {
    const CO = hex('#33303a');
    const v = g.at(0, 3);
    fig(v, { head: false, top: CO, robe: CO, tl: 12, ll: 12, skin: hex('#9a9484'), arms: r ? ['claw', [[2, 13], [-1, 9], [-2, 2]]] : ['down', 'down'], claws: r ? hex('#9a9484') : null });
    g.rect(5, 4, 10, 13, C.ironDark); // a lantern on his shoulders
    g.rect(6, 5, 9, 12, r ? C.flame : hex('#5a4a2a'));
    g.col(7.5, 5, 12, C.ironDark);
    g.poly([[7, 0], [8, 0], [11, 4], [4, 4]], C.iron);
    g.rect(7, -2, 8, -1, C.iron);
    g.rect(4, 13, 11, 14, C.iron);
    if (r) {
      g.rect(6, 5, 9, 12, C.flame);
      g.rect(6, 6, 9, 10, C.flameLight); // there is a face in the flame
      g.pts([[6, 7], [9, 7]], K);
      g.rect(7, 9, 8, 11, K);
      g.pts([[3, 6], [12, 8], [2, 10], [13, 4]], C.flameLight);
      g.col(18, -8, 12, C.woodPale); // the spade comes up
      g.poly([[16, -14], [20, -14], [20, -8], [18, -7], [16, -8]], C.steel);
    } else {
      g.pts([[7, 10], [8, 9]], C.flameLight);
      g.set(7, 11, C.flame);
      g.col(15, 8, 37, C.woodPale);
      g.poly([[13, 33], [17, 33], [17, 38], [15, 39], [13, 38]], C.steel);
    }
  });

  be('village-stocks-walker', 'stocks walker prisoner board head hands locked pillory carries wood rotten', (g, r) => {
    const W = C.wood,
      SK = hex('#a39a80');
    g.rect(8, 15, 9, 26, hex('#3e3a34')); // withered under the board
    g.rect(12, 15, 13, 26, hex('#2e2c2a'));
    g.rect(7, 26, 9, 27, SK);
    g.rect(12, 26, 14, 27, SK);
    g.poly([[7, 9], [14, 9], [13, 17], [8, 17]], hex('#5a5648'));
    g.hem(17, 8, 13, 2, 2);
    if (r) {
      for (const x of [3, 9, 15]) {
        g.path([[x + 1, 9], [x, 13], [x + 1, 16]], SK); // more hands, under it
        g.claws(x + 1, 17, 0, 1, SK, 3, 2);
      }
    }
    g.rect(-1, 3, 22, 9, W); // the board
    g.row(3, -1, 22, lite(W));
    g.row(6, -1, 22, C.woodDark);
    g.row(9, -1, 22, dark(W));
    g.rect(-1, 5, 0, 7, C.iron);
    g.rect(21, 5, 22, 7, C.iron);
    const hy = r ? -3 : 0;
    g.ball(7, -1 + hy, 14, 8 + hy, SK); // his head through it
    g.rect(7, -2 + hy, 14, r ? -3 : 3, hex('#4a4034'));
    for (const x of [2, 17]) {
      g.rect(x, 4, x + 2, 6, SK); // and his hands
      if (r) g.claws(x + 1, 3, 0, -1, SK, 3, 3);
      else g.pts([[x, 7], [x + 2, 7]], SK);
    }
    if (r) {
      g.pts([[9, 0], [12, 0]], C.white);
      g.maw(9, 2, 12, 5, { len: 1 });
      g.pts([[8, -3], [13, 1]], hex('#7a8a4a')); // what they threw
      g.path([[15, 3], [16, 6], [15, 9]], K); // the board is splitting
    } else {
      g.col(8, 3, 7, hex('#4a4034')); // hair over his face
      g.col(10, 3, 8, hex('#4a4034'));
      g.col(12, 3, 6, hex('#4a4034'));
      g.set(11, 5, K);
    }
  });

  be('village-butcher-pig', 'butcher pig head cleaver apron man with a pigs head tusks meat', (g, r) => {
    const PG = hex('#c49a94'),
      AP = hex('#c4bfae');
    fig(g, { head: false, skin: PG, top: hex('#5a5a66'), legs: hex('#33323a'), apron: AP, arms: r ? ['down', [[2, 13], [-2, 9], [-3, 2]]] : ['down', 'down'] });
    for (let x = 5; x <= 10; x += 2) g.col(x, 15, 26, hex('#8a94a8')); // striped
    g.pts([[6, 20], [7, 21], [9, 24], [6, 25]], C.blood);
    g.ball(3, 1, 12, 12, PG); // a pig's head
    g.poly([[3, 3], [2, -1], [6, 1]], PG);
    g.poly([[12, 3], [13, -1], [9, 1]], dark(PG));
    g.rect(5, 7, 10, 10, hex('#d8aea6')); // the snout
    g.pts([[6, 8], [9, 8]], vd(PG));
    g.pts([[5, 5], [10, 5]], r ? P.RED : K);
    if (r) {
      g.maw(5, 10, 10, 13, { len: 1, step: 5 });
      g.pts([[5, 9], [10, 9]], P.TOOTH); // tusks
      g.rect(16, -5, 20, 0, C.steel); // the cleaver, up
      g.row(-5, 16, 20, lite(C.steel));
      g.col(18, 1, 3, C.woodDark);
      g.set(19, -2, C.blood);
    } else {
      g.row(11, 6, 9, vd(PG));
      g.rect(12, 23, 15, 27, C.steel);
      g.col(13, 20, 22, C.woodDark);
    }
  });

  be('village-weaver-threads', 'weaver threads loom woman woven into cloth strung puppet warp spider', (g, r) => {
    const W = C.wood,
      TH = hex('#c9c6ba'),
      SK = hex('#b3a48c'),
      CL = hex('#6a4a58');
    g.rect(0, 0, 1, 29, W); // the loom
    g.rect(18, 0, 19, 29, dark(W));
    g.rect(0, 0, 19, 1, W);
    g.rect(0, 24, 19, 25, C.woodDark);
    for (let x = 3; x <= 16; x += 2) g.col(x, 2, 23, x % 4 === 3 ? TH : dark(TH)); // the warp
    g.rect(4, 15, 15, 23, CL); // the cloth, and she is in it
    for (let y = 15; y <= 23; y += 2) g.row(y, 4, 15, dark(CL));
    for (let x = 5; x <= 15; x += 3) g.col(x, 15, 23, hex('#8a6a5a'));
    g.poly([[7, 9], [12, 9], [14, 16], [5, 16]], CL);
    const hy = r ? -2 : 0;
    g.ball(6, 1 + hy, 13, 10 + hy, SK);
    g.rect(6, hy, 13, 2 + hy, TH); // white hair, threaded upward
    for (const x of [6, 9, 13]) g.col(x, r ? -4 : 0, hy, TH);
    if (r) {
      g.pts([[8, 3], [11, 3]], K);
      g.pts([[8, 4], [11, 4]], C.white);
      g.maw(8, 6, 11, 8, { teeth: false });
      g.row(7, 6, 13, TH); // the shuttle through her mouth
      for (const [v, s] of [[g, -1], [g.flip(19), 1]]) {
        v.path([[6, 10], [2, 8], [-3, 10]], SK);
        for (let i = 0; i < 4; i++) v.line(-3, 10, -9, 4 + i * 4, TH); // threads from every finger
      }
    } else {
      g.pts([[8, 6], [11, 6]], vd(SK)); // head down
      g.rect(6, 1, 13, 4, TH);
      for (const v of [g, g.flip(19)]) {
        v.path([[6, 10], [3, 7], [3, 3]], SK); // hung by the wrists
        v.set(3, 2, TH);
      }
    }
  });

  be('village-priest-hollow', 'priest hollow cassock chest mouth vertical teeth vicar parson black book', (g, r) => {
    const CA = hex('#26242c'),
      SK = hex('#b8a890');
    fig(g, { top: CA, robe: CA, skin: SK, tl: 11, ll: 11, eyes: false, arms: r ? ['wide', 'wide'] : ['hold', 'hold'], claws: r ? SK : null });
    g.row(12, 6, 9, C.white); // the collar
    g.row(3, 2, 13, CA); // a shovel hat
    g.rect(5, 1, 10, 2, CA);
    if (r) {
      g.clearRect(4, 4, 11, 11);
      g.ball(5, 1, 12, 9, SK); // the head goes back
      g.row(1, 3, 13, CA);
      g.rect(6, -1, 11, 0, CA);
      g.pts([[7, 3], [10, 3]], K);
      g.rect(6, 14, 9, 30, P.MAW); // he opens down the front
      for (let y = 14; y <= 30; y += 2) {
        g.set(6, y, P.TOOTH);
        g.set(9, y + 1, P.TOOTH);
      }
      g.col(7, 20, 27, P.GUM);
      g.pat(-9, 20, ['pp.pp', 'pppKp', 'pp.pp'], { p: C.paper, K }); // the book, dropped
    } else {
      g.rect(4, 4, 11, 5, vd(SK)); // his face in the shadow of it
      g.pts([[6, 6], [9, 6]], K);
      g.row(9, 7, 8, vd(SK));
      g.rect(5, 17, 10, 20, hex('#4a2a2a')); // the book
      g.row(17, 5, 10, C.gold);
      g.col(7, 14, 30, vd(CA)); // a seam
    }
  });

  be('village-scold-bridle', 'scold bridle woman iron mask cage branks tongue bit punished gossip', (g, r) => {
    const SK = hex('#bba78c'),
      DR = hex('#5a4a44');
    fig(g, { top: DR, robe: DR, skin: SK, eyes: false, hair: hex('#4a3a2e'), hairStyle: 'long', hairLen: 16, arms: r ? ['claw', 'claw'] : ['hold', 'hold'], claws: r ? SK : null });
    g.pts([[6, 6], [9, 6]], r ? C.white : K);
    for (const x of [4, 7, 8, 11]) g.col(x, 2, r ? 8 : 11, C.iron); // the bridle
    g.row(2, 4, 11, C.iron);
    g.row(5, 4, 11, C.ironDark);
    g.rect(7, 0, 8, 1, C.iron);
    if (r) {
      g.maw(5, 9, 10, 16, { len: 1 }); // it does not keep her jaw shut any more
      g.col(4, 9, 16, SK);
      g.col(11, 9, 16, dark(SK));
      g.limb([[7, 12], [8, 18], [6, 23]], 1, 0.7, P.RAW); // the tongue, with the iron bit still on it
      g.rect(5, 23, 8, 24, C.iron);
      g.row(8, 3, 12, C.iron);
    } else {
      g.row(9, 4, 11, C.iron);
      g.rect(6, 9, 9, 10, C.ironDark); // the bit
      g.row(11, 5, 10, C.iron);
      g.rect(5, 18, 10, 19, C.straw); // her wrists tied
    }
  });

  be('village-tithe-collector', 'tithe collector tall thin man coins for eyes long fingers hat tax black coat', (g, r) => {
    const CO = hex('#201e26'),
      SK = hex('#c2b8a0');
    const v = g.at(0, 5);
    fig(v, { top: CO, legs: CO, skin: SK, tl: 13, ll: 12, eyes: false, arms: r ? [[[2, 13], [-2, 15], [-5, 20]], [[2, 13], [-3, 11], [-6, 6]]] : ['down', 'reach'] });
    for (const u of r ? [v, v.flip(15)] : [v.flip(15)]) {
      const [x, y] = u === v ? [-5, 20] : r ? [-6, 6] : [-4, 18];
      for (let i = 0; i < 4; i++) u.line(x - 1, y - 1 + i, x - 6 - (i % 2), y - 3 + i * 2, SK); // fingers like rakes
    }
    v.rect(4, 25, 11, 30, CO); // coat tails
    g.rect(5, -4, 10, 7, CO); // a tall hat
    g.row(7, 3, 12, CO);
    g.row(5, 5, 10, hex('#4a4034'));
    g.col(5, -4, 4, hex('#33303a'));
    g.rect(5, 10, 6, 11, C.gold); // pennies on his eyes
    g.rect(9, 10, 10, 11, C.gold);
    g.pts([[5, 10], [9, 10]], C.flameLight);
    if (r) {
      v.maw(6, 8, 9, 11, { teeth: C.gold, len: 1 });
      v.pts([[7, 12], [8, 14], [6, 16], [9, 19], [7, 23], [8, 27]], C.gold); // he pays out
      v.pts([[5, 36], [9, 36], [12, 36], [7, 35]], C.gold);
    } else {
      v.row(9, 6, 9, K);
      g.rect(1, 22, 3, 25, hex('#6a5a3e')); // the bag
      g.set(2, 21, C.straw);
    }
  });

  be('village-pump-thing', 'pump thing iron village pump handle arm spout vomits water hair eel', (g, r) => {
    const I = hex('#3e4a44'),
      IL = hex('#5a6a60');
    g.rect(1, 22, 10, 25, C.stoneDark);
    g.row(22, 1, 10, C.stone);
    g.rect(3, 6, 8, 22, I);
    g.col(3, 6, 22, IL);
    g.rect(2, 4, 9, 6, I);
    g.poly([[4, 1], [7, 1], [8, 4], [3, 4]], I);
    g.set(5, 0, IL);
    g.rect(2, 14, 9, 15, dark(I));
    g.rect(9, 9, 12, 11, I); // the spout
    g.rect(11, 11, 12, 12, I);
    if (r) {
      g.path([[3, 7], [-2, 3], [-4, -3]], IL); // the handle is an arm
      g.path([[3, 8], [-2, 4]], I);
      g.claws(-4, -4, 0, -1, IL, 3, 3);
      g.eye(4, 8, 2, P.YEL);
      g.set(7, 8, P.YEL);
      g.rect(11, 12, 12, 24, hex('#34566b')); // it brings up what is down there
      g.limb([[12, 14], [15, 18], [14, 23], [17, 25]], 1, 0.6, hex('#22232a'));
      g.pts([[10, 25], [14, 25], [9, 24]], hex('#9ebcc2'));
      g.maw(10, 10, 12, 11, { teeth: false });
    } else {
      g.path([[3, 7], [-1, 10], [-2, 16]], IL);
      g.path([[3, 8], [0, 10]], I);
      g.rect(-3, 16, -1, 18, IL);
      g.pts([[5, 9], [7, 9]], dark(I)); // two bolts
      g.set(12, 14, hex('#9ebcc2'));
      g.set(12, 21, hex('#9ebcc2'));
    }
  });

  be('village-goose-teeth', 'goose teeth long neck beak with teeth white bird hissing wings village green', (g, r) => {
    const WH = hex('#c9c6ba'),
      WD = hex('#8d8a84'),
      BK = hex('#b3692c');
    g.col(6, 17, 20, BK);
    g.col(9, 17, 20, BK);
    g.row(20, 5, 7, BK);
    g.row(20, 9, 11, BK);
    g.ball(1, 9, 13, 18, WH, lite(WH), WD);
    g.poly([[1, 12], [-3, 9], [2, 10]], WH);
    if (r) {
      for (const v of [g, g.flip(14)]) {
        v.poly([[4, 11], [-5, 3], [-7, 8], [-3, 9], [-5, 13], [2, 15]], v === g ? WH : WD); // wings out
        v.line(3, 11, -5, 4, lite(WH));
      }
      g.limb([[10, 11], [12, 2], [9, -6], [11, -12]], 1.6, 1.3, WH, WD); // far too much neck
      g.ball(9, -17, 14, -11, WH, lite(WH), WD);
      g.set(11, -15, P.RED);
      g.rect(14, -16, 18, -15, BK); // and teeth in the beak
      g.rect(14, -11, 17, -11, dark(BK));
      g.rect(14, -14, 17, -12, P.MAW);
      g.teeth(-14, 14, 17, P.TOOTH, 2, 1, 1);
      g.teeth(-12, 15, 17, P.TOOTH, 2, 1, -1);
      g.row(-13, 14, 16, P.RAW);
    } else {
      g.path([[4, 12], [8, 14], [11, 12]], WD);
      g.limb([[11, 11], [14, 6], [12, 2]], 1.5, 1.3, WH, WD);
      g.ball(10, -2, 15, 4, WH, lite(WH), WD);
      g.set(12, 0, K);
      g.rect(15, 1, 18, 2, BK);
      g.pts([[15, 3], [17, 3]], P.TOOTH); // a saw edge to the beak
    }
  });

  be('village-gibbet-walker', 'gibbet walker iron cage corpse hanged man bones chain walking crossroads', (g, r) => {
    const I = C.iron,
      B = C.bone;
    g.path([[7, 0], [8, -4], [7, -8]], C.steel); // the chain it hung by
    if (r) g.path([[7, -8], [3, -11], [-2, -9], [-5, -12]], C.steel);
    g.rect(5, 30, 6, 38, hex('#5a5648')); // its own legs, out of the bottom
    g.rect(9, 30, 10, 38, hex('#4a4638'));
    g.rect(4, 38, 6, 39, B);
    g.rect(9, 38, 11, 39, B);
    g.rect(3, 12, 12, 29, P.MAW);
    g.ball(4, 2, 11, 11, B); // the skull in the head hoop
    g.rect(5, 5, 6, 7, K);
    g.rect(9, 5, 10, 7, K);
    g.set(7, 8, vd(B));
    ribs(g, 5, 14, 10, 22, B, P.MAW);
    g.rect(6, 24, 9, 28, hex('#5a5648'));
    if (r) {
      g.pts([[5, 6], [9, 6]], P.RED);
      g.maw(5, 9, 10, 12, { len: 1 });
    } else g.teeth(10, 5, 10, vd(B), 2, 1, 1);
    for (const x of [3, 7, 8, 12]) g.col(x, 0, 30, x === 7 || x === 8 ? I : C.ironDark); // the cage
    for (const y of [1, 12, 21, 30]) g.row(y, 3, 12, I);
    g.rect(6, -1, 9, 0, I);
    g.col(3, 0, 30, C.steel);
    if (r)
      for (const v of [g, g.flip(15)]) {
        v.path([[4, 15], [-2, 13], [-6, 17]], B); // arms through the bars
        v.claws(-7, 18, -1, 1, B, 3, 3);
      }
  });

  /* ================= vermin and small things ================= */
  be('village-plague-rats', 'plague rats swarm carpet of rats tails red eyes vermin small many', (g, r) => {
    const R1 = hex('#4a423e'),
      R2 = hex('#625852');
    const top = (x) => (r ? 8 - Math.round(7 * Math.exp(-((x - 15) ** 2) / 30)) : 6) + (x % 3 === 0 ? 1 : 0);
    for (let x = 1; x <= 22; x++) for (let y = top(x); y <= 10; y++) g.set(x, y, (x + y * 2) % 5 < 2 ? R2 : R1);
    for (let x = 2; x <= 21; x += 3) g.set(x, top(x) - 1, R2); // ears and backs
    for (const [x, y] of [[4, 8], [9, 7], [13, 9], [18, 8], [21, 9], [7, 10]]) g.set(x, y, r ? P.RED : K);
    if (r) {
      g.pts([[13, 3], [16, 2], [15, 5], [18, 4]], P.RED); // the wave of them
      g.pts([[17, 6], [19, 6]], P.TOOTH);
      g.path([[12, 2], [10, -1], [11, -3]], P.RAW);
    }
    g.path([[1, 9], [-2, 8], [-4, 9]], P.RAW); // tails
    g.path([[22, 10], [25, 9], [26, 10]], P.RAW);
    g.path([[5, 6], [4, 3], [6, 2]], P.RAW);
    g.pts([[10, 9], [16, 9]], P.SICK); // they are not well
  });

  be('village-hand-of-glory', 'hand of glory severed hand candle fingers flame thief charm small vermin eye palm', (g, r) => {
    const H = hex('#a89a7c'),
      HD = hex('#7a6c54');
    g.rect(3, 8, 7, 12, H); // it stands on the wrist
    g.row(12, 3, 7, C.blood);
    g.ball(1, 3, 9, 9, H, lite(H), HD);
    const f = r ? [[0, -4], [2, -6], [5, -7], [8, -6], [11, -2]] : [[1, 1], [3, 0], [5, -5], [7, 1], [9, 4]];
    f.forEach(([x, y], i) => {
      g.line(1 + i * 2, 4, x, y, i % 2 ? HD : H);
      if (r || i === 2) {
        g.set(x, y - 1, C.flameLight); // each finger burns like a candle
        g.set(x, y - 2, C.flame);
      }
    });
    if (r) g.eye(4, 5, 3, P.EYE);
    else g.row(6, 4, 6, HD);
  });

  be('village-turnip-lantern', 'turnip lantern carved face candle glow roots crawling halloween small vermin', (g, r) => {
    const T = hex('#c4b8a0'),
      TP = hex('#7a5a78'),
      up = r ? -4 : 0;
    if (r) for (const s of [-1, 1]) for (let i = 0; i < 2; i++) g.path([[5 + s * 3, 8 + up], [5 + s * (6 + i * 2), 7 + up + i], [5 + s * (7 + i * 2), 11]], hex('#a89a80')); // it gets up on its roots
    g.ball(0, 1 + up, 10, 10 + up, T, lite(T), dark(T));
    g.rect(1, 1 + up, 9, 3 + up, TP); // purple at the top
    g.row(up, 3, 7, TP);
    g.path([[5, up], [4, up - 2], [6, up - 3]], C.leafLight);
    const glow = r ? C.flameLight : C.flame;
    g.pts([[3, 5 + up], [7, 5 + up]], glow);
    g.pts([[2, 4 + up], [8, 4 + up]], r ? C.flame : vd(T));
    if (r) g.maw(2, 7 + up, 8, 9 + up, { col: C.flame, teeth: T });
    else {
      g.row(8, 3, 7, glow);
      g.pts([[3, 8], [5, 8], [7, 8]], vd(T));
      g.path([[5, 10], [6, 11]], hex('#a89a80'));
    }
  });

  be('village-boot-biter', 'boot biter old shoe sole mouth nails teeth cobbler small vermin leather', (g, r) => {
    const L = hex('#4a3626'),
      LL = hex('#6a5038'),
      o = r ? 3 : 0;
    g.rect(1, 0, 5, 7, L); // the leg of the boot
    g.col(1, 0, 7, LL);
    g.row(0, 1, 5, LL);
    g.poly([[1, 5 - o], [8, 5 - o], [12, 7 - o], [12, 8 - o], [1, 8 - o]], L);
    g.row(5 - o, 5, 8, LL);
    g.rect(1, 9, 12, 10, vd(L)); // the sole
    g.rect(1, 9 - (r ? 0 : 0), 3, 10, vd(L));
    if (r) {
      g.rect(4, 6, 12, 8, P.MAW);
      g.teeth(6, 5, 12, C.steel, 2, 1, 1); // cobbler's nails
      g.teeth(8, 6, 12, C.steel, 2, 1, -1);
      g.limb([[5, 7], [10, 8], [14, 6]], 1, 0.7, P.RAW); // the tongue of it
      g.path([[4, 1], [7, -2], [6, -4]], C.straw); // laces
      g.path([[3, 1], [1, -3]], C.straw);
      g.set(3, 3, P.YEL);
    } else {
      g.pts([[3, 2], [3, 4]], C.brass); // eyelets
      g.path([[4, 2], [6, 3]], C.straw);
      g.pts([[7, 8], [9, 8], [11, 8]], C.steel);
    }
  });

  be('village-poppet-pins', 'poppet pins cloth doll witch pins button eyes stitched curse small vermin', (g, r) => {
    const CL = hex('#a89a7c'),
      CD = hex('#7a6c54');
    if (r) {
      g.rect(2, 9, 3, 12, CL);
      g.rect(5, 9, 6, 12, CD);
      for (const v of [g, g.flip(8)]) v.path([[2, 5], [0, 3], [-1, 0]], CL);
    } else {
      g.rect(1, 10, 3, 11, CL); // sat against nothing
      g.rect(5, 10, 7, 11, CD);
      for (const v of [g, g.flip(8)]) v.path([[2, 5], [0, 7], [0, 9]], CL);
    }
    g.rect(2, 4, 6, 9, CL);
    g.col(6, 4, 9, CD);
    g.ball(1, -1, 7, 4, CL, lite(CL), CD);
    g.set(3, 1, K); // button eyes
    g.set(6, 1, r ? P.RED : K);
    g.set(4, 6, C.blood);
    g.line(8, 4, 5, 6, C.steel); // pins
    g.line(0, 9, 3, 7, C.steel);
    g.line(4, -3, 4, -1, C.steel);
    g.pts([[8, 3], [0, 10], [4, -4]], C.bone);
    if (r) {
      g.rect(3, 3, 5, 3, P.MAW); // the stitches give
      g.pts([[3, 2], [5, 2]], C.steel);
      g.line(-1, -1, -3, -5, C.steel); // and it has pulled one out
      g.set(-1, -1, C.bone);
    } else g.pts([[3, 3], [5, 3]], CD);
  });

  be('village-dove-knot', 'dove knot dovecote birds fused three heads wings white pigeon small vermin', (g, r) => {
    const W = hex('#c9c6ba'),
      WD = hex('#8d8a84');
    g.pts([[4, 11], [6, 11], [9, 11], [11, 11]], hex('#b98a86')); // feet, some of them
    if (r) {
      g.poly([[3, 5], [-4, -2], [-5, 3], [0, 6]], W);
      g.poly([[12, 5], [19, -2], [20, 3], [15, 6]], WD);
      g.poly([[7, 3], [6, -6], [9, -6], [9, 3]], W); // a wing where no wing goes
      g.line(-3, -1, 3, 5, WD);
    }
    g.ball(1, 3, 14, 10, W, lite(W), WD);
    const heads = r ? [[2, -1], [8, -3], [13, 0]] : [[2, 2], [7, 1], [12, 3]];
    heads.forEach(([x, y], i) => {
      g.ball(x - 1, y - 1, x + 2, y + 2, W, lite(W), WD);
      g.set(x + 1, y, r ? P.RED : K);
      g.set(x + (i === 0 ? -2 : 3), y + 1, hex('#b3692c'));
      if (r) g.set(x + (i === 0 ? -2 : 3), y + 2, hex('#b3692c'));
    });
    g.path([[4, 6], [7, 8], [11, 6]], WD);
    g.pts([[5, 8], [10, 9]], WD);
  });

  be('village-eel-barrel', 'eel barrel tavern cask eels teeth pouring black wet small vermin', (g, r) => {
    const W = C.wood,
      E = hex('#2e3430'),
      EL = hex('#4a5448');
    if (r) {
      g.limb([[4, 2], [1, -5], [3, -11]], 1.3, 1, E, K); // up they come
      g.limb([[7, 2], [9, -4], [7, -8]], 1.3, 1, EL, E);
      g.limb([[9, 3], [14, 0], [15, -6]], 1.2, 1, E, K);
      for (const [x, y] of [[3, -12], [7, -9], [15, -7]]) {
        g.set(x, y, P.TOOTH);
        g.set(x - 1, y + 1, P.YEL);
      }
    } else g.limb([[5, 2], [8, 0], [10, 2]], 1.2, 1.1, E, K); // something turns over in it
    g.ball(0, 1, 11, 15, W, C.woodLight, C.woodDark);
    g.rect(1, 2, 10, 2, vd(W));
    for (const x of [3, 6, 9]) g.col(x, 3, 14, C.woodDark);
    g.row(5, 0, 11, C.iron);
    g.row(11, 0, 11, C.iron);
    g.rect(5, 8, 6, 9, K); // the bung is out
    if (r) g.col(5, 10, 15, hex('#34566b'));
    else g.set(6, 10, hex('#5d7f8c'));
  });

  be('village-cheese-crawler', 'cheese crawler wheel of cheese maggots holes eyes wedge mouth small vermin', (g, r) => {
    const CH = hex('#c9a84a'),
      RD = hex('#8a6a2a'),
      up = r ? -3 : 0;
    if (r) for (let x = 1; x <= 12; x += 2) g.col(x, 7 + up, 8, hex('#d8d0b8')); // it goes on maggots
    g.rect(0, 2 + up, 13, 7 + up, CH);
    g.oval(0, up, 13, 4 + up, lite(CH));
    g.row(7 + up, 0, 13, RD);
    g.col(0, 3 + up, 7 + up, RD);
    g.rect(1, 4 + up, 2, 5 + up, RD); // holes
    g.set(5, 6 + up, RD);
    g.rect(11, 5 + up, 12, 5 + up, RD);
    g.poly([[6, 2 + up], [10, 1 + up], [9, 7 + up], [7, 7 + up]], vd(RD)); // the cut
    if (r) {
      g.teeth(3 + up, 7, 9, P.TOOTH, 1, 1, 1);
      g.teeth(6 + up, 7, 9, P.TOOTH, 2, 1, -1);
      g.set(1, 4 + up, P.EYE);
      g.set(11, 5 + up, P.EYE);
      g.pts([[14, 6], [-2, 7]], hex('#d8d0b8'));
    } else g.pts([[4, 7], [12, 8]], hex('#d8d0b8'));
  });
  /* MORE */
};
