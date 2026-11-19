/* Dungeon mode: the rules, played out by a computer hero against a computer Overlord in many random castles. */
import assert from 'node:assert';
import * as R from '../public/shared/dungeon-rules.js';
import fs from 'node:fs';

for (const s of [...Object.values(R.MOBS), ...Object.values(R.LOOT)]) assert(fs.existsSync(`public/px/${s.sprite}.png`), 'sprite ' + s.sprite);

// building rules
const def = { name: 't', rooms: {} };
R.addRoom(def, '1,0'); R.addRoom(def, '0,0'); assert(!R.addRoom(def, '7,0'));
assert.equal(def.rooms['0,0'].t[5 * R.RW + 14], 'D'); assert.equal(def.rooms['1,0'].t[5 * R.RW], 'D');
assert.equal(def.rooms['0,0'].t[5 * R.RW], '#', 'no door without a neighbour');
assert(R.paintTile(def, '1,0', 0, 5, 'L')); assert.equal(def.rooms['0,0'].t[5 * R.RW + 14], 'L', 'doors mirror');
assert(!R.paintTile(def, '0,0', 0, 0, '.'), 'outer wall stays');
assert(R.paintTile(def, '0,0', 3, 3, 'S')); assert(R.paintTile(def, '1,0', 3, 3, 'S')); assert(!def.rooms['0,0'].t.includes('S'), 'one start only');
assert.match(R.checkDef(def), /crown/);
R.paintTile(def, '1,0', 12, 5, 'X'); R.paintTile(def, '0,0', 3, 3, 'S'); R.paintTile(def, '0,0', 5, 3, 'k'); R.paintTile(def, '0,0', 4, 5, '1'); R.paintTile(def, '0,0', 3, 6, '_'); R.paintTile(def, '0,0', 9, 9, 'G');
def.rooms['0,0'].fx = 'ambush';
assert.equal(R.checkDef(def), '');
assert.deepEqual(R.cleanDef(JSON.parse(JSON.stringify(def))), def);
assert.equal(Object.keys(R.cleanDef({ rooms: { '9,9': R.emptyRoom(), '0,0': { t: 'x' } } }).rooms).length, 0);

// a hand-played game, turn-based
let st = R.createState(def, 'turn');
assert.equal(st.hero.x, 3); assert.equal(st.mobs.length, 1); assert.equal(st.items.length, 1);
assert(R.heroAct(st, { k: 'move', dir: 'right' })); assert(R.heroAct(st, { k: 'move', dir: 'right' }));
assert.equal(st.hero.keys, 1, 'picked up the key');
assert(!R.heroAct(st, { k: 'move', dir: 'up' }) || st.hero.y === 2);
assert.equal(R.lordCmd(st, { k: 'spawn', m: 'bat', r: '0,0', x: 12, y: 8 }), 'Wait for your turn');
while (st.turn.who === 'hero') R.heroAct(st, { k: 'wait' });
assert.equal(R.lordCmd(st, { k: 'spawn', m: 'bat', r: '0,0', x: st.hero.x + 1, y: st.hero.y }).slice(0, 9), 'Not there');
assert.equal(R.lordCmd(st, { k: 'spawn', m: 'bat', r: '0,0', x: 12, y: 8 }), '');
assert.equal(R.lordCmd(st, { k: 'spawn', m: 'boss', r: '0,0', x: 12, y: 7 }), 'Unknown power');
assert.equal(st.mobs.length, 2);
assert.equal(R.lordCmd(st, { k: 'whisper', text: 'boo' }), ''); assert.equal(st.msg.text, 'boo');
assert.equal(R.lordCmd(st, { k: 'endturn' }), ''); assert.equal(st.turn.who, 'hero');

// live: sword, plates and gates
st = R.createState(def, 'live');
const slime = st.mobs[0];
st.hero.x = slime.x - 1; st.hero.y = slime.y; slime.cd = 99;
R.heroAct(st, { k: 'attack', dir: 'right' }); assert.equal(slime.x, 5, 'knocked back'); st.t += 1; st.hero.x = 4; slime.cd = 99; R.heroAct(st, { k: 'attack', dir: 'right' });
assert.equal(st.mobs.length, 0, 'two hits kill a slime'); assert.equal(st.stats.kills, 1);
assert(st.rooms['0,0'].t.includes('G'), 'gate stays while a plate is unpressed');
st.hero.x = 2; st.hero.y = 6; st.t += 1; R.heroAct(st, { k: 'move', dir: 'right' });
assert(st.rooms['0,0'].t.includes('-')); assert.equal(st.mobs.length, 3, 'ambush');
st.mobs.length = 0; st.t += 1; st.hero.x = 1; st.hero.y = 1; R.heroAct(st, { k: 'move', dir: 'right' });
const hp = st.hero.hp; st.hero.inv = 0;
R.lordCmd(st, { k: 'spawn', m: 'skeleton', r: '0,0', x: 8, y: 8 }); for (let i = 0; i < 200 && st.hero.hp === hp; i++) R.advance(st, 0.05);
assert(st.hero.hp < hp, 'a monster reaches and hurts a hero who stands still');

// many whole games, computer against computer
let won = 0, lost = 0, stuck = 0;
for (let g = 0; g < 300; g++) {
  const d = R.randomDef(); assert.equal(R.checkDef(d), ''); assert.deepEqual(R.cleanDef(JSON.parse(JSON.stringify(d))), d);
  const s = R.createState(d, g % 2 ? 'turn' : 'live', { autoLord: g % 3 > 0, autoHero: true });
  let n = 0;
  for (; n < 40000 && s.phase === 'play'; n++) {
    if (s.mode === 'live') { R.advance(s, 0.05); if (n % 3 === 0) { const a = R.autoHero(s); if (a) R.heroAct(s, a); } }
    else if (s.turn.who === 'hero') { const a = R.autoHero(s); R.heroAct(s, a || { k: 'wait' }) || R.heroAct(s, { k: 'wait' }); } else if (!s.autoLord) R.lordCmd(s, { k: 'endturn' });
    R.autoLord(s);
    assert(s.hero.hp >= 0 && s.hero.hp <= s.hero.max && s.dread >= 0 && s.dread <= s.maxDread);
    assert(s.mobs.every((m) => m.x > 0 && m.y > 0 && m.x < R.RW - 1 && m.y < R.RH - 1), 'monsters stay inside');
    assert(JSON.stringify(s).length < 60000);
  }
  if (s.phase === 'won') won++; else if (s.phase === 'lost') lost++; else stuck++;
}
console.log(`300 games: hero won ${won}, Overlord won ${lost}, unfinished ${stuck}`);
assert(won > 15 && lost > 15, 'both sides can win');
assert(stuck < 60, 'games finish');
console.log('RPG-SIM OK');
