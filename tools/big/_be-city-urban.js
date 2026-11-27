/* The rough side of town: things made of scaffolding, rubbish, wire and concrete. See be-city.js. */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd }, { fig, head, vd, P }, be) => {
  const { EYE, RED, YEL, BONE, NIGHT, MOUTH, GUM, TONGUE, PALE, ASHEN, LAMP, SICK, RAW } = P;
  const STEEL = hex('#8b8e98'),
    RUST = C.rust,
    CONC = hex('#8a8784'),
    BAG = hex('#24222c'),
    SHEEN = hex('#4a4858'),
    CARD = hex('#a8855c'),
    DUMP = hex('#3f5a4a'),
    MAG = hex('#9a4a6a'),
    TEAL = hex('#3f8a8a'),
    GLASS = hex('#232a36'),
    LIT = hex('#8a8250'),
    ASPH = hex('#3a3a44'),
    PIPE = hex('#55565f');
  /** n teeth on an ellipse. */
  const ring = (g, cx, cy, rx, ry, n, col, a0 = 0) => {
    for (let i = 0; i < n; i++) g.set(Math.round(cx + Math.cos(a0 + (i / n) * 6.283) * rx), Math.round(cy + Math.sin(a0 + (i / n) * 6.283) * ry), col);
  };

  /* ================= LARGE, TALL ================= */
  be('urban-scaffold-spider', 'scaffold spider large tall scaffolding poles for legs tarpaulin body building site monster many eyes', 32, 48, (g, R) => {
    const by = R ? 10 : 0,
      TARP = hex('#3a3f4a');
    g.row(34, 3, 28, PIPE);
    g.col(9, 35, 36, C.straw);
    g.col(22, 35, 36, C.straw);
    g.rect(8, 37, 23, 38, C.wood);
    g.row(37, 8, 23, C.woodLight);
    for (const v of [g, g.flip(31)]) {
      v.limb([[11, 10 + by], [2, 6 + by], [2, 45]], STEEL, 2);
      v.rect(1, 45, 4, 46, RUST);
      v.rect(1, 6 + by, 3, 7 + by, RUST);
      v.rect(1, 26, 4, 27, RUST);
      if (!R) {
        v.limb([[12, 11], [7, 2], [7, 45]], STEEL, 2);
        v.rect(6, 45, 9, 46, RUST);
        v.rect(6, 2, 8, 3, RUST);
        v.rect(6, 20, 9, 21, RUST);
      } else {
        v.limb([[12, 11 + by], [5, 17], [-1, 4]], STEEL, 2);
        v.rect(4, 16, 6, 18, RUST);
        v.pts([[-1, 3], [-2, 2], [0, 2]], RUST);
      }
    }
    g.oval(9, 3 + by, 22, 15 + by, TARP);
    g.mesh(9, 3 + by, 22, 15 + by, hex('#565c6a'), TARP);
    g.line(11, 6 + by, 14, 4 + by, hex('#7a8090'));
    g.oval(12, 13 + by, 19, 20 + by, hex('#2a2c34'));
    for (const [x, y] of [[13, 16], [15, 15], [16, 15], [18, 16], [14, 18], [17, 18]]) g.set(x, y + by, R ? RED : LIT);
    if (R) {
      g.col(14, 21 + by, 24 + by, BONE);
      g.col(17, 21 + by, 24 + by, BONE);
    } else g.pts([[14, 21], [17, 21]], BONE);
  }, { u: [36, 48, 2] });

  be('urban-crane-giant', 'crane giant large tall crane armed colossus tower crane girders hook hand building site monster', 32, 48, (g, R) => {
    const Y = hex('#a8862e');
    g.lattice(11, 30, 8, 44, 2, Y);
    g.lattice(15, 30, 18, 44, -2, Y);
    g.box(5, 44, 10, 46, CONC);
    g.box(16, 44, 21, 46, CONC);
    g.lattice(11, 11, 11, 30, -6, Y);
    g.rect(9, 10, 19, 11, dark(Y));
    g.rect(9, 30, 19, 31, dark(Y));
    if (!R) {
      g.line(18, 2, 30, 11, C.ironDark);
      g.lattice(18, 13, 30, 13, -2, Y);
      g.col(29, 14, 27, C.ironDark);
      g.pts([[29, 28], [28, 29], [28, 30], [29, 31], [30, 30]], STEEL);
      g.line(10, 2, 3, 11, C.ironDark);
      g.lattice(10, 13, 3, 13, 2, Y);
      g.box(1, 14, 6, 19, CONC);
    } else {
      g.lattice(18, 13, 30, 3, -2, Y);
      g.col(30, 4, 20, C.ironDark);
      g.rect(29, 20, 31, 21, RUST);
      g.claws(30, 22, 3, [0, 1], 5, STEEL);
      g.lattice(10, 13, 3, 19, 2, Y);
      g.col(3, 20, 21, C.ironDark);
      g.box(-1, 22, 5, 28, CONC);
      g.line(0, 24, 3, 27, vd(CONC));
    }
    g.box(10, 2, 18, 8, Y); // the cab is its head
    g.row(1, 10, 18, dark(Y));
    g.rect(13, 3, 17, 6, R ? C.flame : GLASS);
    if (R) {
      g.rect(15, 4, 16, 5, K);
      g.rect(11, 9, 17, 9, MOUTH);
      g.teeth(11, 17, 9, 1, BONE, 2, 2);
    } else g.set(14, 4, hex('#55606e'));
  }, { u: [38, 48, 2] });

  be('urban-tenement-walker', 'walking tenement large tall tower block of flats on legs windows are eyes door mouth building monster', 24, 46, (g, R) => {
    const BR = hex('#6a5048');
    for (const x of [6, 14]) {
      g.rect(x, 36, x + 3, 44, PIPE);
      g.col(x, 36, 44, lite(PIPE));
      g.row(40, x, x + 3, dark(PIPE));
      g.rect(x - 1, 43, x + 4, 44, dark(PIPE));
    }
    if (R)
      for (const v of [g, g.flip(23)]) {
        v.limb([[4, 12], [-2, 18], [-4, 28]], PIPE, 2);
        for (const [x, y] of [[2, 14], [0, 16], [-3, 21], [-3, 24]]) v.row(y, x - 1, x + 1, dark(PIPE));
        v.claws(-4, 29, 3, [0, 1], 3, PIPE);
      }
    g.rect(4, 4, 19, 36, BR);
    g.col(4, 4, 36, lite(BR));
    g.rect(3, 3, 20, 4, dark(BR));
    g.rect(6, 1, 9, 2, PIPE);
    g.col(16, 1, 2, C.ironDark);
    g.speckle(5, 5, 18, 35, dark(BR), 9, 4);
    for (let r = 0; r < 6; r++)
      for (let c = 0; c < 3; c++) {
        const x = 6 + c * 5,
          y = 7 + r * 4,
          lit = R || [1, 8, 12].includes(r * 3 + c);
        g.rect(x, y, x + 2, y + 2, lit ? (R ? YEL : LIT) : GLASS);
        if (R) g.set(x + 1 + (c === 0 ? 1 : 0), y + 1, K);
      }
    if (!R) {
      g.rect(10, 31, 13, 36, hex('#2a2228'));
      g.set(12, 34, C.brass);
      for (let i = 0; i < 3; i++) {
        g.line(20, 8 + i * 8, 22, 11 + i * 8, PIPE);
        g.line(22, 12 + i * 8, 20, 15 + i * 8, PIPE);
      }
    } else {
      g.rect(6, 30, 17, 36, MOUTH);
      g.teeth(6, 17, 30, 1, BONE, 2, 2);
      g.teeth(7, 17, 36, -1, BONE, 2, 2);
      g.tube([[11, 34], [12, 39], [10, 44]], 1.5, 1, TONGUE);
      g.line(15, 5, 13, 10, vd(BR));
      g.line(13, 10, 14, 14, vd(BR));
    }
  }, { u: [34, 46, 5] });

  be('urban-wire-puppet', 'wire puppet large tall body hanging in overhead wires cables marionette electrocuted dangling', 22, 46, (g0, R) => {
    const g = g0.at(3, 9),
      HD = hex('#55565f'),
      W = hex('#2a2a32'),
      HAIR = hex('#2e2a2a');
    if (!R) {
      g.line(2, 20, 0, -8, W);
      g.line(13, 20, 15, -8, W);
      g.line(8, 4, 8, -8, W);
    } else {
      g.line(-3, 6, -1, -8, W);
      g.line(18, 6, 16, -8, W);
      g.line(8, 1, 8, -8, W);
      g.pts([[-2, 1], [17, -2], [8, -4], [-1, -5], [9, -3]], YEL);
    }
    fig(g, {
      skin: ASHEN,
      top: HD,
      legs: hex('#3a3a46'),
      shoe: hex('#6a6252'),
      hy: R ? 0 : 2,
      hair: HAIR,
      arms: R ? { l: [-3, 7, -2, 13], r: [-3, 7, -2, 13] } : { l: [2, 21, 0, 17], r: [2, 21, 0, 17] },
      face: (h) => {
        if (!R) h.rect(4, 4, 11, 8, HAIR); // the head hangs: only hair
        else {
          h.rect(5, 5, 6, 6, YEL);
          h.rect(9, 5, 10, 6, YEL);
          h.rect(6, 8, 9, 10, MOUTH);
          h.teeth(6, 9, 8, 1, BONE, 1);
        }
      },
    });
    g.pts([[4, 32], [5, 32], [9, 32], [10, 32]], hex('#6a6252')); // the toes point down
    g0.shadow(5, 16, 44);
  }, { u: [28, 46, 3] });

  /* ================= LARGE, LONG ================= */
  be('urban-dumpster-maw', 'dumpster maw large long skip rubbish container mouth lid jaw teeth tongue bin monster', 44, 26, (g, R) => {
    const D = DUMP,
      LID = hex('#2a2a32');
    if (R) {
      g.col(3, -4, 9, dark(D));
      g.col(40, -4, 9, dark(D));
      g.rect(4, 0, 39, 9, MOUTH);
      g.rect(11, 3, 13, 5, YEL);
      g.col(12, 3, 5, K);
      g.rect(29, 3, 31, 5, YEL);
      g.col(30, 3, 5, K);
    }
    g.poly([[3, 9], [40, 9], [38, 22], [5, 22]], D);
    g.row(9, 3, 40, lite(D));
    g.row(10, 3, 40, dark(D));
    for (const x of [10, 18, 26, 34]) g.col(x, 11, 21, dark(D));
    g.rect(1, 12, 3, 14, dark(D));
    g.rect(40, 12, 42, 14, dark(D));
    g.speckle(4, 11, 39, 21, RUST, 9, 3);
    g.rect(20, 15, 23, 17, hex('#b5a47c'));
    g.rect(7, 23, 9, 24, hex('#22202a'));
    g.rect(34, 23, 36, 24, hex('#22202a'));
    if (!R) {
      g.poly([[6, 8], [41, 6], [41, 8]], K);
      g.poly([[2, 5], [41, 3], [41, 5], [2, 8]], LID);
      g.line(2, 5, 41, 3, SHEEN);
      g.pts([[30, 7], [33, 7], [37, 7], [39, 7]], EYE);
      g.pts([[23, 8], [24, 8], [25, 8], [23, 9], [25, 9]], PALE);
      g.oval(11, 5, 16, 8, BAG);
      g.set(12, 6, SHEEN);
    } else {
      g.rect(3, -6, 40, -1, LID);
      g.row(-6, 3, 40, SHEEN);
      g.teeth(5, 38, 0, 1, BONE, 3, 3);
      g.teeth(6, 38, 8, -1, BONE, 3, 3);
      g.tube([[20, 7], [23, 10], [26, 15], [24, 21]], 2.2, 1.4, TONGUE);
      g.oval(23, 12, 28, 15, BAG);
      g.set(24, 13, SHEEN);
    }
  }, { u: [46, 34, 1] });

  be('urban-tunnel-worm', 'tunnel worm large long subway underground train worm segments lamprey mouth headlight pale', 48, 24, (g, R) => {
    const Wm = hex('#a39a8c'),
      D = hex('#6e665c');
    const path = R ? [[4, 16], [12, 15], [22, 17], [30, 13], [34, 3], [39, -4]] : [[4, 16], [12, 14], [24, 17], [34, 14], [40, 15]];
    const p = g.tube(path, 5, 5, Wm, D);
    g.rings(p, 5, 7, D);
    for (let i = 4; i < p.length - 5; i += 7) {
      const tx = p[i + 1][0] - p[i - 1][0],
        ty = p[i + 1][1] - p[i - 1][1],
        l = Math.hypot(tx, ty) || 1;
      for (const k of [0, 1.5]) g.over(Math.round(p[i][0] + (ty / l) * 2 + (tx / l) * k), Math.round(p[i][1] - (tx / l) * 2 + (ty / l) * k), LIT);
    }
    const [hx, hy] = p[p.length - 1];
    if (!R) {
      g.oval(hx + 1, hy - 2, hx + 5, hy + 3, GUM);
      g.col(hx + 4, hy - 1, hy + 2, K);
      g.rect(hx - 1, hy - 4, hx, hy - 3, LIT);
    } else {
      g.oval(hx - 3, hy - 4, hx + 6, hy + 5, GUM);
      g.oval(hx - 2, hy - 3, hx + 5, hy + 4, MOUTH);
      ring(g, hx + 1.5, hy + 0.5, 3, 3, 10, BONE);
      g.rect(hx + 1, hy, hx + 2, hy + 1, K);
      ring(g, hx + 1.5, hy + 0.5, 1.5, 1.5, 4, GUM, 0.8);
      g.rect(hx - 5, hy - 5, hx - 4, hy - 4, LAMP);
      for (const [x, y] of [[33, 8], [34, 12], [32, 15]]) {
        g.line(x + 5, y, x + 8, y + 1, PALE);
        g.set(x + 9, y + 2, PALE);
      }
    }
  }, { u: [48, 36, 0] });

  be('urban-burnt-car', 'burnt car carcass large long burnt out wreck car creature soot embers ribs legs jaw', 46, 24, (g, R) => {
    const S = hex('#3e3432'),
      RS = hex('#7a4a30'),
      CH = hex('#221c1c'),
      y = R ? -6 : 0;
    if (R)
      for (const [a, b, d] of [[8, 4, 6], [13, 16, 14], [31, 29, 32], [38, 41, 39]]) {
        g.limb([[a, 12], [b, 16], [d, 22]], CH, 2);
        g.row(22, d - 1, d + 2, CH);
      }
    g.rect(2, 11 + y, 43, 17 + y, S);
    g.poly([[11, 11 + y], [15, 4 + y], [22, 6 + y], [29, 5 + y], [33, 11 + y]], S);
    g.row(11 + y, 2, 43, lite(S));
    g.poly([[14, 10 + y], [16, 6 + y], [21, 7 + y], [21, 10 + y]], NIGHT);
    g.rect(23, 7 + y, 28, 10 + y, NIGHT);
    g.speckle(2, 4 + y, 43, 17 + y, RS, 4, 7);
    for (const x of [16, 19, 22, 25, 28]) g.col(x, 12 + y, 16 + y, vd(S));
    if (!R) {
      for (const x of [7, 33]) {
        g.oval(x, 17, x + 5, 22, CH);
        g.rect(x + 2, 19, x + 3, 20, RS);
      }
      g.set(18, 8, hex('#8a4a2a'));
      g.set(26, 8, hex('#8a4a2a'));
      g.set(42, 13, K);
      g.col(43, 14, 16, K);
    } else {
      g.rect(7, 15 + y, 12, 17 + y, K);
      g.rect(33, 15 + y, 38, 17 + y, K);
      g.clearRect(34, 8 + y, 45, 17 + y);
      g.poly([[34, 12 + y], [44, 7 + y], [44, 16 + y], [34, 16 + y]], MOUTH);
      g.poly([[33, 11 + y], [43, 4 + y], [44, 7 + y], [35, 13 + y]], S);
      g.rect(34, 16 + y, 43, 17 + y, S);
      for (let x = 37; x <= 43; x += 2) {
        const yu = Math.round(12 - ((x - 34) * 5) / 10) + y;
        g.col(x, yu + 1, yu + 2, STEEL);
        g.set(x, 15 + y, STEEL);
      }
      g.pts([[37, 14 + y], [40, 13 + y]], C.flame);
      g.rect(17, 8 + y, 18, 9 + y, C.flame);
      g.rect(25, 8 + y, 26, 9 + y, C.flame);
      g.pts([[18, 8 + y], [26, 8 + y]], C.flameLight);
      g.pts([[17, 3 + y], [19, 2 + y], [25, 3 + y]], C.flame);
      g.pts([[18, 3 + y], [24, 4 + y]], C.flameLight);
      g.limb([[27, 10 + y], [29, 14 + y], [28, 19 + y]], CH);
      g.claws(28, 19 + y, 3, [0, 1], 2, CH);
    }
  }, { u: [46, 30, 0] });

  be('urban-mattress-crawler', 'mattress crawler large long stained mattress on many legs folds like a jaw springs teeth fly tipped', 40, 18, (g, R) => {
    const M = hex('#b9b0a0'),
      TICK = hex('#8a94a0'),
      STAIN = hex('#8a744e');
    for (let x = 4; x <= 34; x += 4) g.pts([[x, 15], [x, 16], [x + 1, 16]], PALE);
    if (!R) {
      g.rect(2, 8, 37, 14, M);
      g.row(8, 2, 37, lite(M));
      g.row(14, 2, 37, dark(M));
      for (let x = 4; x <= 36; x += 3) g.col(x, 9, 13, TICK);
      g.oval(13, 9, 20, 12, STAIN);
      g.dither(13, 9, 20, 12, M);
      g.rect(27, 10, 31, 11, K);
      g.set(29, 10, EYE);
      g.pts([[33, 7], [34, 6], [33, 5], [34, 4]], STEEL);
    } else {
      g.poly([[9, 10], [38, -4], [37, 9]], MOUTH);
      g.rect(2, 10, 37, 14, M);
      g.row(14, 2, 37, dark(M));
      for (let x = 4; x <= 36; x += 3) g.col(x, 11, 13, TICK);
      g.poly([[2, 10], [4, 5], [36, -9], [39, -5], [9, 10]], M);
      g.line(4, 5, 36, -9, lite(M));
      for (let x = 8; x <= 34; x += 4) g.line(x, 8 - (x - 4) * 0.45, x + 2, 5 - (x - 4) * 0.45, TICK);
      g.oval(16, -1, 22, 3, STAIN);
      g.dither(16, -1, 22, 3, M);
      g.rect(26, -4, 29, -3, K);
      g.set(27, -4, EYE);
      for (let x = 13; x <= 35; x += 4) {
        const yu = Math.round(10 - ((x - 9) * 14) / 29);
        g.pts([[x, yu + 1], [x + 1, yu + 2], [x, yu + 3]], STEEL);
        g.pts([[x + 2, 9], [x + 1, 8], [x + 2, 7]], STEEL);
      }
    }
  }, { u: [42, 30, 1] });

  /* ================= DOG- TO PERSON-SIZED ================= */
  const rat = (g, x, y, dir, col, R) => {
    const v = dir > 0 ? g.at(x, y) : g.at(x, y).flip(7);
    v.oval(0, 1, 5, 4, col);
    v.pts([[1, 5], [4, 5]], RAW);
    if (!R) {
      v.rect(4, 1, 6, 3, col);
      v.set(7, 3, RAW);
      v.set(4, 0, RAW);
      v.set(5, 2, K);
    } else {
      v.rect(4, 0, 6, 2, col);
      v.set(7, 1, RAW);
      v.set(4, -1, RAW);
      v.set(5, 1, RED);
      v.pts([[6, 3], [7, 3]], BONE);
    }
  };
  be('urban-rat-king', 'rat king knot of rats tails tied together many heads vermin swarm', 26, 16, (g, R) => {
    const A = hex('#6e6860'),
      B = hex('#5a544c');
    rat(g, 5, 4, -1, B, R);
    rat(g, 14, 4, 1, B, R);
    if (!R) {
      for (const [a, b, d, e] of [[8, 7, 12, 5], [12, 5, 17, 7], [9, 5, 15, 8], [11, 8, 14, 4], [10, 6, 15, 6]]) g.line(a, b, d, e, RAW);
      g.pts([[12, 6], [13, 7]], dark(RAW));
    } else {
      for (const pts of [[[12, 7], [9, 0], [11, -6]], [[13, 7], [15, -1], [13, -7]], [[11, 7], [6, 2], [3, -3]], [[14, 7], [18, 2], [21, -2]]]) g.tube(pts, 0.8, 0.6, RAW);
      g.oval(10, 3, 15, 8, dark(RAW));
      g.pts([[11, 5], [13, 4], [14, 6], [12, 7]], RAW);
    }
    rat(g, 1, 9, -1, A, R);
    rat(g, 17, 9, 1, A, R);
    g.oval(9, 8, 15, 13, A);
    g.pts([[9, 7], [15, 7]], RAW);
    g.pts([[10, 14], [14, 14]], RAW);
    g.pts([[10, 10], [13, 10]], R ? RED : K);
    if (!R) g.row(12, 11, 12, RAW);
    else g.maw(10, 11, 14, 13, { teeth: 2 });
  }, { u: [28, 24, 1] });

  be('urban-graffiti-peeler', 'graffiti peeler spray paint figure peels off the wall tag painted man drips flat', 22, 36, (g, R) => {
    const L = lite(MAG);
    for (const [x, a, b] of [[3, 27, 31], [5, 27, 29], [15, 10, 12]]) g.col(x, a, b, MAG);
    g.rect(6, 10, 15, 24, MAG);
    g.rect(6, 24, 9, 33, MAG);
    g.rect(12, 24, 15, 33, MAG);
    g.rect(5, 32, 9, 33, MAG);
    g.rect(12, 32, 16, 33, MAG);
    g.rect(3, 11, 5, 24, MAG);
    g.oval(2, 22, 6, 27, MAG);
    g.oval(7, 2, 14, 10, MAG);
    g.col(7, 11, 23, L);
    g.col(8, 3, 8, L);
    if (!R) {
      g.rect(16, 11, 18, 24, MAG);
      g.oval(15, 22, 19, 27, MAG);
      g.col(18, 27, 30, MAG);
      g.rect(8, 5, 9, 6, C.white);
      g.rect(12, 5, 13, 6, C.white);
      g.pts([[8, 8], [9, 9], [10, 8], [11, 9], [12, 8], [13, 9]], C.white);
    } else {
      g.tube([[16, 12], [20, 15], [23, 12]], 1.8, 1.6, MAG);
      g.claws(24, 12, 4, [1, -0.3], 3, MAG);
      g.col(20, 17, 22, MAG);
      g.col(22, 14, 17, MAG);
      g.poly([[7, 3], [4, 2], [3, 6], [6, 6]], hex('#d6c6cc')); // the head curls off the wall
      g.rect(8, 4, 9, 6, C.white);
      g.rect(12, 4, 13, 6, C.white);
      g.pts([[9, 5], [13, 5]], K);
      g.rect(8, 7, 13, 10, K);
      g.pts([[8, 7], [10, 7], [12, 7], [9, 10], [11, 10], [13, 10]], C.white);
      g.col(10, 11, 14, K);
    }
    g.c.outline(TEAL);
  }, { u: [30, 36, 2] });

  be('urban-bin-bag-walker', 'bin bag walker pile of rubbish sacks black bags that walks legs trash monster', 24, 28, (g, R) => {
    const TR = hex('#4a4640'),
      MUCK = hex('#6a6252');
    const bag = (x0, y0, x1, y1, knot) => {
      g.oval(x0, y0, x1, y1, BAG);
      g.line(x0 + 2, y0 + 2, x0 + 1, (y0 + y1) >> 1, SHEEN);
      g.set(x0 + 3, y0 + 1, SHEEN);
      if (knot) {
        const kx = (x0 + x1) >> 1;
        g.pts([[kx, y0 - 1], [kx - 1, y0 - 2], [kx + 1, y0 - 2]], BAG);
      }
    };
    g.rect(8, 20, 10, 25, TR);
    g.rect(13, 20, 15, 25, TR);
    g.rect(7, 25, 10, 26, hex('#3a2e28'));
    g.rect(13, 25, 16, 26, hex('#3a2e28'));
    if (R) {
      g.limb([[4, 14], [-1, 12], [-3, 19]], MUCK, 2);
      g.claws(-3, 20, 3, [0, 1], 3, PALE);
      g.limb([[19, 13], [24, 9], [25, 16]], MUCK, 2);
      g.claws(25, 17, 3, [0.2, 1], 3, PALE);
    }
    bag(3, 10, 13, 21, true);
    bag(10, 9, 21, 21, true);
    bag(1, 15, 7, 22);
    bag(16, 14, 22, 22);
    bag(6, 3, 17, 13, true);
    if (!R) g.pts([[20, 21], [20, 22], [21, 23], [19, 22]], PALE);
    else {
      g.maw(7, 14, 17, 18, { teeth: 2, len: 2 });
      g.rect(8, 6, 10, 8, K);
      g.rect(13, 7, 15, 8, K);
      g.pts([[9, 7], [14, 7]], EYE);
    }
  }, { u: [30, 30, 3] });

  be('urban-chain-link-hound', 'chain link hound dog made of wire fence mesh poles barbed wire guard dog monster', 30, 20, (g, R) => {
    const W = STEEL,
      GAP = hex('#33363e'),
      PO = hex('#6a6d78');
    g.line(3, 5, 1, 1, PO);
    g.pts([[1, 3], [3, 2], [0, 1]], W);
    for (const x of [5, 9]) {
      g.rect(x, 10, x + 1, 17, PO);
      g.row(18, x, x + 2, PO);
    }
    if (!R)
      for (const x of [20, 24]) {
        g.rect(x, 10, x + 1, 17, PO);
        g.row(18, x, x + 2, PO);
      }
    else {
      g.limb([[20, 10], [22, 14], [25, 18]], PO, 2);
      g.limb([[24, 10], [26, 14], [28, 18]], PO, 2);
      for (let x = 6; x <= 21; x += 3) {
        g.line(x, 3, x - 1, 0, W);
        g.set(x + 1, 1, W);
      }
    }
    g.rect(4, 5, 25, 11, GAP);
    g.mesh(4, 5, 25, 11, W, GAP);
    g.row(4, 3, 26, PO);
    g.row(11, 4, 25, PO);
    if (!R) {
      g.poly([[23, 2], [28, 5], [28, 8], [23, 9]], GAP);
      g.mesh(23, 2, 28, 9, W, GAP);
      g.line(23, 2, 28, 5, PO);
      g.line(23, 9, 28, 8, PO);
      g.col(23, 1, 2, PO);
      g.set(25, 4, hex('#8a3a30'));
      g.rect(27, 6, 28, 7, C.brass);
    } else {
      g.poly([[23, 6], [30, 1], [29, 11], [23, 9]], MOUTH);
      g.poly([[22, 3], [29, -2], [30, 1], [23, 7]], GAP);
      g.mesh(22, -2, 30, 7, W, GAP);
      g.line(22, 3, 29, -2, PO);
      g.poly([[22, 8], [29, 11], [29, 12], [22, 10]], PO);
      g.pts([[25, 5], [27, 4], [29, 3], [25, 8], [27, 9], [29, 10]], C.white);
      g.col(23, 0, 2, PO);
      g.set(25, 1, RED);
    }
  }, { u: [32, 24, 1] });

  be('urban-box-hermit', 'cardboard box hermit crab crab legs claws eye stalks living in a box vermin', 22, 18, (g, R) => {
    const y = R ? -7 : 0;
    if (!R) g.pts([[3, 15], [2, 16], [6, 15], [6, 16], [15, 15], [15, 16], [19, 15], [20, 16]], RAW);
    else {
      for (const v of [g, g.flip(21)]) {
        v.limb([[5, 6], [1, 9], [0, 16]], RAW);
        v.limb([[6, 7], [3, 11], [3, 16]], RAW);
        v.limb([[8, 7], [6, 12], [7, 16]], RAW);
      }
      g.limb([[16, 5], [21, 3], [23, 8]], RAW, 2);
      g.poly([[22, 8], [25, 8], [26, 12], [24, 10], [22, 12]], RAW);
      g.limb([[5, 5], [0, 2], [-1, 5]], RAW, 2);
      g.poly([[-2, 5], [1, 5], [1, 8], [0, 6], [-2, 8]], RAW);
      g.limb([[9, -3], [8, -8]], RAW);
      g.eye(7, -11, 3, K);
      g.limb([[12, -3], [14, -6]], RAW);
      g.eye(13, -9, 3, K);
    }
    g.rect(4, 4 + y, 17, 14 + y, CARD);
    g.col(4, 4 + y, 14 + y, lite(CARD));
    g.rect(4, 13 + y, 17, 14 + y, dark(CARD));
    g.rect(10, 4 + y, 11, 14 + y, hex('#c9b890'));
    g.line(4, 4 + y, 1, 2 + y, CARD);
    g.line(17, 4 + y, 20, 2 + y, dark(CARD));
    g.col(14, 7 + y, 10 + y, vd(CARD));
    g.pts([[13, 8 + y], [15, 8 + y]], vd(CARD));
    g.rect(6, 8 + y, 8, 9 + y, K);
    if (!R) g.set(7, 8, EYE);
  }, { u: [30, 30, 3] });

  be('urban-sewer-grate-hands', 'sewer grate hands drain many arms reaching up through the bars fingers gutter', 22, 10, (g, R) => {
    const I = hex('#4a4a55'),
      H = hex('#a8b09a');
    if (R)
      for (const [pts, d] of [
        [[[4, 5], [2, -4], [5, -11]], [0.3, -1]],
        [[[10, 5], [12, -6], [9, -15]], [-0.3, -1]],
        [[[16, 5], [19, -3], [17, -9]], [-0.2, -1]],
        [[[7, 5], [5, 0], [1, 3]], [-1, 0.6]],
        [[[13, 5], [16, 0], [20, 2]], [1, 0.6]],
      ]) {
        g.limb(pts, H, 2);
        g.claws(pts[2][0], pts[2][1], 4, d, 3, H);
      }
    g.rect(1, 5, 20, 8, I);
    g.row(5, 1, 20, lite(I));
    for (let x = 3; x <= 18; x += 3) g.rect(x, 6, x + 1, 7, K);
    if (!R) {
      for (const x of [3, 6, 12, 15]) g.pts([[x, 4], [x, 3], [x + 1, 4]], H);
      g.pts([[9, 6], [18, 7]], EYE);
    }
  }, { u: [24, 30, 1] });

  be('urban-hoodie-teeth', 'hoodie with teeth hooded youth no face hood full of teeth maw figure', 18, 34, (g0, R) => {
    const g = g0.at(1, 1),
      HD = hex('#55565f');
    fig(g, {
      top: HD,
      hand: HD,
      legs: hex('#33363e'),
      shoe: hex('#b9b7a8'),
      head: false,
      arms: R ? { l: [0, 21, -1, 16], r: [0, 21, -1, 16] } : 'down',
      body: (b) => b.rect(6, 18, 9, 20, dark(HD)),
    });
    if (!R) {
      g.oval(3, 1, 12, 12, HD);
      g.row(1, 6, 9, lite(HD));
      g.oval(5, 3, 10, 10, K);
      g.pts([[6, 8], [8, 8], [9, 7]], BONE);
      g.col(6, 13, 15, hex('#b9b7a8'));
      g.col(9, 13, 14, hex('#b9b7a8'));
    } else {
      g.oval(2, 0, 13, 13, HD);
      g.row(0, 6, 9, lite(HD));
      g.oval(4, 2, 11, 11, MOUTH);
      ring(g, 7.5, 6.5, 3.3, 4.2, 14, BONE);
      g.oval(6, 5, 9, 8, K);
      ring(g, 7.5, 6.5, 1.6, 1.8, 5, GUM, 0.5);
      g.col(6, 14, 17, hex('#b9b7a8'));
      g.col(9, 14, 16, hex('#b9b7a8'));
      for (const v of [g, g.flip(15)]) v.claws(0, 23, 3, [0, 1], 3, BONE);
    }
  }, { u: [20, 34, 1] });

  be('urban-trolley-beast', 'shopping trolley beast cart cage something inside wire jaws wheels abandoned', 24, 22, (g, R) => {
    const W = STEEL,
      IN = hex('#2a2a32');
    g.line(6, 14, 7, 18, W);
    g.line(18, 14, 18, 18, W);
    g.row(17, 7, 18, W);
    g.rect(6, 18, 8, 20, hex('#22202a'));
    g.rect(17, 18, 19, 20, hex('#22202a'));
    g.line(4, 5, 1, 3, W);
    g.rect(1, 2, 2, 3, hex('#8a3028'));
    const wires = (x1) => {
      for (let x = 6; x <= x1; x += 3) for (let y = 5; y <= 14; y++) g.over(x, y, W);
      for (let x = 4; x <= x1 + 1; x++) for (const y of [5, 9, 14]) g.over(x, y, W);
    };
    if (!R) {
      g.poly([[4, 5], [21, 5], [19, 14], [6, 14]], IN);
      wires(20);
      g.pts([[10, 7], [12, 7], [15, 11], [17, 11], [8, 11]], EYE);
    } else {
      g.poly([[4, 5], [14, 5], [14, 14], [6, 14]], IN);
      wires(12);
      g.poly([[14, 9], [25, 2], [25, 14], [14, 13]], MOUTH);
      g.limb([[13, 5], [25, 0]], W, 2);
      g.limb([[13, 14], [24, 16]], W, 2);
      for (let x = 16; x <= 24; x += 2) {
        const yu = Math.round(5 - ((x - 13) * 5) / 12);
        g.col(x, yu + 2, yu + 3, BONE);
        g.col(x, 12 + Math.round((x - 13) / 6), 13 + Math.round((x - 13) / 6), BONE);
      }
      g.tube([[15, 11], [20, 9], [26, 10]], 1.3, 0.8, TONGUE);
      g.pts([[8, 7], [10, 7], [9, 11]], RED);
    }
  }, { u: [28, 24, 1] });

  be('urban-squatter-stretched', 'stretched squatter crouching thin man unfolds long legs long arms spider person no longer a person', 20, 24, (g, R) => {
    const TR = hex('#4a4640'),
      SHc = hex('#6a6a5a'),
      SK = hex('#b0a898');
    g.rect(4, 21, 7, 22, SK);
    g.rect(12, 21, 15, 22, SK);
    if (!R) {
      g.rect(8, 11, 12, 20, SHc);
      g.limb([[9, 19], [5, 7], [6, 21]], TR, 2);
      g.limb([[11, 19], [15, 7], [14, 21]], TR, 2);
      g.limb([[8, 12], [4, 15], [6, 18]], SK);
      g.limb([[12, 12], [16, 15], [14, 18]], SK);
      g.oval(7, 4, 13, 11, SK);
      g.rect(8, 7, 8, 8, K);
      g.rect(11, 7, 11, 8, K);
      g.row(10, 9, 11, vd(SK));
    } else {
      g.limb([[6, 21], [4, 6], [9, -4]], TR, 2);
      g.limb([[14, 21], [16, 6], [11, -4]], TR, 2);
      g.rect(8, -12, 12, -4, SHc);
      for (const yy of [-10, -8, -6]) g.row(yy, 9, 11, dark(SHc));
      g.limb([[8, -11], [2, -3], [0, 9]], SK);
      g.claws(0, 9, 4, [0, 1], 4, SK);
      g.limb([[12, -11], [18, -3], [21, 8]], SK);
      g.claws(21, 8, 4, [0, 1], 4, SK);
      g.oval(7, -19, 13, -12, SK);
      g.pts([[8, -16], [11, -16]], EYE);
      g.rect(9, -14, 11, -11, MOUTH);
      g.row(-14, 9, 11, BONE);
    }
  }, { u: [24, 44, 2] });

  be('urban-tyre-stack', 'tyre stack pile of old tyres tire worm eyes inside rubber mouth leaning', 16, 30, (g, R) => {
    const TY = BAG;
    const tyre = (x, y) => {
      g.rect(x + 1, y, x + 10, y + 4, TY);
      g.col(x, y + 1, y + 3, TY);
      g.col(x + 11, y + 1, y + 3, TY);
      g.row(y, x + 2, x + 9, SHEEN);
      for (let i = x + 1; i <= x + 10; i += 2) g.col(i, y + 2, y + 3, hex('#3a3844'));
    };
    const xs = R ? [2, 3, 5, 8, 10] : [2, 2, 3, 2, 2];
    if (R) {
      g.tube([[5, 16], [0, 13], [-1, 19]], 1, 0.8, hex('#4a3a40'));
      g.tube([[15, 12], [20, 14], [21, 20]], 1, 0.8, hex('#4a3a40'));
    }
    for (let i = 0; i < (R ? 4 : 5); i++) tyre(xs[i], 24 - i * 5);
    if (!R) {
      g.row(4, 5, 10, K);
      g.rect(6, 15, 10, 16, K);
      g.pts([[7, 15], [9, 15]], EYE);
    } else {
      const x = xs[4];
      g.oval(x - 1, -1, x + 11, 9, TY);
      g.oval(x + 2, 1, x + 8, 7, MOUTH);
      ring(g, x + 5, 4, 3, 3, 10, BONE);
      g.rect(x + 4, 3, x + 6, 5, K);
      g.pts([[x, 2], [x + 10, 6], [x + 1, 6]], SHEEN);
    }
  }, { u: [24, 32, 1] });

  be('urban-oil-drum-burner', 'oil drum burner brazier fire barrel burning figure flame demon rises from the drum', 16, 28, (g, R) => {
    const DR = hex('#4a5a66'),
      F = C.flame,
      FL = C.flameLight,
      FD = hex('#a8501e');
    if (!R) {
      g.poly([[4, 12], [5, 8], [7, 10], [8, 6], [10, 10], [11, 8], [11, 12]], F);
      g.poly([[6, 12], [8, 9], [10, 12]], FL);
      g.pts([[7, 11], [9, 11]], K);
    } else {
      g.tube([[4, 4], [-1, 1], [-3, -5]], 1.5, 0.8, F, FD);
      g.tube([[11, 4], [16, 2], [18, 8]], 1.5, 0.8, F, FD);
      g.poly([[4, 12], [3, 4], [5, -2], [10, -2], [12, 4], [11, 12]], F);
      g.poly([[6, 12], [5, 4], [7, 0], [9, 0], [10, 4], [9, 12]], FL);
      g.oval(4, -10, 11, -2, FL);
      g.pts([[4, -10], [6, -11], [9, -11], [11, -10], [3, -8], [12, -8], [7, -11]], F);
      g.rect(5, -7, 6, -6, K);
      g.rect(9, -7, 10, -6, K);
      g.rect(6, -4, 9, -3, K);
      g.pts([[7, -4], [9, -3]], FL);
      g.pts([[-2, -9], [14, -8], [1, -2], [16, -3]], FL);
    }
    g.rect(3, 13, 12, 26, DR);
    g.col(3, 13, 26, lite(DR));
    for (const y of [13, 19, 26]) g.row(y, 3, 12, dark(DR));
    g.speckle(3, 14, 12, 25, RUST, 5, 2);
    g.pts([[5, 16], [8, 22], [10, 17]], F);
  }, { u: [24, 40, 4] });

  be('urban-vending-machine-gut', 'vending machine with organs eyes on the shelves arm from the hatch machine monster', 18, 34, (g, R) => {
    const M = hex('#3a4658'),
      GL = hex('#1e2630');
    g.rect(2, 2, 15, 31, M);
    g.col(2, 2, 31, lite(M));
    g.row(2, 2, 15, lite(M));
    g.rect(3, 32, 5, 32, hex('#22202a'));
    g.rect(12, 32, 14, 32, hex('#22202a'));
    g.rect(4, 4, 11, 22, GL);
    for (const y of [8, 13, 18, 22]) g.row(y, 4, 11, hex('#55606e'));
    if (!R) {
      g.rect(5, 6, 6, 7, RAW);
      g.rect(8, 5, 9, 7, GUM);
      g.eye(5, 10, 3, K);
      g.row(11, 8, 10, BONE);
      g.row(12, 8, 10, GUM);
      g.rect(5, 15, 7, 17, C.blood);
      g.rect(9, 15, 10, 17, C.glass);
      for (const x of [5, 7, 9]) g.col(x, 20, 21, PALE);
      g.pts([[13, 7], [14, 9]], LIT);
    } else {
      for (const y of [5, 10, 15]) {
        g.eye(5, y, 3, K);
        g.eye(8, y, 3, K);
        g.pts([[7, y + 1], [10, y + 1]], K);
        g.pts([[6, y + 1], [9, y + 1]], EYE);
      }
      g.row(20, 5, 10, BONE);
      g.row(21, 5, 10, GUM);
      g.line(4, 9, 8, 4, C.glassLight);
      g.line(8, 12, 11, 17, C.glassLight);
      g.pts([[13, 7], [14, 7], [13, 9]], RED);
    }
    g.rect(13, 6, 14, 12, K);
    g.pts(R ? [[13, 7], [14, 7], [13, 9]] : [[13, 7], [14, 9]], R ? RED : LIT);
    g.col(13, 15, 17, K);
    g.rect(4, 25, 11, 29, K);
    if (!R) g.pts([[5, 25], [7, 25], [9, 25], [5, 26]], PALE);
    else {
      g.teeth(4, 11, 25, 1, BONE, 2);
      g.limb([[8, 27], [16, 25], [20, 29]], PALE, 2);
      g.claws(20, 30, 4, [0.4, 1], 3, PALE);
    }
  }, { u: [26, 34, 2] });

  be('urban-rebar-ghoul', 'rebar ghoul concrete man broken concrete figure rusty iron bars golem demolition', 20, 36, (g, R) => {
    const CN = CONC,
      RB = RUST;
    g.rect(5, 24, 8, 34, CN);
    g.rect(11, 24, 14, 34, CN);
    g.rect(4, 33, 8, 34, dark(CN));
    g.rect(11, 33, 15, 34, dark(CN));
    g.row(28, 5, 8, RB);
    g.row(29, 11, 14, RB);
    if (!R) {
      g.line(4, 11, 2, 7, RB);
      g.line(15, 11, 17, 8, RB);
      g.line(13, 11, 14, 8, RB);
      g.rect(1, 12, 3, 24, CN);
      g.rect(16, 12, 18, 24, CN);
      g.row(18, 1, 3, RB);
      g.row(19, 16, 18, RB);
      g.col(1, 25, 27, RB);
      g.col(3, 25, 26, RB);
      g.col(16, 25, 26, RB);
      g.col(18, 25, 27, RB);
    } else {
      for (const [a, b, d, e] of [[4, 12, -2, 5], [6, 11, 3, 1], [13, 11, 16, 1], [15, 12, 21, 5], [5, 12, 0, 1], [14, 12, 19, 1]]) g.line(a, b, d, e, RB);
      g.limb([[3, 13], [-2, 12], [-4, 5]], CN, 3);
      g.claws(-4, 4, 3, [0, -1], 3, RB);
      g.limb([[16, 13], [21, 12], [23, 5]], CN, 3);
      g.claws(23, 4, 3, [0, -1], 3, RB);
    }
    g.rect(4, 11, 15, 23, CN);
    g.col(4, 11, 23, lite(CN));
    g.line(6, 12, 9, 18, vd(CN));
    g.line(12, 14, 10, 22, vd(CN));
    g.rect(7, 23, 12, 24, RB);
    g.rect(6, 2, 13, 10, CN);
    g.clear(6, 2);
    g.clear(13, 10);
    g.col(6, 3, 9, lite(CN));
    if (!R) {
      g.rect(7, 5, 8, 6, K);
      g.rect(11, 5, 12, 6, K);
      g.row(8, 8, 11, vd(CN));
    } else {
      g.rect(7, 4, 8, 5, K);
      g.rect(11, 4, 12, 5, K);
      g.pts([[8, 5], [12, 5]], C.flame);
      g.rect(7, 7, 12, 9, MOUTH);
      g.teeth(7, 12, 7, 1, RB, 2);
      g.teeth(8, 12, 9, -1, RB, 2);
      g.line(13, 7, 14, 9, vd(CN));
    }
  }, { u: [28, 38, 4] });

  be('urban-tarp-ghost', 'tarp ghost blue tarpaulin over something with many feet eyes under the sheet', 28, 20, (g, R) => {
    const T = hex('#3f5f86'),
      D = dark(T);
    for (const x of [4, 8, 12, 16, 20, 23]) {
      g.rect(x, 17, x + 1, 18, PALE);
      g.set(x + 2, 18, PALE);
      if (R) g.col(x, 14, 16, PALE);
    }
    if (!R) {
      g.poly([[2, 16], [4, 9], [10, 6], [18, 6], [24, 9], [26, 16]], T);
      g.line(10, 6, 18, 6, lite(T));
      g.line(8, 8, 6, 15, D);
      g.line(14, 7, 13, 15, D);
      g.line(20, 8, 22, 15, D);
      g.pts([[4, 15], [12, 15], [18, 15], [24, 15]], C.brass);
      g.line(3, 11, 25, 12, C.straw);
    } else {
      g.poly([[2, 13], [5, 6], [11, -6], [14, -9], [17, -5], [23, 6], [26, 13]], T);
      g.line(5, 6, 13, -8, lite(T));
      g.line(14, -8, 9, 8, D);
      g.line(14, -8, 19, 8, D);
      g.line(15, -6, 22, 6, D);
      g.poly([[7, 13], [10, 5], [18, 5], [21, 13]], K);
      g.pts([[11, 7], [13, 7], [15, 9], [17, 9], [12, 11], [14, 11]], EYE);
      g.pts([[7, 11], [8, 10], [7, 12], [21, 11], [20, 10], [21, 12]], PALE);
      g.pts([[4, 12], [24, 12]], C.brass);
    }
  }, { u: [30, 30, 1] });

  /* ================= SMALL ================= */
  be('urban-cat-flat', 'flat cat run over cat roadkill flattened still walks peels off the road small', 20, 8, (g, R) => {
    const F = hex('#6a5a4a'),
      D = dark(F);
    g.line(4, 5, 1, 4, F);
    g.line(5, 3, 3, 1, F);
    g.line(5, 6, 2, 6, F);
    if (!R) {
      g.oval(4, 3, 15, 6, F);
      g.dither(8, 3, 11, 6, D);
      g.line(13, 3, 15, 1, F);
      g.row(6, 14, 18, F);
      g.oval(14, 2, 18, 5, F);
      g.pts([[15, 1], [18, 1]], D);
      g.set(16, 3, YEL);
      g.set(17, 4, K);
    } else {
      g.oval(4, 3, 11, 6, F);
      g.dither(7, 3, 10, 6, D);
      g.poly([[9, 6], [11, 3], [12, -3], [14, -3], [13, 3], [12, 6]], F);
      g.col(12, -2, 4, D);
      g.line(12, 0, 9, -2, F);
      g.line(13, 0, 17, 1, F);
      g.pts([[8, -2], [8, -3], [18, 1], [18, 2]], BONE);
      g.oval(11, -8, 17, -3, F);
      g.pts([[12, -9], [16, -9]], D);
      g.pts([[13, -6], [15, -6]], YEL);
      g.rect(13, -5, 15, -4, MOUTH);
      g.pts([[13, -5], [15, -5]], BONE);
    }
  }, { u: [22, 18, 1] });

  be('urban-cockroach-face', 'cockroach with a face roach small vermin insect rears up human face on its belly', 14, 9, (g, R) => {
    const B = hex('#5a3a28'),
      L = hex('#8a5a3a');
    if (!R) {
      for (const x of [3, 6, 9]) g.pts([[x, 7], [x - 1, 6]], B);
      g.oval(2, 3, 11, 6, B);
      g.row(3, 4, 9, L);
      g.line(11, 4, 13, 2, B);
      g.line(11, 5, 13, 5, B);
      g.set(10, 5, K);
    } else {
      for (const v of [g, g.flip(13)])
        for (const y of [-2, 1, 4]) {
          v.line(4, y, 1, y - 1, B);
          v.set(0, y, B);
        }
      g.oval(4, -5, 9, 7, B);
      g.oval(5, -3, 8, 5, PALE);
      g.pts([[5, -1], [8, -1]], K);
      g.rect(6, 2, 7, 3, MOUTH);
      g.line(5, -5, 3, -8, B);
      g.line(8, -5, 10, -8, B);
    }
  }, { u: [14, 18, 0] });

  be('urban-rat-hands', 'rat with hands human hands small vermin stands upright long teeth', 14, 10, (g, R) => {
    const G = hex('#6e6860');
    if (!R) {
      g.line(3, 6, 1, 8, RAW);
      g.oval(3, 3, 9, 7, G);
      g.rect(9, 4, 11, 6, G);
      g.set(12, 5, RAW);
      g.set(9, 3, RAW);
      g.set(10, 4, K);
      g.pts([[9, 8], [10, 8], [11, 8], [11, 7]], PALE);
      g.pts([[4, 8], [5, 8]], RAW);
    } else {
      g.tube([[9, 7], [12, 8], [13, 4]], 0.6, 0.5, RAW);
      g.oval(4, -2, 9, 7, G);
      g.col(6, 0, 6, lite(G));
      g.oval(4, -7, 10, -2, G);
      g.pts([[4, -8], [10, -8]], RAW);
      g.pts([[6, -5], [9, -5]], RED);
      g.rect(7, -3, 8, -1, BONE);
      g.line(4, 1, 1, 0, G);
      g.claws(1, 0, 4, [-1, -0.6], 2, PALE);
      g.line(9, 1, 12, 0, G);
      g.claws(12, 0, 4, [1, -0.6], 2, PALE);
      g.pts([[4, 8], [5, 8], [8, 8], [9, 8]], RAW);
    }
  }, { u: [16, 20, 1] });

  be('urban-syringe-mosquito', 'syringe mosquito needle insect flying small blood glass barrel wings', 16, 12, (g, R) => {
    const GL = hex('#9ebcc2'),
      WG = hex('#c9cfc8'),
      DK = hex('#33363e');
    for (const [a, b] of [[4, 3], [6, 6], [8, 9]]) g.line(a, 7, b, 9, DK);
    if (!R) {
      g.oval(3, 1, 7, 3, WG);
      g.oval(7, 1, 11, 3, WG);
    } else {
      g.oval(1, -3, 5, 2, WG);
      g.oval(4, -4, 7, 2, WG);
      g.oval(8, -4, 11, 2, WG);
      g.oval(10, -3, 14, 2, WG);
      g.dither(1, -4, 14, 0, hex('#9aa39c'));
    }
    g.rect(3, 4, 9, 6, R ? C.blood : GL);
    g.row(4, 3, 9, R ? hex('#b3342c') : lite(GL));
    g.pts([[5, 6], [7, 6]], DK);
    g.col(2, 4, 6, STEEL);
    g.set(1, 5, STEEL);
    g.col(0, 4, 6, STEEL);
    g.col(10, 4, 6, DK);
    g.set(10, 4, R ? RED : EYE);
    if (!R) g.row(5, 11, 14, STEEL);
    else {
      g.line(11, 5, 15, 8, STEEL);
      g.set(16, 10, RED);
    }
    g.shadow(3, 11, 10);
  }, { u: [20, 17, 1] });

  be('urban-wire-crow', 'barbed wire crow bird made of wire small rusty reflector eye wings', 14, 14, (g, R) => {
    const W = hex('#26262e'),
      L = hex('#6a6d78');
    g.col(5, 11, 12, L);
    g.col(8, 11, 12, L);
    g.pts([[4, 12], [9, 12]], L);
    g.line(3, 8, 1, 10, L);
    if (R)
      for (const v of [g, g.flip(13)]) {
        v.line(4, 6, -4, 0, L);
        v.line(4, 7, -5, 4, L);
        v.line(4, 8, -3, 8, L);
        v.line(-4, 0, -5, 4, W);
        v.line(-5, 4, -3, 8, W);
        v.pts([[-1, 1], [-2, 5], [0, 8], [-5, 0], [-6, 4]], L);
      }
    g.oval(3, 5, 10, 10, W);
    g.line(3, 7, 10, 9, L);
    g.line(4, 10, 9, 5, L);
    g.pts([[2, 6], [11, 8], [6, 4]], L);
    g.oval(8, 2, 11, 5, W);
    g.set(10, 3, RED);
    if (!R) g.pts([[12, 4], [12, 3]], RUST);
    else {
      g.pts([[12, 2], [13, 1], [12, 5], [13, 6]], RUST);
      g.set(12, 4, MOUTH);
    }
  }, { u: [28, 16, 7] });

  be('urban-spray-can-imp', 'spray can imp aerosol paint can on legs small sprays a cloud with a face', 10, 16, (g, R) => {
    const CAN = hex('#3f7a7a'),
      DK = hex('#26262e');
    g.col(3, 13, 14, DK);
    g.col(6, 13, 14, DK);
    g.pts([[2, 14], [7, 14]], DK);
    if (!R) {
      g.col(2, 7, 10, DK);
      g.col(7, 7, 10, DK);
    } else {
      g.line(2, 8, 0, 4, DK);
      g.line(7, 7, 6, 2, DK);
      for (let y = -3; y <= 7; y++)
        for (let x = 8; x <= 17; x++) {
          const d = ((x - 12.5) / 5) ** 2 + ((y - 2) / 5.5) ** 2;
          if (d <= 1 && (d < 0.55 || (x + y) % 2 === 0)) g.set(x, y, d < 0.3 ? lite(MAG) : MAG);
        }
      g.rect(11, 0, 11, 1, K);
      g.rect(14, 0, 14, 1, K);
      g.row(3, 11, 14, K);
      g.pts([[11, 4], [13, 4]], K);
    }
    g.rect(3, 5, 6, 12, CAN);
    g.col(3, 5, 12, lite(CAN));
    g.rect(3, 8, 6, 10, MAG);
    g.row(4, 3, 6, STEEL);
    g.rect(4, 2, 5, 3, C.white);
    g.pts([[4, 6], [6, 6]], R ? RED : K);
    if (R) g.row(9, 4, 6, K);
  }, { u: [22, 20, 2] });

  be('urban-pothole-mouth', 'pothole mouth hole in the road with teeth tongue asphalt small ground maw', 20, 8, (g, R) => {
    if (R) g.tube([[10, 4], [8, -3], [11, -9], [14, -6]], 1.8, 1, TONGUE);
    g.oval(1, 2, 18, 6, ASPH);
    g.pts([[3, 2], [8, 2], [15, 2], [2, 5], [17, 5]], lite(ASPH));
    g.oval(3, 3, 16, 5, K);
    if (!R) {
      g.pts([[8, 4], [11, 4]], EYE);
      g.pts([[6, 5], [13, 5], [5, 3]], BONE);
    } else {
      g.teeth(4, 15, 3, 1, BONE, 2);
      g.teeth(5, 15, 5, -1, BONE, 2);
      g.pts([[5, 4], [15, 4]], RED);
      g.rect(9, 3, 11, 5, TONGUE);
      g.pts([[9, -4], [11, -8]], GUM);
    }
  }, { u: [20, 20, 0] });

  be('urban-mould-bloom', 'mould bloom mold fungus patch grows eyes on stalks spores damp small', 14, 12, (g, R) => {
    const M = hex('#3a4a34'),
      L = hex('#7a8a5a');
    if (R) {
      g.oval(-1, 8, 4, 10, M);
      g.oval(10, 8, 15, 10, M);
      for (const [a, b, d, e] of [[3, 6, 1, -2], [6, 5, 6, -6], [9, 5, 11, -3], [11, 7, 14, 2]]) {
        g.line(a, b, d, e, L);
        g.eye(d - 1, e - 2, 3, K);
      }
      g.pts([[3, -6], [9, -8], [13, -4], [-1, 2]], L);
    }
    g.oval(2, 5, 11, 10, M);
    g.oval(1, 7, 5, 10, M);
    g.oval(8, 6, 12, 10, M);
    g.speckle(-1, 5, 15, 10, L, 4, 3);
    if (!R) {
      g.row(7, 4, 5, K);
      g.row(8, 8, 9, K);
      g.set(7, 6, K);
    }
  }, { u: [20, 22, 3] });

  be('urban-drain-leech', 'drain leech fat black leech worm small rears up sucker mouth ring of teeth wet', 18, 8, (g, R) => {
    const Lc = hex('#3a3e34'),
      W = hex('#6a7060');
    if (!R) {
      const p = g.tube([[2, 5], [8, 4.5], [14, 4.5]], 1, 1.8, Lc);
      g.rings(p, 2, 3, hex('#22241e'));
      g.row(3, 9, 13, W);
      g.set(16, 5, GUM);
    } else {
      const p = g.tube([[2, 5], [7, 5], [10, 1], [10, -5]], 1, 2, Lc);
      g.rings(p, 2, 3, hex('#22241e'));
      g.oval(7, -9, 13, -3, Lc);
      g.oval(8, -8, 12, -4, GUM);
      ring(g, 10, -6, 2, 2, 8, BONE);
      g.set(10, -6, K);
      g.pts([[8, 0], [8, 2]], W);
    }
  }, { u: [18, 18, 0] });
};
