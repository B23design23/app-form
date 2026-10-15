# Dashboard formateur : états de démarrage et fil d'activité

Corrections vues sur capture après lot-dashboard-formateur-suite.md.

## 1. Aiguillage « Pour bien démarrer »

Constat : un formateur qui a un groupe avec 2 élèves mais aucun cours assigné voit le dashboard normal, avec « Personne à relancer, tous tes élèves ont commencé les cours assignés ». C'est faux : rien n'est assigné.

Nouvelle règle : le formateur voit « Pour bien démarrer » tant qu'aucun cours n'est assigné à un groupe qui compte au moins un élève. Dès qu'il existe au moins un couple (cours assigné via `cours_groupes`, groupe avec au moins un membre), il voit le dashboard normal.

Les 3 étapes deviennent :
1. **Crée ton premier cours** : faite dès qu'il a au moins un cours. Bouton « Créer un cours ».
2. **Crée un groupe et ajoute tes élèves** : faite dès qu'un de ses groupes a au moins un élève. Sous-titre : « Une promo, une classe, une équipe. Tes élèves s'ajoutent par leur email. » Bouton « Créer un groupe » s'il n'a aucun groupe, sinon « Ajouter des élèves » qui ouvre le Détail du groupe (le plus récent).
3. **Assigne un cours à ton groupe** : faite dès que la règle ci-dessus est remplie. Sous-titre : « Tes élèves le verront dans « De ton formateur ». » Bouton « Assigner un cours » qui ouvre le Détail du groupe qui a des élèves (le plus récent). Bouton désactivé (lavande, texte `#3B3550`) tant que les étapes 1 et 2 ne sont pas faites.

Étape faite : la pastille numéro devient une pastille verte avec coche (`#17663F` sur `#DFF3E7`), le titre reste en encre, le sous-titre et le bouton disparaissent. Le compteur « X étape sur 3 » et la barre suivent (barre violette).

Texte du bas inchangé.

## 2. En-tête dans l'état « Pour bien démarrer »

Retire les boutons « + Nouveau groupe » et « + Nouveau cours » de l'en-tête dans cet état : ils font doublon avec les boutons des étapes. Garde « Bonjour {prénom} » et « Bienvenue sur Skillo ». Dans le dashboard normal, rien ne change.

## 3. Intertitres du fil d'activité

Aujourd'hui, chaque jour a son intertitre relatif (« Il y a 34 jours », « Il y a 35 jours »…), illisible dès que l'activité est ancienne.

Nouveaux intertitres : « Aujourd'hui », « Hier », puis la date courte sans année (« 11 sept. », « 3 oct. »). Avec l'année seulement si elle diffère de l'année en cours (« 28 déc. 2025 »). Format français, mois abrégé.

« Actif il y a N jours » sur les cartes de groupe et « Il y a N jours » dans « Élèves à relancer » ne changent pas : là, la durée est l'information utile.

## 4. Navigation du compte admin

Le compte officiel n'a pas de groupe. Masque l'entrée « Groupes » de sa navigation (barre du haut et tab bar), qui garde alors 3 entrées : Dashboard, Cours, Menu. Les 3 entrées se répartissent la largeur de la tab bar mobile. Si l'admin ouvre l'URL des groupes à la main, renvoie-le vers son dashboard.

## 5. Lien « Voir les N autres » dans « Élèves à relancer » (desktop)

Sur desktop, la carte s'étire à la hauteur de la colonne de gauche et laisse un espace vide sous la dernière ligne. Le lien « Voir les N autres » est centré verticalement dans cet espace restant (entre le bas de la dernière ligne et le bas de la carte), toujours centré horizontalement. Les lignes restent en haut de la carte. Garde au moins 16 px au-dessus du lien même quand il n'y a presque pas d'espace libre. Mobile inchangé : le lien reste juste sous la dernière ligne.

## 6. CLAUDE.md

Mets à jour l'aiguillage, les étapes de « Pour bien démarrer », le format des intertitres et la navigation admin.

## Fin

Liste ce que tu as changé. Ne commite pas.
