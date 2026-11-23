/* Three old settings at paper-doll scale, every object with its four pictures (front, side, used, used from the
 * side): a decaying Victorian town house, a poor country cottage, an overgrown garden.
 * The objects are in _env-old-victorian.js, _env-old-cottage.js and _env-old-garden.js; the shared helpers and
 * the way an object is registered in _env-old-kit.js. */
module.exports = (kit) => {
  const H = require('./_env-old-kit.js')(kit);
  for (const part of ['victorian', 'victorian2', 'victorian3', 'cottage', 'cottage2', 'cottage3', 'garden', 'garden2', 'garden3']) {
    let mod;
    try {
      mod = require('./_env-old-' + part + '.js');
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && /_env-old-/.test(e.message)) continue; // a setting not drawn yet
      throw e;
    }
    mod(kit, H);
  }
  return H.out;
};
