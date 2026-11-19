/*
 * Asset generation pipeline.
 *
 * The Director can type a description and get a new sprite or backdrop. The game
 * only knows this contract:
 *
 *     generate({ kind: 'sprite' | 'backdrop', prompt: string })
 *        -> Promise<{ mime: string, data: Buffer, name?: string } | null>
 *
 * mime must be image/png, image/jpeg, image/webp or image/svg+xml (max ~400 KB).
 * Sprites should have a transparent background; backdrops should be 4:3.
 *
 * To plug in an AI image model, write a module that exports `generate` with that
 * signature and start the server with  ASSET_PROVIDER=./my-provider.js
 * Returning null (or not setting the variable) falls back to the built-in
 * procedural generator below, which needs no network and no API key.
 */
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);   // plug-in modules and optional libraries are loaded on demand

let custom = null;
if (process.env.ASSET_PROVIDER) {
  const mod = require(path.resolve(process.env.ASSET_PROVIDER));
  custom = typeof mod === 'function' ? mod : mod.generate;
}

async function generateAsset(req) {
  if (custom) {
    const out = await custom(req);
    if (out && out.data) return out;
  }
  return req.kind === 'backdrop' ? proceduralBackdrop(req.prompt) : proceduralSprite(req.prompt);
}

/* ---------- built-in procedural fallback ---------- */
function rng(seedText) {
  let a = crypto.createHash('sha1').update(seedText.toLowerCase()).digest().readUInt32LE(0);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const HUES = { red: 0, fire: 12, orange: 28, gold: 46, yellow: 54, sand: 40, desert: 38, green: 120, forest: 130, grass: 105, slime: 95, teal: 170, ice: 190, snow: 200, water: 210, sea: 205, blue: 222, sky: 205, purple: 275, magic: 285, pink: 325, rose: 340 };
function hueFor(prompt, r) {
  for (const w of prompt.toLowerCase().split(/[^a-z]+/)) if (w in HUES) return HUES[w];
  return Math.floor(r() * 360);
}
const svg = (body, w, h, extra = '') => ({
  mime: 'image/svg+xml',
  data: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" ${extra}>${body}</svg>`),
});

function proceduralSprite(prompt) {
  const r = rng('sprite:' + prompt);
  const hue = hueFor(prompt, r);
  const body = `hsl(${hue} 60% 48%)`, shade = `hsl(${hue} 60% 34%)`, head = `hsl(${(hue + 25) % 360} 55% 68%)`, accent = `hsl(${(hue + 180) % 360} 70% 60%)`;
  const W = 10, H = 12, cells = [];
  const put = (x, y, c) => { cells.push([x, y, c]); if (x !== W - 1 - x) cells.push([W - 1 - x, y, c]); };
  const headW = 2 + Math.floor(r() * 2);
  for (let y = 1; y <= 4; y++) for (let x = 5 - headW; x < 5; x++) if (!((y === 1 || y === 4) && x === 5 - headW && r() < 0.7)) put(x, y, head);
  if (r() < 0.5) put(5 - headW, 0, accent); else if (r() < 0.5) for (let x = 5 - headW; x < 5; x++) put(x, 0, shade);
  put(3, 2 + Math.floor(r() * 2), '#1b1b26');
  for (let y = 5; y <= 9; y++) {
    const w = Math.min(5, 2 + Math.floor(r() * 3));
    for (let x = 5 - w; x < 5; x++) put(x, y, x === 5 - w ? shade : r() < 0.12 ? accent : body);
  }
  const leg = 3 + Math.floor(r() * 2);
  put(leg, 10, shade); put(leg, 11, shade);
  if (r() < 0.5) put(leg - 1, 11, shade);
  return { ...svg(cells.map(([x, y, c]) => `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${c}"/>`).join(''), W, H, 'shape-rendering="crispEdges"'), name: prompt };
}

function proceduralBackdrop(prompt) {
  const r = rng('backdrop:' + prompt);
  const hue = hueFor(prompt, r);
  const dark = /night|dark|cave|space|midnight|storm|dungeon|spooky/i.test(prompt);
  const l = dark ? [8, 22, 14, 10] : [62, 84, 46, 36];
  let out = `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${(hue + 200) % 360} 55% ${l[0]}%)"/><stop offset="1" stop-color="hsl(${(hue + 160) % 360} 60% ${l[1]}%)"/></linearGradient></defs><rect width="400" height="300" fill="url(#s)"/>`;
  if (dark) for (let i = 0; i < 40; i++) out += `<circle cx="${(r() * 400).toFixed(0)}" cy="${(r() * 170).toFixed(0)}" r="${(0.5 + r()).toFixed(1)}" fill="#fff" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`;
  out += `<circle cx="${(60 + r() * 280).toFixed(0)}" cy="${(40 + r() * 50).toFixed(0)}" r="22" fill="${dark ? '#e8e8d8' : '#fff3b0'}"/>`;
  for (let layer = 0; layer < 2; layer++) {
    let pts = '0,300 ';
    for (let x = 0; x <= 400; x += 40) pts += `${x},${(150 + layer * 30 + r() * 45).toFixed(0)} `;
    out += `<polygon points="${pts}400,300" fill="hsl(${hue} 35% ${l[2] - layer * 8}%)"/>`;
  }
  out += `<rect y="215" width="400" height="85" fill="hsl(${hue} 40% ${l[3]}%)"/>`;
  return { ...svg(out, 400, 300), name: prompt };
}

export { generateAsset };
