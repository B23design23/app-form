# Lot : retouches quiz (2), repère d'étapes et dashboard

Suite aux captures du lot `lot-retouches-quiz.md`. Tokens existants uniquement.

## 1. Bouton d'action fixé en bas (quiz de cours et quiz flash)

- Le bouton principal (« Valider ma réponse », « Question suivante », « Voir mon score ») est fixé en bas de l'écran, à la même place pendant toute la question. Il ne bouge plus quand le bloc de correction apparaît.
- Barre basse : fond crème `#F5EEE4`, marges latérales 16 px, marge basse 16 px plus la zone de sécurité (`env(safe-area-inset-bottom)`). Un dégradé de 24 px au-dessus de la barre (de transparent à crème) évite la coupure nette du contenu qui défile dessous.
- Le contenu de la page a une marge basse égale à la hauteur de la barre, pour que le bloc de correction ne passe jamais sous le bouton.
- Desktop : même barre fixe, le bouton garde la largeur de la colonne de 680 px, centré.

## 2. Fin de quiz (cours et flash) : score centré, actions en bas

- Mobile : le groupe libellé, anneau, titre, sous-titre, pastille XP et carte badge est centré verticalement dans l'espace disponible au-dessus des actions.
- Les actions (bouton principal et liens secondaires) sont fixées en bas, avec la même barre que le quiz (section 1), fond lavande `#E4DEFF` au lieu de crème.
- Desktop : garder la colonne de 420 px centrée ; les actions restent sous le contenu, sans barre fixe.

## 3. Bloc de correction : l'objet 3D recouvre le texte

Dans le bloc encre de correction, le texte passe sous l'objet qui déborde. Ajouter une réserve à droite de 72 px sur le titre et le texte du bloc, pour qu'aucun mot ne passe sous l'objet.

## 4. Repère d'étapes

- Bug : sur un cours entièrement terminé, la dernière étape s'affiche encore « en cours ». Quand toutes les étapes sont faites, toutes ont la pastille violette avec coche, et aucune n'a `aria-current`. Sur l'écran checklist d'un cours terminé, la checklist reste l'étape affichée, mais en état « faite ».
- Nouvelle règle du trait : il est violet `#5B3FE0` de la première étape jusqu'à l'étape en cours incluse (ou jusqu'à la dernière si tout est fait), et neutre `#EFE9E0` au-delà. Exemple : leçon faite, quiz en cours, le trait 1-2 est violet, le trait 2-3 est neutre.

## 5. Dashboard : bloc de tête restructuré

L'objet 3D recouvre toujours le titre sur mobile, et sur desktop la réserve laisse un grand vide et coupe le titre en plein mot. Nouvelle structure du bloc de tête (cours en cours, mobile et desktop) :

- Rangée 1 : anneau de progression à gauche, objet 3D à droite. L'objet garde son débordement au-dessus du cadre (signature du dashboard), mais ne descend pas plus bas que l'anneau.
- Rangée 2, sur toute la largeur du bloc : pastille « De ton formateur » s'il y a lieu, « Tu en es là », titre du cours, phrase de progression. Plus de réserve à droite dans cette rangée.
- Rangée 3 : bouton « Continuer le cours ».
- Titre : 26 px mobile, 32 px desktop, 3 lignes maximum, pas de césure automatique dans le titre (`hyphens: manual`), points de suspension au-delà.
- Desktop : objet 160 px, anneau 120 px. Le bloc garde la même largeur dans la grille.
- Appliquer la même structure aux autres variantes du bloc de tête (premier cours, cours assigné, prochain cours conseillé) pour que l'objet ne gêne jamais le texte.

Mets à jour CLAUDE.md. Ne commite pas.
