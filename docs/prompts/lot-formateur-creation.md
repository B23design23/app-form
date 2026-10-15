# Lot : création et modification d'un cours (formateur)

À appliquer après `lot-formateur-listes.md`. Même écran pour « Créer un cours » et « Modifier le cours » : seuls le titre de page et le libellé du bouton d'enregistrement changent.

Tokens : voir le CLAUDE.md et le lot précédent (fond `#F4F4F6`, cartes blanches, champs `#F4F4F6` sur blanc, violet `#5B3FE0`, violet texte `#4A2FD0`, lavande `#E4DEFF`, erreur `#B4232A` sur `#FDE3E1`, succès `#17663F`).

Aucune logique de données ne change, sauf le champ « Domaine » (point 2) et l'assignation aux groupes si elle n'existe pas encore (point 3). La structure envoyée à Supabase reste la même.

## 1. Mode concentré et structure de page

- Pas de barre de navigation (ni la barre du haut desktop, ni la tab bar mobile) sur cet écran, comme la fiche de cours côté apprenant.
- Plus de grande carte qui englobe tout. Titre de page sur le fond gris, puis une carte blanche par section : **Infos**, **Leçon**, **QCM**, **Checklist terrain**. Rayon 30 px, padding 28 px desktop, 26 px / 16 px sur mobile.
- En-tête : H1 « Créer un cours » ou « Modifier le cours » (44 px desktop), dessous en texte secondaire le titre du cours s'il existe.

**Desktop (≥ 1024 px)** : grille à deux colonnes, 240 px + le reste, 32 px d'écart, 1200 px max.
- Colonne de gauche, collante (`position: sticky`, top 28 px) :
  - bouton retour : rond blanc de 44 px avec chevron + « Mes cours » en gras ;
  - sommaire dans une carte blanche (rayon 26 px) : Infos, Leçon, QCM (« 5 questions » à droite, texte secondaire), Checklist (« 7 étapes » à droite). Chaque entrée fait 44 px de haut, en pilule ; l'entrée de la section visible à l'écran prend le fond lavande. Clic = défilement doux vers la section. Les compteurs se mettent à jour en direct ;
  - dessous, lien violet avec icône œil « Voir comme un élève » (même aperçu que sur le Détail cours ; masqué pour un cours jamais enregistré).

**Mobile et tablette (< 1024 px)** :
- en haut : bouton rond retour, titre de page 20 px avec le titre du cours dessous en une ligne tronquée, bouton rond œil à droite ;
- sous l'en-tête, une rangée de pastilles qui remplace le sommaire (Infos, Leçon, QCM 5, Checklist 7), défilable horizontalement si besoin, collante en haut de l'écran. Pastille active : fond encre, texte blanc. Autres : fond blanc.

**Barre d'enregistrement**, toujours visible :
- desktop : pilule blanche flottante en bas, alignée sur la colonne de contenu, ombre `0 12px 32px rgba(30,26,51,0.16)`. À gauche, un point orange `#F6A55E` + « Modifications non enregistrées » quand il y a des changements (rien sinon). À droite, « Annuler » (texte violet) et « Enregistrer » (violet plein ; « Créer le cours » en création) ;
- mobile : barre blanche collée en bas, coins hauts arrondis 26 px, le message au-dessus, bouton pleine largeur de 52 px ;
- prévoir une marge basse sur le contenu pour que la barre ne cache jamais le dernier bouton ;
- quitter la page (retour, « Annuler », navigation du navigateur) avec des changements non enregistrés : modale de confirmation « Quitter sans enregistrer ? ».

## 2. Section Infos

- Titre et Thème côte à côte sur desktop, empilés sur mobile (sur mobile, le titre en champ multiligne pour ne pas être coupé).
- **Supprime le champ « Domaine » du formulaire.** La valeur reste celle par défaut en base. Aucun texte de l'interface ne doit afficher « climatisation » comme catégorie.
- La pastille « Compte officiel : ce cours sera public » reste, placée sous le H1.

## 3. Assignation aux groupes

Vérifie d'abord comment l'assignation d'un cours à un groupe fonctionne aujourd'hui (je ne la vois pas dans le formulaire actuel) et dis-moi ce que tu as trouvé.

Cible : dans la section Infos, un bloc « Assigner à des groupes » avec un bouton par groupe du formateur, libellé « Promo A · 12 élèves ».
- Non choisi : fond `#F4F4F6`, petit rond vide (contour `#D9D2C6`) à gauche.
- Choisi : contour violet 2 px, fond lavande, rond violet plein avec une coche blanche (règle de sélection du design system).
- Dessous, texte secondaire 13 px : « Les élèves des groupes choisis voient le cours dans « De ton formateur » et reçoivent un email. »
- À l'enregistrement : ajoute ou retire les lignes `cours_groupes`, et garde la notification Make n°2 telle qu'elle est branchée aujourd'hui.
- Si le formateur n'a aucun groupe : « Tu n'as pas encore de groupe. » et un lien « Créer un groupe ».

## 4. Section Leçon

- **Plus aucun bouton pointillé « + Insérer une image » sous les champs**, ici comme dans le QCM et la checklist. Le pointillé est réservé aux ajouts (« + Ajouter une question / une réponse / une étape »).
- L'éditeur de leçon est un bloc `#F4F4F6` (rayon 22 px) avec une barre d'outils en haut, séparée du texte par une ligne `#ECECF0` :
  - à gauche, un sélecteur à deux onglets dans une pilule blanche : « Écrire » / « Aperçu ». Onglet actif : fond encre, texte blanc. « Aperçu » affiche la leçon avec le même rendu que la fiche apprenant. Ça remplace le bouton « Aperçu de la leçon » ;
  - à droite, deux boutons blancs « Image » et « Vidéo » avec icône (icônes seules sur mobile, avec `aria-label`). « Image » reprend la logique d'upload actuelle. « Vidéo » demande un lien YouTube ou Vimeo et l'insère à la position du curseur.
- **URL d'image illisible** : aujourd'hui le texte montre `![splitmural](https://…supabase…)`. Objectif : que le formateur voie le nom de l'image, pas l'URL. Deux options, choisis la plus simple à fiabiliser et dis-moi laquelle :
  1. dans le mode Écrire, remplacer visuellement chaque image par une petite étiquette (miniature 64 × 44 px, nom du fichier, bouton croix pour la retirer), le Markdown restant intact à l'enregistrement ;
  2. garder le texte Markdown, mais afficher sous l'éditeur la liste des images insérées avec la même étiquette.
- Le texte d'aide reste sous le bloc : « Laisse une ligne vide entre deux paragraphes. Un lien YouTube ou Vimeo s'intègre tout seul. »
- **À retenir** : champ multiligne (rayon 20 px), le libellé à gauche et « Un point par ligne, 3 à 5 conseillés » à droite en texte secondaire (sous le champ sur mobile).

## 5. Section QCM

En-tête de section : « QCM » à gauche, « N questions » à droite en texte secondaire.

**Question repliée** : une ligne `#F4F4F6`, rayon 20 px, toute cliquable : pastille ronde blanche avec le numéro, énoncé en gras, à droite en texte secondaire « Réponse unique · 3 réponses » (masqué sur mobile), chevron. Une question vide ou incomplète s'affiche dépliée.

**Question dépliée** : un bloc `#F4F4F6` (rayon 24 px) qui contient, dans l'ordre :
1. en-tête : pastille du numéro en violet plein, « Question N », menu « … » (Supprimer la question, avec confirmation), chevron pour replier ;
2. **Énoncé** : champ blanc avec, à l'intérieur à droite, un bouton rond icône image (`aria-label` « Ajouter une image à l'énoncé »). Si une image existe : miniature sous le champ avec une croix ;
3. **Type de réponse** : deux boutons à la place de la liste déroulante, « Réponse unique » / « Plusieurs réponses » (« Une réponse » / « Plusieurs » sur mobile). Choisi : contour violet 2 px + fond lavande ; l'autre : fond blanc ;
4. petit texte secondaire : « Clique sur la lettre de la bonne réponse » (« Touche » sur mobile) ;
5. **Réponses**, une carte blanche chacune (rayon 20 px) :
   - à gauche, un bouton rond de 40 px avec la lettre (A, B, C…), fond lavande, lettre violet texte. Cliquer dessus marque la réponse correcte : le rond passe en vert succès `#17663F` avec une coche blanche, et le libellé « Bonne réponse » apparaît en vert à droite du champ (desktop). En réponse unique, marquer une réponse démarque l'autre. En plusieurs réponses, chaque lettre bascule indépendamment ;
   - le champ texte de la réponse ;
   - à droite, un bouton croix pour supprimer la réponse (minimum 2 réponses, la croix est désactivée en dessous) ;
   - **Explication** : un champ plus petit sous la réponse, décalé sous le texte (pas sous la lettre), placeholder « Explication si l'élève choisit cette réponse (facultatif) ». Il n'apparaît **que sous les réponses fausses**. Si une réponse est marquée correcte, son explication est masquée mais conservée en mémoire ;
   - suppression de la case radio « Réponse correcte » actuelle ;
6. « + Ajouter une réponse » en pointillé violet, centré.

Sous la dernière question : « + Ajouter une question » en pointillé, aligné à gauche (pleine largeur sur mobile). Une nouvelle question s'ouvre dépliée, les autres se replient.

Validation à l'enregistrement : chaque question a un énoncé, au moins 2 réponses et au moins une bonne réponse. Sinon, déplier la question fautive, la faire défiler à l'écran et afficher le message sous le bloc en rouge erreur.

## 6. Section Checklist terrain

- **Choix du mode** : la case « Ce cours a une checklist terrain » et la liste « Mode de validation » sont remplacées par trois boutons (grille de 3 colonnes desktop, empilés sur mobile, hauteur mini 64 px desktop, 48 px mobile) :
  - « Pas de checklist », sous-titre « Leçon et QCM seulement » ;
  - « Cases à cocher », sous-titre « L'élève valide chaque étape » ;
  - « Remise en ordre », sous-titre « L'élève replace les étapes ».
  Sous-titres masqués sur mobile. Choisi : contour violet 2 px + fond lavande (coche violette à droite sur mobile). Correspondance avec `cours.checklist_mode` : null / `checkbox` / `reorder`. Passer à « Pas de checklist » quand des étapes existent demande une confirmation.
- **Étapes**, une ligne compacte `#F4F4F6` (rayon 20 px) par étape, sur desktop :
  - poignée de glisser-déposer (six points, texte secondaire) qui modifie `ordre` ;
  - pastille ronde blanche avec le numéro ;
  - champ blanc de l'intitulé ;
  - bouton pilule « Bloquante » à basculer : actif en couple erreur (texte `#B4232A` sur `#FDE3E1`), inactif en contour `#D9D2C6` texte secondaire sur blanc. Visible seulement en mode « Cases à cocher » ;
  - bouton rond icône image (miniature sous la ligne si une image existe) ;
  - menu « … » : Critère de validation, Monter, Descendre, Supprimer.
- L'étape en cours d'édition prend un contour intérieur violet 2 px et sa pastille de numéro passe en violet plein. Le champ « Critère de validation (facultatif) » apparaît dessous seulement pour cette étape, ou quand un critère existe déjà. Placeholder : « Ex. : trou de 65 mm, légère pente vers l'extérieur ».
- **Mobile** : chaque étape sur deux lignes. En haut : numéro, intitulé (texte qui revient à la ligne, éditable au toucher), menu « … ». En bas, décalés sous l'intitulé : la pastille « Bloquante » et un bouton « Image ». Pas de poignée : on réordonne avec « Monter » / « Descendre » du menu.
- « + Ajouter une étape » en pointillé sous la liste.

## 7. Accessibilité et comportement

- Tous les boutons icône ont un `aria-label`. Le sélecteur Écrire / Aperçu est un `tablist`. Les choix fermés (type de réponse, mode de checklist) sont des `radiogroup`. Les lettres de réponse et « Bloquante » ont `aria-pressed`.
- Cibles tactiles de 40 px minimum, 44 px pour les actions principales.
- Survol uniquement dans `@media (hover: hover)`, focus visible au clavier seulement (règles existantes).

## Fin

Mets à jour le CLAUDE.md (section Création de cours, qui décrit encore l'ancien accordéon et les boutons pointillés). Dis-moi ce que tu as choisi pour l'affichage des images (point 4) et ce que tu as trouvé sur l'assignation aux groupes (point 3).

Ne commite pas.
