import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Backdrop } from "./components/Backdrop";
import { ChainProgress } from "./components/ChainProgress";
import { GenArt } from "./components/GenArt";
import { isSoundOn, onSoundChange, setSound, sfx, unlockAudio, whoosh } from "./deck/sfx";
import { toggleTheme, useTheme } from "./deck/theme";
import { slides } from "./slides";

const total = slides.length;
const pad = (n: number) => String(n).padStart(2, "0");
const ROMAN = ["", "I", "II", "III", "IV"];
const chapters = slides.map(s => s.chapter);
const parts = slides.map(s => s.part);

/* Loi du vecteur : sortie et entrée sur le même axe, dans le même sens. */
type Motion = { dir: 1 | -1; up: boolean; instant: boolean };
const enterEase = [0.16, 1, 0.3, 1] as const;
const exitEase = [0.7, 0, 0.84, 0] as const;
const sceneVariants: Variants = {
  enter: ({ dir, up, instant }: Motion) => instant ? { opacity: 1 } : up
    ? { opacity: 0, y: dir * 120, scale: 0.97, filter: "blur(14px)" }
    : { opacity: 0, x: dir * 140, rotateY: dir * -8, scale: 0.98, filter: "blur(12px)" },
  center: ({ instant }: Motion) => ({
    opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: instant ? 0 : 0.85, ease: enterEase },
  }),
  exit: ({ dir, up, instant }: Motion) => instant ? { opacity: 0, transition: { duration: 0 } } : up
    ? { opacity: 0, y: dir * -90, scale: 1.02, filter: "blur(10px)", transition: { duration: 0.28, ease: exitEase } }
    : { opacity: 0, x: dir * -100, rotateY: dir * 6, filter: "blur(10px)", transition: { duration: 0.28, ease: exitEase } },
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
  const theme = useTheme();
  const contents = useRef<HTMLDialogElement>(null);
  const themeBtn = useRef<HTMLButtonElement>(null);
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

  const go = useCallback((next: number) => {
    const target = Math.max(0, Math.min(total - 1, next));
    if (target === active) return;
    const d = target > active ? 1 : -1;
    setDir(d);
    setActive(target);
    whoosh(d, slides[target].vector === "up" ? 1.3 : 1);
    window.history.replaceState(null, "", `#${target + 1}`);
  }, [active]);

  const switchTheme = useCallback((e?: MouseEvent) => {
    const r = themeBtn.current?.getBoundingClientRect();
    const origin = e && e.clientX ? { x: e.clientX, y: e.clientY } : r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined;
    sfx.toggle(document.documentElement.dataset.theme !== "dark");
    toggleTheme(origin, instant);
  }, [instant]);

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
      if (k === "t") { switchTheme(); return; }
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
  }, [active, go, switchTheme]);

  const custom: Motion = { dir, up: current.vector === "up" || (dir < 0 && slides[active + 1]?.vector === "up"), instant };
  const Scene = current.Scene;

  return (
    <main className={`deck part-${current.part} ${instant ? "is-still" : ""}`} aria-label="LOVA — présentation DevFest 2026"
      onTouchStart={e => {
        const p = e.touches[0];
        touch.current = p && !(e.target instanceof HTMLElement && e.target.closest("dialog,.token-card")) ? { x: p.clientX, y: p.clientY } : null;
      }}
      onTouchEnd={e => {
        if (!touch.current) return;
        const p = e.changedTouches[0];
        const dx = (p?.clientX ?? touch.current.x) - touch.current.x, dy = (p?.clientY ?? touch.current.y) - touch.current.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) go(active + (dx < 0 ? 1 : -1));
        touch.current = null;
      }}>
      <Backdrop part={current.part} />

      <header className="topbar">
        <a className="brand" href="#1" onClick={e => { e.preventDefault(); go(0); }} aria-label="Retour à la couverture">
          <span className="brand-mark" aria-hidden="true"><i /></span>
          <span className="brand-name">LOVA</span>
          <span className="brand-sep" aria-hidden="true">/</span>
          <span className="brand-event">DevFest 2026 <em>· Preserving the Art</em></span>
        </a>
        <div className="topbar-right">
          <span className="pill pill--net mono" title="Les références de token affichées sont des exemples"><i aria-hidden="true" />Testnet · Fuji</span>
          <button ref={themeBtn} type="button" className={`theme-switch is-${theme}`} onClick={switchTheme} role="switch" aria-checked={theme === "dark"}
            aria-label={theme === "dark" ? "Passer en galerie de jour (T)" : "Passer en galerie de nuit (T)"} title="Jour / nuit (T)">
            <span className="theme-switch-track" aria-hidden="true">
              <span className="theme-switch-knob">
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <mask id="moon-cut"><rect width="24" height="24" fill="#fff" /><circle className="moon-cut" cx="17" cy="7" r="6" fill="#000" /></mask>
                  <circle className="sun-core" cx="12" cy="12" r="5" fill="currentColor" mask="url(#moon-cut)" />
                  <g className="sun-rays" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(a => <line key={a} x1="12" y1="2.6" x2="12" y2="4.4" transform={`rotate(${a} 12 12)`} />)}
                  </g>
                </svg>
              </span>
            </span>
            <span className="theme-switch-label">{theme === "dark" ? "Nuit" : "Jour"}</span>
          </button>
        </div>
      </header>

      <div className="viewport">
        <AnimatePresence mode="wait" custom={custom} initial={false}>
          <motion.section key={`${active}-${replay}`} className="slide" custom={custom} variants={sceneVariants} initial="enter" animate="center" exit="exit"
            aria-labelledby="slide-title" aria-roledescription="diapositive" aria-label={`${active + 1} sur ${total}`}>
            <Scene instant={instant} no={pad(active + 1)} />
          </motion.section>
        </AnimatePresence>
      </div>

      <footer className="dock">
        <div className="dock-block mono"><small>Bloc</small><strong>#{pad(active + 1)}<span>/{pad(total)}</span></strong></div>
        <div className="dock-chapter"><small className="mono">{current.part ? `Partie ${ROMAN[current.part]}` : "DevFest 2026"}</small><strong>{current.chapter}</strong></div>
        <ChainProgress total={total} active={active} chapters={chapters} parts={parts} onSelect={go} instant={instant} />
        <div className="dock-controls">
          <button type="button" className="dock-btn" onClick={() => contents.current?.showModal()} title="Sommaire (O)">Sommaire</button>
          <button type="button" className={`dock-btn dock-icon ${sound ? "" : "is-off"}`} onClick={() => setSound(!sound)} aria-pressed={sound}
            aria-label={sound ? "Couper les bruitages (M)" : "Activer les bruitages (M)"} title="Bruitages (M)"><SoundIcon on={sound} /></button>
          <button type="button" className="dock-btn dock-icon" onClick={() => setPaused(!paused)} disabled={reducedMotion} aria-pressed={instant}
            aria-label={paused ? "Activer les animations" : "Figer les animations"} title="Animations">{instant ? "▶" : "❚❚"}</button>
          <button type="button" className="dock-btn dock-icon" onClick={() => setReplay(v => v + 1)} aria-label="Rejouer la diapositive (R)" title="Rejouer (R)">↻</button>
          <button type="button" className="dock-btn dock-icon" onClick={toggleFullscreen} aria-label="Plein écran (F)" title="Plein écran (F)">⤢</button>
          <button type="button" className="dock-btn dock-arrow" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Diapositive précédente">←</button>
          <button type="button" className="dock-btn dock-arrow dock-arrow--next" onClick={() => go(active + 1)} disabled={active === total - 1} aria-label="Diapositive suivante">→</button>
        </div>
      </footer>

      <dialog className="contents" ref={contents} aria-label="Sommaire" onKeyDown={e => e.stopPropagation()}
        onClick={e => { if (e.target === e.currentTarget) contents.current?.close(); }}>
        <div className="contents-head">
          <strong>Sommaire · <span className="mono">{total} blocs</span></strong>
          <button type="button" onClick={() => contents.current?.close()} aria-label="Fermer le sommaire">×</button>
        </div>
        <div className="contents-grid">
          {slides.map((s, i) => (
            <button key={i} type="button" aria-current={active === i ? "step" : undefined} className={s.vector === "up" ? "is-part" : ""}
              onClick={() => { go(i); contents.current?.close(); }}>
              <span className="contents-thumb"><GenArt seed={`toc-${i}`} /></span>
              <span className="mono">#{pad(i + 1)}</span>
              <span>{s.chapter}</span>
            </button>
          ))}
        </div>
        <p className="contents-keys"><kbd>←</kbd><kbd>→</kbd> naviguer · <kbd>T</kbd> jour/nuit · <kbd>O</kbd> sommaire · <kbd>R</kbd> rejouer · <kbd>M</kbd> son · <kbd>F</kbd> plein écran</p>
      </dialog>
    </main>
  );
}

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen().catch(() => {});
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" />
      {on ? <><path d="M15.5 9a4.2 4.2 0 0 1 0 6" /><path d="M18 6.6a7.6 7.6 0 0 1 0 10.8" /></> : <path d="m16 9.5 5 5m0-5-5 5" />}
    </svg>
  );
}
