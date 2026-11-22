import type { ReactNode } from "react";
import { useChoreo } from "../deck/choreo";

export type Tone = "gold" | "wine" | "holo" | "jade" | "sky" | "muted";

/** Conteneur d’une scène : porte la chorégraphie GSAP. */
export function Stage({ instant, className = "", children }: { instant: boolean; className?: string; children: ReactNode }) {
  const ref = useChoreo(instant);
  return <div ref={ref} className={`stage ${className}`}>{children}</div>;
}

export function Eyebrow({ no, label, at }: { no: string; label: string; at?: number }) {
  return (
    <p className="eyebrow" data-in="fade" data-at={at ?? 0}>
      <span className="eyebrow-no mono">{no}</span>
      <span className="eyebrow-rule" aria-hidden="true" />
      <span>{label}</span>
    </p>
  );
}

/** Titre de scène ; `accent` est rendu en serif italique irisé à la fin. */
export function Title({ lines, accent, level = "l", at, split = "lines" }: { lines: string[]; accent?: string; level?: "m" | "l" | "xl"; at?: number; split?: "lines" | "chars" }) {
  return (
    <h1 id="slide-title" className={`title title--${level}`} data-split={split} data-at={at}>
      {lines.map((line, i) => (
        <span key={i} className="title-line">
          {line}
          {accent && i === lines.length - 1 ? <> <em className="holo-text">{accent}</em></> : null}
        </span>
      ))}
    </h1>
  );
}

export function Lead({ children, at }: { children: ReactNode; at?: number }) {
  return <p className="lead" data-in="up" data-at={at}>{children}</p>;
}

export function Chip({ tone = "gold", children, at }: { tone?: Tone; children: ReactNode; at?: number }) {
  return <span className={`chip chip--${tone}`} data-in="scale" data-at={at}><i aria-hidden="true" />{children}</span>;
}

/** Panneau en verre dépoli, bord irisé au survol. */
export function Glass({ children, className = "", at, anim = "up", gap }: { children: ReactNode; className?: string; at?: number; anim?: string; gap?: number }) {
  return <div className={`glass ${className}`} data-in={anim} data-at={at} data-gap={gap}>{children}</div>;
}

const PATHS = {
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  upload: <><path d="M12 16V4m0 0-4.5 4.5M12 4l4.5 4.5" /><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></>,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m8.8 12.2 2.2 2.2 4.4-4.6" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  cube: <><path d="M12 2.8 20 7.4v9.2l-8 4.6-8-4.6V7.4l8-4.6Z" /><path d="M4 7.4 12 12l8-4.6M12 12v9.2" /></>,
  phone: <><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M10.5 18.5h3" /></>,
  scan: <><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" /><path d="M4 12h16" /></>,
  spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  pause: <><circle cx="12" cy="12" r="9" /><path d="M10 9v6M14 9v6" /></>,
  music: <><path d="M9 18V5l11-2v13" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="17.5" cy="16" r="2.5" /></>,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 1 2-2h13" /></>,
  door: <><path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17" /><path d="M3 21h18M15 12h.01" /></>,
  hand: <><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5V4a1.5 1.5 0 0 1 3 0v7m0-5.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.6a6 6 0 0 1-4.8-2.4L3 15.2a1.6 1.6 0 0 1 2.5-2l2.5 2.3" /></>,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
