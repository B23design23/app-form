-- Données de démonstration du dashboard apprenant pour un compte de test.
-- À exécuter dans l'éditeur SQL de Supabase (contourne la RLS). Ne touche qu'aux 4 cours choisis
-- ci-dessous pour ce compte : 3 cours terminés avec quiz (dont un à 100 %), 1 cours en cours.
-- Résultat attendu : situation « un cours en cours, quiz flash débloqué » → cours en cours (A),
-- quiz flash (F), prochain badge « Expert » à 3 / 10 cours (H), badges Premier pas, Persévérant,
-- Sans faute obtenus. Rejouable : les lignes de ces 4 cours sont recréées à chaque exécution.

do $$
declare
  v_email constant text := 'b23design23@outlook.com';
  v_user uuid;
  v_cours uuid[];
  v_themes constant text[] := array[
    'Thermodynamique', 'Fluides frigorigènes & environnement', 'Cycle frigorifique & composants',
    'Psychrométrie & confort', 'Technologies & systèmes clim', 'Dimensionnement',
    'Installation & mise en service', 'Brasage & dudgeon', 'Entretien & maintenance',
    'Diagnostic & dépannage', 'Réglementation & sécurité', 'Efficacité énergétique'
  ];
begin
  select id into v_user from profiles where email = v_email and role = 'apprenant';
  if v_user is null then
    raise exception 'Aucun profil apprenant pour %', v_email;
  end if;

  -- 4 premiers cours publics ayant un quiz, dans l'ordre des thèmes puis cours.ordre
  select array_agg(id order by rang) into v_cours
  from (
    select c.id, row_number() over (
      order by array_position(v_themes, c.categorie), c.ordre nulls last, c.titre
    ) as rang
    from cours c
    where c.visibilite = 'public'
      and exists (select 1 from questions q where q.cours_id = c.id)
  ) t
  where rang <= 4;

  if coalesce(array_length(v_cours, 1), 0) < 4 then
    raise exception 'Il faut au moins 4 cours publics avec un quiz (trouvés : %)', coalesce(array_length(v_cours, 1), 0);
  end if;

  delete from progression where user_id = v_user and cours_id = any (v_cours);
  delete from scores where user_id = v_user and type = 'quiz_cours' and cours_id = any (v_cours);

  -- 3 cours terminés (quiz faits il y a 6, 4 et 2 jours), le 2e à 100 %
  insert into progression (user_id, cours_id, statut, updated_at) values
    (v_user, v_cours[1], 'termine', now() - interval '6 days'),
    (v_user, v_cours[2], 'termine', now() - interval '4 days'),
    (v_user, v_cours[3], 'termine', now() - interval '2 days'),
    (v_user, v_cours[4], 'en_cours', now() - interval '3 hours');

  insert into scores (user_id, cours_id, type, score, date) values
    (v_user, v_cours[1], 'quiz_cours', 80, now() - interval '6 days'),
    (v_user, v_cours[2], 'quiz_cours', 100, now() - interval '4 days'),
    (v_user, v_cours[3], 'quiz_cours', 70, now() - interval '2 days');

  -- Badges correspondants (unique(user_id, badge_id) évite les doublons)
  insert into user_badges (user_id, badge_id, date_obtention)
  select v_user, b.id, now() - interval '2 days'
  from badges b
  where b.condition_deblocage in ('premier_quiz_complete', 'trois_cours_termines', 'quiz_100_pourcent')
  on conflict (user_id, badge_id) do nothing;

  -- XP : 3 quiz × 20 XP, sans jamais baisser un total existant
  update profiles set xp_total = greatest(xp_total, 60) where id = v_user;

  raise notice 'Démo appliquée pour % (cours : %)', v_email, v_cours;
end $$;
