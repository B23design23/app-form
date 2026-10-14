import '../styles/espace-layout.css'

// Pastille de statut partagée par toute l'app (une seule règle, voir CLAUDE.md) :
// Non commencé / À faire = neutre, Nouveau = orange, En cours = violet plein,
// Terminé = mention sans fond (coche + mot, en vert). Pas de point avant le texte : la couleur
// et le mot suffisent.
const LABEL_STATUT = {
  non_commence: 'Non commencé',
  a_faire: 'À faire',
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  termine: 'Terminé',
}

// Même tracé que Assets/check.svg, inliné pour hériter la couleur via currentColor.
function IconeCheck() {
  return (
    <svg
      className="statut-badge-coche"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17L4 12" />
    </svg>
  )
}

function StatutBadge({ statut }) {
  return (
    <span className={`statut-badge statut-badge-${statut}`}>
      {statut === 'termine' && <IconeCheck />}
      {LABEL_STATUT[statut]}
    </span>
  )
}

export default StatutBadge
