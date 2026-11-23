/*
 * Battle rules, shared by the browser (which shows what a command will do) and the server (which decides).
 *
 * scene.battle = {
 *   round,
 *   auto      true: enemies fight on their own, each round is settled the moment the Player ends the turn;
 *             false: the Director moves each enemy by hand (and can always step in, either way)
 *   cmds      what the Player may do: attack, defend, item, escape, speak
 *   atk       the hero's strength; a thing tied to the hero is a weapon and adds WEAPON
 *   foeAtk    the enemies' strength
 *   flee      chance in percent that an escape works
 *   guard     the hero defended last round
 *   log       the last lines of what happened
 *   over      '' | 'won' | 'lost' | 'fled'
 * }
 * An older battle is just { round }: everything is done by hand.
 */
export const BATTLE_CMDS = [
  ['attack', 'Attack'],
  ['defend', 'Defend'],
  ['item', 'Item'],
  ['escape', 'Escape'],
  ['speak', 'Speak'],
];
export const WEAPON = 2;
const HEALS = /potion|bandage|medicine|food|bread|apple|laudanum|pill|herb|elixir|water|wine|tea|soup|heal|meat|cheese|bottle/i;

export function cleanBattle(b) {
  if (!b || typeof b !== 'object') return null;
  const n = (v, lo, hi, d) => (Number.isFinite(+v) ? Math.min(hi, Math.max(lo, Math.round(+v))) : d);
  const out = { round: n(b.round, 1, 999, 1) };
  if (typeof b.auto !== 'boolean') return out;
  const cmds = Array.isArray(b.cmds) ? BATTLE_CMDS.map((c) => c[0]).filter((c) => b.cmds.includes(c)) : [];
  const ai = b.ai && typeof b.ai === 'object' ? b.ai : {},
    stop = b.stop && typeof b.stop === 'object' ? b.stop : {};
  return {
    ...out,
    auto: b.auto,
    live: !!b.live && b.auto, // both watch every round as it happens; the turn stays with the Player until something stops it
    cmds: cmds.includes('attack') ? cmds : ['attack', ...cmds],
    atk: n(b.atk, 1, 20, 2),
    foeAtk: n(b.foeAtk, 0, 20, 1),
    hit: n(b.hit, 5, 100, 85), // the hero's chance to hit, in percent
    foeHit: n(b.foeHit, 5, 100, 80), // an enemy's chance to hit
    ai: { attack: n(ai.attack, 0, 100, 70), heavy: n(ai.heavy, 0, 100, 15), defend: n(ai.defend, 0, 100, 10), wait: n(ai.wait, 0, 100, 5) }, // what an enemy does, in percent
    stop: { speak: !!stop.speak, foe: n(stop.foe, 0, 90, 0), hero: n(stop.hero, 0, 90, 0), rounds: n(stop.rounds, 0, 20, 0) }, // when the Director takes over
    told: (Array.isArray(b.told) ? b.told : []).slice(0, 30).map(String),
    paused: String(b.paused || '').slice(0, 80),
    level: String(b.level || '').slice(0, 20),
    flee: n(b.flee, 0, 100, 50),
    guard: !!b.guard,
    shield: (Array.isArray(b.shield) ? b.shield : []).slice(0, 30).map(String),
    log: (Array.isArray(b.log) ? b.log : []).slice(-8).map((l) => String(l).slice(0, 90)),
    over: ['won', 'lost', 'fled'].includes(b.over) ? b.over : '',
  };
}
export const livingFoes = (scene) => scene.entities.filter((e) => e.hp != null && e.hp > 0 && e.id !== scene.heroId && !e.temp);
/** The hero's health lives in a "Health" stat if the story has one, else on the hero. */
export function heroHealth(scene) {
  const stat = scene.sheet.stats.find((s) => /health|hp|life/i.test(s.name)),
    hero = scene.entities.find((e) => e.id === scene.heroId);
  if (stat) return { get: () => stat.value, max: stat.max ?? stat.value, set: (v) => (stat.value = Math.max(0, Math.min(stat.max ?? 9999, v))) };
  if (!hero) return { get: () => 0, max: 0, set() {} };
  if (hero.hp == null) hero.hp = hero.maxHp = 8;
  return { get: () => hero.hp, max: hero.maxHp, set: (v) => (hero.hp = Math.max(0, Math.min(hero.maxHp, v))) };
}
export const weaponOf = (scene) => scene.entities.find((e) => e.tie && e.tie.to === scene.heroId);
const nameOf = (e, label) => (e.active && e.active.name) || label(e);
export const itemHeals = (it) => HEALS.test(it.name || '') || HEALS.test(it.asset || '');

/**
 * Settle one round: the hero's command, then (if the enemies fight on their own) every enemy's blow.
 * ans = { move, id (target), item (inventory id) }.  label(entity) names a thing.  rnd() is 0..1.
 * Changes the scene; returns the lines of what happened.
 */
export function resolveBattle(scene, ans, names, label, rnd = Math.random) {
  const b = scene.battle,
    hero = scene.entities.find((e) => e.id === scene.heroId),
    hp = heroHealth(scene),
    lines = [],
    floats = new Map();
  const float = (id, n, heal) => floats.set(id, (floats.get(id) || 0) + (heal ? n : -n));
  const showFloats = () => {
    scene.floats = [...floats]
      .filter(([, n]) => n)
      .map(([id, n]) => ({ id, text: (n > 0 ? '+' : '') + n, c: n > 0 ? '#a7d68c' : id === scene.heroId ? '#e0766a' : '#ffffff' }));
    floats.clear();
  };
  /** What happened so far becomes a step of its own, so the blows are shown one after the other. */
  const nextStep = () => {
    showFloats();
    const { steps, ...now } = scene;
    scene.steps = [...(steps || []), JSON.parse(JSON.stringify({ ...now, steps: [] }))];
    scene.floats = [];
    scene.sfx = '';
    for (const e of scene.entities) e.once = '';
  };
  const foes = livingFoes(scene),
    target = foes.find((e) => e.id === ans.id) || foes[0],
    weapon = weaponOf(scene);
  const hurtFoe = (foe, dmg, how) => {
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
  if (ans.move === 'attack' && target) {
    const r = rnd(),
      shielded = (b.shield || []).includes(target.id);
    let dmg = Math.max(1, b.atk + (weapon ? WEAPON : 0) + Math.floor(rnd() * 3)) * (r > 0.9 ? 2 : 1);
    if (shielded) dmg = Math.max(1, Math.floor(dmg / 2)); // it was on its guard
    if (hero) hero.once = 'lunge';
    if (weapon) weapon.once = 'swing';
    scene.sfx = scene.sfx || 'hit';
    if (r < 1 - (b.hit ?? 90) / 100) lines.push(`${names.player} misses ${nameOf(target, label)}`);
    else hurtFoe(target, dmg, r > 0.9 ? 'lands a terrible blow on' : weapon ? `strikes with the ${nameOf(weapon, label).toLowerCase()} at` : 'hits');
  } else if (ans.move === 'defend') {
    b.guard = true;
    lines.push(`${names.player} defends`);
  } else if (ans.move === 'item') {
    const it = scene.sheet.inv.find((i) => i.id === ans.item);
    if (it) {
      scene.sheet.inv = scene.sheet.inv.filter((i) => i !== it);
      const what = it.name || label({ asset: it.asset });
      if (itemHeals(it)) {
        const before = hp.get();
        hp.set(before + 4);
        float(scene.heroId, hp.get() - before, true);
        lines.push(`${names.player} uses ${what}: +${hp.get() - before} health`);
      } else if (target) hurtFoe(target, 3 + Math.floor(rnd() * 2), `throws ${what} at`);
    }
  } else if (ans.move === 'escape') {
    if (rnd() * 100 < b.flee) {
      b.over = 'fled';
      lines.push(`${names.player} gets away`);
    } else lines.push(`${names.player} tries to escape — no way out`);
  } else if (ans.move === 'speak') lines.push(`${names.player} speaks${target ? ' to ' + nameOf(target, label) : ''}`);

  const left = livingFoes(scene);
  if (!b.over && !left.length) b.over = 'won';
  if (!b.over && b.auto) {
    /* the enemies answer, one after the other */
    const ai = b.ai || { attack: 100, heavy: 0, defend: 0, wait: 0 },
      total = ai.attack + ai.heavy + ai.defend + ai.wait || 1;
    b.shield = [];
    for (const foe of left) {
      if (hp.get() <= 0) break;
      nextStep(); // the hero's move first, then each enemy in turn
      const who = nameOf(foe, label);
      let pick = rnd() * total,
        act = 'wait';
      for (const k of ['attack', 'heavy', 'defend', 'wait']) {
        if (pick < ai[k]) {
          act = k;
          break;
        }
        pick -= ai[k];
      }
      if (act === 'wait') {
        lines.push(`${who} hesitates`);
        continue;
      }
      if (act === 'defend') {
        b.shield.push(foe.id);
        foe.once = 'roar';
        lines.push(`${who} is on its guard`);
        continue;
      }
      foe.once = 'lunge';
      const heavy = act === 'heavy';
      if (rnd() >= ((b.foeHit ?? 85) / 100) * (heavy ? 0.7 : 1)) {
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
    }
    if (hp.get() <= 0) b.over = 'lost';
  }
  showFloats();
  b.log = [...(b.log || []), ...lines].slice(-8);
  b.round++;
  return lines;
}

/** Why the Director should take over now, after a round ('' if the fight just goes on). Marks what it has told. */
export function stopReason(scene, move, names, label) {
  const b = scene.battle;
  if (!b || !b.stop) return '';
  if (b.stop.speak && move === 'speak') return `${names.player} speaks`;
  const pct = (e) => Math.round((e.hp / (e.maxHp || 1)) * 100);
  if (b.stop.foe) {
    const foe = livingFoes(scene).find((e) => pct(e) <= b.stop.foe && !b.told.includes(e.id));
    if (foe) {
      b.told.push(foe.id);
      return `${nameOf(foe, label)} is down to ${pct(foe)}% health`;
    }
  }
  const hp = heroHealth(scene);
  if (b.stop.hero && !b.told.includes('hero') && (hp.get() / (hp.max || 1)) * 100 <= b.stop.hero) {
    b.told.push('hero');
    return `${names.player} is down to ${hp.get()} health`;
  }
  if (b.stop.rounds && (b.round - 1) % b.stop.rounds === 0) return `Round ${b.round - 1} is over`;
  return '';
}

/* ---------- how hard is it? ---------- */
export const BATTLE_LEVELS = [
  ['veryeasy', 'Very easy', 0.15],
  ['easy', 'Easy', 0.35],
  ['normal', 'Normal', 0.6],
  ['hard', 'Hard', 0.85],
  ['veryhard', 'Very hard', 1.15],
  ['impossible', 'Almost impossible', 1.8],
];
/**
 * A fight on paper. o = { heroHp, atk, weapon, hit, foes: [hp, ...], foeAtk, foeHit, ai }.
 * The hero takes the enemies one after the other; every enemy still standing strikes each round.
 * Returns { ratio, label, rounds, damage }: ratio is the damage the hero can expect over the hero's health —
 * well under 1 the hero wins comfortably, about 1 it is a coin toss, above 1 the hero usually falls.
 */
export function estimateBattle(o) {
  const ai = o.ai || { attack: 100, heavy: 0, defend: 0, wait: 0 },
    total = ai.attack + ai.heavy + ai.defend + ai.wait || 1,
    perBlow = (o.hit / 100) * (o.atk + (o.weapon ? WEAPON : 0) + 1) * 1.1 * (1 - (ai.defend / total) * 0.5),
    foeBlow = (o.foeHit / 100) * (o.foeAtk + 1) * (ai.attack / total + (ai.heavy / total) * 0.7 * 2);
  let rounds = 0,
    damage = 0,
    left = o.foes.length;
  for (const hp of o.foes) {
    const r = Math.max(1, Math.ceil(hp / Math.max(0.2, perBlow)));
    damage += r * left * foeBlow;
    rounds += r;
    left--;
  }
  const ratio = o.heroHp > 0 ? damage / o.heroHp : 9;
  const label = (BATTLE_LEVELS.find((l, i) => ratio <= (l[2] + (BATTLE_LEVELS[i + 1] || [0, 0, 9])[2]) / 2) ||
    BATTLE_LEVELS[BATTLE_LEVELS.length - 1])[1];
  return { ratio, label, rounds, damage: Math.round(damage) };
}
/** The enemies' strength and aim that make this fight as hard as asked: { foeAtk, foeHit }. */
export function presetBattle(level, o) {
  const target = (BATTLE_LEVELS.find((l) => l[0] === level) || BATTLE_LEVELS[2])[2];
  let best = null;
  for (let foeAtk = 0; foeAtk <= 12; foeAtk++)
    for (const foeHit of [20, 30, 40, 50, 60, 70, 80, 90, 95]) {
      const d = Math.abs(estimateBattle({ ...o, foeAtk, foeHit }).ratio - target) + (Math.abs(foeHit - 75) / 100) * 0.05;
      if (!best || d < best.d) best = { d, foeAtk, foeHit };
    }
  return { foeAtk: best.foeAtk, foeHit: best.foeHit };
}
