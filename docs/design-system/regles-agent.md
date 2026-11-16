# Règles du design system Skillo

Ce fichier se rédige depuis la documentation du DS (docs/tokens/, docs/design-system/), jamais depuis le code. Quand le code et la documentation divergent, le fichier suit la documentation et l'écart est noté comme dérive à corriger dans le code.

Référence unique du DS pour un agent qui construit un écran, et pour le mainteneur. Version publiée : 2.0.0. Brouillon en cours : 3.0.0 (voir `notes-de-version.md`).

Ce fichier assemble des règles déjà écrites ailleurs : il n'en crée aucune. Chaque règle renvoie à sa source. Quand deux sources se contredisent, la contradiction est listée dans « À trancher » à la fin, sans être résolue ici.

## 0. Comment lire ce fichier

Ordre : les sources et ce qui fait foi (1), les principes qui départagent deux options (2), les tokens (3), les composants documentés (4), les règles qui traversent tous les écrans (5), des exemples d'erreurs à éviter (6), la conduite à tenir quand le DS ne suffit pas (7), puis les points à trancher.

Pour un écran : lire 1 et 7 une fois, puis chercher le composant en 4, les tokens en 3 et les règles transverses en 5.

**Type du cas → version** (`gouvernance-skillo.md`, sections 1 et 4)

« Correction » est le **type du cas** (ce qui s'est passé). « Correctif » est le **niveau de version** qu'une correction produit (comme mineure et majeure pour une évolution).

| Type | Ce que c'est | Version | Note de version | Registre |
|---|---|---|---|---|
| Dérive | Un écran ne suit pas une règle du DS. On corrige l'écran. | Aucune | Oui, rubrique « Écrans corrigés » de la version suivante | Non |
| Correction | Le système ne respectait pas une règle ou une contrainte qu'il s'était donnée. On corrige la valeur, la règle ne change pas. | Correctif | Oui | Oui |
| Évolution | Mineure : on ajoute un élément, ou on change le rendu d'un élément existant sans obliger à modifier les écrans qui l'utilisent. Majeure : un token ou un composant est retiré ou renommé, ou un comportement change au point qu'un écran conforme ne l'est plus. | Mineure ou majeure | Oui | Oui |
| Exception | Un écran a besoin de s'écarter d'une règle. | Aucune | Non | Oui |

Une demande d'exception nomme l'écran, la règle concernée, ce que le système propose déjà et pourquoi ça ne suffit pas.
- Acceptée si une contrainte technique ou d'accessibilité empêche d'appliquer la lettre de la règle, si la solution respecte l'intention de la règle et si elle reste limitée à un endroit nommé.
- Refusée si le système a déjà une réponse (token ou composant existant), si la demande relève de la préférence, ou si elle prend un style réservé pour un autre usage.
- Une exception devient une évolution de la règle dès que le même besoin apparaît à un deuxième endroit.

## 1. Sources

- Décisions qui expliquent les tokens : `docs/tokens/couleurs.md`, `docs/tokens/espacements.md`.
- Typographie (police, échelle, graisses, rôles, états, contrôles, italique) : `docs/tokens/typographie.md`. Section 5 « Typographie » de ce fichier.
- Rayons (rôles, ordre de choix, règles d'usage) : `docs/tokens/rayons.md`. Section 5 « Rayons » de ce fichier.
- Mise en page (largeurs de colonne, seuils, haut du contenu et ancres, colonnes de lignes, rangées de contrôles, exceptions) : `docs/tokens/mise-en-page.md`. Section 5 « Mise en page » de ce fichier.
- Principes et composants : `docs/design-system/ds-principes-composants.md`.
- Gouvernance, registre et versions : `docs/design-system/gouvernance-skillo.md`, `docs/design-system/notes-de-version.md`.
- Règles transverses de rendu (section 5) : `docs/design-system/ds-principes-composants.md` (séparateur, césure des titres, ponctuation, survol et tactile, navigation, liste déroulante, logo, objet 3D du thème, chevrons, toast de complétion) ; règle des deux ombres et bouton orange unique : registre de `docs/design-system/gouvernance-skillo.md` ; focus : `docs/tokens/couleurs.md` (décision 4).

## 2. Principes

La direction artistique est chaleureuse et motivante : fonds crème (`fond-page` en mode apprenant), violet franc (`fond-marque`, `fond-action`), orange réservé à la récompense (`fond-recompense`).

Chaque principe tranche entre deux options. La première est retenue, la seconde écartée (`ds-principes-composants.md`).

1. **Un style réservé garde son sens.** L'orange réservé à la récompense, l'XP et le quiz flash, pour qu'il veuille toujours dire « tu gagnes quelque chose », **contre** l'orange utilisé pour attirer l'œil sur d'autres boutons.
2. **Ce qu'on ne peut plus retrouver après l'action n'est jamais à un seul geste.** Supprimer rangé dans le menu « … », en dernier, en rouge, avec une confirmation, une étape de plus même pour un petit objet, **contre** un bouton Supprimer directement sur la page, une perte définitive en un geste. Test : après l'action, peut-on retrouver ce qui était là, y compris ce que l'objet emporte (la progression des élèves, par exemple) ? Ce qui se retrouve n'est pas concerné : une confirmation y reste un choix d'écran (retirer un cours ou un élève d'un groupe n'efface ni progression, ni score, ni badge).
3. **La profondeur vient du fond, pas des traits ni des ombres.** Des fonds différents (champ ou bloc sur une carte, carte sur la page) et une seule ombre de profondeur (`ombre-flottante`), réservée à ce qui flotte, **contre** une ombre sous les cartes et des traits entre les blocs. L'ombre d'illustration (`ombre-illustration`) appartient à l'objet 3D et ne crée pas de profondeur. La bordure de 2 px `bordure-controle` des champs et des contrôles n'est pas de la profondeur : c'est leur limite visible (décision du 12/11, `ds-principes-composants.md`, Champ).
4. **On n'affiche que ce que la donnée sait vraiment.** Le pourcentage seul pour les anciens passages de quiz, **contre** un score « 4/5 » recalculé avec le nombre actuel de questions.

**Contrainte d'accessibilité.** Le statut n'est jamais porté par la couleur seule (WCAG 1.4.1) : des étiquettes (« Ta réponse », « Bonne réponse ») avec une icône, jamais une correction en vert et rouge uniquement. C'est un minimum, pas un choix de Skillo.

## 3. Tokens

### Niveaux

- **Primitifs** : valeurs brutes, nommées `famille-nuance` (la nuance découle de la clarté). Un composant ne lit jamais un primitif.
- **Sémantiques** : ce que lisent les composants. Chaque sémantique pointe vers un primitif.
- **Composant** : vide, et c'est voulu. Un contexte se résout en choisissant d'autres sémantiques, pas en créant un token de composant (`couleurs.md`, décision 1).
- **Espacements** : des primitifs nommés par leur valeur (`espace-20`), jamais lus par un composant ; un rôle est un alias (`espace-<rôle>`) qui pointe vers un primitif (`espacements.md`, section 11).
- **Rayons** : un seul niveau, des tokens de rôle nommés par leur rôle (`rayon-<rôle>`), sans primitif, parce qu'aucun mode ni aucune largeur ne les fait varier (`rayons.md`, section 2).
- **Typographie** : des primitifs nommés par leur valeur (`typo-taille-15`, `typo-graisse-600`…), jamais lus par un composant ; un rôle est un token composé (`typo-<rôle>`) qui fait référence aux primitifs, avec une variante `typo-<rôle>-fort` pour l'état et l'emphase (`typographie.md`, section 11).

### Nommage des sémantiques de couleur

`propriété-rôle[-variante]`, toujours dans cet ordre. Les trois listes sont fermées (`couleurs.md`).

| Élément | Valeurs permises |
|---|---|
| Propriété | `fond`, `texte`, `bordure` |
| Rôle | `page`, `surface`, `sur-carte`, `neutre`, `accent`, `sur-accent`, `marque`, `sur-marque`, `inverse`, `sur-inverse`, `principal`, `secondaire`, `action`, `sur-action`, `focus`, `controle`, `etape`, `separateur`, `voile`, `recompense`, `erreur`, `sur-erreur`, `succes`, `sur-succes` |
| Variante | `survol`, `desactive`, `accentue` (plus intense que la base du même rôle), `attenue` (moins contrasté) |

- **Ne pas changer de propriété.** Un `fond-*` ne s'emploie jamais en `color`, et inversement.
- **Une combinaison absente de la liste n'existe pas.** Il faut la demander, pas la deviner (voir section 7).
- **Tracés SVG** : une piste, un arc ou une barre de progression prend un `fond-*` ; un trait de contour prend un `bordure-*` ; les icônes héritent du `texte-*` de leur parent via `currentColor`.

### Modes apprenant et formateur

Les sémantiques communs ont la même valeur partout. Les autres changent de valeur selon le mode ; la liste ci-dessous les signale.
- Mode apprenant : par défaut.
- Mode formateur : le document en mode formateur (`html[data-mode='formateur']`, posé par l'app) et tout ce qui est posé dans `.espace-layout-formateur`, `.flow-page-formateur` ou `.dropdown-content-formateur`.
- Fond du document (décision du 12/11) : `html` et `body` prennent le `fond-page` du mode actif (crème en apprenant, gris en formateur) ; les conteneurs ne reposent plus ce fond. Une surface fixe ou collante (barre d'action du quiz, pastilles de section de Création de cours) et un conteneur qui change de mode (aperçu élève, `.mode-apprenant`) gardent le leur.
- Couleurs de texte : les mêmes dans les deux modes ; seuls les fonds et les bordures varient (`couleurs.md`, décision 6).
- *Implémentation* : `.mode-apprenant` rétablit le mode apprenant dans un conteneur formateur (aperçu élève).

Un composant lit toujours le même sémantique dans les deux espaces : c'est le mode qui fournit la valeur.

### Espacements

Un composant lit toujours un token de rôle `espace-<rôle>` (liste générée ci-dessous), jamais un primitif `espace-N`. Les rôles, le choix du rôle et les cas particuliers : « Espacements », section 5 (`espacements.md`).

### Valeurs sans token

Aucune ombre hors token : `--ombre-flottante` et `--ombre-illustration` sont générés depuis `tokens/ombres.tokens.json` (liste ci-dessous).

Les rayons ont leurs tokens (`--rayon-*`, liste ci-dessous) : voir « Rayons », section 5.

### Liste des tokens utilisables

Les primitifs ne sont pas listés : un composant ne les lit jamais.

<!-- tokens:debut (généré par npm run tokens depuis tokens/, ne pas modifier à la main) -->

#### Espacements, rôles (`espace`)

Espacements. Primitifs : base 4 px, 11 paliers, liste fermée : 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40 (demi-pas 2, 6, 10 seulement en dessous de 12). Aucun autre palier : espace-14 n'existe pas. Un composant ne lit jamais un primitif : il lit un rôle (espace-marge-page, espace-surface…), qui pointe vers un palier. Le rôle se choisit par la fonction et la place, jamais par la valeur actuelle (docs/tokens/espacements.md). Une valeur sans rôle et hors échelle est ramenée au palier le plus proche, à égalité le supérieur. Une marge négative de débord cite le rôle qu'elle traverse. Hors rôle : réserves, débords d'illustration, marges de page desktop, zones d'action mesurées.

| Variable CSS | Description |
|---|---|
| `--espace-marge-page` | Marge de page : padding gauche et droite du Conteneur de page sous 768 px, sur toutes les pages, y compris hors navigation. Aussi la marge horizontale d'une barre fixe sur toute la largeur. Les côtés de la tab bar flottante mobile sont une exception (espacements.md, section 9). |
| `--espace-blocs` | Entre deux blocs : écart entre deux blocs de nature différente, ou deux sections d'une page, empilés. Retour compris. Deux cartes de même nature répétées relèvent de espace-repetition. |
| `--espace-surface` | Padding d'une Surface : padding de tout bloc posé directement sur le fond de la page, ou flottant au-dessus (carte, en-tête de page, bloc de tête, modale, feuille, toast), les quatre côtés. |
| `--espace-bord` | Bloc près du bord : écart entre un bloc à fond et le bord de la Surface qui le contient, quand il est à moins de 20 px de ce bord, le même en haut, en bas et sur les côtés, y compris quand le bloc est le dernier. La Surface prend ce padding, sans calc ni marge négative. Aussi le padding d'une carte de liste. |
| `--espace-groupes` | Entre deux groupes : écart entre deux groupes d'une Surface (titre et texte, texte et bouton, titre de section et son contenu, deux champs, bouton principal et lien en dessous), et entre un titre de section posé sur la page et son contenu. |
| `--espace-textes` | Deux textes d'un groupe : surtitre et titre, titre et sous-titre ou compteur, titre et méta d'une ligne, libellé et son champ, champ et son aide ou son erreur, deux puces d'une liste. |
| `--espace-rangee` | Rangée : écart entre des éléments différents posés côte à côte (éléments d'une ligne, titre et action, filtres et recherche, champ et bouton, barre du haut). Aussi le padding horizontal d'une cellule de tableau. |
| `--espace-repetition` | Répétition : écart entre des éléments de même nature répétés, sans séparateur (cartes d'une grille ou d'une pile, boutons côte à côte, pastilles, filtres, choix d'une liste de réponses, tuiles de badges). |
| `--espace-ligne` | Ligne de liste : padding d'une ligne sur les quatre côtés (le texte tombe à 20 px du bord de la carte, avec espace-bord). Aussi le padding vertical d'une cellule de tableau. |
| `--espace-icone` | Icône et libellé : écart entre une icône et son libellé, dans un bouton, une pastille, une entrée de navigation ou un lien. |
| `--espace-bouton` | Padding d'un contrôle, Bouton : padding gauche et droite. La hauteur donne le vertical. Vrais boutons seulement (un filtre, un choix, un onglet est un Choix). |
| `--espace-retour-chevron` | Padding d'un contrôle, Retour : côté chevron. Sur mobile (chevron seul), les deux côtés. |
| `--espace-retour-libelle` | Padding d'un contrôle, Retour : côté libellé. |
| `--espace-champ` | Padding d'un contrôle, Champ : padding gauche et droite (champ multiligne compris). Un champ avec icône à gauche garde une réserve de 44 px de ce côté (icône de 20 à 16 du bord, puis 8 jusqu'au texte). |
| `--espace-pastille-vertical` | Padding d'un contrôle, Pastille : haut et bas. |
| `--espace-pastille-horizontal` | Padding d'un contrôle, Pastille : gauche et droite. |
| `--espace-choix-vertical` | Padding d'un contrôle, Choix (ligne de réponse, case, mode, filtre, onglet) : haut et bas. Un choix à hauteur fixe n'en prend pas. |
| `--espace-choix-horizontal` | Padding d'un contrôle, Choix : gauche et droite. |
| `--espace-navigation-vertical` | Padding d'un contrôle, Entrée de navigation (tab bar, barre du haut, menus, sommaire) : haut et bas. |
| `--espace-navigation-horizontal` | Padding d'un contrôle, Entrée de navigation : gauche et droite. |
| `--espace-lien` | Padding d'un contrôle, Lien texte : gauche et droite (zone cliquable autour d'un lien). |
| `--espace-etiquette` | Padding d'un contrôle, Étiquette (étiquette d'image de Création de cours). |
| `--espace-paragraphes` | Rythme du contenu : entre deux paragraphes, listes ou médias (image, vidéo, tableau) d'une leçon. |
| `--espace-intertitre-avant` | Rythme du contenu : au-dessus d'un intertitre (titres Markdown et intertitre de leçon). |
| `--espace-intertitre-apres` | Rythme du contenu : sous un intertitre. |
| `--espace-retrait-puces` | Rythme du contenu : retrait des puces d'une liste. |
| `--espace-colonnes` | Colonnes : écart entre deux colonnes d'une liste sur desktop. |
| `--espace-element` | Padding d'un Élément : padding de tout bloc à fond ou à contour posé dans une Surface, les quatre côtés. |

#### Rayons (`rayon`)

Rayon des coins. Le rôle se choisit par la forme puis par la place de l'élément (docs/tokens/rayons.md, section 4), jamais par la valeur actuelle ni par la taille. Une seule valeur par rôle, à toutes les largeurs.

| Variable CSS | Description |
|---|---|
| `--rayon-pilule` | Élément dont les deux bouts sont des demi-cercles. Passe avant le rôle de niveau. |
| `--rayon-rond` | Élément carré rendu circulaire. Même valeur que la pilule : sur un carré, elle donne un cercle. |
| `--rayon-case` | Case à cocher. Un radio prend rayon-rond. |
| `--rayon-surface` | Bloc posé directement sur le fond de la page, ou flottant au-dessus. Toujours plus arrondi que rayon-element. En feuille mobile, sur les deux coins du haut seulement. |
| `--rayon-element` | Bloc à fond ou à contour posé dans une surface, à n'importe quelle profondeur. Aussi : choix de réponse en ligne, champ multiligne, image, vidéo ou tableau de contenu, où qu'ils soient. |

#### Ombres (`ombre`)

Ombres : deux, et seulement elles. La profondeur vient des fonds ; une ombre marque ce qui flotte au-dessus de la page ou un objet 3D qui déborde de sa carte. En CSS, un spread nul n'est pas écrit (drop-shadow refuse un 4e terme).

| Variable CSS | Description |
|---|---|
| `--ombre-flottante` | Éléments flottants : menus, listes déroulantes, toast, modales, barre d'enregistrement. Lue par box-shadow. |
| `--ombre-illustration` | Objet 3D qui déborde d'une carte (bloc de tête du dashboard, correction du quiz, carte badge de fin de quiz, Introduction). Une seule valeur, mobile et desktop. Lue par filter: drop-shadow(var(--ombre-illustration)). |

#### Sémantiques `fond`

Sémantiques de fond : background, ou piste / arc / barre de progression en SVG. Ne pas changer de propriété : jamais en color ni en bordure.

| Variable CSS | Mode | Description |
|---|---|---|
| `--fond-surface` | commun | Cartes, champs sur le fond de page, bouton blanc sur carte foncée. |
| `--fond-accent` | commun | En-têtes lavande, onglet actif, sélection, survol des boutons contour. |
| `--fond-marque` | commun | Cartes violettes, remplissage de progression. |
| `--fond-marque-accentue` | commun | Fond posé sur la marque : piste d'anneau sur carte violette, fond du logo foncé. |
| `--fond-inverse` | commun | Cartes encre, tab bar, toast. |
| `--fond-inverse-survol` | commun | Survol d'une entrée de la barre de navigation (blanc à 12 %). Composantes de couleur.blanc, opacité 12 % portée par ce sémantique. |
| `--fond-action` | commun | Bouton principal, case cochée. |
| `--fond-action-survol` | commun | Survol du bouton principal. |
| `--fond-action-desactive` | commun | Bouton désactivé. |
| `--fond-voile` | commun | Derrière une modale ou un menu (encre à 45 %). Composantes de couleur.ardoise-900, opacité 45 % portée par ce sémantique. |
| `--fond-voile-accentue` | commun | Visionneuse d'images, miniature « +N » (encre à 85 %, garantit la lisibilité du « +N » blanc sur une image quelconque). Composantes de couleur.ardoise-900, opacité 85 % portée par ce sémantique. |
| `--fond-recompense` | commun | XP, quiz flash. Texte posé dessus : toujours encre (texte-principal), jamais blanc. |
| `--fond-recompense-survol` | commun | Survol du bouton orange. |
| `--fond-erreur` | commun | Fond d'erreur, pastille « Bloquante », survol du bouton supprimer. |
| `--fond-erreur-accentue` | commun | Bouton rouge plein, pastille « Ta réponse » fausse. |
| `--fond-succes` | commun | Bonne réponse, « Bon rythme ». |
| `--fond-succes-accentue` | commun | Pastille de coche, segment « terminés ». |
| `--fond-controle-survol` | commun | Survol d'un point de contrôle inactif (point de pagination de l'Introduction) : neutre plus foncé que fond-controle, jamais la couleur du point actif. Même primitif que bordure-controle : 3,40:1 sur la crème, 3,57 sur le gris. |
| `--fond-page` | varie selon le mode | Fond de page. |
| `--fond-sur-carte` | varie selon le mode | Champ, réponse, étape ou bloc posé sur une carte blanche. |
| `--fond-neutre` | varie selon le mode | Pastille « Non commencé », piste des barres fines. |
| `--fond-controle` | varie selon le mode | Point d'un contrôle, poignée de la feuille mobile. |

#### Sémantiques `texte`

Sémantiques de texte : color ; les icônes en héritent via currentColor. Ne pas changer de propriété : jamais en background ni en bordure.

| Variable CSS | Mode | Description |
|---|---|---|
| `--texte-principal` | commun | Texte principal sur fond clair. |
| `--texte-secondaire` | commun | Texte secondaire sur fond clair. |
| `--texte-accent` | commun | Libellés et liens violets sur fond clair. |
| `--texte-accent-survol` | commun | Survol des liens violets. |
| `--texte-sur-accent` | commun | Sous-titres sur fond lavande. |
| `--texte-action-desactive` | commun | Texte d'un bouton désactivé. |
| `--texte-erreur` | commun | Message et icône d'erreur. |
| `--texte-succes` | commun | « Terminé », icône de succès. |
| `--texte-sur-marque` | commun | Texte sur carte violette. |
| `--texte-sur-marque-attenue` | commun | Texte secondaire sur carte violette. |
| `--texte-sur-inverse` | commun | Texte sur carte encre. |
| `--texte-sur-inverse-attenue` | commun | Texte secondaire sur carte encre. |
| `--texte-sur-action` | commun | Texte et icône posés sur fond-action : libellé du bouton principal, coche ou point d'un contrôle coché. |
| `--texte-sur-erreur` | commun | Texte et icône posés sur fond-erreur-accentue : bouton rouge plein, pastille « Ta réponse » fausse. |
| `--texte-sur-succes` | commun | Texte et icône posés sur fond-succes-accentue : coche d'une bonne réponse, pastille « Bonne réponse ». |
| `--texte-recompense` | commun | Titre et lien de correction sur le bloc encre du quiz. |

#### Sémantiques `bordure`

Sémantiques de bordure : border, outline, trait de contour SVG, halo du focus (box-shadow). Ne pas changer de propriété : jamais en background ni en color.

| Variable CSS | Mode | Description |
|---|---|---|
| `--bordure-action` | commun | Contour du bouton secondaire, réponse ou choix sélectionné. |
| `--bordure-focus` | commun | Contour de focus clavier (2 px, décalé de 2), champ actif. Réglé à part de bordure-action, jamais lié à action. Avec bordure-focus-halo autour, l'une des deux couleurs atteint 3:1 sur toute surface. |
| `--bordure-focus-halo` | commun | Halo de 2 px autour du contour de focus (box-shadow) : sur une surface foncée (violet, encre), c'est lui qui atteint 3:1. |
| `--bordure-controle` | commun | Contour d'un contrôle interactif : case, rond de choix, et bordure de 2 px d'un champ au repos (une ligne, multiligne, recherche, liste déroulante). Au moins 3:1 contre chaque fond voisin, survol compris. Jamais pour un élément non interactif ni pour un séparateur. |
| `--bordure-erreur` | commun | Réponse fausse, champ en erreur. |
| `--bordure-succes` | commun | Bonne réponse. |
| `--bordure-separateur` | varie selon le mode | Le trait bordure-separateur se place uniquement entre deux éléments consécutifs de même nature qui se répètent dans un même bloc (lignes d'un tableau, lignes d'une liste), jamais avant le premier ni après le dernier. Un en-tête de colonnes, un titre ou une section n'est pas un élément répété : il se sépare par l'espacement. Dans une liste disposée en plusieurs colonnes, le dernier élément de chaque colonne n'a pas de séparateur. |
| `--bordure-etape` | varie selon le mode | Contour d'une pastille d'étape à venir ou passée, non interactive. Pas d'exigence de contraste, l'état est porté par le remplissage et le libellé. |
| `--bordure-action-desactive` | varie selon le mode | Contour d'une action désactivée. Va avec texte-action-desactive. |

#### Typographie, rôles (`typo`)

Typographie. Un composant applique un rôle (font: var(--typo-<rôle>)) ou sa variante -fort (font: var(--typo-<rôle>-fort)), jamais un primitif, jamais font-size ni font-weight séparés. L'échelle est une liste fermée : 13 tailles (13, 14, 15, 16, 17, 18, 21, 24, 28, 32, 34, 44, 48 px), 4 graisses (500, 600, 700, 800) ; aucune autre valeur n'est admise. Les tailles s'écrivent en px et sortent en rem (base 16 px). Un seul seuil typographique : 768 px (typo.seuil-desktop) ; les rôles qui en dépendent sont dans typographie-mobile et typographie-desktop, sous le même nom, jamais ici.

Valeur : taille · graisse · hauteur de ligne. Un élément applique `font: var(--typo-<rôle>)` ou `font: var(--typo-<rôle>-fort)`.

| Variable CSS | Valeur | Description |
|---|---|---|
| `--typo-titre-section` | 21 px · 800 · 1,2 | Le titre nomme une partie de la page ou du contenu, il annonce ce qui suit (section de page, intertitre de leçon, titre Markdown, modale, feuille de menu). |
| `--typo-titre-carte` | 18 px · 800 · 1,2 | Le titre nomme ce que la carte présente (un objet, une action), ou dit où l'on en est (« Raté, mais tu vas retenir ça », « Tu as fini les 12 cours ») ; en dessous, une explication ou une information. Un élément posé directement sur la page est une carte (Titre de carte). Un élément répété à l'intérieur d'une carte ou d'une modale est une ligne (Titre de ligne), même s'il a un fond. |
| `--typo-titre-ligne` | 16 px · 800 · 1,2 | Nomme un élément de liste, ou rappelle un titre dans une barre compacte. Un élément posé directement sur la page est une carte (Titre de carte). Un élément répété à l'intérieur d'une carte ou d'une modale est une ligne (Titre de ligne), même s'il a un fond. |
| `--typo-corps-courant` | 15 px · 500 · 1,45 | Phrases lues ailleurs que dans la leçon : explications, paragraphes, intitulés, réponses affichées. |
| `--typo-corps-courant-fort` | 15 px · 600 · 1,45 | État (choisi, en cours, fait, coché) ou emphase du rôle Corps courant. |
| `--typo-texte-secondaire` | 14 px · 600 · 1,2 | Phrase qui accompagne un titre ou un contenu : sous-titre, état, aide, erreur, message. |
| `--typo-texte-secondaire-fort` | 14 px · 700 · 1,2 | État (choisi, en cours, fait, coché) ou emphase du rôle Texte secondaire. |
| `--typo-meta` | 13 px · 600 · 1,2 | Information courte et factuelle sur un élément : contenu, date, compte, statut. |
| `--typo-meta-fort` | 13 px · 700 · 1,2 | État (choisi, en cours, fait, coché) ou emphase du rôle Méta. |
| `--typo-surtitre` | 13 px · 700 · 1,2 | Libellé court posé au-dessus d'un titre (thème, « Tu en es là »). |
| `--typo-surtitre-fort` | 13 px · 800 · 1,2 | État (choisi, en cours, fait, coché) ou emphase du rôle Surtitre. |
| `--typo-bouton` | 15 px · 800 · 1,2 | Libellé d'un bouton (plein, contour, pointillé, Retour). |
| `--typo-lien-texte` | 15 px · 700 · 1,2 | Action écrite sans forme de bouton et sans état choisi, qui agit ou mène ailleurs une fois (« Tout voir », « Revoir la leçon », « Passer cette étape », « Voir comme un élève »). |
| `--typo-lien-texte-fort` | 15 px · 800 · 1,2 | État (choisi, en cours, fait, coché) ou emphase du rôle Lien texte. |
| `--typo-navigation` | 14 px · 700 · 1,2 | Option qui reste marquée comme choisie, dont le choix change ce qu'on voit (écran, vue, filtre) sans agir sur les données (barre d'onglets, onglets « Écrire / Aperçu », filtres, entrées de menu qui mènent à un écran ou à une vue et restent marquées comme choisies, repère d'étapes). |
| `--typo-navigation-fort` | 14 px · 800 · 1,2 | État (choisi, en cours, fait, coché) ou emphase du rôle Navigation. |
| `--typo-libelle-champ` | 14 px · 600 · 1,2 | Nomme un champ de formulaire. |
| `--typo-libelle-champ-fort` | 14 px · 700 · 1,2 | État (choisi, en cours, fait, coché) ou emphase du rôle Libellé de champ. |
| `--typo-saisie-choix` | 16 px · 600 · 1,2 | Texte tapé ou choisi par l'utilisateur, et texte indicatif (placeholder) du champ vide : même rôle, seule la couleur change. |
| `--typo-saisie-choix-fort` | 16 px · 700 · 1,2 | État (choisi, en cours, fait, coché) ou emphase du rôle Saisie et choix. |
| `--typo-pastille` | 13 px · 800 · 1,2 | Texte d'une pastille, numéros dans une pastille ronde compris, et texte du statut de la Pastille de statut, avec ou sans pilule (« En cours » et « Terminé » compris). |
| `--typo-chiffre` | 28 px · 800 · 1 | Nombre sujet d'un bloc : le bloc existe pour le montrer (carte de statistique, taux de complétion). |
| `--typo-chiffre-grand` | 48 px · 800 · 1 | Nombre sujet de l'écran entier : l'écran existe pour le montrer (score de fin de quiz, en pourcentage). |
| `--typo-compteur` | 15 px · 800 · 1,2 | Nombre qui n'est pas le sujet de son bloc : position, avancement, total ou gain qui accompagne le sujet du bloc (« 3 / 5 » d'un quiz, XP de l'en-tête, « +15 XP »). |
| `--typo-titre-page` | 34 px · 800 · 1,1 (sous 768 px) ; 44 px · 800 · 1,1 (à partir de 768 px) | Nomme l'écran ; un seul par écran, en tête. |
| `--typo-titre-contenu` | 28 px · 800 · 1,1 (sous 768 px) ; 32 px · 800 · 1,1 (à partir de 768 px) | Nomme l'objet que l'écran présente (cours, thème, question). |
| `--typo-titre-mis-en-avant` | 24 px · 800 · 1,2 (sous 768 px) ; 28 px · 800 · 1,2 (à partir de 768 px) | Titre de la carte qui porte l'action principale de l'écran, celle que l'écran existe pour faire. Au plus une par écran. Sur le dashboard apprenant, c'est le bloc de tête, quelle que soit sa variante. Un écran qui propose plusieurs choix de même poids n'en a pas. La carte porte une seule action, son bouton principal. Une carte qui regroupe plusieurs actions garde son rôle (exemple : « Pour bien démarrer »). |
| `--typo-texte-lecture` | 17 px · 500 · 1,55 (sous 768 px) ; 18 px · 500 · 1,55 (à partir de 768 px) | Texte de la leçon, dans la fiche et dans son aperçu. |
| `--typo-texte-lecture-fort` | 17 px · 600 · 1,55 (sous 768 px) ; 18 px · 600 · 1,55 (à partir de 768 px) | État (choisi, en cours, fait, coché) ou emphase du rôle Texte de lecture. |

<!-- tokens:fin -->

## 4. Composants documentés

Source : `ds-principes-composants.md`.

### Conteneur de page

- **Usage** : toute page de l'app s'y place, y compris une page hors navigation.
- **Ce qu'il fournit** : marges de page, `.espace-contenu`, posé par `EspaceApprenant` et `EspaceFormateur` autour de la page, rôle Marge de page ; réserve de la tab bar en bas sur mobile, de la barre du haut sur desktop ; complété sur desktop par `.espace-page-etroit` (rôle de largeur Page) ; écart entre les blocs de la page, `.espace-page`, rôle Entre deux blocs (« Espacements », section 5).
- **Largeur de colonne** : la fonction de l'écran décide du rôle, Page, Lecture, Question ou Formulaire, toutes centrées ; exception écrite : Création de cours (« Mise en page », section 5).
- **Haut du contenu et ancres** : une cible d'ancre s'arrête au même endroit que le haut du contenu, jamais sous la barre du haut (« Mise en page »).
- **Page hors navigation** : elle se place aussi dans le Conteneur de page et prend le rôle Marge de page (`espacements.md`). Mot de passe oublié et Nouveau mot de passe prennent le gabarit de la Connexion (`GabaritParcours`) : Retour rond et logo en rangée (Nouveau mot de passe : emplacement du Retour vide), titres en `TitreParcours`, champs `ChampParcours` posés sur la page, bouton dans la zone d'action, colonne Formulaire, textes inchangés. L'écran « Chargement… » de l'app reste dans `.flow-page` (`shared.css` : marge de page sur les côtés, haut du Conteneur avec la zone de sécurité) et `.flow-card`, colonne Formulaire.
- **Règle** : une page ne redéfinit pas l'écart entre ses blocs.
- **Fichier à réutiliser** : `src/styles/espace-layout.css` (`.espace-contenu`, `.espace-page-etroit`, `.espace-page`).

### Bouton

- **Rôle** : À trancher (la documentation décrit les variantes et leur usage, pas de rôle général).
- **Quand l'utiliser, quand choisir le voisin** : un bouton pour toute action qui mérite une zone. Le voisin est le lien texte, pour une action secondaire qui ne mérite pas de zone.
- **Typographie** : le libellé d'un bouton (plein, contour, pointillé, Retour) prend le rôle Bouton (`--typo-bouton`). Un texte d'action sans forme de bouton prend le rôle Lien texte (`typographie.md`, sections 5 et 6).
- **Variantes** :
  - principal (violet plein) : l'action attendue de la zone, un seul par zone ;
  - secondaire (contour violet) : action alternative à côté du principal ;
  - sur fond foncé (blanc, texte encre) : l'action principale d'une carte violette ou encre ;
  - orange (texte encre) : lancer le quiz flash, rien d'autre ;
  - supprimer (rouge) : action destructrice, dans un menu, toujours confirmée ;
  - pointillé : ajouter un élément dans la création de cours (question, réponse, étape) ;
  - retour : revenir au niveau du dessus quand on est descendu d'un niveau dans les pages. Place : en haut à gauche, avant l'en-tête. Rendu : pilule blanche, chevron à gauche, texte encre. Sur mobile, chevron seul, et le nom accessible du bouton ne change pas. Quand le libellé visible nomme le niveau du dessus, le nom accessible est « Retour à <libellé> » (WCAG 2.5.3, Label in Name : le nom accessible contient le libellé visible). Exemples : Mot de passe oublié (libellé « Connexion », nom « Retour à la connexion »), espace formateur (« Retour à Mes cours », « Retour à Mes groupes »), Création de cours (« Retour à Mes cours », « Retour à Détail du cours »). Zone cliquable de 44 px minimum. Le bouton Retour remonte d'un niveau dans l'arborescence des pages. Il n'apparaît pas sur une page de niveau 0, atteinte depuis la navigation principale (tab bar sur mobile, barre de navigation sur desktop). Il n'a donc pas d'état désactivé. Dimensions : padding en `espace-retour-chevron` côté chevron et `espace-retour-libelle` côté libellé ; écart entre le chevron et le libellé en `espace-icone` (« Espacements », section 5) ; chevron de 18 px. Libellé : rôle Bouton (`--typo-bouton`), car la variante Retour a une forme de bouton (`typographie.md`, section 6).
- **Choisir entre principal, secondaire et lien texte** :
  - principal : l'action attendue de la zone, un seul par zone ;
  - secondaire : seulement s'il est sur la même rangée que le principal et que c'est l'autre issue de la même décision ;
  - lien texte : une action à part, ni attendue ni alternative. Exemples Skillo : Se déconnecter, Mot de passe oublié.
- **Focus clavier de tous les boutons** : contour de 2 px à l'extérieur du bouton, décalé de 2 px, token de focus (`bordure-focus`), visible au clavier seulement (section 5, « Focus »).
- **Hauteur** : posé dans la rangée d'un champ, un bouton prend la hauteur du champ, et un choix aussi (filtres posés à côté d'une recherche) : une seule hauteur par rangée. Posé seul, un bouton garde sa hauteur de 48 px (`espacements.md`, section 7). 44 px est la zone cliquable minimale, pas la hauteur d'un composant.
- **Tokens par état** (zone cliquable minimale : voir « Accessibilité » du Bouton dans `ds-principes-composants.md`) :

| Variante | Repos | Survol | Actif (appui tactile) | Focus clavier | Désactivé |
|---|---|---|---|---|---|
| Principal | fond `fond-action`, texte `texte-sur-action` | `fond-action-survol` | comme le survol (règle commune) | `bordure-focus` | fond `fond-action-desactive`, texte `texte-action-desactive` |
| Sur fond foncé | fond `fond-surface`, texte `texte-principal` | À trancher | comme le survol (règle commune) ; survol encore À trancher (le code pose `fond-accent`) | `bordure-focus` | fond `fond-action-desactive`, texte `texte-action-desactive` |
| Secondaire | contour `bordure-action`, texte À trancher | `fond-accent` | comme le survol (règle commune) | `bordure-focus` | fond `fond-action-desactive`, texte `texte-action-desactive` |
| Orange | fond `fond-recompense`, texte `texte-principal` | `fond-recompense-survol` | comme le survol (règle commune) | `bordure-focus` | fond `fond-action-desactive`, texte `texte-action-desactive` |
| Supprimer | texte `texte-erreur`, contour `bordure-erreur` (même épaisseur que le secondaire) | `fond-erreur` | comme le survol (règle commune) | `bordure-focus` | fond `fond-action-desactive`, texte `texte-action-desactive` |
| Rouge plein (confirmation) | fond `fond-erreur-accentue`, texte `texte-sur-erreur` | À trancher | comme le survol (règle commune) ; survol encore À trancher | `bordure-focus` | fond `fond-action-desactive`, texte `texte-action-desactive` |
| Pointillé | contour et texte À trancher | À trancher | comme le survol (règle commune) ; survol encore À trancher | `bordure-focus` | fond `fond-action-desactive`, contour `bordure-action-desactive`, texte `texte-action-desactive` |
| Retour | fond `fond-surface`, texte `texte-principal` | `fond-accent` | `fond-accent` | `bordure-focus` | Sans objet : pas d'état désactivé |

  Hauteur : 48 px pour toutes les variantes, Retour à 44 (`ds-principes-composants.md`, Bouton, Hauteur). Focus : contour `bordure-focus` et halo `bordure-focus-halo` (section 5, Focus). Désactivé : règle commune (section 5, Désactivé).

  Sources : les états du Bouton (« désactivé : lavande, texte atténué », valable pour toutes les variantes, sauf Retour) dans `ds-principes-composants.md`, les descriptions des tokens, la note 2.1.0 pour le contour du bouton supprimer.
- **DO** : un seul bouton principal par zone d'action. Dans la barre d'enregistrement de Création de cours, « Enregistrer » est le seul bouton principal, « Annuler » est un bouton secondaire.
- **DON'T** : utiliser le pointillé pour valider un formulaire. Dans Détail groupe, « Ajouter » un élève par son email est un bouton principal, pas un pointillé. Ne pas non plus donner à une pastille de statut l'air d'un bouton (pas de survol, pas de curseur main, plus petite que le bouton).

### Champ

- **Rôle** : À trancher (la documentation décrit les variantes, pas de rôle général).
- **Quand l'utiliser, quand choisir le voisin** : un champ pour une saisie libre. Le voisin est la liste déroulante, quand les réponses possibles sont connues et peu nombreuses.
- **Typographie** : le libellé du champ prend le rôle Libellé de champ (`--typo-libelle-champ`) ; le texte tapé ou choisi et le texte indicatif (placeholder) du champ vide prennent le rôle Saisie et choix (`--typo-saisie-choix`), seule la couleur change ; 16 px partout, même dans un en-tête dense ou une ligne de filtres (`typographie.md`, sections 5, 6 et 9).
- **Variantes** : texte (saisie courte, en pilule) ; mot de passe (texte masqué, aide « 6 caractères minimum » dessous) ; multiligne (saisie longue, hauteur ajustée au contenu, sans poignée : `resize: none`) ; recherche (pilule avec loupe, fond selon le support, résultats dès 2 caractères ; toute recherche a la loupe).
- **Dimensions** : champ d'une ligne, 48 px partout ; champ du parcours d'entrée (Connexion, Création du compte, Mot de passe oublié, Nouveau mot de passe), 56 px, grand champ compris ; champ multiligne, hauteur par le contenu, hors de cette règle, vertical de 12 (la première ligne tombe comme dans un champ d'une ligne de 48) ; champ multiligne qui contient un bouton rond (44) : 52 de hauteur minimale. Un contrôle posé dans la même rangée qu'un champ prend la hauteur du champ.
- **Icône dans le champ** : 20 px, posée à 16 px du bord, texte à 8 px de l'icône, soit une réserve de 44 px de ce côté (`espacements.md`, section 7).
- **Texte indicatif** : couleur `texte-secondaire` sur tous les champs (opacité 1), rôle Saisie et choix ; pas de points de suspension à la fin (« Rechercher un cours »).
- **Tokens par état** :

| État | Tokens |
|---|---|
| Repos | fond `fond-sur-carte` sur une carte blanche, `fond-surface` sur le fond de page ; bordure 2 px `bordure-controle` (champ d'une ligne, multiligne, recherche, liste déroulante ; éditeur de leçon : sur son bloc) ; texte saisi `texte-principal` |
| Survol | aucun : le champ ne change pas au survol |
| Actif (saisie) | contour `bordure-focus` (« champ actif »), dessiné à l'intérieur du champ |
| Focus clavier | contour `bordure-focus`, dessiné à l'intérieur du champ, pas de contour à l'extérieur ; liste déroulante : au clavier seulement (`:focus-visible`), comme un bouton |
| Désactivé | fond `fond-action-desactive`, texte `texte-action-desactive`, sans opacité (même rendu que le bouton désactivé) |
| Erreur | message sous le champ en `texte-erreur` ; contour `bordure-erreur` (« champ en erreur ») et `aria-invalid` sur le champ lié au message, jamais la couleur seule. Erreur qui vise une section entière (QCM, checklist de Création de cours) : message sous la section, aucun champ marqué |
| Autoremplissage | le champ garde le fond qu'il a au repos, sur tous les champs, multilignes compris (ombre intérieure pleine, exception au registre de la section 5, « Ombres ») |

- **DO** : aligner le champ, son libellé et son aide sur le même bord gauche. Dans Création de cours, le champ Titre, son libellé et l'aide qui suit partent du même bord. Aucune marge négative : le champ fait la largeur de sa colonne.
- **DON'T** : ajouter une bordure pour séparer le champ de la carte, on change son fond. Dans une carte blanche de Création de cours, le champ Titre prend `fond-sur-carte`, pas une bordure grise. Ne pas signaler une erreur par la seule couleur du contour : on écrit le message sous le champ.

### États de page

Source : `ds-principes-composants.md`, « États de page ».

- **Chargement** : « Chargement… » seul, en Texte secondaire, couleur `texte-secondaire`, sans marge, posé à la place du contenu attendu ; l'écart vient du conteneur (Entre deux blocs sous l'en-tête). Ni spinner, ni squelette.
- **Erreur** : jamais le message technique de la base, qui part en console ; texte, rôle (Texte secondaire) et couleur (`texte-erreur`) inchangés. Quand un message est à écrire : « [Objet] n'a pas pu être [action]. », suivi de « Réessaie. » seulement si l'action peut être relancée.
- **Enregistrement** : tout enregistrement affiche un message d'erreur s'il échoue, même composant que les autres, près de l'action.
- **Formulaire** : voir Champ (message sous le champ, contour `bordure-erreur`, `aria-invalid` ; erreur de section : message sous la section, aucun champ marqué).
- **Vide** : Texte secondaire, couleur `texte-secondaire`, jamais `texte-erreur`.

### Barre de progression

- **Rôle** : montrer l'avancement dans une suite ou dans une liste, de façon compacte, à côté d'un compteur.
- **Quand l'utiliser** : checklist (« 3 étapes sur 8 »), quiz (« 3 / 5 »), cartes de groupe formateur, prochain badge, quiz flash verrouillé. Anatomie : piste, remplissage violet, extrémités arrondies, compteur ou pourcentage à côté. Variantes selon la place (décision du 13/11) : d'écran, 14 px, la barre qui ouvre un écran plein écran (parcours, quiz de cours et quiz flash), piste blanche ; fine, 8 px, toute barre posée dans une carte ou une ligne (barre empilée du Détail cours comprise). La piste change selon le fond : lavande, blanche ou neutre pâle. Contraste : barre avec sa valeur écrite, pas d'exigence de la piste contre son support, remplissage à 3:1 contre la piste ; barre sans valeur écrite, piste à 3:1 contre son support.
- **Voisin à ne pas confondre** : l'Anneau (entrée ci-dessous), qui met en avant une seule valeur avec le chiffre au centre.
- **À faire** : toujours afficher le chiffre à côté de la barre.
- **À ne pas faire** : une barre pour un résultat isolé comme un score (c'est le rôle de l'anneau) ; une barre seule, sans chiffre.

### En-tête de page

- **Rôle** : ouvrir une page de section (Cours, Terrain), dire où l'on est et ce qu'on y trouve.
- **Quand l'utiliser** : un seul par page, tout en haut. Bloc lavande, titre de page, sous-titre, objet 3D en haut à droite, recherche optionnelle.
- **Voisin à ne pas confondre** : le bloc de tête du dashboard (carte violette, objet qui déborde, bouton blanc), qui pousse à une action. L'en-tête de page, lui, situe.
- **À faire** : garder l'objet 3D dans le cadre, sans débord ni ombre.
- **À ne pas faire** : faire déborder l'objet hors du cadre (réservé au bloc de tête du dashboard) ; ajouter un bouton principal dans l'en-tête, les actions vivent dans le contenu.

### Pastille de statut (`StatutBadge`)

- **Rôle** : dire où en est l'apprenant sur un cours.
- **Quand l'utiliser** : le statut d'un cours pour un élève, partout où il apparaît. Pas pour le repère d'étapes, la mention Checklist terminée ni les compteurs (x / y cours, X terminés sur N, barre d'avancement).
- **Règle** : un cours pas encore ouvert s'affiche en pilule (Non commencé et À faire en `texte-secondaire` sur `fond-neutre`, Nouveau en `texte-accent` sur `fond-accent`). Un cours déjà ouvert s'affiche sans pilule, en texte avec une icône (En cours en `texte-accent` avec l'icône de progression, Terminé en `texte-succes` avec la coche). Aucune pastille n'utilise `fond-action`, `fond-marque` ni `fond-recompense`. Le mot porte le statut : pas de point de couleur avant le texte (l'icône d'En cours et la coche de Terminé accompagnent le mot, elles ne le remplacent pas). Principe 1 et contrainte d'accessibilité.
- **Typographie** : le texte du statut prend le rôle Pastille (`--typo-pastille`), avec ou sans pilule (« En cours » et « Terminé » compris) : la fonction décide du rôle, pas la forme (`typographie.md`, sections 5 et 6).
- **Voisin à ne pas confondre** : la pastille de groupe (lavande) de l'espace formateur, qui nomme un groupe et ne dit rien de l'avancement.
- **À faire** : utiliser la même pastille (`StatutBadge`) partout où un statut de cours apparaît.
- **À ne pas faire** : du vert sur fond vert pâle (couple réservé aux bonnes réponses du quiz et à la pastille « Bon rythme ») ; rendre la pastille cliquable ou lui donner l'air d'un bouton.

### Séparateur (`bordure-separateur`)

- **Rôle** : séparer deux éléments consécutifs de même nature qui se répètent dans un même bloc (lignes d'un tableau, lignes d'une liste).
- **Quand l'utiliser, quand choisir le voisin** : un trait seulement entre deux éléments répétés. Le voisin est l'espacement, pour un en-tête de colonnes, un titre ou une section, qui ne sont pas des éléments répétés.
- **Variantes** : une seule, le trait `bordure-separateur` (valeur selon le mode). Épaisseur : 1 px.
- **Tokens par état** : repos `bordure-separateur`. Survol, actif, focus clavier, désactivé : sans objet, le séparateur n'est pas interactif.
- **Ligne d'en-tête d'un tableau** : la règle de la 2.1.0 la règle explicitement (« Un en-tête de colonnes […] n'est pas un élément répété : il se sépare par l'espacement »). Aujourd'hui, le code ne pose pas de trait sous l'en-tête (Détail groupe, tableau du dashboard admin, tableaux des leçons, corrigés en 2.1.0).
- **Liste en plusieurs colonnes** : Dans une liste disposée en plusieurs colonnes, le dernier élément de chaque colonne n'a pas de séparateur.
- **DO** : dans le tableau des élèves du Détail groupe, un trait entre deux lignes d'élèves, et l'espacement sous l'en-tête.
- **DON'T** : un trait avant le premier élément ou après le dernier, sous un en-tête, autour d'un titre ou entre deux sections. Dans Activité récente, pas de trait sous l'intertitre d'un jour (« Aujourd'hui », « Hier »). Principe 3.

### Modale

- **Rôle** : afficher un contenu court par-dessus la page sans la quitter : un formulaire ou un choix (créer un groupe, assigner un cours, ajouter une vidéo).
- **Quand l'utiliser, quand choisir le voisin** : pour une saisie ou un choix lié à la page en cours. Le voisin est la Modale de confirmation, pour faire confirmer une action qu'on ne peut plus retrouver. Les autres cas : À trancher.
- **Anatomie** : voile `fond-voile` derrière ; mobile, feuille qui monte du bas avec une poignée ; desktop, carte centrée, deux largeurs : étroite 440 px (Nouveau groupe, Modale de confirmation), standard 520 px (Assigner des cours, Insérer une vidéo, Mes badges) ; ombre `--ombre-flottante`. Titre, sous-titre facultatif, bouton rond « Fermer » de 44 (croix, le même dans toutes les modales), contenu, zone d'actions facultative. Le composant sert aux deux modes (apprenant et formateur) et lit les mêmes sémantiques : le mode fournit la valeur.
- **Comportement** : Échap, clic sur le voile et bouton « Fermer » ferment la modale. Rôle `dialog`, `aria-modal`, nom accessible = titre.
- **DO** : laisser les trois façons de fermer (Échap, clic sur le voile, bouton « Fermer »).
- **DON'T** : À trancher.
- **À trancher** : focus à l'ouverture et maintien du focus dans la modale, hors Modale de confirmation.
- **Fichier à réutiliser** : `src/components/Modale.jsx` (export par défaut `Modale`).

### Modale de confirmation

- **Rôle** : faire confirmer une action qu'on ne peut plus retrouver (principe 2).
- **Quand l'utiliser** : avant toute action destructrice : supprimer un cours, un groupe, une question ou une étape, retirer un élève, quitter sans enregistrer.
- **Anatomie** : une Modale étroite ; titre (la question posée), texte facultatif, « Annuler », puis le bouton qui confirme (libellé « Supprimer » par défaut). Annuler en secondaire, confirmation en rouge plein. Pendant l'action, les deux boutons sont désactivés et le bouton rouge affiche « Un instant… ».
- **Comportement** : Le bouton qui confirme nomme le verbe et l'objet de l'action (Supprimer mon compte, Supprimer le cours). À l'ouverture, le focus va sur Annuler, l'action la moins destructrice. Tab reste dans la modale. Échap la ferme.
- **DO** : toujours confirmer une action destructrice, quel que soit l'endroit d'où elle part.
- **DON'T** : lancer une action qu'on ne peut plus retrouver sans cette confirmation (principe 2).
- **Fichier à réutiliser** : `src/components/Modale.jsx` (export nommé `ModaleConfirmation`).

### Menu d'actions

- **Rôle** : ranger les actions d'un élément qui ne méritent pas un bouton sur la page, dont l'action destructrice (principe 2).
- **Anatomie** : bouton rond « … » (nom accessible « Plus d'actions ») ; mobile, feuille depuis le bas sur le voile `fond-voile`, avec une poignée et le nom de l'élément en titre ; desktop, carte flottante sous le bouton, alignée à droite, `--ombre-flottante`, sans voile visible. Une ligne par action, 48 px de haut (comme le menu de la navigation), survol et appui en `fond-sur-carte`. L'action destructrice est en `texte-erreur`, en dernier.
- **Comportement** : Échap, clic hors du menu et choix d'une action ferment le menu. Rôles `menu` et `menuitem`. Entrée ou Espace sur le bouton ouvre le menu et place le focus sur la première action. Les flèches passent d'une action à l'autre. Échap ferme le menu et rend le focus au bouton. Tab et Maj+Tab ne passent pas d’une action à l’autre ; depuis une action, ils ferment le menu et font sortir le focus (W3C, guide des pratiques ARIA, motif Menu and Menubar, Keyboard Interaction). Précision Skillo : le focus va à l’élément suivant (ou précédent) de la page. Un menu à une seule action reste admis pour l'instant.
- **DO** : placer l'action destructrice en dernier, en rouge, suivie d'une Modale de confirmation.
- **DON'T** : mettre un bouton Supprimer directement sur la page (principe 2).
- **À trancher** : ordre des actions autres que la destructrice.
- **Fichier à réutiliser** : `src/components/formateur/MenuActions.jsx`.

### Carte, Ligne de liste, Choix, Onglet et filtre, Pastille, Lien texte, Anneau, Bouton rond

Entrées ajoutées au catalogue (décision du 12/11) : rôle, anatomie, valeurs et classe commune dans `ds-principes-composants.md`, une fiche par composant. Une seule implémentation par rôle : une page n'écrit pas sa propre carte, ligne, pastille, lien ou recherche, elle prend la classe commune (`.carte`, `.ligne-liste`, `.pastille`, `.lien-texte`, `src/styles/shared.css`). Composants d'écran, sans fiche : repère d'étapes, éditeur de leçon, tri de tableau, bandeau Aperçu, visionneuse, confettis, points de l'Introduction, vignettes de badge, carte pointillée « + Assigner un cours ».

- **Ligne de cours** (fiche Ligne de liste) : le statut passe sous le titre dès que le titre devrait couper un mot, à toutes les largeurs ; sinon il reste à côté. Le titre n'est jamais coupé au milieu d'un mot (pas de césure automatique ; filet : coupure sans tiret si un mot ne tient pas sur toute la largeur du texte). Aucune largeur d'écran dans la règle. Code : CSS seul, rangée texte + statut en `flex-wrap`, texte en `width: min-content` (largeur du mot le plus long du titre), contenu secondaire en `contain: inline-size`, `min-width: 0` pour le filet.

## 5. Règles transverses

### Séparateurs (2.1.0)

Le trait `bordure-separateur` se place uniquement entre deux éléments consécutifs de même nature qui se répètent dans un même bloc (lignes d'un tableau, lignes d'une liste), jamais avant le premier ni après le dernier. Un en-tête de colonnes, un titre ou une section n'est pas un élément répété : il se sépare par l'espacement. Dans une liste disposée en plusieurs colonnes, le dernier élément de chaque colonne n'a pas de séparateur.

### Ombres

Deux ombres, et seulement elles (2.1.0), en token depuis le chantier composants et couleurs (`tokens/ombres.tokens.json`). Le contraste vient des couleurs de fond (principe 3).
- `--ombre-flottante` : les éléments flottants (menus, listes déroulantes, toast, modales, barre d'enregistrement), en `box-shadow`.
- `--ombre-illustration` : les objets 3D qui débordent d'une carte, une seule valeur (mobile et desktop, toute carte), en `filter: drop-shadow(var(--ombre-illustration))`.
- Exception au registre (1.0.0) : l'ombre intérieure pleine qui neutralise l'autoremplissage du navigateur sur un champ (`:-webkit-autofill`), pour que le champ garde son fond.

### Survol et tactile

- Tous les styles `:hover` sont dans `@media (hover: hover)` (souris uniquement).
- Appui (`:active`) : une règle commune à tout bouton et tout lien, comme le focus (boutons de toutes les variantes, boutons ronds, Retour, liens texte, entrées de navigation et de menu, onglets, filtres, entrées de sommaire, choix, cartes et lignes cliquables) : l'appui prend le rendu du survol de l'élément. Sur tactile, c'est le seul retour pendant l'appui (`ds-principes-composants.md`, « Survol et tactile »).
- Un élément interactif sans survol écrit (tri de tableau) prend au survol le rendu de son appui. Vignettes de badge : contour de 2 px `bordure-action` dessiné à l'intérieur (rangée de la carte « Prochain badge » : six sur une ligne s'ils tiennent, sinon deux rangées de trois ; pas une rangée de contrôles ; lien « Mes badges · X/6 » seul sur sa ligne, dessous) ; point inactif de l'Introduction : `fond-controle-survol` (`ds-principes-composants.md`, « Composants d'écran »).
- Pas de surlignage natif au tap (`-webkit-tap-highlight-color: transparent`).
- Transition `all 0.15s ease` sur tous les CTA. Survol : principal → `fond-action-survol` ; secondaire et contour → `fond-accent` ; supprimer → `fond-erreur` ; orange → `fond-recompense-survol` ; cartes et lignes cliquables (celles de la section Chevrons) → `fond-accent`, au survol et à l'appui.
- Tout nouveau style de survol suit ces règles.

### Focus

- Un seul style, quelle que soit la surface (décision du 12/11) : tout élément interactif qui n'est pas un champ (bouton, lien, carte ou ligne cliquable, entrée de navigation, case, ligne de choix) prend un contour de 2 px `bordure-focus` à l'extérieur, décalé de 2 px, entouré d'un halo `bordure-focus-halo` (blanc) de 2 px, visible au clavier seulement (`:focus-visible`). Sur chaque surface, l'une des deux couleurs atteint 3:1 (WCAG 1.4.11 et 2.4.7). Aucune règle selon la surface. `bordure-focus` n'est jamais lié à `action` (`couleurs.md`, décision 4). Rendu et limite (halo en `box-shadow`, rogné par un parent en `overflow: hidden`) : `ds-principes-composants.md`, « Focus ».
- Champ : la bordure de 2 px `bordure-controle` du repos prend `bordure-focus` au focus (dessinée à l'intérieur, pas d'`outline` extérieur), pour qu'aucun conteneur qui défile ne la rogne.
- Un conteneur qui défile et que le navigateur rend focusable prend le même contour que les autres éléments.
- Un seul indicateur de focus par élément : un contrôle dessiné sur un input masqué (« Bonne réponse » de Création de cours) montre le contour de son repère, pas celui de l'input.

### Désactivé

Une règle commune pour tout élément interactif (décision du 12/11) : fond `fond-action-desactive` (élément à fond ou à contour), contour `bordure-action-desactive` (élément à contour), texte et icône `texte-action-desactive`, sans opacité. Retour : sans objet (`ds-principes-composants.md`, « Désactivé »).

### Ponctuation

- Textes de contenu (leçons, énoncés, réponses, explications, titres de cours, critères) : l'espace avant « ? », « ! », « : », « ; », « % » devient une espace fine insécable U+202F, et un pourcentage collé reçoit cette espace. Fonction `typo()` (`src/lib/typographie.js`), aussi appliquée dans `ContenuMarkdown`.
- Textes fixes de l'interface (apprenant et formateur) : même règle, l'espace fine insécable est écrite directement dans le JSX ou la chaîne (pas d'appel à `typo()` sur un texte en dur, pas d'échappement). `typo()` est réservé aux textes dynamiques.
- Tout nouveau texte suit cette règle.

### Bouton orange

- Uniquement pour lancer le quiz flash. Texte encre (`texte-principal`), jamais blanc.
- Fond `fond-recompense`, survol `fond-recompense-survol`.
- Un seul bouton orange par écran (2.1.0, brouillon).

### Typographie

Source : `docs/tokens/typographie.md` (section citée entre parenthèses). Les rôles et leurs valeurs sont dans la liste générée de la section 3 (« Typographie, rôles »).

**Règle d'usage** (section 11) : un élément applique son rôle par `font: var(--typo-<rôle>)`, son état ou son emphase par `font: var(--typo-<rôle>-fort)`. Jamais `font-size` ni `font-weight` séparés, jamais un primitif (`--typo-taille-*`, `--typo-graisse-*`…). Le raccourci `font` ne porte pas l'espacement des lettres et remet `font-style` à sa valeur initiale : une italique se déclare après lui.

**Police, échelle, graisses, seuil**
- Une seule police : Urbanist, en romain de 500 à 800, plus l'italique 500 (section 1).
- Les tailles sont pensées en px et sortent en rem (base 16 px). Un texte doit pouvoir être agrandi jusqu'à 200 % sans perte de contenu ni de fonction (WCAG 2.2, critère 1.4.4). Un conteneur de taille fixe qui contient du texte (anneau, pastille, rond numéroté, bouton de hauteur fixe) reste lisible quand le texte grandit : le texte ne déborde pas et n'est pas coupé (section 1).
- Échelle fermée de 13 tailles : 13 · 14 · 15 · 16 · 17 · 18 · 21 · 24 · 28 · 32 · 34 · 44 · 48 px. Aucune autre taille, pas de taille intermédiaire (27 px ou 20 px ne s'écrivent pas). On choisit un rôle, pas une taille (section 2).
- Quatre graisses : 500 · 600 · 700 · 800. 400 et 900 n'existent pas dans Skillo (section 3).
- Un seul seuil typographique : 768 px. Chaque rôle a au plus une taille sous 768 px et une à partir de 768 px. Le seuil de 1024 px de Création de cours est un seuil de mise en page : sous 1024 px, l'en-tête compact prend le Titre de ligne ; à partir de 1024 px, l'en-tête desktop prend le Titre de page (section 4).
- 19 rôles, 20 lignes (Chiffre mis en avant a deux niveaux). Aucun rôle n'a d'espacement des lettres (section 5). Deux rôles de titre (Titre de page, Titre de contenu, Titre mis en avant, Titre de section, Titre de carte, Titre de ligne) ne prennent jamais la même valeur, à aucune largeur (section 5).

**Rattachement** (section 7)
- La fonction d'un texte libre décide de son rôle, jamais sa taille actuelle ni la place disponible. Deux textes qui ont la même fonction ont la même typographie, où qu'ils soient. Le rôle d'un texte de composant (valeur d'un anneau, libellé d'un bouton, texte d'une pastille) est fixé par la fiche du composant.
- Un texte écrit aujourd'hui dans une autre taille que son rôle n'est pas une exception : c'est une dérive à corriger. La place disponible (intérieur d'un anneau, largeur d'une carte) se vérifie après coup, elle ne choisit pas le rôle.
- Le rôle ne dépend pas de la balise HTML : le niveau de titre (h1, h2…) donne la structure de la page, le rôle donne l'apparence. Exemple : le nom d'un thème, dans le Détail d'un thème, est un h1 en Titre de contenu.
- Si la fonction ne permet pas de décider : « À trancher », pas un choix à l'œil (voir section 7 de ce fichier).
- *Texte de composant* (décision C8 révisée, 13/11) : la valeur au centre de tout anneau est en Chiffre mis en avant standard, fixée par la fiche Anneau ; l'anneau de fin de quiz en Chiffre mis en avant grand (exception écrite de la fiche) (`typographie.md`, section 7).

**Choisir entre deux rôles voisins** (section 6)
- **Titre de section ou Titre de carte : test du nom.** Le nom d'une partie de la page ou du contenu, qui annonce ce qui suit (« De ton formateur », « Taux de complétion », intertitres de leçon, « À retenir ») → Titre de section. Le nom d'une chose que la carte présente (cours, thème, groupe, badge, action) ou ce qui dit où l'on en est (« Raté, mais tu vas retenir ça », « Tu as fini les 12 cours »), avec une explication ou une information en dessous (« X étapes sur N », carte de thème, « Quiz flash » en ligne) → Titre de carte. Une carte garde le même rôle de titre quelle que soit sa place dans l'écran (en tête, en colonne ou en ligne), sauf si elle porte l'action principale de l'écran : son titre passe alors en Titre mis en avant. Une modale ou une feuille de menu prend le Titre de section quel que soit son texte : elle tient la place d'un écran.
- **Titre mis en avant ou Titre de carte.** Titre mis en avant : titre de la carte qui porte l'action principale de l'écran, celle que l'écran existe pour faire. Au plus une par écran. Sur le dashboard apprenant, c'est le bloc de tête, quelle que soit sa variante. Un écran qui propose plusieurs choix de même poids n'en a pas. La carte porte une seule action, son bouton principal. Une carte qui regroupe plusieurs actions garde son rôle (exemple : « Pour bien démarrer »). Exemples : titre du bloc de tête du dashboard apprenant (cours en cours, cours assigné, premier cours ou prochain cours conseillé en tête, « Quiz flash » en tête), « Étape suivante » (leçon, checklist), « Suite du thème » (récap) → `--typo-titre-mis-en-avant`. Restent en Titre de carte : « Quiz flash » en ligne, le prochain cours conseillé hors tête, les deux cartes du Choix du profil (deux choix de même poids). « Pour bien démarrer » reste en Titre de section. Raison : un niveau de titre qui s'applique à plusieurs cartes ne hiérarchise plus rien ; un rôle limité à une carte par écran, lui, hiérarchise (section 6).
- **Titre de carte ou Titre de ligne : carte ou ligne.** Un élément posé directement sur la page est une carte (Titre de carte). Un élément répété à l'intérieur d'une carte ou d'une modale est une ligne (Titre de ligne), même s'il a un fond. Exemples : groupes de « Tes groupes » et tuiles de la modale Mes badges → Titre de ligne ; cartes de cours assigné du Détail groupe → Titre de carte.
- **Chiffre mis en avant ou Compteur : test binaire.** Le nombre est le sujet du bloc, le bloc existe pour le montrer (carte de statistique, taux de complétion, score de fin de quiz en pourcentage) → Chiffre mis en avant. Sinon (position, avancement, total ou gain qui accompagne le sujet du bloc : « 3 / 5 » d'un quiz, XP de l'en-tête, « +15 XP ») → Compteur. Un nombre a un rôle et un seul ; sa forme (pourcentage, fraction, entier) ne décide jamais. La valeur au centre d'un anneau est un texte de composant : rôle fixé par la fiche Anneau.
- **Chiffre mis en avant, standard ou grand.** Grand : le nombre est le sujet de l'écran entier, comme le score de fin de quiz (quiz de cours et quiz flash), affiché en pourcentage. Standard : le sujet d'un bloc.
- **Corps courant ou Texte de lecture.** Texte de lecture : le texte de la leçon, dans la fiche, dans son aperçu (Création de cours) et dans le Détail cours (premier paragraphe). Corps courant : toutes les autres phrases lues (explications, paragraphes, intitulés d'étape, réponses affichées).
- **Texte secondaire ou Méta.** Texte secondaire : une phrase complète qui commente un autre élément sans être le contenu principal (sous-titre, état vide, aide, erreur, message, note sous une carte). Méta : une information courte et factuelle sur un élément, lue en passant (contenu « Leçon · Quiz », date, compte, statut, « N min de lecture »). Le sous-titre posé sous le titre d'une page ou d'un contenu est en Texte secondaire, même quand il donne un compte (« x cours terminés sur y » du Détail d'un thème, « X thèmes terminés sur 12 » de la page Cours). Un compte posé sur un élément sans en être le sous-titre reste en Méta (« y cours » de la carte de thème, « N min de lecture »). Raison : le sous-titre fait partie des exemples du Texte secondaire, et la forme du texte ne décide pas du rôle.
- **Lien texte ou Navigation.** Navigation : une option reste marquée comme choisie et change ce qu'on voit (écran, vue, filtre) sans agir sur les données (barre d'onglets, onglets « Écrire / Aperçu », filtres, entrées de menu qui mènent à un écran ou à une vue et restent marquées, repère d'étapes). Lien texte : une action sans forme de bouton ni état choisi, qui agit ou mène ailleurs une fois (« Tout voir », « Revoir la leçon », « Passer cette étape », « Voir comme un élève »). Les entrées de menu qui agissent (« Se déconnecter », actions du menu « … » de l'espace formateur) sont des Liens texte.
- **Lien posé dans une phrase.** Il prend le rôle de la phrase en variante `-fort` (un cran de graisse) et ne change jamais de taille ; un lien seul, hors d'une phrase, prend le rôle Lien texte. Un lien dans une phrase fait partie de la phrase, et la taille ne change pas dans une ligne (section 8). Exemple : « 3 cours » et « 1 groupe » dans « 3 cours · 1 groupe · 12 élèves » du dashboard formateur, en Texte secondaire fort (`--typo-texte-secondaire-fort`).
- **Bouton ou Lien texte : la forme.** Un texte d'action posé dans une forme de bouton (fond, contour ou pointillé, padding, zone cliquable de bouton) prend le rôle Bouton ; sans forme de bouton, Lien texte. Le libellé du bouton Retour est en rôle Bouton : la variante Retour a une forme de bouton.

**États et emphase** (section 8)
- Un état (choisi, en cours, fait, coché) ou une emphase monte la graisse d'un cran, jamais la taille : 500 → 600, 600 → 700, 700 → 800. C'est la variante `-fort` du rôle.
- L'option choisie d'une Navigation (entrée active, onglet actif, filtre actif, étape en cours) est un état : 800.
- Pas de partie plus légère que son rôle : un compteur dans une pastille, un message « Aucune modification » ou tout fragment plus maigre prend la graisse du rôle.
- L'emphase dans une phrase (`strong`, gras Markdown, nom en gras dans un fil d'activité) suit la même règle qu'un état.
- Dans les rôles à 800, l'emphase reste invisible, et c'est accepté : 800 est la graisse la plus forte, ces rôles n'ont pas de variante `-fort`.
- En-tête de tableau (`th`) : il prend le rôle du tableau qu'il coiffe, en variante `-fort` (un tableau en Corps courant : en-têtes en Corps courant fort). Si ce rôle est à 800, l'en-tête reste à 800.
- *Implémentation* : `ContenuMarkdown` exige le prop `roleTypo` (`texte-lecture`, `corps-courant`, `corps-courant-fort`, `titre-contenu`, `titre-ligne`), le rôle du texte qu'il affiche. Le composant pose `font: var(--typo-<rôle>)`. `strong` et `a` d'une phrase y prennent la variante `-fort`, sauf pour un rôle à 800 ou déjà `-fort`. Les titres Markdown (h1 à h4) sont en Titre de section ; le tableau est en Corps courant, ses `th` en Corps courant fort.

**Contrôles** (section 9)
- Chaque bouton, champ, liste déroulante ou ligne de choix déclare la typographie de son rôle (Bouton, Saisie et choix, Navigation…), jamais la police par défaut du navigateur : les navigateurs n'appliquent pas l'héritage de la police aux boutons et aux champs.
- Saisie et choix : tout texte tapé ou choisi dans un champ fait 16 px, même dans un en-tête dense ou une ligne de filtres (Safari sur iOS agrandit la page sous 16 px).
- Croix de fermeture, flèches Monter / Descendre et flèches de tri : icônes SVG, comme les autres boutons ronds, jamais des caractères (×, ↑, ↓, ▲, ▼). Elles sortent de la typographie.

**Italique** (section 10)
- Urbanist italique 500, chargée seule. Elle apparaît dans le contenu Markdown des cours, en Texte de lecture et en Corps courant.
- Le gras italique n'est pas prévu. S'il apparaît dans un Markdown, le gras fabriqué par le navigateur est accepté.

**Césure des titres** (sections 5 et 11)
- Un titre (page, contenu, section, mis en avant, carte) qui ne tient pas dans son conteneur se coupe à la syllabe, avec un tiret, dans un mot de 10 lettres ou plus, avec au moins 4 lettres de chaque côté du tiret. Filet : coupure sans tiret plutôt que débordement. Limites acceptées : Firefox ne met pas de tiret dans un mot à majuscule initiale, et peut couper un mot qui tenait pour équilibrer les lignes. Raison : un conteneur fixe qui contient du texte doit rester lisible quand le texte grandit (« Thermodynamique » en 18 px déborde de la carte de thème à 375 px).
- Titre de ligne : pas de césure automatique, c'est la règle du rôle ; dans une ligne, c'est le statut qui passe sous le titre (fiche Ligne de liste). Filet : coupure sans tiret si un mot ne tient pas sur toute la largeur.
- Dans le code : chaque `font: var(--typo-titre-…)` (sauf Titre de ligne) est accompagné de `hyphens: auto`, avec l'implémentation par `hyphenate-limit-chars: 10 4 4`, `-webkit-hyphenate-limit-before: 4`, `-webkit-hyphenate-limit-after: 4`, `overflow-wrap: break-word`, et de `text-wrap: balance` (lignes équilibrées ; posé par `index.css` sur `h1`, `h2`, `h3`, déclaré dans sa règle par tout autre élément qui porte un rôle de titre). Jamais `hyphens: manual` ni `overflow-wrap: normal` sur ces titres. Titre de ligne : `hyphens: manual`, `overflow-wrap: break-word`, `text-wrap: balance`, jamais `hyphens: auto`. La césure suit `lang="fr"` de la balise `html`.

**Césure du Texte de lecture** (section 5)
- Le Texte de lecture se coupe à la syllabe, avec un tiret, partout où il apparaît. Les autres rôles ne se coupent pas, sauf les titres (césure des titres).
- Implémentation, état du code : `hyphens: auto` posé par `ContenuMarkdown` quand `roleTypo` vaut `texte-lecture` (leçon de la fiche, aperçu de Création de cours, premier paragraphe du Détail cours), page en `lang="fr"`. Le tableau du Markdown (Corps courant) ne se coupe pas.

### Rayons

Source : `docs/tokens/rayons.md` (section citée entre parenthèses). Les tokens et leur description sont dans la liste générée de la section 3 (« Rayons »).

**Principe** (section 2)
- Le moins de rayons possible, pour que l'agent n'ait pas à choisir. Cinq rôles, une valeur chacun, la même à toutes les largeurs. Aucun seuil à 768 px.
- Plancher : trois rôles de forme et deux rôles de niveau. Un bloc posé dans un autre est moins arrondi que lui.

**Les cinq rôles** (section 3)

| Rôle | Token | Valeur | S'applique à |
|---|---|---|---|
| Pilule | `rayon-pilule` | 999 px | Élément dont les deux bouts sont des demi-cercles. Bouton, champ d'une ligne, pastille, filtre, barre de progression et son remplissage, entrée de tab bar. |
| Rond | `rayon-rond` | 999 px | Élément carré rendu circulaire. Bouton rond (Retour mobile, « … », « + », Fermer), initiales, repère d'étape, radio, icône dans un rond, vignette carrée d'une liste (objet du thème, badge de la collection). |
| Case | `rayon-case` | 6 px | Case à cocher, repère « Bonne réponse » en plusieurs réponses. |
| Surface | `rayon-surface` | 30 px | Bloc posé directement sur le fond de la page, ou flottant au-dessus. Carte, en-tête de page, bloc de tête du dashboard, blocs d'introduction et « Plus qu'une étape », liste en carte, carte pointillée d'action, tab bar, modale, toast, menu déroulant, menu « … ». |
| Élément | `rayon-element` | 22 px | Bloc à fond ou à contour posé dans une Surface, à n'importe quelle profondeur. Ligne à fond, « À retenir », carte de question, entrée de menu, miniature (non carrée), repère d'étapes, case de badge. |

- Rond à 999 px et non à 50 % : le format DTCG 2025.10 n'accepte que px et rem pour une dimension. Sur un élément carré, 999 px donne le même cercle que 50 %. Sur un élément qui n'est pas carré, 50 % donnerait une ellipse, 999 px une pilule : l'ellipse n'est jamais voulue. Le Rond reste un rôle à part parce que sa condition est la forme carrée de l'élément, pas son rayon.
- Surface > Élément, strictement (30 > 22).

**Choisir le rôle** (section 4)

Dans cet ordre, on s'arrête à la première réponse.

1. C'est une case à cocher : Case. Un radio : Rond. La fonction du contrôle décide, même si le dessin actuel dit autre chose.
2. L'élément est carré et doit être circulaire : Rond.
3. Les deux bouts de l'élément sont des demi-cercles : Pilule. Ce rôle de forme passe avant le niveau (barre d'enregistrement desktop de Création de cours, bloc flottant, en Pilule).
4. Le bloc est posé directement sur le fond de la page, ou flotte au-dessus : Surface.
5. Le bloc est posé dans une Surface, à n'importe quelle profondeur : Élément.

- Toujours des Éléments, où qu'ils soient posés : un choix de réponse présenté en ligne dans une liste de réponses (quiz, parcours, Création de cours), un champ multiligne, une image, une vidéo ou un tableau de contenu (leçon, énoncé, visionneuse).
- Un choix présenté comme une carte posée sur la page reste une Surface (cartes de Choix du profil).
- Le niveau d'imbrication décide, jamais la valeur actuelle ni la taille de l'élément. Deux Éléments imbriqués prennent la même valeur.

**Variante Feuille, pas un rôle** (section 5)
- Modale et menu « … » sous 768 px, barre d'enregistrement mobile de Création de cours : `rayon-surface` sur les deux coins du haut, 0 en bas. Passer de Feuille à Pilule (barre d'enregistrement) ou à Surface (modale) au-dessus de 768 px est un changement de rôle ou de variante, pas un seuil de valeur.

**Règles d'usage** (section 7)
- Un composant lit toujours un token de rayon, jamais une valeur en dur ni une ancienne variable `--radius-*`.
- Un nouveau bloc prend le rôle de sa place, même si un voisin a une autre valeur aujourd'hui.
- Une image ou une miniature non carrée dans une Surface est un Élément, même quand elle touche le bord de la Surface. Une vignette carrée est un Rond.
- Les illustrations n'ont pas de rayon.
- La page `/design-system` suit les mêmes rôles.
- Un Élément posé à moins de 20 px du bord de sa Surface suit la règle du bord : rôle Bloc près du bord, le même écart en haut, en bas et sur les côtés (valeur et construction dans `docs/tokens/espacements.md`, sections 4 et 5). Les coins sont alors concentriques (rayon-surface − écart = rayon-element). Avec deux écarts différents, aucun rayon unique ne peut l'être.
- Implémentation, état du code : les variables `--radius-*` ont été retirées de `shared.css` (chantier rayons, a12a3f2). Tous les rayons lisent `--rayon-*`.

**Provisoire et hors chantier** (section 11)
- *Provisoire* : Bouton Fermer de la modale Mes badges (`.modal-fermer`, 8 px) : laissé tel quel. Il n'est pas carré, un Rond en ferait une ellipse. À régler au chantier mise en page en passant Mes badges sur le composant Modale.

### Espacements

Source : `docs/tokens/espacements.md` (section citée entre parenthèses). Les tokens et leur description sont dans la liste générée de la section 3 (« Espacements, rôles »).

**Choisir le rôle** (section 3)
- La fonction et la place d'un espacement décident de son rôle, jamais sa valeur actuelle ni la taille de l'élément. Deux espacements qui décrivent la même relation entre deux éléments ont le même rôle, et la même valeur, où qu'ils soient.
- Une valeur par rôle, la même à toutes les largeurs. Aucun seuil à 768 px.
- Dans l'ordre : padding interne d'un contrôle ou écart icône et libellé ; bord d'un conteneur (page, Surface, Élément, carte de liste ou ligne, bloc près du bord) ; écart entre deux choses (blocs, groupes, textes d'un groupe, rangée, répétition, colonnes) ; contenu de leçon.

**Les rôles** (section 4)

| Rôle | Token | Valeur | Critère |
|---|---|---|---|
| Marge de page | `espace-marge-page` | 16 px (côtés sous 768 ; au-dessus, valeurs actuelles gardées) | Padding du Conteneur de page, toutes les pages ; marge horizontale d'une barre fixe sur toute la largeur. |
| Entre deux blocs | `espace-blocs` | 20 px | Deux blocs de nature différente, ou deux sections d'une page, empilés. Retour compris. |
| Padding d'une Surface | `espace-surface` | 20 px | Bloc posé sur le fond de la page ou flottant : carte, en-tête de page, bloc de tête, modale, feuille, toast. |
| Bloc près du bord | `espace-bord` | 8 px | Bloc à fond à moins de 20 px du bord de sa Surface : le même en haut, en bas et sur les côtés, y compris en dernier. Aussi le padding d'une carte de liste. |
| Entre deux groupes | `espace-groupes` | 12 px | Titre et texte, texte et bouton, titre de section et contenu (dans une Surface ou posé sur la page), deux champs, bouton principal et lien dessous. |
| Deux textes d'un groupe | `espace-textes` | 4 px | Surtitre et titre, titre et sous-titre ou compteur, titre et méta, libellé et champ, champ et aide, deux puces. |
| Rangée | `espace-rangee` | 12 px | Éléments différents côte à côte. |
| Répétition | `espace-repetition` | 8 px | Éléments de même nature répétés, sans séparateur. |
| Ligne de liste | `espace-ligne` | 12 px | Padding de la ligne sur les quatre côtés ; cellule de tableau : `espace-ligne` en vertical, `espace-rangee` en horizontal. |
| Icône et libellé | `espace-icone` | 8 px | Icône et libellé d'un bouton, d'une pastille, d'une entrée de navigation, d'un lien. |
| Padding d'un contrôle | `espace-bouton`, `espace-retour-chevron` / `-libelle`, `espace-champ`, `espace-pastille-*`, `espace-choix-*`, `espace-navigation-*`, `espace-lien`, `espace-etiquette` | une valeur par composant (section 7) | Padding interne d'un contrôle. |
| Rythme du contenu | `espace-paragraphes`, `espace-intertitre-avant` / `-apres`, `espace-retrait-puces` | section 7 | Contenu de leçon. |
| Colonnes | `espace-colonnes` | 40 px | Deux colonnes d'une liste sur desktop. |
| Padding d'un Élément | `espace-element` | 16 px | Bloc à fond ou à contour posé dans une Surface. |

**Cas limites** (section 4)
- Entre deux blocs ou Répétition : deux blocs de nature différente, Entre deux blocs ; deux cartes de même nature répétées, Répétition.
- Entre deux groupes ou Deux textes d'un groupe : une seule information (le titre et ce qui le précise), Deux textes ; deux informations ou un texte et une action, Entre deux groupes.
- Padding d'une Surface ou Bloc près du bord : quand un bloc à fond doit être plus près du bord que 20, la Surface prend 8 et le bloc est posé directement, sans calc ni marge négative.
- Ligne de liste ou Padding d'un Élément : une ligne n'a de fond qu'au survol (12) ; un Élément a un fond ou un contour au repos (16).

**Hiérarchie** (section 5) : Surface 20 > Élément 16. Liste : carte à 8, ligne à 12 sur les quatre côtés ; au survol, le fond remplit la ligne, à 8 du bord de la carte.
- En-tête d'une carte de liste (titre, pastille, compteur, lien posés au-dessus des lignes) : posé comme une ligne, padding `espace-ligne` sur les quatre côtés, sans survol ni séparateur, aucun écart en plus avec la liste. Son texte tombe à 20 du bord de la carte, comme celui des lignes.

**Débords et défilement** (section 6)
- Une marge négative de débord annule exactement le padding qu'elle traverse et cite son rôle : `calc(-1 * var(--espace-marge-page))`.
- Une rangée de cartes qui défile jusqu'au bord de l'écran reprend la marge de page au début et à la fin.
- Une rangée de contrôles (filtres, outils, boutons) ne défile pas : elle passe à la ligne (`mise-en-page.md`, section 7). Exception écrite : pastilles collantes du sommaire mobile de Création de cours.
- Un tableau plus large que sa carte défile horizontalement dans sa carte.
- La zone de sécurité s'ajoute à la valeur du rôle.

**Cas particuliers de composant** (section 7) : bouton à flèche, 24 à gauche et le rond à 6 du bord à droite ; champ avec icône à gauche, réserve de 44 (icône de 20 à 16 du bord, puis 8 jusqu'au texte) ; bouton ou choix posé dans la rangée d'un champ, hauteur du champ ; entrée de liste déroulante, réserve de la coche (30) ; Choix à hauteur fixe, côtés seulement ; « Bonne réponse », gauche à 0 sous 768 ; rangée des CTA du dashboard formateur, passe à la ligne, libellés en `nowrap`.

**Valeurs hors rôle** (sections 8 et 9)
- Une valeur qui a un rôle prend la valeur du rôle, jamais un arrondi. Une valeur sans rôle et hors échelle : le palier le plus proche, à égalité le supérieur.
- Une dimension (réserve, débord d'illustration, marge de page desktop, zone d'action, position d'un élément fixe ou collant, haut du Conteneur, bas d'une page sans barre fixe (40), place de l'ombre d'une rangée qui défile) ou une exception écrite s'écrit en px dans le composant, avec un commentaire qui renvoie à la section d'`espacements.md` (8 ou 9). Une largeur de colonne, un seuil ou une exception de mise en page renvoie à `mise-en-page.md`. Jamais un primitif `espace-N`, même quand la valeur existe dans l'échelle.
- Hauteur minimale d'un en-tête lavande sur desktop (objet 3D centré verticalement) : hauteur de l'objet 3D + 2 × `espace-surface`, en px avec un commentaire qui renvoie à cette section, pour que l'objet reste dans le cadre (même logique que la réserve des illustrations).
- Tab bar mobile (sous 768) : Côtés de la barre à 12 px (au lieu de la marge de page), padding de la barre 6 px, écart entre entrées 4 px, entrée 6 px en haut et en bas, 4 px sur les côtés. Raison : à 320 px, « Dashboard » en Navigation (14 px, 800) ne tient avec aucun padding d'entrée dans la barre construite avec les rôles, et la typographie interdit de réduire la taille ou le libellé (règle de la tab bar). Desktop : rôles normaux (Entrée de navigation 8 × 16).
- Implémentation, état du code : des composants lisent encore des primitifs (`var(--espace-N)`) ; ils passent aux rôles avec les lots de migration. Un nouveau code ne lit jamais un primitif.

### Mise en page

Source : `docs/tokens/mise-en-page.md` (section citée entre parenthèses). Pas de token : les valeurs sont des dimensions de mise en page, en px dans le composant avec un commentaire qui renvoie à la section (section 9).

**Largeurs de colonne** (section 3) : la fonction de l'écran décide du rôle, jamais la largeur actuelle. Toutes centrées.

| Rôle | Valeur | Écrans |
|---|---|---|
| Page | 1040 px | pages avec navigation |
| Lecture | 880 px de contenu (la colonne compte son padding en plus) | leçon, checklist, récap ; Détail d'un thème |
| Question | 680 px | quiz et quiz flash, barre d'action du quiz, haut de la fin de quiz |
| Formulaire | 440 px | parcours d'entrée, Mot de passe oublié, Nouveau mot de passe, chargement de l'app, colonne et actions de la fin de quiz |

- Exception écrite : Création de cours, 1200 px, seuil 1024. Hors de ce fichier : modales et toast. Les bornes internes (texte des blocs du dashboard, en-têtes du tableau du Détail groupe, champ de recherche de l'en-tête lavande) ne sont pas des colonnes. La réserve d'une illustration s'applique sur l'axe où l'illustration rencontre l'élément (section 3).

**Seuils** (section 4)
- 768 px est le seul seuil de mise en page, comme pour la typographie.
- Grilles de cartes : sous 768, rien ne change ; à partir de 768, colonnes automatiques avec une largeur minimale de carte, écart inchangé (thèmes de la page Cours 210 px, Mes groupes 300 px, grille de `/design-system` choisie pour garder ses colonnes à 1200). Aucune grille n'a de seuil à elle.
- Une règle à 768 qui change une dimension de mise en page est permise ; une règle à 768 qui change la valeur d'un rôle d'espacement est une dérive, sauf exception écrite (`espacements.md`, section 9).

**Haut du contenu et ancres** (section 5) : haut du contenu à 104 px sur desktop, zone de sécurité + 20 px sur mobile ; une cible d'ancre s'arrête au même endroit. Une seule source pour 104 (Conteneur de page). Création de cours garde ses propres valeurs (exception).

**Colonnes de lignes** (section 6) : sous 768, une colonne. À partir de 768 : ligne avec la pastille sous le titre (« De ton formateur » de la page Cours), colonnes automatiques, 260 px minimum ; ligne avec la pastille à côté du titre (Mode terrain, résultats de recherche), 2 colonnes, nombre fixe. Écart : Colonnes (40).

**Rangées de contrôles** (section 7) : une rangée de contrôles passe à la ligne quand elle ne tient pas (filtres d'Activité récente, la recherche passant dessous si besoin ; barre d'outils de l'éditeur). Seules les rangées de cartes défilent.

**Exceptions écrites** (section 8)
- Création de cours : 1200 px, seuil 1024, arrêts de défilement propres.
- Pastilles collantes du sommaire mobile de Création de cours : elles défilent.
- Introduction sous 667 px de haut (`max-height: 666px`) : zone d'action au plus bas (zone de sécurité + 8, rangée des points gardée à 44), barre « Passer » / logo à zone de sécurité + 8 du haut, bloc lavande → titre en Deux textes d'un groupe, bloc lavande réduit jusqu'à ce que les trois slides tiennent à 320 × 568 (environ 82 px), illustration à l'échelle. « Suivant » garde sa place, la police ne change pas.
- Taux de complétion du dashboard formateur : seuil de 399 px, provisoire (chantier composants).

**Conduite** (section 10) : une largeur, un seuil ou une rangée qu'aucune règle ne couvre se signale « À trancher » ; l'agent n'ajoute ni seuil, ni largeur, ni exception.

### Icônes

- Les tracés utilisent `currentColor`.
- *Implémentation* : SVG importés en `?raw` et rendus inline par `src/components/Icone.jsx`.
- La couleur se pilote par la propriété `color` du parent (exemple : `texte-principal` sur le bouton orange). Pas de filtre CSS.
- Exception : les illustrations multicolores (`Assets/badge/`, onboarding) restent en `<img>`.

### Navigation

- Mobile : tab bar flottante en bas, fond `fond-inverse`, rayon `rayon-surface`, côtés de la barre à 12 px, bas à 20 px (exception « Tab bar mobile » et dimension du composant, `espacements.md`, section 9), 4 entrées avec icône et libellé ; les onglets prennent une part égale de l'espace libre plus leur padding, le Menu (dans son conteneur, sans padding) la part seule : il est plus étroit de 2 × le padding horizontal de l'entrée.
- Desktop : même barre en haut, logo en variante foncée à gauche, entrées en pilules à droite.
- Onglet actif : fond `fond-accent`, texte et icône `texte-principal`. Onglets inactifs : `texte-sur-inverse`. Survol d'une entrée : `fond-inverse-survol`.

### Listes déroulantes

- Option sélectionnée : fond `fond-accent`, texte et coche `texte-accent`.
- Survol d'une option : `fond-sur-carte` (le mode donne la valeur), jamais sur l'option sélectionnée.
- *Implémentation* : le menu est rendu en portail ; `Dropdown.jsx` détecte l'espace à l'ouverture et pose `.dropdown-content-formateur` en mode formateur.

### Objet 3D du thème et numéro

- L'anneau de progression est réservé à la progression.
- L'objet 3D du thème remplace la pastille numéro (cartes de la page Cours, en-tête du détail d'un thème). Le numéro s'affiche en texte (« Thème N »).

### Chevrons

- Couleur `texte-secondaire` (via `currentColor`).
- *Implémentation* : icône `chevron-right.svg`, classe `.chevron-ligne`.
- Un chevron à droite sur les cartes de thème, les lignes du détail d'un thème, les résultats de recherche, les lignes du Mode terrain, de « De ton formateur » (page Cours), de « Mes cours » et de « Mes groupes ». Toute la carte reste cliquable.

### Logo

- Composant `src/components/Logo.jsx` : SVG inline, « skill » vectorisé en Urbanist ExtraBold et « o » en anneau de progression (cercle de fond et arc de trois quarts partant du haut, extrémité arrondie, épaisseur égale au fût des lettres, diamètre égal à la hauteur des minuscules).
- `variante="clair"` : texte `texte-principal`, fond de l'anneau `fond-accent`, arc `fond-marque`.
- `variante="fonce"` : texte `texte-sur-marque`, fond de l'anneau `fond-marque-accentue`, arc `fond-surface`.

### Anneaux de progression selon le fond

Rendu : extrémité arrondie, départ en haut, pourcentage au centre ; sans données, piste seule et « — ». Couleurs : `couleurs.md`, décision 1. Tailles (fiche Anneau de `ds-principes-composants.md`) : 108 px sous 768, 120 px à partir de 768, piste de 10 px à toutes les tailles, valeur en Chiffre mis en avant standard ; exception écrite, fin de quiz, 168 px, piste 16 px, Chiffre mis en avant grand.

| Fond | Piste | Arc |
|---|---|---|
| Fond clair | `fond-accent` | `fond-marque` |
| Carte violette | `fond-marque-accentue` | `fond-surface` |
| Fin de quiz (fond lavande) | `fond-surface` | `fond-marque` |

### Toast de complétion

Fond `fond-inverse`, texte `texte-sur-inverse`, pastille XP en `fond-recompense` avec texte `texte-principal`.

Un toast informatif n'a aucune action ni élément focalisable ; il est annoncé par `role="status"` et se ferme seul ; la fermeture au clic n'est qu'un raccourci.

### Pastille « Bloquante »

Texte `texte-erreur` sur fond `fond-erreur`.

## 6. Exemples

Format : situation, erreur, pourquoi (règle citée), conforme.

**Exemple non conforme : bouton orange**
- Situation : bloc « Cours en cours » du dashboard apprenant.
- Erreur : « Continuer le cours » en bouton orange, parce que c'est l'action la plus motivante de l'écran.
- Pourquoi : principe 1, l'orange est réservé à la récompense. Continuer un cours n'en donne pas directement. L'élève ne saurait plus quel bouton mène au quiz flash.
- Conforme : bouton blanc sur carte violette (bouton sur fond foncé).

**Exemple non conforme : séparateur**
- Situation : tableau des élèves du Détail groupe.
- Erreur : un trait sous la ligne d'en-tête, parce que la plupart des tableaux en ont un.
- Pourquoi : l'en-tête nomme les colonnes, ce n'est pas un élément répété. Principe 3, la profondeur vient du fond et de l'espacement, pas des traits.
- Conforme : espacement sous l'en-tête, trait seulement entre deux lignes d'élèves.

**Exemple non conforme : bouton**
- Situation : dans Détail groupe, un champ email et un bouton pour ajouter l'élève au groupe.
- Erreur : un bouton pointillé « + Ajouter », parce que l'action « ajoute » quelque chose.
- Pourquoi : « Utiliser le pointillé pour valider un formulaire. On prend le principal. » Le pointillé sert à ajouter un élément dans la création de cours.
- Conforme : bouton principal plein, de même hauteur que le champ voisin.

**Exemple non conforme : champ**
- Situation : un champ de saisie dans une carte blanche de l'espace formateur.
- Erreur : une bordure de 1 px au repos qui passe à 2 px au focus, ou le champ sans bordure parce qu'il a déjà un fond différent de la carte.
- Pourquoi : « Épaissir la bordure au focus ou en erreur. Le contenu bougerait ; seule la couleur change. » Et tout champ a sa bordure de 2 px `bordure-controle` au repos (décision du 12/11).
- Conforme : fond `fond-sur-carte` (le mode donne la bonne valeur), bordure 2 px `bordure-controle` au repos, `bordure-focus` au focus, `bordure-erreur` en erreur, toujours 2 px, dessinée à l'intérieur.

**Exemple non conforme : barre de progression**
- Situation : une carte qui montre l'avancement d'un groupe sur ses cours.
- Erreur : la barre seule, pour une carte plus épurée.
- Pourquoi : « Toujours afficher le chiffre à côté de la barre. »
- Conforme : barre fine (piste `fond-neutre`, remplissage `fond-marque`) avec le pourcentage ou le compteur à côté.

**Exemple non conforme : en-tête de page**
- Situation : une nouvelle page de section avec un objet 3D et une action principale.
- Erreur : faire déborder l'objet comme sur le dashboard, et placer le bouton d'action dans l'en-tête.
- Pourquoi : « L'objet 3D reste dans le cadre, sans débord ni ombre. » « L'en-tête situe, les actions vivent dans le contenu. »
- Conforme : objet dans le cadre, bouton dans le contenu sous l'en-tête.

**Exemple non conforme : pastille de statut**
- Situation : une nouvelle liste de cours affiche le statut « En cours ».
- Erreur : une pilule violette pleine écrite localement dans la liste.
- Pourquoi : « Aucune pastille n'utilise fond-action, fond-marque ni fond-recompense. » « Utiliser la même pastille partout où un statut de cours apparaît. »
- Conforme : `<StatutBadge statut="en_cours" />`, sans style local.

**Exemple non conforme : séparateur dans une liste en colonnes**
- Situation : une liste de lignes affichée sur deux colonnes en desktop.
- Erreur : un trait sous chaque ligne, y compris sous la dernière ligne de chaque colonne.
- Pourquoi : « Dans une liste disposée en plusieurs colonnes, le dernier élément de chaque colonne n'a pas de séparateur. »
- Conforme : le trait est retiré sous la dernière rangée, comme dans la liste du Mode terrain.

**Exemple non conforme : état écrit en plus grand**
- Situation : étape en cours d'une checklist.
- Erreur : l'intitulé de l'étape en cours passe à 17 px pour la détacher des autres étapes.
- Pourquoi : un état monte la graisse d'un cran, jamais la taille (`typographie.md`, section 8).
- Conforme : `--typo-corps-courant-fort` (Corps courant, 15 px · 1,45, graisse 600, un cran au-dessus de 500).

**Exemple non conforme : champ plus petit pour gagner de la place**
- Situation : champ de recherche dans un en-tête de carte chargé.
- Erreur : texte du champ à 14 px pour qu'il tienne à côté des filtres.
- Pourquoi : Saisie et choix à 16 px, à cause de Safari sur iOS (`typographie.md`, section 9) ; la place disponible ne choisit pas le rôle (section 7).
- Conforme : `--typo-saisie-choix` (Saisie et choix, 16 px · 600 · 1,2).

**Exemple non conforme : croix en caractère**
- Situation : bouton de fermeture d'une modale.
- Erreur : le caractère « × » en guise d'icône, avec une taille de police pour le grossir.
- Pourquoi : croix et flèches en icônes SVG (`typographie.md`, section 9).
- Conforme : icône SVG de croix dans le bouton rond, avec un `aria-label`.

**Exemple non conforme : libellé du bouton Retour**
- Situation : bouton Retour en haut d'une page de détail.
- Erreur : le libellé en Lien texte (700), parce qu'il mène ailleurs une fois, comme un lien.
- Pourquoi : Bouton ou Lien texte se choisit par la forme ; la variante Retour a une forme de bouton (`typographie.md`, section 6).
- Conforme : `--typo-bouton` (Bouton, 15 px · 800 · 1,2), dans la pilule blanche de la variante Retour.

**Exemple non conforme : partie plus légère**
- Situation : compteur de questions à l'intérieur d'une pastille de navigation.
- Erreur : le compteur en 600 pour qu'il s'efface derrière le libellé.
- Pourquoi : pas de partie plus légère que son rôle (`typographie.md`, section 8).
- Conforme : compteur dans la graisse du rôle Navigation (700), `--typo-navigation`.

**Exemple non conforme : deux titres mis en avant sur le même écran**
- Situation : dashboard apprenant, quiz flash débloqué, rien en cours ni assigné : « Quiz flash » en tête (bloc E), puis la carte « Prochain cours conseillé » avec son bouton « Commencer ».
- Erreur : le titre de la carte « Prochain cours conseillé » aussi en Titre mis en avant, parce qu'elle a elle aussi un bouton principal et pousse à commencer un cours.
- Pourquoi : au plus un Titre mis en avant par écran ; sur le dashboard apprenant, c'est le bloc de tête (`typographie.md`, section 6). Deux titres au même niveau ne hiérarchisent plus rien.
- Conforme : « Quiz flash » du bloc E en Titre mis en avant (`--typo-titre-mis-en-avant`), le titre du prochain cours conseillé en Titre de carte (`--typo-titre-carte`).

**Exemple non conforme : compte en sous-titre**
- Situation : compteur « x cours terminés sur y » sous le titre, dans l'en-tête du Détail d'un thème.
- Erreur : Méta, parce que la définition de Méta cite « compte ».
- Pourquoi : le sous-titre d'une page ou d'un contenu est en Texte secondaire, même quand il donne un compte (`typographie.md`, section 6).
- Conforme : `font: var(--typo-texte-secondaire)`.

**Exemple non conforme : rayon d'une carte étroite**
- Situation : une carte de cours placée dans une colonne étroite sur mobile.
- Erreur : rayon réduit à 22 parce que la carte est petite.
- Pourquoi : la taille ne décide jamais, la place oui (`rayons.md`, section 4).
- Conforme : `rayon-surface`, la carte est posée sur la page.

**Exemple non conforme : rayon de l'en-tête de page**
- Situation : un en-tête de page sur desktop.
- Erreur : rayon plus grand que les cartes pour le mettre en valeur.
- Pourquoi : une valeur par rôle, aucun seuil (`rayons.md`, section 2).
- Conforme : `rayon-surface`.

**Exemple non conforme : case à cocher ronde**
- Situation : une case à cocher dans une liste de groupes.
- Erreur : case dessinée en rond pour aller avec les initiales voisines.
- Pourquoi : la fonction du contrôle décide (`rayons.md`, section 4, étape 1).
- Conforme : `rayon-case`.

**Exemple non conforme : rayon d'une image de leçon**
- Situation : une image dans une leçon.
- Erreur : rayon de la carte (30) parce qu'elle occupe toute la largeur.
- Pourquoi : une image de contenu est toujours un Élément (`rayons.md`, section 4).
- Conforme : `rayon-element`.

**Exemple non conforme : primitif dans un composant**
- Situation : padding horizontal du bouton Retour.
- Erreur : `padding: 0 var(--espace-20) 0 var(--espace-12)`, parce que les valeurs sont justes.
- Pourquoi : un composant ne lit jamais un primitif (`espacements.md`, section 11).
- Conforme : `padding: 0 var(--espace-retour-libelle) 0 var(--espace-retour-chevron)`.

**Exemple non conforme : marge négative sans rôle**
- Situation : rangée de cartes « Cours assignés » du Détail groupe, qui défile jusqu'au bord de l'écran, dans la page à 16 sur les côtés.
- Erreur : `margin: 0 -20px; padding: 0 20px`, la rangée dépasse l'écran de 4 px de chaque côté.
- Pourquoi : une marge négative annule exactement le padding qu'elle traverse et le cite (`espacements.md`, section 6).
- Conforme : `margin: 0 calc(-1 * var(--espace-marge-page)); padding: 0 var(--espace-marge-page)`.

**Exemple non conforme : bloc près du bord par calcul**
- Situation : étape en cours d'une checklist, première de la liste.
- Erreur : `margin-top: calc(var(--espace-8) - 10px)` pour la ramener à 8 du bord de la carte.
- Pourquoi : la carte prend `espace-bord` et le bloc est posé directement, sans calc ni marge négative, y compris en dernier (`espacements.md`, section 5).
- Conforme : carte en `padding: var(--espace-bord)`, étape sans marge.

**Exemple non conforme : seuil pour une Surface**
- Situation : padding de l'en-tête lavande de la page Cours sur desktop.
- Erreur : 32 / 36 au-dessus de 768 pour lui donner plus d'air.
- Pourquoi : une valeur par rôle, la même à toutes les largeurs (`espacements.md`, section 3).
- Conforme : `padding: var(--espace-surface)`.

## 7. Conduite de l'agent

- **`tokens/` fait foi** pour les couleurs, les espacements, la typographie et les rayons (format DTCG 2025.10). Le rôle et les interdits de chaque token sont dans sa `$description` et dans celle de son groupe.
- **`src/styles/tokens.generes.css` n'est jamais modifié à la main.** Il est généré par `npm run tokens`, comme la liste des tokens de la section 3 de ce fichier.
- **Maquette et DS.** La maquette décide de la disposition : quels blocs, leur ordre, leur hiérarchie, leurs colonnes. Le DS décide des valeurs et des composants. En cas d'écart de valeur, le DS fait foi.

**Valeur hors échelle** : une valeur qui a un rôle prend la valeur du rôle. Pour une valeur sans rôle : prendre le palier le plus proche ; à égalité, le palier supérieur. L'appliquer et le signaler en fin de réponse, sans s'arrêter.
- Périmètre : les espacements entre éléments (gap, padding, marges) qui n'ont pas de rôle (`espacements.md`, section 8).
- Les dimensions de mise en page (débord d'un objet 3D, réserve pour une illustration, hauteur fixe d'un élément) ne sont pas des espacements : la maquette les décide, elles restent hors échelle (`espacements.md`). Exemple : le débord de 30 px de l'objet 3D du dashboard reste à 30.
- Tout nouveau code écrit ses espacements avec un token de rôle `espace-<rôle>`, jamais un primitif ni une valeur en px, sauf les valeurs hors rôle écrites en px avec leur renvoi (`espacements.md`, sections 8 et 9).

**Manque ou incohérence découvert pendant la construction d'un écran** : Quand une information manque (un état, une valeur, un détail), l'agent n'écrit rien à cet endroit dans le code. Il laisse un commentaire EN ATTENTE. Dans le rapport, il note ce qui manque et propose l'option la plus proche, sans l'appliquer. Cette règle vaut pour un état ou un détail. L'élément lui-même est construit avec ce que la doc dit. Une taille, une graisse, une largeur ou un espacement que le DS ne donne pas est un détail. L’agent n’écrit rien à cet endroit, même si une valeur voisine existe ailleurs dans le code, laisse un commentaire EN ATTENTE et propose la valeur dans le rapport. Le rapport se termine par ce message :

> J'ai terminé l'écran sauf ce qui suit.
> Manque | Incohérence : …
> Cherché dans le DS : …
> Option la plus proche (proposée, pas appliquée) : …
> Type probable : évolution | exception
> Dis-moi ce que tu décides.

La conduite en attente vaut seulement quand aucune règle ne dit quoi faire. Quand une règle donne la marche à suivre, comme l'arrondi d'un espacement hors échelle, l'agent l'applique et la signale dans son rapport.

**Rôle typographique impossible à choisir** : si la fonction d'un texte ne permet pas de décider de son rôle, l'agent écrit « À trancher » et ne choisit pas un rôle à l'œil, ni d'après la taille actuelle ou la place disponible (`typographie.md`, section 7).

**Rôle de rayon impossible à choisir** : si aucune étape de la section 4 de `rayons.md` ne donne un rôle, ou si deux étapes donnent deux rôles différents sans que l'ordre ne tranche, l'agent applique le rôle le plus probable, l'écrit « À trancher » dans son rapport avec sa raison, et n'ajoute aucun rôle ni aucun token (`rayons.md`, section 10).

**Rôle d'espacement impossible à choisir** : si aucun rôle ne s'applique, ou si deux rôles s'appliquent sans que l'ordre ne tranche, l'agent construit le reste de l'écran, écrit « À trancher » dans son rapport avec le rôle le plus proche et sa raison, et propose. Il n'utilise jamais un primitif `espace-N` à la place, et n'ajoute aucun rôle ni aucun token (`espacements.md`, section 10).

**Largeur, seuil ou comportement de mise en page impossible à choisir** : si aucune règle de `mise-en-page.md` ne s'applique (largeur de colonne pour une fonction nouvelle, seuil qui semble nécessaire, rangée qui ne rentre dans aucun cas), l'agent construit le reste de l'écran, écrit « À trancher » dans son rapport avec la règle la plus proche et sa raison, et propose. Il n'ajoute ni seuil, ni largeur, ni exception (`mise-en-page.md`, section 10).

**Demande qui touche le DS** (ajouter, modifier ou supprimer un token ou un composant) : s'arrêter avant d'agir et demander. Un agent ne crée ni ne modifie jamais un token.

## À trancher

Contradictions et ambiguïtés relevées entre les sources. Chacune demande une décision : rien n'est résolu ici.

1. **Rubriques des entrées Bouton, Champ et Conteneur de page absentes de la documentation** (marquées « À trancher » dans la section 4) :
   - Bouton : rôle général ; survol du bouton sur fond foncé, du rouge plein et du pointillé ; texte du bouton secondaire ; contour et texte du bouton pointillé au repos.
   - Champ : rôle général.
2. **Valeurs en pixels sans token** : zone cliquable minimale, épaisseur du contour du bouton secondaire. Ce fichier ne les recopie pas, donc `ds-principes-composants.md` ne peut pas encore être remplacé par un renvoi sans perdre ces valeurs.
3. **Description de `bordure-erreur`.** Elle cite « Réponse fausse, champ en erreur », pas le contour du bouton supprimer, qui l'utilise désormais.
