import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { THEMATIQUES, COULEUR_ANNEAU_THEME, numeroTheme } from '../lib/thematiques'
import StatutBadge from '../components/StatutBadge'
import AnneauProgression from '../components/AnneauProgression'
import CarteCours from '../components/CarteCours'
import DetailTheme from './DetailTheme'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import './SectionCours.css'

function correspondRecherche(cours, terme) {
  const t = terme.trim().toLowerCase()
  if (!t) return true
  return cours.titre.toLowerCase().includes(t)
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

function CarteTheme({ nom, index, termines, total, onClick }) {
  const ratio = total > 0 ? termines / total : 0

  return (
    <button type="button" className="theme-carte" onClick={onClick}>
      <AnneauProgression
        radius={18}
        strokeWidth={4}
        ratio={ratio}
        afficherTrait={total > 0}
        trackColor="#F4F4F6"
        progressColor={COULEUR_ANNEAU_THEME}
        wrapperClassName="theme-carte-anneau"
      >
        <span className="theme-carte-numero" style={{ color: COULEUR_ANNEAU_THEME }}>
          {numeroTheme(index)}
        </span>
      </AnneauProgression>
      <span className="theme-carte-titre">{nom}</span>
      <span className="theme-carte-compte">
        {termines}/{total} cours
      </span>
    </button>
  )
}

function SectionCours({ authUser, onOuvrirCours }) {
  const [coursListe, setCoursListe] = useState(null)
  const [erreurCours, setErreurCours] = useState(null)
  const [progression, setProgression] = useState([])
  const [recherche, setRecherche] = useState('')
  const [themeSelectionneIndex, setThemeSelectionneIndex] = useState(null)

  useEffect(() => {
    let annule = false

    supabase
      .from('cours')
      .select('id, titre, visibilite, categorie, contenu, questions(id), etapes_checklist(id)')
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

  const coursFormateurFiltres = coursFormateur.filter((c) => correspondRecherche(c, recherche))
  const coursPubliquesResultats = coursPublics.filter((c) => correspondRecherche(c, recherche))

  const rechercheActive = recherche.trim().length > 0

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
    <div className="espace-page espace-page-etroit">
      <h1 className="page-cours-titre">Cours</h1>

      <label className="champ">
        <span>Rechercher un cours</span>
        <input
          type="text"
          placeholder="Rechercher un cours..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
      </label>

      {erreurCours ? (
        <p className="message message-erreur">Impossible de charger les cours ({erreurCours}).</p>
      ) : coursListe === null ? (
        <p>Chargement…</p>
      ) : (
        <>
          {coursFormateur.length > 0 && (
            <section>
              <h2>Cours de mon formateur</h2>
              {coursFormateurFiltres.length === 0 ? (
                <p className="dashboard-etat-vide">Aucun cours trouvé pour « {recherche.trim()} ».</p>
              ) : (
                <ListeCours cours={coursFormateurFiltres} statutParCoursId={statutParCoursId} onOuvrirCours={onOuvrirCours} />
              )}
            </section>
          )}

          {rechercheActive ? (
            <section>
              <h2>Résultats</h2>
              {coursPubliquesResultats.length === 0 ? (
                <p className="dashboard-etat-vide">Aucun cours trouvé pour « {recherche.trim()} ».</p>
              ) : (
                <div className="carte-cours-grille">
                  {coursPubliquesResultats.map((cours) => (
                    <CarteCours
                      key={cours.id}
                      cours={cours}
                      statut={statutParCoursId.get(cours.id) ?? 'non_commence'}
                      onClick={() => onOuvrirCours(cours.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section>
              <div className="cours-bibliotheque-entete">
                <h2>Bibliothèque publique</h2>
                <span className="cours-badge-nb-themes">12 thèmes</span>
              </div>
              <div className="cours-grille-themes">
                {THEMATIQUES.map((nom, index) => {
                  const coursDuTheme = coursPublics.filter((c) => c.categorie === nom)
                  const termines = coursDuTheme.filter(
                    (c) => (statutParCoursId.get(c.id) ?? 'non_commence') === 'termine'
                  ).length
                  return (
                    <CarteTheme
                      key={nom}
                      nom={nom}
                      index={index}
                      termines={termines}
                      total={coursDuTheme.length}
                      onClick={() => setThemeSelectionneIndex(index)}
                    />
                  )
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

export default SectionCours
