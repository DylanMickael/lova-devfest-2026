import aloalo from "../assets/works/aloalo.webp";
import andrianampoinimerina from "../assets/works/andrianampoinimerina.webp";
import radama1 from "../assets/works/radama1.webp";
import radama2 from "../assets/works/radama2.webp";
import ranavalona1 from "../assets/works/ranavalona1.webp";
import ranavalona2 from "../assets/works/ranavalona2.webp";
import sakalava from "../assets/works/sakalava.webp";

/**
 * Œuvres malagasy reproduites dans le numéro. Toutes sont dans le domaine
 * public et proviennent de Wikimedia Commons ; chacune est créditée là où
 * elle apparaît (DESIGN.md : une ligne de crédit sous chaque œuvre).
 */
export type Work = {
  src: string;
  title: string;
  artist: string;
  date: string;
  alt: string;
};

const RAMANANKIRAHINA = "Philippe-Auguste Ramanankirahina (1860–1915)";

export const WORKS = {
  andrianampoinimerina: {
    src: andrianampoinimerina,
    title: "Andrianampoinimerina",
    artist: RAMANANKIRAHINA,
    date: "vers 1905",
    alt: "Portrait peint du roi Andrianampoinimerina, en lamba blanc, lance à la main",
  },
  radama1: {
    src: radama1,
    title: "Radama Ier",
    artist: RAMANANKIRAHINA,
    date: "vers 1905",
    alt: "Portrait peint du roi Radama Ier en uniforme rouge et or",
  },
  ranavalona1: {
    src: ranavalona1,
    title: "Ranavalona Ire",
    artist: RAMANANKIRAHINA,
    date: "photographie du portrait, vers 1905",
    alt: "Portrait de la reine Ranavalona Ire",
  },
  radama2: {
    src: radama2,
    title: "Radama II",
    artist: `${RAMANANKIRAHINA}, photographie de Robert Lisan`,
    date: "vers 1905",
    alt: "Portrait du roi Radama II",
  },
  ranavalona2: {
    src: ranavalona2,
    title: "Ranavalona II",
    artist: RAMANANKIRAHINA,
    date: "photographie du portrait, vers 1905",
    alt: "Portrait de la reine Ranavalona II",
  },
  aloalo: {
    src: aloalo,
    title: "Aloalo, poteau funéraire mahafaly",
    artist: "Artiste mahafaly, photographie de Marie-Lan Nguyen",
    date: "musée du quai Branly, 71.1965.16.22",
    alt: "Poteau funéraire aloalo en bois sculpté, surmonté de motifs ajourés",
  },
  sakalava: {
    src: sakalava,
    title: "Couple, sculpture sakalava",
    artist: "Artiste sakalava, ouest de Madagascar",
    date: "XVIIe–fin XVIIIe siècle, The Metropolitan Museum of Art, 2001.408",
    alt: "Sculpture en bois d’un couple debout, art sakalava",
  },
} satisfies Record<string, Work>;

/** Licence de chaque reproduction, telle qu’indiquée sur Wikimedia Commons. */
const LICENSE: Partial<Record<string, string>> = { [sakalava]: "CC0, Metropolitan Museum of Art" };

/** Ligne de crédit : « Titre — Artiste, date. Licence, Wikimedia Commons. » */
export function credit(work: Work): string {
  return `${work.title} — ${work.artist}, ${work.date}. ${LICENSE[work.src] ?? "Domaine public"}, Wikimedia Commons.`;
}
