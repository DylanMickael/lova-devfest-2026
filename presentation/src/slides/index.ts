import type { SlideDef } from "../deck/types";
import { Contents, Cover, Editorial, Opener } from "./Opening";
import { Answer, Issues } from "./Problem";
import { Contribute, Handoff, Visit } from "./Experience";
import { Myths, Provenance, Review } from "./Trust";
import { Architecture, MintFlow } from "./Platform";
import { BackCover, Demo, Next, Team } from "./Closing";

/* L’ordre fixe la pagination : garder deck/content.ts › PAGE aligné. */
export const slides: SlideDef[] = [
  { chapter: "Une", part: 0, tone: "sand", Scene: Cover },
  { chapter: "Édito", part: 0, tone: "paper", Scene: Editorial },
  { chapter: "Sommaire", part: 0, tone: "ink", Scene: Contents },

  { chapter: "Partie I — Le constat", part: 1, tone: "wine", Scene: Opener({
    roman: "I", title: "Le", em: "constat.", seed: "opener-1",
    intro: "Des œuvres loin du public, privées de leur histoire, sans trace de leur provenance.",
    chapters: [[5, "Le patrimoine existe"], [6, "Notre réponse"]],
  }) },
  { chapter: "Le constat", part: 1, tone: "paper", Scene: Issues },
  { chapter: "Notre réponse", part: 1, tone: "sand", Scene: Answer },

  { chapter: "Partie II — L’expérience", part: 2, tone: "ink", Scene: Opener({
    roman: "II", title: "L’", em: "expérience.", seed: "opener-2", flip: true,
    intro: "Trois gestes : visiter la galerie, contribuer à la collection, numériser un objet avec un iPhone.",
    chapters: [[8, "Visiter le musée"], [9, "Contribuer"], [10, "Du bureau à l’iPhone"]],
  }) },
  { chapter: "Visiter le musée", part: 2, tone: "paper", Scene: Visit },
  { chapter: "Contribuer", part: 2, tone: "ink", Scene: Contribute },
  { chapter: "Du bureau à l’iPhone", part: 2, tone: "sand", Scene: Handoff },

  { chapter: "Partie III — La confiance", part: 3, tone: "wine", Scene: Opener({
    roman: "III", title: "La", em: "confiance.", seed: "opener-3",
    intro: "Une revue humaine avant toute publication, puis une trace numérique honnête sur ce qu’elle prouve.",
    chapters: [[12, "La revue humaine"], [13, "Le NFT de provenance"], [14, "Idées reçues"]],
  }) },
  { chapter: "Revue humaine", part: 3, tone: "paper", Scene: Review },
  { chapter: "Le NFT de provenance", part: 3, tone: "ink", Scene: Provenance },
  { chapter: "Idées reçues", part: 3, tone: "paper", Scene: Myths },

  { chapter: "Partie IV — La plateforme", part: 4, tone: "ink", Scene: Opener({
    roman: "IV", title: "La", em: "plateforme.", seed: "opener-4", flip: true,
    intro: "Des microservices NestJS derrière une gateway unique, une équipe de cinq, une démo de bout en bout.",
    chapters: [[16, "Architecture"], [17, "Du clic au bloc"], [18, "L’équipe"], [19, "La démo"], [20, "À suivre"]],
  }) },
  { chapter: "Architecture", part: 4, tone: "paper", Scene: Architecture },
  { chapter: "Du clic au bloc", part: 4, tone: "sand", Scene: MintFlow },
  { chapter: "L’équipe", part: 4, tone: "ink", Scene: Team },
  { chapter: "La démo", part: 4, tone: "paper", Scene: Demo },
  { chapter: "À suivre", part: 4, tone: "wine", Scene: Next },
  { chapter: "Misaotra", part: 0, tone: "ink", Scene: BackCover },
];
