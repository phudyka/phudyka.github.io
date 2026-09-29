import type { Metadata } from "next";
import { HomeBody } from "@/components/section/home";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { fr: "/", en: "/en/" } },
};

/**
 * L’accueil présente un candidat, plus une prestation.
 *
 * Le site vendait Halfred dès la première ligne. Un recruteur arrivant par un
 * CV tombait sur « Vos équipes passent des heures sur des tâches qu’un agent
 * peut reprendre » — une phrase qui ne lui parle pas, et qui l’oblige à
 * chercher ailleurs ce qu’il est venu lire. Le chemin commercial n’a pas
 * disparu : il vit sous `/halfred/`, où un dirigeant
 * arrive par le lien ou par la recherche, et où les prix restent publics.
 */
export default function Home() {
  return <HomeBody lang="fr" />;
}
