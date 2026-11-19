Gouvernance du Design System de Skillo

Version actuelle 3.0.0. Mainteneur et seul décideur, Benjamin Berthelot. Projet personnel, sans équipe ni utilisateurs mesurés. Mise à jour le 18/11/2026.

1. Numérotation
Majeure. Un token ou un composant est retiré ou renommé, ou un comportement change au point qu'un écran conforme ne l'est plus. Exemple, le retrait des variables --color-* (2.0.0).
Mineure. On ajoute un élément, ou on change le rendu d'un élément existant sans obliger à modifier les écrans qui l'utilisent. Exemple, la nouvelle pastille En cours (1.1.0).
Correctif. Le système ne respectait pas une règle ou une contrainte qu'il s'était donnée. On corrige la valeur, la règle ne change pas. Exemple, le contour des contrôles remonté au-dessus de 3:1 (1.0.1).
Point de départ. 1.0.0 correspond à l'état du 20/10/2026, après les tokens et les principes.
Dérive. Un écran ne suit pas une règle du DS. On corrige l'écran. Une dérive corrigée ne crée pas de version et n'entre pas au registre, mais elle figure dans la note de la version suivante, sous la rubrique « Écrans corrigés ».
Type du cas    Note de version    Registre
Dérive corrigée    oui (Écrans corrigés)    non
Correction    oui    oui
Évolution    oui    oui
Exception    non    oui
2. Dépréciation
Un élément déprécié porte trois informations dans les tokens et la doc. Son remplaçant, la raison et la version de retrait.
Il reste disponible au moins une version mineure, puis il disparaît à la version majeure suivante.
Exception sur Skillo. Je contrôle seul tout le code, aucun autre produit ni agent ne garde une ancienne version des règles. Je supprime donc directement, dans la même version, et je l'écris dans la note. Avec plusieurs équipes ou des agents qui lisent des règles en cache, la règle normale s'applique.
3. Notes de version
Chaque note donne le numéro, la date et cinq rubriques. Ajouté, Modifié, Corrigé, Déprécié, Retiré. S'il y en a, une rubrique Écrans corrigés liste les dérives corrigées.
Chaque ligne dit quoi faire côté écran, ou « rien à faire ».
Lecteurs. Moi, et Claude Code qui génère les écrans.
Emplacement. docs/design-system/notes-de-version.md.
4. Exceptions
Une demande nomme l'écran, la règle concernée, ce que le système propose déjà et pourquoi ça ne suffit pas.
Acceptée si une contrainte technique ou d'accessibilité empêche d'appliquer la lettre de la règle, si la solution respecte l'intention de la règle et si elle reste limitée à un endroit nommé.
Refusée si le système a déjà une réponse (token ou composant existant), si la demande relève de la préférence, ou si elle prend un style réservé pour un autre usage.
Une exception devient une évolution de la règle dès que le même besoin apparaît à un deuxième endroit. On revoit la règle au lieu de cumuler les exceptions.
5. Registre
Date    Cas    Type    Décision    Critère appliqué    Version    La règle évolue ?    Statut
20/10/2026    Contour des contrôles à 1,5:1 sur blanc    Correction    Nouvelle valeur au-dessus de 3:1    Contrainte WCAG 1.4.11 que le système s'était donnée    1.0.1    Non    appliqué (en 3.0.0)
20/10/2026    Pastille En cours en pilule violette pleine, lue comme un bouton    Évolution    Nouveau rendu sans fond violet plein    Un style réservé garde son sens (violet plein = action)    1.1.0    Oui, règle des pastilles    appliqué (en 3.0.0)
20/10/2026    Pastille Nouveau en orange    Évolution    Orange retiré    Orange réservé à la récompense, Nouveau n'en est pas une    1.1.0    Oui, règle des pastilles    appliqué (en 3.0.0)
20/10/2026    Ombre intérieure pour neutraliser l'autoremplissage du champ    Exception    Acceptée    Contrainte technique du navigateur, intention respectée (pas d'ombre visible, contraste par le fond), un seul endroit    1.0.0    Non    appliqué
21/10/2026    Cas fictif. Bouton orange pour « Valider l'étape »    Exception    Refusée    Le bouton principal existe déjà, la récompense arrive en fin de checklist, l'orange est réservé    aucune    Non    décidé
21/10/2026    Points de pagination de l'Introduction (boutons) à environ 1,3 à 1,5:1 sur le fond de page    Évolution    À trancher plus tard    à définir    aucune    à trancher    décidé
21/10/2026    Ombre d'illustration sous les objets 3D qui débordent, utilisée à plusieurs endroits    Évolution    La règle des ombres devient : deux ombres, ombre-flottante pour les éléments flottants (menus, listes déroulantes, toast, modales), ombre d'illustration pour les objets 3D qui débordent d'une carte. Aucun écran ne change, pas de token    Une exception devient une évolution de la règle dès que le même besoin apparaît à un deuxième endroit    3.0.0    Oui, règle des ombres    appliqué (en 3.0.0)
21/10/2026    Un seul bouton orange par écran    Évolution    Règle ajoutée ; vérifié sur toutes les situations du dashboard apprenant, mobile et desktop : aucun écran n'en affiche deux    Un style réservé garde son sens (orange = récompense, réservé au lancement du quiz flash)    3.0.0    Oui, règle du bouton orange    appliqué (en 3.0.0)
21/10/2026    Couleurs venues de la 2.1.0 : contour des contrôles commun, contours sans exigence de contraste séparés    Évolution majeure    bordure-controle commun aux deux modes, sur ardoise-450 ; bordure-etape et bordure-action-desactive ajoutés    Contrainte WCAG 1.4.11 que le système s'était donnée    3.0.0    Oui, couleurs    appliqué (note 3.0.0)
22/10/2026    Composants : variante Retour, Modale et Menu d'actions, Conteneur de page, critère de choix des boutons, focus    Évolution majeure    Règles ajoutées ; Modale déplacée dans src/components/    Un comportement change au point qu'un écran conforme ne l'est plus (Numérotation, Majeure)    3.0.0    Oui, composants    appliqué (note 3.0.0)
04/11/2026    Typographie par rôles    Évolution majeure    19 rôles, échelle fermée, tokens typo-*, un seul seuil (768 px)    Un comportement change au point qu'un écran conforme ne l'est plus (Numérotation, Majeure)    3.0.0    Oui, typographie    appliqué (note 3.0.0)
11/11/2026    Espacements par rôles    Évolution majeure    14 rôles, tokens espace-<rôle>, migration en 17 lots    Un comportement change au point qu'un écran conforme ne l'est plus (Numérotation, Majeure)    3.0.0    Oui, espacements    appliqué (note 3.0.0)
11/11/2026    Rayons par rôles    Évolution majeure    5 rôles, tokens rayon-*, variables --radius-* retirées    Un comportement change au point qu'un écran conforme ne l'est plus (Numérotation, Majeure)    3.0.0    Oui, rayons    appliqué (note 3.0.0)
12/11/2026    Mise en page, formulaires, états de page    Évolution majeure    Rôles de largeur de colonne, seuil unique 768 px, haut du contenu, états de page, migration en 17 lots    Un comportement change au point qu'un écran conforme ne l'est plus (Numérotation, Majeure)    3.0.0    Oui, mise en page    appliqué (note 3.0.0)
13/11/2026    Composants et couleurs (chantier cpc, lots 0a à 7)    Évolution majeure    Catalogue de composants, une implémentation par rôle, tokens d'ombre, focus avec halo, Désactivé commun    Un comportement change au point qu'un écran conforme ne l'est plus (Numérotation, Majeure)    3.0.0    Oui, composants et couleurs    appliqué (note 3.0.0)
16/11/2026    Nettoyage (lots net 1 à 15)    Évolution majeure    Classes communes des rôles de titre, règles locales retirées, première ligne d'un état de page    Un comportement change au point qu'un écran conforme ne l'est plus (Numérotation, Majeure)    3.0.0    Oui, typographie et composants    appliqué (note 3.0.0)
18/11/2026    Libellé d'une information affichée sans être modifiable (463b7c1, a5f82ed)    Évolution mineure    Libellé en Méta, couleur texte-secondaire    On ajoute un élément sans obliger à modifier les écrans (Numérotation, Mineure)    3.0.0    Oui, typographie    appliqué (note 3.0.0)
18/11/2026    Entrée Menu de la navigation marquée active quand l'écran a été ouvert depuis le Menu (463b7c1, a5f82ed)    Évolution mineure    État de l'onglet actif sur l'entrée Menu    On ajoute un élément sans obliger à modifier les écrans (Numérotation, Mineure)    3.0.0    Oui, navigation    appliqué (note 3.0.0)
19/11/2026    Chantier Retour : nom « Retour à <libellé> » pour tout Retour, Retour dans tous les états d'une page de niveau 1 ou plus, pilule ou rond selon la rangée, ce qui n'est pas un Retour, entrée de la section d'origine active    Évolution majeure    Règles ajoutées et modifiées (fiches Bouton, Bouton rond, États de page, Navigation)    Un comportement change au point qu'un écran conforme ne l'est plus (Numérotation, Majeure) : un écran conforme à la 3.0.0 ne l'est plus (Retours ronds nommés « Retour », chargements sans Retour)    4.0.0    Oui, composants et navigation    décidé
6. Questions ouvertes
Aucune. Réglé : couleurs.md est généré depuis tokens/ (npm run tokens).
