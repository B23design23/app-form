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

## Parcours d'entrée (lot onboarding, 2026-10-14)

```
Introduction (3 slides)
  ├─ « Créer mon compte » → Choix du profil → questions → Création du compte → Dashboard
  └─ « J'ai déjà un compte » → Connexion → Dashboard
```

Code : `src/pages/parcours/` (`Introduction`, `Connexion`, `ChoixProfil`, `Inscription`, `ParcoursContext`, `erreursAuth`) + gabarit `src/components/GabaritParcours.jsx`. L'ancien écran Accueil (connexion + choix du rôle sur la même page), l'ancienne Création de compte et l'onboarding post-inscription à listes déroulantes sont supprimés. Mot de passe oublié / Nouveau mot de passe : même gabarit que la Connexion (`GabaritParcours` : Retour rond et logo en rangée, emplacement du Retour vide sur Nouveau mot de passe, titres `TitreParcours`, champs `ChampParcours` posés sur la page, bouton dans la zone d'action), textes inchangés, retour vers la Connexion.

- **Introduction** : affichée **seulement à la première visite** sur l'appareil (`localStorage` `skillo:introduction-vue`, try/catch) ; ensuite, un utilisateur non connecté (ou déconnecté) arrive sur la Connexion. 3 slides (Books « Apprends ton métier, de la leçon au terrain », High voltage « Gagne de l'XP », clé à molette « Passe à la pratique »), bloc lavande rayon Surface **flexible de 160 à 300 px** (il rétrécit en premier pour que tout tienne sans défilement sur un écran de 667 px ; en dessous de 667 px de haut, exception écrite de l'Introduction, `docs/tokens/mise-en-page.md`, section 8 : zone d'action au plus bas sans réduire la rangée des points, barre « Passer » / logo remontée, bloc lavande → titre en Deux textes d'un groupe, bloc lavande réduit sous 160 px jusqu'à ce que les trois slides tiennent à 320 × 568, illustration à l'échelle, « Suivant » à la même place, police inchangée) avec l'objet 3D à ~60 % de sa hauteur (petite ombre d'illustration), texte à gauche ; points de pagination **dans la zone d'action fixe**, juste au-dessus du bouton. Logo : grand logo centré (44 px) sur la slide 1, sous la ligne de « Passer », écart Entre deux blocs (pas de marge négative : la zone de contenu défile et rognerait le logo), petit logo en haut à gauche sur les slides 2 et 3, petit logo centré dans la ligne du bouton retour sur la **Connexion** (point d'entrée direct d'un utilisateur qui revient), aucun logo sur les autres écrans du parcours. « Passer » (slides 1 et 2) → directement la **Connexion** (test du 2026-10-15 ; avant : slide 3), arrivée **sans flèche de retour** (emplacement vide invisible, le logo ne bouge pas) — la sortie vers l'inscription est le lien « Pas encore de compte ? Créer mon compte » ; la slide 3 porte « Créer mon compte » et « J'ai déjà un compte » (Connexion avec flèche → slide 3). Aucune mention du domaine (climatisation).
- **Connexion** : retour (→ slide 3), « Content de te revoir », champs Email / Mot de passe, « Mot de passe oublié ? » à droite, erreurs en `error` sous les champs ; « Se connecter » + « Pas encore de compte ? Créer mon compte ».
- **Choix du profil** : « Tu viens pour… », deux cartes blanches cliquables (Apprendre / sac à dos ; Former mes élèves / graphique), pas de bouton principal (le choix fait avancer) ; « Déjà un compte ? Se connecter ».
- **Questions** (les questions viennent **avant** l'email et le mot de passe) — apprenant, 5 étapes : prénom, statut (« Enchanté [Prénom]. Tu es plutôt… »), tranche d'âge (grille 2 colonnes), motivation, création du compte ; formateur, 4 étapes (fond `#F4F4F6`) : prénom, organisme, spécialité, création du compte. Valeurs stockées = enums / valeurs existantes (`profession`, `tranche_age`, `motivation`), seuls les libellés changent ; « Autre » en motivation est stocké `autre` (plus de champ libre). Lignes de choix : boutons blancs 64 px rayon Élément, rond 24 px à droite ; choisi = lavande + un seul contour violet 2 px + pastille violette 28 px avec coche ; `radiogroup` / `radio` + `aria-checked`, flèches au clavier ; pas d'avance automatique (« Continuer »).
- **Création du compte** : bloc lavande « Plus qu'une étape, [Prénom] » avec la fusée, Email, Mot de passe (« 6 caractères minimum », réglage Supabase par défaut — non exposé par l'API publique, à aligner si le projet impose plus) ; « Créer mon compte » + « Déjà un compte ? Se connecter ».

*Gabarit commun* : zone d'action de hauteur et position identiques sur tous les écrans (bouton principal 58 px, puis un emplacement réservé dessous pour le lien ou le bouton secondaire) ; mobile : fixée en bas (marge de page sur les côtés, 24 px + zone de sécurité en bas ; Introduction sous 667 px de haut : exception, voir ci-dessus), le contenu défile au-dessus, le clavier la recouvre sans la faire remonter. Barre du haut des questions : retour rond 56 px, progression blanche 14 px, compteur « 2 / 5 » (Compteur). Titre H1 (Titre de page), sous-titre secondaire (Texte secondaire). Bouton désactivé : fond lavande, texte `texte-attenue`. Le contenu garde toujours une marge basse égale à la hauteur **réelle** de la zone d'action (mesurée en JS : points + bouton + lien éventuel) + zone de sécurité ; s'il dépasse (texte agrandi), la zone de contenu défile, la zone d'action reste fixe. **Desktop (≥ 768 px)** : la même mise en page que sur mobile (plus de bloc de gauche ni de second logo), dans la colonne Formulaire (`docs/tokens/mise-en-page.md`), centrée horizontalement et verticalement si elle tient, sinon calée en haut avec 48 px de marge (la page défile, rien n'est coupé) ; le bouton **suit le contenu** (écart Entre deux groupes sous le dernier élément), lien secondaire dessous (Entre deux groupes) ; « Passer » en haut à droite de la colonne. Mobile : bouton fixe en bas, inchangé.

*Données* : rôle et réponses dans un contexte React (`ParcoursProvider`, dans `main.jsx`) recopié dans le `sessionStorage` (`skillo:parcours`) ; le retour arrière conserve les réponses. « Créer mon compte » → `signUp` avec les réponses dans `options.data` (métadonnées). La confirmation d'email est **désactivée** sur le projet (`mailer_autoconfirm: true`) : `signUp` ouvre une session, et `App.jsx` (résolution de session, aucun profil trouvé) écrit la ligne `profiles` à partir des métadonnées — une seule écriture, robuste aux résolutions concurrentes (code 23505 ignoré) et qui fonctionnerait aussi à la première connexion si la confirmation était activée. Compte connecté sans profil ni réponses (inscription antérieure inachevée) : écran « compléter le profil » (mêmes questions, la dernière enregistre le profil). L'email de bienvenue (Make n°1) reste déclenché par l'insertion dans `profiles`, avec le prénom renseigné.

## Navigation — barre horizontale desktop/tablette (partagée apprenant/formateur)

Mise à jour 2026-09-09 : la barre horizontale (≥768px, cf. sections ci-dessous) affiche désormais le **logo Skillo à gauche** (composant `Logo`, variante foncée) et les **items de navigation groupés à droite**. Décision actée après discussion : pas de sidebar (voir "Évolutions futures anticipées"), pas de nav centrée (réservée si un élément supplémentaire — avatar, notifications — est ajouté à droite un jour). Structure à deux zones : logo (gauche) / nav (droite), sans zone centrale pour l'instant.

## Navigation — espace apprenant

Responsive, deux patterns selon la largeur d'écran (breakpoint ~768px), 4 entrées identiques dans les deux cas — Accueil (le dashboard), Cours, Terrain, Menu — avec les icônes des maquettes (maison `home.svg`, livre `livre.svg`, case cochée `case-cochee.svg`, menu `menu.svg`). Côté formateur, l'entrée reste « Dashboard » avec ses icônes d'origine :

- **Mobile** : tab bar flottante en bas (voir "Direction artistique"), 4 entrées (pas de logo dans la tab bar). Titre/salutation en haut de page avec padding de zone de sécurité (voir "Principes de conception").
- **Desktop/tablette** : barre horizontale fixe en haut avec logo à gauche + 4 entrées groupées à droite (voir "Navigation — barre horizontale desktop/tablette"), contenu du Dashboard organisé en mosaïque/grille en dessous.

**Dashboard apprenant — blocs d'action (refonte 2026-10-14, remplace l'ancien layout)**

Maquettes : `docs/maquettes/apprenant-*` (disposition) ; règles : `docs/prompts/lot-dashboard-apprenant.md`. Plus de cartes de chiffres, de carrousel de badges ni de section « Cours recommandés » : chaque bloc pousse à une action. Code : `src/pages/Dashboard.jsx` (la situation est calculée côté client, voir ci-dessous).

*En-tête* : « Salut [Prénom] » (H1) à gauche ; à droite l'objet éclair (26 px mobile / 30 px desktop) + « [xp_total] XP » (Compteur).

*Blocs* :
- **A. Cours en cours** (carte violette, rayon Surface) : objet 3D du thème qui déborde en haut à droite (30 px de marge au-dessus du bloc), anneau (piste `primary-profond`, arc blanc) avec le %, « Tu en es là », titre, phrase d'état (« Leçon lue. Reste le quiz / la checklist… »), bouton blanc pleine largeur « Continuer le cours » (pastille encre + flèche). Pastille encre « De ton formateur » au-dessus du titre si le cours est privé.
- *Structure des blocs de tête* (A cours en cours, C cours assigné, B premier cours / prochain cours conseillé quand il est en tête ; lot retouches-quiz-2) : **rangée 1** = anneau de progression (A) ou pastille / libellé (C, B) à gauche, objet 3D à droite qui garde son débord de 30 px au-dessus du cadre sans descendre plus bas que la rangée (128 px mobile, 160 px desktop, anneau 78 / 120 px) ; **rangée 2** = texte sur toute la largeur, sans réserve à droite (pastille « De ton formateur », « Tu en es là », titre, phrase de progression / méta) ; **rangée 3** = bouton. **B en tête** (sans anneau) : pas de rangée vide réservée, le titre vient juste sous le libellé, l'objet reste en haut à droite avec une réserve à droite sur la colonne de texte (120 px mobile, 200 px desktop). Titre (Titre mis en avant), 3 lignes max avec points de suspension ; césure : règle « Césure des titres » de `docs/tokens/typographie.md` (section 5).
- **B. Ton premier cours / Prochain cours conseillé** (carte blanche) : libellé `primary-texte`, titre, thème, bouton « Commencer » ; objet 3D en bas à droite, contenu dans la carte. Cours = premier cours public non commencé, ordre des thèmes (`THEMATIQUES`) puis `cours.ordre`.
- **C. Cours assigné en tête** (carte violette) : pastille « De ton formateur », titre, « [thème] · ajouté [aujourd'hui / hier / il y a N jours] », bouton blanc « Commencer le cours », objet qui déborde.
- **D. De ton formateur** (composant partagé `BlocFormateur`, carte blanche) : en-tête pastille encre + titre + lien « Tout voir » (Cours, section « De ton formateur ») ; une ligne par cours assigné non terminé (vignette crème 48 px avec l'objet du thème, titre, `StatutBadge`) : Nouveau (< 7 jours et jamais ouvert), À faire, En cours — statut calculé par `statutCoursAssigne` (`src/lib/coursAssignes.js`). Tri : Nouveau, puis En cours, puis À faire ; à statut égal, du plus récemment assigné au plus ancien. Masqué si rien à faire.
- **E. Quiz flash en tête** (carte encre, rayon Surface) : éclair qui déborde, incliné de 12°, pastille orange « Défi du jour », « Quiz flash » (Titre mis en avant), phrase « 10 questions sur tes N cours terminés… », bouton orange pleine largeur.
- **F. Quiz flash en ligne** (carte encre) : éclair 52 px, « Quiz flash », « 10 questions · +30 XP », bouton orange « Lancer ». Sur desktop dans la colonne étroite de la rangée de tête : version verticale (éclair 72 px, titre (Titre de carte), phrase, bouton pleine largeur).
- **G. Quiz flash verrouillé** (carte blanche) : éclair grisé + cadenas, « Réussis 3 quiz de cours pour le débloquer », barre fine (piste `neutre-pale`, remplissage `primary`, comme la barre du bloc badges) et « X / 3 ».
- **H. Prochain badge** (carte lavande) : vignette blanche avec le badge grisé + cadenas, nom, condition en clair, barre (blanc / violet) et compteur, rangée des 6 badges en 26 px (cliquables), lien « Mes badges · X/6 ». Priorité du prochain badge : Premier pas, Persévérant, Expert, Sur le terrain, Éclair, Sans faute.
- **I. Collection complète, vitrine** (carte lavande, permanente) : « Collection complète · 6 badges sur 6 », lien « Voir mes badges », 6 badges sur pastilles blanches cliquables. Sur desktop en colonne étroite : grille 3 × 2, pastilles 64 px réparties sur la hauteur ; seule en pleine largeur (et sur mobile) : rangée de 6.
- **Modale « Mes badges »** (remplace l'ancien carrousel et la popup de détail, supprimés) : fond blanc, rayon Surface, `--ombre-flottante` ; en-tête « Mes badges », compteur « X/6 », bouton fermer ; grille 3 colonnes desktop / 2 mobile ; chaque badge = objet 3D 72 px sur pastille rayon Élément (fond crème, la modale étant blanche), nom (Titre de ligne), condition en clair (Texte secondaire, `text-secondary`), « Obtenu le JJ/MM » (`user_badges.date_obtention`) ou objet grisé + cadenas si verrouillé. Ouverte par « Voir mes badges », « Mes badges · X/6 » et tout clic sur un badge du dashboard ; un clic sur un badge précis fait défiler jusqu'à lui et le met en évidence (contour 2 px `primary`) pendant 1 s. Plus de ligne compacte (ancien bloc J, supprimé le 2026-10-14). **K. Bibliothèque terminée** (carte blanche, sans bouton) : objet 3D « Graduation cap » (`public/illustrations/bibliotheque-terminee.png`) en bas à droite, contenu dans la carte, comme B.

*Situation (dans cet ordre)* :
1. Tous les cours accessibles terminés : E (G si le quiz flash est verrouillé), K, badges.
2. Un cours en cours (le plus récemment modifié) : A, D (autres cours assignés), F ou G, H.
3. Rien en cours, des cours assignés : C (le plus ancien assigné), D (les autres), F ou G, H.
4. Rien en cours ni assigné, aucun cours commencé : B « Ton premier cours », G, H.
5. Rien en cours ni assigné, quiz flash débloqué : E, B « Prochain cours conseillé », H. Verrouillé : B, G, H.

Règles : jamais deux cours à commencer quand un cours est en cours ; une consigne du formateur passe avant les suggestions, jamais avant un cours entamé. Bloc badges : H tant que la collection n'est pas complète, puis I de façon permanente.

*Desktop (≥ 768 px)* : grille 2fr / 1fr. **Quiz flash débloqué** — rangée 1 : bloc de tête à gauche, bloc quiz flash à droite (version verticale de F) ; si le quiz flash est déjà le bloc de tête (E), le bloc de droite est le suivant dans l'ordre. **Quiz flash verrouillé** — rangée 1 : bloc de tête (2fr) à gauche et, à droite (1fr, même hauteur), le bloc badges : « Prochain badge » en version verticale (badge ~120 px dans sa pastille blanche avec cadenas, « Prochain badge », nom, condition, barre et compteur, puis la rangée des 6 badges et le lien « Mes badges · X/6 » en bas ; fond lavande) ou « Collection complète » ; sous la rangée 1, le quiz flash verrouillé (G) en **bande pleine largeur** sur une ligne (éclair grisé + cadenas, « Quiz flash » + consigne, barre et compteur à droite), hauteur au contenu ; les autres blocs (dont « De ton formateur ») suivent dans l'ordre. Cartes de la rangée 1 à 36 px, même hauteur. Rangée 2 : « De ton formateur » à gauche (2fr) quand il existe, bloc badges à droite (1fr) ; sans bloc formateur, le prochain cours conseillé (si la situation en prévoit un hors tête) puis le bloc badges. Un bloc seul en fin de rangée prend toute la largeur — en particulier le bloc badges quand il est seul en rangée 2 (validé 2026-10-14). En rangée 2, le bloc badges prend la même hauteur que son voisin (`align-self: stretch`). Sur mobile, les blocs restent dans l'ordre de la situation. Objet 3D du bloc de tête : coin supérieur droit de la carte, 160 px, à 24 px du bord droit, 30 px de débord au-dessus.

*Données* : date d'assignation via `cours_groupes.created_at` (migration 0004), lue par la RPC `mes_cours_assignes()` (SECURITY DEFINER, uniquement les cours des groupes de l'utilisateur). Si la RPC échoue, les cours privés restent traités comme assignés, sans date (statut « À faire », pas de « ajouté … »). Le nom du formateur n'est pas affiché (RLS `profiles`) : « De ton formateur ».

*Objets 3D des thèmes* : Fluent Emoji (Microsoft, MIT) dans `public/illustrations/themes/` (+ `quiz-flash.png`), via `imageTheme(categorie)` de `src/lib/thematiques.js` (image par défaut `technologies-systemes`, simple filet de sécurité depuis que tous les cours ont un thème). Les illustrations de l'onboarding ne changent pas.

*Objets 3D des badges* : Fluent Emoji (Microsoft, MIT) dans `public/illustrations/badges/` — Premier pas = chaussure de course (`chaussure-course.png`), Sur le terrain = casque de secouriste (`sur-le-terrain.png`), Persévérant = biceps (`perseverant.png`), Sans faute = cible (`sans-faute.png`), Éclair = chronomètre (`eclair.png`), Expert = couronne (`expert.png`). Utilisés partout où un badge apparaît (dashboard, carrousel « Mes badges », popup, toast de badge débloqué). Les anciennes illustrations SVG (`src/Assets/badge/award.svg`, `bolt.svg`, etc.) restent dans le dépôt mais ne sont plus référencées.

**Libellés courts des thèmes** (`libelleCourtTheme` dans `src/lib/thematiques.js`, sous-titres des lignes du Mode terrain) : Thermodynamique, Fluides, Cycle frigorifique, Psychrométrie, Technologies, Dimensionnement, Installation, Brasage, Entretien, Diagnostic, Sécurité, Efficacité énergétique.

**Pages Cours, détail d'un thème, Terrain (lot cours-terrain, 2026-10-14)** :

*En-tête lavande partagé* (composant `EntetePage`, Cours et Terrain) : rayon Surface, padding Surface, la même valeur à toutes les largeurs, H1, sous-titre (Texte secondaire) `texte-attenue`, objet 3D en haut à droite **dans le cadre, sans débord ni ombre** (88 px à 12 px du haut / 14 px du bord ; desktop : centré verticalement à 48 px du bord, 152 px Cours / 140 px Terrain). Le débord reste réservé au bloc de tête du dashboard.

**Section Cours** :
1. En-tête lavande : objet Books (`public/illustrations/cours.png`), « Cours », « X thèmes terminés sur 12 » (un thème est terminé quand tous ses cours le sont), recherche en pilule blanche à la hauteur de champ, avec loupe et texte indicatif « Rechercher un cours » (480 px desktop).
   - *Recherche* : déclenchée à partir de 2 caractères (en dessous, page normale ; vider le champ ramène la page normale), insensible aux accents et à la casse (« detendeur » trouve « détendeur »). Pendant une recherche, le bloc « De ton formateur » et la grille des thèmes sont masqués ; titre « N résultats » / « 1 résultat » (h2, Titre de section) ; résultats = tous les cours accessibles (publics et assignés, ordre des thèmes puis `cours.ordre`) en lignes dans une seule carte blanche (composant `LigneCours`, même modèle que le Mode terrain) : vignette + objet du thème, titre, « [libellé court du thème ou « De ton formateur »] · Leçon · Quiz · Checklist », statut seulement En cours ou Terminé, chevron. Desktop : 2 colonnes (écart Colonnes). Aucun résultat : la phrase seule, sans titre « 0 résultat » : « Aucun cours ne correspond à « [recherche] ». » centré, secondaire (Texte secondaire). Plus d'étiquettes lavande Leçon / Quiz / Checklist (ancien composant `CarteCours` supprimé).
2. « De ton formateur » (`BlocFormateur`, id `cours-formateur`) : compteur « N cours » à droite du titre ; vignette, titre, `StatutBadge`, chevron ; **terminés compris** (bibliothèque complète) ; tri En cours, Nouveau, À faire, Terminé ; à statut égal, le cours assigné le plus récemment d'abord, puis les cours sans date d'assignation en fin de groupe, comme sur le dashboard ; masqué sans cours assigné. « Tout voir » du dashboard y mène par un défilement doux, instantané quand le système demande de réduire les animations (`prefers-reduced-motion`) ; la carte s'arrête au haut du contenu, sous la barre du haut (`docs/tokens/mise-en-page.md`, section 5). Desktop : colonnes automatiques, largeur minimale de la ligne à pastille sous le titre (`docs/tokens/mise-en-page.md`, section 6), pastille sous le titre.
3. « Thèmes » (h2, Titre de section, sans compteur).
4. Grille des 12 thèmes : 2 colonnes ; desktop : colonnes automatiques avec une largeur minimale de carte (`docs/tokens/mise-en-page.md`, section 4 ; écart Répétition). Carte blanche rayon Surface, padding Surface, min-height 176 (200), toute cliquable : objet du thème 52 px (64) + chevron, « Thème N » (Surtitre), nom (Titre de carte) avec césure, en bas : Terminé (thème fini) / « x / y cours » `primary-texte` (Méta fort, état « commencé ») (thème commencé) / « y cours » secondaire (non commencé). Pas de bloc « Thème en cours ». Seuls les cours publics comptent dans un thème (règle inchangée).

**Détail d'un thème** : bouton retour pilule blanche 44 px (chevron gauche + « Cours ») ; bloc lavande (rayon Surface, padding Surface) avec objet du thème 92 px en haut à droite dans le cadre, « Thème N » (Surtitre) `primary-texte`, nom en H1 (Titre de contenu) sans passer sous l'objet, « x cours terminés sur y » (Texte secondaire) ; liste des cours dans une carte blanche (rayon Surface, padding de carte de liste (Ligne de liste)), lignes séparées par `separateur` : titre (Titre de ligne), contenu (« Leçon · Quiz · Checklist ») (Méta) secondaire, `StatutBadge` (Non commencé affiché), chevron. Ordre pédagogique (`cours.ordre`), le cours en cours ne remonte pas. Desktop : colonne Lecture (même largeur de contenu que la leçon, `docs/tokens/mise-en-page.md`). Un thème sans cours reste affiché dans la grille de la page Cours avec la mention « 0 cours » ; son Détail garde l'en-tête du thème (sans le compteur de cours terminés) et le bouton Retour et, à la place de la liste des cours, affiche un seul texte : « Aucun cours dans ce thème. », sans aucune autre action.

**Lignes sur plusieurs colonnes (desktop : « De ton formateur » de la page Cours, Mode terrain, résultats de recherche)** : contenu de chaque ligne **aligné en haut** (vignette, texte, statut démarrent au même niveau ; titres d'une rangée toujours à la même hauteur), chevron centré verticalement sur la vignette ; les cellules d'une rangée gardent la même hauteur (séparateurs alignés).

**Section Mode terrain** : en-tête lavande (objet Clipboard `public/illustrations/terrain.png`, H1 « Terrain », « Les checklists à suivre sur le chantier, étape par étape. », pas de recherche), puis **liste plate** de tous les cours à checklist (publics et assignés) dans une seule carte blanche (composant `ListeCours` / `LigneCours`, rayon Surface, padding de carte de liste (Ligne de liste)), sans regroupement par thème. Ligne : vignette crème 48 px (52 desktop), titre (Titre de ligne), « [libellé court du thème] · N étapes » ou « De ton formateur · N étapes », statut (seulement En cours ou Terminé, rien si non commencée), chevron ; ouvre la checklist. Ordre : en cours d'abord, puis ordre des thèmes, puis `cours.ordre`. Statut : Terminé = `progression.checklist_terminee` ; En cours = `progression.statut = 'en_cours'` du cours (pas de suivi « checklist commencée » en base). Desktop : lignes sur 2 colonnes (écart Colonnes, même padding), pas de séparateur sous la dernière ligne de chaque colonne. État vide : « Aucune checklist terrain disponible pour le moment. »

**Menu** (4e entrée de la navigation, pas une icône flottante séparée) : ouvre un menu contenant "Se déconnecter" (structure prévue pour accueillir d'autres options plus tard).

**Mon compte** : La page s'appelle Mon compte. Elle est atteinte depuis l'entrée Menu de la navigation principale. C'est une page de niveau 0. Se déconnecter est sur cette page, plus dans un menu de la navigation.

## Navigation — espace formateur

Même structure que l'espace apprenant (tab bar mobile / barre horizontale desktop avec logo à gauche + nav à droite), 4 entrées miroir : **Dashboard, Cours, Groupes, Menu**. Sidebar gauche envisagée puis écartée pour l'instant (voir "Évolutions futures anticipées"). Titre en haut de page avec padding de zone de sécurité sur mobile (voir "Principes de conception"). **Compte officiel (`est_admin`)** : pas d'entrée « Groupes » (Dashboard, Cours, Menu ; les 3 entrées se répartissent la largeur de la tab bar) ; `est_admin` est lu à la résolution de session (`authUser.estAdmin`, `App.jsx`) ; une section Groupes ou un Détail groupe ouverts quand même ramènent au dashboard.

**Dashboard formateur (refonte lot dashboard-formateur, 2026-10-15, remplace le layout en 3 rangées)**

Code : `src/pages/DashboardFormateur.jsx` (+ `DashboardAdmin.jsx`), classes `fd-`. Conteneur `.espace-page.espace-page-etroit`. Trois cas, dans cet ordre : compte `est_admin` → **dashboard admin** ; formateur sans aucun couple élève × cours assigné (aucun cours assigné via `cours_groupes` à un groupe qui a au moins un élève) → **Pour bien démarrer* (non admin, tant qu'aucun cours n'est assigné à un groupe qui compte au moins un élève — `couplesAssignes(...).size === 0` ; dès qu'un couple existe, dashboard normal) : H1 + sous-titre « Bienvenue sur Skillo », **sans les boutons « + Nouveau groupe / + Nouveau cours » de l'en-tête** (doublon avec les étapes) ; une carte blanche (rayon Surface, padding Surface) : titre (Titre de section), « N étape(s) sur 3 », barre fine violette, 3 étapes en blocs `#F4F4F6` rayon Élément (rond 40 px blanc + numéro ; titre (Titre de ligne), sous-titre (Texte secondaire), bouton à droite) : 1. **Crée ton premier cours** (faite dès un cours ; « Créer un cours ») ; 2. **Crée un groupe et ajoute tes élèves** (faite dès qu'un groupe a au moins un élève ; « Une promo, une classe, une équipe. Tes élèves s'ajoutent par leur email. » ; « Créer un groupe » sans groupe, sinon « Ajouter des élèves » → Détail du groupe le plus récent) ; 3. **Assigne un cours à ton groupe** (« Tes élèves le verront dans « De ton formateur ». » ; « Assigner un cours » → Détail du groupe avec élèves le plus récent ; désactivé lavande / `texte-attenue` tant que 1 et 2 ne sont pas faites ; une fois faite, l'écran laisse place au dashboard). Étape faite : rond `success-fond` + coche `success`, titre en encre, sous-titre et bouton masqués. Bouton plein sur la première étape non faite, contour sur les autres. Note (Texte secondaire) sous la liste inchangée.

*En-tête* : H1 « Bonjour / Bonsoir {prénom} » ; dessous, en secondaire (Texte secondaire), « 3 cours · 1 groupe · 12 élèves » (élèves distincts ; « N cours » → Mes cours, « N groupes » → Mes groupes, liens en Texte secondaire fort, règle du lien dans une phrase de `docs/tokens/typographie.md` section 6, même couleur, soulignés au survol seulement). À droite (centrés sur le bloc titre) : « + Nouveau groupe » (contour, ouvre `ModaleNouveauGroupe` puis le Détail du groupe créé — même modale que Mes groupes) et « + Nouveau cours » (violet plein), 50 px. Mobile : boutons côte à côte pleine largeur, 46 px.

*Taux de complétion* (carte globale et carte de chaque groupe, une seule définition, `src/lib/groupes.js`) : couples élève × cours assigné au statut `termine` ÷ nombre total de couples élève × cours assigné ; le taux global applique la même formule sur l'ensemble des couples de tous les groupes (chaque couple compté une fois), pas une moyenne des groupes. Pour un formateur à un seul groupe, les deux chiffres sont égaux. Sous le sous-titre de la carte globale, pastille d'état : moins de 40 % « À surveiller » (texte `texte-erreur` sur `fond-erreur`, icône alerte) ; 70 % ou plus « Bon rythme » (texte `texte-succes` sur `fond-succes`, icône coche) ; de 40 à 69 % ou sans données, pas de pastille.

*Desktop* : grille 2 colonnes égales, écart Entre deux blocs (`grid-template-areas`, 2e rangée en `1fr`) ; **les deux colonnes ont toujours la même hauteur** : « Élèves à relancer » s'étire sur toute la colonne de gauche, et si elle est plus haute, « Tes groupes » s'étire pour rattraper ; le contenu reste en haut de chaque carte (« Voir les N autres » collé sous la dernière ligne). Mobile : hauteurs naturelles : gauche **Taux de complétion** (titre « Taux de complétion », sous-titre « Sur l'ensemble de tes groupes ») puis **Tes groupes** ; droite **Élèves à relancer**. Puis **Activité récente** pleine largeur. Mobile : complétion, relances, groupes, activité.

*Tes groupes* : titre (Titre de section) + « Tout voir » (Mes groupes) ; les 3 groupes les plus récents (`groupes.created_at` si la colonne existe — lue via `select('*')` — sinon ordre alphabétique) en blocs `#F4F4F6` rayon Élément cliquables (Détail du groupe) : nom (Titre de ligne), « N élèves · N cours », dernière activité (Méta) (« Actif aujourd'hui / hier / il y a N jours », « Pas encore d'activité » = `progression.updated_at` le plus récent des élèves du groupe sur ses cours), chevron ; barre fine 8 px piste blanche + % (`statsGroupe`, `src/lib/groupes.js`, partagé avec Mes groupes). Pas de pastille « à relancer » ici. Plus de 3 groupes : « Les 3 groupes les plus récents. Le reste est dans Groupes. ».

*Élèves à relancer* : ligne `progression` `non_commence` depuis plus de 3 jours, **uniquement sur un cours assigné à l'un des groupes de l'élève** (couple élève × cours via `groupe_membres` + `cours_groupes`, même règle que la pastille de Mes groupes ; un cours public non assigné n'est jamais compté), un élève une fois, le plus ancien d'abord, lignes `#F4F4F6` rayon Élément, date en `error`, bouton d'envoi → `relancerParEmail` ; 3 lignes puis « Voir les N autres » (déplie) ; sur desktop, la carte étant étirée, le lien est centré verticalement dans l'espace libre entre la dernière ligne et le bas de la carte (au moins un écart Entre deux groupes au-dessus), centré horizontalement ; mobile : juste sous la dernière ligne. Vide : encadré `success-fond` (rond blanc 44 px + coche `success`, « Personne à relancer », « Tous tes élèves ont commencé les cours assignés. »).

*Activité récente* : fil sur une colonne, du plus récent au plus ancien (`progression` `en_cours` / `termine`, `updated_at`, **uniquement les cours assignés à l'un des groupes de l'élève** via `cours_groupes` : un élève qui avance sur un cours public non assigné n'y apparaît pas ; les lignes `non_commence` — checklist faite depuis Mode terrain sans ouvrir la leçon — n'y figurent plus) ; une ligne par élève et par cours (garde-fou de dédoublonnage). En-tête : titre (Titre de section), pastilles « Tout / Commencés / Terminés » (à la hauteur de la recherche, active encre), recherche 220 px avec loupe « Un élève » (prénom + nom) ; si la rangée ne tient pas, les pastilles passent à la ligne et la recherche passe dessous. Intertitres par jour (Surtitre, secondaire : « Aujourd'hui », « Hier », puis la date courte en français sans année, « 11 sept. », « 3 oct. » ; avec l'année seulement si elle diffère de l'année en cours, « 28 déc. 2025 » — `Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' })`). « Actif il y a N jours » (groupes) et « Il y a N jours » (relances) gardent la durée. Ligne (lien vers le Détail du groupe de l'élève auquel le cours est assigné ; pastille = ce groupe) : initiales sur rond lavande 40 px, « **Prénom Nom** a terminé / a commencé **Cours** » (Corps courant, noms en gras en Corps courant fort), pastille du groupe (`#F4F4F6`, `texte-attenue`, Pastille), statut (coche + « Quiz 90 % » = meilleur score, ou « Terminé », en `success` ; point violet + « En cours » en `primary-texte`), chevron ; séparateur `#ECECF0`. « Voir plus » affiche 10 événements de plus. Fil, relances, taux et « Tes groupes » sont calculés côté client à partir d'une seule lecture `progression` (élèves du formateur × cours assignés, avec `cours(titre)`), filtrée ensuite par couple élève × cours assigné (`couplesAssignes`, `src/lib/groupes.js`). Vide : « Pas encore d'activité. ». Mobile : pastilles à la ligne si elles ne tiennent pas, recherche pleine largeur, groupe et statut sous le texte, pas de chevron. Pas de « a repris » : un cours terminé ne repasse jamais en `en_cours` et `progression` ne garde pas d'historique (une ligne par élève et par cours).

*Pour bien démarrer* (non admin, aucun élève) : sous-titre « Bienvenue sur Skillo », boutons de l'en-tête conservés ; une carte blanche (rayon Surface, padding Surface) : titre (Titre de section), « N étape(s) sur 3 », barre fine, 3 étapes en blocs `#F4F4F6` rayon Élément (rond 40 px blanc + numéro, vert + coche si faite ; titre (Titre de ligne), sous-titre (Texte secondaire) ; faite = titre barré secondaire + « Fait » vert) : Crée ton premier cours (`nbCours > 0`), Crée un groupe, Ajoute tes élèves (ouvre le Détail du groupe le plus récent ; désactivé lavande sans groupe). Bouton plein sur la première étape non faite, contour sur les autres. Note (Texte secondaire) sous la liste. Dès qu'un élève est ajouté, le dashboard normal s'affiche.

**Dashboard admin (`est_admin`, `src/pages/DashboardAdmin.jsx`)** : aucun groupe, aucun nom d'élève. En-tête : H1, pastille lavande « Compte officiel » + « N cours publics », un seul bouton « + Nouveau cours » (pleine largeur sur mobile). Trois cartes blanches (rayon Surface, padding Surface, empilées sur mobile) : libellé (Méta), chiffre (Chiffre mis en avant standard), précision (Méta) `text-secondary` sous le chiffre (« 30 derniers jours » sous Apprenants actifs et Cours terminés, « Depuis le lancement » sous Score moyen) — Apprenants actifs (utilisateurs distincts avec une ligne `progression` hors `non_commence` mise à jour sur un cours public dans les 30 jours), Cours terminés (lignes passées à `termine` dans les 30 jours), Score moyen au quiz (moyenne du meilleur score par élève et par cours, cours publics). Carte « Cours les plus suivis » (lien « Tous les cours ») : tableau des 5 cours publics les plus commencés (lignes `progression` hors `non_commence`) (Cours + thème court, Commencés, Terminés, Score moyen) ; mobile : liste « 42 commencés · 18 terminés · 81 % ». Chiffres lus par la RPC `stats_admin_cours_publics()` (la RLS de `progression` / `scores` ne laisse pas l'admin lire ces lignes) — SQL dans `supabase/migrations/0008_stats_admin_cours_publics.sql` (à jouer dans Supabase) ; tant qu'elle n'est pas jouée : « — » et « Statistiques indisponibles pour le moment. ». Aiguillage : `profiles.est_admin = true` sur le profil connecté (lu via `select('*')`) ; `null` / `false` → dashboard formateur.

**Règles communes (lot formateur-listes, 2026-10-14)** : plus de grande carte englobante — titre de page sur le fond `#F4F4F6`, une carte blanche par section (rayon Surface, sans bordure ni ombre). **Conteneur commun** : toutes les pages avec navigation (Dashboard, Mes cours, Mes groupes, Détail cours, Détail groupe) utilisent `.espace-page.espace-page-etroit` (colonne Page, `docs/tokens/mise-en-page.md` ; 24 px de marge sur desktop, aligné sur la barre du haut ; même classe que les pages apprenant) — ne pas recréer de largeur propre. **Détail cours et Détail groupe** s'affichent avec la barre du haut / la tab bar (pages de consultation), dans `EspaceFormateur` (prop `children`), onglet parent actif (Cours / Groupes) ; seul Créer / modifier un cours reste sans navigation (1200 px max, exception écrite, `docs/tokens/mise-en-page.md`, section 8). Retour : lien « ‹ Mes cours / Mes groupes » violet texte au-dessus du titre (desktop), bouton rond blanc 44 px (mobile). Actions destructrices dans un menu « … » (`MenuActions` : carte flottante rayon Surface + `--ombre-flottante` sur desktop, feuille depuis le bas sur mobile avec titre = nom de l'élément), action rouge en dernier, toujours confirmée (`ModaleConfirmation` : « Annuler » + bouton rouge plein). Modales (`Modale`) : carte centrée desktop, feuille mobile, Échap et clic sur le fond ferment. Pastilles de statut = celles de l'apprenant ; pastille de groupe lavande, « Non assigné » neutre. Bouton désactivé : lavande + `texte-attenue`. Composants dans `src/components/formateur/`.

**Mes cours** : « X cours · Y assignés », « + Créer un cours » violet plein (rond « + » 52 px sur mobile), filtres recherche (avec loupe) / thème / groupe (champs blancs), grille 2 colonnes : titre (Titre de carte), « Thème · Leçon · Quiz · Checklist », pastilles des groupes ou « Non assigné ».

**Mes groupes** : « X groupes · Y élèves », « + Créer un groupe » violet plein ; grille : 1 colonne sur mobile, colonnes automatiques sur desktop avec une largeur minimale de carte (`docs/tokens/mise-en-page.md`, section 4) ; carte : nom (Titre de carte), « N élèves · N cours », « Cours terminés » + % et barre fine (terminés ÷ élèves × cours), une pastille d'état par priorité (aucun cours → « Assigne un premier cours » ; élèves à relancer, même règle que le dashboard limitée aux cours du groupe → erreur ; ≥ 70 % → « Bon rythme »). Modale « Nouveau groupe » → ouvre directement le Détail du groupe créé.

**Détail groupe** : H1 + « N élèves · N cours assignés », ajout par email à droite (RPC `find_apprenant_id_by_email`) ; rangée « Cours assignés » (cartes avec barre « X terminés sur N » + carte pointillée « + Assigner un cours » → modale à cases qui ajoute / retire les lignes `cours_groupes` et notifie Make n°2 pour chaque cours ajouté) ; une seule carte « Élèves » (liste et suivi fusionnés) : tableau desktop (élève + email, statut par cours, XP / Badges triables, menu « … » : « Relancer par email », « Retirer du groupe »), cartes sur mobile, 8 élèves puis « Voir les N autres » (lien violet sans soulignement) ; mobile : rangée « Cours assignés » défilante, 1re carte alignée sur la marge de page (`scroll-padding-inline`), seul le bord droit déborde ; « Supprimer ce groupe » en bas (menu « … » sur mobile). **Relancer par email** : `relancerParEmail` (`src/lib/relance.js`), `mailto:` en attendant Make n°3, aussi utilisé par l'icône d'envoi des « Élèves à relancer » du dashboard.

**Détail cours** : titre (Titre de contenu), pastille du thème, contenu, groupes ; « Voir comme un élève » (vraie fiche apprenant en **mode aperçu** : `FicheCours apercu`, aucune écriture dans `progression`, `scores`, `user_badges` ni le stockage local, bandeau encre « Aperçu élève · rien n'est enregistré » + « Quitter l'aperçu »), « Modifier », menu « … » (Supprimer). Carte « Avancement des élèves » (barre empilée terminés / en cours / non commencés, score moyen = moyenne des meilleurs scores, « Pas commencé (7 j) » via `cours_groupes.created_at` ; petites cartes : libellé (Méta) secondaire au-dessus, chiffre (Chiffre mis en avant standard) dessous, libellé sur une ligne en desktop ; chiffre en `error` seulement s'il est > 0, sinon encre). Contenu de l'en-tête via `partiesContenuCours` (même fonction que la carte de Mes cours, avec les questions et étapes chargées) puis « · » avant les pastilles de groupe. En-têtes repliables : sur mobile, la ligne d'info passe sous le titre, chevron à droite centré verticalement ; desktop : à droite du titre ou carte « Assigne ce cours à un groupe… ». Sections repliables : Leçon (premier paragraphe, 4 miniatures max, « À retenir »), QCM (énoncé + bonnes réponses), Checklist (mode, étapes, bloquantes). Plus de « Domaine ».

**Menu** : "Se déconnecter" (remplace le lien texte actuel en haut à droite).

Applique le fond formateur `#F4F4F6` (voir la section « Modes apprenant et formateur » de `docs/design-system/regles-agent.md`) à ces écrans.

## Fiche de cours — parcours guidé (lot fiche-cours, 2026-10-14)

Code : `src/pages/FicheCours.jsx` (données, progression, transitions) + écrans `src/pages/fiche/` (`EcranLecon`, `EcranQuiz`, `EcranFinQuiz`, `EcranChecklist`, `EcranRecap`) + composant `src/components/ReperEtapes.jsx`. Plus d'onglets : un parcours **Leçon → Quiz → (fin de quiz) → Checklist**, puis un récap. Les étapes dépendent du contenu (leçon + quiz + checklist, leçon + quiz, leçon + checklist ; leçon seule : bouton « Terminer le cours »). Pas de tab bar dans la fiche ; sur desktop, la barre encre du haut reste affichée (leçon, checklist, récap), pas sur le quiz ni la fin de quiz (mode concentré).

*Progression d'une partie* : leçon lue = ligne `progression` avec `statut ≠ non_commence` (ouvrir la leçon la marque `en_cours`) ; quiz fait = au moins une ligne `scores` `quiz_cours` pour le cours (meilleur score = max) ; checklist faite = `progression.checklist_terminee`. Cours complet = `statut = termine` et toutes ses parties faites.

*Points d'entrée* : depuis Cours / dashboard / thème → première étape non terminée (leçon si rien n'est fait) ; depuis Mode terrain → directement la checklist (si la checklist se termine sans ligne de progression, une ligne `en_cours` + `checklist_terminee` est créée ; la leçon compte alors comme lue, statut ≠ `non_commence`) ; cours complet → récap.

*Repère d'étapes* (leçon, checklist ; pas sur le quiz ni la fin de quiz) : carte blanche rayon Élément, colonnes égales, pastille 28 px + libellé (Navigation), ligne de 3 px **violette de la première étape jusqu'à l'étape en cours incluse** (ou jusqu'à la dernière si tout est fait), `separateur` au-delà. En cours : pastille violette + numéro blanc, halo lavande 4 px, `aria-current="step"`. Faite : pastille violette + coche, libellé `primary-texte` souligné, lien vers l'étape (« Quiz · 4/5 » avec le meilleur score). À venir : pastille blanche contour 2 px `contour-etape`, non cliquable — sauf leçon et quiz depuis la checklist ouverte par Mode terrain. **Toutes les parties faites** (cours complet) : toutes les étapes en « faite » avec coche, aucune `aria-current`, y compris sur l'écran de la checklist d'un cours terminé.

*Leçon* : retour pilule (nom court du thème), en-tête lavande (objet du thème dans le cadre ; sous 768, l'objet passe au-dessus, aligné à droite, et le thème, le titre et la durée de lecture prennent toute la largeur, sans réserve ; thème complet (Surtitre) `primary-texte`, titre (Titre de contenu), « N min de lecture » à 200 mots/min arrondi au-dessus, repère d'étapes pleine largeur), contenu en carte blanche (Texte de lecture, intertitres H2 en Titre de section, images rayon Élément), encadré « À retenir » (lavande rayon Élément, pastille violette 32 px avec ampoule, puces (Corps courant) ; masqué si vide), puis carte encre « Étape suivante » (titre (Titre mis en avant) « Vérifie ce que tu as retenu » / « Passe à la pratique », « N questions · +20 XP » / « N étapes · +15 XP », bouton blanc avec flèche ; « Reprendre le quiz » si un quiz est en cours). Leçon d'un cours déjà terminé : même carte encre, libellé « Cours terminé », titre « Tu as tout bouclé », détail « Score, checklist et cours suivant », bouton « Voir le récap ». Desktop (≥ 768 px) : leçon (en-tête lavande, repère d'étapes, carte, « Étape suivante »), checklist et récap dans la colonne Lecture, centrée, images de la leçon à 100 % de la carte ; carte « Étape suivante » (et « Cours terminé · Voir le récap ») en ligne : texte à gauche, bouton blanc à droite, centrés verticalement, bouton à la largeur de son contenu (padding Bouton à gauche) ; mobile inchangé.

*Quiz* (mode concentré, composant `EcranQuiz` + hook `useQuiz` **partagés avec le quiz flash**) : bouton rond « Quitter le quiz » (retour à la leçon, la progression du quiz est conservée), barre blanche / violette 10 px, « 3 / 5 ». **Pas de carte** : libellé du cours (Surtitre) violet, question (Titre de contenu) et réponses posés sur le fond de page ; desktop : colonne Question (`docs/tokens/mise-en-page.md`). Réponses = boutons blancs rayon Élément, min 56 px, texte (Saisie et choix), sans contour au repos, avec un contrôle de 22 px à gauche (rond pour une réponse unique, case rayon Case pour réponses multiples, contour 2 px `contour-etape`) ; réponses multiples : « Plusieurs réponses possibles » (Texte secondaire, secondaire) sous la question. Survol : fond lavande ; sélectionnée : fond lavande + **un seul contour** 2 px violet collé au bord, contrôle violet plein (point blanc / coche blanche) ; pas de contour de focus après un clic ou un toucher ; focus **clavier** (`:focus-visible`) : contour 2 px violet décalé de 2 px. Après validation, le contrôle disparaît et le statut n'est jamais porté par la couleur seule : fausse choisie = `error-fond` + contour `error` + pastille « Ta réponse » (croix) ; bonne = `success-fond` + contour `success` + pastille « Bonne réponse » (ou « Ta réponse ») avec coche ; autres = blanc, texte secondaire, sans pastille. Bloc encre rayon Surface avec objet qui déborde (thème si faux, cible si juste ; réserve de 72 px à droite sur le titre et le texte) : « Raté, mais tu vas retenir ça » + explication(s) de la réponse choisie + lien « Revoir la leçon » (retour au quiz à la même question) ; « Bien vu » + explication de la bonne réponse si elle existe. Boutons 58 px : « Valider ma réponse » → « Question suivante » → « Voir mon score », **fixés en bas** dans une barre (fond crème, marge de page sur les côtés, 16 px + zone de sécurité en bas, dégradé de 24 px au-dessus), à la même place pendant toute la question ; le contenu a une marge basse égale à la hauteur de la barre ; desktop : même barre, bouton de la largeur de la colonne Question, centré.

*Fin de quiz* (écran complet `EcranFinQuiz`, partagé avec le quiz flash ; colonne Formulaire centrée sur mobile et desktop (`docs/tokens/mise-en-page.md`), bouton principal de la largeur de la colonne, contenu centré verticalement sur desktop ; espacements : libellé → anneau, anneau → titre et sous-titre → pastille XP en Entre deux groupes, titre → sous-titre en Deux textes d'un groupe, contenu → bouton en Entre deux groupes, place au-dessus de la carte badge en réserve (débord de l'illustration), bouton → liens en Entre deux groupes ; liens secondaires sur une seule ligne, écart Répétition ; **mobile** : groupe du score centré verticalement au-dessus des actions, actions fixées en bas dans la même barre que le quiz mais fond lavande ; **desktop** : actions sous le contenu, sans barre fixe) : fond lavande ; **barre du haut** identique à celle du quiz (même position, zone de sécurité comprise) : bouton rond blanc avec flèche retour (quiz de cours → détail du thème du cours ; quiz flash → dashboard) et, à la place de la barre de progression, le titre du cours en `primary-texte` (Titre de ligne) sur une ligne (« Quiz flash » pour le quiz flash) ; petit libellé centré « Quiz terminé » (`texte-attenue`) au-dessus de l'anneau de score 168 px (piste blanche, arc violet, trait 16) avec le score en pourcentage seul, « 80 % » (Chiffre mis en avant grand), sans « 4/5 », titre (100 % « Sans faute ! », ≥ 60 % « Belle maîtrise ! », sinon « Tu y es presque »), sous-titre (« Aucune erreur, bravo. » / « Une seule erreur à revoir. » / « N erreurs à revoir. »), pastille orange éclair « +20 XP » (seulement si l'XP est gagné à ce passage), une carte encre par badge débloqué (objet du badge qui déborde, « Nouveau badge », nom (Titre de carte), condition (Texte secondaire)). Bouton violet vers l'étape suivante (« Passer à la checklist » ou « Terminer le cours » → récap) + lien « Revoir mes erreurs » (questions ratées avec ta réponse, la bonne réponse et l'explication). **Score < 50 %** : pas de confettis, bouton principal « Refaire le quiz », étape suivante en lien. Animation ~1,5 s : anneau + compteur (0,7 s), confettis juste après le remplissage de l'anneau, pastille XP avec rebond, cartes badge qui glissent ; `prefers-reduced-motion` : tout direct, sans confettis.

*Confettis « pastilles et anneaux »* (lot confettis, `ConfettiPastilles` dans `src/components/Confetti.jsx`, canvas natif sans dépendance, fin de quiz de cours et quiz flash) : 60 % de pastilles (disques 5-10 px), 40 % d'arcs à trois quarts d'anneau (rayon 4-8 px, trait 2,5 px, extrémités rondes), couleurs à parts égales violet `#5B3FE0`, orange `#F6A55E`, encre `#1E1A33`, blanc `#FFFFFF`, violet profond `#4630B8`. Gerbe depuis le centre de l'anneau de score dans toutes les directions avec une légère poussée vers le haut, vitesse aléatoire, gravité, freinage de l'air, rotation propre, effacement progressif sur ~2,5 s ; canvas par-dessus l'écran (`pointer-events: none`), dimensionné au lancement. Intensité (`salvesConfettiScore`) : 100 % = deux salves de 70 (la seconde à 400 ms) ; 60-99 % = 70 ; 50-59 % = 35 ; < 50 % = aucun ; `prefers-reduced-motion` = aucun. **Même animation partout** : le toast de complétion (checklist terminée, badge débloqué à l'ouverture d'un cours, cours terminé) lance une salve de 45 « pastilles et anneaux » depuis le centre de l'écran (checklist : toujours ; autres : seulement si un badge est débloqué). L'ancienne animation (pièces qui tombent) est supprimée. Sur la fin de quiz, seul le score compte (pas de salve « bonus » liée à un badge).

*Score « x/y »* : chaque passage de quiz de cours enregistre `scores.bonnes_reponses` et `scores.nb_questions` (migration 0007, nombre de questions **au moment du passage**). Affichage du meilleur passage (repère d'étapes « Quiz · 4/5 », récap « Meilleur score ») : « 4/5 » quand ces colonnes sont remplies, sinon le pourcentage seul (« 80 % »), **sans recalcul**. L'anneau de fin de quiz (quiz de cours et quiz flash) affiche le score du passage qui vient de se terminer en pourcentage seul, sans « 4/5 ».

*Règles de score et d'XP* : chaque passage du quiz insère une ligne `scores` (le meilleur score est conservé, rien n'est retiré) ; les 20 XP ne sont donnés qu'au premier quiz du cours ; le QCM termine le cours seulement s'il n'y a pas de checklist ou si elle est déjà faite (sinon le cours reste `en_cours`) ; les badges débloqués (score + cours terminé) s'affichent sur la fin de quiz.

*Checklist* : en-tête compact (bouton rond retour 44 px, thème (Surtitre) `primary-texte`, titre (Titre de ligne) sur une ligne), repère d'étapes, carte « X étapes sur N » (Titre de carte) + « +15 XP à la fin » + barre violette 8 px. Mode case à cocher **séquentiel** : faite = pastille violette + coche, intitulé secondaire ; **passée** (étape non bloquante, lien texte « Passer cette étape » en `primary-texte` sous « Valider l'étape ») = affichée comme faite mais pastille contour `contour-etape` avec une flèche ; une étape **bloquante** n'a pas ce lien ; la checklist est terminée quand toutes les étapes sont validées ou passées. *Checklist en cours* : l'état des étapes (validées et passées) est mémorisé dans le `localStorage` du navigateur, clé `skillo:checklist:[userId]:[coursId]`, pour reprendre où l'apprenant s'était arrêté ; effacé une fois `checklist_terminee` enregistré en base ; stockage indisponible → pas de mémorisation, l'app fonctionne normalement. En base, seul `checklist_terminee` est stocké ; en cours (première non faite) = bloc crème rayon Élément qui déborde légèrement, pastille blanche contour violet, intitulé (Corps courant fort), pastille « Bloquante » (`error` sur `error-fond`), critère de validation (Texte secondaire), bouton « Valider l'étape » ; à venir = pastille contour `contour-etape`, non interactive. Mode remise en ordre : mécanique inchangée, nouveaux en-tête / repère / carte / rayons. Checklist terminée : +15 XP (une fois) + toast de complétion ; récap si le cours est complet, sinon carte « Étape suivante » vers le quiz.

*Récap* (cours complet) : retour + en-tête lavande sans repère, avec la mention Terminé et « X XP gagnés » (20 si quiz fait + 15 si checklist faite) ; carte blanche, une ligne par partie du cours (Leçon · « N min de lecture » · « Relire » ; Quiz · « Meilleur score : 4/5 » · « Refaire » ; Checklist · « N étapes validées » · « Revoir »), boutons contour violet ; carte violette « Suite du thème » (titre du cours (Titre mis en avant) ; prochain cours public non terminé du même thème, ordre pédagogique, contenu « Leçon · Quiz · Checklist », bouton blanc « Commencer ») masquée si le thème est terminé.

## Création et modification d'un cours (lot formateur-creation, 2026-10-15)

Code : `src/pages/CreationCours.jsx` + `CreationCours.css` (classes `cc-`). Même écran pour « Créer un cours » et « Modifier le cours » (seuls le H1 et le bouton d'enregistrement changent). **Mode concentré** : ni barre du haut ni tab bar. Titre de page sur le fond `#F4F4F6`, puis une carte blanche par section (**Infos**, **Leçon**, **QCM**, **Checklist terrain**), rayon Surface, padding Surface.

*Desktop (≥ 1024 px)* : grille 240 px + reste, écart des colonnes de mise en page (exception écrite, `docs/tokens/espacements.md`, section 9), 1200 px max (exception écrite, `docs/tokens/mise-en-page.md`, section 8). Colonne gauche collante (top 28) : retour (rond blanc 44 + « Mes cours » en création / « Détail du cours » en modification), sommaire (carte blanche rayon Surface, entrées pilules 44 px, compteurs « N questions » / « N étapes » en direct, section visible en lavande via `IntersectionObserver`, clic = défilement doux), lien violet œil « Voir comme un élève » (masqué pour un cours jamais enregistré ; ouvre l'aperçu élève qui ramène à la modification). H1 (Titre de page) + titre du cours en secondaire ; pastille « Compte officiel : ce cours sera public » sous le H1. *Mobile et tablette (< 1024 px)* : bouton rond retour, titre (Titre de ligne) + titre du cours tronqué, bouton rond œil ; rangée de pastilles collante (Infos, Leçon, QCM N, Checklist N), active fond encre texte blanc ; elle défile au lieu de passer à la ligne (exception écrite, `docs/tokens/mise-en-page.md`, section 8).

*Barre d'enregistrement* toujours visible : desktop pilule blanche flottante (`--ombre-flottante`) alignée sur la colonne de contenu, point orange + « Modifications non enregistrées » et bouton violet s'il y a des changements ; sinon « Aucune modification » en texte secondaire et bouton désactivé (lavande, texte `texte-attenue`) (erreurs d'enregistrement Supabase affichées à cette place), « Annuler » (texte violet) + « Enregistrer » / « Créer le cours » ; mobile barre blanche collée en bas (coins hauts 26), bouton pleine largeur 52 px. Marge basse du contenu pour ne rien cacher. Changements détectés par comparaison d'un instantané de l'état (pris après chargement) ; quitter avec des changements (retour, Annuler, aperçu, « Créer un groupe », bouton précédent du navigateur via une entrée d'historique posée à l'ouverture) → `ModaleConfirmation` « Quitter sans enregistrer ? » ; fermeture / rechargement de l'onglet → alerte native (`beforeunload`).

*Infos* : Titre (champ multiligne ajusté au contenu — hauteur = `scrollHeight` + bordures, recalculée au changement de largeur ; rayon Élément (champ multiligne), comme les intitulés d'étape — pas de retour à la ligne saisi) et Thème côte à côte (≥ 768 px). **Plus de champ « Domaine »** : non envoyé, la valeur en base est conservée (défaut `climatisation` à la création). **Assigner à des groupes** (comptes non admin) : un bouton par groupe « Promo A · 12 élèves » (non choisi fond `#F4F4F6` + rond vide contour `contour-etape` ; choisi contour violet 2 px, lavande, rond violet + coche blanche, `aria-pressed`), aide (Texte secondaire) dessous ; sans groupe : « Tu n'as pas encore de groupe. » + lien « Créer un groupe » (→ Mes groupes). À l'enregistrement, **seules les lignes `cours_groupes` ajoutées ou retirées sont écrites** (la date d'assignation `created_at` des groupes déjà assignés est conservée) et Make n°2 (`notifierMakeNouveauCours`) est appelé pour les groupes nouvellement ajoutés (en création comme en modification, même règle que l'assignation depuis le Détail groupe). Compte admin : cours public, pas de bloc d'assignation.

*Leçon* : éditeur = bloc `#F4F4F6` rayon Élément (contour violet 2 px intérieur au focus), barre d'outils séparée par l'espacement : onglets « Écrire » / « Aperçu » (`tablist`, actif encre) — l'aperçu reprend le rendu de la fiche apprenant (`fiche-lecon`, encadré « À retenir » compris) ; boutons blancs « Image » (upload `lecons-media`, insertion au curseur) et « Vidéo » (modale qui valide un lien YouTube / Vimeo via `obtenirUrlEmbedVideo` exporté de `ContenuMarkdown`, insère le lien seul sur sa ligne au curseur), icônes seules sur mobile ; la barre passe à la ligne si elle ne tient pas. **Images lisibles** : dans le mode Écrire, l'URL de chaque image est remplacée par une référence courte `![nom](#image-N)` (table en mémoire) ; la vraie URL est remise à l'aperçu et à l'enregistrement (le Markdown en base ne change pas). Sous l'éditeur, liste « Images de la leçon » : étiquettes (miniature 64 × 44, nom, croix qui retire l'image du texte). Aide « Laisse une ligne vide… » sous le bloc. « À retenir » : textarea rayon Élément, « Un point par ligne, 3 à 5 conseillés » à droite du libellé (dessous sur mobile). **Plus aucun bouton pointillé « + Insérer une image »** : le pointillé est réservé aux ajouts (question, réponse, étape).

*QCM* : en-tête « QCM » + « N questions ». Question repliée = ligne `#F4F4F6` rayon Élément toute cliquable (pastille numéro blanche, énoncé (Titre de ligne), « Réponse unique · 3 réponses » masqué sur mobile, chevron) ; une question vide ou incomplète s'ouvre dépliée au chargement ; une nouvelle question s'ouvre dépliée et replie les autres. Question dépliée = bloc `#F4F4F6` rayon Élément : numéro violet plein, « Question N », menu « … » (Supprimer la question, confirmée), chevron ; Énoncé (champ blanc, bouton rond image à l'intérieur à droite ; images de l'énoncé en étiquettes sous le champ) ; Type de réponse en `radiogroup` (« Réponse unique » / « Plusieurs réponses », « Une réponse » / « Plusieurs » sur mobile ; passer en réponse unique ne garde que la première bonne réponse) ; réponses en cartes blanches rayon Élément : lettre ronde 40 px lavande (simple repère non cliquable, garde toujours sa lettre), champ, contrôle « Bonne réponse » (vrai input avec label, accessible au clavier : radio en réponse unique, case à cocher en plusieurs réponses ; coché = pastille `success` + coche blanche, libellé `success` ; non coché = rond ou case rayon Case vide, contour `contour-etape`, libellé `text-secondary`), croix ; sur mobile (< 768 px), le contrôle passe sous le champ, aligné à gauche sur lui (révision 2026-10-16 : remplace le clic sur la lettre) (désactivée à 2 réponses) ; **Explication** sous le texte (décalée de la lettre), uniquement sous les réponses fausses, conservée en mémoire si la réponse devient correcte (non enregistrée : `explication = null` pour une bonne réponse). « + Ajouter une réponse » centré, « + Ajouter une question » sous la liste. Validation (énoncé, ≥ 2 réponses non vides, ≥ 1 bonne réponse) : la question fautive se déplie, défile à l'écran, message rouge sous le bloc ; les erreurs Infos / Checklist s'affichent dans leur carte.

*Images de l'énoncé et des étapes* : éditées à part (étiquettes sous le champ) ; à l'enregistrement, ajoutées à la fin du texte en Markdown (`texte\n\n![nom](url)`), format lu par `ContenuMarkdown` côté apprenant ; au chargement, extraites du texte.

*Checklist terrain* : mode en `radiogroup` de 3 boutons (3 colonnes, 64 px, sous-titres ≥ 768 px ; empilés 48 px sur mobile avec coche violette) : « Pas de checklist » (`checklist_mode = null`, aucune étape enregistrée) / « Cases à cocher » (`checkbox`) / « Remise en ordre » (`reorder`) ; passer à « Pas de checklist » avec des étapes demande confirmation ; choisir un mode sans étape en crée une vide. Étapes = lignes `#F4F4F6` rayon Élément : poignée six points (glisser-déposer HTML5, ≥ 768 px), numéro, intitulé (champ blanc multiligne ajusté), pilule « Bloquante » (`aria-pressed`, active `error` sur `error-fond`, inactive contour `contour-etape` ; seulement en mode cases à cocher — `bloquante` enregistré à `false` en remise en ordre), bouton image, menu « … » (Critère de validation, Monter, Descendre, Supprimer confirmé). Étape en cours d'édition (focus) : contour intérieur violet 2 px, numéro violet ; le champ « Critère de validation (facultatif) » n'apparaît que pour elle ou si un critère existe. Mobile (< 768 px) : deux lignes (numéro, intitulé, « … » / « Bloquante » + « Image » décalés), pas de poignée (Monter / Descendre). « + Ajouter une étape » en pointillé sous la liste.

*Accessibilité* : boutons icône avec `aria-label`, cibles 40 px min (44 pour les actions principales), survol dans `@media (hover: hover)`, focus visible au clavier seulement.

## Quiz flash — règles

*Écrans (lot retouches-quiz, 2026-10-14)* : même composant que le quiz de cours (`EcranQuiz`, `useQuiz`) : croix « Quitter le quiz flash » (retour au dashboard), barre, « 9 / 10 », pas de H1 ni de compteur de bonnes réponses ; libellé violet = cours d'origine de la question ; correction identique, « Revoir la leçon » ouvre la leçon du cours d'origine (la fiche s'ouvre directement sur la leçon, le quiz flash en cours est abandonné). Fin : même écran que la fin de quiz de cours (barre du haut « Quiz flash », retour au dashboard, score en pourcentage seul). ≥ 50 % : confettis, titre selon le score, pastille « +30 XP », carte badge « Éclair » si débloqué, bouton « Retour à l'accueil » + lien « Revoir mes erreurs ». < 50 % : pas de confettis, « Tu y es presque », « 5 bonnes réponses pour gagner 30 XP. », pas de pastille, bouton « Relancer un quiz flash » + liens « Revoir mes erreurs » et « Retour à l'accueil ».

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
