# Audit des espacements réellement utilisés

Relevé fait le 2026-10-22 sur la branche `regles-iteration-2`, à partir du CSS (aucun style d'espacement en ligne dans le JSX des écrans couverts : les seuls `style={{…}}` posent des largeurs de barre de progression ou des placements de grille).

Écrans couverts : Cours, Détail d'un thème, Terrain, dashboard apprenant, fiche de cours (leçon, quiz, fin de quiz, checklist, récap), Mes cours et Détail cours côté formateur, Connexion.

Échelle de référence (`tokens/espacements.tokens.json`) : 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40. Une valeur marquée **hors échelle** n'est pas un de ces paliers. Les réserves d'objets 3D, débords d'illustration, marges de page desktop et zones d'action mesurées sont hors échelle par choix du token ; elles sont relevées mais marquées « exemptée ».

**Constat général** : sur ces écrans, aucun espacement n'utilise `var(--espace-N)`, sauf le padding horizontal des boutons `bouton-primaire`, `bouton-secondaire`, `bouton-orange` et `bouton-ajouter` (`var(--espace-24)`, `src/styles/shared.css:190, 221, 253, 382`). Tout le reste est en dur. Dans le tableau, « dur » signifie valeur en px écrite directement.

Abréviations de colonnes : **M** = mobile, **D** = desktop (≥ 768 px). Les numéros de ligne renvoient au fichier indiqué.

---

## 1. Relevé par écran

### 1.1 Socle commun (`src/styles/espace-layout.css`, `src/styles/shared.css`)

| Entre quoi et quoi | Valeur | Source | Fichier:ligne |
|---|---|---|---|
| Bord d'écran et contenu (haut, M) | zone de sécurité + 20 | dur | espace-layout.css:83 |
| Bord d'écran et contenu (côtés, M) | 16 | dur | espace-layout.css:83 |
| Contenu et bas d'écran (réserve tab bar, M) | 112 + zone de sécurité | dur (exemptée) | espace-layout.css:83 |
| Bord d'écran et contenu (D) | 104 haut, 40 côtés, 40 bas | dur (exemptée) | espace-layout.css:341 |
| Conteneur étroit, marges latérales (D) | 24 | dur | espace-layout.css:346 |
| Deux blocs consécutifs d'une page (défaut `.espace-page`) | 20 | dur | espace-layout.css:142 |
| Premier enfant de page et bloc suivant (marge ajoutée au gap) | 12 | dur | espace-layout.css:146 |
| Titre h2 de section et contenu (défaut `section`) | 12 | dur | espace-layout.css:159 |
| Pastille de statut : icône et libellé | 5 (4 pour En cours / Terminé) | dur | espace-layout.css:248, 272 |
| Pastille de statut : padding | 5 × 12 (0 pour En cours / Terminé) | dur | espace-layout.css:250, 273 |
| Bouton principal / secondaire : padding horizontal | 24 | `--espace-24` | shared.css:190, 221 |
| Bouton principal / secondaire : icône et libellé | 8 | dur | shared.css:188, 219 |
| Bouton principal : marge au-dessus (défaut) | 8 | dur | shared.css:199 |
| Champ `.champ` : libellé et input | 6 | dur | shared.css:124 |
| Champ `.champ` : padding horizontal de l'input | 18 | dur, hors échelle | shared.css:131 |

### 1.2 Cours (`src/pages/SectionCours.css`, `src/components/EntetePage.css`, `src/components/BlocFormateur.css`, `src/components/LigneCours.css`)

| Entre quoi et quoi | M | D | Source | Fichier:ligne |
|---|---|---|---|---|
| Deux blocs de page (en-tête, De ton formateur, Thèmes) | 20 | 20 | dur | SectionCours.css:4 |
| Marge sous le premier enfant (annule le 12 du socle) | 0 | 0 | dur | SectionCours.css:8 |
| Bord du bloc lavande et contenu | 22 haut, 20 côtés, 20 bas | 32 × 36 | dur ; 22 et 36 hors échelle | EntetePage.css:7, 66 |
| Titre (H1) et sous-titre dans le bloc lavande | 6 | 6 | dur | EntetePage.css:25 |
| Bloc titres et champ de recherche | 16 | 16 | dur | EntetePage.css:6 |
| Réserve à droite du texte pour l'objet 3D | 92 | 200 | dur (exemptée) | EntetePage.css:26, 85 |
| Objet 3D et bord du cadre | 12 haut, 14 droite | centré, 48 droite | dur (exemptée) | EntetePage.css:15, 73 |
| Champ de recherche : padding horizontal | 20 | 20 | dur | EntetePage.css:43 |
| Bloc De ton formateur : bord et contenu | 16 haut, 18 côtés, 10 bas | idem | dur ; 18 hors échelle | BlocFormateur.css:6 |
| Bloc De ton formateur : en-tête et liste | 4 | 4 | dur | BlocFormateur.css:5 |
| Pastille encre et titre de l'en-tête | 10 | 10 | dur | BlocFormateur.css:15 |
| Deux lignes du bloc (padding vertical de ligne) | 8 | 8 | dur | BlocFormateur.css:65 |
| Vignette, texte, chevron d'une ligne | 12 | 12 | dur | BlocFormateur.css:62 |
| Titre et pastille de statut d'une ligne | 12 (côte à côte) | 6 (empilés) | dur | BlocFormateur.css:86, 132 |
| Deux colonnes de lignes | — | 28 | dur, hors échelle | BlocFormateur.css:104 |
| Chevron et haut de ligne (centrage sur la vignette) | — | 14 | dur, hors échelle | BlocFormateur.css:126 |
| Titre « Thèmes » et grille (section) | 12 | 12 | dur | SectionCours.css:14 |
| Deux cartes de thème | 10 | 16 | dur | SectionCours.css:34, 121 |
| Carte de thème : bord et contenu | 14 haut/droite/bas, 16 gauche | 20 | dur ; 14 hors échelle | SectionCours.css:45, 126 |
| Carte de thème : éléments empilés (objet, Thème N, nom) | 4 | 4 | dur | SectionCours.css:42 |
| Rangée objet + chevron et « Thème N » | 6 (+ 4 du gap) | idem | dur | SectionCours.css:72 |
| Nom du thème et compteur du bas (minimum) | 8 (padding-top, marge auto) | idem | dur | SectionCours.css:100 |
| Titre « N résultats » et liste (recherche) | 12 | 12 | dur | SectionCours.css:14 |
| Liste de résultats : bord de carte et lignes | 4 × 16 | 8 × 28 | dur ; 28 hors échelle | LigneCours.css:4, 74 |
| Deux lignes de résultat (padding vertical de ligne) | 12 | 12 | dur | LigneCours.css:21 |
| Vignette, texte, statut, chevron d'une ligne | 12 | 12 | dur | LigneCours.css:18 |
| Titre et sous-titre d'une ligne | 3 | 3 | dur, hors échelle | LigneCours.css:41 |
| Deux colonnes de résultats | — | 40 | dur | LigneCours.css:73 |
| Chevron et haut de ligne | 14 | 16 | dur ; 14 hors échelle | LigneCours.css:63, 105 |
| Message « Aucun cours ne correspond » et titre au-dessus | 8 (+ 12 de section) | idem | dur | SectionCours.css:25 |

### 1.3 Détail d'un thème (`src/pages/DetailTheme.css`)

| Entre quoi et quoi | M | D | Source | Fichier:ligne |
|---|---|---|---|---|
| Bouton Retour et bloc lavande ; bloc lavande et liste (gap de page) | 16 | 16 | dur | DetailTheme.css:4 |
| Marge sous le premier enfant (annulée) | 0 | 0 | dur | DetailTheme.css:8 |
| Bloc lavande : bord et contenu | 22 × 20 | 22 × 20 (pas de variante desktop) | dur ; 22 hors échelle | DetailTheme.css:45 |
| « Thème N », titre, compteur (empilés) | 6 | 6 | dur | DetailTheme.css:44 |
| Réserve à droite du texte pour l'objet 3D | 100 | 100 | dur (exemptée) | DetailTheme.css:62, 74 |
| Objet 3D et bord du cadre | 16 haut, 16 droite | idem | dur (exemptée) | DetailTheme.css:53 |
| Liste : bord de carte et lignes | 6 haut/bas, 18 côtés | idem | dur ; 18 hors échelle | DetailTheme.css:95 |
| Deux lignes de la liste (padding vertical de ligne) | 14 | 14 | dur, hors échelle | DetailTheme.css:111 |
| Texte, statut, chevron d'une ligne | 12 | 12 | dur | DetailTheme.css:108 |
| Titre et sous-titre d'une ligne | 3 | 3 | dur, hors échelle | DetailTheme.css:131 |
| État vide et bloc lavande | 16 (gap de page) | 16 | dur | DetailTheme.css:4 |

### 1.4 Terrain (`src/pages/SectionModeTerrain.css`, `EntetePage.css`, `LigneCours.css`)

| Entre quoi et quoi | M | D | Source | Fichier:ligne |
|---|---|---|---|---|
| Bloc lavande et liste (gap de page) | 20 | 20 | dur | SectionModeTerrain.css:4 |
| Marge sous le premier enfant (annulée) | 0 | 0 | dur | SectionModeTerrain.css:8 |
| Bloc lavande | voir Cours (même composant `EntetePage`) | | | |
| Liste, lignes, colonnes, chevron | voir Cours (même composant `LigneCours`) | | | |

### 1.5 Dashboard apprenant (`src/pages/Dashboard.css`, `BlocFormateur.css`)

| Entre quoi et quoi | M | D | Source | Fichier:ligne |
|---|---|---|---|---|
| En-tête et premier bloc (gap de page) | 12 | 24 | dur | Dashboard.css:4, 702 |
| Marge supplémentaire au-dessus de la grille de blocs | 0 | 24 (soit 48 en tout sous l'en-tête) | dur | Dashboard.css:728 |
| Marge sous le premier enfant (annulée) | 0 | 0 | dur | Dashboard.css:8 |
| En-tête : padding | 0 | 12 haut, 4 côtés | dur | Dashboard.css:706 |
| Salutation et bloc XP | 12 | 12 | dur | Dashboard.css:16 |
| Objet éclair et « N XP » | 4 | 6 | dur | Dashboard.css:27, 714 |
| Deux blocs | 12 | 20 | dur | Dashboard.css:42, 726 |
| Carte générique : bord et contenu | 18 × 20 | idem | dur ; 18 hors échelle | Dashboard.css:61 |
| Bloc de tête (A, C, B en tête) : bord et contenu | 20 | 32 | dur | Dashboard.css:329, 854 |
| Bloc de tête : rangées (anneau, texte, bouton) | 14 | 14 | dur, hors échelle | Dashboard.css:328 |
| Bloc de tête : lignes de texte (pastille, « Tu en es là », titre) | 4 | 6 | dur | Dashboard.css:344, 873 |
| Titre et phrase d'état (A) / méta (C) | 4 (marge) + 4 (gap) | 4 + 6 | dur | Dashboard.css:382, 420 |
| Débord de l'objet 3D au-dessus du bloc | 30 | 0 (dans la cellule) | dur (exemptée) | Dashboard.css:95, 741 |
| Réserve à droite pour l'objet 3D | 120 | 200 | dur (exemptée) | Dashboard.css:337, 415, 860, 878 |
| Bloc B (carte blanche) : éléments empilés | 6 | 6 | dur | Dashboard.css:392 |
| Bloc B : texte et bouton « Commencer » | 10 (+ 6) | idem | dur | Dashboard.css:403 |
| Quiz flash en tête (E) : bord et contenu | 22 haut, 20 côtés, 20 bas | 32 | dur ; 22 hors échelle | Dashboard.css:430, 854 |
| Quiz flash en tête : éléments empilés | 8 | 8 | dur | Dashboard.css:429 |
| Quiz flash en tête : phrase et bouton | 8 (+ 8) | idem | dur | Dashboard.css:443 |
| Quiz flash en ligne (F) : bord et contenu | 18 haut/droite/bas, 20 gauche | 28 (colonne étroite) | dur ; 18, 28 hors échelle | Dashboard.css:454, 918 |
| Quiz flash en ligne : éclair, texte, bouton | 12 | 10 (colonne étroite) | dur | Dashboard.css:453, 917 |
| Quiz flash en ligne : titre et méta | 2 | 10 | dur | Dashboard.css:467, 928 |
| Quiz flash verrouillé (G) : bord et contenu | 16 haut, 18 droite, 16 bas, 16 gauche | bande : 18 × 24 × 18 × 20 | dur ; 18 hors échelle | Dashboard.css:499, 835 |
| Quiz flash verrouillé : éléments | 12 ; texte 6 ; titres 6 ; barre et compteur 8 | bande : texte 24 | dur | Dashboard.css:498, 530, 537, 553, 842 |
| Barre de progression et compteur (H) | 10 | 10 | dur | Dashboard.css:281 |
| Prochain badge (H) : bord et contenu | 18 haut/droite/bas, 20 gauche | vertical : 24 | dur ; 18 hors échelle | Dashboard.css:559, 796 |
| Prochain badge : rangées | 12 | vertical : 14 | dur ; 14 hors échelle | Dashboard.css:558, 795 |
| Prochain badge : vignette et texte | 14 | vertical : 16 | dur ; 14 hors échelle | Dashboard.css:565, 802 |
| Prochain badge : nom et condition | 3 | 3 | dur, hors échelle | Dashboard.css:594 |
| Rangée des 6 mini-badges | 6 | 6 | dur | Dashboard.css:600 |
| Collection complète (I) : rangées ; en-tête ; badges | 14 ; 12 ; 6 | badges en grille : 12 vertical | dur ; 14 hors échelle | Dashboard.css:646, 653, 659, 778 |
| Bibliothèque terminée (K) : éléments | 6 | 6 | dur | Dashboard.css:691 |
| De ton formateur (D) | voir Cours (`BlocFormateur`, version 1 colonne) | | | |
| Modale Mes badges : bord et contenu | 24 × 20 | 28 | dur ; 28 hors échelle | Dashboard.css:971, 1060 |
| Modale : en-tête et grille | 16 | 16 | dur | Dashboard.css:967 |
| Modale : deux badges de la grille | 16 vertical, 12 horizontal | idem | dur | Dashboard.css:1000 |
| Modale : badge, padding ; pastille et nom ; nom et condition | 10 × 6 ; 6 (+4) ; 4 | idem | dur | Dashboard.css:1011, 1012, 1030 |
| Pastille « De ton formateur » : padding ; icône et libellé | 6 × 12 × 6 × 8 ; 6 | idem | dur | Dashboard.css:184, 185 |
| Pastille orange « Défi du jour » : padding | 6 × 12 | idem | dur | Dashboard.css:200 |
| Bouton blanc à flèche : padding | 0 × 6 × 0 × 22 | 0 × 6 × 0 × 24 | dur ; 22 hors échelle | Dashboard.css:215, 900 |

### 1.6 Fiche de cours (`src/pages/FicheCours.css`, `src/components/ReperEtapes.css`)

**Cadre et en-tête (leçon, checklist, récap)**

| Entre quoi et quoi | M | D | Source | Fichier:ligne |
|---|---|---|---|---|
| Bord d'écran et contenu | zone de sécurité + 20 haut, 16 côtés, 40 + zone de sécurité bas | 40 × 40 × 56 (104 haut avec la barre) | dur ; 56, 104 exemptées | FicheCours.css:5, 1353, 1357 |
| Bouton Retour et bloc lavande ; deux blocs de la colonne | 16 | 16 | dur | FicheCours.css:17 |
| Bloc lavande : bord et contenu | 22 haut, 20 côtés, 20 bas | 28 × 32 | dur ; 22, 28 hors échelle | FicheCours.css:192, 1365 |
| Thème, titre, durée (empilés) | 6 | 6 | dur | FicheCours.css:191 |
| Sous-titre (durée) et repère d'étapes | 6 (marge) + 10 (marge du repère) + 6 (gap) | idem | dur | FicheCours.css:231, 238 |
| Réserve à droite pour l'objet 3D | 100 | 150 | dur (exemptée) | FicheCours.css:209, 1379 |
| Repère d'étapes : bord et contenu | 14 haut, 8 côtés, 12 bas | idem | dur ; 14 hors échelle | ReperEtapes.css:4 |
| Repère : pastille et libellé | 6 | 6 | dur | ReperEtapes.css:33 |
| Bandeau Aperçu élève : padding ; éléments ; marge sous le bandeau | 8 × 16 ; 12 ; 16 | 10 × 40 ; 12 ; 24 | dur | FicheCours.css:98-100, 123-124 |

**Leçon**

| Entre quoi et quoi | M | D | Source | Fichier:ligne |
|---|---|---|---|---|
| Carte de leçon : bord et contenu | 22 × 20 | 32 × 36 | dur ; 22, 36 hors échelle | FicheCours.css:247, 1383 |
| Contenu et encadré « À retenir » | 24 | 24 | dur | FicheCours.css:246 |
| Intertitre H2 de la leçon : au-dessus / en dessous | 28 / 10 | idem | dur ; 28 hors échelle | FicheCours.css:263 |
| À retenir : bord et contenu | 18 × 20 | idem | dur ; 18 hors échelle | FicheCours.css:279 |
| À retenir : en-tête et puces | 12 | 12 | dur | FicheCours.css:278 |
| À retenir : pastille ampoule et titre | 10 | 10 | dur | FicheCours.css:287 |
| À retenir : deux puces ; retrait des puces | 6 ; 22 | idem | dur ; 22 hors échelle | FicheCours.css:316, 318 |
| Carte Étape suivante : bord et contenu | 20 | 24 × 24 × 24 × 28 | dur ; 28 hors échelle | FicheCours.css:329, 1396 |
| Carte Étape suivante : libellé, titre, détail | 6 | 6 | dur | FicheCours.css:328, 338 |
| Carte Étape suivante : détail et bouton | 10 (+ 6) | texte et bouton côte à côte : 24 | dur | FicheCours.css:355, 1395 |
| Bouton blanc à flèche : padding ; libellé et flèche | 0 × 6 × 0 × 22 | 0 × 6 × 0 × 24 ; 16 | dur ; 22 hors échelle | FicheCours.css:367, 1410-1411 |

**Quiz et fin de quiz**

| Entre quoi et quoi | M | D | Source | Fichier:ligne |
|---|---|---|---|---|
| Bouton Quitter, barre, compteur | 12 | 12 | dur | FicheCours.css:406 |
| Barre du haut et bloc question | 8 (padding) + 16 (colonne) | idem | dur | FicheCours.css:420 |
| Libellé du cours, question, aide | 8 | 8 | dur | FicheCours.css:419 |
| Deux réponses | 10 | 10 | dur | FicheCours.css:451 |
| Réponse : padding ; contrôle et texte | 12 × 16 ; 12 | idem | dur | FicheCours.css:459, 461 |
| Pastille de réponse : padding ; icône et libellé | 4 × 10 ; 4 | idem | dur | FicheCours.css:595, 597 |
| Dernière réponse et bloc encre de correction | 30 (débord de l'objet compris) | idem | dur (exemptée) | FicheCours.css:625 |
| Bloc de correction : bord et contenu ; éléments | 22 × 20 ; 8 | idem | dur ; 22 hors échelle | FicheCours.css:624, 626 |
| Barre d'action fixe : côtés ; bas ; dégradé au-dessus | 16 ; 16 + zone de sécurité ; 24 | idem | dur | FicheCours.css:136, 145 |
| Fin de quiz : libellé et anneau | 16 | 16 | dur | FicheCours.css:760 |
| Fin de quiz : anneau et titre | 28 | 28 | dur, hors échelle | FicheCours.css:797 |
| Fin de quiz : titre et sous-titre | 8 | 8 | dur | FicheCours.css:804 |
| Fin de quiz : sous-titre et pastille XP | 20 | 20 | dur | FicheCours.css:814 |
| Pastille XP : padding ; éclair et libellé | 6 × 16 × 6 × 8 ; 6 | idem | dur | FicheCours.css:813, 815 |
| Pastille XP et carte badge | 32 + 40 de débord | idem | dur (débord exempté) | FicheCours.css:835 |
| Deux cartes badge | 16 + 40 de débord | idem | dur | FicheCours.css:845 |
| Carte badge : padding | 20 × 20 × 20 × 136 | idem | dur (réserve exemptée) | FicheCours.css:836 |
| Carte badge : pastille, nom, condition | 4 | 4 | dur | FicheCours.css:862 |
| Contenu et bouton principal | barre fixe (M) | 32 | dur | FicheCours.css:1451 |
| Bouton et liens ; deux liens | 8 ; 24 | idem | dur | FicheCours.css:899, 900 |
| Revoir mes erreurs : liste ; deux cartes ; carte padding ; éléments | 16 ; 12 ; 18 ; 6 | idem | dur ; 18 hors échelle | FicheCours.css:926-938 |

**Checklist**

| Entre quoi et quoi | M | D | Source | Fichier:ligne |
|---|---|---|---|---|
| Bouton rond Retour et titres | 12 | 12 | dur | FicheCours.css:1011 |
| Thème et titre (en-tête compact) | 2 | 2 | dur | FicheCours.css:1017 |
| Carte de progression : bord et contenu ; éléments ; compteur et XP | 18 × 20 ; 10 ; 12 | idem | dur ; 18 hors échelle | FicheCours.css:1039-1047 |
| Carte des étapes : bord et contenu ; éléments | 10 × 16 ; 12 | idem | dur | FicheCours.css:1064, 1065 |
| Consigne et liste | 8 (+ 12) | idem | dur | FicheCours.css:1069 |
| Deux étapes | 4 (gap) + 10 (padding vertical de chaque étape) | idem | dur | FicheCours.css:1077, 1087 |
| Pastille d'étape et intitulé | 12 | 12 | dur | FicheCours.css:1086 |
| Alignement de l'intitulé sur la pastille | 3 (2 pour l'étape en cours) | idem | dur, hors échelle | FicheCours.css:1160, 1193 |
| Étape en cours : padding ; débord latéral ; marge verticale | 16 × 14 ; -8 ; 4 | idem | dur ; 14 hors échelle | FicheCours.css:1177, 1178 |
| Étape en cours : intitulé, pastille Bloquante, critère, bouton | 8 (+ 4 avant le bouton) | idem | dur | FicheCours.css:1188, 1215 |
| Pastille Bloquante : padding | 4 × 10 | idem | dur | FicheCours.css:1200 |
| Lien « Passer cette étape » : padding horizontal | 8 | 8 | dur | FicheCours.css:1139 |

**Récap**

| Entre quoi et quoi | M | D | Source | Fichier:ligne |
|---|---|---|---|---|
| Mention Terminé et XP ; marge au-dessus | 14 ; 6 | idem | dur ; 14 hors échelle | FicheCours.css:1257, 1258 |
| Liste : bord de carte et lignes | 4 × 18 | idem | dur ; 18 hors échelle | FicheCours.css:1276 |
| Deux lignes (padding vertical de ligne) | 14 | 14 | dur, hors échelle | FicheCours.css:1284 |
| Texte et bouton d'une ligne | 12 | 12 | dur | FicheCours.css:1283 |
| Titre et sous-titre d'une ligne | 2 | 2 | dur | FicheCours.css:1295 |
| Bouton de ligne : padding horizontal | 18 | 18 | dur, hors échelle | FicheCours.css:1311 |
| Carte Suite du thème : bord et contenu ; éléments ; texte et bouton | 22 × 20 ; 6 ; 10 (+ 6) | idem | dur ; 22 hors échelle | FicheCours.css:1320-1346 |

### 1.7 Mes cours, formateur (`src/components/formateur/Formateur.css`, `src/pages/FormateurListes.css`)

| Entre quoi et quoi | M | D | Source | Fichier:ligne |
|---|---|---|---|---|
| En-tête, filtres, grille (gap de page) | 24 | 24 | dur | Formateur.css:4 |
| Marge sous le premier enfant (annulée) | 0 | 0 | dur | Formateur.css:8 |
| Bloc titres et bouton « + Créer un cours » | 16 | 16 | dur | Formateur.css:15 |
| Titre (H1) et sous-titre « X cours · Y assignés » | 6 | 6 | dur | Formateur.css:21 |
| Deux filtres | 12 | 12 | dur | Formateur.css:225 |
| Deux cartes de cours | 14 | 16 | dur ; 14 hors échelle | FormateurListes.css:6, 122 |
| Carte de cours : bord et contenu | 20 | 24 | dur | FormateurListes.css:18, 131 |
| Carte de cours : texte et pastilles | 14 | 14 | dur, hors échelle | FormateurListes.css:15 |
| Titre et sous-titre d'une carte | 8 | 8 | dur | FormateurListes.css:49 |
| Deux pastilles de groupe ; padding d'une pastille | 6 ; 4 × 10 | idem | dur | Formateur.css:167, 173 |

### 1.8 Détail cours, formateur (`src/pages/DetailCoursFormateur.css`, `Formateur.css`)

| Entre quoi et quoi | M | D | Source | Fichier:ligne |
|---|---|---|---|---|
| Bouton Retour et en-tête ; deux cartes de section (gap de page) | 24 | 24 | dur | Formateur.css:4 |
| Barre du haut : Retour et menu « … » | 12 | 12 | dur | DetailCoursFormateur.css:7 |
| Bloc titre et actions | 16 | 16 (côte à côte) | dur | DetailCoursFormateur.css:13 |
| Titre et rangée de pastilles | 12 | 12 | dur | DetailCoursFormateur.css:19 |
| Deux boutons d'action | 10 | 10 | dur | DetailCoursFormateur.css:38 |
| Carte de section : bord et contenu | 20 | 28 | dur ; 28 hors échelle | Formateur.css:44, 458 |
| Carte de section : en-tête et contenu | 16 | 16 | dur | Formateur.css:43 |
| En-tête de section : titres et chevron | 12 | 12 | dur | DetailCoursFormateur.css:176 |
| Titre de section et ligne d'info | 2 (empilés) | 12 (côte à côte) | dur | DetailCoursFormateur.css:184, 155 |
| Avancement : barre et chiffres | 16 | 28 | dur ; 28 hors échelle | DetailCoursFormateur.css:56, 412 |
| Avancement : barre empilée et légende | 12 | 12 | dur | DetailCoursFormateur.css:62 |
| Barre empilée : deux segments | 3 | 3 | dur, hors échelle | DetailCoursFormateur.css:68 |
| Légende : deux entrées ; point et libellé | 8 vertical, 18 horizontal ; 6 | idem | dur ; 18 hors échelle | DetailCoursFormateur.css:92, 104 |
| Deux petites cartes de chiffre ; padding ; libellé et chiffre | 10 ; 14 × 16 ; 6 | idem | dur ; 14 hors échelle | DetailCoursFormateur.css:117-124 |
| Leçon : texte et miniatures ; paragraphe et miniatures | 16 ; 14 | texte et À retenir : 24 | dur ; 14 hors échelle | DetailCoursFormateur.css:201, 207, 427 |
| Deux miniatures | 8 | 8 | dur | DetailCoursFormateur.css:218 |
| À retenir : bord et contenu ; éléments ; pastille et titre | 18 × 20 ; 10 ; 10 | idem | dur ; 18 hors échelle | DetailCoursFormateur.css:254-263 |
| À retenir : deux puces ; retrait | 6 ; 20 | idem | dur | DetailCoursFormateur.css:291, 293 |
| Deux questions / étapes (padding vertical de ligne) | 12 | 12 | dur | DetailCoursFormateur.css:311 |
| Numéro et texte d'une question / étape | 12 | 12 | dur | DetailCoursFormateur.css:310 |
| Énoncé et bonnes réponses | 6 | 6 | dur | DetailCoursFormateur.css:335 |
| Coche et libellé d'une bonne réponse ; alignement de la coche | 6 ; 3 | idem | dur ; 3 hors échelle | DetailCoursFormateur.css:352, 362 |

### 1.9 Connexion (`src/components/GabaritParcours.css`, `src/pages/parcours/Parcours.css`)

| Entre quoi et quoi | M | D | Source | Fichier:ligne |
|---|---|---|---|---|
| Bord d'écran et contenu | zone de sécurité + 20 haut, 16 côtés | colonne 440, page 48 × 16 | dur ; 48 exemptée | GabaritParcours.css:23, 367 |
| Barre (Retour + logo), contenu, zone d'action | 24 | 24 | dur | GabaritParcours.css:16 |
| Titre et formulaire (gap du contenu) | 20 | 20 | dur | GabaritParcours.css:46 |
| Titre (H1) et sous-titre | 8 | 8 | dur | GabaritParcours.css:199 |
| Deux champs du formulaire | 20 | 20 | dur | Parcours.css:6 |
| Libellé et champ | 8 | 8 | dur | GabaritParcours.css:220 |
| Champ : padding horizontal | 22 | 22 | dur, hors échelle | GabaritParcours.css:239 |
| Champ mot de passe et « Mot de passe oublié ? » | 20 - 8 = 12 | idem | dur (marge négative) | Parcours.css:24 |
| Liens texte : padding horizontal | 8 | 8 | dur | GabaritParcours.css:99 |
| Zone d'action : bords d'écran ; bas | 16 ; 24 + zone de sécurité | dans le flux | dur | GabaritParcours.css:53-55 |
| Bouton principal et lien secondaire | 10 | 8 | dur | GabaritParcours.css:59, 386 |
| Contenu et zone d'action | hauteur mesurée + 24 | 8 (marge) + 24 (gap) | dur (exemptée en mobile) | GabaritParcours.css:23, 388 |

---

## 2. Séparateurs

Tous les séparateurs relevés ont la même épaisseur et le même token : **1 px solid `var(--bordure-separateur)`**. Le token change de couleur selon le mode (sable apprenant, ardoise formateur) mais le nom est le même partout.

| Écran | Entre quoi | Propriété | Fichier:ligne |
|---|---|---|---|
| Cours (recherche), Terrain | deux lignes de `LigneCours` (M) | `border-top` sur `li + li` | LigneCours.css:11 |
| Cours (recherche), Terrain | lignes en 2 colonnes (D) | `border-bottom`, retiré sur les 2 derniers `li` | LigneCours.css:82, 87 |
| Détail d'un thème | deux lignes de cours | `border-top` sur `li + li` | DetailTheme.css:102 |
| Cours, dashboard | deux lignes de « De ton formateur » (1 colonne) | `border-top` sur `li + li` | BlocFormateur.css:56 |
| Cours | lignes en 3 colonnes (D) | `border-bottom`, retiré sur la dernière rangée | BlocFormateur.css:112, 117 |
| Fiche, récap | deux lignes de partie | `border-top` sur `ligne + ligne` | FicheCours.css:1288 |
| Détail cours (formateur) | deux questions, deux étapes | `border-top` sur `+` | DetailCoursFormateur.css:316 |

Pas de séparateur sur le dashboard apprenant (hors bloc « De ton formateur »), la checklist (étapes séparées par l'espacement), Mes cours (cartes) ni la Connexion.

Écarts de 3 px qui ne sont pas des séparateurs, à ne pas confondre : liaison du repère d'étapes (hauteur 3, `ReperEtapes.css:13`), espace entre segments de la barre empilée (`DetailCoursFormateur.css:68`).

---

## 3. Bouton Retour

| Écran | Classe | Forme | Hauteur | Padding | Écart chevron / libellé | Libellé | Chevron | Fichier:ligne |
|---|---|---|---|---|---|---|---|---|
| Détail d'un thème | `theme-retour` | pilule blanche, chevron + « Cours » | 44 (min) | 0 × 18 droite × 0 × 12 gauche | 6 | 15 px, 800 | 18 × 18 | DetailTheme.css:15-37 |
| Fiche (leçon, récap) | `fiche-retour` | pilule blanche, chevron + nom court du thème | 44 (min) | 0 × 18 × 0 × 12 | 6 | 15 px, 800 | 18 × 18 | FicheCours.css:162-187 |
| Fiche (checklist, quiz, fin de quiz) | `fiche-bouton-rond` | rond blanc, icône seule | 46 × 46 | 0 | — | — | voir icône du composant | FicheCours.css:64-66 |
| Détail cours, formateur (M) | `fm-retour` + `fm-retour-rond` | rond blanc, icône seule | 44 × 44 | 0 | — | — | 20 × 20 | Formateur.css:131-156 |
| Détail cours, formateur (D) | `fm-retour` + `fm-retour-texte` | lien texte violet, sans chevron (le rond est masqué) | 44 (min) | 0 | — | 15 px, 800, `texte-accent` | aucun | Formateur.css:158-160, 466-472 |
| Connexion | `parcours-bouton-rond` | rond blanc, icône seule | 56 × 56 | 0 | — | — | 22 × 22 | GabaritParcours.css:151-170 |
| Socle (ancien) | `lien-retour` | lien texte | 44 (min) | 0 | — | 0,85 rem (13,6 px), 600 | — | shared.css:318-326 |

Le Détail cours formateur ne contient le texte « Mes cours » que sur desktop ; le relevé du libellé d'un chevron + texte n'existe que pour `theme-retour` et `fiche-retour`, qui sont identiques mais déclarés deux fois.

Cours, Terrain, Mes cours et le dashboard apprenant n'ont pas de bouton Retour (pages de niveau 0).

---

## 4. Textes récurrents

Poids : quand rien n'est déclaré, le texte hérite de `body` (500, `src/index.css`) ; dans un `<button>` sans `font: inherit`, il prend la valeur du navigateur (400), noté « 400 (bouton) ».

### 4.1 Sur-titre (« Thème N » et libellés au-dessus d'un titre)

| Écran | Élément | Taille M / D | Graisse | Fichier:ligne |
|---|---|---|---|---|
| Détail d'un thème | « Thème N » | 13 / 13 | 700 | DetailTheme.css:66 |
| Cours | « Thème N » dans la carte | 12 / 13 | 700 | SectionCours.css:81, 136 |
| Fiche leçon | thème complet | 13 / 13 | 700 | FicheCours.css:213 |
| Fiche checklist | thème | 12 / 12 | 700 | FicheCours.css:1022 |
| Fiche quiz | libellé du cours | 13 / 13 | 700 | FicheCours.css:424 |
| Fiche, Étape suivante / Suite du thème | libellé | 13 / 13 | 700 | FicheCours.css:342, 1328 |
| Fin de quiz | « Quiz terminé », titre de barre | 13 / 13 | 700 | FicheCours.css:708, 752 |
| Dashboard | libellé violet (« Ton premier cours ») | 13 / 13 | 700 | Dashboard.css:129 |
| Dashboard | libellé sur violet (« Tu en es là ») | 13 / 15 | 700 | Dashboard.css:135, 882 |

### 4.2 Titre de page

| Écran | Élément | Taille M / D | Graisse | Source | Fichier:ligne |
|---|---|---|---|---|---|
| Cours, Terrain, dashboard (« Salut … »), Mes cours | H1 `.espace-page h1` / `.fm-titres h1` | 34 / 44 | 800 | `--taille-h1` | espace-layout.css:150 ; Formateur.css:28 |
| Connexion | H1 `parcours-titre` | 34 / 44 | 800 | `--taille-h1` | GabaritParcours.css:204 |
| Détail d'un thème | H1 nom du thème | 28 / 32 | 800 | dur (mêmes valeurs que `--taille-titre-cours`) | DetailTheme.css:75, 153 |
| Fiche | H1 titre du cours | 28 / 32 | 800 | `--taille-titre-cours` | FicheCours.css:220 |
| Détail cours, formateur | H1 titre du cours | 28 / 32 | 800 | dur (mêmes valeurs que `--taille-titre-cours`) | DetailCoursFormateur.css:25, 389 |
| Dashboard | titre du bloc de tête | 26 / 32 | 800 | dur / `--taille-titre-cours` | Dashboard.css:355, 886 |
| Fin de quiz | titre | 30 / 30 | 800 | dur | FicheCours.css:798 |

### 4.3 Sous-titre de page et compteurs

| Écran | Élément | Taille M / D | Graisse | Fichier:ligne |
|---|---|---|---|---|
| Cours, Terrain | sous-titre du bloc lavande (« X thèmes terminés sur 12 ») | 14 / 16 | 700 | EntetePage.css:35, 89 |
| Détail d'un thème | « x cours terminés sur y » | 14 / 14 | 700 | DetailTheme.css:88 |
| Fiche leçon | « N min de lecture » | 14 / 14 | 700 | FicheCours.css:232 |
| Mes cours, Détail cours | « X cours · Y assignés » | 15 / 15 | 600 | Formateur.css:35 |
| Connexion | sous-titre | 16 / 16 | 500 | GabaritParcours.css:211 |
| Cours | compteur « N cours » de De ton formateur | 14 / 14 | 700 | BlocFormateur.css:44 |
| Cours | compteur de carte de thème (« y cours ») | 13 / 14 | 700 (800 si commencé) | SectionCours.css:104, 110, 144 |
| Dashboard | « N XP » | 17 / 20 | 800 | Dashboard.css:29, 715 |
| Dashboard | compteur de barre (« X / 3 ») | 14 (12 petit) | 800 | Dashboard.css:316, 321 |
| Dashboard | compteur de la modale « X/6 » | 15 | 800 | Dashboard.css:992 |
| Fiche quiz | « 3 / 5 » | 15 | 800 | FicheCours.css:411 |
| Fiche checklist | « X étapes sur N » ; « +15 XP à la fin » | 20 ; 14 | 800 ; 700 | FicheCours.css:1051, 1056 |
| Connexion (questions) | compteur « 2 / 5 » | 18 | 800 | GabaritParcours.css:191 |

### 4.4 Titre de section (h2)

| Écran | Élément | Taille M / D | Graisse | Fichier:ligne |
|---|---|---|---|---|
| Cours | « Thèmes », « N résultats » | 22 / 28 | 800 | SectionCours.css:19, 116 |
| Cours, dashboard | « De ton formateur » | 18 / 18 | 800 | BlocFormateur.css:21 |
| Dashboard | titre de carte (`dash-titre-carte`) | 22 | 800 | Dashboard.css:141 |
| Dashboard | Quiz flash en ligne ; verrouillé | 19 (28 colonne étroite) ; 17 | 800 | Dashboard.css:472, 932, 542 |
| Fiche | « À retenir » | 17 | 800 | FicheCours.css:292 |
| Détail cours | titre de carte de section | 20 / 20 | 800 | Formateur.css:52 |
| Détail cours | « À retenir » (h3) | 17 | 800 | DetailCoursFormateur.css:268 |
| Socle | h2 par défaut de `.espace-page` | 1,05 rem (16,8 px) | 800 | espace-layout.css:165 |

### 4.5 Titre et sous-titre d'une ligne

| Écran | Titre : taille M / D, graisse | Sous-titre : taille, graisse | Fichier:ligne |
|---|---|---|---|
| Cours (recherche), Terrain (`LigneCours`) | 15 / 16, 800 | 13, 400 (bouton) | LigneCours.css:46, 53, 101 |
| Détail d'un thème | 16 / 16, 800 | 13, 400 (bouton) | DetailTheme.css:136, 143 |
| De ton formateur (Cours, dashboard) | 15 / 15, 800 | pastille de statut (voir ci-dessous) | BlocFormateur.css:93 |
| Carte de thème (Cours) | 15 / 18, 800 | — | SectionCours.css:88, 140 |
| Fiche, récap | 16, 800 | 13, 500 | FicheCours.css:1300, 1305 |
| Fiche, checklist (intitulé d'étape) | 16, 600 (17, 800 en cours) | critère 14, 500 | FicheCours.css:1161, 1194, 1210 |
| Mes cours (carte) | 18, 800 | 14, 600 | FormateurListes.css:60, 64 |
| Détail cours (question / étape) | 15, 800 (étape : 15, 600) | bonne réponse 14, 700 | DetailCoursFormateur.css:340, 372, 353 |
| Dashboard (carte) | — | `dash-sous-texte` 13, 600 ; méta quiz flash 13, 500 | Dashboard.css:147, 477 |
| Connexion (choix, profils) | ligne de choix 17, 600 (700 choisie) ; profil 20, 800 | description 14, 500 | GabaritParcours.css:293 ; Parcours.css:155, 160 |

Pastille de statut d'une ligne : « Non commencé », « À faire », « Nouveau » 0,75 rem (12 px), 700 ; « En cours », « Terminé » 13 px, 800 (`espace-layout.css:253, 275`).

### 4.6 État vide

| Écran | Texte | Taille | Graisse | Classe | Fichier:ligne |
|---|---|---|---|---|---|
| Terrain | « Aucune checklist terrain disponible pour le moment. » | 0,85 rem (13,6 px) | 500 | `dashboard-etat-vide` | shared.css:519 |
| Détail d'un thème | « Aucun cours pour le moment dans ce thème. » | 0,85 rem (13,6 px) | 500 | `dashboard-etat-vide` | shared.css:519 |
| Mes cours | « Aucun cours pour le moment. » / « … à ces filtres. » | 0,85 rem (13,6 px), centré sur mobile | 500 | `dashboard-etat-vide-centre` | shared.css:519, 526 |
| Cours (recherche) | « Aucun cours ne correspond à « … ». » | 15 | 500 | `page-cours-aucun-resultat` | SectionCours.css:27 |
| Détail cours | « Aucune question. », « Leçon vide. » | 15 | 500 | `fm-texte` | Formateur.css:65 |

À noter en passant : le texte d'état vide du Détail d'un thème dans le code (« Aucun cours pour le moment dans ce thème. ») diffère de celui décrit dans `CLAUDE.md` (« Aucun cours dans ce thème. »). Relevé seulement, rien n'est modifié.

---

## 5. Regroupement par rôle

Chaque rôle réunit les espacements qui décrivent la même relation entre deux éléments. ⚠ = plusieurs valeurs pour un même rôle. Les valeurs hors échelle sont en **gras**.

| # | Rôle | Valeurs trouvées (écran) | Plusieurs valeurs |
|---|---|---|---|
| R1 | Écart entre deux blocs d'une page | 12 M / 24 D (dashboard) ; 16 (Détail thème, fiche) ; 20 (socle, Cours, Terrain, contenu Connexion) ; 24 (Mes cours, Détail cours, colonne Connexion) | ⚠ 12, 16, 20, 24 |
| R2 | Marge ajoutée sous le premier élément de page | 12 (socle) ; 0 sur tous les écrans couverts ; 24 en plus au-dessus des blocs du dashboard desktop | ⚠ 0, 12, 24 |
| R3 | Bouton Retour et bloc d'en-tête | 16 (Détail thème, fiche) ; 24 (Détail cours, Connexion) | ⚠ 16, 24 |
| R4 | Padding d'un bloc d'en-tête lavande / de tête | M : **22** × 20 × 20 (Cours, Terrain, fiche, quiz flash E), **22** × 20 (Détail thème, Connexion compte), 20 (dashboard A/B/C) ; D : 32 × **36** (Cours, Terrain), **28** × 32 (fiche), 32 (dashboard), pas de variante (Détail thème) | ⚠ |
| R5 | Titre de page et sous-titre / compteur | 4 M, 6 D (dashboard) ; 6 (Cours, Terrain, Détail thème, fiche, Mes cours) ; 8 (Connexion, fin de quiz, bloc compte) ; 12 (titre et pastilles, Détail cours) | ⚠ 4, 6, 8, 12 |
| R6 | Bloc de titres et action / recherche de l'en-tête | 16 (recherche Cours, bouton Mes cours, actions Détail cours) | non |
| R7 | Padding d'une carte | 14×14×14×16 / 20 (carte thème) ; 16×18×10 (De ton formateur) ; 18×20 (dashboard, À retenir, progression checklist) ; 20 (Mes cours M, fm-carte M, Étape suivante M, profil) ; **22**×20 (leçon M, correction, Suite du thème) ; 24 (Mes cours D, badge vertical) ; **28** (fm-carte D, flash colonne, modale D) ; 32×**36** (leçon D) ; **14**×16 (petits chiffres) ; **18** (erreurs) | ⚠ une dizaine de combinaisons |
| R8 | Écart vertical entre éléments d'une carte | 4 (carte thème, carte badge) ; 6 (Étape suivante, Suite, bloc B, K) ; 8 (correction, quiz flash E) ; 10 (progression checklist, À retenir formateur) ; 12 (badge, À retenir fiche, carte étapes) ; **14** (bloc de tête, carte Mes cours, collection) ; 16 (fm-carte) ; 24 (leçon : contenu et À retenir) | ⚠ 4 à 24 |
| R9 | Texte d'une carte et son bouton | 6 + 10 = 16 (Étape suivante, Suite, bloc B) ; 8 + 8 = 16 (quiz flash E) ; 8 + 4 = 12 (étape en cours) ; 14 (bloc de tête) ; 24 côte à côte (Étape suivante D) | ⚠ 12, 14, 16, 24 (et 16 obtenu par deux sommes différentes) |
| R10 | Padding d'une carte de liste (bord et lignes) | 4×16 / 8×**28** (`LigneCours`) ; 6×**18** (Détail thème) ; 16×**18**×10 (De ton formateur) ; 4×**18** (récap) ; 10×16 (étapes de checklist) ; 0 (questions Détail cours, dans fm-carte 20 / **28**) | ⚠ |
| R11 | Deux lignes d'une liste (padding vertical de chaque ligne) | 8 (De ton formateur) ; 10 + 4 de gap (checklist) ; 12 (`LigneCours`, questions / étapes formateur) ; **14** (Détail thème, récap) | ⚠ 8, 10, 12, 14 |
| R12 | Éléments d'une ligne (vignette, texte, statut, chevron) | 12 partout (LigneCours, Détail thème, De ton formateur, récap, checklist, questions formateur, réponses de quiz) | non |
| R13 | Titre et sous-titre d'une ligne | 2 (récap, checklist, quiz flash, cases) ; **3** (LigneCours, Détail thème, nom de badge) ; 6 (De ton formateur D, question formateur) ; 8 (carte Mes cours) ; 12 côte à côte (De ton formateur M) | ⚠ 2, 3, 6, 8, 12 |
| R14 | Deux colonnes d'une liste (desktop) | 40 (`LigneCours`) ; **28** (De ton formateur) | ⚠ 28, 40 |
| R15 | Alignement du chevron sur la vignette | **14** M / 16 D (`LigneCours`) ; **14** (De ton formateur D) | ⚠ 14, 16 |
| R16 | Titre de section et son contenu | 4 (De ton formateur) ; 10 (À retenir formateur) ; 12 (socle `section`, Cours, À retenir fiche, carte étapes) ; 16 (fm-carte, modale badges) | ⚠ 4, 10, 12, 16 |
| R17 | Deux cartes d'une grille / d'une liste de cartes | 10 M / 16 D (thèmes) ; **14** M / 16 D (Mes cours) ; 12 M / 20 D (blocs dashboard) ; 10 (chiffres Détail cours, réponses, choix Connexion) ; 12 (profils, erreurs fin de quiz) ; 16×12 (modale badges) | ⚠ |
| R18 | Icône et libellé (pastille, bouton, en-tête) | 4 (XP M, pastille réponse, statut En cours) ; **5** (pastille de statut) ; 6 (Retour, pastille formateur, XP D, pastille XP, légende, repère) ; 8 (boutons principal et secondaire) ; 10 (pastille et titre De ton formateur, ampoule À retenir) ; 16 (bouton blanc D) | ⚠ 4, 5, 6, 8, 10, 16 |
| R19 | Padding d'une pastille | 4×10 (groupe, réponse, Bloquante, badge) ; **5**×12 (statut) ; 6×12 (orange) ; 6×12×6×8 (formateur) ; 6×16×6×8 (XP) | ⚠ |
| R20 | Padding horizontal d'un bouton | `--espace-24` (boutons du socle) ; **22** M / 24 D à gauche (boutons blancs à flèche) ; **18** (bouton de ligne du récap, Quiz flash F) ; 16 (Quitter l'aperçu) ; 12 / **18** (pilule Retour) | ⚠ |
| R21 | Libellé et champ ; deux champs | libellé : 6 (`.champ`), 8 (Connexion) ; champs : 20 (Connexion) | ⚠ 6, 8 pour libellé et champ |
| R22 | Padding horizontal d'un champ | **18** (`.champ`) ; 20 (recherche Cours) ; **22** (Connexion) | ⚠ 18, 20, 22 |
| R23 | Bouton principal et lien secondaire en dessous | 10 M / 8 D (Connexion) ; 8 (fin de quiz) | ⚠ 8, 10 |
| R24 | Deux puces d'une liste « À retenir » ; retrait | gap 6 partout ; retrait **22** (fiche) / 20 (Détail cours) | ⚠ retrait 20, 22 |
| R25 | Marges de page mobiles (côtés / haut) | 16 côtés et zone de sécurité + 20 en haut sur tous les écrans | non |
| R26 | Intertitre de leçon (H2) : au-dessus / en dessous | **28** / 10 (fiche) | un seul écran |
| R27 | Réserves d'objet 3D et débords (exemptés) | réserves 72, 92, 100, 120, 128, 136, 150, 200 ; débords 30, 40 ; décalages de l'objet 12 / 14 / 16 / 20 / 48 | ⚠ (exemptés par le token) |

**Épaisseur des séparateurs** : une seule valeur (1 px, `--bordure-separateur`), aucun écart.

**Bouton Retour** : quatre modèles (pilule chevron + texte, rond 44, rond 46, rond 56) ; la pilule est déclarée deux fois à l'identique (`theme-retour`, `fiche-retour`) ; le lien formateur desktop n'a pas de chevron.

**Textes** : le sur-titre oscille entre 12 et 13 px (700 partout) ; le titre de page de détail est à 28 / 32 px, tantôt via `--taille-titre-cours`, tantôt en dur ; le titre de ligne entre 15 et 18 px (800, sauf intitulés d'étape à 600) ; le sous-titre de ligne à 13 px, en 400 dans les lignes-boutons et 500 / 600 ailleurs ; l'état vide à 13,6 px (rem) ou 15 px selon l'écran.

---

## Résumé

- **27 rôles** identifiés (dont R27, réserves et débords d'objets 3D, exempté par le token).
- **22 rôles ont plusieurs valeurs** : R1, R2, R3, R4, R5, R7, R8, R9, R10, R11, R13, R14, R15, R16, R17, R18, R19, R20, R21, R22, R23, R24 (plus R27, exempté). Rôles à valeur unique : R6, R12, R25 (R26 n'existe que sur un écran).
- **Valeurs hors échelle** (hors exemptions) : 3, 5, 14, 18, 22, 28, 36. Les plus fréquentes : 14 (padding de ligne, gaps de carte, alignement du chevron), 18 (paddings de carte et de liste), 22 (en-têtes lavande, boutons à flèche, champ de connexion), 28 (paddings desktop, colonnes, intertitre). Exemptées : 30, 40 (débords), 48, 56, 104, 112 (marges de page et réserves), réserves d'objet 72 à 200.
- `var(--espace-N)` n'est utilisé que pour le padding horizontal des boutons du socle (`--espace-24`) ; tous les autres espacements relevés sont en dur.
