import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/shared.css'
import './DetailCoursFormateur.css'

function DetailCoursFormateur({ authUser, coursId, onModifier, onRetour }) {
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  const [cours, setCours] = useState(null)
  const [questions, setQuestions] = useState([])
  const [etapes, setEtapes] = useState([])

  const [suppression, setSuppression] = useState(false)
  const [confirmationSuppression, setConfirmationSuppression] = useState(false)

  useEffect(() => {
    let annule = false

    async function charger() {
      const [coursRes, questionsRes, etapesRes] = await Promise.all([
        supabase.from('cours').select('id, titre, contenu, categorie, domaine, formateur_id').eq('id', coursId).single(),
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
      ])

      if (annule) return

      const premiereErreur = coursRes.error?.message ?? questionsRes.error?.message ?? etapesRes.error?.message
      if (premiereErreur) {
        setErreur(premiereErreur)
        setChargement(false)
        return
      }

      setCours(coursRes.data)
      setQuestions(questionsRes.data ?? [])
      setEtapes(etapesRes.data ?? [])
      setChargement(false)
    }

    charger()

    return () => {
      annule = true
    }
  }, [coursId])

  async function handleConfirmerSuppression() {
    setSuppression(true)
    const { error } = await supabase.from('cours').delete().eq('id', coursId)
    setSuppression(false)

    if (error) {
      setConfirmationSuppression(false)
      setErreur(`Le cours n'a pas pu être supprimé (${error.message}).`)
      return
    }

    onRetour()
  }

  if (chargement) {
    return (
      <div className="flow-page flow-page-formateur">
        <div className="flow-card">
          <p>Chargement…</p>
        </div>
      </div>
    )
  }

  if (erreur) {
    return (
      <div className="flow-page flow-page-formateur">
        <div className="page-avec-lien-retour page-large">
          <button type="button" className="lien-retour" onClick={onRetour}>
            ← Retour
          </button>
          <div className="flow-card">
            <p className="message message-erreur">{erreur}</p>
          </div>
        </div>
      </div>
    )
  }

  const estProprietaire = cours.formateur_id === authUser.id

  return (
    <div className="flow-page flow-page-formateur">
      <div className="page-avec-lien-retour page-large">
        <button type="button" className="lien-retour" onClick={onRetour}>
          ← Retour
        </button>

        <div className="flow-card detail-cours-card">
          <h1>{cours.titre}</h1>

          {estProprietaire && !confirmationSuppression && (
            <div className="detail-actions">
              <button type="button" className="bouton-secondaire" onClick={onModifier}>
                Modifier
              </button>
              <button
                type="button"
                className="detail-bouton-supprimer"
                onClick={() => setConfirmationSuppression(true)}
              >
                Supprimer
              </button>
            </div>
          )}

          {estProprietaire && confirmationSuppression && (
            <div className="detail-confirmation-suppression">
              <p>Supprimer définitivement ce cours ? Cette action est irréversible.</p>
              <div className="detail-actions">
                <button
                  type="button"
                  className="bouton-secondaire"
                  onClick={() => setConfirmationSuppression(false)}
                  disabled={suppression}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="detail-bouton-supprimer"
                  onClick={handleConfirmerSuppression}
                  disabled={suppression}
                >
                  {suppression ? 'Suppression…' : 'Oui, supprimer'}
                </button>
              </div>
            </div>
          )}

          <section className="detail-section">
            <h2>Leçon</h2>
            <p className="detail-meta">
              Domaine : {cours.domaine || '—'} · Catégorie : {cours.categorie || '—'}
            </p>
            <div className="detail-contenu">{cours.contenu}</div>
          </section>

          <section className="detail-section">
            <h2>
              QCM ({questions.length} question{questions.length > 1 ? 's' : ''})
            </h2>
            {questions.length === 0 ? (
              <p className="dashboard-etat-vide">Aucune question.</p>
            ) : (
              questions.map((question, qi) => (
                <div className="detail-bloc" key={question.id}>
                  <p className="detail-question-enonce">
                    {qi + 1}. {question.enonce}
                  </p>
                  <p className="detail-question-type">
                    {question.type_reponse === 'simple' ? 'Réponse unique' : 'Réponses multiples'}
                  </p>
                  <ul className="detail-reponses">
                    {question.reponses.map((reponse) => (
                      <li
                        key={reponse.id}
                        className={reponse.est_correcte ? 'detail-reponse-correcte' : 'detail-reponse-fausse'}
                      >
                        {reponse.est_correcte ? '✓' : '—'} {reponse.texte}
                        {!reponse.est_correcte && reponse.explication && (
                          <span className="detail-explication"> — {reponse.explication}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </section>

          {etapes.length > 0 && (
            <section className="detail-section">
              <h2>Checklist terrain</h2>
              <ol className="detail-etapes">
                {etapes.map((etape) => (
                  <li key={etape.id}>
                    <span>{etape.intitule}</span>
                    {etape.bloquante && <span className="detail-badge-bloquante">Bloquante</span>}
                    {etape.critere_validation && (
                      <p className="detail-critere">Critère : {etape.critere_validation}</p>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetailCoursFormateur
