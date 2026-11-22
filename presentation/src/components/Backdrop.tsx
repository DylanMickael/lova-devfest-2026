import { useEffect, useRef } from "react";

/**
 * Fond de planche, en couches :
 *   1. aplat du thème (ivoire ou encre) ;
 *   2. maillage de halos qui dérivent lentement — teinte propre à chaque partie ;
 *   3. treillis de blocs (la chaîne) en perspective ;
 *   4. projecteur qui suit le pointeur ;
 *   5. grain argentique et vignettage.
 * Tout est en CSS : la bascule de thème ne coûte aucun rendu React.
 */
export function Backdrop({ part }: { part: number }) {
  const spot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        spot.current?.style.setProperty("--sx", `${e.clientX}px`);
        spot.current?.style.setProperty("--sy", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className={`backdrop backdrop--p${part}`} aria-hidden="true">
      <div className="backdrop-mesh">
        <i className="blob blob--a" />
        <i className="blob blob--b" />
        <i className="blob blob--c" />
        <i className="blob blob--d" />
      </div>
      <div className="backdrop-lattice" />
      <div ref={spot} className="backdrop-spot" />
      <svg className="backdrop-grain" width="100%" height="100%">
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.9 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
      <div className="backdrop-vignette" />
    </div>
  );
}
