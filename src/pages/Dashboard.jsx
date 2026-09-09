import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { iconeBadge, libelleCondition } from '../lib/badges'
import { salutation } from '../lib/salutation'
import iconeXp from '../Assets/badge/Iconxp.svg'
import iconeFlash from '../Assets/flash.svg'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import './Dashboard.css'

function Dashboard({ authUser, onOuvrirCours, onOuvrirQuizFlash, onChangerSection }) {
  const [profil, setProfil] = useState(null)
  const [erreurProfil, setErreurProfil] = useState(null)

  const [progression, setProgression] = useState([])
  const [coursListe, setCoursListe] = useState([])
  const [erreurCours, setErreurCours] = useState(null)

  const [tousBadges, setTousBadges] = useState([])
  const [badgesObtenus, setBadgesObtenus] = useState([])
  const [erreurBadges, setErreurBadges] = useState(null)
  const [badgeSelectionne, setBadgeSelectionne] = useState(null)

  const [scoresQuizCours, setScoresQuizCours] = useState([])
  const [erreurScoresQuizCours, setErreurScoresQuizCours] = useState(null)

  const [coursAvecQuiz, setCoursAvecQuiz] = useState([])
  const [coursAvecChecklist, setCoursAvecChecklist] = useState([])

  useEffect(() => {
    let annule = false

    supabase
      .from('profiles')
      .select('prenom, xp_total')
      .eq('id', authUser.id)
      .single()
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurProfil(error.message)
        else setProfil(data)
      })

    supabase
      .from('progression')
      .select('cours_id, statut')
      .eq('user_id', authUser.id)
      .then(({ data, error }) => {
        if (annule) return
        if (!error) setProgression(data ?? [])
      })

    supabase
      .from('cours')
      .select('id, titre')
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurCours(error.message)
        else setCoursListe(data ?? [])
      })

    supabase
      .from('questions')
      .select('cours_id')
      .then(({ data, error }) => {
        if (annule) return
        if (!error) setCoursAvecQuiz(data ?? [])
      })

    supabase
      .from('etapes_checklist')
      .select('cours_id')
      .then(({ data, error }) => {
        if (annule) return
        if (!error) setCoursAvecChecklist(data ?? [])
      })

    supabase
      .from('badges')
      .select('id, nom, icone, description, condition_deblocage')
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurBadges(error.message)
        else setTousBadges(data ?? [])
      })

    supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', authUser.id)
      .then(({ data, error }) => {
        if (annule) return
        if (!error) setBadgesObtenus(data ?? [])
      })

    supabase
      .from('scores')
      .select('cours_id')
      .eq('user_id', authUser.id)
      .eq('type', 'quiz_cours')
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurScoresQuizCours(error.message)
        else setScoresQuizCours(data ?? [])
      })

    return () => {
      annule = true
    }
  }, [authUser.id])

  if (erreurProfil) {
    return (
      <div className="espace-page espace-page-etroit">
        <p className="message message-erreur">Impossible de charger ton profil ({erreurProfil}).</p>
      </div>
    )
  }

  if (!profil) {
    return (
      <div className="espace-page espace-page-etroit">
        <p>Chargement…</p>
      </div>
    )
  }

  const statutParCoursId = new Map(progression.map((p) => [p.cours_id, p.statut]))
  const totalCours = coursListe.length
  const coursTermines = coursListe.filter((c) => statutParCoursId.get(c.id) === 'termine').length
  const ratioGlobal = totalCours > 0 ? coursTermines / totalCours : 0
  const circonference = 2 * Math.PI * 42

  const coursEnCours = coursListe.find((c) => statutParCoursId.get(c.id) === 'en_cours')
  const coursNonCommence = coursListe.find((c) => statutParCoursId.get(c.id) !== 'termine' && statutParCoursId.get(c.id) !== 'en_cours')
  const coursAMettreEnAvant = coursEnCours ?? coursNonCommence ?? null
  const idsObtenus = new Set(badgesObtenus.map((b) => b.badge_id))
  const nbCoursQuizTermines = new Set(scoresQuizCours.map((s) => s.cours_id)).size
  const quizFlashDebloque = nbCoursQuizTermines >= 3

  const idsCoursAvecQuiz = new Set(coursAvecQuiz.map((q) => q.cours_id))
  const idsCoursAvecChecklist = new Set(coursAvecChecklist.map((e) => e.cours_id))
  const idsCoursQuizFait = new Set(scoresQuizCours.map((s) => s.cours_id))

  const statutCoursMisEnAvant = coursAMettreEnAvant ? statutParCoursId.get(coursAMettreEnAvant.id) : null
  const recapCoursMisEnAvant = coursAMettreEnAvant
    ? [
        { cle: 'lecon', icone: '📖', label: 'Leçon', fait: statutCoursMisEnAvant === 'en_cours' || statutCoursMisEnAvant === 'termine' },
        idsCoursAvecQuiz.has(coursAMettreEnAvant.id) && {
          cle: 'quiz',
          icone: '❓',
          label: 'Quiz',
          fait: idsCoursQuizFait.has(coursAMettreEnAvant.id),
        },
        idsCoursAvecChecklist.has(coursAMettreEnAvant.id) && {
          cle: 'checklist',
          icone: '✅',
          label: 'Checklist',
          fait: statutCoursMisEnAvant === 'termine',
        },
      ].filter(Boolean)
    : []

  const LIMITE_RECOMMANDES = 6
  const coursNonCommences = coursListe.filter((c) => {
    const statut = statutParCoursId.get(c.id)
    return (!statut || statut === 'non_commence') && c.id !== coursAMettreEnAvant?.id
  })
  const coursRecommandes = coursNonCommences.slice(0, LIMITE_RECOMMANDES)

  return (
    <div className="espace-page espace-page-etroit apprenant-dashboard-grille">
      <div className="apprenant-entete">
        <h1>{salutation()} {profil.prenom} !</h1>
      </div>

      <div className="apprenant-metriques">
        <div className="espace-carte apprenant-metrique apprenant-metrique-xp">
          <span className="apprenant-metrique-valeur apprenant-metrique-valeur-xp">
            <img className="apprenant-xp-icone" src={iconeXp} alt="" aria-hidden="true" />
            {profil.xp_total}
          </span>
          <span className="apprenant-metrique-label">XP total</span>
        </div>
        <div className="espace-carte apprenant-metrique">
          <span className="apprenant-metrique-valeur">{coursTermines}</span>
          <span className="apprenant-metrique-label">Cours terminés</span>
        </div>
        <div className="espace-carte apprenant-metrique">
          <span className="apprenant-metrique-valeur">
            {badgesObtenus.length}/{tousBadges.length}
          </span>
          <span className="apprenant-metrique-label">Badges obtenus</span>
        </div>
      </div>

      <section className="espace-carte apprenant-section-badges">
        <h2>Badges</h2>
        {erreurBadges ? (
          <p className="message message-erreur">Impossible de charger tes badges ({erreurBadges}).</p>
        ) : (
          <div className="apprenant-badges-rangee">
            {tousBadges.map((badge) => {
              const obtenu = idsObtenus.has(badge.id)
              return (
                <button
                  key={badge.id}
                  type="button"
                  className="apprenant-badge-tuile"
                  title={obtenu ? badge.nom : `${badge.nom} (verrouillé)`}
                  onClick={() => setBadgeSelectionne({ ...badge, obtenu })}
                >
                  <span className={`apprenant-badge${obtenu ? ' apprenant-badge-obtenu' : ' apprenant-badge-verrouille'}`}>
                    {obtenu ? (
                      <img
                        className="apprenant-badge-icone"
                        src={iconeBadge(badge.icone)}
                        alt=""
                        aria-hidden="true"
                      />
                    ) : (
                      <span aria-hidden="true">🔒</span>
                    )}
                  </span>
                  <span className="apprenant-badge-nom">{badge.nom}</span>
                </button>
              )
            })}
          </div>
        )}
      </section>

      <div className="espace-carte espace-carte-continuer">
        <div className="apprenant-continuer-layout">
          <div className="apprenant-continuer-anneau-wrapper">
            <svg viewBox="0 0 100 100" className="apprenant-continuer-anneau" aria-hidden="true">
              <circle cx="50" cy="50" r="42" stroke="var(--color-anneau-fond)" strokeWidth="9" fill="none" />
              {totalCours > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="var(--color-primary)"
                  strokeWidth="9"
                  fill="none"
                  strokeDasharray={circonference}
                  strokeDashoffset={circonference * (1 - ratioGlobal)}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              )}
            </svg>
            {totalCours > 0 && (
              <span className="apprenant-continuer-anneau-pourcentage">{Math.round(ratioGlobal * 100)}%</span>
            )}
          </div>

          <div className="apprenant-continuer-info">
            {erreurCours ? (
              <p className="message message-erreur">Impossible de charger tes cours ({erreurCours}).</p>
            ) : (
              <>
                <p className="apprenant-continuer-legende">
                  {coursTermines}/{totalCours} cours terminés
                </p>
                {coursAMettreEnAvant ? (
                  <>
                    <p className="apprenant-continuer-titre">{coursAMettreEnAvant.titre}</p>

                    {recapCoursMisEnAvant.length > 0 && (
                      <ul className="apprenant-continuer-recap">
                        {recapCoursMisEnAvant.map((item) => (
                          <li
                            key={item.cle}
                            className={`apprenant-continuer-recap-puce${item.fait ? ' apprenant-continuer-recap-puce-faite' : ''}`}
                          >
                            <span aria-hidden="true">{item.fait ? '✓' : item.icone}</span>
                            {item.label}
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      type="button"
                      className="bouton-primaire"
                      onClick={() => onOuvrirCours(coursAMettreEnAvant.id)}
                    >
                      Continuer
                    </button>
                  </>
                ) : totalCours > 0 ? (
                  <>
                    <p className="apprenant-continuer-titre">Bravo, tous tes cours sont terminés !</p>
                    <button type="button" className="bouton-primaire" onClick={() => onChangerSection('cours')}>
                      Revoir mes cours
                    </button>
                  </>
                ) : (
                  <p className="apprenant-continuer-titre">Aucun cours disponible pour le moment.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="espace-carte apprenant-banniere-quizflash">
        {erreurScoresQuizCours ? (
          <p className="message message-erreur">
            Impossible de vérifier le quiz flash ({erreurScoresQuizCours}).
          </p>
        ) : quizFlashDebloque ? (
          <>
            <p>Un petit quiz flash pour tester tes connaissances et gratter de l'XP ?</p>
            <button type="button" className="bouton-secondaire" onClick={onOuvrirQuizFlash}>
              <img className="cta-icone" src={iconeFlash} alt="" aria-hidden="true" />
              Lancer le quiz flash
            </button>
          </>
        ) : (
          <p className="apprenant-banniere-verrouillee">🔒 Termine 3 quiz pour débloquer le quiz flash</p>
        )}
      </div>

      <section className="apprenant-section-recommandes">
        <h2>Cours recommandés</h2>

        {erreurCours ? (
          <p className="message message-erreur">Impossible de charger les cours recommandés ({erreurCours}).</p>
        ) : coursRecommandes.length === 0 ? (
          <p className="dashboard-etat-vide">Tu as déjà commencé tous les cours disponibles, bravo !</p>
        ) : (
          <>
            <ul className="espace-liste dashboard-recommandes-grille">
              {coursRecommandes.map((cours) => (
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

            {coursNonCommences.length > LIMITE_RECOMMANDES && (
              <button type="button" className="lien-secondaire" onClick={() => onChangerSection('cours')}>
                Voir tous les cours
              </button>
            )}
          </>
        )}
      </section>

      {badgeSelectionne && (
        <div className="badge-modal-overlay" onClick={() => setBadgeSelectionne(null)}>
          <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
            <div
              className={`apprenant-badge badge-modal-icone${badgeSelectionne.obtenu ? ' apprenant-badge-obtenu' : ' apprenant-badge-verrouille'}`}
              aria-hidden="true"
            >
              {badgeSelectionne.obtenu ? (
                <img className="apprenant-badge-icone" src={iconeBadge(badgeSelectionne.icone)} alt="" />
              ) : (
                '🔒'
              )}
            </div>
            <h3>{badgeSelectionne.nom}</h3>
            <p>
              {badgeSelectionne.obtenu
                ? badgeSelectionne.description
                : `Verrouillé — ${libelleCondition(badgeSelectionne.condition_deblocage)}`}
            </p>
            <button type="button" className="bouton-primaire" onClick={() => setBadgeSelectionne(null)}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
