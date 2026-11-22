import type { SlideDef } from "../deck/types";
import { Architecture, Business, Context, Cover, Hook, How, Question, Thanks, Tools } from "./Pitch";

/* L’ordre fixe la pagination : garder Pitch.tsx › PITCH_PAGE aligné. */
export const slides: SlideDef[] = [
  { chapter: "L’art est mort ?", part: 0, tone: "ink", Scene: Hook },
  { chapter: "Le contexte", part: 0, tone: "paper", Scene: Context },
  { chapter: "La problématique", part: 0, tone: "wine", Scene: Question },
  { chapter: "LOVA", part: 0, tone: "sand", Scene: Cover, cover: true },
  { chapter: "Comment ça marche", part: 0, tone: "paper", Scene: How },
  { chapter: "Les outils", part: 0, tone: "ink", Scene: Tools },
  { chapter: "Architecture", part: 0, tone: "paper", Scene: Architecture },
  { chapter: "Business plan", part: 0, tone: "sand", Scene: Business },
  { chapter: "Misaotra", part: 0, tone: "ink", Scene: Thanks },
];
