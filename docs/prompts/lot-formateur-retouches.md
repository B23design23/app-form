# Lot : retouches espace formateur

Retours après test de `lot-formateur-listes.md` et `lot-formateur-creation.md`.

## 1. Largeur des pages (desktop)

Sur Mes cours, Mes groupes, Détail d'un cours et Détail d'un groupe, le contenu est plus large que la barre de navigation : le titre et les cartes dépassent à gauche et à droite. Toutes les pages formateur doivent utiliser exactement le même conteneur que le dashboard formateur (même largeur max, mêmes marges latérales). Le titre de page s'aligne comme « Bonsoir Michel » sur le dashboard. Réutilise le composant ou la classe du dashboard plutôt que d'en recréer un.

La page Créer / modifier un cours n'est pas concernée (elle n'a pas de barre de navigation), mais vérifie que sa largeur max reste à 1200 px.

## 2. Barre de navigation sur les pages de détail

Détail d'un cours et Détail d'un groupe s'affichent aujourd'hui sans barre de navigation (desktop) ni tab bar (mobile). Ce sont des pages de consultation, pas un mode concentré : affiche la barre du haut sur desktop et la tab bar sur mobile, avec l'onglet parent actif (Cours ou Groupes). Le lien « ‹ Mes cours » / « ‹ Mes groupes » reste sous la barre. Sur mobile, prévois la marge basse pour que la tab bar ne cache pas « Voir les N autres élèves » ni le dernier bloc.

Seul l'écran Créer / modifier un cours reste sans navigation.

## 3. Détail d'un cours

- **Bug de contenu** : l'en-tête du cours « Nettoyage du filtre climatisation » affiche seulement « Leçon », alors que le cours a un quiz et une checklist (la carte de Mes cours affiche bien « Leçon · Quiz · Checklist »). Utilise la même fonction que la carte de Mes cours.
- Ajoute le séparateur « · » entre le contenu (« Leçon · Quiz · Checklist ») et les pastilles de groupe.
- Petites cartes de la carte Avancement : le libellé passe au-dessus du chiffre (libellé 13 px texte secondaire, chiffre 28 px dessous), comme sur la maquette. Le libellé ne doit pas passer sur deux lignes en desktop : raccourcis-le en « Pas commencé (7 j) » si besoin.
- Le chiffre « Pas commencé » n'est en rouge erreur que s'il est supérieur à 0. À 0, il est en encre `#1E1A33`.
- Vérification : sur ce cours, 12 élèves sont « non commencés » mais « Pas commencé depuis 7 jours » vaut 0. Regarde les `created_at` de `cours_groupes` pour ce cours : ils ont probablement été remis à zéro par l'ancien bug de suppression/recréation. Si c'est le cas, dis-le-moi, ne corrige pas les données toi-même.
- **Mobile** : dans les en-têtes repliables (Leçon, QCM, Checklist terrain), la ligne d'info (« Cases à cocher · 4 étapes dont 1 bloquante ») passe sous le titre au lieu d'être à droite. Aujourd'hui « Checklist terrain » se coupe sur deux lignes. Le bouton chevron reste à droite, centré verticalement.

## 4. Détail d'un groupe (mobile)

- La rangée « Cours assignés » démarre collée au bord gauche de l'écran. La première carte doit être alignée sur la marge de 16 px de la page ; seul le bord droit déborde pour indiquer le défilement.
- Le lien « Voir les 4 autres élèves » est souligné, alors que les autres liens de l'app ne le sont pas. Retire le soulignement (desktop aussi).

## 5. Créer / modifier un cours

- **Barre d'enregistrement sans modification** : aujourd'hui, elle affiche une grande pilule blanche vide à gauche avec « Annuler » et « Enregistrer » à droite. Quand rien n'a changé : texte « Aucune modification » en texte secondaire à gauche, et « Enregistrer » à l'état désactivé (fond lavande `#E4DEFF`, texte `#3B3550`). Dès qu'un champ change, on repasse à « Modifications non enregistrées » avec le point orange et le bouton violet.
- Vérifie que la barre est bien fixée en bas de l'écran pendant le défilement (sur les captures pleine page, elle apparaît au milieu de la leçon, ce qui vient peut-être seulement de la capture).
- **Mobile, intitulés d'étapes de checklist** : un intitulé long est coupé en hauteur (« Nettoyer le filtre à l'eau tiède ou à l'aspirateur » est tronqué au milieu de la deuxième ligne). Le champ doit grandir avec le texte (textarea à hauteur automatique, 1 ligne minimum), rayon 20 px au lieu de la pilule dès qu'il passe sur deux lignes.

Ne commite pas.
