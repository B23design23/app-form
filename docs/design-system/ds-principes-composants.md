# Skillo, principes et composants documentés

Projet personnel, sans validation utilisateur. Session 2 de la formation Design System, 20 octobre 2026.

## Principes

1. Chaque bloc débouche sur une action.
On aurait pu garder les cartes de chiffres et le carrousel de badges sur le dashboard apprenant. On a choisi des blocs qui proposent tous quelque chose à faire, reprendre un cours, lancer un quiz flash, viser le prochain badge.

2. Un style réservé garde son sens.
On aurait pu utiliser l'orange pour attirer l'œil sur d'autres boutons. On l'a réservé à la récompense, l'XP et le quiz flash, pour que l'orange veuille toujours dire « tu gagnes quelque chose ».

3. Ce qui détruit se trouve à un geste de plus.
On aurait pu mettre un bouton Supprimer directement sur la page du cours. On l'a rangé dans le menu « … », en dernier, en rouge, et il demande toujours une confirmation. Le principe ne vise que ce qu'on ne peut pas défaire.

4. La profondeur vient du fond, pas des traits ni des ombres.
On aurait pu entourer les champs d'une bordure grise et poser une ombre sous les cartes. On a choisi un fond de champ différent de la carte, et une seule ombre, réservée à ce qui flotte au-dessus de la page.

5. Le statut n'est jamais porté par la couleur seule.
On aurait pu corriger le quiz avec du vert et du rouge uniquement. On a ajouté les étiquettes « Ta réponse » et « Bonne réponse » avec une icône.

6. On n'affiche que ce que la donnée sait vraiment.
On aurait pu recalculer un score « 4/5 » pour les anciens passages de quiz à partir du nombre actuel de questions. On affiche le pourcentage seul, parce que le nombre de questions a pu changer depuis.

## Bouton

Variantes et usage
- Principal (violet plein) : l'action attendue de la zone. Un seul par zone.
- Secondaire (contour violet) : action alternative à côté du principal.
- Sur fond foncé (blanc, texte encre) : l'action principale d'une carte violette ou encre.
- Orange (texte encre) : lancer le quiz flash, rien d'autre.
- Supprimer (rouge) : action destructrice, dans un menu, toujours confirmée.
- Pointillé : ajouter un élément dans la création de cours (question, réponse, étape).

États
Repos, survol (souris seulement), appui (tactile), focus clavier, désactivé (lavande, texte atténué).

Accessibilité
Zone cliquable de 44 px minimum. Focus visible au clavier seulement.

DO
Un seul bouton principal par zone d'action.

DON'T
Utiliser le pointillé pour valider un formulaire. On prend le principal.

Anti-pattern
Une pastille de statut en pilule pleine ressemble à un bouton. On la garde non cliquable visuellement : pas de survol, pas de curseur main, plus petite que le bouton.

Voisin
Le lien texte, pour une action secondaire qui ne mérite pas de zone.

## Champ

Variantes et usage
- Texte : saisie courte, en pilule.
- Mot de passe : texte masqué, aide « 6 caractères minimum » dessous.
- Multiligne : saisie longue, rayon 20 px, hauteur ajustée au contenu.
- Recherche : pilule blanche avec loupe, résultats dès 2 caractères.

Fond (règle principale)
Sur une carte blanche : fond crème (apprenant) ou gris clair (formateur).
Sur le fond de page : fond blanc.
Jamais de bordure au repos.

États
Repos, focus (contour violet 2 px à l'intérieur), erreur (message rouge sous le champ), désactivé.

DO
Aligner le champ, son libellé et son aide sur le même bord gauche.

DON'T
Ajouter une bordure pour séparer le champ de la carte. On change son fond.

Anti-pattern
Signaler l'erreur par la seule couleur du contour. Tentant car discret. On écrit le message sous le champ.

Voisin
La liste déroulante, quand les réponses possibles sont connues et peu nombreuses.

## Barre de progression

Rôle
Montrer l'avancement dans une suite ou dans une liste, de façon compacte, à côté d'un compteur.

Usages
Checklist (« 3 étapes sur 8 »), quiz (« 3 / 5 »), cartes de groupe formateur, prochain badge, quiz flash verrouillé.

Anatomie
Piste, remplissage violet, extrémités arrondies, compteur ou pourcentage à côté.

Variantes
- Fine (8 px) : dans une carte, à côté d'un compteur.
- Quiz (10 px) : en haut de l'écran, piste blanche.
La piste change selon le fond : lavande, blanche ou neutre pâle.

DO
Toujours afficher le chiffre à côté de la barre.

DON'T
Utiliser une barre pour un résultat isolé comme un score. C'est le rôle de l'anneau.

Anti-pattern
Une barre seule, sans chiffre. Tentant car épurée. La longueur seule se lit mal, on ajoute le compteur.

Voisin, l'anneau de progression
L'anneau met en avant une seule valeur, avec le chiffre au centre : un cours en cours, un score de quiz, le taux de complétion d'un formateur. La barre accompagne une ligne parmi d'autres. L'anneau est réservé à la progression, il ne sert jamais de pastille de numéro.

## En-tête de page

Rôle
Ouvrir une page de section (Cours, Terrain) : dire où l'on est et ce qu'on y trouve.

Anatomie
Bloc lavande, rayon 32 px (36 sur desktop), titre de page, sous-titre, objet 3D en haut à droite, recherche optionnelle (Cours).

Règle principale
L'objet 3D reste dans le cadre, sans débord ni ombre.

DO
Un seul en-tête par page, tout en haut.

DON'T
Faire déborder l'objet hors du cadre. Le débord est réservé au bloc de tête du dashboard.

Anti-pattern
Ajouter un bouton principal dans l'en-tête pour le rendre utile. L'en-tête situe, les actions vivent dans le contenu.

Voisin, le bloc de tête du dashboard
Carte violette, objet qui déborde, bouton blanc. Il pousse à une action. L'en-tête de page, lui, situe.

## Pastille de statut

Rôle
Dire où en est l'apprenant sur un cours. Utilisée à six endroits : dashboard, « De ton formateur », Cours, détail d'un thème, Terrain, suivi du détail groupe.

Règle principale
Périmètre : le statut d'un cours pour un élève, partout où il apparaît. Ne s'applique pas au repère d'étapes, à la mention Checklist terminée ni aux compteurs (x / y cours, X terminés sur N, barre d'avancement).

Un cours pas encore ouvert s'affiche en pilule. Non commencé et À faire en texte-secondaire sur fond-neutre. Nouveau en texte-accent sur fond-accent. Un cours déjà ouvert s'affiche sans pilule, en texte avec une icône. En cours en texte-accent avec l'icône de progression. Terminé en texte-succes avec la coche. Aucune pastille n'utilise fond-action, fond-marque ni fond-recompense.

Principes : 2 (un style réservé garde son sens) et 5 (le statut n'est jamais porté par la couleur seule).

DO
Utiliser la même pastille partout où un statut de cours apparaît.

DON'T
Utiliser le vert sur fond vert pâle. Ce couple est réservé aux bonnes réponses du quiz et à la pastille « Bon rythme ».

Anti-pattern
Rendre la pastille cliquable ou lui donner l'air d'un bouton.

Voisin
La pastille de groupe (lavande) dans l'espace formateur, qui nomme un groupe et ne dit rien de l'avancement.

## Séparateur

Règle principale
Le trait bordure-separateur se place uniquement entre deux éléments consécutifs de même nature qui se répètent dans un même bloc (lignes d'un tableau, lignes d'une liste), jamais avant le premier ni après le dernier. Un en-tête de colonnes, un titre ou une section n'est pas un élément répété : il se sépare par l'espacement.

Principe : 4 (la profondeur vient du fond, pas des traits ni des ombres).
