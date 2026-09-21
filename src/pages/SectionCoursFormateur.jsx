import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Dropdown from '../components/Dropdown'
import { THEMATIQUES } from '../lib/thematiques'
import '../styles/shared.css'
import '../styles/espace-layout.css'

const CLE_FILTRE_THEME = 'skillo:filtre-theme-cours-formateur'
const TOUS_THEMES = 'tous'
const OPTIONS_THEME = [
  { value: TOUS_THEMES, label: 'Tous les thèmes' },
  ...THEMATIQUES.map((t) => ({ value: t, label: t })),
]

function lireFiltreInitial() {
  try {
    const v = sessionStorage.getItem(CLE_FILTRE_THEME)
    return OPTIONS_THEME.some((o) => o.value === v) ? v : TOUS_THEMES
  } catch {
    return TOUS_THEMES
  }
}

function SectionCoursFormateur({ authUser, onOuvrirCours, onCreerCours }) {
  const [mesCours, setMesCours] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [filtreTheme, setFiltreTheme] = useState(lireFiltreInitial)

  function changerFiltreTheme(valeur) {
    setFiltreTheme(valeur)
    try {
      sessionStorage.setItem(CLE_FILTRE_THEME, valeur)
    } catch {
      // stockage indisponible : le filtre reste simplement non persistant
    }
  }

  const coursAffiches =
    mesCours && filtreTheme !== TOUS_THEMES ? mesCours.filter((c) => c.categorie === filtreTheme) : mesCours

  useEffect(() => {
    let annule = false

    supabase
      .from('cours')
      .select('id, titre, categorie')
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
    <div className="espace-page espace-page-etroit">
      <div className="section-formateur-entete">
        <h1>Mes cours</h1>
        <button type="button" className="bouton-secondaire" onClick={onCreerCours}>
          + Créer un cours
        </button>
      </div>

      <label className="champ section-formateur-filtre">
        <span>Filtrer par thème</span>
        <Dropdown value={filtreTheme} onChange={changerFiltreTheme} options={OPTIONS_THEME} />
      </label>

      {erreur ? (
        <p className="message message-erreur">Impossible de charger tes cours ({erreur}).</p>
      ) : mesCours === null ? (
        <p>Chargement…</p>
      ) : mesCours.length === 0 ? (
        <p className="dashboard-etat-vide dashboard-etat-vide-centre">Aucun cours pour le moment.</p>
      ) : coursAffiches.length === 0 ? (
        <p className="dashboard-etat-vide dashboard-etat-vide-centre">Aucun cours dans ce thème.</p>
      ) : (
        <ul className="espace-liste espace-liste-grille">
          {coursAffiches.map((cours) => (
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
    </div>
  )
}

export default SectionCoursFormateur
