import type { SlideDef } from "../deck/types";
import { Agenda, Cover, Part, Volume } from "./Opening";
import { Answer, Issues } from "./Problem";
import { Contribute, Handoff, Visit } from "./Experience";
import { Provenance, Review, Scope } from "./Trust";
import { Architecture, MintFlow } from "./Platform";
import { Demo, Next, Team, Thanks } from "./Closing";

export const slides: SlideDef[] = [
  { chapter: "LOVA", part: 0, Scene: Cover },
  { chapter: "Une œuvre en volume", part: 0, Scene: Volume },
  { chapter: "Sommaire", part: 0, Scene: Agenda },

  { chapter: "Partie I — Le constat", part: 1, vector: "up", Scene: Part({ roman: "I", label: "Le", accent: "constat.", chapters: ["Des œuvres hors de portée", "Notre réponse"] }) },
  { chapter: "Le constat", part: 1, Scene: Issues },
  { chapter: "Notre réponse", part: 1, Scene: Answer },

  { chapter: "Partie II — L’expérience", part: 2, vector: "up", Scene: Part({ roman: "II", label: "L’", accent: "expérience.", chapters: ["Visiter le musée", "Contribuer", "Du bureau à l’iPhone"] }) },
  { chapter: "Visiter le musée", part: 2, Scene: Visit },
  { chapter: "Contribuer", part: 2, Scene: Contribute },
  { chapter: "Du bureau à l’iPhone", part: 2, Scene: Handoff },

  { chapter: "Partie III — La confiance", part: 3, vector: "up", Scene: Part({ roman: "III", label: "La", accent: "confiance.", chapters: ["Revue humaine", "Le NFT de provenance", "Ce que le token prouve"] }) },
  { chapter: "Revue humaine", part: 3, Scene: Review },
  { chapter: "Le NFT de provenance", part: 3, Scene: Provenance },
  { chapter: "Ce que le token prouve", part: 3, Scene: Scope },

  { chapter: "Partie IV — La plateforme", part: 4, vector: "up", Scene: Part({ roman: "IV", label: "La", accent: "plateforme.", chapters: ["Architecture", "Du clic au bloc", "Équipe", "Démonstration", "Et après"] }) },
  { chapter: "Architecture", part: 4, Scene: Architecture },
  { chapter: "Du clic au bloc", part: 4, Scene: MintFlow },
  { chapter: "Équipe", part: 4, Scene: Team },
  { chapter: "Démonstration", part: 4, Scene: Demo },
  { chapter: "Et après", part: 4, Scene: Next },
  { chapter: "Misaotra", part: 0, Scene: Thanks },
];
