# Lot : pages Cours, détail d'un thème, Mode terrain + pastilles de statut

Lis d'abord le CLAUDE.md du dépôt. Ce lot applique des maquettes validées (canvas Claude Design, rangées « Cours » et « Terrain »). Ne change que ce qui est décrit ici. Ne commite pas.

## 0. Illustrations à ajouter

Deux objets Fluent Emoji 3D (Microsoft, licence MIT), à ranger dans `public/illustrations/` avec le même nommage que les autres :

- Books : https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Books/3D/books_3d.png (en-tête de la page Cours)
- Clipboard : https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Clipboard/3D/clipboard_3d.png (en-tête de la page Terrain)

Si le téléchargement échoue, dis-le et continue avec un emplacement vide de la bonne taille.

## 1. Pastilles de statut (composant partagé, partout dans l'app)

Modifie le composant de pastille de statut commun, pour que le changement s'applique partout où il est utilisé (dashboard apprenant, bloc « De ton formateur », page Cours, détail d'un thème, Mode terrain, et côté formateur s'il l'utilise aussi).

- **En cours** : fond violet plein `#5B3FE0`, texte blanc. Avant : lavande avec texte violet, jugé trop discret.
- **Terminé** : plus de fond ni de pilule. Une coche de 14 px suivie du mot « Terminé », les deux en `#17663F`, texte 13 px graisse 800. Avant : fond vert menthe, jugé trop vif face à la palette chaude.
- **À faire** : passe en neutre, texte `#5C566E` sur fond `#EFE9E0` (même style que « Non commencé »). Avant : lavande, qui se confondait avec l'ancien « En cours ».
- **Nouveau** et **Non commencé** : inchangés.

Le vert `#17663F` sur `#DFF3E7` reste utilisé pour les bonnes réponses du quiz et la pastille « Bon rythme » du dashboard formateur : ne touche pas à ces deux usages.

## 2. Page Cours (apprenant)

### Mobile

De haut en bas :

1. **Bloc d'en-tête lavande** (`#E4DEFF`, rayon 32 px, padding 22 px en haut, 20 px sur les côtés et en bas). Il remplace le titre et la recherche posés directement sur la page.
   - Objet Books de 88 px en haut à droite, à l'intérieur du cadre (14 px du bord droit, 12 px du haut), sans ombre. Il ne déborde pas : le débordement reste réservé au bloc de tête du dashboard.
   - Titre « Cours » (H1, 34 px).
   - Sous le titre : « X thèmes terminés sur 12 », 14 px, graisse 700, couleur `#3B3550`. Un thème est terminé quand tous ses cours le sont.
   - Champ de recherche dans le bloc, en pilule blanche de 48 px. Le comportement de la recherche ne change pas.
2. **Section « De ton formateur »**, à la place de l'actuelle « Cours de mon formateur ». Reprends le composant du bloc du même nom sur le dashboard : carte blanche, pastille ronde encre avec l'icône, titre 18 px. À droite du titre, le compteur « N cours » en texte secondaire.
   - Chaque ligne : vignette crème de 48 px avec l'objet du thème (36 px), titre du cours, pastille de statut, chevron. Lignes séparées par `#EFE9E0`.
   - Différence avec le dashboard : ici les cours terminés restent affichés, c'est la bibliothèque complète.
   - Tri : En cours, puis Nouveau, puis À faire, puis Terminé.
   - Section masquée si l'élève n'a aucun cours assigné.
3. **Titre « Thèmes »** (h2, 22 px), sans compteur à côté puisque l'info est dans l'en-tête.
4. **Grille des 12 thèmes**, 2 colonnes, espacement 10 px. Carte blanche, rayon 26 px, padding 14 px (16 px à gauche), hauteur minimale 176 px, toute la carte cliquable.
   - En haut : l'objet 3D du thème (52 px, via `imageTheme`) à gauche, chevron à droite. L'objet **remplace** la pastille ronde avec le numéro.
   - « Thème N » en 12 px, graisse 700, texte secondaire.
   - Nom du thème, 15 px, graisse 800, césure automatique.
   - En bas de carte, collé en bas :
     - thème terminé : la mention Terminé (nouveau style, coche verte) ;
     - thème commencé (au moins un cours en cours ou terminé) : « x / y cours » en 13 px, graisse 800, `#4A2FD0` ;
     - thème non commencé : « y cours » en 13 px, graisse 700, texte secondaire.

Pas de bloc « Thème en cours » en haut de page : le dashboard pousse déjà le cours en cours.

Garde la règle actuelle de l'app sur les cours comptés dans un thème. Si des cours privés y apparaissent en plus de la section formateur, signale-le sans corriger.

### Desktop (768 px et plus)

- En-tête lavande : rayon 36 px, padding 32 px vertical et 36 px horizontal. H1 « Cours » 44 px, sous-titre 16 px, recherche de 480 px de large sous le texte. Objet Books de 152 px, centré verticalement, à 48 px du bord droit.
- Bloc « De ton formateur » : les lignes passent sur 3 colonnes, et la pastille de statut se place sous le titre du cours.
- Titre « Thèmes » 28 px.
- Grille des thèmes : 4 colonnes à partir de 1100 px, 3 colonnes entre 768 et 1100 px, espacement 16 px. Cartes : rayon 28 px, padding 20 px, hauteur minimale 200 px, objet 64 px, « Thème N » 13 px, nom 18 px, compteur 14 px.

## 3. Détail d'un thème

1. Bouton retour en haut : pilule blanche de 44 px de haut, chevron gauche + « Cours ».
2. **Bloc lavande** (rayon 32 px, padding 22 px / 20 px) :
   - Objet du thème 92 px en haut à droite, à l'intérieur du cadre (16 px du haut et du bord droit).
   - « Thème N » 13 px, graisse 700, `#4A2FD0`.
   - Nom du thème en H1 : 28 px mobile, 32 px desktop. Largeur limitée pour ne jamais passer sous l'objet.
   - « x cours terminés sur y », 14 px, graisse 700, `#3B3550`.
3. **Liste des cours** dans une carte blanche (rayon 28 px, padding 6 px vertical, 18 px horizontal), lignes séparées par `#EFE9E0`. Chaque ligne :
   - titre du cours, 16 px, graisse 800 ;
   - dessous, ce que contient le cours : « Leçon · Quiz », « Leçon · Checklist » ou « Leçon · Quiz · Checklist », 13 px, texte secondaire ;
   - pastille de statut (ici « Non commencé » est affichée) ;
   - chevron.
   - Les cours restent dans l'ordre pédagogique (champ `ordre`) : le cours en cours ne remonte pas, c'est sa pastille violette qui le fait ressortir.
4. Desktop : même structure, contenu limité à 880 px de large.

## 4. Mode terrain

### Mobile

1. **Bloc d'en-tête lavande**, identique à celui de Cours (mêmes rayon, padding et position de l'objet), avec :
   - objet Clipboard 88 px ;
   - H1 « Terrain » ;
   - phrase « Les checklists à suivre sur le chantier, étape par étape. », 14 px, graisse 700, `#3B3550`, largeur limitée pour ne pas passer sous l'objet ;
   - pas de recherche.
2. **Liste plate** de tous les cours à checklist (publics et assignés par le formateur), dans une seule carte blanche (rayon 28 px, padding 4 px vertical, 16 px horizontal), lignes séparées par `#EFE9E0`. Pas de regroupement par thème : avec 9 checklists, les groupes feraient une ou deux lignes. Chaque ligne :
   - vignette crème de 48 px avec l'objet du thème (36 px) ;
   - titre, 15 px, graisse 800 ;
   - dessous, « [libellé court du thème] · N étapes », 13 px, texte secondaire. N = nombre d'étapes de la checklist. Pour un cours assigné par le formateur : « De ton formateur · N étapes » ;
   - statut : seulement « En cours » (pastille violette) ou la mention « Terminé ». Rien pour une checklist non commencée, pour garder la liste calme ;
   - chevron. Toute la ligne est cliquable et ouvre la checklist comme aujourd'hui.
3. **Ordre** : les checklists en cours en premier, puis l'ordre des thèmes (1 à 12), puis l'ordre du cours dans le thème.
4. Pour le statut, utilise la logique qui existe déjà pour savoir si une checklist est commencée ou terminée. Si elle n'existe pas, prends le statut de progression du cours et dis-le moi.
5. Garde l'état vide actuel s'il existe.

Libellés courts à ajouter dans `src/lib/thematiques.js`, un par thème : Thermodynamique, Fluides, Cycle frigorifique, Psychrométrie, Technologies, Dimensionnement, Installation, Brasage, Entretien, Diagnostic, Sécurité, Efficacité énergétique.

### Desktop

- En-tête comme celui de Cours en desktop (H1 44 px, phrase 16 px, objet Clipboard 140 px centré verticalement à droite), sans recherche.
- La liste reste dans une seule carte blanche (padding 8 px vertical, 28 px horizontal), avec les lignes réparties sur 2 colonnes (écart de 40 px entre les colonnes), vignette 52 px, titre 16 px. Pas de séparateur sous la dernière ligne de chaque colonne.

## 5. À la fin

- Mets à jour le CLAUDE.md du dépôt :
  - nouvelles pastilles de statut ;
  - structure des pages Cours, détail d'un thème et Terrain ;
  - règle « l'objet du thème remplace la pastille numéro » ;
  - libellés courts des thèmes.
- Liste-moi les fichiers modifiés et tout ce que tu n'as pas pu appliquer.
- Ne commite pas.
