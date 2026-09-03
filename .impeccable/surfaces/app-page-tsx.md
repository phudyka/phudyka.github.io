---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: [
  "app/halfred/page.tsx",
  "app/poolcenter/page.tsx",
  "app/parcours/page.tsx",
]
---

# Portfolio commercial — accueil et pages d'activité

**Portée** : `/`, `/halfred/`, `/poolcenter/`, `/parcours/`. Mode visiteur :
**Persuade**.

**Audience** : dirigeant ou décideur de PME/TPE, non technique, arrivé par
recommandation ou après un appel, souvent sur mobile. Audience secondaire :
profils techniques qui vérifient le niveau via GitHub. Aucun objectif de
recrutement.

**Tâche** : comprendre en quelques secondes que Paul installe de l'IA dans des
process sans que les données sortent, et entrer en contact. Action primaire sur
chaque page : « Demander un devis ».

**Preuve** : ETS Maria, seul prospect, nommé avec son secteur, son statut réel
— devis émis, rien de signé — et ce qui est construit. Prix publics des quatre offres Halfred. Identité légale complète en
pied de page. PoolCenter annoncé en bêta privée. Aucun témoignage, aucun logo
client, aucun chiffre de ROI : il n'en existe pas.

**Contraintes** : export statique Next.js sur GitHub Pages, donc aucun backend ;
le formulaire exige un service tiers et les variables `NEXT_PUBLIC_*` sont
figées au build. Contenu en français, vouvoiement.

**Direction choisie** : le standard de la catégorie, joué droit — le client a
écarté tous les mondes tirés et pris la sortie canon. Barre de finition nommée
par lui : Linear, Vercel, Stripe. La forme est empruntée à
`magicuidesign/portfolio` : colonne unique étroite, sections empilées,
révélations en blur-fade échelonnées, dock de navigation flottant, tokens
neutres en oklch avec thème clair et sombre.

**Moment mémorable** : la pose du nom au chargement — révélation plus lente et
plus floue que l'entrée ambiante des sections, seule orchestration de la page.

**Ce qui est délibérément refusé** : la grille de cartes icône-titre-texte comme
structure ; l'offre se lit en lignes chiffrées alignées à droite, dans la
grammaire du CV dense. Aucune capture d'écran de produit — choix explicite du
client.

**Décisions non tranchées** : arbitrage entre formulaire sans adresse exposée et
affichage de contact.halfred@gmail.com (les deux ont été retenus) ; URL LinkedIn
et lien de prise de rendez-vous non fournis ; endpoint du formulaire inexistant
; CV non publié faute de version 2026 ; publication de Peep comme réalisation
nommée non confirmée.
