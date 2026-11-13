import './AnneauProgression.css'

// Anneau de progression (fiche Anneau, ds-principes-composants.md) : une seule implémentation.
// La taille et l'épaisseur de piste viennent du CSS (--anneau-taille, --anneau-piste) : 108 px sous
// 768, 120 px au-dessus, piste de 10 px à toutes les tailles. Le SVG n'a pas de viewBox : le rayon
// se calcule en px (50 % − la moitié de la piste) et pathLength="100" exprime l'arc en pourcentage.
// `className` ajoute une classe de l'écran (position, exception de taille de la fin de quiz).
function AnneauProgression({
  ratio = 0,
  afficherTrait = true,
  trackColor = 'var(--fond-accent)',
  progressColor = 'var(--fond-marque)',
  className = '',
  children,
}) {
  return (
    <div className={`anneau-progression${className ? ` ${className}` : ''}`}>
      <svg className="anneau-progression-svg" aria-hidden="true">
        <circle cx="50%" cy="50%" stroke={trackColor} fill="none" />
        {afficherTrait && (
          <circle
            className="anneau-progression-arc"
            cx="50%"
            cy="50%"
            stroke={progressColor}
            fill="none"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 * (1 - ratio)}
            strokeLinecap="round"
          />
        )}
      </svg>
      {children}
    </div>
  )
}

export default AnneauProgression
