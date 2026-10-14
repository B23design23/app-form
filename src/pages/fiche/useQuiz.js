import { useState } from 'react'

const ETAT_INITIAL = { index: 0, selection: [], valide: false, historique: [] }

// État d'un QCM partagé par le quiz de cours et le quiz flash : question courante, sélection,
// validation et historique des réponses ({ question, selection, correcte }).
export function useQuiz(questions) {
  const [quiz, setQuiz] = useState(ETAT_INITIAL)

  const enCours = quiz.index > 0 || quiz.valide
  const derniere = quiz.index === questions.length - 1

  function reinitialiser() {
    setQuiz(ETAT_INITIAL)
  }

  function basculer(reponseId) {
    if (quiz.valide) return
    const question = questions[quiz.index]
    setQuiz((q) => ({
      ...q,
      selection:
        question.type_reponse === 'simple'
          ? [reponseId]
          : q.selection.includes(reponseId)
            ? q.selection.filter((id) => id !== reponseId)
            : [...q.selection, reponseId],
    }))
  }

  function valider() {
    const question = questions[quiz.index]
    const idsCorrects = question.reponses.filter((r) => r.est_correcte).map((r) => r.id)
    const correcte = quiz.selection.length === idsCorrects.length && quiz.selection.every((id) => idsCorrects.includes(id))
    setQuiz((q) => ({ ...q, valide: true, historique: [...q.historique, { question, selection: q.selection, correcte }] }))
  }

  // Passe à la question suivante ; à la dernière, renvoie l'historique complet (sinon null).
  function suivante() {
    if (!derniere) {
      setQuiz((q) => ({ ...q, index: q.index + 1, selection: [], valide: false }))
      return null
    }
    return quiz.historique
  }

  return { quiz, enCours, derniere, reinitialiser, basculer, valider, suivante }
}
