# PRD — App Formation Climatisation

## 1. Contexte & Problème

Les formations en climatisation restent majoritairement théoriques et sur papier. Les apprentis techniciens n'ont pas de moyen accessible de s'entraîner sur des cas concrets en dehors du terrain.

Le moteur applicatif (leçon, QCM, checklist, progression, gamification) est générique et réutilisable pour n'importe quelle thématique technique. La climatisation est le sujet choisi pour ce projet.

## 2. Cibles

- **Apprenant** — technicien débutant / apprenti souhaitant apprendre et s'entraîner, en autonomie ou encadré par un formateur.
- **Formateur** — professionnel ou organisme de formation souhaitant transmettre du contenu structuré à ses propres élèves et suivre leur progression.

## 3. Vision produit & Modèle

Modèle hybride :
- **Accès libre (B2C)** — un apprenant s'inscrit librement, sans besoin d'un formateur, et accède au contenu public.
- **Espace formateur (privé)** — un formateur crée du contenu visible uniquement par les élèves qu'il a rattachés à ses groupes.

Un apprenant a une progression et un dashboard unifiés, qu'il suive du contenu public ou du contenu privé rattaché à un formateur.

## 4. Fonctionnalités V1

- Inscription libre apprenant (sans formateur requis), avec onboarding obligatoire : prénom, tranche d'âge, profession/statut, motivation d'usage — collecte de données pour orienter les priorités produit futures
- Dashboard : progression globale, XP total, badges obtenus
- Fiches de cours (leçon + contenu théorique), catégorisées par thématique (ex : froid, électricité, sécurité)
- QCM par cours (réponse simple ou multiple), correction immédiate par question, explication en cas d'erreur
- Checklist terrain par cours (optionnelle, en complément ou seule) — étapes ordonnées et numérotées, mode de validation par case à cocher ou remise en ordre (drag-and-drop)
- Mode terrain : accès direct à la checklist d'un cours depuis le Dashboard, sans repasser par la leçon ou le quiz — pensé pour un usage sur site
- Un cours peut combiner : leçon + QCM, leçon + checklist, ou les deux
- Gamification : progression par cours, XP à la complétion, badges débloqués sur jalons
- Quiz flash : évaluation aléatoire mélangeant des questions de plusieurs cours déjà suivis (disponible après un minimum de cours complétés), avec bonus d'XP à la clé
- Contenu V1 limité au contenu public (créé par le porteur de projet)

## 5. Fonctionnalités V2

- Formateur : création et édition de ses propres cours (leçon, QCM, checklist), marqués "privés"
- Gestion de groupes : le formateur rattache des élèves à un ou plusieurs groupes
- Contenu privé visible uniquement par les élèves du groupe concerné
- Dashboard formateur : liste de ses cours, ses élèves, leur progression et leurs badges
- Invitation par email des élèves (lien d'inscription, rôle apprenant assigné automatiquement)
- Notification email à l'apprenant quand un nouveau cours lui est assigné par son formateur
- Email de rappel si un cours/quiz assigné reste non commencé ou inachevé après un délai défini

## 6. Hors périmètre

Streak, leaderboard/classement, rôle Super-admin, génération de quiz via API IA — écartés (pas de cas d'usage validé à ce stade).

## 7. Contraintes techniques

- Stack : Claude Code + Supabase (auth native, Row Level Security pour la logique public/privé)
- Espace apprenant : mobile-first (prioritaire)
- Espace formateur (V2) : non figé, à évaluer selon usage réel au moment de la conception

## 8. Modèle de données (résumé haut niveau)

Entités principales : `profiles` (rôle apprenant/formateur), `cours` (visibilité public/privé, catégorie/thématique), `questions`, `reponses` (avec explication), `etapes_checklist` (ordre, mode de validation), `scores`, `progression`, `badges`, `user_badges`, `groupes` (formateur ↔ élèves).

Détail technique complet (schéma SQL, policies RLS, enums) documenté dans `CLAUDE.md`.

## 9. Critères de succès — Definition of Done V1

- 5 fiches de cours + QCM fonctionnels sur le thème climatisation (contenu public)
- Un apprenant peut s'inscrire, suivre un cours, répondre à un quiz, voir sa correction immédiate
- Dashboard affiche progression, XP et badges de façon cohérente
- Au moins 1 checklist terrain fonctionnelle (ex : split mural)
- Application déployée et accessible via un lien (pas seulement en local)
- Schéma Supabase avec RLS fonctionnel (même si le formateur n'est pas encore actif côté UI)

## 10. Backlog — à ne pas oublier avant de considérer le projet fini

- **Images des cours** : colonne `image_url` ajoutée en base + bucket Storage configuré, mais l'affichage côté écran (fiche de cours + vignette Dashboard) n'est pas encore implémenté.
