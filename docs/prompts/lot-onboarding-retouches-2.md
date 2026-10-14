# Lot : retouches onboarding, série 2

## 1. Slide 1 : logo

Le grand logo de la slide 1 paraît coupé.
- Vérifie qu'aucune marge négative ne fait remonter le logo sous la ligne de « Passer », et qu'aucun conteneur parent n'a `overflow: hidden` qui le rogne. Le logo vient sous la ligne de « Passer », sans chevauchement, avec 8 px d'écart.
- « Passer » reste sur la slide 1 : c'est la slide où l'utilisateur pressé veut sauter l'intro.
- Si le logo est entier et que l'effet « coupé » vient de la piste lavande de l'anneau, trop pâle sur le fond crème : passe la piste de l'anneau à `#D6CCFF` sur fond crème (le reste du logo ne change pas). Dis-moi laquelle des deux causes c'était.

## 2. Connexion : logo

Ajoute le petit logo sur l'écran Connexion, centré horizontalement dans la ligne du bouton retour (bouton rond à gauche, logo au centre de l'écran, rien à droite). C'est un point d'entrée direct pour un utilisateur qui revient : il doit voir où il est. Même chose sur desktop, dans la colonne.

## 3. Desktop : bouton trop bas

Sur desktop, le bouton est collé en bas de la fenêtre et le lien sous le bouton est coupé (Connexion, Création du compte).
- À partir de 768 px, le bouton n'est plus ancré en bas de la colonne : il suit le contenu, 32 px sous le dernier élément (champ, aide ou liste de choix), et le lien secondaire 8 px sous le bouton.
- La colonne de 440 px est centrée verticalement dans la fenêtre si elle tient, sinon calée en haut avec 48 px de marge, et la page défile. Rien ne doit être coupé en bas.
- Sur mobile, ne change rien : le bouton reste fixe en bas de l'écran.

## 4. Champs texte : contour coupé sur les côtés

Le contour violet du champ Prénom (au focus) est rogné à gauche et à droite.
- Supprime toute marge négative sur les champs : le champ fait exactement la largeur de la colonne, aligné sur le titre et le libellé.
- Le contour de focus est dessiné à l'intérieur du champ (bordure de 2 px transparente au repos qui passe en `#5B3FE0` au focus, ou `box-shadow: inset 0 0 0 2px #5B3FE0`), pour qu'aucun conteneur ne puisse le rogner.
- Applique la même règle à tous les champs de l'app (Connexion, Création du compte, formateur).
- L'aide « 6 caractères minimum. » sous le mot de passe est décalée vers la droite : aligne-la sur le bord gauche du libellé et du champ.

Ne commite pas. Liste les fichiers modifiés.
