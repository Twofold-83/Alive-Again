// Shared helpers for the browser tests.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');

exports.setup = async (port, env = {}) => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'twofold-'));
  const start = () => spawn('node', [path.join(__dirname, '..', 'server.js')], { env: { ...process.env, PORT: port, DATA_DIR: dataDir, ...env }, stdio: 'inherit' });
  const t = { base: `http://localhost:${port}`, errors: [], srv: start(), shots: process.argv[2] };
  await new Promise((r) => setTimeout(r, 700));
  t.browser = await chromium.launch();
  t.restart = async () => { t.srv.kill('SIGTERM'); await new Promise((r) => setTimeout(r, 500)); t.srv = start(); };
  t.open = async () => {
    const p = await (await t.browser.newContext({ viewport: { width: 1366, height: 768 } })).newPage();
    p.on('pageerror', (e) => t.errors.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error' && !/ERR_|Failed to load/.test(m.text())) t.errors.push(m.text()); });
    p.on('dialog', (d) => d.accept());
    const x = {
      p,
      opt: (label) => p.click(`.gopt:has-text("${label}")`),
      done: () => p.click('.gdone'),
      end: () => p.click('#foot button.go'),
      cutDone: () => p.waitForFunction(() => !document.querySelector('#stage').classList.contains('cut'), null, { timeout: 60000 }),
      shot: async (n) => { if (t.shots) await p.screenshot({ path: path.join(t.shots, n + '.png') }); },
      last: () => p.evaluate(async () => (await (await fetch(`/api/rooms/${location.hash.slice(1)}/history`)).json()).history.at(-1).scene),
      heroPos: () => p.evaluate(() => { const s = document.querySelector('.ent.hero').style; return [parseFloat(s.left) / 100, parseFloat(s.top) / 100]; }),
      /** Record what the stage shows over time (for checking playback order). */
      watch: () => p.evaluate(() => { window.__seq = []; clearInterval(window.__w); window.__w = setInterval(() => { const st = document.querySelector('#stage'); const k = [st.querySelector('.weather').className.replace('weather', '').trim(), st.querySelector('.strip.narr').textContent, st.querySelector('.bubbles').textContent, st.querySelector('.strip.act').textContent, st.className.includes('b-shake') ? 'shake' : ''].join('|'); if (window.__seq.at(-1) !== k) window.__seq.push(k); }, 30); }),
      seen: () => p.evaluate(() => window.__seq),
      /** Drag the hero by a fraction of the stage size, slowly enough to be recorded as a walk. */
      dragHero: async (dx, dy = 0) => {
        const b = await p.locator('.ent.hero').boundingBox(), st = await p.locator('#stage').boundingBox();
        const x0 = b.x + b.width / 2, y0 = b.y + b.height - 3;
        await p.mouse.move(x0, y0); await p.mouse.down();
        for (let i = 1; i <= 14; i++) { await p.mouse.move(x0 + (st.width * dx * i) / 14, y0 + (st.height * dy * i) / 14); await p.waitForTimeout(70); }
        await p.mouse.up();
      },
      /** Add the first sprite found by name; leaves its tool screen open. */
      add: async (name) => { await x.opt('Add something'); await x.opt('Search by name'); await p.fill('input[type=search]', name); await p.click('.grid button'); await p.waitForSelector('.thingbtns'); },
    };
    return x;
  };
  t.close = async () => { await t.browser.close(); t.srv.kill(); await new Promise((r) => setTimeout(r, 400)); try { fs.rmSync(dataDir, { recursive: true, force: true }); } catch { /* still saving */ } };
  return t;
};
