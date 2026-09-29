import type { Metadata } from "next";
import { halfredImage } from "@/components/halfred/asset";
import { HalfredBody } from "@/components/section/halfred";

export const metadata: Metadata = {
  title: "Halfred",
  description:
    "Automation and AI consultant for small and medium businesses, in La Colle-sur-Loup and remotely. Audit first, then the solution that fits your tools.",
  openGraph: {
    title: "Halfred",
    description:
      "Automation and AI consultant for small and medium businesses, in La Colle-sur-Loup and remotely. Audit first, then the solution that fits your tools.",
    images: halfredImage("og.jpg") ? ["/halfred/og.jpg"] : undefined,
  },
  alternates: {
    canonical: "/en/halfred/",
    languages: { fr: "/halfred/", en: "/en/halfred/" },
  },
};

/** Traduction fidèle de `/halfred/` : copie dans `HALFRED_EN`. */
export default function HalfredEnPage() {
  return <HalfredBody lang="en" />;
}
