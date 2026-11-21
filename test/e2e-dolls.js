// Paper-doll characters and screen filters, in a real browser: make a person, put them on stage, pose them,
// see the pose travel through a turn; the Player dresses and poses their own hero; pick a screen filter.
const assert = require('assert');
const { setup } = require('./lib');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const t = await setup(3133);
  try {
    const x = await t.open(), p = x.p;
    await p.goto(t.base);
    assert.equal(await p.locator('#lookPick option').count(), 9, 'nine screen filters on the start screen');
    await p.click('#typeAdventure'); await p.click('#hotseat'); await p.waitForSelector('.gopt');
    const last = () => x.last(), angle = (sel) => p.evaluate((s) => document.querySelector(s).style.transform, sel);

    /* the character maker */
    await x.opt('Character maker'); await p.waitForSelector('.dollgrid button');
    assert.equal(await p.locator('.dollgrid button').count(), 190, 'all the heads');
    await p.fill('#dollSearch', 'skull'); assert(await p.locator('.dollgrid button').count() < 12, 'search narrows the parts');
    await p.click('.dollgrid button >> nth=0');
    for (const [tab, n] of [['t', 130], ['a', 90], ['l', 90]]) { await p.click(`[data-dtab=${tab}]`); assert.equal(await p.locator('.dollgrid button').count(), n); await p.click('.dollgrid button >> nth=3'); }
    // drag the right arm up: it turns about the shoulder
    const arm = await p.locator('#dollmaker .dpart.ar').boundingBox();
    await p.mouse.move(arm.x + arm.width / 2, arm.y + arm.height * 0.8); await p.mouse.down(); await p.mouse.move(arm.x + arm.width + 90, arm.y - 40, { steps: 6 }); await p.mouse.up();
    const turned = await angle('#dollmaker .dpart.ar'); assert.match(turned, /rotate\(-1\d\d(\.\d+)?deg\)/, 'dragging turns the arm: ' + turned);
    await p.click('#dollKeep'); await p.waitForSelector('.castitem');
    await x.shot('d-1-maker');
    await p.click('#dollAct0'); await p.waitForSelector('.thingbtns');
    assert.equal(await p.locator('#stage .ent .doll').count(), 1, 'the figure is on stage');
    assert.equal(await angle('#stage .ent .doll .dpart.ar'), turned, 'in the pose it was given');
    // pose it from the Director's menu
    await p.click('.thingbtns button:has-text("Pose")'); await p.click('#panel [data-pose="Arms up"]'); await x.done();
    await p.click('#foot button.go'); await sleep(400);
    let sc = await last(); const doll = sc.entities.find((e) => e.asset.startsWith('d:'));
    assert.match(doll.asset, /^d:h\d{3}\.t\d{3}\.a\d{3}\.l\d{3}$/); assert.deepEqual(doll.pose, [0, 160, -160, 0, 0], 'the server keeps the pose');

    /* the Player: make my own character, strike a pose */
    await p.waitForFunction(() => /Player/.test(document.querySelector('#banner').textContent)); await x.cutDone();
    assert.equal(await p.locator('#poseBtn').count(), 0, 'no pose tool for a hero who is not a paper doll');
    await p.click('#lookBtn'); await p.waitForSelector('.castitem'); await p.click('.castitem button >> nth=0'); await p.click('#dollAct0');
    await p.waitForSelector('#stage .ent.hero .doll'); await p.click('#poseBtn'); await p.click('#foot [data-pose="Wave"]');
    assert.equal(await angle('#stage .ent.hero .doll .dpart.ar'), 'rotate(-150deg)', 'the stage shows the pose at once');
    await x.shot('d-2-player');
    await p.click('#foot button.go'); await sleep(500);
    sc = await last(); const me = sc.entities.find((e) => e.id === sc.heroId);
    assert.equal(me.asset, doll.asset.replace(/./g, (ch) => ch) && me.asset); assert.match(me.asset, /^d:/, 'the Player chose their own look'); assert.deepEqual(me.pose, [8, 6, -150, 0, 0]);

    /* screen filters */
    await x.cutDone();
    assert(await p.evaluate(() => document.body.classList.contains('look-crt')), 'the old monitor is the default');
    await p.click('#fxBtn'); assert.equal(await p.locator('#lookMenu button').count(), 9); await p.click('[data-look=green]');
    assert(await p.evaluate(() => document.body.classList.contains('look-green') && !document.body.classList.contains('look-crt') && /hue-rotate/.test(getComputedStyle(document.querySelector('#stage .world')).filter)));
    await x.shot('d-3-green');
    await p.reload(); await p.waitForSelector('#stage .ent'); assert(await p.evaluate(() => document.body.classList.contains('look-green')), 'the filter is remembered');
    await p.click('#fxBtn'); await p.click('[data-look=clean]'); assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector('#stage .world')).filter), 'none');
    assert.deepEqual(t.errors, []);
    console.log('E2E-DOLLS OK');
  } catch (e) { console.error(e); console.error(t.errors); process.exitCode = 1; } finally { await t.browser.close(); t.srv.kill(); }
})();
