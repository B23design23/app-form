import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { ajouterXp, verifierBadges } from '../lib/gamification'
import { melanger } from '../lib/shuffle'
import ProgressBar from '../components/ProgressBar'
import CompletionToast from '../components/CompletionToast'
import '../styles/shared.css'
import '../styles/quiz.css'
import './QuizFlash.css'

const NB_QUESTIONS = 10
const XP_QUIZ_FLASH = 30
const SEUIL_REUSSITE = 50

function QuizFlash({ authUser, onRetour }) {
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)
  const [questions, setQuestions] = useState([])

  const [indexQuestion, setIndexQuestion] = useState(0)
  const [selection, setSelection] = useState([])
  const [valide, setValide] = useState(false)
  const [derniereReponseCorrecte, setDerniereReponseCorrecte] = useState(false)
  const [bonnesReponses, setBonnesReponses] = useState(0)
  const [quizTermine, setQuizTermine] = useState(false)
  const [scoreFinal, setScoreFinal] = useState(null)
  const [overlay, setOverlay] = useState(null)

  useEffect(() => {
    let annule = false

    async function charger() {
      const { data: scoresQuizCours, error: erreurScores } = await supabase
        .from('scores')
        .select('cours_id')
        .eq('user_id', authUser.id)
        .eq('type', 'quiz_cours')

      if (annule) return
      if (erreurScores) {
        setErreur(erreurScores.message)
        setChargement(false)
        return
      }

      const coursIds = [...new Set((scoresQuizCours ?? []).map((s) => s.cours_id))]

      const { data: questionsDisponibles, error: erreurQuestions } = await supabase
        .from('questions')
        .select('id, enonce, type_reponse, reponses(id, texte, est_correcte, explication)')
        .in('cours_id', coursIds)

      if (annule) return
      if (erreurQuestions) {
        setErreur(erreurQuestions.message)
        setChargement(false)
        return
      }

      const tirage = melanger(questionsDisponibles ?? [])
        .slice(0, NB_QUESTIONS)
        .map((q) => ({ ...q, reponses: melanger(q.reponses) }))
      setQuestions(tirage)
      setChargement(false)
    }

    charger()

    return () => {
      annule = true
    }
  }, [authUser])

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

    const score = Math.round((bonnesReponses / questions.length) * 100)
    setScoreFinal(score)

    await supabase.from('scores').insert({
      user_id: authUser.id,
      cours_id: null,
      type: 'quiz_flash',
      score,
      date: new Date().toISOString(),
    })

    if (score >= SEUIL_REUSSITE) {
      await ajouterXp(authUser, XP_QUIZ_FLASH)
      const nouveauxBadges = await verifierBadges(authUser)
      setOverlay({
        titre: `Quiz flash terminé — ${bonnesReponses}/${questions.length} (${score}%)`,
        xp: XP_QUIZ_FLASH,
        badges: nouveauxBadges,
      })
    } else {
      setOverlay({
        titre: `Quiz flash terminé — ${bonnesReponses}/${questions.length} (${score}%)`,
        xp: null,
        badges: [],
      })
    }

    setQuizTermine(true)
  }

  useEffect(() => {
    if (!overlay) return
    const minuteur = setTimeout(() => setOverlay(null), 3500)
    return () => clearTimeout(minuteur)
  }, [overlay])

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
          <p className="message message-erreur">Impossible de charger le quiz flash ({erreur}).</p>
        </div>
      </div>
    )
  }

  const questionCourante = questions[indexQuestion]
  const questionsRepondues = valide ? indexQuestion + 1 : indexQuestion
  const pluriel = bonnesReponses > 1 ? 's' : ''
  const labelProgression = `Question ${indexQuestion + 1}/${questions.length} · ${bonnesReponses} bonne${pluriel} réponse${pluriel} sur ${questionsRepondues}`

  return (
    <div className="flow-page">
      <div className="flow-card quiz-flash-card">
        <button type="button" className="lien-retour" onClick={onRetour}>
          ← Retour au tableau de bord
        </button>

        <h1>Quiz flash</h1>

        {questions.length === 0 ? (
          <p className="message message-erreur">Aucune question disponible pour le quiz flash.</p>
        ) : quizTermine ? (
          <div className="quiz-resume">
            <p>
              Quiz flash terminé — {bonnesReponses}/{questions.length} bonnes réponses ({scoreFinal}%).
            </p>
            {scoreFinal >= SEUIL_REUSSITE ? (
              <p>Réussi — {XP_QUIZ_FLASH} XP gagnés.</p>
            ) : (
              <p>Score en dessous de {SEUIL_REUSSITE}% — retente ta chance !</p>
            )}
          </div>
        ) : (
          questionCourante && (
            <>
              <ProgressBar
                etapeActuelle={indexQuestion + 1}
                totalEtapes={questions.length}
                label={labelProgression}
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

      <CompletionToast overlay={overlay} onFermer={() => setOverlay(null)} />
    </div>
  )
}

export default QuizFlash
