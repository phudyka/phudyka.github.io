import type { Metadata, Viewport } from "next";
import { halfredImage } from "@/components/halfred/asset";
import { HalfredBody } from "@/components/section/halfred";
import { SITE } from "@/data/content";

export const metadata: Metadata = {
  title: "Halfred",
  description:
    "Automation and AI consultant for small and medium businesses, in La Colle-sur-Loup and remotely. Audit first, then the solution that fits your tools.",
  openGraph: {
    title: "Halfred",
    description:
      "Automation and AI consultant for small and medium businesses, in La Colle-sur-Loup and remotely. Audit first, then the solution that fits your tools.",
    url: "/en/halfred/",
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
    images: halfredImage("og.jpg") ? ["/halfred/og.jpg"] : undefined,
  },
  alternates: {
    canonical: "/en/halfred/",
    languages: { fr: "/halfred/", en: "/en/halfred/" },
  },
};

/** Monde Halfred : sombre seul, quel que soit le thème du système. */
export const viewport: Viewport = { themeColor: "#050506", colorScheme: "dark" };

/** Traduction fidèle de `/halfred/` : copie dans `HALFRED_EN`. */
export default function HalfredEnPage() {
  return <HalfredBody lang="en" />;
}
