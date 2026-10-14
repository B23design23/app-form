import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import iconeBurger from '../Assets/burger.svg?raw'
import Logo from './Logo'
import '../styles/espace-layout.css'
import Icone from './Icone'

// Nav partagée entre espace apprenant et espace formateur : mêmes 3 entrées de contenu
// (fournies via `onglets`) + un 4e item "Menu" identique dans les deux espaces.
// Icônes inline en currentColor (composant Icone) pour suivre l'état actif/inactif.
// `iconeMenu` : icône du 4e item (SVG brut), burger par défaut.
function NavigationEspace({ onglets, iconeMenu = iconeBurger, section, onChangerSection }) {
  const [menuOuvert, setMenuOuvert] = useState(false)

  return (
    <nav className="espace-nav" aria-label="Navigation principale">
      <div className="espace-nav-conteneur">
        <Logo variante="fonce" className="espace-nav-logo" />

        <div className="espace-nav-items">
          {onglets.map((onglet) => (
            <button
              key={onglet.id}
              type="button"
              className={`espace-nav-item${section === onglet.id ? ' espace-nav-item-actif' : ''}`}
              onClick={() => onChangerSection(onglet.id)}
              aria-current={section === onglet.id ? 'page' : undefined}
            >
              <Icone svg={onglet.icone} className="espace-nav-icone" />
              <span>{onglet.label}</span>
            </button>
          ))}

          <div className="espace-nav-menu-wrapper">
            <button
              type="button"
              className={`espace-nav-item${menuOuvert ? ' espace-nav-item-actif' : ''}`}
              onClick={() => setMenuOuvert((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOuvert}
            >
              <Icone svg={iconeMenu} className="espace-nav-icone" />
              <span>Menu</span>
            </button>

            {menuOuvert && (
              <>
                <div className="espace-menu-overlay" onClick={() => setMenuOuvert(false)} />
                <div className="espace-menu-dropdown" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    className="espace-menu-item"
                    onClick={() => supabase.auth.signOut()}
                  >
                    Se déconnecter
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavigationEspace
