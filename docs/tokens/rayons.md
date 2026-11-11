Statut : brouillon 3.0.0, validé le 11 novembre 2026 (critères v3, rangement `rayons2.md`). Tokens : `tokens/rayons.tokens.json`, créés à l'étape suivante. Ce fichier dit quel rôle prendre ; il ne recopie pas le code.

# Rayons

## 1. Sources

- Relevé de la prod : 186 déclarations, 17 valeurs, 104 en dur (`rayons0.md`).
- Critères de rattachement écrits avant le rangement (`criteres-rayons.md` v3).
- Rangement et décompte des changements (`rayons2.md`, `rayons3.md`).

## 2. Principe de construction

Le moins de rayons possible, pour que l'agent n'ait pas à choisir. Cinq rôles, une valeur chacun, la même à toutes les largeurs. Aucun seuil à 768 px.

Plancher : trois rôles de forme et deux rôles de niveau. Un bloc posé dans un autre est moins arrondi que lui.

## 3. Les cinq rôles

| Rôle | Token | Valeur | S'applique à |
|---|---|---|---|
| Pilule | `rayon-pilule` | 999 px | Élément dont les deux bouts sont des demi-cercles. Bouton, champ d'une ligne, pastille, filtre, barre de progression et son remplissage, entrée de tab bar. |
| Rond | `rayon-rond` | 999 px | Élément carré rendu circulaire. Bouton rond (Retour mobile, « … », « + », Fermer), initiales, repère d'étape, radio, icône dans un rond. |
| Case | `rayon-case` | 6 px | Case à cocher, repère « Bonne réponse » en plusieurs réponses. |
| Surface | `rayon-surface` | 30 px | Bloc posé directement sur le fond de la page, ou flottant au-dessus. Carte, en-tête de page, bloc de tête du dashboard, blocs d'introduction et « Plus qu'une étape », liste en carte, carte pointillée d'action, tab bar, modale, toast, menu déroulant, menu « … ». |
| Élément | `rayon-element` | 22 px | Bloc à fond ou à contour posé dans une Surface, à n'importe quelle profondeur. Ligne à fond, « À retenir », carte de question, entrée de menu, vignette, miniature, repère d'étapes, case de badge. |

Rond à 999 px et non à 50 % : le format DTCG 2025.10 n'accepte que px et rem pour une dimension. Sur un élément carré, 999 px donne le même cercle que 50 %. Sur un élément qui n'est pas carré, 50 % donnerait une ellipse, 999 px une pilule : l'ellipse n'est jamais voulue. Le Rond reste un rôle à part parce que sa condition est la forme carrée de l'élément, pas son rayon.

Surface > Élément, strictement (30 > 22).

## 4. Choisir le rôle

Dans cet ordre, on s'arrête à la première réponse.

1. C'est une case à cocher : Case. Un radio : Rond. La fonction du contrôle décide, même si le dessin actuel dit autre chose.
2. L'élément est carré et doit être circulaire : Rond.
3. Les deux bouts de l'élément sont des demi-cercles : Pilule. Ce rôle de forme passe avant le niveau (barre d'enregistrement desktop de Création de cours, bloc flottant, en Pilule).
4. Le bloc est posé directement sur le fond de la page, ou flotte au-dessus : Surface.
5. Le bloc est posé dans une Surface, à n'importe quelle profondeur : Élément.

Toujours des Éléments, où qu'ils soient posés : un choix de réponse présenté en ligne dans une liste de réponses (quiz, parcours, Création de cours), un champ multiligne, une image, une vidéo ou un tableau de contenu (leçon, énoncé, visionneuse).

Un choix présenté comme une carte posée sur la page reste une Surface (cartes de Choix du profil).

Le niveau d'imbrication décide, jamais la valeur actuelle ni la taille de l'élément. Deux Éléments imbriqués prennent la même valeur.

## 5. Variante Feuille (pas un rôle)

Modale et menu « … » sous 768 px, barre d'enregistrement mobile de Création de cours : `rayon-surface` sur les deux coins du haut, 0 en bas. Passer de Feuille à Pilule (barre d'enregistrement) ou à Surface (modale) au-dessus de 768 px est un changement de rôle ou de variante, pas un seuil de valeur.

## 6. Valeurs, pourquoi celles-là

Règle : la valeur qui fait le moins de changements visibles (écart de 4 px ou plus sur le rayon rendu), puis le moins d'éléments changés, parmi les valeurs existantes. Le rayon rendu vaut min(rayon, hauteur / 2).

- Surface 30 : 13 visibles, contre 15 à 28 et 31 à 32. Les en-têtes à 32 et à 36 y entrent ; 28 en éloignait dix.
- Élément 22 : 13 visibles, contre 20 à 20 et 38 à 16. À 16, les champs d'une ligne de Création de cours perdaient en plus leur forme de pilule.
- Case 6 : 1 visible. À 50 %, les cases du quiz et de Création de cours deviendraient rondes et passeraient pour des radios.
- En-tête de page en Surface, sans rôle à part : un rôle « Bloc d'ouverture » (32 / 36) reproduisait un palier créé pour limiter les changements, sans critère de fonction. Coût : 4 changements visibles de plus.

Total du chantier : 30 changements visibles, 51 discrets, 105 inchangés sur 186 déclarations.

Effets acceptés : miniature d'étiquette 64 × 44 en pilule ; vignettes de 48 px presque rondes ; entrées de menu de 44 px de haut en pilule au survol ; grand badge du « Prochain badge » vertical (148 px) qui passe de 32 à 22.

## 7. Règles d'usage

- Un composant lit toujours un token de rayon, jamais une valeur en dur ni une ancienne variable `--radius-*`.
- Un nouveau bloc prend le rôle de sa place, même si un voisin a une autre valeur aujourd'hui.
- Une vignette ou une image dans une Surface est un Élément, même quand elle touche le bord de la Surface.
- Les illustrations n'ont pas de rayon.
- La page `/design-system` suit les mêmes rôles.

## 8. Exemples sur Skillo

- Carte de thème de la page Cours : posée sur le fond, Surface (30), mobile comme desktop.
- Ligne de cours dans la liste d'un thème : bloc posé dans la carte, Élément (22).
- Réponse du quiz : choix en ligne dans une liste de réponses, Élément (22), alors que le quiz n'a pas de carte.
- Bloc encre de correction du quiz : posé sur le fond, Surface (30).
- Case de la modale « Assigner un cours » : case à cocher, Case (6), alors qu'elle était dessinée en rond.
- Entrée du menu « … » : posée dans le menu, Élément (22).
- Barre d'enregistrement de Création de cours : Feuille sur mobile, Pilule sur desktop.

## 9. Exemples non conformes

| Situation | Erreur plausible | Règle citée | Version conforme |
|---|---|---|---|
| Une carte de cours placée dans une colonne étroite sur mobile | Rayon réduit à 22 parce que la carte est petite | Section 4 : la taille ne décide jamais, la place oui | `rayon-surface`, la carte est posée sur la page |
| Un en-tête de page sur desktop | Rayon plus grand que les cartes pour le mettre en valeur | Section 2 : une valeur par rôle, aucun seuil | `rayon-surface` |
| Une case à cocher dans une liste de groupes | Case dessinée en rond pour aller avec les initiales voisines | Section 4, étape 1 : la fonction du contrôle décide | `rayon-case` |
| Une image dans une leçon | Rayon de la carte (30) parce qu'elle occupe toute la largeur | Section 4 : une image de contenu est toujours un Élément | `rayon-element` |

## 10. Conduite de l'agent

Si aucune étape de la section 4 ne donne un rôle, ou si deux étapes donnent deux rôles différents sans que l'ordre ne tranche, l'agent applique le rôle le plus probable, l'écrit « À trancher » dans son rapport avec sa raison, et n'ajoute aucun rôle ni aucun token.

## 11. Provisoire et hors chantier

- Bouton Fermer de la modale Mes badges (`.modal-fermer`, 8 px) : laissé tel quel. Il n'est pas carré, un Rond en ferait une ellipse. À régler au chantier mise en page en passant Mes badges sur le composant Modale.

## 12. Vérifications à l'écran

Captures avant / après à 320, 375 et 800 px, pleine page, comptes Nora et Michel. Regarder en priorité : menus (30) et leurs entrées (22), vignettes de 48 px, miniature d'étiquette, case de la modale d'assignation, en-têtes desktop (36 → 30), cartes de thème mobile (26 → 30).
