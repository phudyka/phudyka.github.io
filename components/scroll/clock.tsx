"use client";

import { useEffect, useState } from "react";

const PARIS = "Europe/Paris";

const at = (d: Date, tz: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: tz,
  }).format(d);

/** Heure et jour lus dans le fuseau de Paris, jamais en temps universel. */
const parisParts = (d: Date) => {
  const p = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    hour: "numeric",
    hour12: false,
    timeZone: PARIS,
  })
    .formatToParts(d)
    .reduce<Record<string, string>>(
      (acc, part) => ((acc[part.type] = part.value), acc),
      {},
    );
  return { hour: Number(p.hour), weekday: p.weekday };
};

/**
 * Les deux langues du site, dans le composant plutôt qu'en quinze props :
 * l'horloge tient en six phrases, et une table les garde côte à côte, donc
 * lisibles ensemble.
 */
const COPY = {
  fr: {
    yours: "chez vous",
    mine: "à Paris, où je travaille de 9 h à 18 h",
    hereOpen: "En ce moment je suis à mon poste.",
    hereShut: "Hors de ces heures, je réponds le lendemain matin.",
    awayOpen: (t: string) =>
      `En ce moment je suis à mon poste, et il est ${t} chez vous.`,
    awayShut:
      "Je reprends à 9 h heure de Paris. Nos journées se recouvrent tous les jours ouvrés.",
  },
  en: {
    yours: "where you are",
    mine: "in Paris, where I work 09:00 to 18:00",
    hereOpen: "I am at my desk right now.",
    hereShut: "Outside those hours, I answer the next morning.",
    awayOpen: (t: string) => `I am at my desk right now, and it is ${t} for you.`,
    awayShut:
      "I start again at 09:00 Paris time. Our days overlap every working day.",
  },
} as const;

type State = {
  /** Le visiteur est-il déjà à l'heure de Paris ? */
  here: boolean;
  mine: string;
  yours: string;
  open: boolean;
  line: string;
};

/**
 * Deux états assumés. Pour un lecteur déjà à l'heure de Paris il n'y a aucun
 * décalage à annoncer : une seule horloge, et pas un mot sur la couverture
 * horaire, qui serait faux. Pour les autres, l'écart est le sujet.
 *
 * Rendu vide au premier passage : le fuseau du visiteur n'existe pas au moment
 * de la génération statique, et afficher « --:-- » ferait clignoter la page.
 */
export default function Clock({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const [s, setS] = useState<State | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const mine = at(now, PARIS);
      const yours = at(now, tz);
      const { hour, weekday } = parisParts(now);
      const open = !["Sat", "Sun"].includes(weekday) && hour >= 9 && hour < 18;
      const here = tz === PARIS || mine === yours;
      const t = COPY[lang];
      const line = here
        ? open ? t.hereOpen : t.hereShut
        : open
        ? t.awayOpen(yours)
        : t.awayShut;
      setS({ here, mine, yours, open, line });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [lang]);

  if (!s) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
        {s.here ? null : (
          <p className="flex flex-col gap-1">
            <span className="num text-2xl font-medium tracking-tight">
              {s.yours}
            </span>
            <span className="text-sm text-muted-foreground">
              {COPY[lang].yours}
            </span>
          </p>
        )}
        <p className="flex flex-col gap-1">
          <span
            className={`num text-2xl font-medium tracking-tight ${
              s.open ? "text-primary" : ""
            }`}
          >
            {s.mine}
          </span>
          <span className="text-sm text-muted-foreground">
            {COPY[lang].mine}
          </span>
        </p>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{s.line}</p>
    </div>
  );
}
