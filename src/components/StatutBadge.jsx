import '../styles/espace-layout.css'

const LABEL_STATUT = {
  non_commence: 'Non commencé',
  en_cours: 'En cours',
  termine: 'Terminé',
}

function StatutBadge({ statut }) {
  return (
    <span className={`statut-badge statut-badge-${statut}`}>
      {statut === 'termine' ? (
        <span aria-hidden="true">✓</span>
      ) : (
        <span className="statut-badge-pastille" aria-hidden="true" />
      )}
      {LABEL_STATUT[statut]}
    </span>
  )
}

export default StatutBadge
