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
