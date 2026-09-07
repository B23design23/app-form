import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/shared.css'
import './DetailGroupe.css'

const LABEL_STATUT = {
  non_commence: 'Non commencé',
  en_cours: 'En cours',
  termine: 'Terminé',
}

function DetailGroupe({ authUser, groupeId, onRetour }) {
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  const [groupe, setGroupe] = useState(null)
  const [membres, setMembres] = useState([])
  const [erreurMembres, setErreurMembres] = useState(null)

  const [coursDuGroupe, setCoursDuGroupe] = useState([])
  const [progressionParCle, setProgressionParCle] = useState(new Map())
  const [badgesParApprenant, setBadgesParApprenant] = useState(new Map())
  const [erreurSuivi, setErreurSuivi] = useState(null)

  const [emailAjout, setEmailAjout] = useState('')
  const [ajoutEnCours, setAjoutEnCours] = useState(false)
  const [erreurAjout, setErreurAjout] = useState(null)

  async function rechargerMembres() {
    const { data, error } = await supabase.rpc('get_membres_groupe', { p_groupe_id: groupeId })
    if (error) {
      setErreurMembres(error.message)
      return []
    }
    setMembres(data ?? [])
    return data ?? []
  }

  async function rechargerSuivi(membresActuels) {
    const { data: coursData, error: erreurCoursSuivi } = await supabase
      .from('cours')
      .select('id, titre')
      .eq('groupe_id', groupeId)

    if (erreurCoursSuivi) {
      setErreurSuivi(erreurCoursSuivi.message)
      return
    }
    setCoursDuGroupe(coursData ?? [])

    if (membresActuels.length === 0) return

    const apprenantIds = membresActuels.map((m) => m.id)

    if ((coursData ?? []).length > 0) {
      const { data: progressionData, error: erreurProgression } = await supabase
        .from('progression')
        .select('user_id, cours_id, statut')
        .in('user_id', apprenantIds)
        .in('cours_id', coursData.map((c) => c.id))

      if (erreurProgression) {
        setErreurSuivi(erreurProgression.message)
      } else {
        setProgressionParCle(new Map((progressionData ?? []).map((p) => [`${p.user_id}_${p.cours_id}`, p.statut])))
      }
    }

    const { data: badgesData, error: erreurBadges } = await supabase
      .from('user_badges')
      .select('user_id')
      .in('user_id', apprenantIds)

    if (erreurBadges) {
      setErreurSuivi(erreurBadges.message)
    } else {
      const compteur = new Map()
      for (const row of badgesData ?? []) {
        compteur.set(row.user_id, (compteur.get(row.user_id) ?? 0) + 1)
      }
      setBadgesParApprenant(compteur)
    }
  }

  useEffect(() => {
    let annule = false

    async function charger() {
      const { data, error } = await supabase
        .from('groupes')
        .select('id, nom, formateur_id')
        .eq('id', groupeId)
        .maybeSingle()

      if (annule) return

      if (error || !data || data.formateur_id !== authUser.id) {
        setErreur(error?.message ?? "Ce groupe est introuvable ou ne t'appartient pas.")
        setChargement(false)
        return
      }

      setGroupe(data)
      const membresCharges = await rechargerMembres()
      if (annule) return
      await rechargerSuivi(membresCharges)
      if (!annule) setChargement(false)
    }

    charger()

    return () => {
      annule = true
    }
  }, [authUser.id, groupeId])

  async function handleAjouterEleve(e) {
    e.preventDefault()
    setErreurAjout(null)
    setAjoutEnCours(true)

    const { data: apprenantId, error: erreurRpc } = await supabase.rpc('find_apprenant_id_by_email', {
      p_email: emailAjout.trim(),
    })

    if (erreurRpc) {
      setAjoutEnCours(false)
      setErreurAjout(`La recherche a échoué (${erreurRpc.message}).`)
      return
    }

    if (!apprenantId) {
      setAjoutEnCours(false)
      setErreurAjout("Aucun compte apprenant trouvé avec cet email — l'élève doit d'abord créer son compte.")
      return
    }

    const { error: erreurInsert } = await supabase
      .from('groupe_membres')
      .insert({ groupe_id: groupeId, apprenant_id: apprenantId })

    setAjoutEnCours(false)

    if (erreurInsert) {
      setErreurAjout(`L'élève n'a pas pu être ajouté (${erreurInsert.message}).`)
      return
    }

    setEmailAjout('')
    const membresActuels = await rechargerMembres()
    await rechargerSuivi(membresActuels)
  }

  async function handleRetirer(apprenantId) {
    await supabase.from('groupe_membres').delete().eq('groupe_id', groupeId).eq('apprenant_id', apprenantId)
    const membresActuels = await rechargerMembres()
    await rechargerSuivi(membresActuels)
  }

  if (chargement) {
    return (
      <div className="flow-page">
        <div className="flow-card">
          <p>Chargement…</p>
        </div>
      </div>
    )
  }

  if (erreur) {
    return (
      <div className="flow-page">
        <div className="page-avec-lien-retour">
          <button type="button" className="lien-retour" onClick={onRetour}>
            ← Retour au tableau de bord
          </button>
          <div className="flow-card">
            <p className="message message-erreur">{erreur}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flow-page">
      <div className="page-avec-lien-retour">
        <button type="button" className="lien-retour" onClick={onRetour}>
          ← Retour au tableau de bord
        </button>

        <div className="flow-card">
          <h1>{groupe.nom}</h1>

          <section className="detail-section">
            <h2>Élèves ({membres.length})</h2>
            {erreurMembres ? (
              <p className="message message-erreur">
                Impossible de charger les élèves ({erreurMembres}).
              </p>
            ) : membres.length === 0 ? (
              <p className="dashboard-etat-vide">Aucun élève dans ce groupe.</p>
            ) : (
              <ul className="dashboard-liste">
                {membres.map((membre) => (
                  <li key={membre.id} className="detail-groupe-membre">
                    <span className="detail-groupe-membre-info">
                      {membre.prenom} {membre.nom ?? ''} — {membre.email}
                    </span>
                    <button
                      type="button"
                      className="creation-bouton-supprimer"
                      onClick={() => handleRetirer(membre.id)}
                    >
                      Retirer
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="detail-section">
            <h2>Suivi de progression</h2>
            {erreurSuivi ? (
              <p className="message message-erreur">Impossible de charger le suivi ({erreurSuivi}).</p>
            ) : membres.length === 0 ? (
              <p className="dashboard-etat-vide">Aucun élève à suivre pour le moment.</p>
            ) : (
              <div className="detail-suivi-scroll">
                <table className="detail-suivi-table">
                  <thead>
                    <tr>
                      <th>Élève</th>
                      {coursDuGroupe.map((cours) => (
                        <th key={cours.id} title={cours.titre}>
                          {cours.titre}
                        </th>
                      ))}
                      <th>XP</th>
                      <th>Badges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {membres.map((membre) => (
                      <tr key={membre.id}>
                        <td>
                          {membre.prenom} {membre.nom ?? ''}
                        </td>
                        {coursDuGroupe.map((cours) => {
                          const statut = progressionParCle.get(`${membre.id}_${cours.id}`) ?? 'non_commence'
                          return (
                            <td key={cours.id}>
                              <span className={`detail-suivi-statut detail-suivi-statut-${statut}`}>
                                {LABEL_STATUT[statut]}
                              </span>
                            </td>
                          )
                        })}
                        <td>{membre.xp_total}</td>
                        <td>{badgesParApprenant.get(membre.id) ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="detail-section">
            <h2>Ajouter un élève</h2>
            <form className="dashboard-groupe-form" onSubmit={handleAjouterEleve}>
              <input
                type="email"
                required
                placeholder="Email de l'élève"
                value={emailAjout}
                onChange={(e) => setEmailAjout(e.target.value)}
              />
              <button type="submit" className="bouton-ajouter" disabled={ajoutEnCours}>
                {ajoutEnCours ? 'Recherche…' : 'Ajouter'}
              </button>
            </form>
            {erreurAjout && <p className="message message-erreur">{erreurAjout}</p>}
          </section>
        </div>
      </div>
    </div>
  )
}

export default DetailGroupe
