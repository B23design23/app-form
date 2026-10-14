# Lot : confettis « pastilles et anneaux »

Remplace l'animation de confettis actuelle sur la fin de quiz (cours et flash). À faire dans `Confetti.jsx`, sans nouvelle dépendance (canvas en JS natif).

## Formes

- 60 % de pastilles : disques pleins de 5 à 10 px de diamètre.
- 40 % d'arcs : trois quarts d'anneau (comme l'anneau du logo et de la progression), rayon 4 à 8 px, trait 2,5 px, extrémités rondes.
- Couleurs, réparties à parts égales : violet `#5B3FE0`, orange `#F6A55E`, encre `#1E1A33`, blanc `#FFFFFF`, violet profond `#4630B8`.

## Mouvement

- Les confettis partent du centre de l'anneau de score, en gerbe dans toutes les directions, avec une légère poussée vers le haut.
- Vitesse initiale aléatoire, gravité, léger freinage de l'air, rotation propre à chaque confetti.
- Chaque confetti s'efface progressivement et disparaît après environ 2,5 s.
- Le canvas est posé par-dessus l'écran, sans capter les clics (`pointer-events: none`), et calcule sa taille au moment du lancement.

## Intensité selon le score

- 100 % : deux salves de 70 confettis, la seconde 400 ms après la première.
- De 60 à 99 % : une salve de 70.
- De 50 à 59 % : une salve de 35.
- Sous 50 % : aucun confetti.
- Lancement juste après le remplissage de l'anneau (ordre d'animation existant).
- `prefers-reduced-motion` : aucun confetti.

Mets à jour CLAUDE.md. Ne commite pas.
