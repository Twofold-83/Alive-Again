/* Two more settings at paper-doll scale, each thing with its four pictures (front, side, used, side used):
 *   env-apocalypse   the world after: wrecks, barricades, camps, bunkers      tools/big/_env2-ruin-apoc*.js
 *   env-suburban     a quiet, slightly wrong suburb: drives, lawns, kitchens  tools/big/_env2-ruin-sub*.js
 * The helpers they share (how an object is declared, letters, wheels, fire, rust, hedges) are in _env2-ruin-kit.js. */
const fs = require('fs');
const path = require('path');
module.exports = (kit) => {
  const out = {};
  const X = require('./_env2-ruin-kit.js')(kit, out);
  for (const part of ['apoc1', 'apoc2', 'apoc3', 'apoc4', 'sub1', 'sub2', 'sub3', 'sub4']) {
    const f = path.join(__dirname, `_env2-ruin-${part}.js`);
    if (fs.existsSync(f)) require(f)(X);
  }
  return out;
};
