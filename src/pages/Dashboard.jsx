import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { iconeBadge, conditionCourteBadge } from '../lib/badges'
import { THEMATIQUES, imageTheme, IMAGE_QUIZ_FLASH, IMAGE_BIBLIOTHEQUE_TERMINEE } from '../lib/thematiques'
import AnneauProgression from '../components/AnneauProgression'
import Icone from '../components/Icone'
import BlocFormateur from '../components/BlocFormateur'
import { joursDepuis, statutCoursAssigne } from '../lib/coursAssignes'
import iconeFleche from '../Assets/arrow-right.svg?raw'
import iconeFormateur from '../Assets/graduation.svg?raw'
import iconeCadenas from '../Assets/lock.svg?raw'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import './Dashboard.css'
import { typo } from '../lib/typographie'

// Dashboard apprenant : une suite de blocs qui poussent chacun à une action. Les blocs affichés
// et leur ordre dépendent de la situation de l'élève (voir determinerBlocs et CLAUDE.md).

const SEUIL_QUIZ_FLASH = 3

// Ordre d'affichage des badges (rangée, vitrine) et ordre de priorité pour « Prochain badge ».
const ORDRE_AFFICHAGE_BADGES = [
  'premier_quiz_complete',
  'premiere_checklist_completee',
  'trois_cours_termines',
  'quiz_100_pourcent',
  'premier_quiz_flash_reussi',
  'dix_cours_termines',
]
const PRIORITE_PROCHAIN_BADGE = [
  'premier_quiz_complete',
  'trois_cours_termines',
  'dix_cours_termines',
  'premiere_checklist_completee',
  'premier_quiz_flash_reussi',
  'quiz_100_pourcent',
]

function rangDans(liste, valeur) {
  const rang = liste.indexOf(valeur)
  return rang === -1 ? liste.length : rang
}

// Condition en clair + progression chiffrée du prochain badge.
function objectifBadge(condition, { nbQuiz, nbTermines, checklistFaite, quizFlashReussi, quiz100 }) {
  const texte = conditionCourteBadge(condition)
  switch (condition) {
    case 'premier_quiz_complete':
      return { texte, valeur: Math.min(nbQuiz, 1), cible: 1, unite: 'quiz' }
    case 'trois_cours_termines':
      return { texte, valeur: Math.min(nbTermines, 3), cible: 3, unite: 'cours' }
    case 'dix_cours_termines':
      return { texte, valeur: Math.min(nbTermines, 10), cible: 10, unite: 'cours' }
    case 'premiere_checklist_completee':
      return { texte, valeur: checklistFaite ? 1 : 0, cible: 1, unite: 'checklist' }
    case 'premier_quiz_flash_reussi':
      return { texte, valeur: quizFlashReussi ? 1 : 0, cible: 1, unite: 'quiz flash' }
    case 'quiz_100_pourcent':
      return { texte, valeur: quiz100 ? 1 : 0, cible: 1, unite: 'quiz' }
    default:
      return { texte, valeur: 0, cible: 1, unite: '' }
  }
}

function libelleAjoute(dateIso) {
  const jours = joursDepuis(dateIso)
  if (jours === null) return null
  if (jours <= 0) return "ajouté aujourd'hui"
  if (jours === 1) return 'ajouté hier'
  return `ajouté il y a ${jours} jours`
}

// Étapes d'un cours en cours (calcul existant : la leçon compte comme faite dès que le cours
// est ouvert, le quiz via scores, la checklist via progression.checklist_terminee).
function etatCoursEnCours(cours, { quizFait, checklistFaite }) {
  const aQuiz = (cours.questions?.length ?? 0) > 0
  const aChecklist = (cours.etapes_checklist?.length ?? 0) > 0
  const etapes = [true, aQuiz && quizFait, aChecklist && checklistFaite]
  const total = 1 + (aQuiz ? 1 : 0) + (aChecklist ? 1 : 0)
  const faites = etapes.filter(Boolean).length
  const ratio = total > 0 ? faites / total : 0

  const resteQuiz = aQuiz && !quizFait
  const resteChecklist = aChecklist && !checklistFaite
  let phrase
  if (resteQuiz && resteChecklist) phrase = 'Leçon lue. Restent le quiz et la checklist pour finir ce cours.'
  else if (resteQuiz) phrase = 'Leçon lue. Reste le quiz pour finir ce cours.'
  else if (resteChecklist) phrase = 'Leçon lue. Reste la checklist pour finir ce cours.'
  else phrase = 'Leçon en cours. Termine-la pour finir ce cours.'

  return { ratio, phrase }
}

function PastilleFormateur() {
  return (
    <span className="dash-pastille-formateur">
      <Icone svg={iconeFormateur} className="dash-pastille-formateur-icone" />
      De ton formateur
    </span>
  )
}

function BoutonFleche({ children, onClick }) {
  return (
    <button type="button" className="dash-bouton-fleche" onClick={onClick}>
      {children}
      <span className="dash-bouton-fleche-rond">
        <Icone svg={iconeFleche} className="dash-bouton-fleche-icone" />
      </span>
    </button>
  )
}

function Cadenas({ className }) {
  return (
    <span className={`dash-cadenas ${className ?? ''}`}>
      <Icone svg={iconeCadenas} className="dash-cadenas-icone" />
    </span>
  )
}

function Dashboard({ authUser, onOuvrirCours, onOuvrirQuizFlash, onChangerSection, onVoirCoursFormateur }) {
  const [profil, setProfil] = useState(null)
  const [erreurProfil, setErreurProfil] = useState(null)

  const [progression, setProgression] = useState([])
  const [coursListe, setCoursListe] = useState(null)
  const [erreurCours, setErreurCours] = useState(null)
  const [assignations, setAssignations] = useState([])

  const [tousBadges, setTousBadges] = useState([])
  const [badgesObtenus, setBadgesObtenus] = useState([])
  // Modale « Mes badges » : null = fermée ; { badgeId } = ouverte (badgeId : badge à mettre en évidence)
  const [modaleBadges, setModaleBadges] = useState(null)

  const [scores, setScores] = useState([])

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
      .select('cours_id, statut, checklist_terminee, updated_at')
      .eq('user_id', authUser.id)
      .then(({ data, error }) => {
        if (annule) return
        if (!error) setProgression(data ?? [])
      })

    supabase
      .from('cours')
      .select('id, titre, categorie, ordre, visibilite, questions(id), etapes_checklist(id)')
      .then(({ data, error }) => {
        if (annule) return
        if (error) setErreurCours(error.message)
        else setCoursListe(data ?? [])
      })

    // Dates d'assignation (migration 0004). En cas d'échec (migration non jouée), les cours
    // privés restent traités comme assignés, sans date.
    supabase.rpc('mes_cours_assignes').then(({ data, error }) => {
      if (annule) return
      if (error) console.error('mes_cours_assignes', error.message)
      else setAssignations(data ?? [])
    })

    supabase
      .from('badges')
      .select('id, nom, icone, description, condition_deblocage')
      .then(({ data, error }) => {
        if (annule) return
        if (!error) setTousBadges(data ?? [])
      })

    supabase
      .from('user_badges')
      .select('badge_id, date_obtention')
      .eq('user_id', authUser.id)
      .then(({ data, error }) => {
        if (annule) return
        if (!error) setBadgesObtenus(data ?? [])
      })

    supabase
      .from('scores')
      .select('cours_id, type, score')
      .eq('user_id', authUser.id)
      .then(({ data, error }) => {
        if (annule) return
        if (!error) setScores(data ?? [])
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

  if (!profil || (coursListe === null && !erreurCours)) {
    return (
      <div className="espace-page espace-page-etroit">
        <p>Chargement…</p>
      </div>
    )
  }

  // --- Données dérivées -------------------------------------------------------------------

  const cours = coursListe ?? []
  const progressionParCours = new Map(progression.map((p) => [p.cours_id, p]))
  const statutDe = (c) => progressionParCours.get(c.id)?.statut ?? 'non_commence'
  const dateAssignation = new Map(assignations.map((a) => [a.cours_id, a.assigne_le]))

  const scoresQuizCours = scores.filter((s) => s.type === 'quiz_cours')
  const idsQuizFait = new Set(scoresQuizCours.map((s) => s.cours_id))
  const nbCoursQuizTermines = idsQuizFait.size
  const quizFlashDebloque = nbCoursQuizTermines >= SEUIL_QUIZ_FLASH

  const coursTermines = cours.filter((c) => statutDe(c) === 'termine')
  const aCommenceQuelqueChose = cours.some((c) => statutDe(c) !== 'non_commence')
  const tousTermines = cours.length > 0 && coursTermines.length === cours.length

  // Cours en cours : le plus récemment modifié.
  const coursEnCours =
    cours
      .filter((c) => statutDe(c) === 'en_cours')
      .sort((a, b) =>
        (progressionParCours.get(b.id)?.updated_at ?? '').localeCompare(progressionParCours.get(a.id)?.updated_at ?? '')
      )[0] ?? null

  // Cours assignés par le formateur (privés visibles via RLS), non terminés, du plus ancien au plus récent.
  const assignesAFaire = cours
    .filter((c) => c.visibilite === 'prive' && statutDe(c) !== 'termine')
    .sort((a, b) => (dateAssignation.get(a.id) ?? '').localeCompare(dateAssignation.get(b.id) ?? ''))

  // Prochain cours conseillé : premier cours public non commencé, ordre des thèmes puis cours.ordre.
  const coursConseille =
    cours
      .filter((c) => c.visibilite === 'public' && statutDe(c) === 'non_commence')
      .sort(
        (a, b) =>
          rangDans(THEMATIQUES, a.categorie) - rangDans(THEMATIQUES, b.categorie) ||
          (a.ordre ?? Infinity) - (b.ordre ?? Infinity) ||
          a.titre.localeCompare(b.titre)
      )[0] ?? null

  // Badges
  const idsBadgesObtenus = new Set(badgesObtenus.map((b) => b.badge_id))
  const dateObtentionParBadge = new Map(badgesObtenus.map((b) => [b.badge_id, b.date_obtention]))
  const badgesTries = [...tousBadges].sort(
    (a, b) =>
      rangDans(ORDRE_AFFICHAGE_BADGES, a.condition_deblocage) - rangDans(ORDRE_AFFICHAGE_BADGES, b.condition_deblocage)
  )
  const nbBadgesObtenus = tousBadges.filter((b) => idsBadgesObtenus.has(b.id)).length
  const collectionComplete = tousBadges.length > 0 && nbBadgesObtenus === tousBadges.length
  const prochainBadge =
    [...tousBadges]
      .filter((b) => !idsBadgesObtenus.has(b.id))
      .sort(
        (a, b) =>
          rangDans(PRIORITE_PROCHAIN_BADGE, a.condition_deblocage) -
          rangDans(PRIORITE_PROCHAIN_BADGE, b.condition_deblocage)
      )[0] ?? null

  const statsBadges = {
    nbQuiz: nbCoursQuizTermines,
    nbTermines: coursTermines.length,
    checklistFaite: progression.some((p) => p.checklist_terminee),
    quizFlashReussi: scores.some((s) => s.type === 'quiz_flash' && s.score >= 50),
    quiz100: scores.some((s) => s.score === 100),
  }
  const ouvrirBadges = (badge = null) => setModaleBadges({ badgeId: badge?.id ?? null })

  // --- Blocs --------------------------------------------------------------------------------

  const blocCoursEnCours = (c) => {
    const { ratio, phrase } = etatCoursEnCours(c, {
      quizFait: idsQuizFait.has(c.id),
      checklistFaite: progressionParCours.get(c.id)?.checklist_terminee === true,
    })
    const pourcentage = Math.round(ratio * 100)
    return (
      <div className="dash-carte dash-carte-violette dash-carte-tete dash-avec-objet dash-en-cours">
        <img className="dash-objet-deborde" src={imageTheme(c.categorie)} alt="" />
        <div className="dash-tete-rangee">
          <AnneauProgression
            radius={32}
            strokeWidth={9}
            ratio={ratio}
            trackColor="var(--color-primary-profond)"
            progressColor="var(--color-surface)"
            wrapperClassName="dash-anneau"
          >
            <span className="dash-anneau-valeur" aria-label={`${pourcentage} % du cours`}>
              {pourcentage} %
            </span>
          </AnneauProgression>
        </div>
        <div className="dash-tete-texte">
          {c.visibilite === 'prive' && <PastilleFormateur />}
          <span className="dash-libelle-sur-violet">Tu en es là</span>
          <h2 className="dash-titre-tete" title={typo(c.titre)}>
            {typo(c.titre)}
          </h2>
          <p className="dash-en-cours-phrase">{phrase}</p>
        </div>
        <BoutonFleche onClick={() => onOuvrirCours(c.id)}>Continuer le cours</BoutonFleche>
      </div>
    )
  }

  // B en tête (premier cours / prochain cours conseillé) : objet qui déborde en haut à droite,
  // libellé puis titre directement dessous (pas de rangée d'anneau), avec une réserve à droite
  // pour que le texte ne passe pas sous l'objet ; bouton dessous.
  const blocCoursConseilleTete = (c, premier) => (
    <div className="dash-carte dash-carte-blanche dash-carte-tete dash-avec-objet dash-conseille-tete">
      <img className="dash-objet-deborde" src={imageTheme(c.categorie)} alt="" />
      <div className="dash-tete-texte">
        <span className="dash-libelle-violet">{premier ? 'Ton premier cours' : 'Prochain cours conseillé'}</span>
        <h2 className="dash-titre-tete" title={typo(c.titre)}>
          {typo(c.titre)}
        </h2>
        <span className="dash-sous-texte">{c.categorie}</span>
      </div>
      <button type="button" className="bouton-primaire dash-conseille-bouton" onClick={() => onOuvrirCours(c.id)}>
        Commencer
      </button>
    </div>
  )

  const blocCoursConseille = (c, premier) => (
    <div className="dash-carte dash-carte-blanche dash-conseille">
      <img className="dash-objet-coin" src={imageTheme(c.categorie)} alt="" />
      <span className="dash-libelle-violet">{premier ? 'Ton premier cours' : 'Prochain cours conseillé'}</span>
      <h2 className="dash-titre-carte">{typo(c.titre)}</h2>
      <span className="dash-sous-texte">{c.categorie}</span>
      <button type="button" className="bouton-primaire dash-conseille-bouton" onClick={() => onOuvrirCours(c.id)}>
        Commencer
      </button>
    </div>
  )

  const blocAssigneEnTete = (c) => {
    const ajoute = libelleAjoute(dateAssignation.get(c.id))
    return (
      <div className="dash-carte dash-carte-violette dash-carte-tete dash-avec-objet dash-assigne">
        <img className="dash-objet-deborde" src={imageTheme(c.categorie)} alt="" />
        <div className="dash-tete-rangee">
          <PastilleFormateur />
        </div>
        <div className="dash-tete-texte">
          <h2 className="dash-titre-tete" title={typo(c.titre)}>
            {typo(c.titre)}
          </h2>
          <p className="dash-assigne-meta">{ajoute ? `${c.categorie} · ${ajoute}` : c.categorie}</p>
        </div>
        <BoutonFleche onClick={() => onOuvrirCours(c.id)}>Commencer le cours</BoutonFleche>
      </div>
    )
  }

  // Tri du bloc « De ton formateur » : Nouveau, puis En cours, puis À faire ; à statut égal, du
  // plus récemment assigné au plus ancien (sans date connue : en fin de groupe).
  const RANG_STATUT_ASSIGNE = { nouveau: 0, en_cours: 1, a_faire: 2 }
  const blocFormateur = (liste) => {
    const lignes = liste
      .map((c) => ({ cours: c, statut: statutCoursAssigne(statutDe(c), dateAssignation.get(c.id)) }))
      .sort(
        (a, b) =>
          RANG_STATUT_ASSIGNE[a.statut] - RANG_STATUT_ASSIGNE[b.statut] ||
          (dateAssignation.get(b.cours.id) ?? '').localeCompare(dateAssignation.get(a.cours.id) ?? '')
      )
    return (
      <BlocFormateur
        lignes={lignes}
        onOuvrirCours={onOuvrirCours}
        actionEntete={
          <button type="button" className="dash-lien" onClick={onVoirCoursFormateur}>
            Tout voir
          </button>
        }
      />
    )
  }

  const blocQuizFlashTete = () => (
    <div className="dash-carte dash-carte-encre dash-carte-tete dash-avec-objet dash-flash-tete">
      <img className="dash-objet-deborde dash-objet-incline" src={IMAGE_QUIZ_FLASH} alt="" />
      <span className="dash-pastille-orange">Défi du jour</span>
      <h2 className="dash-flash-tete-titre">Quiz flash</h2>
      <p className="dash-flash-tete-texte">
        10 questions sur tes {nbCoursQuizTermines} cours terminés. 5 bonnes réponses pour gagner 30 XP.
      </p>
      <button type="button" className="bouton-orange dash-bouton-large" onClick={onOuvrirQuizFlash}>
        Lancer le quiz flash
      </button>
    </div>
  )

  const blocQuizFlashLigne = () => (
    <div className="dash-carte dash-carte-encre dash-flash-ligne">
      <img className="dash-flash-ligne-objet" src={IMAGE_QUIZ_FLASH} alt="" />
      <div className="dash-flash-ligne-texte">
        <h2>Quiz flash</h2>
        <span className="dash-flash-ligne-meta">10 questions · +30 XP</span>
        <p className="dash-flash-ligne-phrase">
          10 questions sur tes cours terminés. 5 bonnes réponses pour gagner 30 XP.
        </p>
      </div>
      <button type="button" className="bouton-orange dash-flash-ligne-bouton" onClick={onOuvrirQuizFlash}>
        <span className="dash-flash-ligne-bouton-court">Lancer</span>
        <span className="dash-flash-ligne-bouton-long">Lancer le quiz flash</span>
      </button>
    </div>
  )

  const blocQuizFlashVerrouille = () => (
    <div className="dash-carte dash-carte-blanche dash-flash-verrouille">
      <span className="dash-flash-verrouille-objet">
        <img src={IMAGE_QUIZ_FLASH} alt="" />
        <Cadenas />
      </span>
      <div className="dash-flash-verrouille-texte">
        <div className="dash-flash-verrouille-titres">
          <h2>Quiz flash</h2>
          <span className="dash-flash-verrouille-consigne">Réussis 3 quiz de cours pour le débloquer</span>
        </div>
        <div className="dash-barre-ligne">
          <span className="dash-barre dash-barre-fine">
            <span
              className="dash-barre-remplissage"
              style={{ width: `${(Math.min(nbCoursQuizTermines, SEUIL_QUIZ_FLASH) / SEUIL_QUIZ_FLASH) * 100}%` }}
            />
          </span>
          <span className="dash-barre-compteur dash-barre-compteur-petit">
            {Math.min(nbCoursQuizTermines, SEUIL_QUIZ_FLASH)} / {SEUIL_QUIZ_FLASH}
          </span>
        </div>
      </div>
    </div>
  )

  const blocProchainBadge = () => {
    const objectif = objectifBadge(prochainBadge.condition_deblocage, statsBadges)
    return (
      <div className="dash-carte dash-carte-lavande dash-badge">
        <div className="dash-badge-entete">
          <button
            type="button"
            className="dash-badge-vignette"
            aria-label={`${prochainBadge.nom}, verrouillé`}
            onClick={() => ouvrirBadges(prochainBadge)}
          >
            <img className="dash-badge-gris" src={iconeBadge(prochainBadge)} alt="" />
            <Cadenas />
          </button>
          <div className="dash-badge-texte">
            <span className="dash-libelle-violet">Prochain badge</span>
            <h2 className="dash-titre-carte">{prochainBadge.nom}</h2>
            <span className="dash-sous-texte">{objectif.texte}</span>
          </div>
        </div>
        <div className="dash-barre-ligne">
          <span className="dash-barre dash-barre-epaisse">
            <span className="dash-barre-remplissage" style={{ width: `${(objectif.valeur / objectif.cible) * 100}%` }} />
          </span>
          <span className="dash-barre-compteur">
            {objectif.valeur} / {objectif.cible} {objectif.unite}
          </span>
        </div>
        <div className="dash-badge-rangee">
          {badgesTries.map((b) => (
            <button
              key={b.id}
              type="button"
              className="dash-badge-mini-bouton"
              aria-label={idsBadgesObtenus.has(b.id) ? b.nom : `${b.nom}, verrouillé`}
              onClick={() => ouvrirBadges(b)}
            >
              <img
                className={`dash-badge-mini${idsBadgesObtenus.has(b.id) ? '' : ' dash-badge-mini-verrouille'}`}
                src={iconeBadge(b)}
                alt=""
              />
            </button>
          ))}
          <button type="button" className="dash-lien dash-badge-lien" onClick={() => ouvrirBadges()}>
            Mes badges · {nbBadgesObtenus}/{tousBadges.length}
          </button>
        </div>
      </div>
    )
  }

  const blocCollectionVitrine = () => (
    <div className="dash-carte dash-carte-lavande dash-collection">
      <div className="dash-collection-entete">
        <div className="dash-badge-texte">
          <span className="dash-libelle-violet">Collection complète</span>
          <h2 className="dash-titre-carte">
            {tousBadges.length} badges sur {tousBadges.length}
          </h2>
        </div>
        <button type="button" className="dash-lien" onClick={() => ouvrirBadges()}>
          Voir mes badges
        </button>
      </div>
      <div className="dash-collection-rangee">
        {badgesTries.map((b) => (
          <button key={b.id} type="button" className="dash-collection-badge" aria-label={b.nom} onClick={() => ouvrirBadges(b)}>
            <img src={iconeBadge(b)} alt="" />
          </button>
        ))}
      </div>
    </div>
  )

  const blocBibliothequeTerminee = () => (
    <div className="dash-carte dash-carte-blanche dash-bibliotheque">
      <img className="dash-objet-coin" src={IMAGE_BIBLIOTHEQUE_TERMINEE} alt="" />
      <span className="dash-libelle-violet">Bibliothèque terminée</span>
      <h2 className="dash-titre-carte">Tu as fini les {cours.length} cours</h2>
      <span className="dash-sous-texte">De nouveaux cours arrivent. Le quiz flash garde tes acquis au chaud.</span>
    </div>
  )

  // --- Situation → liste ordonnée de blocs ---------------------------------------------------

  const blocQuizFlashSecondaire = () =>
    quizFlashDebloque ? { cle: 'flash', rendu: blocQuizFlashLigne } : { cle: 'flash-verrouille', rendu: blocQuizFlashVerrouille }

  const blocs = []
  if (tousTermines) {
    // 7. Tous les cours accessibles terminés
    blocs.push(quizFlashDebloque ? { cle: 'flash-tete', rendu: blocQuizFlashTete } : blocQuizFlashSecondaire())
    blocs.push({ cle: 'bibliotheque', rendu: blocBibliothequeTerminee })
  } else if (coursEnCours) {
    // 2 et 3. Un cours en cours : jamais de deuxième cours à commencer
    blocs.push({ cle: 'en-cours', rendu: () => blocCoursEnCours(coursEnCours) })
    const autresAssignes = assignesAFaire.filter((c) => c.id !== coursEnCours.id)
    if (autresAssignes.length > 0) blocs.push({ cle: 'formateur', rendu: () => blocFormateur(autresAssignes) })
    blocs.push(blocQuizFlashSecondaire())
  } else if (assignesAFaire.length > 0) {
    // 4. Rien en cours, des cours assignés : la consigne du formateur passe en tête
    const [premierAssigne, ...autresAssignes] = assignesAFaire
    blocs.push({ cle: 'assigne', rendu: () => blocAssigneEnTete(premierAssigne) })
    if (autresAssignes.length > 0) blocs.push({ cle: 'formateur', rendu: () => blocFormateur(autresAssignes) })
    blocs.push(blocQuizFlashSecondaire())
  } else if (coursConseille) {
    // 1, 5 et 6. Rien en cours, rien d'assigné
    const premier = !aCommenceQuelqueChose
    if (quizFlashDebloque && !premier) {
      blocs.push({ cle: 'flash-tete', rendu: blocQuizFlashTete })
      blocs.push({ cle: 'conseille', rendu: () => blocCoursConseille(coursConseille, false) })
    } else {
      blocs.push({ cle: 'conseille', rendu: () => blocCoursConseilleTete(coursConseille, premier) })
      blocs.push(blocQuizFlashSecondaire())
    }
  }

  // Bloc badges : H tant que la collection n'est pas complète, puis la vitrine I (permanente).
  if (prochainBadge) blocs.push({ cle: 'badge', rendu: blocProchainBadge })
  else if (collectionComplete) blocs.push({ cle: 'collection', rendu: blocCollectionVitrine })

  // Placement desktop (grille 2fr / 1fr) : rangée 1 = bloc de tête + bloc quiz flash à droite
  // (ou le bloc suivant si le quiz flash est déjà en tête) ; rangées suivantes = blocs restants
  // dans l'ordre, un bloc seul en fin de rangée prenant toute la largeur. Sur mobile, les blocs
  // restent dans l'ordre de la situation (ordre du DOM).
  // Quiz flash verrouillé (desktop) : le bloc badges (prochain badge en version verticale, ou
  // collection complète) passe à droite du bloc de tête, et le quiz flash verrouillé devient une
  // bande pleine largeur sous la rangée 1 ; les autres blocs suivent dans l'ordre.
  const estQuizFlash = (bloc) => bloc.cle.startsWith('flash')
  const estBlocBadges = (bloc) => bloc.cle === 'badge' || bloc.cle === 'collection'
  const blocBadges = blocs.find(estBlocBadges)
  const blocFlashVerrouille = blocs.find((b) => b.cle === 'flash-verrouille')
  const dispositionVerrouillee = !quizFlashDebloque && blocBadges && blocFlashVerrouille
  let blocTete, blocCote, bandes, blocsSuite
  if (dispositionVerrouillee) {
    const restants = blocs.filter((b) => b !== blocBadges && b !== blocFlashVerrouille)
    blocTete = restants[0] ?? null
    blocCote = blocBadges
    bandes = [blocFlashVerrouille]
    blocsSuite = restants.slice(1)
  } else {
    const [tete, ...autresBlocs] = blocs
    blocTete = tete
    blocCote = tete && !estQuizFlash(tete) ? autresBlocs.find(estQuizFlash) ?? autresBlocs[0] : autresBlocs[0]
    bandes = []
    blocsSuite = autresBlocs.filter((b) => b !== blocCote)
  }
  const placementDesktop = new Map()
  if (blocTete) placementDesktop.set(blocTete, { ligne: 1, colonne: blocCote ? '1' : '1 / -1', classe: 'dash-cellule-tete' })
  if (blocCote) {
    placementDesktop.set(blocCote, {
      ligne: 1,
      colonne: blocTete ? '2' : '1 / -1',
      classe: `dash-cellule-tete dash-cellule-cote${dispositionVerrouillee ? ' dash-cellule-badges-verticale' : ''}`,
    })
  }
  bandes.forEach((bloc, i) => placementDesktop.set(bloc, { ligne: 2 + i, colonne: '1 / -1', classe: 'dash-cellule-bande' }))
  const premiereLigneSuite = 2 + bandes.length
  blocsSuite.forEach((bloc, i) => {
    const seulEnFin = i % 2 === 0 && i === blocsSuite.length - 1
    placementDesktop.set(bloc, {
      ligne: premiereLigneSuite + Math.floor(i / 2),
      colonne: seulEnFin ? '1 / -1' : i % 2 === 0 ? '1' : '2',
      classe: '',
    })
  })

  return (
    <div className="espace-page espace-page-etroit dash-page">
      <header className="dash-entete">
        <h1>Salut {profil.prenom}</h1>
        <span className="dash-xp">
          <img src={IMAGE_QUIZ_FLASH} alt="" />
          {profil.xp_total} XP
        </span>
      </header>

      {erreurCours && <p className="message message-erreur">Impossible de charger tes cours ({erreurCours}).</p>}

      {blocs.length > 0 && (
        <div className="dash-blocs">
          {blocs.map((bloc) => {
            const placement = placementDesktop.get(bloc)
            return (
              <div
                key={bloc.cle}
                className={`dash-cellule ${placement.classe}${
                  bloc.cle === 'badge' || bloc.cle === 'collection' ? ' dash-cellule-badges' : ''
                }${placement.colonne === '1 / -1' ? ' dash-cellule-pleine' : ''}`}
                style={{ '--dash-ligne': placement.ligne, '--dash-colonne': placement.colonne }}
              >
                {bloc.rendu()}
              </div>
            )
          })}
        </div>
      )}

      {modaleBadges && (
        <ModaleBadges
          badges={badgesTries}
          idsBadgesObtenus={idsBadgesObtenus}
          dateObtentionParBadge={dateObtentionParBadge}
          conditionEnClair={(badge) => objectifBadge(badge.condition_deblocage, statsBadges).texte}
          badgeIdEnEvidence={modaleBadges.badgeId}
          onFermer={() => setModaleBadges(null)}
        />
      )}
    </div>
  )
}

function formaterDateObtention(dateIso) {
  if (!dateIso) return null
  return new Date(dateIso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

// Modale « Mes badges » : grille de tous les badges (obtenus avec leur date, verrouillés grisés
// avec cadenas). Ouverte sur un badge précis, elle défile jusqu'à lui et le met en évidence 1 s.
function ModaleBadges({ badges, idsBadgesObtenus, dateObtentionParBadge, conditionEnClair, badgeIdEnEvidence, onFermer }) {
  const refsBadges = useRef(new Map())
  const [enEvidence, setEnEvidence] = useState(badgeIdEnEvidence)

  useEffect(() => {
    if (!badgeIdEnEvidence) return
    refsBadges.current.get(badgeIdEnEvidence)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    const minuteur = setTimeout(() => setEnEvidence(null), 1000)
    return () => clearTimeout(minuteur)
  }, [badgeIdEnEvidence])

  const nbObtenus = badges.filter((b) => idsBadgesObtenus.has(b.id)).length

  return (
    <div className="modal-overlay" onClick={onFermer}>
      <div
        className="dash-modale-badges"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dash-modale-badges-titre"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dash-modale-badges-entete">
          <h2 id="dash-modale-badges-titre">Mes badges</h2>
          <span className="dash-modale-badges-compteur">
            {nbObtenus}/{badges.length}
          </span>
          <button type="button" className="modal-fermer" onClick={onFermer} aria-label="Fermer">
            ×
          </button>
        </div>
        <ul className="dash-modale-badges-grille">
          {badges.map((badge) => {
            const obtenu = idsBadgesObtenus.has(badge.id)
            const date = formaterDateObtention(dateObtentionParBadge.get(badge.id))
            return (
              <li
                key={badge.id}
                ref={(el) => (el ? refsBadges.current.set(badge.id, el) : refsBadges.current.delete(badge.id))}
                className={`dash-modale-badge${enEvidence === badge.id ? ' dash-modale-badge-evidence' : ''}`}
              >
                <span className="dash-modale-badge-pastille">
                  <img className={obtenu ? '' : 'dash-badge-gris'} src={iconeBadge(badge)} alt="" />
                  {!obtenu && <Cadenas />}
                </span>
                <span className="dash-modale-badge-nom">{badge.nom}</span>
                <span className="dash-modale-badge-condition">{conditionEnClair(badge)}</span>
                {obtenu && <span className="dash-modale-badge-etat">{date ? `Obtenu le ${date}` : 'Obtenu'}</span>}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
