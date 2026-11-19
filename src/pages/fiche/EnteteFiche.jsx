import Retour from '../../components/Retour'
import { imageTheme } from '../../lib/thematiques'
import { typo } from '../../lib/typographie'

// Retour (libellé = nom d'écran de l'origine de la fiche) + en-tête lavande de la leçon et du récap :
// objet du thème dans le cadre, thème complet, titre du cours, puis contenu libre (repère, Terminé…).
function EnteteFiche({ cours, sousTitre, libelleRetour, onRetour, children }) {
  return (
    <>
      <Retour libelle={libelleRetour} onRetour={onRetour} />
      <div className="fiche-entete">
        <img className="fiche-entete-objet" src={imageTheme(cours.categorie)} alt="" />
        <span className="fiche-entete-theme">{cours.categorie}</span>
        <h1 className="titre-contenu fiche-entete-titre">{typo(cours.titre)}</h1>
        {sousTitre && <p className="fiche-entete-sous-titre">{sousTitre}</p>}
        {children}
      </div>
    </>
  )
}

export default EnteteFiche
