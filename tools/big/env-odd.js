/* Three settings at paper-doll scale, every thing with its four pictures (main, side, used, side used):
 *   env-childroom  a child's bedroom where something is not right
 *   env-attic      under the roof: what a family put away, and whoever lives up there now
 *   env-weird      things that should not be; used = what happens when someone dares to touch them
 * The drawing helpers are in _env-odd-kit.js, the things in _env-odd-<setting>-<part>.js. */
const fs = require('fs');
const path = require('path');
module.exports = (kit) => {
  const H = require('./_env-odd-kit.js')(kit);
  const parts = fs
    .readdirSync(__dirname)
    .filter((f) => /^_env-odd-(child|attic|weird)-\w+\.js$/.test(f))
    .sort((a, b) => {
      const rank = (f) => ['child', 'attic', 'weird'].indexOf(f.split('-')[2]);
      return rank(a) - rank(b) || (a < b ? -1 : 1);
    });
  for (const f of parts) require('./' + f)(H);
  return H.out;
};
