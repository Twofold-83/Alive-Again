/* The basement: the boiler, the pipes, the coal, and whoever has been living down there. */
module.exports = (kit, U) => {
  const { SKINS, HAIR, CLOTH, HAIRS, K, WHITE, BONE, RED, GOLD, hex, mix, dark, lite, body, shoe } = kit;
  const { P, C, sleeve, hand, trouser, shin, foot, glasses, stubble } = U;
  const { heads, torsos, arms, legs, H, S, T, A, L } = U.lists();
  const SOOT = C.soot,
    BOILER = hex('#3a4660'),
    WHITISH = hex('#d9d6cc'), // the skin of the thing that never saw the sun
    VEIN = hex('#9aa9b8'),
    WELLY = hex('#26262c');

  /* ---------- heads ---------- */
  H('boiler man soot face goggles bald fair', 'fair', 'calm', (c, s) => {
    c.row(2, 5, 8, s);
    c.row(3, 3, 10, C.leather);
    c.rect(4, 2, 5, 3, C.glass);
    c.rect(8, 2, 9, 3, C.glass);
    P(c, K, [[4, 3], [8, 3]]);
    P(c, WHITE, [[5, 2], [9, 2]]);
    const so = mix(s, 0.5);
    P(c, so, [[3, 8], [4, 8], [4, 9], [9, 7], [9, 8], [7, 4], [8, 4]]);
    P(c, SOOT, [[3, 9], [8, 4]]);
  });
  H('plumber peaked cap navy moustache brown hair tan', 'tan', 'calm', (c) => {
    const col = CLOTH.navy,
      h = HAIR.brown;
    c.row(1, 5, 8, col);
    c.row(2, 4, 9, col);
    c.row(3, 3, 10, col);
    c.row(4, 3, 11, dark(col));
    c.set(12, 4, dark(col));
    c.set(5, 1, lite(col));
    c.set(6, 2, C.brass);
    c.set(3, 5, h);
    c.set(10, 5, dark(h));
    c.row(8, 4, 9, h);
    P(c, h, [[4, 9], [9, 9]]);
  });
  H('hoarder wild grey hair long beard pale', 'pale', 'scared', (c) => {
    const h = HAIR.grey;
    HAIRS.wild(c, h);
    P(c, h, [[3, 8], [10, 8], [2, 8], [11, 8]]);
    c.row(9, 2, 11, h);
    c.row(10, 3, 10, h);
    c.row(11, 3, 10, h);
    c.row(12, 5, 8, dark(h));
    c.rect(6, 9, 7, 10, K);
    P(c, dark(h), [[4, 11], [7, 11], [9, 10], [11, 9]]);
    c.set(5, 11, CLOTH.mustard);
    c.set(8, 10, BONE);
  });
  S('pale thing bald white big black eyes never saw the sun', (c) => {
    const w = WHITISH;
    c.row(1, 5, 8, w);
    c.row(2, 4, 9, w);
    c.rect(3, 3, 10, 8, w);
    c.row(9, 4, 9, w);
    c.row(10, 5, 8, w);
    c.row(11, 6, 7, dark(w));
    P(c, w, [[2, 5], [2, 6], [11, 5], [11, 6]]);
    c.col(10, 3, 8, mix(w, 0.85));
    c.rect(4, 5, 5, 7, K);
    c.rect(8, 5, 9, 7, K);
    P(c, hex('#3a3f4a'), [[4, 5], [8, 5]]);
    P(c, VEIN, [[4, 2], [3, 3], [9, 2], [9, 3], [10, 4], [3, 8]]);
    P(c, dark(w), [[6, 8], [7, 8]]);
    c.row(10, 6, 7, hex('#6a5a5a'));
    c.set(5, 1, lite(w));
  });
  H('rat catcher battered hat rat stubble brown', 'brown', 'grin', (c, s) => {
    const col = CLOTH.earth,
      r = hex('#77726c');
    c.rect(4, 1, 8, 2, col);
    c.set(9, 2, col);
    c.set(4, 1, lite(col));
    c.row(3, 1, 12, col);
    c.row(3, 8, 12, dark(col));
    c.row(2, 4, 9, dark(col));
    stubble(c, s, 0.75);
    c.row(9, 5, 8, K);
    P(c, WHITE, [[6, 9], [7, 9]]);
    /* the rat on the brim */
    c.row(2, 9, 12, r);
    c.row(1, 10, 12, r);
    c.set(10, 1, lite(r));
    c.set(12, 1, K);
    c.set(11, 0, hex('#b08a84'));
    c.set(13, 2, hex('#b08a84'));
    P(c, hex('#b08a84'), [[8, 1], [7, 0]]);
  });
  H('miner lamp helmet coal dust ashen', 'ashen', 'hollow', (c, s) => {
    const col = hex('#8a7a3a');
    c.row(1, 4, 9, col);
    c.row(2, 3, 10, col);
    c.row(3, 2, 11, dark(col));
    c.set(4, 1, lite(col));
    c.rect(6, 0, 7, 1, C.iron);
    c.rect(6, 1, 7, 2, C.glow);
    c.set(6, 1, WHITE);
    c.set(5, 1, C.iron);
    c.set(8, 1, C.iron);
    const so = mix(s, 0.5);
    P(c, so, [[3, 4], [4, 4], [9, 4], [10, 4], [3, 8], [4, 9], [9, 8], [8, 10], [5, 8]]);
  });
  H('caretaker bald thick glasses grey moustache fair', 'fair', 'calm', (c, s) => {
    const h = HAIR.grey;
    HAIRS.balding(c, h);
    c.row(2, 5, 8, s);
    P(c, h, [[3, 6], [10, 6], [2, 5]]);
    c.set(11, 5, dark(h));
    glasses(c);
    P(c, K, [[4, 5], [5, 5], [8, 5], [9, 5]]);
    P(c, WHITE, [[4, 6], [9, 6]]);
    c.row(8, 4, 9, h);
    P(c, h, [[4, 9], [9, 9]]);
  });
  H('bag lady woolly hat bobble scarf grey hair tan', 'tan', 'calm', (c) => {
    const hat = CLOTH.plum,
      sc = CLOTH.mustard,
      h = HAIR.grey;
    c.rect(6, 0, 7, 0, WHITE);
    c.row(1, 4, 9, hat);
    c.row(2, 3, 10, hat);
    c.row(3, 3, 10, dark(hat));
    c.set(4, 1, lite(hat));
    P(c, lite(hat), [[4, 3], [6, 3], [8, 3]]);
    P(c, h, [[2, 4], [2, 5], [2, 6], [3, 4], [11, 4], [11, 5]]);
    c.set(11, 6, dark(h));
    c.row(10, 3, 10, sc);
    c.row(11, 3, 10, sc);
    c.row(12, 4, 9, dark(sc));
    P(c, dark(sc), [[5, 10], [8, 11], [10, 11]]);
    P(c, RED, [[4, 11], [7, 10]]);
  });
  S('welder mask iron dark green window', (c) => {
    const m = hex('#4a4640'),
      g = hex('#1c3828');
    c.rect(6, 0, 7, 1, C.leather);
    c.row(2, 4, 9, m);
    c.rect(3, 3, 10, 10, m);
    c.row(11, 4, 9, m);
    c.row(12, 5, 8, dark(m));
    c.col(10, 3, 10, dark(m));
    c.set(4, 2, lite(m));
    c.set(3, 3, lite(m));
    c.rect(4, 5, 9, 7, K);
    c.rect(5, 5, 8, 6, g);
    c.set(5, 5, hex('#5fae7a'));
    c.set(6, 5, hex('#2f6a48'));
    P(c, lite(m), [[3, 8], [10, 4]]);
    P(c, C.steel, [[3, 6], [10, 6]]);
    P(c, SOOT, [[8, 3], [9, 4], [4, 9], [8, 9]]);
    P(c, hex('#84482a'), [[7, 10], [4, 4]]);
  });
  H('cellar child dirty blond fringe grime pale', 'pale', 'hollow', (c, s) => {
    const h = mix(HAIR.blond, 0.8);
    HAIRS.fringe(c, h);
    P(c, h, [[2, 4], [2, 5], [11, 4], [3, 6]]);
    c.set(11, 5, dark(h));
    c.set(6, 5, s);
    const g = mix(s, 0.62);
    P(c, g, [[4, 8], [3, 8], [9, 9], [8, 10], [6, 8]]);
    c.set(5, 1, h);
    c.set(8, 1, h);
  });
  H('mouldy man mushrooms growing bald rotten', 'rotten', 'hollow', (c, s) => {
    c.row(2, 5, 8, s);
    const cap = hex('#9a4a34'),
      mo = hex('#4a5e3a');
    P(c, BONE, [[4, 2], [5, 2], [10, 2]]);
    c.row(0, 3, 6, cap);
    c.row(1, 2, 7, cap);
    c.set(7, 1, dark(cap));
    P(c, WHITE, [[4, 0], [6, 1], [3, 1]]);
    c.row(1, 9, 11, cap);
    c.set(11, 1, dark(cap));
    c.set(10, 1, WHITE);
    P(c, mo, [[4, 8], [9, 4], [3, 5], [8, 10], [4, 4], [9, 8]]);
    P(c, lite(mo), [[4, 9], [10, 5]]);
  });

  /* ---------- torsos ---------- */
  const boilerSuit = (col, dirty) => (c) => {
    body(c, col);
    P(c, WHITE, [[5, 1], [6, 1]]);
    P(c, lite(col), [[4, 1], [7, 1]]);
    c.col(5, 2, 9, dark(col));
    c.set(6, 2, C.steel);
    c.row(4, 2, 3, dark(col));
    c.row(4, 7, 8, dark(col));
    c.set(3, 5, C.brass);
    P(c, WHITE, [[7, 3], [8, 3]]);
    c.row(7, 2, 9, dark(col));
    c.set(6, 7, C.steel);
    P(c, SOOT, dirty ? [[3, 6], [3, 8], [4, 8], [8, 6], [7, 9], [2, 3], [8, 5]] : [[3, 8], [8, 6]]);
  };
  T('boiler suit navy zip pockets', boilerSuit(BOILER));
  T('boiler suit rust sooty dirty', boilerSuit(mix(CLOTH.rust, 0.85), true));
  T('string vest white mesh belly fair', (c) => {
    const s = SKINS.fair;
    body(c, s, true);
    c.clear(1, 6);
    c.clear(10, 6);
    for (let y = 3; y <= 9; y++) for (let x = 2; x <= 9; x++) if ((x + y) % 2 === 0) c.set(x, y, WHITE);
    P(c, WHITE, [[3, 1], [3, 2], [8, 1], [8, 2]]);
    c.row(9, 2, 9, WHITE);
    c.col(9, 3, 9, dark(WHITE));
    P(c, dark(s), [[5, 2], [6, 3], [9, 2]]);
    P(c, hex('#a89858'), [[4, 6], [5, 7], [4, 7]]);
  });
  T('rubber apron dark green over grey shirt', (c) => {
    const r = C.rubber;
    body(c, CLOTH.ash);
    P(c, SKINS.tan, [[5, 1], [6, 1]]);
    c.rect(3, 2, 8, 9, r);
    P(c, r, [[4, 1], [7, 1], [2, 6], [9, 6]]);
    c.col(8, 2, 9, dark(r));
    c.col(4, 3, 6, lite(r));
    c.set(4, 3, C.glass);
    c.row(9, 3, 8, dark(r));
    P(c, hex('#6a7a3a'), [[6, 6], [6, 7], [5, 7], [7, 8]]);
  });
  T('waders bib olive rubber braces mustard jumper', (c) => {
    const o = C.olive,
      j = mix(CLOTH.mustard, 0.85);
    body(c, j);
    P(c, dark(j), [[5, 1], [6, 1], [4, 2], [7, 2], [5, 3], [6, 3]]);
    c.rect(3, 4, 8, 9, o);
    c.rect(2, 6, 9, 9, o);
    c.col(3, 1, 3, o);
    c.col(8, 1, 3, dark(o));
    P(c, C.brass, [[3, 4], [8, 4]]);
    c.col(9, 6, 9, dark(o));
    c.set(4, 5, lite(o));
    c.row(8, 2, 9, dark(o));
    c.row(9, 2, 9, dark(dark(o)));
    c.set(4, 8, C.glass);
  });
  T('hoarder layers cardigan plum scarf odd buttons', (c) => {
    const card = CLOTH.plum,
      j = CLOTH.mustard,
      sc = CLOTH.wine;
    body(c, card, true);
    c.rect(5, 2, 6, 9, j);
    c.set(6, 9, dark(j));
    c.row(1, 3, 8, sc);
    c.col(3, 2, 5, sc);
    c.set(3, 6, dark(sc));
    c.set(3, 4, dark(sc));
    c.set(6, 4, GOLD);
    c.set(6, 6, RED);
    c.set(6, 8, WHITE);
    c.rect(8, 6, 9, 7, CLOTH.teal);
    c.col(10, 6, 9, dark(card));
    c.col(4, 3, 9, dark(card));
    c.set(2, 8, CLOTH.ash);
  });
  T('pale bare chest ribs thin white', (c) => {
    const w = WHITISH,
      d = mix(w, 0.75);
    c.row(1, 1, 10, w);
    c.rect(2, 2, 9, 9, w);
    c.clear(2, 7);
    c.clear(9, 7);
    c.clear(2, 6);
    c.clear(9, 6);
    c.col(9, 2, 5, d);
    c.set(9, 8, d);
    c.set(9, 9, d);
    c.row(2, 3, 4, d);
    c.row(2, 7, 8, d);
    for (const y of [4, 6]) {
      c.row(y, 3, 4, d);
      c.row(y, 7, 8, d);
    }
    c.col(5, 3, 6, d);
    c.set(6, 8, d);
    P(c, VEIN, [[2, 3], [3, 5], [8, 8]]);
    P(c, mix(w, 0.6), [[4, 9], [7, 9], [3, 8]]);
    c.set(1, 1, lite(w));
  });
  T('donkey jacket black leather shoulders', (c) => {
    const col = hex('#24222a'),
      le = hex('#5a4634');
    body(c, col);
    c.rect(1, 1, 10, 2, le);
    c.row(3, 2, 9, dark(le));
    P(c, CLOTH.ash, [[5, 1], [6, 1]]);
    P(c, col, [[4, 1], [7, 1], [4, 2], [7, 2]]);
    c.col(5, 2, 9, K);
    P(c, C.iron, [[6, 5], [6, 7]]);
    c.row(7, 2, 3, lite(col));
    c.row(7, 8, 9, lite(col));
    c.set(1, 1, lite(le));
    c.col(9, 4, 9, dark(col));
  });

  /* ---------- arms ---------- */
  A('boiler suit navy sleeve rolled sooty hand fair', (c) => {
    sleeve(c, BOILER, 6);
    c.row(6, 1, 3, lite(BOILER));
    c.row(7, 1, 3, dark(BOILER));
    hand(c, SKINS.fair, 8);
    c.row(10, 1, 3, mix(SKINS.fair, 0.5));
    c.set(1, 9, mix(SKINS.fair, 0.6));
    c.set(2, 3, SOOT);
  });
  A('bare arm tattoo anchor hairy fair', (c) => {
    const s = SKINS.fair;
    hand(c, s, 0);
    c.set(1, 0, lite(s));
    P(c, hex('#44546e'), [[2, 2], [2, 3], [1, 3], [3, 3], [2, 4], [1, 5], [2, 5], [3, 5]]);
    P(c, dark(s), [[1, 7], [2, 8]]);
  });
  A('rubber gauntlet dark green long glove earth sleeve', (c) => {
    const r = C.rubber;
    sleeve(c, CLOTH.earth, 3);
    c.rect(1, 4, 3, 10, r);
    c.row(4, 0, 4, r);
    c.set(4, 4, dark(r));
    c.col(3, 5, 10, dark(r));
    c.col(1, 5, 7, lite(r));
    c.set(2, 9, hex('#6a7a3a'));
  });
  A('pale thin arm long fingers white', (c) => {
    const w = WHITISH;
    c.rect(1, 0, 3, 1, w);
    c.rect(2, 2, 3, 8, w);
    c.col(3, 0, 8, mix(w, 0.8));
    c.set(2, 5, mix(w, 0.8));
    c.set(2, 3, VEIN);
    c.row(9, 1, 3, w);
    for (const x of [1, 3]) c.col(x, 10, 11, w);
    c.set(2, 10, w);
    P(c, hex('#77726c'), [[1, 11], [3, 11], [2, 10]]);
  });
  A('hoarder layered sleeve plum fingerless glove tan', (c) => {
    sleeve(c, CLOTH.plum, 6);
    c.row(7, 1, 3, CLOTH.mustard);
    c.rect(1, 8, 3, 9, CLOTH.wine);
    c.set(3, 8, dark(CLOTH.wine));
    c.set(3, 9, dark(CLOTH.wine));
    c.row(10, 1, 3, SKINS.tan);
    c.set(2, 4, CLOTH.teal);
    c.set(1, 4, CLOTH.teal);
  });

  /* ---------- legs ---------- */
  L('waders olive rubber thigh boots wet', (c) => {
    const o = C.olive;
    trouser(c, o);
    shoe(c, dark(o));
    c.col(1, 1, 4, lite(o));
    c.row(5, 1, 4, dark(o));
    c.set(2, 0, C.brass);
    c.rect(1, 8, 4, 9, dark(o));
    c.set(2, 8, C.glass);
    c.row(11, 1, 5, dark(dark(o)));
  });
  L('boiler suit navy legs steel toe boots', (c) => {
    trouser(c, BOILER);
    c.rect(2, 4, 3, 5, dark(BOILER));
    c.set(2, 7, SOOT);
    shoe(c, C.leather);
    c.row(9, 1, 4, dark(BOILER));
    c.set(4, 10, C.steel);
    c.set(5, 11, C.steel);
  });
  L('earth trousers tucked in black wellingtons muddy', (c) => {
    trouser(c, CLOTH.earth, 4);
    c.rect(1, 5, 4, 9, WELLY);
    c.row(5, 1, 4, lite(lite(WELLY)));
    c.col(1, 6, 8, lite(WELLY));
    shoe(c, WELLY);
    c.row(11, 1, 5, C.mud);
    c.set(3, 9, C.mud);
    c.set(2, 3, dark(CLOTH.earth));
  });
  L('pale bare thin legs dirty feet white', (c) => {
    const w = WHITISH,
      d = mix(w, 0.75);
    c.rect(1, 0, 4, 1, w);
    c.rect(2, 2, 4, 9, w);
    c.col(4, 0, 9, d);
    c.row(5, 2, 3, d);
    c.set(1, 4, w);
    c.set(1, 5, w);
    c.set(3, 2, VEIN);
    foot(c, w);
    c.row(11, 1, 5, mix(w, 0.5));
    c.set(2, 8, mix(w, 0.6));
  });
  L('hoarder baggy trousers patched carpet slippers', (c) => {
    const col = CLOTH.slate;
    c.rect(0, 0, 4, 8, col);
    c.clear(0, 0);
    c.clear(0, 8);
    c.col(4, 0, 8, dark(col));
    c.row(8, 1, 4, C.sack);
    c.rect(1, 9, 4, 9, CLOTH.cream);
    c.rect(2, 3, 3, 4, CLOTH.rust);
    c.set(1, 6, dark(col));
    shoe(c, CLOTH.wine);
    c.set(3, 10, CLOTH.mustard);
    c.set(4, 10, dark(CLOTH.wine));
  });
  return { heads, torsos, arms, legs };
};
