import crypto from 'node:crypto';

/* ---------- helpers ---------- */
export const uid = () => crypto.randomBytes(6).toString('hex');
export const clone = (o) => JSON.parse(JSON.stringify(o));
export const str = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '');
export const num = (v, lo, hi, d) => { v = Number(v); return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; };
export const fail = (status, message) => Object.assign(new Error(message), { status });

export const HEX = /^#[0-9a-fA-F]{6}$/;
export const r3 = (v) => Math.round(v * 1000) / 1000;
export const arr = (v) => (Array.isArray(v) ? v : []);
