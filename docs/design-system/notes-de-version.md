# Notes de version du design system

## 1.2.0 (21 octobre 2026)

Évolution mineure : trois tokens ajoutés, aucun renommé ni retiré.

**Ajouts**

- `texte-sur-action` (`blanc`) : texte et icône posés sur `fond-action` (libellé du bouton principal, coche ou point d'un contrôle coché).
- `texte-sur-erreur` (`blanc`) : texte et icône posés sur `fond-erreur-accentue` (bouton rouge plein, pastille « Ta réponse » fausse).
- `texte-sur-succes` (`blanc`) : texte et icône posés sur `fond-succes-accentue` (coche d'une bonne réponse, pastille « Bonne réponse »).

La liste fermée des rôles de `docs/tokens/couleurs.md` s'ouvre en conséquence à `sur-action`, `sur-erreur` et `sur-succes`. Les sémantiques passent de 40 à 43.

**Descriptions complétées**

- `fond-recompense` : le texte posé dessus est toujours encre, jamais blanc.
- `bordure-separateur` : uniquement entre les éléments d'une liste, jamais entre des sections.

**Application**

Les couleurs de l'app sont lues depuis `src/styles/tokens.generes.css`, généré depuis `tokens/`. Les anciennes variables `--color-…` de `src/styles/shared.css` sont retirées. Changements visibles :

- 2 textes sur carte violette s'éclaircissent (`violet-75` remplace `#dcd4ff`) ;
- l'explication du quiz sur le bloc encre s'assombrit légèrement (`ardoise-175` remplace `#e6e3ec`) ;
- côté formateur, les ronds, cases et étapes vides prennent `ardoise-175` au lieu de `sable-150` ;
- la miniature « +N » du Détail cours passe d'un voile à 60 % à 85 % ;
- les boutons en pilule perdent 2 px de marge intérieure horizontale (24 px au lieu de 26) ;
- le pointillé d'un bouton d'ajout désactivé s'éclaircit (`bordure-controle`) ;
- la pastille de groupe du fil d'activité et le sous-texte de la carte « Prochain cours conseillé » passent en `texte-secondaire` ;
- le survol de `.dash-lien` fonce légèrement (`texte-accent-survol`).

## 1.1.0 (20 octobre 2026)

Évolution mineure de la règle des pastilles de statut (registre de `gouvernance-skillo.md`).

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
