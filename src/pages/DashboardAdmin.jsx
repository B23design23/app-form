import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { libelleCourtTheme } from '../lib/thematiques'
import { typo } from '../lib/typographie'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import '../components/formateur/Formateur.css'
import './DashboardFormateur.css'

// Dashboard du compte officiel (est_admin) : cours publics uniquement, aucun groupe, aucun nom
// d'élève — seulement des chiffres agrégés.
//
// La RLS de progression / scores ne laisse pas l'admin lire les lignes des apprenants (il n'a pas
// de groupe) : les chiffres viennent de la RPC stats_admin_cours_publics() (SECURITY DEFINER,
// réservée aux comptes est_admin, renvoie uniquement des agrégats). Tant qu'elle n'existe pas en
// base (migration 0008), les chiffres s'affichent « — ». Score moyen depuis le lancement, les deux
// autres chiffres sur 30 jours : la précision est affichée sous chaque chiffre.

const nombre = (n) => (n === null || n === undefined ? '—' : String(n))
const pourcentage = (n) => (n === null || n === undefined ? '—' : `${Math.round(n)} %`)

function DashboardAdmin({ titre, onCreerCours, onChangerSection }) {
  const [nbCoursPublics, setNbCoursPublics] = useState(null)
  const [stats, setStats] = useState(null)
  const [statsIndisponibles, setStatsIndisponibles] = useState(false)

  useEffect(() => {
    let annule = false

    supabase
      .from('cours')
      .select('id', { count: 'exact', head: true })
      .eq('visibilite', 'public')
      .then(({ count }) => !annule && setNbCoursPublics(count ?? 0))

    supabase.rpc('stats_admin_cours_publics').then(({ data, error }) => {
      if (annule) return
      if (error || !data) {
        console.error('Statistiques admin indisponibles :', error)
        setStatsIndisponibles(true)
        return
      }
      setStats(data)
    })

    return () => {
      annule = true
    }
  }, [])

  const coursSuivis = stats?.cours ?? []

  const chiffres = [
    { libelle: 'Apprenants actifs', valeur: nombre(stats?.apprenants_actifs), precision: '30 derniers jours' },
    { libelle: 'Cours terminés', valeur: nombre(stats?.cours_termines), precision: '30 derniers jours' },
    { libelle: 'Score moyen au quiz', valeur: pourcentage(stats?.score_moyen), precision: 'Depuis le lancement' },
  ]

  return (
    <div className="espace-page espace-page-etroit formateur-dashboard-page">
      <div className="fd-entete">
        <div className="fd-titres">
          <h1>{titre}</h1>
          <p className="fd-sous-titre fd-sous-titre-admin">
            <span className="fd-pastille-officiel">Compte officiel</span>
            {nbCoursPublics !== null && <span>{nbCoursPublics} cours public{nbCoursPublics > 1 ? 's' : ''}</span>}
          </p>
        </div>
        <div className="fd-entete-actions fd-entete-actions-admin">
          <button type="button" className="bouton-primaire fd-bouton-entete" onClick={onCreerCours}>
            + Nouveau cours
          </button>
        </div>
      </div>

      <div className="fd-chiffres">
        {chiffres.map((c) => (
          <div key={c.libelle} className="fd-chiffre">
            <span className="fd-chiffre-libelle">{c.libelle}</span>
            <span className="fd-chiffre-valeur">{c.valeur}</span>
            <span className="fd-chiffre-precision">{c.precision}</span>
          </div>
        ))}
      </div>

      <section className="espace-carte fd-carte">
        <div className="fd-carte-entete">
          <h2>Cours les plus suivis</h2>
          <button type="button" className="fd-lien" onClick={() => onChangerSection('cours')}>
            Tous les cours
          </button>
        </div>

        {statsIndisponibles ? (
          <p className="fd-vide">Statistiques indisponibles pour le moment.</p>
        ) : stats === null ? (
          <p className="fm-texte">Chargement…</p>
        ) : coursSuivis.length === 0 ? (
          <p className="fd-vide">Aucun cours public n'a encore été ouvert.</p>
        ) : (
          <table className="fd-tableau">
            <thead>
              <tr>
                <th scope="col">Cours</th>
                <th scope="col">Commencés</th>
                <th scope="col">Terminés</th>
                <th scope="col">Score moyen</th>
              </tr>
            </thead>
            <tbody>
              {coursSuivis.map((c) => (
                <tr key={c.id}>
                  <th scope="row">
                    <span className="fd-tableau-titre">{typo(c.titre)}</span>
                    <span className="fd-tableau-theme">{libelleCourtTheme(c.categorie)}</span>
                    {/* Mobile : les chiffres passent sous le titre, en une ligne */}
                    <span className="fd-tableau-resume">
                      {c.commences} commencé{c.commences > 1 ? 's' : ''} · {c.termines} terminé{c.termines > 1 ? 's' : ''} ·{' '}
                      {pourcentage(c.score_moyen)}
                    </span>
                  </th>
                  <td>{c.commences}</td>
                  <td>{c.termines}</td>
                  <td>{pourcentage(c.score_moyen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export default DashboardAdmin
