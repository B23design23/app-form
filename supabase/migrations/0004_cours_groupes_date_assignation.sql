-- cours_groupes : date d'assignation d'un cours à un groupe (dashboard apprenant : statut
-- "Nouveau" sous 7 jours, "ajouté hier / il y a N jours"). Les lignes existantes prennent la
-- date d'exécution de la migration.

alter table cours_groupes add column created_at timestamptz not null default now();

-- Lecture côté apprenant : la date d'assignation la plus ancienne de chaque cours assigné à
-- l'un de ses groupes. SECURITY DEFINER pour ne pas dépendre des policies RLS de cours_groupes
-- et groupe_membres (réservées au formateur propriétaire du groupe) ; ne renvoie que les
-- lignes de l'utilisateur connecté.
create or replace function mes_cours_assignes()
returns table (cours_id cours_groupes.cours_id%type, assigne_le timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select cg.cours_id, min(cg.created_at) as assigne_le
  from cours_groupes cg
  join groupe_membres gm on gm.groupe_id = cg.groupe_id
  where gm.apprenant_id = auth.uid()
  group by cg.cours_id
$$;

revoke all on function mes_cours_assignes() from public;
grant execute on function mes_cours_assignes() to authenticated;
