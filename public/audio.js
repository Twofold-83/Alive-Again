/* Tiny generative music: each mood is a looped note sequence played with WebAudio.
 * A mood could later also be { url } pointing at a recorded/generated track. */
export const MOODS = [
  { id: 'm:none', name: '🔇 Silence' },
  { id: 'm:calm', name: '🌿 Calm', bpm: 70, wave: 'sine', seq: [60, 64, 67, 72, 67, 64, 60, null, 57, 60, 64, 69, 64, 60, 57, null] },
  { id: 'm:happy', name: '☀️ Cheerful', bpm: 126, wave: 'triangle', seq: [60, 64, 67, 64, 65, 69, 72, 69, 67, 71, 74, 71, 72, 67, 64, null] },
  { id: 'm:quest', name: '🗺️ Adventure', bpm: 116, wave: 'square', seq: [57, 57, 64, null, 62, 64, 65, null, 64, 62, 60, null, 62, 59, 55, null] },
  { id: 'm:tense', name: '⚠️ Tense', bpm: 150, wave: 'sawtooth', seq: [48, null, 48, 51, 48, null, 48, 54, 48, null, 48, 51, 55, 54, 51, null] },
  { id: 'm:sad', name: '🌧️ Melancholy', bpm: 60, wave: 'sine', seq: [57, 60, 64, null, 62, 60, 57, null, 53, 57, 60, null, 59, 57, 52, null] },
  { id: 'm:eerie', name: '👻 Eerie', bpm: 52, wave: 'sine', seq: [61, null, 67, null, 60, null, 66, null, 73, null, null, 67, null, 60, null, null] },
  { id: 'm:love', name: '💗 Tender', bpm: 76, wave: 'triangle', seq: [65, 69, 72, 76, 72, 69, 67, null, 64, 67, 71, 74, 71, 67, 65, null] },
];

let ctx = null, master = null, timer = null, step = 0, current = 'm:none';
let muted = localStorage.getItem('tf.muted') === '1';

function tone(midi, len, wave, vol, when = 0) {
  const t = ctx.currentTime + when;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = wave; o.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
  const v = vol * (wave === 'square' || wave === 'sawtooth' ? 0.35 : 1);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + len + 0.05);
}

function restart() {
  clearInterval(timer); timer = null;
  const m = MOODS.find((x) => x.id === current);
  if (!ctx || muted || !m || !m.seq) return;
  step = 0;
  const d = 30 / m.bpm;
  timer = setInterval(() => {
    if (ctx.state !== 'running') return;
    const i = step % m.seq.length, n = m.seq[i];
    if (n != null) tone(n, d * 2.4, m.wave, 0.5);
    if (i % 8 === 0) tone((m.seq[i] ?? m.seq[0]) - 12, d * 7.5, 'sine', 0.45);
    step++;
  }, d * 1000);
}

export const audio = {
  /** Must be called from a user gesture at least once (browser autoplay rules). */
  unlock() {
    try {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.gain.value = 0.14; master.connect(ctx.destination);
        restart();
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch { /* no audio available */ }
  },
  setMood(id) { if (id !== current) { current = id || 'm:none'; restart(); } },
  get muted() { return muted; },
  toggleMute() { muted = !muted; localStorage.setItem('tf.muted', muted ? '1' : '0'); restart(); return muted; },
  blip() { if (ctx && !muted && ctx.state === 'running') { tone(76, 0.18, 'triangle', 0.6); tone(83, 0.25, 'triangle', 0.6, 0.12); } },
};

document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.hidden) ctx.suspend(); else ctx.resume();
});
