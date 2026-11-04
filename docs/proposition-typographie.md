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
- **Valeur d'un rôle** : la combinaison taille mobile · taille desktop · graisse · hauteur de ligne qui **minimise le nombre de changements visibles** ; à égalité, celle qui change le moins d'éléments ; puis le plus petit écart cumulé (px et crans). Les tailles et hauteurs de ligne candidates sont celles que portent déjà les éléments du rôle en prod (voir section 9 pour des valeurs intermédiaires). Valeurs fixées : Corps courant (15 px, 500, 1,45) et Texte de lecture (17 / 18 px, 500, 1,55).
- Tailles en px entiers, sortie en rem base 16. Graisses 500 à 800. Contrôles de formulaire et boutons : famille et graisse de leur rôle. Hauteur de ligne 1,2 là où rien n'est déclaré. Seuil unique 768 px pour la typographie.

**Critère de fusion (lecture validée).** Deux rôles candidats fusionnent si leurs valeurs dominantes (combinaison la plus fréquente) diffèrent **d'au plus 1 px et d'au plus un cran de graisse** (les deux peuvent se cumuler), ou si l'écart vient d'un accident (taille issue d'un rem, valeur écrasée). Le critère est nécessaire mais pas suffisant : deux rôles aux valeurs proches mais aux fonctions différentes (Titre de ligne et Lien texte, tous deux à 15 px 800) restent séparés.

## 1. Rôles

18 rôles. Titre de carte et Chiffre mis en avant ont chacun deux niveaux, soit 20 jeux de valeurs.

| Rôle | Fonction | Taille mobile | Taille desktop | Graisse | Hauteur de ligne | Espacement des lettres | Éléments |
|---|---|---|---|---|---|---|---|
| Titre de page | Nomme l'écran ; un seul par écran, en tête | 34 px | 44 px | 800 | 1,1 | normal | 9 |
| Titre de contenu | Nomme l'objet que l'écran présente (cours, thème, question) | 28 px | 32 px | 800 | 1,1 | normal | 6 |
| Titre de section | Ouvre une partie de page ou une surface (section, carte de section, modale, feuille de menu) | **21 px** | **21 px** | 800 | 1,2 | normal | 16 |
| Titre de carte, standard | Nomme une carte ou un bloc compact | **18 px** | **18 px** | 800 | 1,2 | normal | 8 |
| Titre de carte, grand | Nomme une grande carte mise en avant dans son écran | 22 px | 22 px | 800 | 1,1 | normal | 9 |
| Titre de ligne | Nomme un élément de liste, ou rappelle un titre dans une barre compacte | **16 px** | **16 px** | 800 | 1,2 | normal | 17 |
| Texte de lecture | Texte de la leçon, dans la fiche et dans son aperçu | 17 px | 18 px | 500 | 1,55 | normal | 2 |
| Corps courant | Phrases lues ailleurs que dans la leçon : explications, paragraphes, intitulés, réponses affichées | 15 px | 15 px | 500 | 1,45 | normal | 19 |
| Texte secondaire | Phrase qui accompagne un titre ou un contenu : sous-titre, état, aide, erreur, message | 14 px | 14 px | **600** | 1,2 | normal | 27 |
| Méta | Information courte et factuelle sur un élément : contenu, date, compte, statut | 13 px | 13 px | **600** | 1,2 | normal | 45 |
| Surtitre | Libellé court posé au-dessus d'un titre (thème, « Tu en es là ») | 13 px | 13 px | 700 | 1,2 | normal | 12 |
| Bouton | Libellé d'un bouton (plein, contour, pointillé, Retour) | **15 px** | **15 px** | 800 | 1,2 | normal | 22 |
| Lien texte | Action écrite sans forme de bouton et sans état choisi, qui agit ou mène ailleurs une fois (« Tout voir », « Revoir la leçon », « Passer cette étape », « Voir comme un élève ») | 15 px | 15 px | **700** | 1,2 | normal | 19 |
| Navigation | Option qui reste marquée comme choisie, dont le choix change ce qu'on voit (écran, vue, filtre) sans agir sur les données (barre d'onglets, onglets « Écrire / Aperçu », filtres, entrées de menu qui mènent à un écran ou à une vue et restent marquées comme choisies, repère d'étapes) | 14 px | 14 px | 700 | 1,2 | normal | 6 |
| Libellé de champ | Nomme un champ de formulaire | 14 px | 14 px | **600** | 1,2 | normal | 4 |
| Saisie et choix | Texte tapé ou choisi par l'utilisateur. 16 px est une contrainte technique : Safari sur iOS agrandit la page quand on touche un champ dont le texte fait moins de 16 px | 16 px | 16 px | 600 | 1,2 | normal | 18 |
| Pastille | Texte d'une pastille, numéros dans une pastille ronde compris | 13 px | 13 px | 800 | 1,2 | normal | 24 |
| Chiffre mis en avant, standard | Nombre qui est le sujet de son bloc : le bloc existe pour le montrer (carte de statistique, taux de complétion) | 28 px | 28 px | 800 | 1 | normal | 3 |
| Chiffre mis en avant, grand | Nombre sujet de son bloc, au grand niveau : score de fin de quiz | 48 px | 48 px | 800 | 1 | normal | 1 |
| Compteur | Nombre qui n'est pas le sujet de son bloc : position, avancement, total ou gain qui accompagne le sujet du bloc (« 3 / 5 » d'un quiz, XP de l'en-tête, pourcentage de l'anneau, « +15 XP ») | **15 px** | **15 px** | 800 | 1,2 | normal | 10 |

En gras : valeurs qui changent par rapport à la version 2 (Saisie et choix revient à 16 px par décision finale ; Compteur passe à 15 px depuis que l'XP du dashboard y est rattaché). Navigation garde la valeur de la version 2 (14 px · 700 · 1,2) depuis que « Se déconnecter » et les actions du menu « … » sont passés en Lien texte.

**Chiffre mis en avant ou Compteur : test binaire.** Si le nombre est le sujet du bloc (le bloc existe pour le montrer), c'est un Chiffre mis en avant. Sinon, c'est un Compteur : position, avancement, total ou gain qui accompagne le sujet du bloc. Un nombre a un rôle et un seul ; la forme du nombre (pourcentage, fraction, entier) ne décide jamais.

Vérification des éléments rattachés aux deux rôles :

| Élément | Rôle | Sujet du bloc | Conforme au test ? |
|---|---|---|---|
| Taux de complétion (Dashboard formateur) | Chiffre mis en avant, standard | le taux lui-même | oui |
| Chiffre des petites cartes d'avancement (Détail cours) | Chiffre mis en avant, standard | chaque petite carte montre une statistique | oui |
| Chiffre des cartes du dashboard admin | Chiffre mis en avant, standard | chaque carte montre une statistique | oui |
| Score « 4/5 » de fin de quiz | Chiffre mis en avant, grand | le résultat du quiz | oui |
| Compteur « 2 / 5 » du parcours | Compteur | la question en cours | oui |
| Compteur « 3 / 5 » du quiz | Compteur | la question en cours | oui |
| Compteur « X / 3 » du quiz flash verrouillé (et sa petite variante) | Compteur | le déblocage du quiz flash | oui |
| Compteur « X/6 » de la modale Mes badges | Compteur | la collection de badges | oui |
| % de la barre d'un groupe (Dashboard formateur) | Compteur | le groupe | oui |
| « [N] XP » de l'en-tête (Dashboard apprenant) | Compteur | l'élève et son tableau de bord | oui |
| Pourcentage de l'anneau (Dashboard apprenant) | Compteur | le cours en cours | oui |
| « 80 % » sous le score de fin de quiz | Compteur | le score « 4/5 », que ce pourcentage accompagne | oui |
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
| « Supprimer ce groupe », « Quitter l'aperçu », « Assigner », « Voir comme un élève », « Créer un groupe », lien sous le bouton du parcours, « Simuler l'ouverture du lien » | Lien texte | non | agit ou mène ailleurs une fois | oui |
| Libellés de Retour encore écrits sans forme de bouton (voir ci-dessous) | Lien texte | non | mène ailleurs une fois | oui pour le critère b ; dérives à corriger vers la variante Retour |

**Libellé du bouton Retour : rôle Bouton.** La variante Retour (pilule blanche, padding, zone de 44 px) a une forme de bouton, et Lien texte est défini comme une action sans forme de bouton. Vérification dans le code :

| Élément | Forme dans le code | Rôle |
|---|---|---|
| Retour « Cours » du Détail thème (`.theme-retour`, `DetailTheme.css`) | pilule blanche, 44 px, padding 12 / 18 px, chevron 18 px | **Bouton** (déplacé depuis Lien texte) |
| Retour de la fiche, nom court du thème (`.fiche-retour`, `FicheCours.css`) | pilule blanche, 44 px, padding 12 / 18 px, chevron 18 px | **Bouton** (déplacé depuis Lien texte) |
| Retour de Création de cours, « Mes cours » / « Détail du cours » (`.cc-retour`, `CreationCours.css`) | rond blanc de 44 px suivi du texte, sans pilule | reste Lien texte ; **dérive** à corriger vers la variante (étape écrans) |
| Retour de l'espace formateur sur desktop, « ‹ Mes cours / Mes groupes » (`.fm-retour-texte`, `Formateur.css`) | texte violet sans fond (rond blanc seul sur mobile) | reste Lien texte ; **dérive** à corriger vers la variante (étape écrans) |
| « ← Retour » de Mot de passe oublié (`.lien-retour`, `shared.css`) | texte violet sans fond | reste Lien texte ; **dérive** à corriger vers la variante (étape écrans) |

**Écart de source : origin/main et design-system.** Le relevé a été fait sur origin/main (prod). Chaque élément a été comparé à son rendu sur design-system (corrections de la session 6 : variante Retour, « Annuler » en bouton secondaire, Modale de confirmation, Menu d'actions, focus). Différences :

| Élément | origin/main | design-system | Effet sur la proposition |
|---|---|---|---|
| « Annuler » (modale de confirmation, modales Nouveau groupe, Insérer une vidéo, Assigner des cours / à des groupes, barre d'enregistrement de Création de cours) | lien texte `.fm-lien-action`, 16 px · 800 | bouton secondaire `.bouton-secondaire`, 16 px · 700 | **rattachement corrigé** : Lien texte → Bouton (décision déjà écrite dans la doc du DS : « Annuler » est un bouton secondaire). Rendu actuel pris sur design-system ; le changement reste discret (16 → 15 px, 700 → 800). |
| Titre, sous-titre et texte de la Modale ; bouton rouge de la Modale de confirmation | `.fm-modale-titres h2` 24 px · 800, `.fm-modale-titres p` 15 px, `.fm-texte` 15 px · 1,45, `.fm-bouton-danger` 16 px · 800 | `.modale-titres h2`, `.modale-titres p`, `.modale-texte`, `.modale-bouton-danger` (`src/components/Modale.css`), mêmes valeurs | aucun (composant déplacé, valeurs identiques) |
| Variante Retour (Détail thème, fiche) | padding 12 / 18 px | padding 12 / 20 px | aucun (espacement, pas typographie) |
| Menu d'actions, focus des boutons et de la Modale | | comportement clavier et contour de focus | aucun (pas de propriété typographique) |

Aucun autre élément du relevé ne diffère. Aucun cas ne demande de nouvelle décision. La page /design-system, qui n'existe que sur design-system, reste hors relevé.

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
- « X étapes sur N » (Checklist, 20 px) : titre de la carte de progression, l'élément le plus visible de l'écran après le titre ; 2 px du grand niveau comme du standard ; le rôle de titre de la carte la plus visible de l'écran décide ;
- titre du bloc de correction du quiz (« Bien vu », 20 px) : même famille que les cartes encre de la fiche, qui sont au grand niveau ;
- « Quiz flash » en version verticale (desktop, colonne étroite, 28 px) : seul titre d'une carte haute, plus proche du grand niveau.

**Titre de carte, standard (18 px)** : titres « À retenir » (fiche et Détail cours), « Quiz flash » verrouillé, carte de thème (15 / 18 px), carte de cours de Mes cours (18 px), titre du toast. Cas limite : « Quiz flash » du bloc en ligne (19 px) reste au standard, le bloc étant une ligne compacte et 19 px étant à 1 px du standard (18) et à 3 px du grand niveau.

**Chiffre mis en avant, grand (48 px)** : score « 4/5 » de fin de quiz, seul élément.

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

13 tailles en px entiers (accepté). Chacune sert au moins un rôle.

| Taille | rem | Rôles |
|---|---|---|
| 13 px | 0,8125 rem | Méta, Surtitre, Pastille |
| 14 px | 0,875 rem | Texte secondaire, Navigation, Libellé de champ |
| 15 px | 0,9375 rem | Corps courant, Bouton, Lien texte, Compteur |
| 16 px | 1 rem | Titre de ligne, Saisie et choix |
| 17 px | 1,0625 rem | Texte de lecture (mobile) |
| 18 px | 1,125 rem | Titre de carte standard, Texte de lecture (desktop) |
| 21 px | 1,3125 rem | Titre de section |
| 22 px | 1,375 rem | Titre de carte grand |
| 28 px | 1,75 rem | Titre de contenu (mobile), Chiffre mis en avant standard |
| 32 px | 2 rem | Titre de contenu (desktop) |
| 34 px | 2,125 rem | Titre de page (mobile) |
| 44 px | 2,75 rem | Titre de page (desktop) |
| 48 px | 3 rem | Chiffre mis en avant grand |

Pas de taille intermédiaire absente de la prod (27 et 21 px pour Titre de contenu et Titre de carte grand refusés). Les 21 px du Titre de section restent : c'est une taille de la prod (intertitre de la leçon, titre de la modale Mes badges).

Par rapport à la version 2 : 20 px sort, 21 px entre. 15 px est la taille la plus partagée (quatre rôles). Trois rôles changent de taille à 768 px : Titre de page, Titre de contenu, Texte de lecture.

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
| **Version 3 validée, rendu de design-system (« Annuler » en Bouton)** | **57** | **178** | **40** | **218** |

Sur 275 éléments. Les 40 changements visibles sont acceptés comme dérives à corriger (section 10). Les deux libellés de Retour passés en Bouton deviennent identiques (15 px · 800 en prod comme dans le rôle) ; les valeurs des rôles Bouton et Lien texte ne changent pas. Le passage de « Se déconnecter » et des actions du menu « … » en Lien texte laisse les totaux identiques (deux changements discrets dans les deux cas) mais ramène Navigation à 14 px. Enfin, l'option choisie d'une Navigation passe à 800 (un cran, changement discret) : chaque élément de Navigation qui a un état choisi est compté comme changé. Les 6 éléments de Navigation sont concernés ; deux d'entre eux, identiques jusque-là (pastilles de filtre du dashboard formateur, onglets « Écrire / Aperçu »), deviennent discrets. « Annuler », passé en Bouton d'après son rendu sur design-system, reste un changement discret : les totaux ne bougent pas.

| Rôle | Valeur v3 avant décisions | Valeur finale | Éléments | Identique | Discret | Visible |
|---|---|---|---|---|---|---|
| Titre de page | 34 / 44 px · 800 · 1,1 | 34 / 44 px · 800 · 1,1 | 9 | 5 | 2 | 2 |
| Titre de contenu | 28 / 32 px · 800 · 1,1 | 28 / 32 px · 800 · 1,1 | 6 | 2 | 0 | 4 |
| Titre de section | 21 px · 800 · 1,2 | 21 px · 800 · 1,2 | 16 | 0 | 10 | 6 |
| Titre de carte (standard) | 18 px · 800 · 1,2 | 18 px · 800 · 1,2 | 8 | 2 | 5 | 1 |
| Titre de carte (grand) | 22 px · 800 · 1,1 | 22 px · 800 · 1,1 | 9 | 3 | 1 | 5 |
| Titre de ligne | 16 px · 800 · 1,2 | 16 px · 800 · 1,2 | 17 | 5 | 11 | 1 |
| Texte de lecture | 17 / 18 px · 500 · 1,55 | 17 / 18 px · 500 · 1,55 | 2 | 1 | 0 | 1 |
| Corps courant | 15 px · 500 · 1,45 | 15 px · 500 · 1,45 | 17 | 2 | 13 | 2 |
| Texte secondaire | 14 px · 600 · 1,2 | 14 px · 600 · 1,2 | 27 | 2 | 23 | 2 |
| Méta | 13 px · 600 · 1,2 | 13 px · 600 · 1,2 | 45 | 7 | 37 | 1 |
| Surtitre | 13 px · 700 · 1,2 | 13 px · 700 · 1,2 | 12 | 9 | 2 | 1 |
| Bouton | 15 px · 800 · 1,2 | 15 px · 800 · 1,2 | 22 | 5 | 17 | 0 |
| Lien texte | 15 px · 700 · 1,2 | 15 px · 700 · 1,2 | 19 | 1 | 18 | 0 |
| Navigation | 15 px · 700 · 1,2 | 14 px · 700 · 1,2 **(changé)** | 6 | 0 | 6 | 0 |
| Libellé de champ | 14 px · 600 · 1,2 | 14 px · 600 · 1,2 | 4 | 0 | 3 | 1 |
| Saisie et choix | 15 px · 600 · 1,2 | 16 px · 600 · 1,2 **(changé)** | 18 | 3 | 11 | 4 |
| Pastille | 13 px · 800 · 1,2 | 13 px · 800 · 1,2 | 24 | 5 | 15 | 4 |
| Chiffre mis en avant (standard) | 28 px · 800 · 1 | 28 px · 800 · 1 | 3 | 2 | 0 | 1 |
| Chiffre mis en avant (grand) | 48 px · 800 · 1 | 48 px · 800 · 1 | 1 | 1 | 0 | 0 |
| Compteur | 14 px · 800 · 1,2 | 15 px · 800 · 1,2 **(changé)** | 10 | 2 | 4 | 4 |
| **Total** | | | **275** | **57** | **178** | **40** |

### 3.2 Changements visibles

Tous les changements visibles, du plus gros écart de taille au plus petit. Écart : taille (le plus grand des écarts mobile et desktop) · graisse.

| # | Rôle | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|---|
| 1 | Titre de page | Parcours : Création du compte | « Plus qu'une étape, [Prénom] » | 28 px · 800 · 1,1 | 34 / 44 px · 800 · 1,1 | 16 px · graisse 0 |
| 2 | Titre de page | Fin de quiz | titre « Belle maîtrise ! » | 30 px · 800 · 1,1 | 34 / 44 px · 800 · 1,1 | 14 px · graisse 0 |
| 3 | Titre de contenu | Détail cours | titre du cours (H1) : perd contre .espace-page h1 | 34 / 44 px · 800 · 1,1 | 28 / 32 px · 800 · 1,1 | 12 px · graisse 0 |
| 4 | Compteur | Dashboard apprenant | pourcentage dans l'anneau | 17 / 26 px · 800 · 1,2 | 15 px · 800 · 1,2 | 11 px · graisse 0 |
| 5 | Titre de contenu | Fiche : quiz, Quiz flash | question | 24 px · 800 · 1,15 | 28 / 32 px · 800 · 1,1 | 8 px · graisse 0 |
| 6 | Chiffre mis en avant (standard) | Dashboard admin | chiffre de carte | 36 px · 800 · 1,1 | 28 px · 800 · 1 | 8 px · graisse 0 |
| 7 | Titre de section | Cours | titre de section (« Thèmes », « N résultats ») | 22 / 28 px · 800 · 1,2 | 21 px · 800 · 1,2 | 7 px · graisse 0 |
| 8 | Titre de section | Dashboard formateur | titre « Taux de complétion » | 14,4 px · 500 · 1,2 | 21 px · 800 · 1,2 | 6,6 px · graisse 3 crans |
| 9 | Titre de contenu | Dashboard apprenant | « Quiz flash » du bloc de tête E | 34 px · 800 · 1 · lettres -0,5 px | 28 / 32 px · 800 · 1,1 · lettres normales | 6 px · graisse 0 |
| 10 | Titre de carte (grand) | Dashboard apprenant (desktop, colonne étroite) | « Quiz flash » vertical | n/a / 28 px · 800 · 1 | n/a / 22 px · 800 · 1,1 | 6 px · graisse 0 |
| 11 | Compteur | Dashboard apprenant | « [N] XP » de l'en-tête | 17 / 20 px · 800 · 1,2 | 15 px · 800 · 1,2 | 5 px · graisse 0 |
| 12 | Saisie et choix | Parcours : questions | saisie du grand champ (prénom, organisme…) | 20 px · 700 · 1,2 | 16 px · 600 · 1,2 | 4 px · graisse 1 cran |
| 13 | Titre de section | Espace formateur (mobile) | titre de la feuille du menu « … » | 17 px · 800 · 1,2 | 21 px · 800 · 1,2 | 4 px · graisse 0 |
| 14 | Titre de ligne | Création de cours | H1 de l'en-tête compact (affiché sous 1024 px) | 20 px · 800 · 1,2 | 16 px · 800 · 1,2 | 4 px · graisse 0 |
| 15 | Compteur | Parcours : questions | compteur « 2 / 5 » | 18 px · 800 · 1,2 | 15 px · 800 · 1,2 | 3 px · graisse 0 |
| 16 | Titre de section | Espace formateur, Création de cours | titre de modale | 24 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
| 17 | Pastille | Détail cours | « +N » sur la dernière miniature | 16 px · 800 · 1,2 | 13 px · 800 · 1,2 | 3 px · graisse 0 |
| 18 | Titre de section | Fiche : leçon | intertitre H2 de la leçon | 21 / 24 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
| 19 | Pastille | Fin de quiz | pastille « +20 XP » | 16 px · 800 · 1,2 | 13 px · 800 · 1,2 | 3 px · graisse 0 |
| 20 | Compteur | Dashboard apprenant | compteur de barre, petite variante | 12 px · 800 · 1,2 | 15 px · 800 · 1,2 | 3 px · graisse 0 |
| 21 | Titre de section | Dashboard formateur : Pour bien démarrer | titre de la carte | 24 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
| 22 | Pastille | Dashboard formateur : Pour bien démarrer | numéro dans le rond | 16 px · 800 · 1,2 | 13 px · 800 · 1,2 | 3 px · graisse 0 |
| 23 | Titre de carte (standard) | Cours | titre de la carte de thème | 15 / 18 px · 800 · 1,2 | 18 px · 800 · 1,2 | 3 px · graisse 0 |
| 24 | Corps courant | Fiche : checklist | intitulé de l'étape en cours | 17 px · 800 · 1,2 | 15 px · 500 · 1,45 | 2 px · graisse 3 crans |
| 25 | Texte secondaire | Parcours | sous-titre sous le H1 | 16 px · 500 · 1,2 | 14 px · 600 · 1,2 | 2 px · graisse 1 cran |
| 26 | Texte secondaire | Cours, Terrain | sous-titre de l'en-tête lavande | 14 / 16 px · 700 · 1,2 | 14 px · 600 · 1,2 | 2 px · graisse 1 cran |
| 27 | Texte de lecture | Détail cours | premier paragraphe de la leçon | 16 px · 500 · 1,55 | 17 / 18 px · 500 · 1,55 | 2 px · graisse 0 |
| 28 | Titre de carte (grand) | Fiche : quiz, Quiz flash | titre du bloc de correction (« Bien vu ») | 20 px · 800 · 1,2 | 22 px · 800 · 1,1 | 2 px · graisse 0 |
| 29 | Titre de carte (grand) | Fiche : checklist | « X étapes sur N » | 20 px · 800 · 1,2 | 22 px · 800 · 1,1 | 2 px · graisse 0 |
| 30 | Surtitre | Dashboard apprenant | libellé sur carte violette (« Tu en es là ») | 13 / 15 px · 700 · 1,2 | 13 px · 700 · 1,2 | 2 px · graisse 0 |
| 31 | Titre de contenu | Dashboard apprenant | titre du bloc de tête (cours en cours / assigné) | 26 / 32 px · 800 · 1,05 / 1,1 | 28 / 32 px · 800 · 1,1 | 2 px · graisse 0 |
| 32 | Saisie et choix | Dashboard formateur | saisie « Un élève » | 14 px · 400 · 1,2 | 16 px · 600 · 1,2 | 2 px · graisse 400 → 600 |
| 33 | Pastille | Création de cours | lettre de réponse | 15 px · 800 · 1,2 | 13 px · 800 · 1,2 | 2 px · graisse 0 |
| 34 | Saisie et choix | Création de cours | saisie d'explication | 14 px · 400 · 1,2 | 16 px · 600 · 1,2 | 2 px · graisse 400 → 600 |
| 35 | Titre de carte (grand) | Mes groupes | nom de la carte de groupe | 20 / 22 px · 800 · 1,2 | 22 px · 800 · 1,1 | 2 px · graisse 0 |
| 36 | Titre de carte (grand) | Parcours : Choix du profil | titre de la carte de profil | 20 px · 800 · 1,2 | 22 px · 800 · 1,1 | 2 px · graisse 0 |
| 37 | Saisie et choix | Création de cours | libellé de mode de checklist | 15 px · 800 · 1,2 | 16 px · 600 · 1,2 | 1 px · graisse 2 crans |
| 38 | Libellé de champ | Parcours | libellé de champ | 14 px · 800 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 2 crans |
| 39 | Corps courant | Dashboard admin (desktop) | cellules chiffrées du tableau | n/a / 15 px · 700 · 1,2 | n/a / 15 px · 500 · 1,45 | 0 px · graisse 2 crans |
| 40 | Méta | Détail groupe (desktop) | en-têtes de colonne du tableau des élèves | n/a / 13 px · 800 · 1,2 | n/a / 13 px · 600 · 1,2 | 0 px · graisse 2 crans |

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

6 éléments : 2 identiques, 0 discrets, 4 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Détail cours | titre du cours (H1) : perd contre .espace-page h1 (`DetailCoursFormateur.css:25`) | 34 / 44 px · 800 · 1,1 | 28 / 32 px · 800 · 1,1 | 12 px · graisse 0 |
| visible | Fiche : quiz, Quiz flash | question (`FicheCours.css:432`) | 24 px · 800 · 1,15 | 28 / 32 px · 800 · 1,1 | 8 px · graisse 0 |
| visible | Dashboard apprenant | « Quiz flash » du bloc de tête E (`Dashboard.css:440`) | 34 px · 800 · 1 · lettres -0,5 px | 28 / 32 px · 800 · 1,1 · lettres normales | 6 px · graisse 0 |
| visible | Dashboard apprenant | titre du bloc de tête (cours en cours / assigné) (`Dashboard.css:360`) | 26 / 32 px · 800 · 1,05 / 1,1 | 28 / 32 px · 800 · 1,1 | 2 px · graisse 0 |

### Titre de section

16 éléments : 0 identiques, 10 discrets, 6 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Cours | titre de section (« Thèmes », « N résultats ») (`SectionCours.css:20`) | 22 / 28 px · 800 · 1,2 | 21 px · 800 · 1,2 | 7 px · graisse 0 |
| visible | Dashboard formateur | titre « Taux de complétion » (`DashboardFormateur.css:220`) | 14,4 px · 500 · 1,2 | 21 px · 800 · 1,2 | 6,6 px · graisse 3 crans |
| visible | Espace formateur (mobile) | titre de la feuille du menu « … » (`Formateur.css:285`) | 17 px · 800 · 1,2 | 21 px · 800 · 1,2 | 4 px · graisse 0 |
| visible | Dashboard formateur : Pour bien démarrer | titre de la carte (`DashboardFormateur.css:657`) | 24 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
| visible | Espace formateur, Création de cours | titre de modale (`Formateur.css:357`) | 24 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
| visible | Fiche : leçon | intertitre H2 de la leçon (`FicheCours.css:266`) | 21 / 24 px · 800 · 1,2 | 21 px · 800 · 1,2 | 3 px · graisse 0 |
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

### Titre de carte (standard)

8 éléments : 2 identiques, 5 discrets, 1 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Cours | titre de la carte de thème (`SectionCours.css:89`) | 15 / 18 px · 800 · 1,2 | 18 px · 800 · 1,2 | 3 px · graisse 0 |
| discret | Partagé (fiche) | titre du toast de complétion (`CompletionToast.css:30`) | 13,6 px · 800 · 1,2 | 18 px · 800 · 1,2 | 4,4 px · graisse 0 |
| discret | Dashboard apprenant | titre « Quiz flash » du bloc en ligne F (`Dashboard.css:477`) | 19 px · 800 · 1,2 | 18 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant | titre « Quiz flash » verrouillé (`Dashboard.css:547`) | 17 px · 800 · 1,2 | 18 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Détail cours | titre de l'encadré « À retenir » (`DetailCoursFormateur.css:268`) | 17 px · 800 · 1,2 | 18 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Fiche : leçon (et aperçu Création, où il est écrasé) | titre de l'encadré « À retenir » (`FicheCours.css:294`) | 17 px · 800 · 1,2 | 18 px · 800 · 1,2 | 1 px · graisse 0 |

### Titre de carte (grand)

9 éléments : 3 identiques, 1 discrets, 5 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Dashboard apprenant (desktop, colonne étroite) | « Quiz flash » vertical (`Dashboard.css:941`) | n/a / 28 px · 800 · 1 | n/a / 22 px · 800 · 1,1 | 6 px · graisse 0 |
| visible | Fiche : checklist | « X étapes sur N » (`FicheCours.css:1062`) | 20 px · 800 · 1,2 | 22 px · 800 · 1,1 | 2 px · graisse 0 |
| visible | Fiche : quiz, Quiz flash | titre du bloc de correction (« Bien vu ») (`FicheCours.css:654`) | 20 px · 800 · 1,2 | 22 px · 800 · 1,1 | 2 px · graisse 0 |
| visible | Mes groupes | nom de la carte de groupe (`FormateurListes.css:88`) | 20 / 22 px · 800 · 1,2 | 22 px · 800 · 1,1 | 2 px · graisse 0 |
| visible | Parcours : Choix du profil | titre de la carte de profil (`Parcours.css:157`) | 20 px · 800 · 1,2 | 22 px · 800 · 1,1 | 2 px · graisse 0 |
| discret | Dashboard apprenant | titre de carte blanche / lavande (`Dashboard.css:143`) | 22 px · 800 · 1,05 | 22 px · 800 · 1,1 | 0 px · graisse 0 |

### Titre de ligne

17 éléments : 5 identiques, 11 discrets, 1 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Création de cours | H1 de l'en-tête compact (affiché sous 1024 px) (`CreationCours.css:52`) | 20 px · 800 · 1,2 | 16 px · 800 · 1,2 | 4 px · graisse 0 |
| discret | Création de cours | énoncé de la question repliée (`CreationCours.css:623`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard admin | titre du cours dans le tableau (`DashboardFormateur.css:819`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant : modale Mes badges | nom du badge (`Dashboard.css:1051`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant, Cours | titre de cours de la ligne du bloc formateur (`BlocFormateur.css:93`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard formateur | nom du groupe (`DashboardFormateur.css:298`) | 17 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard formateur : Pour bien démarrer | titre d'étape (`DashboardFormateur.css:722`) | 17 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Détail cours | énoncé de question (`DetailCoursFormateur.css:340`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Détail groupe | titre de la carte de cours assigné (`DetailGroupe.css:120`) | 15 px · 800 · 1,25 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Détail groupe | nom de l'élève (`DetailGroupe.css:183`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Fiche : checklist | titre du cours de l'en-tête compact (H1) (`FicheCours.css:1041`) | 15 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Terrain, recherche Cours | titre de la ligne de cours (`LigneCours.css:47`) | 15 / 16 px · 800 · 1,2 | 16 px · 800 · 1,2 | 1 px · graisse 0 |

### Texte de lecture

2 éléments : 1 identiques, 0 discrets, 1 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Détail cours | premier paragraphe de la leçon (`DetailCoursFormateur.css:212`) | 16 px · 500 · 1,55 | 17 / 18 px · 500 · 1,55 | 2 px · graisse 0 |

### Corps courant

17 éléments : 2 identiques, 13 discrets, 2 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
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

27 éléments : 2 identiques, 23 discrets, 2 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Cours, Terrain | sous-titre de l'en-tête lavande (`EntetePage.css:35`) | 14 / 16 px · 700 · 1,2 | 14 px · 600 · 1,2 | 2 px · graisse 1 cran |
| visible | Parcours | sous-titre sous le H1 (`GabaritParcours.css:215`) | 16 px · 500 · 1,2 | 14 px · 600 · 1,2 | 2 px · graisse 1 cran |
| discret | Cours | « Aucun cours ne correspond… » (`SectionCours.css:28`) | 15 px · 500 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Création de cours | aide sous un champ (`CreationCours.css:272`) | 13 px · 500 · 1,4 | 14 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Dashboard apprenant | phrase d'état (« Leçon lue. Reste le quiz ») (`Dashboard.css:388`) | 14 / 15 px · 600 · 1,2 | 14 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard apprenant (desktop, colonne étroite) | phrase du quiz flash vertical (`Dashboard.css:952`) | n/a / 15 px · 600 · 1,2 | n/a / 14 px · 600 · 1,2 | 1 px · graisse 0 |
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
| discret | Dashboard formateur | note 14 px (Pour bien démarrer) (`DashboardFormateur.css:139`) | 14 px · 500 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Détail thème | « x cours terminés sur y » (`DetailTheme.css:88`) | 14 px · 700 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Fiche : quiz, Quiz flash | « Plusieurs réponses possibles » (`FicheCours.css:445`) | 14 px · 700 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Parcours | message d'erreur (`GabaritParcours.css:365`) | 14 px · 700 · 1,2 | 14 px · 600 · 1,2 | 0 px · graisse 1 cran |

### Méta

45 éléments : 7 identiques, 37 discrets, 1 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Détail groupe (desktop) | en-têtes de colonne du tableau des élèves (`DetailGroupe.css:338`) | n/a / 13 px · 800 · 1,2 | n/a / 13 px · 600 · 1,2 | 0 px · graisse 2 crans |
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
| discret | Dashboard formateur : Pour bien démarrer | sous-titre d'étape (`DashboardFormateur.css:727`) | 14 px · 500 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Détail cours | légende de la barre d'avancement (`DetailCoursFormateur.css:96`) | 14 px · 600 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Détail groupe (mobile) | statut par cours dans la carte élève (`DetailGroupe.css:242`) | 14 px · 600 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Espace formateur | méta (« X terminés sur N »…) (`Formateur.css:73`) | 14 px · 600 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Fiche : checklist | « +15 XP à la fin » (`FicheCours.css:1067`) | 14 px · 700 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Fiche : checklist | critère de validation (`FicheCours.css:1221`) | 14 px · 500 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Fiche : leçon, checklist | détail « N questions · +20 XP » (`FicheCours.css:358`) | 14 px · 500 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Fiche : leçon, récap | « N min de lecture » / « X XP gagnés » (`FicheCours.css:234`) | 14 px · 700 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Fin de quiz | condition du badge (`FicheCours.css:892`) | 14 px · 500 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Mes cours, Mes groupes | méta de carte (`FormateurListes.css:64`) | 14 px · 600 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Mes groupes | ligne « Cours terminés » (`FormateurListes.css:101`) | 14 px · 600 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 0 |
| discret | Parcours : Choix du profil | description de la carte de profil (`Parcours.css:162`) | 14 px · 500 · 1,35 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Récap | contenu du cours suivant (`FicheCours.css:1352`) | 14 px · 500 · 1,2 | 13 px · 600 · 1,2 | 1 px · graisse 1 cran |
| discret | Création de cours (≥ 768) | sous-titre de mode de checklist (`CreationCours.css:901`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard admin | précision « 30 derniers jours » (`DashboardFormateur.css:783`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard admin | thème court sous le titre (`DashboardFormateur.css:826`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard admin (desktop) | en-têtes de colonne du tableau (`DashboardFormateur.css:1045`) | n/a / 13 px · 700 · 1,2 | n/a / 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard apprenant | méta « 10 questions · +30 XP » (`Dashboard.css:482`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard apprenant : modale Mes badges | condition du badge (`Dashboard.css:1057`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard formateur | « Actif aujourd'hui » (`DashboardFormateur.css:311`) | 13 px · 700 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Dashboard formateur | date « Il y a N jours » (`DashboardFormateur.css:370`) | 13 px · 700 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Détail groupe | email de l'élève (`DetailGroupe.css:190`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Détail thème | contenu « Leçon · Quiz · Checklist » (`DetailTheme.css:143`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Modale d'assignation | détail sous le libellé de case (`Formateur.css:532`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Récap | détail de ligne (« Meilleur score : 4/5 ») (`FicheCours.css:1316`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |
| discret | Terrain, recherche Cours | méta de la ligne de cours (`LigneCours.css:54`) | 13 px · 500 · 1,2 | 13 px · 600 · 1,2 | 0 px · graisse 1 cran |

### Surtitre

12 éléments : 9 identiques, 2 discrets, 1 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Dashboard apprenant | libellé sur carte violette (« Tu en es là ») (`Dashboard.css:137`) | 13 / 15 px · 700 · 1,2 | 13 px · 700 · 1,2 | 2 px · graisse 0 |
| discret | Cours | surtitre « Thème N » de la carte de thème (`SectionCours.css:82`) | 12 / 13 px · 700 · 1,2 | 13 px · 700 · 1,2 | 1 px · graisse 0 |
| discret | Fiche : checklist | thème de l'en-tête compact (`FicheCours.css:1033`) | 12 px · 700 · 1,2 | 13 px · 700 · 1,2 | 1 px · graisse 0 |

### Bouton

22 éléments : 5 identiques, 17 discrets, 0 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
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

19 éléments : 1 identiques, 18 discrets, 0 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| discret | Mot de passe oublié | lien « ← Retour » (`shared.css:321`) | 13,6 px · 600 · 1,2 | 15 px · 700 · 1,2 | 1,4 px · graisse 1 cran |
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
| discret | Détail groupe | bouton texte « Supprimer ce groupe » (`Formateur.css:433`) | 15 px · 800 · 1,2 | 15 px · 700 · 1,2 | 0 px · graisse 1 cran |
| discret | Détail groupe | lien « Assigner » (`DetailGroupe.css:87`) | 15 px · 800 · 1,2 | 15 px · 700 · 1,2 | 0 px · graisse 1 cran |
| discret | Détail groupe | lien « Voir les N autres » (`DetailGroupe.css:255`) | 15 px · 800 · 1,2 | 15 px · 700 · 1,2 | 0 px · graisse 1 cran |
| discret | Espace formateur | texte du lien Retour « ‹ Mes cours » (`Formateur.css:161`) | 15 px · 800 · 1,2 | 15 px · 700 · 1,2 | 0 px · graisse 1 cran |
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

10 éléments : 2 identiques, 4 discrets, 4 visibles.

| Niveau | Écran | Élément | Rendu actuel | Proposé | Écart |
|---|---|---|---|---|---|
| visible | Dashboard apprenant | pourcentage dans l'anneau (`Dashboard.css:382`) | 17 / 26 px · 800 · 1,2 | 15 px · 800 · 1,2 | 11 px · graisse 0 |
| visible | Dashboard apprenant | « [N] XP » de l'en-tête (`Dashboard.css:30`) | 17 / 20 px · 800 · 1,2 | 15 px · 800 · 1,2 | 5 px · graisse 0 |
| visible | Dashboard apprenant | compteur de barre, petite variante (`Dashboard.css:323`) | 12 px · 800 · 1,2 | 15 px · 800 · 1,2 | 3 px · graisse 0 |
| visible | Parcours : questions | compteur « 2 / 5 » (`GabaritParcours.css:195`) | 18 px · 800 · 1,2 | 15 px · 800 · 1,2 | 3 px · graisse 0 |
| discret | Partagé (fiche) | « +15 XP » du toast (`CompletionToast.css:39`) | 13,6 px · 700 · 1,2 | 15 px · 800 · 1,2 | 1,4 px · graisse 1 cran |
| discret | Dashboard apprenant | compteur de barre « X / 3 » (`Dashboard.css:318`) | 14 px · 800 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Dashboard formateur | % de la barre du groupe (`DashboardFormateur.css:330`) | 14 px · 800 · 1,2 | 15 px · 800 · 1,2 | 1 px · graisse 0 |
| discret | Fin de quiz | « 80 % » sous le score (`FicheCours.css:801`) | 15 px · 700 · 1,2 | 15 px · 800 · 1,2 | 0 px · graisse 1 cran |

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

Les 20 lignes du tableau de l'audit. Rattachements inchangés depuis la version 2.

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
| « À retenir » dans l'aperçu de Création de cours | 17 px | 22 px | 18 px (Titre de carte, standard) | **la valeur écrite, à 1 px près** : l'aperçu doit montrer la fiche telle que l'élève la verra ; dans la fiche comme dans l'aperçu, ce titre passe à 18 px (changement discret depuis la fiche). |

## 7. Écarts avec CLAUDE.md

CLAUDE.md n'est pas modifié. Tailles (et graisses, quand il les donne) qu'il décrit et qui différeraient de la proposition validée ; celles que la proposition garde ne sont pas listées :

| CLAUDE.md dit | Élément | Valeur dans CLAUDE.md | Proposé |
|---|---|---|---|
| Dashboard apprenant, bloc de tête : « Titre 26 px mobile / 32 px desktop » | titre du bloc de tête (cours en cours / assigné) (`Dashboard.css:360`) | 26 / 32 px | 28 / 32 px |
| Dashboard apprenant, bloc E : « Quiz flash » 34 px | « Quiz flash » du bloc de tête E (`Dashboard.css:440`) | 34 px | 28 / 32 px |
| Dashboard apprenant, bloc F en colonne étroite : « titre 28 px » | « Quiz flash » vertical (`Dashboard.css:941`) | 28 px | 22 px |
| En-tête lavande partagé : sous-titre « 14 px 700 (16 px desktop) » | sous-titre de l'en-tête lavande (`EntetePage.css:35`) | 14 / 16 px | 14 px |
| Cours : « N résultats » et « Thèmes » « h2 22 px, 28 desktop » | titre de section (« Thèmes », « N résultats ») (`SectionCours.css:20`) | 22 / 28 px | 21 px |
| Cours : « Aucun cours ne correspond… » « 15 px » | « Aucun cours ne correspond… » (`SectionCours.css:28`) | 15 px | 14 px |
| Cours, carte de thème : « Thème N » « 12 px (13) » | surtitre « Thème N » de la carte de thème (`SectionCours.css:82`) | 12 / 13 px | 13 px |
| Cours, carte de thème : nom « 15 px (18) graisse 800 » | titre de la carte de thème (`SectionCours.css:89`) | 15 / 18 px | 18 px |
| Mode terrain : titre de ligne « 15 px (16) 800 » | titre de la ligne de cours (`LigneCours.css:47`) | 15 / 16 px | 16 px |
| Dashboard formateur : sous-titre « 15 px gras » | « 3 cours · 1 groupe · 12 élèves » (`DashboardFormateur.css:36`) | 15 px | 14 px |
| Pour bien démarrer : titre « 24 px » | titre de la carte (`DashboardFormateur.css:657`) | 24 px | 21 px |
| Pour bien démarrer : titre d'étape « 17 px » | titre d'étape (`DashboardFormateur.css:722`) | 17 px | 16 px |
| Pour bien démarrer : sous-titre d'étape « 14 px » | sous-titre d'étape (`DashboardFormateur.css:727`) | 14 px | 13 px |
| Tes groupes : nom « 17 px » | nom du groupe (`DashboardFormateur.css:298`) | 17 px | 16 px |
| Activité récente : titre « 22 px » | titre « Activité récente » (`DashboardFormateur.css:463`) | 22 px | 21 px |
| Activité récente : pastille du groupe « 12 px » | pastille du groupe (`DashboardFormateur.css:626`) | 12 px | 13 px |
| Dashboard admin : libellé « 14 px » | libellé de carte chiffrée (`DashboardFormateur.css:771`) | 14 px | 13 px |
| Dashboard admin : chiffre « 36 px » | chiffre de carte (`DashboardFormateur.css:777`) | 36 px | 28 px |
| Leçon : « H2 21 / 24 px » | intertitre H2 de la leçon (`FicheCours.css:266`) | 21 / 24 px | 21 px |
| Leçon, « À retenir » : « puces 16 px 600 » | points de l'encadré « À retenir » (`FicheCours.css:321`) | 16 px 600 | 15 px 500 |
| Quiz : « question 24 px 800 » | question (`FicheCours.css:432`) | 24 px | 28 / 32 px |
| Fin de quiz, carte badge : « condition 14 px » | condition du badge (`FicheCours.css:892`) | 14 px | 13 px |
| Checklist : « thème 12 px » | thème de l'en-tête compact (`FicheCours.css:1033`) | 12 px | 13 px |
| Checklist : « « X étapes sur N » 20 px » | « X étapes sur N » (`FicheCours.css:1062`) | 20 px | 22 px |
| Checklist : étape en cours « intitulé 17 px 800 » | intitulé de l'étape en cours (`FicheCours.css:1205`) | 17 px 800 | 15 px 600 (état « en cours » du Corps courant) |
| Checklist : « critère de validation 14 px » | critère de validation (`FicheCours.css:1221`) | 14 px | 13 px |
| Parcours : compteur « « 2 / 5 » 18 px 800 » | compteur « 2 / 5 » (`GabaritParcours.css:195`) | 18 px | 15 px |
| Parcours : « sous-titre 16 px secondaire » | sous-titre sous le H1 (`GabaritParcours.css:215`) | 16 px | 14 px |
| Création de cours (< 1024 px) : « titre 20 px » | H1 de l'en-tête compact (affiché sous 1024 px) (`CreationCours.css:52`) | 20 px | 16 px |
| Modale Mes badges : nom « 15 px, 800 » | nom du badge (`Dashboard.css:1051`) | 15 px | 16 px |
| Repère d'étapes : libellé « 14 px » | libellé d'étape (Leçon, Quiz · 4/5…) (`ReperEtapes.css:67`) | 14 px | 15 px |
| Quiz : « Plusieurs réponses possibles » « 14 px 700 » | « Plusieurs réponses possibles » (`FicheCours.css:445`) | 14 px 700 | 14 px 600 |
| Tes groupes : titre de carte « 20 px » | titre de carte (« Tes groupes »…) (`DashboardFormateur.css:102`) | 20 px | 21 px |
| Checklist : « titre 15 px 800 » | titre du cours de l'en-tête compact (H1) (`FicheCours.css:1041`) | 15 px 800 | 16 px 800 |

## 8. Ce qui change depuis la version 2

- Valeurs : 9 jeux de valeurs sur 20 changent (en gras en section 1) : Titre de section 20 → 21 px, Titre de carte standard 17 → 18 px, Titre de ligne 15 → 16 px, Texte secondaire 700 → 600, Méta 500 → 600, Bouton 16 → 15 px, Lien texte 800 → 700, Libellé de champ 700 → 600, Compteur 14 → 15 px. Saisie et choix reste à 16 px et Navigation à 14 px.
- Rôles, fusions et niveaux : inchangés. Rattachements inchangés, sauf trois décisions finales : XP de l'en-tête du dashboard → Compteur ; « Bonne réponse » (Détail cours) et « Ta réponse / Bonne réponse » (Fin de quiz) → état du Corps courant.
- Variantes d'état : les parties plus légères prennent la graisse du rôle ; l'emphase suit la règle des états.

## 9. À trancher

Plus rien n'est à trancher dans cette proposition. Le pourcentage de l'anneau du dashboard apprenant, dernier point ouvert, est réglé par la décision finale 8 (section 10). Pour mémoire, la mesure qui l'avait laissé ouvert : diamètre intérieur de l'anneau 58,8 px sur mobile et 90,4 px sur desktop ; en 28 px, « 88 % » fait 59,6 px de large ; en 15 px, « 100 % » fait environ 38,5 px et tient sur mobile comme sur desktop.

## 10. Décisions finales

Validées le 2026-11-04.

1. **Saisie et choix : 16 px.** Contrainte technique : Safari sur iOS agrandit la page quand on touche un champ dont le texte fait moins de 16 px. La raison est notée dans le rôle (section 1).
2. **Pas de tailles intermédiaires.** 27 px (Titre de contenu) et 21 px (Titre de carte grand) sont refusés ; les valeurs restent celles de la prod (28 / 32 px et 22 px).
3. **« [N] XP » de l'en-tête du dashboard apprenant : rôle Compteur.** Avec lui, la valeur du Compteur devient 15 px · 800 · 1,2 (critère des changements visibles).
4. **Pourcentage de l'anneau du dashboard apprenant** : voir la décision 8 (point laissé à trancher lors de la première validation, réglé ensuite).
5. **« Bonne réponse » (Détail cours) et « Ta réponse / Bonne réponse » (Fin de quiz) : état du Corps courant, graisse 600** (15 px, 1,45).
6. **Emphase dans les rôles à 800 : acceptée invisible**, comme en prod (question du quiz, énoncés du Détail cours et de « Revoir mes erreurs », lien du parcours).
7. **Les autres changements visibles sont acceptés comme dérives à corriger** : les 40 éléments de la section 3.2, y compris les écarts de 4 px ou plus et le pourcentage de l'anneau.
8. **Pourcentage de l'anneau du dashboard apprenant : rôle Compteur** (15 px · 800 · 1,2), sur mobile et sur desktop. Le sujet du bloc « cours en cours » est le cours : le titre le nomme, le bouton mène à la suite, et le pourcentage dit où l'on en est dans ce cours. La place à l'intérieur de l'anneau n'est qu'une vérification : « 100 % » tient en 15 px sur mobile (environ 38,5 px de large pour 58,8 px libres).
9. **Chiffre mis en avant et Compteur se distinguent par le sujet du bloc**, jamais par la forme du nombre.
10. **Test binaire** : si le nombre est le sujet du bloc, Chiffre mis en avant ; sinon Compteur (position, avancement, total ou gain qui accompagne le sujet). Un nombre a un rôle et un seul. « 80 % » sous le score de fin de quiz et « +15 XP » du toast restent Compteur ; ils ne sont plus signalés.
11. **Lien texte ou Navigation** : Navigation quand une option reste marquée comme choisie et que le choix change ce qu'on voit sans agir sur les données ; Lien texte pour une action sans forme de bouton ni état choisi, qui agit ou mène ailleurs une fois. L'option choisie d'une Navigation monte d'un cran (800). « Se déconnecter » et les actions du menu « … » de l'espace formateur passent de Navigation à Lien texte (pas d'état choisi, action sur la session ou les données) ; la valeur de Navigation redevient 14 px · 700 · 1,2.
12. **Libellé du bouton Retour : rôle Bouton** (la variante Retour a une forme de bouton). Les deux Retour qui suivent la variante passent en Bouton ; les trois qui n'ont pas sa forme restent en Lien texte comme dérives à corriger vers la variante, à l'étape écrans.
13. **Rendu de design-system** : « Annuler », bouton secondaire sur design-system, passe de Lien texte à Bouton (décision déjà écrite dans la doc du DS). Les autres différences entre origin/main et design-system ne touchent pas la typographie (section 1).

Totaux de la proposition validée, sur 275 éléments : **57 identiques, 178 discrets, 40 visibles**.

## Annexe. Éléments par rôle

✓ identique · discret · ● visible.

**Titre de page** (9) : ✓ H1 de page dans .espace-page (Pages avec navigation, `espace-layout.css:150`) ; ✓ H1 de la carte de flux (Mot de passe oublié / Nouveau mot de passe / Compléter le profil, `shared.css:108`) ; ✓ H1 du parcours (Parcours, `GabaritParcours.css:208`) ; ✓ H1 de page formateur (Espace formateur (Mes cours, Mes groupes, Détail groupe, Détail cours), `Formateur.css:30`) ; ● titre « Belle maîtrise ! » (Fin de quiz, `FicheCours.css:809`) ; · « Salut [Prénom] » (H1) (Dashboard apprenant, `Dashboard.css:21`) ; · « Bonjour [prénom] » (H1) (Dashboard formateur, admin, `DashboardFormateur.css:30`) ; ● « Plus qu'une étape, [Prénom] » (Parcours : Création du compte, `Parcours.css:192`) ; ✓ H1 de l'en-tête desktop (affiché à partir de 1024 px) (Création de cours, `CreationCours.css:1376`).

**Titre de contenu** (6) : ✓ nom du thème (H1) (Détail thème, `DetailTheme.css:75`) ; ● titre du cours (H1) : perd contre .espace-page h1 (Détail cours, `DetailCoursFormateur.css:25`) ; ✓ titre du cours (H1) (Fiche : leçon, récap, `FicheCours.css:222`) ; ● question (Fiche : quiz, Quiz flash, `FicheCours.css:432`) ; ● titre du bloc de tête (cours en cours / assigné) (Dashboard apprenant, `Dashboard.css:360`) ; ● « Quiz flash » du bloc de tête E (Dashboard apprenant, `Dashboard.css:440`).

**Titre de section** (16) : · h2 par défaut dans .espace-page (Pages avec navigation, `espace-layout.css:163`) ; · titre Markdown niveau 1 (Contenu Markdown, `ContenuMarkdown.css:14`) ; · titre Markdown niveau 2 (hors leçon) (Contenu Markdown, `ContenuMarkdown.css:15`) ; · titre Markdown niveau 3 (Contenu Markdown, `ContenuMarkdown.css:16`) ; · titre de carte de section (h2) (Espace formateur, `Formateur.css:54`) ; ● titre de la feuille du menu « … » (Espace formateur (mobile), `Formateur.css:285`) ; ● titre de modale (Espace formateur, Création de cours, `Formateur.css:357`) ; ● intertitre H2 de la leçon (Fiche : leçon, `FicheCours.css:266`) ; · titre « Mes badges » (Dashboard apprenant : modale Mes badges, `Dashboard.css:994`) ; · titre de carte (« Tes groupes »…) (Dashboard formateur, admin, `DashboardFormateur.css:102`) ; ● titre « Taux de complétion » (Dashboard formateur, `DashboardFormateur.css:220`) ; · titre « Activité récente » (Dashboard formateur, `DashboardFormateur.css:463`) ; ● titre de la carte (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:657`) ; · titre « Cours assignés » (Détail groupe, `DetailGroupe.css:78`) ; · titre de carte de section (Infos, Leçon…) (Création de cours, `CreationCours.css:253`) ; ● titre de section (« Thèmes », « N résultats ») (Cours, `SectionCours.css:20`).

**Titre de carte (standard)** (8) : · titre du toast de complétion (Partagé (fiche), `CompletionToast.css:30`) ; ✓ titre du bloc « De ton formateur » (Dashboard apprenant, Cours, `BlocFormateur.css:21`) ; · titre de l'encadré « À retenir » (Détail cours, `DetailCoursFormateur.css:268`) ; · titre de l'encadré « À retenir » (Fiche : leçon (et aperçu Création, où il est écrasé), `FicheCours.css:294`) ; · titre « Quiz flash » du bloc en ligne F (Dashboard apprenant, `Dashboard.css:477`) ; · titre « Quiz flash » verrouillé (Dashboard apprenant, `Dashboard.css:547`) ; ● titre de la carte de thème (Cours, `SectionCours.css:89`) ; ✓ titre de la carte de cours (Mes cours, `FormateurListes.css:60`).

**Titre de carte (grand)** (9) : ✓ titre de la carte « Étape suivante » (Fiche : leçon, checklist, `FicheCours.css:351`) ; ● titre du bloc de correction (« Bien vu ») (Fiche : quiz, Quiz flash, `FicheCours.css:654`) ; ✓ nom du badge débloqué (Fin de quiz, `FicheCours.css:886`) ; ● « X étapes sur N » (Fiche : checklist, `FicheCours.css:1062`) ; ✓ titre du cours suivant (Récap, `FicheCours.css:1346`) ; · titre de carte blanche / lavande (Dashboard apprenant, `Dashboard.css:143`) ; ● nom de la carte de groupe (Mes groupes, `FormateurListes.css:88`) ; ● titre de la carte de profil (Parcours : Choix du profil, `Parcours.css:157`) ; ● « Quiz flash » vertical (Dashboard apprenant (desktop, colonne étroite), `Dashboard.css:941`).

**Titre de ligne** (17) : · titre de la ligne de cours (Terrain, recherche Cours, `LigneCours.css:47`) ; · titre de cours de la ligne du bloc formateur (Dashboard apprenant, Cours, `BlocFormateur.css:93`) ; ✓ titre de la ligne de cours (Détail thème, `DetailTheme.css:136`) ; · énoncé de question (Détail cours, `DetailCoursFormateur.css:340`) ; ✓ question ratée (Fin de quiz : mes erreurs, `FicheCours.css:953`) ; · titre du cours de l'en-tête compact (H1) (Fiche : checklist, `FicheCours.css:1041`) ; ✓ titre de ligne (Leçon, Quiz, Checklist) (Récap, `FicheCours.css:1311`) ; · nom du badge (Dashboard apprenant : modale Mes badges, `Dashboard.css:1051`) ; · nom du groupe (Dashboard formateur, `DashboardFormateur.css:298`) ; ✓ « Personne à relancer » (Dashboard formateur, `DashboardFormateur.css:440`) ; · titre d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:722`) ; · titre du cours dans le tableau (Dashboard admin, `DashboardFormateur.css:819`) ; · titre de la carte de cours assigné (Détail groupe, `DetailGroupe.css:120`) ; · nom de l'élève (Détail groupe, `DetailGroupe.css:183`) ; · énoncé de la question repliée (Création de cours, `CreationCours.css:623`) ; ✓ « Question N » (h3) (Création de cours, `CreationCours.css:655`) ; ● H1 de l'en-tête compact (affiché sous 1024 px) (Création de cours, `CreationCours.css:52`).

**Texte de lecture** (2) : ● premier paragraphe de la leçon (Détail cours, `DetailCoursFormateur.css:212`) ; ✓ texte de la leçon (Fiche : leçon, aperçu Création, `FicheCours.css:253`).

**Corps courant** (17) : · texte de tableau (Contenu Markdown, `ContenuMarkdown.css:95`) ; · texte du toast de complétion (Partagé (fiche), `CompletionToast.css:15`) ; ✓ texte courant (paragraphe) (Espace formateur, modale de confirmation, `Formateur.css:67`) ; · points de l'encadré « À retenir » (Détail cours, `DetailCoursFormateur.css:294`) ; · bonne réponse (Détail cours, `DetailCoursFormateur.css:353`) ; · intitulé d'étape de checklist (Détail cours, `DetailCoursFormateur.css:372`) ; · points de l'encadré « À retenir » (Fiche : leçon, `FicheCours.css:321`) ; ✓ explication de la correction (Fiche : quiz, Quiz flash, `FicheCours.css:662`) ; · ligne « Ta réponse / Bonne réponse » (Fin de quiz : mes erreurs, `FicheCours.css:963`) ; · explication (Fin de quiz : mes erreurs, `FicheCours.css:977`) ; · consigne de remise en ordre (Fiche : checklist (remise en ordre), `FicheCours.css:1081`) ; · intitulé d'étape (Fiche : checklist, `FicheCours.css:1172`) ; ● intitulé de l'étape en cours (Fiche : checklist, `FicheCours.css:1205`) ; · texte de relance (Dashboard formateur, `DashboardFormateur.css:366`) ; · texte de l'événement (Dashboard formateur, `DashboardFormateur.css:602`) ; ● cellules chiffrées du tableau (Dashboard admin (desktop), `DashboardFormateur.css:1064`) ; · cellules du tableau des élèves (Détail groupe (desktop), `DetailGroupe.css:350`).

**Texte secondaire** (27) : · phrase d'explication sous le H1 (Mot de passe oublié, `shared.css:119`) ; · message d'erreur (.message) (Partagé, `shared.css:358`) ; · texte d'état vide (Terrain, Détail thème, Détail groupe, `shared.css:512`) ; · message de résultat de la remise en ordre (Fiche : checklist (remise en ordre), `quiz.css:85`) ; ● sous-titre sous le H1 (Parcours, `GabaritParcours.css:215`) ; · message d'erreur (Parcours, `GabaritParcours.css:365`) ; ● sous-titre de l'en-tête lavande (Cours, Terrain, `EntetePage.css:35`) ; · sous-titre sous le H1 (« N élèves · N cours ») (Espace formateur, `Formateur.css:37`) ; · sous-titre de modale (Espace formateur, `Formateur.css:363`) ; · « x cours terminés sur y » (Détail thème, `DetailTheme.css:88`) ; · « Plusieurs réponses possibles » (Fiche : quiz, Quiz flash, `FicheCours.css:445`) ; · sous-titre « Une seule erreur à revoir. » (Fin de quiz, `FicheCours.css:816`) ; · phrase d'état (« Leçon lue. Reste le quiz ») (Dashboard apprenant, `Dashboard.css:388`) ; ✓ phrase du bloc de tête E (Dashboard apprenant, `Dashboard.css:449`) ; · « 3 cours · 1 groupe · 12 élèves » (Dashboard formateur, admin, `DashboardFormateur.css:36`) ; · note sous une carte (Dashboard formateur, `DashboardFormateur.css:133`) ; · note 14 px (Pour bien démarrer) (Dashboard formateur, `DashboardFormateur.css:139`) ; · texte d'état vide (Dashboard formateur, admin, `DashboardFormateur.css:144`) ; · confirmation d'envoi de relance (Dashboard formateur, `DashboardFormateur.css:376`) ; ✓ titre du cours tronqué sous le H1 (Création de cours (< 1024), `CreationCours.css:60`) ; · aide sous un champ (Création de cours, `CreationCours.css:272`) ; · message d'erreur (Création de cours, `CreationCours.css:279`) ; · message de la barre d'enregistrement (Création de cours, `CreationCours.css:1075`) ; · « Aucun cours ne correspond… » (Cours, `SectionCours.css:28`) ; · aide sous un champ (mot de passe) (Parcours, `Parcours.css:17`) ; · texte du bloc lavande (Parcours : Création du compte, `Parcours.css:199`) ; · phrase du quiz flash vertical (Dashboard apprenant (desktop, colonne étroite), `Dashboard.css:952`).

**Méta** (45) : · méta de la ligne de cours (Terrain, recherche Cours, `LigneCours.css:54`) ; · compteur « N cours » du bloc formateur (Cours, `BlocFormateur.css:44`) ; · méta (« X terminés sur N »…) (Espace formateur, `Formateur.css:73`) ; · détail sous le libellé de case (Modale d'assignation, `Formateur.css:532`) ; · contenu « Leçon · Quiz · Checklist » (Détail thème, `DetailTheme.css:143`) ; · légende de la barre d'avancement (Détail cours, `DetailCoursFormateur.css:96`) ; ✓ libellé des petites cartes d'avancement (Détail cours, `DetailCoursFormateur.css:141`) ; · texte du bandeau « Aperçu élève » (Aperçu élève, `FicheCours.css:104`) ; · « N min de lecture » / « X XP gagnés » (Fiche : leçon, récap, `FicheCours.css:234`) ; · détail « N questions · +20 XP » (Fiche : leçon, checklist, `FicheCours.css:358`) ; · condition du badge (Fin de quiz, `FicheCours.css:892`) ; · « +15 XP à la fin » (Fiche : checklist, `FicheCours.css:1067`) ; · critère de validation (Fiche : checklist, `FicheCours.css:1221`) ; · détail de ligne (« Meilleur score : 4/5 ») (Récap, `FicheCours.css:1316`) ; · contenu du cours suivant (Récap, `FicheCours.css:1352`) ; ✓ sous-texte (thème, condition du badge) (Dashboard apprenant, `Dashboard.css:149`) ; · méta du cours assigné (« thème · ajouté hier ») (Dashboard apprenant, `Dashboard.css:426`) ; · méta « 10 questions · +30 XP » (Dashboard apprenant, `Dashboard.css:482`) ; ✓ consigne du quiz flash verrouillé (Dashboard apprenant, `Dashboard.css:552`) ; · condition du badge (Dashboard apprenant : modale Mes badges, `Dashboard.css:1057`) ; · « Obtenu le JJ/MM » (Dashboard apprenant : modale Mes badges, `Dashboard.css:1062`) ; · sous-titre « Sur l'ensemble de tes groupes » (Dashboard formateur, `DashboardFormateur.css:225`) ; · « N élèves · N cours » (Dashboard formateur, `DashboardFormateur.css:304`) ; · « Actif aujourd'hui » (Dashboard formateur, `DashboardFormateur.css:311`) ; · date « Il y a N jours » (Dashboard formateur, `DashboardFormateur.css:370`) ; · « Tous tes élèves ont commencé… » (Dashboard formateur, `DashboardFormateur.css:446`) ; ✓ statut « Quiz 90 % / En cours » (Dashboard formateur, `DashboardFormateur.css:640`) ; · « N étapes sur 3 » (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:663`) ; · sous-titre d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:727`) ; · libellé de carte chiffrée (Dashboard admin, `DashboardFormateur.css:771`) ; · précision « 30 derniers jours » (Dashboard admin, `DashboardFormateur.css:783`) ; · thème court sous le titre (Dashboard admin, `DashboardFormateur.css:826`) ; ✓ résumé « 42 commencés · 18 terminés » (Dashboard admin (mobile), `DashboardFormateur.css:831`) ; · email de l'élève (Détail groupe, `DetailGroupe.css:190`) ; · statut par cours dans la carte élève (Détail groupe (mobile), `DetailGroupe.css:242`) ; ✓ compteur du sommaire (Création de cours (≥ 1024), `CreationCours.css:191`) ; · nom d'image en étiquette (Création de cours, `CreationCours.css:519`) ; ✓ méta « Réponse unique · 3 réponses » (Création de cours, `CreationCours.css:632`) ; · sous-titre de mode de checklist (Création de cours (≥ 768), `CreationCours.css:901`) ; · compte « y cours » de la carte de thème (Cours, `SectionCours.css:105`) ; · méta de carte (Mes cours, Mes groupes, `FormateurListes.css:64`) ; · ligne « Cours terminés » (Mes groupes, `FormateurListes.css:101`) ; · description de la carte de profil (Parcours : Choix du profil, `Parcours.css:162`) ; · en-têtes de colonne du tableau (Dashboard admin (desktop), `DashboardFormateur.css:1045`) ; ● en-têtes de colonne du tableau des élèves (Détail groupe (desktop), `DetailGroupe.css:338`).

**Surtitre** (12) : ✓ surtitre « Thème N » (Détail thème, `DetailTheme.css:66`) ; ✓ thème au-dessus du titre (Fiche : leçon, récap, `FicheCours.css:215`) ; ✓ libellé « Étape suivante » de la carte encre (Fiche : leçon, checklist, `FicheCours.css:344`) ; ✓ libellé du cours au-dessus de la question (Fiche : quiz, Quiz flash, `FicheCours.css:426`) ; ✓ titre du cours dans la barre du haut (Fin de quiz, `FicheCours.css:718`) ; ✓ « Quiz terminé » (Fin de quiz, `FicheCours.css:763`) ; · thème de l'en-tête compact (Fiche : checklist, `FicheCours.css:1033`) ; ✓ libellé « Suite du thème » (Récap, `FicheCours.css:1339`) ; ✓ libellé violet (« Ton premier cours »…) (Dashboard apprenant, `Dashboard.css:131`) ; ● libellé sur carte violette (« Tu en es là ») (Dashboard apprenant, `Dashboard.css:137`) ; ✓ intertitre de jour (« Aujourd'hui ») (Dashboard formateur, `DashboardFormateur.css:549`) ; · surtitre « Thème N » de la carte de thème (Cours, `SectionCours.css:82`).

**Bouton** (22) : · libellé du bouton principal (Partagé, `shared.css:200`) ; · libellé du bouton secondaire (Partagé, `shared.css:230`) ; · libellé du bouton orange (quiz flash) (Dashboard apprenant, `shared.css:255`) ; · bouton pointillé « + Ajouter… » (Création de cours, `shared.css:380`) ; · libellé du bouton du parcours (écrasé par .bouton-primaire / .bouton-secondaire) (Parcours, `GabaritParcours.css:86`) ; · « Annuler » (bouton secondaire sur design-system ; lien texte en prod) (Modales, barre de Création de cours, `Formateur.css:397`) ; · libellé du bouton rouge (Modale de confirmation, `Formateur.css:411`) ; ✓ bouton Retour « Cours » (Détail thème, `DetailTheme.css:21`) ; ✓ bouton Retour (nom court du thème) (Fiche, `FicheCours.css:170`) ; · libellé du bouton blanc (Fiche : leçon, checklist, `FicheCours.css:374`) ; · libellé du bouton « Valider ma réponse » (Fiche : quiz, Quiz flash, `FicheCours.css:685`) ; · libellé du bouton principal (Fin de quiz, `FicheCours.css:901`) ; · libellé des boutons « Relire / Refaire / Revoir » (Récap, `FicheCours.css:1323`) ; · libellé du bouton blanc à flèche (Dashboard apprenant, `Dashboard.css:222`) ; · libellé du bouton large orange (Dashboard apprenant, `Dashboard.css:255`) ; ✓ libellé du bouton « Commencer » (Dashboard apprenant, `Dashboard.css:410`) ; ✓ libellé du bouton « Lancer » (Dashboard apprenant, `Dashboard.css:495`) ; · libellé du bouton d'étape (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:740`) ; ✓ carte pointillée « + Assigner un cours » (Détail groupe, `DetailGroupe.css:137`) ; · bouton d'outil « Image / Vidéo » (Création de cours, `CreationCours.css:438`) ; · bouton « Image » d'étape (Création de cours, `CreationCours.css:1038`) ; · bouton « Lancer » vertical (Dashboard apprenant (desktop, colonne étroite), `Dashboard.css:960`).

**Lien texte** (19) : · entrée du menu (Se déconnecter) (Navigation, `espace-layout.css:123`) ; · lien « ← Retour » (Mot de passe oublié, `shared.css:321`) ; · lien secondaire (simuler le lien) (Mot de passe oublié, `shared.css:343`) ; ✓ lien sous le bouton (« Déjà un compte ? … ») (Parcours, `GabaritParcours.css:106`) ; · lien « Passer » (Parcours : Introduction, `GabaritParcours.css:135`) ; · texte du lien Retour « ‹ Mes cours » (Espace formateur, `Formateur.css:161`) ; · action du menu « … » (Espace formateur, `Formateur.css:297`) ; · bouton texte « Supprimer ce groupe » (Détail groupe, `Formateur.css:433`) ; · bouton « Quitter l'aperçu » (Aperçu élève, `FicheCours.css:115`) ; · lien « Revoir la leçon » (Fiche : quiz, Quiz flash, `FicheCours.css:673`) ; · liens « Revoir mes erreurs »… (Fin de quiz, `FicheCours.css:919`) ; · lien « Passer cette étape » (Fiche : checklist, `FicheCours.css:1153`) ; · lien « Tout voir » / « Mes badges · X/6 » (Dashboard apprenant, Cours, `Dashboard.css:166`) ; · lien « Tout voir » (Dashboard formateur, admin, `DashboardFormateur.css:112`) ; · lien « Voir les N autres » / « Voir plus » (Dashboard formateur, `DashboardFormateur.css:128`) ; · lien « Assigner » (Détail groupe, `DetailGroupe.css:87`) ; · lien « Voir les N autres » (Détail groupe, `DetailGroupe.css:255`) ; · bouton Retour « Mes cours » (Création de cours (≥ 1024), `CreationCours.css:144`) ; · liens « Voir comme un élève » / « Créer un groupe » (Création de cours, `CreationCours.css:208`).

**Navigation** (6) : · libellé d'entrée de la tab bar (mobile) (Navigation, `espace-layout.css:48`) ; · libellé d'étape (Leçon, Quiz · 4/5…) (Fiche : leçon, checklist, `ReperEtapes.css:67`) ; · pastilles de filtre « Tout / Commencés / Terminés » (Dashboard formateur, `DashboardFormateur.css:494`) ; · pastille de section collante (Création de cours (< 1024), `CreationCours.css:94`) ; · entrée du sommaire (Création de cours (≥ 1024), `CreationCours.css:181`) ; · onglet « Écrire / Aperçu » (Création de cours, `CreationCours.css:409`).

**Libellé de champ** (4) : · libellé de champ (.champ) (Partagé (modales, Détail groupe, Mes cours, mot de passe), `shared.css:126`) ; ● libellé de champ (Parcours, `GabaritParcours.css:228`) ; · libellé de champ (Création de cours, `CreationCours.css:266`) ; · libellé « Bonne réponse » (Création de cours, `CreationCours.css:832`).

**Saisie et choix** (18) : · saisie de champ input (.champ) (Partagé, `shared.css:136`) ; · saisie de champ textarea (.champ) (Partagé, `shared.css:148`) ; ✓ saisie de champ (Parcours, `GabaritParcours.css:248`) ; ● saisie du grand champ (prénom, organisme…) (Parcours : questions, `GabaritParcours.css:269`) ; · ligne de choix (statut, âge, motivation) (Parcours : questions, `GabaritParcours.css:296`) ; · saisie de la recherche (Cours, `EntetePage.css:48`) ; · valeur affichée de la liste déroulante (Création de cours, Mes cours, `Dropdown.css:12`) ; · option de la liste déroulante (Création de cours, Mes cours, `Dropdown.css:61`) ; · libellé de case à cocher (Modale d'assignation, Création de cours, `Formateur.css:527`) ; ✓ texte de réponse (Fiche : quiz, Quiz flash, `FicheCours.css:467`) ; ● saisie « Un élève » (Dashboard formateur, `DashboardFormateur.css:531`) ; ✓ saisie de l'email d'ajout (Détail groupe, `DetailGroupe.css:46`) ; · bouton de choix (groupe, mode de checklist) (Création de cours, `CreationCours.css:327`) ; · saisie de l'éditeur de leçon (Création de cours, `CreationCours.css:458`) ; · saisie de réponse / d'explication (Création de cours, `CreationCours.css:767`) ; ● saisie d'explication (Création de cours, `CreationCours.css:776`) ; ● libellé de mode de checklist (Création de cours, `CreationCours.css:895`) ; · saisie de l'intitulé d'étape (Création de cours, `CreationCours.css:961`).

**Pastille** (24) : · pastille de statut (Nouveau, À faire, Non commencé) (Partagé (Cours, Dashboard, Détail groupe…), `espace-layout.css:252`) ; ✓ pastille de statut En cours / Terminé (Partagé, `espace-layout.css:275`) ; · nom du badge dans le toast (Partagé (fiche), `CompletionToast.css:48`) ; ✓ numéro dans la pastille d'étape (Fiche : leçon, checklist, `ReperEtapes.css:56`) ; · pastille de groupe / « Non assigné » (Espace formateur, `Formateur.css:178`) ; ● « +N » sur la dernière miniature (Détail cours, `DetailCoursFormateur.css:246`) ; ✓ numéro de question (Détail cours, `DetailCoursFormateur.css:328`) ; · pastille « Ta réponse » / « Bonne réponse » (Fiche : quiz, Quiz flash, `FicheCours.css:606`) ; ● pastille « +20 XP » (Fin de quiz, `FicheCours.css:830`) ; · pastille « Nouveau badge » (Fin de quiz, `FicheCours.css:881`) ; ✓ numéro dans la pastille d'étape (Fiche : checklist, `FicheCours.css:1109`) ; · pastille « Bloquante » (Fiche : checklist, `FicheCours.css:1215`) ; · « X XP gagnés » (pastille Terminé) (Récap, `FicheCours.css:1276`) ; · pastille « De ton formateur » (Dashboard apprenant, `Dashboard.css:191`) ; · pastille orange « Défi du jour » (Dashboard apprenant, `Dashboard.css:206`) ; ✓ pastille « Compte officiel » (Dashboard admin, `DashboardFormateur.css:63`) ; · pastille « À surveiller / Bon rythme » (Dashboard formateur, `DashboardFormateur.css:236`) ; · initiales sur rond lavande (Dashboard formateur, `DashboardFormateur.css:596`) ; · pastille du groupe (Dashboard formateur, `DashboardFormateur.css:626`) ; ● numéro dans le rond (Dashboard formateur : Pour bien démarrer, `DashboardFormateur.css:695`) ; · pastille « Compte officiel : ce cours sera public » (Création de cours, `CreationCours.css:236`) ; · numéro de question / d'étape (Création de cours, `CreationCours.css:575`) ; ● lettre de réponse (Création de cours, `CreationCours.css:751`) ; · pilule « Bloquante » (Création de cours, `CreationCours.css:1013`).

**Chiffre mis en avant (standard)** (3) : ✓ chiffre des petites cartes d'avancement (Détail cours, `DetailCoursFormateur.css:130`) ; ✓ taux de complétion (chiffre) (Dashboard formateur, `DashboardFormateur.css:206`) ; ● chiffre de carte (Dashboard admin, `DashboardFormateur.css:777`).

**Chiffre mis en avant (grand)** (1) : ✓ score « 4/5 » dans l'anneau (Fin de quiz, `FicheCours.css:795`).

**Compteur** (10) : ● compteur « 2 / 5 » (Parcours : questions, `GabaritParcours.css:195`) ; · « +15 XP » du toast (Partagé (fiche), `CompletionToast.css:39`) ; ✓ compteur « 3 / 5 » (Fiche : quiz, Quiz flash, `FicheCours.css:413`) ; · « 80 % » sous le score (Fin de quiz, `FicheCours.css:801`) ; ● « [N] XP » de l'en-tête (Dashboard apprenant, `Dashboard.css:30`) ; · compteur de barre « X / 3 » (Dashboard apprenant, `Dashboard.css:318`) ; ● compteur de barre, petite variante (Dashboard apprenant, `Dashboard.css:323`) ; ● pourcentage dans l'anneau (Dashboard apprenant, `Dashboard.css:382`) ; ✓ compteur « X/6 » (Dashboard apprenant : modale Mes badges, `Dashboard.css:1001`) ; · % de la barre du groupe (Dashboard formateur, `DashboardFormateur.css:330`).
