import { useEffect } from 'react'
import Icone from './Icone'
import iconeCroix from '../Assets/croix.svg?raw'
import './Modale.css'

// Modale partagée (espaces apprenant et formateur) : carte centrée sur desktop, feuille qui monte
// du bas sur mobile (coins hauts 30 px, poignée). Échap, clic sur le fond et « Fermer » ferment.
function Modale({ titre, sousTitre, onFermer, children, actions, etroite = false }) {
  useEffect(() => {
    const surTouche = (e) => e.key === 'Escape' && onFermer()
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [onFermer])

  return (
    <div className="modale-voile" onClick={onFermer}>
      <div
        className={`modale${etroite ? ' modale-etroite' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={titre}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="modale-poignee" aria-hidden="true" />
        <div className="modale-entete">
          <div className="modale-titres">
            <h2>{titre}</h2>
            {sousTitre && <p>{sousTitre}</p>}
          </div>
          <button type="button" className="modale-fermer" onClick={onFermer} aria-label="Fermer">
            <Icone svg={iconeCroix} className="modale-fermer-icone" />
          </button>
        </div>
        <div className="modale-contenu">{children}</div>
        {actions && <div className="modale-actions">{actions}</div>}
      </div>
    </div>
  )
}

// Confirmation d'une suppression : « Annuler » en bouton secondaire + bouton rouge plein.
export function ModaleConfirmation({ titre, texte, libelleConfirmer = 'Supprimer', enCours = false, onConfirmer, onFermer }) {
  return (
    <Modale
      titre={titre}
      onFermer={onFermer}
      etroite
      actions={
        <>
          <button type="button" className="bouton-secondaire" onClick={onFermer} disabled={enCours}>
            Annuler
          </button>
          <button type="button" className="modale-bouton-danger" onClick={onConfirmer} disabled={enCours}>
            {enCours ? 'Un instant…' : libelleConfirmer}
          </button>
        </>
      }
    >
      {texte && <p className="modale-texte">{texte}</p>}
    </Modale>
  )
}

export default Modale
