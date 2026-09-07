# CLAUDE.md — App Formation Climatisation

Contexte technique pour Claude Code. Le PRD (`PRD-app-formation-climatisation.md`) décrit le produit ; ce fichier décrit l'implémentation.

## Stack

- **Frontend** : React (via Claude Code, pas de no-code)
- **Backend/Data** : Supabase (Postgres + Auth native + Row Level Security)
- **Automatisations** : Make (emails transactionnels — bienvenue, notification nouveau cours, rappel d'inactivité)
- **Déploiement** : à définir (Vercel ou équivalent)

## Principes de conception

- Le moteur applicatif (leçon, QCM, checklist, progression, gamification) est générique. Ne pas hardcoder de vocabulaire "climatisation" dans les noms de tables/colonnes — utiliser des termes neutres (`cours`, `categorie`, `thematique`).
- Espace apprenant : mobile-first (prioritaire).
- Espace formateur : non figé, à évaluer au moment de sa conception (V2).
- Un cours peut combiner librement : leçon + QCM, leçon + checklist, ou les deux. Ne jamais forcer une combinaison unique.

## Direction artistique

**Statut : provisoire.** Palette en attente de benchmark par le porteur de projet — ne pas considérer comme figée. Micro-animations à définir (transitions, feedback quiz, déblocage badge).

Palette et typographie pensées comme un langage générique de montée en compétence technique — indépendant de la climatisation, réutilisable si la thématique change (électricité, plomberie, etc.). Aucun élément visuel ne doit faire référence explicitement au métier de la climatisation.

**Palette (draft, WCAG AA validé)** :
- `ink` `#16233A` — texte principal
- `background` `#F6F7F9` — fond général
- `primary` `#1D5B79` — actions, liens, interactions
- `accent-warm` `#C1622C` — récompense (XP, badges) uniquement sur fonds pleins/larges, jamais en texte fin
- `error` `#B3261E` — erreurs, réponses fausses

**Typographie (draft)** : Space Grotesk (display/titres), Inter (corps de texte, optimisé mobile)

**Signature visuelle (draft)** : indicateur de progression circulaire ("anneau de maîtrise") plutôt qu'une barre linéaire — pattern générique de complétion/maîtrise, sans référence métier.

## Évolutions futures anticipées (non construites)

Aucune pour l'instant — le champ `domaine` sur `cours` couvre déjà l'anticipation multi-filière sans structure supplémentaire à construire.

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

### `user_badges`
- `id`, `user_id` (FK), `badge_id` (FK), `date_obtention`

### `groupes`
- `id`, `nom`, `formateur_id` (FK → profiles)

### `groupe_membres` (table de liaison)
- `id`, `groupe_id` (FK), `apprenant_id` (FK → profiles)

## Row Level Security (logique à implémenter)

- **`cours`** : visible si `visibilite = 'public'` OU (`visibilite = 'prive'` ET l'utilisateur appartient à `groupe_membres` du `groupe_id` associé) OU l'utilisateur est le `formateur_id` du cours.
- **`progression` / `scores` / `user_badges`** : un apprenant ne voit/modifie que ses propres lignes (`user_id = auth.uid()`). Un formateur peut lire (pas modifier) les lignes des apprenants de ses groupes.
- **`groupes` / `groupe_membres`** : lecture/écriture réservée au `formateur_id` propriétaire du groupe.

## Gamification — règles

- XP attribué à la complétion d'un quiz (20 XP) et/ou d'une checklist (15 XP).
- Badges débloqués sur jalons, condition stockée en texte dans `badges.condition_deblocage`, logique de déblocage à coder côté application (pas en trigger SQL pour rester simple en V1).

**Badges V1 (déjà en base) et leur condition exacte :**
- `premier_quiz_complete` — 1re ligne dans `scores` avec `type = 'quiz_cours'` pour cet utilisateur
- `premiere_checklist_completee` — 1re checklist menée à terme (toutes les étapes d'un cours cochées)
- `trois_cours_termines` — `progression.statut = 'termine'` sur 3 cours différents
- `quiz_100_pourcent` — une ligne `scores` avec `score = 100`
- `premier_quiz_flash_reussi` — 1re ligne dans `scores` avec `type = 'quiz_flash'` et un score jugé réussi (seuil à définir, ex. ≥ 50%)

Vérifier ces conditions après chaque écriture dans `scores` ou `progression`, et insérer dans `user_badges` si un jalon est nouvellement atteint (jamais en double, `unique(user_id, badge_id)` l'empêche déjà côté base).

- Progression affichée par cours (`progression.statut`) et globalement (agrégat sur `profiles.xp_total`).

## Gestion des groupes — recherche d'élève

Un formateur n'a pas accès en lecture au profil d'un autre utilisateur (RLS `profiles` limité à `auth.uid() = id`). Pour ajouter un élève à un groupe par email, l'app appelle la fonction RPC `find_apprenant_id_by_email(p_email)` (SECURITY DEFINER, ne retourne que l'id, uniquement pour `role = 'apprenant'`) plutôt qu'une requête directe sur `profiles`.

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
