# Notes de version du design system

## 3.0.0 (brouillon, non publiée)

Version majeure : des règles changent au point que des écrans conformes ne le sont plus, et la Modale change d'emplacement dans le code. Les écrans concernés sont listés sous chaque entrée ; ceux qui sont déjà corrigés figurent sous « Écrans corrigés ».

**Ajouté**

- Variante Retour du Bouton : revenir au niveau du dessus quand on est descendu d'un niveau dans les pages ; en haut à gauche, avant l'en-tête ; pilule blanche, chevron à gauche, texte encre ; chevron seul sur mobile (« Retour » reste le nom accessible) ; survol et appui en `fond-accent` ; zone cliquable de 44 px minimum. Côté écran, à mettre en conformité :
  - Détail d'un thème : le retour garde le texte « Cours » sur mobile.
  - Leçon de la fiche de cours : le retour garde le nom court du thème sur mobile.
  - Pages formateur avec retour (Détail cours, Détail groupe) : lien texte violet sur desktop au lieu de la pilule blanche.
  - Création de cours : bouton rond suivi d'un texte au lieu de la pilule blanche.
- Variante Retour, règle d'usage : le bouton remonte d'un niveau dans l'arborescence des pages ; il n'apparaît pas sur une page de niveau 0, atteinte depuis la navigation principale (tab bar sur mobile, barre de navigation sur desktop) ; il n'a donc pas d'état désactivé. Côté écran : rien à faire de plus que l'entrée précédente.
- Comportement de la Modale de confirmation : le bouton qui confirme nomme le verbe et l'objet de l'action ; à l'ouverture, le focus va sur Annuler ; Tab reste dans la modale ; Échap la ferme. Côté écran, à mettre en conformité :
  - Composant `ModaleConfirmation` : ni focus sur Annuler à l'ouverture, ni maintien du focus dans la modale.
  - Libellés sans objet : « Supprimer » (Supprimer ce cours, Supprimer ce groupe, Supprimer la question ou l'étape, Retirer la checklist), « Retirer » (retirer un élève), « Quitter » (quitter sans enregistrer).
- Comportement au clavier du Menu d'actions : Entrée ou Espace ouvre le menu et place le focus sur la première action ; les flèches passent d'une action à l'autre ; Échap ferme le menu et rend le focus au bouton. Tab et Maj+Tab ne passent pas d’une action à l’autre ; depuis une action, ils ferment le menu et font sortir le focus (W3C, guide des pratiques ARIA, motif Menu and Menubar, Keyboard Interaction). Précision Skillo : le focus va à l’élément suivant (ou précédent) de la page. Un menu à une seule action reste admis pour l'instant. Côté écran, à mettre en conformité : composant `MenuActions` (pas de focus à l'ouverture, pas de flèches, focus non rendu au bouton).
- Composant Conteneur de page : toute page de l'app s'y place, y compris une page hors navigation ; marges de page fournies par `.espace-contenu` (complété sur desktop par `.espace-page-etroit`), écart entre les blocs par `.espace-page` ; fichier à réutiliser, `src/styles/espace-layout.css`. Marges d'une page hors navigation : à trancher, aucun élément partagé ne les fournit. Une page ne redéfinit pas l'écart entre ses blocs.
- Rôles d'espacement (`espacements.md`, section 6), chacun renvoyant à un palier existant :
  - écart entre deux blocs consécutifs d'une page, bouton Retour compris : `--espace-20` ;
  - ligne de liste : padding vertical de chaque ligne `--espace-12`, écart entre les éléments d'une ligne (vignette, texte, statut, chevron) `--espace-12`, écart entre le titre et le sous-titre d'une ligne `--espace-4` ;
  - bouton Retour : padding horizontal `--espace-12` côté chevron et `--espace-20` côté libellé, écart entre le chevron et le libellé `--espace-6`.
- Séparateur : épaisseur 1 px (était « À trancher »).
- Variante Retour du Bouton : chevron de 18 px ; taille et graisse du libellé restent à trancher (typographie hors itération).

**Modifié**

- Survol et appui des cartes et lignes cliquables (celles de la section Chevrons) en `fond-accent`. Côté écran, à mettre en conformité (seul le titre passe en `texte-accent` au survol, aucun retour à l'appui) :
  - Mode terrain et résultats de recherche de la page Cours (`LigneCours`).
  - « De ton formateur » de la page Cours (`BlocFormateur`).
  - Lignes du Détail d'un thème.
- Focus clavier de tous les boutons : contour de 2 px à l'extérieur du bouton, `bordure-focus`, visible au clavier seulement. Côté écran, à mettre en conformité (contour de focus retiré quand l'élément est sélectionné) :
  - Quiz de cours et quiz flash : réponse déjà sélectionnée.
  - Parcours d'entrée : ligne de choix sélectionnée.
- Critère de choix entre principal, secondaire et lien texte (secondaire seulement sur la même rangée que le principal, pour l'autre issue de la même décision ; lien texte pour une action à part). Côté écran, à mettre en conformité (« Annuler » en lien texte) :
  - Modale de confirmation (Création de cours, Détail cours, Détail groupe).
  - Barre d'enregistrement de Création de cours.

- Modale : composant partagé des deux espaces, déplacé de `src/components/formateur/Modale.jsx` vers `src/components/Modale.jsx`, styles dans `src/components/Modale.css` (classes `modale-*` au lieu de `fm-*`) ; ombre `--ombre-flottante`, comme le veut la règle des ombres. Côté écran : importer `Modale` et `ModaleConfirmation` depuis `src/components/Modale.jsx` (fait pour Création de cours, Détail cours, Détail groupe, Nouveau groupe).

**Corrigé**

Aucune entrée.

**Déprécié**

Aucune entrée.

**Retiré**

- `src/components/formateur/Modale.jsx` et les classes `fm-voile`, `fm-modale-*`, `fm-bouton-danger` de `Formateur.css`. Côté écran : utiliser `src/components/Modale.jsx`.

**Écrans corrigés**

- Modale de confirmation (Création de cours, Détail cours, Détail groupe) : « Annuler » passe de lien texte à bouton secondaire, désactivé en lavande pendant l'action.
- Barre d'enregistrement de Création de cours (desktop et mobile) : « Annuler » passe de lien texte à bouton secondaire, de même hauteur que le bouton d'enregistrement.
- Modale « Insérer une vidéo » (Création de cours) : « Annuler » passe de lien texte à bouton secondaire.
- Modale « Nouveau groupe » (Mes groupes, dashboard formateur) : « Annuler » passe de lien texte à bouton secondaire.
- Modale « Assigner des cours » (Détail groupe) et modale « Assigner à des groupes » (Détail cours) : « Annuler » passe de lien texte à bouton secondaire, désactivé en lavande pendant l'enregistrement.
- Quiz de cours et quiz flash : une réponse déjà sélectionnée garde le contour de focus clavier (2 px à l'extérieur, `bordure-focus`).
- Parcours d'entrée : une ligne de choix sélectionnée garde le contour de focus clavier (2 px à l'extérieur, `bordure-focus`).
- Conteneur de page (`.espace-page`, `src/styles/espace-layout.css`) : les 12 px ajoutés sous le premier bloc sont retirés, l'écart entre deux blocs vaut 20 px partout, comme le veut le rôle « écart entre deux blocs consécutifs d'une page ». Seul rendu modifié : l'extrait du Design System (`/design-system`), entre l'en-tête et la première section ; les autres pages annulaient déjà ces 12 px ou n'ont qu'un bloc (états de chargement et d'erreur du dashboard apprenant).
- Bouton principal désactivé (style commun `.bouton-primaire:disabled`) : fond `fond-action-desactive` et texte `texte-action-desactive` au lieu d'une opacité de 0,6. Écran dont le rendu change : quiz de cours et quiz flash (bouton du bas désactivé pendant l'envoi ou sans réponse choisie) ; les écrans formateur, le parcours d'entrée et la barre de Création de cours avaient déjà ce rendu.
- Bouton rouge de la Modale de confirmation désactivé pendant l'action : fond `fond-action-desactive` et texte `texte-action-desactive` au lieu d'une opacité de 0,6.
- Toutes les modales (Nouveau groupe, Assigner des cours, Assigner à des groupes, Insérer une vidéo, confirmations) : ombre `--ombre-flottante`, comme le veut la règle des ombres.
- Modale de confirmation (Création de cours, Détail cours, Détail groupe) : à l'ouverture, le focus va sur « Annuler » ; Tab reste dans la modale. Le libellé du bouton qui confirme n'a plus de valeur par défaut et nomme le verbe et l'objet : « Supprimer le cours », « Supprimer le groupe », « Retirer l'élève », « Supprimer la question », « Supprimer l'étape », « Retirer la checklist », « Quitter sans enregistrer ».
- Menu d'actions « … » (Création de cours, Détail cours, Détail groupe) : Entrée ou Espace sur le bouton ouvre le menu et place le focus sur la première action ; les flèches passent d'une action à l'autre ; Échap ferme le menu et rend le focus au bouton ; Tab et Maj+Tab ne passent plus d'une action à l'autre : depuis une action, ils ferment le menu et placent le focus sur l'élément suivant (ou précédent) de la page.
- Modale (bouton « Fermer », boutons d'action) et Menu d'actions (bouton « … », actions) : focus clavier en contour de 2 px à l'extérieur, `bordure-focus`, au lieu du contour natif du navigateur.
- Boutons principal et secondaire, partout (style commun `.bouton-primaire` et `.bouton-secondaire` de `shared.css`) : focus clavier en contour de 2 px à l'extérieur, `bordure-focus`, au lieu du contour natif du navigateur. La règle locale de la Modale pour ces boutons est retirée, devenue redondante. Écrans dont le rendu change : parcours d'entrée (Introduction, Connexion, questions et Création du compte), Mot de passe oublié, Nouveau mot de passe, dashboard apprenant, fiche de cours (leçon, quiz et quiz flash, fin de quiz, checklist, récap), dashboard formateur, dashboard admin, Mes cours, Mes groupes, Détail cours, Détail groupe, modales, page /design-system. Création de cours avait déjà ce rendu (règle sur tous ses boutons).

## 2.1.0 (brouillon, non publiée)

Applique la correction 1.0.1 sur `bordure-controle` et sépare les contours qui n'ont pas d'exigence de contraste.

**Ajouté**

- Primitif `ardoise-450` (#847d97, L* 53,8). Côté écran : rien à faire.
- `bordure-etape` (`sable-150` en apprenant, `ardoise-175` en formateur) : contour d'une pastille d'étape à venir ou passée, non interactive. Côté écran : une pastille d'étape utilise `bordure-etape`, jamais `bordure-controle` (déjà fait pour le repère d'étapes et la checklist).
- `bordure-action-desactive` (mêmes valeurs) : contour d'une action désactivée, avec `texte-action-desactive`. Côté écran : déjà fait pour `.bouton-ajouter:disabled`.
- Rôle `etape` dans la liste fermée des rôles de `docs/tokens/couleurs.md`, pour `bordure-etape`. Côté écran : rien à faire.
- Règle des ombres : deux ombres, `--ombre-flottante` pour les éléments flottants (menus, listes déroulantes, toast, modales), ombre d'illustration pour les objets 3D qui débordent d'une carte. Pas de token. Côté écran : rien à faire.
- Règle « Un seul bouton orange par écran » (évolution mineure). Vérifiée sur toutes les situations du dashboard apprenant, mobile et desktop : aucun écran n'en affiche deux aujourd'hui. Côté écran : rien à faire.
- Composants Modale, Modale de confirmation et Menu d'actions documentés dans `ds-principes-composants.md` (évolution mineure), rédigés depuis le code existant (`src/components/formateur/Modale.jsx`, `MenuActions.jsx`) et le principe 3 ; ce que le code ne tranche pas est marqué « À trancher ». Sans changement de rendu. Côté écran : rien à faire.

**Modifié**

- `bordure-controle` devient commun aux deux modes : retiré des fichiers de mode, déclaré dans `semantiques-communs`. Côté écran : rien à faire.
- Règle des pastilles de statut (applique la décision 1.1.0, règle dans `ds-principes-composants.md`) : un cours pas encore ouvert s'affiche en pilule (Non commencé et À faire en `texte-secondaire` sur `fond-neutre`, Nouveau en `texte-accent` sur `fond-accent`) ; un cours déjà ouvert s'affiche sans pilule, en texte avec une icône (En cours en `texte-accent` avec l'icône de progression, Terminé en `texte-succes` avec la coche). Aucune pastille n'utilise `fond-action`, `fond-marque` ni `fond-recompense`. Côté écran : rien à faire, `StatutBadge` porte la règle ; un statut de cours s'affiche toujours avec `StatutBadge` (fait pour l'Activité récente du dashboard formateur, le score « Quiz N % » restant à côté, hors du composant).
- Règles remontées dans la documentation (`ds-principes-composants.md`) depuis `regles-agent.md`, sans changement : typographie, ponctuation, survol et tactile, toast de complétion, texte de l'onglet inactif de la navigation, texte de l'option sélectionnée d'une liste déroulante, tokens de texte des deux variantes du logo. Sans changement de rendu. Côté écran : rien à faire.
- Règle des séparateurs précisée (évolution mineure) : Dans une liste disposée en plusieurs colonnes, le dernier élément de chaque colonne n'a pas de séparateur. Sans changement de rendu. Côté écran : rien à faire.
- Description de `bordure-separateur` complétée avec la même phrase (valeur inchangée). Côté écran : rien à faire.
- Conduite de l'agent (`regles-agent.md`, section 7, évolution mineure) : quand une information manque (un état, une valeur, un détail), l'agent n'écrit rien à cet endroit, laisse un commentaire EN ATTENTE et propose l'option la plus proche dans son rapport, sans l'appliquer. Côté écran : rien à faire.

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
