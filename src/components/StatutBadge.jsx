import '../styles/espace-layout.css'

// Pastille de statut partagée par toute l'app (règle : docs/design-system/ds-principes-composants.md,
// « Pastille de statut ») : cours pas encore ouvert = pilule (Non commencé, À faire, Nouveau) ;
// cours déjà ouvert = mention sans pilule, icône + mot (En cours avec l'anneau de progression,
// Terminé avec la coche). Le mot porte toujours le statut.
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
      className="statut-badge-icone"
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

// Icône de progression : anneau partiel (piste atténuée + quart d'arc), en currentColor.
function IconeProgression() {
  return (
    <svg
      className="statut-badge-icone"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" opacity="0.28" />
      <path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5" />
    </svg>
  )
}

function StatutBadge({ statut }) {
  return (
    <span className={`pastille statut-badge statut-badge-${statut}`}>
      {statut === 'en_cours' && <IconeProgression />}
      {statut === 'termine' && <IconeCheck />}
      {LABEL_STATUT[statut]}
    </span>
  )
}

export default StatutBadge
