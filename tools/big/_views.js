/*
 * Views: every freshly drawn thing also exists turned a quarter (<slug>.side.png) and used (<slug>.used.png).
 * In index.json an item gets side: [w, h], used: [w, h], and long: true where the picture as drawn is the long
 * side (a bed, a bench) — then the turned picture is its front.
 */
const fs = require('fs');
const path = require('path');

module.exports = function makeViews(kit, index, PX) {
  const K = kit.K,
    isK = (p) => p && p[0] === K[0] && p[1] === K[1] && p[2] === K[2];
  const load = (slug) => kit.fromPng(fs.readFileSync(path.join(PX, slug + '.png')));
  /** Seen from the other side a thing is narrower: keep the outline columns, sample the rest. */
  function turned(src) {
    const w = Math.max(4, Math.min(src.w, Math.round(src.w * (src.w <= 12 ? 0.75 : src.w <= 20 ? 0.6 : 0.48)))),
      out = kit.canvas(w, src.h);
    for (let x = 0; x < w; x++) {
      const sx =
        x === 0 ? 0 : x === w - 1 ? src.w - 1 : Math.min(src.w - 2, Math.max(1, Math.round(1 + ((x - 1) * (src.w - 3)) / Math.max(1, w - 3))));
      for (let y = 0; y < src.h; y++) out.px[y * w + x] = src.get(sx, y);
    }
    for (let y = 0; y < src.h; y++) {
      let a = -1,
        b = -1;
      for (let x = 0; x < w; x++)
        if (out.get(x, y)) {
          if (a < 0) a = x;
          b = x;
        }
      if (a >= 0) {
        out.px[y * w + a] = K; // close the outline where sampling skipped it
        out.px[y * w + b] = K;
      }
    }
    return out;
  }
  const all = new Map();
  for (const cat of index.categories) for (const it of cat.items) all.set(it.slug, it);
  const PAIRS = {
    bathtub: 'bathtub-filled',
    'barrel-wine': 'barrel-open',
    'birdcage-bird': 'birdcage-empty',
    chalice: 'chalice-spilled',
    candelabra: 'candelabra-lit',
    'tv-test-card': 'monitor-static',
    'terminal-green': 'monitor-smashed',
    'computer-beige': 'monitor-static',
    'monitor-text': 'monitor-static',
    'telephone-wall': 'telephone-off-hook',
    'telephone-off-hook': 'telephone-wall',
    toilet: 'toilet-dirty',
    bed: 'bed-unmade',
    'double-bed': 'bed-unmade',
    'bathroom-sink': 'washbasin-bloody',
    'street-lamp-gas': 'street-lamp-broken',
    'chair-dining': 'chair-toppled',
    'music-box': 'music-box-open',
    'toy-chest': 'toy-chest-open',
    mannequin: 'mannequin-broken',
    'doll-porcelain': 'doll-broken',
    'kitchen-counter': 'kitchen-counter-drawers',
    'fuse-board': 'fuse-box-open',
    'furnace-cold': 'furnace',
    furnace: 'furnace-cold',
    'grimoire-closed': 'grimoire-floating',
    'window-frame-dark': 'window-frame-broken',
    'window-frame-lit': 'window-frame-dark',
    fridge: 'fridge-old',
    washbasin: 'washbasin-bloody',
    'bookcase-full': 'bookcase-half',
    'bookcase-half': 'bookcase-toppled',
    'grave-open': 'earth-mound',
    'earth-mound': 'grave-open',
    'padlock-heavy': 'padlock-open',
    'locket-closed': 'locket-open',
    'bed-single-old': 'bed-unmade',
    'wardrobe-old': 'wardrobe-open',
    wardrobe: 'wardrobe-open',
    'desk-tidy': 'desk-cluttered',
    'tv-old-off': 'tv-old-static',
    'tv-old-static': 'tv-old-off',
  };
  /** The picture another sprite already is: an open door for a shut one, a lit candle for an unlit one. */
  function counterpart(slug) {
    const swaps = [
      [/$/, '-open'],
      [/$/, '-lit'],
      [/$/, '-on'],
      [/$/, '-ajar'],
      [/$/, '-broken'],
      [/$/, '-empty'],
      [/$/, '-smashed'],
      [/$/, '-pressed'],
      [/-(shut|closed)$/, '-open'],
      [/-open$/, '-shut'],
      [/-open$/, '-closed'],
      [/-open$/, ''],
      [/-ajar$/, ''],
      [/-lit$/, ''],
      [/-cold$/, '-embers'],
      [/-embers$/, '-cold'],
      [/-unlit$/, '-lit'],
      [/-lit$/, '-unlit'],
      [/-left$/, '-right'],
      [/-right$/, '-left'],
      [/-off$/, '-on'],
      [/-on$/, '-off'],
      [/-empty$/, ''],
      [/-filled$/, ''],
      [/-pressed$/, ''],
      [/-up$/, '-down'],
    ];
    for (const t of [PAIRS[slug], ...swaps.map(([re, to]) => (re.test(slug) ? slug.replace(re, to) : null))])
      if (t && t !== slug && all.has(t) && all.get(t).art === 'big') return t;
    return null;
  }
  const FLAMES = [kit.C.flame, kit.C.flameLight, kit.C.glow].map((c) => c.join());
  const OPENS =
    /door|gate|chest|trunk|box|wardrobe|cupboard|cabinet|dresser|drawer|fridge|icebox|safe|coffin|hatch|crate|case|locker|oven|cooker|microwave|bin|basket|bag|sack|barrel|drum|tank|vat|jar|cage|kennel|dog house|booth|tent|machine|washing/;
  /** No counterpart: a small, telling change made in code. */
  function used(src, name) {
    const { w, h } = src;
    let flames = 0;
    for (const p of src.px) if (p && FLAMES.includes(p.join())) flames++;
    const out = kit.canvas(w, h);
    src.px.forEach((p, i) => (out.px[i] = p));
    if (flames > 1) {
      out.px.forEach((p, i) => {
        if (p && FLAMES.includes(p.join())) out.px[i] = kit.C.night; // something that burns or glows: put out
      });
      return out;
    }
    if (OPENS.test(name) && w >= 8 && h >= 7) {
      /* something that opens: the dark inside shows */
      const x0 = Math.round(w * 0.28),
        x1 = Math.round(w * 0.66),
        y0 = Math.round(h * 0.3),
        y1 = Math.round(h * 0.78);
      for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++) if (src.get(x, y) && !isK(src.get(x, y))) out.px[y * w + x] = x === x1 ? kit.dark(src.get(x, y)) : kit.C.night;
      for (let y = y0; y <= y1; y++) if (src.get(x0 - 1, y) && !isK(src.get(x0 - 1, y))) out.px[y * w + x0 - 1] = K;
      return out;
    }
    if (h > w * 1.25 && h <= 26) {
      const t = kit.canvas(h, w); // a small upright thing: knocked over
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (src.get(x, y)) t.px[(w - 1 - x) * h + y] = src.get(x, y);
      return t;
    }
    /* anything else: handled and left askew — every few rows slide a pixel further */
    const step = Math.max(3, Math.round(h / 3)),
      slide = Math.floor((h - 1) / step),
      t = kit.canvas(w + slide, h);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) if (src.get(x, y)) t.px[y * (w + slide) + x + Math.floor((h - 1 - y) / step)] = src.get(x, y);
    return t;
  }
  let n = 0,
    paired = 0;
  for (const cat of index.categories)
    for (const it of cat.items) {
      delete it.side;
      delete it.used;
      delete it.long;
      if (cat.group !== 'thing' || it.art !== 'big') continue;
      const src = load(it.slug);
      const side = turned(src);
      fs.writeFileSync(path.join(PX, it.slug + '.side.png'), kit.png(side.w, side.h, side.px));
      it.side = [side.w, side.h];
      if (it.w > it.h * 1.3) it.long = true;
      const other = counterpart(it.slug),
        u = other ? load(other) : used(src, it.name + ' ' + it.slug.replace(/-/g, ' '));
      if (other) paired++;
      fs.writeFileSync(path.join(PX, it.slug + '.used.png'), kit.png(u.w, u.h, u.px));
      it.used = [u.w, u.h];
      n++;
    }
  console.log(`views: ${n} things turned and used (${paired} of them use the picture of their counterpart)`);
};
