import Icone from '../../components/Icone'
import { imageTheme, libelleCourtTheme } from '../../lib/thematiques'
import iconeRetour from '../../Assets/chevron-left.svg?raw'
import { typo } from '../../lib/typographie'

// Bouton retour (nom court du thème) + en-tête lavande de la leçon et du récap : objet du thème
// dans le cadre, thème complet, titre du cours, puis contenu libre (repère, mention Terminé…).
function EnteteFiche({ cours, sousTitre, onRetour, children }) {
  return (
    <>
      <button type="button" className="fiche-retour" onClick={onRetour}>
        <Icone svg={iconeRetour} className="fiche-retour-icone" />
        {libelleCourtTheme(cours.categorie)}
      </button>
      <div className="fiche-entete">
        <img className="fiche-entete-objet" src={imageTheme(cours.categorie)} alt="" />
        <span className="fiche-entete-theme">{cours.categorie}</span>
        <h1 className="fiche-entete-titre">{typo(cours.titre)}</h1>
        {sousTitre && <p className="fiche-entete-sous-titre">{sousTitre}</p>}
        {children}
      </div>
    </>
  )
}

export default EnteteFiche
