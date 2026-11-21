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
  if (!f.endsWith('.js') || f === 'kit.js' || f.startsWith('_')) continue;
  const defs = require('./big/' + f)(kit);
  for (const [slug, def] of Object.entries(defs)) {
    if (drawn.has(slug)) throw new Error(`${slug} is drawn twice (${f} and ${drawn.get(slug).file})`);
    drawn.set(slug, { ...def, file: f });
  }
}

const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7),
  outDir = (process.argv.find((a) => a.startsWith('--out=')) || '').slice(6);
function render(slug, d) {
  const c = kit.canvas(d.w, d.h);
  const r = d.draw(c);
  if (r !== false) {
    if (d.shade !== false) c.shade();
    if (d.outline !== false) c.outline();
  }
  if (!c.px.some(Boolean)) throw new Error(`${slug} (${d.file}) is empty`);
  return kit.png(d.w, d.h, c.px);
}
if (only) {
  if (!outDir) throw new Error('--only needs --out=<folder>');
  fs.mkdirSync(outDir, { recursive: true });
  const known = new Set(index.categories.flatMap((c) => c.items.map((i) => i.slug))),
    sizes = {};
  for (const [slug, d] of drawn) {
    if (d.file !== only + '.js') continue;
    if (!known.has(slug)) throw new Error(`${slug} is not a sprite of the library`);
    fs.writeFileSync(path.join(outDir, slug + '.png'), render(slug, d));
    sizes[slug] = { w: d.w, h: d.h };
  }
  fs.writeFileSync(path.join(outDir, 'sizes.json'), JSON.stringify(sizes));
  console.log(`${Object.keys(sizes).length} sprites of ${only} → ${outDir}`);
  process.exit(0);
}

const BIG_CATS = new Set(['buildings']);
const SMALL_CATS = new Set(['items', 'food', 'meals', 'clues', 'weapons', 'tools', 'clothes', 'household', 'play', 'adventure']);
const BIG_NAMES =
  /\b(bed|sofa|couch|wardrobe|table|desk|piano|organ|tree|cart|wagon|car|van|truck|bus|boat|ship|statue|bookcase|bookshelf|shelf|shelves|cabinet|cupboard|dresser|door|gate|gateway|arch|grandfather|coffin|tomb|mausoleum|machine|tank|fountain|well|carriage|hearse|stove|oven|fireplace|bath|bathtub|gallows|gibbet|tent|booth|locker|fridge|throne|altar|pillar|column|obelisk|angel|trilithon|generator|boiler|furnace|loom|scaffold|bench|counter|bar|stall|crate stack|haystack|windmill|tower)\b/;

let nDrawn = 0,
  nDoubled = 0,
  nSmall = 0;
const seen = new Set();
for (const cat of index.categories)
  for (const it of cat.items) {
    seen.add(it.slug);
    const file = path.join(PX, it.slug + '.png');
    const d = drawn.get(it.slug);
    if (d) {
      fs.writeFileSync(file, render(it.slug, d));
      it.w = d.w;
      it.h = d.h;
      it.art = 'big';
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
console.log(`large-scale art: ${nDrawn} drawn afresh, ${nDoubled} doubled, ${nSmall} shown small`);
