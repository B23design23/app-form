import ContenuMarkdown from '../../components/ContenuMarkdown'
import Icone from '../../components/Icone'
import iconeCroix from '../../Assets/croix.svg?raw'
import iconeCoche from '../../Assets/check.svg?raw'
import { typo } from '../../lib/typographie'

// Objet 3D de la bonne réponse : la cible (même image que le badge « Sans faute »).
const IMAGE_CIBLE = '/illustrations/badges/sans-faute.png'

// Statut d'une réponse après validation (jamais porté par la couleur seule : pastille + texte).
function statutReponse(reponse, choisie) {
  if (reponse.est_correcte) return { classe: 'correcte', icone: iconeCoche, texte: choisie ? 'Ta réponse' : 'Bonne réponse' }
  if (choisie) return { classe: 'fausse', icone: iconeCroix, texte: 'Ta réponse' }
  return { classe: 'neutre', icone: null, texte: null }
}

// QCM en mode concentré, partagé par le quiz de cours et le quiz flash : pas d'en-tête lavande ni
// de repère d'étapes, question et réponses posées directement sur le fond de page.
// libelleQuestion(question) : libellé violet au-dessus de la question (cours d'origine) ;
// imageQuestion(question) : objet 3D du bloc de correction quand la réponse est fausse.
function EcranQuiz({
  questions,
  quiz,
  libelleQuestion,
  imageQuestion,
  labelQuitter,
  envoiEnCours,
  onBasculer,
  onValider,
  onSuivante,
  onQuitter,
  onRevoirLecon,
}) {
  const question = questions[quiz.index]
  if (!question) return null

  const multiple = question.type_reponse !== 'simple'
  const derniere = quiz.index === questions.length - 1
  const resultat = quiz.valide ? quiz.historique[quiz.historique.length - 1] : null
  const explications = resultat
    ? question.reponses
        .filter((r) => (resultat.correcte ? r.est_correcte : quiz.selection.includes(r.id) && !r.est_correcte))
        .map((r) => typo(r.explication))
        .filter(Boolean)
    : []
  const progression = ((quiz.index + (quiz.valide ? 1 : 0)) / questions.length) * 100

  return (
    <div className="fiche-colonne fiche-quiz">
      <div className="fiche-quiz-haut">
        <button type="button" className="fiche-bouton-rond" onClick={onQuitter} aria-label={labelQuitter}>
          <Icone svg={iconeCroix} className="fiche-bouton-rond-icone" />
        </button>
        <span className="fiche-barre" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={quiz.index + 1}>
          <span className="fiche-barre-remplissage" style={{ width: `${progression}%` }} />
        </span>
        <span className="fiche-quiz-compteur">
          {quiz.index + 1} / {questions.length}
        </span>
      </div>

      <div className="fiche-quiz-question-bloc">
        <span className="fiche-quiz-cours">{typo(libelleQuestion(question))}</span>
        <ContenuMarkdown texte={question.enonce} className="fiche-quiz-question" />
        {multiple && <span className="fiche-quiz-aide">Plusieurs réponses possibles</span>}
      </div>

      <div className="fiche-reponses" role={multiple ? 'group' : 'radiogroup'}>
        {question.reponses.map((reponse) => {
          const choisie = quiz.selection.includes(reponse.id)
          const statut = quiz.valide ? statutReponse(reponse, choisie) : null
          const classe = statut ? ` fiche-reponse-${statut.classe}` : choisie ? ' fiche-reponse-selectionnee' : ''
          return (
            <label key={reponse.id} className={`fiche-reponse${classe}`}>
              <input
                className="fiche-reponse-input"
                type={multiple ? 'checkbox' : 'radio'}
                name={`question-${question.id}`}
                checked={choisie}
                disabled={quiz.valide}
                onChange={() => onBasculer(reponse.id)}
              />
              {/* Repère du type de question (rond / carré), masqué après validation */}
              {!quiz.valide && (
                <span className={`fiche-reponse-controle fiche-reponse-controle-${multiple ? 'carre' : 'rond'}`} aria-hidden="true">
                  {choisie && multiple && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17L4 12" />
                    </svg>
                  )}
                </span>
              )}
              <span className="fiche-reponse-texte">{typo(reponse.texte)}</span>
              {statut?.texte && (
                <span className={`fiche-reponse-pastille fiche-reponse-pastille-${statut.classe}`}>
                  <Icone svg={statut.icone} className="fiche-reponse-pastille-icone" />
                  {statut.texte}
                </span>
              )}
            </label>
          )
        })}
      </div>

      {resultat && (
        <div className="fiche-feedback">
          <img className="fiche-feedback-objet" src={resultat.correcte ? IMAGE_CIBLE : imageQuestion(question)} alt="" />
          <h2 className="fiche-feedback-titre">{resultat.correcte ? 'Bien vu' : 'Raté, mais tu vas retenir ça'}</h2>
          {explications.map((texte) => (
            <p key={texte} className="fiche-feedback-texte">
              {texte}
            </p>
          ))}
          {!resultat.correcte && (
            <button type="button" className="fiche-feedback-lien" onClick={() => onRevoirLecon(question)}>
              Revoir la leçon
            </button>
          )}
        </div>
      )}

      {/* Bouton d'action fixé en bas : même place pendant toute la question */}
      <div className="fiche-barre-action">
        <div className="fiche-barre-action-contenu">
          {!quiz.valide ? (
            <button
              type="button"
              className="bouton-primaire fiche-bouton-quiz"
              disabled={quiz.selection.length === 0}
              onClick={onValider}
            >
              Valider ma réponse
            </button>
          ) : (
            <button type="button" className="bouton-primaire fiche-bouton-quiz" disabled={envoiEnCours} onClick={onSuivante}>
              {derniere ? 'Voir mon score' : 'Question suivante'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EcranQuiz
