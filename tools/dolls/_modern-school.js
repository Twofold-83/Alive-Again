/* school — teachers, pupils and the people who keep the building. */
module.exports = (m) => {
  const { SKINS, HAIR, CLOTH, HAIRS, HATS, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite, body, shoe, C, P, H, T, A, L } = m;
  const PINA = hex('#6a6a74'),
    BLOUSE = hex('#d6d2c4'),
    STRAW = hex('#c2ae78'),
    TEAR = hex('#6f8fae'),
    GOWN = hex('#24212a'),
    CHALK = hex('#cfcbbd');

  /* ---------- heads ---------- */
  H('teacher glasses tight bun brown hair fair stern', 'fair', 'calm', (c, s) => {
    const h = HAIR.brown;
    c.rect(5, 0, 8, 1, h);
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    P(c, h, [3, 4]);
    P(c, dark(h), [10, 4, 8, 1, 8, 0, 9, 2]);
    P(c, lite(h), [5, 0, 5, 2]);
    c.set(4, 1, C.steel); // a hairpin
    m.specs(c, C.steel);
    P(c, dark(s), [4, 4, 5, 4, 8, 4, 9, 4]);
    c.row(9, 6, 7, C.lip);
  });
  H('headmaster bald grey moustache half-moon glasses pale angry', 'pale', 'angry', (c, s) => {
    const h = HAIR.grey;
    P(c, h, [2, 5, 2, 6, 3, 5, 3, 6, 3, 4, 2, 7]);
    P(c, dark(h), [11, 5, 11, 6, 10, 5, 10, 6, 10, 4, 11, 7]);
    P(c, lite(s), [5, 3, 6, 3, 4, 4]);
    P(c, GOLD, [4, 7, 5, 7, 8, 7, 9, 7]);
    c.row(8, 4, 9, h);
    P(c, dark(h), [9, 8, 4, 9, 9, 9]);
    c.set(4, 9, h);
  });
  H('pupil girl pigtails ribbons red hair freckles pale', 'pale', 'grin', (c, s) => {
    const h = HAIR.red;
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    P(c, h, [3, 4, 6, 4, 2, 4, 1, 6, 1, 7, 1, 8, 2, 8, 1, 9]);
    P(c, dark(h), [10, 4, 11, 4, 12, 6, 12, 7, 12, 8, 11, 8, 12, 9]);
    c.set(5, 2, lite(h));
    P(c, CLOTH.navy, [1, 5, 2, 5, 12, 5, 11, 5]);
    P(c, lite(CLOTH.navy), [1, 4, 12, 4]);
    P(c, mix(s, 0.78), [4, 7, 5, 8, 9, 7, 8, 8]);
  });
  H('schoolboy cap navy gold badge brown', 'brown', 'calm', (c, s) => {
    const g = CLOTH.navy;
    c.row(1, 5, 8, g);
    c.row(2, 4, 9, g);
    c.row(3, 3, 10, g);
    c.row(4, 4, 10, dark(g));
    c.set(11, 4, dark(g));
    P(c, GOLD, [6, 2, 7, 2]);
    P(c, CLOTH.mustard, [5, 1, 8, 1, 4, 2, 9, 2, 3, 3, 10, 3]);
    c.set(6, 1, lite(g));
    P(c, HAIR.black, [3, 4, 3, 5, 10, 5]);
    P(c, s, [2, 6]);
    P(c, dark(s), [11, 6]);
  });
  H('sports coach forest cap whistle stubble tan', 'tan', 'calm', (c, s) => {
    m.ballcap(c, CLOTH.forest, WHITE);
    P(c, HAIR.brown, [3, 5, 10, 5]);
    m.stubble(c, s, 0.8);
    P(c, C.silver, [8, 9, 9, 9]);
    c.set(9, 9, dark(C.silver));
    P(c, RED, [9, 10, 10, 11, 10, 12]);
  });
  H('lunch lady hairnet grey hair mole rotten', 'rotten', 'calm', (c, s) => {
    const h = HAIR.grey,
      n = hex('#b9c4cc');
    c.row(0, 5, 8, h);
    c.row(1, 4, 9, h);
    c.rect(3, 2, 10, 3, h);
    P(c, h, [3, 4, 2, 3]);
    P(c, dark(h), [10, 4, 11, 3, 10, 2, 9, 1]);
    P(c, n, [5, 0, 7, 0, 4, 1, 6, 1, 8, 1, 3, 2, 5, 2, 7, 2, 9, 2, 4, 3, 6, 3, 8, 3, 10, 3]);
    c.row(4, 3, 10, n);
    c.set(10, 4, dark(n));
    P(c, dark(dark(s)), [9, 8]); // the mole
    P(c, dark(s), [4, 5, 5, 5, 8, 5, 9, 5, 4, 8]);
    c.row(9, 6, 7, C.lip);
  });
  H('school caretaker grey cap pulled low eyes in shadow stubble tan', 'tan', 'calm', (c, s) => {
    const g = hex('#5d6b78');
    c.row(2, 5, 8, g);
    c.rect(4, 3, 9, 4, g);
    P(c, g, [3, 4]);
    P(c, dark(g), [10, 4, 9, 3]);
    P(c, lite(g), [5, 2, 4, 3]);
    c.row(5, 3, 11, dark(g));
    c.set(12, 5, dark(g));
    c.row(6, 3, 10, mix(s, 0.62));
    P(c, K, [5, 6, 8, 6]);
    m.stubble(c, s, 0.76);
    P(c, HAIR.grey, [3, 7, 10, 7]);
    P(c, WHITE, [11, 7, 12, 6]); // a roll-up behind the ear
  });
  H('pupil braces round glasses black bowl cut tan', 'tan', 'grin', (c, s) => {
    const h = HAIR.black;
    c.row(1, 4, 9, h);
    c.rect(3, 2, 10, 3, h);
    c.row(4, 3, 10, h);
    P(c, h, [2, 3, 2, 4, 11, 3, 11, 4]);
    P(c, mix(h, 2.4), [5, 1, 4, 2, 6, 1]);
    m.rounds(c, C.steel);
    P(c, C.silver, [5, 9, 6, 9, 7, 9, 8, 9]);
    P(c, WHITE, [6, 9]);
  });
  H('girl red hairband black bob brown', 'brown', 'calm', (c, s) => {
    const h = HAIR.black;
    HAIRS.bob(c, h);
    c.row(1, 4, 9, h);
    c.row(2, 3, 10, RED);
    c.set(10, 2, dark(RED));
    c.set(4, 2, lite(RED));
    P(c, h, [2, 3, 11, 3, 3, 5]);
    P(c, mix(h, 2.4), [5, 1, 5, 3]);
    P(c, h, [2, 9, 3, 9]);
    P(c, dark(h), [11, 9, 10, 9]);
  });
  H('old teacher mortarboard gold tassel white sideburns pale', 'pale', 'calm', (c, s) => {
    const h = HAIR.white;
    P(c, h, [3, 4, 3, 5, 3, 6, 3, 7, 2, 5, 2, 6, 4, 8]);
    P(c, dark(h), [10, 4, 10, 5, 10, 6, 10, 7, 11, 5, 11, 6, 9, 8]);
    c.row(1, 1, 12, GOWN);
    c.set(1, 1, lite(lite(GOWN)));
    c.set(2, 1, lite(lite(GOWN)));
    c.rect(4, 2, 9, 3, GOWN);
    c.row(3, 3, 10, GOWN);
    c.row(0, 5, 8, GOWN);
    c.set(6, 0, lite(lite(GOWN)));
    P(c, GOLD, [11, 2, 11, 3, 12, 4]);
    c.set(12, 5, dark(GOLD));
    P(c, dark(s), [4, 7, 9, 7, 5, 4, 8, 4]);
  });
  H('pupil straw boater wet black hair hollow eyes drowned', 'drowned', 'hollow', (c, s) => {
    const h = HAIR.black;
    c.col(2, 4, 10, h);
    c.col(11, 4, 11, h);
    c.col(3, 4, 8, h);
    c.col(10, 4, 9, h);
    P(c, h, [4, 4, 4, 5, 9, 4, 3, 11]);
    P(c, mix(h, 2.2), [2, 6, 11, 8, 3, 5]);
    c.rect(4, 1, 9, 1, STRAW);
    c.row(0, 5, 8, STRAW);
    c.row(2, 4, 9, CLOTH.wine);
    c.row(3, 1, 12, STRAW);
    P(c, lite(STRAW), [5, 0, 4, 1, 1, 3, 2, 3]);
    P(c, dark(STRAW), [9, 1, 11, 3, 12, 3]);
    c.set(9, 2, dark(CLOTH.wine));
    P(c, TEAR, [7, 4, 9, 8, 12, 4]);
  });

  /* ---------- torsos ---------- */
  const blazer = (c, g, tieA, tieB) => {
    body(c, g);
    c.rect(5, 1, 6, 5, WHITE);
    P(c, tieA, [5, 2, 5, 4, 6, 3]);
    P(c, tieB, [5, 3, 5, 5, 6, 2, 6, 4]);
    P(c, lite(g), [4, 1, 4, 2, 4, 3, 7, 1]);
    P(c, dark(g), [7, 2, 7, 3, 4, 4, 7, 4, 5, 6, 6, 6]);
    c.col(5, 7, 9, dark(g));
  };
  T('school blazer navy crest striped tie', (c) => {
    blazer(c, CLOTH.navy, CLOTH.wine, CLOTH.mustard);
    P(c, GOLD, [8, 3, 8, 4]);
    c.set(8, 4, RED);
    P(c, GOLD, [6, 7]);
    c.row(7, 2, 3, dark(CLOTH.navy));
  });
  T('school blazer wine piped prefect badge ink stain', (c) => {
    blazer(c, CLOTH.wine, CLOTH.navy, WHITE);
    P(c, CLOTH.cream, [4, 1, 4, 2, 4, 3, 7, 1, 7, 2, 7, 3]);
    P(c, C.silver, [3, 4]);
    P(c, CLOTH.navy, [8, 6, 8, 7, 7, 7]); // a leaking pen
    P(c, GOLD, [6, 8]);
    c.row(9, 2, 9, dark(CLOTH.wine));
  });
  T('pinafore grey over white blouse', (c) => {
    body(c, BLOUSE);
    c.rect(3, 3, 8, 9, PINA);
    c.rect(2, 6, 9, 9, PINA);
    P(c, PINA, [3, 1, 3, 2, 8, 1, 8, 2]);
    c.col(9, 6, 9, dark(PINA));
    c.col(8, 3, 5, dark(PINA));
    c.row(3, 4, 7, lite(PINA));
    P(c, dark(PINA), [4, 7, 4, 8, 4, 9, 7, 7, 7, 8, 7, 9]);
    P(c, K, [3, 4, 8, 4]);
    P(c, WHITE, [4, 1, 7, 1]);
    P(c, RED, [5, 2, 6, 2]);
    c.set(6, 5, GOLD);
  });
  T('gym kit white t-shirt wine sash', (c) => {
    body(c, BLOUSE);
    c.row(1, 4, 7, dark(BLOUSE));
    P(c, dark(BLOUSE), [5, 2, 6, 2]);
    P(c, CLOTH.wine, [2, 2, 3, 2, 3, 3, 4, 3, 4, 4, 5, 4, 5, 5, 6, 5, 6, 6, 7, 6, 7, 7, 8, 7, 8, 8, 9, 8, 9, 9, 1, 1, 2, 1]);
    c.set(9, 9, dark(CLOTH.wine));
    P(c, mix(BLOUSE, 0.86), [3, 7, 4, 8, 3, 8]); // grass
    P(c, CLOTH.forest, [3, 9]);
  });
  T('teacher cardigan forest high collar blouse brooch chalk dust', (c) => {
    const g = CLOTH.forest;
    body(c, g);
    c.rect(5, 1, 6, 5, BLOUSE);
    c.row(1, 4, 7, BLOUSE);
    P(c, dark(BLOUSE), [5, 3, 5, 5, 6, 2]);
    c.set(5, 2, CLOTH.wine);
    c.set(6, 2, GOLD);
    P(c, lite(g), [4, 2, 4, 3, 4, 4, 4, 5, 7, 2]);
    c.col(5, 6, 9, dark(g));
    P(c, C.brown, [6, 6, 6, 8]);
    P(c, CHALK, [3, 7, 8, 5]);
    c.row(9, 2, 9, dark(g));
    c.set(5, 9, dark(dark(g)));
  });
  T('headmaster black gown tweed waistcoat watch chain', (c) => {
    body(c, GOWN);
    c.rect(4, 1, 7, 9, C.tweed);
    c.rect(5, 1, 6, 2, WHITE);
    P(c, K, [5, 2, 6, 2]);
    P(c, dark(C.tweed), [5, 3, 6, 3, 7, 4, 7, 5, 7, 6, 7, 7, 7, 8, 7, 9]);
    P(c, C.brown, [5, 5, 5, 7, 5, 9]);
    P(c, GOLD, [6, 6, 7, 6, 4, 6]);
    P(c, lite(lite(GOWN)), [3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 2, 2, 1, 1]);
    P(c, K, [8, 2, 8, 3, 8, 4, 8, 5, 8, 6, 8, 7, 8, 8, 8, 9]);
  });
  T('coach tracksuit top wine white piping whistle on a cord', (c) => {
    const g = hex('#7a2a2e');
    body(c, g);
    c.row(1, 1, 3, WHITE);
    c.row(1, 8, 10, dark(WHITE));
    c.col(5, 2, 9, dark(g));
    P(c, K, [4, 2, 4, 3, 7, 2, 7, 3, 5, 4, 6, 4]);
    P(c, C.silver, [5, 5, 6, 5, 6, 6]);
    c.set(6, 6, dark(C.silver));
    c.row(9, 2, 9, dark(g));
    c.row(8, 2, 9, WHITE);
    c.set(9, 8, dark(WHITE));
    c.set(5, 8, dark(g));
    P(c, WHITE, [8, 4]);
  });
  T('lunch lady tabard checked blue gravy stains', (c) => {
    const g = hex('#7f93a6');
    body(c, BLOUSE);
    c.rect(3, 2, 8, 9, g);
    c.rect(2, 4, 9, 9, g);
    P(c, g, [3, 1, 8, 1]);
    for (let y = 2; y <= 9; y++) for (let x = 2; x <= 9; x++) if (c.get(x, y) === g && (x + y) % 2 === 0) c.set(x, y, lite(g));
    c.col(9, 4, 9, dark(g));
    P(c, BLOUSE, [5, 2, 6, 2]);
    c.rect(4, 6, 7, 8, mix(g, 0.9));
    c.row(6, 4, 7, dark(g));
    P(c, CLOTH.earth, [6, 4, 7, 5, 3, 8, 6, 5]);
    P(c, CLOTH.rust, [3, 5]);
    c.set(8, 3, WHITE); // her name
  });

  /* ---------- arms ---------- */
  A('school blazer navy sleeve white cuff inky brown hand', (c) => {
    m.sleeve(c, CLOTH.navy, SKINS.brown, WHITE);
    c.set(3, 8, dark(WHITE));
    P(c, GOLD, [3, 6, 3, 7]);
    c.set(1, 10, hex('#2f3c58'));
  });
  A('white blouse sleeve buttoned cuff pale hand', (c) => {
    m.sleeve(c, BLOUSE, SKINS.pale);
    c.row(7, 1, 3, dark(BLOUSE));
    c.set(2, 8, C.steel);
    c.rect(0, 0, 4, 1, BLOUSE); // a puffed shoulder
    c.set(4, 1, dark(BLOUSE));
    c.set(4, 0, dark(BLOUSE));
    c.set(0, 0, lite(BLOUSE));
  });
  A('gym kit white short sleeve wine band bare tan arm', (c) => {
    m.shortSleeve(c, BLOUSE, SKINS.tan, 2);
    c.row(3, 1, 3, CLOTH.wine);
    c.set(3, 3, dark(CLOTH.wine));
    c.set(2, 6, hex('#7a3a3a')); // a graze
  });
  A('cardigan forest sleeve chalk in fair hand', (c) => {
    m.sleeve(c, CLOTH.forest, SKINS.fair, dark(CLOTH.forest));
    c.row(7, 1, 3, lite(CLOTH.forest));
    P(c, CHALK, [2, 5, 1, 9]);
    P(c, WHITE, [2, 11, 2, 10]);
    c.set(3, 3, dark(dark(CLOTH.forest)));
  });

  /* ---------- legs ---------- */
  L('pleated skirt grey white knee socks one slipped black shoes pale', (c) => {
    const s = SKINS.pale;
    m.bareLeg(c, s, 4);
    c.rect(1, 0, 4, 4, PINA);
    c.col(4, 0, 4, dark(PINA));
    c.col(2, 1, 4, dark(PINA));
    c.set(0, 4, PINA);
    c.set(5, 4, dark(PINA));
    c.rect(1, 7, 4, 9, WHITE);
    c.col(4, 7, 9, dark(WHITE));
    c.row(8, 1, 3, dark(WHITE)); // this one has slipped down
    shoe(c, K);
    c.set(3, 10, C.steel);
  });
  L('school shorts grey scabbed brown knees grey knee socks striped', (c) => {
    const s = SKINS.brown;
    m.bareLeg(c, s, 4);
    c.rect(1, 0, 4, 3, PINA);
    c.col(4, 0, 3, dark(PINA));
    c.row(3, 1, 4, dark(PINA));
    c.set(2, 4, hex('#7a3a3a'));
    c.set(3, 5, lite(s));
    c.rect(1, 6, 4, 9, C.grey);
    c.col(4, 6, 9, dark(C.grey));
    c.row(6, 1, 4, CLOTH.wine);
    c.row(7, 1, 4, CLOTH.mustard);
    shoe(c, C.brown);
    c.set(2, 10, lite(C.brown));
  });
  L('gym shorts navy bare tan legs black plimsolls', (c) => {
    const s = SKINS.tan;
    m.bareLeg(c, s, 3);
    c.rect(1, 0, 4, 2, CLOTH.navy);
    c.col(4, 0, 2, dark(CLOTH.navy));
    c.set(3, 1, WHITE);
    c.set(3, 2, WHITE);
    c.set(2, 5, lite(s));
    c.set(3, 7, CLOTH.forest); // grass on the shin
    c.row(9, 1, 4, WHITE);
    c.set(4, 9, dark(WHITE));
    shoe(c, GOWN);
    c.row(11, 1, 5, WHITE);
    c.set(3, 10, WHITE);
  });
  L('teacher tweed trousers brown brogues', (c) => {
    m.trousers(c, C.tweed);
    P(c, lite(C.tweed), [2, 2, 3, 5, 2, 7, 1, 4]);
    P(c, dark(C.tweed), [2, 4, 3, 8, 1, 7, 3, 1]);
    c.row(9, 1, 4, dark(C.tweed));
    shoe(c, hex('#5a3a26'));
    P(c, lite(hex('#5a3a26')), [3, 10, 4, 10]);
    c.set(1, 6, CHALK);
  });
};
