import type { Metadata } from "next";
import Redirect from "@/components/redirect";

export const metadata: Metadata = {
  title: { absolute: "Halfred" },
  robots: { index: false },
  alternates: { canonical: "https://halfred.pages.dev/" },
};

/** Halfred vit sur son propre site depuis le 2026-10-01. */
export default function HalfredRedirect() {
  return <Redirect to="https://halfred.pages.dev/" label="Le site de Halfred a déménagé" />;
}
