import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/shared.css'
import './Dashboard.css'

function DashboardFormateur({ authUser, onCreerCours, onOuvrirCours, onOuvrirGroupe }) {
  const [profil, setProfil] = useState(null)
  const [erreurProfil, setErreurProfil] = useState(null)

  const [mesCours, setMesCours] = useState(null)
  const [erreurCours, setErreurCours] = useState(null)

  const [mesGroupes, setMesGroupes] = useState(null)
  const [erreurGroupes, setErreurGroupes] = useState(null)
  const [nomNouveauGroupe, setNomNouveauGroupe] = useState('')
  const [creationGroupeEnCours, setCreationGroupeEnCours] = useState(false)

  function rechargerGroupes() {
    return supabase
      .from('groupes')
      .select('id, nom')
      .eq('formateur_id', authUser.id)
      .then(({ data, error }) => {
        if (error) setErreurGroupes(error.message)
        else setMesGroupes(data)
      })
  }

  useEffect(() => {
    let annule = false

    supabase
      .from('profiles')
      .select('prenom')
      .eq('id', authUser.id)
      .single()
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurProfil(error.message)
        else setProfil(data)
      })

    supabase
      .from('cours')
      .select('id, titre')
      .eq('formateur_id', authUser.id)
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurCours(error.message)
        else setMesCours(data)
      })

    rechargerGroupes()

    return () => {
      annule = true
    }
  }, [authUser.id])

  async function handleCreerGroupe(e) {
    e.preventDefault()
    if (nomNouveauGroupe.trim().length === 0) return

    setCreationGroupeEnCours(true)
    const { error } = await supabase
      .from('groupes')
      .insert({ nom: nomNouveauGroupe.trim(), formateur_id: authUser.id })
    setCreationGroupeEnCours(false)

    if (error) {
      setErreurGroupes(error.message)
      return
    }

    setNomNouveauGroupe('')
    rechargerGroupes()
  }

  if (erreurProfil) {
    return (
      <div className="flow-page">
        <div className="flow-card">
          <p className="message message-erreur">Impossible de charger ton profil ({erreurProfil}).</p>
        </div>
      </div>
    )
  }

  if (!profil) {
    return (
      <div className="flow-page">
        <div className="flow-card">
          <p>Chargement…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flow-page">
      <div className="flow-card dashboard-card">
        <div className="dashboard-header">
          <h1>Bienvenue, {profil.prenom}</h1>
          <button type="button" className="dashboard-deconnexion" onClick={() => supabase.auth.signOut()}>
            Se déconnecter
          </button>
        </div>
        <p className="souscription">Espace formateur</p>

        <section className="dashboard-section">
          <h2>Mes cours</h2>
          {erreurCours ? (
            <p className="message message-erreur">Impossible de charger tes cours ({erreurCours}).</p>
          ) : (mesCours ?? []).length === 0 ? (
            <p className="dashboard-etat-vide">Aucun cours pour le moment.</p>
          ) : (
            <ul className="dashboard-liste">
              {mesCours.map((cours) => (
                <li key={cours.id}>
                  <button
                    type="button"
                    className="dashboard-liste-item-bouton"
                    onClick={() => onOuvrirCours(cours.id)}
                  >
                    <span className="dashboard-cours-titre">{cours.titre}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="bouton-ajouter" onClick={onCreerCours}>
            + Créer un cours
          </button>
        </section>

        <section className="dashboard-section">
          <h2>Mes groupes</h2>
          {erreurGroupes ? (
            <p className="message message-erreur">Impossible de charger tes groupes ({erreurGroupes}).</p>
          ) : (mesGroupes ?? []).length === 0 ? (
            <p className="dashboard-etat-vide">Aucun groupe pour le moment.</p>
          ) : (
            <ul className="dashboard-liste">
              {mesGroupes.map((groupe) => (
                <li key={groupe.id}>
                  <button
                    type="button"
                    className="dashboard-liste-item-bouton"
                    onClick={() => onOuvrirGroupe(groupe.id)}
                  >
                    <span className="dashboard-cours-titre">{groupe.nom}</span>
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
            <button type="submit" className="bouton-ajouter" disabled={creationGroupeEnCours}>
              + Créer un groupe
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default DashboardFormateur
