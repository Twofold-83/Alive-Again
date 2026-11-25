/*
 * Creatures of the home settings at paper-doll scale (see kit.js): what lives in an ordinary house, in a block of
 * flats, in the too-neat suburb and in the nursery at night. Every creature has its main picture (as it lurks) and
 * a roused one (views.used). The drawing is in tools/big/_be-home-<setting>.js, the helpers in _be-home-kit.js.
 */
module.exports = (kit) => {
  const H = require('./_be-home-kit.js')(kit);
  const out = {};
  require('./_be-home-modernhome.js')(kit, H, H.setting(out, 'modernhome-', 'be-modernhome', 'Modern home creatures'));
  require('./_be-home-apartment.js')(kit, H, H.setting(out, 'apartment-', 'be-apartment', 'Apartment complex creatures'));
  require('./_be-home-suburban.js')(kit, H, H.setting(out, 'suburban-', 'be-suburban', 'Suburban creatures'));
  require('./_be-home-childroom.js')(kit, H, H.setting(out, 'childroom-', 'be-childroom', "Child's room creatures"));
  return out;
};
