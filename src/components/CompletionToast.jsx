import { iconeBadge } from '../lib/badges'
import './CompletionToast.css'

function CompletionToast({ overlay, onFermer }) {
  if (!overlay) return null

  return (
    <div className="completion-toast" role="status" onClick={onFermer}>
      <div className="completion-toast-ligne">
        <span className="completion-toast-titre">{overlay.titre}</span>
        {overlay.xp != null && <span className="completion-toast-xp">+{overlay.xp} XP</span>}
      </div>
      {(overlay.badges ?? []).map((badge) => (
        <span key={badge.id} className="completion-toast-badge">
          {iconeBadge(badge.icone)} Badge débloqué : {badge.nom}
        </span>
      ))}
    </div>
  )
}

export default CompletionToast
