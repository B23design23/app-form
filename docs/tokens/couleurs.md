Statut : décidé le 20 octobre 2026, non migré

# Couleurs, version 3

## Règles de nommage

**Primitifs : `famille-nuance`.**
- La nuance vaut 1000 − 10 × L\* (clarté CIELAB), arrondie au multiple de 25. Les trous sont permis.
- Pour insérer une nuance : on calcule son numéro. S'il est pris, on prend le multiple de 25 libre le plus proche, du côté de la valeur exacte.
- Si la nouvelle couleur est à moins de 2,5 points de L\* d'une nuance de la même famille, elle ne s'en distingue pas assez : on garde l'existante.
- On ne renumérote jamais une nuance existante.

**Sémantiques : `propriété-rôle[-variante]`, toujours dans cet ordre.** Les trois listes sont fermées :

| Élément | Valeurs permises |
|---|---|
| Propriété | `fond`, `texte`, `bordure` |
| Rôle | `page`, `surface`, `sur-carte`, `neutre`, `accent`, `sur-accent`, `marque`, `sur-marque`, `inverse`, `sur-inverse`, `principal`, `secondaire`, `action`, `sur-action`, `focus`, `controle`, `separateur`, `voile`, `recompense`, `erreur`, `sur-erreur`, `succes`, `sur-succes` |
| Variante | `survol`, `desactive`, `accentue` (plus intense que la base du même rôle), `attenue` (moins contrasté) |

Règles pour un agent :
- **Ne pas changer de propriété.** Un token `fond-*` ne s'emploie jamais en `color`, et inversement.
- **Une combinaison absente du tableau n'existe pas.** Il faut la demander, pas la deviner.
- **Tracés SVG** : une piste, un arc ou une barre de progression prend un `fond-*`. Un trait de contour prend un `bordure-*`. Les icônes héritent du `texte-*` de leur parent via `currentColor`.

## Primitifs (21)

| Primitif | Hex | L\* |
|---|---|---:|
| `blanc` | #ffffff | 100 |
| `sable-50` | #f5eee4 | 94,4 |
| `sable-75` | #efe9e0 | 92,6 |
| `sable-150` | #d9d2c6 | 84,4 |
| `ardoise-50` | #f4f4f6 | 96,2 |
| `ardoise-75` | #ececf0 | 93,5 |
| `ardoise-175` | #d3cee3 | 83,7 |
| `ardoise-625` | #5c566e | 37,9 |
| `ardoise-750` | #3b3550 | 23,9 |
| `ardoise-900` | #1e1a33 | 10,9 |
| `violet-75` | #ece8ff | 92,9 |
| `violet-100` | #e4deff | 89,8 |
| `violet-600` | #5b3fe0 | 39,9 |
| `violet-650` | #4a2fd0 | 34,1 |
| `violet-675` | #4630b8 | 31,5 |
| `orange-250` | #f6a55e | 74,4 |
| `orange-300` | #ee9446 | 69,3 |
| `rouge-75` | #fde3e1 | 92,2 |
| `rouge-600` | #b4232a | 39,7 |
| `vert-50` | #dff3e7 | 94,1 |
| `vert-625` | #17663f | 37,9 |

## Sémantiques (43)

« = » signifie que la valeur est la même dans les deux modes.

| Sémantique | Apprenant | Formateur | Rôle | Remplace |
|---|---|---|---|---|
| **Fonds** | | | | |
| `fond-page` | `sable-50` | `ardoise-50` | fond de page | `background`, `creme`, `fond-formateur` |
| `fond-surface` | `blanc` | = | cartes, champs sur le fond de page, bouton blanc sur carte foncée | `surface` (en `background`) |
| `fond-sur-carte` | `sable-50` | `ardoise-50` | champ, réponse, étape ou bloc posé sur une carte blanche | `fond-champ` |
| `fond-neutre` | `sable-75` | `ardoise-75` | pastille « Non commencé », piste des barres fines | `neutre-pale`, `neutre-pale-formateur` |
| `fond-accent` | `violet-100` | = | en-têtes lavande, onglet actif, sélection, survol des boutons contour | `lavande` |
| `fond-marque` | `violet-600` | = | cartes violettes, remplissage de progression | `primary` (cartes, arcs, barres) |
| `fond-marque-accentue` | `violet-675` | = | fond posé sur la marque : piste d'anneau sur carte violette, fond du logo foncé | `primary-profond` |
| `fond-inverse` | `ardoise-900` | = | cartes encre, tab bar, toast | `ink` (en `background`) |
| `fond-inverse-survol` | `blanc` à 12 % | = | survol d'une entrée de la barre de navigation | `rgba(255, 255, 255, 0.12)` |
| `fond-action` | `violet-600` | = | bouton principal, case cochée | `primary` (boutons, `accent-color`) |
| `fond-action-survol` | `violet-675` | = | survol du bouton principal | `primary-hover` (en `background`) |
| `fond-action-desactive` | `violet-100` | = | bouton désactivé | `lavande` (boutons désactivés) |
| `fond-controle` | `sable-150` | `ardoise-175` | point d'un contrôle, poignée de la feuille mobile | `contour-etape` (en `background`) |
| `fond-voile` | `ardoise-900` à 45 % | = | derrière une modale ou un menu | `rgba(30, 26, 51, 0.45)` ×3 |
| `fond-voile-accentue` | `ardoise-900` à 85 % | = | visionneuse d'images, miniature « +N » | `rgba(…, 0.85)`, `rgba(…, 0.6)` |
| `fond-recompense` | `orange-250` | = | XP, quiz flash, pastille « Nouveau » | `orange` (en `background`) |
| `fond-recompense-survol` | `orange-300` | = | survol du bouton orange | `orange-survol` |
| `fond-erreur` | `rouge-75` | = | fond d'erreur, pastille « Bloquante », survol du bouton supprimer | `error-fond` |
| `fond-erreur-accentue` | `rouge-600` | = | bouton rouge plein, pastille « Ta réponse » fausse | `error` (en `background`) |
| `fond-succes` | `vert-50` | = | bonne réponse, « Bon rythme » | `success-fond` |
| `fond-succes-accentue` | `vert-625` | = | pastille de coche, segment « terminés » | `success` (en `background`) |
| **Textes sur fond clair** | | | | |
| `texte-principal` | `ardoise-900` | = | texte principal | `ink` (en `color`) |
| `texte-secondaire` | `ardoise-625` | = | texte secondaire | `text-secondary` |
| `texte-accent` | `violet-650` | = | libellés et liens violets | `primary-texte` |
| `texte-accent-survol` | `violet-675` | = | survol des liens violets | `primary-hover` (en `color`, 9 usages) |
| `texte-sur-accent` | `ardoise-750` | = | sous-titres sur fond lavande | `texte-attenue` |
| `texte-action-desactive` | `ardoise-750` | = | texte d'un bouton désactivé | `texte-attenue` |
| `texte-erreur` | `rouge-600` | = | message et icône d'erreur | `error` (en `color`) |
| `texte-succes` | `vert-625` | = | « Terminé », icône de succès | `success` (en `color`) |
| **Textes sur violet et sur encre** | | | | |
| `texte-sur-marque` | `blanc` | = | texte sur carte violette | `surface` (en `color`), `#ffffff` du logo |
| `texte-sur-marque-attenue` | `violet-75` | = | texte secondaire sur carte violette | `texte-sur-violet-doux`, `texte-sur-violet` |
| `texte-sur-inverse` | `blanc` | = | texte sur carte encre | `surface` (en `color`) |
| `texte-sur-inverse-attenue` | `ardoise-175` | = | texte secondaire sur carte encre | `texte-sur-encre`, `texte-sur-encre-clair` |
| `texte-recompense` | `orange-250` | = | titre et lien de correction sur le bloc encre du quiz | `orange` (en `color`, 2 usages) |
| **Textes sur fonds pleins** (DS 1.2.0) | | | | |
| `texte-sur-action` | `blanc` | = | texte et icône sur `fond-action` : libellé du bouton principal, coche ou point d'un contrôle coché | `surface` (en `color`, 5 usages) |
| `texte-sur-erreur` | `blanc` | = | texte et icône sur `fond-erreur-accentue` : bouton rouge plein, pastille « Ta réponse » fausse | `surface` (en `color`, 2 usages) |
| `texte-sur-succes` | `blanc` | = | texte et icône sur `fond-succes-accentue` : coche d'une bonne réponse, pastille « Bonne réponse » | `surface` (en `color`, 2 usages) |
| **Bordures** | | | | |
| `bordure-action` | `violet-600` | = | contour du bouton secondaire, réponse ou choix sélectionné | `primary` (en `border`) |
| `bordure-focus` | `violet-600` | = | contour de focus clavier, champ actif | `primary` (en `outline`) |
| `bordure-controle` | `sable-150` | `ardoise-175` | ronds, cases et étapes vides | `contour-etape` (en `border`) |
| `bordure-separateur` | `sable-75` | `ardoise-75` | lignes entre les éléments d'une liste | `separateur`, `separateur-formateur` |
| `bordure-erreur` | `rouge-600` | = | réponse fausse, champ en erreur | `error` (en `border`) |
| `bordure-succes` | `vert-625` | = | bonne réponse | `success` (en `border`) |

**Cas isolés à migrer à la main.** Ce sont des usages où le token actuel ne correspond pas à son nom :
- `bouton-ajouter:disabled` prend `text-secondary` comme bordure (`src/styles/shared.css:447`) ;
- `cc-bloquante-active` prend `error-fond` comme bordure, donc une bordure de la couleur du fond (`src/pages/CreationCours.css:1023`) ;
- `fd-etape-action:disabled:hover` prend `lavande` comme bordure (`src/pages/DashboardFormateur.css:763`).

## Décisions

**1. Le niveau composant est vide, et c'est voulu.** Aucun composant n'a besoin d'une valeur que le niveau sémantique n'exprime pas déjà. Quand le fond change, l'anneau change de couleur, mais chaque contexte se résout en choisissant d'autres sémantiques. Un token d'anneau ne serait qu'un alias de plus.

| Anneau et logo | Piste (ou fond du logo) | Arc |
|---|---|---|
| Sur fond clair, logo clair | `fond-accent` | `fond-marque` |
| Sur carte violette, logo foncé | `fond-marque-accentue` | `fond-surface` |
| Sur la fin de quiz (fond lavande) | `fond-surface` | `fond-marque` |

Les confettis lisent `fond-marque`, `fond-recompense`, `fond-inverse`, `fond-surface` et `fond-marque-accentue`.

**2. Fusion de 0,6 dans `fond-voile-accentue` (85 %) : assumé.** La miniature « +N » du Détail cours formateur deviendra plus sombre. Son rôle est de rendre « +N » lisible, en blanc, au-dessus d'une image quelconque : 85 % garantit ce contraste, alors que 60 % dépend de l'image. L'image derrière est décorative.

**3. `bordure-controle` en formateur : `ardoise-175`.** J'applique la règle d'insertion. Un `ardoise-150` aurait la clarté de `sable-150` (L\* 84,4), soit 0,7 point d'`ardoise-175` (83,7) : trop proche, on garde l'existant. `fond-controle` suit le même mode.

Fait à noter, sans le corriger ici : `sable-150` sur blanc donne un contraste d'environ 1,5:1. C'est sous le minimum de 3:1 exigé pour le contour d'un contrôle (WCAG 1.4.11), et `ardoise-175` fait pareil.

**4. Le focus est détaché de l'action.** Lier les deux, c'est ce que je ne veux pas. Le focus doit garder 3:1 de contraste avec le fond voisin, quelle que soit la couleur du bouton. Il se dessine aussi sur les champs, les cartes et les lignes, pas seulement sur les boutons. Si la marque passe à une teinte claire, un focus lié à `action` cesserait d'être visible sans que personne ne s'en aperçoive. `bordure-focus` pointe aujourd'hui vers le même primitif que `bordure-action`, mais il est réglé à part.

**5. Tokens supprimés, ce n'est pas un oubli.**
- `--color-lavande-pale` (#eeeaff) et `--color-contour-imbrique` (#e4e4ea) disparaissent : 0 utilisation dans `src/`. CLAUDE.md les décrit encore et sera à mettre à jour lors de la migration.
- `violet-125` (#dcd4ff) et `ardoise-100` (#e6e3ec) disparaissent aussi. Le schéma n'a qu'un niveau atténué par surface, donc j'ai gardé la valeur majoritaire :
  - sur violet, `violet-75` (3 usages contre 2), qui en plus contraste mieux : 5,4:1 contre 4,6:1 ;
  - sur encre, `ardoise-175` (7 usages contre 1), qui reste à 11:1.
- Ce point est un changement visible : 2 textes sur carte violette s'éclaircissent et l'explication du quiz sur le bloc encre s'assombrit légèrement.

Si ce tableau te convient, je passe aux espacements.
