import award from '../Assets/badge/award.svg'
import bolt from '../Assets/badge/bolt.svg'
import flame from '../Assets/badge/flame.svg'
import star from '../Assets/badge/star.svg'
import ten from '../Assets/badge/ten.svg'
import fallback from '../Assets/badge/fallback.svg'

const ICONES_BADGE = {
  award,
  check: fallback,
  flame,
  star,
  bolt,
  ten,
}

export function iconeBadge(icone) {
  return ICONES_BADGE[icone] ?? fallback
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
