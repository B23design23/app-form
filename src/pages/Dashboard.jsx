import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { iconeBadge } from '../lib/badges'
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
      .from('badges')
      .select('id, nom, icone, description')
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
      <div className="espace-page">
        <p className="message message-erreur">Impossible de charger ton profil ({erreurProfil}).</p>
      </div>
    )
  }

  if (!profil) {
    return (
      <div className="espace-page">
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

  return (
    <div className="espace-page apprenant-dashboard-grille">
      <div className="apprenant-entete">
        <h1>Salut, {profil.prenom} !</h1>
        <span className="apprenant-xp-pastille">
          <span aria-hidden="true">⚡</span> {profil.xp_total} XP
        </span>
      </div>

      <div className="espace-carte espace-carte-continuer">
        <div className="apprenant-continuer-layout">
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

      <div className="espace-carte espace-carte-badges">
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
                  className={`apprenant-badge${obtenu ? ' apprenant-badge-obtenu' : ' apprenant-badge-verrouille'}`}
                  title={obtenu ? badge.nom : `${badge.nom} (verrouillé)`}
                  onClick={() => setBadgeSelectionne({ ...badge, obtenu })}
                >
                  <span aria-hidden="true">{obtenu ? iconeBadge(badge.icone) : '🔒'}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="espace-carte apprenant-banniere-quizflash">
        {erreurScoresQuizCours ? (
          <p className="message message-erreur">
            Impossible de vérifier le quiz flash ({erreurScoresQuizCours}).
          </p>
        ) : quizFlashDebloque ? (
          <>
            <p>Un petit quiz flash pour tester tes connaissances et gratter de l'XP ?</p>
            <button type="button" className="bouton-primaire" onClick={onOuvrirQuizFlash}>
              Lancer le quiz flash
            </button>
          </>
        ) : (
          <p className="apprenant-banniere-verrouillee">🔒 Termine 3 quiz pour débloquer le quiz flash</p>
        )}
      </div>

      {badgeSelectionne && (
        <div className="badge-modal-overlay" onClick={() => setBadgeSelectionne(null)}>
          <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
            <div
              className={`apprenant-badge badge-modal-icone${badgeSelectionne.obtenu ? ' apprenant-badge-obtenu' : ' apprenant-badge-verrouille'}`}
              aria-hidden="true"
            >
              {badgeSelectionne.obtenu ? iconeBadge(badgeSelectionne.icone) : '🔒'}
            </div>
            <h3>{badgeSelectionne.nom}</h3>
            <p>{badgeSelectionne.obtenu ? badgeSelectionne.description : `Verrouillé — ${badgeSelectionne.description}`}</p>
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
