import { useEffect, useRef, useState } from 'react'
import Icone from '../Icone'
import iconePoints from '../../Assets/points.svg?raw'
import './Formateur.css'

// Menu « … » de l'espace formateur : bouton rond 40 px ; carte flottante sur desktop, feuille
// depuis le bas sur mobile (titre = nom de l'élément). Action destructrice en rouge, en dernier.
// actions : [{ libelle, onClick, danger }]
function MenuActions({ titre, actions, label = 'Plus d’actions' }) {
  const [ouvert, setOuvert] = useState(false)
  const refConteneur = useRef(null)

  useEffect(() => {
    if (!ouvert) return
    const surTouche = (e) => e.key === 'Escape' && setOuvert(false)
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [ouvert])

  return (
    <div className="fm-menu" ref={refConteneur}>
      <button
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
          <div className="fm-menu-carte" role="menu">
            <span className="fm-poignee" aria-hidden="true" />
            {titre && <p className="fm-menu-titre">{titre}</p>}
            {actions.map((action) => (
              <button
                key={action.libelle}
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
