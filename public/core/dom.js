/* Small helpers every screen uses: building DOM, finding it, numbers, the toast. */
export function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, '');
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(kid));
  return el;
}
export function clone(o) {
  return JSON.parse(JSON.stringify(o));
}
export function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}
export function $(s, r = document) {
  return r.querySelector(s);
}
export function rid() {
  return Math.random().toString(36).slice(2, 10);
}
export function r3(v) {
  return Math.round(v * 1000) / 1000;
}
export function fmt(ms) {
  const s = Math.ceil(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
let toastTimer;
export function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.hidden = true;
  }, 3400);
}
/** Like replaceChildren / append, but nothing is drawn for null, false or '' (so `cond && h(...)` can be passed straight in). */
export function fill(el, ...kids) {
  el.replaceChildren(...kids.flat().filter((k) => k != null && k !== false && k !== ''));
  return el;
}
export function add(el, ...kids) {
  el.append(...kids.flat().filter((k) => k != null && k !== false && k !== ''));
  return el;
}
