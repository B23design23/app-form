import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import StatutBadge from '../components/StatutBadge'
import '../styles/shared.css'
import '../styles/espace-layout.css'

function SectionModeTerrain({ authUser, onOuvrirCours }) {
  const [coursListe, setCoursListe] = useState(null)
  const [erreurCours, setErreurCours] = useState(null)
  const [progression, setProgression] = useState([])

  useEffect(() => {
    let annule = false

    supabase
      .from('cours')
      .select('id, titre, etapes_checklist(id)')
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurCours(error.message)
        else setCoursListe(data ?? [])
      })

    supabase
      .from('progression')
      .select('cours_id, statut')
      .eq('user_id', authUser.id)
      .then(({ data, error }) => {
        if (annule) return
        if (!error) setProgression(data ?? [])
      })

    return () => {
      annule = true
    }
  }, [authUser.id])

  const statutParCoursId = new Map(progression.map((p) => [p.cours_id, p.statut]))
  const coursAvecChecklist = (coursListe ?? []).filter((cours) => (cours.etapes_checklist?.length ?? 0) > 0)

  return (
    <div className="espace-page espace-page-etroit">
      <h1>Mode terrain</h1>

      {erreurCours ? (
        <p className="message message-erreur">Impossible de charger les checklists ({erreurCours}).</p>
      ) : coursListe === null ? (
        <p>Chargement…</p>
      ) : coursAvecChecklist.length === 0 ? (
        <p className="dashboard-etat-vide">Aucune checklist terrain disponible pour le moment.</p>
      ) : (
        <ul className="espace-liste espace-liste-grille">
          {coursAvecChecklist.map((cours) => {
            const statut = statutParCoursId.get(cours.id) ?? 'non_commence'
            return (
              <li key={cours.id}>
                <button
                  type="button"
                  className="espace-liste-item"
                  onClick={() => onOuvrirCours(cours.id, 'checklist')}
                >
                  <span className="espace-liste-item-titre">{cours.titre}</span>
                  <StatutBadge statut={statut} />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default SectionModeTerrain
