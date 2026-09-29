import type { Metadata } from "next";
import { ParcoursBody } from "@/components/section/parcours";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Placements, École 42 systems and networking projects, technical skills, education and languages.",
  alternates: {
    canonical: "/en/experience/",
    languages: { fr: "/parcours/", en: "/en/experience/" },
  },
};

export default function ExperiencePage() {
  return <ParcoursBody lang="en" />;
}
