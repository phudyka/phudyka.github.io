import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import DockNav from "@/components/dock-nav";
import { SITE } from "@/data/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s — Paul Hudyka" },
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "fr_FR",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: { languages: { fr: "/", en: "/en/" } },
};

/*
  Amorce de langue, exécutée avant la peinture.

  Deux rôles, et un seul script parce qu'ils partagent la même lecture du
  chemin :

  1. Poser `lang` sur <html>. L'export statique n'a qu'une racine, donc l'attribut
     y est écrit en dur en `fr` ; sans cette correction, un lecteur d'écran
     annoncerait les pages /en/ avec une prononciation française.

  2. Rediriger un visiteur non francophone vers la version anglaise, **une seule
     fois**, et jamais s'il a déjà choisi sa langue au bouton. Sans ces deux
     gardes, quelqu'un dont le navigateur est en anglais mais qui veut lire le
     français serait renvoyé à chaque rechargement.

  La redirection ne s'applique qu'aux pages qui ont une paire : /halfred/offres/
  n'a pas d'équivalent anglais et reste donc en place.
*/
const AMORCE_LANGUE = `(function(){try{
var p=location.pathname.replace(/\\/*$/,"/")||"/";
var en=p==="/en/"||p.indexOf("/en/")===0;
document.documentElement.lang=en?"en":"fr";
if(en)return;
if(localStorage.getItem("lang"))return;
if(sessionStorage.getItem("lang-auto"))return;
var l=(navigator.language||"fr").toLowerCase();
if(l.indexOf("fr")===0)return;
var m={"/":"/en/","/halfred/":"/en/halfred/","/poolcenter/":"/en/poolcenter/","/parcours/":"/en/experience/"};
var to=m[p];
if(!to)return;
sessionStorage.setItem("lang-auto","1");
location.replace(to);
}catch(e){}})();`;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e11" },
  ],
};

/*
  Contrat de direction — il survit au build de production (rendu en commentaire HTML,
  premier nœud du body) et se relit à chaque édition de cette page.
*/
const DIRECTION_CONTRACT = `
  THESIS : ce site vend une prestation par la densité d’un CV, pas par le théâtre
  d’une landing. L’offre se lit en lignes chiffrées, alignées à droite ; la
  grille de tuiles n’est admise que pour un périmètre fonctionnel déjà écrit
  (PoolCenter), jamais pour vendre, et jamais avec des icônes décoratives.
  OWN-WORLD : neutres oklch sombres par défaut, un seul orange porteur, bordures 1px,
  colonne unique max-w-2xl, Inter en corps, JetBrains Mono réservé aux chiffres,
  références et dates. Aucun dégradé de texte, aucune surcouche de verre décorative.
  STORY : un dirigeant de PME comprend en dix secondes qu’un indépendant installe
  l’IA dans ses process sans que ses données sortent, voit un client réel nommé,
  lit les prix sans les demander, et écrit.
  FIRST VIEWPORT : nom et photo en vis-à-vis, une phrase de résultat métier, la
  garantie de topologie en second, puis les deux activités en deux blocs liés ;
  l’action « Demander un devis » clôt chaque page.
  FORM : le standard de la catégorie, choisi délibérément par le client contre les
  mondes tirés (clé de tirage a6507cb4, sortie canon). Barre de finition : Linear,
  Vercel, Stripe. Forme empruntée à magicuidesign/portfolio.
  FINISH : unreviewed and undocumented is unfinished; this build ends with the
  finish review, the verdict, and DESIGN.md
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        {
          /* Sans JavaScript, les révélations resteraient à opacité 0. La règle
            vit dans `globals.css` ; ce `<noscript>` en est le seul déclencheur,
            et il ne coûte rien quand le script tourne. */
        }
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: "[data-blur-fade]{opacity:1!important;animation:none!important}",
            }}
          />
        </noscript>
        <script dangerouslySetInnerHTML={{ __html: AMORCE_LANGUE }} />
        <div
          hidden
          dangerouslySetInnerHTML={{ __html: `<!--${DIRECTION_CONTRACT}-->` }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
          >
            Aller au contenu
          </a>
          <div aria-hidden className="side-grid" />
          {children}
          <DockNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
