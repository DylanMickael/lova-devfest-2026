import { GenArt } from "../components/GenArt";
import { Headline, Kicker, Rule, Stage, Standfirst } from "../components/Primitives";
import { Barcode } from "../components/Print";
import { ISSUE, TEAM } from "../deck/content";
import type { SceneProps } from "../deck/types";

/* ───────────── Ours : l’équipe ───────────── */

export function Team({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-team">
      <div className="team-head">
        <Kicker no={no}>Ont contribué à ce numéro</Kicker>
        <Headline size="xl" lines={["Cinq bâtisseurs,"]} em="une plateforme." />
        <Standfirst at={0.8}>Chaque responsable porte son service de bout en bout : API, tests, Dockerfile et données. Les contrats entre services se négocient à deux.</Standfirst>
      </div>
      <dl className="masthead-credits">
        {TEAM.map((m, i) => (
          <div key={m.handle} data-in="up" data-at={1 + i * 0.1}>
            <dt>{m.role}</dt>
            <dd><span className="credit-portrait"><GenArt seed={`pfp:${m.handle}`} variant="portrait" /></span>@{m.handle}</dd>
          </div>
        ))}
      </dl>
    </Stage>
  );
}

/* ───────────── La démo ───────────── */

const GATES = ["Soumission authentifiée", "Revue humaine", "Publication", "Visite en invité", "3D interactive", "Mint confirmé"];
const TRACKS = [
  { title: "Visiter", body: "Parcourir la galerie, zoomer sur une peinture, tourner une sculpture en 3D." },
  { title: "Contribuer", body: "Créer une fiche, importer un média ou un modèle autorisé, soumettre pour revue." },
  { title: "Revoir et tracer", body: "Voir le statut d’une contribution, le refus d’une œuvre générée par IA après revue, la provenance d’une œuvre acceptée." },
];

export function Demo({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-demo">
      <Kicker no={no}>Démonstration</Kicker>
      <Headline lines={["Une œuvre,"]} em="de bout en bout." />
      <ol className="gates">
        {GATES.map((g, i) => (
          <li key={g} data-in="up" data-at={0.8 + i * 0.1}><span>{String(i + 1).padStart(2, "0")}</span>{g}</li>
        ))}
      </ol>
      <Rule at={1.5} />
      <div className="tracks">
        {TRACKS.map((t, i) => (
          <section key={t.title} data-in="up" data-at={1.6 + i * 0.1}><h2>{t.title}</h2><p>{t.body}</p></section>
        ))}
      </div>
      <p className="note" data-in="fade" data-at="2">Les données simulées montrées pendant la démo sont étiquetées comme telles.</p>
    </Stage>
  );
}

/* ───────────── À suivre ───────────── */

const NEXT = [
  { title: "Salles thématiques", body: "Peinture, sculpture, savoir-faire, musique : un parcours par salle." },
  { title: "Musique traditionnelle", body: "L’ambiance sonore des œuvres, de la valiha aux chants." },
  { title: "Parcours pédagogiques", body: "Des expériences éducatives pour les écoles et les familles." },
  { title: "Artistes et artisans", body: "Plus de façons de mettre en valeur celles et ceux qui créent." },
  { title: "Capture intégrée", body: "Le scan iPhone directement dans l’application." },
];

export function Next({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-next">
      <div className="next-head">
        <Kicker no={no}>À suivre</Kicker>
        <Headline size="xl" lines={["Dans les prochains"]} em="numéros." />
        <Standfirst at={0.8}>Le premier prototype n’est que la première salle.</Standfirst>
      </div>
      <ol className="next-list">
        {NEXT.map((n, i) => (
          <li key={n.title} data-in="up" data-at={0.9 + i * 0.1}><span>{String(i + 1).padStart(2, "0")}</span><strong>{n.title}</strong><p>{n.body}</p></li>
        ))}
      </ol>
    </Stage>
  );
}

/* ───────────── Quatrième de couverture ───────────── */

export function BackCover({ instant }: SceneProps) {
  return (
    <Stage instant={instant} className="p-back">
      <div className="back-plate" data-in="clip" data-at="0" data-dur="1.4"><GenArt seed="back-cover-weave" /></div>
      <div className="back-text">
        <h1 id="slide-title" className="back-title" data-split="chars" data-at="0.3">Misaotra.</h1>
        <p className="back-sub" data-in="fade" data-at="1">Merci · Thank you</p>
        <p className="back-motto" data-split="lines" data-at="1.2">Découvrir le patrimoine. Le faire vivre. <em>Le transmettre.</em></p>
        <Rule at={1.6} />
        <div className="colophon" data-in="fade" data-at="1.8">
          <p><b>Colophon.</b> Composé en TikTok Sans, Departure Mono et Geist Mono, selon le DESIGN.md de LOVA. Réalisé avec React, GSAP et Three.js.</p>
          <p>Visuels génératifs : aucune image patrimoniale n’est reproduite tant que ses droits ne sont pas validés. Les références de token sont des spécimens.</p>
        </div>
        <div className="back-foot" data-in="fade" data-at="2">
          <span>{ISSUE.name} · {ISSUE.number} · {ISSUE.event}</span>
          <Barcode seed="lova-back" label="PRESERVING · THE · ART" />
        </div>
      </div>
    </Stage>
  );
}
