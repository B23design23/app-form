import { supabase } from './supabaseClient'

// Automatisation Make n°2 (« nouveau cours assigné ») : appels fetch() directs, fire-and-forget
// (un échec ne bloque jamais le formateur, console.error pour le debug). Payloads identiques aux
// anciens triggers SQL (voir CLAUDE.md).

// Nouveau cours assigné à des groupes : { type: 'nouveau_cours', titre, membres: [{ email, prenom }] }
export async function notifierMakeNouveauCours(titreCours, groupeIds) {
  try {
    const resultats = await Promise.all(
      groupeIds.map((groupeId) => supabase.rpc('get_membres_groupe', { p_groupe_id: groupeId }))
    )

    const membresParEmail = new Map()
    for (const { data, error } of resultats) {
      if (error) continue
      for (const m of data ?? []) {
        if (m.email && !membresParEmail.has(m.email)) {
          membresParEmail.set(m.email, { email: m.email, prenom: m.prenom })
        }
      }
    }

    const membres = [...membresParEmail.values()]
    if (membres.length === 0) return

    fetch(import.meta.env.VITE_MAKE_WEBHOOK_NOUVEAU_COURS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'nouveau_cours', titre: titreCours, membres }),
    }).catch((err) => console.error('Notification Make échouée:', err))
  } catch (err) {
    console.error('Notification Make échouée:', err)
  }
}

// Nouvel élève ajouté à un groupe qui a déjà des cours privés :
// { type: 'nouvel_eleve', prenom, email, cours: [titres] }
export async function notifierMakeNouvelEleve(apprenantId, groupeId) {
  try {
    const [{ data: membresData, error: erreurMembres }, { data: coursGroupesData, error: erreurCours }] =
      await Promise.all([
        supabase.rpc('get_membres_groupe', { p_groupe_id: groupeId }),
        supabase.from('cours_groupes').select('cours(titre, visibilite)').eq('groupe_id', groupeId),
      ])

    if (erreurMembres || erreurCours) return

    const titresCoursPrives = (coursGroupesData ?? [])
      .map((cg) => cg.cours)
      .filter((c) => c && c.visibilite === 'prive')
      .map((c) => c.titre)

    if (titresCoursPrives.length === 0) return

    const nouveauMembre = (membresData ?? []).find((m) => m.id === apprenantId)
    if (!nouveauMembre) return

    fetch(import.meta.env.VITE_MAKE_WEBHOOK_NOUVEAU_COURS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'nouvel_eleve',
        prenom: nouveauMembre.prenom,
        email: nouveauMembre.email,
        cours: titresCoursPrives,
      }),
    }).catch((err) => console.error('Notification Make échouée:', err))
  } catch (err) {
    console.error('Notification Make échouée:', err)
  }
}
