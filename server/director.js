/* Things only the Director may ask for: "Tell Claude", the scenes on the map, a random place, custom art. */
import * as directorAI from './director-ai.js';
import { MAX_ASSET_BYTES, MAX_ASSETS, ASSET_MIME, MAX_AI_CALLS } from './config.js';
import { uid, str, fail, num, r3, arr } from './util.js';
import { broadcast, touch } from './rooms.js';
import { cleanScene } from './scene.js';
import { newScene } from '../public/shared/scene-model.js';
import { directorOnly } from './turns.js';
import { randomPlace } from './bots.js';
import { generateAsset } from './providers.js';

function storeAsset(room, kind, name, mime, data, link) {
  if (!ASSET_MIME.test(mime)) throw fail(400, 'Unsupported image type');
  if (!Buffer.isBuffer(data) || !data.length || data.length > MAX_ASSET_BYTES) throw fail(413, 'Image is too large');
  if (room.assets.length >= MAX_ASSETS) throw fail(409, 'This story already has the maximum number of custom assets');
  const asset = {
    id: uid(),
    kind: kind === 'backdrop' ? 'backdrop' : 'sprite',
    name: str(name, 40) || 'custom',
    mime,
    data: data.toString('base64'),
  };
  /* another picture of a thing already here: its side view, its used state, or both (see the sprite editor) */
  const base = link && room.assets.find((a) => a.id === link.of && a.kind === 'sprite' && !a.part);
  if (base && ['side', 'used', 'sideUsed'].includes(link.view)) {
    asset.part = true;
    const old = base.views && base.views[link.view];
    if (old) room.assets = room.assets.filter((a) => a.id !== old); // drawn again: the earlier picture goes
    base.views = { ...(base.views || {}), [link.view]: asset.id };
  }
  if (link && link.base === 'side') asset.base = 'side'; // the main picture is the side view
  room.assets.push(asset);
  touch(room);
  broadcast(room);
  return { id: asset.id, kind: asset.kind, name: asset.name };
}
export async function actClaude(room, body, who) {
  // "tell Claude what happens": returns a new draft scene, commits nothing
  directorOnly(who);
  const text = str(body.text, 600);
  if (!text) throw fail(400, 'Describe what should happen first');
  if ((room.aiCalls || 0) >= MAX_AI_CALLS) throw fail(429, 'This story has used up its Claude requests');
  if (room.aiBusy) throw fail(429, 'Claude is still working on your last request');
  const raw = body.scene && typeof body.scene === 'object' ? body.scene : {};
  const scene = cleanScene(raw, room.scene);
  const said = { said: str(raw.said, 160), action: str(raw.action, 300), target: raw.target, use: raw.use, roll: room.scene.roll };
  room.aiBusy = true;
  try {
    const out = await directorAI.interpret(directorAI.describe({ text, scene, raw: said, rules: room.rules, names: room.names }));
    room.aiCalls = (room.aiCalls || 0) + 1;
    touch(room);
    return { ok: true, note: str(out && out.note, 300), scene: cleanScene(directorAI.applyOps(scene, out && out.ops, room.rules), room.scene) };
  } finally {
    room.aiBusy = false;
  }
}
export async function actSaveScenes(room, body, who) {
  // the Director's prepared scenes (the scene workshop)
  directorOnly(who);
  const seen = new Set();
  room.scenes = arr(body.scenes)
    .slice(0, 40)
    .filter((x) => x && typeof x === 'object' && x.scene && typeof x.scene === 'object')
    .map((x) => {
      let id = str(x.id, 24) || uid();
      if (seen.has(id)) id = uid();
      seen.add(id);
      return {
        id,
        name: str(x.name, 40) || 'Untitled scene',
        mx: r3(num(x.mx, 0, 1, 0.5)),
        my: r3(num(x.my, 0, 1, 0.5)),
        scene: cleanScene(x.scene, newScene(), true),
      };
    });
  touch(room);
  broadcast(room);
  return { ok: true };
}
export async function actRandomScene(room, body, who) {
  directorOnly(who);
  return { ok: true, place: randomPlace() };
}
export async function actAddAsset(room, body, who) {
  directorOnly(who);
  const m = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(typeof body.dataUrl === 'string' ? body.dataUrl : '');
  if (!m) throw fail(400, 'Please pick a PNG, JPEG or WebP image');
  return {
    ok: true,
    asset: storeAsset(room, body.kind, body.name, m[1], Buffer.from(m[2], 'base64'), { of: body.of, view: body.view, base: body.base }),
  };
}
export async function actGenerate(room, body, who) {
  directorOnly(who);
  const prompt = str(body.prompt, 200);
  if (!prompt) throw fail(400, 'Describe what you want first');
  const kind = body.kind === 'backdrop' ? 'backdrop' : 'sprite';
  const out = await generateAsset({ kind, prompt });
  return { ok: true, asset: storeAsset(room, kind, out.name || prompt, out.mime, out.data) };
}
