/**
 * Génération déterministe : une même graine donne toujours le même motif et
 * la même empreinte. Les empreintes affichées dans la présentation sont des
 * exemples illustratifs, jamais des transactions réelles.
 */

export function seedFrom(text: string): number {
  // FNV-1a 32 bits
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Chaîne hexadécimale d’exemple (format d’une empreinte sha256 ou d’une adresse). */
export function sampleHex(label: string, length = 64): string {
  const rnd = prng(seedFrom(label));
  let out = "";
  for (let i = 0; i < length; i++) out += "0123456789abcdef"[Math.floor(rnd() * 16)];
  return out;
}

export const shortHex = (hex: string, head = 6, tail = 4) => `${hex.slice(0, head)}…${hex.slice(-tail)}`;

/** Palette des tissages : vin, terre, or, ivoire, encre, indigo. */
export const WEAVE_PALETTES = [
  ["#67271f", "#c8a174", "#f0ece4", "#0e1116", "#b5523b"],
  ["#1d2a44", "#c8a174", "#e9dcc3", "#7e2a20", "#0e1116"],
  ["#3a2416", "#d9a65a", "#f3e6cf", "#5b6b3a", "#0e1116"],
  ["#2b1530", "#e2b07a", "#f0ece4", "#a8432f", "#13161c"],
  ["#0f2a2a", "#c8a174", "#efe3cc", "#7e2a20", "#0b0d10"],
] as const;
