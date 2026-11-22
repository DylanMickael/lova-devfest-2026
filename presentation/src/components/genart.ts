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

/** Palette lamba de DESIGN.md (indigo, terre cuite, ocre, vert, sable, bois), avec le papier et le noir. */
export const WEAVE_PALETTES = [
  ["#1f2a5c", "#d99a2b", "#e9dcc0", "#b4472a", "#000000"],
  ["#b4472a", "#e9dcc0", "#1f2a5c", "#d99a2b", "#3b2a20"],
  ["#3b2a20", "#d99a2b", "#fbfaf4", "#6c8f4e", "#000000"],
  ["#6c8f4e", "#e9dcc0", "#3b2a20", "#b4472a", "#fbfaf4"],
  ["#000000", "#d99a2b", "#e9dcc0", "#1f2a5c", "#b4472a"],
] as const;
