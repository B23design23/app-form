import Icone from './Icone'
import StatutBadge from './StatutBadge'
import { imageTheme } from '../lib/thematiques'
import iconeChevron from '../Assets/chevron-right.svg?raw'
import './LigneCours.css'
import { typo } from '../lib/typographie'
import { useStatutSousTitre } from './useStatutSousTitre'

// Liste de cours en lignes dans une carte blanche (Mode terrain, résultats de recherche de Cours) :
// vignette crème + objet du thème, titre, sous-ligne, statut optionnel, chevron. Desktop :
// 2 colonnes, contenu des lignes aligné en haut.
export function ListeCours({ children }) {
  return <ul className="carte carte-liste liste-cours">{children}</ul>
}

export function LigneCours({ cours, meta, statut, onClick }) {
  const ref = useStatutSousTitre('.ligne-cours-titre', cours.titre)
  return (
    <li>
      <button ref={ref} type="button" className="ligne-liste ligne-cours" onClick={onClick}>
        <span className="vignette-theme ligne-cours-vignette">
          <img src={imageTheme(cours.categorie)} alt="" />
        </span>
        <span className="ligne-cours-texte">
          <span className="ligne-cours-titre">{typo(cours.titre)}</span>
          <span className="ligne-cours-meta">{meta}</span>
        </span>
        {statut && (
          <span className="ligne-cours-statut">
            <StatutBadge statut={statut} />
          </span>
        )}
        <Icone svg={iconeChevron} className="chevron-ligne ligne-cours-chevron" />
      </button>
    </li>
  )
}
