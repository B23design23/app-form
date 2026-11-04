Statut : décidé le 4 novembre 2026, non migré. Source unique : `docs/proposition-typographie.md` (version 3, validée). Les noms de tokens ne sont pas encore décidés.

# Typographie

## 1. Police et unité

**Une seule police : Urbanist**, en romain de 500 à 800, plus l'italique 500 (section 10).

**Les tailles sont écrites et pensées en px, et sortent en rem (base 16 px)** pour suivre la taille de police choisie dans le navigateur. Une maquette qui indique 15 px se lit 15 px ; le code écrit 0,9375 rem.

- **Règle générale** : un texte doit pouvoir être agrandi jusqu'à 200 % sans perte de contenu ni de fonction (WCAG 2.2, critère 1.4.4, Redimensionnement du texte). Une taille en rem suit le réglage du navigateur, une taille en px ne le suit pas.
- **Précision Skillo** : un conteneur de taille fixe en px qui contient du texte (anneau, pastille, rond numéroté, bouton de hauteur fixe) doit rester lisible quand le texte grandit. Le texte ne doit ni déborder ni être coupé.

## 2. L'échelle (13 tailles)

**13 · 14 · 15 · 16 · 17 · 18 · 21 · 22 · 28 · 32 · 34 · 44 · 48**

Règle : **aucune autre taille n'est admise.** Toutes les tailles sont des px entiers.

| Taille | Sortie en rem | Rôles |
|---:|---:|---|
| 13 px | 0,8125 rem | Méta, Surtitre, Pastille |
| 14 px | 0,875 rem | Texte secondaire, Navigation, Libellé de champ |
| 15 px | 0,9375 rem | Corps courant, Bouton, Lien texte, Compteur |
| 16 px | 1 rem | Titre de ligne, Saisie et choix |
| 17 px | 1,0625 rem | Texte de lecture (sous 768 px) |
| 18 px | 1,125 rem | Titre de carte standard, Texte de lecture (à partir de 768 px) |
| 21 px | 1,3125 rem | Titre de section |
| 22 px | 1,375 rem | Titre de carte grand |
| 28 px | 1,75 rem | Titre de contenu (sous 768 px), Chiffre mis en avant standard |
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

## 5. Rôles (18)

Titre de carte et Chiffre mis en avant ont chacun deux niveaux, d'où 20 lignes.

| Rôle | Sous 768 px | À partir de 768 px | Graisse | Hauteur de ligne | Espacement des lettres | Fonction |
|---|---:|---:|---:|---:|---|---|
| Titre de page | 34 px | 44 px | 800 | 1,1 | normal | Nomme l'écran ; un seul par écran, en tête. |
| Titre de contenu | 28 px | 32 px | 800 | 1,1 | normal | Nomme l'objet que l'écran présente (cours, thème, question). |
| Titre de section | 21 px | 21 px | 800 | 1,2 | normal | Ouvre une partie de page ou une surface (section, carte de section, modale, feuille de menu). |
| Titre de carte, standard | 18 px | 18 px | 800 | 1,2 | normal | Nomme une carte ou un bloc compact. |
| Titre de carte, grand | 22 px | 22 px | 800 | 1,1 | normal | Nomme une grande carte mise en avant dans son écran. |
| Titre de ligne | 16 px | 16 px | 800 | 1,2 | normal | Nomme un élément de liste, ou rappelle un titre dans une barre compacte. |
| Texte de lecture | 17 px | 18 px | 500 | 1,55 | normal | Texte de la leçon, dans la fiche et dans son aperçu. |
| Corps courant | 15 px | 15 px | 500 | 1,45 | normal | Phrases lues ailleurs que dans la leçon : explications, paragraphes, intitulés, réponses affichées. |
| Texte secondaire | 14 px | 14 px | 600 | 1,2 | normal | Phrase qui accompagne un titre ou un contenu : sous-titre, état, aide, erreur, message. |
| Méta | 13 px | 13 px | 600 | 1,2 | normal | Information courte et factuelle sur un élément : contenu, date, compte, statut. |
| Surtitre | 13 px | 13 px | 700 | 1,2 | normal | Libellé court posé au-dessus d'un titre (thème, « Tu en es là »). |
| Bouton | 15 px | 15 px | 800 | 1,2 | normal | Libellé d'un bouton (plein, contour, pointillé, Retour). |
| Lien texte | 15 px | 15 px | 700 | 1,2 | normal | Action écrite sans forme de bouton et sans état choisi, qui agit ou mène ailleurs une fois (« Tout voir », « Revoir la leçon », « Passer cette étape », « Voir comme un élève »). |
| Navigation | 14 px | 14 px | 700 | 1,2 | normal | Option qui reste marquée comme choisie, dont le choix change ce qu'on voit (écran, vue, filtre) sans agir sur les données (barre d'onglets, onglets « Écrire / Aperçu », filtres, entrées de menu, repère d'étapes). |
| Libellé de champ | 14 px | 14 px | 600 | 1,2 | normal | Nomme un champ de formulaire. |
| Saisie et choix | 16 px | 16 px | 600 | 1,2 | normal | Texte tapé ou choisi par l'utilisateur. |
| Pastille | 13 px | 13 px | 800 | 1,2 | normal | Texte d'une pastille, numéros dans une pastille ronde compris. |
| Chiffre mis en avant, standard | 28 px | 28 px | 800 | 1 | normal | Nombre qui est le sujet de son bloc : le bloc existe pour le montrer (carte de statistique, taux de complétion). |
| Chiffre mis en avant, grand | 48 px | 48 px | 800 | 1 | normal | Nombre sujet de son bloc, au grand niveau : score de fin de quiz. |
| Compteur | 15 px | 15 px | 800 | 1,2 | normal | Nombre qui n'est pas le sujet de son bloc : position, avancement, total ou gain qui accompagne le sujet du bloc (« 3 / 5 » d'un quiz, XP de l'en-tête, pourcentage de l'anneau, « +15 XP »). |

Aucun rôle n'a d'espacement des lettres.

## 6. Choisir entre deux rôles voisins

**Titre de carte, standard ou grand.**
- Grand : la carte est mise en avant dans son écran. Elle occupe l'écran à elle seule ou presque (cartes de profil), c'est le seul titre d'une carte haute, ou elle fait partie de la famille des cartes encre de la fiche (« Étape suivante », « Suite du thème », correction du quiz). Le titre de la carte la plus visible de l'écran, après le titre de page, est aussi au grand niveau.
- Standard : la carte ou le bloc est compact. C'est une carte parmi d'autres dans une grille, un bloc en ligne, un encadré (« À retenir ») ou un toast.

**Chiffre mis en avant, standard ou grand.** Le grand niveau est réservé au score de fin de quiz. Tout autre nombre sujet de son bloc prend le niveau standard. Un nouveau cas de grand niveau : « À trancher ».

**Chiffre mis en avant ou Compteur : test binaire.** Si le nombre est le sujet du bloc (le bloc existe pour le montrer), c'est un Chiffre mis en avant : carte de statistique, taux de complétion, score de fin de quiz. Sinon, c'est un Compteur : position, avancement, total ou gain qui accompagne le sujet du bloc (« 3 / 5 » d'un quiz, XP de l'en-tête, pourcentage de l'anneau du bloc « cours en cours », dont le sujet est le cours, « 80 % » qui accompagne le score « 4/5 », « +15 XP » qui accompagne la complétion). Un nombre a un rôle et un seul. La forme du nombre (pourcentage, fraction, entier) ne décide jamais.

**Corps courant ou Texte de lecture.** Texte de lecture : le texte de la leçon, dans la fiche, dans son aperçu (Création de cours) et dans le Détail cours, où le formateur voit le premier paragraphe de la leçon. Corps courant : toutes les autres phrases lues (explications, paragraphes, intitulés d'étape, réponses affichées).

**Texte secondaire ou Méta.** Texte secondaire : une phrase complète qui commente un autre élément sans être le contenu principal (sous-titre, état vide, aide, erreur, message, note sous une carte). Méta : une information courte et factuelle sur un élément, lue en passant (contenu « Leçon · Quiz », date, compte, statut, « N min de lecture »).

**Lien texte ou Navigation.**
- Navigation : une option reste marquée comme choisie, et le choix change ce qu'on voit (écran, vue, filtre) sans agir sur les données. Exemples : barre d'onglets, onglets « Écrire / Aperçu », filtres, entrées de menu, repère d'étapes.
- Lien texte : une action écrite sans forme de bouton, sans état choisi, qui agit ou mène ailleurs une fois. Exemples : « Tout voir », « Revoir la leçon », « Passer cette étape », « Voir comme un élève ».
- L'option choisie d'une Navigation suit la règle des états (section 8) : graisse un cran au-dessus, 800.
- « Se déconnecter » et les actions du menu « … » de l'espace formateur sont des Liens texte : pas d'état choisi, une action sur la session ou les données.

**Bouton ou Lien texte : la forme.** Un texte d'action posé dans une forme de bouton (fond, contour ou pointillé, padding, zone cliquable de bouton) prend le rôle Bouton ; sans forme de bouton, Lien texte. **Le libellé du bouton Retour est en rôle Bouton** : la variante Retour (pilule blanche, padding, zone de 44 px) a une forme de bouton.

## 7. Rattachement

**La fonction d'un texte décide de son rôle, jamais sa taille actuelle ni la place disponible.**

- **Règle générale** : un système typographique décrit des rôles (ce que fait le texte) et non des tailles. Deux textes qui ont la même fonction ont la même typographie, où qu'ils soient.
- **Précision Skillo** : un texte écrit aujourd'hui dans une autre taille que son rôle n'est pas une exception, c'est une dérive à corriger. La place disponible (intérieur d'un anneau, largeur d'une carte) se vérifie après coup, elle ne choisit pas le rôle. Si la fonction ne permet pas de décider, c'est « À trancher », pas un choix à l'œil.
- **Le rôle typographique ne dépend pas de la balise HTML.** Le niveau de titre (h1, h2…) donne la structure de la page, le rôle donne l'apparence. Exemple : le nom d'un thème, dans le Détail d'un thème, est un h1 en Titre de contenu.

## 8. États et emphase

**Un état (choisi, en cours, fait, coché) ou une emphase monte la graisse d'un cran au-dessus de celle du rôle, jamais la taille.**

- **Règle générale** : marquer un état ou une emphase par la graisse plutôt que par la taille garde la ligne, la hauteur des blocs et la mise en page stables.
- **Précision Skillo** :
  - un cran exactement : 500 → 600, 600 → 700, 700 → 800 ;
  - l'option choisie d'une Navigation (entrée active, onglet actif, filtre actif, étape en cours) est un état : 800. C'est un changement de rendu discret (un cran de graisse) ;
  - **pas de partie plus légère que son rôle** : un compteur dans une pastille, un message « Aucune modification » ou tout fragment plus maigre prend la graisse du rôle ;
  - l'emphase dans une phrase (`strong`, gras Markdown, nom en gras dans un fil d'activité) suit la même règle qu'un état ;
  - **dans les rôles à 800, l'emphase reste invisible, et c'est accepté** : 800 est la graisse la plus forte, rien n'est chargé au-dessus.

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

## 11. Dans le code

Les noms de tokens ne sont pas encore décidés : cette page ne fixe que les valeurs. En attendant, aucune taille ni graisse hors des sections 2 et 3.

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

## 13. À trancher

- **Taux de complétion sous 400 px de large et anneau sur desktop** : à vérifier à l'écran pendant le test.
- **Option choisie d'une Navigation à 800** : vérifier à l'écran pendant le test que le passage à 800 ne décale pas les onglets et filtres voisins.
- **Textes posés dans des conteneurs de taille fixe**, l'anneau en premier : à vérifier avec la taille de police du navigateur à 200 % (section 1).
- **Nouveau cas de Chiffre mis en avant grand** : la proposition ne réserve le grand niveau qu'au score de fin de quiz. Tout autre candidat est à trancher.
