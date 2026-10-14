-- cours : tous les cours (publics et privés) ont l'un des 12 thèmes (src/lib/thematiques.js).
-- Étend cours_categorie_publique_valide (migration 0002), qui ne s'appliquait qu'aux cours publics.
-- Remap des cours privés existants validé le 2026-10-14. Le tout dans une transaction : si une
-- catégorie libre subsiste, l'ajout de la contrainte échoue et rien n'est modifié.

begin;

-- 1. Remap des cours privés existants (catégorie libre → thème)
update cours set categorie = 'Diagnostic & dépannage'
where id = 'f4d319df-27e1-4f28-88ce-1f3e5d7c1a26'; -- « Diagnostic panne clim » (Diagnostic)

update cours set categorie = 'Installation & mise en service'
where id = '0c549d6b-f4a7-4ef2-a8bf-cddc53a6df8e'; -- « Bases électriques » (Électricité)

update cours set categorie = 'Entretien & maintenance'
where id = '57cc1551-65cd-4c71-ad82-1aa7fad59096'; -- « Nettoyage du filtre climatisation » (Entretien)

update cours set categorie = 'Réglementation & sécurité'
where id = '555002ca-e1a1-4872-b595-ffc9c87155e7'; -- « Sécurité électrique avancée » (Sécurité)

-- 2. Contrainte étendue à tous les cours (nom conservé pour ne pas casser les références)
alter table cours drop constraint cours_categorie_publique_valide;

alter table cours
  add constraint cours_categorie_publique_valide
  check (
    categorie = any (array[
      'Thermodynamique',
      'Fluides frigorigènes & environnement',
      'Cycle frigorifique & composants',
      'Psychrométrie & confort',
      'Technologies & systèmes clim',
      'Dimensionnement',
      'Installation & mise en service',
      'Brasage & dudgeon',
      'Entretien & maintenance',
      'Diagnostic & dépannage',
      'Réglementation & sécurité',
      'Efficacité énergétique'
    ])
  );

commit;
