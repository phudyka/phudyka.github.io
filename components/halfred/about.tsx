import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
      <div className="hr-wrap hr-about grid items-center gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
        <div className="hr-fins">
          {fins
            ? (
              <>
                <Image src={fins} alt="" width={2400} height={1013} className="hr-fins__art" />
                <Image src={fins} alt="" width={2400} height={1013} className="hr-fins__art hr-fins__lit" aria-hidden />
              </>
            )
            : null}
          <ol className="hr-fins__list" aria-label={t.about.safeguardsTitle}>
            {t.about.safeguards.map((line, i) => (
              <li key={line} className="hr-fins__tag" style={{ "--i": i } as CSSProperties}>
                <span className="num hr-display hr-red" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>

        <BlurFade inView delay={0.08}>
          <h2 className="hr-display hr-h2">
            <span className="hr-about__line">{t.about.title[0]}</span>{" "}
            <span className="hr-about__line">
              {(() => {
                const [before, after] = t.about.title[1].split(t.about.accent);
                return <>{before}<span className="hr-red">{t.about.accent}</span>{after}</>;
              })()}
            </span>
          </h2>
          <p className="hr-lead mt-6">
            {t.about.halfred.map((line) => <span key={line} className="hr-about__line">{line} </span>)}
          </p>
          <Link href={t.hub.href} className="hr-paul mt-10">
            <span className="hr-portrait">
              <Image src="/paul-hudyka.webp" alt="" width={176} height={176} />
            </span>
            <span className="flex flex-col">
              <span className="font-medium">{t.about.paul[0]}</span>
              <span className="text-sm text-muted-foreground [text-wrap:balance]">{t.about.paul[1]}</span>
            </span>
            <ArrowUpRight className="hr-paul__icon size-4" aria-hidden />
          </Link>
        </BlurFade>
      </div>
    </section>
  );
}
