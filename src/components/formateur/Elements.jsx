import Icone from '../Icone'
import iconeRetour from '../../Assets/chevron-left.svg?raw'
import { typo } from '../../lib/typographie'
import './Formateur.css'

// Retour de l'espace formateur : variante Retour du Bouton. Pilule blanche, chevron et libellé du
// niveau du dessus (« Mes cours », « Mes groupes ») ; chevron seul sous 768 px. Le nom accessible
// contient le libellé visible.
export function RetourFormateur({ libelle, onRetour }) {
  return (
    <button type="button" className="bouton-retour fm-retour" onClick={onRetour} aria-label={`Retour à ${libelle}`}>
      <Icone svg={iconeRetour} className="bouton-retour-icone" />
      <span className="fm-retour-libelle">{libelle}</span>
    </button>
  )
}

// Pastille de groupe (lavande) ou « Non assigné » (neutre).
export function PastillesGroupes({ groupes }) {
  if (!groupes || groupes.length === 0) return <span className="pastille fm-pastille-neutre">Non assigné</span>
  return groupes.map((g) => (
    <span key={g.id ?? g.nom} className="pastille fm-pastille-groupe">
      {typo(g.nom)}
    </span>
  ))
}

// Barre de progression fine (piste neutre, remplissage violet).
export function BarreFine({ ratio }) {
  return (
    <span className="fm-barre" aria-hidden="true">
      <span className="fm-barre-remplissage" style={{ width: `${Math.round((ratio ?? 0) * 100)}%` }} />
    </span>
  )
}

// Choix multiples dans une modale (cours à assigner, groupes) : une case par élément.
export function ListeCases({ elements, choisis, onBasculer }) {
  return (
    <ul className="fm-cases">
      {elements.map((el) => {
        const choisi = choisis.includes(el.id)
        return (
          <li key={el.id}>
            <label className={`fm-case${choisi ? ' fm-case-choisie' : ''}`}>
              <input type="checkbox" checked={choisi} onChange={() => onBasculer(el.id)} />
              <span className="fm-case-repere" aria-hidden="true">
                {choisi && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17L4 12" />
                  </svg>
                )}
              </span>
              <span className="fm-case-texte">
                <span className="fm-case-libelle">{typo(el.libelle)}</span>
                {el.detail && <span className="fm-case-detail">{el.detail}</span>}
              </span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}
