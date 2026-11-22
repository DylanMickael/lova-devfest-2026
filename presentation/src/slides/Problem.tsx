import { Eyebrow, Icon, Lead, Stage, Title, type IconName } from "../components/Primitives";
import type { SceneProps } from "../deck/types";

/* ───────────── Le constat ───────────── */

const ISSUES: { icon: IconName; title: string; body: string; tag: string }[] = [
  { icon: "door", tag: "Accès", title: "Hors de portée", body: "La visite en personne n’est pas toujours possible : peintures, sculptures et objets restent loin d’une grande partie du public." },
  { icon: "book", tag: "Récit", title: "Sans leur histoire", body: "Une œuvre privée de son créateur, de sa technique traditionnelle et de son contexte perd l’essentiel de son sens." },
  { icon: "shield", tag: "Confiance", title: "Sans trace", body: "Provenance peu documentée, images générées par IA : la frontière entre œuvre humaine et imitation se brouille." },
];

export function Issues({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-issues">
      <Eyebrow no={no} label="Le constat" />
      <Title lines={["Le patrimoine existe."]} accent="Il reste à le rendre vivant." />
      <div className="issue-grid">
        {ISSUES.map((it, i) => (
          <article key={it.title} className="issue glass glass--edge" data-in="up" data-at={0.8 + i * 0.16} data-sfx={i === 0 ? "blip" : undefined}>
            <header><span className="issue-icon"><Icon name={it.icon} size={26} /></span><span className="tag mono">{String(i + 1).padStart(2, "0")} · {it.tag}</span></header>
            <h2>{it.title}</h2>
            <p>{it.body}</p>
          </article>
        ))}
      </div>
    </Stage>
  );
}

/* ───────────── La réponse ───────────── */

const PILLARS: { verb: string; body: string; icon: IconName }[] = [
  { verb: "Découvrir", icon: "eye", body: "Une galerie immersive et accessible, inspirée d’un vrai lieu d’exposition." },
  { verb: "Comprendre", icon: "book", body: "Chaque œuvre avec son histoire, son origine et son contexte documenté." },
  { verb: "Transmettre", icon: "upload", body: "Créateurs, dépositaires et chercheurs partagent et numérisent les œuvres." },
  { verb: "Protéger", icon: "link", body: "Revue des contributions et provenance numérique des œuvres acceptées." },
];

export function Answer({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-answer">
      <div className="answer-head">
        <Eyebrow no={no} label="Notre réponse" />
        <Title lines={["Un musée qu’on visite,"]} accent="et qu’on construit ensemble." />
        <Lead at={0.9}>
          LOVA relie les œuvres, leurs histoires et les personnes qui les préservent, pour rendre le patrimoine
          malagasy plus accessible, plus interactif et plus facile à transmettre.
        </Lead>
      </div>
      <ol className="pillars">
        {PILLARS.map((p, i) => (
          <li key={p.verb} className="pillar" data-in="up" data-at={1.1 + i * 0.12}>
            <span className="pillar-no mono">0{i + 1}</span>
            <span className="pillar-icon"><Icon name={p.icon} size={28} /></span>
            <strong className="serif">{p.verb}</strong>
            <p>{p.body}</p>
            <i className="pillar-bar" data-bar="1" data-at={1.3 + i * 0.12} aria-hidden="true" />
          </li>
        ))}
      </ol>
    </Stage>
  );
}
