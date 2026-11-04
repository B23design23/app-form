# Proposition de valeurs typographiques par rôle

Étape 2 du chantier typographie, rédigée le 2026-11-04 à partir de `docs/audit-typographie.md`. Ce document propose des valeurs. Il ne crée aucun token et ne corrige rien. Les noms de rôles restent en français courant, ce ne sont pas des noms de tokens.

**Base de calcul**

- Un **élément** est un type d'élément rendu en prod (origin/main `a6d20f6`) : une règle CSS de base utilisée, avec sa variante desktop éventuelle et les classes qui s'y combinent (par exemple `.bouton-primaire` sur les boutons du parcours). Les conteneurs, le CSS non utilisé et les règles qui ne changent qu'un état (graisse d'une ligne choisie, `strong` dans un texte) ne sont pas comptés comme éléments : ils sont traités en section 6. Les éléments qui n'existent que sur desktop (tableaux, colonne étroite du dashboard) sont comptés, sans valeur mobile. Total : **274 éléments**.
- La valeur **actuelle** est la valeur rendue (et non la valeur écrite), y compris pour les 3 valeurs écrasées de l'audit.
- Pour chaque rôle, la valeur retenue est la combinaison taille mobile · taille desktop · graisse · hauteur de ligne que partage le plus grand nombre d'éléments du rôle. C'est elle qui change le moins d'éléments.
- Mobile = règle de base, desktop = à partir de 768 px.

**Deux points de l'instruction relus à ma façon**

- L'instruction parle de 18 cas « À trancher » ; le tableau 3.3 de l'audit en compte 20. Les 20 sont traités en section 4.
- Le seuil des « gros écarts » listés à part n'était pas lisible dans l'instruction. J'ai pris **4 px ou plus** (écart de taille, mobile ou desktop).

## 1. Rôles

| Rôle | Fonction | Taille mobile | Taille desktop | Graisse | Hauteur de ligne | Espacement des lettres | Éléments rattachés |
|---|---|---|---|---|---|---|---|
| Titre de page | Nomme l'écran ; un seul par écran, en tête | 34 px | 44 px | 800 | 1,1 | normal | 9 : H1 des pages avec navigation, des pages formateur, du parcours, du flux mot de passe, du dashboard, de Création de cours, de fin de quiz, de Création du compte |
| Titre de contenu | Nomme l'objet que l'écran présente (un cours, un thème, une question) | 28 px | 32 px | 800 | 1,1 | normal | 6 : titre du cours (fiche, Détail cours), nom du thème, question du quiz, titres des blocs de tête du dashboard |
| Titre de section | Ouvre une partie de la page ou d'une surface (section, carte de section, modale) | 20 px | 20 px | 800 | 1,2 | normal | 16 |
| Titre de carte | Nomme une carte ou un bloc qui se lit d'un coup, sans être une section de page | 17 px | 17 px | 800 | 1,2 | normal | 17 |
| Titre de ligne | Nomme un élément d'une liste (ligne, cellule, rangée) | 15 px | 15 px | 800 | 1,2 | normal | 16 |
| Corps de texte | Texte lu en phrases : leçon, explications, paragraphes | 15 px | 15 px | 500 | 1,45 | normal | 19 |
| Texte secondaire | Phrase qui accompagne un titre ou un contenu : sous-titre, état, aide, erreur, message | 14 px | 14 px | 700 | 1,2 | normal | 27 |
| Méta | Information courte sur un élément : contenu, date, compte, compteur, statut | 13 px | 13 px | 500 | 1,2 | normal | 54 |
| Libellé court | Mot ou groupe de mots qui nomme ou qualifie un autre élément : surtitre, pastille, numéro, libellé de champ | 13 px | 13 px | 700 | 1,2 | normal | 40 |
| Action | Texte d'un élément sur lequel on agit : bouton, lien, onglet, entrée de navigation ou de menu, filtre | 15 px | 15 px | 800 | 1,2 | normal | 46 |
| Saisie et choix | Texte que l'utilisateur tape ou choisit : champ, liste déroulante, ligne de choix, réponse de quiz | 16 px | 16 px | 600 | 1,2 | normal | 18 |
| Chiffre mis en avant | Nombre isolé qui porte l'information principale d'un bloc | 28 px | 28 px | 800 | 1 | normal | 6 |

12 rôles. La liste complète des éléments de chaque rôle est en annexe.

### Fusions

Les 20 rôles candidats de l'audit sont regroupés par fonction.

- **Titre de section** = Titre de section + Titre de modale ou de menu : tous ouvrent une surface entière (partie de page, carte de section, modale, feuille de menu) et annoncent ce qu'elle contient.
- **Texte secondaire** = Sous-titre et texte secondaire + Aide, erreur et message : ce sont des phrases complètes qui commentent un autre élément (un titre, un champ, une liste vide) sans être le contenu principal.
- **Méta** = Méta + Compteur et chiffre de progression : tous donnent une information courte et factuelle sur un élément (« 3 / 5 », « il y a 2 jours », « Leçon · Quiz »), lue en passant.
- **Libellé court** = Surtitre + Pastille + Numéro dans une pastille ronde + Libellé de champ (+ initiales et « +N », hors rôle dans l'audit) : ce ne sont pas des phrases mais des étiquettes d'un à trois mots qui nomment ou qualifient l'élément voisin.
- **Action** = Libellé de bouton + Lien et bouton texte + Navigation, onglet, filtre, entrée de menu : leur texte dit ce qui se passe quand on clique, quelle que soit la forme du contrôle.
- Les autres rôles candidats sont repris tels quels : Titre de page, Titre de contenu, Titre de carte, Titre de ligne, Corps de texte, Saisie et choix, Chiffre mis en avant.

### Hauteur de ligne du corps de texte : 1,45

Les éléments du corps de texte qui déclarent une hauteur de ligne en utilisent trois : 1,4 (3 éléments), 1,45 (2) et 1,55 (2). Je propose **1,45** :

- c'est la valeur de la combinaison la plus partagée du rôle (15 px · 500 · 1,45 : texte courant de l'espace formateur et explication de la correction du quiz) ;
- elle ne coûte qu'un élément de plus que 1,4 ;
- elle est au milieu de l'écart : la leçon, le texte le plus long de l'app, perd moins de rythme (1,55 → 1,45) qu'avec 1,4, et les textes à 1,4 ne bougent que de 0,75 px par ligne à 15 px.

### Graisses et contrôles

Graisses retenues : 500, 600, 700, 800. Les champs et les boutons prennent la famille et la graisse de leur rôle : les 8 contrôles à 400 (valeur du navigateur) passent à la graisse du rôle Saisie et choix (600). Les 3 caractères affichés en Arial (croix « × » de la modale Mes badges, flèches ↑ ↓ de la remise en ordre, flèche de tri ▲ ▼) prennent Urbanist, voir section 6.

## 2. Échelle de tailles

10 tailles, toutes en px entiers. Chacune sert au moins un rôle. Sortie prévue en rem, base 16 px.

| Taille | rem | Rôles |
|---|---|---|
| 13 px | 0,8125 rem | Méta, Libellé court |
| 14 px | 0,875 rem | Texte secondaire |
| 15 px | 0,9375 rem | Titre de ligne, Corps de texte, Action |
| 16 px | 1 rem | Saisie et choix |
| 17 px | 1,0625 rem | Titre de carte |
| 20 px | 1,25 rem | Titre de section |
| 28 px | 1,75 rem | Titre de contenu (mobile), Chiffre mis en avant |
| 32 px | 2 rem | Titre de contenu (desktop) |
| 34 px | 2,125 rem | Titre de page (mobile) |
| 44 px | 2,75 rem | Titre de page (desktop) |

Les tailles fractionnaires de la prod (11,52 · 12,8 · 13,6 · 14,4 · 15,2 · 16,8 · 19,2 · 20,8 · 22,4 px) disparaissent : leurs éléments prennent la taille de leur rôle. Seuls deux rôles changent de taille à 768 px (Titre de page, Titre de contenu).

## 3. Impact

### 3.1 Totaux

- **210 éléments sur 274 changent** au moins sur une propriété, 64 restent identiques.
- Par propriété : 171 changent de taille, 118 de graisse, 37 de hauteur de ligne, 2 d'espacement des lettres (« Salut » et « Quiz flash » du dashboard apprenant). 28 ne changent que de graisse. 3 ne changent que de moins de 1 px (ancienne taille en rem).
- **23 éléments changent de 4 px ou plus** (tableau 3.3).

| Rôle | Éléments | Changent |
|---|---|---|
| Titre de page | 9 | 5 |
| Titre de contenu | 6 | 4 |
| Titre de section | 16 | 13 |
| Titre de carte | 17 | 14 |
| Titre de ligne | 16 | 9 |
| Corps de texte | 19 | 17 |
| Texte secondaire | 27 | 23 |
| Méta | 54 | 44 |
| Libellé court | 40 | 30 |
| Action | 46 | 32 |
| Saisie et choix | 18 | 15 |
| Chiffre mis en avant | 6 | 4 |
| **Total** | **274** | **210** |

### 3.2 Détail par rôle

Seuls les éléments qui changent sont listés. « Rendu actuel » et « Proposé » : taille (mobile / desktop si elles diffèrent) · graisse · hauteur de ligne. « n/a » : l'élément n'existe pas à cette largeur.


### Titre de page

9 éléments, 5 changent, 4 inchangés.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Parcours : Création du compte | « Plus qu'une étape, [Prénom] » (`Parcours.css:192`) | 28 px · 800 · interligne 1,1 | 34 / 44 px · 800 · interligne 1,1 | taille | 16 px |
| Création de cours | H1 de l'en-tête (mobile < 1024 / desktop ≥ 1024) (`CreationCours.css:52 + 1376`) | 20 / 44 px · 800 · interligne 1,2 | 34 / 44 px · 800 · interligne 1,1 | taille, interligne | 14 px |
| Fin de quiz | titre « Belle maîtrise ! » (`FicheCours.css:809`) | 30 px · 800 · interligne 1,1 | 34 / 44 px · 800 · interligne 1,1 | taille | 14 px |
| Dashboard apprenant | « Salut [Prénom] » (H1) (`Dashboard.css:21`) | 34 / 44 px · 800 · interligne 1 · lettres -0,5 / -0,8 px | 34 / 44 px · 800 · interligne 1,1 · lettres normales | interligne, lettres | 0 |
| Dashboard formateur, admin | « Bonjour [prénom] » (H1) (`DashboardFormateur.css:30`) | 34 / 44 px · 800 · interligne 1,2 | 34 / 44 px · 800 · interligne 1,1 | interligne | 0 |

### Titre de contenu

6 éléments, 4 changent, 2 inchangés.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Détail cours | titre du cours (H1) : perd contre .espace-page h1 (`DetailCoursFormateur.css:25`) | 34 / 44 px · 800 · interligne 1,1 | 28 / 32 px · 800 · interligne 1,1 | taille | 12 px |
| Fiche : quiz, Quiz flash | question (`FicheCours.css:432`) | 24 px · 800 · interligne 1,15 | 28 / 32 px · 800 · interligne 1,1 | taille, interligne | 8 px |
| Dashboard apprenant | « Quiz flash » du bloc de tête E (`Dashboard.css:440`) | 34 px · 800 · interligne 1 · lettres -0,5 px | 28 / 32 px · 800 · interligne 1,1 · lettres normales | taille, interligne, lettres | 6 px |
| Dashboard apprenant | titre du bloc de tête (cours en cours / assigné) (`Dashboard.css:360`) | 26 / 32 px · 800 · interligne 1,05 / 1,1 | 28 / 32 px · 800 · interligne 1,1 | taille, interligne | 2 px |

### Titre de section

16 éléments, 13 changent, 3 inchangés.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Cours | titre de section (« Thèmes », « N résultats ») (`SectionCours.css:20`) | 22 / 28 px · 800 · interligne 1,2 | 20 px · 800 · interligne 1,2 | taille | 8 px |
| Dashboard formateur | titre « Taux de complétion » (`DashboardFormateur.css:220`) | 14,4 px · 500 · interligne 1,2 | 20 px · 800 · interligne 1,2 | taille, graisse | 5,6 px |
| Dashboard formateur : Pour bien démarrer | titre de la carte (`DashboardFormateur.css:657`) | 24 px · 800 · interligne 1,2 | 20 px · 800 · interligne 1,2 | taille | 4 px |
| Espace formateur, Création de cours | titre de modale (`Formateur.css:357`) | 24 px · 800 · interligne 1,2 | 20 px · 800 · interligne 1,2 | taille | 4 px |
| Fiche : leçon | intertitre H2 de la leçon (`FicheCours.css:266`) | 21 / 24 px · 800 · interligne 1,2 | 20 px · 800 · interligne 1,2 | taille | 4 px |
| Contenu Markdown | titre Markdown niveau 3 (`ContenuMarkdown.css:16`) | 16,8 px · 800 · interligne 1,2 | 20 px · 800 · interligne 1,2 | taille | 3,2 px |
| Pages avec navigation | h2 par défaut dans .espace-page (`espace-layout.css:163`) | 16,8 px · 800 · interligne 1,2 | 20 px · 800 · interligne 1,2 | taille | 3,2 px |
| Espace formateur (mobile) | titre de la feuille du menu « … » (`Formateur.css:285`) | 17 px · 800 · interligne 1,2 | 20 px · 800 · interligne 1,2 | taille | 3 px |
| Contenu Markdown | titre Markdown niveau 1 (`ContenuMarkdown.css:14`) | 22,4 px · 800 · interligne 1,2 | 20 px · 800 · interligne 1,2 | taille | 2,4 px |
| Création de cours | titre de carte de section (Infos, Leçon…) (`CreationCours.css:253`) | 22 px · 800 · interligne 1,2 | 20 px · 800 · interligne 1,2 | taille | 2 px |
| Dashboard formateur | titre « Activité récente » (`DashboardFormateur.css:463`) | 22 px · 800 · interligne 1,2 | 20 px · 800 · interligne 1,2 | taille | 2 px |
| Contenu Markdown | titre Markdown niveau 2 (hors leçon) (`ContenuMarkdown.css:15`) | 19,2 px · 800 · interligne 1,2 | 20 px · 800 · interligne 1,2 | taille | 0,8 px |
| Dashboard apprenant : modale Mes badges | titre « Mes badges » (`Dashboard.css:994`) | 20,8 px · 800 · interligne 1,2 | 20 px · 800 · interligne 1,2 | taille | 0,8 px |

### Titre de carte

17 éléments, 14 changent, 3 inchangés.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Dashboard apprenant (desktop, colonne étroite) | « Quiz flash » vertical (`Dashboard.css:941`) | n/a / 28 px · 800 · interligne 1 | n/a / 17 px · 800 · interligne 1,2 | taille, interligne | 11 px |
| Dashboard apprenant | titre de carte blanche / lavande (`Dashboard.css:143`) | 22 px · 800 · interligne 1,05 | 17 px · 800 · interligne 1,2 | taille, interligne | 5 px |
| Fiche : leçon, checklist | titre de la carte « Étape suivante » (`FicheCours.css:351`) | 22 px · 800 · interligne 1,1 | 17 px · 800 · interligne 1,2 | taille, interligne | 5 px |
| Fin de quiz | nom du badge débloqué (`FicheCours.css:886`) | 22 px · 800 · interligne 1,1 | 17 px · 800 · interligne 1,2 | taille, interligne | 5 px |
| Mes groupes | nom de la carte de groupe (`FormateurListes.css:88`) | 20 / 22 px · 500 · interligne 1,2 | 17 px · 800 · interligne 1,2 | taille, graisse | 5 px |
| Récap | titre du cours suivant (`FicheCours.css:1346`) | 22 px · 800 · interligne 1,1 | 17 px · 800 · interligne 1,2 | taille, interligne | 5 px |
| Partagé (fiche) | titre du toast de complétion (`CompletionToast.css:30`) | 13,6 px · 800 · interligne 1,2 | 17 px · 800 · interligne 1,2 | taille | 3,4 px |
| Fiche : checklist | « X étapes sur N » (`FicheCours.css:1062`) | 20 px · 800 · interligne 1,2 | 17 px · 800 · interligne 1,2 | taille | 3 px |
| Fiche : quiz, Quiz flash | titre du bloc de correction (« Bien vu ») (`FicheCours.css:654`) | 20 px · 800 · interligne 1,2 | 17 px · 800 · interligne 1,2 | taille | 3 px |
| Parcours : Choix du profil | titre de la carte de profil (`Parcours.css:157`) | 20 px · 800 · interligne 1,2 | 17 px · 800 · interligne 1,2 | taille | 3 px |
| Cours | titre de la carte de thème (`SectionCours.css:89`) | 15 / 18 px · 800 · interligne 1,2 | 17 px · 800 · interligne 1,2 | taille | 2 px |
| Dashboard apprenant | titre « Quiz flash » du bloc en ligne F (`Dashboard.css:477`) | 19 px · 800 · interligne 1,2 | 17 px · 800 · interligne 1,2 | taille | 2 px |
| Dashboard apprenant, Cours | titre du bloc « De ton formateur » (`BlocFormateur.css:21`) | 18 px · 800 · interligne 1,2 | 17 px · 800 · interligne 1,2 | taille | 1 px |
| Mes cours | titre de la carte de cours (`FormateurListes.css:60`) | 18 px · 500 · interligne 1,2 | 17 px · 800 · interligne 1,2 | taille, graisse | 1 px |

### Titre de ligne

16 éléments, 9 changent, 7 inchangés.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Dashboard formateur | nom du groupe (`DashboardFormateur.css:298`) | 17 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 2 px |
| Dashboard formateur : Pour bien démarrer | titre d'étape (`DashboardFormateur.css:722`) | 17 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 2 px |
| Création de cours | « Question N » (h3) (`CreationCours.css:655`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Dashboard formateur | « Personne à relancer » (`DashboardFormateur.css:440`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Détail thème | titre de la ligne de cours (`DetailTheme.css:136`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Fin de quiz : mes erreurs | question ratée (`FicheCours.css:953`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Récap | titre de ligne (Leçon, Quiz, Checklist) (`FicheCours.css:1311`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Terrain, recherche Cours | titre de la ligne de cours (`LigneCours.css:47`) | 15 / 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Détail groupe | titre de la carte de cours assigné (`DetailGroupe.css:120`) | 15 px · 800 · interligne 1,25 | 15 px · 800 · interligne 1,2 | interligne | 0 |

### Corps de texte

19 éléments, 17 changent, 2 inchangés.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Fiche : leçon, aperçu Création | texte de la leçon (`FicheCours.css:253`) | 17 / 18 px · 500 · interligne 1,55 | 15 px · 500 · interligne 1,45 | taille, interligne | 3 px |
| Fiche : checklist | intitulé de l'étape en cours (`FicheCours.css:1205`) | 17 px · 800 · interligne 1,2 | 15 px · 500 · interligne 1,45 | taille, graisse, interligne | 2 px |
| Partagé (fiche) | texte du toast de complétion (`CompletionToast.css:15`) | 13,6 px · 500 · interligne 1,2 | 15 px · 500 · interligne 1,45 | taille, interligne | 1,4 px |
| Détail cours | premier paragraphe de la leçon (`DetailCoursFormateur.css:212`) | 16 px · 500 · interligne 1,55 | 15 px · 500 · interligne 1,45 | taille, interligne | 1 px |
| Détail cours | bonne réponse (`DetailCoursFormateur.css:353`) | 14 px · 700 · interligne 1,2 | 15 px · 500 · interligne 1,45 | taille, graisse, interligne | 1 px |
| Fiche : checklist | intitulé d'étape (`FicheCours.css:1172`) | 16 px · 600 · interligne 1,35 | 15 px · 500 · interligne 1,45 | taille, graisse, interligne | 1 px |
| Fiche : leçon | points de l'encadré « À retenir » (`FicheCours.css:321`) | 16 px · 600 · interligne 1,4 | 15 px · 500 · interligne 1,45 | taille, graisse, interligne | 1 px |
| Fin de quiz : mes erreurs | ligne « Ta réponse / Bonne réponse » (`FicheCours.css:963`) | 14 px · 700 · interligne 1,2 | 15 px · 500 · interligne 1,45 | taille, graisse, interligne | 1 px |
| Fin de quiz : mes erreurs | explication (`FicheCours.css:977`) | 14 px · 500 · interligne 1,2 | 15 px · 500 · interligne 1,45 | taille, interligne | 1 px |
| Contenu Markdown | texte de tableau (`ContenuMarkdown.css:95`) | 15,2 px · 500 · interligne 1,2 | 15 px · 500 · interligne 1,45 | taille, interligne | 0,2 px |
| Dashboard admin (desktop) | cellules chiffrées du tableau (`DashboardFormateur.css:1064`) | n/a / 15 px · 700 · interligne 1,2 | n/a / 15 px · 500 · interligne 1,45 | graisse, interligne | 0 |
| Dashboard formateur | texte de relance (`DashboardFormateur.css:366`) | 15 px · 500 · interligne 1,4 | 15 px · 500 · interligne 1,45 | interligne | 0 |
| Dashboard formateur | texte de l'événement (`DashboardFormateur.css:602`) | 15 px · 500 · interligne 1,4 | 15 px · 500 · interligne 1,45 | interligne | 0 |
| Détail cours | points de l'encadré « À retenir » (`DetailCoursFormateur.css:294`) | 15 px · 600 · interligne 1,2 | 15 px · 500 · interligne 1,45 | graisse, interligne | 0 |
| Détail cours | intitulé d'étape de checklist (`DetailCoursFormateur.css:372`) | 15 px · 600 · interligne 1,2 | 15 px · 500 · interligne 1,45 | graisse, interligne | 0 |
| Détail groupe (desktop) | cellules du tableau des élèves (`DetailGroupe.css:350`) | n/a / 15 px · 600 · interligne 1,2 | n/a / 15 px · 500 · interligne 1,45 | graisse, interligne | 0 |
| Fiche : checklist (remise en ordre) | consigne de remise en ordre (`FicheCours.css:1081`) | 15 px · 500 · interligne 1,2 | 15 px · 500 · interligne 1,45 | interligne | 0 |

### Texte secondaire

27 éléments, 23 changent, 4 inchangés.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Cours, Terrain | sous-titre de l'en-tête lavande (`EntetePage.css:35`) | 14 / 16 px · 700 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille | 2 px |
| Parcours | sous-titre sous le H1 (`GabaritParcours.css:215`) | 16 px · 500 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille, graisse | 2 px |
| Cours | « Aucun cours ne correspond… » (`SectionCours.css:28`) | 15 px · 500 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Création de cours | aide sous un champ (`CreationCours.css:272`) | 13 px · 500 · interligne 1,4 | 14 px · 700 · interligne 1,2 | taille, graisse, interligne | 1 px |
| Dashboard apprenant | phrase d'état (« Leçon lue. Reste le quiz ») (`Dashboard.css:388`) | 14 / 15 px · 600 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard apprenant (desktop, colonne étroite) | phrase du quiz flash vertical (`Dashboard.css:952`) | n/a / 15 px · 600 · interligne 1,2 | n/a / 14 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard formateur | note sous une carte (`DashboardFormateur.css:133`) | 13 px · 500 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard formateur | confirmation d'envoi de relance (`DashboardFormateur.css:376`) | 13 px · 700 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille | 1 px |
| Dashboard formateur, admin | « 3 cours · 1 groupe · 12 élèves » (`DashboardFormateur.css:36`) | 15 px · 700 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille | 1 px |
| Dashboard formateur, admin | texte d'état vide (`DashboardFormateur.css:144`) | 15 px · 500 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Espace formateur | sous-titre sous le H1 (« N élèves · N cours ») (`Formateur.css:37`) | 15 px · 600 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Espace formateur | sous-titre de modale (`Formateur.css:363`) | 15 px · 500 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Fin de quiz | sous-titre « Une seule erreur à revoir. » (`FicheCours.css:816`) | 15 px · 600 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Parcours | aide sous un champ (mot de passe) (`Parcours.css:17`) | 13 px · 600 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Parcours : Création du compte | texte du bloc lavande (`Parcours.css:199`) | 15 px · 600 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Création de cours | message d'erreur (`CreationCours.css:279`) | 13,6 px · 700 · interligne 1,4 | 14 px · 700 · interligne 1,2 | taille, interligne | 0,4 px |
| Fiche : checklist (remise en ordre) | message de résultat de la remise en ordre (`quiz.css:85`) | 13,6 px · 500 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille, graisse | 0,4 px |
| Mot de passe oublié | phrase d'explication sous le H1 (`shared.css:119`) | 14,4 px · 500 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille, graisse | 0,4 px |
| Partagé | message d'erreur (.message) (`shared.css:358`) | 13,6 px · 500 · interligne 1,4 | 14 px · 700 · interligne 1,2 | taille, graisse, interligne | 0,4 px |
| Terrain, Détail thème, Détail groupe | texte d'état vide (`shared.css:512`) | 13,6 px · 500 · interligne 1,2 | 14 px · 700 · interligne 1,2 | taille, graisse | 0,4 px |
| Création de cours (< 1024) | titre du cours tronqué sous le H1 (`CreationCours.css:60`) | 14 px · 600 · interligne 1,2 | 14 px · 700 · interligne 1,2 | graisse | 0 |
| Dashboard apprenant | phrase du bloc de tête E (`Dashboard.css:449`) | 14 px · 600 · interligne 1,2 | 14 px · 700 · interligne 1,2 | graisse | 0 |
| Dashboard formateur | note 14 px (Pour bien démarrer) (`DashboardFormateur.css:139`) | 14 px · 500 · interligne 1,2 | 14 px · 700 · interligne 1,2 | graisse | 0 |

### Méta

54 éléments, 44 changent, 10 inchangés.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Parcours : questions | compteur « 2 / 5 » (`GabaritParcours.css:195`) | 18 px · 800 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 5 px |
| Dashboard apprenant : modale Mes badges | compteur « X/6 » (`Dashboard.css:1001`) | 15 px · 800 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 2 px |
| Fiche : quiz, Quiz flash | compteur « 3 / 5 » (`FicheCours.css:413`) | 15 px · 800 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 2 px |
| Fin de quiz | « 80 % » sous le score (`FicheCours.css:801`) | 15 px · 700 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 2 px |
| Aperçu élève | texte du bandeau « Aperçu élève » (`FicheCours.css:104`) | 14 px · 700 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Cours | compteur « N cours » du bloc formateur (`BlocFormateur.css:44`) | 14 px · 700 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Cours | compte « y cours » de la carte de thème (`SectionCours.css:105`) | 13 / 14 px · 700 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Création de cours | nom d'image en étiquette (`CreationCours.css:519`) | 14 px · 700 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard admin | libellé de carte chiffrée (`DashboardFormateur.css:771`) | 14 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard apprenant | compteur de barre « X / 3 » (`Dashboard.css:318`) | 14 px · 800 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard apprenant | compteur de barre, petite variante (`Dashboard.css:323`) | 12 px · 800 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard apprenant | méta du cours assigné (« thème · ajouté hier ») (`Dashboard.css:426`) | 14 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard apprenant : modale Mes badges | « Obtenu le JJ/MM » (`Dashboard.css:1062`) | 12 px · 700 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard formateur | sous-titre « Sur l'ensemble de tes groupes » (`DashboardFormateur.css:225`) | 12 px · 500 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille | 1 px |
| Dashboard formateur | « N élèves · N cours » (`DashboardFormateur.css:304`) | 14 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard formateur | % de la barre du groupe (`DashboardFormateur.css:330`) | 14 px · 800 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard formateur | « Tous tes élèves ont commencé… » (`DashboardFormateur.css:446`) | 14 px · 500 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille | 1 px |
| Dashboard formateur : Pour bien démarrer | « N étapes sur 3 » (`DashboardFormateur.css:663`) | 14 px · 700 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard formateur : Pour bien démarrer | sous-titre d'étape (`DashboardFormateur.css:727`) | 14 px · 500 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille | 1 px |
| Détail cours | légende de la barre d'avancement (`DetailCoursFormateur.css:96`) | 14 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Détail groupe (mobile) | statut par cours dans la carte élève (`DetailGroupe.css:242`) | 14 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Espace formateur | méta (« X terminés sur N »…) (`Formateur.css:73`) | 14 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Fiche : checklist | « +15 XP à la fin » (`FicheCours.css:1067`) | 14 px · 700 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Fiche : checklist | critère de validation (`FicheCours.css:1221`) | 14 px · 500 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille | 1 px |
| Fiche : leçon, checklist | libellé d'étape (Leçon, Quiz · 4/5…) (`ReperEtapes.css:67`) | 14 px · 600/700/800 selon l'état · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille | 1 px |
| Fiche : leçon, checklist | détail « N questions · +20 XP » (`FicheCours.css:358`) | 14 px · 500 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille | 1 px |
| Fiche : leçon, récap | « N min de lecture » / « X XP gagnés » (`FicheCours.css:234`) | 14 px · 700 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Fin de quiz | condition du badge (`FicheCours.css:892`) | 14 px · 500 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille | 1 px |
| Mes cours, Mes groupes | méta de carte (`FormateurListes.css:64`) | 14 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Mes groupes | ligne « Cours terminés » (`FormateurListes.css:101`) | 14 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 1 px |
| Parcours : Choix du profil | description de la carte de profil (`Parcours.css:162`) | 14 px · 500 · interligne 1,35 | 13 px · 500 · interligne 1,2 | taille, interligne | 1 px |
| Récap | contenu du cours suivant (`FicheCours.css:1352`) | 14 px · 500 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille | 1 px |
| Partagé (fiche) | « +15 XP » du toast (`CompletionToast.css:39`) | 13,6 px · 700 · interligne 1,2 | 13 px · 500 · interligne 1,2 | taille, graisse | 0,6 px |
| Création de cours | méta « Réponse unique · 3 réponses » (`CreationCours.css:632`) | 13 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | graisse | 0 |
| Création de cours (≥ 1024) | compteur du sommaire (`CreationCours.css:191`) | 13 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | graisse | 0 |
| Dashboard admin (desktop) | en-têtes de colonne du tableau (`DashboardFormateur.css:1045`) | n/a / 13 px · 700 · interligne 1,2 | n/a / 13 px · 500 · interligne 1,2 | graisse | 0 |
| Dashboard admin (mobile) | résumé « 42 commencés · 18 terminés » (`DashboardFormateur.css:831`) | 13 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | graisse | 0 |
| Dashboard apprenant | sous-texte (thème, condition du badge) (`Dashboard.css:149`) | 13 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | graisse | 0 |
| Dashboard apprenant | consigne du quiz flash verrouillé (`Dashboard.css:552`) | 13 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | graisse | 0 |
| Dashboard formateur | « Actif aujourd'hui » (`DashboardFormateur.css:311`) | 13 px · 700 · interligne 1,2 | 13 px · 500 · interligne 1,2 | graisse | 0 |
| Dashboard formateur | date « Il y a N jours » (`DashboardFormateur.css:370`) | 13 px · 700 · interligne 1,2 | 13 px · 500 · interligne 1,2 | graisse | 0 |
| Dashboard formateur | statut « Quiz 90 % / En cours » (`DashboardFormateur.css:640`) | 13 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | graisse | 0 |
| Détail cours | libellé des petites cartes d'avancement (`DetailCoursFormateur.css:141`) | 13 px · 600 · interligne 1,2 | 13 px · 500 · interligne 1,2 | graisse | 0 |
| Détail groupe (desktop) | en-têtes de colonne du tableau des élèves (`DetailGroupe.css:338`) | n/a / 13 px · 800 · interligne 1,2 | n/a / 13 px · 500 · interligne 1,2 | graisse | 0 |

### Libellé court

40 éléments, 30 changent, 10 inchangés.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Dashboard formateur : Pour bien démarrer | numéro dans le rond (`DashboardFormateur.css:695`) | 16 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 3 px |
| Détail cours | « +N » sur la dernière miniature (`DetailCoursFormateur.css:246`) | 16 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 3 px |
| Fin de quiz | pastille « +20 XP » (`FicheCours.css:830`) | 16 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 3 px |
| Création de cours | lettre de réponse (`CreationCours.css:751`) | 15 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 2 px |
| Dashboard apprenant | libellé sur carte violette (« Tu en es là ») (`Dashboard.css:137`) | 13 / 15 px · 700 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille | 2 px |
| Création de cours | libellé de champ (`CreationCours.css:266`) | 14,4 px · 500 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 1,4 px |
| Partagé (modales, Détail groupe, Mes cours, mot de passe) | libellé de champ (.champ) (`shared.css:126`) | 14,4 px · 500 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 1,4 px |
| Cours | surtitre « Thème N » de la carte de thème (`SectionCours.css:82`) | 12 / 13 px · 700 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille | 1 px |
| Création de cours | pastille « Compte officiel : ce cours sera public » (`CreationCours.css:236`) | 14 px · 700 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille | 1 px |
| Création de cours | numéro de question / d'étape (`CreationCours.css:575`) | 14 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Création de cours | libellé « Bonne réponse » (`CreationCours.css:832`) | 14 px · 700 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille | 1 px |
| Création de cours | pilule « Bloquante » (`CreationCours.css:1013`) | 14 px · 700 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille | 1 px |
| Dashboard apprenant | pastille « De ton formateur » (`Dashboard.css:191`) | 12 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard apprenant | pastille orange « Défi du jour » (`Dashboard.css:206`) | 12 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard formateur | pastille « À surveiller / Bon rythme » (`DashboardFormateur.css:236`) | 12 px · 700 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille | 1 px |
| Dashboard formateur | initiales sur rond lavande (`DashboardFormateur.css:596`) | 14 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard formateur | pastille du groupe (`DashboardFormateur.css:626`) | 12 px · 700 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille | 1 px |
| Fiche : checklist | thème de l'en-tête compact (`FicheCours.css:1033`) | 12 px · 700 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille | 1 px |
| Fiche : checklist | pastille « Bloquante » (`FicheCours.css:1215`) | 12 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Fiche : quiz, Quiz flash | pastille « Ta réponse » / « Bonne réponse » (`FicheCours.css:606`) | 12 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Fin de quiz | pastille « Nouveau badge » (`FicheCours.css:881`) | 12 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Parcours | libellé de champ (`GabaritParcours.css:228`) | 14 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Partagé (Cours, Dashboard, Détail groupe…) | pastille de statut (Nouveau, À faire, Non commencé) (`espace-layout.css:252`) | 12 px · 700 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille | 1 px |
| Récap | « X XP gagnés » (pastille Terminé) (`FicheCours.css:1276`) | 14 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille, graisse | 1 px |
| Partagé (fiche) | nom du badge dans le toast (`CompletionToast.css:48`) | 12,8 px · 700 · interligne 1,2 | 13 px · 700 · interligne 1,2 | taille | 0,2 px |
| Dashboard admin | pastille « Compte officiel » (`DashboardFormateur.css:63`) | 13 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | graisse | 0 |
| Détail cours | numéro de question (`DetailCoursFormateur.css:328`) | 13 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | graisse | 0 |
| Fiche : checklist | numéro dans la pastille d'étape (`FicheCours.css:1109`) | 13 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | graisse | 0 |
| Fiche : leçon, checklist | numéro dans la pastille d'étape (`ReperEtapes.css:56`) | 13 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | graisse | 0 |
| Partagé | pastille de statut En cours / Terminé (`espace-layout.css:275`) | 13 px · 800 · interligne 1,2 | 13 px · 700 · interligne 1,2 | graisse | 0 |

### Action

46 éléments, 32 changent, 14 inchangés.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Navigation | libellé d'entrée de la tab bar (mobile) (`espace-layout.css:48`) | 11,52 / 14,4 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 3,48 px |
| Création de cours | bouton pointillé « + Ajouter… » (`shared.css:380`) | 13,6 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 1,4 px |
| Mot de passe oublié | lien « ← Retour » (`shared.css:321`) | 13,6 px · 600 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 1,4 px |
| Mot de passe oublié | lien secondaire (simuler le lien) (`shared.css:343`) | 13,6 px · 600 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 1,4 px |
| Aperçu élève | bouton « Quitter l'aperçu » (`FicheCours.css:115`) | 14 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Création de cours | onglet « Écrire / Aperçu » (`CreationCours.css:409`) | 14 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 1 px |
| Création de cours | bouton d'outil « Image / Vidéo » (`CreationCours.css:438`) | 14 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 1 px |
| Création de cours | bouton « Image » d'étape (`CreationCours.css:1038`) | 14 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 1 px |
| Création de cours (≥ 1024) | bouton Retour « Mes cours » (`CreationCours.css:144`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Dashboard apprenant | libellé du bouton orange (quiz flash) (`shared.css:255`) | 16 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard apprenant | libellé du bouton blanc à flèche (`Dashboard.css:222`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Dashboard apprenant | libellé du bouton large orange (`Dashboard.css:255`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Dashboard apprenant (desktop, colonne étroite) | bouton « Lancer » vertical (`Dashboard.css:960`) | n/a / 16 px · 800 · interligne 1,2 | n/a / 15 px · 800 · interligne 1,2 | taille | 1 px |
| Dashboard apprenant, Cours | lien « Tout voir » / « Mes badges · X/6 » (`Dashboard.css:166`) | 14 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Dashboard formateur | pastilles de filtre « Tout / Commencés / Terminés » (`DashboardFormateur.css:494`) | 14 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 1 px |
| Dashboard formateur, admin | lien « Tout voir » (`DashboardFormateur.css:112`) | 14 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Espace formateur | action du menu « … » (`Formateur.css:297`) | 16 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 1 px |
| Fiche : leçon, checklist | libellé du bouton blanc (`FicheCours.css:374`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Fiche : quiz, Quiz flash | libellé du bouton « Valider ma réponse » (`FicheCours.css:685`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Fin de quiz | libellé du bouton principal (`FicheCours.css:901`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Modale de confirmation | libellé du bouton rouge (`Formateur.css:411`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Modales, barre de Création de cours | lien d'action « Annuler » (`Formateur.css:397`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Parcours | libellé du bouton du parcours (écrasé par .bouton-primaire / .bouton-secondaire) (`GabaritParcours.css:86`) | 16 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 1 px |
| Parcours : Introduction | lien « Passer » (`GabaritParcours.css:135`) | 16 px · 800 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille | 1 px |
| Partagé | libellé du bouton principal (`shared.css:200`) | 16 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 1 px |
| Partagé | libellé du bouton secondaire (`shared.css:230`) | 16 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 1 px |
| Récap | libellé des boutons « Relire / Refaire / Revoir » (`FicheCours.css:1323`) | 14 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 1 px |
| Navigation | entrée du menu (Se déconnecter) (`espace-layout.css:123`) | 14,4 px · 600 · interligne 1,2 | 15 px · 800 · interligne 1,2 | taille, graisse | 0,6 px |
| Création de cours (< 1024) | pastille de section collante (`CreationCours.css:94`) | 15 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | graisse | 0 |
| Création de cours (≥ 1024) | entrée du sommaire (`CreationCours.css:181`) | 15 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | graisse | 0 |
| Dashboard formateur : Pour bien démarrer | libellé du bouton d'étape (`DashboardFormateur.css:740`) | 15 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | graisse | 0 |
| Parcours | lien sous le bouton (« Déjà un compte ? … ») (`GabaritParcours.css:106`) | 15 px · 700 · interligne 1,2 | 15 px · 800 · interligne 1,2 | graisse | 0 |

### Saisie et choix

18 éléments, 15 changent, 3 inchangés.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Parcours : questions | saisie du grand champ (prénom, organisme…) (`GabaritParcours.css:269`) | 20 px · 700 · interligne 1,2 | 16 px · 600 · interligne 1,2 | taille, graisse | 4 px |
| Création de cours | saisie d'explication (`CreationCours.css:776`) | 14 px · 400 · interligne 1,2 | 16 px · 600 · interligne 1,2 | taille, graisse | 2 px |
| Dashboard formateur | saisie « Un élève » (`DashboardFormateur.css:531`) | 14 px · 400 · interligne 1,2 | 16 px · 600 · interligne 1,2 | taille, graisse | 2 px |
| Création de cours | bouton de choix (groupe, mode de checklist) (`CreationCours.css:327`) | 15 px · 700 · interligne 1,2 | 16 px · 600 · interligne 1,2 | taille, graisse | 1 px |
| Création de cours | saisie de réponse / d'explication (`CreationCours.css:767`) | 15 px · 400 · interligne 1,2 | 16 px · 600 · interligne 1,2 | taille, graisse | 1 px |
| Création de cours | libellé de mode de checklist (`CreationCours.css:895`) | 15 px · 800 · interligne 1,2 | 16 px · 600 · interligne 1,2 | taille, graisse | 1 px |
| Création de cours | saisie de l'intitulé d'étape (`CreationCours.css:961`) | 15 px · 600 · interligne 1,2 | 16 px · 600 · interligne 1,2 | taille | 1 px |
| Parcours : questions | ligne de choix (statut, âge, motivation) (`GabaritParcours.css:296`) | 17 px · 600 · interligne 1,2 | 16 px · 600 · interligne 1,2 | taille | 1 px |
| Création de cours, Mes cours | option de la liste déroulante (`Dropdown.css:61`) | 15,2 px · 500 · interligne 1,2 | 16 px · 600 · interligne 1,2 | taille, graisse | 0,8 px |
| Cours | saisie de la recherche (`EntetePage.css:48`) | 16 px · 400 · interligne 1,2 | 16 px · 600 · interligne 1,2 | graisse | 0 |
| Création de cours | saisie de l'éditeur de leçon (`CreationCours.css:458`) | 16 px · 400 · interligne 1,55 | 16 px · 600 · interligne 1,2 | graisse, interligne | 0 |
| Création de cours, Mes cours | valeur affichée de la liste déroulante (`Dropdown.css:12`) | 16 px · 400 · interligne 1,2 | 16 px · 600 · interligne 1,2 | graisse | 0 |
| Modale d'assignation, Création de cours | libellé de case à cocher (`Formateur.css:527`) | 16 px · 700 · interligne 1,2 | 16 px · 600 · interligne 1,2 | graisse | 0 |
| Partagé | saisie de champ input (.champ) (`shared.css:136`) | 16 px · 400 · interligne 1,2 | 16 px · 600 · interligne 1,2 | graisse | 0 |
| Partagé | saisie de champ textarea (.champ) (`shared.css:148`) | 16 px · 400 · interligne 1,2 | 16 px · 600 · interligne 1,2 | graisse | 0 |

### Chiffre mis en avant

6 éléments, 4 changent, 2 inchangés.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Fin de quiz | score « 4/5 » dans l'anneau (`FicheCours.css:795`) | 48 px · 800 · interligne 1 | 28 px · 800 · interligne 1 | taille | 20 px |
| Dashboard apprenant | « [N] XP » de l'en-tête (`Dashboard.css:30`) | 17 / 20 px · 800 · interligne 1,2 | 28 px · 800 · interligne 1 | taille, interligne | 11 px |
| Dashboard apprenant | pourcentage dans l'anneau (`Dashboard.css:382`) | 17 / 26 px · 800 · interligne 1,2 | 28 px · 800 · interligne 1 | taille, interligne | 11 px |
| Dashboard admin | chiffre de carte (`DashboardFormateur.css:777`) | 36 px · 800 · interligne 1,1 | 28 px · 800 · interligne 1 | taille, interligne | 8 px |

### 3.3 Écarts de 4 px ou plus

| Écart | Rôle | Écran | Élément | Rendu actuel | Proposé |
|---|---|---|---|---|---|
| 20 px | Chiffre mis en avant | Fin de quiz | score « 4/5 » dans l'anneau | 48 px | 28 px |
| 16 px | Titre de page | Parcours : Création du compte | « Plus qu'une étape, [Prénom] » | 28 px | 34 / 44 px |
| 14 px | Titre de page | Fin de quiz | titre « Belle maîtrise ! » | 30 px | 34 / 44 px |
| 14 px | Titre de page | Création de cours | H1 de l'en-tête (mobile < 1024 / desktop ≥ 1024) | 20 / 44 px | 34 / 44 px |
| 12 px | Titre de contenu | Détail cours | titre du cours (H1) : perd contre .espace-page h1 | 34 / 44 px | 28 / 32 px |
| 11 px | Chiffre mis en avant | Dashboard apprenant | « [N] XP » de l'en-tête | 17 / 20 px | 28 px |
| 11 px | Chiffre mis en avant | Dashboard apprenant | pourcentage dans l'anneau | 17 / 26 px | 28 px |
| 11 px | Titre de carte | Dashboard apprenant (desktop, colonne étroite) | « Quiz flash » vertical | n/a / 28 px | n/a / 17 px |
| 8 px | Titre de contenu | Fiche : quiz, Quiz flash | question | 24 px | 28 / 32 px |
| 8 px | Chiffre mis en avant | Dashboard admin | chiffre de carte | 36 px | 28 px |
| 8 px | Titre de section | Cours | titre de section (« Thèmes », « N résultats ») | 22 / 28 px | 20 px |
| 6 px | Titre de contenu | Dashboard apprenant | « Quiz flash » du bloc de tête E | 34 px | 28 / 32 px |
| 5,6 px | Titre de section | Dashboard formateur | titre « Taux de complétion » | 14,4 px | 20 px |
| 5 px | Méta | Parcours : questions | compteur « 2 / 5 » | 18 px | 13 px |
| 5 px | Titre de carte | Fiche : leçon, checklist | titre de la carte « Étape suivante » | 22 px | 17 px |
| 5 px | Titre de carte | Fin de quiz | nom du badge débloqué | 22 px | 17 px |
| 5 px | Titre de carte | Récap | titre du cours suivant | 22 px | 17 px |
| 5 px | Titre de carte | Dashboard apprenant | titre de carte blanche / lavande | 22 px | 17 px |
| 5 px | Titre de carte | Mes groupes | nom de la carte de groupe | 20 / 22 px | 17 px |
| 4 px | Saisie et choix | Parcours : questions | saisie du grand champ (prénom, organisme…) | 20 px | 16 px |
| 4 px | Titre de section | Espace formateur, Création de cours | titre de modale | 24 px | 20 px |
| 4 px | Titre de section | Fiche : leçon | intertitre H2 de la leçon | 21 / 24 px | 20 px |
| 4 px | Titre de section | Dashboard formateur : Pour bien démarrer | titre de la carte | 24 px | 20 px |

## 4. Les cas « À trancher » de l'audit (section 3.3)

| Élément | Rattaché à | Raison |
|---|---|---|
| Titre de fin de quiz « Belle maîtrise ! » | Titre de page | Seul titre d'un écran complet, il dit ce que l'écran annonce ; le bloc du score n'est pas une carte parmi d'autres. |
| « Plus qu'une étape, [Prénom] » (Création du compte) | Titre de page | Sur cet écran du parcours, il tient la place du titre d'étape que portent les autres écrans (`.parcours-titre`). |
| Question du quiz | Titre de contenu | C'est l'objet que l'écran présente, comme le titre du cours sur la leçon. |
| Titre du cours dans l'en-tête compact (Checklist) | Titre de ligne | C'est un rappel du cours dans une barre compacte ; le contenu lu de l'écran est la checklist. |
| Titre du bloc de tête (Dashboard apprenant) | Titre de contenu | Il nomme un cours, comme le titre de la fiche. |
| « Quiz flash » du bloc de tête E | Titre de contenu | Même place et même fonction que le titre des autres blocs de tête, qu'il remplace dans cette situation. |
| Titres de carte de l'espace formateur (« Tes groupes », « Élèves »…) | Titre de section | Dans l'espace formateur, chaque carte blanche est une section de la page (une carte par section). |
| « Taux de complétion » | Titre de section | Il titre sa carte au même titre que « Tes groupes », sa voisine ; sa taille actuelle (14,4 px 500) relève de l'apparence, pas de la fonction. |
| Intertitre de jour « Aujourd'hui » | Libellé court | Il nomme le groupe de lignes qui suit, sans ouvrir une partie de page. |
| Nom de la carte de thème | Titre de carte | Chaque thème est une carte cliquable autonome dans une grille, pas une ligne de liste. |
| « X étapes sur N » (Checklist) | Titre de carte | C'est une phrase qui titre la carte de progression, pas un nombre isolé. |
| Intitulé de l'étape en cours (Checklist) | Corps de texte | Même texte et même fonction que les autres intitulés ; la mise en avant de l'étape en cours est une variante d'état (section 6). |
| Ligne de choix du parcours, réponse du quiz, bouton de choix de Création | Saisie et choix | Le texte est la réponse choisie par l'utilisateur, comme une valeur de champ. |
| Pastilles de filtre « Tout / Commencés / Terminés » | Action | Cliquer change ce que montre la liste : c'est un contrôle, pas un état affiché. |
| Carte pointillée « + Assigner un cours » | Action | Bouton et lien sont réunis dans Action ; la question ne se pose plus. |
| Texte d'un événement (Activité récente) | Corps de texte | C'est une phrase ; le gras du nom et du cours est une emphase dans la phrase. |
| Libellé de case dans la modale d'assignation | Saisie et choix | C'est l'option que l'utilisateur coche, comme une ligne de choix. |
| « N min de lecture » (Leçon) | Méta | Information courte et factuelle sur le contenu, comme « N étapes ». |
| Notes sous les cartes du dashboard formateur | Texte secondaire | Phrase qui commente la carte ; aide et texte secondaire sont réunis. |
| Texte d'état vide | Texte secondaire | Phrase qui remplace un contenu absent ; même réunion. |

Les 20 cas sont rattachés : la fonction a suffi à décider pour chacun.

## 5. Les valeurs écrasées de l'audit (section 5.3)

| Élément | Écrit | Rendu en prod | Proposé | La proposition suit… |
|---|---|---|---|---|
| Boutons du parcours (« Continuer », « Créer mon compte »…) | 17 px 800 | 16 px 700 | 15 px 800 (Action) | **ni l'une ni l'autre** : ils prennent la valeur du rôle Action, comme tous les boutons. La graisse rejoint la valeur écrite (800) ; la taille s'éloigne des deux (−1 px depuis le rendu). |
| Titre du cours (Détail cours) | 28 / 32 px | 34 / 44 px | 28 / 32 px (Titre de contenu) | **la valeur écrite** : c'est un titre de cours, comme sur la fiche ; 34 / 44 px venait d'un conflit de sélecteurs (`.espace-page h1`), pas d'un choix. Impact compté depuis le rendu : −6 px mobile, −12 px desktop. |
| « À retenir » dans l'aperçu de Création de cours | 17 px | 22 px | 17 px (Titre de carte) | **la valeur écrite** : l'aperçu sert à montrer la fiche telle que l'élève la verra, où ce titre fait 17 px. |

## 6. À trancher

- **Seuil 1024 px de Création de cours.** L'en-tête passe de 20 px (en-tête mobile, jusqu'à 1023 px) à 44 px (en-tête desktop, à partir de 1024 px). La proposition applique le seuil unique de 768 px et le Titre de page (34 / 44 px). Il faut décider si Création de cours garde un seuil à 1024 px pour sa mise en page, et quelle taille porte l'en-tête mobile compact (20 px aujourd'hui, 34 px proposé : +14 px).
- **Variantes d'état et emphase.** Ces règles ne changent que la graisse d'un élément selon son état ; la proposition ne dit pas si elles restent. Lecture 1 : une graisse par rôle, sans exception. Lecture 2 : un état peut monter d'un cran (500 → 600 ou 700 → 800). Cas concernés : ligne de choix choisie (600 → 700), option choisie de la liste déroulante (600), libellé du repère d'étapes selon l'état (600 / 700 / 800), « Bonne réponse » coché (800), compte d'un thème commencé (800), compteur de la pastille de section de Création (600), « Aucune modification » (600), étape en cours de la checklist (17 px 800 aujourd'hui), `strong` en 800 dans les phrases du dashboard formateur, du parcours et de Mes groupes, liens Markdown (600).
- **Gras et italique du Markdown.** Un `strong` dans un texte à 800 demande 900 (non chargée) et ne se voit pas ; l'italique est une italique de synthèse. Lecture 1 : charger Urbanist Italic. Lecture 2 : interdire ou neutraliser l'italique dans le contenu des cours.
- **Caractères affichés en Arial** (croix « × », flèches ↑ ↓, flèche de tri ▲ ▼). Ils prendront Urbanist (règle des contrôles). Lecture 1 : ce sont des caractères de texte, ils entrent dans un rôle (Action). Lecture 2 : ce sont des icônes, à remplacer par des SVG comme les autres boutons ronds, et la typographie ne les concerne plus.
- **Écarts de 4 px ou plus** (section 3.3). Ils suivent la règle « une valeur par rôle », mais certains effacent une hiérarchie voulue dans les maquettes et décrite dans CLAUDE.md : score de fin de quiz 48 → 28 px, titres de carte du dashboard apprenant et des cartes encre de la fiche 22 → 17 px, « Quiz flash » vertical 28 → 17 px, XP et pourcentage de l'anneau du dashboard 17 / 20 et 17 / 26 → 28 px, chiffres du dashboard admin 36 → 28 px. Lecture 1 : appliquer la règle. Lecture 2 : ouvrir un second niveau dans les rôles Titre de carte et Chiffre mis en avant (par exemple « grand chiffre » pour l'anneau de score), en restant à douze rôles au plus.
- **Taux de complétion sous 400 px de large.** Il passe aujourd'hui de 28 à 20,8 px sous 400 px (dont l'iPhone à 390 px). Avec un seul seuil à 768 px, il reste à 28 px sur tous les mobiles ; il faut vérifier qu'il tient dans sa carte.
- **Libellé court : une seule graisse (700).** Le rôle réunit des pastilles en 800, des surtitres en 700 et des libellés de champ en 500. La valeur retenue (13 px 700) change 30 éléments sur 40, dont les libellés de champ, aujourd'hui entre 14 et 14,4 px et entre 500 et 800, qui passent tous à 13 px 700.
- **CLAUDE.md et les maquettes.** CLAUDE.md décrit de nombreuses tailles écran par écran (par exemple « Titre 26 px mobile / 32 px desktop » pour le bloc de tête, 48 px pour le score). Si la proposition est retenue, ces descriptions ne correspondront plus ; elles ne sont pas modifiées ici.

## Annexe. Éléments par rôle

✓ = élément inchangé par la proposition.


**Titre de page** (9) : H1 de page dans .espace-page (Pages avec navigation, `espace-layout.css:150`) ✓ ; H1 de la carte de flux (Mot de passe oublié / Nouveau mot de passe / Compléter le profil, `shared.css:108`) ✓ ; H1 du parcours (Parcours, `GabaritParcours.css:208`) ✓ ; H1 de page formateur (Espace formateur (Mes cours, Mes groupes, Détail groupe, Détail cours), `Formateur.css:30`) ✓ ; titre « Belle maîtrise ! » (Fin de quiz, `FicheCours.css:809`) ; « Salut [Prénom] » (H1) (Dashboard apprenant, `Dashboard.css:21`) ; « Bonjour [prénom] » (H1) (Dashboard formateur, admin, `DashboardFormateur.css:30`) ; « Plus qu'une étape, [Prénom] » (Parcours : Création du compte, `Parcours.css:192`) ; H1 de l'en-tête (mobile < 1024 / desktop ≥ 1024) (Création de cours, `CreationCours.css:52 + 1376`).

**Titre de contenu** (6) : nom du thème (H1) (Détail thème, `DetailTheme.css:75`) ✓ ; titre du cours (H1) : perd contre .espace-page h1 (Détail cours, `DetailCoursFormateur.css:25`) ; titre du cours (H1) (Fiche : leçon, récap, `FicheCours.css:222`) ✓ ; question (Fiche : quiz, Quiz flash, `FicheCours.css:432`) ; titre du bloc de tête (cours en cours / assigné) (Dashboard apprenant, `Dashboard.css:360`) ; « Quiz flash » du bloc de tête E (Dashboard apprenant, `Dashboard.css:440`).

**Titre de section** (16) : h2 par défaut dans .espace-page (Pages avec navigation, `espace-layout.css:163`) ; titre Markdown niveau 1 (Contenu Markdown, `ContenuMarkdown.css:14`) ; titre Markdown niveau 2 (hors leçon) (Contenu Markdown, `ContenuMarkdown.css:15`) ; titre Markdown niveau 3 (Contenu Markdown, `ContenuMarkdown.css:16`) ; titre de carte de section (h2) (Espace formateur, `Formateur.css:54`) ✓ ; titre de la feuille du menu « … » (Espace formateur (mobile), `Formateur.css:285`) ; titre de modale (Espace formateur, Création de cours, `Formateur.css:357`) ; intertitre H2 de la leçon (Fiche : leçon, `FicheCours.css:266`) ; titre « Mes badges » (Dashboard apprenant : modale Mes badges, `Dashboard.css:994`) ; titre de carte (« Tes groupes »…) (Dashboard formateur, admin, `DashboardFormateur.css:102`) ✓ ; titre « Taux de complétion » (Dashboard formateur, `DashboardFormateur.css:220`) ; titre « Activité récente » (Dashboard formateur, `DashboardFormateur.css:463`) ; titre de la carte (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:657`) ; titre « Cours assignés » (Détail groupe, `DetailGroupe.css:78`) ✓ ; titre de carte de section (Infos, Leçon…) (Création de cours, `CreationCours.css:253`) ; titre de section (« Thèmes », « N résultats ») (Cours, `SectionCours.css:20`).

**Titre de carte** (17) : titre du toast de complétion (Partagé (fiche), `CompletionToast.css:30`) ; titre du bloc « De ton formateur » (Dashboard apprenant, Cours, `BlocFormateur.css:21`) ; titre de l'encadré « À retenir » (Détail cours, `DetailCoursFormateur.css:268`) ✓ ; titre de l'encadré « À retenir » (Fiche : leçon (et aperçu Création, où il est écrasé), `FicheCours.css:294`) ✓ ; titre de la carte « Étape suivante » (Fiche : leçon, checklist, `FicheCours.css:351`) ; titre du bloc de correction (« Bien vu ») (Fiche : quiz, Quiz flash, `FicheCours.css:654`) ; nom du badge débloqué (Fin de quiz, `FicheCours.css:886`) ; « X étapes sur N » (Fiche : checklist, `FicheCours.css:1062`) ; titre du cours suivant (Récap, `FicheCours.css:1346`) ; titre de carte blanche / lavande (Dashboard apprenant, `Dashboard.css:143`) ; titre « Quiz flash » du bloc en ligne F (Dashboard apprenant, `Dashboard.css:477`) ; titre « Quiz flash » verrouillé (Dashboard apprenant, `Dashboard.css:547`) ✓ ; titre de la carte de thème (Cours, `SectionCours.css:89`) ; titre de la carte de cours (Mes cours, `FormateurListes.css:60`) ; nom de la carte de groupe (Mes groupes, `FormateurListes.css:88`) ; titre de la carte de profil (Parcours : Choix du profil, `Parcours.css:157`) ; « Quiz flash » vertical (Dashboard apprenant (desktop, colonne étroite), `Dashboard.css:941`).

**Titre de ligne** (16) : titre de la ligne de cours (Terrain, recherche Cours, `LigneCours.css:47`) ; titre de cours de la ligne du bloc formateur (Dashboard apprenant, Cours, `BlocFormateur.css:93`) ✓ ; titre de la ligne de cours (Détail thème, `DetailTheme.css:136`) ; énoncé de question (Détail cours, `DetailCoursFormateur.css:340`) ✓ ; question ratée (Fin de quiz : mes erreurs, `FicheCours.css:953`) ; titre du cours de l'en-tête compact (H1) (Fiche : checklist, `FicheCours.css:1041`) ✓ ; titre de ligne (Leçon, Quiz, Checklist) (Récap, `FicheCours.css:1311`) ; nom du badge (Dashboard apprenant : modale Mes badges, `Dashboard.css:1051`) ✓ ; nom du groupe (Dashboard formateur, `DashboardFormateur.css:298`) ; « Personne à relancer » (Dashboard formateur, `DashboardFormateur.css:440`) ; titre d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:722`) ; titre du cours dans le tableau (Dashboard admin, `DashboardFormateur.css:819`) ✓ ; titre de la carte de cours assigné (Détail groupe, `DetailGroupe.css:120`) ; nom de l'élève (Détail groupe, `DetailGroupe.css:183`) ✓ ; énoncé de la question repliée (Création de cours, `CreationCours.css:623`) ✓ ; « Question N » (h3) (Création de cours, `CreationCours.css:655`).

**Corps de texte** (19) : texte de tableau (Contenu Markdown, `ContenuMarkdown.css:95`) ; texte du toast de complétion (Partagé (fiche), `CompletionToast.css:15`) ; texte courant (paragraphe) (Espace formateur, modale de confirmation, `Formateur.css:67`) ✓ ; premier paragraphe de la leçon (Détail cours, `DetailCoursFormateur.css:212`) ; points de l'encadré « À retenir » (Détail cours, `DetailCoursFormateur.css:294`) ; bonne réponse (Détail cours, `DetailCoursFormateur.css:353`) ; intitulé d'étape de checklist (Détail cours, `DetailCoursFormateur.css:372`) ; texte de la leçon (Fiche : leçon, aperçu Création, `FicheCours.css:253`) ; points de l'encadré « À retenir » (Fiche : leçon, `FicheCours.css:321`) ; explication de la correction (Fiche : quiz, Quiz flash, `FicheCours.css:662`) ✓ ; ligne « Ta réponse / Bonne réponse » (Fin de quiz : mes erreurs, `FicheCours.css:963`) ; explication (Fin de quiz : mes erreurs, `FicheCours.css:977`) ; consigne de remise en ordre (Fiche : checklist (remise en ordre), `FicheCours.css:1081`) ; intitulé d'étape (Fiche : checklist, `FicheCours.css:1172`) ; intitulé de l'étape en cours (Fiche : checklist, `FicheCours.css:1205`) ; texte de relance (Dashboard formateur, `DashboardFormateur.css:366`) ; texte de l'événement (Dashboard formateur, `DashboardFormateur.css:602`) ; cellules chiffrées du tableau (Dashboard admin (desktop), `DashboardFormateur.css:1064`) ; cellules du tableau des élèves (Détail groupe (desktop), `DetailGroupe.css:350`).

**Texte secondaire** (27) : phrase d'explication sous le H1 (Mot de passe oublié, `shared.css:119`) ; message d'erreur (.message) (Partagé, `shared.css:358`) ; texte d'état vide (Terrain, Détail thème, Détail groupe, `shared.css:512`) ; message de résultat de la remise en ordre (Fiche : checklist (remise en ordre), `quiz.css:85`) ; sous-titre sous le H1 (Parcours, `GabaritParcours.css:215`) ; message d'erreur (Parcours, `GabaritParcours.css:365`) ✓ ; sous-titre de l'en-tête lavande (Cours, Terrain, `EntetePage.css:35`) ; sous-titre sous le H1 (« N élèves · N cours ») (Espace formateur, `Formateur.css:37`) ; sous-titre de modale (Espace formateur, `Formateur.css:363`) ; « x cours terminés sur y » (Détail thème, `DetailTheme.css:88`) ✓ ; « Plusieurs réponses possibles » (Fiche : quiz, Quiz flash, `FicheCours.css:445`) ✓ ; sous-titre « Une seule erreur à revoir. » (Fin de quiz, `FicheCours.css:816`) ; phrase d'état (« Leçon lue. Reste le quiz ») (Dashboard apprenant, `Dashboard.css:388`) ; phrase du bloc de tête E (Dashboard apprenant, `Dashboard.css:449`) ; « 3 cours · 1 groupe · 12 élèves » (Dashboard formateur, admin, `DashboardFormateur.css:36`) ; note sous une carte (Dashboard formateur, `DashboardFormateur.css:133`) ; note 14 px (Pour bien démarrer) (Dashboard formateur, `DashboardFormateur.css:139`) ; texte d'état vide (Dashboard formateur, admin, `DashboardFormateur.css:144`) ; confirmation d'envoi de relance (Dashboard formateur, `DashboardFormateur.css:376`) ; titre du cours tronqué sous le H1 (Création de cours (< 1024), `CreationCours.css:60`) ; aide sous un champ (Création de cours, `CreationCours.css:272`) ; message d'erreur (Création de cours, `CreationCours.css:279`) ; message de la barre d'enregistrement (Création de cours, `CreationCours.css:1075`) ✓ ; « Aucun cours ne correspond… » (Cours, `SectionCours.css:28`) ; aide sous un champ (mot de passe) (Parcours, `Parcours.css:17`) ; texte du bloc lavande (Parcours : Création du compte, `Parcours.css:199`) ; phrase du quiz flash vertical (Dashboard apprenant (desktop, colonne étroite), `Dashboard.css:952`).

**Méta** (54) : compteur « 2 / 5 » (Parcours : questions, `GabaritParcours.css:195`) ; « +15 XP » du toast (Partagé (fiche), `CompletionToast.css:39`) ; méta de la ligne de cours (Terrain, recherche Cours, `LigneCours.css:54`) ✓ ; libellé d'étape (Leçon, Quiz · 4/5…) (Fiche : leçon, checklist, `ReperEtapes.css:67`) ; compteur « N cours » du bloc formateur (Cours, `BlocFormateur.css:44`) ; méta (« X terminés sur N »…) (Espace formateur, `Formateur.css:73`) ; détail sous le libellé de case (Modale d'assignation, `Formateur.css:532`) ✓ ; contenu « Leçon · Quiz · Checklist » (Détail thème, `DetailTheme.css:143`) ✓ ; légende de la barre d'avancement (Détail cours, `DetailCoursFormateur.css:96`) ; libellé des petites cartes d'avancement (Détail cours, `DetailCoursFormateur.css:141`) ; texte du bandeau « Aperçu élève » (Aperçu élève, `FicheCours.css:104`) ; « N min de lecture » / « X XP gagnés » (Fiche : leçon, récap, `FicheCours.css:234`) ; détail « N questions · +20 XP » (Fiche : leçon, checklist, `FicheCours.css:358`) ; compteur « 3 / 5 » (Fiche : quiz, Quiz flash, `FicheCours.css:413`) ; « 80 % » sous le score (Fin de quiz, `FicheCours.css:801`) ; condition du badge (Fin de quiz, `FicheCours.css:892`) ; « +15 XP à la fin » (Fiche : checklist, `FicheCours.css:1067`) ; critère de validation (Fiche : checklist, `FicheCours.css:1221`) ; détail de ligne (« Meilleur score : 4/5 ») (Récap, `FicheCours.css:1316`) ✓ ; contenu du cours suivant (Récap, `FicheCours.css:1352`) ; sous-texte (thème, condition du badge) (Dashboard apprenant, `Dashboard.css:149`) ; compteur de barre « X / 3 » (Dashboard apprenant, `Dashboard.css:318`) ; compteur de barre, petite variante (Dashboard apprenant, `Dashboard.css:323`) ; méta du cours assigné (« thème · ajouté hier ») (Dashboard apprenant, `Dashboard.css:426`) ; méta « 10 questions · +30 XP » (Dashboard apprenant, `Dashboard.css:482`) ✓ ; consigne du quiz flash verrouillé (Dashboard apprenant, `Dashboard.css:552`) ; compteur « X/6 » (Dashboard apprenant : modale Mes badges, `Dashboard.css:1001`) ; condition du badge (Dashboard apprenant : modale Mes badges, `Dashboard.css:1057`) ✓ ; « Obtenu le JJ/MM » (Dashboard apprenant : modale Mes badges, `Dashboard.css:1062`) ; sous-titre « Sur l'ensemble de tes groupes » (Dashboard formateur, `DashboardFormateur.css:225`) ; « N élèves · N cours » (Dashboard formateur, `DashboardFormateur.css:304`) ; « Actif aujourd'hui » (Dashboard formateur, `DashboardFormateur.css:311`) ; % de la barre du groupe (Dashboard formateur, `DashboardFormateur.css:330`) ; date « Il y a N jours » (Dashboard formateur, `DashboardFormateur.css:370`) ; « Tous tes élèves ont commencé… » (Dashboard formateur, `DashboardFormateur.css:446`) ; statut « Quiz 90 % / En cours » (Dashboard formateur, `DashboardFormateur.css:640`) ; « N étapes sur 3 » (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:663`) ; sous-titre d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:727`) ; libellé de carte chiffrée (Dashboard admin, `DashboardFormateur.css:771`) ; précision « 30 derniers jours » (Dashboard admin, `DashboardFormateur.css:783`) ✓ ; thème court sous le titre (Dashboard admin, `DashboardFormateur.css:826`) ✓ ; résumé « 42 commencés · 18 terminés » (Dashboard admin (mobile), `DashboardFormateur.css:831`) ; email de l'élève (Détail groupe, `DetailGroupe.css:190`) ✓ ; statut par cours dans la carte élève (Détail groupe (mobile), `DetailGroupe.css:242`) ; compteur du sommaire (Création de cours (≥ 1024), `CreationCours.css:191`) ; nom d'image en étiquette (Création de cours, `CreationCours.css:519`) ; méta « Réponse unique · 3 réponses » (Création de cours, `CreationCours.css:632`) ; sous-titre de mode de checklist (Création de cours (≥ 768), `CreationCours.css:901`) ✓ ; compte « y cours » de la carte de thème (Cours, `SectionCours.css:105`) ; méta de carte (Mes cours, Mes groupes, `FormateurListes.css:64`) ; ligne « Cours terminés » (Mes groupes, `FormateurListes.css:101`) ; description de la carte de profil (Parcours : Choix du profil, `Parcours.css:162`) ; en-têtes de colonne du tableau (Dashboard admin (desktop), `DashboardFormateur.css:1045`) ; en-têtes de colonne du tableau des élèves (Détail groupe (desktop), `DetailGroupe.css:338`).

**Libellé court** (40) : pastille de statut (Nouveau, À faire, Non commencé) (Partagé (Cours, Dashboard, Détail groupe…), `espace-layout.css:252`) ; pastille de statut En cours / Terminé (Partagé, `espace-layout.css:275`) ; libellé de champ (.champ) (Partagé (modales, Détail groupe, Mes cours, mot de passe), `shared.css:126`) ; libellé de champ (Parcours, `GabaritParcours.css:228`) ; nom du badge dans le toast (Partagé (fiche), `CompletionToast.css:48`) ; numéro dans la pastille d'étape (Fiche : leçon, checklist, `ReperEtapes.css:56`) ; pastille de groupe / « Non assigné » (Espace formateur, `Formateur.css:178`) ✓ ; surtitre « Thème N » (Détail thème, `DetailTheme.css:66`) ✓ ; « +N » sur la dernière miniature (Détail cours, `DetailCoursFormateur.css:246`) ; numéro de question (Détail cours, `DetailCoursFormateur.css:328`) ; thème au-dessus du titre (Fiche : leçon, récap, `FicheCours.css:215`) ✓ ; libellé « Étape suivante » de la carte encre (Fiche : leçon, checklist, `FicheCours.css:344`) ✓ ; libellé du cours au-dessus de la question (Fiche : quiz, Quiz flash, `FicheCours.css:426`) ✓ ; pastille « Ta réponse » / « Bonne réponse » (Fiche : quiz, Quiz flash, `FicheCours.css:606`) ; titre du cours dans la barre du haut (Fin de quiz, `FicheCours.css:718`) ✓ ; « Quiz terminé » (Fin de quiz, `FicheCours.css:763`) ✓ ; pastille « +20 XP » (Fin de quiz, `FicheCours.css:830`) ; pastille « Nouveau badge » (Fin de quiz, `FicheCours.css:881`) ; thème de l'en-tête compact (Fiche : checklist, `FicheCours.css:1033`) ; numéro dans la pastille d'étape (Fiche : checklist, `FicheCours.css:1109`) ; pastille « Bloquante » (Fiche : checklist, `FicheCours.css:1215`) ; « X XP gagnés » (pastille Terminé) (Récap, `FicheCours.css:1276`) ; libellé « Suite du thème » (Récap, `FicheCours.css:1339`) ✓ ; libellé violet (« Ton premier cours »…) (Dashboard apprenant, `Dashboard.css:131`) ✓ ; libellé sur carte violette (« Tu en es là ») (Dashboard apprenant, `Dashboard.css:137`) ; pastille « De ton formateur » (Dashboard apprenant, `Dashboard.css:191`) ; pastille orange « Défi du jour » (Dashboard apprenant, `Dashboard.css:206`) ; pastille « Compte officiel » (Dashboard admin, `DashboardFormateur.css:63`) ; pastille « À surveiller / Bon rythme » (Dashboard formateur, `DashboardFormateur.css:236`) ; intertitre de jour (« Aujourd'hui ») (Dashboard formateur, `DashboardFormateur.css:549`) ✓ ; initiales sur rond lavande (Dashboard formateur, `DashboardFormateur.css:596`) ; pastille du groupe (Dashboard formateur, `DashboardFormateur.css:626`) ; numéro dans le rond (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:695`) ; pastille « Compte officiel : ce cours sera public » (Création de cours, `CreationCours.css:236`) ; libellé de champ (Création de cours, `CreationCours.css:266`) ; numéro de question / d'étape (Création de cours, `CreationCours.css:575`) ; lettre de réponse (Création de cours, `CreationCours.css:751`) ; libellé « Bonne réponse » (Création de cours, `CreationCours.css:832`) ; pilule « Bloquante » (Création de cours, `CreationCours.css:1013`) ; surtitre « Thème N » de la carte de thème (Cours, `SectionCours.css:82`).

**Action** (46) : libellé d'entrée de la tab bar (mobile) (Navigation, `espace-layout.css:48`) ; entrée du menu (Se déconnecter) (Navigation, `espace-layout.css:123`) ; libellé du bouton principal (Partagé, `shared.css:200`) ; libellé du bouton secondaire (Partagé, `shared.css:230`) ; libellé du bouton orange (quiz flash) (Dashboard apprenant, `shared.css:255`) ; lien « ← Retour » (Mot de passe oublié, `shared.css:321`) ; lien secondaire (simuler le lien) (Mot de passe oublié, `shared.css:343`) ; bouton pointillé « + Ajouter… » (Création de cours, `shared.css:380`) ; libellé du bouton du parcours (écrasé par .bouton-primaire / .bouton-secondaire) (Parcours, `GabaritParcours.css:86`) ; lien sous le bouton (« Déjà un compte ? … ») (Parcours, `GabaritParcours.css:106`) ; lien « Passer » (Parcours : Introduction, `GabaritParcours.css:135`) ; texte du lien Retour « ‹ Mes cours » (Espace formateur, `Formateur.css:161`) ✓ ; action du menu « … » (Espace formateur, `Formateur.css:297`) ; lien d'action « Annuler » (Modales, barre de Création de cours, `Formateur.css:397`) ; libellé du bouton rouge (Modale de confirmation, `Formateur.css:411`) ; bouton texte « Supprimer ce groupe » (Détail groupe, `Formateur.css:433`) ✓ ; bouton Retour « Cours » (Détail thème, `DetailTheme.css:21`) ✓ ; bouton « Quitter l'aperçu » (Aperçu élève, `FicheCours.css:115`) ; bouton Retour (nom court du thème) (Fiche, `FicheCours.css:170`) ✓ ; libellé du bouton blanc (Fiche : leçon, checklist, `FicheCours.css:374`) ; lien « Revoir la leçon » (Fiche : quiz, Quiz flash, `FicheCours.css:673`) ✓ ; libellé du bouton « Valider ma réponse » (Fiche : quiz, Quiz flash, `FicheCours.css:685`) ; libellé du bouton principal (Fin de quiz, `FicheCours.css:901`) ; liens « Revoir mes erreurs »… (Fin de quiz, `FicheCours.css:919`) ✓ ; lien « Passer cette étape » (Fiche : checklist, `FicheCours.css:1153`) ✓ ; libellé des boutons « Relire / Refaire / Revoir » (Récap, `FicheCours.css:1323`) ; lien « Tout voir » / « Mes badges · X/6 » (Dashboard apprenant, Cours, `Dashboard.css:166`) ; libellé du bouton blanc à flèche (Dashboard apprenant, `Dashboard.css:222`) ; libellé du bouton large orange (Dashboard apprenant, `Dashboard.css:255`) ; libellé du bouton « Commencer » (Dashboard apprenant, `Dashboard.css:410`) ✓ ; libellé du bouton « Lancer » (Dashboard apprenant, `Dashboard.css:495`) ✓ ; lien « Tout voir » (Dashboard formateur, admin, `DashboardFormateur.css:112`) ; lien « Voir les N autres » / « Voir plus » (Dashboard formateur, `DashboardFormateur.css:128`) ✓ ; pastilles de filtre « Tout / Commencés / Terminés » (Dashboard formateur, `DashboardFormateur.css:494`) ; libellé du bouton d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:740`) ; lien « Assigner » (Détail groupe, `DetailGroupe.css:87`) ✓ ; carte pointillée « + Assigner un cours » (Détail groupe, `DetailGroupe.css:137`) ✓ ; lien « Voir les N autres » (Détail groupe, `DetailGroupe.css:255`) ✓ ; pastille de section collante (Création de cours (< 1024), `CreationCours.css:94`) ; bouton Retour « Mes cours » (Création de cours (≥ 1024), `CreationCours.css:144`) ; entrée du sommaire (Création de cours (≥ 1024), `CreationCours.css:181`) ; liens « Voir comme un élève » / « Créer un groupe » (Création de cours, `CreationCours.css:208`) ✓ ; onglet « Écrire / Aperçu » (Création de cours, `CreationCours.css:409`) ; bouton d'outil « Image / Vidéo » (Création de cours, `CreationCours.css:438`) ; bouton « Image » d'étape (Création de cours, `CreationCours.css:1038`) ; bouton « Lancer » vertical (Dashboard apprenant (desktop, colonne étroite), `Dashboard.css:960`).

**Saisie et choix** (18) : saisie de champ input (.champ) (Partagé, `shared.css:136`) ; saisie de champ textarea (.champ) (Partagé, `shared.css:148`) ; saisie de champ (Parcours, `GabaritParcours.css:248`) ✓ ; saisie du grand champ (prénom, organisme…) (Parcours : questions, `GabaritParcours.css:269`) ; ligne de choix (statut, âge, motivation) (Parcours : questions, `GabaritParcours.css:296`) ; saisie de la recherche (Cours, `EntetePage.css:48`) ; valeur affichée de la liste déroulante (Création de cours, Mes cours, `Dropdown.css:12`) ; option de la liste déroulante (Création de cours, Mes cours, `Dropdown.css:61`) ; libellé de case à cocher (Modale d'assignation, Création de cours, `Formateur.css:527`) ; texte de réponse (Fiche : quiz, Quiz flash, `FicheCours.css:467`) ✓ ; saisie « Un élève » (Dashboard formateur, `DashboardFormateur.css:531`) ; saisie de l'email d'ajout (Détail groupe, `DetailGroupe.css:46`) ✓ ; bouton de choix (groupe, mode de checklist) (Création de cours, `CreationCours.css:327`) ; saisie de l'éditeur de leçon (Création de cours, `CreationCours.css:458`) ; saisie de réponse / d'explication (Création de cours, `CreationCours.css:767`) ; saisie d'explication (Création de cours, `CreationCours.css:776`) ; libellé de mode de checklist (Création de cours, `CreationCours.css:895`) ; saisie de l'intitulé d'étape (Création de cours, `CreationCours.css:961`).

**Chiffre mis en avant** (6) : chiffre des petites cartes d'avancement (Détail cours, `DetailCoursFormateur.css:130`) ✓ ; score « 4/5 » dans l'anneau (Fin de quiz, `FicheCours.css:795`) ; « [N] XP » de l'en-tête (Dashboard apprenant, `Dashboard.css:30`) ; pourcentage dans l'anneau (Dashboard apprenant, `Dashboard.css:382`) ; taux de complétion (chiffre) (Dashboard formateur, `DashboardFormateur.css:206`) ✓ ; chiffre de carte (Dashboard admin, `DashboardFormateur.css:777`).
