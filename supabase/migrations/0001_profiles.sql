-- profiles : un profil par utilisateur auth, créé à l'inscription (voir onboarding apprenant)

create type role_utilisateur as enum ('apprenant', 'formateur');
create type tranche_age_profil as enum ('-18', '18-25', '26-35', '36-50', '50+');
create type profession_profil as enum ('apprenti', 'en_poste', 'reconversion', 'autre');

-- motivation : texte libre. Les options prédéfinies de l'UI (ex. "trouver_emploi") y sont
-- stockées telles quelles ; le choix "Autre" y stocke directement la saisie libre de l'utilisateur.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nom text,
  prenom text not null,
  email text not null,
  role role_utilisateur not null default 'apprenant',
  xp_total int not null default 0,
  tranche_age tranche_age_profil not null,
  profession profession_profil not null,
  motivation text not null,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id);
