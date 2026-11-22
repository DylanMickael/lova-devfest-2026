import { sampleHex } from "../components/genart";
import { Headline, Kicker, Rule, Stage, Standfirst } from "../components/Primitives";
import { Certificate } from "../components/Print";
import type { SceneProps } from "../deck/types";

/* ───────────── Revue humaine ───────────── */

const COLUMNS = [
  { title: "Ce que la machine signale", items: ["Une incohérence entre le média et la fiche", "Un indice de contenu généré", "Des métadonnées suggérées"], note: "Des signaux incertains, jamais un verdict." },
  { title: "Ce que vérifie le relecteur", items: ["La cohérence entre média et fiche", "L’attribution et les crédits", "La provenance déclarée", "Les droits de publication"], note: "Il consigne les preuves, les affirmations et sa décision." },
  { title: "Le statut de chaque affirmation", items: ["Vérifié", "Incertain", "Non revu"], note: "Une suggestion automatique ne change jamais un statut." },
];

export function Review({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-review">
      <Kicker no={no}>La confiance · Revue des contributions</Kicker>
      <blockquote className="pullquote" data-split="lines" data-at="0.2">« L’IA signale. <em>L’humain décide. »</em></blockquote>
      <Rule at={0.9} strong />
      <div className="review-cols">
        {COLUMNS.map((c, i) => (
          <section key={c.title} data-in="up" data-at={1 + i * 0.14}>
            <h2>{c.title}</h2>
            <ul className={i === 2 ? "statuses" : ""}>{c.items.map(it => <li key={it}>{it}</li>)}</ul>
            <p>{c.note}</p>
          </section>
        ))}
      </div>
      <p className="review-rule" data-in="fade" data-at="1.6">
        <b>La règle.</b> Les œuvres générées par IA sont exclues de la collection. Un contributeur ne valide jamais sa propre
        soumission. Une retouche ou une optimisation d’affichage ne suffit pas à refuser la photo d’une œuvre réelle.
      </p>
    </Stage>
  );
}

/* ───────────── Le NFT de provenance ───────────── */

const SPECS: [string, string][] = [
  ["Standard", "ERC‑721 : une œuvre, un token"],
  ["Réseau", "Avalanche Fuji, C‑Chain"],
  ["Stockage", "IPFS pour le média, l’aperçu et la fiche"],
  ["Empreinte", "sha256 du fichier maître, inscrite on‑chain"],
  ["Fiche", "Immuable, aucune modification du tokenURI"],
  ["Garde", "Mint vers le wallet de la galerie, qui paie le gas"],
];

export function Provenance({ instant, no }: SceneProps) {
  const fingerprint = sampleHex("sha:lova-provenance");
  return (
    <Stage instant={instant} className="p-provenance">
      <div className="provenance-text">
        <Kicker no={no}>La confiance · Provenance</Kicker>
        <Headline lines={["Chaque œuvre acceptée"]} em="laisse une trace." />
        <Standfirst at={0.8}>
          Après la revue et la publication, la fiche est figée puis associée à un token. Aucun artisan n’a besoin de
          wallet : la galerie agit comme dépositaire.
        </Standfirst>
        <table className="datasheet" data-in="up" data-at="1">
          <caption>Fiche technique</caption>
          <tbody>{SPECS.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody>
        </table>
        <p className="hashline" data-in="fade" data-at="1.4">
          <span>sha256(maître) →</span>
          <code data-scramble={`0x${fingerprint.slice(0, 32)}…`} data-at="1.45" data-dur="1.4">0x{fingerprint.slice(0, 32)}…</code>
          <small>exemple</small>
        </p>
      </div>
      <div className="provenance-figure" data-in="up" data-at="0.5" data-dur="1.1" data-sfx="chime">
        <Certificate seed="lova-provenance" lot={7} />
      </div>
    </Stage>
  );
}

/* ───────────── Idées reçues ───────────── */

const MYTHS: { claim: string; verdict: boolean; why: string }[] = [
  { claim: "Le token prouve l’authenticité physique de l’objet.", verdict: false, why: "Elle relève de preuves distinctes, examinées à part." },
  { claim: "Le token garantit que la fiche dit vrai.", verdict: false, why: "L’exactitude des affirmations dépend de la revue humaine." },
  { claim: "Le token donne la propriété de l’œuvre.", verdict: false, why: "Le droit d’auteur et la propriété exigent des autorisations distinctes." },
  { claim: "Le token date un événement numérique et le lie à un instantané approuvé de la fiche.", verdict: true, why: "C’est son rôle, et il s’arrête là." },
  { claim: "L’empreinte du fichier maître reste lisible même si la fiche n’est plus épinglée.", verdict: true, why: "Elle est inscrite dans le contrat, sur la chaîne." },
];

export function Myths({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-myths">
      <div className="myths-head">
        <Kicker no={no}>Enquête</Kicker>
        <Headline size="xl" lines={["Idées"]} em="reçues." />
        <Standfirst at={0.7}>Ce qu’un NFT de provenance établit, et ce qu’il n’établit pas.</Standfirst>
      </div>
      <ol className="myths">
        {MYTHS.map((m, i) => (
          <li key={m.claim} data-in="up" data-at={0.9 + i * 0.12}>
            <span className={`verdict ${m.verdict ? "verdict--true" : "verdict--false"}`}>{m.verdict ? "Vrai" : "Faux"}</span>
            <p><b>{m.claim}</b> {m.why}</p>
          </li>
        ))}
      </ol>
      <p className="myths-foot" data-in="fade" data-at="1.7">Pas de vente. Pas de spéculation. <em>Du patrimoine, documenté.</em></p>
    </Stage>
  );
}
