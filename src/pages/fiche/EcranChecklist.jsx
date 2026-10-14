import ContenuMarkdown from '../../components/ContenuMarkdown'
import ReperEtapes from '../../components/ReperEtapes'
import Icone from '../../components/Icone'
import iconeRetour from '../../Assets/chevron-left.svg?raw'
import iconePasser from '../../Assets/fleche-passer.svg?raw'
import CarteEtapeSuivante from './CarteEtapeSuivante'
import '../../styles/quiz.css'
import { typo } from '../../lib/typographie'

function Coche() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17L4 12" />
    </svg>
  )
}

// Checklist : en-tête compact, repère d'étapes, carte de progression, puis la liste.
// Mode case à cocher : les étapes se valident dans l'ordre (faites / en cours / à venir) ; une étape
// non bloquante peut être passée (pastille contour + flèche), une étape bloquante non.
// Mode remise en ordre : mécanique inchangée (sera maquetté plus tard).
function EcranChecklist({
  cours,
  etapes,
  reper,
  etapesValidees,
  etapesPassees,
  checklistFaite,
  ordreApprenant,
  feedbackOrdre,
  etapeSuivante,
  onValiderEtape,
  onPasserEtape,
  onDeplacer,
  onValiderOrdre,
  onRetour,
}) {
  const traitee = (e) => etapesValidees.includes(e.id) || etapesPassees.includes(e.id)
  const nbFaites = checklistFaite ? etapes.length : etapes.filter(traitee).length
  const indexCourante = checklistFaite ? -1 : etapes.findIndex((e) => !traitee(e))
  const modeReorder = cours.checklist_mode === 'reorder'

  return (
    <div className="fiche-colonne fiche-checklist">
      <div className="fiche-checklist-entete">
        <button type="button" className="fiche-bouton-rond fiche-bouton-rond-44" onClick={onRetour} aria-label="Retour">
          <Icone svg={iconeRetour} className="fiche-bouton-rond-icone" />
        </button>
        <div className="fiche-checklist-entete-texte">
          <span className="fiche-checklist-theme">{cours.categorie}</span>
          <h1 className="fiche-checklist-titre">{typo(cours.titre)}</h1>
        </div>
      </div>

      {reper && <ReperEtapes etapes={reper} />}

      <div className="fiche-carte fiche-checklist-progression">
        <div className="fiche-checklist-progression-ligne">
          <span className="fiche-checklist-compte">
            {nbFaites} étape{nbFaites > 1 ? 's' : ''} sur {etapes.length}
          </span>
          <span className="fiche-checklist-xp">{checklistFaite ? 'Checklist terminée' : '+15 XP à la fin'}</span>
        </div>
        <span className="fiche-barre fiche-barre-fine">
          <span className="fiche-barre-remplissage" style={{ width: `${(nbFaites / etapes.length) * 100}%` }} />
        </span>
      </div>

      {modeReorder ? (
        <div className="fiche-carte fiche-checklist-liste-carte">
          <p className="fiche-checklist-consigne">Remets les étapes dans le bon ordre, puis valide.</p>
          <ol className="fiche-checklist-liste">
            {ordreApprenant.map((etapeId, index) => {
              const etape = etapes.find((e) => e.id === etapeId)
              if (!etape) return null
              return (
                <li key={etape.id} className="fiche-etape fiche-etape-reorder">
                  <span className="fiche-etape-pastille fiche-etape-pastille-a-venir">{index + 1}</span>
                  <ContenuMarkdown texte={etape.intitule} className="fiche-etape-intitule" />
                  <span className="fiche-etape-fleches">
                    <button
                      type="button"
                      className="fiche-etape-fleche"
                      disabled={checklistFaite || index === 0}
                      onClick={() => onDeplacer(index, -1)}
                      aria-label="Monter"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="fiche-etape-fleche"
                      disabled={checklistFaite || index === ordreApprenant.length - 1}
                      onClick={() => onDeplacer(index, 1)}
                      aria-label="Descendre"
                    >
                      ↓
                    </button>
                  </span>
                </li>
              )
            })}
          </ol>
          {feedbackOrdre && (
            <p className={`quiz-feedback ${feedbackOrdre === 'correct' ? 'quiz-feedback-correcte' : 'quiz-feedback-fausse'}`}>
              {feedbackOrdre === 'correct' ? 'Bon ordre !' : "Ce n'est pas encore le bon ordre, réessaie."}
            </p>
          )}
          {!checklistFaite && (
            <button type="button" className="bouton-primaire fiche-bouton-large" onClick={onValiderOrdre}>
              Valider l'ordre
            </button>
          )}
        </div>
      ) : (
        <div className="fiche-carte fiche-checklist-liste-carte">
          <ol className="fiche-checklist-liste">
            {etapes.map((etape, index) => {
              const faite = checklistFaite || etapesValidees.includes(etape.id)
              const courante = index === indexCourante
              if (courante) {
                return (
                  <li key={etape.id} className="fiche-etape fiche-etape-courante" aria-current="step">
                    <span className="fiche-etape-pastille fiche-etape-pastille-courante">{index + 1}</span>
                    <div className="fiche-etape-corps">
                      <ContenuMarkdown texte={etape.intitule} className="fiche-etape-intitule" />
                      {etape.bloquante && <span className="fiche-etape-bloquante">Bloquante</span>}
                      {etape.critere_validation && <p className="fiche-etape-critere">{typo(etape.critere_validation)}</p>}
                      <button type="button" className="bouton-primaire fiche-bouton-large" onClick={() => onValiderEtape(etape.id)}>
                        Valider l'étape
                      </button>
                      {!etape.bloquante && (
                        <button type="button" className="fiche-etape-passer" onClick={() => onPasserEtape(etape.id)}>
                          Passer cette étape
                        </button>
                      )}
                    </div>
                  </li>
                )
              }
              const passee = !checklistFaite && etapesPassees.includes(etape.id)
              if (passee) {
                return (
                  <li key={etape.id} className="fiche-etape fiche-etape-faite">
                    <span className="fiche-etape-pastille fiche-etape-pastille-passee" aria-label="Étape passée">
                      <Icone svg={iconePasser} className="fiche-etape-pastille-icone" />
                    </span>
                    <ContenuMarkdown texte={etape.intitule} className="fiche-etape-intitule" />
                  </li>
                )
              }
              return (
                <li key={etape.id} className={`fiche-etape ${faite ? 'fiche-etape-faite' : 'fiche-etape-a-venir'}`}>
                  <span className={`fiche-etape-pastille fiche-etape-pastille-${faite ? 'faite' : 'a-venir'}`}>
                    {faite ? <Coche /> : index + 1}
                  </span>
                  <ContenuMarkdown texte={etape.intitule} className="fiche-etape-intitule" />
                </li>
              )
            })}
          </ol>
        </div>
      )}

      {etapeSuivante && <CarteEtapeSuivante etape={etapeSuivante} />}
    </div>
  )
}

export default EcranChecklist
