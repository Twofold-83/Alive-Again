/*
 * People of the stranger settings, drawn one by one: the end of the world, hell, dreams, painters' impossible
 * people and the plainly uncanny. Each theme has its own file (_other-<theme>.js) and adds heads, torsos, arms
 * and legs that belong together. Parts are only ever added at the END of a theme file's lists … and since the
 * themes follow one another in the lists, new parts of any theme go into a NEW file loaded after these five.
 */
module.exports = (kit) => {
  const lists = { heads: [], torsos: [], arms: [], legs: [] };
  const tools = require('./_other-kit.js')(kit, lists);
  for (const theme of ['apocalypse', 'hell', 'dream', 'surreal', 'weird']) {
    let draw;
    try {
      draw = require(`./_other-${theme}.js`);
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && e.message.includes(`_other-${theme}.js`)) continue; // not drawn yet
      throw e;
    }
    draw(kit, tools);
  }
  return lists;
};
