import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { salutation } from '../lib/salutation'
import AnneauProgression from '../components/AnneauProgression'
import ModaleNouveauGroupe from '../components/formateur/ModaleNouveauGroupe'
import { BarreFine } from '../components/formateur/Elements'
import iconeAlerte from '../Assets/alert.svg?raw'
import iconeCoche from '../Assets/check.svg?raw'
import iconeChevron from '../Assets/chevron-right.svg?raw'
import iconeLoupe from '../Assets/loupe.svg?raw'
import iconeSend from '../Assets/Iconex/Broken/Send.svg?raw'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import '../components/formateur/Formateur.css'
import './DashboardFormateur.css'
import Icone from '../components/Icone'
import DashboardAdmin from './DashboardAdmin'
import { typo } from '../lib/typographie'
import { relancerParEmail } from '../lib/relance'
import {
  SEUIL_RELANCE_JOURS,
  couplesAssignes,
  joursDepuis,
  libelleDerniereActivite,
  statsGroupe,
  tauxCompletionGlobal,
} from '../lib/groupes'

// Dashboard formateur (lot dashboard-formateur) : trois cas, dans cet ordre —
// compte est_admin → DashboardAdmin ; aucun élève dans les groupes → « Pour bien démarrer » ;
// sinon en-tête + complétion, Tes groupes, Élèves à relancer, Activité récente.

const LIMITE_RELANCE_AFFICHEE = 3
const LIMITE_GROUPES = 3
const PAGE_ACTIVITE = 10

const FILTRES_ACTIVITE = [
  { id: 'tout', libelle: 'Tout', statuts: ['en_cours', 'termine'] },
  { id: 'commences', libelle: 'Commencés', statuts: ['en_cours'] },
  { id: 'termines', libelle: 'Terminés', statuts: ['termine'] },
]

const pluriel = (n, mot, motPluriel = `${mot}s`) => `${n} ${n > 1 ? motPluriel : mot}`
const nomComplet = (e) => `${e?.prenom ?? ''} ${e?.nom ?? ''}`.trim() || 'Un élève'
const initiales = (e) => `${(e?.prenom ?? '').trim()[0] ?? ''}${(e?.nom ?? '').trim()[0] ?? ''}`.toUpperCase() || '?'

// Intertitres du fil : « Aujourd'hui », « Hier », puis la date courte en français (« 11 sept. »),
// avec l'année seulement si elle diffère de l'année en cours (« 28 déc. 2025 »).
const FORMAT_JOUR = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' })
const FORMAT_JOUR_ANNEE = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

function libelleJour(dateIso) {
  const jours = joursDepuis(dateIso)
  if (jours === 0) return 'Aujourd’hui'
  if (jours === 1) return 'Hier'
  const date = new Date(dateIso)
  return (date.getFullYear() === new Date().getFullYear() ? FORMAT_JOUR : FORMAT_JOUR_ANNEE).format(date)
}

function dateRelance(dateIso) {
  const jours = joursDepuis(dateIso)
  if (jours === 0) return 'Aujourd’hui'
  if (jours === 1) return 'Hier'
  return `Il y a ${jours} jours`
}

// Données communes : groupes (les plus récents d'abord), membres, cours assignés, élèves (nom
// complet via get_membres_groupe : la RLS de profiles bloque la lecture directe), progression
// des élèves sur les cours assignés.
function useDonneesFormateur(authUser, actif) {
  const [donnees, setDonnees] = useState(null)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    if (!actif) return
    let annule = false

    async function charger() {
      const [coursRes, groupesRes] = await Promise.all([
        supabase.from('cours').select('id', { count: 'exact', head: true }).eq('formateur_id', authUser.id),
        // select('*') : created_at lu s'il existe (tri des groupes les plus récents)
        supabase.from('groupes').select('*').eq('formateur_id', authUser.id),
      ])
      if (annule) return
      if (coursRes.error || groupesRes.error) {
        setErreur(coursRes.error?.message ?? groupesRes.error?.message)
        return
      }

      const groupes = [...(groupesRes.data ?? [])].sort((a, b) =>
        a.created_at && b.created_at ? b.created_at.localeCompare(a.created_at) : (a.nom ?? '').localeCompare(b.nom ?? '', 'fr')
      )
      const ids = groupes.map((g) => g.id)
      const vide = { nbCours: coursRes.count ?? 0, groupes, membres: [], coursGroupes: [], eleves: new Map(), progression: [] }
      if (ids.length === 0) {
        setDonnees(vide)
        return
      }

      const [membresRes, coursGroupesRes, ...rpcRes] = await Promise.all([
        supabase.from('groupe_membres').select('groupe_id, apprenant_id').in('groupe_id', ids),
        supabase.from('cours_groupes').select('groupe_id, cours_id').in('groupe_id', ids),
        ...ids.map((id) => supabase.rpc('get_membres_groupe', { p_groupe_id: id })),
      ])
      if (annule) return
      if (membresRes.error || coursGroupesRes.error) {
        setErreur(membresRes.error?.message ?? coursGroupesRes.error?.message)
        return
      }

      const eleves = new Map()
      for (const { data } of rpcRes) {
        for (const m of data ?? []) eleves.set(m.id, { id: m.id, prenom: m.prenom, nom: m.nom, email: m.email })
      }
      const membres = membresRes.data ?? []
      const coursGroupes = coursGroupesRes.data ?? []
      const idsEleves = [...new Set(membres.map((m) => m.apprenant_id))]
      const idsCours = [...new Set(coursGroupes.map((cg) => cg.cours_id))]

      const { data: progression, error: erreurProgression } =
        idsEleves.length && idsCours.length
          ? await supabase
              .from('progression')
              .select('id, user_id, cours_id, statut, updated_at, cours(titre)')
              .in('user_id', idsEleves)
              .in('cours_id', idsCours)
          : { data: [] }
      if (annule) return
      if (erreurProgression) {
        setErreur(erreurProgression.message)
        return
      }

      setDonnees({ ...vide, membres, coursGroupes, eleves, progression: progression ?? [] })
    }

    charger()
    return () => {
      annule = true
    }
  }, [authUser.id, actif])

  return { donnees, erreur }
}

function DashboardFormateur({ authUser, onCreerCours, onChangerSection, onOuvrirGroupe }) {
  const [profil, setProfil] = useState(null)
  const [erreurProfil, setErreurProfil] = useState(null)
  const [modaleGroupe, setModaleGroupe] = useState(false)

  useEffect(() => {
    let annule = false
    supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurProfil(error.message)
        else setProfil(data)
      })
    return () => {
      annule = true
    }
  }, [authUser.id])

  const estAdmin = Boolean(profil?.est_admin)
  const { donnees, erreur } = useDonneesFormateur(authUser, profil !== null && !estAdmin)

  if (erreurProfil) {
    return (
      <div className="espace-page espace-page-etroit formateur-dashboard-page">
        <p className="message message-erreur">Impossible de charger ton profil ({erreurProfil}).</p>
      </div>
    )
  }

  if (!profil) {
    return (
      <div className="espace-page espace-page-etroit formateur-dashboard-page">
        <p>Chargement…</p>
      </div>
    )
  }

  const titre = `${salutation()} ${profil.prenom ?? ''}`.trim()

  if (estAdmin) {
    return <DashboardAdmin titre={titre} onCreerCours={onCreerCours} onChangerSection={onChangerSection} />
  }

  const nbEleves = donnees ? new Set(donnees.membres.map((m) => m.apprenant_id)).size : null
  // « Pour bien démarrer » tant qu'aucun cours n'est assigné à un groupe qui a au moins un élève
  // (aucun couple élève × cours assigné) ; dès qu'il en existe un, dashboard normal.
  const premiersPas =
    donnees !== null && couplesAssignes(donnees.groupes.map((g) => g.id), donnees.membres, donnees.coursGroupes).size === 0

  const entete = (
    <div className="fd-entete">
      <div className="fd-titres">
        <h1>{titre}</h1>
        {donnees &&
          (premiersPas ? (
            <p className="fd-sous-titre">Bienvenue sur Skillo</p>
          ) : (
            <p className="fd-sous-titre">
              <button type="button" className="fd-lien-discret" onClick={() => onChangerSection('cours')}>
                {pluriel(donnees.nbCours, 'cours', 'cours')}
              </button>
              {' · '}
              <button type="button" className="fd-lien-discret" onClick={() => onChangerSection('groupes')}>
                {pluriel(donnees.groupes.length, 'groupe')}
              </button>
              {' · '}
              {pluriel(nbEleves, 'élève')}
            </p>
          ))}
      </div>
      {/* « Pour bien démarrer » : pas de boutons d'en-tête (doublon avec les boutons des étapes) */}
      {donnees && !premiersPas && (
        <div className="fd-entete-actions">
          <button type="button" className="bouton-secondaire fd-bouton-entete" onClick={() => setModaleGroupe(true)}>
            + Nouveau groupe
          </button>
          <button type="button" className="bouton-primaire fd-bouton-entete" onClick={onCreerCours}>
            + Nouveau cours
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="espace-page espace-page-etroit formateur-dashboard-page">
      {entete}

      {erreur ? (
        <p className="message message-erreur">Impossible de charger ton tableau de bord ({erreur}).</p>
      ) : donnees === null ? (
        <p>Chargement…</p>
      ) : premiersPas ? (
        <PremiersPas
          donnees={donnees}
          onCreerCours={onCreerCours}
          onCreerGroupe={() => setModaleGroupe(true)}
          onOuvrirGroupe={onOuvrirGroupe}
        />
      ) : (
        <TableauDeBord donnees={donnees} onChangerSection={onChangerSection} onOuvrirGroupe={onOuvrirGroupe} />
      )}

      {modaleGroupe && (
        <ModaleNouveauGroupe
          authUser={authUser}
          onFermer={() => setModaleGroupe(false)}
          onCree={(id) => {
            setModaleGroupe(false)
            onOuvrirGroupe(id)
          }}
        />
      )}
    </div>
  )
}

// --- Dashboard formateur avec élèves --------------------------------------------------------------

function TableauDeBord({ donnees, onChangerSection, onOuvrirGroupe }) {
  const idsEleves = useMemo(() => [...new Set(donnees.membres.map((m) => m.apprenant_id))], [donnees])

  // Taux de complétion : même définition que la carte d'un groupe (couples élève × cours assigné
  // terminés ÷ couples élève × cours assigné), sur tous les groupes.
  const ratio = tauxCompletionGlobal(donnees.groupes, donnees.membres, donnees.coursGroupes, donnees.progression)
  const tauxCompletion = ratio === null ? null : Math.round(ratio * 100)

  // Élèves dont un cours assigné à l'un de leurs groupes est resté « non_commence » plus de 3 jours
  // (un élève une fois, le plus ancien d'abord). Un cours public non assigné n'est jamais compté.
  const relances = useMemo(() => {
    const couples = couplesAssignes(donnees.groupes.map((g) => g.id), donnees.membres, donnees.coursGroupes)
    const seuil = Date.now() - SEUIL_RELANCE_JOURS * 86400000
    const candidates = donnees.progression
      .filter(
        (p) =>
          p.statut === 'non_commence' &&
          couples.has(`${p.user_id}:${p.cours_id}`) &&
          p.updated_at &&
          new Date(p.updated_at).getTime() <= seuil
      )
      .sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at))
    const dejaVus = new Set()
    const liste = []
    for (const ligne of candidates) {
      if (dejaVus.has(ligne.user_id)) continue
      dejaVus.add(ligne.user_id)
      const eleve = donnees.eleves.get(ligne.user_id)
      liste.push({
        id: ligne.id,
        prenom: eleve?.prenom ?? 'Un élève',
        email: eleve?.email ?? null,
        titreCours: ligne.cours?.titre ?? 'un cours',
        updatedAt: ligne.updated_at,
      })
    }
    return liste
  }, [donnees])

  return (
    <>
      <div className="fd-grille">
        <CarteCompletion taux={tauxCompletion} />
        <CarteRelances relances={relances} />
        <CarteGroupes donnees={donnees} onChangerSection={onChangerSection} onOuvrirGroupe={onOuvrirGroupe} />
      </div>
      <CarteActivite donnees={donnees} idsEleves={idsEleves} onOuvrirGroupe={onOuvrirGroupe} />
    </>
  )
}

function CarteCompletion({ taux }) {
  const valeur = taux ?? null
  return (
    <div className="espace-carte formateur-taux-carte fd-zone-taux">
      <AnneauProgression
        radius={46}
        strokeWidth={12}
        ratio={(valeur ?? 0) / 100}
        afficherTrait={valeur !== null}
        wrapperClassName="formateur-taux-anneau"
      >
        <span className="formateur-taux-valeur">{valeur === null ? '—' : `${valeur} %`}</span>
      </AnneauProgression>
      <div className="formateur-taux-texte">
        <span className="formateur-taux-label">Taux de complétion</span>
        <span className="formateur-taux-souscription">Sur l'ensemble de tes groupes</span>
        {valeur !== null && valeur < 40 && (
          <span className="formateur-taux-pastille formateur-taux-pastille-alerte">
            <Icone svg={iconeAlerte} className="formateur-taux-pastille-icone" />À surveiller
          </span>
        )}
        {valeur !== null && valeur >= 70 && (
          <span className="formateur-taux-pastille formateur-taux-pastille-succes">
            <Icone svg={iconeCoche} className="formateur-taux-pastille-icone" />Bon rythme
          </span>
        )}
      </div>
    </div>
  )
}

function CarteGroupes({ donnees, onChangerSection, onOuvrirGroupe }) {
  const groupes = donnees.groupes.slice(0, LIMITE_GROUPES)
  return (
    <section className="espace-carte fd-carte fd-zone-groupes">
      <div className="fd-carte-entete">
        <h2>Tes groupes</h2>
        <button type="button" className="fd-lien" onClick={() => onChangerSection('groupes')}>
          Tout voir
        </button>
      </div>
      <ul className="fd-groupes">
        {groupes.map((groupe) => {
          const stats = statsGroupe(groupe, donnees.membres, donnees.coursGroupes, donnees.progression)
          return (
            <li key={groupe.id}>
              <button type="button" className="fd-groupe" onClick={() => onOuvrirGroupe(groupe.id)}>
                <span className="fd-groupe-haut">
                  <span className="fd-groupe-titres">
                    <span className="fd-groupe-nom">{typo(groupe.nom)}</span>
                    <span className="fd-groupe-meta">
                      {pluriel(stats.nbEleves, 'élève')} · {pluriel(stats.nbCours, 'cours', 'cours')}
                    </span>
                  </span>
                  <span className="fd-groupe-activite">{libelleDerniereActivite(stats.derniereActivite)}</span>
                  <Icone svg={iconeChevron} className="fd-chevron" />
                </span>
                <span className="fd-groupe-progression">
                  <BarreFine ratio={stats.ratio ?? 0} />
                  <strong>{stats.ratio === null ? '-' : `${Math.round(stats.ratio * 100)} %`}</strong>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {donnees.groupes.length > LIMITE_GROUPES && (
        <p className="fd-note">Les 3 groupes les plus récents. Le reste est dans Groupes.</p>
      )}
    </section>
  )
}

function CarteRelances({ relances }) {
  const [etendue, setEtendue] = useState(false)
  const [confirmee, setConfirmee] = useState(null)

  useEffect(() => {
    if (!confirmee) return
    const t = setTimeout(() => setConfirmee(null), 2500)
    return () => clearTimeout(t)
  }, [confirmee])

  // Même action « Relancer par email » que dans le Détail groupe (mailto: en attendant Make n°3)
  function relancer(eleve) {
    relancerParEmail({ email: eleve.email, prenom: eleve.prenom, coursNonCommences: [eleve.titreCours] })
    setConfirmee(eleve)
  }

  const affichees = etendue ? relances ?? [] : (relances ?? []).slice(0, LIMITE_RELANCE_AFFICHEE)
  const masquees = (relances?.length ?? 0) - affichees.length

  return (
    <section className="espace-carte fd-carte fd-zone-relances">
      <div className="fd-carte-entete">
        <h2>Élèves à relancer</h2>
      </div>

      {relances.length === 0 ? (
        <div className="fd-succes">
          <span className="fd-succes-rond">
            <Icone svg={iconeCoche} className="fd-succes-icone" />
          </span>
          <span className="fd-succes-textes">
            <strong>Personne à relancer</strong>
            <span>Tous tes élèves ont commencé les cours assignés.</span>
          </span>
        </div>
      ) : (
        <>
          <ul className="formateur-relance-liste">
            {affichees.map((eleve) => (
              <li key={eleve.id} className="formateur-relance-ligne">
                <div className="formateur-relance-info">
                  <span className="formateur-relance-texte">
                    <strong>{eleve.prenom}</strong> n'a pas commencé <strong>{typo(eleve.titreCours)}</strong>
                  </span>
                  {confirmee?.id === eleve.id ? (
                    <span className="formateur-relance-confirmation">Email de relance prêt pour {eleve.prenom}</span>
                  ) : (
                    <span className="formateur-relance-date">{dateRelance(eleve.updatedAt)}</span>
                  )}
                </div>
                <button
                  type="button"
                  className="formateur-relance-bouton"
                  onClick={() => relancer(eleve)}
                  aria-label={`Relancer ${eleve.prenom}`}
                >
                  <Icone svg={iconeSend} className="formateur-relance-bouton-icone" />
                </button>
              </li>
            ))}
          </ul>
          {masquees > 0 && (
            // Desktop : la zone occupe l'espace libre sous la dernière ligne et y centre le lien
            <div className="fd-relances-suite">
              <button type="button" className="fd-lien fd-lien-centre" onClick={() => setEtendue(true)}>
                Voir les {masquees} autres
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

// Fil chronologique : une ligne par élève et par cours (progression.updated_at), groupé par jour.
function CarteActivite({ donnees, idsEleves, onOuvrirGroupe }) {
  const [filtre, setFiltre] = useState('tout')
  const [recherche, setRecherche] = useState('')
  const [rechercheDebouncee, setRechercheDebouncee] = useState('')
  const [limite, setLimite] = useState(PAGE_ACTIVITE)
  const [resultat, setResultat] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setRechercheDebouncee(recherche), 300)
    return () => clearTimeout(t)
  }, [recherche])

  useEffect(() => {
    setLimite(PAGE_ACTIVITE)
  }, [filtre, rechercheDebouncee])

  useEffect(() => {
    let annule = false

    async function charger() {
      const terme = rechercheDebouncee.trim().toLowerCase()
      const ids = terme ? idsEleves.filter((id) => nomComplet(donnees.eleves.get(id)).toLowerCase().includes(terme)) : idsEleves
      if (ids.length === 0) {
        setResultat({ lignes: [], encore: false })
        return
      }

      const statuts = FILTRES_ACTIVITE.find((f) => f.id === filtre).statuts
      // Seulement les cours assignés à l'un des groupes de l'élève (cours_groupes) : un élève qui
      // avance sur un cours public non assigné n'apparaît pas. Lignes déjà chargées avec les
      // données du dashboard (élèves × cours assignés), une seule par élève et par cours.
      const couples = couplesAssignes(donnees.groupes.map((g) => g.id), donnees.membres, donnees.coursGroupes)
      const idsRetenus = new Set(ids)
      const vus = new Set()
      const lignes = donnees.progression
        .filter(
          (l) =>
            idsRetenus.has(l.user_id) &&
            statuts.includes(l.statut) &&
            l.updated_at &&
            couples.has(`${l.user_id}:${l.cours_id}`)
        )
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .filter((l) => {
          const cle = `${l.user_id}:${l.cours_id}`
          if (vus.has(cle)) return false
          vus.add(cle)
          return true
        })
      const encore = lignes.length > limite
      const affichees = lignes.slice(0, limite)

      // Meilleur score de quiz de l'élève sur le cours (lignes terminées)
      const termines = affichees.filter((l) => l.statut === 'termine')
      const meilleurs = new Map()
      if (termines.length > 0) {
        const { data: scores } = await supabase
          .from('scores')
          .select('user_id, cours_id, score')
          .eq('type', 'quiz_cours')
          .in('user_id', [...new Set(termines.map((l) => l.user_id))])
          .in('cours_id', [...new Set(termines.map((l) => l.cours_id))])
        if (annule) return
        for (const s of scores ?? []) {
          const cle = `${s.user_id}:${s.cours_id}`
          meilleurs.set(cle, Math.max(meilleurs.get(cle) ?? 0, s.score))
        }
      }

      setResultat({
        encore,
        lignes: affichees.map((l) => {
          // Groupe de l'élève auquel ce cours est assigné
          const groupesEleve = donnees.membres.filter((m) => m.apprenant_id === l.user_id).map((m) => m.groupe_id)
          const groupeId = groupesEleve.find((g) =>
            donnees.coursGroupes.some((cg) => cg.groupe_id === g && cg.cours_id === l.cours_id)
          )
          return {
            id: l.id,
            eleve: donnees.eleves.get(l.user_id),
            statut: l.statut,
            titreCours: l.cours?.titre ?? 'un cours',
            date: l.updated_at,
            groupe: donnees.groupes.find((g) => g.id === groupeId) ?? null,
            score: meilleurs.get(`${l.user_id}:${l.cours_id}`) ?? null,
          }
        }),
      })
    }

    charger()
    return () => {
      annule = true
    }
  }, [donnees, idsEleves, filtre, rechercheDebouncee, limite])

  // Groupement par jour (le fil est déjà du plus récent au plus ancien)
  const jours = []
  for (const ligne of resultat?.lignes ?? []) {
    const libelle = libelleJour(ligne.date)
    if (jours.length === 0 || jours[jours.length - 1].libelle !== libelle) jours.push({ libelle, lignes: [] })
    jours[jours.length - 1].lignes.push(ligne)
  }

  return (
    <section className="espace-carte fd-carte fd-activite">
      <div className="fd-activite-entete">
        <h2>Activité récente</h2>
        <div className="fd-activite-controles">
          <div className="fd-filtres" role="group" aria-label="Filtrer l’activité">
            {FILTRES_ACTIVITE.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`fd-filtre${filtre === f.id ? ' fd-filtre-actif' : ''}`}
                aria-pressed={filtre === f.id}
                onClick={() => setFiltre(f.id)}
              >
                {f.libelle}
              </button>
            ))}
          </div>
          <label className="fd-recherche">
            <Icone svg={iconeLoupe} className="fd-recherche-icone" />
            <input
              type="search"
              aria-label="Rechercher un élève"
              placeholder="Un élève"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </label>
        </div>
      </div>

      {resultat === null ? (
        <p className="fm-texte">Chargement…</p>
      ) : resultat.lignes.length === 0 ? (
        <p className="fd-vide">
          {rechercheDebouncee.trim() ? `Aucune activité pour « ${rechercheDebouncee.trim()} ».` : 'Pas encore d’activité.'}
        </p>
      ) : (
        <>
          {jours.map((jour) => (
            <div key={jour.libelle} className="fd-jour">
              <h3 className="fd-jour-titre">{jour.libelle}</h3>
              <ul className="fd-fil">
                {jour.lignes.map((ligne) => (
                  <li key={ligne.id}>
                    <button
                      type="button"
                      className="fd-evenement"
                      disabled={!ligne.groupe}
                      onClick={() => ligne.groupe && onOuvrirGroupe(ligne.groupe.id)}
                    >
                      <span className="fd-initiales" aria-hidden="true">
                        {initiales(ligne.eleve)}
                      </span>
                      <span className="fd-evenement-texte">
                        <strong>{nomComplet(ligne.eleve)}</strong> {ligne.statut === 'termine' ? 'a terminé' : 'a commencé'}{' '}
                        <strong>{typo(ligne.titreCours)}</strong>
                      </span>
                      <span className="fd-evenement-details">
                        {ligne.groupe && <span className="fd-pastille-groupe">{typo(ligne.groupe.nom)}</span>}
                        {ligne.statut === 'termine' ? (
                          <span className="fd-statut fd-statut-termine">
                            <Icone svg={iconeCoche} className="fd-statut-icone" />
                            {ligne.score === null ? 'Terminé' : `Quiz ${ligne.score} %`}
                          </span>
                        ) : (
                          <span className="fd-statut fd-statut-en-cours">
                            <span className="fd-point" aria-hidden="true" />
                            En cours
                          </span>
                        )}
                      </span>
                      <Icone svg={iconeChevron} className="fd-chevron fd-evenement-chevron" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {resultat.encore && (
            <button type="button" className="fd-lien fd-lien-centre" onClick={() => setLimite((l) => l + PAGE_ACTIVITE)}>
              Voir plus
            </button>
          )}
        </>
      )}
    </section>
  )
}

// --- Premiers pas (formateur sans élève) -----------------------------------------------------------

function PremiersPas({ donnees, onCreerCours, onCreerGroupe, onOuvrirGroupe }) {
  // Groupes triés du plus récent au plus ancien (useDonneesFormateur)
  const groupeRecent = donnees.groupes[0] ?? null
  const groupeAvecEleves = donnees.groupes.find((g) => donnees.membres.some((m) => m.groupe_id === g.id)) ?? null
  const coursFait = donnees.nbCours > 0
  const elevesFait = groupeAvecEleves !== null
  const etapes = [
    {
      titre: 'Crée ton premier cours',
      texte: 'Une leçon, un quiz, et si tu veux une checklist terrain.',
      action: 'Créer un cours',
      faite: coursFait,
      onClick: onCreerCours,
    },
    {
      titre: 'Crée un groupe et ajoute tes élèves',
      texte: 'Une promo, une classe, une équipe. Tes élèves s’ajoutent par leur email.',
      action: groupeRecent ? 'Ajouter des élèves' : 'Créer un groupe',
      faite: elevesFait,
      onClick: () => (groupeRecent ? onOuvrirGroupe(groupeRecent.id) : onCreerGroupe()),
    },
    {
      titre: 'Assigne un cours à ton groupe',
      texte: 'Tes élèves le verront dans « De ton formateur ».',
      action: 'Assigner un cours',
      // Faite = au moins un couple élève × cours assigné : on n'affiche alors plus cet écran
      faite: false,
      desactivee: !coursFait || !elevesFait,
      onClick: () => groupeAvecEleves && onOuvrirGroupe(groupeAvecEleves.id),
    },
  ]
  const faites = etapes.filter((e) => e.faite).length
  const premiereAFaire = etapes.findIndex((e) => !e.faite)

  return (
    <section className="fd-demarrage">
      <div className="fd-carte-entete">
        <h2>Pour bien démarrer</h2>
        <span className="fd-demarrage-compteur">
          {faites} étape{faites > 1 ? 's' : ''} sur 3
        </span>
      </div>
      <BarreFine ratio={faites / 3} />
      <ol className="fd-etapes">
        {etapes.map((etape, i) => (
          <li key={etape.titre} className={`fd-etape${etape.faite ? ' fd-etape-faite' : ''}`}>
            <span className="fd-etape-rond">{etape.faite ? <Icone svg={iconeCoche} className="fd-etape-coche" /> : i + 1}</span>
            <span className="fd-etape-textes">
              <span className="fd-etape-titre">{etape.titre}</span>
              {!etape.faite && <span className="fd-etape-texte">{etape.texte}</span>}
            </span>
            {!etape.faite && (
              <button
                type="button"
                className={`${i === premiereAFaire ? 'bouton-primaire' : 'bouton-secondaire'} fd-etape-action`}
                disabled={etape.desactivee}
                onClick={etape.onClick}
              >
                {etape.action}
              </button>
            )}
          </li>
        ))}
      </ol>
      <p className="fd-note fd-note-14">
        Le suivi de tes élèves (avancement, relances, activité) apparaîtra ici dès qu'ils auront commencé.
      </p>
    </section>
  )
}

export default DashboardFormateur
