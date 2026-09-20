import StatutBadge from './StatutBadge'
import './CarteCours.css'

// Carte de cours partagée (page détail-thème + résultats de recherche) : titre, tags de
// contenu calculés depuis les données du cours, badge de statut ancré en bas de carte.
function CarteCours({ cours, statut, onClick }) {
  const tags = []
  if (cours.contenu?.trim()) tags.push('Leçon')
  if ((cours.questions?.length ?? 0) > 0) tags.push('Quiz')
  if ((cours.etapes_checklist?.length ?? 0) > 0) tags.push('Checklist')

  return (
    <button type="button" className="carte-cours" onClick={onClick}>
      <div className="carte-cours-corps">
        <span className="carte-cours-titre">{cours.titre}</span>
        {tags.length > 0 && (
          <div className="carte-cours-tags">
            {tags.map((tag) => (
              <span key={tag} className="carte-cours-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="carte-cours-statut">
        <StatutBadge statut={statut} />
      </div>
    </button>
  )
}

export default CarteCours
