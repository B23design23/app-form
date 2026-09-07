import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Accueil from './pages/Accueil'
import CreationCompte from './pages/CreationCompte'
import Connexion from './pages/Connexion'
import OnboardingFlow from './pages/onboarding/OnboardingFlow'
import Dashboard from './pages/Dashboard'
import FicheCours from './pages/FicheCours'

const ECRANS_PROTEGES = ['chargement', 'onboarding', 'dashboard', 'fiche-cours']

function App() {
  const [ecran, setEcran] = useState('chargement')
  const [authUser, setAuthUser] = useState(null)
  const [coursSelectionneId, setCoursSelectionneId] = useState(null)
  const [sectionInitiale, setSectionInitiale] = useState(null)

  useEffect(() => {
    let annule = false

    const resoudreDestination = async (user) => {
      if (!user) {
        if (annule) return
        setAuthUser(null)
        setEcran((actuel) => (ECRANS_PROTEGES.includes(actuel) ? 'accueil' : actuel))
        return
      }

      setEcran('chargement')

      const { data: profil } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (annule) return
      setAuthUser({ id: user.id, email: user.email })
      setEcran(profil ? 'dashboard' : 'onboarding')
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

  if (ecran === 'accueil') {
    return <Accueil onCommencer={() => setEcran('compte')} onSeConnecter={() => setEcran('connexion')} />
  }

  if (ecran === 'compte') {
    return <CreationCompte onRetour={() => setEcran('accueil')} onSeConnecter={() => setEcran('connexion')} />
  }

  if (ecran === 'connexion') {
    return <Connexion onRetour={() => setEcran('accueil')} onCreerCompte={() => setEcran('compte')} />
  }

  if (ecran === 'onboarding') {
    return <OnboardingFlow authUser={authUser} onTermine={() => setEcran('dashboard')} />
  }

  if (ecran === 'fiche-cours') {
    return (
      <FicheCours
        authUser={authUser}
        coursId={coursSelectionneId}
        sectionInitiale={sectionInitiale}
        onRetour={() => setEcran('dashboard')}
      />
    )
  }

  return (
    <Dashboard
      authUser={authUser}
      onOuvrirCours={(coursId, section) => {
        setCoursSelectionneId(coursId)
        setSectionInitiale(section ?? null)
        setEcran('fiche-cours')
      }}
    />
  )
}

export default App
