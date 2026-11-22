import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { isSoundOn, onSoundChange, setSound, unlockAudio, whoosh } from "./deck/sfx";
import { ISSUE } from "./deck/content";
import { slides } from "./slides";

const total = slides.length;
const pad = (n: number) => String(n).padStart(2, "0");
const ROMAN = ["", "I", "II", "III", "IV"];
const TONE_COLOR = { paper: "#f2ece1", sand: "#e3d3b8", ink: "#141210", wine: "#5a1c15" } as const;

/*
 * Tourne-page : la nouvelle page balaie l’ancienne dans le sens de lecture,
 * l’ancienne glisse légèrement dessous. Seuls clip-path et transform sont
 * animés : pas de flou ni de mélange, donc pas de saccade.
 */
type Turn = { dir: 1 | -1; instant: boolean };
const turnEase = [0.77, 0, 0.18, 1] as const;
const pageVariants: Variants = {
  enter: ({ dir, instant }: Turn) => instant
    ? { opacity: 1, zIndex: 2 }
    : { clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)", zIndex: 2 },
  center: ({ instant }: Turn) => ({ clipPath: "inset(0% 0% 0% 0%)", x: 0, opacity: 1, zIndex: 2, transition: { duration: instant ? 0 : 0.9, ease: turnEase } }),
  exit: ({ dir, instant }: Turn) => instant
    ? { opacity: 0, zIndex: 1, transition: { duration: 0 } }
    : { x: `${dir * -12}%`, zIndex: 1, transition: { duration: 0.9, ease: turnEase } },
};

function readHash() {
  const match = window.location.hash.match(/^#(\d+)$/);
  return Math.max(0, Math.min(total - 1, match ? Number(match[1]) - 1 : 0));
}

export default function App() {
  const [active, setActive] = useState(readHash);
  const [dir, setDir] = useState<1 | -1>(1);
  const [replay, setReplay] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sound, setSoundState] = useState(isSoundOn);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const contents = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const current = slides[active];
  const instant = reducedMotion || paused;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  useEffect(() => onSoundChange(setSoundState), []);
  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { capture: true });
    window.addEventListener("keydown", unlock, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", unlock, { capture: true });
      window.removeEventListener("keydown", unlock, { capture: true });
    };
  }, []);
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", TONE_COLOR[current.tone]);
  }, [current.tone]);

  const go = useCallback((next: number) => {
    const target = Math.max(0, Math.min(total - 1, next));
    if (target === active) return;
    const d = target > active ? 1 : -1;
    setDir(d);
    setActive(target);
    whoosh(d);
    window.history.replaceState(null, "", `#${target + 1}`);
  }, [active]);

  useEffect(() => {
    const onHash = () => go(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [go]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey || document.querySelector("dialog[open]")) return;
      const k = e.key.toLowerCase();
      if (k === "r") { setReplay(v => v + 1); return; }
      if (k === "m") { setSound(!isSoundOn()); return; }
      if (k === "f") { toggleFullscreen(); return; }
      if (k === "o") { contents.current?.showModal(); return; }
      const t = e.target;
      if (t instanceof HTMLElement && t.closest("a,button,input,textarea,select") && !["ArrowRight", "ArrowLeft", "Home", "End", "PageDown", "PageUp"].includes(e.key)) return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(active + 1); }
      else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(active - 1); }
      else if (e.key === "Home") { e.preventDefault(); go(0); }
      else if (e.key === "End") { e.preventDefault(); go(total - 1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go]);

  const turn: Turn = { dir, instant };
  const Scene = current.Scene;

  return (
    <main className={`deck ${instant ? "is-still" : ""} ${active === 0 ? "is-cover" : ""}`} data-tone={current.tone} aria-label={`${ISSUE.name} — numéro spécial ${ISSUE.event}`}
      onTouchStart={e => {
        const p = e.touches[0];
        touch.current = p && !(e.target instanceof HTMLElement && e.target.closest("dialog")) ? { x: p.clientX, y: p.clientY } : null;
      }}
      onTouchEnd={e => {
        if (!touch.current) return;
        const p = e.changedTouches[0];
        const dx = (p?.clientX ?? touch.current.x) - touch.current.x, dy = (p?.clientY ?? touch.current.y) - touch.current.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) go(active + (dx < 0 ? 1 : -1));
        touch.current = null;
      }}>
      <div className="pages">
        <AnimatePresence custom={turn} initial={false}>
          <motion.section key={`${active}-${replay}`} className="page" data-tone={current.tone} custom={turn} variants={pageVariants}
            initial="enter" animate="center" exit="exit" aria-labelledby="slide-title" aria-roledescription="page" aria-label={`Page ${active + 1} sur ${total}`}>
            <Scene instant={instant} no={pad(active + 1)} go={go} />
          </motion.section>
        </AnimatePresence>
      </div>

      <header className="runner">
        <a className="runner-mast" href="#1" onClick={e => { e.preventDefault(); go(0); }} aria-label="Retour à la une">{ISSUE.name}</a>
        <span className="runner-issue">{ISSUE.number} · Numéro spécial {ISSUE.event}</span>
        <span className="runner-date">{ISSUE.date}</span>
      </header>

      <footer className="folio">
        <div className="folio-page"><span>p.</span>{pad(active + 1)}</div>
        <div className="folio-chapter">
          <small>{current.part ? `Partie ${ROMAN[current.part]}` : ISSUE.hackathon}</small>
          <strong>{current.chapter}</strong>
        </div>
        <div className="folio-controls">
          <button type="button" className="folio-btn" onClick={() => contents.current?.showModal()} title="Sommaire (O)">Sommaire</button>
          <button type="button" className="folio-btn" onClick={() => setSound(!sound)} aria-pressed={sound} title="Bruitages (M)">{sound ? "Son" : "Muet"}</button>
          <button type="button" className="folio-btn folio-btn--hide-s" onClick={() => setPaused(!paused)} disabled={reducedMotion} aria-pressed={instant} title="Animations">{instant ? "Animer" : "Figer"}</button>
          <button type="button" className="folio-btn folio-btn--hide-s" onClick={() => setReplay(v => v + 1)} title="Rejouer la page (R)">Rejouer</button>
          <button type="button" className="folio-btn folio-btn--hide-s" onClick={toggleFullscreen} title="Plein écran (F)">Plein écran</button>
          <button type="button" className="folio-arrow" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Page précédente">←</button>
          <button type="button" className="folio-arrow" onClick={() => go(active + 1)} disabled={active === total - 1} aria-label="Page suivante">→</button>
        </div>
        <motion.i className="folio-progress" aria-hidden="true" initial={false} animate={{ scaleX: (active + 1) / total }} transition={{ duration: instant ? 0 : 0.9, ease: turnEase }} />
      </footer>

      <dialog className="index" ref={contents} aria-label="Sommaire" onKeyDown={e => e.stopPropagation()}
        onClick={e => { if (e.target === e.currentTarget) contents.current?.close(); }}>
        <header><strong>Sommaire</strong><span>{total} pages</span><button type="button" onClick={() => contents.current?.close()} aria-label="Fermer le sommaire">×</button></header>
        <ol>
          {slides.map((s, i) => (
            <li key={i} className={s.part && slides[i - 1]?.part !== s.part ? "is-part" : ""}>
              <button type="button" aria-current={active === i ? "page" : undefined} onClick={() => { go(i); contents.current?.close(); }}>
                <span className="index-chapter">{s.chapter}</span><span className="index-dots" aria-hidden="true" /><span className="index-page">{pad(i + 1)}</span>
              </button>
            </li>
          ))}
        </ol>
        <p><kbd>←</kbd> <kbd>→</kbd> tourner les pages · <kbd>O</kbd> sommaire · <kbd>R</kbd> rejouer · <kbd>M</kbd> son · <kbd>F</kbd> plein écran</p>
      </dialog>
    </main>
  );
}

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen().catch(() => {});
}
