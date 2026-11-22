import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { CustomEase } from "gsap/CustomEase";
import { sfx, type SfxName } from "./sfx";

gsap.registerPlugin(useGSAP, SplitText, DrawSVGPlugin, ScrambleTextPlugin, CustomEase);
// Pas de lissage de latence : quand une scène 3D charge le GPU, la chorégraphie
// garde son horloge réelle au lieu de ralentir.
gsap.ticker.lagSmoothing(0);
CustomEase.create("silk", "M0,0 C0.16,1 0.3,1 1,1");
CustomEase.create("trace", "M0,0 C0.45,0 0.25,1 1,1");

const HEX = "0123456789abcdef";

/**
 * Chorégraphie déclarative : chaque scène marque ses éléments, une seule
 * timeline les joue dans l’ordre du document.
 *
 *   data-split="lines|chars"   titre découpé, montée masquée
 *   data-in="up|left|right|fade|scale|blur|flip|clip|wipe"   entrée d’un bloc
 *   data-draw                  groupe SVG tracé, puis textes et aplats
 *   data-count="43113"         compteur (format fr-FR)
 *   data-bar="0.62"            barre qui se remplit (scaleX)
 *   data-scramble="0x9f…"      texte décodé caractère par caractère (hashes)
 *   data-at="1.2"              position absolue (s) ; sinon enchaîné
 *   data-gap="0.12"            écart avec l’élément précédent (défaut 0.08)
 *   data-dur="1.6"             durée propre
 *   data-sfx="blip"            bruitage déclenché au départ de l’élément
 */
export function useChoreo(instant: boolean): RefObject<HTMLDivElement | null> {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    let muted = instant;
    const play = (name: string | undefined, arg?: number) => {
      if (muted || !name || !(name in sfx)) return;
      (sfx[name as SfxName] as (a?: number) => void)(arg);
    };

    const tl = gsap.timeline({ defaults: { ease: "silk" }, paused: true, delay: 0.05 });
    const splits: SplitText[] = [];
    let cursor = 0;

    el.querySelectorAll<HTMLElement | SVGElement>("[data-split],[data-in],[data-draw],[data-count],[data-bar],[data-scramble]").forEach(node => {
      const d = node.dataset;
      const at = d.at !== undefined ? Number(d.at) : cursor + Number(d.gap ?? 0.08);
      let length = 0.6;

      if (d.split !== undefined) {
        if (d.split === "chars") {
          const split = SplitText.create(node, { type: "chars,words", charsClass: "split-char" });
          splits.push(split);
          tl.from(split.chars, { yPercent: 115, rotateX: -80, autoAlpha: 0, filter: "blur(6px)", duration: 1, stagger: 0.028, ease: "expo.out", transformOrigin: "50% 100%" }, at);
          length = 0.35 + split.chars.length * 0.028;
        } else {
          const split = SplitText.create(node, { type: "lines", mask: "lines", linesClass: "split-line" });
          splits.push(split);
          tl.from(split.lines, { yPercent: 110, rotate: 1.5, duration: 1, stagger: 0.09, ease: "power4.out" }, at);
          length = 0.3 + split.lines.length * 0.09;
        }
      } else if (d.in !== undefined) {
        const dur = Number(d.dur ?? 0.85);
        const from: gsap.TweenVars = { duration: dur, ease: "power4.out" };
        switch (d.in) {
          case "left": Object.assign(from, { x: -56, autoAlpha: 0 }); break;
          case "right": Object.assign(from, { x: 56, autoAlpha: 0 }); break;
          case "fade": Object.assign(from, { autoAlpha: 0, ease: "power2.out" }); break;
          case "scale": Object.assign(from, { scale: 0.9, autoAlpha: 0, transformOrigin: "50% 60%" }); break;
          case "blur": Object.assign(from, { autoAlpha: 0, filter: "blur(18px)", scale: 1.04, ease: "power3.out" }); break;
          case "flip": Object.assign(from, { rotateY: -70, autoAlpha: 0, transformPerspective: 1200, transformOrigin: "0% 50%", duration: Number(d.dur ?? 1.1) }); break;
          case "clip": Object.assign(from, { clipPath: "inset(0% 0% 100% 0%)", duration: Number(d.dur ?? 1.1), ease: "power3.inOut" }); break;
          case "wipe": Object.assign(from, { clipPath: "inset(0% 100% 0% 0%)", duration: Number(d.dur ?? 0.9), ease: "power3.inOut" }); break;
          default: Object.assign(from, { y: 36, autoAlpha: 0 });
        }
        tl.from(node, from, at);
        length = 0.22;
      } else if (d.draw !== undefined) {
        const dur = Number(d.dur ?? 1.6);
        const shapes = gsap.utils.toArray<SVGGeometryElement>(node.querySelectorAll("path,line,polyline,polygon,rect,circle,ellipse"))
          .filter(s => !s.closest("[data-nodraw]") && !s.hasAttribute("data-fill-only"));
        // DrawSVG remplace stroke-dasharray : les traits pointillés apparaissent en fondu.
        const dashed = shapes.filter(s => s.hasAttribute("stroke-dasharray"));
        const strokes = shapes.filter(s => !s.hasAttribute("stroke-dasharray"));
        const fills = gsap.utils.toArray<SVGElement>(node.querySelectorAll("[data-fill],[data-fill-only]"));
        const labels = gsap.utils.toArray<SVGElement>(node.querySelectorAll("text,[data-label]"));
        const each = Math.min(0.9, dur * 0.55);
        const stagger = strokes.length > 1 ? (dur - each) / (strokes.length - 1) : 0;
        if (dashed.length) tl.from(dashed, { opacity: 0, duration: 0.5, stagger: Math.min(0.06, dur / dashed.length / 2), ease: "power1.out" }, at + 0.15);
        tl.from(strokes, { drawSVG: 0, duration: each, stagger, ease: "trace" }, at);
        if (fills.length) tl.from(fills, { fillOpacity: 0, opacity: 0, duration: 0.6, stagger: stagger * 0.6, ease: "power1.out" }, at + each * 0.7);
        if (labels.length) tl.from(labels, { autoAlpha: 0, y: 4, duration: 0.45, stagger: Math.min(0.05, dur / Math.max(labels.length, 1) / 2) }, at + each * 0.55);
        length = Number(d.hold ?? dur * 0.5);
      } else if (d.count !== undefined) {
        const target = Number(d.count);
        const decimals = Number(d.decimals ?? 0);
        const fmt = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: d.group !== "off" });
        const format = (v: number) => fmt.format(v).replace(/ /g, " ");
        const state = { v: 0 };
        const dur = Number(d.dur ?? 1.4);
        let last = -1;
        node.textContent = format(0);
        tl.to(state, {
          v: target, duration: dur, ease: "power3.out",
          onUpdate: () => {
            node.textContent = format(state.v);
            const step = Math.floor((state.v / Math.max(target, 1)) * 10);
            if (step !== last) { last = step; play("tick", 1 + step * 0.04); }
          },
        }, at);
        tl.from(node, { autoAlpha: 0, y: 14, duration: 0.5, ease: "power3.out" }, at);
        length = 0.25;
      } else if (d.bar !== undefined) {
        tl.fromTo(node, { scaleX: 0 }, { scaleX: Number(d.bar), transformOrigin: "0% 50%", duration: Number(d.dur ?? 1.1), ease: "power3.inOut" }, at);
        length = 0.12;
      } else if (d.scramble !== undefined) {
        const text = d.scramble || node.textContent || "";
        const dur = Number(d.dur ?? 1.2);
        tl.fromTo(node, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, at);
        tl.to(node, { duration: dur, scrambleText: { text, chars: HEX, revealDelay: dur * 0.25, speed: 0.6 }, ease: "none" }, at);
        length = 0.3;
      }

      if (d.sfx) tl.call(() => play(d.sfx), [], at);
      cursor = at + Number(d.len ?? length) - 0.08;
    });

    tl.eventCallback("onComplete", () => { splits.forEach(s => s.revert()); });
    if (instant) { tl.progress(1); muted = false; return; }
    tl.play();
    return () => { muted = true; };
  }, { scope: root, dependencies: [instant], revertOnUpdate: true });

  return root;
}
