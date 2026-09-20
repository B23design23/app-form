-- cours : ajout de la colonne ordre (tri des cours au sein d'un thème, et des thèmes entre eux)
-- + verrouillage de cours.categorie aux 12 thématiques, uniquement pour les cours publics
-- (les cours privés des formateurs gardent le texte libre existant, contrainte non applicable).

alter table cours add column ordre integer;

-- Remap des cours publics existants vers la nouvelle taxonomie, avant d'ajouter la contrainte
-- ci-dessous (sinon elle échouerait sur les lignes actuelles).
-- Les 5 cours publics actuels ont tous categorie = 'Installation' ; leurs titres (cassette,
-- monobloc, VRV/VRF, split mural, split gainable) décrivent des types de systèmes clim,
-- mappés ici vers 'Technologies & systèmes clim'. À confirmer/ajuster avant exécution.
update cours
set categorie = 'Technologies & systèmes clim'
where visibilite = 'public' and categorie = 'Installation';

alter table cours
  add constraint cours_categorie_publique_valide
  check (
    visibilite <> 'public'
    or categorie = any (array[
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
