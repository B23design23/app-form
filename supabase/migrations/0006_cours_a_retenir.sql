-- cours : encadré « À retenir » affiché en fin de leçon (un point par ligne, nullable).

alter table cours add column a_retenir text;

-- Contenu de démonstration (captures) : « Le split mural : fonctionnement et installation »
update cours
set a_retenir = E'Deux unités, reliées par des liaisons frigorifiques.\nLe fluide s''évapore dedans, se condense dehors.\nLe compresseur fait varier la pression du fluide.'
where id = 'd3c15f1c-1386-4fec-a10c-0a75d50742e4';
