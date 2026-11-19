import { normScene } from '../shared/scene-model.js';
import { renderStage } from '../stage/render.js';
import { playTurn } from '../stage/playback.js';
import { h } from '../core/dom.js';
import { $, toast } from '../core/dom.js';
import { api } from '../core/net.js';
import { audio } from '../core/audio.js';
import { app } from '../core/state.js';

/* ---------- story viewer (flipbook of every committed turn) ---------- */
let story = null, storyAt = 0, storyCut = null, playing = false;
function storyOpts() { return { code: app.code, names: story.names }; }
function caption(i) { const fr = story.history[i]; return `Page ${i + 1} of ${story.history.length} · ${fr.by === 'director' ? '🎬 ' + story.names.director : '🧑 ' + story.names.player}${fr.timeout ? ' (ran out of time)' : ''}`; }
export async function openStory() {
  try { story = await api(`/api/rooms/${app.code}/history`); } catch (e) { return toast(e.message); }
  if (!story.history.length) return toast('The story has not begun yet');
  story.history.forEach((x) => normScene(x.scene));
  storyAt = story.history.length - 1;
  $('#story').hidden = false; showFrame();
}
function showFrame() {
  renderStage($('#storyStage'), story.history[storyAt].scene, storyOpts());
  $('#storyCap').textContent = caption(storyAt);
}
function stopPlay() { playing = false; if (storyCut) storyCut.skip(); storyCut = null; $('#storyPlay').textContent = '▶ Play'; }
function playFrom(i) {
  if (!playing || i >= story.history.length) return stopPlay();
  storyAt = i;
  $('#storyCap').textContent = caption(i);
  storyCut = playTurn($('#storyStage'), i ? story.history[i - 1].scene : null, story.history[i].scene, { ...storyOpts(), by: story.history[i].by, sfx: audio.sfx },
    () => { storyCut = null; if (playing) setTimeout(() => playFrom(i + 1), 700); });
}
$('#storyPrev').onclick = () => { stopPlay(); storyAt = Math.max(0, storyAt - 1); showFrame(); };
$('#storyNext').onclick = () => { stopPlay(); storyAt = Math.min(story.history.length - 1, storyAt + 1); showFrame(); };
$('#storyPlay').onclick = () => {
  if (playing) { stopPlay(); return showFrame(); }
  playing = true; $('#storyPlay').textContent = '⏸ Pause';
  playFrom(storyAt >= story.history.length - 1 ? 0 : storyAt);
};
$('#storyClose').onclick = () => { stopPlay(); $('#story').hidden = true; };
$('#storySave').onclick = () => {
  const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(story, null, 1)], { type: 'application/json' })), download: `twofold-${app.code}.json` });
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
};
