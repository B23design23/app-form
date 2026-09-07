import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import './DashboardFormateur.css'

function formaterDateRelative(dateIso) {
  const diffMs = Date.now() - new Date(dateIso).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMin / 60)
  const diffJours = Math.floor(diffH / 24)

  if (diffMin < 1) return "À l'instant"
  if (diffMin < 60) return `Il y a ${diffMin} min`
  if (diffH < 24) return `Il y a ${diffH}h`
  if (diffJours === 1) return 'Hier'
  return `Il y a ${diffJours} jours`
}

function DashboardFormateur({ authUser, onCreerCours, onChangerSection }) {
  const [profil, setProfil] = useState(null)
  const [erreurProfil, setErreurProfil] = useState(null)

  const [nbCours, setNbCours] = useState(null)
  const [nbGroupes, setNbGroupes] = useState(null)
  const [nbEleves, setNbEleves] = useState(null)
  const [erreurMetriques, setErreurMetriques] = useState(null)

  const [activite, setActivite] = useState(null)
  const [erreurActivite, setErreurActivite] = useState(null)

  useEffect(() => {
    let annule = false

    supabase
      .from('profiles')
      .select('prenom')
      .eq('id', authUser.id)
      .single()
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurProfil(error.message)
        else setProfil(data)
      })

    // La lecture directe de profiles pour un apprenant qui n'est pas soi-même est bloquée par
    // sa RLS (auth.uid() = id uniquement) — comme pour DetailGroupe.jsx, on résout les prénoms
    // via get_membres_groupe (déjà en place), pas de nouvelle fonction nécessaire.
    async function chargerActivite(groupeIds) {
      const prenomParApprenant = new Map()

      for (const groupeId of groupeIds) {
        const { data, error } = await supabase.rpc('get_membres_groupe', { p_groupe_id: groupeId })
        if (!error) {
          for (const membre of data ?? []) {
            prenomParApprenant.set(membre.id, membre.prenom)
          }
        }
      }

      const apprenantIds = [...prenomParApprenant.keys()]
      if (apprenantIds.length === 0) {
        if (!annule) setActivite([])
        return
      }

      const { data: progressionData, error: erreurProgression } = await supabase
        .from('progression')
        .select('id, statut, updated_at, user_id, cours(titre)')
        .in('user_id', apprenantIds)
        .order('updated_at', { ascending: false })
        .limit(5)

      if (annule) return

      if (erreurProgression) {
        setErreurActivite(erreurProgression.message)
        return
      }

      setActivite(
        (progressionData ?? []).map((ligne) => ({
          id: ligne.id,
          prenom: prenomParApprenant.get(ligne.user_id) ?? 'Un élève',
          statut: ligne.statut,
          titreCours: ligne.cours?.titre ?? 'un cours',
          updatedAt: ligne.updated_at,
        }))
      )
    }

    async function chargerMetriques() {
      const [coursRes, groupesRes] = await Promise.all([
        supabase.from('cours').select('id', { count: 'exact', head: true }).eq('formateur_id', authUser.id),
        supabase.from('groupes').select('id').eq('formateur_id', authUser.id),
      ])

      if (annule) return

      if (coursRes.error || groupesRes.error) {
        setErreurMetriques(coursRes.error?.message ?? groupesRes.error?.message)
        return
      }

      setNbCours(coursRes.count ?? 0)

      const groupeIds = (groupesRes.data ?? []).map((g) => g.id)
      setNbGroupes(groupeIds.length)

      if (groupeIds.length === 0) {
        setNbEleves(0)
        setActivite([])
        return
      }

      const { count, error } = await supabase
        .from('groupe_membres')
        .select('id', { count: 'exact', head: true })
        .in('groupe_id', groupeIds)

      if (annule) return
      if (error) {
        setErreurMetriques(error.message)
        return
      }
      setNbEleves(count ?? 0)

      await chargerActivite(groupeIds)
    }

    chargerMetriques()

    return () => {
      annule = true
    }
  }, [authUser.id])

  if (erreurProfil) {
    return (
      <div className="espace-page formateur-dashboard-page">
        <p className="message message-erreur">Impossible de charger ton profil ({erreurProfil}).</p>
      </div>
    )
  }

  if (!profil) {
    return (
      <div className="espace-page formateur-dashboard-page">
        <p>Chargement…</p>
      </div>
    )
  }

  return (
    <div className="espace-page formateur-dashboard-page">
      <div className="formateur-dashboard-entete">
        <h1>Bienvenue, {profil.prenom}</h1>
      </div>

      <div className="formateur-dashboard-gauche">
        {erreurMetriques ? (
          <p className="message message-erreur">
            Impossible de charger tes statistiques ({erreurMetriques}).
          </p>
        ) : (
          <div className="formateur-metriques">
            <div
              className={`espace-carte formateur-metrique${nbCours === 0 ? ' formateur-metrique-large' : ''}`}
            >
              {nbCours === 0 ? (
                <div className="formateur-metrique-vide">
                  <p>Crée ton premier cours</p>
                  <button type="button" className="bouton-ajouter" onClick={onCreerCours}>
                    + Nouveau cours
                  </button>
                </div>
              ) : (
                <>
                  <span className="formateur-metrique-valeur">{nbCours ?? '—'}</span>
                  <span className="formateur-metrique-label">Cours créés</span>
                </>
              )}
            </div>
            <div
              className={`espace-carte formateur-metrique${nbGroupes === 0 ? ' formateur-metrique-large' : ''}`}
            >
              {nbGroupes === 0 ? (
                <div className="formateur-metrique-vide">
                  <p>Crée ton premier groupe</p>
                  <button
                    type="button"
                    className="bouton-ajouter"
                    onClick={() => onChangerSection('groupes')}
                  >
                    + Nouveau groupe
                  </button>
                </div>
              ) : (
                <>
                  <span className="formateur-metrique-valeur">{nbGroupes ?? '—'}</span>
                  <span className="formateur-metrique-label">Groupes</span>
                </>
              )}
            </div>
            <div className="espace-carte formateur-metrique">
              <span className="formateur-metrique-valeur">{nbEleves ?? '—'}</span>
              <span className="formateur-metrique-label">Élèves au total</span>
            </div>
          </div>
        )}

        <div className="formateur-actions">
          <h2>Actions rapides</h2>
          <div className="formateur-actions-rapides">
            <button type="button" className="bouton-primaire" onClick={onCreerCours}>
              + Nouveau cours
            </button>
            <button type="button" className="bouton-secondaire" onClick={() => onChangerSection('groupes')}>
              + Nouveau groupe
            </button>
          </div>
        </div>
      </div>

      <div className="formateur-dashboard-droite">
        <section className="formateur-activite">
          <h2>Activité récente</h2>
          {erreurActivite ? (
            <p className="message message-erreur">
              Impossible de charger l'activité récente ({erreurActivite}).
            </p>
          ) : activite === null ? (
            <p>Chargement…</p>
          ) : activite.length === 0 ? (
            <p className="dashboard-etat-vide">Aucune activité récente.</p>
          ) : (
            <ul className="formateur-activite-liste">
              {activite.map((ligne) => (
                <li key={ligne.id} className="formateur-activite-ligne">
                  <span className="formateur-activite-texte">
                    <strong>{ligne.prenom}</strong> a {ligne.statut === 'termine' ? 'terminé' : 'commencé'}{' '}
                    <strong>{ligne.titreCours}</strong>
                  </span>
                  <span className="formateur-activite-date">{formaterDateRelative(ligne.updatedAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default DashboardFormateur
