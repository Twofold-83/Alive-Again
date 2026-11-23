/* The city and what lies under it, at paper-doll scale: three settings of new things, each with its four
 * pictures (front, side, used, side used).
 *   env-street     a street at night          tools/big/_env-city-street.js
 *   env-urban      back alleys, shops, yards  tools/big/_env-city-urban.js
 *   env-basement   a cellar of things kept    tools/big/_env-city-basement.js
 * The helpers they share (how an object is declared, cars, letters, bricks) are in _env-city-kit.js. */
const fs = require('fs');
const path = require('path');
module.exports = (kit) => {
  const out = {};
  const X = require('./_env-city-kit.js')(kit, out);
  for (const part of ['street', 'street2', 'urban', 'urban2', 'basement', 'basement2']) {
    const f = path.join(__dirname, `_env-city-${part}.js`);
    if (fs.existsSync(f)) require(f)(X);
  }
  return out;
};
