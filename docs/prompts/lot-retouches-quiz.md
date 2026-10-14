# Lot : retouches quiz, quiz flash et dashboard

Suite aux captures du lot fiche de cours. Tokens existants uniquement.

## 1. Dashboard : l'objet 3D recouvre le titre

Sur le bloc de tête (mobile et desktop), l'objet qui déborde passe par-dessus le titre du cours quand la pastille « De ton formateur » est présente ou que le titre est long.

- La réserve à droite (110 px mobile, 180 px desktop) doit s'appliquer à toute la colonne de texte du bloc : pastille, « Tu en es là », titre et phrase de progression. Aucun texte ne doit passer sous l'objet.
- Sur desktop, porter la réserve à 220 px : l'objet y est plus grand.
- Titre toujours limité à 3 lignes, avec points de suspension au-delà.
- Vérifier avec le titre « Nettoyage du filtre climatisation » et la pastille formateur.

## 2. Réponses de QCM (quiz de cours et quiz flash)

### Mise en page

- Supprimer la carte blanche autour de la question et des réponses. Le libellé du cours, la question (24 px, 800) et les réponses se posent directement sur le fond crème de la page.
- Les réponses deviennent des boutons blancs `#FFFFFF`, rayon 20 px, hauteur minimale 56 px, sans contour au repos, texte 16 px 600 encre.
- Desktop : colonne centrée de 680 px de large maximum pour la question, les réponses, le bloc de correction et le bouton.

### Repère du type de question

Chaque réponse a un contrôle à gauche, 22 px :
- Réponse unique : rond, contour 2 px `#D9D2C6`.
- Réponses multiples : carré à coins arrondis (6 px), contour 2 px `#D9D2C6`. Sous la question, ajouter en 14 px 700 `#5C566E` : « Plusieurs réponses possibles ».

### États avant validation

- Survol : fond lavande `#E4DEFF`.
- Sélectionnée : fond lavande `#E4DEFF`, contour 2 px violet `#5B3FE0`. Le rond devient violet plein avec un point blanc au centre, le carré devient violet plein avec une coche blanche.
- Focus clavier : contour 2 px violet décalé de 2 px.

### États après validation (inchangés sur le fond, adaptés au nouveau socle)

- Réponse choisie fausse : fond `#FDE3E1`, contour 2 px `#B4232A`, pastille « Ta réponse » avec croix.
- Bonne réponse : fond `#DFF3E7`, contour 2 px `#17663F`, pastille « Bonne réponse » (ou « Ta réponse » si choisie) avec coche.
- Autres réponses : fond blanc, texte `#5C566E`, opacité normale, sans pastille.
- Le contrôle de gauche disparaît après validation : la pastille porte le statut.

## 3. Quiz flash : même composant que le quiz de cours

Remplacer l'écran actuel du quiz flash par le composant du quiz de cours :
- En-tête mode concentré : croix « Quitter le quiz flash » (retour au dashboard), barre de progression, compteur « 9 / 10 ». Pas de titre « Quiz flash » en H1.
- Au-dessus de chaque question, le libellé violet indique le cours d'origine de la question.
- Mêmes réponses (section 2), même bloc de correction encre (« Raté, mais tu vas retenir ça » / « Bien vu », lien « Revoir la leçon » qui ouvre la leçon du cours d'origine), même bouton « Question suivante ».
- Pas de compteur « X bonnes réponses sur Y » pendant le quiz.

## 4. Fin du quiz flash : même écran que la fin de quiz de cours

- Fond lavande, anneau « 3/10 » et pourcentage, libellé « Quiz flash terminé ».
- 50 % et plus : confettis, titre selon le score (mêmes paliers), pastille « +30 XP », carte badge « Éclair » si débloqué. Bouton principal « Retour à l'accueil », lien « Revoir mes erreurs ».
- Moins de 50 % : pas de confettis, titre « Tu y es presque », sous-titre « 5 bonnes réponses pour gagner 30 XP. », pas de pastille XP. Bouton principal « Relancer un quiz flash », liens « Revoir mes erreurs » et « Retour à l'accueil ».

## 5. Mise en page de la fin de quiz (cours et flash)

- Contenu dans une colonne centrée de 420 px de large maximum, sur mobile comme sur desktop. Le bouton principal fait la largeur de cette colonne, plus la largeur de l'écran.
- Desktop : contenu centré verticalement dans l'écran.
- Espacements : 16 px entre le libellé et l'anneau, 28 px entre l'anneau et le titre, 8 px entre le titre et le sous-titre, 20 px avant la pastille XP, 32 px avant la carte badge ou le bouton principal, 8 px entre le bouton et les liens.
- Liens secondaires sur une seule ligne quand il y en a deux, séparés par 24 px.

## 6. Leçon d'un cours déjà terminé

Remplacer le bouton contour pleine largeur « Voir le récap du cours » par la carte encre « Étape suivante » existante :
- petit libellé « Cours terminé » ;
- titre « Tu as tout bouclé » ;
- détail « Score, checklist et cours suivant » ;
- bouton blanc avec flèche « Voir le récap ».

Mets à jour CLAUDE.md. Ne commite pas.
