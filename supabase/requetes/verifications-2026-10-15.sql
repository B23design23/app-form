-- Requêtes de vérification (lecture seule) à jouer dans l'éditeur SQL de Supabase.
-- Aucune ne modifie les données.

-- 1. Cours sans aucune question (QCM obligatoire, lot suivant) : total par visibilité.
select c.visibilite, count(*) as cours_sans_question
from cours c
where not exists (select 1 from questions q where q.cours_id = c.id)
group by c.visibilite
order by c.visibilite;

-- 1 bis. Le détail de ces cours.
select c.visibilite, c.titre, c.categorie, c.created_at
from cours c
where not exists (select 1 from questions q where q.cours_id = c.id)
order by c.visibilite, c.titre;

-- 2. Aiguillage du dashboard admin : valeur de est_admin pour les formateurs (le compte officiel
--    doit avoir true ; null ou false affiche le dashboard formateur).
select p.prenom, p.email, p.role, p.est_admin
from profiles p
where p.role = 'formateur'
order by p.est_admin desc nulls last, p.prenom;
