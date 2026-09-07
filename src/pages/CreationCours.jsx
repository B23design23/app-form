import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/shared.css'
import './CreationCours.css'

function nouvelleReponse() {
  return { localId: crypto.randomUUID(), texte: '', estCorrecte: false, explication: '' }
}

function nouvelleQuestion() {
  return {
    localId: crypto.randomUUID(),
    enonce: '',
    typeReponse: 'simple',
    reponses: [nouvelleReponse(), nouvelleReponse()],
  }
}

function nouvelleEtape() {
  return {
    localId: crypto.randomUUID(),
    intitule: '',
    critereValidation: '',
    modeValidation: 'checkbox',
    bloquante: false,
  }
}

function CreationCours({ authUser, coursId, onTermine, onRetour }) {
  const modeEdition = Boolean(coursId)

  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [categorie, setCategorie] = useState('')
  const [domaine, setDomaine] = useState('climatisation')

  const [questions, setQuestions] = useState(modeEdition ? [] : [nouvelleQuestion()])

  const [aChecklist, setAChecklist] = useState(false)
  const [etapes, setEtapes] = useState([])

  const [mesGroupes, setMesGroupes] = useState([])
  const [groupeIdSelectionne, setGroupeIdSelectionne] = useState('')

  const [chargement, setChargement] = useState(modeEdition)
  const [erreurChargement, setErreurChargement] = useState(null)

  const [enregistrement, setEnregistrement] = useState(false)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    supabase
      .from('groupes')
      .select('id, nom')
      .eq('formateur_id', authUser.id)
      .then(({ data, error }) => {
        if (!error) setMesGroupes(data ?? [])
      })
  }, [authUser.id])

  useEffect(() => {
    if (!modeEdition) return
    let annule = false

    async function charger() {
      const [coursRes, questionsRes, etapesRes] = await Promise.all([
        supabase
          .from('cours')
          .select('id, titre, contenu, categorie, domaine, formateur_id, groupe_id')
          .eq('id', coursId)
          .single(),
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
        setErreurChargement(premiereErreur)
        setChargement(false)
        return
      }

      if (coursRes.data.formateur_id !== authUser.id) {
        setErreurChargement("Tu n'as pas les droits pour modifier ce cours.")
        setChargement(false)
        return
      }

      setTitre(coursRes.data.titre ?? '')
      setContenu(coursRes.data.contenu ?? '')
      setCategorie(coursRes.data.categorie ?? '')
      setDomaine(coursRes.data.domaine ?? '')
      setGroupeIdSelectionne(coursRes.data.groupe_id ?? '')

      setQuestions(
        (questionsRes.data ?? []).map((q) => ({
          localId: crypto.randomUUID(),
          enonce: q.enonce,
          typeReponse: q.type_reponse,
          reponses: q.reponses.map((r) => ({
            localId: crypto.randomUUID(),
            texte: r.texte,
            estCorrecte: r.est_correcte,
            explication: r.explication ?? '',
          })),
        }))
      )

      const etapesData = etapesRes.data ?? []
      setAChecklist(etapesData.length > 0)
      setEtapes(
        etapesData.map((e) => ({
          localId: crypto.randomUUID(),
          intitule: e.intitule,
          critereValidation: e.critere_validation ?? '',
          modeValidation: 'checkbox',
          bloquante: e.bloquante,
        }))
      )

      setChargement(false)
    }

    charger()

    return () => {
      annule = true
    }
  }, [modeEdition, coursId, authUser.id])

  function ajouterQuestion() {
    setQuestions((prev) => [...prev, nouvelleQuestion()])
  }

  function supprimerQuestion(questionId) {
    setQuestions((prev) => prev.filter((q) => q.localId !== questionId))
  }

  function majQuestion(questionId, champ, valeur) {
    setQuestions((prev) => prev.map((q) => (q.localId === questionId ? { ...q, [champ]: valeur } : q)))
  }

  function ajouterReponse(questionId) {
    setQuestions((prev) =>
      prev.map((q) => (q.localId === questionId ? { ...q, reponses: [...q.reponses, nouvelleReponse()] } : q))
    )
  }

  function supprimerReponse(questionId, reponseId) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.localId === questionId ? { ...q, reponses: q.reponses.filter((r) => r.localId !== reponseId) } : q
      )
    )
  }

  function majReponse(questionId, reponseId, champ, valeur) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.localId === questionId
          ? {
              ...q,
              reponses: q.reponses.map((r) => (r.localId === reponseId ? { ...r, [champ]: valeur } : r)),
            }
          : q
      )
    )
  }

  function ajouterEtape() {
    setEtapes((prev) => [...prev, nouvelleEtape()])
  }

  function supprimerEtape(etapeId) {
    setEtapes((prev) => prev.filter((e) => e.localId !== etapeId))
  }

  function majEtape(etapeId, champ, valeur) {
    setEtapes((prev) => prev.map((e) => (e.localId === etapeId ? { ...e, [champ]: valeur } : e)))
  }

  function validerFormulaire() {
    if (titre.trim().length === 0) return 'Le titre du cours est obligatoire.'
    if (questions.length === 0) return 'Ajoute au moins une question au QCM.'

    for (const [index, question] of questions.entries()) {
      if (question.enonce.trim().length === 0) {
        return `L'énoncé de la question ${index + 1} est vide.`
      }
      if (question.reponses.some((r) => r.texte.trim().length === 0)) {
        return `Une réponse de la question ${index + 1} est vide.`
      }
      if (!question.reponses.some((r) => r.estCorrecte)) {
        return `La question ${index + 1} doit avoir au moins une bonne réponse.`
      }
    }

    if (aChecklist) {
      if (etapes.length === 0) return 'Ajoute au moins une étape à la checklist, ou décoche la case.'
      for (const [index, etape] of etapes.entries()) {
        if (etape.intitule.trim().length === 0) {
          return `L'intitulé de l'étape ${index + 1} est vide.`
        }
      }
    }

    return null
  }

  async function handleEnregistrer() {
    const erreurValidation = validerFormulaire()
    if (erreurValidation) {
      setErreur(erreurValidation)
      return
    }

    setErreur(null)
    setEnregistrement(true)

    let coursIdActuel = coursId

    if (modeEdition) {
      const { error: erreurMaj } = await supabase
        .from('cours')
        .update({
          titre: titre.trim(),
          contenu: contenu.trim(),
          domaine: domaine.trim(),
          categorie: categorie.trim(),
          groupe_id: groupeIdSelectionne || null,
        })
        .eq('id', coursId)

      if (erreurMaj) {
        setEnregistrement(false)
        setErreur(`Le cours n'a pas pu être mis à jour (${erreurMaj.message}).`)
        return
      }

      // Plutôt qu'un diff ligne par ligne, on repart de zéro : questions/reponses/etapes_checklist
      // n'ont pas de dépendances externes en dehors du cours, donc supprimer puis réinsérer est sûr.
      const { error: erreurSuppressionQuestions } = await supabase
        .from('questions')
        .delete()
        .eq('cours_id', coursId)
      if (erreurSuppressionQuestions) {
        setEnregistrement(false)
        setErreur(`Les anciennes questions n'ont pas pu être supprimées (${erreurSuppressionQuestions.message}).`)
        return
      }

      const { error: erreurSuppressionEtapes } = await supabase
        .from('etapes_checklist')
        .delete()
        .eq('cours_id', coursId)
      if (erreurSuppressionEtapes) {
        setEnregistrement(false)
        setErreur(`L'ancienne checklist n'a pas pu être supprimée (${erreurSuppressionEtapes.message}).`)
        return
      }
    } else {
      const { data: coursCree, error: erreurCours } = await supabase
        .from('cours')
        .insert({
          titre: titre.trim(),
          contenu: contenu.trim(),
          domaine: domaine.trim(),
          categorie: categorie.trim(),
          visibilite: 'prive',
          formateur_id: authUser.id,
          groupe_id: groupeIdSelectionne || null,
        })
        .select()
        .single()

      if (erreurCours) {
        setEnregistrement(false)
        setErreur(`Le cours n'a pas pu être créé (${erreurCours.message}).`)
        return
      }

      coursIdActuel = coursCree.id
    }

    for (const question of questions) {
      const { data: questionCreee, error: erreurQuestion } = await supabase
        .from('questions')
        .insert({ cours_id: coursIdActuel, enonce: question.enonce.trim(), type_reponse: question.typeReponse })
        .select()
        .single()

      if (erreurQuestion) {
        setEnregistrement(false)
        setErreur(`Une question n'a pas pu être enregistrée (${erreurQuestion.message}).`)
        return
      }

      const reponsesAInserer = question.reponses.map((r) => ({
        question_id: questionCreee.id,
        texte: r.texte.trim(),
        est_correcte: r.estCorrecte,
        explication: r.estCorrecte ? null : r.explication.trim() || null,
      }))

      const { error: erreurReponses } = await supabase.from('reponses').insert(reponsesAInserer)
      if (erreurReponses) {
        setEnregistrement(false)
        setErreur(`Les réponses n'ont pas pu être enregistrées (${erreurReponses.message}).`)
        return
      }
    }

    if (aChecklist && etapes.length > 0) {
      const etapesAInserer = etapes.map((etape, index) => ({
        cours_id: coursIdActuel,
        ordre: index + 1,
        intitule: etape.intitule.trim(),
        critere_validation: etape.critereValidation.trim() || null,
        mode_validation: etape.modeValidation,
        bloquante: etape.bloquante,
      }))

      const { error: erreurEtapes } = await supabase.from('etapes_checklist').insert(etapesAInserer)
      if (erreurEtapes) {
        setEnregistrement(false)
        setErreur(`La checklist n'a pas pu être enregistrée (${erreurEtapes.message}).`)
        return
      }
    }

    setEnregistrement(false)
    onTermine()
  }

  const labelRetour = '← Retour'

  if (chargement) {
    return (
      <div className="flow-page flow-page-formateur">
        <div className="flow-card">
          <p>Chargement…</p>
        </div>
      </div>
    )
  }

  if (erreurChargement) {
    return (
      <div className="flow-page flow-page-formateur">
        <div className="page-avec-lien-retour page-large">
          <button type="button" className="lien-retour" onClick={onRetour}>
            {labelRetour}
          </button>
          <div className="flow-card">
            <p className="message message-erreur">{erreurChargement}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flow-page flow-page-formateur">
      <div className="page-avec-lien-retour page-large">
        <button type="button" className="lien-retour" onClick={onRetour}>
          {labelRetour}
        </button>

        <div className="flow-card creation-cours-card">
          <h1>{modeEdition ? 'Modifier le cours' : 'Créer un cours'}</h1>

          <section className="creation-section">
            <h2>Infos générales</h2>

            <div className="creation-ligne-champs">
              <label className="champ">
                <span>Titre</span>
                <input type="text" required value={titre} onChange={(e) => setTitre(e.target.value)} />
              </label>

              <label className="champ">
                <span>Catégorie</span>
                <input
                  type="text"
                  placeholder="ex. Froid, Électricité, Sécurité"
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                />
              </label>
            </div>

            <label className="champ">
              <span>Contenu de la leçon</span>
              <textarea value={contenu} onChange={(e) => setContenu(e.target.value)} />
            </label>

            <div className="creation-ligne-champs">
              <label className="champ">
                <span>Domaine</span>
                <input type="text" value={domaine} onChange={(e) => setDomaine(e.target.value)} />
              </label>

              <label className="champ">
                <span>Assigner à un groupe (optionnel)</span>
                <select
                  value={groupeIdSelectionne}
                  onChange={(e) => setGroupeIdSelectionne(e.target.value)}
                >
                  <option value="">— Aucun —</option>
                  {mesGroupes.map((groupe) => (
                    <option key={groupe.id} value={groupe.id}>
                      {groupe.nom}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="creation-section">
            <h2>QCM</h2>

            {questions.map((question, qi) => (
              <div className="creation-bloc" key={question.localId}>
                <div className="creation-bloc-header">
                  <h3>Question {qi + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      className="creation-bouton-supprimer"
                      onClick={() => supprimerQuestion(question.localId)}
                    >
                      Supprimer
                    </button>
                  )}
                </div>

                <label className="champ">
                  <span>Énoncé</span>
                  <textarea
                    value={question.enonce}
                    onChange={(e) => majQuestion(question.localId, 'enonce', e.target.value)}
                  />
                </label>

                <label className="champ">
                  <span>Type de réponse</span>
                  <select
                    value={question.typeReponse}
                    onChange={(e) => majQuestion(question.localId, 'typeReponse', e.target.value)}
                  >
                    <option value="simple">Réponse unique</option>
                    <option value="multiple">Réponses multiples</option>
                  </select>
                </label>

                <div className="creation-reponses">
                  {question.reponses.map((reponse, ri) => (
                    <div className="creation-reponse" key={reponse.localId}>
                      <div className="creation-reponse-ligne">
                        <input
                          type="text"
                          className="creation-reponse-texte"
                          placeholder={`Réponse ${ri + 1}`}
                          value={reponse.texte}
                          onChange={(e) =>
                            majReponse(question.localId, reponse.localId, 'texte', e.target.value)
                          }
                        />
                        {question.reponses.length > 2 && (
                          <button
                            type="button"
                            className="creation-bouton-supprimer"
                            onClick={() => supprimerReponse(question.localId, reponse.localId)}
                          >
                            ×
                          </button>
                        )}
                      </div>

                      <label className="creation-checkbox">
                        <input
                          type="checkbox"
                          checked={reponse.estCorrecte}
                          onChange={(e) =>
                            majReponse(question.localId, reponse.localId, 'estCorrecte', e.target.checked)
                          }
                        />
                        Réponse correcte
                      </label>

                      {!reponse.estCorrecte && (
                        <input
                          type="text"
                          className="creation-reponse-explication"
                          placeholder="Explication si cette réponse est choisie (optionnel)"
                          value={reponse.explication}
                          onChange={(e) =>
                            majReponse(question.localId, reponse.localId, 'explication', e.target.value)
                          }
                        />
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="bouton-ajouter"
                    onClick={() => ajouterReponse(question.localId)}
                  >
                    + Ajouter une réponse
                  </button>
                </div>
              </div>
            ))}

            <button type="button" className="bouton-ajouter" onClick={ajouterQuestion}>
              + Ajouter une question
            </button>
          </section>

          <section className="creation-section">
            <h2>Checklist terrain</h2>

            <label className="creation-checkbox">
              <input type="checkbox" checked={aChecklist} onChange={(e) => setAChecklist(e.target.checked)} />
              Ce cours a une checklist terrain
            </label>

            {aChecklist && (
              <div className="creation-etapes">
                {etapes.map((etape, ei) => (
                  <div className="creation-bloc" key={etape.localId}>
                    <div className="creation-bloc-header">
                      <h3>Étape {ei + 1}</h3>
                      <button
                        type="button"
                        className="creation-bouton-supprimer"
                        onClick={() => supprimerEtape(etape.localId)}
                      >
                        Supprimer
                      </button>
                    </div>

                    <label className="champ">
                      <span>Intitulé</span>
                      <input
                        type="text"
                        value={etape.intitule}
                        onChange={(e) => majEtape(etape.localId, 'intitule', e.target.value)}
                      />
                    </label>

                    <label className="champ">
                      <span>Critère de validation (optionnel)</span>
                      <input
                        type="text"
                        value={etape.critereValidation}
                        onChange={(e) => majEtape(etape.localId, 'critereValidation', e.target.value)}
                      />
                    </label>

                    <label className="creation-checkbox">
                      <input
                        type="checkbox"
                        checked={etape.bloquante}
                        onChange={(e) => majEtape(etape.localId, 'bloquante', e.target.checked)}
                      />
                      Étape bloquante
                    </label>
                  </div>
                ))}

                <button type="button" className="bouton-ajouter" onClick={ajouterEtape}>
                  + Ajouter une étape
                </button>
              </div>
            )}
          </section>

          {erreur && <p className="message message-erreur">{erreur}</p>}

          <button type="button" className="bouton-primaire" disabled={enregistrement} onClick={handleEnregistrer}>
            {enregistrement
              ? 'Enregistrement…'
              : modeEdition
                ? 'Enregistrer les modifications'
                : 'Enregistrer le cours'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreationCours
