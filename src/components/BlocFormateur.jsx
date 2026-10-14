import Icone from './Icone'
import StatutBadge from './StatutBadge'
import { imageTheme } from '../lib/thematiques'
import iconeFormateur from '../Assets/graduation.svg?raw'
import iconeChevron from '../Assets/chevron-right.svg?raw'
import './BlocFormateur.css'
import { typo } from '../lib/typographie'

// Bloc « De ton formateur » partagé : dashboard apprenant (cours à faire, lien « Tout voir ») et
// page Cours (bibliothèque complète, compteur, chevrons, 3 colonnes sur desktop).
// `lignes` : [{ cours, statut }] déjà triées ; `actionEntete` : élément affiché à droite du titre.
function BlocFormateur({ id, lignes, actionEntete, avecChevron = false, grille = false, onOuvrirCours }) {
  return (
    <div id={id} className={`bloc-formateur${grille ? ' bloc-formateur-grille' : ''}`}>
      <div className="bloc-formateur-entete">
        <span className="bloc-formateur-pastille">
          <Icone svg={iconeFormateur} className="bloc-formateur-pastille-icone" />
        </span>
        <h2>De ton formateur</h2>
        {actionEntete}
      </div>
      <ul className="bloc-formateur-liste">
        {lignes.map(({ cours, statut }) => (
          <li key={cours.id}>
            <button type="button" className="bloc-formateur-ligne" onClick={() => onOuvrirCours(cours.id)}>
              <span className="vignette-theme">
                <img src={imageTheme(cours.categorie)} alt="" />
              </span>
              <span className="bloc-formateur-texte">
                <span className="bloc-formateur-titre">{typo(cours.titre)}</span>
                <StatutBadge statut={statut} />
              </span>
              {avecChevron && <Icone svg={iconeChevron} className="chevron-ligne" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlocFormateur
