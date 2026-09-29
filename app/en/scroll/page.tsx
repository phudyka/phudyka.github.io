import type { Metadata } from "next";
import { ScrollBody } from "@/components/section/scroll";

export const metadata: Metadata = {
  title: "The long read",
  description:
    "The same file, read like a magazine: an application in production, a network that closes under the cursor, a career.",
  alternates: {
    canonical: "/en/scroll/",
    languages: { fr: "/scroll/", en: "/en/scroll/" },
  },
};

/** Version anglaise de `/scroll/` : même corps, copie `COPY.en`. */
export default function ScrollPageEn() {
  return <ScrollBody lang="en" />;
}
