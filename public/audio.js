/* Tiny generative music and sound effects, all synthesised with WebAudio — no files to load.
 * A mood is a looped note sequence (seq), optionally with a bass line, a drum pattern, a held pad chord and an echo.
 * A mood could later also be { url } pointing at a recorded/generated track. */
const N = null;
export const MOODS = [
  { id: 'm:none', name: '🔇 Silence' },
  { id: 'm:calm', name: '🌿 Calm', bpm: 70, wave: 'sine', seq: [60, 64, 67, 72, 67, 64, 60, N, 57, 60, 64, 69, 64, 60, 57, N] },
  { id: 'm:happy', name: '☀️ Cheerful', bpm: 126, wave: 'triangle', drum: '..h...h...h...h.', seq: [60, 64, 67, 64, 65, 69, 72, 69, 67, 71, 74, 71, 72, 67, 64, N] },
  { id: 'm:town', name: '🏘️ Village', bpm: 104, wave: 'triangle', drum: 'k.h.s.h.k.h.s.h.', seq: [67, 71, 74, 71, 72, 76, 79, 76, 74, 71, 67, 71, 69, 66, 62, N] },
  { id: 'm:funny', name: '🤡 Silly', bpm: 138, wave: 'square', len: 0.7, drum: 'k.h.s.h.k.h.s.hh', seq: [60, N, 64, 60, N, 67, N, 64, 61, N, 65, 61, N, 68, 66, N] },
  { id: 'm:love', name: '💗 Tender', bpm: 76, wave: 'triangle', seq: [65, 69, 72, 76, 72, 69, 67, N, 64, 67, 71, 74, 71, 67, 65, N] },
  { id: 'm:lullaby', name: '🌙 Lullaby', bpm: 66, wave: 'sine', echo: true, seq: [64, N, 67, N, 72, N, 71, N, 69, N, 67, N, 64, N, 62, N] },
  { id: 'm:dream', name: '💭 Dream', bpm: 60, wave: 'sine', echo: true, pad: [60, 67, 76], seq: [72, N, 79, N, 76, N, 83, N, 81, N, 79, N, 76, N, 74, N] },
  { id: 'm:sea', name: '🌊 Open sea', bpm: 84, wave: 'triangle', seq: [62, 66, 69, 66, 64, 67, 71, 67, 62, 66, 69, 74, 73, 69, 66, N] },
  { id: 'm:quest', name: '🗺️ Adventure', bpm: 116, wave: 'square', seq: [57, 57, 64, N, 62, 64, 65, N, 64, 62, 60, N, 62, 59, 55, N] },
  { id: 'm:heroic', name: '🦸 Heroic', bpm: 108, wave: 'square', drum: 'k...s...k.k.s...', seq: [60, N, 60, 67, N, 67, 65, 64, 62, N, 64, 65, 67, N, 72, N] },
  { id: 'm:victory', name: '🏆 Victory', bpm: 132, wave: 'square', drum: 'k.h.s.h.k.h.s.h.', seq: [67, 72, 76, 79, 76, 79, 84, N, 81, 84, 81, 79, 76, 72, 74, N] },
  { id: 'm:mystery', name: '🔍 Mystery', bpm: 80, wave: 'triangle', seq: [62, N, 65, 69, 68, N, 65, N, 62, N, 61, 65, 64, N, 57, N] },
  { id: 'm:sneaky', name: '🥷 Sneaky', bpm: 96, wave: 'triangle', len: 0.5, drum: '....h.......h...', seq: [48, N, N, 51, N, 52, N, N, 55, N, 54, N, 52, N, 51, N] },
  { id: 'm:tense', name: '⚠️ Tense', bpm: 150, wave: 'sawtooth', seq: [48, N, 48, 51, 48, N, 48, 54, 48, N, 48, 51, 55, 54, 51, N] },
  { id: 'm:chase', name: '🏃 Chase', bpm: 176, wave: 'sawtooth', drum: 'k.h.k.h.k.h.kshs', seq: [57, 60, 64, 60, 57, 60, 65, 60, 57, 60, 64, 60, 68, 65, 64, 62] },
  { id: 'm:battle', name: '⚔️ Battle', bpm: 160, wave: 'square', drum: 'k.hsk.hsk.hskshs', seq: [52, 52, 55, 52, 57, 52, 55, 59, 52, 52, 55, 52, 60, 59, 57, 55] },
  { id: 'm:boss', name: '👹 Boss fight', bpm: 140, wave: 'sawtooth', drum: 'k..kk.s.k..kksss', seq: [45, N, 45, 48, 45, N, 51, 50, 45, N, 45, 48, 53, 52, 51, 48] },
  { id: 'm:sad', name: '🌧️ Melancholy', bpm: 60, wave: 'sine', seq: [57, 60, 64, N, 62, 60, 57, N, 53, 57, 60, N, 59, 57, 52, N] },
  { id: 'm:eerie', name: '👻 Eerie', bpm: 52, wave: 'sine', seq: [61, N, 67, N, 60, N, 66, N, 73, N, N, 67, N, 60, N, N] },
  { id: 'm:spooky', name: '🕯️ Spooky', bpm: 60, wave: 'triangle', echo: true, air: true, pad: [45, 57, 60],
    seq: [69, N, 72, N, 76, N, 75, N, 72, N, 69, N, 68, N, N, N, 69, N, 72, N, 77, N, 76, N, 75, N, 72, N, 63, N, 64, N],
    bass: [45, N, N, N, N, N, N, N, 41, N, N, N, N, N, N, N, 45, N, N, N, N, N, N, N, 39, N, N, N, 40, N, N, N] },
  { id: 'm:dungeon', name: '⛓️ Dungeon', bpm: 66, wave: 'sawtooth', drum: 'k.......k.....k.', pad: [40, 47], seq: [40, N, N, 43, N, N, 46, N, 45, N, N, 40, N, 39, N, N] },
  { id: 'm:space', name: '🪐 Deep space', bpm: 72, wave: 'sine', echo: true, pad: [36, 55, 62], seq: [48, N, 55, N, 62, N, 67, N, 66, N, 59, N, 52, N, 54, N] },
];

let ctx = null, master = null, music = null, timer = null, step = 0, nextAt = 0, current = 'm:none';
let level = Number(localStorage.getItem('tf.vol') ?? (localStorage.getItem('tf.muted') === '1' ? 0 : 2));   // 0 off, 1 quiet, 2 full
if (![0, 1, 2].includes(level)) level = 2;
const VOL = [0, 0.06, 0.14];
const live = () => ctx && level > 0 && ctx.state === 'running';
const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

function tone(midi, len, wave, vol, when = 0, out = master) {
  const t = ctx.currentTime + Math.max(0, when);
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = wave; o.frequency.value = hz(midi);
  const v = vol * (wave === 'square' || wave === 'sawtooth' ? 0.35 : 1);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + Math.min(0.02, len / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  o.connect(g).connect(out);
  o.start(t); o.stop(t + len + 0.05);
}
/** A note that slides from one pitch to another. */
function glide(from, to, len, wave, vol, when = 0) {
  const t = ctx.currentTime + when;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = wave; o.frequency.setValueAtTime(hz(from), t); o.frequency.exponentialRampToValueAtTime(hz(to), t + len);
  const v = vol * (wave === 'square' || wave === 'sawtooth' ? 0.35 : 1);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + Math.min(0.03, len / 3));
  g.gain.setValueAtTime(v, t + len * 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + len + 0.05);
}
/** Filtered noise. o: { when, type (filter), to (sweep the filter to this), swell (fade in and out instead of a hit) } */
function noise(len, vol, cutoff, o = {}) {
  const n = Math.floor(ctx.sampleRate * len), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) { const k = i / n; d[i] = (Math.random() * 2 - 1) * (o.swell ? Math.sin(Math.PI * k) ** 2 : (1 - k) ** 2); }
  const t = ctx.currentTime + (o.when || 0);
  const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = buf; f.type = o.type || 'lowpass'; f.frequency.setValueAtTime(cutoff, t); g.gain.value = vol;
  if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + len);
  src.connect(f).connect(g).connect(o.out || master); src.start(t);
}

function drumHit(ch, when) {
  if (ch === 'k') { tone(36, 0.16, 'sine', 1.1, when, music); tone(29, 0.1, 'sine', 0.8, when, music); }
  else if (ch === 's') noise(0.13, 0.55, 3200, { when, out: music });
  else if (ch === 'h') noise(0.035, 0.2, 9000, { when, type: 'highpass', out: music });
}
function playStep(m, i, when, d) {
  const n = m.seq[i % m.seq.length], len = d * 2.4 * (m.len || 1);
  if (n != null) {
    tone(n, len, m.wave, 0.5, when, music);
    if (m.echo) { tone(n + 12, len, 'sine', 0.13, when + d * 0.75, music); tone(n, len, m.wave, 0.1, when + d * 1.5, music); }
  }
  if (m.bass) { const b = m.bass[i % m.bass.length]; if (b != null) tone(b, d * 7.5, 'sine', 0.5, when, music); }
  else if (i % 8 === 0) tone((n ?? m.seq[0]) - 12, d * 7.5, 'sine', 0.45, when, music);
  if (m.drum) drumHit(m.drum[i % m.drum.length], when);
  if (m.pad && i % 16 === 0) for (const p of m.pad) tone(p, d * 17, 'sine', 0.1, when, music);
  if (m.air && i % m.seq.length === 0) noise(d * 14, 0.16, 300, { when, swell: true, to: 900, out: music });
}
/* Notes are scheduled a little ahead on the audio clock, so the rhythm stays steady even when the page is busy. */
function restart() {
  clearInterval(timer); timer = null;
  const m = MOODS.find((x) => x.id === current);
  if (music) { const t = ctx.currentTime; music.gain.cancelScheduledValues(t); music.gain.setValueAtTime(0.0001, t); music.gain.exponentialRampToValueAtTime(1, t + 0.6); }
  if (!ctx || !level || !m || !m.seq) return;
  step = 0; nextAt = 0;
  const d = 30 / m.bpm;
  const pump = () => {
    if (ctx.state !== 'running') { nextAt = 0; return; }
    const now = ctx.currentTime;
    if (nextAt < now) nextAt = now + 0.05;
    while (nextAt < now + 0.35) { playStep(m, step, nextAt - now, d); step++; nextAt += d; }
  };
  timer = setInterval(pump, 110);
  pump();
}

/* One-shot sound effects. A pack could map these names to recordings later. */
export const SFX_GROUPS = [
  ['Action', [['boom', '💥 Boom'], ['hit', '👊 Hit'], ['clash', '⚔️ Clash'], ['shot', '🔫 Shot'], ['laser', '⚡ Zap'], ['whoosh', '💨 Whoosh'], ['jump', '🦘 Jump'], ['fall', '🪂 Fall'], ['glass', '🪟 Smash']]],
  ['Magic & luck', [['magic', '✨ Magic'], ['spell', '🔮 Dark spell'], ['teleport', '🌀 Teleport'], ['heal', '💚 Heal'], ['coin', '🪙 Coin'], ['pickup', '🎁 Pick up'], ['levelup', '⬆️ Level up'], ['fanfare', '🎺 Fanfare'], ['fail', '📉 Fail'], ['error', '🚫 Buzz']]],
  ['Places & things', [['knock', '✊ Knock'], ['door', '🚪 Creaky door'], ['slam', '🚪 Slam'], ['lock', '🔒 Lock'], ['unlock', '🔓 Unlock'], ['bell', '🔔 Bell'], ['clock', '⏰ Tick tock'], ['phone', '☎️ Ring'], ['alarm', '🚨 Alarm'], ['horn', '📯 Horn'], ['steps', '👣 Footsteps']]],
  ['Nature', [['thunder', '⛈️ Thunder'], ['wind', '🌬️ Wind'], ['splash', '💦 Splash'], ['drip', '💧 Drip'], ['bubble', '🫧 Bubbles'], ['bird', '🐦 Bird'], ['cat', '🐱 Meow'], ['dog', '🐶 Bark'], ['wolf', '🐺 Howl'], ['growl', '🐻 Growl']]],
  ['People & spooks', [['laugh', '😆 Laugh'], ['scream', '😱 Scream'], ['gasp', '😮 Gasp'], ['kiss', '💋 Kiss'], ['whistle', '😗 Whistle'], ['clap', '👏 Applause'], ['drumroll', '🥁 Drum roll'], ['heart', '💓 Heartbeat'], ['ghost', '👻 Ghost'], ['evil', '😈 Evil laugh']]],
];
export const SFX = [['', '🔇 None'], ...SFX_GROUPS.flatMap((g) => g[1])];

function playSfx(name) {
  if (!live()) return;
  const seq = (notes, step, wave, len = step * 1.6, vol = 0.7) => notes.forEach((n, i) => n != null && tone(n, len, wave, vol, i * step));
  const R = Math.random;
  switch (name) {
    case 'boom': noise(0.9, 3.5, 420); tone(28, 0.7, 'sine', 1.5); break;
    case 'hit': noise(0.12, 2.6, 900); tone(40, 0.12, 'sine', 1.5); break;
    case 'clash': noise(0.07, 1.2, 5000, { type: 'highpass' }); tone(92, 0.3, 'square', 0.35); tone(99.4, 0.25, 'square', 0.3); tone(104.7, 0.18, 'square', 0.25); break;
    case 'shot': noise(0.28, 4, 3800, { to: 300 }); tone(47, 0.1, 'sine', 1.4); break;
    case 'laser': seq([96, 91, 86, 81, 76, 71], 0.03, 'sawtooth', 0.08); break;
    case 'whoosh': noise(0.45, 1.6, 350, { swell: true, to: 3600 }); break;
    case 'jump': glide(60, 79, 0.18, 'square', 0.45); break;
    case 'fall': glide(86, 47, 0.65, 'triangle', 0.6); noise(0.15, 2, 500, { when: 0.66 }); break;
    case 'glass': noise(0.3, 1.5, 3500, { type: 'highpass' }); [100, 104, 107, 111].forEach((n, i) => tone(n + R() * 2, 0.2, 'sine', 0.3, 0.03 + i * 0.045)); break;
    case 'magic': seq([72, 76, 79, 84, 88, 91], 0.07, 'triangle', 0.5); break;
    case 'spell': seq([75, 72, 69, 66, 63, 60, 57], 0.06, 'sawtooth', 0.4); noise(0.6, 0.8, 250, { swell: true, to: 1500 }); break;
    case 'teleport': glide(48, 96, 0.35, 'sine', 0.6); glide(60, 108, 0.35, 'triangle', 0.3, 0.08); tone(96, 0.5, 'sine', 0.25, 0.36); break;
    case 'heal': seq([72, 76, 79, 84], 0.11, 'sine', 0.5); tone(91, 0.8, 'sine', 0.3, 0.44); break;
    case 'coin': tone(83, 0.08, 'square', 0.5); tone(88, 0.42, 'square', 0.5, 0.08); break;
    case 'pickup': seq([76, 83], 0.06, 'triangle', 0.14); break;
    case 'levelup': seq([60, 64, 67, 72, 76, 79, 84], 0.07, 'square', 0.25, 0.5); tone(88, 0.5, 'square', 0.5, 0.5); break;
    case 'fanfare': seq([67, 67, 72, 76, 79], 0.13, 'square', 0.3); tone(84, 0.7, 'square', 0.7, 0.65); break;
    case 'fail': seq([64, 60, 57, 52], 0.16, 'sawtooth', 0.35); break;
    case 'error': tone(41, 0.32, 'sawtooth', 1.1); tone(41.5, 0.32, 'square', 0.8); break;
    case 'knock': [0, 0.17, 0.34].forEach((t) => tone(45, 0.09, 'sine', 1.6, t)); break;
    case 'door': glide(50, 57, 0.28, 'sawtooth', 0.28); glide(57, 53, 0.34, 'sawtooth', 0.28, 0.28); glide(53, 61, 0.3, 'sawtooth', 0.22, 0.62); break;
    case 'slam': noise(0.3, 3.2, 320); tone(31, 0.25, 'sine', 1.6); break;
    case 'lock': tone(62, 0.03, 'square', 0.8); tone(50, 0.06, 'square', 0.9, 0.09); break;
    case 'unlock': tone(50, 0.03, 'square', 0.8); tone(62, 0.04, 'square', 0.8, 0.08); tone(74, 0.12, 'triangle', 0.5, 0.16); break;
    case 'bell': tone(81, 1.6, 'sine', 0.8); tone(93, 1.2, 'sine', 0.35); break;
    case 'clock': [0, 1, 2, 3].forEach((i) => tone(i % 2 ? 84 : 89, 0.03, 'square', 0.5, i * 0.42)); break;
    case 'phone': [0, 0.9].forEach((t) => { for (let i = 0; i < 10; i++) tone(i % 2 ? 88 : 84, 0.045, 'square', 0.3, t + i * 0.045); }); break;
    case 'alarm': seq([81, 76, 81, 76, 81, 76], 0.18, 'square', 0.17); break;
    case 'horn': tone(53, 0.9, 'sawtooth', 0.8); tone(60, 0.9, 'sawtooth', 0.6); tone(41, 0.9, 'triangle', 0.6); break;
    case 'steps': [0, 0.26, 0.52, 0.78].forEach((t, i) => noise(0.07, 1.1, i % 2 ? 600 : 800, { when: t })); break;
    case 'thunder': noise(0.18, 2.4, 2600); noise(2.4, 4, 240, { when: 0.1 }); noise(1.4, 2.2, 120, { when: 0.9 }); break;
    case 'wind': noise(2.6, 1.5, 300, { swell: true, to: 1100 }); noise(2.2, 0.7, 900, { swell: true, to: 400, when: 0.5 }); break;
    case 'splash': noise(0.55, 1.8, 4200, { to: 500 }); glide(64, 43, 0.2, 'sine', 0.8); break;
    case 'drip': glide(91, 79, 0.07, 'sine', 0.8); glide(95, 84, 0.06, 'sine', 0.35, 0.3); break;
    case 'bubble': [0, 0.13, 0.22, 0.38].forEach((t, i) => glide(55 + i * 3, 74 + i * 4, 0.1, 'sine', 0.7, t)); break;
    case 'bird': [0, 0.14, 0.4, 0.52].forEach((t) => glide(96 + R() * 4, 103 + R() * 4, 0.08, 'sine', 0.4, t)); break;
    case 'cat': glide(74, 81, 0.16, 'triangle', 0.6); glide(81, 71, 0.4, 'triangle', 0.6, 0.16); break;
    case 'dog': [0, 0.22].forEach((t) => { glide(58, 50, 0.11, 'square', 0.9, t); noise(0.1, 1.3, 1200, { when: t }); }); break;
    case 'wolf': glide(57, 69, 0.5, 'sine', 0.7); tone(69, 0.9, 'sine', 0.7, 0.48); glide(69, 61, 0.9, 'sine', 0.6, 1.3); break;
    case 'growl': glide(34, 28, 0.9, 'sawtooth', 1.3); glide(34.3, 27.6, 0.9, 'square', 0.8); noise(0.9, 0.9, 220, { swell: true }); break;
    case 'laugh': [76, 74, 72, 70, 67].forEach((n, i) => glide(n + 3, n, 0.08, 'square', 0.4, i * 0.13)); break;
    case 'evil': [55, 53, 52, 50, 48, 47, 45].forEach((n, i) => glide(n + 4, n, 0.12, 'sawtooth', 0.7, i * 0.19)); break;
    case 'scream': glide(76, 89, 0.14, 'sawtooth', 0.5); glide(89, 72, 0.6, 'sawtooth', 0.5, 0.14); break;
    case 'gasp': noise(0.3, 1.6, 600, { swell: true, to: 3000, type: 'bandpass' }); break;
    case 'kiss': glide(82, 98, 0.08, 'sine', 0.6); noise(0.03, 0.6, 5000, { type: 'highpass', when: 0.08 }); break;
    case 'whistle': glide(84, 96, 0.24, 'sine', 0.5); glide(96, 86, 0.32, 'sine', 0.5, 0.28); break;
    case 'clap': for (let i = 0; i < 46; i++) noise(0.035, 0.5 + R() * 0.5, 2200 + R() * 3000, { when: R() * 1.6, type: 'bandpass' }); break;
    case 'drumroll': for (let i = 0; i < 22; i++) noise(0.05, 0.5 + i * 0.03, 2400, { when: i * 0.05 }); noise(0.5, 2.6, 500, { when: 1.15 }); tone(36, 0.4, 'sine', 1.3, 1.15); break;
    case 'heart': [0, 0.22, 0.8, 1.02].forEach((t) => tone(33, 0.16, 'sine', 1.8, t)); break;
    case 'ghost': glide(64, 71, 0.7, 'sine', 0.6); glide(71, 61, 1, 'sine', 0.6, 0.7); glide(67.3, 74.3, 0.7, 'sine', 0.2, 0.05); noise(1.7, 0.4, 500, { swell: true }); break;
    /* quiet sounds the game makes by itself */
    case 'talk': tone(79 + R() * 7, 0.035, 'square', 0.22); break;
    case 'type': tone(67, 0.02, 'triangle', 0.25); break;
    case 'step': noise(0.06, 0.9, 700); break;
    case 'dice': [0, 0.08, 0.17, 0.3].forEach((t) => tone(90 + R() * 8, 0.04, 'square', 0.5, t)); break;
    case 'pop': glide(62, 84, 0.07, 'sine', 0.7); break;
    case 'swish': noise(0.1, 1.1, 1800, { type: 'highpass', to: 6000 }); break;
    case 'ouch': glide(66, 52, 0.16, 'square', 0.7); noise(0.08, 1.4, 900); break;
    case 'twang': glide(74, 60, 0.09, 'triangle', 0.7); break;
    case 'ui': tone(86, 0.02, 'triangle', 0.16); break;
    case 'send': noise(0.25, 0.7, 500, { swell: true, to: 2600 }); tone(76, 0.12, 'triangle', 0.3, 0.12); break;
    case 'tick': tone(93, 0.025, 'square', 0.35); break;
    case 'timeup': seq([69, 64, 57], 0.16, 'square', 0.3, 0.45); break;
    case 'theend': seq([60, 64, 67, 72], 0.2, 'triangle', 0.6); tone(76, 1.4, 'triangle', 0.6, 0.8); tone(60, 1.4, 'sine', 0.6, 0.8); break;
  }
}

const applyLevel = () => { if (master) master.gain.value = VOL[level]; };
export const audio = {
  sfx: playSfx,
  /** Must be called from a user gesture at least once (browser autoplay rules). */
  unlock() {
    try {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); applyLevel(); master.connect(ctx.destination);
        /* music goes through a soft low-pass and a quiet echo, which takes the edge off the raw oscillators */
        music = ctx.createGain();
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
        const delay = ctx.createDelay(1), fb = ctx.createGain(), wet = ctx.createGain();
        delay.delayTime.value = 0.31; fb.gain.value = 0.28; wet.gain.value = 0.22;
        music.connect(lp); lp.connect(master); lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
        restart();
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch { /* no audio available */ }
  },
  setMood(id) { id = id || 'm:none'; if (id !== current) { current = id; restart(); } },
  get mood() { return current; },
  get muted() { return level === 0; },
  get icon() { return ['🔇', '🔉', '🔊'][level]; },
  /** Steps through full → quiet → off. Returns the new icon. */
  cycle() { level = (level + 2) % 3; localStorage.setItem('tf.vol', String(level)); applyLevel(); restart(); return this.icon; },
  toggleMute() { level = level ? 0 : 2; localStorage.setItem('tf.vol', String(level)); applyLevel(); restart(); return level === 0; },
  blip() { if (live()) { tone(76, 0.18, 'triangle', 0.6); tone(83, 0.25, 'triangle', 0.6, 0.12); } },
};

document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.hidden) ctx.suspend(); else ctx.resume();
});
