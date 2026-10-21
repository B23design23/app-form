Statut : décidé le 20 octobre 2026, non migré

# Espacements

Les nombres d'occurrences sont ceux de `docs/audit-tokens.md` (tableau 4).

## 1. Base : 4 px

- **Le code y est déjà.** Les multiples de 4 entre 4 et 48 représentent 497 des 850 occurrences d'espacement, et la quasi-totalité des valeurs restantes sont des multiples de 2.
- **Une base de 8 serait trop grossière.** Elle ferait sortir 4 et 12, soit 149 occurrences, et 12 est la 2ᵉ valeur la plus utilisée. Sur un écran mobile avec 16 px de marge latérale, 8 px d'écart minimum entre deux paliers, c'est trop.
- **Une base de 2 ne contraindrait rien.** Presque tout serait « dans la grille » et l'échelle ne servirait plus à choisir.
- **4 s'accorde avec les dimensions fixes de l'app** : la marge mobile de 16 px, la cible tactile de 44 px (4 × 11).

## 2. L'échelle (11 valeurs)

**2 · 4 · 6 · 8 · 10 · 12 · 16 · 20 · 24 · 32 · 40**

Règle : **base 4, avec des demi-pas (2, 6 et 10) admis seulement en dessous de 12.**

| Palier | Occurrences actuelles |
|---:|---:|
| 2 | 21 |
| 4 | 48 |
| 6 | 73 |
| 8 | 87 |
| 10 | 76 |
| 12 | 101 |
| 16 | 103 |
| 20 | 64 |
| 24 | 38 |
| 32 | 12 |
| 40 | 21 |

On garde 32 : la fréquence n'est pas un critère pour retirer un palier.

**Valeurs hors échelle**, ramenées par la règle « la valeur la plus proche ; à égalité, la plus grande » :

| Actuel | Devient | Occurrences | Écart |
|---:|---:|---:|---|
| 3 | 4 | 7 | +1 |
| 5 | 6 | 5 | +1 |
| 14 | 16 | 44 | +2 |
| 18 | 20 | 41 | +2 |
| 22 | 24 | 18 | +2 |
| 26 (dont `--espacement-bouton-pill`) | 24 | 5 | −2 |
| 28 | 32 | 18 | +4 |
| 30 | 32 | 3 | +2 |
| 36 | 40 | 2 | +4 |

Cela fait 143 occurrences modifiées. Une échelle stricte en base 4 (2, 4, 8, 12, 16, 20, 24, 28, 32, 40) en modifierait 274.

**Ce qui reste hors échelle, volontairement** : ces valeurs ne sont pas du rythme d'espacement, ce sont des dimensions de mise en page qui découlent d'autre chose. Elles relèveront d'une catégorie à part.
- les réserves pour les objets 3D (`padding-right` de 72 à 200 px) ;
- les débords des illustrations (`top: -30px`, documenté dans CLAUDE.md) ;
- les marges de page desktop (48, 56 px) ;
- les zones d'action mesurées (126 px).

Les valeurs négatives s'écrivent `calc(-1 * var(--espace-16))`.

## 3. Le sort de 6, 10, 14 et 18 px

Ces quatre valeurs se situent toutes exactement à mi-chemin entre deux paliers en base 4. Aucun arrondi ne peut donc se décider automatiquement, il faut une règle. Voici où elles servent :

| Valeur | Total | Dont `gap` | Dont `padding` |
|---:|---:|---:|---:|
| 6 | 73 | 48 | 14 |
| 10 | 76 | 39 | 31 |
| 14 | 44 | 15 | 23 |
| 18 | 41 | 4 | 36 |

Deux familles se dessinent :

- **6 et 10 restent dans l'échelle.** Ce sont surtout des écarts à l'intérieur d'un composant (icône et libellé, titre et sous-titre, lignes d'une liste). À cette taille, 2 px représentent 20 à 33 % de la valeur : la différence se voit, et elle a été choisie. Supprimer ces deux valeurs toucherait 149 occurrences avec un effet visible à chaque fois. Ce sont, avec 2, les demi-pas de la règle.
- **14 et 18 sont arrondis à 16 et 20.** Ce sont surtout des marges intérieures de cartes et de blocs (18 est le padding horizontal des cartes mobiles). À cette taille, 2 px ne représentent que 11 à 14 % de la valeur. Le changement reste perceptible, mais il est léger et uniforme : les cartes respirent un peu plus. 85 occurrences sont concernées.
  - Quand il s'agit du padding vertical d'un élément à hauteur fixée, la hauteur l'emporte et rien ne bouge.
  - Arrondir vers le haut ajoute de la hauteur. Il faut vérifier l'Introduction, qui doit tenir sans défilement sur un écran de 667 px.

## 4. Nommage : par la valeur (`espace-16`)

**Avantage : aucune traduction.** Une maquette Figma qui indique 16 se code `espace-16`, sans calcul, et un agent ne peut pas confondre le nom avec la mesure. Avec un numéro d'ordre façon Tailwind, `espace-4` vaut 16 px : c'est la confusion classique, et les demi-pas y deviennent `espace-0.5`, `espace-1.5` et `espace-2.5`. Les tailles (`espace-m`) n'ont pas de place pour insérer un palier entre deux existants. C'est aussi la même logique que pour les couleurs : le nom du primitif découle de sa valeur.

**Inconvénient : le nom invite à deviner.** `espace-14` a l'air parfaitement légitime alors qu'il n'existe pas. Un agent l'écrira sans hésiter. La parade est la même que pour les couleurs : une liste fermée écrite noir sur blanc (« les seuls paliers sont 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40 ») et, au moment de la migration, une règle de lint qui refuse tout `--espace-*` hors liste.

Le reproche habituel (« si la valeur change, le nom ment ») ne s'applique pas ici. On ne change jamais la valeur d'un primitif : on fait pointer un sémantique vers un autre palier.

## 5. Dans le code

Tout nouveau code utilise les variables d'espacement générées (`var(--espace-N)`), jamais une valeur en px pour un espacement. Le code existant sera migré plus tard.
