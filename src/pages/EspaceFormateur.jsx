import NavigationEspace from '../components/NavigationEspace'
import DashboardFormateur from './DashboardFormateur'
import SectionCoursFormateur from './SectionCoursFormateur'
import SectionGroupesFormateur from './SectionGroupesFormateur'
import '../styles/shared.css'
import '../styles/espace-layout.css'

const ONGLETS = [
  { id: 'dashboard', label: 'Dashboard', icone: '🏠' },
  { id: 'cours', label: 'Cours', icone: '📚' },
  { id: 'groupes', label: 'Groupes', icone: '👥' },
]

function EspaceFormateur({ authUser, section, onChangerSection, onCreerCours, onOuvrirCours, onOuvrirGroupe }) {
  return (
    <div className="espace-layout espace-layout-formateur">
      <NavigationEspace onglets={ONGLETS} section={section} onChangerSection={onChangerSection} />

      <div className="espace-contenu">
        {section === 'dashboard' && (
          <DashboardFormateur
            authUser={authUser}
            onCreerCours={onCreerCours}
            onChangerSection={onChangerSection}
          />
        )}
        {section === 'cours' && (
          <SectionCoursFormateur authUser={authUser} onOuvrirCours={onOuvrirCours} onCreerCours={onCreerCours} />
        )}
        {section === 'groupes' && <SectionGroupesFormateur authUser={authUser} onOuvrirGroupe={onOuvrirGroupe} />}
      </div>
    </div>
  )
}

export default EspaceFormateur
