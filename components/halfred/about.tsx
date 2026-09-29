import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import Locks from "@/components/halfred/locks";
import type { HalfredCopy } from "@/data/content";

/**
 * À gauche les lames rouges, qui défilent sans fin dans la fenêtre (ruban
 * CSS en perspective, figé sous reduced-motion). À droite : ce que fait Halfred, les trois
 * garde-fous en verrous qui s'enclenchent, puis Paul.
 */
export default function About({ t }: { t: HalfredCopy }) {
  const fins = halfredImage("fins-tile.webp");
  return (
    <section id="halfred" className="hr-section">
      <div className="hr-wrap hr-about hr-about--wide grid items-center gap-12 md:grid-cols-[1.5fr_1fr] md:gap-16 lg:gap-24">
        <div className="hr-fins">
          {fins
            ? <div className="hr-fins__stage" aria-hidden><div className="hr-fins__belt" /></div>
            : null}
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
          <p className="hr-about__sub mt-5">{t.about.halfred}</p>
          <Locks items={t.about.safeguards} label={t.about.safeguardsTitle} />
          <Link href={t.hub.href} className="hr-paul mt-8">
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
