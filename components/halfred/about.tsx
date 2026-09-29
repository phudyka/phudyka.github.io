import Image from "next/image";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import type { HalfredCopy } from "@/data/content";

/** Ce qu'est Halfred, qui est Paul, et les trois garde-fous. */
export default function About({ t }: { t: HalfredCopy }) {
  const fins = halfredImage("fins.webp");
  return (
    <section id="halfred" className="hr-section hr-about">
      {fins
        ? <Image src={fins} alt="" width={3200} height={1350} className="hr-about__art" />
        : null}
      <div className="hr-wrap grid gap-12 md:grid-cols-2 md:gap-16">
        <BlurFade inView>
          <h2 className="hr-display hr-h2">{t.about.title}</h2>
          <div className="mt-6 flex flex-col gap-4">
            {t.about.halfred.map((line) => <p key={line} className="hr-lead">{line}</p>)}
          </div>
        </BlurFade>
        <BlurFade inView delay={0.08}>
          <div className="flex items-start gap-5 md:pt-3">
            <span className="hr-portrait">
              <Image src="/paul-hudyka.webp" alt={t.about.portraitAlt} width={176} height={176} />
            </span>
            <div className="flex flex-col gap-3">
              {t.about.paul.map((line) => <p key={line} className="hr-lead">{line}</p>)}
            </div>
          </div>
        </BlurFade>
      </div>
      <div className="hr-wrap mt-16 md:mt-24">
        <BlurFade inView>
          <h3 className="text-sm font-medium text-muted-foreground">{t.about.safeguardsTitle}</h3>
          <ol className="mt-5 grid gap-px overflow-hidden rounded-[20px] bg-border md:grid-cols-3">
            {t.about.safeguards.map((line, index) => (
              <li key={line} className="flex items-baseline gap-4 bg-card p-6">
                <span className="num hr-display hr-red text-2xl font-semibold" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-medium leading-snug">{line}</span>
              </li>
            ))}
          </ol>
        </BlurFade>
      </div>
    </section>
  );
}
