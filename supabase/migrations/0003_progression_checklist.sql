-- progression : suivi séparé de la checklist (indépendant du statut du cours, qui peut être
-- "termine" via le seul QCM). Sert à l'affichage Dashboard / Mode terrain et au badge "Sur le terrain".

alter table progression add column checklist_terminee boolean not null default false;

-- Reprise de l'existant : les cours déjà terminés et possédant une checklist avaient
-- nécessairement leur checklist menée à terme (ancienne règle).
update progression p
set checklist_terminee = true
where p.statut = 'termine'
  and exists (select 1 from etapes_checklist e where e.cours_id = p.cours_id);
