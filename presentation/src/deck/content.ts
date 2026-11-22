/** Contenus partagés, tirés de la documentation du dépôt LOVA (README, MVP, architecture, service NFT). */

export const ISSUE = {
  name: "LOVA",
  meaning: "« héritage », en malagasy",
  tagline: "L’héritage malagasy prend vie",
  event: "DevFest 2026",
  hackathon: "Hackathon Preserving the Art",
  number: "N° 01",
  date: "Novembre 2026",
};

/** Pages clés (numérotation à partir de 1) — à tenir alignées avec slides/index.ts. */
export const PAGE = {
  constat: 5,
  experience: 7,
  handoff: 10,
  confiance: 11,
  provenance: 13,
  myths: 14,
  plateforme: 15,
  team: 18,
  thanks: 21,
} as const;

export const TEAM = [
  { handle: "endy-rkt", role: "Gateway, MVP & architecture système" },
  { handle: "papangoo", role: "Contenus, médias & vérification" },
  { handle: "salandri-42", role: "NFT & provenance numérique" },
  { handle: "Sesedra", role: "UI/UX & frontend" },
  { handle: "shidoAdr", role: "Authentification, LiDAR & 3D" },
] as const;
