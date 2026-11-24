/* Nightmare: the people of bad dreams, who are almost people. */
module.exports = (kit, U) => {
  const { SKINS, HAIR, CLOTH, HAIRS, K, WHITE, BONE, RED, GOLD, hex, mix, dark, lite, face, body, shoe, rnd } = kit;
  const { P, C, sleeve, hand, trouser, foot } = U;
  const { heads, torsos, arms, legs, H, S, T, A, L } = U.lists();
  const GREY = C.grey,
    BLACK = hex('#1e1b24'),
    PJ = hex('#8a9aa8'),
    NIGHT = hex('#2f3a5a'),
    COAT = hex('#3e4a5a'),
    BULB = hex('#d8d2a8'),
    BLANK = hex('#cfcabb'),
    DIAL = hex('#d9d2b8'),
    CARDIGAN = hex('#6a4e36');

  /* ---------- heads ---------- */
  S('face with no features blank smooth black hair fair', (c) => {
    const s = SKINS.fair;
    face(c, s);
    c.set(7, 7, s);
    P(c, s, [
      [2, 6],
      [2, 7],
    ]);
    P(c, dark(s), [
      [11, 6],
      [11, 7],
    ]);
    HAIRS.parted(c, HAIR.black);
    const d = mix(s, 0.93);
    c.rect(4, 6, 5, 6, d);
    c.rect(8, 6, 9, 6, d);
    c.row(9, 6, 7, d);
  });
  H('too wide smile many teeth brown hair pale', 'pale', 'calm', (c, s) => {
    HAIRS.parted(c, HAIR.brown);
    P(c, s, [
      [2, 8],
      [2, 9],
      [11, 8],
      [11, 9],
    ]);
    c.row(8, 3, 10, s);
    c.row(9, 3, 10, WHITE);
    P(c, mix(WHITE, 0.7), [
      [4, 9],
      [6, 9],
      [8, 9],
      [10, 9],
    ]);
    c.row(10, 3, 10, K);
    P(c, K, [
      [2, 9],
      [11, 9],
      [2, 8],
      [11, 8],
      [1, 7],
      [12, 7],
    ]);
    c.set(7, 8, dark(s));
    P(c, WHITE, [
      [4, 6],
      [9, 6],
    ]);
  });
  H('too many eyes bald ashen', 'ashen', 'calm', (c, s) => {
    c.row(2, 5, 8, s);
    const eye = (x, y, flip) => {
      c.set(x, y, K);
      c.set(x + (flip ? 1 : -1), y, WHITE);
    };
    eye(5, 6);
    eye(8, 6, true);
    eye(6, 4);
    eye(9, 4, true);
    eye(4, 8);
    eye(9, 8, true);
    c.set(7, 7, s);
    c.set(6, 2, K);
    c.set(7, 2, WHITE);
  });
  S('head like a hanging lightbulb glass filament cord', (c) => {
    const g = BULB,
      br = C.brass;
    c.rect(6, 0, 7, 0, hex('#33323a'));
    c.rect(5, 1, 8, 2, br);
    c.row(2, 5, 8, dark(br));
    c.set(5, 1, lite(br));
    c.set(8, 1, dark(br));
    c.row(3, 5, 8, g);
    c.row(4, 4, 9, g);
    c.rect(3, 5, 10, 8, g);
    c.row(9, 4, 9, g);
    c.row(10, 5, 8, g);
    c.row(11, 6, 7, dark(g));
    c.col(10, 5, 8, mix(g, 0.8));
    c.set(9, 9, mix(g, 0.8));
    c.rect(5, 5, 8, 7, hex('#f0eab8'));
    P(c, WHITE, [
      [4, 5],
      [4, 6],
      [5, 4],
    ]);
    c.col(6, 3, 5, hex('#5a5048'));
    c.col(7, 3, 5, hex('#5a5048'));
    P(c, hex('#c9762a'), [
      [5, 6],
      [6, 7],
      [7, 6],
      [8, 7],
    ]);
    P(c, hex('#e8b04a'), [
      [6, 6],
      [7, 7],
    ]);
  });
  S('television head static screen antenna', (c) => {
    const w = hex('#4a3a2c'),
      r = rnd(77);
    P(c, C.steel, [
      [4, 0],
      [5, 1],
      [9, 0],
      [8, 1],
    ]);
    c.rect(2, 2, 11, 11, w);
    c.row(2, 2, 11, lite(w));
    c.col(11, 3, 11, dark(w));
    P(c, K, [
      [3, 12],
      [10, 12],
    ]);
    const tones = [WHITE, hex('#a5a5a0'), hex('#77777c'), hex('#44444c'), hex('#a5a5a0'), hex('#77777c')];
    for (let y = 3; y <= 10; y++) for (let x = 3; x <= 8; x++) c.set(x, y, tones[Math.floor(r() * tones.length)]);
    for (const [x, y] of [
      [3, 3],
      [8, 3],
      [3, 10],
      [8, 10],
    ])
      c.set(x, y, K);
    P(c, K, [
      [4, 5],
      [4, 6],
      [7, 5],
      [7, 6],
    ]);
    c.col(9, 3, 10, K);
    P(c, C.brass, [
      [10, 4],
      [10, 6],
    ]);
    P(c, K, [
      [10, 8],
      [10, 9],
      [10, 10],
    ]);
  });
  H('child button eyes sewn black bob hair fair', 'fair', 'calm', (c) => {
    const h = HAIR.black,
      b = hex('#16131c'),
      l = hex('#5a5a68');
    HAIRS.bob(c, h);
    c.rect(4, 5, 5, 6, b);
    c.rect(8, 5, 9, 6, b);
    P(c, l, [
      [5, 5],
      [4, 6],
      [9, 5],
      [8, 6],
    ]);
    P(c, WHITE, [
      [3, 5],
      [6, 6],
      [7, 5],
      [10, 6],
    ]);
    c.row(4, 4, 9, h);
  });
  S('tall man black hat no face blank white', (c) => {
    const f = BLANK,
      b = hex('#17151c');
    c.rect(4, 0, 9, 2, b);
    c.row(2, 4, 9, hex('#33303a'));
    c.row(3, 1, 12, b);
    c.set(4, 0, hex('#33303a'));
    c.rect(4, 4, 9, 10, f);
    c.row(11, 5, 8, f);
    c.row(12, 6, 7, dark(f));
    c.row(4, 4, 9, mix(f, 0.7));
    c.col(9, 5, 10, mix(f, 0.8));
    c.set(8, 11, mix(f, 0.8));
    c.set(4, 5, lite(f));
    P(c, mix(f, 0.9), [
      [5, 7],
      [7, 7],
    ]);
  });
  S('upside-down face eyes below mouth above hair at the chin tan', (c) => {
    const s = SKINS.tan,
      h = HAIR.red;
    face(c, s);
    c.set(7, 7, s);
    c.row(2, 5, 8, s);
    c.set(6, 6, dark(s));
    c.row(4, 5, 8, K);
    P(c, K, [
      [4, 5],
      [9, 5],
    ]);
    c.set(6, 3, dark(s));
    c.set(5, 8, K);
    c.set(8, 8, K);
    P(c, dark(dark(s)), [
      [4, 9],
      [5, 9],
      [8, 9],
      [9, 9],
    ]);
    c.row(10, 3, 10, h);
    c.row(11, 3, 10, h);
    c.row(12, 4, 9, dark(h));
    P(c, h, [
      [3, 9],
      [10, 9],
      [2, 10],
      [11, 10],
    ]);
    c.set(10, 11, dark(h));
    c.set(6, 11, lite(h));
  });
  S('one big eye head staring bloodshot pale', (c) => {
    const s = SKINS.pale,
      iris = hex('#4d7a8a');
    face(c, s);
    c.set(7, 7, s);
    c.row(2, 5, 8, s);
    c.rect(4, 4, 9, 8, WHITE);
    c.col(3, 5, 7, WHITE);
    c.col(10, 5, 7, mix(WHITE, 0.8));
    c.rect(5, 4, 8, 7, iris);
    c.rect(6, 5, 7, 6, K);
    c.set(5, 4, WHITE);
    c.set(8, 4, WHITE);
    c.set(5, 7, WHITE);
    c.set(8, 7, WHITE);
    c.set(6, 4, lite(iris));
    c.set(6, 5, WHITE);
    P(c, RED, [
      [3, 6],
      [4, 7],
      [9, 8],
      [10, 6],
    ]);
    c.row(3, 4, 9, dark(s));
    c.row(9, 4, 9, dark(s));
  });
  H('face slipped askew eyes at different heights grey hair drowned', 'drowned', 'calm', (c, s) => {
    HAIRS.parted(c, HAIR.grey);
    c.rect(4, 5, 9, 6, s);
    c.rect(4, 8, 9, 10, s);
    c.set(9, 10, dark(s));
    c.set(7, 7, s);
    c.set(4, 5, K);
    c.set(5, 5, WHITE);
    c.set(9, 8, K);
    c.set(8, 8, WHITE);
    c.set(6, 7, dark(s));
    P(c, K, [
      [4, 9],
      [5, 10],
      [6, 10],
      [7, 11],
    ]);
    P(c, dark(s), [
      [5, 6],
      [8, 9],
    ]);
  });
  S('alarm clock face head brass bells hands', (c) => {
    const br = C.brass,
      d = DIAL;
    P(c, br, [
      [3, 1],
      [4, 1],
      [3, 2],
      [9, 1],
      [10, 1],
      [10, 2],
    ]);
    P(c, dark(br), [
      [4, 2],
      [9, 2],
    ]);
    P(c, K, [
      [6, 0],
      [7, 0],
      [6, 1],
    ]);
    c.row(2, 5, 8, br);
    c.row(3, 4, 9, br);
    c.rect(3, 4, 10, 9, br);
    c.row(10, 4, 9, br);
    c.row(11, 5, 8, dark(br));
    c.col(10, 4, 9, dark(br));
    c.row(3, 5, 8, d);
    c.rect(4, 4, 9, 9, d);
    c.row(10, 5, 8, d);
    P(c, mix(d, 0.6), [
      [6, 3],
      [9, 6],
      [4, 6],
      [6, 10],
    ]);
    c.col(6, 4, 6, K);
    P(c, K, [
      [7, 7],
      [8, 8],
    ]);
    c.set(6, 7, RED);
    c.set(9, 9, mix(d, 0.8));
    P(c, K, [
      [2, 12],
      [11, 12],
    ]);
    P(c, br, [
      [3, 11],
      [10, 11],
    ]);
  });

  /* ---------- torsos ---------- */
  T('black suit too long thin tie hanging down', (c) => {
    body(c, BLACK);
    c.rect(5, 1, 6, 9, WHITE);
    c.col(6, 1, 9, dark(WHITE));
    c.col(5, 2, 9, CLOTH.wine);
    c.set(5, 9, dark(CLOTH.wine));
    P(c, lite(lite(BLACK)), [
      [4, 1],
      [4, 2],
      [4, 3],
      [7, 1],
      [7, 2],
      [7, 3],
      [4, 4],
      [7, 4],
      [4, 5],
      [7, 5],
    ]);
    c.set(3, 4, WHITE);
    c.set(8, 7, hex('#33303a'));
    c.set(8, 9, hex('#33303a'));
  });
  T('pyjamas striped pale blue jacket buttons', (c) => {
    body(c, PJ);
    for (const x of [2, 4, 7, 9]) c.col(x, 2, 9, WHITE);
    c.set(9, 9, dark(WHITE));
    P(c, SKINS.fair, [
      [5, 1],
      [6, 1],
    ]);
    P(c, WHITE, [
      [4, 1],
      [7, 1],
      [3, 1],
      [8, 1],
    ]);
    P(c, dark(PJ), [
      [5, 2],
      [6, 2],
    ]);
    c.col(5, 3, 9, dark(PJ));
    P(c, WHITE, [
      [6, 4],
      [6, 6],
      [6, 8],
    ]);
    c.row(5, 7, 8, dark(PJ));
  });
  T('coat with far too many buttons grey blue', (c) => {
    body(c, COAT);
    c.row(1, 4, 7, dark(COAT));
    for (const y of [2, 4, 6, 8]) for (const x of [2, 4, 6, 8]) c.set(x, y, x === 8 ? mix(GOLD, 0.75) : GOLD);
    for (const x of [3, 5, 7]) c.col(x, 2, 9, dark(COAT));
    c.set(2, 2, lite(GOLD));
    c.col(9, 2, 9, dark(COAT));
  });
  T('pyjamas dark blue moons and stars child', (c) => {
    body(c, NIGHT);
    P(c, SKINS.fair, [
      [5, 1],
      [6, 1],
    ]);
    P(c, WHITE, [
      [4, 1],
      [7, 1],
      [4, 2],
      [7, 2],
    ]);
    c.col(5, 2, 9, dark(NIGHT));
    P(c, C.glow, [
      [3, 3],
      [8, 5],
      [3, 7],
      [7, 8],
      [8, 2],
    ]);
    P(c, BONE, [
      [7, 3],
      [6, 4],
      [7, 5],
      [3, 5],
    ]);
    P(c, WHITE, [
      [6, 6],
      [6, 8],
    ]);
    c.row(9, 2, 9, dark(NIGHT));
  });
  T('grey shirt hole through the chest stars inside', (c) => {
    const sh = CLOTH.ash,
      v = hex('#151028');
    body(c, sh);
    P(c, dark(sh), [
      [4, 1],
      [7, 1],
      [5, 2],
      [6, 2],
    ]);
    c.rect(3, 3, 8, 7, v);
    for (const [x, y] of [
      [3, 3],
      [8, 3],
      [3, 7],
      [8, 7],
    ])
      c.set(x, y, dark(sh));
    P(c, dark(sh), [
      [2, 5],
      [9, 4],
      [5, 8],
      [6, 8],
    ]);
    P(c, WHITE, [
      [5, 4],
      [7, 6],
    ]);
    c.set(4, 6, C.tear);
    c.set(6, 5, hex('#48305a'));
    c.row(9, 2, 9, dark(sh));
  });
  T('plum dress covered in eyes', (c) => {
    const d = CLOTH.plum;
    body(c, d, true);
    c.row(1, 4, 7, dark(d));
    P(c, SKINS.ashen, [
      [5, 1],
      [6, 1],
    ]);
    const eye = (x, y) => {
      c.set(x, y, WHITE);
      c.set(x + 1, y, K);
      c.set(x + 2, y, WHITE);
    };
    eye(2, 3);
    eye(6, 3);
    eye(4, 5);
    eye(1, 7);
    eye(7, 7);
    eye(4, 9);
    c.col(10, 6, 9, dark(d));
    c.set(1, 1, lite(d));
  });
  T('bare grey chest mouth in the belly teeth', (c) => {
    const g = GREY;
    body(c, g);
    c.clear(2, 4);
    c.clear(9, 4);
    P(c, dark(g), [
      [3, 2],
      [4, 2],
      [7, 2],
      [8, 2],
      [5, 3],
      [3, 4],
      [8, 4],
    ]);
    c.row(5, 3, 8, hex('#5a3a3a'));
    c.row(6, 2, 9, K);
    c.row(6, 3, 8, BONE);
    P(c, K, [
      [5, 6],
      [7, 6],
    ]);
    c.row(7, 3, 8, K);
    P(c, RED, [
      [5, 7],
      [6, 7],
    ]);
    c.row(8, 3, 8, hex('#5a3a3a'));
    P(c, BONE, [
      [4, 8],
      [7, 8],
    ]);
    c.set(1, 1, lite(g));
  });
  T('brown cardigan zigzag pattern shirt and tie', (c) => {
    const k = CARDIGAN;
    body(c, k);
    c.rect(5, 1, 6, 3, WHITE);
    c.col(5, 2, 3, CLOTH.mustard);
    P(c, dark(k), [
      [4, 1],
      [4, 2],
      [4, 3],
      [7, 1],
      [7, 2],
      [7, 3],
      [5, 4],
      [6, 4],
    ]);
    for (let x = 2; x <= 9; x++) c.set(x, 5 + (x % 2), CLOTH.cream);
    for (let x = 2; x <= 9; x++) c.set(x, 6 - (x % 2), CLOTH.rust);
    c.col(5, 7, 9, dark(k));
    P(c, BONE, [
      [6, 7],
      [6, 9],
    ]);
    c.row(9, 2, 4, dark(k));
    c.row(9, 7, 9, dark(k));
    c.set(9, 5, dark(CLOTH.rust));
  });

  /* ---------- arms ---------- */
  A('arm too long thin grey extra elbow long fingers', (c) => {
    const g = GREY;
    c.rect(2, 0, 3, 3, g);
    c.rect(1, 3, 2, 5, g);
    c.rect(2, 6, 3, 8, g);
    P(c, dark(g), [
      [3, 0],
      [3, 1],
      [3, 2],
      [2, 4],
      [2, 5],
      [3, 6],
      [3, 7],
      [3, 8],
    ]);
    c.set(1, 4, lite(g));
    c.row(9, 1, 3, g);
    c.col(1, 10, 11, g);
    c.col(3, 10, 11, dark(g));
    c.set(2, 10, g);
    c.set(2, 11, dark(g));
  });
  A('black suit sleeve too long covers the hand fingertips', (c) => {
    c.rect(1, 0, 3, 9, BLACK);
    c.col(3, 0, 9, dark(BLACK));
    c.set(1, 0, lite(lite(BLACK)));
    c.col(1, 2, 8, lite(BLACK));
    c.row(10, 1, 3, WHITE);
    c.set(3, 10, dark(WHITE));
    c.row(11, 1, 3, SKINS.pale);
    c.set(2, 11, dark(SKINS.pale));
  });
  A('pyjama striped pale blue sleeve fair hand', (c) => {
    sleeve(c, PJ, 8);
    c.col(2, 0, 7, WHITE);
    c.row(8, 1, 3, WHITE);
    c.set(3, 8, dark(WHITE));
    hand(c, SKINS.fair);
  });
  A('coat sleeve too many buttons grey blue grey hand', (c) => {
    sleeve(c, COAT, 8);
    for (const y of [1, 3, 5, 7]) c.set(2, y, GOLD);
    c.row(8, 1, 3, dark(COAT));
    hand(c, GREY);
  });
  A('grey arm eye in the palm too many fingers', (c) => {
    const g = GREY;
    hand(c, g, 0);
    c.set(1, 0, lite(g));
    c.rect(0, 9, 4, 10, g);
    c.set(4, 9, dark(g));
    c.set(4, 10, dark(g));
    P(c, g, [
      [0, 11],
      [2, 11],
    ]);
    c.set(4, 11, dark(g));
    c.set(1, 8, WHITE);
    c.set(2, 8, K);
    c.set(3, 8, WHITE);
    c.row(7, 1, 3, dark(g));
  });

  /* ---------- legs ---------- */
  L('bare grey legs thin knobbly knees long toes', (c) => {
    const g = GREY;
    c.rect(2, 0, 3, 9, g);
    c.col(3, 0, 9, dark(g));
    c.rect(1, 4, 4, 5, g);
    c.set(4, 4, dark(g));
    c.set(4, 5, dark(g));
    c.set(1, 4, lite(g));
    c.set(2, 5, dark(g));
    c.rect(1, 0, 4, 0, g);
    c.row(10, 2, 3, g);
    c.row(11, 1, 5, g);
    P(c, dark(g), [
      [3, 11],
      [5, 11],
      [3, 10],
    ]);
  });
  L('black suit jacket too long to the knees pinstripe trousers', (c) => {
    trouser(c, BLACK);
    c.col(2, 6, 9, CLOTH.ash);
    c.rect(0, 0, 5, 5, BLACK);
    c.col(5, 0, 5, dark(BLACK));
    c.row(5, 0, 5, lite(lite(BLACK)));
    c.col(1, 0, 4, lite(BLACK));
    c.set(4, 2, hex('#33303a'));
    c.set(4, 4, hex('#33303a'));
    shoe(c, K);
    c.set(5, 10, K);
    c.row(10, 1, 3, hex('#2a2830'));
  });
  L('pyjama striped pale blue trousers bare feet fair', (c) => {
    trouser(c, PJ);
    c.col(2, 0, 9, WHITE);
    c.col(4, 0, 9, dark(WHITE));
    c.row(9, 1, 4, dark(PJ));
    foot(c, SKINS.fair);
  });
  L('pyjama dark blue stars trousers grey slippers', (c) => {
    trouser(c, NIGHT);
    P(c, C.glow, [
      [2, 2],
      [3, 5],
      [1, 7],
    ]);
    P(c, BONE, [
      [3, 1],
      [2, 8],
    ]);
    shoe(c, CLOTH.ash);
    c.set(4, 10, WHITE);
    c.set(3, 10, lite(CLOTH.ash));
  });
  L('stilt thin black legs tall man', (c) => {
    c.rect(2, 0, 3, 9, BLACK);
    c.col(3, 0, 9, dark(BLACK));
    c.rect(1, 0, 4, 1, BLACK);
    c.set(2, 5, lite(lite(BLACK)));
    shoe(c, K);
    c.clear(1, 10);
    c.clear(1, 11);
    c.set(2, 10, hex('#2a2830'));
  });
  return { heads, torsos, arms, legs };
};
