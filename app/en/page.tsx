import type { Metadata } from "next";
import { HomeBody } from "@/components/section/home";
import { SITE_EN } from "@/data/content.en";

export const metadata: Metadata = {
  title: "Web & mobile developer",
  description: SITE_EN.description,
  alternates: { canonical: "/en/", languages: { fr: "/", en: "/en/" } },
  openGraph: {
    title: SITE_EN.title,
    description: SITE_EN.description,
    url: SITE_EN.url,
    locale: "en_GB",
    type: "profile",
  },
};

export default function HomeEn() {
  return <HomeBody lang="en" />;
}
