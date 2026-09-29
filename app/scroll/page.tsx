import type { Metadata } from "next";
import { ScrollBody } from "@/components/section/scroll";

export const metadata: Metadata = {
  title: "En défilement",
  description:
    "Le même dossier, lu comme un magazine : une application en production, un réseau qui se ferme sous le curseur, un parcours.",
  alternates: {
    canonical: "/scroll/",
    languages: { fr: "/scroll/", en: "/en/scroll/" },
  },
};

/** Lecture longue de l'accueil : mise en page et copie dans `ScrollBody`. */
export default function ScrollPage() {
  return <ScrollBody lang="fr" />;
}
