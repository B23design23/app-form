Statut : décidé le 20 octobre 2026, migré (DS 2.0.0). Les tableaux des primitifs et des sémantiques sont générés depuis `tokens/` par `npm run tokens`.

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
| Rôle | `page`, `surface`, `sur-carte`, `neutre`, `accent`, `sur-accent`, `marque`, `sur-marque`, `inverse`, `sur-inverse`, `principal`, `secondaire`, `action`, `sur-action`, `focus`, `controle`, `etape`, `separateur`, `voile`, `recompense`, `erreur`, `sur-erreur`, `succes`, `sur-succes` |
| Variante | `survol`, `desactive`, `accentue` (plus intense que la base du même rôle), `attenue` (moins contrasté) |

Règles pour un agent :
- **Ne pas changer de propriété.** Un token `fond-*` ne s'emploie jamais en `color`, et inversement.
- **Une combinaison absente du tableau n'existe pas.** Il faut la demander, pas la deviner.
- **Tracés SVG** : une piste, un arc ou une barre de progression prend un `fond-*`. Un trait de contour prend un `bordure-*`. Les icônes héritent du `texte-*` de leur parent via `currentColor`.
- Un composant ne lit jamais un primitif.
- Un composant lit toujours le même sémantique dans les deux espaces : c'est le mode qui fournit la valeur.

## Primitifs et sémantiques

<!-- couleurs:debut (généré par npm run tokens depuis tokens/, ne pas modifier à la main) -->

Section générée depuis `tokens/` : ne pas la modifier à la main, modifier `tokens/` puis lancer `npm run tokens`.

### Primitifs (22)

| Primitif | Hex | L\* |
|---|---|---:|
| `blanc` | #ffffff | 100 |
| `sable-50` | #f5eee4 | 94,4 |
| `sable-75` | #efe9e0 | 92,6 |
| `sable-150` | #d9d2c6 | 84,4 |
| `ardoise-50` | #f4f4f6 | 96,2 |
| `ardoise-75` | #ececf0 | 93,5 |
| `ardoise-175` | #d3cee3 | 83,7 |
| `ardoise-450` | #847d97 | 53,8 |
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

### Sémantiques (45)

« = » signifie que la valeur est la même dans les deux modes.

| Sémantique | Apprenant | Formateur | Rôle |
|---|---|---|---|
| **Fonds** | | | |
| `fond-surface` | `blanc` | = | Cartes, champs sur le fond de page, bouton blanc sur carte foncée. |
| `fond-accent` | `violet-100` | = | En-têtes lavande, onglet actif, sélection, survol des boutons contour. |
| `fond-marque` | `violet-600` | = | Cartes violettes, remplissage de progression. |
| `fond-marque-accentue` | `violet-675` | = | Fond posé sur la marque : piste d'anneau sur carte violette, fond du logo foncé. |
| `fond-inverse` | `ardoise-900` | = | Cartes encre, tab bar, toast. |
| `fond-inverse-survol` | `blanc` à 12 % | = | Survol d'une entrée de la barre de navigation (blanc à 12 %). Composantes de couleur.blanc, opacité 12 % portée par ce sémantique. |
| `fond-action` | `violet-600` | = | Bouton principal, case cochée. |
| `fond-action-survol` | `violet-675` | = | Survol du bouton principal. |
| `fond-action-desactive` | `violet-100` | = | Bouton désactivé. |
| `fond-voile` | `ardoise-900` à 45 % | = | Derrière une modale ou un menu (encre à 45 %). Composantes de couleur.ardoise-900, opacité 45 % portée par ce sémantique. |
| `fond-voile-accentue` | `ardoise-900` à 85 % | = | Visionneuse d'images, miniature « +N » (encre à 85 %, garantit la lisibilité du « +N » blanc sur une image quelconque). Composantes de couleur.ardoise-900, opacité 85 % portée par ce sémantique. |
| `fond-recompense` | `orange-250` | = | XP, quiz flash. Texte posé dessus : toujours encre (texte-principal), jamais blanc. |
| `fond-recompense-survol` | `orange-300` | = | Survol du bouton orange. |
| `fond-erreur` | `rouge-75` | = | Fond d'erreur, pastille « Bloquante », survol du bouton supprimer. |
| `fond-erreur-accentue` | `rouge-600` | = | Bouton rouge plein, pastille « Ta réponse » fausse. |
| `fond-succes` | `vert-50` | = | Bonne réponse, « Bon rythme ». |
| `fond-succes-accentue` | `vert-625` | = | Pastille de coche, segment « terminés ». |
| `fond-page` | `sable-50` | `ardoise-50` | Fond de page. |
| `fond-sur-carte` | `sable-50` | `ardoise-50` | Champ, réponse, étape ou bloc posé sur une carte blanche. |
| `fond-neutre` | `sable-75` | `ardoise-75` | Pastille « Non commencé », piste des barres fines. |
| `fond-controle` | `sable-150` | `ardoise-175` | Point d'un contrôle, poignée de la feuille mobile. |
| **Textes** | | | |
| `texte-principal` | `ardoise-900` | = | Texte principal sur fond clair. |
| `texte-secondaire` | `ardoise-625` | = | Texte secondaire sur fond clair. |
| `texte-accent` | `violet-650` | = | Libellés et liens violets sur fond clair. |
| `texte-accent-survol` | `violet-675` | = | Survol des liens violets. |
| `texte-sur-accent` | `ardoise-750` | = | Sous-titres sur fond lavande. |
| `texte-action-desactive` | `ardoise-750` | = | Texte d'un bouton désactivé. |
| `texte-erreur` | `rouge-600` | = | Message et icône d'erreur. |
| `texte-succes` | `vert-625` | = | « Terminé », icône de succès. |
| `texte-sur-marque` | `blanc` | = | Texte sur carte violette. |
| `texte-sur-marque-attenue` | `violet-75` | = | Texte secondaire sur carte violette. |
| `texte-sur-inverse` | `blanc` | = | Texte sur carte encre. |
| `texte-sur-inverse-attenue` | `ardoise-175` | = | Texte secondaire sur carte encre. |
| `texte-sur-action` | `blanc` | = | Texte et icône posés sur fond-action : libellé du bouton principal, coche ou point d'un contrôle coché. |
| `texte-sur-erreur` | `blanc` | = | Texte et icône posés sur fond-erreur-accentue : bouton rouge plein, pastille « Ta réponse » fausse. |
| `texte-sur-succes` | `blanc` | = | Texte et icône posés sur fond-succes-accentue : coche d'une bonne réponse, pastille « Bonne réponse ». |
| `texte-recompense` | `orange-250` | = | Titre et lien de correction sur le bloc encre du quiz. |
| **Bordures** | | | |
| `bordure-action` | `violet-600` | = | Contour du bouton secondaire, réponse ou choix sélectionné. |
| `bordure-focus` | `violet-600` | = | Contour de focus clavier, champ actif. Réglé à part de bordure-action : il doit garder 3:1 de contraste avec le fond voisin quelle que soit la couleur du bouton, ne jamais le lier à action. |
| `bordure-controle` | `ardoise-450` | = | Contour d'un contrôle interactif sans texte (case, rond de choix, bascule). Au moins 3:1 contre chaque fond voisin, survol compris. Jamais pour un élément non interactif ni pour un séparateur. |
| `bordure-erreur` | `rouge-600` | = | Réponse fausse, champ en erreur. |
| `bordure-succes` | `vert-625` | = | Bonne réponse. |
| `bordure-separateur` | `sable-75` | `ardoise-75` | Le trait bordure-separateur se place uniquement entre deux éléments consécutifs de même nature qui se répètent dans un même bloc (lignes d'un tableau, lignes d'une liste), jamais avant le premier ni après le dernier. Un en-tête de colonnes, un titre ou une section n'est pas un élément répété : il se sépare par l'espacement. Dans une liste disposée en plusieurs colonnes, le dernier élément de chaque colonne n'a pas de séparateur. |
| `bordure-etape` | `sable-150` | `ardoise-175` | Contour d'une pastille d'étape à venir ou passée, non interactive. Pas d'exigence de contraste, l'état est porté par le remplissage et le libellé. |
| `bordure-action-desactive` | `sable-150` | `ardoise-175` | Contour d'une action désactivée. Va avec texte-action-desactive. |

<!-- couleurs:fin -->

## Correspondance avec les anciennes variables (historique)

Variables `--color-*` (et valeurs écrites en dur) que chaque sémantique a remplacées lors de la migration des couleurs (DS 2.0.0), et lots suivants. Tableau historique, sans valeur : les valeurs sont dans la section générée ci-dessus.

| Sémantique | Remplace |
|---|---|
| `fond-page` | `background`, `creme`, `fond-formateur` |
| `fond-surface` | `surface` (en `background`) |
| `fond-sur-carte` | `fond-champ` |
| `fond-neutre` | `neutre-pale`, `neutre-pale-formateur` |
| `fond-accent` | `lavande` |
| `fond-marque` | `primary` (cartes, arcs, barres) |
| `fond-marque-accentue` | `primary-profond` |
| `fond-inverse` | `ink` (en `background`) |
| `fond-inverse-survol` | `rgba(255, 255, 255, 0.12)` |
| `fond-action` | `primary` (boutons, `accent-color`) |
| `fond-action-survol` | `primary-hover` (en `background`) |
| `fond-action-desactive` | `lavande` (boutons désactivés) |
| `fond-controle` | `contour-etape` (en `background`) |
| `fond-voile` | `rgba(30, 26, 51, 0.45)` ×3 |
| `fond-voile-accentue` | `rgba(…, 0.85)`, `rgba(…, 0.6)` |
| `fond-recompense` | `orange` (en `background`) |
| `fond-recompense-survol` | `orange-survol` |
| `fond-erreur` | `error-fond` |
| `fond-erreur-accentue` | `error` (en `background`) |
| `fond-succes` | `success-fond` |
| `fond-succes-accentue` | `success` (en `background`) |
| `texte-principal` | `ink` (en `color`) |
| `texte-secondaire` | `text-secondary` |
| `texte-accent` | `primary-texte` |
| `texte-accent-survol` | `primary-hover` (en `color`, 9 usages) |
| `texte-sur-accent` | `texte-attenue` |
| `texte-action-desactive` | `texte-attenue` |
| `texte-erreur` | `error` (en `color`) |
| `texte-succes` | `success` (en `color`) |
| `texte-sur-marque` | `surface` (en `color`), `#ffffff` du logo |
| `texte-sur-marque-attenue` | `texte-sur-violet-doux`, `texte-sur-violet` |
| `texte-sur-inverse` | `surface` (en `color`) |
| `texte-sur-inverse-attenue` | `texte-sur-encre`, `texte-sur-encre-clair` |
| `texte-recompense` | `orange` (en `color`, 2 usages) |
| `texte-sur-action` | `surface` (en `color`, 5 usages) |
| `texte-sur-erreur` | `surface` (en `color`, 2 usages) |
| `texte-sur-succes` | `surface` (en `color`, 2 usages) |
| `bordure-action` | `primary` (en `border`) |
| `bordure-focus` | `primary` (en `outline`) |
| `bordure-controle` | `contour-etape` (en `border`) |
| `bordure-etape` | `contour-etape` (pastilles d'étapes) |
| `bordure-action-desactive` | `text-secondary` (`.bouton-ajouter:disabled`) |
| `bordure-separateur` | `separateur`, `separateur-formateur` |
| `bordure-erreur` | `error` (en `border`) |
| `bordure-succes` | `success` (en `border`) |

**Cas isolés migrés à la main.** Usages où l'ancienne variable ne correspondait pas à son nom :
- `bouton-ajouter:disabled` prenait `text-secondary` comme bordure : `bordure-action-desactive` (2.1.0) ;
- `cc-bloquante-active` prenait `error-fond` comme bordure, de la couleur du fond : bordure `transparent` (2.0.0) ;
- `fd-etape-action:disabled:hover` prenait `lavande` comme bordure, de la couleur du fond : bordure `transparent` (2.0.0).

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

*Mise à jour DS 2.1.0 :* `bordure-controle` devient commun et pointe vers `ardoise-450` (3,02:1 au plus bas, contre `fond-accent`). Les valeurs `sable-150` / `ardoise-175` passent à `bordure-etape` et `bordure-action-desactive`, qui n'ont pas d'exigence de contraste.

Fait à noter, sans le corriger ici : `sable-150` sur blanc donne un contraste d'environ 1,5:1. C'est sous le minimum de 3:1 exigé pour le contour d'un contrôle (WCAG 1.4.11), et `ardoise-175` fait pareil.

**4. Le focus est détaché de l'action.** Lier les deux, c'est ce que je ne veux pas. Le focus doit garder 3:1 de contraste avec le fond voisin, quelle que soit la couleur du bouton. Il se dessine aussi sur les champs, les cartes et les lignes, pas seulement sur les boutons. Si la marque passe à une teinte claire, un focus lié à `action` cesserait d'être visible sans que personne ne s'en aperçoive. `bordure-focus` pointe aujourd'hui vers le même primitif que `bordure-action`, mais il est réglé à part.

**5. Tokens supprimés, ce n'est pas un oubli.**
- `--color-lavande-pale` (#eeeaff) et `--color-contour-imbrique` (#e4e4ea) disparaissent : 0 utilisation dans `src/`. CLAUDE.md les décrit encore et sera à mettre à jour lors de la migration.
- `violet-125` (#dcd4ff) et `ardoise-100` (#e6e3ec) disparaissent aussi. Le schéma n'a qu'un niveau atténué par surface, donc j'ai gardé la valeur majoritaire :
  - sur violet, `violet-75` (3 usages contre 2), qui en plus contraste mieux : 5,4:1 contre 4,6:1 ;
  - sur encre, `ardoise-175` (7 usages contre 1), qui reste à 11:1.
- Ce point est un changement visible : 2 textes sur carte violette s'éclaircissent et l'explication du quiz sur le bloc encre s'assombrit légèrement.

Si ce tableau te convient, je passe aux espacements.
