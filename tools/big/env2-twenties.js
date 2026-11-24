/* The nineteen-twenties at paper-doll scale, in the mood of a Lovecraft investigation: motor cars and a tram,
 * a speakeasy, a jazz band's corner, the newspaper office, the museum and the professor's study, the asylum,
 * the street outside. Every object comes with its four pictures (front, side, used, used from the side).
 * The objects are in _env2-twenties-a.js ... -d.js; the shared helpers and the way an object is registered are
 * in _env2-twenties-kit.js. */
module.exports = (kit) => {
  const H = require('./_env2-twenties-kit.js')(kit);
  for (const part of ['a', 'b', 'c', 'd', 'e']) {
    let mod;
    try {
      mod = require('./_env2-twenties-' + part + '.js');
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && /_env2-twenties-/.test(e.message)) continue; // a part not drawn yet
      throw e;
    }
    mod(kit, H);
  }
  return H.out;
};
