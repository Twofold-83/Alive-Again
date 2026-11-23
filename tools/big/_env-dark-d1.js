/* Dream world, part 1: the sky's furniture, the giant small things, the chess set. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, dots, part, turn, thin, ring, cloud, star, shadowed } = H;
  const CLD = hex('#cfcdc6'),
    NI = C.night,
    SKY = hex('#27304e'),
    MOON = hex('#e0d8a8'),
    MOONd = hex('#b3a877'),
    OUT = hex('#4a5068'),
    LILAC = hex('#8a7a9c'),
    ROSE = hex('#b08a8f'),
    DBLUE = hex('#5a6a84'),
    PORC = hex('#d6d0be'),
    TEA = hex('#7a5230'),
    BR = hex('#9a7a54'),
    W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    WP = C.woodPale,
    GRASS = hex('#55684a');
  const sky = (c, x0, y0, x1, y1, seed = 1) => {
    const r = rnd(seed);
    c.rect(x0, y0, x1, y1, SKY);
    for (let i = 0; i < ((x1 - x0) * (y1 - y0)) / 24; i++) c.set(x0 + ((r() * (x1 - x0 + 1)) | 0), y0 + ((r() * (y1 - y0 + 1)) | 0), i % 3 ? MOON : C.white);
  };

  O('bed-on-cloud', 'bed on a cloud floating iron bedstead lilac blanket sleep dream sky', {
    w: 44,
    h: 30,
    uh: 40,
    base: 'side',
    f(c, u) {
      const b = 28;
      cloud(c, 1, 17, 42, b, CLD, 3);
      c.rect(6, 4, 7, 20, C.iron);
      c.col(6, 4, 20, L(C.iron));
      c.set(6, 3, C.brass);
      c.rect(36, 9, 37, 20, C.iron);
      c.set(36, 8, C.brass);
      c.row(16, 8, 35, C.iron);
      c.rect(8, 13, 35, 15, C.white);
      c.row(15, 8, 35, D(C.white));
      c.rect(9, 11, 14, 12, C.white); // pillow
      c.row(12, 9, 14, D(C.white));
      if (!u) {
        c.rect(16, 12, 35, 15, LILAC);
        c.row(12, 16, 35, L(LILAC));
        c.rect(15, 12, 16, 13, C.white);
        c.rect(30, 16, 35, 17, D(LILAC));
      } else {
        c.rect(26, 10, 35, 15, LILAC); // thrown back in a heap
        c.row(10, 27, 33, L(LILAC));
        c.rect(27, 16, 35, 18, D(LILAC));
        c.line(26, 11, 29, 14, D(LILAC));
        c.set(11, 11, D(C.white));
        c.set(12, 11, D(C.white));
      }
      cloud(c, 3, 19, 20, b - 2, CLD, 9);
      cloud(c, 22, 20, 40, b - 1, CLD, 5);
      return () => {
        if (!u) return;
        // it has risen: thin wisps and stars under it
        dots(c, CLD, [8, 31, 9, 31, 10, 32, 30, 31, 31, 32, 20, 33, 21, 33, 14, 36, 27, 35]);
        star(c, 12, 34, MOON, true);
        star(c, 33, 36, MOON);
        star(c, 24, 38, C.white);
        star(c, 5, 37, MOON);
      };
    },
    sw: 24,
    sh: 34,
    suh: 44,
    s(c, u) {
      const b = 32;
      c.col(3, 2, 18, C.iron);
      c.col(20, 2, 18, C.iron);
      c.row(3, 3, 20, C.iron);
      c.row(8, 3, 20, D(C.iron));
      for (let x = 6; x <= 18; x += 3) c.col(x, 4, 14, D(C.iron));
      c.set(3, 1, C.brass);
      c.set(20, 1, C.brass);
      c.rect(4, 12, 19, 24, C.white);
      c.rect(6, 13, 17, 15, C.white);
      c.row(16, 6, 17, D(C.white));
      if (!u) {
        c.rect(4, 18, 19, 24, LILAC);
        c.row(18, 4, 19, L(LILAC));
        c.row(17, 4, 19, C.white);
      } else {
        c.poly([[4, 17], [15, 17], [4, 24]], C.white);
        c.poly([[16, 18], [5, 24], [19, 24], [19, 18]], LILAC);
        c.line(16, 17, 5, 24, D(LILAC));
        dots(c, D(C.white), [6, 19, 8, 18, 10, 19, 7, 21]);
      }
      c.col(3, 19, 26, C.iron);
      c.col(20, 19, 26, C.iron);
      c.row(22, 3, 20, C.iron);
      if (!u) c.rect(4, 23, 19, 25, D(LILAC));
      else c.rect(4, 23, 19, 25, D(C.white));
      c.row(22, 3, 20, C.iron);
      cloud(c, 1, 23, 22, b, CLD, 4);
      cloud(c, 3, 25, 13, b - 1, CLD, 8);
      return () => {
        if (!u) return;
        dots(c, CLD, [6, 35, 7, 35, 16, 36, 17, 36, 11, 38]);
        star(c, 8, 39, MOON, true);
        star(c, 18, 41, MOON);
        star(c, 3, 42, C.white);
      };
    },
  });

  O('door-in-sky', 'door in the sky standing on a cloud blue door opens onto stars night', {
    w: 22,
    h: 46,
    uw: 30,
    f(c, u) {
      const b = 44;
      c.rect(3, 2, 18, 39, WP);
      c.col(3, 2, 39, L(WP));
      c.row(2, 3, 18, L(WP));
      if (!u) {
        c.rect(5, 4, 16, 39, DBLUE);
        c.col(5, 4, 39, L(DBLUE));
        for (const [y0, y1] of [[6, 18], [22, 36]]) {
          c.frame(7, y0, 14, y1, D(DBLUE));
          c.row(y1, 7, 14, L(DBLUE));
        }
        c.rect(14, 20, 15, 21, C.brass);
        c.set(15, 23, NI);
      } else {
        sky(c, 5, 4, 16, 39, 6);
        c.oval(8, 8, 12, 12, MOON);
        c.oval(10, 8, 13, 11, SKY);
        c.poly([[19, 3], [25, 1], [25, 42], [19, 39]], DBLUE); // the door, swung out
        c.col(19, 3, 39, L(DBLUE));
        c.col(25, 1, 42, D(DBLUE));
        c.col(22, 6, 36, D(DBLUE));
        c.set(23, 21, C.brass);
      }
      cloud(c, 1, 36, 20, b, CLD, 2);
      if (u) cloud(c, 17, 38, 27, b, CLD, 6);
      return () => u && (star(c, 3, 30, MOON), star(c, 1, 24, C.white), star(c, 2, 14, MOON, true), star(c, 27, 30, MOON), dots(c, MOON, [9, 40, 12, 41]));
    },
    sw: 12,
    suw: 26,
    s(c, u) {
      const b = 44;
      c.rect(4, 2, 7, 39, WP);
      c.col(4, 2, 39, L(WP));
      c.col(7, 3, 39, D(WP));
      if (!u) {
        c.col(8, 4, 39, DBLUE);
        c.set(9, 20, C.brass);
      } else {
        c.rect(8, 4, 19, 39, DBLUE); // the door stands out
        c.col(19, 4, 39, D(DBLUE));
        for (const [y0, y1] of [[6, 18], [22, 36]]) c.frame(10, y0, 17, y1, D(DBLUE));
        c.rect(17, 20, 18, 21, C.brass);
        cloud(c, 9, 38, 22, b, CLD, 6);
      }
      cloud(c, 1, 36, 10, b, CLD, 2);
      return () => u && (star(c, 2, 12, MOON, true), star(c, 1, 22, C.white), star(c, 3, 30, MOON), star(c, 22, 10, MOON));
    },
  });

  const STONE = hex('#a6a39c');
  function step(c, x, y, w, lit) {
    c.rect(x, y, x + w - 1, y + 2, STONE);
    c.row(y, x, x + w - 1, lit ? MOON : L(STONE));
    c.row(y + 2, x, x + w - 1, D(STONE));
    c.row(y + 3, x + 1, x + w - 2, mix(STONE, 0.5));
    dots(c, CLD, [x + 1, y + 5, x + 2, y + 5, x + w - 3, y + 6]);
  }
  O('stairs-floating', 'floating stairs stone steps in the air going up to nothing sky staircase', {
    w: 36,
    h: 42,
    f(c, u) {
      for (let i = 0; i < 5; i++) {
        if (u && i === 4) {
          c.rect(27, 4, 30, 6, STONE); // the top step breaks up
          c.row(4, 27, 30, L(STONE));
          c.rect(32, 7, 33, 8, STONE);
          c.set(31, 11, D(STONE));
          c.set(29, 9, STONE);
          c.set(33, 13, D(STONE));
        } else step(c, 1 + i * 6, 34 - i * 7.5, 9, u);
      }
      return () => u && (star(c, 5, 31, C.white), star(c, 17, 16, C.white), star(c, 30, 1, MOON, true));
    },
    sw: 14,
    s(c, u) {
      for (let i = 0; i < 5; i++) {
        const w = 12 - i,
          x = 1 + (i >> 1) + (i % 2);
        if (u && i === 4) {
          c.rect(4, 4, 6, 6, STONE);
          c.row(4, 4, 6, L(STONE));
          c.rect(8, 7, 9, 8, STONE);
          c.set(7, 11, D(STONE));
        } else step(c, x, 34 - i * 7.5, w, u);
      }
      return () => u && (star(c, 7, 1, MOON, true), star(c, 2, 16, C.white));
    },
  });

  O('moon-on-string', 'moon hanging on a string crescent paper moon with little stars mobile', {
    w: 18,
    h: 34,
    solid: false,
    f(c, u) {
      const m = u ? OUT : MOON,
        md = u ? D(OUT) : MOONd;
      thin(c, 9, 1, 12, CLD);
      thin(c, 3, 1, 6, CLD);
      thin(c, 15, 1, 20, CLD);
      c.oval(3, 13, 14, 26, m);
      for (let y = 13; y <= 26; y++) for (let x = 3; x <= 14; x++) if (((x - 11.5) / 5) ** 2 + ((y - 18.5) / 5.6) ** 2 <= 1) c.clear(x, y);
      c.col(4, 16, 23, u ? m : L(MOON));
      dots(c, md, [6, 15, 5, 20, 7, 24, 9, 25]);
      c.row(19, 6, 7, u ? NI : md); // a sleeping eye
      c.set(8, 22, u ? NI : md);
      const st = u ? D(OUT) : C.glow;
      star(c, 3, 8, st, true);
      star(c, 15, 22, st, true);
      return () => {
        if (u) dots(c, C.ash, [9, 28, 10, 30, 9, 32]);
        else dots(c, MOON, [1, 20, 15, 14, 12, 28]);
      };
    },
    sw: 10,
    s(c, u) {
      const m = u ? OUT : MOON;
      thin(c, 4, 1, 12, CLD);
      thin(c, 7, 1, 20, CLD);
      c.rect(3, 13, 5, 26, m);
      c.col(3, 13, 26, u ? m : L(MOON));
      c.col(5, 14, 25, u ? D(OUT) : MOONd);
      c.col(7, 21, 23, u ? D(OUT) : C.glow);
      return () => {
        if (u) dots(c, C.ash, [4, 28, 5, 30]);
        else dots(c, MOON, [1, 18, 8, 15]);
      };
    },
  });

  O('ladder-to-nowhere', 'ladder to nowhere wooden ladder up into a cloud sky climbing', {
    w: 18,
    h: 62,
    f(c, u) {
      const b = 60,
        low = u ? b - 12 : b;
      c.col(5, 8, low, WL);
      c.col(12, 8, low, W);
      for (let y = 12; y <= low - 2; y += 5) c.row(y, 6, 11, y % 2 ? W : WL);
      if (u) dots(c, WL, [5, b - 10, 5, b - 7, 12, b - 9, 5, b - 3, 12, b - 5, 12, b - 1]); // the foot of it is going
      cloud(c, 1, 1, 16, 11, u ? blend(CLD, MOON, 0.5) : CLD, 3);
      return () => {
        if (!u) return;
        for (let y = 13; y <= 40; y += 4) c.set(8 + ((y >> 2) % 2), y, MOON);
        star(c, 2, 16, MOON, true);
        star(c, 15, 24, C.white);
        star(c, 9, 46, MOON);
      };
    },
    sw: 14,
    s(c, u) {
      const b = 60,
        low = u ? b - 12 : b;
      for (let y = 8; y <= low; y++) {
        const x = 4 + Math.round(((y - 8) * 6) / (b - 8));
        c.set(x, y, WL);
        c.set(x + 1, y, W);
        if ((y - 12) % 5 === 0) c.set(x + 2, y, WD);
      }
      if (u) dots(c, WL, [9, b - 9, 10, b - 5, 10, b - 1]);
      cloud(c, 1, 1, 12, 11, u ? blend(CLD, MOON, 0.5) : CLD, 3);
      return () => u && (star(c, 2, 18, MOON, true), star(c, 11, 28, C.white));
    },
  });

  /* ---------- giant small things ---------- */
  O('alarm-clock-giant', 'giant alarm clock twin bells brass as tall as a child ringing', {
    w: 26,
    h: 32,
    f(c, u) {
      const b = 30,
        k = u ? 1 : 0;
      c.rect(5 - k, b - 2, 7 - k, b, D(BR)); // feet
      c.rect(18 + k, b - 2, 20 + k, b, D(BR));
      c.oval(2, 8, 23, 29, BR);
      ring(c, 2, 8, 23, 29, D(BR));
      c.oval(4, 10, 21, 27, PORC);
      c.set(6, 13, C.white);
      for (let a = 0; a < 12; a++) c.set(12.5 + 7 * Math.sin((a * Math.PI) / 6), 18.5 - 7 * Math.cos((a * Math.PI) / 6), a % 3 ? D(PORC) : NI);
      c.line(12, 18, u ? 17 : 12, u ? 15 : 12, NI);
      c.line(12, 18, u ? 9 : 16, u ? 14 : 20, NI);
      c.rect(12, 18, 13, 19, C.blood);
      // the bells and the hammer
      c.oval(2 - k, 3 - k, 10 - k, 9 - k, L(BR));
      c.oval(15 + k, 3 - k, 23 + k, 9 - k, BR);
      c.rect(3 - k, 8 - k, 9 - k, 9 - k, D(BR));
      c.rect(16 + k, 8 - k, 22 + k, 9 - k, D(BR));
      c.rect(11, 1, 14, 2, D(BR));
      c.col(u ? 10 : 12, 3, 7, NI);
      c.rect(u ? 9 : 12, 3, u ? 10 : 13, 4, C.iron);
      return () => u && dots(c, C.ash, [0, 1, 1, 0, 25, 1, 24, 0, 0, 14, 25, 16, 0, 22, 25, 24, 12, 0]);
    },
    sw: 14,
    s(c, u) {
      const b = 30,
        k = u ? 1 : 0;
      c.rect(4, b - 2, 5, b, D(BR));
      c.rect(9, b - 2, 10, b, D(BR));
      c.rect(3, 9, 10, 28, BR);
      c.col(3, 9, 28, L(BR));
      c.rect(4, 8, 9, 8, BR);
      c.rect(4, 29, 9, 29, D(BR));
      c.col(11, 11, 26, PORC); // the glass, bulging
      c.col(10, 10, 27, D(BR));
      c.rect(1, 17, 2, 19, C.iron); // the key in its back
      c.set(1, 16, C.iron);
      c.set(1, 20, C.iron);
      c.oval(3 - k, 3 - k, 10 + k, 9 - k, L(BR));
      c.rect(4, 8 - k, 9, 9 - k, D(BR));
      c.rect(6, 1, 7, 2, D(BR));
      return () => u && dots(c, C.ash, [0, 2, 1, 0, 13, 1, 12, 0, 13, 14, 0, 24, 13, 22]);
    },
  });

  O('clock-melting-branch', 'melting clock draped over a dead branch soft watch surreal time', {
    w: 32,
    h: 36,
    f(c, u) {
      const b = 34;
      c.rect(3, 6, 6, b, WD); // the trunk and its bough
      c.col(3, 6, b, W);
      c.rect(2, b - 1, 8, b, WD);
      c.line(5, 6, 3, 2, WD);
      c.rect(6, 11, 27, 12, WD);
      c.row(11, 6, 27, W);
      c.line(27, 11, 30, 8, WD);
      c.line(19, 11, 21, 7, WD);
      if (!u) {
        c.rect(11, 9, 22, 12, PORC); // lying over the bough
        c.poly([[11, 12], [22, 12], [23, 20], [21, 26], [17, 23], [14, 28], [11, 22]], PORC);
        c.row(9, 12, 21, L(PORC));
        c.frame(11, 9, 22, 12, BR);
        c.line(11, 12, 11, 22, BR);
        c.line(23, 13, 23, 20, BR);
        dots(c, NI, [13, 11, 16, 10, 20, 11, 13, 16, 20, 15, 14, 22, 20, 21]);
        c.line(16, 14, 17, 19, NI);
        c.line(16, 14, 19, 16, NI);
        c.col(14, 28, 30, PORC);
        c.col(21, 26, 27, PORC);
      } else {
        c.rect(13, 12, 15, 12, PORC); // only threads of it are left up there
        c.col(14, 13, 22, PORC);
        c.col(19, 13, 16, PORC);
        c.set(14, 23, D(PORC));
        c.oval(9, b - 3, 26, b, PORC); // and a pool of clock below
        ring(c, 9, b - 3, 26, b, BR);
        dots(c, NI, [12, b - 1, 16, b - 2, 21, b - 2, 23, b - 1, 18, b]);
        c.line(17, b - 1, 20, b - 1, NI);
        c.set(15, b, NI);
      }
    },
    sw: 14,
    s(c, u) {
      const b = 34;
      c.rect(5, 6, 8, b, WD);
      c.col(5, 6, b, W);
      c.rect(4, b - 1, 10, b, WD);
      c.line(7, 6, 5, 2, WD);
      c.oval(5, 10, 8, 13, W); // the bough, end on
      c.set(6, 11, WD);
      if (!u) {
        c.rect(4, 8, 9, 10, PORC);
        c.rect(3, 10, 4, 24, PORC);
        c.rect(9, 10, 10, 20, PORC);
        c.row(8, 4, 9, BR);
        c.col(3, 24, 27, PORC);
        c.col(10, 20, 22, D(PORC));
        c.col(3, 10, 24, L(PORC));
      } else {
        c.col(4, 12, 20, PORC);
        c.oval(1, b - 3, 12, b, PORC);
        ring(c, 1, b - 3, 12, b, BR);
        dots(c, NI, [4, b - 1, 8, b - 2, 6, b]);
      }
    },
  });

  const GOLD = hex('#a88c48');
  O('key-giant-standing', 'giant key standing upright old brass key as tall as a person', {
    w: 16,
    h: 42,
    f(c, u) {
      const b = 40,
        s = u ? -1 : 1,
        X = (x) => (u ? 15 - x : x);
      ring(c, 3, 2, 12, 13, GOLD);
      ring(c, 4, 3, 11, 12, GOLD);
      c.oval(6, 5, 9, 10, null);
      c.set(X(4), 5, L(GOLD));
      c.set(X(5), 4, L(GOLD));
      c.rect(6, 13, 9, 15, GOLD);
      c.rect(7, 16, 8, b, GOLD);
      c.col(u ? 8 : 7, 16, b, L(GOLD));
      c.row(18, 6, 9, D(GOLD));
      for (const y of [30, 34, 37]) {
        const x0 = Math.min(X(9), X(y === 34 ? 11 : 12)),
          x1 = Math.max(X(9), X(y === 34 ? 11 : 12));
        c.rect(x0, y, x1, y + 1, GOLD);
        c.row(y + 1, x0, x1, D(GOLD));
      }
      void s;
      return () => {
        if (!u) return;
        star(c, 1, 3, MOON, true);
        star(c, 14, 16, C.white);
        star(c, 13, 27, MOON);
        dots(c, MOON, [7, b + 1, 8, b + 1, 6, b + 1, 9, b + 1]); // light from an unseen lock
      };
    },
    sw: 8,
    s(c, u) {
      const b = 40;
      c.rect(3, 2, 4, b, GOLD);
      c.col(3, 2, b, L(GOLD));
      c.set(3, 18, D(GOLD));
      c.set(4, 18, D(GOLD));
      if (u) c.rect(2, 30, 5, 38, GOLD), c.col(5, 30, 38, D(GOLD)); // the bit has turned to face us
      return () => u && (star(c, 6, 5, MOON, true), dots(c, MOON, [3, b + 1, 4, b + 1]));
    },
  });

  O('keyhole-standing-field', 'keyhole standing in a field giant keyhole shaped opening grass night eye', {
    w: 20,
    h: 40,
    f(c, u) {
      const b = 38,
        fill = u ? MOON : NI;
      c.oval(3, 2, 16, 15, BR);
      c.poly([[7, 12], [12, 12], [16, b - 2], [3, b - 2]], BR);
      c.oval(5, 4, 14, 13, fill);
      c.poly([[8, 12], [11, 12], [14, b - 3], [5, b - 3]], fill);
      c.col(3, 6, 11, L(BR));
      if (!u) {
        star(c, 9, 7, MOON, true);
        star(c, 12, 25, C.white);
        star(c, 8, 30, MOON);
      } else {
        c.oval(6, 5, 13, 12, C.white); // an eye fills it
        c.oval(8, 6, 12, 11, hex('#5a7a78'));
        c.rect(9, 7, 11, 10, NI);
        c.set(9, 7, C.white);
        c.row(4, 7, 12, D(MOON));
      }
      for (let x = 1; x <= 18; x += 2) c.col(x, b - 2 - ((x * 7) % 3), b, x % 4 === 1 ? GRASS : D(GRASS));
      c.row(b, 1, 18, D(GRASS));
      return () => u && dots(c, MOON, [0, 20, 19, 24, 1, 30, 18, 14]);
    },
    sw: 10,
    suw: 16,
    s(c, u) {
      const b = 38;
      c.rect(4, 2, 5, b - 2, BR);
      c.col(4, 2, b - 2, L(BR));
      for (let x = 1; x <= 8; x += 2) c.col(x, b - 2 - ((x * 7) % 3), b, x % 4 === 1 ? GRASS : D(GRASS));
      c.row(b, 1, 8, D(GRASS));
      return () => {
        if (!u) return;
        for (let x = 6; x <= 14; x += 2) c.set(x, 8 + ((x - 6) >> 2), MOON), c.set(x + 1, 22 + ((x - 6) >> 1), MOON);
        dots(c, C.white, [7, 12, 10, 16, 13, 20]);
      };
    },
  });

  const cup = (side) => (c, u) => {
    const b = 24;
    c.rect(2, b - 2, 27, b - 1, PORC); // saucer
    c.row(b - 2, 2, 27, L(PORC));
    c.rect(6, b, 23, b, D(PORC));
    c.poly([[5, 7], [22, 7], [20, b - 5], [17, b - 3], [10, b - 3], [7, b - 5]], PORC);
    c.oval(5, 4, 22, 10, PORC);
    c.oval(7, 5, 20, 9, TEA);
    c.row(6, 9, 13, L(TEA));
    c.line(5, 8, 7, b - 5, L(PORC));
    for (let x = 7; x <= 20; x += 3) c.set(x, 13, DBLUE), c.set(x + 1, 14, DBLUE), c.set(x, 15, DBLUE);
    c.row(17, 7, 20, DBLUE);
    if (side) {
      ring(c, 11, 11, 16, 19, D(PORC)); // the handle, toward us
      c.rect(12, 12, 15, 18, PORC);
      c.col(12, 12, 18, L(PORC));
    } else {
      ring(c, 21, 10, 27, 17, PORC);
      ring(c, 22, 11, 26, 16, D(PORC));
    }
    if (u) {
      c.oval(6, 4, 21, 9, TEA); // it brims and runs over
      c.row(5, 8, 14, L(TEA));
      for (const [x, n] of [[6, 9], [9, 12], [14, 6], [18, 11], [21, 5]]) c.col(x, 9, 9 + n, TEA);
      c.row(b - 2, 5, 24, TEA);
      c.poly([[11, 5], [15, 5], [13, 2]], C.paper); // a paper boat sails on it
      c.row(6, 10, 16, C.white);
    }
    return () => {
      if (u) return void (c.row(b + 1, 1, 18, TEA), c.set(20, b + 1, TEA), c.set(0, b, TEA));
      dots(c, CLD, [11, 2, 12, 1, 15, 2, 16, 0]);
    };
  };
  O('teacup-giant', 'giant teacup on a saucer porcelain tea steaming as big as a table overflowing', {
    w: 30,
    h: 27,
    f: cup(false),
    sw: 30,
    s: cup(true),
  });

  /* ---------- the chess set ---------- */
  function lathe(c, cx, y0, prof, col) {
    prof.forEach((hw, i) => {
      const y = y0 + i;
      c.row(y, cx - hw, cx + hw - 1, col);
      c.set(cx - hw, y, L(col));
      if (hw > 2) c.set(cx - hw + 1, y, L(col));
      c.set(cx + hw - 1, y, D(col));
    });
  }
  const IVORY = hex('#cfc6a8'),
    EBONY = hex('#3a343c');
  const PAWN = [2, 3, 4, 4, 4, 4, 3, 2, 4, 5, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 3, 6, 6, 6];
  const pawn = (alt) => (c, u) => {
    if (!u) {
      lathe(c, 8, 3, PAWN, IVORY);
      if (alt) c.line(9, 6, 10, 9, D(IVORY));
      return;
    }
    const t = part(14, PAWN.length, (t) => lathe(t, 7, 0, PAWN, IVORY)); // toppled
    if (alt) {
      c.oval(2, 2, 13, 13, IVORY); // rolling toward us: its round foot
      ring(c, 2, 2, 13, 13, D(IVORY));
      ring(c, 5, 5, 10, 10, D(IVORY));
      c.set(4, 4, L(IVORY));
      return;
    }
    c.stamp(turn(t, true), 1, 1);
    return () => dots(c, C.ash, [30, 14, 31, 13]);
  };
  O('chess-pawn-tall', 'chess pawn as tall as a child ivory white giant chess piece', {
    w: 16,
    h: 33,
    uw: 30,
    uh: 16,
    f: pawn(false),
    sw: 16,
    suw: 16,
    suh: 16,
    s: pawn(true),
  });
  const BASE = [2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 3, 6, 7, 7];
  O('chess-knight-tall', 'chess knight as tall as a person black horse head giant chess piece', {
    w: 18,
    h: 40,
    f(c, u) {
      const b = 38;
      lathe(c, 9, b - 13, BASE, EBONY);
      c.poly([[5, b - 13], [5, 14], [8, 6], [11, 4], [13, 9], [16, 14], [16, 18], [12, 18], [12, b - 13]], EBONY); // the head, looking right
      c.line(5, 14, 8, 6, L(EBONY));
      c.line(5, 15, 5, b - 14, L(EBONY));
      c.poly([[8, 6], [9, 2], [11, 5]], EBONY); // ear
      for (let y = 8; y <= 22; y += 3) c.set(6, y, D(EBONY)), c.set(7, y + 1, D(EBONY)); // mane
      c.set(12, 10, u ? C.red : C.bone); // the eye
      c.set(15, 16, NI);
      if (u) {
        c.rect(13, 18, 16, 19, EBONY); // the jaw drops
        c.row(18, 13, 15, C.bone);
        c.set(12, 9, C.red);
      }
      return () => u && dots(c, C.ash, [17, 12, 17, 15]);
    },
    sw: 16,
    s(c, u) {
      const b = 38;
      lathe(c, 8, b - 13, BASE, EBONY);
      c.poly([[5, b - 13], [4, 14], [5, 6], [10, 6], [11, 14], [10, b - 13]], EBONY); // face on
      c.poly([[5, 6], [5, 2], [7, 5]], EBONY);
      c.poly([[10, 6], [10, 2], [8, 5]], EBONY);
      c.col(4, 8, b - 14, L(EBONY));
      c.rect(6, 14, 9, 19, D(EBONY)); // the long nose
      c.col(6, 14, 19, EBONY);
      dots(c, NI, [6, 19, 9, 19]);
      c.set(5, 10, u ? C.red : C.bone);
      c.set(10, 10, u ? C.red : C.bone);
      if (u) c.row(20, 6, 9, C.bone), c.rect(6, 21, 9, 21, NI);
    },
  });
  const QUEEN = [1, 1, 2, 4, 4, 3, 3, 4, 5, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 7, 3, 7, 7, 7];
  const queen = (alt) => (c, u) => {
    lathe(c, 8, 6, QUEEN, IVORY);
    for (const x of [4, 7, 10]) c.col(x, 7, 8, IVORY); // the crown's points
    c.rect(7, 3, 8, 5, IVORY);
    c.set(7, 2, u ? C.flame : C.gold);
    if (alt) c.line(9, 22, 10, 30, D(IVORY));
    if (!u) return;
    // she cracks, and the night is inside
    c.poly(alt ? [[9, 14], [10, 20], [8, 26], [10, 33], [9, 36], [7, 28], [8, 20]] : [[7, 14], [9, 19], [6, 25], [8, 30], [7, 36], [5, 30], [6, 22]], SKY);
    dots(c, MOON, alt ? [9, 19, 8, 27, 9, 33] : [7, 18, 6, 26, 7, 32]);
    c.col(alt ? 9 : 6, 10, 13, NI);
    return () => (star(c, 1, 12, MOON, true), star(c, 14, 20, C.white), c.set(8, 1, C.flameLight));
  };
  O('chess-queen-tall', 'chess queen taller than a person ivory white crown giant chess piece cracked', {
    w: 16,
    h: 44,
    f: queen(false),
    sw: 16,
    s: queen(true),
  });
};
