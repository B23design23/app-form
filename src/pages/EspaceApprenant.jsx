import NavigationEspace from '../components/NavigationEspace'
import Dashboard from './Dashboard'
import SectionCours from './SectionCours'
import SectionModeTerrain from './SectionModeTerrain'
import '../styles/shared.css'
import '../styles/espace-layout.css'

const ONGLETS = [
  { id: 'dashboard', label: 'Dashboard', icone: '🏠' },
  { id: 'cours', label: 'Cours', icone: '📚' },
  { id: 'mode-terrain', label: 'Mode terrain', icone: '🧰' },
]

function EspaceApprenant({ authUser, section, onChangerSection, onOuvrirCours, onOuvrirQuizFlash }) {
  return (
    <div className="espace-layout">
      <NavigationEspace onglets={ONGLETS} section={section} onChangerSection={onChangerSection} />

      <div className="espace-contenu">
        {section === 'dashboard' && (
          <Dashboard
            authUser={authUser}
            onOuvrirCours={onOuvrirCours}
            onOuvrirQuizFlash={onOuvrirQuizFlash}
            onChangerSection={onChangerSection}
          />
        )}
        {section === 'cours' && <SectionCours authUser={authUser} onOuvrirCours={onOuvrirCours} />}
        {section === 'mode-terrain' && <SectionModeTerrain authUser={authUser} onOuvrirCours={onOuvrirCours} />}
      </div>
    </div>
  )
}

export default EspaceApprenant
