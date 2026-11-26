/*
 * Creatures of four old settings, drawn at paper-doll scale: the Victorian great house, the town and frontier of
 * the 1800s, a 1920's investigation, and the apothecary's back room. Each has its main picture and a roused one
 * (views.used). The drawings are in _be-old-<setting>.js, the shared helpers in _be-old-kit.js.
 */
const fs = require('fs');
const path = require('path');
module.exports = (kit) => {
  const T = require('./_be-old-kit.js')(kit);
  const out = {};
  for (const f of ['victorian', 'oldtime', 'twenties', 'apothecary']) {
    if (!fs.existsSync(path.join(__dirname, `_be-old-${f}.js`))) continue;
    const defs = require(`./_be-old-${f}.js`)(kit, T);
    for (const [slug, d] of Object.entries(defs)) {
      if (out[slug]) throw new Error('be-old: twice ' + slug);
      out[slug] = d;
    }
  }
  return out;
};
