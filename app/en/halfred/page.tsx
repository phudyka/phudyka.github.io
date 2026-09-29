import type { Metadata, Viewport } from "next";
import { halfredImage } from "@/components/halfred/asset";
import { HalfredBody } from "@/components/section/halfred";

export const metadata: Metadata = {
  title: { absolute: "Halfred" },
  description:
    "Automation and AI consultant for small and medium businesses, in La Colle-sur-Loup and remotely. Audit first, then the solution that fits your tools.",
  icons: { icon: { url: "/brand/halfred-32.png", sizes: "32x32" }, apple: "/brand/halfred-180.png" },
  openGraph: {
    title: "Halfred",
    description:
      "Automation and AI consultant for small and medium businesses, in La Colle-sur-Loup and remotely. Audit first, then the solution that fits your tools.",
    url: "/en/halfred/",
    siteName: "Halfred",
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
