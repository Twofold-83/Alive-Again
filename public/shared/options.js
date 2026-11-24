/* The lists a Director picks from: effects on a thing, emotes, weather, screen moments. Plain data, used by the
 * browser's menus and by the server ("Tell Claude" may pick from them too). */
export const FX = [
  ['', 'No effect'],
  ['bounce', 'Bounce'],
  ['shake', 'Shake'],
  ['spin', 'Spin'],
  ['pulse', 'Pulse'],
  ['float', 'Float'],
  ['wobble', 'Wobble'],
  ['blink', 'Blink'],
  ['glow', 'Glow'],
  ['ghost', 'See-through'],
  ['dark', 'Silhouette'],
];
/** What a paper-doll character can feel: it shows on the face (see tools/make-dolls.js, which draws them in this order). */
export const FEELS = [
  ['happy', 'Happy'],
  ['sad', 'Sad'],
  ['scared', 'Scared'],
  ['angry', 'Angry'],
  ['uneasy', 'Uneasy'],
  ['curious', 'Curious'],
  ['doubtful', 'Doubtful'],
  ['surprised', 'Surprised'],
  ['tired', 'Tired'],
  ['hurt', 'Hurt'],
];
/** Light sources: [id, label, colour, reach in stage units (an eighth of the width), flickers] */
export const LIGHTS = [
  ['lamp', 'Lamp — warm orange', '#ffb45a', 1.7, false],
  ['lantern', 'Lantern — soft yellow', '#ffe08a', 1.3, false],
  ['gas', 'Gas lamp — pale and hissing', '#d9ffcf', 1.6, true],
  ['candle', 'Candle — small and warm', '#ffc66a', 0.9, true],
  ['torch', 'Torch — smoky orange', '#ff9a3c', 1.5, true],
  ['fire', 'Fire — flickering', '#ff7a2a', 1.9, true],
  ['ember', 'Embers — deep red', '#c8341c', 1.0, true],
  ['hellfire', 'Hellfire — blood red', '#ff2a12', 2.4, true],
  ['fluoro', 'Fluorescent — sharp white', '#e6f3ff', 2.5, false],
  ['spot', 'Spotlight — hard white', '#ffffff', 1.2, false],
  ['day', 'Daylight — through a window', '#fff2c8', 3.2, false],
  ['dawn', 'Dawn — rose', '#ffb0a0', 3.0, false],
  ['moon', 'Moonlight — pale blue', '#8fb0ff', 2.8, false],
  ['deep', 'Deep water — blue-green', '#2fbfae', 2.2, false],
  ['ghost', 'Ghost light — pale cyan', '#aef5ff', 1.3, true],
  ['magic', 'Magic — violet', '#b46cff', 1.6, true],
  ['toxic', 'Toxic — sickly green', '#9dff3c', 1.6, true],
  ['gold', 'Gold — a treasure glow', '#ffd24a', 1.2, false],
  ['screen', 'Screen — green', '#7dff9a', 1.1, true],
  ['tv', 'Television — cold flicker', '#bcd0ff', 1.4, true],
  ['neon', 'Neon — pink', '#ff4fd8', 1.4, false],
  ['neonblue', 'Neon — blue', '#4fd8ff', 1.4, false],
  ['neongreen', 'Neon — green', '#5cff8a', 1.4, false],
  ['neonyellow', 'Neon — yellow', '#fff04f', 1.4, false],
  ['blacklight', 'Black light — ultraviolet', '#6a3cff', 2.0, false],
  ['red', 'Alarm — red', '#ff3b3b', 1.6, false],
];
/** How strongly a light shines: it reaches further and colours more. A light source keeps its own (entity.shine). */
export const SHINE = [
  [0.45, 'Faint'],
  [0.7, 'Dim'],
  [1, 'Normal'],
  [1.4, 'Bright'],
  [2, 'Blazing'],
];
/** How dark the room is: nothing shows the light sources better than the dark around them. */
export const DARKNESS = [
  [0, 'Lit'],
  [1, 'Dusk'],
  [2, 'Dark'],
  [3, 'Pitch black'],
];
export const EMOTES = ['!', '?', '...', '!!', '♥', '♪', 'zzz', ':)', ':(', '>:(', 'o_o', 'x_x'];
export const WEATHER = [
  ['', 'Clear'],
  ['rain', 'Rain'],
  ['storm', 'Storm'],
  ['snow', 'Snow'],
  ['fog', 'Fog'],
  ['dark', 'Darkness'],
  ['night', 'Night tint'],
  ['heat', 'Heat'],
  ['sparkle', 'Sparkles'],
];
export const BURSTS = [
  ['', 'None'],
  ['shake', 'Shake'],
  ['flash', 'Flash'],
  ['hurt', 'Hurt'],
  ['confetti', 'Confetti'],
];
