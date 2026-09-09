import NavigationEspace from '../components/NavigationEspace'
import DashboardFormateur from './DashboardFormateur'
import SectionCoursFormateur from './SectionCoursFormateur'
import SectionGroupesFormateur from './SectionGroupesFormateur'
import iconeDashboard from '../Assets/dashboard.svg'
import iconeCours from '../Assets/book.svg'
import iconeGroupes from '../Assets/Users.svg'
import '../styles/shared.css'
import '../styles/espace-layout.css'

const ONGLETS = [
  { id: 'dashboard', label: 'Dashboard', icone: iconeDashboard },
  { id: 'cours', label: 'Cours', icone: iconeCours },
  { id: 'groupes', label: 'Groupes', icone: iconeGroupes },
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
