/* Rooms in one click and the ready-made places: every sprite they name exists, every room is a valid level, every prop stands on floor. */
import assert from 'node:assert';
import fs from 'node:fs';
import { ROOM_THEMES, ROOM_SHAPES, buildRoom, roomScene, roomArea } from '../public/shared/rooms.js';
import { newScene, walkable, LEVEL_W, LEVEL_H } from '../public/shared/scene-model.js';
import { SCENARIOS } from '../public/build/scenarios.js';
import { MOODS } from '../public/shared/sounds.js';

const sprite = (s) => assert(fs.existsSync(`public/px/${s}.png`), 'sprite ' + s);
for (const t of ROOM_THEMES) {
  for (const s of [t.top, t.wall, t.floor, ...t.deco, ...t.more]) sprite(s);
  assert(
    MOODS.some((m) => m.id === t.mood),
    'music ' + t.mood,
  );
  for (const sh of ROOM_SHAPES) {
    const level = buildRoom(t.id, sh.id);
    assert.match(level.cells, /^[0-9a-z]{192}$/);
    assert(level.pal.length <= 35);
    const sc = roomScene(newScene(), t.id, sh.id),
      hero = sc.entities[0],
      a = roomArea(sh.id);
    assert(walkable(sc, hero.x, hero.y), `${t.id}/${sh.id}: the hero starts on the floor`);
    assert(walkable(sc, a.x0, a.y0) && walkable(sc, a.x1, a.y1), 'the corners of the floor can be walked on');
    assert(!walkable(sc, 0.5, 0.02) || t.outdoor === undefined || sh.id === 'corridor', 'there is a wall at the back');
  }
}
for (const sc of SCENARIOS) {
  const keys = new Set(sc.rooms.map((r) => r[0]));
  assert.equal(keys.size, sc.rooms.length);
  for (const [, name, theme, shape, at, props] of sc.rooms) {
    assert(name && ROOM_THEMES.some((t) => t.id === theme) && at.length === 2);
    const f = ROOM_SHAPES.find((s) => s.id === shape).floor;
    for (const [slug, cx, cy, title, verbs] of props) {
      sprite(slug);
      assert(cx >= f[0] && cx <= f[2] && cy >= f[1] && cy <= f[3], `${sc.id}: ${slug} stands on the floor`);
      assert(title && verbs.length && cx < LEVEL_W && cy < LEVEL_H);
    }
  }
  for (const [a, b] of sc.links) assert(keys.has(a) && keys.has(b));
}
/* paper-doll parts: 500 of them, every one a file */
const dolls = JSON.parse(fs.readFileSync('public/doll/index.json', 'utf8'));
const parts = [...dolls.heads, ...dolls.torsos, ...dolls.arms, ...dolls.legs];
assert.equal(parts.length, 500); assert.equal(new Set(parts.map((x) => x.id)).size, 500);
for (const part of parts) assert(fs.existsSync(`public/doll/${part.id}.png`) && part.name, part.id);
for (const m of MOODS) if (m.seq) assert(m.seq.some((n) => n != null) && m.seq.length % 16 === 0, m.id);
console.log(`ROOMS OK (${ROOM_THEMES.length} themes, ${SCENARIOS.length} places, ${MOODS.length - 1} tunes)`);
