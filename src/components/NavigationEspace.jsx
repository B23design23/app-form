import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import iconeMenu from '../Assets/burger.svg'
import skilloLogo from '../Assets/Skillogo.svg'
import '../styles/espace-layout.css'

// Nav partagée entre espace apprenant et espace formateur : mêmes 3 entrées de contenu
// (fournies via `onglets`) + un 4e item "Menu" identique dans les deux espaces.
function NavigationEspace({ onglets, section, onChangerSection }) {
  const [menuOuvert, setMenuOuvert] = useState(false)

  return (
    <nav className="espace-nav" aria-label="Navigation principale">
      <div className="espace-nav-conteneur">
        <img className="espace-nav-logo" src={skilloLogo} alt="Skillo" />

        <div className="espace-nav-items">
          {onglets.map((onglet) => (
            <button
              key={onglet.id}
              type="button"
              className={`espace-nav-item${section === onglet.id ? ' espace-nav-item-actif' : ''}`}
              onClick={() => onChangerSection(onglet.id)}
              aria-current={section === onglet.id ? 'page' : undefined}
            >
              <img className="espace-nav-icone" src={onglet.icone} alt="" aria-hidden="true" />
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
              <img className="espace-nav-icone" src={iconeMenu} alt="" aria-hidden="true" />
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
