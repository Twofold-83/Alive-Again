/* The animated pixel scene on the start screen: a moonlit hill and the four-armed boy. Drawn in code, no image files. */
const BOY = [
  '......hhhhhhhh......',
  '.....hhhhhhhhhh.....',
  '....hhhhhhhhhhhh....',
  '....hhsssssssshh....',
  '....hsEEsssEEssh....',
  '....hsEEsssEEssh....',
  '....hssssssssssh....',
  '.....sssskksss......',
  '......ssssssss......',
  '.......rrrrrr.......',
  '.....rrrrrrrrrr.....',
  '.....RRRRRRRRRR.....',
  '.....rrrrrrrrrr.....',
  '.....RRRRRRRRRR.....',
  '.....rrrrrrrrrr.....',
  '.....rrrrrrrrrr.....',
  '.....pppppppppp.....',
  '.....pppp..pppp.....',
  '.....ppp....ppp.....',
  '.....ppp....ppp.....',
  '....bbbb....bbbb....',
];
const COL = { h: '#17121f', s: '#b9d6c2', E: '#ffe45c', k: '#3a2030', r: '#8a3145', R: '#5e2233', p: '#2b3350', b: '#0d0a14' };
const W = 200,
  H = 140;

export function startTitle(canvas, onThunder) {
  const g = canvas.getContext('2d');
  canvas.width = W;
  canvas.height = H;
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const stars = Array.from({ length: 70 }, () => ({ x: rnd() * W, y: rnd() * 84, p: rnd() * 6.3, b: rnd() > 0.85 }));
  const bats = [0, 1, 2].map((i) => ({ x: -30 - i * 70, y: 22 + i * 13, v: 17 + i * 5 }));
  const hillY = (x) => 112 - 26 * Math.cos(Math.max(-1.5, Math.min(1.5, (x - 92) / 78)));
  const px = (x, y, w, h, c) => {
    g.fillStyle = c;
    g.fillRect(Math.round(x), Math.round(y), w, h);
  };
  const line = (x0, y0, x1, y1, c, th = 1) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) px(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, th, th, c);
  };
  let flash = 0,
    nextFlash = 7,
    bolt = null,
    last = 0;

  function tree(x, y) {
    line(x, y, x + 1, y - 30, '#0a0711', 3);
    line(x + 1, y - 20, x - 10, y - 34, '#0a0711', 2);
    line(x - 10, y - 34, x - 14, y - 44, '#0a0711');
    line(x + 2, y - 26, x + 12, y - 38, '#0a0711', 2);
    line(x + 12, y - 38, x + 11, y - 48, '#0a0711');
    line(x + 12, y - 38, x + 20, y - 41, '#0a0711');
    line(x + 1, y - 30, x - 2, y - 46, '#0a0711');
    line(x - 6, y - 29, x - 16, y - 28, '#0a0711');
  }
  function grave(x, cross) {
    const y = hillY(x) + 1;
    if (cross) {
      px(x, y - 11, 2, 12, '#1c1727');
      px(x - 3, y - 8, 8, 2, '#1c1727');
    } else {
      px(x, y - 8, 7, 9, '#1c1727');
      px(x + 1, y - 9, 5, 1, '#1c1727');
      px(x + 2, y - 5, 3, 1, '#2c2540');
    }
  }
  function boy(t) {
    const bx = 72,
      by = hillY(92) - 41 + Math.round(Math.sin(t * 1.6) * 0.8),
      blink = t % 4.3 < 0.13;
    const arm = (sx, sy, dir, up, ph) => {
      const w = Math.sin(t * 1.3 + ph),
        ex = sx + dir * 8,
        ey = sy + (up ? -4 : 4) + w;
      const hx = ex + dir * (up ? 3 : 6) + (up ? w * 2 * dir : 0),
        hy = ey + (up ? -9 - w * 2 : 6 + w * 2);
      line(sx, sy, ex, ey, COL.r, 2);
      line(ex, ey, hx, hy, COL.s, 2);
      px(hx - 0.5, hy - 0.5, 3, 3, COL.s);
    };
    arm(bx + 10, by + 21, -1, true, 0);
    arm(bx + 28, by + 21, 1, true, 1.4);
    arm(bx + 10, by + 27, -1, false, 2.6);
    arm(bx + 28, by + 27, 1, false, 4);
    BOY.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch !== '.') px(bx + x * 2, by + y * 2, 2, 2, ch === 'E' && blink ? COL.s : COL[ch]);
      }
    });
    if (!blink) {
      g.globalAlpha = 0.16 + 0.08 * Math.sin(t * 3);
      px(bx + 10, by + 6, 8, 8, COL.E);
      px(bx + 20, by + 6, 8, 8, COL.E);
      g.globalAlpha = 1;
    }
  }
  function frame(ms) {
    requestAnimationFrame(frame);
    if (canvas.offsetParent === null || ms - last < 60) return; // hidden while a story is open; ~16 fps is plenty for pixels
    const dt = Math.min(0.2, (ms - last) / 1000),
      t = ms / 1000;
    last = ms;
    for (let y = 0; y < H; y += 4) {
      const k = y / H;
      px(0, y, W, 4, `rgb(${(11 + k * 34) | 0},${(7 + k * 12) | 0},${(22 + k * 44) | 0})`);
    }
    for (const s of stars) {
      const a = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.8 + s.p));
      g.globalAlpha = a;
      px(s.x, s.y, s.b ? 2 : 1, s.b ? 2 : 1, '#e8e2ff');
    }
    g.globalAlpha = 1;
    g.fillStyle = '#f3e9c6';
    g.beginPath();
    g.arc(150, 36, 21, 0, 7);
    g.fill();
    g.globalAlpha = 0.1;
    g.beginPath();
    g.arc(150, 36, 29, 0, 7);
    g.fill();
    g.globalAlpha = 1;
    px(141, 28, 6, 5, '#d8cda6');
    px(155, 40, 8, 6, '#d8cda6');
    px(150, 24, 3, 3, '#d8cda6');
    px(140, 44, 4, 3, '#d8cda6');
    g.globalAlpha = 0.55;
    for (let i = 0; i < 3; i++) {
      const cx = ((t * (5 + i * 2) + i * 90) % (W + 90)) - 70;
      px(cx, 26 + i * 9, 62 - i * 8, 4, '#150e24');
      px(cx + 8, 23 + i * 9, 34, 3, '#150e24');
    }
    g.globalAlpha = 1;
    for (const b of bats) {
      b.x += b.v * dt;
      if (b.x > W + 20) {
        b.x = -30 - rnd() * 60;
        b.y = 14 + rnd() * 40;
      }
      const y = b.y + Math.sin(t * 2 + b.v) * 4,
        up = Math.sin(t * 13 + b.v) > 0;
      px(b.x, y, 2, 2, '#0a0711');
      px(b.x - 3, y + (up ? -2 : 1), 3, 1, '#0a0711');
      px(b.x + 2, y + (up ? -2 : 1), 3, 1, '#0a0711');
      px(b.x - 5, y + (up ? -1 : 2), 2, 1, '#0a0711');
      px(b.x + 5, y + (up ? -1 : 2), 2, 1, '#0a0711');
    }
    if (bolt && flash > 0.25) for (let i = 1; i < bolt.length; i++) line(bolt[i - 1][0], bolt[i - 1][1], bolt[i][0], bolt[i][1], '#f4f0ff', 1);
    tree(28, hillY(28) + 2);
    for (let x = 0; x < W; x++) px(x, hillY(x), 1, H, '#0a0711');
    grave(46, false);
    grave(128, true);
    grave(146, false);
    grave(164, true);
    boy(t);
    g.globalAlpha = 0.13;
    for (let i = 0; i < 4; i++) {
      const fx = ((t * (7 + i * 3) + i * 60) % (W + 120)) - 110;
      px(fx, 112 + i * 7, 120, 5, '#a79cd0');
      px(fx + 30, 109 + i * 7, 70, 3, '#a79cd0');
    }
    g.globalAlpha = 1;
    nextFlash -= dt;
    if (nextFlash <= 0) {
      nextFlash = 14 + rnd() * 16;
      flash = 1;
      let x = 20 + rnd() * 90,
        y = 0;
      bolt = [[x, y]];
      while (y < 86) {
        x += (rnd() - 0.5) * 16;
        y += 8 + rnd() * 8;
        bolt.push([x, y]);
      }
      if (onThunder) onThunder();
    }
    if (flash > 0) {
      g.globalAlpha = flash * 0.4;
      px(0, 0, W, H, '#cfc8ff');
      g.globalAlpha = 1;
      flash = Math.max(0, flash - dt * 2.4);
    }
  }
  requestAnimationFrame(frame);
}
