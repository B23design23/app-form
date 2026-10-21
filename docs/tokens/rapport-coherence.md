Statut : contrôle du 21 octobre 2026, rien n'a été corrigé

# Rapport de cohérence : fichiers `tokens/` et CSS actuel

## Vérification des références (21 octobre 2026)

Résultat : **aucune erreur.** Relancée après le regroupement des sémantiques par propriété (`fond`, `texte`, `bordure`) : mêmes chiffres. Les noms ci-dessous sont écrits à plat (`fond-page` pour le chemin `fond.page`), comme dans le CSS généré.

Les cinq fichiers ont été chargés et fusionnés deux fois, une fois par mode : primitifs + espacements + communs + apprenant, puis la même chose avec formateur. Chaque `$value` a été résolue jusqu'à une valeur brute.

| Contrôle | Résultat |
|---|---|
| Alias `{…}` résolus vers un token existant | 74 sur 74 (37 par mode) |
| `$ref` JSON Pointer résolus vers une valeur existante | 18 sur 18 (3 tokens × 3 composantes, par mode) |
| Références circulaires | aucune |
| Code hexadécimal identique aux composantes résolues | oui, pour les 21 primitifs et les 3 tokens avec opacité |
| Mêmes noms dans `semantiques-apprenant` et `semantiques-formateur` | oui, 6 noms identiques |
| Aucun sémantique à la fois dans le fichier commun et dans un mode | oui |

Les `$ref` (`#/couleur/<primitif>/$value/components/N`) pointent vers le fichier des primitifs. Ils se résolvent dans le jeu de tokens fusionné, pas dans le fichier seul qui les contient. Le script de contrôle a aussi été lancé sur une copie volontairement cassée (alias inexistant, `$ref` vers une composante absente, boucle entre deux alias) : il signale les trois erreurs.

Comparaison entre les cinq fichiers de `tokens/` (format DTCG 2025.10) et les variables CSS déclarées dans `src/` : le `:root` de `src/styles/shared.css`, les trois classes qui redéfinissent des variables pour l'espace formateur (`.flow-page-formateur`, `.espace-layout-formateur`, `.dropdown-content-formateur`) et les variables locales des autres fichiers.

La correspondance entre une variable CSS et un token suit la colonne « Remplace » de `couleurs.md` et le tableau des valeurs hors échelle de `espacements.md`. Comme la migration n'est pas faite, aucun nom CSS n'est encore identique à un nom de token : toutes les correspondances apparaissent donc dans la liste 3.

Exclues du contrôle : `--radix-select-trigger-width` et `--radix-select-content-available-height`, déclarées par la bibliothèque Radix et seulement lues par l'app.

## 1. Variables CSS sans token (16)

**Supprimées par `couleurs.md` (décision 5)** : 0 utilisation dans `src/`.

| Variable | Valeur | Où |
|---|---|---|
| `--color-lavande-pale` | `#eeeaff` | `src/styles/shared.css:17` |
| `--color-contour-imbrique` | `#e4e4ea` | `src/styles/shared.css:34` |

**Hors du périmètre de l'étape 1** (typographie, rayons, ombre : pas encore de décision écrite) :

| Variable | Valeur | Où |
|---|---|---|
| `--font-display` | `'Urbanist', sans-serif` | `src/styles/shared.css:47` |
| `--font-body` | `'Urbanist', sans-serif` | `src/styles/shared.css:48` |
| `--radius-carte` | `28px` | `src/styles/shared.css:50` |
| `--radius-carte-petite` | `26px` | `src/styles/shared.css:51` |
| `--radius-reponse` | `20px` | `src/styles/shared.css:52` |
| `--radius-pill` | `999px` | `src/styles/shared.css:53` |
| `--radius-badge` | `16px` | `src/styles/shared.css:54` |
| `--taille-h1` | `34px`, `44px` dès 768 px | `src/styles/shared.css:59`, `:65` |
| `--taille-titre-cours` | `28px`, `32px` dès 768 px | `src/styles/shared.css:60`, `:66` |
| `--ombre-flottante` | `0 12px 32px rgba(30, 26, 51, 0.16)` | `src/styles/shared.css:45` |

**Variables de mise en page ou de composant**, qui n'appellent pas de token :

| Variable | Valeur | Où | Remarque |
|---|---|---|---|
| `--hauteur-actions` | `126px`, puis mesurée en JS | `src/components/GabaritParcours.css:6` | zone d'action mesurée, hors échelle volontairement (`espacements.md`, § 2) |
| `--fond-barre` | `var(--color-creme)` / `var(--color-lavande)` | `src/pages/FicheCours.css:132`, `:754` | variable de composant ; `couleurs.md` (décision 1) laisse ce niveau vide. À la migration, elle pointera vers `fond-page` (quiz) et `fond-accent` (fin de quiz) |
| `--dash-ligne` | valeur de placement | `src/pages/Dashboard.jsx:652` | placement de grille calculé en JS, pas une valeur de design |
| `--dash-colonne` | valeur de placement | `src/pages/Dashboard.jsx:652` | idem |

## 2. Tokens sans équivalent dans le CSS (14)

Aucune variable CSS n'existe pour ces tokens. Pour les trois couleurs, la valeur est écrite en dur.

| Token | Fichier | Valeur du token | Ce qu'il y a dans le CSS |
|---|---|---|---|
| `fond-inverse-survol` | communs | composantes de `couleur.blanc` par `$ref`, alpha 0,12 | `rgba(255, 255, 255, 0.12)` en dur, `src/styles/espace-layout.css:65` |
| `fond-voile` | communs | composantes de `couleur.ardoise-900` par `$ref`, alpha 0,45 | `rgba(30, 26, 51, 0.45)` en dur ×3 : `src/styles/shared.css:458`, `src/components/formateur/Formateur.css:255`, `:327` |
| `fond-voile-accentue` | communs | composantes de `couleur.ardoise-900` par `$ref`, alpha 0,85 | `rgba(30, 26, 51, 0.85)` en dur, `src/components/ContenuMarkdown.css:75` ; **et `rgba(30, 26, 51, 0.6)`** en dur, `src/pages/DetailCoursFormateur.css:245` (valeur différente : la fusion à 85 % est décidée dans `couleurs.md`, décision 2) |
| `espace.2` à `espace.40` (11 tokens) | espacements | 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40 px | aucune variable `--espace-*` : les 850 occurrences d'espacement sont en dur (`docs/audit-tokens.md`, tableau 4) |

## 3. Nom ou valeur différents (29, dont 4 écarts de valeur)

Les écarts de valeur sont en gras. Quand une ligne CSS se répartit entre plusieurs sémantiques, c'est la propriété CSS (`background`, `color`, `border`) qui décide, selon `couleurs.md`.

### 3a. Couleurs

| Variable CSS | Valeur CSS | Primitif | Sémantique(s) | Écart |
|---|---|---|---|---|
| `--color-creme` | `#f5eee4` | `sable-50` | `fond-page` et `fond-sur-carte` (apprenant) | nom |
| `--color-background` | `var(--color-creme)` ; `var(--color-fond-formateur)` dans les 2 classes formateur | `sable-50` / `ardoise-50` | `fond-page` | nom |
| `--color-fond-formateur` | `#f4f4f6` | `ardoise-50` | `fond-page` et `fond-sur-carte` (formateur) | nom |
| `--color-fond-champ` | `var(--color-creme)` ; `var(--color-fond-formateur)` dans les 3 classes formateur | `sable-50` / `ardoise-50` | `fond-sur-carte` | nom |
| `--color-surface` | `#ffffff` | `blanc` | `fond-surface`, `texte-sur-marque`, `texte-sur-inverse` | nom (1 variable, 3 sémantiques) |
| `--color-ink` | `#1e1a33` | `ardoise-900` | `fond-inverse`, `texte-principal` | nom |
| `--color-text-secondary` | `#5c566e` | `ardoise-625` | `texte-secondaire` | nom |
| `--color-primary` | `#5b3fe0` | `violet-600` | `fond-marque`, `fond-action`, `bordure-action`, `bordure-focus` | nom (1 variable, 4 sémantiques) |
| `--color-primary-hover` | `#4630b8` | `violet-675` | `fond-action-survol`, `texte-accent-survol` | nom |
| `--color-primary-profond` | `#4630b8` | `violet-675` | `fond-marque-accentue` | nom (même valeur que `--color-primary-hover`, un seul primitif) |
| `--color-primary-texte` | `#4a2fd0` | `violet-650` | `texte-accent` | nom |
| `--color-lavande` | `#e4deff` | `violet-100` | `fond-accent`, `fond-action-desactive` | nom |
| `--color-texte-sur-violet` | **`#dcd4ff`** | **`violet-75` (`#ece8ff`)** | `texte-sur-marque-attenue` | **nom et valeur** : `couleurs.md` (décision 5) supprime `violet-125` et fusionne vers `violet-75` ; 2 textes sur carte violette s'éclairciront |
| `--color-texte-sur-violet-doux` | `#ece8ff` | `violet-75` | `texte-sur-marque-attenue` | nom |
| `--color-texte-sur-encre` | `#d3cee3` | `ardoise-175` | `texte-sur-inverse-attenue` | nom |
| `--color-texte-sur-encre-clair` | **`#e6e3ec`** | **`ardoise-175` (`#d3cee3`)** | `texte-sur-inverse-attenue` | **nom et valeur** : `couleurs.md` (décision 5) supprime `ardoise-100` ; l'explication du quiz sur le bloc encre s'assombrira légèrement (1 usage) |
| `--color-texte-attenue` | `#3b3550` | `ardoise-750` | `texte-sur-accent`, `texte-action-desactive` | nom |
| `--color-orange` | `#f6a55e` | `orange-250` | `fond-recompense`, `texte-recompense` | nom |
| `--color-orange-survol` | `#ee9446` | `orange-300` | `fond-recompense-survol` | nom |
| `--color-error` | `#b4232a` | `rouge-600` | `texte-erreur`, `bordure-erreur`, `fond-erreur-accentue` | nom |
| `--color-error-fond` | `#fde3e1` | `rouge-75` | `fond-erreur` | nom |
| `--color-success` | `#17663f` | `vert-625` | `texte-succes`, `bordure-succes`, `fond-succes-accentue` | nom |
| `--color-success-fond` | `#dff3e7` | `vert-50` | `fond-succes` | nom |
| `--color-contour-etape` | `#d9d2c6` partout, **non redéfini en formateur** | `sable-150` ; **`ardoise-175` (`#d3cee3`) en formateur** | `fond-controle`, `bordure-controle` | **nom et valeur en formateur** : `couleurs.md` (décision 3) donne `ardoise-175` à l'espace formateur, le CSS garde `#d9d2c6`. Les fichiers suivent `couleurs.md` |
| `--color-separateur` | `#efe9e0` ; `var(--color-separateur-formateur)` dans 2 classes formateur | `sable-75` / `ardoise-75` | `bordure-separateur` | nom |
| `--color-separateur-formateur` | `#ececf0` | `ardoise-75` | `bordure-separateur` (formateur) | nom |
| `--color-neutre-pale` | `#efe9e0` | `sable-75` | `fond-neutre` (apprenant) | nom |
| `--color-neutre-pale-formateur` | `#ececf0` | `ardoise-75` | `fond-neutre` (formateur) | nom ; et mécanisme : le CSS choisit entre deux variables composant par composant, le token est un seul nom à deux modes |

### 3b. Espacements

| Variable CSS | Valeur CSS | Token | Écart |
|---|---|---|---|
| `--espacement-bouton-pill` | **`26px`** | **`espace.24`** | **nom et valeur** : 26 est hors échelle, ramené à 24 par `espacements.md` (§ 2) |

### 3c. Différences de structure (pour information, non comptées)

- **Redéfinitions formateur incomplètes.** `.flow-page-formateur` et `.espace-layout-formateur` ne redéfinissent que `--color-background`, `--color-fond-champ` et `--color-separateur`. Le mode formateur des tokens couvre aussi `fond-neutre`, `fond-controle` et `bordure-controle`. `.dropdown-content-formateur` ne redéfinit que `--color-fond-champ`.
- **Contournement du mode.** `--color-creme` (9 usages) et `--color-fond-formateur` (31 usages) sont lus directement, sans passer par une variable qui change selon l'espace. Ces usages devront être reclassés un par un vers `fond-page` ou `fond-sur-carte` à la migration.
- **Une variable CSS pour plusieurs rôles.** `--color-primary`, `--color-surface`, `--color-error`, `--color-success`, `--color-ink`, `--color-orange` et `--color-lavande` se répartiront chacune entre plusieurs sémantiques selon la propriété CSS qui les emploie.

## Dérives à corriger à la migration

**Corrigées le 21 octobre 2026** (migration des couleurs, DS 2.0.0). Les listes 1 à 3 ci-dessus décrivent l'état d'avant la migration.

Ce sont les écarts entre `couleurs.md` et le CSS actuel. Les fichiers `tokens/` suivent `couleurs.md` ; c'est le CSS qui devra s'aligner :

1. `--color-texte-sur-violet` `#dcd4ff` → `violet-75` `#ece8ff` (liste 3).
2. `--color-texte-sur-encre-clair` `#e6e3ec` → `ardoise-175` `#d3cee3` (liste 3).
3. `--color-contour-etape` en formateur `#d9d2c6` → `ardoise-175` `#d3cee3` (liste 3).
4. `rgba(30, 26, 51, 0.6)` de la miniature « +N » → `fond-voile-accentue` à 85 % (liste 2).
5. `--color-lavande-pale` et `--color-contour-imbrique` sans token (liste 1).
