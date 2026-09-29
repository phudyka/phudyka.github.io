import type { Metadata } from "next";
import { ParcoursBody } from "@/components/section/parcours";

export const metadata: Metadata = {
  title: "Parcours",
  description:
    "Missions en entreprise, projets systèmes et réseaux de l’École 42, compétences techniques et langues de Paul Hudyka.",
  alternates: {
    canonical: "/parcours/",
    languages: { fr: "/parcours/", en: "/en/experience/" },
  },
};

export default function ParcoursPage() {
  return <ParcoursBody lang="fr" />;
}
