import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Introduction, { introductionDejaVue } from './pages/parcours/Introduction'
import Connexion from './pages/parcours/Connexion'
import ChoixProfil from './pages/parcours/ChoixProfil'
import Inscription from './pages/parcours/Inscription'
import { useParcours } from './pages/parcours/ParcoursContext'
import MotDePasseOublie from './pages/MotDePasseOublie'
import NouveauMotDePasse from './pages/NouveauMotDePasse'
import EspaceApprenant, { ONGLETS, ICONE_MENU_APPRENANT } from './pages/EspaceApprenant'
import { THEMATIQUES } from './lib/thematiques'
import NavigationEspace from './components/NavigationEspace'
import EspaceFormateur from './pages/EspaceFormateur'
import CreationCours from './pages/CreationCours'
import DetailCoursFormateur from './pages/DetailCoursFormateur'
import DetailGroupe from './pages/DetailGroupe'
import FicheCours from './pages/FicheCours'
import QuizFlash from './pages/QuizFlash'

const ECRANS_PROTEGES = [
  'chargement',
  'completer-profil',
  'espace-apprenant',
  'dashboard-formateur',
  'creation-cours',
  'detail-cours-formateur',
  'detail-groupe',
  'fiche-cours',
  'quiz-flash',
]

// Ligne profiles à partir des réponses du parcours passées en métadonnées au signUp.
function profilDepuisMetadonnees(user, meta) {
  const role = meta.role === 'formateur' ? 'formateur' : 'apprenant'
  const base = { id: user.id, email: user.email, role, prenom: String(meta.prenom).trim() }
  return role === 'formateur'
    ? { ...base, organisme: meta.organisme ?? null, specialite: meta.specialite ?? null }
    : { ...base, tranche_age: meta.tranche_age ?? null, profession: meta.profession ?? null, motivation: meta.motivation ?? null }
}

function App() {
  const [ecran, setEcran] = useState('chargement')
  const [authUser, setAuthUser] = useState(null)
  const parcours = useParcours()
  const [slideIntroduction, setSlideIntroduction] = useState(0)
  const [retourChoixProfil, setRetourChoixProfil] = useState('introduction')
  const [sectionApprenant, setSectionApprenant] = useState('dashboard')
  const [sectionFormateur, setSectionFormateur] = useState('dashboard')
  const [coursSelectionneId, setCoursSelectionneId] = useState(null)
  const [themeCoursIndex, setThemeCoursIndex] = useState(null)
  const [sectionInitiale, setSectionInitiale] = useState(null)
  const [coursSelectionneIdFormateur, setCoursSelectionneIdFormateur] = useState(null)
  const [groupeSelectionneId, setGroupeSelectionneId] = useState(null)
  const [messageConnexion, setMessageConnexion] = useState(null)

  useEffect(() => {
    let annule = false
    // Sans session : Introduction à la toute première visite sur l'appareil (clé locale), sinon
    // Connexion ; une déconnexion en cours de session ramène aussi à la Connexion.
    let premiereResolution = true

    const resoudreDestination = async (user) => {
      const estPremiereResolution = premiereResolution
      premiereResolution = false

      if (!user) {
        if (annule) return
        setAuthUser(null)
        setEcran((actuel) => {
          if (!ECRANS_PROTEGES.includes(actuel)) return actuel
          return estPremiereResolution && !introductionDejaVue() ? 'introduction' : 'connexion'
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
        // Pas encore de profil : les réponses du parcours ont été passées en métadonnées au
        // signUp ; on écrit la ligne profiles ici, avec la session ouverte (RLS insert own).
        // Fonctionne que la confirmation d'email soit active ou non (première connexion).
        const meta = user.user_metadata ?? {}
        const roleMetadata = meta.role === 'formateur' ? 'formateur' : 'apprenant'
        if (meta.prenom) {
          const { error } = await supabase.from('profiles').insert(profilDepuisMetadonnees(user, meta))
          if (annule) return
          // 23505 : ligne déjà créée par une résolution concurrente (getSession + onAuthStateChange)
          if (!error || error.code === '23505') {
            setAuthUser({ id: user.id, email: user.email, role: roleMetadata })
            setEcran(roleMetadata === 'formateur' ? 'dashboard-formateur' : 'espace-apprenant')
            return
          }
          console.error('profiles (métadonnées)', error.message)
        }
        // Compte sans réponses (inscription antérieure inachevée) : questions, puis enregistrement
        setAuthUser({ id: user.id, email: user.email, role: roleMetadata })
        parcours.choisirRole(roleMetadata)
        setEcran('completer-profil')
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
    return (
      <Introduction
        slideInitiale={slideIntroduction}
        onCreerCompte={() => {
          setRetourChoixProfil('introduction')
          setEcran('choix-profil')
        }}
        onSeConnecter={() => setEcran('connexion')}
      />
    )
  }

  if (ecran === 'connexion') {
    return (
      <Connexion
        messageConfirmation={messageConnexion}
        onRetour={() => {
          setSlideIntroduction(2)
          setEcran('introduction')
        }}
        onCreerCompte={() => {
          setRetourChoixProfil('connexion')
          setEcran('choix-profil')
        }}
        onMotDePasseOublie={() => {
          setMessageConnexion(null)
          setEcran('mot-de-passe-oublie')
        }}
      />
    )
  }

  if (ecran === 'choix-profil') {
    return (
      <ChoixProfil
        onRetour={() => {
          setSlideIntroduction(2)
          setEcran(retourChoixProfil)
        }}
        onChoisir={(role) => {
          if (parcours.role !== role) parcours.choisirRole(role)
          setEcran('inscription')
        }}
        onSeConnecter={() => setEcran('connexion')}
      />
    )
  }

  if (ecran === 'inscription') {
    // Après signUp, onAuthStateChange écrit le profil et ouvre le dashboard (voir plus haut)
    return (
      <Inscription
        onRetourChoixProfil={() => setEcran('choix-profil')}
        onSeConnecter={() => setEcran('connexion')}
      />
    )
  }

  if (ecran === 'completer-profil') {
    return (
      <Inscription
        authUser={authUser}
        onRetourChoixProfil={() => supabase.auth.signOut()}
        onSeConnecter={() => supabase.auth.signOut()}
        onProfilCree={() => setEcran(authUser.role === 'formateur' ? 'dashboard-formateur' : 'espace-apprenant')}
      />
    )
  }

  if (ecran === 'mot-de-passe-oublie') {
    return (
      <MotDePasseOublie
        onRetour={() => setEcran('connexion')}
        onSimulerLien={() => setEcran('nouveau-mot-de-passe')}
      />
    )
  }

  if (ecran === 'nouveau-mot-de-passe') {
    return (
      <NouveauMotDePasse
        onTermine={() => {
          setMessageConnexion('Mot de passe mis à jour, tu peux te connecter.')
          setEcran('connexion')
        }}
      />
    )
  }

  if (ecran === 'fiche-cours') {
    return (
      <FicheCours
        key={coursSelectionneId}
        authUser={authUser}
        coursId={coursSelectionneId}
        sectionInitiale={sectionInitiale}
        onRetour={() => setEcran('espace-apprenant')}
        // Retour de fin de quiz : détail du thème du cours (Cours → thème)
        onRetourTheme={(categorie) => {
          const index = THEMATIQUES.indexOf(categorie)
          setSectionApprenant('cours')
          setThemeCoursIndex(index === -1 ? null : index)
          setEcran('espace-apprenant')
        }}
        onOuvrirCours={(coursId) => {
          setCoursSelectionneId(coursId)
          setSectionInitiale(null)
        }}
        // Barre encre du haut conservée sur desktop (masquée sur mobile : pas de tab bar dans la fiche)
        navigationDesktop={
          <NavigationEspace
            onglets={ONGLETS}
            iconeMenu={ICONE_MENU_APPRENANT}
            section={null}
            onChangerSection={(s) => {
              setSectionApprenant(s)
              setThemeCoursIndex(null)
              setEcran('espace-apprenant')
            }}
          />
        }
      />
    )
  }

  if (ecran === 'quiz-flash') {
    return (
      <QuizFlash
        authUser={authUser}
        onRetour={() => {
          setSectionApprenant('dashboard')
          setEcran('espace-apprenant')
        }}
        // « Revoir la leçon » : ouvre la leçon du cours d'origine de la question
        onOuvrirLecon={(coursId) => {
          setCoursSelectionneId(coursId)
          setSectionInitiale('lecon')
          setEcran('fiche-cours')
        }}
      />
    )
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
      onChangerSection={(s) => {
        setSectionApprenant(s)
        setThemeCoursIndex(null)
      }}
      themeCoursIndex={themeCoursIndex}
      onChangerTheme={setThemeCoursIndex}
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
