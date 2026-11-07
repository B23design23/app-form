# Proposition de valeurs typographiques par rôle (version 3, validée)

> **Statut : validée le 2026-11-04** (décisions finales en section 10). Versions précédentes du même fichier : version 1, commit `b79f039` (12 rôles, 210 éléments changés sur 274) ; version 2, commit `3f8ac4b` (18 rôles, 192 éléments changés sur 275, dont 75 changements visibles selon le critère de la version 3).

Étape 2 du chantier typographie, version 3, rédigée le 2026-11-04 à partir de `docs/audit-typographie.md`. Ce document propose des valeurs. Il ne crée aucun token et ne corrige rien. Les noms de rôles restent en français courant.

**Base de calcul**

- Un **élément** est un type d'élément rendu en prod (origin/main `a6d20f6`) : une règle CSS de base utilisée, avec sa variante desktop et les classes qui s'y combinent. Total : **275 éléments**. Par rapport à la version 1 (274), l'en-tête de Création de cours est compté comme deux éléments : l'en-tête compact (affiché sous 1024 px) et l'en-tête desktop (à partir de 1024 px), puisque 1024 reste un seuil de mise en page (décision 9). Correction au passage : les titres de carte de Mes cours et de Mes groupes sont bien en 800 (classe `.fl-carte-titre` combinée), la version 1 les comptait en 500.
- Valeur **actuelle** = valeur rendue en prod, y compris pour les valeurs écrasées de l'audit.
- **Niveau d'un changement** (nouveau en version 3), élément par élément :
  - *identique* : taille, graisse, hauteur de ligne et espacement des lettres inchangés ;
  - *discret* : écart de taille de moins de 2 px **et** au plus un cran de graisse. Comptent aussi comme discrets, quel que soit l'écart : une taille fractionnaire issue d'un rem qui rejoint une taille entière (par exemple 11,52 → 15 px pour la barre d'onglets, 14,4 → 21 px pour « Taux de complétion »), et la graisse 400 imposée par le navigateur qui prend la graisse du rôle. Un changement qui ne touche que la hauteur de ligne ou l'espacement des lettres est discret ;
  - *visible* : écart de taille de 2 px ou plus (hors taille issue d'un rem), **ou** deux crans de graisse ou plus (hors 400).
- **Valeur d'un rôle** : la combinaison taille mobile · taille desktop · graisse · hauteur de ligne qui **minimise le nombre de changements visibles** ; à égalité, celle qui change le moins d'éléments ; puis le plus petit écart cumulé (px et crans). Les tailles et hauteurs de ligne candidates sont celles que portent déjà les éléments du rôle en prod (voir section 9 pour des valeurs intermédiaires). Valeurs fixées : Corps courant (15 px, 500, 1,45), Texte de lecture (17 / 18 px, 500, 1,55) et Titre mis en avant (24 / 28 px, 800, 1,2 ; décision 28). **Deux rôles de titre (Titre de page, Titre de contenu, Titre mis en avant, Titre de section, Titre de carte, Titre de ligne) ne prennent jamais la même valeur** (même taille, même graisse et même hauteur de ligne) : entre deux niveaux de titre, seule la valeur montre la hiérarchie. Une valeur déjà portée par un autre rôle de titre est écartée. Les autres rôles peuvent partager une valeur quand la forme ou la place les distingue (Bouton et Compteur, Texte secondaire et Libellé de champ) (décision 26).
- Tailles en px entiers, sortie en rem base 16. Graisses 500 à 800. Contrôles de formulaire et boutons : famille et graisse de leur rôle. Hauteur de ligne 1,2 là où rien n'est déclaré. Seuil unique 768 px pour la typographie.

**Critère de fusion (lecture validée).** Deux rôles candidats fusionnent si leurs valeurs dominantes (combinaison la plus fréquente) diffèrent **d'au plus 1 px et d'au plus un cran de graisse** (les deux peuvent se cumuler), ou si l'écart vient d'un accident (taille issue d'un rem, valeur écrasée). Le critère est nécessaire mais pas suffisant : deux rôles aux valeurs proches mais aux fonctions différentes (Titre de ligne et Lien texte, tous deux à 15 px 800) restent séparés.

## 1. Rôles

19 rôles. Chiffre mis en avant a deux niveaux, soit 20 jeux de valeurs. Le Titre de carte n'a plus qu'un niveau (décision 14) ; le Titre mis en avant est un rôle à part entière, pas un niveau du Titre de carte (décision 28).

| Rôle | Fonction | Taille mobile | Taille desktop | Graisse | Hauteur de ligne | Espacement des lettres | Éléments |
|---|---|---|---|---|---|---|---|
| Titre de page | Nomme l'écran ; un seul par écran, en tête | 34 px | 44 px | 800 | 1,1 | normal | 9 |
| Titre de contenu | Nomme l'objet que l'écran présente (cours, thème, question) | 28 px | 32 px | 800 | 1,1 | normal | 4 |
| Titre mis en avant | Titre de la carte qui porte l'action principale de l'écran, celle que l'écran existe pour faire. Au plus une par écran. Sur le dashboard apprenant, c'est le bloc de tête, quelle que soit sa variante. Un écran qui propose plusieurs choix de même poids n'en a pas. La carte porte une seule action, son bouton principal. Une carte qui regroupe plusieurs actions garde son rôle (exemple : « Pour bien démarrer ») | **24 px** | **28 px** | 800 | 1,2 | normal | 4 |
| Titre de section | Le titre nomme une partie de la page ou du contenu, il annonce ce qui suit (section de page, intertitre de leçon, titre Markdown, modale, feuille de menu) | **21 px** | **21 px** | 800 | 1,2 | normal | 19 |
| Titre de carte | Le titre nomme ce que la carte présente (un objet, une action), ou dit où l'on en est (« Raté, mais tu vas retenir ça », « Tu as fini les 12 cours ») ; en dessous, une explication ou une information. Un élément posé directement sur la page est une carte (Titre de carte). Un élément répété à l'intérieur d'une carte ou d'une modale est une ligne (Titre de ligne), même s'il a un fond. | **18 px** | **18 px** | 800 | 1,2 | normal | 13 |
| Titre de ligne | Nomme un élément de liste, ou rappelle un titre dans une barre compacte. Un élément posé directement sur la page est une carte (Titre de carte). Un élément répété à l'intérieur d'une carte ou d'une modale est une ligne (Titre de ligne), même s'il a un fond. | **16 px** | **16 px** | 800 | 1,2 | normal | 17 |
| Texte de lecture | Texte de la leçon, dans la fiche et dans son aperçu | 17 px | 18 px | 500 | 1,55 | normal | 2 |
| Corps courant | Phrases lues ailleurs que dans la leçon : explications, paragraphes, intitulés, réponses affichées | 15 px | 15 px | 500 | 1,45 | normal | 19 |
| Texte secondaire | Phrase qui accompagne un titre ou un contenu : sous-titre, état, aide, erreur, message | 14 px | 14 px | **600** | 1,2 | normal | 32 |
| Méta | Information courte et factuelle sur un élément : contenu, date, compte, statut | 13 px | 13 px | **600** | 1,2 | normal | 38 |
| Surtitre | Libellé court posé au-dessus d'un titre (thème, « Tu en es là ») | 13 px | 13 px | 700 | 1,2 | normal | 11 |
| Bouton | Libellé d'un bouton (plein, contour, pointillé, Retour) | **15 px** | **15 px** | 800 | 1,2 | normal | 25 |
| Lien texte | Action écrite sans forme de bouton et sans état choisi, qui agit ou mène ailleurs une fois (« Tout voir », « Revoir la leçon », « Passer cette étape », « Voir comme un élève ») | 15 px | 15 px | **700** | 1,2 | normal | 16 |
| Navigation | Option qui reste marquée comme choisie, dont le choix change ce qu'on voit (écran, vue, filtre) sans agir sur les données (barre d'onglets, onglets « Écrire / Aperçu », filtres, entrées de menu qui mènent à un écran ou à une vue et restent marquées comme choisies, repère d'étapes) | 14 px | 14 px | 700 | 1,2 | normal | 6 |
| Libellé de champ | Nomme un champ de formulaire | 14 px | 14 px | **600** | 1,2 | normal | 4 |
| Saisie et choix | Texte tapé ou choisi par l'utilisateur. 16 px est une contrainte technique : Safari sur iOS agrandit la page quand on touche un champ dont le texte fait moins de 16 px | 16 px | 16 px | 600 | 1,2 | normal | 18 |
| Pastille | Texte d'une pastille, numéros dans une pastille ronde compris | 13 px | 13 px | 800 | 1,2 | normal | 24 |
| Chiffre mis en avant, standard | Nombre sujet d'un bloc : le bloc existe pour le montrer (carte de statistique, taux de complétion) | 28 px | 28 px | 800 | 1 | normal | 3 |
| Chiffre mis en avant, grand | Nombre sujet de l'écran entier : l'écran existe pour le montrer (score de fin de quiz, en pourcentage) | 48 px | 48 px | 800 | 1 | normal | 1 |
| Compteur | Nombre qui n'est pas le sujet de son bloc : position, avancement, total ou gain qui accompagne le sujet du bloc (« 3 / 5 » d'un quiz, XP de l'en-tête, pourcentage de l'anneau, « +15 XP ») | **15 px** | **15 px** | 800 | 1,2 | normal | 9 |

En gras : valeurs qui changent par rapport à la version 2 (Saisie et choix revient à 16 px par décision finale ; Compteur passe à 15 px depuis que l'XP du dashboard y est rattaché). Navigation garde la valeur de la version 2 (14 px · 700 · 1,2) depuis que « Se déconnecter » et les actions du menu « … » sont passés en Lien texte.

**Chiffre mis en avant ou Compteur : test binaire.** Si le nombre est le sujet du bloc (le bloc existe pour le montrer), c'est un Chiffre mis en avant. Sinon, c'est un Compteur : position, avancement, total ou gain qui accompagne le sujet du bloc. Un nombre a un rôle et un seul ; la forme du nombre (pourcentage, fraction, entier) ne décide jamais.

Vérification des éléments rattachés aux deux rôles :

| Élément | Rôle | Sujet du bloc | Conforme au test ? |
|---|---|---|---|
| Taux de complétion (Dashboard formateur) | Chiffre mis en avant, standard | le taux lui-même | oui |
| Chiffre des petites cartes d'avancement (Détail cours) | Chiffre mis en avant, standard | chaque petite carte montre une statistique | oui |
| Chiffre des cartes du dashboard admin | Chiffre mis en avant, standard | chaque carte montre une statistique | oui |
| Score de fin de quiz, en pourcentage (« 80 % ») | Chiffre mis en avant, grand | l'écran entier : il existe pour montrer le résultat | oui |
| Compteur « 2 / 5 » du parcours | Compteur | la question en cours | oui |
| Compteur « 3 / 5 » du quiz | Compteur | la question en cours | oui |
| Compteur « X / 3 » du quiz flash verrouillé (et sa petite variante) | Compteur | le déblocage du quiz flash | oui |
| Compteur « X/6 » de la modale Mes badges | Compteur | la collection de badges | oui |
| % de la barre d'un groupe (Dashboard formateur) | Compteur | le groupe | oui |
| « [N] XP » de l'en-tête (Dashboard apprenant) | Compteur | l'élève et son tableau de bord | oui |
| Pourcentage de l'anneau (Dashboard apprenant) | Compteur | le cours en cours | oui |
| « +15 XP » du toast de complétion | Compteur | la complétion (checklist, cours), que ce gain accompagne | oui |

**Lien texte ou Navigation : critère de choix.** Navigation : une option reste marquée comme choisie, et le choix change ce qu'on voit (écran, vue, filtre) sans agir sur les données. Lien texte : une action écrite sans forme de bouton, sans état choisi, qui agit ou mène ailleurs une fois. L'option choisie d'une Navigation suit la règle des états (section 4).

**Entrées de menu** : seules celles qui mènent à un écran ou à une vue et restent marquées comme choisies sont des Navigations. Les entrées qui agissent (« Se déconnecter », actions du menu « … » de l'espace formateur) sont des Liens texte.

Vérification des éléments rattachés aux deux rôles :

| Élément | Rôle | État choisi ? | Effet | Conforme au critère ? |
|---|---|---|---|---|
| Entrées de la barre d'onglets et de la barre horizontale | Navigation | oui (entrée active) | change d'écran | oui |
| Onglets « Écrire / Aperçu » (Création de cours) | Navigation | oui | change de vue | oui |
| Pastilles de filtre « Tout / Commencés / Terminés » (Dashboard formateur) | Navigation | oui | filtre la liste | oui |
| Pastilles de section collantes (Création de cours, sous 1024 px) | Navigation | oui (section visible) | fait défiler jusqu'à la section | oui |
| Entrées du sommaire (Création de cours, à partir de 1024 px) | Navigation | oui (section visible) | fait défiler jusqu'à la section | oui |
| Libellés du repère d'étapes (Fiche) | Navigation | oui (étape en cours) | change d'étape | oui |
| « Se déconnecter » (menu de la navigation) | Lien texte (déplacé depuis Navigation) | non | agit une fois (ferme la session) | oui |
| Actions du menu « … » de l'espace formateur (« Relancer par email », « Retirer du groupe », « Supprimer… ») | Lien texte (déplacé depuis Navigation) | non | agissent sur les données | oui |
| « Tout voir », « Voir les N autres », « Voir plus », « Mes badges · X/6 » | Lien texte | non | mène ailleurs ou déplie une fois | oui |
| « Revoir la leçon », « Revoir mes erreurs », « Passer cette étape », « Passer » (Introduction) | Lien texte | non | mène ailleurs ou agit une fois | oui |
| « Quitter l'aperçu », « Assigner », « Voir comme un élève », « Créer un groupe », lien sous le bouton du parcours, « Simuler l'ouverture du lien » | Lien texte | non | agit ou mène ailleurs une fois | oui |
| Libellé de Retour encore écrit sans forme de bouton (Création de cours, voir ci-dessous) | Lien texte | non | mène ailleurs une fois | oui pour le critère b ; dérive à corriger vers la variante Retour |

**Libellé du bouton Retour : rôle Bouton.** La variante Retour (pilule blanche, padding, zone de 44 px) a une forme de bouton, et Lien texte est défini comme une action sans forme de bouton. Vérification dans le code :

| Élément | Forme dans le code | Rôle |
|---|---|---|
| Retour « Cours » du Détail thème (`.theme-retour`, `DetailTheme.css`) | pilule blanche, 44 px, padding 12 / 18 px, chevron 18 px | **Bouton** (déplacé depuis Lien texte) |
| Retour de la fiche, nom court du thème (`.fiche-retour`, `FicheCours.css`) | pilule blanche, 44 px, padding 12 / 18 px, chevron 18 px | **Bouton** (déplacé depuis Lien texte) |
| Retour de Création de cours, « Mes cours » / « Détail du cours » (`.cc-retour`, `CreationCours.css`) | rond blanc de 44 px suivi du texte, sans pilule | reste Lien texte ; **dérive** à corriger vers la variante (étape écrans) |
| Retour de l'espace formateur, « Mes cours » / « Mes groupes » (`.fm-retour`, `Formateur.css`) | pilule blanche, 44 px, padding 0 / 20 / 0 / 12 px, chevron 18 px (chevron seul sous 768 px) | **Bouton** (déplacé depuis Lien texte, lot 8) |
| Retour « Connexion » de Mot de passe oublié (`.lien-retour`, `shared.css`) | variante Retour (pilule blanche, 44 px, chevron), lot 7 | **Bouton** (déplacé depuis Lien texte) |

**Écart de source : origin/main et design-system.** Le relevé a été fait sur origin/main (prod). Chaque élément a été comparé à son rendu sur design-system (corrections de la session 6 : variante Retour, « Annuler » en bouton secondaire, Modale de confirmation, Menu d'actions, focus). Différences :

| Élément | origin/main | design-system | Effet sur la proposition |
|---|---|---|---|
| « Annuler » (modale de confirmation, modales Nouveau groupe, Insérer une vidéo, Assigner des cours / à des groupes, barre d'enregistrement de Création de cours) | lien texte `.fm-lien-action`, 16 px · 800 | bouton secondaire `.bouton-secondaire`, 16 px · 700 | **rattachement corrigé** : Lien texte → Bouton (décision déjà écrite dans la doc du DS : « Annuler » est un bouton secondaire). Rendu actuel pris sur design-system ; le changement reste discret (16 → 15 px, 700 → 800). |
| Titre, sous-titre et texte de la Modale ; bouton rouge de la Modale de confirmation | `.fm-modale-titres h2` 24 px · 800, `.fm-modale-titres p` 15 px, `.fm-texte` 15 px · 1,45, `.fm-bouton-danger` 16 px · 800 | `.modale-titres h2`, `.modale-titres p`, `.modale-texte`, `.modale-bouton-danger` (`src/components/Modale.css`), mêmes valeurs | aucun (composant déplacé, valeurs identiques) |
| Variante Retour (Détail thème, fiche) | padding 12 / 18 px | padding 12 / 20 px | aucun (espacement, pas typographie) |
| Menu d'actions, focus des boutons et de la Modale | | comportement clavier et contour de focus | aucun (pas de propriété typographique) |

Aucun autre élément du relevé ne diffère. Aucun cas ne demande de nouvelle décision. La page /design-system, qui n'existe que sur design-system, reste hors relevé.

**Titre de section ou Titre de carte (décision 19, remplace la définition de la décision 15).**
- Titre de section : le titre nomme une partie de la page ou du contenu, il annonce ce qui suit (section de page, intertitre de leçon, titre Markdown, modale, feuille de menu). Exemples : « De ton formateur », « Taux de complétion », intertitres de leçon, « À retenir ».
- Titre de carte : le titre nomme ce que la carte présente (un objet, une action : un cours, un thème, un groupe, un badge, ce qu'on va faire), ou dit où l'on en est (« Raté, mais tu vas retenir ça », « Tu as fini les 12 cours »). En dessous, une explication ou une information. Exemples : « X étapes sur N », carte de thème.
- Titre mis en avant (décision 28) : titre de la carte qui porte l'action principale de l'écran. Au plus une par écran ; sur le dashboard apprenant, le bloc de tête, quelle que soit sa variante ; aucun sur un écran qui propose plusieurs choix de même poids. La carte porte une seule action, son bouton principal. Une carte qui regroupe plusieurs actions garde son rôle (exemple : « Pour bien démarrer »). Exemples : bloc de tête du dashboard apprenant (A, B en tête, C, E), « Étape suivante », « Suite du thème ».
- Test : le titre est-il le nom d'une chose (Titre de carte) ou le nom d'une partie (Titre de section) ?
- Carte ou ligne (décision 27) : Un élément posé directement sur la page est une carte (Titre de carte). Un élément répété à l'intérieur d'une carte ou d'une modale est une ligne (Titre de ligne), même s'il a un fond. « Tes groupes » (dashboard formateur) et les tuiles de la modale Mes badges sont des lignes (Titre de ligne) ; les cartes de cours assigné du Détail groupe, posées sur la page, sont des cartes (Titre de carte). Le nom du badge dans le toast reste en Pastille.
- Surfaces entières : Une modale ou une feuille de menu prend le Titre de section, quel que soit son texte : elle tient la place d'un écran. Le test du nom vaut pour les cartes et les parties de page.

« À retenir » (fiche, aperçu de Création, Détail cours) est un Titre de section : il ne nomme aucun objet, il annonce les points qui suivent, comme un intertitre (décision 20).

Test appliqué à tous les éléments des deux rôles (« À retenir » déplacé vers le Titre de section ; titre du bloc de tête et « Quiz flash » du bloc E venus du Titre de contenu, décision 25) :

| Élément | Rôle | Nom d'une chose ou d'une partie ? | Conforme ? |
|---|---|---|---|
| h2 par défaut des pages avec navigation | Titre de section | partie | oui |
| Titres Markdown (niveaux 1 à 3) et intertitres de la leçon | Titre de section | partie | oui |
| « De ton formateur » | Titre de section | partie | oui |
| Titres des cartes de section de l'espace formateur (« Élèves », « Avancement des élèves », sections Leçon / QCM / Checklist du Détail cours) | Titre de section | partie | oui |
| « Tes groupes », « Élèves à relancer », « Cours les plus suivis », « Activité récente », « Taux de complétion », « Pour bien démarrer » | Titre de section | partie | oui |
| « Cours assignés » (Détail groupe) | Titre de section | partie | oui |
| Cartes de Création de cours (Infos, Leçon, QCM, Checklist terrain) | Titre de section | partie | oui |
| « Thèmes », « N résultats » (Cours) | Titre de section | partie | oui |
| « Mes badges » (modale) | Titre de section | partie (la collection) | oui |
| « À retenir » (fiche, aperçu, Détail cours) | Titre de section | partie | oui (décision 20) |
| Titre de la feuille du menu « … » (mobile) | Titre de section | surface entière (la feuille porte le nom de l'élément) | oui : une feuille de menu prend le Titre de section quel que soit son texte (décision 23) |
| Titres des modales (« Nouveau groupe », « Assigner des cours », « Supprimer ce groupe ? »…) | Titre de section | surface entière (le titre nomme ce qu'on va faire) | oui : une modale prend le Titre de section quel que soit son texte (décision 23) |
| Titre de la carte « Étape suivante », titre du cours suivant (« Suite du thème ») | Titre mis en avant | action principale de l'écran | oui (décision 28) |
| « X étapes sur N » | Titre de carte | chose ou action | oui |
| Nom du badge débloqué, carte de thème, carte de cours (Mes cours), carte de groupe (Mes groupes), cartes de profil (« Apprendre », « Former mes élèves ») | Titre de carte | chose ou action | oui |
| « Quiz flash » (bloc en ligne, verrouillé, vertical) | Titre de carte | chose | oui |
| « Quiz flash » du bloc de tête E, titre du bloc de tête du dashboard apprenant (cours en cours, assigné, cours conseillé en tête) | Titre mis en avant | action principale de l'écran (bloc de tête) | oui (décision 28, remplace la décision 25) |
| Titre du toast de complétion (« Checklist terminée »…) | Titre de carte | chose (ce qui vient d'être terminé) | oui |
| Titre de carte blanche ou lavande du dashboard apprenant | Titre de carte | chose (le cours conseillé, le prochain badge) ; pour la bibliothèque terminée, où l'on en est (« Tu as fini les N cours ») | oui (décision 24) |
| Titre du bloc de correction du quiz (« Bien vu », « Raté, mais tu vas retenir ça ») | Titre de carte | où l'on en est, avec l'explication en dessous | oui (décision 24) |

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

### 1.2 Titre de carte : un seul niveau ; niveaux de Chiffre mis en avant

**Titre de carte : un seul niveau, 18 px · 800 · 1,2 (décision 14).** Le niveau grand (22 px · 800 · 1,1) est supprimé : aucun critère de fonction ne le tenait. Ses raisons reposaient sur la place de la carte, sur sa couleur ou sur la taille actuelle. Ce n'est pas une fusion de rôles : le grand niveau était un palier créé pour limiter les changements, pas un rôle. Les 9 éléments qu'il portait sont rattachés au Titre de carte. Sur les 17 éléments du rôle (après les décisions 25 et 27), 18 px · 800 · 1,2 donne 13 changements visibles : c'est le minimum parmi les valeurs de l'échelle qu'aucun autre rôle de titre ne porte. 21 px · 800 · 1,2 en donnerait moins (8), mais c'est la valeur du Titre de section : deux rôles de titre ne prennent jamais la même valeur (décision 26). Après la décision 28, le rôle compte 13 éléments (titre du bloc de tête, « Quiz flash » du bloc E, « Étape suivante » et « Suite du thème » partent au Titre mis en avant) : 18 px · 800 · 1,2 donne 9 changements visibles, toujours le minimum permis (17 px en donnerait 10 ; 21, 24 et 28 px sont des valeurs d'autres rôles de titre).

Trace des raisons de l'ancien niveau grand, relevées avant la décision. Deux formules faisaient décider à l'œil ou par la couleur : (A) « la carte la plus visible de l'écran » et (B) une raison de couleur (cartes encre).

| Élément de l'ancien niveau grand | Raison écrite alors | Tenait seulement par (A) ou (B) ? |
|---|---|---|
| Titre de carte blanche ou lavande du dashboard apprenant (premier cours / prochain cours conseillé, prochain badge, bibliothèque terminée) | « tous à 22 px » : aucune raison de fonction, seulement la taille actuelle | non, mais ne tient que par la taille actuelle, ce que la règle de rattachement exclut |
| Titre de la carte « Étape suivante » (fiche) | « tous à 22 px » ; raison de couleur (carte encre) | par (B) et par la taille actuelle |
| Nom du badge débloqué (fin de quiz) | « tous à 22 px » ; raison de couleur (carte encre) | par (B) et par la taille actuelle |
| Titre de la carte « Suite du thème » (récap) | « tous à 22 px » ; la carte était à tort rangée avec les cartes encre (c'est une carte violette) | par la taille actuelle |
| Nom de la carte de groupe (Mes groupes) | « déjà à 22 px sur desktop, et c'est la valeur que décrit CLAUDE.md » | non, mais ne tient que par la taille actuelle et par CLAUDE.md |
| Titre de la carte de profil (Choix du profil) | « deux grandes cartes qui occupent l'écran à elles seules » | non : la raison porte sur la place de la carte dans l'écran |
| « X étapes sur N » (Checklist) | « l'élément le plus visible de l'écran après le titre » ; « 2 px du grand niveau comme du standard » | **oui, par (A)** |
| Titre du bloc de correction du quiz (« Bien vu ») | raison de couleur (la carte est encre, comme « Étape suivante ») | **oui, par (B)** |
| « Quiz flash » vertical (dashboard apprenant, desktop, colonne étroite) | « seul titre d'une carte haute, plus proche du grand niveau » | non, mais la seconde moitié de la raison est la taille actuelle (28 px) |

Éléments du Titre de carte avant la décision (ancien niveau standard) : titres « À retenir » (fiche et Détail cours), « Quiz flash » verrouillé, carte de thème (15 / 18 px), carte de cours de Mes cours (18 px), titre du toast, « Quiz flash » du bloc en ligne (19 px).

**Chiffre mis en avant, standard ou grand : critère (décision 17).** Grand : le nombre est le sujet de l'écran entier (l'écran existe pour le montrer). Standard : le nombre est le sujet d'un bloc. Grand (48 px) : score de fin de quiz, en pourcentage depuis la décision 18 (le « 4/5 » est retiré de cet écran).

**Chiffre mis en avant, standard (28 px)** : taux de complétion, chiffre des petites cartes d'avancement (Détail cours). Cas limites : chiffre des cartes du dashboard admin (36 px) reste au standard, c'est le chiffre principal d'une carte de statistiques comme le taux de complétion ; l'XP de l'en-tête et le pourcentage de l'anneau du dashboard apprenant sont rattachés au Compteur (décisions finales 3 et 8).

### 1.3 Texte de lecture et Corps courant

Texte de lecture : texte de la leçon (`.fiche-lecon-contenu`, la même règle sert à l'aperçu de Création de cours) et premier paragraphe de la leçon dans le Détail cours. Les deux éléments sont à égalité (17 / 18 px et 16 px, tous deux à 1,55) ; la valeur retenue est celle de la leçon, pour laquelle le rôle existe. Cas limite : le paragraphe du Détail cours est la leçon montrée au formateur, je le rattache au Texte de lecture plutôt qu'au Corps courant.

Corps courant : 15 px · 500 · 1,45, imposé. C'est déjà la combinaison la plus fréquente du rôle (texte courant de l'espace formateur, explication de la correction du quiz).

### 1.4 Décisions particulières

- **En-têtes compacts** (rattachement de la version 2, inchangé) : l'en-tête compact de Création de cours (20 px, sous 1024 px) et celui de la checklist (15 px) prennent le rôle **Titre de ligne** (16 px · 800 · 1,2 en version 3). Fonction : rappeler sur une ligne tronquée le titre d'un contenu dont le titre complet est ailleurs. Avec la valeur de la version 3, la checklist change de façon discrète (+1 px) et l'en-tête de Création de façon visible (−4 px). Le seuil 1024 reste un seuil de mise en page : sous 1024 px l'en-tête compact (Titre de ligne), à partir de 1024 px l'en-tête desktop (Titre de page, 44 px, inchangé).
- **Repère d'étapes** : rattaché à Navigation (il était dans Méta dans l'audit) : ses libellés sont des liens entre les étapes du cours, et leur taille (14 px) est celle du rôle.
- **Italique (décision 7)** : vérifié sur l'API Google Fonts (`css2`) le 2026-11-04 : **Urbanist existe en italique, de 100 à 900**. Graisse à charger : **italique 500** (graisse du Texte de lecture et du Corps courant, où l'italique Markdown apparaît). Le chargement n'est pas modifié ici.
- **Caractères hors typographie (décision 8)**, à remplacer par une icône SVG :

| Caractère | Où | Rendu actuel |
|---|---|---|
| × | bouton de fermeture de la modale Mes badges (`Dashboard.jsx:709`, `.modal-fermer`) | Arial 22,4 px (famille non déclarée sur un bouton) |
| ↑ ↓ | boutons Monter / Descendre de la remise en ordre (`EcranChecklist.jsx:81, 90`, `.fiche-etape-fleche`) | Arial 16 px (même raison) |
| ▲ ▼ | sens du tri des colonnes XP et Badges (`DetailGroupe.jsx:263`, `.dg-tri span`, desktop) | 10 px ; Urbanist ne contient pas ces caractères, le navigateur les prend dans une police de secours |

## 2. Échelle de tailles

13 tailles en px entiers. Chacune sert au moins un rôle. 22 px est sorti avec le niveau grand du Titre de carte (décision 14) ; 24 px est entré avec le Titre mis en avant (décision 28).

| Taille | rem | Rôles |
|---|---|---|
| 13 px | 0,8125 rem | Méta, Surtitre, Pastille |
| 14 px | 0,875 rem | Texte secondaire, Navigation, Libellé de champ |
| 15 px | 0,9375 rem | Corps courant, Bouton, Lien texte, Compteur |
| 16 px | 1 rem | Titre de ligne, Saisie et choix |
| 17 px | 1,0625 rem | Texte de lecture (mobile) |
| 18 px | 1,125 rem | Titre de carte, Texte de lecture (desktop) |
| 21 px | 1,3125 rem | Titre de section |
| 24 px | 1,5 rem | Titre mis en avant (mobile) |
| 28 px | 1,75 rem | Titre de contenu (mobile), Titre mis en avant (desktop), Chiffre mis en avant standard |
| 32 px | 2 rem | Titre de contenu (desktop) |
| 34 px | 2,125 rem | Titre de page (mobile) |
| 44 px | 2,75 rem | Titre de page (desktop) |
| 48 px | 3 rem | Chiffre mis en avant grand |

Pas de taille intermédiaire absente de la prod (27 px pour Titre de contenu, refusé). 21 px est dans l'échelle, mais il est refusé au Titre de carte (ancien niveau grand compris) : c'est la valeur du Titre de section, et deux rôles de titre ne prennent jamais la même valeur (décision 26). Les 21 px du Titre de section restent : c'est une taille de la prod (intertitre de la leçon, titre de la modale Mes badges). 24 px n'est porté par aucun élément du Titre mis en avant en prod (26 / 32, 34 et 22 px) : c'est une valeur fixée par la décision 28, comme celles du Corps courant et du Texte de lecture.

Par rapport à la version 2 : 20 px sort, 21 px entre. 15 px est la taille la plus partagée (quatre rôles). Quatre rôles changent de taille à 768 px : Titre de page, Titre de contenu, Titre mis en avant, Texte de lecture.

## 3. Impact

### 3.1 Totaux

| | Identique | Discret | Visible | Changent (discret + visible) |
|---|---|---|---|---|
| Version 2, reclassée avec le critère de la version 3 | 83 | 117 | 75 | 192 |
| Version 3 avant décisions finales | 55 | 179 | 41 | 220 |
| Version 3 validée (6a91be6) | 57 | 178 | 40 | 218 |
| Version 3 validée, Retour en Bouton (5013177) | 59 | 176 | 40 | 216 |
| Version 3 validée, menus en Lien texte (e0d6582) | 59 | 176 | 40 | 216 |
| Version 3 validée, option choisie de Navigation comptée (1cfa572) | 57 | 178 | 40 | 218 |
| Version 3 validée, rendu de design-system (d9b1258) | 57 | 178 | 40 | 218 |
| Version 3 validée, Titre de carte à un seul niveau (7a02b1c) | 54 | 177 | 44 | 221 |
| Version 3 validée, « De ton formateur » en Titre de section, fin de quiz en pourcentage (db30521) | 53 | 176 | 45 | 221 |
| Version 3 validée, « À retenir » en Titre de section | 53 | 174 | 47 | 221 |
| Version 3 validée, bloc de tête du dashboard apprenant en Titre de carte | 53 | 174 | 47 | 221 |
| Version 3 validée, cartes de cours assigné du Détail groupe en Titre de carte | 53 | 173 | 48 | 221 |
| Version 3 validée, conditions de badge, sous-titre d'étape et critère en Texte secondaire, titre de la barre de fin de quiz en Titre de ligne | 52 | 173 | 49 | 222 |
| Version 3 validée, description de la carte de profil en Texte secondaire | 52 | 173 | 49 | 222 |
| Version 3 validée, « Supprimer ce groupe » en Bouton | 53 | 172 | 49 | 221 |
| Version 3 validée, Retours de l'espace formateur et de Mot de passe oublié en Bouton | 54 | 170 | 50 | 220 |
| Version 3 validée, en-têtes du tableau des élèves en Corps courant fort | 54 | 170 | 50 | 220 |
| Version 3 validée, Titre mis en avant (décision 28) | 54 | 170 | 50 | 220 |
| **Version 3 validée, en-têtes du tableau du dashboard admin en Corps courant fort** | **54** | **169** | **51** | **220** |

Sur 275 éléments jusqu'à la ligne 7a02b1c, 274 à partir de la ligne db30521 : l'élément « 80 % » sous le score de fin de quiz n'existe plus (décision 18). Les 51 changements visibles sont acceptés comme dérives à corriger (section 10, décisions 7, 14, 16 et 20). Les deux libellés de Retour passés en Bouton deviennent identiques (15 px · 800 en prod comme dans le rôle) ; les valeurs des rôles Bouton et Lien texte ne changent pas. Le passage de « Se déconnecter » et des actions du menu « … » en Lien texte laisse les totaux identiques (deux changements discrets dans les deux cas) mais ramène Navigation à 14 px. Enfin, l'option choisie d'une Navigation passe à 800 (un cran, changement discret) : chaque élément de Navigation qui a un état choisi est compté comme changé. Les 6 éléments de Navigation sont concernés ; deux d'entre eux, identiques jusque-là (pastilles de filtre du dashboard formateur, onglets « Écrire / Aperçu »), deviennent discrets. « Annuler », passé en Bouton d'après son rendu sur design-system, reste un changement discret : les totaux ne bougent pas. La suppression du niveau grand du Titre de carte fait passer 4 éléments au changement visible : trois identiques à 22 px (« Étape suivante », nom du badge débloqué, « Suite du thème ») et un discret (titre de carte blanche ou lavande du dashboard apprenant, 22 px). Les 5 autres éléments de l'ancien niveau grand étaient déjà visibles. Dernière mise à jour : « De ton formateur » passe du Titre de carte (18 px, identique) au Titre de section (21 px, visible, +3 px) ; l'élément « 80 % » (Compteur, discret) disparaît ; le score de fin de quiz, désormais en pourcentage, garde l'élément à 48 px · 800 · 1 (identique). Les valeurs des rôles ne changent pas. Enfin, les deux titres « À retenir » (fiche et aperçu, Détail cours) passent du Titre de carte (18 px, discret depuis 17 px) au Titre de section (21 px, visible, +4 px). Enfin, le titre du bloc de tête du dashboard apprenant et « Quiz flash » du bloc E passent du Titre de contenu (28 / 32 px) au Titre de carte (18 px) (décision 25) : ils étaient déjà des changements visibles et le restent, avec un écart plus grand (titre du bloc de tête 26 / 32 → 18 px, 14 px ; « Quiz flash » 34 → 18 px, 16 px). Les totaux ne bougent pas ; Titre de contenu passe à 4 éléments, Titre de carte à 16. Les valeurs des rôles ne changent pas : Titre de contenu garde 28 / 32 px (ses deux éléments identiques le restent), Titre de carte garde 18 px (décisions 14, 21 et 26 ; parmi les valeurs de l'échelle qu'aucun autre rôle de titre ne porte, 18 px reste celle qui donne le moins de changements visibles). Enfin, le titre de la carte de cours assigné (Détail groupe) passe du Titre de ligne (16 px, discret depuis 15 px) au Titre de carte (18 px, visible, +3 px) : la carte est posée directement sur la page (décision 27). Totaux : 53 identiques, 173 discrets, 48 visibles. Enfin, quatre phrases qui accompagnent un titre passent de Méta (13 px · 600) à Texte secondaire (14 px · 600), selon la définition du rôle : condition du badge de la modale Mes badges (13 px · 500, reste discret), condition du badge de la carte « Nouveau badge » de fin de quiz, sous-titre d'étape de « Pour bien démarrer » et critère de validation de la checklist (14 px · 500 tous trois, restent discrets, la taille ne bouge plus) ; et le titre du cours dans la barre du haut de fin de quiz passe du Surtitre (13 px · 700, identique) au Titre de ligne (16 px · 800, visible, +3 px et un cran), même fonction que l'en-tête compact de la checklist. Les valeurs des rôles ne changent pas. Totaux : 52 identiques, 173 discrets, 49 visibles. Enfin, la description de la carte de profil (Choix du profil) passe de Méta (13 px · 600) à Texte secondaire (14 px · 600) : c'est une phrase qui accompagne un titre. Depuis le rendu (14 px · 500 · 1,35), le changement reste discret (graisse un cran, hauteur de ligne). Totaux inchangés : 52 identiques, 173 discrets, 49 visibles. Enfin, « Supprimer ce groupe » (Détail groupe, `.fm-bouton-texte-danger`) passe du Lien texte (15 px · 700, discret) au Bouton (15 px · 800, identique) : sur design-system, il a une forme de bouton (contour `bordure-erreur` de 2 px, pilule, 44 px), et la forme départage Bouton et Lien texte (section 1, « Bouton ou Lien texte »). Totaux : 53 identiques, 172 discrets, 49 visibles. Enfin, les Retours de l'espace formateur (`.fm-retour`) et de Mot de passe oublié (`.lien-retour`) ont pris la forme de la variante Retour (lots 7 et 8) et passent du Lien texte au Bouton (décision 12) : celui de l'espace formateur devient identique (15 px · 800 en prod comme dans le rôle), celui de Mot de passe oublié devient visible (13,6 px · 600 → 15 px · 800, deux crans de graisse). Seul le Retour de Création de cours reste en Lien texte. Totaux : 54 identiques, 170 discrets, 50 visibles. Enfin, les en-têtes de colonne du tableau des élèves (Détail groupe, desktop) passent du Méta (13 px · 600) au Corps courant fort (15 px · 600 · 1,45), selon la règle du `th` (rôle du tableau, en variante `-fort` ; les cellules sont en Corps courant). Le changement reste visible, avec un nouvel écart (2 px et deux crans de graisse au lieu de 0 px et deux crans). Méta passe à 39 éléments, Corps courant à 18. Totaux inchangés : 54 identiques, 170 discrets, 50 visibles. Enfin, le Titre mis en avant (24 / 28 px · 800 · 1,2, décision 28) reçoit quatre éléments du Titre de carte : titre du bloc de tête du dashboard apprenant (26 / 32 px), « Quiz flash » du bloc E (34 px), titre de la carte « Étape suivante » et titre du cours suivant de « Suite du thème » (22 px). Les quatre restent des changements visibles, avec un écart plus petit (4, 10, 6 et 6 px au lieu de 14, 16, 4 et 4 px). Titre de carte passe à 13 éléments (9 visibles). Totaux inchangés : 54 identiques, 170 discrets, 50 visibles. Enfin, les en-têtes de colonne du tableau du dashboard admin (desktop) passent du Méta (13 px · 600) au Corps courant fort (15 px · 600 · 1,45), selon la règle du `th` (rôle du tableau, en variante `-fort` ; les cellules sont en Corps courant), comme ceux du tableau des élèves. Depuis le rendu (13 px · 700 · 1,2), le changement devient visible (2 px, un cran de graisse) au lieu de discret (0 px, un cran). Méta passe à 38 éléments, Corps courant à 19. Totaux : 54 identiques, 169 discrets, 51 visibles.

| Rôle | Valeur v3 avant décisions | Valeur finale | Éléments | Identique | Discret | Visible |
|---|---|---|---|---|---|---|
| Titre de page | 34 / 44 px · 800 · 1,1 | 34 / 44 px · 800 · 1,1 | 9 | 5 | 2 | 2 |
| Titre de contenu | 28 / 32 px · 800 · 1,1 | 28 / 32 px · 800 · 1,1 | 4 | 2 | 0 | 2 |
| Titre mis en avant | — (nouveau rôle, décision 28) | 24 / 28 px · 800 · 1,2 | 4 | 0 | 0 | 4 |
| Titre de section | 21 px · 800 · 1,2 | 21 px · 800 · 1,2 | 19 | 0 | 10 | 9 |
| Titre de carte | 18 px · 800 · 1,2 | 18 px · 800 · 1,2 | 13 | 1 | 3 | 9 |
| Titre de ligne | 16 px · 800 · 1,2 | 16 px · 800 · 1,2 | 17 | 5 | 10 | 2 |
| Texte de lecture | 17 / 18 px · 500 · 1,55 | 17 / 18 px · 500 · 1,55 | 2 | 1 | 0 | 1 |
| Corps courant | 15 px · 500 · 1,45 | 15 px · 500 · 1,45 | 19 | 2 | 13 | 4 |
| Texte secondaire | 14 px · 600 · 1,2 | 14 px · 600 · 1,2 | 32 | 2 | 28 | 2 |
| Méta | 13 px · 600 · 1,2 | 13 px · 600 · 1,2 | 38 | 7 | 31 | 0 |
| Surtitre | 13 px · 700 · 1,2 | 13 px · 700 · 1,2 | 11 | 8 | 2 | 1 |
| Bouton | 15 px · 800 · 1,2 | 15 px · 800 · 1,2 | 25 | 7 | 17 | 1 |
| Lien texte | 15 px · 700 · 1,2 | 15 px · 700 · 1,2 | 16 | 1 | 15 | 0 |
| Navigation | 15 px · 700 · 1,2 | 14 px · 700 · 1,2 **(changé)** | 6 | 0 | 6 | 0 |
| Libellé de champ | 14 px · 600 · 1,2 | 14 px · 600 · 1,2 | 4 | 0 | 3 | 1 |
| Saisie et choix | 15 px · 600 · 1,2 | 16 px · 600 · 1,2 **(changé)** | 18 | 3 | 11 | 4 |
| Pastille | 13 px · 800 · 1,2 | 13 px · 800 · 1,2 | 24 | 5 | 15 | 4 |
| Chiffre mis en avant (standard) | 28 px · 800 · 1 | 28 px · 800 · 1 | 3 | 2 | 0 | 1 |
| Chiffre mis en avant (grand) | 48 px · 800 · 1 | 48 px · 800 · 1 | 1 | 1 | 0 | 0 |
| Compteur | 14 px · 800 · 1,2 | 15 px · 800 · 1,2 **(changé)** | 9 | 2 | 3 | 4 |
| **Total** | | | **274** | **54** | **169** | **51** |

### 3.2 Changements visibles

Tous les changements visibles, du plus gros écart de taille au plus petit. Écart : taille (le plus grand des écarts mobile et desktop) · graisse.

| # | Rôle | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|---|
| 1 | Titre de page | Parcours : Création du compte | « Plus qu'une étape, [Prénom] » | 28 px · 800 · 1,1 | 34 / 44 px · 800 · 1,1 | 16 px · graisse 0 |
| 2 | Titre de page | Fin de quiz | titre « Belle maîtrise ! » | 30 px · 800 · 1,1 | 34 / 44 px · 800 · 1,1 | 14 px · graisse 0 |
| 3 | Titre de contenu | Détail cours | titre du cours (H1) : perd contre .espace-page h1 | 34 / 44 px · 800 · 1,1 | 28 / 32 px · 800 · 1,1 | 12 px · graisse 0 |
| 4 | Compteur | Dashboard apprenant | pourcentage dans l'anneau | 17 / 26 px · 800 · 1,2 | 15 px · 800 · 1,2 | 11 px · graisse 0 |
| 5 | Titre mis en avant | Dashboard apprenant | « Quiz flash » du bloc de tête E | 34 px · 800 · 1 · lettres -0,5 px | 24 / 28 px · 800 · 1,2 · lettres normales | 10 px · graisse 0 |
| 6 | Titre de carte | Dashboard apprenant (desktop, colonne étroite) | « Quiz flash » vertical | n/a / 28 px · 800 · 1 | n/a / 18 px · 800 · 1,2 | 10 px · graisse 0 |
| 7 | Titre de contenu | Fiche : quiz, Quiz flash | question | 24 px · 800 · 1,15 | 28 / 32 px · 800 · 1,1 | 8 px · graisse 0 |
| 8 | Chiffre mis en avant (standard) | Dashboard admin | chiffre de carte | 36 px · 800 · 1,1 | 28 px · 800 · 1 | 8 px · graisse 0 |
| 9 | Titre de section | Cours | titre de section (« Thèmes », « N résultats ») | 22 / 28 px · 800 · 1,2 | 21 px · 800 · 1,2 | 7 px · graisse 0 |
| 10 | Titre de section | Dashboard formateur | titre « Taux de complétion » | 14,4 px · 500 · 1,2 | 21 px · 800 · 1,2 | 6,6 px · graisse 3 crans |
| 11 | Titre mis en avant | Fiche : leçon, checklist | titre de la carte « Étape suivante » | 22 px · 800 · 1,1 | 24 / 28 px · 800 · 1,2 | 6 px · graisse 0 |
| 12 | Titre mis en avant | Récap | titre du cours suivant | 22 px · 800 · 1,1 | 24 / 28 px · 800 · 1,2 | 6 px · graisse 0 |
| 13 | Compteur | Dashboard apprenant | « [N] XP » de l'en-tête | 17 / 20 px · 800 · 1,2 | 15 px · 800 · 1,2 | 5 px · graisse 0 |
| 14 | Titre mis en avant | Dashboard apprenant | titre du bloc de tête (cours en cours, assigné, cours conseillé) | 26 / 32 px · 800 · 1,05 / 1,1 | 24 / 28 px · 800 · 1,2 | 4 px · graisse 0 |
| 15 | Saisie et choix | Parcours : questions | saisie du grand champ (prénom, organisme…) | 20 px · 700 · 1,2 | 16 px · 600 · 1,2 | 4 px · graisse 1 cran |
| 16 | Titre de section | Espace formateur (mobile) | titre de la feuille du menu « … » | 17 px · 800 · 1,2 | 21 px · 800 · 1,2 | 4 px · graisse 0 |
| 17 | Titre de carte | Fin de quiz | nom du badge débloqué | 22 px · 800 · 1,1 | 18 px · 800 · 1,2 | 4 px · graisse 0 |
| 18 | Titre de carte | Dashboard apprenant | titre de carte blanche / lavande | 22 px · 800 · 1,05 | 18 px · 800 · 1,2 | 4 px · graisse 0 |
| 19 | Titre de carte | Mes groupes | nom de la carte de groupe | 20 / 22 px · 800 · 1,2 | 18 px · 800 · 1,2 | 4 px · graisse 0 |
| 20 | Titre de ligne | Création de cours | H1 de l'en-tête compact (affiché sous 1024 px) | 20 px · 800 · 1,2 | 16 px · 800 · 1,2 | 4 px · graisse 0 |
| 21 | Titre de section | Détail cours | titre de l'encadré « À retenir » | 17 px · 800 · 1,2 | 21 px · 800 · 1,2 | 4 px · graisse 0 |
| 22 | Titre de section | Fiche : leçon (et aperçu Création, où il est écrasé) | titre de l'encadré « À retenir » | 17 px · 800 · 1,2 | 21 px · 800 · 1,2 | 4 px · graisse 0 |
| 23 | Compteur | Parcours : questions | compteur « 2 / 5 » | 18 px · 800 · 1,2 | 15 px · 800 · 1,2 | 3 px · graisse 0 |
| 24 | Titre de section | Espace formateur, Création de cours | titre de modale | 24 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
| 25 | Pastille | Détail cours | « +N » sur la dernière miniature | 16 px · 800 · 1,2 | 13 px · 800 · 1,2 | 3 px · graisse 0 |
| 26 | Titre de section | Fiche : leçon | intertitre H2 de la leçon | 21 / 24 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
| 27 | Pastille | Fin de quiz | pastille « +20 XP » | 16 px · 800 · 1,2 | 13 px · 800 · 1,2 | 3 px · graisse 0 |
| 28 | Compteur | Dashboard apprenant | compteur de barre, petite variante | 12 px · 800 · 1,2 | 15 px · 800 · 1,2 | 3 px · graisse 0 |
| 29 | Titre de section | Dashboard formateur : Pour bien démarrer | titre de la carte | 24 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
| 30 | Pastille | Dashboard formateur : Pour bien démarrer | numéro dans le rond | 16 px · 800 · 1,2 | 13 px · 800 · 1,2 | 3 px · graisse 0 |
| 31 | Titre de carte | Cours | titre de la carte de thème | 15 / 18 px · 800 · 1,2 | 18 px · 800 · 1,2 | 3 px · graisse 0 |
| 32 | Titre de carte | Détail groupe | titre de la carte de cours assigné | 15 px · 800 · 1,25 | 18 px · 800 · 1,2 | 3 px · graisse 0 |
| 33 | Titre de section | Dashboard apprenant, Cours | titre du bloc « De ton formateur » | 18 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
| 34 | Titre de ligne | Fin de quiz, Quiz flash | titre du cours dans la barre du haut | 13 px · 700 · 1,2 | 16 px · 800 · 1,2 | 3 px · graisse 1 cran |
| 35 | Corps courant | Fiche : checklist | intitulé de l'étape en cours | 17 px · 800 · 1,2 | 15 px · 500 · 1,45 | 2 px · graisse 3 crans |
| 36 | Texte secondaire | Parcours | sous-titre sous le H1 | 16 px · 500 · 1,2 | 14 px · 600 · 1,2 | 2 px · graisse 1 cran |
| 37 | Texte secondaire | Cours, Terrain | sous-titre de l'en-tête lavande | 14 / 16 px · 700 · 1,2 | 14 px · 600 · 1,2 | 2 px · graisse 1 cran |
| 38 | Texte de lecture | Détail cours | premier paragraphe de la leçon | 16 px · 500 · 1,55 | 17 / 18 px · 500 · 1,55 | 2 px · graisse 0 |
| 39 | Titre de carte | Fiche : quiz, Quiz flash | titre du bloc de correction (« Bien vu ») | 20 px · 800 · 1,2 | 18 px · 800 · 1,2 | 2 px · graisse 0 |
| 40 | Titre de carte | Fiche : checklist | « X étapes sur N » | 20 px · 800 · 1,2 | 18 px · 800 · 1,2 | 2 px · graisse 0 |
| 41 | Surtitre | Dashboard apprenant | libellé sur carte violette (« Tu en es là ») | 13 / 15 px · 700 · 1,2 | 13 px · 700 · 1,2 | 2 px · graisse 0 |
| 42 | Saisie et choix | Dashboard formateur | saisie « Un élève » | 14 px · 400 · 1,2 | 16 px · 600 · 1,2 | 2 px · graisse 400 → 600 |
| 43 | Pastille | Création de cours | lettre de réponse | 15 px · 800 · 1,2 | 13 px · 800 · 1,2 | 2 px · graisse 0 |
| 44 | Saisie et choix | Création de cours | saisie d'explication | 14 px · 400 · 1,2 | 16 px · 600 · 1,2 | 2 px · graisse 400 → 600 |
| 45 | Titre de carte | Parcours : Choix du profil | titre de la carte de profil | 20 px · 800 · 1,2 | 18 px · 800 · 1,2 | 2 px · graisse 0 |
| 46 | Corps courant | Détail groupe (desktop) | en-têtes de colonne du tableau des élèves (état) | n/a / 13 px · 800 · 1,2 | n/a / 15 px · 600 (état) · 1,45 | 2 px · graisse 2 crans |
| 47 | Corps courant | Dashboard admin (desktop) | en-têtes de colonne du tableau (état) | n/a / 13 px · 700 · 1,2 | n/a / 15 px · 600 (état) · 1,45 | 2 px · graisse 1 cran |
| 48 | Bouton | Mot de passe oublié | bouton Retour « Connexion » | 13,6 px · 600 · 1,2 | 15 px · 800 · 1,2 | 1,4 px · graisse 2 crans |
| 49 | Saisie et choix | Création de cours | libellé de mode de checklist | 15 px · 800 · 1,2 | 16 px · 600 · 1,2 | 1 px · graisse 2 crans |
| 50 | Libellé de champ | Parcours | libellé de champ | 14 px · 800 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 2 crans |
| 51 | Corps courant | Dashboard admin (desktop) | cellules chiffrées du tableau | n/a / 15 px · 700 · 1,2 | n/a / 15 px · 500 · 1,45 | 0 px · graisse 2 crans |

### 3.3 Détail par rôle

Seuls les éléments qui changent sont listés, visibles d'abord. Valeurs : taille (mobile / desktop si elles diffèrent) · graisse · hauteur de ligne. « n/a » : l'élément n'existe pas à cette largeur.

### Titre de page

9 éléments : 5 identiques, 2 discrets, 2 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Parcours : Création du compte | « Plus qu'une étape, [Prénom] » (`Parcours.css:192`) | 28 px · 800 · 1,1 | 34 / 44 px · 800 · 1,1 | 16 px · graisse 0 |
| visible | Fin de quiz | titre « Belle maîtrise ! » (`FicheCours.css:809`) | 30 px · 800 · 1,1 | 34 / 44 px · 800 · 1,1 | 14 px · graisse 0 |
| discret | Dashboard apprenant | « Salut [Prénom] » (H1) (`Dashboard.css:21`) | 34 / 44 px · 800 · 1 · lettres -0,5 / -0,8 px | 34 / 44 px · 800 · 1,1 · lettres normales | 0 px · graisse 0 |
| discret | Dashboard formateur, admin | « Bonjour [prénom] » (H1) (`DashboardFormateur.css:30`) | 34 / 44 px · 800 · 1,2 | 34 / 44 px · 800 · 1,1 | 0 px · graisse 0 |

### Titre de contenu

4 éléments : 2 identiques, 0 discrets, 2 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Détail cours | titre du cours (H1) : perd contre .espace-page h1 (`DetailCoursFormateur.css:25`) | 34 / 44 px · 800 · 1,1 | 28 / 32 px · 800 · 1,1 | 12 px · graisse 0 |
| visible | Fiche : quiz, Quiz flash | question (`FicheCours.css:432`) | 24 px · 800 · 1,15 | 28 / 32 px · 800 · 1,1 | 8 px · graisse 0 |

### Titre mis en avant

4 éléments : 0 identiques, 0 discrets, 4 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Dashboard apprenant | « Quiz flash » du bloc de tête E (`Dashboard.css:440`) | 34 px · 800 · 1 · lettres -0,5 px | 24 / 28 px · 800 · 1,2 · lettres normales | 10 px · graisse 0 |
| visible | Fiche : leçon, checklist | titre de la carte « Étape suivante » (`FicheCours.css:351`) | 22 px · 800 · 1,1 | 24 / 28 px · 800 · 1,2 | 6 px · graisse 0 |
| visible | Récap | titre du cours suivant (`FicheCours.css:1346`) | 22 px · 800 · 1,1 | 24 / 28 px · 800 · 1,2 | 6 px · graisse 0 |
| visible | Dashboard apprenant | titre du bloc de tête (cours en cours, assigné, cours conseillé) (`Dashboard.css:360`) | 26 / 32 px · 800 · 1,05 / 1,1 | 24 / 28 px · 800 · 1,2 | 4 px · graisse 0 |

### Titre de section

19 éléments : 0 identiques, 10 discrets, 9 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Cours | titre de section (« Thèmes », « N résultats ») (`SectionCours.css:20`) | 22 / 28 px · 800 · 1,2 | 21 px · 800 · 1,2 | 7 px · graisse 0 |
| visible | Dashboard formateur | titre « Taux de complétion » (`DashboardFormateur.css:220`) | 14,4 px · 500 · 1,2 | 21 px · 800 · 1,2 | 6,6 px · graisse 3 crans |
| visible | Espace formateur (mobile) | titre de la feuille du menu « … » (`Formateur.css:285`) | 17 px · 800 · 1,2 | 21 px · 800 · 1,2 | 4 px · graisse 0 |
| visible | Détail cours | titre de l'encadré « À retenir » (`DetailCoursFormateur.css:268`) | 17 px · 800 · 1,2 | 21 px · 800 · 1,2 | 4 px · graisse 0 |
| visible | Fiche : leçon (et aperçu Création, où il est écrasé) | titre de l'encadré « À retenir » (`FicheCours.css:294`) | 17 px · 800 · 1,2 | 21 px · 800 · 1,2 | 4 px · graisse 0 |
| visible | Dashboard formateur : Pour bien démarrer | titre de la carte (`DashboardFormateur.css:657`) | 24 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
| visible | Espace formateur, Création de cours | titre de modale (`Formateur.css:357`) | 24 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
| visible | Fiche : leçon | intertitre H2 de la leçon (`FicheCours.css:266`) | 21 / 24 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
| visible | Dashboard apprenant, Cours | titre du bloc « De ton formateur » (`BlocFormateur.css:21`) | 18 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
| discret | Contenu Markdown | titre Markdown niveau 3 (`ContenuMarkdown.css:16`) | 16,8 px · 800 · 1,2 | 21 px · 800 · 1,2 | 4,2 px · graisse 0 |
| discret | Pages avec navigation | h2 par défaut dans .espace-page (`espace-layout.css:163`) | 16,8 px · 800 · 1,2 | 21 px · 800 · 1,2 | 4,2 px · graisse 0 |
| discret | Contenu Markdown | titre Markdown niveau 2 (hors leçon) (`ContenuMarkdown.css:15`) | 19,2 px · 800 · 1,2 | 21 px · 800 · 1,2 | 1,8 px · graisse 0 |
| discret | Contenu Markdown | titre Markdown niveau 1 (`ContenuMarkdown.css:14`) | 22,4 px · 800 · 1,2 | 21 px · 800 · 1,2 | 1,4 px · graisse 0 |
| discret | Création de cours | titre de carte de section (Infos, Leçon…) (`CreationCours.css:253`) | 22 px · 800 · 1,2 | 21 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard formateur | titre « Activité récente » (`DashboardFormateur.css:463`) | 22 px · 800 · 1,2 | 21 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard formateur, admin | titre de carte (« Tes groupes »…) (`DashboardFormateur.css:102`) | 20 px · 800 · 1,2 | 21 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Détail groupe | titre « Cours assignés » (`DetailGroupe.css:78`) | 20 px · 800 · 1,2 | 21 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Espace formateur | titre de carte de section (h2) (`Formateur.css:54`) | 20 px · 800 · 1,2 | 21 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant : modale Mes badges | titre « Mes badges » (`Dashboard.css:994`) | 20,8 px · 800 · 1,2 | 21 px · 800 · 1,2 | 0,2 px · graisse 0 |

### Titre de carte

13 éléments : 1 identiques, 3 discrets, 9 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Dashboard apprenant (desktop, colonne étroite) | « Quiz flash » vertical (`Dashboard.css:941`) | n/a / 28 px · 800 · 1 | n/a / 18 px · 800 · 1,2 | 10 px · graisse 0 |
| visible | Dashboard apprenant | titre de carte blanche / lavande (`Dashboard.css:143`) | 22 px · 800 · 1,05 | 18 px · 800 · 1,2 | 4 px · graisse 0 |
| visible | Fin de quiz | nom du badge débloqué (`FicheCours.css:886`) | 22 px · 800 · 1,1 | 18 px · 800 · 1,2 | 4 px · graisse 0 |
| visible | Mes groupes | nom de la carte de groupe (`FormateurListes.css:88`) | 20 / 22 px · 800 · 1,2 | 18 px · 800 · 1,2 | 4 px · graisse 0 |
| visible | Détail groupe | titre de la carte de cours assigné (`DetailGroupe.css:120`) | 15 px · 800 · 1,25 | 18 px · 800 · 1,2 | 3 px · graisse 0 |
| visible | Cours | titre de la carte de thème (`SectionCours.css:89`) | 15 / 18 px · 800 · 1,2 | 18 px · 800 · 1,2 | 3 px · graisse 0 |
| visible | Fiche : checklist | « X étapes sur N » (`FicheCours.css:1062`) | 20 px · 800 · 1,2 | 18 px · 800 · 1,2 | 2 px · graisse 0 |
| visible | Fiche : quiz, Quiz flash | titre du bloc de correction (« Bien vu ») (`FicheCours.css:654`) | 20 px · 800 · 1,2 | 18 px · 800 · 1,2 | 2 px · graisse 0 |
| visible | Parcours : Choix du profil | titre de la carte de profil (`Parcours.css:157`) | 20 px · 800 · 1,2 | 18 px · 800 · 1,2 | 2 px · graisse 0 |
| discret | Partagé (fiche) | titre du toast de complétion (`CompletionToast.css:30`) | 13,6 px · 800 · 1,2 | 18 px · 800 · 1,2 | 4,4 px · graisse 0 |
| discret | Dashboard apprenant | titre « Quiz flash » du bloc en ligne F (`Dashboard.css:477`) | 19 px · 800 · 1,2 | 18 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant | titre « Quiz flash » verrouillé (`Dashboard.css:547`) | 17 px · 800 · 1,2 | 18 px · 800 · 1,2 | 1 px · graisse 0 |

### Titre de ligne

17 éléments : 5 identiques, 10 discrets, 2 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Création de cours | H1 de l'en-tête compact (affiché sous 1024 px) (`CreationCours.css:52`) | 20 px · 800 · 1,2 | 16 px · 800 · 1,2 | 4 px · graisse 0 |
| visible | Fin de quiz, Quiz flash | titre du cours dans la barre du haut (`FicheCours.css:718`) | 13 px · 700 · 1,2 | 16 px · 800 · 1,2 | 3 px · graisse 1 cran |
| discret | Création de cours | énoncé de la question repliée (`CreationCours.css:623`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard admin | titre du cours dans le tableau (`DashboardFormateur.css:819`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant : modale Mes badges | nom du badge (`Dashboard.css:1051`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant, Cours | titre de cours de la ligne du bloc formateur (`BlocFormateur.css:93`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard formateur | nom du groupe (`DashboardFormateur.css:298`) | 17 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard formateur : Pour bien démarrer | titre d'étape (`DashboardFormateur.css:722`) | 17 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Détail cours | énoncé de question (`DetailCoursFormateur.css:340`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Détail groupe | nom de l'élève (`DetailGroupe.css:183`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Fiche : checklist | titre du cours de l'en-tête compact (H1) (`FicheCours.css:1041`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Terrain, recherche Cours | titre de la ligne de cours (`LigneCours.css:47`) | 15 / 16 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |

### Texte de lecture

2 éléments : 1 identiques, 0 discrets, 1 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Détail cours | premier paragraphe de la leçon (`DetailCoursFormateur.css:212`) | 16 px · 500 · 1,55 | 17 / 18 px · 500 · 1,55 | 2 px · graisse 0 |

### Corps courant

19 éléments : 2 identiques, 13 discrets, 4 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Dashboard admin (desktop) | en-têtes de colonne du tableau (`DashboardFormateur.css:1045`) | n/a / 13 px · 700 · 1,2 | n/a / 15 px · 600 (état) · 1,45 | 2 px · graisse 1 cran |
| visible | Détail groupe (desktop) | en-têtes de colonne du tableau des élèves (`DetailGroupe.css:338`) | n/a / 13 px · 800 · 1,2 | n/a / 15 px · 600 (état) · 1,45 | 2 px · graisse 2 crans |
| visible | Fiche : checklist | intitulé de l'étape en cours (`FicheCours.css:1205`) | 17 px · 800 · 1,2 | 15 px · 500 · 1,45 | 2 px · graisse 3 crans |
| visible | Dashboard admin (desktop) | cellules chiffrées du tableau (`DashboardFormateur.css:1064`) | n/a / 15 px · 700 · 1,2 | n/a / 15 px · 500 · 1,45 | 0 px · graisse 2 crans |
| discret | Partagé (fiche) | texte du toast de complétion (`CompletionToast.css:15`) | 13,6 px · 500 · 1,2 | 15 px · 500 · 1,45 | 1,4 px · graisse 0 |
| discret | Détail cours | bonne réponse (`DetailCoursFormateur.css:353`) | 14 px · 700 · 1,2 | 15 px · 600 (état) · 1,45 | 1 px · graisse 1 cran |
| discret | Fiche : checklist | intitulé d'étape (`FicheCours.css:1172`) | 16 px · 600 · 1,35 | 15 px · 500 · 1,45 | 1 px · graisse 1 cran |
| discret | Fiche : leçon | points de l'encadré « À retenir » (`FicheCours.css:321`) | 16 px · 600 · 1,4 | 15 px · 500 · 1,45 | 1 px · graisse 1 cran |
| discret | Fin de quiz : mes erreurs | ligne « Ta réponse / Bonne réponse » (`FicheCours.css:963`) | 14 px · 700 · 1,2 | 15 px · 600 (état) · 1,45 | 1 px · graisse 1 cran |
| discret | Fin de quiz : mes erreurs | explication (`FicheCours.css:977`) | 14 px · 500 · 1,2 | 15 px · 500 · 1,45 | 1 px · graisse 0 |
| discret | Contenu Markdown | texte de tableau (`ContenuMarkdown.css:95`) | 15,2 px · 500 · 1,2 | 15 px · 500 · 1,45 | 0,2 px · graisse 0 |
| discret | Dashboard formateur | texte de relance (`DashboardFormateur.css:366`) | 15 px · 500 · 1,4 | 15 px · 500 · 1,45 | 0 px · graisse 0 |
| discret | Dashboard formateur | texte de l'événement (`DashboardFormateur.css:602`) | 15 px · 500 · 1,4 | 15 px · 500 · 1,45 | 0 px · graisse 0 |
| discret | Détail cours | points de l'encadré « À retenir » (`DetailCoursFormateur.css:294`) | 15 px · 600 · 1,2 | 15 px · 500 · 1,45 | 0 px · graisse 1 cran |
| discret | Détail cours | intitulé d'étape de checklist (`DetailCoursFormateur.css:372`) | 15 px · 600 · 1,2 | 15 px · 500 · 1,45 | 0 px · graisse 1 cran |
| discret | Détail groupe (desktop) | cellules du tableau des élèves (`DetailGroupe.css:350`) | n/a / 15 px · 600 · 1,2 | n/a / 15 px · 500 · 1,45 | 0 px · graisse 1 cran |
| discret | Fiche : checklist (remise en ordre) | consigne de remise en ordre (`FicheCours.css:1081`) | 15 px · 500 · 1,2 | 15 px · 500 · 1,45 | 0 px · graisse 0 |

### Texte secondaire

32 éléments : 2 identiques, 28 discrets, 2 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Cours, Terrain | sous-titre de l'en-tête lavande (`EntetePage.css:35`) | 14 / 16 px · 700 · 1,2 | 14 px · 600 · 1,2 | 2 px · graisse 1 cran |
| visible | Parcours | sous-titre sous le H1 (`GabaritParcours.css:215`) | 16 px · 500 · 1,2 | 14 px · 600 · 1,2 | 2 px · graisse 1 cran |
| discret | Cours | « Aucun cours ne correspond… » (`SectionCours.css:28`) | 15 px · 500 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Création de cours | aide sous un champ (`CreationCours.css:272`) | 13 px · 500 · 1,4 | 14 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard apprenant | phrase d'état (« Leçon lue. Reste le quiz ») (`Dashboard.css:388`) | 14 / 15 px · 600 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant (desktop, colonne étroite) | phrase du quiz flash vertical (`Dashboard.css:952`) | n/a / 15 px · 600 · 1,2 | n/a / 14 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant : modale Mes badges | condition du badge (`Dashboard.css:1057`) | 13 px · 500 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard formateur | note sous une carte (`DashboardFormateur.css:133`) | 13 px · 500 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard formateur | confirmation d'envoi de relance (`DashboardFormateur.css:376`) | 13 px · 700 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard formateur, admin | « 3 cours · 1 groupe · 12 élèves » (`DashboardFormateur.css:36`) | 15 px · 700 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard formateur, admin | texte d'état vide (`DashboardFormateur.css:144`) | 15 px · 500 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Espace formateur | sous-titre sous le H1 (« N élèves · N cours ») (`Formateur.css:37`) | 15 px · 600 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Espace formateur | sous-titre de modale (`Formateur.css:363`) | 15 px · 500 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Fin de quiz | sous-titre « Une seule erreur à revoir. » (`FicheCours.css:816`) | 15 px · 600 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Parcours | aide sous un champ (mot de passe) (`Parcours.css:17`) | 13 px · 600 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Parcours : Création du compte | texte du bloc lavande (`Parcours.css:199`) | 15 px · 600 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Création de cours | message d'erreur (`CreationCours.css:279`) | 13,6 px · 700 · 1,4 | 14 px · 600 · 1,2 | 0,4 px · graisse 1 cran |
| discret | Fiche : checklist (remise en ordre) | message de résultat de la remise en ordre (`quiz.css:85`) | 13,6 px · 500 · 1,2 | 14 px · 600 · 1,2 | 0,4 px · graisse 1 cran |
| discret | Mot de passe oublié | phrase d'explication sous le H1 (`shared.css:119`) | 14,4 px · 500 · 1,2 | 14 px · 600 · 1,2 | 0,4 px · graisse 1 cran |
| discret | Partagé | message d'erreur (.message) (`shared.css:358`) | 13,6 px · 500 · 1,4 | 14 px · 600 · 1,2 | 0,4 px · graisse 1 cran |
| discret | Terrain, Détail thème, Détail groupe | texte d'état vide (`shared.css:512`) | 13,6 px · 500 · 1,2 | 14 px · 600 · 1,2 | 0,4 px · graisse 1 cran |
| discret | Création de cours | message de la barre d'enregistrement (`CreationCours.css:1075`) | 14 px · 700 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard formateur : Pour bien démarrer | sous-titre d'étape (`DashboardFormateur.css:727`) | 14 px · 500 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Parcours : Choix du profil | description de la carte de profil (`Parcours.css:162`) | 14 px · 500 · 1,35 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard formateur | note 14 px (Pour bien démarrer) (`DashboardFormateur.css:139`) | 14 px · 500 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Détail thème | « x cours terminés sur y » (`DetailTheme.css:88`) | 14 px · 700 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Fiche : checklist | critère de validation (`FicheCours.css:1221`) | 14 px · 500 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Fin de quiz | condition du badge (`FicheCours.css:892`) | 14 px · 500 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Fiche : quiz, Quiz flash | « Plusieurs réponses possibles » (`FicheCours.css:445`) | 14 px · 700 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Parcours | message d'erreur (`GabaritParcours.css:365`) | 14 px · 700 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |

### Méta

38 éléments : 7 identiques, 31 discrets, 0 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| discret | Aperçu élève | texte du bandeau « Aperçu élève » (`FicheCours.css:104`) | 14 px · 700 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Cours | compteur « N cours » du bloc formateur (`BlocFormateur.css:44`) | 14 px · 700 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Cours | compte « y cours » de la carte de thème (`SectionCours.css:105`) | 13 / 14 px · 700 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Création de cours | nom d'image en étiquette (`CreationCours.css:519`) | 14 px · 700 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard admin | libellé de carte chiffrée (`DashboardFormateur.css:771`) | 14 px · 600 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant | méta du cours assigné (« thème · ajouté hier ») (`Dashboard.css:426`) | 14 px · 600 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant : modale Mes badges | « Obtenu le JJ/MM » (`Dashboard.css:1062`) | 12 px · 700 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard formateur | sous-titre « Sur l'ensemble de tes groupes » (`DashboardFormateur.css:225`) | 12 px · 500 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard formateur | « N élèves · N cours » (`DashboardFormateur.css:304`) | 14 px · 600 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard formateur | « Tous tes élèves ont commencé… » (`DashboardFormateur.css:446`) | 14 px · 500 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard formateur : Pour bien démarrer | « N étapes sur 3 » (`DashboardFormateur.css:663`) | 14 px · 700 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Détail cours | légende de la barre d'avancement (`DetailCoursFormateur.css:96`) | 14 px · 600 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Détail groupe (mobile) | statut par cours dans la carte élève (`DetailGroupe.css:242`) | 14 px · 600 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Espace formateur | méta (« X terminés sur N »…) (`Formateur.css:73`) | 14 px · 600 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Fiche : checklist | « +15 XP à la fin » (`FicheCours.css:1067`) | 14 px · 700 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Fiche : leçon, checklist | détail « N questions · +20 XP » (`FicheCours.css:358`) | 14 px · 500 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Fiche : leçon, récap | « N min de lecture » / « X XP gagnés » (`FicheCours.css:234`) | 14 px · 700 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Mes cours, Mes groupes | méta de carte (`FormateurListes.css:64`) | 14 px · 600 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Mes groupes | ligne « Cours terminés » (`FormateurListes.css:101`) | 14 px · 600 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Récap | contenu du cours suivant (`FicheCours.css:1352`) | 14 px · 500 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Création de cours (≥ 768) | sous-titre de mode de checklist (`CreationCours.css:901`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard admin | précision « 30 derniers jours » (`DashboardFormateur.css:783`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard admin | thème court sous le titre (`DashboardFormateur.css:826`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard apprenant | méta « 10 questions · +30 XP » (`Dashboard.css:482`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard formateur | « Actif aujourd'hui » (`DashboardFormateur.css:311`) | 13 px · 700 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard formateur | date « Il y a N jours » (`DashboardFormateur.css:370`) | 13 px · 700 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Détail groupe | email de l'élève (`DetailGroupe.css:190`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Détail thème | contenu « Leçon · Quiz · Checklist » (`DetailTheme.css:143`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Modale d'assignation | détail sous le libellé de case (`Formateur.css:532`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Récap | détail de ligne (« Meilleur score : 4/5 ») (`FicheCours.css:1316`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Terrain, recherche Cours | méta de la ligne de cours (`LigneCours.css:54`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |

### Surtitre

11 éléments : 8 identiques, 2 discrets, 1 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Dashboard apprenant | libellé sur carte violette (« Tu en es là ») (`Dashboard.css:137`) | 13 / 15 px · 700 · 1,2 | 13 px · 700 · 1,2 | 2 px · graisse 0 |
| discret | Cours | surtitre « Thème N » de la carte de thème (`SectionCours.css:82`) | 12 / 13 px · 700 · 1,2 | 13 px · 700 · 1,2 | 1 px · graisse 0 |
| discret | Fiche : checklist | thème de l'en-tête compact (`FicheCours.css:1033`) | 12 px · 700 · 1,2 | 13 px · 700 · 1,2 | 1 px · graisse 0 |

### Bouton

25 éléments : 7 identiques, 17 discrets, 1 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Mot de passe oublié | bouton Retour « Connexion » (`shared.css:321`) | 13,6 px · 600 · 1,2 | 15 px · 800 · 1,2 | 1,4 px · graisse 2 crans |
| discret | Création de cours | bouton pointillé « + Ajouter… » (`shared.css:380`) | 13,6 px · 700 · 1,2 | 15 px · 800 · 1,2 | 1,4 px · graisse 1 cran |
| discret | Création de cours | bouton d'outil « Image / Vidéo » (`CreationCours.css:438`) | 14 px · 700 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 1 cran |
| discret | Création de cours | bouton « Image » d'étape (`CreationCours.css:1038`) | 14 px · 700 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard apprenant | libellé du bouton orange (quiz flash) (`shared.css:255`) | 16 px · 700 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard apprenant | libellé du bouton blanc à flèche (`Dashboard.css:222`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant | libellé du bouton large orange (`Dashboard.css:255`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant (desktop, colonne étroite) | bouton « Lancer » vertical (`Dashboard.css:960`) | n/a / 16 px · 800 · 1,2 | n/a / 15 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Fiche : leçon, checklist | libellé du bouton blanc (`FicheCours.css:374`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Fiche : quiz, Quiz flash | libellé du bouton « Valider ma réponse » (`FicheCours.css:685`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Fin de quiz | libellé du bouton principal (`FicheCours.css:901`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Modale de confirmation | libellé du bouton rouge (`Formateur.css:411`) | 16 px · 800 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Modales, barre de Création de cours | « Annuler » (bouton secondaire sur design-system ; lien texte en prod) (`Formateur.css:397`) | 16 px · 700 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 1 cran |
| discret | Parcours | libellé du bouton du parcours (écrasé par .bouton-primaire / .bouton-secondaire) (`GabaritParcours.css:86`) | 16 px · 700 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 1 cran |
| discret | Partagé | libellé du bouton principal (`shared.css:200`) | 16 px · 700 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 1 cran |
| discret | Partagé | libellé du bouton secondaire (`shared.css:230`) | 16 px · 700 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 1 cran |
| discret | Récap | libellé des boutons « Relire / Refaire / Revoir » (`FicheCours.css:1323`) | 14 px · 700 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard formateur : Pour bien démarrer | libellé du bouton d'étape (`DashboardFormateur.css:740`) | 15 px · 700 · 1,2 | 15 px · 800 · 1,2 | 0 px · graisse 1 cran |

### Lien texte

16 éléments : 1 identiques, 15 discrets, 0 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| discret | Mot de passe oublié | lien secondaire (simuler le lien) (`shared.css:343`) | 13,6 px · 600 · 1,2 | 15 px · 700 · 1,2 | 1,4 px · graisse 1 cran |
| discret | Aperçu élève | bouton « Quitter l'aperçu » (`FicheCours.css:115`) | 14 px · 800 · 1,2 | 15 px · 700 · 1,2 | 1 px · graisse 1 cran |
| discret | Création de cours (≥ 1024) | bouton Retour « Mes cours » (`CreationCours.css:144`) | 16 px · 800 · 1,2 | 15 px · 700 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard apprenant, Cours | lien « Tout voir » / « Mes badges · X/6 » (`Dashboard.css:166`) | 14 px · 800 · 1,2 | 15 px · 700 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard formateur, admin | lien « Tout voir » (`DashboardFormateur.css:112`) | 14 px · 800 · 1,2 | 15 px · 700 · 1,2 | 1 px · graisse 1 cran |
| discret | Espace formateur | action du menu « … » (`Formateur.css:297`) | 16 px · 700 · 1,2 | 15 px · 700 · 1,2 | 1 px · graisse 0 |
| discret | Parcours : Introduction | lien « Passer » (`GabaritParcours.css:135`) | 16 px · 800 · 1,2 | 15 px · 700 · 1,2 | 1 px · graisse 1 cran |
| discret | Navigation | entrée du menu (Se déconnecter) (`espace-layout.css:123`) | 14,4 px · 600 · 1,2 | 15 px · 700 · 1,2 | 0,6 px · graisse 1 cran |
| discret | Création de cours | liens « Voir comme un élève » / « Créer un groupe » (`CreationCours.css:208`) | 15 px · 800 · 1,2 | 15 px · 700 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard formateur | lien « Voir les N autres » / « Voir plus » (`DashboardFormateur.css:128`) | 15 px · 800 · 1,2 | 15 px · 700 · 1,2 | 0 px · graisse 1 cran |
| discret | Détail groupe | lien « Assigner » (`DetailGroupe.css:87`) | 15 px · 800 · 1,2 | 15 px · 700 · 1,2 | 0 px · graisse 1 cran |
| discret | Détail groupe | lien « Voir les N autres » (`DetailGroupe.css:255`) | 15 px · 800 · 1,2 | 15 px · 700 · 1,2 | 0 px · graisse 1 cran |
| discret | Fiche : checklist | lien « Passer cette étape » (`FicheCours.css:1153`) | 15 px · 800 · 1,2 | 15 px · 700 · 1,2 | 0 px · graisse 1 cran |
| discret | Fiche : quiz, Quiz flash | lien « Revoir la leçon » (`FicheCours.css:673`) | 15 px · 800 · 1,2 | 15 px · 700 · 1,2 | 0 px · graisse 1 cran |
| discret | Fin de quiz | liens « Revoir mes erreurs »… (`FicheCours.css:919`) | 15 px · 800 · 1,2 | 15 px · 700 · 1,2 | 0 px · graisse 1 cran |

### Navigation

6 éléments : 0 identiques, 6 discrets, 0 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| discret | Navigation | libellé d'entrée de la tab bar (mobile) (`espace-layout.css:48`) | 11,52 / 14,4 px · 700 · 1,2 | 14 px · 700 · 1,2 | 2,48 px · graisse 0 · état choisi 700 → 800 |
| discret | Création de cours (< 1024) | pastille de section collante (`CreationCours.css:94`) | 15 px · 700 · 1,2 | 14 px · 700 · 1,2 | 1 px · graisse 0 · état choisi 700 → 800 |
| discret | Création de cours (≥ 1024) | entrée du sommaire (`CreationCours.css:181`) | 15 px · 700 · 1,2 | 14 px · 700 · 1,2 | 1 px · graisse 0 · état choisi 700 → 800 |
| discret | Création de cours | onglet « Écrire / Aperçu » (`CreationCours.css:409`) | 14 px · 700 · 1,2 | 14 px · 700 · 1,2 | 0 px · graisse 0 · état choisi 700 → 800 |
| discret | Dashboard formateur | pastilles de filtre « Tout / Commencés / Terminés » (`DashboardFormateur.css:494`) | 14 px · 700 · 1,2 | 14 px · 700 · 1,2 | 0 px · graisse 0 · état choisi 700 → 800 |
| discret | Fiche : leçon, checklist | libellé d'étape (Leçon, Quiz · 4/5…) (`ReperEtapes.css:67`) | 14 px · 600 · 1,2 | 14 px · 700 · 1,2 | 0 px · graisse 1 cran · état choisi 700 → 800 |

### Libellé de champ

4 éléments : 0 identiques, 3 discrets, 1 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Parcours | libellé de champ (`GabaritParcours.css:228`) | 14 px · 800 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 2 crans |
| discret | Création de cours | libellé de champ (`CreationCours.css:266`) | 14,4 px · 500 · 1,2 | 14 px · 600 · 1,2 | 0,4 px · graisse 1 cran |
| discret | Partagé (modales, Détail groupe, Mes cours, mot de passe) | libellé de champ (.champ) (`shared.css:126`) | 14,4 px · 500 · 1,2 | 14 px · 600 · 1,2 | 0,4 px · graisse 1 cran |
| discret | Création de cours | libellé « Bonne réponse » (`CreationCours.css:832`) | 14 px · 700 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |

### Saisie et choix

18 éléments : 3 identiques, 11 discrets, 4 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Parcours : questions | saisie du grand champ (prénom, organisme…) (`GabaritParcours.css:269`) | 20 px · 700 · 1,2 | 16 px · 600 · 1,2 | 4 px · graisse 1 cran |
| visible | Création de cours | saisie d'explication (`CreationCours.css:776`) | 14 px · 400 · 1,2 | 16 px · 600 · 1,2 | 2 px · graisse 400 → 600 |
| visible | Dashboard formateur | saisie « Un élève » (`DashboardFormateur.css:531`) | 14 px · 400 · 1,2 | 16 px · 600 · 1,2 | 2 px · graisse 400 → 600 |
| visible | Création de cours | libellé de mode de checklist (`CreationCours.css:895`) | 15 px · 800 · 1,2 | 16 px · 600 · 1,2 | 1 px · graisse 2 crans |
| discret | Création de cours | bouton de choix (groupe, mode de checklist) (`CreationCours.css:327`) | 15 px · 700 · 1,2 | 16 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Création de cours | saisie de réponse / d'explication (`CreationCours.css:767`) | 15 px · 400 · 1,2 | 16 px · 600 · 1,2 | 1 px · graisse 400 → 600 |
| discret | Création de cours | saisie de l'intitulé d'étape (`CreationCours.css:961`) | 15 px · 600 · 1,2 | 16 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Parcours : questions | ligne de choix (statut, âge, motivation) (`GabaritParcours.css:296`) | 17 px · 600 · 1,2 | 16 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Création de cours, Mes cours | option de la liste déroulante (`Dropdown.css:61`) | 15,2 px · 500 · 1,2 | 16 px · 600 · 1,2 | 0,8 px · graisse 1 cran |
| discret | Cours | saisie de la recherche (`EntetePage.css:48`) | 16 px · 400 · 1,2 | 16 px · 600 · 1,2 | 0 px · graisse 400 → 600 |
| discret | Création de cours | saisie de l'éditeur de leçon (`CreationCours.css:458`) | 16 px · 400 · 1,55 | 16 px · 600 · 1,2 | 0 px · graisse 400 → 600 |
| discret | Création de cours, Mes cours | valeur affichée de la liste déroulante (`Dropdown.css:12`) | 16 px · 400 · 1,2 | 16 px · 600 · 1,2 | 0 px · graisse 400 → 600 |
| discret | Modale d'assignation, Création de cours | libellé de case à cocher (`Formateur.css:527`) | 16 px · 700 · 1,2 | 16 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Partagé | saisie de champ input (.champ) (`shared.css:136`) | 16 px · 400 · 1,2 | 16 px · 600 · 1,2 | 0 px · graisse 400 → 600 |
| discret | Partagé | saisie de champ textarea (.champ) (`shared.css:148`) | 16 px · 400 · 1,2 | 16 px · 600 · 1,2 | 0 px · graisse 400 → 600 |

### Pastille

24 éléments : 5 identiques, 15 discrets, 4 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Dashboard formateur : Pour bien démarrer | numéro dans le rond (`DashboardFormateur.css:695`) | 16 px · 800 · 1,2 | 13 px · 800 · 1,2 | 3 px · graisse 0 |
| visible | Détail cours | « +N » sur la dernière miniature (`DetailCoursFormateur.css:246`) | 16 px · 800 · 1,2 | 13 px · 800 · 1,2 | 3 px · graisse 0 |
| visible | Fin de quiz | pastille « +20 XP » (`FicheCours.css:830`) | 16 px · 800 · 1,2 | 13 px · 800 · 1,2 | 3 px · graisse 0 |
| visible | Création de cours | lettre de réponse (`CreationCours.css:751`) | 15 px · 800 · 1,2 | 13 px · 800 · 1,2 | 2 px · graisse 0 |
| discret | Création de cours | pastille « Compte officiel : ce cours sera public » (`CreationCours.css:236`) | 14 px · 700 · 1,2 | 13 px · 800 · 1,2 | 1 px · graisse 1 cran |
| discret | Création de cours | numéro de question / d'étape (`CreationCours.css:575`) | 14 px · 800 · 1,2 | 13 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Création de cours | pilule « Bloquante » (`CreationCours.css:1013`) | 14 px · 700 · 1,2 | 13 px · 800 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard apprenant | pastille « De ton formateur » (`Dashboard.css:191`) | 12 px · 800 · 1,2 | 13 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant | pastille orange « Défi du jour » (`Dashboard.css:206`) | 12 px · 800 · 1,2 | 13 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard formateur | pastille « À surveiller / Bon rythme » (`DashboardFormateur.css:236`) | 12 px · 700 · 1,2 | 13 px · 800 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard formateur | initiales sur rond lavande (`DashboardFormateur.css:596`) | 14 px · 800 · 1,2 | 13 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard formateur | pastille du groupe (`DashboardFormateur.css:626`) | 12 px · 700 · 1,2 | 13 px · 800 · 1,2 | 1 px · graisse 1 cran |
| discret | Fiche : checklist | pastille « Bloquante » (`FicheCours.css:1215`) | 12 px · 800 · 1,2 | 13 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Fiche : quiz, Quiz flash | pastille « Ta réponse » / « Bonne réponse » (`FicheCours.css:606`) | 12 px · 800 · 1,2 | 13 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Fin de quiz | pastille « Nouveau badge » (`FicheCours.css:881`) | 12 px · 800 · 1,2 | 13 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Partagé (Cours, Dashboard, Détail groupe…) | pastille de statut (Nouveau, À faire, Non commencé) (`espace-layout.css:252`) | 12 px · 700 · 1,2 | 13 px · 800 · 1,2 | 1 px · graisse 1 cran |
| discret | Récap | « X XP gagnés » (pastille Terminé) (`FicheCours.css:1276`) | 14 px · 800 · 1,2 | 13 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Partagé (fiche) | nom du badge dans le toast (`CompletionToast.css:48`) | 12,8 px · 700 · 1,2 | 13 px · 800 · 1,2 | 0,2 px · graisse 1 cran |
| discret | Espace formateur | pastille de groupe / « Non assigné » (`Formateur.css:178`) | 13 px · 700 · 1,2 | 13 px · 800 · 1,2 | 0 px · graisse 1 cran |

### Chiffre mis en avant (standard)

3 éléments : 2 identiques, 0 discrets, 1 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Dashboard admin | chiffre de carte (`DashboardFormateur.css:777`) | 36 px · 800 · 1,1 | 28 px · 800 · 1 | 8 px · graisse 0 |

### Chiffre mis en avant (grand)

1 éléments : 1 identiques, 0 discrets, 0 visibles.


### Compteur

9 éléments : 2 identiques, 3 discrets, 4 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Dashboard apprenant | pourcentage dans l'anneau (`Dashboard.css:382`) | 17 / 26 px · 800 · 1,2 | 15 px · 800 · 1,2 | 11 px · graisse 0 |
| visible | Dashboard apprenant | « [N] XP » de l'en-tête (`Dashboard.css:30`) | 17 / 20 px · 800 · 1,2 | 15 px · 800 · 1,2 | 5 px · graisse 0 |
| visible | Dashboard apprenant | compteur de barre, petite variante (`Dashboard.css:323`) | 12 px · 800 · 1,2 | 15 px · 800 · 1,2 | 3 px · graisse 0 |
| visible | Parcours : questions | compteur « 2 / 5 » (`GabaritParcours.css:195`) | 18 px · 800 · 1,2 | 15 px · 800 · 1,2 | 3 px · graisse 0 |
| discret | Partagé (fiche) | « +15 XP » du toast (`CompletionToast.css:39`) | 13,6 px · 700 · 1,2 | 15 px · 800 · 1,2 | 1,4 px · graisse 1 cran |
| discret | Dashboard apprenant | compteur de barre « X / 3 » (`Dashboard.css:318`) | 14 px · 800 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard formateur | % de la barre du groupe (`DashboardFormateur.css:330`) | 14 px · 800 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 0 |

## 4. Variantes d'état et emphase

Règles :

- un **état** (choisi, en cours, fait, coché) monte la graisse d'un cran au-dessus de celle du rôle, jamais la taille ;
- une **partie plus légère** que son rôle disparaît : elle prend la graisse du rôle ;
- l'**emphase** dans une phrase (`strong`, gras Markdown, nom en gras dans le fil d'activité) monte d'un cran au-dessus du rôle, comme un état. Au-dessus de 800, rien n'est chargé : l'emphase dans un rôle à 800 reste à 800 et ne se voit pas.

| Cas | Élément (écran) | Rôle (graisse) | Prod | Proposé |
|---|---|---|---|---|
| État : choisie | ligne de choix (Parcours, questions) | Saisie et choix (600) | 700 | 700 |
| État : choisie, au survol | ligne de choix (Parcours, questions) | Saisie et choix (600) | 700 | 700 |
| État : choisie | option de la liste déroulante (Création de cours, Mes cours) | Saisie et choix (600) | 600 | 700 |
| État : en cours | libellé du repère d'étapes (Fiche) | Navigation (700) | 800 | 800 |
| État : faite | libellé du repère d'étapes (Fiche) | Navigation (700) | 700 | 800 |
| État de base : à venir | libellé du repère d'étapes (Fiche) | Navigation (700) | 600 | 700 |
| État : cochée | libellé « Bonne réponse » (Création de cours) | Libellé de champ (600) | 800 | 700 |
| État : commencé | compte « x / y cours » de la carte de thème (Cours) | Méta (600) | 800 | 700 |
| État : en cours | intitulé de l'étape en cours (Checklist) | Corps courant (500, 15 px) | 17 px 800 | 15 px 600 |
| État : bonne réponse | « Bonne réponse » sous chaque question (Détail cours) | Corps courant (500, 15 px) | 14 px 700 | 15 px 600 |
| État : réponse donnée | ligne « Ta réponse / Bonne réponse » de « Revoir mes erreurs » (Fin de quiz) | Corps courant (500, 15 px) | 14 px 700 | 15 px 600 |
| Partie plus légère | compteur dans la pastille de section (Création de cours, mobile) | Navigation (700) | 600 | 700 |
| Partie plus légère | « Aucune modification » (barre d'enregistrement de Création de cours) | Texte secondaire (600) | 600 (message à 700) | 600, la graisse du rôle : plus de différence avec le message |
| Emphase | partie en gras du lien du parcours (« Créer mon compte », « Se connecter ») | Lien texte (700) | 800 | 800 |
| Emphase | nom de l'élève et titre du cours dans le fil d'activité (Dashboard formateur) | Corps courant (500) | 800 | 600 |
| Emphase | prénom et cours en gras dans la phrase de relance (Dashboard formateur) | Corps courant (500) | 700 (gras du navigateur) | 600 |
| Emphase | pourcentage en gras de la ligne « Cours terminés » (Mes groupes) | Méta (600) | 800 | 700 |
| Emphase | gras Markdown dans le texte de la leçon (fiche, aperçu de Création, Détail cours) | Texte de lecture (500) | 700 (gras du navigateur) | 600 |
| Emphase | gras Markdown dans les intitulés d'étape (Checklist, Détail cours) | Corps courant (500) | 800 (900 demandé) | 600 |
| Emphase | gras Markdown dans la question du quiz | Titre de contenu (800) | 800 (900 demandé) | 800, invisible (accepté) |
| Emphase | gras Markdown dans l'énoncé du Détail cours et dans « Revoir mes erreurs » | Titre de ligne (800) | 800 (900 demandé) | 800, invisible (accepté) |
| État : choisie | option choisie d'une Navigation (entrée active de la barre d'onglets et de la barre horizontale, onglet « Écrire / Aperçu » actif, filtre actif, section active du sommaire et des pastilles de Création) | Navigation (700) | 700 (seuls la couleur ou le fond changent) | 800 (changement discret, compté dans les totaux) |

L'étape faite de la checklist ne change que la couleur. L'italique Markdown n'est pas une emphase de graisse : elle demandera l'italique 500 (section 1.4).

## 5. Les cas « À trancher » de l'audit (section 3.3)

Les 20 lignes du tableau de l'audit. Rattachements inchangés depuis la version 2, sauf le titre du bloc de tête et « Quiz flash » du bloc E, passés au Titre de carte (décision 25), puis au Titre mis en avant (décision 28).

| Élément | Rattaché à | Raison |
|---|---|---|
| Titre de fin de quiz « Belle maîtrise ! » | Titre de page | Seul titre d'un écran complet, il annonce le résultat ; le bloc du score n'est pas une carte parmi d'autres. |
| « Plus qu'une étape, [Prénom] » (Création du compte) | Titre de page | Il tient la place du titre d'étape des autres écrans du parcours. |
| Question du quiz | Titre de contenu | C'est l'objet que l'écran présente, comme le titre du cours sur la leçon. |
| Titre du cours dans l'en-tête compact (Checklist) | Titre de ligne | Rappel du cours dans une barre compacte ; même rôle que l'en-tête compact de Création (1.4). |
| Titre du bloc de tête (Dashboard apprenant) | Titre mis en avant | Le bloc de tête porte l'action principale du dashboard apprenant, quelle que soit sa variante (décision 28 ; la décision 25 le rattachait au Titre de carte). |
| « Quiz flash » du bloc de tête E | Titre mis en avant | Variante E du bloc de tête (décision 28) ; « Quiz flash » en ligne, verrouillé ou vertical reste en Titre de carte. |
| Titres de carte de l'espace formateur | Titre de section | Dans l'espace formateur, chaque carte blanche est une section de la page. |
| « Taux de complétion » | Titre de section | Il titre sa carte comme « Tes groupes », sa voisine. |
| Intertitre de jour « Aujourd'hui » | Surtitre | Libellé court posé au-dessus des lignes qu'il regroupe ; même valeur en prod (13 px 700). |
| Nom de la carte de thème | Titre de carte | Carte cliquable autonome dans une grille, pas une ligne de liste. |
| « X étapes sur N » (Checklist) | Titre de carte | Phrase qui titre la carte de progression. |
| Intitulé de l'étape en cours (Checklist) | Corps courant, état « en cours » | Même texte que les autres intitulés ; la mise en avant devient une variante d'état (section 4). |
| Ligne de choix du parcours, réponse du quiz, bouton de choix de Création | Saisie et choix | Le texte est la réponse choisie par l'utilisateur. |
| Pastilles de filtre « Tout / Commencés / Terminés » | Navigation | Une option reste choisie et le choix change ce que montre la liste, sans agir sur les données (critère de la section 1). |
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
| Boutons du parcours | 17 px 800 | 16 px 700 | 15 px 800 (Bouton) | **la graisse écrite, ni l'une ni l'autre pour la taille** : c'est la valeur du rôle Bouton. Depuis le rendu, changement discret (−1 px, +1 cran). |
| Titre du cours (Détail cours) | 28 / 32 px | 34 / 44 px | 28 / 32 px (Titre de contenu) | **la valeur écrite** : c'est un titre de cours, comme sur la fiche ; 34 / 44 px venait d'un conflit de sélecteurs. Impact depuis le rendu : −6 px mobile, −12 px desktop. |
| « À retenir » dans l'aperçu de Création de cours | 17 px | 22 px | 21 px (Titre de section, décision 20) | **ni l'une ni l'autre** : le titre suit son rôle, comme dans la fiche ; l'aperçu et la fiche affichent la même valeur. |

## 7. Écarts avec CLAUDE.md

CLAUDE.md n'est pas modifié. Tailles (et graisses, quand il les donne) qu'il décrit et qui différeraient de la proposition validée ; celles que la proposition garde ne sont pas listées :

| CLAUDE.md dit | Élément | Valeur dans CLAUDE.md | Proposé |
|---|---|---|---|
| Dashboard apprenant, bloc de tête : « Titre 26 px mobile / 32 px desktop » | titre du bloc de tête (cours en cours, assigné, cours conseillé) (`Dashboard.css:360`) | 26 / 32 px | 24 / 28 px |
| Dashboard apprenant, bloc E : « Quiz flash » 34 px | « Quiz flash » du bloc de tête E (`Dashboard.css:440`) | 34 px | 24 / 28 px |
| Dashboard apprenant, bloc F en colonne étroite : « titre 28 px » | « Quiz flash » vertical (`Dashboard.css:941`) | 28 px | 18 px |
| En-tête lavande partagé : sous-titre « 14 px 700 (16 px desktop) » | sous-titre de l'en-tête lavande (`EntetePage.css:35`) | 14 / 16 px | 14 px |
| Cours : « N résultats » et « Thèmes » « h2 22 px, 28 desktop » | titre de section (« Thèmes », « N résultats ») (`SectionCours.css:20`) | 22 / 28 px | 21 px |
| Cours : « Aucun cours ne correspond… » « 15 px » | « Aucun cours ne correspond… » (`SectionCours.css:28`) | 15 px | 14 px |
| Cours, carte de thème : « Thème N » « 12 px (13) » | surtitre « Thème N » de la carte de thème (`SectionCours.css:82`) | 12 / 13 px | 13 px |
| Cours, carte de thème : nom « 15 px (18) graisse 800 » | titre de la carte de thème (`SectionCours.css:89`) | 15 / 18 px | 18 px |
| Mode terrain : titre de ligne « 15 px (16) 800 » | titre de la ligne de cours (`LigneCours.css:47`) | 15 / 16 px | 16 px |
| Dashboard formateur : sous-titre « 15 px gras » | « 3 cours · 1 groupe · 12 élèves » (`DashboardFormateur.css:36`) | 15 px | 14 px |
| Pour bien démarrer : titre « 24 px » | titre de la carte (`DashboardFormateur.css:657`) | 24 px | 21 px |
| Pour bien démarrer : titre d'étape « 17 px » | titre d'étape (`DashboardFormateur.css:722`) | 17 px | 16 px |
| Tes groupes : nom « 17 px » | nom du groupe (`DashboardFormateur.css:298`) | 17 px | 16 px |
| Activité récente : titre « 22 px » | titre « Activité récente » (`DashboardFormateur.css:463`) | 22 px | 21 px |
| Activité récente : pastille du groupe « 12 px » | pastille du groupe (`DashboardFormateur.css:626`) | 12 px | 13 px |
| Dashboard admin : libellé « 14 px » | libellé de carte chiffrée (`DashboardFormateur.css:771`) | 14 px | 13 px |
| Dashboard admin : chiffre « 36 px » | chiffre de carte (`DashboardFormateur.css:777`) | 36 px | 28 px |
| Leçon : « H2 21 / 24 px » | intertitre H2 de la leçon (`FicheCours.css:266`) | 21 / 24 px | 21 px |
| Leçon, « À retenir » : « puces 16 px 600 » | points de l'encadré « À retenir » (`FicheCours.css:321`) | 16 px 600 | 15 px 500 |
| Quiz : « question 24 px 800 » | question (`FicheCours.css:432`) | 24 px | 28 / 32 px |
| Checklist : « thème 12 px » | thème de l'en-tête compact (`FicheCours.css:1033`) | 12 px | 13 px |
| Checklist : « « X étapes sur N » 20 px » | « X étapes sur N » (`FicheCours.css:1062`) | 20 px | 18 px |
| Checklist : étape en cours « intitulé 17 px 800 » | intitulé de l'étape en cours (`FicheCours.css:1205`) | 17 px 800 | 15 px 600 (état « en cours » du Corps courant) |
| Parcours : compteur « « 2 / 5 » 18 px 800 » | compteur « 2 / 5 » (`GabaritParcours.css:195`) | 18 px | 15 px |
| Parcours : « sous-titre 16 px secondaire » | sous-titre sous le H1 (`GabaritParcours.css:215`) | 16 px | 14 px |
| Création de cours (< 1024 px) : « titre 20 px » | H1 de l'en-tête compact (affiché sous 1024 px) (`CreationCours.css:52`) | 20 px | 16 px |
| Modale Mes badges : nom « 15 px, 800 » | nom du badge (`Dashboard.css:1051`) | 15 px | 16 px |
| Quiz : « Plusieurs réponses possibles » « 14 px 700 » | « Plusieurs réponses possibles » (`FicheCours.css:445`) | 14 px 700 | 14 px 600 |
| Tes groupes : titre de carte « 20 px » | titre de carte (« Tes groupes »…) (`DashboardFormateur.css:102`) | 20 px | 21 px |
| Checklist : « titre 15 px 800 » | titre du cours de l'en-tête compact (H1) (`FicheCours.css:1041`) | 15 px 800 | 16 px 800 |
| Mes groupes : nom de carte « 22 px » | nom de la carte de groupe (`FormateurListes.css:88`) | 22 px | 18 px |
| Fin de quiz, carte badge : « nom 22 px » | nom du badge débloqué (`FicheCours.css:886`) | 22 px | 18 px |
| Fin de quiz : anneau « avec « 4/5 » 48 px et « 80 % » » | score de fin de quiz (`FicheCours.css:795`, `:801`) | « 4/5 » 48 px + « 80 % » | « 80 % » seul, 48 px · 800 (décision produit, « 4/5 » retiré) |

## 8. Ce qui change depuis la version 2

- Valeurs : 9 jeux de valeurs sur 19 changent (en gras en section 1) : Titre de section 20 → 21 px, Titre de carte 17 → 18 px (un seul niveau depuis la décision 14), Titre de ligne 15 → 16 px, Texte secondaire 700 → 600, Méta 500 → 600, Bouton 16 → 15 px, Lien texte 800 → 700, Libellé de champ 700 → 600, Compteur 14 → 15 px. Saisie et choix reste à 16 px et Navigation à 14 px.
- Rôles, fusions et niveaux : inchangés. Rattachements inchangés, sauf trois décisions finales : XP de l'en-tête du dashboard → Compteur ; « Bonne réponse » (Détail cours) et « Ta réponse / Bonne réponse » (Fin de quiz) → état du Corps courant.
- Variantes d'état : les parties plus légères prennent la graisse du rôle ; l'emphase suit la règle des états.

## 9. À trancher

Plus rien n'est à trancher dans cette proposition. Le pourcentage de l'anneau du dashboard apprenant, dernier point ouvert, est réglé par la décision finale 8 (section 10). Pour mémoire, la mesure qui l'avait laissé ouvert : diamètre intérieur de l'anneau 58,8 px sur mobile et 90,4 px sur desktop ; en 28 px, « 88 % » fait 59,6 px de large ; en 15 px, « 100 % » fait environ 38,5 px et tient sur mobile comme sur desktop.

## 10. Décisions finales

Validées le 2026-11-04.

1. **Saisie et choix : 16 px.** Contrainte technique : Safari sur iOS agrandit la page quand on touche un champ dont le texte fait moins de 16 px. La raison est notée dans le rôle (section 1).
2. **Pas de tailles intermédiaires.** 27 px (Titre de contenu) est refusé. 21 px est dans l'échelle : il est refusé au Titre de carte (ancien niveau grand, supprimé depuis par la décision 14) parce que c'est la valeur du Titre de section (décision 26).
3. **« [N] XP » de l'en-tête du dashboard apprenant : rôle Compteur.** Avec lui, la valeur du Compteur devient 15 px · 800 · 1,2 (critère des changements visibles).
4. **Pourcentage de l'anneau du dashboard apprenant** : voir la décision 8 (point laissé à trancher lors de la première validation, réglé ensuite).
5. **« Bonne réponse » (Détail cours) et « Ta réponse / Bonne réponse » (Fin de quiz) : état du Corps courant, graisse 600** (15 px, 1,45).
6. **Emphase dans les rôles à 800 : acceptée invisible**, comme en prod (question du quiz, énoncés du Détail cours et de « Revoir mes erreurs », lien du parcours).
7. **Les autres changements visibles sont acceptés comme dérives à corriger** : les éléments de la section 3.2 (40 lors de cette décision, 44 après la décision 14), y compris les écarts de 4 px ou plus et le pourcentage de l'anneau.
8. **Pourcentage de l'anneau du dashboard apprenant : rôle Compteur** (15 px · 800 · 1,2), sur mobile et sur desktop. Le sujet du bloc « cours en cours » est le cours : le titre le nomme, le bouton mène à la suite, et le pourcentage dit où l'on en est dans ce cours. La place à l'intérieur de l'anneau n'est qu'une vérification : « 100 % » tient en 15 px sur mobile (environ 38,5 px de large pour 58,8 px libres).
9. **Chiffre mis en avant et Compteur se distinguent par le sujet du bloc**, jamais par la forme du nombre.
10. **Test binaire** : si le nombre est le sujet du bloc, Chiffre mis en avant ; sinon Compteur (position, avancement, total ou gain qui accompagne le sujet). Un nombre a un rôle et un seul. « 80 % » sous le score de fin de quiz et « +15 XP » du toast restent Compteur ; ils ne sont plus signalés.
11. **Lien texte ou Navigation** : Navigation quand une option reste marquée comme choisie et que le choix change ce qu'on voit sans agir sur les données ; Lien texte pour une action sans forme de bouton ni état choisi, qui agit ou mène ailleurs une fois. L'option choisie d'une Navigation monte d'un cran (800). « Se déconnecter » et les actions du menu « … » de l'espace formateur passent de Navigation à Lien texte (pas d'état choisi, action sur la session ou les données) ; la valeur de Navigation redevient 14 px · 700 · 1,2.
12. **Libellé du bouton Retour : rôle Bouton** (la variante Retour a une forme de bouton). Les deux Retour qui suivent la variante passent en Bouton ; les trois qui n'ont pas sa forme restent en Lien texte comme dérives à corriger vers la variante, à l'étape écrans. Mise à jour (2026-11-07) : les Retours de l'espace formateur et de Mot de passe oublié ont pris la forme de la variante (lots 7 et 8) et passent en Bouton ; seul celui de Création de cours reste en Lien texte. Totaux : 54 identiques, 170 discrets, 50 visibles.
13. **Rendu de design-system** : « Annuler », bouton secondaire sur design-system, passe de Lien texte à Bouton (décision déjà écrite dans la doc du DS). Les autres différences entre origin/main et design-system ne touchent pas la typographie (section 1).
14. **Titre de carte : un seul niveau, 18 px · 800 · 1,2.** Le niveau grand (22 px · 800 · 1,1) est supprimé : aucun critère de fonction ne le tenait (raisons de place, de couleur ou de taille actuelle, tracées en section 1.2). Ce n'est pas une fusion de rôles, le grand niveau était un palier créé pour limiter les changements. Ses 9 éléments rejoignent le Titre de carte ; 22 px sort de l'échelle (12 tailles). Totaux : 54 identiques, 177 discrets, 44 visibles.
15. **Titre de section ou Titre de carte** : Titre de section quand la carte regroupe plusieurs éléments (une liste, des cartes, des champs) ou que c'est une surface entière (modale, feuille de menu) ; Titre de carte quand la carte présente un seul objet ou une seule action (un cours, un thème, un groupe, un badge, l'étape suivante), seule ou parmi d'autres semblables.
16. **« De ton formateur » (dashboard apprenant et page Cours) : Titre de section** (21 px · 800 · 1,2). Il regroupe des lignes de cours et, sur la page Cours, il est une section au même niveau que « Thèmes ». Changement visible (18 → 21 px), accepté comme dérive.
17. **Chiffre mis en avant, standard ou grand : critère.** Grand : le nombre est le sujet de l'écran entier (l'écran existe pour le montrer). Standard : le nombre est le sujet d'un bloc.
18. **Fin de quiz : score en pourcentage seulement** (décision produit). Le « 4/5 » est retiré de cet écran ; le pourcentage passe en Chiffre mis en avant grand (48 px · 800 · 1). L'élément « 80 % » en Compteur n'existe plus. Le repère d'étapes (« Quiz · 4/5 ») et le récap (« Meilleur score : 4/5 ») ne changent pas. Totaux : 53 identiques, 176 discrets, 45 visibles, sur 274 éléments.
19. **Titre de section ou Titre de carte : test du nom.** Titre de section : le titre nomme une partie de la page ou du contenu et annonce ce qui suit (section de page, intertitre de leçon, titre Markdown, modale, feuille de menu). Titre de carte : le titre nomme l'objet ou l'action que la carte présente (un cours, un thème, un groupe, un badge, ce qu'on va faire). Test : nom d'une chose (Titre de carte) ou nom d'une partie (Titre de section) ? Remplace la définition de la décision 15, qui comptait le contenu de la carte.
20. **« À retenir » (fiche, aperçu de Création, Détail cours) : Titre de section** (21 px · 800 · 1,2). Il ne nomme aucun objet, il annonce les points qui suivent, comme un intertitre. Changement visible (17 → 21 px), accepté comme dérive. Totaux : 53 identiques, 174 discrets, 47 visibles, sur 274 éléments.
21. **Valeur du Titre de carte : 18 px · 800 · 1,2 confirmé.** L'échelle est une liste fermée (section 2) : 18 px y figure déjà, et l'on ne crée pas de taille pour un seul rôle.
22. **Fin de quiz en pourcentage seul : confirmé aussi pour le quiz flash** (même écran, `EcranFinQuiz`).
23. **Surfaces entières** : une modale ou une feuille de menu prend le Titre de section, quel que soit son texte : elle tient la place d'un écran. Le test du nom vaut pour les cartes et les parties de page. Les titres de modale et de feuille de menu restent en Titre de section.
24. **Titre de carte, définition complétée** : le titre nomme ce que la carte présente (un objet, une action), ou dit où l'on en est (« Raté, mais tu vas retenir ça », « Tu as fini les 12 cours ») ; en dessous, une explication ou une information. Le bloc de correction du quiz et « Tu as fini les N cours » restent en Titre de carte.
25. **Bloc de tête du dashboard apprenant : Titre de carte** (18 px · 800 · 1,2), décidé le 2026-11-05. Le titre du bloc de tête (variantes A, B et C : titre du cours) et « Quiz flash » du bloc E passent du Titre de contenu au Titre de carte. Le rôle suit la fonction du titre, pas la place de la carte : une même carte garde le même rôle de titre en tête, en colonne ou en ligne. Les deux éléments restent des changements visibles (titre du bloc de tête 26 / 32 → 18 px ; « Quiz flash » 34 → 18 px), acceptés comme dérives. Totaux inchangés : 53 identiques, 174 discrets, 47 visibles, sur 274 éléments ; Titre de contenu 4 éléments, Titre de carte 16.
26. **Deux rôles de titre (Titre de page, Titre de contenu, Titre de section, Titre de carte, Titre de ligne) ne prennent jamais la même valeur** (taille, graisse, hauteur de ligne), décidé le 2026-11-05, restreint aux rôles de titre le même jour : entre deux niveaux de titre, seule la valeur montre la hiérarchie. Les autres rôles peuvent partager une valeur quand la forme ou la place les distingue (Bouton et Compteur à 15 px · 800 · 1,2, Texte secondaire et Libellé de champ à 14 px · 600 · 1,2). Règle ajoutée au choix de la valeur d'un rôle (base de calcul). Le Titre de carte reste à 18 px · 800 · 1,2 ; 21 px est refusé parce que c'est la valeur du Titre de section.
27. **Carte ou ligne**, décidé le 2026-11-05 : Un élément posé directement sur la page est une carte (Titre de carte). Un élément répété à l'intérieur d'une carte ou d'une modale est une ligne (Titre de ligne), même s'il a un fond. Phrase ajoutée aux définitions du Titre de carte et du Titre de ligne. Rôles confirmés : groupes de « Tes groupes » (dashboard formateur) et tuiles de la modale Mes badges en Titre de ligne ; nom du badge dans le toast en Pastille. Les cartes de cours assigné du Détail groupe, posées directement sur la page, passent du Titre de ligne au Titre de carte (changement visible, 15 → 18 px, accepté comme dérive). Totaux : 53 identiques, 173 discrets, 48 visibles, sur 274 éléments.
28. **Titre mis en avant : nouveau rôle de titre** (24 / 28 px · 800 · 1,2), décidé le 2026-11-07. Règle : « Titre mis en avant : titre de la carte qui porte l'action principale de l'écran, celle que l'écran existe pour faire. Au plus une par écran. Sur le dashboard apprenant, c'est le bloc de tête, quelle que soit sa variante. Un écran qui propose plusieurs choix de même poids n'en a pas. » Raison : un niveau de titre qui s'applique à plusieurs cartes ne hiérarchise plus rien (c'est pourquoi le niveau grand du Titre de carte a été supprimé, décision 14) ; un rôle limité à une carte par écran, lui, hiérarchise. La décision 26 impose une valeur distincte des autres titres à chaque largeur : 24 px sous 768 px (aucun autre titre), 28 px · 1,2 à partir de 768 px (le Titre de contenu y est à 32 px). 24 px entre dans l'échelle (13 tailles). Éléments rattachés (relevé `~/skillo-rapports/mise-en-avant.md`) : titre du bloc de tête A, B en tête et C, « Quiz flash » du bloc de tête E, « Étape suivante » (leçon et checklist), « Suite du thème » (récap). Restent en Titre de carte : « Quiz flash » en ligne (F), B hors tête, cartes de profil (deux choix de même poids). La décision 25 est remplacée pour le bloc de tête : il quitte le Titre de carte. Totaux inchangés : 54 identiques, 170 discrets, 50 visibles, sur 274 éléments. Complétée le même jour : « La carte porte une seule action, son bouton principal. Une carte qui regroupe plusieurs actions garde son rôle (exemple : « Pour bien démarrer »). » Ne sont pas rattachés : « Pour bien démarrer » (dashboard formateur), qui reste en Titre de section ; l'intitulé de l'étape en cours de la checklist (Corps courant, ce n'est pas un titre de carte) ; les cartes d'action sans titre (« + Assigner un cours », « Assigne ce cours à un groupe… »). Totaux inchangés.

## 11. Écrans à corriger et suites

**Écrans à corriger (étape écrans)**, en plus des changements visibles de la section 3.2 :

- Fin de quiz, quiz de cours et quiz flash (même écran, `EcranFinQuiz`, confirmé par la décision 22) : retirer le « 4/5 » de l'anneau ; le pourcentage s'affiche seul en Chiffre mis en avant grand (48 px · 800 · 1). Le code ne bouge pas à l'étape Écrire.
- Retour encore sans la forme de la variante (rôle Lien texte en attendant) : Création de cours (« Mes cours »).

**À reporter à l'étape Copier pour l'agent** :

- CLAUDE.md, fin de quiz : il décrit l'anneau « avec « 4/5 » 48 px et « 80 % » », à remplacer par le pourcentage seul en 48 px (décision 18). Le paragraphe « Score x/y » dit aussi que l'anneau de fin de quiz utilise les chiffres du passage ; le repère d'étapes et le récap gardent « 4/5 ».
- CLAUDE.md, autres écarts de taille : section 7.

Totaux de la proposition validée, sur 274 éléments : **54 identiques, 169 discrets, 51 visibles** (section 3.1).

## Annexe. Éléments par rôle

✓ identique · discret · ● visible.

**Titre de page** (9) : ✓ H1 de page dans .espace-page (Pages avec navigation, `espace-layout.css:150`) ; ✓ H1 de la carte de flux (Mot de passe oublié / Nouveau mot de passe / Compléter le profil, `shared.css:108`) ; ✓ H1 du parcours (Parcours, `GabaritParcours.css:208`) ; ✓ H1 de page formateur (Espace formateur (Mes cours, Mes groupes, Détail groupe, Détail cours), `Formateur.css:30`) ; ● titre « Belle maîtrise ! » (Fin de quiz, `FicheCours.css:809`) ; · « Salut [Prénom] » (H1) (Dashboard apprenant, `Dashboard.css:21`) ; · « Bonjour [prénom] » (H1) (Dashboard formateur, admin, `DashboardFormateur.css:30`) ; ● « Plus qu'une étape, [Prénom] » (Parcours : Création du compte, `Parcours.css:192`) ; ✓ H1 de l'en-tête desktop (affiché à partir de 1024 px) (Création de cours, `CreationCours.css:1376`).

**Titre de contenu** (4) : ✓ nom du thème (H1) (Détail thème, `DetailTheme.css:75`) ; ● titre du cours (H1) : perd contre .espace-page h1 (Détail cours, `DetailCoursFormateur.css:25`) ; ✓ titre du cours (H1) (Fiche : leçon, récap, `FicheCours.css:222`) ; ● question (Fiche : quiz, Quiz flash, `FicheCours.css:432`).

**Titre mis en avant** (4) : ● « Quiz flash » du bloc de tête E (Dashboard apprenant, `Dashboard.css:440`) ; ● titre du bloc de tête (cours en cours, assigné, cours conseillé) (Dashboard apprenant, `Dashboard.css:360`) ; ● titre de la carte « Étape suivante » (Fiche : leçon, checklist, `FicheCours.css:351`) ; ● titre du cours suivant (Récap, `FicheCours.css:1346`).

**Titre de section** (19) : · h2 par défaut dans .espace-page (Pages avec navigation, `espace-layout.css:163`) ; · titre Markdown niveau 1 (Contenu Markdown, `ContenuMarkdown.css:14`) ; · titre Markdown niveau 2 (hors leçon) (Contenu Markdown, `ContenuMarkdown.css:15`) ; · titre Markdown niveau 3 (Contenu Markdown, `ContenuMarkdown.css:16`) ; ● titre du bloc « De ton formateur » (Dashboard apprenant, Cours, `BlocFormateur.css:21`) ; · titre de carte de section (h2) (Espace formateur, `Formateur.css:54`) ; ● titre de la feuille du menu « … » (Espace formateur (mobile), `Formateur.css:285`) ; ● titre de modale (Espace formateur, Création de cours, `Formateur.css:357`) ; ● titre de l'encadré « À retenir » (Détail cours, `DetailCoursFormateur.css:268`) ; ● intertitre H2 de la leçon (Fiche : leçon, `FicheCours.css:266`) ; ● titre de l'encadré « À retenir » (Fiche : leçon (et aperçu Création, où il est écrasé), `FicheCours.css:294`) ; · titre « Mes badges » (Dashboard apprenant : modale Mes badges, `Dashboard.css:994`) ; · titre de carte (« Tes groupes »…) (Dashboard formateur, admin, `DashboardFormateur.css:102`) ; ● titre « Taux de complétion » (Dashboard formateur, `DashboardFormateur.css:220`) ; · titre « Activité récente » (Dashboard formateur, `DashboardFormateur.css:463`) ; ● titre de la carte (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:657`) ; · titre « Cours assignés » (Détail groupe, `DetailGroupe.css:78`) ; · titre de carte de section (Infos, Leçon…) (Création de cours, `CreationCours.css:253`) ; ● titre de section (« Thèmes », « N résultats ») (Cours, `SectionCours.css:20`).

**Titre de carte** (13) : · titre du toast de complétion (Partagé (fiche), `CompletionToast.css:30`) ; ● titre du bloc de correction (« Bien vu ») (Fiche : quiz, Quiz flash, `FicheCours.css:654`) ; ● nom du badge débloqué (Fin de quiz, `FicheCours.css:886`) ; ● « X étapes sur N » (Fiche : checklist, `FicheCours.css:1062`) ; ● titre de carte blanche / lavande (Dashboard apprenant, `Dashboard.css:143`) ; · titre « Quiz flash » du bloc en ligne F (Dashboard apprenant, `Dashboard.css:477`) ; · titre « Quiz flash » verrouillé (Dashboard apprenant, `Dashboard.css:547`) ; ● titre de la carte de thème (Cours, `SectionCours.css:89`) ; ✓ titre de la carte de cours (Mes cours, `FormateurListes.css:60`) ; ● nom de la carte de groupe (Mes groupes, `FormateurListes.css:88`) ; ● titre de la carte de profil (Parcours : Choix du profil, `Parcours.css:157`) ; ● « Quiz flash » vertical (Dashboard apprenant (desktop, colonne étroite), `Dashboard.css:941`) ; ● titre de la carte de cours assigné (Détail groupe, `DetailGroupe.css:120`).

**Titre de ligne** (17) : · titre de la ligne de cours (Terrain, recherche Cours, `LigneCours.css:47`) ; · titre de cours de la ligne du bloc formateur (Dashboard apprenant, Cours, `BlocFormateur.css:93`) ; ✓ titre de la ligne de cours (Détail thème, `DetailTheme.css:136`) ; · énoncé de question (Détail cours, `DetailCoursFormateur.css:340`) ; ✓ question ratée (Fin de quiz : mes erreurs, `FicheCours.css:953`) ; · titre du cours de l'en-tête compact (H1) (Fiche : checklist, `FicheCours.css:1041`) ; ✓ titre de ligne (Leçon, Quiz, Checklist) (Récap, `FicheCours.css:1311`) ; · nom du badge (Dashboard apprenant : modale Mes badges, `Dashboard.css:1051`) ; · nom du groupe (Dashboard formateur, `DashboardFormateur.css:298`) ; ✓ « Personne à relancer » (Dashboard formateur, `DashboardFormateur.css:440`) ; · titre d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:722`) ; · titre du cours dans le tableau (Dashboard admin, `DashboardFormateur.css:819`) ; · nom de l'élève (Détail groupe, `DetailGroupe.css:183`) ; · énoncé de la question repliée (Création de cours, `CreationCours.css:623`) ; ✓ « Question N » (h3) (Création de cours, `CreationCours.css:655`) ; ● H1 de l'en-tête compact (affiché sous 1024 px) (Création de cours, `CreationCours.css:52`) ; ● titre du cours dans la barre du haut (Fin de quiz, Quiz flash, `FicheCours.css:718`).

**Texte de lecture** (2) : ● premier paragraphe de la leçon (Détail cours, `DetailCoursFormateur.css:212`) ; ✓ texte de la leçon (Fiche : leçon, aperçu Création, `FicheCours.css:253`).

**Corps courant** (19) : · texte de tableau (Contenu Markdown, `ContenuMarkdown.css:95`) ; · texte du toast de complétion (Partagé (fiche), `CompletionToast.css:15`) ; ✓ texte courant (paragraphe) (Espace formateur, modale de confirmation, `Formateur.css:67`) ; · points de l'encadré « À retenir » (Détail cours, `DetailCoursFormateur.css:294`) ; · bonne réponse (Détail cours, `DetailCoursFormateur.css:353`) ; · intitulé d'étape de checklist (Détail cours, `DetailCoursFormateur.css:372`) ; · points de l'encadré « À retenir » (Fiche : leçon, `FicheCours.css:321`) ; ✓ explication de la correction (Fiche : quiz, Quiz flash, `FicheCours.css:662`) ; · ligne « Ta réponse / Bonne réponse » (Fin de quiz : mes erreurs, `FicheCours.css:963`) ; · explication (Fin de quiz : mes erreurs, `FicheCours.css:977`) ; · consigne de remise en ordre (Fiche : checklist (remise en ordre), `FicheCours.css:1081`) ; · intitulé d'étape (Fiche : checklist, `FicheCours.css:1172`) ; ● intitulé de l'étape en cours (Fiche : checklist, `FicheCours.css:1205`) ; · texte de relance (Dashboard formateur, `DashboardFormateur.css:366`) ; · texte de l'événement (Dashboard formateur, `DashboardFormateur.css:602`) ; ● cellules chiffrées du tableau (Dashboard admin (desktop), `DashboardFormateur.css:1064`) ; · cellules du tableau des élèves (Détail groupe (desktop), `DetailGroupe.css:350`) ; ● en-têtes de colonne du tableau des élèves, état (Détail groupe (desktop), `DetailGroupe.css:338`) ; ● en-têtes de colonne du tableau, état (Dashboard admin (desktop), `DashboardFormateur.css:1045`).

**Texte secondaire** (32) : · phrase d'explication sous le H1 (Mot de passe oublié, `shared.css:119`) ; · message d'erreur (.message) (Partagé, `shared.css:358`) ; · texte d'état vide (Terrain, Détail thème, Détail groupe, `shared.css:512`) ; · message de résultat de la remise en ordre (Fiche : checklist (remise en ordre), `quiz.css:85`) ; ● sous-titre sous le H1 (Parcours, `GabaritParcours.css:215`) ; · message d'erreur (Parcours, `GabaritParcours.css:365`) ; ● sous-titre de l'en-tête lavande (Cours, Terrain, `EntetePage.css:35`) ; · sous-titre sous le H1 (« N élèves · N cours ») (Espace formateur, `Formateur.css:37`) ; · sous-titre de modale (Espace formateur, `Formateur.css:363`) ; · « x cours terminés sur y » (Détail thème, `DetailTheme.css:88`) ; · « Plusieurs réponses possibles » (Fiche : quiz, Quiz flash, `FicheCours.css:445`) ; · sous-titre « Une seule erreur à revoir. » (Fin de quiz, `FicheCours.css:816`) ; · phrase d'état (« Leçon lue. Reste le quiz ») (Dashboard apprenant, `Dashboard.css:388`) ; ✓ phrase du bloc de tête E (Dashboard apprenant, `Dashboard.css:449`) ; · « 3 cours · 1 groupe · 12 élèves » (Dashboard formateur, admin, `DashboardFormateur.css:36`) ; · note sous une carte (Dashboard formateur, `DashboardFormateur.css:133`) ; · note 14 px (Pour bien démarrer) (Dashboard formateur, `DashboardFormateur.css:139`) ; · texte d'état vide (Dashboard formateur, admin, `DashboardFormateur.css:144`) ; · confirmation d'envoi de relance (Dashboard formateur, `DashboardFormateur.css:376`) ; ✓ titre du cours tronqué sous le H1 (Création de cours (< 1024), `CreationCours.css:60`) ; · aide sous un champ (Création de cours, `CreationCours.css:272`) ; · message d'erreur (Création de cours, `CreationCours.css:279`) ; · message de la barre d'enregistrement (Création de cours, `CreationCours.css:1075`) ; · « Aucun cours ne correspond… » (Cours, `SectionCours.css:28`) ; · aide sous un champ (mot de passe) (Parcours, `Parcours.css:17`) ; · texte du bloc lavande (Parcours : Création du compte, `Parcours.css:199`) ; · phrase du quiz flash vertical (Dashboard apprenant (desktop, colonne étroite), `Dashboard.css:952`) ; · condition du badge (Fin de quiz, `FicheCours.css:892`) ; · critère de validation (Fiche : checklist, `FicheCours.css:1221`) ; · condition du badge (Dashboard apprenant : modale Mes badges, `Dashboard.css:1057`) ; · sous-titre d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:727`) ; · description de la carte de profil (Parcours : Choix du profil, `Parcours.css:162`).

**Méta** (38) : · méta de la ligne de cours (Terrain, recherche Cours, `LigneCours.css:54`) ; · compteur « N cours » du bloc formateur (Cours, `BlocFormateur.css:44`) ; · méta (« X terminés sur N »…) (Espace formateur, `Formateur.css:73`) ; · détail sous le libellé de case (Modale d'assignation, `Formateur.css:532`) ; · contenu « Leçon · Quiz · Checklist » (Détail thème, `DetailTheme.css:143`) ; · légende de la barre d'avancement (Détail cours, `DetailCoursFormateur.css:96`) ; ✓ libellé des petites cartes d'avancement (Détail cours, `DetailCoursFormateur.css:141`) ; · texte du bandeau « Aperçu élève » (Aperçu élève, `FicheCours.css:104`) ; · « N min de lecture » / « X XP gagnés » (Fiche : leçon, récap, `FicheCours.css:234`) ; · détail « N questions · +20 XP » (Fiche : leçon, checklist, `FicheCours.css:358`) ; · « +15 XP à la fin » (Fiche : checklist, `FicheCours.css:1067`) ; · détail de ligne (« Meilleur score : 4/5 ») (Récap, `FicheCours.css:1316`) ; · contenu du cours suivant (Récap, `FicheCours.css:1352`) ; ✓ sous-texte (thème, condition du badge) (Dashboard apprenant, `Dashboard.css:149`) ; · méta du cours assigné (« thème · ajouté hier ») (Dashboard apprenant, `Dashboard.css:426`) ; · méta « 10 questions · +30 XP » (Dashboard apprenant, `Dashboard.css:482`) ; ✓ consigne du quiz flash verrouillé (Dashboard apprenant, `Dashboard.css:552`) ; · « Obtenu le JJ/MM » (Dashboard apprenant : modale Mes badges, `Dashboard.css:1062`) ; · sous-titre « Sur l'ensemble de tes groupes » (Dashboard formateur, `DashboardFormateur.css:225`) ; · « N élèves · N cours » (Dashboard formateur, `DashboardFormateur.css:304`) ; · « Actif aujourd'hui » (Dashboard formateur, `DashboardFormateur.css:311`) ; · date « Il y a N jours » (Dashboard formateur, `DashboardFormateur.css:370`) ; · « Tous tes élèves ont commencé… » (Dashboard formateur, `DashboardFormateur.css:446`) ; ✓ statut « Quiz 90 % / En cours » (Dashboard formateur, `DashboardFormateur.css:640`) ; · « N étapes sur 3 » (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:663`) ; · libellé de carte chiffrée (Dashboard admin, `DashboardFormateur.css:771`) ; · précision « 30 derniers jours » (Dashboard admin, `DashboardFormateur.css:783`) ; · thème court sous le titre (Dashboard admin, `DashboardFormateur.css:826`) ; ✓ résumé « 42 commencés · 18 terminés » (Dashboard admin (mobile), `DashboardFormateur.css:831`) ; · email de l'élève (Détail groupe, `DetailGroupe.css:190`) ; · statut par cours dans la carte élève (Détail groupe (mobile), `DetailGroupe.css:242`) ; ✓ compteur du sommaire (Création de cours (≥ 1024), `CreationCours.css:191`) ; · nom d'image en étiquette (Création de cours, `CreationCours.css:519`) ; ✓ méta « Réponse unique · 3 réponses » (Création de cours, `CreationCours.css:632`) ; · sous-titre de mode de checklist (Création de cours (≥ 768), `CreationCours.css:901`) ; · compte « y cours » de la carte de thème (Cours, `SectionCours.css:105`) ; · méta de carte (Mes cours, Mes groupes, `FormateurListes.css:64`) ; · ligne « Cours terminés » (Mes groupes, `FormateurListes.css:101`).

**Surtitre** (11) : ✓ surtitre « Thème N » (Détail thème, `DetailTheme.css:66`) ; ✓ thème au-dessus du titre (Fiche : leçon, récap, `FicheCours.css:215`) ; ✓ libellé « Étape suivante » de la carte encre (Fiche : leçon, checklist, `FicheCours.css:344`) ; ✓ libellé du cours au-dessus de la question (Fiche : quiz, Quiz flash, `FicheCours.css:426`) ; ✓ « Quiz terminé » (Fin de quiz, `FicheCours.css:763`) ; · thème de l'en-tête compact (Fiche : checklist, `FicheCours.css:1033`) ; ✓ libellé « Suite du thème » (Récap, `FicheCours.css:1339`) ; ✓ libellé violet (« Ton premier cours »…) (Dashboard apprenant, `Dashboard.css:131`) ; ● libellé sur carte violette (« Tu en es là ») (Dashboard apprenant, `Dashboard.css:137`) ; ✓ intertitre de jour (« Aujourd'hui ») (Dashboard formateur, `DashboardFormateur.css:549`) ; · surtitre « Thème N » de la carte de thème (Cours, `SectionCours.css:82`).

**Bouton** (25) : · libellé du bouton principal (Partagé, `shared.css:200`) ; · libellé du bouton secondaire (Partagé, `shared.css:230`) ; · libellé du bouton orange (quiz flash) (Dashboard apprenant, `shared.css:255`) ; · bouton pointillé « + Ajouter… » (Création de cours, `shared.css:380`) ; · libellé du bouton du parcours (écrasé par .bouton-primaire / .bouton-secondaire) (Parcours, `GabaritParcours.css:86`) ; · « Annuler » (bouton secondaire sur design-system ; lien texte en prod) (Modales, barre de Création de cours, `Formateur.css:397`) ; · libellé du bouton rouge (Modale de confirmation, `Formateur.css:411`) ; ✓ bouton Retour « Cours » (Détail thème, `DetailTheme.css:21`) ; ✓ bouton Retour (nom court du thème) (Fiche, `FicheCours.css:170`) ; · libellé du bouton blanc (Fiche : leçon, checklist, `FicheCours.css:374`) ; · libellé du bouton « Valider ma réponse » (Fiche : quiz, Quiz flash, `FicheCours.css:685`) ; · libellé du bouton principal (Fin de quiz, `FicheCours.css:901`) ; · libellé des boutons « Relire / Refaire / Revoir » (Récap, `FicheCours.css:1323`) ; · libellé du bouton blanc à flèche (Dashboard apprenant, `Dashboard.css:222`) ; · libellé du bouton large orange (Dashboard apprenant, `Dashboard.css:255`) ; ✓ libellé du bouton « Commencer » (Dashboard apprenant, `Dashboard.css:410`) ; ✓ libellé du bouton « Lancer » (Dashboard apprenant, `Dashboard.css:495`) ; · libellé du bouton d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:740`) ; ✓ carte pointillée « + Assigner un cours » (Détail groupe, `DetailGroupe.css:137`) ; · bouton d'outil « Image / Vidéo » (Création de cours, `CreationCours.css:438`) ; · bouton « Image » d'étape (Création de cours, `CreationCours.css:1038`) ; · bouton « Lancer » vertical (Dashboard apprenant (desktop, colonne étroite), `Dashboard.css:960`) ; ✓ bouton « Supprimer ce groupe » (contour rouge) (Détail groupe, `Formateur.css:433`) ; ✓ bouton Retour « Mes cours / Mes groupes » (Espace formateur, `Formateur.css:161`) ; ● bouton Retour « Connexion » (Mot de passe oublié, `shared.css:321`).

**Lien texte** (16) : · entrée du menu (Se déconnecter) (Navigation, `espace-layout.css:123`) ; · lien secondaire (simuler le lien) (Mot de passe oublié, `shared.css:343`) ; ✓ lien sous le bouton (« Déjà un compte ? … ») (Parcours, `GabaritParcours.css:106`) ; · lien « Passer » (Parcours : Introduction, `GabaritParcours.css:135`) ; · action du menu « … » (Espace formateur, `Formateur.css:297`) ; · bouton « Quitter l'aperçu » (Aperçu élève, `FicheCours.css:115`) ; · lien « Revoir la leçon » (Fiche : quiz, Quiz flash, `FicheCours.css:673`) ; · liens « Revoir mes erreurs »… (Fin de quiz, `FicheCours.css:919`) ; · lien « Passer cette étape » (Fiche : checklist, `FicheCours.css:1153`) ; · lien « Tout voir » / « Mes badges · X/6 » (Dashboard apprenant, Cours, `Dashboard.css:166`) ; · lien « Tout voir » (Dashboard formateur, admin, `DashboardFormateur.css:112`) ; · lien « Voir les N autres » / « Voir plus » (Dashboard formateur, `DashboardFormateur.css:128`) ; · lien « Assigner » (Détail groupe, `DetailGroupe.css:87`) ; · lien « Voir les N autres » (Détail groupe, `DetailGroupe.css:255`) ; · bouton Retour « Mes cours » (Création de cours (≥ 1024), `CreationCours.css:144`) ; · liens « Voir comme un élève » / « Créer un groupe » (Création de cours, `CreationCours.css:208`).

**Navigation** (6) : · libellé d'entrée de la tab bar (mobile) (Navigation, `espace-layout.css:48`) ; · libellé d'étape (Leçon, Quiz · 4/5…) (Fiche : leçon, checklist, `ReperEtapes.css:67`) ; · pastilles de filtre « Tout / Commencés / Terminés » (Dashboard formateur, `DashboardFormateur.css:494`) ; · pastille de section collante (Création de cours (< 1024), `CreationCours.css:94`) ; · entrée du sommaire (Création de cours (≥ 1024), `CreationCours.css:181`) ; · onglet « Écrire / Aperçu » (Création de cours, `CreationCours.css:409`).

**Libellé de champ** (4) : · libellé de champ (.champ) (Partagé (modales, Détail groupe, Mes cours, mot de passe), `shared.css:126`) ; ● libellé de champ (Parcours, `GabaritParcours.css:228`) ; · libellé de champ (Création de cours, `CreationCours.css:266`) ; · libellé « Bonne réponse » (Création de cours, `CreationCours.css:832`).

**Saisie et choix** (18) : · saisie de champ input (.champ) (Partagé, `shared.css:136`) ; · saisie de champ textarea (.champ) (Partagé, `shared.css:148`) ; ✓ saisie de champ (Parcours, `GabaritParcours.css:248`) ; ● saisie du grand champ (prénom, organisme…) (Parcours : questions, `GabaritParcours.css:269`) ; · ligne de choix (statut, âge, motivation) (Parcours : questions, `GabaritParcours.css:296`) ; · saisie de la recherche (Cours, `EntetePage.css:48`) ; · valeur affichée de la liste déroulante (Création de cours, Mes cours, `Dropdown.css:12`) ; · option de la liste déroulante (Création de cours, Mes cours, `Dropdown.css:61`) ; · libellé de case à cocher (Modale d'assignation, Création de cours, `Formateur.css:527`) ; ✓ texte de réponse (Fiche : quiz, Quiz flash, `FicheCours.css:467`) ; ● saisie « Un élève » (Dashboard formateur, `DashboardFormateur.css:531`) ; ✓ saisie de l'email d'ajout (Détail groupe, `DetailGroupe.css:46`) ; · bouton de choix (groupe, mode de checklist) (Création de cours, `CreationCours.css:327`) ; · saisie de l'éditeur de leçon (Création de cours, `CreationCours.css:458`) ; · saisie de réponse / d'explication (Création de cours, `CreationCours.css:767`) ; ● saisie d'explication (Création de cours, `CreationCours.css:776`) ; ● libellé de mode de checklist (Création de cours, `CreationCours.css:895`) ; · saisie de l'intitulé d'étape (Création de cours, `CreationCours.css:961`).

**Pastille** (24) : · pastille de statut (Nouveau, À faire, Non commencé) (Partagé (Cours, Dashboard, Détail groupe…), `espace-layout.css:252`) ; ✓ pastille de statut En cours / Terminé (Partagé, `espace-layout.css:275`) ; · nom du badge dans le toast (Partagé (fiche), `CompletionToast.css:48`) ; ✓ numéro dans la pastille d'étape (Fiche : leçon, checklist, `ReperEtapes.css:56`) ; · pastille de groupe / « Non assigné » (Espace formateur, `Formateur.css:178`) ; ● « +N » sur la dernière miniature (Détail cours, `DetailCoursFormateur.css:246`) ; ✓ numéro de question (Détail cours, `DetailCoursFormateur.css:328`) ; · pastille « Ta réponse » / « Bonne réponse » (Fiche : quiz, Quiz flash, `FicheCours.css:606`) ; ● pastille « +20 XP » (Fin de quiz, `FicheCours.css:830`) ; · pastille « Nouveau badge » (Fin de quiz, `FicheCours.css:881`) ; ✓ numéro dans la pastille d'étape (Fiche : checklist, `FicheCours.css:1109`) ; · pastille « Bloquante » (Fiche : checklist, `FicheCours.css:1215`) ; · « X XP gagnés » (pastille Terminé) (Récap, `FicheCours.css:1276`) ; · pastille « De ton formateur » (Dashboard apprenant, `Dashboard.css:191`) ; · pastille orange « Défi du jour » (Dashboard apprenant, `Dashboard.css:206`) ; ✓ pastille « Compte officiel » (Dashboard admin, `DashboardFormateur.css:63`) ; · pastille « À surveiller / Bon rythme » (Dashboard formateur, `DashboardFormateur.css:236`) ; · initiales sur rond lavande (Dashboard formateur, `DashboardFormateur.css:596`) ; · pastille du groupe (Dashboard formateur, `DashboardFormateur.css:626`) ; ● numéro dans le rond (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:695`) ; · pastille « Compte officiel : ce cours sera public » (Création de cours, `CreationCours.css:236`) ; · numéro de question / d'étape (Création de cours, `CreationCours.css:575`) ; ● lettre de réponse (Création de cours, `CreationCours.css:751`) ; · pilule « Bloquante » (Création de cours, `CreationCours.css:1013`).

**Chiffre mis en avant (standard)** (3) : ✓ chiffre des petites cartes d'avancement (Détail cours, `DetailCoursFormateur.css:130`) ; ✓ taux de complétion (chiffre) (Dashboard formateur, `DashboardFormateur.css:206`) ; ● chiffre de carte (Dashboard admin, `DashboardFormateur.css:777`).

**Chiffre mis en avant (grand)** (1) : ✓ score en pourcentage dans l'anneau (« 80 % », remplace « 4/5 » par décision produit) (Fin de quiz, `FicheCours.css:795`).

**Compteur** (9) : ● compteur « 2 / 5 » (Parcours : questions, `GabaritParcours.css:195`) ; · « +15 XP » du toast (Partagé (fiche), `CompletionToast.css:39`) ; ✓ compteur « 3 / 5 » (Fiche : quiz, Quiz flash, `FicheCours.css:413`) ; ● « [N] XP » de l'en-tête (Dashboard apprenant, `Dashboard.css:30`) ; · compteur de barre « X / 3 » (Dashboard apprenant, `Dashboard.css:318`) ; ● compteur de barre, petite variante (Dashboard apprenant, `Dashboard.css:323`) ; ● pourcentage dans l'anneau (Dashboard apprenant, `Dashboard.css:382`) ; ✓ compteur « X/6 » (Dashboard apprenant : modale Mes badges, `Dashboard.css:1001`) ; · % de la barre du groupe (Dashboard formateur, `DashboardFormateur.css:330`).
