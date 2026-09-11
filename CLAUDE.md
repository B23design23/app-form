# CLAUDE.md — Skillo (App Formation Climatisation)

Contexte technique pour Claude Code. Le PRD (`skillo-PRD.md`) décrit le produit ; ce fichier décrit l'implémentation.

## Stack

- **Frontend** : React/Vite (via Claude Code, pas de no-code)
- **Backend/Data** : Supabase (Postgres + Auth native + Row Level Security)
- **Automatisations** : Make (emails transactionnels — bienvenue, notification nouveau cours, rappel d'inactivité), connecté à Outlook
- **Déploiement** : Vercel
- **Design** : Figma (direction artistique)

## Statut projet (mis à jour 2026-09-11)

Tout est fonctionnel et déployé sur Vercel :

- Auth + onboarding différencié (apprenant/formateur), rôle choisi à l'inscription
- Espace apprenant : Dashboard restructuré (stats + badges agrandis + cours en cours/quiz flash + cours recommandés, voir détail ci-dessous), section Cours (publics + privés du formateur), Mode terrain, Quiz flash, navigation tab bar mobile / barre horizontale desktop
- Espace formateur : création/édition/suppression de cours (leçon + QCM en accordéon + checklist checkbox ou reorder), gestion de groupes/élèves, suivi de progression, Dashboard formateur en 3 rangées (voir détail ci-dessous)
- Gamification : XP, 6 badges avec logique de déblocage, animation confettis selon le score
- Direction artistique "Ludique" appliquée partout (voir palette ci-dessous)
- Automatisation Make n°1 (email de bienvenue à l'inscription) : fonctionnelle, déclenchée par un trigger Supabase (pg_net)
- Automatisation Make n°2 (notification "nouveau cours assigné") : décision de bascule sur `fetch()` direct actée et instruction transmise à Claude Code (voir section dédiée ci-dessous) — statut d'implémentation à vérifier à la prochaine session

**Backlog** : 3e automatisation Make (rappel d'inactivité), affichage des images de cours (colonne `image_url` + bucket déjà prêts), case study du portfolio.

## Automatisation Make n°2 — notification "nouveau cours assigné"

**Problème** : le déclencheur via trigger SQL + pg_net est instable (le worker pg_net plante de façon imprévisible sur ce projet Supabase).

**Décision actée** : basculer sur un appel `fetch()` direct depuis le code React, déclenché juste après une insertion réussie côté app, plutôt que de dépendre du trigger Postgres/pg_net.

**Où** :

- `CreationCours.jsx` — cas "nouveau cours créé avec groupe assigné"
- `DetailGroupe.jsx` — cas "élève ajouté à un groupe qui a déjà des cours"

**URL du webhook** : jusqu'ici hardcodée dans le SQL de la fonction du trigger Postgres (jamais utilisée côté frontend). Pour le nouveau code React : variable d'environnement Vite `VITE_MAKE_WEBHOOK_NOUVEAU_COURS_URL`, cohérent avec le pattern déjà utilisé pour Supabase (`VITE_SUPABASE_URL`).

**Format du payload** (même format que les anciens triggers SQL, à reproduire côté JS) :

- Nouveau cours créé : `{ type: 'nouveau_cours', titre: string, membres: [{ email, prenom }, ...] }`
- Nouvel élève ajouté à un groupe : `{ type: 'nouvel_eleve', prenom: string, email: string, cours: [titre1, titre2, ...] }`

**Gestion d'erreur** : fire-and-forget. Un échec du `fetch()` ne doit jamais bloquer ni afficher d'erreur au formateur — la création du cours / l'ajout d'élève doit réussir même si la notification échoue. `console.error` pour le debug uniquement, rien de visible côté UI.

**Triggers SQL existants** (`notifier_nouveau_cours` sur `cours`, `notifier_nouvel_eleve` sur `groupe_membres`) : à désactiver (pas supprimer, gardés en base pour référence future), pour éviter les doublons d'email si pg_net redevient stable par intermittence :

```sql
alter table cours disable trigger nouveau_cours_assigne;
alter table groupe_membres disable trigger nouvel_eleve_dans_groupe;

```



## Principes de conception

- Le moteur applicatif (leçon, QCM, checklist, progression, gamification) est générique. Ne pas hardcoder de vocabulaire "climatisation" dans les noms de tables/colonnes — utiliser des termes neutres (`cours`, `categorie`, `thematique`).
- Espace apprenant : mobile-first (prioritaire).
- Espace formateur : non figé, à évaluer au moment de sa conception (V2).
- Un cours peut combiner librement : leçon + QCM, leçon + checklist, ou les deux. Ne jamais forcer une combinaison unique.
- Tous les CTA (boutons primary, secondary, boutons pointillés d'ajout, bouton supprimer) ont un état hover explicite (`transition: all 0.15s ease`) : primary → fond plus sombre (`#5638d6`), secondary/contour → léger fond `#EDE9FE`, bouton supprimer → fond rouge clair ou icône `error` plus soutenue.
- Sur mobile (iOS notamment), les titres/salutations en tête de page respectent la zone de sécurité (`padding-top: calc(env(safe-area-inset-top) + 20px)` ou équivalent) pour ne jamais être collés à la barre d'état.



## Direction artistique

**Statut : validée.** Direction "Ludique" — énergie type Duolingo/Babbel, chaleureuse et motivante plutôt que technique/pro. Indépendante de la climatisation, réutilisable si la thématique change.

**Palette (WCAG AA validé)** :

- `background` `#F5F3FF` — fond de page
- `surface` `#FFFFFF` — cartes
- `ink` `#241D42` — texte principal
- `text-secondary` `#7A7290` — texte secondaire
- `primary` `#6C4FF6` — actions, boutons, liens
- `accent-warm` `#FF7A45` — récompense (XP, badges)
- `accent-star` `#FFC93C` — mise en avant secondaire (badges obtenus, éléments de succès)
- `error` `#E5484D` — erreurs, réponses fausses

**Typographie** : Baloo 2 (display/titres, poids 600-700, très ronde), Nunito (corps de texte, poids 400-600)

**Formes** : coins très arrondis (16-20px sur les cartes), boutons en pilule (`border-radius: 999px`), badges en carrés arrondis (16px) plutôt qu'en cercles stricts.

**Signature visuelle** : anneau de progression circulaire, recoloré avec la nouvelle palette (fond `#EDE9FE`, trait `primary`). Logo Skillo : anneau de progression comme "o", disponible en `.svg`/`.png` dans le dossier `Assets` du projet (utiliser le SVG en priorité).

**Application** : cette direction s'applique à tous les écrans (Accueil, Onboarding, Dashboards, Fiche de cours, écrans formateur), y compris le toast de complétion.

**Nuance espace formateur** : même typographie, formes et couleurs d'accent (`primary`, `accent-warm`, `accent-star`) que l'espace apprenant, mais fond de page plus neutre — `#F4F4F6` (gris clair) au lieu de `#F5F3FF` (lavande). S'applique à : Dashboard formateur, Création de cours, Détail cours formateur, Détail groupe.

## Évolutions futures anticipées (non construites)

- Le champ `domaine` sur `cours` couvre déjà l'anticipation multi-filière sans structure supplémentaire à construire.
- **Navigation formateur en sidebar gauche** (pattern CRM) : envisagé le 2026-09-09, écarté pour l'instant — l'espace formateur n'a que 3 sections (Cours, Groupes, Dashboard) + Menu, insuffisant pour justifier une sidebar (pattern pertinent à partir de 6-10 entrées ou de sous-niveaux de nav). Décision actée : garder la barre horizontale mirrorée avec l'espace apprenant (moteur de nav unique, cf. "Principes de conception"). À reconsidérer si l'espace formateur grossit significativement (stats, réglages, exports, sous-vues de cours).



## Schéma de données (Supabase / Postgres)



### `profiles`

- `id` (uuid, FK → auth.users)
- `nom`, `email`
- `role` (enum : `apprenant` | `formateur`)
- `xp_total` (int, défaut 0)
- `prenom` (obligatoire à l'inscription, tous rôles)
- `tranche_age` (enum, obligatoire si `role = apprenant` uniquement — nullable en base, validé côté app)
- `profession` (enum, obligatoire si `role = apprenant` uniquement — nullable en base, validé côté app)
- `motivation` (texte, obligatoire si `role = apprenant` uniquement — nullable en base, validé côté app)
- `organisme` (texte, obligatoire si `role = formateur` uniquement)
- `specialite` (texte, obligatoire si `role = formateur` uniquement)
- `created_at`



### `cours`

- `id`, `titre`, `contenu` (texte/richtext leçon)
- `domaine` (texte, défaut `climatisation` — prépare un futur multi-domaine sans coût de migration)
- `categorie` (enum ou texte libre : ex. Froid, Électricité, Sécurité)
- `visibilite` (enum : `public` | `prive`)
- `checklist_mode` (texte : `checkbox` | `reorder`, nullable — s'applique à toute la checklist du cours, pas étape par étape)
- `formateur_id` (FK → profiles, nullable — rempli seulement si `visibilite = prive`)
- `groupe_id` (FK → groupes, nullable — rempli seulement si privé et assigné à un groupe)
- `created_at`



### `questions`

- `id`, `cours_id` (FK), `enonce`
- `type_reponse` (enum : `simple` | `multiple`)



### `reponses`

- `id`, `question_id` (FK), `texte`
- `est_correcte` (bool)
- `explication` (texte, affichée si l'apprenant sélectionne cette réponse et qu'elle est fausse)



### `etapes_checklist`

- `id`, `cours_id` (FK), `ordre` (int)
- `intitule`, `critere_validation` (texte)
- `mode_validation` (colonne conservée mais non utilisée — le mode se pilote désormais via `cours.checklist_mode`, au niveau de toute la checklist)
- `bloquante` (bool — empêche de continuer si non validée ; concept applicable uniquement en mode `checkbox`, ignoré en mode `reorder`)



### `scores`

- `id`, `user_id` (FK), `cours_id` (FK, nullable — vide si `type = quiz_flash`)
- `type` (enum : `quiz_cours` | `quiz_flash`)
- `score`, `date`



### `progression`

- `id`, `user_id` (FK), `cours_id` (FK)
- `statut` (enum : `non_commence` | `en_cours` | `termine`)
- `updated_at`



### `badges`

- `id`, `nom`, `condition_deblocage` (texte), `icone`
- `description` (texte, lisible — affichée dans une popup au clic sur le badge côté apprenant)



### `user_badges`

- `id`, `user_id` (FK), `badge_id` (FK), `date_obtention`



### `groupes`

- `id`, `nom`, `formateur_id` (FK → profiles)



### `groupe_membres` (table de liaison)

- `id`, `groupe_id` (FK), `apprenant_id` (FK → profiles)



## Row Level Security (logique à implémenter)

- `cours` : visible si `visibilite = 'public'` OU (`visibilite = 'prive'` ET l'utilisateur appartient à `groupe_membres` du `groupe_id` associé) OU l'utilisateur est le `formateur_id` du cours.
- `progression` **/** `scores` **/** `user_badges` : un apprenant ne voit/modifie que ses propres lignes (`user_id = auth.uid()`). Un formateur peut lire (pas modifier) les lignes des apprenants de ses groupes.
- `groupes` **/** `groupe_membres` : lecture/écriture réservée au `formateur_id` propriétaire du groupe.



## Gamification — règles

- XP attribué à la complétion d'un quiz (20 XP) et/ou d'une checklist (15 XP).
- Badges débloqués sur jalons, condition stockée en texte dans `badges.condition_deblocage`, logique de déblocage codée côté application (pas en trigger SQL, pour rester simple en V1).

**Badges (déjà en base) et leur condition exacte :**

- `premier_quiz_complete` — nom affiché "Premier pas" — 1re ligne dans `scores` avec `type = 'quiz_cours'` pour cet utilisateur
- `premiere_checklist_completee` — nom affiché "Sur le terrain" — 1re checklist menée à terme (toutes les étapes d'un cours cochées)
- `trois_cours_termines` — nom affiché "Persévérant" — `progression.statut = 'termine'` sur 3 cours différents
- `quiz_100_pourcent` — nom affiché "Sans faute" — une ligne `scores` avec `score = 100`
- `premier_quiz_flash_reussi` — nom affiché "Éclair" — 1re ligne dans `scores` avec `type = 'quiz_flash'` et un score jugé réussi (seuil ≥ 50%)
- `dix_cours_termines` — nom affiché "Expert" (ajouté 2026-09-11) — `progression.statut = 'termine'` sur 10 cours différents (palier au-dessus de "Persévérant", même logique de comptage)

Vérifier ces conditions après chaque écriture dans `scores` ou `progression`, et insérer dans `user_badges` si un jalon est nouvellement atteint (jamais en double, `unique(user_id, badge_id)` l'empêche déjà côté base).

- Progression affichée par cours (`progression.statut`) et globalement (agrégat sur `profiles.xp_total`).



## Gestion des groupes — recherche d'élève

Un formateur n'a pas accès en lecture au profil d'un autre utilisateur (RLS `profiles` limité à `auth.uid() = id`). Pour ajouter un élève à un groupe par email, l'app appelle la fonction RPC `find_apprenant_id_by_email(p_email)` (SECURITY DEFINER, ne retourne que l'id, uniquement pour `role = 'apprenant'`) plutôt qu'une requête directe sur `profiles`.

## Parcours d'entrée — nommage clarifié

Deux écrans distincts, à ne pas confondre (mise à jour 2026-09-09 : l'ancien écran "Connexion" séparé a été fusionné dans l'écran "Accueil") :

1. **Introduction** — carrousel de 2-3 slides, pur pitch marketing, avant tout choix. Pagination par points, bouton "Suivant"/"Commencer" sur la dernière slide, menant à l'écran Accueil.
2. **Accueil** — logo Skillo en haut, puis carte "Se connecter" (email, mot de passe, bouton) directement visible sur l'écran, puis carte "Nouveau sur skillo? vous êtes :" avec les 2 CTA de choix de rôle ("Je suis apprenant" / "Je suis formateur"). Le lien texte "Déjà un compte ? Se connecter" a été supprimé — le formulaire de connexion est désormais inline sur cet écran, plus besoin d'un lien pour y accéder.
3. **Onboarding** — questions post-inscription (prénom/tranche d'âge/profession/motivation pour l'apprenant, prénom/organisme/spécialité pour le formateur). Ne pas confondre avec l'Introduction.

Séquence complète : Introduction → Accueil (connexion ou choix de rôle) → Création de compte (si nouveau) → Onboarding → Dashboard.

## Navigation — barre horizontale desktop/tablette (partagée apprenant/formateur)

Mise à jour 2026-09-09 : la barre horizontale (≥768px, cf. sections ci-dessous) affiche désormais le **logo Skillo à gauche** (SVG, dossier `Assets`) et les **items de navigation groupés à droite**. Décision actée après discussion : pas de sidebar (voir "Évolutions futures anticipées"), pas de nav centrée (réservée si un élément supplémentaire — avatar, notifications — est ajouté à droite un jour). Structure à deux zones : logo (gauche) / nav (droite), sans zone centrale pour l'instant.

## Navigation — espace apprenant

Responsive, deux patterns selon la largeur d'écran (breakpoint ~768px), 4 entrées identiques dans les deux cas — Dashboard, Cours, Mode terrain, Menu :

- **Mobile** : tab bar fixe en bas, 4 entrées (pas de logo dans la tab bar). Titre/salutation en haut de page avec padding de zone de sécurité (voir "Principes de conception").
- **Desktop/tablette** : barre horizontale fixe en haut avec logo à gauche + 4 entrées groupées à droite (voir "Navigation — barre horizontale desktop/tablette"), contenu du Dashboard organisé en mosaïque/grille en dessous.

**Dashboard apprenant — layout (mis à jour 2026-09-11)**, dans cet ordre du haut vers le bas :

1. Salutation dynamique "Bonjour/Bonsoir, [Prénom] !" selon l'heure (`new Date().getHours()`, bascule à 18h). Pas de badge XP séparé à côté de la salutation (supprimé, redondant avec la carte stats ci-dessous).
2. Rangée de 3 cartes stats pleine largeur : XP total (fond jaune/`accent-star`, icône éclair à côté du chiffre — reprend le style de l'ancien badge XP), Cours terminés, Badges obtenus (format "X/6").
3. Section "Badges" pleine largeur : icônes de badges affichées en grand, nom du badge en texte sous chaque illustration, pas de case colorée derrière l'icône (l'icône colorée du badge ressort directement sur le fond blanc de la carte). Les badges non obtenus par l'utilisateur sont visuellement verrouillés (icône en faible opacité + cadenas superposé, ou popup expliquant la condition à remplir).
4. Rangée à 2 colonnes égales (`align-items: start`, pas de hauteur forcée identique) : carte de progression du cours en cours (anneau %, tags Leçon/Quiz/Checklist, bouton "Continuer" en primary) + carte "Un petit quiz flash pour tester tes connaissances et gratter de l'XP ?" (fond violet clair `#EDE9FE` inchangé, bouton "Lancer le quiz flash" en style **secondary** — contour, pas plein — pour le distinguer de "Continuer" qui reste l'action principale).
5. Section "Cours recommandés" pleine largeur : mosaïque des cours accessibles non commencés (`progression.statut = 'non_commence'` ou absence de ligne), avec lien "Voir tous les cours" si plus de cours existent que ce qui est affiché.

Pas de titre de section pour la rangée de stats ni pour la paire cours-en-cours/quiz-flash (cohérent avec le Dashboard formateur, qui n'a pas non plus de titre au-dessus de sa rangée de stats) — seuls "Badges" et "Cours recommandés" ont un titre, car ce sont des blocs de contenu distincts qui bénéficient d'un repère de lecture.

**Section Cours** : liste des cours, séparée en deux groupes — "Cours publics" et "Cours de mon formateur" (ce dernier affiché seulement s'il y a du contenu).

**Section Mode terrain** : liste des cours à checklist (contenu qui était avant sur le Dashboard).

**Menu** (4e entrée de la navigation, pas une icône flottante séparée) : ouvre un menu contenant "Se déconnecter" (structure prévue pour accueillir d'autres options plus tard).

## Navigation — espace formateur

Même structure que l'espace apprenant (tab bar mobile / barre horizontale desktop avec logo à gauche + nav à droite), 4 entrées miroir : **Dashboard, Cours, Groupes, Menu**. Sidebar gauche envisagée puis écartée pour l'instant (voir "Évolutions futures anticipées"). Titre en haut de page avec padding de zone de sécurité sur mobile (voir "Principes de conception").

**Dashboard formateur — layout en 3 rangées (hybride, validé 2026-09-09)**

Contexte : le layout initial en 2 colonnes créait un grand vide sous "Actions rapides" (colonne gauche plus courte que la colonne droite une fois la recherche/filtres ajoutés à "Activité récente"). Solution retenue : passer en 3 rangées pleine largeur plutôt que corriger les hauteurs de colonnes — corrige le déséquilibre à la racine.

*Rangée 1 — visualisation* : bloc "Taux de complétion moyen" (1fr, avec le sous-titre "Sur l'ensemble de vos groupes" en texte secondaire) + 3 cartes chiffres-clés côte à côte (nombre de cours créés, nombre de groupes, nombre total d'élèves) dans un sous-grid (2fr). Le pourcentage de "Taux de complétion" change de couleur selon sa valeur, avec les tokens existants (pas de vert dans la palette) : `error` (#E5484D) si < 40%, `accent-warm` (#FF7A45) si 40-69%, `accent-star` (#FFC93C) si ≥ 70% (rôle "éléments de succès" déjà documenté pour ce token). Seuils ajustables si besoin après retour terrain.

*Rangée 2 — actions* : 2 cartes côte à côte, largeur égale (1fr 1fr), avec un `min-height` commun calé sur la hauteur naturelle de "Actions rapides" (environ 150-160px) pour que les deux cartes démarrent alignées même quand "Élèves à relancer" est vide.

- "Élèves à relancer" : élèves dont un cours est "Non commencé" depuis plusieurs jours (prépare l'automatisation Make n°3 au backlog). Liste vide → état vide "Aucun élève à relancer pour le moment."
- "Actions rapides" : 2 boutons ("+ Nouveau cours", "+ Nouveau groupe") côte à côte, style secondary (contour, pas de pointillé), **largeur égale mais hauteur intrinsèque au contenu du bouton — ne pas les étirer pour remplir toute la hauteur de la carte** (`align-items: center` sur le conteneur des boutons, pas `stretch`).
- **Titres alignés** : les titres des deux cartes ("Élèves à relancer", "Actions rapides") doivent être à la même position verticale malgré l'icône présente uniquement sur "Élèves à relancer" — même padding-top de carte, même line-height de titre.
- **Hauteurs indépendantes au-delà du min-height** : au-delà du `min-height` commun, les 2 cartes ne doivent pas avoir de hauteur liée. Quand la liste "Élèves à relancer" s'allonge (plus d'élèves à relancer), la carte "Actions rapides" garde sa hauteur basée sur son propre contenu (`align-items: start` sur le conteneur de la rangée, pas `stretch`/grid par défaut).

*Rangée 3 — historique* : "Activité récente" (nom volontairement au singulier, pas "Activités récentes" — traite le flux comme un concept global, à l'image de "Recent Activity" ; ce n'est pas une faute). Ligne recherche + filtres : champ "Rechercher un élève" à gauche, dropdowns "Statut" (Tous/Non commencé/En cours/Terminé) et "Trier par" (Plus récent/Nom élève A-Z/Statut) regroupés et alignés à droite de la ligne (largeur fixe égale, ~160px chacun, pour que "Plus récent" tienne sur une ligne), en `flex-direction: row` sur desktop (le `flex-wrap` ne se déclenche qu'en dessous de 768px). En dessous, mosaïque 3 colonnes des activités (empilement vertical sur mobile).

**Mobile (< 768px)** : tout s'empile dans le même ordre de lecture (taux de complétion → 3 chiffres-clés en ligne → Élèves à relancer → Actions rapides → Activité récente). "Élèves à relancer" et "Activité récente" n'affichent que les 2-3 premiers éléments avec un lien texte "Voir plus (N)" pour éviter une page à rallonge. Les CTA "+ Nouveau cours"/"+ Nouveau groupe" affichés dans les cartes stats vides ("Crée ton premier cours"/"Crée ton premier groupe") passent en bouton rond icône seule ("+", sans texte) pour éviter le débordement dans ces cartes étroites — ailleurs (header "+ Créer un cours"/"+ Créer un groupe", "Actions rapides") le texte est conservé, le contexte n'étant pas suffisant pour s'en passer.

**Section Cours** : grille/mosaïque 3 cours par ligne sur desktop (empilement vertical sur mobile), bouton "+ Créer un cours" sur la même ligne que le titre "Mes cours". Empty state "Aucun cours pour le moment." centré horizontalement sur mobile.

**Section Groupes** : liste complète des groupes, chaque groupe en carte cliquable avec chevron/flèche. Bouton "+ Créer un groupe" sur la même ligne que le titre "Mes groupes" ; au clic, ouvre une modal (titre + input + bouton "Valider" désactivé jusqu'à saisie d'au moins un caractère) plutôt qu'un champ visible en permanence sur l'écran. Empty state "Aucun groupe pour le moment." centré horizontalement sur mobile.

**Détail groupe** : sections "Élèves" et "Ajouter un élève" côte à côte sur la même ligne (desktop), puis en dessous la section "Suivi de progression" avec, sous le titre, la barre de recherche élève et le filtre par statut (Tous/Non commencé/En cours/Terminé) sur la même ligne, puis le tableau (tri par clic sur les en-têtes XP/Badges).

**Menu** : "Se déconnecter" (remplace le lien texte actuel en haut à droite).

Applique le fond `#F4F4F6` (voir "Nuance espace formateur") à ces écrans.

## Création de cours — QCM en accordéon (mis à jour 2026-09-11)

Chaque question est une carte accordéon collapsible (en-tête "Question 1 : [énoncé]" + chevron, repliée par défaut une fois remplie). À l'intérieur : réponses numérotées par lettre (A, B, C... — convention standard pour un QCM, évite la confusion avec la numérotation des questions). Le champ "Explication" reste rattaché aux réponses **fausses** (affichée à l'apprenant s'il sélectionne une réponse fausse — comportement produit existant, ne pas inverser vers la réponse correcte). Le bouton "+ Ajouter une réponse" est centré horizontalement dans le bloc question (pas aligné à gauche), pour le distinguer clairement de "+ Ajouter une question" qui reste fixe en bas de la section quiz.

## Quiz flash — règles

- Débloqué quand l'utilisateur a terminé le quiz d'au moins 3 cours différents (`scores` avec `type = 'quiz_cours'` sur 3 `cours_id` distincts).
- Pioche 10 questions aléatoires parmi celles des cours dont l'utilisateur a déjà terminé le quiz (table `questions`, jointes via `cours_id`).
- À la fin, écrit une ligne dans `scores` (`type = 'quiz_flash'`, `cours_id = null`).
- Si le score est ≥ 50%, attribue 30 XP bonus et déclenche la vérification du badge `premier_quiz_flash_reussi`.



## Hors périmètre (rappel — voir PRD section 6)

Ne pas implémenter : streak, leaderboard, rôle super-admin, génération de contenu via API IA.

## Conventions de code

- Noms de tables/colonnes en français, snake_case (cohérent avec le PRD)
- Composants React : à définir en démarrant le premier écran

