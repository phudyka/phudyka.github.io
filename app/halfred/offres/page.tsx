import type { Metadata } from "next";
import { OffresBody } from "@/components/section/halfred";

export const metadata: Metadata = {
  title: "Offres et tarifs — Halfred",
  description:
    "Échange de cadrage gratuit, audit à 350 €, automatisations à partir de 490 €, hébergement à 39 € par mois : les prix publics de Halfred.",
  alternates: {
    canonical: "/halfred/offres/",
    languages: { fr: "/halfred/offres/", en: "/en/halfred/offres/" },
  },
};

/**
 * `/halfred/` dit la démarche ; cette page répond à « combien ». Les prix
 * vivent dans `OFFERS` et `TERMS` (`data/content.ts`), jamais ici.
 */
export default function HalfredOffresPage() {
  return <OffresBody lang="fr" />;
}
