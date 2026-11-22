import type { ReactNode } from "react";

/** Fond de la page : chaque page du numéro choisit son papier. */
export type Tone = "paper" | "sand" | "ink" | "wine";

export type SceneProps = {
  instant: boolean;
  /** Numéro de page, sur deux chiffres. */
  no: string;
  /** Aller à une page (index à partir de 0). */
  go: (index: number) => void;
};

export type SlideDef = {
  chapter: string;
  /** 0 = une, édito, sommaire et quatrième ; 1–4 = parties. */
  part: 0 | 1 | 2 | 3 | 4;
  tone: Tone;
  Scene: (props: SceneProps) => ReactNode;
  /** La couverture masque l’en-tête : la manchette en tient lieu. */
  cover?: boolean;
};
