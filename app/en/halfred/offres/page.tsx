import type { Metadata } from "next";
import { OffresBody } from "@/components/section/halfred";

export const metadata: Metadata = {
  title: "Services and prices — Halfred",
  description:
    "Free scoping call, €350 audit, automations from €490, hosting at €39 a month: Halfred’s public prices.",
  alternates: {
    canonical: "/en/halfred/offres/",
    languages: { fr: "/halfred/offres/", en: "/en/halfred/offres/" },
  },
};

/** Traduction fidèle de `/halfred/offres/` : prix dans `OFFERS_EN`. */
export default function HalfredOffresEnPage() {
  return <OffresBody lang="en" />;
}
