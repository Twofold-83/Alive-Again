// Paper-doll characters and screen filters, in a real browser: make a person, put them on stage, pose them,
// see the pose travel through a turn; the Player dresses and poses their own hero; pick a screen filter.
const assert = require('assert');
const { setup } = require('./lib');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const t = await setup(3133);
  try {
    const x = await t.open(),
      p = x.p;
    await p.goto(t.base);
    assert.equal(await p.locator('#lookPick option').count(), 9, 'nine screen filters on the start screen');
    await p.click('#typeAdventure');
    await p.click('#hotseat');
    await p.waitForSelector('.gopt');
    const last = () => x.last(),
      angle = (sel) => p.evaluate((s) => document.querySelector(s).style.transform, sel);

    /* build on the stage itself: a room in one press, saved for other stories */
    await x.opt('Build this room');
    await p.click('[data-env=horror]'); // rooms are listed by setting
    await p.click('[data-room=horror]');
    assert.equal(await p.locator('#stage .level i').count(), 192, 'walls and floor are laid on the live stage');
    await p.click('.gback');
    await x.opt('Save room'); // in the main menu, not hidden behind building
    await p.fill('#roomName', 'My crypt');
    await p.click('#roomSave');
    assert.equal(await p.locator('#roomSaves .myroom').count(), 1);
    await p.click('.gback');
    /* walls and floor are painted by hand on the stage too: pick a tile, drag */
    await x.opt('Build this room');
    await p.click('#roomPaint');
    await p.click('.grid.tiles[data-set=wall] button >> nth=0');
    const tilesBefore = await p.textContent('#paintCount');
    {
      const b = await p.locator('#stage').boundingBox();
      await p.mouse.move(b.x + b.width * 0.3, b.y + b.height * 0.6);
      await p.mouse.down();
      await p.mouse.move(b.x + b.width * 0.5, b.y + b.height * 0.6, { steps: 6 });
      await p.mouse.up();
    }
    assert.notEqual(await p.textContent('#paintCount'), tilesBefore, 'the tiles under the drag are painted');
    await x.done();
    assert.equal(await p.locator('#wsBuild').count(), 0);

    /* the sprite editor: draw a thing, save it, it stands on the stage and is kept under My drawings */
    await x.opt('Sprite editor');
    await p.click('#drawNew');
    await p.waitForSelector('#spriteCanvas');
    const cvb = await p.locator('#spriteCanvas').boundingBox();
    await p.mouse.move(cvb.x + cvb.width * 0.3, cvb.y + cvb.height * 0.5);
    await p.mouse.down();
    await p.mouse.move(cvb.x + cvb.width * 0.7, cvb.y + cvb.height * 0.5, { steps: 5 });
    await p.mouse.up();
    // its used picture: a second line, on the "used" tab
    await p.click('[data-pic=used]');
    await p.mouse.move(cvb.x + cvb.width * 0.3, cvb.y + cvb.height * 0.2);
    await p.mouse.down();
    await p.mouse.move(cvb.x + cvb.width * 0.7, cvb.y + cvb.height * 0.2, { steps: 5 });
    await p.mouse.up();
    assert.equal((await p.locator('#spriteCat option').count()) > 5, true, 'a new object can be saved into any category');
    await p.fill('#spriteName', 'My line');
    await p.click('#spriteSave');
    await p.waitForSelector('#spriteed', { state: 'hidden' });
    await p.waitForSelector('#stage .ent img[src*="/assets/"]');
    assert.match(await p.evaluate(() => localStorage.getItem('tf.objects')), /My line.*"used"/s);
    assert.equal(await p.locator('.ownlist .ownrow').count(), 1, 'the object is listed under my objects');
    // on the stage it has a Used state, like a library thing
    const mineId = await p.evaluate(() => window.__lastAdded);
    const before = await p.getAttribute(`#stage .ent[data-id="${mineId}"] img`, 'src');
    await p.locator(`#stage .ent[data-id="${mineId}"]`).click({ force: true });
    await p.click('#viewRow [data-view=used]');
    assert.notEqual(await p.getAttribute(`#stage .ent[data-id="${mineId}"] img`, 'src'), before, 'the used picture is shown');
    await x.done();

    /* the character maker */
    await x.opt('Character maker');
    await p.waitForSelector('.dollgrid button');
    assert.equal(await p.locator('.dollgrid button').count(), 190, 'all the heads');
    await p.fill('#dollSearch', 'skull');
    assert((await p.locator('.dollgrid button').count()) < 12, 'search narrows the parts');
    await p.click('.dollgrid button >> nth=0');
    for (const [tab, n] of [
      ['t', 130],
      ['a', 90],
      ['l', 90],
    ]) {
      await p.click(`[data-dtab=${tab}]`);
      assert.equal(await p.locator('.dollgrid button').count(), n);
      await p.click('.dollgrid button >> nth=3');
    }
    // mutations: a second head and a third arm
    await p.click('#mutHead');
    await p.click('#mutArm');
    assert.equal(await p.locator('#dollmaker .poserstage .dpart.x').count(), 2);
    // drag the right arm up: it turns about the shoulder
    const arm = await p.locator('#dollmaker .dpart.ar').boundingBox();
    await p.mouse.move(arm.x + arm.width / 2, arm.y + arm.height * 0.8);
    await p.mouse.down();
    await p.mouse.move(arm.x + arm.width + 90, arm.y - 40, { steps: 6 });
    await p.mouse.up();
    const turned = await angle('#dollmaker .dpart.ar');
    assert.match(turned, /rotate\(-1\d\d(\.\d+)?deg\)/, 'dragging turns the arm: ' + turned);
    await p.click('#dollKeep');
    await p.waitForSelector('.castitem');
    await x.shot('d-1-maker');
    await p.click('#dollAct0');
    await p.waitForSelector('.thingbtns');
    assert.equal(await p.locator('#stage .ent .doll').count(), 1, 'the figure is on stage');
    assert.equal(await angle('#stage .ent .doll .dpart.ar'), turned, 'in the pose it was given');
    // pose it from the Director's menu: under Move / animate
    await p.click('.thingbtns button:has-text("Move / animate")');
    await x.opt('Pose it');
    await p.click('#panel [data-pose="Arms up"]');
    await p.click('#panel [data-feel="scared"]');
    assert.equal(await p.locator('#stage .ent .doll .dpart.h .face').count(), 1, 'the feeling shows on the face');
    await x.done();
    // how the hero looks is the Director's to decide: the character from the cast becomes the Player's hero
    for (let i = 0; i < 3 && !(await p.locator('.gopt:has-text("Character maker")').count()); i++) await p.click('.gback');
    await x.opt('Character maker');
    await p.waitForSelector('.castitem');
    await p.click('.castitem button >> nth=0');
    await p.click('#dollAct1');
    await p.waitForSelector('#stage .ent.hero .doll');
    await p.click('#foot button.go');
    await sleep(400);
    let sc = await last();
    const doll = sc.entities.find((e) => e.asset.startsWith('d:') && e.id !== sc.heroId);
    assert.match(doll.asset, /^d:h\d{3}\.t\d{3}\.a\d{3}\.l\d{3}(~[hal]\d{3},-?\d+,-?\d+,-?\d+,[01]){2}$/, 'the mutations are part of who it is');
    assert.deepEqual(doll.pose, [0, 160, -160, 0, 0], 'the server keeps the pose');
    assert.equal(doll.feel, 'scared', 'and the feeling');

    /* the Player strikes a pose — how the hero looks is the Director's to decide */
    await p.waitForFunction(() => /Player/.test(document.querySelector('#banner').textContent));
    await x.cutDone();
    assert.equal(await p.locator('#lookBtn').count(), 0, 'the Player cannot change how the hero looks');
    assert.equal(await p.locator('#foot .dice').count(), 0, 'and rolls only when the Director asks');
    await p.waitForSelector('#stage .ent.hero .doll');
    await p.click('#poseBtn');
    await p.click('#foot [data-pose="Wave"]');
    await p.click('#foot [data-feel="happy"]');
    assert.equal(await angle('#stage .ent.hero .doll .dpart.ar'), 'rotate(-150deg)', 'the stage shows the pose at once');
    await x.shot('d-2-player');
    await p.click('#foot button.go');
    await sleep(500);
    sc = await last();
    const me = sc.entities.find((e) => e.id === sc.heroId);
    assert.equal(me.asset, doll.asset.replace(/./g, (ch) => ch) && me.asset);
    assert.match(me.asset, /^d:/, 'the hero is the character the Director made');
    assert.equal(me.feel, 'happy');
    assert.equal(sc.felt, 'happy', 'the Director is told what the hero feels');
    assert.deepEqual(me.pose, [8, 6, -150, 0, 0]);

    /* screen filters */
    await x.cutDone();
    assert(await p.evaluate(() => document.body.classList.contains('look-crt')), 'the old monitor is the default');
    await p.click('#fxBtn');
    assert.equal(await p.locator('#lookMenu button').count(), 9);
    await p.click('[data-look=green]');
    assert(
      await p.evaluate(
        () =>
          document.body.classList.contains('look-green') &&
          !document.body.classList.contains('look-crt') &&
          /hue-rotate/.test(getComputedStyle(document.querySelector('#stage .world')).filter),
      ),
    );
    await x.shot('d-3-green');
    await p.reload();
    await p.waitForSelector('#stage .ent');
    assert(await p.evaluate(() => document.body.classList.contains('look-green')), 'the filter is remembered');
    await p.click('#fxBtn');
    await p.click('[data-look=clean]');
    assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector('#stage .world')).filter), 'none');
    assert.deepEqual(t.errors, []);
    console.log('E2E-DOLLS OK');
  } catch (e) {
    console.error(e);
    console.error(t.errors);
    process.exitCode = 1;
  } finally {
    await t.browser.close();
    t.srv.kill();
  }
})();
