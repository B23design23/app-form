// Statut d'un cours assigné par le formateur, partagé par le dashboard (bloc « De ton formateur »)
// et la page Cours. « Nouveau » : assigné il y a moins de 7 jours et jamais ouvert.

export const JOURS_NOUVEAU = 7

const JOUR_MS = 86400000

// Nombre de jours calendaires écoulés depuis une date ISO (null si pas de date).
export function joursDepuis(dateIso) {
  if (!dateIso) return null
  const debutJour = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  return Math.round((debutJour(new Date()) - debutJour(new Date(dateIso))) / JOUR_MS)
}

// Renvoie une valeur de StatutBadge : 'termine' | 'en_cours' | 'nouveau' | 'a_faire'.
export function statutCoursAssigne(statutProgression, dateAssignation) {
  if (statutProgression === 'termine') return 'termine'
  if (statutProgression === 'en_cours') return 'en_cours'
  const jours = joursDepuis(dateAssignation)
  return jours !== null && jours < JOURS_NOUVEAU ? 'nouveau' : 'a_faire'
}
