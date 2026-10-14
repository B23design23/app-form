import { useState } from 'react'
import NavigationEspace from '../components/NavigationEspace'
import Dashboard from './Dashboard'
import SectionCours from './SectionCours'
import SectionModeTerrain from './SectionModeTerrain'
import iconeAccueil from '../Assets/home.svg?raw'
import iconeCours from '../Assets/livre.svg?raw'
import iconeModeTerrain from '../Assets/case-cochee.svg?raw'
import iconeMenu from '../Assets/menu.svg?raw'
import '../styles/shared.css'
import '../styles/espace-layout.css'

// Exportés pour la barre de navigation desktop de la fiche de cours (App.jsx).
export const ICONE_MENU_APPRENANT = iconeMenu

export const ONGLETS = [
  { id: 'dashboard', label: 'Accueil', icone: iconeAccueil },
  { id: 'cours', label: 'Cours', icone: iconeCours },
  { id: 'mode-terrain', label: 'Terrain', icone: iconeModeTerrain },
]

function EspaceApprenant({ authUser, section, onChangerSection, onOuvrirCours, onOuvrirQuizFlash, themeCoursIndex, onChangerTheme }) {
  // « Tout voir » du bloc « De ton formateur » : ouvre Cours (liste des thèmes) sur la section
  // « Cours de mon formateur ».
  const [ancreCours, setAncreCours] = useState(null)

  function voirCoursFormateur() {
    onChangerTheme(null)
    setAncreCours('cours-formateur')
    onChangerSection('cours')
  }

  return (
    <div className="espace-layout">
      <NavigationEspace onglets={ONGLETS} iconeMenu={iconeMenu} section={section} onChangerSection={onChangerSection} />

      <div className="espace-contenu">
        {section === 'dashboard' && (
          <Dashboard
            authUser={authUser}
            onOuvrirCours={onOuvrirCours}
            onOuvrirQuizFlash={onOuvrirQuizFlash}
            onChangerSection={onChangerSection}
            onVoirCoursFormateur={voirCoursFormateur}
          />
        )}
        {section === 'cours' && (
          <SectionCours
            authUser={authUser}
            onOuvrirCours={onOuvrirCours}
            themeSelectionneIndex={themeCoursIndex}
            onChangerTheme={onChangerTheme}
            ancre={ancreCours}
            onAncreAtteinte={() => setAncreCours(null)}
          />
        )}
        {section === 'mode-terrain' && <SectionModeTerrain authUser={authUser} onOuvrirCours={onOuvrirCours} />}
      </div>
    </div>
  )
}

export default EspaceApprenant
