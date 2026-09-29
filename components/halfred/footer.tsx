import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import HalfredContact from "@/components/halfred/contact";
import { accented } from "@/components/halfred/pricing";
import Robot from "@/components/halfred/robot";
import type { Lang } from "@/components/section/halfred";
import LegalFooter from "@/components/section/legal-footer";
import { type HalfredCopy, LEGAL } from "@/data/content";

/**
 * Contact, mentions et mot-marque. Conteneur en `<div>` : `LegalFooter` porte
 * déjà le `<footer>`, et un footer dans un footer n'a pas de sens. Sans l'horizon du footer, une lueur CSS tient
 * sa place. À gauche le titre puis le formulaire, à droite le robot sur toute
 * la hauteur. `HalfredContact` affiche toujours l'adresse ; le formulaire
 * n'apparaît que si la clé Web3Forms Halfred est fournie au build.
 */
export default function Footer({ t, lang }: { t: HalfredCopy; lang: Lang }) {
  const horizon = halfredImage("horizon.webp");
  return (
    <div id="contact" className="hr-footer">
      {horizon
        ? <Image src={horizon} alt="" width={3200} height={1350} className="hr-footer__art" />
        : <div aria-hidden className="hr-footer__glow" />}
      <div className="hr-wrap hr-contact">
        <div className="hr-contact__main">
          <BlurFade inView>
            <h2 className="hr-display hr-h2">{accented(t.contact.title, [t.contact.accent])}</h2>
            <p className="hr-lead mt-4 max-w-[48ch]">{t.contact.lead}</p>
            <ul className="hr-contact__facts">
              {t.contact.facts.map((fact) => <li key={fact}>{fact}</li>)}
            </ul>
          </BlurFade>
          <BlurFade inView delay={0.08}>
            <HalfredContact c={t.contact} />
          </BlurFade>
        </div>
        <div className="hr-contact__robot"><Robot /></div>
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
            <footer>
              {LEGAL.entity} · SIREN <span className="num">{LEGAL.siren}</span> · La Colle-sur-Loup, France
            </footer>
          )}
      </div>
      <p aria-hidden className="hr-display hr-wordmark">
        <span>Half</span><span className="hr-red">red</span>
      </p>
    </div>
  );
}
