import StatutBadge from '../../components/StatutBadge'
import { contenuCours } from '../../lib/cours'
import { IMAGE_QUIZ_FLASH } from '../../lib/thematiques'
import EnteteFiche from './EnteteFiche'
import { typo } from '../../lib/typographie'

// Récap d'un cours terminé : mention Terminé + XP gagnés, une ligne par partie du cours,
// puis la suite du thème (prochain cours non terminé, ordre pédagogique).
function EcranRecap({
  cours,
  parties,
  minutesLecture,
  meilleur,
  nbEtapes,
  xpGagnes,
  suiteTheme,
  onRelire,
  onRefaireQuiz,
  onRevoirChecklist,
  onOuvrirCours,
  onRetour,
}) {
  const lignes = {
    lecon: { titre: 'Leçon', detail: `${minutesLecture} min de lecture`, action: 'Relire', onClick: onRelire },
    quiz: { titre: 'Quiz', detail: `Meilleur score : ${meilleur}`, action: 'Refaire', onClick: onRefaireQuiz },
    checklist: {
      titre: 'Checklist',
      detail: `${nbEtapes} étape${nbEtapes > 1 ? 's' : ''} validée${nbEtapes > 1 ? 's' : ''}`,
      action: 'Revoir',
      onClick: onRevoirChecklist,
    },
  }

  return (
    <div className="fiche-colonne">
      <EnteteFiche cours={cours} onRetour={onRetour}>
        <div className="fiche-recap-statut">
          <StatutBadge statut="termine" />
          {xpGagnes > 0 && (
            <span className="fiche-recap-xp">
              <img src={IMAGE_QUIZ_FLASH} alt="" />
              {xpGagnes} XP gagnés
            </span>
          )}
        </div>
      </EnteteFiche>

      <ul className="fiche-carte fiche-recap-liste">
        {parties.map((partie) => {
          const ligne = lignes[partie]
          return (
            <li key={partie} className="fiche-recap-ligne">
              <span className="fiche-recap-ligne-texte">
                <span className="fiche-recap-ligne-titre">{ligne.titre}</span>
                <span className="fiche-recap-ligne-detail">{ligne.detail}</span>
              </span>
              <button type="button" className="bouton-secondaire fiche-recap-bouton" onClick={ligne.onClick}>
                {ligne.action}
              </button>
            </li>
          )
        })}
      </ul>

      {suiteTheme && (
        <div className="fiche-suite surface-foncee">
          <span className="fiche-suite-libelle">Suite du thème</span>
          <h2 className="fiche-suite-titre">{typo(suiteTheme.titre)}</h2>
          <span className="fiche-suite-contenu">{contenuCours(suiteTheme)}</span>
          <button type="button" className="bouton-primaire fiche-suite-bouton" onClick={() => onOuvrirCours(suiteTheme.id)}>
            Commencer
          </button>
        </div>
      )}
    </div>
  )
}

export default EcranRecap
