/* Nightmare, part 2: the bedroom and the house that is almost yours. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, thin, drip, pool, bars, ring, eyes, planks, shade } = H;
  const { NI, SHEET, SHEETD, PJ, SHADOW, SKIN, SICK, DWATER, WALLP, LINO, SCREEN, CARP } = P;
  const IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    BR = C.brass,
    EYE = hex('#e8e4d0'),
    GLASSD = hex('#2a3442'),
    GLASSL = hex('#51627a'),
    PAPER = C.paper;

  /* ---------- the bed with something under it ---------- */
  O('nightmare-bed-something-under', 'bed with something under it single bed blue blanket dark underneath eyes hand monster under the bed', {
    w: 40,
    h: 22,
    base: 'side',
    f(c, u) {
      const b = 20;
      c.rect(5, 15, 34, 19, SHADOW);
      eyes(c, 16, 17, u ? EYE : hex('#8a8878'), 3);
      c.rect(2, 3, 4, b, W);
      c.col(2, 3, b, WL);
      c.row(3, 2, 4, WL);
      c.rect(35, 9, 37, b, W);
      c.col(35, 9, b, WL);
      c.rect(5, 13, 34, 14, W);
      c.row(13, 5, 34, WL);
      c.rect(5, 10, 34, 12, SHEET);
      c.rect(6, 8, 11, 9, C.white);
      c.row(10, 6, 11, SHEETD);
      if (!u) {
        c.rect(13, 8, 34, 12, PJ);
        c.row(8, 13, 34, L(PJ));
        c.col(13, 8, 12, L(PJ));
        for (let x = 14; x <= 34; x += 2) c.set(x, 13, PJ);
        dots(c, D(PJ), [18, 10, 24, 11, 29, 10]);
      } else {
        c.rect(24, 6, 34, 12, PJ); // thrown back in a heap
        c.row(6, 25, 33, L(PJ));
        c.rect(26, 5, 31, 5, PJ);
        dots(c, D(PJ), [26, 8, 29, 9, 32, 8, 27, 11]);
        c.col(34, 13, 16, PJ);
        c.col(33, 13, 15, D(PJ));
        dots(c, SHEETD, [14, 11, 17, 10, 20, 11]);
      }
      return () => {
        if (!u) return;
        c.row(b, 20, 29, SKIN); // an arm comes out along the floor
        c.row(b - 1, 20, 24, D(SKIN));
        dots(c, SKIN, [30, b - 1, 31, b, 30, b + 1 - 1, 31, b - 2]);
      };
    },
    sw: 18,
    sh: 34,
    s(c, u) {
      const b = 32;
      c.rect(2, 2, 15, 11, W);
      c.row(2, 2, 15, WL);
      c.col(2, 2, 11, WL);
      c.frame(4, 4, 13, 9, WD);
      c.rect(3, 10, 14, 26, SHEET);
      c.rect(5, 10, 12, 12, C.white);
      c.row(13, 5, 12, SHEETD);
      if (!u) {
        c.rect(3, 15, 14, 26, PJ);
        c.row(15, 3, 14, L(PJ));
        dots(c, D(PJ), [6, 19, 10, 22, 8, 24]);
      } else {
        c.poly([[3, 26], [3, 20], [14, 15], [14, 26]], PJ);
        c.line(3, 20, 14, 15, L(PJ));
        c.rect(10, 13, 14, 15, PJ);
        dots(c, SHEETD, [5, 16, 8, 15, 6, 18]);
      }
      c.rect(2, 26, 15, 29, W);
      c.row(26, 2, 15, WL);
      c.rect(3, 30, 14, b, SHADOW);
      c.rect(2, 30, 2, b, WD);
      c.rect(15, 30, 15, b, WD);
      eyes(c, 7, 31, u ? EYE : hex('#8a8878'), 3);
      return () => u && dots(c, SKIN, [5, b, 6, b, 5, b + 1, 4, b]);
    },
  });

  /* ---------- the wardrobe ---------- */
  O('nightmare-wardrobe-ajar-eyes', 'wardrobe with the door ajar and eyes inside dark closet something watching from the cupboard', {
    w: 24,
    h: 42,
    uw: 30,
    f(c, u) {
      const b = 40;
      c.rect(2, 4, 21, b - 2, WD);
      c.rect(1, 2, 22, 4, W);
      c.row(2, 1, 22, WL);
      c.rect(3, 6, 11, b - 3, W);
      c.col(3, 6, b - 3, WL);
      c.frame(5, 9, 9, 22, WD);
      c.frame(5, 25, 9, b - 6, WD);
      c.set(10, 22, BR);
      c.rect(2, b - 1, 4, b, WD);
      c.rect(19, b - 1, 21, b, WD);
      if (!u) {
        c.rect(12, 6, 13, b - 3, SHADOW); // the gap
        c.rect(14, 6, 20, b - 3, W);
        c.col(14, 6, b - 3, WL);
        c.frame(15, 9, 19, 22, WD);
        c.frame(15, 25, 19, b - 6, WD);
        c.set(15, 23, BR);
        c.set(13, 14, EYE);
        c.set(12, 14, hex('#8a8878'));
      } else {
        c.rect(12, 6, 20, b - 3, SHADOW);
        c.row(7, 12, 20, ST); // the rail and what hangs on it
        for (const [x, col] of [[13, hex('#5a4a52')], [18, hex('#4a5648')]]) {
          c.rect(x, 9, x + 2, 26, col);
          c.set(x + 1, 8, ST);
        }
        // and who stands between the coats
        c.rect(15, 10, 17, 13, hex('#2a2430'));
        c.rect(15, 14, 17, 34, hex('#2a2430'));
        eyes(c, 15, 11, EYE, 2);
        c.col(12, 18, 21, SKIN); // fingers on the frame
        c.rect(22, 6, 28, b - 3, W); // the door swung wide
        c.col(22, 6, b - 3, WD);
        c.frame(23, 9, 27, 22, WD);
        c.frame(23, 25, 27, b - 6, WD);
      }
    },
    sw: 12,
    suw: 18,
    s(c, u) {
      const b = 40;
      c.rect(2, 4, 9, b - 2, W);
      c.col(2, 4, b - 2, WL);
      c.rect(1, 2, 10, 4, W);
      c.row(2, 1, 10, WL);
      c.frame(4, 8, 7, b - 6, WD);
      c.rect(2, b - 1, 3, b, WD);
      c.rect(8, b - 1, 9, b, WD);
      if (!u) {
        c.col(10, 6, b - 3, WD);
        c.set(10, 14, EYE);
      } else {
        c.rect(10, 6, 16, b - 3, W); // the door towards you
        c.col(10, 6, b - 3, WL);
        c.frame(11, 9, 15, 22, WD);
        c.frame(11, 25, 15, b - 6, WD);
        c.set(16, 22, BR);
        c.col(9, 6, b - 3, SHADOW);
        c.rect(10, 18, 10, 21, SKIN);
      }
    },
  });

  /* ---------- the door to the endless corridor ---------- */
  O('nightmare-door-endless-corridor', 'door to an endless corridor plain numbered door opens on a hallway that goes on for ever', {
    w: 22,
    h: 42,
    f(c, u) {
      const b = 40;
      c.rect(1, 2, 20, b, hex('#8a8474'));
      c.row(2, 1, 20, hex('#a39c88'));
      c.col(1, 2, b, hex('#a39c88'));
      if (!u) {
        c.rect(3, 4, 18, b, hex('#6c7466'));
        c.col(3, 4, b, hex('#868e7e'));
        c.frame(5, 7, 16, 20, hex('#59614f'));
        c.frame(5, 23, 16, b - 3, hex('#59614f'));
        c.rect(10, 9, 11, 11, BR); // a number, worn off
        c.set(16, 22, BR);
        c.set(16, 23, D(BR));
        c.row(b, 4, 17, hex('#d8cf8a')); // light under it
      } else {
        // walls closing to a point of light, very far
        const cols = [hex('#7d7460'), hex('#6a6252'), hex('#565042'), hex('#423e34'), hex('#302c28'), hex('#201c1e')];
        cols.forEach((col, i) => {
          c.rect(3 + i, 4 + i * 2, 18 - i, b - i * 2, col);
        });
        c.rect(9, 16, 12, 28, NI);
        c.rect(10, 20, 11, 24, hex('#d8cf8a'));
        for (let i = 0; i < 6; i++) c.row(b - i * 2, 3 + i, 18 - i, i % 2 ? hex('#4a4640') : hex('#5c564a'));
        for (let i = 0; i < 5; i++) c.set(10 + (i % 2), 5 + i * 2, hex('#d8cf8a')); // lamps
        c.rect(10, 22, 10, 24, SHADOW); // and someone, at the far end
        c.set(10, 21, SHADOW);
        c.rect(3, 4, 4, b, hex('#6c7466')); // the door, edge on
        c.col(3, 4, b, hex('#868e7e'));
      }
    },
    sw: 8,
    suw: 18,
    s(c, u) {
      const b = 40;
      c.rect(2, 2, 5, b, hex('#8a8474'));
      c.row(2, 2, 5, hex('#a39c88'));
      c.col(2, 2, b, hex('#a39c88'));
      if (!u) c.set(6, 22, BR);
      else {
        c.rect(6, 4, 15, b, hex('#6c7466'));
        c.col(6, 4, b, hex('#868e7e'));
        c.frame(8, 7, 13, 20, hex('#59614f'));
        c.frame(8, 23, 13, b - 3, hex('#59614f'));
        c.set(14, 22, BR);
      }
      return () => {
        if (u) dots(c, hex('#d8cf8a'), [5, 12, 5, 20, 5, 28]);
        else c.set(6, b, hex('#d8cf8a'));
      };
    },
  });

  /* ---------- the too-tall chair ---------- */
  function tallChair(c, u, side) {
    const b = 48;
    if (side) {
      c.rect(3, 3, 4, b, W);
      c.col(3, 3, b, WL);
      c.rect(10, 18, 11, b, W);
      c.rect(3, 17, 11, 18, WL);
      c.row(18, 3, 11, W);
      for (let y = 24; y < b; y += 6) c.row(y, 5, 9, WD);
      c.set(3, 2, WL);
    } else {
      for (const x of [2, 10]) {
        c.rect(x, 3, x + 1, b, W);
        c.col(x, 3, b, WL);
      }
      c.rect(4, 4, 9, 5, W);
      c.rect(4, 9, 9, 10, W);
      for (const x of [5, 8]) c.col(x, 6, 8, WD);
      c.rect(2, 17, 11, 18, WL);
      c.row(18, 2, 11, W);
      for (let y = 24; y < b; y += 6) c.row(y, 4, 9, WD);
    }
    if (u) {
      // a child sits up there, legs swinging
      const S = hex('#2a2430');
      if (side) {
        c.rect(5, 6, 8, 9, S);
        c.rect(5, 10, 8, 16, S);
        c.rect(9, 15, 12, 16, S);
        c.col(12, 17, 22, S);
        c.set(8, 8, EYE);
      } else {
        c.rect(5, 6, 8, 9, S);
        c.rect(4, 10, 9, 16, S);
        c.col(5, 17, 22, S);
        c.col(8, 17, 21, S);
        eyes(c, 5, 8, EYE, 3);
      }
    } else {
      c.rect(side ? 6 : 5, 14, side ? 9 : 8, 16, hex('#8c6f4e')); // a bear, left up there
      c.rect(side ? 7 : 6, 12, side ? 8 : 7, 13, hex('#8c6f4e'));
      c.set(side ? 8 : 6, 13, NI);
    }
    return () => u && (c.rect(side ? 11 : 6, b - 1, side ? 13 : 8, b, hex('#5a2a2e')), c.set(side ? 11 : 6, b - 1, hex('#7a3a3c')));
  }
  O('nightmare-chair-too-tall', 'chair that is much too tall wooden chair on long legs like a ladder high seat', {
    w: 14,
    h: 50,
    f: (c, u) => tallChair(c, u, false),
    sw: 15,
    s: (c, u) => tallChair(c, u, true),
  });

  /* ---------- dinner for nobody ---------- */
  function setting(c, x, y, eaten) {
    c.row(y, x, x + 4, C.white);
    c.row(y + 1, x + 1, x + 3, SHEETD);
    if (eaten) dots(c, hex('#5a3a2e'), [x + 1, y, x + 3, y]);
    c.col(x + 6, y - 3, y, C.glassLight);
    c.set(x + 6, y - 3, eaten ? C.glassLight : C.wine);
  }
  function chairBack(c, x, y) {
    c.rect(x, y, x + 6, y + 1, W);
    c.row(y, x, x + 6, WL);
    c.col(x, y, y + 8, W);
    c.col(x + 6, y, y + 8, WD);
    c.col(x + 3, y + 2, y + 8, WD);
  }
  O('nightmare-dinner-table-nobody', 'dinner table laid for nobody long table white cloth plates glasses candles empty chairs', {
    w: 44,
    h: 26,
    f(c, u) {
      const b = 24;
      chairBack(c, 6, 3);
      chairBack(c, 18, 3);
      u ? chairBack(c, 33, 5) : chairBack(c, 30, 3);
      c.rect(2, 11, 41, 12, C.white);
      c.rect(2, 13, 41, 18, SHEET);
      for (let x = 2; x <= 41; x++) if (x % 5 === 0) c.col(x, 13, 18, SHEETD);
      for (let x = 2; x <= 41; x += 2) c.set(x, 19, SHEET);
      for (const x of [4, 38]) c.rect(x, 19, x + 1, b, WD);
      setting(c, 5, 10, u);
      setting(c, 17, 10, u);
      setting(c, 30, 10, u);
      for (const x of [14, 27]) {
        c.col(x, 6, 10, BR);
        c.col(x, 3, 5, PAPER);
        if (u) {
          c.set(x, 2, C.flame);
          c.set(x, 1, C.flameLight);
        }
        c.set(x - 1, 10, BR);
        c.set(x + 1, 10, BR);
      }
      if (u) {
        c.rect(22, 12, 25, 13, C.wine); // spilt
        c.col(24, 14, 17, C.wine);
        c.set(23, 14, C.wine);
        c.row(10, 37, 40, C.glassLight); // a glass on its side
      }
    },
    sw: 24,
    s(c, u) {
      const b = 24;
      // a chair at each long side, seen from the end
      for (const [x, k] of [[2, 1], [21, -1]]) {
        c.col(x, 3, b, W);
        c.col(x + k, 3, b, WD);
        c.rect(Math.min(x, x + 3 * k), 14, Math.max(x, x + 3 * k), 14, W);
      }
      c.rect(5, 11, 18, 12, C.white);
      c.rect(5, 13, 18, 18, SHEET);
      for (const x of [8, 12, 16]) c.col(x, 13, 18, SHEETD);
      for (let x = 5; x <= 18; x += 2) c.set(x, 19, SHEET);
      for (const x of [7, 15]) c.rect(x, 19, x + 1, b, WD);
      setting(c, 6, 10, u);
      c.row(10, 14, 17, C.white);
      c.col(11, 6, 10, BR);
      c.col(11, 3, 5, PAPER);
      if (u) {
        c.set(11, 2, C.flame);
        c.set(11, 1, C.flameLight);
        c.rect(13, 12, 15, 13, C.wine);
        c.col(14, 14, 17, C.wine);
      }
    },
  });

  /* ---------- the child's drawing ---------- */
  O('nightmare-easel-child-drawing', 'easel with a child drawing crayon picture of a house and family stick figures something added', {
    w: 22,
    h: 38,
    f(c, u) {
      const b = 36;
      c.line(6, 3, 2, b, W);
      c.line(15, 3, 19, b, W);
      c.line(10, 2, 10, b - 4, WD);
      c.rect(2, 25, 19, 26, W);
      c.row(25, 2, 19, WL);
      c.rect(3, 6, 18, 24, PAPER);
      c.row(6, 3, 18, hex('#e4dfd0'));
      c.set(10, 5, IR);
      // a house, a sun, two people
      c.frame(5, 15, 10, 21, C.red);
      c.line(4, 15, 7, 12, C.red);
      c.line(8, 12, 11, 15, C.red);
      c.set(8, 20, C.wood);
      c.set(8, 19, C.wood);
      c.row(22, 4, 17, C.moss);
      c.rect(15, 8, 16, 9, u ? NI : C.mustard);
      if (!u) dots(c, C.mustard, [14, 7, 17, 7, 14, 10, 17, 10]);
      for (const [x, col] of [[12, C.navy], [14, C.plum]]) {
        c.set(x, 17, col);
        c.col(x, 18, 20, col);
        c.set(x, 21, col);
      }
      if (u) {
        // and now a third, very tall, in black
        c.rect(16, 11, 17, 12, NI);
        c.col(16, 13, 21, NI);
        c.col(17, 13, 21, NI);
        dots(c, NI, [15, 14, 14, 15, 18, 14, 15, 13, 18, 13, 13, 16]);
        dots(c, NI, [14, 8, 17, 10, 13, 9, 15, 11]);
      }
      return () => u && (c.rect(13, b - 1, 15, b, NI), c.set(16, b, hex('#3a3440')));
    },
    sw: 14,
    s(c, u) {
      const b = 36;
      c.line(6, 3, 3, b, W);
      c.line(7, 3, 11, b, WD);
      c.line(4, 6, 2, 24, PAPER);
      c.line(5, 6, 3, 24, hex('#e4dfd0'));
      c.rect(1, 25, 3, 26, W);
      c.line(5, 20, 9, 20, IR);
      return () => u && c.rect(0 + 1, b - 1, 2, b, NI);
    },
  });

  /* ---------- the phone ---------- */
  O('nightmare-phone-off-hook', 'telephone off the hook black phone on a hall table receiver dangling on its cord someone is still on the line', {
    w: 18,
    h: 32,
    f(c, u) {
      const b = 30,
        T = hex('#221f28'),
        TL = hex('#45414f');
      c.rect(2, 15, 15, 16, W);
      c.row(15, 2, 15, WL);
      c.rect(3, 17, 14, 19, WD);
      c.set(8, 18, BR);
      for (const x of [3, 13]) c.rect(x, 20, x + 1, b, W);
      c.rect(4, 11, 12, 14, T);
      c.row(10, 5, 11, T);
      c.row(10, 5, 11, TL);
      c.oval(6, 11, 10, 14, hex('#8a8474'));
      c.set(8, 12, T);
      c.rect(5, 8, 6, 9, T);
      c.rect(10, 8, 11, 9, T);
      if (u) {
        c.rect(3, 6, 13, 7, T); // back on its cradle
        c.row(6, 3, 13, TL);
        c.rect(3, 8, 4, 8, T);
        c.rect(12, 8, 13, 8, T);
      } else {
        thin(c, 12, 12, 16, 14, TL);
        for (let y = 15; y <= 23; y++) c.set(16 - (y % 2), y, y % 2 ? T : TL); // the curly cord
        c.rect(15, 24, 16, 29, T);
        c.col(15, 24, 29, TL);
        c.rect(14, 24, 14, 25, T);
        c.rect(14, 28, 14, 29, T);
      }
      return () => {
        if (u) dots(c, PAPER, [1, 5, 2, 3, 15, 5, 14, 3, 1, 9, 15, 9]);
        else dots(c, PAPER, [12, 28, 11, 30, 12, 26]);
      };
    },
    sw: 14,
    s(c, u) {
      const b = 30,
        T = hex('#221f28'),
        TL = hex('#45414f');
      c.rect(2, 15, 11, 16, W);
      c.row(15, 2, 11, WL);
      c.rect(3, 17, 10, 19, WD);
      for (const x of [3, 9]) c.rect(x, 20, x + 1, b, W);
      c.rect(4, 11, 9, 14, T);
      c.row(10, 5, 8, TL);
      c.rect(6, 8, 7, 9, T);
      if (u) {
        c.rect(5, 6, 8, 7, T);
        c.row(6, 5, 8, TL);
      } else {
        for (let y = 13; y <= 23; y++) c.set(11 - (y % 2), y, y % 2 ? T : TL);
        c.rect(10, 24, 11, 29, T);
        c.col(10, 24, 29, TL);
      }
      return () => u && dots(c, PAPER, [3, 5, 4, 3, 10, 5, 9, 3]);
    },
  });

  /* ---------- the mirror that shows another room ---------- */
  O('nightmare-mirror-other-room', 'mirror showing a different room tall looking glass the reflection is somewhere else', {
    w: 20,
    h: 42,
    f(c, u) {
      const b = 40;
      c.rect(2, 2, 17, 35, W);
      c.row(2, 2, 17, WL);
      c.col(2, 2, 35, WL);
      c.rect(4, 4, 15, 33, hex('#4e5f66'));
      // the room in the glass: a wall, a floor, a door standing open
      c.rect(4, 26, 15, 33, hex('#39484e'));
      c.line(4, 26, 15, 24, hex('#2a3a40'));
      c.rect(10, 10, 14, 25, NI);
      c.frame(9, 9, 15, 25, hex('#6f8388'));
      c.rect(5, 8, 7, 12, hex('#6f8388')); // and a picture on its wall
      dots(c, hex('#9ebcc2'), [5, 5, 6, 6, 5, 6]);
      if (u) {
        c.rect(7, 13, 10, 16, SHADOW); // someone has come up to the glass, from the other side
        c.rect(6, 18, 11, 33, SHADOW);
        c.row(17, 7, 10, SHADOW);
        eyes(c, 7, 15, EYE, 2);
        c.rect(12, 20, 12, 22, hex('#8fa3a3')); // a hand flat on it
        c.set(13, 20, hex('#8fa3a3'));
      }
      c.rect(1, 36, 18, 37, W);
      c.line(4, 38, 2, b, W);
      c.line(15, 38, 17, b, WD);
      c.rect(1, b, 4, b, WD);
      c.rect(15, b, 18, b, WD);
    },
    sw: 10,
    s(c, u) {
      const b = 40;
      c.line(5, 2, 4, 35, W);
      c.line(6, 2, 5, 35, WD);
      c.line(4, 2, 3, 35, WL);
      c.line(7, 4, 6, 33, hex('#4e5f66'));
      c.rect(3, 36, 6, 37, W);
      c.line(4, 38, 2, b, W);
      c.line(5, 38, 8, b, WD);
      c.rect(1, b, 3, b, WD);
      c.rect(7, b, 8, b, WD);
      if (u) dots(c, hex('#8fa3a3'), [7, 20, 7, 21]);
    },
  });

  /* ---------- the staircase to nowhere ---------- */
  O('nightmare-staircase-nowhere', 'staircase to nowhere wooden stairs with a red runner that stop in mid air banister', {
    w: 38,
    h: 46,
    base: 'side',
    f(c, u) {
      const b = 44;
      for (let i = 0; i < 9; i++) {
        const x = 2 + i * 4,
          y = b - 3 - i * 4;
        c.rect(x, y, 35, y + 3, i % 2 ? W : hex('#5e3e2b'));
        c.row(y, x, x + 3, CARP);
        c.set(x, y, L(CARP));
        c.col(x, y + 1, y + 3, WD);
      }
      // nothing holds it up: the underside is cut away
      for (let i = 0; i < 9; i++) {
        const x = 2 + i * 4,
          y = b - 3 - i * 4;
        for (let yy = y + 6; yy <= b; yy++) c.clearRect(x + 4 + Math.max(0, 3 - (yy - y - 6)), yy, 35, yy);
      }
      for (let y = 9; y <= 12; y++) for (let x = 34; x <= 35; x++) if ((x + y) % 2) c.clear(x, y);
      // the banister
      c.line(2, b - 14, 34, 1, WL);
      c.line(2, b - 13, 34, 2, WD);
      for (let i = 0; i < 9; i++) c.col(3 + i * 4, b - 12 - i * 4, b - 4 - i * 4, W);
      c.rect(2, b - 16, 3, b - 4, WD);
      if (u) {
        for (let i = 1; i < 9; i += 1) c.set(3 + i * 4 + (i % 2), b - 3 - i * 4, hex('#2a2a26')); // wet prints, going up
        c.rect(34, 8, 35, 8, NI); // and a pair of shoes at the top
        c.set(36, 8, NI);
      }
      return () => u && dots(c, hex('#2a2a26'), [5, b, 8, b - 1 + 1]);
    },
    sw: 20,
    s(c, u) {
      const b = 44;
      for (let i = 0; i < 9; i++) {
        const y = b - 3 - i * 4,
          k = i >> 1;
        c.rect(3 + k, y, 16 - k, y + 3, i % 2 ? W : hex('#5e3e2b'));
        c.row(y, 3 + k, 16 - k, WL);
        c.rect(7, y, 12, y, CARP);
        c.rect(7, y + 1, 12, y + 3, D(CARP));
        if (u && i) c.set(8 + (i % 2) * 2, y, hex('#2a2a26'));
      }
      for (const x of [2, 17]) {
        c.line(x, b - 13, x + (x < 10 ? 4 : -4), 1, WL);
        c.col(x, b - 13, b, WD);
      }
      c.rect(6, 1, 13, 1, WD);
      if (u) {
        c.rect(8, 7, 9, 8, NI);
        c.rect(11, 7, 12, 8, NI);
      }
    },
  });

  /* ---------- a pile of teeth ---------- */
  function teeth(c, u, x1) {
    const b = c.h - 2,
      r = rnd(x1 + (u ? 3 : 0)),
      m = (2 + x1) >> 1,
      T = hex('#ded8c2');
    const hgt = u ? 9 : 6;
    for (let x = 2; x <= x1; x++) {
      const d = Math.abs(x - m) / (m - 2),
        top = b - Math.round(hgt * (1 - d * d));
      for (let y = top; y <= b; y++) {
        const k = (x * 3 + y * 5 + ((x * y) % 3)) % 7;
        c.set(x, y, k === 0 ? hex('#a89c7c') : k < 3 ? C.white : T);
      }
    }
    for (let i = 0; i < (u ? 6 : 3); i++) c.set(3 + ((r() * (x1 - 4)) | 0), b - ((r() * 3) | 0), u ? C.blood : hex('#a89c7c'));
    if (u) {
      c.line(m + 2, b - 10, x1 - 1, b - 14, ST); // pliers, left standing in it
      c.line(m + 3, b - 10, x1, b - 13, IR);
      c.rect(m + 1, b - 9, m + 2, b - 8, ST);
    }
    return () => dots(c, T, u ? [1, b, x1 + 1, b] : [x1 + 1, b]);
  }
  O('nightmare-pile-of-teeth', 'pile of teeth heap of human teeth on the floor molars dream of losing teeth', {
    w: 22,
    h: 12,
    uh: 20,
    solid: false,
    f: (c, u) => teeth(c, u, 19),
    sw: 16,
    suh: 20,
    s: (c, u) => teeth(c, u, 13),
  });

  /* ---------- the clock with no hands ---------- */
  function clock(c, u, side) {
    const b = 44,
      x1 = side ? 9 : 13;
    c.rect(3, 5, x1 - 1, b - 2, W);
    c.col(3, 5, b - 2, WL);
    c.rect(2, 3, x1, 5, WD);
    c.row(3, 2, x1, W);
    c.row(2, 4, x1 - 2, W);
    c.rect(2, b - 2, x1, b, WD);
    c.row(b - 2, 2, x1, W);
    if (side) {
      c.frame(5, 8, 7, 14, WD);
      c.frame(5, 19, 7, b - 5, WD);
      c.col(10, 7, 15, BR);
      return;
    }
    c.oval(4, 7, 11, 14, PAPER);
    ring(c, 4, 7, 11, 14, BR);
    if (u) {
      // the face has opened an eye
      c.row(10, 5, 10, C.white);
      c.row(11, 6, 9, C.white);
      c.rect(7, 10, 8, 11, hex('#4a5e36'));
      c.set(7, 10, NI);
      c.row(9, 6, 9, hex('#8a8068'));
    } else c.set(7, 10, hex('#8a8068'));
    c.rect(5, 18, 10, b - 5, NI);
    c.frame(5, 18, 10, b - 5, WD);
    if (u) {
      c.col(7, 19, 30, BR);
      c.rect(6, 31, 8, 33, BR);
    } else {
      c.line(8, 19, 6, 30, BR);
      c.rect(5, 31, 7, 33, BR);
      c.set(5, 31, L(BR));
    }
  }
  O('nightmare-clock-no-hands', 'grandfather clock with no hands blank dial long case clock pendulum time has stopped', {
    w: 16,
    h: 46,
    f: (c, u) => clock(c, u, false),
    sw: 13,
    s: (c, u) => clock(c, u, true),
  });

  /* ---------- coats shaped like people ---------- */
  function coat(c, x, y, col, hands) {
    // shoulders 9 wide at x..x+8, hanging to y + 26
    c.set(x + 4, y - 1, ST);
    c.row(y, x + 2, x + 6, col);
    c.rect(x, y + 1, x + 8, y + 12, col);
    c.rect(x + 1, y + 13, x + 7, y + 26, col);
    c.col(x, y + 1, y + 12, L(col));
    c.col(x + 4, y + 2, y + 26, D(col));
    c.col(x + 8, y + 2, y + 12, D(col));
    dots(c, D(col), [x + 2, y + 1, x + 6, y + 1, x + 5, y + 6, x + 5, y + 10]);
    if (hands) {
      c.rect(x, y + 13, x, y + 14, SKIN);
      c.rect(x + 8, y + 13, x + 8, y + 14, SKIN);
    }
  }
  O('nightmare-coats-like-people', 'hanging coats shaped like people coat rack long dark coats and a hat in the hall shoes underneath', {
    w: 32,
    h: 42,
    f(c, u) {
      const b = 40;
      c.rect(1, 6, 30, 7, W);
      c.row(6, 1, 30, WL);
      dots(c, BR, [6, 8, 16, 8, 26, 8]);
      coat(c, 2, 9, hex('#3d3a44'), u);
      if (!u) coat(c, 12, 9, hex('#4a4038'));
      coat(c, 22, 9, hex('#39423c'), false);
      // a hat over the first
      c.rect(4, 2, 8, 5, hex('#2a2630'));
      c.row(5, 2, 10, hex('#2a2630'));
      c.row(2, 4, 8, hex('#45414f'));
      if (u) {
        c.rect(5, 6, 7, 8, hex('#9a927e')); // and now a face under it
        c.set(5, 7, NI);
        c.set(7, 7, NI);
      }
      for (const x of u ? [3, 23] : [3, 13, 23]) {
        c.rect(x, b - 1, x + 2, b, NI);
        c.rect(x + 4, b - 1, x + 6, b, NI);
        c.set(x, b - 1, hex('#45414f'));
      }
      return () => u && dots(c, hex('#2a2a26'), [14, b, 17, b - 1 + 1, 19, b]);
    },
    sw: 12,
    s(c, u) {
      const b = 40,
        col = hex('#3d3a44');
      c.rect(1, 6, 2, 7, W);
      c.rect(3, 7, 4, 8, BR);
      c.rect(3, 9, 8, 21, col);
      c.rect(4, 22, 8, 35, col);
      c.col(3, 9, 21, L(col));
      c.col(8, 10, 35, D(col));
      c.col(5, 11, 21, D(col));
      c.rect(3, 2, 8, 5, hex('#2a2630'));
      c.row(5, 2, 10, hex('#2a2630'));
      if (u) {
        c.rect(5, 6, 8, 8, hex('#9a927e'));
        c.set(8, 7, NI);
        c.rect(6, 22, 6, 23, SKIN);
      }
      c.rect(4, b - 1, 8, b, NI);
      c.set(4, b - 1, hex('#45414f'));
    },
  });
};
