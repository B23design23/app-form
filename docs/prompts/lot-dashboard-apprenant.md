# Lot : dashboard apprenant (refonte) et objets 3D des thèmes

Les maquettes de référence sont dans `docs/maquettes/`. Lis d'abord `docs/maquettes/README.md`. Les maquettes donnent les valeurs exactes (couleurs, rayons, espacements, tailles). Ce fichier donne les règles. En cas d'écart, suis ce fichier et signale l'écart.

Ne commite pas. À la fin, liste ce qui est fait et ce qui reste ambigu.

## Partie 1 : objets 3D des thèmes

1. Télécharge ces images 3D depuis le dépôt public `microsoft/fluentui-emoji` (licence MIT). URL de base : `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/<Dossier>/3D/<fichier>` (encoder les espaces en `%20`).

| Thème (valeur exacte de `categorie`) | Fichier à créer | Dossier source | Fichier source |
| --- | --- | --- | --- |
| Thermodynamique | thermodynamique.png | Thermometer | thermometer_3d.png |
| Fluides frigorigènes & environnement | fluides-frigorigenes.png | Droplet | droplet_3d.png |
| Cycle frigorifique & composants | cycle-frigorifique.png | Gear | gear_3d.png |
| Psychrométrie & confort | psychrometrie.png | Cloud | cloud_3d.png |
| Technologies & systèmes clim | technologies-systemes.png | Snowflake | snowflake_3d.png |
| Dimensionnement | dimensionnement.png | Triangular ruler | triangular_ruler_3d.png |
| Installation & mise en service | installation.png | Wrench | wrench_3d.png |
| Brasage & dudgeon | brasage-dudgeon.png | Nut and bolt | nut_and_bolt_3d.png |
| Entretien & maintenance | entretien-maintenance.png | Toolbox | toolbox_3d.png |
| Diagnostic & dépannage | diagnostic-depannage.png | Magnifying glass tilted left | magnifying_glass_tilted_left_3d.png |
| Réglementation & sécurité | reglementation-securite.png | Shield | shield_3d.png |
| Efficacité énergétique | efficacite-energetique.png | Light bulb | light_bulb_3d.png |

Plus l'objet du quiz flash : `quiz-flash.png` depuis `High voltage/3D/high_voltage_3d.png`.

2. Range-les dans `public/illustrations/themes/` (le quiz flash dans `public/illustrations/quiz-flash.png`). Convertis-les en WebP si un outil est disponible sans installation lourde, sinon garde les PNG.
3. Crée une fonction utilitaire qui renvoie l'image d'un cours à partir de sa `categorie` (via `src/lib/thematiques.js`). Un cours privé dont la catégorie n'est pas l'un des 12 thèmes reçoit une image par défaut : `technologies-systemes`.
4. Ajoute au README du projet : « Illustrations 3D : Fluent Emoji, Microsoft, licence MIT ».
5. Ne touche pas aux illustrations des badges et de l'onboarding : elles restent telles quelles.
6. Si le téléchargement échoue (réseau bloqué), arrête la partie 1, dis-le, et fais la partie 2 avec un emplacement vide de même taille à la place de l'objet.

## Partie 2 : dashboard apprenant

### Principe

Le dashboard ne montre plus de cartes de chiffres ni de section « Cours recommandés ». Chaque bloc pousse à une action. Supprime : la rangée de 3 cartes stats, le carrousel de badges, la carte « Bravo, tous tes cours sont terminés », la carte quiz flash lavande et la section « Cours recommandés ».

### En-tête

- À gauche : « Salut [Prénom] » (H1, 34 px mobile, 44 px desktop, graisse 800).
- À droite : l'objet éclair (26 px mobile, 30 px desktop) suivi de « [xp_total] XP » en graisse 800.

### Blocs disponibles

**A. Cours en cours** (carte violette #5B3FE0, rayon 32 px mobile, 36 px desktop). Objet 3D du thème du cours, qui déborde au-dessus du cadre en haut à droite (30 px de marge au-dessus du bloc). Anneau de progression (piste #4630B8, arc blanc) avec le pourcentage, libellé « Tu en es là » en #DCD4FF, titre du cours. Phrase d'état sous le titre : « Leçon en cours. Le quiz t'attend à la fin. » ou « Leçon lue. Reste le quiz pour finir ce cours. » selon l'avancement (adapte pour la checklist). Bouton blanc pleine largeur « Continuer le cours » avec une pastille encre et une flèche à droite. Si le cours vient du formateur, ajoute la pastille encre « De ton formateur » au-dessus du titre.

**B. Premier cours / Prochain cours conseillé** (carte blanche, rayon 28 px). Libellé violet #4A2FD0 (« Ton premier cours » ou « Prochain cours conseillé »), titre, nom du thème, bouton violet « Commencer ». Objet 3D du thème en bas à droite, contenu dans la carte. Le cours proposé est le premier cours public non commencé, dans l'ordre des thèmes puis de `cours.ordre`.

**C. Cours assigné en tête** (carte violette). Pastille encre « De ton formateur », titre du cours, « [thème] · ajouté [hier / il y a N jours] », bouton blanc « Commencer le cours ». Objet 3D du thème qui déborde comme en A.

**D. Bloc « De ton formateur »** (carte blanche). En-tête : pastille encre avec icône, titre « De ton formateur », lien « Tout voir » (vers Cours, section « Cours de mon formateur »). Une ligne par cours : vignette crème rayon 16 px avec l'objet du thème, titre, pastille de statut à droite. Pas de bouton « Commencer ». Statuts : « Nouveau » (orange #F6A55E, texte encre) si assigné il y a moins de 7 jours et jamais ouvert ; « À faire » (lavande, texte encre) si jamais ouvert et plus ancien ; « En cours » (violet, texte blanc). Un cours terminé sort du bloc.

**E. Quiz flash débloqué, en tête** (carte encre #1E1A33, rayon 32 px). Objet éclair qui déborde, tourné de 12°. Pastille orange « Défi du jour », titre « Quiz flash » (34 px), phrase « 10 questions sur tes N cours terminés. 5 bonnes réponses pour gagner 30 XP. », bouton orange pleine largeur « Lancer le quiz flash ».

**F. Quiz flash débloqué, en ligne** (carte encre, rayon 28 px). Objet éclair 52 px à gauche, « Quiz flash » et « 10 questions · +30 XP », bouton orange « Lancer » à droite.

**G. Quiz flash verrouillé** (carte blanche). Éclair grisé avec un cadenas encre en pastille, « Quiz flash », « Réussis 3 quiz de cours pour le débloquer », barre fine (fond #EFE9E0, remplissage encre) et « X / 3 ».

**H. Prochain badge** (carte lavande #E4DEFF). Vignette blanche rayon 22 px avec l'illustration du prochain badge grisée et un cadenas, libellé « Prochain badge », nom du badge, condition en clair (« Termine 3 cours »). Barre de progression (fond blanc, remplissage violet) et compteur (« 1 / 3 cours »). Rangée des 6 badges en 26 px, obtenus en couleur, verrouillés en gris, puis le lien « Mes badges · X/6 » qui ouvre le carrousel existant.

**I. Collection complète, vitrine** (carte lavande). « Collection complète », « 6 badges sur 6 », lien « Voir mes badges ». Les 6 badges sur des pastilles blanches cliquables (popup existante).

**J. Collection complète, compacte** : une ligne lavande en bas du dashboard, « Collection complète · 6/6 » et le lien « Voir mes badges ».

**K. Bibliothèque terminée** (carte blanche, sans bouton). « Bibliothèque terminée », « Tu as fini les N cours », « De nouveaux cours arrivent. Le quiz flash garde tes acquis au chaud. »

### Ordre des blocs selon la situation

Détermine la situation dans cet ordre :

1. Aucun cours commencé ni terminé, aucun cours assigné : B (« Ton premier cours »), G, H.
2. Un cours en cours, quiz flash verrouillé : A, puis D s'il y a des cours assignés à faire, puis G, H.
3. Un cours en cours, quiz flash débloqué : A, puis D si besoin, puis F, H.
4. Rien en cours, des cours assignés à faire : C (le plus ancien assigné), D avec les autres (masqué s'il n'en reste pas), puis F ou G, H.
5. Rien en cours, rien d'assigné, quiz flash débloqué : E, B (« Prochain cours conseillé »), H.
6. Rien en cours, rien d'assigné, quiz flash verrouillé : B (« Prochain cours conseillé »), G, H.
7. Tous les cours accessibles terminés : E, K, puis le bloc badges.

Règles transverses :
- Quand un cours est en cours, ne propose jamais un deuxième cours à commencer.
- Une consigne du formateur passe avant les suggestions de l'app, jamais avant un cours déjà entamé.
- S'il y a plusieurs cours en cours, A montre celui dont la progression a été modifiée le plus récemment.
- Bloc badges : H tant que les 6 ne sont pas obtenus. Quand le 6e est obtenu, I à la place de H pendant 7 jours (date via `user_badges.date_obtention` du dernier badge obtenu), puis J en bas de page.
- Le bloc D est masqué si l'élève n'a aucun groupe ou rien à faire.

### Desktop (768 px et plus)

Voir `apprenant-desktop-etat-7`. Rangée 1 en grille 2fr / 1fr : le bloc de tête à gauche, le bloc suivant à droite. Rangée 2 en grille 2fr / 1fr : les blocs restants dans l'ordre. Les objets 3D qui débordent gardent leur débord. Rayons des cartes de tête : 36 px.

### Données

- Date d'assignation : ajoute une colonne `created_at timestamptz default now()` sur `cours_groupes` (migration), nécessaire pour « Nouveau » et « ajouté hier ». Les lignes existantes prennent la date de la migration.
- Nom du formateur : n'essaie pas de l'afficher, la RLS sur `profiles` le bloque. Écris « De ton formateur ».
- Reprends les calculs existants pour la progression d'un cours, le déblocage du quiz flash et les badges.

### À la fin

- Mets à jour la section « Dashboard apprenant » du CLAUDE.md avec ces règles (remplace l'ancien layout).
- Vérifie le rendu à 390 px et à 1280 px si tu peux ouvrir un navigateur. Sinon, dis-le.
