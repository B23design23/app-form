import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { THEMATIQUES, libelleCourtTheme, IMAGE_TERRAIN } from '../lib/thematiques'
import EntetePage from '../components/EntetePage'
import { ListeCours, LigneCours } from '../components/LigneCours'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import './SectionModeTerrain.css'

function rangTheme(categorie) {
  const rang = THEMATIQUES.indexOf(categorie)
  return rang === -1 ? THEMATIQUES.length : rang
}

// Statut d'une checklist : « Terminé » via progression.checklist_terminee (logique existante).
// Il n'existe pas de suivi « checklist commencée » : « En cours » reprend le statut de
// progression du cours (en_cours). Rien n'est affiché pour une checklist non commencée.
function statutChecklist(progressionCours) {
  if (progressionCours?.checklist_terminee) return 'termine'
  if (progressionCours?.statut === 'en_cours') return 'en_cours'
  return null
}

function SectionModeTerrain({ authUser, onOuvrirCours }) {
  const [coursListe, setCoursListe] = useState(null)
  const [erreurCours, setErreurCours] = useState(null)
  const [progression, setProgression] = useState([])

  useEffect(() => {
    let annule = false

    supabase
      .from('cours')
      .select('id, titre, categorie, ordre, visibilite, etapes_checklist(id)')
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurCours(error.message)
        else setCoursListe(data ?? [])
      })

    supabase
      .from('progression')
      .select('cours_id, statut, checklist_terminee')
      .eq('user_id', authUser.id)
      .then(({ data, error }) => {
        if (annule) return
        if (!error) setProgression(data ?? [])
      })

    return () => {
      annule = true
    }
  }, [authUser.id])

  const progressionParCours = new Map(progression.map((p) => [p.cours_id, p]))

  // Tous les cours à checklist (publics et assignés) : en cours d'abord, puis ordre des thèmes,
  // puis ordre du cours dans le thème.
  const checklists = (coursListe ?? [])
    .filter((cours) => (cours.etapes_checklist?.length ?? 0) > 0)
    .map((cours) => ({ cours, statut: statutChecklist(progressionParCours.get(cours.id)) }))
    .sort(
      (a, b) =>
        (a.statut === 'en_cours' ? 0 : 1) - (b.statut === 'en_cours' ? 0 : 1) ||
        rangTheme(a.cours.categorie) - rangTheme(b.cours.categorie) ||
        (a.cours.ordre ?? Infinity) - (b.cours.ordre ?? Infinity) ||
        a.cours.titre.localeCompare(b.cours.titre)
    )

  return (
    <div className="espace-page espace-page-etroit page-terrain">
      <EntetePage
        titre="Terrain"
        sousTitre="Les checklists à suivre sur le chantier, étape par étape."
        image={IMAGE_TERRAIN}
        variante="terrain"
      />

      {erreurCours ? (
        <p className="message message-erreur">Impossible de charger les checklists ({erreurCours}).</p>
      ) : coursListe === null ? (
        <p>Chargement…</p>
      ) : checklists.length === 0 ? (
        <p className="dashboard-etat-vide">Aucune checklist terrain disponible pour le moment.</p>
      ) : (
        <ListeCours>
          {checklists.map(({ cours, statut }) => {
            const nbEtapes = cours.etapes_checklist.length
            const origine = cours.visibilite === 'prive' ? 'De ton formateur' : libelleCourtTheme(cours.categorie)
            return (
              <LigneCours
                key={cours.id}
                cours={cours}
                meta={`${origine} · ${nbEtapes} étape${nbEtapes > 1 ? 's' : ''}`}
                statut={statut}
                onClick={() => onOuvrirCours(cours.id, 'checklist')}
              />
            )
          })}
        </ListeCours>
      )}
    </div>
  )
}

export default SectionModeTerrain
