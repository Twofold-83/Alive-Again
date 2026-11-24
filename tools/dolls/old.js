/*
 * Old times: the Victorian great house, the town and frontier of the 1800s, the 1920's of a Lovecraft
 * investigation, the apothecary, the cottage, the garden and the nursery.
 * 76 heads, 56 torsos, 33 arms, 33 legs. Parts are only ever ADDED AT THE END of each list (see make-dolls.js).
 */
module.exports = (kit) => {
  const { SKINS, HAIR, CLOTH, HAIRS, HATS, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite, body, shoe } = kit;
  const heads = [],
    torsos = [],
    arms = [],
    legs = [];

  /* ---------- small helpers ---------- */
  /** Pixels of one colour: dots(c, col, x, y, x, y, ...). */
  const dots = (c, col, ...xy) => {
    for (let i = 0; i < xy.length; i += 2) c.set(xy[i], xy[i + 1], col);
  };
  /** Like set, but never over the black of an eye, a brow or a mouth: the feelings stay readable. */
  const keep = (c, x, y, col) => {
    if (c.get(x, y) !== K) c.set(x, y, col);
  };
  const keeps = (c, col, ...xy) => {
    for (let i = 0; i < xy.length; i += 2) keep(c, xy[i], xy[i + 1], col);
  };
  const keepRect = (c, x0, y0, x1, y1, col) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) keep(c, x, y, col);
  };
  /** Darken (or tint) what is already there, keeping eyes and mouth. */
  const tint = (c, x, y, k) => {
    const p = c.get(x, y);
    if (p && p !== K) c.set(x, y, mix(p, k));
  };
  const hi = (col) => mix(col, 1.55); // a visible highlight on very dark cloth
  const SKIN = (name) => SKINS[name];

  /* a few colours of these settings */
  const LEATHER = hex('#3a2c22'),
    HIDE = hex('#7a5a3a'),
    SOOT = hex('#2c2931'),
    STRAW = hex('#b9a25a'),
    DENIM = hex('#3f5068'),
    KHAKI = hex('#8a7a5a'),
    TWEED = hex('#6b5d45'),
    GLASS = hex('#8fa6a0'),
    STEEL = hex('#6b6b70'),
    ROUGE = hex('#b07a6a'),
    VISOR = hex('#3d6a4a'),
    MUD = hex('#4a3a2a'),
    LEAF = hex('#3d5a2a'),
    WOOD = hex('#8a6a3a'),
    TEAR = hex('#6f8fae');

  /* ---------- face furniture ---------- */
  const stache = (c, h) => {
    c.row(8, 5, 8, h);
    c.set(8, 8, dark(h));
  };
  const bigStache = (c, h) => {
    c.row(8, 4, 9, h);
    keeps(c, h, 4, 9);
    keeps(c, dark(h), 9, 9);
    c.set(9, 8, dark(h));
  };
  /** Mutton chops down the cheeks. */
  const chops = (c, h) => {
    c.col(3, 5, 9, h);
    c.col(10, 5, 9, dark(h));
    keeps(c, h, 4, 8, 4, 9);
    keeps(c, dark(h), 9, 8, 9, 9);
  };
  /** A beard around the mouth; long: down over the collar. */
  const beard = (c, h, long) => {
    c.col(3, 7, 9, h);
    c.col(10, 7, 9, dark(h));
    keeps(c, h, 4, 8, 4, 9, 5, 8, 6, 8, 7, 8);
    keeps(c, dark(h), 8, 8, 9, 8, 9, 9);
    keepRect(c, 4, 10, 8, 10, h);
    keeps(c, dark(h), 9, 10);
    keepRect(c, 5, 11, 7, 11, h);
    keeps(c, dark(h), 8, 11);
    if (long) {
      c.row(12, 5, 7, h);
      c.set(8, 12, dark(h));
    }
  };
  /** Round spectacles: rims under the eyes, a bridge, the temples. */
  const specs = (c, col) => {
    keeps(c, col, 4, 7, 5, 7, 8, 7, 9, 7, 6, 6, 7, 6, 3, 6, 10, 6, 4, 5, 9, 5);
  };
  const hairSides = (c, h, to = 4) => {
    c.col(3, 4, to, h);
    c.col(10, 4, to, dark(h));
  };

  /* =====================================================================================
   * 1. VICTORIAN — the great house
   * ===================================================================================== */
  const BLK = CLOTH.black;
  heads.push({
    name: 'gentleman top hat black mutton chops brown hair fair',
    theme: 'victorian',
    skin: 'fair',
    draw(c) {
      HATS.tophat(c, BLK);
      c.row(2, 4, 9, CLOTH.slate);
      chops(c, HAIR.brown);
      c.set(3, 4, HAIR.brown);
      c.set(10, 4, dark(HAIR.brown));
    },
  });
  heads.push({
    name: 'lady high chignon cameo red hair pale',
    theme: 'victorian',
    skin: 'pale',
    draw(c) {
      const h = HAIR.red;
      c.row(2, 4, 9, h);
      c.row(3, 3, 10, h);
      c.set(6, 3, lite(h));
      hairSides(c, h, 5);
      c.rect(5, 0, 8, 1, h);
      c.set(5, 0, lite(h));
      c.set(8, 1, dark(h));
      c.set(8, 0, dark(h));
      c.row(12, 4, 9, WHITE);
      dots(c, ROUGE, 6, 12, 7, 12);
      keeps(c, GOLD, 3, 7);
    },
  });
  heads.push({
    name: 'butler balding white hair stiff collar pale',
    theme: 'victorian',
    skin: 'pale',
    expr: 'hollow',
    draw(c) {
      const h = HAIR.white;
      HAIRS.balding(c, h);
      dots(c, h, 2, 5, 3, 6);
      dots(c, dark(h), 11, 5, 10, 6);
      c.row(12, 4, 9, WHITE);
      dots(c, BLK, 6, 12, 7, 12);
    },
  });
  heads.push({
    name: 'housemaid lace cap black hair tan',
    theme: 'victorian',
    skin: 'tan',
    draw(c) {
      const h = HAIR.black;
      c.row(3, 3, 10, h);
      hairSides(c, h, 4);
      c.row(0, 5, 8, WHITE);
      c.row(1, 4, 9, WHITE);
      for (let x = 3; x <= 10; x++) c.set(x, 2, x % 2 ? WHITE : dark(WHITE));
      c.set(9, 1, dark(WHITE));
      dots(c, WHITE, 11, 3, 12, 4);
      c.set(12, 5, dark(WHITE));
    },
  });
  heads.push({
    name: 'governess tight bun spectacles black hair pale',
    theme: 'victorian',
    skin: 'pale',
    draw(c) {
      const h = HAIR.black;
      c.rect(6, 0, 7, 1, h);
      c.row(2, 4, 9, h);
      c.row(3, 3, 10, h);
      dots(c, h, 3, 4, 4, 4);
      dots(c, dark(h), 9, 4, 10, 4);
      c.set(6, 3, hi(h));
      specs(c, GOLD);
      c.row(12, 5, 8, CLOTH.slate);
      c.set(6, 12, WHITE);
      c.set(7, 12, WHITE);
    },
  });
  heads.push({
    name: 'widow black veil mourning grey hair ashen',
    theme: 'victorian',
    skin: 'ashen',
    expr: 'weeping',
    draw(c) {
      c.row(1, 5, 8, BLK);
      c.row(2, 4, 9, BLK);
      c.row(3, 2, 11, BLK);
      c.set(5, 1, hi(BLK));
      c.row(2, 4, 9, hi(BLK));
      /* the veil: a net over the face, the eyes and the tears show through */
      for (let y = 4; y <= 10; y++) for (let x = 3; x <= 10; x++) if ((x + y) % 2 === 0) tint(c, x, y, 0.5);
      c.col(2, 4, 10, BLK);
      c.col(11, 4, 10, BLK);
      c.set(3, 11, BLK);
      c.set(10, 11, BLK);
    },
  });
  heads.push({
    name: 'child ringlets bow blond hair fair',
    theme: 'victorian',
    skin: 'fair',
    draw(c) {
      const h = HAIR.blond;
      c.row(1, 4, 9, h);
      c.row(2, 3, 10, h);
      c.row(3, 3, 10, h);
      c.set(5, 1, lite(h));
      for (let y = 3; y <= 9; y++) {
        c.set(2, y, y % 2 ? h : dark(h));
        c.set(11, y, y % 2 ? dark(h) : mix(h, 0.5));
      }
      dots(c, h, 1, 4, 1, 6, 1, 8);
      dots(c, dark(h), 12, 4, 12, 6, 12, 8);
      dots(c, CLOTH.wine, 5, 0, 8, 0, 6, 1, 7, 1);
      dots(c, lite(CLOTH.wine), 5, 0);
    },
  });
  heads.push({
    name: 'chimney sweep boy flat cap soot face brown hair tan',
    theme: 'victorian',
    skin: 'tan',
    expr: 'grin',
    draw(c, s) {
      c.row(2, 4, 9, SOOT);
      c.row(3, 3, 10, SOOT);
      c.row(4, 8, 12, dark(SOOT));
      c.set(5, 2, hi(SOOT));
      dots(c, HAIR.brown, 3, 4, 3, 5, 4, 4);
      const sm = mix(s, 0.5);
      keeps(c, sm, 4, 7, 5, 7, 9, 7, 6, 10, 7, 10, 3, 8, 9, 5, 6, 5);
    },
  });
  heads.push({
    name: 'old gentleman monocle bald white side whiskers pale',
    theme: 'victorian',
    skin: 'pale',
    draw(c, s) {
      const h = HAIR.white;
      c.col(2, 5, 9, h);
      c.col(3, 5, 9, h);
      c.col(11, 5, 9, dark(h));
      c.col(10, 5, 9, dark(h));
      keeps(c, h, 4, 8, 4, 9, 5, 8, 6, 8);
      keeps(c, dark(h), 7, 8, 8, 8, 9, 8, 9, 9);
      c.set(4, 2, lite(s));
      keeps(c, GOLD, 8, 5, 9, 6, 8, 7, 7, 6);
      keeps(c, dark(GOLD), 9, 7);
    },
  });
  heads.push({
    name: 'constable police helmet navy moustache brown hair fair',
    theme: 'victorian',
    skin: 'fair',
    draw(c) {
      const n = CLOTH.navy;
      c.row(0, 6, 7, n);
      c.row(1, 5, 8, n);
      c.row(2, 4, 9, n);
      c.row(3, 3, 10, n);
      c.row(4, 3, 10, dark(n));
      c.set(11, 4, dark(n));
      c.set(5, 1, lite(n));
      dots(c, BONE, 6, 2, 7, 2, 6, 3);
      c.set(7, 3, dark(BONE));
      c.col(3, 5, 9, K);
      c.col(10, 5, 9, K);
      stache(c, HAIR.brown);
    },
  });
  heads.push({
    name: 'footman powdered wig white bow brown',
    theme: 'victorian',
    skin: 'brown',
    draw(c) {
      const w = HAIR.white;
      c.row(1, 4, 9, w);
      c.row(2, 3, 10, w);
      c.row(3, 3, 10, w);
      c.rect(2, 4, 3, 5, w);
      c.rect(2, 7, 3, 8, w);
      c.set(3, 6, dark(w));
      c.rect(10, 4, 11, 5, dark(w));
      c.rect(10, 7, 11, 8, dark(w));
      c.set(10, 6, mix(w, 0.5));
      c.set(5, 1, lite(w));
      c.set(7, 2, dark(w));
      dots(c, BLK, 12, 9, 12, 10, 11, 10);
      c.row(12, 5, 8, WHITE);
    },
  });

  torsos.push({
    name: 'frock coat black cravat double breasted',
    theme: 'victorian',
    draw(c) {
      body(c, BLK);
      c.rect(5, 1, 6, 2, WHITE);
      dots(c, CLOTH.wine, 5, 3, 6, 3);
      dots(c, hi(BLK), 4, 2, 4, 3, 7, 2, 7, 3, 3, 1, 8, 1);
      c.col(6, 4, 9, hi(BLK));
      dots(c, dark(GOLD), 4, 5, 8, 5, 4, 7, 8, 7);
      c.set(2, 2, hi(BLK));
    },
  });
  torsos.push({
    name: 'bustle dress bodice wine lace collar cameo',
    theme: 'victorian',
    draw(c) {
      const w = CLOTH.wine;
      body(c, w, true);
      c.clear(2, 5);
      c.clear(9, 5);
      c.clear(1, 6);
      c.clear(10, 6);
      c.row(1, 4, 7, WHITE);
      dots(c, WHITE, 5, 2, 6, 2);
      c.set(7, 1, dark(WHITE));
      dots(c, ROUGE, 5, 3);
      c.set(6, 3, GOLD);
      c.col(5, 4, 9, dark(w));
      dots(c, BONE, 6, 5, 6, 7);
      dots(c, lite(w), 3, 3, 3, 7, 1, 7);
      c.row(9, 1, 10, dark(w));
      c.col(10, 7, 9, dark(w));
    },
  });
  torsos.push({
    name: 'maid uniform black white apron bib',
    theme: 'victorian',
    draw(c) {
      body(c, BLK);
      c.rect(5, 1, 6, 1, WHITE);
      dots(c, WHITE, 3, 1, 3, 2, 8, 1, 8, 2, 2, 1, 9, 1);
      c.rect(4, 3, 7, 5, WHITE);
      c.col(7, 3, 5, dark(WHITE));
      c.row(6, 2, 9, dark(WHITE));
      c.rect(2, 7, 9, 9, WHITE);
      c.col(9, 7, 9, dark(WHITE));
      c.col(5, 7, 9, dark(WHITE));
    },
  });
  torsos.push({
    name: 'waistcoat mustard watch chain white shirt',
    theme: 'victorian',
    draw(c) {
      const m = CLOTH.mustard;
      body(c, WHITE);
      c.rect(2, 3, 9, 9, m);
      c.row(2, 3, 8, m);
      c.rect(5, 1, 6, 3, WHITE);
      dots(c, CLOTH.wine, 5, 2, 6, 2);
      dots(c, dark(m), 4, 2, 7, 2, 4, 3, 7, 3);
      c.col(9, 3, 9, dark(m));
      c.col(6, 4, 9, dark(m));
      dots(c, K, 6, 5, 6, 7);
      dots(c, GOLD, 3, 6, 4, 7, 5, 7);
      c.set(6, 6, lite(GOLD));
      dots(c, dark(m), 2, 6);
      c.clear(5, 9);
      c.clear(6, 9);
    },
  });
  torsos.push({
    name: 'butler tailcoat black white shirt front bow tie',
    theme: 'victorian',
    draw(c) {
      body(c, BLK);
      c.rect(4, 1, 7, 4, WHITE);
      c.rect(5, 5, 6, 6, WHITE);
      c.col(7, 1, 4, dark(WHITE));
      dots(c, BLK, 4, 2, 7, 2, 5, 2, 6, 2);
      dots(c, WHITE, 5, 2);
      dots(c, BLK, 5, 2);
      dots(c, STEEL, 5, 4, 5, 6);
      dots(c, hi(BLK), 3, 2, 3, 3, 3, 4, 8, 2, 8, 3, 8, 4, 4, 5, 7, 5);
      c.rect(4, 7, 7, 8, CLOTH.ash);
      dots(c, K, 5, 7, 5, 8);
      c.set(2, 2, hi(BLK));
    },
  });
  torsos.push({
    name: 'governess blouse slate high collar brooch belt',
    theme: 'victorian',
    draw(c) {
      const s = CLOTH.slate;
      body(c, s);
      c.row(1, 4, 7, WHITE);
      c.set(7, 1, dark(WHITE));
      dots(c, GOLD, 5, 2);
      dots(c, dark(s), 6, 2);
      c.col(3, 3, 7, dark(s));
      c.col(7, 3, 7, dark(s));
      dots(c, BONE, 5, 4, 5, 6);
      c.row(8, 2, 9, BLK);
      c.set(5, 8, STEEL);
      c.set(8, 9, GOLD);
    },
  });
  torsos.push({
    name: 'mourning dress black crepe jet beads locket',
    theme: 'victorian',
    draw(c) {
      body(c, BLK, true);
      c.clear(1, 6);
      c.clear(10, 6);
      c.row(1, 4, 7, hi(BLK));
      dots(c, STEEL, 4, 2, 5, 3, 6, 3, 7, 2);
      c.set(5, 4, BONE);
      c.set(6, 4, dark(BONE));
      c.row(6, 2, 9, hi(BLK));
      c.col(4, 7, 9, hi(BLK));
      c.col(7, 7, 9, hi(BLK));
      c.set(2, 2, hi(BLK));
    },
  });
  torsos.push({
    name: 'sweep jacket sooty patched red muffler',
    theme: 'victorian',
    draw(c) {
      body(c, SOOT);
      c.row(1, 4, 7, CLOTH.rust);
      c.col(4, 2, 4, CLOTH.rust);
      c.set(4, 5, dark(CLOTH.rust));
      c.set(7, 1, dark(CLOTH.rust));
      c.rect(7, 5, 8, 6, CLOTH.earth);
      c.set(8, 6, dark(CLOTH.earth));
      c.set(6, 4, BONE);
      c.col(6, 5, 9, K);
      dots(c, hi(SOOT), 2, 2, 3, 7, 5, 8, 2, 5);
      c.clear(2, 9);
      c.clear(7, 9);
    },
  });

  arms.push({
    name: 'frock coat black sleeve white cuff fair hand',
    theme: 'victorian',
    draw(c) {
      c.rect(1, 0, 3, 7, BLK);
      c.set(1, 0, hi(BLK));
      c.col(1, 1, 6, hi(BLK));
      c.row(8, 1, 3, WHITE);
      c.set(1, 7, dark(GOLD));
      c.rect(1, 9, 3, 10, SKINS.fair);
      c.col(3, 9, 10, dark(SKINS.fair));
    },
  });
  arms.push({
    name: 'puffed sleeve wine lace cuff pale hand',
    theme: 'victorian',
    draw(c) {
      const w = CLOTH.wine;
      c.rect(0, 0, 4, 3, w);
      c.rect(1, 4, 3, 7, w);
      c.col(4, 0, 3, dark(w));
      c.col(3, 4, 7, dark(w));
      c.set(0, 0, lite(w));
      c.set(1, 1, lite(w));
      c.set(2, 3, dark(w));
      c.row(8, 0, 4, WHITE);
      c.set(4, 8, dark(WHITE));
      c.rect(1, 9, 3, 10, SKINS.pale);
      c.col(3, 9, 10, dark(SKINS.pale));
    },
  });
  arms.push({
    name: 'maid black sleeve deep white cuff tan hand',
    theme: 'victorian',
    draw(c) {
      c.rect(1, 0, 3, 5, BLK);
      c.col(1, 0, 5, hi(BLK));
      c.rect(1, 6, 3, 8, WHITE);
      c.col(3, 6, 8, dark(WHITE));
      c.row(6, 1, 3, dark(WHITE));
      c.rect(1, 9, 3, 10, SKINS.tan);
      c.col(3, 9, 10, dark(SKINS.tan));
    },
  });
  arms.push({
    name: 'white shirt sleeve gold cufflink fair hand',
    theme: 'victorian',
    draw(c) {
      c.rect(1, 0, 3, 8, WHITE);
      c.col(3, 0, 8, dark(WHITE));
      dots(c, dark(WHITE), 2, 3, 1, 6);
      c.row(7, 1, 3, dark(WHITE));
      c.set(1, 8, GOLD);
      c.rect(1, 9, 3, 10, SKINS.fair);
      c.col(3, 9, 10, dark(SKINS.fair));
    },
  });
  arms.push({
    name: 'mourning sleeve black crepe frill black glove',
    theme: 'victorian',
    draw(c) {
      c.rect(1, 0, 3, 6, BLK);
      c.col(1, 0, 6, hi(BLK));
      c.row(3, 1, 3, hi(BLK));
      c.row(7, 0, 4, hi(BLK));
      c.set(4, 7, BLK);
      c.rect(1, 8, 3, 10, hex('#33323a'));
      c.col(3, 8, 10, BLK);
      c.set(2, 9, STEEL);
    },
  });

  legs.push({
    name: 'striped trousers grey white spats black shoes',
    theme: 'victorian',
    draw(c) {
      const a = CLOTH.ash;
      c.rect(1, 0, 4, 9, a);
      c.col(2, 0, 9, dark(a));
      c.col(4, 0, 9, dark(a));
      shoe(c, K);
      c.rect(1, 8, 4, 9, WHITE);
      c.row(10, 1, 3, WHITE);
      c.set(4, 10, hex('#33323a'));
      dots(c, K, 4, 8, 4, 9);
      c.row(11, 1, 5, hex('#33323a'));
    },
  });
  legs.push({
    name: 'long skirt wine bustle hem ruffle',
    theme: 'victorian',
    draw(c) {
      const w = CLOTH.wine;
      c.rect(1, 0, 4, 1, w);
      c.rect(0, 2, 5, 11, w);
      c.col(5, 2, 11, dark(w));
      c.col(2, 3, 9, dark(w));
      c.set(1, 2, lite(w));
      c.row(9, 0, 5, dark(w));
      for (let x = 0; x <= 5; x++) c.set(x, 11, x % 2 ? dark(w) : lite(w));
      c.row(10, 0, 4, w);
    },
  });
  legs.push({
    name: 'maid black skirt white apron black stockings',
    theme: 'victorian',
    draw(c) {
      c.rect(1, 0, 4, 1, BLK);
      c.rect(0, 2, 5, 8, BLK);
      c.col(5, 2, 8, K);
      c.col(4, 0, 8, hi(BLK));
      c.rect(1, 0, 2, 6, WHITE);
      c.rect(0, 2, 0, 6, WHITE);
      c.row(6, 0, 2, dark(WHITE));
      c.rect(2, 9, 3, 9, hex('#33323a'));
      shoe(c, K);
      c.clear(1, 10);
      c.row(11, 2, 5, hex('#33323a'));
    },
  });
  legs.push({
    name: 'buttoned boots brown slate skirt petticoat',
    theme: 'victorian',
    draw(c) {
      const s = CLOTH.slate;
      c.rect(1, 0, 4, 0, s);
      c.rect(0, 1, 5, 3, s);
      c.col(5, 1, 3, dark(s));
      c.col(2, 1, 3, dark(s));
      for (let x = 0; x <= 5; x++) c.set(x, 4, x % 2 ? WHITE : dark(WHITE));
      c.rect(1, 5, 4, 9, LEATHER);
      shoe(c, LEATHER);
      c.col(1, 5, 9, lite(LEATHER));
      dots(c, BONE, 4, 5, 4, 7, 4, 9);
    },
  });
  legs.push({
    name: 'butler black trousers satin stripe polished shoes',
    theme: 'victorian',
    draw(c) {
      c.rect(1, 0, 4, 9, BLK);
      c.col(3, 0, 9, hi(BLK));
      c.col(1, 0, 9, hi(BLK));
      c.col(2, 0, 9, BLK);
      c.col(3, 0, 9, BLK);
      c.col(4, 0, 9, STEEL);
      shoe(c, K);
      c.row(10, 2, 3, STEEL);
      c.row(11, 1, 5, hex('#33323a'));
    },
  });

  return { heads, torsos, arms, legs };
};
