// Protocol-level test, no browser needed: roles, turn order, validation, turn clock.
import { spawn } from 'node:child_process';
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const PORT = 3124,
  base = `http://localhost:${PORT}`;
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'twofold-'));
const srv = spawn('node', [new URL('../server.js', import.meta.url).pathname], {
  env: { ...process.env, PORT, DATA_DIR: dataDir },
  stdio: 'inherit',
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const post = async (p, body) => {
  const r = await fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { status: r.status, ...(await r.json()) };
};
function listen(code, token) {
  // minimal SSE reader; .state is always the latest view
  const o = { state: null, ctl: new AbortController() };
  fetch(`${base}/api/rooms/${code}/events?token=${token}`, { signal: o.ctl.signal })
    .then(async (r) => {
      let buf = '';
      const dec = new TextDecoder();
      for await (const chunk of r.body) {
        buf += dec.decode(chunk);
        let i;
        while ((i = buf.indexOf('\n\n')) >= 0) {
          const m = buf.slice(0, i);
          buf = buf.slice(i + 2);
          if (m.startsWith('data: ')) o.state = JSON.parse(m.slice(6));
        }
      }
    })
    .catch(() => {});
  return o;
}
try {
  await sleep(600);
  const D = 'director-token-1',
    P = 'player-token-22',
    X = 'stranger-token-3';
  const { code } = await post('/api/rooms', { token: D, name: 'Mia' });
  const act = (token, type, data) => post(`/api/rooms/${code}/act`, { token, type, ...data });
  assert.equal((await act(D, 'submit', { turn: 0, scene: {} })).status, 409, 'cannot start without a player');
  assert.equal((await post(`/api/rooms/${code}/join`, { token: P, name: 'Sam' })).role, 'player');
  assert.equal((await post(`/api/rooms/${code}/join`, { token: X })).role, 'spectator');
  assert.equal((await post('/api/rooms/ZZZZZ/join', { token: X })).status, 404);
  const d = listen(code, D),
    p = listen(code, P);
  await sleep(300);
  assert.equal(d.state.you, 'director');
  assert.equal(p.state.you, 'player');
  assert.equal(p.state.online.director, true);
  assert.equal((await act(P, 'settings', { turnSeconds: 1 })).status, 403);
  assert.equal((await act(X, 'end', {})).status, 403);
  await act(D, 'settings', { turnSeconds: 1 });
  assert.equal((await act(P, 'submit', { turn: 0, say: 'hi' })).stale, true, 'player cannot act on the director turn');
  const scene = {
    backdrop: 'b:cave',
    mood: 'm:eerie',
    narration: 'x'.repeat(999),
    heroId: 'h',
    entities: [{ id: 'h', asset: 'e:🧑', x: 5, y: -3, scale: 99 }, { id: 'h', asset: 'e:🐉', say: 'Roar' }, { asset: '' }],
  };
  await act(D, 'submit', { turn: 0, scene });
  await sleep(200);
  let s = p.state;
  assert.equal(s.turn, 1);
  assert.equal(s.whose, 'player');
  assert.equal(s.scene.narration.length, 240);
  assert.equal(s.scene.entities.length, 2);
  assert.notEqual(s.scene.entities[1].id, 'h');
  assert.deepEqual([s.scene.entities[0].x, s.scene.entities[0].y, s.scene.entities[0].scale], [1, 0, 6]);
  assert(s.remainingMs > 0 && !s.paused, 'clock runs');
  assert.equal((await act(D, 'submit', { turn: 1, scene })).stale, true);
  await act(P, 'submit', { turn: 1, x: 0.25, y: 0.5, say: 'Hello', action: 'waves' });
  assert.equal((await act(P, 'submit', { turn: 1, x: 0.9, y: 0.9, say: 'dup' })).stale, true, 'duplicate submit ignored');
  await sleep(200);
  s = d.state;
  assert.equal(s.turn, 2);
  assert.equal(s.scene.action, 'waves');
  assert.equal(s.scene.entities[0].say, 'Hello');
  assert.equal(s.scene.entities[0].x, 0.25);
  assert.equal(s.scene.entities[1].asset, 'e:🐉', 'player cannot touch other entities');
  assert.equal(s.scene.entities[1].say, '', 'lines already heard are cleared when the turn changes');
  await sleep(1000 + 4000 + 400 + 6000); // + cut-scene allowance                       // director lets the clock run out (1s + grace)
  s = d.state;
  assert.equal(s.turn, 3, 'timed-out turn passes');
  assert.equal(s.lastTimeout, true);
  assert.equal(s.whose, 'player');
  p.ctl.abort();
  await sleep(300); // player drops: clock must pause
  s = d.state;
  assert.equal(s.paused, true);
  assert.equal(s.online.player, false);
  const left = s.remainingMs;
  await sleep(1500);
  assert.equal(d.state.turn, 3, 'no timeout while paused');
  const p2 = listen(code, P);
  await sleep(300);
  assert.equal(d.state.paused, false);
  assert(d.state.remainingMs <= left);
  const gen = await act(D, 'generate', { kind: 'backdrop', prompt: 'purple night swamp' });
  const img = await fetch(`${base}/api/rooms/${code}/assets/${gen.asset.id}`);
  assert.equal(img.headers.get('content-type'), 'image/svg+xml');
  assert((await img.text()).startsWith('<svg'));
  assert.equal((await act(D, 'addAsset', { kind: 'sprite', dataUrl: 'data:text/html;base64,PHNjcmlwdD4=' })).status, 400);
  const hist = await (await fetch(`${base}/api/rooms/${code}/history`)).json();
  assert.equal(hist.history.length, 3);
  await act(D, 'end', {});
  await sleep(200);
  assert.equal(p2.state.ended, true);
  assert.equal(p2.state.remainingMs, null);
  d.ctl.abort();
  p2.ctl.abort();
  console.log('SMOKE OK');
} finally {
  srv.kill();
  await sleep(400);
  try {
    fs.rmSync(dataDir, { recursive: true, force: true });
  } catch {
    /* still saving */
  }
}

// ---- solo play against the built-in bots ----
{
  const dataDir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'twofold-'));
  const srv2 = spawn('node', [new URL('../server.js', import.meta.url).pathname], {
    env: { ...process.env, PORT, DATA_DIR: dataDir2, BOT_DELAY_MS: '20', DIRECTOR_AI: new URL('./fake-ai.js', import.meta.url).pathname },
    stdio: 'inherit',
  });
  try {
    await sleep(600);
    // human Player, bot Director
    let { code } = await post('/api/rooms', { token: 'solo-human-0001', name: 'Sam', role: 'player', bot: true });
    let me = listen(code, 'solo-human-0001');
    await sleep(400);
    assert.equal(me.state.bot, 'director');
    assert.equal(me.state.whose, 'player');
    assert.equal(me.state.turn, 1);
    assert(me.state.scene.narration && me.state.scene.entities.length > 2, 'bot director set a scene');
    const lines = ['Hello, who are you?', '', 'Why?', 'no', 'thanks'],
      acts = ['', 'open the box', 'look around', 'attack', 'run away', 'take it', 'sleep', 'dance', 'juggles'];
    for (let i = 0; i < 40; i++) {
      const t = me.state.turn;
      await post(`/api/rooms/${code}/act`, {
        token: 'solo-human-0001',
        type: 'submit',
        turn: t,
        x: Math.random(),
        y: 0.8,
        say: lines[i % lines.length],
        action: acts[i % acts.length],
      });
      await sleep(120);
      assert.equal(me.state.turn, t + 2, 'bot director answered turn ' + t);
      assert(
        me.state.scene.entities.some((e) => e.id === me.state.scene.heroId),
        'hero survives',
      );
      assert(
        me.state.scene.narration || me.state.scene.entities.some((e) => e.say && e.id !== me.state.scene.heroId),
        'director reacted at turn ' + t,
      );
    }
    assert.equal((await post(`/api/rooms/${code}/act`, { token: 'bot', type: 'submit', turn: me.state.turn })).stale, true);
    me.ctl.abort();
    // human Director, bot Player
    ({ code } = await post('/api/rooms', { token: 'solo-human-0002', name: 'Mia', role: 'director', bot: true, type: 'adventure' }));
    me = listen(code, 'solo-human-0002');
    await sleep(300);
    assert.equal(me.state.bot, 'player');
    assert.equal(me.state.joined.player, true);
    assert.equal(me.state.online.player, true);
    for (let i = 0; i < 10; i++) {
      const t = me.state.turn,
        scene = structuredClone(me.state.scene);
      scene.entities.push({ id: 'w' + i, asset: 'e:🧙', x: 0.7, y: 0.8, say: i % 2 ? 'Will you help me?' : 'Welcome.' });
      await post(`/api/rooms/${code}/act`, { token: 'solo-human-0002', type: 'submit', turn: t, scene });
      await sleep(120);
      assert.equal(me.state.turn, t + 2, 'bot player moved');
      const h = me.state.scene.entities.find((e) => e.id === 'hero');
      assert(h.say || me.state.scene.action, 'bot player did something');
    }
    // "Tell Claude": a stand-in AI returns operations; the server applies and sanitises them, commits nothing
    await post(`/api/rooms/${code}/act`, { token: 'solo-human-0002', type: 'settings', rules: { type: 'adventure' } });
    const base2 = structuredClone(me.state.scene);
    base2.sheet.stats = [{ id: 'hp', name: '❤️ Health', value: 5, max: 5 }];
    const t0 = me.state.turn;
    let ai = await post(`/api/rooms/${code}/act`, { token: 'solo-human-0002', type: 'claude', text: 'A dragon bursts in', scene: base2 });
    assert.equal(ai.status, 200);
    assert.match(ai.note, /dragon bursts in/);
    const dr = ai.scene.entities.find((e) => e.asset === 'p:dragon-red');
    assert(dr && dr.say === 'ROAR!' && dr.fx === 'shake' && dr.scale === 2);
    assert.deepEqual([dr.x, dr.y], [0.6, 0.8]);
    assert.equal(ai.scene.tracks.length, 1);
    assert.deepEqual(ai.scene.tracks[0].pts, [0, 0.9, 0.7, 1000, 0.7, 0.75, 2000, 0.6, 0.8]);
    assert.equal(ai.scene.backdrop, 'b:cave');
    assert.equal(ai.scene.burst, 'shake');
    assert.equal(ai.scene.sfx, 'boom');
    assert.equal(ai.scene.narration, 'The wall explodes.');
    assert.deepEqual(ai.scene.choices, ['Fight', 'Run', 'Hide']);
    assert.equal(ai.scene.sheet.stats[0].value, 3);
    assert(
      ai.scene.entities.some((e) => e.id === 'hero'),
      'the hero cannot be removed by the AI',
    );
    assert.equal(me.state.turn, t0, 'nothing was committed');
    assert.equal((await post(`/api/rooms/${code}/act`, { token: 'solo-human-0002', type: 'claude', text: 'refuse this', scene: base2 })).status, 422);
    assert.equal((await post(`/api/rooms/${code}/act`, { token: 'someone-else-9', type: 'claude', text: 'x', scene: base2 })).status, 403);
    me.ctl.abort();
    console.log('SOLO OK');
  } finally {
    srv2.kill();
    await sleep(400);
    try {
      fs.rmSync(dataDir2, { recursive: true, force: true });
    } catch {
      /* still saving */
    }
  }
}
