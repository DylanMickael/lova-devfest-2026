import { motion } from "motion/react";

/**
 * Progression façon explorateur de blocs : chaque diapositive est un bloc,
 * relié au précédent. Les blocs déjà « confirmés » sont pleins, le bloc
 * courant pulse en irisé. Chaque bloc est cliquable.
 */

type Props = {
  total: number;
  active: number;
  chapters: string[];
  parts: number[];
  onSelect: (index: number) => void;
  instant: boolean;
};

export function ChainProgress({ total, active, chapters, parts, onSelect, instant }: Props) {
  return (
    <ol className="chain" aria-label="Progression">
      {Array.from({ length: total }, (_, i) => {
        const state = i < active ? "is-done" : i === active ? "is-on" : "";
        const boundary = i > 0 && parts[i] !== parts[i - 1];
        return (
          <li key={i} className={`chain-item ${boundary ? "is-boundary" : ""}`}>
            {i > 0 && <span className={`chain-link ${i <= active ? "is-done" : ""}`} aria-hidden="true" />}
            <button type="button" className={`chain-block ${state}`} onClick={() => onSelect(i)}
              aria-label={`Bloc ${i + 1} : ${chapters[i]}`} aria-current={i === active ? "step" : undefined} title={`${String(i + 1).padStart(2, "0")} · ${chapters[i]}`}>
              {i === active && <motion.i layoutId="chain-cursor" className="chain-cursor" transition={{ duration: instant ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }} />}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
