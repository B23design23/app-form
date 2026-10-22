import { useEffect, useRef, useState } from 'react'
import Icone from '../Icone'
import iconePoints from '../../Assets/points.svg?raw'
import './Formateur.css'

// Menu « … » de l'espace formateur : bouton rond 40 px ; carte flottante sur desktop, feuille
// depuis le bas sur mobile (titre = nom de l'élément). Action destructrice en rouge, en dernier.
// Clavier : Entrée ou Espace sur le bouton ouvre le menu et place le focus sur la première action ;
// les flèches passent d'une action à l'autre ; Échap ferme le menu et rend le focus au bouton ;
// Tab et Maj+Tab ne passent pas d'une action à l'autre (actions hors de l'ordre de tabulation) : depuis
// une action, ils ferment le menu et placent le focus sur l'élément suivant (ou précédent) de la page.
// actions : [{ libelle, onClick, danger }]
const SELECTEUR_TABULABLE =
  'a[href], button:not(:disabled), input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

// Élément tabulable de la page juste après (ou juste avant) le menu, dans l'ordre du document.
function voisinTabulable(menu, versLAvant) {
  const tabulables = [...document.querySelectorAll(SELECTEUR_TABULABLE)].filter(
    (el) => !menu.contains(el) && el.tabIndex >= 0 && el.getClientRects().length > 0
  )
  if (versLAvant) return tabulables.find((el) => menu.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
  return tabulables.reverse().find((el) => menu.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING)
}

function MenuActions({ titre, actions, label = 'Plus d’actions' }) {
  const [ouvert, setOuvert] = useState(false)
  const refConteneur = useRef(null)
  const refBouton = useRef(null)
  const refsActions = useRef([])
  const refMenu = useRef(null)

  useEffect(() => {
    if (!ouvert) return
    refsActions.current[0]?.focus()
    const surTouche = (e) => {
      if (e.key !== 'Escape') return
      setOuvert(false)
      refBouton.current?.focus()
    }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [ouvert])

  function surToucheMenu(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const cible = voisinTabulable(refMenu.current, !e.shiftKey) ?? refBouton.current
      setOuvert(false)
      cible?.focus()
      return
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const items = refsActions.current.filter(Boolean)
    const index = items.indexOf(document.activeElement)
    const pas = e.key === 'ArrowDown' ? 1 : -1
    items[(index + pas + items.length) % items.length]?.focus()
  }

  return (
    <div className="fm-menu" ref={refConteneur}>
      <button
        ref={refBouton}
        type="button"
        className="fm-bouton-rond fm-bouton-rond-40"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={ouvert}
        onClick={() => setOuvert((v) => !v)}
      >
        <Icone svg={iconePoints} className="fm-bouton-rond-icone" />
      </button>
      {ouvert && (
        <>
          <div className="fm-menu-voile" onClick={() => setOuvert(false)} />
          <div ref={refMenu} className="fm-menu-carte" role="menu" onKeyDown={surToucheMenu}>
            <span className="fm-poignee" aria-hidden="true" />
            {titre && <p className="fm-menu-titre">{titre}</p>}
            {actions.map((action, index) => (
              <button
                key={action.libelle}
                ref={(el) => (refsActions.current[index] = el)}
                tabIndex={-1}
                type="button"
                role="menuitem"
                className={`fm-menu-item${action.danger ? ' fm-menu-item-danger' : ''}`}
                onClick={() => {
                  setOuvert(false)
                  action.onClick()
                }}
              >
                {action.libelle}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default MenuActions
