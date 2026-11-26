/* The street at night: things made of lamps, buses, coats and litter. See be-city.js. */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd }, { fig, head, vd, P }, be) => {
  const { EYE, RED, YEL, BONE, NIGHT, MOUTH, GUM, TONGUE, PALE, ASHEN, LAMP } = P;
  const ASPH = hex('#3a3a44'),
    COAT = hex('#a8903c'),
    BUS = hex('#7a2e2a'),
    TAXI = hex('#a88a2e'),
    ORANGE = hex('#b3692c'),
    GLASS = hex('#232a36'),
    LIT = hex('#8a8250'),
    WET = hex('#b9b7a8'),
    PAPER = hex('#c9c0a6'),
    INK = hex('#8a8474'),
    POLE = hex('#3a3a46');

  /* ================= LARGE, TALL ================= */
  be('street-lamp-stalker', 'lamp stalker large tall street lamp post monster lantern head long arms iron walking light', 24, 48, (g, R) => {
    const I = POLE;
    g.leg(11, 29, 8, 37, 7, 45, I, 2);
    g.leg(12, 29, 16, 37, 16, 45, I, 2);
    g.rect(5, 45, 8, 46, I);
    g.rect(15, 45, 19, 46, I);
    g.rect(11, 11, 12, 30, I);
    g.col(11, 11, 30, lite(I));
    g.rect(10, 20, 13, 21, I);
    g.rect(10, 28, 13, 30, I);
    g.row(13, 7, 16, I); // the ladder bar: its shoulders
    if (!R) {
      g.limb([[7, 13], [5, 24], [6, 34]], I);
      g.claws(6, 34, 3, [0, 1], 3, I);
      g.limb([[16, 13], [18, 24], [17, 34]], I);
      g.claws(17, 34, 3, [0, 1], 3, I);
    } else {
      g.limb([[7, 13], [1, 18], [-2, 27]], I);
      g.claws(-2, 27, 4, [0, 1], 5, I);
      g.limb([[16, 13], [22, 9], [25, 18]], I);
      g.claws(25, 18, 4, [0.3, 1], 5, I);
    }
    // the lantern is its head
    g.row(1, 11, 12, I);
    g.row(2, 9, 14, I);
    g.row(3, 7, 16, I);
    g.rect(8, 4, 15, 9, R ? LAMP : hex('#5e5c48'));
    g.col(8, 4, 9, I);
    g.col(15, 4, 9, I);
    g.row(10, 9, 14, I);
    if (R) {
      g.rect(10, 5, 10, 6, K);
      g.rect(13, 5, 13, 6, K);
      g.row(8, 9, 14, K);
      g.pts([[9, 7], [11, 9], [13, 9], [14, 7]], K);
      g.pts([[10, 8], [12, 8]], LAMP);
      g.pts([[7, 6], [16, 6], [6, 5], [17, 7]], LAMP); // the glare
    } else {
      g.col(12, 4, 9, I);
      g.set(10, 7, hex('#8a8250'));
    }
  }, { u: [32, 48, 4] });

  be('street-raincoat-empty', 'empty raincoat large tall yellow mac hood nothing inside hollow ghost coat floating', 20, 46, (g, R) => {
    const Y = COAT,
      D = dark(Y);
    g.poly([[5, 10], [14, 10], [16, 22], [17, 40], [2, 40], [3, 22]], Y);
    g.col(3, 22, 39, lite(Y));
    if (!R) {
      g.rect(2, 12, 4, 29, Y);
      g.rect(15, 12, 17, 29, Y);
      g.col(4, 14, 29, D);
      g.col(15, 14, 29, D);
      g.row(29, 2, 4, K); // the cuffs are empty
      g.row(29, 15, 17, K);
      g.col(9, 12, 40, D);
      g.pts([[10, 16], [10, 22], [10, 28], [10, 34]], vd(Y));
    } else {
      g.limb([[4, 12], [-1, 17], [-3, 24]], Y, 3);
      g.limb([[15, 12], [20, 17], [22, 24]], Y, 3);
      g.claws(-3, 25, 4, [0, 1], 5, WET);
      g.claws(22, 25, 4, [0, 1], 5, WET);
      g.poly([[9, 13], [10, 13], [14, 40], [5, 40]], NIGHT); // it opens down the front
      g.pts([[9, 20], [10, 25], [8, 30], [11, 33], [9, 37], [7, 36], [12, 38]], EYE);
      g.pts([[6, 31], [6, 32], [13, 27], [13, 28], [7, 24]], WET); // fingers at the edges
    }
    g.oval(5, 1, 14, 11, Y);
    g.row(1, 8, 11, lite(Y));
    g.oval(7, 3, 12, 9, NIGHT);
    g.pts([[8, 11], [11, 11], [8, 12], [11, 13]], D);
    if (R) {
      g.pts([[8, 5], [11, 5]], EYE);
      g.row(8, 8, 11, BONE);
      g.pts([[9, 8]], NIGHT);
    }
    g.ragged(2, 17, 40, 2, 5);
    g.pts([[5, 42], [12, 41], [15, 42]], C.glassLight);
    g.shadow(4, 15, 44);
  }, { u: [28, 46, 4] });

  be('street-traffic-light-walker', 'traffic light walker large tall signal eyes on legs three eyes red amber green monster', 18, 46, (g, R) => {
    const B = hex('#26262e'),
      PL = hex('#55565f'),
      AMB = hex('#d9a23a'),
      GRN = hex('#4f9a6a');
    g.leg(7, 30, 3, 37, 5, 44, PL, 2);
    g.leg(10, 30, 14, 37, 12, 44, PL, 2);
    g.row(44, 3, 7, PL);
    g.row(44, 11, 15, PL);
    g.rect(8, 21, 9, 29, PL);
    g.rect(6, 28, 11, 30, PL);
    if (R) {
      g.limb([[5, 10], [0, 15], [-1, 23]], PL);
      g.claws(-1, 23, 3, [0, 1], 4, PL);
      g.limb([[12, 10], [18, 14], [19, 22]], PL);
      g.claws(19, 22, 3, [0, 1], 4, PL);
    }
    g.rect(5, 1, 12, 20, B);
    g.col(5, 1, 20, lite(B));
    const lamp = (y, on, col) => {
      g.rect(7, y, 10, y + 3, on ? col : mix(col, 0.32));
      g.pts([[7, y], [10, y], [7, y + 3], [10, y + 3]], B);
      g.row(y - 1, 6, 12, K); // the visor
      if (R) g.rect(8, y + 1, 9, y + 2, K);
    };
    lamp(3, R, RED);
    lamp(9, R, R ? RED : AMB);
    lamp(15, true, R ? RED : GRN);
    if (R) {
      g.rect(5, 21, 12, 23, MOUTH);
      g.teeth(5, 12, 21, 1, BONE, 2);
      g.teeth(6, 12, 23, -1, BONE, 2);
      g.rect(5, 24, 12, 25, B);
    }
  }, { u: [24, 46, 3] });

  be('street-shadow-long', 'long shadow large tall standing shadow man hat no one casts it dark figure grin', 22, 48, (g, R) => {
    const S = hex('#1b1824'),
      L = hex('#3a3548');
    g.oval(2, 44, 19, 46, S);
    g.rect(8, 28, 10, 45, S);
    g.rect(12, 28, 14, 45, S);
    g.poly([[7, 10], [15, 10], [16, 30], [6, 30]], S);
    if (!R) {
      g.rect(5, 11, 6, 33, S);
      g.rect(16, 11, 17, 33, S);
      g.col(5, 12, 32, L);
    } else {
      g.limb([[6, 11], [1, 16], [-2, 27]], S, 2, S);
      g.claws(-2, 27, 4, [0, 1], 6, S);
      g.limb([[16, 11], [21, 14], [23, 23]], S, 2, S);
      g.claws(23, 23, 4, [0.2, 1], 6, S);
    }
    g.rect(8, 3, 14, 9, S);
    g.row(3, 5, 17, S);
    g.rect(8, 1, 14, 2, S);
    g.col(7, 11, 29, L);
    g.col(8, 4, 8, L);
    g.col(8, 30, 43, L);
    g.row(1, 8, 13, L);
    if (R) {
      g.rect(9, 5, 10, 5, EYE);
      g.rect(12, 5, 13, 5, EYE);
      g.row(7, 8, 14, EYE);
      g.pts([[8, 6], [14, 6]], EYE);
      g.pts([[10, 7], [12, 7]], S);
    }
  }, { u: [28, 48, 3] });

  /* ================= LARGE, LONG ================= */
  be('street-bus-throat', 'bus with a throat large long night bus monster mouth teeth tongue vehicle swallows', 48, 30, (g, R) => {
    const B = BUS;
    g.rect(1, 4, 46, 23, B);
    g.row(4, 1, 46, lite(B));
    g.row(3, 3, 44, dark(B));
    g.rect(1, 15, 46, 16, hex('#b5a47c'));
    g.rect(1, 20, 46, 23, dark(B));
    for (let i = 0; i < 6; i++) {
      const x = 3 + i * 6,
        lit = i % 3 === 1;
      g.rect(x, 7, x + 4, 13, lit ? LIT : GLASS);
      if (lit) {
        g.rect(x + 1, 10, x + 3, 13, NIGHT); // someone still sits there
        g.rect(x + 1, 9, x + 2, 10, NIGHT);
        if (R) g.set(x + 2, 10, RED);
      } else if (R) g.pts([[x + 1, 10], [x + 3, 10]], EYE);
    }
    if (!R) {
      g.rect(34, 7, 37, 22, dark(B)); // the door
      g.rect(35, 8, 36, 14, GLASS);
      g.rect(40, 7, 46, 14, GLASS);
      g.rect(39, 5, 45, 5, hex('#b08a3a'));
      g.rect(44, 18, 45, 19, YEL);
      g.row(21, 38, 46, K); // a seam where the front should not have one
      g.pts([[39, 20], [41, 20], [43, 20], [45, 20]], BONE);
    } else {
      g.clearRect(29, 3, 46, 23);
      g.poly([[30, 12], [46, 5], [46, 19], [30, 17]], MOUTH);
      g.oval(30, 11, 36, 18, GUM);
      g.oval(31, 12, 35, 17, K);
      g.poly([[29, 4], [46, -3], [46, 4], [30, 11]], B);
      g.line(29, 4, 46, -3, lite(B));
      g.line(34, 5, 45, 0, GLASS);
      g.line(34, 6, 45, 1, GLASS);
      g.poly([[29, 18], [46, 20], [46, 23], [29, 23]], dark(B));
      for (let x = 32; x <= 46; x += 2) {
        const yu = Math.round(12 - ((x - 30) * 7) / 16),
          yl = Math.round(17 + ((x - 30) * 2) / 16);
        g.col(x, yu, yu + 1, BONE);
        g.col(x, yl - 1, yl, BONE);
      }
      g.tube([[35, 15], [41, 15], [45, 19], [45, 27]], 1.6, 1.2, TONGUE);
      g.rect(43, 21, 44, 22, YEL);
    }
    g.wheel(10, 25, 3);
    g.wheel(R ? 26 : 30, 25, 3);
  }, { u: [48, 34, 0] });

  be('street-crosswalk-crawler', 'crosswalk crawler large long zebra crossing stripes peeled off the road flat worm hands', 48, 14, (g, R) => {
    const W = hex('#cfcabb'),
      F = hex('#b9a890');
    const lift = [1, 3, 6, 9, 11];
    for (let i = 0; i < 11; i++) {
      const x = 2 + i * 4;
      let y = 7 + Math.round(Math.sin(i * 1.1));
      const up = R && i >= 6;
      if (up) y -= lift[i - 6];
      const col = i % 2 ? ASPH : W;
      if (i === 10) {
        // the head: a blunt end with road studs for eyes
        g.rect(x - 1, y - 2, x + 3, y + 3, W);
        g.row(y - 2, x - 1, x + 3, lite(W));
        g.pts([[x, y - 1], [x + 2, y - 1]], R ? YEL : hex('#7a7040'));
        if (R) g.maw(x - 1, y + 1, x + 3, y + 3, { teeth: 2 });
        else g.row(y + 2, x, x + 3, ASPH);
        continue;
      }
      g.rect(x, y, x + 3, y + 3, col);
      g.row(y, x, x + 3, lite(col));
      if (!up) g.pts([[x + 1, y + 4], [x + 1, y + 5], [x + 3, y + 4]], F);
      else if (i % 2 === 0) {
        g.limb([[x + 3, y + 3], [x + 6, y + 4]], F);
        g.pts([[x + 7, y + 3], [x + 7, y + 5]], F);
      } else g.row(y + 3, x, x + 3, K);
    }
  }, { u: [50, 26, 0] });

  be('street-taxi-breathing', 'breathing taxi large long cab car alive ribs monster vehicle mouth bonnet', 44, 22, (g, R) => {
    const Y = TAXI;
    if (R) g.oval(3, 8, 36, 20, Y); // it swells
    g.rect(2, 10, 41, 17, Y);
    g.poly([[10, 10], [13, 3], [28, 3], [32, 10]], Y);
    g.row(3, 13, 28, lite(Y));
    g.row(10, 2, 41, lite(Y));
    g.rect(2, 16, 41, 17, dark(Y));
    g.poly([[13, 9], [15, 5], [19, 5], [19, 9]], GLASS);
    g.rect(21, 5, 26, 9, GLASS);
    g.poly([[28, 5], [30, 9], [28, 9]], GLASS);
    for (let x = 3; x <= 40; x++) g.set(x, 12 + (x % 2), (x >> 1) % 2 ? K : Y);
    for (const x of [14, 17, 20, 23, 26]) {
      g.col(x, R ? 13 : 14, R ? 18 : 15, vd(Y)); // ribs under the doors
      if (R) g.col(x + 1, 14, 17, lite(Y));
    }
    g.rect(18, 1, 23, 2, R ? LAMP : hex('#6e6a48'));
    if (!R) {
      g.rect(40, 11, 41, 12, LIT);
      g.row(11, 40, 41, dark(Y)); // a heavy lid
      g.col(42, 14, 16, C.ironDark);
      g.set(42, 15, BONE);
      g.row(17, 37, 42, C.steel);
      g.pts([[0, 15], [1, 14]], C.ghost);
    } else {
      g.clearRect(33, 8, 45, 17);
      g.poly([[34, 12], [44, 6], [44, 15], [34, 16]], MOUTH);
      g.poly([[32, 10], [43, 3], [44, 6], [34, 12]], Y);
      g.line(32, 10, 43, 3, lite(Y));
      g.rect(33, 16, 43, 17, dark(Y));
      g.row(18, 36, 44, C.steel);
      for (let x = 36; x <= 44; x += 2) {
        const yu = Math.round(12 - ((x - 34) * 6) / 10);
        g.col(x, yu, yu + 1, BONE);
        g.set(x, 15, BONE);
      }
      g.tube([[36, 14], [41, 14], [44, 17], [44, 20]], 1.3, 1, TONGUE);
      g.rect(39, 6, 40, 7, YEL);
      g.set(40, 7, RED);
      g.pts([[16, 7], [17, 6], [23, 7], [24, 6], [22, 8]], PALE); // hands on the glass
      g.pts([[0, 14], [1, 13], [0, 12], [-1, 15]], C.ghost);
    }
    g.wheel(10, 17, 3);
    g.wheel(R ? 30 : 33, 17, 3);
  }, { u: [48, 26, 2] });

  be('street-sweeper-maw', 'street sweeper maw large long machine brush mouth bristle teeth municipal monster vehicle', 40, 26, (g, R) => {
    const M = hex('#5a6e58'),
      BR = hex('#9a8450');
    g.rect(2, 6, 24, 19, M);
    g.row(6, 2, 24, lite(M));
    g.rect(2, 17, 24, 19, dark(M));
    for (const y of [9, 11, 13]) g.row(y, 4, 9, dark(M));
    for (let x = 2; x <= 24; x += 4) g.rect(x, 18, x + 1, 19, hex('#b08a3a'));
    g.rect(25, 9, 35, 19, M);
    g.rect(27, 10, 34, 14, GLASS);
    g.rect(29, 7, 30, 8, R ? hex('#e0a030') : hex('#7a5a28'));
    g.wheel(8, 21, 3);
    g.wheel(26, 21, 3);
    if (!R) {
      g.limb([[35, 12], [38, 14], [37, 18]], C.ironDark, 2);
      g.oval(31, 19, 38, 24, BR);
      g.speckle(31, 19, 38, 24, dark(BR), 3, 4);
      g.rect(34, 21, 35, 22, K);
      g.pts([[30, 11], [32, 11]], NIGHT); // someone small at the wheel
    } else {
      g.poly([[2, 5], [23, 5], [23, 1]], NIGHT); // the hopper lid lifts
      g.line(2, 4, 23, 0, dark(M));
      g.pts([[13, 4], [15, 4], [18, 3], [20, 3], [21, 4], [9, 4]], EYE);
      g.oval(31, 7, 42, 24, BR);
      g.speckle(31, 7, 42, 24, dark(BR), 3, 4);
      g.oval(33, 10, 40, 21, MOUTH);
      for (let a = 0; a < 12; a++) {
        const t = (a / 12) * Math.PI * 2;
        g.set(36.5 + Math.cos(t) * 3.4, 15.5 + Math.sin(t) * 5, BONE);
      }
      g.oval(35, 13, 38, 18, K);
      g.pts([[36, 15], [37, 16]], GUM);
      g.pts([[29, 12], [32, 12]], RED);
    }
  }, { u: [44, 28, 0] });

  /* ================= PERSON-SIZED ================= */
  be('street-manhole-dweller', 'manhole dweller sewer thing under the cover pale long arms eyes drain lurker', 20, 12, (g, R) => {
    const I = hex('#4a4a55'),
      S = WET;
    g.oval(1, 6, 18, 10, hex('#2a2a32'));
    g.oval(2, 7, 17, 10, K);
    if (!R) {
      g.poly([[2, 4], [17, 1], [17, 3], [2, 6]], I);
      g.line(2, 4, 17, 1, lite(I));
      g.pts([[6, 4], [10, 3], [14, 2]], dark(I));
      g.pts([[8, 7], [11, 7]], EYE);
      g.pts([[13, 5], [15, 5], [17, 5], [13, 6], [15, 6], [17, 6], [14, 4], [16, 4]], S);
    } else {
      g.limb([[9, -3], [3, 0], [1, 6]], S, 2);
      g.claws(1, 7, 3, [0, 1], 3, S);
      g.limb([[11, -3], [18, -6], [20, 2]], S, 2);
      g.claws(20, 3, 4, [0.2, 1], 4, S);
      g.tube([[10, 8], [9, 0], [10, -8]], 2.6, 2.4, S);
      for (const y of [-4, -1, 2, 5]) g.row(y, 8, 11, dark(S));
      g.oval(6, -15, 14, -6, S);
      g.oval(2, -19, 18, -15, I);
      g.row(-19, 6, 14, lite(I));
      g.rect(7, -12, 8, -11, K);
      g.rect(11, -12, 12, -11, K);
      g.pts([[8, -12], [12, -12]], EYE);
      g.maw(7, -9, 12, -8, { teeth: 1 });
    }
  }, { u: [24, 32, 2] });

  const sheet = (g, pts, tone, seed) => {
    const col = tone === 1 ? PAPER : tone === 2 ? hex('#aea68c') : hex('#ddd6be');
    g.poly(pts, col);
    const xs = pts.map((p) => p[0]),
      ys = pts.map((p) => p[1]),
      r = rnd(seed);
    for (let y = Math.min(...ys) + 1; y < Math.max(...ys); y += 2)
      for (let x = Math.min(...xs) + 1; x < Math.max(...xs); x++) if (r() < 0.65 && g.get(x, y) === col && g.get(x + 1, y) === col && g.get(x - 1, y)) g.set(x, y, INK);
  };
  be('street-newspaper-man', 'newspaper man swarm of pages shaped like a man paper figure litter hollow wind', 18, 34, (g, R) => {
    sheet(g, [[5, 25], [8, 25], [8, 32], [4, 32]], 2, 3);
    sheet(g, [[10, 25], [13, 25], [14, 32], [10, 32]], 1, 4);
    sheet(g, [[3, 13], [14, 12], [15, 25], [4, 26]], 1, 5);
    sheet(g, [[6, 14], [13, 13], [12, 23], [7, 22]], 3, 6);
    if (!R) {
      sheet(g, [[1, 14], [3, 13], [4, 25], [2, 26]], 2, 7);
      sheet(g, [[14, 13], [16, 14], [16, 26], [14, 25]], 2, 8);
      sheet(g, [[5, 5], [12, 5], [13, 12], [6, 13]], 3, 9);
      g.poly([[4, 6], [9, 1], [14, 6]], hex('#aea68c'));
      g.line(9, 1, 9, 5, INK);
      g.pts([[7, 8], [10, 8]], INK);
    } else {
      g.oval(6, 15, 12, 22, NIGHT); // nothing inside but something looking out
      g.pts([[8, 18], [10, 18]], EYE);
      g.teeth(7, 11, 21, -1, BONE, 2);
      sheet(g, [[-4, 7], [2, 12], [3, 18], [-3, 14]], 2, 7);
      sheet(g, [[15, 12], [21, 6], [22, 13], [16, 18]], 2, 8);
      sheet(g, [[-4, 22], [0, 20], [1, 24], [-3, 26]], 3, 11);
      sheet(g, [[18, 22], [22, 21], [21, 26], [18, 25]], 1, 12);
      sheet(g, [[16, -1], [20, 0], [19, 3], [15, 3]], 3, 13);
      sheet(g, [[5, 4], [12, 3], [14, 11], [6, 12]], 3, 9);
      g.poly([[1, 2], [6, -1], [9, 3]], hex('#aea68c'));
      g.pts([[7, 6], [11, 6]], K);
      g.row(9, 7, 12, K);
      g.pts([[8, 10], [10, 10], [12, 10], [7, 8], [9, 8], [11, 8]], K);
    }
  }, { u: [28, 36, 5] });

  be('street-last-passenger', 'last passenger commuter faceless man hat briefcase holding a strap head splits ghost of the night bus', 18, 38, (g0, R) => {
    const g = g0.at(1, 5),
      CO = hex('#4a4652'),
      H = hex('#2a2630'),
      LE = hex('#6b4a34');
    g.col(13, -4, -3, C.ironDark); // the strap he still holds, hanging from nothing
    g.frame(12, -2, 14, 1, hex('#8a744e'));
    fig(g, {
      skin: ASHEN,
      top: CO,
      legs: hex('#2e2c36'),
      coat: CO,
      coatLen: 6,
      arms: { l: 'down', r: [2, 2, 0, 8] },
      face: (h, s) => {
        if (!R) return;
        h.col(3, 4, 9, s); // the head has come apart down the middle
        h.col(12, 4, 9, dark(s));
        h.rect(6, 3, 9, 11, MOUTH);
        h.pts([[6, 4], [6, 6], [6, 8], [6, 10], [9, 5], [9, 7], [9, 9]], BONE);
        h.pts([[4, 6], [11, 6]], EYE);
        h.col(7, 9, 13, TONGUE);
      },
    });
    if (!R) {
      g.row(3, 3, 12, H);
      g.rect(5, 1, 10, 2, H);
    } else {
      g.row(3, 2, 5, H);
      g.row(3, 10, 13, H);
      g.rect(4, 1, 5, 2, H);
      g.rect(10, 1, 11, 2, H);
    }
    g.rect(0, 24, 5, 28, LE);
    g.row(24, 0, 5, lite(LE));
    g.row(23, 2, 3, dark(LE));
    if (R) {
      g.rect(0, 25, 5, 26, K);
      g.pts([[1, 25], [3, 25], [5, 25], [2, 26], [4, 26]], BONE);
    }
  }, { u: [18, 38, 0] });

  be('street-pigeon-king', 'pigeon king three headed pigeon crown fat bird many heads feral monster wings', 24, 26, (g, R) => {
    const G = hex('#77767e'),
      D = hex('#55545e'),
      IR = hex('#4a6a62'),
      PK = hex('#b07a78'),
      BK = hex('#c9a04a');
    g.col(9, 21, 23, PK);
    g.col(14, 21, 23, PK);
    g.row(24, 7, 10, PK);
    g.row(24, 13, 16, PK);
    g.poly([[2, 15], [7, 13], [7, 20], [1, 19]], D);
    g.oval(4, 11, 19, 22, G);
    if (!R) {
      g.oval(5, 13, 14, 20, D);
      g.line(7, 15, 13, 18, G);
      g.line(6, 17, 11, 19, G);
    } else {
      for (const v of [g, g.flip(23)]) {
        v.poly([[6, 13], [-5, 2], [-6, 11], [0, 16], [5, 18]], D);
        v.line(6, 13, -5, 3, lite(D));
        v.line(5, 15, -5, 8, vd(D));
        v.line(5, 17, -2, 13, vd(D));
        v.pts([[-6, 12], [-4, 14], [-1, 17]], G);
      }
    }
    const hd = (x, y, bx, by, dir, crown) => {
      g.limb([[bx, by], [x, y + 3]], G, 2);
      g.set(x, y + 4, IR);
      g.set(x, y + 5, hex('#5d4274'));
      g.rect(x - 1, y, x + 1, y + 2, G);
      g.set(x, y + 1, R ? RED : K);
      if (!R) g.set(x + dir * 2, y + 1, BK);
      else {
        g.pts([[x + dir * 2, y], [x + dir * 3, y - 1], [x + dir * 2, y + 2], [x + dir * 3, y + 3]], BK);
        g.set(x + dir * 2, y + 1, MOUTH);
      }
      if (crown) {
        g.row(y - 1, x - 1, x + 1, C.gold);
        g.pts([[x - 1, y - 2], [x + 1, y - 2], [x, y - 2]], C.gold);
        g.set(x, y - 3, C.gold);
      }
    };
    const up = R ? -2 : 0;
    hd(6, 7 + up, 9, 13, -1);
    hd(18, 7 + up, 15, 13, 1);
    hd(12, 4 + up, 12, 12, 1, true);
  }, { u: [38, 30, 7] });

  be('street-parking-meter-mimic', 'parking meter mimic disguised monster meter head opens jaws coin teeth', 12, 28, (g, R) => {
    const S = hex('#7d8088'),
      D = hex('#4a4c56');
    if (!R) {
      g.rect(5, 13, 6, 25, S);
      g.col(6, 13, 25, D);
      g.rect(3, 25, 8, 26, D);
      g.rect(4, 11, 7, 12, D);
      g.oval(2, 1, 9, 11, S);
      g.col(3, 3, 8, lite(S));
      g.rect(4, 3, 8, 5, GLASS);
      g.set(5, 4, RED);
      g.set(7, 4, EYE);
      g.row(7, 5, 6, K);
      g.row(9, 4, 7, D);
    } else {
      g.limb([[5, 12], [7, 18], [5, 23]], S, 2);
      g.limb([[5, 23], [2, 25], [1, 26]], S);
      g.limb([[6, 23], [9, 25], [11, 26]], S);
      g.pts([[0, 26], [12, 26]], BONE);
      g.oval(2, -3, 9, 6, S);
      g.rect(4, -1, 8, 1, GLASS);
      g.rect(5, 0, 6, 0, EYE);
      g.set(6, 0, RED);
      g.rect(2, 3, 9, 8, MOUTH);
      g.teeth(2, 9, 3, 1, BONE, 2, 2);
      g.rect(2, 8, 9, 11, S);
      g.pts([[2, 11], [9, 11]], D);
      g.teeth(3, 9, 7, -1, BONE, 2, 2);
      g.rect(4, 12, 7, 12, D);
      g.tube([[5, 6], [11, 8], [13, 13]], 1.2, 0.8, hex('#a03a34'));
    }
  }, { u: [18, 32, 3] });

  be('street-mailbox-maw', 'mailbox maw pillar box post box red mouth slot teeth tongue letters mimic', 14, 24, (g, R) => {
    const Rd = hex('#8a3028'),
      Bk = hex('#26242c');
    if (R) {
      g.limb([[2, 12], [-2, 15], [-1, 20]], Bk);
      g.claws(-1, 20, 3, [0, 1], 2, Bk);
    }
    g.rect(2, 4, 11, 21, Rd);
    g.oval(1, 1, 12, 7, Rd);
    g.rect(1, 20, 12, 22, Bk);
    g.col(3, 5, 19, lite(Rd));
    g.col(10, 5, 19, dark(Rd));
    g.row(6, 1, 12, dark(Rd));
    g.rect(5, 14, 8, 17, C.paper);
    g.row(15, 6, 7, INK);
    if (!R) {
      g.rect(4, 9, 9, 10, K);
      g.pts([[5, 9], [8, 9]], EYE);
      g.rect(7, 10, 9, 11, C.white);
    } else {
      g.maw(2, 7, 11, 12, { teeth: 2, len: 2 });
      g.tube([[6, 11], [12, 12], [16, 16], [17, 22]], 1.5, 1, TONGUE);
      g.rect(12, 12, 14, 13, C.white);
      g.rect(16, 18, 17, 19, C.white);
      g.pts([[4, 4], [9, 4]], YEL);
    }
  }, { u: [22, 26, 3] });

  be('street-busker-hollow', 'hollow busker accordion player street musician dead eyes accordion is a mouth ribs', 20, 34, (g0, R) => {
    const g = g0.at(2, 1),
      A = hex('#6b2332'),
      BL = hex('#c8bea3'),
      CAP = hex('#4a4038');
    fig(g, {
      skin: ASHEN,
      top: hex('#4a3f36'),
      legs: hex('#33303a'),
      face: R ? 'wide' : 'hollow',
      arms: R ? { l: [-3, 18, -1, 14], r: [-3, 18, -1, 14] } : { l: [3, 19, 1, 17], r: [3, 19, 1, 17] },
    });
    g.rect(4, 1, 11, 3, CAP);
    g.row(3, 4, 13, dark(CAP));
    if (!R) {
      g.rect(6, 16, 9, 22, BL);
      for (const x of [6, 8]) g.col(x, 16, 22, dark(BL));
      g.rect(3, 15, 5, 23, A);
      g.rect(10, 15, 12, 23, A);
      g.pts([[4, 17], [4, 19], [4, 21]], C.white);
      g.pts([[11, 17], [11, 19], [11, 21]], C.brass);
    } else {
      g.rect(-1, 15, 16, 23, MOUTH);
      for (let x = 0; x <= 16; x += 4) g.col(x, 15, 23, dark(BL));
      g.teeth(-1, 16, 15, 1, BL, 2, 2);
      g.teeth(0, 16, 23, -1, BL, 2, 2);
      g.rect(5, 20, 10, 21, TONGUE);
      g.rect(-4, 14, -2, 24, A);
      g.rect(17, 14, 19, 24, A);
      g.pts([[-3, 16], [-3, 18], [-3, 20], [-3, 22]], C.white);
      g.pts([[18, 16], [18, 18], [18, 20], [18, 22]], C.brass);
      g.rect(-4, 17, -3, 18, ASHEN);
      g.rect(18, 17, 19, 18, ASHEN);
    }
  }, { u: [28, 34, 4] });

  be('street-umbrella-bat', 'umbrella bat black umbrella hangs like a bat opens wings ribs fangs flying', 12, 24, (g, R) => {
    const U = hex('#24222c'),
      UL = hex('#4a4858'),
      W = C.wood;
    if (!R) {
      g.pts([[5, 1], [4, 1], [3, 2], [3, 3]], W);
      g.col(6, 1, 5, W);
      g.poly([[4, 6], [7, 6], [8, 10], [7, 19], [6, 21], [5, 21], [4, 19], [3, 10]], U);
      g.col(5, 7, 19, UL);
      g.row(12, 3, 8, UL);
      g.set(8, 12, C.brass);
      g.set(6, 9, YEL);
      g.shadow(3, 9, 22);
    } else {
      g.poly([[6, 1], [14, 3], [20, 8], [21, 12], [17, 10], [13, 12], [9, 10], [6, 12], [3, 10], [-1, 12], [-5, 10], [-9, 12], [-8, 8], [-2, 3]], U);
      for (const [x, y] of [[21, 12], [13, 12], [6, 12], [-1, 12], [-9, 12]]) {
        g.line(6, 2, x, y, UL);
        g.set(x, y + 1, BONE);
      }
      g.col(6, 12, 18, W);
      g.pts([[5, 19], [4, 19], [3, 18]], W);
      g.rect(4, 6, 8, 8, NIGHT);
      g.pts([[4, 7], [8, 7]], RED);
      g.pts([[5, 9], [7, 9], [5, 10], [7, 10]], BONE);
      g.shadow(0, 12, 22);
    }
  }, { u: [32, 24, 10] });

  be('street-stray-split', 'split stray dog thin mongrel hound head splits open jaws down the neck teeth animal gone bad', 26, 16, (g, R) => {
    const F = hex('#8a7a62'),
      D = dark(F);
    g.line(4, 7, 1, 11, F);
    for (const x of [5, 7, 16, 18]) {
      g.col(x, 10, 14, x === 7 || x === 18 ? D : F);
      g.set(x + 1, 14, x === 7 || x === 18 ? D : F);
    }
    g.rect(5, 6, 18, 9, F);
    g.oval(3, 5, 9, 10, F);
    g.oval(14, 5, 20, 11, F);
    for (const x of [10, 12, 14]) g.col(x, 7, 9, D);
    g.pts([[8, 5], [10, 5], [12, 5], [14, 5]], lite(F));
    if (!R) {
      g.poly([[18, 5], [21, 3], [23, 3], [20, 9]], F);
      g.rect(20, 2, 23, 6, F);
      g.rect(22, 4, 24, 6, F);
      g.pts([[20, 1], [21, 1]], D);
      g.set(22, 3, K);
      g.set(24, 4, K);
      g.line(24, 6, 21, 6, K);
      g.line(21, 6, 17, 10, K);
    } else {
      g.poly([[19, 7], [27, 0], [27, 12], [18, 10]], MOUTH);
      g.poly([[17, 4], [25, -3], [27, -1], [20, 7]], F);
      g.poly([[17, 10], [26, 12], [27, 14], [18, 12]], F);
      for (let i = 0; i < 4; i++) {
        g.col(21 + i * 2, 5 - i * 2, 6 - i * 2, BONE);
        g.col(20 + i * 2, 10, 11, BONE);
      }
      g.tube([[20, 8], [24, 8], [28, 6]], 1.2, 0.8, TONGUE);
      g.set(23, -1, EYE);
      g.pts([[19, 2], [20, 1]], D);
      g.pts([[9, 4], [11, 3], [13, 4], [15, 3]], D); // hackles
    }
  }, { u: [30, 20, 0] });

  be('street-sandwich-board', 'sandwich board man walking sign no body no head hat boards open like jaws the end is nigh', 16, 32, (g, R) => {
    const Wd = C.wood,
      Pp = PAPER,
      TR = hex('#3a3640'),
      HAT = hex('#2a2630');
    g.rect(5, 24, 7, 30, TR);
    g.rect(9, 24, 11, 30, TR);
    g.rect(4, 29, 7, 30, NIGHT);
    g.rect(9, 29, 12, 30, NIGHT);
    const hy = R ? -2 : 0;
    g.rect(5, 1 + hy, 10, 3 + hy, HAT);
    g.row(4 + hy, 3, 12, HAT);
    g.row(3 + hy, 5, 10, hex('#5a5048'));
    const board = (y0, y1) => {
      g.rect(2, y0, 13, y1, Wd);
      g.rect(3, y0 + 1, 12, y1 - 1, Pp);
    };
    if (!R) {
      g.line(4, 8, 6, 6, C.earth);
      g.line(11, 8, 9, 6, C.earth);
      board(8, 25);
      g.row(11, 5, 10, K);
      g.row(14, 4, 11, K);
      g.row(17, 5, 9, K);
      g.row(21, 6, 10, hex('#8f1d1d'));
    } else {
      g.line(4, 4, 6, 3, C.earth);
      g.line(11, 4, 9, 3, C.earth);
      board(4, 12);
      g.row(6, 5, 10, K);
      g.row(9, 4, 11, K);
      g.rect(2, 13, 13, 19, MOUTH);
      g.teeth(2, 13, 13, 1, BONE, 2, 2);
      g.teeth(3, 13, 19, -1, BONE, 2, 2);
      g.rect(7, 15, 8, 16, EYE);
      g.set(8, 16, K);
      board(20, 25);
      g.row(22, 6, 10, hex('#8f1d1d'));
      g.claws(1, 16, 3, [-1, 0.3], 3, PALE);
      g.claws(14, 16, 3, [1, 0.3], 3, PALE);
    }
  }, { u: [22, 34, 3] });

  be('street-puddle-face', 'puddle face rain water thing rises from a puddle drowned reflection wet ghost', 22, 8, (g, R) => {
    const Wt = hex('#2c4a5e'),
      L = hex('#6a8a9a'),
      DR = hex('#4f7488');
    g.oval(1, 3, 20, 6, Wt);
    g.row(4, 4, 8, L);
    g.set(16, 5, LAMP);
    if (!R) {
      g.pts([[10, 4], [13, 4]], hex('#b9c8cc'));
      g.row(5, 11, 12, hex('#b9c8cc'));
    } else {
      g.tube([[9, -5], [3, -8], [0, -3]], 1.2, 0.8, DR);
      g.tube([[12, -5], [18, -9], [21, -3]], 1.2, 0.8, DR);
      g.pts([[0, -1], [21, -1], [3, -6], [18, -6], [0, 1]], L);
      g.tube([[11, 5], [10, -2], [11, -8]], 3.2, 2.2, DR);
      g.oval(7, -15, 14, -7, DR);
      g.col(8, -13, -3, L);
      g.rect(9, -12, 9, -11, K);
      g.rect(12, -12, 12, -11, K);
      g.oval(10, -10, 11, -8, K);
      g.pts([[7, -6], [14, -5], [13, -2]], L);
    }
  }, { u: [24, 25, 1] });

  be('street-smog-wraith', 'smog wraith smoke ghost soot fog figure ember eyes chimney haze floating', 20, 36, (g, R) => {
    const S = hex('#6e6860'),
      D = hex('#4a4640'),
      L = hex('#8d867a');
    if (R) {
      g.tube([[4, 13], [-1, 10], [-3, 3]], 2.2, 1, S, D);
      g.tube([[15, 13], [20, 12], [22, 19]], 2.2, 1, S, D);
    }
    g.oval(5, 1, 14, 10, S);
    g.oval(2, 9, 17, 22, S);
    g.oval(4, 18, 15, 30, S);
    g.oval(7, 26, 13, 34, S);
    g.oval(6, 2, 10, 5, L);
    g.oval(4, 11, 9, 16, L);
    g.dither(2, 16, 17, 34, D);
    g.fade(2, 17, 25, 34);
    if (!R) g.pts([[7, 6], [11, 6]], C.flame);
    else {
      g.pts([[7, 5], [11, 5], [6, 7], [12, 7]], C.flame);
      g.oval(7, 8, 11, 13, K);
      g.set(9, 11, C.flame);
      g.set(9, 12, C.flameLight);
    }
    g.c.outline(D);
    return false;
  }, { u: [26, 38, 3] });

  be('street-ticket-inspector', 'ticket inspector conductor tall thin uniform slot mouth punch pincers tickets no longer a person', 18, 40, (g0, R) => {
    const g = g0.at(1, 2),
      N = hex('#28304e');
    fig(g, {
      skin: ASHEN,
      top: N,
      legs: dark(N),
      tl: 12,
      ll: 13,
      arms: R ? { l: [-3, 13, -1, 16], r: [-3, 13, -1, 16] } : 'down',
      face: (h) => h.rect(5, 7, 10, 8, K), // a slot where the face should be
      body: (b) => {
        b.pts([[6, 14], [6, 17], [6, 20]], C.brass);
        b.rect(8, 19, 10, 22, C.steel);
        b.row(20, 8, 10, K);
      },
    });
    g.rect(4, 0, 11, 2, N);
    g.row(3, 3, 12, hex('#16141d'));
    if (R) {
      g.rect(7, 1, 8, 1, EYE);
      g.set(8, 1, K);
    } else g.set(7, 1, C.brass);
    for (const v of [g, g.flip(15)]) {
      if (!R) {
        v.col(2, 25, 27, C.steel);
        v.set(1, 27, C.steel);
      } else {
        v.line(-4, 12, -7, 9, C.steel);
        v.line(-4, 14, -7, 16, C.steel);
      }
    }
    if (R) {
      g.limb([[7, 8], [9, 14], [6, 20], [9, 27], [7, 33]], C.paper, 2);
      g.pts([[8, 11], [8, 17], [7, 23], [8, 30]], INK);
    }
  }, { u: [28, 40, 5] });

  be('street-bin-lurker', 'litter bin lurker rubbish bin thing long arms eyes inside trash monster', 14, 22, (g, R) => {
    const Gn = hex('#3f5a44'),
      D = dark(Gn),
      MAT = hex('#6a6252');
    if (R) {
      g.limb([[2, 8], [-3, 10], [-4, 19]], PALE);
      g.claws(-4, 19, 3, [0, 1], 2, PALE);
      g.limb([[11, 7], [16, 5], [18, 13]], PALE);
      g.claws(18, 13, 4, [0.2, 1], 4, PALE);
    }
    g.rect(2, 9, 11, 19, Gn);
    g.row(20, 3, 10, D);
    for (const x of [4, 6, 8, 10]) g.col(x, 10, 18, D);
    g.rect(1, 8, 12, 9, D);
    if (!R) {
      g.oval(1, 1, 12, 10, Gn);
      g.row(2, 4, 8, lite(Gn));
      g.rect(1, 8, 12, 9, D);
      g.rect(3, 5, 10, 7, K);
      g.pts([[5, 6], [8, 6]], EYE);
      g.col(10, 7, 12, PALE);
      g.set(9, 7, PALE);
    } else {
      g.poly([[9, 3], [15, -4], [17, -2], [12, 7]], Gn); // the lid thrown back
      g.rect(2, 6, 11, 8, K);
      g.oval(3, -3, 10, 7, MAT);
      g.speckle(3, -3, 10, 7, dark(MAT), 3, 2);
      g.rect(4, 0, 9, 4, PALE);
      g.pts([[5, 1], [8, 1]], K);
      g.rect(5, 3, 8, 4, MOUTH);
      g.teeth(5, 8, 3, 1, BONE, 1);
      g.pts([[2, 2], [11, 1], [3, 5]], hex('#8a8474'));
    }
  }, { u: [24, 28, 5] });

  be('street-cyclist-fused', 'fused cyclist rider grown into his bicycle bike man wheels spokes flesh', 28, 30, (g, R) => {
    const FR = hex('#4a4a55'),
      SK = hex('#b9a890'),
      SH = hex('#5a5048'),
      TY = hex('#22202a');
    const wheel = (cx, cy, r, eye) => {
      for (let a = 0; a < 40; a++) g.set(cx + Math.cos((a / 40) * 6.283) * r, cy + Math.sin((a / 40) * 6.283) * r, TY);
      for (let a = 0; a < 4; a++) g.line(cx - Math.cos(a * 0.785) * (r - 1), cy - Math.sin(a * 0.785) * (r - 1), cx + Math.cos(a * 0.785) * (r - 1), cy + Math.sin(a * 0.785) * (r - 1), eye ? SK : C.steel);
      if (eye) {
        for (let a = 0; a < 8; a++) g.set(cx + Math.cos(a * 0.785 + 0.39) * (r - 2), cy + Math.sin(a * 0.785 + 0.39) * (r - 2), BONE);
        g.rect(cx - 1, cy - 1, cx + 1, cy + 1, EYE);
        g.set(cx, cy, RED);
      } else g.set(cx, cy, FR);
    };
    wheel(7, 22, 6);
    wheel(20, 22, 6, R);
    g.line(7, 22, 12, 14, FR);
    g.line(12, 14, 19, 14, FR);
    g.line(13, 22, 12, 13, FR);
    g.line(13, 22, 7, 22, FR);
    g.line(13, 22, 19, 14, FR);
    g.line(20, 22, 19, 11, FR);
    g.row(11, 18, 21, FR);
    g.limb([[12, 13], [16, 17], [13, 22]], SK, 2); // the leg has become the crank
    g.limb([[11, 13], [14, 18]], SH, 2);
    if (!R) {
      g.poly([[10, 13], [13, 13], [19, 8], [17, 5]], SH);
      g.limb([[18, 8], [20, 11]], SK, 2);
      g.oval(17, 1, 22, 6, SK);
      g.rect(17, 1, 21, 2, FR);
      g.set(20, 4, K);
      g.pts([[21, 11], [22, 11]], SK);
    } else {
      g.poly([[10, 13], [13, 13], [16, 5], [13, 3]], SH);
      g.pts([[10, 11], [11, 8], [12, 5], [9, 12], [10, 9], [11, 6]], BONE);
      g.limb([[15, 6], [20, 11]], SK, 2);
      g.oval(12, -4, 18, 2, SK);
      g.rect(12, -4, 16, -3, FR);
      g.pts([[14, -1], [16, -2]], K);
      g.maw(15, 0, 18, 2, { teeth: 1 });
      g.pts([[21, 11], [22, 11], [22, 12], [18, 12], [17, 13]], SK);
    }
  }, { u: [30, 34, 1] });

  be('street-pram-thing', 'pram thing baby carriage perambulator many arms big head something inside infant monster', 22, 26, (g, R) => {
    const N = hex('#2e3550'),
      D = dark(N),
      ST = C.steel;
    const wheel = (cx) => {
      for (let a = 0; a < 28; a++) g.set(cx + Math.cos((a / 28) * 6.283) * 4, 20 + Math.sin((a / 28) * 6.283) * 4, hex('#22202a'));
      g.line(cx - 3, 20, cx + 3, 20, ST);
      g.line(cx, 17, cx, 23, ST);
    };
    if (R) {
      for (const [a, b, d, e, f, h] of [[10, 7, 4, 3, 0, -3], [10, 8, 3, 8, -2, 11], [14, 7, 19, 2, 22, -3], [15, 8, 20, 8, 23, 12]]) {
        g.limb([[a, b], [d, e], [f, h]], PALE);
        g.claws(f, h, 3, [f < 10 ? -0.5 : 0.5, h < 0 ? -1 : 1], 2, PALE);
      }
      g.limb([[12, 8], [12, 1]], PALE, 2);
      g.oval(8, -6, 16, 2, PALE);
      g.rect(10, -3, 11, -2, K);
      g.rect(13, -3, 14, -2, K);
      g.row(0, 11, 13, MOUTH);
      g.pts([[11, 0], [13, 0]], BONE);
    }
    wheel(6);
    wheel(15);
    g.line(4, 15, 17, 15, ST);
    g.limb([[17, 9], [20, 5], [20, 3]], ST);
    if (!R) {
      g.oval(1, 1, 12, 14, N);
      g.clearRect(0, 9, 13, 15);
      g.line(2, 8, 4, 2, D);
      g.line(5, 8, 8, 1, D);
      g.poly([[7, 3], [11, 5], [12, 8], [6, 8]], K);
      g.pts([[8, 6], [10, 6]], EYE);
    } else {
      g.poly([[1, 8], [0, 3], [2, 1], [4, 8]], N); // the hood pushed back
      g.line(1, 7, 2, 2, D);
    }
    g.poly([[2, 8], [17, 8], [16, 14], [4, 14]], N);
    g.row(8, 2, 17, lite(N));
    g.row(14, 4, 16, D);
    if (!R) g.pts([[13, 7], [14, 7], [15, 7], [14, 8]], PALE);
  }, { u: [28, 34, 3] });

  /* ================= SMALL ================= */
  be('street-cone-creeper', 'traffic cone creeper cone on legs small vermin mouth underneath orange', 12, 14, (g, R) => {
    const O = ORANGE,
      Wh = hex('#d6d0c0'),
      y = R ? -4 : 0;
    if (R) {
      g.limb([[2, 7], [-1, 8], [0, 12]], PALE);
      g.limb([[4, 7], [3, 10], [3, 12]], PALE);
      g.limb([[7, 7], [8, 10], [8, 12]], PALE);
      g.limb([[9, 7], [12, 8], [11, 12]], PALE);
    }
    g.poly([[5, 1 + y], [6, 1 + y], [9, 9 + y], [2, 9 + y]], O);
    g.col(5, 2 + y, 8 + y, lite(O));
    g.rect(4, 4 + y, 7, 5 + y, Wh);
    g.pts([[4, 5 + y], [7, 5 + y]], R ? RED : K);
    g.rect(1, 10 + y, 10, 11 + y, dark(O));
    if (!R) g.pts([[2, 12], [4, 12], [7, 12], [9, 12]], PALE);
    else {
      g.row(8, 2, 9, MOUTH);
      g.teeth(2, 9, 8, 1, BONE, 2, 2);
    }
  }, { u: [16, 18, 2] });

  be('street-hydrant-thing', 'hydrant thing fire hydrant small tentacles hoses eye wet red', 12, 16, (g, R) => {
    const H = hex('#8a3028'),
      D = dark(H),
      T = hex('#3a4a50');
    if (R) {
      g.tentacle([[3, 8], [-2, 5], [-5, 9], [-3, 13]], 1.5, T, hex('#8fa6a0'));
      g.tentacle([[9, 8], [13, 4], [16, 8], [14, 13]], 1.5, T, hex('#8fa6a0'));
      g.pts([[0, 14], [12, 14], [-2, 14]], C.glassLight);
    }
    g.rect(4, 5, 8, 13, H);
    g.oval(3, 2, 9, 7, H);
    g.row(1, 5, 7, D);
    g.rect(2, 13, 10, 14, D);
    g.col(4, 4, 12, lite(H));
    g.rect(5, 8, 7, 10, D);
    if (R) {
      g.rect(5, 8, 7, 10, EYE);
      g.set(6, 9, K);
      g.rect(2, 7, 3, 9, K);
      g.rect(9, 7, 10, 9, K);
    } else {
      g.set(6, 9, H);
      g.rect(2, 7, 3, 9, D);
      g.rect(9, 7, 10, 9, D);
      g.pts([[3, 10], [3, 11]], C.steel);
    }
  }, { u: [24, 18, 6] });

  be('street-pigeon-toothed', 'toothed pigeon small bird human eye teeth in its beak vermin feral', 12, 11, (g, R) => {
    const G = hex('#77767e'),
      D = hex('#55545e');
    g.pts([[4, 9], [6, 9]], hex('#b07a78'));
    g.pts([[1, 6], [1, 7], [0, 7]], D);
    g.oval(2, 4, 8, 8, G);
    if (!R) {
      g.rect(3, 5, 6, 7, D);
      g.rect(7, 2, 9, 4, G);
      g.set(8, 3, EYE);
      g.set(9, 3, K);
      g.set(10, 4, hex('#c9a04a'));
      g.set(7, 5, hex('#4a6a62'));
    } else {
      g.poly([[3, 5], [1, -1], [4, 1], [6, 5]], D);
      g.line(3, 5, 1, -1, lite(D));
      g.rect(7, 1, 9, 4, G);
      g.set(8, 2, EYE);
      g.set(9, 2, RED);
      g.pts([[10, 1], [11, 0], [10, 4], [11, 5]], hex('#c9a04a'));
      g.pts([[10, 2], [10, 3]], MOUTH);
      g.pts([[11, 1], [11, 4]], BONE);
      g.pts([[11, 3], [12, 3]], TONGUE);
      g.set(7, 5, hex('#4a6a62'));
    }
  }, { u: [16, 14, 2] });

  be('street-glove-crawler', 'glove crawler lost leather glove crawls on its fingers small hand spider mouth in palm', 12, 10, (g, R) => {
    const L = hex('#5a4034'),
      D = dark(L);
    if (!R) {
      g.rect(3, 1, 7, 2, D);
      g.rect(2, 3, 8, 5, L);
      g.row(3, 2, 8, lite(L));
      for (const x of [2, 4, 6, 8]) {
        g.col(x, 6, 8, L);
        g.set(x, 8, D);
      }
      g.pts([[9, 4], [10, 5], [10, 6]], L);
    } else {
      g.limb([[2, 3], [0, 5], [1, 8]], L);
      g.limb([[4, 4], [3, 6], [3, 8]], L);
      g.limb([[6, 4], [7, 6], [7, 8]], L);
      g.limb([[8, 3], [10, 5], [9, 8]], L);
      g.limb([[9, 0], [10, -2]], L);
      g.rect(2, -1, 8, 3, L);
      g.rect(3, -3, 7, -2, D);
      g.maw(3, 0, 7, 2, { teeth: 2 });
    }
  }, { u: [12, 14, 0] });

  be('street-lamp-moths', 'lamp moths swarm of moths round a light make a skull face small insects cloud', 18, 18, (g, R) => {
    const W = hex('#cfc6a8'),
      B = hex('#3a342c'),
      r = rnd(R ? 9 : 4);
    const moth = (x, y) => {
      g.pts([[x - 1, y], [x + 1, y], [x - 1, y - 1], [x + 1, y - 1]], W);
      g.set(x, y, B);
    };
    if (!R) {
      for (let i = 0; i < 5; i++) moth(Math.round(8.5 + Math.cos(i * 1.257 + 0.4) * 3.2), Math.round(8 + Math.sin(i * 1.257 + 0.4) * 3.2));
      for (let i = 0; i < 9; i++) moth(Math.round(8.5 + Math.cos(i * 0.698) * (6 + r())), Math.round(8 + Math.sin(i * 0.698) * (5.5 + r())));
      g.rect(8, 7, 9, 8, LAMP);
      g.pts([[7, 7], [10, 8], [8, 6], [9, 9]], hex('#8a8250'));
    } else {
      g.oval(2, 1, 15, 11, B);
      g.rect(5, 10, 12, 14, B);
      for (let y = 2; y <= 14; y += 2) for (let x = 3; x <= 14; x += 2) if (g.get(x, y)) moth(x + (r() < 0.3 ? 1 : 0), y);
      g.rect(4, 5, 6, 7, K);
      g.rect(11, 5, 13, 7, K);
      g.pts([[5, 6], [12, 6]], RED);
      g.rect(8, 8, 9, 9, K);
      for (const x of [6, 8, 10, 12]) g.col(x, 12, 14, K);
    }
    g.shadow(5, 12, 16);
    g.c.outline(B);
    return false;
  }, { shade: false, outline: false });

  be('street-shoes-walking', 'walking shoes pair of old shoes nobody in them ankle bones soles open like mouths small', 14, 9, (g, R) => {
    const L = hex('#5a4030'),
      D = dark(L);
    const shoe = (x, y) => {
      g.rect(x, y + 2, x + 5, y + 3, L);
      g.rect(x, y, x + 2, y + 1, L);
      g.row(y + 4, x, x + 5, D);
      g.set(x + 1, y - 1, BONE);
      g.set(x, y, lite(L));
      if (!R) g.pts([[x + 3, y + 1]], C.paper);
      else {
        g.clearRect(x + 3, y + 2, x + 5, y + 3);
        g.rect(x + 3, y + 1, x + 6, y + 1, L); // the toe cap gapes
        g.rect(x + 3, y + 2, x + 5, y + 3, MOUTH);
        g.pts([[x + 4, y + 2], [x + 6, y + 2]], BONE);
        g.pts([[x + 5, y + 3], [x + 6, y + 3]], TONGUE);
        g.set(x + 2, y, EYE);
      }
    };
    shoe(1, 3);
    shoe(7, R ? 0 : 2);
    if (R) g.row(7, 7, 12, NIGHT);
  }, { u: [16, 12, 1] });

  be('street-bag-jelly', 'carrier bag jellyfish plastic bag floating on the wind small face pressed inside tentacles', 12, 18, (g, R) => {
    const B = hex('#c9cfc8'),
      D = hex('#9aa39c');
    if (!R) {
      g.limb([[3, 10], [2, 13], [3, 15]], B);
      g.limb([[8, 10], [9, 13], [8, 14]], B);
      g.col(5, 10, 12, D);
    } else {
      g.limb([[3, 10], [-1, 12], [-2, 15]], B);
      g.limb([[5, 10], [4, 13], [5, 15]], D);
      g.limb([[7, 10], [8, 14]], D);
      g.limb([[8, 10], [12, 12], [13, 15]], B);
    }
    g.oval(2, 1, 9, 9, B);
    g.rect(3, 8, 8, 10, B);
    g.line(4, 2, 3, 8, D);
    g.line(8, 3, 8, 9, D);
    g.row(1, 4, 6, lite(B));
    if (!R) g.pts([[4, 5], [7, 5]], D);
    else {
      g.rect(3, 4, 4, 5, K);
      g.rect(7, 4, 8, 5, K);
      g.oval(5, 6, 6, 8, K);
      g.pts([[2, 3], [9, 3]], D);
    }
    g.shadow(2, 9, 16);
  }, { u: [16, 18, 2] });
};
