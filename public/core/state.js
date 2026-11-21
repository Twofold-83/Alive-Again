/* What this browser knows right now. Every module reads and changes the same `app` object, so there is one place to look.
 * The small questions asked all over the code (is it my turn? who is the hero?) live here too. */
import { rid, $ } from './dom.js';

export const app = {
  token: localStorage.getItem('tf.token'), // who I am to the server; made once, kept in this browser
  code: null, // the story I am in
  S: null, // the last state the server sent: the committed scene, whose turn it is, rules, names...
  draft: null, // my own, uncommitted copy of the scene (only meaningful on my turn)
  selId: null, // Director: the selected character or thing
  selInv: null, // Director: the selected inventory item
  submitting: false, // my turn is on its way to the server
  autoTurn: -1, // the turn that was sent because the clock ran out
  localDeadline: 0, // when my clock runs out, on this computer's clock
  connected: false,
  es: null, // the event stream from the server
  lastMsg: 0, // when the stream last said anything
  uiKey: '', // what the tool column was last built for; '' forces a rebuild
  cut: null, // a cut scene playing on the main stage
  rec: false, // Director: dragging records a path
  drawOn: false, // Director: dragging draws
  pointMode: false, // Player: the next click on the stage is what the written action points at
  walkMode: false, // Player: the next click on the stage is where the hero walks
  walkAnim: 0,
  poseOpen: false, // Player: the pose tool for a paper-doll hero is showing // Player: animation frame of a walk being shown
};

if (!app.token) {
  app.token = rid() + rid() + rid();
  localStorage.setItem('tf.token', app.token);
}
export function known() {
  try {
    return JSON.parse(localStorage.getItem('tf.rooms') || '[]');
  } catch {
    return [];
  }
}
export function remember(c) {
  return localStorage.setItem('tf.rooms', JSON.stringify([c, ...known().filter((x) => x !== c)].slice(0, 20)));
}
export const pen = { c: '#ffffff', w: 4 };

export function myTurn() {
  return app.S && !app.S.ended && app.S.you === app.S.whose;
}
/** What a side is called in this kind of story. */
export function roleName(role) {
  return app.S && app.S.rpg ? (role === 'director' ? 'Overlord' : 'Hero') : role === 'director' ? 'Director' : 'Player';
}
export function other() {
  return app.S.you === 'director' ? 'player' : 'director';
}
export function shown() {
  return myTurn() ? app.draft : app.S.scene;
}
export function hero(scene) {
  return scene.entities.find((e) => e.id === scene.heroId);
}
export function mods() {
  return app.S.rules.modules;
}
export function directing() {
  return myTurn() && app.S.you === 'director' && !app.submitting;
}

export const stage = $('#stage');
export function heroTurn() {
  return myTurn() && app.S.you === 'player' && !app.submitting;
}
export function heroStart() {
  return hero(app.S.scene);
}
