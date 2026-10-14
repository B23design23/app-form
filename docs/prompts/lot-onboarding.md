# Lot : onboarding, connexion et inscription

Refonte complète du parcours d'entrée : Introduction, Connexion, choix du profil, questions d'inscription, création du compte. Les maquettes ne sont pas accessibles depuis le dépôt : tout est décrit ici. Applique le design system déjà en place (tokens, Urbanist, boutons pilule, pas de bordure sur les cartes et les champs).

## 1. Nouveau parcours

```
Introduction (3 slides)
  ├─ « Créer mon compte » → Choix du profil → questions → Création du compte → Dashboard
  └─ « J'ai déjà un compte » → Connexion → Dashboard
```

- L'écran **Accueil** actuel (carte de connexion + carte de choix du profil sur la même page) est supprimé. Ses deux usages deviennent deux écrans distincts : Connexion et Choix du profil.
- L'Introduction ne s'affiche **qu'à la première visite** sur cet appareil (clé dans le stockage local, lecture et écriture dans un try/catch). Ensuite, un utilisateur non connecté arrive directement sur Connexion.
- « Passer » sur les slides 1 et 2 mène à la slide 3 (celle qui porte les deux boutons), pas directement à une inscription.
- **Les questions viennent avant la création du compte.** L'email et le mot de passe sont demandés en dernier.
- Fin du parcours : redirection vers le Dashboard (état « Premier jour » pour un apprenant, dashboard formateur pour un formateur).

## 2. Gabarit commun à tous les écrans du parcours

Crée un composant de mise en page unique, utilisé par l'Introduction, la Connexion, le Choix du profil, chaque question et la Création du compte.

**Bouton d'action fixe (exigence importante).** Le bouton principal doit être exactement à la même position d'un écran à l'autre, pour que le doigt reste au même endroit pendant tout le parcours :
- mobile : fixé en bas de l'écran, pleine largeur moins 16 px de marge de chaque côté, hauteur 58 px, à 24 px du bas plus la zone de sécurité iOS (`env(safe-area-inset-bottom)`) ;
- le contenu défile au-dessus et garde une marge basse suffisante pour ne jamais passer sous le bouton ;
- quand un lien secondaire accompagne le bouton (« J'ai déjà un compte », « Déjà un compte ? Se connecter », « Pas encore de compte ? Créer mon compte »), il se place **sous** le bouton, et le bouton ne remonte pas : la zone d'action a la même hauteur sur tous les écrans, lien présent ou non ;
- sur la slide 3, les deux boutons empilés (« Créer mon compte » puis « J'ai déjà un compte ») occupent cette même zone, « Créer mon compte » à la place exacte du « Suivant » des slides précédentes ;
- le bouton ne doit pas bouger quand le clavier s'ouvre sur les champs texte (le clavier le recouvre, c'est accepté ; ne pas le faire remonter avec le clavier).

**Barre du haut des questions**, identique à celle du quiz : bouton rond blanc de 56 px avec une flèche retour (vers l'écran précédent du parcours, réponses conservées), barre de progression blanche de 14 px avec remplissage violet `#5B3FE0`, compteur « 2 / 5 » en 18 px graisse 800. Même position et mêmes marges que pendant le quiz, zone de sécurité comprise.

**Titre** : H1 34 px mobile, 44 px desktop, graisse 800. Sous-titre éventuel 16 px, `#5C566E`.

**Bouton désactivé** (rien choisi ou champ vide) : fond lavande `#E4DEFF`, texte `#3B3550`, non cliquable.

## 3. Introduction (3 slides)

Fond crème. Bloc lavande `#E4DEFF` de 300 px de haut, rayon 36 px, avec l'objet 3D centré à l'intérieur (environ 200 px, petite ombre portée d'illustration). Pas d'anneau autour de l'objet. Texte aligné à gauche sous le bloc, puis les points de pagination centrés juste au-dessus de la zone d'action (point actif : pilule violette 24 × 8 px, autres : 8 × 8 px `#D9D2C6`, zones de clic 24 × 44 px comme aujourd'hui).

- **Slide 1** : pas de petit logo en haut, seulement « Passer » à droite. Logo Skillo en grand, centré, sous la barre (environ 52 px). Objet : Books. Titre « Apprends ton métier, de la leçon au terrain ». Texte : « Des cours courts, à ton rythme. Une leçon et un quiz, dix minutes suffisent. » Bouton « Suivant ».
- **Slide 2** : petit logo à gauche, « Passer » à droite. Objet : High voltage. Titre « Gagne de l'XP ». Texte : « Chaque quiz réussi rapporte des points et débloque des badges. » Bouton « Suivant ».
- **Slide 3** : petit logo à gauche, pas de « Passer ». Objet : Wrench. Titre « Passe à la pratique ». Texte : « Sur le terrain, ta checklist te guide étape par étape. » Boutons « Créer mon compte » (violet plein) et « J'ai déjà un compte » (contour violet 2 px, texte `#4A2FD0`).

Aucune mention de la climatisation dans l'introduction : le moteur doit rester valable pour d'autres domaines.

## 4. Connexion

Barre du haut avec le seul bouton retour (vers la slide 3). Titre « Content de te revoir », sous-titre « Reprends là où tu t'étais arrêté. ». Champs Email et Mot de passe : libellé au-dessus (14 px, 800), champ blanc sur fond crème, pilule de 56 px, sans bordure, focus contour 2 px violet. Lien « Mot de passe oublié ? » aligné à droite sous les champs (comportement actuel conservé). Zone d'action : « Se connecter », puis « Pas encore de compte ? Créer mon compte » (vers le Choix du profil). Les erreurs de connexion s'affichent sous les champs en `#B4232A`.

## 5. Choix du profil

Bouton retour en haut. Titre « Tu viens pour… », sous-titre « Ton espace s'adapte à ce choix. ». Deux cartes blanches (rayon 30 px, padding 20 px), toute la carte cliquable, chevron à droite, objet 3D de 76 px posé directement sur la carte (sans pastille de fond) :
- « Apprendre » : « Cours, quiz et checklists, seul ou avec ton formateur. » Objet : Backpack.
- « Former mes élèves » : « Crée tes cours et suis la progression de tes groupes. » Objet : Bar chart.

Pas de bouton principal sur cet écran : le choix d'une carte fait avancer. En bas : « Déjà un compte ? Se connecter ».

## 6. Questions de l'apprenant (5 étapes, compteur « x / 5 »)

1. **Prénom** : « Comment tu t'appelles ? », sous-titre « C'est le nom qu'on utilisera pour te saluer. ». Champ texte blanc de 64 px, rayon 20 px, texte 20 px graisse 700, autofocus.
2. **Statut** : « Enchanté [Prénom]. Tu es plutôt… ». Choix : Apprenti ou en formation, Technicien en poste, En reconversion, Autre. Garde les valeurs actuelles de l'enum `profession` en base, seul le libellé affiché change.
3. **Tranche d'âge** : « Tu as quel âge ? », sous-titre « Une tranche suffit. ». Choix en grille de 2 colonnes : Moins de 18 ans, 18 à 25 ans, 26 à 35 ans, 36 à 50 ans, Plus de 50 ans (valeurs de l'enum actuel).
4. **Motivation** : « Qu'est-ce qui t'amène ? ». Choix : Trouver un emploi dans le secteur, Monter en compétences sur mon poste, Préparer un examen, Par curiosité, Autre. Garde les valeurs stockées actuelles.
5. **Création du compte** (voir section 8).

**Lignes de choix** (remplacent les listes déroulantes) : boutons blancs de 64 px, rayon 20 px, texte 17 px, rond vide de 24 px à droite (contour `#D9D2C6`). Choisi : fond lavande `#E4DEFF`, un seul contour violet 2 px, texte graisse 700, pastille violette de 28 px avec coche blanche à droite. Sémantique `radiogroup` / `radio` avec `aria-checked`, utilisable au clavier. Pas d'avance automatique au clic : l'utilisateur valide avec « Continuer ».

## 7. Questions du formateur (4 étapes, compteur « x / 4 »)

Même gabarit, fond `#F4F4F6`, champs blancs.
1. Prénom (comme l'apprenant).
2. « Où enseignes-tu, [Prénom] ? », sous-titre « Ton CFA, ton entreprise, ou ton nom si tu formes en indépendant. ». Champ texte « Organisme de formation ».
3. « Quelle est ta spécialité ? ». Champ texte « Spécialité ».
4. Création du compte.

## 8. Création du compte (dernière étape)

Barre du haut avec la progression pleine. Bloc lavande rayon 32 px : titre 28 px « Plus qu'une étape, [Prénom] », texte « Ton compte garde ta progression, tes XP et tes badges. », objet Rocket de 100 px à droite, à l'intérieur du bloc. Champs Email et Mot de passe (même style que la Connexion), aide « 8 caractères minimum. » sous le mot de passe (aligne ce chiffre sur la règle réellement configurée dans Supabase). Zone d'action : « Créer mon compte », puis « Déjà un compte ? Se connecter ».

**Données** :
- Le rôle et les réponses sont gardés dans un état partagé du parcours (contexte React), recopié dans le `sessionStorage` pour survivre à un rafraîchissement. Le retour arrière conserve les réponses.
- À « Créer mon compte » : `signUp`, puis écriture de la ligne `profiles` (rôle, prénom, et les champs du rôle).
- Vérifie si la confirmation d'email est activée sur le projet Supabase. Si `signUp` ne renvoie pas de session, l'écriture dans `profiles` sera refusée par la RLS : dans ce cas, passe les réponses dans `options.data` du `signUp` (métadonnées utilisateur) et remplis `profiles` à partir de ces métadonnées à la première connexion. Dis-moi quelle option tu as retenue.
- Le trigger de l'email de bienvenue (Make n°1) ne doit pas être cassé : vérifie qu'il se déclenche toujours avec le prénom renseigné.
- Supprime l'ancien onboarding post-inscription et ses listes déroulantes une fois le nouveau branché.

## 9. Desktop (à partir de 900 px)

Écran coupé en deux colonnes égales, 24 px de marge et d'écart, fond crème (ou `#F4F4F6` pour le formateur) :
- **Gauche** : grand bloc lavande pleine hauteur, rayon 36 px, logo Skillo en haut à gauche (32 px, piste de l'anneau en blanc sur ce fond), objet 3D de 300 à 340 px centré. L'objet suit l'écran : celui de la slide pour l'Introduction, Backpack pour les questions apprenant, Bar chart pour le formateur, Rocket pour la Création du compte. Sur la Connexion et le Choix du profil : Books.
- **Droite** : colonne de 440 px centrée horizontalement, de **hauteur fixe** (640 px) centrée verticalement. La barre du haut en haut de cette colonne, le bouton d'action ancré en bas de cette colonne : il garde ainsi la même position d'un écran à l'autre, comme sur mobile. Bouton pleine largeur de la colonne, sauf « Suivant » de l'Introduction qui peut rester à sa largeur de contenu.
- « Passer » en haut à droite de la page. Sur desktop, le logo centré de la slide 1 est remplacé par celui du bloc de gauche.
- Entre 768 et 900 px : la mise en page mobile, colonne centrée de 440 px maximum.

## 10. Assets

Télécharge dans `public/illustrations/` depuis `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/<Nom>/3D/<nom>_3d.png` :
- Backpack (`Backpack/3D/backpack_3d.png`)
- Bar chart (`Bar chart/3D/bar_chart_3d.png`)
- Rocket (`Rocket/3D/rocket_3d.png`)

Books, High voltage et Wrench sont déjà dans le dossier. Retire les anciennes illustrations d'onboarding (violet `#6C4FF6`) qui ne servent plus.

## 11. Typographie

Applique la règle du lot précédent : espace fine insécable avant « ? ! : ; » dans tous les titres et textes de ces écrans, et pas de césure automatique sur les titres.

Ne commite pas. À la fin, liste les fichiers créés, modifiés et supprimés, et la solution retenue pour l'écriture du profil (point 8).
