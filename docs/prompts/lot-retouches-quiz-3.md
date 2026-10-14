# Lot : retouches quiz, série 3

## 1. Réponse sélectionnée : un seul contour

Aujourd'hui, une réponse sélectionnée (avant validation) affiche deux contours violets superposés : la bordure de l'état sélectionné plus un contour de focus décalé.

- Garder un seul contour : 2 px violet `#5B3FE0`, collé au bord du bouton, sur fond lavande `#E4DEFF`.
- Supprimer le contour de focus quand la sélection vient d'un clic ou d'un toucher.
- Garder un contour de focus visible uniquement pour la navigation au clavier (`:focus-visible`), et dans ce cas un seul contour aussi : celui de la sélection suffit s'il est déjà présent.
- Vérifier la même chose sur les cases carrées des questions à réponses multiples et dans le quiz flash.

## 2. Fin de quiz : reprendre la barre du haut du quiz

Aujourd'hui, la ligne « Quiz terminé · [titre du cours] » est centrée au milieu de l'écran, au-dessus de l'anneau.

- Ajouter en haut de l'écran de fin de quiz la même barre que pendant le quiz, à la même position et avec les mêmes marges (zone de sécurité iOS comprise) : bouton rond blanc à gauche, même taille que la croix du quiz.
- Dans ce bouton, une flèche retour vers la gauche à la place de la croix (le quiz est fini, on revient au thème).
- À la place de la barre de progression : le titre du cours en violet texte `#4A2FD0`, même taille et même graisse que le titre du cours affiché au-dessus de la question pendant le quiz. Une ligne, coupée par des points de suspension si trop long.
- Supprimer la ligne centrée « Quiz terminé · [titre] ». Mettre à la place, au-dessus de l'anneau, un petit libellé centré « Quiz terminé » en texte secondaire `#3B3550`.
- Destination du bouton retour :
  - quiz de cours : le détail du thème du cours ;
  - quiz flash : le dashboard.
- Les actions du bas ne changent pas (bouton principal, puis « Revoir mes erreurs » et « Passer à la checklist » quand ils s'appliquent).

## 3. Typographie

- Espace insécable avant « ? », « ! », « : » et « ; » partout où un texte de contenu est affiché (énoncés de questions, réponses, explications, titres de cours, leçon). Le plus simple : une petite fonction de formatage appliquée à l'affichage, qui remplace l'espace ordinaire avant ces signes par une espace fine insécable (U+202F). Cas constaté : « usage intensif ? » dans la liste des erreurs, où le « ? » part seul à la ligne.
- Retirer la césure automatique sur tous les titres (H1, titres de cours et de thème, questions de quiz) : `hyphens: manual`, et `text-wrap: balance` pour équilibrer les lignes. Cas constaté : « fonction-nement » dans l'en-tête de la leçon du split mural. Garder la césure sur le texte courant de la leçon.

Ne commite pas.
