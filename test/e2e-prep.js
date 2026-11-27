// Preparing a campaign: a stage with no turns, Save / Save as / Load, and a test as the Player that is undone afterwards.
const assert = require('assert');
const { setup } = require('./lib');

(async () => {
  const t = await setup(3136);
  try {
    const x = await t.open(),
      p = x.p;
    const banner = () => p.textContent('#banner'),
      campaigns = () => p.evaluate(() => JSON.parse(localStorage.getItem('tf.campaigns') || '[]')),
      things = () => p.locator('#stage .ent').count();
    await p.goto(t.base);
    await p.click('#typeAdventure');
    await p.click('#prepCampaign');
    await p.waitForSelector('.gopts');
    assert.match(await banner(), /Preparing a campaign — not saved yet/);
    assert(await p.isDisabled('#campQuickSave'), 'nothing to save over yet');
    assert.match(await p.textContent('#foot'), /Test as Player/);
    assert.equal(await p.locator('#foot button:has-text("Begin the story")').count(), 0, 'there are no turns here');

    /* build something, then Save as: the stage goes on the map, the map is kept as a campaign */
    await x.add('crate');
    await x.done();
    await x.opt('Campaign');
    await p.fill('#campAsName', 'Night shift');
    await p.click('#campSaveAs');
    await p.waitForFunction(() => /Night shift/.test(document.querySelector('#banner').textContent));
    let all = await campaigns();
    assert.equal(all.length, 1);
    assert.equal(all[0].scenes.length, 1);
    assert.equal(all[0].scenes[0].scene.entities.length, 2, 'the hero and the crate');

    /* more work, then the classic Save: over the same campaign */
    await p.click('.gback');
    await x.add('barrel');
    await x.done();
    await p.click('#campQuickSave');
    await p.waitForFunction(() => JSON.parse(localStorage.getItem('tf.campaigns'))[0].scenes[0].scene.entities.length === 3);
    all = await campaigns();
    assert.equal(all.length, 1, 'saved over the campaign being worked on');
    assert.equal(all[0].name, 'Night shift');

    /* test it as the Player: ordinary play — and all of it is undone when the test ends */
    const [hx0, hy0] = await x.heroPos();
    await p.click('#testStart');
    await x.side('Player');
    await x.cutDone();
    assert.match(await banner(), /Test play/);
    await x.walk(0.3, 0.75);
    await p.fill('#sayInput', 'Is anybody here?');
    await x.toDirector();
    assert.match(await banner(), /Test play.*Director/);
    assert.equal((await x.state()).turn, 2);
    await x.add('skull');
    await x.done();
    assert.equal(await things(), 4);
    await p.click('#testStop');
    await p.waitForFunction(() => /Preparing the campaign/.test(document.querySelector('#banner').textContent));
    const s = await x.state();
    assert.equal(s.turn, 0);
    assert.equal(s.testing, false);
    assert.equal(s.historyLen, 0, 'nothing of the test is left in the story');
    assert.equal(await things(), 3, 'the stage is what it was before the test');
    const [hx1, hy1] = await x.heroPos();
    assert(Math.abs(hx1 - hx0) < 0.005 && Math.abs(hy1 - hy0) < 0.005, 'the hero stands where they stood');
    assert.match(await p.textContent('#foot'), /Test as Player/);

    /* every campaign has a title screen of its own: chosen here, saved with it, back when it is loaded */
    await x.opt('Campaign');
    assert.match(await p.textContent('#titleCard'), /Title screen of this campaign/);
    await p.fill('#infoTitle', 'The Night Shift');
    await p.fill('#infoText', 'Nobody leaves before dawn.');
    await p.waitForFunction(() => /The Night Shift/.test(document.querySelector('#titlePreview').textContent));
    await p.waitForTimeout(700);
    await p.click('#campSaveCur');
    await p.waitForFunction(() => (JSON.parse(localStorage.getItem('tf.campaigns'))[0].title || {}).title === 'The Night Shift');
    assert.equal((await campaigns())[0].title.text, 'Nobody leaves before dawn.');
    await p.click('.gback');

    /* Save as a second campaign with a title of its own, then load the first again */
    await x.add('lantern');
    await x.done();
    await x.opt('Campaign');
    await p.fill('#infoTitle', 'Day Shift');
    await p.fill('#infoText', '');
    await p.waitForTimeout(700);
    await p.fill('#campAsName', 'Day shift');
    await p.click('#campSaveAs');
    await p.waitForFunction(() => /Day shift/.test(document.querySelector('#banner').textContent));
    assert.equal((await campaigns()).length, 2);
    assert.equal((await campaigns()).find((c) => c.name === 'Day shift').title.title, 'Day Shift');
    assert.equal(await things(), 4);
    await p.click('#campList .myroom:has-text("Night shift") button.grow');
    await p.waitForFunction(() => /Night shift/.test(document.querySelector('#banner').textContent));
    assert.equal(await things(), 3, 'the stage shows the loaded campaign');
    await p.waitForFunction(() => document.querySelector('#infoTitle').value === 'The Night Shift');
    for (let i = 0; i < 20 && (await x.state()).info.title !== 'The Night Shift'; i++) await p.waitForTimeout(100);
    assert.deepEqual(
      [(await x.state()).info.title, (await x.state()).info.text],
      ['The Night Shift', 'Nobody leaves before dawn.'],
      'and its title screen',
    );

    /* the story remembers the stage as it was saved, even in a new browser tab */
    await p.click('#campQuickSave');
    await p.waitForTimeout(400);
    await p.evaluate(() => sessionStorage.clear());
    await p.reload();
    await p.waitForSelector('.gopts');
    assert.equal(await things(), 3);
    assert.deepEqual(t.errors, []);
    console.log('E2E-PREP OK');
  } finally {
    await t.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
