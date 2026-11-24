/* urban — the rough side of town. */
module.exports = (m) => {
  const { SKINS, HAIR, CLOTH, HAIRS, HATS, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite, body, shoe, C, P, H, HS, T, A, L } = m;
  const BRUISE = hex('#5a4468'),
    GLOVE = hex('#9a2f2a'),
    INK = hex('#3d4a5a'),
    BLACK = hex('#24212a'),
    OIL = hex('#17151b');

  /* ---------- heads ---------- */
  H('punk mohawk wine red studs nose ring pale angry', 'pale', 'angry', (c, s) => {
    const h = hex('#8a2a34');
    c.rect(5, 1, 8, 3, h);
    P(c, h, [5, 0, 7, 0, 8, 0, 6, 4, 7, 4]);
    P(c, lite(h), [5, 1, 5, 2, 6, 0]);
    P(c, dark(h), [8, 1, 8, 2, 8, 3, 7, 4]);
    P(c, mix(s, 0.82), [3, 4, 4, 3, 4, 4, 9, 3, 9, 4, 10, 4, 3, 5]); // shaved sides
    P(c, C.silver, [8, 8, 2, 7, 11, 5]);
    P(c, s, [2, 6, 11, 6]);
  });
  H('punk girl spiky plum hair eyeliner lip ring fair', 'fair', 'calm', (c, s) => {
    const h = hex('#4a2f55');
    c.row(2, 3, 10, h);
    c.row(3, 3, 10, h);
    P(c, h, [3, 1, 5, 1, 6, 1, 8, 1, 10, 1, 2, 0, 5, 0, 8, 0, 11, 0, 2, 2, 11, 2, 3, 4, 4, 4, 5, 4, 3, 5, 3, 6, 2, 4]);
    P(c, dark(h), [10, 4, 9, 2, 10, 3]);
    P(c, lite(h), [3, 2, 5, 2, 4, 3]);
    P(c, K, [4, 6, 9, 6, 4, 5, 9, 5]);
    c.row(9, 6, 7, hex('#3a1f2a'));
    c.set(8, 10, C.silver);
  });
  HS('hooded figure face in shadow pale eyes black hood', (c) => {
    const g = BLACK;
    c.row(3, 4, 9, OIL);
    c.rect(4, 4, 9, 10, OIL);
    c.row(11, 5, 8, OIL);
    HATS.hood(c, g);
    c.row(0, 5, 8, g);
    P(c, lite(g), [4, 1, 3, 2, 2, 3, 5, 0]);
    P(c, hex('#3a3542'), [4, 4, 4, 5, 9, 4, 5, 3, 8, 3]);
    P(c, BONE, [5, 6, 8, 6]);
  }, { shade: false });
  H('gaunt figure charcoal hood sunken eyes rotten', 'rotten', 'hollow', (c, s) => {
    HATS.hood(c, C.charcoal);
    P(c, lite(C.charcoal), [4, 1, 3, 2]);
    P(c, dark(s), [4, 7, 5, 7, 8, 7, 9, 7, 4, 8, 9, 8, 4, 3, 9, 3]);
    P(c, mix(s, 0.5), [6, 4, 9, 9]); // sores
    c.row(3, 5, 8, HAIR.black);
  });
  H('security guard black cap earpiece goatee fair', 'fair', 'calm', (c, s) => {
    m.ballcap(c, BLACK, C.hivis);
    P(c, HAIR.brown, [3, 5, 10, 5]);
    P(c, HAIR.brown, [5, 10, 6, 10, 7, 10, 8, 10, 6, 11, 7, 11, 5, 8, 8, 8]);
    P(c, WHITE, [11, 7, 11, 8, 11, 9, 11, 10]);
    c.set(11, 6, C.steel);
    c.set(11, 5, C.steel);
    P(c, dark(s), [4, 5, 5, 5, 8, 5, 9, 5]);
  });
  H('mechanic backwards cap grey grease stubble tan', 'tan', 'grin', (c, s) => {
    const g = C.grey;
    c.row(1, 5, 8, g);
    c.row(2, 4, 9, g);
    c.row(3, 3, 10, g);
    P(c, s, [6, 3, 7, 3]); // the gap of the strap
    P(c, C.charcoal, [5, 3, 8, 3, 6, 2, 7, 2]);
    P(c, lite(g), [5, 1, 4, 2]);
    P(c, dark(g), [9, 2, 10, 3]);
    P(c, HAIR.black, [3, 4, 10, 4]);
    m.stubble(c, s, 0.78);
    P(c, OIL, [4, 7, 4, 8, 9, 5, 8, 4]);
  });
  H('skater beanie mustard long blond hair plaster pale', 'pale', 'calm', (c, s) => {
    const h = HAIR.blond;
    c.col(2, 4, 9, h);
    c.col(3, 5, 8, h);
    c.col(11, 4, 9, dark(h));
    c.col(10, 5, 7, dark(h));
    P(c, h, [4, 5, 5, 5, 4, 6]);
    m.beanie(c, CLOTH.mustard);
    P(c, WHITE, [8, 8, 9, 8]);
    c.set(9, 8, dark(WHITE));
  });
  H('boxer leather headguard wine brown', 'brown', 'angry', (c, s) => {
    const g = hex('#7a2a2e');
    c.row(1, 4, 9, g);
    c.row(2, 3, 10, g);
    c.rect(2, 3, 11, 4, g);
    c.col(2, 5, 9, g);
    c.col(3, 5, 9, g);
    c.col(11, 5, 9, dark(g));
    c.col(10, 5, 9, dark(g));
    P(c, g, [4, 8, 4, 9]);
    P(c, dark(g), [9, 8, 9, 9, 10, 2, 11, 3, 10, 3, 10, 4, 11, 4]);
    P(c, lite(g), [4, 1, 3, 2, 2, 3]);
    c.row(4, 5, 8, dark(g));
    P(c, WHITE, [6, 2, 7, 2]);
  });
  H('boxer shaved head black eye plaster split lip pale', 'pale', 'calm', (c, s) => {
    const st = mix(s, 0.8);
    c.row(2, 4, 9, st);
    c.row(3, 3, 10, st);
    P(c, st, [3, 4, 10, 4]);
    P(c, BRUISE, [8, 5, 9, 5, 9, 6, 8, 7, 9, 7, 7, 6]);
    P(c, WHITE, [4, 4, 5, 4]);
    c.set(5, 4, dark(WHITE));
    P(c, RED, [5, 9, 5, 10]);
    P(c, s, [2, 6]);
    P(c, dark(s), [11, 6, 2, 7]);
    c.set(6, 8, dark(s)); // a nose broken more than once
  });
  H('biker bandana navy red beard sunglasses fair', 'fair', 'calm', (c, s) => {
    const h = HAIR.red,
      g = CLOTH.navy;
    c.row(1, 4, 9, g);
    c.rect(3, 2, 10, 3, g);
    c.row(4, 3, 10, dark(g));
    P(c, WHITE, [4, 2, 6, 3, 8, 2, 9, 3]);
    P(c, g, [11, 3, 12, 4, 12, 5]);
    P(c, dark(g), [11, 4, 10, 2]);
    c.set(5, 1, lite(g));
    m.shades(c);
    m.beard(c, h);
    m.moustache(c, h);
    P(c, h, [5, 10, 6, 10, 6, 12, 5, 12, 4, 11]);
    P(c, dark(h), [7, 10, 8, 11, 7, 12, 9, 11]);
  });
  HS('balaclava black knitted eye slit', (c) => {
    const g = BLACK,
      s = SKINS.tan;
    c.row(1, 4, 9, g);
    c.row(2, 3, 10, g);
    c.rect(3, 3, 10, 10, g);
    c.row(11, 4, 9, g);
    c.row(12, 4, 9, dark(g));
    P(c, lite(g), [4, 1, 3, 2, 3, 3, 5, 1]);
    c.row(6, 4, 9, s);
    P(c, K, [5, 6, 8, 6]);
    c.set(9, 6, dark(s));
    for (const y of [4, 8, 10]) for (let x = 4; x <= 9; x += 2) c.set(x, y, hex('#35313d'));
    P(c, OIL, [6, 9, 7, 9]);
    c.col(10, 3, 10, dark(g));
  }, { shade: false });

  /* ---------- torsos ---------- */
  T('leather jacket black zip studs', (c) => {
    const g = C.leather;
    body(c, g);
    c.rect(5, 1, 6, 2, WHITE);
    P(c, lite(lite(g)), [4, 1, 4, 2, 3, 2, 4, 3, 7, 1, 7, 2, 8, 2, 7, 3, 1, 1]);
    P(c, C.silver, [5, 3, 5, 4, 6, 5, 6, 6, 6, 7, 6, 8]);
    P(c, C.silver, [3, 3, 8, 3, 1, 1, 10, 1]);
    c.row(9, 2, 9, K);
    P(c, C.silver, [7, 9, 8, 9]);
    P(c, lite(g), [2, 5, 3, 6, 2, 6]);
  });
  T('bomber jacket olive orange lining ribbed hem', (c) => {
    const g = C.olive;
    body(c, g);
    c.row(1, 3, 8, dark(g));
    P(c, C.orange, [5, 2, 6, 2, 5, 3]);
    c.col(5, 4, 8, C.steel);
    c.row(9, 2, 9, dark(g));
    P(c, lite(g), [3, 9, 5, 9, 7, 9]);
    P(c, lite(g), [2, 3, 3, 4, 2, 4]);
    c.rect(7, 4, 8, 5, CLOTH.rust); // a patch
    c.set(8, 5, dark(CLOTH.rust));
    c.set(3, 6, dark(g));
    c.set(3, 7, dark(g));
  });
  T('mechanic overalls navy name patch oil stains', (c) => {
    const g = hex('#2f3c58');
    body(c, g);
    c.rect(5, 1, 6, 3, C.grey);
    P(c, lite(g), [4, 1, 4, 2, 4, 3, 7, 1, 7, 2, 7, 3]);
    c.col(5, 4, 9, C.steel);
    c.rect(7, 4, 8, 4, WHITE);
    c.set(7, 4, RED);
    P(c, OIL, [3, 6, 3, 7, 4, 7, 7, 8, 2, 4, 6, 6]);
    c.row(8, 2, 4, dark(g));
    c.set(3, 9, RED); // a rag in the pocket
    c.set(2, 9, dark(RED));
  });
  T('security guard black jumper yellow band radio', (c) => {
    const g = BLACK;
    body(c, g);
    c.rect(2, 4, 9, 5, C.hivis);
    P(c, K, [3, 4, 5, 4, 7, 4, 4, 5, 6, 5, 8, 5]);
    P(c, dark(C.hivis), [9, 4, 9, 5]);
    c.row(1, 1, 2, C.steel);
    c.row(1, 9, 10, dark(C.steel));
    P(c, WHITE, [5, 2, 6, 2]);
    c.rect(7, 2, 8, 3, C.charcoal);
    c.set(8, 1, C.steel);
    c.set(7, 2, RED);
    c.row(8, 2, 9, K);
    P(c, C.silver, [5, 8, 3, 7, 3, 8]);
  });
  T('punk torn black t-shirt skull print safety pins pale', (c) => {
    const g = BLACK,
      s = SKINS.pale;
    body(c, g);
    c.rect(4, 3, 7, 5, BONE);
    P(c, K, [5, 4, 7, 4, 5, 6, 7, 6]);
    c.row(6, 5, 6, BONE);
    c.set(4, 3, g);
    P(c, s, [5, 1, 6, 1, 4, 1, 7, 1, 2, 8, 3, 8, 8, 7, 3, 2]);
    P(c, dark(s), [9, 8, 8, 8]);
    P(c, C.silver, [2, 7, 3, 7, 8, 6, 9, 6]);
    c.clear(2, 9);
    c.clear(5, 9);
    c.clear(8, 9);
  });
  T('denim vest patches studs over black t-shirt', (c) => {
    const d = C.denim,
      g = BLACK;
    body(c, g);
    c.rect(2, 2, 4, 9, d);
    c.rect(7, 2, 9, 9, d);
    c.col(9, 2, 9, dark(d));
    P(c, d, [2, 1, 3, 1, 8, 1, 9, 1]);
    P(c, C.silver, [2, 1, 9, 1, 4, 3, 7, 3]);
    P(c, RED, [3, 4]);
    c.rect(8, 5, 8, 6, CLOTH.mustard);
    P(c, WHITE, [3, 7, 2, 7]);
    P(c, K, [3, 6, 8, 8]);
    P(c, lite(d), [2, 2, 2, 3]);
    P(c, dark(d), [4, 9, 7, 9, 2, 9]);
    c.set(1, 1, SKINS.fair);
    c.set(10, 1, dark(SKINS.fair));
  });
  T('boxer bare brown chest towel round neck', (c) => {
    const s = SKINS.brown,
      t = C.towel;
    body(c, s);
    c.row(4, 3, 4, dark(s));
    c.row(4, 7, 8, dark(s));
    P(c, dark(s), [5, 6, 6, 6, 5, 8, 6, 8, 5, 5]);
    c.rect(3, 1, 4, 5, t);
    c.rect(7, 1, 8, 5, t);
    P(c, dark(t), [4, 5, 8, 1, 8, 2, 8, 3, 8, 4, 8, 5, 3, 5]);
    c.set(3, 1, lite(t));
    P(c, RED, [3, 4, 7, 4]);
    c.row(9, 2, 9, hex('#7a2a2e'));
    P(c, GOLD, [5, 9, 6, 9]);
    c.set(9, 6, BRUISE);
  });
  T('skater long t-shirt cream rust stripes', (c) => {
    const g = CLOTH.cream;
    body(c, g);
    for (const y of [3, 6]) {
      c.row(y, 2, 9, CLOTH.rust);
      c.set(9, y, dark(CLOTH.rust));
    }
    c.row(1, 4, 7, dark(g));
    P(c, dark(g), [5, 2, 6, 2]);
    c.row(9, 2, 9, dark(g));
    P(c, C.steel, [7, 8, 8, 9, 6, 9]); // a chain
    c.set(3, 8, mix(g, 0.8));
  });

  /* ---------- arms ---------- */
  A('leather jacket black sleeve studs fingerless glove', (c) => {
    const g = C.leather;
    m.sleeve(c, g, SKINS.pale);
    P(c, lite(lite(g)), [1, 1, 1, 2, 2, 4]);
    P(c, C.silver, [2, 0, 3, 7, 3, 6]);
    c.rect(1, 8, 3, 9, K);
    c.set(1, 10, SKINS.pale);
    c.set(2, 10, SKINS.pale);
    c.set(2, 9, C.silver);
  });
  A('bomber olive sleeve pocket ribbed cuff tan hand', (c) => {
    m.sleeve(c, C.olive, SKINS.tan, dark(C.olive));
    c.set(2, 8, lite(C.olive));
    c.row(7, 1, 3, dark(C.olive));
    c.set(2, 2, C.orange);
    c.set(2, 3, C.steel);
    c.set(2, 4, C.steel);
  });
  A('boxing glove red bare brown arm wraps', (c) => {
    const s = SKINS.brown;
    c.rect(1, 0, 3, 6, s);
    c.col(3, 0, 6, dark(s));
    c.set(1, 0, lite(s));
    c.row(6, 1, 3, WHITE);
    c.rect(0, 7, 4, 10, GLOVE);
    c.row(11, 1, 3, dark(GLOVE));
    c.col(4, 7, 10, dark(GLOVE));
    c.row(7, 1, 3, WHITE);
    c.set(3, 7, dark(WHITE));
    P(c, lite(GLOVE), [0, 8, 1, 8]);
    c.clear(0, 7);
    c.clear(4, 7);
    c.set(4, 9, GLOVE); // the thumb
  });
  A('tattooed bare pale arm studded wristband', (c) => {
    const s = SKINS.pale;
    c.rect(1, 0, 3, 10, s);
    c.col(3, 0, 10, dark(s));
    c.set(1, 0, lite(s));
    P(c, INK, [1, 2, 2, 2, 2, 3, 3, 3, 1, 4, 2, 5, 1, 5]);
    P(c, hex('#7a3a3a'), [2, 4]);
    c.row(8, 1, 3, K);
    P(c, C.silver, [1, 8, 3, 8]);
    c.row(0, 1, 3, BLACK);
  });
  A('mechanic navy sleeve rolled up oily tan hand', (c) => {
    const g = hex('#2f3c58'),
      s = SKINS.tan;
    c.rect(1, 0, 3, 10, s);
    c.col(3, 0, 10, dark(s));
    c.rect(1, 0, 3, 4, g);
    c.col(3, 0, 4, dark(g));
    c.set(1, 0, lite(g));
    c.row(4, 0, 4, lite(g));
    c.set(4, 4, g);
    P(c, OIL, [1, 9, 2, 10, 2, 7, 1, 10]);
  });

  /* ---------- legs ---------- */
  L('ripped jeans blue pale knees combat boots', (c) => {
    m.trousers(c, C.denim);
    P(c, SKINS.pale, [2, 4, 3, 4, 2, 5]);
    P(c, lite(C.denim), [1, 4, 3, 5, 2, 2, 3, 7]);
    c.rect(1, 7, 4, 9, K);
    P(c, C.steel, [2, 8, 3, 9, 2, 10]);
    c.row(7, 1, 4, C.charcoal);
    shoe(c, K);
    c.set(4, 10, C.charcoal);
  });
  L('black jeans wallet chain steel toe boots', (c) => {
    m.trousers(c, BLACK);
    c.set(2, 1, lite(lite(BLACK)));
    P(c, C.silver, [3, 0, 4, 1, 4, 2, 3, 3]);
    c.rect(1, 8, 4, 9, C.brown);
    shoe(c, C.brown);
    P(c, C.steel, [4, 10, 3, 10]);
    c.row(8, 1, 4, lite(C.brown));
  });
  L('overalls navy oil stains work boots', (c) => {
    const g = hex('#2f3c58');
    m.trousers(c, g);
    P(c, OIL, [2, 3, 3, 3, 2, 4, 3, 7, 1, 6]);
    c.set(3, 1, dark(g)); // a pocket for the spanner
    c.set(3, 2, C.silver);
    c.row(9, 1, 4, dark(g));
    shoe(c, hex('#4a3a2a'));
    c.set(4, 10, lite(hex('#4a3a2a')));
  });
  L('boxing trunks wine gold stripe bare brown legs boxing boots', (c) => {
    const s = SKINS.brown,
      g = hex('#7a2a2e');
    m.bareLeg(c, s, 5);
    c.rect(1, 0, 4, 4, g);
    c.col(4, 0, 4, dark(g));
    c.row(0, 1, 4, GOLD);
    c.col(3, 1, 4, GOLD);
    c.set(0, 4, g);
    c.rect(1, 7, 4, 9, BLACK);
    P(c, WHITE, [2, 7, 2, 8, 2, 9]);
    shoe(c, BLACK);
    c.set(1, 7, lite(lite(BLACK)));
  });
  L('skater cargo shorts olive pale shins scab skate shoes', (c) => {
    const s = SKINS.pale;
    m.bareLeg(c, s, 6);
    c.rect(1, 0, 4, 5, C.khaki);
    c.col(4, 0, 5, dark(C.khaki));
    c.rect(2, 2, 3, 3, dark(C.khaki));
    c.set(0, 5, C.khaki);
    c.set(5, 5, dark(C.khaki));
    c.set(2, 7, hex('#7a3a3a'));
    c.row(9, 1, 4, WHITE);
    c.rect(0, 10, 5, 11, C.charcoal);
    c.row(11, 0, 5, WHITE);
    P(c, WHITE, [3, 10]);
  });
};
