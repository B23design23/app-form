# Lot : dashboard formateur (refonte) et dashboard admin

À appliquer après `lot-formateur-retouches.md`. Le dashboard formateur change de structure : les cartes chiffres violettes et la carte « Actions rapides » disparaissent. Le dashboard du compte admin devient un écran à part.

Tokens habituels (CLAUDE.md) : fond `#F4F4F6`, cartes blanches sans bordure (rayon 28 px), champs et blocs internes `#F4F4F6`, encre `#1E1A33`, texte secondaire `#5C566E`, violet `#5B3FE0`, violet texte `#4A2FD0`, lavande `#E4DEFF`, erreur `#B4232A` sur `#FDE3E1`, succès `#17663F` sur `#DFF3E7`, séparateur `#ECECF0`.

Le conteneur de page reste celui du dashboard actuel (même largeur que la barre de navigation).

Trois cas à gérer, dans cet ordre de priorité :
1. compte `est_admin` → dashboard admin (point 7) ;
2. formateur sans aucun élève dans ses groupes → premiers pas (point 6) ;
3. sinon → dashboard formateur (points 1 à 5).

## 1. En-tête

- À gauche : H1 « Bonjour {prénom} » (inchangé). Dessous, en texte secondaire 15 px gras : « 3 cours · 1 groupe · 12 élèves » (singulier/pluriel gérés). « 3 cours » est un lien vers Mes cours, « 1 groupe » vers Mes groupes, même couleur que le texte, sans soulignement (soulignement au survol seulement).
- À droite, alignés verticalement sur le bloc titre : « + Nouveau groupe » (bouton contour violet 2 px, texte violet texte) puis « + Nouveau cours » (violet plein). Hauteur 50 px. « Nouveau groupe » ouvre la modale de création de groupe, « Nouveau cours » ouvre la création de cours.
- **Supprime** les trois cartes chiffres (Cours créés, Groupes, Élèves au total) et la carte « Actions rapides ».

## 2. Mise en page (desktop)

Sous l'en-tête, une grille de deux colonnes égales, 20 px d'écart, alignées en haut :
- colonne de gauche, empilées avec 20 px d'écart : la carte **Taux de complétion moyen** (inchangée : anneau, titre, sous-titre, pastille « Bon rythme » / « À surveiller »), puis la carte **Tes groupes** (point 3) ;
- colonne de droite : la carte **Élèves à relancer** (point 4).

Puis, en pleine largeur dessous : **Activité récente** (point 5).

## 3. Carte « Tes groupes »

- Titre « Tes groupes » 20 px, à droite un lien « Tout voir » (violet texte, 14 px gras) vers Mes groupes.
- Les 3 groupes les plus récents (`created_at` décroissant). Un bloc `#F4F4F6`, rayon 20 px, cliquable vers le Détail du groupe, par groupe :
  - ligne 1 : nom du groupe 17 px gras, dessous « 12 élèves · 3 cours » en texte secondaire ; à droite, la dernière activité en texte secondaire 13 px gras, puis un chevron ;
  - ligne 2 : barre de progression fine (8 px, piste blanche, remplissage violet) + pourcentage en gras à droite. Même calcul que la carte de Mes groupes.
- **Dernière activité** : la date la plus récente de mise à jour d'une ligne `progression` d'un élève du groupe, sur un cours assigné au groupe. Libellés : « Actif aujourd'hui », « Actif hier », « Actif il y a N jours », « Pas encore d'activité ». Vérifie que `progression` a bien une colonne de date de mise à jour ; si non, dis-le-moi avant d'en ajouter une.
- **Pas de pastille « N élèves à relancer » ici** : cette info est déjà dans le bloc d'à côté. Elle reste sur la page Mes groupes.
- Sous les blocs, en texte secondaire 13 px, seulement s'il y a plus de 3 groupes : « Les 3 groupes les plus récents. Le reste est dans Groupes. »

## 4. Carte « Élèves à relancer »

- Même règle de sélection qu'aujourd'hui, même rendu de ligne (bloc `#F4F4F6`, rayon 20 px, « **Manon** n'a pas commencé **Sécurité électrique avancée** », « Il y a 41 jours » en rouge erreur, bouton d'envoi violet).
- 3 lignes maximum. S'il y en a plus : lien centré « Voir les N autres » (violet texte, gras, sans soulignement) qui déplie la liste complète dans la carte.
- Le bouton d'envoi appelle la fonction « Relancer par email » créée dans le lot précédent.
- **État vide** (personne à relancer) : le titre reste. Dessous, un encadré succès `#DFF3E7` (rayon 20 px, padding 16 px 18 px) : à gauche un rond blanc de 44 px avec une coche verte `#17663F`, à droite « Personne à relancer » (16 px gras, `#17663F`) et dessous « Tous tes élèves ont commencé les cours assignés. » (14 px, encre). Ça remplace « Aucun élève à relancer pour le moment. ».

## 5. Activité récente

On remplace la grille de deux colonnes par un fil chronologique sur une colonne.

**En-tête de la carte**, sur une seule ligne :
- à gauche, « Activité récente » 22 px ;
- à droite, trois pastilles de filtre « Tout », « Commencés », « Terminés » (hauteur 40 px ; active : fond encre, texte blanc ; inactives : `#F4F4F6`), puis un petit champ de recherche `#F4F4F6` de 220 px avec une loupe, placeholder « Un élève » (recherche sur prénom et nom).
- **Supprime** les libellés au-dessus des champs, la liste « Statut » (remplacée par les pastilles) et la liste « Trier par » (le fil est toujours du plus récent au plus ancien).

**Groupement par date** : un intertitre avant chaque groupe de lignes, 13 px gras, texte secondaire : « Aujourd'hui », « Hier », « Il y a N jours ». La date ne s'affiche plus au bout de chaque ligne.

**Une ligne** (toute la ligne est un lien vers le Détail du groupe de l'élève), grille de 5 colonnes : 
1. rond lavande de 40 px avec les initiales de l'élève (prénom + nom, une seule lettre si pas de nom) ;
2. le texte, 15 px : « **Prénom Nom** a terminé / a commencé / a repris **Titre du cours** ». Nom complet obligatoire : il y a deux « Ben » dans Promo A et on ne les distingue pas ;
3. pastille du groupe (fond `#F4F4F6`, texte `#3B3550`, 12 px gras) ;
4. le statut : terminé → coche + « Quiz 90 % » en succès (meilleur score de l'élève sur ce cours, ou « Terminé » s'il n'y a pas de score) ; commencé → point violet + « En cours » en violet texte ;
5. chevron gris.
Lignes séparées par `#ECECF0`.

**Doublons** : aujourd'hui « Ben a commencé Le split mural » apparaît deux fois (hier et il y a 30 jours). Regarde d'où ça vient et dis-le-moi :
- si ce sont deux événements réels (l'élève a recommencé un cours terminé), le plus récent s'affiche « a repris » ;
- si c'est un doublon de requête ou de données, on ne garde que l'événement le plus récent par élève et par cours.

« Voir plus » en bas, centré, inchangé (charge les événements suivants). État vide : « Pas encore d'activité. » en texte secondaire.

## 6. Premiers pas (formateur sans élève)

Condition : formateur non admin, et aucun élève dans aucun de ses groupes.

- En-tête : H1 inchangé, sous-titre remplacé par « Bienvenue sur Skillo ». Les deux boutons de l'en-tête restent.
- À la place de tout le reste (complétion, groupes, relances, activité) : une seule carte blanche « Pour bien démarrer » (rayon 30 px, padding 28 px) :
  - titre 24 px, à droite « 1 étape sur 3 » en texte secondaire ;
  - barre de progression fine (8 px) ;
  - une liste numérotée de 3 étapes, chacune dans un bloc `#F4F4F6` (rayon 22 px) : rond de 40 px (blanc avec le numéro ; vert succès avec une coche blanche quand l'étape est faite), titre 17 px gras, sous-titre 14 px secondaire, action à droite.
    1. « Crée ton premier cours » · « Une leçon, un quiz, et si tu veux une checklist terrain. » · bouton « Créer un cours » ;
    2. « Crée un groupe » · « Une promo, une classe, une équipe. » · bouton « Créer un groupe » ;
    3. « Ajoute tes élèves » · « Par leur email. Ils voient tes cours dans « De ton formateur ». » · bouton « Ajouter des élèves » (ouvre le Détail du groupe le plus récent). Désactivé (lavande, texte `#3B3550`) tant qu'il n'y a pas de groupe.
  - Étape faite : titre barré en texte secondaire, « Fait » en vert à la place du bouton. Le bouton violet plein va seulement sur la première étape non faite ; les autres étapes non faites ont un bouton contour.
  - Sous la liste, en texte secondaire 14 px : « Le suivi de tes élèves (avancement, relances, activité) apparaîtra ici dès qu'ils auront commencé. »
- Dès qu'un élève est ajouté à un groupe, on passe au dashboard normal.

## 7. Dashboard admin (`est_admin`)

L'admin publie des cours publics et n'a jamais de groupe : rien de ce qui concerne les groupes ne s'affiche.

- **En-tête** : H1 « Bonjour {prénom} ». Dessous : pastille lavande « Compte officiel » puis « 31 cours publics » en texte secondaire. À droite, un seul bouton violet plein « + Nouveau cours ».
- **Trois chiffres**, grille de 3 cartes blanches (rayon 28 px, padding 20 px 22 px, sans bordure ni icône) : libellé 14 px secondaire, chiffre 36 px gras, précision 13 px secondaire dessous.
  - « Apprenants actifs » : nombre d'utilisateurs distincts ayant une ligne `progression` mise à jour dans les 30 derniers jours sur un cours public · « ont ouvert un cours ces 30 derniers jours » ;
  - « Cours terminés » : lignes `progression` passées à « termine » dans les 30 derniers jours, sur les cours publics · « sur les 30 derniers jours » ;
  - « Score moyen au quiz » : moyenne du meilleur score par élève et par cours, sur les cours publics · « tous cours publics confondus ».
- **Carte « Cours les plus suivis »** : titre 20 px, lien « Tous les cours » à droite (vers Mes cours). Tableau des 5 cours publics qui ont le plus de lignes `progression` : colonne Cours (titre en gras, thème court en texte secondaire dessous), Commencés, Terminés, Score moyen. Lignes séparées par `#ECECF0`, en-tête 13 px secondaire sans fond.
- **Aucun nom d'élève** sur ce dashboard, uniquement des chiffres agrégés.
- Si une requête est trop lourde côté client (RLS, nombre de lignes), propose une vue ou une RPC Supabase et dis-le-moi avant de la créer.

## 8. Mobile

- En-tête : H1 34 px, sous-titre dessous, puis les deux boutons côte à côte sur toute la largeur (hauteur 46 px). Admin : « + Nouveau cours » seul, pleine largeur.
- Une seule colonne, dans cet ordre : Taux de complétion, Élèves à relancer, Tes groupes, Activité récente.
- Activité : les pastilles de filtre défilent horizontalement sous le titre, la recherche passe en pleine largeur dessous. Sur chaque ligne, le texte prend toute la largeur à côté des initiales ; la pastille du groupe et le statut passent sur une deuxième ligne sous le texte ; pas de chevron.
- Admin : les trois chiffres s'empilent ; le tableau devient une liste (titre du cours, puis « 42 commencés · 18 terminés · 81 % » en texte secondaire).
- Prévoir la marge basse pour la tab bar.

## Fin

Mets à jour le CLAUDE.md (section dashboard formateur, et nouvelle section dashboard admin). Dis-moi ce que tu as trouvé pour la colonne de date de `progression` et pour le doublon de l'activité.

Ne commite pas.
