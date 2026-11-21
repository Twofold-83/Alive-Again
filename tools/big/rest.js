/*
 * The rest of the house at paper-doll scale, drawn as text: one letter is one pixel (see LETTERS), a dot or a
 * space is empty. The canvas is the picture plus a free pixel all round for the outline.
 *   def('slug', solid, ['row', 'row', ...], options)
 */
module.exports = ({ C, K, hex, dark, lite }) => {
  const out = {};
  const LETTERS = {
    k: K,
    n: C.night,
    w: C.white,
    W: dark(C.white),
    b: C.bone,
    B: dark(C.bone),
    s: C.stone,
    d: C.stoneDark,
    l: C.stoneLight,
    i: C.iron,
    I: C.ironDark,
    t: C.steel,
    T: lite(C.steel),
    o: C.wood,
    O: C.woodDark,
    p: C.woodLight,
    q: C.woodPale,
    g: C.gold,
    G: C.brass,
    u: C.rust,
    U: dark(C.rust),
    r: C.blood,
    R: C.red,
    v: C.wine,
    V: dark(C.wine),
    f: C.flame,
    F: C.flameLight,
    y: C.straw,
    Y: dark(C.straw),
    c: C.cream,
    a: C.ash,
    A: dark(C.ash),
    e: C.earth,
    E: dark(C.earth),
    m: C.moss,
    M: C.leafLight,
    H: C.leaf,
    h: C.ghost,
    x: C.flesh,
    X: dark(C.flesh),
    z: C.rot,
    j: C.navy,
    J: lite(C.navy),
    N: C.slate,
    1: C.glass,
    2: C.glassLight,
    3: C.water,
    4: C.teal,
    5: C.plum,
    6: C.mustard,
    7: hex('#a8697a'),
    8: hex('#5fae5a'),
    9: hex('#c98a2a'),
    0: hex('#a0603a'),
    P: hex('#b9b7a6'),
    L: hex('#6f8a3c'),
  };
  function def(slug, solid, rows, o = {}) {
    const w = Math.max(...rows.map((r) => r.length)) + 2,
      h = rows.length + 2;
    out[slug] = {
      w,
      h,
      solid: !!solid,
      ...o,
      draw(c) {
        rows.forEach((row, y) => {
          for (let x = 0; x < row.length; x++) {
            const col = LETTERS[row[x]];
            if (col) c.set(x + 1, y + 1, col);
          }
        });
      },
    };
  }
  /** The same picture with some rows or letters changed: swap = { from: 'to' } letters, put = [[x, y, 'text'], ...]. */
  function vary(slug, from, { swap = {}, put = [], solid, ...o } = {}) {
    const src = out[from];
    const rows = src.rows.map((r) => [...r].map((ch) => swap[ch] || ch));
    for (const [x, y, text] of put) {
      while (rows.length <= y) rows.push([]);
      for (let i = 0; i < text.length; i++) {
        while (rows[y].length <= x + i) rows[y].push('.');
        if (text[i] !== ' ') rows[y][x + i] = text[i];
      }
    }
    keep(
      slug,
      solid == null ? src.solid : solid,
      rows.map((r) => r.join('')),
      o,
    );
  }
  function keep(slug, solid, rows, o) {
    def(slug, solid, rows, o);
    out[slug].rows = rows;
  }
  const D = (slug, rows, o) => keep(slug, true, rows, o); // blocks the way
  const T = (slug, rows, o) => keep(slug, false, rows, o); // can be walked past
  require('./_rest-home.js')({ D, T, vary });
  require('./_rest-eerie.js')({ D, T, vary });
  require('./_rest-tech.js')({ D, T, vary });
  require('./_rest-finds.js')({ D, T, vary });
  for (const k of Object.keys(out)) delete out[k].rows;
  return out;
};
