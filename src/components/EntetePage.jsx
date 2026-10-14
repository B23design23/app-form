import './EntetePage.css'

// En-tête lavande des pages Cours et Terrain : titre (H1), sous-titre, objet 3D en haut à droite
// (dans le cadre, sans débord ni ombre) et contenu optionnel (ex. recherche).
function EntetePage({ titre, sousTitre, image, variante, children }) {
  return (
    <div className={`entete-page${variante ? ` entete-page-${variante}` : ''}`}>
      <img className="entete-page-objet" src={image} alt="" />
      <div className="entete-page-texte">
        <h1>{titre}</h1>
        {sousTitre && <p className="entete-page-sous-titre">{sousTitre}</p>}
      </div>
      {children}
    </div>
  )
}

export default EntetePage
