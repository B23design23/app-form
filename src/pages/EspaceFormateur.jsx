import NavigationEspace from '../components/NavigationEspace'
import DashboardFormateur from './DashboardFormateur'
import SectionCoursFormateur from './SectionCoursFormateur'
import SectionGroupesFormateur from './SectionGroupesFormateur'
import iconeDashboard from '../Assets/dashboard.svg?raw'
import iconeCours from '../Assets/book.svg?raw'
import iconeGroupes from '../Assets/Users.svg?raw'
import '../styles/shared.css'
import '../styles/espace-layout.css'

const ONGLETS = [
  { id: 'dashboard', label: 'Dashboard', icone: iconeDashboard },
  { id: 'cours', label: 'Cours', icone: iconeCours },
  { id: 'groupes', label: 'Groupes', icone: iconeGroupes },
]

// children : page de détail (Détail cours, Détail groupe) affichée dans le même cadre, avec la barre
// de navigation et l'onglet parent actif ; sinon, la section choisie.
function EspaceFormateur({ authUser, section, onChangerSection, onCreerCours, onOuvrirCours, onOuvrirGroupe, children }) {
  return (
    <div className="espace-layout espace-layout-formateur">
      {/* Compte officiel (est_admin) : pas de groupe, pas d'entrée « Groupes » (Dashboard, Cours, Menu) */}
      <NavigationEspace
        onglets={authUser?.estAdmin ? ONGLETS.filter((o) => o.id !== 'groupes') : ONGLETS}
        section={section}
        onChangerSection={onChangerSection}
      />

      <div className="espace-contenu">
        {children}
        {!children && section === 'dashboard' && (
          <DashboardFormateur
            authUser={authUser}
            onCreerCours={onCreerCours}
            onChangerSection={onChangerSection}
            onOuvrirGroupe={onOuvrirGroupe}
          />
        )}
        {!children && section === 'cours' && (
          <SectionCoursFormateur authUser={authUser} onOuvrirCours={onOuvrirCours} onCreerCours={onCreerCours} />
        )}
        {!children && section === 'groupes' && !authUser?.estAdmin && <SectionGroupesFormateur authUser={authUser} onOuvrirGroupe={onOuvrirGroupe} />}
      </div>
    </div>
  )
}

export default EspaceFormateur
