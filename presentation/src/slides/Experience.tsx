import { useMemo } from "react";
import { Artifact } from "../components/Artifact";
import { GenArt } from "../components/GenArt";
import { prng, seedFrom } from "../components/genart";
import { Eyebrow, Icon, Stage, Title, type IconName } from "../components/Primitives";
import type { SceneProps } from "../deck/types";

/* ───────────── Visiter le musée ───────────── */

const VISIT: { icon: IconName; text: string }[] = [
  { icon: "hand", text: "Se déplacer à gauche ou à droite dans la galerie" },
  { icon: "eye", text: "Choisir une peinture pour s’approcher de ses détails et de son histoire" },
  { icon: "cube", text: "Faire venir une sculpture au premier plan et la tourner en 3D" },
  { icon: "door", text: "Revenir dans la galerie et poursuivre la visite" },
];

const FRAMES = ["salle-a", "salle-b", "salle-c", "salle-d", "salle-e", "salle-f", "salle-g"];

export function Visit({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-visit">
      <div className="visit-copy">
        <Eyebrow no={no} label="Expérience 1 · Visiter" />
        <Title lines={["Une galerie"]} accent="où l’on s’approche." />
        <ol className="steps">
          {VISIT.map((s, i) => (
            <li key={s.text} data-in="left" data-at={0.8 + i * 0.12}>
              <span className="steps-no mono">0{i + 1}</span><span className="steps-icon"><Icon name={s.icon} /></span><span>{s.text}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="gallery" data-in="blur" data-at="0.25" data-dur="1.3" aria-hidden="true">
        <div className="gallery-spot" />
        <div className={`gallery-track ${instant ? "" : "is-moving"}`}>
          {[...FRAMES, ...FRAMES].map((seed, i) => (
            <figure key={i} className={`frame ${i % FRAMES.length === 3 ? "frame--focus" : ""}`}>
              <div className="frame-wood"><GenArt seed={seed} variant={i % 2 ? "portrait" : "weave"} /></div>
            </figure>
          ))}
        </div>
        <aside className="cartel glass" data-in="up" data-at="1.4">
          <span className="tag mono">Cartel</span>
          <dl>
            {["Titre", "Créateur", "Technique", "Provenance déclarée"].map(k => <div key={k}><dt>{k}</dt><dd><i className="skeleton" /></dd></div>)}
          </dl>
          <span className="cartel-status"><i aria-hidden="true" />Information vérifiée</span>
        </aside>
        <div className="gallery-floor" />
      </div>
    </Stage>
  );
}

/* ───────────── Contribuer ───────────── */

const FIELDS = ["Nom de l’œuvre", "Description", "Créateur", "Origine", "Droits de publication"];
const MEDIA: { icon: IconName; label: string }[] = [
  { icon: "eye", label: "Photo" },
  { icon: "spark", label: "Vidéo" },
  { icon: "cube", label: "Modèle 3D autorisé" },
];

export function Contribute({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-contribute">
      <div className="contrib-head">
        <Eyebrow no={no} label="Expérience 2 · Contribuer" />
        <Title lines={["Chacun peut enrichir"]} accent="la collection." />
      </div>
      <div className="contrib-body">
        <form className="record glass glass--edge" data-in="flip" data-at="0.7" onSubmit={e => e.preventDefault()} aria-label="Maquette de fiche d’œuvre">
          <header className="record-head"><span className="tag mono">Nouvelle fiche</span><span className="record-dot" aria-hidden="true" /></header>
          <div className="record-fields">
            {FIELDS.map((f, i) => (
              <label key={f} className="field" data-in="fade" data-at={1 + i * 0.07}><span>{f}</span><i className="skeleton" style={{ width: `${88 - i * 9}%` }} /></label>
            ))}
          </div>
          <div className="record-media">
            {MEDIA.map((m, i) => <span key={m.label} className="media-tile" data-in="scale" data-at={1.4 + i * 0.08}><Icon name={m.icon} size={20} />{m.label}</span>)}
          </div>
          <div className="record-actions" data-in="up" data-at="1.7">
            <span className="btn btn--ghost">Aperçu</span>
            <span className="btn btn--holo">Soumettre pour revue</span>
          </div>
        </form>

        <div className="flow" aria-label="Cycle de vie d’une contribution">
          <svg className="flow-lines" viewBox="0 0 420 360" data-draw data-at="1.6" data-dur="1.4" aria-hidden="true" preserveAspectRatio="none">
            <path d="M210 40 V110" /><path d="M210 150 V200" />
            <path d="M210 240 C210 280, 70 270, 70 318" /><path d="M210 240 V318" /><path d="M210 240 C210 280, 350 270, 350 318" />
          </svg>
          <span className="flow-node" style={{ top: "4%" }} data-in="scale" data-at="1.5">Brouillon</span>
          <span className="flow-node" style={{ top: "33%" }} data-in="scale" data-at="1.9">Soumis</span>
          <span className="flow-node flow-node--active" style={{ top: "56%" }} data-in="scale" data-at="2.2" data-sfx="blip">En revue</span>
          <div className="flow-outcomes">
            <span className="status status--ok" data-in="up" data-at="2.6"><Icon name="check" size={16} />Accepté</span>
            <span className="status status--warn" data-in="up" data-at="2.7"><Icon name="pause" size={16} />À compléter</span>
            <span className="status status--ko" data-in="up" data-at="2.8"><Icon name="x" size={16} />Refusé</span>
          </div>
          <p className="flow-note" data-in="fade" data-at="3">Le contributeur suit l’état de sa soumission. Une œuvre acceptée peut être publiée, puis associée à un NFT de provenance.</p>
        </div>
      </div>
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
  const Finder = ({ x, y }: { x: number; y: number }) => (
    <g><rect x={x + 0.5} y={y + 0.5} width={6} height={6} fill="none" stroke="currentColor" /><rect x={x + 2} y={y + 2} width={3} height={3} /></g>
  );
  return (
    <svg className="qr" viewBox="-1 -1 27 27" fill="currentColor" role="img" aria-label="QR code illustratif">
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} rx={0.2} />)}
      <Finder x={0} y={0} /><Finder x={18} y={0} /><Finder x={0} y={18} />
    </svg>
  );
}

const HANDOFF = ["Ouvrir la fiche sur ordinateur, « Scanner avec mon iPhone »", "Scanner le QR code : l’iPhone rejoint la session", "Autoriser la capture et scanner l’objet", "Vérifier le scan sur le téléphone, puis l’envoyer", "Revenir sur ordinateur : inspecter le modèle 3D, ajouter le contexte"];
const PIPELINE = ["Capture USDZ", "Nettoyage hors ligne", "GLB optimisé", "Visionneuse web"];

export function Handoff({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-handoff">
      <div className="handoff-copy">
        <Eyebrow no={no} label="Expérience 3 · Numériser" />
        <Title lines={["Du bureau à l’iPhone,"]} accent="et retour." />
        <ol className="steps steps--compact">
          {HANDOFF.map((s, i) => <li key={s} data-in="left" data-at={0.75 + i * 0.1}><span className="steps-no mono">0{i + 1}</span><span>{s}</span></li>)}
        </ol>
      </div>
      <div className="handoff-stage">
        <div className="device-desktop glass" data-in="left" data-at="0.4" data-dur="1">
          <div className="browser-bar" aria-hidden="true"><i /><i /><i /><span className="mono">lova · fiche d’œuvre</span></div>
          <div className="desktop-body">
            <div className="desktop-thumb"><GenArt seed="handoff-item" /></div>
            <div className="desktop-qr"><PseudoQR seed="lova-session" /><span className="mono">Scanner avec mon iPhone</span></div>
          </div>
        </div>
        <svg className="handoff-beam" viewBox="0 0 120 40" aria-hidden="true" data-draw data-at="1.1" data-dur="0.8">
          <path d="M4 20 H108"/><path d="M100 12 L110 20 L100 28" />
        </svg>
        <div className="device-phone" data-in="right" data-at="0.6" data-dur="1.1" data-sfx="scan">
          <div className="phone-notch" aria-hidden="true" />
          <div className="phone-screen">
            <Artifact reduced={instant} mode="scan" />
            <span className="phone-rec mono"><i aria-hidden="true" />LiDAR · capture</span>
          </div>
        </div>
        <ol className="pipeline mono" aria-label="Chaîne de traitement 3D">
          {PIPELINE.map((p, i) => <li key={p} data-in="up" data-at={1.5 + i * 0.12}>{p}</li>)}
        </ol>
        <p className="handoff-proof" data-in="fade" data-at="2.1"><Icon name="check" size={16} />Étude de faisabilité : un scan réel est passé de l’USDZ au GLB, jusqu’à la visionneuse web.</p>
      </div>
    </Stage>
  );
}
