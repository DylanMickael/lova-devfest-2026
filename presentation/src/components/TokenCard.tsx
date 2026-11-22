import { useRef, type CSSProperties, type PointerEvent } from "react";
import { GenArt } from "./GenArt";
import { sampleHex, shortHex } from "./genart";

/**
 * Carte de token holographique : inclinaison 3D au pointeur, film irisé qui
 * suit la lumière, reflet spéculaire et paillettes. Au repos, elle flotte.
 * Les références affichées sont des exemples (testnet), signalés comme tels.
 */

type Props = {
  seed: string;
  title: string;
  author: string;
  tokenId: number;
  status?: "confirmed" | "pending";
  size?: "s" | "m" | "l";
  className?: string;
  style?: CSSProperties;
  label?: string;
};

const STATUS = { confirmed: "Mint confirmé", pending: "En attente" } as const;

export function TokenCard({ seed, title, author, tokenId, status = "confirmed", size = "m", className = "", style, label = "Aperçu illustratif" }: Props) {
  const card = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const tx = sampleHex(`tx:${seed}`);
  const fingerprint = sampleHex(`sha:${seed}`);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = card.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      el.style.setProperty("--rx", `${((0.5 - py) * 22).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((px - 0.5) * 26).toFixed(2)}deg`);
      el.style.setProperty("--hyp", Math.min(1, Math.hypot(px - 0.5, py - 0.5) * 1.6).toFixed(3));
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    card.current?.classList.remove("is-active");
    ["--mx", "--my", "--rx", "--ry", "--hyp"].forEach(p => card.current?.style.removeProperty(p));
  };

  return (
    <div className={`token token--${size} ${className}`} style={style}>
      <div ref={card} className="token-card" onPointerMove={onMove} onPointerEnter={() => card.current?.classList.add("is-active")} onPointerLeave={onLeave}>
        <div className="token-face">
          <header className="token-head">
            <span className="token-brand"><i aria-hidden="true" />LOVA</span>
            <span className="token-id">#{String(tokenId).padStart(4, "0")}</span>
          </header>
          <div className="token-art">
            <GenArt seed={seed} title={`Motif génératif « ${title} »`} />
            <span className={`token-status token-status--${status}`}><i aria-hidden="true" />{STATUS[status]}</span>
          </div>
          <div className="token-body">
            <strong className="token-title">{title}</strong>
            <span className="token-author">{author}</span>
          </div>
          <dl className="token-meta">
            <div><dt>Standard</dt><dd>ERC‑721</dd></div>
            <div><dt>Réseau</dt><dd>Fuji · 43113</dd></div>
            <div><dt>Empreinte</dt><dd className="mono">{shortHex(fingerprint, 8, 4)}</dd></div>
            <div><dt>Tx</dt><dd className="mono">0x{shortHex(tx, 4, 4)}</dd></div>
          </dl>
          <p className="token-label">{label}</p>
        </div>
        <div className="token-holo" aria-hidden="true" />
        <div className="token-glare" aria-hidden="true" />
        <div className="token-sparkle" aria-hidden="true" />
      </div>
      <div className="token-shadow" aria-hidden="true" />
    </div>
  );
}
