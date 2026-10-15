import { useEffect } from 'react'
import Icone from '../Icone'
import iconeCroix from '../../Assets/croix.svg?raw'
import './Formateur.css'

// Modale de l'espace formateur : carte centrée sur desktop, feuille qui monte du bas sur mobile
// (coins hauts 30 px, poignée). Échap et clic sur le fond ferment.
function Modale({ titre, sousTitre, onFermer, children, actions, etroite = false }) {
  useEffect(() => {
    const surTouche = (e) => e.key === 'Escape' && onFermer()
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [onFermer])

  return (
    <div className="fm-voile" onClick={onFermer}>
      <div
        className={`fm-modale${etroite ? ' fm-modale-etroite' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={titre}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="fm-poignee" aria-hidden="true" />
        <div className="fm-modale-entete">
          <div className="fm-modale-titres">
            <h2>{titre}</h2>
            {sousTitre && <p>{sousTitre}</p>}
          </div>
          <button type="button" className="fm-bouton-rond" onClick={onFermer} aria-label="Fermer">
            <Icone svg={iconeCroix} className="fm-bouton-rond-icone" />
          </button>
        </div>
        <div className="fm-modale-contenu">{children}</div>
        {actions && <div className="fm-modale-actions">{actions}</div>}
      </div>
    </div>
  )
}

// Confirmation d'une suppression : « Annuler » + bouton rouge plein.
export function ModaleConfirmation({ titre, texte, libelleConfirmer = 'Supprimer', enCours = false, onConfirmer, onFermer }) {
  return (
    <Modale
      titre={titre}
      onFermer={onFermer}
      etroite
      actions={
        <>
          <button type="button" className="fm-lien-action" onClick={onFermer} disabled={enCours}>
            Annuler
          </button>
          <button type="button" className="fm-bouton-danger" onClick={onConfirmer} disabled={enCours}>
            {enCours ? 'Un instant…' : libelleConfirmer}
          </button>
        </>
      }
    >
      {texte && <p className="fm-texte">{texte}</p>}
    </Modale>
  )
}

export default Modale
