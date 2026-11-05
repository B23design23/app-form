# Règles du design system Skillo

Ce fichier se rédige depuis la documentation du DS (docs/tokens/, docs/design-system/), jamais depuis le code. Quand le code et la documentation divergent, le fichier suit la documentation et l'écart est noté comme dérive à corriger dans le code.

Référence unique du DS pour un agent qui construit un écran, et pour le mainteneur. Version publiée : 2.0.0. Brouillon en cours : 2.1.0 (voir `notes-de-version.md`).

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
- Principes et composants : `docs/design-system/ds-principes-composants.md`.
- Gouvernance, registre et versions : `docs/design-system/gouvernance-skillo.md`, `docs/design-system/notes-de-version.md`.
- Règles transverses de rendu (section 5) : `docs/design-system/ds-principes-composants.md` (séparateur, césure des titres, ponctuation, survol et tactile, navigation, liste déroulante, logo, objet 3D du thème, chevrons, toast de complétion) ; règle des deux ombres et bouton orange unique : registre de `docs/design-system/gouvernance-skillo.md` ; focus : `docs/tokens/couleurs.md` (décision 4).

## 2. Principes

La direction artistique est chaleureuse et motivante : fonds crème (`fond-page` en mode apprenant), violet franc (`fond-marque`, `fond-action`), orange réservé à la récompense (`fond-recompense`).

Chaque principe tranche entre deux options. La première est retenue, la seconde écartée (`ds-principes-composants.md`).

1. **Chaque bloc débouche sur une action.** Des blocs qui proposent tous quelque chose à faire (reprendre un cours, lancer un quiz flash, viser le prochain badge), **contre** des cartes de chiffres et un carrousel de badges.
2. **Un style réservé garde son sens.** L'orange réservé à la récompense, l'XP et le quiz flash, pour qu'il veuille toujours dire « tu gagnes quelque chose », **contre** l'orange utilisé pour attirer l'œil sur d'autres boutons.
3. **Ce qui détruit se trouve à un geste de plus.** Supprimer rangé dans le menu « … », en dernier, en rouge, toujours confirmé, **contre** un bouton Supprimer directement sur la page. Le principe ne vise que ce qu'on ne peut pas défaire.
4. **La profondeur vient du fond, pas des traits ni des ombres.** Un fond de champ différent de la carte et une seule ombre, réservée à ce qui flotte, **contre** une bordure grise autour des champs et une ombre sous les cartes.
5. **Le statut n'est jamais porté par la couleur seule.** Des étiquettes (« Ta réponse », « Bonne réponse ») avec une icône, **contre** une correction en vert et rouge uniquement.
6. **On n'affiche que ce que la donnée sait vraiment.** Le pourcentage seul pour les anciens passages de quiz, **contre** un score « 4/5 » recalculé avec le nombre actuel de questions.

## 3. Tokens

### Niveaux

- **Primitifs** : valeurs brutes, nommées `famille-nuance` (la nuance découle de la clarté). Un composant ne lit jamais un primitif.
- **Sémantiques** : ce que lisent les composants. Chaque sémantique pointe vers un primitif.
- **Composant** : vide, et c'est voulu. Un contexte se résout en choisissant d'autres sémantiques, pas en créant un token de composant (`couleurs.md`, décision 1).
- **Espacements** : un seul niveau de paliers, nommés par leur valeur (`espace-N`).
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
- Mode formateur : tout ce qui est posé dans `.espace-layout-formateur`, `.flow-page-formateur` ou `.dropdown-content-formateur`.
- *Implémentation* : `.mode-apprenant` rétablit le mode apprenant dans un conteneur formateur (aperçu élève).

Un composant lit toujours le même sémantique dans les deux espaces : c'est le mode qui fournit la valeur.

### Espacements

Tout nouveau code utilise les variables d'espacement générées (`var(--espace-N)`), jamais une valeur en px pour un espacement. Le code existant sera migré plus tard.

Base 4. Liste fermée de paliers (ci-dessous) : tout autre `espace-*` est interdit. Demi-pas admis seulement en dessous de 12. Valeur négative : `calc(-1 * var(--espace-N))`. Restent hors échelle volontairement : les réserves pour les objets 3D, les débords des illustrations, les marges de page desktop, les zones d'action mesurées (`espacements.md`).

**Rôles d'espacement** (`espacements.md`, section 6) :
- **Écart entre deux blocs consécutifs d'une page**, bouton Retour compris : `--espace-20`. Fourni par le Conteneur de page (section 4).
- **Ligne de liste** : padding vertical de chaque ligne `--espace-12` ; écart entre les éléments d'une ligne (vignette, texte, statut, chevron) `--espace-12` ; écart entre le titre et le sous-titre d'une ligne `--espace-4`.
- **Bouton Retour** : padding horizontal `--espace-12` côté chevron et `--espace-20` côté libellé ; écart entre le chevron et le libellé `--espace-6`.

### Valeurs sans token

Rayons et ombre ne sont pas encore tokenisés. Utiliser les variables CSS existantes du `:root` de `src/styles/shared.css` :

| Variable CSS | Rôle | Statut |
|---|---|---|
| `--radius-carte` | cartes | *Provisoire, pas encore tokenisé* |
| `--radius-carte-petite` | petites cartes de grille | *Provisoire, pas encore tokenisé* |
| `--radius-reponse` | réponses de quiz | *Provisoire, pas encore tokenisé* |
| `--radius-pill` | champs et boutons en pilule | *Provisoire, pas encore tokenisé* |
| `--radius-badge` | rôle non documenté | *Provisoire, pas encore tokenisé* |
| `--ombre-flottante` | ombre des éléments flottants (voir « Ombres », section 5) | |

### Liste des tokens utilisables

Les primitifs ne sont pas listés : un composant ne les lit jamais.

<!-- tokens:debut (généré par npm run tokens depuis tokens/, ne pas modifier à la main) -->

#### Espacements (`espace`)

Échelle d'espacement, base 4 px. Les seuls paliers sont 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40 : tout autre espace-* est interdit (espace-14 n'existe pas). Demi-pas (2, 6, 10) admis seulement en dessous de 12 ; 6 et 10 servent aux écarts à l'intérieur d'un composant (icône et libellé, titre et sous-titre, lignes d'une liste). Une valeur hors échelle est ramenée au palier le plus proche, à égalité le plus grand ; pour le padding vertical d'un élément à hauteur fixée, la hauteur l'emporte et rien ne bouge. Valeur négative : calc(-1 * var(--espace-N)). Hors échelle volontairement, ne pas forcer ici : réserves des objets 3D, débords d'illustration, marges de page desktop, zones d'action mesurées.

| Variable CSS | Description |
|---|---|
| `--espace-2` | Plus petit palier. |
| `--espace-4` | Base de l'échelle. Remplace aussi 3 px. |
| `--espace-6` | Remplace aussi 5 px. |
| `--espace-8` | Aucune règle propre au-delà de celles du groupe. |
| `--espace-10` | Plus grand demi-pas. |
| `--espace-12` | Dernier palier avant 16 : plus de demi-pas au-dessus. |
| `--espace-16` | Marge latérale mobile. Remplace aussi 14 px. |
| `--espace-20` | Remplace aussi 18 px. |
| `--espace-24` | Remplace aussi 22 px et 26 px. |
| `--espace-32` | Gardé malgré sa faible fréquence. Remplace aussi 28 px et 30 px. |
| `--espace-40` | Plus grand palier. Remplace aussi 36 px. |

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

Sémantiques de bordure : border, outline, trait de contour SVG. Ne pas changer de propriété : jamais en background ni en color.

| Variable CSS | Mode | Description |
|---|---|---|
| `--bordure-action` | commun | Contour du bouton secondaire, réponse ou choix sélectionné. |
| `--bordure-focus` | commun | Contour de focus clavier, champ actif. Réglé à part de bordure-action : il doit garder 3:1 de contraste avec le fond voisin quelle que soit la couleur du bouton, ne jamais le lier à action. |
| `--bordure-controle` | commun | Contour d'un contrôle interactif sans texte (case, rond de choix, bascule). Au moins 3:1 contre chaque fond voisin, survol compris. Jamais pour un élément non interactif ni pour un séparateur. |
| `--bordure-erreur` | commun | Réponse fausse, champ en erreur. |
| `--bordure-succes` | commun | Bonne réponse. |
| `--bordure-separateur` | varie selon le mode | Le trait bordure-separateur se place uniquement entre deux éléments consécutifs de même nature qui se répètent dans un même bloc (lignes d'un tableau, lignes d'une liste), jamais avant le premier ni après le dernier. Un en-tête de colonnes, un titre ou une section n'est pas un élément répété : il se sépare par l'espacement. Dans une liste disposée en plusieurs colonnes, le dernier élément de chaque colonne n'a pas de séparateur. |
| `--bordure-etape` | varie selon le mode | Contour d'une pastille d'étape à venir ou passée, non interactive. Pas d'exigence de contraste, l'état est porté par le remplissage et le libellé. |
| `--bordure-action-desactive` | varie selon le mode | Contour d'une action désactivée. Va avec texte-action-desactive. |

#### Typographie, rôles (`typo`)

Typographie. Un composant applique un rôle (font: var(--typo-<rôle>)) ou sa variante -fort (font: var(--typo-<rôle>-fort)), jamais un primitif, jamais font-size ni font-weight séparés. L'échelle est une liste fermée : 12 tailles (13, 14, 15, 16, 17, 18, 21, 28, 32, 34, 44, 48 px), 4 graisses (500, 600, 700, 800) ; aucune autre valeur n'est admise. Les tailles s'écrivent en px et sortent en rem (base 16 px). Un seul seuil typographique : 768 px (typo.seuil-desktop) ; les rôles qui en dépendent sont dans typographie-mobile et typographie-desktop, sous le même nom, jamais ici.

Valeur : taille · graisse · hauteur de ligne. Un élément applique `font: var(--typo-<rôle>)` ou `font: var(--typo-<rôle>-fort)`.

| Variable CSS | Valeur | Description |
|---|---|---|
| `--typo-titre-section` | 21 px · 800 · 1,2 | Le titre nomme une partie de la page ou du contenu, il annonce ce qui suit (section de page, intertitre de leçon, titre Markdown, modale, feuille de menu). |
| `--typo-titre-carte` | 18 px · 800 · 1,2 | Le titre nomme ce que la carte présente (un objet, une action), ou dit où l'on en est (« Raté, mais tu vas retenir ça », « Tu as fini les 12 cours ») ; en dessous, une explication ou une information. |
| `--typo-titre-ligne` | 16 px · 800 · 1,2 | Nomme un élément de liste, ou rappelle un titre dans une barre compacte. |
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
| `--typo-saisie-choix` | 16 px · 600 · 1,2 | Texte tapé ou choisi par l'utilisateur. |
| `--typo-saisie-choix-fort` | 16 px · 700 · 1,2 | État (choisi, en cours, fait, coché) ou emphase du rôle Saisie et choix. |
| `--typo-pastille` | 13 px · 800 · 1,2 | Texte d'une pastille, numéros dans une pastille ronde compris. |
| `--typo-chiffre` | 28 px · 800 · 1 | Nombre sujet d'un bloc : le bloc existe pour le montrer (carte de statistique, taux de complétion). |
| `--typo-chiffre-grand` | 48 px · 800 · 1 | Nombre sujet de l'écran entier : l'écran existe pour le montrer (score de fin de quiz, en pourcentage). |
| `--typo-compteur` | 15 px · 800 · 1,2 | Nombre qui n'est pas le sujet de son bloc : position, avancement, total ou gain qui accompagne le sujet du bloc (« 3 / 5 » d'un quiz, XP de l'en-tête, pourcentage de l'anneau, « +15 XP »). |
| `--typo-titre-page` | 34 px · 800 · 1,1 (sous 768 px) ; 44 px · 800 · 1,1 (à partir de 768 px) | Nomme l'écran ; un seul par écran, en tête. |
| `--typo-titre-contenu` | 28 px · 800 · 1,1 (sous 768 px) ; 32 px · 800 · 1,1 (à partir de 768 px) | Nomme l'objet que l'écran présente (cours, thème, question). |
| `--typo-texte-lecture` | 17 px · 500 · 1,55 (sous 768 px) ; 18 px · 500 · 1,55 (à partir de 768 px) | Texte de la leçon, dans la fiche et dans son aperçu. |
| `--typo-texte-lecture-fort` | 17 px · 600 · 1,55 (sous 768 px) ; 18 px · 600 · 1,55 (à partir de 768 px) | État (choisi, en cours, fait, coché) ou emphase du rôle Texte de lecture. |

<!-- tokens:fin -->

## 4. Composants documentés

Source : `ds-principes-composants.md`.

### Conteneur de page

- **Usage** : toute page de l'app s'y place, y compris une page hors navigation.
- **Ce qu'il fournit** : marges de page, `.espace-contenu`, posé par `EspaceApprenant` et `EspaceFormateur` autour de la page (mobile : zone de sécurité + 20 px en haut, 16 px sur les côtés, réserve de la tab bar en bas ; desktop : réserve de la barre du haut, 40 px sur les côtés et en bas), complété sur desktop par `.espace-page-etroit` (1040 px max, 24 px sur les côtés) ; écart entre les blocs de la page, `.espace-page` (`--espace-20`), voir « Rôles d'espacement » en section 3.
- **Page hors navigation** : À trancher. `.espace-contenu` ne convient pas à une page hors navigation : il réserve la place de la tab bar en bas et celle de la barre du haut sur desktop. Aucun élément partagé existant ne fournit les marges d'une page hors navigation.
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
  - retour : revenir au niveau du dessus quand on est descendu d'un niveau dans les pages. Place : en haut à gauche, avant l'en-tête. Rendu : pilule blanche, chevron à gauche, texte encre. Sur mobile, chevron seul, et « Retour » reste le nom accessible du bouton. Zone cliquable de 44 px minimum. Le bouton Retour remonte d'un niveau dans l'arborescence des pages. Il n'apparaît pas sur une page de niveau 0, atteinte depuis la navigation principale (tab bar sur mobile, barre de navigation sur desktop). Il n'a donc pas d'état désactivé. Dimensions : padding horizontal `--espace-12` côté chevron et `--espace-20` côté libellé ; écart entre le chevron et le libellé `--espace-6` ; chevron de 18 px. Libellé : rôle Bouton (`--typo-bouton`), car la variante Retour a une forme de bouton (`typographie.md`, section 6).
- **Choisir entre principal, secondaire et lien texte** :
  - principal : l'action attendue de la zone, un seul par zone ;
  - secondaire : seulement s'il est sur la même rangée que le principal et que c'est l'autre issue de la même décision ;
  - lien texte : une action à part, ni attendue ni alternative. Exemples Skillo : Se déconnecter, Mot de passe oublié.
- **Focus clavier de tous les boutons** : contour de 2 px à l'extérieur du bouton, token de focus (`bordure-focus`), visible au clavier seulement.
- **Tokens par état** (zone cliquable minimale : voir « Accessibilité » du Bouton dans `ds-principes-composants.md`) :

| Variante | Repos | Survol | Actif (appui tactile) | Focus clavier | Désactivé |
|---|---|---|---|---|---|
| Principal | fond `fond-action`, texte `texte-sur-action` | `fond-action-survol` | À trancher | `bordure-focus` | fond `fond-action-desactive`, texte `texte-action-desactive` |
| Sur fond foncé | fond `fond-surface`, texte `texte-principal` | À trancher | À trancher | `bordure-focus` | fond `fond-action-desactive`, texte `texte-action-desactive` |
| Secondaire | contour `bordure-action`, texte À trancher | `fond-accent` | À trancher | `bordure-focus` | fond `fond-action-desactive`, texte `texte-action-desactive` |
| Orange | fond `fond-recompense`, texte `texte-principal` | `fond-recompense-survol` | À trancher | `bordure-focus` | fond `fond-action-desactive`, texte `texte-action-desactive` |
| Supprimer | texte `texte-erreur`, contour `bordure-erreur` (même épaisseur que le secondaire) | `fond-erreur` | À trancher | `bordure-focus` | fond `fond-action-desactive`, texte `texte-action-desactive` |
| Rouge plein (confirmation) | fond `fond-erreur-accentue`, texte `texte-sur-erreur` | À trancher | À trancher | `bordure-focus` | fond `fond-action-desactive`, texte `texte-action-desactive` |
| Pointillé | contour et texte À trancher | À trancher | À trancher | `bordure-focus` | fond `fond-action-desactive`, contour `bordure-action-desactive`, texte `texte-action-desactive` |
| Retour | fond `fond-surface`, texte `texte-principal` | `fond-accent` | `fond-accent` | `bordure-focus` | Sans objet : pas d'état désactivé |

  Sources : les états du Bouton (« désactivé : lavande, texte atténué », valable pour toutes les variantes, sauf Retour) dans `ds-principes-composants.md`, les descriptions des tokens, la note 2.1.0 pour le contour du bouton supprimer.
- **DO** : un seul bouton principal par zone d'action. Dans la barre d'enregistrement de Création de cours, « Enregistrer » est le seul bouton principal, « Annuler » est un bouton secondaire.
- **DON'T** : utiliser le pointillé pour valider un formulaire. Dans Détail groupe, « Ajouter » un élève par son email est un bouton principal, pas un pointillé. Ne pas non plus donner à une pastille de statut l'air d'un bouton (pas de survol, pas de curseur main, plus petite que le bouton).

### Champ

- **Rôle** : À trancher (la documentation décrit les variantes, pas de rôle général).
- **Quand l'utiliser, quand choisir le voisin** : un champ pour une saisie libre. Le voisin est la liste déroulante, quand les réponses possibles sont connues et peu nombreuses.
- **Typographie** : le libellé du champ prend le rôle Libellé de champ (`--typo-libelle-champ`) ; le texte tapé ou choisi prend le rôle Saisie et choix (`--typo-saisie-choix`), 16 px partout, même dans un en-tête dense ou une ligne de filtres (`typographie.md`, sections 5 et 9).
- **Variantes** : texte (saisie courte, en pilule) ; mot de passe (texte masqué, aide « 6 caractères minimum » dessous) ; multiligne (saisie longue, hauteur ajustée au contenu) ; recherche (pilule blanche avec loupe, résultats dès 2 caractères).
- **Tokens par état** :

| État | Tokens |
|---|---|
| Repos | fond `fond-sur-carte` sur une carte blanche, `fond-surface` sur le fond de page ; jamais de bordure ; texte saisi : À trancher |
| Survol | À trancher |
| Actif (saisie) | contour `bordure-focus` (« champ actif »), dessiné à l'intérieur du champ |
| Focus clavier | contour `bordure-focus`, dessiné à l'intérieur du champ |
| Désactivé | À trancher (l'état existe, ses tokens ne sont pas documentés) |
| Erreur | message sous le champ en `texte-erreur` ; contour `bordure-erreur` (« champ en erreur »), jamais la couleur seule |

- **DO** : aligner le champ, son libellé et son aide sur le même bord gauche. Dans Création de cours, le champ Titre, son libellé et l'aide qui suit partent du même bord. Aucune marge négative : le champ fait la largeur de sa colonne.
- **DON'T** : ajouter une bordure pour séparer le champ de la carte, on change son fond. Dans une carte blanche de Création de cours, le champ Titre prend `fond-sur-carte`, pas une bordure grise. Ne pas signaler une erreur par la seule couleur du contour : on écrit le message sous le champ.

### Barre de progression

- **Rôle** : montrer l'avancement dans une suite ou dans une liste, de façon compacte, à côté d'un compteur.
- **Quand l'utiliser** : checklist (« 3 étapes sur 8 »), quiz (« 3 / 5 »), cartes de groupe formateur, prochain badge, quiz flash verrouillé. Anatomie : piste, remplissage violet, extrémités arrondies, compteur ou pourcentage à côté. Variantes fine (dans une carte, à côté d'un compteur) et quiz (en haut de l'écran, piste blanche). La piste change selon le fond : lavande, blanche ou neutre pâle.
- **Voisin à ne pas confondre** : l'anneau de progression, qui met en avant une seule valeur avec le chiffre au centre (un cours en cours, un score de quiz, le taux de complétion d'un formateur). L'anneau est réservé à la progression, il ne sert jamais de pastille de numéro.
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
- **Règle** : un cours pas encore ouvert s'affiche en pilule (Non commencé et À faire en `texte-secondaire` sur `fond-neutre`, Nouveau en `texte-accent` sur `fond-accent`). Un cours déjà ouvert s'affiche sans pilule, en texte avec une icône (En cours en `texte-accent` avec l'icône de progression, Terminé en `texte-succes` avec la coche). Aucune pastille n'utilise `fond-action`, `fond-marque` ni `fond-recompense`. Principes 2 et 5.
- **Typographie** : le texte de la pastille prend le rôle Pastille (`--typo-pastille`) (`typographie.md`, section 5).
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
- **DON'T** : un trait avant le premier élément ou après le dernier, sous un en-tête, autour d'un titre ou entre deux sections. Dans Activité récente, pas de trait sous l'intertitre d'un jour (« Aujourd'hui », « Hier »). Principe 4.

### Modale

- **Rôle** : afficher un contenu court par-dessus la page sans la quitter : un formulaire ou un choix (créer un groupe, assigner un cours, ajouter une vidéo).
- **Quand l'utiliser, quand choisir le voisin** : pour une saisie ou un choix lié à la page en cours. Le voisin est la Modale de confirmation, pour faire confirmer une action qu'on ne peut pas défaire. Les autres cas : À trancher.
- **Anatomie** : voile `fond-voile` derrière ; mobile, feuille qui monte du bas avec une poignée ; desktop, carte centrée ; ombre `--ombre-flottante`. Titre, sous-titre facultatif, bouton rond « Fermer » (croix), contenu, zone d'actions facultative. Le composant sert aux deux modes (apprenant et formateur) et lit les mêmes sémantiques : le mode fournit la valeur.
- **Comportement** : Échap, clic sur le voile et bouton « Fermer » ferment la modale. Rôle `dialog`, `aria-modal`, nom accessible = titre.
- **DO** : laisser les trois façons de fermer (Échap, clic sur le voile, bouton « Fermer »).
- **DON'T** : À trancher.
- **À trancher** : focus à l'ouverture et maintien du focus dans la modale, hors Modale de confirmation.
- **Fichier à réutiliser** : `src/components/Modale.jsx` (export par défaut `Modale`).

### Modale de confirmation

- **Rôle** : faire confirmer une action qu'on ne peut pas défaire (principe 3).
- **Quand l'utiliser** : avant toute action destructrice : supprimer un cours, un groupe, une question ou une étape, retirer un élève, quitter sans enregistrer.
- **Anatomie** : une Modale étroite ; titre (la question posée), texte facultatif, « Annuler », puis le bouton qui confirme (libellé « Supprimer » par défaut). Annuler en secondaire, confirmation en rouge plein. Pendant l'action, les deux boutons sont désactivés et le bouton rouge affiche « Un instant… ».
- **Comportement** : Le bouton qui confirme nomme le verbe et l'objet de l'action (Supprimer mon compte, Supprimer le cours). À l'ouverture, le focus va sur Annuler, l'action la moins destructrice. Tab reste dans la modale. Échap la ferme.
- **DO** : toujours confirmer une action destructrice, quel que soit l'endroit d'où elle part.
- **DON'T** : lancer une action qu'on ne peut pas défaire sans cette confirmation (principe 3).
- **Fichier à réutiliser** : `src/components/Modale.jsx` (export nommé `ModaleConfirmation`).

### Menu d'actions

- **Rôle** : ranger les actions d'un élément qui ne méritent pas un bouton sur la page, dont l'action destructrice (principe 3).
- **Anatomie** : bouton rond « … » (nom accessible « Plus d'actions ») ; mobile, feuille depuis le bas sur le voile `fond-voile`, avec une poignée et le nom de l'élément en titre ; desktop, carte flottante sous le bouton, alignée à droite, `--ombre-flottante`, sans voile visible. Une ligne par action, survol et appui en `fond-sur-carte`. L'action destructrice est en `texte-erreur`, en dernier.
- **Comportement** : Échap, clic hors du menu et choix d'une action ferment le menu. Rôles `menu` et `menuitem`. Entrée ou Espace sur le bouton ouvre le menu et place le focus sur la première action. Les flèches passent d'une action à l'autre. Échap ferme le menu et rend le focus au bouton. Tab et Maj+Tab ne passent pas d’une action à l’autre ; depuis une action, ils ferment le menu et font sortir le focus (W3C, guide des pratiques ARIA, motif Menu and Menubar, Keyboard Interaction). Précision Skillo : le focus va à l’élément suivant (ou précédent) de la page. Un menu à une seule action reste admis pour l'instant.
- **DO** : placer l'action destructrice en dernier, en rouge, suivie d'une Modale de confirmation.
- **DON'T** : mettre un bouton Supprimer directement sur la page (principe 3).
- **À trancher** : ordre des actions autres que la destructrice.
- **Fichier à réutiliser** : `src/components/formateur/MenuActions.jsx`.

## 5. Règles transverses

### Séparateurs (2.1.0)

Le trait `bordure-separateur` se place uniquement entre deux éléments consécutifs de même nature qui se répètent dans un même bloc (lignes d'un tableau, lignes d'une liste), jamais avant le premier ni après le dernier. Un en-tête de colonnes, un titre ou une section n'est pas un élément répété : il se sépare par l'espacement. Dans une liste disposée en plusieurs colonnes, le dernier élément de chaque colonne n'a pas de séparateur.

### Ombres

Deux ombres, et seulement elles (2.1.0). Le contraste vient des couleurs de fond (principe 4).
- `--ombre-flottante` : les éléments flottants (menus, listes déroulantes, toast, modales).
- Ombre d'illustration : les objets 3D qui débordent d'une carte. Pas de token.
- Exception au registre (1.0.0) : l'ombre intérieure pleine qui neutralise l'autoremplissage du navigateur sur un champ (`:-webkit-autofill`), pour que le champ garde son fond.

### Survol et tactile

- Tous les styles `:hover` sont dans `@media (hover: hover)` (souris uniquement).
- Sur tactile, seul `:active` donne un retour pendant l'appui (boutons principaux, secondaires, orange, boutons ronds, cartes et lignes cliquables).
- Pas de surlignage natif au tap (`-webkit-tap-highlight-color: transparent`).
- Transition `all 0.15s ease` sur tous les CTA. Survol : principal → `fond-action-survol` ; secondaire et contour → `fond-accent` ; supprimer → `fond-erreur` ; orange → `fond-recompense-survol` ; cartes et lignes cliquables (celles de la section Chevrons) → `fond-accent`, au survol et à l'appui.
- Tout nouveau style de survol suit ces règles.

### Focus

- Couleur : `bordure-focus`. Il garde 3:1 de contraste avec le fond voisin quelle que soit la couleur du bouton, et n'est jamais lié à `action` (`couleurs.md`, décision 4).
- Champ : contour dessiné à l'intérieur (bordure transparente au repos qui prend `bordure-focus` au focus, pas d'`outline` extérieur), pour qu'aucun conteneur qui défile ne le rogne.
- Boutons : focus visible au clavier seulement (`:focus-visible`).

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
- Échelle fermée de 12 tailles : 13 · 14 · 15 · 16 · 17 · 18 · 21 · 28 · 32 · 34 · 44 · 48 px. Aucune autre taille, pas de taille intermédiaire (27 px ou 20 px ne s'écrivent pas). On choisit un rôle, pas une taille (section 2).
- Quatre graisses : 500 · 600 · 700 · 800. 400 et 900 n'existent pas dans Skillo (section 3).
- Un seul seuil typographique : 768 px. Chaque rôle a au plus une taille sous 768 px et une à partir de 768 px. Le seuil de 1024 px de Création de cours est un seuil de mise en page : sous 1024 px, l'en-tête compact prend le Titre de ligne ; à partir de 1024 px, l'en-tête desktop prend le Titre de page (section 4).
- 18 rôles, 19 lignes (Chiffre mis en avant a deux niveaux). Aucun rôle n'a d'espacement des lettres (section 5).

**Rattachement** (section 7)
- La fonction d'un texte décide de son rôle, jamais sa taille actuelle ni la place disponible. Deux textes qui ont la même fonction ont la même typographie, où qu'ils soient.
- Un texte écrit aujourd'hui dans une autre taille que son rôle n'est pas une exception : c'est une dérive à corriger. La place disponible (intérieur d'un anneau, largeur d'une carte) se vérifie après coup, elle ne choisit pas le rôle.
- Le rôle ne dépend pas de la balise HTML : le niveau de titre (h1, h2…) donne la structure de la page, le rôle donne l'apparence. Exemple : le nom d'un thème, dans le Détail d'un thème, est un h1 en Titre de contenu.
- Si la fonction ne permet pas de décider : « À trancher », pas un choix à l'œil (voir section 7 de ce fichier).

**Choisir entre deux rôles voisins** (section 6)
- **Titre de section ou Titre de carte : test du nom.** Le nom d'une partie de la page ou du contenu, qui annonce ce qui suit (« De ton formateur », « Taux de complétion », intertitres de leçon, « À retenir ») → Titre de section. Le nom d'une chose que la carte présente (cours, thème, groupe, badge, action) ou ce qui dit où l'on en est (« Raté, mais tu vas retenir ça », « Tu as fini les 12 cours »), avec une explication ou une information en dessous (« Étape suivante », « Suite du thème », « X étapes sur N », carte de thème) → Titre de carte. Une modale ou une feuille de menu prend le Titre de section quel que soit son texte : elle tient la place d'un écran.
- **Chiffre mis en avant ou Compteur : test binaire.** Le nombre est le sujet du bloc, le bloc existe pour le montrer (carte de statistique, taux de complétion, score de fin de quiz en pourcentage) → Chiffre mis en avant. Sinon (position, avancement, total ou gain qui accompagne le sujet du bloc : « 3 / 5 » d'un quiz, XP de l'en-tête, pourcentage de l'anneau du bloc « cours en cours », « +15 XP ») → Compteur. Un nombre a un rôle et un seul ; sa forme (pourcentage, fraction, entier) ne décide jamais.
- **Chiffre mis en avant, standard ou grand.** Grand : le nombre est le sujet de l'écran entier, comme le score de fin de quiz (quiz de cours et quiz flash), affiché en pourcentage. Standard : le sujet d'un bloc.
- **Corps courant ou Texte de lecture.** Texte de lecture : le texte de la leçon, dans la fiche, dans son aperçu (Création de cours) et dans le Détail cours (premier paragraphe). Corps courant : toutes les autres phrases lues (explications, paragraphes, intitulés d'étape, réponses affichées).
- **Texte secondaire ou Méta.** Texte secondaire : une phrase complète qui commente un autre élément (sous-titre, état vide, aide, erreur, message, note sous une carte). Méta : une information courte et factuelle, lue en passant (« Leçon · Quiz », date, compte, statut, « N min de lecture »).
- **Lien texte ou Navigation.** Navigation : une option reste marquée comme choisie et change ce qu'on voit (écran, vue, filtre) sans agir sur les données (barre d'onglets, onglets « Écrire / Aperçu », filtres, entrées de menu qui mènent à un écran ou à une vue et restent marquées, repère d'étapes). Lien texte : une action sans forme de bouton ni état choisi, qui agit ou mène ailleurs une fois (« Tout voir », « Revoir la leçon », « Passer cette étape », « Voir comme un élève »). Les entrées de menu qui agissent (« Se déconnecter », actions du menu « … » de l'espace formateur) sont des Liens texte.
- **Bouton ou Lien texte : la forme.** Un texte d'action posé dans une forme de bouton (fond, contour ou pointillé, padding, zone cliquable de bouton) prend le rôle Bouton ; sans forme de bouton, Lien texte. Le libellé du bouton Retour est en rôle Bouton : la variante Retour a une forme de bouton.

**États et emphase** (section 8)
- Un état (choisi, en cours, fait, coché) ou une emphase monte la graisse d'un cran, jamais la taille : 500 → 600, 600 → 700, 700 → 800. C'est la variante `-fort` du rôle.
- L'option choisie d'une Navigation (entrée active, onglet actif, filtre actif, étape en cours) est un état : 800.
- Pas de partie plus légère que son rôle : un compteur dans une pastille, un message « Aucune modification » ou tout fragment plus maigre prend la graisse du rôle.
- L'emphase dans une phrase (`strong`, gras Markdown, nom en gras dans un fil d'activité) suit la même règle qu'un état.
- Dans les rôles à 800, l'emphase reste invisible, et c'est accepté : 800 est la graisse la plus forte, ces rôles n'ont pas de variante `-fort`.

**Contrôles** (section 9)
- Chaque bouton, champ, liste déroulante ou ligne de choix déclare la typographie de son rôle (Bouton, Saisie et choix, Navigation…), jamais la police par défaut du navigateur : les navigateurs n'appliquent pas l'héritage de la police aux boutons et aux champs.
- Saisie et choix : tout texte tapé ou choisi dans un champ fait 16 px, même dans un en-tête dense ou une ligne de filtres (Safari sur iOS agrandit la page sous 16 px).
- Croix de fermeture, flèches Monter / Descendre et flèches de tri : icônes SVG, comme les autres boutons ronds, jamais des caractères (×, ↑, ↓, ▲, ▼). Elles sortent de la typographie.

**Italique** (section 10)
- Urbanist italique 500, chargée seule. Elle apparaît dans le contenu Markdown des cours, en Texte de lecture et en Corps courant.
- Le gras italique n'est pas prévu. S'il apparaît dans un Markdown, le gras fabriqué par le navigateur est accepté.

**Césure des titres** (`ds-principes-composants.md`)
- Titres (H1, titres de cours et de thème, questions de quiz) : pas de césure automatique (`hyphens: manual`) et `text-wrap: balance`. La césure reste active sur le texte courant de la leçon (paragraphes, listes).

### Icônes

- Les tracés utilisent `currentColor`.
- *Implémentation* : SVG importés en `?raw` et rendus inline par `src/components/Icone.jsx`.
- La couleur se pilote par la propriété `color` du parent (exemple : `texte-principal` sur le bouton orange). Pas de filtre CSS.
- Exception : les illustrations multicolores (`Assets/badge/`, onboarding) restent en `<img>`.

### Navigation

- Mobile : tab bar flottante en bas, fond `fond-inverse`, rayon `--radius-carte` (*Provisoire, pas encore tokenisé*), marges `espace-12` sur les côtés et `espace-20` en bas, 4 entrées de largeur égale avec icône et libellé.
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

Rendu : extrémité arrondie, départ en haut, pourcentage au centre ; sans données, piste seule et « — ». Couleurs : `couleurs.md`, décision 1.

| Fond | Piste | Arc |
|---|---|---|
| Fond clair | `fond-accent` | `fond-marque` |
| Carte violette | `fond-marque-accentue` | `fond-surface` |
| Fin de quiz (fond lavande) | `fond-surface` | `fond-marque` |

### Toast de complétion

Fond `fond-inverse`, texte `texte-sur-inverse`, pastille XP en `fond-recompense` avec texte `texte-principal`.

### Pastille « Bloquante »

Texte `texte-erreur` sur fond `fond-erreur`.

## 6. Exemples

Format : situation, erreur, pourquoi (règle citée), conforme.

**Exemple non conforme : bouton orange**
- Situation : bloc « Cours en cours » du dashboard apprenant.
- Erreur : « Continuer le cours » en bouton orange, parce que c'est l'action la plus motivante de l'écran.
- Pourquoi : principe 2, l'orange est réservé à la récompense. Continuer un cours n'en donne pas directement. L'élève ne saurait plus quel bouton mène au quiz flash.
- Conforme : bouton blanc sur carte violette (bouton sur fond foncé).

**Exemple non conforme : séparateur**
- Situation : tableau des élèves du Détail groupe.
- Erreur : un trait sous la ligne d'en-tête, parce que la plupart des tableaux en ont un.
- Pourquoi : l'en-tête nomme les colonnes, ce n'est pas un élément répété. Principe 4, la profondeur vient du fond et de l'espacement, pas des traits.
- Conforme : espacement sous l'en-tête, trait seulement entre deux lignes d'élèves.

**Exemple non conforme : bouton**
- Situation : dans Détail groupe, un champ email et un bouton pour ajouter l'élève au groupe.
- Erreur : un bouton pointillé « + Ajouter », parce que l'action « ajoute » quelque chose.
- Pourquoi : « Utiliser le pointillé pour valider un formulaire. On prend le principal. » Le pointillé sert à ajouter un élément dans la création de cours.
- Conforme : bouton principal plein, de même hauteur que le champ voisin.

**Exemple non conforme : champ**
- Situation : un champ de saisie dans une carte blanche de l'espace formateur.
- Erreur : une bordure grise pour détacher le champ de la carte.
- Pourquoi : « Ajouter une bordure pour séparer le champ de la carte. On change son fond. » Jamais de bordure au repos.
- Conforme : fond `fond-sur-carte` (le mode donne la bonne valeur), sans bordure au repos, focus en `bordure-focus` dessiné à l'intérieur.

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

**Exemple non conforme : pourcentage de l'anneau**
- Situation : pourcentage au centre de l'anneau du bloc « cours en cours » du dashboard apprenant.
- Erreur : Chiffre mis en avant (28 px), parce que c'est un pourcentage et qu'il y a de la place dans l'anneau.
- Pourquoi : le sujet du bloc décide, jamais la forme du nombre (`typographie.md`, section 6) ; la place disponible ne choisit pas le rôle (section 7). Le sujet du bloc est le cours, le pourcentage dit où l'on en est dans ce cours.
- Conforme : `--typo-compteur` (Compteur, 15 px · 800 · 1,2).

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

## 7. Conduite de l'agent

- **`tokens/` fait foi** pour les couleurs, les espacements et la typographie (format DTCG 2025.10). Le rôle et les interdits de chaque token sont dans sa `$description` et dans celle de son groupe.
- **`src/styles/tokens.generes.css` n'est jamais modifié à la main.** Il est généré par `npm run tokens`, comme la liste des tokens de la section 3 de ce fichier.
- **Maquette et DS.** La maquette décide de la disposition : quels blocs, leur ordre, leur hiérarchie, leurs colonnes. Le DS décide des valeurs et des composants. En cas d'écart de valeur, le DS fait foi.

**Valeur hors échelle** : prendre le palier le plus proche ; à égalité, le palier supérieur. L'appliquer et le signaler en fin de réponse, sans s'arrêter.
- Périmètre : les espacements entre éléments (gap, padding, marges).
- Les dimensions de mise en page (débord d'un objet 3D, réserve pour une illustration, hauteur fixe d'un élément) ne sont pas des espacements : la maquette les décide, elles restent hors échelle (`espacements.md`). Exemple : le débord de 30 px de l'objet 3D du dashboard reste à 30.
- Tout nouveau code écrit ses espacements avec `var(--espace-N)`, jamais en px.

**Manque ou incohérence découvert pendant la construction d'un écran** : Quand une information manque (un état, une valeur, un détail), l'agent n'écrit rien à cet endroit dans le code. Il laisse un commentaire EN ATTENTE. Dans le rapport, il note ce qui manque et propose l'option la plus proche, sans l'appliquer. Cette règle vaut pour un état ou un détail. L'élément lui-même est construit avec ce que la doc dit. Une taille, une graisse, une largeur ou un espacement que le DS ne donne pas est un détail. L’agent n’écrit rien à cet endroit, même si une valeur voisine existe ailleurs dans le code, laisse un commentaire EN ATTENTE et propose la valeur dans le rapport. Le rapport se termine par ce message :

> J'ai terminé l'écran sauf ce qui suit.
> Manque | Incohérence : …
> Cherché dans le DS : …
> Option la plus proche (proposée, pas appliquée) : …
> Type probable : évolution | exception
> Dis-moi ce que tu décides.

La conduite en attente vaut seulement quand aucune règle ne dit quoi faire. Quand une règle donne la marche à suivre, comme l'arrondi d'un espacement hors échelle, l'agent l'applique et la signale dans son rapport.

**Rôle typographique impossible à choisir** : si la fonction d'un texte ne permet pas de décider de son rôle, l'agent écrit « À trancher » et ne choisit pas un rôle à l'œil, ni d'après la taille actuelle ou la place disponible (`typographie.md`, section 7).

**Demande qui touche le DS** (ajouter, modifier ou supprimer un token ou un composant) : s'arrêter avant d'agir et demander. Un agent ne crée ni ne modifie jamais un token.

## À trancher

Contradictions et ambiguïtés relevées entre les sources. Chacune demande une décision : rien n'est résolu ici.

1. **Rayons.** Plusieurs rayons de carte cités dans les sources (en-tête de page, bloc de tête du dashboard, cartes de Création de cours) n'ont pas de variable. `--radius-badge` n'a pas de rôle écrit.
2. **Rubriques des entrées Bouton, Champ et Conteneur de page absentes de la documentation** (marquées « À trancher » dans la section 4) :
   - Bouton : rôle général ; token de l'état actif (appui tactile) pour toutes les variantes ; survol du bouton sur fond foncé et du rouge plein ; texte du bouton secondaire ; contour, texte et survol du bouton pointillé au repos.
   - Champ : rôle général ; texte saisi ; survol ; tokens de l'état désactivé.
   - Conteneur de page : élément qui fournit les marges d'une page hors navigation (aucun élément partagé ne le fait).
   - Écart à corriger dans le code (dérive) : le bouton pointillé désactivé n'a pas le fond lavande des boutons désactivés (« désactivé : lavande, texte atténué ») et ajoute une opacité.
3. **Valeurs en pixels sans token** : zone cliquable minimale, rayon du champ multiligne, épaisseur des deux variantes de barre, rayon de l'en-tête de page (dans `ds-principes-composants.md`), épaisseur du contour du bouton secondaire, paramètres de l'ombre d'illustration selon la carte et sur desktop (texte dans le commit aba8133). Ce fichier ne les recopie pas, donc `ds-principes-composants.md` ne peut pas encore être remplacé par un renvoi sans perdre ces valeurs.
4. **Valeurs en pixels dans les descriptions des espacements** (les valeurs hors échelle que chaque palier remplace), recopiées telles quelles dans la liste générée. Les retirer laisserait `espace-6` et `espace-20` sans description propre, alors que la règle impose une description par token.
5. **Description de `bordure-erreur`.** Elle cite « Réponse fausse, champ en erreur », pas le contour du bouton supprimer, qui l'utilise désormais.
