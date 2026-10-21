Gouvernance du Design System de Skillo

Version actuelle 1.1.0. Mainteneur et seul décideur, Benjamin Berthelot. Projet personnel, sans équipe ni utilisateurs mesurés. Mise à jour le 21/10/2026.

1. Numérotation
Majeure. Un token ou un composant est retiré ou renommé, ou un comportement change au point qu'un écran conforme ne l'est plus. Exemple sur Skillo, pas encore de cas.
Mineure. On ajoute un élément, ou on change le rendu d'un élément existant sans obliger à modifier les écrans qui l'utilisent. Exemple, la nouvelle pastille En cours (1.1.0).
Correctif. Le système ne respectait pas une règle ou une contrainte qu'il s'était donnée. On corrige la valeur, la règle ne change pas. Exemple, le contour des contrôles remonté au-dessus de 3:1 (1.0.1).
Point de départ. 1.0.0 correspond à l'état du 20/10/2026, après les tokens et les principes.
2. Dépréciation
Un élément déprécié porte trois informations dans les tokens et la doc. Son remplaçant, la raison et la version de rins une version mineure, puis il disparaît à la version majeure suivante.
Exception sur Skillo. Je contrôle seul tout le code, aucun autre produit ni agent ne garde une ancienne version des règles. Je supprime donc directement, dans la même version, et je l'écris dans la note. Avec plusieurs équipes ou des agents qui lisent des règles en cache, la règle normale s'applique.
3. Notes de version
Chaque note donne le numéro, la date et cinq rubriques. Ajouté, Modifié, Corrigé, Déprécié, Retiré.
Chaque ligne dit quoi faire côté écran, ou « rien à faire ».
Lecteurs. Moi, et Claude Code qui génère les écrans.
Emplacement. docs/design-system/notes-de-version.md.
4. Exceptions
Une demande nomme l'écran, la règle concernée, ce que le système propose déjà et pourquoi ça ne suffit pas.
Acceptée si une contrainte technique ou d'accessibilité empêche d'appliquer la lettre de la règle, si la solution respecte l'intention de la règle et si elle reste limitée à un endroit nommé.
Refuen ou composant existant), si la demande relève de la préférence, ou si elle prend un style réservé pour un autre usage.
Une exception devient une évolution de la règle dès que le même besoin apparaît à un deuxième endroit. On revoit la règle au lieu de cumuler les exceptions.
5. Registre
Date    Cas    Type    Décision    Critère appliqué    Version    La règle évolue ?
20/10/2026    Contour des contrôles à 1,5:1 sur blanc    Correction    Nouvelle valeur au-dessus de 3:1    Contrainte WCAG 1.4.11 que le système s'était donnée    1.0.1    Non
20/10/2026    Pastille En cours en pilule violette pleine, lue comme un bouton    Évolution    Nouveau rendu sans fond violet plein    Un style réservé garde son sens (violet plein = action)    1.1.0    Oui, règle des pastilles
20/10/2026    Pastille Nouveau en orange    Évolution    Orange retiré    Orange réservé à la récompense, Nouveau n'en est pas une    1.1.0    Oui, règle des pastilles
20/10/2026    Ombre intérieure pour neutraliser l'autoremplissage du champ    Exception    Acceptée    Contrainte technique pas d'ombre visible, contraste par le fond), un seul endroit    1.0.0    Non
21/10/2026    Cas fictif. Bouton orange pour « Valider l'étape »    Exception    Refusée    Le bouton principal existe déjà, la récompense arrive en fin de checklist, l'orange est réservé    aucune    Non
