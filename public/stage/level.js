/* Levels on the stage: painting tiles, and finding a way for the hero to walk. The rule for where the hero may stand
 * is shared with the server (shared/scene-model.js). */
import { LEVEL_W, LEVEL_H, walkable } from '../shared/scene-model.js';
const EMPTY_CELLS = '0'.repeat(LEVEL_W * LEVEL_H);
/** Put a tile on one cell of a scene's level (a = asset, k = 'f' floor | 'w' wall; k '' erases). Returns false if nothing changed. */
export function setCell(scene, c, a, k) {
  const lv = scene.level || { pal: [], cells: EMPTY_CELLS };
  let ch = '0';
  if (k && a) {
    let i = lv.pal.findIndex((t) => t.a === a && t.k === k);
    if (i < 0) { if (lv.pal.length >= 35) return false; lv.pal.push({ a, k }); i = lv.pal.length - 1; }
    ch = (i + 1).toString(36);
  }
  if (lv.cells[c] === ch) return false;
  lv.cells = lv.cells.slice(0, c) + ch + lv.cells.slice(c + 1);
  scene.level = /[^0]/.test(lv.cells) ? lv : null;
  return true;
}

/* ---------- walking: the hero finds its own way to where the Player points ---------- */
const NAV_W = 64, NAV_H = 48;                                    // navigation grid (finer than the tiles)
const WALK_SPEED = 0.17;                                         // stage widths per second: an unhurried walk
/**
 * A walk from (x,y) towards (tx,ty) around walls and solid things, as a track
 * [ms, x, y, ...] at walking pace. Stops as near to the target as it can get.
 * Returns null if the hero cannot move from where it stands.
 */
export function findWalk(scene, x, y, tx, ty) {
  const at = (i, j) => [(i + 0.5) / NAV_W, (j + 0.5) / NAV_H];
  const cell = (px, py) => [Math.min(NAV_W - 1, Math.floor(px * NAV_W)), Math.min(NAV_H - 1, Math.floor(py * NAV_H))];
  const ok = new Uint8Array(NAV_W * NAV_H);
  for (let j = 0; j < NAV_H; j++) for (let i = 0; i < NAV_W; i++) ok[j * NAV_W + i] = walkable(scene, ...at(i, j)) ? 1 : 0;
  const [si, sj] = cell(x, y), start = sj * NAV_W + si;
  ok[start] = 1;                                                 // wherever the hero stands, it may leave
  const dist = new Float32Array(NAV_W * NAV_H).fill(Infinity), from = new Int32Array(NAV_W * NAV_H).fill(-1);
  dist[start] = 0;
  const queue = [start];                                         // Dijkstra with a simple queue: the grid is small
  while (queue.length) {
    let bi = 0; for (let q = 1; q < queue.length; q++) if (dist[queue[q]] < dist[queue[bi]]) bi = q;
    const cur = queue.splice(bi, 1)[0], ci = cur % NAV_W, cj = (cur - ci) / NAV_W;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      if (!di && !dj) continue;
      const ni = ci + di, nj = cj + dj;
      if (ni < 0 || nj < 0 || ni >= NAV_W || nj >= NAV_H) continue;
      const n = nj * NAV_W + ni;
      if (!ok[n] || (di && dj && (!ok[cj * NAV_W + ni] || !ok[nj * NAV_W + ci]))) continue;   // no cutting corners
      const nd = dist[cur] + (di && dj ? 1.414 : 1);
      if (nd < dist[n]) { if (dist[n] === Infinity) queue.push(n); dist[n] = nd; from[n] = cur; }
    }
  }
  let best = -1, bestD = Infinity;                               // the reachable spot nearest to where the Player pointed
  for (let n = 0; n < dist.length; n++) {
    if (dist[n] === Infinity) continue;
    const [cx, cy] = at(n % NAV_W, Math.floor(n / NAV_W)), d = Math.hypot(cx - tx, (cy - ty) * 0.75);
    if (d < bestD) { bestD = d; best = n; }
  }
  if (best < 0 || best === start) return null;
  const cells = [];
  for (let n = best; n !== -1 && n !== start; n = from[n]) cells.unshift(n);
  let pts = [[x, y], ...cells.map((n) => at(n % NAV_W, Math.floor(n / NAV_W)))];
  if (bestD < 0.6 / NAV_W && walkable(scene, tx, ty)) pts[pts.length - 1] = [tx, ty];   // arrive exactly where they pointed
  const clear = (a, b) => { const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * NAV_W * 2); for (let k = 1; k < n; k++) if (!walkable(scene, a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n)) return false; return true; };
  const smooth = [pts[0]];                                       // straighten the staircase the grid produces
  for (let i = 0; i < pts.length - 1;) { let j = pts.length - 1; while (j > i + 1 && !clear(pts[i], pts[j])) j--; smooth.push(pts[j]); i = j; }
  pts = smooth;
  let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], (pts[i][1] - pts[i - 1][1]) * 0.75);
  const speed = Math.max(WALK_SPEED, len / 9.5);                 // never longer than the 10 seconds a move may last
  const track = [0, pts[0][0], pts[0][1]]; let t = 0;
  for (let i = 1; i < pts.length; i++) { t += (Math.hypot(pts[i][0] - pts[i - 1][0], (pts[i][1] - pts[i - 1][1]) * 0.75) / speed) * 1000; track.push(Math.round(t), Math.round(pts[i][0] * 1000) / 1000, Math.round(pts[i][1] * 1000) / 1000); }
  return track;
}

/* ---------- cut scenes ---------- */
export function sample(pts, t) {
  const n = pts.length;
  if (t < pts[0]) return null;
  if (t >= pts[n - 3]) return [pts[n - 2], pts[n - 1]];
  for (let i = 3; i < n; i += 3) {
    if (t <= pts[i]) {
      const k = (t - pts[i - 3]) / Math.max(1, pts[i] - pts[i - 3]);
      return [pts[i - 2] + (pts[i + 1] - pts[i - 2]) * k, pts[i - 1] + (pts[i + 2] - pts[i - 1]) * k];
    }
  }
  return null;
}
