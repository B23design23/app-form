# Lot : espace formateur, listes et détails

Contexte : on passe l'espace formateur dans la nouvelle DA. Ce lot couvre Mes cours, Mes groupes (et la modale de création), le Détail d'un groupe et le Détail d'un cours. La création et la modification de cours font l'objet d'un lot séparé (`lot-formateur-creation.md`), ne touche pas encore à ce formulaire.

Le dashboard formateur est déjà validé : ne le modifie pas, sauf le point 6.

Avant de commencer, lis le CLAUDE.md pour les tokens. Rappel des couleurs utilisées ici :
- fond de page formateur `#F4F4F6`, cartes `#FFFFFF`, champs `#F4F4F6` sur carte blanche et `#FFFFFF` sur fond gris ;
- encre `#1E1A33`, texte secondaire `#5C566E`, texte sur lavande `#3B3550` ;
- violet `#5B3FE0`, violet texte `#4A2FD0`, lavande `#E4DEFF` ;
- erreur `#B4232A` sur `#FDE3E1`, succès `#17663F` sur `#DFF3E7` ;
- séparateur et neutre pâle formateur `#ECECF0`, contour neutre `#D9D2C6`.

## 1. Règles communes à l'espace formateur

- **Plus de grande carte qui englobe toute la page.** Aujourd'hui Détail groupe et Détail cours mettent tout le contenu dans une carte blanche géante. Le titre de page se pose directement sur le fond gris, comme sur Mes cours, et chaque section a sa propre carte blanche (rayon 26 à 30 px, sans bordure, sans ombre).
- Largeur max du contenu desktop : 1200 px centrés, comme le dashboard.
- **Retour** : lien « ‹ Mes cours » ou « ‹ Mes groupes » en violet texte, au-dessus du titre (desktop). Sur mobile, bouton rond blanc de 44 px avec un chevron, en haut à gauche.
- **Actions destructrices** (retirer un élève, supprimer un cours, supprimer un groupe) : jamais un lien rouge répété sur chaque ligne. Elles passent dans un menu « … » (bouton rond de 40 px, icône trois points). Le menu est une carte blanche flottante (rayon 20 px, ombre `0 12px 32px rgba(30,26,51,0.16)`), l'action destructrice en rouge erreur, en dernier. Sur mobile, le même menu s'ouvre en feuille depuis le bas (fond assombri `rgba(30,26,51,0.45)`, coins hauts arrondis 30 px, petite poignée grise en haut, titre = le nom de l'élément).
- Toute suppression demande une confirmation (modale avec « Annuler » et un bouton rouge plein « Supprimer » / « Retirer »).
- **Pastilles de statut**, les mêmes que côté apprenant : En cours violet plein `#5B3FE0` texte blanc ; Non commencé `#ECECF0` texte `#5C566E` ; Terminé sans fond, coche + texte `#17663F`. Pas de point devant le libellé.
- **Pastille de groupe** : fond lavande `#E4DEFF`, texte encre, 13 px gras. « Non assigné » : fond `#ECECF0`, texte `#5C566E`.
- **Mobile** : l'espace formateur reste entièrement utilisable sur téléphone. On n'en optimise pas chaque détail, mais rien ne doit être bloqué ou cassé à 390 px de large (pas de défilement horizontal de la page).

## 2. Mes cours

- En-tête : H1 « Mes cours » et dessous, en texte secondaire 15 px, « X cours · Y assignés » (Y = cours liés à au moins un groupe).
- Bouton « + Créer un cours » à droite du titre, **violet plein** (c'est l'action principale de la page). Sur mobile : bouton rond violet de 52 px avec une icône « + » seule, `aria-label="Créer un cours"`.
- Ligne de filtres sous l'en-tête : champ de recherche (titre du cours), liste « Tous les thèmes » (déjà existante), nouvelle liste « Tous les groupes ». Champs blancs sur le fond gris. Sur mobile : recherche pleine largeur, puis les deux filtres en pastilles blanches.
- Grille : 2 colonnes desktop, 1 colonne mobile.
- Carte de cours (toute la carte cliquable, chevron à droite) :
  - titre 18 px gras ;
  - dessous, en texte secondaire : « Thème · Leçon · Quiz · Checklist » (seulement les parties que le cours contient, même logique que les résultats de recherche apprenant) ;
  - dessous, les pastilles des groupes assignés, ou « Non assigné ».
- État vide : inchangé.

## 3. Mes groupes et modale de création

- En-tête : H1 « Mes groupes », dessous « X groupes · Y élèves ». Bouton « + Créer un groupe » violet plein (rond « + » sur mobile).
- Grille : 3 colonnes desktop, 2 entre 768 et 1100 px, 1 sur mobile.
- Carte de groupe (toute cliquable, chevron en haut à droite) :
  - nom du groupe 22 px gras (20 px mobile) ;
  - « N élèves · N cours » en texte secondaire (« aucun cours » si 0) ;
  - ligne « Cours terminés » + pourcentage, puis une barre fine (8 px, piste `#ECECF0`, remplissage violet). Pourcentage = lignes `progression` à « termine » pour ce groupe ÷ (nombre d'élèves × nombre de cours assignés). Si aucun cours : barre vide et « - ».
  - une pastille d'état, une seule, dans cet ordre de priorité :
    1. aucun cours assigné → neutre « Assigne un premier cours » ;
    2. au moins un élève à relancer (même règle que le bloc « Élèves à relancer » du dashboard) → erreur « N élèves à relancer » ;
    3. pourcentage ≥ 70 % → succès « Bon rythme » ;
    4. sinon rien.
- **Modale « Nouveau groupe »** (remplace l'actuelle) :
  - titre « Nouveau groupe » 24 px, sous-titre « Tu ajouteras les élèves juste après. », bouton rond de fermeture (croix) en haut à droite ;
  - champ « Nom du groupe », placeholder « Ex. : Promo C » ;
  - en bas à droite : « Annuler » (texte violet) et « Créer le groupe ». Bouton désactivé tant que le champ est vide : fond lavande `#E4DEFF`, texte `#3B3550` (règle du design system, pas un violet délavé comme aujourd'hui) ;
  - après création, on arrive directement sur le Détail du nouveau groupe ;
  - Échap et clic sur le fond ferment la modale ;
  - sur mobile : feuille qui monte du bas, bouton pleine largeur.

## 4. Détail d'un groupe

Aujourd'hui la liste des élèves et le tableau de suivi répètent les mêmes noms. On les fusionne.

**En-tête**
- H1 nom du groupe (44 px desktop, 34 px mobile), dessous « 12 élèves · 3 cours assignés ».
- À droite (desktop) : champ blanc « Email de l'élève » avec une icône enveloppe + bouton violet plein « Ajouter ». Logique inchangée (RPC `find_apprenant_id_by_email`). Sur mobile : sous le titre, pleine largeur.
- Le bouton « Supprimer ce groupe » quitte le haut de page : il descend tout en bas, aligné à droite, en bouton texte rouge avec icône corbeille (desktop). Sur mobile : dans un menu « … » en haut à droite.

**Cours assignés** (nouvelle rangée)
- Une petite carte blanche par cours assigné : titre 15 px gras, barre de progression fine, « X terminés sur N ».
- Une dernière carte en pointillé violet « + Assigner un cours ». Au clic : modale (feuille sur mobile) qui liste les cours du formateur avec une case à cocher par cours ; valider ajoute ou retire les lignes `cours_groupes`.
- Desktop : grille de 4 colonnes (3 cours + le bouton ; au-delà, retour à la ligne). Mobile : titre « Cours assignés » avec un lien « + Assigner » à droite, cartes de 200 px en défilement horizontal.

**Élèves** (une seule carte blanche)
- Titre « Élèves », à droite la recherche (« Nom, prénom ou email ») et le filtre statut, champs `#F4F4F6`.
- Tableau desktop : colonne Élève (nom en gras, email dessous en texte secondaire 13 px), une colonne par cours assigné avec la pastille de statut, XP, Badges, puis une colonne étroite pour le menu « … ». Le tri par clic sur XP et Badges est conservé. Lignes séparées par `#ECECF0`, pas de fond gris sur l'en-tête.
- Au-delà de 8 élèves : lien « Voir les N autres élèves » centré sous le tableau.
- Menu « … » d'un élève : « Relancer par email » puis « Retirer du groupe » (rouge, avec confirmation).
- **Relancer par email** : l'automatisation Make n°3 n'existe pas encore. En attendant, le bouton ouvre un `mailto:` vers l'élève, sujet « Ton cours t'attend sur Skillo », corps court qui cite le ou les cours non commencés. Isole cette action dans une fonction unique, pour pouvoir la brancher plus tard sur un webhook sans toucher l'interface.
- Mobile : le tableau devient une carte blanche par élève. En haut : nom, puis « email · XP · badges » en texte secondaire, menu « … » à droite. Dessous, une ligne par cours (titre à gauche, pastille de statut à droite), séparées par `#ECECF0`.

## 5. Détail d'un cours

**Bug à vérifier d'abord** : l'image de la leçon s'affichait en Markdown brut (lien Supabase visible). Vérifie que le rendu passe bien par le même composant que la leçon apprenant.

**En-tête**
- Titre 32 px desktop, 28 px mobile, `text-wrap: balance`.
- Dessous : pastille blanche du thème, « Leçon · Quiz · Checklist », pastilles des groupes assignés. On ne montre plus « Domaine : climatisation ».
- Actions à droite (desktop) : « Voir comme un élève » (bouton contour violet, icône œil), « Modifier » (violet plein), menu « … » avec « Supprimer le cours ». Mobile : flèche retour et « … » en haut, puis « Vue élève » et « Modifier » côte à côte sous le titre.
- **Voir comme un élève** ouvre la vraie fiche de cours apprenant (leçon, quiz, checklist) en lecture : aucune écriture dans `progression`, `scores` ni `user_badges` pendant cet aperçu. Ajoute un petit bandeau encre en haut « Aperçu élève · rien n'est enregistré » avec un bouton « Quitter l'aperçu ». Si c'est trop lourd à isoler, dis-le-moi avant de coder.

**Carte « Avancement des élèves »** (seulement si le cours est assigné à au moins un groupe)
- Titre, à droite « Promo A · 12 élèves » (si plusieurs groupes : « 2 groupes · 21 élèves », tous groupes cumulés).
- Barre empilée de 14 px : terminés en vert `#17663F`, en cours en violet, non commencés en `#ECECF0`, 3 px d'écart entre les segments. Légende dessous avec un point de couleur et le nombre.
- À droite (desktop) ou dessous (mobile), deux petites cartes `#F4F4F6` :
  - « Score moyen au quiz » : moyenne du meilleur score de chaque élève sur ce cours, en %. Si aucun quiz fait : « - ».
  - « Pas commencé depuis 7 jours » : nombre d'élèves assignés depuis plus de 7 jours (`cours_groupes.created_at`) sans ligne de progression commencée, chiffre en rouge erreur.
- Cours non assigné : à la place, une carte avec « Assigne ce cours à un groupe pour suivre l'avancement des élèves. » et un bouton contour « Assigner à un groupe ».

**Sections repliables** (une carte chacune, bouton rond chevron à droite du titre)
- **Leçon** (dépliée par défaut) : à droite du titre « X min de lecture · N images ». Contenu : premier paragraphe seulement, une rangée de miniatures des images (4 max, la dernière affiche « +N » s'il y en a plus), et l'encadré « À retenir » en lavande avec les points en liste. Desktop : texte et miniatures à gauche, « À retenir » à droite (grille 1,5 fr / 1 fr). On ne rend plus la leçon entière ici : pour la lire, il y a « Voir comme un élève ».
- **QCM** (dépliée) : « N questions » à droite. Une ligne par question : numéro dans une pastille ronde `#F4F4F6`, énoncé en gras, et la ou les bonnes réponses en vert avec une coche. Pas de liste des mauvaises réponses ni des explications ici.
- **Checklist terrain** (repliée) : à droite « Cases à cocher · 7 étapes dont 2 bloquantes » (ou « Remise en ordre · 7 étapes »). Dépliée : liste numérotée des étapes, pastille « Bloquante » en couple erreur quand c'est le cas.

## 6. Dashboard formateur

Un seul changement : sur chaque ligne du bloc « Élèves à relancer », l'icône d'envoi déclenche la même fonction « Relancer par email » que dans le Détail groupe.

## Fin

Mets à jour le CLAUDE.md (section espace formateur) avec ces règles. Dis-moi ce que tu n'as pas pu faire ou ce qui t'a semblé ambigu.

Ne commite pas.
