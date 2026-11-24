/* street — people of the street. */
module.exports = (m) => {
  const { SKINS, HAIR, CLOTH, HAIRS, HATS, K, WHITE, BONE, RED, GOLD, hex, mix, dark, lite, body, shoe, C, P, H, HS, T, A, L } = m;
  const FIRE = hex('#3d3a33'),
    HELM = hex('#b89a2e'),
    STRAW = hex('#c2ae78'),
    RUBBER = hex('#33323a'),
    TEAR = hex('#6f8fae'),
    BOOT = hex('#8a6a42');

  const hardhat = (c, col) => {
    c.row(0, 5, 8, col);
    c.rect(4, 1, 9, 2, col);
    P(c, col, [3, 2, 10, 2]);
    c.row(3, 2, 12, col);
    c.col(6, 0, 2, lite(col));
    P(c, lite(col), [4, 1, 2, 3, 3, 3]);
    P(c, dark(col), [10, 2, 9, 1, 11, 3, 12, 3, 8, 0]);
  };
  const fireHelmet = (c) => {
    c.row(0, 5, 8, HELM);
    c.row(1, 4, 9, HELM);
    c.row(2, 3, 10, HELM);
    c.row(3, 2, 11, HELM);
    c.col(6, 0, 1, lite(HELM));
    c.col(7, 0, 1, lite(HELM));
    P(c, C.silver, [6, 2, 7, 2, 6, 3]);
    P(c, dark(C.silver), [7, 3]);
    P(c, dark(HELM), [10, 2, 11, 3, 9, 1, 10, 3]);
    P(c, lite(HELM), [4, 1, 3, 2, 2, 3]);
    c.col(2, 4, 9, FIRE); // the neck curtain
    c.col(11, 4, 9, dark(FIRE));
  };

  /* ---------- heads ---------- */
  H('police officer peaked cap navy checked band tan', 'tan', 'calm', (c, s) => {
    P(c, HAIR.black, [3, 4, 10, 4]);
    m.peaked(c, CLOTH.navy, K, C.silver);
    P(c, WHITE, [4, 2, 6, 2, 8, 2, 10, 2]);
    P(c, dark(s), [4, 5, 5, 5, 8, 5, 9, 5]); // a heavy brow
  });
  H('police woman bowler hat navy checked band blond bun pale', 'pale', 'calm', (c, s) => {
    const h = HAIR.blond;
    P(c, h, [3, 4, 3, 5, 2, 5, 2, 6]);
    P(c, dark(h), [10, 4, 10, 5, 11, 5, 11, 6, 12, 6, 12, 7, 11, 7]);
    HATS.bowler(c, CLOTH.navy);
    c.set(5, 0, lite(CLOTH.navy));
    P(c, WHITE, [4, 2, 6, 2, 8, 2]);
    P(c, K, [5, 2, 7, 2, 9, 2]);
    P(c, C.silver, [6, 1, 7, 1]);
  });
  H('firefighter helmet yellow soot fair', 'fair', 'calm', (c, s) => {
    fireHelmet(c);
    P(c, mix(s, 0.55), [4, 8, 4, 7, 9, 5, 8, 10]); // soot
    c.set(10, 6, TEAR); // sweat
  });
  HS('firefighter breathing mask helmet yellow', (c) => {
    c.rect(3, 4, 10, 10, RUBBER);
    c.row(11, 4, 9, RUBBER);
    fireHelmet(c);
    c.rect(4, 5, 9, 7, C.lens);
    P(c, lite(C.lens), [4, 5, 5, 5, 4, 6]);
    P(c, dark(C.lens), [9, 7, 8, 7, 9, 6]);
    c.rect(5, 9, 8, 11, C.steel);
    P(c, K, [6, 10, 7, 10]);
    P(c, lite(C.steel), [5, 9]);
    P(c, dark(C.steel), [8, 11, 8, 10]);
    P(c, RUBBER, [9, 11, 10, 12, 10, 11]);
  });
  H('bus driver peaked cap grey glasses moustache brown tired', 'brown', 'calm', (c, s) => {
    const h = HAIR.grey;
    P(c, h, [3, 4, 3, 5]);
    P(c, dark(h), [10, 4, 10, 5]);
    m.peaked(c, C.charcoal, CLOTH.wine, GOLD);
    m.specs(c, GOLD);
    m.moustache(c, h);
    P(c, dark(s), [5, 7, 8, 7]);
  });
  H('road worker hard hat yellow stubble tan', 'tan', 'calm', (c, s) => {
    hardhat(c, C.hivis);
    m.stubble(c, s, 0.75);
    P(c, HAIR.black, [3, 4, 10, 4]);
  });
  H('road worker hard hat orange ear defenders safety glasses red hair pale', 'pale', 'calm', (c, s) => {
    P(c, HAIR.red, [3, 4, 10, 4, 3, 8, 3, 9, 2, 9]);
    hardhat(c, C.orange);
    c.rect(1, 5, 2, 7, C.charcoal);
    c.rect(11, 5, 12, 7, C.charcoal);
    P(c, RED, [1, 6, 12, 6]);
    P(c, C.charcoal, [2, 4, 11, 4]);
    P(c, C.lens, [4, 6, 6, 6, 7, 6, 9, 6, 3, 6, 10, 6]);
    P(c, lite(C.lens), [4, 5, 5, 5, 6, 5, 7, 5, 8, 5, 9, 5]);
  });
  H('busker wide hat feather long brown hair beard fair', 'fair', 'grin', (c, s) => {
    const t = CLOTH.earth,
      h = HAIR.brown;
    c.col(2, 4, 10, h);
    c.col(11, 4, 10, dark(h));
    P(c, h, [3, 4, 3, 5, 3, 6, 1, 9, 1, 10]);
    P(c, dark(h), [10, 4, 10, 5, 10, 6, 12, 9, 12, 10]);
    c.row(0, 5, 8, t);
    c.rect(4, 1, 9, 1, t);
    c.row(2, 4, 9, dark(t));
    c.row(3, 1, 12, t);
    P(c, lite(t), [5, 0, 4, 1, 1, 3, 2, 3]);
    P(c, dark(t), [11, 3, 12, 3, 9, 1]);
    P(c, RED, [10, 0, 10, 1, 11, 0]);
    c.set(10, 2, dark(RED));
    m.beard(c, h);
    m.moustache(c, h);
  });
  H('jogger white sweatband ponytail black hair sweating brown', 'brown', 'calm', (c, s) => {
    const h = HAIR.black;
    c.row(1, 4, 9, h);
    c.row(2, 3, 10, h);
    P(c, h, [11, 2, 12, 2, 12, 3, 13, 4, 12, 4]);
    P(c, dark(h), [13, 5, 12, 5]);
    c.set(5, 1, mix(h, 2.4));
    c.row(3, 3, 10, WHITE);
    c.set(10, 3, dark(WHITE));
    P(c, RED, [6, 3, 7, 3]);
    P(c, WHITE, [3, 4]);
    P(c, TEAR, [10, 6]);
  });
  H('tourist straw sunhat sunglasses sunburnt nose red hair pale', 'pale', 'grin', (c, s) => {
    P(c, HAIR.red, [3, 4, 3, 5, 10, 4]);
    c.row(0, 4, 9, STRAW);
    c.row(1, 3, 10, STRAW);
    c.row(2, 3, 10, CLOTH.teal);
    c.row(3, 0, 13, STRAW);
    c.row(4, 2, 11, dark(STRAW));
    P(c, lite(STRAW), [4, 0, 5, 0, 3, 1, 0, 3, 1, 3, 2, 3, 3, 3]);
    P(c, dark(STRAW), [10, 1, 12, 3, 13, 3, 9, 0]);
    c.set(10, 2, dark(CLOTH.teal));
    m.shades(c);
    P(c, hex('#b0605a'), [7, 7, 7, 8, 6, 8]);
  });
  H('homeless man woolly hat forest grey beard ashen', 'ashen', 'calm', (c, s) => {
    const h = HAIR.grey;
    m.beanie(c, CLOTH.forest);
    c.set(8, 1, K); // a hole
    P(c, h, [3, 5, 3, 6, 2, 6, 2, 7]);
    P(c, dark(h), [10, 5, 10, 6, 11, 6, 11, 7]);
    m.beard(c, h);
    m.moustache(c, h);
    P(c, h, [5, 10, 6, 10, 6, 12, 5, 12, 2, 8, 3, 10, 4, 11]);
    P(c, dark(h), [7, 10, 8, 11, 7, 12, 8, 12, 11, 8, 10, 10, 9, 11]);
    P(c, dark(s), [4, 7, 5, 7, 8, 7, 9, 7]);
  });

  /* ---------- torsos ---------- */
  T('police uniform navy radio badge belt', (c) => {
    const g = hex('#232a40');
    body(c, g);
    P(c, WHITE, [5, 1, 6, 1, 5, 2, 6, 2]);
    P(c, K, [5, 3, 6, 3, 5, 4]);
    P(c, C.silver, [1, 1, 10, 1, 3, 4]);
    P(c, lite(g), [4, 1, 4, 2, 7, 1, 7, 2]);
    c.rect(7, 4, 8, 5, K);
    c.set(8, 3, C.steel); // the aerial
    c.set(7, 4, RED);
    c.row(8, 2, 9, K);
    P(c, C.silver, [5, 8, 6, 8]);
  });
  T('firefighter coat dark reflective yellow silver bands', (c) => {
    const g = FIRE;
    body(c, g);
    c.row(1, 4, 7, lite(g));
    c.row(3, 2, 9, C.hivis);
    c.row(4, 2, 9, C.silver);
    c.row(8, 2, 9, C.hivis);
    P(c, dark(C.hivis), [9, 3, 9, 8]);
    P(c, dark(C.silver), [9, 4]);
    c.col(5, 2, 9, dark(g));
    P(c, C.steel, [6, 5, 6, 7]);
    c.set(1, 1, lite(g));
  });
  T('bus driver shirt pale blue navy tie name badge', (c) => {
    const g = C.sky;
    body(c, g);
    P(c, lite(g), [4, 1, 4, 2, 7, 1, 7, 2]);
    c.row(1, 1, 2, CLOTH.navy);
    c.row(1, 9, 10, dark(CLOTH.navy));
    c.col(5, 2, 8, CLOTH.navy);
    c.set(6, 2, CLOTH.navy);
    c.set(6, 7, CLOTH.navy);
    c.row(4, 7, 8, WHITE);
    c.set(7, 4, RED);
    P(c, dark(g), [2, 3, 2, 4, 9, 3]); // sweat under the arms
    c.row(9, 2, 9, C.charcoal);
  });
  T('hi-vis vest yellow silver bands over grey t-shirt', (c) => {
    const g = C.grey,
      v = C.hivis;
    body(c, g);
    c.rect(2, 1, 4, 9, v);
    c.rect(7, 1, 9, 9, v);
    c.col(9, 2, 9, dark(v));
    c.col(4, 1, 2, g);
    c.col(7, 1, 2, g);
    for (const y of [5, 8]) {
      c.row(y, 2, 4, C.silver);
      c.row(y, 7, 9, C.silver);
      c.set(9, y, dark(C.silver));
    }
    c.set(2, 1, lite(v));
    P(c, dark(g), [5, 2, 6, 2, 5, 7]);
  });
  T('hi-vis jacket orange silver braces dirty', (c) => {
    const g = C.orange;
    body(c, g);
    c.col(3, 1, 6, C.silver);
    c.col(8, 1, 6, dark(C.silver));
    c.row(7, 2, 9, C.silver);
    c.set(9, 7, dark(C.silver));
    c.col(5, 2, 9, dark(g));
    c.set(5, 7, C.steel);
    P(c, lite(g), [4, 1, 7, 1]);
    P(c, mix(g, 0.55), [6, 8, 7, 9, 2, 9, 6, 4]);
  });
  T('busker waistcoat earth patched cream shirt guitar strap', (c) => {
    const g = CLOTH.cream,
      w = CLOTH.earth;
    body(c, g);
    c.rect(2, 2, 4, 9, w);
    c.rect(7, 2, 9, 9, w);
    c.col(9, 2, 9, dark(w));
    P(c, w, [3, 1, 8, 1]);
    P(c, dark(g), [5, 2, 6, 2, 5, 5, 5, 8]);
    P(c, CLOTH.mustard, [3, 7, 4, 7, 3, 8]); // a patch
    P(c, CLOTH.wine, [9, 2, 8, 3, 7, 4, 6, 5, 5, 6, 4, 7, 3, 8, 2, 9]);
    P(c, GOLD, [7, 4, 4, 7]);
  });
  T('jogger running vest teal number bib bare brown shoulders', (c) => {
    const s = SKINS.brown,
      g = CLOTH.teal;
    body(c, s);
    c.rect(2, 3, 9, 9, g);
    c.col(9, 3, 9, dark(g));
    P(c, g, [3, 1, 3, 2, 8, 1, 8, 2, 4, 3, 7, 3]);
    c.row(3, 5, 6, s);
    c.set(6, 3, dark(s));
    c.rect(3, 5, 8, 7, WHITE);
    P(c, K, [4, 5, 4, 6, 4, 7, 6, 5, 7, 5, 7, 6, 6, 7, 7, 7]);
    c.set(8, 7, dark(WHITE));
    c.set(2, 3, lite(g));
  });
  T('tourist flowered shirt teal camera strap', (c) => {
    const g = hex('#3f6a6a');
    body(c, g);
    P(c, lite(g), [4, 1, 7, 1]);
    P(c, C.butter, [2, 3, 8, 2, 3, 6, 9, 5, 2, 9, 8, 9]);
    P(c, C.rose, [3, 2, 9, 3, 2, 7, 8, 6]);
    P(c, K, [4, 2, 4, 3, 4, 4, 7, 2, 7, 3, 7, 4, 5, 1, 6, 1]);
    c.rect(4, 5, 7, 7, C.charcoal);
    P(c, C.silver, [5, 6, 6, 6]);
    P(c, K, [5, 5, 6, 7]);
    c.set(7, 5, RED);
    c.set(4, 5, lite(C.charcoal));
  });

  /* ---------- arms ---------- */
  A('police navy sleeve silver chevrons black glove', (c) => {
    const g = hex('#232a40');
    m.sleeve(c, g, K);
    P(c, C.silver, [1, 2, 2, 3, 3, 2]);
    c.row(8, 1, 3, C.charcoal);
    c.set(1, 9, C.charcoal);
  });
  A('firefighter sleeve dark reflective band leather glove', (c) => {
    m.sleeve(c, FIRE, BOOT);
    c.row(5, 1, 3, C.hivis);
    c.row(6, 1, 3, C.silver);
    c.set(3, 5, dark(C.hivis));
    c.set(3, 6, dark(C.silver));
    c.rect(0, 8, 4, 8, BOOT);
    c.set(4, 8, dark(BOOT));
    c.set(1, 9, lite(BOOT));
  });
  A('hi-vis orange sleeve silver band work glove', (c) => {
    m.sleeve(c, C.orange, C.beige);
    c.row(4, 1, 3, C.silver);
    c.set(3, 4, dark(C.silver));
    c.row(8, 1, 3, C.beige);
    c.row(8, 1, 3, dark(C.beige));
    c.set(2, 6, mix(C.orange, 0.55));
  });
  A('jogger bare brown arm white sweatband watch', (c) => {
    const s = SKINS.brown;
    c.rect(1, 0, 3, 10, s);
    c.col(3, 0, 10, dark(s));
    c.set(1, 0, lite(s));
    c.rect(1, 7, 3, 8, WHITE);
    c.set(3, 7, dark(WHITE));
    c.set(3, 8, dark(WHITE));
    c.row(0, 1, 3, CLOTH.teal);
  });
  A('tourist flowered teal short sleeve sunburnt pale arm', (c) => {
    const s = hex('#c69a88'),
      g = hex('#3f6a6a');
    m.shortSleeve(c, g, s, 3);
    c.set(2, 1, C.butter);
    c.set(1, 3, C.rose);
    c.row(4, 1, 3, SKINS.pale); // where the sleeve was yesterday
    c.set(3, 4, dark(SKINS.pale));
  });

  /* ---------- legs ---------- */
  L('police trousers navy black shoes', (c) => {
    const g = hex('#232a40');
    m.trousers(c, g);
    c.col(2, 1, 9, lite(g));
    shoe(c, K);
    c.set(2, 10, C.steel);
  });
  L('firefighter trousers dark reflective band black boots', (c) => {
    m.trousers(c, FIRE);
    c.row(5, 1, 4, C.hivis);
    c.row(6, 1, 4, C.silver);
    c.set(4, 5, dark(C.hivis));
    c.set(4, 6, dark(C.silver));
    c.rect(1, 8, 4, 9, K);
    c.row(8, 1, 4, C.charcoal);
    shoe(c, K);
    c.set(4, 10, C.hivis);
  });
  L('work trousers orange hi-vis knee pads tan work boots', (c) => {
    m.trousers(c, C.orange);
    c.rect(1, 4, 4, 5, C.charcoal);
    c.set(4, 4, K);
    c.set(4, 5, K);
    c.row(7, 1, 4, C.silver);
    c.set(4, 7, dark(C.silver));
    c.rect(1, 9, 4, 9, BOOT);
    shoe(c, BOOT);
    c.set(4, 10, lite(BOOT));
    c.set(2, 2, mix(C.orange, 0.55));
  });
  L('jogger shorts black bare brown legs white trainers', (c) => {
    const s = SKINS.brown;
    m.bareLeg(c, s, 3);
    c.rect(1, 0, 4, 2, C.charcoal);
    c.col(4, 0, 2, K);
    c.set(3, 2, WHITE);
    c.set(2, 5, lite(s));
    c.row(9, 1, 4, WHITE);
    shoe(c, WHITE);
    c.set(3, 10, CLOTH.teal);
    c.set(2, 10, CLOTH.teal);
  });
  L('tourist shorts beige pale legs white socks sandals', (c) => {
    const s = SKINS.pale;
    m.bareLeg(c, s, 5);
    c.rect(1, 0, 4, 4, C.beige);
    c.col(4, 0, 4, dark(C.beige));
    c.set(3, 2, dark(C.beige)); // a cargo pocket
    c.set(3, 3, dark(C.beige));
    c.set(2, 2, dark(C.beige));
    c.rect(1, 7, 4, 9, WHITE);
    c.col(4, 7, 9, dark(WHITE));
    shoe(c, WHITE);
    P(c, C.brown, [2, 10, 4, 10, 1, 11, 2, 11, 3, 11, 4, 11, 5, 11]);
  });
};
