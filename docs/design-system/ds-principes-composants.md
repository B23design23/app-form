# Skillo, principes et composants documentés

Projet personnel, sans validation utilisateur. Session 2 de la formation Design System, 20 octobre 2026.

## Principes

La direction artistique est chaleureuse et motivante : fonds crème (`fond-page` en mode apprenant), violet franc (`fond-marque`, `fond-action`), orange réservé à la récompense (`fond-recompense`).

1. Un style réservé garde son sens.
On aurait pu utiliser l'orange pour attirer l'œil sur d'autres boutons. On l'a réservé à la récompense, l'XP et le quiz flash, pour que l'orange veuille toujours dire « tu gagnes quelque chose ».

2. Ce qu'on ne peut plus retrouver après l'action n'est jamais à un seul geste.
On aurait pu mettre un bouton Supprimer directement sur la page du cours. On a choisi de le ranger dans le menu « … », en dernier, en rouge, avec une confirmation : une étape de plus, même pour un petit objet, plutôt qu'une perte définitive en un geste. Le test : après l'action, peut-on retrouver ce qui était là, y compris ce que l'objet emporte (la progression des élèves, par exemple) ? Ce qui se retrouve n'est pas concerné par ce principe : une confirmation y reste un choix d'écran. Retirer un cours ou un élève d'un groupe, par exemple, n'efface ni progression, ni score, ni badge.

3. La profondeur vient du fond, pas des traits ni des ombres.
On aurait pu poser une ombre sous les cartes et séparer les blocs par des traits. On a choisi des fonds différents (champ ou bloc sur une carte, carte sur la page) et une seule ombre de profondeur, `ombre-flottante`, réservée à ce qui flotte au-dessus de la page. L'ombre d'illustration (`ombre-illustration`) appartient à l'objet 3D qui déborde de sa carte : elle ne crée pas de profondeur. Les champs et les contrôles ont en plus une limite de 2 px (`bordure-controle`) : ce n'est pas de la profondeur, c'est ce qui les rend visibles. Sans elle, un champ vide contrastait à 1,1:1 avec son support ; le libellé suffit pour WCAG, pas pour une personne qui voit mal (décision du 12/11).

4. On n'affiche que ce que la donnée sait vraiment.
On aurait pu recalculer un score « 4/5 » pour les anciens passages de quiz à partir du nombre actuel de questions. On affiche le pourcentage seul, parce que le nombre de questions a pu changer depuis.

## Contrainte d'accessibilité

Le statut n'est jamais porté par la couleur seule (WCAG 1.4.1, Utilisation de la couleur).
Exemple : la correction du quiz ne se lit pas au seul vert et rouge ; elle ajoute les étiquettes « Ta réponse » et « Bonne réponse », avec une icône. C'est un minimum d'accessibilité, pas un choix de Skillo.

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

Hauteur
48 px pour toutes les variantes, mobile et desktop : principal, secondaire, sur fond foncé (« Continuer le cours », « Passer au quiz »), orange, supprimer, rouge plein, pointillé, outils de l'éditeur de leçon et « Image » d'une étape (Création de cours), boutons de l'en-tête formateur et de « Pour bien démarrer », barre d'enregistrement, barre d'action fixe (« Valider ma réponse »), « Quitter l'aperçu ». Le Retour reste à 44 (composant à part) ; le bouton rond a sa fiche (Bouton rond). Posé dans la rangée d'un champ, il prend la hauteur du champ (voir DO).
Bouton à flèche (sur fond foncé) : rond encre de la flèche de 36 px, à 6 px du bord en haut, en bas et à droite.

États
Repos, survol (souris seulement), appui (tactile), focus clavier, désactivé (lavande, texte atténué ; toutes les variantes, sauf Retour). Appui et désactivé : règles communes (voir Survol et tactile, Désactivé).
Focus clavier de tous les boutons : contour de 2 px à l'extérieur du bouton, décalé de 2 px, `bordure-focus`, entouré du halo `bordure-focus-halo` de 2 px, visible au clavier seulement (voir Focus).

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
- Multiligne : saisie longue, rayon Élément (rôle dans `docs/tokens/rayons.md`), hauteur ajustée au contenu : le champ grandit avec le texte, sans poignée de redimensionnement (`resize: none`), sa hauteur minimale reste le plancher (décision du 13/11 ; Chromium dessinait la poignée sur l'arrondi de la bordure).
- Recherche : pilule avec loupe, fond selon le support (voir Fond), résultats dès 2 caractères. Toute recherche a la loupe.

Fond (règle principale)
Sur une carte blanche : fond crème (apprenant) ou gris clair (formateur).
Sur le fond de page : fond blanc.

Bordure (décision du 12/11)
Tout champ (une ligne, multiligne, recherche, liste déroulante) a au repos une bordure de 2 px en `bordure-controle`, le même token et la même épaisseur que les ronds de choix et les cases. Focus : `bordure-focus`. Erreur : `bordure-erreur`. L'épaisseur ne change jamais, rien ne bouge. L'éditeur de leçon de Création de cours porte cette bordure sur son bloc (le texte qu'il contient n'a ni fond ni bordure).
Ratios de `bordure-controle` : 3,92:1 sur blanc, 3,40 sur crème, 3,57 sur gris, 3,02 sur lavande (recherche de Cours).
Pourquoi : sans contour, les champs étaient les seuls contrôles qu'on ne voit presque pas (1,1 à 1,3:1) ; le libellé suffit pour WCAG, pas pour une personne qui voit mal.

Dimensions
- Hauteur d'un champ d'une ligne : 48 px partout. Champ du parcours d'entrée (Connexion, Création du compte, Mot de passe oublié, Nouveau mot de passe) : 56 px, grand champ compris. Champ multiligne : hauteur par le contenu, hors de cette règle ; vertical de 12, qui place la première ligne comme dans un champ d'une ligne de 48 (`docs/tokens/espacements.md`, section 7). Champ multiligne qui contient un bouton (bouton image de l'énoncé d'une question ou d'une étape) : 52 px de hauteur minimale ; le bouton est un Bouton rond de 44, à 4 px du bord extérieur du champ (2 de bordure, 2 de jour).
- Rangée : un contrôle posé dans la même rangée qu'un champ (bouton, filtre) prend la hauteur du champ.
- Icône dans le champ : 20 px, posée à 16 px du bord, texte à 8 px de l'icône, soit une réserve de 44 px de ce côté (`docs/tokens/espacements.md`, section 7).

Texte saisi
Couleur `texte-principal`, rôle Saisie et choix.

Texte indicatif
Couleur `texte-secondaire` sur tous les champs (opacité 1), rôle Saisie et choix comme le texte tapé (`docs/tokens/typographie.md`). Pas de points de suspension à la fin : « Rechercher un cours ».

États
- Repos : bordure 2 px `bordure-controle`.
- Survol : aucun. Le champ ne change pas au survol.
- Focus : la bordure de 2 px passe en `bordure-focus` (dessinée à l'intérieur), pas de contour à l'extérieur.
- Erreur : message rouge sous le champ, contour `bordure-erreur` et `aria-invalid` sur le champ lié au message. Erreur qui vise une section entière (QCM, checklist de Création de cours) : message sous la section, aucun champ marqué.
- Désactivé : même rendu que le bouton désactivé, fond `fond-action-desactive`, texte `texte-action-desactive`, sans opacité.
- Autoremplissage : le champ garde le fond qu'il a au repos, une règle commune à tous les champs, multilignes compris.

DO
Aligner le champ, son libellé et son aide sur le même bord gauche.
Aucune marge négative : le champ fait la largeur de sa colonne.

DON'T
Épaissir la bordure au focus ou en erreur. Le contenu bougerait ; seule la couleur change.

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

Variantes (décision du 13/11)
- D'écran (14 px) : la barre qui ouvre un écran plein écran, en haut, à côté du compteur : questions du parcours d'entrée, quiz de cours et quiz flash. Piste blanche.
- Fine (8 px) : toute barre posée dans une carte ou une ligne : dashboard (prochain badge, quiz flash verrouillé), Tes groupes, Mes groupes, Détail groupe, Pour bien démarrer, carte de la checklist, barre empilée du Détail cours (segments terminés / en cours / non commencés, avec leur légende chiffrée).
La piste change selon le fond : lavande, blanche ou neutre pâle.
Pourquoi deux épaisseurs : l'agent regarde où la barre est posée, pas quel écran il construit.

Contraste (décision du 12/11)
- Barre accompagnée de sa valeur écrite (« 2 / 5 », « 0 / 3 », pourcentage) : pas d'exigence de la piste contre son support ; le remplissage tient 3:1 contre la piste.
- Barre sans valeur écrite : piste à 3:1 contre son support. Aucune aujourd'hui : chaque barre a sa valeur.

DO
Toujours afficher le chiffre à côté de la barre.

DON'T
Utiliser une barre pour un résultat isolé comme un score. C'est le rôle de l'anneau.

Anti-pattern
Une barre seule, sans chiffre. Tentant car épurée. La longueur seule se lit mal, on ajoute le compteur.

Voisin, l'anneau de progression
L'anneau met en avant une seule valeur, la barre accompagne une ligne parmi d'autres. Voir la fiche Anneau.

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

Le mot porte le statut : pas de point de couleur avant le texte. L'icône d'En cours et la coche de Terminé accompagnent le mot, elles ne le remplacent pas.

Principe : 1 (un style réservé garde son sens) ; contrainte d'accessibilité (le statut n'est jamais porté par la couleur seule, WCAG 1.4.1).

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

Principe : 3 (la profondeur vient du fond, pas des traits ni des ombres).

## Modale

Rôle
Afficher un contenu court par-dessus la page sans la quitter : un formulaire ou un choix (créer un groupe, assigner un cours, ajouter une vidéo).

Quand l'utiliser
Pour une saisie ou un choix lié à la page en cours. Pour faire confirmer une action qu'on ne peut pas défaire, on prend la Modale de confirmation. Les autres cas : À trancher.

Anatomie
Voile `fond-voile` derrière. Mobile : feuille qui monte du bas, avec une poignée. Desktop : carte centrée. Ombre `--ombre-flottante`. Titre, sous-titre facultatif, bouton rond « Fermer » (croix), contenu, zone d'actions facultative.
Deux largeurs sur desktop (décision du 12/11) : étroite, 440 px (Nouveau groupe, Modale de confirmation) ; standard, 520 px (Assigner des cours, Insérer une vidéo, Mes badges). Mobile : feuille pleine largeur.
Bouton « Fermer » : Bouton rond de 44, le même dans toutes les modales, Mes badges comprise. Le composant sert aux deux modes (apprenant et formateur) et lit les mêmes sémantiques : le mode fournit la valeur.

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
Faire confirmer une action qu'on ne peut pas défaire (principe 2).

Quand l'utiliser
Avant toute action destructrice : supprimer un cours, un groupe, une question ou une étape, retirer un élève, quitter sans enregistrer.

Anatomie
Une Modale étroite : titre (la question posée), texte facultatif, « Annuler », puis le bouton qui confirme (libellé « Supprimer » par défaut). Annuler en secondaire, confirmation en rouge plein. Pendant l'action, les deux boutons sont désactivés et le bouton rouge affiche « Un instant… ».

Comportement
Le bouton qui confirme nomme le verbe et l'objet de l'action (Supprimer mon compte, Supprimer le cours). À l'ouverture, le focus va sur Annuler, l'action la moins destructrice. Tab reste dans la modale. Échap la ferme.

DO
Toujours confirmer une action destructrice, quel que soit l'endroit d'où elle part.

DON'T
Lancer une action qu'on ne peut pas défaire sans cette confirmation (principe 2).

Fichier
`src/components/Modale.jsx` (export nommé `ModaleConfirmation`).

## Menu d'actions

Rôle
Ranger les actions d'un élément qui ne méritent pas un bouton sur la page, dont l'action destructrice (principe 2).

Anatomie
Bouton rond « … » (nom accessible « Plus d'actions »). Mobile : feuille depuis le bas sur le voile `fond-voile`, avec une poignée et le nom de l'élément en titre. Desktop : carte flottante sous le bouton, alignée à droite, `--ombre-flottante`, sans voile visible. Une ligne par action, 48 px de haut (comme le menu de la navigation), survol et appui en `fond-sur-carte`. L'action destructrice est en `texte-erreur`, en dernier.

Comportement
Échap, clic hors du menu et choix d'une action ferment le menu. Rôles `menu` et `menuitem`.
Entrée ou Espace sur le bouton ouvre le menu et place le focus sur la première action. Les flèches passent d'une action à l'autre. Échap ferme le menu et rend le focus au bouton. Tab et Maj+Tab ne passent pas d’une action à l’autre ; depuis une action, ils ferment le menu et font sortir le focus (W3C, guide des pratiques ARIA, motif Menu and Menubar, Keyboard Interaction). Précision Skillo : le focus va à l’élément suivant (ou précédent) de la page. Un menu à une seule action reste admis pour l'instant.

DO
Placer l'action destructrice en dernier, en rouge, suivie d'une Modale de confirmation.

DON'T
Mettre un bouton Supprimer directement sur la page (principe 2).

À trancher
Ordre des actions autres que la destructrice.

Fichier
`src/components/formateur/MenuActions.jsx`.

## Carte

Rôle
Regrouper le contenu d'une section posée sur la page : une carte blanche par section (formateur), un bloc d'action (dashboard apprenant), une fiche (leçon, checklist, récap).

Anatomie
Fond `fond-surface` ; variantes violette (`fond-marque`) et encre (`fond-inverse`) pour un bloc qui pousse à une action. Rayon Surface, padding Surface (rôles dans `docs/tokens/rayons.md` et `docs/tokens/espacements.md`). Ni bordure ni ombre (principe 3).
- Carte de liste : la carte qui porte des Lignes de liste prend le padding de carte de liste (Ligne de liste).
- Carte cliquable (carte de thème, carte de Mes cours et de Mes groupes, carte de profil ; décision 16, structure du 13/11) : la carte n'est pas un bouton. Son titre est un vrai élément de titre (`h2`, `h3`) qui contient le bouton (ou le lien) ; la zone cliquable de ce bouton est étendue à toute la carte par un pseudo-élément (carte en `position: relative`, pseudo-élément du bouton en `position: absolute; inset: 0`) : un clic n'importe où sur la carte l'active. Le reste du contenu (thème, compteurs, pastilles) reste du texte, lu après le titre. Un seul élément focalisable par carte.
  - Focus : dessiné sur la carte, pas sur le titre (contour et halo communs, posés sur la carte quand son bouton a le focus clavier, `:has(:focus-visible)`) ; le bouton n'en dessine pas.
  - Rendu inchangé : chevron `texte-secondaire` en haut à droite ; survol et appui `fond-accent` sur la carte ; désactivé commun.
  - Classes communes : `.carte-cliquable` sur la carte, `.carte-cliquable-bouton` sur le bouton du titre (`src/styles/shared.css`). Le bouton prend la typographie de son titre ; le bas d'une carte qui porte du texte inline déclare le rôle de ce texte (la carte n'étant plus un bouton, il n'hérite plus de sa police).
  - Un autre contrôle posé dans la carte (menu « … », lien) se place au-dessus de la zone étendue (`position: relative` et `z-index`) pour rester cliquable et focalisable. Aucune des cartes actuelles n'en a.
  - Pourquoi : le contenu d'un `<button>` est présentationnel (ARIA) ; un titre posé dedans n'est pas exposé comme titre.

Règle principale
Une seule implémentation (classe commune `.carte`, `src/styles/shared.css`) ; une page n'écrit pas sa propre carte.

Voisin
La Ligne de liste, pour un élément répété à l'intérieur d'une carte ; l'En-tête de page (lavande), qui situe sans agir.

## Ligne de liste

Rôle
Un élément répété dans une carte : cours (Terrain, recherche, « De ton formateur », Détail d'un thème), événement d'Activité récente, groupe de « Tes groupes », élève à relancer, étape de « Pour bien démarrer ».

Anatomie
Padding Ligne de liste, rayon Élément, fond transparent, séparateur `bordure-separateur` de 1 px entre deux lignes (voir Séparateur). Variante à fond : fond `fond-sur-carte`, padding de bloc sur carte, sans séparateur. Ligne cliquable : survol et appui `fond-accent`, chevron.
- Ligne de cours à une colonne (décision du 12/11, révisée le 16/11) : le statut passe sous le titre dès que le titre devrait couper un mot, à toutes les largeurs ; sinon il reste à côté du titre. Le titre n'est jamais coupé au milieu d'un mot : pas de césure automatique ; filet, coupure sans tiret plutôt que débordement, seulement si un mot ne tient pas sur toute la largeur du texte. Même règle pour une ligne de cours posée dans une liste en colonnes (Terrain, résultats de recherche). Dans le code, CSS seul : texte et statut sont dans une rangée qui passe à la ligne (`flex-wrap`) ; le texte a pour largeur de base celle du mot le plus long du titre (`width: min-content`, le contenu secondaire en `contain: inline-size` ne compte pas), donc le statut ne passe dessous que lorsqu'un mot serait coupé ; `min-width: 0` garde le filet.

Règle principale
Une seule implémentation (classe commune `.ligne-liste`, `src/styles/shared.css`).

## Choix

Rôle
Une option qui reste marquée quand elle est choisie : réponse du quiz, ligne de choix du parcours, choix de Création de cours (type de réponse, mode de checklist, groupe), case de la modale d'assignation, « Bonne réponse ».

Anatomie
Ligne blanche ou `fond-sur-carte` (selon le support), rayon Élément, padding Choix ; repère de 22 à 24 px à contour 2 px `bordure-controle` (rond pour un choix unique, case rayon Case pour plusieurs). Choisi : `fond-accent` et un seul contour 2 px `bordure-action`, repère violet plein. Rôle Saisie et choix. Vrai `radio` ou case, ou `radiogroup` / `radio` avec `aria-checked`.
- Pilule « Bloquante » d'une étape (Création de cours) : choix à bascule en pilule (`aria-pressed`), 44 px de haut, la hauteur de l'Onglet et filtre (décision du 13/11).

DON'T
Faire avancer un écran au seul choix quand d'autres réponses suivent (« Continuer » valide).

## Onglet et filtre

Rôle
Changer ce qu'on voit sans agir sur les données : onglets « Écrire / Aperçu », filtres d'Activité récente, pastilles de section de Création de cours (mobile), entrées du sommaire (desktop).

Anatomie
Pilule, 44 px de haut ; 48 dans la rangée d'un champ (une seule hauteur par rangée, voir Bouton). Rôle Navigation. Actif : `fond-inverse`, texte `texte-sur-inverse` (onglets, filtres, pastilles de section) ; entrée de sommaire active en `fond-accent`. Appui, focus et désactivé communs.

## Pastille

Rôle
Un texte court posé dans une pilule : groupe, thème, « Bloquante », « Ta réponse » / « Bonne réponse », pastille de statut pas encore ouverte (voir Pastille de statut).

Anatomie
Pilule, padding Pastille, rôle Pastille ; fond selon le sens (`fond-accent`, `fond-neutre`, `fond-erreur`, `fond-succes`…), texte à 4,5:1 sur son fond. Le fond n'a pas d'exigence de contraste contre son support : le texte porte l'information (décision du 12/11).
Variante ronde (numéro ou icône dans un rond : étapes, « À retenir », « De ton formateur », initiales) : tailles actuelles gardées (28, 32, 34, 40), sans harmonisation pour l'instant.

Règle principale
Une seule implémentation (classe commune `.pastille`, `src/styles/shared.css`) ; jamais cliquable.

## Lien texte

Rôle
Une action écrite sans forme de bouton, ni attendue ni alternative (voir Bouton, « Choisir entre principal, secondaire et lien texte ») : « Tout voir », « Revoir la leçon », « Voir les N autres », « Mot de passe oublié ? », « Passer ».

Anatomie
Texte `texte-accent`, rôle Lien texte ; survol et appui `texte-accent-survol`. Padding Lien texte (6 px sur les côtés), zone cliquable de 44 px de haut. Dans une phrase : règle du lien dans une phrase de `docs/tokens/typographie.md`, section 6.

Règle principale
Une seule implémentation (classe commune `.lien-texte`, `src/styles/shared.css`).

## Barre fine

Voir Barre de progression : variante Fine (8 px) et variante d'écran (14 px), selon la place.

## Anneau

Rôle
Mettre en avant une seule valeur de progression, avec le chiffre au centre : un cours en cours (dashboard apprenant), le taux de complétion (dashboard formateur), un score (fin de quiz). Jamais une pastille de numéro.

Anatomie
Piste et arc (couleurs selon le fond : tableau « Anneaux de progression selon le fond » de `regles-agent.md`, section 5), extrémité arrondie, départ en haut, valeur au centre ; sans données, piste seule et « — ».

Valeur au centre (décision C8 révisée, 13/11)
Chiffre mis en avant standard (28 px), à toutes les tailles. Ce rôle est fixé par cette fiche : le rôle d'un texte de composant vient de sa fiche (`typographie.md`, section 7). Pourquoi : la valeur d'un anneau est le chiffre qu'on vient chercher ; c'est l'anneau qui s'agrandit pour la contenir.

Tailles
- 108 px sous 768 px de large. Raison : plus petit multiple de 4 où « 100 % » en Chiffre mis en avant standard garde 8 px de jour de chaque côté avec la piste de 10 px.
- 120 px à partir de 768 px.
- Piste : 10 px, la même pour tous les anneaux et à toutes les tailles ; le trait ne grandit pas avec l'anneau.
- Exception écrite : anneau de fin de quiz, 168 px, piste 16 px, valeur en Chiffre mis en avant grand. Pourquoi : l'anneau de fin de quiz est le seul contenu de son écran, le score est le sujet de l'écran entier (`typographie.md`, section 6).

Règle principale
Une seule implémentation (`src/components/AnneauProgression.jsx`).

## Bouton rond

Rôle
Une action représentée par une icône seule : Retour rond (mobile), fermer une modale, menu « … », « Voir comme un élève » (mobile), image dans un champ, relancer un élève, rond « + » de Mes cours (mobile).

Anatomie
Deux diamètres (décision du 12/11) : 44 px partout ; 56 px dans le parcours d'entrée (barre du haut des questions et des écrans de connexion). L'icône suit le diamètre : 20 px dans le bouton de 44, 22 px dans celui de 56 (décision du 13/11). Fond : celui de chaque bouton aujourd'hui (blanc ou `fond-sur-carte`) ; le rond « + » est un bouton principal (`fond-action`). Nom accessible obligatoire (`aria-label`). Appui, focus et désactivé communs.

DON'T
Réduire un bouton rond pour le faire tenir dans un champ : c'est le champ qui grandit (voir Champ, Dimensions).

## Composants d'écran

Ils ne servent qu'à un endroit : ils restent sans fiche, avec les règles communes (focus, appui, désactivé, zone de 44 px). Repère d'étapes, éditeur de leçon, tri de tableau, bandeau Aperçu, visionneuse, confettis, points de l'Introduction, vignettes de badge, carte pointillée « + Assigner un cours » du Détail groupe.
- Repère d'étapes : la liaison entre les étapes n'a pas d'exigence de contraste (l'état est porté par les pastilles et les libellés) ; le contour `bordure-etape` d'une étape à venir non plus (le numéro porte l'information).
- Vignettes de badge : le fond de la vignette n'a pas d'exigence (l'image grisée, le cadenas et le nom portent l'état).
- Rangée des badges de la carte « Prochain badge » (décision du 16/11) : les vignettes ne sont pas des contrôles, la règle des rangées de contrôles (`mise-en-page.md`, section 7) ne s'y applique pas. Les six badges restent sur une ligne quand ils tiennent, sinon ils passent en deux rangées égales de trois. Le lien « Mes badges · X/6 » est toujours seul sur sa ligne, sous les badges, à droite. Écart Répétition entre les badges, entre les rangées et avant le lien.
- Survol (décision du 13/11), l'appui prend le même rendu :
  - vignette de badge : contour de 2 px `bordure-action` dessiné à l'intérieur du bord de la vignette (un contour, pas une ombre : `outline` décalé de -2 px), qui ne déplace rien ; au focus clavier, seul le focus commun s'affiche ;
  - point de l'Introduction inactif : fond `fond-controle-survol` (neutre plus foncé que `fond-controle`, 3,40:1 sur la crème), jamais la couleur du point actif ; le point actif ne change pas (décision du 13/11).
- Zone cliquable de 44 px même quand le rendu est plus petit (vignette de badge de 26, tri de tableau), par le padding, rendu inchangé.

## Typographie

- Échelle, graisses (500 à 800), seuil de 768 px, rôles et règles d'usage : `docs/tokens/typographie.md`, qui fait foi. Les valeurs ne sont pas recopiées ici.
- Titres de page (salutation, « Cours », « Mes groupes »…) : rôle Titre de page. Titres de cours et noms de thème dans les fiches (fiche cours, détail cours formateur, détail thème) : rôle Titre de contenu.
- Césure des titres (Titre de page, de contenu, de section, mis en avant, de carte ; le Titre de ligne ne se coupe pas, le statut passe sous le titre, fiche Ligne de liste) : coupure à la syllabe avec tiret, dans un mot de 10 lettres ou plus, avec au moins 4 lettres de chaque côté du tiret, et coupure sans tiret en filet si aucune syllabe ne convient (`hyphens: auto`, `hyphenate-limit-chars: 10 4 4`, `-webkit-hyphenate-limit-before: 4`, `-webkit-hyphenate-limit-after: 4`, `overflow-wrap: break-word`), lignes équilibrées (`text-wrap: balance`, posé par `index.css` sur `h1`, `h2`, `h3`, déclaré dans sa règle par tout autre élément de titre). Règle et raison : `docs/tokens/typographie.md`, section 5 (« Césure des titres ») ; code : section 11. Césure du Texte de lecture, partout où il apparaît : `docs/tokens/typographie.md`, section 5 (« Césure du Texte de lecture »).

## Ponctuation

- Textes de contenu (leçons, énoncés, réponses, explications, titres de cours, critères) : l'espace avant « ? », « ! », « : », « ; », « % » devient une espace fine insécable U+202F, et un pourcentage collé reçoit cette espace. Fonction `typo()` (`src/lib/typographie.js`), aussi appliquée dans `ContenuMarkdown`.
- Textes fixes de l'interface (apprenant et formateur) : même règle, l'espace fine insécable est écrite directement dans le JSX ou la chaîne (pas d'appel à `typo()` sur un texte en dur, pas d'échappement). `typo()` est réservé aux textes dynamiques.
- Tout nouveau texte suit cette règle.

## Survol et tactile

- Tous les styles `:hover` sont dans `@media (hover: hover)` (souris uniquement).
- Appui (`:active`, décision du 12/11) : une règle commune à tout bouton et tout lien, comme le focus : boutons de toutes les variantes, boutons ronds, Retour, liens texte, entrées de navigation et de menu, onglets, filtres, entrées de sommaire, choix, cartes et lignes cliquables. L'appui prend le rendu du survol de l'élément (fond ou couleur du texte) ; sur tactile, c'est le seul retour pendant l'appui.
- Un élément interactif sans survol écrit (tri de tableau) prend au survol le rendu de son appui. Les points de l'Introduction et les vignettes de badge ont leur survol écrit (Composants d'écran).
- Pas de surlignage natif au tap (`-webkit-tap-highlight-color: transparent`).
- Transition `all 0.15s ease` sur tous les CTA. Survol : principal → `fond-action-survol` ; secondaire et contour → `fond-accent` ; supprimer → `fond-erreur` ; orange → `fond-recompense-survol` ; cartes et lignes cliquables (celles de la section Chevrons) → `fond-accent`, au survol et à l'appui.
- Tout nouveau style de survol suit ces règles.

## Focus

- Un seul style de focus, quelle que soit la surface (décision du 12/11) : tout élément interactif qui n'est pas un champ (bouton, lien, carte ou ligne cliquable, entrée de navigation, case, ligne de choix) prend un contour de 2 px `bordure-focus`, à l'extérieur, décalé de 2 px, entouré d'un halo `bordure-focus-halo` (blanc) de 2 px, visible au clavier seulement. Sur chaque surface, l'une des deux couleurs atteint 3:1 (WCAG 1.4.11 et 2.4.7) : le violet sur les fonds clairs, le blanc sur le violet et l'encre. Aucune règle selon la surface.
- Pourquoi : l'agent n'a pas à connaître la surface pour choisir le focus ; une surface foncée ajoutée plus tard est couverte sans nouvelle règle.
- Rendu exact : le halo est une ombre portée (`box-shadow`) de 6 px sous le contour ; il remplit aussi l'écart de 2 px entre l'élément et le contour. On voit donc blanc (0 à 2 px), violet (2 à 4 px), blanc (4 à 6 px). Un parent en `overflow: hidden` rogne le halo comme le contour : un élément focalisable n'y est jamais collé au bord.
- Champ : contour de 2 px à l'intérieur (bordure), pas de contour à l'extérieur (voir Champ).
- Un conteneur qui défile et que le navigateur rend focusable prend le même contour que les autres éléments.
- Un seul indicateur de focus par élément : un contrôle dessiné sur un input masqué (« Bonne réponse » de Création de cours) montre le contour de son repère ou de sa ligne, pas celui de l'input.

## Désactivé

Une règle commune pour tout élément interactif (décision du 12/11) : fond `fond-action-desactive` pour un élément qui a un fond ou un contour (boutons de toutes les variantes, boutons ronds, choix, onglets, filtres, cartes et lignes cliquables, champs, liste déroulante), contour `bordure-action-desactive` s'il a un contour, texte et icône `texte-action-desactive` pour tous (liens compris), sans opacité, curseur « interdit ». Le Retour n'a pas d'état désactivé (il n'apparaît que là où l'on peut remonter).

## Toast de complétion

Fond `fond-inverse`, texte `texte-sur-inverse`, pastille XP en `fond-recompense` avec texte `texte-principal`.

Un toast informatif n'a aucune action ni élément focalisable ; il est annoncé par `role="status"` et se ferme seul ; la fermeture au clic n'est qu'un raccourci.

## Navigation

- Mobile : tab bar flottante en bas, fond `fond-inverse`, rayon Surface (rôle dans `docs/tokens/rayons.md`), position de la barre (côtés à 12 px sous 768, au lieu de la marge de page, et bas à 20 px : exception écrite de `docs/tokens/espacements.md`, section 9) et padding des entrées dans `docs/tokens/espacements.md`, 4 entrées avec icône et libellé, l'entrée Menu plus étroite que les onglets (même exception).
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
