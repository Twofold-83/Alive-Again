/*
 * The asset catalog. Everything seen or heard in a scene is referred to by an id string; a scene never holds pixels.
 *
 *   p:<slug>     a sprite of the pixel-art library (public/px, drawn by tools/make-big.js); its other pictures
 *                (side, used, side-used) are files next to it
 *   d:<parts>    a paper-doll character (see dolls.js)
 *   c:<id>       a picture stored with one story: uploaded, generated, or drawn in the sprite editor
 *   own:<id>     a drawing kept on this device; put on a stage it is sent to the story and becomes c:<id>
 *   b:<slug>     a built-in backdrop (a CSS painting; rooms are built from tiles on a black one)
 *   m:<name>     a music mood (see shared/sounds.js)
 *   s:<slug>, e:<text>   the first, emoji library and typed emoji: still drawn for old stories, no longer offered
 *
 * public/packs/manifest.json can replace any built-in picture by a file:
 *   { "pixel": { "old-oak-chest": "hd/chest.png" }, "backdrops": { "forest": "hd/forest.jpg" }, "sprites": { ... } }
 */
import { SPRITE_WIDTH } from '../shared/scene-model.js';
import { kept } from './kept.js';
import { LEGACY_SPRITES } from './legacy-sprites.js';

const stars =
  'radial-gradient(1px 1px at 12% 18%,#fff 99%,transparent),radial-gradient(1.5px 1.5px at 31% 9%,#fff 99%,transparent),radial-gradient(1px 1px at 47% 27%,#fff 99%,transparent),radial-gradient(1.5px 1.5px at 63% 13%,#fff 99%,transparent),radial-gradient(1px 1px at 78% 31%,#fff 99%,transparent),radial-gradient(1px 1px at 90% 8%,#fff 99%,transparent),radial-gradient(1px 1px at 22% 40%,#fff 99%,transparent),radial-gradient(1.5px 1.5px at 70% 45%,#fff 99%,transparent),';
function sun(x, y, c) {
  return `radial-gradient(circle at ${x}% ${y}%,${c} 0 6%,transparent 6.5%),`;
}

export const BACKDROPS = [
  { id: 'b:room', name: 'Room', css: 'linear-gradient(#d9c7a8 0 58%,#6e4f33 58% 60%,#9a7350 60%)' },
  { id: 'b:darkroom', name: 'Dark room', css: 'linear-gradient(#3a3550 0 58%,#1c1a28 58% 60%,#2b2638 60%)' },
  {
    id: 'b:kitchen',
    name: 'Kitchen',
    css: 'linear-gradient(transparent 60%,rgba(0,0,0,.25)),repeating-conic-gradient(#e9e4d8 0 25%,#b9b2a2 0 50%) 0 100%/12% 16%,linear-gradient(#bfe0d8 0 60%,#8a7 60%)',
  },
  {
    id: 'b:hall',
    name: 'Great hall',
    css: 'repeating-linear-gradient(90deg,transparent 0 18%,#3b3340 18% 23%),linear-gradient(#57506a 0 60%,#2a2530 60% 62%,#7a6a5a 62%)',
  },
  {
    id: 'b:dungeon',
    name: 'Dungeon',
    css: 'repeating-linear-gradient(0deg,transparent 0 11%,rgba(0,0,0,.35) 11% 12%),repeating-linear-gradient(90deg,transparent 0 15%,rgba(0,0,0,.3) 15% 16%),linear-gradient(#4b4f58 0 64%,#23252b 64%)',
  },
  {
    id: 'b:ship',
    name: 'Spaceship',
    css: 'repeating-linear-gradient(90deg,transparent 0 24%,#5b6f86 24% 25%),radial-gradient(ellipse at 50% 30%,#061a3a 0 22%,transparent 22.5%),linear-gradient(#aebccb 0 62%,#44505f 62% 64%,#7d8b9b 64%)',
  },
  { id: 'b:meadow', name: 'Meadow', css: sun(80, 18, '#fff6b0') + 'linear-gradient(#8fd3ff 0,#d8f1ff 55%,#6cbf4b 55%,#3f8f2f)' },
  { id: 'b:forest', name: 'Forest', css: 'linear-gradient(#0f3d2a 0,#2f6b3a 50%,#1f4a24 50%,#16351a)' },
  {
    id: 'b:mountain',
    name: 'Mountains',
    css: 'conic-gradient(from 150deg at 30% 30%,#7d8aa0 0 60deg,transparent 0),conic-gradient(from 150deg at 68% 22%,#5f6c84 0 60deg,transparent 0),linear-gradient(#b9dcff 0,#e8f4ff 62%,#5c8a4a 62%,#3c6a34)',
  },
  {
    id: 'b:lake',
    name: 'Lake',
    css: sun(22, 16, '#fff') + 'linear-gradient(#9fd4f5 0,#e6f5ff 45%,#3f7f5a 45% 50%,#3d8ec2 50%,#2a6a9a 82%,#6cab54 82%)',
  },
  { id: 'b:swamp', name: 'Swamp', css: 'linear-gradient(#3d4a2a 0,#6b7a3a 52%,#2f3a1f 52%,#1d2614 70%,#33412a 70%)' },
  { id: 'b:night', name: 'Night', css: stars + sun(82, 16, '#f3f0d8') + 'linear-gradient(#070b24 0,#1c2452 60%,#141a14 60%,#0c100c)' },
  { id: 'b:graveyard', name: 'Graveyard', css: stars + 'linear-gradient(#0d1420 0,#27384a 58%,#1b2a1c 58%,#0e160f)' },
  { id: 'b:sunset', name: 'Sunset', css: sun(50, 56, '#ffe9a8') + 'linear-gradient(#3b2a6b 0,#e0637a 35%,#ffb46b 60%,#3a2a3a 60%,#221a26)' },
  {
    id: 'b:beach',
    name: 'Beach',
    css: sun(15, 14, '#fff6b0') + 'linear-gradient(#7fd0ff 0,#c9eeff 40%,#2a8fd0 40%,#49b3e8 60%,#f2dc9c 60%,#e3c67a)',
  },
  { id: 'b:desert', name: 'Desert', css: sun(78, 20, '#fff') + 'linear-gradient(#ffd9a0 0,#ffeccc 52%,#e2a85a 52%,#c98a3e)' },
  { id: 'b:snow', name: 'Snow', css: 'linear-gradient(#a9c4de 0,#dbe8f4 55%,#fff 55%,#dfe9f2)' },
  { id: 'b:icecave', name: 'Ice cave', css: 'radial-gradient(ellipse at 50% 45%,#d8f4ff 0,#7fc4e8 50%,#1f4f7a 100%)' },
  {
    id: 'b:volcano',
    name: 'Volcano',
    css: 'conic-gradient(from 150deg at 50% 25%,#3a2622 0 60deg,transparent 0),linear-gradient(#2a0f0f 0,#8a2a12 55%,#ff6a1a 55% 58%,#3a1a12 58%)',
  },
  { id: 'b:hell', name: 'Underworld', css: 'radial-gradient(ellipse at 50% 110%,#ffb020 0,#d02a10 35%,#2a0505 75%)' },
  {
    id: 'b:clouds',
    name: 'Above the clouds',
    css: 'radial-gradient(ellipse at 20% 85%,#fff 0 22%,transparent 22.5%),radial-gradient(ellipse at 55% 92%,#fff 0 28%,transparent 28.5%),radial-gradient(ellipse at 88% 84%,#fff 0 20%,transparent 20.5%),linear-gradient(#5fb0ff,#cfe9ff)',
  },
  { id: 'b:street', name: 'Street', css: 'linear-gradient(#9fb4c7 0,#c9d6e0 45%,#8a8f98 45%,#8a8f98 62%,#3d4047 62%,#2c2e33)' },
  {
    id: 'b:city',
    name: 'City night',
    css:
      stars +
      'repeating-linear-gradient(90deg,#141a2e 0 9%,transparent 9% 11%,#1c2440 11% 17%,transparent 17% 18%) 0 100%/100% 46% no-repeat,linear-gradient(#0a1030 0,#3a2f6a 62%,#23262e 62%)',
  },
  {
    id: 'b:road',
    name: 'Open road',
    css: 'repeating-linear-gradient(90deg,#f3e9a0 0 6%,transparent 6% 12%) 0 82%/100% 2% no-repeat,linear-gradient(#8fd0ff 0,#dff2ff 56%,#7fb25a 56% 66%,#44474e 66%)',
  },
  { id: 'b:cave', name: 'Cave', css: 'radial-gradient(ellipse at 50% 45%,#5a4a3e 0,#2a221d 55%,#0d0a08 100%)' },
  { id: 'b:sea', name: 'Underwater', css: 'linear-gradient(#1fa3c9 0,#0b4f7a 70%,#c9b27a 70%,#a8915c)' },
  { id: 'b:space', name: 'Space', css: stars + 'radial-gradient(ellipse at 70% 80%,#2b1650 0,#05030f 70%)' },
  { id: 'b:moon', name: 'Moon surface', css: stars + sun(20, 18, '#4f8fd0') + 'linear-gradient(#02030a 0,#0b0d18 58%,#b9b9c2 58%,#77777f)' },
  {
    id: 'b:level',
    name: 'Platform level',
    css: 'repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 1px,transparent 1px 10%) 0 100%/100% 22% no-repeat,linear-gradient(#6ec6ff 0 78%,#59b33c 78% 82%,#8a5a34 82%)',
  },
  {
    id: 'b:grid',
    name: 'Retro grid',
    css: 'repeating-linear-gradient(0deg,rgba(255,60,220,.5) 0 1px,transparent 1px 10%),repeating-linear-gradient(90deg,rgba(60,220,255,.45) 0 1px,transparent 1px 7.5%),linear-gradient(#12002a,#2a0050)',
  },
  { id: 'b:dream', name: 'Dream', css: 'linear-gradient(135deg,#ffc3e8,#c3d4ff 50%,#c9ffe6)' },
  { id: 'b:alert', name: 'Red alert', css: 'radial-gradient(ellipse at 50% 50%,#ff3b3b 0,#5a0000 80%)' },
  {
    id: 'b:stage',
    name: 'Theatre',
    css: 'linear-gradient(90deg,#7a1020 0 12%,transparent 12% 88%,#7a1020 88%),linear-gradient(#2a0a12 0 62%,#8a6238 62%,#5e4124)',
  },
  { id: 'b:white', name: 'Blank', css: '#f4f1ea' },
  { id: 'b:black', name: 'Void', css: '#000' },
];

/* ---------- the pixel-art library (public/px, made by tools/make-sprites.js) ----------
 * Asset ids p:<slug>. PIXEL holds its categories once loaded; each has a group:
 * char | thing | tile | fx, used by the step-by-step "Add something" questions. */
export const PIXEL = [];
const PX = new Map();
export async function loadPixel() {
  try {
    const r = await fetch('px/index.json', { cache: 'no-cache' });
    if (!r.ok) return;
    for (const c of (await r.json()).categories) {
      const items = c.items.map((i) => {
        const it = {
          name: i.name,
          asset: 'p:' + i.slug,
          kind: i.kind,
          solid: !!i.solid,
          group: c.group,
          w: i.w || 16,
          h: i.h || 16,
          v: i.v || null, // its other pictures: { side, used, sideUsed } -> [w, h]
          base: i.base || 'front', // which way the main picture looks
        };
        PX.set(i.slug, it);
        SPRITE_WIDTH.set(it.asset, it.w);
        if (it.v && it.v.side) SPRITE_WIDTH.set(it.asset + '|side', it.v.side[0]); // turned, it takes up another width of floor
        return it;
      });
      if (!c.legacy) PIXEL.push({ id: 'px-' + c.id, label: c.label, group: c.group, items }); // old icons are still drawn, not offered
    }
  } catch {
    /* the library could not be loaded: pickers stay empty, the stage still draws what it can */
  }
}
/** Everything a search can find: the library and my own objects. */
export const allItems = () => catsWithOwn().flatMap((c) => c.items);

/* ---------- my own objects: drawn in the sprite editor, kept on this device (localStorage tf.objects) ----------
 * { id, name, cat, slug, base, pics: { '': dataUrl, side, used, sideUsed }, in: { storyCode: assetId } }
 *   cat    'campaign' (an edited copy of a library thing), 'own' (My objects) or a library category id (px-furniture)
 *   slug   set when this drawing permanently stands in for that library thing on this device
 * In lists an object is the asset 'own:<id>'; put on a stage it is sent to the story and becomes c:<assetId>. */
export const OWN = new Map();
export function loadOwn() {
  OWN.clear();
  try {
    for (const o of kept.objects.all()) if (o && o.id && o.pics && o.pics['']) OWN.set(o.id, o);
    /* drawings from the first sprite editor */
    for (const d of JSON.parse(localStorage.getItem('tf.own') || '[]'))
      if (d && d.id && d.dataUrl && !OWN.has(d.id))
        OWN.set(d.id, { id: d.id, name: d.name, cat: 'own', base: 'front', pics: { '': d.dataUrl }, in: d.in || {} });
  } catch {
    /* nothing kept, or not readable: start empty */
  }
}
export const keepOwn = () => kept.objects.set([...OWN.values()]);
const ownItem = (o) => ({ name: (o.name || 'my object').toLowerCase(), asset: 'own:' + o.id, group: 'thing', own: true });
/** The library's categories with my own objects in them: altered things stand in for the originals, new ones are
 * added to the category they were saved to, and "Campaign sprites" and "My objects" come last. */
export function catsWithOwn(group) {
  const mine = [...OWN.values()],
    alt = new Map(mine.filter((o) => o.slug).map((o) => [o.slug, o]));
  const cats = PIXEL.filter((c) => !group || c.group === group).map((c) => ({
    ...c,
    items: [
      ...c.items.map((i) => (alt.has(i.asset.slice(2)) ? ownItem(alt.get(i.asset.slice(2))) : i)),
      ...mine.filter((o) => !o.slug && o.cat === c.id).map(ownItem),
    ],
  }));
  if (!group || group === 'thing') {
    const extra = (id, label) => {
      const items = mine.filter((o) => !o.slug && o.cat === id).map(ownItem);
      if (items.length) cats.push({ id: 'px-' + id, label, group: 'thing', items });
    };
    extra('campaign', 'Campaign sprites');
    extra('own', 'My objects');
  }
  return cats;
}

/* ---------- art packs: files that replace built-in pictures ---------- */
export const PACK = { sprites: {}, backdrops: {}, pixel: {} };
export async function loadPack() {
  try {
    const r = await fetch('packs/manifest.json', { cache: 'no-cache' });
    if (r.ok) {
      const j = await r.json();
      Object.assign(PACK.sprites, j.sprites);
      Object.assign(PACK.backdrops, j.backdrops);
      Object.assign(PACK.pixel, j.pixel);
    }
  } catch {
    /* no pack installed: placeholders are used */
  }
}

/** The other pictures of the story's own things: asset id -> { v: { side, used, sideUsed } (asset ids), base }. */
const CUSTOM = new Map();
export function setCustomAssets(assets) {
  CUSTOM.clear();
  for (const a of assets || []) if (a.views || a.base) CUSTOM.set(a.id, { v: a.views || {}, base: a.base || 'front' });
}
export function assetUrl(code, id) {
  return `/api/rooms/${code}/assets/${id.slice(2)}`;
}

/** How to draw a sprite asset: { img: url } or { glyph: text }. */
export function spriteView(code, asset) {
  if (asset.startsWith('c:')) return { img: assetUrl(code, asset) };
  if (asset.startsWith('own:')) return { img: (OWN.get(asset.slice(4)) || { pics: {} }).pics[''] || '' };
  if (asset.startsWith('p:')) return { img: PACK.pixel[asset.slice(2)] ? 'packs/' + PACK.pixel[asset.slice(2)] : `px/${asset.slice(2)}.png` }; // an art pack can replace any pixel sprite
  if (asset.startsWith('s:')) {
    const slug = asset.slice(2),
      it = LEGACY_SPRITES.get(slug);
    return PACK.sprites[slug] ? { img: 'packs/' + PACK.sprites[slug] } : { glyph: it ? it.glyph : '❓' };
  }
  return { glyph: asset.slice(2) };
}
/* ---------- the pictures of a thing: as drawn, from the other side, used, and both ---------- */
const VIEW_FILE = { side: '.side', used: '.used', sideUsed: '.side.used' };
/**
 * Every picture of a thing, whatever kind of asset it is:
 *   { base, pics: { '': { url, w }, side, used, sideUsed } }
 * base says which way the main picture looks ('front' or 'side'); w is the width in doll pixels where the catalog
 * knows it (library sprites). Null for something that is not a picture (an emoji of the first library).
 */
export function picturesOf(code, asset) {
  const main = spriteView(code, asset).img;
  if (!main) return null;
  const lib = pixelInfo(asset),
    pics = { '': { url: main, w: lib.w } };
  let base = lib.base || 'front';
  if (asset.startsWith('p:') && !main.startsWith('packs/'))
    for (const [k, size] of Object.entries(lib.v || {})) pics[k] = { url: main.replace(/\.png$/, VIEW_FILE[k] + '.png'), w: size[0] };
  else if (asset.startsWith('c:')) {
    const mine = CUSTOM.get(asset.slice(2)) || { v: {} };
    for (const [k, id] of Object.entries(mine.v)) if (id) pics[k] = { url: assetUrl(code, 'c:' + id) };
    base = mine.base || 'front';
  } else if (asset.startsWith('own:')) {
    const o = OWN.get(asset.slice(4)) || { pics: {} };
    for (const [k, url] of Object.entries(o.pics)) if (k && url) pics[k] = { url };
    base = o.base || 'front';
  }
  return { base, pics };
}
/** The one picture to show: seen from the other side and/or used if such a picture exists, else the nearest that does. */
export function pictureOf(code, asset, view, used) {
  const all = picturesOf(code, asset);
  if (!all) return null;
  const want = view === 'side' ? (used ? 'sideUsed' : 'side') : used ? 'used' : '';
  return all.pics[want] || (want === 'sideUsed' && all.pics.side) || all.pics[''];
}
/** Short text for an asset, for sentences like "reaches for 🔑". */
export function assetLabel(asset, name) {
  if (asset.startsWith('d:')) return name || 'the figure';
  const v = spriteView('', asset);
  if (v.glyph) return v.glyph;
  const it = asset.startsWith('s:') ? LEGACY_SPRITES.get(asset.slice(2)) : asset.startsWith('p:') ? PX.get(asset.slice(2)) : null;
  return name || (it ? 'the ' + it.name.split(' ').slice(0, 3).join(' ') : 'it');
}
/** Catalog facts about a pixel sprite: { kind: 'floor'|'wall' } for tiles, { solid } for props. */
export function pixelInfo(asset) {
  return (asset.startsWith('p:') && PX.get(asset.slice(2))) || {};
}
/** A plain name for a pixel sprite, good enough to show the Player: 'p:old-oak-chest' -> 'Old oak chest'. */
export function spriteTitle(asset) {
  const words = asset.replace(/^[a-z]:/, '').replace(/-/g, ' ');
  return words ? words[0].toUpperCase() + words.slice(1) : 'Thing';
}
export function assetName(asset) {
  const it = asset.startsWith('s:') ? LEGACY_SPRITES.get(asset.slice(2)) : asset.startsWith('p:') ? PX.get(asset.slice(2)) : null;
  return it ? it.name.split(' ').slice(0, 2).join(' ') : '';
}

export function backdropCss(code, id) {
  if (id && id.startsWith('c:')) return `url("${assetUrl(code, id)}") center/cover no-repeat #000`;
  if (id && PACK.backdrops[id.slice(2)]) return `url("packs/${PACK.backdrops[id.slice(2)]}") center/cover no-repeat #000`;
  return (BACKDROPS.find((b) => b.id === id) || BACKDROPS[0]).css;
}
