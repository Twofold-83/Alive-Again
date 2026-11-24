/* The hospital: doctors, nurses, the orderly, and the patients nobody visits. */
module.exports = (kit, U) => {
  const { SKINS, HAIR, HAIRS, K, WHITE, BONE, BLOOD, RED, hex, mix, dark, lite, body, shoe } = kit;
  const { P, C, sleeve, hand, trouser, shin, foot, glasses, stubble } = U;
  const { heads, torsos, arms, legs, H, S, T, A, L } = U.lists();
  const GREEN = C.scrub,
    BLUE = C.scrubBlue,
    GOWN = C.gown,
    DOT = hex('#7f95a0'),
    NURSE = hex('#5e7186'),
    LATEX = C.dirtyWhite;

  /* ---------- heads ---------- */
  const surgeon = (cap, mask, bloody) => (c) => {
    c.row(1, 4, 9, cap);
    c.rect(3, 2, 10, 3, cap);
    c.set(4, 1, lite(cap));
    c.row(3, 3, 10, dark(cap));
    c.row(7, 6, 7, mask);
    c.rect(3, 8, 10, 8, mask);
    c.rect(4, 9, 9, 10, mask);
    c.row(11, 5, 8, dark(mask));
    c.set(3, 8, dark(mask));
    c.set(10, 8, dark(mask));
    c.set(9, 10, dark(mask));
    if (bloody) P(c, BLOOD, [[5, 9], [6, 10], [8, 8], [4, 2]]);
  };
  H('surgeon cap mask green fair', 'fair', 'calm', surgeon(GREEN, lite(GREEN)));
  H('surgeon cap mask blue bloody brown', 'brown', 'angry', surgeon(BLUE, WHITE, true));
  H('nurse old-fashioned white cap red cross blond hair fair', 'fair', 'calm', (c) => {
    const h = HAIR.blond;
    c.row(3, 3, 10, h);
    P(c, h, [[3, 4], [3, 5], [4, 4]]);
    P(c, dark(h), [[10, 4], [10, 5]]);
    c.row(0, 5, 8, WHITE);
    c.rect(4, 1, 9, 2, WHITE);
    P(c, WHITE, [[3, 2], [10, 2]]);
    c.col(9, 1, 2, dark(WHITE));
    P(c, RED, [[6, 0], [5, 1], [6, 1], [7, 1], [6, 2]]);
  });
  H('nurse long white veil red cross black hair brown', 'brown', 'calm', (c) => {
    const v = WHITE,
      h = HAIR.black;
    c.row(1, 4, 9, v);
    c.row(2, 3, 10, v);
    c.row(3, 2, 11, v);
    c.col(2, 4, 10, v);
    c.col(11, 4, 10, dark(v));
    c.col(1, 7, 11, v);
    c.col(12, 7, 11, dark(v));
    P(c, h, [[3, 4], [4, 4], [9, 4], [10, 4]]);
    P(c, RED, [[6, 2], [7, 2]]);
    c.set(4, 1, lite(v));
  });
  H('orderly white cap stubble black hair tan', 'tan', 'angry', (c, s) => {
    const h = HAIR.black;
    c.row(3, 3, 10, h);
    c.set(3, 4, h);
    c.set(10, 4, dark(h));
    c.row(1, 5, 8, WHITE);
    c.row(2, 4, 9, WHITE);
    c.set(9, 2, dark(WHITE));
    stubble(c, s);
    c.row(9, 5, 8, K);
  });
  H('patient bandaged head blood brown hair pale', 'pale', 'hollow', (c) => {
    const h = HAIR.brown;
    c.row(1, 5, 8, h);
    c.set(6, 0, h);
    c.row(2, 4, 9, BONE);
    c.rect(3, 3, 10, 4, BONE);
    P(c, dark(BONE), [[3, 4], [4, 3], [5, 2], [10, 3]]);
    P(c, BLOOD, [[9, 3], [9, 4]]);
    c.set(8, 3, RED);
    P(c, BONE, [[11, 4], [12, 5]]);
    c.set(3, 5, h);
  });
  H('patient eye patch gauze grey hair fair', 'fair', 'scared', (c, s) => {
    HAIRS.balding(c, HAIR.grey);
    c.row(2, 5, 8, s);
    c.rect(7, 5, 9, 6, WHITE);
    c.row(7, 8, 9, WHITE);
    c.set(9, 7, dark(WHITE));
    P(c, BONE, [[6, 4], [10, 4], [10, 8]]);
    c.set(8, 6, mix(BLOOD, 1.3));
  });
  S('specialist white hood goggles beak mask plague doctor', (c) => {
    const w = hex('#c4c3b6'),
      b = hex('#7a6748'),
      f = hex('#33323a');
    c.row(1, 4, 9, w);
    c.row(2, 3, 10, w);
    c.rect(2, 3, 11, 10, w);
    c.row(11, 3, 10, w);
    c.row(12, 4, 9, dark(w));
    c.col(11, 3, 10, dark(w));
    c.set(4, 1, lite(w));
    c.set(3, 2, lite(w));
    c.rect(3, 4, 5, 6, f);
    c.rect(8, 4, 10, 6, f);
    c.row(5, 6, 7, f);
    c.set(2, 5, f);
    c.set(11, 5, f);
    c.set(4, 5, hex('#8a2a2a'));
    c.set(9, 5, hex('#8a2a2a'));
    c.set(3, 4, C.glass);
    c.set(8, 4, C.glass);
    c.rect(5, 7, 8, 8, b);
    c.rect(6, 9, 7, 11, b);
    c.set(5, 7, lite(b));
    c.col(8, 7, 8, dark(b));
    c.col(7, 9, 11, dark(b));
    c.set(6, 8, K);
    P(c, RED, [[6, 2], [7, 2], [6, 3], [7, 3]]);
    P(c, RED, [[5, 2], [8, 2]]);
    c.col(4, 7, 10, K); // the straps beside the beak (and they keep the beak when a feeling is drawn)
    c.col(9, 7, 10, K);
  });
  H('old man oxygen tube white hair pale', 'pale', 'hollow', (c, s) => {
    HAIRS.balding(c, HAIR.white);
    c.row(2, 5, 8, s);
    const t = hex('#9fd0bc');
    c.row(8, 3, 10, t);
    P(c, t, [[2, 7], [11, 7], [2, 6], [11, 6]]);
    P(c, dark(s), [[5, 4], [6, 4], [8, 4], [4, 7], [9, 7]]);
    P(c, HAIR.white, [[3, 6], [10, 6]]);
  });
  H('doctor head mirror glasses brown hair fair', 'fair', 'calm', (c) => {
    HAIRS.parted(c, HAIR.brown);
    c.row(3, 3, 10, C.leather);
    c.rect(6, 1, 8, 3, lite(C.steel));
    c.set(7, 2, K);
    c.set(6, 1, WHITE);
    c.set(8, 3, C.steel);
    glasses(c);
  });
  H('patient shaved head stitches scar ashen', 'ashen', 'hollow', (c, s) => {
    c.row(2, 5, 8, s);
    const sh = mix(s, 0.86);
    c.row(2, 5, 8, sh);
    c.row(3, 4, 9, sh);
    P(c, hex('#6a2a2a'), [[5, 3], [6, 3], [7, 3], [8, 3]]);
    P(c, K, [[5, 2], [7, 2], [6, 4], [8, 4]]);
    P(c, dark(s), [[4, 7], [9, 7]]);
  });

  /* ---------- torsos ---------- */
  const scrubs = (col, bloody) => (c) => {
    body(c, col);
    P(c, SKINS.fair, [[5, 1], [6, 1]]);
    P(c, dark(SKINS.fair), [[5, 2], [6, 2]]);
    P(c, dark(col), [[4, 1], [7, 1], [4, 2], [7, 2], [5, 3], [6, 3]]);
    c.row(5, 7, 8, dark(col));
    c.set(7, 4, WHITE);
    c.set(3, 4, WHITE);
    c.set(3, 5, lite(col));
    c.row(9, 2, 9, dark(col));
    if (bloody) P(c, BLOOD, [[3, 6], [4, 7], [5, 7], [4, 8], [6, 6], [7, 8], [8, 3], [5, 5]]);
  };
  T('scrubs green v-neck pocket', scrubs(GREEN));
  T('scrubs blue bloody v-neck', scrubs(BLUE, true));
  T('white coat doctor stethoscope', (c) => {
    body(c, WHITE);
    c.rect(5, 1, 6, 3, hex('#7f93a8'));
    c.col(5, 2, 3, hex('#5a3040'));
    P(c, dark(WHITE), [[4, 2], [4, 3], [7, 2], [7, 3], [5, 4]]);
    c.col(5, 5, 9, dark(WHITE));
    P(c, C.iron, [[6, 6], [6, 8]]);
    const tube = hex('#33323a');
    P(c, tube, [[4, 1], [3, 2], [3, 3], [3, 4], [7, 1], [8, 2], [8, 3], [8, 4]]);
    c.set(3, 5, C.steel);
    c.rect(7, 5, 8, 6, C.steel);
    c.set(7, 5, WHITE);
    c.row(8, 2, 3, dark(WHITE));
  });
  T('hospital gown pale dotted patient', (c) => {
    body(c, GOWN, true);
    P(c, SKINS.pale, [[5, 1], [6, 1]]);
    for (const [x, y] of [[3, 3], [6, 3], [8, 4], [4, 5], [7, 6], [2, 7], [5, 7], [9, 8], [3, 9], [7, 9]]) c.set(x, y, DOT);
    P(c, WHITE, [[7, 1], [8, 2]]);
    c.col(10, 6, 9, dark(GOWN));
    c.set(4, 1, dark(GOWN));
  });
  T('surgical gown green apron bloody smear', (c) => {
    body(c, GREEN);
    c.row(1, 4, 7, dark(GREEN));
    c.rect(3, 2, 8, 9, LATEX);
    c.col(8, 2, 9, dark(LATEX));
    P(c, BLOOD, [[3, 4], [4, 4], [5, 5], [6, 5], [7, 6], [4, 6], [5, 6], [4, 7], [6, 7], [7, 7], [5, 8], [5, 9], [7, 9]]);
    P(c, RED, [[5, 6], [6, 6]]);
  });
  T('nurse uniform blue white bib apron red cross', (c) => {
    body(c, NURSE);
    c.rect(3, 3, 8, 9, WHITE);
    P(c, WHITE, [[3, 1], [3, 2], [8, 1], [8, 2], [5, 1], [6, 1], [4, 1], [7, 1]]);
    c.rect(5, 4, 6, 6, RED);
    P(c, RED, [[4, 5], [7, 5]]);
    c.row(8, 3, 8, dark(WHITE));
    c.col(8, 3, 9, dark(WHITE));
    c.set(2, 4, kit.GOLD);
  });
  T('orderly white tunic side buttons stained', (c) => {
    body(c, WHITE);
    c.row(1, 4, 7, dark(WHITE));
    c.col(6, 2, 9, dark(WHITE));
    for (const y of [2, 4, 6, 8]) c.set(7, y, C.iron);
    P(c, hex('#b3a877'), [[3, 6], [4, 7], [3, 7]]);
    c.set(3, 3, hex('#5e7186'));
    c.set(4, 3, hex('#5e7186'));
  });
  T('lead x-ray apron grey heavy over scrubs', (c) => {
    const lead = hex('#4a5560');
    body(c, GREEN);
    P(c, SKINS.tan, [[5, 1], [6, 1]]);
    c.rect(2, 3, 9, 9, lead);
    c.rect(2, 1, 3, 2, lead);
    c.rect(8, 1, 9, 2, lead);
    c.col(9, 1, 9, dark(lead));
    P(c, lite(lead), [[2, 1], [2, 3], [3, 4]]);
    c.row(7, 2, 9, K);
    c.set(5, 7, C.steel);
    c.set(7, 4, C.glow);
    c.set(7, 5, K);
  });

  /* ---------- arms ---------- */
  A('scrubs green short sleeve fair hand', (c) => {
    sleeve(c, GREEN, 3);
    c.row(3, 1, 3, dark(GREEN));
    hand(c, SKINS.fair, 4);
  });
  A('white coat sleeve doctor fair hand', (c) => {
    sleeve(c, WHITE, 8);
    c.row(8, 1, 3, dark(WHITE));
    c.set(2, 4, dark(WHITE));
    hand(c, SKINS.fair);
  });
  A('surgical gown green sleeve latex glove bloody', (c) => {
    sleeve(c, GREEN, 6);
    c.row(6, 1, 3, dark(GREEN));
    c.rect(1, 7, 3, 10, LATEX);
    c.col(3, 7, 10, dark(LATEX));
    P(c, BLOOD, [[1, 9], [2, 10], [3, 9], [2, 8], [1, 10], [2, 11]]);
  });
  A('bare arm patient wristband drip plaster pale', (c) => {
    hand(c, SKINS.pale, 0);
    c.rect(1, 0, 3, 1, GOWN);
    c.set(3, 0, dark(GOWN));
    c.set(3, 1, dark(GOWN));
    c.row(8, 1, 3, WHITE);
    c.set(2, 8, BLUE);
    P(c, BONE, [[2, 4], [3, 4], [2, 5]]);
    c.set(1, 5, hex('#6a2a2a'));
  });
  A('arm plaster cast white patient', (c) => {
    c.rect(1, 0, 3, 1, GOWN);
    c.rect(1, 2, 3, 9, WHITE);
    c.col(3, 2, 9, dark(WHITE));
    c.row(2, 1, 3, lite(WHITE));
    c.set(2, 5, BLUE);
    c.set(1, 6, BLUE);
    c.set(2, 7, hex('#8a4a4a'));
    c.row(10, 1, 3, SKINS.fair);
    c.set(1, 9, SKINS.fair);
  });

  /* ---------- legs ---------- */
  L('scrubs green trousers white clogs', (c) => {
    trouser(c, GREEN);
    c.set(2, 9, dark(GREEN));
    shoe(c, WHITE);
    c.set(2, 10, dark(WHITE));
    c.set(3, 10, dark(WHITE));
  });
  L('bare legs toe tag gown hem ashen', (c) => {
    const s = SKINS.ashen;
    shin(c, s, 0);
    c.rect(1, 0, 4, 2, GOWN);
    c.col(4, 0, 2, dark(GOWN));
    c.set(2, 1, DOT);
    foot(c, s);
    c.set(4, 9, K);
    c.set(5, 9, BONE);
    c.set(5, 10, BONE);
  });
  L('nurse skirt blue white stockings white shoes', (c) => {
    c.rect(0, 0, 5, 3, NURSE);
    c.rect(1, 0, 3, 2, WHITE);
    c.row(3, 0, 5, dark(NURSE));
    c.col(5, 0, 2, dark(NURSE));
    c.rect(2, 4, 3, 9, WHITE);
    c.col(3, 4, 9, dark(WHITE));
    shoe(c, WHITE);
    c.clear(1, 10);
    c.clear(1, 11);
  });
  L('orderly white trousers black shoes', (c) => {
    trouser(c, WHITE);
    c.col(2, 2, 8, mix(WHITE, 0.9));
    c.set(3, 7, hex('#b3a877'));
    shoe(c, K);
    c.row(10, 1, 4, hex('#2a2830'));
  });
  L('leg plaster cast white gown hem toes', (c) => {
    c.rect(1, 0, 4, 2, GOWN);
    c.col(4, 0, 2, dark(GOWN));
    c.rect(1, 3, 4, 11, WHITE);
    c.col(4, 3, 10, dark(WHITE));
    c.row(3, 1, 4, lite(WHITE));
    c.row(11, 1, 4, dark(WHITE));
    c.set(5, 11, SKINS.pale);
    c.set(2, 5, BLUE);
    c.set(3, 6, BLUE);
    c.set(2, 8, hex('#8a4a4a'));
  });
  return { heads, torsos, arms, legs };
};
