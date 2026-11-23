// The Player's click menu in an adventure, a clickable thing that answers by itself, and a trap.
const assert = require('assert');
const { setup } = require('./lib');

(async () => {
  const t = await setup(3135);
  try {
    const x = await t.open(),
      p = x.p;
    const side = (who) => p.waitForFunction((w) => new RegExp(w).test(document.querySelector('#banner').textContent), who);
    await p.goto(t.base);
    await p.click('#typeAdventure');
    await p.click('#hotseat');
    await p.waitForSelector('.gopts');
    /* the Director: a chest that answers a look by itself and then looks used, and a crate that is a trap */
    await x.add('treasure chest');
    await p.click('.thingbtns button:has-text("clickable"), .thingbtns button:has-text("Clickable")');
    if (await p.locator('#activeToggle:not(.on)').count()) await p.click('#activeToggle');
    await p.fill('#activeName', 'Old chest');
    await p.fill('[data-re="Look at"]', 'Scratches all round the lock. Someone tried before you.');
    await p.check('.reactrow:has([data-re="Look at"]) input[type=checkbox]');
    await p.click('.gdone');
    const chestId = await p.evaluate(() => window.__lastAdded);
    await x.done();
    /* everything of a setting in one place: its things and the beings one meets there */
    await x.opt('Add something');
    await x.opt('Environment');
    await p.click('[data-env=hospital]');
    assert((await p.locator('#panel .grid button').count()) > 40, 'the hospital has its things');
    await p.click('[data-env=horror]');
    assert.match(await p.textContent('#panel'), /Beings you meet here/);
    await p.click('.gback');
    await p.click('.gback');
    /* mood: the room goes dark, a fire shines in it */
    await x.opt('Mood');
    await x.opt('Light and dark');
    await p.click('[data-dark="2"]');
    await p.click('[data-light=fire]');
    assert.match(
      await p.evaluate(
        () => document.querySelector('#stage .darkov').style.maskImage || document.querySelector('#stage .darkov').style.webkitMaskImage,
      ),
      /radial-gradient/,
      'the fire cuts a hole in the dark',
    );
    await x.done();
    await x.add('crate');
    await p.click('.thingbtns button:has-text("clickable"), .thingbtns button:has-text("Clickable")');
    await p.click('#nearToggle');
    await p.click('.gdone');
    const crateId = await p.evaluate(() => window.__lastAdded);
    await x.done();
    await x.end();
    await side('Player');
    await x.cutDone();
    /* the Player: a click brings up walk here / look at / use */
    assert.match(await p.getAttribute('#foot input[placeholder^="Free"]', 'placeholder'), /Free Action/);
    await p.locator(`#stage .ent[data-id="${chestId}"]`).click({ force: true });
    await p.waitForSelector('.clickmenu');
    assert.match(await p.textContent('.clickmenu'), /Old chest.*Walk here.*Look at old chest|Old chest.*Walk here.*Look at Old chest/s);
    await p.click('#cmLook');
    assert.match(await p.textContent('#reaction'), /Scratches all round the lock/, 'the thing answers at once');
    assert.match(await p.getAttribute(`#stage .ent[data-id="${chestId}"] img`, 'src'), /chest\.used\.png/, 'and now looks used');
    await p.click('#reaction');
    /* walking up to the crate springs the trap: the turn goes to the Director by itself */
    await p.locator(`#stage .ent[data-id="${crateId}"]`).click({ force: true });
    await p.click('#cmWalk');
    await side('Director');
    await x.cutDone();
    const sc = await x.last();
    assert.equal(sc.tripped, crateId, 'the trap was sprung');
    assert.equal(sc.card, 'Something happened!');
    assert.deepEqual(sc.reacted, [{ id: chestId, verb: 'Look at' }], 'the Director is told what the Player looked at');
    assert.equal(sc.entities.find((e) => e.id === chestId).used, true);
    assert.equal(sc.entities.find((e) => e.id === crateId).near, false, 'a trap works once');
    assert.deepEqual(t.errors, []);
    console.log('E2E-TOUCH OK');
  } finally {
    await t.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
