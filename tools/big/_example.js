/* An example of a module of freshly drawn sprites (files starting with _ are not loaded). Each entry redraws one
 * existing sprite of the library, keyed by its slug, on a canvas of its true size. After draw(), the kit darkens
 * the right-hand edge and puts the dark line around the silhouette, so leave one pixel free all round. */
module.exports = ({ C, dark, lite }) => ({
  'bed-unmade': {
    w: 36,
    h: 20,
    solid: true,
    draw(c) {
      c.rect(1, 2, 3, 17, C.woodDark); // headboard post
      c.rect(2, 4, 4, 12, C.wood);
      c.rect(32, 8, 34, 17, C.woodDark); // foot post
      c.rect(3, 11, 33, 14, C.cream); // mattress
      c.row(11, 3, 33, lite(C.cream));
      c.rect(5, 9, 10, 11, C.white); // pillow
      c.row(11, 5, 10, dark(C.white));
      c.rect(14, 10, 33, 14, C.wine); // blanket, thrown back
      c.row(10, 16, 24, C.wine);
      c.row(10, 14, 33, lite(C.wine));
      c.line(14, 11, 17, 14, dark(C.wine));
      c.line(24, 11, 26, 14, dark(C.wine));
      c.rect(3, 15, 33, 16, C.wood); // frame
      c.row(16, 3, 33, dark(C.wood));
      c.rect(4, 17, 5, 18, C.woodDark); // legs
      c.rect(31, 17, 32, 18, C.woodDark);
    },
  },
});
