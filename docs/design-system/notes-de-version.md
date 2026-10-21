# Notes de version du design system

## 2.1.0 (brouillon, non publiée)

Applique la correction 1.0.1 sur `bordure-controle` et sépare les contours qui n'ont pas d'exigence de contraste.

**Ajouté**

- Primitif `ardoise-450` (#847d97, L* 53,8). Côté écran : rien à faire.
- `bordure-etape` (`sable-150` en apprenant, `ardoise-175` en formateur) : contour d'une pastille d'étape à venir ou passée, non interactive. Côté écran : une pastille d'étape utilise `bordure-etape`, jamais `bordure-controle` (déjà fait pour le repère d'étapes et la checklist).
- `bordure-action-desactive` (mêmes valeurs) : contour d'une action désactivée, avec `texte-action-desactive`. Côté écran : déjà fait pour `.bouton-ajouter:disabled`.
- Rôle `etape` dans la liste fermée des rôles de `docs/tokens/couleurs.md`, pour `bordure-etape`. Côté écran : rien à faire.
- Règle des ombres : deux ombres, `--ombre-flottante` pour les éléments flottants (menus, listes déroulantes, toast, modales), ombre d'illustration pour les objets 3D qui débordent d'une carte. Pas de token. Côté écran : rien à faire.
- Règle « Un seul bouton orange par écran » (évolution mineure). Vérifiée sur toutes les situations du dashboard apprenant, mobile et desktop : aucun écran n'en affiche deux aujourd'hui. Côté écran : rien à faire.

**Modifié**

- `bordure-controle` devient commun aux deux modes : retiré des fichiers de mode, déclaré dans `semantiques-communs`. Côté écran : rien à faire.
- Règle des pastilles de statut (applique la décision 1.1.0, règle dans `ds-principes-composants.md`) : un cours pas encore ouvert s'affiche en pilule (Non commencé et À faire en `texte-secondaire` sur `fond-neutre`, Nouveau en `texte-accent` sur `fond-accent`) ; un cours déjà ouvert s'affiche sans pilule, en texte avec une icône (En cours en `texte-accent` avec l'icône de progression, Terminé en `texte-succes` avec la coche). Aucune pastille n'utilise `fond-action`, `fond-marque` ni `fond-recompense`. Côté écran : rien à faire, `StatutBadge` porte la règle ; un statut de cours s'affiche toujours avec `StatutBadge` (fait pour l'Activité récente du dashboard formateur, le score « Quiz N % » restant à côté, hors du composant).

**Corrigé**

- `bordure-controle` pointe vers `ardoise-450` : au moins 3:1 contre chaque fond voisin d'un contrôle (3,92 sur blanc, 3,40 sur `fond-page` apprenant, 3,57 formateur, 3,02 sur le survol lavande). Applique la décision 1.0.1. Côté écran : rien à faire, les contrôles interactifs lisent déjà `bordure-controle`.

**Déprécié**

Aucune entrée.

**Retiré**

Aucune entrée.

**Écrans corrigés**

- Séparateurs (règle précisée, sens inchangé) : `bordure-separateur` seulement entre deux éléments consécutifs de même nature qui se répètent dans un même bloc ; un en-tête, un titre ou une section se sépare par l'espacement. Écrans : tableau des élèves du Détail groupe (desktop), tableau « Cours les plus suivis » du dashboard admin (desktop), tableaux du contenu des leçons, barre d'outils de l'éditeur de leçon (Création de cours).
- Barre d'enregistrement de Création de cours (desktop et mobile) : le point orange devant « Modifications non enregistrées » est retiré, le texte seul porte l'état. `fond-recompense` est réservé à la récompense.
- Bouton supprimer (« Supprimer ce groupe », Détail groupe) : contour `bordure-erreur` ajouté, de la même épaisseur que le bouton secondaire, et survol `fond-erreur`, comme le veut la règle du bouton supprimer.
- Bouton pointillé désactivé : texte `texte-action-desactive` au lieu de `texte-secondaire`, comme tous les boutons désactivés (avec le contour `bordure-action-desactive`).

## 2.0.0 (21 octobre 2026)

Version majeure : retrait des anciennes variables `--color-*` (rubrique « Retiré »), numérotée 1.2.0 à l'origine. Suppression directe sans période de dépréciation : un seul mainteneur, tous les usages migrés (`gouvernance-skillo.md`, section 2).

**Ajouté**

- `texte-sur-action` (`blanc`) : texte et icône posés sur `fond-action` (libellé du bouton principal, coche ou point d'un contrôle coché). Côté écran : le texte blanc d'un bouton principal ou d'un contrôle coché lit `texte-sur-action`.
- `texte-sur-erreur` (`blanc`) : texte et icône posés sur `fond-erreur-accentue` (bouton rouge plein, pastille « Ta réponse » fausse). Côté écran : le texte blanc sur ces fonds lit `texte-sur-erreur`.
- `texte-sur-succes` (`blanc`) : texte et icône posés sur `fond-succes-accentue` (coche d'une bonne réponse, pastille « Bonne réponse »). Côté écran : le texte blanc sur ces fonds lit `texte-sur-succes`.
- Rôles `sur-action`, `sur-erreur` et `sur-succes` dans la liste fermée de `docs/tokens/couleurs.md` ; les sémantiques passent de 40 à 43. Côté écran : rien à faire.

**Modifié**

- Descriptions complétées : `fond-recompense` (le texte posé dessus est toujours encre, jamais blanc) et `bordure-separateur` (uniquement entre les éléments d'une liste, jamais entre des sections). Côté écran : rien à faire.
- Les couleurs de l'app sont lues depuis `src/styles/tokens.generes.css`, généré depuis `tokens/`. Côté écran : lire les sémantiques (`var(--fond-…)`, `var(--texte-…)`, `var(--bordure-…)`), jamais une couleur en dur.
- La miniature « +N » du Détail cours passe d'un voile à 60 % à 85 % (`fond-voile-accentue`). Côté écran : rien à faire.
- Le pointillé d'un bouton d'ajout désactivé s'éclaircit (`bordure-controle`). Côté écran : rien à faire.
- La pastille de groupe du fil d'activité et le sous-texte de la carte « Prochain cours conseillé » passent en `texte-secondaire`. Côté écran : rien à faire.
- Le survol de `.dash-lien` fonce légèrement (`texte-accent-survol`). Côté écran : rien à faire.

**Corrigé**

- 2 textes sur carte violette s'éclaircissent (`violet-75` remplace `#dcd4ff`). Côté écran : rien à faire.
- L'explication du quiz sur le bloc encre s'assombrit légèrement (`ardoise-175` remplace `#e6e3ec`). Côté écran : rien à faire.
- Côté formateur, les ronds, cases et étapes vides prennent `ardoise-175` au lieu de `sable-150`. Côté écran : rien à faire.
- Les boutons en pilule perdent 2 px de marge intérieure horizontale (24 px au lieu de 26). Côté écran : rien à faire.

**Déprécié**

Aucune entrée.

**Retiré**

- Les anciennes variables `--color-…` de `src/styles/shared.css`. Côté écran : utiliser les sémantiques de `tokens/` à leur place.

## 1.1.0 (20 octobre 2026)

Évolution mineure de la règle des pastilles de statut (registre de `gouvernance-skillo.md`).

Statut : décidée le 20 octobre 2026, pas appliquée à cette date. Appliquée en 2.1.0.

**Ajouté**

Aucune entrée.

**Modifié**

- Pastille « En cours » : nouveau rendu sans fond violet plein. La pilule violette pleine se lisait comme un bouton ; un style réservé garde son sens (violet plein = action). Côté écran : rien à faire.
- Pastille « Nouveau » : orange retiré. L'orange est réservé à la récompense, et « Nouveau » n'en est pas une. Côté écran : rien à faire.

**Corrigé**

Aucune entrée.

**Déprécié**

Aucune entrée.

**Retiré**

Aucune entrée.

## 1.0.1 (20 octobre 2026)

Statut : décidée le 20 octobre 2026, pas appliquée à cette date. Appliquée en 2.1.0.

**Ajouté**

Aucune entrée.

**Modifié**

Aucune entrée.

**Corrigé**

- Contour des contrôles : contraste de 1,5:1 sur blanc, remonté au-dessus de 3:1 (contrainte WCAG 1.4.11 que le système s'était donnée). La règle ne change pas. Côté écran : rien à faire.

**Déprécié**

Aucune entrée.

**Retiré**

Aucune entrée.

## 1.0.0 (20 octobre 2026)

Point de départ : état du 20 octobre 2026, après les tokens et les principes.

**Ajouté**

- Exception acceptée : ombre intérieure pour neutraliser l'autoremplissage du champ (contrainte technique, un seul endroit). Côté écran : rien à faire.

**Modifié**

Aucune entrée.

**Corrigé**

Aucune entrée.

**Déprécié**

Aucune entrée.

**Retiré**

Aucune entrée.
