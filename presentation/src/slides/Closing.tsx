import { Artifact } from "../components/Artifact";
import { GenArt } from "../components/GenArt";
import { Eyebrow, Icon, Lead, Stage, Title, type IconName } from "../components/Primitives";
import { TokenCard } from "../components/TokenCard";
import { PROJECT, TEAM } from "../deck/content";
import type { SceneProps } from "../deck/types";

/* ───────────── Équipe ───────────── */

export function Team({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-team">
      <Eyebrow no={no} label="Plateforme · Équipe" />
      <Title lines={["Cinq responsables,"]} accent="chacun de bout en bout." />
      <ul className="team-grid">
        {TEAM.map((m, i) => (
          <li key={m.handle} className={`member glass glass--edge member--${m.tone}`} data-in="flip" data-at={0.7 + i * 0.12}>
            <span className="member-pfp"><GenArt seed={`pfp:${m.handle}`} variant="portrait" /></span>
            <strong className="mono">@{m.handle}</strong>
            <span>{m.role}</span>
            <span className="member-token mono">#{String(i + 1).padStart(3, "0")}</span>
          </li>
        ))}
      </ul>
      <Lead at={1.5}>
        Chaque responsable porte son service de l’initialisation à l’intégration : API, tests, Dockerfile et données.
        Les contrats entre services se négocient à deux.
      </Lead>
    </Stage>
  );
}

/* ───────────── La démo ───────────── */

const GATES: { icon: IconName; label: string }[] = [
  { icon: "upload", label: "Soumission authentifiée" },
  { icon: "shield", label: "Revue humaine" },
  { icon: "eye", label: "Publication" },
  { icon: "door", label: "Visite en invité" },
  { icon: "cube", label: "3D interactive" },
  { icon: "link", label: "Mint confirmé" },
];

const TRACKS = [
  { title: "Visiter", body: "Parcourir la galerie, zoomer sur une peinture, tourner une sculpture en 3D." },
  { title: "Contribuer", body: "Créer une fiche, importer un média ou un modèle autorisé, soumettre pour revue." },
  { title: "Revoir & tracer", body: "Statut d’une contribution, refus d’une œuvre générée par IA après revue, provenance d’une œuvre acceptée." },
];

export function Demo({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-demo">
      <Eyebrow no={no} label="Démonstration" />
      <Title lines={["Une œuvre,"]} accent="de bout en bout." />
      <ol className="gates">
        {GATES.map((g, i) => (
          <li key={g.label} className="gate" data-in="scale" data-at={0.8 + i * 0.14} data-sfx={i === GATES.length - 1 ? "chime" : "tick"}>
            <span className="gate-icon"><Icon name={g.icon} /></span>
            <span className="gate-label">{g.label}</span>
            <span className="gate-check" aria-hidden="true"><Icon name="check" size={14} /></span>
          </li>
        ))}
      </ol>
      <div className="tracks">
        {TRACKS.map((t, i) => (
          <article key={t.title} className="track glass" data-in="up" data-at={1.8 + i * 0.12}>
            <span className="mono">0{i + 1}</span><strong className="serif">{t.title}</strong><p>{t.body}</p>
          </article>
        ))}
      </div>
      <p className="demo-note" data-in="fade" data-at="2.3">Les données simulées montrées pendant la démo sont étiquetées comme telles.</p>
    </Stage>
  );
}

/* ───────────── Et après ───────────── */

const NEXT: { icon: IconName; title: string; body: string }[] = [
  { icon: "door", title: "Salles thématiques", body: "Peinture, sculpture, savoir-faire, musique : des parcours par salle." },
  { icon: "music", title: "Musique traditionnelle", body: "L’ambiance sonore des œuvres, de la valiha aux chants." },
  { icon: "book", title: "Parcours pédagogiques", body: "Des expériences éducatives pour les écoles et les familles." },
  { icon: "hand", title: "Artistes & artisans", body: "Plus de façons de mettre en valeur celles et ceux qui créent." },
  { icon: "phone", title: "Capture intégrée", body: "Le scan iPhone directement dans l’application." },
];

export function Next({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-next">
      <Eyebrow no={no} label="Et après" />
      <Title lines={["Le premier prototype"]} accent="n’est que la première salle." />
      <ul className="next-grid">
        {NEXT.map((n, i) => (
          <li key={n.title} className="next-card glass glass--edge" data-in="up" data-at={0.8 + i * 0.1}>
            <span className="next-icon"><Icon name={n.icon} size={24} /></span>
            <strong>{n.title}</strong>
            <p>{n.body}</p>
          </li>
        ))}
      </ul>
    </Stage>
  );
}

/* ───────────── Merci ───────────── */

export function Thanks({ instant }: SceneProps) {
  return (
    <Stage instant={instant} className="s-thanks">
      <div className="thanks-world" data-in="fade" data-at="0" data-dur="1.8"><Artifact reduced={instant} /></div>
      <div className="thanks-copy">
        <p className="cover-kicker" data-in="fade" data-at="0.2"><span className="pill pill--live"><i aria-hidden="true" />{PROJECT.event}</span><span>{PROJECT.hackathon}</span></p>
        <h1 id="slide-title" className="thanks-title serif holo-text" data-split="chars" data-at="0.4">Misaotra.</h1>
        <p className="thanks-sub" data-in="up" data-at="1.1">Merci · Thank you</p>
        <p className="thanks-motto serif" data-split="lines" data-at="1.3">Découvrir le patrimoine. Le faire vivre. <em className="holo-text">Le transmettre.</em></p>
      </div>
      <div className="thanks-fan" data-in="up" data-at="1.6" data-dur="1.2" data-sfx="chime">
        <TokenCard seed="thanks-a" title="Fiche n° 0011" author="Collection LOVA · démo" tokenId={11} size="s" className="fan fan--a" />
        <TokenCard seed="thanks-b" title="Fiche n° 0012" author="Collection LOVA · démo" tokenId={12} size="s" className="fan fan--b" />
        <TokenCard seed="thanks-c" title="Fiche n° 0013" author="Collection LOVA · démo" tokenId={13} size="s" status="pending" className="fan fan--c" />
      </div>
    </Stage>
  );
}
