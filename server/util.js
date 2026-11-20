/* Small helpers for checking what clients send. */
import crypto from 'node:crypto';

export function uid() {
  return crypto.randomBytes(6).toString('hex');
}
export function clone(o) {
  return JSON.parse(JSON.stringify(o));
}
export function str(v, max) {
  return typeof v === 'string'
    ? v
        .replace(/[\u0000-\u001f\u007f]/g, ' ')
        .trim()
        .slice(0, max)
    : '';
}
export function num(v, lo, hi, d) {
  v = Number(v);
  return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d;
}
export function fail(status, message) {
  return Object.assign(new Error(message), { status });
}

export const HEX = /^#[0-9a-fA-F]{6}$/;
export function r3(v) {
  return Math.round(v * 1000) / 1000;
}
export function arr(v) {
  return Array.isArray(v) ? v : [];
}
