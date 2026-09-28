import type { Metadata } from "next";
import { HalfredBody } from "@/components/section/halfred";

export const metadata: Metadata = {
  title: "Halfred",
  description:
    "Consultant en automatisation et IA pour TPE et PME, à La Colle-sur-Loup et à distance. Audit d’abord, puis la solution adaptée à vos outils.",
  alternates: {
    canonical: "/halfred/",
    languages: { fr: "/halfred/", en: "/en/halfred/" },
  },
};

/**
 * Halfred, activité de conseil en automatisation et IA (positionnement du
 * 2026-09-28). La grille de prix vit sur `/halfred/offres/`, à un clic dès le
 * premier écran. Copie dans `HALFRED` (`data/content.ts`).
 */
export default function HalfredPage() {
  return <HalfredBody lang="fr" />;
}
