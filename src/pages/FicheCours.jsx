import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { ajouterXp, verifierBadges } from '../lib/gamification'
import { melanger } from '../lib/shuffle'
import ProgressBar from '../components/ProgressBar'
import CompletionToast from '../components/CompletionToast'
import StatutBadge from '../components/StatutBadge'
import '../styles/shared.css'
import '../styles/quiz.css'
import './FicheCours.css'

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

  const [ordreApprenant, setOrdreApprenant] = useState([])
  const [feedbackOrdre, setFeedbackOrdre] = useState(null)

  useEffect(() => {
    let annule = false

    async function charger() {
      const [coursRes, questionsRes, etapesRes, progressionRes] = await Promise.all([
        supabase.from('cours').select('id, titre, contenu, checklist_mode').eq('id', coursId).single(),
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
      setQuestions((questionsRes.data ?? []).map((q) => ({ ...q, reponses: melanger(q.reponses) })))
      const etapesData = etapesRes.data ?? []
      setEtapes(etapesData)
      if (coursRes.data.checklist_mode === 'reorder' && etapesData.length > 0) {
        const idsOriginaux = etapesData.map((e) => e.id)
        let idsMelanges = melanger(idsOriginaux)
        for (let essai = 0; essai < 5 && idsOriginaux.length > 1 && idsMelanges.every((id, i) => id === idsOriginaux[i]); essai++) {
          idsMelanges = melanger(idsOriginaux)
        }
        setOrdreApprenant(idsMelanges)
      }

      const progressionActuelle = progressionRes.data
      setDejaTermineAuDepart(progressionActuelle?.statut === 'termine')
      setCoursEstTermine(progressionActuelle?.statut === 'termine')

      if (!progressionActuelle || progressionActuelle.statut === 'non_commence') {
        const nouveauxBadges = await marquerProgression(authUser, coursId, 'en_cours')
        if (!annule && nouveauxBadges.length > 0) {
          setOverlay({ titre: 'Nouveau badge', xp: null, badges: nouveauxBadges, type: 'badge' })
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
          type: actuel?.type ?? 'badge',
          score: actuel?.score,
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
      setOverlay({ titre: 'Cours terminé', xp: null, badges: nouveauxBadges, type: 'badge' })
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
      setOverlay({ titre: 'Quiz terminé', xp: XP_QUIZ, badges: nouveauxBadges, type: 'quiz', score: scoreFinal })
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
        setOverlay({ titre: 'Checklist terminée', xp: XP_CHECKLIST, type: 'checklist' })
      }
      setChecklistTerminee(true)
    }
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

  async function validerOrdre() {
    const ordreCorrect = [...etapes].sort((a, b) => a.ordre - b.ordre).map((e) => e.id)
    const estCorrect =
      ordreApprenant.length === ordreCorrect.length && ordreApprenant.every((id, i) => id === ordreCorrect[i])

    setFeedbackOrdre(estCorrect ? 'correct' : 'incorrect')

    if (estCorrect && !checklistTerminee) {
      if (!dejaTermineAuDepart) {
        await ajouterXp(authUser, XP_CHECKLIST)
        setOverlay({ titre: 'Checklist terminée', xp: XP_CHECKLIST, type: 'checklist' })
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
        <div className="page-avec-lien-retour page-large">
          <button type="button" className="lien-retour" onClick={onRetour}>
            ← Retour
          </button>
          <div className="flow-card">
            <p className="message message-erreur">Impossible de charger ce cours ({erreur}).</p>
          </div>
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
      <div className="page-avec-lien-retour page-large">
        <button type="button" className="lien-retour" onClick={onRetour}>
          ← Retour
        </button>

        <div className="flow-card fiche-cours-card">
          <div className="fiche-cours-entete">
            <h1>{cours.titre}</h1>
            {coursEstTermine && <StatutBadge statut="termine" />}
          </div>

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
              {checklistTerminee && <StatutBadge statut="termine" />}

              {cours.checklist_mode === 'reorder' ? (
                <>
                  <p className="checklist-consigne">Remets les étapes dans le bon ordre, puis valide.</p>
                  <ul className="checklist-liste">
                    {ordreApprenant.map((etapeId, index) => {
                      const etape = etapes.find((e) => e.id === etapeId)
                      if (!etape) return null

                      return (
                        <li key={etape.id}>
                          <div className="checklist-item checklist-item-reorder">
                            <span className="checklist-item-numero">{index + 1}</span>
                            <span className="checklist-item-texte">{etape.intitule}</span>
                            <div className="checklist-item-fleches">
                              <button
                                type="button"
                                className="checklist-bouton-fleche"
                                disabled={checklistTerminee || index === 0}
                                onClick={() => deplacerEtape(index, -1)}
                                aria-label="Monter"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                className="checklist-bouton-fleche"
                                disabled={checklistTerminee || index === ordreApprenant.length - 1}
                                onClick={() => deplacerEtape(index, 1)}
                                aria-label="Descendre"
                              >
                                ↓
                              </button>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>

                  {feedbackOrdre && (
                    <p
                      className={`quiz-feedback ${feedbackOrdre === 'correct' ? 'quiz-feedback-correcte' : 'quiz-feedback-fausse'}`}
                    >
                      {feedbackOrdre === 'correct' ? 'Bon ordre !' : "Ce n'est pas encore le bon ordre, réessaie."}
                    </p>
                  )}

                  {!checklistTerminee && (
                    <button type="button" className="bouton-primaire" onClick={validerOrdre}>
                      Valider l'ordre
                    </button>
                  )}
                </>
              ) : (
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
              )}
            </div>
          )}
        </div>
      </div>

      <CompletionToast overlay={overlay} onFermer={() => setOverlay(null)} />
    </div>
  )
}

export default FicheCours
