import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offres et tarifs — Halfred",
  robots: { index: false },
  alternates: { canonical: "/halfred/" },
};

/**
 * Ancienne adresse de la grille, fondue dans `/halfred/#tarifs` le 2026-09-29.
 * GitHub Pages ne sait pas rediriger côté serveur : un refresh HTML le fait,
 * et le lien sert à qui l'a désactivé.
 */
export default function OffresRedirect() {
  return (
    <main id="contenu" className="mx-auto max-w-xl px-5 py-32 text-center">
      <meta httpEquiv="refresh" content="0; url=/halfred/#tarifs" />
      <p>
        La grille a déménagé&nbsp;:{" "}
        <a href="/halfred/#tarifs" className="underline underline-offset-4">
          offres et tarifs de Halfred
        </a>
        .
      </p>
    </main>
  );
}
