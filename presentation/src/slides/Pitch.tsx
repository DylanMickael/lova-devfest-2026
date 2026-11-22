import { Artifact } from "../components/Artifact";
import { GenArt } from "../components/GenArt";
import { Barcode, Certificate } from "../components/Print";
import { TOOL_LOGOS, type ToolLogo } from "../components/toolLogos";
import { Caption, Headline, Kicker, Rule, Stage, Standfirst } from "../components/Primitives";
import { ISSUE, TEAM } from "../deck/content";
import type { SceneProps } from "../deck/types";
import { credit, WORKS, type Work } from "../deck/works";

/* Pages du pitch (numérotation à partir de 1) — à tenir alignées avec slides/index.ts. */
export const PITCH_PAGE = { how: 5, tools: 6, architecture: 7, business: 8, thanks: 9 } as const;

function Plate({ work, className, at = 0.2 }: { work: Work; className: string; at?: number }) {
  return (
    <figure className={className} data-in="clip" data-at={at} data-dur="1.4">
      <img src={work.src} alt={work.alt} />
      <figcaption>{credit(work)}</figcaption>
    </figure>
  );
}

/* ───────────── 1 · L’art est mort ? ───────────── */

export function Hook({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-hook">
      <div className="hook-text">
        <Kicker no={no}>{ISSUE.hackathon}</Kicker>
        <h1 id="slide-title" className="hook-title" data-split="lines" data-at="0.3">
          <span className="headline-line">L’art</span>
          <span className="headline-line">est mort.</span>
        </h1>
        <p className="hook-turn" data-in="up" data-at="1.5"><em>Ou pas ?</em></p>
        <Standfirst at={1.9}>Sur les tombeaux du Sud, les aloalo racontent encore des vies entières. L’art malgache n’a pas disparu : il attend qu’on le regarde.</Standfirst>
      </div>
      <Plate work={WORKS.aloalo} className="hook-plate" />
    </Stage>
  );
}

/* ───────────── 2 · Le contexte ───────────── */

export function Context({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-context">
      <div className="context-text">
        <Kicker no={no}>Le contexte</Kicker>
        <p className="context-number" aria-label="Plus de 480 000">
          <b data-count="480000" data-at="0.3" data-dur="1.8">480 000</b><span>+</span>
        </p>
        <Headline size="l" lines={["artisans et artistes"]} em="vivent de leur passion." at={0.9} />
        <Standfirst at={1.4}>Vannerie, soie sauvage, sculpture, peinture, musique : à Madagascar, le patrimoine se fabrique encore à la main, chaque jour.</Standfirst>
      </div>
      <Plate work={WORKS.sakalava} className="context-plate" at={0.5} />
    </Stage>
  );
}

/* ───────────── 3 · La problématique ───────────── */

const PAINS = [
  { title: "Loin du public", body: "Les œuvres dorment dans des réserves, des villages et des collections privées." },
  { title: "Sans histoire", body: "Le nom de l’artisan, la technique et l’origine se perdent avec le temps." },
  { title: "Sans trace", body: "Rien ne prouve d’où vient une œuvre, ni qui l’a documentée." },
];

const ROYALS: readonly Work[] = [WORKS.ranavalona1, WORKS.radama2, WORKS.ranavalona2];

export function Question({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-question">
      <Kicker no={no}>La problématique</Kicker>
      <div className="question-top">
        <h1 id="slide-title" className="headline headline--l headline--serif question-title" data-split="lines" data-at="0.3">
          Comment <em>le numérique</em> pourrait-il contribuer à la présentation de l’art malgache&nbsp;?
        </h1>
        <figure className="question-portraits" data-in="up" data-at="0.8">
          <div>
            {ROYALS.map(work => <img key={work.title} src={work.src} alt={work.alt} />)}
          </div>
          <figcaption>
            {ROYALS.map(work => work.title).join(", ")} — portraits de Philippe-Auguste Ramanankirahina, photographies vers 1905. Domaine public, Wikimedia Commons.
          </figcaption>
        </figure>
      </div>
      <Rule at={1.3} />
      <ol className="pains">
        {PAINS.map((p, i) => (
          <li key={p.title} data-in="up" data-at={1.4 + i * 0.12}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <strong>{p.title}</strong>
            <p>{p.body}</p>
          </li>
        ))}
      </ol>
    </Stage>
  );
}

/* ───────────── 4 · LOVA, la couverture ───────────── */

const COVER_WORKS: readonly Work[] = [WORKS.andrianampoinimerina, WORKS.radama1];
const COVER_LINES = [
  { rubric: "Comment ça marche", title: "IA, réalité augmentée et blockchain", page: PITCH_PAGE.how },
  { rubric: "Architecture", title: "Un serveur, un seul diagramme", page: PITCH_PAGE.architecture },
  { rubric: "Business plan", title: "Un modèle qui fait vivre la culture", page: PITCH_PAGE.business },
];

export function Cover({ instant, go }: SceneProps) {
  return (
    <Stage instant={instant} className="p-cover">
      <div className="cover-top" data-in="fade" data-at="0">
        <span>{ISSUE.number} · {ISSUE.date}</span>
        <span>Numéro spécial {ISSUE.event}</span>
        <span>{ISSUE.hackathon}</span>
      </div>
      <h1 id="slide-title" className="masthead" data-split="chars" data-at="0.1" aria-label="LOVA">LOVA</h1>
      <div className="cover-photo cover-works" data-in="up" data-at="0.6" data-dur="1.4">
        {COVER_WORKS.map((work, i) => (
          <figure key={work.title} className={`cover-work cover-work--${i + 1}`}>
            <div className="cover-frame"><img src={work.src} alt={work.alt} /></div>
            <figcaption>
              <span className="cover-work-no">{String(i + 1).padStart(2, "0")}</span>
              <b>{work.title}</b>
              <span>{work.artist}, {work.date}. Domaine public, Wikimedia Commons.</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="cover-main">
        <p className="cover-rubric" data-in="fade" data-at="0.9">Le musée en ligne</p>
        <p className="cover-lead" data-split="lines" data-at="1">Qui retrace l’héritage de <em>l’art malgache.</em></p>
        <p className="cover-sub" data-in="up" data-at="1.3">On le visite en 3D, on y contribue, et chaque œuvre acceptée garde la trace de sa provenance.</p>
      </div>

      <ul className="cover-lines">
        {COVER_LINES.map((l, i) => (
          <li key={l.page} data-in="up" data-at={1.5 + i * 0.1}>
            <button type="button" onClick={() => go(l.page - 1)}>
              <span className="cover-lines-rubric">{l.rubric}</span>
              <span className="cover-lines-title">{l.title}</span>
              <span className="cover-lines-page">p. {String(l.page).padStart(2, "0")}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="cover-foot" data-in="fade" data-at="1.9">
        <p><b>lova</b> /ˈlu.va/ — {ISSUE.meaning}</p>
        <Barcode seed="lova-n01" label="DEVFEST · 2026 · N°01" />
      </div>
    </Stage>
  );
}

/* ───────────── 5 · Comment ça marche ───────────── */

export function How({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-how">
      <div className="how-head">
        <Kicker no={no}>Comment ça marche</Kicker>
        <Headline size="m" lines={["Trois technologies,"]} em="un seul musée." />
      </div>
      <div className="pillars">
        <section className="pillar" data-in="up" data-at="0.7">
          <div className="pillar-visual pillar-visual--ai">
            <img src={WORKS.sakalava.src} alt="" />
            <span className="pillar-arrow" aria-hidden="true">→</span>
            <div className="pillar-scan"><Artifact reduced={instant} mode="scan" /></div>
          </div>
          <span className="pillar-no">01</span>
          <h2>Intelligence artificielle</h2>
          <ul>
            <li>Une photo devient un modèle 3D texturé (Meshy, image → 3D).</li>
            <li>Des signaux d’aide à la revue : l’IA signale, l’humain décide.</li>
          </ul>
        </section>
        <section className="pillar" data-in="up" data-at="0.85">
          <div className="pillar-visual pillar-visual--ar">
            <div className="phone"><div className="phone-screen"><Artifact reduced={instant} /><span className="phone-rec">AR</span></div></div>
          </div>
          <span className="pillar-no">02</span>
          <h2>Réalité augmentée</h2>
          <ul>
            <li>Une exposition 3D qu’on traverse en profondeur.</li>
            <li>L’objet posé chez soi, à l’échelle (WebXR, Quick Look).</li>
            <li>Le scan LiDAR d’une sculpture depuis un iPhone.</li>
          </ul>
        </section>
        <section className="pillar" data-in="up" data-at="1">
          <div className="pillar-visual pillar-visual--chain"><Certificate seed="pitch-provenance" lot={7} /></div>
          <span className="pillar-no">03</span>
          <h2>Blockchain</h2>
          <ul>
            <li>Un certificat de provenance ERC‑721 sur Avalanche.</li>
            <li>L’empreinte sha256 du fichier maître, la fiche figée sur IPFS.</li>
            <li>Pas de vente, pas de spéculation : une trace.</li>
          </ul>
        </section>
      </div>
    </Stage>
  );
}

/* ───────────── 6 · Les outils ───────────── */

const TOOLS: { name: string; logo: ToolLogo; role: string; body: string }[] = [
  { name: "Next.js", logo: "nextdotjs", role: "Interface web", body: "Pages, routes et rendu de l’interface." },
  { name: "Three.js", logo: "threedotjs", role: "3D temps réel", body: "Galerie, exposition en profondeur, visionneuse." },
  { name: "NestJS", logo: "nestjs", role: "Microservices", body: "Gateway, Auth, Contenu, NFT et 3D." },
  { name: "Solidity", logo: "solidity", role: "Contrat intelligent", body: "ERC‑721 de provenance sur Avalanche." },
  { name: "Docker", logo: "docker", role: "Déploiement", body: "Un conteneur par service, une commande." },
];

export function Tools({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-tools">
      <Kicker no={no}>Les outils</Kicker>
      <Headline size="l" lines={["Cinq outils,"]} em="une plateforme." />
      <ol className="tools">
        {TOOLS.map((t, i) => (
          <li key={t.name} data-in="up" data-at={0.8 + i * 0.1}>
            <span className="tools-no">{String(i + 1).padStart(2, "0")}</span>
            <svg className="tools-logo" viewBox="0 0 24 24" aria-hidden="true"><path d={TOOL_LOGOS[t.logo]} /></svg>
            <strong>{t.name}</strong>
            <span className="tools-role">{t.role}</span>
            <p>{t.body}</p>
          </li>
        ))}
      </ol>
    </Stage>
  );
}

/* ───────────── 7 · Architecture ───────────── */

type Box = { x: number; y: number; w: number; h: number; title: string; sub: string; accent?: boolean };

const BOXES: Box[] = [
  { x: 20, y: 150, w: 180, h: 70, title: "Visiteurs", sub: "navigateur web" },
  { x: 20, y: 300, w: 180, h: 70, title: "iPhone", sub: "LiDAR · réalité augmentée" },
  { x: 280, y: 222, w: 160, h: 76, title: "Caddy", sub: "HTTPS · proxy" },
  { x: 480, y: 96, w: 176, h: 64, title: "Frontend", sub: "Next.js · Three.js" },
  { x: 480, y: 222, w: 176, h: 76, title: "API Gateway", sub: "NestJS · entrée unique", accent: true },
  { x: 700, y: 72, w: 170, h: 52, title: "Auth", sub: "comptes · sessions" },
  { x: 700, y: 140, w: 170, h: 52, title: "Contenu", sub: "fiches · revue" },
  { x: 700, y: 208, w: 170, h: 52, title: "NFT", sub: "mint · provenance" },
  { x: 700, y: 276, w: 170, h: 52, title: "LiDAR & 3D", sub: "scans · génération" },
  { x: 480, y: 372, w: 176, h: 60, title: "PostgreSQL", sub: "une base par service" },
  { x: 700, y: 372, w: 170, h: 60, title: "SeaweedFS", sub: "S3 · médias & 3D" },
  { x: 960, y: 84, w: 220, h: 64, title: "Meshy AI", sub: "photo → modèle 3D", accent: true },
  { x: 960, y: 210, w: 220, h: 64, title: "Avalanche", sub: "ERC‑721 · Solidity", accent: true },
  { x: 960, y: 290, w: 220, h: 64, title: "IPFS", sub: "Pinata · métadonnées" },
  { x: 20, y: 520, w: 180, h: 60, title: "GitHub", sub: "code · revues" },
  { x: 260, y: 520, w: 220, h: 60, title: "GitHub Actions", sub: "lint · tests · build" },
  { x: 540, y: 520, w: 200, h: 60, title: "Images Docker", sub: "une par service" },
];

const LINKS = [
  "M200 185 C240 185, 240 250, 280 250",
  "M200 335 C240 335, 240 270, 280 270",
  "M440 250 C460 250, 460 128, 480 128",
  "M440 260 H480",
  "M656 260 C678 260, 678 98, 700 98",
  "M656 260 C678 260, 678 166, 700 166",
  "M656 260 H700",
  "M656 260 C678 260, 678 302, 700 302",
  "M785 328 V372",
  "M700 296 C640 330, 600 340, 568 372",
  "M870 302 C915 302, 915 116, 960 116",
  "M870 234 C915 234, 915 242, 960 242",
  "M870 234 C915 234, 915 322, 960 322",
  "M200 550 H260",
  "M480 550 H540",
  "M640 520 V470",
];

export function Architecture({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-arch">
      <div className="arch-head">
        <Kicker no={no}>Architecture</Kicker>
        <Headline size="m" lines={["Un serveur,"]} em="un seul diagramme." />
      </div>
      <figure className="arch-figure">
        <svg viewBox="10 20 1180 570" className="arch-svg arch-svg--pitch" role="img"
          aria-label="Visiteurs et iPhone passent par Caddy sur le serveur OVH, vers le frontend et l’API Gateway NestJS, puis les services Auth, Contenu, NFT et LiDAR & 3D, avec PostgreSQL et SeaweedFS. Le service 3D appelle Meshy AI, le service NFT écrit sur Avalanche et IPFS. GitHub Actions construit les images Docker déployées sur le serveur.">
          <defs>
            <marker id="pitch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10z" className="arch-arrowhead" />
            </marker>
          </defs>
          <g data-draw data-at="0.6" data-dur="2.2" data-sfx="blip">
            <rect x="256" y="40" width="640" height="430" className="arch-zone" strokeDasharray="6 6" />
            <rect x="940" y="40" width="250" height="330" className="arch-zone" strokeDasharray="6 6" />
            <rect x="10" y="500" width="750" height="96" className="arch-zone" strokeDasharray="6 6" />
            {LINKS.map(d => <path key={d} d={d} className="arch-edge" markerEnd="url(#pitch-arrow)" />)}
            {BOXES.map(n => (
              <g key={n.title} className={`arch-node ${n.accent ? "arch-node--accent" : ""}`}>
                <rect x={n.x} y={n.y} width={n.w} height={n.h} />
                <text x={n.x + 14} y={n.y + n.h / 2 - 3} className="arch-title">{n.title}</text>
                <text x={n.x + 14} y={n.y + n.h / 2 + 17} className="arch-sub">{n.sub}</text>
              </g>
            ))}
            <text x="270" y="62" className="arch-zone-label">Serveur OVH · Docker Compose</text>
            <text x="954" y="62" className="arch-zone-label">IA & blockchain</text>
            <text x="24" y="514" className="arch-zone-label">CI/CD</text>
            <text x="652" y="492" className="arch-note">déploiement</text>
          </g>
        </svg>
        <Caption fig="Fig. 1" at={2.6}>Le navigateur ne parle qu’à la gateway. Chaque service NestJS garde ses données ; l’IA et la blockchain restent derrière les services qui en ont la charge.</Caption>
      </figure>
    </Stage>
  );
}

/* ───────────── 8 · Business plan ───────────── */

const STREAMS = [
  { name: "Abonnement institutions", price: "300 000 Ar / mois", who: "Musées, galeries, centres culturels" },
  { name: "Billetterie des expositions", price: "8 % par billet", who: "Visites sur place" },
  { name: "Certificat de provenance", price: "15 000 Ar / œuvre", who: "Galeries, artisans, collectionneurs" },
  { name: "Atelier 3D (photo → 3D)", price: "10 000 Ar / modèle", who: "Artisans, boutiques" },
  { name: "Mécénat et subventions", price: "Sur projet", who: "Fondations, coopération culturelle" },
];

/* Projection en millions d’ariary, par source : abonnements, billetterie, certificats, atelier 3D. */
const YEARS = [
  { year: "An 1", scope: "Pilote à Antananarivo · 3 institutions · 300 artisans", parts: [10.8, 1.6, 7.5, 10] },
  { year: "An 2", scope: "Six régions · 12 institutions · 2 000 artisans", parts: [43.2, 16, 45, 60] },
  { year: "An 3", scope: "Océan Indien et diaspora · 30 institutions · 6 000 artisans", parts: [108, 48, 150, 200] },
];
const MAX_TOTAL = 506;
const PART_NAMES = ["Abonnements", "Billetterie", "Certificats", "Atelier 3D"];
const fmt = (v: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(v).replace(/ /g, " ");

export function Business({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-biz">
      <div className="biz-head">
        <Kicker no={no}>Business plan</Kicker>
        <Headline size="m" lines={["Un modèle"]} em="qui fait vivre la culture." />
        <Standfirst at={0.8}>Gratuit pour les visiteurs, gratuit pour exposer. Ce sont les institutions et les services à valeur ajoutée qui financent le musée.</Standfirst>
      </div>
      <div className="biz-body">
        <table className="streams" data-in="up" data-at="1">
          <caption>Sources de revenus</caption>
          <tbody>
            {STREAMS.map(s => (
              <tr key={s.name}><th>{s.name}</th><td className="streams-price">{s.price}</td><td>{s.who}</td></tr>
            ))}
          </tbody>
        </table>
        <figure className="projection" data-in="up" data-at="1.2">
          <figcaption>Projection du chiffre d’affaires, en millions d’ariary</figcaption>
          <ol>
            {YEARS.map((y, i) => {
              const total = y.parts.reduce((a, b) => a + b, 0);
              return (
                <li key={y.year}>
                  <span className="projection-year">{y.year}</span>
                  <span className="projection-bar" data-bar={total / MAX_TOTAL} data-at={1.4 + i * 0.15}>
                    {y.parts.map((p, k) => <i key={k} className={`projection-part projection-part--${k}`} style={{ flexGrow: p }} />)}
                  </span>
                  <span className="projection-total">{fmt(total)} M Ar</span>
                  <span className="projection-scope">{y.scope}</span>
                </li>
              );
            })}
          </ol>
          <ul className="projection-legend">
            {PART_NAMES.map((n, k) => <li key={n}><i className={`projection-part projection-part--${k}`} />{n}</li>)}
          </ul>
        </figure>
      </div>
      <p className="biz-note" data-in="fade" data-at="2">
        <b>Hypothèses de travail.</b> Billet moyen 10 000 Ar, 1 € ≈ 5 000 Ar, montants hors taxes. Charges de l’an 2 ≈ 180 M Ar (équipe de cinq, serveur, crédits IA) : seuil de rentabilité visé fin de l’an 2. Chiffres à valider avec les premiers partenaires.
      </p>
    </Stage>
  );
}

/* ───────────── 9 · Merci et l’équipe ───────────── */

export function Thanks({ instant }: SceneProps) {
  return (
    <Stage instant={instant} className="p-back p-thanks">
      <div className="back-plate" data-in="clip" data-at="0" data-dur="1.4"><GenArt seed="back-cover-weave" /></div>
      <div className="back-text">
        <h1 id="slide-title" className="back-title" data-split="chars" data-at="0.3">Misaotra.</h1>
        <p className="back-sub" data-in="fade" data-at="1">Merci · Thank you</p>
        <p className="team-label" data-in="fade" data-at="1.1">L’équipe {ISSUE.name}</p>
        <dl className="team-list">
          {TEAM.map((m, i) => (
            <div key={m.name} data-in="up" data-at={1.2 + i * 0.1}>
              <dt>{m.name}</dt>
              <dd>{m.role}</dd>
            </div>
          ))}
        </dl>
        <p className="thanks-credits" data-in="fade" data-at="1.9">
          Œuvres reproduites : portraits royaux de Philippe-Auguste Ramanankirahina, aloalo mahafaly (photo Marie-Lan Nguyen) et couple sakalava (Metropolitan Museum of Art), domaine public ou CC0, via Wikimedia Commons.
        </p>
        <div className="back-foot" data-in="fade" data-at="2">
          <span>{ISSUE.name} · {ISSUE.event} · {ISSUE.hackathon}</span>
          <Barcode seed="lova-back" label="PRESERVING · THE · ART" />
        </div>
      </div>
    </Stage>
  );
}
