// The Player's click menu in an adventure, a clickable thing that answers by itself, and a trap.
const assert = require('assert');
const { setup } = require('./lib');

(async () => {
  const t = await setup(3135);
  try {
    const x = await t.open(),
      p = x.p;
    const { side } = x;
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
    /* the Director's shelf under the stage: keep a thing for later, put it out again with one press */
    await p.locator(`#stage .ent[data-id="${chestId}"]`).click({ force: true });
    await p.click('#prepAdd');
    assert.equal(await p.locator('#prep .preptile').count(), 1);
    const before = await p.locator('#stage .ent').count();
    await p.click('#prep .preptile .pick');
    assert.equal(await p.locator('#stage .ent').count(), before + 1, 'one press puts it on the stage');
    await p.locator(`#stage .ent[data-id="${await p.evaluate(() => window.__lastAdded)}"]`).click({ force: true });
    await p.click('.thingbtns button:has-text("Remove")');
    await p.click('.gback').catch(() => {});
    /* the base point: a strip on the floor shows where a thing stands; it can be made deeper, and solid */
    await p.locator(`#stage .ent[data-id="${chestId}"]`).click({ force: true });
    await p.click('.thingbtns button:has-text("Base point")');
    assert.equal(await p.locator('#stage .basebar.on').count(), 1, 'the base is shown on the stage');
    const thin = (await p.locator('#stage .basebar.on').boundingBox()).height;
    await p.click('[data-depth="2"]');
    assert((await p.locator('#stage .basebar.on').boundingBox()).height > thin * 3, 'two tiles deep');
    await p.click('#baseDown');
    await p.click('.gdone');
    assert.match(await p.textContent('.thingbtns'), /Base point ✓/);
    assert.equal(await p.locator('.thingbtns button:has-text("Solid")').count(), 1, 'any thing can be made solid, right here');
    await p.click('.gback').catch(() => {});
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
    const at = (id) =>
      p.evaluate((i) => {
        const s = document.querySelector(`#stage .ent[data-id="${i}"]`).style;
        return [parseFloat(s.left) / 100, parseFloat(s.top) / 100];
      }, id);
    const look = async () => {
      await p.locator(`#stage .ent[data-id="${chestId}"]`).click({ force: true });
      await p.waitForSelector('.clickmenu');
      assert.match(
        await p.textContent('.clickmenu'),
        /^Old chestLook atUseOpennever mind$/,
        'a clickable thing offers its actions, and nothing else',
      );
      await p.click('.clickmenu button:has-text("Look at")');
    };
    /* a clickable thing answers only to someone standing close */
    await p.evaluate((id) => {
      window.__far = id;
    }, chestId);
    {
      const [cx, cy] = await at(chestId),
        [hx, hy] = await x.heroPos();
      if (Math.hypot((cx - hx) * 16, (cy - hy) * 12) > 3) {
        await look();
        assert.match(await p.textContent('#reaction'), /too far away/, 'from across the room it is too far away');
        await p.click('#reaction');
        assert.equal(await p.locator(`#stage .ent[data-id="${chestId}"] img[src*=".used."]`).count(), 0);
      }
      const st = await p.locator('#stage').boundingBox();
      await p.click('#walkBtn');
      await p.mouse.click(st.x + st.width * cx, st.y + st.height * Math.min(0.97, cy + 0.06)); // walk up to it
      await p.waitForFunction(() => /back/.test(document.querySelector('#walkBtn').textContent));
      await p.waitForTimeout(3500);
    }
    await look();
    assert.match(await p.textContent('#reaction'), /Scratches all round the lock/, 'the thing answers at once');
    assert.match(await p.getAttribute(`#stage .ent[data-id="${chestId}"] img`, 'src'), /chest\.used\.png/, 'and now looks used');
    await p.click('#reaction');
    /* walking up to the crate springs the trap: the turn goes to the Director by itself */
    await p.click('#walkBtn'); // take the walk back: one walk a turn
    {
      const [cx, cy] = await at(crateId),
        st = await p.locator('#stage').boundingBox();
      await p.click('#walkBtn');
      await p.mouse.click(st.x + st.width * cx, st.y + st.height * Math.min(0.97, cy + 0.05));
    }
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
