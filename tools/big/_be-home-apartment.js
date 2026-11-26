/* What lives in the block of flats (see be-home.js): mk(slug, name, draw(g, roused)); the canvas is cut to fit. */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd }, { P, vd, curve }, mk) => {
  const { PALE, ASHEN, DEAD, SICK, BRUISE, RAW, GUM, MOUTH, EYE, YEL, REDEYE, TOOTH, HAIR, WET, MOULD, FUR, GREY, PLASTIC, LAMP } = P;
  const SHADE = hex('#26222c'),
    OIL = hex('#2a2e3a');

  /* ---------- the stairwell crawler ---------- */
  mk('stairwell-crawler', 'stairwell crawler many arms long body crawls down the stairs pale hair monster large long', (g, r) => {
    const SK = ASHEN,
      F = 22;
    const sp = curve(r ? [[46, 14], [34, 12], [23, 9], [15, 0], [12, -8]] : [[46, 13], [34, 11], [21, 12], [9, 14]], 6),
      at = (t) => sp[Math.round(t * (sp.length - 1))];
    const ts = [0.12, 0.3, 0.48, 0.66, 0.84];
    for (const t of ts) {
      const [x, y] = at(t); // the far arms
      if (r && t > 0.6) g.arm([[x, y], [x - 2, y - 7], [x - 8, y - 9]], dark(SK), 1, 'l', dark(SK), 2);
      else g.arm([[x, y], [x + 3, y - 6], [x + 4, F - 2]], dark(SK), 1, 'd', dark(SK), 1);
    }
    g.limb([[46, 14], [50, 17], [53, F]], dark(SK), 2); // what is left of its legs drags behind
    g.limb([[46, 15], [49, 20], [51, F]], SK, 2);
    g.tube(sp, 3.2, 2.6, SK);
    for (let i = 2; i < sp.length - 2; i += 3) g.set(sp[i][0], sp[i][1] + 2, vd(SK)); // ribs
    for (let i = 1; i < sp.length - 1; i += 3) g.set(sp[i][0], sp[i][1] - 2, lite(SK)); // the spine
    for (const t of ts) {
      const [x, y] = at(t);
      if (r && t > 0.6) g.arm([[x - 1, y], [x - 7, y - 3], [x - 12, y - 1 + (t > 0.8 ? -4 : 2)]], SK, 2, 'l', SK, 3);
      else g.arm([[x - 1, y], [x - 4, y - 7], [x - 6, F - 2]], SK, 2, 'd', SK, 2);
    }
    if (r) {
      g.ball(6, -17, 15, -7, SK);
      g.strands(10, 16, -17, 13, HAIR, 4, 0.5);
      g.row(-17, 8, 15, HAIR);
      g.rect(7, -14, 8, -13, K);
      g.set(7, -14, YEL);
      g.maw(6, -11, 11, -6, { step: 1 });
    } else {
      g.ball(2, 11, 10, 19, SK);
      g.row(11, 3, 9, HAIR);
      g.strands(1, 10, 12, 10, HAIR, 4, 0.4); // its hair sweeps the steps
      g.rect(4, 15, 5, 16, K);
      g.set(4, 15, YEL);
    }
  });

  /* ---------- the lift-shaft dweller ---------- */
  mk('lift-shaft-dweller', 'lift shaft dweller elevator too long arms oily thin tall grease monster large', (g, r) => {
    const SK = hex('#b9c4c0');
    g.limb([[9, 30], [7, 38], [8, 46]], OIL, 2);
    g.limb([[13, 30], [15, 38], [14, 46]], OIL, 2);
    g.rect(6, 46, 9, 46, OIL);
    g.rect(13, 46, 16, 46, OIL);
    g.poly([[7, 13], [15, 13], [14, 31], [8, 31]], OIL);
    g.col(8, 15, 29, hex('#4a5266')); // a shine of grease
    for (let y = 17; y < 30; y += 3) g.row(y, 10, 13, K); // ribs
    g.ball(8, 4, 14, 12, SK);
    g.rect(9, 7, 10, 8, K);
    g.rect(12, 7, 13, 8, K);
    g.set(10, 8, YEL);
    g.set(12, 8, YEL);
    g.row(10, 9, 13, K);
    g.pts([[9, 10], [11, 10], [13, 10]], TOOTH);
    for (const v of [g, g.flip(22)]) {
      if (r) {
        v.limb([[7, 14], [-2, 8], [-8, -8]], OIL, 2); // the arms go up the shaft
        v.hand(-9, -10, 'u', SK, 4);
        v.set(-2, 8, hex('#4a5266'));
      } else {
        v.limb([[7, 14], [3, 26], [2, 43]], OIL, 2); // and hang to the floor
        v.hand(1, 44, 'l', SK, 4);
        v.set(3, 26, hex('#4a5266'));
      }
    }
    g.drips(7, 15, 31, OIL, 3, 3, 3);
  });

  /* ---------- the neighbour who is his own front door ---------- */
  mk('door-neighbour', 'neighbour fused with his door front door face in the wood man door arms legs', (g, r) => {
    const D = hex('#4a5e62'),
      SK = blend(D, C.flesh, 0.75);
    const half = (v) => {
      v.rect(2, 2, 9, 38, D);
      v.col(2, 2, 38, lite(D));
      v.row(2, 2, 9, lite(D));
      v.frame(4, 20, 9, 34, dark(D)); // the lower panel
      v.rect(6, 7, 9, 15, SK); // half of his face, grown into the paint
      v.row(6, 7, 9, SK);
      v.row(16, 7, 9, SK);
      v.set(9, 11, dark(SK));
      if (r) v.eye(7, 9, 2, 2, 1, 1);
      else v.row(10, 7, 8, vd(SK));
    };
    if (r) {
      g.leg(4, 36, 42, C.black, -1); // he walks it down the corridor
      g.leg(13, 36, 42, C.black, 1);
      g.rect(7, 2, 12, 38, MOUTH); // and the door comes apart down the middle
      half(g.at(-3, 0));
      half(g.flip(19).at(-3, 0));
      for (let y = 4; y < 38; y += 3) {
        g.rect(7, y, 8, y, TOOTH);
        g.rect(11, y + 1, 12, y + 1, TOOTH);
      }
      g.set(14, 22, C.brass);
      g.arm([[-1, 20], [-5, 17], [-8, 20]], D, 2, 'l', SK, 3);
      g.arm([[20, 20], [24, 17], [26, 20]], dark(D), 2, 'r', SK, 3);
    } else {
      half(g);
      half(g.flip(19));
      g.row(14, 8, 11, vd(SK)); // a mouth, shut
      g.rect(9, 3, 10, 4, C.brass); // the number
      g.rect(15, 21, 16, 22, C.brass); // the handle
      g.rect(7, 27, 12, 28, C.brass); // the letterbox
      g.row(27, 8, 11, K);
      g.rect(0, 22, 2, 22, SK); // his fingers come round the edge
      g.rect(0, 24, 2, 24, SK);
      g.rect(0, 26, 2, 26, dark(SK));
      g.rect(12, 39, 16, 39, C.black); // and one shoe under it
    }
  });

  mk('letterbox-eyes', 'letterbox eyes letter flap brass slot fingers watching mail thing small', (g, r) => {
    const B = C.brass,
      SK = PALE;
    for (const x of [3, 5, 10, 12]) g.col(x, 6, r ? 11 : 8, SK); // it goes about on fingers
    if (r) {
      g.pts([[2, 11], [4, 11], [11, 11], [13, 11]], SK);
      g.box(2, 0, 13, 6, B);
      g.rect(3, 2, 12, 5, MOUTH);
      g.poly([[2, 0], [13, 0], [14, -4], [1, -4]], B); // the flap, lifted
      g.row(-4, 1, 14, lite(B));
      g.orb(5, 3, 1, [0, 0], K, EYE);
      g.orb(10, 3, 1, [0, 0], K, EYE);
      g.rect(6, 5, 9, 9, C.white); // a letter for a tongue
      g.row(7, 7, 8, C.blood);
      g.arm([[1, 4], [-2, 2], [-3, 5]], SK, 1, 'd', SK, 2);
      g.arm([[14, 4], [17, 2], [17, 5]], SK, 1, 'd', SK, 2);
    } else {
      g.box(2, 2, 13, 6, B);
      g.row(4, 4, 11, K);
      g.set(6, 4, YEL);
      g.set(9, 4, YEL);
      g.pts([[2, 9], [13, 9]], SK);
    }
  });

  /* ---------- the thing in the rubbish chute ---------- */
  mk('chute-thing', 'rubbish chute thing garbage sludge hatch refuse slime bones monster', (g, r) => {
    const ST = C.steel,
      SL = hex('#5a5a3a');
    g.rect(7, 0, 14, 30, C.iron); // the duct
    g.col(7, 0, 30, C.steel);
    g.col(14, 0, 30, C.ironDark);
    g.box(4, 4, 17, 14, ST); // the hopper
    g.rect(6, 6, 15, 12, K);
    if (r) {
      g.worm([[10, 9], [8, 16], [2, 14], [-4, 6]], 4, 3.2, SL); // it comes out, and up
      g.ball(-9, -1, 1, 9, SL);
      g.maw(-8, 3, -1, 8, { tooth: C.steel });
      g.set(-6, 1, YEL);
      g.set(-2, 1, YEL);
      g.arm([[2, 14], [-3, 19], [-8, 17]], SL, 2, 'l', C.bone, 3);
      g.arm([[8, 16], [14, 21], [19, 19]], dark(SL), 2, 'r', C.bone, 3);
      g.ball(2, 24, 18, 30, SL);
    } else {
      g.set(8, 8, YEL);
      g.set(12, 8, YEL);
      g.poly([[5, 12], [16, 12], [17, 16], [4, 16]], dark(ST)); // the flap hangs open
      g.worm([[10, 11], [10, 18], [8, 27]], 1.8, 1.4, SL); // it drools
      g.ball(3, 25, 16, 30, SL);
      g.rect(5, 10, 6, 13, SL); // fingers of it over the lip
      g.rect(14, 10, 15, 14, SL);
    }
    g.speckle(-9, -1, 19, 30, dark(SL), 9, 4);
    g.pts([[6, 27], [7, 27], [8, 27], [7, 26], [7, 28]], C.bone); // a fish bone
    g.rect(12, 26, 14, 28, C.rust); // a tin
    g.row(26, 12, 14, C.steel);
    g.row(30, 3, 17, dark(SL));
  });

  /* ---------- the pigeons ---------- */
  mk('pigeon-swarm-face', 'pigeon swarm with one face flock of pigeons birds shape of a face flying', (g, r) => {
    const PG = hex('#7d8088'),
      R = rnd(11);
    const pigeon = (x, y, d) => {
      g.rect(x, y, x + 2, y + 1, PG);
      g.row(y + 1, x + (d > 0 ? 0 : 1), x + (d > 0 ? 1 : 2), hex('#5a5e6a')); // wing
      g.set(d > 0 ? x + 3 : x - 1, y, hex('#4a6a5e')); // the green neck
      g.set(d > 0 ? x + 3 : x - 1, y - 1, dark(PG));
      g.set(d > 0 ? x - 1 : x + 3, y + 1, dark(PG));
    };
    const ry = r ? 15 : 11,
      cy = 13;
    const hole = (x, y) =>
      (x - 8) ** 2 + (y - (cy - 3)) ** 2 < 7 || (x - 19) ** 2 + (y - (cy - 3)) ** 2 < 7 || (r ? ((x - 13.5) / 6) ** 2 + ((y - (cy + 8)) / 5) ** 2 < 1 : y >= cy + 5 && y <= cy + 6 && x > 7 && x < 20);
    for (let y = cy - ry; y <= cy + ry; y += 3)
      for (let x = 0; x <= 26; x += 5) {
        const jx = x + Math.floor(R() * 3) - 1 + (((y / 3) | 0) % 2 ? 2 : 0),
          jy = y + Math.floor(R() * 2);
        if (((jx + 1 - 13.5) / 13) ** 2 + ((jy - cy) / ry) ** 2 > 1) continue;
        if (hole(jx, jy) || hole(jx + 2, jy + 1) || hole(jx + 3, jy)) continue;
        pigeon(jx, jy, R() < 0.5 ? 1 : -1);
      }
    if (r) {
      g.rect(8, cy - 3, 8, cy - 3, REDEYE);
      g.rect(19, cy - 3, 19, cy - 3, REDEYE);
      g.pts([[-2, 2], [29, 5], [-3, 20], [30, 22], [5, 30], [22, 31]], dark(PG)); // feathers fly
    }
    g.shadow(6, 21, r ? 36 : 31);
  }, { outline: false });

  /* ---------- the caretaker's dog ---------- */
  mk('caretaker-dog-teeth', "caretaker's dog mostly teeth hound jaws grin chain mangy animal monster", (g, r) => {
    const F = hex('#5a4a40');
    g.ball(12, 5, 24, 12, F);
    g.worm([[24, 7], [27, 4], [27, 2]], 1, 0.7, F); // a stump of tail
    for (const x of [13, 21]) {
      g.rect(x, 11, x + 1, 16, F);
      g.rect(x + 2, 12, x + 3, 16, dark(F));
      g.row(16, x - 1, x + 1, dark(F));
    }
    g.pts([[15, 6], [18, 5], [21, 7]], dark(F)); // its ribs show
    g.pts([[15, 8], [18, 7], [21, 9]], dark(F));
    g.col(12, 5, 11, C.iron); // the collar, and a length of chain
    g.pts([[12, 12], [11, 13], [12, 14], [11, 15]], C.steel);
    if (r) {
      g.poly([[13, 5], [12, 0], [2, -7], [-1, -4], [4, 2]], F); // the head is all hinge
      g.poly([[13, 10], [10, 13], [0, 15], [-1, 12], [5, 9]], F);
      g.poly([[12, 1], [4, 2], [5, 9], [12, 9]], MOUTH);
      g.worm([[10, 7], [5, 8], [1, 11]], 1.4, 1, GUM);
      for (let i = 0; i < 6; i++) {
        g.col(1 + i * 2, -4 + i + (i > 3 ? 0 : 0), -2 + i, TOOTH); // teeth above
        g.col(0 + i * 2, 12 - (i >> 1), 13 - (i >> 1) - (i % 2), TOOTH); // teeth below
      }
      g.set(9, -1, YEL);
      g.pts([[12, -2], [13, -3]], F);
    } else {
      g.rect(1, 2, 13, 11, F); // a head that is one long jaw
      g.clear(1, 2);
      g.clear(1, 11);
      g.row(2, 3, 12, lite(F));
      g.rect(1, 6, 11, 8, MOUTH);
      for (let x = 1; x <= 11; x += 2) {
        g.col(x, 5, 7, TOOTH);
        g.col(x + 1, 7, 9, TOOTH);
      }
      g.set(11, 4, YEL);
      g.pts([[12, 1], [13, 1], [13, 0]], F); // a torn ear
    }
  });

  /* ---------- the damp-stain man ---------- */
  mk('damp-stain-man', 'damp stain man water stain on the wall shape of a man steps out wet mould ghost', (g0, r) => {
    const ST = hex('#3e4a4a'),
      g = g0.at(0, 0);
    g.man({ skin: ST, top: ST, legs: ST, shoe: ST, hand: ST, face: 'none', arms: r ? 'fwd' : 'down', head: true });
    g.each(-3, 0, 18, 32, (p) => (p === K || p[0] < 30 ? ST : null));
    g.oval(3, 2, 12, 12, ST); // a blot for a head
    g.lit(0, 1, 15, 31, 1.25); // the tide-mark
    g.speckle(0, 1, 15, 31, dark(ST), 5, 2);
    g.speckle(0, 1, 15, 31, MOULD, 9, 5);
    g.drips(1, 14, 22, ST, 3, 3, 3);
    g.drips(3, 12, 32, ST, 7, r ? 3 : 2, 2);
    if (r) {
      g.eye(5, 6, 2, 1, 1); // then it opens its eyes
      g.eye(9, 6, 2, 1, 0);
      g.rect(6, 9, 9, 10, K);
      g.drips(1, 3, 21, WET, 2, 4, 1);
      g.drips(12, 14, 21, WET, 5, 4, 1);
      g.row(33, -1, 16, WET);
      g.row(34, 2, 13, WET);
    } else {
      g.row(32, 3, 12, WET);
    }
  });

  /* ---------- the pram ---------- */
  mk('pram-walker', 'pram that walks baby carriage on legs perambulator thing inside many arms monster', (g, r) => {
    const N = hex('#2e3448'),
      SK = PALE,
      v = g.at(0, r ? -9 : 0);
    if (r) {
      for (const [x, k, f] of [[6, 2, 3], [9, 12, 10], [16, 13, 15], [19, 23, 22]]) g.limb([[x, 12], [k, 19], [f, 27]], SK, 2); // long thin legs
      g.pts([[2, 28], [3, 28], [9, 28], [10, 28], [15, 28], [16, 28], [22, 28], [23, 28]], SK);
      // what was in it sits up
      v.rect(14, 4, 15, 12, SK);
      v.ball(10, -6, 19, 4, SK);
      v.rect(12, -2, 13, -1, K);
      v.rect(16, -2, 17, -1, K);
      v.rect(13, 1, 16, 3, MOUTH);
      v.pts([[13, 1], [16, 1]], TOOTH);
      v.arm([[14, 8], [19, 5], [22, 1]], SK, 1, 'u', SK, 2);
      v.arm([[15, 10], [21, 9], [25, 6]], SK, 1, 'u', SK, 2);
      v.arm([[14, 9], [9, 6], [7, 2]], SK, 1, 'u', SK, 2);
    }
    v.poly([[4, 13], [21, 13], [19, 21], [6, 21]], N); // the body
    v.row(13, 4, 21, lite(N));
    v.poly([[4, 13], [4, 8], [7, 5], [12, 5], [13, 13]], N); // the hood
    v.line(4, 8, 12, 12, lite(N));
    v.line(7, 5, 12, 12, lite(N));
    v.line(21, 13, 25, 8, C.steel); // the handle
    v.row(8, 24, 27, C.steel);
    if (!r) {
      g.rect(13, 11, 20, 12, K);
      g.set(15, 12, YEL);
      g.set(18, 12, YEL);
      g.rect(20, 11, 21, 12, SK); // a small hand on the rim
      g.set(22, 12, SK);
    }
    for (const x of [8, 18]) {
      v.oval(x - 3, 21, x + 3, 27, C.ironDark); // wheels
      v.oval(x - 2, 22, x + 2, 26, C.steel);
      v.set(x, 24, C.ironDark);
      v.pts([[x - 1, 23], [x + 1, 25], [x + 1, 23], [x - 1, 25]], C.iron);
    }
  });

  mk('intercom-mouth', 'intercom mouth door entry speaker panel lips teeth buzzer wires thing small', (g, r) => {
    const ST = C.steel;
    g.limb([[5, 14], [4, 16], [3, 19]], C.black, 1); // it gets about on its wires
    g.limb([[8, 14], [9, 16], [10, 19]], C.black, 1);
    g.box(3, 1, 10, 14, ST);
    if (r) {
      g.rect(4, 3, 9, 8, GUM); // the grille was lips all along
      g.rect(5, 4, 8, 7, MOUTH);
      g.row(4, 5, 8, TOOTH);
      g.pts([[5, 7], [7, 7]], TOOTH);
      g.rect(6, 6, 7, 6, RAW);
      g.orb(5, 11, 1, [0, 0], K, YEL);
      g.orb(8, 11, 1, [0, 0], K, YEL);
      g.limb([[3, 6], [0, 4], [-1, 8]], C.black, 1);
      g.limb([[10, 6], [13, 4], [14, 8]], C.black, 1);
      g.pts([[-1, 9], [14, 9]], C.rust);
    } else {
      for (const y of [3, 5, 7]) g.row(y, 5, 8, C.ironDark);
      g.rect(5, 10, 8, 10, C.paper); // the names
      g.rect(5, 12, 8, 12, C.paper);
      g.set(9, 10, C.red);
    }
  });

  /* ---------- the twins ---------- */
  mk('twins-hair', 'twins joined at the hair two girls sisters one hair between them hanging dolls ghost', (g, r) => {
    const SK = PALE,
      up = r ? -7 : 0;
    const girl = (v, dress) => v.man({ skin: SK, top: dress, robe: dress, tl: 7, ll: 7, shoe: false, face: r ? 'hollow' : 'calm', hair: ['long', HAIR, 12], arms: 'down' });
    girl(g.at(0, up), hex('#8e98a4'));
    girl(g.at(21, up), hex('#a8a08c'));
    if (r) {
      g.pts([[5, 20], [6, 20], [9, 20], [10, 20], [26, 20], [27, 20], [30, 20], [31, 20]], SK); // their feet leave the floor
      g.pts([[5, 21], [9, 21], [26, 21], [30, 21]], dark(SK));
      g.ball(10, -24, 26, -8, HAIR); // the hair is what is alive
      g.worm([[8, -5], [12, -12], [16, -14]], 2.2, 3, HAIR, K);
      g.worm([[29, -5], [25, -12], [20, -14]], 2.2, 3, HAIR, K);
      g.orb(18, -16, 3, [0, 1], YEL);
      g.strands(10, 26, -12, 8, HAIR, 5, 0.3);
      g.worm([[14, -9], [15, 6], [13, 20]], 1.4, 0.8, HAIR, K); // and reaches down
      g.worm([[22, -9], [21, 8], [23, 22]], 1.4, 0.8, HAIR, K);
      g.pts([[12, 22], [12, 24], [14, 23], [24, 24], [22, 25], [24, 26]], HAIR);
      g.speckle(10, -24, 26, -8, hex('#3e3a44'), 6, 3);
    } else {
      g.worm([[12, 4], [18, 9], [24, 4]], 2.2, 2.2, HAIR, K); // one braid between two heads
      g.pts([[15, 7], [18, 8], [21, 7]], hex('#3e3a44'));
      g.strands(15, 21, 10, 5, HAIR, 5, 0.2);
    }
  });

  /* ---------- small things of the block ---------- */
  mk('bin-bag-brood', 'bin bag brood rubbish sack black plastic something inside hands pushing vermin small', (g, r) => {
    const B = hex('#22222a'),
      SH = hex('#4a4a58');
    if (r) {
      g.ball(1, 0, 12, 13, B);
      g.rect(5, -3, 8, 0, B);
      g.pts([[4, -4], [6, -5], [9, -4]], B);
      g.rect(3, 3, 5, 5, SH); // a face pushes at the plastic from inside
      g.rect(8, 3, 10, 5, SH);
      g.rect(5, 8, 8, 10, SH);
      g.rect(4, 4, 4, 4, K);
      g.rect(9, 4, 9, 4, K);
      g.rect(6, 9, 7, 9, K);
      g.arm([[1, 8], [-2, 7], [-4, 4]], PALE, 1, 'u', PALE, 2); // and hands come through
      g.arm([[12, 9], [15, 8], [16, 5]], PALE, 1, 'u', PALE, 2);
    } else {
      g.ball(2, 4, 11, 13, B);
      g.rect(6, 2, 7, 4, B); // the knot
      g.pts([[5, 1], [8, 1], [6, 0]], B);
      g.line(4, 6, 3, 10, SH);
      g.line(8, 5, 9, 8, SH);
      g.pts([[5, 9], [6, 9]], SH); // a dent: knuckles
      g.set(12, 12, PALE); // one fingertip, through a hole
      g.set(13, 12, PALE);
    }
    g.row(13, 3, 10, K);
  });

  mk('cockroach-big', 'cockroach big roach insect baby face under the wings kitchen vermin small', (g, r) => {
    const B = hex('#5a3320');
    for (const [x, f] of [[5, 2], [8, 8], [11, 14]]) g.limb([[x, 7], [f, 8], [f - 1, 10]], K, 1);
    g.line(2, 5, -3, r ? 0 : 3, K); // feelers
    g.line(2, 6, -4, r ? 3 : 6, K);
    g.ball(2, 4, 14, 9, B);
    g.rect(1, 5, 3, 8, dark(B)); // head
    if (r) {
      g.poly([[5, 4], [13, 4], [15, -3], [9, -4]], B); // the wing cases lift
      g.line(5, 4, 9, -4, lite(B));
      g.rect(6, 4, 12, 8, PALE); // and there is a small face under them
      g.set(8, 5, K);
      g.set(11, 5, K);
      g.row(7, 9, 10, MOUTH);
      g.set(1, 6, REDEYE);
    } else {
      g.row(5, 5, 12, lite(B));
      g.line(4, 6, 13, 6, dark(B)); // the seam of the wings
      g.set(1, 6, K);
    }
  });

  mk('rat-king', 'rat king rats knotted by their tails pack of rats many heads vermin small', (g, r) => {
    const RF = hex('#6a5e58');
    const rat = (x, y, d, up) => {
      const v = d > 0 ? g.at(x, y) : g.flip(0).at(-x, y);
      if (up) {
        v.poly([[0, 3], [3, 3], [6, -3], [3, -3]], RF); // reared
        v.rect(3, -5, 6, -3, RF);
        v.set(7, -4, RAW);
        v.set(5, -5, REDEYE);
        v.pts([[6, -2], [7, -2]], TOOTH);
        v.set(3, -6, RAW);
      } else {
        v.rect(0, 1, 4, 3, RF);
        v.rect(4, 2, 6, 3, RF);
        v.set(7, 3, RAW);
        v.set(5, 2, r ? REDEYE : K);
        v.set(3, 0, RAW); // ear
        v.row(1, 1, 3, lite(RF));
      }
      v.line(0, 2, -3, 1, RAW); // its tail, to the knot
    };
    rat(13, 6, 1, r);
    rat(7, 6, -1, r);
    rat(12, 9, 1, false);
    rat(8, 9, -1, false);
    g.oval(8, 5, 12, 8, RAW); // the knot
    g.pts([[9, 6], [11, 7], [10, 5]], GUM);
    if (r) rat(10, 1, 1, true);
    else rat(10, 2, 1, false);
    g.row(12, 2, 18, dark(RF));
    g.pts([[2, 12], [5, 12], [15, 12], [18, 12]], RAW); // feet
  });

  /* ---------- the tenant who is too tall for the corridor ---------- */
  mk('corridor-long-tenant', 'tenant too tall for the corridor long man bent neck vest braces stretched large', (g, r) => {
    const SK = PALE,
      o = { skin: SK, top: hex('#b9b4a6'), sleeve: SK, legs: hex('#5a4a3a'), shoe: SK, tl: 15, ll: 20, head: false };
    const { yF } = g.man({ ...o, arms: 'none' });
    g.col(6, 13, 26, C.wine); // braces
    g.col(9, 13, 26, C.wine);
    for (const v of [g, g.flip(15)]) {
      if (r) {
        v.limb([[3, 13], [-4, 18], [-9, 14]], SK, 2);
        v.hand(-11, 12, 'l', SK, 4);
      } else {
        v.rect(1, 12, 3, 34, SK); // arms to the knee
        v.col(3, 13, 34, dark(SK));
        v.hand(1, 35, 'd', SK, 3);
      }
    }
    if (r) {
      g.rect(7, 3, 8, 12, SK); // he straightens
      g.col(8, 3, 12, dark(SK));
      g.head(0, -9, SK, 'grin', ['thin', GREY], K);
    } else {
      g.rect(7, 9, 9, 12, SK); // his head lies over on his shoulder, as under a ceiling
      g.rect(8, 3, 16, 10, SK);
      g.row(2, 9, 15, SK);
      g.col(17, 4, 9, SK);
      g.col(16, 3, 10, GREY);
      g.pts([[11, 5], [11, 8]], K); // eyes, one above the other
      g.col(14, 6, 7, vd(SK));
      g.set(12, 6, dark(SK));
    }
    g.pts([[4, yF + 1], [6, yF + 1], [9, yF + 1], [11, yF + 1]], dark(SK));
  });

  /* ---------- the radiator ---------- */
  mk('radiator-ribs', 'radiator with ribs heater on legs rib cage hot iron hissing thing', (g, r) => {
    const W = hex('#b9b4a6'),
      PI = hex('#a0603a');
    for (const x of [6, 28]) {
      g.limb([[x, 14], [x - 2, 17], [x - 2, 21]], PI, 2); // pipe legs
      g.limb([[x + 2, 14], [x + 4, 17], [x + 4, 21]], dark(PI), 2);
    }
    g.worm([[32, 10], [36, 9], [37, 4]], 1, 1, PI); // a pipe for a tail
    if (r) {
      g.rect(5, 12, 31, 14, W);
      g.oval(13, 5, 23, 12, C.flame); // what it keeps warm
      g.oval(15, 7, 21, 11, C.flameLight);
      for (let i = 0; i < 9; i++) {
        const x = 5 + i * 3,
          t = (i - 4) / 4;
        g.limb(curve([[x, 12], [x + t * 5, 5], [x + t * 9, -1], [x + t * 7, -5]], 4), W, 2); // the ribs open
      }
      g.pts([[14, -6], [18, -8], [22, -6]], C.ghost);
    } else {
      g.rect(5, 3, 31, 14, dark(W));
      for (let x = 5; x <= 30; x += 3) {
        g.rect(x, 2, x + 1, 14, W); // the ribs
        g.col(x, 3, 13, lite(W));
      }
      g.row(14, 5, 31, dark(W));
      g.set(18, 8, C.flame);
    }
    g.rect(1, 7, 4, 11, C.white); // the valve is its head
    g.col(4, 7, 11, C.stone);
    g.set(2, 8, r ? REDEYE : K);
    if (r) {
      g.rect(0, 10, 3, 11, MOUTH);
      g.pts([[0, 10], [2, 10]], TOOTH);
    } else g.pts([[1, 10], [2, 10]], C.stone);
  });

  /* ---------- the washing on the line ---------- */
  mk('washing-line-wraiths', 'washing line wraiths hanging laundry shirts nightdress ghosts on the line empty clothes', (g, r) => {
    const SK = DEAD;
    const line = curve([[1, 3], [17, r ? 4 : 6], [33, 3]], 8);
    for (const [x, y] of line) g.set(x, y, C.straw);
    g.hand(-1, 2, 'l', SK, 2); // held up by a hand at either end
    g.hand(33, 2, 'r', SK, 2);
    const face = (x, y) => {
      if (r) {
        g.rect(x, y, x, y + 1, K);
        g.rect(x + 3, y, x + 3, y + 1, K);
        g.rect(x + 1, y + 3, x + 2, y + 5, K);
      } else {
        g.set(x, y, C.stone);
        g.set(x + 3, y, C.stone);
      }
    };
    const W = hex('#c9c6b8'),
      J = hex('#a07a78'),
      N = hex('#9aa6b0');
    g.rect(4, 5, 11, r ? 14 : 16, W); // a shirt
    if (r) {
      g.limb([[4, 5], [1, 1], [-1, -4]], W, 2);
      g.limb([[11, 5], [14, 1], [13, -4]], W, 2);
    } else {
      g.rect(2, 5, 3, 13, W);
      g.rect(12, 5, 13, 12, dark(W));
    }
    face(6, 7);
    g.rect(15, 6, 21, 12, J); // long johns
    g.rect(15, 13, 17, r ? 22 : 21, J);
    g.rect(19, 13, 21, r ? 19 : 21, J);
    face(16, 8);
    g.poly([[24, 5], [30, 5], [32, 23], [22, 23]], N); // a nightdress
    if (r) {
      g.limb([[24, 6], [21, 2], [20, -3]], N, 2);
      g.limb([[30, 6], [34, 9], [36, 14]], N, 2);
    }
    face(25, 8);
    g.drips(22, 32, 24, N, 6, 3, 2);
    g.drips(4, 11, 15, W, 2, 3, 2);
    g.pts([[5, 4], [10, 4], [16, 5], [20, 5], [25, 4], [29, 4]], C.wood); // pegs
    g.shadow(5, 30, 32);
  });

  mk('peephole-eye', 'peephole eye door viewer eyeball spyhole nerve legs watching vermin small', (g, r) => {
    const up = r ? -4 : 0,
      v = g.at(0, up);
    g.worm([[9, 6 + up], [13, 9], [15, 10]], 1, 0.6, RAW); // the nerve it drags
    for (const [x, f] of [[4, 2], [6, 5], [8, 9]]) g.limb([[x, 8 + up], [f, 10]], RAW, 1);
    v.ball(2, 1, 10, 9, EYE);
    v.oval(4, 3, 8, 7, C.brass); // the brass of the door viewer
    v.oval(5, 4, 7, 6, r ? REDEYE : C.glass);
    v.set(6, 5, K);
    if (r) {
      v.pts([[3, 3], [9, 7], [3, 7], [9, 3]], REDEYE); // bloodshot
      v.rect(4, 9, 8, 10, MOUTH);
      v.pts([[4, 9], [6, 9], [8, 9]], TOOTH);
    }
  });

  mk('mail-pile-nester', 'mail pile nester heap of letters unopened post envelopes paper snake final notice small', (g, r) => {
    const W = hex('#d0cab8'),
      M = C.parchment;
    const env = (x, y, col, w = 6) => {
      g.rect(x, y, x + w, y + 3, col);
      g.line(x, y, x + (w >> 1), y + 2, dark(col));
      g.line(x + w, y, x + (w >> 1), y + 2, dark(col));
    };
    env(1, 6, M);
    env(9, 6, W);
    env(5, 4, W);
    g.row(8, 10, 15, C.red);
    if (r) {
      env(7, 1, M, 5); // they stack themselves into a neck
      env(6, -2, W, 5);
      env(8, -5, W, 5);
      env(6, -8, M, 5);
      g.rect(3, -13, 11, -9, W); // and a head
      g.poly([[3, -13], [11, -13], [12, -17], [4, -16]], W);
      g.rect(4, -12, 10, -11, MOUTH);
      g.teeth(4, 10, -12, 1, C.steel, 2, false);
      g.rect(9, -16, 10, -15, C.red); // the stamp
      g.set(6, -15, K);
    } else {
      env(8, 2, M);
      g.rect(12, 2, 13, 3, C.red);
      g.rect(15, 8, 16, 9, PALE); // a finger keeps its place
    }
  });

  /* ---------- the tangle on the roof ---------- */
  mk('cable-tangle', 'cable tangle aerial wires satellite dish face knot of cables plugs tentacles thing', (g, r) => {
    const CB = hex('#2a2a32'),
      R = rnd(5);
    g.limb([[8, 20], [6, 24], [5, 28]], C.steel, 1); // aerial prongs for legs
    g.limb([[14, 20], [16, 24], [17, 28]], C.steel, 1);
    g.pts([[4, 28], [18, 28]], C.steel);
    for (let i = 0; i < 9; i++) {
      const a = R() * 6.3,
        b = a + 2 + R() * 2;
      g.worm([[11 + Math.cos(a) * 6, 15 + Math.sin(a) * 5], [11 + R() * 4 - 2, 15 + R() * 4 - 2], [11 + Math.cos(b) * 6, 15 + Math.sin(b) * 5]], 0.9, 0.9, i % 4 === 0 ? hex('#5a3a3a') : i % 3 === 0 ? hex('#4a4a58') : CB, K);
    }
    const plug = (x, y, d) => {
      g.rect(x, y, x + 1, y + 2, C.plastic || PLASTIC);
      g.pts([[x + (d > 0 ? 2 : -1), y], [x + (d > 0 ? 2 : -1), y + 2]], C.brass);
    };
    if (r) {
      g.worm([[6, 13], [0, 9], [-5, 12]], 0.9, 0.9, CB, K); // the cables whip out
      plug(-7, 11, -1);
      g.worm([[16, 13], [22, 15], [26, 11]], 0.9, 0.9, CB, K);
      plug(27, 10, 1);
      g.worm([[7, 18], [1, 21], [-3, 19]], 0.9, 0.9, CB, K);
      plug(-5, 18, -1);
      g.ball(5, -2, 17, 9, PLASTIC); // the dish turns to look
      g.orb(11, 3, 3, [0, 1], REDEYE);
      g.limb([[11, 9], [11, 12]], C.steel, 1);
    } else {
      g.ball(9, 1, 20, 9, PLASTIC); // a dish
      g.oval(11, 3, 18, 8, dark(PLASTIC));
      g.limb([[12, 8], [8, 4], [7, 2]], C.steel, 1);
      g.rect(6, 1, 7, 2, C.ironDark);
      g.limb([[14, 9], [12, 12]], C.steel, 1);
    }
  });

  /* ---------- the landlord ---------- */
  mk('landlord-bloated', 'landlord bloated fat man crawling belly mouth keys suit swollen monster large long', (g, r) => {
    const SU = hex('#5e4a36'),
      SH = hex('#b9b4a6'),
      SK = hex('#c9a58c');
    g.leg(38, 16, 25, SU, 1, C.black); // small legs, a long way back
    g.leg(41, 17, 25, dark(SU), 1, C.black);
    g.ball(8, 2, 42, 25, SU); // the back of his jacket
    g.ball(7, 8, 36, 25, SH); // and the belly it cannot close over
    g.rect(10, 23, 34, 25, dark(SH));
    if (r) {
      g.rect(10, 13, 33, 21, MOUTH); // the belly opens
      g.rect(14, 18, 28, 20, GUM);
      for (let x = 10; x <= 33; x += 3) {
        g.rect(x, 13, x + 1, 15, TOOTH);
        g.rect(x + 1, 20, x + 2, 21, TOOTH);
      }
      g.pts([[9, 12], [34, 12], [9, 22], [34, 22]], dark(SH));
    } else {
      for (const y of [11, 15, 19]) g.set(20, y, C.stone); // buttons, straining
      g.col(21, 10, 22, dark(SH));
      g.pts([[19, 13], [22, 13], [19, 17], [22, 17]], dark(SH));
    }
    const hy = r ? -5 : 0,
      h = g.at(-3, 3 + hy);
    g.rect(5, 12 + hy, 9, 16, SK); // a neck like a second chin
    h.face(4, 3, SK, r ? 'gape' : 'smile', K);
    h.row(2, 5, 10, HAIR); // combed over
    h.row(3, 4, 6, HAIR);
    h.row(8, 6, 9, HAIR); // moustache
    for (const [x, d] of [[9, 0], [30, 1]]) {
      g.rect(x, 16, x + 3, 23, d ? dark(SU) : SU); // short arms
      g.rect(x - 1, 24, x + 3, 25, SK);
    }
    g.oval(35, 12, 38, 15, C.brass); // the keys to everything
    g.set(36, 13, SU);
    g.pts([[36, 16], [37, 17], [35, 17], [36, 18]], C.steel);
  });

  /* ---------- three tenants, one tenancy ---------- */
  mk('stacked-tenants', 'stacked tenants three heads on one body tower of faces many arms tall thing large', (g0, r) => {
    const g = g0.at(0, 0),
      SK = PALE;
    g.man({ skin: SK, top: hex('#6a6a58'), legs: C.black, tl: 9, ll: 8, arms: r ? 'out' : 'down', face: r ? 'gape' : 'calm', hair: ['parted', C.woodDark] });
    g.head(0, -9, hex('#c4ae96'), r ? 'scream' : 'dead', ['crop', GREY], K);
    g.head(0, -18, SK, r ? 'gape' : 'stare', ['bun', hex('#8a8474')], K);
    for (const v of [g, g.flip(15)]) {
      if (r) {
        v.arm([[4, 3], [-2, -1], [-5, 4]], SK, 1, 'd', SK, 2);
        v.arm([[4, -6], [-1, -12], [-4, -16]], SK, 1, 'u', SK, 2);
      } else {
        v.limb([[3, 3], [2, 6], [2, 10]], SK, 1); // more arms than one man has
        v.limb([[3, -6], [2, -3], [2, 1]], SK, 1);
      }
    }
  });

  /* ---------- the mattress by the bins ---------- */
  mk('mattress-crawler', 'mattress crawler dumped stained mattress springs feet under it inchworm mouth large long', (g, r) => {
    const M = hex('#b5ab94'),
      ST = hex('#7e8794'),
      SK = PALE;
    const sp = curve(r ? [[4, 1], [10, 6], [18, 4], [26, 4], [34, 10], [44, 12]] : [[4, 12], [16, 12], [30, 12], [44, 12]], 5);
    if (r) for (const x of [15, 19, 24, 28]) {
      g.rect(x, 6, x + 1, 15, x % 2 ? SK : dark(SK)); // the legs it has under there
      g.row(16, x - 1, x + 1, SK);
    }
    for (const [x, y] of sp) g.rect(Math.round(x), Math.round(y) - 3, Math.round(x), Math.round(y) + 3, M);
    g.each(0, -6, 48, 16, (p, x, y) => (p === M && x % 4 === 0 ? ST : null)); // ticking
    for (let i = 0; i < sp.length; i++) {
      const [x, y] = sp[i].map(Math.round);
      g.set(x, y - 3, lite(M));
      g.set(x, y + 3, dark(M));
      if (i % 5 === 2) g.set(x, y, C.stoneDark); // buttons
    }
    g.oval(20, r ? 2 : 10, 28, r ? 7 : 14, hex('#9a8a5e')); // a stain
    g.oval(22, r ? 3 : 11, 26, r ? 6 : 13, hex('#8a744e'));
    g.pts([[33, 8], [34, 6], [33, 5], [34, 4]], C.steel); // a spring is out
    if (r) {
      g.rect(1, -1, 6, 2, MOUTH); // the end of it gapes
      g.pts([[2, -1], [4, -1], [6, -1], [3, 2], [5, 2]], C.steel);
      g.rect(1, -3, 7, -2, M);
      g.rect(1, 3, 6, 4, M);
      g.set(8, -1, YEL);
    } else {
      for (const x of [9, 17, 26, 38]) g.rect(x, 16, x + 1, 16, SK); // toes
    }
  });

  /* ---------- the pipes in the boiler room ---------- */
  mk('pipe-hydra', 'pipe hydra boiler room pipes three heads valves steam plumbing serpent large', (g, r) => {
    const PI = hex('#6a7a6a'),
      CU = hex('#a0603a');
    const neck = (pts, col, wheel) => {
      const p = curve(pts, 6);
      g.tube(p, 1.8, 1.6, col);
      for (let i = 4; i < p.length - 3; i += 6) {
        g.set(p[i][0] - 1, p[i][1], lite(col)); // joints
        g.set(p[i][0] + 1, p[i][1], vd(col));
      }
      const [x, y] = pts[pts.length - 1],
        [px, py] = pts[pts.length - 2],
        dx = Math.sign(x - px) || 1;
      g.rect(x - 2, y - 2, x + 2, y + 2, col); // the head: an open end
      g.rect(x + (dx > 0 ? 1 : -2), y - 1, x + (dx > 0 ? 2 : -1), y + 1, MOUTH);
      if (r) {
        g.pts([[x + (dx > 0 ? 2 : -2), y - 1], [x + (dx > 0 ? 2 : -2), y + 1]], TOOTH);
        g.pts([[x + dx * 4, y - 1], [x + dx * 6, y - 2], [x + dx * 5, y + 1]], C.ghost); // steam
      }
      g.row(y - 3, x - 2, x + 2, wheel); // the valve wheel is its crest
      g.set(x, y - 4, wheel);
      g.set(x - dx, y - 1, r ? YEL : K);
    };
    if (r) {
      neck([[11, 46], [10, 30], [4, 18], [-3, 12], [-8, 14]], PI, C.red);
      neck([[15, 46], [15, 26], [17, 10], [13, 1], [8, 0]], CU, C.red);
      neck([[19, 46], [21, 32], [27, 24], [33, 22], [37, 25]], PI, C.red);
    } else {
      neck([[11, 46], [10, 32], [7, 24], [3, 24], [2, 29]], PI, C.red);
      neck([[15, 46], [15, 28], [16, 14], [19, 9], [23, 12]], CU, C.red);
      neck([[19, 46], [21, 36], [25, 31], [28, 33], [28, 37]], PI, C.red);
    }
    g.rect(8, 44, 22, 46, C.ironDark); // the flange they come up through
    g.row(44, 8, 22, C.iron);
    g.drips(9, 21, 40, C.water, 4, 2, 5);
  });

  /* ---------- the thing on the fire escape ---------- */
  mk('fire-escape-climber', 'fire escape climber iron ladder spider rungs legs hooks lamp head rust large long', (g, r) => {
    const I = hex('#3a3a44'),
      RU = C.rust,
      F = 26;
    const ladder = (x0, y0, x1, y1) => {
      const n = Math.hypot(x1 - x0, y1 - y0),
        ux = (x1 - x0) / n,
        uy = (y1 - y0) / n;
      for (let i = 0; i <= n; i++) {
        const x = x0 + ux * i,
          y = y0 + uy * i;
        g.set(x, y, I);
        g.set(x - uy * 4, y + ux * 4, I);
        if (i % 4 === 2) g.line(x, y, x - uy * 4, y + ux * 4, i % 8 === 2 ? RU : I);
      }
    };
    const leg = (x, y, kx, ky, fx, fy, hook) => {
      g.limb([[x, y], [kx, ky], [fx, fy]], I, 2);
      if (hook) g.pts([[fx - 1, fy + 1], [fx - 2, fy], [fx - 2, fy - 1]], C.steel);
      else g.row(fy, fx - 1, fx + 1, I);
    };
    if (r) {
      leg(34, 16, 40, 8, 44, F);
      leg(30, 14, 34, 4, 38, F);
      leg(24, 11, 30, 2, 31, F);
      ladder(38, 14, 12, -2);
      leg(18, 5, 12, -8, 4, -2, 1);
      leg(14, 1, 8, -12, 1, -9, 1);
      leg(22, 8, 14, 12, 8, 18, 1);
      g.box(5, -8, 10, -2, I); // its lamp
      g.rect(6, -7, 9, -3, REDEYE);
      g.set(7, -6, C.flameLight);
      g.pts([[3, -6], [2, -9], [4, -1], [12, -9]], C.red);
    } else {
      leg(36, 14, 41, 6, 44, F);
      leg(28, 14, 32, 5, 36, F);
      leg(20, 14, 24, 5, 27, F);
      ladder(40, 13, 8, 13);
      leg(32, 16, 28, 7, 24, F);
      leg(22, 16, 17, 6, 13, F);
      leg(12, 16, 7, 7, 3, F);
      g.box(3, 11, 8, 17, I);
      g.rect(4, 12, 7, 16, dark(C.red));
      g.set(5, 13, C.red);
    }
  });

  /* ---------- the old woman and her cats ---------- */
  mk('cat-lady-fused', 'cat lady old woman fused with her cats dressing gown cat heads tails growing monster', (g0, r) => {
    const g = g0.at(3, 0),
      GO = hex('#8a7078'),
      CF = hex('#5a5048'),
      CG = hex('#8a7a5a');
    const cat = (x, y, col) => {
      g.rect(x, y, x + 4, y + 3, col);
      g.pts([[x, y - 1], [x + 4, y - 1]], col);
      g.set(x + 1, y + 1, r ? YEL : K);
      g.set(x + 3, y + 1, r ? YEL : K);
      if (r) {
        g.rect(x + 1, y + 2, x + 3, y + 3, MOUTH);
        g.pts([[x + 1, y + 2], [x + 3, y + 2]], TOOTH);
      } else g.set(x + 2, y + 2, RAW);
    };
    for (const [x, d, col] of [[3, -1, CF], [12, 1, CG], [11, 1, CF]]) {
      const top = r ? 16 + (col === CG ? 0 : 3) : 28;
      g.worm([[x, 28], [x + d * 4, r ? 24 : 30], [x + d * (r ? 7 : 6), top]], 1, r ? 1.3 : 0.8, col); // tails from under the hem
    }
    g.man({ skin: PALE, top: GO, robe: GO, shoe: false, arms: r ? 'reach' : 'down', face: r ? 'gape' : 'old', hair: ['perm', hex('#a8a49c')], eye: r ? YEL : K });
    g.col(7, 13, 31, dark(GO));
    g.row(21, 5, 10, C.wine); // the cord
    cat(0, 9, CF); // on her shoulder; in her side; at her knee
    cat(9, 16, CG);
    cat(4, 24, CF);
    if (r) g.pts([[4, 5], [5, 5], [10, 5], [11, 5]], K);
    g.pts([[5, 32], [10, 32]], RAW);
  });

  mk('fly-cloud', 'fly cloud swarm of flies bluebottles shape of a skull buzzing vermin small', (g, r) => {
    const R = rnd(4),
      cols = [K, hex('#2a2e3a'), hex('#34443e')];
    const fly = (x, y) => {
      g.set(x, y, cols[Math.floor(R() * 3)]);
      if (R() < 0.3) g.set(x + 1, y - 1, hex('#8a94a0'));
    };
    if (r) {
      const sk = ['..xxxxxx..', '.xxxxxxxx.', 'xxxxxxxxxx', 'xx..xx..xx', 'xx..xx..xx', 'xxxx..xxxx', '.xxxxxxxx.', '..x.xx.x..', '..xxxxxx..', '...x..x...'];
      sk.forEach((row, j) => [...row].forEach((ch, i) => ch === 'x' && (i + j) % 5 !== 4 && fly(i + 2, j + 1)));
      for (let i = 0; i < 9; i++) fly(Math.floor(R() * 16) - 1, Math.floor(R() * 14) - 1);
      g.set(5, 5, REDEYE);
      g.set(9, 5, REDEYE);
    } else {
      for (let i = 0; i < 34; i++) {
        const a = R() * 6.3,
          d = Math.sqrt(R()) * 6;
        fly(7 + Math.cos(a) * d, 6 + Math.sin(a) * d * 0.8);
      }
    }
    g.shadow(3, 11, 17);
  }, { outline: false, shade: false });

  /* ---------- the sleepwalker ---------- */
  mk('sleepwalker-eyeless', 'sleepwalker no eyes pyjamas man walks asleep eyes in his palms night tenant', (g, r) => {
    const PJ = hex('#8e98a4'),
      SK = PALE;
    g.man({ skin: SK, top: PJ, legs: PJ, shoe: SK, arms: r ? 'fwd' : 'down', face: 'none', hair: ['crop', C.woodDark], hx: r ? 0 : 1, hy: r ? 0 : 1 });
    g.each(0, 12, 15, 30, (p, x) => (p === PJ && x % 3 === 1 ? hex('#6a7484') : null));
    g.pts([[7, 14], [7, 17], [7, 20]], C.white);
    if (r) {
      g.rect(7, 8, 8, 10, MOUTH);
      for (const x of [1, 12]) {
        g.rect(x, 17, x + 2, 19, SK);
        g.row(18, x, x + 2, C.white); // his eyes are in his hands
        g.set(x + 1, 18, K);
        g.row(17, x, x + 2, dark(SK));
      }
    } else {
      g.row(9, 8, 9, vd(SK));
      g.pts([[6, 7], [7, 7], [10, 7], [11, 7]], dark(SK)); // where eyes would be, skin
    }
  });

  mk('ball-headed-boy', 'boy with a ball for a head child football stairwell rubber ball mouth small', (g, r) => {
    const BA = hex('#a04a3a');
    g.man({ skin: PALE, top: hex('#7a8a6a'), sleeve: PALE, legs: C.navy, tl: 7, ll: 6, head: false, arms: r ? 'out' : 'down' });
    g.each(4, 12, 11, 18, (p, x, y) => (y % 3 === 1 && p[1] > 120 ? C.white : null));
    g.rect(7, 10, 8, 12, PALE);
    g.ball(2, 0, 13, 10, BA);
    if (r) {
      g.rect(3, 5, 12, 6, MOUTH); // the ball splits along its seam
      for (let x = 3; x <= 12; x += 2) {
        g.set(x, 4, TOOTH);
        g.set(x + 1, 7, TOOTH);
      }
      g.set(3, 5, BA);
      g.set(12, 6, BA);
    } else {
      g.line(3, 6, 12, 4, C.white); // its stripe
      g.set(5, 2, lite(BA));
    }
  });

  mk('lift-button-fingers', 'hand that presses the lift buttons too many fingers crawling hand eye in the palm small', (g, r) => {
    const SK = PALE,
      up = r ? -5 : 0;
    for (const [x, f] of [[4, 1], [5, 4], [7, 7], [9, 10], [10, 13]]) g.limb([[x, 6 + up], [f, 7 + up], [f, 10]], SK, x === 7 ? 1 : 1);
    g.pts([[0, 10], [14, 10]], dark(SK));
    g.ball(3, 1 + up, 11, 7 + up, SK);
    g.rect(6, -2 + up, 8, 1 + up, SK); // the wrist, and where it ends
    g.row(-2 + up, 6, 8, GUM);
    if (r) {
      g.orb(7, 4 + up, 2, [0, 0], YEL);
      g.limb([[11, 3 + up], [15, 0 + up], [16, -4 + up]], SK, 1); // one finger, raised
    } else {
      g.row(4, 5, 9, vd(SK)); // a crease in the palm
      g.set(11, 4, SK);
      g.set(12, 5, SK);
    }
  });

  /* ---------- the rolled carpet ---------- */
  mk('carpet-roll-corpse', 'rolled carpet with someone in it body in a rug feet hair worm crawling large long', (g, r) => {
    const CP = hex('#5a5a44'),
      J = hex('#8a744e'),
      SK = DEAD;
    const sp = r ? [[40, 8], [26, 8], [16, 5], [10, -4], [9, -10]] : [[40, 8], [22, 8], [5, 8]];
    g.rect(42, 6, 46, 7, SK); // bare feet out of one end
    g.rect(42, 9, 46, 10, dark(SK));
    g.pts([[47, 6], [47, 9]], SK);
    g.worm(sp, 3.6, 3.6, CP, dark(CP));
    const p = curve(sp, 6);
    for (let i = 3; i < p.length; i += 9) g.rect(p[i][0], p[i][1] - 3, p[i][0], p[i][1] + 3, J); // tied with string
    g.speckle(0, -14, 44, 12, lite(CP), 9, 3);
    if (r) {
      g.ball(4, -22, 13, -12, SK); // and the head comes out of the other
      g.strands(3, 14, -22, 9, HAIR, 4, 0.4);
      g.row(-22, 5, 12, HAIR);
      g.rect(6, -18, 7, -17, K);
      g.rect(10, -18, 11, -17, K);
      g.rect(7, -15, 10, -13, MOUTH);
      g.arm([[12, -2], [5, 0], [1, 6]], SK, 2, 'd', SK, 3); // an arm through the pile
      g.pts([[13, -3], [13, -1]], J);
    } else {
      g.oval(1, 5, 6, 11, J); // the rolled end
      g.oval(2, 6, 5, 10, K);
      g.strands(0, 5, 8, 4, HAIR, 4, 0.5); // hair
      g.pts([[-1, 11], [-2, 11], [0, 10]], HAIR);
      g.set(3, 7, YEL);
    }
  });
};
