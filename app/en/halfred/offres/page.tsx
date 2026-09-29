import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offers and pricing — Halfred",
  robots: { index: false },
  alternates: { canonical: "/en/halfred/" },
};

/** Pendant anglais de `app/halfred/offres/page.tsx`. */
export default function OffresRedirectEn() {
  return (
    <main id="contenu" className="mx-auto max-w-xl px-5 py-32 text-center">
      <meta httpEquiv="refresh" content="0; url=/en/halfred/#tarifs" />
      <p>
        Pricing has moved:{" "}
        <a href="/en/halfred/#tarifs" className="underline underline-offset-4">
          Halfred offers and pricing
        </a>
        .
      </p>
    </main>
  );
}
