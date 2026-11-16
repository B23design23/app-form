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

- Auth + parcours d'entrée (Introduction à la première visite, Connexion, Choix du profil, questions puis création du compte), rôle choisi à l'inscription
- Espace apprenant : Dashboard en blocs d'action selon la situation de l'élève (refonte 2026-10-14, voir détail ci-dessous), section Cours (publics + privés du formateur), Mode terrain, Quiz flash, navigation tab bar mobile / barre horizontale desktop
- Espace formateur : création/édition/suppression de cours (leçon + QCM en accordéon + checklist checkbox ou reorder), gestion de groupes/élèves, suivi de progression, Dashboard formateur (refonte 2026-10-15 : en-tête, complétion, Tes groupes, relances, fil d'activité ; premiers pas sans élève ; dashboard admin à part — voir détail ci-dessous)
- Gamification : XP, 6 badges avec logique de déblocage, animation confettis selon le score
- Direction artistique appliquée partout (refonte 2026-10-14, voir section dédiée ci-dessous)
- Automatisation Make n°1 (email de bienvenue à l'inscription) : fonctionnelle, déclenchée par un trigger Supabase (pg_net)
- Automatisation Make n°2 (notification "nouveau cours assigné") : décision de bascule sur `fetch()` direct actée et instruction transmise à Claude Code (voir section dédiée ci-dessous) — statut d'implémentation à vérifier à la prochaine session

**Backlog** : 3e automatisation Make (rappel d'inactivité), affichage des images de cours (colonne `image_url` + bucket déjà prêts), case study du portfolio.

## Automatisation Make n°2 — notification "nouveau cours assigné"

**Problème** : le déclencheur via trigger SQL + pg_net est instable (le worker pg_net plante de façon imprévisible sur ce projet Supabase).

**Décision actée** : basculer sur un appel `fetch()` direct depuis le code React, déclenché juste après une insertion réussie côté app, plutôt que de dépendre du trigger Postgres/pg_net.

**Où** :

- `CreationCours.jsx` — cas "cours créé ou modifié avec un ou plusieurs groupes nouvellement assignés" (seuls les groupes ajoutés sont notifiés ; fonctions dans `src/lib/notificationsMake.js`)
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
- Tous les CTA (boutons primary, secondary, boutons pointillés d'ajout, bouton supprimer) ont un état hover explicite (`transition: all 0.15s ease`) : primary → `--fond-action-survol`, secondary/contour → fond lavande, bouton supprimer → fond `--fond-erreur`.
- Sur mobile (iOS notamment), les titres/salutations en tête de page respectent la zone de sécurité (`padding-top: calc(env(safe-area-inset-top) + 20px)` ou équivalent) pour ne jamais être collés à la barre d'état.



## Direction artistique

Les règles du DS sont dans docs/design-system/regles-agent.md, les tokens dans tokens/. Lis ce fichier avant de créer ou modifier un écran. En cas de désaccord, il fait foi. Ne crée ni ne modifie aucun token : signale le manque.

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
- `tranche_age` (enum, obligatoire si `role = apprenant` uniquement — nullable en base, validé côté app). Reste obligatoire à l'inscription comme donnée interne pour des statistiques futures ; pas affichée dans l'app pour l'instant.
- `profession` (enum, obligatoire si `role = apprenant` uniquement — nullable en base, validé côté app)
- `motivation` (texte, obligatoire si `role = apprenant` uniquement — nullable en base, validé côté app)
- `organisme` (texte, obligatoire si `role = formateur` uniquement)
- `specialite` (texte, obligatoire si `role = formateur` uniquement)
- `created_at`



### `cours`

- `id`, `titre`, `contenu` (texte/richtext leçon)
- `domaine` (texte, défaut `climatisation` — prépare un futur multi-domaine sans coût de migration)
- `categorie` (texte, obligatoire : l'un des 12 thèmes de `src/lib/thematiques.js`, pour tous les cours — liste déroulante « Thème » dans Création de cours)
- `visibilite` (enum : `public` | `prive`)
- `checklist_mode` (texte : `checkbox` | `reorder`, nullable — s'applique à toute la checklist du cours, pas étape par étape)
- `formateur_id` (FK → profiles, nullable — rempli seulement si `visibilite = prive`)
- `ordre` (int, nullable — tri des cours au sein d'un thème, migration 0002)
- `a_retenir` (texte, nullable — encadré « À retenir » en fin de leçon, un point par ligne, migration 0006 ; champ multiligne dans Création de cours)
- ~~`groupe_id`~~ : n'existe **pas** sur `cours`. L'association cours ↔ groupe passe par la table de liaison `cours_groupes` (un cours peut être assigné à plusieurs groupes).
- `created_at`



### `cours_groupes` (table de liaison)

- `cours_id` (FK → cours), `groupe_id` (FK → groupes)
- Utilisée dans `CreationCours.jsx`, `DetailGroupe.jsx`, `DetailCoursFormateur.jsx`.

**Contrainte** `cours_categorie_publique_valide` : `categorie` doit être l'une des 12 thématiques de `src/lib/thematiques.js`. Migration 0002 : cours publics uniquement ; migration 0005 (remap des 4 cours privés existants validé le 2026-10-14, puis contrainte étendue) : tous les cours. En édition, un ancien cours privé à catégorie libre s'ouvre sans thème sélectionné et le formateur doit en choisir un pour enregistrer.


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
- `bonnes_reponses`, `nb_questions` (int, nullables — détail d'un passage de quiz de cours, migration 0007 ; vides pour les passages antérieurs et le quiz flash)



### `progression`

- `id`, `user_id` (FK), `cours_id` (FK)
- `statut` (enum : `non_commence` | `en_cours` | `termine`)
- `updated_at`



### `badges`

- `id`, `nom`, `condition_deblocage` (texte), `icone` (plus utilisé pour l'affichage : l'image d'un badge est choisie par `condition_deblocage`, voir `iconeBadge(badge)` dans `src/lib/badges.js`)
- `description` (texte, lisible — affichée dans une popup au clic sur le badge côté apprenant)



### `user_badges`

- `id`, `user_id` (FK), `badge_id` (FK), `date_obtention`



### `groupes`

- `id`, `nom`, `formateur_id` (FK → profiles)



### `groupe_membres` (table de liaison)

- `id`, `groupe_id` (FK), `apprenant_id` (FK → profiles)



## Row Level Security (logique à implémenter)

- `cours` : visible si `visibilite = 'public'` OU (`visibilite = 'prive'` ET l'utilisateur appartient à `groupe_membres` d'un groupe lié au cours via `cours_groupes`) OU l'utilisateur est le `formateur_id` du cours.
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
- **Statut d'un cours (2026-10-15)** : ouvrir la leçon → `en_cours`. Une **checklist terminée** (y compris depuis Mode terrain, leçon non ouverte) fait passer le cours en `en_cours` s'il était `non_commence` ou sans ligne (`termine` reste `termine`) et met toujours à jour `progression.updated_at` : l'élève sort des « Élèves à relancer » et apparaît dans le fil d'activité. Un cours n'est **terminé** (`termine`) que quand toutes ses parties sont faites : quiz + checklist → les deux ; quiz seul → le quiz ; checklist seule → la checklist ; leçon seule → « Terminer le cours ». Les cours déjà passés à `termine` par le seul quiz avant cette règle ne sont pas modifiés.



## Gestion des groupes — recherche d'élève

Un formateur n'a pas accès en lecture au profil d'un autre utilisateur (RLS `profiles` limité à `auth.uid() = id`). Pour ajouter un élève à un groupe par email, l'app appelle la fonction RPC `find_apprenant_id_by_email(p_email)` (SECURITY DEFINER, ne retourne que l'id, uniquement pour `role = 'apprenant'`) plutôt qu'une requête directe sur `profiles`.

## Descriptions d'écrans

Déplacées dans `docs/ecrans/` (parcours.md, apprenant.md, formateur.md, fiche.md, creation.md).

## Navigation — barre horizontale desktop/tablette (partagée apprenant/formateur)

Mise à jour 2026-09-09 : la barre horizontale (≥768px, cf. sections ci-dessous) affiche désormais le **logo Skillo à gauche** (composant `Logo`, variante foncée) et les **items de navigation groupés à droite**. Décision actée après discussion : pas de sidebar (voir "Évolutions futures anticipées"), pas de nav centrée (réservée si un élément supplémentaire — avatar, notifications — est ajouté à droite un jour). Structure à deux zones : logo (gauche) / nav (droite), sans zone centrale pour l'instant.

## Navigation — espace apprenant

Responsive, deux patterns selon la largeur d'écran (breakpoint ~768px), 4 entrées identiques dans les deux cas — Accueil (le dashboard), Cours, Terrain, Menu — avec les icônes des maquettes (maison `home.svg`, livre `livre.svg`, case cochée `case-cochee.svg`, menu `menu.svg`). Côté formateur, l'entrée reste « Dashboard » avec ses icônes d'origine :

- **Mobile** : tab bar flottante en bas (voir "Direction artistique"), 4 entrées (pas de logo dans la tab bar). Titre/salutation en haut de page avec padding de zone de sécurité (voir "Principes de conception").
- **Desktop/tablette** : barre horizontale fixe en haut avec logo à gauche + 4 entrées groupées à droite (voir "Navigation — barre horizontale desktop/tablette"), contenu du Dashboard organisé en mosaïque/grille en dessous.

*Objets 3D des thèmes* : Fluent Emoji (Microsoft, MIT) dans `public/illustrations/themes/` (+ `quiz-flash.png`), via `imageTheme(categorie)` de `src/lib/thematiques.js` (image par défaut `technologies-systemes`, simple filet de sécurité depuis que tous les cours ont un thème). Les illustrations de l'onboarding ne changent pas.

*Objets 3D des badges* : Fluent Emoji (Microsoft, MIT) dans `public/illustrations/badges/` — Premier pas = chaussure de course (`chaussure-course.png`), Sur le terrain = casque de secouriste (`sur-le-terrain.png`), Persévérant = biceps (`perseverant.png`), Sans faute = cible (`sans-faute.png`), Éclair = chronomètre (`eclair.png`), Expert = couronne (`expert.png`). Utilisés partout où un badge apparaît (dashboard, carrousel « Mes badges », popup, toast de badge débloqué). Les anciennes illustrations SVG (`src/Assets/badge/award.svg`, `bolt.svg`, etc.) restent dans le dépôt mais ne sont plus référencées.

**Libellés courts des thèmes** (`libelleCourtTheme` dans `src/lib/thematiques.js`, sous-titres des lignes du Mode terrain) : Thermodynamique, Fluides, Cycle frigorifique, Psychrométrie, Technologies, Dimensionnement, Installation, Brasage, Entretien, Diagnostic, Sécurité, Efficacité énergétique.

**Menu** (4e entrée de la navigation, pas une icône flottante séparée) : ouvre un menu contenant "Se déconnecter" (structure prévue pour accueillir d'autres options plus tard).

**Mon compte** : La page s'appelle Mon compte. Elle est atteinte depuis l'entrée Menu de la navigation principale. C'est une page de niveau 0. Se déconnecter est sur cette page, plus dans un menu de la navigation.

## Navigation — espace formateur

Même structure que l'espace apprenant (tab bar mobile / barre horizontale desktop avec logo à gauche + nav à droite), 4 entrées miroir : **Dashboard, Cours, Groupes, Menu**. Sidebar gauche envisagée puis écartée pour l'instant (voir "Évolutions futures anticipées"). Titre en haut de page avec padding de zone de sécurité sur mobile (voir "Principes de conception"). **Compte officiel (`est_admin`)** : pas d'entrée « Groupes » (Dashboard, Cours, Menu ; les 3 entrées se répartissent la largeur de la tab bar) ; `est_admin` est lu à la résolution de session (`authUser.estAdmin`, `App.jsx`) ; une section Groupes ou un Détail groupe ouverts quand même ramènent au dashboard.

**Menu** : "Se déconnecter" (remplace le lien texte actuel en haut à droite).

## Quiz flash — règles

- Débloqué quand l'utilisateur a terminé le quiz d'au moins 3 cours différents (`scores` avec `type = 'quiz_cours'` sur 3 `cours_id` distincts).
- Pioche 10 questions aléatoires parmi celles des cours dont l'utilisateur a déjà terminé le quiz (table `questions`, jointes via `cours_id`).
- À la fin, écrit une ligne dans `scores` (`type = 'quiz_flash'`, `cours_id = null`).
- Si le score est ≥ 50%, attribue 30 XP bonus et déclenche la vérification du badge `premier_quiz_flash_reussi`.



## Hors périmètre (rappel — voir PRD section 6)

Ne pas implémenter : streak, leaderboard, rôle super-admin, génération de contenu via API IA.

## Conduite de Claude Code

- Quand tu remplaces ou supprimes un bloc de règle, liste dans ton rapport chaque phrase retirée.

## Conventions de code

- Noms de tables/colonnes en français, snake_case (cohérent avec le PRD)
- Composants React : à définir en démarrant le premier écran

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
