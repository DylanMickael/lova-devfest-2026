import { Artifact } from "../components/Artifact";
import { GenArt } from "../components/GenArt";
import { Caption, Headline, Kicker, Rule, Stage, Standfirst } from "../components/Primitives";
import { Barcode } from "../components/Print";
import { ISSUE, PAGE } from "../deck/content";
import type { SceneProps } from "../deck/types";

/* ───────────── 01 · Une ───────────── */

const COVER_LINES = [
  { page: PAGE.handoff, rubric: "Reportage", title: "Du bureau à l’iPhone : scanner une sculpture" },
  { page: PAGE.myths, rubric: "Enquête", title: "Ce qu’un NFT prouve vraiment, et ce qu’il ne prouve pas" },
  { page: PAGE.team, rubric: "Portrait", title: "Cinq bâtisseurs, une plateforme" },
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
      <div className="cover-photo" data-in="up" data-at="0.6" data-dur="1.4"><Artifact reduced={instant} /></div>

      <div className="cover-main">
        <p className="cover-rubric" data-in="fade" data-at="0.9">Dossier</p>
        <p className="cover-lead" data-split="lines" data-at="1">Le patrimoine malagasy entre au <em>musée numérique.</em></p>
        <p className="cover-sub" data-in="up" data-at="1.3">On le visite, on y contribue, et chaque œuvre acceptée garde la trace de sa provenance.</p>
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

/* ───────────── 02 · Édito ───────────── */

export function Editorial({ instant, no }: SceneProps) {
  return (
    <Stage instant={instant} className="p-edito">
      <Kicker no={no}>Édito</Kicker>
      <Headline size="xl" lines={["Une œuvre a une matière,", "un volume,"]} em="une histoire." />
      <Rule at={0.9} strong />
      <div className="edito-body">
        <Standfirst at={1}>
          LOVA signifie « héritage » en malagasy. C’est un musée numérique et participatif, dédié au patrimoine
          culturel de Madagascar.
        </Standfirst>
        <div className="columns columns--2" data-in="up" data-at="1.15">
          <p className="dropcap">
            Peintures, sculptures, objets : on y découvre les œuvres, leurs créateurs et les techniques
            traditionnelles. On y contribue aussi, en documentant et en numérisant la collection. Quand la visite en
            personne est difficile, une galerie numérique montre une sculpture sous plusieurs angles et rend son
            histoire accessible à beaucoup plus de monde.
          </p>
          <p>
            La revue des contributions et la traçabilité numérique aident chacun à comprendre d’où vient chaque pièce.
            Notre but est simple : rendre le patrimoine malagasy plus accessible, plus interactif et plus facile à
            transmettre, en reliant les œuvres, leurs histoires et les personnes qui les préservent.
          </p>
          <p className="signature">— La rédaction, équipe LOVA</p>
        </div>
      </div>
    </Stage>
  );
}

/* ───────────── 03 · Sommaire ───────────── */

const CONTENTS = [
  { page: PAGE.constat, part: "I", title: "Le constat", text: "Des œuvres hors de portée, et notre réponse." },
  { page: PAGE.experience + 1, part: "II", title: "L’expérience", text: "Visiter le musée, contribuer, numériser une sculpture." },
  { page: PAGE.confiance + 1, part: "III", title: "La confiance", text: "La revue humaine, le NFT de provenance, les idées reçues." },
  { page: PAGE.plateforme + 1, part: "IV", title: "La plateforme", text: "Architecture, parcours du mint, équipe, démonstration." },
];

export function Contents({ instant, go }: SceneProps) {
  return (
    <Stage instant={instant} className="p-contents">
      <div className="contents-head">
        <Kicker>Sommaire</Kicker>
        <Headline size="xl" lines={["Dans ce"]} em="numéro" />
      </div>
      <ol className="contents-list">
        {CONTENTS.map((c, i) => (
          <li key={c.part} data-in="up" data-at={0.7 + i * 0.12}>
            <button type="button" onClick={() => go(c.page - 1)}>
              <span className="contents-page">{String(c.page).padStart(2, "0")}</span>
              <span className="contents-part">Partie {c.part}</span>
              <span className="contents-title">{c.title}</span>
              <span className="contents-text">{c.text}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="contents-end" data-in="fade" data-at="1.4">
        <button type="button" onClick={() => go(PAGE.thanks - 1)}>{String(PAGE.thanks).padStart(2, "0")} — Misaotra</button>
      </p>
    </Stage>
  );
}

/* ───────────── Ouvertures de partie ───────────── */

type OpenerDef = { roman: string; title: string; em: string; intro: string; chapters: [number, string][]; seed: string; flip?: boolean };

export function Opener({ roman, title, em, intro, chapters, seed, flip = false }: OpenerDef) {
  return function OpenerScene({ instant, no, go }: SceneProps) {
    return (
      <Stage instant={instant} className={`p-opener ${flip ? "p-opener--flip" : ""}`}>
        <div className="opener-plate" data-in="clip" data-at="0.1" data-dur="1.3">
          <GenArt seed={seed} variant="portrait" />
        </div>
        <div className="opener-text">
          <span className="opener-roman" data-in="up" data-at="0.2" aria-hidden="true">{roman}</span>
          <Kicker at={0.4} no={no}>Partie {roman}</Kicker>
          <Headline size="xl" lines={[title]} em={em} at={0.5} />
          <Standfirst at={0.9}>{intro}</Standfirst>
          <ol className="opener-chapters">
            {chapters.map(([page, label], i) => (
              <li key={page} data-in="up" data-at={1.1 + i * 0.08}>
                <button type="button" onClick={() => go(page - 1)}><span>p. {String(page).padStart(2, "0")}</span>{label}</button>
              </li>
            ))}
          </ol>
        </div>
        <Caption fig="Planche" at={1.4}>Motif tissé génératif, tiré d’une graine.</Caption>
      </Stage>
    );
  };
}
