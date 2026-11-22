import { useId, useMemo } from "react";
import { GenArt } from "./GenArt";
import { prng, sampleHex, seedFrom, shortHex } from "./genart";

/**
 * Éléments d’imprimerie : code-barres de une, tampon de provenance et fiche
 * de catalogue. Tout est déterministe et marqué « spécimen » : aucune
 * référence affichée ne correspond à une transaction réelle.
 */

/** Code-barres décoratif (EAN stylisé), généré depuis une graine. */
export function Barcode({ seed, label }: { seed: string; label: string }) {
  const bars = useMemo(() => {
    const rnd = prng(seedFrom(seed));
    const out: { x: number; w: number }[] = [];
    let x = 0;
    while (x < 94) {
      const w = 0.6 + Math.floor(rnd() * 3) * 0.7;
      if (rnd() > 0.38) out.push({ x, w });
      x += w + 0.6 + rnd() * 0.8;
    }
    return out;
  }, [seed]);
  return (
    <figure className="barcode" aria-label={`Code-barres décoratif ${label}`}>
      <svg viewBox="0 0 96 34" preserveAspectRatio="none" aria-hidden="true">
        <rect width="96" height="34" fill="#f8f4ec" />
        {bars.map((b, i) => <rect key={i} x={b.x + 1} y={2} width={b.w} height={30} fill="#111" />)}
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

/** Tampon circulaire, texte sur le pourtour. */
export function Seal({ text, center }: { text: string; center: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className="seal" viewBox="0 0 120 120" aria-hidden="true">
      <defs><path id={`seal-${id}`} d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" /></defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <text className="seal-ring"><textPath href={`#seal-${id}`} startOffset="0">{text}</textPath></text>
      <text className="seal-center" x="60" y="66" textAnchor="middle">{center}</text>
    </svg>
  );
}

/** Fiche de catalogue façon vente aux enchères : le NFT présenté comme un lot. */
export function Certificate({ seed, lot }: { seed: string; lot: number }) {
  const fingerprint = sampleHex(`sha:${seed}`);
  const tx = sampleHex(`tx:${seed}`);
  return (
    <article className="certificate" aria-label={`Fiche de provenance, lot ${lot} (spécimen)`}>
      <header>
        <span className="certificate-brand">LOVA</span>
        <span>Registre de provenance</span>
      </header>
      <div className="certificate-lot">
        <span>Lot n°</span>
        <strong>{String(lot).padStart(4, "0")}</strong>
      </div>
      <div className="certificate-plate"><GenArt seed={seed} /></div>
      <dl>
        <div><dt>Standard</dt><dd>ERC‑721</dd></div>
        <div><dt>Réseau</dt><dd>Avalanche Fuji · 43113</dd></div>
        <div><dt>Empreinte</dt><dd className="mono">{shortHex(fingerprint, 10, 6)}</dd></div>
        <div><dt>Transaction</dt><dd className="mono">0x{shortHex(tx, 8, 6)}</dd></div>
      </dl>
      <footer>Spécimen — données d’exemple</footer>
      <div className="certificate-seal"><Seal text="LOVA · PROVENANCE NUMÉRIQUE · FUJI · " center="43113" /></div>
    </article>
  );
}
