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

Les versions 1.0.0, 1.0.1 et 1.1.0 ne sont pas encore reprises ici : leur registre (`gouvernance-skillo.md`) n'est pas dans le dépôt.
