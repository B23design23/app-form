# Audit de la typographie (relevé, sans valeur cible)

Relevé du 2026-11-04, première étape du chantier typographie du design system. Ce document décrit ce qui existe. Il ne propose ni échelle ni valeur, et ne crée aucun token. Les noms de rôles sont des **candidats**, à valider.

**Code relevé** : `origin/main` (prod) au commit `a6d20f6`, lu sans changer de branche (extraction par `git archive`). Les différences avec `design-system` (`3b505c4`) sont en section 7.

**Méthode**

- Lecture de tous les fichiers CSS de `src/` (26 fichiers) et de tous les composants JSX (49 fichiers). Aucun composant n'écrit de style typographique inline (`style={{ fontSize… }}`) : la seule mention, `CreationCours.jsx:120`, *lit* `lineHeight` et `fontSize` pour ajuster la hauteur d'un champ.
- Construction du CSS de prod (`vite build` sur l'extraction d'origin/main, dans un dossier temporaire) pour connaître l'ordre réel des règles dans le fichier unique livré. Cet ordre tranche les conflits entre deux règles de même spécificité.
- Vérification dans Chromium (Playwright), avec le CSS de prod compilé : valeurs par défaut du navigateur, hauteur de ligne `normal` d'Urbanist, rendu des graisses 900 et de l'italique, et chaque cas où la valeur rendue diffère de la valeur écrite (signalés « écrasé » dans les tableaux).
- Usage réel : chaque classe CSS est recherchée dans le JSX. Les règles dont aucune classe n'est utilisée sont classées « CSS non utilisé » et sorties des comptes par rôle.

**Conventions**

- Taille de base : **16 px**. Aucun fichier ne déclare de `font-size` sur `html` ou `:root`, donc 1 rem = taille par défaut du navigateur = 16 px. Aucune valeur en `em` ni en `%` pour le texte.
- « hérité » : aucune déclaration, la valeur vient du parent. Sauf mention contraire, la graisse héritée vaut **500** (`body`, `index.css:10`), noté `500*` dans les synthèses.
- « 400 (navigateur) », noté `400†` : sur `button`, `input`, `textarea` et `select`, le navigateur n'applique pas l'héritage. Ce qui n'est pas déclaré prend la valeur du navigateur : Arial 13,33 px 400 pour un bouton ou un champ, monospace 13,33 px pour un `textarea` (mesuré dans Chromium).
- « absente » (hauteur de ligne) : la valeur `normal` s'applique. Avec Urbanist, `normal` vaut **1,2** (mesuré : 120 px pour une taille de 100 px).
- Largeur : « toutes » = règle de base (mobile d'abord). Les media queries sont indiquées telles qu'écrites.
- Une ligne décrit les déclarations de sa propre règle. Quand une autre règle fournit la valeur (en particulier `.espace-page h1` et `.espace-page h2` pour les titres des pages avec navigation, ou `.bouton-primaire` pour les boutons combinés), la valeur reçue est précisée ou signalée « écrasé ».
- Origine : « variable » si la taille passe par une variable CSS, « en dur » sinon. La famille passe toujours par `--font-body` ou `--font-display`.

## 1. Sources

### 1.1 Polices chargées

| Police | Service | Où | Graisses | Styles | Fichiers téléchargés |
|---|---|---|---|---|---|
| Urbanist | Google Fonts (`fonts.googleapis.com`, fichiers sur `fonts.gstatic.com`) | `@import` en tête de `src/styles/shared.css:1` ; Vite le remonte en tête du CSS de prod, où il reste valide | 400, 500, 600, 700, 800 | normal seulement (aucune italique) | une instance statique `woff2` par graisse et par sous-ensemble (latin, latin-ext), soit 10 fichiers au plus, chargés à la demande selon les caractères affichés (`unicode-range`) ; `display=swap` |

- `index.html` ne charge aucune police (pas de `<link>`, pas de `preconnect`).
- Aucun `@font-face` local, aucune autre police ni aucun autre service.
- Repli : la famille générique `sans-serif` (`'Urbanist', sans-serif`).
- Les tokens (`tokens/*.tokens.json`) et `src/styles/tokens.generes.css` ne contiennent **aucune** valeur typographique (couleurs et espacements seulement).

### 1.2 Taille de base

16 px, valeur par défaut du navigateur (voir Conventions). Les tailles écrites en rem suivent le réglage de taille de texte du navigateur, pas celles écrites en px (les deux sont mélangées, voir 5.1). `-webkit-text-size-adjust` n'est déclaré nulle part.

### 1.3 Variables liées au texte

Toutes dans `src/styles/shared.css`, bloc `:root`.

| Variable | Valeur | ≥ 768 px | Déclarée | Utilisations |
|---|---|---|---|---|
| `--font-display` | `'Urbanist', sans-serif` | | ligne 10 | 8 |
| `--font-body` | `'Urbanist', sans-serif` | | ligne 11 | 67 |
| `--taille-h1` | `34px` | `44px` (ligne 27) | ligne 21 | 5 : `.espace-page h1`, `.flow-card h1`, `.fm-titres h1`, `.parcours-titre`, `.fd-titres h1` (≥ 768) |
| `--taille-titre-cours` | `28px` | `32px` (ligne 28) | ligne 22 | 2 : `.fiche-entete-titre`, `.dash-titre-tete` (≥ 768) |

Il n'existe aucune variable de graisse, de hauteur de ligne ni d'espacement des lettres. `--font-display` et `--font-body` désignent la même police.

### 1.4 Règles de base et valeurs du navigateur

| Élément | Déclaration | Effet |
|---|---|---|
| `body` | `index.css:5` : `--font-body`, graisse 500, pas de taille ni de hauteur de ligne | tout le texte hérite d'Urbanist 500, 16 px, interligne `normal` (1,2) |
| `h1, h2, h3` | `index.css:15` : `--font-display`, graisse 800, `text-wrap: balance`, `hyphens: manual` | taille du navigateur si rien d'autre ne s'applique : h1 32 px, h2 24 px, h3 18,72 px |
| `h4` (Markdown) | aucune | navigateur : graisse 700 (bold), taille 1em, famille héritée |
| `h5`, `h6` (Markdown) | aucune (non mappés par `ContenuMarkdown`) | navigateur : graisse 700, 0,83em et 0,67em |
| `strong`, `b` | aucune règle générale | navigateur : `bolder`. Parent à 500 → 700 ; parent à 600 ou plus → 900, non chargée (voir 5.2) |
| `em`, `i` (Markdown `*texte*`) | aucune | navigateur : italique. Aucune italique n'est chargée → italique de synthèse (voir 5.2) |
| `th` | `.contenu-markdown th` (800), `.dg-table th` (800), `.fd-tableau th[scope='row']` (`inherit`) | les autres `th` prennent le gras du navigateur (700) |
| `button`, `input`, `textarea`, `select` | pas de `font: inherit` global | tout ce qui n'est pas déclaré prend la valeur du navigateur (voir Conventions et 5.4) |
| `code`, `pre` (Markdown) | aucune | navigateur : monospace, 13 px |

## 2. Inventaire brut

Comptes sur les déclarations écrites dans les fichiers CSS : une déclaration = une occurrence, media queries comprises. « CSS utilisé » exclut les 14 règles dont aucune classe n'est utilisée (liste en 4.2).

### 2.1 Valeurs écrites

**font-family** : 70 occurrences dans le CSS utilisé (75 avec le CSS non utilisé), 2 valeurs distinctes (2 avec le CSS non utilisé).

| Valeur écrite | Occurrences (CSS utilisé) | Occurrences (tout le CSS) |
|---|---|---|
| `var(--font-body)` | 64 | 67 |
| `var(--font-display)` | 6 | 8 |

**font-size** : 293 occurrences dans le CSS utilisé (304 avec le CSS non utilisé), 35 valeurs distinctes (36 avec le CSS non utilisé).

| Valeur écrite | Occurrences (CSS utilisé) | Occurrences (tout le CSS) |
|---|---|---|
| `15px` | 55 | 55 |
| `14px` | 54 | 54 |
| `13px` | 43 | 43 |
| `16px` | 30 | 30 |
| `17px` | 12 | 12 |
| `20px` | 10 | 10 |
| `12px` | 10 | 10 |
| `1rem` | 8 | 9 |
| `22px` | 8 | 8 |
| `0.85rem` | 7 | 7 |
| `0.9rem` | 6 | 10 |
| `28px` | 6 | 6 |
| `var(--taille-h1)` | 5 | 5 |
| `18px` | 5 | 5 |
| `24px` | 4 | 4 |
| `0.75rem` | 3 | 3 |
| `1.3rem` | 2 | 4 |
| `0.95rem` | 2 | 3 |
| `1.05rem` | 2 | 2 |
| `1.4rem` | 2 | 2 |
| `32px` | 2 | 2 |
| `var(--taille-titre-cours)` | 2 | 2 |
| `26px` | 2 | 2 |
| `34px` | 2 | 2 |
| `0.8rem` | 1 | 3 |
| `0.72rem` | 1 | 1 |
| `1.2rem` | 1 | 1 |
| `21px` | 1 | 1 |
| `48px` | 1 | 1 |
| `30px` | 1 | 1 |
| `19px` | 1 | 1 |
| `1.75rem` | 1 | 1 |
| `36px` | 1 | 1 |
| `10px` | 1 | 1 |
| `44px` | 1 | 1 |
| `1.1rem` | 0 | 1 |

**font-weight** : 236 occurrences dans le CSS utilisé (241 avec le CSS non utilisé), 5 valeurs distinctes (5 avec le CSS non utilisé).

| Valeur écrite | Occurrences (CSS utilisé) | Occurrences (tout le CSS) |
|---|---|---|
| `800` | 123 | 125 |
| `700` | 63 | 64 |
| `600` | 41 | 43 |
| `500` | 8 | 8 |
| `inherit` | 1 | 1 |

**line-height** : 51 occurrences dans le CSS utilisé (52 avec le CSS non utilisé), 10 valeurs distinctes (10 avec le CSS non utilisé).

| Valeur écrite | Occurrences (CSS utilisé) | Occurrences (tout le CSS) |
|---|---|---|
| `1.1` | 15 | 15 |
| `1.2` | 11 | 11 |
| `1` | 7 | 8 |
| `1.4` | 5 | 5 |
| `1.55` | 3 | 3 |
| `1.35` | 3 | 3 |
| `1.25` | 2 | 2 |
| `1.45` | 2 | 2 |
| `1.05` | 2 | 2 |
| `1.15` | 1 | 1 |

**letter-spacing** : 3 occurrences dans le CSS utilisé (3 avec le CSS non utilisé), 2 valeurs distinctes (2 avec le CSS non utilisé).

| Valeur écrite | Occurrences (CSS utilisé) | Occurrences (tout le CSS) |
|---|---|---|
| `-0.5px` | 2 | 2 |
| `-0.8px` | 1 | 1 |

**text-transform** : 0 occurrences dans le CSS utilisé (0 avec le CSS non utilisé), 0 valeurs distinctes (0 avec le CSS non utilisé).

**font-style** : 0 occurrences dans le CSS utilisé (0 avec le CSS non utilisé), 0 valeurs distinctes (0 avec le CSS non utilisé).

**font** : 2 occurrences dans le CSS utilisé (2 avec le CSS non utilisé), 1 valeurs distinctes (1 avec le CSS non utilisé).

| Valeur écrite | Occurrences (CSS utilisé) | Occurrences (tout le CSS) |
|---|---|---|
| `inherit` | 2 | 2 |

### 2.2 Tailles rendues en px (rem convertis à 16 px, variables résolues)

30 tailles rendues distinctes dans le CSS utilisé.

| Taille rendue | Occurrences | Écrite comme |
|---|---|---|
| 10 px | 1 | `10px` |
| 11,52 px | 1 | `0.72rem` |
| 12 px | 13 | `0.75rem`, `12px` |
| 12,8 px | 1 | `0.8rem` |
| 13 px | 43 | `13px` |
| 13,6 px | 7 | `0.85rem` |
| 14 px | 54 | `14px` |
| 14,4 px | 6 | `0.9rem` |
| 15 px | 55 | `15px` |
| 15,2 px | 2 | `0.95rem` |
| 16 px | 38 | `16px`, `1rem` |
| 16,8 px | 2 | `1.05rem` |
| 17 px | 12 | `17px` |
| 18 px | 5 | `18px` |
| 19 px | 1 | `19px` |
| 19,2 px | 1 | `1.2rem` |
| 20 px | 10 | `20px` |
| 20,8 px | 2 | `1.3rem` |
| 21 px | 1 | `21px` |
| 22 px | 8 | `22px` |
| 22,4 px | 2 | `1.4rem` |
| 24 px | 4 | `24px` |
| 26 px | 2 | `26px` |
| 28 px | 8 | `1.75rem`, `28px`, `var(--taille-titre-cours)` |
| 30 px | 1 | `30px` |
| 32 px | 3 | `32px`, `var(--taille-titre-cours)` |
| 34 px | 6 | `34px`, `var(--taille-h1)` |
| 36 px | 1 | `36px` |
| 44 px | 2 | `44px`, `var(--taille-h1)` |
| 48 px | 1 | `48px` |

### 2.3 Hauteur de ligne

223 des 265 règles de base (hors media queries) qui fixent une taille ne fixent pas de hauteur de ligne. Le texte prend alors `normal` (1,2 avec Urbanist) ou la valeur d'un parent.

## 3. Regroupement par rôle candidat

Chaque règle utilisée est rattachée à un rôle candidat (colonne « Rôle candidat » en annexe A). Synthèse sur les règles de base : la variante desktop d'une règle est traitée en section 6. Les combinaisons sont « taille rendue · graisse rendue · hauteur de ligne ». Un rôle est marqué **plusieurs valeurs** dès qu'il a plus d'une combinaison.

### 3.1 Synthèse

| Rôle candidat | Occurrences | Combinaisons | Tailles distinctes | Combinaison la plus fréquente |
|---|---|---|---|---|
| Titre de page | 8 | 4 | 3 | 34 px · 800 · 1.1 (5) |
| Titre de contenu (cours, thème, question) | 6 | 5 | 4 | 28 px · 800 · 1.1 (2) |
| Titre de section | 14 | 11 | 9 | 16,8 px · 800 · absente (2) |
| Titre de carte ou de bloc | 16 | 10 | 7 | 17 px · 800 · absente (4) |
| Titre de ligne ou d'élément de liste | 16 | 7 | 3 | 15 px · 800 · absente (6) |
| Titre de modale ou de menu | 3 | 3 | 3 | 17 px · 800 · absente (1) |
| Corps de texte | 17 | 13 | 7 | 15 px · 500* · 1.45 (2) |
| Sous-titre et texte secondaire | 16 | 8 | 5 | 14 px · 700 · absente (3) |
| Méta | 43 | 11 | 4 | 13 px · 500* · absente (8) |
| Surtitre (libellé court au-dessus d'un titre) | 12 | 2 | 2 | 13 px · 700 · absente (10) |
| Libellé de bouton | 18 | 7 | 4 | 16 px · 800 · absente (6) |
| Lien et bouton texte | 21 | 7 | 5 | 15 px · 800 · absente (10) |
| Navigation, onglet, filtre, entrée de menu | 7 | 5 | 5 | 14 px · 700 · absente (2) |
| Libellé de champ | 5 | 4 | 3 | 14,4 px · 500* · absente (2) |
| Saisie et choix de champ | 18 | 12 | 7 | 16 px · 400† · absente (4) |
| Aide, erreur et message | 10 | 8 | 3 | 14 px · 700 · absente (3) |
| Pastille | 16 | 8 | 5 | 12 px · 800 · absente (5) |
| Chiffre mis en avant | 7 | 5 | 5 | 28 px · 800 · 1 (2) |
| Compteur et chiffre de progression | 7 | 5 | 4 | 15 px · 800 · absente (2) |
| Numéro dans une pastille ronde | 6 | 4 | 4 | 13 px · 800 · absente (3) |

Les 20 rôles candidats ont tous plusieurs valeurs. Le plus homogène est « Surtitre » (10 occurrences sur 12 à 13 px · 700).

### 3.2 Détail par rôle


#### Titre de page (rôle candidat) : **plusieurs valeurs**

8 occurrences, 4 combinaisons, 3 tailles. Combinaison la plus fréquente : **34 px · 800 · interligne 1.1** (5 occurrences, dont « Bonjour », qui reçoit l'interligne de `.espace-page h1`).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 34 px | 800 | 1.1 | 5 | H1 de page dans .espace-page (Pages avec navigation, `espace-layout.css:150`); H1 de la carte de flux (Mot de passe oublié / Nouveau mot de passe / Compléter le profil, `shared.css:108`); H1 du parcours (Parcours, `GabaritParcours.css:208`); H1 de page formateur (Espace formateur (Mes cours, Mes groupes, Détail groupe, Détail cours), `Formateur.css:30`); « Bonjour [prénom] » (H1) (Dashboard formateur, admin, `DashboardFormateur.css:30`, taille écrite en dur, interligne reçu de `.espace-page h1`) |
| 20 px | 800 | 1.2 | 1 | H1 de l'en-tête mobile (Création de cours (< 1024), `CreationCours.css:52`) |
| 30 px | 800 | 1.1 | 1 | titre « Belle maîtrise ! » (Fin de quiz, `FicheCours.css:809`) |
| 34 px (taille reçue de `.espace-page h1`) | 800 | 1 | 1 | « Salut [Prénom] » (H1) (Dashboard apprenant, `Dashboard.css:21`, espacement des lettres -0,5 px) |

#### Titre de contenu (cours, thème, question) (rôle candidat) : **plusieurs valeurs**

6 occurrences, 5 combinaisons, 4 tailles. Combinaison la plus fréquente : **28 px · 800 · interligne 1.1** (2 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 28 px | 800 | 1.1 | 2 | nom du thème (H1) (Détail thème, `DetailTheme.css:75`); titre du cours (H1) (Fiche : leçon, récap, `FicheCours.css:222`) |
| 24 px | 800 | 1.15 | 1 | question (Fiche : quiz, Quiz flash, `FicheCours.css:432`) |
| 26 px | 800 | 1.05 | 1 | titre du bloc de tête (cours en cours / assigné) (Dashboard apprenant, `Dashboard.css:360`) |
| 34 px | 800 | 1 | 1 | « Quiz flash » du bloc de tête E (Dashboard apprenant, `Dashboard.css:440`) |
| 34 px | 800 | 1.1 | 1 | titre du cours (H1) : perd contre .espace-page h1 (Détail cours, `DetailCoursFormateur.css:25`) |

#### Titre de section (rôle candidat) : **plusieurs valeurs**

14 occurrences, 11 combinaisons, 9 tailles. Combinaison la plus fréquente : **16,8 px · 800 · interligne absente** (2 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 16,8 px | 800 | absente | 2 | h2 par défaut dans .espace-page (Pages avec navigation, `espace-layout.css:163`); titre Markdown niveau 3 (Contenu Markdown, `ContenuMarkdown.css:16`) |
| 20 px | 800 | absente | 2 | titre de carte de section (h2) (Espace formateur, `Formateur.css:54`); titre « Cours assignés » (Détail groupe, `DetailGroupe.css:78`) |
| 22 px | 800 | absente | 2 | titre « Activité récente » (Dashboard formateur, `DashboardFormateur.css:463`); titre de section (« Thèmes », « N résultats ») (Cours, `SectionCours.css:20`) |
| 14,4 px | 500* | absente | 1 | titre « Taux de complétion » (Dashboard formateur, `DashboardFormateur.css:220`) |
| 19,2 px | 800 | absente | 1 | titre Markdown niveau 2 (hors leçon) (Contenu Markdown, `ContenuMarkdown.css:15`) |
| 20 px | 800 | 1.2 | 1 | titre de carte (« Tes groupes »…) (Dashboard formateur, admin, `DashboardFormateur.css:102`) |
| 21 px | 800 | 1.2 | 1 | intertitre H2 de la leçon (Fiche : leçon, `FicheCours.css:266`) |
| 22 px | 800 | 1.2 | 1 | titre de carte de section (Infos, Leçon…) (Création de cours, `CreationCours.css:253`) |
| 22,4 px | 800 | absente | 1 | titre Markdown niveau 1 (Contenu Markdown, `ContenuMarkdown.css:14`) |
| 24 px | 800 | absente | 1 | titre de la carte (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:657`) |
| hérité | 800 | 1.25 | 1 | interligne des titres Markdown (Fiche : leçon, quiz, checklist, Détail cours, aperçu, `ContenuMarkdown.css:11`) |

#### Titre de carte ou de bloc (rôle candidat) : **plusieurs valeurs**

16 occurrences, 10 combinaisons, 7 tailles. Combinaison la plus fréquente : **17 px · 800 · interligne absente** (4 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 17 px | 800 | absente | 4 | titre de l'encadré « À retenir » (Détail cours, `DetailCoursFormateur.css:268`); titre de l'encadré « À retenir » (Fiche : leçon (et aperçu Création, où il est écrasé), `FicheCours.css:294`); intitulé de l'étape en cours (Fiche : checklist, `FicheCours.css:1205`); titre « Quiz flash » verrouillé (Dashboard apprenant, `Dashboard.css:547`) |
| 22 px | 800 | 1.1 | 3 | titre de la carte « Étape suivante » (Fiche : leçon, checklist, `FicheCours.css:351`); nom du badge débloqué (Fin de quiz, `FicheCours.css:886`); titre du cours suivant (Récap, `FicheCours.css:1346`) |
| 20 px | 800 | absente | 2 | titre du bloc de correction (« Bien vu ») (Fiche : quiz, Quiz flash, `FicheCours.css:654`); titre de la carte de profil (Parcours : Choix du profil, `Parcours.css:157`) |
| 15 px | 800 | 1.2 | 1 | titre de la carte de thème (Cours, `SectionCours.css:89`) |
| 18 px | 500* | absente | 1 | titre de la carte de cours (Mes cours, `FormateurListes.css:60`) |
| 18 px | 800 | absente | 1 | titre du bloc « De ton formateur » (Dashboard apprenant, Cours, `BlocFormateur.css:21`) |
| 19 px | 800 | absente | 1 | titre « Quiz flash » du bloc en ligne F (Dashboard apprenant, `Dashboard.css:477`) |
| 20 px | 500* | absente | 1 | nom de la carte de groupe (Mes groupes, `FormateurListes.css:88`) |
| 22 px | 800 | 1.05 | 1 | titre de carte blanche / lavande (Dashboard apprenant, `Dashboard.css:143`) |
| 28 px | 800 | 1.1 | 1 | « Plus qu'une étape, [Prénom] » (Parcours : Création du compte, `Parcours.css:192`) |

Variantes d'état (graisse seule, la taille vient de la règle de base) : titre du toast de complétion → 800 (`CompletionToast.css:30`); titre de carte (graisse, interligne) → 800 (`FormateurListes.css:54`).

#### Titre de ligne ou d'élément de liste (rôle candidat) : **plusieurs valeurs**

16 occurrences, 7 combinaisons, 3 tailles. Combinaison la plus fréquente : **15 px · 800 · interligne absente** (6 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 15 px | 800 | absente | 6 | énoncé de question (Détail cours, `DetailCoursFormateur.css:340`); titre du cours de l'en-tête compact (H1) (Fiche : checklist, `FicheCours.css:1041`); nom du badge (Dashboard apprenant : modale Mes badges, `Dashboard.css:1051`); titre du cours dans le tableau (Dashboard admin, `DashboardFormateur.css:819`); nom de l'élève (Détail groupe, `DetailGroupe.css:183`); énoncé de la question repliée (Création de cours, `CreationCours.css:623`) |
| 16 px | 800 | absente | 4 | question ratée (Fin de quiz : mes erreurs, `FicheCours.css:953`); titre de ligne (Leçon, Quiz, Checklist) (Récap, `FicheCours.css:1311`); « Personne à relancer » (Dashboard formateur, `DashboardFormateur.css:440`); « Question N » (h3) (Création de cours, `CreationCours.css:655`) |
| 15 px | 800 | 1.2 | 2 | titre de la ligne de cours (Terrain, recherche Cours, `LigneCours.css:47`); titre de cours de la ligne du bloc formateur (Dashboard apprenant, Cours, `BlocFormateur.css:93`) |
| 15 px | 800 | 1.25 | 1 | titre de la carte de cours assigné (Détail groupe, `DetailGroupe.css:120`) |
| 16 px | 800 | 1.2 | 1 | titre de la ligne de cours (Détail thème, `DetailTheme.css:136`) |
| 17 px | 800 | 1.2 | 1 | nom du groupe (Dashboard formateur, `DashboardFormateur.css:298`) |
| 17 px | 800 | absente | 1 | titre d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:722`) |

Variantes d'état (graisse seule, la taille vient de la règle de base) : en-tête de tableau → 800 (`ContenuMarkdown.css:111`).

#### Titre de modale ou de menu (rôle candidat) : **plusieurs valeurs**

3 occurrences, 3 combinaisons, 3 tailles. Combinaison la plus fréquente : **17 px · 800 · interligne absente** (1 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 17 px | 800 | absente | 1 | titre de la feuille du menu « … » (Espace formateur (mobile), `Formateur.css:285`) |
| 20,8 px | 800 | absente | 1 | titre « Mes badges » (Dashboard apprenant : modale Mes badges, `Dashboard.css:994`) |
| 24 px | 800 | absente | 1 | titre de modale (Espace formateur, Création de cours, `Formateur.css:357`) |

#### Corps de texte (rôle candidat) : **plusieurs valeurs**

17 occurrences, 13 combinaisons, 7 tailles. Combinaison la plus fréquente : **15 px · 500* · interligne 1.45** (2 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 14 px | 700 | absente | 2 | bonne réponse (Détail cours, `DetailCoursFormateur.css:353`); ligne « Ta réponse / Bonne réponse » (Fin de quiz : mes erreurs, `FicheCours.css:963`) |
| 15 px | 500* | 1.45 | 2 | texte courant (paragraphe) (Espace formateur, modale de confirmation, `Formateur.css:67`); explication de la correction (Fiche : quiz, Quiz flash, `FicheCours.css:662`) |
| 15 px | 500* | absente | 2 | consigne de remise en ordre (Fiche : checklist (remise en ordre), `FicheCours.css:1081`); ligne « Élèves à relancer » (Dashboard formateur, `DashboardFormateur.css:354`) |
| 15 px | 600 | absente | 2 | points de l'encadré « À retenir » (Détail cours, `DetailCoursFormateur.css:294`); intitulé d'étape de checklist (Détail cours, `DetailCoursFormateur.css:372`) |
| 13,6 px | 500* | absente | 1 | texte du toast de complétion (Partagé (fiche), `CompletionToast.css:15`) |
| 14 px | 500* | absente | 1 | explication (Fin de quiz : mes erreurs, `FicheCours.css:977`) |
| 15 px | 500 | 1.4 | 1 | texte de l'événement (Dashboard formateur, `DashboardFormateur.css:602`) |
| 15,2 px | 500* | absente | 1 | texte de tableau (Contenu Markdown, `ContenuMarkdown.css:95`) |
| 16 px | 500* | 1.55 | 1 | premier paragraphe de la leçon (Détail cours, `DetailCoursFormateur.css:212`) |
| 16 px | 600 | 1.35 | 1 | intitulé d'étape (Fiche : checklist, `FicheCours.css:1172`) |
| 16 px | 600 | 1.4 | 1 | points de l'encadré « À retenir » (Fiche : leçon, `FicheCours.css:321`) |
| 17 px | 500* | 1.55 | 1 | texte de la leçon (Fiche : leçon, aperçu Création, `FicheCours.css:253`) |
| hérité | 500* | 1.4 | 1 | texte de relance (Dashboard formateur, `DashboardFormateur.css:366`) |

Variantes d'état (graisse seule, la taille vient de la règle de base) : nom et cours en gras dans l'événement → 800 (`DashboardFormateur.css:608`); cellule d'en-tête de ligne du tableau → inherit (`DashboardFormateur.css:810`).

#### Sous-titre et texte secondaire (rôle candidat) : **plusieurs valeurs**

16 occurrences, 8 combinaisons, 5 tailles. Combinaison la plus fréquente : **14 px · 700 · interligne absente** (3 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 14 px | 600 | absente | 3 | phrase d'état (« Leçon lue. Reste le quiz ») (Dashboard apprenant, `Dashboard.css:388`); phrase du bloc de tête E (Dashboard apprenant, `Dashboard.css:449`); titre du cours tronqué sous le H1 (Création de cours (< 1024), `CreationCours.css:60`) |
| 14 px | 700 | absente | 3 | sous-titre de l'en-tête lavande (Cours, Terrain, `EntetePage.css:35`); « x cours terminés sur y » (Détail thème, `DetailTheme.css:88`); « N min de lecture » / « X XP gagnés » (Fiche : leçon, récap, `FicheCours.css:234`) |
| 15 px | 500* | absente | 3 | sous-titre de modale (Espace formateur, `Formateur.css:363`); texte d'état vide (Dashboard formateur, admin, `DashboardFormateur.css:144`); « Aucun cours ne correspond… » (Cours, `SectionCours.css:28`) |
| 15 px | 600 | absente | 3 | sous-titre sous le H1 (« N élèves · N cours ») (Espace formateur, `Formateur.css:37`); sous-titre « Une seule erreur à revoir. » (Fin de quiz, `FicheCours.css:816`); texte du bloc lavande (Parcours : Création du compte, `Parcours.css:199`) |
| 13,6 px | 500* | absente | 1 | texte d'état vide (Terrain, Détail thème, Détail groupe, `shared.css:512`) |
| 14,4 px | 500* | absente | 1 | phrase d'explication sous le H1 (Mot de passe oublié, `shared.css:119`) |
| 15 px | 700 | absente | 1 | « 3 cours · 1 groupe · 12 élèves » (Dashboard formateur, admin, `DashboardFormateur.css:36`) |
| 16 px | 500 | absente | 1 | sous-titre sous le H1 (Parcours, `GabaritParcours.css:215`) |

#### Méta (rôle candidat) : **plusieurs valeurs**

43 occurrences, 11 combinaisons, 4 tailles. Combinaison la plus fréquente : **13 px · 500* · interligne absente** (8 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 13 px | 500* | absente | 8 | méta de la ligne de cours (Terrain, recherche Cours, `LigneCours.css:54`); détail sous le libellé de case (Modale d'assignation, `Formateur.css:532`); contenu « Leçon · Quiz · Checklist » (Détail thème, `DetailTheme.css:143`); détail de ligne (« Meilleur score : 4/5 ») (Récap, `FicheCours.css:1316`); méta « 10 questions · +30 XP » (Dashboard apprenant, `Dashboard.css:482`); condition du badge (Dashboard apprenant : modale Mes badges, `Dashboard.css:1057`); précision « 30 derniers jours » (Dashboard admin, `DashboardFormateur.css:783`); thème court sous le titre (Dashboard admin, `DashboardFormateur.css:826`) |
| 14 px | 600 | absente | 8 | méta (« X terminés sur N »…) (Espace formateur, `Formateur.css:73`); légende de la barre d'avancement (Détail cours, `DetailCoursFormateur.css:96`); méta du cours assigné (« thème · ajouté hier ») (Dashboard apprenant, `Dashboard.css:426`); « N élèves · N cours » (Dashboard formateur, `DashboardFormateur.css:304`); libellé de carte chiffrée (Dashboard admin, `DashboardFormateur.css:771`); statut par cours dans la carte élève (Détail groupe (mobile), `DetailGroupe.css:242`); méta de carte (Mes cours, Mes groupes, `FormateurListes.css:64`); ligne « Cours terminés » (Mes groupes, `FormateurListes.css:101`) |
| 13 px | 600 | absente | 7 | libellé des petites cartes d'avancement (Détail cours, `DetailCoursFormateur.css:141`); sous-texte (thème, condition du badge) (Dashboard apprenant, `Dashboard.css:149`); consigne du quiz flash verrouillé (Dashboard apprenant, `Dashboard.css:552`); statut « Quiz 90 % / En cours » (Dashboard formateur, `DashboardFormateur.css:640`); résumé « 42 commencés · 18 terminés » (Dashboard admin (mobile), `DashboardFormateur.css:831`); compteur du sommaire (Création de cours (≥ 1024), `CreationCours.css:191`); méta « Réponse unique · 3 réponses » (Création de cours, `CreationCours.css:632`) |
| 14 px | 500* | absente | 6 | détail « N questions · +20 XP » (Fiche : leçon, checklist, `FicheCours.css:358`); condition du badge (Fin de quiz, `FicheCours.css:892`); critère de validation (Fiche : checklist, `FicheCours.css:1221`); contenu du cours suivant (Récap, `FicheCours.css:1352`); « Tous tes élèves ont commencé… » (Dashboard formateur, `DashboardFormateur.css:446`); sous-titre d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:727`) |
| 14 px | 700 | absente | 5 | compteur « N cours » du bloc formateur (Cours, `BlocFormateur.css:44`); texte du bandeau « Aperçu élève » (Aperçu élève, `FicheCours.css:104`); « +15 XP à la fin » (Fiche : checklist, `FicheCours.css:1067`); « N étapes sur 3 » (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:663`); nom d'image en étiquette (Création de cours, `CreationCours.css:519`) |
| 13 px | 700 | absente | 3 | « Actif aujourd'hui » (Dashboard formateur, `DashboardFormateur.css:311`); date « Il y a N jours » (Dashboard formateur, `DashboardFormateur.css:370`); compte « y cours » de la carte de thème (Cours, `SectionCours.css:105`) |
| 13 px | 500 | absente | 2 | email de l'élève (Détail groupe, `DetailGroupe.css:190`); sous-titre de mode de checklist (Création de cours (≥ 768), `CreationCours.css:901`) |
| 12 px | 500* | absente | 1 | sous-titre « Sur l'ensemble de tes groupes » (Dashboard formateur, `DashboardFormateur.css:225`) |
| 12 px | 700 | absente | 1 | « Obtenu le JJ/MM » (Dashboard apprenant : modale Mes badges, `Dashboard.css:1062`) |
| 14 px | 500 | 1.35 | 1 | description de la carte de profil (Parcours : Choix du profil, `Parcours.css:162`) |
| hérité | 500* | 1.2 | 1 | libellé d'étape (Leçon, Quiz · 4/5…) (Fiche : leçon, checklist, `ReperEtapes.css:67`) |

Variantes d'état (graisse seule, la taille vient de la règle de base) : libellé de l'étape en cours → 800 (`ReperEtapes.css:78`); libellé d'une étape faite → 700 (`ReperEtapes.css:89`); libellé d'une étape à venir → 600 (`ReperEtapes.css:108`); compte « x / y cours » commencé → 800 (`SectionCours.css:111`).

#### Surtitre (libellé court au-dessus d'un titre) (rôle candidat) : **plusieurs valeurs**

12 occurrences, 2 combinaisons, 2 tailles. Combinaison la plus fréquente : **13 px · 700 · interligne absente** (10 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 13 px | 700 | absente | 10 | surtitre « Thème N » (Détail thème, `DetailTheme.css:66`); thème au-dessus du titre (Fiche : leçon, récap, `FicheCours.css:215`); libellé « Étape suivante » de la carte encre (Fiche : leçon, checklist, `FicheCours.css:344`); libellé du cours au-dessus de la question (Fiche : quiz, Quiz flash, `FicheCours.css:426`); titre du cours dans la barre du haut (Fin de quiz, `FicheCours.css:718`); « Quiz terminé » (Fin de quiz, `FicheCours.css:763`); libellé « Suite du thème » (Récap, `FicheCours.css:1339`); libellé violet (« Ton premier cours »…) (Dashboard apprenant, `Dashboard.css:131`); libellé sur carte violette (« Tu en es là ») (Dashboard apprenant, `Dashboard.css:137`); intertitre de jour (« Aujourd'hui ») (Dashboard formateur, `DashboardFormateur.css:549`) |
| 12 px | 700 | absente | 2 | thème de l'en-tête compact (Fiche : checklist, `FicheCours.css:1033`); surtitre « Thème N » de la carte de thème (Cours, `SectionCours.css:82`) |

#### Libellé de bouton (rôle candidat) : **plusieurs valeurs**

18 occurrences, 7 combinaisons, 4 tailles. Combinaison la plus fréquente : **16 px · 800 · interligne absente** (6 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 16 px | 800 | absente | 6 | libellé du bouton rouge (Modale de confirmation, `Formateur.css:411`); libellé du bouton blanc (Fiche : leçon, checklist, `FicheCours.css:374`); libellé du bouton « Valider ma réponse » (Fiche : quiz, Quiz flash, `FicheCours.css:685`); libellé du bouton principal (Fin de quiz, `FicheCours.css:901`); libellé du bouton blanc à flèche (Dashboard apprenant, `Dashboard.css:222`); libellé du bouton large orange (Dashboard apprenant, `Dashboard.css:255`) |
| 16 px | 700 | absente | 4 | libellé du bouton principal (Partagé, `shared.css:200`); libellé du bouton secondaire (Partagé, `shared.css:230`); libellé du bouton orange (quiz flash) (Dashboard apprenant, `shared.css:255`); libellé du bouton du parcours (écrasé par .bouton-primaire / .bouton-secondaire) (Parcours, `GabaritParcours.css:86`) |
| 15 px | 800 | absente | 3 | libellé du bouton « Commencer » (Dashboard apprenant, `Dashboard.css:410`); libellé du bouton « Lancer » (Dashboard apprenant, `Dashboard.css:495`); carte pointillée « + Assigner un cours » (Détail groupe, `DetailGroupe.css:137`) |
| 14 px | 700 | absente | 2 | bouton d'outil « Image / Vidéo » (Création de cours, `CreationCours.css:438`); bouton « Image » d'étape (Création de cours, `CreationCours.css:1038`) |
| 13,6 px | 700 | absente | 1 | bouton pointillé « + Ajouter… » (Création de cours, `shared.css:380`) |
| 14 px | 500* | absente | 1 | libellé des boutons « Relire / Refaire / Revoir » (Récap, `FicheCours.css:1323`) |
| 15 px | 500* | absente | 1 | libellé du bouton d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:740`) |

#### Lien et bouton texte (rôle candidat) : **plusieurs valeurs**

21 occurrences, 7 combinaisons, 5 tailles. Combinaison la plus fréquente : **15 px · 800 · interligne absente** (10 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 15 px | 800 | absente | 10 | texte du lien Retour « ‹ Mes cours » (Espace formateur, `Formateur.css:161`); bouton texte « Supprimer ce groupe » (Détail groupe, `Formateur.css:433`); bouton Retour « Cours » (Détail thème, `DetailTheme.css:21`); bouton Retour (nom court du thème) (Fiche, `FicheCours.css:170`); lien « Revoir la leçon » (Fiche : quiz, Quiz flash, `FicheCours.css:673`); liens « Revoir mes erreurs »… (Fin de quiz, `FicheCours.css:919`); lien « Passer cette étape » (Fiche : checklist, `FicheCours.css:1153`); lien « Assigner » (Détail groupe, `DetailGroupe.css:87`); lien « Voir les N autres » (Détail groupe, `DetailGroupe.css:255`); liens « Voir comme un élève » / « Créer un groupe » (Création de cours, `CreationCours.css:208`) |
| 14 px | 800 | absente | 3 | bouton « Quitter l'aperçu » (Aperçu élève, `FicheCours.css:115`); lien « Tout voir » / « Mes badges · X/6 » (Dashboard apprenant, Cours, `Dashboard.css:166`); lien « Tout voir » (Dashboard formateur, admin, `DashboardFormateur.css:112`) |
| 16 px | 800 | absente | 3 | lien « Passer » (Parcours : Introduction, `GabaritParcours.css:135`); lien d'action « Annuler » (Modales, barre de Création de cours, `Formateur.css:397`); bouton Retour « Mes cours » (Création de cours (≥ 1024), `CreationCours.css:144`) |
| 13,6 px | 600 | absente | 2 | lien « ← Retour » (Mot de passe oublié, `shared.css:321`); lien secondaire (simuler le lien) (Mot de passe oublié, `shared.css:343`) |
| 15 px | 500* | absente | 1 | lien « Voir les N autres » / « Voir plus » (Dashboard formateur, `DashboardFormateur.css:128`) |
| 15 px | 700 | absente | 1 | lien sous le bouton (« Déjà un compte ? … ») (Parcours, `GabaritParcours.css:106`) |
| hérité | inherit | absente | 1 | liens « N cours » / « N groupes » dans le sous-titre (Dashboard formateur, `DashboardFormateur.css:45`) |

Variantes d'état (graisse seule, la taille vient de la règle de base) : lien dans le texte → 600 (`ContenuMarkdown.css:38`); partie en gras du lien sous le bouton → 800 (`GabaritParcours.css:115`).

#### Navigation, onglet, filtre, entrée de menu (rôle candidat) : **plusieurs valeurs**

7 occurrences, 5 combinaisons, 5 tailles. Combinaison la plus fréquente : **14 px · 700 · interligne absente** (2 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 14 px | 700 | absente | 2 | pastilles de filtre « Tout / Commencés / Terminés » (Dashboard formateur, `DashboardFormateur.css:494`); onglet « Écrire / Aperçu » (Création de cours, `CreationCours.css:409`) |
| 15 px | 700 | absente | 2 | pastille de section collante (Création de cours (< 1024), `CreationCours.css:94`); entrée du sommaire (Création de cours (≥ 1024), `CreationCours.css:181`) |
| 11,52 px | 700 | absente | 1 | libellé d'entrée de la tab bar (mobile) (Navigation, `espace-layout.css:48`) |
| 14,4 px | 600 | absente | 1 | entrée du menu (Se déconnecter) (Navigation, `espace-layout.css:123`) |
| 16 px | 700 | absente | 1 | action du menu « … » (Espace formateur, `Formateur.css:297`) |

Variantes d'état (graisse seule, la taille vient de la règle de base) : compteur dans la pastille → 600 (`CreationCours.css:103`).

#### Libellé de champ (rôle candidat) : **plusieurs valeurs**

5 occurrences, 4 combinaisons, 3 tailles. Combinaison la plus fréquente : **14,4 px · 500* · interligne absente** (2 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 14,4 px | 500* | absente | 2 | libellé de champ (.champ) (Partagé (modales, Détail groupe, Mes cours, mot de passe), `shared.css:126`); libellé de champ (Création de cours, `CreationCours.css:266`) |
| 14 px | 700 | absente | 1 | libellé « Bonne réponse » (Création de cours, `CreationCours.css:832`) |
| 14 px | 800 | absente | 1 | libellé de champ (Parcours, `GabaritParcours.css:228`) |
| 16 px | 700 | absente | 1 | libellé de case à cocher (Modale d'assignation, Création de cours, `Formateur.css:527`) |

Variantes d'état (graisse seule, la taille vient de la règle de base) : libellé « Bonne réponse » coché → 800 (`CreationCours.css:844`).

#### Saisie et choix de champ (rôle candidat) : **plusieurs valeurs**

18 occurrences, 12 combinaisons, 7 tailles. Combinaison la plus fréquente : **16 px · 400† · interligne absente** (4 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 16 px | 400† | absente | 4 | saisie de champ input (.champ) (Partagé, `shared.css:136`); saisie de champ textarea (.champ) (Partagé, `shared.css:148`); saisie de la recherche (Cours, `EntetePage.css:48`); valeur affichée de la liste déroulante (Création de cours, Mes cours, `Dropdown.css:12`) |
| 16 px | 600 | absente | 3 | saisie de champ (Parcours, `GabaritParcours.css:248`); texte de réponse (Fiche : quiz, Quiz flash, `FicheCours.css:467`); saisie de l'email d'ajout (Détail groupe, `DetailGroupe.css:46`) |
| 14 px | 400† | absente | 2 | saisie « Un élève » (Dashboard formateur, `DashboardFormateur.css:531`); saisie d'explication (Création de cours, `CreationCours.css:776`) |
| 15 px | 400† | absente | 1 | saisie de réponse / d'explication (Création de cours, `CreationCours.css:767`) |
| 15 px | 600 | absente | 1 | saisie de l'intitulé d'étape (Création de cours, `CreationCours.css:961`) |
| 15 px | 700 | absente | 1 | bouton de choix (groupe, mode de checklist) (Création de cours, `CreationCours.css:327`) |
| 15 px | 800 | absente | 1 | libellé de mode de checklist (Création de cours, `CreationCours.css:895`) |
| 15,2 px | 500* | absente | 1 | option de la liste déroulante (Création de cours, Mes cours, `Dropdown.css:61`) |
| 16 px | 400† | 1.55 | 1 | saisie de l'éditeur de leçon (Création de cours, `CreationCours.css:458`) |
| 17 px | 600 | absente | 1 | ligne de choix (statut, âge, motivation) (Parcours : questions, `GabaritParcours.css:296`) |
| 20 px | 700 | absente | 1 | saisie du grand champ (prénom, organisme…) (Parcours : questions, `GabaritParcours.css:269`) |
| hérité | 500* | 1.35 | 1 | interligne du titre et des intitulés d'étape (Création de cours, `CreationCours.css:288`) |

Variantes d'état (graisse seule, la taille vient de la règle de base) : ligne de choix sélectionnée → 700 (`GabaritParcours.css:322`); ligne de choix sélectionnée au survol → 700 (`GabaritParcours.css:329`); option choisie de la liste déroulante → 600 (`Dropdown.css:78`).

#### Aide, erreur et message (rôle candidat) : **plusieurs valeurs**

10 occurrences, 8 combinaisons, 3 tailles. Combinaison la plus fréquente : **14 px · 700 · interligne absente** (3 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 14 px | 700 | absente | 3 | message d'erreur (Parcours, `GabaritParcours.css:365`); « Plusieurs réponses possibles » (Fiche : quiz, Quiz flash, `FicheCours.css:445`); message de la barre d'enregistrement (Création de cours, `CreationCours.css:1075`) |
| 13 px | 500 | 1.4 | 1 | aide sous un champ (Création de cours, `CreationCours.css:272`) |
| 13 px | 500 | absente | 1 | note sous une carte (Dashboard formateur, `DashboardFormateur.css:133`) |
| 13 px | 600 | absente | 1 | aide sous un champ (mot de passe) (Parcours, `Parcours.css:17`) |
| 13 px | 700 | absente | 1 | confirmation d'envoi de relance (Dashboard formateur, `DashboardFormateur.css:376`) |
| 13,6 px | 500* | 1.4 | 1 | message d'erreur (.message) (Partagé, `shared.css:358`) |
| 13,6 px | 500* | absente | 1 | message de résultat de la remise en ordre (Fiche : checklist (remise en ordre), `quiz.css:85`) |
| 14 px | 500* | absente | 1 | note 14 px (Pour bien démarrer) (Dashboard formateur, `DashboardFormateur.css:139`) |

Variantes d'état (graisse seule, la taille vient de la règle de base) : message d'erreur → 700 (`CreationCours.css:279`); « Aucune modification » → 600 (`CreationCours.css:1081`).

#### Pastille (rôle candidat) : **plusieurs valeurs**

16 occurrences, 8 combinaisons, 5 tailles. Combinaison la plus fréquente : **12 px · 800 · interligne absente** (5 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 12 px | 800 | absente | 5 | pastille « Ta réponse » / « Bonne réponse » (Fiche : quiz, Quiz flash, `FicheCours.css:606`); pastille « Nouveau badge » (Fin de quiz, `FicheCours.css:881`); pastille « Bloquante » (Fiche : checklist, `FicheCours.css:1215`); pastille « De ton formateur » (Dashboard apprenant, `Dashboard.css:191`); pastille orange « Défi du jour » (Dashboard apprenant, `Dashboard.css:206`) |
| 12 px | 700 | absente | 3 | pastille de statut (Nouveau, À faire, Non commencé) (Partagé (Cours, Dashboard, Détail groupe…), `espace-layout.css:252`); pastille « À surveiller / Bon rythme » (Dashboard formateur, `DashboardFormateur.css:236`); pastille du groupe (Dashboard formateur, `DashboardFormateur.css:626`) |
| 13 px | 800 | absente | 2 | pastille de statut En cours / Terminé (Partagé, `espace-layout.css:275`); pastille « Compte officiel » (Dashboard admin, `DashboardFormateur.css:63`) |
| 14 px | 700 | absente | 2 | pastille « Compte officiel : ce cours sera public » (Création de cours, `CreationCours.css:236`); pilule « Bloquante » (Création de cours, `CreationCours.css:1013`) |
| 12,8 px | 700 | absente | 1 | nom du badge dans le toast (Partagé (fiche), `CompletionToast.css:48`) |
| 13 px | 700 | absente | 1 | pastille de groupe / « Non assigné » (Espace formateur, `Formateur.css:178`) |
| 14 px | 800 | absente | 1 | « X XP gagnés » (pastille Terminé) (Récap, `FicheCours.css:1276`) |
| 16 px | 800 | absente | 1 | pastille « +20 XP » (Fin de quiz, `FicheCours.css:830`) |

#### Chiffre mis en avant (rôle candidat) : **plusieurs valeurs**

7 occurrences, 5 combinaisons, 5 tailles. Combinaison la plus fréquente : **28 px · 800 · interligne 1** (2 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 17 px | 800 | absente | 2 | « [N] XP » de l'en-tête (Dashboard apprenant, `Dashboard.css:30`); pourcentage dans l'anneau (Dashboard apprenant, `Dashboard.css:382`) |
| 28 px | 800 | 1 | 2 | chiffre des petites cartes d'avancement (Détail cours, `DetailCoursFormateur.css:130`); taux de complétion (chiffre) (Dashboard formateur, `DashboardFormateur.css:206`) |
| 20 px | 800 | absente | 1 | « X étapes sur N » (Fiche : checklist, `FicheCours.css:1062`) |
| 36 px | 800 | 1.1 | 1 | chiffre de carte (Dashboard admin, `DashboardFormateur.css:777`) |
| 48 px | 800 | 1 | 1 | score « 4/5 » dans l'anneau (Fin de quiz, `FicheCours.css:795`) |

#### Compteur et chiffre de progression (rôle candidat) : **plusieurs valeurs**

7 occurrences, 5 combinaisons, 4 tailles. Combinaison la plus fréquente : **15 px · 800 · interligne absente** (2 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 14 px | 800 | absente | 2 | compteur de barre « X / 3 » (Dashboard apprenant, `Dashboard.css:318`); % de la barre du groupe (Dashboard formateur, `DashboardFormateur.css:330`) |
| 15 px | 800 | absente | 2 | compteur « 3 / 5 » (Fiche : quiz, Quiz flash, `FicheCours.css:413`); compteur « X/6 » (Dashboard apprenant : modale Mes badges, `Dashboard.css:1001`) |
| 12 px | 500* | absente | 1 | compteur de barre, petite variante (Dashboard apprenant, `Dashboard.css:323`) |
| 15 px | 700 | absente | 1 | « 80 % » sous le score (Fin de quiz, `FicheCours.css:801`) |
| 18 px | 800 | absente | 1 | compteur « 2 / 5 » (Parcours : questions, `GabaritParcours.css:195`) |

Variantes d'état (graisse seule, la taille vient de la règle de base) : « +15 XP » du toast → 700 (`CompletionToast.css:39`); % en gras → 800 (`FormateurListes.css:107`).

#### Numéro dans une pastille ronde (rôle candidat) : **plusieurs valeurs**

6 occurrences, 4 combinaisons, 4 tailles. Combinaison la plus fréquente : **13 px · 800 · interligne absente** (3 occurrences).

| Taille rendue | Graisse | Hauteur de ligne | Occurrences | Éléments (écran) |
|---|---|---|---|---|
| 13 px | 800 | absente | 3 | numéro dans la pastille d'étape (Fiche : leçon, checklist, `ReperEtapes.css:56`); numéro de question (Détail cours, `DetailCoursFormateur.css:328`); numéro dans la pastille d'étape (Fiche : checklist, `FicheCours.css:1109`) |
| 14 px | 800 | absente | 1 | numéro de question / d'étape (Création de cours, `CreationCours.css:575`) |
| 15 px | 800 | absente | 1 | lettre de réponse (Création de cours, `CreationCours.css:751`) |
| 16 px | 800 | absente | 1 | numéro dans le rond (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:695`) |

### 3.3 À trancher : éléments qui relèvent de deux rôles

| Élément (écran) | Sélecteur | Lecture 1 | Lecture 2 |
|---|---|---|---|
| Titre de fin de quiz « Belle maîtrise ! » (Fin de quiz) | `.fin-quiz-titre` (h1, 30 px) | Titre de page | Titre de carte (il titre le bloc du score) |
| « Plus qu'une étape, [Prénom] » (Création du compte) | `.compte-bloc-titre` (h1, 28 px) | Titre de carte (bloc lavande) | Titre de page (c'est le seul h1 de l'écran) |
| Question du quiz (Quiz, Quiz flash) | `.fiche-quiz-question` (24 px) | Titre de contenu | Corps (texte lu, pas un titre) |
| Titre du cours dans l'en-tête compact (Checklist) | `.fiche-checklist-titre` (h1, 15 px) | Titre de ligne | Titre de contenu (titre du cours, comme en leçon) |
| Titre du bloc de tête (Dashboard apprenant) | `.dash-titre-tete` (26 / 32 px) | Titre de contenu (titre de cours) | Titre de carte |
| « Quiz flash » du bloc de tête E (Dashboard apprenant) | `.dash-flash-tete-titre` (34 px) | Titre de contenu | Titre de carte |
| Titres de carte de l'espace formateur (« Tes groupes », « Élèves »…) | `.fm-carte h2`, `.fd-carte-entete h2` (20 px) | Titre de section | Titre de carte |
| « Taux de complétion » (Dashboard formateur) | `.formateur-taux-label` (14,4 px, 500) | Titre de section (titre de la carte) | Méta (rendu comme un libellé) |
| Intertitre de jour « Aujourd'hui » (Activité récente) | `.fd-jour-titre` (h3, 13 px 700) | Surtitre | Titre de section |
| Nom de la carte de thème (Cours) | `.theme-carte-titre` | Titre de carte | Titre de ligne |
| « X étapes sur N » (Checklist) | `.fiche-checklist-compte` (20 px 800) | Chiffre mis en avant | Titre de carte |
| Intitulé de l'étape en cours (Checklist) | `.fiche-etape-courante .fiche-etape-intitule` (17 px 800) | Titre de carte | Corps (même texte que les autres étapes, en plus gros) |
| Ligne de choix du parcours, réponse du quiz, bouton de choix de Création | `.parcours-choix-ligne`, `.fiche-reponse`, `.cc-choix` | Saisie et choix de champ | Libellé de bouton |
| Pastilles de filtre « Tout / Commencés / Terminés » | `.fd-filtre` | Navigation, filtre | Pastille |
| Carte pointillée « + Assigner un cours » (Détail groupe) | `.dg-cours-ajout` | Libellé de bouton | Lien et bouton texte |
| Texte d'un événement (Activité récente) | `.fd-evenement-texte` | Corps | Titre de ligne (nom et cours en 800) |
| Libellé de case dans la modale d'assignation | `.fm-case-libelle` | Libellé de champ | Titre de ligne |
| « N min de lecture » (Leçon) | `.fiche-entete-sous-titre` | Sous-titre | Méta |
| Notes sous les cartes du dashboard formateur | `.fd-note`, `.fd-note-14` | Aide | Méta |
| Texte d'état vide | `.dashboard-etat-vide`, `.fd-vide`, `.page-cours-aucun-resultat` | Sous-titre et texte secondaire | Aide et message |

## 4. Éléments hors rôle

### 4.1 Éléments utilisés qui n'entrent dans aucun rôle

| Élément (écran) | Fichier et ligne | Écrit | Rendu |
|---|---|---|---|
| Croix « × » de fermeture de la modale Mes badges (Dashboard apprenant) | `shared.css:458` | `1.4rem`, interligne 1, pas de famille ni de graisse | 22,4 px, **Arial** 400 (bouton : la famille n'est pas déclarée) |
| Flèches ↑ ↓ de la remise en ordre (Checklist) | `FicheCours.css:1245` | `1rem`, pas de famille ni de graisse | 16 px, **Arial** 400 (même raison) |
| « +N » sur la dernière miniature (Détail cours) | `DetailCoursFormateur.css:246` | 16px, 800 | 16 px 800 |
| Initiales sur rond lavande (Activité récente) | `DashboardFormateur.css:596` | 14px, 800 | 14 px 800 |
| Flèche de tri ▲ ▼ du tableau des élèves (Détail groupe, ≥ 768) | `DetailGroupe.css:376` | 10px | 10 px, la plus petite taille de l'app |
| Bouton de tri XP / Badges (Détail groupe, ≥ 768) | `DetailGroupe.css:370` | `font: inherit` | reprend la cellule d'en-tête : 13 px 800 |
| Liens « N cours » / « N groupes » du sous-titre (Dashboard formateur) | `DashboardFormateur.css:45` | `font: inherit` | reprend le sous-titre : 15 px 700 |

Les règles posées sur un conteneur (bouton qui englobe une ligne, une carte…) ne fixent souvent que la famille. Leurs enfants portent la taille et la graisse. Elles sont listées en annexe A avec le rôle « Conteneur ».

### 4.2 CSS non utilisé (relevé à part, hors comptes par rôle)

Aucune classe de ces règles n'apparaît dans le JSX d'origin/main.

| Fichier et ligne | Sélecteur | Valeurs |
|---|---|---|
| `styles/espace-layout.css:205` | `.espace-liste-item` | taille 0.95rem, graisse 600 |
| `styles/espace-layout.css:234` | `.espace-liste-item-chevron` | taille 1.3rem, interligne 1 |
| `styles/shared.css:45` | `.dashboard-groupe-form input` | taille 0.9rem |
| `styles/shared.css:424` | `.modal-carte h2` | taille 1.3rem, graisse 800 |
| `styles/shared.css:484` | `.detail-section h2` | taille 1.1rem, graisse 800 |
| `styles/shared.css:497` | `.dashboard-deconnexion` | taille 0.8rem, graisse 700 |
| `styles/shared.css:529` | `.dashboard-liste` | taille 0.9rem |
| `styles/quiz.css:3` | `.quiz-enonce` | taille 1rem, graisse 600 |
| `styles/quiz.css:26` | `.quiz-option` | taille 0.9rem |
| `styles/quiz.css:107` | `.quiz-explication` | taille 0.8rem |
| `styles/quiz.css:114` | `.quiz-resume` | taille 0.9rem |

### 4.3 Page /design-system (hors relevé principal)

La page n'existe pas sur origin/main : elle a été ajoutée sur `design-system` (commit `2bb7f9d`). Éléments à parcourir lors d'un prochain relevé :

- `src/pages/DesignSystem.jsx` et `src/pages/DesignSystem.css` (graisses 800 sur `.ds-nom`, `.ds-echantillon-texte`, `.ds-regles-titre`, `.ds-anneau-valeur` ; `font-size: smaller` sur `.ds-meta`, seule taille relative au parent de tout le dépôt) ;
- `src/lib/designSystemDonnees.js` (données affichées par la page) ;
- les échantillons rendus par la page (`<h1>`, `<h3>` de rubrique, mesure `fontSize · fontWeight` calculée par le navigateur).

## 5. Incohérences

### 5.1 px et rem mélangés

Sur 293 déclarations de taille utilisées, 36 sont en rem, 250 en px et 7 passent par une variable (elle-même en px). Les rem se concentrent dans les fichiers les plus anciens : `shared.css` (13), `espace-layout.css` (5), `ContenuMarkdown.css` (4), `Dropdown.css` (2), `CompletionToast.css` (2), `EntetePage.css` (1), le haut de `DashboardFormateur.css` (5, carte du taux de complétion), `Dashboard.css` (1, titre de la modale Mes badges), `FicheCours.css` (1), `CreationCours.css` (1), `quiz.css` (1). Conséquences :

- valeurs non entières une fois rendues : 11,52 px (`0.72rem`, tab bar), 12,8 px, 13,6 px, 14,4 px, 15,2 px, 16,8 px, 19,2 px, 20,8 px, 22,4 px ;
- un même rôle mélange les deux unités sur un même écran : la carte « Taux de complétion » (rem) voisine les autres cartes du dashboard formateur (px) ; les libellés de champ `.champ` (0.9rem = 14,4 px) côtoient `.parcours-champ-libelle` (14px) ; les boutons partagés (1rem) et les boutons des pages (15px, 16px) ;
- si l'utilisateur agrandit la taille de texte du navigateur, seules les parties en rem grossissent.

### 5.2 Graisse ou style demandés mais non chargés

Graisses chargées : 400, 500, 600, 700, 800. Style chargé : normal.

| Cas | Où | Rendu (vérifié dans Chromium) |
|---|---|---|
| Graisse 900 demandée par `strong` / `b` (`bolder`) dans un parent à 600 ou plus | Markdown `**…**` dans `.fiche-quiz-question` (800), `.fiche-etape-intitule` (600), `.dc-enonce` (800), `.dc-etape-intitule` (600), `.fin-quiz-erreur-question` (800) | 900 calculée, affichée en 800 (même largeur de texte). Pas de faux gras, mais aucune différence visible entre le gras et le texte autour quand le parent est déjà à 800. |
| Italique demandée par `em` / `i` (Markdown `*…*`) | Partout où `ContenuMarkdown` affiche du texte : leçon, aperçu de Création, énoncés, intitulés d'étape, Détail cours | **italique de synthèse** (oblique calculée par le navigateur), aucune Urbanist Italic chargée |
| Graisse 700 sur `h4`, `h5`, `h6` et `th` sans règle | Markdown, tableaux | 700 chargée, pas de synthèse ; seulement hors du système de graisses déclaré (voir 1.4) |

Aucune règle CSS ne demande une graisse au-dessus de 800 ou en dessous de 400.

### 5.3 Valeur écrite écrasée : le rendu diffère de l'écrit

| Élément (écran) | Écrit | Rendu | Cause |
|---|---|---|---|
| Boutons du parcours « Continuer », « Créer mon compte », « J'ai déjà un compte », « Se connecter » | `.parcours-bouton` 17px 800 (`GabaritParcours.css:86`) | **16 px 700** | `.bouton-primaire` / `.bouton-secondaire` (1rem, 700), de même spécificité, viennent après dans le CSS de prod |
| Titre du cours (Détail cours) | `.dc-titre` 28px, 32px ≥ 768 (`DetailCoursFormateur.css:25, 389`) | **34 px, 44 px ≥ 768** | `.espace-page h1` (`--taille-h1`) est plus spécifique (classe + élément contre classe seule) |
| Titre « À retenir » dans l'aperçu de Création de cours | `.fiche-retenir-entete h2` 17px (`FicheCours.css:294`) | **22 px**, interligne 1,2 | `.cc-carte h2` (`CreationCours.css:253`), même spécificité, vient après. Dans la fiche apprenant, le titre fait bien 17 px. |

### 5.4 Contrôles de formulaire qui prennent les valeurs du navigateur

Graisse non déclarée, donc **400** (le navigateur n'applique pas l'héritage aux contrôles) alors que le texte autour est à 500 ou plus : saisie `.champ input` et `.champ textarea` (modales, Détail groupe, Mes cours, mot de passe), recherche de la page Cours (`.entete-page-recherche`), recherche « Un élève » (`.fd-recherche input`), éditeur de leçon (`.cc-editeur-texte`), saisie des réponses et explications de Création de cours (`.cc-reponse-texte`, `.cc-reponse-explication`), valeur de la liste déroulante (`.dropdown-trigger`). Les saisies du parcours (`.parcours-input`, 600), de l'ajout d'élève (`.dg-ajout-champ input`, 600) et des intitulés d'étape (`.cc-etape-intitule`, 600) déclarent leur graisse.

Famille non déclarée, donc **Arial** : la croix « × » de la modale Mes badges et les flèches de la remise en ordre (voir 4.1). Hauteur de ligne : aucun contrôle ne la déclare, sauf `.cc-editeur-texte` (1,55) et les champs multilignes de Création (1,35) ; les autres prennent `normal`.

### 5.5 Valeurs qui ne diffèrent que de 1 px (ou moins) dans un même rôle candidat

Tailles rendues des règles de base. Paires voisines à 1 px ou moins d'écart.

| Rôle candidat | Paires voisines | Toutes les tailles du rôle |
|---|---|---|
| Titre de section | 19,2 / 20 px ; 20 / 21 px ; 21 / 22 px ; 22 / 22,4 px | 14,4 px, 16,8 px, 19,2 px, 20 px, 21 px, 22 px, 22,4 px, 24 px |
| Titre de carte ou de bloc | 17 / 18 px ; 18 / 19 px ; 19 / 20 px | 15 px, 17 px, 18 px, 19 px, 20 px, 22 px, 28 px |
| Titre de ligne ou d'élément de liste | 15 / 16 px ; 16 / 17 px | 15 px, 16 px, 17 px |
| Corps de texte | 13,6 / 14 px ; 14 / 15 px ; 15 / 15,2 px ; 15,2 / 16 px ; 16 / 17 px | 13,6 px, 14 px, 15 px, 15,2 px, 16 px, 17 px |
| Sous-titre et texte secondaire | 13,6 / 14 px ; 14 / 14,4 px ; 14,4 / 15 px ; 15 / 16 px | 13,6 px, 14 px, 14,4 px, 15 px, 16 px |
| Méta | 12 / 13 px ; 13 / 14 px | 12 px, 13 px, 14 px |
| Surtitre (libellé court au-dessus d'un titre) | 12 / 13 px | 12 px, 13 px |
| Libellé de bouton | 13,6 / 14 px ; 14 / 15 px ; 15 / 16 px | 13,6 px, 14 px, 15 px, 16 px |
| Lien et bouton texte | 13,6 / 14 px ; 14 / 15 px ; 15 / 16 px | 13,6 px, 14 px, 15 px, 16 px |
| Navigation, onglet, filtre, entrée de menu | 14 / 14,4 px ; 14,4 / 15 px ; 15 / 16 px | 11,52 px, 14 px, 14,4 px, 15 px, 16 px |
| Libellé de champ | 14 / 14,4 px | 14 px, 14,4 px, 16 px |
| Saisie et choix de champ | 14 / 15 px ; 15 / 15,2 px ; 15,2 / 16 px ; 16 / 17 px | 14 px, 15 px, 15,2 px, 16 px, 17 px, 20 px |
| Aide, erreur et message | 13 / 13,6 px ; 13,6 / 14 px | 13 px, 13,6 px, 14 px |
| Pastille | 12 / 12,8 px ; 12,8 / 13 px ; 13 / 14 px | 12 px, 12,8 px, 13 px, 14 px, 16 px |
| Compteur et chiffre de progression | 14 / 15 px | 12 px, 14 px, 15 px, 18 px |
| Numéro dans une pastille ronde | 13 / 14 px ; 14 / 15 px ; 15 / 16 px | 13 px, 14 px, 15 px, 16 px |

Exemples concrets sur un même écran :

- Dashboard apprenant : titre de carte blanche 22 px (`.dash-titre-carte`), « Quiz flash » en ligne 19 px, verrouillé 17 px, titre du bloc de tête 26 px.
- Fiche : texte de la leçon 17 px, points « À retenir » 16 px, intitulé d'étape 16 px, étape en cours 17 px.
- Dashboard formateur : titre de carte 20 px, « Activité récente » 22 px, « Pour bien démarrer » 24 px, titre de section par défaut `.espace-page h2` 16,8 px.
- Espace formateur : texte courant 15 px (`.fm-texte`) et méta 14 px (`.fm-meta`), titre de ligne 15 px (`.dg-eleve-nom`) et 17 px (`.fd-groupe-nom`).
- Liens texte : 13,6 px (`.lien-retour`), 14 px (`.dash-lien`, `.fd-lien`), 15 px (`.fin-quiz-lien`, `.dg-voir-plus`…), 16 px (`.fm-lien-action`, `.cc-retour`).

### 5.6 Hauteur de ligne absente

- 223 règles de base sur 265 qui fixent une taille n'ont pas de hauteur de ligne (`normal` = 1,2).
- Titres sans hauteur de ligne déclarée : `.espace-page h2`, `.fm-carte h2`, `.fm-modale-titres h2`, `.dg-cours-entete h2`, `.fd-activite-entete h2`, `.fd-demarrage h2`, `.page-cours-h2`, `.dash-modale-badges-entete h2`, `.fiche-feedback-titre`, `.profil-carte-titre`, `.fiche-checklist-titre`, `.fd-etape-titre`. Les autres titres utilisent 1, 1,05, 1,1, 1,15 ou 1,2.
- Textes de plusieurs lignes sans hauteur de ligne déclarée : explication de fin de quiz (`.fin-quiz-erreur-explication`), critère de validation (`.fiche-etape-critere`), condition de badge (`.fin-quiz-badge-condition`, `.dash-modale-badge-condition`), description de la carte « Étape suivante » (`.fiche-suivante-detail`), sous-titre de modale (`.fm-modale-titres p`), texte d'état vide.
- Dix valeurs de hauteur de ligne différentes : 1, 1,05, 1,1, 1,15, 1,2, 1,25, 1,35, 1,4, 1,45, 1,55. Le corps de texte en utilise quatre : 1,4, 1,45, 1,55 et `normal`.

### 5.7 Autres constats

- Espacement des lettres : 3 déclarations seulement, toutes sur des titres du dashboard apprenant (`-0.5px` sur « Salut » et « Quiz flash », `-0.8px` sur « Salut » à partir de 768 px). Les autres H1 (34 / 44 px) n'en ont pas.
- `text-transform` et `font-style` : aucune déclaration. Aucun texte en majuscules forcées.
- `--font-display` et `--font-body` pointent sur la même police : la distinction n'a pas d'effet visible.
- `--taille-h1` n'est pas utilisée par tous les H1 de page : `.cc-entete-desktop h1` écrit `44px` en dur (≥ 1024), `.fd-titres h1` écrit `34px` en dur sur mobile puis la variable à partir de 768 px, `.cc-entete-mobile h1` écrit `20px`.
- Seuils de largeur : la typographie change à 768 px partout, à 1024 px dans Création de cours, et sous 400 px pour un seul élément (taux de complétion, `max-width: 399px`).

## 6. Desktop et mobile

Les règles de base valent pour le mobile. Ce tableau liste toutes les variations de taille, de graisse, de hauteur de ligne ou d'espacement des lettres selon la largeur. Il n'y a aucun `clamp()` ni aucune unité liée à la fenêtre (`vw`) pour le texte.

| Rôle candidat | Élément (écran) | Sélecteur | Base (mobile) | Changement | Seuil |
|---|---|---|---|---|---|
| Titre de page | « Salut [Prénom] » (≥ 768) (Dashboard apprenant) | `.dash-entete h1` | lettres -0,5 px | lettres -0,8 px | `(min-width: 768px)` |
| Titre de page | « Bonjour » (≥ 768) (Dashboard formateur, admin) | `.espace-page .fd-titres h1` | 34 px | 44 px | `(min-width: 768px)` |
| Titre de page | H1 de l'en-tête desktop (Création de cours (≥ 1024)) | `.cc-entete-desktop h1` | en-tête mobile à la place : `.cc-entete-mobile h1` 20 px 800 1,2 | 44 px · graisse 800 · interligne 1.1 | `(min-width: 1024px)` |
| Titre de contenu (cours, thème, question) | nom du thème (H1, ≥ 768) (Détail thème) | `.espace-page .theme-entete-titre` | 28 px | 32 px | `(min-width: 768px)` |
| Titre de contenu (cours, thème, question) | titre du cours (H1, ≥ 768) : perd contre .espace-page h1 (Détail cours) | `.dc-titre` | 34 px | 44 px | `(min-width: 768px)` |
| Titre de contenu (cours, thème, question) | titre du bloc de tête (≥ 768) (Dashboard apprenant) | `.dash-page .dash-titre-tete` | 26 px · interligne 1.05 | 32 px · interligne 1.1 | `(min-width: 768px)` |
| Titre de section | intertitre H2 de la leçon (≥ 768) (Fiche : leçon) | `.fiche-lecon-contenu.contenu-markdown h2` | 21 px | 24 px | `(min-width: 768px)` |
| Titre de section | titre de section (≥ 768) (Cours) | `.espace-page .page-cours-h2` | 22 px | 28 px | `(min-width: 768px)` |
| Titre de carte ou de bloc | « Quiz flash » vertical en colonne étroite (≥ 768) (Dashboard apprenant) | `.dash-page .dash-cellule-cote .dash-flash-ligne-texte h2` | ? · interligne absente | 28 px · interligne 1 | `(min-width: 768px)` |
| Titre de carte ou de bloc | titre de la carte de thème (≥ 768) (Cours) | `.theme-carte-titre` | 15 px | 18 px | `(min-width: 768px)` |
| Titre de carte ou de bloc | nom de la carte de groupe (≥ 768) (Mes groupes) | `.fl-carte-titre-groupe` | 20 px | 22 px | `(min-width: 768px)` |
| Titre de ligne ou d'élément de liste | titre de la ligne de cours (≥ 768) (Terrain, recherche Cours) | `.ligne-cours-titre` | 15 px | 16 px | `(min-width: 768px)` |
| Corps de texte | texte de la leçon (≥ 768) (Fiche : leçon) | `.fiche-lecon-contenu` | 17 px | 18 px | `(min-width: 768px)` |
| Corps de texte | cellules chiffrées du tableau (≥ 768) (Dashboard admin) | `.fd-tableau td` | ? · hérité | 15 px · graisse 700 | `(min-width: 768px)` |
| Corps de texte | texte du tableau des élèves (≥ 768) (Détail groupe) | `.dg-table` | ? | 15 px | `(min-width: 768px)` |
| Corps de texte | cellules du tableau (≥ 768) (Détail groupe) | `.dg-table td` | hérité | graisse 600 | `(min-width: 768px)` |
| Sous-titre et texte secondaire | sous-titre de l'en-tête lavande (≥ 768) (Cours, Terrain) | `.entete-page-sous-titre` | 14 px | 16 px | `(min-width: 768px)` |
| Sous-titre et texte secondaire | phrase d'état (≥ 768) (Dashboard apprenant) | `.dash-en-cours-phrase` | 14 px | 15 px | `(min-width: 768px)` |
| Sous-titre et texte secondaire | phrase du quiz flash vertical (≥ 768) (Dashboard apprenant) | `.dash-cellule-cote .dash-flash-ligne-phrase` | ? · hérité | 15 px · graisse 600 | `(min-width: 768px)` |
| Méta | en-têtes de colonne du tableau (≥ 768) (Dashboard admin) | `.fd-tableau thead th` | ? · hérité | 13 px · graisse 700 | `(min-width: 768px)` |
| Méta | en-têtes de colonne (≥ 768) (Détail groupe) | `.dg-table th` | ? · hérité | 13 px · graisse 800 | `(min-width: 768px)` |
| Méta | bouton de tri XP / Badges (≥ 768) (Détail groupe) | `.dg-tri` | ? · hérité | inherit · graisse inherit · famille inherit | `(min-width: 768px)` |
| Méta | compte de la carte de thème (≥ 768) (Cours) | `.theme-carte-compte` | 13 px | 14 px | `(min-width: 768px)` |
| Surtitre (libellé court au-dessus d'un titre) | libellé sur carte violette (≥ 768) (Dashboard apprenant) | `.dash-libelle-sur-violet` | 13 px | 15 px | `(min-width: 768px)` |
| Surtitre (libellé court au-dessus d'un titre) | surtitre « Thème N » (≥ 768) (Cours) | `.theme-carte-numero` | 12 px | 13 px | `(min-width: 768px)` |
| Libellé de bouton | libellé du bouton « Lancer » vertical (≥ 768) (Dashboard apprenant) | `.dash-cellule-cote .dash-flash-ligne-bouton` | ? | 16 px | `(min-width: 768px)` |
| Navigation, onglet, filtre, entrée de menu | libellé d'entrée de la barre horizontale (≥ 768) (Navigation) | `.espace-nav-item` | 11,52 px | 14,4 px | `(min-width: 768px)` |
| Chiffre mis en avant | « [N] XP » (≥ 768) (Dashboard apprenant) | `.dash-xp` | 17 px | 20 px | `(min-width: 768px)` |
| Chiffre mis en avant | pourcentage dans l'anneau (≥ 768) (Dashboard apprenant) | `.dash-anneau-valeur` | 17 px | 26 px | `(min-width: 768px)` |
| Chiffre mis en avant | taux de complétion (< 400 px) (Dashboard formateur) | `.formateur-taux-valeur` | 28 px | 20,8 px | `(max-width: 399px)` |
| Hors rôle | flèche de tri (≥ 768) (Détail groupe) | `.dg-tri span` | ? | 10 px | `(min-width: 768px)` |
| Titre de page | tous les H1 qui utilisent `--taille-h1` (.espace-page h1, .flow-card h1, .fm-titres h1, .parcours-titre, Dashboard formateur ≥ 768) | `:root` (shared.css:26) | 34 px | 44 px | `(min-width: 768px)` |
| Titre de contenu | titres qui utilisent `--taille-titre-cours` (fiche, bloc de tête du dashboard ≥ 768) | `:root` (shared.css:26) | 28 px | 32 px | `(min-width: 768px)` |

Par rôle candidat :

- **Titre de page** : 34 → 44 px à 768 (variable `--taille-h1`). Création de cours : 20 px sous 1024, 44 px en dur au-delà. « Salut » : espacement des lettres -0,5 → -0,8 px.
- **Titre de contenu** : fiche 28 → 32 px (variable) ; Détail thème 28 → 32 px (en dur) ; bloc de tête du dashboard 26 → 32 px ; Détail cours, voir 5.3.
- **Titre de section** : `.page-cours-h2` 22 → 28 px ; intertitre de la leçon 21 → 24 px ; les titres de carte formateur ne changent pas.
- **Titre de carte** : carte de thème 15 → 18 px ; carte de groupe (Mes groupes) 20 → 22 px ; « Quiz flash » en colonne étroite 19 → 28 px.
- **Titre de ligne** : ligne de cours (Terrain, recherche) 15 → 16 px. Les autres ne changent pas.
- **Corps** : texte de la leçon 17 → 18 px ; tableau des élèves 15 px et tableau admin 15 px 700 n'existent qu'à partir de 768 px (cartes empilées sur mobile).
- **Sous-titre** : sous-titre de l'en-tête lavande 14 → 16 px ; phrase d'état du dashboard 14 → 15 px.
- **Méta** : compte de la carte de thème 13 → 14 px. Les en-têtes de colonne (13 px) n'existent que sur desktop.
- **Surtitre** : « Thème N » 12 → 13 px ; « Tu en es là » 13 → 15 px.
- **Libellé de bouton** : seul « Lancer » du quiz flash vertical passe de 15 à 16 px.
- **Navigation** : tab bar 11,52 px (mobile) → barre horizontale 14,4 px.
- **Chiffre mis en avant** : XP de l'en-tête 17 → 20 px ; pourcentage de l'anneau 17 → 26 px ; taux de complétion 28 px réduit à 20,8 px sous 400 px.
- **Libellé de champ, saisie, aide, pastille, compteur, numéro** : aucun changement selon la largeur.

## 7. Différences entre origin/main et design-system

Comparaison déclaration par déclaration de toutes les propriétés relevées, entre `origin/main` (`a6d20f6`) et `design-system` (`3b505c4`). Les autres modifications de CSS entre les deux branches (focus, état désactivé, marges) ne touchent pas la typographie.

| Élément | origin/main | design-system | Effet sur le rendu |
|---|---|---|---|
| Modale partagée : titre | `.fm-modale-titres h2` 24px 800 (`Formateur.css:357`) | `.modale-titres h2` 24px 800 (`Modale.css:52`) | aucun (composant déplacé dans `src/components/Modale.jsx`) |
| Modale : sous-titre | `.fm-modale-titres p` 15px | `.modale-titres p` 15px (`Modale.css:58`) | aucun |
| Modale de confirmation : texte | `.fm-texte` 15px, interligne 1,45 | `.modale-texte` 15px, interligne 1,45 (`Modale.css:94`) | aucun (nouvelle classe, mêmes valeurs) |
| Modale de confirmation : bouton rouge | `.fm-bouton-danger` 16px 800 | `.modale-bouton-danger` 16px 800 (`Modale.css:130`) | aucun |
| « Annuler » : modale de confirmation, modale Nouveau groupe, modale Insérer une vidéo, modale d'assignation (2 endroits), barre d'enregistrement de Création de cours | `.fm-lien-action` : lien texte 16px **800** | `.bouton-secondaire` : bouton contour 1rem (16 px) **700** | **graisse 800 → 700** et passage d'un lien texte à un libellé de bouton (rôle candidat : Lien → Libellé de bouton) ; unité px → rem |
| Page /design-system | absente | `DesignSystem.jsx` et `.css` | hors relevé (voir 4.3) |

Les règles `.fm-modale-titres h2`, `.fm-modale-titres p` et `.fm-bouton-danger` sont retirées de `Formateur.css` sur design-system. `.fm-lien-action` y reste. Aucune autre valeur typographique ne diffère : mêmes polices, même chargement, mêmes variables.

## Annexe A. Toutes les occurrences (origin/main)

Une ligne par règle CSS qui déclare au moins une propriété typographique (345 règles, 677 déclarations), dans l'ordre des fichiers. Les règles « CSS non utilisé » sont gardées pour être complet.


#### `src/index.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 9 | Toutes | corps de page (valeur héritée par défaut) | `body` | - | 500 | absente | famille --font-body | toutes | en dur | Conteneur (valeur héritée par les enfants) |
| 15 | Toutes | titres h1, h2, h3 sans autre règle | `h1, h2, h3` | - | 800 | absente | famille --font-display | toutes | en dur | Conteneur (valeur héritée par les enfants) |

#### `src/styles/espace-layout.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 48 | Navigation | libellé d'entrée de la tab bar (mobile) | `.espace-nav-item` | 0.72rem → 11,52 px | 700 | absente | famille --font-body | toutes | en dur | Navigation, onglet, filtre, entrée de menu |
| 123 | Navigation | entrée du menu (Se déconnecter) | `.espace-menu-item` | 0.9rem → 14,4 px | 600 | absente | famille --font-body | toutes | en dur | Navigation, onglet, filtre, entrée de menu |
| 150 | Pages avec navigation | H1 de page dans .espace-page | `.espace-page h1` | var(--taille-h1) → 34 px (44 px ≥ 768) | 800 (h1, h2, h3) | 1.1 → 37,4 px | - | toutes | mixte | Titre de page |
| 163 | Pages avec navigation | h2 par défaut dans .espace-page | `.espace-page h2` | 1.05rem → 16,8 px | 800 | absente | famille --font-display | toutes | en dur | Titre de section |
| 205 | - | ligne de liste (ancienne) | `.espace-liste-item` | 0.95rem → 15,2 px | 600 | absente | famille --font-body | toutes | en dur | CSS non utilisé |
| 234 | - | chevron de ligne de liste (ancienne) | `.espace-liste-item-chevron` | 1.3rem → 20,8 px | hérité | 1 → 20,8 px | - | toutes | en dur | CSS non utilisé |
| 252 | Partagé (Cours, Dashboard, Détail groupe…) | pastille de statut (Nouveau, À faire, Non commencé) | `.statut-badge` | 0.75rem → 12 px | 700 | absente | famille --font-body | toutes | en dur | Pastille |
| 275 | Partagé | pastille de statut En cours / Terminé | `.statut-badge-en_cours, .statut-badge-termine` | 13px → 13 px | 800 | absente | - | toutes | en dur | Pastille |
| 327 | Navigation | libellé d'entrée de la barre horizontale (≥ 768) | `.espace-nav-item` | 0.9rem → 14,4 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Navigation, onglet, filtre, entrée de menu |

#### `src/styles/shared.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 45 | - | champ du formulaire de groupe (ancien) | `.dashboard-groupe-form input` | 0.9rem → 14,4 px | hérité | absente | famille --font-body | toutes | en dur | CSS non utilisé |
| 108 | Mot de passe oublié / Nouveau mot de passe / Compléter le profil | H1 de la carte de flux | `.flow-card h1` | var(--taille-h1) → 34 px (44 px ≥ 768) | 800 | 1.1 → 37,4 px | famille --font-display | toutes | mixte | Titre de page |
| 119 | Mot de passe oublié | phrase d'explication sous le H1 | `.flow-card p.souscription` | 0.9rem → 14,4 px | hérité | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 126 | Partagé (modales, Détail groupe, Mes cours, mot de passe) | libellé de champ (.champ) | `.champ` | 0.9rem → 14,4 px | hérité | absente | - | toutes | en dur | Libellé de champ |
| 136 | Partagé | saisie de champ input (.champ) | `.champ input` | 1rem → 16 px | 400 (navigateur, contrôle de formulaire) | absente | famille --font-body | toutes | en dur | Saisie et choix de champ |
| 148 | Partagé | saisie de champ textarea (.champ) | `.champ textarea` | 1rem → 16 px | 400 (navigateur, contrôle de formulaire) | absente | famille --font-body | toutes | en dur | Saisie et choix de champ |
| 200 | Partagé | libellé du bouton principal | `.bouton-primaire` | 1rem → 16 px | 700 | absente | famille --font-body | toutes | en dur | Libellé de bouton |
| 230 | Partagé | libellé du bouton secondaire | `.bouton-secondaire` | 1rem → 16 px | 700 | absente | famille --font-body | toutes | en dur | Libellé de bouton |
| 255 | Dashboard apprenant | libellé du bouton orange (quiz flash) | `.bouton-orange` | 1rem → 16 px | 700 | absente | famille --font-body | toutes | en dur | Libellé de bouton |
| 321 | Mot de passe oublié | lien « ← Retour » | `.lien-retour` | 0.85rem → 13,6 px | 600 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 343 | Mot de passe oublié | lien secondaire (simuler le lien) | `.lien-secondaire` | 0.85rem → 13,6 px | 600 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 358 | Partagé | message d'erreur (.message) | `.message` | 0.85rem → 13,6 px | hérité | 1.4 → 19 px | - | toutes | en dur | Aide, erreur et message |
| 380 | Création de cours | bouton pointillé « + Ajouter… » | `.bouton-ajouter` | 0.85rem → 13,6 px | 700 | absente | famille --font-body | toutes | en dur | Libellé de bouton |
| 424 | - | titre de modale (ancienne) | `.modal-carte h2` | 1.3rem → 20,8 px | 800 | absente | famille --font-display | toutes | en dur | CSS non utilisé |
| 458 | Dashboard apprenant | croix « × » de la modale Mes badges | `.modal-fermer` | 1.4rem → 22,4 px | hérité | 1 → 22,4 px | - | toutes | en dur | Hors rôle |
| 484 | - | titre de section de détail (ancien) | `.detail-section h2` | 1.1rem → 17,6 px | 800 | absente | famille --font-display | toutes | en dur | CSS non utilisé |
| 497 | - | bouton de déconnexion (ancien) | `.dashboard-deconnexion` | 0.8rem → 12,8 px | 700 | absente | famille --font-body | toutes | en dur | CSS non utilisé |
| 512 | Terrain, Détail thème, Détail groupe | texte d'état vide | `.dashboard-etat-vide` | 0.85rem → 13,6 px | hérité | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 529 | - | liste du dashboard (ancienne) | `.dashboard-liste` | 0.9rem → 14,4 px | hérité | absente | - | toutes | en dur | CSS non utilisé |

#### `src/styles/quiz.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 3 | - | énoncé de quiz (ancien) | `.quiz-enonce` | 1rem → 16 px | 600 | absente | - | toutes | en dur | CSS non utilisé |
| 26 | - | option de quiz (ancienne) | `.quiz-option` | 0.9rem → 14,4 px | hérité | absente | - | toutes | en dur | CSS non utilisé |
| 85 | Fiche : checklist (remise en ordre) | message de résultat de la remise en ordre | `.quiz-feedback` | 0.85rem → 13,6 px | hérité | absente | - | toutes | en dur | Aide, erreur et message |
| 107 | - | explication de quiz (ancienne) | `.quiz-explication` | 0.8rem → 12,8 px | hérité | absente | - | toutes | en dur | CSS non utilisé |
| 114 | - | résumé de quiz (ancien) | `.quiz-resume` | 0.9rem → 14,4 px | hérité | absente | - | toutes | en dur | CSS non utilisé |

#### `src/components/ContenuMarkdown.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 11 | Fiche : leçon, quiz, checklist, Détail cours, aperçu | interligne des titres Markdown | `.contenu-markdown h1, .contenu-markdown h2, .contenu-markdown h3` | hérité | 800 (h1, h2, h3) | 1.25 | - | toutes | en dur | Titre de section |
| 14 | Contenu Markdown | titre Markdown niveau 1 | `.contenu-markdown h1` | 1.4rem → 22,4 px | 800 (h1, h2, h3) | absente | - | toutes | en dur | Titre de section |
| 15 | Contenu Markdown | titre Markdown niveau 2 (hors leçon) | `.contenu-markdown h2` | 1.2rem → 19,2 px | 800 (h1, h2, h3) | absente | - | toutes | en dur | Titre de section |
| 16 | Contenu Markdown | titre Markdown niveau 3 | `.contenu-markdown h3` | 1.05rem → 16,8 px | 800 (h1, h2, h3) | absente | - | toutes | en dur | Titre de section |
| 38 | Contenu Markdown | lien dans le texte | `.contenu-markdown a` | hérité | 600 | absente | - | toutes | en dur | Lien et bouton texte |
| 95 | Contenu Markdown | texte de tableau | `.contenu-markdown table` | 0.95rem → 15,2 px | hérité | absente | - | toutes | en dur | Corps de texte |
| 111 | Contenu Markdown | en-tête de tableau | `.contenu-markdown th` | hérité | 800 | absente | famille --font-display | toutes | en dur | Titre de ligne ou d'élément de liste |

#### `src/components/GabaritParcours.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 86 | Parcours | libellé du bouton du parcours (écrasé par .bouton-primaire / .bouton-secondaire) | `.parcours-bouton` | 17px → 16 px (écrasé par .bouton-primaire / .bouton-secondaire, 1rem) | 700 (écrasé) | absente | - | toutes | en dur | Libellé de bouton |
| 106 | Parcours | lien sous le bouton (« Déjà un compte ? … ») | `.parcours-lien` | 15px → 15 px | 700 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 115 | Parcours | partie en gras du lien sous le bouton | `.parcours-lien strong` | hérité | 800 | absente | - | toutes | en dur | Lien et bouton texte |
| 135 | Parcours : Introduction | lien « Passer » | `.parcours-passer` | 16px → 16 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 195 | Parcours : questions | compteur « 2 / 5 » | `.parcours-compteur` | 18px → 18 px | 800 | absente | - | toutes | en dur | Compteur et chiffre de progression |
| 208 | Parcours | H1 du parcours | `.parcours-titre` | var(--taille-h1) → 34 px (44 px ≥ 768) | 800 | 1.1 → 37,4 px | - | toutes | mixte | Titre de page |
| 215 | Parcours | sous-titre sous le H1 | `.parcours-sous-titre` | 16px → 16 px | 500 | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 228 | Parcours | libellé de champ | `.parcours-champ-libelle` | 14px → 14 px | 800 | absente | - | toutes | en dur | Libellé de champ |
| 248 | Parcours | saisie de champ | `.parcours-input` | 16px → 16 px | 600 | absente | famille --font-body | toutes | en dur | Saisie et choix de champ |
| 269 | Parcours : questions | saisie du grand champ (prénom, organisme…) | `.parcours-champ-grand .parcours-input` | 20px → 20 px | 700 | absente | - | toutes | en dur | Saisie et choix de champ |
| 296 | Parcours : questions | ligne de choix (statut, âge, motivation) | `.parcours-choix-ligne` | 17px → 17 px | 600 | absente | famille --font-body | toutes | en dur | Saisie et choix de champ |
| 322 | Parcours : questions | ligne de choix sélectionnée | `.parcours-choix-ligne-choisie` | hérité | 700 | absente | - | toutes | en dur | Saisie et choix de champ |
| 329 | Parcours : questions | ligne de choix sélectionnée au survol | `.parcours-choix-ligne-choisie:hover` | hérité | 700 | absente | - | (hover: hover) | en dur | Saisie et choix de champ |
| 365 | Parcours | message d'erreur | `.parcours-message-erreur` | 14px → 14 px | 700 | absente | - | toutes | en dur | Aide, erreur et message |

#### `src/components/CompletionToast.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 15 | Partagé (fiche) | texte du toast de complétion | `.completion-toast` | 0.85rem → 13,6 px | hérité | absente | famille --font-body | toutes | en dur | Corps de texte |
| 30 | Partagé (fiche) | titre du toast de complétion | `.completion-toast-titre` | hérité | 800 | absente | famille --font-display | toutes | en dur | Titre de carte ou de bloc |
| 39 | Partagé (fiche) | « +15 XP » du toast | `.completion-toast-xp` | hérité | 700 | absente | - | toutes | en dur | Compteur et chiffre de progression |
| 48 | Partagé (fiche) | nom du badge dans le toast | `.completion-toast-badge` | 0.8rem → 12,8 px | 700 | absente | - | toutes | en dur | Pastille |

#### `src/components/LigneCours.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 26 | Terrain, recherche Cours | ligne de cours (bouton conteneur) | `.ligne-cours` | - | - | absente | famille --font-body | toutes | variable (famille) | Conteneur (valeur héritée par les enfants) |
| 47 | Terrain, recherche Cours | titre de la ligne de cours | `.ligne-cours-titre` | 15px → 15 px | 800 | 1.2 → 18 px | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 54 | Terrain, recherche Cours | méta de la ligne de cours | `.ligne-cours-meta` | 13px → 13 px | hérité | absente | - | toutes | en dur | Méta |
| 104 | Terrain, recherche Cours | titre de la ligne de cours (≥ 768) | `.ligne-cours-titre` | 16px → 16 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Titre de ligne ou d'élément de liste |

#### `src/components/ReperEtapes.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 39 | Fiche : leçon, checklist | bouton d'étape du repère | `.reper-bouton` | 14px → 14 px | 400 (navigateur, contrôle de formulaire) | absente | famille --font-body | toutes | en dur | Conteneur (valeur héritée par les enfants) |
| 56 | Fiche : leçon, checklist | numéro dans la pastille d'étape | `.reper-pastille` | 13px → 13 px | 800 | absente | - | toutes | en dur | Numéro dans une pastille ronde |
| 67 | Fiche : leçon, checklist | libellé d'étape (Leçon, Quiz · 4/5…) | `.reper-libelle` | hérité | hérité | 1.2 | - | toutes | en dur | Méta |
| 78 | Fiche : leçon, checklist | libellé de l'étape en cours | `.reper-etape-courante .reper-libelle` | hérité | 800 | absente | - | toutes | en dur | Méta |
| 89 | Fiche : leçon, checklist | libellé d'une étape faite | `.reper-etape-faite .reper-libelle` | hérité | 700 | absente | - | toutes | en dur | Méta |
| 108 | Fiche : leçon, checklist | libellé d'une étape à venir | `.reper-etape-a-venir .reper-libelle` | hérité | 600 | absente | - | toutes | en dur | Méta |

#### `src/components/EntetePage.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 35 | Cours, Terrain | sous-titre de l'en-tête lavande | `.entete-page-sous-titre` | 14px → 14 px | 700 | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 48 | Cours | saisie de la recherche | `.entete-page-recherche` | 1rem → 16 px | 400 (navigateur, contrôle de formulaire) | absente | famille --font-body | toutes | en dur | Saisie et choix de champ |
| 89 | Cours, Terrain | sous-titre de l'en-tête lavande (≥ 768) | `.entete-page-sous-titre` | 16px → 16 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Sous-titre et texte secondaire |

#### `src/components/BlocFormateur.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 21 | Dashboard apprenant, Cours | titre du bloc « De ton formateur » | `.espace-page .bloc-formateur-entete h2` | 18px → 18 px | 800 | absente | - | toutes | en dur | Titre de carte ou de bloc |
| 44 | Cours | compteur « N cours » du bloc formateur | `.bloc-formateur-compteur` | 14px → 14 px | 700 | absente | - | toutes | en dur | Méta |
| 69 | Dashboard apprenant, Cours | ligne du bloc formateur (bouton conteneur) | `.bloc-formateur-ligne` | - | - | absente | famille --font-body | toutes | variable (famille) | Conteneur (valeur héritée par les enfants) |
| 93 | Dashboard apprenant, Cours | titre de cours de la ligne du bloc formateur | `.bloc-formateur-titre` | 15px → 15 px | 800 | 1.2 → 18 px | - | toutes | en dur | Titre de ligne ou d'élément de liste |

#### `src/components/Dropdown.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 12 | Création de cours, Mes cours | valeur affichée de la liste déroulante | `.dropdown-trigger` | 1rem → 16 px | 400 (navigateur, contrôle de formulaire) | absente | famille --font-body | toutes | en dur | Saisie et choix de champ |
| 61 | Création de cours, Mes cours | option de la liste déroulante | `.dropdown-item` | 0.95rem → 15,2 px | hérité | absente | famille --font-body | toutes | en dur | Saisie et choix de champ |
| 78 | Création de cours, Mes cours | option choisie de la liste déroulante | `.dropdown-item[data-state='checked']` | hérité | 600 | absente | - | toutes | en dur | Saisie et choix de champ |

#### `src/components/formateur/Formateur.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 30 | Espace formateur (Mes cours, Mes groupes, Détail groupe, Détail cours) | H1 de page formateur | `.espace-page .fm-titres h1, .fm-titres h1` | var(--taille-h1) → 34 px (44 px ≥ 768) | 800 | 1.1 → 37,4 px | - | toutes | mixte | Titre de page |
| 37 | Espace formateur | sous-titre sous le H1 (« N élèves · N cours ») | `.fm-sous-titre` | 15px → 15 px | 600 | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 54 | Espace formateur | titre de carte de section (h2) | `.espace-page .fm-carte h2, .fm-carte h2` | 20px → 20 px | 800 | absente | - | toutes | en dur | Titre de section |
| 67 | Espace formateur, modale de confirmation | texte courant (paragraphe) | `.fm-texte` | 15px → 15 px | hérité | 1.45 → 21,8 px | - | toutes | en dur | Corps de texte |
| 73 | Espace formateur | méta (« X terminés sur N »…) | `.fm-meta` | 14px → 14 px | 600 | absente | - | toutes | en dur | Méta |
| 139 | Espace formateur | bouton Retour (conteneur) | `.fm-retour` | - | - | absente | famille --font-body | toutes | variable (famille) | Conteneur (valeur héritée par les enfants) |
| 161 | Espace formateur | texte du lien Retour « ‹ Mes cours » | `.fm-retour-texte` | 15px → 15 px | 800 | absente | - | toutes | en dur | Lien et bouton texte |
| 178 | Espace formateur | pastille de groupe / « Non assigné » | `.fm-pastille` | 13px → 13 px | 700 | absente | - | toutes | en dur | Pastille |
| 285 | Espace formateur (mobile) | titre de la feuille du menu « … » | `.fm-menu-titre` | 17px → 17 px | 800 | absente | - | toutes | en dur | Titre de modale ou de menu |
| 297 | Espace formateur | action du menu « … » | `.fm-menu-item` | 16px → 16 px | 700 | absente | famille --font-body | toutes | en dur | Navigation, onglet, filtre, entrée de menu |
| 357 | Espace formateur, Création de cours | titre de modale | `.fm-modale-titres h2` | 24px → 24 px | 800 | absente | - | toutes | en dur | Titre de modale ou de menu |
| 363 | Espace formateur | sous-titre de modale | `.fm-modale-titres p` | 15px → 15 px | hérité | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 397 | Modales, barre de Création de cours | lien d'action « Annuler » | `.fm-lien-action` | 16px → 16 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 411 | Modale de confirmation | libellé du bouton rouge | `.fm-bouton-danger` | 16px → 16 px | 800 | absente | famille --font-body | toutes | en dur | Libellé de bouton |
| 433 | Détail groupe | bouton texte « Supprimer ce groupe » | `.fm-bouton-texte-danger` | 15px → 15 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 527 | Modale d'assignation, Création de cours | libellé de case à cocher | `.fm-case-libelle` | 16px → 16 px | 700 | absente | - | toutes | en dur | Libellé de champ |
| 532 | Modale d'assignation | détail sous le libellé de case | `.fm-case-detail` | 13px → 13 px | hérité | absente | - | toutes | en dur | Méta |

#### `src/pages/DetailTheme.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 21 | Détail thème | bouton Retour « Cours » | `.theme-retour` | 15px → 15 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 66 | Détail thème | surtitre « Thème N » | `.theme-entete-numero` | 13px → 13 px | 700 | absente | - | toutes | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 75 | Détail thème | nom du thème (H1) | `.espace-page .theme-entete-titre` | 28px → 28 px | 800 | 1.1 → 30,8 px | - | toutes | en dur | Titre de contenu (cours, thème, question) |
| 88 | Détail thème | « x cours terminés sur y » | `.theme-entete-compte` | 14px → 14 px | 700 | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 115 | Détail thème | ligne de cours (bouton conteneur) | `.theme-ligne` | - | - | absente | famille --font-body | toutes | variable (famille) | Conteneur (valeur héritée par les enfants) |
| 136 | Détail thème | titre de la ligne de cours | `.theme-ligne-titre` | 16px → 16 px | 800 | 1.2 → 19,2 px | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 143 | Détail thème | contenu « Leçon · Quiz · Checklist » | `.theme-ligne-contenu` | 13px → 13 px | hérité | absente | - | toutes | en dur | Méta |
| 153 | Détail thème | nom du thème (H1, ≥ 768) | `.espace-page .theme-entete-titre` | 32px → 32 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Titre de contenu (cours, thème, question) |

#### `src/pages/DetailCoursFormateur.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 25 | Détail cours | titre du cours (H1) : perd contre .espace-page h1 | `.dc-titre` | 28px → 34 px (écrasé par .espace-page h1) | 800 | 1.1 → 30,8 px | - | toutes | en dur | Titre de contenu (cours, thème, question) |
| 96 | Détail cours | légende de la barre d'avancement | `.dc-legende` | 14px → 14 px | 600 | absente | - | toutes | en dur | Méta |
| 130 | Détail cours | chiffre des petites cartes d'avancement | `.dc-chiffre-valeur` | 28px → 28 px | 800 | 1 → 28 px | - | toutes | en dur | Chiffre mis en avant |
| 141 | Détail cours | libellé des petites cartes d'avancement | `.dc-chiffre-libelle` | 13px → 13 px | 600 | absente | - | toutes | en dur | Méta |
| 212 | Détail cours | premier paragraphe de la leçon | `.dc-paragraphe` | 16px → 16 px | hérité | 1.55 → 24,8 px | - | toutes | en dur | Corps de texte |
| 246 | Détail cours | « +N » sur la dernière miniature | `.dc-miniature-reste` | 16px → 16 px | 800 | absente | - | toutes | en dur | Hors rôle |
| 268 | Détail cours | titre de l'encadré « À retenir » | `.dc-retenir-entete h3` | 17px → 17 px | 800 | absente | - | toutes | en dur | Titre de carte ou de bloc |
| 294 | Détail cours | points de l'encadré « À retenir » | `.dc-retenir ul` | 15px → 15 px | 600 | absente | - | toutes | en dur | Corps de texte |
| 328 | Détail cours | numéro de question | `.dc-numero` | 13px → 13 px | 800 | absente | - | toutes | en dur | Numéro dans une pastille ronde |
| 340 | Détail cours | énoncé de question | `.dc-enonce` | 15px → 15 px | 800 | absente | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 353 | Détail cours | bonne réponse | `.dc-bonne-reponse` | 14px → 14 px | 700 | absente | - | toutes | en dur | Corps de texte |
| 372 | Détail cours | intitulé d'étape de checklist | `.dc-etape-intitule` | 15px → 15 px | 600 | absente | - | toutes | en dur | Corps de texte |
| 389 | Détail cours | titre du cours (H1, ≥ 768) : perd contre .espace-page h1 | `.dc-titre` | 32px → 44 px (écrasé par .espace-page h1) | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Titre de contenu (cours, thème, question) |

#### `src/pages/FicheCours.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 104 | Aperçu élève | texte du bandeau « Aperçu élève » | `.fiche-apercu-bandeau` | 14px → 14 px | 700 | absente | - | toutes | en dur | Méta |
| 115 | Aperçu élève | bouton « Quitter l'aperçu » | `.fiche-apercu-quitter` | 14px → 14 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 170 | Fiche | bouton Retour (nom court du thème) | `.fiche-retour` | 15px → 15 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 215 | Fiche : leçon, récap | thème au-dessus du titre | `.fiche-entete-theme` | 13px → 13 px | 700 | absente | - | toutes | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 222 | Fiche : leçon, récap | titre du cours (H1) | `.fiche-entete-titre` | var(--taille-titre-cours) → 28 px (32 px ≥ 768) | 800 | 1.1 → 30,8 px | - | toutes | mixte | Titre de contenu (cours, thème, question) |
| 234 | Fiche : leçon, récap | « N min de lecture » / « X XP gagnés » | `.fiche-entete-sous-titre` | 14px → 14 px | 700 | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 253 | Fiche : leçon, aperçu Création | texte de la leçon | `.fiche-lecon-contenu` | 17px → 17 px | hérité | 1.55 → 26,4 px | - | toutes | en dur | Corps de texte |
| 266 | Fiche : leçon | intertitre H2 de la leçon | `.fiche-lecon-contenu.contenu-markdown h2` | 21px → 21 px | 800 | 1.2 → 25,2 px | - | toutes | en dur | Titre de section |
| 294 | Fiche : leçon (et aperçu Création, où il est écrasé) | titre de l'encadré « À retenir » | `.fiche-retenir-entete h2` | 17px → 17 px (fiche) ; 22 px dans l'aperçu de Création de cours (écrasé par .cc-carte h2) | 800 | absente | - | toutes | en dur | Titre de carte ou de bloc |
| 321 | Fiche : leçon | points de l'encadré « À retenir » | `.fiche-retenir ul` | 16px → 16 px | 600 | 1.4 → 22,4 px | - | toutes | en dur | Corps de texte |
| 344 | Fiche : leçon, checklist | libellé « Étape suivante » de la carte encre | `.fiche-suivante-libelle` | 13px → 13 px | 700 | absente | - | toutes | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 351 | Fiche : leçon, checklist | titre de la carte « Étape suivante » | `.fiche-suivante-titre` | 22px → 22 px | 800 | 1.1 → 24,2 px | - | toutes | en dur | Titre de carte ou de bloc |
| 358 | Fiche : leçon, checklist | détail « N questions · +20 XP » | `.fiche-suivante-detail` | 14px → 14 px | hérité | absente | - | toutes | en dur | Méta |
| 374 | Fiche : leçon, checklist | libellé du bouton blanc | `.fiche-bouton-blanc` | 16px → 16 px | 800 | absente | famille --font-body | toutes | en dur | Libellé de bouton |
| 413 | Fiche : quiz, Quiz flash | compteur « 3 / 5 » | `.fiche-quiz-compteur` | 15px → 15 px | 800 | absente | - | toutes | en dur | Compteur et chiffre de progression |
| 426 | Fiche : quiz, Quiz flash | libellé du cours au-dessus de la question | `.fiche-quiz-cours` | 13px → 13 px | 700 | absente | - | toutes | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 432 | Fiche : quiz, Quiz flash | question | `.fiche-quiz-question` | 24px → 24 px | 800 | 1.15 → 27,6 px | - | toutes | en dur | Titre de contenu (cours, thème, question) |
| 445 | Fiche : quiz, Quiz flash | « Plusieurs réponses possibles » | `.fiche-quiz-aide` | 14px → 14 px | 700 | absente | - | toutes | en dur | Aide, erreur et message |
| 467 | Fiche : quiz, Quiz flash | texte de réponse | `.fiche-reponse` | 16px → 16 px | 600 | absente | - | toutes | en dur | Saisie et choix de champ |
| 606 | Fiche : quiz, Quiz flash | pastille « Ta réponse » / « Bonne réponse » | `.fiche-reponse-pastille` | 12px → 12 px | 800 | absente | - | toutes | en dur | Pastille |
| 654 | Fiche : quiz, Quiz flash | titre du bloc de correction (« Bien vu ») | `.fiche-feedback-titre` | 20px → 20 px | 800 | absente | - | toutes | en dur | Titre de carte ou de bloc |
| 662 | Fiche : quiz, Quiz flash | explication de la correction | `.fiche-feedback-texte` | 15px → 15 px | hérité | 1.45 → 21,8 px | - | toutes | en dur | Corps de texte |
| 673 | Fiche : quiz, Quiz flash | lien « Revoir la leçon » | `.fiche-feedback-lien` | 15px → 15 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 685 | Fiche : quiz, Quiz flash | libellé du bouton « Valider ma réponse » | `.fiche-bouton-quiz` | 16px → 16 px | 800 | absente | - | toutes | en dur | Libellé de bouton |
| 718 | Fin de quiz | titre du cours dans la barre du haut | `.fin-quiz-haut-titre` | 13px → 13 px | 700 | absente | - | toutes | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 763 | Fin de quiz | « Quiz terminé » | `.fin-quiz-libelle` | 13px → 13 px | 700 | absente | - | toutes | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 795 | Fin de quiz | score « 4/5 » dans l'anneau | `.fin-quiz-anneau-score` | 48px → 48 px | 800 | 1 → 48 px | - | toutes | en dur | Chiffre mis en avant |
| 801 | Fin de quiz | « 80 % » sous le score | `.fin-quiz-anneau-pourcent` | 15px → 15 px | 700 | absente | - | toutes | en dur | Compteur et chiffre de progression |
| 809 | Fin de quiz | titre « Belle maîtrise ! » | `.espace-page .fin-quiz-titre, .fin-quiz-titre` | 30px → 30 px | 800 | 1.1 → 33 px | - | toutes | en dur | Titre de page |
| 816 | Fin de quiz | sous-titre « Une seule erreur à revoir. » | `.fin-quiz-sous-titre` | 15px → 15 px | 600 | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 830 | Fin de quiz | pastille « +20 XP » | `.fin-quiz-xp` | 16px → 16 px | 800 | absente | - | toutes | en dur | Pastille |
| 881 | Fin de quiz | pastille « Nouveau badge » | `.fin-quiz-badge-pastille` | 12px → 12 px | 800 | absente | - | toutes | en dur | Pastille |
| 886 | Fin de quiz | nom du badge débloqué | `.fin-quiz-badge-nom` | 22px → 22 px | 800 | 1.1 → 24,2 px | - | toutes | en dur | Titre de carte ou de bloc |
| 892 | Fin de quiz | condition du badge | `.fin-quiz-badge-condition` | 14px → 14 px | hérité | absente | - | toutes | en dur | Méta |
| 901 | Fin de quiz | libellé du bouton principal | `.fin-quiz-bouton` | 16px → 16 px | 800 | absente | - | toutes | en dur | Libellé de bouton |
| 919 | Fin de quiz | liens « Revoir mes erreurs »… | `.fin-quiz-lien` | 15px → 15 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 953 | Fin de quiz : mes erreurs | question ratée | `.fin-quiz-erreur-question` | 16px → 16 px | 800 | absente | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 963 | Fin de quiz : mes erreurs | ligne « Ta réponse / Bonne réponse » | `.fin-quiz-erreur-ligne` | 14px → 14 px | 700 | absente | - | toutes | en dur | Corps de texte |
| 977 | Fin de quiz : mes erreurs | explication | `.fin-quiz-erreur-explication` | 14px → 14 px | hérité | absente | - | toutes | en dur | Corps de texte |
| 1033 | Fiche : checklist | thème de l'en-tête compact | `.fiche-checklist-theme` | 12px → 12 px | 700 | absente | - | toutes | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 1041 | Fiche : checklist | titre du cours de l'en-tête compact (H1) | `.fiche-checklist-titre` | 15px → 15 px | 800 | absente | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 1062 | Fiche : checklist | « X étapes sur N » | `.fiche-checklist-compte` | 20px → 20 px | 800 | absente | - | toutes | en dur | Chiffre mis en avant |
| 1067 | Fiche : checklist | « +15 XP à la fin » | `.fiche-checklist-xp` | 14px → 14 px | 700 | absente | - | toutes | en dur | Méta |
| 1081 | Fiche : checklist (remise en ordre) | consigne de remise en ordre | `.fiche-checklist-consigne` | 15px → 15 px | hérité | absente | - | toutes | en dur | Corps de texte |
| 1109 | Fiche : checklist | numéro dans la pastille d'étape | `.fiche-etape-pastille` | 13px → 13 px | 800 | absente | - | toutes | en dur | Numéro dans une pastille ronde |
| 1153 | Fiche : checklist | lien « Passer cette étape » | `.fiche-etape-passer` | 15px → 15 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 1172 | Fiche : checklist | intitulé d'étape | `.fiche-etape-intitule` | 16px → 16 px | 600 | 1.35 → 21,6 px | - | toutes | en dur | Corps de texte |
| 1205 | Fiche : checklist | intitulé de l'étape en cours | `.fiche-etape-courante .fiche-etape-intitule` | 17px → 17 px | 800 | absente | - | toutes | en dur | Titre de carte ou de bloc |
| 1215 | Fiche : checklist | pastille « Bloquante » | `.fiche-etape-bloquante` | 12px → 12 px | 800 | absente | - | toutes | en dur | Pastille |
| 1221 | Fiche : checklist | critère de validation | `.fiche-etape-critere` | 14px → 14 px | hérité | absente | - | toutes | en dur | Méta |
| 1245 | Fiche : checklist (remise en ordre) | flèches ↑ ↓ de déplacement | `.fiche-etape-fleche` | 1rem → 16 px | hérité | absente | - | toutes | en dur | Hors rôle |
| 1276 | Récap | « X XP gagnés » (pastille Terminé) | `.fiche-recap-xp` | 14px → 14 px | 800 | absente | - | toutes | en dur | Pastille |
| 1311 | Récap | titre de ligne (Leçon, Quiz, Checklist) | `.fiche-recap-ligne-titre` | 16px → 16 px | 800 | absente | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 1316 | Récap | détail de ligne (« Meilleur score : 4/5 ») | `.fiche-recap-ligne-detail` | 13px → 13 px | hérité | absente | - | toutes | en dur | Méta |
| 1323 | Récap | libellé des boutons « Relire / Refaire / Revoir » | `.fiche-recap-bouton` | 14px → 14 px | hérité | absente | - | toutes | en dur | Libellé de bouton |
| 1339 | Récap | libellé « Suite du thème » | `.fiche-suite-libelle` | 13px → 13 px | 700 | absente | - | toutes | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 1346 | Récap | titre du cours suivant | `.fiche-suite-titre` | 22px → 22 px | 800 | 1.1 → 24,2 px | - | toutes | en dur | Titre de carte ou de bloc |
| 1352 | Récap | contenu du cours suivant | `.fiche-suite-contenu` | 14px → 14 px | hérité | absente | - | toutes | en dur | Méta |
| 1398 | Fiche : leçon | texte de la leçon (≥ 768) | `.fiche-lecon-contenu` | 18px → 18 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Corps de texte |
| 1432 | Fiche : leçon | intertitre H2 de la leçon (≥ 768) | `.fiche-lecon-contenu.contenu-markdown h2` | 24px → 24 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Titre de section |

#### `src/pages/Dashboard.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 21 | Dashboard apprenant | « Salut [Prénom] » (H1) | `.dash-entete h1` | aucune → 34 px (reçue de `.espace-page h1`) | 800 (h1, h2, h3) | 1 | lettres -0.5px | toutes | en dur | Titre de page |
| 30 | Dashboard apprenant | « [N] XP » de l'en-tête | `.dash-xp` | 17px → 17 px | 800 | absente | - | toutes | en dur | Chiffre mis en avant |
| 131 | Dashboard apprenant | libellé violet (« Ton premier cours »…) | `.dash-libelle-violet` | 13px → 13 px | 700 | absente | - | toutes | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 137 | Dashboard apprenant | libellé sur carte violette (« Tu en es là ») | `.dash-libelle-sur-violet` | 13px → 13 px | 700 | absente | - | toutes | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 143 | Dashboard apprenant | titre de carte blanche / lavande | `.dash-page .dash-titre-carte` | 22px → 22 px | 800 | 1.05 → 23,1 px | - | toutes | en dur | Titre de carte ou de bloc |
| 149 | Dashboard apprenant | sous-texte (thème, condition du badge) | `.dash-sous-texte` | 13px → 13 px | 600 | absente | - | toutes | en dur | Méta |
| 166 | Dashboard apprenant, Cours | lien « Tout voir » / « Mes badges · X/6 » | `.dash-lien` | 14px → 14 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 191 | Dashboard apprenant | pastille « De ton formateur » | `.dash-pastille-formateur` | 12px → 12 px | 800 | absente | - | toutes | en dur | Pastille |
| 206 | Dashboard apprenant | pastille orange « Défi du jour » | `.dash-pastille-orange` | 12px → 12 px | 800 | absente | - | toutes | en dur | Pastille |
| 222 | Dashboard apprenant | libellé du bouton blanc à flèche | `.dash-bouton-fleche` | 16px → 16 px | 800 | absente | famille --font-body | toutes | en dur | Libellé de bouton |
| 255 | Dashboard apprenant | libellé du bouton large orange | `.dash-bouton-large` | 16px → 16 px | 800 | absente | - | toutes | en dur | Libellé de bouton |
| 318 | Dashboard apprenant | compteur de barre « X / 3 » | `.dash-barre-compteur` | 14px → 14 px | 800 | absente | - | toutes | en dur | Compteur et chiffre de progression |
| 323 | Dashboard apprenant | compteur de barre, petite variante | `.dash-barre-compteur-petit` | 12px → 12 px | hérité | absente | - | toutes | en dur | Compteur et chiffre de progression |
| 360 | Dashboard apprenant | titre du bloc de tête (cours en cours / assigné) | `.dash-page .dash-titre-tete` | 26px → 26 px | 800 | 1.05 → 27,3 px | - | toutes | en dur | Titre de contenu (cours, thème, question) |
| 382 | Dashboard apprenant | pourcentage dans l'anneau | `.dash-anneau-valeur` | 17px → 17 px | 800 | absente | - | toutes | en dur | Chiffre mis en avant |
| 388 | Dashboard apprenant | phrase d'état (« Leçon lue. Reste le quiz ») | `.dash-en-cours-phrase` | 14px → 14 px | 600 | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 410 | Dashboard apprenant | libellé du bouton « Commencer » | `.dash-conseille-bouton` | 15px → 15 px | 800 | absente | - | toutes | en dur | Libellé de bouton |
| 426 | Dashboard apprenant | méta du cours assigné (« thème · ajouté hier ») | `.dash-assigne-meta` | 14px → 14 px | 600 | absente | - | toutes | en dur | Méta |
| 440 | Dashboard apprenant | « Quiz flash » du bloc de tête E | `.dash-page .dash-flash-tete-titre` | 34px → 34 px | 800 | 1 → 34 px | lettres -0.5px | toutes | en dur | Titre de contenu (cours, thème, question) |
| 449 | Dashboard apprenant | phrase du bloc de tête E | `.dash-flash-tete-texte` | 14px → 14 px | 600 | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 477 | Dashboard apprenant | titre « Quiz flash » du bloc en ligne F | `.dash-page .dash-flash-ligne-texte h2` | 19px → 19 px | 800 | absente | - | toutes | en dur | Titre de carte ou de bloc |
| 482 | Dashboard apprenant | méta « 10 questions · +30 XP » | `.dash-flash-ligne-meta` | 13px → 13 px | hérité | absente | - | toutes | en dur | Méta |
| 495 | Dashboard apprenant | libellé du bouton « Lancer » | `.dash-flash-ligne-bouton` | 15px → 15 px | 800 | absente | - | toutes | en dur | Libellé de bouton |
| 547 | Dashboard apprenant | titre « Quiz flash » verrouillé | `.dash-page .dash-flash-verrouille-texte h2` | 17px → 17 px | 800 | absente | - | toutes | en dur | Titre de carte ou de bloc |
| 552 | Dashboard apprenant | consigne du quiz flash verrouillé | `.dash-flash-verrouille-consigne` | 13px → 13 px | 600 | absente | - | toutes | en dur | Méta |
| 715 | Dashboard apprenant | « Salut [Prénom] » (≥ 768) | `.dash-entete h1` | = règle de base | = règle de base | = règle de base | lettres -0.8px | (min-width: 768px) | en dur | Titre de page |
| 720 | Dashboard apprenant | « [N] XP » (≥ 768) | `.dash-xp` | 20px → 20 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Chiffre mis en avant |
| 878 | Dashboard apprenant | pourcentage dans l'anneau (≥ 768) | `.dash-anneau-valeur` | 26px → 26 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Chiffre mis en avant |
| 891 | Dashboard apprenant | libellé sur carte violette (≥ 768) | `.dash-libelle-sur-violet` | 15px → 15 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 895 | Dashboard apprenant | titre du bloc de tête (≥ 768) | `.dash-page .dash-titre-tete` | var(--taille-titre-cours) → 32 px | = règle de base | 1.1 → 35,2 px | - | (min-width: 768px) | mixte | Titre de contenu (cours, thème, question) |
| 900 | Dashboard apprenant | phrase d'état (≥ 768) | `.dash-en-cours-phrase` | 15px → 15 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Sous-titre et texte secondaire |
| 941 | Dashboard apprenant | « Quiz flash » vertical en colonne étroite (≥ 768) | `.dash-page .dash-cellule-cote .dash-flash-ligne-texte h2` | 28px → 28 px | = règle de base | 1 → 28 px | - | (min-width: 768px) | en dur | Titre de carte ou de bloc |
| 952 | Dashboard apprenant | phrase du quiz flash vertical (≥ 768) | `.dash-cellule-cote .dash-flash-ligne-phrase` | 15px → 15 px | 600 | = règle de base | - | (min-width: 768px) | en dur | Sous-titre et texte secondaire |
| 960 | Dashboard apprenant | libellé du bouton « Lancer » vertical (≥ 768) | `.dash-cellule-cote .dash-flash-ligne-bouton` | 16px → 16 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Libellé de bouton |
| 994 | Dashboard apprenant : modale Mes badges | titre « Mes badges » | `.dash-modale-badges-entete h2` | 1.3rem → 20,8 px | 800 | absente | - | toutes | en dur | Titre de modale ou de menu |
| 1001 | Dashboard apprenant : modale Mes badges | compteur « X/6 » | `.dash-modale-badges-compteur` | 15px → 15 px | 800 | absente | - | toutes | en dur | Compteur et chiffre de progression |
| 1051 | Dashboard apprenant : modale Mes badges | nom du badge | `.dash-modale-badge-nom` | 15px → 15 px | 800 | absente | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 1057 | Dashboard apprenant : modale Mes badges | condition du badge | `.dash-modale-badge-condition` | 13px → 13 px | hérité | absente | - | toutes | en dur | Méta |
| 1062 | Dashboard apprenant : modale Mes badges | « Obtenu le JJ/MM » | `.dash-modale-badge-etat` | 12px → 12 px | 700 | absente | - | toutes | en dur | Méta |

#### `src/pages/DashboardFormateur.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 30 | Dashboard formateur, admin | « Bonjour [prénom] » (H1) | `.espace-page .fd-titres h1` | 34px → 34 px | 800 | aucune → 1.1 (reçue de `.espace-page h1`) | - | toutes | en dur | Titre de page |
| 36 | Dashboard formateur, admin | « 3 cours · 1 groupe · 12 élèves » | `.fd-sous-titre` | 15px → 15 px | 700 | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 45 | Dashboard formateur | liens « N cours » / « N groupes » dans le sous-titre | `.fd-lien-discret` | inherit → inherit | inherit | absente | famille inherit | toutes | inherit | Lien et bouton texte |
| 63 | Dashboard admin | pastille « Compte officiel » | `.fd-pastille-officiel` | 13px → 13 px | 800 | absente | - | toutes | en dur | Pastille |
| 102 | Dashboard formateur, admin | titre de carte (« Tes groupes »…) | `.espace-page .fd-carte-entete h2` | 20px → 20 px | 800 | 1.2 → 24 px | - | toutes | en dur | Titre de section |
| 112 | Dashboard formateur, admin | lien « Tout voir » | `.fd-lien` | 14px → 14 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 128 | Dashboard formateur | lien « Voir les N autres » / « Voir plus » | `.fd-lien-centre` | 15px → 15 px | hérité | absente | - | toutes | en dur | Lien et bouton texte |
| 133 | Dashboard formateur | note sous une carte | `.fd-note` | 13px → 13 px | 500 | absente | - | toutes | en dur | Aide, erreur et message |
| 139 | Dashboard formateur | note 14 px (Pour bien démarrer) | `.fd-note-14` | 14px → 14 px | hérité | absente | - | toutes | en dur | Aide, erreur et message |
| 144 | Dashboard formateur, admin | texte d'état vide | `.fd-vide` | 15px → 15 px | hérité | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 206 | Dashboard formateur | taux de complétion (chiffre) | `.formateur-taux-valeur` | 1.75rem → 28 px | 800 | 1 → 28 px | famille --font-display | toutes | en dur | Chiffre mis en avant |
| 215 | Dashboard formateur | taux de complétion (< 400 px) | `.formateur-taux-valeur` | 1.3rem → 20,8 px | = règle de base | = règle de base | - | (max-width: 399px) | en dur | Chiffre mis en avant |
| 220 | Dashboard formateur | titre « Taux de complétion » | `.formateur-taux-label` | 0.9rem → 14,4 px | hérité | absente | - | toutes | en dur | Titre de section |
| 225 | Dashboard formateur | sous-titre « Sur l'ensemble de tes groupes » | `.formateur-taux-souscription` | 0.75rem → 12 px | hérité | absente | - | toutes | en dur | Méta |
| 236 | Dashboard formateur | pastille « À surveiller / Bon rythme » | `.formateur-taux-pastille` | 0.75rem → 12 px | 700 | absente | - | toutes | en dur | Pastille |
| 276 | Dashboard formateur | bloc de groupe (bouton conteneur) | `.fd-groupe` | - | - | absente | famille --font-body | toutes | variable (famille) | Conteneur (valeur héritée par les enfants) |
| 298 | Dashboard formateur | nom du groupe | `.fd-groupe-nom` | 17px → 17 px | 800 | 1.2 → 20,4 px | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 304 | Dashboard formateur | « N élèves · N cours » | `.fd-groupe-meta` | 14px → 14 px | 600 | absente | - | toutes | en dur | Méta |
| 311 | Dashboard formateur | « Actif aujourd'hui » | `.fd-groupe-activite` | 13px → 13 px | 700 | absente | - | toutes | en dur | Méta |
| 330 | Dashboard formateur | % de la barre du groupe | `.fd-groupe-progression strong` | 14px → 14 px | 800 | absente | - | toutes | en dur | Compteur et chiffre de progression |
| 354 | Dashboard formateur | ligne « Élèves à relancer » | `.formateur-relance-ligne` | 15px → 15 px | hérité | absente | - | toutes | en dur | Corps de texte |
| 366 | Dashboard formateur | texte de relance | `.formateur-relance-texte` | hérité | hérité | 1.4 | - | toutes | en dur | Corps de texte |
| 370 | Dashboard formateur | date « Il y a N jours » | `.formateur-relance-date` | 13px → 13 px | 700 | absente | - | toutes | en dur | Méta |
| 376 | Dashboard formateur | confirmation d'envoi de relance | `.formateur-relance-confirmation` | 13px → 13 px | 700 | absente | - | toutes | en dur | Aide, erreur et message |
| 440 | Dashboard formateur | « Personne à relancer » | `.fd-succes-textes strong` | 16px → 16 px | 800 | absente | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 446 | Dashboard formateur | « Tous tes élèves ont commencé… » | `.fd-succes-textes span` | 14px → 14 px | hérité | absente | - | toutes | en dur | Méta |
| 463 | Dashboard formateur | titre « Activité récente » | `.espace-page .fd-activite-entete h2` | 22px → 22 px | 800 | absente | - | toutes | en dur | Titre de section |
| 494 | Dashboard formateur | pastilles de filtre « Tout / Commencés / Terminés » | `.fd-filtre` | 14px → 14 px | 700 | absente | famille --font-body | toutes | en dur | Navigation, onglet, filtre, entrée de menu |
| 531 | Dashboard formateur | saisie « Un élève » | `.fd-recherche input` | 14px → 14 px | 400 (navigateur, contrôle de formulaire) | absente | famille --font-body | toutes | en dur | Saisie et choix de champ |
| 549 | Dashboard formateur | intertitre de jour (« Aujourd'hui ») | `.espace-page .fd-jour-titre` | 13px → 13 px | 700 | absente | - | toutes | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 575 | Dashboard formateur | événement (bouton conteneur) | `.fd-evenement` | - | - | absente | famille --font-body | toutes | variable (famille) | Conteneur (valeur héritée par les enfants) |
| 596 | Dashboard formateur | initiales sur rond lavande | `.fd-initiales` | 14px → 14 px | 800 | absente | - | toutes | en dur | Hors rôle |
| 602 | Dashboard formateur | texte de l'événement | `.fd-evenement-texte` | 15px → 15 px | 500 | 1.4 → 21 px | - | toutes | en dur | Corps de texte |
| 608 | Dashboard formateur | nom et cours en gras dans l'événement | `.fd-evenement-texte strong` | hérité | 800 | absente | - | toutes | en dur | Corps de texte |
| 626 | Dashboard formateur | pastille du groupe | `.fd-pastille-groupe` | 12px → 12 px | 700 | absente | - | toutes | en dur | Pastille |
| 640 | Dashboard formateur | statut « Quiz 90 % / En cours » | `.fd-score` | 13px → 13 px | 600 | absente | - | toutes | en dur | Méta |
| 657 | Dashboard formateur : Pour bien démarrer | titre de la carte | `.espace-page .fd-demarrage h2` | 24px → 24 px | 800 | absente | - | toutes | en dur | Titre de section |
| 663 | Dashboard formateur : Pour bien démarrer | « N étapes sur 3 » | `.fd-demarrage-compteur` | 14px → 14 px | 700 | absente | - | toutes | en dur | Méta |
| 695 | Dashboard formateur : Pour bien démarrer | numéro dans le rond | `.fd-etape-rond` | 16px → 16 px | 800 | absente | - | toutes | en dur | Numéro dans une pastille ronde |
| 722 | Dashboard formateur : Pour bien démarrer | titre d'étape | `.fd-etape-titre` | 17px → 17 px | 800 | absente | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 727 | Dashboard formateur : Pour bien démarrer | sous-titre d'étape | `.fd-etape-texte` | 14px → 14 px | hérité | absente | - | toutes | en dur | Méta |
| 740 | Dashboard formateur : Pour bien démarrer | libellé du bouton d'étape | `.fd-etape-action` | 15px → 15 px | hérité | absente | - | toutes | en dur | Libellé de bouton |
| 771 | Dashboard admin | libellé de carte chiffrée | `.fd-chiffre-libelle` | 14px → 14 px | 600 | absente | - | toutes | en dur | Méta |
| 777 | Dashboard admin | chiffre de carte | `.fd-chiffre-valeur` | 36px → 36 px | 800 | 1.1 → 39,6 px | - | toutes | en dur | Chiffre mis en avant |
| 783 | Dashboard admin | précision « 30 derniers jours » | `.fd-chiffre-precision` | 13px → 13 px | hérité | absente | - | toutes | en dur | Méta |
| 810 | Dashboard admin | cellule d'en-tête de ligne du tableau | `.fd-tableau th[scope='row']` | hérité | inherit | absente | - | toutes | inherit | Corps de texte |
| 819 | Dashboard admin | titre du cours dans le tableau | `.fd-tableau-titre` | 15px → 15 px | 800 | absente | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 826 | Dashboard admin | thème court sous le titre | `.fd-tableau-theme` | 13px → 13 px | hérité | absente | - | toutes | en dur | Méta |
| 831 | Dashboard admin (mobile) | résumé « 42 commencés · 18 terminés » | `.fd-tableau-resume` | 13px → 13 px | 600 | absente | - | toutes | en dur | Méta |
| 889 | Dashboard formateur, admin | « Bonjour » (≥ 768) | `.espace-page .fd-titres h1` | var(--taille-h1) → 44 px | = règle de base | = règle de base | - | (min-width: 768px) | variable | Titre de page |
| 1045 | Dashboard admin | en-têtes de colonne du tableau (≥ 768) | `.fd-tableau thead th` | 13px → 13 px | 700 | = règle de base | - | (min-width: 768px) | en dur | Méta |
| 1064 | Dashboard admin | cellules chiffrées du tableau (≥ 768) | `.fd-tableau td` | 15px → 15 px | 700 | = règle de base | - | (min-width: 768px) | en dur | Corps de texte |

#### `src/pages/DetailGroupe.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 46 | Détail groupe | saisie de l'email d'ajout | `.dg-ajout-champ input` | 16px → 16 px | 600 | absente | famille --font-body | toutes | en dur | Saisie et choix de champ |
| 78 | Détail groupe | titre « Cours assignés » | `.dg-cours-entete h2` | 20px → 20 px | 800 | absente | - | toutes | en dur | Titre de section |
| 87 | Détail groupe | lien « Assigner » | `.dg-lien-assigner` | 15px → 15 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 120 | Détail groupe | titre de la carte de cours assigné | `.dg-cours-titre` | 15px → 15 px | 800 | 1.25 → 18,8 px | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 137 | Détail groupe | carte pointillée « + Assigner un cours » | `.dg-cours-ajout` | 15px → 15 px | 800 | absente | famille --font-body | toutes | en dur | Libellé de bouton |
| 183 | Détail groupe | nom de l'élève | `.dg-eleve-nom` | 15px → 15 px | 800 | absente | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 190 | Détail groupe | email de l'élève | `.dg-eleve-email` | 13px → 13 px | 500 | absente | - | toutes | en dur | Méta |
| 242 | Détail groupe (mobile) | statut par cours dans la carte élève | `.dg-eleve-cours li` | 14px → 14 px | 600 | absente | - | toutes | en dur | Méta |
| 255 | Détail groupe | lien « Voir les N autres » | `.dg-voir-plus` | 15px → 15 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 332 | Détail groupe | texte du tableau des élèves (≥ 768) | `.dg-table` | 15px → 15 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Corps de texte |
| 338 | Détail groupe | en-têtes de colonne (≥ 768) | `.dg-table th` | 13px → 13 px | 800 | = règle de base | - | (min-width: 768px) | en dur | Méta |
| 350 | Détail groupe | cellules du tableau (≥ 768) | `.dg-table td` | = règle de base | 600 | = règle de base | - | (min-width: 768px) | en dur | Corps de texte |
| 370 | Détail groupe | bouton de tri XP / Badges (≥ 768) | `.dg-tri` | inherit → inherit | inherit | = règle de base | famille inherit | (min-width: 768px) | inherit | Méta |
| 376 | Détail groupe | flèche de tri (≥ 768) | `.dg-tri span` | 10px → 10 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Hors rôle |

#### `src/pages/CreationCours.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 52 | Création de cours (< 1024) | H1 de l'en-tête mobile | `.cc-entete-mobile h1` | 20px → 20 px | 800 | 1.2 → 24 px | - | toutes | en dur | Titre de page |
| 60 | Création de cours (< 1024) | titre du cours tronqué sous le H1 | `.cc-entete-mobile p` | 14px → 14 px | 600 | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 94 | Création de cours (< 1024) | pastille de section collante | `.cc-pastille` | 15px → 15 px | 700 | absente | famille --font-body | toutes | en dur | Navigation, onglet, filtre, entrée de menu |
| 103 | Création de cours (< 1024) | compteur dans la pastille | `.cc-pastille-compteur` | hérité | 600 | absente | - | toutes | en dur | Navigation, onglet, filtre, entrée de menu |
| 144 | Création de cours (≥ 1024) | bouton Retour « Mes cours » | `.cc-retour` | 16px → 16 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 181 | Création de cours (≥ 1024) | entrée du sommaire | `.cc-sommaire-entree` | 15px → 15 px | 700 | absente | famille --font-body | toutes | en dur | Navigation, onglet, filtre, entrée de menu |
| 191 | Création de cours (≥ 1024) | compteur du sommaire | `.cc-sommaire-compteur` | 13px → 13 px | 600 | absente | - | toutes | en dur | Méta |
| 208 | Création de cours | liens « Voir comme un élève » / « Créer un groupe » | `.cc-lien-apercu, .cc-lien` | 15px → 15 px | 800 | absente | famille --font-body | toutes | en dur | Lien et bouton texte |
| 236 | Création de cours | pastille « Compte officiel : ce cours sera public » | `.creation-badge-officiel` | 14px → 14 px | 700 | absente | - | toutes | en dur | Pastille |
| 253 | Création de cours | titre de carte de section (Infos, Leçon…) | `.cc-carte h2` | 22px → 22 px | 800 | 1.2 → 26,4 px | - | toutes | en dur | Titre de section |
| 266 | Création de cours | libellé de champ | `.cc-libelle` | 0.9rem → 14,4 px | hérité | absente | - | toutes | en dur | Libellé de champ |
| 272 | Création de cours | aide sous un champ | `.cc-aide` | 13px → 13 px | 500 | 1.4 → 18,2 px | - | toutes | en dur | Aide, erreur et message |
| 279 | Création de cours | message d'erreur | `.cc-erreur` | hérité | 700 | absente | - | toutes | en dur | Aide, erreur et message |
| 288 | Création de cours | interligne du titre et des intitulés d'étape | `.cc-champ-titre textarea, .cc-etape-intitule` | hérité | hérité | 1.35 | - | toutes | en dur | Saisie et choix de champ |
| 327 | Création de cours | bouton de choix (groupe, mode de checklist) | `.cc-choix-groupe, .cc-choix` | 15px → 15 px | 700 | absente | famille --font-body | toutes | en dur | Saisie et choix de champ |
| 409 | Création de cours | onglet « Écrire / Aperçu » | `.cc-onglet` | 14px → 14 px | 700 | absente | famille --font-body | toutes | en dur | Navigation, onglet, filtre, entrée de menu |
| 438 | Création de cours | bouton d'outil « Image / Vidéo » | `.cc-bouton-outil` | 14px → 14 px | 700 | absente | famille --font-body | toutes | en dur | Libellé de bouton |
| 458 | Création de cours | saisie de l'éditeur de leçon | `.cc-editeur-texte` | 16px → 16 px | 400 (navigateur, contrôle de formulaire) | 1.55 → 24,8 px | famille --font-body | toutes | en dur | Saisie et choix de champ |
| 519 | Création de cours | nom d'image en étiquette | `.cc-etiquette-nom` | 14px → 14 px | 700 | absente | - | toutes | en dur | Méta |
| 575 | Création de cours | numéro de question / d'étape | `.cc-numero` | 14px → 14 px | 800 | absente | - | toutes | en dur | Numéro dans une pastille ronde |
| 608 | Création de cours | question repliée (bouton conteneur) | `.cc-question-repliee` | - | - | absente | famille --font-body | toutes | variable (famille) | Conteneur (valeur héritée par les enfants) |
| 623 | Création de cours | énoncé de la question repliée | `.cc-question-enonce` | 15px → 15 px | 800 | absente | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 632 | Création de cours | méta « Réponse unique · 3 réponses » | `.cc-question-meta` | 13px → 13 px | 600 | absente | - | toutes | en dur | Méta |
| 655 | Création de cours | « Question N » (h3) | `.cc-question-entete h3` | 16px → 16 px | 800 | absente | - | toutes | en dur | Titre de ligne ou d'élément de liste |
| 751 | Création de cours | lettre de réponse | `.cc-lettre` | 15px → 15 px | 800 | absente | famille --font-body | toutes | en dur | Numéro dans une pastille ronde |
| 767 | Création de cours | saisie de réponse / d'explication | `.cc-reponse-texte, .cc-reponse-explication` | 15px → 15 px | 400 (navigateur, contrôle de formulaire) | absente | famille --font-body | toutes | en dur | Saisie et choix de champ |
| 776 | Création de cours | saisie d'explication | `.cc-reponse-explication` | 14px → 14 px | 400 (navigateur, contrôle de formulaire) | absente | - | toutes | en dur | Saisie et choix de champ |
| 832 | Création de cours | libellé « Bonne réponse » | `.cc-bonne-libelle` | 14px → 14 px | 700 | absente | - | toutes | en dur | Libellé de champ |
| 844 | Création de cours | libellé « Bonne réponse » coché | `.cc-bonne-cochee .cc-bonne-libelle` | hérité | 800 | absente | - | toutes | en dur | Libellé de champ |
| 895 | Création de cours | libellé de mode de checklist | `.cc-mode-libelle` | 15px → 15 px | 800 | absente | - | toutes | en dur | Saisie et choix de champ |
| 901 | Création de cours (≥ 768) | sous-titre de mode de checklist | `.cc-mode-detail` | 13px → 13 px | 500 | absente | - | toutes | en dur | Méta |
| 961 | Création de cours | saisie de l'intitulé d'étape | `.cc-etape-intitule` | 15px → 15 px | 600 | absente | famille --font-body | toutes | en dur | Saisie et choix de champ |
| 1013 | Création de cours | pilule « Bloquante » | `.cc-bloquante` | 14px → 14 px | 700 | absente | famille --font-body | toutes | en dur | Pastille |
| 1038 | Création de cours | bouton « Image » d'étape | `.cc-bouton-etape-image` | 14px → 14 px | 700 | absente | famille --font-body | toutes | en dur | Libellé de bouton |
| 1075 | Création de cours | message de la barre d'enregistrement | `.cc-barre-message` | 14px → 14 px | 700 | absente | - | toutes | en dur | Aide, erreur et message |
| 1081 | Création de cours | « Aucune modification » | `.cc-barre-aucune` | hérité | 600 | absente | - | toutes | en dur | Aide, erreur et message |
| 1376 | Création de cours (≥ 1024) | H1 de l'en-tête desktop | `.cc-entete-desktop h1` | 44px → 44 px | 800 | 1.1 → 48,4 px | - | (min-width: 1024px) | en dur | Titre de page |

#### `src/pages/SectionCours.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 20 | Cours | titre de section (« Thèmes », « N résultats ») | `.espace-page .page-cours-h2` | 22px → 22 px | 800 | absente | - | toutes | en dur | Titre de section |
| 28 | Cours | « Aucun cours ne correspond… » | `.page-cours-aucun-resultat` | 15px → 15 px | hérité | absente | - | toutes | en dur | Sous-titre et texte secondaire |
| 51 | Cours | carte de thème (bouton conteneur) | `.theme-carte` | - | - | absente | famille --font-body | toutes | variable (famille) | Conteneur (valeur héritée par les enfants) |
| 82 | Cours | surtitre « Thème N » de la carte de thème | `.theme-carte-numero` | 12px → 12 px | 700 | absente | - | toutes | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 89 | Cours | titre de la carte de thème | `.theme-carte-titre` | 15px → 15 px | 800 | 1.2 → 18 px | - | toutes | en dur | Titre de carte ou de bloc |
| 105 | Cours | compte « y cours » de la carte de thème | `.theme-carte-compte` | 13px → 13 px | 700 | absente | - | toutes | en dur | Méta |
| 111 | Cours | compte « x / y cours » commencé | `.theme-carte-compte-commence` | hérité | 800 | absente | - | toutes | en dur | Méta |
| 117 | Cours | titre de section (≥ 768) | `.espace-page .page-cours-h2` | 28px → 28 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Titre de section |
| 137 | Cours | surtitre « Thème N » (≥ 768) | `.theme-carte-numero` | 13px → 13 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Surtitre (libellé court au-dessus d'un titre) |
| 141 | Cours | titre de la carte de thème (≥ 768) | `.theme-carte-titre` | 18px → 18 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Titre de carte ou de bloc |
| 145 | Cours | compte de la carte de thème (≥ 768) | `.theme-carte-compte` | 14px → 14 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Méta |

#### `src/pages/FormateurListes.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 23 | Mes cours, Mes groupes | carte (bouton conteneur) | `.fl-carte` | - | - | absente | famille --font-body | toutes | variable (famille) | Conteneur (valeur héritée par les enfants) |
| 54 | Mes cours, Mes groupes | titre de carte (graisse, interligne) | `.fl-carte-titre` | hérité | 800 | 1.2 | - | toutes | en dur | Titre de carte ou de bloc |
| 60 | Mes cours | titre de la carte de cours | `.fl-carte-titre-cours` | 18px → 18 px | hérité | absente | - | toutes | en dur | Titre de carte ou de bloc |
| 64 | Mes cours, Mes groupes | méta de carte | `.fl-carte-meta` | 14px → 14 px | 600 | absente | - | toutes | en dur | Méta |
| 88 | Mes groupes | nom de la carte de groupe | `.fl-carte-titre-groupe` | 20px → 20 px | hérité | absente | - | toutes | en dur | Titre de carte ou de bloc |
| 101 | Mes groupes | ligne « Cours terminés » | `.fl-progression-ligne` | 14px → 14 px | 600 | absente | - | toutes | en dur | Méta |
| 107 | Mes groupes | % en gras | `.fl-progression-ligne strong` | hérité | 800 | absente | - | toutes | en dur | Compteur et chiffre de progression |
| 136 | Mes groupes | nom de la carte de groupe (≥ 768) | `.fl-carte-titre-groupe` | 22px → 22 px | = règle de base | = règle de base | - | (min-width: 768px) | en dur | Titre de carte ou de bloc |

#### `src/pages/parcours/Parcours.css`

| Ligne | Écran | Élément | Sélecteur | Taille écrite → rendue | Graisse | Hauteur de ligne | Autres | Largeur | Origine | Rôle candidat |
|---|---|---|---|---|---|---|---|---|---|---|
| 17 | Parcours | aide sous un champ (mot de passe) | `.parcours-aide` | 13px → 13 px | 600 | absente | - | toutes | en dur | Aide, erreur et message |
| 125 | Parcours : Choix du profil | carte de profil (bouton conteneur) | `.profil-carte` | - | - | absente | famille --font-body | toutes | variable (famille) | Conteneur (valeur héritée par les enfants) |
| 157 | Parcours : Choix du profil | titre de la carte de profil | `.profil-carte-titre` | 20px → 20 px | 800 | absente | - | toutes | en dur | Titre de carte ou de bloc |
| 162 | Parcours : Choix du profil | description de la carte de profil | `.profil-carte-description` | 14px → 14 px | 500 | 1.35 → 18,9 px | - | toutes | en dur | Méta |
| 192 | Parcours : Création du compte | « Plus qu'une étape, [Prénom] » | `.compte-bloc-titre` | 28px → 28 px | 800 | 1.1 → 30,8 px | - | toutes | en dur | Titre de carte ou de bloc |
| 199 | Parcours : Création du compte | texte du bloc lavande | `.compte-bloc-texte` | 15px → 15 px | 600 | absente | - | toutes | en dur | Sous-titre et texte secondaire |
