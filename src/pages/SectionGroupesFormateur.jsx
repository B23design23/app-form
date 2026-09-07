import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/shared.css'
import '../styles/espace-layout.css'

function SectionGroupesFormateur({ authUser, onOuvrirGroupe }) {
  const [mesGroupes, setMesGroupes] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [nomNouveauGroupe, setNomNouveauGroupe] = useState('')
  const [creationEnCours, setCreationEnCours] = useState(false)

  function rechargerGroupes() {
    return supabase
      .from('groupes')
      .select('id, nom')
      .eq('formateur_id', authUser.id)
      .then(({ data, error }) => {
        if (error) setErreur(error.message)
        else setMesGroupes(data ?? [])
      })
  }

  useEffect(() => {
    rechargerGroupes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser.id])

  async function handleCreerGroupe(e) {
    e.preventDefault()
    if (nomNouveauGroupe.trim().length === 0) return

    setCreationEnCours(true)
    const { error } = await supabase
      .from('groupes')
      .insert({ nom: nomNouveauGroupe.trim(), formateur_id: authUser.id })
    setCreationEnCours(false)

    if (error) {
      setErreur(error.message)
      return
    }

    setNomNouveauGroupe('')
    rechargerGroupes()
  }

  return (
    <div className="espace-page">
      <h1>Mes groupes</h1>

      {erreur ? (
        <p className="message message-erreur">Impossible de charger tes groupes ({erreur}).</p>
      ) : mesGroupes === null ? (
        <p>Chargement…</p>
      ) : mesGroupes.length === 0 ? (
        <p className="dashboard-etat-vide">Aucun groupe pour le moment.</p>
      ) : (
        <ul className="espace-liste">
          {mesGroupes.map((groupe) => (
            <li key={groupe.id}>
              <button type="button" className="espace-liste-item" onClick={() => onOuvrirGroupe(groupe.id)}>
                <span className="espace-liste-item-titre">{groupe.nom}</span>
                <span className="espace-liste-item-chevron" aria-hidden="true">
                  ›
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="dashboard-groupe-form" onSubmit={handleCreerGroupe}>
        <input
          type="text"
          placeholder="Nom du groupe"
          value={nomNouveauGroupe}
          onChange={(e) => setNomNouveauGroupe(e.target.value)}
        />
        <button
          type="submit"
          className="bouton-ajouter"
          disabled={creationEnCours || nomNouveauGroupe.trim().length === 0}
        >
          + Créer un groupe
        </button>
      </form>
    </div>
  )
}

export default SectionGroupesFormateur
