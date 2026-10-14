# Lot : retouches onboarding

## 1. Desktop : plus de bloc de gauche, contenu centré

Le découpage en deux colonnes (grand bloc lavande à gauche, contenu à droite) est abandonné sur tous les écrans du parcours : Introduction, Connexion, Choix du profil, questions, Création du compte.

- À partir de 768 px, la mise en page est **la même que sur mobile**, dans une colonne de 440 px centrée horizontalement dans la page, fond crème (ou `#F4F4F6` pour le formateur).
- La colonne a une hauteur fixe (environ 720 px) et est centrée verticalement dans la fenêtre ; si la fenêtre est moins haute, elle se cale en haut avec 32 px de marge. Le bouton d'action reste ancré en bas de cette colonne : même position d'un écran à l'autre, comme sur mobile.
- L'Introduction garde son bloc lavande avec l'objet, à l'intérieur de la colonne, comme sur mobile.
- Les questions, la Connexion, le Choix du profil et la Création du compte n'ont pas d'illustration supplémentaire sur desktop (le bloc lavande de la Création du compte reste, comme sur mobile).
- Supprime le grand bloc lavande et son objet de 300 px.

## 2. Un seul logo

Conséquence du point 1 : le logo du bloc de gauche disparaît. Le logo n'apparaît qu'aux mêmes endroits que sur mobile :
- slide 1 : grand logo centré ;
- slides 2 et 3 : petit logo en haut à gauche de la colonne ;
- autres écrans : pas de logo.

## 3. Slide 1 mobile : le texte passe sous le bouton

Sur un iPhone, les points de pagination recouvrent le titre et la description passe sous « Suivant ». Le contenu est trop haut pour l'écran.

- Le contenu au-dessus de la zone d'action doit toujours garder une marge basse égale à la hauteur réelle de cette zone (points + bouton + lien éventuel + zone de sécurité). Rien ne doit pouvoir passer dessous. Vérifie-le sur les 3 slides et sur tous les écrans du parcours.
- Pour que tout tienne sans défilement sur un petit écran (hauteur 667 px, iPhone SE) : le bloc lavande de l'Introduction devient flexible, entre 160 px et 300 px de haut, et rétrécit en premier quand la place manque. L'objet à l'intérieur suit (environ 60 % de la hauteur du bloc).
- Grand logo de la slide 1 : 44 px au lieu de 52 px, et 8 px de moins au-dessus.
- Si malgré tout le contenu dépasse (texte agrandi par l'utilisateur), la zone de contenu défile, la zone d'action reste fixe.
- Les points de pagination font partie de la zone d'action fixe, juste au-dessus du bouton, sur les 3 slides.

## 4. Bouton qui reste foncé après un tap

Sur les slides 2 et 3, « Suivant » et « Créer mon compte » apparaissent en violet foncé au lieu du violet primaire `#5B3FE0` : l'état de survol reste collé après un tap sur iOS, parce que le même bouton est réutilisé d'une slide à l'autre.

- Place tous les styles de survol des boutons de l'app dans `@media (hover: hover)`, pour qu'ils ne s'appliquent qu'avec une souris.
- Sur tactile, garde seulement un retour pendant l'appui (`:active`), qui disparaît au relâchement.
- Vérifie que le bouton ne garde pas non plus le focus visuel après un tap (`:focus-visible` uniquement).

Ne commite pas. Liste les fichiers modifiés.
