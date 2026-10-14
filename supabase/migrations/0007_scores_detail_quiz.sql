-- scores : détail d'un passage de quiz de cours (affichage « 4/5 » fidèle au moment du passage,
-- même si le formateur modifie ensuite le nombre de questions). Nullable : les passages
-- antérieurs n'ont pas cette information et s'affichent en pourcentage seul.

alter table scores add column bonnes_reponses integer;
alter table scores add column nb_questions integer;
