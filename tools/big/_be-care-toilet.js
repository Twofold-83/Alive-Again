/* The washroom: 31 creatures. See be-care.js for how mk() works. */
module.exports = (kit, H, mk) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const { P, vd, at, flip, pts, both, curve, disc, tube, worm, limb, hand, fingers, spiderLegs, eye, orb, teeth, maw, face, skull, fig, vol, blob, ragged, fade, shadow, drip, tint, seam, ribs, rat, motes } = H;
  const { PALE, DEAD, SICK, BRUISE, RAW, GUM, EYE, YEL, RED, HAIR, TOOTH, MOULD, WETC, WEB, DUST } = P;
  const STEEL = C.steel,
    IRON = C.iron,
    EN = P.ENAMEL,
    SHEET = hex('#d8d6cc'),
    WOOD = C.woodLight,
    DOOR = hex('#5d7370'),
    LEAD = hex('#6f7c78'),
    INKW = hex('#1c2a30'), // black water
    INKL = hex('#2f4650'),
    HL = hex('#3d3344');
  const armL = (c, p, col, hnd, dir = 'd', w = 2, len = 2) => {
    limb(c, p, col, w);
    const e = p[p.length - 1];
    hand(c, e[0], e[1], dir, hnd, len);
  };

  /* ---------- the large ones: tall ---------- */
  mk('drain-hair-figure', 'drain hair figure wet hair rising from the plughole woman pale face arms large tall clog ghost monster', [18, 46], (c, r) => {
    const yf = 44,
      top = r ? 0 : 5;
    c.oval(3, yf - 1, 14, yf, IRON); // the drain
    c.row(yf - 1, 6, 11, K);
    c.poly([[4, 17], [14, 17], [12, 30], [10, yf - 1], [8, yf - 1], [6, 30]], HAIR);
    c.rect(5, top + 9, 13, 18, HAIR);
    c.oval(5, top + 1, 13, top + 12, HAIR);
    for (const [x, a, b] of [[3, 16, 31], [2, 19, 27], [15, 16, 33], [16, 20, 26], [5, 18, 36], [13, 18, 38]]) c.col(x, a, b, HAIR);
    for (const [x, a, b] of [[7, top + 3, 30], [10, top + 6, 37], [12, 20, 28], [5, top + 8, 24], [9, 32, 41]]) c.col(x, a, b, HL);
    pts(c, [[2, 29], [16, 28], [15, 36], [3, 34]], INKL); // it drips
    if (r) {
      c.rect(8, top + 4, 10, top + 11, PALE); // the hair parts
      c.set(9, top + 6, K);
      c.set(8, top + 6, YEL);
      c.rect(9, top + 9, 9, top + 10, K);
      armL(c, [[4, 19], [-1, 22], [-4, 16]], PALE, PALE, 'u', 1, 3);
      armL(c, [[14, 19], [19, 24], [22, 19]], dark(PALE), PALE, 'u', 1, 3);
    }
  });

  mk('cistern-lurker', 'cistern lurker high tank thing long arms hanging down chain flush wet head large tall monster', [22, 46], (c, r) => {
    const yf = 44,
      T = hex('#55625e');
    c.rect(10, 11, 11, yf - 3, LEAD); // the flush pipe
    c.col(11, 11, yf - 3, dark(LEAD));
    c.rect(8, yf - 2, 13, yf, LEAD);
    c.line(4, 11, 7, 14, IRON);
    c.line(17, 11, 14, 14, IRON);
    c.rect(4, 3, 17, 10, T);
    c.row(3, 4, 17, lite(T));
    c.col(4, 3, 10, lite(T));
    pts(c, [[6, 5], [15, 5], [6, 9], [15, 9]], dark(T));
    c.row(5, 17, 20, IRON); // lever and chain
    for (let y = 6; y <= 20; y += 2) c.set(20, y, STEEL);
    c.rect(19, 21, 21, 23, WOOD);
    if (r) {
      c.poly([[2, -7], [17, -11], [18, -10], [3, -5]], dark(T)); // the lid goes
      c.oval(6, -6, 15, 3, PALE);
      c.rect(6, 0, 15, 3, PALE);
      for (const x of [6, 8, 13, 15]) c.col(x, -6, x % 3 ? 1 : -1, HAIR);
      c.row(-6, 7, 14, HAIR);
      orb(c, 9, -2, 1.3, K, YEL);
      orb(c, 13, -2, 1.3, K, YEL);
      maw(c, 8, 1, 13, 2, {});
      armL(c, [[4, 4], [-3, 8], [-5, 21]], PALE, PALE, 'd', 1, 3);
      armL(c, [[17, 4], [23, 2], [26, -6]], dark(PALE), PALE, 'u', 1, 3);
    } else {
      c.rect(3, 0, 18, 1, dark(T)); // the lid, a little raised
      c.row(2, 4, 17, K);
      pts(c, [[8, 2], [12, 2]], YEL);
      armL(c, [[5, 2], [1, 8], [2, 22], [3, 35]], PALE, PALE, 'd', 1, 3);
      armL(c, [[16, 2], [18, 9], [17, 22], [16, 31]], dark(PALE), PALE, 'd', 1, 3);
    }
    drip(c, 10, 14, 3, INKL);
  });

  mk('stall-feet', 'stall with feet that are not feet cubicle door closed hands under the door eyes in the gap engaged large tall monster', [24, 44], (c, r) => {
    const yf = 42,
      D = DOOR;
    c.rect(3, 36, 20, yf, hex('#15131a')); // the dark under the door
    c.rect(1, 1, 22, 2, dark(D));
    c.rect(1, 2, 2, yf, dark(D));
    c.rect(21, 2, 22, yf, vd(D));
    c.rect(3, 4, 20, 35, D);
    c.col(3, 4, 35, lite(D));
    c.frame(6, 7, 17, 19, dark(D));
    c.frame(6, 23, 17, 32, dark(D));
    c.rect(17, 20, 19, 22, STEEL);
    c.set(18, 21, RED);
    for (const x of [7, 15]) {
      c.rect(x - 1, 36, x + 1, 38, PALE); // the feet are hands
      hand(c, x, 39, 'd', PALE, 3);
    }
    c.set(11, yf, RAW);
    c.set(12, yf - 1, RAW); // and something else
    if (r) {
      c.rect(3, 4, 7, 35, K); // the door comes open
      c.col(8, 4, 35, lite(D));
      for (const [x, y] of [[5, 8], [4, 14], [5, 21], [4, 28]]) eye(c, x, y, 2, K, YEL);
      for (const y of [11, 13, 15, 25, 27, 29]) c.row(y, 7, 10, y % 4 === 1 ? PALE : dark(PALE));
      armL(c, [[5, 39], [0, 40], [-4, yf]], PALE, PALE, 'l', 1, 2);
      armL(c, [[18, 39], [23, 40], [27, yf]], PALE, PALE, 'r', 1, 2);
    }
  });

  mk('shower-weeper', 'shower weeper shower head on a tall pipe weeping black water body of water many eyes large tall monster', [20, 46], (c, r) => {
    const yf = 44;
    c.col(15, 5, yf, STEEL); // the riser
    c.col(16, 5, yf, dark(STEEL));
    c.rect(13, 30, 18, 31, STEEL);
    pts(c, [[13, 29], [18, 29]], IRON);
    c.rect(13, yf - 1, 18, yf, IRON);
    worm(c, [[15, 5], [13, 2], [9, 2], [6, 4]], 1, 1, STEEL, { hi: false });
    c.poly([[2, 9], [10, 9], [13, yf], [-1, yf]], INKW); // the water it weeps, standing like a body
    for (const [x, a, b] of [[3, 10, 30], [6, 9, yf], [9, 12, 36], [1, 30, yf - 2], [11, 28, yf]]) c.col(x, a, b, INKL);
    for (const [x, y] of [[0, 40], [12, 38], [-1, yf - 3], [13, yf - 5], [2, 12], [10, 13]]) c.clear(x, y);
    if (r) {
      disc(c, 6, 4, 4.4, STEEL); // the rose turns to look
      disc(c, 6, 4, 3.2, dark(STEEL));
      for (const [x, y] of [[4, 3], [6, 2], [8, 3], [5, 5], [7, 5], [6, 7]]) c.set(x, y, YEL);
      maw(c, 3, 17, 9, 20, { long: true });
      worm(c, [[3, 14], [-3, 16], [-6, 24], [-5, 30]], 1.4, 0.7, INKW);
      worm(c, [[10, 14], [17, 18], [21, 24], [22, 31]], 1.4, 0.7, INKW);
      pts(c, [[-6, 32], [-4, 33], [21, 33], [23, 34]], INKL);
    } else {
      c.poly([[3, 5], [9, 5], [10, 8], [2, 8]], STEEL);
      c.row(8, 2, 10, dark(STEEL));
      pts(c, [[4, 16], [8, 16]], hex('#6d8d98')); // two glints where a face would be
    }
  });

  mk('mirror-twin', 'mirror twin reflection climbing out of the mirror above the basin pale double long hair arms large tall ghost monster', [22, 44], (c, r) => {
    const yf = 42,
      GL = hex('#3d5560'),
      DR = hex('#4a4458');
    c.rect(9, 31, 12, yf, EN); // the basin
    c.rect(8, yf - 1, 13, yf, dark(EN));
    c.poly([[3, 25], [18, 25], [16, 30], [5, 30]], EN);
    c.row(25, 3, 18, lite(EN));
    c.rect(6, 22, 7, 24, STEEL);
    c.rect(14, 22, 15, 24, STEEL);
    c.rect(3, 2, 18, 20, GL);
    c.frame(2, 1, 19, 21, C.woodDark);
    c.row(1, 2, 19, C.wood);
    if (r) {
      for (const p of [[[10, 8], [5, 3]], [[10, 8], [16, 4]], [[10, 8], [17, 12]], [[10, 8], [4, 12]], [[10, 8], [12, 2]]]) limb(c, p, C.glassLight, 1);
      c.rect(6, 12, 15, 21, DR); // half of her is out
      c.rect(7, 15, 14, 30, HAIR);
      for (const x of [6, 8, 13, 15]) c.col(x, 16, 31 + (x % 3), HAIR);
      face(c, 7, 17, PALE, 'jaws', YEL);
      armL(c, [[6, 16], [1, 26], [2, 36]], PALE, PALE, 'd', 2, 3);
      armL(c, [[15, 16], [20, 25], [19, 34]], dark(PALE), PALE, 'd', 2, 3);
    } else {
      c.line(5, 4, 8, 7, hex('#55707a'));
      c.rect(6, 15, 15, 20, DR);
      H.HAIRS.long(at(c, 3, 2), HAIR, 16);
      face(c, 7, 5, PALE, 'stare');
      for (const x of [4, 16]) {
        c.rect(x, 12, x + 1, 14, lite(PALE)); // her hands, flat on the glass
        pts(c, [[x, 10], [x, 11], [x + 1, 11]], lite(PALE));
      }
    }
  });

  /* ---------- the large ones: long ---------- */
  mk('pipe-serpent', 'pipe serpent snake of lead pipe plumbing joints valve head teeth black water large long monster', [48, 24], (c, r) => {
    const p = curve(r ? [[1, 8], [9, 6], [17, 15], [25, 19], [32, 13], [35, 3], [41, -3]] : [[1, 8], [9, 6], [17, 14], [25, 19], [33, 15], [40, 18]], 8);
    c.rect(0, 4, 1, 12, IRON); // where it comes out of the wall
    tube(c, p, 2.2, 2.2, LEAD);
    p.forEach(([x, y], i) => {
      if (i % 9 === 5) {
        c.rect(Math.round(x) - 1, Math.round(y) - 3, Math.round(x), Math.round(y) + 3, C.brass);
        c.set(Math.round(x) - 1, Math.round(y) - 3, lite(C.brass));
      }
    });
    const hx = Math.round(p[p.length - 1][0]),
      hy = Math.round(p[p.length - 1][1]);
    c.col(hx + 2, hy - 6, hy - 3, IRON); // the valve on its head
    c.row(hy - 6, hx, hx + 4, C.rust);
    if (r) {
      c.poly([[hx - 1, hy - 3], [hx + 7, hy - 6], [hx + 8, hy - 4], [hx + 1, hy]], LEAD);
      c.poly([[hx - 1, hy + 1], [hx + 6, hy + 3], [hx + 7, hy + 5], [hx - 1, hy + 3]], dark(LEAD));
      c.poly([[hx + 1, hy], [hx + 7, hy - 3], [hx + 6, hy + 2]], K);
      pts(c, [[hx + 3, hy - 2], [hx + 5, hy - 3], [hx + 7, hy - 3], [hx + 3, hy + 1], [hx + 5, hy + 2]], TOOTH);
      c.set(hx + 2, hy - 3, YEL);
      motes(c, hx + 8, hy - 4, hx + 13, hy + 6, 7, INKL, 4);
    } else {
      c.rect(hx, hy - 3, hx + 5, hy + 2, LEAD);
      c.row(hy - 3, hx, hx + 5, lite(LEAD));
      c.col(hx + 6, hy - 2, hy + 1, K);
      c.set(hx + 2, hy - 1, C.brass);
      c.set(hx + 6, hy + 3, INKL);
    }
  });

  mk('bath-hands', 'bath full of hands bathtub arms reaching out of black water claw feet face surfacing large long monster', [46, 26], (c, r) => {
    const yf = 24;
    for (const x of [6, 37]) {
      c.rect(x, 20, x + 2, yf, C.brass);
      pts(c, [[x - 1, yf], [x + 3, yf]], C.brass);
    }
    c.oval(2, 6, 43, 22, EN);
    c.clearRect(0, 0, 45, 9);
    c.rect(1, 9, 44, 10, EN);
    c.row(9, 1, 44, lite(EN));
    c.row(21, 10, 35, dark(EN));
    c.rect(3, 4, 4, 8, STEEL);
    c.row(4, 3, 7, STEEL);
    c.set(7, 5, STEEL);
    const xs = [8, 13, 19, 25, 31, 37];
    if (r) {
      face(c, 19, 0, DEAD, 'scream');
      c.rect(18, -1, 27, 1, HAIR);
      c.col(18, 1, 8, HAIR);
      c.col(27, 1, 8, HAIR);
      [[8, 9, -2], [12, 14, 1], [16, 7, -1], [30, 12, 2], [34, 16, -1], [38, 8, 2], [41, 5, 1]].forEach(([x, h, l], i) => armL(c, [[x, 9], [x + l, 9 - h / 2], [x + l * 2, 9 - h]], i % 2 ? dark(PALE) : PALE, PALE, 'u', 2, 2));
      for (const x of [11, 24, 33]) drip(c, x, 11, 4 + (x % 3), INKL);
    } else {
      xs.forEach((x, i) => {
        c.rect(x, 7, x + 3, 9, i % 2 ? dark(PALE) : PALE);
        fingers(c, x, x + 3, 10, 3, PALE, 1);
      });
      limb(c, [[22, 9], [23, 3]], PALE, 2);
      hand(c, 23, 2, 'u', PALE, 2);
    }
    vol(c, 1, 9, 44, 22, 1.1, 0.8);
  });

  mk('fatberg', 'fatberg sewer fat mass bloated grease wipes hair eyes mouth strings rising from the manhole large long monster', [44, 28], (c, r) => {
    const yf = 26,
      F = hex('#b5ab86'),
      FD = dark(F);
    blob(c, 22, 16, 18, 10, F, 7, 0.1);
    c.oval(7, 6, 19, 16, F);
    c.oval(23, 3, 35, 14, F);
    c.clearRect(-2, yf + 1, 46, yf + 6);
    c.oval(5, yf - 1, 38, yf + 1, IRON);
    c.clearRect(-2, yf + 1, 46, yf + 6);
    c.row(yf, 8, 35, K);
    if (r) {
      worm(c, [[6, 14], [0, 10], [-3, 2]], 2.4, 1, F);
      worm(c, [[38, 13], [44, 8], [46, 0]], 2.4, 1, F);
    }
    vol(c, -6, 0, 50, yf - 1, 1.12, 0.8);
    for (const [x, y] of [[9, 10], [16, 20], [30, 6], [33, 18], [24, 22], [12, 15]]) c.rect(x, y, x + 1, y, SHEET); // wipes
    for (const [x, y] of [[20, 6], [36, 12], [6, 19]]) c.line(x, y, x + 2, y + 2, HAIR);
    pts(c, [[14, 8], [27, 16], [19, 12], [35, 21], [10, 22]], FD);
    if (r) {
      c.oval(10, 14, 34, 23, K);
      c.oval(14, 19, 30, 22, GUM);
      for (let x = 12; x <= 32; x += 3) c.col(x, 15 + (x % 2), 22 - (x % 2), x % 2 ? F : FD); // strings of fat
      orb(c, 14, 10, 1.6, K, YEL);
      orb(c, 29, 8, 2, K, YEL);
      orb(c, 22, 6, 1.2, K, YEL);
    } else {
      c.row(11, 13, 16, K);
      c.row(9, 27, 31, K);
      c.row(7, 21, 23, K);
      c.row(18, 14, 30, FD);
      for (const x of [17, 22, 27]) drip(c, x, 19, 2 + (x % 2), FD);
    }
  });

  mk('wet-floor-thing', 'wet floor thing puddle with a face water figure rising yellow sign caution large long spill monster', [40, 12], (c, r) => {
    const yf = 10,
      W = WETC;
    c.oval(1, yf - 3, 38, yf, W);
    c.row(yf - 3, 9, 24, lite(W));
    c.row(yf, 6, 33, dark(W));
    if (r) {
      c.poly([[27, yf - 3], [38, yf - 4], [39, yf - 2], [28, yf - 1]], C.mustard); // the sign, knocked flat
      tube(c, curve([[14, yf - 2], [13, -6], [15, -13], [14, -18]], 8), 4.2, 3, W);
      worm(c, [[11, -11], [5, -8], [2, -1], [3, 4]], 1.6, 0.8, W);
      worm(c, [[18, -11], [24, -9], [27, -3], [26, 3]], 1.6, 0.8, dark(W));
      c.oval(9, -25, 19, -15, W);
      c.rect(11, -22, 12, -20, K);
      c.rect(16, -22, 17, -20, K);
      c.rect(12, -18, 16, -17, K);
      for (const [x, y] of [[3, 6], [26, 5], [9, -3], [19, -4]]) drip(c, x, y, 2, lite(W));
      vol(c, 8, -26, 20, -14);
    } else {
      c.poly([[31, 0], [33, 0], [36, yf - 2], [28, yf - 2]], C.mustard);
      c.col(31, 1, yf - 2, lite(C.mustard));
      c.rect(31, 3, 33, 4, K);
      c.set(32, 6, K);
      c.rect(10, yf - 2, 11, yf - 2, K); // the face in the water
      c.rect(16, yf - 2, 17, yf - 2, K);
      c.row(yf - 1, 12, 15, K);
    }
  });

  /* ---------- person-sized ---------- */
  mk('bowl-thing', 'the thing in the bowl toilet lid eyes fingers long neck sucker mouth rising from the pan monster', [18, 26], (c, r) => {
    const yf = 24;
    c.rect(3, 1, 14, 8, EN); // cistern
    c.row(1, 3, 14, lite(EN));
    c.row(8, 3, 14, dark(EN));
    c.row(3, 12, 15, STEEL);
    c.rect(8, 9, 9, 12, EN);
    c.poly([[2, 14], [15, 14], [13, 21], [4, 21]], EN);
    c.rect(6, 21, 11, yf, EN);
    c.row(yf, 5, 12, dark(EN));
    c.col(2, 14, 15, lite(EN));
    if (r) {
      c.rect(3, 3, 14, 12, EN); // lid up
      c.frame(4, 4, 13, 11, dark(EN));
      c.row(13, 2, 15, dark(EN));
      c.row(13, 4, 13, K);
      worm(c, [[8, 13], [11, 6], [6, 0], [9, -6]], 1.9, 1.6, SICK);
      disc(c, 9, -8, 3.3, SICK);
      disc(c, 9, -8, 2, K);
      pts(c, [[8, -10], [10, -10], [7, -8], [11, -8], [8, -6], [10, -6]], TOOTH);
      fingers(c, 2, 4, 13, 3, SICK, 1);
      fingers(c, 13, 15, 13, 3, SICK, 1);
      pts(c, [[1, 10], [16, 9], [17, 12]], INKL);
    } else {
      c.rect(2, 11, 15, 12, EN);
      c.row(11, 2, 15, lite(EN));
      c.row(13, 3, 14, K);
      pts(c, [[6, 13], [10, 13]], YEL);
      fingers(c, 11, 14, 14, 2, SICK, 1);
    }
  });

  mk('towel-ghost', 'towel ghost roller towel dispenser cloth spectre hollow face striped hanging floating', [16, 34], (c, r) => {
    const T = SHEET,
      ST = hex('#6f8aa0');
    if (r) {
      c.poly([[5, 7], [10, 7], [14, 13], [20, 10], [21, 15], [14, 22], [13, 30], [2, 30], [1, 22], [-6, 15], [-5, 10], [1, 13]], T);
      ragged(c, 2, 13, 30, 3, 5);
      c.line(6, 7, 4, 30, ST);
      c.line(9, 7, 11, 30, ST);
      c.rect(5, 12, 6, 14, K);
      c.rect(9, 12, 10, 14, K);
      c.rect(6, 17, 9, 21, K);
      vol(c, -6, 7, 21, 30);
    } else {
      c.rect(5, 7, 10, 26, T);
      c.row(27, 6, 9, T);
      c.col(6, 7, 27, ST);
      c.col(9, 7, 27, ST);
      c.col(5, 7, 26, lite(T));
      c.rect(6, 13, 6, 14, dark(T)); // stains where eyes would be
      c.rect(9, 13, 9, 14, dark(T));
      c.row(18, 7, 8, dark(T));
    }
    c.rect(3, 1, 12, 6, EN);
    c.row(1, 3, 12, lite(EN));
    c.row(6, 3, 12, dark(EN));
    c.row(5, 5, 10, K);
    shadow(c, 4, 11, 32);
  });

  mk('mould-bloom', 'mould bloom with a face black mold rosette spores fungus damp eyes mouth growing monster', [20, 22], (c, r) => {
    const yf = 20,
      M2 = hex('#262c26'),
      M3 = hex('#6a7a52'),
      SP = hex('#cfd4a8');
    blob(c, 10, 12, 9, 8, M2, 5, 0.2);
    c.rect(3, 16, 17, yf, M2);
    c.clearRect(-3, yf + 1, 23, yf + 5);
    blob(c, 10, 12, 6.5, 5.5, MOULD, 6, 0.15);
    for (const [x, y] of [[0, 5], [20, 8], [17, 2], [2, 17]]) disc(c, x, y, 1, M2);
    c.speckle(1, 4, 19, yf, M3, 7, 3);
    for (const [x, h] of [[5, 3], [9, 4], [14, 3], [17, 2]]) {
      c.col(x, 4 - h - (r ? 2 : 0), 5, M3); // fruiting stalks
      c.set(x, 4 - h - (r ? 2 : 0), SP);
    }
    if (r) {
      orb(c, 7, 10, 1.3, K, SP);
      orb(c, 13, 10, 1.3, K, SP);
      maw(c, 6, 14, 14, 17, { round: true, teeth: SP });
      motes(c, 2, -8, 18, -1, 9, SP, 3);
    } else {
      c.row(10, 6, 8, M2);
      c.row(10, 12, 14, M2);
      c.row(15, 8, 12, M2);
    }
  });

  mk('attendant-forever', 'the attendant who never leaves washroom attendant old man saucer of coins cobwebs dust towel coin eyes monster', [16, 34], (c, r) => {
    const J = hex('#c2beae');
    fig(c, 0, 1, {
      top: J, legs: C.black, skin: DEAD, hair: 'thin', hairCol: C.ash, face: r ? 'none' : 'calm', arms: { l: 'hold', r: r ? 'out' : 'down' },
      body(g, yT) {
        g.rect(7, yT + 1, 8, yT + 1, K);
        pts(g, [[8, yT + 4], [8, yT + 7]], dark(J));
      },
    });
    c.row(16, 5, 9, EN); // the saucer
    pts(c, [[6, 15], [8, 15]], C.brass);
    c.line(11, 14, 15, 22, WEB); // he has been here a long time
    c.line(12, 18, 15, 16, WEB);
    c.line(4, 30, 1, 33, WEB);
    pts(c, [[4, 13], [6, 12], [10, 12], [5, 3], [9, 3]], DUST);
    if (r) {
      pts(c, [[5, 7], [6, 7], [9, 7], [10, 7]], C.brass);
      pts(c, [[5, 6], [9, 6]], C.gold);
      c.rect(6, 9, 9, 15, K); // the jaw drops
      teeth(c, 6, 9, 9, TOOTH, 1);
      teeth(c, 6, 9, 15, TOOTH, 2);
      c.rect(17, 16, 20, 24, SHEET);
      c.col(18, 17, 24, dark(SHEET));
    } else c.rect(12, 17, 14, 23, SHEET);
  });

  mk('cistern-crab', 'cistern crab toilet tank shell legs claws eye stalks scuttling porcelain monster', [20, 14], (c, r) => {
    const yf = 12,
      by = r ? -2 : 3,
      LG = hex('#a8766a');
    for (const x of [4, 7, 12, 15]) limb(c, [[x, by + 8], [x + (x < 9 ? -3 : 3), by + (r ? 7 : 8)], [x + (x < 9 ? -4 : 4), yf]], LG, 1);
    if (r) {
      c.rect(4, by + 8, 15, by + 10, dark(LG));
      pts(c, [[7, by + 9], [12, by + 9]], YEL);
      limb(c, [[3, by + 8], [-2, by + 4], [-1, by]], LG, 2);
      limb(c, [[16, by + 8], [21, by + 4], [20, by]], LG, 2);
      pts(c, [[-2, by - 1], [0, by - 1], [19, by - 1], [21, by - 1]], LG);
    }
    c.rect(2, by + 1, 17, by + 8, EN);
    c.row(by + 1, 2, 17, lite(EN));
    c.row(by + 3, 2, 17, dark(EN));
    c.row(by + 8, 2, 17, dark(EN));
    c.rect(4, by + 5, 6, by + 5, STEEL);
    if (!r) pts(c, [[9, by + 3], [12, by + 3]], YEL);
  });

  mk('tile-face', 'a face in the tiles wall tiles bulging face cracked tiles mouth of shards eyes grout monster', [22, 26], (c, r) => {
    const T = hex('#c9cdc4'),
      G = hex('#8d948c'),
      map = r ? ['.LLL.', 'LXLXL', 'LLHLL', 'LMMML', 'LMMML', '.L.LL'] : ['.LLL.', 'LDLDL', 'LLHLL', 'LDDDL', 'LLLLL', '.L.LL'];
    map.forEach((row, j) =>
      [...row].forEach((ch, i) => {
        if (ch === '.') return;
        const x = 1 + i * 4,
          y = 1 + j * 4,
          col = ch === 'D' ? mix(T, 0.82) : ch === 'H' ? lite(T) : ch === 'X' || ch === 'M' ? K : T;
        c.rect(x, y, x + 3, y + 3, G);
        c.rect(x, y, x + 2, y + 2, col);
        if (col !== K) c.set(x, y, lite(col));
        if (ch === 'X') c.set(x + 1, y + 1, YEL);
      }),
    );
    if (r) {
      for (let x = 5; x <= 15; x += 2) {
        c.col(x, 13, 14 + (x % 4 === 1 ? 1 : 0), T); // teeth of broken tile
        c.col(x + 1, 19 - (x % 4 === 1 ? 1 : 0), 20, T);
      }
      limb(c, [[2, 6], [4, 9], [3, 12]], K, 1);
      limb(c, [[19, 3], [17, 7], [19, 11]], K, 1);
      pts(c, [[0, 24], [3, 24], [20, 24], [22, 23]], T);
      pts(c, [[1, 24], [21, 24]], G);
    }
  });

  mk('urinal-maw', 'urinal maw wall urinal mouth teeth tongue porcelain throat eyes monster', [14, 26], (c, r) => {
    const yf = 24;
    c.rect(6, 0, 7, 3, STEEL);
    c.rect(6, 21, 7, yf, STEEL);
    c.row(yf, 4, 9, IRON);
    c.oval(1, 2, 12, 13, EN);
    c.rect(1, 8, 12, 18, EN);
    c.oval(0, 14, 13, 22, EN);
    c.col(1, 6, 18, lite(EN));
    c.oval(3, 4, 10, 12, r ? K : dark(EN));
    c.rect(3, 8, 10, 18, r ? K : dark(EN));
    if (r) {
      teeth(c, 4, 9, 5, TOOTH, 2);
      teeth(c, 3, 10, 18, TOOTH, 2);
      for (const y of [7, 10, 13, 16]) pts(c, [[3, y], [10, y + 1]], TOOTH);
      pts(c, [[5, 8], [8, 8]], YEL);
      worm(c, [[6, 14], [7, 20], [10, 23], [15, yf]], 1.6, 1, RAW);
    } else {
      c.dither(6, 9, 7, 17, hex('#b7b06a'));
      pts(c, [[6, 18], [7, 18]], K);
      teeth(c, 4, 9, 19, TOOTH, 2);
      pts(c, [[5, 6], [8, 6]], lite(EN));
    }
  });

  mk('plumber-pipes', 'plumber whose arms are pipes overalls tap wrench black water pouring from the mouth pipe man monster', [18, 34], (c, r) => {
    fig(c, 1, 1, {
      top: C.navy, legs: C.navy, skin: DEAD, hair: 'cap', hairCol: C.earth, face: r ? 'scream' : 'hollow', arms: 'none',
      body(g, yT) {
        g.rect(6, yT + 2, 9, yT + 6, lite(C.navy));
        pts(g, [[5, yT], [10, yT]], C.brass);
      },
    });
    const pipe = (p) => {
      limb(c, p, LEAD, 2);
      c.rect(p[1][0] - 1, p[1][1] - 1, p[1][0] + 1, p[1][1] + 1, C.brass);
    };
    if (r) {
      pipe([[4, 14], [0, 10], [-1, 3]]);
      pts(c, [[-2, 2], [-2, 1], [-2, 0], [1, 2], [1, 1], [1, 0], [-1, 2], [0, 2]], STEEL); // wrench jaw
      pipe([[13, 14], [17, 17], [21, 15]]);
      c.rect(21, 13, 23, 16, C.brass);
      drip(c, 23, 17, 6, INKW);
      c.rect(8, 10, 9, 31, INKW); // it pours out of him
      c.col(8, 14, 30, INKL);
      c.row(32, 5, 12, INKW);
      pts(c, [[4, 32], [13, 31], [6, 30]], INKL);
    } else {
      pipe([[4, 14], [2, 19], [2, 25]]);
      c.rect(1, 26, 3, 27, C.brass);
      c.set(2, 29, INKL);
      pipe([[13, 14], [15, 19], [15, 25]]);
      pts(c, [[14, 26], [14, 27], [16, 26], [16, 27], [15, 26]], STEEL);
      c.rect(8, 7, 9, 8, C.brass); // a tap for a nose
      c.set(9, 10, INKL);
    }
  });

  mk('mop-hag', 'mop hag mop in a bucket hair of grey strings face under the mop thin arms cleaner witch monster', [18, 32], (c, r) => {
    const yf = 30,
      G = hex('#9a968a'),
      BK = hex('#7d858a'),
      top = r ? -3 : 3,
      rr = rnd(4);
    c.col(9, top + 4, 23, WOOD);
    c.poly([[4, 23], [14, 23], [13, yf], [5, yf]], BK);
    c.row(23, 4, 14, lite(BK));
    c.row(26, 4, 14, dark(BK));
    c.row(24, 5, 13, INKW);
    if (r) {
      c.rect(7, top + 4, 11, top + 11, PALE);
      pts(c, [[8, top + 6], [10, top + 6]], YEL);
      c.rect(8, top + 9, 10, top + 10, K);
      teeth(c, 8, 10, top + 9, TOOTH, 2);
      armL(c, [[5, top + 11], [0, top + 15], [-3, top + 9]], PALE, PALE, 'u', 1, 2);
      armL(c, [[13, top + 11], [18, top + 16], [20, top + 23]], dark(PALE), PALE, 'd', 1, 2);
      pts(c, [[3, 22], [15, 22], [2, 25], [16, 27]], INKL);
    }
    c.oval(4, top, 14, top + 6, G);
    for (let x = 3; x <= 15; x++) {
      if (r && x >= 7 && x <= 11) continue;
      c.col(x, top + 3, top + 11 + Math.floor(rr() * 5), x % 2 ? G : dark(G));
    }
    c.row(top, 6, 12, lite(G));
    if (!r) pts(c, [[7, top + 7], [11, top + 7]], K);
  });

  mk('graffiti-man', 'graffiti man scrawled figure drawn on the wall come loose marker scribble flat black teeth monster', [18, 30], (c, r) => {
    const INK = hex('#221f28'),
      WH = hex('#d8d6cc'),
      yf = 28;
    const zig = [[6, 11], [12, 12], [6, 14], [12, 16], [6, 18], [12, 20], [7, 21]];
    limb(c, zig, INK, 2);
    limb(c, [[7, 10], [11, 10], [11, 21], [7, 21], [7, 10]], INK, 1);
    limb(c, [[8, 21], [6, 25], [5, yf]], INK, 2);
    limb(c, [[11, 21], [12, 25], [14, yf]], INK, 2);
    c.row(yf, 3, 6, INK);
    c.row(yf, 14, 17, INK);
    disc(c, 9, 5, r ? 4.6 : 4, INK);
    if (r) {
      limb(c, [[7, 12], [1, 9], [-3, 3]], INK, 2);
      limb(c, [[12, 12], [17, 14], [22, 9]], INK, 2);
      for (const [x, y] of [[-3, 3], [22, 9]]) for (const d of [-2, 0, 2]) c.line(x, y, x + d, y - 3, INK);
      pts(c, [[6, 3], [7, 3], [11, 3], [12, 3]], WH);
      for (let x = 5; x <= 13; x++) c.set(x, 6 + (x % 2), WH); // a zigzag of teeth
      for (const [x, y, n] of [[0, 11, 4], [17, 16, 5], [9, 23, 3]]) drip(c, x, y, n, INK);
    } else {
      limb(c, [[7, 12], [3, 15], [2, 20]], INK, 2);
      limb(c, [[12, 12], [15, 16], [16, 21]], INK, 2);
      pts(c, [[7, 4], [8, 5], [8, 3], [10, 4], [11, 5], [11, 3]], WH); // crossed-out eyes
      c.row(7, 8, 10, WH);
    }
    c.line(13, 2, 16, 0, hex('#7a3030')); // someone tried to cross it out
    return false;
  });

  mk('bleach-wraith', 'bleach wraith chlorine fumes rising from a bottle pale green skull vapour ghost floating poison', [16, 34], (c, r) => {
    const yf = 32,
      F = hex('#c3cc92'),
      B = hex('#8fa6b4');
    c.rect(6, yf - 6, 10, yf, B); // the bottle
    c.rect(7, yf - 8, 8, yf - 7, B);
    c.col(6, yf - 6, yf, lite(B));
    c.rect(6, yf - 4, 10, yf - 2, SHEET);
    c.set(8, yf - 3, K);
    worm(c, [[8, yf - 10], [6, yf - 15], [9, yf - 19], [8, yf - 23]], 1, r ? 4 : 3, F, { hi: false });
    c.oval(r ? 3 : 4, yf - 32, r ? 13 : 12, yf - 21, F);
    if (r) {
      worm(c, [[5, yf - 20], [0, yf - 22], [-4, yf - 17], [-3, yf - 13]], 1.5, 0.6, F, { hi: false });
      worm(c, [[11, yf - 20], [16, yf - 23], [20, yf - 19], [19, yf - 14]], 1.5, 0.6, F, { hi: false });
      c.rect(5, yf - 29, 6, yf - 27, K);
      c.rect(10, yf - 29, 11, yf - 27, K);
      c.rect(6, yf - 25, 10, yf - 22, K);
      teeth(c, 6, 10, yf - 25, F, 2);
    } else {
      c.rect(6, yf - 28, 7, yf - 27, dark(F));
      c.rect(9, yf - 28, 10, yf - 27, dark(F));
      c.row(yf - 24, 7, 9, dark(F));
    }
    vol(c, -5, yf - 33, 21, yf - 9, 1.12, 0.82);
  });

  mk('cubicle-climber', 'cubicle climber peering over the partition fingers head eyes long neck hanging arms stall watcher monster', [24, 34], (c, r) => {
    const yf = 32,
      D = DOOR;
    c.rect(3, 29, 4, yf, STEEL);
    c.rect(19, 29, 20, yf, STEEL);
    if (r) {
      c.rect(6, 5, 17, 11, hex('#4a4458')); // shoulders over the top
      c.rect(10, 8, 13, 17, PALE);
    }
    c.rect(2, 12, 21, 28, D);
    c.row(12, 2, 21, lite(D));
    c.col(2, 12, 28, lite(D));
    pts(c, [[6, 20], [7, 21], [8, 20], [15, 24], [16, 23]], dark(D));
    if (r) {
      c.rect(10, 12, 13, 17, PALE); // the neck comes down the panel
      c.col(13, 12, 17, dark(PALE));
      face(c, 8, 17, PALE, 'jaws', YEL);
      c.rect(8, 16, 15, 17, HAIR);
      for (const x of [7, 16]) c.col(x, 17, 27 + (x % 3), HAIR);
      armL(c, [[6, 8], [1, 18], [2, 28]], PALE, PALE, 'd', 2, 3);
      armL(c, [[17, 8], [22, 17], [21, 26]], dark(PALE), PALE, 'd', 2, 3);
    } else {
      c.rect(8, 8, 15, 11, PALE);
      c.row(7, 9, 14, PALE);
      c.rect(8, 6, 15, 7, HAIR);
      c.row(5, 9, 14, HAIR);
      eye(c, 9, 10, 2);
      eye(c, 13, 10, 2);
      fingers(c, 3, 7, 12, 3, PALE, 1);
      fingers(c, 16, 20, 12, 3, PALE, 1);
    }
  });

  mk('bathmat-skin', 'bath mat skin flat thing on the floor flayed rug with a face rearing up empty eyes monster', [26, 12], (c, r) => {
    const S = hex('#b89a84'),
      yf = 10;
    if (r) {
      c.poly([[1, yf], [12, yf], [14, 2], [8, -2], [3, 2]], S); // the front half rears
      c.rect(11, yf - 2, 24, yf, S);
      c.rect(-3, -1, 4, 1, S);
      c.rect(12, -3, 19, -1, S);
      hand(c, -4, 0, 'l', S, 2);
      hand(c, 20, -2, 'r', S, 2);
      c.oval(4, -9, 12, 0, S);
      c.rect(6, -6, 7, -5, K);
      c.rect(10, -6, 11, -5, K);
      pts(c, [[6, -5], [10, -5]], YEL);
      c.rect(7, -3, 10, -2, K);
      vol(c, -6, -9, 25, yf, 1.12, 0.8);
    } else {
      c.poly([[4, 4], [20, 4], [22, yf], [2, yf]], S);
      c.rect(0, 3, 5, 4, S);
      c.rect(-1, yf - 1, 4, yf, S);
      c.rect(18, 2, 24, 3, S);
      c.rect(21, yf - 1, 26, yf, S);
      c.oval(8, 0, 15, 5, S);
      pts(c, [[10, 2], [13, 2]], K);
      c.row(4, 11, 12, K);
      vol(c, -2, 0, 27, yf, 1.12, 0.8);
      c.speckle(3, 5, 21, yf - 1, dark(S), 6, 2);
    }
  });

  /* ---------- vermin and small things ---------- */
  mk('soap-scum-blob', 'soap scum blob grey slime bubbles hair bar of soap inside eyes small thing', [16, 12], (c, r) => {
    const S = hex('#b9bdb0'),
      yf = 10;
    if (r) blob(c, 8, 4, 6, 7, S, 3, 0.12);
    else blob(c, 8, 7, 7, 3.4, S, 3, 0.1);
    c.clearRect(-2, yf + 1, 18, yf + 4);
    vol(c, 0, -5, 17, yf, 1.1, 0.82);
    c.rect(5, 7, 8, 8, hex('#c9b98a')); // the soap it grew on
    c.line(10, 6, 13, 8, HAIR);
    c.set(13, 9, HAIR);
    pts(c, [[3, 7], [11, 4], [6, 5]], lite(S));
    if (r) {
      orb(c, 5, 0, 1.3, K, EYE);
      orb(c, 11, 1, 1, K, EYE);
      maw(c, 5, 4, 11, 5, {});
      pts(c, [[2, -5], [13, -4], [15, -1]], lite(S));
    } else c.set(11, 6, K);
  });

  mk('hairball-spider', 'hairball spider clump of wet hair from the plughole legs of hair eyes plug chain small vermin', [16, 10], (c, r) => {
    const yf = 8,
      up = r ? 4 : 0;
    for (let i = 0; i < 4; i++) for (const s of [-1, 1]) limb(c, [[8 + s * 2, 5 - up], [8 + s * (4 + i), 2 - up + i], [8 + s * (5 + i * 1.3), yf]], HAIR, 1);
    blob(c, 8, 5 - up, 3.6, 2.6, HAIR, 2, 0.25);
    pts(c, [[6, 4 - up], [9, 3 - up]], HL);
    pts(c, [[1, yf], [-1, yf], [-3, yf]], STEEL); // the chain it came up
    if (r) pts(c, [[6, 4 - up], [8, 4 - up], [10, 4 - up], [7, 6 - up], [9, 6 - up]], YEL);
    else c.set(10, 5, YEL);
  });

  mk('silverfish-giant', 'giant silverfish insect silver scales bristle tail feelers mandibles bathroom small vermin', [18, 8], (c, r) => {
    const S = hex('#9aa0a8'),
      yf = 6,
      p = curve(r ? [[3, yf - 1], [8, yf - 1], [12, yf - 3], [14, yf - 8]] : [[3, yf - 1], [8, yf - 2], [15, yf - 1]], 8),
      [hx, hy] = p[p.length - 1];
    for (const [x, y] of [[-1, yf - 3], [-2, yf - 1], [-1, yf]]) c.line(3, yf - 1, x, y, dark(S));
    tube(c, p, 0.7, 1.9, S);
    p.forEach(([x, y], i) => i % 5 === 2 && c.set(x, y, dark(S)));
    for (const x of [6, 9, 12]) c.set(x, yf, dark(S));
    c.line(hx + 1, hy - 1, hx + 4, hy - 4, dark(S));
    c.line(hx + 1, hy, hx + 5, hy - 1, dark(S));
    c.set(Math.round(hx), Math.round(hy) - 1, r ? RED : K);
    if (r) pts(c, [[hx + 2, hy + 1], [hx + 2, hy + 3], [hx, hy + 2]], TOOTH);
  });

  mk('drain-worms', 'drain worms pale worms rising from the floor drain grate mouths small vermin', [14, 12], (c, r) => {
    const yf = 10,
      W = hex('#cdbfa8');
    c.oval(1, yf - 3, 12, yf, IRON);
    c.oval(3, yf - 2, 10, yf - 1, K);
    const ws = r ? [[4, 8, -2], [6, 11, 1], [8, 7, 2], [10, 9, -1], [5, 5, -3]] : [[4, 3, -1], [7, 5, 1], [10, 2, 1]];
    ws.forEach(([x, h, l], i) => {
      worm(c, [[x, yf - 2], [x + l, yf - 2 - h / 2], [x - l * 0.5, yf - 2 - h]], 0.8, 0.8, i % 2 ? W : hex('#b99a8c'), { hi: false });
      if (r) c.set(x - l * 0.5, yf - 2 - h, K);
    });
    pts(c, [[2, yf - 1], [11, yf - 1]], STEEL);
  });

  mk('roach-cluster', 'cockroach cluster roaches swarm piling up into a little figure insects small vermin', [18, 12], (c, r) => {
    const BR = hex('#5a3626');
    const roach = (x, y) => {
      c.rect(x, y, x + 2, y + 1, BR);
      c.set(x, y, lite(BR));
      pts(c, [[x - 1, y + 2], [x + 1, y + 2], [x + 3, y + 2], [x + 3, y - 1], [x + 4, y - 1]], K);
    };
    const yf = 9;
    (r ? [[4, yf], [10, yf], [5, yf - 3], [9, yf - 3], [7, yf - 6], [3, yf - 7], [11, yf - 8], [7, yf - 9], [7, yf - 12]] : [[0, yf], [6, yf], [12, yf], [3, yf - 4], [9, yf - 5], [14, yf - 3], [6, yf - 8]]).forEach(([x, y]) => roach(x, y));
    if (r) pts(c, [[7, yf - 12], [9, yf - 12]], YEL);
  });

  mk('plunger-hopper', 'plunger hopper rubber plunger hopping sucker mouth teeth eye on the handle small thing', [10, 16], (c, r) => {
    const R = hex('#7a3a30'),
      yf = 14;
    if (r) {
      limb(c, [[1, -2], [5, 8]], WOOD, 2);
      disc(c, 6, 10, 4.2, R);
      disc(c, 6, 10, 2.7, K);
      pts(c, [[6, 7], [4, 8], [8, 8], [3, 10], [9, 10], [4, 12], [8, 12], [6, 13]], TOOTH);
      c.set(6, 10, GUM);
      orb(c, 1, -3, 1.2, K, EYE);
    } else {
      c.rect(4, 0, 5, yf - 5, WOOD);
      c.col(5, 0, yf - 5, dark(WOOD));
      c.poly([[2, yf - 4], [7, yf - 4], [8, yf], [1, yf]], R);
      c.row(yf, 0, 9, R);
      c.row(yf - 4, 2, 7, lite(R));
      c.row(yf - 1, 3, 6, K);
    }
  });

  mk('sponge-eyes', 'sponge with eyes bath sponge holes full of eyes tiny legs small thing', [10, 8], (c, r) => {
    const S = hex('#b9a45a'),
      y = r ? -2 : 1;
    if (r) for (const x of [2, 4, 6, 8]) c.col(x, y + 5, 6, dark(S));
    c.rect(1, y, 8, y + 5, S);
    c.clear(1, y);
    c.clear(8, y);
    c.row(y, 2, 7, lite(S));
    c.row(y + 5, 1, 8, dark(S));
    const holes = [[2, y + 1], [5, y + 1], [7, y + 2], [3, y + 3], [6, y + 4]];
    pts(c, holes, vd(S));
    if (r) {
      pts(c, holes, EYE);
      c.row(y + 4, 2, 4, K);
    } else c.set(5, y + 1, EYE);
  });

  mk('rat-sewer', 'sewer rat wet blind rat human hands split jaw rearing up from the pan small vermin', [16, 10], (c, r) => {
    const F = hex('#4a454c'),
      yf = 8;
    if (r) {
      worm(c, [[4, yf], [0, yf - 1], [-3, yf - 4]], 0.7, 0.6, RAW, { hi: false });
      c.oval(3, yf - 8, 9, yf, F); // on its hind legs
      c.rect(7, yf - 12, 11, yf - 8, F);
      c.poly([[9, yf - 11], [14, yf - 13], [14, yf - 12], [10, yf - 10]], F);
      c.poly([[9, yf - 9], [13, yf - 8], [13, yf - 7], [9, yf - 8]], F);
      c.rect(10, yf - 10, 12, yf - 9, K);
      pts(c, [[11, yf - 11], [13, yf - 12], [12, yf - 8]], TOOTH);
      c.set(8, yf - 11, EYE);
      c.set(7, yf - 13, RAW);
      limb(c, [[8, yf - 6], [11, yf - 5]], F, 1);
      hand(c, 12, yf - 5, 'r', PALE, 1);
      c.row(yf, 4, 10, PALE);
    } else {
      rat(c, 4, yf, false, F, EYE);
      pts(c, [[5, yf], [9, yf], [4, yf], [10, yf]], PALE); // hands, not paws
      pts(c, [[6, yf - 3], [8, yf - 2]], lite(F));
    }
  });

  mk('teeth-glass', 'false teeth in a glass dentures climbing out biting tumbler water gums small thing', [10, 12], (c, r) => {
    const yf = 10;
    if (r) {
      c.poly([[0, yf - 4], [6, yf - 5], [6, yf], [0, yf - 1]], C.glassLight); // the glass, tipped over
      c.row(yf, 5, 12, hex('#5d7f8c'));
      c.rect(8, yf - 9, 14, yf - 8, RAW);
      teeth(c, 8, 14, yf - 7, TOOTH, 1);
      c.rect(8, yf - 6, 14, yf - 4, K);
      teeth(c, 8, 14, yf - 3, TOOTH, 1);
      c.rect(8, yf - 2, 14, yf - 1, RAW);
      pts(c, [[9, yf], [13, yf]], GUM);
      c.col(7, yf - 8, yf - 2, GUM);
    } else {
      c.rect(2, 2, 8, yf, C.glassLight);
      c.rect(3, 4, 7, yf - 1, C.glass);
      c.col(2, 2, yf, lite(C.glassLight));
      c.row(6, 3, 7, RAW);
      teeth(c, 3, 7, 7, TOOTH, 1);
      c.row(8, 3, 7, RAW);
    }
  });
};
