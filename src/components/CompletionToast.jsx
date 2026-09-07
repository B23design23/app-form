import { iconeBadge } from '../lib/badges'
import Confetti from './Confetti'
import './CompletionToast.css'

// Règle d'intensité des confettis par type d'événement (overlay.type) :
// - 'quiz' (quiz de cours ou quiz flash) : à partir de 60% seulement, intensité croissante
//   avec le score ; en dessous de 60%, un badge débloqué déclenche quand même une salve
//   moyenne (le badge mérite sa célébration même si le quiz en lui-même était raté).
// - 'checklist' : toujours une salve moyenne, peu importe le mode de validation (checkbox
//   ou reorder) — on se branche sur l'événement de complétion, pas sur le mode.
// - 'badge' (ou overlay sans type, ex. badge débloqué à l'entrée du cours) : salve moyenne
//   uniquement si un badge est effectivement présent.
function calculerIntensiteConfetti(overlay) {
  if (!overlay) return 0

  const aBadge = (overlay.badges ?? []).length > 0

  if (overlay.type === 'quiz') {
    const score = overlay.score ?? 0
    if (score >= 95) return 65
    if (score >= 80) return 45
    if (score >= 60) return 30
    return aBadge ? 45 : 0
  }

  if (overlay.type === 'checklist') {
    return 45
  }

  return aBadge ? 45 : 0
}

function CompletionToast({ overlay, onFermer }) {
  const aUnBadge = (overlay?.badges ?? []).length > 0
  const intensiteConfetti = calculerIntensiteConfetti(overlay)

  return (
    <>
      {/* Rendu inconditionnellement : le confetti gère sa propre durée de vie (~1,7s max),
          indépendante du toast qui peut rester affiché plus longtemps ou être fermé plus tôt. */}
      <Confetti declencheur={overlay} nbPieces={intensiteConfetti} />

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
              {iconeBadge(badge.icone)} Badge débloqué : {badge.nom}
            </span>
          ))}
        </div>
      )}
    </>
  )
}

export default CompletionToast
