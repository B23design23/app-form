import Icone from './Icone'
import iconeRetour from '../Assets/chevron-left.svg?raw'

// Bouton Retour (ds-principes-composants.md, Bouton, variante Retour), le même dans tous les états
// d'une page (chargement, erreur, vide compris). Nom accessible « Retour à <libellé> », libellé = nom
// d'écran de la destination. Pilule seule sur sa rangée (chevron seul sous 768 px) ; rond quand il
// partage sa rangée (logo, progression, titre, œil). `nom` : seulement pour un rond qui n'est pas un
// Retour (« Se déconnecter »). Sans `onRetour` (page de niveau 0) : emplacement vide et invisible,
// de même taille, pour que la rangée ne bouge pas.
function Retour({ libelle, onRetour, rond = false, nom = `Retour à ${libelle}`, className = '', classeIcone = 'bouton-rond-icone' }) {
  const forme = rond ? 'bouton-rond' : 'bouton-retour'
  if (!onRetour) return <span className={`${forme} retour-vide ${className}`} aria-hidden="true" />
  return (
    <button type="button" className={`${forme} ${className}`} onClick={onRetour} aria-label={nom}>
      <Icone svg={iconeRetour} className={rond ? classeIcone : 'bouton-retour-icone'} />
      {!rond && <span className="bouton-retour-libelle">{libelle}</span>}
    </button>
  )
}

export default Retour
