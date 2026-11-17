// Version-2 features, played in "both sides" mode on a phone and on a desktop. Usage: node test/e2e-v2.js [shotDir]
const { chromium, devices } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const assert = require('assert');
const shots = process.argv[2];
(async () => {
  const PORT = 3125, base = `http://localhost:${PORT}`;
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'twofold-'));
  const srv = spawn('node', [path.join(__dirname, '..', 'server.js')], { env: { ...process.env, PORT, DATA_DIR: dataDir, BOT_DELAY_MS: '200' }, stdio: 'inherit' });
  await new Promise((r) => setTimeout(r, 700));
  const browser = await chromium.launch();
  const errors = [];
  const open = async (opts) => { const c = await browser.newContext(opts); await c.addInitScript(() => localStorage.setItem('tf.dmode', 'studio')); const p = await c.newPage(); p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/ERR_|Failed to load/.test(m.text())) errors.push(m.text()); }); return p; };
  const shot = async (p, n) => { if (shots) await p.screenshot({ path: path.join(shots, n + '.png') }); };
  const cutDone = (p) => p.waitForFunction(() => !document.querySelector('#stage').classList.contains('cut'), null, { timeout: 30000 });
  const S = (p) => p.evaluate(async () => (await (await fetch(`/api/rooms/${location.hash.slice(1)}/history`)).json()).history.at(-1).scene);
  try {
    /* ---- phone, both sides ---- */
    const p = await open({ ...devices['iPhone 13'] });
    await p.goto(base); await p.tap('#hotseat');
    await p.waitForSelector('#foot button.go:not([disabled])');
    assert.match(await p.textContent('#banner'), /both sides/);
    // story type: adventure -> stats + inventory appear
    await p.tap('.typerow button:nth-of-type(2)');
    await p.waitForSelector('#sheet .chip.stat');
    assert.equal(await p.locator('#sheet .chip.stat').count(), 2);
    // cast: a key and a wizard
    const box = await p.locator('#stage').boundingBox();
    const cdp = await p.context().newCDPSession(p);
    const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
    const swipe = async (x0, y0, x1, y1, ms = 500) => { await touch('touchStart', x0, y0); for (let i = 1; i <= 10; i++) { await p.waitForTimeout(ms / 10); await touch('touchMove', x0 + (x1 - x0) * i / 10, y0 + (y1 - y0) * i / 10); } await touch('touchEnd'); await p.waitForTimeout(100); };
    const centre = async (sel) => { const b = await p.locator(sel).boundingBox(); return [b.x + b.width / 2, b.y + b.height / 2]; };
    await p.fill('input[type=search]', 'old key'); await p.tap('.grid button');
    await swipe(...await centre('.ent.sel'), box.x + box.width * 0.15, box.y + box.height * 0.88, 700);   // key to a corner, clear of the hero
    await p.fill('input[type=search]', 'wizard'); await p.tap('.grid button');
    await p.fill('.seltools input', 'Take the key. You will need it.');
    await p.selectOption('.seltools select >> nth=0', 'float');
    // record a move for the wizard
    await swipe(...await centre('.ent.sel'), box.x + box.width * 0.3, box.y + box.height * 0.45, 700);   // wizard up and left, clear of the others
    await p.tap('[data-tab=anim]'); await p.tap('#recBtn');
    await swipe(...await centre('.ent.sel'), box.x + box.width * 0.85, box.y + box.height * 0.5, 600);
    await p.waitForFunction(() => /1 moving/.test(document.querySelector('#animUsed').textContent));
    // draw a stroke
    await p.tap('#drawBtn');
    await swipe(box.x + 30, box.y + 40, box.x + 200, box.y + 90, 700);
    assert.equal(await p.locator('#stage .draw polyline').count(), 1);
    // extras: weather, title card, choices, dice
    await p.tap('[data-tab=fx]');
await p.tap('[data-mark="weather=snow"]'); await p.tap('[data-mark="burst=shake"]');
    await p.fill('.card input[placeholder^="e.g."]', 'Chapter 1');
    await p.fill('input[placeholder="Choice 1"]', 'Grab the key'); await p.fill('input[placeholder="Choice 2"]', 'Run');
    await p.tap('[data-mark="rollWant=6"]');
    await p.fill('#foot input', 'Snow falls. A wizard drifts by.');
    await shot(p, 'v2-1-director');
    await p.tap('#foot button.go');
    // cut scene plays, then I am the Player
    await p.waitForFunction(() => document.querySelector('#stage').classList.contains('cut'));
    await p.waitForFunction(() => document.querySelector('.cardov').textContent === 'Chapter 1');
    await shot(p, 'v2-2-cut');
    await cutDone(p);
    let sc = await S(p);
    assert.equal(sc.tracks.length, 1); assert(sc.tracks[0].pts.length >= 9); assert.equal(sc.drawing.length, 1);
    assert.equal(sc.weather, 'snow'); assert.equal(sc.card, 'Chapter 1'); assert.equal(sc.roll.by, 'director'); assert(sc.roll.value >= 1 && sc.roll.value <= 6);
    assert.deepEqual(sc.choices, ['Grab the key', 'Run']); assert.equal(sc.sheet.stats.length, 2);
    await p.waitForSelector('#foot .choices');
    assert.match(await p.textContent('#banner'), /Player/);
    // Player: take a choice, reach for the key, emote, roll d20
    await p.tap('#foot .choices button');
    const key = sc.entities.find((e) => e.asset === 's:old-key');
    await p.tap(`.ent[data-id="${key.id}"]`);
    await p.waitForSelector('.ent.target');
    await p.tap('#foot .emotes button:nth-child(4)');
    await p.tap('#foot .dice'); await p.tap('#foot .dice');
    assert.match(await p.textContent('.strip.act'), /reaches for .*Grab the key.*d20/);
    await shot(p, 'v2-3-player');
    await p.tap('#foot button.go');
    await p.waitForFunction(() => /Director/.test(document.querySelector('#banner').textContent));
    await cutDone(p);
    sc = await S(p);
    assert.equal(sc.target, key.id); assert.equal(sc.action, 'Grab the key'); assert.equal(sc.roll.by, 'player'); assert.equal(sc.roll.sides, 20);
    assert.equal(sc.tracks.length, 0); assert.equal(sc.card, ''); assert.equal(sc.choices.length, 0);
    assert.equal(sc.entities.find((e) => e.id === sc.heroId).emote, '😱');
    // Director grants it, lowers health
    await p.waitForSelector('.card.ask');
    await p.tap('.card.ask button.primary');
    assert.equal(await p.locator('#sheet .chip.item').count(), 1);
    await p.tap('#sheet .chip.stat button');
    await shot(p, 'v2-4-director-grant');
    await p.tap('#foot button.go');
    await p.waitForFunction(() => /Player/.test(document.querySelector('#banner').textContent));
    await cutDone(p);
    sc = await S(p);
    assert.equal(sc.sheet.inv.length, 1); assert.equal(sc.sheet.inv[0].asset, 's:old-key'); assert.equal(sc.sheet.stats[0].value, 4);
    assert(!sc.entities.some((e) => e.id === key.id));
    // Player uses the key
    await p.tap('#sheet .chip.item');
    assert.match(await p.textContent('.strip.act'), /uses/);
    await p.tap('#foot button.go');
    await p.waitForFunction(() => /Director/.test(document.querySelector('#banner').textContent));
    await cutDone(p);
    await p.waitForSelector('.card.ask');
    await p.tap('.card.ask button.primary');
    assert.equal(await p.locator('#sheet .chip.item').count(), 0);
    // story replay
    await p.tap('#top button'); await p.waitForSelector('#story:not([hidden])');
    await p.tap('#storyPrev'); await p.tap('#storyPlay');
    await p.waitForFunction(() => document.querySelector('#storyStage').classList.contains('cut'));
    await p.tap('#storyClose');

    /* ---- desktop: solo adventure against the AI Director ---- */
    const d = await open({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 });
    await d.goto(base); await d.fill('#name', 'Sam'); await d.click('#soloPlayer');
    await d.waitForSelector('#foot button.go'); await cutDone(d);
    await d.waitForSelector('#sheet .chip.stat'); await d.waitForSelector('#foot .choices button');
    const stageBox = await d.locator('#stage').boundingBox(), panelBox = await d.locator('#right').boundingBox();
    assert(panelBox.x >= stageBox.x + stageBox.width - 2, 'desktop: tools sit to the right of the stage');
    await d.fill('#foot input >> nth=1', 'take it'); await d.keyboard.press('Control+Enter');
    await d.waitForFunction(() => /Waiting/.test(document.querySelector('#foot').textContent));
    await d.waitForSelector('#foot button.go', { timeout: 20000 }); await cutDone(d);
    await shot(d, 'v2-5-desktop');
    assert.deepEqual(errors, []);
    console.log('E2E-V2 OK');
  } finally { await browser.close(); srv.kill(); await new Promise((r) => setTimeout(r, 400)); try { fs.rmSync(dataDir, { recursive: true, force: true }); } catch { /* server was still saving */ } }
})().catch((e) => { console.error(e); process.exit(1); });
