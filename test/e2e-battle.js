// The battle, in a real browser: the Director picks the enemies and how hard it is; the whole fight is then the
// Player's — Attack, Defend, Item, Escape, each carried out at once while both watch — until it is over. The
// Director can pause it, stage something, and give it back.
const assert = require('assert');
const { setup } = require('./lib');

(async () => {
  const t = await setup(3134);
  try {
    const x = await t.open(),
      p = x.p;
    const side = (who) => p.waitForFunction((w) => new RegExp(w).test(document.querySelector('#banner').textContent), who);
    const round = async (n) => {
      for (let i = 0; i < 60; i++) {
        const s = await x.state();
        if (!s.scene.battle || s.scene.battle.round >= n) return s;
        await new Promise((r) => setTimeout(r, 150));
      }
      return x.state();
    };
    await p.goto(t.base);
    await p.click('#typeAdventure');
    await p.click('#hotseat');
    await p.waitForSelector('.gopts');
    await x.add('ghoul');
    await x.done();
    /* the Director: enemies and difficulty, nothing else */
    await x.opt('Battle');
    await p.click('#panel > .grid button >> nth=0');
    assert.equal(await p.locator('#battleLevels button').count(), 6, 'six levels, from very easy to basically impossible');
    await p.click('[data-level=impossible]');
    const hard = await p.textContent('#btEstimate');
    await p.click('[data-level=veryeasy]');
    const easy = await p.textContent('#btEstimate');
    assert.match(easy, /Very easy: Player .* against 1 enemy/);
    assert.notEqual(easy, hard, 'the level changes the numbers');
    await p.click('[data-level=hard]'); // tough enough to last a few rounds
    await p.click('#battleStart');
    await x.end();
    await side('Player');
    await x.cutDone();
    /* the Player is locked into the fight: only the battle's commands */
    assert.equal(await p.locator('#foot input').count(), 0, 'no speaking, no free action');
    assert.equal(await p.locator('#foot button.go').count(), 0, 'no ending the turn');
    assert.deepEqual(await p.locator('.battlecmds button').allTextContents(), ['Attack', 'Defend', 'Item (0)', 'Escape (40%)']);
    assert.equal(await p.locator('#battleHud .bar').count(), 2, 'health of the hero and of the enemy');
    const turn = (await x.state()).turn;
    await p.click('[data-cmd=attack]');
    let s = await round(2);
    assert.equal(s.turn, turn, 'the turn stays with the Player');
    assert.equal(s.whose, 'player');
    assert.equal(s.scene.battle.round, 2);
    assert(s.scene.answer.lines.length >= 1, 'the round is told: ' + s.scene.answer.lines.join(' | '));
    assert.equal(s.scene.steps.length, 1, 'the hero’s move is shown first, then the enemy’s answer');
    await x.cutDone();
    await p.click('[data-cmd=defend]');
    s = await round(3);
    assert.equal(s.turn, turn);
    await x.cutDone();
    /* the Director pauses: the turn comes over with all the usual tools; ending it gives the fight back */
    await p.click('#liveStop');
    await side('Director');
    s = await x.state();
    assert.equal(s.scene.battle.paused, true);
    assert.match(await p.textContent('#panel'), /The battle is paused/);
    await p.click('#battleOpen');
    await p.click('[data-level=veryeasy]'); // make it easy to get away
    await x.done();
    await x.end();
    await side('Player');
    await x.cutDone();
    s = await x.state();
    assert.equal(s.scene.battle.paused, false);
    assert.equal(s.scene.battle.flee, 90, 'the level sets the chance to escape');
    /* escape (or the end of the fight) hands the turn to the Director */
    for (let i = 0; i < 12 && (await x.state()).scene.battle; i++) {
      await p.click('[data-cmd=escape]').catch(() => {});
      await new Promise((r) => setTimeout(r, 600));
      await x.cutDone().catch(() => {});
    }
    await side('Director');
    s = await x.state();
    assert.equal(s.scene.battle, null, 'the battle is over');
    assert.match(s.scene.card, /Got away!|Defeated…|Victory!/);
    assert.equal(
      s.scene.entities.find((e) => e.asset === 'p:ghoul') ? s.scene.entities.find((e) => e.asset === 'p:ghoul').hp : null,
      null,
      'the health bars are gone',
    );
    assert.deepEqual(t.errors, []);
    console.log('E2E-BATTLE OK');
  } finally {
    await t.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
