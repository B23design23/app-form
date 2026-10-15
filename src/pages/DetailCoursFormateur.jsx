import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ContenuMarkdown from '../components/ContenuMarkdown'
import Icone from '../components/Icone'
import Modale, { ModaleConfirmation } from '../components/formateur/Modale'
import MenuActions from '../components/formateur/MenuActions'
import { ListeCases, PastillesGroupes, RetourFormateur } from '../components/formateur/Elements'
import { partiesContenuCours, tempsLecture, imagesLecon, premierParagraphe } from '../lib/cours'
import { notifierMakeNouveauCours } from '../lib/notificationsMake'
import { typo } from '../lib/typographie'
import iconeOeil from '../Assets/oeil.svg?raw'
import iconeChevron from '../Assets/chevron-right.svg?raw'
import iconeAmpoule from '../Assets/ampoule.svg?raw'
import '../styles/shared.css'
import '../components/formateur/Formateur.css'
import './DetailCoursFormateur.css'

const JOURS_SANS_DEMARRAGE = 7
const MINIATURES_MAX = 4

// Section repliable : carte avec un bouton rond chevron à droite du titre.
function SectionRepliable({ titre, meta, ouverte, onBasculer, children }) {
  return (
    <section className="fm-carte dc-section">
      <div className="dc-section-entete">
        {/* Mobile : la ligne d'info passe sous le titre ; desktop : à droite */}
        <div className="dc-section-titres">
          <h2>{titre}</h2>
          {meta && <span className="fm-meta">{meta}</span>}
        </div>
        <button
          type="button"
          className={`fm-bouton-rond fm-bouton-rond-40 dc-chevron${ouverte ? ' dc-chevron-ouvert' : ''}`}
          onClick={onBasculer}
          aria-expanded={ouverte}
          aria-label={ouverte ? `Replier ${titre}` : `Déplier ${titre}`}
        >
          <Icone svg={iconeChevron} className="fm-bouton-rond-icone" />
        </button>
      </div>
      {ouverte && children}
    </section>
  )
}

// Détail d'un cours (formateur) : en-tête, avancement des élèves, résumé de la leçon, du QCM et
// de la checklist. La leçon complète se lit via « Voir comme un élève » (aperçu sans écriture).
function DetailCoursFormateur({ authUser, coursId, onModifier, onRetour, onApercu }) {
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  const [cours, setCours] = useState(null)
  const [questions, setQuestions] = useState([])
  const [etapes, setEtapes] = useState([])
  const [assignations, setAssignations] = useState([])
  const [avancement, setAvancement] = useState(null)

  const [sections, setSections] = useState({ lecon: true, qcm: true, checklist: false })
  const [confirmationSuppression, setConfirmationSuppression] = useState(false)
  const [suppression, setSuppression] = useState(false)

  const [assignationOuverte, setAssignationOuverte] = useState(false)
  const [mesGroupes, setMesGroupes] = useState([])
  const [groupesChoisis, setGroupesChoisis] = useState([])
  const [assignationEnCours, setAssignationEnCours] = useState(false)
  const [rechargement, setRechargement] = useState(0)

  useEffect(() => {
    let annule = false

    async function charger() {
      const [coursRes, questionsRes, etapesRes, coursGroupesRes] = await Promise.all([
        // select('*') : tolère l'absence de colonnes de migrations non jouées (a_retenir…)
        supabase.from('cours').select('*').eq('id', coursId).single(),
        supabase
          .from('questions')
          .select('id, enonce, type_reponse, reponses(id, texte, est_correcte)')
          .eq('cours_id', coursId)
          .order('id'),
        supabase.from('etapes_checklist').select('id, ordre, intitule, bloquante').eq('cours_id', coursId).order('ordre'),
        // created_at (migration 0004) lu via '*' pour ne pas casser sans la migration
        supabase.from('cours_groupes').select('*, groupes(id, nom)').eq('cours_id', coursId),
      ])
      if (annule) return
      const premiereErreur = coursRes.error?.message ?? questionsRes.error?.message ?? etapesRes.error?.message ?? coursGroupesRes.error?.message
      if (premiereErreur) {
        setErreur(premiereErreur)
        setChargement(false)
        return
      }
      const assign = (coursGroupesRes.data ?? []).filter((cg) => cg.groupes)
      setCours(coursRes.data)
      setQuestions(questionsRes.data ?? [])
      setEtapes(etapesRes.data ?? [])
      setAssignations(assign)
      setChargement(false)

      // Avancement des élèves des groupes assignés
      if (assign.length === 0) {
        setAvancement(null)
        return
      }
      const resultats = await Promise.all(assign.map((cg) => supabase.rpc('get_membres_groupe', { p_groupe_id: cg.groupes.id })))
      if (annule) return
      // Date d'assignation la plus ancienne pour chaque élève (un élève peut être dans 2 groupes)
      const assigneLe = new Map()
      resultats.forEach(({ data }, i) => {
        for (const m of data ?? []) {
          const date = assign[i].created_at ?? null
          const actuelle = assigneLe.get(m.id)
          if (!assigneLe.has(m.id) || (date && (!actuelle || date < actuelle))) assigneLe.set(m.id, date)
        }
      })
      const ids = [...assigneLe.keys()]
      if (ids.length === 0) {
        setAvancement({ total: 0, termines: 0, enCours: 0, nonCommences: 0, scoreMoyen: null, sansDemarrage: 0 })
        return
      }
      const [progressionRes, scoresRes] = await Promise.all([
        supabase.from('progression').select('user_id, statut').eq('cours_id', coursId).in('user_id', ids),
        supabase.from('scores').select('user_id, score').eq('cours_id', coursId).eq('type', 'quiz_cours').in('user_id', ids),
      ])
      if (annule) return
      const statutParEleve = new Map((progressionRes.data ?? []).map((p) => [p.user_id, p.statut]))
      const meilleurParEleve = new Map()
      for (const s of scoresRes.data ?? []) meilleurParEleve.set(s.user_id, Math.max(meilleurParEleve.get(s.user_id) ?? 0, s.score))
      const statuts = ids.map((id) => statutParEleve.get(id) ?? 'non_commence')
      const seuil = Date.now() - JOURS_SANS_DEMARRAGE * 86400000
      setAvancement({
        total: ids.length,
        termines: statuts.filter((s) => s === 'termine').length,
        enCours: statuts.filter((s) => s === 'en_cours').length,
        nonCommences: statuts.filter((s) => s === 'non_commence').length,
        scoreMoyen: meilleurParEleve.size
          ? Math.round([...meilleurParEleve.values()].reduce((a, b) => a + b, 0) / meilleurParEleve.size)
          : null,
        sansDemarrage: ids.filter((id) => {
          const date = assigneLe.get(id)
          return date && new Date(date).getTime() <= seuil && (statutParEleve.get(id) ?? 'non_commence') === 'non_commence'
        }).length,
      })
    }

    charger()
    return () => {
      annule = true
    }
  }, [coursId, rechargement])

  async function confirmerSuppression() {
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

  async function ouvrirAssignation() {
    const { data } = await supabase.from('groupes').select('id, nom').eq('formateur_id', authUser.id).order('nom')
    setMesGroupes(data ?? [])
    setGroupesChoisis(assignations.map((a) => a.groupes.id))
    setAssignationOuverte(true)
  }

  async function validerAssignation() {
    setAssignationEnCours(true)
    const actuels = assignations.map((a) => a.groupes.id)
    const ajouts = groupesChoisis.filter((id) => !actuels.includes(id))
    const retraits = actuels.filter((id) => !groupesChoisis.includes(id))
    if (ajouts.length) await supabase.from('cours_groupes').insert(ajouts.map((groupe_id) => ({ cours_id: coursId, groupe_id })))
    if (retraits.length) await supabase.from('cours_groupes').delete().eq('cours_id', coursId).in('groupe_id', retraits)
    if (ajouts.length) notifierMakeNouveauCours(cours.titre, ajouts)
    setAssignationEnCours(false)
    setAssignationOuverte(false)
    setRechargement((n) => n + 1)
  }

  if (chargement) {
    return (
      <div className="espace-page espace-page-etroit fm-page">
        <p>Chargement…</p>
      </div>
    )
  }

  if (erreur) {
    return (
      <div className="fm-detail">
        <div className="espace-page espace-page-etroit fm-page">
          <RetourFormateur libelle="Mes cours" onRetour={onRetour} />
          <p className="message message-erreur">{erreur}</p>
        </div>
      </div>
    )
  }

  const estProprietaire = cours.formateur_id === authUser.id
  const groupes = assignations.map((a) => a.groupes)
  // Même fonction que la carte de Mes cours : questions et étapes sont chargées à part ici
  const parties = partiesContenuCours({ ...cours, questions, etapes_checklist: etapes })
  const images = imagesLecon(cours.contenu)
  const paragraphe = premierParagraphe(cours.contenu)
  const pointsARetenir = (cours.a_retenir ?? '').split('\n').map((l) => l.trim()).filter(Boolean)
  const nbBloquantes = etapes.filter((e) => e.bloquante).length
  const modeChecklist = cours.checklist_mode === 'reorder' ? 'Remise en ordre' : 'Cases à cocher'
  const basculer = (cle) => setSections((s) => ({ ...s, [cle]: !s[cle] }))
  const actionsMenu = [{ libelle: 'Supprimer le cours', danger: true, onClick: () => setConfirmationSuppression(true) }]

  return (
    <div className="fm-detail">
      <div className="espace-page espace-page-etroit fm-page">
        <div className="dc-barre-haut">
          <RetourFormateur libelle="Mes cours" onRetour={onRetour} />
          {estProprietaire && (
            <div className="dc-menu-mobile">
              <MenuActions titre={cours.titre} actions={actionsMenu} />
            </div>
          )}
        </div>

        {/* En-tête */}
        <div className="dc-entete">
          <div className="dc-entete-texte">
            <h1 className="dc-titre">{typo(cours.titre)}</h1>
            <div className="fm-pastilles dc-entete-pastilles">
              <span className="fm-pastille fm-pastille-blanche">{cours.categorie}</span>
              {parties.length > 0 && <span className="fm-meta">{parties.join(' · ')}</span>}
              {parties.length > 0 && (
                <span className="fm-meta" aria-hidden="true">
                  ·
                </span>
              )}
              <PastillesGroupes groupes={groupes} />
            </div>
          </div>
          <div className="dc-actions">
            <button type="button" className="bouton-secondaire dc-action" onClick={onApercu}>
              <Icone svg={iconeOeil} className="cta-icone" />
              <span className="dc-libelle-long">Voir comme un élève</span>
              <span className="dc-libelle-court">Vue élève</span>
            </button>
            {estProprietaire && (
              <button type="button" className="bouton-primaire dc-action" onClick={onModifier}>
                Modifier
              </button>
            )}
            {estProprietaire && (
              <div className="dc-menu-desktop">
                <MenuActions titre={cours.titre} actions={actionsMenu} />
              </div>
            )}
          </div>
        </div>

        {/* Avancement des élèves */}
        {groupes.length > 0 ? (
          <section className="fm-carte dc-avancement">
            <div className="fm-carte-entete">
              <h2>Avancement des élèves</h2>
              {avancement && (
                <span className="fm-meta">
                  {groupes.length === 1 ? typo(groupes[0].nom) : `${groupes.length} groupes`} · {avancement.total} élève
                  {avancement.total > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {avancement === null ? (
              <p className="fm-texte">Chargement…</p>
            ) : (
              <div className="dc-avancement-corps">
                <div className="dc-avancement-repartition">
                  <div className="dc-barre-empilee" aria-hidden="true">
                    {[
                      ['termine', avancement.termines],
                      ['en-cours', avancement.enCours],
                      ['non-commence', avancement.nonCommences],
                    ]
                      .filter(([, n]) => n > 0)
                      .map(([cle, n]) => (
                        <span key={cle} className={`dc-segment dc-segment-${cle}`} style={{ flexGrow: n }} />
                      ))}
                  </div>
                  <ul className="dc-legende">
                    <li>
                      <span className="dc-point dc-segment-termine" /> {avancement.termines} terminé{avancement.termines > 1 ? 's' : ''}
                    </li>
                    <li>
                      <span className="dc-point dc-segment-en-cours" /> {avancement.enCours} en cours
                    </li>
                    <li>
                      <span className="dc-point dc-segment-non-commence" /> {avancement.nonCommences} non commencé
                      {avancement.nonCommences > 1 ? 's' : ''}
                    </li>
                  </ul>
                </div>
                <div className="dc-chiffres">
                  {/* Libellé au-dessus, chiffre dessous ; rouge seulement s'il y a des élèves à relancer */}
                  <div className="dc-chiffre">
                    <span className="dc-chiffre-libelle">Score moyen au quiz</span>
                    <span className="dc-chiffre-valeur">{avancement.scoreMoyen === null ? '-' : `${avancement.scoreMoyen} %`}</span>
                  </div>
                  <div className="dc-chiffre">
                    <span className="dc-chiffre-libelle" title="Pas commencé depuis 7 jours">
                      Pas commencé (7 j)
                    </span>
                    <span className={`dc-chiffre-valeur${avancement.sansDemarrage > 0 ? ' dc-chiffre-erreur' : ''}`}>
                      {avancement.sansDemarrage}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : (
          estProprietaire && (
            <section className="fm-carte dc-non-assigne">
              <p className="fm-texte">Assigne ce cours à un groupe pour suivre l'avancement des élèves.</p>
              <button type="button" className="bouton-secondaire" onClick={ouvrirAssignation}>
                Assigner à un groupe
              </button>
            </section>
          )
        )}

        {/* Leçon : premier paragraphe, miniatures, « À retenir » */}
        <SectionRepliable
          titre="Leçon"
          meta={`${tempsLecture(cours.contenu)} min de lecture · ${images.length} image${images.length > 1 ? 's' : ''}`}
          ouverte={sections.lecon}
          onBasculer={() => basculer('lecon')}
        >
          <div className={`dc-lecon${pointsARetenir.length ? ' dc-lecon-avec-retenir' : ''}`}>
            <div className="dc-lecon-texte">
              {paragraphe ? <ContenuMarkdown texte={paragraphe} className="dc-paragraphe" /> : <p className="fm-texte">Leçon vide.</p>}
              {images.length > 0 && (
                <ul className="dc-miniatures">
                  {images.slice(0, MINIATURES_MAX).map((image, i) => {
                    const reste = images.length - MINIATURES_MAX
                    return (
                      <li key={image.url + i} className="dc-miniature">
                        <img src={image.url} alt={image.alt} loading="lazy" />
                        {i === MINIATURES_MAX - 1 && reste > 0 && <span className="dc-miniature-reste">+{reste}</span>}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
            {pointsARetenir.length > 0 && (
              <aside className="dc-retenir">
                <div className="dc-retenir-entete">
                  <span className="dc-retenir-pastille">
                    <Icone svg={iconeAmpoule} className="dc-retenir-icone" />
                  </span>
                  <h3>À retenir</h3>
                </div>
                <ul>
                  {pointsARetenir.map((point) => (
                    <li key={point}>{typo(point)}</li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </SectionRepliable>

        {/* QCM : énoncé et bonnes réponses seulement */}
        <SectionRepliable
          titre="QCM"
          meta={`${questions.length} question${questions.length > 1 ? 's' : ''}`}
          ouverte={sections.qcm}
          onBasculer={() => basculer('qcm')}
        >
          {questions.length === 0 ? (
            <p className="fm-texte">Aucune question.</p>
          ) : (
            <ol className="dc-questions">
              {questions.map((question, i) => (
                <li key={question.id} className="dc-question">
                  <span className="dc-numero">{i + 1}</span>
                  <div className="dc-question-texte">
                    <ContenuMarkdown texte={question.enonce} className="dc-enonce" />
                    {question.reponses
                      .filter((r) => r.est_correcte)
                      .map((r) => (
                        <span key={r.id} className="dc-bonne-reponse">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 6L9 17L4 12" />
                          </svg>
                          {typo(r.texte)}
                        </span>
                      ))}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </SectionRepliable>

        {etapes.length > 0 && (
          <SectionRepliable
            titre="Checklist terrain"
            meta={`${modeChecklist} · ${etapes.length} étape${etapes.length > 1 ? 's' : ''}${
              cours.checklist_mode !== 'reorder' && nbBloquantes > 0 ? ` dont ${nbBloquantes} bloquante${nbBloquantes > 1 ? 's' : ''}` : ''
            }`}
            ouverte={sections.checklist}
            onBasculer={() => basculer('checklist')}
          >
            <ol className="dc-etapes">
              {etapes.map((etape, i) => (
                <li key={etape.id} className="dc-etape">
                  <span className="dc-numero">{i + 1}</span>
                  <ContenuMarkdown texte={etape.intitule} className="dc-etape-intitule" />
                  {etape.bloquante && cours.checklist_mode !== 'reorder' && <span className="fm-pastille fm-pastille-erreur">Bloquante</span>}
                </li>
              ))}
            </ol>
          </SectionRepliable>
        )}
      </div>

      {assignationOuverte && (
        <Modale
          titre="Assigner à des groupes"
          sousTitre="Les élèves des groupes choisis voient le cours dans « De ton formateur »."
          onFermer={() => !assignationEnCours && setAssignationOuverte(false)}
          actions={
            <>
              <button type="button" className="fm-lien-action" onClick={() => setAssignationOuverte(false)} disabled={assignationEnCours}>
                Annuler
              </button>
              <button type="button" className="bouton-primaire" onClick={validerAssignation} disabled={assignationEnCours}>
                {assignationEnCours ? 'Enregistrement…' : 'Valider'}
              </button>
            </>
          }
        >
          {mesGroupes.length === 0 ? (
            <p className="fm-texte">Tu n'as pas encore de groupe.</p>
          ) : (
            <ListeCases
              elements={mesGroupes.map((g) => ({ id: g.id, libelle: g.nom }))}
              choisis={groupesChoisis}
              onBasculer={(id) => setGroupesChoisis((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]))}
            />
          )}
        </Modale>
      )}

      {confirmationSuppression && (
        <ModaleConfirmation
          titre="Supprimer ce cours ?"
          texte="Cette action est irréversible."
          libelleConfirmer="Supprimer"
          enCours={suppression}
          onConfirmer={confirmerSuppression}
          onFermer={() => !suppression && setConfirmationSuppression(false)}
        />
      )}
    </div>
  )
}

export default DetailCoursFormateur
