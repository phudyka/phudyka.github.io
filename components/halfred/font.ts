import localFont from "next/font/local";

/**
 * General Sans (Indian Type Foundry, via Fontshare, ITF Free Font License :
 * usage web autorisé). Réservée aux titres du monde Halfred ; le corps reste en
 * Inter comme le reste du site.
 */
export const display = localFont({
  src: "./GeneralSans-Variable.woff2",
  variable: "--font-hr-display",
  weight: "200 700",
  display: "swap",
});
