import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { THEMATIQUES } from '../lib/thematiques'
import Dropdown from '../components/Dropdown'
import ContenuMarkdown, { obtenirUrlEmbedVideo } from '../components/ContenuMarkdown'
import Icone from '../components/Icone'
import MenuActions from '../components/formateur/MenuActions'
import Modale, { ModaleConfirmation } from '../components/formateur/Modale'
import iconeRetour from '../Assets/chevron-left.svg?raw'
import iconeChevron from '../Assets/chevron-right.svg?raw'
import iconeOeil from '../Assets/oeil.svg?raw'
import iconeImage from '../Assets/image.svg?raw'
import iconeVideo from '../Assets/video.svg?raw'
import iconeCroix from '../Assets/croix.svg?raw'
import iconeCoche from '../Assets/check.svg?raw'
import iconePoignee from '../Assets/poignee.svg?raw'
import iconeAmpoule from '../Assets/ampoule.svg?raw'
import '../styles/shared.css'
import '../components/formateur/Formateur.css'
import './FicheCours.css'
import './CreationCours.css'
import { typo } from '../lib/typographie'
import { imagesLecon } from '../lib/cours'
import { notifierMakeNouveauCours } from '../lib/notificationsMake'

// Création et modification d'un cours (lot formateur-creation) : mode concentré (sans barre de
// navigation), une carte blanche par section (Infos, Leçon, QCM, Checklist terrain), sommaire
// collant sur desktop, pastilles collantes sur mobile, barre d'enregistrement toujours visible.

// Cohérent avec la contrainte cours_categorie_publique_valide (migrations 0002 et 0005) : tous
// les cours, publics comme privés, ont l'un des 12 thèmes.
const OPTIONS_THEMES = THEMATIQUES.map((nom) => ({ value: nom, label: nom }))

const SECTIONS = [
  { id: 'infos', libelle: 'Infos' },
  { id: 'lecon', libelle: 'Leçon' },
  { id: 'qcm', libelle: 'QCM' },
  { id: 'checklist', libelle: 'Checklist' },
]

const TYPES_REPONSE = [
  { value: 'simple', long: 'Réponse unique', court: 'Une réponse' },
  { value: 'multiple', long: 'Plusieurs réponses', court: 'Plusieurs' },
]

const MODES_CHECKLIST = [
  { value: null, libelle: 'Pas de checklist', detail: 'Leçon et QCM seulement' },
  { value: 'checkbox', libelle: 'Cases à cocher', detail: 'L’élève valide chaque étape' },
  { value: 'reorder', libelle: 'Remise en ordre', detail: 'L’élève replace les étapes' },
]

const MESSAGE_QUITTER = 'Tes modifications seront perdues.'

function nouvelleReponse() {
  return { localId: crypto.randomUUID(), texte: '', estCorrecte: false, explication: '' }
}

function nouvelleQuestion() {
  return {
    localId: crypto.randomUUID(),
    enonce: '',
    images: [],
    typeReponse: 'simple',
    reponses: [nouvelleReponse(), nouvelleReponse()],
    estOuverte: true,
  }
}

function nouvelleEtape() {
  return { localId: crypto.randomUUID(), intitule: '', images: [], critereValidation: '', bloquante: false }
}

const REGEX_IMAGE = /!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g

// Énoncé et intitulé d'étape : le texte s'édite sans le Markdown des images, affichées en
// miniatures sous le champ ; à l'enregistrement, elles sont remises à la fin du texte (même format
// Markdown qu'avant, lu par ContenuMarkdown côté apprenant).
function separerImages(texte) {
  const images = imagesLecon(texte)
  const sansImages = (texte ?? '').replace(REGEX_IMAGE, '').replace(/\n{3,}/g, '\n\n').trim()
  return { texte: sansImages, images }
}

function composerAvecImages(texte, images) {
  return [texte.trim(), ...images.map((i) => `![${i.alt}](${i.url})`)].filter(Boolean).join('\n\n')
}

// Leçon : dans le mode Écrire, chaque URL d'image est remplacée par une référence courte
// (« ![splitmural](#image-1) ») ; la vraie URL est remise à l'aperçu et à l'enregistrement.
function abregerImages(texte, table) {
  return (texte ?? '').replace(REGEX_IMAGE, (tout, alt, url) => {
    if (!/^https?:\/\//.test(url)) return tout
    let numero = [...table.entries()].find(([, u]) => u === url)?.[0]
    if (!numero) {
      numero = String(table.size + 1)
      table.set(numero, url)
    }
    return `![${alt}](#image-${numero})`
  })
}

function developperImages(texte, table) {
  return (texte ?? '').replace(/\(#image-(\d+)\)/g, (tout, numero) => (table.has(numero) ? `(${table.get(numero)})` : tout))
}

function libelleEleves(n) {
  return `${n} élève${n > 1 ? 's' : ''}`
}

// Hauteur d'un champ multiligne ajustée à son contenu (titre sur mobile, intitulés d'étape).
// Avec box-sizing: border-box, scrollHeight n'inclut pas la bordure (2 × 2 px transparents) : sans
// elle, la dernière ligne était rognée. Recalculée aussi quand la largeur change (rotation, polices
// chargées après coup). Renvoie true si le texte tient sur plusieurs lignes.
function ajusterHauteur(el) {
  if (!el) return false
  const style = window.getComputedStyle(el)
  const bordures = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight + bordures}px`
  const ligne = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.35
  const interieur = el.scrollHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
  return interieur > ligne * 1.5
}

function ChampAuto({ valeur, onChange, className, ...props }) {
  const ref = useRef(null)
  const [multiligne, setMultiligne] = useState(false)

  useEffect(() => {
    setMultiligne(ajusterHauteur(ref.current))
  }, [valeur])

  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    let largeur = el.clientWidth
    const observateur = new ResizeObserver(() => {
      if (el.clientWidth === largeur) return
      largeur = el.clientWidth
      setMultiligne(ajusterHauteur(el))
    })
    observateur.observe(el)
    return () => observateur.disconnect()
  }, [])

  return (
    <textarea
      ref={ref}
      rows={1}
      className={`${className ?? ''}${multiligne ? ' cc-champ-multiligne' : ''}`.trim() || undefined}
      value={valeur}
      onChange={(e) => onChange(e.target.value.replace(/\n/g, ' '))}
      onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
      {...props}
    />
  )
}

function Miniatures({ images, onRetirer }) {
  if (images.length === 0) return null
  return (
    <ul className="cc-miniatures">
      {images.map((image, i) => (
        <li key={`${image.url}-${i}`} className="cc-etiquette-image">
          <img src={image.url} alt="" />
          <span className="cc-etiquette-nom">{image.alt || 'Image'}</span>
          <button
            type="button"
            className="cc-bouton-croix"
            aria-label={`Retirer l’image ${image.alt || ''}`.trim()}
            onClick={() => onRetirer(i)}
          >
            <Icone svg={iconeCroix} className="cc-icone-16" />
          </button>
        </li>
      ))}
    </ul>
  )
}

function Coche() {
  return <Icone svg={iconeCoche} className="cc-coche" />
}

function CreationCours({ authUser, coursId, onTermine, onRetour, onApercu, onCreerGroupe }) {
  const modeEdition = Boolean(coursId)

  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [aRetenir, setARetenir] = useState('')
  const [aRetenirInitial, setARetenirInitial] = useState('')
  const [categorie, setCategorie] = useState('')

  const [questions, setQuestions] = useState(modeEdition ? [] : [nouvelleQuestion()])

  const [checklistMode, setChecklistMode] = useState(null)
  const [etapes, setEtapes] = useState([])
  const [etapeActiveId, setEtapeActiveId] = useState(null)

  const [mesGroupes, setMesGroupes] = useState(null)
  const [groupeIdsSelectionnes, setGroupeIdsSelectionnes] = useState([])
  const [groupeIdsInitiaux, setGroupeIdsInitiaux] = useState([])

  const [estAdmin, setEstAdmin] = useState(false)

  const [chargement, setChargement] = useState(modeEdition)
  const [erreurChargement, setErreurChargement] = useState(null)

  const [enregistrement, setEnregistrement] = useState(false)
  // { message, cible } : cible = 'infos' | 'qcm' | 'checklist' | localId d'une question/étape | 'global'
  const [erreur, setErreur] = useState(null)

  const [ongletLecon, setOngletLecon] = useState('ecrire')
  const [sectionActive, setSectionActive] = useState('infos')
  const [confirmation, setConfirmation] = useState(null)
  const [modaleVideo, setModaleVideo] = useState(false)
  const [lienVideo, setLienVideo] = useState('')
  const [erreurVideo, setErreurVideo] = useState(null)

  const tableImages = useRef(new Map())
  const contenuTextareaRef = useRef(null)
  const curseurContenu = useRef(null)
  const inputImageRef = useRef(null)
  const cibleUpload = useRef(null)
  const [uploadCibleEnCours, setUploadCibleEnCours] = useState(null)
  const [erreurUpload, setErreurUpload] = useState(null)
  const critereRefs = useRef({})
  const etapeGlissee = useRef(null)
  const [etapeSurvolee, setEtapeSurvolee] = useState(null)

  useEffect(() => {
    async function chargerGroupes() {
      const { data: groupes, error } = await supabase.from('groupes').select('id, nom').eq('formateur_id', authUser.id).order('nom')
      if (error) return setMesGroupes([])
      const ids = (groupes ?? []).map((g) => g.id)
      const { data: membres } = ids.length
        ? await supabase.from('groupe_membres').select('groupe_id').in('groupe_id', ids)
        : { data: [] }
      setMesGroupes(
        (groupes ?? []).map((g) => ({ ...g, nbEleves: (membres ?? []).filter((m) => m.groupe_id === g.id).length }))
      )
    }
    chargerGroupes()
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
          // select('*') : tolère l'absence de la colonne a_retenir tant que la migration 0006 n'est pas jouée
          .select('*')
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
        supabase.from('cours_groupes').select('groupe_id').eq('cours_id', coursId),
      ])

      if (annule) return

      const premiereErreur =
        coursRes.error?.message ?? questionsRes.error?.message ?? etapesRes.error?.message ?? coursGroupesRes.error?.message
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
      setContenu(abregerImages(coursRes.data.contenu ?? '', tableImages.current))
      setARetenir(coursRes.data.a_retenir ?? '')
      setARetenirInitial(coursRes.data.a_retenir ?? '')
      // Ancienne catégorie libre (cours privé antérieur à la migration 0005) : le formateur doit
      // choisir un thème à l'enregistrement.
      setCategorie(THEMATIQUES.includes(coursRes.data.categorie) ? coursRes.data.categorie : '')
      const groupeIds = (coursGroupesRes.data ?? []).map((cg) => cg.groupe_id)
      setGroupeIdsSelectionnes(groupeIds)
      setGroupeIdsInitiaux(groupeIds)

      setQuestions(
        (questionsRes.data ?? []).map((q) => {
          const reponses = q.reponses.map((r) => ({
            localId: crypto.randomUUID(),
            texte: r.texte,
            estCorrecte: r.est_correcte,
            explication: r.explication ?? '',
          }))
          const { texte, images } = separerImages(q.enonce)
          // Une question vide ou incomplète s'affiche dépliée
          const incomplete =
            !texte || reponses.length < 2 || reponses.some((r) => !r.texte.trim()) || !reponses.some((r) => r.estCorrecte)
          return { localId: crypto.randomUUID(), enonce: texte, images, typeReponse: q.type_reponse, estOuverte: incomplete, reponses }
        })
      )

      const etapesData = etapesRes.data ?? []
      setChecklistMode(etapesData.length > 0 ? (coursRes.data.checklist_mode ?? 'checkbox') : null)
      setEtapes(
        etapesData.map((e) => {
          const { texte, images } = separerImages(e.intitule)
          return {
            localId: crypto.randomUUID(),
            intitule: texte,
            images,
            critereValidation: e.critere_validation ?? '',
            bloquante: e.bloquante,
          }
        })
      )

      setChargement(false)
    }

    charger()

    return () => {
      annule = true
    }
  }, [modeEdition, coursId, authUser.id])

  // --- Modifications non enregistrées ----------------------------------------------------------

  const etatCourant = useMemo(
    () =>
      JSON.stringify({
        titre: titre.trim(),
        contenu: developperImages(contenu, tableImages.current).trim(),
        aRetenir: aRetenir.trim(),
        categorie,
        checklistMode,
        groupes: [...groupeIdsSelectionnes].sort(),
        questions: questions.map((q) => [
          composerAvecImages(q.enonce, q.images),
          q.typeReponse,
          q.reponses.map((r) => [r.texte.trim(), r.estCorrecte, r.estCorrecte ? '' : r.explication.trim()]),
        ]),
        etapes: checklistMode
          ? etapes.map((e) => [composerAvecImages(e.intitule, e.images), e.critereValidation.trim(), e.bloquante])
          : [],
      }),
    [titre, contenu, aRetenir, categorie, checklistMode, groupeIdsSelectionnes, questions, etapes]
  )

  const [etatInitial, setEtatInitial] = useState(null)
  useEffect(() => {
    if (!chargement && !erreurChargement && etatInitial === null) setEtatInitial(etatCourant)
  }, [chargement, erreurChargement, etatInitial, etatCourant])

  const modifie = etatInitial !== null && etatCourant !== etatInitial
  const modifieRef = useRef(false)
  modifieRef.current = modifie && !enregistrement

  // Fermeture / rechargement de l'onglet : alerte native du navigateur
  useEffect(() => {
    const surDepart = (e) => {
      if (!modifieRef.current) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', surDepart)
    return () => window.removeEventListener('beforeunload', surDepart)
  }, [])

  // Bouton « précédent » du navigateur : une entrée d'historique est posée à l'ouverture ; si des
  // changements sont en cours, on la repose et on demande confirmation.
  const actionRetourRef = useRef(onRetour)
  actionRetourRef.current = onRetour
  const ignorerPrecedent = useRef(false)
  useEffect(() => {
    if (!window.history.state?.skilloCreationCours) window.history.pushState({ skilloCreationCours: true }, '')
    const surPrecedent = () => {
      if (ignorerPrecedent.current) {
        ignorerPrecedent.current = false
        return
      }
      if (modifieRef.current) {
        window.history.pushState({ skilloCreationCours: true }, '')
        setConfirmation({ type: 'quitter', suite: () => actionRetourRef.current() })
      } else {
        actionRetourRef.current()
      }
    }
    window.addEventListener('popstate', surPrecedent)
    return () => window.removeEventListener('popstate', surPrecedent)
  }, [])

  function quitterVers(suite) {
    // Retire l'entrée d'historique posée à l'ouverture, sans repasser par le gestionnaire
    if (window.history.state?.skilloCreationCours) {
      ignorerPrecedent.current = true
      window.history.back()
    }
    suite()
  }

  function demanderQuitter(suite) {
    if (modifie) setConfirmation({ type: 'quitter', suite })
    else quitterVers(suite)
  }

  // --- Sommaire : section visible à l'écran ----------------------------------------------------

  useEffect(() => {
    if (chargement) return
    const elements = SECTIONS.map((s) => document.getElementById(`cc-section-${s.id}`)).filter(Boolean)
    const observateur = new IntersectionObserver(
      (entrees) => {
        const visibles = entrees.filter((e) => e.isIntersecting)
        if (visibles.length > 0) setSectionActive(visibles[0].target.dataset.section)
      },
      { rootMargin: '-25% 0px -65% 0px' }
    )
    elements.forEach((el) => observateur.observe(el))
    return () => observateur.disconnect()
  }, [chargement])

  function allerA(sectionId) {
    setSectionActive(sectionId)
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(`cc-section-${sectionId}`)?.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' })
  }

  // --- QCM ---------------------------------------------------------------------------------------

  function ajouterQuestion() {
    setQuestions((prev) => [...prev.map((q) => ({ ...q, estOuverte: false })), nouvelleQuestion()])
  }

  function supprimerQuestion(questionId) {
    setQuestions((prev) => prev.filter((q) => q.localId !== questionId))
  }

  function majQuestion(questionId, modif) {
    setQuestions((prev) => prev.map((q) => (q.localId === questionId ? { ...q, ...modif } : q)))
  }

  function changerTypeReponse(question, typeReponse) {
    if (typeReponse === question.typeReponse) return
    // Passage en réponse unique : seule la première bonne réponse reste marquée
    const premiere = question.reponses.find((r) => r.estCorrecte)?.localId
    const reponses =
      typeReponse === 'simple' ? question.reponses.map((r) => ({ ...r, estCorrecte: r.localId === premiere })) : question.reponses
    majQuestion(question.localId, { typeReponse, reponses })
  }

  function basculerBonneReponse(question, reponseId) {
    const reponses = question.reponses.map((r) => {
      if (question.typeReponse === 'simple') return { ...r, estCorrecte: r.localId === reponseId }
      return r.localId === reponseId ? { ...r, estCorrecte: !r.estCorrecte } : r
    })
    majQuestion(question.localId, { reponses })
  }

  function majReponse(question, reponseId, champ, valeur) {
    majQuestion(question.localId, {
      reponses: question.reponses.map((r) => (r.localId === reponseId ? { ...r, [champ]: valeur } : r)),
    })
  }

  // --- Checklist ---------------------------------------------------------------------------------

  function choisirModeChecklist(mode) {
    if (mode === checklistMode) return
    if (mode === null && etapes.length > 0) {
      setConfirmation({
        type: 'sans-checklist',
        suite: () => {
          setChecklistMode(null)
          setEtapes([])
        },
      })
      return
    }
    setChecklistMode(mode)
    if (etapes.length === 0) {
      const etape = nouvelleEtape()
      setEtapes([etape])
      setEtapeActiveId(etape.localId)
    }
  }

  function ajouterEtape() {
    const etape = nouvelleEtape()
    setEtapes((prev) => [...prev, etape])
    setEtapeActiveId(etape.localId)
  }

  function majEtape(etapeId, modif) {
    setEtapes((prev) => prev.map((e) => (e.localId === etapeId ? { ...e, ...modif } : e)))
  }

  function deplacerEtape(index, cible) {
    if (cible < 0 || cible >= etapes.length || cible === index) return
    setEtapes((prev) => {
      const copie = [...prev]
      const [etape] = copie.splice(index, 1)
      copie.splice(cible, 0, etape)
      return copie
    })
  }

  function ouvrirCritere(etapeId) {
    setEtapeActiveId(etapeId)
    requestAnimationFrame(() => critereRefs.current[etapeId]?.focus())
  }

  // --- Images et vidéo ---------------------------------------------------------------------------

  function ouvrirSelecteurImage(cible) {
    if (cible.cle === 'contenu') curseurContenu.current = contenuTextareaRef.current?.selectionStart ?? curseurContenu.current
    cibleUpload.current = cible
    inputImageRef.current?.click()
  }

  async function handleFichierImage(e) {
    const fichier = e.target.files?.[0]
    e.target.value = ''
    const cible = cibleUpload.current
    if (!fichier || !cible) return

    setErreurUpload(null)
    setUploadCibleEnCours(cible.cle)

    const extension = fichier.name.includes('.') ? fichier.name.split('.').pop() : 'jpg'
    const nomFichier = `${crypto.randomUUID()}.${extension}`

    const { error: erreurEnvoi } = await supabase.storage.from('lecons-media').upload(nomFichier, fichier)
    setUploadCibleEnCours(null)

    if (erreurEnvoi) {
      setErreurUpload({ cle: cible.cle, message: `L'image n'a pas pu être envoyée (${erreurEnvoi.message}).` })
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('lecons-media').getPublicUrl(nomFichier)
    const image = { alt: fichier.name.replace(/\.[^/.]+$/, '').replace(/[[\]]/g, ''), url: publicUrl }
    cible.ajouter(image)
  }

  function insererDansContenu(bloc) {
    const position = curseurContenu.current ?? contenu.length
    const avant = contenu.slice(0, position)
    const apres = contenu.slice(position)
    const prefixe = avant && !avant.endsWith('\n\n') ? (avant.endsWith('\n') ? '\n' : '\n\n') : ''
    const suffixe = apres && !apres.startsWith('\n') ? '\n\n' : ''
    const insertion = `${prefixe}${bloc}${suffixe}`
    setContenu(`${avant}${insertion}${apres}`)
    const nouvellePosition = position + insertion.length
    curseurContenu.current = nouvellePosition
    if (ongletLecon !== 'ecrire') return
    requestAnimationFrame(() => {
      const el = contenuTextareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(nouvellePosition, nouvellePosition)
    })
  }

  function ajouterImageContenu(image) {
    tableImages.current.set(String(tableImages.current.size + 1), image.url)
    insererDansContenu(`![${image.alt}](#image-${tableImages.current.size})`)
  }

  function retirerImageContenu(numero) {
    const motif = new RegExp(`\\n*!\\[[^\\]]*\\]\\(#image-${numero}\\)\\n*`, 'g')
    setContenu((prev) => prev.replace(motif, '\n\n').replace(/^\n+/, '').replace(/\n{3,}/g, '\n\n'))
  }

  function ouvrirModaleVideo() {
    curseurContenu.current = contenuTextareaRef.current?.selectionStart ?? curseurContenu.current
    setLienVideo('')
    setErreurVideo(null)
    setModaleVideo(true)
  }

  function insererVideo() {
    const lien = lienVideo.trim()
    if (!obtenirUrlEmbedVideo(lien)) {
      setErreurVideo('Colle un lien YouTube ou Vimeo valide.')
      return
    }
    setModaleVideo(false)
    insererDansContenu(lien)
  }

  const imagesContenu = useMemo(
    () => [...contenu.matchAll(/!\[([^\]]*)\]\(#image-(\d+)\)/g)].map((m) => ({ alt: m[1], numero: m[2], url: tableImages.current.get(m[2]) })).filter((i) => i.url),
    [contenu]
  )

  // --- Validation et enregistrement --------------------------------------------------------------

  function validerFormulaire() {
    if (titre.trim().length === 0) return { cible: 'infos', message: 'Le titre du cours est obligatoire.' }
    if (!THEMATIQUES.includes(categorie)) return { cible: 'infos', message: 'Choisis un thème pour ce cours.' }
    if (questions.length === 0) return { cible: 'qcm', message: 'Ajoute au moins une question au QCM.' }

    for (const question of questions) {
      if (!composerAvecImages(question.enonce, question.images)) {
        return { cible: question.localId, message: 'L’énoncé de cette question est vide.' }
      }
      if (question.reponses.length < 2) {
        return { cible: question.localId, message: 'Ajoute au moins 2 réponses à cette question.' }
      }
      if (question.reponses.some((r) => r.texte.trim().length === 0)) {
        return { cible: question.localId, message: 'Une réponse de cette question est vide.' }
      }
      if (!question.reponses.some((r) => r.estCorrecte)) {
        return { cible: question.localId, message: 'Coche au moins une bonne réponse.' }
      }
    }

    if (checklistMode) {
      if (etapes.length === 0) return { cible: 'checklist', message: 'Ajoute au moins une étape, ou choisis « Pas de checklist ».' }
      const vide = etapes.find((e) => !composerAvecImages(e.intitule, e.images))
      if (vide) return { cible: vide.localId, message: 'L’intitulé de cette étape est vide.' }
    }

    return null
  }

  function afficherErreur(err) {
    setErreur(err)
    if (questions.some((q) => q.localId === err.cible)) {
      setQuestions((prev) => prev.map((q) => (q.localId === err.cible ? { ...q, estOuverte: true } : q)))
    }
    if (etapes.some((e) => e.localId === err.cible)) setEtapeActiveId(err.cible)
    const id = SECTIONS.some((s) => s.id === err.cible) ? `cc-section-${err.cible}` : `cc-element-${err.cible}`
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    )
  }

  function echec(message) {
    setEnregistrement(false)
    setErreur({ cible: 'global', message })
  }

  async function handleEnregistrer() {
    const erreurValidation = validerFormulaire()
    if (erreurValidation) {
      afficherErreur(erreurValidation)
      return
    }

    setErreur(null)
    setEnregistrement(true)

    const contenuFinal = developperImages(contenu, tableImages.current).trim()
    let coursIdActuel = coursId

    if (modeEdition) {
      // visibilite n'est jamais réécrite ici : elle est fixée à la création (public pour un compte
      // admin, privé sinon) et doit rester intacte quel que soit qui modifie le cours ensuite.
      // domaine n'est plus éditable : la valeur en base est conservée.
      const { error: erreurMaj } = await supabase
        .from('cours')
        .update({
          titre: titre.trim(),
          contenu: contenuFinal,
          // Envoyé seulement s'il y a quelque chose à écrire ou à effacer (colonne de la migration 0006)
          ...(aRetenir.trim() || aRetenirInitial ? { a_retenir: aRetenir.trim() || null } : {}),
          categorie: categorie.trim(),
          checklist_mode: checklistMode,
        })
        .eq('id', coursId)

      if (erreurMaj) return echec(`Le cours n'a pas pu être mis à jour (${erreurMaj.message}).`)

      // Plutôt qu'un diff ligne par ligne, on repart de zéro pour questions/reponses/etapes_checklist :
      // elles n'ont pas de dépendances externes en dehors du cours, supprimer puis réinsérer est sûr.
      const { error: erreurSuppressionQuestions } = await supabase.from('questions').delete().eq('cours_id', coursId)
      if (erreurSuppressionQuestions) {
        return echec(`Les anciennes questions n'ont pas pu être supprimées (${erreurSuppressionQuestions.message}).`)
      }

      const { error: erreurSuppressionEtapes } = await supabase.from('etapes_checklist').delete().eq('cours_id', coursId)
      if (erreurSuppressionEtapes) {
        return echec(`L'ancienne checklist n'a pas pu être supprimée (${erreurSuppressionEtapes.message}).`)
      }
    } else {
      const { data: coursCree, error: erreurCours } = await supabase
        .from('cours')
        .insert({
          titre: titre.trim(),
          contenu: contenuFinal,
          // Envoyé seulement s'il y a quelque chose à écrire (colonne de la migration 0006)
          ...(aRetenir.trim() ? { a_retenir: aRetenir.trim() } : {}),
          // domaine : valeur par défaut de la base
          categorie: categorie.trim(),
          visibilite: estAdmin ? 'public' : 'prive',
          formateur_id: authUser.id,
          checklist_mode: checklistMode,
        })
        .select()
        .single()

      if (erreurCours) return echec(`Le cours n'a pas pu être créé (${erreurCours.message}).`)
      coursIdActuel = coursCree.id
    }

    for (const question of questions) {
      const { data: questionCreee, error: erreurQuestion } = await supabase
        .from('questions')
        .insert({
          cours_id: coursIdActuel,
          enonce: composerAvecImages(question.enonce, question.images),
          type_reponse: question.typeReponse,
        })
        .select()
        .single()

      if (erreurQuestion) return echec(`Une question n'a pas pu être enregistrée (${erreurQuestion.message}).`)

      const reponsesAInserer = question.reponses.map((r) => ({
        question_id: questionCreee.id,
        texte: r.texte.trim(),
        est_correcte: r.estCorrecte,
        explication: r.estCorrecte ? null : r.explication.trim() || null,
      }))

      const { error: erreurReponses } = await supabase.from('reponses').insert(reponsesAInserer)
      if (erreurReponses) return echec(`Les réponses n'ont pas pu être enregistrées (${erreurReponses.message}).`)
    }

    if (checklistMode && etapes.length > 0) {
      const etapesAInserer = etapes.map((etape, index) => ({
        cours_id: coursIdActuel,
        ordre: index + 1,
        intitule: composerAvecImages(etape.intitule, etape.images),
        critere_validation: etape.critereValidation.trim() || null,
        mode_validation: 'checkbox',
        bloquante: checklistMode === 'checkbox' ? etape.bloquante : false,
      }))

      const { error: erreurEtapes } = await supabase.from('etapes_checklist').insert(etapesAInserer)
      if (erreurEtapes) return echec(`La checklist n'a pas pu être enregistrée (${erreurEtapes.message}).`)
    }

    // Assignation : seules les lignes cours_groupes ajoutées ou retirées sont touchées, pour garder
    // la date d'assignation (cours_groupes.created_at) des groupes déjà assignés.
    if (!estAdmin) {
      const ajoutes = groupeIdsSelectionnes.filter((id) => !groupeIdsInitiaux.includes(id))
      const retires = groupeIdsInitiaux.filter((id) => !groupeIdsSelectionnes.includes(id))

      if (retires.length > 0) {
        const { error } = await supabase.from('cours_groupes').delete().eq('cours_id', coursIdActuel).in('groupe_id', retires)
        if (error) return echec(`Les groupes retirés n'ont pas pu être mis à jour (${error.message}).`)
      }

      if (ajoutes.length > 0) {
        const { error } = await supabase
          .from('cours_groupes')
          .insert(ajoutes.map((groupeId) => ({ cours_id: coursIdActuel, groupe_id: groupeId })))
        if (error) return echec(`Les groupes assignés n'ont pas pu être enregistrés (${error.message}).`)

        // Make n°2 : les élèves des groupes nouvellement assignés reçoivent l'email (fire-and-forget)
        notifierMakeNouveauCours(titre.trim(), ajoutes)
      }
    }

    setEnregistrement(false)
    quitterVers(onTermine)
  }

  // --- Rendu -------------------------------------------------------------------------------------

  const libelleRetour = modeEdition ? 'Détail du cours' : 'Mes cours'
  const titrePage = modeEdition ? 'Modifier le cours' : 'Créer un cours'
  const compteurs = {
    qcm: `${questions.length} question${questions.length > 1 ? 's' : ''}`,
    checklist: checklistMode ? `${etapes.length} étape${etapes.length > 1 ? 's' : ''}` : null,
  }
  const compteurCourt = { qcm: questions.length, checklist: checklistMode ? etapes.length : null }
  const erreurPour = (cible) => (erreur?.cible === cible ? <p className="message message-erreur cc-erreur">{erreur.message}</p> : null)
  const erreurUploadPour = (cle) =>
    erreurUpload?.cle === cle ? <p className="message message-erreur cc-erreur">{erreurUpload.message}</p> : null

  if (chargement || erreurChargement) {
    return (
      <div className="cc-page flow-page-formateur">
        <div className="cc-etat">
          <button type="button" className="fm-bouton-rond" onClick={() => quitterVers(onRetour)} aria-label={libelleRetour}>
            <Icone svg={iconeRetour} className="fm-bouton-rond-icone" />
          </button>
          {erreurChargement ? <p className="message message-erreur">{erreurChargement}</p> : <p className="fm-texte">Chargement…</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="cc-page flow-page-formateur">
      <input type="file" accept="image/*" ref={inputImageRef} onChange={handleFichierImage} hidden />

      {/* En-tête mobile et tablette */}
      <header className="cc-entete-mobile">
        <button type="button" className="fm-bouton-rond" onClick={() => demanderQuitter(onRetour)} aria-label={libelleRetour}>
          <Icone svg={iconeRetour} className="fm-bouton-rond-icone" />
        </button>
        <div className="cc-entete-mobile-titres">
          <h1>{titrePage}</h1>
          {titre.trim() && <p>{typo(titre.trim())}</p>}
        </div>
        {modeEdition && onApercu && (
          <button type="button" className="fm-bouton-rond" onClick={() => demanderQuitter(onApercu)} aria-label="Voir comme un élève">
            <Icone svg={iconeOeil} className="fm-bouton-rond-icone" />
          </button>
        )}
      </header>

      <nav className="cc-pastilles" aria-label="Sections du cours">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`cc-pastille${sectionActive === s.id ? ' cc-pastille-active' : ''}`}
            aria-current={sectionActive === s.id ? 'true' : undefined}
            onClick={() => allerA(s.id)}
          >
            {s.libelle}
            {compteurCourt[s.id] != null && <span className="cc-pastille-compteur">{compteurCourt[s.id]}</span>}
          </button>
        ))}
      </nav>

      <div className="cc-grille">
        {/* Colonne de gauche (desktop) : retour, sommaire, aperçu */}
        <aside className="cc-cote">
          <button type="button" className="cc-retour" onClick={() => demanderQuitter(onRetour)}>
            <span className="cc-retour-rond">
              <Icone svg={iconeRetour} className="fm-bouton-rond-icone" />
            </span>
            {libelleRetour}
          </button>

          <nav className="cc-sommaire" aria-label="Sommaire du cours">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`cc-sommaire-entree${sectionActive === s.id ? ' cc-sommaire-actif' : ''}`}
                aria-current={sectionActive === s.id ? 'true' : undefined}
                onClick={() => allerA(s.id)}
              >
                <span>{s.libelle}</span>
                {compteurs[s.id] && <span className="cc-sommaire-compteur">{compteurs[s.id]}</span>}
              </button>
            ))}
          </nav>

          {modeEdition && onApercu && (
            <button type="button" className="cc-lien-apercu" onClick={() => demanderQuitter(onApercu)}>
              <Icone svg={iconeOeil} className="cc-icone-20" />
              Voir comme un élève
            </button>
          )}
        </aside>

        <main className="cc-contenu">
          <div className="cc-entete-desktop">
            <h1>{titrePage}</h1>
            {titre.trim() && <p className="fm-sous-titre">{typo(titre.trim())}</p>}
          </div>
          {estAdmin && <p className="creation-badge-officiel">Compte officiel : ce cours sera public</p>}

          {/* Infos */}
          <section id="cc-section-infos" data-section="infos" className="cc-carte" aria-labelledby="cc-titre-infos">
            <h2 id="cc-titre-infos">Infos</h2>

            <div className="cc-ligne-champs">
              <label className="champ cc-champ-titre">
                <span>Titre</span>
                <ChampAuto valeur={titre} onChange={setTitre} />
              </label>
              <div className="champ">
                <span id="cc-libelle-theme">Thème</span>
                <Dropdown value={categorie} onChange={setCategorie} options={OPTIONS_THEMES} placeholder="Choisir un thème" />
              </div>
            </div>

            {!estAdmin && (
              <div className="cc-groupes">
                <span className="cc-libelle" id="cc-libelle-groupes">
                  Assigner à des groupes
                </span>
                {mesGroupes === null ? null : mesGroupes.length === 0 ? (
                  <p className="fm-texte">
                    Tu n’as pas encore de groupe.{' '}
                    {onCreerGroupe && (
                      <button type="button" className="cc-lien" onClick={() => demanderQuitter(onCreerGroupe)}>
                        Créer un groupe
                      </button>
                    )}
                  </p>
                ) : (
                  <>
                    <div className="cc-groupes-liste" role="group" aria-labelledby="cc-libelle-groupes">
                      {mesGroupes.map((groupe) => {
                        const choisi = groupeIdsSelectionnes.includes(groupe.id)
                        return (
                          <button
                            key={groupe.id}
                            type="button"
                            className={`cc-choix-groupe${choisi ? ' cc-choisi' : ''}`}
                            aria-pressed={choisi}
                            onClick={() =>
                              setGroupeIdsSelectionnes((prev) =>
                                choisi ? prev.filter((id) => id !== groupe.id) : [...prev, groupe.id]
                              )
                            }
                          >
                            <span className="cc-rond">{choisi && <Coche />}</span>
                            {typo(groupe.nom)} · {libelleEleves(groupe.nbEleves)}
                          </button>
                        )
                      })}
                    </div>
                    <p className="cc-aide">
                      Les élèves des groupes choisis voient le cours dans « De ton formateur » et reçoivent un email.
                    </p>
                  </>
                )}
              </div>
            )}
            {erreurPour('infos')}
          </section>

          {/* Leçon */}
          <section id="cc-section-lecon" data-section="lecon" className="cc-carte" aria-labelledby="cc-titre-lecon">
            <h2 id="cc-titre-lecon">Leçon</h2>

            <div className="cc-editeur">
              <div className="cc-editeur-outils">
                <div className="cc-onglets" role="tablist" aria-label="Mode de l’éditeur">
                  {[
                    { id: 'ecrire', libelle: 'Écrire' },
                    { id: 'apercu', libelle: 'Aperçu' },
                  ].map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      role="tab"
                      id={`cc-onglet-${o.id}`}
                      aria-selected={ongletLecon === o.id}
                      aria-controls="cc-panneau-lecon"
                      className={`cc-onglet${ongletLecon === o.id ? ' cc-onglet-actif' : ''}`}
                      onClick={() => setOngletLecon(o.id)}
                    >
                      {o.libelle}
                    </button>
                  ))}
                </div>
                <div className="cc-editeur-actions">
                  <button
                    type="button"
                    className="cc-bouton-outil"
                    aria-label="Image"
                    disabled={uploadCibleEnCours === 'contenu'}
                    onClick={() => ouvrirSelecteurImage({ cle: 'contenu', ajouter: ajouterImageContenu })}
                  >
                    <Icone svg={iconeImage} className="cc-icone-20" />
                    <span className="cc-libelle-long">{uploadCibleEnCours === 'contenu' ? 'Envoi…' : 'Image'}</span>
                  </button>
                  <button type="button" className="cc-bouton-outil" aria-label="Vidéo" onClick={ouvrirModaleVideo}>
                    <Icone svg={iconeVideo} className="cc-icone-20" />
                    <span className="cc-libelle-long">Vidéo</span>
                  </button>
                </div>
              </div>

              <div id="cc-panneau-lecon" role="tabpanel" aria-labelledby={`cc-onglet-${ongletLecon}`}>
                {ongletLecon === 'ecrire' ? (
                  <textarea
                    ref={contenuTextareaRef}
                    className="cc-editeur-texte"
                    aria-label="Contenu de la leçon"
                    value={contenu}
                    onChange={(e) => setContenu(e.target.value)}
                    onSelect={(e) => {
                      curseurContenu.current = e.target.selectionStart
                    }}
                  />
                ) : (
                  <div className="cc-apercu">
                    {contenu.trim() || aRetenir.trim() ? (
                      <article className="fiche-carte fiche-lecon">
                        <ContenuMarkdown texte={developperImages(contenu, tableImages.current)} className="fiche-lecon-contenu" />
                        {aRetenir.trim() && (
                          <aside className="fiche-retenir">
                            <div className="fiche-retenir-entete">
                              <span className="fiche-retenir-pastille">
                                <Icone svg={iconeAmpoule} className="fiche-retenir-icone" />
                              </span>
                              <h2>À retenir</h2>
                            </div>
                            <ul>
                              {aRetenir
                                .split('\n')
                                .map((l) => l.trim())
                                .filter(Boolean)
                                .map((point, i) => (
                                  <li key={i}>{typo(point)}</li>
                                ))}
                            </ul>
                          </aside>
                        )}
                      </article>
                    ) : (
                      <p className="fm-texte">Rien à afficher pour l’instant.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {erreurUploadPour('contenu')}
            <p className="cc-aide">Laisse une ligne vide entre deux paragraphes. Un lien YouTube ou Vimeo s’intègre tout seul.</p>

            {imagesContenu.length > 0 && (
              <div className="cc-images-lecon">
                <span className="cc-libelle">Images de la leçon</span>
                <Miniatures images={imagesContenu} onRetirer={(i) => retirerImageContenu(imagesContenu[i].numero)} />
              </div>
            )}

            <label className="champ cc-champ-retenir">
              <span className="cc-libelle-ligne">
                <span>À retenir</span>
                <span className="cc-aide cc-aide-retenir">Un point par ligne, 3 à 5 conseillés</span>
              </span>
              <textarea value={aRetenir} onChange={(e) => setARetenir(e.target.value)} />
            </label>
          </section>

          {/* QCM */}
          <section id="cc-section-qcm" data-section="qcm" className="cc-carte" aria-labelledby="cc-titre-qcm">
            <div className="cc-carte-entete">
              <h2 id="cc-titre-qcm">QCM</h2>
              <span className="fm-meta">{compteurs.qcm}</span>
            </div>

            <div className="cc-questions">
              {questions.map((question, qi) => {
                const numero = qi + 1
                const type = TYPES_REPONSE.find((t) => t.value === question.typeReponse) ?? TYPES_REPONSE[0]

                if (!question.estOuverte) {
                  return (
                    <div key={question.localId} id={`cc-element-${question.localId}`}>
                      <button
                        type="button"
                        className="cc-question-repliee"
                        aria-expanded="false"
                        onClick={() => majQuestion(question.localId, { estOuverte: true })}
                      >
                        <span className="cc-numero">{numero}</span>
                        <span className="cc-question-enonce">{typo(question.enonce.trim()) || `Question ${numero}`}</span>
                        <span className="cc-question-meta">
                          {type.long} · {question.reponses.length} réponse{question.reponses.length > 1 ? 's' : ''}
                        </span>
                        <Icone svg={iconeChevron} className="cc-chevron" />
                      </button>
                      {erreurPour(question.localId)}
                    </div>
                  )
                }

                return (
                  <div key={question.localId} id={`cc-element-${question.localId}`} className="cc-question">
                    <div className="cc-question-entete">
                      <span className="cc-numero cc-numero-actif">{numero}</span>
                      <h3>Question {numero}</h3>
                      {questions.length > 1 && (
                        <MenuActions
                          titre={`Question ${numero}`}
                          label={`Actions de la question ${numero}`}
                          actions={[
                            {
                              libelle: 'Supprimer la question',
                              danger: true,
                              onClick: () =>
                                setConfirmation({ type: 'question', numero, suite: () => supprimerQuestion(question.localId) }),
                            },
                          ]}
                        />
                      )}
                      <button
                        type="button"
                        className="fm-bouton-rond fm-bouton-rond-40 cc-bouton-replier"
                        aria-label={`Replier la question ${numero}`}
                        aria-expanded="true"
                        onClick={() => majQuestion(question.localId, { estOuverte: false })}
                      >
                        <Icone svg={iconeChevron} className="cc-chevron cc-chevron-ouvert" />
                      </button>
                    </div>

                    <label className="champ">
                      <span>Énoncé</span>
                      <span className="cc-champ-avec-bouton">
                        <textarea
                          rows={2}
                          value={question.enonce}
                          onChange={(e) => majQuestion(question.localId, { enonce: e.target.value })}
                        />
                        <button
                          type="button"
                          className="cc-bouton-image-interne"
                          aria-label="Ajouter une image à l’énoncé"
                          disabled={uploadCibleEnCours === `enonce-${question.localId}`}
                          onClick={() =>
                            ouvrirSelecteurImage({
                              cle: `enonce-${question.localId}`,
                              ajouter: (image) =>
                                setQuestions((prev) =>
                                  prev.map((q) => (q.localId === question.localId ? { ...q, images: [...q.images, image] } : q))
                                ),
                            })
                          }
                        >
                          <Icone svg={iconeImage} className="cc-icone-20" />
                        </button>
                      </span>
                    </label>
                    <Miniatures
                      images={question.images}
                      onRetirer={(i) => majQuestion(question.localId, { images: question.images.filter((_, j) => j !== i) })}
                    />
                    {erreurUploadPour(`enonce-${question.localId}`)}

                    <div className="cc-type-reponse" role="radiogroup" aria-label="Type de réponse">
                      {TYPES_REPONSE.map((t) => {
                        const choisi = question.typeReponse === t.value
                        return (
                          <button
                            key={t.value}
                            type="button"
                            role="radio"
                            aria-checked={choisi}
                            className={`cc-choix${choisi ? ' cc-choisi' : ''}`}
                            onClick={() => changerTypeReponse(question, t.value)}
                          >
                            <span className="cc-libelle-long">{t.long}</span>
                            <span className="cc-libelle-court">{t.court}</span>
                          </button>
                        )
                      })}
                    </div>

                    <div className="cc-reponses">
                      {question.reponses.map((reponse, ri) => {
                        const lettre = String.fromCharCode(65 + ri)
                        return (
                          <div key={reponse.localId} className={`cc-reponse${reponse.estCorrecte ? ' cc-reponse-correcte' : ''}`}>
                            <div className="cc-reponse-ligne">
                              <span className="cc-lettre" aria-hidden="true">
                                {lettre}
                              </span>
                              <input
                                type="text"
                                className="cc-reponse-texte"
                                aria-label={`Réponse ${lettre}`}
                                placeholder={`Réponse ${lettre}`}
                                value={reponse.texte}
                                onChange={(e) => majReponse(question, reponse.localId, 'texte', e.target.value)}
                              />
                              {/* Vrai input (radio en réponse unique, case en plusieurs réponses), masqué
                                  visuellement sous un repère dessiné ; les flèches du clavier passent d'un
                                  radio à l'autre de la question */}
                              <label
                                className={`cc-bonne-controle${question.typeReponse === 'simple' ? ' cc-bonne-radio' : ''}${
                                  reponse.estCorrecte ? ' cc-bonne-cochee' : ''
                                }`}
                              >
                                <input
                                  type={question.typeReponse === 'simple' ? 'radio' : 'checkbox'}
                                  name={`bonne-reponse-${question.localId}`}
                                  className="cc-bonne-input"
                                  checked={reponse.estCorrecte}
                                  aria-label={`Réponse ${lettre} : bonne réponse`}
                                  onChange={() => basculerBonneReponse(question, reponse.localId)}
                                />
                                <span className="cc-bonne-repere" aria-hidden="true">
                                  {reponse.estCorrecte && <Coche />}
                                </span>
                                <span className="cc-bonne-libelle">Bonne réponse</span>
                              </label>
                              <button
                                type="button"
                                className="cc-bouton-croix"
                                aria-label={`Supprimer la réponse ${lettre}`}
                                disabled={question.reponses.length <= 2}
                                onClick={() =>
                                  majQuestion(question.localId, {
                                    reponses: question.reponses.filter((r) => r.localId !== reponse.localId),
                                  })
                                }
                              >
                                <Icone svg={iconeCroix} className="cc-icone-16" />
                              </button>
                            </div>
                            {!reponse.estCorrecte && (
                              <input
                                type="text"
                                className="cc-reponse-explication"
                                aria-label={`Explication de la réponse ${lettre}`}
                                placeholder="Explication si l’élève choisit cette réponse (facultatif)"
                                value={reponse.explication}
                                onChange={(e) => majReponse(question, reponse.localId, 'explication', e.target.value)}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <button
                      type="button"
                      className="bouton-ajouter cc-ajouter-reponse"
                      onClick={() => majQuestion(question.localId, { reponses: [...question.reponses, nouvelleReponse()] })}
                    >
                      + Ajouter une réponse
                    </button>
                    {erreurPour(question.localId)}
                  </div>
                )
              })}
            </div>

            <button type="button" className="bouton-ajouter cc-ajouter-large" onClick={ajouterQuestion}>
              + Ajouter une question
            </button>
            {erreurPour('qcm')}
          </section>

          {/* Checklist terrain */}
          <section id="cc-section-checklist" data-section="checklist" className="cc-carte" aria-labelledby="cc-titre-checklist">
            <div className="cc-carte-entete">
              <h2 id="cc-titre-checklist">Checklist terrain</h2>
              {compteurs.checklist && <span className="fm-meta">{compteurs.checklist}</span>}
            </div>

            <div className="cc-modes" role="radiogroup" aria-labelledby="cc-titre-checklist">
              {MODES_CHECKLIST.map((m) => {
                const choisi = checklistMode === m.value
                return (
                  <button
                    key={m.libelle}
                    type="button"
                    role="radio"
                    aria-checked={choisi}
                    className={`cc-choix cc-mode${choisi ? ' cc-choisi' : ''}`}
                    onClick={() => choisirModeChecklist(m.value)}
                  >
                    <span className="cc-mode-textes">
                      <span className="cc-mode-libelle">{m.libelle}</span>
                      <span className="cc-mode-detail">{m.detail}</span>
                    </span>
                    {choisi && <Coche />}
                  </button>
                )
              })}
            </div>

            {checklistMode && (
              <ol className="cc-etapes">
                {etapes.map((etape, ei) => {
                  const active = etapeActiveId === etape.localId
                  const montrerCritere = active || etape.critereValidation.trim()
                  const actions = [
                    { libelle: 'Critère de validation', onClick: () => ouvrirCritere(etape.localId) },
                    ...(ei > 0 ? [{ libelle: 'Monter', onClick: () => deplacerEtape(ei, ei - 1) }] : []),
                    ...(ei < etapes.length - 1 ? [{ libelle: 'Descendre', onClick: () => deplacerEtape(ei, ei + 1) }] : []),
                    {
                      libelle: 'Supprimer',
                      danger: true,
                      onClick: () =>
                        setConfirmation({
                          type: 'etape',
                          numero: ei + 1,
                          suite: () => setEtapes((prev) => prev.filter((e) => e.localId !== etape.localId)),
                        }),
                    },
                  ]
                  const boutonImage = (
                    <button
                      type="button"
                      className="cc-bouton-etape-image"
                      aria-label={`Ajouter une image à l’étape ${ei + 1}`}
                      disabled={uploadCibleEnCours === `etape-${etape.localId}`}
                      onClick={() =>
                        ouvrirSelecteurImage({
                          cle: `etape-${etape.localId}`,
                          ajouter: (image) =>
                            setEtapes((prev) =>
                              prev.map((e) => (e.localId === etape.localId ? { ...e, images: [...e.images, image] } : e))
                            ),
                        })
                      }
                    >
                      <Icone svg={iconeImage} className="cc-icone-20" />
                      <span className="cc-libelle-court">Image</span>
                    </button>
                  )
                  const boutonBloquante = checklistMode === 'checkbox' && (
                    <button
                      type="button"
                      className={`cc-bloquante${etape.bloquante ? ' cc-bloquante-active' : ''}`}
                      aria-pressed={etape.bloquante}
                      onClick={() => majEtape(etape.localId, { bloquante: !etape.bloquante })}
                    >
                      Bloquante
                    </button>
                  )

                  return (
                    <li
                      key={etape.localId}
                      id={`cc-element-${etape.localId}`}
                      className={`cc-etape${active ? ' cc-etape-active' : ''}${etapeSurvolee === etape.localId ? ' cc-etape-cible' : ''}`}
                      onFocusCapture={() => setEtapeActiveId(etape.localId)}
                      onDragOver={(e) => {
                        if (etapeGlissee.current == null) return
                        e.preventDefault()
                        setEtapeSurvolee(etape.localId)
                      }}
                      onDragLeave={() => setEtapeSurvolee((id) => (id === etape.localId ? null : id))}
                      onDrop={(e) => {
                        e.preventDefault()
                        if (etapeGlissee.current != null) deplacerEtape(etapeGlissee.current, ei)
                        etapeGlissee.current = null
                        setEtapeSurvolee(null)
                      }}
                    >
                      <div className="cc-etape-ligne">
                        <span
                          className="cc-poignee"
                          draggable
                          title="Glisser pour réordonner"
                          aria-hidden="true"
                          onDragStart={(e) => {
                            etapeGlissee.current = ei
                            e.dataTransfer.effectAllowed = 'move'
                            e.dataTransfer.setData('text/plain', String(ei))
                            const ligne = e.currentTarget.closest('.cc-etape')
                            if (ligne) e.dataTransfer.setDragImage(ligne, 24, 24)
                          }}
                          onDragEnd={() => {
                            etapeGlissee.current = null
                            setEtapeSurvolee(null)
                          }}
                        >
                          <Icone svg={iconePoignee} className="cc-icone-20" />
                        </span>
                        <span className={`cc-numero${active ? ' cc-numero-actif' : ''}`}>{ei + 1}</span>
                        <ChampAuto
                          className="cc-etape-intitule"
                          aria-label={`Intitulé de l’étape ${ei + 1}`}
                          placeholder={`Étape ${ei + 1}`}
                          valeur={etape.intitule}
                          onChange={(v) => majEtape(etape.localId, { intitule: v })}
                        />
                        <span className="cc-etape-outils-desktop">
                          {boutonBloquante}
                          {boutonImage}
                        </span>
                        <MenuActions titre={`Étape ${ei + 1}`} label={`Actions de l’étape ${ei + 1}`} actions={actions} />
                      </div>

                      <div className="cc-etape-outils-mobile">
                        {boutonBloquante}
                        {boutonImage}
                      </div>

                      <div className="cc-etape-details">
                        <Miniatures
                          images={etape.images}
                          onRetirer={(i) => majEtape(etape.localId, { images: etape.images.filter((_, j) => j !== i) })}
                        />
                        {erreurUploadPour(`etape-${etape.localId}`)}
                        {montrerCritere && (
                          <label className="champ">
                            <span>Critère de validation (facultatif)</span>
                            <input
                              type="text"
                              ref={(el) => {
                                critereRefs.current[etape.localId] = el
                              }}
                              placeholder="Ex. : trou de 65 mm, légère pente vers l’extérieur"
                              value={etape.critereValidation}
                              onChange={(e) => majEtape(etape.localId, { critereValidation: e.target.value })}
                            />
                          </label>
                        )}
                        {erreurPour(etape.localId)}
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}

            {checklistMode && (
              <button type="button" className="bouton-ajouter cc-ajouter-large" onClick={ajouterEtape}>
                + Ajouter une étape
              </button>
            )}
            {erreurPour('checklist')}
          </section>
        </main>
      </div>

      {/* Barre d'enregistrement */}
      <div className="cc-barre-zone">
        <div className="cc-barre-grille">
          <div className="cc-barre" role="region" aria-label="Enregistrement">
            <p className="cc-barre-message" aria-live="polite">
              {erreur?.cible === 'global' ? (
                <span className="message-erreur">{erreur.message}</span>
              ) : modifie ? (
                <>
                  <span className="cc-point-orange" aria-hidden="true" />
                  Modifications non enregistrées
                </>
              ) : (
                <span className="cc-barre-aucune">Aucune modification</span>
              )}
            </p>
            <div className="cc-barre-actions">
              <button type="button" className="fm-lien-action cc-annuler" onClick={() => demanderQuitter(onRetour)}>
                Annuler
              </button>
              <button type="button" className="bouton-primaire cc-enregistrer" disabled={enregistrement || !modifie} onClick={handleEnregistrer}>
                {enregistrement ? 'Enregistrement…' : modeEdition ? 'Enregistrer' : 'Créer le cours'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {modaleVideo && (
        <Modale
          titre="Insérer une vidéo"
          sousTitre="Colle un lien YouTube ou Vimeo."
          etroite
          onFermer={() => setModaleVideo(false)}
          actions={
            <>
              <button type="button" className="fm-lien-action" onClick={() => setModaleVideo(false)}>
                Annuler
              </button>
              <button type="button" className="bouton-primaire" disabled={!lienVideo.trim()} onClick={insererVideo}>
                Insérer
              </button>
            </>
          }
        >
          <label className="champ">
            <span>Lien de la vidéo</span>
            <input
              type="url"
              autoFocus
              placeholder="https://www.youtube.com/watch?v=…"
              value={lienVideo}
              onChange={(e) => {
                setLienVideo(e.target.value)
                setErreurVideo(null)
              }}
              onKeyDown={(e) => e.key === 'Enter' && insererVideo()}
            />
          </label>
          {erreurVideo && <p className="message message-erreur">{erreurVideo}</p>}
        </Modale>
      )}

      {confirmation?.type === 'quitter' && (
        <ModaleConfirmation
          titre="Quitter sans enregistrer ?"
          texte={MESSAGE_QUITTER}
          libelleConfirmer="Quitter"
          onFermer={() => setConfirmation(null)}
          onConfirmer={() => {
            const suite = confirmation.suite
            setConfirmation(null)
            quitterVers(suite)
          }}
        />
      )}
      {confirmation && confirmation.type !== 'quitter' && (
        <ModaleConfirmation
          titre={
            confirmation.type === 'question'
              ? `Supprimer la question ${confirmation.numero} ?`
              : confirmation.type === 'etape'
                ? `Supprimer l’étape ${confirmation.numero} ?`
                : 'Retirer la checklist ?'
          }
          texte={
            confirmation.type === 'sans-checklist'
              ? 'Les étapes saisies seront supprimées à l’enregistrement.'
              : 'Elle sera supprimée à l’enregistrement du cours.'
          }
          libelleConfirmer={confirmation.type === 'sans-checklist' ? 'Retirer' : 'Supprimer'}
          onFermer={() => setConfirmation(null)}
          onConfirmer={() => {
            confirmation.suite()
            setConfirmation(null)
          }}
        />
      )}
    </div>
  )
}

export default CreationCours
