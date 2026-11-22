/**
 * Bruitages synthétisés en Web Audio : aucun fichier, aucune licence.
 * Palette « galerie numérique » : souffle de passage, tic de compteur,
 * carillon de mint, balayage de scan. Volume volontairement bas.
 */

type Ctx = { ac: AudioContext; out: GainNode; wet: GainNode; noise: AudioBuffer };

const STORAGE_KEY = "lova-deck-sound";
const listeners = new Set<(on: boolean) => void>();
let ctx: Ctx | null = null;
let enabled = readPreference();

function readPreference() {
  try { return localStorage.getItem(STORAGE_KEY) !== "off"; } catch { return true; }
}

function boot(): Ctx | null {
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  const ac = new AC();
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -20; comp.ratio.value = 3.5;
  comp.connect(ac.destination);
  const out = ac.createGain(); out.gain.value = 0.5; out.connect(comp);

  // Salle d’exposition : réponse impulsionnelle stéréo générée.
  const len = Math.floor(ac.sampleRate * 2.2);
  const ir = ac.createBuffer(2, len, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  }
  const verb = ac.createConvolver(); verb.buffer = ir;
  const wet = ac.createGain(); wet.gain.value = 0.3;
  wet.connect(verb); verb.connect(out);

  const noise = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
  const n = noise.getChannelData(0);
  for (let i = 0; i < n.length; i++) n[i] = Math.random() * 2 - 1;
  ctx = { ac, out, wet, noise };
  return ctx;
}

/** À appeler sur un geste utilisateur : les navigateurs bloquent l’audio avant. */
export function unlockAudio() {
  if (!enabled) return;
  const c = boot();
  if (c && c.ac.state === "suspended") void c.ac.resume();
}

export function isSoundOn() { return enabled; }
export function setSound(on: boolean) {
  enabled = on;
  try { localStorage.setItem(STORAGE_KEY, on ? "on" : "off"); } catch { /* préférence non mémorisée */ }
  if (on) unlockAudio();
  listeners.forEach(fn => fn(on));
}
export function onSoundChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

function ready() {
  if (!enabled) return null;
  const c = boot();
  return c && c.ac.state === "running" ? c : null;
}

function bus(c: Ctx, wet = 0.4) {
  const g = c.ac.createGain();
  g.connect(c.out);
  if (wet > 0) { const s = c.ac.createGain(); s.gain.value = wet; g.connect(s); s.connect(c.wet); }
  return g;
}

function tone(c: Ctx, freq: number, at: number, dur: number, peak: number, type: OscillatorType = "sine", wet = 0.5) {
  const o = c.ac.createOscillator(); o.type = type; o.frequency.value = freq;
  const g = bus(c, wet);
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(peak, at + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g); o.start(at); o.stop(at + dur + 0.05);
}

/** Passage d’une feuille : bruit filtré balayé, panoramique dans le sens de navigation. */
export function whoosh(dir: 1 | -1, intensity = 1) {
  const c = ready(); if (!c) return;
  const t = c.ac.currentTime;
  const src = c.ac.createBufferSource(); src.buffer = c.noise;
  const bp = c.ac.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.1;
  bp.frequency.setValueAtTime(380, t);
  bp.frequency.exponentialRampToValueAtTime(2600 * intensity, t + 0.22);
  bp.frequency.exponentialRampToValueAtTime(700, t + 0.5);
  const pan = c.ac.createStereoPanner();
  pan.pan.setValueAtTime(-0.6 * dir, t); pan.pan.linearRampToValueAtTime(0.6 * dir, t + 0.5);
  const g = bus(c, 0.35);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.16 * intensity, t + 0.12);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  src.connect(bp); bp.connect(pan); pan.connect(g);
  src.start(t, Math.random()); src.stop(t + 0.6);
}

export const sfx = {
  /** Compteur qui défile. */
  tick(pitch = 1) {
    const c = ready(); if (!c) return;
    tone(c, 1800 * pitch, c.ac.currentTime, 0.04, 0.035, "square", 0.1);
  },
  /** Bloc confirmé : quinte dorée. */
  chime() {
    const c = ready(); if (!c) return;
    const t = c.ac.currentTime;
    [659.25, 987.77, 1318.5].forEach((f, i) => tone(c, f, t + i * 0.07, 1.4, 0.07 - i * 0.015, "sine", 0.8));
  },
  /** Apparition d’un élément d’interface. */
  blip() {
    const c = ready(); if (!c) return;
    const t = c.ac.currentTime;
    const o = c.ac.createOscillator(); o.type = "triangle";
    o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(1040, t + 0.08);
    const g = bus(c, 0.3);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g); o.start(t); o.stop(t + 0.2);
  },
  /** Balayage LiDAR : glissando filtré. */
  scan() {
    const c = ready(); if (!c) return;
    const t = c.ac.currentTime;
    const o = c.ac.createOscillator(); o.type = "sawtooth";
    o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(900, t + 1.1);
    const lp = c.ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1400;
    const g = bus(c, 0.5);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.03, t + 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    o.connect(lp); lp.connect(g); o.start(t); o.stop(t + 1.25);
  },
  /** Bascule jour / nuit. */
  toggle(toDark: boolean) {
    const c = ready(); if (!c) return;
    const t = c.ac.currentTime;
    const [a, b] = toDark ? [784, 392] : [392, 784];
    tone(c, a, t, 0.35, 0.05, "sine", 0.6);
    tone(c, b, t + 0.09, 0.6, 0.05, "sine", 0.7);
  },
};

export type SfxName = keyof typeof sfx;
