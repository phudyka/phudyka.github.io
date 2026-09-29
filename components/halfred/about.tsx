import type { CSSProperties } from "react";
import Image from "next/image";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import type { HalfredCopy } from "@/data/content";

/**
 * Ce qu'est Halfred et qui est Paul, à droite ; à gauche, les lames rouges
 * portent les trois garde-fous. Au scroll, une lumière balaie les lames et
 * allume chaque garde-fou à son passage (CSS scroll-driven, image fixe sinon).
 */
export default function About({ t }: { t: HalfredCopy }) {
  const fins = halfredImage("fins.webp");
  return (
    <section id="halfred" className="hr-section">
      <div className="hr-wrap grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <figure className="hr-fins">
          {fins
            ? (
              <>
                <Image src={fins} alt="" width={2400} height={1013} className="hr-fins__art" />
                <Image src={fins} alt="" width={2400} height={1013} className="hr-fins__art hr-fins__lit" aria-hidden />
              </>
            )
            : null}
          <figcaption className="hr-fins__caption">{t.about.safeguardsTitle}</figcaption>
          <ol className="hr-fins__list">
            {t.about.safeguards.map((line, i) => (
              <li key={line} className="hr-fins__tag" style={{ "--i": i } as CSSProperties}>
                <span className="num hr-display hr-red" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </figure>

        <BlurFade inView delay={0.08}>
          <h2 className="hr-display hr-h2">{t.about.title}</h2>
          {t.about.halfred.map((line) => <p key={line} className="hr-lead mt-6">{line}</p>)}
          <div className="mt-10 flex items-center gap-4 border-t border-[var(--border)] pt-8">
            <span className="hr-portrait">
              <Image src="/paul-hudyka.webp" alt={t.about.portraitAlt} width={176} height={176} />
            </span>
            {t.about.paul.map((line) => <p key={line} className="text-sm leading-relaxed text-muted-foreground">{line}</p>)}
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
