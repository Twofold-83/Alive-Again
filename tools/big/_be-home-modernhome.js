/* What lives in an ordinary house (see be-home.js): mk(slug, name, w, h, draw(g, roused), { w, h, dx, dy }). */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd }, { P, vd, curve }, mk) => {
  const { PALE, ASHEN, DEAD, SICK, BRUISE, RAW, GUM, MOUTH, EYE, YEL, REDEYE, TOOTH, HAIR, WET, MOULD, GREY, PLASTIC, LAMP } = P;
  const SHADE = hex('#26222c'); // a body kept in the dark

  /* ---------- the thing behind the sofa ---------- */
  mk('sofa-lurker', 'thing behind the sofa lurker long arms pale fingers eyes monster large', 46, 24, (g, r) => {
    const S = hex('#66705a'),
      SK = DEAD;
    if (r) {
      g.poly([[17, 7], [20, -6], [25, -6], [28, 7]], SHADE); // it stands up behind the back
      g.row(-6, 17, 28, SHADE);
      g.ball(19, -15, 26, -5, SK); // a long head
      g.rect(20, -12, 21, -11, K);
      g.rect(24, -12, 25, -11, K);
      g.set(21, -12, YEL);
      g.set(24, -12, YEL);
      g.maw(20, -9, 25, -6, { step: 1 });
      g.pts([[21, -15], [24, -15], [19, -13], [26, -12]], HAIR);
    } else {
      g.oval(18, 1, 27, 9, SHADE); // only the top of its head
      g.eye(20, 4, 2, 1, 1);
      g.eye(24, 4, 2, 1, 0);
    }
    g.rect(5, 6, 40, 15, S); // the back
    g.row(6, 5, 40, lite(S));
    g.col(22, 7, 14, dark(S));
    g.rect(8, 15, 37, 19, lite(S)); // seat cushions
    g.row(19, 8, 37, dark(S));
    g.col(22, 15, 19, dark(S));
    g.row(15, 8, 37, mix(S, 1.35));
    for (const v of [g, g.flip(45)]) {
      v.rect(2, 11, 7, 21, S); // arms
      v.row(11, 3, 6, lite(S));
      v.clear(2, 11);
      v.clear(7, 11);
      v.col(7, 12, 21, dark(S));
      v.rect(4, 22, 5, 22, C.woodDark);
    }
    g.rect(8, 20, 37, 21, dark(S));
    if (r) {
      g.limb([[17, -5], [9, -10], [10, 11]], SHADE, 2); // the arms come over
      g.limb([[28, -5], [37, -10], [35, 11]], SHADE, 2);
      g.hand(10, 12, 'd', SK, 3);
      g.hand(34, 12, 'd', SK, 3);
    } else {
      for (const x0 of [11, 31]) {
        g.col(x0, 5, 7, SK); // fingers over the back
        g.col(x0 + 1, 5, 8, SK);
        g.col(x0 + 2, 5, 8, dark(SK));
        g.col(x0 + 3, 5, 7, SK);
      }
    }
  }, { h: 40 });

  /* ---------- the washing machine with a mouth ---------- */
  mk('washer-maw', 'washing machine mouth teeth porthole laundry tongue monster appliance', 20, 24, (g, r) => {
    const W = PLASTIC;
    g.box(2, 2, 17, 21, W);
    g.rect(2, 2, 17, 5, dark(W)); // the panel
    g.row(2, 2, 17, W);
    g.rect(4, 3, 7, 4, C.stoneDark); // the drawer
    g.rect(3, 22, 4, 22, C.ironDark);
    g.rect(15, 22, 16, 22, C.ironDark);
    g.oval(4, 7, 15, 18, C.steel); // the door ring
    g.oval(5, 8, 14, 17, C.ironDark);
    if (r) {
      g.oval(5, 8, 14, 17, MOUTH);
      for (let a = 0; a < 12; a++) {
        const x = 9.5 + Math.cos((a * Math.PI) / 6) * 4.2,
          y = 12.5 + Math.sin((a * Math.PI) / 6) * 4.2;
        g.set(x, y, TOOTH); // teeth all round
      }
      g.worm([[9, 14], [8, 18], [5, 20], [1, 21]], 1.8, 1.2, RAW, GUM); // a tongue of wet washing
      g.set(4, 20, C.white);
      g.orb(11, 3, 1, [0, 0], K, YEL); // the dials look at you
      g.orb(15, 3, 1, [0, 0], K, YEL);
      g.rect(18, 8, 22, 17, C.steel); // the door thrown open
      g.rect(19, 9, 21, 16, C.glass);
      g.col(19, 10, 14, C.glassLight);
    } else {
      g.oval(6, 9, 13, 16, hex('#1c2a30')); // dark water behind the glass
      g.pts([[7, 10], [6, 11]], C.glassLight);
      g.pts([[8, 12], [11, 12]], dark(YEL)); // two dull eyes in the drum
      g.rect(9, 17, 10, 20, C.white); // a sock caught in the door
      g.set(9, 21, dark(C.white));
      g.set(11, 3, C.iron);
      g.set(15, 3, C.iron);
    }
  }, { w: 26, dx: 2 });

  /* ---------- the family portrait that climbed out ---------- */
  mk('portrait-family', 'family portrait climbed out of frame painting faces legs walking picture ghost', 22, 30, (g, r) => {
    const F = C.gold,
      BG = hex('#3a3028');
    g.leg(6, 19, 27, C.black, -1); // it walks on father's legs
    g.leg(13, 19, 27, C.black, 1);
    g.box(2, 2, 19, 20, F);
    g.rect(4, 4, 17, 18, BG);
    g.frame(3, 3, 18, 19, dark(F));
    const head = (x, y, w, h, sk, hair, mouth) => {
      g.rect(x, y, x + w - 1, y + h - 1, sk);
      g.row(y - 1, x, x + w - 1, hair);
      g.set(x, y, hair);
      g.set(x + 1, y + 1, K);
      g.set(x + w - 2, y + 1, K);
      if (mouth) g.rect(x + 1, y + 3, x + w - 2, y + h - 1, MOUTH);
      else g.row(y + 3, x + 1, x + w - 2, dark(sk));
    };
    if (r) {
      head(4, 4, 5, 6, PALE, C.black, 1); // they push out of the canvas
      head(12, 5, 5, 6, PALE, C.woodDark, 1);
      head(8, 11, 5, 6, PALE, C.straw, 1);
      g.arm([[4, 12], [-1, 13], [-3, 10]], C.black, 2, 'u', PALE);
      g.arm([[17, 13], [21, 14], [23, 11]], C.wine, 2, 'u', PALE);
      g.arm([[10, 17], [9, 22], [6, 24]], PALE, 1, 'l', PALE);
    } else {
      g.rect(5, 12, 9, 18, C.black); // father, mother and the child, as painted
      g.rect(12, 12, 16, 18, C.wine);
      head(5, 6, 4, 5, PALE, C.black);
      head(12, 7, 4, 5, PALE, C.woodDark);
      g.rect(9, 14, 12, 18, C.navy);
      head(9, 11, 3, 4, PALE, C.straw);
      g.pts([[2, 10], [2, 12], [19, 9], [19, 11]], PALE); // fingers round the frame
    }
  }, { w: 32, dx: 5 });

  /* ---------- hair from the drain ---------- */
  mk('drain-hair-figure', 'hair from the drain figure wet black hair clog thing plughole monster', 16, 35, (g, r) => {
    const H = HAIR,
      H2 = hex('#3e3a44');
    g.oval(2, 31, 13, 33, WET); // the puddle and the plughole
    g.row(32, 6, 9, K);
    g.worm([[8, 32], [7, 24], [9, 16], [7, 9]], 2.6, 3, H, K); // a rope of hair, standing
    g.oval(3, 2, 11, 10, H); // the head, hanging forward
    g.strands(2, 12, 6, 12, H, 4);
    g.strands(4, 11, 14, 16, H, 9, 0.6);
    for (const [x, y, n] of [[5, 4, 9], [8, 3, 12], [10, 7, 14], [6, 14, 12], [9, 18, 9]]) g.col(x, y, y + n, H2);
    if (r) {
      g.worm([[5, 12], [-1, 10], [-4, 4]], 1.6, 0.8, H, K); // arms of hair, lifted
      g.worm([[10, 12], [16, 10], [19, 3]], 1.6, 0.8, H, K);
      g.strands(-4, 0, 5, 7, H, 5);
      g.strands(15, 19, 5, 8, H, 6);
      g.rect(5, 5, 9, 8, K); // the hair parts
      g.orb(6, 6, 1, [0, 0], K, EYE);
      g.teeth(5, 9, 8, 1, TOOTH, 1, false);
    } else {
      g.strands(1, 3, 12, 18, H, 7, 0.7); // arms hang to the floor
      g.strands(12, 14, 12, 17, H, 8, 0.7);
    }
    g.pts([[3, 30], [12, 29], [7, 30]], WET);
  }, { w: 26, dx: 5 });

  /* ---------- the fridge-light thing ---------- */
  mk('fridge-light-thing', 'fridge light thing refrigerator pale folded creature cold glow large', 19, 44, (g, r) => {
    const W = hex('#c2c4b8'),
      SK = hex('#c9d2cc'),
      IN = LAMP;
    g.box(2, 2, 16, 41, W); // the fridge
    g.rect(3, 42, 4, 42, C.ironDark);
    g.rect(14, 42, 15, 42, C.ironDark);
    if (r) {
      g.rect(3, 3, 15, 40, IN); // lit inside
      g.rect(3, 3, 15, 4, lite(IN));
      for (const y of [13, 24, 33]) g.row(y, 3, 15, dark(W));
      g.rect(17, 2, 29, 41, W); // the door, open
      g.box(17, 2, 29, 41, W);
      g.rect(19, 6, 27, 9, dark(W));
      g.rect(19, 20, 27, 23, dark(W));
      g.rect(19, 32, 27, 36, dark(W));
      g.rect(20, 30, 21, 33, C.glass);
      // the thing, unfolding
      g.poly([[5, 14], [12, 14], [13, 30], [6, 32]], SK);
      g.ball(5, 5, 12, 14, SK);
      g.rect(6, 8, 7, 10, K);
      g.rect(10, 8, 11, 10, K);
      g.rect(7, 12, 10, 13, MOUTH);
      g.limb([[11, 26], [14, 21], [12, 38]], SK, 2); // a knee
      g.limb([[6, 30], [8, 34], [5, 40]], dark(SK), 2);
      g.arm([[5, 16], [-1, 20], [-5, 32], [-6, 37]], SK, 2, 'd', SK, 3); // and an arm, out and down
      g.arm([[12, 16], [15, 19], [14, 27]], dark(SK), 1, 'd', SK);
    } else {
      g.row(14, 2, 16, dark(W));
      g.rect(13, 6, 13, 11, C.steel); // handles
      g.rect(10, 17, 10, 24, C.steel);
      g.rect(12, 15, 16, 41, K); // the lower door stands open a hand's breadth
      g.rect(14, 15, 16, 41, IN);
      g.col(13, 15, 41, dark(IN));
      g.rect(14, 22, 16, 25, K);
      g.eye(14, 23, 2, 2, 0, 1); // one eye in the crack
      g.rect(11, 30, 13, 30, SK); // fingers round the door's edge
      g.rect(11, 32, 13, 32, SK);
      g.rect(11, 34, 13, 34, SK);
      g.rect(11, 36, 13, 36, dark(SK));
      g.pts([[5, 5], [7, 6], [5, 18]], C.red); // magnets
      g.rect(8, 18, 10, 21, C.paper);
    }
  }, { w: 40, dx: 9 });

  /* ---------- the duvet with a shape under it ---------- */
  mk('duvet-shape', 'duvet blanket shape under it bed cover hidden body ghost large', 42, 16, (g, r) => {
    const D = hex('#b9b4a6'),
      ST = hex('#8e98a4'),
      SK = DEAD;
    const stripes = (x0, y0, x1, y1) => g.each(x0, y0, x1, y1, (p, x, y) => (p === D && (x + 100) % 6 === 0 && (y + 100) % 4 === 0 ? ST : null));
    if (r) {
      g.poly([[8, -4], [18, -4], [24, 8], [40, 12], [40, 13], [3, 13], [6, 4]], D); // it sits up under the cover
      g.ball(7, -15, 19, -2, D);
      g.oval(22, 6, 40, 13, D);
      stripes(2, -15, 40, 13);
      g.rect(9, -10, 11, -8, vd(D)); // hollows where a face would be
      g.rect(15, -10, 17, -8, vd(D));
      g.rect(11, -5, 15, -3, vd(D));
      g.line(8, -1, 5, 12, dark(D));
      g.line(17, -2, 22, 12, dark(D));
      g.line(12, 0, 13, 12, dark(D));
      g.arm([[6, 5], [0, 8], [-3, 11]], SK, 2, 'l', SK, 3);
      g.row(13, 3, 40, dark(D));
    } else {
      g.oval(2, 6, 40, 13, D);
      g.rect(3, 10, 39, 13, D);
      g.ball(3, 3, 12, 11, D); // the head
      g.oval(10, 5, 26, 12, D); // shoulder and hip
      g.oval(31, 5, 38, 11, D); // the feet
      stripes(2, 2, 40, 13);
      g.lit(2, 2, 40, 13);
      g.line(12, 5, 14, 12, dark(D));
      g.line(26, 7, 28, 12, dark(D));
      g.line(18, 6, 20, 12, dark(D));
      g.row(13, 3, 39, dark(D));
      g.rect(1, 12, 3, 13, SK); // a hand has slipped out
      g.pts([[1, 11], [3, 11]], SK);
      g.rect(5, 6, 6, 6, vd(D)); // two dents: it is looking
      g.rect(9, 6, 10, 6, vd(D));
    }
  }, { w: 50, h: 32, dx: 8 });

  /* ---------- the cat with a human face ---------- */
  mk('cat-human-face', 'cat with a human face pet wrong smile animal monster small', 18, 14, (g, r) => {
    const F = hex('#4a4440'),
      SK = PALE,
      a = r ? -2 : 0; // the back arches
    g.worm([[4, 8], [2, 4], [3, 1 + (r ? -1 : 0)]], 1, r ? 1.4 : 0.8, F); // tail
    g.oval(3, 5 + a, 12, 10, F);
    g.rect(4, 9, 5, 12, F); // legs
    g.rect(10, 9, 11, 12, F);
    g.rect(6, 10, 7, 12, dark(F));
    g.rect(8, 10, 9, 12, dark(F));
    g.rect(10, 3, 16, 9, F); // head
    g.pts([[10, 2], [11, 2], [15, 2], [16, 2], [10, 1], [16, 1]], F); // ears
    g.rect(11, 4, 15, 8, SK); // the face
    g.set(13, 6, dark(SK));
    if (r) {
      g.pts([[3, 4], [5, 2], [7, 2], [9, 3]], F); // hackles
      g.eye(11, 4, 2, 2, 1, 1);
      g.eye(14, 4, 2, 2, 0, 1);
      g.rect(11, 7, 15, 9, MOUTH);
      g.row(7, 11, 15, TOOTH);
      g.pts([[11, 9], [13, 9], [15, 9]], TOOTH);
    } else {
      g.set(12, 5, K);
      g.set(14, 5, K);
      g.row(7, 12, 14, GUM);
      g.pts([[11, 6], [15, 6]], dark(SK));
    }
  }, { h: 17 });

  /* ---------- the upstairs neighbour who is only legs ---------- */
  mk('upstairs-legs', 'upstairs neighbour only legs no body pyjama trousers slippers walking large', 16, 48, (g, r) => {
    const T = hex('#7e8794'),
      ST = hex('#5c6474'),
      SL = hex('#7a4a3a');
    const leg = (pts, w) => {
      g.tube(pts, w, w - 0.4, T, dark(T));
    };
    if (r) {
      leg([[5, 6], [-2, 20], [2, 30], [1, 43]], 2.3); // one leg strides out
      leg([[10, 6], [12, 24], [10, 43]], 2.3);
      g.rect(-2, 44, 3, 45, SL);
      g.rect(-4, 45, 3, 45, SL);
    } else {
      leg([[5, 6], [4, 24], [5, 43]], 2.3);
      leg([[10, 6], [11, 24], [10, 43]], 2.3);
      g.rect(2, 44, 7, 45, SL);
      g.rect(1, 45, 7, 45, SL);
    }
    g.rect(8, 44, 13, 45, SL);
    g.rect(8, 45, 14, 45, SL);
    g.each(-6, 4, 15, 43, (p, x, y) => (p === T && x % 3 === 0 ? ST : null)); // pyjama stripes
    g.rect(3, 2, 12, 6, T); // the hips, and then nothing
    g.row(2, 3, 12, C.white);
    g.row(3, 3, 12, dark(C.white));
    if (r) {
      g.rect(4, -1, 11, 2, MOUTH); // the waistband opens
      g.teeth(4, 11, 2, -1, TOOTH, 2);
      g.rect(3, -2, 4, 2, T);
      g.rect(11, -2, 12, 2, T);
      g.worm([[7, 1], [8, -3], [12, -5]], 1.2, 0.7, GUM);
    } else {
      g.pts([[7, 3], [7, 4], [8, 5]], C.white); // the cord
    }
  }, { w: 23, h: 56, dx: 6 });

  /* ---------- the vacuum-cleaner worm ---------- */
  mk('vacuum-worm', 'vacuum cleaner worm hose snake hoover nozzle mouth large long', 46, 18, (g, r) => {
    const B = hex('#8a3a34'),
      HO = hex('#5a5a62');
    const hose = r ? [[33, 10], [26, 15], [18, 12], [16, 2], [12, -8], [6, -11]] : [[33, 10], [27, 15], [20, 11], [14, 15], [9, 13]];
    const p = curve(hose, 6);
    g.tube(p, 1.7, 1.7, HO, vd(HO));
    for (let i = 1; i < p.length; i += 2) g.set(p[i][0], p[i][1] - 1, lite(HO)); // ribs
    g.ball(30, 5, 44, 15, B); // the canister
    g.rect(32, 4, 40, 5, dark(B));
    g.rect(41, 13, 44, 16, C.ironDark); // wheel
    g.rect(31, 15, 33, 16, C.ironDark);
    g.rect(35, 2, 37, 4, C.ironDark); // handle
    if (r) {
      g.orb(36, 9, 1, [-1, 0], K, YEL);
      g.orb(40, 9, 1, [-1, 0], K, YEL);
      g.poly([[7, -13], [7, -8], [0, -5], [-2, -9], [1, -14]], C.ironDark); // the nozzle head, lifted
      g.rect(-2, -9, 1, -6, MOUTH);
      g.teeth(-2, 2, -10, 1, TOOTH, 2);
      g.teeth(-1, 1, -6, -1, TOOTH, 2, false);
      g.set(4, -11, REDEYE);
      g.pts([[-4, -4], [-6, -8], [-3, -1], [-7, -3]], GREY); // dust
    } else {
      g.set(36, 9, C.ironDark);
      g.set(40, 9, C.ironDark);
      g.poly([[10, 11], [10, 15], [2, 16], [2, 14], [6, 11]], C.ironDark); // the nozzle on the floor
      g.row(16, 2, 9, K);
      g.set(8, 12, dark(REDEYE));
      g.pts([[1, 16], [1, 14]], GREY);
    }
  }, { w: 54, h: 34, dx: 8 });

  /* ---------- the coat as tall as the wardrobe ---------- */
  mk('coat-wardrobe', 'coat creature tall as a wardrobe overcoat empty hanger sleeves hands large', 22, 48, (g, r) => {
    const CT = hex('#3e3a40'),
      SK = DEAD;
    g.poly([[5, 6], [16, 6], [18, 45], [3, 45]], CT); // the long coat
    g.rect(3, 5, 18, 8, CT); // shoulders
    g.row(5, 4, 17, lite(CT));
    g.col(3, 8, 45, lite(CT));
    g.rect(8, 2, 13, 6, CT); // the collar, turned up
    g.rect(9, 3, 12, 6, K);
    if (r) {
      g.poly([[8, 9], [13, 9], [15, 44], [6, 44]], K); // it opens: there is no one in it, only hands
      for (const [x, y, d] of [[8, 14, 'r'], [12, 19, 'l'], [8, 25, 'r'], [12, 31, 'l'], [9, 37, 'r']]) g.hand(x, y, d, SK, 2);
      g.eye(10, 4, 2, 1, 0, 0, K, YEL);
      g.limb([[4, 7], [-3, 12], [-5, 22]], CT, 2); // sleeves lift
      g.limb([[17, 7], [24, 12], [25, 22]], CT, 2);
      g.rect(-6, 12, -3, 22, CT);
      g.rect(24, 12, 27, 22, dark(CT));
      g.hand(-5, 23, 'd', SK, 4);
      g.hand(25, 23, 'd', SK, 4);
    } else {
      g.col(10, 9, 45, K); // buttoned
      g.pts([[12, 12], [12, 18], [12, 24], [12, 30]], C.brass);
      g.rect(1, 7, 3, 40, CT); // sleeves to the knee and further
      g.rect(18, 7, 20, 40, dark(CT));
      g.col(1, 8, 40, lite(CT));
      g.rect(1, 41, 3, 43, SK); // fingertips
      g.rect(18, 41, 20, 43, dark(SK));
      g.pts([[1, 44], [3, 44], [18, 44], [20, 44]], SK);
      g.pts([[10, 1], [11, 1]], C.steel); // the hanger's hook
    }
    g.row(45, 3, 18, dark(CT));
    g.pts([[6, 46], [9, 46], [12, 46], [15, 46]], K);
  }, { w: 38, dx: 8 });

  /* ---------- the man with a television for a head ---------- */
  mk('tv-head', 'television head man tv set static screen face antenna monster', 18, 38, (g0, r) => {
    const g = g0.at(1, 5),
      TV = C.wood;
    g.man({ head: false, skin: PALE, top: hex('#8a8474'), legs: C.navy, tie: C.wine, shirt: C.white, arms: r ? 'reach' : 'down' });
    g.rect(7, 10, 8, 11, PALE); // the neck goes into the set
    g.box(1, -2, 14, 9, TV);
    g.rect(2, -1, 10, 8, r ? C.ghost : hex('#2e3a36')); // the screen
    g.pts([[12, 0], [12, 2]], C.brass); // knobs
    g.pts([[12, 4], [12, 6], [12, 8]], vd(TV));
    g.line(6, -3, 3, -5, C.steel); // rabbit ears
    g.line(9, -3, 12, -5, C.steel);
    if (r) {
      g.speckle(2, -1, 10, 8, C.white, 3, 4); // static, and a face in it
      g.speckle(2, -1, 10, 8, C.stone, 5, 9);
      g.rect(3, 1, 4, 2, K);
      g.rect(8, 1, 9, 2, K);
      g.rect(3, 5, 9, 6, K);
      g.pts([[4, 5], [6, 5], [8, 5], [5, 6], [7, 6]], TOOTH);
      g.pts([[2, -6], [13, -6], [1, -4]], LAMP);
    } else {
      g.line(3, 0, 5, 0, hex('#4a5a54'));
      g.set(3, 1, hex('#4a5a54'));
      g.set(9, 7, dark(REDEYE)); // the standby light
    }
  }, { w: 30, dx: 6 });

  /* ---------- the mould that walks ---------- */
  mk('mould-walker', 'mould that walks black mold damp fungus figure spores rot monster', 18, 32, (g, r) => {
    const M = MOULD,
      F = hex('#7c8a6a'),
      BL = hex('#aab09a');
    g.tube([[6, 20], [5, 29]], 2.2, 2.6, M);
    g.tube([[11, 20], [12, 29]], 2.2, 2.6, M);
    g.row(29, 2, 15, dark(M)); // it leaves a foot of itself behind
    g.ball(4, 9, 13, 23, M);
    g.ball(5, 2, 12, 10, M);
    if (r) {
      g.worm([[5, 12], [-1, 9], [-3, 2]], 2, 1.2, M);
      g.worm([[12, 12], [18, 9], [20, 2]], 2, 1.2, M);
      g.drips(-3, 1, 6, M, 3, 4, 2);
      g.drips(17, 20, 6, M, 4, 4, 2);
      g.rect(8, 11, 9, 21, MOUTH); // it splits down the front
      g.col(7, 12, 20, MOUTH);
      g.pts([[7, 12], [7, 15], [7, 18], [10, 13], [10, 16], [10, 19]], BL);
      g.pts([[3, 0], [14, -1], [8, -1], [16, 3], [1, 4]], SICK); // spores
    } else {
      g.tube([[4, 12], [2, 22]], 1.8, 1.4, M);
      g.tube([[13, 12], [15, 22]], 1.8, 1.4, M);
      g.drips(1, 3, 23, M, 3, 3, 2);
      g.drips(14, 16, 23, M, 4, 3, 2);
    }
    g.speckle(-3, 0, 20, 29, F, 7, 3);
    g.speckle(2, 3, 15, 28, K, 9, 8);
    for (const [x, y] of [[6, 13], [11, 17], [9, 25], [10, 4], [4, 20]]) {
      if (r && x > 6 && x < 11 && y > 10 && y < 22) continue;
      g.rect(x, y, x + 1, y, BL); // pale blooms
      g.set(x, y + 1, F);
    }
    g.set(7, 6, r ? YEL : BL);
    g.set(10, 6, r ? YEL : BL);
  }, { w: 28, dx: 5 });

  /* ---------- small things ---------- */
  mk('sock-eater', 'sock eater worm lost sock laundry lamprey mouth vermin small', 14, 8, (g, r) => {
    const S = hex('#b9b4a6'),
      ST = hex('#8a4a50');
    const p = r ? [[2, 5], [7, 5], [9, 0], [8, -4]] : [[2, 5], [6, 4], [11, 5]];
    g.worm(p, 1.7, 1.7, S);
    g.each(0, -6, 13, 7, (q, x, y) => (q === S && (r && y < 3 ? y : x) % 3 === 0 ? ST : null));
    if (r) {
      g.oval(6, -6, 10, -3, MOUTH); // the cuff is a mouth
      g.pts([[6, -5], [8, -6], [10, -5], [7, -3], [9, -3]], TOOTH);
      g.set(8, -4, GUM);
    } else {
      g.col(12, 4, 6, vd(S));
      g.set(9, 3, K); // an eye, shut
    }
    g.set(1, 5, dark(S));
  }, { h: 15 });

  mk('dust-bunny', 'dust bunny fluff ball under the bed eyes teeth lint vermin small', 12, 9, (g, r) => {
    const D = GREY;
    if (r) {
      g.ball(0, -3, 11, 6, D);
      g.pts([[-1, -1], [12, 0], [3, -4], [8, -4], [-1, 4], [12, 4], [5, -5]], D); // it bristles
      g.rect(3, 2, 8, 4, MOUTH);
      g.teeth(3, 8, 2, 1, TOOTH, 1, false);
      g.pts([[4, 4], [6, 4], [8, 4]], TOOTH);
      g.eye(3, -1, 2, 2, 1, 1, K, YEL);
      g.eye(7, -1, 2, 2, 0, 1, K, YEL);
    } else {
      g.ball(2, 2, 9, 6, D);
      g.pts([[1, 4], [10, 3], [4, 1], [7, 1]], D);
      g.set(4, 4, K);
      g.set(7, 4, K);
    }
    g.speckle(-1, -4, 12, 6, dark(D), 5, 4);
    g.pts([[3, 7], [8, 7]], dark(D));
    g.pts([[1, 6], [10, 6]], hex('#a8a49c')); // a hair it has gathered
  }, { w: 16, h: 14, dx: 2 });

  mk('silverfish-swarm', 'silverfish swarm insects bathroom vermin hand shape crawling small', 18, 8, (g, r) => {
    const S = C.steel;
    const fish = (x, y, d = 1) => {
      g.row(y, x, x + 2, S);
      g.set(d > 0 ? x + 2 : x, y, lite(S));
      g.set(d > 0 ? x - 1 : x + 3, y, dark(C.iron));
    };
    const fishV = (x, y) => {
      g.col(x, y, y + 2, S);
      g.set(x, y, lite(S));
      g.set(x, y + 3, dark(C.iron));
    };
    if (r) {
      // they heap themselves into a hand
      for (const [x, y] of [[7, 1], [9, 1], [7, -3], [9, -3], [8, -7], [6, -8], [10, -8]]) fishV(x, y);
      for (const [x, y] of [[5, -12], [8, -13], [11, -12], [5, -16], [8, -17], [11, -16]]) fishV(x, y);
      fishV(13, -9);
      fish(11, -6);
      fish(3, 5);
      fish(12, 5, -1);
      fish(6, 4);
      g.pts([[6, -4], [10, -5], [7, -9], [9, -9]], dark(C.iron));
    } else {
      for (const [x, y, d] of [[2, 2, 1], [8, 1, 1], [13, 3, -1], [4, 4, -1], [10, 4, 1], [6, 6, 1], [13, 6, 1], [2, 6, -1], [8, 3, -1]]) fish(x, y, d);
    }
  }, { h: 26 });

  mk('plughole-eye', 'plughole eye stalk drain sink slime watching vermin small', 12, 12, (g, r) => {
    const SL = hex('#5a6a5a');
    g.oval(2, 8, 9, 10, C.steel);
    g.row(9, 4, 7, K);
    g.worm(r ? [[5, 9], [4, 4], [6, -2]] : [[5, 9], [4, 6], [6, 4]], 1.3, 1, SL);
    if (r) {
      g.worm([[4, 9], [1, 5], [-1, 1]], 1, 0.8, SL);
      g.worm([[7, 9], [10, 5], [11, 2]], 1, 0.8, SL);
      g.orb(-1, 0, 1, [0, 0], K, EYE);
      g.orb(11, 1, 1, [0, 0], K, EYE);
      g.orb(6, -3, 2, [-1, 0], YEL);
      g.pts([[3, 9], [8, 9], [5, 10]], TOOTH);
    } else {
      g.orb(6, 3, 2, [0, 0], hex('#6a7a4a'));
    }
  }, { w: 16, h: 18, dx: 2 });

  /* ---------- the standard lamp that follows ---------- */
  mk('lamp-stalker', 'standard lamp stalker floor lamp walks shade head bulb teeth thing', 16, 40, (g, r) => {
    const SH = hex('#b5a47c'),
      PO = C.brass;
    g.rect(7, 11, 8, 31, PO); // the pole
    g.col(8, 11, 31, dark(PO));
    g.limb([[7, 30], [3, 33], [2, 37]], C.ironDark, 2); // three feet, jointed
    g.limb([[8, 30], [12, 33], [13, 37]], C.ironDark, 2);
    g.col(7, 32, 37, C.ironDark);
    if (r) {
      g.poly([[8, -3], [14, 0], [13, 8], [3, 5]], SH); // the shade tips back like a hood
      g.line(8, -3, 3, 5, lite(SH));
      g.ball(4, 6, 11, 12, LAMP);
      g.set(6, 8, K);
      g.set(9, 8, K);
      g.rect(5, 11, 10, 13, MOUTH);
      g.teeth(5, 10, 11, 1, TOOTH, 1, false);
      g.pts([[5, 13], [7, 13], [9, 13]], TOOTH);
      g.arm([[7, 18], [1, 21], [-2, 17]], C.ironDark, 1, 'u', C.ironDark, 3);
      g.arm([[8, 18], [14, 21], [16, 17]], C.ironDark, 1, 'u', C.ironDark, 3);
    } else {
      g.poly([[5, 2], [10, 2], [13, 10], [2, 10]], SH);
      g.line(5, 2, 2, 10, lite(SH));
      g.row(10, 2, 13, dark(SH));
      g.row(11, 4, 11, K); // dark under the shade
      g.set(6, 11, YEL);
      g.set(9, 11, YEL);
      g.pts([[9, 14], [9, 15]], C.ironDark); // the pull-cord
      g.set(9, 16, C.brass);
    }
  }, { w: 24, h: 43, dx: 4 });

  /* ---------- the one who never left the bath ---------- */
  mk('bathtub-soaker', 'bathtub soaker drowned bloated bather in the bath wet hair arms large long', 46, 22, (g, r) => {
    const W = hex('#cfcdc0'),
      BL = hex('#9aa89a');
    if (r) {
      g.poly([[5, 2], [17, 2], [19, 10], [4, 10]], BL); // it sits up
      g.ball(5, -10, 16, 2, BL);
      g.strands(4, 17, -9, 14, HAIR, 5, 0.3);
      g.rect(7, -5, 14, 1, BL);
      g.rect(8, -5, 9, -4, K);
      g.rect(12, -5, 13, -4, K);
      g.rect(9, -2, 12, 1, MOUTH);
      g.col(10, 0, 9, C.water); // the bath runs out of its mouth
      g.col(11, 1, 9, C.glass);
    } else {
      g.ball(7, 4, 14, 12, BL); // the top of a head
      g.strands(6, 15, 4, 4, HAIR, 5, 0.3);
      g.eye(8, 7, 2, 1, 1);
      g.eye(12, 7, 2, 1, 0);
      g.ball(27, 5, 33, 13, BL); // a knee
    }
    g.rect(40, 4, 41, 9, C.steel); // the tap
    g.row(4, 37, 41, C.steel);
    g.set(37, 5, C.steel);
    g.rect(2, 10, 43, 18, W);
    g.rect(3, 19, 42, 19, dark(W));
    g.row(9, 1, 44, lite(W));
    g.row(10, 2, 43, mix(W, 0.9));
    g.clear(2, 18);
    g.clear(43, 18);
    g.rect(4, 20, 6, 20, C.ironDark);
    g.rect(39, 20, 41, 20, C.ironDark);
    if (r) {
      g.arm([[4, 4], [0, 8], [1, 16]], BL, 2, 'd', BL, 3); // both arms over the side
      g.arm([[18, 4], [23, 8], [23, 16]], BL, 2, 'd', BL, 3);
      g.drips(2, 30, 11, C.water, 4, 5, 4);
    } else {
      g.rect(20, 8, 22, 15, BL); // one arm hangs over the rim
      g.col(22, 9, 15, dark(BL));
      g.pts([[20, 16], [22, 16], [21, 17]], BL);
      g.set(37, 6, C.water);
    }
  }, { h: 34 });

  /* ---------- whoever stands behind the curtain ---------- */
  mk('curtain-stander', 'curtain stander someone behind the curtain feet fingers hidden tall thin thing large', 20, 48, (g, r) => {
    const CU = hex('#6a3a40'),
      SK = hex('#8f958c');
    g.row(2, 1, 18, C.brass);
    g.pts([[1, 1], [18, 1]], C.brass);
    const folds = (x0, x1) => {
      g.rect(x0, 3, x1, 44, CU);
      for (let x = x0; x <= x1; x++) if ((x - x0) % 3 === 0) g.col(x, 4, 44, lite(CU));
        else if ((x - x0) % 3 === 2) g.col(x, 4, 44, dark(CU));
      for (let x = x0 + 1; x <= x1; x += 3) g.set(x, 2, C.ironDark);
    };
    if (r) {
      // the tall thin thing that stood there
      g.poly([[10, 13], [16, 13], [15, 44], [11, 44]], SHADE);
      g.ball(9, 3, 16, 13, SK);
      g.rect(10, 6, 11, 8, K);
      g.rect(14, 6, 15, 8, K);
      g.set(11, 7, YEL);
      g.set(14, 7, YEL);
      g.row(10, 10, 15, K);
      g.pts([[10, 10], [12, 10], [14, 10]], TOOTH);
      g.set(9, 9, K);
      g.set(16, 9, K);
      g.limb([[16, 15], [19, 22], [18, 36]], SHADE, 2);
      g.hand(18, 37, 'd', SK, 4);
      folds(2, 8); // the curtain, swept aside
      g.limb([[10, 15], [7, 20], [8, 24]], SHADE, 2);
      g.hand(7, 24, 'l', SK, 3);
    } else {
      folds(3, 16);
      g.each(6, 7, 12, 40, (p) => mix(p, 1.12)); // the cloth stands out over something
      g.oval(6, 6, 12, 12, lite(CU));
      g.rect(16, 20, 17, 20, SK); // fingers at the edge
      g.rect(16, 22, 17, 22, SK);
      g.rect(16, 24, 17, 24, SK);
      g.rect(16, 26, 17, 26, dark(SK));
    }
    g.rect(r ? 10 : 5, 45, r ? 12 : 7, 46, SK); // bare feet under the hem
    g.rect(r ? 14 : 10, 45, r ? 16 : 12, 46, SK);
    g.set(r ? 9 : 4, 46, SK);
    g.set(r ? 17 : 13, 46, SK);
  }, { w: 24 });

  /* ---------- the reflection that comes out ---------- */
  mk('mirror-twin', 'mirror twin reflection climbs out of the mirror cheval glass double ghost', 18, 38, (g, r) => {
    const F = C.wood,
      GL = hex('#6f8f98'),
      SK = hex('#b9c4c0');
    g.col(2, 12, 35, F); // the stand
    g.col(15, 12, 35, dark(F));
    g.row(35, 1, 4, F);
    g.row(35, 13, 16, dark(F));
    g.oval(3, 2, 14, 30, F);
    g.oval(4, 3, 13, 29, GL);
    g.line(5, 8, 7, 4, C.glassLight);
    if (r) {
      g.line(9, 4, 11, 9, C.white); // the glass gives
      g.line(11, 9, 10, 12, C.white);
      g.line(5, 20, 7, 23, C.white);
      g.rect(5, 16, 12, 26, hex('#3a4650'));
      g.rect(7, 14, 10, 15, dark(SK));
      g.face(5, 6, SK, 'gape', K);
      g.row(5, 5, 12, HAIR);
      g.row(6, 5, 6, HAIR);
      g.arm([[5, 18], [0, 16], [-3, 12]], hex('#3a4650'), 2, 'u', SK, 3);
      g.arm([[12, 18], [17, 20], [19, 26]], hex('#3a4650'), 2, 'd', SK, 3);
    } else {
      g.rect(5, 18, 12, 27, hex('#4a5a64')); // someone in the glass who is not in the room
      g.rect(7, 16, 10, 17, mix(SK, 0.8));
      g.face(5, 8, mix(SK, 0.85), 'stare', K);
      g.row(7, 5, 12, HAIR);
      g.row(8, 5, 6, HAIR);
      g.rect(4, 22, 5, 23, SK); // a palm laid flat against it
      g.set(4, 21, SK);
    }
  }, { w: 28, dx: 6 });

  /* ---------- the armchair he sat in too long ---------- */
  mk('armchair-sitter', 'armchair sitter old man grown into his chair upholstery face mouth cushion', 24, 26, (g, r) => {
    const U = hex('#7a5a4a'),
      SK = hex('#a8846c');
    g.rect(4, 4, 19, 17, U); // the back
    g.row(2, 6, 17, U);
    g.row(3, 5, 18, U);
    g.row(2, 7, 16, lite(U));
    g.rect(7, 5, 16, 14, SK); // his face, in the stuffing
    g.row(4, 8, 15, SK);
    g.set(12, 10, dark(SK));
    g.col(16, 6, 13, dark(SK));
    g.rect(6, 21, 17, 22, dark(U));
    g.rect(5, 23, 6, 23, C.woodDark);
    g.rect(17, 23, 18, 23, C.woodDark);
    if (r) {
      g.eye(8, 7, 3, 2, 1, 1);
      g.eye(13, 7, 3, 2, 1, 1);
      g.row(12, 9, 14, K);
      g.rect(6, 15, 17, 20, MOUTH); // the seat opens
      g.teeth(6, 17, 15, 1, TOOTH, 2);
      g.teeth(7, 17, 20, -1, TOOTH, 2);
      g.rect(10, 18, 13, 19, GUM);
      for (const v of [g, g.flip(23)]) {
        v.poly([[3, 14], [6, 12], [1, 3], [-2, 5]], U); // the arms come up
        v.line(-2, 5, 3, 14, lite(U));
        v.hand(-2, 2, 'u', SK, 3);
      }
    } else {
      g.row(8, 8, 10, vd(SK)); // asleep
      g.row(8, 13, 15, vd(SK));
      g.row(12, 10, 13, vd(SK));
      g.pts([[8, 6], [14, 6], [8, 11], [15, 11]], dark(SK));
      g.rect(6, 16, 17, 20, lite(U)); // the seat
      g.row(20, 6, 17, U);
      g.row(18, 7, 16, dark(U));
      for (const v of [g, g.flip(23)]) {
        v.rect(2, 12, 6, 22, U); // the arms, and his hands at the end of them
        v.row(12, 3, 5, lite(U));
        v.clear(2, 12);
        v.rect(2, 15, 6, 17, SK);
        v.pts([[2, 18], [4, 18], [6, 18]], SK);
      }
    }
    g.speckle(4, 2, 19, 6, hex('#96705c'), 6, 3);
  }, { w: 28, h: 28, dx: 2 });

  mk('toaster-biter', 'toaster biter chrome teeth kitchen appliance hot jaws vermin small', 15, 11, (g, r) => {
    const T = C.steel;
    if (r) {
      g.poly([[2, -1], [11, -4], [11, 1], [2, 3]], T); // it comes open on a hinge
      g.line(2, -1, 11, -4, lite(T));
      g.rect(2, 3, 11, 5, C.flame); // red hot inside
      g.row(4, 3, 10, C.flameLight);
      g.teeth(3, 11, 2, 1, C.white, 2);
      g.teeth(4, 11, 6, -1, C.white, 2);
      g.rect(2, 6, 11, 8, T);
      g.rect(6, -7, 9, -4, C.straw); // the toast goes flying
      g.frame(6, -7, 9, -4, C.rust);
      g.set(4, -2, K);
      g.set(8, -3, K);
    } else {
      g.rect(4, 1, 9, 2, C.straw); // toast
      g.row(1, 4, 9, C.rust);
      g.box(2, 3, 11, 8, T);
      g.row(3, 3, 10, K); // the slot
      g.rect(4, 5, 6, 6, lite(T));
    }
    g.rect(12, r ? 6 : 5, 12, r ? 7 : 6, C.black); // the lever
    g.pts([[3, 9], [10, 9]], C.ironDark);
    g.pts([[1, 8], [0, 9]], C.black); // the flex
  }, { h: 19 });

  mk('phone-cord-strangler', 'telephone cord strangler rotary phone handset bites curly flex thing small', 18, 13, (g, r) => {
    const A = hex('#6a7a4a');
    g.poly([[5, 6], [12, 6], [15, 10], [2, 10]], A); // the body
    g.line(5, 6, 2, 10, lite(A));
    g.orb(8, 8, 2, [0, 0], r ? REDEYE : C.iron, r ? EYE : C.white); // the dial
    if (r) {
      g.pts([[3, 11], [6, 11], [10, 11], [13, 11]], C.black); // little feet
      const p = curve([[13, 8], [18, 6], [17, 0], [20, -5]], 6);
      for (let i = 0; i < p.length; i++) g.set(p[i][0] + (i % 2), p[i][1], C.black); // the flex, pulled taut
      g.rect(16, -11, 18, -3, A); // the handset rears
      g.rect(13, -12, 17, -9, A);
      g.rect(13, -4, 17, -1, A);
      g.rect(13, -3, 15, -2, MOUTH);
      g.pts([[13, -4], [15, -4], [14, -1]], TOOTH);
      g.pts([[14, -11], [14, -10]], K);
      g.col(18, -11, -3, dark(A));
    } else {
      g.rect(2, 3, 15, 4, A); // the handset in its cradle
      g.rect(2, 4, 4, 6, A);
      g.rect(13, 4, 15, 6, A);
      g.row(3, 3, 14, lite(A));
      for (let i = 0; i < 5; i++) g.set(15 + (i % 2), 6 + i, C.black);
    }
  }, { w: 23, h: 26 });

  /* ---------- the pile of washing ---------- */
  mk('laundry-heap', 'laundry heap pile of clothes dirty washing eyes sleeves rises clothes golem', 26, 16, (g, r) => {
    const N = C.navy,
      W = hex('#b9b4a6'),
      R = C.wine,
      Y = C.mustard;
    if (r) {
      g.ball(4, 2, 21, 13, R); // it gets up
      g.ball(6, -8, 19, 6, N);
      g.ball(8, -15, 17, -6, W); // a shirt for a head
      g.rect(10, -12, 15, -8, K);
      g.eye(10, -11, 2, 1, 1, 0, K, YEL);
      g.eye(14, -11, 2, 1, 0, 0, K, YEL);
      g.teeth(10, 15, -8, -1, TOOTH, 1, false);
      g.worm([[7, -5], [0, -8], [-3, -14]], 2, 1.6, W); // sleeves
      g.worm([[18, -5], [25, -8], [27, -14]], 2, 1.6, Y);
      g.rect(-5, -16, -2, -15, K);
      g.rect(26, -16, 29, -15, K);
      g.line(9, 0, 15, 3, dark(N));
      g.rect(11, 6, 13, 12, W);
    } else {
      g.ball(2, 6, 14, 13, N);
      g.ball(11, 4, 23, 13, R);
      g.ball(7, 2, 17, 9, W);
      g.rect(10, 8, 15, 10, K); // something looks out from between
      g.eye(10, 9, 2, 1, 1, 0, K, YEL);
      g.eye(14, 9, 2, 1, 0, 0, K, YEL);
      g.worm([[18, 6], [22, 9], [24, 13]], 1.6, 1.4, Y); // a sleeve
      g.line(9, 4, 14, 6, dark(W));
    }
    g.rect(2, 12, 4, 13, W); // a sock
    g.set(5, 13, W);
    g.row(13, 3, 22, dark(R));
  }, { w: 38, h: 33, dx: 6 });

  mk('teeth-slippers', 'slippers with teeth pair fluffy bedroom slippers bite ankles vermin small', 17, 8, (g, r) => {
    const S = hex('#a87a80');
    for (const [x, y] of [[1, 0], [8, 1]]) {
      const v = g.at(x, y);
      if (r) {
        v.poly([[0, 1], [3, -2], [6, 0], [6, 2]], S); // the toe lifts
        v.rect(1, 2, 6, 3, MOUTH);
        v.teeth(1, 5, 2, 1, TOOTH, 2, false);
        v.pts([[2, 3], [4, 3]], TOOTH);
        v.rect(0, 4, 6, 5, S);
        v.set(2, 4, GUM);
        v.set(5, 0, YEL);
      } else {
        v.ball(0, 2, 6, 5, S);
        v.rect(4, 2, 6, 2, K); // where the foot goes
        v.set(2, 2, lite(S)); // a pompom
        v.set(2, 1, C.white);
      }
      v.row(5, 0, 6, dark(C.wood));
    }
  }, { h: 11 });

  /* ---------- the figure of peeled wallpaper ---------- */
  mk('wallpaper-peeler', 'wallpaper peeler figure of peeling wallpaper strips paper mummy hollow thing', 18, 35, (g0, r) => {
    const WP = hex('#b9ac8a'),
      RO = hex('#8a5a54'),
      g = g0.at(1, 1);
    g.man({ skin: WP, top: WP, legs: WP, shoe: WP, hand: WP, face: 'none', arms: r ? 'none' : 'down' });
    g.each(0, 1, 15, 31, (p, x, y) => (y % 6 === 5 ? dark(WP) : x % 4 === 1 && y % 6 === 2 ? RO : null)); // strips, and their roses
    g.rect(5, 5, 6, 6, K);
    g.rect(9, 5, 10, 6, K);
    if (r) {
      g.rect(6, 14, 9, 20, K); // there is nothing inside
      g.set(7, 16, YEL);
      g.set(9, 16, YEL);
      for (const [v, s] of [[g, 1], [g.flip(15), 2]]) {
        const p = curve([[3, 13], [-2, 10 + s], [-5, 14], [-9, 9 + s]], 6); // the arms unroll
        for (const [x, y] of p) v.rect(x, y, x, y + 1, WP);
        for (let i = 0; i < p.length; i += 3) v.set(p[i][0], p[i][1], RO);
        v.pts([[-10, 9 + s], [-10, 11 + s]], dark(WP));
      }
      g.poly([[10, 3], [14, 0], [16, 1], [12, 5]], lite(WP)); // the head comes away in a curl
      g.set(15, 0, RO);
    } else {
      g.pts([[0, 13], [-1, 14], [-1, 15]], lite(WP)); // curls coming loose
      g.pts([[13, 24], [14, 25], [14, 26]], lite(WP));
      g.pts([[12, 3], [13, 2]], lite(WP));
    }
  }, { w: 38, dx: 10 });

  /* ---------- the pot plant with hands ---------- */
  mk('houseplant-grasper', 'houseplant grasper pot plant leaves are hands green fingers roots reaching', 18, 28, (g, r) => {
    const PT = hex('#9a5a3a'),
      L = hex('#55733e');
    const stems = r
      ? [[[8, 20], [4, 10], [1, 0], 'u'], [[9, 20], [9, 8], [8, -4], 'u'], [[10, 20], [14, 10], [16, 1], 'u'], [[8, 20], [3, 15], [-2, 12], 'l'], [[10, 20], [15, 16], [19, 13], 'r']]
      : [[[8, 20], [5, 12], [3, 9], 'd'], [[9, 20], [9, 9], [8, 4], 'd'], [[10, 20], [13, 11], [15, 9], 'd'], [[8, 20], [4, 17], [1, 16], 'd'], [[10, 20], [14, 17], [16, 16], 'd']];
    for (const [a, b, e, d] of stems) {
      g.limb(curve([a, b, e], 5), dark(L), 1);
      g.hand(e[0] - (d === 'r' ? 0 : 1), e[1] - (d === 'u' ? 1 : 0), d, L, r ? 3 : 2);
    }
    g.poly([[4, 20], [13, 20], [12, 25], [5, 25]], PT);
    g.row(20, 4, 13, lite(PT));
    g.row(21, 5, 12, C.earth);
    g.row(26, 4, 13, dark(PT));
    if (r) {
      g.eye(7, 21, 3, 1, 1, 0, K, YEL); // it looks out of the soil
      g.limb([[5, 26], [2, 27], [1, 29]], C.woodPale, 1); // and walks on its roots
      g.limb([[12, 26], [15, 27], [16, 29]], C.woodPale, 1);
      g.limb([[8, 26], [8, 29]], C.woodPale, 1);
    }
  }, { w: 28, h: 37, dx: 5, dy: 6 });

  /* ---------- the rug that was a man ---------- */
  mk('rug-flat-man', 'rug flat man flattened carpet hearth rug rises face in the pattern large long', 44, 9, (g, r) => {
    const R = hex('#6b2f38'),
      G = C.mustard,
      U = hex('#8a744e');
    const fringe = (x) => g.pts([[x, 4], [x, 6]], C.cream);
    if (r) {
      g.rect(20, 4, 41, 6, R); // half of it still lies there
      g.row(4, 20, 41, G);
      g.row(6, 20, 41, dark(R));
      g.poly([[18, 6], [24, 6], [19, -6], [13, -6]], U); // the rest stands
      g.poly([[8, -19], [17, -19], [20, -6], [12, -6], [6, -8]], R);
      g.ball(8, -27, 17, -17, R); // a head, flat as the rest
      g.poly([[8, -17], [-2, -13], [-4, -8], [0, -9], [7, -12]], R); // arms like flaps
      g.poly([[17, -17], [26, -15], [29, -10], [25, -10], [18, -12]], R);
      g.pts([[-5, -7], [-3, -6], [-1, -7], [26, -8], [28, -8], [30, -9]], C.cream);
      g.frame(9, -18, 17, -8, G);
      g.rect(10, -24, 11, -23, K);
      g.rect(14, -24, 15, -23, K);
      g.set(11, -24, YEL);
      g.set(14, -24, YEL);
      g.rect(11, -21, 14, -19, K);
      g.row(-27, 10, 15, G);
    } else {
      g.rect(3, 4, 41, 6, R);
      g.row(4, 3, 41, G);
      g.row(6, 3, 41, dark(R));
      g.rect(3, 2, 8, 4, R); // one corner will not lie flat
      g.row(2, 3, 8, G);
      g.rect(4, 5, 7, 5, K);
      g.set(4, 5, YEL);
      g.set(7, 5, YEL);
      for (let x = 12; x < 40; x += 4) g.set(x, 5, G); // the pattern: a figure, if you look
      g.rect(22, 5, 27, 5, lite(R));
      fringe(2);
    }
    fringe(42);
  }, { w: 50, h: 38, dx: 7 });

  /* ---------- the boiler ---------- */
  mk('boiler-breather', 'boiler breather hot water tank furnace mouth pipes arms gauge eye steam large', 24, 46, (g, r) => {
    const B = hex('#8a6a4a'),
      PI = hex('#a0603a');
    g.rect(6, 43, 8, 44, C.ironDark);
    g.rect(15, 43, 17, 44, C.ironDark);
    g.rect(5, 10, 18, 42, B);
    g.ball(5, 6, 18, 14, B);
    g.rect(5, 11, 6, 42, lite(B));
    g.rect(16, 11, 18, 42, dark(B));
    g.row(19, 5, 18, dark(B));
    g.row(30, 5, 18, dark(B));
    g.row(42, 5, 18, vd(B));
    for (const x of [7, 10, 13, 16]) g.pts([[x, 20], [x, 31]], lite(B));
    g.speckle(5, 8, 18, 42, C.rust, 12, 6);
    g.orb(11, 15, 2, r ? [0, 0] : [0, 0], r ? REDEYE : C.iron, C.white); // the gauge
    if (r) {
      g.rect(7, 32, 16, 40, MOUTH); // the fire door is a mouth
      g.rect(8, 35, 15, 39, C.flame);
      g.rect(10, 36, 13, 38, C.flameLight);
      g.teeth(7, 16, 32, 1, C.ironDark, 2);
      g.teeth(8, 16, 40, -1, C.ironDark, 2);
      g.frame(6, 31, 17, 41, C.ironDark);
      g.worm([[8, 7], [3, 3], [-2, 8], [-3, 20]], 1.3, 1.3, PI); // the pipes reach
      g.worm([[15, 7], [20, 3], [25, 8], [26, 20]], 1.3, 1.3, PI);
      for (const x of [-4, 25]) {
        g.rect(x - 1, 21, x + 3, 21, C.ironDark); // pincers where the valves were
        g.col(x - 1, 21, 25, C.ironDark);
        g.col(x + 3, 21, 25, C.ironDark);
        g.set(x, 26, C.ironDark);
        g.set(x + 2, 26, C.ironDark);
      }
      g.pts([[10, 1], [12, -1], [14, 2], [9, 3]], C.ghost); // steam
    } else {
      g.frame(8, 33, 15, 38, C.ironDark);
      g.rect(9, 34, 14, 37, K);
      for (const x of [10, 12, 14]) g.col(x, 34, 37, C.ironDark);
      g.pts([[9, 36], [11, 36], [13, 36]], C.flame); // the pilot light
      g.rect(8, 2, 9, 7, PI); // pipes
      g.rect(14, 2, 15, 7, PI);
      g.rect(4, 2, 8, 3, PI);
      g.rect(15, 2, 20, 3, PI);
      g.col(3, 2, 6, PI);
      g.col(21, 2, 6, dark(PI));
      g.rect(2, 7, 4, 7, C.red); // valves
      g.rect(20, 7, 22, 7, C.red);
    }
  }, { w: 36, h: 48, dx: 6 });

  mk('bulb-spider', 'light bulb spider glass body filament legs lamp vermin small', (g, r) => {
    const L = hex('#3a3238');
    const leg = (x, kx, ky, fx, fy) => g.limb([[x, 6], [kx, ky], [fx, fy]], L, 1);
    if (r) {
      leg(9, 5, -2, 2, -5); // front legs up
      leg(10, 8, -3, 7, -6);
      leg(11, 14, 0, 16, 11);
      leg(10, 6, 2, 3, 11);
      leg(12, 16, 2, 18, 8);
      leg(9, 4, 4, 0, 11);
    } else {
      leg(9, 5, 1, 2, 11);
      leg(10, 8, 0, 6, 11);
      leg(11, 13, 0, 15, 11);
      leg(12, 16, 2, 18, 11);
      leg(9, 3, 3, -1, 11);
    }
    g.ball(2, 2, 9, 8, r ? LAMP : C.glassLight, r ? C.white : lite(C.glassLight), r ? C.flameLight : C.glass);
    g.pts([[5, 4], [6, 5], [5, 6]], r ? C.white : C.ironDark); // the filament
    g.rect(10, 4, 12, 7, C.brass); // the cap
    g.col(11, 4, 7, dark(C.brass));
    g.set(13, 5, r ? REDEYE : K);
    g.set(13, 7, r ? REDEYE : K);
    if (r) g.pts([[13, 8], [12, 9]], TOOTH);
  });

  /* ---------- the babysitter ---------- */
  mk('babysitter-long-neck', 'babysitter long neck woman girl neck too long stretched bends down jaw large', 18, 48, (g0, r) => {
    const g = g0.at(1, 15),
      SK = PALE,
      HA = hex('#6a4a2e');
    g.man({ head: false, skin: SK, top: hex('#a07a84'), robe: C.navy, arms: r ? { l: 'reach', r: 'down' } : 'down' });
    if (r) {
      g.worm([[7.5, 12], [7, 2], [3, -8], [-5, -9], [-10, -3], [-10, 4]], 1.4, 1.4, SK); // the neck comes over and down
      g.head(-18, 0, SK, 'gape', ['long', HA, 16], K);
      g.rect(-12, 9, -9, 14, MOUTH); // and the jaw goes on opening
      g.row(9, -12, -9, TOOTH);
      g.rect(-12, 15, -9, 15, SK);
      g.pts([[-12, 14], [-10, 14]], TOOTH);
    } else {
      g.rect(7, -3, 8, 12, SK);
      g.col(8, -3, 12, dark(SK));
      for (let y = 0; y < 12; y += 3) g.set(7, y, dark(SK));
      g.head(0, -14, SK, 'smile', ['long', HA, 9], K);
    }
  }, { w: 34, dx: 16 });
};
