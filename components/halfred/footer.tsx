import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import Contact, { COPY_EN_HALFRED } from "@/components/section/contact";
import type { Lang } from "@/components/section/halfred";
import LegalFooter from "@/components/section/legal-footer";
import { type HalfredCopy, LEGAL } from "@/data/content";

/**
 * Contact, mentions et mot-marque. Sans l'image du footer, une lueur CSS tient
 * sa place. `Contact` affiche toujours l'adresse ; le formulaire n'apparaît que
 * si la clé Web3Forms Halfred est fournie au build.
 */
export default function Footer({ t, lang }: { t: HalfredCopy; lang: Lang }) {
  const ribbon = halfredImage("ribbon.webp");
  return (
    <footer id="contact" className="hr-footer">
      {ribbon
        ? <Image src={ribbon} alt="" width={2560} height={1097} className="hr-footer__art" />
        : <div aria-hidden className="hr-footer__glow" />}
      <div className="hr-wrap grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <BlurFade inView>
          <h2 className="hr-display hr-h2 max-w-[16ch]">{t.contact.title}</h2>
          <p className="hr-lead mt-4 max-w-[48ch]">{t.contact.lead}</p>
        </BlurFade>
        <BlurFade inView delay={0.08}>
          <div className="hr-panel">
            <Contact copy={lang === "en" ? COPY_EN_HALFRED : undefined} />
          </div>
        </BlurFade>
      </div>
      <div className="hr-wrap mt-20 flex flex-col gap-8 text-sm text-muted-foreground">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><Link href={t.hub.href} className="hover:text-foreground">{t.hub.label}</Link></li>
          <li>
            <a
              href="https://github.com/phudyka"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              GitHub
            </a>
          </li>
          <li>
            <Link href={t.footer.otherLang.href} className="hover:text-foreground">
              {t.footer.otherLang.label}
            </Link>
          </li>
        </ul>
        {lang === "fr"
          ? <LegalFooter />
          : (
            <p>
              {LEGAL.entity} · SIREN <span className="num">{LEGAL.siren}</span> · La Colle-sur-Loup, France
            </p>
          )}
      </div>
      <p aria-hidden className="hr-display hr-wordmark">
        <span>Half</span><span className="hr-red">red</span>
      </p>
    </footer>
  );
}
