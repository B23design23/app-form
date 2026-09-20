import './AnneauProgression.css'

// Composant générique, extrait de l'anneau du Dashboard apprenant. `size` fixe à la fois la
// taille affichée (px) et le viewBox du SVG, donc strokeWidth/radius s'expriment directement en px.
function AnneauProgression({
  size,
  radius = 42,
  strokeWidth = 9,
  ratio = 0,
  afficherTrait = true,
  trackColor = 'var(--color-anneau-fond)',
  progressColor = 'var(--color-primary)',
  wrapperClassName = 'anneau-progression',
  svgClassName = 'anneau-progression-svg',
  children,
}) {
  const viewBoxSize = size ?? radius * 2 + strokeWidth
  const centre = viewBoxSize / 2
  const circonference = 2 * Math.PI * radius

  return (
    <div className={wrapperClassName} style={size ? { width: size, height: size } : undefined}>
      <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className={svgClassName} aria-hidden="true">
        <circle cx={centre} cy={centre} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        {afficherTrait && (
          <circle
            cx={centre}
            cy={centre}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circonference}
            strokeDashoffset={circonference * (1 - ratio)}
            strokeLinecap="round"
            transform={`rotate(-90 ${centre} ${centre})`}
          />
        )}
      </svg>
      {children}
    </div>
  )
}

export default AnneauProgression
