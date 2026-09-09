import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import StatutBadge from '../components/StatutBadge'
import '../styles/shared.css'
import '../styles/espace-layout.css'

function ListeCours({ cours, statutParCoursId, onOuvrirCours }) {
  return (
    <ul className="espace-liste espace-liste-grille">
      {cours.map((c) => {
        const statut = statutParCoursId.get(c.id) ?? 'non_commence'
        return (
          <li key={c.id}>
            <button type="button" className="espace-liste-item" onClick={() => onOuvrirCours(c.id)}>
              <span className="espace-liste-item-titre">{c.titre}</span>
              <StatutBadge statut={statut} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function SectionCours({ authUser, onOuvrirCours }) {
  const [coursListe, setCoursListe] = useState(null)
  const [erreurCours, setErreurCours] = useState(null)
  const [progression, setProgression] = useState([])

  useEffect(() => {
    let annule = false

    supabase
      .from('cours')
      .select('id, titre, visibilite')
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
  const coursPublics = (coursListe ?? []).filter((c) => c.visibilite === 'public')
  const coursFormateur = (coursListe ?? []).filter((c) => c.visibilite === 'prive')

  return (
    <div className="espace-page espace-page-etroit">
      <h1>Mes cours</h1>

      {erreurCours ? (
        <p className="message message-erreur">Impossible de charger les cours ({erreurCours}).</p>
      ) : coursListe === null ? (
        <p>Chargement…</p>
      ) : (
        <>
          <section>
            <h2>Cours publics</h2>
            {coursPublics.length === 0 ? (
              <p className="dashboard-etat-vide">Aucun cours disponible pour le moment.</p>
            ) : (
              <ListeCours cours={coursPublics} statutParCoursId={statutParCoursId} onOuvrirCours={onOuvrirCours} />
            )}
          </section>

          {coursFormateur.length > 0 && (
            <section>
              <h2>Cours de mon formateur</h2>
              <ListeCours cours={coursFormateur} statutParCoursId={statutParCoursId} onOuvrirCours={onOuvrirCours} />
            </section>
          )}
        </>
      )}
    </div>
  )
}

export default SectionCours
