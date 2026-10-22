import { useEffect, useRef, useState } from 'react'
import Icone from '../Icone'
import iconePoints from '../../Assets/points.svg?raw'
import './Formateur.css'

// Menu « … » de l'espace formateur : bouton rond 40 px ; carte flottante sur desktop, feuille
// depuis le bas sur mobile (titre = nom de l'élément). Action destructrice en rouge, en dernier.
// Clavier : Entrée ou Espace sur le bouton ouvre le menu et place le focus sur la première action ;
// les flèches passent d'une action à l'autre ; Échap ferme le menu et rend le focus au bouton.
// actions : [{ libelle, onClick, danger }]
function MenuActions({ titre, actions, label = 'Plus d’actions' }) {
  const [ouvert, setOuvert] = useState(false)
  const refConteneur = useRef(null)
  const refBouton = useRef(null)
  const refsActions = useRef([])

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
          <div className="fm-menu-carte" role="menu" onKeyDown={surToucheMenu}>
            <span className="fm-poignee" aria-hidden="true" />
            {titre && <p className="fm-menu-titre">{titre}</p>}
            {actions.map((action, index) => (
              <button
                key={action.libelle}
                ref={(el) => (refsActions.current[index] = el)}
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
