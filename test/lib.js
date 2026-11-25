// Shared helpers for the browser tests.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'),
  os = require('os'),
  path = require('path');

exports.setup = async (port, env = {}) => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'twofold-'));
  const start = () =>
    spawn('node', [path.join(__dirname, '..', 'server.js')], { env: { ...process.env, PORT: port, DATA_DIR: dataDir, ...env }, stdio: 'inherit' });
  const t = { base: `http://localhost:${port}`, errors: [], srv: start(), shots: process.argv[2] };
  await new Promise((r) => setTimeout(r, 700));
  t.browser = await chromium.launch();
  t.restart = async () => {
    t.srv.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 500));
    t.srv = start();
  };
  t.open = async () => {
    const p = await (await t.browser.newContext({ viewport: { width: 1366, height: 768 } })).newPage();
    p.on('pageerror', (e) => t.errors.push(e.message));
    p.on('console', (m) => {
      if (m.type() === 'error' && !/ERR_|Failed to load/.test(m.text())) t.errors.push(m.text());
    });
    p.on('dialog', (d) => d.accept());
    const x = {
      p,
      opt: (label) => p.click(`.gopt:has-text("${label}")`),
      done: () => p.click('.gdone'),
      end: () => p.click('#foot button.go'),
      /** One person playing both sides: wait until the banner says whose turn it is. */
      side: (who) => p.waitForFunction((w) => new RegExp(w).test(document.querySelector('#banner').textContent), who),
      /** End the turn and wait until the other side has watched it play. */
      toPlayer: async () => {
        await x.end();
        await x.side('Player');
        await x.cutDone();
      },
      toDirector: async () => {
        await x.end();
        await x.side('Director');
        await x.cutDone();
      },
      cutDone: () => p.waitForFunction(() => !/\b(cut|cine|fight)\b/.test(document.querySelector('#stage').className), null, { timeout: 90000 }),
      shot: async (n) => {
        if (t.shots) await p.screenshot({ path: path.join(t.shots, n + '.png') });
      },
      /** The story as the server sees it right now (what a client is sent). */
      state: () =>
        p.evaluate(async () => {
          const r = await fetch(`/api/rooms/${location.hash.slice(1)}/events?token=${localStorage.getItem('tf.token')}`);
          const rd = r.body.getReader();
          let b = '';
          for (;;) {
            const { value } = await rd.read();
            b += new TextDecoder().decode(value);
            const i = b.indexOf('data: '),
              e = b.indexOf('\n\n', i);
            if (i >= 0 && e > i) {
              rd.cancel();
              return JSON.parse(b.slice(i + 6, e));
            }
          }
        }),
      last: () => p.evaluate(async () => (await (await fetch(`/api/rooms/${location.hash.slice(1)}/history`)).json()).history.at(-1).scene),
      heroPos: () =>
        p.evaluate(() => {
          const s = document.querySelector('.ent.hero').style;
          return [parseFloat(s.left) / 100, parseFloat(s.top) / 100];
        }),
      /** Record what the stage shows over time (for checking playback order). */
      watch: () =>
        p.evaluate(() => {
          window.__seq = [];
          clearInterval(window.__w);
          window.__w = setInterval(() => {
            const st = document.querySelector('#stage');
            const k = [
              st.querySelector('.weather').className.replace('weather', '').trim(),
              st.querySelector('.strip.narr').textContent,
              st.querySelector('.bubbles').textContent,
              st.querySelector('.strip.act').textContent,
              st.className.includes('b-shake') ? 'shake' : '',
            ].join('|');
            if (window.__seq.at(-1) !== k) window.__seq.push(k);
          }, 30);
        }),
      seen: () => p.evaluate(() => window.__seq),
      /** Press Walk and click the stage at (fx, fy) (fractions of the stage); waits until the hero has arrived. */
      walk: async (fx, fy) => {
        const st = await p.locator('#stage').boundingBox();
        await p.click('#walkBtn');
        await p.mouse.click(st.x + st.width * fx, st.y + st.height * fy);
        await p.waitForFunction(() => /back/.test(document.querySelector('#walkBtn').textContent));
        let prev = '';
        for (let i = 0; i < 80; i++) {
          const cur = String(await x.heroPos());
          if (cur === prev) return;
          prev = cur;
          await p.waitForTimeout(250);
        }
        throw new Error('the hero never stopped walking');
      },
      /** Add the first sprite found by name; leaves its tool screen open. */
      add: async (name) => {
        await x.opt('Add something');
        await x.opt('Search by name');
        await p.fill('input[type=search]', name);
        await p.click('.grid button');
        // the list stays open; pressing the new thing on the stage opens its settings
        const id = await p.evaluate(() => window.__lastAdded);
        await p.locator(`.stage:visible .ent[data-id="${id}"]`).last().click({ force: true });
        await p.waitForSelector('.thingbtns');
      },
    };
    return x;
  };
  t.close = async () => {
    await t.browser.close();
    t.srv.kill();
    await new Promise((r) => setTimeout(r, 400));
    try {
      fs.rmSync(dataDir, { recursive: true, force: true });
    } catch {
      /* still saving */
    }
  };
  return t;
};
