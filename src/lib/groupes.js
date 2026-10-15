// Indicateurs d'un groupe, partagés par Mes groupes et le dashboard formateur (« Tes groupes »).

// Même règle que le bloc « Élèves à relancer » du dashboard : un cours resté « non commencé »
// depuis plus de 3 jours (ici limité aux cours assignés au groupe).
export const SEUIL_RELANCE_JOURS = 3

// Taux de complétion (une seule définition, groupe comme dashboard) : couples élève × cours
// assigné au statut « termine » ÷ nombre total de couples élève × cours assigné. Un couple n'est
// compté qu'une fois, même si l'élève et le cours se retrouvent dans plusieurs groupes.
export function couplesAssignes(groupeIds, membres, coursGroupes) {
  const couples = new Set()
  for (const groupeId of groupeIds) {
    const eleves = membres.filter((m) => m.groupe_id === groupeId).map((m) => m.apprenant_id)
    const cours = coursGroupes.filter((cg) => cg.groupe_id === groupeId).map((cg) => cg.cours_id)
    for (const e of eleves) for (const c of cours) couples.add(`${e}:${c}`)
  }
  return couples
}

function ratioTermines(couples, progression) {
  if (couples.size === 0) return null
  const termines = new Set(
    progression.filter((p) => p.statut === 'termine' && couples.has(`${p.user_id}:${p.cours_id}`)).map((p) => `${p.user_id}:${p.cours_id}`)
  )
  return termines.size / couples.size
}

// Taux global du formateur : même formule sur tous ses groupes (pas une moyenne des groupes).
export function tauxCompletionGlobal(groupes, membres, coursGroupes, progression) {
  return ratioTermines(couplesAssignes(groupes.map((g) => g.id), membres, coursGroupes), progression)
}

// membres : [{ groupe_id, apprenant_id }], coursGroupes : [{ groupe_id, cours_id }],
// progression : [{ user_id, cours_id, statut, updated_at }]
export function statsGroupe(groupe, membres, coursGroupes, progression) {
  const eleves = membres.filter((m) => m.groupe_id === groupe.id).map((m) => m.apprenant_id)
  const cours = coursGroupes.filter((cg) => cg.groupe_id === groupe.id).map((cg) => cg.cours_id)
  const lignes = progression.filter((p) => eleves.includes(p.user_id) && cours.includes(p.cours_id))
  const ratio = ratioTermines(couplesAssignes([groupe.id], membres, coursGroupes), progression)
  const seuil = Date.now() - SEUIL_RELANCE_JOURS * 86400000
  const aRelancer = new Set(
    lignes.filter((p) => p.statut === 'non_commence' && new Date(p.updated_at).getTime() <= seuil).map((p) => p.user_id)
  ).size
  // Dernière activité : updated_at le plus récent parmi les lignes progression des élèves du
  // groupe sur les cours assignés au groupe (comparaison en dates, pas en texte)
  const derniereActivite = lignes.reduce(
    (max, p) => (p.updated_at && (!max || new Date(p.updated_at) > new Date(max)) ? p.updated_at : max),
    null
  )
  return { nbEleves: eleves.length, nbCours: cours.length, ratio, aRelancer, derniereActivite }
}

// Nombre de jours calendaires écoulés depuis une date (0 = aujourd'hui).
export function joursDepuis(dateIso) {
  const debutJour = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  return Math.max(0, Math.round((debutJour(new Date()) - debutJour(new Date(dateIso))) / 86400000))
}

export function libelleDerniereActivite(dateIso) {
  if (!dateIso) return 'Pas encore d’activité'
  const jours = joursDepuis(dateIso)
  if (jours === 0) return 'Actif aujourd’hui'
  if (jours === 1) return 'Actif hier'
  return `Actif il y a ${jours} jours`
}
