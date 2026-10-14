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
- Espace apprenant : Dashboard en blocs d'action selon la situation de l'élève (refonte 2026-10-14, voir détail ci-dessous), section Cours (publics + privés du formateur), Mode terrain, Quiz flash, navigation tab bar mobile / barre horizontale desktop
- Espace formateur : création/édition/suppression de cours (leçon + QCM en accordéon + checklist checkbox ou reorder), gestion de groupes/élèves, suivi de progression, Dashboard formateur en 3 rangées (voir détail ci-dessous)
- Gamification : XP, 6 badges avec logique de déblocage, animation confettis selon le score
- Direction artistique appliquée partout (refonte 2026-10-14, voir section dédiée ci-dessous)
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
- Tous les CTA (boutons primary, secondary, boutons pointillés d'ajout, bouton supprimer) ont un état hover explicite (`transition: all 0.15s ease`) : primary → `--color-primary-hover`, secondary/contour → fond lavande, bouton supprimer → fond `--color-error-fond`.
- Sur mobile (iOS notamment), les titres/salutations en tête de page respectent la zone de sécurité (`padding-top: calc(env(safe-area-inset-top) + 20px)` ou équivalent) pour ne jamais être collés à la barre d'état.



## Direction artistique

**Statut : validée (refonte 2026-10-14, remplace l'ancienne direction "Ludique").** Chaleureuse et motivante, fonds crème, violet franc, orange réservé à la récompense. Indépendante de la climatisation, réutilisable si la thématique change.

**Tokens** : centralisés dans `:root` de `src/styles/shared.css` (source unique). Aucune couleur codée en dur ailleurs — toujours passer par `var(--…)`.

| Token | Valeur | Rôle |
|---|---|---|
| `--color-creme` / `--color-background` | `#F5EEE4` | crème ; fond de page apprenant |
| `--color-fond-formateur` | `#F4F4F6` | fond de page de tout l'espace formateur |
| `--color-surface` | `#FFFFFF` | cartes, champs |
| `--color-ink` | `#1E1A33` | texte principal, tab bar, cartes sombres |
| `--color-text-secondary` | `#5C566E` | texte secondaire |
| `--color-primary` / `--color-primary-hover` | `#5B3FE0` / `#4630B8` | action principale / survol |
| `--color-primary-profond` | `#4630B8` | fond d'anneau sur carte violette |
| `--color-primary-texte` | `#4A2FD0` | libellés violets sur fond clair |
| `--color-lavande` | `#E4DEFF` | surfaces secondaires, onglet actif, survol des boutons contour |
| `--color-lavande-pale` | `#EEEAFF` | fond des cartes chiffres du dashboard formateur |
| `--color-orange` | `#F6A55E` | récompense (XP, quiz flash, badges) — **toujours texte `#1E1A33` dessus, jamais blanc** |
| `--color-orange-survol` | `#EE9446` | survol du bouton orange |
| `--color-error` / `--color-error-fond` | `#B4232A` / `#FDE3E1` | erreur (texte / fond) |
| `--color-success` / `--color-success-fond` | `#17663F` / `#DFF3E7` | succès (texte / fond) |
| `--color-contour-imbrique` | `#E4E4EA` | contour 1 px d'une carte posée sur une carte blanche |
| `--color-contour-etape` | `#D9D2C6` | contour des étapes à venir (repère d'étapes, checklist) |
| `--color-texte-sur-violet` / `-doux`, `--color-texte-sur-encre` / `-clair`, `--color-texte-attenue` | `#DCD4FF` / `#ECE8FF`, `#D3CEE3` / `#E6E3EC`, `#3B3550` | textes secondaires des maquettes (sur violet, sur encre, sur clair) |
| `--color-separateur` | `#EFE9E0` (apprenant) / `#ECECF0` (formateur, `--color-separateur-formateur`) | **uniquement** les lignes de séparation entre éléments d'une liste — jamais entre des sections |
| `--color-neutre-pale` | `#EFE9E0` | fond de la pastille "Non commencé" (apprenant) — même valeur que `separateur` aujourd'hui, rôle distinct |
| `--color-neutre-pale-formateur` | `#ECECF0` | fond de la pastille "Non commencé" (formateur) |
| `--color-fond-champ` | crème (apprenant) / `fond-formateur` (formateur) | fond d'un champ posé sur une carte blanche, redéfini par `.espace-layout-formateur` et `.flow-page-formateur` |
| `--ombre-flottante` | `0 12px 32px rgba(30,26,51,0.16)` | seule ombre de l'app, **uniquement** les éléments flottants (menu de la nav, listes déroulantes, toast, modale « Mes badges ») |

**Carte posée sur une carte blanche : fond blanc, contour 1 px `#E4E4EA` (`--color-contour-imbrique`), rayon 20 px, sans ombre. Seule exception à la règle sans bordure** (aucun usage actuel depuis le passage d'« Activité récente » en liste).

**Pas de bordure sur les champs ni sur les cartes** (pas de token de bordure, la lavande n'est jamais utilisée en bordure). Contraste par le fond : un champ (input, select, textarea) posé sur une carte blanche prend le fond crème `#F5EEE4` côté **apprenant** et le fond `#F4F4F6` (`--color-fond-formateur`) côté **formateur** (token `--color-fond-champ`) ; un champ posé directement sur le fond de page (ou un bloc gris) prend le fond blanc. Focus : contour 2 px `primary`. Autoremplissage navigateur (`:-webkit-autofill`) neutralisé : le champ garde son fond et le texte encre, via une ombre intérieure pleine (`box-shadow: 0 0 0 1000px … inset`) — **seule exception technique** à la règle « une seule ombre ». Même logique pour les éléments posés dans une carte blanche (réponses de quiz, étapes de checklist : fond crème).

**Typographie** : Urbanist (Google Fonts, graisses 400 à 800) partout. Titres en 800, corps en 500-600. Le H1 34 px mobile / 44 px dès 768 px (`--taille-h1`) est réservé aux **titres de page** (salutation, "Cours", "Mes groupes"…). Les **titres de cours et noms de thème** dans les fiches (fiche cours, détail cours formateur, détail thème) : 28 px mobile / 32 px desktop (`--taille-titre-cours`), graisse 800, interlignage 1.1.

**Formes** : cartes rayon 28 px (`--radius-carte`, 26 à 32 selon la taille — `--radius-carte-petite` 26 px pour les petites cartes de grille), champs et boutons en pilule (`999px`), réponses de quiz à 20 px (`--radius-reponse`). **Aucune ombre** hors `--ombre-flottante` : le contraste vient des couleurs de fond. **Ombre d'illustration : seconde exception à la règle une seule ombre, réservée aux objets 3D qui débordent** (`filter: drop-shadow(0 14px 16px rgba(20,10,60,0.35))` sur carte violette, `rgba(0,0,0,0.4)` sur carte encre ; `0 18px 20px` sur desktop). Champs multilignes (textarea) : rayon 20 px.

**Boutons** (transition de survol `all 0.15s ease` sur tous les CTA, zone cliquable ≥ 44 px) :

- principal : fond `primary`, texte blanc, survol `primary-hover`
- sur carte foncée (violette ou encre, classe `.surface-foncee`) : bouton blanc, texte encre
- secondaire : contour 2 px `primary`, texte `primary-texte`, fond transparent, survol lavande
- orange (`.bouton-orange`) : **uniquement** pour lancer le quiz flash, texte encre
- supprimer : texte/contour `error`, survol fond `error-fond`
- pointillé (`.bouton-ajouter`) : réservé à « + Ajouter une question », « + Ajouter une étape » et autres ajouts dans la création de cours ; un bouton qui valide un formulaire (ex. « Ajouter » un élève dans Détail groupe) est un bouton primaire plein, de même hauteur que le champ voisin

**Navigation** : mobile (< 768 px) tab bar flottante en bas, fond encre, rayon 28 px, marges 12 px sur les côtés et 20 px en bas, 4 entrées de largeur égale avec icône + libellé ; onglet actif fond lavande, texte/icône encre ; inactifs blancs. Desktop (≥ 768 px) : même barre encre en haut, rayon 28 px, logo (version foncée) à gauche, entrées en pilules à droite, active en lavande. Libellé nav "Terrain" ; l'écran a pour H1 « Terrain » (lot cours-terrain, 2026-10-14).

**Icônes** : SVG dont les tracés utilisent `currentColor`, importés en `?raw` et rendus inline via `src/components/Icone.jsx` ; la couleur se pilote par la propriété CSS `color` du parent (ex. encre sur le bouton orange). Pas de filtre CSS. Exception : les illustrations multicolores (`Assets/badge/`, onboarding) restent en `<img>`.

**Listes déroulantes** (deux espaces) : option sélectionnée = fond lavande, texte et coche `primary-texte` ; survol d'une option = fond crème côté apprenant, `#F4F4F6` côté formateur (jamais de crème sur l'option sélectionnée). Le menu étant rendu en portail, `Dropdown.jsx` détecte l'espace à l'ouverture (classe `dropdown-content-formateur`).

**Séparateurs** : aucun trait entre sections (Création de cours, fiche formateur, onglets de la fiche cours) — seulement l'espacement. Les traits `separateur` ne servent qu'entre les éléments d'une liste (lignes de tableau, lignes de liste).

**Pastilles de statut** (une seule règle partout, composant `StatutBadge` : dashboard apprenant, bloc « De ton formateur », page Cours, détail d'un thème, Mode terrain, tableau de suivi du Détail groupe) :
- Non commencé et À faire = texte `text-secondary` sur `neutre-pale` (apprenant) / `neutre-pale-formateur` (formateur) ;
- Nouveau = orange, texte encre ;
- En cours = fond `primary` plein, texte blanc ;
- Terminé = **plus de fond ni de pilule** : coche 14 px + « Terminé », en `success`, 13 px, graisse 800.
- **Pas de point avant le texte** (supprimé le 2026-10-14) : la couleur et le mot suffisent ; seule la mention Terminé garde sa coche.

Le couple `success` sur `success-fond` reste réservé aux bonnes réponses du quiz et à la pastille « Bon rythme » du dashboard formateur.

**Réponses de quiz** : fond crème par défaut, survol lavande sans contour. États avec contour 2 px + fond : sélectionnée = fond lavande, contour `primary` ; correcte = fond `success-fond`, contour et icône `success` ; fausse = fond `error-fond`, contour et icône `error`.

**Anneau, numéro et objet du thème** : l'anneau de progression est réservé à la progression. **L'objet 3D du thème remplace la pastille numéro** (cartes de la page Cours, en-tête du détail d'un thème) ; le numéro s'affiche en texte (« Thème N »).

**Libellés courts des thèmes** (`libelleCourtTheme` dans `src/lib/thematiques.js`, sous-titres des lignes du Mode terrain) : Thermodynamique, Fluides, Cycle frigorifique, Psychrométrie, Technologies, Dimensionnement, Installation, Brasage, Entretien, Diagnostic, Sécurité, Efficacité énergétique.

**Chevrons** (icône `chevron-right.svg`, classe `.chevron-ligne`) : cartes de thème, lignes du détail d'un thème, lignes des résultats de recherche, lignes du Mode terrain, de « De ton formateur » (page Cours), de « Mes cours » et « Mes groupes » portent un chevron à droite (`text-secondary`, icône `currentColor`), toute la carte reste cliquable.

**Toast de complétion** : fond encre, texte blanc, pastille XP orange avec texte encre. **Pastille "Bloquante"** : texte `error` sur fond `error-fond`.

**Dashboard formateur** :
- *Taux de complétion* : anneau de progression (piste lavande, arc `primary`, extrémité arrondie, départ en haut), pourcentage au centre en encre ; sans données, piste seule et « — ». Sous le sous-titre, pastille de statut : < 40 % « À surveiller » (texte `error` sur `error-fond`, icône alerte) ; ≥ 70 % « Bon rythme » (texte `success` sur `success-fond`, icône coche) ; 40-69 % ou sans données : pas de pastille.
- *Cartes chiffres* (Cours créés, Groupes, Élèves) : fond `lavande-pale`, contour 2 px `primary` (exception explicite à la règle « pas de bordure sur les cartes »), rayon 28 px ; en-tête = icône blanche dans une pastille ronde `primary` + libellé ; chiffre centré en encre, 48 px, graisse 800. Les états vides (« Crée ton premier cours/groupe ») gardent ce style de carte. Mobile (< 768 px) : trois cartes côte à côte, icône au-dessus du libellé (centrés), libellé « Élèves » au lieu de « Élèves au total ».

**Détail groupe — liste des élèves** : nom (15 px, 700, encre), email dessous (13 px, `text-secondary`), sans tiret ; lignes à 10 px de padding vertical, séparateur `separateur` entre chaque ligne ; « Retirer » en `error` à droite.

**Logo** : composant `src/components/Logo.jsx` (SVG inline, "skill" vectorisé en Urbanist ExtraBold + "o" en anneau de progression : cercle de fond + arc 75 % partant du haut, extrémité arrondie, épaisseur = fût des lettres, diamètre = hauteur des minuscules). `variante="clair"` : texte encre, fond lavande, arc `primary`. `variante="fonce"` : texte blanc, fond `primary-profond`, arc blanc. Les anciens fichiers de logo ont été supprimés.

**Anneaux de progression** : fond lavande + trait `primary` sur fond clair ; fond `primary-profond` + trait blanc sur carte violette.

**Nuance espace formateur** : même typographie, formes et couleurs que l'espace apprenant, seul le fond de page change (`--color-fond-formateur`, `#F4F4F6`). S'applique à : Dashboard formateur, Création de cours, Détail cours formateur, Détail groupe, Cours et Groupes formateur.

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



## Gestion des groupes — recherche d'élève

Un formateur n'a pas accès en lecture au profil d'un autre utilisateur (RLS `profiles` limité à `auth.uid() = id`). Pour ajouter un élève à un groupe par email, l'app appelle la fonction RPC `find_apprenant_id_by_email(p_email)` (SECURITY DEFINER, ne retourne que l'id, uniquement pour `role = 'apprenant'`) plutôt qu'une requête directe sur `profiles`.

## Parcours d'entrée — nommage clarifié

Deux écrans distincts, à ne pas confondre (mise à jour 2026-09-09 : l'ancien écran "Connexion" séparé a été fusionné dans l'écran "Accueil") :

1. **Introduction** — carrousel de 2-3 slides, pur pitch marketing, avant tout choix. Pagination par points, bouton "Suivant"/"Commencer" sur la dernière slide, menant à l'écran Accueil.
2. **Accueil** — logo Skillo en haut, puis carte "Se connecter" (email, mot de passe, bouton) directement visible sur l'écran, puis carte "Nouveau sur skillo? vous êtes :" avec les 2 CTA de choix de rôle ("Je suis apprenant" / "Je suis formateur"). Le lien texte "Déjà un compte ? Se connecter" a été supprimé — le formulaire de connexion est désormais inline sur cet écran, plus besoin d'un lien pour y accéder.
3. **Onboarding** — questions post-inscription (prénom/tranche d'âge/profession/motivation pour l'apprenant, prénom/organisme/spécialité pour le formateur). Ne pas confondre avec l'Introduction.

Séquence complète : Introduction → Accueil (connexion ou choix de rôle) → Création de compte (si nouveau) → Onboarding → Dashboard.

## Navigation — barre horizontale desktop/tablette (partagée apprenant/formateur)

Mise à jour 2026-09-09 : la barre horizontale (≥768px, cf. sections ci-dessous) affiche désormais le **logo Skillo à gauche** (composant `Logo`, variante foncée) et les **items de navigation groupés à droite**. Décision actée après discussion : pas de sidebar (voir "Évolutions futures anticipées"), pas de nav centrée (réservée si un élément supplémentaire — avatar, notifications — est ajouté à droite un jour). Structure à deux zones : logo (gauche) / nav (droite), sans zone centrale pour l'instant.

## Navigation — espace apprenant

Responsive, deux patterns selon la largeur d'écran (breakpoint ~768px), 4 entrées identiques dans les deux cas — Accueil (le dashboard), Cours, Terrain, Menu — avec les icônes des maquettes (maison `home.svg`, livre `livre.svg`, case cochée `case-cochee.svg`, menu `menu.svg`). Côté formateur, l'entrée reste « Dashboard » avec ses icônes d'origine :

- **Mobile** : tab bar flottante en bas (voir "Direction artistique"), 4 entrées (pas de logo dans la tab bar). Titre/salutation en haut de page avec padding de zone de sécurité (voir "Principes de conception").
- **Desktop/tablette** : barre horizontale fixe en haut avec logo à gauche + 4 entrées groupées à droite (voir "Navigation — barre horizontale desktop/tablette"), contenu du Dashboard organisé en mosaïque/grille en dessous.

**Dashboard apprenant — blocs d'action (refonte 2026-10-14, remplace l'ancien layout)**

Maquettes : `docs/maquettes/apprenant-*` (valeurs exactes) ; règles : `docs/prompts/lot-dashboard-apprenant.md`. Plus de cartes de chiffres, de carrousel de badges ni de section « Cours recommandés » : chaque bloc pousse à une action. Code : `src/pages/Dashboard.jsx` (la situation est calculée côté client, voir ci-dessous).

*En-tête* : « Salut [Prénom] » (H1) à gauche ; à droite l'objet éclair (26 px mobile / 30 px desktop) + « [xp_total] XP » en 800.

*Blocs* :
- **A. Cours en cours** (carte violette, rayon 32 / 36 px desktop) : objet 3D du thème qui déborde en haut à droite (30 px de marge au-dessus du bloc), anneau (piste `primary-profond`, arc blanc) avec le %, « Tu en es là », titre, phrase d'état (« Leçon lue. Reste le quiz / la checklist… »), bouton blanc pleine largeur « Continuer le cours » (pastille encre + flèche). Pastille encre « De ton formateur » au-dessus du titre si le cours est privé.
- *Structure des blocs de tête* (A cours en cours, C cours assigné, B premier cours / prochain cours conseillé quand il est en tête ; lot retouches-quiz-2) : **rangée 1** = anneau de progression (A) ou pastille / libellé (C, B) à gauche, objet 3D à droite qui garde son débord de 30 px au-dessus du cadre sans descendre plus bas que la rangée (128 px mobile, 160 px desktop, anneau 78 / 120 px) ; **rangée 2** = texte sur toute la largeur, sans réserve à droite (pastille « De ton formateur », « Tu en es là », titre, phrase de progression / méta) ; **rangée 3** = bouton. Titre 26 px mobile / 32 px desktop, 3 lignes max avec points de suspension, `hyphens: manual` (pas de césure automatique). Jamais de coupure en plein mot : `word-break: normal`, `overflow-wrap: normal`, `hyphens: auto` (page en `lang="fr"`). Sur desktop, le titre suit la règle des titres de cours (32 px, `--taille-titre-cours`).
- **B. Ton premier cours / Prochain cours conseillé** (carte blanche) : libellé `primary-texte`, titre, thème, bouton « Commencer » ; objet 3D en bas à droite, contenu dans la carte. Cours = premier cours public non commencé, ordre des thèmes (`THEMATIQUES`) puis `cours.ordre`.
- **C. Cours assigné en tête** (carte violette) : pastille « De ton formateur », titre, « [thème] · ajouté [aujourd'hui / hier / il y a N jours] », bouton blanc « Commencer le cours », objet qui déborde.
- **D. De ton formateur** (composant partagé `BlocFormateur`, carte blanche) : en-tête pastille encre + titre + lien « Tout voir » (Cours, section « De ton formateur ») ; une ligne par cours assigné non terminé (vignette crème 48 px avec l'objet du thème, titre, `StatutBadge`) : Nouveau (< 7 jours et jamais ouvert), À faire, En cours — statut calculé par `statutCoursAssigne` (`src/lib/coursAssignes.js`). Tri : Nouveau, puis En cours, puis À faire ; à statut égal, du plus récemment assigné au plus ancien. Masqué si rien à faire.
- **E. Quiz flash en tête** (carte encre, rayon 32) : éclair qui déborde, incliné de 12°, pastille orange « Défi du jour », « Quiz flash » 34 px, phrase « 10 questions sur tes N cours terminés… », bouton orange pleine largeur.
- **F. Quiz flash en ligne** (carte encre) : éclair 52 px, « Quiz flash », « 10 questions · +30 XP », bouton orange « Lancer ». Sur desktop dans la colonne étroite de la rangée de tête : version verticale (éclair 72 px, titre 28 px, phrase, bouton pleine largeur).
- **G. Quiz flash verrouillé** (carte blanche) : éclair grisé + cadenas, « Réussis 3 quiz de cours pour le débloquer », barre fine (`neutre-pale` / encre) et « X / 3 ».
- **H. Prochain badge** (carte lavande) : vignette blanche avec le badge grisé + cadenas, nom, condition en clair, barre (blanc / violet) et compteur, rangée des 6 badges en 26 px (cliquables), lien « Mes badges · X/6 ». Priorité du prochain badge : Premier pas, Persévérant, Expert, Sur le terrain, Éclair, Sans faute.
- **I. Collection complète, vitrine** (carte lavande, permanente) : « Collection complète · 6 badges sur 6 », lien « Voir mes badges », 6 badges sur pastilles blanches cliquables. Sur desktop en colonne étroite : grille 3 × 2, pastilles 64 px réparties sur la hauteur ; seule en pleine largeur (et sur mobile) : rangée de 6.
- **Modale « Mes badges »** (remplace l'ancien carrousel et la popup de détail, supprimés) : fond blanc, rayon 32 px, `--ombre-flottante` ; en-tête « Mes badges », compteur « X/6 », bouton fermer ; grille 3 colonnes desktop / 2 mobile ; chaque badge = objet 3D 72 px sur pastille rayon 20 px (fond crème, la modale étant blanche), nom (15 px, 800), condition en clair (13 px, `text-secondary`), « Obtenu le JJ/MM » (`user_badges.date_obtention`) ou objet grisé + cadenas si verrouillé. Ouverte par « Voir mes badges », « Mes badges · X/6 » et tout clic sur un badge du dashboard ; un clic sur un badge précis fait défiler jusqu'à lui et le met en évidence (contour 2 px `primary`) pendant 1 s. Plus de ligne compacte (ancien bloc J, supprimé le 2026-10-14). **K. Bibliothèque terminée** (carte blanche, sans bouton) : objet 3D « Graduation cap » (`public/illustrations/bibliotheque-terminee.png`) en bas à droite, contenu dans la carte, comme B.

*Situation (dans cet ordre)* :
1. Tous les cours accessibles terminés : E (G si le quiz flash est verrouillé), K, badges.
2. Un cours en cours (le plus récemment modifié) : A, D (autres cours assignés), F ou G, H.
3. Rien en cours, des cours assignés : C (le plus ancien assigné), D (les autres), F ou G, H.
4. Rien en cours ni assigné, aucun cours commencé : B « Ton premier cours », G, H.
5. Rien en cours ni assigné, quiz flash débloqué : E, B « Prochain cours conseillé », H. Verrouillé : B, G, H.

Règles : jamais deux cours à commencer quand un cours est en cours ; une consigne du formateur passe avant les suggestions, jamais avant un cours entamé. Bloc badges : H tant que la collection n'est pas complète, puis I de façon permanente.

*Desktop (≥ 768 px)* : grille 2fr / 1fr. Rangée 1 : bloc de tête à gauche, **toujours le bloc quiz flash à droite** (version verticale de F si débloqué, G sinon) ; si le quiz flash est déjà le bloc de tête (E), le bloc de droite est le suivant dans l'ordre. Cartes de la rangée 1 à 36 px, même hauteur. Rangée 2 : « De ton formateur » à gauche (2fr) quand il existe, bloc badges à droite (1fr) ; sans bloc formateur, le prochain cours conseillé (si la situation en prévoit un hors tête) puis le bloc badges. Un bloc seul en fin de rangée prend toute la largeur — en particulier le bloc badges quand il est seul en rangée 2 (validé 2026-10-14). En rangée 2, le bloc badges prend la même hauteur que son voisin (`align-self: stretch`). Sur mobile, les blocs restent dans l'ordre de la situation. Objet 3D du bloc de tête : coin supérieur droit de la carte, 160 px, à 24 px du bord droit, 30 px de débord au-dessus.

*Données* : date d'assignation via `cours_groupes.created_at` (migration 0004), lue par la RPC `mes_cours_assignes()` (SECURITY DEFINER, uniquement les cours des groupes de l'utilisateur). Si la RPC échoue, les cours privés restent traités comme assignés, sans date (statut « À faire », pas de « ajouté … »). Le nom du formateur n'est pas affiché (RLS `profiles`) : « De ton formateur ».

*Objets 3D des thèmes* : Fluent Emoji (Microsoft, MIT) dans `public/illustrations/themes/` (+ `quiz-flash.png`), via `imageTheme(categorie)` de `src/lib/thematiques.js` (image par défaut `technologies-systemes`, simple filet de sécurité depuis que tous les cours ont un thème). Les illustrations de l'onboarding ne changent pas.

*Objets 3D des badges* : Fluent Emoji (Microsoft, MIT) dans `public/illustrations/badges/` — Premier pas = empreintes (`premier-pas.png`), Sur le terrain = casque de secouriste (`sur-le-terrain.png`), Persévérant = biceps (`perseverant.png`), Sans faute = cible (`sans-faute.png`), Éclair = chronomètre (`eclair.png`), Expert = couronne (`expert.png`). Utilisés partout où un badge apparaît (dashboard, carrousel « Mes badges », popup, toast de badge débloqué). Les anciennes illustrations SVG (`src/Assets/badge/award.svg`, `bolt.svg`, etc.) restent dans le dépôt mais ne sont plus référencées.

**Pages Cours, détail d'un thème, Terrain (lot cours-terrain, 2026-10-14)** :

*En-tête lavande partagé* (composant `EntetePage`, Cours et Terrain) : rayon 32 px (36 desktop), padding 22 / 20 / 20 px (32 / 36 desktop), H1, sous-titre 14 px 700 `texte-attenue` (16 px desktop), objet 3D en haut à droite **dans le cadre, sans débord ni ombre** (88 px à 12 px du haut / 14 px du bord ; desktop : centré verticalement à 48 px du bord, 152 px Cours / 140 px Terrain). Le débord reste réservé au bloc de tête du dashboard.

**Section Cours** :
1. En-tête lavande : objet Books (`public/illustrations/cours.png`), « Cours », « X thèmes terminés sur 12 » (un thème est terminé quand tous ses cours le sont), recherche en pilule blanche 48 px (480 px desktop).
   - *Recherche* : déclenchée à partir de 2 caractères (en dessous, page normale ; vider le champ ramène la page normale). Pendant une recherche, le bloc « De ton formateur » et la grille des thèmes sont masqués ; titre « N résultats » / « 1 résultat » (h2 22 px, 28 desktop) ; résultats = tous les cours accessibles (publics et assignés, ordre des thèmes puis `cours.ordre`) en lignes dans une seule carte blanche (composant `LigneCours`, même modèle que le Mode terrain) : vignette + objet du thème, titre, « [libellé court du thème ou « De ton formateur »] · Leçon · Quiz · Checklist », statut seulement En cours ou Terminé, chevron. Desktop : 2 colonnes (écart 40 px). Aucun résultat : « Aucun cours ne correspond à « [recherche] ». » centré, 15 px, secondaire. Plus d'étiquettes lavande Leçon / Quiz / Checklist (ancien composant `CarteCours` supprimé).
2. « De ton formateur » (`BlocFormateur`, id `cours-formateur`) : compteur « N cours » à droite du titre ; vignette, titre, `StatutBadge`, chevron ; **terminés compris** (bibliothèque complète) ; tri En cours, Nouveau, À faire, Terminé ; masqué sans cours assigné. Desktop : lignes sur 3 colonnes, pastille sous le titre.
3. « Thèmes » (h2 22 px / 28 desktop, sans compteur).
4. Grille des 12 thèmes : 2 colonnes (gap 10) ; desktop 3 colonnes de 768 à 1100 px, 4 au-delà (gap 16). Carte blanche rayon 26 (28), padding 14 / 16 à gauche (20), min-height 176 (200), toute cliquable : objet du thème 52 px (64) + chevron, « Thème N » 12 px (13), nom 15 px (18) graisse 800 avec césure, en bas : Terminé (thème fini) / « x / y cours » `primary-texte` 800 (thème commencé) / « y cours » secondaire (non commencé). Pas de bloc « Thème en cours ». Seuls les cours publics comptent dans un thème (règle inchangée).

**Détail d'un thème** : bouton retour pilule blanche 44 px (chevron gauche + « Cours ») ; bloc lavande (rayon 32, padding 22 / 20) avec objet du thème 92 px en haut à droite dans le cadre, « Thème N » 13 px `primary-texte`, nom en H1 28 px (32 desktop) sans passer sous l'objet, « x cours terminés sur y » ; liste des cours dans une carte blanche (rayon 28, padding 6 / 18), lignes séparées par `separateur` : titre 16 px 800, contenu (« Leçon · Quiz · Checklist ») 13 px secondaire, `StatutBadge` (Non commencé affiché), chevron. Ordre pédagogique (`cours.ordre`), le cours en cours ne remonte pas. Desktop : contenu limité à 880 px.

**Lignes sur plusieurs colonnes (desktop : « De ton formateur » de la page Cours, Mode terrain, résultats de recherche)** : contenu de chaque ligne **aligné en haut** (vignette, texte, statut démarrent au même niveau ; titres d'une rangée toujours à la même hauteur), chevron centré verticalement sur la vignette ; les cellules d'une rangée gardent la même hauteur (séparateurs alignés).

**Section Mode terrain** : en-tête lavande (objet Clipboard `public/illustrations/terrain.png`, H1 « Terrain », « Les checklists à suivre sur le chantier, étape par étape. », pas de recherche), puis **liste plate** de tous les cours à checklist (publics et assignés) dans une seule carte blanche (composant `ListeCours` / `LigneCours`, rayon 28, padding 4 / 16), sans regroupement par thème. Ligne : vignette crème 48 px (52 desktop), titre 15 px (16) 800, « [libellé court du thème] · N étapes » ou « De ton formateur · N étapes », statut (seulement En cours ou Terminé, rien si non commencée), chevron ; ouvre la checklist. Ordre : en cours d'abord, puis ordre des thèmes, puis `cours.ordre`. Statut : Terminé = `progression.checklist_terminee` ; En cours = `progression.statut = 'en_cours'` du cours (pas de suivi « checklist commencée » en base). Desktop : lignes sur 2 colonnes (écart 40 px, padding 8 / 28), pas de séparateur sous la dernière ligne de chaque colonne. État vide : « Aucune checklist terrain disponible pour le moment. »

**Menu** (4e entrée de la navigation, pas une icône flottante séparée) : ouvre un menu contenant "Se déconnecter" (structure prévue pour accueillir d'autres options plus tard).

## Navigation — espace formateur

Même structure que l'espace apprenant (tab bar mobile / barre horizontale desktop avec logo à gauche + nav à droite), 4 entrées miroir : **Dashboard, Cours, Groupes, Menu**. Sidebar gauche envisagée puis écartée pour l'instant (voir "Évolutions futures anticipées"). Titre en haut de page avec padding de zone de sécurité sur mobile (voir "Principes de conception").

**Dashboard formateur — layout en 3 rangées (hybride, validé 2026-09-09)**

Contexte : le layout initial en 2 colonnes créait un grand vide sous "Actions rapides" (colonne gauche plus courte que la colonne droite une fois la recherche/filtres ajoutés à "Activité récente"). Solution retenue : passer en 3 rangées pleine largeur plutôt que corriger les hauteurs de colonnes — corrige le déséquilibre à la racine.

*Rangée 1 — visualisation* : bloc "Taux de complétion moyen" (1fr, avec le sous-titre "Sur l'ensemble de vos groupes" en texte secondaire) + 3 cartes chiffres-clés côte à côte (nombre de cours créés, nombre de groupes, nombre total d'élèves) dans un sous-grid (2fr). Le taux est affiché dans un anneau de progression avec une pastille de statut (« À surveiller » / « Bon rythme »), voir "Direction artistique" > Dashboard formateur.

*Rangée 2 — actions* : 2 cartes côte à côte, largeur égale (1fr 1fr), avec un `min-height` commun calé sur la hauteur naturelle de "Actions rapides" (environ 150-160px) pour que les deux cartes démarrent alignées même quand "Élèves à relancer" est vide.

- "Élèves à relancer" : élèves dont un cours est "Non commencé" depuis plusieurs jours (prépare l'automatisation Make n°3 au backlog). Liste vide → état vide "Aucun élève à relancer pour le moment."
- "Actions rapides" : 2 boutons ("+ Nouveau cours", "+ Nouveau groupe") côte à côte, style secondary (contour, pas de pointillé), **largeur égale mais hauteur intrinsèque au contenu du bouton — ne pas les étirer pour remplir toute la hauteur de la carte** (`align-items: center` sur le conteneur des boutons, pas `stretch`).
- **Titres alignés** : les titres des deux cartes ("Élèves à relancer", "Actions rapides") doivent être à la même position verticale malgré l'icône présente uniquement sur "Élèves à relancer" — même padding-top de carte, même line-height de titre.
- **Hauteurs indépendantes au-delà du min-height** : au-delà du `min-height` commun, les 2 cartes ne doivent pas avoir de hauteur liée. Quand la liste "Élèves à relancer" s'allonge (plus d'élèves à relancer), la carte "Actions rapides" garde sa hauteur basée sur son propre contenu (`align-items: start` sur le conteneur de la rangée, pas `stretch`/grid par défaut).

*Rangée 3 — historique* : "Activité récente" (dans une carte blanche ; champs en fond `#F4F4F6`) (nom volontairement au singulier, pas "Activités récentes" — traite le flux comme un concept global, à l'image de "Recent Activity" ; ce n'est pas une faute). Ligne recherche + filtres : champ "Rechercher un élève" à gauche, dropdowns "Statut" (Tous/Non commencé/En cours/Terminé) et "Trier par" (Plus récent/Nom élève A-Z/Statut) regroupés et alignés à droite de la ligne (largeur fixe égale, ~160px chacun, pour que "Plus récent" tienne sur une ligne), en `flex-direction: row` sur desktop (le `flex-wrap` ne se déclenche qu'en dessous de 768px). En dessous, **liste** (plus de cartes ni de contours) : deux colonnes sur desktop, écart 32 px, une seule colonne sous 768 px ; lecture ligne par ligne (1re activité en haut à gauche, 2e en haut à droite…). Chaque ligne : alignée au centre verticalement, padding vertical 10 px, séparateur 1 px `separateur` (`#ECECF0` côté formateur) en bas, sauf sous la dernière ligne de chaque colonne.
- à gauche, pastille ronde 28 px : « a terminé » = fond `success-fond`, icône coche `success` ; « a commencé » = fond lavande, icône lecture (triangle, `Assets/play.svg`) `primary-texte` ; icônes en `currentColor` ;
- au centre, texte 14 px encre sur 1 ou 2 lignes : prénom en 800, verbe en 500, titre du cours en 800 ;
- à droite, date 12 px `text-secondary`, format court : « Aujourd'hui », « Hier », « 29 j ».

Lien « Voir plus » centré sous la liste (6 activités affichées sur desktop).

**Mobile (< 768px)** : tout s'empile dans le même ordre de lecture (taux de complétion → 3 chiffres-clés en ligne → Élèves à relancer → Actions rapides → Activité récente). "Élèves à relancer" et "Activité récente" n'affichent que les premiers éléments (3 pour "Activité récente") avec un lien texte "Voir plus (N)", N = nombre d'éléments masqués pour éviter une page à rallonge. Les CTA "+ Nouveau cours"/"+ Nouveau groupe" affichés dans les cartes stats vides ("Crée ton premier cours"/"Crée ton premier groupe") passent en bouton rond icône seule ("+", sans texte) pour éviter le débordement dans ces cartes étroites — ailleurs (header "+ Créer un cours"/"+ Créer un groupe", "Actions rapides") le texte est conservé, le contexte n'étant pas suffisant pour s'en passer.

**Section Cours** : grille/mosaïque 3 cours par ligne sur desktop (empilement vertical sur mobile), bouton "+ Créer un cours" sur la même ligne que le titre "Mes cours". Empty state "Aucun cours pour le moment." centré horizontalement sur mobile.

**Section Groupes** : liste complète des groupes, chaque groupe en carte cliquable avec chevron/flèche. Bouton "+ Créer un groupe" sur la même ligne que le titre "Mes groupes" ; au clic, ouvre une modal (titre + input + bouton "Valider" désactivé jusqu'à saisie d'au moins un caractère) plutôt qu'un champ visible en permanence sur l'écran. Empty state "Aucun groupe pour le moment." centré horizontalement sur mobile.

**Détail groupe** : sections "Élèves" et "Ajouter un élève" côte à côte sur la même ligne (desktop), puis en dessous la section "Suivi de progression" avec, sous le titre, la barre de recherche élève et le filtre par statut (Tous/Non commencé/En cours/Terminé) sur la même ligne, puis le tableau (tri par clic sur les en-têtes XP/Badges).

**Menu** : "Se déconnecter" (remplace le lien texte actuel en haut à droite).

Applique le fond formateur `#F4F4F6` (voir "Nuance espace formateur") à ces écrans.

## Fiche de cours — parcours guidé (lot fiche-cours, 2026-10-14)

Code : `src/pages/FicheCours.jsx` (données, progression, transitions) + écrans `src/pages/fiche/` (`EcranLecon`, `EcranQuiz`, `EcranFinQuiz`, `EcranChecklist`, `EcranRecap`) + composant `src/components/ReperEtapes.jsx`. Plus d'onglets : un parcours **Leçon → Quiz → (fin de quiz) → Checklist**, puis un récap. Les étapes dépendent du contenu (leçon + quiz + checklist, leçon + quiz, leçon + checklist ; leçon seule : bouton « Terminer le cours »). Pas de tab bar dans la fiche ; sur desktop, la barre encre du haut reste affichée (leçon, checklist, récap), pas sur le quiz ni la fin de quiz (mode concentré).

*Progression d'une partie* : leçon lue = ligne `progression` avec `statut ≠ non_commence` (ouvrir la leçon la marque `en_cours`) ; quiz fait = au moins une ligne `scores` `quiz_cours` pour le cours (meilleur score = max) ; checklist faite = `progression.checklist_terminee`. Cours complet = `statut = termine` et toutes ses parties faites.

*Points d'entrée* : depuis Cours / dashboard / thème → première étape non terminée (leçon si rien n'est fait) ; depuis Mode terrain → directement la checklist (la leçon n'est pas marquée lue ; si la checklist se termine sans ligne de progression, une ligne `non_commence` + `checklist_terminee` est créée) ; cours complet → récap.

*Repère d'étapes* (leçon, checklist ; pas sur le quiz ni la fin de quiz) : carte blanche rayon 22, colonnes égales, pastille 28 px + libellé 14 px, ligne de 3 px **violette de la première étape jusqu'à l'étape en cours incluse** (ou jusqu'à la dernière si tout est fait), `separateur` au-delà. En cours : pastille violette + numéro blanc, halo lavande 4 px, `aria-current="step"`. Faite : pastille violette + coche, libellé `primary-texte` souligné, lien vers l'étape (« Quiz · 4/5 » avec le meilleur score). À venir : pastille blanche contour 2 px `contour-etape`, non cliquable — sauf leçon et quiz depuis la checklist ouverte par Mode terrain. **Toutes les parties faites** (cours complet) : toutes les étapes en « faite » avec coche, aucune `aria-current`, y compris sur l'écran de la checklist d'un cours terminé.

*Leçon* : retour pilule (nom court du thème), en-tête lavande (objet du thème dans le cadre, thème complet 13 px `primary-texte`, titre 28 / 32 px, « N min de lecture » à 200 mots/min arrondi au-dessus, repère d'étapes pleine largeur), contenu en carte blanche (17 / 18 px, interligne 1,55, H2 21 / 24 px, images rayon 20), encadré « À retenir » (lavande rayon 24, pastille violette 32 px avec ampoule, puces 16 px 600 ; masqué si vide), puis carte encre « Étape suivante » (« Vérifie ce que tu as retenu » / « Passe à la pratique », « N questions · +20 XP » / « N étapes · +15 XP », bouton blanc avec flèche ; « Reprendre le quiz » si un quiz est en cours). Leçon d'un cours déjà terminé : même carte encre, libellé « Cours terminé », titre « Tu as tout bouclé », détail « Score, checklist et cours suivant », bouton « Voir le récap ». Desktop : colonne de 800 px max.

*Quiz* (mode concentré, composant `EcranQuiz` + hook `useQuiz` **partagés avec le quiz flash**) : bouton rond « Quitter le quiz » (retour à la leçon, la progression du quiz est conservée), barre blanche / violette 10 px, « 3 / 5 ». **Pas de carte** : libellé du cours 13 px violet, question 24 px 800 et réponses posés sur le fond de page ; desktop : colonne de 680 px. Réponses = boutons blancs rayon 20, min 56 px, texte 16 px 600, sans contour au repos, avec un contrôle de 22 px à gauche (rond pour une réponse unique, carré rayon 6 pour réponses multiples, contour 2 px `contour-etape`) ; réponses multiples : « Plusieurs réponses possibles » (14 px 700 secondaire) sous la question. Survol : fond lavande ; sélectionnée : fond lavande + contour 2 px violet, contrôle violet plein (point blanc / coche blanche) ; focus clavier : contour 2 px violet décalé de 2 px. Après validation, le contrôle disparaît et le statut n'est jamais porté par la couleur seule : fausse choisie = `error-fond` + contour `error` + pastille « Ta réponse » (croix) ; bonne = `success-fond` + contour `success` + pastille « Bonne réponse » (ou « Ta réponse ») avec coche ; autres = blanc, texte secondaire, sans pastille. Bloc encre rayon 30 avec objet qui déborde (thème si faux, cible si juste ; réserve de 72 px à droite sur le titre et le texte) : « Raté, mais tu vas retenir ça » + explication(s) de la réponse choisie + lien « Revoir la leçon » (retour au quiz à la même question) ; « Bien vu » + explication de la bonne réponse si elle existe. Boutons 58 px : « Valider ma réponse » → « Question suivante » → « Voir mon score », **fixés en bas** dans une barre (fond crème, marges 16 px, 16 px + zone de sécurité en bas, dégradé de 24 px au-dessus), à la même place pendant toute la question ; le contenu a une marge basse égale à la hauteur de la barre ; desktop : même barre, bouton de la largeur de la colonne de 680 px, centré.

*Fin de quiz* (écran complet `EcranFinQuiz`, partagé avec le quiz flash ; colonne centrée de 420 px sur mobile et desktop, bouton principal de la largeur de la colonne, contenu centré verticalement sur desktop ; espacements : 16 px libellé → anneau, 28 px anneau → titre, 8 px titre → sous-titre, 20 px avant la pastille XP, 32 px avant la carte badge ou le bouton, 8 px bouton → liens ; liens secondaires sur une seule ligne séparés de 24 px ; **mobile** : groupe du score centré verticalement au-dessus des actions, actions fixées en bas dans la même barre que le quiz mais fond lavande ; **desktop** : actions sous le contenu, sans barre fixe) : fond lavande, « Quiz terminé · [cours] », anneau de score 168 px (piste blanche, arc violet, trait 16) avec « 4/5 » 48 px et « 80 % », titre (100 % « Sans faute ! », ≥ 60 % « Belle maîtrise ! », sinon « Tu y es presque »), sous-titre (« Aucune erreur, bravo. » / « Une seule erreur à revoir. » / « N erreurs à revoir. »), pastille orange éclair « +20 XP » (seulement si l'XP est gagné à ce passage), une carte encre par badge débloqué (objet du badge qui déborde, « Nouveau badge », nom 22 px, condition 14 px). Bouton violet vers l'étape suivante (« Passer à la checklist » ou « Terminer le cours » → récap) + lien « Revoir mes erreurs » (questions ratées avec ta réponse, la bonne réponse et l'explication). **Score < 50 %** : pas de confettis, bouton principal « Refaire le quiz », étape suivante en lien. Animation ~1,5 s : anneau + compteur (0,7 s), confettis juste après le remplissage de l'anneau, pastille XP avec rebond, cartes badge qui glissent ; `prefers-reduced-motion` : tout direct, sans confettis.

*Confettis « pastilles et anneaux »* (lot confettis, `ConfettiPastilles` dans `src/components/Confetti.jsx`, canvas natif sans dépendance, fin de quiz de cours et quiz flash) : 60 % de pastilles (disques 5-10 px), 40 % d'arcs à trois quarts d'anneau (rayon 4-8 px, trait 2,5 px, extrémités rondes), couleurs à parts égales violet `#5B3FE0`, orange `#F6A55E`, encre `#1E1A33`, blanc `#FFFFFF`, violet profond `#4630B8`. Gerbe depuis le centre de l'anneau de score dans toutes les directions avec une légère poussée vers le haut, vitesse aléatoire, gravité, freinage de l'air, rotation propre, effacement progressif sur ~2,5 s ; canvas par-dessus l'écran (`pointer-events: none`), dimensionné au lancement. Intensité (`salvesConfettiScore`) : 100 % = deux salves de 70 (la seconde à 400 ms) ; 60-99 % = 70 ; 50-59 % = 35 ; < 50 % = aucun ; `prefers-reduced-motion` = aucun. **Même animation partout** : le toast de complétion (checklist terminée, badge débloqué à l'ouverture d'un cours, cours terminé) lance une salve de 45 « pastilles et anneaux » depuis le centre de l'écran (checklist : toujours ; autres : seulement si un badge est débloqué). L'ancienne animation (pièces qui tombent) est supprimée. Sur la fin de quiz, seul le score compte (pas de salve « bonus » liée à un badge).

*Score « x/y »* : chaque passage de quiz de cours enregistre `scores.bonnes_reponses` et `scores.nb_questions` (migration 0007, nombre de questions **au moment du passage**). Affichage du meilleur passage (repère d'étapes « Quiz · 4/5 », récap « Meilleur score ») : « 4/5 » quand ces colonnes sont remplies, sinon le pourcentage seul (« 80 % »), **sans recalcul**. L'anneau de fin de quiz utilise toujours les chiffres du passage qui vient de se terminer.

*Règles de score et d'XP* : chaque passage du quiz insère une ligne `scores` (le meilleur score est conservé, rien n'est retiré) ; les 20 XP ne sont donnés qu'au premier quiz du cours ; le QCM termine le cours (règle existante) ; les badges débloqués (score + cours terminé) s'affichent sur la fin de quiz.

*Checklist* : en-tête compact (bouton rond retour 44 px, thème 12 px `primary-texte`, titre 15 px 800 sur une ligne), repère d'étapes, carte « X étapes sur N » 20 px + « +15 XP à la fin » + barre violette 8 px. Mode case à cocher **séquentiel** : faite = pastille violette + coche, intitulé secondaire ; **passée** (étape non bloquante, lien texte « Passer cette étape » en `primary-texte` sous « Valider l'étape ») = affichée comme faite mais pastille contour `contour-etape` avec une flèche ; une étape **bloquante** n'a pas ce lien ; la checklist est terminée quand toutes les étapes sont validées ou passées. *Checklist en cours* : l'état des étapes (validées et passées) est mémorisé dans le `localStorage` du navigateur, clé `skillo:checklist:[userId]:[coursId]`, pour reprendre où l'apprenant s'était arrêté ; effacé une fois `checklist_terminee` enregistré en base ; stockage indisponible → pas de mémorisation, l'app fonctionne normalement. En base, seul `checklist_terminee` est stocké ; en cours (première non faite) = bloc crème rayon 22 qui déborde légèrement, pastille blanche contour violet, intitulé 17 px 800, pastille « Bloquante » (`error` sur `error-fond`), critère de validation 14 px, bouton « Valider l'étape » ; à venir = pastille contour `contour-etape`, non interactive. Mode remise en ordre : mécanique inchangée, nouveaux en-tête / repère / carte / rayons. Checklist terminée : +15 XP (une fois) + toast de complétion ; récap si le cours est complet, sinon carte « Étape suivante » vers le quiz.

*Récap* (cours complet) : retour + en-tête lavande sans repère, avec la mention Terminé et « X XP gagnés » (20 si quiz fait + 15 si checklist faite) ; carte blanche, une ligne par partie du cours (Leçon · « N min de lecture » · « Relire » ; Quiz · « Meilleur score : 4/5 » · « Refaire » ; Checklist · « N étapes validées » · « Revoir »), boutons contour violet ; carte violette « Suite du thème » (prochain cours public non terminé du même thème, ordre pédagogique, contenu « Leçon · Quiz · Checklist », bouton blanc « Commencer ») masquée si le thème est terminé.

## Création de cours — QCM en accordéon (mis à jour 2026-09-11)

Chaque question est une carte accordéon collapsible (en-tête "Question 1 : [énoncé]" + chevron, repliée par défaut une fois remplie). À l'intérieur : réponses numérotées par lettre (A, B, C... — convention standard pour un QCM, évite la confusion avec la numérotation des questions). Le champ "Explication" reste rattaché aux réponses **fausses** (affichée à l'apprenant s'il sélectionne une réponse fausse — comportement produit existant, ne pas inverser vers la réponse correcte). Le bouton "+ Ajouter une réponse" est centré horizontalement dans le bloc question (pas aligné à gauche), pour le distinguer clairement de "+ Ajouter une question" qui reste fixe en bas de la section quiz.

## Quiz flash — règles

*Écrans (lot retouches-quiz, 2026-10-14)* : même composant que le quiz de cours (`EcranQuiz`, `useQuiz`) : croix « Quitter le quiz flash » (retour au dashboard), barre, « 9 / 10 », pas de H1 ni de compteur de bonnes réponses ; libellé violet = cours d'origine de la question ; correction identique, « Revoir la leçon » ouvre la leçon du cours d'origine (la fiche s'ouvre directement sur la leçon, le quiz flash en cours est abandonné). Fin : même écran que la fin de quiz de cours, libellé « Quiz flash terminé ». ≥ 50 % : confettis, titre selon le score, pastille « +30 XP », carte badge « Éclair » si débloqué, bouton « Retour à l'accueil » + lien « Revoir mes erreurs ». < 50 % : pas de confettis, « Tu y es presque », « 5 bonnes réponses pour gagner 30 XP. », pas de pastille, bouton « Relancer un quiz flash » + liens « Revoir mes erreurs » et « Retour à l'accueil ».

- Débloqué quand l'utilisateur a terminé le quiz d'au moins 3 cours différents (`scores` avec `type = 'quiz_cours'` sur 3 `cours_id` distincts).
- Pioche 10 questions aléatoires parmi celles des cours dont l'utilisateur a déjà terminé le quiz (table `questions`, jointes via `cours_id`).
- À la fin, écrit une ligne dans `scores` (`type = 'quiz_flash'`, `cours_id = null`).
- Si le score est ≥ 50%, attribue 30 XP bonus et déclenche la vérification du badge `premier_quiz_flash_reussi`.



## Hors périmètre (rappel — voir PRD section 6)

Ne pas implémenter : streak, leaderboard, rôle super-admin, génération de contenu via API IA.

## Conventions de code

- Noms de tables/colonnes en français, snake_case (cohérent avec le PRD)
- Composants React : à définir en démarrant le premier écran

