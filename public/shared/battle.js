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
  return {
    ...out,
    auto: b.auto,
    cmds: cmds.includes('attack') ? cmds : ['attack', ...cmds],
    atk: n(b.atk, 1, 20, 2),
    foeAtk: n(b.foeAtk, 0, 20, 1),
    flee: n(b.flee, 0, 100, 50),
    guard: !!b.guard,
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
      dmg = Math.max(1, b.atk + (weapon ? WEAPON : 0) + Math.floor(rnd() * 3)) * (r > 0.9 ? 2 : 1);
    if (hero) hero.once = 'lunge';
    if (weapon) weapon.once = 'swing';
    if (r < 0.1) lines.push(`${names.player} misses ${nameOf(target, label)}`);
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
    for (const foe of left) {
      if (rnd() < 0.15) {
        lines.push(`${nameOf(foe, label)} misses`);
        continue;
      }
      let dmg = b.foeAtk + Math.floor(rnd() * 3);
      if (b.guard) dmg = Math.floor(dmg / 2);
      foe.once = foe.once || 'lunge';
      if (dmg > 0) {
        hp.set(hp.get() - dmg);
        float(scene.heroId, dmg);
      }
      lines.push(`${nameOf(foe, label)} hits ${names.player}: ${dmg}${b.guard ? ' (defended)' : ''}`);
    }
    if (hp.get() <= 0) b.over = 'lost';
  }
  scene.floats = [...floats]
    .filter(([, n]) => n)
    .map(([id, n]) => ({ id, text: (n > 0 ? '+' : '') + n, c: n > 0 ? '#a7d68c' : id === scene.heroId ? '#e0766a' : '#ffffff' }));
  b.log = [...(b.log || []), ...lines].slice(-8);
  b.round++;
  return lines;
}
