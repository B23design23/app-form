import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { THEMATIQUES, imageTheme, libelleCourtTheme, IMAGE_COURS } from '../lib/thematiques'
import { partiesContenuCours } from '../lib/cours'
import { statutCoursAssigne } from '../lib/coursAssignes'
import { ListeCours, LigneCours } from '../components/LigneCours'
import BlocFormateur from '../components/BlocFormateur'
import EntetePage from '../components/EntetePage'
import Icone from '../components/Icone'
import StatutBadge from '../components/StatutBadge'
import iconeChevron from '../Assets/chevron-right.svg?raw'
import DetailTheme from './DetailTheme'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import './SectionCours.css'

// La recherche se déclenche à partir de 2 caractères ; en dessous, la page reste dans son état normal.
const LONGUEUR_MIN_RECHERCHE = 2

function correspondRecherche(cours, terme) {
  return cours.titre.toLowerCase().includes(terme.trim().toLowerCase())
}

function rangTheme(categorie) {
  const rang = THEMATIQUES.indexOf(categorie)
  return rang === -1 ? THEMATIQUES.length : rang
}

// Tri de la section « De ton formateur » de la page Cours (bibliothèque complète, terminés compris).
const RANG_STATUT_FORMATEUR = { en_cours: 0, nouveau: 1, a_faire: 2, termine: 3 }

// Carte de thème : objet 3D (remplace la pastille numéro), chevron, « Thème N », nom, état en bas.
function CarteTheme({ nom, index, termines, commences, total, onClick }) {
  const termine = total > 0 && termines === total
  return (
    <button type="button" className="theme-carte" onClick={onClick}>
      <span className="theme-carte-haut">
        <img className="theme-carte-objet" src={imageTheme(nom)} alt="" />
        <Icone svg={iconeChevron} className="chevron-ligne" />
      </span>
      <span className="theme-carte-numero">Thème {index + 1}</span>
      <span className="theme-carte-titre">{nom}</span>
      <span className="theme-carte-bas">
        {termine ? (
          <StatutBadge statut="termine" />
        ) : commences > 0 ? (
          <span className="theme-carte-compte theme-carte-compte-commence">
            {termines} / {total} cours
          </span>
        ) : (
          <span className="theme-carte-compte">{total} cours</span>
        )}
      </span>
    </button>
  )
}

// themeSelectionneIndex vit dans App : l'état survit à l'ouverture d'une fiche de cours (retour → thème)
function SectionCours({ authUser, onOuvrirCours, themeSelectionneIndex, onChangerTheme: setThemeSelectionneIndex, ancre, onAncreAtteinte }) {
  const [coursListe, setCoursListe] = useState(null)
  const [erreurCours, setErreurCours] = useState(null)
  const [progression, setProgression] = useState([])
  const [recherche, setRecherche] = useState('')
  const [assignations, setAssignations] = useState([])

  useEffect(() => {
    let annule = false

    supabase
      .from('cours')
      .select('id, titre, visibilite, categorie, ordre, contenu, questions(id), etapes_checklist(id)')
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

    // Dates d'assignation (migration 0004), pour le statut « Nouveau ». Sans elles : « À faire ».
    supabase.rpc('mes_cours_assignes').then(({ data, error }) => {
      if (annule) return
      if (error) console.error('mes_cours_assignes', error.message)
      else setAssignations(data ?? [])
    })

    return () => {
      annule = true
    }
  }, [authUser.id])

  const statutParCoursId = new Map(progression.map((p) => [p.cours_id, p.statut]))
  const coursPublics = (coursListe ?? []).filter((c) => c.visibilite === 'public')
  const coursFormateur = (coursListe ?? []).filter((c) => c.visibilite === 'prive')

  const rechercheActive = recherche.trim().length >= LONGUEUR_MIN_RECHERCHE

  // Résultats : tous les cours accessibles (publics et assignés), ordre des thèmes puis cours.ordre.
  const resultats = rechercheActive
    ? (coursListe ?? [])
        .filter((c) => correspondRecherche(c, recherche))
        .sort(
          (a, b) =>
            rangTheme(a.categorie) - rangTheme(b.categorie) ||
            (a.ordre ?? Infinity) - (b.ordre ?? Infinity) ||
            a.titre.localeCompare(b.titre)
        )
    : []

  const dateAssignation = new Map(assignations.map((a) => [a.cours_id, a.assigne_le]))
  const lignesFormateur = coursFormateur
    .map((c) => ({ cours: c, statut: statutCoursAssigne(statutParCoursId.get(c.id), dateAssignation.get(c.id)) }))
    .sort(
      (a, b) =>
        RANG_STATUT_FORMATEUR[a.statut] - RANG_STATUT_FORMATEUR[b.statut] ||
        (dateAssignation.get(b.cours.id) ?? '').localeCompare(dateAssignation.get(a.cours.id) ?? '') ||
        a.cours.titre.localeCompare(b.cours.titre)
    )

  // Un thème est terminé quand tous ses cours (publics) le sont.
  const etatThemes = THEMATIQUES.map((nom) => {
    const coursDuTheme = coursPublics.filter((c) => c.categorie === nom)
    const statuts = coursDuTheme.map((c) => statutParCoursId.get(c.id) ?? 'non_commence')
    return {
      nom,
      total: coursDuTheme.length,
      termines: statuts.filter((st) => st === 'termine').length,
      commences: statuts.filter((st) => st !== 'non_commence').length,
    }
  })
  const nbThemesTermines = etatThemes.filter((t) => t.total > 0 && t.termines === t.total).length

  // Défilement vers une section demandée depuis le dashboard, une fois les cours chargés.
  useEffect(() => {
    if (!ancre || coursListe === null) return
    document.getElementById(ancre)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onAncreAtteinte?.()
  }, [ancre, coursListe, onAncreAtteinte])

  if (themeSelectionneIndex !== null) {
    return (
      <DetailTheme
        authUser={authUser}
        nom={THEMATIQUES[themeSelectionneIndex]}
        index={themeSelectionneIndex}
        onRetour={() => setThemeSelectionneIndex(null)}
        onOuvrirCours={onOuvrirCours}
      />
    )
  }

  return (
    <div className="espace-page espace-page-etroit page-cours">
      <EntetePage
        titre="Cours"
        sousTitre={`${nbThemesTermines} thème${nbThemesTermines > 1 ? 's' : ''} terminé${nbThemesTermines > 1 ? 's' : ''} sur ${THEMATIQUES.length}`}
        image={IMAGE_COURS}
      >
        <input
          type="search"
          className="entete-page-recherche"
          aria-label="Rechercher un cours"
          placeholder="Rechercher un cours..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
      </EntetePage>

      {erreurCours ? (
        <p className="message message-erreur">Impossible de charger les cours ({erreurCours}).</p>
      ) : coursListe === null ? (
        <p>Chargement…</p>
      ) : (
        <>
          {rechercheActive ? (
            // Pendant une recherche : bloc formateur et grille des thèmes masqués.
            <div className="page-cours-section">
              <h2 className="page-cours-h2">
                {resultats.length} résultat{resultats.length > 1 ? 's' : ''}
              </h2>
              {resultats.length === 0 ? (
                <p className="page-cours-aucun-resultat">Aucun cours ne correspond à « {recherche.trim()} ».</p>
              ) : (
                <ListeCours>
                  {resultats.map((cours) => {
                    const statut = statutParCoursId.get(cours.id)
                    const origine = cours.visibilite === 'prive' ? 'De ton formateur' : libelleCourtTheme(cours.categorie)
                    return (
                      <LigneCours
                        key={cours.id}
                        cours={cours}
                        meta={[origine, ...partiesContenuCours(cours)].join(' · ')}
                        statut={statut === 'en_cours' || statut === 'termine' ? statut : null}
                        onClick={() => onOuvrirCours(cours.id)}
                      />
                    )
                  })}
                </ListeCours>
              )}
            </div>
          ) : (
            <>
              {lignesFormateur.length > 0 && (
                <BlocFormateur
                  id="cours-formateur"
                  lignes={lignesFormateur}
                  avecChevron
                  grille
                  onOuvrirCours={onOuvrirCours}
                  actionEntete={<span className="bloc-formateur-compteur">{lignesFormateur.length} cours</span>}
                />
              )}

              <div className="page-cours-section">
                <h2 className="page-cours-h2">Thèmes</h2>
                <div className="cours-grille-themes">
                  {etatThemes.map((theme, index) => (
                    <CarteTheme
                      key={theme.nom}
                      nom={theme.nom}
                      index={index}
                      termines={theme.termines}
                      commences={theme.commences}
                      total={theme.total}
                      onClick={() => setThemeSelectionneIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default SectionCours
