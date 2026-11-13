Statut : brouillon 3.0.0, validé le 12 novembre 2026 (critères `criteres-mep.md` v2, rangement `mep2.md`). Pas de token : les valeurs de ce fichier sont des dimensions de mise en page, écrites en px dans le composant avec un commentaire qui renvoie à la section (section 9). Ce fichier dit quelle largeur, quel seuil et quel comportement prendre ; il ne recopie pas le code.

# Mise en page

## 1. Sources

- Relevé de la prod : largeurs de colonne, seuils, ancres, débordements, champs et états de page (`mep0.md`, `mep0.csv`).
- Visuels avant / après qui ont servi aux décisions (`mep1v.md`, `mep1v2.md`, `mep3v.md`).
- Critères de rangement (`criteres-mep.md` v2, avec sa partie « Cas de mep2 tranchés »), rangement et plan (`mep2.md`).

## 2. Choisir

**La fonction de l'écran décide de sa largeur et de son comportement, jamais la largeur actuelle.** Deux écrans qui font la même chose (lire, répondre, remplir un formulaire) ont la même largeur de colonne, où qu'ils soient.

Le moins de valeurs possible, pour que l'agent n'ait pas à choisir : un rôle par fonction, un seul seuil de mise en page (768 px, section 4), une seule valeur pour le haut du contenu (section 5).

## 3. Largeurs de colonne

| Rôle | Valeur | Ce qu'il borne | Écrans |
|---|---|---|---|
| **Page** | 1040 px | la colonne des pages avec navigation (Conteneur de page) | dashboards, Cours, Terrain, Mes cours, Mes groupes, Détail cours, Détail groupe |
| **Lecture** | 880 px de **contenu** | le texte à lire ; la colonne compte son padding en plus | leçon, checklist et récap de la fiche de cours ; Détail d'un thème |
| **Question** | 680 px | la question et ses réponses, une à la fois | quiz et quiz flash, barre d'action du quiz, haut de la fin de quiz |
| **Formulaire** | 440 px | un formulaire court ou un message seul | parcours d'entrée, Mot de passe oublié, Nouveau mot de passe, chargement de l'app, colonne et actions de la fin de quiz |

- **Toutes les colonnes sont centrées.**
- **Lecture compte le contenu, pas la colonne.** Une colonne qui porte un padding (Détail d'un thème, dans le Conteneur de page) fait 880 + son padding, pour que le texte ait la même largeur que dans la leçon.
- **Exception écrite** : Création de cours, 1200 px, avec son seuil de 1024 px (section 8).
- **Hors de ce fichier** : les largeurs des modales et du toast (composants).
- **Bornes internes** : les bornes de texte posées dans un bloc (200 à 210 px dans les blocs du dashboard, 180 px pour les en-têtes du tableau du Détail groupe) et la largeur du champ de recherche de l'en-tête lavande (480 px) ne sont pas des colonnes. Elles restent telles quelles. La réserve à droite de ce champ (`100 % − 200 px`) relève de la réserve de l'illustration (`espacements.md`, section 8).
- **Axe de la réserve d'une illustration** : la réserve s'applique sur l'axe où l'illustration rencontre l'élément. Sous 768, l'objet de l'en-tête lavande est en haut à droite : la recherche commence sous lui (réserve verticale, égale à son emprise). À partir de 768, l'objet est centré sur toute la hauteur : la réserve est horizontale (200).

## 4. Seuils

- **768 px est le seul seuil de mise en page**, comme pour la typographie (`typographie.md`). Sous 768 : mobile ; à partir de 768 : desktop.
- **Grilles de cartes.** Sous 768, rien ne change. À partir de 768, colonnes automatiques avec une largeur minimale de carte, écart inchangé (Répétition, `espacements.md`) :

  | Grille | Largeur minimale d'une carte | Rendu |
  |---|---|---|
  | Thèmes de la page Cours | 210 px | 3 colonnes à 800, 4 dès 1040 |
  | Mes groupes | 300 px | mêmes colonnes qu'avant aux largeurs relevées : 2 à 800 et 1040, 3 à 1100 et 1200 |
  | Grille de la page `/design-system` | 240 px (choisie pour garder les colonnes à 1200) ; la carte large garde ses deux colonnes | 2 colonnes à 800, 3 à 1040, 4 à 1200 |

  Aucune grille de cartes n'a de seuil à elle : le nombre de colonnes vient de la largeur minimale.
- **Grille de la modale Mes badges** (décision du 13/11) : colonnes automatiques à toutes les largeurs. Règle : la largeur minimale d'une tuile est la largeur du libellé de badge le plus long sur une ligne (Titre de ligne, arrondie au px pair supérieur) + le padding Élément des deux côtés (2 × 16) + la bordure de mise en évidence des deux côtés (2 × 2). Valeur actuelle : **132 px** (« Sur le terrain », 94,4 px arrondi à 96). Rendu actuel : 1 colonne à 320, 2 à 375, 3 à partir de 800 (modale standard de 520). Pas de seuil à elle, pas de padding réduit. Un badge ajouté dont le nom est plus long change la valeur, pas la règle.
- **Une règle à 768 qui change une dimension de mise en page est permise** : marges de page desktop, réserves, nombre de colonnes, disposition (en ligne ou empilé).
- **Une règle à 768 qui change la valeur d'un rôle d'espacement est une dérive**, sauf exception écrite dans `espacements.md`, section 9 (Retour chevron seul, tab bar). Les rôles d'espacement n'ont pas de seuil (`espacements.md`, section 3).
- **Autres seuils** : exceptions écrites seulement (section 8).

## 5. Haut du contenu et ancres

- **Le haut du contenu** d'une page avec navigation : **104 px** sur desktop (sous la barre du haut), **zone de sécurité + 20 px** sur mobile.
- **Une cible d'ancre s'arrête au même endroit que le haut du contenu** : 104 px sur desktop, zone de sécurité + 20 px sur mobile. La barre du haut ne la recouvre jamais, et sur mobile (barre en bas) elle n'a pas de réserve en trop.
- **Une seule source pour 104** : la valeur est déclarée une fois, dans le Conteneur de page, et lue par le haut du contenu, par la fiche de cours avec la barre du haut et par toutes les cibles d'ancre. Dimension de mise en page commentée (section 9).
- Vaut pour toute cible d'ancre (aujourd'hui « De ton formateur » de la page Cours, atteint par « Tout voir » du dashboard).
- **Exception écrite** : Création de cours garde ses propres valeurs d'arrêt, liées à sa rangée collante (section 8).

## 6. Colonnes de lignes

Une liste de lignes (`LigneCours`, `BlocFormateur`) se met en colonnes sur desktop. **Le nombre de colonnes dépend du type de ligne**, comme la largeur minimale d'une carte dépend de la grille (section 4).

| Type de ligne | Sous 768 | À partir de 768 | Écrans |
|---|---|---|---|
| Pastille **sous** le titre | 1 colonne | colonnes automatiques, **260 px minimum** (2 colonnes à 800, 3 dès 1040) | « De ton formateur » de la page Cours |
| Pastille **à côté** du titre | 1 colonne | **2 colonnes**, nombre fixe | Mode terrain, résultats de recherche |

- Écart entre colonnes : **Colonnes** (40 px, `espacements.md`).
- **Raison du nombre fixe** : la pastille posée à côté du titre lui prend de la largeur. À 272 px de colonne, un titre avec la pastille « En cours » passe sur 5 ou 6 lignes (`mep3v.md`). Un minimum de 300 px donnerait le même rendu qu'un nombre fixe de 2, avec 1 px de marge seulement (une 3e colonne demande 299 px à 1200).

## 7. Rangées de contrôles

- **Une rangée de contrôles** (filtres, outils, boutons) **passe à la ligne quand elle ne tient pas.** Elle ne défile pas et ne déborde pas.
- **Seules les rangées de cartes défilent** (`espacements.md`, section 6).
- Filtres d'Activité récente : à la ligne ; la recherche passe sous les filtres si la rangée ne tient pas.
- Barre d'outils de l'éditeur de Création de cours : à la ligne.
- Rangée des CTA du dashboard formateur : à la ligne (`espacements.md`, section 7, Bouton).
- **Exception écrite** : pastilles collantes du sommaire mobile de Création de cours (section 8).

## 8. Exceptions écrites

Une exception est attachée à son écran ou à son composant. Elle se signale, elle ne sert pas de modèle.

| Où | Exception | Raison |
|---|---|---|
| Création de cours | Colonne de **1200 px** et seuil de **1024 px** (grille éditeur + sommaire) ; valeurs d'arrêt de défilement propres, liées à la rangée collante | Un seul écran, deux colonnes de mise en page qui ne tiennent pas à 768 |
| Création de cours, sommaire mobile (`.cc-pastilles`) | Les pastilles collantes **défilent** au lieu de passer à la ligne | Rangée de navigation collante : la passer à la ligne réduirait la zone de contenu. Un seul endroit |
| Introduction, écran bas | Sous **667 px de haut** (`max-height: 666px`) : voir ci-dessous | Les trois slides doivent tenir sans défiler à 320 × 568 |
| Taux de complétion (dashboard formateur) | Seuil de **399 px** | Provisoire, chantier composants |

**Introduction sur un écran bas.** Sous 667 px de haut seulement :
1. la zone d'action descend au plus bas : bas à **zone de sécurité + 8 px**, **sans réduire la rangée des points** (zone tactile de 44 px gardée) ;
2. la barre « Passer » / logo remonte à **zone de sécurité + 8 px** du haut ;
3. l'écart entre le bloc lavande et le titre passe en **Deux textes d'un groupe** (4 px) ;
4. le bloc lavande se réduit jusqu'à ce que les trois slides tiennent à 320 × 568 (environ 82 px), son illustration à l'échelle.

« Suivant » garde la même place sur les trois slides. La police ne change pas.

## 9. Écriture d'une valeur

Les valeurs de ce fichier sont des **dimensions de mise en page** : pas de token. Elles s'écrivent en px dans le composant, avec un commentaire qui renvoie à la section, par exemple `/* mise-en-page.md, section 3 : colonne Lecture, 880 de contenu */` ou `/* mise-en-page.md, section 8 : Introduction, écran bas */`. **Jamais un primitif `espace-N`** à la place d'une largeur ou d'un seuil.

## 10. Conduite de l'agent

Si aucune règle de ce fichier ne s'applique (une largeur de colonne pour une fonction nouvelle, un seuil qui semble nécessaire, une rangée qui ne rentre dans aucun cas), l'agent construit le reste de l'écran, écrit « À trancher » dans son rapport avec la règle la plus proche et sa raison, et propose. **Il n'ajoute ni seuil, ni largeur, ni exception.**
