import BlurFade from "@/components/blur-fade";
import { accented } from "@/components/halfred/pricing";
import type { HalfredCopy } from "@/data/content";

/**
 * Réalisations : trois vrais clients, leur métier, ce qui a été fait. La
 * citation n'apparaît que si un avis réel a été saisi dans les données.
 */
export default function Work({ t }: { t: HalfredCopy }) {
  return (
    <section id="realisations" className="hr-section hr-work">
      <div className="hr-wrap hr-about">
        <BlurFade inView>
          <h2 className="hr-display hr-h2">{accented(t.work.title, [t.work.accent])}</h2>
        </BlurFade>
        <ul className="hr-work__list">
          {t.work.items.map((item, i) => (
            <li key={item.client}>
              <BlurFade inView delay={0.06 * i}>
                <article className="hr-work__card">
                  <p className="hr-work__kind">{item.kind}</p>
                  <h3 className="hr-display hr-work__client">{item.client}</h3>
                  <p className="hr-work__trade">{item.trade}</p>
                  <p className="hr-work__body">{item.body}</p>
                  {item.quote
                    ? (
                      <blockquote className="hr-work__quote">
                        <p>{item.quote}</p>
                        {item.author ? <footer>{item.author}</footer> : null}
                      </blockquote>
                    )
                    : null}
                </article>
              </BlurFade>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
