# Règles à reporter dans le fichier de règles de l'agent

Ces règles d'usage figuraient dans la colonne Rôle du tableau des tokens de CLAUDE.md, retiré lors de la migration du 21 octobre 2026. Elles ne tiennent pas dans la `$description` d'un seul token : l'une porte sur deux tokens, l'autre sur une valeur qui n'a pas encore de token.

1. **`fond-neutre` et `bordure-separateur` ne se fusionnent pas.** En mode apprenant, ils pointent tous les deux vers `sable-75`, et en mode formateur vers `ardoise-75`. Leurs rôles restent distincts : `fond-neutre` remplit la pastille « Non commencé » et la piste des barres fines, `bordure-separateur` trace les lignes entre les éléments d'une liste. Une valeur identique ne permet pas d'employer l'un à la place de l'autre.

2. **`--ombre-flottante` est la seule ombre de l'app.** Elle est réservée aux éléments flottants : menu de la navigation, listes déroulantes, toast, modale « Mes badges ». Elle reste déclarée dans le `:root` de `src/styles/shared.css` en attendant un lot ombres.
