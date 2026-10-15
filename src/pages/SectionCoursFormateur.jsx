import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Dropdown from '../components/Dropdown'
import { THEMATIQUES, libelleCourtTheme } from '../lib/thematiques'
import { partiesContenuCours } from '../lib/cours'
import Icone from '../components/Icone'
import iconeChevron from '../Assets/chevron-right.svg?raw'
import iconePlus from '../Assets/plus.svg?raw'
import { PastillesGroupes } from '../components/formateur/Elements'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import '../components/formateur/Formateur.css'
import './FormateurListes.css'
import { typo } from '../lib/typographie'

const CLE_FILTRE_THEME = 'skillo:filtre-theme-cours-formateur'
const TOUS = 'tous'
const OPTIONS_THEME = [{ value: TOUS, label: 'Tous les thèmes' }, ...THEMATIQUES.map((t) => ({ value: t, label: t }))]

function lireFiltreInitial() {
  try {
    const v = sessionStorage.getItem(CLE_FILTRE_THEME)
    return OPTIONS_THEME.some((o) => o.value === v) ? v : TOUS
  } catch {
    return TOUS
  }
}

// Mes cours : en-tête avec compteurs, filtres (recherche, thème, groupe), grille de cartes de cours.
function SectionCoursFormateur({ authUser, onOuvrirCours, onCreerCours }) {
  const [mesCours, setMesCours] = useState(null)
  const [groupes, setGroupes] = useState([])
  const [erreur, setErreur] = useState(null)
  const [recherche, setRecherche] = useState('')
  const [filtreTheme, setFiltreTheme] = useState(lireFiltreInitial)
  const [filtreGroupe, setFiltreGroupe] = useState(TOUS)

  function changerFiltreTheme(valeur) {
    setFiltreTheme(valeur)
    try {
      sessionStorage.setItem(CLE_FILTRE_THEME, valeur)
    } catch {
      // stockage indisponible : le filtre reste simplement non persistant
    }
  }

  useEffect(() => {
    let annule = false

    supabase
      .from('cours')
      .select('id, titre, categorie, contenu, questions(id), etapes_checklist(id), cours_groupes(groupes(id, nom))')
      .eq('formateur_id', authUser.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreur(error.message)
        else setMesCours(data ?? [])
      })

    supabase
      .from('groupes')
      .select('id, nom')
      .eq('formateur_id', authUser.id)
      .order('nom')
      .then(({ data }) => {
        if (!annule) setGroupes(data ?? [])
      })

    return () => {
      annule = true
    }
  }, [authUser.id])

  const groupesDe = (cours) => (cours.cours_groupes ?? []).map((cg) => cg.groupes).filter(Boolean)
  const nbAssignes = (mesCours ?? []).filter((c) => groupesDe(c).length > 0).length
  const terme = recherche.trim().toLowerCase()
  const coursAffiches = (mesCours ?? []).filter(
    (c) =>
      (!terme || c.titre.toLowerCase().includes(terme)) &&
      (filtreTheme === TOUS || c.categorie === filtreTheme) &&
      (filtreGroupe === TOUS || groupesDe(c).some((g) => g.id === filtreGroupe))
  )
  const optionsGroupe = [{ value: TOUS, label: 'Tous les groupes' }, ...groupes.map((g) => ({ value: g.id, label: g.nom }))]

  return (
    <div className="espace-page espace-page-etroit fm-page">
      <div className="fm-entete">
        <div className="fm-titres">
          <h1>Mes cours</h1>
          {mesCours && (
            <p className="fm-sous-titre">
              {mesCours.length} cours · {nbAssignes} assigné{nbAssignes > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button type="button" className="bouton-primaire fm-bouton-principal" onClick={onCreerCours} aria-label="Créer un cours">
          <Icone svg={iconePlus} className="fm-bouton-principal-icone" />
          <span className="fm-bouton-principal-libelle">+ Créer un cours</span>
        </button>
      </div>

      {mesCours && mesCours.length > 0 && (
        <div className="fm-filtres">
          <label className="champ fm-champ-blanc fm-recherche">
            <span className="fm-libelle-masque">Rechercher un cours</span>
            <input type="search" placeholder="Rechercher un cours" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
          </label>
          <label className="champ fm-champ-blanc fm-filtre">
            <span className="fm-libelle-masque">Thème</span>
            <Dropdown value={filtreTheme} onChange={changerFiltreTheme} options={OPTIONS_THEME} />
          </label>
          <label className="champ fm-champ-blanc fm-filtre">
            <span className="fm-libelle-masque">Groupe</span>
            <Dropdown value={filtreGroupe} onChange={setFiltreGroupe} options={optionsGroupe} />
          </label>
        </div>
      )}

      {erreur ? (
        <p className="message message-erreur">Impossible de charger tes cours ({erreur}).</p>
      ) : mesCours === null ? (
        <p>Chargement…</p>
      ) : mesCours.length === 0 ? (
        <p className="dashboard-etat-vide dashboard-etat-vide-centre">Aucun cours pour le moment.</p>
      ) : coursAffiches.length === 0 ? (
        <p className="dashboard-etat-vide dashboard-etat-vide-centre">Aucun cours ne correspond à ces filtres.</p>
      ) : (
        <ul className="fl-grille fl-grille-cours">
          {coursAffiches.map((cours) => (
            <li key={cours.id}>
              <button type="button" className="fl-carte" onClick={() => onOuvrirCours(cours.id)}>
                <span className="fl-carte-texte">
                  <span className="fl-carte-titre fl-carte-titre-cours">{typo(cours.titre)}</span>
                  <span className="fl-carte-meta">
                    {[libelleCourtTheme(cours.categorie), ...partiesContenuCours(cours)].join(' · ')}
                  </span>
                  <span className="fm-pastilles">
                    <PastillesGroupes groupes={groupesDe(cours)} />
                  </span>
                </span>
                <Icone svg={iconeChevron} className="chevron-ligne" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SectionCoursFormateur
