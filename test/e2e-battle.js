// A battle with rules, in a real browser: the Director sets it up, the enemies fight on their own, the Player
// commands (Attack, Defend, Item, Escape, Speak), every round is settled and told to both.
const assert = require('assert');
const { setup } = require('./lib');

(async () => {
  const t = await setup(3134);
  try {
    const x = await t.open(),
      p = x.p;
    const side = (who) => p.waitForFunction((w) => new RegExp(w).test(document.querySelector('#banner').textContent), who);
    const toPlayer = async () => {
      await x.end();
      await side('Player');
      await x.cutDone();
    };
    const toDirector = async () => {
      await x.end();
      await side('Director');
      await x.cutDone();
    };
    await p.goto(t.base);
    await p.click('#typeAdventure');
    await p.click('#hotseat');
    await p.waitForSelector('.gopts');
    await x.add('ghoul');
    await x.done();
    await x.opt('Battle');
    await p.click('#panel > .grid button >> nth=0');
    assert.equal(await p.locator('#battleRules [data-cmd]').count(), 5, 'five commands to allow');
    await p.click('.row button:has-text("20") >> nth=0'); // a tough enemy: it survives the first blow
    await p.click('#battleRules [data-foeatk="2"]');
    await p.click('#battleRules [data-flee="100"]');
    await p.click('#battleStart');
    await toPlayer();
    assert.match(await p.textContent('.askbox'), /Attack.*Defend.*Item.*Escape.*Speak/s);
    assert.equal(await p.locator('#battleHud .bar').count(), 2, 'health of the hero and of the enemy');
    await p.click('.battlecmds button:has-text("Attack")');
    await toDirector();
    let sc = await x.last();
    assert.equal(sc.answer.move, 'attack');
    assert(sc.answer.lines.length >= 1, 'the round was settled: ' + sc.answer.lines.join(' | '));
    assert.equal(sc.battle.round, 2);
    assert.equal(sc.steps.length, 1, 'the hero’s move is shown first, then the enemy’s answer');
    assert(sc.steps[0].floats.length + sc.floats.length >= 1, 'damage numbers float over who was hit');
    assert.equal(sc.ask.kind, 'battle', 'the next round is asked for without the Director doing anything');
    await p.waitForSelector('#battleLog');
    await toPlayer();
    await p.click('.battlecmds button:has-text("Escape")');
    await toDirector();
    sc = await x.last();
    assert.equal(sc.battle, null, 'escaped: the battle is over');
    assert.equal(sc.card, 'Got away!');
    assert.deepEqual(t.errors, []);
    console.log('E2E-BATTLE OK');
  } finally {
    await t.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
