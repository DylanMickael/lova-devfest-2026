import { useMemo } from "react";
import { Artifact } from "../components/Artifact";
import { GenArt } from "../components/GenArt";
import { prng, seedFrom } from "../components/genart";
import { Caption, Headline, Kicker, Rule, Stage, Standfirst } from "../components/Primitives";
import type { SceneProps } from "../deck/types";

/* ───────────── Visiter le musée ───────────── */

const VISIT = [
  "On se déplace à gauche ou à droite dans la galerie.",
  "On choisit une peinture pour s’approcher de ses détails et de son histoire.",
  "On fait venir une sculpture au premier plan et on la tourne en 3D.",
  "On revient dans la galerie pour poursuivre la visite.",
];
const FRAMES = ["salle-a", "salle-b", "salle-c", "salle-d", "salle-e", "salle-f"];

export function Visit({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-visit">
      <div className="visit-text">
        <Kicker no={no}>Expérience · Visiter</Kicker>
        <Headline lines={["Une galerie"]} em="où l’on s’approche." />
        <ol className="numbered">
          {VISIT.map((s, i) => <li key={s} data-in="up" data-at={0.9 + i * 0.1}><span>{i + 1}</span>{s}</li>)}
        </ol>
      </div>
      <figure className="visit-figure">
        <div className="wall" data-in="clip" data-at="0.3" data-dur="1.2" aria-hidden="true">
          <div className={`wall-track ${instant ? "" : "is-moving"}`}>
            {[...FRAMES, ...FRAMES].map((seed, i) => (
              <div key={i} className={`wall-frame wall-frame--${i % 3}`}><GenArt seed={seed} variant={i % 2 ? "portrait" : "weave"} /></div>
            ))}
          </div>
          <div className="wall-label">
            <span>Salle Peinture</span>
            <b>Titre · Créateur · Technique · Provenance déclarée</b>
            <span className="wall-label-status">Information vérifiée</span>
          </div>
        </div>
        <Caption fig="Fig. 1" at={1.4}>La galerie, inspirée d’un vrai lieu d’exposition : lumière, déplacement latéral, cartel de l’œuvre.</Caption>
      </figure>
    </Stage>
  );
}

/* ───────────── Contribuer ───────────── */

const FIELDS = ["Nom de l’œuvre", "Créateur", "Origine", "Description"];
const STATES = [
  { label: "Brouillon", text: "La fiche se prépare." },
  { label: "Soumis", text: "Les médias et les droits sont joints." },
  { label: "En revue", text: "Un relecteur habilité examine les preuves." },
];

export function Contribute({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-contribute">
      <div className="contribute-text">
        <Kicker no={no}>Expérience · Contribuer</Kicker>
        <Headline lines={["Chacun peut enrichir"]} em="la collection." />
        <Standfirst at={0.8}>Une fiche, des médias, une soumission. Le contributeur suit ensuite le sort de sa proposition.</Standfirst>
        <ol className="states">
          {STATES.map((s, i) => (
            <li key={s.label} data-in="left" data-at={1.1 + i * 0.14}><b>{s.label}</b><span>{s.text}</span></li>
          ))}
          <li className="states-outcomes" data-in="left" data-at="1.55">
            <b>Puis</b>
            <span><em className="ok">Accepté</em> · <em className="warn">À compléter</em> · <em className="ko">Refusé</em></span>
          </li>
        </ol>
      </div>
      <form className="coupon" data-in="up" data-at="0.5" data-dur="1" onSubmit={e => e.preventDefault()} aria-label="Bulletin de contribution (maquette)">
        <span className="coupon-scissors" aria-hidden="true">✂</span>
        <header>
          <strong>Bulletin de contribution</strong>
          <span>À remplir en ligne, aucun timbre nécessaire</span>
        </header>
        {FIELDS.map(f => <label key={f} className="coupon-field"><span>{f}</span><i /></label>)}
        <fieldset className="coupon-checks">
          <legend>Médias joints</legend>
          <span><i />Photographie</span><span><i />Vidéo</span><span><i />Modèle 3D autorisé</span>
        </fieldset>
        <fieldset className="coupon-checks">
          <legend>Droits</legend>
          <span><i className="is-checked" />J’ai le droit de publier ces médias</span>
        </fieldset>
        <footer><span>Aperçu</span><b>Soumettre pour revue →</b></footer>
      </form>
    </Stage>
  );
}

/* ───────────── Du bureau à l’iPhone ───────────── */

function PseudoQR({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    const n = 25, rnd = prng(seedFrom(seed)), out: [number, number][] = [];
    const finder = (x: number, y: number) => [[0, 0], [n - 7, 0], [0, n - 7]].some(([fx, fy]) => x >= fx - 1 && x < fx + 8 && y >= fy - 1 && y < fy + 8);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!finder(x, y) && rnd() > 0.52) out.push([x, y]);
    return out;
  }, [seed]);
  const finders = [[0, 0], [18, 0], [0, 18]];
  return (
    <svg className="qr" viewBox="-1 -1 27 27" fill="currentColor" role="img" aria-label="QR code illustratif">
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />)}
      {finders.map(([x, y]) => (
        <g key={`${x}-${y}`}><rect x={x + 0.5} y={y + 0.5} width={6} height={6} fill="none" stroke="currentColor" /><rect x={x + 2} y={y + 2} width={3} height={3} /></g>
      ))}
    </svg>
  );
}

const HANDOFF = [
  "Sur ordinateur, ouvrir la fiche de l’œuvre et choisir « Scanner avec mon iPhone ».",
  "Scanner le QR code : l’iPhone rejoint la session.",
  "Autoriser la capture, puis scanner l’objet.",
  "Vérifier le scan sur le téléphone et lancer l’envoi.",
  "Revenir sur ordinateur, inspecter le modèle 3D et ajouter le contexte.",
];

export function Handoff({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-handoff">
      <div className="handoff-text">
        <Kicker no={no}>Reportage · Numériser</Kicker>
        <Headline lines={["Du bureau à l’iPhone,"]} em="et retour." />
        <Rule at={0.8} />
        <ol className="numbered numbered--tight">
          {HANDOFF.map((s, i) => <li key={s} data-in="up" data-at={0.9 + i * 0.08}><span>{i + 1}</span>{s}</li>)}
        </ol>
      </div>
      <figure className="handoff-figure">
        <div className="handoff-devices">
          <div className="handoff-qr" data-in="up" data-at="0.4"><PseudoQR seed="lova-session" /><span>Scanner avec mon iPhone</span></div>
          <div className="phone" data-in="up" data-at="0.6" data-sfx="scan">
            <div className="phone-screen"><Artifact reduced={instant} mode="scan" /><span className="phone-rec">LiDAR · capture</span></div>
          </div>
        </div>
        <p className="pipeline" data-in="fade" data-at="1.4">Capture USDZ <b>→</b> nettoyage hors ligne <b>→</b> GLB optimisé <b>→</b> visionneuse web</p>
        <Caption fig="Fig. 2" at={1.6}>L’étude de faisabilité a fait passer un scan réel de l’USDZ au GLB, jusqu’à la visionneuse web.</Caption>
      </figure>
    </Stage>
  );
}
