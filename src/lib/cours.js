// Contenu d'un cours en clair : « Leçon · Quiz · Checklist » (selon les données du cours).
export function partiesContenuCours(cours) {
  const parties = []
  if (cours.contenu?.trim()) parties.push('Leçon')
  if ((cours.questions?.length ?? 0) > 0) parties.push('Quiz')
  if ((cours.etapes_checklist?.length ?? 0) > 0) parties.push('Checklist')
  return parties
}

export function contenuCours(cours) {
  return partiesContenuCours(cours).join(' · ')
}
