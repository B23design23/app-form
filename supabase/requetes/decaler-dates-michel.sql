-- Données de test : dates du fil d'activité du dashboard formateur de michel@skillo.fr, pour les
-- captures. À jouer dans l'éditeur SQL de Supabase, le jour des captures (dates relatives à now()).
--
-- Mode d'emploi : l'éditeur n'affiche que le résultat de la dernière requête. Sélectionne chaque
-- requête (aperçu, puis mise à jour) et joue-la seule (Cmd + Entrée sur la sélection).
-- Évite de la jouer entre 23 h 30 et 1 h (heure locale) : « Aujourd'hui » et « Hier » se calculent
-- au jour calendaire dans le navigateur.
--
-- Ce que la requête touche : uniquement progression.updated_at des lignes qui apparaissent dans le
-- fil (statut en_cours ou termine, sur un cours assigné via cours_groupes à un groupe de Michel dont
-- l'élève est membre). Les lignes non_commence ne sont jamais modifiées : « Élèves à relancer » ne
-- change pas.
--
-- Résultat visé (classement : le cours terminé avec quiz le plus récent d'abord, puis les autres
-- lignes du plus récent au plus ancien) :
--   rang 1 (terminé avec quiz) → aujourd'hui, il y a 10 min
--   rang 2                     → aujourd'hui, il y a 25 min
--   rang 3 et 4                → hier
--   rang 5                     → il y a 3 jours
--   rang 6                     → il y a 5 jours
--   les autres lignes du fil plus récentes que 7 jours → reculées à 8 jours et plus, pour ne pas
--   ajouter de lignes « Aujourd'hui » ou « Hier ».
-- Rejouable : un second passage retombe sur les mêmes lignes.


-- 0. Aperçu : le compte de Michel et ses groupes ------------------------------------------------

select p.id, p.prenom, p.email, p.est_admin, g.nom as groupe,
       (select count(*) from groupe_membres gm where gm.groupe_id = g.id) as eleves,
       (select count(*) from cours_groupes cg where cg.groupe_id = g.id) as cours_assignes
from profiles p
left join groupes g on g.formateur_id = p.id
where p.email = 'michel@skillo.fr';


-- 1. Aperçu : le fil actuel et le plan de dates -------------------------------------------------

with michel as (
  select id from profiles where email = 'michel@skillo.fr'
),
couples as (
  select distinct gm.apprenant_id as user_id, cg.cours_id
  from groupes g
  join michel m on m.id = g.formateur_id
  join groupe_membres gm on gm.groupe_id = g.id
  join cours_groupes cg on cg.groupe_id = g.id
),
fil as (
  select p.id, p.user_id, p.cours_id, p.statut, p.updated_at,
         p.statut = 'termine' and exists (
           select 1 from scores s
           where s.user_id = p.user_id and s.cours_id = p.cours_id and s.type = 'quiz_cours'
         ) as termine_avec_quiz
  from progression p
  join couples c on c.user_id = p.user_id and c.cours_id = p.cours_id
  where p.statut in ('en_cours', 'termine')
),
quiz_en_tete as (
  select id from fil where termine_avec_quiz order by updated_at desc, id limit 1
),
classement as (
  select f.*,
         row_number() over (
           order by (f.id = (select id from quiz_en_tete)) is not true, f.updated_at desc, f.id
         ) as rang
  from fil f
)
select c.rang,
       concat_ws(' ', pr.prenom, pr.nom) as eleve,
       co.titre as cours,
       c.statut,
       c.termine_avec_quiz,
       c.updated_at as date_actuelle,
       case c.rang
         when 1 then now() - interval '10 minutes'
         when 2 then now() - interval '25 minutes'
         when 3 then now() - interval '1 day'
         when 4 then now() - interval '1 day 15 minutes'
         when 5 then now() - interval '3 days'
         when 6 then now() - interval '5 days'
         else case when c.updated_at > now() - interval '7 days'
                   then now() - interval '8 days' - c.rang * interval '1 hour'
                   else c.updated_at end
       end as nouvelle_date
from classement c
join cours co on co.id = c.cours_id
left join profiles pr on pr.id = c.user_id
order by c.rang;


-- 2. Mise à jour : recule les autres lignes récentes du fil (rang > 6, moins de 7 jours) -------
--    (à jouer avant la 3 : les lignes choisies gardent ainsi la tête du classement)

with michel as (
  select id from profiles where email = 'michel@skillo.fr'
),
couples as (
  select distinct gm.apprenant_id as user_id, cg.cours_id
  from groupes g
  join michel m on m.id = g.formateur_id
  join groupe_membres gm on gm.groupe_id = g.id
  join cours_groupes cg on cg.groupe_id = g.id
),
fil as (
  select p.id, p.user_id, p.cours_id, p.statut, p.updated_at,
         p.statut = 'termine' and exists (
           select 1 from scores s
           where s.user_id = p.user_id and s.cours_id = p.cours_id and s.type = 'quiz_cours'
         ) as termine_avec_quiz
  from progression p
  join couples c on c.user_id = p.user_id and c.cours_id = p.cours_id
  where p.statut in ('en_cours', 'termine')
),
quiz_en_tete as (
  select id from fil where termine_avec_quiz order by updated_at desc, id limit 1
),
classement as (
  select f.*,
         row_number() over (
           order by (f.id = (select id from quiz_en_tete)) is not true, f.updated_at desc, f.id
         ) as rang
  from fil f
)
update progression p
set updated_at = now() - interval '8 days' - c.rang * interval '1 hour'
from classement c
where p.id = c.id
  and c.rang > 6
  and c.updated_at > now() - interval '7 days'
  and p.statut in ('en_cours', 'termine');


-- 3. Mise à jour : dates des 6 premières lignes du fil -----------------------------------------

with michel as (
  select id from profiles where email = 'michel@skillo.fr'
),
couples as (
  select distinct gm.apprenant_id as user_id, cg.cours_id
  from groupes g
  join michel m on m.id = g.formateur_id
  join groupe_membres gm on gm.groupe_id = g.id
  join cours_groupes cg on cg.groupe_id = g.id
),
fil as (
  select p.id, p.user_id, p.cours_id, p.statut, p.updated_at,
         p.statut = 'termine' and exists (
           select 1 from scores s
           where s.user_id = p.user_id and s.cours_id = p.cours_id and s.type = 'quiz_cours'
         ) as termine_avec_quiz
  from progression p
  join couples c on c.user_id = p.user_id and c.cours_id = p.cours_id
  where p.statut in ('en_cours', 'termine')
),
quiz_en_tete as (
  select id from fil where termine_avec_quiz order by updated_at desc, id limit 1
),
classement as (
  select f.*,
         row_number() over (
           order by (f.id = (select id from quiz_en_tete)) is not true, f.updated_at desc, f.id
         ) as rang
  from fil f
)
update progression p
set updated_at = case c.rang
                   when 1 then now() - interval '10 minutes'
                   when 2 then now() - interval '25 minutes'
                   when 3 then now() - interval '1 day'
                   when 4 then now() - interval '1 day 15 minutes'
                   when 5 then now() - interval '3 days'
                   when 6 then now() - interval '5 days'
                 end
from classement c
where p.id = c.id
  and c.rang <= 6
  and p.statut in ('en_cours', 'termine');


-- 4. Vérification : le fil après mise à jour (10 premières lignes) ------------------------------

with michel as (
  select id from profiles where email = 'michel@skillo.fr'
),
couples as (
  select distinct gm.apprenant_id as user_id, cg.cours_id
  from groupes g
  join michel m on m.id = g.formateur_id
  join groupe_membres gm on gm.groupe_id = g.id
  join cours_groupes cg on cg.groupe_id = g.id
)
select concat_ws(' ', pr.prenom, pr.nom) as eleve,
       co.titre as cours,
       p.statut,
       p.updated_at,
       (now()::date - p.updated_at::date) as jours_calendaires_utc,
       (select max(s.score) from scores s
        where s.user_id = p.user_id and s.cours_id = p.cours_id and s.type = 'quiz_cours') as meilleur_score
from progression p
join couples c on c.user_id = p.user_id and c.cours_id = p.cours_id
join cours co on co.id = p.cours_id
left join profiles pr on pr.id = p.user_id
where p.statut in ('en_cours', 'termine')
order by p.updated_at desc
limit 10;


-- 5. Vérification : élèves à relancer (il en faut au moins 4 pour « Voir les N autres ») ---------
--    Même règle que le dashboard : ligne non_commence depuis plus de 3 jours, sur un cours assigné
--    à un groupe de l'élève ; un élève compté une fois.

with michel as (
  select id from profiles where email = 'michel@skillo.fr'
),
couples as (
  select distinct gm.apprenant_id as user_id, cg.cours_id
  from groupes g
  join michel m on m.id = g.formateur_id
  join groupe_membres gm on gm.groupe_id = g.id
  join cours_groupes cg on cg.groupe_id = g.id
)
select count(distinct p.user_id) as eleves_a_relancer
from progression p
join couples c on c.user_id = p.user_id and c.cours_id = p.cours_id
where p.statut = 'non_commence'
  and p.updated_at <= now() - interval '3 days';
