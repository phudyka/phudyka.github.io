"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * WordRotate (Magic UI), adapté au titre Halfred : en ligne, décalages en `em`,
 * largeur réservée au mot le plus long (le titre centré ne bouge pas quand le
 * mot change), `suffix` collé au mot. Décoratif : le titre porte le premier mot
 * en texte lu par ailleurs. Sous `prefers-reduced-motion`, le premier mot reste.
 * `startAfter` : sélecteur d'un élément dont la fin d'animation lance la
 * rotation (le premier mot reste affiché jusque-là).
 */
export default function WordRotate({
  words,
  suffix = "",
  className,
  duration = 2500,
  startAfter,
}: {
  words: readonly string[];
  suffix?: string;
  className?: string;
  duration?: number;
  startAfter?: string;
}) {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(!startAfter);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (ready || !startAfter) return;
    const el = document.querySelector(startAfter);
    if (!el || getComputedStyle(el).animationName === "none") { setReady(true); return; }
    const done = (e: Event) => { if (e.target === el) setReady(true); };
    el.addEventListener("animationend", done);
    return () => el.removeEventListener("animationend", done);
  }, [ready, startAfter]);

  useEffect(() => {
    if (!ready || reduce || words.length < 2) return;
    const interval = setInterval(() => setIndex((i) => (i + 1) % words.length), duration);
    return () => clearInterval(interval);
  }, [words, duration, reduce, ready]);

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
