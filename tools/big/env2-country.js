/* Two settings of the country at paper-doll scale, every object with its four pictures (front, side, used, used
 * from the side): an old village where something is wrong, and lonely farmland.
 * The objects are in _env2-country-village*.js and _env2-country-rural*.js; the shared helpers and the way an
 * object is registered in _env2-country-kit.js. */
module.exports = (kit) => {
  const H = require('./_env2-country-kit.js')(kit);
  for (const part of ['village1', 'village2', 'village3', 'rural1', 'rural2', 'rural3', 'rural4']) {
    let mod;
    try {
      mod = require('./_env2-country-' + part + '.js');
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && /_env2-country-/.test(e.message)) continue; // a part not drawn yet
      throw e;
    }
    mod(kit, H);
  }
  return H.out;
};
