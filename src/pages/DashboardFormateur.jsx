import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { salutation } from '../lib/salutation'
import Dropdown from '../components/Dropdown'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import './DashboardFormateur.css'

const OPTIONS_STATUT_ACTIVITE = [
  { value: 'tous', label: 'Tous' },
  { value: 'termine', label: 'Terminé' },
  { value: 'commence', label: 'Commencé' },
]

const OPTIONS_TRI_ACTIVITE = [
  { value: 'recent', label: 'Plus récent' },
  { value: 'nom', label: 'Nom (A→Z)' },
]

const LIMITE_ACTIVITE_FETCH = 50
const LIMITE_ACTIVITE_AFFICHEE = 6
const LIMITE_RELANCE_AFFICHEE = 5
const SEUIL_RELANCE_JOURS = 3

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

// Pas de vert "succès" dans la DA : on réutilise error/accent-warm/accent-star comme échelle de couleur.
function classeCouleurTaux(taux) {
  if (taux === null) return 'formateur-taux-valeur-neutre'
  if (taux < 40) return 'formateur-taux-valeur-error'
  if (taux < 70) return 'formateur-taux-valeur-warm'
  return 'formateur-taux-valeur-star'
}

function DashboardFormateur({ authUser, onCreerCours, onChangerSection }) {
  const [profil, setProfil] = useState(null)
  const [erreurProfil, setErreurProfil] = useState(null)

  const [nbCours, setNbCours] = useState(null)
  const [nbGroupes, setNbGroupes] = useState(null)
  const [nbEleves, setNbEleves] = useState(null)
  const [erreurMetriques, setErreurMetriques] = useState(null)

  // null = pas encore résolu (distinct d'un tableau vide = résolu mais aucun apprenant).
  const [apprenants, setApprenants] = useState(null)

  const [tauxCompletion, setTauxCompletion] = useState(null)
  const [relances, setRelances] = useState(null)
  const [relanceEtendue, setRelanceEtendue] = useState(false)
  const [erreurVueEnsemble, setErreurVueEnsemble] = useState(null)

  const [activite, setActivite] = useState(null)
  const [erreurActivite, setErreurActivite] = useState(null)
  const [activiteEtendue, setActiviteEtendue] = useState(false)

  const [rechercheActivite, setRechercheActivite] = useState('')
  const [rechercheActiviteDebouncee, setRechercheActiviteDebouncee] = useState('')
  const [filtreStatutActivite, setFiltreStatutActivite] = useState('tous')
  const [triActivite, setTriActivite] = useState('recent')

  useEffect(() => {
    const t = setTimeout(() => setRechercheActiviteDebouncee(rechercheActivite), 300)
    return () => clearTimeout(t)
  }, [rechercheActivite])

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
    async function chargerApprenants(groupeIds) {
      const prenomParApprenant = new Map()

      for (const groupeId of groupeIds) {
        const { data, error } = await supabase.rpc('get_membres_groupe', { p_groupe_id: groupeId })
        if (!error) {
          for (const membre of data ?? []) {
            prenomParApprenant.set(membre.id, membre.prenom)
          }
        }
      }

      if (annule) return
      setApprenants([...prenomParApprenant.entries()].map(([id, prenom]) => ({ id, prenom })))
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
        setApprenants([])
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

      await chargerApprenants(groupeIds)
    }

    chargerMetriques()

    return () => {
      annule = true
    }
  }, [authUser.id])

  // Taux de complétion moyen (sur toutes les lignes de progression des élèves du formateur)
  // + élèves dont un cours est resté "non_commence" plusieurs jours d'affilée.
  useEffect(() => {
    if (apprenants === null) return

    let annule = false

    async function chargerVueEnsemble() {
      if (apprenants.length === 0) {
        setTauxCompletion(null)
        setRelances([])
        return
      }

      const apprenantIds = apprenants.map((a) => a.id)
      const seuilRelance = new Date(Date.now() - SEUIL_RELANCE_JOURS * 86400000).toISOString()

      const [totalRes, termineRes, relanceRes] = await Promise.all([
        supabase.from('progression').select('id', { count: 'exact', head: true }).in('user_id', apprenantIds),
        supabase
          .from('progression')
          .select('id', { count: 'exact', head: true })
          .in('user_id', apprenantIds)
          .eq('statut', 'termine'),
        supabase
          .from('progression')
          .select('id, user_id, updated_at, cours(titre)')
          .in('user_id', apprenantIds)
          .eq('statut', 'non_commence')
          .lte('updated_at', seuilRelance)
          .order('updated_at', { ascending: true })
          .limit(LIMITE_ACTIVITE_FETCH),
      ])

      if (annule) return

      if (totalRes.error || termineRes.error || relanceRes.error) {
        setErreurVueEnsemble(totalRes.error?.message ?? termineRes.error?.message ?? relanceRes.error?.message)
        return
      }

      setTauxCompletion(totalRes.count ? Math.round(((termineRes.count ?? 0) / totalRes.count) * 100) : null)

      const prenomParApprenant = new Map(apprenants.map((a) => [a.id, a.prenom]))
      const dejaVus = new Set()
      const liste = []
      for (const ligne of relanceRes.data ?? []) {
        if (dejaVus.has(ligne.user_id)) continue
        dejaVus.add(ligne.user_id)
        liste.push({
          id: ligne.id,
          prenom: prenomParApprenant.get(ligne.user_id) ?? 'Un élève',
          titreCours: ligne.cours?.titre ?? 'un cours',
          updatedAt: ligne.updated_at,
        })
      }
      setRelances(liste)
    }

    chargerVueEnsemble()

    return () => {
      annule = true
    }
  }, [apprenants])

  useEffect(() => {
    if (apprenants === null) return

    let annule = false

    async function chargerActivite() {
      if (apprenants.length === 0) {
        setActivite([])
        return
      }

      const terme = rechercheActiviteDebouncee.trim().toLowerCase()
      const apprenantsFiltres = terme
        ? apprenants.filter((a) => (a.prenom ?? '').toLowerCase().includes(terme))
        : apprenants

      if (apprenantsFiltres.length === 0) {
        setActivite([])
        return
      }

      let requete = supabase
        .from('progression')
        .select('id, statut, updated_at, user_id, cours(titre)')
        .in(
          'user_id',
          apprenantsFiltres.map((a) => a.id)
        )

      if (filtreStatutActivite === 'termine') {
        requete = requete.eq('statut', 'termine')
      } else if (filtreStatutActivite === 'commence') {
        requete = requete.in('statut', ['non_commence', 'en_cours'])
      }

      const { data: progressionData, error: erreurProgression } = await requete
        .order('updated_at', { ascending: false })
        .limit(LIMITE_ACTIVITE_FETCH)

      if (annule) return

      if (erreurProgression) {
        setErreurActivite(erreurProgression.message)
        return
      }

      const prenomParApprenant = new Map(apprenants.map((a) => [a.id, a.prenom]))

      let lignes = (progressionData ?? []).map((ligne) => ({
        id: ligne.id,
        prenom: prenomParApprenant.get(ligne.user_id) ?? 'Un élève',
        statut: ligne.statut,
        titreCours: ligne.cours?.titre ?? 'un cours',
        updatedAt: ligne.updated_at,
      }))

      if (triActivite === 'nom') {
        lignes = [...lignes].sort((a, b) => a.prenom.localeCompare(b.prenom, 'fr'))
      }

      setActivite(lignes)
      setActiviteEtendue(false)
    }

    chargerActivite()

    return () => {
      annule = true
    }
  }, [apprenants, rechercheActiviteDebouncee, filtreStatutActivite, triActivite])

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

  const relancesAffichees = relanceEtendue ? relances ?? [] : (relances ?? []).slice(0, LIMITE_RELANCE_AFFICHEE)
  const relancePeutEtendre = (relances?.length ?? 0) > LIMITE_RELANCE_AFFICHEE

  const activiteAffichee = activiteEtendue ? activite ?? [] : (activite ?? []).slice(0, LIMITE_ACTIVITE_AFFICHEE)
  const activitePeutEtendre = (activite?.length ?? 0) > LIMITE_ACTIVITE_AFFICHEE

  return (
    <div className="espace-page formateur-dashboard-page">
      <div className="formateur-dashboard-entete">
        <h1>{salutation()} {profil.prenom}</h1>
      </div>

      <div className="formateur-ligne-visualisation">
        <div className="espace-carte formateur-taux-carte">
          <span className={`formateur-taux-valeur ${classeCouleurTaux(tauxCompletion)}`}>
            {tauxCompletion === null ? '—' : `${tauxCompletion}%`}
          </span>
          <span className="formateur-taux-label">Taux de complétion moyen</span>
          <span className="formateur-taux-souscription">Sur l'ensemble de vos groupes</span>
        </div>

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
      </div>

      <div className="formateur-ligne-actions">
        <section className="espace-carte formateur-relance">
          <h2>Élèves à relancer</h2>

          {erreurVueEnsemble ? (
            <p className="message message-erreur">Impossible de charger les relances ({erreurVueEnsemble}).</p>
          ) : relances === null ? (
            <p>Chargement…</p>
          ) : relances.length === 0 ? (
            <p className="dashboard-etat-vide">Aucun élève à relancer pour le moment.</p>
          ) : (
            <>
              <ul className="formateur-relance-liste">
                {relancesAffichees.map((eleve) => (
                  <li key={eleve.id} className="formateur-relance-ligne">
                    <span className="formateur-relance-texte">
                      <strong>{eleve.prenom}</strong> n'a pas commencé <strong>{eleve.titreCours}</strong>
                    </span>
                    <span className="formateur-relance-date">{formaterDateRelative(eleve.updatedAt)}</span>
                  </li>
                ))}
              </ul>
              {relancePeutEtendre && !relanceEtendue && (
                <button type="button" className="lien-secondaire" onClick={() => setRelanceEtendue(true)}>
                  Voir plus
                </button>
              )}
            </>
          )}
        </section>

        <div className="espace-carte formateur-actions">
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

      <section className="espace-carte formateur-activite">
        <h2>Activité récente</h2>

        {apprenants && apprenants.length > 0 && (
          <div className="formateur-activite-controles">
            <label className="champ formateur-activite-recherche">
              <span>Rechercher un élève</span>
              <input
                type="text"
                placeholder="Prénom de l'élève"
                value={rechercheActivite}
                onChange={(e) => setRechercheActivite(e.target.value)}
              />
            </label>

            <div className="formateur-activite-filtres">
              <label className="champ">
                <span>Statut</span>
                <Dropdown
                  value={filtreStatutActivite}
                  onChange={setFiltreStatutActivite}
                  options={OPTIONS_STATUT_ACTIVITE}
                />
              </label>

              <label className="champ">
                <span>Trier par</span>
                <Dropdown value={triActivite} onChange={setTriActivite} options={OPTIONS_TRI_ACTIVITE} />
              </label>
            </div>
          </div>
        )}

        {erreurActivite ? (
          <p className="message message-erreur">
            Impossible de charger l'activité récente ({erreurActivite}).
          </p>
        ) : activite === null ? (
          <p>Chargement…</p>
        ) : activite.length === 0 ? (
          <p className="dashboard-etat-vide">
            {rechercheActivite.trim()
              ? `Aucune activité trouvée pour « ${rechercheActivite.trim()} ».`
              : filtreStatutActivite !== 'tous'
                ? 'Aucune activité ne correspond au filtre sélectionné.'
                : 'Aucune activité récente.'}
          </p>
        ) : (
          <>
            <ul className="formateur-activite-liste">
              {activiteAffichee.map((ligne) => (
                <li key={ligne.id} className="formateur-activite-ligne">
                  <span className="formateur-activite-texte">
                    <strong>{ligne.prenom}</strong> a {ligne.statut === 'termine' ? 'terminé' : 'commencé'}{' '}
                    <strong>{ligne.titreCours}</strong>
                  </span>
                  <span className="formateur-activite-date">{formaterDateRelative(ligne.updatedAt)}</span>
                </li>
              ))}
            </ul>
            {activitePeutEtendre && !activiteEtendue && (
              <button type="button" className="lien-secondaire" onClick={() => setActiviteEtendue(true)}>
                Voir plus
              </button>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default DashboardFormateur
