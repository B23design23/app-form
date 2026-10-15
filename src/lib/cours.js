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

const MOTS_PAR_MINUTE = 200

// Temps de lecture : 200 mots par minute, arrondi à la minute supérieure (images et liens exclus).
export function tempsLecture(contenu) {
  const texte = (contenu ?? '').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/https?:\/\/\S+/g, ' ')
  const mots = texte.split(/\s+/).filter((m) => /[\p{L}\p{N}]/u.test(m)).length
  return Math.max(1, Math.ceil(mots / MOTS_PAR_MINUTE))
}

// Images d'une leçon Markdown : [{ alt, url }] dans l'ordre d'apparition.
export function imagesLecon(contenu) {
  return [...(contenu ?? '').matchAll(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g)].map((m) => ({ alt: m[1], url: m[2] }))
}

// Premier paragraphe de texte d'une leçon (ni titre, ni image, ni liste, ni tableau).
export function premierParagraphe(contenu) {
  const blocs = (contenu ?? '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  return blocs.find((b) => !/^(#|!\[|[-*+] |\d+\. |\||>)/.test(b) && /[\p{L}]/u.test(b.replace(/!\[[^\]]*\]\([^)]*\)/g, ''))) ?? ''
}
