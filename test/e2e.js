// Two phones play a few turns against a real server. Usage: node test/e2e.js [shotDir]
const { chromium, devices } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const assert = require('assert');
const shots = process.argv[2];
(async () => {
  const PORT = 3123, base = `http://localhost:${PORT}`;
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'twofold-'));
  const start = () => spawn('node', [path.join(__dirname, '..', 'server.js')], { env: { ...process.env, PORT, DATA_DIR: dataDir }, stdio: 'inherit' });
  let srv = start();
  await new Promise((r) => setTimeout(r, 700));
  const browser = await chromium.launch();
  const errors = [];
  const phone = async () => { const c = await browser.newContext({ ...devices['iPhone 13'] }); await c.addInitScript(() => localStorage.setItem('tf.dmode', 'studio')); const p = await c.newPage(); p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/ERR_|Failed to load/.test(m.text())) errors.push(m.text()); }); return p; };
  const shot = async (p, n) => { if (shots) await p.screenshot({ path: path.join(shots, n + '.png') }); };
  const D = await phone(), P = await phone();
  try {
    // Director creates
    await D.goto(base); await D.fill('#name', 'Mia'); await D.tap('#newDirector');
    await D.waitForSelector('#foot button.go');
    const code = (await D.evaluate(() => location.hash)).slice(1);
    assert.match(code, /^[A-Z]{5}$/);
    assert(await D.isDisabled('#foot button.go'), 'cannot begin before player joins');
    // Director sets the stage
    await D.fill('input[type=search]', 'wizard'); await D.tap('.grid button');
    await D.fill('.seltools input', 'Welcome, traveller!');
    await D.tap('[data-tab=place]'); await D.tap('[data-mark="backdrop=b:forest"]');
    await D.fill('#foot input', 'A dark forest. Something is watching.');
    // generate + custom asset
    await D.tap('[data-tab=cast]'); await D.tap('#panel > .chips:not(.typerow) button:last-child');
    await D.fill('.maker input', 'green slime'); await D.tap('.maker .row button');
    await D.waitForSelector('.ent img.glyph');
    await D.waitForFunction(() => document.querySelector('.ent img.glyph').naturalWidth > 0);
    // Player joins via link
    await P.goto(`${base}/#${code}`); await P.fill('#name', 'Sam'); await P.tap('#joinBtn');
    await P.waitForSelector('#foot .status');
    assert.equal(await P.locator('.stage .ent').count(), 1, 'player must not see the uncommitted draft');
    await D.waitForSelector('#foot button.go:not([disabled])');
    await shot(D, '1-director-setup');
    await D.tap('#foot button.go');
    // Player turn
    await P.waitForSelector('#foot button.go');
    await P.waitForFunction(() => !document.querySelector('#stage').classList.contains('cut'), null, { timeout: 20000 });
    assert.equal(await P.locator('.stage .ent').count(), 3);
    assert.match(await P.textContent('.strip.narr'), /dark forest/);
    const box = await P.locator('#stage').boundingBox();
    await P.touchscreen.tap(box.x + box.width * 0.2, box.y + box.height * 0.6);
    await P.fill('#foot input:nth-of-type(1)', 'Who are you?');
    await P.fill('#foot input:nth-of-type(2)', 'draws a sword');
    await shot(P, '2-player-turn');
    // reload mid-turn: draft must survive
    await P.reload(); await P.waitForSelector('#foot button.go');
    assert.equal(await P.inputValue('#foot input:nth-of-type(2)'), 'draws a sword');
    await P.tap('#foot button.go');
    // Director sees it
    await D.waitForFunction(() => /draws a sword/.test(document.querySelector('.strip.act').textContent));
    await D.waitForFunction(() => !document.querySelector('#stage').classList.contains('cut'), null, { timeout: 20000 });
    assert.match(await D.textContent('.bubbles'), /Who are you\?/);
    const heroLeft = await D.evaluate(() => parseFloat(document.querySelector('.ent.hero').style.left));
    assert(Math.abs(heroLeft - 20) < 3, 'hero moved: ' + heroLeft);
    assert.equal(await D.inputValue('#foot input'), '', 'narration cleared for the new turn');
    await shot(D, '3-director-turn');
    // server restart mid-game: state persists, both reconnect by themselves
    srv.kill('SIGTERM'); await new Promise((r) => setTimeout(r, 500)); srv = start();
    await D.waitForFunction(() => document.querySelectorAll('#top .dot.on').length === 2, null, { timeout: 20000 });
    await D.fill('#foot input', 'The wizard vanishes.'); await D.tap('#foot button.go');
    await P.waitForFunction(() => /vanishes/.test(document.querySelector('.strip.narr').textContent), null, { timeout: 20000 });
    // timer: 30s setting then expiry is slow; instead verify clock runs & pauses when a player drops
    assert(await P.evaluate(() => /\d:\d\d/.test(document.querySelector('#tlabel').textContent)), 'clock visible');
    await D.context().setOffline(true); await D.evaluate(() => window.dispatchEvent(new Event('offline')));
    await D.close();
    await P.waitForFunction(() => /offline/.test(document.querySelector('#banner').textContent) && /⏸/.test(document.querySelector('#tlabel').textContent), null, { timeout: 15000 });
    // story viewer
    await P.waitForFunction(() => !document.querySelector('#stage').classList.contains('cut'), null, { timeout: 20000 });
    await P.tap('#top button'); await P.waitForSelector('#story:not([hidden])');
    assert.match(await P.textContent('#storyCap'), /Page 3 of 3/);
    await shot(P, '4-story');
    assert.deepEqual(errors, []);
    console.log('E2E OK', code);
  } finally { await browser.close(); srv.kill(); await new Promise((r) => setTimeout(r, 400)); try { fs.rmSync(dataDir, { recursive: true, force: true }); } catch { /* server was still saving */ } }
})().catch((e) => { console.error(e); process.exit(1); });
