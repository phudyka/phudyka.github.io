import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import Locks from "@/components/halfred/locks";
import type { HalfredCopy } from "@/data/content";

/**
 * Les lames rouges en bannière sur toute la largeur ; au centre, un cadre de
 * verre sombre porte ce que fait Halfred, les trois garde-fous en verrous qui
 * s'enclenchent, puis Paul.
 */
export default function About({ t }: { t: HalfredCopy }) {
  const fins = halfredImage("fins.webp");
  return (
    <section id="halfred" className="hr-section hr-banner">
      {fins
        ? <Image src={fins} alt="" width={2400} height={1013} className="hr-banner__art" />
        : null}
      <div className="hr-wrap hr-about grid place-items-center">
        <BlurFade inView delay={0.08}>
          <div className="hr-banner__card">
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
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
