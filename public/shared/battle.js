/*
 * The battle: one simple, classic turn-based fight. Shared by the browser and the server.
 *
 * The Director picks the enemies and how hard it is — nothing else. From then on the fight belongs to the Player:
 * Attack, Defend, Item or Escape, round after round, each carried out at once while both sides watch, until the
 * enemies are beaten, the hero is, or the hero gets away. Only then does the turn go back to the Director — unless
 * the Director pauses the battle to stage something, and then gives it back.
 *
 *   scene.battle = { level, round, atk, hit, foeAtk, foeHit, flee, guard, log, paused }
 *     level    one of BATTLE_LEVELS; it decides every number below
 *     atk      the hero's strength (a thing tied to the hero is a weapon and adds WEAPON)
 *     hit      the hero's chance to hit, in percent        foeAtk, foeHit   the same for an enemy
 *     flee     the chance that Escape works
 *     guard    the hero defended last round                 paused           the Director has stepped in
 */
export const BATTLE_LEVELS = [
  // id, label, how much of the hero's health the fight should cost, hero's hit %, escape %, rounds an enemy lasts
  ['veryeasy', 'Very easy', 0.15, 95, 90, 1.5],
  ['easy', 'Easy', 0.35, 90, 75, 2],
  ['medium', 'Medium', 0.6, 85, 60, 2.5],
  ['hard', 'Hard', 0.85, 80, 40, 3],
  ['veryhard', 'Very hard', 1.15, 75, 25, 4],
  ['impossible', 'Basically impossible', 1.9, 65, 10, 5],
];
export const BATTLE_CMDS = [
  ['attack', 'Attack'],
  ['defend', 'Defend'],
  ['item', 'Item'],
  ['escape', 'Escape'],
];
export const WEAPON = 2;
const HERO_ATK = 2,
  HERO_HEALTH = 10;
const HEALS = /potion|bandage|medicine|food|bread|apple|laudanum|pill|herb|elixir|water|wine|tea|soup|heal|meat|cheese|bottle/i;

export const livingFoes = (scene) => scene.entities.filter((e) => e.hp != null && e.hp > 0 && e.id !== scene.heroId && !e.temp);
export const weaponOf = (scene) => scene.entities.find((e) => e.tie && e.tie.to === scene.heroId);
export const itemHeals = (it) => HEALS.test(it.name || '') || HEALS.test(it.asset || '');
const nameOf = (e, label) => (e.active && e.active.name) || label(e);

/** The hero's health lives in a "Health" stat if the story has one, else on the hero. */
export function heroHealth(scene) {
  const stat = scene.sheet.stats.find((s) => /health|hp|life/i.test(s.name)),
    hero = scene.entities.find((e) => e.id === scene.heroId);
  if (stat) return { get: () => stat.value, max: stat.max ?? stat.value, set: (v) => (stat.value = Math.max(0, Math.min(stat.max ?? 9999, v))) };
  if (!hero) return { get: () => 0, max: 0, set() {} };
  if (hero.hp == null) hero.hp = hero.maxHp = HERO_HEALTH;
  return { get: () => hero.hp, max: hero.maxHp, set: (v) => (hero.hp = Math.max(0, Math.min(hero.maxHp, v))) };
}

/** What the hero can expect to lose against n enemies, as a share of the hero's health. */
function cost(o) {
  const blow = (o.hit / 100) * (o.atk + (o.weapon ? WEAPON : 0) + 1) * 1.1,
    foeBlow = (o.foeHit / 100) * (o.foeAtk + 1) * 0.95;
  let damage = 0,
    rounds = 0,
    left = o.foes;
  for (let i = 0; i < o.foes; i++) {
    const r = Math.max(1, Math.ceil(o.foeHp / Math.max(0.2, blow)));
    damage += r * left * foeBlow;
    rounds += r;
    left--;
  }
  return { ratio: o.heroHp > 0 ? damage / o.heroHp : 9, rounds, damage: Math.round(damage) };
}
/**
 * Everything a battle needs, worked out from how hard it should be and who is fighting:
 * plan(level, { heroHp, weapon, foes }) -> { level, atk, hit, flee, foeHp, foeAtk, foeHit, rounds, damage }
 */
export function planBattle(level, who) {
  const L = BATTLE_LEVELS.find((l) => l[0] === level) || BATTLE_LEVELS[2],
    base = { heroHp: who.heroHp || HERO_HEALTH, weapon: !!who.weapon, foes: Math.max(1, who.foes || 1), atk: HERO_ATK, hit: L[3] },
    foeHp = Math.max(2, Math.round((HERO_ATK + (base.weapon ? WEAPON : 0) + 1) * L[5]));
  let best = null;
  for (let foeAtk = 0; foeAtk <= 14; foeAtk++)
    for (const foeHit of [20, 30, 40, 50, 60, 70, 80, 90, 95]) {
      const c = cost({ ...base, foeHp, foeAtk, foeHit }),
        d = Math.abs(c.ratio - L[2]) + Math.abs(foeHit - 75) / 2000;
      if (!best || d < best.d) best = { d, foeAtk, foeHit, ...c };
    }
  return {
    level: L[0],
    atk: HERO_ATK,
    hit: L[3],
    flee: L[4],
    foeHp,
    foeAtk: best.foeAtk,
    foeHit: best.foeHit,
    rounds: best.rounds,
    damage: best.damage,
  };
}

/** Whatever a client sends becomes a complete, valid battle (or none). */
export function cleanBattle(b) {
  if (!b || typeof b !== 'object' || !BATTLE_LEVELS.some((l) => l[0] === b.level)) return null;
  const n = (v, lo, hi, d) => (Number.isFinite(+v) ? Math.min(hi, Math.max(lo, Math.round(+v))) : d);
  return {
    level: b.level,
    round: n(b.round, 1, 999, 1),
    atk: n(b.atk, 1, 20, HERO_ATK),
    hit: n(b.hit, 5, 100, 85),
    foeAtk: n(b.foeAtk, 0, 20, 1),
    foeHit: n(b.foeHit, 5, 100, 75),
    flee: n(b.flee, 0, 100, 50),
    guard: !!b.guard,
    paused: !!b.paused,
    log: (Array.isArray(b.log) ? b.log : []).slice(-8).map((l) => String(l).slice(0, 90)),
  };
}

/**
 * One round: the hero's command, then every enemy still standing strikes back — each as a picture of its own
 * (scene.steps), so the blows are shown one after the other.
 * move = { move: 'attack' | 'defend' | 'item' | 'escape', id (target), item (inventory id) }
 * Changes the scene; returns { lines, over }: over is '' | 'won' | 'lost' | 'fled'.
 */
export function fightRound(scene, move, names, label, rnd = Math.random) {
  const b = scene.battle,
    hero = scene.entities.find((e) => e.id === scene.heroId),
    hp = heroHealth(scene),
    lines = [],
    floats = new Map();
  let over = '';
  const float = (id, n, heal) => floats.set(id, (floats.get(id) || 0) + (heal ? n : -n));
  const showFloats = () => {
    scene.floats = [...floats]
      .filter(([, n]) => n)
      .map(([id, n]) => ({ id, text: (n > 0 ? '+' : '') + n, c: n > 0 ? '#a7d68c' : id === scene.heroId ? '#e0766a' : '#ffffff' }));
    floats.clear();
  };
  const nextStep = () => {
    showFloats();
    const { steps, ...now } = scene;
    scene.steps = [...(steps || []), JSON.parse(JSON.stringify({ ...now, steps: [] }))];
    scene.floats = [];
    scene.sfx = '';
    for (const e of scene.entities) e.once = '';
  };
  const foes = livingFoes(scene),
    target = foes.find((e) => e.id === move.id) || foes[0],
    weapon = weaponOf(scene);
  const hurt = (foe, dmg, how) => {
    foe.hp = Math.max(0, foe.hp - dmg);
    foe.once = 'hit';
    float(foe.id, dmg);
    lines.push(`${names.player} ${how} ${nameOf(foe, label)}: ${dmg}`);
    if (foe.hp === 0) {
      foe.temp = true; // it stays for this round's picture, then it is gone
      foe.fx = 'dark';
      foe.once = 'die';
      lines.push(`${nameOf(foe, label)} is beaten`);
    }
  };
  b.guard = false;
  if (move.move === 'attack' && target) {
    const r = rnd(),
      dmg = Math.max(1, b.atk + (weapon ? WEAPON : 0) + Math.floor(rnd() * 3)) * (r > 0.92 ? 2 : 1);
    if (hero) hero.once = 'lunge';
    if (weapon) weapon.once = 'swing';
    scene.sfx = 'hit';
    if (r < 1 - b.hit / 100) lines.push(`${names.player} misses ${nameOf(target, label)}`);
    else hurt(target, dmg, r > 0.92 ? 'lands a terrible blow on' : weapon ? `strikes with the ${nameOf(weapon, label).toLowerCase()} at` : 'hits');
  } else if (move.move === 'defend') {
    b.guard = true;
    lines.push(`${names.player} defends`);
  } else if (move.move === 'item') {
    const it = scene.sheet.inv.find((i) => i.id === move.item);
    if (!it) lines.push(`${names.player} fumbles for something to use`);
    else {
      scene.sheet.inv = scene.sheet.inv.filter((i) => i !== it);
      const what = it.name || label({ asset: it.asset });
      if (itemHeals(it)) {
        const before = hp.get();
        hp.set(before + Math.max(3, Math.round(hp.max * 0.4)));
        float(scene.heroId, hp.get() - before, true);
        lines.push(`${names.player} uses ${what}: +${hp.get() - before} health`);
      } else if (target) hurt(target, 3 + Math.floor(rnd() * 3), `throws ${what} at`);
    }
  } else if (move.move === 'escape') {
    if (rnd() * 100 < b.flee) {
      over = 'fled';
      lines.push(`${names.player} gets away`);
    } else lines.push(`${names.player} tries to escape — no way out`);
  }
  const left = livingFoes(scene);
  if (!over && !left.length) over = 'won';
  if (!over) {
    for (const foe of left) {
      nextStep(); // the hero's move first, then each enemy in turn
      const who = nameOf(foe, label),
        r = rnd(),
        heavy = r > 0.88; // now and then a heavy blow: double, but it misses more
      if (r < 0.08) {
        lines.push(`${who} hesitates`);
        continue;
      }
      foe.once = 'lunge';
      if (rnd() >= (b.foeHit / 100) * (heavy ? 0.7 : 1)) {
        lines.push(`${who} ${heavy ? 'swings wildly and misses' : 'misses'}`);
        continue;
      }
      let dmg = (b.foeAtk + Math.floor(rnd() * 3)) * (heavy ? 2 : 1);
      if (b.guard) dmg = Math.floor(dmg / 2);
      if (dmg > 0) {
        hp.set(hp.get() - dmg);
        float(scene.heroId, dmg);
        if (hero) hero.once = 'hit';
        scene.sfx = 'hit';
      }
      lines.push(`${who} ${heavy ? 'lands a heavy blow on' : 'hits'} ${names.player}: ${dmg}${b.guard ? ' (defended)' : ''}`);
      if (hp.get() <= 0) {
        over = 'lost';
        break;
      }
    }
  }
  showFloats();
  b.log = [...(b.log || []), ...lines].slice(-8);
  b.round++;
  return { lines, over };
}
