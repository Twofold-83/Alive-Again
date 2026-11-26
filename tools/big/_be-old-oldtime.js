/* Town and frontier of the 1800s: the gallows hill, the mine, the dry road, the telegraph line. */
module.exports = (kit, T) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const { P, maker, sub, curve, vd, each } = T;
  const out = {};
  const mk = maker(out, 'be-oldtime', 'Old time creatures', 'oldtime-');
  const ROPE = hex('#a8904e'),
    DUST = P.DUST,
    HIDE = hex('#5e4230'),
    LEATH = hex('#6e4a30'),
    FROCK = hex('#22202a'),
    SACK = hex('#9a865c'),
    CACT = hex('#5a7048'),
    IRON = C.ironDark;

  /* 1 */
  mk(
    'hanged-man-walking',
    'hanged man who walks stretched neck noose rope gallows dead outlaw',
    20,
    48,
    (g, r) => {
      const SK = hex('#a9a694'),
        b = g.at(2, 12);
      b.man({ head: false, top: hex('#8a8068'), legs: hex('#4a3c30'), shoe: false, hand: SK, arms: r ? 'reach' : 'long', tl: 10, ll: 12, belt: C.woodDark });
      b.rect(4, 32, 6, 33, SK);
      b.rect(9, 32, 11, 33, SK); // bare feet
      const head = (x, y) => {
        g.face(x, y, SK);
        g.row(y, x + 1, x + 6, hex('#3a3028'));
        g.pts([[x, y + 1], [x + 7, y + 1]], hex('#3a3028'));
        if (!r) {
          g.pts([[x + 1, y + 3], [x + 2, y + 3], [x + 5, y + 3], [x + 6, y + 3]], K);
          g.rect(x + 3, y + 6, x + 4, y + 8, P.BRUISE);
        } else {
          g.pts([[x + 2, y + 3], [x + 5, y + 3]], P.EYE);
          g.maw(x + 1, y + 5, x + 6, y + 8);
        }
      };
      if (!r) {
        g.rect(9, 12, 10, 24, SK);
        g.col(10, 13, 24, dark(SK));
        g.pts([[9, 15], [9, 18], [9, 21]], P.BRUISE);
        head(6, 3);
        g.row(13, 8, 11, ROPE);
        g.row(14, 8, 11, dark(ROPE));
        g.col(12, 13, 30, ROPE);
        g.pts([[12, 16], [12, 20], [12, 24], [12, 28]], dark(ROPE));
      } else {
        g.tube(curve([[9.5, 24], [10, 12], [6, 4], [0, 5], [-4, 12]], 6), 1.4, 1.4, SK);
        head(-8, 11);
        g.row(21, -6, -3, SK);
        g.limb([[-1, 8], [1, 9]], ROPE, 2);
        g.limb([[2, 8], [8, 1], [14, -3]], ROPE);
      }
    },
    { L: 'tall' },
  );

  /* 2 */
  mk(
    'horse-man-face',
    'horse with a man face human head on a horse body bay nag wrong jaw',
    44,
    32,
    (g, r) => {
      const H = HIDE,
        leg = (x, k, far) => {
          const col = far ? dark(H) : H;
          g.limb([[x, 18], [x + k, 24], [x, 30]], col, 2);
          g.rect(x, 30, x + 2, 31, K);
        };
      leg(11, 1, true);
      leg(27, -1, true);
      g.hairs([[5, 11, 14, -3], [6, 11, 15, -2], [4, 12, 11, -3], [7, 12, 13, -1]], hex('#2a2228'));
      g.ball(6, 9, 31, 20, H);
      g.poly([[24, 10], [31, 12], [37, 5], [33, 1], [29, 3]], H); // neck
      for (let i = 0; i < 6; i++) g.line(27 + i * 1.3, 8 - i * 1.3, 25 + i * 1.3, 11 - i * 1.3, hex('#2a2228'));
      leg(7, 1);
      leg(30, -1);
      // the face
      const fx = 33,
        fy = r ? -2 : 0;
      g.oval(fx, fy, fx + 8, fy + 10, P.PALE);
      g.row(fy, fx + 2, fx + 6, hex('#2a2228'));
      g.pts([[fx + 1, fy + 1], [fx + 7, fy + 1], [fx, fy + 3]], hex('#2a2228'));
      g.set(fx + 4, fy + 6, dark(P.PALE));
      if (!r) {
        g.pts([[fx + 2, fy + 4], [fx + 6, fy + 4]], K);
        g.row(fy + 8, fx + 3, fx + 5, vd(P.PALE));
      } else {
        g.pts([[fx + 2, fy + 3], [fx + 6, fy + 3]], P.EYE);
        g.pts([[fx + 2, fy + 4], [fx + 6, fy + 4]], K);
        g.rect(fx + 2, fy + 7, fx + 6, fy + 17, P.PALE); // the jaw goes on down
        g.rect(fx + 3, fy + 8, fx + 5, fy + 16, P.MAW);
        g.teeth(fy + 8, fx + 3, fx + 5, P.TOOTH, 1);
        g.teeth(fy + 16, fx + 3, fx + 5, P.TOOTH, 1);
        g.col(fx + 4, fy + 11, fy + 19, P.GUM);
      }
    },
    { L: 'long' },
  );

  /* 3 */
  mk(
    'stagecoach-driverless',
    'stagecoach driven by nothing empty box seat reins in the air coach lamps door mouth',
    48,
    32,
    (g, r) => {
      const B = hex('#5a2e28'),
        wheel = (x, y, d) => {
          g.oval(x, y, x + d, y + d, IRON);
          g.oval(x + 1, y + 1, x + d - 1, y + d - 1, C.woodLight);
          g.oval(x + 2, y + 2, x + d - 2, y + d - 2, null);
          for (let yy = y + 2; yy <= y + d - 2; yy++) for (let xx = x + 2; xx <= x + d - 2; xx++) if (((xx - x - d / 2) / (d / 2 - 1.5)) ** 2 + ((yy - y - d / 2) / (d / 2 - 1.5)) ** 2 <= 1) g.clear(xx, yy);
          const m = d / 2;
          g.line(x + 1, y + m, x + d - 1, y + m, C.wood);
          g.line(x + m, y + 1, x + m, y + d - 1, C.wood);
          g.line(x + 2, y + 2, x + d - 2, y + d - 2, C.wood);
          g.line(x + d - 2, y + 2, x + 2, y + d - 2, C.wood);
          g.rect(x + m - 0.5, y + m - 0.5, x + m + 0.5, y + m + 0.5, IRON);
        };
      g.row(20, 6, 40, IRON);
      wheel(5, 17, 12);
      wheel(29, 20, 9);
      g.poly([[8, 6], [32, 6], [33, 16], [30, 20], [10, 20], [7, 16]], B);
      g.row(5, 7, 33, C.woodDark);
      g.rect(10, 3, 16, 4, LEATH); // luggage
      g.rect(18, 2, 23, 4, C.woodLight);
      g.rect(10, 8, 14, 12, P.NIGHT);
      g.rect(25, 8, 29, 12, P.NIGHT);
      g.col(8, 7, 16, lite(B));
      // the box seat, empty, and the reins
      g.rect(33, 9, 39, 10, C.woodDark);
      g.rect(34, 11, 38, 15, B);
      g.rect(39, 12, 41, 13, C.woodDark);
      g.rect(33, 6, 34, 9, C.woodDark);
      g.rect(34, 13, 35, 15, BRASSY());
      g.set(34, 14, r ? P.RED : C.flameLight);
      function BRASSY() {
        return C.brass;
      }
      if (!r) {
        g.rect(17, 8, 22, 19, dark(B)); // the door
        g.rect(18, 9, 21, 12, P.NIGHT);
        g.set(21, 15, C.brass);
        g.line(37, 7, 46, 11, LEATH);
        g.line(37, 8, 46, 14, LEATH);
        g.line(36, 2, 36, 8, C.woodDark); // the whip stands by itself
        g.line(36, 2, 41, 4, LEATH);
        g.pts([[12, 10], [27, 10]], P.EYE);
      } else {
        g.rect(16, 7, 23, 20, P.MAW);
        for (let y = 8; y <= 19; y += 2) g.pts([[16, y], [23, y + 1]], P.TOOTH);
        g.tube(curve([[19.5, 17], [20, 23], [24, 27], [29, 30]], 5), 2, 1.4, P.GUM);
        g.rect(11, 7, 15, 20, dark(B)); // the door flung back
        g.pts([[12, 10], [27, 10]], P.RED);
        g.pts([[12, 9], [27, 9], [12, 11], [27, 11]], P.EYE);
        g.tent([[37, 7], [42, 1], [46, 4], [47, 10]], 0.8, LEATH);
        g.tent([[37, 8], [43, 12], [46, 18], [44, 23]], 0.8, LEATH);
        g.tent([[36, 6], [33, 0], [27, -3], [22, -1]], 0.8, LEATH);
      }
    },
    { L: 'long' },
  );

  /* 4 */
  mk(
    'buzzard-priest',
    'buzzard priest vulture headed preacher black cassock wings carrion bird man',
    18,
    37,
    (g, r) => {
      const b = g.at(1, 3),
        HD = hex('#b07a6e');
      if (r) {
        for (const v of [b, b.flip(15)]) {
          v.wing(3, 14, [[-6, 2], [-12, 8], [-11, 19], [-6, 25], [1, 24]], hex('#2c2a34'), hex('#16141d'));
          for (const [x, y] of [[-12, 10], [-11, 20], [-7, 26], [-2, 26]]) v.col(x, y, y + 2, hex('#2c2a34'));
        }
      }
      b.man({ head: false, top: FROCK, robe: FROCK, wide: 1, tl: 10, ll: 12, hand: hex('#8a7a56'), arms: r ? 'out' : { l: 'down', r: 'hold' } });
      if (!r) b.rect(5, 16, 8, 19, hex('#3a2a22')), b.set(6, 17, C.gold); // the good book
      for (const x of [4, 6, 9, 11]) b.col(x, 34, 35, hex('#8a7a56')); // bird feet under the hem
      b.rect(4, 11, 11, 13, C.white); // a ruff of white down
      b.pts([[3, 12], [12, 12], [5, 14], [10, 14]], C.white);
      b.oval(5, 3, 10, 10, HD);
      b.pts([[6, 4], [9, 5], [7, 3]], dark(HD));
      b.pts([[6, 6], [9, 6]], r ? P.RED : K);
      if (!r) {
        b.rect(7, 8, 8, 10, P.BONE);
        b.set(7, 11, K);
        b.set(8, 11, dark(P.BONE));
      } else {
        b.rect(6, 8, 9, 8, P.BONE);
        b.rect(7, 9, 8, 11, P.MAW);
        b.pts([[6, 9], [9, 9], [6, 10], [9, 10], [7, 12], [8, 12]], P.BONE);
        b.set(7, 10, C.red);
      }
      b.row(3, 1, 14, FROCK); // the hat
      b.rect(5, 0, 10, 2, FROCK);
      b.row(0, 6, 9, lite(FROCK));
    },
    {},
  );

  /* 5 */
  mk(
    'mine-lamp-eye',
    'mine thing with a lamp for an eye pale cave digger tommyknocker pick claws',
    22,
    26,
    (g, r) => {
      const M = hex('#b4ae9e');
      const arm = (v, up) => {
        if (!up) {
          v.limb([[5, 9], [1, 14], [2, 23]], M, 2);
          v.fingers(2, 23, 'd', IRON, 2);
        } else {
          v.limb([[5, 9], [0, 4], [-1, -4]], M, 2);
          v.fingers(0, -5, 'u', IRON, 3);
        }
      };
      arm(g, false);
      arm(g.flip(21), r);
      g.limb([[8, 19], [6, 22], [7, 24]], dark(M), 2);
      g.limb([[13, 19], [15, 22], [14, 24]], dark(M), 2);
      g.ball(5, 6, 16, 21, M);
      g.ribs(8, 13, 15, 3, dark(M));
      g.oval(6, 2, 15, 11, M); // the head, sunk between the shoulders
      g.row(2, 7, 14, IRON);
      g.rect(6, 3, 15, 4, IRON); // the brim of a helmet grown in
      g.oval(8, 4, 13, 9, C.brass);
      g.oval(9, 5, 12, 8, r ? C.white : C.flameLight);
      if (r) {
        g.pts([[10, 2], [11, 1], [7, 6], [6, 5], [14, 6], [15, 5], [10, 6], [11, 7]], C.flameLight);
        g.maw(7, 10, 14, 14, { round: true });
      } else {
        g.set(10, 6, C.white);
        g.row(11, 9, 12, vd(M));
      }
    },
    {},
  );

  /* 6 */
  mk(
    'tumbleweed-teeth',
    'tumbleweed of hair and teeth rolling ball tangle small desert thing',
    14,
    14,
    (g, r) => {
      const A = hex('#7a6444'),
        B = hex('#3a2e26'),
        rr = rnd(9),
        op = r ? 3 : 0;
      g.oval(1, 1 - op, 12, 12, B);
      for (let i = 0; i < 16; i++) {
        const a = rr() * 6.28,
          b = a + 1.5 + rr() * 1.8,
          col = i % 3 ? A : hex('#9a8458');
        g.line(6.5 + Math.cos(a) * 5.6, 6.5 - op / 2 + Math.sin(a) * (5.6 + op / 2), 6.5 + Math.cos(b) * 5.6, 6.5 - op / 2 + Math.sin(b) * (5.6 + op / 2), col);
      }
      if (!r) {
        g.pts([[4, 8], [7, 9], [9, 7], [5, 4]], P.TOOTH);
        g.set(9, 4, P.EYE);
      } else {
        g.maw(2, 3, 11, 8, { round: true, step: 1 });
        g.orb(5, -2, 8, 1, P.RED);
        g.limb([[1, 4], [-2, 1], [-3, -2]], A);
        g.limb([[12, 3], [15, 1], [15, -2]], A);
        g.limb([[2, 0], [0, -3]], A);
      }
    },
    {},
  );

  /* 7 */
  mk(
    'undertaker-shadow',
    "the undertaker's long shadow tall top hat mourning black looming shade behind him",
    22,
    48,
    (g, r) => {
      const S = P.SH,
        b = g.at(3, 14);
      // the shadow stands up behind him
      g.rect(8, 1, 13, 7, S);
      g.row(8, 5, 16, S);
      g.oval(7, 8, 14, 17, S);
      g.poly([[5, 18], [16, 18], [18, 46], [3, 46]], S);
      if (!r) {
        g.rect(3, 19, 4, 38, S);
        g.rect(17, 19, 18, 38, S);
      } else {
        for (const v of [g, g.flip(21)]) {
          v.limb([[5, 19], [-3, 14], [-7, 22]], S, 2);
          v.fingers(-7, 23, 'd', S, 4);
        }
        g.pts([[9, 12], [12, 12]], P.EYE);
        g.row(15, 9, 12, P.EYE);
        g.pts([[8, 14], [13, 14]], P.EYE);
      }
      g.col(4, 20, 44, P.SHL);
      b.man({ skin: P.PALE, face: r ? 'none' : 'old', hat: ['top', FROCK, hex('#3a3846')], top: FROCK, coat: FROCK, coatLen: 6, legs: hex('#2e2c38'), shirt: C.white, tie: FROCK, arms: { l: 'down', r: 'hold' }, hand: C.white });
      b.col(11, 2, 9, hex('#3a3846')); // the crape weeper on his hat
      b.rect(9, 15, 9, 17, C.gold); // a measuring tape
      if (r) b.rect(7, 9, 8, 10, K);
    },
    { L: 'tall', def: { shade: false } },
  );

  /* 8 */
  mk(
    'locust-figure',
    'locust swarm in the shape of a man figure made of grasshoppers plague insects',
    18,
    35,
    (g, r) => {
      const A = hex('#7a7040'),
        B = hex('#a09454'),
        D = hex('#3e3a24'),
        rr = rnd(21);
      const s = sub(30, 40, (q) => {
        q.at(7, 2).man({ skin: A, top: A, legs: A, shoe: A, hand: A, face: 'none', arms: r ? { l: 'reach', r: 'down' } : 'down', neck: false });
      });
      for (let y = 0; y < s.h; y++)
        for (let x = 0; x < s.w; x++) {
          if (!s.get(x, y)) continue;
          const v = rr();
          if (v < (r ? 0.2 : 0.08)) continue;
          g.set(x - 6, y - 1, v < 0.5 ? A : v < 0.8 ? B : D);
        }
      for (let i = 0; i < (r ? 40 : 12); i++) {
        const x = Math.round(-4 + rr() * 24 - (r ? 5 : 0)),
          y = Math.round(rr() * 32);
        if (!r && x > 1 && x < 15) continue;
        g.set(x, y, B);
        g.set(x + 1, y, D);
      }
      g.rect(6, 6, 7, 7, r ? P.RED : D);
      g.rect(10, 6, 11, 7, r ? P.RED : D);
      if (r) g.rect(7, 9, 10, 11, K);
    },
    { def: { outline: false, shade: false } },
  );

  /* 9 */
  mk(
    'scarecrow-preacher',
    'scarecrow preacher sack head stitched mouth black coat on a pole straw sermon',
    22,
    40,
    (g, r) => {
      const b = g.at(3, 3);
      if (!r) {
        b.col(7, 22, 36, C.woodDark);
        b.col(8, 22, 36, C.wood);
        b.row(14, -3, 18, C.woodDark);
      } else {
        b.col(12, 20, 36, C.woodDark); // the pole it left
        b.row(22, 11, 14, C.woodDark);
        for (const x of [5, 6, 9, 10]) b.col(x, 28, 33 + (x % 2) * 2, C.straw);
      }
      b.man({ skin: SACK, face: 'none', top: FROCK, legs: false, ll: 0, tl: 10, coat: FROCK, coatLen: 6, hand: C.straw, arms: r ? 'reach' : 'out', neck: false, shirt: C.white });
      b.ragged(28, 3, 4);
      b.pts([[6, 6], [9, 6]], K);
      if (!r) {
        b.row(9, 5, 10, K);
        b.pts([[6, 8], [8, 8], [10, 8], [5, 10], [7, 10], [9, 10]], K);
        b.pts([[-6, 12], [-6, 16], [20, 13], [20, 15]], C.straw);
      } else {
        b.pts([[6, 6], [9, 6]], C.flame);
        b.maw(5, 8, 10, 10, { in: K, teeth: C.flame });
        for (const v of [b, b.flip(15)]) v.fingers(-6, 19, 'l', C.straw, 3);
      }
      b.row(3, 1, 14, FROCK);
      b.rect(5, 0, 10, 2, FROCK);
      b.pts([[4, 11], [11, 12], [3, 12]], C.straw);
    },
    {},
  );

  /* 10 */
  mk(
    'coyote-upright',
    'coyote that stands up on two legs like a man thin dog yellow eyes skinwalker',
    16,
    32,
    (g, r) => {
      const F = hex('#8f7a58'),
        D = dark(F),
        L = hex('#c2b490');
      g.tent([[5, 20], [1, 23], [0, 28]], 1.6, D); // tail
      for (const v of [g, g.flip(15)]) {
        v.limb([[5, 19], [4, 24], [6, 27], [5, 30]], F, 2);
        v.row(30, 3, 6, D);
        if (!r) {
          v.limb([[4, 11], [2, 17], [2, 21]], F, 2);
          v.fingers(2, 22, 'd', D, 1);
        } else {
          v.limb([[4, 11], [0, 8], [-2, 3]], F, 2);
          v.fingers(-2, 2, 'u', D, 2);
        }
      }
      g.poly([[5, 10], [10, 10], [11, 15], [10, 20], [5, 20], [4, 15]], F);
      g.rect(6, 12, 9, 19, L);
      g.ribs(6, 9, 13, 3, dark(L));
      g.poly([[4, 0], [6, 3], [4, 4]], F); // ears
      g.poly([[11, 0], [9, 3], [11, 4]], D);
      g.oval(4, 2, 11, 8, F);
      g.rect(6, 6, 9, 10, L);
      g.rect(7, 9, 8, 10, K);
      g.pts([[5, 5], [10, 5]], r ? P.RED : P.YEL);
      if (r) {
        g.rect(6, 8, 9, 16, P.MAW); // the mouth opens down to the chest
        g.pts([[6, 8], [9, 8], [6, 10], [9, 11], [6, 13], [9, 14], [6, 16], [8, 16]], P.TOOTH);
        g.col(7, 10, 18, P.GUM);
        g.pts([[7, 12], [8, 12]], P.EYE); // and something looks out
      }
    },
    {},
  );

  /* 11 */
  mk(
    'telegraph-spider',
    'telegraph wire spider poles for legs glass insulators for eyes wires web',
    48,
    30,
    (g, r) => {
      const W = hex('#5a4230'),
        cx = 23.5;
      for (const s of [-1, 1])
        for (let i = 2; i >= 0; i--) {
          const up = r && i === 0,
            kx = cx + s * (7 + i * 6),
            ky = 3 + i * 3 - (up ? 8 : 0),
            fx = cx + s * (9 + i * 6.5) + (up ? s * 6 : 0),
            fy = up ? 2 : 28;
          g.limb([[cx + s * 5, 14], [kx, ky], [fx, fy]], s > 0 ? dark(W) : W, 2);
          g.row(ky + 1, kx - 2, kx + 2, W); // a little cross-arm at each knee
          g.pts([[kx - 2, ky], [kx + 2, ky]], C.glass);
        }
      // the wires sag between the knees
      for (const s of [-1, 1])
        for (let i = 0; i < 2; i++) {
          const a = cx + s * (9 + i * 6),
            b = cx + s * (5 + (i + 1) * 6);
          if (r && i === 0) continue;
          for (let t = 0; t <= 6; t++) g.set(a + ((b - a) * t) / 6, 4 + i * 3 + 3 * (t / 6) + Math.sin((t / 6) * 3.14) * 2, P.NIGHT);
        }
      g.ball(18, 14, 29, 23, hex('#3a3440')); // a belly of coiled wire
      for (const y of [16, 18, 20]) g.row(y, 19, 28, C.rust);
      g.rect(14, 11, 33, 14, W); // the cross-arm
      g.row(11, 14, 33, lite(W));
      for (const x of [16, 20, 27, 31]) {
        g.rect(x, 8, x + 1, 10, C.glass);
        g.set(x, 8, r ? C.flameLight : C.glassLight);
      }
      if (r) {
        g.pts([[15, 6], [18, 5], [22, 6], [26, 5], [29, 6], [33, 5], [17, 3], [31, 3]], C.flameLight);
        g.limb([[21, 15], [20, 19], [22, 21]], C.steel);
        g.limb([[26, 15], [27, 19], [25, 21]], C.steel);
      }
    },
    { L: 'long' },
  );

  /* 12 */
  mk(
    'prospector-drowned',
    'drowned prospector bloated gold miner wet beard pan water eels river dead',
    18,
    35,
    (g, r) => {
      const b = g.at(1, 1),
        SK = P.DROWN;
      b.man({ skin: SK, face: r ? 'none' : 'dead', hat: ['brim', hex('#5a4a38')], top: hex('#7a4a44'), legs: hex('#3e4656'), shoe: hex('#3a2a22'), arms: r ? 'reach' : { l: 'down', r: 'hold' }, hand: SK, belt: C.woodDark });
      b.rect(4, 16, 11, 20, hex('#7a4a44')); // swollen
      b.col(5, 12, 21, hex('#4a3a34'));
      b.col(10, 12, 21, hex('#4a3a34'));
      b.rect(5, 9, 10, 13, C.ash); // the beard
      b.pts([[6, 14], [8, 15], [9, 14]], C.ash);
      b.pts([[6, 16], [8, 18], [3, 25], [12, 27], [5, 30]], hex('#6f93a8'));
      if (!r) {
        b.oval(4, 15, 10, 18, C.steel); // the pan
        b.row(16, 5, 9, hex('#6a6a70'));
        b.set(7, 16, C.gold);
      } else {
        b.pts([[6, 6], [9, 6]], P.YEL);
        b.rect(6, 9, 9, 11, K);
        b.tent([[7.5, 10], [6, 16], [9, 21], [6, 26]], 1.3, hex('#4a5a4e'));
        b.tent([[8, 10], [11, 14], [13, 20]], 0.9, hex('#4a5a4e'));
        b.pts([[4, 12], [11, 13], [7, 28], [8, 30], [9, 33]], hex('#6f93a8'));
      }
      b.pts([[2, 4], [13, 5]], C.moss);
    },
    {},
  );

  /* 13 */
  mk(
    'gambler-many-hands',
    'gambler with too many hands card sharp six arms cards saloon dead man hand',
    20,
    35,
    (g, r) => {
      const b = g.at(2, 1),
        card = (x, y) => {
          b.rect(x, y, x + 2, y + 3, C.white);
          b.set(x + 1, y + 1, (x + y) % 2 ? C.red : K);
        };
      if (r)
        for (const v of [b, b.flip(15)]) {
          v.limb([[3, 14], [-3, 9], [-6, 4]], hex('#2a2832'), 2);
          v.limb([[3, 15], [-5, 15], [-9, 13]], hex('#2a2832'), 2);
          v.limb([[3, 17], [-3, 21], [-7, 22]], hex('#2a2832'), 2);
          v.rect(-7, 2, -5, 3, P.PALE);
          v.rect(-11, 12, -9, 13, P.PALE);
          v.rect(-9, 22, -7, 23, P.PALE);
        }
      b.man({ skin: P.PALE, face: r ? 'grin' : 'calm', hat: ['brim', FROCK], top: C.wine, sleeve: hex('#2a2832'), legs: hex('#2a2832'), shirt: C.white, tie: FROCK, arms: 'hold' });
      b.pts([[5, 9], [6, 9], [9, 9], [10, 9]], hex('#3a2a22')); // moustache
      card(5, 13);
      card(8, 14);
      if (!r) {
        b.pts([[4, 20], [4, 21], [11, 19], [11, 20]], P.PALE); // more fingers at the edge of the coat
      } else {
        for (const [x, y] of [[-8, -2], [-12, 9], [-10, 20], [21, -2], [25, 9], [23, 20]]) card(x, y);
        b.pts([[6, 6], [9, 6]], P.YEL);
      }
    },
    {},
  );

  /* 14 */
  mk(
    'noose-snake',
    'rope snake noose that crawls hangman rope cobra coil small',
    20,
    10,
    (g, r) => {
      const R = ROPE,
        tw = (pts, r0) => {
          const p = curve(pts, 6);
          g.tube(p, r0, r0, R);
          for (let i = 1; i < p.length; i += 3) g.set(p[i][0], p[i][1], dark(R));
        };
      tw([[2, 7], [8, 5], [14, 7], [17, 6], [12, 3], [6, 4]], 1.1);
      g.oval(1, 5, 5, 8, R);
      if (!r) {
        g.oval(14, 1, 19, 5, R);
        g.oval(15, 2, 18, 4, null);
        g.clearRect(15, 2, 18, 4);
        g.rect(13, 3, 14, 5, dark(R));
      } else {
        tw([[8, 4], [10, -2], [9, -7]], 1.2);
        g.oval(5, -14, 13, -6, R);
        g.oval(7, -12, 11, -8, P.MAW);
        g.pts([[8, -12], [10, -12]], P.TOOTH);
        g.col(9, -10, -6, P.GUM);
        g.rect(8, -6, 10, -4, dark(R)); // the knot
        g.pts([[7, -5], [11, -5]], P.RED);
      }
    },
    {},
  );

  /* 15 */
  mk(
    'steer-carcass',
    'steer carcass that walks longhorn skeleton cattle skull ribs hide rags bones',
    46,
    28,
    (g, r) => {
      const B = P.BONE,
        D = dark(B);
      const leg = (x, k) => {
        g.limb([[x, 12], [x + k, 19], [x, 25]], B, 2);
        g.rect(x - 1, 25, x + 2, 26, D);
        g.set(x + k, 19, D);
      };
      leg(8, 1);
      leg(13, -1);
      leg(28, 1);
      leg(32, -1);
      g.rect(7, 7, 33, 8, B); // the spine
      for (let x = 8; x <= 32; x += 2) g.set(x, 6, B);
      g.row(9, 7, 33, D);
      for (let x = 15; x <= 27; x += 3) {
        // ribs
        if (!r) g.limb([[x, 9], [x - 1, 14], [x + 1, 18]], B);
        else g.limb([[x, 9], [x - 3, 13], [x - 4, 21]], B), g.limb([[x + 1, 9], [x + 3, 14], [x + 3, 20]], D);
      }
      g.oval(6, 6, 12, 12, B); // hips
      g.limb([[6, 8], [3, 12], [2, 20]], D); // tail
      g.pts([[2, 21], [1, 22], [3, 22]], hex('#3a2e26'));
      g.poly([[10, 5], [24, 5], [26, 9], [20, 11], [12, 10]], HIDE); // what is left of the hide
      g.pts([[14, 11], [17, 12], [22, 12]], HIDE);
      // skull
      const hy = r ? -4 : 3,
        hx = 33;
      g.limb([[32, 8], [hx + 3, hy + 6]], B, 2);
      for (const s of [-1, 1]) g.limb([[hx + 4 + s * 3, hy + 3], [hx + 4 + s * 7, hy + 1], [hx + 4 + s * 9, hy - 3]], hex('#b8a070'), 2);
      g.rect(hx + 1, hy + 2, hx + 8, hy + 7, B);
      g.rect(hx + 2, hy + 8, hx + 7, hy + 12, B);
      g.rect(hx + 2, hy + 4, hx + 3, hy + 6, K);
      g.rect(hx + 6, hy + 4, hx + 7, hy + 6, K);
      g.pts([[hx + 4, hy + 10], [hx + 5, hy + 11]], K);
      if (r) {
        g.pts([[hx + 2, hy + 5], [hx + 6, hy + 5]], P.RED);
        g.rect(hx + 2, hy + 13, hx + 7, hy + 15, P.MAW);
        g.rect(hx + 2, hy + 16, hx + 7, hy + 17, B);
        g.teeth(hy + 13, hx + 2, hx + 7);
        g.teeth(hy + 15, hx + 3, hx + 7);
      }
    },
    { L: 'long' },
  );

  /* 16 */
  mk(
    'grave-mole',
    'grave mole star nosed thing digging out of a grave mound spade claws cross',
    22,
    16,
    (g, r) => {
      const M = hex('#3e3a44'),
        up = r ? -5 : 0;
      g.col(17, 2, 11, C.woodLight); // a leaning cross
      g.row(5, 15, 19, C.woodLight);
      if (r) {
        g.oval(5, 4 + up, 14, 14, M);
        g.pts([[6, 5 + up], [7, 4 + up]], lite(M));
      }
      g.poly([[1, 14], [5, 9], [18, 9], [21, 14]], C.earth);
      g.speckle(2, 10, 20, 14, dark(C.earth), 4, 3);
      g.pts([[3, 12], [10, 10], [15, 12]], lite(C.earth));
      for (const v of [g, g.flip(19)]) {
        const x = r ? 1 : 4,
          y = r ? 5 : 9;
        v.rect(x, y, x + 3, y + 2, P.RAW);
        v.pts([[x - 1, y + 3], [x + 1, y + 3], [x + 3, y + 3], [x - 1, y + 2]], P.BONE);
        v.pts([[x - 1, y + 4], [x + 1, y + 4], [x + 3, y + 4]], P.BONE);
      }
      // the nose opens like a flower
      const ny = 8 + up;
      if (!r) g.pts([[9, 8], [10, 8], [8, 7], [11, 7], [9, 6], [10, 9]], P.RAW);
      else {
        for (let a = 0; a < 8; a++) g.line(9.5, ny, 9.5 + Math.cos(a * 0.785) * 3.4, ny + Math.sin(a * 0.785) * 3.4, P.RAW);
        g.rect(9, ny - 1, 10, ny, P.MAW);
        g.pts([[9, ny - 1], [10, ny]], P.TOOTH);
      }
    },
    {},
  );

  /* 17 */
  mk(
    'wanted-poster-face',
    'wanted poster whose face comes out of the paper outlaw notice small crawling bill',
    12,
    16,
    (g, r) => {
      const PA = C.parchment;
      g.rect(1, 0, 10, 13, PA);
      g.pts([[1, 0], [10, 13]], null);
      g.clear(1, 0);
      g.clear(10, 13);
      g.row(1, 3, 8, hex('#3a2a22'));
      g.row(11, 2, 9, hex('#6a5a44'));
      g.row(12, 4, 7, hex('#6a5a44'));
      g.pts([[0, 14], [1, 14], [9, 14], [10, 14], [11, 14]], PA); // curled corners it walks on
      g.pts([[5, 0], [6, 0]], IRON);
      if (!r) {
        g.rect(3, 3, 8, 9, lite(PA));
        g.rect(4, 3, 7, 3, hex('#3a2a22'));
        g.pts([[4, 5], [7, 5]], K);
        g.row(8, 4, 7, hex('#3a2a22'));
        g.row(7, 5, 6, hex('#3a2a22'));
      } else {
        g.oval(1, 2, 10, 11, P.PALE);
        g.row(2, 3, 8, hex('#3a2a22'));
        g.rect(3, 4, 4, 5, K);
        g.rect(7, 4, 8, 5, K);
        g.pts([[3, 4], [7, 4]], P.RED);
        g.maw(3, 7, 8, 10);
        g.pts([[-1, 3], [12, 6], [-1, 9]], PA);
      }
    },
    {},
  );

  /* 18 */
  mk(
    'snake-oil-salesman',
    'snake oil salesman medicine show quack checked suit snakes from his coat',
    18,
    36,
    (g, r) => {
      const b = g.at(1, 3),
        S = hex('#8a7436'),
        SN = hex('#5d6a3a');
      b.man({ skin: C.flesh, face: r ? 'none' : 'grin', hat: ['top', hex('#3a3440'), C.mustard], top: S, legs: S, shirt: C.white, tie: C.wine, arms: r ? 'none' : { l: 'down', r: 'up' }, shoe: hex('#3a2a22') });
      for (let y = 13; y < 32; y += 3) for (const x of [5, 10]) if (b.get(x, y)) b.set(x, y, dark(S));
      b.pts([[5, 9], [10, 9], [4, 8], [11, 8]], hex('#3a2a22')); // a waxed moustache
      if (!r) {
        b.rect(15, 0, 16, 2, hex('#4a6a5a')); // the bottle
        b.set(15, -1, C.woodLight);
      } else {
        b.rect(6, 13, 9, 21, P.NIGHT);
        b.tent([[7, 15], [3, 18], [-2, 16], [-5, 19]], 1.4, SN);
        b.tent([[8, 17], [13, 20], [18, 17], [20, 20]], 1.4, SN);
        b.tent([[7, 19], [6, 24], [2, 27], [-2, 25]], 1.2, SN);
        b.tent([[3, 13], [-1, 9], [-4, 4], [-2, 0]], 1.3, SN);
        b.tent([[12, 13], [16, 9], [19, 5], [17, 1]], 1.3, SN);
        b.pts([[-6, 19], [21, 20], [-3, 25], [-2, -1], [17, 0]], P.YEL);
        b.pts([[6, 6], [9, 6]], P.YEL);
        b.rect(6, 8, 9, 10, K);
        b.limb([[7, 10], [7, 13], [6, 14]], C.red);
      }
    },
    {},
  );

  /* 19 */
  mk(
    'bell-walker',
    'church bell that walks on bird legs bronze clapper tongue chapel schoolhouse',
    16,
    20,
    (g, r) => {
      const BR = hex('#8a6a3a');
      for (const x of [5, 10]) {
        g.limb([[x, 12], [x + (x < 8 ? -1 : 1), 15], [x, 18]], hex('#6a5a3a'));
        g.pts([[x - 1, 18], [x + 1, 18]], hex('#6a5a3a'));
      }
      g.rect(4, 0, 11, 1, C.woodDark); // the headstock
      g.limb([[12, 1], [14, 3], [13, 8]], ROPE);
      if (!r) {
        g.poly([[6, 2], [9, 2], [12, 11], [14, 13], [1, 13], [3, 11]], BR);
        g.col(5, 3, 11, lite(BR));
        g.row(10, 3, 12, dark(BR));
        g.rect(7, 13, 8, 15, IRON);
      } else {
        g.poly([[6, 2], [9, 2], [12, 8], [3, 8]], BR);
        g.poly([[3, 8], [12, 8], [15, 14], [0, 14]], P.MAW); // the mouth of the bell, tipped up at us
        g.frame(0, 14, 15, 14, BR);
        g.pts([[1, 12], [2, 10], [14, 12], [13, 10]], BR);
        for (let x = 2; x <= 13; x += 2) g.set(x, 13, P.TOOTH);
        for (let x = 4; x <= 11; x += 2) g.set(x, 9, P.TOOTH);
        g.tube([[7.5, 10], [7.5, 17]], 1.2, 1.6, P.GUM);
        g.pts([[5, 0], [10, 0]], P.RED);
      }
    },
    {},
  );

  /* 20 */
  mk(
    'crow-child-face',
    'crow with a child face black bird pale human face small carrion',
    13,
    11,
    (g, r) => {
      const B = hex('#22202a');
      g.poly([[0, 5], [4, 4], [4, 7], [1, 8]], B); // tail
      g.oval(3, 3, 10, 9, B);
      if (!r) g.poly([[4, 4], [9, 5], [7, 8], [3, 7]], hex('#34323e'));
      else {
        g.poly([[5, 4], [2, -4], [6, -2], [8, 4]], hex('#34323e'));
        g.pts([[2, -5], [4, -4], [6, -3]], B);
      }
      g.col(6, 9, 10, C.mustard);
      g.col(8, 9, 10, C.mustard);
      g.oval(8, 0, 12, 5, B);
      g.rect(9, 1, 11, 4, P.PALE);
      g.pts([[9, 2], [11, 2]], r ? P.RED : K);
      if (r) g.rect(10, 3, 10, 5, K);
      else g.set(10, 4, vd(P.PALE));
    },
    {},
  );

  /* 21 */
  mk(
    'railway-worm',
    'railway worm locomotive headed centipede train carriages legs funnel cowcatcher jaw',
    48,
    20,
    (g, r) => {
      const cols = [hex('#5a2e28'), hex('#3d4a34'), hex('#5a2e28'), hex('#3d4a34')];
      for (let i = 0; i < 4; i++) {
        const x = 1 + i * 8,
          y = 8 + (i % 2);
        for (const lx of [x + 1, x + 5]) {
          g.limb([[lx, y + 6], [lx - 1, y + 8 - (r && i % 2 ? 2 : 0)], [lx + 1, 17]], IRON);
          g.set(lx + 2, 17, IRON);
        }
        g.rect(x, y, x + 6, y + 6, cols[i]);
        g.row(y, x, x + 6, lite(cols[i]));
        g.row(y - 1, x + 1, x + 5, IRON);
        g.rect(x + 1, y + 2, x + 2, y + 3, r ? P.EYE : C.glow);
        g.rect(x + 4, y + 2, x + 5, y + 3, r ? P.EYE : C.glow);
        if (r) g.pts([[x + 2, y + 3], [x + 5, y + 3]], K);
        g.set(x + 7, y + 4, IRON);
      }
      // the engine
      for (const lx of [35, 39, 43]) {
        g.limb([[lx, 14], [lx - 1, 16], [lx + 1, 17]], IRON);
        g.set(lx + 2, 17, IRON);
      }
      g.rect(33, 5, 37, 14, hex('#2e2c38')); // cab
      g.rect(34, 6, 36, 8, C.flame);
      g.ball(37, 7, 45, 14, hex('#33313c'));
      g.rect(40, 2, 42, 7, IRON); // funnel
      g.row(2, 39, 43, IRON);
      g.rect(43, 9, 44, 10, C.brass);
      g.set(44, 9, r ? C.white : C.flameLight);
      if (!r) {
        g.poly([[44, 13], [47, 17], [42, 17]], IRON);
        g.pts([[44, 15], [45, 16], [43, 16]], C.steel);
        g.pts([[40, 0], [42, -1]], C.ash);
      } else {
        g.poly([[41, 11], [47, 10], [47, 16], [41, 15]], C.blood); // the firebox jaw
        g.rect(43, 12, 46, 14, C.flame);
        g.set(45, 13, C.flameLight);
        for (let x = 42; x <= 47; x += 2) g.set(x, 11, C.steel), g.set(x, 16, C.steel);
        g.ball(37, -6, 45, 0, C.ash, { dark: hex('#5a5852') });
        g.pts([[39, -4], [42, -4]], K);
        g.row(-2, 40, 42, K);
        g.pts([[41, 1], [42, 0]], C.ash);
      }
    },
    { L: 'long' },
  );

  /* 22 */
  mk(
    'gallows-walker',
    'gallows that walks on its posts hanging tree nooses reaching hanged sack figure',
    30,
    48,
    (g, r) => {
      const W = hex('#5a4230');
      for (const [x, k] of [[5, -2], [22, 2]]) {
        g.limb([[x, 4], [x + (r ? k : 0), 26], [x, 45]], W, 3);
        g.rect(x - 1, 45, x + 3, 46, dark(W));
        g.pts([[x + 1, 12], [x + 1, 30], [x, 20]], dark(W));
      }
      g.rect(2, 2, 27, 4, W);
      g.row(2, 2, 27, lite(W));
      g.line(6, 10, 11, 5, W);
      g.line(23, 10, 18, 5, dark(W));
      g.pts([[9, 3], [19, 3]], r ? P.RED : K); // knots like eyes
      // one who still hangs
      g.col(14, 5, 12, ROPE);
      g.rect(12, 13, 16, 17, SACK);
      g.row(18, 13, 15, ROPE);
      g.rect(11, 19, 17, 30, hex('#6a6456'));
      g.rect(12, 31, 13, 38, hex('#4a4640'));
      g.rect(15, 31, 16, 38, hex('#4a4640'));
      g.pts([[12, 39], [16, 39]], P.ASHEN);
      g.col(10, 20, 29, hex('#5a5448'));
      g.col(18, 20, 29, hex('#5a5448'));
      if (r) g.pts([[13, 15], [15, 15]], P.EYE);
      // the empty nooses
      const noose = (pts) => {
        g.tent(pts, 0.7, ROPE, null, 0.7);
        const [x, y] = pts[pts.length - 1];
        g.frame(x - 1, y, x + 1, y + 3, ROPE);
        g.clear(x, y + 1);
        g.clear(x, y + 2);
      };
      if (!r) {
        noose([[9, 5], [9, 14]]);
        noose([[20, 5], [20, 11]]);
      } else {
        noose([[9, 5], [4, 12], [-4, 14], [-8, 20]]);
        noose([[20, 5], [26, 10], [33, 12], [36, 19]]);
        noose([[25, 5], [30, 3], [35, 5]]);
      }
    },
    { L: 'tall' },
  );

  /* 23 */
  mk(
    'well-woman',
    'woman in the well wet black hair pale arms climbing out stone well drowned girl',
    22,
    26,
    (g, r) => {
      const ST = C.stone;
      if (r) {
        g.rect(8, 2, 13, 14, hex('#b9b6a8')); // her shift
        g.oval(7, -6, 14, 2, P.PALE);
      }
      g.rect(2, 12, 19, 24, ST);
      g.oval(2, 9, 19, 15, C.stoneLight);
      g.oval(4, 10, 17, 14, P.NIGHT);
      for (let y = 16; y <= 24; y += 3) g.row(y, 2, 19, C.stoneDark);
      for (let y = 16, n = 0; y <= 24; y += 3, n++) for (let x = 4 + (n % 2) * 3; x < 19; x += 6) g.col(x, y - 2, y - 1, C.stoneDark);
      g.pts([[3, 20], [16, 23], [9, 18]], C.moss);
      const H = hex('#1e1b24');
      if (!r) {
        g.oval(8, 8, 13, 12, H);
        g.pts([[5, 13], [6, 13], [7, 13], [14, 13], [15, 13], [16, 13]], P.PALE);
        g.pts([[5, 14], [7, 14], [14, 14], [16, 14]], P.PALE);
      } else {
        g.rect(8, 2, 13, 13, hex('#b9b6a8'));
        g.oval(7, -6, 14, 2, P.PALE);
        g.rect(7, -6, 14, -4, H);
        g.hairs([[7, -5, 16], [8, -5, 14], [9, -4, 9], [11, -4, 11], [12, -4, 8], [13, -5, 15], [14, -5, 17], [10, -5, 6]], H);
        g.set(10, -1, P.EYE);
        for (const v of [g, g.flip(21)]) {
          v.limb([[7, 4], [3, 8], [2, 18], [3, 23]], P.PALE, 2);
          v.fingers(3, 23, 'd', P.PALE, 1);
        }
      }
    },
    {},
  );

  /* 24 */
  mk(
    'sheriff-hollow',
    'hollow sheriff with a hole through his chest lawman star badge duster dead',
    18,
    36,
    (g, r) => {
      const b = g.at(1, 3),
        D = hex('#6a5a44');
      b.man({ skin: P.ASHEN, face: r ? 'hollow' : 'old', hat: ['wide', hex('#4a3a2c')], top: hex('#4a4652'), sleeve: D, coat: D, coatLen: 7, legs: hex('#33303a'), shoe: hex('#3a2a22'), arms: r ? 'out' : 'down', hx: r ? 1 : 0, hy: r ? -1 : 0 });
      b.pts([[5, 9], [6, 9], [9, 9], [10, 9]], C.ash);
      b.col(4, 12, 28, D);
      b.col(11, 12, 28, dark(D));
      b.pts([[9, 14], [10, 14], [9, 15]], C.gold); // the star
      if (!r) b.pts([[6, 16], [8, 18], [6, 19]], K);
      else {
        for (let y = 15; y <= 20; y++) for (let x = 5; x <= 9; x++) b.clear(x, y); // you can see through him
        b.pts([[5, 14], [7, 14], [9, 14], [5, 21], [7, 21], [9, 21]], P.BONE);
        b.col(4, 15, 20, C.blood);
        b.col(10, 15, 20, C.blood);
      }
    },
    {},
  );

  /* 25 */
  mk(
    'pelt-walker',
    'empty wolf pelt that walks skin rug standing up hollow hide trapper fur',
    26,
    14,
    (g, r) => {
      const F = hex('#6a5a4a'),
        IN = hex('#a08a6a');
      if (!r) {
        g.poly([[3, 5], [18, 4], [20, 8], [17, 10], [4, 10], [1, 8]], F); // flat as a rug
        for (const [x, dx] of [[3, -2], [8, -1], [14, 1], [18, 2]]) {
          g.limb([[x, 9], [x + dx, 12]], F, 2);
          g.pts([[x + dx - 1, 13], [x + dx + 1, 13]], P.BONE);
        }
        g.tent([[2, 6], [-2, 7], [-4, 10]], 1.2, dark(F));
        g.speckle(3, 5, 18, 9, dark(F), 4, 2);
        g.oval(18, 5, 24, 11, F); // the head, flat on the floor
        g.poly([[18, 4], [19, 2], [20, 5]], F);
        g.rect(22, 9, 26, 11, F);
        g.set(26, 9, K);
        g.set(21, 7, P.YEL);
        g.row(12, 22, 26, P.TOOTH);
      } else {
        g.poly([[5, -18], [14, -18], [16, -4], [15, 8], [11, 10], [8, 10], [4, 8], [3, -4]], F);
        g.poly([[7, -15], [12, -15], [13, 6], [6, 6]], IN); // the inside of the skin
        g.rect(8, -12, 11, 4, P.NIGHT);
        g.speckle(3, -18, 16, 9, dark(F), 5, 2);
        for (const v of [g, g.flip(19)]) {
          v.limb([[5, -16], [-1, -19], [-4, -12]], F, 2);
          v.fingers(-4, -11, 'd', P.BONE, 2);
          v.limb([[6, 9], [4, 12]], F, 2);
          v.pts([[3, 13], [5, 13]], P.BONE);
        }
        g.oval(6, -24, 13, -16, F); // the head flops forward
        g.poly([[6, -24], [5, -27], [8, -24]], F);
        g.poly([[13, -24], [14, -27], [11, -24]], dark(F));
        g.pts([[7, -21], [12, -21]], P.YEL);
        g.maw(7, -19, 12, -14);
        g.rect(7, -13, 12, -12, F);
      }
    },
    {},
  );

  /* 26 */
  mk(
    'camera-tripod-thing',
    'camera on a tripod with someone under the cloth daguerreotype photographer eye lens',
    18,
    34,
    (g, r) => {
      const W = C.wood,
        CL = hex('#22202a');
      const sp = r ? 3 : 0;
      g.limb([[6, 14], [2 - sp, 32]], W);
      g.limb([[11, 14], [15 + sp, 32]], dark(W));
      g.limb([[8, 14], [9, 32]], W);
      if (r) {
        g.limb([[6, 14], [0, 20], [-4, 14]], P.PALE, 2);
        g.fingers(-4, 13, 'u', P.PALE, 2);
        g.limb([[11, 12], [17, 6], [18, -1]], P.PALE, 2);
        g.rect(15, -3, 21, -2, IRON); // the flash pan
        g.pts([[17, -5], [18, -7], [19, -5], [16, -4], [20, -4], [18, -4]], C.flameLight);
        g.pts([[18, -6], [18, -5]], C.white);
      }
      g.box(3, 5, 13, 14, W);
      g.rect(1, 3, 9, 16, CL); // the cloth
      g.poly([[1, 16], [9, 16], [8, 22], [5, 20], [2, 23]], CL);
      g.col(1, 4, 20, lite(CL));
      g.oval(9, 7, 14, 12, C.brass);
      g.oval(10, 8, 13, 11, r ? P.EYE : P.NIGHT);
      if (r) {
        g.rect(11, 9, 12, 10, P.RED);
        g.set(12, 10, K);
        g.pts([[3, 17], [5, 17]], P.EYE);
      } else g.set(11, 9, C.glassLight);
    },
    {},
  );

  /* 27 */
  mk(
    'cactus-man',
    'cactus with a face saguaro man needle teeth desert thing arms spines',
    22,
    46,
    (g, r) => {
      const G = CACT,
        col2 = (x0, y0, x1, y1) => {
          g.rect(x0, y0 + 1, x1, y1, G);
          g.row(y0, x0 + 1, x1 - 1, G);
          g.col(x0, y0 + 1, y1, lite(G));
          for (let x = x0 + 2; x < x1; x += 2) g.col(x, y0 + 1, y1, dark(G));
          for (let y = y0 + 2; y < y1; y += 3) g.pts([[x0 - 1, y], [x1 + 1, y + 1]], C.cream);
        };
      if (!r) {
        col2(1, 14, 4, 24);
        g.rect(4, 22, 8, 25, G);
        col2(17, 10, 20, 20);
        g.rect(13, 18, 17, 21, G);
      } else {
        g.limb([[8, 23], [2, 22], [-2, 16]], G, 4);
        g.limb([[13, 19], [19, 18], [24, 12]], G, 4);
        for (const [x, y] of [[-3, 14], [-1, 13], [1, 13], [24, 10], [26, 10], [27, 12]]) g.line(x, y, x - (x < 10 ? 1 : -1), y - 3, C.cream);
      }
      col2(7, 3, 14, 44);
      if (r) g.limb([[8, 44], [5, 45]], dark(G), 1), g.limb([[13, 44], [16, 45]], dark(G), 1), g.pts([[4, 45], [17, 45], [10, 45]], dark(G));
      g.pts([[10, 2], [11, 1]], r ? C.red : hex('#c8b890')); // a flower on its head
      g.pts([[9, 1], [12, 2]], r ? C.red : hex('#c8b890'));
      if (!r) {
        g.rect(8, 10, 9, 11, vd(G));
        g.rect(12, 10, 13, 11, vd(G));
        g.row(15, 9, 12, vd(G));
      } else {
        g.rect(8, 9, 9, 11, K);
        g.rect(12, 9, 13, 11, K);
        g.pts([[8, 10], [12, 10]], P.RED);
        g.maw(8, 14, 13, 20, { teeth: C.cream, step: 1 });
      }
    },
    { L: 'tall' },
  );

  /* 28 */
  mk(
    'boot-biter',
    'old boot with teeth cowboy boot that bites sole jaw tongue spur small',
    12,
    13,
    (g, r) => {
      const L = LEATH;
      g.rect(2, 0, 6, 8, L);
      g.col(2, 0, 8, lite(L));
      g.row(0, 2, 6, dark(L));
      g.pts([[1, 9], [0, 10], [0, 8]], C.steel); // spur
      if (!r) {
        g.rect(2, 8, 10, 10, L);
        g.row(11, 2, 10, C.woodDark);
        g.teeth(10, 7, 10, P.TOOTH, 1);
        g.set(8, 10, L);
        g.set(8, 8, K);
      } else {
        g.poly([[2, 8], [9, 5], [11, 6], [6, 9], [2, 10]], L);
        g.poly([[5, 9], [10, 7], [9, 10], [4, 10]], P.MAW);
        g.row(11, 2, 11, C.woodDark);
        g.teeth(10, 5, 10);
        g.pts([[7, 7], [9, 6], [11, 6]], P.TOOTH);
        g.limb([[6, 10], [9, 9], [12, 11]], P.GUM);
        g.limb([[4, 0], [5, -3], [7, -4]], P.GUM); // and its own tongue
        g.set(7, 5, P.RED);
      }
    },
    {},
  );

  /* 29 */
  mk(
    'scorpion-lantern',
    'scorpion with a lantern for a sting desert vermin tail light small',
    20,
    13,
    (g, r) => {
      const S = hex('#4a3626'),
        L = hex('#7a5a36');
      for (const x of [5, 7, 9, 11]) {
        g.limb([[x, 9], [x - 1, 11]], S);
        g.limb([[x + 1, 9], [x + 2, 11]], dark(S));
      }
      g.rect(4, 7, 12, 9, S);
      for (const x of [6, 8, 10]) g.col(x, 7, 9, L);
      g.oval(11, 6, 15, 10, S);
      g.set(14, 7, r ? P.RED : P.YEL);
      // claws
      if (!r) {
        g.limb([[14, 9], [17, 10], [19, 9]], S);
        g.pts([[18, 8], [19, 10], [18, 11]], S);
      } else {
        g.limb([[14, 7], [17, 4], [19, 2]], S);
        g.pts([[18, 0], [20, 1], [20, 3], [19, 4], [17, 1]], S);
        g.limb([[14, 9], [18, 9]], S);
        g.pts([[19, 8], [19, 10]], S);
      }
      // the tail and its lantern
      const tail = r ? [[4, 8], [1, 3], [5, -3], [11, -3]] : [[4, 8], [0, 5], [2, 0], [6, 1]];
      const pp = curve(tail, 5);
      g.tube(pp, 1, 1, S);
      const [lx, ly] = tail[3];
      g.rect(lx, ly - 1, lx + 2, ly + 2, IRON);
      g.rect(lx, ly, lx + 2, ly + 1, r ? C.flameLight : C.flame);
      if (r) g.pts([[lx + 1, ly - 3], [lx + 4, ly], [lx + 1, ly + 4], [lx + 4, ly + 2], [lx + 3, ly - 2]], C.flameLight);
    },
    {},
  );

  /* 30 */
  mk(
    'dust-devil',
    'dust devil whirlwind with a face in it spinning sand ghost storm',
    16,
    30,
    (g, r) => {
      const A = DUST,
        B = hex('#8a7658'),
        k = r ? 1.5 : 1,
        top = r ? -6 : 0;
      for (let y = top; y <= 28; y++) {
        const t = (y - top) / (28 - top),
          wd = (7.5 * (1 - t) ** 0.8 + 1) * k,
          cx = 7.5 + Math.sin(y * 0.6) * 1.5 * (1 - t);
        for (let x = Math.round(cx - wd); x <= Math.round(cx + wd); x++) {
          const band = Math.floor((y + (x - cx) * 0.5) / 2) % 3;
          if ((x + y * 2) % 7 === 0 && Math.abs(x - cx) > wd - 2) continue;
          g.set(x, y, band === 0 ? A : band === 1 ? B : lite(A));
        }
      }
      g.pts([[2, 6], [13, 12], [5, 20], [10, 3]], hex('#4a3a2c')); // what it carries
      if (!r) {
        g.rect(4, 4, 5, 6, hex('#4a3a2c'));
        g.rect(9, 4, 10, 6, hex('#4a3a2c'));
      } else {
        g.rect(2, -2, 4, 1, K);
        g.rect(10, -2, 12, 1, K);
        g.pts([[3, -1], [11, -1]], P.EYE);
        g.oval(5, 4, 10, 10, K);
        g.tent([[0, 8], [-7, 6], [-10, 0]], 1.6, A);
        g.tent([[15, 9], [22, 8], [25, 2]], 1.6, B);
        g.pts([[-11, -2], [-9, -3], [26, 0], [24, -1], [-5, 12], [20, 14]], P.BONE);
      }
    },
    {},
  );

  /* 31 */
  mk(
    'canary-cage-walker',
    'canary cage that walks miner bird cage on legs swollen yellow bird small',
    12,
    20,
    (g, r) => {
      const BR = C.brass,
        Y = hex('#c8b040');
      for (const x of [4, 8]) {
        g.limb([[x, 13], [x + (x < 6 ? -1 : 1), 16], [x, 18]], hex('#6a5a3a'));
        g.pts([[x - 1, 18], [x + 1, 18]], hex('#6a5a3a'));
      }
      g.set(6, 0, BR);
      g.frame(5, 0, 7, 1, BR);
      g.clear(6, 1);
      if (!r) {
        g.oval(5, 7, 8, 10, Y);
        g.set(9, 8, C.flame);
        g.set(7, 8, K);
        g.row(11, 3, 9, C.woodLight);
      } else {
        g.oval(2, 3, 10, 12, Y);
        g.orb(4, 5, 8, 9, P.RED);
        g.pts([[0, 6], [-1, 7], [0, 9], [12, 6], [13, 8], [12, 9]], Y);
        g.pts([[11, 11], [12, 12]], C.flame);
      }
      for (const x of [2, 4, 6, 8, 10]) g.col(x, 3, 12, BR);
      g.row(13, 2, 10, BR);
      g.row(2, 3, 9, BR);
      g.pts([[2, 2], [10, 2]], null);
      if (r) g.orb(5, 6, 7, 8, P.RED);
    },
    {},
  );

  return out;
};
