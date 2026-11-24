/* apartment — the neighbours of a worn block of flats. */
module.exports = (m) => {
  const { SKINS, HAIR, CLOTH, HAIRS, K, WHITE, BONE, RED, GOLD, hex, mix, dark, lite, body, shoe, C, P, H, T, A, L } = m;
  const DUST = hex('#5d6b78'),
    FUR = hex('#a89878'),
    WORK = hex('#55555d'),
    CLAY = hex('#9fb59a'),
    INK = hex('#3d4a5a');

  const towel = (c) => {
    const t = C.towel;
    c.row(0, 6, 9, t);
    c.row(1, 4, 10, t);
    c.rect(3, 2, 10, 3, t);
    P(c, t, [10, 0, 11, 1, 2, 3]);
    P(c, dark(t), [5, 3, 6, 2, 7, 1, 8, 0, 10, 2, 10, 3, 10, 1, 8, 3, 9, 2]);
    P(c, lite(t), [4, 2, 5, 1, 6, 0]);
  };

  /* ---------- heads ---------- */
  H('caretaker flat cap tweed grey moustache fair old', 'fair', 'calm', (c, s) => {
    const t = C.tweed,
      h = HAIR.grey;
    P(c, h, [3, 4, 3, 5]);
    P(c, dark(h), [10, 4, 10, 5]);
    c.row(1, 4, 9, t);
    c.row(2, 2, 11, t);
    c.row(3, 3, 11, dark(t));
    P(c, lite(t), [4, 1, 5, 1, 2, 2]);
    P(c, dark(t), [9, 1, 11, 2, 7, 2]);
    m.moustache(c, h);
    c.set(4, 8, h);
    c.set(9, 8, dark(h));
  });
  H('old woman curlers hair rollers grey hair pale angry', 'pale', 'angry', (c, s) => {
    const h = HAIR.grey;
    c.row(2, 3, 10, h);
    c.row(3, 3, 10, h);
    c.row(1, 4, 9, h);
    P(c, h, [3, 4]);
    P(c, dark(h), [10, 4]);
    c.rect(3, 1, 4, 2, C.pink);
    c.rect(6, 0, 7, 1, C.sky);
    c.rect(9, 1, 10, 2, C.pink);
    P(c, dark(C.pink), [4, 2, 10, 2, 3, 2, 9, 2]);
    P(c, dark(C.sky), [6, 1, 7, 1]);
    P(c, dark(s), [4, 8, 9, 8]);
  });
  H('man balding comb-over stubble cigarette tan', 'tan', 'calm', (c, s) => {
    const h = HAIR.brown;
    HAIRS.balding(c, h);
    P(c, h, [3, 6, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 5, 3, 7, 3]);
    m.stubble(c, s, 0.78);
    P(c, WHITE, [9, 9, 10, 9, 11, 9]);
    c.set(12, 9, C.orange);
    P(c, C.grey, [12, 7, 11, 5]);
  });
  H('courier cycle helmet orange chin strap brown', 'brown', 'calm', (c, s) => {
    const o = C.orange;
    c.row(0, 5, 8, o);
    c.row(1, 4, 9, o);
    c.rect(3, 2, 10, 3, o);
    P(c, K, [5, 1, 5, 2, 8, 1, 8, 2]);
    P(c, lite(o), [5, 0, 4, 1, 3, 2, 6, 1, 6, 2]);
    P(c, dark(o), [10, 2, 10, 3, 9, 1, 2, 3, 11, 3]);
    c.row(4, 3, 10, dark(o));
    P(c, C.silver, [3, 5, 3, 6, 3, 7, 3, 8, 4, 9, 10, 5, 10, 6, 10, 7, 10, 8, 9, 9]);
    P(c, C.steel, [4, 10, 9, 10]);
  });
  H('student round glasses messy red hair pale', 'pale', 'calm', (c, s) => {
    const h = HAIR.red;
    HAIRS.wild(c, h);
    P(c, h, [4, 0, 8, 1, 3, 4, 4, 4, 2, 4]);
    P(c, dark(h), [10, 4, 11, 4]);
    m.rounds(c, hex('#6a4a32'));
    P(c, dark(s), [4, 9]); // spots
  });
  H('woman towel turban wet hair tan', 'tan', 'calm', (c, s) => {
    towel(c);
    P(c, HAIR.black, [3, 4, 3, 5, 10, 4]);
    c.row(9, 6, 7, C.lip);
  });
  H('old woman headscarf wine babushka ashen', 'ashen', 'calm', (c, s) => {
    const w = CLOTH.wine;
    c.row(1, 4, 9, w);
    c.row(2, 3, 10, w);
    c.row(3, 2, 11, w);
    c.col(2, 4, 9, w);
    c.col(11, 4, 9, dark(w));
    P(c, w, [3, 4, 3, 9, 3, 10, 4, 11]);
    P(c, dark(w), [10, 4, 10, 9, 10, 10, 9, 11, 10, 2, 10, 3]);
    c.row(11, 5, 8, w);
    P(c, dark(w), [6, 11, 7, 11]);
    P(c, C.butter, [4, 2, 7, 1, 9, 3, 2, 6, 11, 7]);
    c.row(3, 5, 8, HAIR.white);
    P(c, dark(s), [4, 8, 9, 8, 4, 7]);
  });
  H('man dreadlocks black hair beard brown', 'brown', 'grin', (c, s) => {
    const h = HAIR.black,
      hl = mix(h, 2.2);
    c.row(1, 4, 9, h);
    c.row(2, 3, 10, h);
    c.row(3, 2, 11, h);
    c.col(2, 4, 10, h);
    c.col(11, 4, 10, h);
    c.col(3, 4, 6, h);
    c.col(10, 4, 6, h);
    c.col(1, 4, 8, h);
    c.col(12, 4, 8, h);
    P(c, hl, [2, 5, 2, 8, 1, 6, 3, 2, 6, 1, 11, 6, 12, 5, 11, 9, 8, 2]);
    P(c, GOLD, [2, 10, 12, 8]);
    m.beard(c, h);
  });
  H('woman towel turban green clay face mask pale', 'pale', 'calm', (c, s) => {
    towel(c);
    c.row(3, 4, 9, CLAY);
    c.rect(3, 4, 10, 5, CLAY);
    c.rect(3, 7, 10, 8, CLAY);
    P(c, CLAY, [3, 6, 10, 6, 3, 9, 4, 9, 9, 9, 10, 9, 4, 10, 9, 10]);
    P(c, dark(CLAY), [10, 5, 10, 7, 10, 8, 7, 7, 9, 10]);
    P(c, lite(CLAY), [3, 4, 4, 4]);
  });
  H('tenant long lank black hair hollow eyes drowned', 'drowned', 'hollow', (c, s) => {
    const h = HAIR.black;
    c.row(1, 4, 9, h);
    c.row(2, 3, 10, h);
    c.row(3, 3, 10, h);
    c.set(6, 3, s);
    c.col(2, 3, 11, h);
    c.col(3, 4, 11, h);
    c.col(11, 3, 11, h);
    c.col(10, 4, 11, h);
    P(c, h, [4, 4, 9, 4, 4, 5, 4, 10, 9, 10]);
    P(c, mix(h, 2.2), [2, 6, 3, 8, 11, 5, 10, 9, 5, 2]);
    c.set(9, 8, hex('#6f8fae')); // a drop
  });

  /* ---------- torsos ---------- */
  T('caretaker dust coat grey-blue pens keys', (c) => {
    const g = DUST;
    body(c, g);
    c.rect(5, 1, 6, 2, CLOTH.cream);
    P(c, lite(g), [4, 1, 4, 2, 7, 1, 7, 2]);
    c.col(5, 3, 9, dark(g));
    P(c, C.brown, [6, 4, 6, 6, 6, 8]);
    c.row(4, 7, 8, dark(g));
    P(c, RED, [8, 3]);
    P(c, K, [7, 3]);
    P(c, GOLD, [3, 8, 3, 9, 2, 9]);
    c.set(3, 7, C.silver);
  });
  T('housecoat lilac floral white collar buttons', (c) => {
    const g = C.lilac;
    body(c, g);
    P(c, WHITE, [4, 1, 4, 2, 7, 1, 7, 2, 3, 1, 8, 1]);
    c.col(5, 2, 9, dark(g));
    P(c, WHITE, [5, 4, 5, 7]);
    P(c, C.rose, [3, 4, 8, 3, 7, 6, 3, 8, 8, 8]);
    P(c, CLOTH.forest, [3, 5, 8, 4, 7, 7, 2, 8]);
    c.set(3, 6, C.butter);
  });
  T('white vest singlet stained bare tan shoulders', (c) => {
    const s = SKINS.tan,
      v = hex('#cfcbbd');
    body(c, s);
    c.rect(2, 3, 9, 9, v);
    c.col(9, 3, 9, dark(v));
    P(c, v, [3, 1, 3, 2, 8, 1, 8, 2, 4, 3, 7, 3]);
    c.row(3, 5, 6, s);
    P(c, dark(s), [5, 2, 6, 3, 5, 3]);
    c.set(2, 3, lite(v));
    P(c, CLOTH.mustard, [6, 6, 7, 7]);
    P(c, dark(v), [4, 8, 3, 5, 5, 9, 6, 9]);
  });
  T('courier jacket navy orange box straps reflective', (c) => {
    const g = CLOTH.navy;
    body(c, g);
    c.col(3, 1, 9, C.orange);
    c.col(8, 1, 9, dark(C.orange));
    c.row(4, 3, 8, C.charcoal);
    P(c, C.silver, [5, 4, 6, 4]);
    c.row(8, 2, 9, C.silver);
    c.set(9, 8, dark(C.silver));
    P(c, lite(g), [4, 1, 7, 1]);
    c.col(5, 5, 7, dark(g));
  });
  T('tracksuit top navy white stripes zip', (c) => {
    const g = CLOTH.navy;
    body(c, g);
    c.row(1, 1, 3, WHITE);
    c.row(1, 8, 10, dark(WHITE));
    c.col(5, 2, 9, lite(g));
    c.set(5, 2, C.silver);
    P(c, WHITE, [4, 1, 7, 1, 7, 4, 8, 4]);
    c.row(9, 2, 9, dark(g));
    c.row(8, 2, 9, WHITE);
    c.set(5, 8, lite(g));
    c.set(9, 8, dark(WHITE));
  });
  T('cardigan ash over wine dotted dress brooch', (c) => {
    const g = CLOTH.ash,
      d = CLOTH.wine;
    body(c, g);
    c.rect(4, 1, 7, 9, d);
    P(c, CLOTH.cream, [5, 3, 6, 6, 5, 8, 7, 4, 4, 5]);
    c.col(3, 2, 9, lite(g));
    c.col(8, 2, 9, dark(g));
    P(c, C.brown, [8, 4, 8, 6, 8, 8]);
    c.set(3, 3, GOLD);
    c.row(1, 5, 6, CLOTH.cream);
  });
  T('parka olive fur collar pockets', (c) => {
    const g = C.olive;
    body(c, g);
    c.row(1, 2, 9, FUR);
    P(c, FUR, [3, 2, 4, 2, 7, 2, 8, 2, 4, 3, 7, 3]);
    P(c, dark(FUR), [3, 1, 6, 1, 9, 1, 8, 2, 7, 3]);
    P(c, lite(FUR), [2, 1, 4, 1]);
    c.col(5, 2, 9, dark(g));
    c.col(6, 3, 9, lite(g));
    c.row(6, 2, 4, dark(g));
    c.row(6, 7, 9, dark(g));
    P(c, C.brown, [3, 7, 8, 7]);
    c.row(9, 2, 9, dark(g));
  });
  T('bath towel wrap bare fair shoulders', (c) => {
    const s = SKINS.fair,
      t = C.towel;
    body(c, s);
    c.rect(2, 4, 9, 9, t);
    c.col(9, 4, 9, dark(t));
    c.row(4, 2, 8, lite(t));
    P(c, dark(t), [7, 5, 8, 5, 8, 4, 7, 6, 4, 7, 4, 8, 4, 9]);
    c.row(8, 5, 9, C.sky);
    c.set(9, 8, dark(C.sky));
    P(c, dark(s), [4, 2, 7, 2]);
    P(c, hex('#6f8fae'), [3, 2]);
  });

  /* ---------- arms ---------- */
  A('dust coat grey-blue sleeve rolled cuff fair hand', (c) => {
    m.sleeve(c, DUST, SKINS.fair);
    c.rect(1, 6, 3, 7, lite(DUST));
    c.set(3, 7, DUST);
    c.row(8, 1, 3, SKINS.fair);
    c.set(3, 8, dark(SKINS.fair));
  });
  A('bare tan arm hairy tattoo', (c) => {
    const s = SKINS.tan;
    c.rect(1, 0, 3, 10, s);
    c.col(3, 0, 10, dark(s));
    c.set(1, 0, lite(s));
    P(c, INK, [2, 2, 1, 3, 2, 3, 2, 4, 1, 5, 2, 5]);
    P(c, dark(s), [1, 7, 2, 8]);
  });
  A('tracksuit navy sleeve white stripe pale hand', (c) => {
    m.sleeve(c, CLOTH.navy, SKINS.pale, WHITE);
    c.col(2, 0, 7, WHITE);
  });
  A('parka olive sleeve fur cuff brown hand', (c) => {
    m.sleeve(c, C.olive, SKINS.brown);
    c.rect(0, 7, 4, 8, FUR);
    P(c, dark(FUR), [1, 8, 3, 8, 4, 7]);
    c.set(2, 2, dark(C.olive));
    c.set(2, 3, dark(C.olive));
  });
  A('housecoat lilac short sleeve yellow rubber glove pale', (c) => {
    m.shortSleeve(c, C.lilac, SKINS.pale, 3);
    c.row(3, 1, 3, WHITE);
    c.rect(1, 6, 3, 10, C.hivis);
    c.col(3, 6, 10, dark(C.hivis));
    c.row(6, 0, 4, lite(C.hivis));
    c.set(4, 6, C.hivis);
  });

  /* ---------- legs ---------- */
  L('work trousers grey worn knee brown boots', (c) => {
    m.trousers(c, WORK);
    P(c, lite(WORK), [2, 4, 3, 4, 2, 5]);
    c.rect(1, 8, 4, 9, C.brown);
    shoe(c, C.brown);
    c.row(8, 1, 4, lite(C.brown));
  });
  L('housecoat lilac hem thick stockings pink slippers', (c) => {
    const g = C.lilac;
    c.rect(1, 6, 4, 9, C.beige);
    c.col(4, 6, 9, dark(C.beige));
    c.row(8, 1, 3, dark(C.beige)); // wrinkled at the ankle
    c.rect(1, 0, 4, 5, g);
    c.col(4, 0, 5, dark(g));
    P(c, C.rose, [2, 2, 3, 4]);
    P(c, CLOTH.forest, [2, 3]);
    shoe(c, C.pink);
    P(c, lite(C.pink), [3, 10, 4, 10]);
  });
  L('tracksuit bottoms navy white stripe white trainers', (c) => {
    m.trousers(c, CLOTH.navy);
    c.col(3, 0, 9, WHITE);
    shoe(c, WHITE);
    c.set(3, 10, CLOTH.navy);
    c.set(1, 10, dark(WHITE));
  });
  L('jeans faded fur winter boots', (c) => {
    m.trousers(c, C.faded);
    c.col(2, 1, 6, lite(C.faded));
    c.rect(1, 7, 4, 9, C.brown);
    c.col(4, 7, 9, dark(C.brown));
    c.row(7, 0, 4, FUR);
    c.set(5, 7, dark(FUR));
    shoe(c, C.brown);
  });
  L('bath towel hem bare wet fair legs bare feet', (c) => {
    const s = SKINS.fair;
    m.bareLeg(c, s, 3);
    c.clear(1, 5);
    c.clear(1, 6);
    c.clear(1, 7);
    c.clear(1, 8);
    c.clear(1, 9);
    c.rect(1, 0, 4, 3, C.towel);
    c.col(4, 0, 3, dark(C.towel));
    c.row(1, 1, 4, C.sky);
    c.set(4, 1, dark(C.sky));
    m.foot(c, s);
    c.clear(1, 10);
    c.clear(1, 11);
    P(c, hex('#6f8fae'), [3, 6]);
  });
};
