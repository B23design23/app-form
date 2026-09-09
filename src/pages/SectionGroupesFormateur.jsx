import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/shared.css'
import '../styles/espace-layout.css'

function SectionGroupesFormateur({ authUser, onOuvrirGroupe }) {
  const [mesGroupes, setMesGroupes] = useState(null)
  const [erreur, setErreur] = useState(null)

  const [modalOuverte, setModalOuverte] = useState(false)
  const [nomNouveauGroupe, setNomNouveauGroupe] = useState('')
  const [creationEnCours, setCreationEnCours] = useState(false)
  const [erreurCreation, setErreurCreation] = useState(null)

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

  function ouvrirModal() {
    setErreurCreation(null)
    setNomNouveauGroupe('')
    setModalOuverte(true)
  }

  function fermerModal() {
    if (creationEnCours) return
    setModalOuverte(false)
  }

  async function handleCreerGroupe(e) {
    e.preventDefault()
    if (nomNouveauGroupe.trim().length === 0) return

    setErreurCreation(null)
    setCreationEnCours(true)
    const { error } = await supabase
      .from('groupes')
      .insert({ nom: nomNouveauGroupe.trim(), formateur_id: authUser.id })
    setCreationEnCours(false)

    if (error) {
      setErreurCreation(error.message)
      return
    }

    setNomNouveauGroupe('')
    setModalOuverte(false)
    rechargerGroupes()
  }

  return (
    <div className="espace-page espace-page-etroit">
      <div className="section-formateur-entete">
        <h1>Mes groupes</h1>
        <button type="button" className="bouton-secondaire" onClick={ouvrirModal}>
          + Créer un groupe
        </button>
      </div>

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

      {modalOuverte && (
        <div className="modal-overlay" onClick={fermerModal}>
          <div className="modal-carte" onClick={(e) => e.stopPropagation()}>
            <h2>Créer un nouveau groupe</h2>
            <form onSubmit={handleCreerGroupe}>
              <label className="champ">
                <span>Nom du groupe</span>
                <input
                  type="text"
                  autoFocus
                  value={nomNouveauGroupe}
                  onChange={(e) => setNomNouveauGroupe(e.target.value)}
                />
              </label>

              {erreurCreation && <p className="message message-erreur">{erreurCreation}</p>}

              <button
                type="submit"
                className="bouton-primaire"
                disabled={creationEnCours || nomNouveauGroupe.trim().length === 0}
              >
                {creationEnCours ? 'Création…' : 'Valider'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SectionGroupesFormateur
