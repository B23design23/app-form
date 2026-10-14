# Lot : retouches Cours, recherche et Terrain

Corrections après test sur capture du lot `lot-cours-terrain.md`. Ne change que ce qui est décrit ici. Ne commite pas.

## 1. Pastilles de statut : retirer le point

Dans le composant de pastille de statut partagé, supprime le petit rond placé avant le texte (« En cours », « Nouveau », « À faire », « Non commencé »). La couleur et le mot suffisent. La mention « Terminé » garde sa coche, qui n'est pas concernée.

## 2. Alignement des lignes sur plusieurs colonnes (desktop)

Concerne le bloc « De ton formateur » de la page Cours, et la liste du Mode terrain en desktop. Quand un titre passe sur 2 ou 3 lignes, les éléments voisins se décalent parce que chaque ligne centre son contenu verticalement.

- Aligne le contenu de chaque ligne en haut : la vignette, le bloc texte (titre + pastille ou sous-ligne) et le statut démarrent au même niveau.
- Le chevron reste centré verticalement sur la vignette (pas sur toute la hauteur de la ligne).
- Dans la grille, les cellules d'une même rangée s'alignent en haut, pas au centre.

Résultat attendu : les titres d'une même rangée sont toujours à la même hauteur, quelle que soit leur longueur.

## 3. Résultats de recherche (page Cours)

Remplace l'affichage actuel des résultats (grille de cartes avec étiquettes Leçon / Quiz / Checklist).

- Recherche déclenchée à partir de 2 caractères. En dessous, la page reste dans son état normal.
- Pendant une recherche, masque le bloc « De ton formateur » et la grille des thèmes. Les cours du formateur qui correspondent apparaissent dans les résultats.
- Titre de la section : « N résultats » (« 1 résultat » au singulier), h2 22 px mobile, 28 px desktop.
- Les résultats sont des lignes dans une seule carte blanche (rayon 28 px), séparées par `#EFE9E0`, sur le même modèle que les lignes du Mode terrain :
  - vignette crème de 48 px (52 px desktop) avec l'objet 3D du thème du cours (36 px / 38 px) ;
  - titre du cours, 15 px (16 px desktop), graisse 800 ;
  - dessous, en 13 px texte secondaire : libellé court du thème, puis le contenu du cours, le tout séparé par des points médians. Exemple : « Installation · Leçon · Quiz · Checklist ». Pour un cours assigné par le formateur, « De ton formateur » remplace le libellé du thème ;
  - statut : seulement « En cours » (pastille violette) ou la mention « Terminé ». Rien si non commencé ;
  - chevron, centré sur la vignette.
- Supprime les étiquettes lavande Leçon / Quiz / Checklist.
- Desktop : la carte répartit les lignes sur 2 colonnes (écart de 40 px), avec l'alignement en haut du point 2.
- Aucun résultat : à la place de la carte, le texte « Aucun cours ne correspond à « [recherche] ». » centré, 15 px, texte secondaire.
- Vider le champ ramène la page dans son état normal.

## 4. Mode terrain mobile : marge basse

Vérifie que la dernière ligne de la liste reste entièrement visible au-dessus de la tab bar quand on scrolle tout en bas. Sinon, ajoute en bas de page une marge au moins égale à la hauteur de la tab bar plus 20 px. Applique la même règle aux pages Cours et Détail d'un thème si elles ont le même problème.

## 5. À la fin

Mets à jour le CLAUDE.md du dépôt (affichage de la recherche, alignement en haut des lignes multi-colonnes, pastilles sans point). Liste les fichiers modifiés. Ne commite pas.
