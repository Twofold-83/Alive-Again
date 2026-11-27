// Two people on two computers: a Director and a Player, through joining, steps, reload, a server restart and a dropout.
const assert = require('assert');
const { setup } = require('./lib');
(async () => {
  const t = await setup(3123);
  try {
    const D = await t.open(),
      P = await t.open();
    await D.p.goto(t.base);
    assert.equal(await D.p.locator('#titleArt, .subtitle').count(), 0, 'the start screen has no four-armed boy any more');
    await D.p.fill('#name', 'Mia');
    await D.p.click('#newDirector');
    await D.p.waitForSelector('.gopts');
    const code = (await D.p.evaluate(() => location.hash)).slice(1);
    assert.match(code, /^[A-Z]{5}$/);
    assert(await D.p.isDisabled('#foot button.go'), 'cannot begin before the Player joins');
    assert.equal(await D.p.locator('.stepbar').count(), 0, 'no steps while setting the stage');
    // a title screen with instructions
    await D.opt('Story settings');
    await D.p.fill('#infoTitle', 'The Dark Forest');
    await D.p.fill('#infoText', 'Find the way out.\nBe kind to wizards.');
    await D.p.waitForTimeout(700);
    await D.done();
    // set the stage
    await D.add('mage');
    await D.p.fill('#panel input', 'Welcome, traveller!');
    await D.done();
    await D.opt('Mood');
    await D.opt('Light and dark');
    await D.p.click('[data-dark="2"]');
    await D.done();
    await D.opt('Narrate');
    await D.p.fill('#panel input', 'A dark forest. Something is watching.');
    await D.done();
    // the Player joins by link and sees nothing of the draft
    await P.p.goto(`${t.base}/#${code}`);
    await P.p.fill('#name', 'Sam');
    await P.p.click('#joinBtn');
    await P.p.waitForSelector('#foot .status');
    await P.p.waitForSelector('#titleScreen:not([hidden])');
    assert.match(await P.p.textContent('#titleScreen'), /The Dark Forest.*Find the way out/s);
    assert.match(await P.p.textContent('#howto'), /Be kind to wizards/);
    await P.p.evaluate(() => {
      window.__title = false;
      setInterval(() => {
        if (document.querySelector('#stage .cardov').textContent === 'The Dark Forest') window.__title = true;
      }, 40);
    });
    assert.equal(await P.p.locator('#stage .ent').count(), 1, 'the Player must not see the uncommitted draft');
    await D.p.waitForSelector('#foot button.go:not([disabled])');
    await D.shot('p-1-setup');
    await D.end();
    // the Player's turn
    await P.p.waitForSelector('#foot button.go');
    await P.cutDone();
    assert.equal(await P.p.locator('#stage .ent').count(), 2);
    assert(await P.p.evaluate(() => window.__title), 'the story opened on its title');
    assert(await P.p.isHidden('#titleScreen'));
    assert.match(await P.p.textContent('.strip.narr'), /dark forest/);
    const [hx] = await P.heroPos();
    await P.p.mouse.click(600, 400);
    assert.equal((await P.heroPos())[0], hx, 'clicking the stage alone does not move the hero');
    await P.walk(0.2, 0.7); // press Walk, point, and the hero walks there
    const [wx, wy] = await P.heroPos();
    assert(Math.abs(wx - 0.2) < 0.02 && Math.abs(wy - 0.7) < 0.02, `walked to the spot (${wx}, ${wy})`);
    assert.equal(await P.p.textContent('#walkBtn'), '↶ Take the walk back', 'one walk per turn');
    await P.p.fill('#foot input >> nth=0', 'Who are you?');
    await P.p.fill('#foot input >> nth=1', 'draws a sword');
    await P.p.reload();
    await P.p.waitForSelector('#foot button.go'); // a reload mid-turn keeps the draft
    assert.equal(await P.p.inputValue('#foot input >> nth=1'), 'draws a sword');
    await P.end();
    // the Director: the Player's line is reported, not left hanging over the hero
    await D.p.waitForSelector('.stepbar');
    await D.cutDone();
    assert.match(await D.p.textContent('.card.told'), /Who are you\?.*draws a sword/s);
    {
      const sc = await D.last();
      assert.equal(sc.tracks.length, 1, 'the walk was sent to the Director');
      assert.equal(sc.tracks[0].id, sc.heroId);
      const t = sc.tracks[0].pts;
      assert(t[t.length - 3] > 1000, 'at walking pace: ' + t[t.length - 3] + ' ms');
    }
    assert.match(await D.p.textContent('.strip.act'), /Who are you\?.*draws a sword/s);
    assert.equal(await D.p.textContent('#stage .bubbles'), '', 'no speech bubble left on stage at the start of the Director’s turn');
    // step 1: a line, a shake and a boom together
    await D.opt('Someone speaks');
    await D.p.click('#panel .grid button:not(.heroopt)');
    await D.p.fill('#panel input', 'Put that away.');
    await D.done();
    await D.opt('Moment and sound');
    await D.p.click('[data-mark="burst=shake"]');
    await D.p.click('[data-mark="sfx=boom"]');
    await D.done();
    assert.match(await D.p.textContent('.gevents'), /Put that away.*Shake \+ .*Boom/s);
    await D.p.click('#nextStep');
    // step 2: narration
    assert.match(await D.p.textContent('.gtitle'), /Step 2/);
    await D.opt('Narrate');
    await D.p.fill('#panel input', 'The ground stops shaking.');
    await D.done();
    // preview: the Player's own action is not played again
    await D.watch();
    await D.p.click('#previewBtn');
    await D.p.waitForFunction(() => document.querySelector('#stage').classList.contains('cut'));
    await D.cutDone();
    let seq = await D.seen();
    assert(seq.some((k) => /Put that away\./.test(k)) && seq.some((k) => /The ground stops shaking\./.test(k)), 'preview played both steps');
    assert(
      !seq.some((k) => /Put that away/.test(k) && /draws a sword/.test(k)),
      'the Player’s action is not replayed in the preview: ' + JSON.stringify(seq),
    );
    await D.shot('p-2-director-steps');
    // the server restarts mid-game: the story survives and both reconnect on their own
    await t.restart();
    await D.p.waitForFunction(() => document.querySelectorAll('#top .dot.on').length === 2, null, { timeout: 20000 });
    assert.match(await D.p.textContent('.gtitle'), /Step 2/, 'the Director’s unfinished turn survived');
    await P.watch();
    await D.end();
    await P.p.waitForSelector('#foot button.go', { timeout: 30000 });
    await P.cutDone();
    seq = await P.seen();
    const a = seq.findIndex((k) => /Put that away\./.test(k) && !/ground stops/.test(k)),
      b = seq.findIndex((k) => /The ground stops shaking\./.test(k));
    assert(a >= 0 && b > a, 'the Player saw step 1, then step 2: ' + JSON.stringify(seq));
    assert(
      seq.some((k) => /shake$/.test(k)),
      'the shake played',
    );
    assert.doesNotMatch(await P.p.textContent('#stage .bubbles'), /Who are you/, 'the Player’s old line is gone');
    const sc = await P.last();
    assert.equal(sc.steps.length, 1);
    assert.equal(sc.steps[0].burst, 'shake');
    assert.equal(sc.steps[0].sfx, 'boom');
    assert.equal(sc.steps[0].narration, '');
    assert.equal(sc.narration, 'The ground stops shaking.');
    assert.equal(sc.burst, '');
    assert.equal(sc.entities.find((e) => e.id === sc.heroId).say, '');
    // the Director drops out: the Player's clock pauses
    assert(await P.p.evaluate(() => /\d:\d\d/.test(document.querySelector('#tlabel').textContent)), 'clock visible');
    await D.p.context().close();
    await P.p.waitForFunction(
      () => /offline/.test(document.querySelector('#banner').textContent) && /paused/.test(document.querySelector('#tlabel').textContent),
      null,
      { timeout: 15000 },
    );
    // the story so far
    await P.p.click('#top button[aria-label="Story so far"]');
    await P.p.waitForSelector('#story:not([hidden])');
    assert.match(await P.p.textContent('#storyCap'), /Page 3 of 3/);
    assert.deepEqual(t.errors, []);
    console.log('E2E-PLAY OK');
  } finally {
    await t.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
