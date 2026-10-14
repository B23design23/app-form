import { iconeBadge } from '../lib/badges'
import { ConfettiPastilles, calculerIntensiteConfetti } from './Confetti'
import './CompletionToast.css'

function CompletionToast({ overlay, onFermer }) {
  const aUnBadge = (overlay?.badges ?? []).length > 0
  const intensiteConfetti = calculerIntensiteConfetti(overlay)

  return (
    <>
      {/* Même animation que la fin de quiz (« pastilles et anneaux »), une salve depuis le centre de
          l'écran ; rendue inconditionnellement, elle gère sa propre durée de vie (~2,5 s). */}
      <ConfettiPastilles
        declencheur={overlay}
        salves={intensiteConfetti > 0 ? [{ nb: intensiteConfetti, delai: 0 }] : []}
      />

      {overlay && (
        <div
          className={`completion-toast${aUnBadge ? ' completion-toast-avec-badge' : ''}`}
          role="status"
          onClick={onFermer}
        >
          <div className="completion-toast-ligne">
            <span className="completion-toast-titre">{overlay.titre}</span>
            {overlay.xp != null && <span className="completion-toast-xp">+{overlay.xp} XP</span>}
          </div>
          {(overlay.badges ?? []).map((badge) => (
            <span key={badge.id} className="completion-toast-badge">
              <img className="completion-toast-badge-icone" src={iconeBadge(badge)} alt="" />
              Badge débloqué : {badge.nom}
            </span>
          ))}
        </div>
      )}
    </>
  )
}

export default CompletionToast
