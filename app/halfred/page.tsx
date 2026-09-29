import type { Metadata, Viewport } from "next";
import { halfredImage } from "@/components/halfred/asset";
import { HalfredBody } from "@/components/section/halfred";
import { SITE } from "@/data/content";

export const metadata: Metadata = {
  title: "Halfred",
  description:
    "Consultant en automatisation et IA pour TPE et PME, à La Colle-sur-Loup et à distance. Audit d’abord, puis la solution adaptée à vos outils.",
  openGraph: {
    title: "Halfred",
    description:
      "Consultant en automatisation et IA pour TPE et PME, à La Colle-sur-Loup et à distance. Audit d’abord, puis la solution adaptée à vos outils.",
    url: "/halfred/",
    siteName: SITE.name,
    locale: "fr_FR",
    type: "website",
    images: halfredImage("og.jpg") ? ["/halfred/og.jpg"] : undefined,
  },
  alternates: {
    canonical: "/halfred/",
    languages: { fr: "/halfred/", en: "/en/halfred/" },
  },
};

/** Monde Halfred : sombre seul, quel que soit le thème du système. */
export const viewport: Viewport = { themeColor: "#050506", colorScheme: "dark" };

/** Landing Halfred (monde « Half-red », 2026-09-29) : copie dans `HALFRED`, prix dans `OFFERS`. */
export default function HalfredPage() {
  return <HalfredBody lang="fr" />;
}
