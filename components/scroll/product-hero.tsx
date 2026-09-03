"use client";

import { useEffect, useRef } from "react";
import { BrowserFrame } from "./frames";

/**
 * Plan large d'ouverture pour PoolCenter.
 *
 * Le `CinematicHero` d'origine empile une vidéo, un dégradé, un grain et un
 * titre en fondu. Trois de ces quatre couches sont refusées par le contrat de
 * direction du site — surcouches décoratives, dégradés de texte — et la
 * quatrième, la vidéo, n'existe pas : il n'y a pas de film du produit, et en
 * fabriquer un serait inventer.
 *
 * Ce qui reste du geste, et qui suffit : la capture s'approche pendant que le
 * lecteur descend, le titre se pose devant, et le fond s'éclaire d'un souffle
 * d'ambre. Une seule variable, `--h`, publiée par le défilement ; tout le reste
 * est du CSS. Le contrat « un seul moment orchestré » tient toujours : celui-ci
 * est un mouvement d'échelle, pas un acte épinglé.
 */
export default function ProductHero(
  { src, alt, kicker, title, lead, href, caption }: {
    src: string;
    alt: string;
    kicker: string;
    title: string;
    lead: string;
    href: string;
    caption: string;
  },
) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let live = false;

    const read = () => {
      const r = el.getBoundingClientRect();
      // 0 quand le bloc entre par le bas, 1 quand son haut atteint le tiers
      // supérieur : l'approche se joue pendant la lecture, pas après.
      const span = r.height + innerHeight;
      const h = Math.min(1, Math.max(0, (innerHeight - r.top) / span));
      el.style.setProperty("--h", h.toFixed(4));
      if (live) raf = requestAnimationFrame(read);
    };

    const io = new IntersectionObserver((entries) => {
      const on = entries.some((e) => e.isIntersecting);
      if (on === live) return;
      live = on;
      if (on) raf = requestAnimationFrame(read);
      else cancelAnimationFrame(raf);
    }, { rootMargin: "15% 0px" });

    io.observe(el);
    read();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} className="product-hero">
      <div className="product-hero-glow" aria-hidden />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-5">
        <span className="num text-xs uppercase tracking-wide text-primary">
          {kicker}
        </span>
        <h2 className="text-pretty text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
          {title}
        </h2>
        <p className="measure text-pretty text-lg leading-relaxed text-muted-foreground">
          {lead}
        </p>
      </div>
      <figure className="product-hero-stage mx-auto flex w-full max-w-4xl flex-col gap-3 px-5">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <BrowserFrame url="poolcenter.app">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              width={1600}
              height={911}
              loading="lazy"
              alt={alt}
              className="w-full transition-opacity group-hover:opacity-90"
            />
          </BrowserFrame>
        </a>
        <figcaption className="text-sm text-muted-foreground">
          {caption}
        </figcaption>
      </figure>
    </div>
  );
}
