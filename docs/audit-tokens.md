# Audit des valeurs de design — Skillo

Audit en lecture seule, réalisé le 2026-10-20 sur `src/` (26 fichiers `.css`, 49 `.jsx`, 15 `.js`). Aucun fichier de code n'a été modifié.

**Méthode.** Commentaires retirés avant analyse. Les utilisations d'un token comptent chaque `var(--nom…)` trouvé dans `src/` (CSS et JSX/JS), y compris celles faites par une autre définition de token (ex. `--color-background: var(--color-creme)` compte une utilisation de `--color-creme`). Les fichiers `.svg` (46 icônes et illustrations dans `src/Assets/`) ne sont pas inclus dans les tableaux. Les tableaux 4 et 5 portent sur les déclarations CSS ; les styles en ligne JSX (10 `style={{…}}`) ne contiennent aucune valeur d'espacement, de rayon ni de taille de police en dur.

## 1. Tokens de couleur

### 1a. Déclarés dans `:root` (`src/styles/shared.css`)

| Token | Valeur | Fichier:ligne | Sélecteur | Utilisations du nom (`var()`) | Fichiers |
|---|---|---|---|---:|---:|
| `--color-creme` | `#f5eee4` | `src/styles/shared.css:5` | `:root` | 9 | 4 |
| `--color-background` | `var(--color-creme)` | `src/styles/shared.css:6` | `:root` | 6 | 6 |
| `--color-fond-formateur` | `#f4f4f6` | `src/styles/shared.css:7` | `:root` | 31 | 7 |
| `--color-surface` | `#ffffff` | `src/styles/shared.css:8` | `:root` | 118 | 22 |
| `--color-ink` | `#1e1a33` | `src/styles/shared.css:9` | `:root` | 112 | 23 |
| `--color-text-secondary` | `#5c566e` | `src/styles/shared.css:10` | `:root` | 77 | 18 |
| `--color-primary` | `#5b3fe0` | `src/styles/shared.css:12` | `:root` | 66 | 20 |
| `--color-primary-hover` | `#4630b8` | `src/styles/shared.css:13` | `:root` | 11 | 7 |
| `--color-primary-profond` | `#4630b8` | `src/styles/shared.css:14` | `:root` | 2 | 2 |
| `--color-primary-texte` | `#4a2fd0` | `src/styles/shared.css:15` | `:root` | 44 | 15 |
| `--color-lavande` | `#e4deff` | `src/styles/shared.css:16` | `:root` | 67 | 21 |
| `--color-lavande-pale` | `#eeeaff` | `src/styles/shared.css:17` | `:root` | 0 | 0 |
| `--color-texte-sur-violet` | `#dcd4ff` | `src/styles/shared.css:20` | `:root` | 2 | 2 |
| `--color-texte-sur-violet-doux` | `#ece8ff` | `src/styles/shared.css:21` | `:root` | 3 | 2 |
| `--color-texte-sur-encre` | `#d3cee3` | `src/styles/shared.css:22` | `:root` | 7 | 3 |
| `--color-texte-attenue` | `#3b3550` | `src/styles/shared.css:23` | `:root` | 13 | 9 |
| `--color-texte-sur-encre-clair` | `#e6e3ec` | `src/styles/shared.css:24` | `:root` | 1 | 1 |
| `--color-orange` | `#f6a55e` | `src/styles/shared.css:26` | `:root` | 9 | 6 |
| `--color-orange-survol` | `#ee9446` | `src/styles/shared.css:27` | `:root` | 2 | 1 |
| `--color-error` | `#b4232a` | `src/styles/shared.css:29` | `:root` | 24 | 8 |
| `--color-error-fond` | `#fde3e1` | `src/styles/shared.css:30` | `:root` | 12 | 6 |
| `--color-success` | `#17663f` | `src/styles/shared.css:31` | `:root` | 21 | 8 |
| `--color-success-fond` | `#dff3e7` | `src/styles/shared.css:32` | `:root` | 8 | 4 |
| `--color-contour-imbrique` | `#e4e4ea` | `src/styles/shared.css:34` | `:root` | 0 | 0 |
| `--color-contour-etape` | `#d9d2c6` | `src/styles/shared.css:35` | `:root` | 11 | 6 |
| `--color-separateur` | `#efe9e0` | `src/styles/shared.css:36` | `:root` | 11 | 8 |
| `--color-separateur-formateur` | `#ececf0` | `src/styles/shared.css:37` | `:root` | 6 | 3 |
| `--color-neutre-pale` | `#efe9e0` | `src/styles/shared.css:38` | `:root` | 3 | 3 |
| `--color-neutre-pale-formateur` | `#ececf0` | `src/styles/shared.css:39` | `:root` | 4 | 3 |
| `--color-fond-champ` | `var(--color-creme)` | `src/styles/shared.css:42` | `:root` | 7 | 2 |
| `--ombre-flottante` | `0 12px 32px rgba(30, 26, 51, 0.16)` | `src/styles/shared.css:45` | `:root` | 6 | 6 |

### 1b. Redéfinis ou déclarés hors de `:root`

| Token | Valeur | Fichier:ligne | Sélecteur | Utilisations du nom (`var()`) | Fichiers |
|---|---|---|---|---:|---:|
| `--color-background` | `var(--color-fond-formateur)` | `src/styles/shared.css:71` | `.flow-page-formateur` | 6 | 6 |
| `--color-background` | `var(--color-fond-formateur)` | `src/styles/shared.css:77` | `.espace-layout-formateur` | 6 | 6 |
| `--color-fond-champ` | `var(--color-fond-formateur)` | `src/styles/shared.css:72` | `.flow-page-formateur` | 7 | 2 |
| `--color-fond-champ` | `var(--color-fond-formateur)` | `src/styles/shared.css:78` | `.espace-layout-formateur` | 7 | 2 |
| `--color-separateur` | `var(--color-separateur-formateur)` | `src/styles/shared.css:73` | `.flow-page-formateur` | 11 | 8 |
| `--color-separateur` | `var(--color-separateur-formateur)` | `src/styles/shared.css:79` | `.espace-layout-formateur` | 11 | 8 |
| `--color-fond-champ` | `var(--color-fond-formateur)` | `src/components/Dropdown.css:72` | `.dropdown-content-formateur` | 7 | 2 |
| `--fond-barre` | `var(--color-creme)` | `src/pages/FicheCours.css:132` | `.fiche-barre-action` | 2 | 1 |
| `--fond-barre` | `var(--color-lavande)` | `src/pages/FicheCours.css:754` | `.fin-quiz-actions` | 2 | 1 |

Le compteur d'utilisations est celui du nom du token, commun à toutes ses définitions.

Autres tokens déclarés dans `:root`, hors couleur (repris dans les tableaux 4 et 5) : `--radius-carte` 28px (13 utilisations), `--radius-carte-petite` 26px (1), `--radius-reponse` 20px (6), `--radius-pill` 999px (57), `--radius-badge` 16px (3), `--espacement-bouton-pill` 26px (4), `--taille-h1` 34px / 44px dès 768px (5), `--taille-titre-cours` 28px / 32px dès 768px (2), `--font-display` (8) et `--font-body` (68), tous deux `'Urbanist', sans-serif`. Hors `shared.css` : `--hauteur-actions: 126px` (`src/components/GabaritParcours.css:6`, 1 utilisation) ; `--dash-ligne` et `--dash-colonne` posés en style en ligne (`src/pages/Dashboard.jsx:652`).

## 2. Tokens qui partagent la même valeur

| Valeur | Tokens | Nature |
|---|---|---|
| `#4630b8` | `--color-primary-hover`, `--color-primary-profond` | même hexadécimal écrit deux fois |
| `#efe9e0` | `--color-separateur`, `--color-neutre-pale` | même hexadécimal écrit deux fois |
| `#ececf0` | `--color-separateur-formateur`, `--color-neutre-pale-formateur` (et `--color-separateur` dans `.flow-page-formateur` / `.espace-layout-formateur`) | même hexadécimal écrit deux fois |
| `#f5eee4` | `--color-creme`, `--color-background`, `--color-fond-champ` (dans `:root`), `--fond-barre` (`.fiche-barre-action`) | alias par `var()` |
| `#f4f4f6` | `--color-fond-formateur`, `--color-background` et `--color-fond-champ` (dans `.flow-page-formateur` et `.espace-layout-formateur`), `--color-fond-champ` (`.dropdown-content-formateur`) | alias par `var()` |
| `#e4deff` | `--color-lavande`, `--fond-barre` (`.fin-quiz-actions`) | alias par `var()` |
| `'Urbanist', sans-serif` | `--font-display`, `--font-body` | même valeur écrite deux fois (hors couleur) |
| `26px` | `--radius-carte-petite`, `--espacement-bouton-pill` | même valeur, rôles différents (hors couleur) |

Valeurs en dur égales à un token (voir tableau 3) : `#5B3FE0` = `--color-primary`, `#F6A55E` = `--color-orange`, `#1E1A33` = `--color-ink`, `#FFFFFF` / `#ffffff` = `--color-surface`, `#4630B8` = `--color-primary-hover` / `--color-primary-profond`. Les `rgba(30, 26, 51, …)` reprennent la teinte de `--color-ink` (`#1e1a33`) avec une opacité.

## 3. Couleurs écrites en dur hors de `:root`

### 3a. Couleurs (hors ombres)

| Fichier:ligne | Valeur(s) | Contexte |
|---|---|---|
| `src/components/Confetti.jsx:21` | `#5B3FE0`, `#F6A55E`, `#1E1A33`, `#FFFFFF`, `#4630B8` | `COULEURS_PASTILLES` (canvas des confettis) |
| `src/components/Logo.jsx:13` | `#ffffff` ×2 | variante `fonce` : `texte` et `arc` |
| `src/components/ContenuMarkdown.css:75` | `rgba(30, 26, 51, 0.85)` | `background` |
| `src/components/formateur/Formateur.css:255` | `rgba(30, 26, 51, 0.45)` | `background` (voile de modale) |
| `src/components/formateur/Formateur.css:327` | `rgba(30, 26, 51, 0.45)` | `background` (voile) |
| `src/pages/DetailCoursFormateur.css:245` | `rgba(30, 26, 51, 0.6)` | `background` |
| `src/styles/shared.css:458` | `rgba(30, 26, 51, 0.45)` | `background` (voile) |
| `src/styles/espace-layout.css:65` | `rgba(255, 255, 255, 0.12)` | `background` |

### 3b. Ombres

| Fichier:ligne | Déclaration |
|---|---|
| `src/pages/Dashboard.css:108` | `filter: drop-shadow(0 14px 16px rgba(20, 10, 60, 0.35))` |
| `src/pages/Dashboard.css:116` | `filter: drop-shadow(0 14px 16px rgba(0, 0, 0, 0.4))` |
| `src/pages/Dashboard.css:756` | `filter: drop-shadow(0 18px 20px rgba(20, 10, 60, 0.35))` |
| `src/pages/Dashboard.css:760` | `filter: drop-shadow(0 18px 20px rgba(0, 0, 0, 0.4))` |
| `src/pages/FicheCours.css:646` | `filter: drop-shadow(0 14px 16px rgba(0, 0, 0, 0.4))` |
| `src/pages/FicheCours.css:865` | `filter: drop-shadow(0 14px 16px rgba(0, 0, 0, 0.4))` |
| `src/pages/parcours/Parcours.css:75` | `filter: drop-shadow(0 14px 16px rgba(20, 10, 60, 0.25))` |

Les autres `box-shadow` du projet passent par une variable : `--ombre-flottante`, l'ombre intérieure d'autoremplissage (`0 0 0 1000px var(--color-fond-champ | --color-surface) inset`, `src/styles/shared.css:227-236`, `src/components/EntetePage.css:59-60`, `src/components/GabaritParcours.css:260-261`) et le halo `0 0 0 4px var(--color-lavande)` (`src/components/ReperEtapes.css:74`).

### 3c. Mots-clés de couleur

Aucun nom de couleur au sens strict (`white`, `black`, `red`…) n'est utilisé. Mots-clés relevés :

| Mot-clé | Occurrences | Emplacements |
|---|---:|---|
| `transparent` | 24 | `border: 2px solid transparent` ×18 (`Dropdown.css:10`, `EntetePage.css:45`, `GabaritParcours.css:245, 292`, `Formateur.css:459`, `CreationCours.css:324, 377, 765, 922, 960`, `Dashboard.css:1017`, `DashboardFormateur.css:528`, `DetailGroupe.css:43`, `FicheCours.css:464`, `quiz.css:23`, `shared.css:93, 184, 196`) ; `background: transparent` ×4 (`GabaritParcours.css:98`, `Formateur.css:543`, `CreationCours.css:458`, `shared.css:278`) ; `linear-gradient(to bottom, transparent, var(--fond-barre))` (`FicheCours.css:149`) ; `-webkit-tap-highlight-color: transparent` (`shared.css:681`) |
| `currentColor` | 9 (JSX) | `stroke="currentColor"` dans les SVG en ligne : `Dropdown.jsx:31, 53`, `GabaritParcours.jsx:131`, `ReperEtapes.jsx:28`, `StatutBadge.jsx:22`, `formateur/Elements.jsx:50`, `DetailCoursFormateur.jsx:391`, `fiche/EcranChecklist.jsx:12`, `fiche/EcranQuiz.jsx:87` |

## 4. Valeurs d'espacement

Propriétés : `padding*`, `margin*`, `gap`, `row-gap`, `column-gap`, `top`, `bottom`, `left`, `right`, `inset*`, `scroll-padding*`, `scroll-margin*`. Chaque valeur en px ou rem est comptée une fois par apparition (`padding: 12px 16px` compte 12px et 16px ; les valeurs dans `calc()` sont comptées). Aucune valeur d'espacement n'est exprimée en rem.

| Valeur | Total | En dur | Via variable | Propriétés |
|---|---:|---:|---|---|
| `16px` | 103 | 103 | — | padding 53, gap 31, right 6, margin 5, margin-top 3, top 2, left 1, scroll-padding-inline 1, padding-bottom 1 |
| `12px` | 101 | 101 | — | gap 59, padding 30, top 2, left 2, margin 1, padding-top 1, padding-bottom 1, padding-left 1, row-gap 1, column-gap 1, right 1, margin-bottom 1 |
| `8px` | 87 | 87 | — | gap 46, padding 25, margin 8, margin-top 3, padding-top 2, bottom 1, right 1, top 1 |
| `10px` | 76 | 76 | — | gap 39, padding 30, margin-top 3, left 1, padding-bottom 1, margin 1, margin-bottom 1 |
| `6px` | 73 | 73 | — | gap 47, padding 14, margin-bottom 3, margin-top 3, margin 2, top 2, right 1, row-gap 1 |
| `20px` | 64 | 64 | — | padding 45, gap 11, margin 3, top 2, padding-left 1, margin-top 1, bottom 1 |
| `4px` | 48 | 48 | — | gap 19, padding 17, margin-top 5, margin 5, margin-bottom 2 |
| `14px` | 44 | 44 | — | padding 23, gap 14, margin-top 2, top 2, right 1, left 1, column-gap 1 |
| `18px` | 41 | 41 | — | padding 36, gap 4, left 1 |
| `24px` | 38 | 38 | — | padding 20, gap 9, bottom 3, margin-top 2, right 2, margin 1, column-gap 1 |
| `2px` | 21 | 21 | — | gap 14, padding 3, padding-top 2, margin 1, row-gap 1 |
| `40px` | 21 | 21 | — | padding 12, margin-top 5, padding-left 2, column-gap 1, margin 1 |
| `22px` | 18 | 18 | — | padding 16, padding-left 2 |
| `28px` | 18 | 18 | — | padding 12, margin 2, column-gap 1, top 1, scroll-margin-top 1, gap 1 |
| `32px` | 12 | 12 | — | padding 5, padding-left 2, padding-right 2, margin-top 2, gap 1 |
| `3px` | 7 | 7 | — | gap 4, padding 1, margin-top 1, padding-top 1 |
| `-40px` | 5 | 5 | — | margin 4, top 1 |
| `26px` | 5 | 1 | `--espacement-bouton-pill` ×4 | padding 5 |
| `48px` | 5 | 5 | — | padding 2, margin-left 2, right 1 |
| `5px` | 5 | 5 | — | padding 3, gap 2 |
| `-16px` | 4 | 4 | — | margin 4 |
| `-6px` | 4 | 4 | — | right 3, bottom 1 |
| `-8px` | 4 | 4 | — | margin 2, bottom 1, margin-top 1 |
| `-30px` | 3 | 3 | — | top 3 |
| `100px` | 3 | 3 | — | padding-right 3 |
| `200px` | 3 | 3 | — | padding-right 3 |
| `30px` | 3 | 3 | — | margin-top 2, padding 1 |
| `-3px` | 2 | 2 | — | left 1, right 1 |
| `-4px` | 2 | 2 | — | right 1, bottom 1 |
| `104px` | 2 | 2 | — | padding-top 1, padding 1 |
| `120px` | 2 | 2 | — | padding-right 2 |
| `150px` | 2 | 2 | — | padding 1, padding-right 1 |
| `36px` | 2 | 2 | — | padding 2 |
| `56px` | 2 | 2 | — | padding 2 |
| `72px` | 2 | 2 | — | padding-right 2 |
| `76px` | 2 | 2 | — | scroll-margin-top 1, padding-left 1 |
| `(--hauteur-actions)` | 1 | 0 | `--hauteur-actions` ×1 | padding 1 |
| `-20px` | 1 | 1 | — | margin 1 |
| `-24px` | 1 | 1 | — | top 1 |
| `-32px` | 1 | 1 | — | margin 1 |
| `-36px` | 1 | 1 | — | top 1 |
| `-56px` | 1 | 1 | — | margin 1 |
| `1.5px` | 1 | 1 | — | top 1 |
| `110px` | 1 | 1 | — | scroll-margin-top 1 |
| `112px` | 1 | 1 | — | padding 1 |
| `126px` | 1 | 1 | — | padding-bottom 1 |
| `128px` | 1 | 1 | — | padding 1 |
| `136px` | 1 | 1 | — | padding 1 |
| `140px` | 1 | 1 | — | padding 1 |
| `58px` | 1 | 1 | — | padding-bottom 1 |
| `60px` | 1 | 1 | — | padding-right 1 |
| `92px` | 1 | 1 | — | padding-right 1 |

## 5. Rayons de bordure et tailles de police

### 5a. Rayons (`border-radius` et variantes)

| Valeur | Total | En dur | Via variable | Propriétés |
|---|---:|---:|---|---|
| `999px` | 57 | 0 | `--radius-pill` ×57 | border-radius 57 |
| `20px` | 24 | 18 | `--radius-reponse` ×6 | border-radius 24 |
| `28px` | 18 | 5 | `--radius-carte` ×13 | border-radius 18 |
| `30px` | 11 | 11 | — | border-radius 11 |
| `16px` | 8 | 5 | `--radius-badge` ×3 | border-radius 8 |
| `24px` | 8 | 8 | — | border-radius 8 |
| `22px` | 7 | 7 | — | border-radius 7 |
| `32px` | 7 | 7 | — | border-radius 7 |
| `26px` | 5 | 4 | `--radius-carte-petite` ×1 | border-radius 5 |
| `36px` | 4 | 4 | — | border-radius 4 |
| `10px` | 2 | 2 | — | border-radius 2 |
| `12px` | 2 | 2 | — | border-radius 2 |
| `6px` | 2 | 2 | — | border-radius 2 |
| `14px` | 1 | 1 | — | border-radius 1 |
| `8px` | 1 | 1 | — | border-radius 1 |

### 5b. Tailles de police (`font-size`)

Les tokens `--taille-h1` et `--taille-titre-cours` sont rangés sous leur valeur mobile (34px et 28px) ; ils passent à 44px et 32px dès 768px. Équivalence rem calculée sur 16px.

| Valeur | Total | En dur | Via variable | Propriétés |
|---|---:|---:|---|---|
| `15px` | 55 | 55 | — | font-size 55 |
| `14px` | 54 | 54 | — | font-size 54 |
| `13px` | 43 | 43 | — | font-size 43 |
| `16px` | 30 | 30 | — | font-size 30 |
| `17px` | 12 | 12 | — | font-size 12 |
| `0.9rem (≈ 14.4px)` | 10 | 10 | — | font-size 10 |
| `12px` | 10 | 10 | — | font-size 10 |
| `20px` | 10 | 10 | — | font-size 10 |
| `1rem (≈ 16px)` | 9 | 9 | — | font-size 9 |
| `22px` | 8 | 8 | — | font-size 8 |
| `28px` | 8 | 6 | `--taille-titre-cours` ×2 | font-size 8 |
| `0.85rem (≈ 13.6px)` | 7 | 7 | — | font-size 7 |
| `34px` | 7 | 2 | `--taille-h1` ×5 | font-size 7 |
| `18px` | 5 | 5 | — | font-size 5 |
| `0.8rem (≈ 12.8px)` | 4 | 4 | — | font-size 4 |
| `1.3rem (≈ 20.8px)` | 4 | 4 | — | font-size 4 |
| `24px` | 4 | 4 | — | font-size 4 |
| `0.75rem (≈ 12px)` | 3 | 3 | — | font-size 3 |
| `0.95rem (≈ 15.2px)` | 3 | 3 | — | font-size 3 |
| `1.05rem (≈ 16.8px)` | 2 | 2 | — | font-size 2 |
| `1.4rem (≈ 22.4px)` | 2 | 2 | — | font-size 2 |
| `26px` | 2 | 2 | — | font-size 2 |
| `32px` | 2 | 2 | — | font-size 2 |
| `0.72rem (≈ 11.52px)` | 1 | 1 | — | font-size 1 |
| `1.1rem (≈ 17.6px)` | 1 | 1 | — | font-size 1 |
| `1.2rem (≈ 19.2px)` | 1 | 1 | — | font-size 1 |
| `1.75rem (≈ 28px)` | 1 | 1 | — | font-size 1 |
| `10px` | 1 | 1 | — | font-size 1 |
| `19px` | 1 | 1 | — | font-size 1 |
| `21px` | 1 | 1 | — | font-size 1 |
| `30px` | 1 | 1 | — | font-size 1 |
| `36px` | 1 | 1 | — | font-size 1 |
| `44px` | 1 | 1 | — | font-size 1 |
| `48px` | 1 | 1 | — | font-size 1 |

Fichiers qui utilisent des tailles en rem : `src/styles/shared.css` (19), `src/styles/espace-layout.css` (7), `src/pages/DashboardFormateur.css` (5), `src/styles/quiz.css` (5), `src/components/ContenuMarkdown.css` (4), `src/components/CompletionToast.css` (2), `src/components/Dropdown.css` (2), `src/components/EntetePage.css` (1), `src/pages/CreationCours.css` (1), `src/pages/Dashboard.css` (1), `src/pages/FicheCours.css` (1).

## Constat

- **Tokens de couleur** : 30 déclarés dans `:root` (dont `--ombre-flottante`), plus 9 redéfinitions dans `.flow-page-formateur`, `.espace-layout-formateur` et `.dropdown-content-formateur`, et un token local `--fond-barre` déclaré deux fois dans `FicheCours.css`. 2 tokens ne sont jamais utilisés : `--color-lavande-pale` et `--color-contour-imbrique`.
- **Doublons de valeur entre tokens** : 3 valeurs hexadécimales écrites deux fois dans `:root` (`#4630b8`, `#efe9e0`, `#ececf0`, soit 6 tokens), plus 2 doublons hors couleur (`'Urbanist', sans-serif` ; `26px`). 3 autres valeurs sont partagées par alias `var()`.
- **Couleurs en dur** : 20 occurrences hors `:root`, dont 13 couleurs (7 hexadécimales en JSX, 6 `rgba` en CSS) et 7 ombres d'illustration en `drop-shadow`. Les 7 hexadécimales ont la même valeur qu’un token existant. S'y ajoutent les mots-clés `transparent` (24) et `currentColor` (9).
- **Espacements** : 52 valeurs distinctes sur 850 occurrences ; 5 passent par une variable (`--espacement-bouton-pill` ×4, `--hauteur-actions` ×1), 845 sont en dur. Les six valeurs les plus fréquentes (16, 12, 8, 10, 6 et 20px) représentent 504 occurrences.
- **Rayons** : 15 valeurs distinctes sur 157 occurrences ; 80 passent par une variable, 77 sont en dur. 28px, 20px, 26px et 16px apparaissent à la fois en dur et via leur token.
- **Tailles de police** : 34 valeurs distinctes sur 305 occurrences (21 en px, 13 en rem) ; 7 passent par une variable, 298 sont en dur.
