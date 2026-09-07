import { supabase } from './supabaseClient'

export async function ajouterXp(authUser, montant) {
  const { data } = await supabase.from('profiles').select('xp_total').eq('id', authUser.id).single()
  const nouveauTotal = (data?.xp_total ?? 0) + montant
  await supabase.from('profiles').update({ xp_total: nouveauTotal }).eq('id', authUser.id)
}

export async function verifierBadges(authUser) {
  const [badgesRes, userBadgesRes, scoresRes, progressionRes] = await Promise.all([
    supabase.from('badges').select('id, nom, icone, condition_deblocage'),
    supabase.from('user_badges').select('badge_id').eq('user_id', authUser.id),
    supabase.from('scores').select('type, score').eq('user_id', authUser.id),
    supabase.from('progression').select('statut, cours(etapes_checklist(id))').eq('user_id', authUser.id),
  ])

  if (badgesRes.error || userBadgesRes.error || scoresRes.error || progressionRes.error) {
    return []
  }

  const idsDejaObtenus = new Set((userBadgesRes.data ?? []).map((ub) => ub.badge_id))
  const scores = scoresRes.data ?? []
  const coursTermines = (progressionRes.data ?? []).filter((p) => p.statut === 'termine')

  const conditionsRemplies = {
    premier_quiz_complete: scores.some((s) => s.type === 'quiz_cours'),
    premiere_checklist_completee: coursTermines.some((p) => (p.cours?.etapes_checklist?.length ?? 0) > 0),
    trois_cours_termines: coursTermines.length >= 3,
    quiz_100_pourcent: scores.some((s) => s.score === 100),
    premier_quiz_flash_reussi: scores.some((s) => s.type === 'quiz_flash' && s.score >= 50),
  }

  const nouveauxBadges = []
  for (const badge of badgesRes.data ?? []) {
    if (idsDejaObtenus.has(badge.id)) continue
    if (!conditionsRemplies[badge.condition_deblocage]) continue

    const { error } = await supabase.from('user_badges').insert({
      user_id: authUser.id,
      badge_id: badge.id,
      date_obtention: new Date().toISOString(),
    })
    if (!error) nouveauxBadges.push(badge)
  }

  return nouveauxBadges
}
