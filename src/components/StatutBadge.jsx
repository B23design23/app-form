import '../styles/espace-layout.css'

const LABEL_STATUT = {
  non_commence: 'Non commencé',
  en_cours: 'En cours',
  termine: 'Terminé',
}

// Même tracé que Assets/check.svg, inliné pour hériter la couleur du badge via currentColor
// (un <img src> ne le permettrait pas).
function IconeCheck() {
  return (
    <svg
      width="11"
      height="11"
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
      {statut === 'termine' ? <IconeCheck /> : <span className="statut-badge-pastille" aria-hidden="true" />}
      {LABEL_STATUT[statut]}
    </span>
  )
}

export default StatutBadge
