import type { ReactNode } from "react";

export type SceneProps = { instant: boolean; no: string };

export type SlideDef = {
  chapter: string;
  /** 0 = ouverture/clôture, 1–4 = parties. */
  part: 0 | 1 | 2 | 3 | 4;
  /** "up" : feuille d’ouverture de partie, transition verticale. */
  vector?: "up";
  Scene: (props: SceneProps) => ReactNode;
};
