import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Introduction from './pages/Introduction'
import Accueil from './pages/Accueil'
import CreationCompte from './pages/CreationCompte'
import Connexion from './pages/Connexion'
import OnboardingFlow from './pages/onboarding/OnboardingFlow'
import EspaceApprenant from './pages/EspaceApprenant'
import EspaceFormateur from './pages/EspaceFormateur'
import CreationCours from './pages/CreationCours'
import DetailCoursFormateur from './pages/DetailCoursFormateur'
import DetailGroupe from './pages/DetailGroupe'
import FicheCours from './pages/FicheCours'
import QuizFlash from './pages/QuizFlash'

const ECRANS_PROTEGES = [
  'chargement',
  'onboarding',
  'espace-apprenant',
  'dashboard-formateur',
  'creation-cours',
  'detail-cours-formateur',
  'detail-groupe',
  'fiche-cours',
  'quiz-flash',
]

function App() {
  const [ecran, setEcran] = useState('chargement')
  const [authUser, setAuthUser] = useState(null)
  const [roleChoisi, setRoleChoisi] = useState('apprenant')
  const [sectionApprenant, setSectionApprenant] = useState('dashboard')
  const [sectionFormateur, setSectionFormateur] = useState('dashboard')
  const [coursSelectionneId, setCoursSelectionneId] = useState(null)
  const [sectionInitiale, setSectionInitiale] = useState(null)
  const [coursSelectionneIdFormateur, setCoursSelectionneIdFormateur] = useState(null)
  const [groupeSelectionneId, setGroupeSelectionneId] = useState(null)

  useEffect(() => {
    let annule = false
    // Le tout premier appel (au chargement de la page) mène à l'Introduction si aucune
    // session n'existe ; une déconnexion en cours de session ramène directement à l'Accueil
    // (l'utilisateur a déjà vu le pitch, pas besoin de le repasser).
    let premiereResolution = true

    const resoudreDestination = async (user) => {
      const estPremiereResolution = premiereResolution
      premiereResolution = false

      if (!user) {
        if (annule) return
        setAuthUser(null)
        setEcran((actuel) => {
          if (!ECRANS_PROTEGES.includes(actuel)) return actuel
          return estPremiereResolution ? 'introduction' : 'accueil'
        })
        return
      }

      setEcran('chargement')

      const { data: profil } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .maybeSingle()

      if (annule) return

      if (!profil) {
        // Pas encore de profil : le rôle choisi à l'Accueil vit dans les métadonnées
        // auth (persistées par Supabase) plutôt qu'un state React, pour survivre à un refresh.
        const roleMetadata = user.user_metadata?.role === 'formateur' ? 'formateur' : 'apprenant'
        setAuthUser({ id: user.id, email: user.email, role: roleMetadata })
        setEcran('onboarding')
        return
      }

      setAuthUser({ id: user.id, email: user.email, role: profil.role })
      setEcran(profil.role === 'formateur' ? 'dashboard-formateur' : 'espace-apprenant')
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      resoudreDestination(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return
      resoudreDestination(session?.user ?? null)
    })

    return () => {
      annule = true
      subscription.unsubscribe()
    }
  }, [])

  if (ecran === 'chargement') {
    return (
      <div className="flow-page">
        <div className="flow-card">
          <p>Chargement…</p>
        </div>
      </div>
    )
  }

  if (ecran === 'introduction') {
    return <Introduction onTermine={() => setEcran('accueil')} />
  }

  if (ecran === 'accueil') {
    return (
      <Accueil
        onCommencer={(role) => {
          setRoleChoisi(role)
          setEcran('compte')
        }}
      />
    )
  }

  if (ecran === 'compte') {
    return (
      <CreationCompte
        role={roleChoisi}
        onRetour={() => setEcran('accueil')}
        onSeConnecter={() => setEcran('connexion')}
      />
    )
  }

  if (ecran === 'connexion') {
    return <Connexion onRetour={() => setEcran('accueil')} onCreerCompte={() => setEcran('compte')} />
  }

  if (ecran === 'onboarding') {
    return (
      <OnboardingFlow
        authUser={authUser}
        role={authUser.role}
        onTermine={() => setEcran(authUser.role === 'formateur' ? 'dashboard-formateur' : 'espace-apprenant')}
        onRetourCompte={() => setEcran('compte')}
      />
    )
  }

  if (ecran === 'fiche-cours') {
    return (
      <FicheCours
        authUser={authUser}
        coursId={coursSelectionneId}
        sectionInitiale={sectionInitiale}
        onRetour={() => setEcran('espace-apprenant')}
      />
    )
  }

  if (ecran === 'quiz-flash') {
    return <QuizFlash authUser={authUser} onRetour={() => setEcran('espace-apprenant')} />
  }

  if (ecran === 'creation-cours') {
    return (
      <CreationCours
        authUser={authUser}
        coursId={coursSelectionneIdFormateur}
        onTermine={() => setEcran(coursSelectionneIdFormateur ? 'detail-cours-formateur' : 'dashboard-formateur')}
        onRetour={() => setEcran(coursSelectionneIdFormateur ? 'detail-cours-formateur' : 'dashboard-formateur')}
      />
    )
  }

  if (ecran === 'detail-cours-formateur') {
    return (
      <DetailCoursFormateur
        authUser={authUser}
        coursId={coursSelectionneIdFormateur}
        onModifier={() => setEcran('creation-cours')}
        onRetour={() => {
          setCoursSelectionneIdFormateur(null)
          setEcran('dashboard-formateur')
        }}
      />
    )
  }

  if (ecran === 'detail-groupe') {
    return (
      <DetailGroupe
        authUser={authUser}
        groupeId={groupeSelectionneId}
        onRetour={() => {
          setGroupeSelectionneId(null)
          setEcran('dashboard-formateur')
        }}
      />
    )
  }

  if (ecran === 'dashboard-formateur') {
    return (
      <EspaceFormateur
        authUser={authUser}
        section={sectionFormateur}
        onChangerSection={setSectionFormateur}
        onCreerCours={() => {
          setCoursSelectionneIdFormateur(null)
          setEcran('creation-cours')
        }}
        onOuvrirCours={(coursId) => {
          setCoursSelectionneIdFormateur(coursId)
          setEcran('detail-cours-formateur')
        }}
        onOuvrirGroupe={(groupeId) => {
          setGroupeSelectionneId(groupeId)
          setEcran('detail-groupe')
        }}
      />
    )
  }

  return (
    <EspaceApprenant
      authUser={authUser}
      section={sectionApprenant}
      onChangerSection={setSectionApprenant}
      onOuvrirCours={(coursId, section) => {
        setCoursSelectionneId(coursId)
        setSectionInitiale(section ?? null)
        setEcran('fiche-cours')
      }}
      onOuvrirQuizFlash={() => setEcran('quiz-flash')}
    />
  )
}

export default App
