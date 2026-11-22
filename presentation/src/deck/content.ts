/** Contenus partagés, tirés de la documentation du dépôt LOVA (README, MVP, architecture). */

export const PROJECT = {
  name: "LOVA",
  meaning: "« héritage », en malagasy",
  tagline: "L’héritage malagasy prend vie",
  event: "DevFest 2026",
  hackathon: "Hackathon Preserving the Art",
};

export const TEAM = [
  { handle: "endy-rkt", role: "Gateway · MVP · architecture système", tone: "gold" },
  { handle: "papangoo", role: "Contenus, médias & vérification", tone: "wine" },
  { handle: "salandri-42", role: "NFT & provenance numérique", tone: "holo" },
  { handle: "Sesedra", role: "UI/UX & frontend", tone: "sky" },
  { handle: "shidoAdr", role: "Auth · LiDAR & 3D", tone: "jade" },
] as const;

export const AGENDA = [
  { roman: "I", title: "Le constat", items: ["Des œuvres hors de portée", "Notre réponse"] },
  { roman: "II", title: "L’expérience", items: ["Visiter le musée", "Contribuer", "Du bureau à l’iPhone"] },
  { roman: "III", title: "La confiance", items: ["Revue humaine", "Le NFT de provenance", "Ce que le token prouve"] },
  { roman: "IV", title: "La plateforme", items: ["Architecture", "Du clic au bloc", "Équipe, démo & suite"] },
] as const;
