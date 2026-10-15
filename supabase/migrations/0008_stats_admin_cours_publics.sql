-- Dashboard admin (compte officiel, profiles.est_admin) : chiffres agrégés sur les cours publics.
-- L'admin n'a pas de groupe : la RLS de progression / scores ne lui laisse pas lire les lignes des
-- apprenants. SECURITY DEFINER, réservée aux comptes est_admin, ne renvoie aucun nom ni identifiant
-- d'élève, uniquement des chiffres.
--
-- Vérifié le 2026-10-15 (sans rien ajouter ici) : profiles.est_admin, groupes.created_at et la
-- colonne nom renvoyée par get_membres_groupe existent déjà.
--
-- Définitions :
--   apprenants_actifs : utilisateurs distincts ayant une ligne progression (hors non_commence)
--                       mise à jour dans les 30 derniers jours sur un cours public ;
--   cours_termines    : lignes progression au statut termine mises à jour dans les 30 derniers
--                       jours, sur les cours publics ;
--   score_moyen       : moyenne du meilleur score par élève et par cours, tous les quiz de cours
--                       publics depuis le lancement ;
--   cours             : les 5 cours publics les plus commencés (lignes progression hors
--                       non_commence), avec commencés, terminés et score moyen.

create or replace function stats_admin_cours_publics()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  resultat json;
begin
  if not exists (select 1 from profiles where id = auth.uid() and est_admin is true) then
    raise exception 'Réservé au compte officiel';
  end if;

  with publics as (
    select id, titre, categorie from cours where visibilite = 'public'
  ),
  meilleurs as (
    select s.user_id, s.cours_id, max(s.score) as score
    from scores s
    join publics c on c.id = s.cours_id
    where s.type = 'quiz_cours'
    group by s.user_id, s.cours_id
  ),
  par_cours as (
    select
      c.id,
      c.titre,
      c.categorie,
      count(p.id) as commences,
      count(p.id) filter (where p.statut = 'termine') as termines,
      (select round(avg(m.score)) from meilleurs m where m.cours_id = c.id) as score_moyen
    from publics c
    join progression p on p.cours_id = c.id and p.statut <> 'non_commence'
    group by c.id, c.titre, c.categorie
    order by count(p.id) desc, count(p.id) filter (where p.statut = 'termine') desc
    limit 5
  )
  select json_build_object(
    'apprenants_actifs', (
      select count(distinct p.user_id)
      from progression p
      join publics c on c.id = p.cours_id
      where p.statut <> 'non_commence'
        and p.updated_at >= now() - interval '30 days'
    ),
    'cours_termines', (
      select count(*)
      from progression p
      join publics c on c.id = p.cours_id
      where p.statut = 'termine'
        and p.updated_at >= now() - interval '30 days'
    ),
    'score_moyen', (select round(avg(score)) from meilleurs),
    'cours', coalesce(
      (select json_agg(pc order by pc.commences desc, pc.termines desc) from par_cours pc),
      '[]'::json
    )
  )
  into resultat;

  return resultat;
end;
$$;

revoke all on function stats_admin_cours_publics() from public;
grant execute on function stats_admin_cours_publics() to authenticated;
