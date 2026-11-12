Statut : brouillon 3.0.0, validé le 11 novembre 2026 (critères v3, rangement `esp3.md`). Tokens : `tokens/espacements.tokens.json`, rôles `espace-<rôle>` (section 11). Ce fichier dit quel rôle prendre ; il ne recopie pas le code.

# Espacements

## 1. Sources

- Relevé de la prod : 792 déclarations d'espacement (padding, margin, gap) dans 26 fichiers CSS, aucune en style en ligne (`esp0.md`).
- Critères de rattachement (`criteres-esp.md` v3, avec ses sections « Décisions »). Les rôles de l'audit du 22/10 (`docs/audit-espacements.md`, R1 à R27) ont servi de matière.
- Rangement et décompte des changements (`esp1.md`, `esp2.md`, `esp3.md`).
- Décision de l'échelle (20/10/2026) : base 4, 11 paliers, nommage par la valeur.

## 2. Échelle et unité

**Les primitifs `espace-N` ne changent pas.** Liste fermée de 11 paliers :

**2 · 4 · 6 · 8 · 10 · 12 · 16 · 20 · 24 · 32 · 40**

- **Base 4**, avec des demi-pas (2, 6, 10) admis seulement en dessous de 12. Aucune valeur n'est ajoutée : `espace-14` n'existe pas.
- **Nommage par la valeur** : une maquette qui indique 16 se lit `espace-16`, sans calcul. Le nom invite à deviner un palier qui n'existe pas (`espace-14`). La parade est la liste fermée ci-dessus. On ne change jamais la valeur d'un primitif : c'est le rôle qui pointe vers un autre palier.
- **Un composant ne lit jamais un primitif.** Il lit un token de rôle (section 11), qui pointe vers un primitif, comme pour les couleurs.

**Unité : px, partout, sans sortie en rem** (décidé le 11/11).
- **Raison** : quand la police du navigateur est agrandie, la place gagnée doit aller au texte. WCAG 2.2, critère 1.4.4, demande que le texte grandisse, pas l'espace autour. Avec une seule unité, l'agent n'a pas à choisir.
- **Coût accepté** : à 200 %, le rapport entre l'espace et le texte est divisé par deux.

## 3. Choisir le rôle

La fonction et la place d'un espacement décident de son rôle, **jamais sa valeur actuelle ni la taille de l'élément**. Deux espacements qui décrivent la même relation entre deux éléments ont le même rôle, et la même valeur, où qu'ils soient.

Le moins de rôles et de valeurs possible, pour que l'agent n'ait pas à choisir : une valeur par rôle, la même à toutes les largeurs. Aucun seuil à 768 px.

Pour un espacement donné, on se demande dans l'ordre :
1. **Est-ce le padding interne d'un contrôle** (bouton, champ, pastille, choix, entrée de navigation, lien) **ou l'écart entre son icône et son libellé ?** Padding d'un contrôle, ou Icône et libellé.
2. **Est-ce le bord d'un conteneur ?**
   - la page : Marge de page ;
   - une Surface : Padding d'une Surface ;
   - un Élément : Padding d'un Élément ;
   - une carte de liste ou une ligne : Ligne de liste ;
   - un bloc à fond posé à moins de 20 px du bord de sa Surface : Bloc près du bord.
3. **Est-ce l'écart entre deux choses ?**
   - deux blocs de la page, empilés : Entre deux blocs ;
   - deux groupes d'une Surface, ou un titre de section posé sur la page et son contenu : Entre deux groupes ;
   - deux textes d'un même groupe : Deux textes d'un groupe ;
   - des éléments différents côte à côte : Rangée ;
   - des éléments de même nature répétés : Répétition ;
   - deux colonnes d'une liste : Colonnes.
4. **Est-ce du contenu de leçon** (Markdown, intertitre, « À retenir ») ? Rythme du contenu.

## 4. Les rôles

| Rôle | Valeur | Définition | Exemples Skillo |
|---|---|---|---|
| **Marge de page** | 16 px à gauche et à droite sous 768 px ; au-dessus, valeurs actuelles gardées | Padding du Conteneur de page (`.espace-contenu`, `.espace-page`), sur toutes les pages, y compris les pages hors navigation. Une barre fixe sur toute la largeur prend la marge horizontale de page. | Conteneur de page ; barre d'action du quiz ; barre d'enregistrement mobile de Création de cours ; bandeau Aperçu élève ; pages Mot de passe oublié et Nouveau mot de passe. |
| **Entre deux blocs** | 20 px | Écart entre deux blocs de nature différente, ou deux sections d'une page, empilés. Retour compris. | Retour et en-tête ; en-tête et « De ton formateur » ; blocs du dashboard apprenant (bloc de tête, quiz flash, badges, « De ton formateur ») ; deux cartes de section du Détail cours ; deux cartes de Création de cours. |
| **Padding d'une Surface** | 20 px, les quatre côtés | Padding de tout bloc posé directement sur le fond de la page, ou flottant au-dessus (même sens que dans `rayons.md`). | Carte, en-tête de page lavande, bloc de tête du dashboard, blocs d'introduction et « Plus qu'une étape », modale, feuille, toast. |
| **Bloc près du bord** | 8 px, le même en haut, en bas et sur les côtés | Écart entre un bloc à fond et le bord de la Surface qui le contient, quand il est à moins de 20 px de ce bord. Il vaut aussi quand le bloc est le dernier. | Entrée de menu, entrée de tab bar, étape en cours de la checklist, outils de la barre de l'éditeur. |
| **Entre deux groupes** | 12 px | Écart entre deux groupes d'une Surface : titre (ou bloc de titres) et texte, texte et bouton, titre de section et son contenu, deux champs (chaque champ avec son libellé et son aide forme un groupe), bouton principal et lien en dessous. Aussi l'écart dans une barre qui n'est pas une rangée, et l'écart entre un titre de section posé directement sur la page et son contenu. | En-tête et liste de « De ton formateur » ; détail et bouton de « Étape suivante » ; anneau et titre de la fin de quiz ; « Passer » et logo de l'Introduction ; « Thèmes » de la page Cours et sa grille ; « Cours assignés » du Détail groupe et sa rangée. |
| **Deux textes d'un groupe** | 4 px | Surtitre et titre ; titre et sous-titre ou compteur (en-tête lavande compris) ; titre et méta d'une ligne ; libellé et son champ ; champ et son aide ou son erreur ; deux puces d'une liste. | « Thème N », titre et compteur du Détail d'un thème ; titre et « Leçon · Quiz » d'une ligne ; libellé « Titre » et son champ. |
| **Rangée** | 12 px | Écart entre des éléments différents posés côte à côte. | Éléments d'une ligne (vignette, texte, statut, chevron) ; titre et action d'un en-tête de carte ; bloc de titres et action ou recherche ; barre du haut d'un écran ; filtres et recherche ; champ et bouton. |
| **Répétition** | 8 px | Écart entre des éléments de même nature répétés, sans séparateur. | Cartes d'une grille ou d'une pile (thèmes, Mes cours) ; boutons côte à côte (CTA du dashboard formateur) ; pastilles ; filtres ; choix d'une liste de réponses ; tuiles de badges. |
| **Ligne de liste** | ligne : 12 px sur les quatre côtés ; carte qui la contient : 8 px partout ; cellule de tableau : 12 px en haut et en bas (`espace-ligne`), 12 px sur les côtés (`espace-rangee`) | Liste à lignes séparées par un trait de 1 px. La ligne porte le padding, pour que le texte tombe à 20 px du bord de la carte (8 + 12). | Liste d'un thème, Mode terrain, résultats de recherche, « De ton formateur », récap, étapes de la checklist, fil d'activité ; tableau des élèves du Détail groupe, tableau admin. |
| **Icône et libellé** | 8 px | Écart entre une icône et son libellé, dans un bouton, une pastille, une entrée de navigation ou un lien. | Chevron et libellé du Retour ; éclair et « +20 XP » ; icône et libellé d'une entrée de tab bar. |
| **Padding d'un contrôle** | une valeur par composant (section 7) | Padding interne d'un contrôle. | Bouton, Retour, Champ, Pastille, Choix, Entrée de navigation, Lien texte, Étiquette. |
| **Rythme du contenu** | section 7 | Écarts du contenu de leçon. | `ContenuMarkdown`, intertitres de leçon, « À retenir ». |
| **Colonnes** | 40 px | Écart entre deux colonnes d'une liste sur desktop. Le nombre de colonnes : `mise-en-page.md`, section 6. | Mode terrain et résultats de recherche ; « De ton formateur » de la page Cours. |
| **Padding d'un Élément** | 16 px, les quatre côtés | Padding de tout bloc à fond ou à contour posé dans une Surface (même sens que dans `rayons.md`). | Question, étape et repère de Création de cours ; blocs « Tes groupes », relances et « Personne à relancer » ; petites cartes de chiffre du Détail cours ; « À retenir » ; étape en cours ; repère d'étapes ; aperçu de la leçon. |

### Cas limites entre deux rôles voisins

- **Entre deux blocs ou Répétition.** Deux blocs de nature différente, ou deux sections empilées, sont dans Entre deux blocs (20). Deux cartes de même nature répétées dans une grille ou une pile sont dans Répétition (8). Exemple : les cartes de thème entre elles sont en Répétition ; l'en-tête de la page Cours et la grille des thèmes, en Entre deux blocs.
- **Entre deux groupes ou Deux textes d'un groupe.** Si les deux textes forment une seule information (le titre et ce qui le précise : surtitre, sous-titre, compteur, méta, aide), c'est Deux textes d'un groupe (4). Si ce sont deux informations distinctes, ou un texte et une action, c'est Entre deux groupes (12). Exemple : titre et « 2 min de lecture » font un groupe ; le bloc de titres et le repère d'étapes sont deux groupes.
- **Padding d'une Surface ou Bloc près du bord.** Le padding d'une Surface (20) écarte son contenu de son bord. Quand un bloc à fond doit être plus près du bord que 20 (entrée de menu, étape en cours, entrées de la tab bar), la Surface prend 8 de padding et le bloc est posé directement, sans calc ni marge négative : c'est Bloc près du bord.
- **Ligne de liste ou Padding d'un Élément.** Une ligne de liste n'a de fond qu'au survol : elle garde son padding de ligne (12). Un Élément a un fond ou un contour au repos : il prend 16.

## 5. Hiérarchie

- **Surface 20 > Élément 16.** Un bloc posé dans un autre a un padding plus petit, comme il a un rayon plus petit.
- **Bloc près du bord : 8 sur les quatre côtés, y compris quand le bloc est le dernier.** Les coins sont alors concentriques (rayon de Surface 30 − 8 = rayon d'Élément 22, `rayons.md`, section 7). Avec deux écarts différents, aucun rayon unique ne peut l'être. **Construction** : le padding de la Surface vaut 8, et le bloc est posé directement, sans calc ni marge négative.
- **Liste** : la carte de liste a 8 de padding partout, et la ligne porte 12 sur les quatre côtés. Au survol, le fond (`fond-accent`) remplit la ligne : c'est un Élément à 8 du bord de la carte, avec 12 entre son bord et le texte. Le texte tombe à 20 du bord de la carte, comme dans une Surface.
- **En-tête d'une carte de liste (titre, pastille, compteur, lien posés au-dessus des lignes)** : posé comme une ligne, padding `espace-ligne` sur les quatre côtés, sans survol ni séparateur, aucun écart en plus avec la liste. Son texte tombe à 20 du bord de la carte, comme celui des lignes.

## 6. Débords et défilement

- **Une marge négative de débord annule exactement le padding qu'elle traverse et le cite.** Elle n'a pas de valeur propre : c'est l'opposé du token du rôle traversé (Marge de page, Padding d'une Surface). Exemple : la rangée « Cours assignés » du Détail groupe traverse la marge de page de 16, donc −16.
- **Une rangée qui défile jusqu'au bord de l'écran reprend la marge de page au début et à la fin.** La première carte s'aligne sur la marge de 16 (`scroll-padding-inline`), et seul le bord droit déborde. Exemple : « Cours assignés » du Détail groupe.
- **Une rangée de contrôles ne défile pas** (filtres, outils, boutons) : elle passe à la ligne quand elle ne tient pas (`mise-en-page.md`, section 7). Seules les rangées de cartes défilent. Exception écrite : les pastilles collantes du sommaire mobile de Création de cours (`mise-en-page.md`, section 8).
- **Un tableau plus large que sa carte défile horizontalement dans sa carte** (`overflow-x: auto`). La zone qui défile annule le padding de la carte (règle du débord), et le contenu le reprend au début et à la fin. Concernés : le tableau des élèves du Détail groupe et le tableau du dashboard admin, par précaution.
- **La zone de sécurité** (`env(safe-area-inset-*)`) s'ajoute à la valeur du rôle, elle ne la remplace pas.

## 7. Rôles de contrôle et de contenu

### Padding d'un contrôle

| Composant | Valeur | Précisions |
|---|---|---|
| Bouton | 24 px sur les côtés | La hauteur donne le vertical : **48 px** pour un bouton posé seul (principal, secondaire, orange) ; 44 px est la zone tactile minimale (`ds-principes-composants.md`, Bouton, Accessibilité), pas la hauteur d'un composant ; **posé dans la rangée d'un champ, il prend la hauteur du champ** (une seule hauteur par rangée, `ds-principes-composants.md`, Champ). Pour les vrais boutons seulement : un filtre, un choix, un onglet ou « Bonne réponse » est un Choix. **Bouton à flèche** (bouton blanc « Continuer le cours », « Passer au quiz ») : 24 à gauche ; à droite, le rond de la flèche reste à 6 du bord, c'est la place de l'icône, pas un padding de texte. **Rangée des CTA du dashboard formateur** : la rangée passe à la ligne (Répétition, 8), le libellé de chaque bouton reste sur une ligne (`white-space: nowrap`). |
| Retour | 12 px côté chevron, 20 px côté libellé | Sur mobile, chevron seul : 12 des deux côtés. |
| Champ | 16 px sur les côtés | Champ multiligne compris. **Champ multiligne** : vertical de 12, qui place la première ligne comme dans un champ d'une ligne de 48. **Champ de recherche ou d'ajout avec icône à gauche** : le côté gauche garde une réserve de **44 px** : l'icône de 20 px posée à 16 px du bord (Padding d'un contrôle, Champ), puis 8 px jusqu'au texte (Icône et libellé). Seul le côté droit prend 16. |
| Pastille | 4 px en haut et en bas, 10 px sur les côtés | |
| Choix | 10 px en haut et en bas, 16 px sur les côtés | Ligne de réponse (quiz, parcours, Création de cours), case, mode de checklist, filtre, choix de groupe, type de réponse, onglets « Écrire / Aperçu ». **Choix à hauteur fixe** (filtres, onglets, choix de Création de cours) : 16 sur les côtés seulement, la hauteur donne le vertical ; posé dans la rangée d'un champ (filtres d'Activité récente), il prend la hauteur du champ. **« Bonne réponse »** : côté gauche à 0 sous 768 px, pour que le contrôle reste aligné sur le champ. |
| Entrée de navigation | 8 px en haut et en bas, 16 px sur les côtés | Tab bar, barre du haut, menus, sommaire de Création de cours. **Entrée de liste déroulante** : le côté gauche garde la réserve de la coche (30 px). **Entrée de la tab bar mobile** : 8 × 16 seulement si « Dashboard » tient à 320 px, sinon exception écrite (à mesurer). |
| Lien texte | 6 px sur les côtés | Zone cliquable autour d'un lien. |
| Étiquette | 4 px | Étiquette d'image de Création de cours. |

Les Choix et les Boutons ne se confondent pas : un Choix reste marqué quand il est choisi, un Bouton agit (voir le rôle typographique Navigation ou Bouton, `typographie.md`, section 6).

### Rythme du contenu

Pour `ContenuMarkdown` et l'intertitre de leçon. Les titres Markdown et l'intertitre de leçon ont le même rôle typographique (Titre de section) et prennent les mêmes valeurs.

| Écart | Valeur |
|---|---|
| Entre deux paragraphes, listes ou médias (image, vidéo, tableau) | 16 px |
| Au-dessus d'un intertitre | 20 px |
| Sous un intertitre | 8 px |
| Retrait des puces | 20 px |
| Entre deux puces | Deux textes d'un groupe (4 px) |

## 8. Valeur hors échelle sans rôle

Une valeur qui a un rôle prend la valeur du rôle, jamais un arrondi. Pour une valeur **sans rôle** et hors échelle : **le palier le plus proche ; à égalité, le palier supérieur.** L'agent l'applique et le signale dans son rapport.

Restent hors échelle, volontairement, parce que ce sont des dimensions de mise en page et non du rythme d'espacement :
- les réserves pour les objets 3D (padding qui laisse la place à une illustration) ;
- les débords des illustrations ;
- les marges de page desktop ;
- les réserves des zones d'action fixes (bas de page sous une barre d'action ou sous la tab bar) ;
- la place réservée au-dessus d'une carte badge de fin de quiz (débord de l'illustration) ;
- la hauteur minimale d'un en-tête lavande sur desktop (objet 3D centré verticalement) : hauteur de l'objet 3D + 2 × `espace-surface`, en px avec un commentaire qui renvoie à cette section, pour que l'objet reste dans le cadre (même logique que la réserve des illustrations) ;
- les **positions** d'un élément fixe, collant ou posé en absolu : barre du haut, tab bar, menu et carte du menu « … », toast, « Passer », sommaire collant, objet 3D ou illustration dans son cadre, coche d'une entrée de liste déroulante dans sa réserve, bouton posé dans un champ ;
- le **bas d'une page sans barre fixe** : 24 px (`.flow-page`, rien à réserver en bas : ni tab bar, ni zone d'action) ;
- le **haut du Conteneur de page** : 20 px + zone de sécurité sous 768 (16 px + zone de sécurité en mode concentré, Création de cours). Le haut du contenu sous la barre du haut et l'arrêt des ancres sont dans `mise-en-page.md`, section 5.

Les largeurs de colonne, les seuils, le haut du contenu sous la barre du haut et les exceptions de mise en page sont dans `mise-en-page.md`, avec leur propre renvoi.

**Écriture d'une valeur hors rôle** (dimension de cette section ou exception de la section 9) : en px dans le composant, avec un commentaire qui renvoie à la section, par exemple `/* espacements.md, section 8 : réserve de l'objet 3D */` ou `/* espacements.md, section 9 : onglets Écrire / Aperçu */`. **Jamais un primitif `espace-N`**, même quand la valeur existe dans l'échelle.

## 9. Exceptions écrites

Une exception est attachée à son composant. Elle se signale, elle ne sert pas de modèle.

| Composant | Exception | Statut |
|---|---|---|
| Onglets « Écrire / Aperçu » (Création de cours) | Padding du sélecteur : 4 px | Exception de composant |
| Barre empilée (Avancement des élèves, Détail cours) | Écart entre deux segments : 4 px | Exception de composant |
| Modale Mes badges | Marge du contour de mise en évidence : 4 px (place du contour de 2 px) | Exception de composant |
| Modale Mes badges | Bouton Fermer : padding 2 × 8 px | Provisoire, réglé quand Mes badges passera sur le composant Modale |
| Barre d'enregistrement desktop (Création de cours) | Padding 10 · 10 · 10 · 24 px (pilule flottante) | Provisoire, chantier composants |
| Création de cours, desktop | Écart des colonnes de mise en page (sommaire et contenu) : 32 px | Dimension de mise en page |
| Tab bar mobile (sous 768) | Côtés de la barre à 12 px (au lieu de la marge de page), padding de la barre 6 px, écart entre entrées 4 px, entrée 6 px en haut et en bas, 4 px sur les côtés. Raison : à 320 px, « Dashboard » en Navigation (14 px, 800) ne tient avec aucun padding d'entrée dans la barre construite avec les rôles, et la typographie interdit de réduire la taille ou le libellé (règle de la tab bar). Desktop : rôles normaux (Entrée de navigation 8 × 16). | Exception de composant |
| Tab bar | Position de la barre flottante : côtés à 12 px sous 768 (exception « Tab bar mobile » ci-dessus), bas 20 px | Dimension du composant (position, comme une réserve), hors rôle |
| Centrages optiques | Marge de 2 à 8 px pour aligner un élément (chevron sur une vignette, numéro sur un intitulé) | À remplacer par un alignement (`align-items`, `line-height`). Exception écrite seulement là où l'alignement ne reproduit pas le rendu. |

## 10. Conduite de l'agent

Si aucun rôle de la section 4 ne s'applique, ou si deux rôles s'appliquent sans que la section 3 ne tranche, l'agent construit le reste de l'écran, écrit « À trancher » dans son rapport avec le rôle le plus proche et sa raison, et propose. **Il n'utilise jamais un primitif `espace-N` à la place**, il n'ajoute aucun rôle et aucun token.

## 11. Tokens

Une couche de tokens de rôle pointe vers les primitifs `espace-N`, comme les sémantiques de couleur. **Un composant lit toujours un token de rôle**, jamais un primitif, ni une valeur en px écrite en dur, sauf les valeurs hors rôle des sections 8 et 9, écrites en px avec leur commentaire.

Source : `tokens/espacements.tokens.json`, groupe `espace`. Les primitifs ont pour nom un nombre (`espace-20`), les rôles un mot (`espace-surface`). Chaque rôle est un alias d'un primitif et sort en CSS sous la forme `var(--espace-N)` (`src/styles/tokens.generes.css`, généré par `npm run tokens`). Les rôles à deux valeurs ont un token par axe (`-vertical`, `-horizontal`), et un token par côté pour le Retour. Une marge négative de débord s'écrit avec le token du rôle traversé : `calc(-1 * var(--espace-marge-page))`.

| Token | Rôle | Valeur |
|---|---|---|
| `espace-marge-page` | Marge de page (côtés sous 768 px, barres fixes) | 16 px |
| `espace-blocs` | Entre deux blocs | 20 px |
| `espace-surface` | Padding d'une Surface | 20 px |
| `espace-bord` | Bloc près du bord, et padding d'une carte de liste | 8 px |
| `espace-groupes` | Entre deux groupes | 12 px |
| `espace-textes` | Deux textes d'un groupe, et deux puces | 4 px |
| `espace-rangee` | Rangée, et padding horizontal d'une cellule de tableau | 12 px |
| `espace-repetition` | Répétition | 8 px |
| `espace-ligne` | Ligne de liste (quatre côtés), et padding vertical d'une cellule de tableau | 12 px |
| `espace-icone` | Icône et libellé | 8 px |
| `espace-bouton` | Padding d'un contrôle, Bouton (côtés) | 24 px |
| `espace-retour-chevron` | Padding d'un contrôle, Retour, côté chevron | 12 px |
| `espace-retour-libelle` | Padding d'un contrôle, Retour, côté libellé | 20 px |
| `espace-champ` | Padding d'un contrôle, Champ (côtés) | 16 px |
| `espace-pastille-vertical` | Padding d'un contrôle, Pastille (haut et bas) | 4 px |
| `espace-pastille-horizontal` | Padding d'un contrôle, Pastille (côtés) | 10 px |
| `espace-choix-vertical` | Padding d'un contrôle, Choix (haut et bas) | 10 px |
| `espace-choix-horizontal` | Padding d'un contrôle, Choix (côtés) | 16 px |
| `espace-navigation-vertical` | Padding d'un contrôle, Entrée de navigation (haut et bas) | 8 px |
| `espace-navigation-horizontal` | Padding d'un contrôle, Entrée de navigation (côtés) | 16 px |
| `espace-lien` | Padding d'un contrôle, Lien texte (côtés) | 6 px |
| `espace-etiquette` | Padding d'un contrôle, Étiquette | 4 px |
| `espace-paragraphes` | Rythme du contenu : entre deux paragraphes, listes ou médias | 16 px |
| `espace-intertitre-avant` | Rythme du contenu : au-dessus d'un intertitre | 20 px |
| `espace-intertitre-apres` | Rythme du contenu : sous un intertitre | 8 px |
| `espace-retrait-puces` | Rythme du contenu : retrait des puces | 20 px |
| `espace-colonnes` | Colonnes | 40 px |
| `espace-element` | Padding d'un Élément | 16 px |

## Annexe : correspondance des rôles

| Rôle | Critères (`criteres-esp.md`) | Rôles de l'audit (`audit-espacements.md`) |
|---|---|---|
| Marge de page | E1 | R25 |
| Entre deux blocs | E2 | R1, R2, R3 |
| Padding d'une Surface | E3 | R4, R7 (cartes) |
| Bloc près du bord | E4 | — (décision des rayons) |
| Entre deux groupes | E5 | R8 (groupes), R9, R16, R21 (deux champs), R23 |
| Deux textes d'un groupe | E6 | R5, R8 (textes), R13, R21 (libellé et champ), R24 (puces) |
| Rangée | E7 | R6, R12 |
| Répétition | E8 | R17 |
| Ligne de liste | E9 | R10, R11 |
| Icône et libellé | E10 | R18 |
| Padding d'un contrôle | E11 | R19, R20, R22 |
| Rythme du contenu | E12 | R24 (retrait), R26 |
| Colonnes | E13 | R14 |
| Padding d'un Élément | E14 | R7 (blocs dans une carte) |
| — (hors rôle) | hors rangement | R15 (centrages optiques), R27 (réserves et débords) |
