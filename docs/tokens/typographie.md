Statut : décidé le 4 novembre 2026, migration en cours, lots 1 à 10 faits. Source unique : `docs/proposition-typographie.md` (version 3, validée). Les tokens de la section 11 existent ; les écrans des lots 1 à 10 les utilisent, les autres pas encore.

# Typographie

## 1. Police et unité

**Une seule police : Urbanist**, en romain de 500 à 800, plus l'italique 500 (section 10).

**Les tailles sont écrites et pensées en px, et sortent en rem (base 16 px)** pour suivre la taille de police choisie dans le navigateur. Une maquette qui indique 15 px se lit 15 px ; le code écrit 0,9375 rem.

- **Règle générale** : un texte doit pouvoir être agrandi jusqu'à 200 % sans perte de contenu ni de fonction (WCAG 2.2, critère 1.4.4, Redimensionnement du texte). Une taille en rem suit le réglage du navigateur, une taille en px ne le suit pas.
- **Précision Skillo** : un conteneur de taille fixe en px qui contient du texte (anneau, pastille, rond numéroté, bouton de hauteur fixe) doit rester lisible quand le texte grandit. Le texte ne doit ni déborder ni être coupé.

## 2. L'échelle (13 tailles)

**13 · 14 · 15 · 16 · 17 · 18 · 21 · 24 · 28 · 32 · 34 · 44 · 48**

Règle : **aucune autre taille n'est admise.** Toutes les tailles sont des px entiers.

Seule exception, provisoire : 20,8 px pour le taux de complétion du dashboard formateur sous 400 px (section 7).

| Taille | Sortie en rem | Rôles |
|---:|---:|---|
| 13 px | 0,8125 rem | Méta, Surtitre, Pastille |
| 14 px | 0,875 rem | Texte secondaire, Navigation, Libellé de champ |
| 15 px | 0,9375 rem | Corps courant, Bouton, Lien texte, Compteur |
| 16 px | 1 rem | Titre de ligne, Saisie et choix |
| 17 px | 1,0625 rem | Texte de lecture (sous 768 px) |
| 18 px | 1,125 rem | Titre de carte, Texte de lecture (à partir de 768 px) |
| 21 px | 1,3125 rem | Titre de section |
| 24 px | 1,5 rem | Titre mis en avant (sous 768 px) |
| 28 px | 1,75 rem | Titre de contenu (sous 768 px), Titre mis en avant (à partir de 768 px), Chiffre mis en avant standard |
| 32 px | 2 rem | Titre de contenu (à partir de 768 px) |
| 34 px | 2,125 rem | Titre de page (sous 768 px) |
| 44 px | 2,75 rem | Titre de page (à partir de 768 px) |
| 48 px | 3 rem | Chiffre mis en avant grand |

- **Règle générale** : une échelle typographique est une liste fermée. Chaque taille sert un rôle, et l'on choisit un rôle, pas une taille.
- **Précision Skillo** : il n'existe pas de taille intermédiaire. 27 px ou 20 px, par exemple, ne sont pas dans l'échelle et ne s'écrivent pas.

## 3. Graisses

**500 · 600 · 700 · 800.** Aucune autre graisse n'est admise.

- **Règle générale** : une graisse demandée mais non chargée est remplacée par la plus proche, ou fabriquée par le navigateur (faux gras).
- **Précision Skillo** : seules ces quatre graisses sont chargées et employées. 400 et 900 n'existent pas dans Skillo.

## 4. Seuil de largeur

**Un seul seuil typographique : 768 px.** Chaque rôle a au plus une taille sous 768 px et une taille à partir de 768 px.

- **Règle générale** : moins il y a de seuils, plus la typographie reste prévisible d'un écran à l'autre.
- **Précision Skillo** : le seuil de 1024 px de Création de cours est un seuil de mise en page, pas un seuil typographique. Sous 1024 px, Création affiche un en-tête compact (rôle Titre de ligne) ; à partir de 1024 px, un en-tête desktop (rôle Titre de page). Chaque en-tête garde les tailles de son rôle.

## 5. Rôles (19)

Chiffre mis en avant a deux niveaux, d'où 20 lignes. Le Titre de carte n'a qu'un niveau ; le Titre mis en avant est un rôle à part, pas un niveau du Titre de carte.

| Rôle | Sous 768 px | À partir de 768 px | Graisse | Hauteur de ligne | Espacement des lettres | Fonction |
|---|---:|---:|---:|---:|---|---|
| Titre de page | 34 px | 44 px | 800 | 1,1 | normal | Nomme l'écran ; un seul par écran, en tête. |
| Titre de contenu | 28 px | 32 px | 800 | 1,1 | normal | Nomme l'objet que l'écran présente (cours, thème, question). |
| Titre mis en avant | 24 px | 28 px | 800 | 1,2 | normal | Titre de la carte qui porte l'action principale de l'écran, celle que l'écran existe pour faire. Au plus une par écran. Sur le dashboard apprenant, c'est le bloc de tête, quelle que soit sa variante. Un écran qui propose plusieurs choix de même poids n'en a pas. La carte porte une seule action, son bouton principal. Une carte qui regroupe plusieurs actions garde son rôle (exemple : « Pour bien démarrer »). |
| Titre de section | 21 px | 21 px | 800 | 1,2 | normal | Le titre nomme une partie de la page ou du contenu, il annonce ce qui suit (section de page, intertitre de leçon, titre Markdown, modale, feuille de menu). |
| Titre de carte | 18 px | 18 px | 800 | 1,2 | normal | Le titre nomme ce que la carte présente (un objet, une action), ou dit où l'on en est (« Raté, mais tu vas retenir ça », « Tu as fini les 12 cours ») ; en dessous, une explication ou une information. Un élément posé directement sur la page est une carte (Titre de carte). Un élément répété à l'intérieur d'une carte ou d'une modale est une ligne (Titre de ligne), même s'il a un fond. |
| Titre de ligne | 16 px | 16 px | 800 | 1,2 | normal | Nomme un élément de liste, ou rappelle un titre dans une barre compacte. Un élément posé directement sur la page est une carte (Titre de carte). Un élément répété à l'intérieur d'une carte ou d'une modale est une ligne (Titre de ligne), même s'il a un fond. |
| Texte de lecture | 17 px | 18 px | 500 | 1,55 | normal | Texte de la leçon, dans la fiche et dans son aperçu. |
| Corps courant | 15 px | 15 px | 500 | 1,45 | normal | Phrases lues ailleurs que dans la leçon : explications, paragraphes, intitulés, réponses affichées. |
| Texte secondaire | 14 px | 14 px | 600 | 1,2 | normal | Phrase qui accompagne un titre ou un contenu : sous-titre, état, aide, erreur, message. |
| Méta | 13 px | 13 px | 600 | 1,2 | normal | Information courte et factuelle sur un élément : contenu, date, compte, statut. |
| Surtitre | 13 px | 13 px | 700 | 1,2 | normal | Libellé court posé au-dessus d'un titre (thème, « Tu en es là »). |
| Bouton | 15 px | 15 px | 800 | 1,2 | normal | Libellé d'un bouton (plein, contour, pointillé, Retour). |
| Lien texte | 15 px | 15 px | 700 | 1,2 | normal | Action écrite sans forme de bouton et sans état choisi, qui agit ou mène ailleurs une fois (« Tout voir », « Revoir la leçon », « Passer cette étape », « Voir comme un élève »). |
| Navigation | 14 px | 14 px | 700 | 1,2 | normal | Option qui reste marquée comme choisie, dont le choix change ce qu'on voit (écran, vue, filtre) sans agir sur les données (barre d'onglets, onglets « Écrire / Aperçu », filtres, entrées de menu qui mènent à un écran ou à une vue et restent marquées comme choisies, repère d'étapes). |
| Libellé de champ | 14 px | 14 px | 600 | 1,2 | normal | Nomme un champ de formulaire. |
| Saisie et choix | 16 px | 16 px | 600 | 1,2 | normal | Texte tapé ou choisi par l'utilisateur, et texte indicatif (placeholder) du champ vide : même rôle, seule la couleur change. |
| Pastille | 13 px | 13 px | 800 | 1,2 | normal | Texte d'une pastille, numéros dans une pastille ronde compris, et texte du statut de la Pastille de statut, avec ou sans pilule (« En cours » et « Terminé » compris). |
| Chiffre mis en avant, standard | 28 px | 28 px | 800 | 1 | normal | Nombre sujet d'un bloc : le bloc existe pour le montrer (carte de statistique, taux de complétion). |
| Chiffre mis en avant, grand | 48 px | 48 px | 800 | 1 | normal | Nombre sujet de l'écran entier : l'écran existe pour le montrer (score de fin de quiz, en pourcentage). |
| Compteur | 15 px | 15 px | 800 | 1,2 | normal | Nombre qui n'est pas le sujet de son bloc : position, avancement, total ou gain qui accompagne le sujet du bloc (« 3 / 5 » d'un quiz, XP de l'en-tête, pourcentage de l'anneau, « +15 XP »). |

Aucun rôle n'a d'espacement des lettres.

- **Précision Skillo** : deux rôles de titre (Titre de page, Titre de contenu, Titre mis en avant, Titre de section, Titre de carte, Titre de ligne) ne prennent jamais la même valeur (même taille, même graisse et même hauteur de ligne) : entre deux niveaux de titre, seule la valeur montre la hiérarchie. Les autres rôles peuvent partager une valeur quand la forme ou la place les distingue (Bouton et Compteur, Texte secondaire et Libellé de champ). C'est pourquoi le Titre de carte reste à 18 px : 21 px est refusé, c'est la valeur du Titre de section (décision 26 de `docs/proposition-typographie.md`). La règle vaut à chaque largeur : le Titre mis en avant est à 24 px sous 768 px, où aucun autre titre ne l'est, et à 28 px · 1,2 à partir de 768 px, où le Titre de contenu est à 32 px.

**Césure des titres.** Un titre (page, contenu, section, mis en avant, carte, ligne) qui ne tient pas dans son conteneur se coupe à la syllabe, avec un tiret, dans un mot de 10 lettres ou plus, avec au moins 4 lettres de chaque côté du tiret. Filet : coupure sans tiret plutôt que débordement. Limites acceptées : Firefox ne met pas de tiret dans un mot à majuscule initiale, et peut couper un mot qui tenait pour équilibrer les lignes. Raison : un conteneur fixe qui contient du texte doit rester lisible quand le texte grandit (section 1) ; à 375 px, « Thermodynamique » en 18 px déborde de la carte de thème. La césure suit la langue de la page (`lang="fr"` sur la balise `html`). Dans le code : section 11.

**Césure du Texte de lecture.** Le Texte de lecture se coupe à la syllabe, avec un tiret, partout où il apparaît. Les autres rôles ne se coupent pas, sauf les titres (césure des titres).

## 6. Choisir entre deux rôles voisins

**Titre de section ou Titre de carte.**
- Titre de section : le titre nomme une partie de la page ou du contenu, il annonce ce qui suit (section de page, intertitre de leçon, titre Markdown, modale, feuille de menu). Exemples : « De ton formateur », « Taux de complétion », intertitres de leçon, « À retenir ».
- Titre de carte : le titre nomme ce que la carte présente (un objet, une action : un cours, un thème, un groupe, un badge, ce qu'on va faire), ou dit où l'on en est (« Raté, mais tu vas retenir ça », « Tu as fini les 12 cours »). En dessous, une explication ou une information. Exemples : « X étapes sur N », carte de thème, « Quiz flash » en ligne, prochain cours conseillé hors tête. Une carte garde le même rôle de titre quelle que soit sa place dans l'écran (en tête, en colonne ou en ligne), sauf si elle porte l'action principale de l'écran : son titre passe alors en Titre mis en avant (ci-dessous).
- Test : le titre est-il le nom d'une chose (Titre de carte) ou le nom d'une partie (Titre de section) ?
- Surfaces entières : Une modale ou une feuille de menu prend le Titre de section, quel que soit son texte : elle tient la place d'un écran. Le test du nom vaut pour les cartes et les parties de page.

**Titre mis en avant ou Titre de carte** (décision 28 de `docs/proposition-typographie.md`, 7 novembre 2026).
- Titre mis en avant : Titre de la carte qui porte l'action principale de l'écran, celle que l'écran existe pour faire. Au plus une par écran. Sur le dashboard apprenant, c'est le bloc de tête, quelle que soit sa variante. Un écran qui propose plusieurs choix de même poids n'en a pas. La carte porte une seule action, son bouton principal. Une carte qui regroupe plusieurs actions garde son rôle (exemple : « Pour bien démarrer »).
- Exemples : titre du bloc de tête du dashboard apprenant (cours en cours, cours assigné, premier cours ou prochain cours conseillé en tête, « Quiz flash » en tête), titre de la carte « Étape suivante » (leçon, checklist), titre du cours suivant de « Suite du thème » (récap).
- Restent en Titre de carte : « Quiz flash » en ligne, le prochain cours conseillé quand il n'est pas en tête, et les deux cartes du Choix du profil (deux choix de même poids : l'écran n'a pas de Titre mis en avant). « Pour bien démarrer » (dashboard formateur) regroupe trois actions : il garde son rôle, Titre de section.
- Test : la carte porte-t-elle l'action que l'écran existe pour faire, avec un seul bouton principal, et est-elle la seule à la porter ? Oui : Titre mis en avant. Non, ou plusieurs cartes à égalité : Titre de carte.
- Raison : un niveau de titre qui s'applique à plusieurs cartes ne hiérarchise plus rien ; c'est pourquoi l'ancien niveau grand du Titre de carte a été supprimé. Un rôle limité à une carte par écran, lui, hiérarchise. La décision 26 impose une valeur distincte des autres titres à chaque largeur, d'où 24 / 28 px · 800 · 1,2. 24 px entre dans l'échelle (section 2).

**Titre de carte ou Titre de ligne : carte ou ligne** (décision 27 de `docs/proposition-typographie.md`). Un élément posé directement sur la page est une carte (Titre de carte). Un élément répété à l'intérieur d'une carte ou d'une modale est une ligne (Titre de ligne), même s'il a un fond. Exemples : les groupes de « Tes groupes » (dashboard formateur) et les tuiles de la modale Mes badges sont des lignes (Titre de ligne) ; les cartes de cours assigné du Détail groupe, posées sur la page, sont des cartes (Titre de carte). Le nom du badge dans le toast de complétion reste en Pastille.

**Chiffre mis en avant, standard ou grand.** Grand : le nombre est le sujet de l'écran entier (l'écran existe pour le montrer), comme le score de fin de quiz (quiz de cours et quiz flash), affiché en pourcentage. Standard : le nombre est le sujet d'un bloc.

**Chiffre mis en avant ou Compteur : test binaire.** Si le nombre est le sujet du bloc (le bloc existe pour le montrer), c'est un Chiffre mis en avant : carte de statistique, taux de complétion, score de fin de quiz (en pourcentage). Sinon, c'est un Compteur : position, avancement, total ou gain qui accompagne le sujet du bloc (« 3 / 5 » d'un quiz, XP de l'en-tête, pourcentage de l'anneau du bloc « cours en cours », dont le sujet est le cours, « +15 XP » qui accompagne la complétion). Un nombre a un rôle et un seul. La forme du nombre (pourcentage, fraction, entier) ne décide jamais.

**Corps courant ou Texte de lecture.** Texte de lecture : le texte de la leçon, dans la fiche, dans son aperçu (Création de cours) et dans le Détail cours, où le formateur voit le premier paragraphe de la leçon. Corps courant : toutes les autres phrases lues (explications, paragraphes, intitulés d'étape, réponses affichées).

**Texte secondaire ou Méta.** Texte secondaire : une phrase complète qui commente un autre élément sans être le contenu principal (sous-titre, état vide, aide, erreur, message, note sous une carte). Méta : une information courte et factuelle sur un élément, lue en passant (contenu « Leçon · Quiz », date, compte, statut, « N min de lecture »).

**Lien texte ou Navigation.**
- Navigation : une option reste marquée comme choisie, et le choix change ce qu'on voit (écran, vue, filtre) sans agir sur les données. Exemples : barre d'onglets, onglets « Écrire / Aperçu », filtres, entrées de menu qui mènent à un écran ou à une vue et restent marquées comme choisies, repère d'étapes.
- Lien texte : une action écrite sans forme de bouton, sans état choisi, qui agit ou mène ailleurs une fois. Exemples : « Tout voir », « Revoir la leçon », « Passer cette étape », « Voir comme un élève ».
- L'option choisie d'une Navigation suit la règle des états (section 8) : graisse un cran au-dessus, 800.
- **Entrées de menu** : seules celles qui mènent à un écran ou à une vue et restent marquées comme choisies sont des Navigations. Les entrées qui agissent (« Se déconnecter », actions du menu « … » de l'espace formateur) sont des Liens texte : pas d'état choisi, une action sur la session ou les données.
- **Lien posé dans une phrase** : il prend le rôle de la phrase en variante `-fort` (un cran de graisse), et ne change jamais de taille. Lien seul, hors d'une phrase : Lien texte. Raison : un lien dans une phrase fait partie de la phrase, la taille ne change pas dans une ligne (section 8). Exemple : « 3 cours » et « 1 groupe » dans « 3 cours · 1 groupe · 12 élèves » du dashboard formateur, en Texte secondaire fort.

**Saisie et choix : texte tapé et texte indicatif.** Le texte indicatif (placeholder) d'un champ vide prend le rôle Saisie et choix, comme le texte tapé : seule la couleur change. Le vide et le rempli sont deux états du même texte, et un état ne change jamais la taille (section 8).

**Pastille : avec ou sans pilule.** Le texte du statut de la Pastille de statut prend le rôle Pastille, qu'il soit posé dans une pilule ou non (« En cours » et « Terminé » compris). La fonction décide du rôle, pas la forme (section 7) ; la forme ne départage que Bouton et Lien texte.

**Bouton ou Lien texte : la forme.** Un texte d'action posé dans une forme de bouton (fond, contour ou pointillé, padding, zone cliquable de bouton) prend le rôle Bouton ; sans forme de bouton, Lien texte. **Le libellé du bouton Retour est en rôle Bouton** : la variante Retour (pilule blanche, padding, zone de 44 px) a une forme de bouton.

## 7. Rattachement

**La fonction d'un texte décide de son rôle, jamais sa taille actuelle ni la place disponible.**

- **Règle générale** : un système typographique décrit des rôles (ce que fait le texte) et non des tailles. Deux textes qui ont la même fonction ont la même typographie, où qu'ils soient.
- **Précision Skillo** : un texte écrit aujourd'hui dans une autre taille que son rôle n'est pas une exception, c'est une dérive à corriger. La place disponible (intérieur d'un anneau, largeur d'une carte) se vérifie après coup, elle ne choisit pas le rôle. Si la fonction ne permet pas de décider, c'est « À trancher », pas un choix à l'œil.
- **Provisoire** : le taux de complétion du dashboard formateur (Chiffre mis en avant, standard) s'affiche en 20,8 px sous 400 px de large, au lieu de 28 px. Raison : 28 px ne tient pas dans l'anneau de 88 px. À retirer quand l'anneau aura ses dimensions (chantier composants).
- **Le rôle typographique ne dépend pas de la balise HTML.** Le niveau de titre (h1, h2…) donne la structure de la page, le rôle donne l'apparence. Exemple : le nom d'un thème, dans le Détail d'un thème, est un h1 en Titre de contenu.

## 8. États et emphase

**Un état (choisi, en cours, fait, coché) ou une emphase monte la graisse d'un cran au-dessus de celle du rôle, jamais la taille.**

- **Règle générale** : marquer un état ou une emphase par la graisse plutôt que par la taille garde la ligne, la hauteur des blocs et la mise en page stables.
- **Précision Skillo** :
  - un cran exactement : 500 → 600, 600 → 700, 700 → 800 ;
  - l'option choisie d'une Navigation (entrée active, onglet actif, filtre actif, étape en cours) est un état : 800. C'est un changement de rendu discret (un cran de graisse) ;
  - **pas de partie plus légère que son rôle** : un compteur dans une pastille, un message « Aucune modification » ou tout fragment plus maigre prend la graisse du rôle ;
  - l'emphase dans une phrase (`strong`, gras Markdown, nom en gras dans un fil d'activité) suit la même règle qu'un état ;
  - **dans les rôles à 800, l'emphase reste invisible, et c'est accepté** : 800 est la graisse la plus forte, rien n'est chargé au-dessus ;
  - **en-tête de tableau (`th`)** : il prend le rôle du tableau qu'il coiffe, en variante `-fort` (un tableau en Corps courant : en-têtes en Corps courant fort). Si ce rôle est à 800, l'en-tête reste à 800.

## 9. Contrôles

**Les champs et les boutons prennent la famille et la graisse de leur rôle, jamais la police par défaut du navigateur.**

- **Règle générale** : les navigateurs n'appliquent pas l'héritage de la police aux boutons et aux champs. Un bouton ou un champ sans déclaration prend la police, la taille et la graisse du navigateur.
- **Précision Skillo** : chaque bouton, champ, liste déroulante ou ligne de choix déclare la typographie de son rôle (Bouton, Saisie et choix, Navigation…).

**Saisie et choix : 16 px.**

- **Règle générale** : Safari sur iOS agrandit la page quand on touche un champ dont le texte fait moins de 16 px (contrainte technique).
- **Précision Skillo** : tout texte tapé ou choisi dans un champ fait 16 px, même dans un en-tête dense ou une ligne de filtres.

**Croix et flèches : icônes SVG, pas caractères.**

- **Règle générale** : un caractère comme ×, ↑, ↓, ▲ ou ▼ dépend de la police qui l'affiche. S'il manque dans la police, le navigateur le prend dans une police de secours, avec un dessin et un alignement imprévisibles.
- **Précision Skillo** : la croix de fermeture, les flèches Monter / Descendre et les flèches de tri sont des icônes SVG, comme les autres boutons ronds. Elles sortent de la typographie.

## 10. Italique

**Urbanist italique 500, à charger.**

- **Règle générale** : une italique demandée mais non chargée est fabriquée par le navigateur (texte penché artificiellement).
- **Précision Skillo** : l'italique apparaît dans le contenu Markdown des cours, en Texte de lecture et en Corps courant (graisse 500). Urbanist existe en italique sur Google Fonts. On charge l'italique 500, et seulement elle.
- **Gras italique** : il n'est pas prévu, aucun token ni fichier de police. S'il apparaît dans un Markdown (gras dans un passage en italique), le gras fabriqué par le navigateur est accepté.

## 11. Dans le code

**Tous les tokens typographiques portent le préfixe `typo-`.** Les primitifs sont nommés par leur valeur, les rôles par leur rôle. Source : `tokens/`, CSS généré par `npm run tokens` dans `src/styles/tokens.generes.css`.

**Primitifs** (`tokens/typographie.tokens.json`) : `typo-famille` (Urbanist, sans-serif) ; `typo-taille-13` à `typo-taille-48` (les 13 tailles de la section 2, écrites en px, sorties en rem) ; `typo-graisse-500` à `typo-graisse-800` ; `typo-interligne-1`, `-1-1`, `-1-2`, `-1-45`, `-1-55` ; `typo-espacement-lettres-0` ; `typo-seuil-desktop` (768 px). Le seuil ne sort pas en variable CSS : le générateur le lit pour écrire la media query (une media query ne lit pas un `var()`).

**Rôles** : un token composé (type DTCG `typography`) par rôle, qui fait référence aux primitifs (famille, taille, graisse, hauteur de ligne, espacement des lettres). Il sort en CSS au format du raccourci `font`, avec des `var()` vers les primitifs.

| Token | Rôle | Variante `-fort` |
|---|---|---|
| `typo-titre-page` | Titre de page | — |
| `typo-titre-contenu` | Titre de contenu | — |
| `typo-titre-mis-en-avant` | Titre mis en avant | — |
| `typo-titre-section` | Titre de section | — |
| `typo-titre-carte` | Titre de carte | — |
| `typo-titre-ligne` | Titre de ligne | — |
| `typo-texte-lecture` | Texte de lecture | `typo-texte-lecture-fort` |
| `typo-corps-courant` | Corps courant | `typo-corps-courant-fort` |
| `typo-texte-secondaire` | Texte secondaire | `typo-texte-secondaire-fort` |
| `typo-meta` | Méta | `typo-meta-fort` |
| `typo-surtitre` | Surtitre | `typo-surtitre-fort` |
| `typo-bouton` | Bouton | — |
| `typo-lien-texte` | Lien texte | `typo-lien-texte-fort` |
| `typo-navigation` | Navigation | `typo-navigation-fort` |
| `typo-libelle-champ` | Libellé de champ | `typo-libelle-champ-fort` |
| `typo-saisie-choix` | Saisie et choix | `typo-saisie-choix-fort` |
| `typo-pastille` | Pastille | — |
| `typo-chiffre` | Chiffre mis en avant, standard | — |
| `typo-chiffre-grand` | Chiffre mis en avant, grand | — |
| `typo-compteur` | Compteur | — |

**Variante `-fort`** : le rôle avec une graisse d'un cran au-dessus (section 8 : 500 → 600, 600 → 700, 700 → 800), pour un état (choisi, en cours, fait, coché) ou une emphase. Les rôles à 800 n'en ont pas.

**Trois fichiers et un seuil.** `tokens/typographie.tokens.json` contient les primitifs et les rôles à une seule taille. `tokens/typographie-mobile.tokens.json` et `tokens/typographie-desktop.tokens.json` contiennent, sous les mêmes noms, les rôles qui changent de taille au seuil : Titre de page, Titre de contenu, Titre mis en avant, Texte de lecture (et sa variante `-fort`). Un rôle est soit dans le fichier commun, soit dans les deux autres, jamais aux deux. Dans le CSS, les valeurs mobile sont dans `:root`, les valeurs desktop dans `@media (min-width: 768px) { :root { … } }`. Les mots mobile et desktop ne vont que dans le nom des fichiers, jamais dans le nom des tokens.

**Règle d'usage.** Un élément applique son rôle par `font: var(--typo-<rôle>)`, son état ou son emphase par `font: var(--typo-<rôle>-fort)`. Jamais `font-size` ni `font-weight` séparés, jamais un primitif (`--typo-taille-*`, `--typo-graisse-*`…) dans un composant.

- Le raccourci `font` ne porte pas l'espacement des lettres : la valeur reste écrite dans `tokens/` (0 pour tous les rôles, section 5) et le primitif `typo-espacement-lettres-0` existe, mais elle ne sort pas dans `--typo-<rôle>`.
- Le raccourci `font` remet aussi `font-style` à sa valeur initiale : une italique se déclare après lui.
- **Titres** : chaque `font: var(--typo-titre-…)` est accompagné de `hyphens: auto` (coupure à la syllabe, avec tiret), de `hyphenate-limit-chars: 10 4 4`, `-webkit-hyphenate-limit-before: 4` et `-webkit-hyphenate-limit-after: 4` (mot de 10 lettres ou plus, au moins 4 lettres de chaque côté du tiret ; les deux dernières pour WebKit) et de `overflow-wrap: break-word` (filet : coupure sans tiret si aucune syllabe ne convient). Jamais `hyphens: manual` ni `overflow-wrap: normal` sur un titre (section 5, césure des titres).

## 12. Exemples non conformes

Format : situation, erreur plausible, règle citée, version conforme.

**Exemple non conforme : état écrit en plus grand**
- Situation : étape en cours d'une checklist.
- Erreur plausible : l'intitulé de l'étape en cours passe à 17 px pour la détacher des autres étapes.
- Règle citée : section 8, un état monte la graisse d'un cran, jamais la taille.
- Version conforme : Corps courant, 15 px · 1,45, graisse 600 (un cran au-dessus de 500).

**Exemple non conforme : pourcentage de l'anneau**
- Situation : pourcentage au centre de l'anneau du bloc « cours en cours » du dashboard apprenant.
- Erreur plausible : Chiffre mis en avant (28 px), parce que c'est un pourcentage et qu'il y a de la place dans l'anneau.
- Règle citée : section 6, le sujet du bloc décide, jamais la forme du nombre ; section 7, la place disponible ne choisit pas le rôle. Le sujet du bloc est le cours, le pourcentage dit où l'on en est dans ce cours.
- Version conforme : Compteur, 15 px · 800 · 1,2.

**Exemple non conforme : champ plus petit pour gagner de la place**
- Situation : champ de recherche dans un en-tête de carte chargé.
- Erreur plausible : texte du champ à 14 px pour qu'il tienne à côté des filtres.
- Règle citée : section 9, Saisie et choix à 16 px (Safari sur iOS) ; section 7, la place disponible ne choisit pas le rôle.
- Version conforme : Saisie et choix, 16 px · 600 · 1,2.

**Exemple non conforme : croix en caractère**
- Situation : bouton de fermeture d'une modale.
- Erreur plausible : le caractère « × » en guise d'icône, avec une taille de police pour le grossir.
- Règle citée : section 9, croix et flèches en icônes SVG.
- Version conforme : icône SVG de croix dans le bouton rond, avec un `aria-label`.

**Exemple non conforme : libellé du bouton Retour**
- Situation : bouton Retour en haut d'une page de détail.
- Erreur plausible : le libellé en Lien texte (700), parce qu'il mène ailleurs une fois, comme un lien.
- Règle citée : section 6, Bouton ou Lien texte se choisit par la forme ; la variante Retour a une forme de bouton.
- Version conforme : Bouton, 15 px · 800 · 1,2, dans la pilule blanche de la variante Retour.

**Exemple non conforme : partie plus légère**
- Situation : compteur de questions à l'intérieur d'une pastille de navigation.
- Erreur plausible : le compteur en 600 pour qu'il s'efface derrière le libellé.
- Règle citée : section 8, pas de partie plus légère que son rôle.
- Version conforme : compteur dans la graisse du rôle Navigation (700).

**Exemple non conforme : deux titres mis en avant sur le même écran**
- Situation : dashboard apprenant, quiz flash débloqué, rien en cours ni assigné : « Quiz flash » en tête (bloc E), puis la carte « Prochain cours conseillé » avec son bouton « Commencer ».
- Erreur plausible : le titre de la carte « Prochain cours conseillé » aussi en Titre mis en avant, parce qu'elle a elle aussi un bouton principal et pousse à commencer un cours.
- Règle citée : section 6, au plus un Titre mis en avant par écran ; sur le dashboard apprenant, c'est le bloc de tête. Deux titres au même niveau ne hiérarchisent plus rien.
- Version conforme : « Quiz flash » du bloc E en Titre mis en avant (24 / 28 px · 800 · 1,2), le titre du prochain cours conseillé en Titre de carte (18 px · 800 · 1,2).

## 13. À trancher

- **Anneau du taux de complétion sur desktop** : à vérifier à l'écran pendant le test (sous 400 px de large : exception provisoire, section 7).
- **Option choisie d'une Navigation à 800** : vérifier à l'écran pendant le test que le passage à 800 ne décale pas les onglets et filtres voisins.
- **Textes posés dans des conteneurs de taille fixe**, l'anneau en premier : à vérifier avec la taille de police du navigateur à 200 % (section 1).
