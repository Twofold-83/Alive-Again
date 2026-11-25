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
    const { side } = x;
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
    assert.match(await p.textContent('#battleMsg'), /What will Player do\?/);
    const bars = () => p.locator('#battleHud .bar span').allTextContents();
    const turn = (await x.state()).turn,
      before = await bars();

    /* a round is PLAYED: the server knows the outcome at once, the screen shows it blow by blow */
    await p.click('[data-cmd=attack]');
    await p.waitForSelector('#stage.fight .fightmsg:not([hidden])');
    let s = await x.state();
    assert.equal(s.scene.battle.round, 2, 'the round is already decided on the server');
    assert.deepEqual(await bars(), before, 'but no health has moved on screen before the blow lands');
    assert.equal(await p.locator('.battlecmds').count(), 0, 'no commands while the round plays');
    assert.equal(s.turn, turn, 'the turn stays with the Player');
    const ev = s.fight.events;
    assert.deepEqual([ev[0].t, ev[0].who, ev[0].target !== undefined], ['attack', s.scene.heroId, true], 'first the hero’s attack');
    assert(ev.length >= 2 && ev[1].who !== s.scene.heroId, 'then the enemy’s answer: ' + ev.map((e) => e.t).join());
    if (ev[0].hit) {
      await p.waitForSelector('#stage .impact', { state: 'attached' }); // the blow lands with a burst…
      await p.waitForFunction((was) => document.querySelector('#battleHud .bar.foe span').textContent !== was, before[1]); // …and the bar drains with it
    }
    await x.cutDone();
    const ghoul = s.scene.entities.find((e) => e.asset === 'p:ghoul');
    {
      const me = s.scene.entities.find((e) => e.id === s.scene.heroId);
      assert.deepEqual(
        await bars(),
        [`${me.hp} / ${me.maxHp}`, `${ghoul.hp} / ${ghoul.maxHp}`],
        'after the round the panels show where the fight stands',
      );
    }
    assert.equal(await p.locator('.battlecmds button').count(), 4, 'and the commands are back');

    /* the Director's hand on the fight (one person plays both sides here, so the card is on this screen) */
    await p.waitForSelector('#liveCard');
    // a line, spoken at once and taken down again
    await p.selectOption('#liveSayWho', ghoul.id);
    await p.fill('#liveSayText', 'You will not leave this house.');
    await p.click('#liveSay');
    await p.waitForFunction(() => /You will not/.test((document.querySelector('#stage .bubble') || {}).textContent || ''));
    await x.cutDone();
    assert.equal(await p.locator('#stage .bubble').count(), 0, 'the line does not hang over the fight');
    s = await x.state();
    assert(
      s.scene.entities.every((e) => !e.say),
      'and is not left in the scene',
    );
    assert.equal(s.scene.battle.round, 2, 'a line is not a round');
    // the enemy's next move is the Director's to decide
    await p.selectOption('.liveplan select', 'guard');
    for (let i = 0; i < 20 && !((await x.state()).scene.battle.plan || {})[ghoul.id]; i++) await new Promise((r) => setTimeout(r, 100));
    assert.equal((await x.state()).scene.battle.plan[ghoul.id], 'guard');
    await p.click('[data-cmd=defend]');
    s = await round(3);
    assert.deepEqual(
      s.fight.events.map((e) => e.t),
      ['defend', 'defend'],
      'the hero defends, the ghoul goes on guard as planned',
    );
    assert.deepEqual(s.scene.battle.plan, {}, 'a plan is for one round');
    await x.cutDone();
    // pause: the Player cannot act until the Director lets the fight go on
    await p.click('#livePause');
    await p.waitForFunction(() => /paused/.test(document.querySelector('#battleMsg').textContent));
    assert.equal(await p.locator('.battlecmds').count(), 0);
    assert.equal((await x.state()).scene.battle.paused, true);
    await p.click('#livePause');
    await p.waitForSelector('.battlecmds');
    // make it easy to get away
    await p.selectOption('#liveLevel', 'veryeasy');
    for (let i = 0; i < 20 && (await x.state()).scene.battle.flee !== 90; i++) await new Promise((r) => setTimeout(r, 100));
    assert.equal((await x.state()).scene.battle.flee, 90, 'the level sets the chance to escape');

    /* stepping in: the turn comes over with all the usual tools; ending it gives the fight back */
    await p.click('#liveStep');
    await side('Director');
    s = await x.state();
    assert.equal(s.scene.battle.paused, true);
    assert.match(await p.textContent('#panel'), /The battle is paused/);
    await x.end();
    await side('Player');
    await x.cutDone();
    s = await x.state();
    assert.equal(s.scene.battle.paused, false);

    /* escape (or the end of the fight) hands the turn to the Director — after the last round has been played */
    let ended = false;
    for (let i = 0; i < 12 && (await x.state()).scene.battle; i++) {
      await p.click('[data-cmd=escape]').catch(() => {});
      await p.waitForSelector('#stage.fight').catch(() => {});
      if (!(await x.state()).scene.battle) {
        await p.waitForSelector('#stage .fightend:not([hidden])'); // "Got away!" comes at the very end of the round, on the stage
        ended = true;
      }
      await x.cutDone().catch(() => {});
    }
    assert(ended, 'the ending was shown on the stage');
    await side('Director');
    s = await x.state();
    assert.equal(s.scene.battle, null, 'the battle is over');
    assert.match(s.scene.card, /Got away!|Defeated…|Victory!/);
    assert.equal(
      s.scene.entities.find((e) => e.asset === 'p:ghoul') ? s.scene.entities.find((e) => e.asset === 'p:ghoul').hp : null,
      null,
      'the health bars are gone',
    );
    assert.equal(await p.locator('#battleBox').count(), 0, 'and so are the battle panels');

    /* ---- two people, two screens: the Director watches every blow as it falls, and keeps a hand on the fight ---- */
    {
      const D = await t.open(),
        P = await t.open();
      await D.p.goto(t.base);
      await D.p.click('#typeAdventure');
      await D.p.click('#newDirector');
      await D.p.waitForSelector('.gopts');
      const code = (await D.p.evaluate(() => location.hash)).slice(1);
      await P.p.goto(`${t.base}/#${code}`);
      await P.p.click('#joinBtn');
      await P.p.waitForSelector('#foot .status');
      await D.add('ghoul');
      await D.done();
      await D.opt('Battle');
      await D.p.click('#panel > .grid button >> nth=0');
      await D.p.click('[data-level=veryeasy]'); // the hero wins this one
      await D.p.click('#battleStart');
      await D.end();
      await P.p.waitForSelector('.battlecmds');
      await P.cutDone();
      await D.p.waitForSelector('#liveCard');
      assert.equal(await D.p.locator('#liveCard .battlehud .bar').count(), 2, 'the Director sees the health of both');
      const dBars = () => D.p.locator('#liveCard .battlehud .bar span').allTextContents();
      // the Director gives the ghoul a line: the Player sees it spoken, and it is gone again
      const gid = (await D.state()).scene.entities.find((e) => e.asset === 'p:ghoul').id;
      await D.p.selectOption('#liveSayWho', gid);
      await D.p.fill('#liveSayText', 'Mine.');
      await D.p.press('#liveSayText', 'Enter');
      await P.p.waitForFunction(() => /Mine/.test((document.querySelector('#stage .bubble') || {}).textContent || ''));
      await P.cutDone();
      assert.equal(await P.p.locator('#stage .bubble').count(), 0);
      // pause: the Player's commands are gone until the Director lets the fight go on
      await D.p.click('#livePause');
      await P.p.waitForFunction(() => /paused/.test(document.querySelector('#battleMsg').textContent));
      assert.equal(await P.p.locator('.battlecmds').count(), 0);
      await D.p.click('#livePause');
      await P.p.waitForSelector('.battlecmds');
      // fight it out: on both screens every round is played before its outcome shows
      let won = false;
      for (let i = 0; i < 14 && !won; i++) {
        const was = await dBars();
        await P.p.click('[data-cmd=attack]');
        await D.p.waitForSelector('#stage.fight .fightmsg:not([hidden])');
        assert.deepEqual(await dBars(), was, 'the Director’s bars have not moved before the blow lands');
        const st = await D.state();
        if (!st.scene.battle) {
          /* the last round: the turn is the Director's already — but first the blow, the fall, and only then "Victory!" */
          assert.equal(st.whose, 'director');
          assert.equal(await P.p.locator('#stage .fightend:not([hidden])').count(), 0, 'no victory before the last blow has been played');
          assert.equal(await D.p.locator('#stage .fightend:not([hidden])').count(), 0);
          assert((await P.p.locator('#battleBox').count()) === 1, 'the Player still watches the fight in its panel');
          await P.p.waitForSelector('#stage .fightend:not([hidden])');
          assert.match(await P.p.textContent('#stage .fightend'), /Victory!|Defeated/);
          won = true;
        }
        await P.cutDone();
        await D.cutDone();
      }
      assert(won, 'the fight came to an end');
      await D.p.waitForSelector('.gopts'); // the Director takes it from here
      assert.match(await D.p.textContent('.card.told'), /Victory!|defeated/i);
      assert.equal(await P.p.locator('#battleBox').count(), 0);
    }
    assert.deepEqual(t.errors, []);
    console.log('E2E-BATTLE OK');
  } finally {
    await t.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
