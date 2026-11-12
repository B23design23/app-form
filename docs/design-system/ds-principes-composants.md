# Skillo, principes et composants documentés

Projet personnel, sans validation utilisateur. Session 2 de la formation Design System, 20 octobre 2026.

## Principes

La direction artistique est chaleureuse et motivante : fonds crème (`fond-page` en mode apprenant), violet franc (`fond-marque`, `fond-action`), orange réservé à la récompense (`fond-recompense`).

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

## Conteneur de page

Usage
Toute page de l'app s'y place, y compris une page hors navigation.

Ce qu'il fournit
- Marges de page : `.espace-contenu`, posé par `EspaceApprenant` et `EspaceFormateur` autour de la page, rôle Marge de page (valeurs dans `docs/tokens/espacements.md`) ; réserve de la tab bar en bas sur mobile, de la barre du haut sur desktop ; complété sur desktop par `.espace-page-etroit` (rôle de largeur Page).
- Largeur de colonne : la fonction de l'écran décide du rôle, Page, Lecture, Question ou Formulaire, toutes centrées ; exception écrite : Création de cours (valeurs dans `docs/tokens/mise-en-page.md`, section 3).
- Haut du contenu et ancres : une cible d'ancre s'arrête au même endroit que le haut du contenu, jamais sous la barre du haut (`docs/tokens/mise-en-page.md`, section 5).
- Écart entre les blocs de la page : `.espace-page`, rôle Entre deux blocs (valeurs dans `docs/tokens/espacements.md`).
- Page hors navigation : elle se place aussi dans le Conteneur de page et prend le rôle Marge de page (`docs/tokens/espacements.md`, décision du 11/11). Mot de passe oublié et Nouveau mot de passe prennent le gabarit de la Connexion (`GabaritParcours`) : Retour rond et logo en rangée (Nouveau mot de passe : emplacement du Retour vide), titres en `TitreParcours`, champs `ChampParcours` posés sur la page, bouton dans la zone d'action, colonne Formulaire, textes inchangés. L'écran « Chargement… » de l'app reste dans `.flow-page` et `.flow-card`, colonne Formulaire.

Règle principale
Une page ne redéfinit pas l'écart entre ses blocs.

Fichier
`src/styles/espace-layout.css` (`.espace-contenu`, `.espace-page-etroit`, `.espace-page`).

## Bouton

Variantes et usage
- Principal (violet plein) : l'action attendue de la zone. Un seul par zone.
- Secondaire (contour violet) : action alternative à côté du principal.
- Sur fond foncé (blanc, texte encre) : l'action principale d'une carte violette ou encre.
- Orange (texte encre) : lancer le quiz flash, rien d'autre.
- Supprimer (rouge) : action destructrice, dans un menu, toujours confirmée.
- Pointillé : ajouter un élément dans la création de cours (question, réponse, étape).
- Retour : revenir au niveau du dessus quand on est descendu d'un niveau dans les pages. Place : en haut à gauche, avant l'en-tête. Rendu : pilule blanche, chevron à gauche, texte encre. Sur mobile, chevron seul, et le nom accessible du bouton ne change pas. Quand le libellé visible nomme le niveau du dessus, le nom accessible est « Retour à <libellé> » (WCAG 2.5.3, Label in Name : le nom accessible contient le libellé visible). Exemples : Mot de passe oublié (libellé « Connexion », nom « Retour à la connexion »), espace formateur (« Retour à Mes cours », « Retour à Mes groupes »), Création de cours (« Retour à Mes cours », « Retour à Détail du cours »). États : survol et appui en fond-accent. Zone cliquable de 44 px minimum. Le bouton Retour remonte d'un niveau dans l'arborescence des pages. Il n'apparaît pas sur une page de niveau 0, atteinte depuis la navigation principale (tab bar sur mobile, barre de navigation sur desktop). Il n'a donc pas d'état désactivé. Dimensions : padding en rôle Padding d'un contrôle (Retour), écart entre le chevron et le libellé en rôle Icône et libellé (valeurs dans `docs/tokens/espacements.md`) ; chevron de 18 px. Libellé : rôle Bouton (valeurs dans `docs/tokens/typographie.md`).

Choisir entre principal, secondaire et lien texte
- Principal : l'action attendue de la zone. Un seul par zone.
- Secondaire : seulement s'il est sur la même rangée que le principal et que c'est l'autre issue de la même décision.
- Lien texte : une action à part, ni attendue ni alternative. Exemples Skillo : Se déconnecter, Mot de passe oublié.

États
Repos, survol (souris seulement), appui (tactile), focus clavier, désactivé (lavande, texte atténué ; toutes les variantes, sauf Retour).
Focus clavier de tous les boutons : contour de 2 px à l'extérieur du bouton, décalé de 2 px, token de focus (`bordure-focus`), visible au clavier seulement (voir Focus).

Accessibilité
Zone cliquable de 44 px minimum. Focus visible au clavier seulement.

DO
Un seul bouton principal par zone d'action.
Un bouton qui valide un formulaire est un bouton principal plein, de même hauteur que le champ voisin.
Posé dans la rangée d'un champ, un bouton prend la hauteur du champ, et un choix aussi (filtres posés à côté d'une recherche) : une seule hauteur par rangée. Posé seul, un bouton garde sa hauteur de 48 px (`docs/tokens/espacements.md`, section 7). 44 px est la zone cliquable minimale, pas la hauteur d'un composant.

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
- Multiligne : saisie longue, rayon Élément (rôle dans `docs/tokens/rayons.md`), hauteur ajustée au contenu.
- Recherche : pilule avec loupe, fond selon le support (voir Fond), résultats dès 2 caractères. Toute recherche a la loupe.

Fond (règle principale)
Sur une carte blanche : fond crème (apprenant) ou gris clair (formateur).
Sur le fond de page : fond blanc.
Jamais de bordure au repos.

Dimensions
- Hauteur d'un champ d'une ligne : 48 px partout. Champ du parcours d'entrée (Connexion, Création du compte, Mot de passe oublié, Nouveau mot de passe) : 56 px, grand champ compris. Champ multiligne : hauteur par le contenu, hors de cette règle ; vertical de 12, qui place la première ligne comme dans un champ d'une ligne de 48 (`docs/tokens/espacements.md`, section 7).
- Rangée : un contrôle posé dans la même rangée qu'un champ (bouton, filtre) prend la hauteur du champ.
- Icône dans le champ : 20 px, posée à 16 px du bord, texte à 8 px de l'icône, soit une réserve de 44 px de ce côté (`docs/tokens/espacements.md`, section 7).

Texte indicatif
Couleur `texte-secondaire` sur tous les champs (opacité 1), rôle Saisie et choix comme le texte tapé (`docs/tokens/typographie.md`). Pas de points de suspension à la fin : « Rechercher un cours ».

États
- Repos.
- Focus : contour violet 2 px à l'intérieur, pas de contour à l'extérieur.
- Erreur : message rouge sous le champ, contour `bordure-erreur` et `aria-invalid` sur le champ lié au message. Erreur qui vise une section entière (QCM, checklist de Création de cours) : message sous la section, aucun champ marqué.
- Désactivé : même rendu que le bouton désactivé, fond `fond-action-desactive`, texte `texte-action-desactive`, sans opacité.
- Autoremplissage : le champ garde son fond, règle commune à tous les champs.

DO
Aligner le champ, son libellé et son aide sur le même bord gauche.
Aucune marge négative : le champ fait la largeur de sa colonne.

DON'T
Ajouter une bordure pour séparer le champ de la carte. On change son fond.

Anti-pattern
Signaler l'erreur par la seule couleur du contour. Tentant car discret. On écrit le message sous le champ.

Voisin
La liste déroulante, quand les réponses possibles sont connues et peu nombreuses.

## États de page

Chargement
« Chargement… » seul, en Texte secondaire, couleur `texte-secondaire`, sans marge, posé à la place du contenu attendu : l'écart vient du conteneur (Entre deux blocs sous l'en-tête). Ni spinner, ni squelette.

Erreur
- Un message d'erreur n'affiche jamais le message technique de la base. Celui-ci part en console. Texte, rôle (Texte secondaire) et couleur (`texte-erreur`) inchangés.
- Quand un message est à écrire : « [Objet] n'a pas pu être [action]. », suivi de « Réessaie. » seulement si l'action peut être relancée.
- Tout enregistrement affiche un message d'erreur s'il échoue, même composant que les autres, près de l'action.
- Erreur de formulaire : voir Champ (message sous le champ, contour `bordure-erreur`, `aria-invalid` ; erreur de section : message sous la section).

Vide
Un état vide est en Texte secondaire, couleur `texte-secondaire`, jamais `texte-erreur`.

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
Rendu : extrémité arrondie, départ en haut, pourcentage au centre ; sans données, piste seule et « — ».

## En-tête de page

Rôle
Ouvrir une page de section (Cours, Terrain) : dire où l'on est et ce qu'on y trouve.

Anatomie
Bloc lavande, rayon Surface (rôle dans `docs/tokens/rayons.md`), titre de page, sous-titre, objet 3D en haut à droite, recherche optionnelle (Cours).

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
Dire où en est l'apprenant sur un cours. Utilisée partout où ce statut apparaît : dashboard apprenant (« De ton formateur »), page Cours (« De ton formateur », cartes de thème, résultats de recherche), détail d'un thème, Terrain, récap de cours, suivi du Détail groupe, Activité récente du dashboard formateur.

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
Le trait bordure-separateur se place uniquement entre deux éléments consécutifs de même nature qui se répètent dans un même bloc (lignes d'un tableau, lignes d'une liste), jamais avant le premier ni après le dernier. Un en-tête de colonnes, un titre ou une section n'est pas un élément répété : il se sépare par l'espacement. Dans une liste disposée en plusieurs colonnes, le dernier élément de chaque colonne n'a pas de séparateur.

Épaisseur : 1 px.

Principe : 4 (la profondeur vient du fond, pas des traits ni des ombres).

## Modale

Rôle
Afficher un contenu court par-dessus la page sans la quitter : un formulaire ou un choix (créer un groupe, assigner un cours, ajouter une vidéo).

Quand l'utiliser
Pour une saisie ou un choix lié à la page en cours. Pour faire confirmer une action qu'on ne peut pas défaire, on prend la Modale de confirmation. Les autres cas : À trancher.

Anatomie
Voile `fond-voile` derrière. Mobile : feuille qui monte du bas, avec une poignée. Desktop : carte centrée. Ombre `--ombre-flottante`. Titre, sous-titre facultatif, bouton rond « Fermer » (croix), contenu, zone d'actions facultative. Le composant sert aux deux modes (apprenant et formateur) et lit les mêmes sémantiques : le mode fournit la valeur.

Comportement
Échap, clic sur le voile et bouton « Fermer » ferment la modale. Rôle `dialog`, `aria-modal`, nom accessible = titre.

DO
Laisser les trois façons de fermer : Échap, clic sur le voile, bouton « Fermer ».

DON'T
À trancher.

À trancher
Focus à l'ouverture et maintien du focus dans la modale, hors Modale de confirmation (le code ne les gère pas).

Fichier
`src/components/Modale.jsx` (export par défaut `Modale`).

## Modale de confirmation

Rôle
Faire confirmer une action qu'on ne peut pas défaire (principe 3).

Quand l'utiliser
Avant toute action destructrice : supprimer un cours, un groupe, une question ou une étape, retirer un élève, quitter sans enregistrer.

Anatomie
Une Modale étroite : titre (la question posée), texte facultatif, « Annuler », puis le bouton qui confirme (libellé « Supprimer » par défaut). Annuler en secondaire, confirmation en rouge plein. Pendant l'action, les deux boutons sont désactivés et le bouton rouge affiche « Un instant… ».

Comportement
Le bouton qui confirme nomme le verbe et l'objet de l'action (Supprimer mon compte, Supprimer le cours). À l'ouverture, le focus va sur Annuler, l'action la moins destructrice. Tab reste dans la modale. Échap la ferme.

DO
Toujours confirmer une action destructrice, quel que soit l'endroit d'où elle part.

DON'T
Lancer une action qu'on ne peut pas défaire sans cette confirmation (principe 3).

Fichier
`src/components/Modale.jsx` (export nommé `ModaleConfirmation`).

## Menu d'actions

Rôle
Ranger les actions d'un élément qui ne méritent pas un bouton sur la page, dont l'action destructrice (principe 3).

Anatomie
Bouton rond « … » (nom accessible « Plus d'actions »). Mobile : feuille depuis le bas sur le voile `fond-voile`, avec une poignée et le nom de l'élément en titre. Desktop : carte flottante sous le bouton, alignée à droite, `--ombre-flottante`, sans voile visible. Une ligne par action, survol et appui en `fond-sur-carte`. L'action destructrice est en `texte-erreur`, en dernier.

Comportement
Échap, clic hors du menu et choix d'une action ferment le menu. Rôles `menu` et `menuitem`.
Entrée ou Espace sur le bouton ouvre le menu et place le focus sur la première action. Les flèches passent d'une action à l'autre. Échap ferme le menu et rend le focus au bouton. Tab et Maj+Tab ne passent pas d’une action à l’autre ; depuis une action, ils ferment le menu et font sortir le focus (W3C, guide des pratiques ARIA, motif Menu and Menubar, Keyboard Interaction). Précision Skillo : le focus va à l’élément suivant (ou précédent) de la page. Un menu à une seule action reste admis pour l'instant.

DO
Placer l'action destructrice en dernier, en rouge, suivie d'une Modale de confirmation.

DON'T
Mettre un bouton Supprimer directement sur la page (principe 3).

À trancher
Ordre des actions autres que la destructrice.

Fichier
`src/components/formateur/MenuActions.jsx`.

## Typographie

- Échelle, graisses (500 à 800), seuil de 768 px, rôles et règles d'usage : `docs/tokens/typographie.md`, qui fait foi. Les valeurs ne sont pas recopiées ici.
- Titres de page (salutation, « Cours », « Mes groupes »…) : rôle Titre de page. Titres de cours et noms de thème dans les fiches (fiche cours, détail cours formateur, détail thème) : rôle Titre de contenu.
- Césure des titres (Titre de page, de contenu, de section, mis en avant, de carte, de ligne) : coupure à la syllabe avec tiret, dans un mot de 10 lettres ou plus, avec au moins 4 lettres de chaque côté du tiret, et coupure sans tiret en filet si aucune syllabe ne convient (`hyphens: auto`, `hyphenate-limit-chars: 10 4 4`, `-webkit-hyphenate-limit-before: 4`, `-webkit-hyphenate-limit-after: 4`, `overflow-wrap: break-word`), lignes équilibrées (`text-wrap: balance`, posé par `index.css` sur `h1`, `h2`, `h3`, déclaré dans sa règle par tout autre élément de titre). Règle et raison : `docs/tokens/typographie.md`, section 5 (« Césure des titres ») ; code : section 11. Césure du Texte de lecture, partout où il apparaît : `docs/tokens/typographie.md`, section 5 (« Césure du Texte de lecture »).

## Ponctuation

- Textes de contenu (leçons, énoncés, réponses, explications, titres de cours, critères) : l'espace avant « ? », « ! », « : », « ; », « % » devient une espace fine insécable U+202F, et un pourcentage collé reçoit cette espace. Fonction `typo()` (`src/lib/typographie.js`), aussi appliquée dans `ContenuMarkdown`.
- Textes fixes de l'interface (apprenant et formateur) : même règle, l'espace fine insécable est écrite directement dans le JSX ou la chaîne (pas d'appel à `typo()` sur un texte en dur, pas d'échappement). `typo()` est réservé aux textes dynamiques.
- Tout nouveau texte suit cette règle.

## Survol et tactile

- Tous les styles `:hover` sont dans `@media (hover: hover)` (souris uniquement).
- Sur tactile, seul `:active` donne un retour pendant l'appui (boutons principaux, secondaires, orange, boutons ronds, cartes et lignes cliquables).
- Pas de surlignage natif au tap (`-webkit-tap-highlight-color: transparent`).
- Transition `all 0.15s ease` sur tous les CTA. Survol : principal → `fond-action-survol` ; secondaire et contour → `fond-accent` ; supprimer → `fond-erreur` ; orange → `fond-recompense-survol` ; cartes et lignes cliquables (celles de la section Chevrons) → `fond-accent`, au survol et à l'appui.
- Tout nouveau style de survol suit ces règles.

## Focus

- Tout élément interactif qui n'est pas un champ (bouton, lien, carte ou ligne cliquable, entrée de navigation, case, ligne de choix) : contour de 2 px à l'extérieur, décalé de 2 px, token de focus (`bordure-focus`), visible au clavier seulement.
- Champ : contour de 2 px à l'intérieur (bordure), pas de contour à l'extérieur (voir Champ).
- Un conteneur qui défile et que le navigateur rend focusable prend le même contour que les autres éléments.
- Un seul indicateur de focus par élément : un contrôle dessiné sur un input masqué (« Bonne réponse » de Création de cours) montre le contour de son repère ou de sa ligne, pas celui de l'input.

## Toast de complétion

Fond `fond-inverse`, texte `texte-sur-inverse`, pastille XP en `fond-recompense` avec texte `texte-principal`.

## Navigation

- Mobile : tab bar flottante en bas, fond `fond-inverse`, rayon Surface (rôle dans `docs/tokens/rayons.md`), position de la barre (côtés alignés sur la marge de page, bas fixé par le composant) et padding des entrées dans `docs/tokens/espacements.md`, 4 entrées de largeur égale avec icône et libellé.
- Desktop : même barre en haut, logo en variante foncée à gauche, entrées en pilules à droite.
- Onglet actif : fond `fond-accent`, texte et icône `texte-principal`.
- Onglets inactifs : `texte-sur-inverse`.

## Liste déroulante

- Option sélectionnée : fond `fond-accent`, texte et coche `texte-accent`.
- Survol d'une option : `fond-sur-carte` (le mode donne la valeur), jamais sur l'option sélectionnée.

## Logo

- Composant `src/components/Logo.jsx` : SVG inline, « skill » vectorisé en Urbanist ExtraBold et « o » en anneau de progression (cercle de fond et arc de trois quarts partant du haut, extrémité arrondie, épaisseur égale au fût des lettres, diamètre égal à la hauteur des minuscules).
- `variante="clair"` : texte `texte-principal`, fond de l'anneau `fond-accent`, arc `fond-marque`.
- `variante="fonce"` : texte `texte-sur-marque`, fond de l'anneau `fond-marque-accentue`, arc `fond-surface`.

## Objet 3D du thème

- L'objet 3D du thème remplace la pastille numéro (cartes de la page Cours, en-tête du détail d'un thème). Le numéro s'affiche en texte (« Thème N »).

## Chevrons

- Couleur `texte-secondaire` (via `currentColor`).
- Un chevron à droite sur les cartes de thème, les lignes du détail d'un thème, les résultats de recherche, les lignes du Mode terrain, de « De ton formateur » (page Cours), de « Mes cours » et de « Mes groupes ». Toute la carte reste cliquable.
