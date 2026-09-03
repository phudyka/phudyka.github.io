---
target: public/scroll/index.html
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 3
p1_count: 6
timestamp: 2026-09-03T12-19-04Z
slug: public-scroll-index-html
---

Method: tri-agent (A revue design · B détecteur et preuves navigateur · C audit
technique), synthèse et re-vérification par le parent.

## Design Health Score

| #     | Heuristique               | Note           | Problème clé                                                                                                |
| ----- | ------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| 1     | Visibilité de l'état      | 3              | Pendant le pin de 4,6 écrans, rien n'indique la durée de la retenue                                         |
| 2     | Correspondance monde réel | 3              | La métaphore du paquet est excellente, mais `net_internal`, `FilterDefaultDeny` supposent un lecteur Docker |
| 3     | Contrôle et liberté       | 2              | Aucune route vers l'action avant la fin ; sur mobile la page déborde et clippe                              |
| 4     | Cohérence et standards    | 2              | Deux identités sous un domaine ; 31 apostrophes droites, 0 courbe, 0 insécable                              |
| 5     | Prévention des erreurs    | 3              | Surface minuscule, mais adresse en clair non cliquable, pas de sujet pré-rempli                             |
| 6     | Reconnaissance vs rappel  | 2              | Les blocs de code exigent de se rappeler le schéma quitté ; rien ne les relie                               |
| 7     | Flexibilité et efficacité | n/a            | Surface Experience linéaire, à lecture unique                                                               |
| 8     | Esthétique et minimalisme | 3              | Retenue réelle, mais des vides qui lisent comme des accidents                                               |
| 9     | Diagnostiquer les erreurs | 2              | Sans JS, plus aucun moyen de contacter Paul                                                                 |
| 10    | Aide et documentation     | n/a            | Page linéaire autoportante                                                                                  |
| Total |                           | 20/32 (62,5 %) | Acceptable                                                                                                  |

## Audit Health Score

| #     | Dimension     | Note | Trouvaille clé                                                                       |
| ----- | ------------- | ---- | ------------------------------------------------------------------------------------ |
| 1     | Accessibilité | 2    | Traits porteurs de sens du schéma à 2,35:1 ; casse à 200 % de zoom                   |
| 2     | Performance   | 2    | rAF et getComputedStyle à 60 Hz en permanence, schéma hors écran                     |
| 3     | Responsive    | 1    | 740 px de contenu dans 320 px de fenêtre, clippé                                     |
| 4     | Thématisation | 2    | Aucun thème clair, color-scheme absent, 6 fonds codés en dur                         |
| 5     | Intégrité     | 2    | Dérive vérifiée sur 6 axes du système du site, captures produit refusées par contrat |
| Total |               | 9/20 | Faible                                                                               |

## Verdict de spécificité

Spécifique par un fil, générique par système. Le schéma de topologie et le
curseur-paquet ne peuvent servir personne d'autre. Tout le reste, noir
presque-noir, ambre, grain, Archivo condensé, folio vertical, chapitres
numérotés, est le costume standard du portfolio de dev sérieux. La page est
spécifique là où elle est technique, interchangeable là où elle est humaine.

## Problèmes prioritaires

P0-1 Débordement clippé sur téléphone. `.title__clock` mesure 720 px dans un
parent de 390. `body { overflow-x: clip }` supprime la barre : le contenu est
perdu. Le pitch entier est invisible. P0-2 Schéma illisible à 390 px. Libellés à
8,3 px CSS, `.t-soft` à 6,8 px. L'argument de la page est décoratif sur mobile.
P0-3 Chevauchement à 200 % de zoom texte. `.topo__lines` en absolute avec
min-height deviné. P1-1 L'accroche se contredit pour un lecteur parisien. Deux
horloges identiques côte à côte. P1-2 Le pic n'a pas l'amplitude d'un pic. Titre
en 2xl contre 3xl pour ses voisins. P1-3 Sans JS, page muette et contact perdu.
`[data-sc-in]{opacity:0}` sans noscript. P1-4 Boucles jamais arrêtées. rAF à 60
Hz plus setInterval de 50 ms, sans garde d'intersection. P1-5 Captures produit
refusées par le contrat du site. P1-6 Traits du schéma sous 3:1. P2 div non
fermée, aucun landmark, SVG inaccessible au clavier, horloge sans aria-live,
aucune balise Open Graph, chapitre II sans intertitre visible.
