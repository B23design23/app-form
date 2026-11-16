-- Rattrapage : colonnes lues par l'app et présentes en base (0008 l'a vérifié pour est_admin et
-- groupes.created_at), mais créées hors des migrations. Idempotent : sans effet sur une base qui
-- les a déjà ; crée les colonnes sur une base neuve montée depuis les migrations.
-- Types et défauts déduits du code et des migrations existantes :
--   profiles.est_admin : compte officiel ; le code traite null comme false (App.jsx,
--                        DashboardFormateur.jsx), 0008 teste « est_admin is true ».
--   profiles.organisme, profiles.specialite : texte, renseignés seulement pour role = formateur
--                        (Inscription.jsx, App.jsx), donc nullables.
--   groupes.created_at : date de création, même forme que cours_groupes.created_at (0004) ;
--                        lue pour trier « Tes groupes » (DashboardFormateur.jsx).

alter table profiles add column if not exists est_admin boolean not null default false;
alter table profiles add column if not exists organisme text;
alter table profiles add column if not exists specialite text;

alter table groupes add column if not exists created_at timestamptz not null default now();
