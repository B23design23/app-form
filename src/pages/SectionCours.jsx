import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import StatutBadge from '../components/StatutBadge'
import Dropdown from '../components/Dropdown'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import './SectionCours.css'

const OPTIONS_FILTRE_STATUT = [
  { value: 'tous', label: 'Tous' },
  { value: 'non_commence', label: 'Non commencé' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'termine', label: 'Terminé' },
]

function correspondRecherche(cours, terme) {
  const t = terme.trim().toLowerCase()
  if (!t) return true
  return cours.titre.toLowerCase().includes(t)
}

function correspondStatut(cours, statutParCoursId, filtreStatut) {
  if (filtreStatut === 'tous') return true
  return (statutParCoursId.get(cours.id) ?? 'non_commence') === filtreStatut
}

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

function SectionCoursGroupe({ titre, coursBase, coursRecherches, coursFiltres, recherche, statutParCoursId, onOuvrirCours }) {
  return (
    <section>
      <h2>{titre}</h2>
      {coursBase.length === 0 ? (
        <p className="dashboard-etat-vide">Aucun cours disponible pour le moment.</p>
      ) : coursRecherches.length === 0 ? (
        <p className="dashboard-etat-vide">Aucun cours trouvé pour « {recherche.trim()} ».</p>
      ) : coursFiltres.length === 0 ? (
        <p className="dashboard-etat-vide">Aucun cours ne correspond au filtre sélectionné.</p>
      ) : (
        <ListeCours cours={coursFiltres} statutParCoursId={statutParCoursId} onOuvrirCours={onOuvrirCours} />
      )}
    </section>
  )
}

function SectionCours({ authUser, onOuvrirCours }) {
  const [coursListe, setCoursListe] = useState(null)
  const [erreurCours, setErreurCours] = useState(null)
  const [progression, setProgression] = useState([])

  const [recherche, setRecherche] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('tous')

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

  const coursPublicsRecherches = coursPublics.filter((c) => correspondRecherche(c, recherche))
  const coursPublicsFiltres = coursPublicsRecherches.filter((c) => correspondStatut(c, statutParCoursId, filtreStatut))

  const coursFormateurRecherches = coursFormateur.filter((c) => correspondRecherche(c, recherche))
  const coursFormateurFiltres = coursFormateurRecherches.filter((c) =>
    correspondStatut(c, statutParCoursId, filtreStatut)
  )

  const sectionPublics = (
    <SectionCoursGroupe
      titre="Cours publics"
      coursBase={coursPublics}
      coursRecherches={coursPublicsRecherches}
      coursFiltres={coursPublicsFiltres}
      recherche={recherche}
      statutParCoursId={statutParCoursId}
      onOuvrirCours={onOuvrirCours}
    />
  )

  const sectionFormateur = coursFormateur.length > 0 && (
    <SectionCoursGroupe
      titre="Cours de mon formateur"
      coursBase={coursFormateur}
      coursRecherches={coursFormateurRecherches}
      coursFiltres={coursFormateurFiltres}
      recherche={recherche}
      statutParCoursId={statutParCoursId}
      onOuvrirCours={onOuvrirCours}
    />
  )

  return (
    <div className="espace-page espace-page-etroit">
      <h1>Mes cours</h1>

      {erreurCours ? (
        <p className="message message-erreur">Impossible de charger les cours ({erreurCours}).</p>
      ) : coursListe === null ? (
        <p>Chargement…</p>
      ) : (
        <>
          {coursListe.length > 0 && (
            <div className="section-cours-controles">
              <label className="champ section-cours-recherche">
                <span>Rechercher un cours</span>
                <input
                  type="text"
                  placeholder="Titre du cours"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                />
              </label>

              <label className="champ section-cours-filtre-statut">
                <span>Filtrer par statut</span>
                <Dropdown value={filtreStatut} onChange={setFiltreStatut} options={OPTIONS_FILTRE_STATUT} />
              </label>
            </div>
          )}

          {coursFormateur.length > 0 ? (
            <>
              {sectionFormateur}
              {sectionPublics}
            </>
          ) : (
            sectionPublics
          )}
        </>
      )}
    </div>
  )
}

export default SectionCours
