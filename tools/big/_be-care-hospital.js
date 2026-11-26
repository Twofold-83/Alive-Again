/* The hospital ward at night: 31 creatures. See be-care.js for how mk() works. */
module.exports = (kit, H, mk) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const { P, vd, at, flip, pts, both, curve, disc, tube, worm, limb, hand, fingers, spiderLegs, eye, orb, teeth, maw, face, skull, fig, vol, blob, ragged, fade, shadow, drip, tint, seam, ribs, motes } = H;
  const { PALE, DEAD, SICK, BRUISE, RAW, GUM, GOWN, SCRUB, COAT, EYE, YEL, RED, HAIR, TOOTH } = P;
  const STEEL = C.steel,
    IRON = C.iron,
    GLOVE = hex('#c9c4a4'),
    SHEET = hex('#d8d6cc'),
    NIGHT = C.night,
    WOOD = C.woodLight,
    XD = hex('#2b3a50'),
    XL = hex('#b9d2dc');
  /** An arm as a jointed limb with a hand at its end. */
  const armL = (c, p, col, hnd, dir = 'd', w = 2, len = 2) => {
    limb(c, p, col, w);
    const e = p[p.length - 1];
    hand(c, e[0], e[1], dir, hnd, len);
  };

  /* ---------- the large ones: tall ---------- */
  mk('surgeon-many-arms', 'surgeon with too many arms six arms large tall masked gown scalpel saw monster doctor operating theatre', [30, 46], (c, r) => {
    const SL = dark(SCRUB);
    const A = r
      ? [[[10, 19], [3, 13], [0, 5], 'u'], [[10, 21], [2, 22], [-3, 18], 'l'], [[10, 23], [4, 30], [-1, 34], 'l']]
      : [[[10, 19], [5, 23], [4, 29], 'd'], [[10, 21], [6, 27], [7, 33], 'd'], [[10, 23], [8, 30], [11, 35], 'd']];
    both(c, 29, (v) => A.forEach(([a, b, e, d]) => armL(v, [a, b, e], SL, GLOVE, d)));
    fig(c, 7, 5, { tl: 16, ll: 16, robe: SCRUB, top: SCRUB, arms: 'none', skin: PALE, hair: 'cap', hairCol: SCRUB, face: r ? 'stare' : 'calm', eye: r ? RED : K });
    c.rect(12, 20, 17, 38, lite(SCRUB)); // the apron
    pts(c, [[13, 27], [14, 28], [16, 31], [14, 32]], C.blood);
    if (r) {
      maw(c, 11, 13, 18, 15, { long: true });
      c.rect(12, 17, 17, 18, SHEET); // the mask, pulled down
      c.line(0, 2, 0, -1, STEEL); // scalpel
      c.rect(27, 0, 28, 4, STEEL); // saw
      teeth(c, 29, 29, 0, STEEL, 1);
      pts(c, [[29, 0], [29, 2], [29, 4]], lite(STEEL));
      c.line(-4, 17, -4, 13, STEEL);
      c.line(33, 17, 34, 13, STEEL);
    } else {
      c.rect(11, 13, 18, 14, SHEET);
      c.row(15, 12, 17, SHEET);
      c.row(16, 13, 16, dark(SHEET));
      c.row(14, 12, 17, dark(SHEET));
      c.line(25, 30, 25, 34, STEEL);
    }
  }, [42, 48, 6]);

  mk('drip-stand-walker', 'drip stand walker walking iv pole infusion bag eye tubes needles legs large tall thing monster', [20, 46], (c, r) => {
    const yf = 44,
      top = r ? 0 : 6,
      hub = r ? 32 : 37;
    spiderLegs(c, 10, hub, { n: 3, col: STEEL, yf, kh: r ? 7 : 3, reach: 4, step: 2, body: 0, kd: 1, foot: IRON });
    c.col(10, top, hub, STEEL);
    c.col(11, top + 1, hub, dark(STEEL));
    c.row(top, 5, 15, STEEL); // the hooks
    pts(c, [[5, top + 1], [15, top + 1]], STEEL);
    const by = top + 2;
    c.rect(2, by, 8, by + 9, C.glassLight); // the bag
    c.rect(3, by + 4, 7, by + 8, hex('#b7b06a'));
    c.col(2, by, by + 9, lite(C.glassLight));
    c.rect(13, by, 17, by + 6, C.glassLight);
    c.rect(14, by + 3, 16, by + 5, hex('#8a4a52'));
    if (r) {
      orb(c, 5, by + 3, 2, K, EYE);
      maw(c, 3, by + 7, 7, by + 8, {});
      for (const [p, e] of [
        [[[5, by + 10], [2, by + 16], [-3, by + 14], [-5, by + 8]], [-5, by + 5]],
        [[[6, by + 10], [8, by + 20], [3, by + 26], [-3, by + 24]], [-6, by + 23]],
        [[[15, by + 7], [18, by + 14], [22, by + 12], [23, by + 6]], [24, by + 3]],
      ]) {
        worm(c, p, 0.6, 0.6, hex('#8a9a5a'), { hi: false });
        c.line(p[3][0], p[3][1], e[0], e[1], lite(STEEL));
      }
    } else {
      c.row(by + 3, 4, 6, dark(C.glass)); // the eye, shut
      worm(c, [[5, by + 10], [4, by + 18], [7, by + 24], [8, by + 30]], 0.6, 0.6, hex('#8a9a5a'), { hi: false });
      c.col(8, by + 31, by + 32, lite(STEEL));
      worm(c, [[15, by + 7], [16, by + 14], [13, by + 20]], 0.6, 0.6, hex('#8a9a5a'), { hi: false });
    }
  }, [32, 48, 6]);

  mk('doctor-twofold', 'doctor who is two doctors two heads fused split white coat large tall stitched twin monster', [24, 42], (c, r) => {
    const yf = 40,
      s = r ? 2 : 0;
    for (const x of [5, 10, 15]) {
      c.rect(x, 30, x + 3, yf, C.black); // three legs
      c.rect(x - (x < 10 ? 1 : 0), yf - 1, x + 3 + (x > 10 ? 1 : 0), yf, NIGHT);
    }
    c.rect(4 - s, 13, 19 + s, 31, COAT); // one coat
    c.rect(3 - s, 14, 5 - s, 26, COAT);
    c.rect(18 + s, 14, 20 + s, 26, dark(COAT));
    c.rect(3 - s, 27, 5 - s, 28, PALE);
    c.rect(18 + s, 27, 20 + s, 28, PALE);
    c.col(4 - s, 14, 31, lite(COAT));
    c.col(8, 20, 31, dark(COAT));
    c.col(15, 20, 31, dark(COAT));
    face(c, 3 - s, 3, PALE, r ? 'stare' : 'calm', r ? YEL : K);
    face(c, 13 + s, 4, DEAD, r ? 'stare' : 'dead', r ? YEL : K);
    H.HAIRS.crop(at(c, -1 - s, 0), HAIR);
    H.HAIRS.thin(at(c, 9 + s, 1), C.ash);
    c.rect(6 - s, 12, 8 - s, 13, dark(PALE));
    c.rect(16 + s, 13, 17 + s, 13, dark(DEAD));
    worm(c, [[6 - s, 14], [5 - s, 19], [8 - s, 22]], 0.6, 0.6, IRON, { hi: false }); // stethoscope
    c.set(8 - s, 23, STEEL);
    if (r) {
      c.poly([[11, 12], [14, 16], [14, 28], [12, 32], [10, 28], [9, 16]], K); // it comes apart down the middle
      c.poly([[11, 15], [13, 18], [13, 27], [12, 30], [11, 27], [10, 18]], GUM);
      for (let y = 15; y <= 29; y += 2) pts(c, [[9 + (y > 26 ? 1 : 0), y], [14 - (y > 26 ? 1 : 0), y + 1]], TOOTH);
      c.rect(11, 9, 12, 12, K);
    } else {
      seam(c, 11, 11, 12, 31, vd(COAT));
      c.rect(11, 15, 12, 19, PALE); // a third hand, in the middle
      pts(c, [[10, 20], [12, 20], [13, 19]], PALE);
    }
  }, [28, 42]);

  mk('orderly-too-tall', 'night orderly porter too tall stretched long arms large tall thin white tunic jaw monster', [18, 48], (c, r) => {
    fig(c, r ? 3 : 1, 0, {
      tl: 15, ll: 20, top: COAT, legs: hex('#5b6068'), skin: DEAD, hair: 'crop', hairCol: HAIR, al: r ? 5 : 11,
      arms: r ? 'reach' : 'down', face: r ? 'jaws' : 'hollow', eye: r ? YEL : K, hx: r ? -2 : 0, hy: r ? 2 : 0,
      body(g, yT, yL) {
        g.col(7, yT + 2, yL - 1, dark(COAT));
        pts(g, [[9, yT + 3], [9, yT + 6], [9, yT + 9]], dark(COAT));
        g.rect(8, yT + 1, 9, yT + 1, hex('#5b6068'));
      },
    });
    if (r) {
      c.rect(8, 9, 11, 13, K); // the jaw, down to the chest
      teeth(c, 8, 11, 9, TOOTH, 1);
      teeth(c, 8, 11, 13, TOOTH, 2);
      c.rect(9, 11, 10, 12, GUM);
    }
  }, [30, 48, 9]);

  mk('curtain-thing', 'cubicle curtain thing face pressing through cloth hands feet eyes large tall ward screen ghost monster', [26, 46], (c, r) => {
    const CU = GOWN;
    c.rect(1, 1, 24, 2, STEEL);
    for (let x = 2; x <= 23; x += 3) c.set(x, 3, IRON);
    c.rect(2, 4, 23, 40, CU);
    for (let x = 4; x <= 23; x += 4) c.col(x, 5, 40, dark(CU));
    for (let x = 2; x <= 23; x += 4) c.col(x, 5, 40, lite(CU));
    ragged(c, 2, 23, 40, 2, 4);
    for (const x of [5, 11, 17]) c.rect(x, 42, x + 3, 43, PALE); // feet under the hem: one too many
    pts(c, [[5, 43], [11, 43], [20, 43]], dark(PALE));
    if (r) {
      c.poly([[12, 4], [14, 4], [17, 40], [9, 40]], K); // it parts
      for (const [x, y] of [[12, 9], [13, 15], [11, 21], [14, 26], [12, 32]]) eye(c, x, y, 2, K, YEL);
      fingers(c, 5, 9, 14, 3, PALE, 1);
      fingers(c, 16, 20, 20, 3, PALE, 1);
      armL(c, [[13, 28], [19, 33], [25, 31]], PALE, PALE, 'r');
      c.clear(26, 30);
    } else {
      c.oval(8, 9, 16, 19, lite(CU)); // a face presses through
      c.rect(9, 12, 10, 13, dark(CU));
      c.rect(13, 12, 14, 13, dark(CU));
      c.rect(11, 16, 13, 18, dark(CU));
      for (const x of [4, 18]) {
        c.rect(x, 22, x + 3, 25, lite(CU)); // and hands
        fingers(c, x, x + 3, 19, 3, lite(CU), 1);
      }
    }
  }, [30, 46, 1]);

  /* ---------- the large ones: long ---------- */
  mk('gurney-crawler', 'gurney crawler trolley thing under sheet many arms pale large long patient stretcher monster', [46, 26], (c, r) => {
    const yf = 24;
    [5, 13, 22, 31, 39].forEach((x, i) => {
      const k = i % 2 ? 1 : -1;
      limb(c, [[x, 12], [x - 3 * k, 17 - (r ? 2 : 0)], [x + k, yf]], i % 2 ? dark(PALE) : PALE, 2);
      c.row(yf, x + k - 1, x + k + 2, PALE);
    });
    c.rect(3, 8, 42, 10, hex('#aeb0a4'));
    c.rect(3, 11, 42, 12, STEEL);
    c.row(12, 3, 42, dark(STEEL));
    c.col(2, 5, 11, STEEL);
    c.row(5, 1, 3, STEEL);
    c.oval(6, 3, 38, 9, SHEET); // whatever lies under the sheet
    c.oval(5, 2, 10, 8, SHEET);
    c.oval(14, 1, 19, 6, SHEET);
    c.oval(22, 2, 27, 6, SHEET);
    c.rect(9, 9, 31, 14, SHEET);
    ragged(c, 9, 31, 14, 3, 6);
    for (const x of [12, 17, 23, 28]) c.col(x, 7, 12, dark(SHEET));
    if (r) {
      c.oval(30, -8, 40, 3, SHEET); // it sits up
      c.rect(30, -2, 40, 9, SHEET);
      c.rect(32, -5, 34, -3, K);
      c.rect(37, -5, 39, -3, K);
      c.rect(34, -1, 37, 2, K);
      c.col(31, 0, 8, dark(SHEET));
      armL(c, [[39, 4], [45, 1], [49, 4]], PALE, PALE, 'r');
      armL(c, [[39, 7], [45, 9], [49, 12]], dark(PALE), PALE, 'r');
    } else {
      c.oval(32, 1, 39, 8, SHEET);
      c.rect(1, 9, 3, 10, DEAD); // a hand hangs out
      fingers(c, 1, 3, 11, 2, DEAD, 1);
    }
    vol(c, 4, -8, 41, 14);
  }, [54, 36, 0]);

  mk('long-patient', 'the long patient stretched body gown many arms crawling large long centipede human monster', [48, 20], (c, r) => {
    const yf = 18,
      path = curve(r ? [[4, 13], [14, 10], [24, 12], [31, 8], [34, 0], [39, -5]] : [[4, 13], [14, 10], [24, 12], [34, 10], [39, 10]], 8);
    path.forEach(([x, y], i) => {
      if (i % 6 !== 3) return;
      const k = (i / 6) % 2 ? 1 : -1;
      if (y < 7) armL(c, [[x + 2, y + 1], [x + 7, y - 1], [x + 10, y + 3]], PALE, PALE, 'r', 1);
      else {
        limb(c, [[x, y + 2], [x - 2 * k, y + 4], [x + k, yf]], k > 0 ? PALE : dark(PALE), 2);
        c.row(yf, x + k - 1, x + k + 2, PALE);
      }
    });
    c.rect(0, 13, 4, 15, PALE); // the feet, far behind
    c.rect(0, 15, 1, 16, PALE);
    tube(c, path, 3.2, 3, GOWN);
    path.forEach(([x, y], i) => i % 4 === 0 && c.set(x, y + 1, dark(GOWN)));
    const [hx, hy] = path[path.length - 1];
    face(c, Math.round(hx), Math.round(hy) - 5, PALE, r ? 'jaws' : 'hollow', r ? YEL : K);
    pts(c, [[Math.round(hx) + 2, Math.round(hy) - 6], [Math.round(hx) + 5, Math.round(hy) - 6]], HAIR);
  }, [52, 32, 0]);

  mk('bed-beast', 'hospital bed beast mattress mouth teeth iron legs pillow tongue large long furniture monster mimic', [46, 30], (c, r) => {
    const yf = 28,
      MAT = hex('#c2c0b0');
    for (const [x, k] of [[6, -1], [14, 1], [32, -1], [40, 1]]) {
      limb(c, [[x, 21], [x + 2 * k, r ? 23 : 25], [x - k, yf]], IRON, 2); // legs like a dog's
      pts(c, [[x - k - 1, yf], [x - k + 2, yf]], STEEL);
    }
    c.rect(2, 4, 3, 22, STEEL); // head rail
    c.rect(2, 4, 9, 4, STEEL);
    for (const x of [5, 7, 9]) c.col(x, 5, 12, dark(STEEL));
    c.rect(42, 11, 43, 22, STEEL);
    c.rect(4, 19, 41, 21, IRON);
    c.rect(4, 15, 41, 18, MAT);
    for (let x = 6; x < 41; x += 4) c.col(x, 16, 18, dark(MAT));
    if (r) {
      c.poly([[4, 13], [41, 1], [42, 5], [8, 15]], MAT); // the top half lifts
      c.poly([[10, 10], [41, 0], [41, 2], [12, 12]], GOWN);
      c.poly([[9, 15], [41, 6], [41, 15]], K);
      for (let x = 12; x <= 40; x += 3) {
        c.col(x, Math.round(15 - (x - 8) * 0.27), Math.round(16 - (x - 8) * 0.27) + 1, TOOTH);
        c.col(x + 1, 13, 14, TOOTH);
      }
      c.poly([[20, 13], [38, 11], [45, 14], [44, 18], [38, 14]], RAW); // tongue
      orb(c, 14, 7, 1.6, K, YEL);
    } else {
      c.rect(10, 12, 41, 14, GOWN); // blanket
      c.row(12, 10, 41, lite(GOWN));
      c.rect(4, 12, 9, 14, SHEET); // pillow
      c.row(15, 8, 41, K); // the line where it opens
      teeth(c, 30, 40, 15, TOOTH, 2);
      c.row(13, 13, 15, dark(GOWN)); // a shut eye in the blanket
    }
  }, [48, 32, 0]);

  mk('iron-lung-grub', 'iron lung grub breathing machine cylinder head portholes eyes many legs large long patient monster', [44, 24], (c, r) => {
    const yf = 22,
      T = hex('#a9b29a');
    for (let x = 8; x <= 34; x += 3) {
      c.col(x, 16, yf - (x % 2), PALE); // soft little legs
      c.set(x + 1, yf - (x % 2), PALE);
    }
    c.rect(8, 4, 34, 16, T);
    c.oval(5, 4, 12, 16, T);
    c.oval(30, 4, 37, 16, dark(T));
    for (const x of [13, 21, 29]) c.col(x, 4, 16, dark(T));
    c.row(5, 9, 33, lite(T));
    for (let y = 6; y <= 14; y += 2) c.rect(2, y, 5, y, IRON); // bellows
    c.rect(1, 5, 2, 15, C.ironDark);
    for (const x of [17, 25]) {
      c.oval(x - 2, 8, x + 2, 12, K); // portholes
      if (r) eye(c, x - 1, 10, 2, K, YEL);
      else c.rect(x - 1, 9, x + 1, 11, C.glass);
    }
    if (r) {
      armL(c, [[17, 12], [14, 18], [11, 20]], PALE, PALE, 'd', 1);
      armL(c, [[25, 12], [28, 18], [31, 20]], PALE, PALE, 'd', 1);
      worm(c, [[36, 10], [40, 8], [42, 2], [44, -2]], 1.6, 1.4, PALE); // the neck, let out
      face(c, 40, -9, PALE, 'jaws', YEL);
    } else {
      c.rect(36, 8, 37, 12, IRON); // collar
      face(c, 37, 5, PALE, 'dead');
    }
  }, [50, 34, 0]);

  /* ---------- person-sized ---------- */
  mk('sheet-thing', 'the thing under the sheet covered body morgue shroud too many knees hand ghost monster', [30, 16], (c, r) => {
    const yf = 14;
    if (r) {
      c.poly([[2, yf], [5, 8], [10, -4], [14, -11], [18, -11], [22, -3], [26, 9], [28, yf]], SHEET);
      c.oval(11, -13, 20, -3, SHEET);
      c.rect(12, -9, 14, -7, K);
      c.rect(17, -9, 19, -7, K);
      c.poly([[13, -4], [18, -4], [17, 2], [14, 2]], K);
      for (const x of [8, 12, 19, 23]) c.line(x, 2, x + (x < 15 ? -3 : 3), yf, dark(SHEET));
      for (const x of [3, 9, 20, 25]) fingers(c, x, x + 2, yf - 2, 3, DEAD, 1); // four hands lift the hem
    } else {
      c.oval(2, 7, 27, yf + 2, SHEET);
      for (const [x, y] of [[4, 5], [10, 3], [15, 5], [20, 2], [24, 5]]) c.oval(x - 2, y, x + 3, y + 7, SHEET); // too many knees
      c.clearRect(0, yf + 1, 29, yf + 3);
      for (const x of [7, 13, 18, 23]) c.col(x, 8, yf, dark(SHEET));
      c.rect(0, yf - 1, 2, yf, DEAD);
      pts(c, [[0, yf - 2], [28, yf], [28, yf - 1]], DEAD);
      c.set(27, yf - 2, hex('#b7a35a')); // toe tag
    }
    vol(c, 1, -13, 28, yf);
  }, [30, 30]);

  mk('nurse-mask-face', 'nurse whose mask is her face surgical mask mouth teeth night sister uniform syringe monster', [16, 34], (c, r) => {
    const U = hex('#8fa6b4');
    fig(c, 0, 1, {
      top: U, robe: U, ll: 8, skin: PALE, apron: SHEET, hair: 'bun', hairCol: HAIR, face: r ? 'none' : 'calm', arms: { l: r ? 'up' : 'hold', r: 'down' },
      body(g, yT, yL, yF) {
        g.rect(5, yF + 1, 6, yF + 2, PALE);
        g.rect(9, yF + 1, 10, yF + 2, PALE);
        g.rect(4, yF + 2, 6, yF + 2, NIGHT);
        g.rect(9, yF + 2, 11, yF + 2, NIGHT);
      },
    });
    c.rect(5, 2, 10, 3, SHEET); // cap
    c.set(7, 2, C.red);
    if (r) {
      pts(c, [[5, 7], [6, 7], [9, 7], [10, 7]], EYE);
      c.rect(4, 9, 11, 12, SHEET);
      maw(c, 4, 10, 11, 11, { step: 1 }); // the mask opens: it was her mouth all along
      pts(c, [[3, 9], [12, 9], [3, 8], [12, 8]], GUM);
      c.col(0, -3, 2, lite(STEEL)); // syringe, raised
      c.rect(-1, 3, 1, 5, C.glassLight);
    } else {
      c.rect(4, 9, 11, 11, SHEET);
      c.row(12, 6, 9, dark(SHEET));
      c.row(10, 5, 10, dark(SHEET));
      pts(c, [[3, 8], [12, 8]], dark(SHEET));
      c.rect(6, 15, 6, 18, C.glassLight);
      c.set(6, 14, lite(STEEL));
    }
  }, [18, 38, 2]);

  mk('bandage-mummy', 'bandage mummy unravelling wrapped patient hollow nothing inside burns ward eye monster', [18, 34], (c, r) => {
    const B = hex('#cfc8b0');
    fig(c, 1, 1, { skin: B, top: B, legs: B, shoe: false, hand: B, face: 'none', arms: r ? { l: 'reach', r: 'out' } : 'down' });
    for (let y = 5; y <= 31; y += 3) for (let x = 0; x <= 17; x++) if (c.get(x, y) && c.get(x, y) !== K) c.set(x, y + ((x >> 1) & 1), dark(B));
    if (r) {
      c.rect(7, 16, 11, 21, NIGHT); // nothing inside
      c.rect(9, 6, 12, 10, NIGHT);
      c.rect(6, 25, 8, 29, NIGHT);
      eye(c, 10, 8, 2, K, YEL);
      for (const p of [[[7, 16], [2, 18], [-2, 24], [-3, 31]], [[12, 6], [16, 2], [20, 4], [21, 10]], [[8, 25], [13, 27], [18, 26], [21, 30]]]) worm(c, p, 0.6, 0.6, B, { hi: false });
    } else {
      c.rect(9, 7, 11, 7, K);
      c.set(10, 7, YEL);
      c.col(2, 22, 28, B); // a loose end
      c.set(1, 29, B);
      c.col(15, 22, 25, dark(B));
    }
  }, [26, 34]);

  mk('wheelchair-fused', 'wheelchair fused with its patient grown together spokes fingers gown chair thing monster', [24, 28], (c, r) => {
    const yf = 26,
      up = r ? 6 : 0;
    disc(c, 9, 18, 7.4, STEEL); // the big wheel
    disc(c, 9, 18, 6, null);
    for (let y = 12; y <= 24; y++) for (let x = 3; x <= 15; x++) if (Math.hypot(x - 9, y - 18) < 6.2) c.clear(x, y);
    for (let a = 0; a < 8; a++) c.line(9, 18, 9 + Math.cos(a * 0.785) * (r ? 10 : 6), 18 + Math.sin(a * 0.785) * (r ? 8 : 6), PALE); // spokes of bone
    c.rect(8, 17, 10, 19, DEAD);
    c.rect(5, 5, 6, 18, IRON); // the back
    c.row(5, 3, 6, IRON);
    c.rect(6, 16, 18, 17, IRON);
    c.rect(18, 17, 19, 23, PALE); // shins that are the frame
    c.rect(17, 24, 22, 24, IRON);
    disc(c, 19, 25, 1, STEEL);
    c.rect(7, 8 - up, 13, 16, GOWN); // the body grows up out of the seat
    c.col(7, 8 - up, 16, lite(GOWN));
    if (r) for (let y = 4; y <= 14; y += 2) c.row(y, 8, 12, dark(GOWN));
    c.rect(12, 14, 18, 16, GOWN);
    face(c, 7, -1 - up, PALE, r ? 'jaws' : 'dead', YEL);
    H.HAIRS.thin(at(c, 3, -4 - up), HAIR);
    if (r) {
      armL(c, [[13, 4], [18, 0], [21, -5]], PALE, PALE, 'u', 1, 3);
      armL(c, [[7, 4], [2, 1], [0, -4]], PALE, PALE, 'u', 1, 3);
    } else limb(c, [[12, 10], [14, 14], [10, 17]], PALE, 2); // an arm grown into the rim
  }, [28, 36, 2]);

  mk('xray-ghost', 'x-ray ghost radiograph skeleton see-through blue glowing bones floating spectre', [18, 36], (c, r) => {
    fig(c, 1, 0, { skin: XD, top: XD, legs: XD, shoe: false, hand: XD, face: 'none', arms: r ? 'up' : 'down' });
    tint(c, 0, 0, 17, 35, (p) => (p === K ? null : (p[2] > 90 ? lite(XD) : XD)));
    skull(c, 5, 3, XL, r ? K : XD);
    if (r) {
      pts(c, [[7, 7], [11, 7]], YEL);
      c.rect(7, 10, 10, 12, K);
      teeth(c, 7, 10, 10, XL, 1);
    }
    c.col(8, 12, 22, XL);
    ribs(c, 6, 11, 14, 4, XL);
    c.rect(6, 22, 11, 23, XL);
    c.set(8, 23, XD);
    for (const x of [6, 11]) {
      c.col(x, 24, 31, XL);
      c.set(x, 27, XD);
    }
    if (r) both(c, 17, (v) => { v.col(2, 3, 11, XL); v.set(2, 7, XD); });
    else both(c, 17, (v) => { v.col(3, 14, 22, XL); v.set(3, 18, XD); });
    fade(c, 0, 17, 27, 32);
    shadow(c, 4, 13, 34);
  });

  mk('incubator-thing', 'incubator thing too big inside glass box eye fingers long arms portholes baby unit monster', [24, 28], (c, r) => {
    const yf = 26,
      CR = hex('#b9b6a2');
    for (const x of [4, 19]) {
      c.rect(x, 18, x + 1, yf - 1, STEEL);
      c.rect(x - 1, yf, x + 2, yf, IRON);
    }
    c.rect(2, 14, 21, 18, CR);
    c.row(14, 2, 21, lite(CR));
    c.rect(3, 4, 20, 13, C.glassLight);
    c.frame(3, 4, 20, 13, STEEL);
    c.rect(5, 6, 18, 12, PALE); // it fills the box
    c.rect(5, 6, 18, 6, dark(PALE));
    orb(c, 9, 9, 2, K, r ? YEL : EYE);
    pts(c, [[14, 7], [16, 8], [15, 10], [17, 11]], dark(PALE)); // folds
    for (const x of [8, 15]) c.oval(x - 1, 15, x + 1, 17, K); // the arm holes
    if (r) {
      c.rect(3, 1, 20, 2, STEEL); // the lid, pushed up
      c.rect(6, 2, 17, 5, PALE);
      eye(c, 12, 3, 2, K, YEL);
      eye(c, 15, 4, 2, K, YEL);
      armL(c, [[8, 16], [1, 18], [-2, 25]], PALE, PALE, 'd', 1, 2);
      armL(c, [[15, 16], [22, 18], [25, 25]], dark(PALE), PALE, 'd', 1, 2);
    } else {
      fingers(c, 13, 17, 9, 2, lite(PALE), 1);
      c.set(8, 16, PALE);
    }
  }, [30, 30]);

  mk('morgue-dweller', 'morgue drawer dweller mortuary fridge hatch pale corpse crawling out fingers eyes hair toe tag monster', [24, 22], (c, r) => {
    const yf = 20;
    c.rect(1, 1, 22, yf, hex('#737884'));
    c.row(1, 1, 22, lite(STEEL));
    c.frame(2, 3, 10, 12, IRON); // a hatch that stays shut
    c.rect(8, 7, 9, 8, STEEL);
    c.rect(12, 3, 21, 12, K); // and one that is open
    c.frame(12, 3, 21, 12, IRON);
    c.rect(2, 14, 21, 15, IRON);
    if (r) {
      c.rect(13, 6, 19, 12, PALE);
      c.rect(14, 12, 18, 16, PALE); // the head, hanging
      c.rect(13, 11, 19, 14, HAIR);
      c.col(13, 14, 18, HAIR);
      c.col(19, 14, 17, HAIR);
      eye(c, 15, 15, 1, K, YEL);
      eye(c, 17, 15, 1, K, YEL);
      c.row(16, 15, 17, K);
      armL(c, [[13, 8], [9, 12], [8, yf - 1]], PALE, PALE, 'd', 2, 1);
      armL(c, [[19, 8], [24, 12], [25, yf - 1]], dark(PALE), PALE, 'd', 2, 1);
      c.set(10, 17, hex('#b7a35a'));
    } else {
      eye(c, 15, 7, 1, K, YEL);
      eye(c, 18, 7, 1, K, YEL);
      fingers(c, 13, 19, 11, 2, PALE, 1);
      c.set(21, 13, hex('#b7a35a')); // a toe tag caught in the door
      c.set(21, 14, hex('#b7a35a'));
    }
  }, [30, 22]);

  mk('anaesthetist-hose', 'anaesthetist gas mask hose into his own chest rubber scrubs sleep doctor hose mouth monster', [16, 34], (c, r) => {
    fig(c, 0, 1, { top: SCRUB, legs: dark(SCRUB), skin: DEAD, hair: 'cap', hairCol: SCRUB, face: r ? 'scream' : 'stare', eye: r ? K : K, arms: { l: 'down', r: r ? 'out' : 'down' } });
    const R = hex('#2c2b33');
    if (r) {
      worm(c, [[8, 20], [3, 22], [-2, 17], [-1, 11], [-5, 8]], 1.2, 1.2, R, { hi: false });
      disc(c, -6, 7, 2.4, R); // the mask end, looking for a face
      disc(c, -6, 7, 1.2, GUM);
      pts(c, [[-7, 6], [-5, 6], [-7, 8], [-5, 8]], TOOTH);
      c.rect(7, 19, 9, 21, K);
    } else {
      c.rect(5, 9, 10, 12, R);
      c.row(9, 6, 9, lite(R));
      worm(c, [[8, 13], [12, 16], [10, 20], [8, 20]], 1, 1, R, { hi: false });
      pts(c, [[11, 15], [11, 18]], lite(R));
    }
  }, [24, 34, 8]);

  mk('crutch-walker', 'crutch walker four crutches legless torso hanging head gown stilts spider patient monster', [22, 30], (c, r) => {
    const yf = 28;
    const cr = (x0, y0, x1, y1) => {
      limb(c, [[x0, y0], [x1, y1]], WOOD, 2);
      c.set(x1, y1, NIGHT);
      c.row(y0, x0 - 1, x0 + 2, dark(WOOD));
    };
    cr(8, 7, 3, yf);
    cr(13, 7, 19, yf);
    if (r) {
      cr(6, 8, -3, 14); // two crutches lifted to stab
      cr(15, 8, 24, 12);
    } else {
      cr(9, 9, 8, yf);
      cr(12, 9, 14, yf);
    }
    c.rect(7, 7, 14, 17, GOWN); // the torso slung between them
    c.col(7, 7, 17, lite(GOWN));
    ragged(c, 7, 14, 17, 2, 2);
    c.rect(9, 18, 10, 20, dark(RAW));
    if (r) {
      face(c, 7, -2, PALE, 'jaws', YEL);
      H.HAIRS.long(at(c, 3, -5), HAIR, 8);
    } else {
      face(c, 7, 10, PALE, 'hollow'); // the head hangs forward
      c.rect(6, 9, 15, 11, HAIR);
      c.col(6, 11, 21, HAIR);
      c.col(15, 11, 19, HAIR);
      c.col(8, 12, 14, HAIR);
    }
  }, [30, 32, 4]);

  mk('matron-swollen', 'matron swollen huge bloated tiny head apron mouth teeth keys sister nurse fat monster', [26, 32], (c, r) => {
    const yf = 30,
      N = C.navy;
    c.rect(8, yf - 2, 10, yf, NIGHT);
    c.rect(15, yf - 2, 17, yf, NIGHT);
    c.oval(2, 8, 23, 29, N);
    c.rect(1, 13, 2, 19, N); // small arms
    c.rect(23, 13, 24, 19, dark(N));
    c.rect(1, 20, 2, 21, PALE);
    c.rect(23, 20, 24, 21, PALE);
    c.oval(6, 10, 19, 28, SHEET); // apron
    c.col(7, 14, 24, lite(SHEET));
    c.rect(10, 2, 15, 8, PALE); // a head far too small
    c.rect(10, 1, 15, 2, SHEET);
    pts(c, [[11, 5], [14, 5]], r ? YEL : K);
    c.row(7, 12, 13, vd(PALE));
    c.set(24, 22, C.brass);
    c.set(24, 23, C.gold);
    if (r) {
      c.oval(4, 14, 21, 24, K); // the apron opens
      c.oval(7, 17, 18, 22, GUM);
      for (let x = 6; x <= 19; x += 2) {
        c.col(x, 15 + (x < 8 || x > 17 ? 1 : 0), 16 + (x < 8 || x > 17 ? 1 : 0), TOOTH);
        c.col(x + 1, 22 - (x < 8 || x > 16 ? 1 : 0), 23 - (x < 8 || x > 16 ? 1 : 0), TOOTH);
      }
    } else {
      c.row(19, 6, 19, dark(SHEET));
      pts(c, [[9, 19], [12, 19], [15, 19]], K);
      c.set(12, 13, C.glassLight); // her watch
    }
    vol(c, 1, 8, 24, 29, 1.15, 0.8);
  });

  mk('patient-stitched', 'stitched patient sewn together from parts third arm gown mismatched seams bursting monster', [18, 34], (c, r) => {
    fig(c, 1, 1, {
      top: GOWN, coat: GOWN, coatLen: 6, legs: PALE, shoe: false, skin: PALE, hair: 'thin', hairCol: HAIR, face: r ? 'jaws' : 'sewn', eye: YEL,
      arms: { l: r ? 'reach' : 'down', r: 'down' }, hx: r ? 2 : 0, hy: r ? -2 : 0,
    });
    tint(c, 12, 13, 15, 24, (p) => (p === PALE ? SICK : null)); // an arm from someone else
    c.rect(5, 4, 8, 7, BRUISE);
    c.set(7, 7, YEL);
    seam(c, 5, 8, 12, 8, K);
    seam(c, 5, 27, 8, 27, K);
    if (r) {
      c.rect(6, 12, 11, 13, K); // the neck gives
      pts(c, [[7, 12], [9, 13], [11, 12]], RAW);
      armL(c, [[9, 18], [13, 16], [17, 12]], SICK, SICK, 'u', 2, 2);
    } else {
      seam(c, 6, 13, 11, 13, K);
      c.rect(9, 17, 11, 19, SICK); // a third hand, folded on the chest
      pts(c, [[8, 18], [8, 20], [12, 20]], SICK);
    }
  }, [22, 36, 2]);

  mk('skeleton-teaching', 'teaching skeleton on a stand anatomy model walks off its hook bones classroom ward monster', [16, 38], (c, r) => {
    const B = C.bone,
      x = r ? 3 : 0,
      y = r ? 3 : 2;
    c.col(8, 0, 36, STEEL); // the stand
    c.rect(4, 36, 12, 36, IRON);
    c.row(0, 8, 10, STEEL);
    if (!r) c.col(10, 1, 3, STEEL);
    const g = at(c, x, y);
    skull(g, 4, 2, B, K);
    if (r) {
      pts(g, [[6, 5], [10, 5]], RED);
      g.rect(6, 10, 9, 12, K);
      teeth(g, 6, 9, 12, B, 1);
    }
    g.col(7, 11 + (r ? 2 : 0), 21, B);
    g.col(8, 11 + (r ? 2 : 0), 21, dark(B));
    g.row(13, 3, 12, B);
    ribs(g, 5, 10, 15, 3, B);
    g.rect(5, 22, 10, 23, B);
    pts(g, [[7, 23], [8, 23]], vd(B));
    for (const xx of [5, 10]) {
      g.col(xx, 24, 32, B);
      g.set(xx, 28, vd(B));
      g.row(33, xx - (xx < 8 ? 1 : 0), xx + (xx > 8 ? 1 : 0), B);
    }
    if (r) {
      armL(g, [[3, 13], [-2, 15], [-5, 11]], B, B, 'u', 1, 2);
      armL(g, [[12, 13], [15, 17], [17, 13]], B, B, 'u', 1, 2);
    } else
      both(g, 15, (v) => {
        v.col(2, 13, 22, B);
        v.set(2, 18, vd(B));
        pts(v, [[1, 23], [3, 23], [2, 24]], B);
      });
  }, [24, 40, 3]);

  mk('monitor-head', 'heart monitor head patient screen for a face flatline green trace cables electrodes machine monster', [16, 34], (c, r) => {
    fig(c, 0, 1, { top: GOWN, coat: GOWN, coatLen: 6, legs: PALE, shoe: false, skin: PALE, head: false, arms: r ? 'fwd' : 'down' });
    const G = hex('#7fd08a'),
      SC = hex('#16261c');
    c.box(3, 2, 12, 11, hex('#8a8878'));
    c.rect(4, 3, 11, 9, SC);
    c.rect(7, 12, 8, 13, IRON);
    pts(c, [[5, 10], [7, 10]], RED);
    if (r) {
      for (let x = 4; x <= 11; x++) c.set(x, 7 + (x % 2), G); // the trace is a mouth
      for (let x = 4; x <= 11; x += 2) c.set(x, 6, G);
      pts(c, [[5, 4], [10, 4]], G);
      worm(c, [[4, 12], [0, 14], [-3, 10]], 0.6, 0.6, IRON, { hi: false });
      worm(c, [[11, 12], [15, 15], [18, 11]], 0.6, 0.6, IRON, { hi: false });
      pts(c, [[-3, 9], [18, 10]], RED);
    } else {
      c.row(6, 4, 11, G); // flat line
      c.set(8, 5, G);
      worm(c, [[5, 12], [4, 15], [6, 17]], 0.6, 0.6, IRON, { hi: false });
      worm(c, [[10, 12], [11, 16], [9, 19]], 0.6, 0.6, IRON, { hi: false });
    }
  }, [24, 34]);

  mk('plaster-cast-man', 'plaster cast man whole body cast arms on a brace cracks open eyes inside fingers white stiff monster', [24, 34], (c, r) => {
    const W = hex('#d4d0c0');
    fig(c, 4, 1, { skin: W, top: W, legs: W, shoe: false, hand: W, face: 'none', arms: r ? { l: 'out', r: 'reach' } : 'out', al: 1 });
    c.rect(8, 6, 15, 7, K); // the slot he looks out of
    c.line(4, 17, 9, 21, IRON); // the brace
    if (!r) c.line(19, 17, 14, 21, IRON);
    c.col(11, 23, 32, dark(W));
    pts(c, [[9, 16], [10, 17], [13, 26], [9, 28]], dark(W));
    if (r) {
      c.poly([[9, 2], [13, 4], [15, 2], [15, 7], [8, 7]], K); // the head has broken open
      pts(c, [[9, 5], [11, 6], [13, 5], [14, 6]], YEL);
      c.poly([[10, 13], [13, 14], [14, 19], [12, 25], [10, 20], [9, 16]], K); // and the chest
      pts(c, [[11, 15], [12, 18], [11, 21]], YEL);
      fingers(c, 9, 13, 13, 2, PALE, -1);
      fingers(c, 13, 15, 19, 3, PALE, 1);
      for (const p of [[[14, 14], [17, 17]], [[8, 25], [7, 29]], [[12, 25], [13, 30]]]) limb(c, p, K, 1);
      pts(c, [[2, 30], [20, 31], [22, 28]], W); // bits of plaster
    } else {
      pts(c, [[10, 6], [13, 6]], EYE);
      limb(c, [[10, 14], [11, 16], [10, 18]], dark(W), 1);
    }
  });

  /* ---------- vermin and small things ---------- */
  mk('organ-jar-escapee', 'organ jar escapee specimen brain crawling out of broken jar veins legs eye small thing', [16, 14], (c, r) => {
    const yf = 12;
    c.rect(1, 6, 7, yf, C.glassLight); // the jar on its side
    c.rect(1, 6, 1, yf, C.brass);
    c.row(6, 2, 7, lite(C.glassLight));
    pts(c, [[7, 7], [8, 9], [7, 11]], C.glassLight);
    c.row(yf, 5, 11, hex('#8a9a5a')); // what it was kept in
    const y = r ? 4 : 7;
    for (const x of [8, 10, 12, 14]) limb(c, [[x, y + 3], [x + (x < 11 ? -1 : 1), yf - 1], [x + (x < 11 ? -1 : 1), yf]], BRUISE, 1);
    c.oval(8, y, 14, y + 4, RAW);
    pts(c, [[9, y + 1], [11, y + 2], [13, y + 1], [10, y + 3], [12, y + 3]], dark(RAW));
    c.row(y, 10, 12, lite(RAW));
    if (r) {
      c.col(11, 0, 3, BRUISE);
      orb(c, 11, 0, 1.2, K, EYE);
      limb(c, [[8, 5], [5, 3], [4, 0]], BRUISE, 1);
      limb(c, [[14, 5], [16, 3], [16, 0]], BRUISE, 1);
    }
  }, [18, 16, 0]);

  mk('pill-bugs', 'pill bugs capsules with legs swarm tablets medicine crawling teeth small vermin', [20, 10], (c, r) => {
    const cols = [[C.wine, SHEET], [C.mustard, SHEET], [C.teal, C.mustard], [SHEET, C.navy]];
    [[1, 7, 0], [7, 8, 1], [13, 7, 2], [4, 3, 3], [11, 3, 0], [15, 2, 1]].forEach(([x, y, k], i) => {
      const [a, b] = cols[k];
      pts(c, [[x, y + 1], [x + 2, y + 1], [x + 4, y + 1]], K);
      if (r && i % 2 === 0) {
        c.rect(x, y - 2, x + 1, y - 1, a); // split open
        c.rect(x + 3, y, x + 4, y, b);
        c.rect(x + 2, y - 1, x + 3, y - 1, K);
        c.set(x + 2, y - 2, TOOTH);
        c.set(x + 2, y, TOOTH);
      } else {
        c.rect(x, y, x + 1, y, a);
        c.rect(x + 2, y, x + 4, y, b);
        c.rect(x, y - 1, x + 1, y - 1, lite(a));
        c.rect(x + 2, y - 1, x + 4, y - 1, lite(b));
        if (r) c.set(x + 4, y - 1, RED);
      }
    });
  });

  mk('syringe-mosquito', 'syringe mosquito flying needle insect blood glass wings small vermin', [18, 14], (c, r) => {
    const y = r ? 5 : 6;
    for (const x of [6, 8, 10]) limb(c, [[x, y + 1], [x - 1 + (r ? -1 : 0), y + 4], [x + (r ? -2 : 0), y + (r ? 6 : 5)]], K, 1);
    c.rect(4, y - 1, 11, y + 1, C.glassLight); // the barrel
    c.rect(7, y - 1, 11, y + 1, C.blood);
    c.row(y - 1, 4, 11, lite(C.glassLight));
    c.rect(2, y - 2, 2, y + 2, STEEL); // plunger
    c.row(y, 2, 4, STEEL);
    c.line(12, y, r ? 17 : 15, y + (r ? 0 : 2), lite(STEEL)); // the needle
    c.set(12, y - 1, r ? RED : K);
    const W = hex('#aebfc4');
    if (r) {
      c.poly([[7, y - 2], [3, y - 6], [6, y - 6], [9, y - 2]], W);
      c.poly([[9, y - 2], [10, y - 6], [13, y - 5], [10, y - 2]], lite(W));
    } else c.poly([[5, y - 2], [1, y - 4], [3, y - 5], [9, y - 2]], W);
    shadow(c, 5, 11, 12);
  });

  mk('bloodbag-leech', 'blood bag leech transfusion bag crawling slug sucker mouth small vermin', [16, 10], (c, r) => {
    const yf = 8;
    worm(c, [[1, yf - 3], [2, yf], [4, yf]], 0.6, 0.6, hex('#8a9a5a'), { hi: false }); // its tube, trailing
    c.rect(4, yf - 4, 11, yf, C.glassLight);
    c.rect(5, yf - 2, 11, yf, C.blood);
    c.row(yf - 4, 5, 10, lite(C.glassLight));
    c.rect(6, yf - 4, 8, yf - 3, SHEET); // label
    if (r) {
      c.oval(10, yf - 8, 15, yf - 2, C.blood);
      c.oval(11, yf - 7, 14, yf - 4, K);
      pts(c, [[11, yf - 6], [14, yf - 6], [12, yf - 7], [13, yf - 4]], TOOTH);
    } else {
      c.oval(11, yf - 3, 14, yf, C.blood);
      c.set(14, yf - 1, K);
    }
    c.row(yf, 4, 12, dark(C.blood));
  }, [18, 14, 0]);

  mk('glove-crawler', 'rubber glove crawler surgical glove walking on fingers hand mouth in the palm small vermin', [12, 10], (c, r) => {
    const yf = 8;
    if (r) {
      c.rect(4, -1, 8, 6, GLOVE); // it rears: palm first
      for (const [x, y] of [[3, -5], [5, -6], [7, -6], [9, -4]]) c.col(x, y, -1, GLOVE);
      c.col(2, 1, 3, GLOVE);
      c.rect(5, 6, 7, yf, dark(GLOVE));
      maw(c, 5, 2, 7, 4, {});
      pts(c, [[5, 0], [7, 0]], YEL);
    } else {
      c.rect(3, 2, 8, 5, GLOVE);
      c.rect(8, 3, 10, 4, dark(GLOVE)); // cuff
      c.row(2, 4, 7, lite(GLOVE));
      for (const x of [2, 4, 6, 8]) c.col(x, 5, yf, GLOVE);
      pts(c, [[2, yf], [6, yf]], dark(GLOVE));
      c.set(1, 4, GLOVE);
    }
  }, [12, 16]);

  mk('bedpan-crab', 'bedpan crab steel pan shell legs claws eye stalks scuttling small vermin', [18, 10], (c, r) => {
    const yf = 8,
      t = r ? -3 : 0;
    for (const x of [4, 7, 11, 14]) limb(c, [[x, 5], [x + (x < 9 ? -2 : 2), 4], [x + (x < 9 ? -3 : 3), yf]], hex('#8a5a48'), 1);
    if (r) {
      c.oval(3, 3, 14, 7, hex('#6a4038'));
      pts(c, [[7, 5], [10, 5]], YEL);
      c.row(7, 6, 11, K);
      limb(c, [[3, 4], [0, 1], [1, -2]], hex('#8a5a48'), 1);
      limb(c, [[14, 4], [17, 1], [16, -2]], hex('#8a5a48'), 1);
      pts(c, [[0, -3], [2, -3], [15, -3], [17, -3]], hex('#8a5a48'));
    }
    c.oval(2, 1 + t, 15, 6 + t, STEEL); // the pan
    c.row(2 + t, 5, 12, lite(STEEL));
    c.rect(15, 3 + t, 17, 4 + t, STEEL);
    c.row(5 + t, 4, 13, dark(STEEL));
    if (!r) pts(c, [[5, 6], [12, 6]], YEL);
  }, [20, 14]);

  mk('stethoscope-snake', 'stethoscope snake rubber tube serpent steel head ear pieces fangs coiled small vermin', [16, 12], (c, r) => {
    const R = hex('#34323c'),
      yf = 10;
    c.oval(2, yf - 3, 12, yf, R);
    c.oval(4, yf - 2, 10, yf - 1, K);
    c.row(yf - 3, 4, 10, lite(R));
    if (r) {
      worm(c, [[10, yf - 2], [12, yf - 6], [8, yf - 10], [9, yf - 14]], 1, 1, R, { hi: false });
      disc(c, 9, yf - 16, 2.2, STEEL); // the head: it listens for you
      c.set(9, yf - 16, RED);
      limb(c, [[8, yf - 12], [5, yf - 14], [4, yf - 18]], R, 1);
      limb(c, [[10, yf - 12], [13, yf - 14], [14, yf - 18]], R, 1);
      pts(c, [[4, yf - 19], [14, yf - 19]], C.bone);
    } else {
      worm(c, [[11, yf - 2], [13, yf - 4], [14, yf - 1]], 1, 1, R, { hi: false });
      disc(c, 14, yf - 1, 1.2, STEEL);
      limb(c, [[3, yf - 2], [1, yf - 4]], R, 1);
      limb(c, [[4, yf - 3], [3, yf - 6]], R, 1);
      pts(c, [[1, yf - 5], [3, yf - 7]], C.bone);
    }
  }, [18, 22, 1]);

  mk('hand-walker', 'hand walker legless torso walking on its hands half a patient gown spine trailing monster', [22, 18], (c, r) => {
    const yf = 16;
    worm(c, [[4, 9], [2, 13], [0, yf]], 1, 0.6, C.bone, { hi: false }); // the spine, behind
    c.poly([[4, 6], [14, 4], [15, 11], [5, 12]], GOWN);
    ragged(c, 4, 8, 12, 2, 3);
    c.line(5, 7, 13, 5, lite(GOWN));
    limb(c, [[7, 9], [5, 12], [7, yf]], dark(PALE), 2);
    c.row(yf, 6, 10, PALE);
    if (r) {
      armL(c, [[13, 7], [17, 3], [21, 1]], PALE, PALE, 'u', 2, 2);
      face(c, 13, -3, PALE, 'jaws', YEL);
    } else {
      limb(c, [[13, 8], [16, 12], [14, yf]], PALE, 2);
      c.row(yf, 13, 17, PALE);
      face(c, 13, 3, PALE, 'hollow');
    }
    pts(c, [[14, r ? -4 : 2], [17, r ? -4 : 2], [19, r ? -3 : 3]], HAIR);
  }, [26, 24, 0]);
};
