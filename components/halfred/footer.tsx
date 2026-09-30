import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import HalfredContact from "@/components/halfred/contact";
import { accented } from "@/components/halfred/pricing";
import Bust from "@/components/halfred/bust";
import Wordmark from "@/components/halfred/wordmark";
import type { Lang } from "@/components/section/halfred";
import { type HalfredCopy, LEGAL } from "@/data/content";

/**
 * Contact puis pied de page, deux sections distinctes. Contact : titre et
 * formulaire à gauche, robot à droite sur toute la hauteur. Pied de page : un
 * écran à lui, l'éclipse qui se lève derrière le mot-marque, et en bas une
 * bande de mentions en trois colonnes (identité et liens, identifiants,
 * conditions). `HalfredContact` affiche toujours l'adresse ; le formulaire
 * n'apparaît que si la clé Web3Forms Halfred est fournie au build.
 */
export default function Footer({ t, lang }: { t: HalfredCopy; lang: Lang }) {
  const horizon = halfredImage("horizon.webp");
  const ids: ReadonlyArray<readonly [string, string]> = [
    ["SIREN", LEGAL.siren],
    ["SIRET", LEGAL.siret],
    [lang === "fr" ? "Code APE" : "NAF code", LEGAL.ape],
    [lang === "fr" ? "Immatriculation" : "Registered", LEGAL.since],
  ];
  return (
    <>
      <section id="contact" className="hr-section hr-contact-sec">
        <div className="hr-wrap hr-contact">
          <div className="hr-contact__main">
            <BlurFade inView>
              <h2 className="hr-display hr-h2">{accented(t.contact.title, [t.contact.accent])}</h2>
              <p className="hr-lead mt-4 max-w-[48ch]">{t.contact.lead}</p>
            </BlurFade>
            <BlurFade inView delay={0.08}>
              <HalfredContact c={t.contact} />
            </BlurFade>
          </div>
          <div className="hr-contact__robot"><Bust /></div>
        </div>
      </section>

      <footer className="hr-footer">
        {/* L'éclipse est dimensionnée sur le mot (en em) et posée au-dessus de
            lui : l'arc passe toujours au-dessus des lettres, quelle que soit la
            largeur de l'écran. */}
        <div className="hr-footer__stage">
          {horizon
            ? (
              <>
                <Image src={horizon} alt="" width={3200} height={1350} className="hr-footer__art hr-footer__halo" aria-hidden />
                <Image src={horizon} alt="" width={3200} height={1350} className="hr-footer__art" />
              </>
            )
            : <div aria-hidden className="hr-footer__glow" />}
          <Wordmark />
          <p className="hr-footer__tagline">{t.footer.tagline}</p>
        </div>
        <div className="hr-wrap hr-legal">
          <div className="hr-legal__who">
            <p className="text-foreground">{LEGAL.entity}</p>
            <ul className="hr-legal__links">
              <li><Link href={t.hub.href}>{t.hub.label}</Link></li>
              <li><a href="https://github.com/phudyka" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><Link href={t.footer.otherLang.href}>{t.footer.otherLang.label}</Link></li>
            </ul>
          </div>
          <dl className="hr-legal__ids">
            {ids.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd className="num">{value}</dd>
              </div>
            ))}
          </dl>
          {lang === "fr"
            ? (
              <p className="hr-legal__terms">
                {LEGAL.vat}. {LEGAL.quoteValidity}. {LEGAL.payment}. Pénalités de retard au taux légal
                minimum, majorées de l’indemnité forfaitaire de recouvrement de 40 €. Les livrables
                restent la propriété de Halfred jusqu’au paiement intégral.
              </p>
            )
            : <p className="hr-legal__terms">La Colle-sur-Loup, France.</p>}
        </div>
      </footer>
    </>
  );
}
