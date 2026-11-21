/* The web server: static files, the JSON API and the event streams. Zero dependencies.
 *
 * Transport: Server-Sent Events (server -> browser, the full state of a story on every change) and plain JSON
 * POSTs (browser -> server). Both survive flaky mobile networks: EventSource reconnects by itself and every
 * reconnect receives the complete state. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { syncClock, maybeBot } from './turns.js';
import { fail } from './util.js';
import { act } from './actions.js';
import { streams, broadcast, rooms, createRoom, joinRoom, loadRooms, saveDirty, sweep, dirty } from './rooms.js';
import { MAX_BODY, PUBLIC, MIME, DATA_DIR, PORT } from './config.js';
import { SPRITE_WIDTH } from '../public/shared/scene-model.js';

function readBody(req) {
  return new Promise((resolve, reject) => {
    let n = 0;
    const chunks = [];
    req.on('data', (c) => {
      n += c.length;
      if (n > MAX_BODY) {
        reject(fail(413, 'Request too large'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch {
        reject(fail(400, 'Bad JSON'));
      }
    });
    req.on('error', reject);
  });
}
function json(res, status, obj) {
  const s = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Length': Buffer.byteLength(s) });
  res.end(s);
}
function validToken(t) {
  return typeof t === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(t);
}
function serveStatic(req, res, pathname) {
  let rel;
  try {
    rel = decodeURIComponent(pathname);
  } catch {
    rel = '/';
  }
  if (rel === '/') rel = '/index.html';
  const file = path.join(PUBLIC, rel);
  if (!file.startsWith(PUBLIC + path.sep)) {
    res.writeHead(403);
    return res.end();
  }
  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(buf);
  });
}

function openStream(req, res, room, token) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write('retry: 2000\n\n');
  if (!room) {
    res.end('event: gone\ndata: 1\n\n');
    return;
  }
  const s = { res, token };
  if (!streams.has(room.code)) streams.set(room.code, new Set());
  streams.get(room.code).add(s);
  syncClock(room);
  broadcast(room);
  maybeBot(room);
  req.on('close', () => {
    const set = streams.get(room.code);
    if (set) {
      set.delete(s);
      if (!set.size) streams.delete(room.code);
    }
    syncClock(room);
    broadcast(room);
  });
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  if (!p.startsWith('/api/')) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405);
      return res.end();
    }
    return serveStatic(req, res, p);
  }
  if (p === '/api/health') return json(res, 200, { ok: true, rooms: rooms.size });

  if (p === '/api/rooms' && req.method === 'POST') {
    const body = await readBody(req);
    if (!validToken(body.token)) throw fail(400, 'Bad token');
    const { room, role } = createRoom(body);
    maybeBot(room);
    return json(res, 200, { code: room.code, role });
  }

  const m = /^\/api\/rooms\/([A-Za-z]{5})\/(join|events|act|history|assets)(?:\/([a-f0-9]{12}))?$/.exec(p);
  if (!m) throw fail(404, 'Not found');
  const room = rooms.get(m[1].toUpperCase());
  const what = m[2];

  if (what === 'events' && req.method === 'GET') return openStream(req, res, room, url.searchParams.get('token'));
  if (!room) throw fail(404, 'No story with that code');

  if (what === 'join' && req.method === 'POST') {
    const body = await readBody(req);
    if (!validToken(body.token)) throw fail(400, 'Bad token');
    const role = joinRoom(room, body);
    return json(res, 200, { code: room.code, role });
  }
  if (what === 'act' && req.method === 'POST') {
    const body = await readBody(req);
    return json(res, 200, await act(room, body.token, body));
  }
  if (what === 'history' && req.method === 'GET') {
    return json(res, 200, { code: room.code, names: room.names, ended: room.ended, history: room.history });
  }
  if (what === 'assets' && req.method === 'GET' && m[3]) {
    const a = room.assets.find((x) => x.id === m[3]);
    if (!a) throw fail(404, 'No such asset');
    const buf = Buffer.from(a.data, 'base64');
    res.writeHead(200, {
      'Content-Type': a.mime,
      'Content-Length': buf.length,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    });
    return res.end(buf);
  }
  throw fail(405, 'Method not allowed');
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((e) => {
    if (!e.status) console.error(e);
    if (res.headersSent) return res.end();
    json(res, e.status || 500, { error: e.status ? e.message : 'Server error' });
  });
});

loadRooms();
setInterval(saveDirty, 1500);
setInterval(sweep, 3600 * 1000);
setInterval(() => {
  // heartbeat keeps proxies from closing idle streams and lets clients detect dead ones
  for (const set of streams.values())
    for (const s of set) {
      try {
        s.res.write('event: ping\ndata: 1\n\n');
      } catch {
        /* closed */
      }
    }
}, 15000);
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    for (const code of rooms.keys()) dirty.add(code);
    for (const code of dirty) {
      try {
        fs.writeFileSync(path.join(DATA_DIR, code + '.json'), JSON.stringify(rooms.get(code)));
      } catch {
        /* ignore */
      }
    }
    process.exit(0);
  });
}
/* how wide each sprite is: the server checks the hero's walk with the same footprints as the browser */
try {
  for (const c of JSON.parse(fs.readFileSync(path.join(PUBLIC, 'px', 'index.json'), 'utf8')).categories)
    for (const i of c.items) SPRITE_WIDTH.set('p:' + i.slug, i.w || 16);
} catch {
  /* no sprite library: every thing counts as one tile wide */
}
server.listen(PORT, () => console.log(`Twofold listening on http://localhost:${PORT}  (${rooms.size} stories loaded)`));
