import { memo, useId, useMemo, type ReactElement } from "react";
import { prng, seedFrom, WEAVE_PALETTES } from "./genart";

/**
 * Motif tissé génératif : bandes, chevrons, losanges et rayures, tirés d’une
 * graine. Sert d’« œuvre » aux tokens et aux cadres de la galerie, car le
 * dépôt n’embarque aucune image patrimoniale (droits non encore validés).
 */

type Props = { seed: string; className?: string; title?: string; variant?: "weave" | "portrait" };

const W = 100;
const H = 125;

function build(seed: string, variant: "weave" | "portrait") {
  const rnd = prng(seedFrom(seed));
  const palette: readonly string[] = WEAVE_PALETTES[Math.floor(rnd() * WEAVE_PALETTES.length)];
  const pick = () => palette[Math.floor(rnd() * palette.length)];
  const shapes: ReactElement[] = [];
  let y = 0;
  let k = 0;

  while (y < H) {
    const h = Math.min(H - y, 5 + Math.floor(rnd() * 13));
    const bg = pick();
    let fg = pick();
    if (fg === bg) fg = palette[(palette.indexOf(bg) + 2) % palette.length];
    shapes.push(<rect key={k++} x={0} y={y} width={W} height={h} fill={bg} />);
    const kind = rnd();

    if (kind < 0.28) {
      // Chevrons
      const step = 6 + Math.floor(rnd() * 5);
      let d = `M0 ${y + h * 0.8}`;
      for (let x = 0; x <= W + step; x += step) d += ` L${x + step / 2} ${y + h * 0.2} L${x + step} ${y + h * 0.8}`;
      shapes.push(<path key={k++} d={d} fill="none" stroke={fg} strokeWidth={Math.max(0.8, h * 0.12)} strokeLinejoin="miter" />);
    } else if (kind < 0.52) {
      // Losanges
      const step = h * 1.1;
      for (let x = step / 2; x < W + step; x += step) {
        const cx = x, cy = y + h / 2, r = h * 0.42;
        shapes.push(<path key={k++} d={`M${cx} ${cy - r} L${cx + r} ${cy} L${cx} ${cy + r} L${cx - r} ${cy}Z`} fill={fg} />);
        if (h > 9) shapes.push(<circle key={k++} cx={cx} cy={cy} r={r * 0.22} fill={bg} />);
      }
    } else if (kind < 0.72) {
      // Rayures fines
      const gap = 1.6 + rnd() * 2.2;
      for (let x = 0; x < W; x += gap * 2) shapes.push(<rect key={k++} x={x} y={y} width={gap * 0.55} height={h} fill={fg} opacity={0.85} />);
    } else if (kind < 0.86) {
      // Points
      const gap = 3.2 + rnd() * 2;
      for (let x = gap / 2; x < W; x += gap) shapes.push(<circle key={k++} cx={x} cy={y + h / 2} r={Math.min(1.1, h * 0.18)} fill={fg} />);
    }
    // sinon : bande unie
    y += h;
  }

  const sun = variant === "portrait" || rnd() > 0.45;
  return { shapes, palette, sun, sunY: 30 + rnd() * 40, sunR: 16 + rnd() * 10 };
}

export const GenArt = memo(function GenArt({ seed, className = "", title, variant = "weave" }: Props) {
  const id = useId().replace(/:/g, "");
  const art = useMemo(() => build(seed, variant), [seed, variant]);
  return (
    <svg className={`genart ${className}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <radialGradient id={`sun-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff3dc" stopOpacity="0.95" />
          <stop offset="0.55" stopColor={art.palette[1]} stopOpacity="0.85" />
          <stop offset="1" stopColor={art.palette[1]} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`shade-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {art.shapes}
      {art.sun && (
        <g style={{ mixBlendMode: "screen" }}>
          <circle cx={50} cy={art.sunY} r={art.sunR * 1.6} fill={`url(#sun-${id})`} />
          <path d={`M50 ${art.sunY - art.sunR} L${50 + art.sunR} ${art.sunY} L50 ${art.sunY + art.sunR} L${50 - art.sunR} ${art.sunY}Z`} fill="none" stroke="#fff3dc" strokeOpacity="0.7" strokeWidth="0.6" />
        </g>
      )}
      <rect width={W} height={H} fill={`url(#shade-${id})`} />
    </svg>
  );
});
