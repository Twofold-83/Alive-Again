/*
 * The body itself: bare skin in every skin tone, with nothing on but small white shorts. A starting point for a
 * character before they are dressed — and for the drowned, the sick and the newly risen.
 * (Bare arms and bare legs without shorts are among the first 500 parts.)
 */
module.exports = ({ SKINS, WHITE, dark, lite }) => {
  const torsos = [],
    legs = [];
  for (const [skin, s] of Object.entries(SKINS)) {
    torsos.push({
      name: `bare skin chest naked body ${skin}`,
      theme: 'basic',
      draw(c) {
        c.row(1, 1, 10, s);
        c.rect(2, 2, 9, 9, s);
        c.set(1, 1, lite(s));
        c.set(2, 2, lite(s));
        c.col(9, 2, 9, dark(s));
        c.row(4, 3, 4, dark(s)); // the chest
        c.row(4, 7, 8, dark(s));
        c.set(5, 7, dark(s)); // the navel
        c.row(9, 2, 9, WHITE); // the top of the shorts
      },
    });
    legs.push({
      name: `bare skin legs white shorts tiny underwear ${skin}`,
      theme: 'basic',
      draw(c) {
        c.rect(1, 0, 4, 2, WHITE);
        c.col(4, 0, 2, dark(WHITE));
        c.rect(1, 3, 4, 9, s);
        c.col(4, 3, 9, dark(s));
        c.rect(1, 10, 5, 11, s); // a bare foot
        c.clear(5, 10);
        c.set(5, 11, dark(s));
      },
    });
  }
  return { torsos, legs };
};
