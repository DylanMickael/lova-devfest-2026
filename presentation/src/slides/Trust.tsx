import { GenArt } from "../components/GenArt";
import { sampleHex } from "../components/genart";
import { Eyebrow, Icon, Lead, Stage, Title } from "../components/Primitives";
import { TokenCard } from "../components/TokenCard";
import type { SceneProps } from "../deck/types";

/* ───────────── Revue humaine ───────────── */

const SIGNALS = ["Incohérence entre média et fiche", "Indice de contenu généré", "Métadonnées suggérées"];
const CHECKS = ["Cohérence média / fiche", "Attribution & crédits", "Provenance déclarée", "Droits de publication"];

export function Review({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-review">
      <div className="review-head">
        <Eyebrow no={no} label="Confiance · Revue des contributions" />
        <Title lines={["L’IA signale."]} accent="L’humain décide." />
      </div>
      <div className="review-board">
        <div className="review-col">
          <span className="col-label mono" data-in="fade" data-at="0.7">Signaux automatiques · incertains</span>
          {SIGNALS.map((s, i) => <span key={s} className="signal" data-in="left" data-at={0.8 + i * 0.12}><Icon name="spark" size={16} />{s}</span>)}
        </div>

        <svg className="review-wires" viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden="true" data-draw data-at="1.2" data-dur="1">
          <path d="M0 60 C100 60, 100 150, 200 150" /><path d="M0 150 H200" /><path d="M0 240 C100 240, 100 150, 200 150" />
        </svg>

        <article className="reviewer glass glass--edge" data-in="scale" data-at="1.3" data-sfx="blip">
          <header><span className="reviewer-avatar"><Icon name="user" size={22} /></span><div><strong>Relecteur habilité</strong><span className="mono">Preuves · affirmations · décision</span></div></header>
          <div className="reviewer-thumb"><GenArt seed="review-item" /></div>
          <ul className="checklist">
            {CHECKS.map((c, i) => <li key={c} data-in="fade" data-at={1.6 + i * 0.1}><Icon name="check" size={14} />{c}</li>)}
          </ul>
        </article>

        <div className="review-col review-col--out">
          <span className="col-label mono" data-in="fade" data-at="2">Statut de chaque affirmation</span>
          <span className="status status--ok" data-in="right" data-at="2.1"><Icon name="check" size={16} />Vérifié</span>
          <span className="status status--warn" data-in="right" data-at="2.2"><Icon name="pause" size={16} />Incertain</span>
          <span className="status status--muted" data-in="right" data-at="2.3"><Icon name="eye" size={16} />Non revu</span>
        </div>
      </div>
      <ul className="rules" data-in="up" data-at="2.5">
        <li><b>Œuvres générées par IA</b> exclues de la collection</li>
        <li><b>Aucune auto-validation</b> : un contributeur ne vérifie pas sa propre soumission</li>
        <li><b>Retouche ou optimisation</b> d’une photo réelle : jamais un motif de refus à elle seule</li>
      </ul>
    </Stage>
  );
}

/* ───────────── Le NFT de provenance ───────────── */

const SPECS = [
  { k: "Standard", v: "ERC‑721 · une œuvre = un token" },
  { k: "Réseau", v: "Avalanche Fuji · C‑Chain" },
  { k: "Stockage", v: "IPFS : média, aperçu et fiche" },
  { k: "Empreinte", v: "sha256 du fichier maître, inscrite on‑chain" },
  { k: "Fiche", v: "Immuable : aucune modification du tokenURI" },
  { k: "Garde", v: "Mint vers le wallet de la galerie, gas payé par elle" },
];

export function Provenance({ instant, no }: SceneProps) {
  const fingerprint = sampleHex("sha:lova-provenance");
  return (
    <Stage instant={instant} className="s-provenance">
      <div className="prov-copy">
        <Eyebrow no={no} label="Confiance · Provenance numérique" />
        <Title lines={["Chaque œuvre acceptée"]} accent="laisse une trace." />
        <Lead at={0.9}>
          Après revue et publication, la fiche est figée et associée à un token. Aucun artisan n’a besoin de wallet :
          la galerie agit comme dépositaire.
        </Lead>
        <dl className="specs">
          {SPECS.map((s, i) => <div key={s.k} data-in="up" data-at={1.1 + i * 0.08}><dt className="mono">{s.k}</dt><dd>{s.v}</dd></div>)}
        </dl>
        <div className="hashline mono" data-in="fade" data-at="1.7">
          <span>sha256(maître)</span><b aria-hidden="true">→</b>
          <code data-scramble={`0x${fingerprint.slice(0, 40)}…`} data-at="1.75" data-dur="1.6">0x{fingerprint.slice(0, 40)}…</code>
          <small>exemple</small>
        </div>
      </div>
      <div className="prov-visual">
        <div className="prov-chainid" data-in="fade" data-at="0.5" aria-label="Chain ID 43113">
          <span className="mono">chainId</span>
          <strong className="serif" data-count="43113" data-group="off" data-at="0.6" data-dur="1.8">43113</strong>
        </div>
        <div data-in="blur" data-at="0.35" data-dur="1.4" data-sfx="chime">
          <TokenCard seed="lova-provenance" title="Fiche n° 0007" author="Collection LOVA · démo" tokenId={7} size="l" />
        </div>
      </div>
    </Stage>
  );
}

/* ───────────── Ce que le token prouve ───────────── */

const YES = ["Un événement numérique, daté et vérifiable", "Le lien entre l’œuvre publiée et un instantané approuvé de sa fiche", "L’empreinte du fichier maître, lisible même si la fiche n’est plus épinglée"];
const NO = ["L’authenticité physique de l’objet", "L’exactitude des affirmations de la fiche", "Le droit d’auteur ou la propriété de l’œuvre"];

export function Scope({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-scope">
      <Eyebrow no={no} label="Confiance · Honnêteté du dispositif" />
      <Title lines={["Ce que le token établit,"]} accent="et ce qu’il n’établit pas." />
      <div className="scope-grid">
        <section className="scope-col scope-col--yes glass glass--edge" data-in="left" data-at="0.9">
          <h2><Icon name="check" />Il établit</h2>
          <ul>{YES.map((y, i) => <li key={y} data-in="fade" data-at={1.1 + i * 0.1}>{y}</li>)}</ul>
        </section>
        <section className="scope-col scope-col--no glass" data-in="right" data-at="1">
          <h2><Icon name="x" />Il n’établit pas</h2>
          <ul>{NO.map((n, i) => <li key={n} data-in="fade" data-at={1.2 + i * 0.1}>{n}</li>)}</ul>
          <p className="scope-foot">Ces points relèvent de preuves et d’autorisations distinctes.</p>
        </section>
      </div>
      <p className="banner serif" data-in="clip" data-at="1.8" data-dur="1">Pas de vente. Pas de spéculation. <em className="holo-text">Du patrimoine, documenté.</em></p>
    </Stage>
  );
}
