/* Two settings at paper-doll scale, every object with its four pictures (front, side, used, used from the
 * side): the castle, keep and town of the middle ages; the cathedral, crypt and ruined abbey.
 * The objects are in _env2-medieval-m*.js (Medieval) and _env2-medieval-g*.js (Gothic); the shared helpers and
 * the way an object is registered in _env2-medieval-kit.js. */
module.exports = (kit) => {
  const H = require('./_env2-medieval-kit.js')(kit);
  for (const part of ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6']) {
    let mod;
    try {
      mod = require('./_env2-medieval-' + part + '.js');
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && /_env2-medieval-/.test(e.message)) continue; // a part not drawn yet
      throw e;
    }
    mod(kit, H);
  }
  return H.out;
};
