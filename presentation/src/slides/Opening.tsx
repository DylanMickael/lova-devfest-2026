import { Artifact } from "../components/Artifact";
import { Chip, Eyebrow, Lead, Stage, Title } from "../components/Primitives";
import { TokenCard } from "../components/TokenCard";
import { AGENDA, PROJECT } from "../deck/content";
import type { SceneProps } from "../deck/types";

/* ───────────── 01 · Couverture ───────────── */

export function Cover({ instant }: SceneProps) {
  return (
    <Stage instant={instant} className="s-cover">
      <div className="cover-copy">
        <p className="cover-kicker" data-in="fade" data-at="0">
          <span className="pill pill--live"><i aria-hidden="true" />{PROJECT.event}</span>
          <span>{PROJECT.hackathon}</span>
        </p>
        <h1 id="slide-title" className="cover-wordmark holo-text" data-split="chars" data-at="0.15">{PROJECT.name}</h1>
        <p className="cover-tagline serif" data-split="lines" data-at="0.75">{PROJECT.tagline}.</p>
        <Lead at={1.05}>
          Un musée numérique et participatif du patrimoine culturel de Madagascar : on le visite, on y contribue,
          et chaque œuvre acceptée garde une trace numérique de sa provenance.
        </Lead>
        <div className="row" data-in="up" data-at="1.25">
          <Chip tone="gold">Découvrir</Chip>
          <Chip tone="wine">Comprendre</Chip>
          <Chip tone="holo">Transmettre</Chip>
          <Chip tone="jade">Protéger</Chip>
        </div>
        <p className="cover-meaning mono" data-in="fade" data-at="1.5"><b>lova</b> <span>/ˈlu.va/</span> {PROJECT.meaning}</p>
      </div>
      <div className="cover-cards" data-in="blur" data-at="0.4" data-dur="1.4" data-sfx="chime">
        <TokenCard seed="lova-back-2" title="Fiche n° 0002" author="Collection LOVA · démo" tokenId={2} status="pending" size="m" className="cover-card cover-card--back" />
        <TokenCard seed="lova-cover-1" title="Fiche n° 0001" author="Collection LOVA · démo" tokenId={1} size="l" className="cover-card cover-card--front" />
      </div>
    </Stage>
  );
}

/* ───────────── 02 · L’œuvre en volume ───────────── */

export function Volume({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-volume">
      <div className="stack volume-copy">
        <Eyebrow no={no} label="Pourquoi LOVA" />
        <Title level="xl" lines={["Une œuvre a", "une matière,", "un volume,"]} accent="une histoire." />
        <Lead at={1}>
          Quand la visite en personne est difficile, une galerie numérique peut montrer une sculpture sous
          tous ses angles et rendre son histoire accessible à beaucoup plus de monde.
        </Lead>
      </div>
      <div className="volume-world" data-in="scale" data-at="0.3" data-dur="1.4">
        <Artifact reduced={instant} />
        <ul className="hud mono" aria-label="Caractéristiques de la visionneuse">
          <li className="hud-item hud-item--tl" data-in="fade" data-at="1.4"><span>Format</span>GLB optimisé</li>
          <li className="hud-item hud-item--tr" data-in="fade" data-at="1.55"><span>Texture</span>1K · 2K à la demande</li>
          <li className="hud-item hud-item--bl" data-in="fade" data-at="1.7"><span>Interaction</span>Rotation 360°</li>
          <li className="hud-item hud-item--br" data-in="fade" data-at="1.85"><span>Repli</span>Image fixe</li>
        </ul>
        <p className="volume-note" data-in="fade" data-at="2">Artefact procédural de démonstration</p>
      </div>
    </Stage>
  );
}

/* ───────────── 03 · Sommaire ───────────── */

export function Agenda({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-agenda">
      <Eyebrow no={no} label="Sommaire" />
      <Title level="l" lines={["Quatre mouvements,"]} accent="une seule œuvre." />
      <ol className="agenda-grid">
        {AGENDA.map((part, i) => (
          <li key={part.roman} className="agenda-col glass" data-in="flip" data-at={0.6 + i * 0.14}>
            <span className="agenda-roman holo-text serif">{part.roman}</span>
            <strong>{part.title}</strong>
            <ul>{part.items.map(item => <li key={item}>{item}</li>)}</ul>
          </li>
        ))}
      </ol>
    </Stage>
  );
}

/* ───────────── Ouvertures de partie ───────────── */

export function Part({ roman, label, accent, chapters }: { roman: string; label: string; accent: string; chapters: string[] }) {
  return function PartScene({ instant, no }: SceneProps) {
    return (
      <Stage instant={instant} className="s-part">
        <div className="part-orbit" aria-hidden="true" data-in="blur" data-at="0" data-dur="1.6"><i /><i /><i /></div>
        <p className="part-label mono" data-in="fade" data-at="0.1">Partie {roman} · Bloc {no}</p>
        <span className="part-roman serif holo-text" data-in="scale" data-at="0.15" data-dur="1.2" aria-hidden="true">{roman}</span>
        <h1 id="slide-title" className="title title--xl part-title" data-split="lines" data-at="0.4">
          <span className="title-line">{label}{label.endsWith("’") ? "" : " "}<em className="holo-text">{accent}</em></span>
        </h1>
        <ol className="part-chapters">
          {chapters.map((c, i) => (
            <li key={c} data-in="up" data-at={0.9 + i * 0.1}><span className="mono">{String(i + 1).padStart(2, "0")}</span>{c}</li>
          ))}
        </ol>
      </Stage>
    );
  };
}
