import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { ajouterXp, verifierBadges } from '../lib/gamification'
import { melanger } from '../lib/shuffle'
import { imageTheme } from '../lib/thematiques'
import EcranQuiz from './fiche/EcranQuiz'
import EcranFinQuiz, { SEUIL_REUSSITE } from './fiche/EcranFinQuiz'
import { useQuiz } from './fiche/useQuiz'
import '../styles/shared.css'
import './FicheCours.css'

// Quiz flash : même composant que le quiz de cours (mode concentré, réponses, correction) et
// même écran de fin. Questions tirées parmi les cours dont l'apprenant a fait le quiz.
const NB_QUESTIONS = 10
const XP_QUIZ_FLASH = 30

function QuizFlash({ authUser, onRetour, onOuvrirLecon }) {
  const [essai, setEssai] = useState(0)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)
  const [questions, setQuestions] = useState([])
  const [resultat, setResultat] = useState(null)
  const [envoiEnCours, setEnvoiEnCours] = useState(false)

  const { quiz, reinitialiser, basculer, valider, suivante } = useQuiz(questions)

  useEffect(() => {
    let annule = false

    async function charger() {
      setChargement(true)
      setResultat(null)
      reinitialiser()

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
        .select('id, enonce, type_reponse, cours_id, cours(titre, categorie), reponses(id, texte, est_correcte, explication)')
        .in('cours_id', coursIds)

      if (annule) return
      if (erreurQuestions) {
        setErreur(erreurQuestions.message)
        setChargement(false)
        return
      }

      setQuestions(
        melanger(questionsDisponibles ?? [])
          .slice(0, NB_QUESTIONS)
          .map((q) => ({ ...q, reponses: melanger(q.reponses) }))
      )
      setChargement(false)
    }

    charger()

    return () => {
      annule = true
    }
    // reinitialiser est stable dans son usage (remet l'état initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, essai])

  async function questionSuivante() {
    const historique = suivante()
    if (!historique || envoiEnCours) return
    setEnvoiEnCours(true)

    const bonnes = historique.filter((h) => h.correcte).length
    const score = Math.round((bonnes / questions.length) * 100)
    await supabase.from('scores').insert({
      user_id: authUser.id,
      cours_id: null,
      type: 'quiz_flash',
      score,
      date: new Date().toISOString(),
    })

    // 50 % et plus : 30 XP et vérification des badges (Éclair)
    let badges = []
    if (score >= SEUIL_REUSSITE) {
      await ajouterXp(authUser, XP_QUIZ_FLASH)
      badges = await verifierBadges(authUser)
    }

    setResultat({
      bonnes,
      total: questions.length,
      score,
      xpGagne: score >= SEUIL_REUSSITE ? XP_QUIZ_FLASH : 0,
      badges,
      historique,
    })
    setEnvoiEnCours(false)
  }

  if (chargement) {
    return (
      <div className="fiche-page">
        <p>Chargement…</p>
      </div>
    )
  }

  if (erreur || questions.length === 0) {
    return (
      <div className="fiche-page">
        <div className="fiche-colonne">
          <button type="button" className="fiche-retour" onClick={onRetour}>
            Retour à l'accueil
          </button>
          <p className="message message-erreur">
            {erreur ? `Impossible de charger le quiz flash (${erreur}).` : 'Aucune question disponible pour le quiz flash.'}
          </p>
        </div>
      </div>
    )
  }

  if (resultat) {
    const reussi = resultat.score >= SEUIL_REUSSITE
    const relancer = { bouton: 'Relancer un quiz flash', onClick: () => setEssai((n) => n + 1) }
    const accueil = { bouton: "Retour à l'accueil", onClick: onRetour }
    return (
      <div className="fiche-page">
        <EcranFinQuiz
          titreBarre="Quiz flash"
          onRetour={onRetour}
          resultat={resultat}
          titre={reussi ? undefined : 'Tu y es presque'}
          sousTitre={reussi ? undefined : `${Math.ceil((SEUIL_REUSSITE / 100) * resultat.total)} bonnes réponses pour gagner ${XP_QUIZ_FLASH} XP.`}
          actionPrincipale={reussi ? accueil : relancer}
          liens={reussi ? [] : [accueil]}
        />
      </div>
    )
  }

  return (
    <div className="fiche-page">
      <EcranQuiz
        questions={questions}
        quiz={quiz}
        libelleQuestion={(question) => question.cours?.titre ?? ''}
        imageQuestion={(question) => imageTheme(question.cours?.categorie)}
        labelQuitter="Quitter le quiz flash"
        envoiEnCours={envoiEnCours}
        onBasculer={basculer}
        onValider={valider}
        onSuivante={questionSuivante}
        onQuitter={onRetour}
        onRevoirLecon={(question) => onOuvrirLecon(question.cours_id)}
      />
    </div>
  )
}

export default QuizFlash
