import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/shared.css'
import '../styles/espace-layout.css'

function SectionCoursFormateur({ authUser, onOuvrirCours, onCreerCours }) {
  const [mesCours, setMesCours] = useState(null)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    let annule = false

    supabase
      .from('cours')
      .select('id, titre')
      .eq('formateur_id', authUser.id)
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreur(error.message)
        else setMesCours(data ?? [])
      })

    return () => {
      annule = true
    }
  }, [authUser.id])

  return (
    <div className="espace-page">
      <h1>Mes cours</h1>

      {erreur ? (
        <p className="message message-erreur">Impossible de charger tes cours ({erreur}).</p>
      ) : mesCours === null ? (
        <p>Chargement…</p>
      ) : mesCours.length === 0 ? (
        <p className="dashboard-etat-vide">Aucun cours pour le moment.</p>
      ) : (
        <ul className="espace-liste">
          {mesCours.map((cours) => (
            <li key={cours.id}>
              <button type="button" className="espace-liste-item" onClick={() => onOuvrirCours(cours.id)}>
                <span className="espace-liste-item-titre">{cours.titre}</span>
                <span className="espace-liste-item-chevron" aria-hidden="true">
                  ›
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="bouton-ajouter" onClick={onCreerCours}>
        + Créer un cours
      </button>
    </div>
  )
}

export default SectionCoursFormateur
