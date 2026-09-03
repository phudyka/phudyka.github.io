"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BrowserFrame, PhoneFrame } from "./frames";

export type Shot = {
  src: string;
  /** Le châssis qui va autour : c'est l'appareil qui a produit la capture. */
  device: "web" | "phone";
  width: number;
  height: number;
  label: string;
  alt: string;
};

/**
 * Un carrousel, un seul sélecteur.
 *
 * Les deux familles d'écrans — le poste de travail et le téléphone — se
 * suivent dans la même piste et se choisissent dans la même bande de
 * vignettes. Deux carrousels côte à côte, chacun avec sa pagination,
 * demanderaient au lecteur d'apprendre deux fois le même geste ; c'est le
 * châssis autour de la capture qui dit de quel appareil il s'agit, pas un
 * second jeu de contrôles.
 *
 * La vignette active s'élargit au lieu de s'entourer d'un liseré : la largeur
 * se voit du coin de l'œil, un liseré demande d'y regarder.
 */

const FULL = 104;
const COLLAPSED = 34;
const GAP = 4;

export default function FeatureCarousel(
  { shots, label }: { shots: readonly Shot[]; label: string },
) {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // La piste suit l'index, sauf pendant un glissement où le doigt commande.
  useEffect(() => {
    if (dragging || !track.current) return;
    const width = track.current.offsetWidth || 1;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) x.set(-index * width);
    else animate(x, -index * width, { type: "spring", stiffness: 320, damping: 34 });
  }, [index, dragging, x]);

  // La bande de vignettes centre celle qui est active.
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const left = index * (COLLAPSED + GAP) - el.offsetWidth / 2 + FULL / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [index]);

  const go = (i: number) => setIndex(Math.max(0, Math.min(shots.length - 1, i)));

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={track}
        className="relative overflow-hidden rounded-xl border border-border bg-card"
      >
        <motion.div
          className="flex"
          drag="x"
          dragElastic={0.16}
          dragMomentum={false}
          style={{ x }}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            const width = track.current?.offsetWidth || 1;
            const fast = Math.abs(info.velocity.x) > 500;
            const far = Math.abs(info.offset.x) > width * 0.3;
            if (fast || far) go(index + (info.offset.x > 0 ? -1 : 1));
            else go(index);
          }}
        >
          {shots.map((shot) => (
            <div
              key={shot.src}
              // Sur téléphone, la marge est rendue à la capture : un tableau de
              // bord de 1 600 px réduit à 250 ne montre déjà plus grand-chose.
              className="flex w-full shrink-0 items-center justify-center p-2 sm:p-6"
            >
              {shot.device === "web"
                ? (
                  <BrowserFrame url="poolcenter.app">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shot.src}
                      width={shot.width}
                      height={shot.height}
                      loading="lazy"
                      draggable={false}
                      alt={shot.alt}
                      className="w-full select-none"
                    />
                  </BrowserFrame>
                )
                : (
                  <PhoneFrame>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shot.src}
                      width={shot.width}
                      height={shot.height}
                      loading="lazy"
                      draggable={false}
                      alt={shot.alt}
                      className="w-full select-none"
                    />
                  </PhoneFrame>
                )}
            </div>
          ))}
        </motion.div>

        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Écran précédent"
          className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 text-foreground transition-opacity hover:bg-accent disabled:opacity-30"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === shots.length - 1}
          aria-label="Écran suivant"
          className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 text-foreground transition-opacity hover:bg-accent disabled:opacity-30"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      {/* Le nom de l'écran, sous la piste : une vignette ne dit pas ce qu'elle
          montre, et un carrousel muet oblige à deviner. */}
      <p aria-live="polite" className="text-sm text-muted-foreground">
        <span className="num text-foreground">
          {index + 1}/{shots.length}
        </span>{" "}
        · {shots[index].label}
      </p>

      <div
        ref={strip}
        role="tablist"
        aria-label={label}
        className="carousel-strip overflow-x-auto"
      >
        <div className="flex h-16 w-max gap-1">
          {shots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={shot.label}
              onClick={() => go(i)}
              style={{ width: i === index ? FULL : COLLAPSED }}
              className="h-full shrink-0 overflow-hidden rounded-md border border-border transition-[width,border-color] duration-300 ease-out aria-selected:border-primary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.src}
                alt=""
                aria-hidden
                loading="lazy"
                draggable={false}
                className="size-full select-none object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
