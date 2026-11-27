/*
 * The battle: a classic turn-based fight. Shared by the browser and the server.
 *
 * The Director picks the enemies and how hard it is. From then on the fight is the Player's: each round they
 * choose Attack, Defend, Item or Escape; the hero acts, then every enemy still standing acts in turn. The server
 * works a round out at once and tells it as a list of EVENTS, in the order they happen; both screens play that
 * list step by step (stage/fight.js) — a wind-up, a blow, the impact, the health draining, a fall — so nothing is
 * ever shown before it has happened on the stage. When one side is beaten or the hero gets away, the turn goes to
 * the Director.
 *
 * While the fight lasts the Director can pause it, give anyone a line (it is spoken at once, as an event of its
 * own), and decide what an enemy does next (FOE_MOVES) instead of leaving it to chance.
 *
 *   scene.battle = { level, round, atk, hit, foeAtk, foeHit, flee, guard, paused, plan, wards, log }
 *     level    one of BATTLE_LEVELS; it decides every number below
 *     atk      the hero's strength (a thing tied to the hero is a weapon and adds WEAPON)
 *     hit      the hero's chance to hit, in percent        foeAtk, foeHit   the same for an enemy
 *     flee     the chance that Escape works                 paused           the Director holds the fight
 *     guard    the hero defended this round                 wards            { enemy id: true } enemies on guard
 *     plan     { enemy id: move } what the Director decided for the coming round
 *
 *   an event = { t, who, text, ... }                                         text: the line for the message window
 *     attack   { who, target, heavy, thrown (asset), hit, crit, dmg, guard, hp, max, down }
 *     defend   { who }                heal   { who, amount, hp, max }        wait   { who }
 *     escape   { who, ok }            leave  { who }  an enemy runs          say    { who, text }
 *     end      { result }  'won' | 'lost' | 'fled' | 'stopped'
 * One blow never takes more than half of the hero's full health — except when the fight is meant to be impossible.
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
/** What the Director can make an enemy do in the coming round ('' leaves it to chance). */
export const FOE_MOVES = [
  ['', 'As it comes'],
  ['attack', 'Attack'],
  ['heavy', 'Heavy blow'],
  ['guard', 'Guard'],
  ['wait', 'Hold back'],
  ['flee', 'Run away'],
];
export const WEAPON = 2;
const HERO_ATK = 2,
  HERO_HEALTH = 10;
const HEALS = /potion|bandage|medicine|food|bread|apple|laudanum|pill|herb|elixir|water|wine|tea|soup|heal|meat|cheese|bottle/i;

export const livingFoes = (scene) => scene.entities.filter((e) => e.hp != null && e.hp > 0 && e.id !== scene.heroId && !e.temp && !e.hidden);
export const weaponOf = (scene) => scene.entities.find((e) => e.tie && e.tie.to === scene.heroId);
export const itemHeals = (it) => HEALS.test(it.name || '') || HEALS.test(it.asset || '');
const nameOf = (e, label) => e.name || label(e); // in a fight a nameless thing goes by what it looks like

/** In a fight the two sides face each other: id -> -1 (looks left) or 1 (looks right). */
export function facing(scene) {
  const hero = scene.entities.find((e) => e.id === scene.heroId),
    foes = livingFoes(scene),
    out = new Map();
  if (!hero || !foes.length) return out;
  const near = foes.reduce((a, b) => (Math.abs(b.x - hero.x) < Math.abs(a.x - hero.x) ? b : a));
  out.set(hero.id, Math.sign(near.x - hero.x) || 1);
  for (const f of foes) out.set(f.id, Math.sign(hero.x - f.x) || -1);
  return out;
}
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
  const ids = (o, ok) =>
    Object.fromEntries(
      Object.entries(o && typeof o === 'object' ? o : {})
        .filter(([id, v]) => /^[\w-]{1,24}$/.test(id) && ok(v))
        .slice(0, 40),
    );
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
    plan: ids(b.plan, (v) => FOE_MOVES.some((m) => m[0] && m[0] === v)),
    wards: ids(b.wards, (v) => v === true),
    log: (Array.isArray(b.log) ? b.log : []).slice(-8).map((l) => String(l).slice(0, 90)),
  };
}

/**
 * One round: the hero's command, then every enemy still standing.
 * move = { move: 'attack' | 'defend' | 'item' | 'escape', id (target), item (inventory id) }
 * Changes the scene to how it stands after the round; returns { events, lines, over } — the events in the order
 * they happen (see the top of this file), their lines, and over: '' | 'won' | 'lost' | 'fled'.
 */
export function fightRound(scene, move, names, label, rnd = Math.random) {
  const b = scene.battle,
    hp = heroHealth(scene),
    heroId = scene.heroId,
    events = [];
  let over = '';
  const hero = names.player,
    foes = livingFoes(scene),
    target = foes.find((e) => e.id === move.id) || foes[0],
    weapon = weaponOf(scene);
  b.plan = b.plan || {};
  b.wards = b.wards || {};
  /** The hero's blow lands on an enemy: its guard halves it once. */
  const strike = (foe, dmg, ev) => {
    const warded = !!b.wards[foe.id];
    if (warded) dmg = Math.max(1, Math.ceil(dmg / 2));
    delete b.wards[foe.id];
    foe.hp = Math.max(0, foe.hp - dmg);
    const down = foe.hp === 0;
    events.push({ ...ev, t: 'attack', who: heroId, target: foe.id, hit: true, dmg, guard: warded, hp: foe.hp, max: foe.maxHp, down });
    return down;
  };
  b.guard = false;
  if (move.move === 'attack' && target) {
    const r = rnd(),
      crit = r > 0.92,
      dmg = Math.max(1, b.atk + (weapon ? WEAPON : 0) + Math.floor(rnd() * 3)) * (crit ? 2 : 1),
      who = nameOf(target, label);
    if (r < 1 - b.hit / 100) events.push({ t: 'attack', who: heroId, target: target.id, hit: false, text: `${hero} attacks ${who} — and misses` });
    else
      strike(target, dmg, {
        crit,
        weapon: weapon ? weapon.id : undefined,
        text: crit
          ? `${hero} lands a terrible blow on ${who}`
          : weapon
            ? `${hero} strikes ${who} with the ${nameOf(weapon, label).toLowerCase()}`
            : `${hero} hits ${who}`,
      });
  } else if (move.move === 'defend') {
    b.guard = true;
    events.push({ t: 'defend', who: heroId, text: `${hero} defends` });
  } else if (move.move === 'item') {
    const it = scene.sheet.inv.find((i) => i.id === move.item);
    if (!it) events.push({ t: 'wait', who: heroId, text: `${hero} fumbles for something to use` });
    else {
      scene.sheet.inv = scene.sheet.inv.filter((i) => i !== it);
      const what = it.name || label({ asset: it.asset });
      if (itemHeals(it) || !target) {
        const before = hp.get();
        hp.set(before + Math.max(3, Math.round(hp.max * 0.4)));
        events.push({ t: 'heal', who: heroId, item: it.asset, amount: hp.get() - before, hp: hp.get(), max: hp.max, text: `${hero} uses ${what}` });
      } else strike(target, 3 + Math.floor(rnd() * 3), { thrown: it.asset, text: `${hero} throws ${what} at ${nameOf(target, label)}` });
    }
  } else if (move.move === 'escape') {
    const ok = rnd() * 100 < b.flee;
    events.push({ t: 'escape', who: heroId, ok, text: ok ? `${hero} gets away` : `${hero} tries to escape — no way out` });
    if (ok) over = 'fled';
  } else events.push({ t: 'wait', who: heroId, text: `${hero} hesitates` });
  for (const e of events) if (e.down) events.push({ t: 'down', who: e.target, text: `${nameOf(byId(scene, e.target), label)} is beaten` });

  /* the enemies, each in turn: what the Director planned, or what chance brings */
  if (!over)
    for (const foe of livingFoes(scene)) {
      const who = nameOf(foe, label),
        r = rnd(),
        planned = b.plan[foe.id],
        act = planned || (r < 0.08 ? 'wait' : r > 0.88 ? 'heavy' : 'attack');
      delete b.wards[foe.id]; // a guard lasts until the enemy acts again
      if (act === 'wait') events.push({ t: 'wait', who: foe.id, text: `${who} holds back` });
      else if (act === 'guard') {
        b.wards[foe.id] = true;
        events.push({ t: 'defend', who: foe.id, text: `${who} is on guard` });
      } else if (act === 'flee') {
        foe.hp = 0;
        events.push({ t: 'leave', who: foe.id, text: `${who} runs away` });
      } else {
        const heavy = act === 'heavy'; // a heavy blow: double, but it misses more
        if (rnd() >= (b.foeHit / 100) * (heavy ? 0.7 : 1))
          events.push({
            t: 'attack',
            who: foe.id,
            target: heroId,
            heavy,
            hit: false,
            text: `${who} ${heavy ? 'swings wildly and misses' : 'attacks — and misses'}`,
          });
        else {
          let dmg = (b.foeAtk + Math.floor(rnd() * 3)) * (heavy ? 2 : 1);
          if (b.guard) dmg = Math.floor(dmg / 2);
          if (b.level !== 'impossible') dmg = Math.min(dmg, Math.max(1, Math.ceil(hp.max / 2))); // no single blow ends a fair fight
          hp.set(hp.get() - dmg);
          const down = hp.get() <= 0;
          events.push({
            t: 'attack',
            who: foe.id,
            target: heroId,
            heavy,
            hit: true,
            dmg,
            guard: b.guard,
            hp: hp.get(),
            max: hp.max,
            down,
            text: `${who} ${heavy ? 'lands a heavy blow on' : 'hits'} ${hero}${b.guard ? ' (defended)' : ''}`,
          });
          if (down) {
            over = 'lost';
            break;
          }
        }
      }
    }
  if (!over && !livingFoes(scene).length) over = 'won';
  if (over) events.push({ t: 'end', result: over, text: over === 'won' ? 'Victory!' : over === 'fled' ? 'Got away!' : `${hero} is defeated…` });
  scene.entities = scene.entities.filter((e) => e.id === heroId || e.hp == null || e.hp > 0); // the beaten and the fled are gone
  for (const id of Object.keys(b.wards)) if (!byId(scene, id)) delete b.wards[id];
  b.plan = {}; // a plan is for one round
  const lines = events.filter((e) => e.t !== 'say').map(lineOf);
  b.log = [...(b.log || []), ...lines].slice(-8);
  b.round++;
  return { events, lines, over };
}
const byId = (scene, id) => scene.entities.find((e) => e.id === id) || { asset: '' };
/** An event as one line of the battle's log. */
export function lineOf(e) {
  if (e.t === 'attack' && e.hit) return `${e.text}: ${e.dmg}`;
  if (e.t === 'heal') return `${e.text}: +${e.amount} health`;
  return e.text;
}

/** How long an event takes on the stage, in milliseconds (stage/fight.js keeps to it; the server's clock allows for it). */
export function eventTime(e) {
  if (e.t === 'attack') return e.thrown ? 1300 : 1350;
  if (e.t === 'down') return 900;
  if (e.t === 'defend') return 900;
  if (e.t === 'heal') return 1300;
  if (e.t === 'wait') return 900;
  if (e.t === 'escape') return 1600;
  if (e.t === 'leave') return 1200;
  if (e.t === 'say') return Math.min(7000, 1300 + 55 * String(e.text || '').length);
  if (e.t === 'end') return 2400;
  return 600;
}
export const fightTime = (events) => events.reduce((n, e) => n + eventTime(e), 300);
