import { useEffect, useRef } from 'react'
import Icone from './Icone'
import iconeCroix from '../Assets/croix.svg?raw'
import './Modale.css'

// Modale partagée (espaces apprenant et formateur) : carte centrée sur desktop, feuille qui monte
// du bas sur mobile (coins hauts 30 px, poignée). Échap, clic sur le fond et « Fermer » ferment.
// refFocusInitial : élément qui reçoit le focus à l'ouverture ; piegerFocus : Tab reste dans la modale.
const SELECTEUR_FOCUSABLE = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

function Modale({ titre, sousTitre, onFermer, children, actions, etroite = false, refFocusInitial, piegerFocus = false }) {
  const refModale = useRef(null)

  useEffect(() => {
    const surTouche = (e) => e.key === 'Escape' && onFermer()
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [onFermer])

  useEffect(() => {
    refFocusInitial?.current?.focus()
  }, [refFocusInitial])

  function surToucheModale(e) {
    if (!piegerFocus || e.key !== 'Tab') return
    const focusables = [...refModale.current.querySelectorAll(SELECTEUR_FOCUSABLE)]
    if (focusables.length === 0) return
    const premier = focusables[0]
    const dernier = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === premier) {
      e.preventDefault()
      dernier.focus()
    } else if (!e.shiftKey && document.activeElement === dernier) {
      e.preventDefault()
      premier.focus()
    }
  }

  return (
    <div className="modale-voile" onClick={onFermer}>
      <div
        ref={refModale}
        className={`modale${etroite ? ' modale-etroite' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={titre}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={surToucheModale}
      >
        <span className="modale-poignee" aria-hidden="true" />
        <div className="modale-entete">
          <div className="modale-titres">
            <h2>{titre}</h2>
            {sousTitre && <p>{sousTitre}</p>}
          </div>
          <button type="button" className="bouton-rond" onClick={onFermer} aria-label="Fermer">
            <Icone svg={iconeCroix} className="bouton-rond-icone" />
          </button>
        </div>
        <div className="modale-contenu">{children}</div>
        {actions && <div className="modale-actions">{actions}</div>}
      </div>
    </div>
  )
}

// Confirmation d'une action qu'on ne peut plus retrouver : « Annuler » en bouton secondaire + bouton
// rouge plein. libelleConfirmer (obligatoire) nomme le verbe et l'objet (« Supprimer le cours »).
// À l'ouverture, le focus va sur Annuler ; Tab reste dans la modale ; Échap la ferme.
export function ModaleConfirmation({ titre, texte, libelleConfirmer, enCours = false, onConfirmer, onFermer }) {
  const refAnnuler = useRef(null)

  return (
    <Modale
      titre={titre}
      onFermer={onFermer}
      etroite
      refFocusInitial={refAnnuler}
      piegerFocus
      actions={
        <>
          <button ref={refAnnuler} type="button" className="bouton-secondaire" onClick={onFermer} disabled={enCours}>
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
