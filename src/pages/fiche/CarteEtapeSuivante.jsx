import Icone from '../../components/Icone'
import iconeFleche from '../../Assets/arrow-right.svg?raw'

// Carte encre « Étape suivante » en bas de la leçon (ou de la checklist si le quiz reste à faire).
// etape.libelle remplace le petit libellé (ex. « Cours terminé » sur la leçon d'un cours bouclé).
function CarteEtapeSuivante({ etape }) {
  return (
    <div className="fiche-suivante">
      <div className="fiche-suivante-texte">
        <span className="fiche-suivante-libelle">{etape.libelle ?? 'Étape suivante'}</span>
        <h2 className="fiche-suivante-titre">{etape.titre}</h2>
        <span className="fiche-suivante-detail">{etape.detail}</span>
      </div>
      <button type="button" className="fiche-bouton-blanc" onClick={etape.onClick}>
        {etape.bouton}
        <span className="fiche-bouton-blanc-rond">
          <Icone svg={iconeFleche} className="fiche-bouton-blanc-icone" />
        </span>
      </button>
    </div>
  )
}

export default CarteEtapeSuivante
