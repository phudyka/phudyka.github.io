"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * WordRotate (Magic UI), adapté au titre Halfred : en ligne, décalages en `em`,
 * largeur réservée au mot le plus long (le titre centré ne bouge pas quand le
 * mot change), `suffix` collé au mot. Décoratif : le titre porte le premier mot
 * en texte lu par ailleurs. Sous `prefers-reduced-motion`, le premier mot reste.
 */
export default function WordRotate({
  words,
  suffix = "",
  className,
  duration = 2500,
}: {
  words: readonly string[];
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const interval = setInterval(() => setIndex((i) => (i + 1) % words.length), duration);
    return () => clearInterval(interval);
  }, [words, duration, reduce]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  return (
    <span aria-hidden="true" className="hr-rotate">
      <span className="hr-rotate__ghost"><span className={className}>{longest}</span>{suffix}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          className="hr-rotate__word"
          initial={{ opacity: 0, y: "-0.5em" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "0.5em" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <span className={className}>{words[index]}</span>{suffix}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
