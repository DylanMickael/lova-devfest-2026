import { Eyebrow, Icon, Stage, Title } from "../components/Primitives";
import type { SceneProps } from "../deck/types";

/* ───────────── Architecture ───────────── */

type Node = { x: number; y: number; w: number; h: number; title: string; sub: string; tone?: string };

const NODES: Node[] = [
  { x: 30, y: 228, w: 200, h: 104, title: "Frontend", sub: "React · TypeScript", tone: "sky" },
  { x: 318, y: 228, w: 200, h: 104, title: "API Gateway", sub: "NestJS · entrée unique", tone: "gold" },
  { x: 606, y: 58, w: 222, h: 78, title: "Auth", sub: "comptes · sessions" },
  { x: 606, y: 174, w: 222, h: 78, title: "Contenu & Vérification", sub: "fiches · médias · revue" },
  { x: 606, y: 290, w: 222, h: 78, title: "NFT", sub: "mint · provenance", tone: "holo" },
  { x: 606, y: 406, w: 222, h: 78, title: "LiDAR & 3D", sub: "actifs 3D · association" },
  { x: 940, y: 74, w: 230, h: 86, title: "PostgreSQL", sub: "Prisma · données par service" },
  { x: 940, y: 238, w: 230, h: 86, title: "Stockage S3", sub: "SeaweedFS · médias & 3D" },
  { x: 940, y: 402, w: 230, h: 86, title: "Blockchain", sub: "Avalanche Fuji · ERC‑721", tone: "holo" },
];

const EDGES = [
  "M230 280 H318",
  "M518 280 C562 280, 560 97, 606 97",
  "M518 280 C566 280, 560 213, 606 213",
  "M518 280 C566 280, 560 329, 606 329",
  "M518 280 C562 280, 560 445, 606 445",
  "M828 97 C884 97, 884 117, 940 117",
  "M828 205 C884 205, 884 117, 940 117",
  "M828 222 C884 222, 884 281, 940 281",
  "M828 452 C884 452, 884 281, 940 281",
  "M828 329 C884 329, 884 445, 940 445",
];

const FLOWS = ["M230 280 H318", "M518 280 C566 280, 560 329, 606 329", "M828 329 C884 329, 884 445, 940 445", "M828 222 C884 222, 884 281, 940 281"];

export function Architecture({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-arch">
      <div className="arch-head">
        <Eyebrow no={no} label="Plateforme · Architecture" />
        <Title lines={["Quatre services,"]} accent="une seule porte d’entrée." />
      </div>
      <figure className="arch glass" data-in="fade" data-at="0.6">
        <svg viewBox="20 40 1160 470" className="arch-svg" role="img" aria-label="Frontend vers API Gateway, puis services Auth, Contenu et Vérification, NFT, LiDAR et 3D ; données PostgreSQL, stockage S3 et blockchain Avalanche Fuji.">
          <defs>
            <linearGradient id="arch-holo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--holo-1)" /><stop offset="0.5" stopColor="var(--holo-3)" /><stop offset="1" stopColor="var(--holo-5)" />
            </linearGradient>
            <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10z" className="arch-arrowhead" data-nodraw />
            </marker>
          </defs>
          <g data-draw data-at="0.9" data-dur="2.2" data-sfx="blip">
            {EDGES.map(d => <path key={d} d={d} className="arch-edge" markerEnd="url(#arch-arrow)" />)}
            <path d="M828 318 Q850 318 850 296 V250 Q850 236 828 236" className="arch-edge arch-edge--ref" strokeDasharray="4 6" />
            <path d="M828 436 Q868 436 868 404 V200 Q868 186 828 186" className="arch-edge arch-edge--ref" strokeDasharray="4 6" />
            {NODES.map(n => (
              <g key={n.title} className={`arch-node ${n.tone ? `arch-node--${n.tone}` : ""}`}>
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={14} />
                <text x={n.x + 20} y={n.y + n.h / 2 - 4} className="arch-title">{n.title}</text>
                <text x={n.x + 20} y={n.y + n.h / 2 + 20} className="arch-sub">{n.sub}</text>
              </g>
            ))}
            <text x={880} y={180} className="arch-note">réf. contenu publié</text>
          </g>
          <g className="arch-flows" data-in="fade" data-at="3" data-nodraw>
            {FLOWS.map(d => <path key={d} d={d} className="arch-flow" />)}
          </g>
        </svg>
      </figure>
      <ul className="arch-facts">
        <li data-in="up" data-at="2.6"><b className="serif" data-count="4" data-at="2.6">4</b><span>services NestJS déployables indépendamment</span></li>
        <li data-in="up" data-at="2.72"><b className="serif" data-count="1" data-at="2.72">1</b><span>gateway : routage, validation en bordure, erreurs publiques</span></li>
        <li data-in="up" data-at="2.84"><b className="serif">∅</b><span>logique métier dans la gateway : chaque service garde ses données</span></li>
      </ul>
    </Stage>
  );
}

/* ───────────── Du clic au bloc ───────────── */

const MINT = [
  { title: "Publication", body: "Revue humaine terminée, droits validés" },
  { title: "Fiche figée", body: "Instantané approuvé, épinglé sur IPFS" },
  { title: "Empreinte", body: "sha256 du fichier maître" },
  { title: "Mint ERC‑721", body: "Wallet de la galerie, un job à la fois" },
  { title: "Confirmation", body: "Token, chaîne et transaction visibles" },
];

export function MintFlow({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="s-mint">
      <Eyebrow no={no} label="Plateforme · Parcours du mint" />
      <Title lines={["Du clic"]} accent="au bloc." />
      <div className={`mint-track ${instant ? "" : "is-live"}`}>
        <div className="mint-rail" aria-hidden="true"><i className="mint-rail-fill" data-bar="1" data-at="0.8" data-dur="2.2" /><i className="mint-packet" /></div>
        <ol className="mint-blocks">
          {MINT.map((m, i) => (
            <li key={m.title} className="mint-block glass glass--edge" style={{ ["--i" as string]: i }} data-in="up" data-at={0.9 + i * 0.32} data-sfx={i === MINT.length - 1 ? "chime" : "blip"}>
              <span className="mint-no mono">Bloc {String(i + 1).padStart(2, "0")}</span>
              <span className="mint-cube" aria-hidden="true"><i /><i /><i /></span>
              <strong>{m.title}</strong>
              <p>{m.body}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="mint-foot">
        <div className="mint-states" data-in="up" data-at="2.7">
          <span className="status status--warn"><Icon name="pause" size={16} />En attente</span>
          <span className="status status--ok"><Icon name="check" size={16} />Confirmé</span>
          <span className="status status--ko"><Icon name="x" size={16} />Échec récupérable</span>
        </div>
        <ul className="rules rules--inline" data-in="fade" data-at="2.9">
          <li><b>Pas de double mint</b> : l’unicité est garantie par le contrat</li>
          <li><b>Déclenché à la publication</b>, pas à la création de la fiche</li>
          <li><b>Aucune donnée privée</b> dans les métadonnées publiques</li>
        </ul>
      </div>
    </Stage>
  );
}
