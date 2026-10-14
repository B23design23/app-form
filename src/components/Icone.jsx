// Icône SVG rendue inline (import `?raw`) : ses tracés en currentColor prennent la couleur
// du texte du parent, ce qu'une balise <img> ne permet pas.
function Icone({ svg, className }) {
  return (
    <span
      className={className ? `icone ${className}` : 'icone'}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default Icone
