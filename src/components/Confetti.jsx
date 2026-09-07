import { useEffect, useState } from 'react'
import './Confetti.css'

const COULEURS = ['#6C4FF6', '#FF7A45', '#FFC93C', '#1E7A4C']
const NB_PIECES_DEFAUT = 40
const DUREE_MIN = 1200
const DUREE_MAX = 1700

function genererPieces(nbPieces) {
  return Array.from({ length: nbPieces }, (_, i) => {
    const rotationDepart = Math.random() * 360
    return {
      id: i,
      gauche: Math.random() * 100,
      taille: 6 + Math.random() * 6,
      couleur: COULEURS[Math.floor(Math.random() * COULEURS.length)],
      forme: Math.random() < 0.5 ? 'carre' : 'cercle',
      duree: DUREE_MIN + Math.random() * (DUREE_MAX - DUREE_MIN),
      delai: Math.random() * 200,
      rotationDepart,
      rotationFin: rotationDepart + (Math.random() * 720 - 360),
      derive: Math.round((Math.random() - 0.5) * 120),
    }
  })
}

// Se déclenche à chaque nouvelle référence de `declencheur` (typiquement l'objet overlay
// du toast de complétion) — une vraie fin de cours/quiz/checklist, jamais par question.
// `nbPieces` module l'intensité (voir CompletionToast pour la règle par type d'événement) ;
// 0 (ou omis avec un déclencheur falsy) ne produit aucune pièce.
function Confetti({ declencheur, nbPieces = NB_PIECES_DEFAUT }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!declencheur || nbPieces <= 0) return

    const nouvellesPieces = genererPieces(nbPieces)
    setPieces(nouvellesPieces)

    const dureeMax = Math.max(...nouvellesPieces.map((p) => p.delai + p.duree))
    const minuteur = setTimeout(() => setPieces([]), dureeMax + 50)
    return () => clearTimeout(minuteur)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [declencheur])

  if (pieces.length === 0) return null

  return (
    <div className="confetti-conteneur" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`confetti-piece confetti-piece-${p.forme}`}
          style={{
            left: `${p.gauche}%`,
            width: `${p.taille}px`,
            height: `${p.taille}px`,
            backgroundColor: p.couleur,
            animationDuration: `${p.duree}ms`,
            animationDelay: `${p.delai}ms`,
            '--rotation-depart': `${p.rotationDepart}deg`,
            '--rotation-fin': `${p.rotationFin}deg`,
            '--derive': `${p.derive}px`,
          }}
        />
      ))}
    </div>
  )
}

export default Confetti
