import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { ajouterXp, verifierBadges } from '../lib/gamification'
import { melanger } from '../lib/shuffle'
import { imageTheme } from '../lib/thematiques'
import CompletionToast from '../components/CompletionToast'
import EcranLecon from './fiche/EcranLecon'
import EcranQuiz from './fiche/EcranQuiz'
import EcranFinQuiz, { SEUIL_REUSSITE } from './fiche/EcranFinQuiz'
import EcranChecklist from './fiche/EcranChecklist'
import EcranRecap from './fiche/EcranRecap'
import { useQuiz } from './fiche/useQuiz'
import '../styles/shared.css'
import './FicheCours.css'
import { tempsLecture } from '../lib/cours'

// Fiche de cours en parcours guidé : Leçon → Quiz → (fin de quiz) → Checklist, puis récap.
// Les étapes dépendent du contenu du cours. Voir CLAUDE.md, section « Fiche de cours ».

const XP_QUIZ = 20
const XP_CHECKLIST = 15

async function marquerProgression(authUser, coursId, statut) {
  const { data: existante } = await supabase
    .from('progression')
    .select('id')
    .eq('user_id', authUser.id)
    .eq('cours_id', coursId)
    .maybeSingle()

  if (existante) {
    await supabase
      .from('progression')
      .update({ statut, updated_at: new Date().toISOString() })
      .eq('id', existante.id)
  } else {
    await supabase.from('progression').insert({ user_id: authUser.id, cours_id: coursId, statut })
  }

  return verifierBadges(authUser)
}

// Checklist terminée (y compris depuis Mode terrain, leçon non ouverte) : le cours passe en
// « en_cours » s'il était « non_commence » ou sans ligne ; « termine » reste « termine ». updated_at
// est toujours mis à jour (activité visible du formateur, sortie des « Élèves à relancer »).
async function marquerChecklistTerminee(authUser, coursId) {
  const { data: existante } = await supabase
    .from('progression')
    .select('id, statut')
    .eq('user_id', authUser.id)
    .eq('cours_id', coursId)
    .maybeSingle()

  const maintenant = new Date().toISOString()
  if (existante) {
    await supabase
      .from('progression')
      .update({
        checklist_terminee: true,
        updated_at: maintenant,
        ...(existante.statut === 'non_commence' ? { statut: 'en_cours' } : {}),
      })
      .eq('id', existante.id)
  } else {
    await supabase
      .from('progression')
      .insert({ user_id: authUser.id, cours_id: coursId, statut: 'en_cours', checklist_terminee: true, updated_at: maintenant })
  }

  return verifierBadges(authUser)
}


// Score d'un passage : « 4/5 » si le détail est enregistré (migration 0007), sinon « 80 % ».
function libelleScore(passage) {
  if (!passage) return null
  if (passage.bonnes_reponses != null && passage.nb_questions != null) {
    return `${passage.bonnes_reponses}/${passage.nb_questions}`
  }
  return `${passage.score} %`
}

// Meilleur passage : score le plus haut ; à score égal, celui qui a le détail « x/y ».
function meilleurPassage(passages) {
  return passages.reduce((meilleur, p) => {
    if (!meilleur || p.score > meilleur.score) return p
    if (p.score === meilleur.score && meilleur.nb_questions == null && p.nb_questions != null) return p
    return meilleur
  }, null)
}

// État d'une checklist en cours (étapes validées / passées), mémorisé dans le navigateur par
// utilisateur et par cours. Stockage indisponible : l'app fonctionne sans mémorisation.
const cleChecklistLocale = (userId, coursId) => `skillo:checklist:${userId}:${coursId}`

function lireChecklistLocale(userId, coursId) {
  try {
    const brut = window.localStorage.getItem(cleChecklistLocale(userId, coursId))
    const donnees = brut ? JSON.parse(brut) : null
    return {
      validees: Array.isArray(donnees?.validees) ? donnees.validees : [],
      passees: Array.isArray(donnees?.passees) ? donnees.passees : [],
    }
  } catch {
    return { validees: [], passees: [] }
  }
}

function ecrireChecklistLocale(userId, coursId, validees, passees) {
  try {
    window.localStorage.setItem(cleChecklistLocale(userId, coursId), JSON.stringify({ validees, passees }))
  } catch {
    // stockage indisponible (navigation privée, quota…) : pas de mémorisation
  }
}

function effacerChecklistLocale(userId, coursId) {
  try {
    window.localStorage.removeItem(cleChecklistLocale(userId, coursId))
  } catch {
    // idem
  }
}

// Fin de quiz de cours : étape suivante en bouton principal ; sous 50 %, « Refaire le quiz »
// passe en principal et l'étape suivante en lien.
function EcranFinQuizCours({ cours, resultat, etapeSuivante, onRefaire, onRetour }) {
  const reussi = resultat.score >= SEUIL_REUSSITE
  return (
    <EcranFinQuiz
      titreBarre={cours.titre}
      onRetour={onRetour}
      resultat={resultat}
      actionPrincipale={reussi ? etapeSuivante : { bouton: 'Refaire le quiz', onClick: onRefaire }}
      liens={reussi ? [] : [etapeSuivante]}
    />
  )
}

// apercu : « Voir comme un élève » (formateur) — vraie fiche, mais aucune écriture dans
// progression, scores, user_badges ni dans le stockage du navigateur ; bandeau en haut.
function FicheCours({ authUser, coursId, sectionInitiale, onRetour, onRetourTheme, onOuvrirCours, navigationDesktop, apercu = false }) {
  // Toutes les écritures passent par cet objet, neutralisé en aperçu
  const ecritures = apercu
    ? {
        progression: async () => [],
        checklistTerminee: async () => [],
        xp: async () => {},
        badges: async () => [],
        score: async () => ({ error: null }),
        lireLocale: () => ({ validees: [], passees: [] }),
        ecrireLocale: () => {},
        effacerLocale: () => {},
      }
    : {
        progression: (statut) => marquerProgression(authUser, coursId, statut),
        checklistTerminee: () => marquerChecklistTerminee(authUser, coursId),
        xp: (montant) => ajouterXp(authUser, montant),
        badges: () => verifierBadges(authUser),
        score: (ligne) => supabase.from('scores').insert(ligne),
        lireLocale: () => lireChecklistLocale(authUser.id, coursId),
        ecrireLocale: (validees, passees) => ecrireChecklistLocale(authUser.id, coursId, validees, passees),
        effacerLocale: () => effacerChecklistLocale(authUser.id, coursId),
      }
  const accesTerrain = sectionInitiale === 'checklist'

  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  const [cours, setCours] = useState(null)
  const [questions, setQuestions] = useState([])
  const [etapes, setEtapes] = useState([])
  const [progression, setProgression] = useState(null)
  const [meilleurScore, setMeilleurScore] = useState(null)
  const [passageMeilleur, setPassageMeilleur] = useState(null)
  const [suiteTheme, setSuiteTheme] = useState(null)

  const [ecran, setEcran] = useState(null)
  const [overlay, setOverlay] = useState(null)

  const [finQuiz, setFinQuiz] = useState(null)
  const [finQuizEnCours, setFinQuizEnCours] = useState(false)

  const [etapesValidees, setEtapesValidees] = useState([])
  // Étapes non bloquantes passées (« Passer cette étape ») : comptent pour terminer la checklist
  const [etapesPassees, setEtapesPassees] = useState([])
  const [ordreApprenant, setOrdreApprenant] = useState([])
  const [feedbackOrdre, setFeedbackOrdre] = useState(null)

  // --- Chargement --------------------------------------------------------------------------

  useEffect(() => {
    let annule = false

    async function charger() {
      const [coursRes, questionsRes, etapesRes, progressionRes, scoresRes] = await Promise.all([
        // select('*') : tolère l'absence de la colonne a_retenir tant que la migration 0006 n'est pas jouée
        supabase.from('cours').select('*').eq('id', coursId).single(),
        supabase
          .from('questions')
          .select('id, enonce, type_reponse, reponses(id, texte, est_correcte, explication)')
          .eq('cours_id', coursId)
          .order('id'),
        supabase
          .from('etapes_checklist')
          .select('id, ordre, intitule, critere_validation, bloquante')
          .eq('cours_id', coursId)
          .order('ordre'),
        apercu
          ? Promise.resolve({ data: null, error: null })
          : supabase
              .from('progression')
              .select('id, statut, checklist_terminee')
              .eq('user_id', authUser.id)
              .eq('cours_id', coursId)
              .maybeSingle(),
        apercu
          ? Promise.resolve({ data: [], error: null })
          : supabase
              .from('scores')
              // select('*') : tolère l'absence des colonnes de la migration 0007
              .select('*')
              .eq('user_id', authUser.id)
              .eq('cours_id', coursId)
              .eq('type', 'quiz_cours'),
      ])

      if (annule) return

      const premiereErreur =
        coursRes.error?.message ??
        questionsRes.error?.message ??
        etapesRes.error?.message ??
        progressionRes.error?.message ??
        scoresRes.error?.message
      if (premiereErreur) {
        setErreur(premiereErreur)
        setChargement(false)
        return
      }

      const coursData = coursRes.data
      const questionsData = (questionsRes.data ?? []).map((q) => ({ ...q, reponses: melanger(q.reponses) }))
      const etapesData = etapesRes.data ?? []
      const progressionData = progressionRes.data ?? null
      const scoresData = scoresRes.data ?? []
      const passage = meilleurPassage(scoresData)
      const meilleur = passage ? passage.score : null

      setCours(coursData)
      setQuestions(questionsData)
      setEtapes(etapesData)
      setProgression(progressionData)
      setMeilleurScore(meilleur)
      setPassageMeilleur(passage)

      if (progressionData?.checklist_terminee) {
        setEtapesValidees(etapesData.map((e) => e.id))
        ecritures.effacerLocale()
      } else if (coursData.checklist_mode !== 'reorder') {
        // Reprise d'une checklist en cours (seules les étapes qui existent encore sont gardées)
        const ids = new Set(etapesData.map((e) => e.id))
        const local = ecritures.lireLocale()
        setEtapesValidees(local.validees.filter((id) => ids.has(id)))
        setEtapesPassees(local.passees.filter((id) => ids.has(id) && !local.validees.includes(id)))
      }
      if (coursData.checklist_mode === 'reorder' && etapesData.length > 0) {
        const idsOriginaux = etapesData.map((e) => e.id)
        let idsMelanges = melanger(idsOriginaux)
        for (let essai = 0; essai < 5 && idsOriginaux.length > 1 && idsMelanges.every((id, i) => id === idsOriginaux[i]); essai++) {
          idsMelanges = melanger(idsOriginaux)
        }
        setOrdreApprenant(idsMelanges)
      }

      // Point d'entrée : Mode terrain → checklist ; cours entièrement terminé → récap ;
      // sinon la première étape non terminée.
      const aQuiz = questionsData.length > 0
      const aChecklist = etapesData.length > 0
      const leconLue = !!progressionData && progressionData.statut !== 'non_commence'
      const quizFait = meilleur !== null
      const checklistFaite = progressionData?.checklist_terminee === true
      const complet =
        progressionData?.statut === 'termine' && (!aQuiz || quizFait) && (!aChecklist || checklistFaite)

      let ecranInitial = 'lecon'
      if (accesTerrain && aChecklist) ecranInitial = 'checklist'
      else if (sectionInitiale === 'lecon') ecranInitial = 'lecon'
      else if (complet) ecranInitial = 'recap'
      else if (!leconLue) ecranInitial = 'lecon'
      else if (aQuiz && !quizFait) ecranInitial = 'quiz'
      else if (aChecklist && !checklistFaite) ecranInitial = 'checklist'
      setEcran(ecranInitial)

      // Suite du thème : cours publics du même thème, ordre pédagogique
      const { data: coursTheme } = await supabase
        .from('cours')
        .select('id, titre, ordre, created_at, contenu, questions(id), etapes_checklist(id)')
        .eq('visibilite', 'public')
        .eq('categorie', coursData.categorie)
        .order('ordre', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true })
      const idsTheme = (coursTheme ?? []).map((c) => c.id)
      const { data: progressionTheme } = idsTheme.length
        ? await supabase.from('progression').select('cours_id, statut').eq('user_id', authUser.id).in('cours_id', idsTheme)
        : { data: [] }
      if (annule) return
      const termines = new Set((progressionTheme ?? []).filter((p) => p.statut === 'termine').map((p) => p.cours_id))
      setSuiteTheme((coursTheme ?? []).find((c) => c.id !== coursId && !termines.has(c.id)) ?? null)

      setChargement(false)
    }

    charger()

    return () => {
      annule = true
    }
  }, [authUser, coursId, accesTerrain, sectionInitiale])

  const aQuiz = questions.length > 0
  const aChecklist = etapes.length > 0
  const leconLue = !!progression && progression.statut !== 'non_commence'
  const quizFait = meilleurScore !== null
  const checklistFaite = progression?.checklist_terminee === true
  const coursTermine = progression?.statut === 'termine'
  const coursComplet = coursTermine && (!aQuiz || quizFait) && (!aChecklist || checklistFaite)

  // Ouvrir la leçon la marque comme lue (comportement conservé).
  useEffect(() => {
    if (ecran !== 'lecon' || chargement || leconLue) return
    setProgression((p) => ({ ...(p ?? {}), statut: 'en_cours' }))
    ecritures.progression('en_cours').then((nouveauxBadges) => {
      if (nouveauxBadges.length > 0) setOverlay({ titre: 'Nouveau badge', xp: null, badges: nouveauxBadges, type: 'badge' })
    })
  }, [ecran, chargement, leconLue, authUser, coursId])

  useEffect(() => {
    if (!overlay) return
    const minuteur = setTimeout(() => setOverlay(null), 3500)
    return () => clearTimeout(minuteur)
  }, [overlay])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [ecran])

  // --- Quiz ---------------------------------------------------------------------------------

  const { quiz, enCours: quizEnCours, reinitialiser, basculer, valider, suivante } = useQuiz(questions)

  function ouvrirQuiz({ recommencer = false } = {}) {
    if (recommencer || !quizEnCours) reinitialiser()
    setEcran('quiz')
  }

  async function questionSuivante() {
    const historique = suivante()
    if (historique) await finirQuiz(historique)
  }

  async function finirQuiz(historique) {
    if (finQuizEnCours) return
    setFinQuizEnCours(true)

    const bonnes = historique.filter((h) => h.correcte).length
    const score = Math.round((bonnes / questions.length) * 100)
    const premierQuiz = meilleurScore === null

    // Chaque passage est enregistré (le meilleur score est conservé) ; l'XP n'est donné qu'une fois.
    // Détail « x/y » (migration 0007) ; si la colonne n'existe pas encore, on réessaie sans.
    const ligneScore = { user_id: authUser.id, cours_id: coursId, type: 'quiz_cours', score, date: new Date().toISOString() }
    const detail = { bonnes_reponses: bonnes, nb_questions: questions.length }
    const { error: erreurDetail } = await ecritures.score({ ...ligneScore, ...detail })
    if (erreurDetail) {
      console.error('scores (détail x/y)', erreurDetail.message)
      await ecritures.score(ligneScore)
    }
    if (premierQuiz) await ecritures.xp(XP_QUIZ)

    // Le cours n'est terminé que quand toutes ses parties sont faites : avec une checklist pas
    // encore faite, le quiz laisse le cours « en cours ».
    const statutApresQuiz = coursTermine || !aChecklist || checklistFaite ? 'termine' : 'en_cours'
    const nouveauxBadges = coursTermine ? await ecritures.badges() : await ecritures.progression(statutApresQuiz)

    setProgression((p) => ({ ...(p ?? {}), statut: statutApresQuiz }))
    setMeilleurScore((m) => (m === null ? score : Math.max(m, score)))
    setPassageMeilleur((p) => meilleurPassage([...(p ? [p] : []), { score, ...(erreurDetail ? {} : detail) }]))
    setFinQuiz({ bonnes, total: questions.length, score, xpGagne: premierQuiz ? XP_QUIZ : 0, badges: nouveauxBadges, historique })
    setFinQuizEnCours(false)
    setEcran('fin-quiz')
  }

  // --- Checklist ----------------------------------------------------------------------------

  async function terminerChecklist() {
    let nouveauxBadges = []
    let xp = null
    if (!checklistFaite) {
      await ecritures.xp(XP_CHECKLIST)
      xp = XP_CHECKLIST
      nouveauxBadges = await ecritures.checklistTerminee()
    }
    ecritures.effacerLocale()
    // La checklist fait passer un cours non commencé en « en cours » (écrit par checklistTerminee).
    let statut = progression?.statut && progression.statut !== 'non_commence' ? progression.statut : 'en_cours'
    // Le cours est terminé quand toutes ses parties sont faites : sans QCM, ou QCM déjà fait.
    if ((!aQuiz || quizFait) && statut !== 'termine') {
      nouveauxBadges = [...nouveauxBadges, ...(await ecritures.progression('termine'))]
      statut = 'termine'
    }
    setProgression((p) => ({ ...(p ?? {}), statut, checklist_terminee: true }))
    if (xp !== null || nouveauxBadges.length > 0) {
      setOverlay({ titre: 'Checklist terminée', xp, badges: nouveauxBadges, type: 'checklist' })
    }
    if (statut === 'termine' && (!aQuiz || quizFait)) setEcran('recap')
  }

  // Mémorise l'avancement local tant que la checklist n'est pas terminée en base.
  useEffect(() => {
    if (chargement || checklistFaite || cours?.checklist_mode === 'reorder') return
    if (etapesValidees.length === 0 && etapesPassees.length === 0) return
    ecritures.ecrireLocale(etapesValidees, etapesPassees)
  }, [chargement, checklistFaite, cours, etapesValidees, etapesPassees, authUser.id, coursId])

  // La checklist est terminée quand toutes les étapes sont validées ou passées.
  function validerEtape(etapeId) {
    if (etapesValidees.includes(etapeId) || etapesPassees.includes(etapeId)) return
    const nouvelles = [...etapesValidees, etapeId]
    setEtapesValidees(nouvelles)
    if (nouvelles.length + etapesPassees.length === etapes.length) terminerChecklist()
  }

  function passerEtape(etapeId) {
    const etape = etapes.find((e) => e.id === etapeId)
    if (!etape || etape.bloquante || etapesValidees.includes(etapeId) || etapesPassees.includes(etapeId)) return
    const nouvelles = [...etapesPassees, etapeId]
    setEtapesPassees(nouvelles)
    if (etapesValidees.length + nouvelles.length === etapes.length) terminerChecklist()
  }

  function deplacerEtape(index, direction) {
    setOrdreApprenant((prev) => {
      const cible = index + direction
      if (cible < 0 || cible >= prev.length) return prev
      const nouveau = [...prev]
      ;[nouveau[index], nouveau[cible]] = [nouveau[cible], nouveau[index]]
      return nouveau
    })
    setFeedbackOrdre(null)
  }

  function validerOrdre() {
    const ordreCorrect = [...etapes].sort((a, b) => a.ordre - b.ordre).map((e) => e.id)
    const estCorrect =
      ordreApprenant.length === ordreCorrect.length && ordreApprenant.every((id, i) => id === ordreCorrect[i])
    setFeedbackOrdre(estCorrect ? 'correct' : 'incorrect')
    if (estCorrect) {
      setEtapesValidees(etapes.map((e) => e.id))
      terminerChecklist()
    }
  }

  async function terminerCoursSansQuizNiChecklist() {
    const nouveauxBadges = await ecritures.progression('termine')
    setProgression((p) => ({ ...(p ?? {}), statut: 'termine' }))
    if (nouveauxBadges.length > 0) setOverlay({ titre: 'Cours terminé', xp: null, badges: nouveauxBadges, type: 'badge' })
    setEcran('recap')
  }

  // --- Rendu --------------------------------------------------------------------------------

  if (erreur) {
    return (
      <div className="fiche-page">
        <div className="fiche-colonne">
          <button type="button" className="fiche-retour" onClick={onRetour}>
            Retour
          </button>
          <p className="message message-erreur">Impossible de charger ce cours ({erreur}).</p>
        </div>
      </div>
    )
  }

  if (chargement || !ecran) {
    return (
      <div className="fiche-page">
        <p>Chargement…</p>
      </div>
    )
  }

  const scoreMeilleur = libelleScore(passageMeilleur)
  const parties = ['lecon', ...(aQuiz ? ['quiz'] : []), ...(aChecklist ? ['checklist'] : [])]
  const estFaite = { lecon: leconLue, quiz: quizFait, checklist: checklistFaite }

  const allerA = (partie) => {
    if (partie === 'quiz') ouvrirQuiz({ recommencer: !quizEnCours })
    else setEcran(partie)
  }

  // Repère d'étapes : étape de l'écran = en cours ; faite = lien ; à venir = non cliquable, sauf
  // leçon et quiz depuis la checklist ouverte par Mode terrain.
  // Toutes les parties faites : toutes les étapes en « faite », aucune en cours (même sur l'écran
  // de la checklist d'un cours terminé).
  const toutFait = parties.every((partie) => estFaite[partie])
  const construireReper = (partieCourante) =>
    parties.length < 2
      ? null
      : parties.map((partie) => {
          const etat = toutFait
            ? 'faite'
            : partie === partieCourante
              ? 'courante'
              : estFaite[partie]
                ? 'faite'
                : 'a-venir'
          const exceptionTerrain = accesTerrain && partieCourante === 'checklist' && partie !== 'checklist'
          return {
            cle: partie,
            libelle:
              partie === 'lecon'
                ? 'Leçon'
                : partie === 'quiz'
                  ? quizFait
                    ? `Quiz · ${scoreMeilleur}`
                    : 'Quiz'
                  : 'Checklist',
            etat,
            cliquable: etat === 'faite' || (etat === 'a-venir' && exceptionTerrain),
            onClick: () => allerA(partie),
          }
        })

  // Étape suivante après la leçon (ou après la checklist si le quiz reste à faire)
  const etapeQuiz = {
    titre: 'Vérifie ce que tu as retenu',
    detail: `${questions.length} question${questions.length > 1 ? 's' : ''} · +${XP_QUIZ} XP`,
    bouton: quizEnCours ? 'Reprendre le quiz' : 'Passer au quiz',
    onClick: () => ouvrirQuiz(),
  }
  const etapeChecklist = {
    titre: 'Passe à la pratique',
    detail: `${etapes.length} étape${etapes.length > 1 ? 's' : ''} · +${XP_CHECKLIST} XP`,
    bouton: 'Passer à la checklist',
    onClick: () => setEcran('checklist'),
  }
  const etapeSuivanteLecon =
    aQuiz && !quizFait ? etapeQuiz : aChecklist && !checklistFaite ? etapeChecklist : null

  const xpGagnes = (quizFait ? XP_QUIZ : 0) + (checklistFaite ? XP_CHECKLIST : 0)
  const afficheNavigation = ecran !== 'quiz' && ecran !== 'fin-quiz'

  return (
    <div
      className={`fiche-page${afficheNavigation && navigationDesktop ? ' fiche-page-avec-nav' : ''}${
        apercu ? ' fiche-page-apercu' : ''
      }`}
    >
      {afficheNavigation && navigationDesktop}

      {apercu && (
        <div className="fiche-apercu-bandeau" role="status">
          <span>Aperçu élève · rien n'est enregistré</span>
          <button type="button" className="fiche-apercu-quitter" onClick={onRetour}>
            Quitter l'aperçu
          </button>
        </div>
      )}

      {ecran === 'lecon' && (
        <EcranLecon
          cours={cours}
          reper={construireReper('lecon')}
          minutesLecture={tempsLecture(cours.contenu)}
          etapeSuivante={etapeSuivanteLecon}
          coursComplet={coursComplet}
          sansQuizNiChecklist={!aQuiz && !aChecklist}
          coursTermine={coursTermine}
          onTerminerCours={terminerCoursSansQuizNiChecklist}
          onVoirRecap={() => setEcran('recap')}
          onRetour={onRetour}
        />
      )}

      {ecran === 'quiz' && (
        <EcranQuiz
          questions={questions}
          libelleQuestion={() => cours.titre}
          imageQuestion={() => imageTheme(cours.categorie)}
          labelQuitter="Quitter le quiz"
          quiz={quiz}
          envoiEnCours={finQuizEnCours}
          onBasculer={basculer}
          onValider={valider}
          onSuivante={questionSuivante}
          onQuitter={() => setEcran('lecon')}
          onRevoirLecon={() => setEcran('lecon')}
        />
      )}

      {ecran === 'fin-quiz' && finQuiz && (
        <EcranFinQuizCours
          cours={cours}
          resultat={finQuiz}
          etapeSuivante={
            aChecklist && !checklistFaite
              ? { bouton: 'Passer à la checklist', onClick: () => setEcran('checklist') }
              : { bouton: 'Terminer le cours', onClick: () => setEcran('recap') }
          }
          onRefaire={() => ouvrirQuiz({ recommencer: true })}
          onRetour={() => onRetourTheme(cours.categorie)}
        />
      )}

      {ecran === 'checklist' && (
        <EcranChecklist
          cours={cours}
          etapes={etapes}
          reper={construireReper('checklist')}
          etapesValidees={etapesValidees}
          etapesPassees={etapesPassees}
          checklistFaite={checklistFaite}
          ordreApprenant={ordreApprenant}
          feedbackOrdre={feedbackOrdre}
          etapeSuivante={checklistFaite && aQuiz && !quizFait ? etapeQuiz : null}
          onValiderEtape={validerEtape}
          onPasserEtape={passerEtape}
          onDeplacer={deplacerEtape}
          onValiderOrdre={validerOrdre}
          onRetour={onRetour}
        />
      )}

      {ecran === 'recap' && (
        <EcranRecap
          cours={cours}
          parties={parties}
          minutesLecture={tempsLecture(cours.contenu)}
          meilleur={quizFait ? scoreMeilleur : null}
          nbEtapes={etapes.length}
          xpGagnes={xpGagnes}
          suiteTheme={apercu ? null : suiteTheme}
          onRelire={() => setEcran('lecon')}
          onRefaireQuiz={() => ouvrirQuiz({ recommencer: true })}
          onRevoirChecklist={() => setEcran('checklist')}
          onOuvrirCours={onOuvrirCours}
          onRetour={onRetour}
        />
      )}

      <CompletionToast overlay={overlay} onFermer={() => setOverlay(null)} />
    </div>
  )
}

export default FicheCours
