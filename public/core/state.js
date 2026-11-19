import { rid, $ } from './dom.js';

export const app = {
  token: localStorage.getItem('tf.token'),
  code: null,
  S: null,
  draft: null,
  selId: null,
  selInv: null,
  submitting: false,
  autoTurn: -1,
  localDeadline: 0,
  connected: false,
  es: null,
  lastMsg: 0,
  uiKey: '',
  cut: null,
  rec: false,
  drawOn: false,
  pointMode: false,
  walkMode: false,
  walkAnim: 0,
};

if (!app.token) { app.token = rid() + rid() + rid(); localStorage.setItem('tf.token', app.token); }
export function known() { try { return JSON.parse(localStorage.getItem('tf.rooms') || '[]'); } catch { return []; } }
export function remember(c) { return localStorage.setItem('tf.rooms', JSON.stringify([c, ...known().filter((x) => x !== c)].slice(0, 20))); }                            // Player: animation frame of a walk being shown
export const pen = { c: '#ffffff', w: 4 };

export function myTurn() { return app.S && !app.S.ended && app.S.you === app.S.whose; }
export function other() { return app.S.you === 'director' ? 'player' : 'director'; }
export function shown() { return myTurn() ? app.draft : app.S.scene; }
export function hero(scene) { return scene.entities.find((e) => e.id === scene.heroId); }
export function mods() { return app.S.rules.modules; }
export function directing() { return myTurn() && app.S.you === 'director' && !app.submitting; }

/* ---------- stage input ---------- */
export const stage = $('#stage');
export function heroTurn() { return myTurn() && app.S.you === "player" && !app.submitting; }
export function heroStart() { return hero(app.S.scene); }
