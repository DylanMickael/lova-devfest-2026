import type { ReactNode } from "react";
import { useChoreo } from "../deck/choreo";

/** Conteneur d’une page : porte la chorégraphie GSAP. */
export function Stage({ instant, className = "", children }: { instant: boolean; className?: string; children: ReactNode }) {
  const ref = useChoreo(instant);
  return <div ref={ref} className={`stage ${className}`}>{children}</div>;
}

/** Surtitre de rubrique : « Le constat », « Édito »… */
export function Kicker({ children, at, no }: { children: ReactNode; at?: number; no?: string }) {
  return (
    <p className="kicker" data-in="fade" data-at={at ?? 0}>
      {no && <span className="kicker-no">{no}</span>}
      <span>{children}</span>
    </p>
  );
}

/** Titre de page. `em` est composé en italique, couleur d’accent. */
export function Headline({ lines, em, size = "l", face = "serif", at }: {
  lines: string[]; em?: string; size?: "xl" | "l" | "m"; face?: "serif" | "grotesk"; at?: number;
}) {
  return (
    <h1 id="slide-title" className={`headline headline--${size} headline--${face}`} data-split="lines" data-at={at}>
      {lines.map((line, i) => (
        <span key={i} className="headline-line">
          {line}
          {em && i === lines.length - 1 ? <>{line.endsWith("’") ? "" : " "}<em>{em}</em></> : null}
        </span>
      ))}
    </h1>
  );
}

/** Chapô : l’accroche en italique sous le titre. */
export function Standfirst({ children, at }: { children: ReactNode; at?: number }) {
  return <p className="standfirst" data-in="up" data-at={at}>{children}</p>;
}

/** Légende de figure. */
export function Caption({ fig, children, at }: { fig?: string; children: ReactNode; at?: number }) {
  return <p className="caption" data-in="fade" data-at={at}>{fig && <b>{fig} —</b>} {children}</p>;
}

/** Filet horizontal qui se trace. */
export function Rule({ at, strong = false }: { at?: number; strong?: boolean }) {
  return <i className={`rule ${strong ? "rule--strong" : ""}`} data-bar="1" data-at={at} aria-hidden="true" />;
}
