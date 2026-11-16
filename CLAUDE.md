# CLAUDE.md — Skillo (App Formation Climatisation)

Contexte technique pour Claude Code. Le PRD (`skillo-PRD.md`) décrit le produit ; ce fichier décrit l'implémentation.

Avant toute modification d'interface, lis `docs/design-system/regles-agent.md` jusqu'à la fin. En cas de désaccord, il fait foi. Ne crée ni ne modifie aucun token : signale le manque.

Avant de toucher un écran, lis le fichier de son espace dans `docs/ecrans/` :

| Espace | Fichier | Code concerné |
|---|---|---|
| Parcours d'entrée | `docs/ecrans/parcours.md` | `src/pages/parcours/`, `MotDePasseOublie.jsx`, `NouveauMotDePasse.jsx`, `src/components/GabaritParcours.jsx` |
| Apprenant | `docs/ecrans/apprenant.md` | `EspaceApprenant.jsx`, `Dashboard.jsx`, `SectionCours.jsx`, `DetailTheme.jsx`, `SectionModeTerrain.jsx`, `src/components/` : `BlocFormateur`, `EntetePage`, `LigneCours` |
| Fiche de cours et quiz flash | `docs/ecrans/fiche.md` | `FicheCours.jsx`, `src/pages/fiche/`, `QuizFlash.jsx`, `src/components/` : `ReperEtapes`, `Confetti`, `CompletionToast`, `ContenuMarkdown` |
| Formateur | `docs/ecrans/formateur.md` | `EspaceFormateur.jsx`, `DashboardFormateur.jsx`, `DashboardAdmin.jsx`, `SectionCoursFormateur.jsx`, `SectionGroupesFormateur.jsx`, `DetailGroupe.jsx`, `DetailCoursFormateur.jsx`, `FormateurListes.css`, `src/components/formateur/` |
| Création de cours (formateur) | `docs/ecrans/creation.md` | `CreationCours.jsx` |

Si l'écran que tu crées ou modifies n'a pas de description dans `docs/ecrans/`, écris-la dans le fichier de son espace, au même format que les autres, et ajoute en tête « À valider ». Ce que le DS ne couvre pas (composant, rôle, valeur), ne le crée pas : liste-le sous « À trancher » à la fin de ta réponse.

Fichiers sans espace : `src/pages/DesignSystem.jsx` (vitrine du DS) et les composants du DS (`NavigationEspace`, `Logo`, `Modale`, `Dropdown`, `Icone`, `StatutBadge`, `AnneauProgression`), décrits dans le DS. Les règles de calcul et les données lues par les écrans sont plus bas, section « Règles métier ».

## Stack

- **Frontend** : React/Vite (via Claude Code, pas de no-code)
- **Backend/Data** : Supabase (Postgres + Auth native + Row Level Security)
- **Automatisations** : Make (emails transactionnels — bienvenue, notification nouveau cours, rappel d'inactivité), connecté à Outlook
- **Déploiement** : Vercel
- **Design** : Figma (direction artistique)

## Statut

Tout est fonctionnel et déployé sur Vercel : parcours d'entrée, espaces apprenant et formateur, fiche de cours, quiz flash, gamification, Make n°1 et n°2 (écrans : tableau ci-dessus).

**Backlog** : 3e automatisation Make (rappel d'inactivité), affichage des images de cours (colonne `image_url` + bucket déjà prêts), case study du portfolio.

## Automatisations Make

- **Make n°1** (email de bienvenue à l'inscription) : déclenchée par un trigger Supabase (pg_net) à l'insertion dans `profiles`.
- **Make n°2** (notification « nouveau cours assigné ») : appel `fetch()` direct depuis le code React, juste après une écriture réussie (fonctions dans `src/lib/notificationsMake.js`). Raison : le trigger SQL + pg_net était instable sur ce projet ; ne pas y revenir. Appels :
  - `CreationCours.jsx` : cours créé ou modifié, seuls les groupes nouvellement assignés sont notifiés ;
  - `DetailGroupe.jsx` : élève ajouté à un groupe qui a déjà des cours (`notifierMakeNouvelEleve`), cours assigné depuis le Détail groupe ;
  - `DetailCoursFormateur.jsx` : cours assigné depuis le Détail cours.
- URL du webhook : variable d'environnement Vite `VITE_MAKE_WEBHOOK_NOUVEAU_COURS_URL` (même pattern que `VITE_SUPABASE_URL`).
- Payloads : nouveau cours `{ type: 'nouveau_cours', titre: string, membres: [{ email, prenom }, ...] }` ; nouvel élève `{ type: 'nouvel_eleve', prenom: string, email: string, cours: [titre1, titre2, ...] }`.
- Gestion d'erreur : fire-and-forget. Un échec du `fetch()` ne bloque jamais la création du cours ni l'ajout d'élève et n'affiche rien au formateur ; `console.error` pour le debug uniquement.
- Triggers SQL `nouveau_cours_assigne` (sur `cours`, fonction `notifier_nouveau_cours`) et `nouvel_eleve_dans_groupe` (sur `groupe_membres`, fonction `notifier_nouvel_eleve`) : désactivés, pas supprimés, pour éviter les doublons d'email ; état à vérifier en base avec la base de test.

## Produit

- Le moteur applicatif (leçon, QCM, checklist, progression, gamification) est générique. Ne pas hardcoder de vocabulaire "climatisation" dans les noms de tables/colonnes — utiliser des termes neutres (`cours`, `categorie`, `thematique`).
- Espace apprenant : mobile-first (prioritaire).
- Un cours peut combiner librement : leçon + QCM, leçon + checklist, ou les deux. Ne jamais forcer une combinaison unique.

## Évolutions écartées

- Multi-filière : le champ `domaine` sur `cours` suffit, aucune structure à construire.
- Sidebar formateur (pattern CRM) : écartée, l'espace formateur n'a que 3 sections + Menu (pattern utile à partir de 6 à 10 entrées) ; ne pas la reproposer tant que l'espace formateur ne grossit pas nettement.

## Commun aux deux espaces

- **Navigation** (`NavigationEspace.jsx`, rendu : fiche Navigation de `ds-principes-composants.md`) : tab bar flottante en bas sur mobile, sans logo ; à partir de 768 px, barre horizontale fixe en haut, logo Skillo à gauche (composant `Logo`, variante foncée), entrées groupées à droite, sans zone centrale (réservée à un futur avatar ou à des notifications).
- Entrées apprenant : Accueil (le dashboard), Cours, Terrain, Menu, avec les icônes des maquettes (maison `home.svg`, livre `livre.svg`, case cochée `case-cochee.svg`, menu `menu.svg`).
- Entrées formateur : Dashboard (icônes d'origine), Cours, Groupes, Menu. **Compte officiel (`est_admin`)** : pas d'entrée « Groupes » (Dashboard, Cours, Menu ; les 3 entrées se répartissent la largeur de la tab bar) ; `est_admin` est lu à la résolution de session (`authUser.estAdmin`, `App.jsx`) ; une section Groupes ou un Détail groupe ouverts quand même ramènent au dashboard.
- **Menu** (4e entrée de la navigation, pas une icône flottante séparée), dans les deux espaces : ouvre un menu contenant "Se déconnecter" (structure prévue pour accueillir d'autres options plus tard).
- *Objets 3D des thèmes* : Fluent Emoji (Microsoft, MIT) dans `public/illustrations/themes/` (+ `quiz-flash.png`), via `imageTheme(categorie)` de `src/lib/thematiques.js` (image par défaut `technologies-systemes`, simple filet de sécurité depuis que tous les cours ont un thème). L'onboarding a ses propres illustrations.
- *Objets 3D des badges* : Fluent Emoji (Microsoft, MIT) dans `public/illustrations/badges/` — Premier pas = chaussure de course (`chaussure-course.png`), Sur le terrain = casque de secouriste (`sur-le-terrain.png`), Persévérant = biceps (`perseverant.png`), Sans faute = cible (`sans-faute.png`), Éclair = chronomètre (`eclair.png`), Expert = couronne (`expert.png`). Utilisés partout où un badge apparaît (dashboard, modale « Mes badges », toast de badge débloqué).
- **Libellés courts des thèmes** (`libelleCourtTheme` dans `src/lib/thematiques.js`, sous-titres des lignes du Mode terrain) : Thermodynamique, Fluides, Cycle frigorifique, Psychrométrie, Technologies, Dimensionnement, Installation, Brasage, Entretien, Diagnostic, Sécurité, Efficacité énergétique.

## Schéma de données (Supabase / Postgres)

### `profiles`

- `id` (uuid, FK → auth.users)
- `nom`, `email`
- `role` (enum : `apprenant` | `formateur`)
- `xp_total` (int, défaut 0)
- `prenom` (obligatoire à l'inscription, tous rôles)
- `tranche_age` (enum, obligatoire si `role = apprenant` uniquement — nullable en base d'après ce fichier, `not null` dans 0001 : à vérifier avec la base de test ; validé côté app). Reste obligatoire à l'inscription comme donnée interne pour des statistiques futures ; pas affichée dans l'app pour l'instant.
- `profession` (enum, obligatoire si `role = apprenant` uniquement — nullable en base d'après ce fichier, `not null` dans 0001 : à vérifier avec la base de test ; validé côté app)
- `motivation` (texte, obligatoire si `role = apprenant` uniquement — nullable en base d'après ce fichier, `not null` dans 0001 : à vérifier avec la base de test ; validé côté app)
- `organisme` (texte, nullable, obligatoire si `role = formateur` uniquement) (migration 0009, non exécutée)
- `specialite` (texte, nullable, obligatoire si `role = formateur` uniquement) (migration 0009, non exécutée)
- `est_admin` (bool, défaut false — compte officiel : dashboard admin, pas d'entrée « Groupes ») (migration 0009, non exécutée)
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

**Contrainte** `cours_categorie_publique_valide` : `categorie` doit être l'une des 12 thématiques de `src/lib/thematiques.js`, pour tous les cours (migrations 0002 et 0005). En édition, un ancien cours privé à catégorie libre s'ouvre sans thème sélectionné et le formateur doit en choisir un pour enregistrer.

### `cours_groupes` (table de liaison)

- `cours_id` (FK → cours), `groupe_id` (FK → groupes)
- `created_at` (timestamptz, date d'assignation, migration 0004)
- Utilisée dans `CreationCours.jsx`, `DetailGroupe.jsx`, `DetailCoursFormateur.jsx`.

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
- `mode_validation` (colonne conservée mais non utilisée — le mode se pilote via `cours.checklist_mode`, au niveau de toute la checklist)
- `bloquante` (bool — empêche de continuer si non validée ; concept applicable uniquement en mode `checkbox`, ignoré en mode `reorder`)

### `scores`

- `id`, `user_id` (FK), `cours_id` (FK, nullable — vide si `type = quiz_flash`)
- `type` (enum : `quiz_cours` | `quiz_flash`)
- `score`, `date`
- `bonnes_reponses`, `nb_questions` (int, nullables — détail d'un passage de quiz de cours, migration 0007 ; vides pour les passages antérieurs et le quiz flash)

### `progression`

- `id`, `user_id` (FK), `cours_id` (FK)
- `statut` (enum : `non_commence` | `en_cours` | `termine`)
- `checklist_terminee` (bool, défaut false, migration 0003 — suivi de la checklist, indépendant du statut)
- `updated_at`

### `badges`

- `id`, `nom`, `condition_deblocage` (texte), `icone` (plus utilisé pour l'affichage : l'image d'un badge est choisie par `condition_deblocage`, voir `iconeBadge(badge)` dans `src/lib/badges.js`)
- `description` (texte lisible, lue par `Dashboard.jsx`, affichée nulle part)

### `user_badges`

- `id`, `user_id` (FK), `badge_id` (FK), `date_obtention`

### `groupes`

- `id`, `nom`, `formateur_id` (FK → profiles)
- `created_at` (timestamptz — tri de « Tes groupes ») (migration 0009, non exécutée)

### `groupe_membres` (table de liaison)

- `id`, `groupe_id` (FK), `apprenant_id` (FK → profiles)

## Row Level Security (politiques absentes du dépôt, sauf `profiles` en migration 0001 : à relever avec la base de test)

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
- `dix_cours_termines` — nom affiché "Expert" — `progression.statut = 'termine'` sur 10 cours différents (palier au-dessus de "Persévérant", même logique de comptage)

Vérifier ces conditions après chaque écriture dans `scores` ou `progression`, et insérer dans `user_badges` si un jalon est nouvellement atteint (jamais en double, `unique(user_id, badge_id)` l'empêche déjà côté base).

- Progression affichée par cours (`progression.statut`) et globalement (agrégat sur `profiles.xp_total`).
- **Statut d'un cours** : ouvrir la leçon → `en_cours`. Une **checklist terminée** (y compris depuis Mode terrain, leçon non ouverte) fait passer le cours en `en_cours` s'il était `non_commence` ou sans ligne (`termine` reste `termine`) et met toujours à jour `progression.updated_at` : l'élève sort des « Élèves à relancer » et apparaît dans le fil d'activité. Un cours n'est **terminé** (`termine`) que quand toutes ses parties sont faites : quiz + checklist → les deux ; quiz seul → le quiz ; checklist seule → la checklist ; leçon seule → « Terminer le cours ». Les cours déjà passés à `termine` par le seul quiz avant cette règle ne sont pas modifiés.

**Quiz flash** :
- Débloqué quand l'utilisateur a terminé le quiz d'au moins 3 cours différents (`scores` avec `type = 'quiz_cours'` sur 3 `cours_id` distincts).
- Pioche 10 questions aléatoires parmi celles des cours dont l'utilisateur a déjà terminé le quiz (table `questions`, jointes via `cours_id`).
- À la fin, écrit une ligne dans `scores` (`type = 'quiz_flash'`, `cours_id = null`).
- Si le score est ≥ 50%, attribue 30 XP bonus et déclenche la vérification du badge `premier_quiz_flash_reussi`.

## Gestion des groupes — recherche d'élève

Un formateur n'a pas accès en lecture au profil d'un autre utilisateur (RLS `profiles` limité à `auth.uid() = id`). Pour ajouter un élève à un groupe par email, l'app appelle la fonction RPC `find_apprenant_id_by_email(p_email)` (SECURITY DEFINER, ne retourne que l'id, uniquement pour `role = 'apprenant'`) plutôt qu'une requête directe sur `profiles`.

## Règles métier

Règles de calcul, seuils et données lues par les écrans. Le fichier d'écran garde ce qui s'affiche et renvoie ici par le titre de la règle.

- **Parcours d'entrée** : rôle et réponses dans un contexte React (`ParcoursProvider`, dans `main.jsx`) recopié dans le `sessionStorage` (`skillo:parcours`) ; le retour arrière conserve les réponses. « Créer mon compte » → `signUp` avec les réponses dans `options.data` (métadonnées). La confirmation d'email est **désactivée** sur le projet (`mailer_autoconfirm: true`) : `signUp` ouvre une session, et `App.jsx` (résolution de session, aucun profil trouvé) écrit la ligne `profiles` à partir des métadonnées — une seule écriture, robuste aux résolutions concurrentes (code 23505 ignoré) et qui fonctionnerait aussi à la première connexion si la confirmation était activée. Compte connecté sans profil ni réponses (inscription antérieure inachevée) : écran « compléter le profil » (mêmes questions, la dernière enregistre le profil). L'email de bienvenue (Make n°1) reste déclenché par l'insertion dans `profiles`, avec le prénom renseigné.
- **Situation du dashboard apprenant** (calculée côté client), dans cet ordre : 1. Tous les cours accessibles terminés : E (G si le quiz flash est verrouillé), K, badges. 2. Un cours en cours (le plus récemment modifié) : A, D (autres cours assignés), F ou G, H. 3. Rien en cours, des cours assignés : C (le plus ancien assigné), D (les autres), F ou G, H. 4. Rien en cours ni assigné, aucun cours commencé : B « Ton premier cours », G, H. 5. Rien en cours ni assigné, quiz flash débloqué : E, B « Prochain cours conseillé », H. Verrouillé : B, G, H. Règles : jamais deux cours à commencer quand un cours est en cours ; une consigne du formateur passe avant les suggestions, jamais avant un cours entamé. Bloc badges : H tant que la collection n'est pas complète, puis I de façon permanente. Cours de B = premier cours public non commencé, ordre des thèmes (`THEMATIQUES`) puis `cours.ordre`. Priorité du prochain badge : Premier pas, Persévérant, Expert, Sur le terrain, Éclair, Sans faute.
- **Cours assignés** : date d'assignation via `cours_groupes.created_at` (migration 0004), lue par la RPC `mes_cours_assignes()` (SECURITY DEFINER, uniquement les cours des groupes de l'utilisateur). Si la RPC échoue, les cours privés restent traités comme assignés, sans date (statut « À faire », pas de « ajouté … »). Le nom du formateur n'est pas affiché (RLS `profiles`) : « De ton formateur ». Statut d'un cours assigné (`statutCoursAssigne`, `src/lib/coursAssignes.js`) : Nouveau (< 7 jours et jamais ouvert), À faire, En cours.
- **Taux de complétion** (une seule définition, `src/lib/groupes.js`) : couples élève × cours assigné au statut `termine` ÷ nombre total de couples élève × cours assigné ; le taux global applique la même formule sur l'ensemble des couples de tous les groupes (chaque couple compté une fois), pas une moyenne des groupes. Pastille d'état : moins de 40 % « À surveiller » ; 70 % ou plus « Bon rythme » ; de 40 à 69 % ou sans données, pas de pastille.
- **Élèves à relancer** : ligne `progression` `non_commence` depuis plus de 3 jours, uniquement sur un cours assigné à l'un des groupes de l'élève (couple élève × cours via `groupe_membres` + `cours_groupes` ; un cours public non assigné n'est jamais compté), un élève une fois, le plus ancien d'abord. Même règle pour la pastille de Mes groupes, limitée aux cours du groupe.
- **Progression d'une partie** : leçon lue = ligne `progression` avec `statut ≠ non_commence` (ouvrir la leçon la marque `en_cours`) ; quiz fait = au moins une ligne `scores` `quiz_cours` pour le cours (meilleur score = max) ; checklist faite = `progression.checklist_terminee`. Cours complet = `statut = termine` et toutes ses parties faites. Depuis Mode terrain, si la checklist se termine sans ligne de progression, une ligne `en_cours` + `checklist_terminee` est créée ; la leçon compte alors comme lue. Durée de lecture : 200 mots/min, arrondi au-dessus.
- **Score « x/y »** : chaque passage de quiz de cours enregistre `scores.bonnes_reponses` et `scores.nb_questions` (migration 0007, nombre de questions **au moment du passage**). Affichage du meilleur passage : « 4/5 » quand ces colonnes sont remplies, sinon le pourcentage seul (« 80 % »), **sans recalcul**. L'anneau de fin de quiz (quiz de cours et quiz flash) affiche le score du passage qui vient de se terminer en pourcentage seul.
- **Thèmes** : un thème est terminé quand tous ses cours le sont. Seuls les cours publics comptent dans un thème.
- **Mode terrain** : Terminé = `progression.checklist_terminee` ; En cours = `progression.statut = 'en_cours'` du cours (pas de suivi « checklist commencée » en base).
- **Aiguillage du dashboard formateur**, dans cet ordre : `profiles.est_admin = true` sur le profil connecté (lu via `select('*')`) → dashboard admin ; formateur sans aucun couple élève × cours assigné (aucun cours assigné via `cours_groupes` à un groupe qui a au moins un élève — `couplesAssignes(...).size === 0`) → Pour bien démarrer ; sinon dashboard normal.
- **Activité récente** : `progression` `en_cours` / `termine`, `updated_at`, uniquement les cours assignés à l'un des groupes de l'élève via `cours_groupes` (pas les lignes `non_commence`) ; une ligne par élève et par cours (garde-fou de dédoublonnage). Fil, relances, taux et « Tes groupes » sont calculés côté client à partir d'une seule lecture `progression` (élèves du formateur × cours assignés, avec `cours(titre)`), filtrée ensuite par couple élève × cours assigné (`couplesAssignes`, `src/lib/groupes.js`). Un cours terminé ne repasse jamais en `en_cours` et `progression` ne garde pas d'historique (une ligne par élève et par cours).
- **Tes groupes et Mes groupes** : les 3 groupes les plus récents (`groupes.created_at` si la colonne existe — lue via `select('*')` — sinon ordre alphabétique) ; dernière activité = `progression.updated_at` le plus récent des élèves du groupe sur ses cours ; % = terminés ÷ élèves × cours (`statsGroupe`, `src/lib/groupes.js`). Pastille de Mes groupes, une par priorité : aucun cours → « Assigne un premier cours » ; élèves à relancer → erreur ; ≥ 70 % → « Bon rythme ».
- **Dashboard admin** : Apprenants actifs (utilisateurs distincts avec une ligne `progression` hors `non_commence` mise à jour sur un cours public dans les 30 jours), Cours terminés (lignes passées à `termine` dans les 30 jours), Score moyen au quiz (moyenne du meilleur score par élève et par cours, cours publics) ; « Cours les plus suivis » : les 5 cours publics les plus commencés (lignes `progression` hors `non_commence`). Chiffres lus par la RPC `stats_admin_cours_publics()` (la RLS de `progression` / `scores` ne laisse pas l'admin lire ces lignes) — SQL dans `supabase/migrations/0008_stats_admin_cours_publics.sql` (à jouer dans Supabase) ; tant qu'elle n'est pas jouée : « — » et « Statistiques indisponibles pour le moment. ».
- **Détail cours** : score moyen = moyenne des meilleurs scores ; « Pas commencé (7 j) » via `cours_groupes.created_at`. Aperçu élève : aucune écriture dans `progression`, `scores`, `user_badges` ni le stockage local.
- **Score et XP du quiz de cours** : chaque passage du quiz insère une ligne `scores` (le meilleur score est conservé, rien n'est retiré) ; les 20 XP ne sont donnés qu'au premier quiz du cours ; le QCM termine le cours seulement s'il n'y a pas de checklist ou si elle est déjà faite (sinon le cours reste `en_cours`).
- **Checklist en cours** : l'état des étapes (validées et passées) est mémorisé dans le `localStorage` du navigateur, clé `skillo:checklist:[userId]:[coursId]` ; effacé une fois `checklist_terminee` enregistré en base ; stockage indisponible → pas de mémorisation. En base, seul `checklist_terminee` est stocké.
- **Enregistrement d'un cours** : seules les lignes `cours_groupes` ajoutées ou retirées sont écrites (la date d'assignation `created_at` des groupes déjà assignés est conservée). `domaine` n'est pas envoyé, la valeur en base est conservée (défaut `climatisation` à la création). Compte admin : cours public. `explication = null` pour une bonne réponse. « Pas de checklist » = `checklist_mode = null`, aucune étape enregistrée ; `bloquante` enregistré à `false` en remise en ordre. Images de l'énoncé et des étapes : ajoutées à la fin du texte en Markdown (`texte\n\n![nom](url)`), format lu par `ContenuMarkdown`, extraites du texte au chargement ; images de la leçon : le Markdown en base garde la vraie URL.

## Hors périmètre (rappel — voir PRD section 6)

Ne pas implémenter : streak, leaderboard, rôle super-admin, génération de contenu via API IA.

## Conduite de Claude Code

- Quand tu remplaces ou supprimes un bloc de règle, liste dans ton rapport chaque phrase retirée.

## Conventions de code

- Noms de tables/colonnes en français, snake_case (cohérent avec le PRD)

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
