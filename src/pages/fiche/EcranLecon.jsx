import ContenuMarkdown from '../../components/ContenuMarkdown'
import ReperEtapes from '../../components/ReperEtapes'
import Icone from '../../components/Icone'
import iconeAmpoule from '../../Assets/ampoule.svg?raw'
import EnteteFiche from './EnteteFiche'
import CarteEtapeSuivante from './CarteEtapeSuivante'

function EcranLecon({
  cours,
  reper,
  minutesLecture,
  etapeSuivante,
  coursComplet,
  sansQuizNiChecklist,
  coursTermine,
  onTerminerCours,
  onVoirRecap,
  libelleRetour,
  onRetour,
}) {
  const pointsARetenir = (cours.a_retenir ?? '')
    .split('\n')
    .map((ligne) => ligne.trim())
    .filter(Boolean)

  return (
    <div className="fiche-colonne">
      <EnteteFiche cours={cours} sousTitre={`${minutesLecture} min de lecture`} libelleRetour={libelleRetour} onRetour={onRetour}>
        {reper && <ReperEtapes etapes={reper} />}
      </EnteteFiche>

      <article className="carte fiche-lecon">
        <ContenuMarkdown texte={cours.contenu} className="fiche-lecon-contenu" roleTypo="texte-lecture" />

        {pointsARetenir.length > 0 && (
          <aside className="fiche-retenir">
            <div className="fiche-retenir-entete">
              <span className="fiche-retenir-pastille">
                <Icone svg={iconeAmpoule} className="fiche-retenir-icone" />
              </span>
              <h2 className="titre-section">À retenir</h2>
            </div>
            <ul>
              {pointsARetenir.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </aside>
        )}
      </article>

      {etapeSuivante && <CarteEtapeSuivante etape={etapeSuivante} />}

      {sansQuizNiChecklist && !coursTermine && (
        <button type="button" className="bouton-primaire fiche-bouton-large" onClick={onTerminerCours}>
          Terminer le cours
        </button>
      )}

      {!etapeSuivante && coursComplet && (
        <CarteEtapeSuivante
          etape={{
            libelle: 'Cours terminé',
            titre: 'Tu as tout bouclé',
            detail: 'Score, checklist et cours suivant',
            bouton: 'Voir le récap',
            onClick: onVoirRecap,
          }}
        />
      )}
    </div>
  )
}

export default EcranLecon
