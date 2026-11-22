import { useSyncExternalStore } from "react";

/**
 * Thème de la planche : « galerie de jour » (ivoire) ou « galerie de nuit »
 * (encre et reflets holographiques). L’attribut `data-theme` sur <html> porte
 * l’état ; toutes les couleurs dérivent des jetons CSS, donc basculer le thème
 * ne re-rend aucune scène. La bascule est révélée par un cercle qui part du
 * bouton (View Transitions API), avec un fondu en repli.
 */

export type Theme = "light" | "dark";

const STORAGE_KEY = "lova-deck-theme";
const META_COLOR: Record<Theme, string> = { light: "#f0ece4", dark: "#07080b" };
const listeners = new Set<() => void>();

function read(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", META_COLOR[theme]);
  try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* stockage indisponible : thème non mémorisé */ }
  listeners.forEach(fn => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "dark");
}

type Origin = { x: number; y: number };

/** Bascule le thème ; `origin` est le centre du cercle de révélation (px écran). */
export function toggleTheme(origin?: Origin, reducedMotion = false) {
  const next: Theme = read() === "dark" ? "light" : "dark";
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

  if (reducedMotion || !doc.startViewTransition) {
    document.documentElement.classList.add("theme-fading");
    apply(next);
    window.setTimeout(() => document.documentElement.classList.remove("theme-fading"), 520);
    return;
  }

  const x = origin?.x ?? window.innerWidth - 48;
  const y = origin?.y ?? 40;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const transition = doc.startViewTransition(() => apply(next));
  void transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 950, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  }).catch(() => { /* transition interrompue : le thème est déjà appliqué */ });
}
