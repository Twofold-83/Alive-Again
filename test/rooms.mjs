/* Rooms in one click and the ready-made places: every sprite they name exists, every room is a valid level, every prop stands on floor. */
import assert from 'node:assert';
import fs from 'node:fs';
import { ROOM_THEMES, ROOM_SHAPES, buildRoom, roomScene, roomArea } from '../public/shared/rooms.js';
import { newScene, walkable, LEVEL_W, LEVEL_H } from '../public/shared/scene-model.js';
import { SCENARIOS } from '../public/build/scenarios.js';
import { MOODS } from '../public/shared/sounds.js';
import { ENVIRONMENTS } from '../public/shared/environments.js';

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
/* every setting names rooms and library categories that exist, and has things of its own */
{
  const cats = new Map(JSON.parse(fs.readFileSync('public/px/index.json', 'utf8')).categories.map((c) => [c.id, c]));
  for (const env of ENVIRONMENTS) {
    for (const r of env.rooms)
      assert(
        ROOM_THEMES.some((t) => t.id === r),
        `${env.id}: room ${r}`,
      );
    for (const c of [...env.cats, ...Object.keys(env.pick || {}), ...Object.keys(env.beings || {})]) assert(cats.has(c), `${env.id}: category ${c}`);
    assert(env.cats.reduce((n, c) => n + cats.get(c).items.length, 0) >= 10, `${env.id} has things`);
  }
  /* large things: a car is three tiles wide, and has its other pictures like everything else */
  const large = [...cats.values()].flatMap((c) => c.items).filter((i) => i.w >= 44 && /\blarge\b/.test(i.name));
  assert(large.length >= 30, `large things: ${large.length}`);
  for (const i of large.slice(0, 40)) assert(i.v && i.v.side && fs.existsSync(`public/px/${i.slug}.side.png`), `${i.slug} seen from the other side`);
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
/* battle rules: the difficulty decides every number; a round is the hero's move and then each enemy's */
{
  const { fightRound, cleanBattle, planBattle, heroHealth, BATTLE_LEVELS } = await import('../public/shared/battle.js');
  const { newScene, newEntity } = await import('../public/shared/scene-model.js');
  const who = { heroHp: 10, weapon: true, foes: 2 };
  const plans = BATTLE_LEVELS.map((l) => planBattle(l[0], who));
  for (let i = 1; i < plans.length; i++) {
    assert(plans[i].damage >= plans[i - 1].damage, 'each level costs the hero at least as much as the one before');
    assert(plans[i].flee < plans[i - 1].flee && plans[i].hit <= plans[i - 1].hit, 'and escaping and hitting get harder');
  }
  assert(plans[0].damage < 4 && plans[5].damage > 12, `very easy barely hurts, basically impossible kills: ${plans.map((x) => x.damage)}`);
  const sc = newScene(),
    plan = planBattle('medium', { heroHp: 10, weapon: true, foes: 1 });
  sc.entities.push(
    newEntity('p:ghoul', { id: 'g', hp: plan.foeHp, maxHp: plan.foeHp }),
    newEntity('p:dagger-ritual', { id: 'w', tie: { to: 'hero', dx: 0, dy: 0, front: true } }),
  );
  sc.sheet.inv.push({ id: 'i1', asset: 'p:potion-poison', name: 'Healing potion' });
  sc.battle = cleanBattle({ ...plan, round: 1 });
  assert.equal(cleanBattle({ round: 1 }), null, 'a battle without a level is no battle');
  const names = { player: 'Hero', director: 'D' },
    label = () => 'ghoul';
  let r = fightRound(sc, { move: 'attack', id: 'g' }, names, label, () => 0.5);
  assert.equal(sc.entities.find((e) => e.id === 'g').hp, plan.foeHp - (2 + 2 + 1), 'strength, the tied weapon and the roll');
  assert.equal(sc.steps.length, 1, 'the hero’s blow is a picture of its own, before the enemy answers');
  assert.equal(sc.steps[0].floats[0].id, 'g');
  assert.equal(r.over, '');
  assert(heroHealth(sc).get() < 10 && sc.battle.round === 2, 'the ghoul struck back');
  sc.steps = [];
  fightRound(sc, { move: 'item', item: 'i1' }, names, label, () => 0.5);
  assert.equal(sc.sheet.inv.length, 0, 'the potion is used up');
  sc.entities.find((e) => e.id === 'g').hp = 1;
  r = fightRound(sc, { move: 'attack', id: 'g' }, names, label, () => 0.5);
  assert.equal(r.over, 'won');
  sc.entities.find((e) => e.id === 'g').hp = 5;
  sc.entities.find((e) => e.id === 'g').temp = false;
  sc.battle.flee = 100;
  assert.equal(fightRound(sc, { move: 'escape' }, names, label, () => 0.5).over, 'fled');
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
/* the base of a thing: where it blocks, and how wide it is when turned */
{
  const { newScene, newEntity, walkable, baseOf, SPRITE_WIDTH } = await import('../public/shared/scene-model.js');
  SPRITE_WIDTH.set('p:bed-test', 36);
  SPRITE_WIDTH.set('p:bed-test|side', 18);
  const sc = newScene(),
    bed = newEntity('p:bed-test', { id: 'b', x: 0.5, y: 0.5, solid: true });
  sc.entities.push(bed);
  assert(!walkable(sc, 0.5, 0.49) && !walkable(sc, 0.57, 0.49), 'the long side blocks over its whole width');
  assert(walkable(sc, 0.5, 0.42), 'but not far behind it');
  bed.view = 'side';
  assert(walkable(sc, 0.57, 0.49), 'turned, it is narrower');
  assert(walkable(sc, 0.5, 0.4), 'and by default only half a tile deep');
  bed.base = { dy: 0, d: 2 };
  assert(!walkable(sc, 0.5, 0.4) && walkable(sc, 0.5, 0.3), 'made two tiles deep it blocks its whole length');
  bed.base = { dy: 0.1, d: 0.5 };
  assert.equal(Math.round(baseOf(bed).y * 100), 60, 'a base line of its own');
}
console.log(`ROOMS OK (${ROOM_THEMES.length} themes, ${ENVIRONMENTS.length} settings, ${SCENARIOS.length} places, ${MOODS.length - 1} tunes)`);
