import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { iconeBadge } from '../lib/badges'
import ProgressBar from '../components/ProgressBar'
import '../styles/shared.css'
import './FicheCours.css'

const XP_QUIZ = 20
const XP_CHECKLIST = 15
const SEUIL_QUIZ_FLASH_REUSSI = 50

async function verifierBadges(authUser) {
  const [badgesRes, userBadgesRes, scoresRes, progressionRes] = await Promise.all([
    supabase.from('badges').select('id, nom, icone, condition_deblocage'),
    supabase.from('user_badges').select('badge_id').eq('user_id', authUser.id),
    supabase.from('scores').select('type, score').eq('user_id', authUser.id),
    supabase.from('progression').select('statut, cours(etapes_checklist(id))').eq('user_id', authUser.id),
  ])

  if (badgesRes.error || userBadgesRes.error || scoresRes.error || progressionRes.error) {
    return []
  }

  const idsDejaObtenus = new Set((userBadgesRes.data ?? []).map((ub) => ub.badge_id))
  const scores = scoresRes.data ?? []
  const coursTermines = (progressionRes.data ?? []).filter((p) => p.statut === 'termine')

  const conditionsRemplies = {
    premier_quiz_complete: scores.some((s) => s.type === 'quiz_cours'),
    premiere_checklist_completee: coursTermines.some((p) => (p.cours?.etapes_checklist?.length ?? 0) > 0),
    trois_cours_termines: coursTermines.length >= 3,
    quiz_100_pourcent: scores.some((s) => s.score === 100),
    premier_quiz_flash_reussi: scores.some(
      (s) => s.type === 'quiz_flash' && s.score >= SEUIL_QUIZ_FLASH_REUSSI
    ),
  }

  const nouveauxBadges = []
  for (const badge of badgesRes.data ?? []) {
    if (idsDejaObtenus.has(badge.id)) continue
    if (!conditionsRemplies[badge.condition_deblocage]) continue

    const { error } = await supabase.from('user_badges').insert({
      user_id: authUser.id,
      badge_id: badge.id,
      date_obtention: new Date().toISOString(),
    })
    if (!error) nouveauxBadges.push(badge)
  }

  return nouveauxBadges
}

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

async function ajouterXp(authUser, montant) {
  const { data } = await supabase.from('profiles').select('xp_total').eq('id', authUser.id).single()
  const nouveauTotal = (data?.xp_total ?? 0) + montant
  await supabase.from('profiles').update({ xp_total: nouveauTotal }).eq('id', authUser.id)
}

function FicheCours({ authUser, coursId, sectionInitiale, onRetour }) {
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  const [cours, setCours] = useState(null)
  const [questions, setQuestions] = useState([])
  const [etapes, setEtapes] = useState([])
  const [dejaTermineAuDepart, setDejaTermineAuDepart] = useState(false)
  const [coursEstTermine, setCoursEstTermine] = useState(false)

  const [sectionActive, setSectionActive] = useState(sectionInitiale === 'checklist' ? 'checklist' : 'lecon')
  const [overlay, setOverlay] = useState(null)

  const [indexQuestion, setIndexQuestion] = useState(0)
  const [selection, setSelection] = useState([])
  const [valide, setValide] = useState(false)
  const [derniereReponseCorrecte, setDerniereReponseCorrecte] = useState(false)
  const [bonnesReponses, setBonnesReponses] = useState(0)
  const [quizTermine, setQuizTermine] = useState(false)
  const [scoreQuizFinal, setScoreQuizFinal] = useState(null)

  const [etapesValidees, setEtapesValidees] = useState([])
  const [checklistTerminee, setChecklistTerminee] = useState(false)

  useEffect(() => {
    let annule = false

    async function charger() {
      const [coursRes, questionsRes, etapesRes, progressionRes] = await Promise.all([
        supabase.from('cours').select('id, titre, contenu').eq('id', coursId).single(),
        supabase
          .from('questions')
          .select('id, enonce, type_reponse, reponses(id, texte, est_correcte, explication)')
          .eq('cours_id', coursId)
          .order('id'),
        supabase
          .from('etapes_checklist')
          .select('id, ordre, intitule, mode_validation, bloquante')
          .eq('cours_id', coursId)
          .order('ordre'),
        supabase
          .from('progression')
          .select('id, statut')
          .eq('user_id', authUser.id)
          .eq('cours_id', coursId)
          .maybeSingle(),
      ])

      if (annule) return

      const premiereErreur =
        coursRes.error?.message ?? questionsRes.error?.message ?? etapesRes.error?.message ?? progressionRes.error?.message
      if (premiereErreur) {
        setErreur(premiereErreur)
        setChargement(false)
        return
      }

      setCours(coursRes.data)
      setQuestions(questionsRes.data ?? [])
      setEtapes(etapesRes.data ?? [])

      const progressionActuelle = progressionRes.data
      setDejaTermineAuDepart(progressionActuelle?.statut === 'termine')
      setCoursEstTermine(progressionActuelle?.statut === 'termine')

      if (!progressionActuelle || progressionActuelle.statut === 'non_commence') {
        const nouveauxBadges = await marquerProgression(authUser, coursId, 'en_cours')
        if (!annule && nouveauxBadges.length > 0) {
          setOverlay({ titre: 'Nouveau badge', xp: null, badges: nouveauxBadges })
        }
      }

      if (!annule) setChargement(false)
    }

    charger()

    return () => {
      annule = true
    }
  }, [authUser, coursId])

  const hasQuiz = questions.length > 0
  const hasChecklist = etapes.length > 0

  useEffect(() => {
    if (chargement || coursEstTermine || !(hasQuiz || hasChecklist)) return

    const complet = (!hasQuiz || quizTermine) && (!hasChecklist || checklistTerminee)
    if (complet) {
      setCoursEstTermine(true)
      marquerProgression(authUser, coursId, 'termine').then((nouveauxBadges) => {
        if (nouveauxBadges.length === 0) return
        setOverlay((actuel) => ({
          titre: actuel?.titre ?? 'Cours terminé',
          xp: actuel?.xp ?? null,
          badges: [...(actuel?.badges ?? []), ...nouveauxBadges],
        }))
      })
    }
  }, [chargement, coursEstTermine, hasQuiz, hasChecklist, quizTermine, checklistTerminee, authUser, coursId])

  useEffect(() => {
    if (!overlay) return
    const minuteur = setTimeout(() => setOverlay(null), 3500)
    return () => clearTimeout(minuteur)
  }, [overlay])

  async function terminerCoursSansQuizNiChecklist() {
    const nouveauxBadges = await marquerProgression(authUser, coursId, 'termine')
    setCoursEstTermine(true)
    if (nouveauxBadges.length > 0) {
      setOverlay({ titre: 'Cours terminé', xp: null, badges: nouveauxBadges })
    }
  }

  function basculerSelection(reponseId) {
    if (valide) return
    const question = questions[indexQuestion]
    if (question.type_reponse === 'simple') {
      setSelection([reponseId])
    } else {
      setSelection((prev) =>
        prev.includes(reponseId) ? prev.filter((id) => id !== reponseId) : [...prev, reponseId]
      )
    }
  }

  function validerReponse() {
    const question = questions[indexQuestion]
    const idsCorrects = question.reponses.filter((r) => r.est_correcte).map((r) => r.id)
    const estCorrecte =
      selection.length === idsCorrects.length && selection.every((id) => idsCorrects.includes(id))
    setDerniereReponseCorrecte(estCorrecte)
    if (estCorrecte) setBonnesReponses((n) => n + 1)
    setValide(true)
  }

  async function questionSuivante() {
    const dernierQuestion = indexQuestion === questions.length - 1

    if (!dernierQuestion) {
      setIndexQuestion((i) => i + 1)
      setSelection([])
      setValide(false)
      return
    }

    const scoreFinal = Math.round((bonnesReponses / questions.length) * 100)
    setScoreQuizFinal(scoreFinal)

    if (!dejaTermineAuDepart) {
      await supabase.from('scores').insert({
        user_id: authUser.id,
        cours_id: coursId,
        type: 'quiz_cours',
        score: scoreFinal,
        date: new Date().toISOString(),
      })
      await ajouterXp(authUser, XP_QUIZ)
      const nouveauxBadges = await verifierBadges(authUser)
      setOverlay({ titre: 'Quiz terminé', xp: XP_QUIZ, badges: nouveauxBadges })
    }

    setQuizTermine(true)
  }

  async function basculerEtape(etapeId) {
    const dejaValidee = etapesValidees.includes(etapeId)
    const nouvelleListe = dejaValidee
      ? etapesValidees.filter((id) => id !== etapeId)
      : [...etapesValidees, etapeId]

    setEtapesValidees(nouvelleListe)

    if (!checklistTerminee && !dejaValidee && nouvelleListe.length === etapes.length) {
      if (!dejaTermineAuDepart) {
        await ajouterXp(authUser, XP_CHECKLIST)
        setOverlay({ titre: 'Checklist terminée', xp: XP_CHECKLIST })
      }
      setChecklistTerminee(true)
    }
  }

  if (chargement) {
    return (
      <div className="flow-page">
        <div className="flow-card">
          <p>Chargement…</p>
        </div>
      </div>
    )
  }

  if (erreur) {
    return (
      <div className="flow-page">
        <div className="flow-card">
          <button type="button" className="lien-retour" onClick={onRetour}>
            ← Retour au tableau de bord
          </button>
          <p className="message message-erreur">Impossible de charger ce cours ({erreur}).</p>
        </div>
      </div>
    )
  }

  const questionCourante = questions[indexQuestion]
  const questionsRepondues = valide ? indexQuestion + 1 : indexQuestion
  const pluriel = bonnesReponses > 1 ? 's' : ''
  const labelProgressionQuiz = `Question ${indexQuestion + 1}/${questions.length} · ${bonnesReponses} bonne${pluriel} réponse${pluriel} sur ${questionsRepondues}`

  return (
    <div className="flow-page">
      <div className="flow-card fiche-cours-card">
        <button type="button" className="lien-retour" onClick={onRetour}>
          ← Retour au tableau de bord
        </button>

        <h1>{cours.titre}</h1>
        {coursEstTermine && <p className="fiche-cours-statut-termine">✓ Cours terminé</p>}

        <div className="fiche-cours-onglets" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={sectionActive === 'lecon'}
            className={`fiche-cours-onglet${sectionActive === 'lecon' ? ' fiche-cours-onglet-actif' : ''}`}
            onClick={() => setSectionActive('lecon')}
          >
            Leçon
          </button>
          {hasQuiz && (
            <button
              type="button"
              role="tab"
              aria-selected={sectionActive === 'quiz'}
              className={`fiche-cours-onglet${sectionActive === 'quiz' ? ' fiche-cours-onglet-actif' : ''}`}
              onClick={() => setSectionActive('quiz')}
            >
              Quiz
            </button>
          )}
          {hasChecklist && (
            <button
              type="button"
              role="tab"
              aria-selected={sectionActive === 'checklist'}
              className={`fiche-cours-onglet${sectionActive === 'checklist' ? ' fiche-cours-onglet-actif' : ''}`}
              onClick={() => setSectionActive('checklist')}
            >
              Checklist
            </button>
          )}
        </div>

        {sectionActive === 'lecon' && (
          <div className="fiche-cours-section">
            <div className="fiche-cours-contenu">{cours.contenu}</div>
            {!hasQuiz && !hasChecklist && !coursEstTermine && (
              <button type="button" className="bouton-primaire" onClick={terminerCoursSansQuizNiChecklist}>
                Terminer le cours
              </button>
            )}
          </div>
        )}

        {sectionActive === 'quiz' && hasQuiz && (
          <div className="fiche-cours-section">
            {quizTermine ? (
              <div className="quiz-resume">
                <p>
                  Quiz terminé — {bonnesReponses}/{questions.length} bonnes réponses ({scoreQuizFinal}%).
                </p>
              </div>
            ) : (
              questionCourante && (
                <>
                  <ProgressBar
                    etapeActuelle={indexQuestion + 1}
                    totalEtapes={questions.length}
                    label={labelProgressionQuiz}
                  />

                  <p className="quiz-enonce">{questionCourante.enonce}</p>

                  <div className="quiz-options">
                    {questionCourante.reponses.map((reponse) => {
                      const estSelectionnee = selection.includes(reponse.id)
                      let classeOption = 'quiz-option'
                      if (valide) {
                        classeOption += ' quiz-option-desactivee'
                        if (reponse.est_correcte) classeOption += ' quiz-option-correcte'
                        if (estSelectionnee && !reponse.est_correcte) classeOption += ' quiz-option-fausse'
                      } else if (estSelectionnee) {
                        classeOption += ' quiz-option-selectionnee'
                      }

                      return (
                        <label key={reponse.id} className={classeOption}>
                          <input
                            type={questionCourante.type_reponse === 'simple' ? 'radio' : 'checkbox'}
                            name={`question-${questionCourante.id}`}
                            checked={estSelectionnee}
                            disabled={valide}
                            onChange={() => basculerSelection(reponse.id)}
                          />
                          <span>{reponse.texte}</span>
                        </label>
                      )
                    })}
                  </div>

                  {valide && (
                    <div
                      className={`quiz-feedback ${derniereReponseCorrecte ? 'quiz-feedback-correcte' : 'quiz-feedback-fausse'}`}
                    >
                      <p>{derniereReponseCorrecte ? 'Bonne réponse !' : 'Réponse incorrecte.'}</p>
                      {!derniereReponseCorrecte &&
                        questionCourante.reponses
                          .filter((r) => selection.includes(r.id) && !r.est_correcte && r.explication)
                          .map((r) => (
                            <p key={r.id} className="quiz-explication">
                              {r.explication}
                            </p>
                          ))}
                    </div>
                  )}

                  {!valide ? (
                    <button
                      type="button"
                      className="bouton-primaire"
                      disabled={selection.length === 0}
                      onClick={validerReponse}
                    >
                      Valider ma réponse
                    </button>
                  ) : (
                    <button type="button" className="bouton-primaire" onClick={questionSuivante}>
                      {indexQuestion === questions.length - 1 ? 'Terminer le quiz' : 'Question suivante'}
                    </button>
                  )}
                </>
              )
            )}
          </div>
        )}

        {sectionActive === 'checklist' && hasChecklist && (
          <div className="fiche-cours-section">
            <h2>Checklist terrain</h2>
            {checklistTerminee && <p className="fiche-cours-confirmation">✓ Checklist terminée</p>}
            <ul className="checklist-liste">
              {etapes.map((etape, index) => {
                const verrouillee = etapes
                  .slice(0, index)
                  .some((precedente) => precedente.bloquante && !etapesValidees.includes(precedente.id))
                const validee = etapesValidees.includes(etape.id)

                return (
                  <li key={etape.id}>
                    <label className={`checklist-item${verrouillee ? ' checklist-item-verrouillee' : ''}`}>
                      <span className="checklist-item-numero">{index + 1}</span>
                      <input
                        type="checkbox"
                        checked={validee}
                        disabled={verrouillee}
                        onChange={() => basculerEtape(etape.id)}
                      />
                      <span>{etape.intitule}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      {overlay && (
        <div className="completion-toast" role="status" onClick={() => setOverlay(null)}>
          <div className="completion-toast-ligne">
            <span className="completion-toast-titre">{overlay.titre}</span>
            {overlay.xp != null && <span className="completion-toast-xp">+{overlay.xp} XP</span>}
          </div>
          {(overlay.badges ?? []).map((badge) => (
            <span key={badge.id} className="completion-toast-badge">
              {iconeBadge(badge.icone)} Badge débloqué : {badge.nom}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default FicheCours
