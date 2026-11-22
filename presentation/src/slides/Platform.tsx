import { Caption, Headline, Kicker, Rule, Stage } from "../components/Primitives";
import type { SceneProps } from "../deck/types";

/* ───────────── Architecture ───────────── */

type Node = { x: number; y: number; w: number; h: number; title: string; sub: string; accent?: boolean };

const NODES: Node[] = [
  { x: 30, y: 228, w: 200, h: 104, title: "Frontend", sub: "React · TypeScript" },
  { x: 318, y: 228, w: 200, h: 104, title: "API Gateway", sub: "NestJS · entrée unique", accent: true },
  { x: 606, y: 58, w: 222, h: 78, title: "Auth", sub: "comptes · sessions" },
  { x: 606, y: 174, w: 222, h: 78, title: "Contenu & Vérification", sub: "fiches · médias · revue" },
  { x: 606, y: 290, w: 222, h: 78, title: "NFT", sub: "mint · provenance", accent: true },
  { x: 606, y: 406, w: 222, h: 78, title: "LiDAR & 3D", sub: "actifs 3D · association" },
  { x: 940, y: 74, w: 230, h: 86, title: "PostgreSQL", sub: "Prisma · données par service" },
  { x: 940, y: 238, w: 230, h: 86, title: "Stockage S3", sub: "SeaweedFS · médias & 3D" },
  { x: 940, y: 402, w: 230, h: 86, title: "Blockchain", sub: "Avalanche Fuji · ERC‑721", accent: true },
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

export function Architecture({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-arch">
      <div className="arch-head">
        <Kicker no={no}>La plateforme · Architecture</Kicker>
        <Headline size="m" lines={["Quatre services,"]} em="une seule porte d’entrée." />
      </div>
      <figure className="arch-figure">
        <svg viewBox="20 40 1160 470" className="arch-svg" role="img" aria-label="Frontend vers API Gateway, puis services Auth, Contenu et Vérification, NFT, LiDAR et 3D ; données PostgreSQL, stockage S3 et blockchain Avalanche Fuji.">
          <defs>
            <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10z" className="arch-arrowhead" />
            </marker>
          </defs>
          <g data-draw data-at="0.6" data-dur="2" data-sfx="blip">
            {EDGES.map(d => <path key={d} d={d} className="arch-edge" markerEnd="url(#arch-arrow)" />)}
            <path d="M828 318 Q850 318 850 296 V250 Q850 236 828 236" className="arch-edge arch-edge--ref" strokeDasharray="3 5" />
            <path d="M828 436 Q868 436 868 404 V200 Q868 186 828 186" className="arch-edge arch-edge--ref" strokeDasharray="3 5" />
            {NODES.map(n => (
              <g key={n.title} className={`arch-node ${n.accent ? "arch-node--accent" : ""}`}>
                <rect x={n.x} y={n.y} width={n.w} height={n.h} />
                <text x={n.x + 18} y={n.y + n.h / 2 - 4} className="arch-title">{n.title}</text>
                <text x={n.x + 18} y={n.y + n.h / 2 + 20} className="arch-sub">{n.sub}</text>
              </g>
            ))}
            <text x={880} y={180} className="arch-note">réf. contenu publié</text>
          </g>
        </svg>
        <Caption fig="Fig. 3" at={2.2}>Le frontend ne parle qu’à la gateway. Chaque service garde ses données et ses règles d’accès.</Caption>
      </figure>
      <ul className="facts">
        <li data-in="up" data-at="2.3"><b data-count="4" data-at="2.3">4</b><span>services NestJS, déployables indépendamment</span></li>
        <li data-in="up" data-at="2.42"><b data-count="1" data-at="2.42">1</b><span>gateway pour le routage, la validation et les erreurs publiques</span></li>
        <li data-in="up" data-at="2.54"><b>0</b><span>logique métier dans la gateway</span></li>
      </ul>
    </Stage>
  );
}

/* ───────────── Du clic au bloc ───────────── */

const MINT = [
  { title: "Publication", body: "Revue humaine terminée, droits validés." },
  { title: "Fiche figée", body: "Instantané approuvé, épinglé sur IPFS." },
  { title: "Empreinte", body: "sha256 du fichier maître." },
  { title: "Mint ERC‑721", body: "Wallet de la galerie, un seul job à la fois." },
  { title: "Confirmation", body: "Token, chaîne et transaction visibles." },
];

export function MintFlow({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-mint">
      <Kicker no={no}>La plateforme · Parcours du mint</Kicker>
      <Headline size="xl" face="grotesk" lines={["Du clic"]} em="au bloc." />
      <div className="timeline">
        <i className="timeline-line" data-bar="1" data-at="0.8" data-dur="1.6" aria-hidden="true" />
        <ol>
          {MINT.map((m, i) => (
            <li key={m.title} data-in="up" data-at={0.9 + i * 0.22} data-sfx={i === MINT.length - 1 ? "chime" : "tick"}>
              <span className="timeline-no">{String(i + 1).padStart(2, "0")}</span>
              <strong>{m.title}</strong>
              <p>{m.body}</p>
            </li>
          ))}
        </ol>
      </div>
      <Rule at={2} />
      <div className="mint-foot" data-in="fade" data-at="2.1">
        <p><b>Trois états visibles :</b> en attente, confirmé, échec récupérable.</p>
        <p><b>Pas de double mint :</b> l’unicité est garantie par le contrat.</p>
        <p><b>Déclenché à la publication,</b> jamais à la création de la fiche.</p>
      </div>
    </Stage>
  );
}
