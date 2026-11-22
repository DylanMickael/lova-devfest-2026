import { Headline, Kicker, Rule, Stage, Standfirst } from "../components/Primitives";
import type { SceneProps } from "../deck/types";

/* ───────────── Le constat ───────────── */

const ISSUES = [
  { title: "Hors de portée", body: "La visite en personne n’est pas toujours possible. Peintures, sculptures et objets restent loin d’une grande partie du public." },
  { title: "Sans leur histoire", body: "Privée de son créateur, de sa technique traditionnelle et de son contexte, une œuvre perd l’essentiel de son sens." },
  { title: "Sans trace", body: "La provenance est peu documentée, et les images générées par IA brouillent la frontière entre œuvre humaine et imitation." },
];

export function Issues({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-issues">
      <Kicker no={no}>Le constat</Kicker>
      <Headline lines={["Le patrimoine existe."]} em="Il reste à le rendre vivant." />
      <Rule at={0.8} strong />
      <div className="issues">
        {ISSUES.map((it, i) => (
          <article key={it.title} className="issue" data-in="up" data-at={1 + i * 0.14}>
            <span className="issue-no">{String(i + 1).padStart(2, "0")}</span>
            <h2>{it.title}</h2>
            <p>{it.body}</p>
          </article>
        ))}
      </div>
    </Stage>
  );
}

/* ───────────── La réponse ───────────── */

const VERBS = [
  { verb: "Découvrir", body: "Une galerie immersive et accessible, inspirée d’un vrai lieu d’exposition." },
  { verb: "Comprendre", body: "Chaque œuvre avec son histoire, son origine et son contexte documenté." },
  { verb: "Transmettre", body: "Créateurs, dépositaires et chercheurs partagent et numérisent les œuvres." },
  { verb: "Protéger", body: "La revue des contributions et la provenance numérique des œuvres acceptées." },
];

export function Answer({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-answer">
      <div className="answer-head">
        <Kicker no={no}>Notre réponse</Kicker>
        <Standfirst at={0.3}>Un musée qu’on visite, et qu’on construit ensemble. Quatre verbes résument le projet.</Standfirst>
      </div>
      <ol className="verbs">
        {VERBS.map((v, i) => (
          <li key={v.verb} className="verb">
            <span className="verb-word" data-split="lines" data-at={0.5 + i * 0.16}>{v.verb}</span>
            <p data-in="fade" data-at={0.8 + i * 0.16}><span>{String(i + 1).padStart(2, "0")}</span>{v.body}</p>
          </li>
        ))}
      </ol>
    </Stage>
  );
}
