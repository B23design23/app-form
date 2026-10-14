// Les 12 thématiques de la bibliothèque publique, dans l'ordre canonique (numéro affiché =
// position + 1). Cohérent avec la contrainte cours_categorie_publique_valide (migration 0002).
export const THEMATIQUES = [
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
  'Efficacité énergétique',
]


// Objets 3D des thèmes (Fluent Emoji, Microsoft, licence MIT), servis depuis public/illustrations.
const IMAGES_THEMES = {
  Thermodynamique: 'thermodynamique',
  'Fluides frigorigènes & environnement': 'fluides-frigorigenes',
  'Cycle frigorifique & composants': 'cycle-frigorifique',
  'Psychrométrie & confort': 'psychrometrie',
  'Technologies & systèmes clim': 'technologies-systemes',
  Dimensionnement: 'dimensionnement',
  'Installation & mise en service': 'installation',
  'Brasage & dudgeon': 'brasage-dudgeon',
  'Entretien & maintenance': 'entretien-maintenance',
  'Diagnostic & dépannage': 'diagnostic-depannage',
  'Réglementation & sécurité': 'reglementation-securite',
  'Efficacité énergétique': 'efficacite-energetique',
}

const IMAGE_THEME_DEFAUT = 'technologies-systemes'

export const IMAGE_QUIZ_FLASH = '/illustrations/quiz-flash.png'
export const IMAGE_BIBLIOTHEQUE_TERMINEE = '/illustrations/bibliotheque-terminee.png'

// Image d'un cours d'après sa categorie ; un cours privé hors des 12 thèmes reçoit l'image par défaut.
export function imageTheme(categorie) {
  return `/illustrations/themes/${IMAGES_THEMES[categorie] ?? IMAGE_THEME_DEFAUT}.png`
}

// Libellés courts des thèmes (sous-titres de lignes, ex. Mode terrain).
const LIBELLES_COURTS = {
  Thermodynamique: 'Thermodynamique',
  'Fluides frigorigènes & environnement': 'Fluides',
  'Cycle frigorifique & composants': 'Cycle frigorifique',
  'Psychrométrie & confort': 'Psychrométrie',
  'Technologies & systèmes clim': 'Technologies',
  Dimensionnement: 'Dimensionnement',
  'Installation & mise en service': 'Installation',
  'Brasage & dudgeon': 'Brasage',
  'Entretien & maintenance': 'Entretien',
  'Diagnostic & dépannage': 'Diagnostic',
  'Réglementation & sécurité': 'Sécurité',
  'Efficacité énergétique': 'Efficacité énergétique',
}

export function libelleCourtTheme(categorie) {
  return LIBELLES_COURTS[categorie] ?? categorie
}

export const IMAGE_COURS = '/illustrations/cours.png'
export const IMAGE_TERRAIN = '/illustrations/terrain.png'
