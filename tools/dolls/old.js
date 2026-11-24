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
  /** Round spectacles: a rim each side of each eye, the temples. */
  const specs = (c, col) => {
    keeps(c, col, 4, 6, 6, 6, 7, 6, 9, 6, 3, 6, 10, 6);
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
    name: 'butler balding grey hair stiff collar pale',
    theme: 'victorian',
    skin: 'pale',
    draw(c, s) {
      const h = HAIR.grey;
      c.row(2, 5, 8, s);
      c.set(5, 2, lite(s));
      c.col(3, 4, 6, h);
      c.col(2, 4, 6, h);
      c.col(10, 4, 6, dark(h));
      c.col(11, 4, 6, dark(h));
      keeps(c, dark(s), 4, 7, 9, 7, 4, 8);
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
      for (let y = 4; y <= 10; y++) for (let x = 3; x <= 10; x++) if ((x + y) % 2 === 0) tint(c, x, y, 0.62);
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
      keeps(c, sm, 4, 7, 9, 7, 9, 5, 6, 10, 3, 9);
    },
  });
  heads.push({
    name: 'old gentleman monocle bald white side whiskers fair',
    theme: 'victorian',
    skin: 'fair',
    draw(c, s) {
      const h = HAIR.white;
      c.row(2, 5, 8, s);
      c.set(5, 2, lite(s));
      c.col(2, 5, 9, h);
      c.col(3, 5, 9, h);
      c.col(11, 5, 9, dark(h));
      c.col(10, 5, 9, dark(h));
      keeps(c, h, 4, 8, 4, 9, 5, 8, 6, 8);
      keeps(c, dark(h), 7, 8, 8, 8, 9, 8, 9, 9);
      keeps(c, GOLD, 8, 5, 9, 6, 8, 7, 7, 6);
      c.set(8, 6, K);
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
      c.rect(4, 1, 7, 5, WHITE);
      c.col(7, 1, 5, dark(WHITE));
      dots(c, BLK, 5, 2, 6, 2);
      dots(c, STEEL, 5, 4);
      dots(c, hi(BLK), 3, 2, 3, 3, 3, 4, 3, 5, 8, 2, 8, 3, 8, 4, 8, 5, 2, 2);
      c.rect(4, 6, 7, 8, CLOTH.ash);
      c.col(7, 6, 8, dark(CLOTH.ash));
      dots(c, K, 5, 6, 5, 8);
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

  /* =====================================================================================
   * 2. OLDTIME — town and frontier of the 1800s
   * ===================================================================================== */
  const OT = 'oldtime';
  /** A wide-brimmed hat: crown rows 0..2, the brim across the whole width on row 3. */
  const wideHat = (c, col, band, x0 = 0, x1 = 13) => {
    c.row(0, 5, 8, col);
    c.rect(4, 1, 9, 2, col);
    c.row(2, 4, 9, band);
    c.row(3, x0, x1, col);
    c.set(5, 0, lite(col));
    c.set(4, 1, lite(col));
    c.col(9, 1, 1, dark(col));
    c.set(8, 0, dark(col));
    c.row(3, 10, x1, dark(col));
  };
  /* gingham: a small red and white check */
  const GR = hex('#9a4a44'),
    GM = hex('#b98d80'),
    GW = hex('#d8cfc0');
  const gingham = (c, x0, y0, x1, y1) => {
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) if (c.get(x, y)) c.set(x, y, x % 2 === 0 && y % 2 === 0 ? GR : x % 2 === 0 || y % 2 === 0 ? GM : GW);
  };

  heads.push({
    name: 'sheriff wide hat moustache brown hair tan',
    theme: OT,
    skin: 'tan',
    draw(c) {
      wideHat(c, HIDE, LEATHER);
      hairSides(c, HAIR.brown, 5);
      bigStache(c, HAIR.brown);
    },
  });
  heads.push({
    name: 'schoolmarm poke bonnet slate ribbon blond hair pale',
    theme: OT,
    skin: 'pale',
    draw(c) {
      const b = CLOTH.slate,
        h = HAIR.blond;
      c.row(1, 4, 9, b);
      c.row(2, 3, 10, b);
      c.row(3, 2, 11, b);
      c.col(2, 4, 9, b);
      c.col(11, 4, 9, dark(b));
      c.row(3, 3, 10, lite(b));
      c.set(4, 1, lite(b));
      c.row(2, 3, 10, CLOTH.wine);
      dots(c, h, 3, 4, 4, 4, 5, 4);
      dots(c, dark(h), 8, 4, 9, 4, 10, 4);
      c.row(12, 5, 8, CLOTH.wine);
      dots(c, dark(CLOTH.wine), 4, 12, 9, 12);
    },
  });
  heads.push({
    name: 'preacher flat black hat white hair gaunt pale',
    theme: OT,
    skin: 'pale',
    draw(c, s) {
      const h = HAIR.white;
      c.rect(4, 1, 9, 2, BLK);
      c.row(1, 4, 9, hi(BLK));
      c.row(3, 1, 12, BLK);
      c.col(2, 4, 8, h);
      c.col(3, 4, 5, h);
      c.col(11, 4, 8, dark(h));
      c.set(10, 4, dark(h));
      keeps(c, dark(s), 4, 8, 9, 8, 4, 7);
      c.row(12, 4, 9, BLK);
      dots(c, WHITE, 6, 12, 7, 12);
    },
  });
  heads.push({
    name: 'blacksmith bald black beard soot tan',
    theme: OT,
    skin: 'tan',
    draw(c, s) {
      c.row(2, 5, 8, s);
      c.set(5, 2, lite(s));
      beard(c, HAIR.black, true);
      dots(c, HAIR.black, 3, 6, 4, 10);
      c.set(10, 6, dark(HAIR.black));
      keeps(c, mix(s, 0.55), 4, 4, 8, 3);
      dots(c, hi(HAIR.black), 5, 11);
    },
  });
  heads.push({
    name: 'saloon girl feather red curls rouge fair',
    theme: OT,
    skin: 'fair',
    draw(c) {
      const h = HAIR.red;
      c.row(1, 4, 8, h);
      c.row(2, 3, 9, h);
      c.row(3, 2, 10, h);
      dots(c, h, 2, 4, 2, 5, 3, 4, 1, 4, 3, 0, 6, 0, 4, 4);
      dots(c, dark(h), 11, 4, 11, 5, 10, 4, 10, 3, 11, 3, 7, 2, 4, 2);
      dots(c, lite(h), 5, 1);
      const f = CLOTH.teal;
      dots(c, lite(f), 10, 0, 10, 1, 9, 2);
      dots(c, f, 11, 0, 11, 1, 12, 1, 10, 2);
      keeps(c, ROUGE, 4, 8, 9, 8);
      keeps(c, RED, 6, 9, 7, 9);
      c.row(12, 5, 8, BLK);
      c.set(6, 12, RED);
    },
  });
  heads.push({
    name: 'prospector slouch hat long grey beard fair',
    theme: OT,
    skin: 'fair',
    expr: 'grin',
    draw(c) {
      const e = CLOTH.earth,
        h = HAIR.grey;
      c.row(0, 5, 7, e);
      c.rect(4, 1, 9, 2, e);
      c.row(3, 1, 12, e);
      dots(c, e, 1, 4, 0, 4);
      dots(c, dark(e), 12, 4, 13, 5, 9, 1, 9, 2, 11, 3, 12, 3);
      c.set(4, 1, lite(e));
      c.set(7, 1, K);
      beard(c, h, true);
      dots(c, h, 2, 8, 2, 9, 3, 10, 4, 11, 4, 12);
      dots(c, dark(h), 11, 8, 11, 9, 10, 10, 9, 11, 9, 12);
      hairSides(c, h, 6);
    },
  });
  heads.push({
    name: 'undertaker stovepipe hat crepe lank black hair ashen',
    theme: OT,
    skin: 'ashen',
    expr: 'hollow',
    draw(c, s) {
      c.rect(4, 0, 9, 2, BLK);
      c.col(4, 0, 2, hi(BLK));
      c.row(3, 2, 11, BLK);
      c.row(2, 4, 9, hex('#33323a'));
      dots(c, BLK, 12, 4, 12, 5, 12, 6, 13, 7);
      c.col(2, 4, 10, HAIR.black);
      c.col(3, 4, 7, HAIR.black);
      c.col(11, 4, 10, HAIR.black);
      c.col(10, 4, 6, HAIR.black);
      keeps(c, dark(s), 4, 8, 9, 8, 5, 10, 8, 10);
    },
  });
  heads.push({
    name: 'telegraph clerk green eyeshade pencil black hair pale',
    theme: OT,
    skin: 'pale',
    draw(c, s) {
      const h = HAIR.black;
      c.row(2, 4, 9, h);
      c.row(3, 3, 10, dark(VISOR));
      c.row(4, 2, 11, VISOR);
      dots(c, lite(VISOR), 3, 4, 4, 4);
      c.set(12, 4, dark(VISOR));
      c.set(6, 2, hi(h));
      for (let x = 4; x <= 9; x++) keep(c, x, 5, mix([s[0] * 0.8, s[1], s[2] * 0.8], 0.86));
      dots(c, CLOTH.mustard, 2, 5, 2, 6);
      c.set(2, 7, K);
      dots(c, h, 3, 5);
      c.set(10, 5, dark(h));
    },
  });
  heads.push({
    name: 'outlaw black hat wine bandana mask brown',
    theme: OT,
    skin: 'brown',
    expr: 'angry',
    draw(c) {
      const w = CLOTH.wine;
      wideHat(c, BLK, hex('#33323a'), 1, 12);
      c.set(5, 0, hi(BLK));
      c.rect(3, 8, 10, 9, w);
      c.row(7, 4, 9, w);
      c.row(10, 4, 9, w);
      c.row(11, 5, 8, dark(w));
      c.row(12, 6, 7, dark(w));
      c.col(10, 8, 9, dark(w));
      dots(c, lite(w), 4, 7, 3, 8);
      dots(c, GW, 5, 9, 8, 10);
      dots(c, dark(w), 11, 8, 12, 9);
      dots(c, HAIR.black, 3, 4, 3, 5);
    },
  });
  heads.push({
    name: 'barkeep centre parting handlebar moustache black hair fair',
    theme: OT,
    skin: 'fair',
    draw(c, s) {
      const h = HAIR.black;
      c.row(2, 4, 9, h);
      c.row(3, 3, 10, h);
      dots(c, h, 3, 4, 4, 4, 3, 5);
      dots(c, h, 9, 4, 10, 4, 10, 5);
      dots(c, s, 6, 3, 7, 3);
      dots(c, hi(h), 5, 2, 8, 2);
      c.row(8, 4, 9, h);
      keeps(c, h, 3, 7, 10, 7);
      c.row(12, 4, 9, WHITE);
      dots(c, CLOTH.wine, 5, 12, 6, 12, 7, 12, 8, 12);
      c.set(6, 12, dark(CLOTH.wine));
    },
  });
  heads.push({
    name: 'frontier woman long braid black hair brown',
    theme: OT,
    skin: 'brown',
    draw(c, s) {
      const h = HAIR.black;
      c.row(1, 5, 8, h);
      c.row(2, 4, 9, h);
      c.row(3, 3, 10, h);
      dots(c, h, 3, 4, 4, 4, 3, 5, 9, 4, 10, 4, 10, 5, 2, 4, 2, 5, 2, 6);
      c.set(6, 1, hi(h));
      for (let y = 4; y <= 12; y++) {
        c.set(11, y, y % 2 ? h : hi(h));
        if (y > 5) c.set(12, y, y % 2 ? hi(h) : h);
      }
      c.set(12, 12, CLOTH.rust);
      c.set(11, 12, CLOTH.rust);
      keeps(c, dark(s), 4, 8);
    },
  });

  torsos.push({
    name: 'duster coat tan open shirt rust neckerchief',
    theme: OT,
    draw(c) {
      body(c, KHAKI);
      c.rect(5, 3, 6, 9, CLOTH.cream);
      c.col(6, 3, 9, dark(CLOTH.cream));
      c.row(1, 4, 7, CLOTH.rust);
      c.row(2, 5, 6, CLOTH.rust);
      c.set(6, 2, dark(CLOTH.rust));
      c.col(4, 2, 9, dark(KHAKI));
      c.col(7, 2, 9, dark(KHAKI));
      dots(c, lite(KHAKI), 3, 2, 3, 3, 8, 2);
      c.row(4, 2, 3, dark(KHAKI));
      c.set(8, 4, dark(KHAKI));
      dots(c, LEATHER, 3, 6, 8, 6);
      dots(c, MUD, 2, 9, 3, 9, 8, 9);
    },
  });
  torsos.push({
    name: 'gingham dress red white check collar',
    theme: OT,
    draw(c) {
      body(c, GW, true);
      gingham(c, 0, 1, 11, 9);
      c.clear(2, 5);
      c.clear(9, 5);
      c.clear(1, 6);
      c.clear(10, 6);
      c.row(1, 4, 7, WHITE);
      dots(c, WHITE, 4, 2, 7, 2);
      c.set(7, 2, dark(WHITE));
      dots(c, GR, 5, 2, 6, 2);
      c.row(6, 2, 9, GR);
      c.col(9, 2, 4, GR);
      c.col(10, 7, 9, GR);
    },
  });
  torsos.push({
    name: 'sheriff vest brown star badge gun belt',
    theme: OT,
    draw(c) {
      const v = CLOTH.earth;
      body(c, CLOTH.cream);
      c.rect(2, 2, 4, 7, v);
      c.rect(7, 2, 9, 7, v);
      c.col(3, 1, 1, v);
      c.col(8, 1, 1, v);
      c.col(9, 2, 7, dark(v));
      c.set(2, 2, lite(v));
      dots(c, K, 5, 2, 6, 2);
      dots(c, LEATHER, 5, 3, 6, 3, 5, 4, 6, 4);
      dots(c, dark(CLOTH.cream), 6, 5, 6, 6, 6, 7);
      dots(c, GOLD, 8, 3, 7, 4, 8, 4, 9, 4, 8, 5);
      c.set(8, 4, lite(GOLD));
      c.row(8, 2, 9, LEATHER);
      c.row(9, 2, 9, dark(LEATHER));
      dots(c, GOLD, 5, 8, 6, 8);
      dots(c, BONE, 2, 9, 3, 9, 8, 9);
    },
  });
  torsos.push({
    name: 'preacher black coat white collar tabs cross',
    theme: OT,
    draw(c) {
      body(c, BLK);
      c.rect(5, 1, 6, 2, WHITE);
      c.set(6, 2, dark(WHITE));
      c.col(5, 3, 9, hi(BLK));
      dots(c, BONE, 6, 4, 6, 5, 6, 6, 6, 7, 5, 5, 7, 5);
      dots(c, dark(BONE), 7, 5, 6, 7);
      dots(c, hi(BLK), 2, 2, 3, 4, 3, 7);
    },
  });
  torsos.push({
    name: 'blacksmith leather apron bare chest brown',
    theme: OT,
    draw(c) {
      const s = SKINS.brown;
      body(c, s);
      c.row(3, 3, 4, dark(s));
      c.rect(3, 4, 8, 9, HIDE);
      c.rect(4, 3, 7, 3, HIDE);
      dots(c, LEATHER, 4, 1, 4, 2, 7, 1, 7, 2);
      c.col(8, 4, 9, dark(HIDE));
      c.row(7, 3, 8, dark(HIDE));
      dots(c, lite(HIDE), 4, 3, 3, 4);
      dots(c, K, 5, 5, 7, 8, 4, 8);
      dots(c, RED, 6, 6);
      c.set(2, 6, mix(s, 0.55));
    },
  });
  torsos.push({
    name: 'saloon corset plum lace bare shoulders fair',
    theme: OT,
    draw(c) {
      const s = SKINS.fair,
        p = CLOTH.plum;
      body(c, s, true);
      c.rect(2, 4, 9, 9, p);
      c.rect(1, 8, 10, 9, BLK);
      c.clear(1, 6);
      c.clear(10, 6);
      c.clear(1, 7);
      c.clear(10, 7);
      c.clear(2, 6);
      c.clear(9, 6);
      for (let x = 2; x <= 9; x++) c.set(x, 3, x % 2 ? WHITE : dark(WHITE));
      c.col(9, 4, 7, dark(p));
      dots(c, lite(p), 2, 4, 3, 5);
      dots(c, GOLD, 5, 4, 6, 5, 5, 6, 6, 7);
      dots(c, dark(p), 6, 4, 5, 5, 6, 6, 5, 7);
      for (let x = 1; x <= 10; x += 2) c.set(x, 9, hi(BLK));
      dots(c, RED, 8, 8);
      c.set(4, 2, dark(s));
      c.set(7, 2, dark(s));
    },
  });
  torsos.push({
    name: 'braces over collarless shirt cream tan',
    theme: OT,
    draw(c) {
      const sh = CLOTH.cream,
        s = SKINS.tan;
      body(c, sh);
      c.rect(5, 1, 6, 2, s);
      c.set(6, 2, dark(s));
      c.col(3, 1, 8, CLOTH.rust);
      c.col(8, 1, 8, dark(CLOTH.rust));
      dots(c, GOLD, 3, 8, 8, 8);
      dots(c, dark(sh), 5, 4, 5, 6, 6, 3, 2, 5, 7, 6);
      c.row(9, 2, 9, CLOTH.earth);
      c.set(9, 9, dark(CLOTH.earth));
    },
  });
  torsos.push({
    name: 'clerk waistcoat slate striped shirt bow tie pencil',
    theme: OT,
    draw(c) {
      const v = CLOTH.slate;
      body(c, WHITE);
      dots(c, v, 1, 1, 10, 1);
      c.rect(2, 3, 9, 9, v);
      c.row(2, 3, 8, v);
      c.rect(5, 1, 6, 3, WHITE);
      dots(c, CLOTH.wine, 5, 2, 6, 2);
      c.col(9, 3, 9, dark(v));
      c.col(6, 4, 9, dark(v));
      dots(c, BONE, 5, 5, 5, 7);
      c.row(5, 7, 8, dark(v));
      dots(c, CLOTH.mustard, 8, 3, 8, 4);
      dots(c, lite(v), 2, 3, 3, 2);
      dots(c, WHITE, 1, 1, 10, 1);
      dots(c, dark(WHITE), 2, 1, 9, 1, 2, 2, 9, 2);
    },
  });

  arms.push({
    name: 'duster coat tan sleeve leather glove',
    theme: OT,
    draw(c) {
      c.rect(1, 0, 3, 7, KHAKI);
      c.col(3, 0, 7, dark(KHAKI));
      c.set(1, 0, lite(KHAKI));
      dots(c, dark(KHAKI), 2, 4, 1, 6);
      c.row(7, 0, 4, HIDE);
      c.rect(1, 8, 3, 10, HIDE);
      c.col(3, 8, 10, dark(HIDE));
      c.set(4, 7, dark(HIDE));
    },
  });
  arms.push({
    name: 'striped shirt sleeve garter black fair hand',
    theme: OT,
    draw(c) {
      c.rect(1, 0, 3, 8, WHITE);
      c.row(2, 0, 4, WHITE);
      c.col(2, 0, 8, CLOTH.ash);
      c.col(3, 0, 8, dark(WHITE));
      c.set(4, 2, dark(WHITE));
      c.row(3, 1, 3, BLK);
      c.set(2, 3, STEEL);
      c.row(8, 1, 3, WHITE);
      c.set(3, 8, dark(WHITE));
      c.rect(1, 9, 3, 10, SKINS.fair);
      c.col(3, 9, 10, dark(SKINS.fair));
    },
  });
  arms.push({
    name: 'gingham sleeve red white check cuff pale hand',
    theme: OT,
    draw(c) {
      c.rect(1, 0, 3, 7, GW);
      c.row(1, 0, 4, GW);
      c.row(2, 0, 4, GW);
      gingham(c, 0, 0, 4, 7);
      c.col(3, 3, 7, GR);
      c.row(8, 1, 3, WHITE);
      c.set(3, 8, dark(WHITE));
      c.rect(1, 9, 3, 10, SKINS.pale);
      c.col(3, 9, 10, dark(SKINS.pale));
    },
  });
  arms.push({
    name: 'blacksmith bare arm leather wrist cuff soot brown',
    theme: OT,
    draw(c) {
      const s = SKINS.brown;
      c.rect(1, 0, 3, 10, s);
      c.rect(0, 1, 0, 3, s);
      c.col(3, 0, 10, dark(s));
      c.set(1, 0, lite(s));
      c.set(1, 4, dark(s));
      c.rect(1, 7, 3, 8, HIDE);
      c.set(3, 7, dark(HIDE));
      c.set(3, 8, dark(HIDE));
      c.set(2, 7, BONE);
      dots(c, mix(s, 0.5), 2, 5, 1, 10, 2, 10);
    },
  });
  arms.push({
    name: 'saloon long glove plum bare shoulder fair',
    theme: OT,
    draw(c) {
      const s = SKINS.fair,
        p = CLOTH.plum;
      c.rect(1, 0, 3, 3, s);
      c.col(3, 0, 3, dark(s));
      c.set(1, 0, lite(s));
      c.rect(1, 4, 3, 10, p);
      c.col(3, 4, 10, dark(p));
      c.row(4, 0, 4, lite(p));
      c.set(4, 4, p);
      c.row(8, 1, 3, GOLD);
      c.set(3, 8, dark(GOLD));
    },
  });

  legs.push({
    name: 'riding boots brown tan trousers spur',
    theme: OT,
    draw(c) {
      c.rect(1, 0, 4, 4, KHAKI);
      c.col(4, 0, 4, dark(KHAKI));
      c.set(2, 2, dark(KHAKI));
      c.rect(1, 5, 4, 9, LEATHER);
      shoe(c, LEATHER);
      c.row(5, 0, 5, HIDE);
      c.col(1, 6, 9, lite(LEATHER));
      c.set(0, 10, STEEL);
      c.set(0, 9, BONE);
    },
  });
  legs.push({
    name: 'chaps leather fringe denim boots',
    theme: OT,
    draw(c) {
      c.rect(1, 0, 4, 9, DENIM);
      c.rect(2, 1, 4, 9, HIDE);
      c.col(2, 1, 9, lite(HIDE));
      c.col(4, 1, 9, dark(HIDE));
      for (let y = 2; y <= 9; y += 2) c.set(5, y, HIDE);
      c.row(0, 1, 4, LEATHER);
      c.set(2, 0, GOLD);
      dots(c, BONE, 3, 3, 3, 6);
      shoe(c, LEATHER);
    },
  });
  legs.push({
    name: 'gingham long skirt red white check boots',
    theme: OT,
    draw(c) {
      c.rect(1, 0, 4, 1, GW);
      c.rect(0, 2, 5, 9, GW);
      gingham(c, 0, 0, 5, 9);
      c.col(5, 2, 9, GR);
      c.row(9, 0, 5, GR);
      shoe(c, LEATHER);
      c.clear(1, 10);
      c.clear(1, 11);
      for (let x = 0; x <= 5; x++) c.set(x, 10, x % 2 ? WHITE : dark(WHITE));
      c.clear(0, 10);
      c.rect(3, 10, 4, 10, LEATHER);
    },
  });
  legs.push({
    name: 'black trousers dusty hems black shoes',
    theme: OT,
    draw(c) {
      c.rect(1, 0, 4, 9, BLK);
      c.col(1, 0, 9, hi(BLK));
      c.col(4, 0, 9, K);
      dots(c, KHAKI, 1, 9, 3, 9, 2, 8);
      dots(c, dark(KHAKI), 2, 9, 4, 9);
      shoe(c, hex('#33323a'));
      c.set(3, 10, KHAKI);
    },
  });
  legs.push({
    name: 'saloon ruffled skirt plum striped stockings heeled boots',
    theme: OT,
    draw(c) {
      const p = CLOTH.plum;
      c.rect(1, 0, 4, 0, p);
      c.rect(0, 1, 5, 3, p);
      c.col(5, 1, 3, dark(p));
      c.set(2, 2, dark(p));
      for (let x = 0; x <= 5; x++) c.set(x, 4, x % 2 ? BLK : hi(BLK));
      c.rect(2, 5, 3, 7, WHITE);
      c.row(5, 2, 3, RED);
      c.row(7, 2, 3, BLK);
      c.set(3, 6, dark(WHITE));
      c.rect(2, 8, 3, 9, BLK);
      shoe(c, BLK);
      c.clear(1, 10);
      c.set(2, 9, hi(BLK));
      c.set(2, 11, K);
      c.clear(3, 11);
    },
  });

  /* =====================================================================================
   * 3. TWENTIES — the 1920's of a Lovecraft investigation
   * ===================================================================================== */
  const TW = 'twenties';
  const TRENCH = hex('#9a8a66'),
    CULT = hex('#2b2236'),
    SIGIL = hex('#c9b84a'),
    NYLON = hex('#b89a7c');
  /** A fedora: pinched crown, a band, the brim a little past the face. */
  const fedora = (c, col, band) => {
    dots(c, col, 5, 0, 8, 0);
    c.rect(4, 1, 9, 2, col);
    c.row(2, 4, 9, band);
    c.row(3, 1, 12, col);
    c.set(4, 1, lite(col));
    c.set(5, 0, lite(col));
    c.set(9, 1, dark(col));
    c.row(3, 9, 12, dark(col));
  };

  heads.push({
    name: 'detective grey fedora stubble cigarette brown hair fair',
    theme: TW,
    skin: 'fair',
    draw(c, s) {
      fedora(c, CLOTH.slate, BLK);
      hairSides(c, HAIR.brown, 4);
      for (let x = 3; x <= 10; x++) keep(c, x, 4, mix(s, 0.8));
      for (const [x, y] of [[3, 9], [4, 10], [5, 10], [5, 11], [6, 11], [7, 11], [8, 11], [9, 10], [10, 9]]) tint(c, x, y, 0.82);
      keeps(c, WHITE, 8, 10, 9, 10);
      c.set(10, 10, CLOTH.rust);
    },
  });
  heads.push({
    name: 'flapper black bob gold headband red lips pale',
    theme: TW,
    skin: 'pale',
    draw(c) {
      const h = HAIR.black;
      c.row(1, 5, 8, h);
      c.row(2, 4, 9, h);
      c.row(3, 3, 10, h);
      c.row(4, 3, 10, h);
      c.col(2, 3, 8, h);
      c.col(11, 3, 8, h);
      dots(c, h, 3, 5, 3, 6, 3, 7, 3, 8, 10, 5, 10, 6, 10, 7, 10, 8, 4, 5);
      c.set(6, 1, hi(h));
      c.row(3, 2, 11, GOLD);
      c.set(11, 3, dark(GOLD));
      dots(c, CLOTH.teal, 4, 3);
      dots(c, lite(CLOTH.teal), 4, 2);
      keeps(c, RED, 6, 9, 7, 9);
    },
  });
  heads.push({
    name: 'professor round glasses wild white hair bow tie fair',
    theme: TW,
    skin: 'fair',
    draw(c, s) {
      const h = HAIR.white;
      c.row(2, 5, 8, s);
      dots(c, h, 3, 2, 4, 2, 9, 2, 2, 3, 3, 3, 2, 4, 3, 4, 1, 4, 2, 5, 3, 5, 2, 1, 4, 1);
      dots(c, dark(h), 10, 2, 10, 3, 11, 3, 10, 4, 11, 4, 12, 4, 11, 5, 10, 5, 11, 1, 9, 1);
      specs(c, STEEL);
      keeps(c, STEEL, 4, 7, 5, 7, 8, 7, 9, 7);
      keeps(c, GLASS, 4, 6, 9, 6);
      c.row(12, 4, 9, CLOTH.wine);
      dots(c, dark(CLOTH.wine), 6, 12, 7, 12);
    },
  });
  heads.push({
    name: 'gangster black fedora white band scar black hair tan',
    theme: TW,
    skin: 'tan',
    draw(c, s) {
      fedora(c, BLK, WHITE);
      c.set(5, 0, hi(BLK));
      c.set(4, 1, hi(BLK));
      hairSides(c, HAIR.black, 5);
      const sc = hex('#8a4a44');
      keeps(c, sc, 9, 4, 9, 5, 9, 7, 9, 8, 8, 9);
      keeps(c, dark(s), 4, 8);
      c.row(12, 5, 8, WHITE);
      dots(c, BLK, 6, 12);
    },
  });
  heads.push({
    name: 'jazz singer finger waves gardenia gold earrings black hair brown',
    theme: TW,
    skin: 'brown',
    draw(c) {
      const h = HAIR.black;
      c.row(2, 4, 9, h);
      c.row(3, 3, 10, h);
      dots(c, h, 3, 4, 4, 4, 3, 5, 3, 6, 10, 4, 10, 5, 9, 4);
      dots(c, hi(h), 5, 2, 7, 3, 4, 3, 8, 2);
      dots(c, WHITE, 10, 2, 11, 2, 10, 3, 11, 3, 11, 1);
      c.set(11, 3, dark(WHITE));
      c.set(10, 2, GOLD);
      keeps(c, GOLD, 3, 8, 10, 8);
      c.set(2, 9, GOLD);
      c.set(11, 9, dark(GOLD));
      keeps(c, CLOTH.wine, 6, 9, 7, 9);
    },
  });
  heads.push({
    name: 'newsboy tweed cap freckles red hair pale',
    theme: TW,
    skin: 'pale',
    draw(c, s) {
      c.set(6, 0, dark(TWEED));
      c.row(1, 4, 9, TWEED);
      c.row(2, 3, 10, TWEED);
      c.row(3, 2, 12, dark(TWEED));
      c.set(13, 4, dark(TWEED));
      c.set(12, 4, dark(TWEED));
      dots(c, lite(TWEED), 4, 1, 6, 2, 8, 1);
      dots(c, HAIR.red, 3, 4, 3, 5, 4, 4, 10, 4);
      c.set(10, 5, dark(HAIR.red));
      const fr = mix(s, 0.78);
      keeps(c, fr, 4, 7, 6, 7, 9, 7, 5, 8, 8, 8);
    },
  });
  heads.push({
    name: 'cultist hood dark sigil shadowed face ashen',
    theme: TW,
    skin: 'ashen',
    draw(c) {
      HATS.hood(c, CULT);
      c.row(0, 5, 8, CULT);
      c.row(4, 4, 9, CULT);
      c.set(4, 1, hi(CULT));
      c.set(3, 2, hi(CULT));
      for (let x = 4; x <= 9; x++) {
        tint(c, x, 5, 0.6);
        tint(c, x, 6, 0.8);
      }
      for (let y = 5; y <= 10; y++) tint(c, 4, y, 0.7), tint(c, 9, y, 0.7);
      dots(c, SIGIL, 6, 1, 7, 2, 6, 3, 5, 2);
      c.set(6, 2, BLOOD);
    },
  });
  heads.push({
    name: 'aviator leather cap goggles white scarf tan',
    theme: TW,
    skin: 'tan',
    draw(c) {
      const l = LEATHER;
      c.row(1, 4, 9, l);
      c.row(2, 3, 10, l);
      c.row(3, 3, 10, l);
      c.row(4, 3, 10, l);
      c.col(2, 3, 9, l);
      c.col(3, 5, 9, l);
      c.col(11, 3, 9, dark(l));
      c.col(10, 5, 9, dark(l));
      dots(c, lite(l), 4, 1, 3, 2, 5, 1);
      c.row(3, 3, 10, K);
      c.rect(4, 3, 5, 4, GLASS);
      c.rect(8, 3, 9, 4, GLASS);
      dots(c, lite(GLASS), 4, 3, 8, 3);
      dots(c, STEEL, 6, 4, 7, 4, 3, 4, 10, 4);
      dots(c, lite(l), 3, 10);
      c.set(10, 10, dark(l));
      c.row(12, 4, 9, WHITE);
      c.set(9, 12, dark(WHITE));
    },
  });
  heads.push({
    name: 'lady cloche hat forest ribbon black curls brown',
    theme: TW,
    skin: 'brown',
    draw(c) {
      const f = CLOTH.forest,
        h = HAIR.black;
      c.row(1, 5, 8, f);
      c.row(2, 3, 10, f);
      c.rect(2, 3, 11, 4, f);
      dots(c, f, 2, 5);
      dots(c, dark(f), 11, 5, 11, 4, 11, 3, 10, 2);
      c.row(3, 2, 11, CLOTH.mustard);
      dots(c, dark(CLOTH.mustard), 10, 3, 11, 3);
      dots(c, CLOTH.mustard, 11, 2, 12, 3);
      dots(c, lite(f), 5, 1, 4, 2);
      dots(c, h, 2, 6, 3, 6, 2, 7, 3, 7, 3, 8);
      dots(c, h, 11, 6, 10, 6, 11, 7, 10, 7, 10, 8);
      keeps(c, GOLD, 3, 9);
    },
  });
  heads.push({
    name: 'innsmouth look fish eyes gills balding drowned',
    theme: TW,
    skin: 'drowned',
    draw(c, s) {
      c.row(2, 5, 8, s);
      c.set(5, 2, lite(s));
      dots(c, HAIR.black, 4, 2, 7, 1, 9, 2, 3, 3, 10, 3);
      keeps(c, WHITE, 4, 6, 9, 6, 4, 5, 5, 5, 8, 5, 9, 5);
      keeps(c, dark(s), 4, 7, 5, 7, 8, 7, 9, 7);
      keeps(c, dark(dark(s)), 4, 9, 5, 9, 8, 9, 9, 9);
      dots(c, dark(dark(s)), 3, 8, 3, 10, 10, 8, 10, 10);
      dots(c, dark(s), 2, 9, 11, 9);
      c.row(12, 5, 8, dark(s));
      dots(c, K, 5, 12, 7, 12);
      tint(c, 9, 3, 0.8);
      tint(c, 4, 4, 0.85);
    },
  });
  heads.push({
    name: 'spiritualist medium plum turban jewel kohl eyes pale',
    theme: TW,
    skin: 'pale',
    draw(c, s) {
      const p = CLOTH.plum;
      c.row(0, 5, 8, p);
      c.row(1, 4, 9, p);
      c.row(2, 3, 10, p);
      c.row(3, 3, 10, p);
      c.row(4, 3, 10, p);
      dots(c, p, 2, 3, 2, 4);
      dots(c, dark(p), 11, 3, 11, 4, 9, 1, 10, 2, 4, 3, 5, 2, 9, 3, 8, 2, 10, 4);
      dots(c, lite(p), 5, 0, 4, 1, 3, 2);
      dots(c, GOLD, 6, 2, 7, 2, 6, 4, 7, 4);
      dots(c, CLOTH.teal, 6, 3);
      dots(c, lite(CLOTH.teal), 7, 3);
      dots(c, BONE, 6, 1, 6, 0);
      keeps(c, mix(s, 0.6), 4, 5, 5, 5, 8, 5, 9, 5, 4, 7, 5, 7, 8, 7, 9, 7);
      dots(c, GOLD, 2, 7, 2, 8, 11, 7);
      c.set(11, 8, dark(GOLD));
    },
  });

  torsos.push({
    name: 'pinstripe suit navy white shirt wine tie pocket square',
    theme: TW,
    draw(c) {
      const n = CLOTH.navy,
        st = mix(n, 1.7);
      body(c, n);
      for (const x of [3, 8]) c.col(x, 2, 9, st);
      dots(c, st, 1, 1, 10, 1);
      c.rect(5, 1, 6, 4, WHITE);
      dots(c, CLOTH.wine, 5, 2, 6, 2, 5, 3, 6, 3);
      dots(c, dark(CLOTH.wine), 6, 3, 5, 4);
      c.set(6, 4, n);
      dots(c, dark(n), 4, 2, 4, 3, 4, 4, 7, 2, 7, 3, 7, 4);
      c.col(6, 5, 9, dark(n));
      dots(c, BONE, 5, 6, 5, 8);
      c.set(8, 3, WHITE);
    },
  });
  torsos.push({
    name: 'beaded dress teal pearls fringe bare shoulders pale',
    theme: TW,
    draw(c) {
      const s = SKINS.pale,
        t = CLOTH.teal;
      body(c, s);
      c.rect(2, 3, 9, 9, t);
      dots(c, t, 3, 1, 3, 2, 8, 1, 8, 2);
      c.col(9, 3, 9, dark(t));
      c.set(2, 3, lite(t));
      for (let x = 2; x <= 9; x += 2) c.set(x, 6, GOLD);
      for (let x = 3; x <= 9; x += 2) c.set(x, 8, dark(GOLD));
      for (let x = 2; x <= 9; x++) c.set(x, 9, x % 2 ? lite(t) : dark(t));
      dots(c, BONE, 4, 2, 4, 3, 4, 4, 5, 5, 6, 5, 7, 4, 7, 3, 7, 2);
      dots(c, dark(BONE), 6, 5, 7, 4);
    },
  });
  torsos.push({
    name: 'trench coat beige belted double breasted',
    theme: TW,
    draw(c) {
      const t = TRENCH;
      body(c, t);
      c.rect(5, 1, 6, 2, WHITE);
      dots(c, BLK, 5, 2, 6, 2);
      dots(c, lite(t), 4, 1, 7, 1, 3, 2, 4, 2, 4, 3, 8, 2, 7, 2, 7, 3);
      dots(c, dark(t), 4, 4, 7, 4, 5, 3, 6, 3, 2, 1, 9, 1);
      c.col(6, 4, 9, dark(t));
      dots(c, LEATHER, 4, 5, 8, 5);
      c.row(7, 2, 9, dark(t));
      dots(c, LEATHER, 5, 7, 6, 7);
      c.set(5, 7, GOLD);
      dots(c, LEATHER, 4, 9, 8, 9);
    },
  });
  torsos.push({
    name: 'tweed jacket waistcoat bow tie pen pocket',
    theme: TW,
    draw(c) {
      const t = TWEED,
        v = CLOTH.earth;
      body(c, t);
      c.rect(4, 2, 7, 9, v);
      c.rect(5, 1, 6, 2, WHITE);
      dots(c, CLOTH.wine, 5, 2, 6, 2);
      dots(c, BONE, 5, 4, 5, 6, 5, 8);
      c.col(7, 3, 9, dark(v));
      dots(c, lite(t), 3, 2, 3, 3, 8, 2, 2, 5, 3, 8, 8, 7);
      dots(c, dark(t), 2, 4, 3, 6, 8, 4, 2, 8, 8, 9, 3, 4);
      dots(c, GOLD, 8, 5);
      dots(c, K, 8, 6);
      c.row(5, 2, 2, dark(t));
    },
  });
  torsos.push({
    name: 'cultist robe dark yellow sigil rope belt',
    theme: TW,
    draw(c) {
      body(c, CULT, true);
      dots(c, hi(CULT), 2, 2, 3, 1, 4, 2, 7, 2, 8, 1, 2, 5, 1, 7);
      c.row(1, 5, 6, K);
      c.set(5, 2, K);
      c.set(6, 2, K);
      dots(c, SIGIL, 5, 3, 6, 3, 4, 4, 7, 4, 5, 5, 6, 5, 7, 6);
      dots(c, BLOOD, 5, 4, 6, 4);
      c.row(7, 1, 10, BONE);
      c.set(10, 7, dark(BONE));
      dots(c, BONE, 4, 8, 4, 9);
      dots(c, dark(BONE), 3, 7);
      c.col(10, 8, 9, K);
      c.set(10, 6, K);
    },
  });
  torsos.push({
    name: 'aviator leather jacket fleece collar white scarf',
    theme: TW,
    draw(c) {
      const l = HIDE;
      body(c, l);
      c.row(1, 3, 8, BONE);
      dots(c, BONE, 3, 2, 4, 2, 7, 2, 8, 2);
      dots(c, dark(BONE), 8, 2, 8, 1, 4, 3, 7, 3);
      c.rect(5, 1, 6, 4, WHITE);
      c.set(5, 5, WHITE);
      c.col(6, 2, 4, dark(WHITE));
      c.col(6, 5, 8, dark(l));
      dots(c, STEEL, 6, 6);
      c.row(6, 2, 4, dark(l));
      c.row(6, 7, 9, dark(l));
      c.row(9, 2, 9, LEATHER);
      dots(c, GOLD, 5, 9);
      dots(c, lite(l), 2, 3, 3, 4);
    },
  });
  torsos.push({
    name: 'newsboy knitted vest rust shirt satchel strap newspapers',
    theme: TW,
    draw(c) {
      const r = CLOTH.rust;
      body(c, WHITE);
      c.rect(2, 2, 9, 9, r);
      c.rect(5, 1, 6, 2, WHITE);
      dots(c, dark(WHITE), 6, 2);
      c.col(9, 2, 9, dark(r));
      dots(c, lite(r), 2, 2, 3, 3);
      c.row(8, 2, 9, dark(r));
      for (let i = 0; i < 7; i++) c.set(8 - i, 2 + i, LEATHER);
      c.set(8, 1, LEATHER);
      c.rect(2, 8, 4, 9, KHAKI);
      c.row(7, 2, 3, WHITE);
      c.set(3, 7, dark(WHITE));
      c.set(2, 8, dark(KHAKI));
    },
  });
  torsos.push({
    name: 'evening gown wine sequins gardenia corsage bare shoulders brown',
    theme: TW,
    draw(c) {
      const s = SKINS.brown,
        w = CLOTH.wine;
      body(c, s);
      c.rect(2, 4, 9, 9, w);
      dots(c, w, 3, 3, 4, 3, 7, 3, 8, 3, 2, 3, 9, 3);
      c.clear(2, 6);
      c.clear(9, 6);
      c.col(9, 4, 9, dark(w));
      dots(c, lite(w), 2, 4, 3, 5, 5, 7, 7, 5, 4, 9, 8, 8);
      dots(c, GOLD, 4, 5, 6, 8, 3, 8);
      dots(c, WHITE, 8, 3, 8, 4, 7, 4);
      c.set(8, 4, GOLD);
      c.set(5, 3, dark(s));
      c.set(6, 3, dark(s));
      dots(c, BONE, 4, 2, 5, 2, 6, 2, 7, 2);
    },
  });

  arms.push({
    name: 'pinstripe sleeve navy white cuff tan hand',
    theme: TW,
    draw(c) {
      const n = CLOTH.navy;
      c.rect(1, 0, 3, 7, n);
      c.col(2, 0, 7, mix(n, 1.7));
      c.col(3, 0, 7, dark(n));
      c.set(1, 0, lite(n));
      c.row(8, 1, 3, WHITE);
      c.set(3, 8, dark(WHITE));
      c.rect(1, 9, 3, 10, SKINS.tan);
      c.col(3, 9, 10, dark(SKINS.tan));
    },
  });
  arms.push({
    name: 'trench coat sleeve beige cuff strap black leather glove',
    theme: TW,
    draw(c) {
      const t = TRENCH;
      c.rect(1, 0, 3, 7, t);
      c.col(3, 0, 7, dark(t));
      c.set(1, 0, lite(t));
      c.set(1, 1, dark(t));
      c.row(6, 1, 3, dark(t));
      c.set(2, 6, LEATHER);
      c.rect(1, 8, 3, 10, hex('#33323a'));
      c.col(3, 8, 10, BLK);
      c.set(1, 8, STEEL);
    },
  });
  arms.push({
    name: 'tweed sleeve leather elbow patch fair hand',
    theme: TW,
    draw(c) {
      const t = TWEED;
      c.rect(1, 0, 3, 8, t);
      c.col(3, 0, 8, dark(t));
      dots(c, lite(t), 1, 0, 2, 2, 2, 7);
      c.rect(1, 4, 2, 5, HIDE);
      c.set(2, 5, dark(HIDE));
      c.set(1, 8, BONE);
      c.rect(1, 9, 3, 10, SKINS.fair);
      c.col(3, 9, 10, dark(SKINS.fair));
      c.set(2, 10, K);
    },
  });
  arms.push({
    name: 'evening glove long cream bracelet bare shoulder pale',
    theme: TW,
    draw(c) {
      const s = SKINS.pale,
        g = CLOTH.cream;
      c.rect(1, 0, 3, 3, s);
      c.col(3, 0, 3, dark(s));
      c.set(1, 0, lite(s));
      c.rect(1, 4, 3, 10, g);
      c.col(3, 4, 10, dark(g));
      c.row(4, 1, 3, lite(g));
      c.row(7, 1, 3, GOLD);
      c.set(3, 7, dark(GOLD));
      c.set(2, 8, CLOTH.teal);
    },
  });
  arms.push({
    name: 'cultist robe wide sleeve dark ashen hand',
    theme: TW,
    draw(c) {
      c.rect(1, 0, 3, 4, CULT);
      c.rect(0, 5, 4, 8, CULT);
      c.set(1, 0, hi(CULT));
      c.col(1, 1, 6, hi(CULT));
      c.row(8, 0, 4, K);
      c.set(0, 8, SIGIL);
      c.set(4, 8, SIGIL);
      c.rect(1, 9, 3, 10, SKINS.ashen);
      c.col(3, 9, 10, dark(SKINS.ashen));
      c.set(2, 10, dark(SKINS.ashen));
    },
  });

  legs.push({
    name: 'pinstripe trousers navy two-tone shoes',
    theme: TW,
    draw(c) {
      const n = CLOTH.navy;
      c.rect(1, 0, 4, 9, n);
      c.col(2, 0, 9, mix(n, 1.7));
      c.col(4, 0, 9, dark(n));
      shoe(c, WHITE);
      dots(c, LEATHER, 1, 10, 4, 10, 5, 11, 4, 11, 1, 11);
    },
  });
  legs.push({
    name: 'plus-fours tweed argyle socks brown brogues',
    theme: TW,
    draw(c) {
      const t = TWEED;
      c.rect(1, 0, 4, 5, t);
      c.rect(0, 3, 5, 5, t);
      c.col(5, 3, 5, dark(t));
      c.col(4, 0, 2, dark(t));
      dots(c, lite(t), 1, 1, 2, 4);
      dots(c, dark(t), 3, 2, 1, 5, 3, 5);
      c.rect(1, 6, 4, 9, CLOTH.mustard);
      dots(c, CLOTH.wine, 2, 6, 3, 7, 2, 8, 1, 7, 4, 8, 3, 9, 1, 9);
      c.col(4, 6, 9, dark(CLOTH.mustard));
      c.set(4, 8, dark(CLOTH.wine));
      shoe(c, HIDE);
      c.set(2, 10, lite(HIDE));
    },
  });
  legs.push({
    name: 'beaded dress hem teal fringe stockings t-bar shoes',
    theme: TW,
    draw(c) {
      const t = CLOTH.teal;
      c.rect(1, 0, 4, 2, t);
      c.rect(0, 1, 5, 2, t);
      c.col(5, 1, 2, dark(t));
      for (let x = 0; x <= 5; x++) c.set(x, 3, x % 2 ? lite(t) : dark(t));
      dots(c, GOLD, 1, 1, 3, 1);
      c.rect(2, 4, 3, 9, NYLON);
      c.col(3, 4, 9, dark(NYLON));
      shoe(c, BLK);
      c.clear(1, 10);
      c.set(2, 10, NYLON);
      c.set(3, 10, BLK);
      c.row(9, 2, 3, BLK);
      c.row(11, 2, 5, hex('#33323a'));
      c.set(4, 10, hi(BLK));
    },
  });
  legs.push({
    name: 'aviator breeches khaki tall laced boots',
    theme: TW,
    draw(c) {
      c.rect(1, 0, 4, 4, KHAKI);
      c.rect(0, 1, 5, 3, KHAKI);
      c.col(5, 1, 3, dark(KHAKI));
      c.set(4, 4, dark(KHAKI));
      c.set(1, 1, lite(KHAKI));
      c.rect(1, 5, 4, 9, LEATHER);
      shoe(c, LEATHER);
      c.row(5, 1, 4, lite(LEATHER));
      dots(c, BONE, 3, 6, 3, 8);
      dots(c, HIDE, 3, 7, 3, 9, 2, 10);
    },
  });
  legs.push({
    name: 'cultist robe hem dark frayed bare ashen toes',
    theme: TW,
    draw(c) {
      const s = SKINS.ashen;
      c.rect(1, 0, 4, 1, CULT);
      c.rect(0, 2, 5, 10, CULT);
      c.col(5, 2, 10, K);
      c.col(1, 2, 9, hi(CULT));
      c.col(3, 4, 10, K);
      c.clear(0, 10);
      c.clear(2, 10);
      c.clear(5, 10);
      c.row(9, 0, 5, hi(CULT));
      c.set(3, 9, K);
      c.rect(3, 11, 5, 11, s);
      c.set(4, 10, s);
      c.set(5, 11, dark(s));
    },
  });

  /* =====================================================================================
   * 4. APOTHECARY — the chemist and the herb-woman
   * ===================================================================================== */
  const AP = 'apothecary';
  const SACK = hex('#6f6652'),
    BILE = hex('#8a9a4a'),
    LEECH = hex('#26302a'),
    WAX = hex('#24222b');
  /** The plague doctor: a hood, a mask with round glass eyes, the beak hanging down over the chin. */
  const plague = (c, mask, lens, hat) => {
    c.row(1, 4, 9, WAX);
    c.row(2, 3, 10, WAX);
    c.rect(2, 3, 11, 10, WAX);
    c.row(11, 3, 10, WAX);
    c.col(2, 3, 10, hi(WAX));
    c.set(3, 2, hi(WAX));
    c.rect(4, 4, 9, 8, mask);
    c.row(3, 5, 8, mask);
    c.col(9, 4, 8, dark(mask));
    c.set(4, 4, lite(mask));
    /* the beak: K beside it, so that the feelings do not wipe it away */
    c.rect(3, 9, 10, 10, K);
    c.row(9, 5, 8, mask);
    c.row(10, 5, 8, mask);
    c.row(11, 6, 8, mask);
    c.row(12, 7, 8, mask);
    dots(c, lite(mask), 5, 8, 5, 9, 6, 10, 6, 11);
    dots(c, dark(mask), 8, 9, 8, 10, 8, 11, 8, 12, 7, 12, 4, 8, 9, 8);
    dots(c, K, 7, 8);
    c.rect(4, 5, 5, 6, lens);
    c.rect(8, 5, 9, 6, lens);
    dots(c, lite(lens), 4, 5, 8, 5);
    dots(c, K, 5, 6, 9, 6);
    dots(c, dark(mask), 6, 4, 7, 4);
    if (hat) {
      c.rect(4, 0, 9, 1, WAX);
      c.row(1, 4, 9, hi(WAX));
      c.row(2, 1, 12, WAX);
      c.set(4, 0, hi(WAX));
    }
  };

  heads.push({
    name: 'apothecary black skullcap spectacles goatee grey hair pale',
    theme: AP,
    skin: 'pale',
    draw(c) {
      const h = HAIR.grey;
      c.row(2, 4, 9, BLK);
      c.row(3, 3, 10, BLK);
      c.set(5, 2, hi(BLK));
      c.rect(2, 4, 3, 6, h);
      c.rect(10, 4, 11, 6, dark(h));
      specs(c, STEEL);
      keeps(c, GLASS, 4, 6, 9, 6);
      keepRect(c, 6, 10, 7, 10, h);
      keepRect(c, 6, 11, 7, 11, h);
      c.set(7, 11, dark(h));
      dots(c, h, 6, 12);
      dots(c, dark(h), 7, 12);
    },
  });
  heads.push({
    name: 'herb-woman forest headscarf herb sprig grey hair brown',
    theme: AP,
    skin: 'brown',
    draw(c) {
      const f = CLOTH.forest;
      c.row(1, 4, 9, f);
      c.row(2, 3, 10, f);
      c.row(3, 2, 11, f);
      c.rect(2, 4, 3, 9, f);
      c.rect(10, 4, 11, 9, dark(f));
      dots(c, f, 3, 10, 4, 11);
      dots(c, dark(f), 10, 10, 9, 11);
      c.row(12, 5, 8, f);
      c.set(7, 12, dark(f));
      dots(c, lite(f), 4, 1, 3, 2, 2, 4);
      dots(c, HAIR.grey, 4, 4, 5, 4, 4, 3);
      dots(c, BILE, 12, 2, 12, 4, 11, 1);
      dots(c, LEAF, 12, 3, 12, 1);
      dots(c, CLOTH.mustard, 13, 1);
    },
  });
  heads.push({
    name: 'apprentice soot smudge fringe brown hair fair',
    theme: AP,
    skin: 'fair',
    expr: 'scared',
    draw(c, s) {
      HAIRS.fringe(c, HAIR.brown);
      dots(c, HAIR.brown, 5, 1, 8, 1, 2, 4);
      c.set(6, 2, lite(HAIR.brown));
      const sm = mix(s, 0.45);
      keeps(c, sm, 8, 7, 9, 7, 9, 8, 4, 9, 3, 6);
      keeps(c, mix(s, 0.7), 8, 8, 10, 7);
    },
  });
  heads.push({
    name: 'plague doctor beak mask leather flat hat glass eyes',
    theme: AP,
    special: true,
    draw(c) {
      plague(c, HIDE, GLASS, true);
    },
  });
  heads.push({
    name: 'plague doctor beak mask bone red lenses hood bloodied',
    theme: AP,
    special: true,
    draw(c) {
      plague(c, BONE, hex('#7a2a2a'), false);
      c.set(6, 0, WAX);
      c.row(0, 6, 7, WAX);
      dots(c, BLOOD, 7, 11, 7, 12, 6, 10);
    },
  });
  heads.push({
    name: 'alchemist singed beard wild grey hair ember tan',
    theme: AP,
    skin: 'tan',
    draw(c, s) {
      const h = HAIR.grey;
      HAIRS.wild(c, h);
      beard(c, h, true);
      dots(c, h, 4, 11, 4, 12);
      dots(c, dark(h), 9, 11);
      dots(c, K, 5, 12, 8, 12, 9, 11, 4, 12);
      dots(c, SOOT, 6, 12, 8, 11, 4, 11);
      c.set(7, 12, RED);
      keeps(c, mix(s, 0.5), 9, 4, 8, 4, 4, 7);
    },
  });
  heads.push({
    name: 'leech-seller dirty cap leech on cheek lank brown hair ashen',
    theme: AP,
    skin: 'ashen',
    draw(c, s) {
      const h = HAIR.brown,
        cp = hex('#a89f88');
      c.row(3, 3, 10, h);
      c.col(2, 4, 10, h);
      c.col(3, 4, 7, h);
      c.col(11, 4, 10, dark(h));
      c.set(10, 4, dark(h));
      c.row(1, 5, 8, cp);
      c.row(2, 3, 10, cp);
      c.row(2, 8, 10, dark(cp));
      c.set(5, 1, lite(cp));
      dots(c, LEECH, 8, 7, 8, 8, 9, 8);
      c.set(8, 7, hi(LEECH));
      keeps(c, BLOOD, 9, 9);
      keeps(c, dark(s), 4, 7, 5, 7);
    },
  });
  heads.push({
    name: 'patient green in the face head bandage sick rotten',
    theme: AP,
    skin: 'rotten',
    expr: 'hollow',
    draw(c, s) {
      const h = HAIR.brown;
      c.row(2, 4, 9, h);
      c.row(3, 3, 10, h);
      c.col(3, 3, 10, WHITE);
      c.col(10, 3, 10, dark(WHITE));
      c.row(2, 4, 9, WHITE);
      c.row(2, 8, 9, dark(WHITE));
      c.row(11, 4, 9, WHITE);
      c.row(11, 8, 9, dark(WHITE));
      dots(c, WHITE, 5, 1, 7, 1, 6, 0);
      dots(c, dark(WHITE), 8, 0);
      dots(c, h, 4, 3, 5, 3, 8, 3);
      keeps(c, BILE, 7, 10, 7, 11);
      keeps(c, dark(s), 4, 8, 9, 8);
      dots(c, TEAR, 2, 5);
    },
  });
  heads.push({
    name: 'quack doctor crooked plum hat waxed moustache black hair fair',
    theme: AP,
    skin: 'fair',
    expr: 'grin',
    draw(c) {
      const p = CLOTH.plum,
        h = HAIR.black;
      c.row(0, 6, 10, p);
      c.row(1, 5, 9, p);
      c.row(2, 4, 9, p);
      c.row(3, 2, 11, p);
      dots(c, lite(p), 6, 0, 5, 1, 4, 2);
      dots(c, dark(p), 10, 0, 9, 1, 9, 2, 10, 3, 11, 3);
      c.set(7, 1, CLOTH.mustard);
      c.set(7, 2, dark(CLOTH.mustard));
      c.row(8, 5, 8, h);
      keeps(c, h, 4, 7, 9, 7, 3, 6, 10, 6);
      keeps(c, h, 6, 11, 7, 11);
      dots(c, h, 6, 12);
      hairSides(c, h, 4);
    },
  });
  heads.push({
    name: 'pox patient nightcap tassel red spots pale',
    theme: AP,
    skin: 'pale',
    expr: 'weeping',
    draw(c) {
      const n = CLOTH.cream;
      c.row(1, 4, 9, n);
      c.row(2, 3, 10, n);
      c.row(3, 3, 10, dark(n));
      dots(c, n, 10, 1, 11, 2, 12, 3);
      dots(c, dark(n), 12, 4);
      dots(c, CLOTH.wine, 12, 5, 12, 6);
      c.set(4, 1, lite(n));
      const pox = hex('#a8504a');
      keeps(c, pox, 4, 5, 9, 4, 4, 9, 9, 8, 6, 4, 9, 10, 3, 7, 6, 7);
    },
  });
  heads.push({
    name: 'mandrake root head screaming leaves',
    theme: AP,
    special: true,
    draw(c) {
      const r = WOOD;
      c.row(3, 4, 9, r);
      c.rect(3, 4, 10, 9, r);
      c.row(10, 4, 9, r);
      c.row(11, 5, 8, r);
      c.col(10, 4, 9, dark(r));
      dots(c, lite(r), 4, 3, 3, 4, 5, 4);
      dots(c, dark(r), 4, 5, 9, 4, 3, 8, 6, 7, 9, 10, 8, 11, 5, 3, 8, 8);
      dots(c, r, 2, 7, 1, 8, 11, 6, 12, 5, 4, 12, 8, 12);
      dots(c, dark(r), 12, 5, 8, 12, 6, 12);
      dots(c, K, 4, 6, 5, 6, 8, 6, 9, 6, 5, 7, 8, 7);
      c.rect(6, 9, 7, 10, K);
      dots(c, LEAF, 6, 0, 6, 1, 6, 2, 7, 2, 5, 2, 4, 1, 8, 1, 3, 0, 9, 0);
      dots(c, BILE, 5, 1, 7, 1, 6, 0);
    },
  });

  torsos.push({
    name: 'stained apron sackcloth over cream shirt',
    theme: AP,
    draw(c) {
      body(c, CLOTH.cream);
      c.rect(3, 3, 8, 9, SACK);
      dots(c, SACK, 4, 1, 4, 2, 7, 1, 7, 2);
      c.col(8, 3, 9, dark(SACK));
      c.set(3, 3, lite(SACK));
      c.row(7, 5, 7, dark(SACK));
      dots(c, BILE, 4, 5, 4, 6, 5, 5);
      dots(c, BLOOD, 6, 4, 7, 5);
      dots(c, CLOTH.plum, 5, 8, 6, 9, 4, 9);
      c.set(6, 6, BONE);
    },
  });
  torsos.push({
    name: 'robe plum pockets vials gold trim',
    theme: AP,
    draw(c) {
      const p = CLOTH.plum;
      body(c, p, true);
      c.col(5, 1, 9, GOLD);
      c.col(6, 1, 9, dark(p));
      c.set(5, 1, lite(GOLD));
      c.rect(2, 6, 3, 8, dark(p));
      c.row(6, 2, 3, K);
      dots(c, GLASS, 2, 5, 3, 5, 2, 4);
      c.set(3, 5, BILE);
      c.set(2, 5, RED);
      c.rect(8, 6, 9, 8, dark(p));
      c.row(6, 8, 9, K);
      dots(c, GLASS, 8, 4, 8, 5);
      c.set(8, 5, TEAR);
      dots(c, lite(p), 3, 2, 2, 3, 1, 7);
      c.col(10, 6, 9, dark(p));
    },
  });
  torsos.push({
    name: 'plague doctor waxed coat black shoulder cape belt pouch',
    theme: AP,
    draw(c) {
      body(c, WAX, true);
      c.rect(1, 1, 10, 3, hex('#33323a'));
      dots(c, hi(WAX), 1, 1, 2, 1, 3, 2, 1, 3, 3, 3, 5, 3, 7, 3, 9, 3);
      dots(c, WAX, 2, 3, 4, 3, 6, 3, 8, 3, 10, 3);
      c.rect(5, 1, 6, 1, K);
      dots(c, STEEL, 5, 5, 5, 6);
      c.row(7, 1, 10, LEATHER);
      c.set(5, 7, GOLD);
      c.rect(7, 8, 8, 9, HIDE);
      c.set(8, 9, dark(HIDE));
      c.set(7, 8, lite(HIDE));
      c.set(3, 8, hi(WAX));
    },
  });
  torsos.push({
    name: 'herb-woman forest shawl rust bodice herb bundle',
    theme: AP,
    draw(c) {
      const f = CLOTH.forest,
        r = CLOTH.rust;
      body(c, r, true);
      c.row(1, 1, 10, f);
      c.row(2, 2, 9, f);
      c.row(3, 3, 8, f);
      c.row(4, 4, 7, f);
      c.row(5, 5, 6, f);
      dots(c, dark(f), 9, 2, 8, 3, 7, 4, 6, 5, 6, 2, 6, 3, 10, 1);
      dots(c, lite(f), 1, 1, 2, 2, 3, 3);
      c.col(10, 6, 9, dark(r));
      c.col(9, 4, 9, dark(r));
      c.row(7, 1, 10, LEATHER);
      dots(c, LEAF, 2, 8, 3, 8, 3, 9, 2, 9);
      dots(c, BILE, 2, 8, 3, 9);
      c.set(2, 7, BONE);
      c.set(8, 8, dark(r));
    },
  });
  torsos.push({
    name: 'alchemist scorched tunic teal bandolier flasks',
    theme: AP,
    draw(c) {
      const t = CLOTH.teal;
      body(c, t);
      c.rect(5, 1, 6, 1, dark(t));
      for (let i = 0; i < 8; i++) c.set(2 + i, 2 + i, LEATHER);
      c.set(1, 1, LEATHER);
      dots(c, GLASS, 3, 2, 5, 4, 7, 6, 9, 8);
      dots(c, RED, 4, 2);
      dots(c, BILE, 6, 4);
      dots(c, TEAR, 8, 6);
      dots(c, K, 3, 7, 2, 8, 3, 8, 8, 3);
      dots(c, SOOT, 2, 7, 4, 8, 8, 2, 7, 3);
      c.clear(2, 9);
      c.clear(3, 9);
      c.set(2, 2, lite(t));
    },
  });
  torsos.push({
    name: 'patient nightshirt stained open neck leech rotten',
    theme: AP,
    draw(c) {
      const s = SKINS.rotten,
        n = hex('#bdb6a0');
      body(c, n, true);
      c.rect(5, 1, 6, 3, s);
      c.set(6, 3, dark(s));
      c.set(5, 4, s);
      dots(c, dark(n), 4, 1, 7, 1, 4, 2, 7, 2, 4, 3, 7, 3, 4, 4, 6, 4);
      dots(c, BILE, 3, 5, 4, 6, 3, 6, 4, 7, 3, 8);
      dots(c, dark(BILE), 4, 8, 3, 7);
      dots(c, LEECH, 6, 2);
      dots(c, BLOOD, 6, 3);
      dots(c, dark(n), 8, 6, 7, 8, 2, 9);
      c.col(10, 6, 9, dark(n));
    },
  });
  torsos.push({
    name: 'apprentice tunic ash rope belt soot mortar',
    theme: AP,
    draw(c) {
      const a = CLOTH.ash;
      body(c, a);
      c.rect(5, 1, 6, 2, SKINS.fair);
      c.set(6, 2, dark(SKINS.fair));
      dots(c, dark(a), 4, 2, 7, 2, 5, 3, 6, 3, 3, 5);
      c.row(7, 2, 9, BONE);
      dots(c, dark(BONE), 9, 7, 4, 8);
      c.set(4, 9, BONE);
      c.rect(7, 8, 8, 9, STEEL);
      c.set(8, 9, dark(STEEL));
      c.set(9, 7, WOOD);
      dots(c, SOOT, 3, 4, 8, 5);
      dots(c, mix(a, 0.8), 2, 4, 7, 5);
    },
  });
  torsos.push({
    name: 'leech-seller grey dress shawl jar of leeches on a strap',
    theme: AP,
    draw(c) {
      const d = CLOTH.slate;
      body(c, d, true);
      c.row(1, 4, 7, CLOTH.cream);
      c.set(7, 1, dark(CLOTH.cream));
      for (let i = 0; i < 5; i++) c.set(8 - i, 1 + i, LEATHER);
      c.rect(2, 5, 4, 8, GLASS);
      c.row(5, 2, 4, WOOD);
      c.col(4, 6, 8, dark(GLASS));
      dots(c, LEECH, 2, 7, 3, 7, 3, 6, 3, 8);
      c.set(2, 6, lite(GLASS));
      dots(c, dark(d), 6, 4, 6, 6, 7, 8, 8, 5);
      c.col(10, 6, 9, dark(d));
      dots(c, BLOOD, 6, 7);
      dots(c, lite(d), 2, 2, 1, 6);
    },
  });

  arms.push({
    name: 'long leather gloves gauntlet cream sleeve',
    theme: AP,
    draw(c) {
      const s = CLOTH.cream;
      c.rect(1, 0, 3, 3, s);
      c.col(3, 0, 3, dark(s));
      c.rect(1, 4, 3, 10, HIDE);
      c.row(4, 0, 4, HIDE);
      c.set(0, 4, lite(HIDE));
      c.col(3, 5, 10, dark(HIDE));
      c.set(4, 4, dark(HIDE));
      c.col(1, 5, 8, lite(HIDE));
      dots(c, BILE, 2, 9);
      dots(c, LEATHER, 2, 7);
    },
  });
  arms.push({
    name: 'rolled shirt sleeve cream stained fingers fair',
    theme: AP,
    draw(c) {
      const s = CLOTH.cream,
        k = SKINS.fair;
      c.rect(1, 0, 3, 3, s);
      c.col(3, 0, 3, dark(s));
      c.row(4, 0, 4, s);
      c.set(4, 4, dark(s));
      c.row(5, 1, 3, dark(s));
      c.rect(1, 6, 3, 10, k);
      c.col(3, 6, 10, dark(k));
      dots(c, CLOTH.plum, 1, 10, 2, 10);
      dots(c, mix(CLOTH.plum, 1.4), 1, 9);
      dots(c, BILE, 2, 7);
    },
  });
  arms.push({
    name: 'robe plum wide sleeve gold trim pale hand',
    theme: AP,
    draw(c) {
      const p = CLOTH.plum;
      c.rect(1, 0, 3, 4, p);
      c.rect(0, 5, 4, 7, p);
      c.row(8, 0, 4, GOLD);
      c.set(4, 8, dark(GOLD));
      c.col(3, 0, 4, dark(p));
      c.col(4, 5, 7, dark(p));
      c.set(1, 0, lite(p));
      c.set(0, 5, lite(p));
      c.rect(1, 9, 3, 10, SKINS.pale);
      c.col(3, 9, 10, dark(SKINS.pale));
    },
  });
  arms.push({
    name: 'plague doctor waxed sleeve black long glove strap',
    theme: AP,
    draw(c) {
      c.rect(1, 0, 3, 5, hex('#33323a'));
      c.col(1, 0, 5, hi(WAX));
      c.rect(1, 6, 3, 10, WAX);
      c.row(6, 0, 4, LEATHER);
      c.set(2, 6, STEEL);
      c.col(1, 7, 10, hi(WAX));
      c.set(2, 9, hi(WAX));
    },
  });
  arms.push({
    name: 'patient bare arm bandage leech rotten',
    theme: AP,
    draw(c) {
      const s = SKINS.rotten;
      c.rect(1, 0, 3, 1, hex('#bdb6a0'));
      c.rect(1, 2, 3, 10, s);
      c.col(3, 2, 10, dark(s));
      c.rect(1, 4, 3, 5, WHITE);
      c.set(3, 4, dark(WHITE));
      c.set(3, 5, dark(WHITE));
      c.set(2, 5, BLOOD);
      dots(c, LEECH, 2, 7, 2, 8);
      c.set(1, 8, BLOOD);
      c.set(1, 2, lite(s));
    },
  });

  legs.push({
    name: 'breeches earth white stockings buckled shoes',
    theme: AP,
    draw(c) {
      const e = CLOTH.earth;
      c.rect(1, 0, 4, 4, e);
      c.col(4, 0, 4, dark(e));
      c.set(1, 0, lite(e));
      c.row(5, 1, 4, dark(e));
      c.set(4, 5, GOLD);
      c.rect(1, 6, 4, 9, WHITE);
      c.col(4, 6, 9, dark(WHITE));
      c.set(2, 8, dark(WHITE));
      shoe(c, BLK);
      c.row(11, 1, 5, hex('#33323a'));
      dots(c, GOLD, 3, 10);
      c.set(2, 10, hi(BLK));
    },
  });
  legs.push({
    name: 'robe plum hem gold trim pointed slippers',
    theme: AP,
    draw(c) {
      const p = CLOTH.plum;
      c.rect(1, 0, 4, 1, p);
      c.rect(0, 2, 5, 9, p);
      c.col(5, 2, 9, dark(p));
      c.col(2, 3, 8, dark(p));
      c.set(1, 2, lite(p));
      c.row(9, 0, 5, GOLD);
      c.set(5, 9, dark(GOLD));
      c.rect(2, 10, 4, 10, CLOTH.mustard);
      c.row(11, 2, 5, dark(CLOTH.mustard));
      c.set(5, 10, CLOTH.mustard);
    },
  });
  legs.push({
    name: 'plague doctor black coat hem tall boots',
    theme: AP,
    draw(c) {
      c.rect(1, 0, 4, 1, WAX);
      c.rect(0, 2, 5, 6, WAX);
      c.col(1, 0, 6, hi(WAX));
      c.col(5, 2, 6, K);
      c.row(6, 0, 5, hex('#33323a'));
      c.rect(1, 7, 4, 9, LEATHER);
      c.col(1, 7, 9, lite(LEATHER));
      shoe(c, LEATHER);
      c.set(4, 8, STEEL);
    },
  });
  legs.push({
    name: 'patient nightshirt hem bare legs bandaged ankle rotten',
    theme: AP,
    draw(c) {
      const s = SKINS.rotten,
        n = hex('#bdb6a0');
      c.rect(1, 0, 4, 0, n);
      c.rect(0, 1, 5, 4, n);
      c.col(5, 1, 4, dark(n));
      c.row(4, 0, 5, dark(n));
      dots(c, BILE, 1, 2, 2, 3);
      c.rect(2, 5, 3, 9, s);
      c.col(3, 5, 9, dark(s));
      c.rect(2, 8, 3, 9, WHITE);
      c.set(3, 9, dark(WHITE));
      c.rect(2, 10, 5, 11, s);
      c.clear(5, 10);
      c.set(5, 11, dark(s));
      c.set(2, 7, BLOOD);
    },
  });

  /* =====================================================================================
   * 5. COTTAGE — the cottage and its kitchen
   * ===================================================================================== */
  const CO = 'cottage';
  const LINEN = hex('#b5ab8e'),
    WOOL = hex('#5a6470'),
    HOODRED = hex('#8f2f2a'),
    JAM = hex('#7a1f3a'),
    FELT = hex('#5d5a3c'),
    CLOG = hex('#b08a4a');

  heads.push({
    name: 'cook white mob cap rosy cheeks grey hair fair',
    theme: CO,
    skin: 'fair',
    draw(c) {
      c.row(0, 5, 8, WHITE);
      c.row(1, 3, 10, WHITE);
      c.row(2, 2, 11, WHITE);
      for (let x = 2; x <= 11; x++) c.set(x, 3, x % 2 ? dark(WHITE) : WHITE);
      dots(c, dark(WHITE), 9, 1, 10, 2, 11, 2, 8, 0, 6, 1);
      dots(c, HAIR.grey, 3, 4, 3, 5);
      dots(c, dark(HAIR.grey), 10, 4, 10, 5);
      keeps(c, ROUGE, 4, 8, 9, 8, 4, 7);
    },
  });
  heads.push({
    name: "farmer's wife red kerchief dotted brown hair tan",
    theme: CO,
    skin: 'tan',
    draw(c) {
      const k = HOODRED,
        h = HAIR.brown;
      c.row(1, 4, 9, k);
      c.row(2, 3, 10, k);
      c.row(3, 3, 10, k);
      dots(c, k, 11, 3, 11, 4, 12, 5);
      dots(c, dark(k), 10, 2, 10, 3, 12, 6, 11, 5, 9, 1);
      dots(c, lite(k), 4, 1);
      dots(c, GW, 5, 2, 8, 1, 8, 3, 3, 3);
      dots(c, h, 3, 4, 4, 4, 5, 4, 3, 5);
      dots(c, dark(h), 8, 4, 9, 4, 10, 4, 10, 5);
    },
  });
  heads.push({
    name: 'old man pipe white moustache balding white hair pale',
    theme: CO,
    skin: 'pale',
    draw(c, s) {
      const h = HAIR.white;
      c.row(2, 5, 8, s);
      c.set(5, 2, lite(s));
      c.rect(2, 4, 3, 7, h);
      c.rect(10, 4, 11, 7, dark(h));
      c.set(2, 3, h);
      c.set(11, 3, dark(h));
      c.row(8, 4, 8, h);
      c.set(9, 8, dark(h));
      keeps(c, LEATHER, 8, 9);
      dots(c, LEATHER, 9, 10, 10, 10, 11, 10, 11, 9, 12, 9, 12, 10);
      c.set(12, 9, WOOD);
      c.set(11, 9, RED);
      dots(c, STEEL, 12, 7);
      dots(c, CLOTH.ash, 11, 6);
    },
  });
  heads.push({
    name: 'child jam on the face bowl cut blond hair fair',
    theme: CO,
    skin: 'fair',
    expr: 'grin',
    draw(c) {
      const h = HAIR.blond;
      c.row(1, 4, 9, h);
      c.row(2, 3, 10, h);
      c.row(3, 2, 11, h);
      c.row(4, 2, 11, h);
      dots(c, h, 2, 5, 3, 5);
      dots(c, dark(h), 11, 5, 10, 5, 11, 4, 11, 3, 10, 2);
      dots(c, lite(h), 5, 1, 4, 2);
      keeps(c, JAM, 4, 9, 4, 10, 5, 10, 9, 9, 8, 10, 3, 8);
      keeps(c, lite(JAM), 5, 11);
    },
  });
  heads.push({
    name: 'grandmother white bun spectacles shawl at the neck pale',
    theme: CO,
    skin: 'pale',
    draw(c, s) {
      const h = HAIR.white;
      c.rect(5, 0, 8, 1, h);
      c.set(8, 1, dark(h));
      c.set(8, 0, dark(h));
      c.row(2, 4, 9, h);
      c.row(3, 3, 10, h);
      dots(c, h, 3, 4, 4, 4, 3, 5);
      dots(c, dark(h), 9, 4, 10, 4, 10, 5, 9, 2, 10, 3);
      dots(c, s, 6, 3, 7, 3);
      specs(c, STEEL);
      keeps(c, dark(s), 4, 8, 9, 8, 5, 10);
      c.row(12, 3, 10, WOOL);
      dots(c, WOOL, 3, 11, 4, 11, 2, 11, 2, 12);
      dots(c, dark(WOOL), 9, 11, 10, 11, 11, 11, 11, 12, 6, 12);
      dots(c, lite(WOOL), 3, 11, 5, 12);
    },
  });
  heads.push({
    name: 'woodcutter wool cap forest red beard tan',
    theme: CO,
    skin: 'tan',
    draw(c) {
      const f = CLOTH.forest,
        h = HAIR.red;
      c.row(0, 6, 7, lite(f));
      c.row(1, 4, 9, f);
      c.row(2, 3, 10, f);
      c.row(3, 3, 10, dark(f));
      dots(c, lite(f), 4, 1, 5, 2, 7, 2);
      dots(c, dark(f), 9, 1, 10, 2);
      beard(c, h, true);
      c.col(3, 4, 6, h);
      c.col(10, 4, 6, dark(h));
      dots(c, lite(h), 5, 11);
    },
  });
  heads.push({
    name: 'farmer battered felt hat straw in the mouth black hair brown',
    theme: CO,
    skin: 'brown',
    draw(c, s) {
      const f = FELT;
      c.row(0, 5, 7, f);
      c.row(1, 4, 9, f);
      c.row(2, 4, 9, dark(f));
      c.row(3, 1, 12, f);
      dots(c, f, 0, 2, 1, 2);
      dots(c, dark(f), 12, 4, 11, 3, 12, 3, 9, 1, 10, 3);
      dots(c, lite(f), 5, 0, 4, 1, 2, 3);
      c.clear(8, 0);
      hairSides(c, HAIR.black, 5);
      keeps(c, STRAW, 8, 9);
      dots(c, STRAW, 9, 10, 10, 11, 11, 11);
      c.set(12, 12, dark(STRAW));
      keeps(c, mix(s, 0.8), 4, 9, 5, 10, 6, 10, 4, 8);
    },
  });
  heads.push({
    name: 'milkmaid braided crown blond hair rosy pale',
    theme: CO,
    skin: 'pale',
    draw(c) {
      const h = HAIR.blond;
      c.row(3, 3, 10, h);
      for (let x = 3; x <= 10; x++) {
        c.set(x, 1, x % 2 ? h : dark(h));
        c.set(x, 2, x % 2 ? dark(h) : lite(h));
      }
      dots(c, h, 2, 2, 2, 3, 3, 4, 2, 4, 3, 5);
      dots(c, dark(h), 11, 2, 11, 3, 10, 4, 11, 4, 10, 5);
      dots(c, WHITE, 6, 3, 7, 3);
      keeps(c, ROUGE, 4, 8, 9, 8);
      c.row(12, 4, 9, TEAR);
      dots(c, dark(TEAR), 8, 12, 9, 12);
      c.set(6, 12, WHITE);
    },
  });
  heads.push({
    name: 'girl red riding hood brown fringe fair',
    theme: CO,
    skin: 'fair',
    draw(c) {
      const r = HOODRED;
      HATS.hood(c, r);
      c.row(0, 6, 7, r);
      c.set(6, 0, lite(r));
      dots(c, lite(r), 4, 1, 3, 2, 2, 4);
      c.row(4, 4, 9, HAIR.brown);
      c.set(9, 4, dark(HAIR.brown));
      dots(c, HAIR.brown, 4, 5);
      c.row(12, 4, 9, dark(r));
      dots(c, WHITE, 6, 12, 7, 12);
    },
  });
  heads.push({
    name: 'crone black headcloth wart one tooth white strands ashen',
    theme: CO,
    skin: 'ashen',
    expr: 'grin',
    draw(c, s) {
      c.row(1, 4, 9, SOOT);
      c.row(2, 3, 10, SOOT);
      c.row(3, 3, 10, SOOT);
      c.row(4, 3, 10, dark(SOOT));
      dots(c, hi(SOOT), 4, 1, 3, 2, 5, 2);
      dots(c, SOOT, 11, 3, 12, 4);
      c.col(2, 5, 10, HAIR.white);
      c.col(11, 5, 9, dark(HAIR.white));
      dots(c, HAIR.white, 3, 5, 3, 6);
      keeps(c, dark(s), 7, 8, 6, 8, 4, 7, 9, 7);
      keeps(c, dark(dark(s)), 9, 9);
      c.set(7, 9, K);
      dots(c, dark(s), 6, 12, 7, 12);
    },
  });
  heads.push({
    name: 'baker white cap flour on the face moustache black hair brown',
    theme: CO,
    skin: 'brown',
    draw(c) {
      c.row(0, 4, 9, WHITE);
      c.rect(3, 1, 10, 2, WHITE);
      c.row(3, 3, 10, dark(WHITE));
      dots(c, dark(WHITE), 10, 1, 10, 2, 9, 0, 6, 1, 6, 2);
      hairSides(c, HAIR.black, 4);
      stache(c, HAIR.black);
      keeps(c, WHITE, 4, 7, 9, 5, 3, 8, 8, 10);
      keeps(c, BONE, 4, 5, 9, 9);
    },
  });

  torsos.push({
    name: 'smock linen gathered yoke rust stitches',
    theme: CO,
    draw(c) {
      body(c, LINEN, true);
      c.rect(5, 1, 6, 1, SKINS.tan);
      dots(c, lite(LINEN), 4, 1, 7, 1, 3, 2);
      for (let x = 2; x <= 9; x++) c.set(x, 3, x % 2 ? CLOTH.rust : dark(LINEN));
      for (let x = 3; x <= 8; x += 2) c.set(x, 2, dark(LINEN));
      for (const x of [3, 5, 7]) c.col(x, 5, 9, dark(LINEN));
      c.col(10, 6, 9, dark(LINEN));
      c.col(9, 4, 9, dark(LINEN));
      c.set(1, 6, lite(LINEN));
    },
  });
  torsos.push({
    name: 'grey wool shawl fringe over cream blouse pin',
    theme: CO,
    draw(c) {
      const b = CLOTH.cream;
      body(c, b);
      c.rect(1, 1, 3, 7, WOOL);
      c.rect(8, 1, 10, 7, WOOL);
      c.clear(1, 2);
      c.clear(10, 2);
      c.set(2, 2, WOOL);
      c.rect(2, 2, 3, 8, WOOL);
      c.rect(8, 2, 9, 8, WOOL);
      c.set(4, 1, WOOL);
      c.set(7, 1, WOOL);
      c.set(4, 2, WOOL);
      c.set(7, 2, WOOL);
      c.col(9, 2, 8, dark(WOOL));
      c.col(3, 3, 8, dark(WOOL));
      dots(c, lite(WOOL), 1, 1, 2, 3, 2, 6, 8, 4);
      for (const x of [2, 3, 8, 9]) c.set(x, 9, x % 2 ? WOOL : dark(WOOL));
      dots(c, dark(b), 5, 4, 5, 6, 5, 8, 7, 4, 7, 8);
      c.set(5, 2, GOLD);
      c.set(6, 2, dark(b));
    },
  });
  torsos.push({
    name: 'patched waistcoat earth striped collarless shirt',
    theme: CO,
    draw(c) {
      const v = CLOTH.earth;
      body(c, WHITE);
      dots(c, WOOL, 2, 1, 9, 1, 2, 2, 9, 2);
      c.rect(2, 3, 9, 9, v);
      c.row(2, 3, 8, v);
      c.rect(5, 1, 6, 4, WHITE);
      c.col(6, 1, 4, WOOL);
      c.col(9, 3, 9, dark(v));
      c.col(6, 5, 9, dark(v));
      c.set(2, 3, lite(v));
      c.rect(3, 6, 4, 7, CLOTH.mustard);
      dots(c, K, 2, 6, 5, 7);
      dots(c, dark(CLOTH.mustard), 4, 7);
      c.rect(7, 3, 8, 4, WOOL);
      c.set(8, 4, dark(WOOL));
      dots(c, BONE, 5, 6);
      dots(c, K, 5, 8);
      c.clear(9, 9);
    },
  });
  torsos.push({
    name: 'cook bib apron white floury slate dress wooden spoon',
    theme: CO,
    draw(c) {
      const d = CLOTH.slate;
      body(c, d, true);
      c.rect(3, 2, 8, 9, WHITE);
      c.rect(2, 6, 9, 9, WHITE);
      dots(c, WHITE, 3, 1, 8, 1);
      c.col(8, 2, 5, dark(WHITE));
      c.col(9, 6, 9, dark(WHITE));
      c.row(6, 2, 9, dark(WHITE));
      c.rect(6, 7, 8, 8, dark(WHITE));
      c.col(7, 4, 7, WOOD);
      c.set(7, 4, lite(WOOD));
      c.set(7, 3, lite(WOOD));
      dots(c, CLOTH.rust, 4, 4, 4, 8);
      dots(c, lite(d), 1, 1, 1, 6);
      c.col(10, 6, 9, dark(d));
    },
  });
  torsos.push({
    name: 'woodcutter plaid flannel shirt red black braces',
    theme: CO,
    draw(c) {
      const r = HOODRED;
      body(c, r);
      for (const y of [3, 6, 9]) c.row(y, 2, 9, dark(r));
      for (const x of [4, 7]) c.col(x, 2, 9, dark(r));
      for (const y of [3, 6, 9]) for (const x of [4, 7]) c.set(x, y, K);
      dots(c, dark(r), 1, 1, 10, 1);
      c.rect(5, 1, 6, 2, SKINS.tan);
      c.set(6, 2, dark(SKINS.tan));
      c.col(3, 1, 9, LEATHER);
      c.col(8, 1, 9, LEATHER);
      dots(c, STEEL, 3, 7, 8, 7);
      c.set(2, 2, lite(r));
    },
  });
  torsos.push({
    name: 'red riding cape white bow basket cream dress',
    theme: CO,
    draw(c) {
      const r = HOODRED;
      body(c, CLOTH.cream, true);
      c.rect(1, 1, 10, 5, r);
      c.row(6, 1, 3, r);
      c.row(6, 8, 10, r);
      c.set(1, 7, r);
      c.set(10, 7, dark(r));
      c.col(10, 1, 6, dark(r));
      c.col(5, 3, 5, dark(r));
      dots(c, lite(r), 1, 1, 2, 2, 2, 4);
      dots(c, WHITE, 4, 2, 5, 2, 6, 2, 7, 2, 5, 3, 6, 3);
      c.set(6, 3, dark(WHITE));
      c.rect(6, 8, 9, 9, WOOD);
      c.row(7, 6, 9, WHITE);
      c.set(9, 7, dark(WHITE));
      dots(c, dark(WOOD), 7, 8, 9, 8, 6, 9, 8, 9);
      c.col(4, 6, 9, dark(CLOTH.cream));
    },
  });
  torsos.push({
    name: 'knitted jumper forest fair isle band roll collar',
    theme: CO,
    draw(c) {
      const f = CLOTH.forest;
      body(c, f);
      c.row(1, 4, 7, lite(f));
      c.row(2, 4, 7, dark(f));
      for (let x = 2; x <= 9; x++) {
        c.set(x, 4, x % 2 ? CLOTH.cream : CLOTH.rust);
        c.set(x, 5, x % 2 ? CLOTH.rust : f);
      }
      c.row(3, 2, 9, CLOTH.cream);
      c.row(6, 2, 9, CLOTH.cream);
      c.col(9, 3, 6, dark(CLOTH.cream));
      for (let x = 2; x <= 9; x++) c.set(x, 9, x % 2 ? dark(f) : f);
      c.set(9, 4, dark(CLOTH.rust));
      c.set(9, 5, dark(f));
    },
  });
  torsos.push({
    name: 'dirndl laced bodice wine white blouse blue apron',
    theme: CO,
    draw(c) {
      const w = CLOTH.wine;
      body(c, WHITE, true);
      c.rect(2, 4, 9, 7, w);
      dots(c, w, 2, 3, 3, 3, 8, 3, 9, 3, 3, 2, 8, 2);
      c.clear(1, 6);
      c.clear(10, 6);
      c.col(9, 3, 7, dark(w));
      dots(c, lite(w), 2, 4);
      dots(c, BONE, 5, 4, 6, 5, 5, 6, 6, 7);
      dots(c, dark(w), 6, 4, 5, 5, 6, 6, 5, 7);
      c.rect(5, 1, 6, 2, SKINS.pale);
      dots(c, dark(WHITE), 4, 2, 7, 2, 4, 3, 7, 3, 10, 1);
      c.rect(1, 8, 10, 9, TEAR);
      c.row(8, 1, 10, lite(TEAR));
      c.col(10, 8, 9, dark(TEAR));
      c.set(6, 9, dark(TEAR));
    },
  });

  arms.push({
    name: 'smock linen sleeve gathered cuff tan hand',
    theme: CO,
    draw(c) {
      c.rect(1, 0, 3, 7, LINEN);
      c.rect(0, 4, 4, 7, LINEN);
      c.col(3, 0, 3, dark(LINEN));
      c.col(4, 4, 7, dark(LINEN));
      c.set(1, 0, lite(LINEN));
      c.set(2, 5, dark(LINEN));
      c.row(8, 1, 3, CLOTH.rust);
      c.set(2, 8, dark(LINEN));
      c.rect(1, 9, 3, 10, SKINS.tan);
      c.col(3, 9, 10, dark(SKINS.tan));
    },
  });
  arms.push({
    name: 'white blouse sleeve rolled floury hands fair',
    theme: CO,
    draw(c) {
      const k = SKINS.fair;
      c.rect(1, 0, 3, 3, WHITE);
      c.rect(0, 1, 4, 3, WHITE);
      c.col(4, 1, 3, dark(WHITE));
      c.row(4, 1, 3, dark(WHITE));
      c.set(2, 2, dark(WHITE));
      c.rect(1, 5, 3, 10, k);
      c.col(3, 5, 10, dark(k));
      dots(c, WHITE, 1, 9, 2, 10, 1, 10, 2, 7);
      c.set(3, 10, BONE);
    },
  });
  arms.push({
    name: 'plaid flannel sleeve red black rolled cuff tan hand',
    theme: CO,
    draw(c) {
      const r = HOODRED,
        k = SKINS.tan;
      c.rect(1, 0, 3, 6, r);
      c.row(2, 1, 3, dark(r));
      c.row(5, 1, 3, dark(r));
      c.col(2, 0, 6, dark(r));
      dots(c, K, 2, 2, 2, 5);
      c.col(3, 0, 6, dark(r));
      c.set(1, 0, lite(r));
      c.row(7, 0, 4, lite(r));
      c.set(4, 7, r);
      c.rect(1, 8, 3, 10, k);
      c.col(3, 8, 10, dark(k));
    },
  });
  arms.push({
    name: 'knitted jumper sleeve forest cream band rust mitten',
    theme: CO,
    draw(c) {
      const f = CLOTH.forest;
      c.rect(1, 0, 3, 7, f);
      c.col(3, 0, 7, dark(f));
      c.set(1, 0, lite(f));
      c.row(3, 1, 3, CLOTH.cream);
      c.row(4, 1, 3, CLOTH.rust);
      c.set(2, 4, CLOTH.cream);
      c.set(3, 3, dark(CLOTH.cream));
      c.row(7, 1, 3, dark(f));
      c.rect(1, 8, 3, 10, CLOTH.rust);
      c.col(3, 8, 10, dark(CLOTH.rust));
      c.set(0, 9, CLOTH.rust);
      c.row(8, 1, 3, lite(CLOTH.rust));
    },
  });

  legs.push({
    name: 'wooden clogs grey wool stockings earth breeches',
    theme: CO,
    draw(c) {
      const e = CLOTH.earth;
      c.rect(1, 0, 4, 4, e);
      c.col(4, 0, 4, dark(e));
      c.set(1, 0, lite(e));
      c.rect(1, 5, 4, 9, CLOTH.ash);
      for (const y of [6, 8]) c.row(y, 1, 4, dark(CLOTH.ash));
      c.col(4, 5, 9, dark(CLOTH.ash));
      c.rect(1, 10, 5, 11, CLOG);
      c.row(11, 1, 5, dark(CLOG));
      c.set(5, 10, lite(CLOG));
      c.set(2, 10, lite(CLOG));
      c.set(5, 9, CLOG);
    },
  });
  legs.push({
    name: 'rust skirt striped wool stockings brown boots',
    theme: CO,
    draw(c) {
      const r = CLOTH.rust;
      c.rect(1, 0, 4, 0, r);
      c.rect(0, 1, 5, 5, r);
      c.col(5, 1, 5, dark(r));
      c.col(2, 2, 5, dark(r));
      c.row(5, 0, 5, dark(r));
      c.set(1, 1, lite(r));
      c.rect(2, 6, 3, 8, CLOTH.cream);
      c.row(7, 2, 3, CLOTH.wine);
      c.set(3, 6, dark(CLOTH.cream));
      c.set(3, 8, dark(CLOTH.cream));
      c.rect(1, 9, 4, 9, LEATHER);
      shoe(c, LEATHER);
      c.set(2, 9, lite(LEATHER));
    },
  });
  legs.push({
    name: 'patched trousers earth mustard patch muddy boots',
    theme: CO,
    draw(c) {
      const e = CLOTH.earth;
      c.rect(1, 0, 4, 9, e);
      c.col(4, 0, 9, dark(e));
      c.set(1, 0, lite(e));
      c.rect(2, 3, 3, 4, CLOTH.mustard);
      c.set(3, 4, dark(CLOTH.mustard));
      dots(c, K, 1, 3, 4, 4);
      c.rect(1, 7, 2, 8, WOOL);
      c.set(3, 7, K);
      c.set(2, 8, dark(WOOL));
      shoe(c, LEATHER);
      dots(c, MUD, 1, 11, 3, 11, 4, 10);
      c.set(2, 9, dark(e));
    },
  });
  legs.push({
    name: 'forest skirt cream apron patched clog',
    theme: CO,
    draw(c) {
      const f = CLOTH.forest,
        a = CLOTH.cream;
      c.rect(1, 0, 4, 1, f);
      c.rect(0, 2, 5, 9, f);
      c.col(5, 2, 9, dark(f));
      c.col(4, 3, 9, dark(f));
      c.row(9, 0, 5, dark(f));
      c.rect(1, 0, 2, 7, a);
      c.rect(0, 2, 0, 7, a);
      c.row(7, 0, 2, dark(a));
      c.set(2, 3, dark(a));
      c.rect(1, 4, 1, 5, CLOTH.rust);
      c.rect(2, 10, 4, 10, CLOG);
      c.row(11, 2, 5, dark(CLOG));
      c.set(5, 10, lite(CLOG));
    },
  });
  legs.push({
    name: 'rolled-up trousers khaki bare feet dirty fair',
    theme: CO,
    draw(c) {
      const k = SKINS.fair;
      c.rect(1, 0, 4, 5, KHAKI);
      c.col(4, 0, 5, dark(KHAKI));
      c.set(1, 0, lite(KHAKI));
      c.row(6, 0, 5, lite(KHAKI));
      c.set(5, 6, KHAKI);
      c.rect(2, 7, 3, 9, k);
      c.set(3, 7, dark(k));
      c.set(3, 8, dark(k));
      c.set(3, 9, dark(k));
      c.rect(2, 10, 5, 11, k);
      c.clear(5, 10);
      c.set(5, 11, dark(k));
      dots(c, MUD, 2, 11, 4, 11, 2, 8);
    },
  });

  /* =====================================================================================
   * 6. GARDEN — the gardener's world
   * ===================================================================================== */
  const GA = 'garden';
  const BURLAP = hex('#b5a36e'),
    HEDGE = hex('#35502c'),
    WELLY = hex('#33503a'),
    OLIVE = hex('#4a5238'),
    STONE = hex('#8d8a84'),
    GNOMEBLUE = hex('#3f5f8a'),
    PAINT = hex('#d6a58a');

  heads.push({
    name: 'gardener straw hat grey moustache grey hair tan',
    theme: GA,
    skin: 'tan',
    draw(c) {
      wideHat(c, STRAW, CLOTH.forest);
      dots(c, dark(STRAW), 6, 1, 8, 1, 2, 3, 5, 3, 8, 3);
      c.set(0, 4, dark(STRAW));
      hairSides(c, HAIR.grey, 5);
      bigStache(c, HAIR.grey);
    },
  });
  heads.push({
    name: 'lady wide sun hat wine ribbon red hair pale',
    theme: GA,
    skin: 'pale',
    draw(c) {
      const k = CLOTH.cream,
        h = HAIR.red;
      c.row(1, 5, 8, k);
      c.row(2, 4, 9, CLOTH.wine);
      c.row(3, 0, 13, k);
      dots(c, k, 0, 4, 1, 4);
      dots(c, dark(k), 12, 4, 13, 4, 10, 3, 11, 3, 12, 3, 13, 3, 8, 1);
      dots(c, lite(k), 5, 1, 1, 3, 2, 3);
      dots(c, dark(CLOTH.wine), 9, 2);
      dots(c, CLOTH.wine, 10, 4, 11, 5);
      dots(c, ROUGE, 4, 2);
      c.rect(2, 5, 3, 8, h);
      c.set(3, 4, h);
      c.rect(10, 5, 11, 8, dark(h));
      c.set(10, 4, dark(h));
      c.set(2, 9, h);
      c.set(11, 9, dark(h));
      c.set(10, 5, CLOTH.wine);
    },
  });
  heads.push({
    name: 'beekeeper hat veil net bee',
    theme: GA,
    special: true,
    draw(c) {
      const s = SKINS.fair,
        net = hex('#55584f');
      c.rect(4, 0, 9, 1, WHITE);
      c.row(2, 1, 12, WHITE);
      dots(c, dark(WHITE), 9, 0, 9, 1, 10, 2, 11, 2, 12, 2);
      c.rect(2, 3, 11, 11, net);
      c.row(12, 4, 9, WHITE);
      c.set(9, 12, dark(WHITE));
      c.rect(4, 4, 9, 10, mix(s, 0.8));
      for (let y = 3; y <= 11; y++) for (let x = 2; x <= 11; x++) if ((x + y) % 2 === 0) c.set(x, y, c.get(x, y) === net ? mix(net, 1.3) : mix(s, 0.62));
      c.col(11, 3, 11, mix(net, 0.7));
      dots(c, K, 5, 6, 8, 6);
      dots(c, mix(s, 0.45), 6, 9, 7, 9);
      dots(c, CLOTH.mustard, 10, 8);
      dots(c, K, 11, 8);
      dots(c, WHITE, 10, 7);
    },
  });
  heads.push({
    name: 'boy slingshot gap tooth grin freckles brown hair fair',
    theme: GA,
    skin: 'fair',
    expr: 'grin',
    draw(c, s) {
      const h = HAIR.brown;
      c.row(2, 3, 10, h);
      c.row(3, 3, 10, h);
      dots(c, h, 3, 4, 4, 4, 2, 3, 4, 1, 6, 1, 9, 1, 7, 0, 3, 5);
      dots(c, dark(h), 10, 4, 10, 3, 9, 2);
      dots(c, lite(h), 5, 2);
      keeps(c, mix(s, 0.78), 4, 7, 6, 7, 9, 7);
      c.set(7, 9, K);
      dots(c, WOOD, 11, 6, 13, 6, 11, 7, 13, 7, 12, 8, 12, 9, 12, 10);
      dots(c, dark(WOOD), 13, 7, 12, 10);
      dots(c, HOODRED, 12, 6);
    },
  });
  heads.push({
    name: 'scarecrow burlap sack stitched grin straw crooked hat',
    theme: GA,
    special: true,
    draw(c) {
      const b = BURLAP,
        e = CLOTH.earth;
      c.rect(3, 4, 10, 10, b);
      c.row(11, 4, 9, b);
      c.col(10, 4, 10, dark(b));
      dots(c, dark(b), 4, 5, 8, 4, 5, 8, 9, 11);
      dots(c, lite(b), 3, 4, 4, 4);
      c.row(0, 7, 8, e);
      c.row(1, 5, 8, e);
      c.row(2, 4, 9, e);
      c.row(3, 1, 12, e);
      dots(c, dark(e), 8, 0, 8, 1, 9, 2, 10, 3, 11, 3, 12, 3);
      dots(c, lite(e), 5, 1, 4, 2);
      dots(c, CLOTH.mustard, 6, 2);
      dots(c, K, 5, 6, 8, 5, 9, 6, 8, 7, 9, 5, 8, 6);
      dots(c, b, 8, 6);
      dots(c, K, 9, 7);
      dots(c, CLOTH.rust, 6, 7, 7, 7, 7, 8);
      dots(c, K, 4, 9, 5, 10, 6, 9, 7, 10, 8, 9, 9, 10);
      dots(c, STRAW, 2, 5, 1, 6, 2, 7, 11, 5, 12, 6, 11, 8, 2, 9);
      dots(c, dark(STRAW), 12, 7, 1, 8);
      c.row(12, 4, 9, BONE);
      dots(c, STRAW, 3, 12, 10, 12, 6, 12);
    },
  });
  heads.push({
    name: 'topiary green face clipped hedge hollow eyes',
    theme: GA,
    special: true,
    draw(c) {
      const g = HEDGE;
      c.row(1, 5, 8, g);
      c.row(2, 3, 10, g);
      c.rect(2, 3, 11, 9, g);
      c.row(10, 3, 10, g);
      c.row(11, 4, 9, g);
      c.col(11, 3, 9, dark(g));
      dots(c, dark(g), 10, 10, 9, 11, 10, 2, 4, 4, 7, 3, 3, 7, 6, 8, 9, 8, 5, 11, 8, 2, 4, 9, 9, 9);
      dots(c, lite(g), 5, 1, 3, 3, 4, 2, 6, 4, 2, 5, 9, 4, 3, 9, 7, 7, 5, 8);
      dots(c, BILE, 6, 1, 2, 4, 8, 3);
      c.rect(4, 5, 5, 6, K);
      c.rect(8, 5, 9, 6, K);
      dots(c, BILE, 5, 6, 8, 6);
      dots(c, K, 5, 9, 6, 10, 7, 10, 8, 9, 6, 9, 7, 9);
      dots(c, g, 1, 2, 12, 6, 12, 1);
      dots(c, WOOD, 6, 12, 7, 12);
    },
  });
  heads.push({
    name: 'under-gardener flat cap dirt smudge black hair brown',
    theme: GA,
    skin: 'brown',
    draw(c, s) {
      const e = FELT;
      c.row(2, 4, 9, e);
      c.row(3, 3, 10, e);
      c.row(4, 8, 12, dark(e));
      dots(c, lite(e), 5, 2, 4, 3);
      dots(c, dark(e), 9, 2, 10, 3);
      dots(c, LEAF, 7, 1);
      dots(c, BILE, 8, 1);
      dots(c, HAIR.black, 3, 4, 3, 5, 4, 4);
      keeps(c, MUD, 4, 8, 3, 7, 9, 9);
      keeps(c, mix(s, 1.25), 4, 6);
      dots(c, TEAR, 10, 6);
    },
  });
  heads.push({
    name: 'garden gnome red pointed hat white beard chipped paint',
    theme: GA,
    special: true,
    draw(c) {
      const r = HOODRED,
        w = WHITE;
      c.row(0, 6, 7, r);
      c.row(1, 5, 8, r);
      c.row(2, 5, 8, r);
      c.row(3, 4, 9, r);
      c.row(4, 3, 10, r);
      dots(c, lite(r), 6, 0, 5, 1, 5, 2, 4, 3);
      dots(c, dark(r), 8, 1, 8, 2, 9, 3, 10, 4, 9, 4);
      c.rect(3, 5, 10, 7, PAINT);
      c.set(10, 5, dark(PAINT));
      c.set(10, 6, dark(PAINT));
      dots(c, K, 5, 6, 8, 6);
      dots(c, ROUGE, 6, 7, 7, 7, 4, 7, 9, 7);
      c.rect(3, 8, 10, 10, w);
      c.row(11, 4, 9, w);
      c.row(12, 5, 8, w);
      dots(c, w, 2, 6, 2, 7, 2, 8, 11, 6);
      dots(c, dark(w), 11, 7, 11, 8, 10, 9, 10, 10, 9, 11, 8, 12, 6, 10, 5, 11, 7, 12, 10, 8);
      dots(c, mix(PAINT, 0.6), 6, 9, 7, 9);
      dots(c, STEEL, 9, 5, 7, 2);
    },
  });
  heads.push({
    name: 'girl daisy chain sunburnt long brown hair tan',
    theme: GA,
    skin: 'tan',
    draw(c) {
      const h = HAIR.brown;
      HAIRS.long(c, h);
      c.set(5, 1, lite(h));
      dots(c, LEAF, 3, 2, 5, 2, 6, 2, 8, 2, 9, 2, 10, 2, 2, 3, 11, 3);
      dots(c, WHITE, 4, 2, 7, 2, 10, 3, 2, 4);
      dots(c, GOLD, 7, 1);
      dots(c, WHITE, 6, 1, 8, 1, 7, 0);
      keeps(c, ROUGE, 4, 8, 9, 8, 6, 7);
    },
  });
  heads.push({
    name: 'stone statue head mossy cracked blank eyes',
    theme: GA,
    special: true,
    draw(c) {
      const s = STONE;
      kit.face(c, s);
      c.row(1, 4, 9, s);
      c.row(2, 3, 10, s);
      c.row(3, 3, 10, s);
      dots(c, s, 2, 3, 2, 4, 11, 3, 11, 4, 2, 5, 11, 5);
      dots(c, dark(s), 4, 2, 6, 1, 8, 2, 10, 3, 5, 3, 7, 3, 9, 1, 3, 4, 10, 4, 11, 5, 11, 4, 2, 5);
      dots(c, lite(s), 5, 1, 3, 2, 7, 2);
      dots(c, lite(s), 4, 6, 5, 6, 8, 6, 9, 6);
      dots(c, dark(s), 4, 5, 5, 5, 8, 5, 9, 5, 6, 8, 7, 8);
      dots(c, dark(dark(s)), 6, 9, 7, 9, 5, 7, 5, 8);
      dots(c, K, 9, 2, 9, 3, 8, 4, 9, 7, 10, 8);
      dots(c, LEAF, 3, 8, 3, 9, 4, 10, 2, 4, 5, 11, 4, 9);
      dots(c, BILE, 3, 10, 10, 2);
      c.row(12, 5, 8, dark(s));
    },
  });

  torsos.push({
    name: 'gardening apron forest pockets trowel seed packet',
    theme: GA,
    draw(c) {
      const f = CLOTH.forest;
      body(c, CLOTH.cream);
      c.rect(3, 3, 8, 9, f);
      c.rect(2, 6, 9, 9, f);
      dots(c, f, 4, 1, 4, 2, 7, 1, 7, 2);
      c.col(9, 6, 9, dark(f));
      c.col(8, 3, 5, dark(f));
      c.set(3, 3, lite(f));
      c.row(6, 2, 9, dark(f));
      c.col(5, 7, 9, dark(f));
      dots(c, WOOD, 3, 5, 3, 4);
      dots(c, STEEL, 3, 6);
      dots(c, WHITE, 7, 5, 7, 4);
      dots(c, RED, 7, 4);
      dots(c, MUD, 6, 8, 3, 9);
      c.set(8, 7, BONE);
    },
  });
  torsos.push({
    name: 'dungarees denim check shirt mustard',
    theme: GA,
    draw(c) {
      const m = CLOTH.mustard;
      body(c, m);
      for (let y = 1; y <= 9; y++) for (let x = 1; x <= 10; x++) if (c.get(x, y) && (x + y) % 2 === 0) c.set(x, y, dark(m));
      c.rect(5, 1, 6, 2, SKINS.fair);
      c.set(6, 2, dark(SKINS.fair));
      c.rect(3, 4, 8, 9, DENIM);
      c.rect(2, 7, 9, 9, DENIM);
      c.col(3, 1, 3, DENIM);
      c.col(8, 1, 3, dark(DENIM));
      c.col(9, 7, 9, dark(DENIM));
      c.col(8, 4, 6, dark(DENIM));
      dots(c, GOLD, 3, 4, 8, 4);
      c.rect(5, 5, 6, 6, dark(DENIM));
      c.row(5, 5, 6, lite(DENIM));
      dots(c, MUD, 4, 8, 7, 9);
      c.set(3, 5, lite(DENIM));
    },
  });
  torsos.push({
    name: 'beekeeper white smock veil collar smoker bee',
    theme: GA,
    draw(c) {
      body(c, WHITE, true);
      for (let x = 2; x <= 9; x++) c.set(x, 1, x % 2 ? hex('#55584f') : STEEL);
      for (let x = 3; x <= 8; x++) c.set(x, 2, x % 2 ? STEEL : hex('#55584f'));
      c.col(5, 3, 9, dark(WHITE));
      c.row(7, 1, 10, dark(WHITE));
      c.col(10, 6, 9, dark(WHITE));
      c.col(9, 3, 5, dark(WHITE));
      c.rect(7, 8, 8, 9, STEEL);
      c.set(8, 9, dark(STEEL));
      c.set(9, 9, LEATHER);
      c.set(7, 7, K);
      dots(c, CLOTH.mustard, 3, 4);
      dots(c, K, 4, 4);
      dots(c, CLOTH.mustard, 2, 9);
    },
  });
  torsos.push({
    name: 'scarecrow patched coat earth straw stuffing rope belt',
    theme: GA,
    draw(c) {
      const e = CLOTH.earth;
      body(c, e);
      for (let x = 3; x <= 8; x++) c.set(x, 1, x % 2 ? STRAW : dark(STRAW));
      dots(c, STRAW, 4, 2, 7, 2, 5, 2);
      c.col(5, 3, 9, dark(e));
      c.rect(2, 4, 3, 5, CLOTH.wine);
      c.set(3, 5, dark(CLOTH.wine));
      dots(c, K, 4, 4, 2, 6);
      c.rect(7, 3, 8, 4, CLOTH.forest);
      dots(c, K, 6, 3, 8, 5);
      c.set(6, 5, BONE);
      c.row(7, 2, 9, BONE);
      dots(c, dark(BONE), 9, 7, 3, 7, 6, 7);
      dots(c, BONE, 4, 8);
      dots(c, STRAW, 7, 8, 8, 9, 8, 8, 2, 9, 3, 9);
      c.clear(6, 9);
      c.set(2, 2, lite(e));
    },
  });
  torsos.push({
    name: 'lady floral blouse cream sprigs lace collar sash',
    theme: GA,
    draw(c) {
      const b = CLOTH.cream;
      body(c, b, true);
      c.clear(1, 6);
      c.clear(10, 6);
      c.row(1, 4, 7, WHITE);
      dots(c, WHITE, 4, 2, 5, 2, 6, 2, 7, 2, 5, 3, 6, 3);
      dots(c, dark(WHITE), 7, 2, 6, 3);
      dots(c, ROUGE, 3, 3, 8, 5, 3, 6, 6, 5);
      dots(c, LEAF, 2, 3, 8, 4, 4, 6, 6, 6);
      c.row(7, 2, 9, CLOTH.wine);
      c.row(8, 1, 10, CLOTH.wine);
      c.row(8, 1, 10, dark(CLOTH.wine));
      c.set(5, 7, lite(CLOTH.wine));
      c.col(10, 8, 9, dark(b));
      dots(c, ROUGE, 3, 9, 8, 9);
      c.set(9, 4, dark(b));
      c.set(9, 5, dark(b));
    },
  });
  torsos.push({
    name: 'gnome tunic blue black belt gold buckle white beard',
    theme: GA,
    draw(c) {
      const b = GNOMEBLUE;
      body(c, b, true);
      c.rect(1, 4, 10, 9, b);
      c.col(10, 4, 9, dark(b));
      c.set(1, 4, lite(b));
      c.rect(4, 1, 7, 3, WHITE);
      c.row(4, 5, 6, WHITE);
      dots(c, dark(WHITE), 7, 2, 7, 3, 6, 4, 5, 2);
      c.rect(1, 6, 10, 7, BLK);
      c.rect(5, 6, 6, 7, GOLD);
      c.set(6, 7, dark(GOLD));
      c.set(5, 6, lite(GOLD));
      dots(c, STEEL, 3, 9, 8, 3);
      dots(c, dark(b), 3, 8, 7, 9);
    },
  });
  torsos.push({
    name: 'under-gardener moleskin waistcoat red neckerchief muddy shirt',
    theme: GA,
    draw(c) {
      const v = FELT,
        s = CLOTH.cream;
      body(c, s);
      c.rect(2, 3, 4, 9, v);
      c.rect(7, 3, 9, 9, v);
      dots(c, v, 3, 2, 8, 2);
      c.col(9, 3, 9, dark(v));
      c.col(4, 4, 9, dark(v));
      c.set(2, 3, lite(v));
      c.row(1, 4, 7, HOODRED);
      dots(c, HOODRED, 5, 2, 6, 2, 5, 3);
      c.set(6, 2, dark(HOODRED));
      dots(c, dark(s), 6, 5, 6, 7, 5, 9);
      dots(c, MUD, 5, 6, 6, 8, 3, 8, 8, 9);
      dots(c, STEEL, 8, 5);
      dots(c, WOOD, 8, 6);
      dots(c, BONE, 3, 5, 2, 6);
    },
  });
  torsos.push({
    name: 'waxed jacket olive corduroy collar flap pockets',
    theme: GA,
    draw(c) {
      const o = OLIVE,
        e = CLOTH.earth;
      body(c, o);
      c.row(1, 3, 8, e);
      dots(c, e, 3, 2, 4, 2, 7, 2, 8, 2);
      dots(c, dark(e), 8, 1, 8, 2);
      c.rect(5, 1, 6, 2, HOODRED);
      c.set(6, 2, K);
      c.set(5, 2, CLOTH.forest);
      c.col(5, 3, 9, dark(o));
      dots(c, GOLD, 6, 4, 6, 6, 6, 8);
      c.row(6, 2, 4, dark(o));
      c.row(6, 7, 9, dark(o));
      c.rect(2, 7, 3, 8, mix(o, 1.15));
      c.rect(8, 7, 8, 8, mix(o, 1.15));
      dots(c, lite(o), 2, 2, 2, 4);
      dots(c, MUD, 3, 9, 9, 9);
    },
  });

  arms.push({
    name: 'rolled sleeve cream muddy hands tan',
    theme: GA,
    draw(c) {
      const s = CLOTH.cream,
        k = SKINS.tan;
      c.rect(1, 0, 3, 3, s);
      c.col(3, 0, 3, dark(s));
      c.row(4, 0, 4, s);
      c.set(4, 4, dark(s));
      c.row(5, 1, 3, dark(s));
      c.rect(1, 6, 3, 10, k);
      c.col(3, 6, 8, dark(k));
      c.rect(1, 9, 3, 10, MUD);
      c.set(1, 9, k);
      c.set(2, 8, MUD);
      c.set(3, 10, dark(MUD));
    },
  });
  arms.push({
    name: 'beekeeper white sleeve long leather gauntlet',
    theme: GA,
    draw(c) {
      c.rect(1, 0, 3, 5, WHITE);
      c.col(3, 0, 5, dark(WHITE));
      c.set(2, 3, dark(WHITE));
      c.row(5, 1, 3, STEEL);
      c.rect(1, 6, 3, 10, HIDE);
      c.row(6, 0, 4, lite(HIDE));
      c.set(4, 6, HIDE);
      c.col(3, 7, 10, dark(HIDE));
      dots(c, CLOTH.mustard, 2, 2);
      dots(c, K, 1, 2);
    },
  });
  arms.push({
    name: 'scarecrow sleeve earth patched straw hand',
    theme: GA,
    draw(c) {
      const e = CLOTH.earth;
      c.rect(1, 0, 3, 7, e);
      c.col(3, 0, 7, dark(e));
      c.set(1, 0, lite(e));
      c.rect(1, 3, 2, 4, CLOTH.forest);
      c.set(3, 3, K);
      c.row(7, 1, 3, BONE);
      c.set(3, 7, dark(BONE));
      dots(c, STRAW, 1, 8, 2, 8, 3, 8, 0, 9, 2, 9, 4, 9, 1, 10, 3, 10, 2, 10);
      dots(c, dark(STRAW), 3, 8, 2, 10, 4, 9);
      c.clear(1, 6);
    },
  });
  arms.push({
    name: 'floral blouse sleeve cream sprig canvas garden glove',
    theme: GA,
    draw(c) {
      const b = CLOTH.cream;
      c.rect(1, 0, 3, 6, b);
      c.col(3, 0, 6, dark(b));
      c.set(1, 0, lite(b));
      dots(c, ROUGE, 2, 2, 1, 5);
      dots(c, LEAF, 1, 2, 2, 5);
      c.row(7, 0, 4, CLOTH.mustard);
      c.set(4, 7, dark(CLOTH.mustard));
      c.rect(1, 8, 3, 10, CLOTH.mustard);
      c.col(3, 8, 10, dark(CLOTH.mustard));
      dots(c, MUD, 1, 10, 2, 10);
      c.set(1, 8, lite(CLOTH.mustard));
    },
  });

  legs.push({
    name: 'wellington boots green denim trousers',
    theme: GA,
    draw(c) {
      c.rect(1, 0, 4, 3, DENIM);
      c.col(4, 0, 3, dark(DENIM));
      c.set(1, 0, lite(DENIM));
      c.rect(1, 4, 4, 9, WELLY);
      shoe(c, WELLY);
      c.row(4, 0, 5, lite(WELLY));
      c.col(4, 5, 9, dark(WELLY));
      c.col(1, 5, 8, lite(WELLY));
      dots(c, MUD, 2, 11, 4, 11, 3, 10, 5, 11);
    },
  });
  legs.push({
    name: 'canvas gaiters buttoned earth breeches boots',
    theme: GA,
    draw(c) {
      const e = CLOTH.earth;
      c.rect(1, 0, 4, 4, e);
      c.rect(0, 2, 0, 3, e);
      c.col(4, 0, 4, dark(e));
      c.set(1, 0, lite(e));
      c.rect(1, 5, 4, 9, KHAKI);
      c.row(5, 1, 4, lite(KHAKI));
      c.col(1, 6, 9, lite(KHAKI));
      dots(c, LEATHER, 4, 6, 4, 8);
      c.set(4, 7, dark(KHAKI));
      c.set(4, 9, dark(KHAKI));
      shoe(c, LEATHER);
      c.row(10, 1, 3, KHAKI);
      c.set(2, 10, dark(KHAKI));
    },
  });
  legs.push({
    name: 'scarecrow patched trousers rope tied straw feet',
    theme: GA,
    draw(c) {
      const t = SACK;
      c.rect(1, 0, 4, 8, t);
      c.col(4, 0, 8, dark(t));
      c.set(1, 0, lite(t));
      c.rect(2, 2, 3, 3, CLOTH.wine);
      dots(c, K, 1, 2, 4, 3);
      c.rect(1, 5, 2, 6, CLOTH.mustard);
      c.set(3, 6, K);
      c.row(8, 1, 4, BONE);
      c.set(4, 8, dark(BONE));
      dots(c, STRAW, 1, 9, 2, 9, 3, 9, 4, 9, 2, 10, 3, 10, 4, 10, 1, 11, 3, 11, 5, 11, 5, 10);
      dots(c, dark(STRAW), 4, 9, 3, 10, 5, 11);
      c.set(0, 9, STRAW);
    },
  });
  legs.push({
    name: 'lady linen skirt muddy hem garden boots',
    theme: GA,
    draw(c) {
      c.rect(1, 0, 4, 1, LINEN);
      c.rect(0, 2, 5, 8, LINEN);
      c.col(5, 2, 8, dark(LINEN));
      c.col(2, 3, 8, dark(LINEN));
      c.set(1, 2, lite(LINEN));
      c.row(0, 1, 4, CLOTH.wine);
      dots(c, MUD, 0, 8, 1, 8, 3, 8, 4, 8, 4, 7, 1, 7);
      c.rect(2, 9, 3, 9, LEATHER);
      shoe(c, LEATHER);
      c.clear(1, 10);
      c.set(1, 11, K);
      c.set(3, 10, lite(LEATHER));
    },
  });

  return { heads, torsos, arms, legs };
};
