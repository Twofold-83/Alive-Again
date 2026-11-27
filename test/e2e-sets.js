// Invisible things and ways out, the hero's starting point, saved stage-sets, a saved game, the line on top,
// and a picture shown over the stage with a narration — with the Director and the Player on two screens.
const assert = require('assert');
const { setup } = require('./lib');

(async () => {
  const t = await setup(3137);
  try {
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
    const ents = (x) => x.p.locator('#stage .ent').count();
    const sel = (x, id) => x.p.locator(`#stage .ent[data-id="${id}"]`);

    /* ---- an invisible thing: faint for the Director, not there at all for the Player ---- */
    await D.add('wardrobe');
    const ghostly = await D.p.evaluate(() => window.__lastAdded);
    await D.p.click('#visibleToggle');
    assert.match(await D.p.textContent('#visibleToggle'), /Invisible to the Player/);
    assert.match(await D.p.getAttribute(`#stage .ent[data-id="${ghostly}"]`, 'class'), /unseen/);
    assert(Number(await sel(D, ghostly).evaluate((el) => getComputedStyle(el).opacity)) < 0.5, 'the Director sees it faintly');
    await D.done();
    await D.add('fridge');
    const fridge = await D.p.evaluate(() => window.__lastAdded);
    await D.done();
    /* the first room goes on the map; a second room, connected by a way out the Player cannot see */
    await D.opt('Map & campaigns');
    await D.p.click('#mapNew');
    await D.p.click('.mapact:has-text("Room next door")');
    await D.p.click('#mapClose');
    await D.p.waitForSelector('.gopts');
    let s = await D.state();
    assert.equal(s.scenes.length, 2);
    const there = s.scenes[1];
    /* two ways out: one the Player sees, one they do not */
    for (const hide of [false, true]) {
      await D.opt('Mood');
      await D.opt('Add an exit');
      await D.p.selectOption('#exitTo', there.id);
      if (hide) await D.p.click('#exitVisible');
      await D.done();
    }
    assert.equal(await D.p.locator('#stage .exit').count(), 2);
    assert.equal(await D.p.locator('#stage .exit.unseen').count(), 1, 'the Director sees the hidden sign faintly');
    await D.end();
    await P.p.waitForSelector('#foot input');
    await P.cutDone();
    assert.equal(await sel(P, ghostly).count(), 0, 'the Player does not see the invisible wardrobe');
    assert.equal(await sel(P, fridge).count(), 1);
    assert.equal(await P.p.locator('#stage .exit').count(), 1, 'the Player sees only the visible way out');
    {
      const ps = await P.state();
      assert(!ps.scene.entities.some((e) => e.id === ghostly), 'and is not even told it is there');
    }
    await P.end();
    await D.p.waitForSelector('.gopts');
    await D.cutDone();

    /* ---- the line on top can be switched off ---- */
    await D.opt('Story settings');
    await D.p.uncheck('#actLine');
    await D.p.check('#keepSets'); // and saved stage-sets on
    await D.p.waitForTimeout(400);
    s = await D.state();
    assert.equal(s.settings.actLine, false);
    assert.equal(s.settings.keepSets, true);
    await D.p.click('.gback');

    /* ---- saved stage-sets: the fridge is opened here, the story goes next door and comes back ---- */
    await sel(D, fridge).click({ force: true });
    await D.p.click('#viewRow [data-view=used]');
    await D.done();
    // the hero's starting point in this room
    const heroId = s.scene.heroId;
    await sel(D, heroId).click({ force: true });
    await D.p.click('#startToggle');
    assert.match(await D.p.textContent('#startToggle'), /Starting point ✓/);
    await D.p.waitForSelector('#stage .startmark');
    await D.done();
    await D.opt('Map & campaigns');
    await D.p.click(`.mapboard .node[data-node="${there.id}"]`);
    await D.p.click('#mapUse'); // go there: the first room is kept as it was left
    await D.p.waitForSelector('.gopts');
    s = await D.state();
    {
      const kept = s.scenes.find((d) => d.id !== there.id);
      const f =
        kept.scene.entities.find((e) => e.asset === 'p:' + (s.scene.entities.find((x) => x.id === fridge) || { asset: '' }).asset.slice(2)) ||
        kept.scene.entities.find((e) => /fridge/.test(e.asset));
      assert(f && f.used, 'the open fridge is kept in the room the story left');
      assert(kept.scene.start, 'with its starting point');
      // back again: the fridge is still open, and the hero stands at the starting point
      await D.opt('Map & campaigns');
      await D.p.click(`.mapboard .node[data-node="${kept.id}"]`);
      await D.p.click('#mapUse');
      await D.p.waitForSelector('.gopts');
      const imgs = await D.p.locator('#stage .ent img[src*="fridge"][src*=".used"]').count();
      assert.equal(imgs, 1, 'the fridge is still open when the story comes back');
      const hp = await D.p.evaluate((id) => {
        const st = document.querySelector(`#stage .ent[data-id="${id}"]`).style;
        return [parseFloat(st.left) / 100, parseFloat(st.top) / 100];
      }, heroId);
      assert(Math.abs(hp[0] - kept.scene.start.x) < 0.01 && Math.abs(hp[1] - kept.scene.start.y) < 0.01, 'the hero stands at the starting point');
    }

    /* ---- a picture over the stage, with a narration ---- */
    await D.opt(`Ask Player`);
    await D.opt('Show a picture');
    await D.p.setInputFiles('#panel input[type=file]', {
      name: 'pic.png',
      mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGP4z8DwHwyBNAMDAwMAZ/kH+a5lkwQAAAAASUVORK5CYII=', 'base64'),
    });
    await D.p.waitForSelector('#askPics button.on');
    await D.p.click('#picOver');
    await D.p.fill('#picNarr', 'The house remembers you.');
    await D.done();
    await D.end();
    await P.p.waitForSelector('#stageWrap #picture.over');
    await P.p.waitForFunction(() => /remembers you/.test(document.querySelector('#picture .picnarr').textContent));
    assert.equal(await P.p.locator('#stage .strip.act:not(:empty)').count(), 0, 'no orange line on top');
    await P.p.click('#picture');
    await P.p.click('#picture').catch(() => {});
    await P.p.waitForSelector('#picture', { state: 'hidden' }).catch(() => {});
    assert.equal(await sel(P, ghostly).count(), 0, 'still invisible');

    /* ---- the Director saves the game, and a new story goes on with it ---- */
    await P.end();
    await D.p.waitForSelector('.gopts');
    await D.cutDone();
    await D.opt('Story settings');
    await D.p.fill('#saveGameName', 'Ash Lane, night two');
    await D.p.click('#saveGameBtn');
    await D.p.waitForFunction(() => (JSON.parse(localStorage.getItem('tf.games') || '[]')[0] || {}).name === 'Ash Lane, night two');
    const before = await D.state();
    await D.p.goto(t.base);
    await D.p.click('#continueGame');
    await D.p.click('#savedGames .row:has-text("Ash Lane, night two") button:has-text("Both sides")');
    await D.p.waitForSelector('.gopts');
    const after = await D.state();
    assert.notEqual(after.code, before.code, 'a new story');
    assert.equal(after.turn, before.turn, 'at the turn where it was left');
    assert.equal(after.scenes.length, 2, 'with its map');
    assert.equal(after.settings.keepSets, true);
    assert.equal(after.scene.entities.length, before.scene.entities.length, 'and its stage');
    assert(
      after.scene.entities.some((e) => e.hidden),
      'invisible things stay invisible',
    );
    assert.equal(await ents(D), after.scene.entities.length);
    assert.deepEqual(t.errors, []);
    console.log('E2E-SETS OK');
  } finally {
    await t.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
