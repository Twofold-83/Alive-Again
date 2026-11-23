/*
 * The large-scale art. tools/make-sprites.js draws every sprite as a 16 x 16 icon; this step, run after it,
 * brings the things and creatures of the library to the scale of the paper-doll characters, where one pixel of
 * any picture is the same size on the stage: a person is 16 x 33, a floor tile 16 x 16, a bed two tiles wide.
 *
 *   node tools/make-big.js            redraws public/px/<slug>.png where needed and writes sizes into index.json
 *
 * Three kinds of sprite come out of it:
 *   drawn      a module in tools/big/ draws the sprite afresh at its true size ({ w, h, draw(c) } per slug)
 *   doubled    a creature or a large thing not yet drawn afresh: the 16 x 16 picture, doubled with Scale2x
 *   as it is   tiles and effects, and middling things; small things (a key, a cup) are shown a little smaller
 *
 * Every item in index.json gets w and h: its size on the stage in doll pixels.
 *
 *   node tools/make-big.js --only=furniture --out=/some/dir
 *                                     draws just tools/big/furniture.js into that folder (the PNGs and a
 *                                     sizes.json), touching nothing else: for looking at work in progress
 */
const fs = require('fs');
const path = require('path');
const kit = require('./big/kit.js');

const PX = path.join(__dirname, '..', 'public', 'px');
const index = JSON.parse(fs.readFileSync(path.join(PX, 'index.json'), 'utf8'));

/* the freshly drawn sprites */
const drawn = new Map();
for (const f of fs.readdirSync(path.join(__dirname, 'big')).sort()) {
  if (!f.endsWith('.js') || f === 'kit.js' || f.startsWith('_') || f.startsWith('views-')) continue;
  const defs = require('./big/' + f)(kit);
  for (const [slug, def] of Object.entries(defs)) {
    if (drawn.has(slug)) throw new Error(`${slug} is drawn twice (${f} and ${drawn.get(slug).file})`);
    drawn.set(slug, { ...def, file: f });
  }
}

const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7),
  outDir = (process.argv.find((a) => a.startsWith('--out=')) || '').slice(6);
/* views of a thing drawn elsewhere than with the thing itself: tools/big/views-*.js, { slug: { base?, side, used, sideUsed } } */
for (const f of fs.readdirSync(path.join(__dirname, 'big')).sort()) {
  if (!/^views-.*\.js$/.test(f)) continue;
  for (const [slug, v] of Object.entries(require('./big/' + f)(kit))) {
    const d = drawn.get(slug);
    if (!d) throw new Error(`${f}: ${slug} is not a freshly drawn sprite`);
    if (d.views) throw new Error(`${f}: ${slug} already has views (in ${d.file})`);
    d.views = v;
    d.viewsFile = f;
  }
}
/* brand-new sprites: a definition that names its category ({ cat, name, catLabel, group, kind }) is added to the
 * library if its slug is not there yet. group: 'thing' (default), 'tile' or 'char'; kind: 'floor' | 'wall' for tiles. */
{
  const where = new Map();
  for (const c of index.categories) for (const it of c.items) where.set(it.slug, c.id);
  for (const [slug, d] of drawn) {
    if (!d.cat) continue;
    if (where.has(slug)) {
      if (where.get(slug) !== d.cat) throw new Error(`${slug} (${d.file}) wants category ${d.cat}, but a sprite of that name is already in ${where.get(slug)}: pick another name`);
      continue;
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw new Error(`${slug} (${d.file}): a slug is lower-case words joined by hyphens`);
    let c = index.categories.find((x) => x.id === d.cat);
    if (!c) index.categories.push((c = { id: d.cat, label: d.catLabel || d.cat, group: d.group || 'thing', items: [] }));
    const it = { slug, name: d.name || slug.replace(/-/g, ' ') };
    if (d.kind) it.kind = d.kind;
    c.items.push(it);
    where.set(slug, d.cat);
  }
}
/** Draw a sprite; returns its canvas. */
function paint(slug, d) {
  const c = kit.canvas(d.w, d.h);
  const r = d.draw(c);
  if (r !== false) {
    if (d.shade !== false) c.shade();
    if (d.outline !== false) c.outline();
  }
  if (!c.px.some(Boolean)) throw new Error(`${slug} (${d.file}) is empty`);
  return c;
}
const render = (slug, d) => kit.png(d.w, d.h, paint(slug, d).px);
/**
 * The other pictures of a thing, drawn by hand next to it: d.views = { base, side, used, sideUsed }.
 *   base       'front' (default) or 'side': which way the main picture looks; `side` is then the other way
 *   a view is  { w, h, draw(c) }                       a fresh canvas, shaded and outlined like any sprite, or
 *              { from: 'base' | 'side' | 'used', w, h, dx, dy, draw(c), outline }
 *                                                       a copy of that picture (on a canvas of w x h if given, the
 *                                                       copy put at dx, dy — by default left, standing on the bottom
 *                                                       row) to draw the change on; outline: true outlines it again
 * Returns { side, used, sideUsed } as canvases, whichever exist.
 */
function paintViews(slug, d, base) {
  const out = {},
    src = { base };
  for (const key of ['side', 'used', 'sideUsed']) {
    const v = d.views && d.views[key];
    if (!v) continue;
    let c;
    if (v.from) {
      const from = src[v.from];
      if (!from) throw new Error(`${slug}: view ${key} copies ${v.from}, which is not drawn (yet)`);
      c = kit.canvas(v.w || from.w, v.h || from.h);
      c.stamp(from, v.dx || 0, v.dy == null ? c.h - from.h : v.dy);
      if (v.draw) v.draw(c);
      if (v.outline) c.outline();
    } else {
      c = paint(`${slug} (${key})`, { ...v, file: d.viewsFile || d.file });
    }
    if (c.w > 64 || c.h > 64) throw new Error(`${slug}: view ${key} is larger than 64 x 64`);
    out[key] = src[key] = c;
  }
  return out;
}
const VIEW_FILE = { side: '.side', used: '.used', sideUsed: '.side.used' };
const dumpArg = (process.argv.find((a) => a.startsWith('--dump=')) || '').slice(7);
if (dumpArg) {
  /* look at a sprite as text: node tools/make-big.js --dump=bed-single-old   (or bed-single-old.side, .used, .sideUsed) */
  const [slug, key] = dumpArg.split('.'),
    d = drawn.get(slug);
  if (!d) throw new Error(slug + ' is not a freshly drawn sprite');
  const base = paint(slug, d),
    c = key ? paintViews(slug, d, base)[key] : base;
  if (!c) throw new Error(`${slug} has no view ${key}`);
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    seen = new Map();
  let text = '';
  for (let y = 0; y < c.h; y++) {
    for (let x = 0; x < c.w; x++) {
      const p = c.get(x, y);
      if (!p) text += '.';
      else {
        const k = '#' + p.slice(0, 3).map((n) => n.toString(16).padStart(2, '0')).join('');
        if (!seen.has(k)) seen.set(k, k === '#0b0a10' ? '#' : letters[seen.size % letters.length]);
        text += seen.get(k);
      }
    }
    text += '\n';
  }
  console.log(`${dumpArg}  ${c.w} x ${c.h}\n${text}${[...seen].map(([k, l]) => `${l} ${k}`).join('   ')}`);
  process.exit(0);
}
if (only) {
  if (!outDir) throw new Error('--only needs --out=<folder>');
  fs.mkdirSync(outDir, { recursive: true });
  const known = new Set(index.categories.flatMap((c) => c.items.map((i) => i.slug))),
    sizes = {};
  for (const [slug, d] of drawn) {
    if (d.file !== only + '.js' && d.viewsFile !== only + '.js') continue;
    if (!known.has(slug)) throw new Error(`${slug} is not a sprite of the library`);
    const base = paint(slug, d);
    fs.writeFileSync(path.join(outDir, slug + '.png'), kit.png(base.w, base.h, base.px));
    sizes[slug] = { w: d.w, h: d.h };
    for (const [key, c] of Object.entries(paintViews(slug, d, base))) {
      fs.writeFileSync(path.join(outDir, slug + VIEW_FILE[key] + '.png'), kit.png(c.w, c.h, c.px));
      sizes[slug + VIEW_FILE[key]] = { w: c.w, h: c.h };
    }
  }
  fs.writeFileSync(path.join(outDir, 'sizes.json'), JSON.stringify(sizes));
  console.log(`${Object.keys(sizes).length} sprites of ${only} → ${outDir}`);
  process.exit(0);
}

const BIG_CATS = new Set(['buildings']);
const SMALL_CATS = new Set(['items', 'food', 'meals', 'clues', 'weapons', 'tools', 'clothes', 'household', 'play', 'adventure']);
const BIG_NAMES =
  /\b(bed|sofa|couch|wardrobe|table|desk|piano|organ|tree|cart|wagon|car|van|truck|bus|boat|ship|statue|bookcase|bookshelf|shelf|shelves|cabinet|cupboard|dresser|door|gate|gateway|arch|grandfather|coffin|tomb|mausoleum|machine|tank|fountain|well|carriage|hearse|stove|oven|fireplace|bath|bathtub|gallows|gibbet|tent|booth|locker|fridge|throne|altar|pillar|column|obelisk|angel|trilithon|generator|boiler|furnace|loom|scaffold|bench|counter|bar|stall|crate stack|haystack|windmill|tower)\b/;

/* Old 16 x 16 icons that have nothing to do with a house and its horrors: no longer offered when you add a thing.
 * The files stay, because old stories, the menus' own icons and the Dungeon mode still show them. */
const LEGACY = new Set([
  'monsters',
  'animals',
  'creatures',
  'weapons',
  'items',
  'food',
  'buildings',
  'meals',
  'clothes',
  'city',
  'tech',
  'play',
  'tools',
  'adventure',
  'outdoors',
]);
for (const cat of index.categories) {
  if (LEGACY.has(cat.id)) cat.legacy = true;
  else delete cat.legacy;
}
for (const f of fs.readdirSync(PX)) if (/\.(side|used)\.png$/.test(f)) fs.unlinkSync(path.join(PX, f)); // the views are drawn again below
let nViews = 0,
  nDrawn = 0,
  nDoubled = 0,
  nSmall = 0;
const seen = new Set();
for (const cat of index.categories)
  for (const it of cat.items) {
    seen.add(it.slug);
    const file = path.join(PX, it.slug + '.png');
    const d = drawn.get(it.slug);
    if (d) {
      const base = paint(it.slug, d);
      fs.writeFileSync(file, kit.png(base.w, base.h, base.px));
      it.w = d.w;
      it.h = d.h;
      it.art = 'big';
      /* its other pictures: turned a quarter, used, and used seen from the side */
      delete it.v;
      delete it.base;
      delete it.side;
      delete it.used;
      delete it.long;
      for (const [key, c] of Object.entries(paintViews(it.slug, d, base))) {
        fs.writeFileSync(path.join(PX, it.slug + VIEW_FILE[key] + '.png'), kit.png(c.w, c.h, c.px));
        (it.v ||= {})[key] = [c.w, c.h];
        nViews++;
      }
      if (it.v && d.views.base === 'side') it.base = 'side';
      if (d.solid != null) it.solid = d.solid;
      nDrawn++;
      continue;
    }
    delete it.art;
    const im = kit.readPng(fs.readFileSync(file));
    const double = cat.group === 'char' || (cat.group === 'thing' && (BIG_CATS.has(cat.id) || BIG_NAMES.test(it.name)));
    if (double) {
      if (im.w === 16) {
        const src = kit.canvas(16, 16);
        im.px.forEach((p, i) => (src.px[i] = p));
        const out = kit.scale2x(src);
        fs.writeFileSync(file, kit.png(32, 32, out.px));
      }
      it.w = 32;
      it.h = 32;
      nDoubled++;
    } else if (cat.group === 'thing' && SMALL_CATS.has(cat.id)) {
      it.w = 10;
      it.h = 10;
      nSmall++;
    } else {
      it.w = im.w;
      it.h = im.h;
    }
  }
for (const [slug, d] of drawn)
  if (!seen.has(slug)) throw new Error(`${slug} (${d.file}) is not a sprite of the library: only existing slugs can be redrawn`);
fs.writeFileSync(path.join(PX, 'index.json'), JSON.stringify(index));
console.log(`large-scale art: ${nDrawn} drawn afresh (${nViews} more pictures of them: side, used), ${nDoubled} doubled, ${nSmall} shown small`);
