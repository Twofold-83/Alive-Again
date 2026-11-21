/*
 * "Tell Claude what happens": the Director describes a turn in plain words and
 * Claude turns it into stage operations, which applyOps() below carries out on
 * the Director's draft scene. Nothing is committed: the Director still reviews
 * the result and ends the turn themselves.
 *
 * Needs ANTHROPIC_API_KEY on the server (and `npm install`). Optional:
 *   CLAUDE_MODEL       model id (default claude-opus-5-5)
 *   DIRECTOR_AI        path to a module exporting `interpret(input)` to replace
 *                      the Claude call altogether (used by the tests)
 */
import { BACKDROPS as CATALOG_BACKDROPS } from '../public/core/catalog.js';
import { MOODS as MOOD_LIST, SFX as SFX_LIST } from '../public/shared/sounds.js';
import { WEATHER as WEATHER_LIST, BURSTS as BURST_LIST, FX as FX_LIST } from '../public/shared/options.js';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url); // plug-in modules and optional libraries are loaded on demand

const MODEL = process.env.CLAUDE_MODEL || 'claude-opus-5-5';
function fail(status, message) {
  return Object.assign(new Error(message), { status });
}
function uid() {
  return crypto.randomBytes(4).toString('hex');
}
function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}
function fin(v) {
  return typeof v === 'number' && Number.isFinite(v);
}

/* What Claude may pick from: the very lists the Director's own menus use. */
const BACKDROPS = CATALOG_BACKDROPS.map((b) => b.id.slice(2));
const MOODS = MOOD_LIST.map((m) => m.id.slice(2));
const SFX = SFX_LIST.map((s) => s[0]);
const WEATHER = WEATHER_LIST.map((w) => w[0]);
const BURSTS = BURST_LIST.map((b) => b[0]);
const FX = FX_LIST.map((f) => f[0]);

const SYSTEM = `You are the stage hand in Twofold, a storytelling game for two people. One person is the Player and controls only the hero. The other is the Director and controls everything else on a small 2D stage: the cast, the backdrop, the music, what characters say, and the narration. The Director has just described, in their own words, what should happen in their turn. Your job is to turn that description into a short list of stage operations. The Director will see the result on the stage, can still adjust it, and decides when the turn ends.

You receive JSON with the Director's request, the current scene, and what the Player did on their last turn. Stay faithful to what the Director asked for: carry out their idea, fill in sensible staging details they left open (where things stand, a fitting sound or mood), and do not add plot of your own beyond that. The hero belongs to the Player, so do not put words in the hero's mouth or move or remove the hero unless the Director explicitly asks.

The stage:
- Positions are fractions of the stage: x from 0 (left) to 1 (right), y from 0 (top) to 1 (bottom). A character's x,y is where its feet are. The ground is roughly y 0.6 to 0.95; things in the sky go higher. Keep things at least 0.12 apart so they do not overlap, and keep x between 0.06 and 0.94.
- scale 1 is a person; a house or tree is 2 to 2.5; a small object is 0.6 to 0.8.
- Everything on stage is a small pixel-art sprite. In "look", name the thing in one to three plain English words (for example "old man", "wooden door", "candle", "black cat"); the game picks the closest sprite it has.
- Speech bubbles are short: one or two sentences, under 120 characters. Narration is one or two sentences, under 200 characters.

Operations (each is one object in "ops", carried out in order):
- add: put something new on stage. Fields: look (a few plain words), x, y, and optionally scale, say, emote, fx, flip, ref. Give it a short "ref" name if a later operation needs to refer to it.
- edit: change something already there. Fields: id (from the scene) or ref, plus any of look, x, y, scale, rot (degrees), flip, say, emote, fx. Use say "" to clear a line.
- move: animate something along a path so the Player watches it happen. Fields: id or ref, path (a list of [x, y] points it passes through, ending where it stops), seconds (how long, 0.4 to 4). Use this for walking, running in, flying past, fleeing. All moves in one turn share 10 seconds and play one after another.
- remove: take something off the stage. Fields: id or ref.
- scene: change one setting. Fields: key and value. Keys and their allowed values:
  backdrop: ${BACKDROPS.join(', ')}
  mood (music): ${MOODS.join(', ')}
  weather: ${WEATHER.filter(Boolean).join(', ')}, or "" for clear
  burst (a one-off moment as the turn plays): ${BURSTS.filter(Boolean).join(', ')}
  sfx (a one-off sound): ${SFX.filter(Boolean).join(', ')}
  card (a title card shown first, a few words, e.g. "Chapter 2")
  narration (the narrator's text)
  choices (up to three short options offered to the Player, separated by "|")
- give: move a thing from the stage into the Player's inventory. Fields: id or ref. Only when the story uses an inventory.
- stat: change one of the Player's stats. Fields: key (the stat's name as shown in the scene) and delta (e.g. -1). Only when the story uses stats.
Looping effects for "fx": ${FX.filter(Boolean).join(', ')} ("ghost" is see-through, "dark" is a silhouette). "emote" is one emoji shown small above a character.

Also return "note": one short sentence, addressed to the Director, saying what you staged. If the request cannot be staged at all, return no operations and say why in the note.`;

let custom = null;
if (process.env.DIRECTOR_AI) custom = require(path.resolve(process.env.DIRECTOR_AI));
function available() {
  return !!(custom || process.env.ANTHROPIC_API_KEY);
}

let lazy = null;
function sdk() {
  if (lazy) return lazy;
  let Anthropic, zod, helper;
  try {
    Anthropic = require('@anthropic-ai/sdk').default;
    zod = require('zod').z;
    helper = require('@anthropic-ai/sdk/helpers/beta/zod');
  } catch {
    throw fail(503, 'The server is missing the Claude library. Run "npm install" and restart.');
  }
  const z = zod;
  const Op = z.object({
    op: z.enum(['add', 'edit', 'move', 'remove', 'scene', 'give', 'stat']),
    id: z.string().optional(),
    ref: z.string().optional(),
    look: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    scale: z.number().optional(),
    rot: z.number().optional(),
    flip: z.boolean().optional(),
    say: z.string().optional(),
    emote: z.string().optional(),
    fx: z.string().optional(),
    path: z.array(z.array(z.number())).optional(),
    seconds: z.number().optional(),
    key: z.string().optional(),
    value: z.string().optional(),
    delta: z.number().optional(),
  });
  lazy = {
    Anthropic,
    client: new Anthropic({ timeout: 90_000, maxRetries: 1 }), // reads ANTHROPIC_API_KEY from the environment
    format: helper.betaZodOutputFormat(z.object({ note: z.string(), ops: z.array(Op) })),
  };
  return lazy;
}

/** Ask Claude (or the DIRECTOR_AI replacement) for { note, ops }. */
async function interpret(input) {
  if (custom) return custom.interpret(input);
  if (!process.env.ANTHROPIC_API_KEY) throw fail(503, 'Claude is not connected yet. Whoever hosts the game needs to add an Anthropic API key.');
  const { Anthropic, client, format } = sdk();
  try {
    const res = await client.beta.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default', // if the model declines for policy reasons, the API retries on its default substitute
      system: SYSTEM,
      output_config: { effort: 'low', format }, // a quick, mechanical translation: favour speed
      messages: [{ role: 'user', content: JSON.stringify(input) }],
    });
    if (res.stop_reason === 'refusal') throw fail(422, 'Claude declined to stage that. Try describing it differently.');
    if (res.stop_reason === 'max_tokens' || !res.parsed_output) throw fail(502, 'Claude’s answer could not be read. Please try again.');
    return res.parsed_output;
  } catch (e) {
    if (e.status && !(e instanceof Anthropic.APIError)) throw e;
    if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError)
      throw fail(503, 'The Anthropic API key on the server was not accepted.');
    if (e instanceof Anthropic.RateLimitError) throw fail(429, 'Claude is busy right now. Try again in a moment.');
    if (e instanceof Anthropic.APIConnectionError) throw fail(504, 'Could not reach Claude. Try again in a moment.');
    if (e instanceof Anthropic.APIError) {
      console.error('Claude API error', e.status, e.message);
      throw fail(502, 'Claude could not handle that request. Please try again.');
    }
    throw e;
  }
}

/* Claude names a thing in words; the pixel-art library has names too. Pick the sprite whose name fits best. */
let library = null;
function spriteFor(words) {
  if (!library) {
    try {
      const index = JSON.parse(fs.readFileSync(new URL('../public/px/index.json', import.meta.url), 'utf8'));
      library = index.categories
        .filter((c) => c.group !== 'tile' && !c.legacy)
        .flatMap((c) => c.items.map((i) => ({ slug: i.slug, words: new Set(`${i.slug.replace(/-/g, ' ')} ${i.name}`.split(/\s+/)) })));
    } catch {
      library = [];
    }
  }
  const want = words
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6);
  const exact = library.find((i) => i.slug === want.join('-'));
  if (exact) return 'p:' + exact.slug;
  let best = null,
    score = 0;
  for (const item of library) {
    let n = 0;
    for (const w of want) if (item.words.has(w) || item.words.has(w.replace(/s$/, ''))) n += item.slug.split('-').includes(w) ? 2 : 1;
    if (n > score || (n === score && n > 0 && item.slug.length < best.slug.length)) {
      best = item;
      score = n;
    }
  }
  return 'p:' + (best ? best.slug : 'question');
}

/** What Claude gets to see: a compact description of the draft scene. */
function describe({ text, scene, raw, rules, names }) {
  const looks = (asset) => (asset.startsWith('e:') ? asset.slice(2) : /^[sp]:/.test(asset) ? asset.slice(2).replace(/-/g, ' ') : 'a custom picture');
  const hero = scene.entities.find((e) => e.id === scene.heroId);
  const reached = scene.entities.find((e) => e.id === raw.target),
    used = scene.sheet.inv.find((i) => i.id === raw.use);
  return {
    director_request: text,
    story: { uses_inventory: !!rules.modules.inventory, uses_stats: !!rules.modules.stats, director: names.director, player: names.player },
    scene: {
      backdrop: scene.backdrop.replace(/^b:/, ''),
      mood: scene.mood.replace(/^m:/, ''),
      weather: scene.weather,
      narration: scene.narration,
      on_stage: scene.entities.map((e) => ({
        id: e.id,
        looks: looks(e.asset),
        x: e.x,
        y: e.y,
        scale: e.scale,
        says: e.say || undefined,
        is_the_hero: e.id === scene.heroId || undefined,
      })),
      inventory: rules.modules.inventory ? scene.sheet.inv.map((i) => looks(i.asset)) : undefined,
      stats: rules.modules.stats ? scene.sheet.stats.map((s) => ({ name: s.name, value: s.value, max: s.max })) : undefined,
    },
    player_last_turn: {
      said: raw.said || (hero ? hero.say : ''),
      did: raw.action || '',
      reached_for: reached ? looks(reached.asset) : undefined,
      used: used ? looks(used.asset) : undefined,
      rolled: raw.roll && raw.roll.by === 'player' ? raw.roll.value : undefined,
    },
  };
}

/** Carry out operations on a scene (already sanitised; the result is sanitised again by the caller). */
function applyOps(scene, ops, rules) {
  const refs = new Map();
  const find = (op) =>
    scene.entities.find((e) => e.id === op.id) || scene.entities.find((e) => e.id === refs.get(op.ref) || e.id === refs.get(op.id));
  const tweak = (e, op) => {
    if (typeof op.look === 'string' && op.look.trim()) e.asset = spriteFor(op.look);
    if (fin(op.x)) e.x = clamp(op.x, 0, 1);
    if (fin(op.y)) e.y = clamp(op.y, 0.08, 1);
    if (fin(op.scale)) e.scale = clamp(op.scale, 0.3, 6);
    if (fin(op.rot)) e.rot = Math.round(op.rot) % 360;
    if (typeof op.flip === 'boolean') e.flip = op.flip;
    if (typeof op.say === 'string') e.say = op.say;
    if (typeof op.emote === 'string') e.emote = op.emote;
    if (typeof op.fx === 'string' && FX.includes(op.fx)) e.fx = op.fx;
  };
  let clock = Math.max(0, ...scene.tracks.map((t) => t.pts[t.pts.length - 3]));
  for (const op of Array.isArray(ops) ? ops.slice(0, 40) : []) {
    if (!op || typeof op !== 'object') continue;
    if (op.op === 'add') {
      if (typeof op.look !== 'string' || !op.look.trim() || scene.entities.length >= 80) continue;
      const e = { id: 'ai-' + uid(), asset: '', x: 0.5, y: 0.8, scale: 1, flip: false, rot: 0, say: '', fx: '', emote: '' };
      tweak(e, op);
      scene.entities.push(e);
      if (op.ref) refs.set(op.ref, e.id);
    } else if (op.op === 'edit') {
      const e = find(op);
      if (e) {
        const moved = (fin(op.x) && op.x !== e.x) || (fin(op.y) && op.y !== e.y);
        tweak(e, op);
        if (moved) scene.tracks = scene.tracks.filter((t) => t.id !== e.id);
      }
    } else if (op.op === 'move') {
      const e = find(op);
      const pts = Array.isArray(op.path) ? op.path.filter((p) => Array.isArray(p) && fin(p[0]) && fin(p[1])).slice(0, 40) : [];
      if (!e || !pts.length || clock >= 10000) continue;
      const total = clamp(fin(op.seconds) ? op.seconds : 1.2, 0.3, 6) * 1000,
        flat = [Math.round(clock), e.x, e.y];
      pts.forEach((p, i) => flat.push(Math.min(10000, Math.round(clock + (total * (i + 1)) / pts.length)), clamp(p[0], 0, 1), clamp(p[1], 0.08, 1)));
      const old = scene.tracks.find((t) => t.id === e.id);
      if (old) old.pts.push(...flat);
      else scene.tracks.push({ id: e.id, pts: flat });
      e.x = flat[flat.length - 2];
      e.y = flat[flat.length - 1];
      clock = flat[flat.length - 3];
    } else if (op.op === 'remove') {
      const e = find(op);
      if (e && e.id !== scene.heroId) {
        scene.entities = scene.entities.filter((x) => x !== e);
        scene.tracks = scene.tracks.filter((t) => t.id !== e.id);
      }
    } else if (op.op === 'scene' && typeof op.key === 'string' && typeof op.value === 'string') {
      const v = op.value.trim();
      if (op.key === 'backdrop' && BACKDROPS.includes(v.replace(/^b:/, ''))) scene.backdrop = 'b:' + v.replace(/^b:/, '');
      else if (op.key === 'mood' && MOODS.includes(v.replace(/^m:/, ''))) scene.mood = 'm:' + v.replace(/^m:/, '');
      else if (op.key === 'weather' && WEATHER.includes(v)) scene.weather = v;
      else if (op.key === 'burst' && BURSTS.includes(v)) scene.burst = v;
      else if (op.key === 'sfx' && SFX.includes(v)) scene.sfx = v;
      else if (op.key === 'card') scene.card = v;
      else if (op.key === 'narration') scene.narration = v;
      else if (op.key === 'choices')
        scene.choices = v
          .split('|')
          .map((c) => c.trim())
          .filter(Boolean)
          .slice(0, 3);
    } else if (op.op === 'give' && rules.modules.inventory) {
      const e = find(op);
      if (e && e.id !== scene.heroId && scene.sheet.inv.length < 24) {
        scene.sheet.inv.push({ id: uid(), asset: e.asset, name: '' });
        scene.entities = scene.entities.filter((x) => x !== e);
        scene.tracks = scene.tracks.filter((t) => t.id !== e.id);
      }
    } else if (op.op === 'stat' && rules.modules.stats && typeof op.key === 'string' && fin(op.delta)) {
      const k = op.key.toLowerCase().replace(/[^a-z0-9]/g, '');
      const st =
        k &&
        scene.sheet.stats.find((s) =>
          s.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .includes(k),
        );
      if (st) st.value = clamp(Math.round(st.value + op.delta), -9999, st.max ?? 9999);
    }
  }
  return scene;
}

export { interpret, describe, applyOps, available };
