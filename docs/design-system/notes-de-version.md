# Notes de version du design system

## 4.0.0 (brouillon, non publiée)

**Ajouté**

- Variante Retour, présence : sur une page de niveau 1 ou plus, un Retour dans tous les états de la page, chargement, erreur et vide compris ; toujours pas de Retour sur une page de niveau 0. Quand la page d'origine ne se rouvre pas telle qu'on l'a quittée (session abandonnée, page remplacée), le Retour remonte à l'origine de cette page, autant de fois que nécessaire ; un lien entre deux branches sœurs n'ouvre pas une page de plus, la page d'arrivée prend le Retour qu'avait la première page de la branche quittée, ou aucun ; une page où l'on arrive sans venir d'une page de l'app (ouverture de l'app, lien reçu par email, déconnexion), ou dont le Retour sortirait de l'app, est de niveau 0. La fiche États de page renvoie à la fiche Bouton. Côté écran : à faire, ajouter le Retour aux états de chargement de la fiche de cours, du quiz flash, du Détail cours et du Détail groupe ; à faire aussi, Choix du profil ouvert depuis la Connexion : Retour vers l'Introduction, ou aucun quand la Connexion n'en a pas (aujourd'hui vers la Connexion) ; Connexion ouverte depuis le Choix du profil ou l'inscription : le Retour du Choix du profil, vers l'Introduction ou aucun (aujourd'hui celui de l'arrivée précédente sur la Connexion) ; Connexion à l'ouverture de l'app, après une déconnexion ou après un nouveau mot de passe : aucun Retour (aujourd'hui vers l'Introduction, sauf si la Connexion a été atteinte plus tôt par « Passer »).
- Variante Retour et Bouton rond, critère de choix : la pilule quand elle est seule sur sa rangée là où son libellé s'affiche (à partir de 768) ; le rond quand il partage sa rangée avec d'autres éléments (logo, barre de progression, titre, œil) ; sous 768, la pilule passe en chevron seul et peut alors partager sa rangée. Renvoi de chaque fiche à l'autre ; « (mobile) » et « Retour mobile » retirés là où ils désignaient le rond. Côté écran : à faire, Choix du profil et états de chargement et d'erreur de Création de cours passent en pilule.
- Ce qui n'est pas un Retour : un bouton qui ne remonte pas d'un niveau (quitter un mode, fermer la session) est nommé par son effet, même s'il a la forme d'un rond. Côté écran : à faire, le rond de l'étape 1 de Compléter le profil devient « Se déconnecter ».
- Navigation : sur une page de niveau 1 ou plus, l'entrée de la section d'origine reste active ; la fiche Navigation renvoie à la règle du niveau 0 de la fiche Bouton. Côté écran : à faire, barre du haut de la leçon, de la checklist et du récap à partir de 768.

**Modifié**

- Variante Retour, nom accessible : tout Retour, pilule ou rond, avec ou sans libellé visible, a pour nom « Retour à <libellé> ». Le libellé est le nom d'écran de la destination : chaque écran qui peut être la destination d'un Retour a un nom d'écran, écrit une seule fois dans sa description (`docs/ecrans/`), et un nouvel écran de ce type écrit son nom d'écran dans sa description, avant le code ; pas d'article ajouté ; la pilule montre ce même libellé ; quand la destination dépend de l'origine, libellé et nom suivent la destination réelle ; le niveau du dessus est la page d'où la page a été ouverte (fiche Bouton, variante Retour, Présence), sans liste de cas particuliers, et l'entrée de la section d'origine reste active (fiche Navigation). Retour d'une étape d'un parcours en plusieurs étapes : « Retour à l'étape précédente ». Remplace « nom accessible « Retour à <libellé> » quand le libellé visible nomme le niveau du dessus ». Côté écran : à faire, renommer les Retours nommés « Retour » seul (parcours, checklist, fin de quiz, erreur de la fiche, aperçu élève) et ceux dont le nom ajoute un article ; à faire aussi, garder l'origine du Détail groupe et de Création de cours (en création) ouverts depuis le Dashboard formateur : Retour vers le Dashboard, libellé « Dashboard », nom « Retour à Dashboard », entrée Dashboard active (aujourd'hui Mes groupes et entrée Groupes pour le Détail groupe, Mes cours pour Création de cours) ; Création de cours : la fin de création reste séparée du Retour (« Créer le cours » mène toujours à Mes cours, « Enregistrer » au Détail du cours), alors que le Retour, « Annuler » et le bouton précédent du navigateur suivent l'origine (aujourd'hui une même fonction pour les deux).

**Corrigé**

Aucune entrée.

**Déprécié**

Aucune entrée.

**Retiré**

Aucune entrée.

**Écrans corrigés**

- Vitrine `/design-system`, spécimen de la variante Retour : nom accessible « Retour à Cours » (le libellé visible « Cours » nomme le niveau du dessus).
- Leçon et récap de la fiche de cours, aperçu élève compris : le libellé du Retour nommait le thème du cours au lieu du niveau du dessus (règle 3.0.0) ; libellé et nom suivent désormais l'origine de la fiche. Côté écran : à faire (lot Retour).

## 3.0.0 (18 novembre 2026)

Version majeure : des règles changent au point que des écrans conformes ne le sont plus, et la Modale change d'emplacement dans le code. Les écrans concernés sont listés sous chaque entrée ; ceux qui sont déjà corrigés figurent sous « Écrans corrigés ».

Applique la correction 1.0.1 sur `bordure-controle` et sépare les contours qui n'ont pas d'exigence de contraste.

**Ajouté**

- Variante Retour du Bouton : revenir au niveau du dessus quand on est descendu d'un niveau dans les pages ; en haut à gauche, avant l'en-tête ; pilule blanche, chevron à gauche, texte encre ; chevron seul sur mobile ; nom accessible « Retour à <libellé> » quand le libellé visible nomme le niveau du dessus (WCAG 2.5.3, Label in Name) ; survol et appui en `fond-accent` ; zone cliquable de 44 px minimum. Côté écran : fait (voir « Écrans corrigés »).
- Variante Retour, règle d'usage : le bouton remonte d'un niveau dans l'arborescence des pages ; il n'apparaît pas sur une page de niveau 0, atteinte depuis la navigation principale (tab bar sur mobile, barre de navigation sur desktop) ; il n'a donc pas d'état désactivé. Côté écran : rien à faire de plus que l'entrée précédente.
- Comportement de la Modale de confirmation : le bouton qui confirme nomme le verbe et l'objet de l'action ; à l'ouverture, le focus va sur Annuler ; Tab reste dans la modale ; Échap la ferme. Côté écran : fait (voir « Écrans corrigés »).
- Comportement au clavier du Menu d'actions : Entrée ou Espace ouvre le menu et place le focus sur la première action ; les flèches passent d'une action à l'autre ; Échap ferme le menu et rend le focus au bouton. Tab et Maj+Tab ne passent pas d’une action à l’autre ; depuis une action, ils ferment le menu et font sortir le focus (W3C, guide des pratiques ARIA, motif Menu and Menubar, Keyboard Interaction). Précision Skillo : le focus va à l’élément suivant (ou précédent) de la page. Un menu à une seule action reste admis pour l'instant. Côté écran : fait (voir « Écrans corrigés »).
- Composant Conteneur de page : toute page de l'app s'y place, y compris une page hors navigation ; marges de page fournies par `.espace-contenu` (complété sur desktop par `.espace-page-etroit`), écart entre les blocs par `.espace-page` ; fichier à réutiliser, `src/styles/espace-layout.css`. Écran « Chargement… » de l'app, hors navigation : `.flow-page` (`src/styles/shared.css`) fournit ses marges, sans la réserve de la tab bar. Une page ne redéfinit pas l'écart entre ses blocs. Côté écran : rien à faire, écrans déjà conformes.
- Espacements par rôles (`docs/tokens/espacements.md`, qui fait foi) : 14 rôles, une valeur chacun, sans seuil sauf la Marge de page. Marge de page (16 sous 768, valeurs desktop gardées), Entre deux blocs (20), Padding d'une Surface (20), Bloc près du bord (8), Entre deux groupes (12), Deux textes d'un groupe (4), Rangée (12), Répétition (8), Ligne de liste (ligne à 12 sur les quatre côtés dans une carte de liste à 8 ; l'en-tête d'une carte de liste est posé comme une ligne), Icône et libellé (8), Padding d'un contrôle (Bouton 24 sur les côtés, Retour 12 / 20, Champ 16, Pastille 4 × 10, Choix 10 × 16, Entrée de navigation 8 × 16, Lien texte 6, Étiquette 4), Rythme du contenu (paragraphes 16, intertitre 20 avant et 8 après, retrait des puces 20), Colonnes (40), Padding d'un Élément (16). Le rôle se choisit par la place, jamais par la valeur actuelle. Côté écran : fait (voir « Écrans corrigés », migration en 17 lots).
- Tokens `espace-<rôle>` (`tokens/espacements.tokens.json`, 28 tokens, un par axe ou par côté quand le rôle en a deux), alias des primitifs `espace-N` ; CSS généré par `npm run tokens`, liste générée dans `regles-agent.md`. Un élément applique son rôle par `var(--espace-<rôle>)`, jamais par un primitif ; une valeur hors rôle (réserve, débord d'illustration, marge de page desktop, exception écrite) s'écrit en px avec un commentaire qui renvoie à `espacements.md` (section 8 ou 9) ; une marge négative cite le rôle qu'elle traverse. Côté écran : rien à faire, écrans déjà conformes.
- Contrôle anti-primitif dans `scripts/tokens/verifier-tokens.mjs` : `npm run tokens` s'arrête si un fichier de `src/` (hors `tokens.generes.css`) lit `var(--espace-<nombre>)`. Côté écran : rien à faire, écrans déjà conformes.
- Règles de dimension : hauteur minimale d'un en-tête lavande sur desktop = objet 3D + 2 × `espace-surface` ; réserve du débord de l'objet du bloc de tête du dashboard sur desktop (30 px). Côté écran : rien à faire, écrans déjà conformes.
- Exceptions écrites d'espacement (`espacements.md`, section 9) : tab bar mobile (côtés 12, barre 6, écart 4, entrée 6 × 4 : « Dashboard » ne tient à 320 px avec aucun padding d'entrée), segments de la barre empilée (4), sélecteur « Écrire / Aperçu » (4), contour de mise en évidence de Mes badges (4), barre d'enregistrement desktop (10 · 10 · 10 · 24), colonnes de Création de cours (32), centrages optiques gardés là où un alignement ne reproduit pas le rendu (numéro et menu d'étape de Création de cours, intitulé d'étape de la checklist, titre desktop de Création de cours). Côté écran : rien à faire, écrans déjà conformes.
- Séparateur : épaisseur 1 px (était « À trancher »). Côté écran : rien à faire, écrans déjà conformes.
- Variante Retour du Bouton : chevron de 18 px ; libellé en rôle Bouton (voir `docs/tokens/typographie.md`). Côté écran : rien à faire, écrans déjà conformes.
- Typographie par rôles (`docs/tokens/typographie.md`, qui fait foi) : 19 rôles (Chiffre mis en avant a deux niveaux, soit 20 jeux de valeurs), échelle fermée de 13 tailles, 4 graisses (500 à 800), un seul seuil (768 px), règles de choix entre rôles voisins, rattachement par la fonction, états et emphase (un cran de graisse, jamais la taille). Parmi les rôles, le Titre mis en avant : titre de la carte qui porte l'action principale de l'écran, au plus une par écran. Deux rôles de titre ne prennent jamais la même valeur. Côté écran : fait (voir « Écrans corrigés », migration en 14 lots).
- Tokens `typo-*` en 3 fichiers (`tokens/typographie.tokens.json`, `typographie-mobile.tokens.json`, `typographie-desktop.tokens.json`) : primitifs (famille, tailles, graisses, interlignes, espacement des lettres, seuil) et rôles composés au format du raccourci `font`, avec une variante `-fort` (un cran de graisse) pour les rôles sous 800 ; CSS généré par `npm run tokens` dans `src/styles/tokens.generes.css`, liste générée dans `regles-agent.md`. Un élément applique son rôle par `font: var(--typo-<rôle>)`. Côté écran : rien à faire, écrans déjà conformes.
- Contrôle `scripts/tokens/verifier-tokens.mjs`, lancé par `generer-css.mjs` avant la génération : doublons entre fichiers communs et fichiers de mode, paires incomplètes, collisions de noms CSS, référence au seuil, erreurs de transformation, descriptions de groupe identiques d'un fichier à l'autre. Côté écran : rien à faire, écrans déjà conformes.
- Prop `roleTypo` de `ContenuMarkdown`, obligatoire (`texte-lecture`, `corps-courant`, `corps-courant-fort`, `titre-contenu`, `titre-ligne`) : le composant pose le rôle du texte qu'il affiche ; `strong` et `a` d'une phrase prennent la variante `-fort`, les titres Markdown le Titre de section, le tableau le Corps courant. Côté écran : rien à faire, écrans déjà conformes.
- Règle du `th` : un en-tête de tableau prend le rôle du tableau qu'il coiffe, en variante `-fort` (un tableau en Corps courant : en-têtes en Corps courant fort). Côté écran : rien à faire, écrans déjà conformes.
- Règle du lien posé dans une phrase : il prend le rôle de la phrase en variante `-fort` et ne change jamais de taille ; un lien seul, hors d'une phrase, est un Lien texte. Côté écran : rien à faire, écrans déjà conformes.
- Rôle typographique cité dans les entrées de composant de `regles-agent.md` : Bouton, libellé en rôle Bouton (`--typo-bouton`), texte d'action sans forme de bouton en Lien texte ; Champ, libellé en Libellé de champ (`--typo-libelle-champ`), texte tapé ou choisi et texte indicatif en Saisie et choix (`--typo-saisie-choix`) ; Pastille de statut, texte du statut en Pastille (`--typo-pastille`), avec ou sans pilule. Côté écran : rien à faire, écrans déjà conformes.
- Rayons par rôles (`docs/tokens/rayons.md`, qui fait foi) : 5 rôles, une valeur chacun, la même à toutes les largeurs, aucun seuil. Pilule (deux bouts en demi-cercle), Rond (élément carré rendu circulaire, vignette carrée d'une liste comprise), Case (case à cocher), Surface (bloc posé sur le fond de la page ou flottant), Élément (bloc posé dans une Surface, à n'importe quelle profondeur) ; variante Feuille de la Surface pour la modale, le menu « … » et la barre d'enregistrement sur mobile (coins du haut seulement). Le rôle se choisit par la forme puis par la place, jamais par la valeur actuelle ni par la taille. Côté écran : fait (voir « Écrans corrigés »).
- Tokens `rayon-*` (`tokens/rayons.tokens.json`) : `rayon-pilule`, `rayon-rond`, `rayon-case`, `rayon-surface`, `rayon-element`, un seul niveau, sans primitif ; CSS généré par `npm run tokens` dans `src/styles/tokens.generes.css`, liste générée dans `regles-agent.md`. Un élément applique son rôle par `border-radius: var(--rayon-<rôle>)`. Côté écran : rien à faire, écrans déjà conformes.
- Règle d'écart de l'Élément près du bord : un Élément posé à moins de 20 px du bord de sa Surface garde le même écart en haut, en bas et sur les côtés, et cet écart vaut 8 px ; les coins sont alors concentriques. Côté écran : fait pour l'étape en cours de la checklist (voir « Écrans corrigés »).
- Mise en page (`docs/tokens/mise-en-page.md`, qui fait foi ; chantier mise en page, formulaires, états de page) :
  - Rôles de largeur de colonne : Page (1040), Lecture (880 de contenu, la colonne compte son padding en plus), Question (680), Formulaire (440), toutes centrées ; la fonction de l'écran décide du rôle. Exception écrite : Création de cours (1200, seuil 1024).
  - Seuil unique : 768 px est le seul seuil de mise en page. Grilles de cartes en colonnes automatiques avec une largeur minimale de carte : thèmes 210, Mes groupes 300, `/design-system` 240.
  - Haut du contenu et ancres : 104 sur desktop, zone de sécurité + 20 sur mobile, une seule source (`--haut-contenu`, Conteneur de page) ; une cible d'ancre s'arrête au même endroit.
  - Colonnes de lignes : pastille sous le titre, colonnes automatiques à 260 minimum (« De ton formateur » de la page Cours) ; pastille à côté du titre, 2 colonnes fixes (Mode terrain, recherche) ; écart Colonnes.
  - Rangées de contrôles : elles passent à la ligne quand elles ne tiennent pas ; seules les rangées de cartes défilent.
  - Exceptions écrites : pastilles collantes du sommaire mobile de Création de cours (elles défilent) ; Introduction sous 667 px de haut (zone d'action et barre à zone de sécurité + 8, rangée des points gardée à 44, bloc lavande réduit jusqu'à ce que les trois slides tiennent à 320 × 568).
  - Côté écran : rien à faire, écrans déjà conformes.
- États de page (`ds-principes-composants.md`) : chargement (« Chargement… » seul, Texte secondaire, `texte-secondaire`, sans marge, classe `.etat-chargement`) ; erreur (jamais le message technique, gardé en console ; texte à écrire : « [Objet] n'a pas pu être [action]. », suivi de « Réessaie. » si l'action peut être relancée ; tout enregistrement qui échoue affiche un message près de l'action) ; vide (Texte secondaire, jamais `texte-erreur`). Côté écran : rien à faire, écrans déjà conformes.
- Champ : texte indicatif en `texte-secondaire` (opacité 1, sans points de suspension) ; icône de 20 px à 16 du bord, réserve de 44 ; toute recherche a la loupe ; erreur : contour `bordure-erreur` et `aria-invalid` sur le champ lié au message ; désactivé : même rendu que le bouton désactivé, sans opacité ; autoremplissage : le champ garde son fond ; champ multiligne : vertical de 12. Côté écran : rien à faire, écrans déjà conformes.
- Valeurs hors rôle (`espacements.md`, section 8) : positions d'un élément fixe, collant ou posé en absolu, haut du Conteneur de page, bas d'une page sans barre fixe (40, une seule valeur pour `.flow-page` et la fiche de cours), place de l'ombre sous une rangée qui défile (4). Côté écran : rien à faire, écrans déjà conformes.
- Réserve d'une illustration (`mise-en-page.md`, section 3) : elle s'applique sur l'axe où l'illustration rencontre l'élément (recherche de Cours : verticale sous 768, horizontale au-dessus). Côté écran : rien à faire, écrans déjà conformes.
- Liste déroulante : props `invalide` et `idErreur` (`aria-invalid`, `aria-describedby`), bordure d'erreur par la règle commune. Côté écran : rien à faire, écrans déjà conformes.
- Catalogue : fiches Carte, Ligne de liste (et variante à fond), Choix, Onglet et filtre, Pastille, Lien texte, Barre fine, Anneau, Bouton rond (`ds-principes-composants.md`) ; liste des composants d'écran sans fiche (repère d'étapes, éditeur de leçon, tri de tableau, bandeau Aperçu, visionneuse, confettis, points de l'Introduction, vignettes de badge, carte pointillée « + Assigner un cours »). Vitrine sur `/design-system`. Côté écran : rien à faire, écrans déjà conformes.
- Une implémentation par rôle, dans `src/styles/shared.css` : `.carte` / `.carte-liste`, `.ligne-liste`, `.ligne-fond`, `.pastille`, `.lien-texte` (ex-`.lien-secondaire`), `.bouton-rond`, `.bouton-retour`, `.recherche`, famille du champ (`.champ input`, `.champ textarea`, `.champ-saisie`). Les copies locales des écrans sont retirées. Côté écran : rien à faire, écrans déjà conformes.
- Tokens d'ombre (`tokens/ombres.tokens.json`) : `--ombre-flottante` (valeur inchangée) et `--ombre-illustration` (ardoise-900 à 35 %, `0 14px 16px`, une valeur pour toutes les cartes et toutes les largeurs) ; token `bordure-focus-halo`. Côté écran : rien à faire, écrans déjà conformes.
- Token `fond-controle-survol` (évolution mineure) : `ardoise-450`, commun aux deux modes (même primitif que `bordure-controle`, 3,40:1 sur la crème) ; survol du point inactif de l'Introduction. Côté écran : fait (`Parcours.css`).
- Règle Désactivé commune : fond `fond-action-desactive`, texte `texte-action-desactive`, contour `bordure-action-desactive` s'il y en a un, sans opacité. Côté écran : rien à faire, écrans déjà conformes.
- Règle du libellé d'une information affichée sans être modifiable (évolution mineure) : posé au-dessus de sa valeur, il est en Méta, couleur `texte-secondaire` (typographie.md, section 6 ; regles-agent.md). Aucune règle sur la valeur, dont le rôle vient de sa fonction. Les libellés des cartes de statistique (dashboard admin, Détail cours) la suivent déjà. Côté écran : rien à faire.
- Entrée Menu de la navigation (évolution mineure) : quand l'écran affiché a été ouvert depuis une entrée du Menu, l'entrée Menu est marquée active, avec l'état de l'onglet actif (ds-principes-composants.md, fiche Navigation ; regles-agent.md). Aucune entrée du Menu n'ouvre d'écran aujourd'hui. Côté écran : rien à faire.
- Primitif `ardoise-450` (#847d97, L* 53,8). Côté écran : rien à faire.
- `bordure-etape` (`sable-150` en apprenant, `ardoise-175` en formateur) : contour d'une pastille d'étape à venir ou passée, non interactive. Côté écran : une pastille d'étape utilise `bordure-etape`, jamais `bordure-controle` (déjà fait pour le repère d'étapes et la checklist).
- `bordure-action-desactive` (mêmes valeurs) : contour d'une action désactivée, avec `texte-action-desactive`. Côté écran : rien à faire, la règle Désactivé commune pose ce contour (`shared.css`).
- Rôle `etape` dans la liste fermée des rôles de `docs/tokens/couleurs.md`, pour `bordure-etape`. Côté écran : rien à faire.
- Règle des ombres : deux ombres, `--ombre-flottante` pour les éléments flottants (menus, listes déroulantes, toast, modales), ombre d'illustration pour les objets 3D qui débordent d'une carte. Côté écran : rien à faire.
- Règle « Un seul bouton orange par écran » (évolution mineure). Vérifiée sur toutes les situations du dashboard apprenant, mobile et desktop : aucun écran n'en affiche deux aujourd'hui. Côté écran : rien à faire.
- Composants Modale, Modale de confirmation et Menu d'actions documentés dans `ds-principes-composants.md` (évolution mineure), rédigés depuis le code existant (`src/components/formateur/Modale.jsx`, `MenuActions.jsx`) et le principe 2 ; ce que le code ne tranche pas est marqué « À trancher ». Sans changement de rendu. Côté écran : rien à faire.

**Modifié**

- Survol et appui des cartes et lignes cliquables (celles de la section Chevrons) en `fond-accent`. Côté écran : fait (voir « Écrans corrigés »).
- Espacements : toutes les déclarations d'espacement de `src/` (796 lignes de l'inventaire, dont 395 au rendu inchangé, 186 discrètes et 206 visibles) lisent un token de rôle ou une valeur hors rôle commentée. Version majeure : chaque déclaration est renommée. Côté écran : rien à faire, écrans déjà conformes.
- Critère de choix entre principal, secondaire et lien texte (secondaire seulement sur la même rangée que le principal, pour l'autre issue de la même décision ; lien texte pour une action à part). Côté écran : fait (voir « Écrans corrigés »).
- Modale : composant partagé des deux espaces, déplacé de `src/components/formateur/Modale.jsx` vers `src/components/Modale.jsx`, styles dans `src/components/Modale.css` (classes `modale-*` au lieu de `fm-*`) ; ombre `--ombre-flottante`, comme le veut la règle des ombres. Côté écran : importer `Modale` et `ModaleConfirmation` depuis `src/components/Modale.jsx` (fait pour Création de cours, Détail cours, Détail groupe, Nouveau groupe).
- Césure des titres : l'ancienne règle (pas de coupure) est remplacée par la césure à la syllabe, avec coupure sans tiret en filet. Raison : débordement des titres de carte à 18 px sur mobile. Précisée ensuite : la coupure ne se fait que dans un mot de 10 lettres ou plus, avec au moins 4 lettres de chaque côté du tiret (`hyphenate-limit-chars: 10 4 4`, et `-webkit-hyphenate-limit-before` / `-after: 4` pour WebKit) ; limites acceptées : Firefox ne met pas de tiret dans un mot à majuscule initiale, et peut couper un mot qui tenait pour équilibrer les lignes. Raison : sans limite, des coupures courtes et inutiles (« fri- / gorifique ») dans des mots qui tenaient sur la ligne. `text-wrap: balance` est gardé sur les titres. Côté écran : fait, la classe commune de chaque rôle de titre (`shared.css`) porte `hyphens: auto`, les limites et `overflow-wrap: break-word`, sauf Titre de ligne (voir « Rôle Titre de ligne »), et `index.css` ne met plus `hyphens: manual` sur h1, h2, h3.
- Césure du Texte de lecture par rôle : `hyphens: auto` est posé par `ContenuMarkdown` sur les paragraphes et les éléments de liste quand `roleTypo` vaut `texte-lecture`, partout où le Texte de lecture apparaît (leçon de la fiche, aperçu de Création de cours, premier paragraphe du Détail cours), et non plus sur `.fiche-lecon-contenu`. Le tableau du Markdown (Corps courant) ne se coupe pas. Côté écran : fait.
- `body` en Corps courant (`font: var(--typo-corps-courant)`, 15 px · 500 · 1,45) au lieu d'Urbanist 500 à la taille du navigateur (16 px, interligne `normal`) : tout texte sans rôle déclaré prend le Corps courant. Côté écran : rien à faire, aucun texte visible ne dépendait de cette valeur (mesuré au lot 14, hors « Chargement… »).
- `h1` à `h6` sans rôle par défaut (`font: inherit`) au lieu d'Urbanist 800 à la taille du navigateur avec `hyphens: manual` : chaque titre déclare son rôle et sa césure. `text-wrap: balance` reste sur `h1`, `h2`, `h3`. Côté écran : fait, tous les titres de l'app ont leur rôle.
- Hauteur des champs d'une ligne (évolution du Champ) : 48 px partout ; champ du parcours d'entrée 56 px (grand champ compris, 64 → 56) ; champ multiligne hors de la règle. Écrans dont le rendu change : questions du parcours (Prénom, Organisme, Spécialité), recherche et filtres d'Activité récente (40 → 48), email de l'élève du Détail groupe (52 → 48), Réponse (44 → 48) et Explication (40 → 48) de Création de cours. Côté écran : rien à faire, écrans déjà conformes.
- Règle de rangée (évolution du Bouton et du Choix) : posé dans la rangée d'un champ, un bouton ou un choix prend la hauteur du champ (« Ajouter » du Détail groupe 52 → 48, filtres d'Activité récente 40 → 48). Posé seul, un bouton fait 48 ; 44 reste la zone tactile minimale, pas la hauteur d'un composant. Côté écran : rien à faire, écrans déjà conformes.
- Champ en erreur : la règle commune de `shared.css` gagne contre les règles de bordure des champs des écrans (sans `!important`) ; au focus, la bordure de focus garde la main. Côté écran : rien à faire, écrans déjà conformes.
- Mot de passe oublié et Nouveau mot de passe : gabarit de la Connexion (`GabaritParcours`, Retour rond et logo en rangée, champs du parcours, bouton dans la zone d'action), textes inchangés. `.flow-card` ne sert plus qu'à l'écran « Chargement… » de l'app. Côté écran : rien à faire, écrans déjà conformes.
- Documentation de l'agent : descriptions d'écrans déplacées de `CLAUDE.md` dans `docs/ecrans/` (un fichier par espace) ; `CLAUDE.md` porte deux mentions, lire `regles-agent.md` avant toute modification d'interface et lire le fichier de l'espace dans `docs/ecrans/` avant de toucher un écran. Côté écran : rien à faire.
- Focus : contour `bordure-focus` de 2 px décalé de 2, entouré d'un halo blanc de 2 px, sur toute surface ; l'une des deux couleurs atteint 3:1. Les choix à input masqué (case d'assignation, réponse du quiz, « Bonne réponse ») portent le focus sur leur ligne. Les champs gardent leur focus sur la bordure. Côté écran : rien à faire, écrans déjà conformes.
- Bordure des champs : tout champ (une ligne, multiligne, recherche, liste déroulante, bloc de l'éditeur de leçon) a au repos une bordure de 2 px `bordure-controle` ; focus `bordure-focus`, erreur `bordure-erreur`, épaisseur fixe. Survol : aucun. Texte saisi : `texte-principal`. Autoremplissage : une règle commune, au fond du champ au repos. Côté écran : rien à faire, écrans déjà conformes.
- Appui commun : l'appui prend le rendu du survol (boutons, liens, entrées de navigation et de menu, pointillés, repère d'étapes, tri). Côté écran : rien à faire, écrans déjà conformes.
- Hauteurs : bouton 48 pour toutes les variantes (Retour 44) ; bouton rond 44, 56 dans le parcours ; rond des boutons à flèche 36, à 6 du bord ; onglet, filtre et entrée de sommaire 44 (48 dans une rangée de champ) ; item de menu 48 ; champ multiligne à bouton 52. Côté écran : rien à faire, écrans déjà conformes.
- Barre : 14 pour la barre qui ouvre un écran plein (parcours, quiz : 10 → 14), 8 pour une barre posée dans une carte ou une ligne (dashboard, Tes groupes, Mes groupes, Détail groupe, Pour bien démarrer, carte de la checklist, barre empilée du Détail cours). Côté écran : rien à faire, écrans déjà conformes.
- Anneau : 108 sous 768, 120 au-dessus, piste de 10 à toutes les tailles, valeur en Chiffre mis en avant standard (rôle fixé par la fiche) ; fin de quiz 168, exception écrite. Le rôle d'un texte de composant est fixé par sa fiche ; « la fonction décide, jamais la place » vaut pour le texte libre. Côté écran : rien à faire, écrans déjà conformes.
- Modale : deux largeurs, 440 (étroite) et 520 (standard) ; Mes badges passe de 640 à 520 et prend le bouton Fermer standard (44). Côté écran : rien à faire, écrans déjà conformes.
- Point de revue final (lot 7) : carte cliquable, structure écrite dans la fiche Carte (vrai titre qui contient le bouton, zone cliquable étendue à la carte, focus sur la carte) ; bouton rond, l'icône suit le diamètre (20 pour 44, 22 pour 56) ; survol écrit des vignettes de badge (contour de 2 px `bordure-action` dessiné à l'intérieur) et des points inactifs de l'Introduction (`fond-controle-survol`) ; grille de Mes badges en colonnes automatiques, tuile au moins aussi large que le libellé le plus long + padding + bordure (132 aujourd'hui) (1 colonne à 320, 2 à 375, 3 à partir de 800) ; « Passer » de l'Introduction dans la rangée de la barre, zone de 44 du Lien texte, centré sur le logo ; taux de complétion, écart anneau / texte en Rangée (12) à toutes les largeurs, le titre passe sur deux lignes à 320, 375 et 800 ; `.fiche-carte` remplacée par la carte commune (aucun contenu à bord perdu, pas de variante). Côté écran : rien à faire, écrans déjà conformes.
- Lien texte : padding horizontal 6, zone de 44 (lien dans une phrase : zone de 44 sans changer la phrase). Côté écran : rien à faire, écrans déjà conformes.
- Ligne de cours à une colonne : le statut passe sous le titre dès que le titre devrait couper un mot, à toutes les largeurs (plus de seuil à 375 px) ; titre sans césure automatique à toutes les largeurs. Côté écran : fait (« De ton formateur », Terrain, résultats de recherche, Détail d'un thème).
- Rangée des badges de la carte « Prochain badge » : les vignettes ne sont pas des contrôles (la règle des rangées de contrôles ne s'y applique pas) ; les six badges restent sur une ligne quand ils tiennent, sinon ils passent en deux rangées égales de trois ; le lien « Mes badges · X/6 » est toujours seul sur sa ligne, sous les badges, à droite. Règle : `ds-principes-composants.md`, Composants d'écran. Côté écran : fait (dashboard apprenant, versions horizontale et verticale).
- Rôle Titre de ligne : pas de césure automatique, c'est la règle du rôle (et non une exception) ; dans une ligne, c'est le statut qui passe sous le titre (fiche Ligne de liste) ; filet : coupure sans tiret si un mot ne tient pas sur toute la largeur. La césure des titres vaut pour les titres de page, de contenu, de section, mis en avant et de carte. Règle : `docs/tokens/typographie.md`, sections 5 et 11. Côté écran : fait (toutes les règles au rôle Titre de ligne en `hyphens: manual`).
- Principes : quatre au lieu de six ; « Chaque bloc débouche sur une action » sort des principes (fait produit, décrit dans `docs/ecrans/apprenant.md`, dashboard apprenant) ; « Le statut n'est jamais porté par la couleur seule » devient une contrainte d'accessibilité (WCAG 1.4.1), écrite après les principes ; nouvel énoncé du principe 2, « Ce qu'on ne peut plus retrouver après l'action n'est jamais à un seul geste » ; le principe 3 précise que l'ombre d'illustration (`ombre-illustration`) appartient à l'objet 3D et ne crée pas de profondeur ; numéros changés (2 → 1, 3 → 2, 4 → 3, 6 → 4) et citations mises à jour ; les fiches Modale et Modale de confirmation reprennent les mots du principe 2 (« une action qu'on ne peut plus retrouver » au lieu de « qu'on ne peut pas défaire »). Côté écran : /design-system seulement (« Contrainte d'accessibilité » à la place de « Principe »).
- Surtitre « Thème N » : `texte-accent` partout. Côté écran : rien à faire, écrans déjà conformes.
- Fond du document : `html` et `body` prennent le `fond-page` du mode actif (`html[data-mode]`), y compris pendant les questions du parcours formateur ; les conteneurs ne reposent plus ce fond ; une surface fixe ou collante le garde. Côté écran : rien à faire, écrans déjà conformes.
- Choix : repère d'une seule valeur, 22 px, au repos et choisi ; l'état choisi se voit au remplissage, jamais à la taille (la fiche disait « repère de 22 à 24 px »). Côté écran : rien à faire, écrans déjà conformes.
- Champ : le focus de la liste déroulante suit le clavier, comme un bouton (`:focus-visible`) ; la liste déroulante rejoint la règle commune des champs pour le fond (`--fond-champ`), la bordure et la police. Côté écran : rien à faire, écrans déjà conformes.
- Titre de section : le rôle est porté par une classe commune (`.titre-section`, `shared.css`), plus par la balise ; la règle `.espace-page h2` est retirée (typographie.md, section 7 : le rôle ne dépend pas de la balise). Côté écran : rien à faire, écrans déjà conformes.
- Titre de page : même traitement, classe commune `.titre-page` (`shared.css`) ; la règle `.espace-page h1` est retirée et les sélecteurs à deux classes écrits pour lui échapper redeviennent simples (`.dc-titre`, `.theme-entete-titre`, `.fm-titres h1`, `.fin-quiz-titre`). Aucun titre ne change. Côté écran : rien à faire, écrans déjà conformes.
- Classe des titres : chaque titre porte la classe commune de son rôle, sans condition (`.titre-page`, `.titre-contenu`, `.titre-mis-en-avant`, `.titre-section`, `.titre-carte`, `.titre-ligne`, `shared.css`) ; la classe écrit seule la typographie du rôle (avec `text-wrap: balance`), la règle propre d'un titre ne garde que sa place (typographie.md, section 7 ; regles-agent.md). 30 règles propres devenues vides sont supprimées ; aucun titre ne change. `npm run tokens` échoue si un token `--typo-titre-…` est lu hors de sa classe. Côté écran : rien à faire, écrans déjà conformes.
- Couleur d'un titre : la classe du rôle pose `texte-principal` ; quand le fond ou un état l'impose, la règle propre change la couleur, et seulement elle, par un rôle de couleur de texte (typographie.md, section 7 ; regles-agent.md). Le bloc de tête du dashboard, Étape suivante, Suite du thème, la correction du quiz, la barre et la carte badge de la fin de quiz et le toast prennent ainsi la classe de leur rôle ; les noms de tokens de `/design-system` aussi (`.titre-carte`, `.titre-ligne`), avec la césure du rôle. `text-wrap: balance` est porté par la classe du rôle (typographie.md, regles-agent.md, ds-principes-composants.md). Au lot 14, les derniers titres en attente prennent leur rôle : « Taux de complétion » (`.titre-carte`), les échantillons « Aa » et le nom de la ligne de démonstration de `/design-system` (`.titre-ligne`) ; « Personne à relancer » sort des titres (première ligne d'un état de page, ci-dessous). Plus aucune règle en attente dans le contrôle des titres. Côté écran : rien à faire, écrans déjà conformes.
- Première ligne d'un état de page : la première ligne d'un état de page (Chargement, Erreur, Vide) prend le rôle du message, en variante `-fort` (typographie.md, section 8 ; regles-agent.md ; renvoi dans ds-principes-composants.md, États de page). Un état de page d'une seule ligne, comme « Chargement… », n'a pas de première ligne et garde le rôle du message sans variante `-fort` ; la variante `-fort` ne vaut que lorsqu'une autre ligne suit. La liste est fermée : un titre de carte n'est pas concerné. « Taux de complétion » quitte les exemples du Titre de section pour ceux du Titre de carte (typographie.md, section 6 ; regles-agent.md). Côté écran : rien à faire, écrans déjà conformes.
- Sélecteurs où `.espace-page` précédait une classe : `.fd-jour-titre` et les règles `… > *:first-child` des pages (`fm-page`, `page-theme`, `dash-page`, `formateur-dashboard-page`, `page-terrain`, `page-cours`) redeviennent simples, styles calculés identiques. La règle des champs posés sur la page (`.espace-page > .champ …`) garde son sélecteur. Côté écran : rien à faire, écrans déjà conformes.
- Bornes de texte des blocs du dashboard : une seule valeur, 210 px (mise-en-page.md, section 3, disait « 200 à 210 px ») ; le titre « Quiz flash », seul à 200, ne l'atteignait pas. Côté écran : rien à faire, écrans déjà conformes.
- Centrages optiques (espacements.md, section 9) : la plage « 2 à 8 px » est remplacée par une liste fermée de quatre cas ; un nouveau centrage optique ne se crée pas, il se signale en « À trancher » (aussi dans regles-agent.md, section 5). Les chevrons à 14 et 16 px des lignes sur plusieurs colonnes n'en font pas partie : le chevron est centré sur la vignette, ces valeurs en sont le résultat (apprenant.md, Lignes sur plusieurs colonnes). Côté écran : rien à faire, écrans déjà conformes.
- Descriptions de tokens (valeurs inchangées) : `ombre-illustration` ne cite plus l'Introduction ; `espace-champ` dit « icône de 20 px, à 16 px du bord ». Côté écran : rien à faire, écrans déjà conformes.
- `bordure-controle` devient commun aux deux modes : retiré des fichiers de mode, déclaré dans `semantiques-communs`. Côté écran : rien à faire.
- Règle des pastilles de statut (applique la décision 1.1.0, règle dans `ds-principes-composants.md`) : un cours pas encore ouvert s'affiche en pilule (Non commencé et À faire en `texte-secondaire` sur `fond-neutre`, Nouveau en `texte-accent` sur `fond-accent`) ; un cours déjà ouvert s'affiche sans pilule, en texte avec une icône (En cours en `texte-accent` avec l'icône de progression, Terminé en `texte-succes` avec la coche). Aucune pastille n'utilise `fond-action`, `fond-marque` ni `fond-recompense`. Côté écran : rien à faire, `StatutBadge` porte la règle ; un statut de cours s'affiche toujours avec `StatutBadge` (fait pour l'Activité récente du dashboard formateur, le score « Quiz N % » restant à côté, hors du composant).
- Règles remontées dans la documentation (`ds-principes-composants.md`) depuis `regles-agent.md`, sans changement : typographie, ponctuation, survol et tactile, toast de complétion, texte de l'onglet inactif de la navigation, texte de l'option sélectionnée d'une liste déroulante, tokens de texte des deux variantes du logo. Sans changement de rendu. Côté écran : rien à faire.
- Règle des séparateurs précisée (évolution mineure) : Dans une liste disposée en plusieurs colonnes, le dernier élément de chaque colonne n'a pas de séparateur. Sans changement de rendu. Côté écran : rien à faire.
- Description de `bordure-separateur` complétée avec la même phrase (valeur inchangée). Côté écran : rien à faire.
- Conduite de l'agent (`regles-agent.md`, section 7, évolution mineure) : quand une information manque (un état, une valeur, un détail), l'agent n'écrit rien à cet endroit, laisse un commentaire EN ATTENTE et propose l'option la plus proche dans son rapport, sans l'appliquer. Côté écran : rien à faire.

**Corrigé**

- Barre de la carte de la checklist rendue à 0 px (base flex nulle) : rendue à 8, piste visible. Côté écran : rien à faire, écrans déjà conformes.
- Carte de l'ombre flottante absente de `/design-system` depuis le passage de l'ombre en token. Côté écran : rien à faire, écrans déjà conformes.
- `bordure-controle` pointe vers `ardoise-450` : au moins 3:1 contre chaque fond voisin d'un contrôle (3,92 sur blanc, 3,40 sur `fond-page` apprenant, 3,57 formateur, 3,02 sur le survol lavande). Applique la décision 1.0.1. Côté écran : rien à faire, les contrôles interactifs lisent déjà `bordure-controle`.

**Déprécié**

Aucune entrée.

**Retiré**

- Règles à 768 px d'espacement devenues redondantes (même rôle des deux côtés), retirées avec leur lot : en-tête de page et liste de `LigneCours` ; grille des thèmes et carte de thème ; `.espace-nav-item` (gap) ; padding desktop de la Modale ; écart serré sous la barre de l'Introduction et marge du bouton qui la suivait ; cartes et menu « … » de l'espace formateur, grilles et cartes de Mes cours et Mes groupes ; `.dc-avancement-corps` (Détail cours) ; 14 règles du dashboard apprenant (en-tête, grille, blocs de tête, quiz flash et badges en colonne, Mes badges) ; 11 du dashboard formateur ; 3 de Création de cours ; 4 de la fiche de cours. Liste exacte dans les messages des commits « Espacements, lot N ». Côté écran : rien à faire, écrans déjà conformes.
- `src/components/formateur/Modale.jsx` et les classes `fm-voile`, `fm-modale-*`, `fm-bouton-danger` de `Formateur.css`. Côté écran : utiliser `src/components/Modale.jsx`.
- Variables `--taille-h1`, `--taille-titre-cours`, `--font-display` et `--font-body` (`:root` de `src/styles/shared.css`). Côté écran : utiliser les rôles `font: var(--typo-<rôle>)` ; plus aucun usage dans `src/`.
- Variables `--radius-carte`, `--radius-carte-petite`, `--radius-reponse`, `--radius-pill` et `--radius-badge` (`:root` de `src/styles/shared.css`). Côté écran : utiliser les rôles `border-radius: var(--rayon-<rôle>)` ; plus aucun usage dans `src/`.
- Mise en page : `.espace-page { max-width: 1400px }` (jamais atteinte), seuils 1100 des thèmes, de Mes groupes et de `/design-system`, débord et défilement des filtres d'Activité récente, règles locales de focus devenues redondantes (carte de thème, lignes de choix et cartes du parcours, Formateur, dashboard formateur, Création de cours), opacité de la liste déroulante désactivée. Liste exacte dans les messages des commits « Mise en page, lot N ». Côté écran : rien à faire, écrans déjà conformes.
- Lot 17 : copies locales de la règle du champ en erreur (Détail groupe, Création de cours) ; padding de 8 du texte de l'aperçu de Création de cours. Côté écran : rien à faire, écrans déjà conformes.
- Code mort après le passage de Mot de passe oublié et Nouveau mot de passe au gabarit du parcours : `.page-logo-wrapper`, `.page-logo`, `.flow-card h1`, `.flow-card p.souscription`, `.lien-retour` et ses variantes (`shared.css`). Côté écran : rien à faire, écrans déjà conformes.
- Variante « Quiz (10 px) » de la Barre ; règles locales de focus, de désactivé (opacités 0,35 à 0,6) et d'autoremplissage des écrans. Côté écran : rien à faire, écrans déjà conformes.
- Règles `.espace-page h2` et `.espace-page h1` (`src/styles/espace-layout.css`) ; illustrations SVG inutilisées de `src/Assets/badge/` ; lecture des colonnes `badges.icone` et `badges.description` (non utilisées). Côté écran : rien à faire, écrans déjà conformes.

**Écrans corrigés**

- Modale de confirmation (Création de cours, Détail cours, Détail groupe) : « Annuler » passe de lien texte à bouton secondaire, désactivé en lavande pendant l'action.
- Barre d'enregistrement de Création de cours (desktop et mobile) : « Annuler » passe de lien texte à bouton secondaire, de même hauteur que le bouton d'enregistrement.
- Modale « Insérer une vidéo » (Création de cours) : « Annuler » passe de lien texte à bouton secondaire.
- Modale « Nouveau groupe » (Mes groupes, dashboard formateur) : « Annuler » passe de lien texte à bouton secondaire.
- Modale « Assigner des cours » (Détail groupe) et modale « Assigner à des groupes » (Détail cours) : « Annuler » passe de lien texte à bouton secondaire, désactivé en lavande pendant l'enregistrement.
- Quiz de cours et quiz flash : une réponse déjà sélectionnée garde le contour de focus clavier (contour `bordure-focus` et halo `bordure-focus-halo`).
- Parcours d'entrée : une ligne de choix sélectionnée garde le contour de focus clavier (contour `bordure-focus` et halo `bordure-focus-halo`).
- Conteneur de page (`.espace-page`, `src/styles/espace-layout.css`) : les 12 px ajoutés sous le premier bloc sont retirés, l'écart entre deux blocs vaut 20 px partout, comme le veut le rôle « écart entre deux blocs consécutifs d'une page ». Seul rendu modifié : l'extrait du Design System (`/design-system`), entre l'en-tête et la première section ; les autres pages annulaient déjà ces 12 px ou n'ont qu'un bloc (états de chargement et d'erreur du dashboard apprenant).
- Bouton principal désactivé (style commun `.bouton-primaire:disabled`) : fond `fond-action-desactive` et texte `texte-action-desactive` au lieu d'une opacité de 0,6. Écran dont le rendu change : quiz de cours et quiz flash (bouton du bas désactivé pendant l'envoi ou sans réponse choisie) ; les écrans formateur, le parcours d'entrée et la barre de Création de cours avaient déjà ce rendu.
- Bouton rouge de la Modale de confirmation désactivé pendant l'action : fond `fond-action-desactive` et texte `texte-action-desactive` au lieu d'une opacité de 0,6.
- Toutes les modales (Nouveau groupe, Assigner des cours, Assigner à des groupes, Insérer une vidéo, confirmations) : ombre `--ombre-flottante`, comme le veut la règle des ombres.
- Modale de confirmation (Création de cours, Détail cours, Détail groupe) : à l'ouverture, le focus va sur « Annuler » ; Tab reste dans la modale. Le libellé du bouton qui confirme n'a plus de valeur par défaut et nomme le verbe et l'objet : « Supprimer le cours », « Supprimer le groupe », « Retirer l'élève », « Supprimer la question », « Supprimer l'étape », « Retirer la checklist », « Quitter sans enregistrer ».
- Menu d'actions « … » (Création de cours, Détail cours, Détail groupe) : Entrée ou Espace sur le bouton ouvre le menu et place le focus sur la première action ; les flèches passent d'une action à l'autre ; Échap ferme le menu et rend le focus au bouton ; Tab et Maj+Tab ne passent plus d'une action à l'autre : depuis une action, ils ferment le menu et placent le focus sur l'élément suivant (ou précédent) de la page.
- Modale (bouton « Fermer », boutons d'action) et Menu d'actions (bouton « … », actions) : focus clavier commun (contour `bordure-focus` et halo `bordure-focus-halo`) au lieu du contour natif du navigateur.
- Boutons principal et secondaire, partout (style commun `.bouton-primaire` et `.bouton-secondaire` de `shared.css`) : focus clavier commun (contour `bordure-focus` et halo `bordure-focus-halo`) au lieu du contour natif du navigateur. La règle locale de la Modale pour ces boutons est retirée, devenue redondante. Écrans dont le rendu change : parcours d'entrée (Introduction, Connexion, questions et Création du compte), Mot de passe oublié, Nouveau mot de passe, dashboard apprenant, fiche de cours (leçon, quiz et quiz flash, fin de quiz, checklist, récap), dashboard formateur, dashboard admin, Mes cours, Mes groupes, Détail cours, Détail groupe, modales, page /design-system. Création de cours avait déjà ce rendu (règle sur tous ses boutons).
- Typographie, migration en 14 lots vers `font: var(--typo-…)`, chaque texte dans son rôle : lot 1 Détail d'un thème ; lot 2 Cours et Terrain (`EntetePage`, `LigneCours`) ; lot 3 composants partagés (`BlocFormateur`, `ReperEtapes`, `CompletionToast`) ; lot 4 `ContenuMarkdown`, `quiz.css`, `Dropdown` ; lot 5 parcours d'entrée ; lot 6 `espace-layout.css` et Modale ; lot 7 boutons, champs et messages (`shared.css`) ; lot 8 espace formateur (Mes cours, Mes groupes, `Formateur.css`) ; lot 9 Détail groupe et Détail cours ; lot 10 dashboard apprenant ; lot 11 dashboard formateur et admin ; lot 12 Création de cours ; lot 13 fiche de cours (leçon, quiz et quiz flash, fin de quiz, checklist, récap ; « Quitter l'aperçu » de l'aperçu élève en Bouton) ; lot 14 `index.css` et page /design-system.
- Variante Retour : Mot de passe oublié (lot 7), espace formateur, Détail cours et Détail groupe (lot 8), Création de cours (lot 12) passent dans la variante (pilule blanche, chevron, libellé en rôle Bouton). Nom accessible « Retour à <libellé> » : Mot de passe oublié (« Retour à la connexion »), espace formateur et Création de cours (`RetourFormateur`), fiche de cours et Détail d'un thème (`3348c76`).
- Fin de quiz, quiz de cours et quiz flash : le score s'affiche en pourcentage seul (« 80 % », Chiffre mis en avant grand), le « 4/5 » est retiré de cet écran ; le repère d'étapes et le récap gardent « 4/5 ».
- Croix de fermeture de la modale Mes badges et flèches Monter / Descendre de la remise en ordre (checklist) : icônes SVG (`croix.svg`, `chevron-left.svg` tourné) au lieu des caractères « × », « ↑ » et « ↓ », comme le veut la règle « Croix et flèches : icônes SVG » ; plus de texte rendu dans la police du navigateur (les flèches s'affichaient en Arial). Noms accessibles inchangés.
- Rayons, migration vers les rôles : chaque `border-radius` de `src/` lit `var(--rayon-<rôle>)` (175 déclarations sur 186 ; les 11 règles à 768 px qui répétaient le même rôle sont retirées). 30 changements visibles (écart de 4 px ou plus), 51 discrets, 105 inchangés. Visibles : en-têtes sur desktop (en-tête de page, bloc de tête du dashboard, en-tête de la leçon, 36 → 30) et slides d'introduction ; menus (menu de la navigation, menu déroulant, menu « … » sur desktop) et leurs entrées ; cartes de thème, de Mes cours et de Mes groupes sur mobile (26 → 30) ; sommaire de Création de cours ; cartes « Cours assignés » et carte pointillée du Détail groupe ; barre d'enregistrement mobile de Création de cours ; entrée active de la tab bar mobile et champ « Prénom » du parcours, en pilule ; images, vidéos et tableaux hors leçon, image de la visionneuse ; miniatures (Détail cours, étiquette d'image) ; grand badge du « Prochain badge » sur desktop (32 → 22). La page /design-system lit les rayons dans `tokens/`.
- Vignettes carrées en Rond : objet du thème dans les listes (dashboard, Cours, Terrain, recherche) et badges de la collection. À 22 sur 48 px, la forme n'était ni carrée ni ronde.
- Case des modales « Assigner des cours » (Détail groupe) et « Assigner à des groupes » (Détail cours) : case à cocher dessinée en rond, passée en Case.
- Étape en cours de la checklist : quand elle est la première de la liste, elle est à 8 px du haut de la carte (au lieu de 14), comme sur les côtés.
- Espacements, migration en 17 lots vers `var(--espace-<rôle>)` : lot 1 Détail d'un thème ; 2 Cours et Terrain (`LigneCours`, `EntetePage`) ; 3 page Cours et « De ton formateur » ; 4 repère d'étapes, toast, retour de remise en ordre ; 5 `ContenuMarkdown`, `Dropdown` ; 6 `espace-layout.css` (Conteneur, tab bar, barre du haut, menu, pastilles de statut) ; 7 `shared.css` (boutons, champs, voile, pages hors navigation) ; 8 Modale ; 9 parcours d'entrée ; 10 espace formateur, Mes cours, Mes groupes ; 11 Détail groupe ; 12 Détail cours ; 13 dashboard apprenant ; 14 dashboards formateur et admin ; 15 Création de cours ; 16 fiche de cours ; 17 page /design-system.
- Survol et appui en `fond-accent` (rayon Élément) au lieu du titre en `texte-accent` : lignes du Détail d'un thème, du Mode terrain et des résultats de recherche (`LigneCours`), de « De ton formateur » (dashboard et page Cours), de l'Activité récente du dashboard formateur.
- Cartes de liste (carte à 8, lignes et en-tête à 12, texte à 20 du bord) : Détail d'un thème, Mode terrain, recherche, « De ton formateur », Activité récente, checklist.
- Dashboard formateur : la rangée « + Nouveau groupe / + Nouveau cours » passe à la ligne à 320 px ; la page ne défile plus horizontalement. Tableaux du Détail groupe et du dashboard admin : défilement horizontal dans leur carte.
- En-tête lavande de Cours et Terrain sur desktop : l'objet 3D reste dans le cadre (hauteur minimale).
- Repère d'étapes : la ligne de liaison va d'un centre de pastille à l'autre, quel que soit le padding.
- Dashboard apprenant, écart entre les blocs (`.dash-blocs`, mobile et desktop) : Entre deux blocs (20) au lieu de Répétition (8). Rangement contraire à la définition du rôle : bloc de tête, Prochain badge, Quiz flash et « De ton formateur » sont des blocs de natures différentes, Répétition ne vaut que pour des éléments de même nature répétés.
- Barre du haut desktop (`.espace-nav`) : côté logo, Padding d'une Surface (20) au lieu de Bloc près du bord (8) ; haut, droite et bas restent à 8. Rangement contraire à la définition du rôle : Bloc près du bord ne vise qu'un bloc à fond posé près du bord (les entrées), le logo n'a pas de fond. Tab bar mobile inchangée (exception écrite).
- Titres sans équilibrage des lignes : `text-wrap: balance` ajouté aux 21 règles de titre qui ne l'avaient pas (dérive : la règle le demande pour tout rôle de titre). Composants : `ContenuMarkdown` (rôles Titre de contenu et Titre de ligne, intertitre `h4`), `CompletionToast`, `LigneCours`, `BlocFormateur`, menu « … » (`MenuActions`). Écrans : lignes du Détail d'un thème, fin de quiz (titre de la barre, nom du badge), checklist (« X étapes sur N »), récap, modale Mes badges, dashboard formateur (« Taux de complétion », groupes, « Personne à relancer », étapes de « Pour bien démarrer », tableau admin), élèves du Détail groupe, questions repliées de Création de cours, cartes du Choix du profil. Seules des coupures de ligne de titres changent. Hors champ : les noms de tokens de la page /design-system (identifiants, pas titres).
- Mise en page, formulaires, états de page, 16 lots puis `/design-system` (commits « Mise en page, lot N ») :
  - Page Cours : « Tout voir » du dashboard s'arrête à 104 sur desktop et à zone de sécurité + 20 sur mobile (avant 110) ; thèmes en 4 colonnes dès 1040 ; carte de thème, objet → « Thème N » et nom → état à 12 ; « Aucun cours ne correspond » à 20 sous l'en-tête ; texte indicatif « Rechercher un cours » ; loupe dans la recherche ; sous 768, la recherche commence sous l'objet 3D.
  - Détail d'un thème : colonne Lecture (880 de contenu au lieu de 832) ; thème sans cours : « Aucun cours dans ce thème. », en-tête sans compteur.
  - « De ton formateur » (page Cours) : 2 colonnes à 800 (3 avant), 3 dès 1040.
  - Leçon : sous 768, l'objet du thème passe au-dessus, à droite, le titre prend toute la largeur (5 → 3 lignes à 320) ; fin de quiz en colonne Formulaire (440) ; message si la progression ne s'enregistre pas.
  - Quiz flash : état sans question en `texte-secondaire` ; message si le score ne s'enregistre pas.
  - Introduction : tient sans défilement à 320 × 568 sur les trois slides ; 375 × 667 inchangé.
  - Parcours : champ en erreur marqué (Connexion, Création du compte) ; Mot de passe oublié et Nouveau mot de passe sur le gabarit de la Connexion.
  - Dashboard formateur : filtres et recherche d'Activité récente à 48, à la ligne, la recherche passe sous les filtres à 800 ; loupe 20 à 16 du bord.
  - Détail groupe : rangée d'ajout à 48, enveloppe à 16, loupe dans la recherche des élèves, email en erreur marqué, message si l'assignation échoue.
  - Mes cours : loupe dans la recherche. Détail cours : message si l'assignation échoue.
  - Création de cours : barre d'outils de l'éditeur à la ligne ; liste déroulante du Thème sans contour en double ; « Bonne réponse » à un seul indicateur de focus ; champs en erreur marqués.
  - Toute l'app : texte indicatif en `texte-secondaire` ; « Chargement… » en Texte secondaire ; messages d'erreur sans le message technique de la base ; colonne Formulaire 440 pour l'écran de chargement de l'app ; option de la liste déroulante avec le contour de focus au clavier.
  - `/design-system` : grille en colonnes automatiques (240) ; 3 colonnes à 1040 (2 avant), la carte large sur deux colonnes dès 768.
  - Lot 17 : « De ton formateur » sans séparateur sous le dernier élément de chaque colonne, quel que soit le nombre de cours (avant : un trait restait sous un cours seul dans sa colonne) ; Thème de Création de cours marqué en erreur ; écran « Chargement… » de l'app, bas de page à 40 ; aperçu vide de Création de cours, texte à 16 du bord de l'aperçu (24 avant) ; Connexion, message d'authentification inconnu : « La connexion n'a pas pu se faire. Réessaie. » au lieu du message anglais.
- Lot 1, socle : focus double, champs `.champ` bordés, appui et désactivé communs, menus à 48, pointillés à 48, fond du document.
- Lot 2, composants partagés : parcours (bouton 48, champs bordés, liens), recherche de Cours, listes déroulantes, modales, lignes de cours et « De ton formateur », menus « … » et rond « + » à 44, anneaux (dashboard apprenant, taux de complétion, `/design-system`).
- Lot 3, écrans apprenant : dashboard (boutons à flèche, barres, ombre, liens), leçon, quiz (barre 14, bouton 48), checklist (barre visible), Mes badges (520), carte de thème, Détail d'un thème, Introduction (ombre), aperçu élève (« Quitter l'aperçu » 48).
- Lot 4, écrans formateur : en-tête du dashboard (48), relances (bouton rond 44), liens, recherche « Un élève », Pour bien démarrer, Détail groupe (champ email), Détail cours (barre empilée 8).
- Lot 5, Création de cours : champs et éditeur bordés, énoncé à bouton (52 / 44), croix 44, onglets et pastilles 44, outils et barre d'enregistrement 48.
- Lot 6, `/design-system` : vitrine des fiches, ombres lues dans les tokens.
- Lot 7, point de revue final : champs multilignes de Création de cours (énoncé, « À retenir », éditeur de leçon) sans poignée de redimensionnement, hauteur ajustée au contenu (la poignée mordait l'arrondi de la bordure) ; « Image » d'une étape 40 → 48 (outil) et pilule « Bloquante » 40 → 44 (choix) ; Mes badges à 320 (« Persévérant » n'est plus coupé, une colonne).
- Lot 8, cartes cliquables : carte de thème, de profil, de Mes cours et de Mes groupes sur `.carte-cliquable` (titre `h2` / `h3` qui contient le bouton nommé par lui, zone cliquable étendue à la carte, focus sur la carte). Rendu, focus et appui inchangés au pixel.
- Dashboard formateur, Activité récente : pastille du groupe en lavande (classe commune `.fm-pastille-groupe`) au lieu du gris.
- Introduction : plus d'ombre d'illustration sous l'objet, qui ne déborde pas du bloc.
- Parcours d'entrée (statut, tranche d'âge, motivation) : rond de 22 px au repos et choisi (24 / 28 avant) ; la grille des tranches d'âge ne grandit plus au choix à 320. Modale d'assignation des cours : case de 22 px (24 avant).
- Création de cours : choix des groupes en vraies cases à cocher avec libellé, dessinées comme avant ; « Bonne réponse » et poignée de glisser-déposer avec une zone cliquable de 44 px, dessin et hauteur des lignes inchangés.
- `/design-system` : un échantillon par rôle typographique, tiré des tokens `typo-…` ; la barre de l'échelle des espacements ne déborde plus à 320 et 375.
- Dashboard formateur, « Taux de complétion » : nom de la carte en Titre de carte (18 px · 800, `texte-principal`) au lieu de 21 px · 800 en `texte-secondaire`.
- Dashboard formateur, « Personne à relancer » (Élèves à relancer vide) : Texte secondaire fort (14 px · 700, `texte-succes` gardé) au lieu de 16 px · 800, rôle de la première ligne d'un état de page.
- Dashboard formateur, « Tous tes élèves ont commencé les cours assignés. » (Élèves à relancer vide) : Texte secondaire (14 px · 600, `texte-secondaire`) au lieu de Méta (13 px · 600, `texte-principal`), règle de l'état vide ; contraste 6,0:1 sur `fond-succes`.
- `/design-system`, Ligne de liste : nom de la ligne de démonstration (« Nettoyage du filtre ») en Titre de ligne (16 px · 800 · 1,2) au lieu de la police du bouton (13,33 px).
- Séparateurs (règle précisée, sens inchangé) : `bordure-separateur` seulement entre deux éléments consécutifs de même nature qui se répètent dans un même bloc ; un en-tête, un titre ou une section se sépare par l'espacement. Écrans : tableau des élèves du Détail groupe (desktop), tableau « Cours les plus suivis » du dashboard admin (desktop), tableaux du contenu des leçons, barre d'outils de l'éditeur de leçon (Création de cours).
- Barre d'enregistrement de Création de cours (desktop et mobile) : le point orange devant « Modifications non enregistrées » est retiré, le texte seul porte l'état. `fond-recompense` est réservé à la récompense.
- Bouton supprimer (« Supprimer ce groupe », Détail groupe) : contour `bordure-erreur` ajouté, de la même épaisseur que le bouton secondaire, et survol `fond-erreur`, comme le veut la règle du bouton supprimer.
- Bouton pointillé désactivé : texte `texte-action-desactive` au lieu de `texte-secondaire`, comme tous les boutons désactivés (avec le contour `bordure-action-desactive`).
- Variante Retour, chevron seul sous 768 px, par la classe commune (`.bouton-retour`, libellé dans `.bouton-retour-libelle`, masqué visuellement, nom accessible inchangé, zone de 44 gardée) : Détail d'un thème (« Cours »), leçon et récap de la fiche de cours et aperçu élève (nom court du thème) ; états d'erreur de la fiche de cours (« Retour ») et du quiz flash (« Retour à l'accueil »), qui prennent aussi le chevron ; l'espace formateur, qui le faisait déjà, lit la règle commune.

## 2.0.0 (21 octobre 2026)

Version majeure : retrait des anciennes variables `--color-*` (rubrique « Retiré »), numérotée 1.2.0 à l'origine. Suppression directe sans période de dépréciation : un seul mainteneur, tous les usages migrés (`gouvernance-skillo.md`, section 2).

**Ajouté**

- `texte-sur-action` (`blanc`) : texte et icône posés sur `fond-action` (libellé du bouton principal, coche ou point d'un contrôle coché). Côté écran : le texte blanc d'un bouton principal ou d'un contrôle coché lit `texte-sur-action`.
- `texte-sur-erreur` (`blanc`) : texte et icône posés sur `fond-erreur-accentue` (bouton rouge plein, pastille « Ta réponse » fausse). Côté écran : le texte blanc sur ces fonds lit `texte-sur-erreur`.
- `texte-sur-succes` (`blanc`) : texte et icône posés sur `fond-succes-accentue` (coche d'une bonne réponse, pastille « Bonne réponse »). Côté écran : le texte blanc sur ces fonds lit `texte-sur-succes`.
- Rôles `sur-action`, `sur-erreur` et `sur-succes` dans la liste fermée de `docs/tokens/couleurs.md` ; les sémantiques passent de 40 à 43. Côté écran : rien à faire.

**Modifié**

- Descriptions complétées : `fond-recompense` (le texte posé dessus est toujours encre, jamais blanc) et `bordure-separateur` (uniquement entre les éléments d'une liste, jamais entre des sections). Côté écran : rien à faire.
- Les couleurs de l'app sont lues depuis `src/styles/tokens.generes.css`, généré depuis `tokens/`. Côté écran : lire les sémantiques (`var(--fond-…)`, `var(--texte-…)`, `var(--bordure-…)`), jamais une couleur en dur.
- La miniature « +N » du Détail cours passe d'un voile à 60 % à 85 % (`fond-voile-accentue`). Côté écran : rien à faire.
- Le pointillé d'un bouton d'ajout désactivé s'éclaircit (`bordure-controle`). Côté écran : rien à faire.
- La pastille de groupe du fil d'activité et le sous-texte de la carte « Prochain cours conseillé » passent en `texte-secondaire`. Côté écran : rien à faire.
- Le survol de `.dash-lien` fonce légèrement (`texte-accent-survol`). Côté écran : rien à faire.

**Corrigé**

- 2 textes sur carte violette s'éclaircissent (`violet-75` remplace `#dcd4ff`). Côté écran : rien à faire.
- L'explication du quiz sur le bloc encre s'assombrit légèrement (`ardoise-175` remplace `#e6e3ec`). Côté écran : rien à faire.
- Côté formateur, les ronds, cases et étapes vides prennent `ardoise-175` au lieu de `sable-150`. Côté écran : rien à faire.
- Les boutons en pilule perdent 2 px de marge intérieure horizontale (24 px au lieu de 26). Côté écran : rien à faire.

**Déprécié**

Aucune entrée.

**Retiré**

- Les anciennes variables `--color-…` de `src/styles/shared.css`. Côté écran : utiliser les sémantiques de `tokens/` à leur place.

## 1.1.0 (20 octobre 2026)

Évolution mineure de la règle des pastilles de statut (registre de `gouvernance-skillo.md`).

Statut : décidée le 20 octobre 2026, pas appliquée à cette date. Appliquée en 3.0.0.

**Ajouté**

Aucune entrée.

**Modifié**

- Pastille « En cours » : nouveau rendu sans fond violet plein. La pilule violette pleine se lisait comme un bouton ; un style réservé garde son sens (violet plein = action). Côté écran : rien à faire.
- Pastille « Nouveau » : orange retiré. L'orange est réservé à la récompense, et « Nouveau » n'en est pas une. Côté écran : rien à faire.

**Corrigé**

Aucune entrée.

**Déprécié**

Aucune entrée.

**Retiré**

Aucune entrée.

## 1.0.1 (20 octobre 2026)

Statut : décidée le 20 octobre 2026, pas appliquée à cette date. Appliquée en 3.0.0.

**Ajouté**

Aucune entrée.

**Modifié**

Aucune entrée.

**Corrigé**

- Contour des contrôles : contraste de 1,5:1 sur blanc, remonté au-dessus de 3:1 (contrainte WCAG 1.4.11 que le système s'était donnée). La règle ne change pas. Côté écran : rien à faire.

**Déprécié**

Aucune entrée.

**Retiré**

Aucune entrée.

## 1.0.0 (20 octobre 2026)

Point de départ : état du 20 octobre 2026, après les tokens et les principes.

**Ajouté**

- Exception acceptée : ombre intérieure pour neutraliser l'autoremplissage du champ (contrainte technique, un seul endroit). Côté écran : rien à faire.

**Modifié**

Aucune entrée.

**Corrigé**

Aucune entrée.

**Déprécié**

Aucune entrée.

**Retiré**

Aucune entrée.
