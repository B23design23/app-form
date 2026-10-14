# Lot : fiche de cours en parcours guidé

Maquettes de référence : canvas « Skillo, 3 directions », rangée « Fiche de cours · parcours guidé » (écrans 1 à 5 et leçon desktop). Les tokens et composants existants (couleurs, Urbanist, pastilles de statut, boutons pilule, objets 3D via `imageTheme(categorie)`) restent la base. Pas de nouvelle couleur.

## 1. Principe

La fiche de cours n'est plus une page à onglets libres. C'est un parcours en étapes : Leçon, puis Quiz, puis Checklist, avec un écran de fin de quiz entre les deux dernières.

- Supprimer les onglets Leçon / Quiz / Checklist actuels.
- Le nombre d'étapes dépend du contenu du cours : leçon + quiz + checklist (3 étapes), leçon + quiz (2), leçon + checklist (2). Le repère d'étapes et les boutons « étape suivante » s'adaptent.
- Pas de tab bar pendant la fiche de cours (leçon, quiz, fin de quiz, checklist). Retour par le bouton en haut.

### Points d'entrée

- Depuis Cours, le dashboard ou un thème : on arrive sur la première étape non terminée du cours (leçon si rien n'est fait).
- Depuis Mode terrain : on arrive directement sur la checklist, sans passer par la leçon ni le quiz.
- Cours entièrement terminé : on arrive sur l'écran récap (section 7).

## 2. Composant « repère d'étapes »

Nouveau composant réutilisé sur la leçon et la checklist (pas sur le quiz ni la fin de quiz).

- Carte blanche, rayon 22 px. Les étapes sont réparties en colonnes égales, chacune avec une pastille ronde de 28 px au-dessus d'un libellé de 14 px. Une ligne de 3 px relie les pastilles en arrière-plan (`#EFE9E0`, ou violet `#5B3FE0` entre deux étapes faites).
- Étape en cours : pastille violette pleine avec son numéro en blanc, halo de 4 px lavande autour, libellé encre en 800. `aria-current="step"`.
- Étape faite : pastille violette pleine avec une coche blanche, libellé violet texte `#4A2FD0` souligné. C'est un lien vers l'étape. Pour le quiz fait, le libellé affiche le score : « Quiz · 4/5 ».
- Étape à venir : pastille blanche, contour 2 px `#D9D2C6`, numéro et libellé en texte secondaire `#5C566E`. Non cliquable.

## 3. Écran Leçon

- Bouton retour en pilule blanche, libellé = nom court du thème.
- En-tête lavande (même bloc que le détail d'un thème) : objet 3D du thème à l'intérieur du cadre en haut à droite, nom complet du thème en violet texte 13 px, titre du cours 28 px mobile / 32 px desktop, temps de lecture (« 4 min de lecture », calculé sur la base de 200 mots par minute, arrondi à la minute supérieure). Le repère d'étapes est posé dans ce bloc, sur toute sa largeur.
- Contenu dans une carte blanche, rayon 28 px : corps 17 px mobile / 18 px desktop, interligne 1,55, intertitres H2 21 px / 24 px en 800. Images en rayon 20 px.
- Desktop : colonne centrée de 800 px de large maximum, barre de navigation encre en haut conservée.
- Encadré « À retenir » (voir section 8) placé en fin de leçon s'il est rempli.
- En bas, après la leçon : carte encre rayon 28 px avec « Étape suivante » (13 px, `#D3CEE3`), un titre (« Vérifie ce que tu as retenu » si l'étape suivante est le quiz, « Passe à la pratique » si c'est la checklist), une ligne de détail (« 5 questions · +20 XP » ou « 7 étapes · +15 XP »), et un bouton blanc pleine largeur avec flèche (« Passer au quiz » ou « Passer à la checklist »). Pas de barre fixe en bas d'écran.
- Ouvrir la leçon la marque comme lue (comportement actuel conservé).

## 4. Écran Quiz

Mode concentré, sans en-tête lavande ni repère d'étapes.

- En haut : bouton rond blanc 46 px avec une croix (« Quitter le quiz », retourne à la leçon), barre de progression (fond blanc, remplissage violet, rayon pilule, 10 px de haut), compteur « 3 / 5 » en 800.
- Carte blanche rayon 30 px : nom court du cours en violet texte 13 px, puis la question en 24 px, graisse 800, interligne 1,15.
- Réponses : rayon 20 px, hauteur minimale 56 px, fond crème `#F5EEE4` avant validation. Réponse sélectionnée : contour 2 px violet.
- Bouton « Valider ma réponse » violet pleine largeur en bas, désactivé tant que rien n'est sélectionné.

### Après validation

Chaque réponse prend un statut, jamais porté par la couleur seule :

- Réponse choisie et fausse : fond `#FDE3E1`, contour 2 px `#B4232A`, pastille à droite rouge `#B4232A` avec icône croix et texte blanc « Ta réponse ».
- Bonne réponse : fond `#DFF3E7`, contour 2 px `#17663F`, pastille verte `#17663F` avec icône coche et texte blanc « Bonne réponse ». Si l'apprenant l'a choisie, la pastille dit « Ta réponse » avec la coche.
- Autres réponses : fond crème, texte en texte secondaire, sans pastille.
- Pour les questions à réponses multiples, appliquer la même logique à chaque réponse.

Sous la carte, un bloc encre `#1E1A33`, rayon 30 px, avec l'objet 3D du thème qui déborde de 30 px au-dessus du coin supérieur droit :
- Réponse fausse : titre « Raté, mais tu vas retenir ça » en orange `#F6A55E`, 20 px, 800. Texte = le champ `explication` de la réponse choisie, en `#E6E3EC` 15 px. Lien orange « Revoir la leçon » qui ouvre la leçon du cours, puis permet de revenir au quiz à la même question.
- Réponse juste : titre « Bien vu » en orange. Texte = explication de la bonne réponse si elle existe, sinon le bloc affiche seulement le titre. Objet 3D : la cible (Bullseye) au lieu de l'objet du thème.

Le bouton du bas devient « Question suivante » (violet, pleine largeur, 58 px), puis « Voir mon score » à la dernière question.

## 5. Écran Fin de quiz

Remplace l'écran actuel et le toast jaune. C'est un écran complet.

- Fond lavande `#E4DEFF`. Confettis en haut d'écran (petits rectangles et ronds orange, violet, encre, blanc), lancés à l'arrivée selon le score comme aujourd'hui.
- Petit libellé « Quiz terminé · [nom court du cours] » en violet texte.
- Grand anneau de score de 168 px (piste blanche, arc violet, trait 16 px) avec au centre « 4/5 » en 48 px 800 et « 80 % » dessous.
- Titre 30 px selon le score : 100 % « Sans faute ! », 60 % et plus « Belle maîtrise ! », moins de 60 % « Tu y es presque ». Sous-titre 15 px : nombre d'erreurs et sujet de la première erreur si possible (« Une seule erreur, sur le rôle du compresseur. »), sinon « X erreurs à revoir ».
- Pastille orange `#F6A55E`, texte encre, avec l'objet éclair (High voltage) et « +20 XP ».
- Si un badge est débloqué par ce quiz : carte encre rayon 30 px, objet 3D du badge à gauche qui déborde au-dessus du cadre (environ 116 px), pastille orange « Nouveau badge », nom du badge en 22 px, condition en 14 px. Plusieurs badges débloqués : afficher les cartes l'une sous l'autre. Aucun badge : pas de carte.
- En bas : bouton violet pleine largeur vers l'étape suivante (« Passer à la checklist », ou « Terminer le cours » s'il n'y a pas de checklist), puis lien « Revoir mes erreurs » qui affiche les questions ratées avec leur correction.
- Score inférieur à 50 % : pas de confettis, bouton principal « Refaire le quiz », l'étape suivante passe en lien secondaire. L'XP reste attribué selon la règle actuelle.

### Animation

Dans cet ordre, environ 1,5 s au total : l'anneau se remplit de 0 au score pendant que le chiffre central compte, puis les confettis, puis la pastille XP apparaît avec un léger rebond, puis la carte badge glisse depuis le bas. Respecter `prefers-reduced-motion` : tout s'affiche directement, sans confettis.

## 6. Écran Checklist

- En-tête compact : bouton rond retour 44 px, nom complet du thème en violet texte 12 px, titre du cours en 15 px 800 tronqué sur une ligne.
- Repère d'étapes sous l'en-tête, dans sa carte blanche. Leçon et Quiz faits sont des liens pour les revoir. Arrivée depuis Mode terrain avec leçon ou quiz non faits : ces étapes s'affichent à venir mais restent cliquables (exception pour cet accès direct).
- Carte blanche rayon 28 px : « 3 étapes sur 7 » en 20 px 800, « +15 XP à la fin » à droite, barre de progression violette de 8 px.
- Liste des étapes, mode case à cocher :
  - Étape faite : pastille violette pleine 28 px avec coche blanche, intitulé en texte secondaire. Le numéro et la case actuels fusionnent dans cette pastille.
  - Étape en cours : bloc crème rayon 22 px qui déborde légèrement de la liste, pastille blanche à contour violet avec le numéro, intitulé 17 px 800, pastille « Bloquante » (rouge sur `#FDE3E1`) si l'étape est bloquante, critère de validation en 14 px, bouton violet pleine largeur « Valider l'étape ».
  - Étapes suivantes : pastille contour `#D9D2C6` avec le numéro, intitulé en texte secondaire, non interactives.
- Mode remise en ordre : garder la mécanique actuelle, appliquer seulement l'en-tête compact, le repère d'étapes, la carte et les rayons. Il sera maquetté plus tard.
- Checklist terminée : écran récap (section 7) avec la checklist cochée, plus le toast de complétion actuel pour les XP.

## 7. Écran Récap (cours terminé)

- Bouton retour thème + en-tête lavande comme la leçon, sans repère d'étapes. À la place : « Terminé » (coche et texte `#17663F`, sans fond) et « [X] XP gagnés » avec l'éclair.
- Carte blanche avec une ligne par partie, séparées par `#EFE9E0` :
  - Leçon · « 4 min de lecture » · bouton contour violet « Relire »
  - Quiz · « Meilleur score : 4/5 » · bouton contour violet « Refaire »
  - Checklist · « 7 étapes validées » · bouton contour violet « Revoir »
  N'afficher que les parties que le cours contient.
- Carte violette « Suite du thème » avec le prochain cours non terminé du même thème (ordre pédagogique), son contenu (« Leçon · Quiz · Checklist ») et un bouton blanc inversé « Commencer ». Thème terminé : carte masquée.
- Refaire le quiz depuis le récap ne retire rien : on garde le meilleur score, l'XP n'est pas redonné.

## 8. Encadré « À retenir » (nouveau champ)

- Migration : ajouter sur `cours` une colonne texte nullable `a_retenir`. Un point par ligne.
- Affichage en fin de leçon : bloc lavande `#E4DEFF` rayon 24 px, pastille ronde violette 32 px avec une icône ampoule blanche, titre « À retenir » 17 px 800, puis liste à puces 16 px 600 (une puce par ligne du champ). Champ vide : bloc masqué.
- Création et édition de cours (formateur) : champ multiligne « À retenir » sous le contenu de la leçon, avec l'aide « Un point par ligne, 3 à 5 points conseillés ».
- Remplir le champ pour le cours « Le split mural : fonctionnement et installation » avec ces 3 lignes, pour les captures :
  - Deux unités, reliées par des liaisons frigorifiques.
  - Le fluide s'évapore dedans, se condense dehors.
  - Le compresseur fait varier la pression du fluide.

## 9. À vérifier en passant

- Sur la leçon actuelle, un bloc gris avec un contour bleu vif apparaît en bas du split mural (image qui ne charge pas, ou reste de l'ancien style). Corriger la cause.
- Bug relevé dans l'audit : sur le détail d'un cours côté formateur, l'image de la leçon s'affiche en Markdown brut. Vérifier s'il est toujours présent et le corriger.

Mets à jour CLAUDE.md avec ce parcours (étapes, points d'entrée, règles de la fin de quiz, champ `a_retenir`). Ne commite pas.
