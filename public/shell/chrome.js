/* Around every game: the top bar, the banner under it, and the turn clock. */
import { toast, $, fmt } from '../core/dom.js';
import { audio } from '../core/audio.js';
import { h } from '../core/dom.js';
import { other, roleName, myTurn, app } from '../core/state.js';
import { openStory } from '../story/viewer.js';
import { leave } from './home.js';
import { setDevice, isPhone } from './device.js';
import { submit } from '../story/turn.js';

export function shareLink() {
  const url = location.origin + location.pathname + '#' + app.code;
  if (navigator.share) navigator.share({ title: 'Twofold', text: 'Join my story on Twofold', url }).catch(() => {});
  else if (navigator.clipboard)
    navigator.clipboard.writeText(url).then(
      () => toast('Invite link copied'),
      () => prompt('Copy this invite link', url),
    );
  else prompt('Copy this invite link', url);
}
export function renderChrome() {
  if (!app.S) return;
  const who = (role) =>
    h(
      'span',
      {
        title: roleName(role),
        class: 'who' + (app.S.you === role && !app.S.hotseat ? ' me' : '') + (!app.S.ended && app.S.whose === role ? ' turn' : ''),
      },
      h('i', { class: 'dot' + (app.S.online[role] ? ' on' : '') }),
      h('b', {}, app.S.joined[role] ? app.S.names[role] : '…'),
      app.S.bot === role ? h('small', {}, ' cpu') : null,
    );
  $('#top').replaceChildren(
    who('director'),
    who('player'),
    h('span', { class: 'grow storyname' }, app.S.info.title ? `“${app.S.info.title}”` : ''),
    h(
      'button',
      {
        class: 'code',
        'aria-label': 'Copy the invite link',
        title: 'Copy the invite link',
        onclick: () => {
          navigator.clipboard &&
            navigator.clipboard.writeText(location.href).then(
              () => toast('Invite link copied'),
              () => {},
            );
        },
      },
      'LINK',
      h('span', { class: 'codetxt' }, ' ' + app.code),
    ),
    app.S.rpg
      ? h('button', { onclick: () => leave(), 'aria-label': 'Leave', title: 'Back to the title screen' }, 'EXIT')
      : h('button', { onclick: openStory, 'aria-label': 'Story so far', title: 'Story so far' }, 'LOG'),
    h(
      'button',
      {
        onclick: (e) => {
          audio.unlock();
          e.currentTarget.textContent = audio.cycle();
          audio.sfx('pop');
        },
        'aria-label': 'Sound',
        title: 'Sound: loud, quiet, off',
      },
      audio.icon,
    ),
    h(
      'button',
      {
        id: 'devBtn',
        onclick: () => setDevice(isPhone() ? 'computer' : 'phone', true),
        'aria-label': 'Phone or computer layout',
        title: 'Switch between the phone and the computer layout',
      },
      isPhone() ? 'PHONE' : 'PC',
    ),
  );

  const b = $('#banner');
  let content = null;
  if (!app.connected) content = ['Reconnecting…'];
  else if (app.S.ended) content = ['The End.', h('button', { onclick: openStory }, 'Read the story')];
  else if (app.S.hotseat && app.S.rpg)
    content = [
      isPhone()
        ? 'Both sides: the pad moves the hero, the Overlord’s powers are below'
        : 'You play both sides — the keyboard moves the hero, the panel on the right is the Overlord',
    ];
  else if (app.S.hotseat) content = [`You play both sides — now you are the ${app.S.whose === 'director' ? 'Director' : 'Player'}`];
  else if (app.S.you === 'spectator') content = ['You are watching this story.'];
  else if (!app.S.joined[other()])
    content = [`Invite your ${roleName(other())} — code ${app.code}`, h('button', { class: 'primary', onclick: shareLink }, 'Share link')];
  else if (!app.S.online[other()]) content = [`${app.S.names[other()]} is offline${app.S.paused ? ' — the clock is paused' : ''}`];
  b.hidden = !content;
  if (content) b.replaceChildren(...content.map((c) => (typeof c === 'string' ? h('span', {}, c) : c)));
}
let lastTick = 0;
export function tick() {
  if (!app.S || !app.code) return;
  const bar = $('#clock i'),
    lab = $('#tlabel');
  if (app.S.remainingMs == null || app.S.ended) {
    bar.style.width = '0';
    if (lab) lab.textContent = '';
    return;
  }
  const full = app.S.settings.turnSeconds * 1000 || 1;
  const r = app.S.paused ? app.S.remainingMs : Math.max(0, app.localDeadline - performance.now());
  bar.style.width = Math.min(100, (r / full) * 100) + '%';
  bar.className = r < 10000 ? 'low' : '';
  const sec = Math.ceil(r / 1000);
  if (!app.S.paused && myTurn() && sec <= 5 && sec > 0 && sec !== lastTick) {
    lastTick = sec;
    audio.sfx('tick');
  }
  if (lab) lab.textContent = ' · ' + fmt(Math.min(r, full)) + (app.S.paused ? ' (paused)' : '');
  if (r <= 0 && !app.S.paused && myTurn() && !app.submitting && app.autoTurn !== app.S.turn) {
    app.autoTurn = app.S.turn;
    submit();
  }
}
setInterval(tick, 250);
