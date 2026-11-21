// Phone mode on an emulated iPhone: chosen automatically, switchable, nothing hangs off the screen, touch controls work.
const assert = require('assert');
const { devices } = require('playwright');
const { setup } = require('./lib');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const t = await setup(3132);
  try {
    const ctx = await t.browser.newContext({ ...devices['iPhone 13'] }),
      p = await ctx.newPage();
    p.on('pageerror', (e) => t.errors.push(e.message));
    p.on('dialog', (d) => d.accept());
    const shot = async (n) => {
      if (t.shots) await p.screenshot({ path: `${t.shots}/${n}.png` });
    };
    const fits = async (what) =>
      assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${what}: nothing sticks out sideways`);
    const inView = async (sel) => {
      const b = await p.locator(sel).boundingBox(),
        v = p.viewportSize();
      assert(b && b.y >= 0 && b.y + b.height <= v.height + 1 && b.x >= 0 && b.x + b.width <= v.width + 1, `${sel} is on screen`);
      return b;
    };

    await p.goto(t.base);
    await sleep(400);
    assert(await p.evaluate(() => document.body.classList.contains('phone')), 'a phone gets the phone layout by itself');
    assert(await p.locator('#devicePick [data-dev=phone].on').count());
    await p.tap('#devicePick [data-dev=computer]');
    assert(!(await p.evaluate(() => document.body.classList.contains('phone'))));
    await p.tap('#devicePick [data-dev=phone]');
    assert.equal(await p.evaluate(() => localStorage.getItem('tf.device')), 'phone');
    await fits('start screen');
    await shot('ph-0-home');

    /* a story, one person on both sides */
    await p.tap('#typeAdventure');
    await p.tap('#hotseat');
    await p.waitForSelector('.gopt');
    await fits('director');
    await inView('#foot button.go');
    const stage = await p.locator('#stage').boundingBox();
    assert(Math.abs(stage.width - p.viewportSize().width) < 2, 'the stage is as wide as the phone');
    for (const sel of ['#top button >> nth=0', '.gopt >> nth=0', '#foot button.go']) {
      const b = await p.locator(sel).boundingBox();
      assert(b.height >= 40, `${sel} is big enough for a thumb (${b.height})`);
    }
    await p.tap('.gopt:has-text("Add something")');
    await p.tap('.gopt:has-text("Search by name")');
    await p.fill('input[type=search]', 'mage');
    await sleep(350);
    assert(await p.evaluate(() => document.body.classList.contains('typing')), 'typing makes room for the keyboard');
    assert((await p.locator('#stage').boundingBox()).width < stage.width * 0.6);
    await p.tap('.grid button');
    await p.locator('input[type=search]').blur();
    await sleep(350);
    await p.locator(`#stage .ent[data-id="${await p.evaluate(() => window.__lastAdded)}"]`).tap({ force: true }); // pressing it on the stage opens its settings
    await p.waitForSelector('.thingbtns');
    await sleep(350);
    assert.equal(await p.locator('#stage .ent').count(), 2);
    await shot('ph-1-director');
    await p.tap('.gdone');
    await inView('#foot button.go');
    /* build scene on a phone: one row of buttons that scrolls, stage above the tools */
    await p.tap('.gopt:has-text("Build this room")');
    await p.tap('#roomPaint');
    await p.waitForSelector('#wsStage');
    await fits('build scene');
    const bar = await p.locator('#workshop > header').boundingBox();
    assert(bar.height < 125, `the toolbar is two tidy rows (${bar.height})`);
    await inView('#wsClose');
    await inView('#wsAdd');
    const ws = await p.locator('#wsStage').boundingBox(),
      tools = await p.locator('.wstools').boundingBox();
    assert(tools.y >= ws.y + ws.height - 1, 'tools are under the stage');
    await shot('ph-2-build');
    await p.tap('#wsClose');
    await p.tap('#foot button.go');
    await p.waitForFunction(() => /Player/.test(document.querySelector('#banner').textContent));
    await sleep(1800);
    await inView('#foot button.go');
    await fits('player');
    await p.tap('#walkBtn');
    const st2 = await p.locator('#stage').boundingBox();
    await p.touchscreen.tap(st2.x + st2.width * 0.8, st2.y + st2.height * 0.8);
    await p.waitForFunction(() => /back/.test(document.querySelector('#walkBtn').textContent));
    await shot('ph-3-player');

    /* dungeon mode: a thumb pad and three buttons */
    await p.goto(t.base);
    await sleep(300);
    await p.tap('#typeRpg');
    await p.tap('#soloPlayer');
    await p.waitForSelector('#rpgEnter');
    await p.tap('#rpgEnter');
    await p.waitForSelector('#rpgPad:not([hidden])');
    await fits('dungeon');
    await inView('#rpgStick');
    await inView('#padSword');
    const cv = await p.locator('#rpgCanvas').boundingBox();
    assert(Math.abs(cv.width - p.viewportSize().width) < 2);
    const steps = () => p.evaluate(() => window.rpgDebug.st.stats.steps),
      s0 = await steps();
    const pad = await p.locator('#rpgStick').boundingBox(),
      mid = [pad.x + pad.width / 2, pad.y + pad.height / 2];
    for (const [dx, dy] of [
      [0.4, 0],
      [0, 0.4],
      [-0.4, 0],
      [0, -0.4],
    ]) {
      await p.mouse.move(...mid);
      await p.mouse.down();
      await p.mouse.move(mid[0] + pad.width * dx, mid[1] + pad.height * dy, { steps: 3 });
      await sleep(350);
      await p.mouse.up();
      await sleep(60);
    }
    assert((await steps()) > s0, 'the thumb pad walks the hero');
    assert.deepEqual(
      await p.evaluate(() => [...document.querySelectorAll('#rpgStick')].map((e) => e.dataset.dir)),
      [''],
      'letting go stops the hero',
    );
    const atk = await p.evaluate(() => window.rpgDebug.st.hero.atk);
    await p.tap('#padSword');
    await sleep(200);
    assert((await p.evaluate(() => window.rpgDebug.st.hero.atk)) > atk, 'the sword button swings');
    await shot('ph-4-dungeon');
    await p.tap('#devBtn');
    assert(!(await p.evaluate(() => document.body.classList.contains('phone'))), 'the top bar switches layouts');
    assert(await p.locator('#rpgPad').isHidden());
    await p.tap('#devBtn');
    assert.deepEqual(t.errors, []);
    console.log('E2E-PHONE OK');
  } catch (e) {
    console.error(e);
    console.error(t.errors);
    process.exitCode = 1;
  } finally {
    await t.browser.close();
    t.srv.kill();
  }
})();
