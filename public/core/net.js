import { rpgEvent } from '../dungeon/screen.js';
import { onState } from '../story/turn.js';
import { renderChrome } from '../shell/chrome.js';
import { leave } from '../shell/home.js';
import { app } from './state.js';

/* ---------- network ---------- */
export async function api(path, body) {
  const r = await fetch(path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {});
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || 'Something went wrong'), { status: r.status });
  return j;
}
/** POST an action; network hiccups and 5xx are retried, real refusals (4xx) are thrown. */
export async function act(type, data = {}, tries = 1) {
  for (let i = 0; ; i++) {
    try { return await api(`/api/rooms/${app.code}/act`, { token: app.token, type, ...data }); } catch (e) {
      if ((e.status && e.status < 500) || i >= tries - 1) throw e.status ? e : new Error('No connection — please try again');
      await new Promise((ok) => setTimeout(ok, Math.min(4000, 500 * 2 ** i)));
    }
  }
}

export function connect() {
  if (app.es) app.es.close();
  app.lastMsg = Date.now();
  const mine = (app.es = new EventSource(`/api/rooms/${app.code}/events?token=${app.token}`));
  mine.onopen = () => { app.connected = true; renderChrome(); };
  mine.onmessage = (e) => { app.lastMsg = Date.now(); app.connected = true; onState(JSON.parse(e.data)); };
  mine.addEventListener('ping', () => { app.lastMsg = Date.now(); });
  mine.addEventListener('rpg', (e) => { app.lastMsg = Date.now(); rpgEvent(JSON.parse(e.data)); });
  mine.addEventListener('gone', () => { mine.close(); leave('That story no longer exists.'); });
  mine.onerror = () => {
    if (app.es !== mine) return;
    app.connected = false; renderChrome();
    if (mine.readyState === 2) setTimeout(() => { if (app.es === mine && app.code) connect(); }, 1500);
  };
}
setInterval(() => { if (app.code && Date.now() - app.lastMsg > 40000) connect(); }, 5000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && app.code && (!app.es || app.es.readyState !== 1 || Date.now() - app.lastMsg > 20000)) connect(); });
window.addEventListener('online', () => { if (app.code) connect(); });
