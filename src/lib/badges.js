// Objets 3D des badges (Fluent Emoji, Microsoft, licence MIT), servis depuis public/illustrations.
// Choisis par condition de déblocage (stable), pas par la colonne badges.icone. Les anciennes
// illustrations SVG (src/Assets/badge/) restent dans le dépôt mais ne sont plus utilisées.
const IMAGES_BADGE = {
  premier_quiz_complete: 'chaussure-course',
  premiere_checklist_completee: 'sur-le-terrain',
  trois_cours_termines: 'perseverant',
  quiz_100_pourcent: 'sans-faute',
  premier_quiz_flash_reussi: 'eclair',
  dix_cours_termines: 'expert',
}

const IMAGE_BADGE_DEFAUT = 'chaussure-course'

export function iconeBadge(badge) {
  return `/illustrations/badges/${IMAGES_BADGE[badge?.condition_deblocage] ?? IMAGE_BADGE_DEFAUT}.png`
}

const LIBELLES_CONDITION = {
  premier_quiz_complete: 'Termine le quiz d’un premier cours.',
  premiere_checklist_completee: 'Termine une première checklist terrain.',
  trois_cours_termines: 'Termine 3 cours différents.',
  dix_cours_termines: 'Termine 10 cours différents.',
  quiz_100_pourcent: 'Obtiens 100% à un quiz.',
  premier_quiz_flash_reussi: 'Réussis un premier quiz flash (score ≥ 50%).',
}

export function libelleCondition(conditionDeblocage) {
  return LIBELLES_CONDITION[conditionDeblocage] ?? 'Continue ta progression pour débloquer ce badge.'
}

// Condition en clair et courte (dashboard, modale « Mes badges », fin de quiz).
const CONDITIONS_COURTES = {
  premier_quiz_complete: 'Réussis ton premier quiz',
  trois_cours_termines: 'Termine 3 cours',
  dix_cours_termines: 'Termine 10 cours',
  premiere_checklist_completee: 'Termine une checklist terrain',
  premier_quiz_flash_reussi: 'Réussis un quiz flash',
  quiz_100_pourcent: 'Fais 100 % à un quiz',
}

export function conditionCourteBadge(conditionDeblocage) {
  return CONDITIONS_COURTES[conditionDeblocage] ?? libelleCondition(conditionDeblocage)
}
