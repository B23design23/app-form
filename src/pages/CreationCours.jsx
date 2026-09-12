import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Dropdown from '../components/Dropdown'
import ContenuMarkdown from '../components/ContenuMarkdown'
import iconeTrash from '../Assets/trash.svg'
import iconeOeil from '../Assets/eye.svg'
import '../styles/shared.css'
import './CreationCours.css'

const TYPES_REPONSE = [
  { value: 'simple', label: 'Réponse unique' },
  { value: 'multiple', label: 'Réponses multiples' },
]

const MODES_CHECKLIST = [
  { value: 'checkbox', label: 'Cases à cocher' },
  { value: 'reorder', label: 'Réorganisation' },
]

function nouvelleReponse() {
  return { localId: crypto.randomUUID(), texte: '', estCorrecte: false, explication: '' }
}

function nouvelleQuestion() {
  return {
    localId: crypto.randomUUID(),
    enonce: '',
    typeReponse: 'simple',
    reponses: [nouvelleReponse(), nouvelleReponse()],
    estOuverte: true,
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

async function notifierMakeNouveauCours(titreCours, groupeIds) {
  try {
    const resultats = await Promise.all(
      groupeIds.map((groupeId) => supabase.rpc('get_membres_groupe', { p_groupe_id: groupeId }))
    )

    const membresParEmail = new Map()
    for (const { data, error } of resultats) {
      if (error) continue
      for (const m of data ?? []) {
        if (m.email && !membresParEmail.has(m.email)) {
          membresParEmail.set(m.email, { email: m.email, prenom: m.prenom })
        }
      }
    }

    const membres = [...membresParEmail.values()]
    if (membres.length === 0) return

    fetch(import.meta.env.VITE_MAKE_WEBHOOK_NOUVEAU_COURS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'nouveau_cours', titre: titreCours, membres }),
    }).catch((err) => console.error('Notification Make échouée:', err))
  } catch (err) {
    console.error('Notification Make échouée:', err)
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
  const [checklistMode, setChecklistMode] = useState('checkbox')
  const [etapes, setEtapes] = useState([])

  const [mesGroupes, setMesGroupes] = useState([])
  const [groupeIdsSelectionnes, setGroupeIdsSelectionnes] = useState([])

  const [estAdmin, setEstAdmin] = useState(false)

  const [chargement, setChargement] = useState(modeEdition)
  const [erreurChargement, setErreurChargement] = useState(null)

  const [enregistrement, setEnregistrement] = useState(false)
  const [erreur, setErreur] = useState(null)

  const contenuTextareaRef = useRef(null)
  const enonceTextareaRefs = useRef({})
  const etapeInputRefs = useRef({})
  const inputImageRef = useRef(null)
  const [cibleUpload, setCibleUpload] = useState(null)
  const [uploadCibleEnCours, setUploadCibleEnCours] = useState(null)
  const [erreurUploadImage, setErreurUploadImage] = useState(null)
  const [erreurUploadCle, setErreurUploadCle] = useState(null)
  const [apercuOuvert, setApercuOuvert] = useState(false)

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
    supabase
      .from('profiles')
      .select('est_admin')
      .eq('id', authUser.id)
      .single()
      .then(({ data, error }) => {
        if (!error) setEstAdmin(Boolean(data?.est_admin))
      })
  }, [authUser.id])

  useEffect(() => {
    if (!modeEdition) return
    let annule = false

    async function charger() {
      const [coursRes, questionsRes, etapesRes, coursGroupesRes] = await Promise.all([
        supabase
          .from('cours')
          .select('id, titre, contenu, categorie, domaine, formateur_id, checklist_mode')
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
        supabase
          .from('cours_groupes')
          .select('groupe_id')
          .eq('cours_id', coursId),
      ])

      if (annule) return

      const premiereErreur =
        coursRes.error?.message ??
        questionsRes.error?.message ??
        etapesRes.error?.message ??
        coursGroupesRes.error?.message
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
      setGroupeIdsSelectionnes((coursGroupesRes.data ?? []).map((cg) => cg.groupe_id))

      setQuestions(
        (questionsRes.data ?? []).map((q) => ({
          localId: crypto.randomUUID(),
          enonce: q.enonce,
          typeReponse: q.type_reponse,
          estOuverte: false,
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
      setChecklistMode(coursRes.data.checklist_mode ?? 'checkbox')
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

  function toggleQuestion(questionId) {
    setQuestions((prev) =>
      prev.map((q) => (q.localId === questionId ? { ...q, estOuverte: !q.estOuverte } : q))
    )
  }

  function marquerSeuleCorrecte(questionId, reponseId) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.localId === questionId
          ? { ...q, reponses: q.reponses.map((r) => ({ ...r, estCorrecte: r.localId === reponseId })) }
          : q
      )
    )
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

  function toggleGroupe(groupeId) {
    setGroupeIdsSelectionnes((prev) =>
      prev.includes(groupeId) ? prev.filter((id) => id !== groupeId) : [...prev, groupeId]
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

  function ouvrirSelecteurImage(cible) {
    setCibleUpload(cible)
    inputImageRef.current?.click()
  }

  async function handleFichierImage(e) {
    const fichier = e.target.files?.[0]
    e.target.value = ''
    const cible = cibleUpload
    if (!fichier || !cible) return

    setErreurUploadImage(null)
    setErreurUploadCle(null)
    setUploadCibleEnCours(cible.cle)

    const extension = fichier.name.includes('.') ? fichier.name.split('.').pop() : 'jpg'
    const nomFichier = `${crypto.randomUUID()}.${extension}`

    const { error: erreurEnvoi } = await supabase.storage.from('lecons-media').upload(nomFichier, fichier)

    if (erreurEnvoi) {
      setUploadCibleEnCours(null)
      setErreurUploadCle(cible.cle)
      setErreurUploadImage(`L'image n'a pas pu être envoyée (${erreurEnvoi.message}).`)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('lecons-media').getPublicUrl(nomFichier)

    const description = fichier.name.replace(/\.[^/.]+$/, '')
    const markdownImage = `![${description}](${publicUrl})`

    const element = cible.obtenirElement()
    const positionCurseur = element ? element.selectionStart : cible.valeurActuelle.length
    const nouvelleValeur = `${cible.valeurActuelle.slice(0, positionCurseur)}${markdownImage}${cible.valeurActuelle.slice(positionCurseur)}`

    cible.definirValeur(nouvelleValeur)
    setUploadCibleEnCours(null)

    requestAnimationFrame(() => {
      if (!element) return
      const nouvellePosition = positionCurseur + markdownImage.length
      element.focus()
      element.setSelectionRange(nouvellePosition, nouvellePosition)
    })
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
      // visibilite n'est jamais réécrite ici : elle est fixée à la création (public pour un compte
      // admin, privé sinon) et doit rester intacte quel que soit qui modifie le cours ensuite.
      const { error: erreurMaj } = await supabase
        .from('cours')
        .update({
          titre: titre.trim(),
          contenu: contenu.trim(),
          domaine: domaine.trim(),
          categorie: categorie.trim(),
          checklist_mode: aChecklist ? checklistMode : null,
        })
        .eq('id', coursId)

      if (erreurMaj) {
        setEnregistrement(false)
        setErreur(`Le cours n'a pas pu être mis à jour (${erreurMaj.message}).`)
        return
      }

      // Plutôt qu'un diff ligne par ligne, on repart de zéro : questions/reponses/etapes_checklist/
      // cours_groupes n'ont pas de dépendances externes en dehors du cours, donc supprimer puis
      // réinsérer est sûr.
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

      const { error: erreurSuppressionGroupes } = await supabase
        .from('cours_groupes')
        .delete()
        .eq('cours_id', coursId)
      if (erreurSuppressionGroupes) {
        setEnregistrement(false)
        setErreur(`Les anciens groupes assignés n'ont pas pu être supprimés (${erreurSuppressionGroupes.message}).`)
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
          visibilite: estAdmin ? 'public' : 'prive',
          formateur_id: authUser.id,
          checklist_mode: aChecklist ? checklistMode : null,
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

    if (!estAdmin && groupeIdsSelectionnes.length > 0) {
      const groupesAInserer = groupeIdsSelectionnes.map((groupeId) => ({
        cours_id: coursIdActuel,
        groupe_id: groupeId,
      }))

      const { error: erreurGroupes } = await supabase.from('cours_groupes').insert(groupesAInserer)
      if (erreurGroupes) {
        setEnregistrement(false)
        setErreur(`Les groupes assignés n'ont pas pu être enregistrés (${erreurGroupes.message}).`)
        return
      }
    }

    if (!estAdmin && !modeEdition && groupeIdsSelectionnes.length > 0) {
      notifierMakeNouveauCours(titre.trim(), groupeIdsSelectionnes)
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
              <textarea
                className="creation-textarea-contenu"
                ref={contenuTextareaRef}
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
              />
            </label>

            <input
              type="file"
              accept="image/*"
              ref={inputImageRef}
              onChange={handleFichierImage}
              style={{ display: 'none' }}
            />

            <div className="creation-actions-contenu">
              <button
                type="button"
                className="bouton-ajouter"
                disabled={uploadCibleEnCours === 'contenu'}
                onClick={() =>
                  ouvrirSelecteurImage({
                    cle: 'contenu',
                    valeurActuelle: contenu,
                    definirValeur: setContenu,
                    obtenirElement: () => contenuTextareaRef.current,
                  })
                }
              >
                {uploadCibleEnCours === 'contenu' ? 'Envoi en cours…' : '+ Insérer une image'}
              </button>

              <button type="button" className="bouton-ajouter" onClick={() => setApercuOuvert(true)}>
                <img className="cta-icone" src={iconeOeil} alt="" aria-hidden="true" />
                Aperçu de la leçon
              </button>
            </div>

            {erreurUploadCle === 'contenu' && erreurUploadImage && (
              <p className="message message-erreur">{erreurUploadImage}</p>
            )}

            <p className="creation-contenu-aide">
              Laisse une ligne vide entre deux paragraphes. Colle un lien YouTube ou Vimeo pour l'intégrer
              automatiquement.
            </p>

            <label className="champ">
              <span>Domaine</span>
              <input type="text" value={domaine} onChange={(e) => setDomaine(e.target.value)} />
            </label>

            {estAdmin ? (
              <p className="creation-badge-officiel">Compte officiel : ce cours sera public</p>
            ) : (
              <div className="champ">
                <span>Assigner à des groupes (optionnel)</span>
                <div className="creation-groupes-liste">
                  {mesGroupes.length === 0 ? (
                    <p className="dashboard-etat-vide">Tu n'as pas encore de groupe.</p>
                  ) : (
                    mesGroupes.map((groupe) => (
                      <label className="creation-checkbox" key={groupe.id}>
                        <input
                          type="checkbox"
                          checked={groupeIdsSelectionnes.includes(groupe.id)}
                          onChange={() => toggleGroupe(groupe.id)}
                        />
                        {groupe.nom}
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="creation-section">
            <h2>QCM</h2>

            {questions.map((question, qi) => (
              <div className="creation-bloc" key={question.localId}>
                <div className="creation-bloc-header">
                  <button
                    type="button"
                    className="creation-question-toggle"
                    onClick={() => toggleQuestion(question.localId)}
                    aria-expanded={question.estOuverte}
                  >
                    <span
                      className={`creation-question-chevron${question.estOuverte ? ' creation-question-chevron-ouvert' : ''}`}
                      aria-hidden="true"
                    >
                      ›
                    </span>
                    <h3 className="creation-question-titre">
                      Question {qi + 1}
                      {question.enonce.trim() ? ` : ${question.enonce.trim()}` : ''}
                    </h3>
                  </button>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      className="creation-bouton-supprimer"
                      onClick={() => supprimerQuestion(question.localId)}
                    >
                      <img className="cta-icone" src={iconeTrash} alt="" aria-hidden="true" />
                      Supprimer
                    </button>
                  )}
                </div>

                {question.estOuverte && (
                  <>
                    <label className="champ">
                      <span>Énoncé</span>
                      <textarea
                        ref={(el) => {
                          enonceTextareaRefs.current[question.localId] = el
                        }}
                        value={question.enonce}
                        onChange={(e) => majQuestion(question.localId, 'enonce', e.target.value)}
                      />
                    </label>

                    <button
                      type="button"
                      className="bouton-ajouter"
                      disabled={uploadCibleEnCours === `enonce-${question.localId}`}
                      onClick={() =>
                        ouvrirSelecteurImage({
                          cle: `enonce-${question.localId}`,
                          valeurActuelle: question.enonce,
                          definirValeur: (valeur) => majQuestion(question.localId, 'enonce', valeur),
                          obtenirElement: () => enonceTextareaRefs.current[question.localId],
                        })
                      }
                    >
                      {uploadCibleEnCours === `enonce-${question.localId}`
                        ? 'Envoi en cours…'
                        : '+ Insérer une image'}
                    </button>

                    {erreurUploadCle === `enonce-${question.localId}` && erreurUploadImage && (
                      <p className="message message-erreur">{erreurUploadImage}</p>
                    )}

                    <label className="champ creation-champ-type-reponse">
                      <span>Type de réponse</span>
                      <Dropdown
                        value={question.typeReponse}
                        onChange={(valeur) => majQuestion(question.localId, 'typeReponse', valeur)}
                        options={TYPES_REPONSE}
                      />
                    </label>

                    <div className="creation-reponses">
                      {question.reponses.map((reponse, ri) => {
                        const lettre = String.fromCharCode(65 + ri)
                        return (
                          <div className="creation-reponse" key={reponse.localId}>
                            <div className="creation-reponse-ligne">
                              <span className="creation-reponse-lettre" aria-hidden="true">
                                {lettre}
                              </span>
                              <input
                                type="text"
                                className="creation-reponse-texte"
                                placeholder={`Réponse ${lettre}`}
                                value={reponse.texte}
                                onChange={(e) =>
                                  majReponse(question.localId, reponse.localId, 'texte', e.target.value)
                                }
                              />
                              {question.reponses.length > 2 && (
                                <button
                                  type="button"
                                  className="creation-bouton-x"
                                  aria-label="Supprimer cette réponse"
                                  onClick={() => supprimerReponse(question.localId, reponse.localId)}
                                >
                                  ×
                                </button>
                              )}
                            </div>

                            <label className="creation-checkbox">
                              <input
                                type={question.typeReponse === 'simple' ? 'radio' : 'checkbox'}
                                name={
                                  question.typeReponse === 'simple' ? `correcte-${question.localId}` : undefined
                                }
                                checked={reponse.estCorrecte}
                                onChange={(e) =>
                                  question.typeReponse === 'simple'
                                    ? marquerSeuleCorrecte(question.localId, reponse.localId)
                                    : majReponse(question.localId, reponse.localId, 'estCorrecte', e.target.checked)
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
                        )
                      })}

                      <button
                        type="button"
                        className="bouton-ajouter"
                        onClick={() => ajouterReponse(question.localId)}
                      >
                        + Ajouter une réponse
                      </button>
                    </div>
                  </>
                )}
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
              <label className="champ">
                <span>Mode de validation de la checklist</span>
                <Dropdown value={checklistMode} onChange={setChecklistMode} options={MODES_CHECKLIST} />
              </label>
            )}

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
                        <img className="cta-icone" src={iconeTrash} alt="" aria-hidden="true" />
                        Supprimer
                      </button>
                    </div>

                    <label className="champ">
                      <span>Intitulé</span>
                      <input
                        type="text"
                        ref={(el) => {
                          etapeInputRefs.current[etape.localId] = el
                        }}
                        value={etape.intitule}
                        onChange={(e) => majEtape(etape.localId, 'intitule', e.target.value)}
                      />
                    </label>

                    <button
                      type="button"
                      className="bouton-ajouter"
                      disabled={uploadCibleEnCours === `etape-${etape.localId}`}
                      onClick={() =>
                        ouvrirSelecteurImage({
                          cle: `etape-${etape.localId}`,
                          valeurActuelle: etape.intitule,
                          definirValeur: (valeur) => majEtape(etape.localId, 'intitule', valeur),
                          obtenirElement: () => etapeInputRefs.current[etape.localId],
                        })
                      }
                    >
                      {uploadCibleEnCours === `etape-${etape.localId}` ? 'Envoi en cours…' : '+ Insérer une image'}
                    </button>

                    {erreurUploadCle === `etape-${etape.localId}` && erreurUploadImage && (
                      <p className="message message-erreur">{erreurUploadImage}</p>
                    )}

                    <label className="champ">
                      <span>Critère de validation (optionnel)</span>
                      <input
                        type="text"
                        value={etape.critereValidation}
                        onChange={(e) => majEtape(etape.localId, 'critereValidation', e.target.value)}
                      />
                    </label>

                    {checklistMode !== 'reorder' && (
                      <label className="creation-checkbox">
                        <input
                          type="checkbox"
                          checked={etape.bloquante}
                          onChange={(e) => majEtape(etape.localId, 'bloquante', e.target.checked)}
                        />
                        Étape bloquante
                      </label>
                    )}
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

      {apercuOuvert && (
        <div className="modal-overlay" onClick={() => setApercuOuvert(false)}>
          <div className="modal-carte modal-carte-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-entete">
              <h2>Aperçu de la leçon</h2>
              <button
                type="button"
                className="modal-fermer"
                onClick={() => setApercuOuvert(false)}
                aria-label="Fermer l'aperçu"
              >
                ×
              </button>
            </div>

            <div className="modal-contenu-scroll">
              {contenu.trim() ? (
                <ContenuMarkdown texte={contenu} className="creation-apercu" />
              ) : (
                <p className="creation-apercu-vide">Rien à afficher pour l'instant.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreationCours
