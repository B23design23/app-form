# Proposition de valeurs typographiques par rôle (version 2)

> Version 1 : commit `b79f039` (même fichier). Elle changeait 210 éléments sur 274 avec 12 rôles ; cette version la remplace.

Étape 2 du chantier typographie, version 2, rédigée le 2026-11-04 à partir de `docs/audit-typographie.md`. Ce document propose des valeurs. Il ne crée aucun token et ne corrige rien. Les noms de rôles restent en français courant.

**Base de calcul (inchangée sauf mention)**

- Un **élément** est un type d'élément rendu en prod (origin/main `a6d20f6`) : une règle CSS de base utilisée, avec sa variante desktop et les classes qui s'y combinent. Total : **275 éléments**. Par rapport à la version 1 (274), l'en-tête de Création de cours est compté comme deux éléments : l'en-tête compact (affiché sous 1024 px) et l'en-tête desktop (à partir de 1024 px), puisque 1024 reste un seuil de mise en page (décision 9). Correction au passage : les titres de carte de Mes cours et de Mes groupes sont bien en 800 (classe `.fl-carte-titre` combinée), la version 1 les comptait en 500.
- Valeur **actuelle** = valeur rendue en prod, y compris pour les valeurs écrasées de l'audit.
- **Valeur d'un rôle** : la combinaison taille mobile · taille desktop · graisse · hauteur de ligne qui laisse le plus d'éléments du rôle inchangés. En cas d'égalité, celle qui donne le plus petit écart cumulé (en px et en crans de graisse). Exceptions imposées : Corps courant (15 px, 500, 1,45) et Texte de lecture (valeur de la leçon, voir 1.3).
- Tailles en px entiers, sortie en rem base 16. Graisses 500 à 800. Contrôles de formulaire et boutons : famille et graisse de leur rôle. Hauteur de ligne 1,2 là où rien n'est déclaré. Seuil unique 768 px pour la typographie.

**Lecture du critère de fusion.** Deux rôles candidats fusionnent si leurs valeurs dominantes (combinaison la plus fréquente) diffèrent **d'au plus 1 px et d'au plus un cran de graisse**, ou si l'écart vient d'un accident (taille issue d'un rem, valeur écrasée). Je lis « 1 px ou un cran » comme deux plafonds cumulables ; si l'instruction voulait dire « l'un ou l'autre, pas les deux », la fusion Texte secondaire tombe (voir section 9). Le critère est nécessaire mais pas suffisant : deux rôles aux valeurs proches mais aux fonctions différentes (Titre de ligne et Lien texte, tous deux à 15 px 800) restent séparés.

## 1. Rôles

18 rôles. Titre de carte et Chiffre mis en avant ont chacun deux niveaux, soit 20 jeux de valeurs.

| Rôle | Fonction | Taille mobile | Taille desktop | Graisse | Hauteur de ligne | Espacement des lettres | Éléments |
|---|---|---|---|---|---|---|---|
| Titre de page | Nomme l'écran ; un seul par écran, en tête | 34 px | 44 px | 800 | 1,1 | normal | 9 |
| Titre de contenu | Nomme l'objet que l'écran présente (cours, thème, question) | 28 px | 32 px | 800 | 1,1 | normal | 6 |
| Titre de section | Ouvre une partie de page ou une surface (section, carte de section, modale, feuille de menu) | 20 px | 20 px | 800 | 1,2 | normal | 16 |
| Titre de carte, standard | Nomme une carte ou un bloc compact | 17 px | 17 px | 800 | 1,2 | normal | 8 |
| Titre de carte, grand | Nomme une grande carte mise en avant dans son écran | 22 px | 22 px | 800 | 1,1 | normal | 9 |
| Titre de ligne | Nomme un élément de liste, ou rappelle un titre dans une barre compacte | 15 px | 15 px | 800 | 1,2 | normal | 17 |
| Texte de lecture | Texte de la leçon, dans la fiche et dans son aperçu | 17 px | 18 px | 500 | 1,55 | normal | 2 |
| Corps courant | Phrases lues ailleurs que dans la leçon : explications, paragraphes, intitulés | 15 px | 15 px | 500 | 1,45 | normal | 17 |
| Texte secondaire | Phrase qui accompagne un titre ou un contenu : sous-titre, état, aide, erreur, message | 14 px | 14 px | 700 | 1,2 | normal | 27 |
| Méta | Information courte et factuelle sur un élément : contenu, date, compte, statut | 13 px | 13 px | 500 | 1,2 | normal | 45 |
| Surtitre | Libellé court posé au-dessus d'un titre (thème, « Tu en es là ») | 13 px | 13 px | 700 | 1,2 | normal | 12 |
| Bouton | Libellé d'un bouton (plein, contour, pointillé) | 16 px | 16 px | 800 | 1,2 | normal | 19 |
| Lien texte | Action écrite sans forme de bouton | 15 px | 15 px | 800 | 1,2 | normal | 20 |
| Navigation | Barre d'onglets, barre horizontale, onglets, filtres, entrées de menu, repère d'étapes | 14 px | 14 px | 700 | 1,2 | normal | 8 |
| Libellé de champ | Nomme un champ de formulaire | 14 px | 14 px | 700 | 1,2 | normal | 4 |
| Saisie et choix | Texte tapé ou choisi par l'utilisateur | 16 px | 16 px | 600 | 1,2 | normal | 18 |
| Pastille | Texte d'une pastille, numéros dans une pastille ronde compris | 13 px | 13 px | 800 | 1,2 | normal | 24 |
| Chiffre mis en avant, standard | Nombre qui porte l'information principale d'un bloc | 28 px | 28 px | 800 | 1 | normal | 5 |
| Chiffre mis en avant, grand | Score de fin de quiz | 48 px | 48 px | 800 | 1 | normal | 1 |
| Compteur | Chiffre de progression ou de position (« 3 / 5 », « X / 3 », %) | 14 px | 14 px | 800 | 1,2 | normal | 8 |

La liste complète des éléments de chaque rôle est en annexe.

### 1.1 Fusions et preuves

Seules trois fusions respectent le critère. Valeurs dominantes calculées sur les éléments de chaque rôle candidat de l'audit.

| Rôle proposé | Rôles candidats fusionnés | Ce qu'ils ont en commun | Preuve du critère |
|---|---|---|---|
| Titre de section | Titre de section + Titre de modale ou de menu | Tous ouvrent une surface entière et annoncent ce qu'elle contient. | Titre de section : 20 px · 800 · 1,2 (3 éléments sur 13). Titre de modale : 3 éléments à 3 tailles différentes (17 · 20,8 · 24 px), pas de valeur la plus fréquente ; la médiane, 20,8 px, est un accident de rem (`1.3rem`) qui rejoint 21 px, à 1 px de 20. Même graisse (800), même hauteur de ligne (1,2). |
| Texte secondaire | Sous-titre et texte secondaire + Aide, erreur et message | Ce sont des phrases complètes qui commentent un autre élément sans être le contenu principal. | Sous-titre : égalité entre 15 px · 600, 15 px · 500 (3 éléments chacun) et 14 px · 700 (2). Aide : 14 px · 700 (3 sur 11). 15 px · 600 contre 14 px · 700 : 1 px et un cran. |
| Pastille | Pastille + Numéro dans une pastille ronde (+ initiales et « +N », hors rôle dans l'audit) | Texte court posé dans une forme colorée qui qualifie ou numérote l'élément voisin. | Pastille : 12 px · 800 (5 sur 16). Numéro : 13 px · 800 (3 sur 6). 1 px, même graisse. |

Séparations imposées par l'instruction : Bouton, Lien texte, Navigation (ancien Action) ; Surtitre, Pastille, Libellé de champ (ancien Libellé court) ; Texte de lecture, Corps courant (ancien Corps). Surtitre et Pastille (13 px · 700 contre 12 px · 800) et Libellé de champ et Méta (14,4 px, accident de rem, contre 13 px, même graisse 500) respecteraient le critère, mais l'instruction les sépare.

Fusions refusées par le critère : Méta et Compteur (13 px · 500 contre 14-15 px · 800), Titre de carte et Titre de section (17 contre 20 px), Chiffre mis en avant et Titre de contenu (même taille mobile, mais 28 contre 32 px sur desktop et une hauteur de ligne différente).

### 1.2 Niveaux de Titre de carte et de Chiffre mis en avant

**Titre de carte, grand (22 px)** : titre de carte blanche ou lavande du dashboard apprenant, titre des cartes encre « Étape suivante » et « Suite du thème », nom du badge débloqué (fin de quiz), tous à 22 px. Cas limites rattachés au grand niveau :

- nom de la carte de groupe (Mes groupes, 20 / 22 px) : déjà à 22 px sur desktop, et c'est la valeur que décrit CLAUDE.md ;
- titre de la carte de profil (Choix du profil, 20 px) : deux grandes cartes qui occupent l'écran à elles seules ;
- « X étapes sur N » (Checklist, 20 px) : titre de la carte de progression, l'élément le plus visible de l'écran après le titre ; 2 px du grand niveau contre 3 du standard ;
- titre du bloc de correction du quiz (« Bien vu », 20 px) : même famille que les cartes encre de la fiche, qui sont au grand niveau ;
- « Quiz flash » en version verticale (desktop, colonne étroite, 28 px) : seul titre d'une carte haute, plus proche du grand niveau.

**Titre de carte, standard (17 px)** : titres « À retenir » (fiche et Détail cours), « Quiz flash » verrouillé, carte de thème (15 / 18 px), carte de cours de Mes cours (18 px), titre du toast. Cas limite : « Quiz flash » du bloc en ligne (19 px) reste au standard, le bloc étant une ligne compacte et 19 px étant plus près de 17 que de 22.

**Chiffre mis en avant, grand (48 px)** : score « 4/5 » de fin de quiz, seul élément.

**Chiffre mis en avant, standard (28 px)** : taux de complétion, chiffre des petites cartes d'avancement (Détail cours). Cas limites : chiffre des cartes du dashboard admin (36 px) reste au standard, c'est le chiffre principal d'une carte de statistiques comme le taux de complétion ; XP de l'en-tête et pourcentage de l'anneau du dashboard apprenant (17 px) restent au standard comme dans l'audit, mais ils pourraient se lire Compteur (section 9).

### 1.3 Texte de lecture et Corps courant

Texte de lecture : texte de la leçon (`.fiche-lecon-contenu`, la même règle sert à l'aperçu de Création de cours) et premier paragraphe de la leçon dans le Détail cours. Les deux éléments sont à égalité (17 / 18 px et 16 px, tous deux à 1,55) ; la valeur retenue est celle de la leçon, pour laquelle le rôle existe. Cas limite : le paragraphe du Détail cours est la leçon montrée au formateur, je le rattache au Texte de lecture plutôt qu'au Corps courant.

Corps courant : 15 px · 500 · 1,45, imposé. C'est déjà la combinaison la plus fréquente du rôle (texte courant de l'espace formateur, explication de la correction du quiz).

### 1.4 Décisions particulières

- **En-têtes compacts (décision 9)** : l'en-tête compact de Création de cours (20 px, sous 1024 px) et celui de la checklist (15 px) prennent le rôle **Titre de ligne** (15 px · 800 · 1,2). Fonction : rappeler sur une ligne tronquée le titre d'un contenu dont le titre complet est ailleurs. Titre de section (20 px) changerait aussi un seul élément (la checklist, +5 px) ; Titre de ligne garde intacte la checklist, qui est un écran apprenant mobile d'abord, et ne change que l'en-tête de Création (−5 px). Le seuil 1024 reste un seuil de mise en page : sous 1024 px l'en-tête compact (Titre de ligne), à partir de 1024 px l'en-tête desktop (Titre de page, 44 px, inchangé).
- **Repère d'étapes** : rattaché à Navigation (il était dans Méta dans l'audit) : ses libellés sont des liens entre les étapes du cours, et leur taille (14 px) est celle du rôle.
- **Italique (décision 7)** : vérifié sur l'API Google Fonts (`css2`) le 2026-11-04 : **Urbanist existe en italique, de 100 à 900**. Graisse à charger : **italique 500**. Le chargement n'est pas modifié ici.
- **Caractères hors typographie (décision 8)**, à remplacer par une icône SVG :

| Caractère | Où | Rendu actuel |
|---|---|---|
| × | bouton de fermeture de la modale Mes badges (`Dashboard.jsx:709`, `.modal-fermer`) | Arial 22,4 px (famille non déclarée sur un bouton) |
| ↑ ↓ | boutons Monter / Descendre de la remise en ordre (`EcranChecklist.jsx:81, 90`, `.fiche-etape-fleche`) | Arial 16 px (même raison) |
| ▲ ▼ | sens du tri des colonnes XP et Badges (`DetailGroupe.jsx:263`, `.dg-tri span`, desktop) | 10 px ; Urbanist ne contient pas ces caractères, le navigateur les prend dans une police de secours |

## 2. Échelle de tailles

13 tailles en px entiers. Chacune sert au moins un rôle.

| Taille | rem | Rôles |
|---|---|---|
| 13 px | 0,8125 rem | Méta, Surtitre, Pastille |
| 14 px | 0,875 rem | Texte secondaire, Navigation, Libellé de champ, Compteur |
| 15 px | 0,9375 rem | Titre de ligne, Corps courant, Lien texte |
| 16 px | 1 rem | Bouton, Saisie et choix |
| 17 px | 1,0625 rem | Titre de carte standard, Texte de lecture (mobile) |
| 18 px | 1,125 rem | Texte de lecture (desktop) |
| 20 px | 1,25 rem | Titre de section |
| 22 px | 1,375 rem | Titre de carte grand |
| 28 px | 1,75 rem | Titre de contenu (mobile), Chiffre mis en avant standard |
| 32 px | 2 rem | Titre de contenu (desktop) |
| 34 px | 2,125 rem | Titre de page (mobile) |
| 44 px | 2,75 rem | Titre de page (desktop) |
| 48 px | 3 rem | Chiffre mis en avant grand |

La version 1 se limitait à 12 tailles ; la version 2 en a 13, à cause des 18 px du Texte de lecture sur desktop (section 9). Les tailles fractionnaires de la prod rejoignent la taille de leur rôle. Trois rôles changent de taille à 768 px : Titre de page, Titre de contenu, Texte de lecture.

## 3. Impact

### 3.1 Totaux

- **192 éléments sur 275 changent** (version 1 : 210 sur 274), 83 restent identiques.
- Par propriété : 153 changent de taille, 95 de graisse, 35 de hauteur de ligne, 2 d'espacement des lettres. **27 ne changent que de graisse.**
- 32 changements viennent de valeurs qu'aucun choix ne pouvait garder : taille fractionnaire issue d'un rem, ou graisse 400 imposée par le navigateur.
- **17 éléments changent de 4 px ou plus** (version 1 : 23), voir 3.3.
- Où se concentrent les changements : Méta (35), Texte secondaire (23), Pastille (19), Corps courant (15), Saisie et choix (15, dont 8 contrôles à 400) et Titre de section (13). Dans ces rôles, la prod emploie trois ou quatre graisses pour une même fonction ; le critère de fusion ne joue pas, la dispersion est interne aux rôles candidats de l'audit.

| Rôle | Éléments | Changent | dont graisse seule |
|---|---|---|---|
| Titre de page | 9 | 4 | 0 |
| Titre de contenu | 6 | 4 | 0 |
| Titre de section | 16 | 13 | 0 |
| Titre de carte (standard) | 8 | 5 | 0 |
| Titre de carte (grand) | 9 | 6 | 0 |
| Titre de ligne | 17 | 10 | 0 |
| Texte de lecture | 2 | 1 | 0 |
| Corps courant | 17 | 15 | 0 |
| Texte secondaire | 27 | 23 | 3 |
| Méta | 45 | 35 | 11 |
| Surtitre | 12 | 3 | 0 |
| Bouton | 19 | 12 | 4 |
| Lien texte | 20 | 9 | 1 |
| Navigation | 8 | 6 | 1 |
| Libellé de champ | 4 | 3 | 1 |
| Saisie et choix | 18 | 15 | 5 |
| Pastille | 24 | 19 | 1 |
| Chiffre mis en avant (standard) | 5 | 3 | 0 |
| Chiffre mis en avant (grand) | 1 | 0 | 0 |
| Compteur | 8 | 6 | 0 |
| **Total** | **275** | **192** | **27** |

### 3.2 Détail par rôle

Seuls les éléments qui changent sont listés. Valeurs : taille (mobile / desktop si elles diffèrent) · graisse · hauteur de ligne. « n/a » : l'élément n'existe pas à cette largeur.


### Titre de page

9 éléments, 4 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Parcours : Création du compte | « Plus qu'une étape, [Prénom] » (`Parcours.css:192`) | 28 px · 800 · 1,1 | 34 / 44 px · 800 · 1,1 | taille | 16 px |
| Fin de quiz | titre « Belle maîtrise ! » (`FicheCours.css:809`) | 30 px · 800 · 1,1 | 34 / 44 px · 800 · 1,1 | taille | 14 px |
| Dashboard apprenant | « Salut [Prénom] » (H1) (`Dashboard.css:21`) | 34 / 44 px · 800 · 1 · lettres -0,5 / -0,8 px | 34 / 44 px · 800 · 1,1 · lettres normales | interligne, lettres | 0 |
| Dashboard formateur, admin | « Bonjour [prénom] » (H1) (`DashboardFormateur.css:30`) | 34 / 44 px · 800 · 1,2 | 34 / 44 px · 800 · 1,1 | interligne | 0 |

### Titre de contenu

6 éléments, 4 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Détail cours | titre du cours (H1) : perd contre .espace-page h1 (`DetailCoursFormateur.css:25`) | 34 / 44 px · 800 · 1,1 | 28 / 32 px · 800 · 1,1 | taille | 12 px |
| Fiche : quiz, Quiz flash | question (`FicheCours.css:432`) | 24 px · 800 · 1,15 | 28 / 32 px · 800 · 1,1 | taille, interligne | 8 px |
| Dashboard apprenant | « Quiz flash » du bloc de tête E (`Dashboard.css:440`) | 34 px · 800 · 1 · lettres -0,5 px | 28 / 32 px · 800 · 1,1 · lettres normales | taille, interligne, lettres | 6 px |
| Dashboard apprenant | titre du bloc de tête (cours en cours / assigné) (`Dashboard.css:360`) | 26 / 32 px · 800 · 1,05 / 1,1 | 28 / 32 px · 800 · 1,1 | taille, interligne | 2 px |

### Titre de section

16 éléments, 13 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Cours | titre de section (« Thèmes », « N résultats ») (`SectionCours.css:20`) | 22 / 28 px · 800 · 1,2 | 20 px · 800 · 1,2 | taille | 8 px |
| Dashboard formateur | titre « Taux de complétion » (`DashboardFormateur.css:220`) | 14,4 px · 500 · 1,2 | 20 px · 800 · 1,2 | taille, graisse | 5,6 px |
| Dashboard formateur : Pour bien démarrer | titre de la carte (`DashboardFormateur.css:657`) | 24 px · 800 · 1,2 | 20 px · 800 · 1,2 | taille | 4 px |
| Espace formateur, Création de cours | titre de modale (`Formateur.css:357`) | 24 px · 800 · 1,2 | 20 px · 800 · 1,2 | taille | 4 px |
| Fiche : leçon | intertitre H2 de la leçon (`FicheCours.css:266`) | 21 / 24 px · 800 · 1,2 | 20 px · 800 · 1,2 | taille | 4 px |
| Contenu Markdown | titre Markdown niveau 3 (`ContenuMarkdown.css:16`) | 16,8 px · 800 · 1,2 | 20 px · 800 · 1,2 | taille | 3,2 px |
| Pages avec navigation | h2 par défaut dans .espace-page (`espace-layout.css:163`) | 16,8 px · 800 · 1,2 | 20 px · 800 · 1,2 | taille | 3,2 px |
| Espace formateur (mobile) | titre de la feuille du menu « … » (`Formateur.css:285`) | 17 px · 800 · 1,2 | 20 px · 800 · 1,2 | taille | 3 px |
| Contenu Markdown | titre Markdown niveau 1 (`ContenuMarkdown.css:14`) | 22,4 px · 800 · 1,2 | 20 px · 800 · 1,2 | taille | 2,4 px |
| Création de cours | titre de carte de section (Infos, Leçon…) (`CreationCours.css:253`) | 22 px · 800 · 1,2 | 20 px · 800 · 1,2 | taille | 2 px |
| Dashboard formateur | titre « Activité récente » (`DashboardFormateur.css:463`) | 22 px · 800 · 1,2 | 20 px · 800 · 1,2 | taille | 2 px |
| Contenu Markdown | titre Markdown niveau 2 (hors leçon) (`ContenuMarkdown.css:15`) | 19,2 px · 800 · 1,2 | 20 px · 800 · 1,2 | taille | 0,8 px |
| Dashboard apprenant : modale Mes badges | titre « Mes badges » (`Dashboard.css:994`) | 20,8 px · 800 · 1,2 | 20 px · 800 · 1,2 | taille | 0,8 px |

### Titre de carte (standard)

8 éléments, 5 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Partagé (fiche) | titre du toast de complétion (`CompletionToast.css:30`) | 13,6 px · 800 · 1,2 | 17 px · 800 · 1,2 | taille | 3,4 px |
| Cours | titre de la carte de thème (`SectionCours.css:89`) | 15 / 18 px · 800 · 1,2 | 17 px · 800 · 1,2 | taille | 2 px |
| Dashboard apprenant | titre « Quiz flash » du bloc en ligne F (`Dashboard.css:477`) | 19 px · 800 · 1,2 | 17 px · 800 · 1,2 | taille | 2 px |
| Dashboard apprenant, Cours | titre du bloc « De ton formateur » (`BlocFormateur.css:21`) | 18 px · 800 · 1,2 | 17 px · 800 · 1,2 | taille | 1 px |
| Mes cours | titre de la carte de cours (`FormateurListes.css:60`) | 18 px · 800 · 1,2 | 17 px · 800 · 1,2 | taille | 1 px |

### Titre de carte (grand)

9 éléments, 6 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Dashboard apprenant (desktop, colonne étroite) | « Quiz flash » vertical (`Dashboard.css:941`) | n/a / 28 px · 800 · 1 | n/a / 22 px · 800 · 1,1 | taille, interligne | 6 px |
| Fiche : checklist | « X étapes sur N » (`FicheCours.css:1062`) | 20 px · 800 · 1,2 | 22 px · 800 · 1,1 | taille, interligne | 2 px |
| Fiche : quiz, Quiz flash | titre du bloc de correction (« Bien vu ») (`FicheCours.css:654`) | 20 px · 800 · 1,2 | 22 px · 800 · 1,1 | taille, interligne | 2 px |
| Mes groupes | nom de la carte de groupe (`FormateurListes.css:88`) | 20 / 22 px · 800 · 1,2 | 22 px · 800 · 1,1 | taille, interligne | 2 px |
| Parcours : Choix du profil | titre de la carte de profil (`Parcours.css:157`) | 20 px · 800 · 1,2 | 22 px · 800 · 1,1 | taille, interligne | 2 px |
| Dashboard apprenant | titre de carte blanche / lavande (`Dashboard.css:143`) | 22 px · 800 · 1,05 | 22 px · 800 · 1,1 | interligne | 0 |

### Titre de ligne

17 éléments, 10 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Création de cours | H1 de l'en-tête compact (affiché sous 1024 px) (`CreationCours.css:52`) | 20 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 5 px |
| Dashboard formateur | nom du groupe (`DashboardFormateur.css:298`) | 17 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 2 px |
| Dashboard formateur : Pour bien démarrer | titre d'étape (`DashboardFormateur.css:722`) | 17 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 2 px |
| Création de cours | « Question N » (h3) (`CreationCours.css:655`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 1 px |
| Dashboard formateur | « Personne à relancer » (`DashboardFormateur.css:440`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 1 px |
| Détail thème | titre de la ligne de cours (`DetailTheme.css:136`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 1 px |
| Fin de quiz : mes erreurs | question ratée (`FicheCours.css:953`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 1 px |
| Récap | titre de ligne (Leçon, Quiz, Checklist) (`FicheCours.css:1311`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 1 px |
| Terrain, recherche Cours | titre de la ligne de cours (`LigneCours.css:47`) | 15 / 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 1 px |
| Détail groupe | titre de la carte de cours assigné (`DetailGroupe.css:120`) | 15 px · 800 · 1,25 | 15 px · 800 · 1,2 | interligne | 0 |

### Texte de lecture

2 éléments, 1 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Détail cours | premier paragraphe de la leçon (`DetailCoursFormateur.css:212`) | 16 px · 500 · 1,55 | 17 / 18 px · 500 · 1,55 | taille | 2 px |

### Corps courant

17 éléments, 15 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Fiche : checklist | intitulé de l'étape en cours (`FicheCours.css:1205`) | 17 px · 800 · 1,2 | 15 px · 500 · 1,45 | taille, graisse, interligne | 2 px |
| Partagé (fiche) | texte du toast de complétion (`CompletionToast.css:15`) | 13,6 px · 500 · 1,2 | 15 px · 500 · 1,45 | taille, interligne | 1,4 px |
| Détail cours | bonne réponse (`DetailCoursFormateur.css:353`) | 14 px · 700 · 1,2 | 15 px · 500 · 1,45 | taille, graisse, interligne | 1 px |
| Fiche : checklist | intitulé d'étape (`FicheCours.css:1172`) | 16 px · 600 · 1,35 | 15 px · 500 · 1,45 | taille, graisse, interligne | 1 px |
| Fiche : leçon | points de l'encadré « À retenir » (`FicheCours.css:321`) | 16 px · 600 · 1,4 | 15 px · 500 · 1,45 | taille, graisse, interligne | 1 px |
| Fin de quiz : mes erreurs | ligne « Ta réponse / Bonne réponse » (`FicheCours.css:963`) | 14 px · 700 · 1,2 | 15 px · 500 · 1,45 | taille, graisse, interligne | 1 px |
| Fin de quiz : mes erreurs | explication (`FicheCours.css:977`) | 14 px · 500 · 1,2 | 15 px · 500 · 1,45 | taille, interligne | 1 px |
| Contenu Markdown | texte de tableau (`ContenuMarkdown.css:95`) | 15,2 px · 500 · 1,2 | 15 px · 500 · 1,45 | taille, interligne | 0,2 px |
| Dashboard admin (desktop) | cellules chiffrées du tableau (`DashboardFormateur.css:1064`) | n/a / 15 px · 700 · 1,2 | n/a / 15 px · 500 · 1,45 | graisse, interligne | 0 |
| Dashboard formateur | texte de relance (`DashboardFormateur.css:366`) | 15 px · 500 · 1,4 | 15 px · 500 · 1,45 | interligne | 0 |
| Dashboard formateur | texte de l'événement (`DashboardFormateur.css:602`) | 15 px · 500 · 1,4 | 15 px · 500 · 1,45 | interligne | 0 |
| Détail cours | points de l'encadré « À retenir » (`DetailCoursFormateur.css:294`) | 15 px · 600 · 1,2 | 15 px · 500 · 1,45 | graisse, interligne | 0 |
| Détail cours | intitulé d'étape de checklist (`DetailCoursFormateur.css:372`) | 15 px · 600 · 1,2 | 15 px · 500 · 1,45 | graisse, interligne | 0 |
| Détail groupe (desktop) | cellules du tableau des élèves (`DetailGroupe.css:350`) | n/a / 15 px · 600 · 1,2 | n/a / 15 px · 500 · 1,45 | graisse, interligne | 0 |
| Fiche : checklist (remise en ordre) | consigne de remise en ordre (`FicheCours.css:1081`) | 15 px · 500 · 1,2 | 15 px · 500 · 1,45 | interligne | 0 |

### Texte secondaire

27 éléments, 23 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Cours, Terrain | sous-titre de l'en-tête lavande (`EntetePage.css:35`) | 14 / 16 px · 700 · 1,2 | 14 px · 700 · 1,2 | taille | 2 px |
| Parcours | sous-titre sous le H1 (`GabaritParcours.css:215`) | 16 px · 500 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 2 px |
| Cours | « Aucun cours ne correspond… » (`SectionCours.css:28`) | 15 px · 500 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 1 px |
| Création de cours | aide sous un champ (`CreationCours.css:272`) | 13 px · 500 · 1,4 | 14 px · 700 · 1,2 | taille, graisse, interligne | 1 px |
| Dashboard apprenant | phrase d'état (« Leçon lue. Reste le quiz ») (`Dashboard.css:388`) | 14 / 15 px · 600 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 1 px |
| Dashboard apprenant (desktop, colonne étroite) | phrase du quiz flash vertical (`Dashboard.css:952`) | n/a / 15 px · 600 · 1,2 | n/a / 14 px · 700 · 1,2 | taille, graisse | 1 px |
| Dashboard formateur | note sous une carte (`DashboardFormateur.css:133`) | 13 px · 500 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 1 px |
| Dashboard formateur | confirmation d'envoi de relance (`DashboardFormateur.css:376`) | 13 px · 700 · 1,2 | 14 px · 700 · 1,2 | taille | 1 px |
| Dashboard formateur, admin | « 3 cours · 1 groupe · 12 élèves » (`DashboardFormateur.css:36`) | 15 px · 700 · 1,2 | 14 px · 700 · 1,2 | taille | 1 px |
| Dashboard formateur, admin | texte d'état vide (`DashboardFormateur.css:144`) | 15 px · 500 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 1 px |
| Espace formateur | sous-titre sous le H1 (« N élèves · N cours ») (`Formateur.css:37`) | 15 px · 600 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 1 px |
| Espace formateur | sous-titre de modale (`Formateur.css:363`) | 15 px · 500 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 1 px |
| Fin de quiz | sous-titre « Une seule erreur à revoir. » (`FicheCours.css:816`) | 15 px · 600 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 1 px |
| Parcours | aide sous un champ (mot de passe) (`Parcours.css:17`) | 13 px · 600 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 1 px |
| Parcours : Création du compte | texte du bloc lavande (`Parcours.css:199`) | 15 px · 600 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 1 px |
| Création de cours | message d'erreur (`CreationCours.css:279`) | 13,6 px · 700 · 1,4 | 14 px · 700 · 1,2 | taille, interligne | 0,4 px |
| Fiche : checklist (remise en ordre) | message de résultat de la remise en ordre (`quiz.css:85`) | 13,6 px · 500 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 0,4 px |
| Mot de passe oublié | phrase d'explication sous le H1 (`shared.css:119`) | 14,4 px · 500 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 0,4 px |
| Partagé | message d'erreur (.message) (`shared.css:358`) | 13,6 px · 500 · 1,4 | 14 px · 700 · 1,2 | taille, graisse, interligne | 0,4 px |
| Terrain, Détail thème, Détail groupe | texte d'état vide (`shared.css:512`) | 13,6 px · 500 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 0,4 px |
| Création de cours (< 1024) | titre du cours tronqué sous le H1 (`CreationCours.css:60`) | 14 px · 600 · 1,2 | 14 px · 700 · 1,2 | graisse | 0 |
| Dashboard apprenant | phrase du bloc de tête E (`Dashboard.css:449`) | 14 px · 600 · 1,2 | 14 px · 700 · 1,2 | graisse | 0 |
| Dashboard formateur | note 14 px (Pour bien démarrer) (`DashboardFormateur.css:139`) | 14 px · 500 · 1,2 | 14 px · 700 · 1,2 | graisse | 0 |

### Méta

45 éléments, 35 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Aperçu élève | texte du bandeau « Aperçu élève » (`FicheCours.css:104`) | 14 px · 700 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Cours | compteur « N cours » du bloc formateur (`BlocFormateur.css:44`) | 14 px · 700 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Cours | compte « y cours » de la carte de thème (`SectionCours.css:105`) | 13 / 14 px · 700 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Création de cours | nom d'image en étiquette (`CreationCours.css:519`) | 14 px · 700 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Dashboard admin | libellé de carte chiffrée (`DashboardFormateur.css:771`) | 14 px · 600 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Dashboard apprenant | méta du cours assigné (« thème · ajouté hier ») (`Dashboard.css:426`) | 14 px · 600 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Dashboard apprenant : modale Mes badges | « Obtenu le JJ/MM » (`Dashboard.css:1062`) | 12 px · 700 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Dashboard formateur | sous-titre « Sur l'ensemble de tes groupes » (`DashboardFormateur.css:225`) | 12 px · 500 · 1,2 | 13 px · 500 · 1,2 | taille | 1 px |
| Dashboard formateur | « N élèves · N cours » (`DashboardFormateur.css:304`) | 14 px · 600 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Dashboard formateur | « Tous tes élèves ont commencé… » (`DashboardFormateur.css:446`) | 14 px · 500 · 1,2 | 13 px · 500 · 1,2 | taille | 1 px |
| Dashboard formateur : Pour bien démarrer | « N étapes sur 3 » (`DashboardFormateur.css:663`) | 14 px · 700 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Dashboard formateur : Pour bien démarrer | sous-titre d'étape (`DashboardFormateur.css:727`) | 14 px · 500 · 1,2 | 13 px · 500 · 1,2 | taille | 1 px |
| Détail cours | légende de la barre d'avancement (`DetailCoursFormateur.css:96`) | 14 px · 600 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Détail groupe (mobile) | statut par cours dans la carte élève (`DetailGroupe.css:242`) | 14 px · 600 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Espace formateur | méta (« X terminés sur N »…) (`Formateur.css:73`) | 14 px · 600 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Fiche : checklist | « +15 XP à la fin » (`FicheCours.css:1067`) | 14 px · 700 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Fiche : checklist | critère de validation (`FicheCours.css:1221`) | 14 px · 500 · 1,2 | 13 px · 500 · 1,2 | taille | 1 px |
| Fiche : leçon, checklist | détail « N questions · +20 XP » (`FicheCours.css:358`) | 14 px · 500 · 1,2 | 13 px · 500 · 1,2 | taille | 1 px |
| Fiche : leçon, récap | « N min de lecture » / « X XP gagnés » (`FicheCours.css:234`) | 14 px · 700 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Fin de quiz | condition du badge (`FicheCours.css:892`) | 14 px · 500 · 1,2 | 13 px · 500 · 1,2 | taille | 1 px |
| Mes cours, Mes groupes | méta de carte (`FormateurListes.css:64`) | 14 px · 600 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Mes groupes | ligne « Cours terminés » (`FormateurListes.css:101`) | 14 px · 600 · 1,2 | 13 px · 500 · 1,2 | taille, graisse | 1 px |
| Parcours : Choix du profil | description de la carte de profil (`Parcours.css:162`) | 14 px · 500 · 1,35 | 13 px · 500 · 1,2 | taille, interligne | 1 px |
| Récap | contenu du cours suivant (`FicheCours.css:1352`) | 14 px · 500 · 1,2 | 13 px · 500 · 1,2 | taille | 1 px |
| Création de cours | méta « Réponse unique · 3 réponses » (`CreationCours.css:632`) | 13 px · 600 · 1,2 | 13 px · 500 · 1,2 | graisse | 0 |
| Création de cours (≥ 1024) | compteur du sommaire (`CreationCours.css:191`) | 13 px · 600 · 1,2 | 13 px · 500 · 1,2 | graisse | 0 |
| Dashboard admin (desktop) | en-têtes de colonne du tableau (`DashboardFormateur.css:1045`) | n/a / 13 px · 700 · 1,2 | n/a / 13 px · 500 · 1,2 | graisse | 0 |
| Dashboard admin (mobile) | résumé « 42 commencés · 18 terminés » (`DashboardFormateur.css:831`) | 13 px · 600 · 1,2 | 13 px · 500 · 1,2 | graisse | 0 |
| Dashboard apprenant | sous-texte (thème, condition du badge) (`Dashboard.css:149`) | 13 px · 600 · 1,2 | 13 px · 500 · 1,2 | graisse | 0 |
| Dashboard apprenant | consigne du quiz flash verrouillé (`Dashboard.css:552`) | 13 px · 600 · 1,2 | 13 px · 500 · 1,2 | graisse | 0 |
| Dashboard formateur | « Actif aujourd'hui » (`DashboardFormateur.css:311`) | 13 px · 700 · 1,2 | 13 px · 500 · 1,2 | graisse | 0 |
| Dashboard formateur | date « Il y a N jours » (`DashboardFormateur.css:370`) | 13 px · 700 · 1,2 | 13 px · 500 · 1,2 | graisse | 0 |
| Dashboard formateur | statut « Quiz 90 % / En cours » (`DashboardFormateur.css:640`) | 13 px · 600 · 1,2 | 13 px · 500 · 1,2 | graisse | 0 |
| Détail cours | libellé des petites cartes d'avancement (`DetailCoursFormateur.css:141`) | 13 px · 600 · 1,2 | 13 px · 500 · 1,2 | graisse | 0 |
| Détail groupe (desktop) | en-têtes de colonne du tableau des élèves (`DetailGroupe.css:338`) | n/a / 13 px · 800 · 1,2 | n/a / 13 px · 500 · 1,2 | graisse | 0 |

### Surtitre

12 éléments, 3 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Dashboard apprenant | libellé sur carte violette (« Tu en es là ») (`Dashboard.css:137`) | 13 / 15 px · 700 · 1,2 | 13 px · 700 · 1,2 | taille | 2 px |
| Cours | surtitre « Thème N » de la carte de thème (`SectionCours.css:82`) | 12 / 13 px · 700 · 1,2 | 13 px · 700 · 1,2 | taille | 1 px |
| Fiche : checklist | thème de l'en-tête compact (`FicheCours.css:1033`) | 12 px · 700 · 1,2 | 13 px · 700 · 1,2 | taille | 1 px |

### Bouton

19 éléments, 12 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Création de cours | bouton pointillé « + Ajouter… » (`shared.css:380`) | 13,6 px · 700 · 1,2 | 16 px · 800 · 1,2 | taille, graisse | 2,4 px |
| Création de cours | bouton d'outil « Image / Vidéo » (`CreationCours.css:438`) | 14 px · 700 · 1,2 | 16 px · 800 · 1,2 | taille, graisse | 2 px |
| Création de cours | bouton « Image » d'étape (`CreationCours.css:1038`) | 14 px · 700 · 1,2 | 16 px · 800 · 1,2 | taille, graisse | 2 px |
| Récap | libellé des boutons « Relire / Refaire / Revoir » (`FicheCours.css:1323`) | 14 px · 700 · 1,2 | 16 px · 800 · 1,2 | taille, graisse | 2 px |
| Dashboard apprenant | libellé du bouton « Commencer » (`Dashboard.css:410`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | taille | 1 px |
| Dashboard apprenant | libellé du bouton « Lancer » (`Dashboard.css:495`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | taille | 1 px |
| Dashboard formateur : Pour bien démarrer | libellé du bouton d'étape (`DashboardFormateur.css:740`) | 15 px · 700 · 1,2 | 16 px · 800 · 1,2 | taille, graisse | 1 px |
| Détail groupe | carte pointillée « + Assigner un cours » (`DetailGroupe.css:137`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | taille | 1 px |
| Dashboard apprenant | libellé du bouton orange (quiz flash) (`shared.css:255`) | 16 px · 700 · 1,2 | 16 px · 800 · 1,2 | graisse | 0 |
| Parcours | libellé du bouton du parcours (écrasé par .bouton-primaire / .bouton-secondaire) (`GabaritParcours.css:86`) | 16 px · 700 · 1,2 | 16 px · 800 · 1,2 | graisse | 0 |
| Partagé | libellé du bouton principal (`shared.css:200`) | 16 px · 700 · 1,2 | 16 px · 800 · 1,2 | graisse | 0 |
| Partagé | libellé du bouton secondaire (`shared.css:230`) | 16 px · 700 · 1,2 | 16 px · 800 · 1,2 | graisse | 0 |

### Lien texte

20 éléments, 9 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Mot de passe oublié | lien « ← Retour » (`shared.css:321`) | 13,6 px · 600 · 1,2 | 15 px · 800 · 1,2 | taille, graisse | 1,4 px |
| Mot de passe oublié | lien secondaire (simuler le lien) (`shared.css:343`) | 13,6 px · 600 · 1,2 | 15 px · 800 · 1,2 | taille, graisse | 1,4 px |
| Aperçu élève | bouton « Quitter l'aperçu » (`FicheCours.css:115`) | 14 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 1 px |
| Création de cours (≥ 1024) | bouton Retour « Mes cours » (`CreationCours.css:144`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 1 px |
| Dashboard apprenant, Cours | lien « Tout voir » / « Mes badges · X/6 » (`Dashboard.css:166`) | 14 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 1 px |
| Dashboard formateur, admin | lien « Tout voir » (`DashboardFormateur.css:112`) | 14 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 1 px |
| Modales, barre de Création de cours | lien d'action « Annuler » (`Formateur.css:397`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 1 px |
| Parcours : Introduction | lien « Passer » (`GabaritParcours.css:135`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | taille | 1 px |
| Parcours | lien sous le bouton (« Déjà un compte ? … ») (`GabaritParcours.css:106`) | 15 px · 700 · 1,2 | 15 px · 800 · 1,2 | graisse | 0 |

### Navigation

8 éléments, 6 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Navigation | libellé d'entrée de la tab bar (mobile) (`espace-layout.css:48`) | 11,52 / 14,4 px · 700 · 1,2 | 14 px · 700 · 1,2 | taille | 2,48 px |
| Espace formateur | action du menu « … » (`Formateur.css:297`) | 16 px · 700 · 1,2 | 14 px · 700 · 1,2 | taille | 2 px |
| Création de cours (< 1024) | pastille de section collante (`CreationCours.css:94`) | 15 px · 700 · 1,2 | 14 px · 700 · 1,2 | taille | 1 px |
| Création de cours (≥ 1024) | entrée du sommaire (`CreationCours.css:181`) | 15 px · 700 · 1,2 | 14 px · 700 · 1,2 | taille | 1 px |
| Navigation | entrée du menu (Se déconnecter) (`espace-layout.css:123`) | 14,4 px · 600 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 0,4 px |
| Fiche : leçon, checklist | libellé d'étape (Leçon, Quiz · 4/5…) (`ReperEtapes.css:67`) | 14 px · 600 · 1,2 | 14 px · 700 · 1,2 | graisse | 0 |

### Libellé de champ

4 éléments, 3 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Création de cours | libellé de champ (`CreationCours.css:266`) | 14,4 px · 500 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 0,4 px |
| Partagé (modales, Détail groupe, Mes cours, mot de passe) | libellé de champ (.champ) (`shared.css:126`) | 14,4 px · 500 · 1,2 | 14 px · 700 · 1,2 | taille, graisse | 0,4 px |
| Parcours | libellé de champ (`GabaritParcours.css:228`) | 14 px · 800 · 1,2 | 14 px · 700 · 1,2 | graisse | 0 |

### Saisie et choix

18 éléments, 15 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Parcours : questions | saisie du grand champ (prénom, organisme…) (`GabaritParcours.css:269`) | 20 px · 700 · 1,2 | 16 px · 600 · 1,2 | taille, graisse | 4 px |
| Création de cours | saisie d'explication (`CreationCours.css:776`) | 14 px · 400 · 1,2 | 16 px · 600 · 1,2 | taille, graisse | 2 px |
| Dashboard formateur | saisie « Un élève » (`DashboardFormateur.css:531`) | 14 px · 400 · 1,2 | 16 px · 600 · 1,2 | taille, graisse | 2 px |
| Création de cours | bouton de choix (groupe, mode de checklist) (`CreationCours.css:327`) | 15 px · 700 · 1,2 | 16 px · 600 · 1,2 | taille, graisse | 1 px |
| Création de cours | saisie de réponse / d'explication (`CreationCours.css:767`) | 15 px · 400 · 1,2 | 16 px · 600 · 1,2 | taille, graisse | 1 px |
| Création de cours | libellé de mode de checklist (`CreationCours.css:895`) | 15 px · 800 · 1,2 | 16 px · 600 · 1,2 | taille, graisse | 1 px |
| Création de cours | saisie de l'intitulé d'étape (`CreationCours.css:961`) | 15 px · 600 · 1,2 | 16 px · 600 · 1,2 | taille | 1 px |
| Parcours : questions | ligne de choix (statut, âge, motivation) (`GabaritParcours.css:296`) | 17 px · 600 · 1,2 | 16 px · 600 · 1,2 | taille | 1 px |
| Création de cours, Mes cours | option de la liste déroulante (`Dropdown.css:61`) | 15,2 px · 500 · 1,2 | 16 px · 600 · 1,2 | taille, graisse | 0,8 px |
| Cours | saisie de la recherche (`EntetePage.css:48`) | 16 px · 400 · 1,2 | 16 px · 600 · 1,2 | graisse | 0 |
| Création de cours | saisie de l'éditeur de leçon (`CreationCours.css:458`) | 16 px · 400 · 1,55 | 16 px · 600 · 1,2 | graisse, interligne | 0 |
| Création de cours, Mes cours | valeur affichée de la liste déroulante (`Dropdown.css:12`) | 16 px · 400 · 1,2 | 16 px · 600 · 1,2 | graisse | 0 |
| Modale d'assignation, Création de cours | libellé de case à cocher (`Formateur.css:527`) | 16 px · 700 · 1,2 | 16 px · 600 · 1,2 | graisse | 0 |
| Partagé | saisie de champ input (.champ) (`shared.css:136`) | 16 px · 400 · 1,2 | 16 px · 600 · 1,2 | graisse | 0 |
| Partagé | saisie de champ textarea (.champ) (`shared.css:148`) | 16 px · 400 · 1,2 | 16 px · 600 · 1,2 | graisse | 0 |

### Pastille

24 éléments, 19 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Dashboard formateur : Pour bien démarrer | numéro dans le rond (`DashboardFormateur.css:695`) | 16 px · 800 · 1,2 | 13 px · 800 · 1,2 | taille | 3 px |
| Détail cours | « +N » sur la dernière miniature (`DetailCoursFormateur.css:246`) | 16 px · 800 · 1,2 | 13 px · 800 · 1,2 | taille | 3 px |
| Fin de quiz | pastille « +20 XP » (`FicheCours.css:830`) | 16 px · 800 · 1,2 | 13 px · 800 · 1,2 | taille | 3 px |
| Création de cours | lettre de réponse (`CreationCours.css:751`) | 15 px · 800 · 1,2 | 13 px · 800 · 1,2 | taille | 2 px |
| Création de cours | pastille « Compte officiel : ce cours sera public » (`CreationCours.css:236`) | 14 px · 700 · 1,2 | 13 px · 800 · 1,2 | taille, graisse | 1 px |
| Création de cours | numéro de question / d'étape (`CreationCours.css:575`) | 14 px · 800 · 1,2 | 13 px · 800 · 1,2 | taille | 1 px |
| Création de cours | pilule « Bloquante » (`CreationCours.css:1013`) | 14 px · 700 · 1,2 | 13 px · 800 · 1,2 | taille, graisse | 1 px |
| Dashboard apprenant | pastille « De ton formateur » (`Dashboard.css:191`) | 12 px · 800 · 1,2 | 13 px · 800 · 1,2 | taille | 1 px |
| Dashboard apprenant | pastille orange « Défi du jour » (`Dashboard.css:206`) | 12 px · 800 · 1,2 | 13 px · 800 · 1,2 | taille | 1 px |
| Dashboard formateur | pastille « À surveiller / Bon rythme » (`DashboardFormateur.css:236`) | 12 px · 700 · 1,2 | 13 px · 800 · 1,2 | taille, graisse | 1 px |
| Dashboard formateur | initiales sur rond lavande (`DashboardFormateur.css:596`) | 14 px · 800 · 1,2 | 13 px · 800 · 1,2 | taille | 1 px |
| Dashboard formateur | pastille du groupe (`DashboardFormateur.css:626`) | 12 px · 700 · 1,2 | 13 px · 800 · 1,2 | taille, graisse | 1 px |
| Fiche : checklist | pastille « Bloquante » (`FicheCours.css:1215`) | 12 px · 800 · 1,2 | 13 px · 800 · 1,2 | taille | 1 px |
| Fiche : quiz, Quiz flash | pastille « Ta réponse » / « Bonne réponse » (`FicheCours.css:606`) | 12 px · 800 · 1,2 | 13 px · 800 · 1,2 | taille | 1 px |
| Fin de quiz | pastille « Nouveau badge » (`FicheCours.css:881`) | 12 px · 800 · 1,2 | 13 px · 800 · 1,2 | taille | 1 px |
| Partagé (Cours, Dashboard, Détail groupe…) | pastille de statut (Nouveau, À faire, Non commencé) (`espace-layout.css:252`) | 12 px · 700 · 1,2 | 13 px · 800 · 1,2 | taille, graisse | 1 px |
| Récap | « X XP gagnés » (pastille Terminé) (`FicheCours.css:1276`) | 14 px · 800 · 1,2 | 13 px · 800 · 1,2 | taille | 1 px |
| Partagé (fiche) | nom du badge dans le toast (`CompletionToast.css:48`) | 12,8 px · 700 · 1,2 | 13 px · 800 · 1,2 | taille, graisse | 0,2 px |
| Espace formateur | pastille de groupe / « Non assigné » (`Formateur.css:178`) | 13 px · 700 · 1,2 | 13 px · 800 · 1,2 | graisse | 0 |

### Chiffre mis en avant (standard)

5 éléments, 3 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Dashboard apprenant | « [N] XP » de l'en-tête (`Dashboard.css:30`) | 17 / 20 px · 800 · 1,2 | 28 px · 800 · 1 | taille, interligne | 11 px |
| Dashboard apprenant | pourcentage dans l'anneau (`Dashboard.css:382`) | 17 / 26 px · 800 · 1,2 | 28 px · 800 · 1 | taille, interligne | 11 px |
| Dashboard admin | chiffre de carte (`DashboardFormateur.css:777`) | 36 px · 800 · 1,1 | 28 px · 800 · 1 | taille, interligne | 8 px |

### Chiffre mis en avant (grand)

1 éléments, 0 changent.


### Compteur

8 éléments, 6 changent.

| Écran | Élément | Rendu actuel | Proposé | Change | Écart de taille |
|---|---|---|---|---|---|
| Parcours : questions | compteur « 2 / 5 » (`GabaritParcours.css:195`) | 18 px · 800 · 1,2 | 14 px · 800 · 1,2 | taille | 4 px |
| Dashboard apprenant | compteur de barre, petite variante (`Dashboard.css:323`) | 12 px · 800 · 1,2 | 14 px · 800 · 1,2 | taille | 2 px |
| Dashboard apprenant : modale Mes badges | compteur « X/6 » (`Dashboard.css:1001`) | 15 px · 800 · 1,2 | 14 px · 800 · 1,2 | taille | 1 px |
| Fiche : quiz, Quiz flash | compteur « 3 / 5 » (`FicheCours.css:413`) | 15 px · 800 · 1,2 | 14 px · 800 · 1,2 | taille | 1 px |
| Fin de quiz | « 80 % » sous le score (`FicheCours.css:801`) | 15 px · 700 · 1,2 | 14 px · 800 · 1,2 | taille, graisse | 1 px |
| Partagé (fiche) | « +15 XP » du toast (`CompletionToast.css:39`) | 13,6 px · 700 · 1,2 | 14 px · 800 · 1,2 | taille, graisse | 0,4 px |

### 3.3 Écarts de 4 px ou plus

| Écart | Rôle | Écran | Élément | Rendu actuel | Proposé |
|---|---|---|---|---|---|
| 16 px | Titre de page | Parcours : Création du compte | « Plus qu'une étape, [Prénom] » | 28 px · 800 · 1,1 | 34 / 44 px · 800 · 1,1 |
| 14 px | Titre de page | Fin de quiz | titre « Belle maîtrise ! » | 30 px · 800 · 1,1 | 34 / 44 px · 800 · 1,1 |
| 12 px | Titre de contenu | Détail cours | titre du cours (H1) : perd contre .espace-page h1 | 34 / 44 px · 800 · 1,1 | 28 / 32 px · 800 · 1,1 |
| 11 px | Chiffre mis en avant (standard) | Dashboard apprenant | « [N] XP » de l'en-tête | 17 / 20 px · 800 · 1,2 | 28 px · 800 · 1 |
| 11 px | Chiffre mis en avant (standard) | Dashboard apprenant | pourcentage dans l'anneau | 17 / 26 px · 800 · 1,2 | 28 px · 800 · 1 |
| 8 px | Titre de contenu | Fiche : quiz, Quiz flash | question | 24 px · 800 · 1,15 | 28 / 32 px · 800 · 1,1 |
| 8 px | Chiffre mis en avant (standard) | Dashboard admin | chiffre de carte | 36 px · 800 · 1,1 | 28 px · 800 · 1 |
| 8 px | Titre de section | Cours | titre de section (« Thèmes », « N résultats ») | 22 / 28 px · 800 · 1,2 | 20 px · 800 · 1,2 |
| 6 px | Titre de contenu | Dashboard apprenant | « Quiz flash » du bloc de tête E | 34 px · 800 · 1 · lettres -0,5 px | 28 / 32 px · 800 · 1,1 · lettres normales |
| 6 px | Titre de carte (grand) | Dashboard apprenant (desktop, colonne étroite) | « Quiz flash » vertical | n/a / 28 px · 800 · 1 | n/a / 22 px · 800 · 1,1 |
| 5,6 px | Titre de section | Dashboard formateur | titre « Taux de complétion » | 14,4 px · 500 · 1,2 | 20 px · 800 · 1,2 |
| 5 px | Titre de ligne | Création de cours | H1 de l'en-tête compact (affiché sous 1024 px) | 20 px · 800 · 1,2 | 15 px · 800 · 1,2 |
| 4 px | Compteur | Parcours : questions | compteur « 2 / 5 » | 18 px · 800 · 1,2 | 14 px · 800 · 1,2 |
| 4 px | Saisie et choix | Parcours : questions | saisie du grand champ (prénom, organisme…) | 20 px · 700 · 1,2 | 16 px · 600 · 1,2 |
| 4 px | Titre de section | Espace formateur, Création de cours | titre de modale | 24 px · 800 · 1,2 | 20 px · 800 · 1,2 |
| 4 px | Titre de section | Fiche : leçon | intertitre H2 de la leçon | 21 / 24 px · 800 · 1,2 | 20 px · 800 · 1,2 |
| 4 px | Titre de section | Dashboard formateur : Pour bien démarrer | titre de la carte | 24 px · 800 · 1,2 | 20 px · 800 · 1,2 |

## 4. Variantes d'état

Règle : un état (choisi, en cours, fait, coché) peut monter la graisse **d'un cran** au-dessus de celle du rôle, jamais la taille.

| État | Élément (écran) | Rôle (graisse de base) | Prod | Proposé |
|---|---|---|---|---|
| choisie | ligne de choix (Parcours, questions) | Saisie et choix (600) | 700 | 700 |
| choisie, au survol | ligne de choix (Parcours, questions) | Saisie et choix (600) | 700 | 700 |
| choisie | option de la liste déroulante (Création de cours, Mes cours) | Saisie et choix (600) | 600 | 700 |
| en cours | libellé du repère d'étapes (Fiche) | Navigation (700) | 800 | 800 |
| faite | libellé du repère d'étapes (Fiche) | Navigation (700) | 700 | 800 |
| à venir (état de base) | libellé du repère d'étapes (Fiche) | Navigation (700) | 600 | 700 |
| cochée | libellé « Bonne réponse » (Création de cours) | Libellé de champ (700) | 800 | 800 |
| commencé | compte « x / y cours » de la carte de thème (Cours) | Méta (500) | 800 | 600 |
| en cours | intitulé de l'étape en cours (Checklist) | Corps courant (500, 15 px) | 17 px 800 | 15 px 600 |

Les autres états de la prod (onglet actif, filtre actif, entrée de navigation active, étape faite de la checklist) ne changent que la couleur ou le fond.

Cas que la règle ne couvre pas, à trancher (section 9) :

- graisse **plus légère** dans un état ou une partie : compteur dans la pastille de section de Création (600 dans une pastille à 700), « Aucune modification » de la barre d'enregistrement (600 contre 700 pour le message) ;
- **emphase** dans une phrase (ce n'est pas un état) : `strong` du lien du parcours (800 dans un lien à 800, invisible), du fil d'activité (800 dans un texte à 500), de la ligne « Cours terminés » de Mes groupes (800 dans une Méta à 500), de la phrase de relance et du gras Markdown (graisse calculée par le navigateur, 700 ou 900).

## 5. Les cas « À trancher » de l'audit (section 3.3)

Les 20 lignes du tableau de l'audit, avec les rôles de la version 2.

| Élément | Rattaché à | Raison |
|---|---|---|
| Titre de fin de quiz « Belle maîtrise ! » | Titre de page | Seul titre d'un écran complet, il annonce le résultat ; le bloc du score n'est pas une carte parmi d'autres. |
| « Plus qu'une étape, [Prénom] » (Création du compte) | Titre de page | Il tient la place du titre d'étape des autres écrans du parcours. |
| Question du quiz | Titre de contenu | C'est l'objet que l'écran présente, comme le titre du cours sur la leçon. |
| Titre du cours dans l'en-tête compact (Checklist) | Titre de ligne | Rappel du cours dans une barre compacte ; même rôle que l'en-tête compact de Création (1.4). |
| Titre du bloc de tête (Dashboard apprenant) | Titre de contenu | Il nomme un cours, comme le titre de la fiche. |
| « Quiz flash » du bloc de tête E | Titre de contenu | Même place et même fonction que le titre des autres blocs de tête. |
| Titres de carte de l'espace formateur | Titre de section | Dans l'espace formateur, chaque carte blanche est une section de la page. |
| « Taux de complétion » | Titre de section | Il titre sa carte comme « Tes groupes », sa voisine. |
| Intertitre de jour « Aujourd'hui » | Surtitre | Libellé court posé au-dessus des lignes qu'il regroupe ; même valeur en prod (13 px 700). |
| Nom de la carte de thème | Titre de carte, standard | Carte cliquable autonome dans une grille, pas une ligne de liste. |
| « X étapes sur N » (Checklist) | Titre de carte, grand | Phrase qui titre la carte de progression (niveau : 1.2). |
| Intitulé de l'étape en cours (Checklist) | Corps courant, état « en cours » | Même texte que les autres intitulés ; la mise en avant devient une variante d'état (section 4). |
| Ligne de choix du parcours, réponse du quiz, bouton de choix de Création | Saisie et choix | Le texte est la réponse choisie par l'utilisateur. |
| Pastilles de filtre « Tout / Commencés / Terminés » | Navigation | Ce sont des filtres, que l'instruction range dans Navigation. |
| Carte pointillée « + Assigner un cours » | Bouton | C'est une forme de bouton (carte pointillée cliquable), comme les boutons pointillés d'ajout. |
| Texte d'un événement (Activité récente) | Corps courant | C'est une phrase ; le gras est une emphase (section 4). |
| Libellé de case dans la modale d'assignation | Saisie et choix | C'est l'option que l'utilisateur coche, comme une ligne de choix. |
| « N min de lecture » (Leçon) | Méta | Information courte et factuelle sur le contenu. |
| Notes sous les cartes du dashboard formateur | Texte secondaire | Phrase qui commente la carte. |
| Texte d'état vide | Texte secondaire | Phrase qui remplace un contenu absent. |

Les 20 cas sont rattachés.

## 6. Les valeurs écrasées de l'audit (section 5.3)

| Élément | Écrit | Rendu en prod | Proposé | La proposition suit… |
|---|---|---|---|---|
| Boutons du parcours | 17 px 800 | 16 px 700 | 16 px 800 (Bouton) | **la taille rendue et la graisse écrite** : c'est la valeur du rôle Bouton, la plus fréquente parmi les boutons. Seule la graisse change depuis le rendu (+1 cran). |
| Titre du cours (Détail cours) | 28 / 32 px | 34 / 44 px | 28 / 32 px (Titre de contenu) | **la valeur écrite** : c'est un titre de cours, comme sur la fiche ; 34 / 44 px venait d'un conflit de sélecteurs. Impact depuis le rendu : −6 px mobile, −12 px desktop. |
| « À retenir » dans l'aperçu de Création de cours | 17 px | 22 px | 17 px (Titre de carte, standard) | **la valeur écrite** : l'aperçu doit montrer la fiche telle que l'élève la verra. |

## 7. Écarts avec CLAUDE.md

CLAUDE.md n'est pas modifié. Tailles qu'il décrit et qui différeraient de la proposition (les tailles qu'il décrit et que la proposition garde ne sont pas listées) :

| CLAUDE.md dit | Élément | Valeur dans CLAUDE.md | Proposé |
|---|---|---|---|
| Dashboard apprenant, bloc de tête : « Titre 26 px mobile / 32 px desktop » | titre du bloc de tête (cours en cours / assigné) (`Dashboard.css:360`) | 26 / 32 px | 28 / 32 px |
| Dashboard apprenant, bloc E : « Quiz flash » 34 px | « Quiz flash » du bloc de tête E (`Dashboard.css:440`) | 34 px | 28 / 32 px |
| Dashboard apprenant, bloc F en colonne étroite : « titre 28 px » | « Quiz flash » vertical (`Dashboard.css:941`) | 28 px | n/a / 22 px |
| En-tête lavande partagé : sous-titre « 14 px 700 (16 px desktop) » | sous-titre de l'en-tête lavande (`EntetePage.css:35`) | 14 / 16 px | 14 px |
| Cours : « N résultats » et « Thèmes » « h2 22 px, 28 desktop » | titre de section (« Thèmes », « N résultats ») (`SectionCours.css:20`) | 22 / 28 px | 20 px |
| Cours : « Aucun cours ne correspond… » « 15 px » | « Aucun cours ne correspond… » (`SectionCours.css:28`) | 15 px | 14 px |
| Cours, carte de thème : « Thème N » « 12 px (13) » | surtitre « Thème N » de la carte de thème (`SectionCours.css:82`) | 12 / 13 px | 13 px |
| Cours, carte de thème : nom « 15 px (18) graisse 800 » | titre de la carte de thème (`SectionCours.css:89`) | 15 / 18 px | 17 px |
| Détail thème : titre de ligne « 16 px 800 » | titre de la ligne de cours (`DetailTheme.css:136`) | 16 px | 15 px |
| Mode terrain : titre de ligne « 15 px (16) 800 » | titre de la ligne de cours (`LigneCours.css:47`) | 15 / 16 px | 15 px |
| Dashboard formateur : sous-titre « 15 px gras » | « 3 cours · 1 groupe · 12 élèves » (`DashboardFormateur.css:36`) | 15 px | 14 px |
| Pour bien démarrer : titre « 24 px » | titre de la carte (`DashboardFormateur.css:657`) | 24 px | 20 px |
| Pour bien démarrer : titre d'étape « 17 px » | titre d'étape (`DashboardFormateur.css:722`) | 17 px | 15 px |
| Pour bien démarrer : sous-titre d'étape « 14 px » | sous-titre d'étape (`DashboardFormateur.css:727`) | 14 px | 13 px |
| Tes groupes : nom « 17 px » | nom du groupe (`DashboardFormateur.css:298`) | 17 px | 15 px |
| Activité récente : titre « 22 px » | titre « Activité récente » (`DashboardFormateur.css:463`) | 22 px | 20 px |
| Activité récente : pastille du groupe « 12 px » | pastille du groupe (`DashboardFormateur.css:626`) | 12 px | 13 px |
| Dashboard admin : libellé « 14 px » | libellé de carte chiffrée (`DashboardFormateur.css:771`) | 14 px | 13 px |
| Dashboard admin : chiffre « 36 px » | chiffre de carte (`DashboardFormateur.css:777`) | 36 px | 28 px |
| Mes cours : titre de carte « 18 px » | titre de la carte de cours (`FormateurListes.css:60`) | 18 px | 17 px |
| Leçon : « H2 21 / 24 px » | intertitre H2 de la leçon (`FicheCours.css:266`) | 21 / 24 px | 20 px |
| Leçon, « À retenir » : « puces 16 px 600 » | points de l'encadré « À retenir » (`FicheCours.css:321`) | 16 px 600 | 15 px 500 |
| Quiz : « question 24 px 800 » | question (`FicheCours.css:432`) | 24 px | 28 / 32 px |
| Fin de quiz, carte badge : « condition 14 px » | condition du badge (`FicheCours.css:892`) | 14 px | 13 px |
| Checklist : « thème 12 px » | thème de l'en-tête compact (`FicheCours.css:1033`) | 12 px | 13 px |
| Checklist : « « X étapes sur N » 20 px » | « X étapes sur N » (`FicheCours.css:1062`) | 20 px | 22 px |
| Checklist : étape en cours « intitulé 17 px 800 » | intitulé de l'étape en cours (`FicheCours.css:1205`) | 17 px 800 | 15 px 600 (état « en cours » du Corps courant) |
| Checklist : « critère de validation 14 px » | critère de validation (`FicheCours.css:1221`) | 14 px | 13 px |
| Parcours : compteur « « 2 / 5 » 18 px 800 » | compteur « 2 / 5 » (`GabaritParcours.css:195`) | 18 px | 14 px |
| Parcours : « sous-titre 16 px secondaire » | sous-titre sous le H1 (`GabaritParcours.css:215`) | 16 px | 14 px |
| Création de cours (< 1024 px) : « titre 20 px » | H1 de l'en-tête compact (affiché sous 1024 px) (`CreationCours.css:52`) | 20 px | 15 px |

## 8. Ce qui reste identique à la version 1

Titre de page, Titre de contenu, Titre de section, Titre de ligne, Méta et Saisie et choix gardent leurs valeurs ; Corps courant reprend la valeur du Corps de texte de la version 1. Les rattachements des cas « À trancher » de l'audit sont les mêmes, sauf ceux que les nouveaux rôles déplacent (intertitre de jour → Surtitre, filtres → Navigation, carte « + Assigner un cours » → Bouton, « X étapes sur N » → Titre de carte grand).

## 9. À trancher

- **Lecture du critère de fusion.** Si « 1 px ou un cran » exclut les deux à la fois, Sous-titre (15 px · 600) et Aide (14 px · 700) ne fusionnent pas et le compte passe à 19 rôles, au-dessus du plafond de 18. Il faudrait alors une autre fusion ou relever le plafond.
- **Treize tailles.** La version 1 plafonnait l'échelle à 12. Les 18 px viennent du Texte de lecture sur desktop. Lecture 1 : garder 18 px pour la leçon (valeur actuelle). Lecture 2 : texte de lecture à 17 px partout, échelle à 12 tailles, la leçon perd 1 px sur desktop.
- **États plus légers et emphase** (section 4) : la règle ne permet que de monter. Lecture 1 : supprimer les parties plus légères et aligner l'emphase sur la règle des états (un cran). Lecture 2 : une règle d'emphase à part.
- **XP et pourcentage de l'anneau du dashboard apprenant** (17 px aujourd'hui, 28 px proposé, +11 px). Lecture 1 : Chiffre mis en avant standard (audit). Lecture 2 : Compteur (14 px), plus proche du rendu actuel sur mobile, mais −12 px sur desktop pour le pourcentage (26 → 14 px).
- **Titres de page à fort écart** : « Plus qu'une étape, [Prénom] » (+16 px) et « Belle maîtrise ! » (+14 px) passent à 34 / 44 px. Le rattachement au Titre de page suit la fonction ; le grand niveau de Titre de carte (22 px) serait plus proche du rendu.
- **Taux de complétion sous 400 px** : 20,8 px aujourd'hui sur un téléphone de 390 px, 28 px proposé (seuil unique 768). À vérifier dans sa carte.
- **Méta, Texte secondaire, Pastille** : rôles où la prod emploie trois ou quatre graisses ; la valeur retenue en change la majorité (35 sur 45, 23 sur 27, 19 sur 24). Les séparer davantage dépasserait 18 rôles.

## Annexe. Éléments par rôle

✓ = élément inchangé.


**Titre de page** (9) : H1 de page dans .espace-page (Pages avec navigation, `espace-layout.css:150`) ✓ ; H1 de la carte de flux (Mot de passe oublié / Nouveau mot de passe / Compléter le profil, `shared.css:108`) ✓ ; H1 du parcours (Parcours, `GabaritParcours.css:208`) ✓ ; H1 de page formateur (Espace formateur (Mes cours, Mes groupes, Détail groupe, Détail cours), `Formateur.css:30`) ✓ ; titre « Belle maîtrise ! » (Fin de quiz, `FicheCours.css:809`) ; « Salut [Prénom] » (H1) (Dashboard apprenant, `Dashboard.css:21`) ; « Bonjour [prénom] » (H1) (Dashboard formateur, admin, `DashboardFormateur.css:30`) ; « Plus qu'une étape, [Prénom] » (Parcours : Création du compte, `Parcours.css:192`) ; H1 de l'en-tête desktop (affiché à partir de 1024 px) (Création de cours, `CreationCours.css:1376`) ✓.

**Titre de contenu** (6) : nom du thème (H1) (Détail thème, `DetailTheme.css:75`) ✓ ; titre du cours (H1) : perd contre .espace-page h1 (Détail cours, `DetailCoursFormateur.css:25`) ; titre du cours (H1) (Fiche : leçon, récap, `FicheCours.css:222`) ✓ ; question (Fiche : quiz, Quiz flash, `FicheCours.css:432`) ; titre du bloc de tête (cours en cours / assigné) (Dashboard apprenant, `Dashboard.css:360`) ; « Quiz flash » du bloc de tête E (Dashboard apprenant, `Dashboard.css:440`).

**Titre de section** (16) : h2 par défaut dans .espace-page (Pages avec navigation, `espace-layout.css:163`) ; titre Markdown niveau 1 (Contenu Markdown, `ContenuMarkdown.css:14`) ; titre Markdown niveau 2 (hors leçon) (Contenu Markdown, `ContenuMarkdown.css:15`) ; titre Markdown niveau 3 (Contenu Markdown, `ContenuMarkdown.css:16`) ; titre de carte de section (h2) (Espace formateur, `Formateur.css:54`) ✓ ; titre de la feuille du menu « … » (Espace formateur (mobile), `Formateur.css:285`) ; titre de modale (Espace formateur, Création de cours, `Formateur.css:357`) ; intertitre H2 de la leçon (Fiche : leçon, `FicheCours.css:266`) ; titre « Mes badges » (Dashboard apprenant : modale Mes badges, `Dashboard.css:994`) ; titre de carte (« Tes groupes »…) (Dashboard formateur, admin, `DashboardFormateur.css:102`) ✓ ; titre « Taux de complétion » (Dashboard formateur, `DashboardFormateur.css:220`) ; titre « Activité récente » (Dashboard formateur, `DashboardFormateur.css:463`) ; titre de la carte (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:657`) ; titre « Cours assignés » (Détail groupe, `DetailGroupe.css:78`) ✓ ; titre de carte de section (Infos, Leçon…) (Création de cours, `CreationCours.css:253`) ; titre de section (« Thèmes », « N résultats ») (Cours, `SectionCours.css:20`).

**Titre de carte (standard)** (8) : titre du toast de complétion (Partagé (fiche), `CompletionToast.css:30`) ; titre du bloc « De ton formateur » (Dashboard apprenant, Cours, `BlocFormateur.css:21`) ; titre de l'encadré « À retenir » (Détail cours, `DetailCoursFormateur.css:268`) ✓ ; titre de l'encadré « À retenir » (Fiche : leçon (et aperçu Création, où il est écrasé), `FicheCours.css:294`) ✓ ; titre « Quiz flash » du bloc en ligne F (Dashboard apprenant, `Dashboard.css:477`) ; titre « Quiz flash » verrouillé (Dashboard apprenant, `Dashboard.css:547`) ✓ ; titre de la carte de thème (Cours, `SectionCours.css:89`) ; titre de la carte de cours (Mes cours, `FormateurListes.css:60`).

**Titre de carte (grand)** (9) : titre de la carte « Étape suivante » (Fiche : leçon, checklist, `FicheCours.css:351`) ✓ ; titre du bloc de correction (« Bien vu ») (Fiche : quiz, Quiz flash, `FicheCours.css:654`) ; nom du badge débloqué (Fin de quiz, `FicheCours.css:886`) ✓ ; « X étapes sur N » (Fiche : checklist, `FicheCours.css:1062`) ; titre du cours suivant (Récap, `FicheCours.css:1346`) ✓ ; titre de carte blanche / lavande (Dashboard apprenant, `Dashboard.css:143`) ; nom de la carte de groupe (Mes groupes, `FormateurListes.css:88`) ; titre de la carte de profil (Parcours : Choix du profil, `Parcours.css:157`) ; « Quiz flash » vertical (Dashboard apprenant (desktop, colonne étroite), `Dashboard.css:941`).

**Titre de ligne** (17) : titre de la ligne de cours (Terrain, recherche Cours, `LigneCours.css:47`) ; titre de cours de la ligne du bloc formateur (Dashboard apprenant, Cours, `BlocFormateur.css:93`) ✓ ; titre de la ligne de cours (Détail thème, `DetailTheme.css:136`) ; énoncé de question (Détail cours, `DetailCoursFormateur.css:340`) ✓ ; question ratée (Fin de quiz : mes erreurs, `FicheCours.css:953`) ; titre du cours de l'en-tête compact (H1) (Fiche : checklist, `FicheCours.css:1041`) ✓ ; titre de ligne (Leçon, Quiz, Checklist) (Récap, `FicheCours.css:1311`) ; nom du badge (Dashboard apprenant : modale Mes badges, `Dashboard.css:1051`) ✓ ; nom du groupe (Dashboard formateur, `DashboardFormateur.css:298`) ; « Personne à relancer » (Dashboard formateur, `DashboardFormateur.css:440`) ; titre d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:722`) ; titre du cours dans le tableau (Dashboard admin, `DashboardFormateur.css:819`) ✓ ; titre de la carte de cours assigné (Détail groupe, `DetailGroupe.css:120`) ; nom de l'élève (Détail groupe, `DetailGroupe.css:183`) ✓ ; énoncé de la question repliée (Création de cours, `CreationCours.css:623`) ✓ ; « Question N » (h3) (Création de cours, `CreationCours.css:655`) ; H1 de l'en-tête compact (affiché sous 1024 px) (Création de cours, `CreationCours.css:52`).

**Texte de lecture** (2) : premier paragraphe de la leçon (Détail cours, `DetailCoursFormateur.css:212`) ; texte de la leçon (Fiche : leçon, aperçu Création, `FicheCours.css:253`) ✓.

**Corps courant** (17) : texte de tableau (Contenu Markdown, `ContenuMarkdown.css:95`) ; texte du toast de complétion (Partagé (fiche), `CompletionToast.css:15`) ; texte courant (paragraphe) (Espace formateur, modale de confirmation, `Formateur.css:67`) ✓ ; points de l'encadré « À retenir » (Détail cours, `DetailCoursFormateur.css:294`) ; bonne réponse (Détail cours, `DetailCoursFormateur.css:353`) ; intitulé d'étape de checklist (Détail cours, `DetailCoursFormateur.css:372`) ; points de l'encadré « À retenir » (Fiche : leçon, `FicheCours.css:321`) ; explication de la correction (Fiche : quiz, Quiz flash, `FicheCours.css:662`) ✓ ; ligne « Ta réponse / Bonne réponse » (Fin de quiz : mes erreurs, `FicheCours.css:963`) ; explication (Fin de quiz : mes erreurs, `FicheCours.css:977`) ; consigne de remise en ordre (Fiche : checklist (remise en ordre), `FicheCours.css:1081`) ; intitulé d'étape (Fiche : checklist, `FicheCours.css:1172`) ; intitulé de l'étape en cours (Fiche : checklist, `FicheCours.css:1205`) ; texte de relance (Dashboard formateur, `DashboardFormateur.css:366`) ; texte de l'événement (Dashboard formateur, `DashboardFormateur.css:602`) ; cellules chiffrées du tableau (Dashboard admin (desktop), `DashboardFormateur.css:1064`) ; cellules du tableau des élèves (Détail groupe (desktop), `DetailGroupe.css:350`).

**Texte secondaire** (27) : phrase d'explication sous le H1 (Mot de passe oublié, `shared.css:119`) ; message d'erreur (.message) (Partagé, `shared.css:358`) ; texte d'état vide (Terrain, Détail thème, Détail groupe, `shared.css:512`) ; message de résultat de la remise en ordre (Fiche : checklist (remise en ordre), `quiz.css:85`) ; sous-titre sous le H1 (Parcours, `GabaritParcours.css:215`) ; message d'erreur (Parcours, `GabaritParcours.css:365`) ✓ ; sous-titre de l'en-tête lavande (Cours, Terrain, `EntetePage.css:35`) ; sous-titre sous le H1 (« N élèves · N cours ») (Espace formateur, `Formateur.css:37`) ; sous-titre de modale (Espace formateur, `Formateur.css:363`) ; « x cours terminés sur y » (Détail thème, `DetailTheme.css:88`) ✓ ; « Plusieurs réponses possibles » (Fiche : quiz, Quiz flash, `FicheCours.css:445`) ✓ ; sous-titre « Une seule erreur à revoir. » (Fin de quiz, `FicheCours.css:816`) ; phrase d'état (« Leçon lue. Reste le quiz ») (Dashboard apprenant, `Dashboard.css:388`) ; phrase du bloc de tête E (Dashboard apprenant, `Dashboard.css:449`) ; « 3 cours · 1 groupe · 12 élèves » (Dashboard formateur, admin, `DashboardFormateur.css:36`) ; note sous une carte (Dashboard formateur, `DashboardFormateur.css:133`) ; note 14 px (Pour bien démarrer) (Dashboard formateur, `DashboardFormateur.css:139`) ; texte d'état vide (Dashboard formateur, admin, `DashboardFormateur.css:144`) ; confirmation d'envoi de relance (Dashboard formateur, `DashboardFormateur.css:376`) ; titre du cours tronqué sous le H1 (Création de cours (< 1024), `CreationCours.css:60`) ; aide sous un champ (Création de cours, `CreationCours.css:272`) ; message d'erreur (Création de cours, `CreationCours.css:279`) ; message de la barre d'enregistrement (Création de cours, `CreationCours.css:1075`) ✓ ; « Aucun cours ne correspond… » (Cours, `SectionCours.css:28`) ; aide sous un champ (mot de passe) (Parcours, `Parcours.css:17`) ; texte du bloc lavande (Parcours : Création du compte, `Parcours.css:199`) ; phrase du quiz flash vertical (Dashboard apprenant (desktop, colonne étroite), `Dashboard.css:952`).

**Méta** (45) : méta de la ligne de cours (Terrain, recherche Cours, `LigneCours.css:54`) ✓ ; compteur « N cours » du bloc formateur (Cours, `BlocFormateur.css:44`) ; méta (« X terminés sur N »…) (Espace formateur, `Formateur.css:73`) ; détail sous le libellé de case (Modale d'assignation, `Formateur.css:532`) ✓ ; contenu « Leçon · Quiz · Checklist » (Détail thème, `DetailTheme.css:143`) ✓ ; légende de la barre d'avancement (Détail cours, `DetailCoursFormateur.css:96`) ; libellé des petites cartes d'avancement (Détail cours, `DetailCoursFormateur.css:141`) ; texte du bandeau « Aperçu élève » (Aperçu élève, `FicheCours.css:104`) ; « N min de lecture » / « X XP gagnés » (Fiche : leçon, récap, `FicheCours.css:234`) ; détail « N questions · +20 XP » (Fiche : leçon, checklist, `FicheCours.css:358`) ; condition du badge (Fin de quiz, `FicheCours.css:892`) ; « +15 XP à la fin » (Fiche : checklist, `FicheCours.css:1067`) ; critère de validation (Fiche : checklist, `FicheCours.css:1221`) ; détail de ligne (« Meilleur score : 4/5 ») (Récap, `FicheCours.css:1316`) ✓ ; contenu du cours suivant (Récap, `FicheCours.css:1352`) ; sous-texte (thème, condition du badge) (Dashboard apprenant, `Dashboard.css:149`) ; méta du cours assigné (« thème · ajouté hier ») (Dashboard apprenant, `Dashboard.css:426`) ; méta « 10 questions · +30 XP » (Dashboard apprenant, `Dashboard.css:482`) ✓ ; consigne du quiz flash verrouillé (Dashboard apprenant, `Dashboard.css:552`) ; condition du badge (Dashboard apprenant : modale Mes badges, `Dashboard.css:1057`) ✓ ; « Obtenu le JJ/MM » (Dashboard apprenant : modale Mes badges, `Dashboard.css:1062`) ; sous-titre « Sur l'ensemble de tes groupes » (Dashboard formateur, `DashboardFormateur.css:225`) ; « N élèves · N cours » (Dashboard formateur, `DashboardFormateur.css:304`) ; « Actif aujourd'hui » (Dashboard formateur, `DashboardFormateur.css:311`) ; date « Il y a N jours » (Dashboard formateur, `DashboardFormateur.css:370`) ; « Tous tes élèves ont commencé… » (Dashboard formateur, `DashboardFormateur.css:446`) ; statut « Quiz 90 % / En cours » (Dashboard formateur, `DashboardFormateur.css:640`) ; « N étapes sur 3 » (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:663`) ; sous-titre d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:727`) ; libellé de carte chiffrée (Dashboard admin, `DashboardFormateur.css:771`) ; précision « 30 derniers jours » (Dashboard admin, `DashboardFormateur.css:783`) ✓ ; thème court sous le titre (Dashboard admin, `DashboardFormateur.css:826`) ✓ ; résumé « 42 commencés · 18 terminés » (Dashboard admin (mobile), `DashboardFormateur.css:831`) ; email de l'élève (Détail groupe, `DetailGroupe.css:190`) ✓ ; statut par cours dans la carte élève (Détail groupe (mobile), `DetailGroupe.css:242`) ; compteur du sommaire (Création de cours (≥ 1024), `CreationCours.css:191`) ; nom d'image en étiquette (Création de cours, `CreationCours.css:519`) ; méta « Réponse unique · 3 réponses » (Création de cours, `CreationCours.css:632`) ; sous-titre de mode de checklist (Création de cours (≥ 768), `CreationCours.css:901`) ✓ ; compte « y cours » de la carte de thème (Cours, `SectionCours.css:105`) ; méta de carte (Mes cours, Mes groupes, `FormateurListes.css:64`) ; ligne « Cours terminés » (Mes groupes, `FormateurListes.css:101`) ; description de la carte de profil (Parcours : Choix du profil, `Parcours.css:162`) ; en-têtes de colonne du tableau (Dashboard admin (desktop), `DashboardFormateur.css:1045`) ; en-têtes de colonne du tableau des élèves (Détail groupe (desktop), `DetailGroupe.css:338`).

**Surtitre** (12) : surtitre « Thème N » (Détail thème, `DetailTheme.css:66`) ✓ ; thème au-dessus du titre (Fiche : leçon, récap, `FicheCours.css:215`) ✓ ; libellé « Étape suivante » de la carte encre (Fiche : leçon, checklist, `FicheCours.css:344`) ✓ ; libellé du cours au-dessus de la question (Fiche : quiz, Quiz flash, `FicheCours.css:426`) ✓ ; titre du cours dans la barre du haut (Fin de quiz, `FicheCours.css:718`) ✓ ; « Quiz terminé » (Fin de quiz, `FicheCours.css:763`) ✓ ; thème de l'en-tête compact (Fiche : checklist, `FicheCours.css:1033`) ; libellé « Suite du thème » (Récap, `FicheCours.css:1339`) ✓ ; libellé violet (« Ton premier cours »…) (Dashboard apprenant, `Dashboard.css:131`) ✓ ; libellé sur carte violette (« Tu en es là ») (Dashboard apprenant, `Dashboard.css:137`) ; intertitre de jour (« Aujourd'hui ») (Dashboard formateur, `DashboardFormateur.css:549`) ✓ ; surtitre « Thème N » de la carte de thème (Cours, `SectionCours.css:82`).

**Bouton** (19) : libellé du bouton principal (Partagé, `shared.css:200`) ; libellé du bouton secondaire (Partagé, `shared.css:230`) ; libellé du bouton orange (quiz flash) (Dashboard apprenant, `shared.css:255`) ; bouton pointillé « + Ajouter… » (Création de cours, `shared.css:380`) ; libellé du bouton du parcours (écrasé par .bouton-primaire / .bouton-secondaire) (Parcours, `GabaritParcours.css:86`) ; libellé du bouton rouge (Modale de confirmation, `Formateur.css:411`) ✓ ; libellé du bouton blanc (Fiche : leçon, checklist, `FicheCours.css:374`) ✓ ; libellé du bouton « Valider ma réponse » (Fiche : quiz, Quiz flash, `FicheCours.css:685`) ✓ ; libellé du bouton principal (Fin de quiz, `FicheCours.css:901`) ✓ ; libellé des boutons « Relire / Refaire / Revoir » (Récap, `FicheCours.css:1323`) ; libellé du bouton blanc à flèche (Dashboard apprenant, `Dashboard.css:222`) ✓ ; libellé du bouton large orange (Dashboard apprenant, `Dashboard.css:255`) ✓ ; libellé du bouton « Commencer » (Dashboard apprenant, `Dashboard.css:410`) ; libellé du bouton « Lancer » (Dashboard apprenant, `Dashboard.css:495`) ; libellé du bouton d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:740`) ; carte pointillée « + Assigner un cours » (Détail groupe, `DetailGroupe.css:137`) ; bouton d'outil « Image / Vidéo » (Création de cours, `CreationCours.css:438`) ; bouton « Image » d'étape (Création de cours, `CreationCours.css:1038`) ; bouton « Lancer » vertical (Dashboard apprenant (desktop, colonne étroite), `Dashboard.css:960`) ✓.

**Lien texte** (20) : lien « ← Retour » (Mot de passe oublié, `shared.css:321`) ; lien secondaire (simuler le lien) (Mot de passe oublié, `shared.css:343`) ; lien sous le bouton (« Déjà un compte ? … ») (Parcours, `GabaritParcours.css:106`) ; lien « Passer » (Parcours : Introduction, `GabaritParcours.css:135`) ; texte du lien Retour « ‹ Mes cours » (Espace formateur, `Formateur.css:161`) ✓ ; lien d'action « Annuler » (Modales, barre de Création de cours, `Formateur.css:397`) ; bouton texte « Supprimer ce groupe » (Détail groupe, `Formateur.css:433`) ✓ ; bouton Retour « Cours » (Détail thème, `DetailTheme.css:21`) ✓ ; bouton « Quitter l'aperçu » (Aperçu élève, `FicheCours.css:115`) ; bouton Retour (nom court du thème) (Fiche, `FicheCours.css:170`) ✓ ; lien « Revoir la leçon » (Fiche : quiz, Quiz flash, `FicheCours.css:673`) ✓ ; liens « Revoir mes erreurs »… (Fin de quiz, `FicheCours.css:919`) ✓ ; lien « Passer cette étape » (Fiche : checklist, `FicheCours.css:1153`) ✓ ; lien « Tout voir » / « Mes badges · X/6 » (Dashboard apprenant, Cours, `Dashboard.css:166`) ; lien « Tout voir » (Dashboard formateur, admin, `DashboardFormateur.css:112`) ; lien « Voir les N autres » / « Voir plus » (Dashboard formateur, `DashboardFormateur.css:128`) ✓ ; lien « Assigner » (Détail groupe, `DetailGroupe.css:87`) ✓ ; lien « Voir les N autres » (Détail groupe, `DetailGroupe.css:255`) ✓ ; bouton Retour « Mes cours » (Création de cours (≥ 1024), `CreationCours.css:144`) ; liens « Voir comme un élève » / « Créer un groupe » (Création de cours, `CreationCours.css:208`) ✓.

**Navigation** (8) : libellé d'entrée de la tab bar (mobile) (Navigation, `espace-layout.css:48`) ; entrée du menu (Se déconnecter) (Navigation, `espace-layout.css:123`) ; libellé d'étape (Leçon, Quiz · 4/5…) (Fiche : leçon, checklist, `ReperEtapes.css:67`) ; action du menu « … » (Espace formateur, `Formateur.css:297`) ; pastilles de filtre « Tout / Commencés / Terminés » (Dashboard formateur, `DashboardFormateur.css:494`) ✓ ; pastille de section collante (Création de cours (< 1024), `CreationCours.css:94`) ; entrée du sommaire (Création de cours (≥ 1024), `CreationCours.css:181`) ; onglet « Écrire / Aperçu » (Création de cours, `CreationCours.css:409`) ✓.

**Libellé de champ** (4) : libellé de champ (.champ) (Partagé (modales, Détail groupe, Mes cours, mot de passe), `shared.css:126`) ; libellé de champ (Parcours, `GabaritParcours.css:228`) ; libellé de champ (Création de cours, `CreationCours.css:266`) ; libellé « Bonne réponse » (Création de cours, `CreationCours.css:832`) ✓.

**Saisie et choix** (18) : saisie de champ input (.champ) (Partagé, `shared.css:136`) ; saisie de champ textarea (.champ) (Partagé, `shared.css:148`) ; saisie de champ (Parcours, `GabaritParcours.css:248`) ✓ ; saisie du grand champ (prénom, organisme…) (Parcours : questions, `GabaritParcours.css:269`) ; ligne de choix (statut, âge, motivation) (Parcours : questions, `GabaritParcours.css:296`) ; saisie de la recherche (Cours, `EntetePage.css:48`) ; valeur affichée de la liste déroulante (Création de cours, Mes cours, `Dropdown.css:12`) ; option de la liste déroulante (Création de cours, Mes cours, `Dropdown.css:61`) ; libellé de case à cocher (Modale d'assignation, Création de cours, `Formateur.css:527`) ; texte de réponse (Fiche : quiz, Quiz flash, `FicheCours.css:467`) ✓ ; saisie « Un élève » (Dashboard formateur, `DashboardFormateur.css:531`) ; saisie de l'email d'ajout (Détail groupe, `DetailGroupe.css:46`) ✓ ; bouton de choix (groupe, mode de checklist) (Création de cours, `CreationCours.css:327`) ; saisie de l'éditeur de leçon (Création de cours, `CreationCours.css:458`) ; saisie de réponse / d'explication (Création de cours, `CreationCours.css:767`) ; saisie d'explication (Création de cours, `CreationCours.css:776`) ; libellé de mode de checklist (Création de cours, `CreationCours.css:895`) ; saisie de l'intitulé d'étape (Création de cours, `CreationCours.css:961`).

**Pastille** (24) : pastille de statut (Nouveau, À faire, Non commencé) (Partagé (Cours, Dashboard, Détail groupe…), `espace-layout.css:252`) ; pastille de statut En cours / Terminé (Partagé, `espace-layout.css:275`) ✓ ; nom du badge dans le toast (Partagé (fiche), `CompletionToast.css:48`) ; numéro dans la pastille d'étape (Fiche : leçon, checklist, `ReperEtapes.css:56`) ✓ ; pastille de groupe / « Non assigné » (Espace formateur, `Formateur.css:178`) ; « +N » sur la dernière miniature (Détail cours, `DetailCoursFormateur.css:246`) ; numéro de question (Détail cours, `DetailCoursFormateur.css:328`) ✓ ; pastille « Ta réponse » / « Bonne réponse » (Fiche : quiz, Quiz flash, `FicheCours.css:606`) ; pastille « +20 XP » (Fin de quiz, `FicheCours.css:830`) ; pastille « Nouveau badge » (Fin de quiz, `FicheCours.css:881`) ; numéro dans la pastille d'étape (Fiche : checklist, `FicheCours.css:1109`) ✓ ; pastille « Bloquante » (Fiche : checklist, `FicheCours.css:1215`) ; « X XP gagnés » (pastille Terminé) (Récap, `FicheCours.css:1276`) ; pastille « De ton formateur » (Dashboard apprenant, `Dashboard.css:191`) ; pastille orange « Défi du jour » (Dashboard apprenant, `Dashboard.css:206`) ; pastille « Compte officiel » (Dashboard admin, `DashboardFormateur.css:63`) ✓ ; pastille « À surveiller / Bon rythme » (Dashboard formateur, `DashboardFormateur.css:236`) ; initiales sur rond lavande (Dashboard formateur, `DashboardFormateur.css:596`) ; pastille du groupe (Dashboard formateur, `DashboardFormateur.css:626`) ; numéro dans le rond (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:695`) ; pastille « Compte officiel : ce cours sera public » (Création de cours, `CreationCours.css:236`) ; numéro de question / d'étape (Création de cours, `CreationCours.css:575`) ; lettre de réponse (Création de cours, `CreationCours.css:751`) ; pilule « Bloquante » (Création de cours, `CreationCours.css:1013`).

**Chiffre mis en avant (standard)** (5) : chiffre des petites cartes d'avancement (Détail cours, `DetailCoursFormateur.css:130`) ✓ ; « [N] XP » de l'en-tête (Dashboard apprenant, `Dashboard.css:30`) ; pourcentage dans l'anneau (Dashboard apprenant, `Dashboard.css:382`) ; taux de complétion (chiffre) (Dashboard formateur, `DashboardFormateur.css:206`) ✓ ; chiffre de carte (Dashboard admin, `DashboardFormateur.css:777`).

**Chiffre mis en avant (grand)** (1) : score « 4/5 » dans l'anneau (Fin de quiz, `FicheCours.css:795`) ✓.

**Compteur** (8) : compteur « 2 / 5 » (Parcours : questions, `GabaritParcours.css:195`) ; « +15 XP » du toast (Partagé (fiche), `CompletionToast.css:39`) ; compteur « 3 / 5 » (Fiche : quiz, Quiz flash, `FicheCours.css:413`) ; « 80 % » sous le score (Fin de quiz, `FicheCours.css:801`) ; compteur de barre « X / 3 » (Dashboard apprenant, `Dashboard.css:318`) ✓ ; compteur de barre, petite variante (Dashboard apprenant, `Dashboard.css:323`) ; compteur « X/6 » (Dashboard apprenant : modale Mes badges, `Dashboard.css:1001`) ; % de la barre du groupe (Dashboard formateur, `DashboardFormateur.css:330`) ✓.
