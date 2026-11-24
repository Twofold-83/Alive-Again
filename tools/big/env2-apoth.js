/* Two settings at paper-doll scale, every object with its four pictures (front, side, used, used from the side):
 * the Apothecary (the old chemist's shop and the herb-woman's back room) and Old time (the 1800s, town and home).
 * The objects are in _env2-apoth-a*.js (apothecary) and _env2-apoth-o*.js (old time); the shared helpers and the
 * way an object is registered in _env2-apoth-kit.js. */
module.exports = (kit) => {
  const H = require('./_env2-apoth-kit.js')(kit);
  for (const part of ['a1', 'a2', 'a3', 'a4', 'a5', 'o1', 'o2', 'o3', 'o4', 'o5', 'o6']) {
    let mod;
    try {
      mod = require('./_env2-apoth-' + part + '.js');
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && /_env2-apoth-/.test(e.message)) continue; // a part not drawn yet
      throw e;
    }
    mod(kit, H);
  }
  return H.out;
};
