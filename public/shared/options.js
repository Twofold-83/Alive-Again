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
  ['fluoro', 'Fluorescent — sharp white', '#e6f3ff', 2.5, false],
  ['neon', 'Neon — pink', '#ff4fd8', 1.4, false],
  ['neonblue', 'Neon — blue', '#4fd8ff', 1.4, false],
  ['fire', 'Fire — flickering', '#ff7a2a', 1.9, true],
  ['candle', 'Candle — small and warm', '#ffc66a', 0.9, true],
  ['moon', 'Moonlight — pale blue', '#8fb0ff', 2.8, false],
  ['screen', 'Screen — green', '#7dff9a', 1.1, true],
  ['red', 'Alarm — red', '#ff3b3b', 1.6, false],
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
