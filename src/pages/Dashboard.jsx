import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { iconeBadge } from '../lib/badges'
import '../styles/shared.css'
import './Dashboard.css'

const LABEL_STATUT = {
  non_commence: 'Non commencé',
  en_cours: 'En cours',
  termine: 'Terminé',
}

function Dashboard({ authUser, onOuvrirCours }) {
  const [profil, setProfil] = useState(null)
  const [erreurProfil, setErreurProfil] = useState(null)

  const [progression, setProgression] = useState(null)
  const [erreurProgression, setErreurProgression] = useState(null)

  const [coursDisponibles, setCoursDisponibles] = useState(null)
  const [erreurCours, setErreurCours] = useState(null)

  const [badgesObtenus, setBadgesObtenus] = useState(null)
  const [erreurBadges, setErreurBadges] = useState(null)

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
      .select('cours_id, statut, cours(titre)')
      .eq('user_id', authUser.id)
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurProgression(error.message)
        else setProgression(data)
      })

    supabase
      .from('cours')
      .select('id, titre, etapes_checklist(id)')
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurCours(error.message)
        else setCoursDisponibles(data)
      })

    supabase
      .from('user_badges')
      .select('badge_id, date_obtention, badges(nom, icone)')
      .eq('user_id', authUser.id)
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurBadges(error.message)
        else setBadgesObtenus(data)
      })

    return () => {
      annule = true
    }
  }, [authUser.id])

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

  const coursAvecChecklist = (coursDisponibles ?? []).filter((cours) => (cours.etapes_checklist?.length ?? 0) > 0)
  const statutParCoursId = new Map((progression ?? []).map((p) => [p.cours_id, p.statut]))

  const coursCommences = progression?.length ?? 0
  const coursTermines = (progression ?? []).filter((p) => p.statut === 'termine').length
  const ratioMaitrise = coursCommences > 0 ? coursTermines / coursCommences : 0
  const circonference = 2 * Math.PI * 52
  const decalage = circonference * (1 - ratioMaitrise)

  return (
    <div className="flow-page">
      <div className="flow-card dashboard-card">
        <h1>Bienvenue, {profil.prenom}</h1>

        <div className="dashboard-progression">
          <svg viewBox="0 0 120 120" className="dashboard-anneau" aria-hidden="true">
            <circle cx="60" cy="60" r="52" stroke="#e2e6ea" strokeWidth="10" fill="none" />
            {coursCommences > 0 && (
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="var(--color-primary)"
                strokeWidth="10"
                fill="none"
                strokeDasharray={circonference}
                strokeDashoffset={decalage}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            )}
          </svg>
          {erreurProgression ? (
            <p className="message message-erreur">
              Impossible de charger ta progression ({erreurProgression}).
            </p>
          ) : coursCommences === 0 ? (
            <p className="dashboard-progression-legende">Aucun cours commencé pour l'instant</p>
          ) : (
            <p className="dashboard-progression-legende">
              {coursTermines} / {coursCommences} cours terminés
            </p>
          )}
        </div>

        <div className="dashboard-xp">
          <span className="dashboard-xp-valeur">{profil.xp_total}</span>
          <span className="dashboard-xp-label">XP</span>
        </div>

        <section className="dashboard-section">
          <h2>Badges</h2>
          {erreurBadges ? (
            <p className="message message-erreur">Impossible de charger tes badges ({erreurBadges}).</p>
          ) : (badgesObtenus ?? []).length === 0 ? (
            <p className="dashboard-etat-vide">Aucun badge débloqué pour l'instant.</p>
          ) : (
            <ul className="dashboard-liste">
              {badgesObtenus.map((userBadge) => (
                <li key={userBadge.badge_id} className="dashboard-liste-item-texte">
                  {iconeBadge(userBadge.badges?.icone)} {userBadge.badges?.nom}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Mes cours</h2>
          {erreurCours ? (
            <p className="message message-erreur">Impossible de charger les cours ({erreurCours}).</p>
          ) : (coursDisponibles ?? []).length === 0 ? (
            <p className="dashboard-etat-vide">Aucun cours disponible pour le moment.</p>
          ) : (
            <ul className="dashboard-liste">
              {coursDisponibles.map((cours) => {
                const statut = statutParCoursId.get(cours.id) ?? 'non_commence'
                return (
                  <li key={cours.id}>
                    <button
                      type="button"
                      className="dashboard-liste-item-bouton"
                      onClick={() => onOuvrirCours(cours.id)}
                    >
                      <span className="dashboard-cours-titre">{cours.titre}</span>
                      <span className={`dashboard-statut dashboard-statut-${statut}`}>
                        {statut === 'termine' ? (
                          <span className="dashboard-statut-icone" aria-hidden="true">
                            ✓
                          </span>
                        ) : (
                          <span className="dashboard-statut-pastille" aria-hidden="true" />
                        )}
                        {LABEL_STATUT[statut]}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Mode terrain</h2>
          {erreurCours ? (
            <p className="message message-erreur">Impossible de charger les checklists ({erreurCours}).</p>
          ) : coursAvecChecklist.length === 0 ? (
            <p className="dashboard-etat-vide">Aucune checklist terrain disponible pour le moment.</p>
          ) : (
            <ul className="dashboard-liste">
              {coursAvecChecklist.map((cours) => (
                <li key={cours.id}>
                  <button
                    type="button"
                    className="dashboard-liste-item-bouton"
                    onClick={() => onOuvrirCours(cours.id, 'checklist')}
                  >
                    {cours.titre}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default Dashboard
