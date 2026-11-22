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
assert.equal(parts.length, 500);
assert.equal(new Set(parts.map((x) => x.id)).size, 500);
for (const part of parts) assert(fs.existsSync(`public/doll/${part.id}.png`) && part.name, part.id);
for (const m of MOODS) if (m.seq) assert(m.seq.some((n) => n != null) && m.seq.length % 16 === 0, m.id);
/* battle rules: a round with enemies that fight on their own */
{
  const { resolveBattle, cleanBattle, heroHealth } = await import('../public/shared/battle.js');
  const { newScene, newEntity } = await import('../public/shared/scene-model.js');
  const sc = newScene();
  sc.entities.push(
    newEntity('p:ghoul', { id: 'g', hp: 6, maxHp: 6 }),
    newEntity('p:dagger-ritual', { id: 'w', tie: { to: 'hero', dx: 0, dy: 0, front: true } }),
  );
  sc.sheet.inv.push({ id: 'i1', asset: 'p:potion-poison', name: 'Healing potion' });
  sc.battle = cleanBattle({ round: 1, auto: true, cmds: ['attack', 'item', 'escape'], atk: 2, foeAtk: 2, flee: 100 });
  assert.deepEqual(sc.battle.cmds, ['attack', 'item', 'escape']);
  const names = { player: 'Hero', director: 'D' },
    label = () => 'ghoul';
  const lines = resolveBattle(sc, { move: 'attack', id: 'g' }, names, label, () => 0.5);
  assert.equal(sc.entities.find((e) => e.id === 'g').hp, 6 - (2 + 2 + 1), 'strength, the tied weapon and the roll');
  assert.equal(heroHealth(sc).get(), 8 - 3, 'the ghoul struck back');
  assert(lines.length === 2 && sc.battle.round === 2);
  assert.equal(sc.steps.length, 1, 'the hero’s blow is a picture of its own, before the enemy answers');
  assert.equal(sc.steps[0].floats[0].id, 'g');
  assert.deepEqual(
    sc.floats.map((f) => f.id),
    ['hero'],
    'then the enemy’s blow lands on the hero',
  );
  sc.steps = [];
  resolveBattle(sc, { move: 'item', item: 'i1' }, names, label, () => 0.5);
  assert.equal(sc.sheet.inv.length, 0, 'the potion is used up');
  resolveBattle(sc, { move: 'attack', id: 'g' }, names, label, () => 0.5);
  assert.equal(sc.battle.over, 'won');
  sc.entities.find((e) => e.id === 'g').hp = 5;
  sc.entities.find((e) => e.id === 'g').temp = false;
  sc.battle.over = '';
  resolveBattle(sc, { move: 'escape' }, names, label, () => 0.5);
  assert.equal(sc.battle.over, 'fled');
}
/* every hand-drawn view named in the index is a file */
{
  const fs = await import('node:fs');
  const ix = JSON.parse(fs.readFileSync(new URL('../public/px/index.json', import.meta.url), 'utf8'));
  const file = { side: '.side', used: '.used', sideUsed: '.side.used' };
  let n = 0;
  for (const c of ix.categories)
    for (const i of c.items)
      for (const k of Object.keys(i.v || {})) {
        assert(fs.existsSync(new URL(`../public/px/${i.slug}${file[k]}.png`, import.meta.url)), `${i.slug} ${k}`);
        n++;
      }
  assert(n > 1000, 'the views are built');
}
console.log(`ROOMS OK (${ROOM_THEMES.length} themes, ${SCENARIOS.length} places, ${MOODS.length - 1} tunes)`);
