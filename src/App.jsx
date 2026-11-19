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
import { THEMATIQUES, libelleCourtTheme } from './lib/thematiques'
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
  'apercu-cours',
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
  // Parcours d'entrée : la branche en cours (Connexion ou Choix du profil et inscription) a-t-elle été
  // ouverte depuis l'Introduction ? Une bascule entre les deux branches garde ce Retour ; l'ouverture
  // de l'app, une déconnexion, « Passer » et un nouveau mot de passe n'en donnent pas (niveau 0).
  const [retourIntroduction, setRetourIntroduction] = useState(false)
  const [sectionApprenant, setSectionApprenant] = useState('dashboard')
  const [sectionFormateur, setSectionFormateur] = useState('dashboard')
  const [coursSelectionneId, setCoursSelectionneId] = useState(null)

  // Mode du document (couleurs.md, décision 7) : html et body prennent le fond-page du mode actif,
  // y compris la zone de rebond. Le mode suit le rôle du compte connecté (apprenant par défaut) ;
  // l'aperçu élève (« Voir comme un élève », écran plein hors de l'espace formateur) reste en mode
  // apprenant : le formateur voit la fiche telle que l'élève la verra. Les questions du parcours
  // (inscription, compléter le profil) suivent le rôle choisi : fond gris pour un formateur.
  const parcoursFormateur = (ecran === 'inscription' || ecran === 'completer-profil') && parcours.role === 'formateur'
  const modeDocument =
    (authUser?.role === 'formateur' && ecran !== 'apercu-cours') || parcoursFormateur ? 'formateur' : 'apprenant'
  useEffect(() => {
    document.documentElement.dataset.mode = modeDocument
  }, [modeDocument])
  const [themeCoursIndex, setThemeCoursIndex] = useState(null)
  const [sectionInitiale, setSectionInitiale] = useState(null)
  const [coursSelectionneIdFormateur, setCoursSelectionneIdFormateur] = useState(null)
  const [groupeSelectionneId, setGroupeSelectionneId] = useState(null)
  const [retourApercu, setRetourApercu] = useState('detail-cours-formateur')
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
        setRetourIntroduction(false)
        setEcran((actuel) => {
          if (!ECRANS_PROTEGES.includes(actuel)) return actuel
          return estPremiereResolution && !introductionDejaVue() ? 'introduction' : 'connexion'
        })
        return
      }

      setEcran('chargement')

      const { data: profil } = await supabase
        .from('profiles')
        // est_admin : compte officiel (navigation formateur sans « Groupes », dashboard admin)
        .select('id, role, est_admin')
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

      setAuthUser({ id: user.id, email: user.email, role: profil.role, estAdmin: profil.est_admin === true })
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

  // Compte officiel : pas de groupe. Une section « Groupes » ou un Détail groupe ouverts quand même
  // ramènent au dashboard.
  useEffect(() => {
    if (!authUser?.estAdmin) return
    if (sectionFormateur === 'groupes') setSectionFormateur('dashboard')
    if (ecran === 'detail-groupe') {
      setSectionFormateur('dashboard')
      setEcran('dashboard-formateur')
    }
  }, [authUser, sectionFormateur, ecran])

  if (ecran === 'chargement') {
    return (
      <div className="flow-page">
        <div className="flow-card">
          <p className="etat-chargement">Chargement…</p>
        </div>
      </div>
    )
  }

  if (ecran === 'introduction') {
    return (
      <Introduction
        slideInitiale={slideIntroduction}
        onCreerCompte={() => {
          setRetourIntroduction(true)
          setEcran('choix-profil')
        }}
        onSeConnecter={() => {
          setRetourIntroduction(true)
          setEcran('connexion')
        }}
        onPasser={() => {
          setRetourIntroduction(false)
          setEcran('connexion')
        }}
      />
    )
  }

  const retourVersIntroduction = retourIntroduction
    ? () => {
        setSlideIntroduction(2)
        setEcran('introduction')
      }
    : undefined

  if (ecran === 'connexion') {
    return (
      <Connexion
        messageConfirmation={messageConnexion}
        onRetour={retourVersIntroduction}
        onCreerCompte={() => setEcran('choix-profil')}
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
        libelleRetour="Introduction"
        onRetour={retourVersIntroduction}
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
          setRetourIntroduction(false)
          setEcran('connexion')
        }}
      />
    )
  }

  if (ecran === 'fiche-cours') {
    // Retour de la fiche : la section d'où elle a été ouverte, avec son thème (nom d'écran)
    const libelleOrigine =
      sectionApprenant === 'mode-terrain'
        ? 'Terrain'
        : sectionApprenant === 'cours'
          ? themeCoursIndex != null
            ? libelleCourtTheme(THEMATIQUES[themeCoursIndex])
            : 'Cours'
          : 'Accueil'
    return (
      <FicheCours
        key={coursSelectionneId}
        authUser={authUser}
        coursId={coursSelectionneId}
        sectionInitiale={sectionInitiale}
        libelleRetour={libelleOrigine}
        onRetour={() => setEcran('espace-apprenant')}
        onOuvrirCours={(coursId) => {
          setCoursSelectionneId(coursId)
          setSectionInitiale(null)
        }}
        // Barre encre du haut conservée sur desktop (masquée sur mobile : pas de tab bar dans la fiche),
        // entrée de la section d'origine active
        navigationDesktop={
          <NavigationEspace
            onglets={ONGLETS}
            iconeMenu={ICONE_MENU_APPRENANT}
            section={sectionApprenant}
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

  // Modification : Retour et fin vers le Détail du cours. Création : le Retour (avec « Annuler » et le
  // précédent du navigateur) remonte à la section d'où l'écran a été ouvert (Mes cours ou Dashboard,
  // inchangée pendant la création) ; « Créer le cours » mène toujours à Mes cours (chemin distinct).
  const enModification = Boolean(coursSelectionneIdFormateur)
  function retourCreationCours() {
    if (enModification) setEcran('detail-cours-formateur')
    else setEcran('dashboard-formateur')
  }
  function finCreationCours() {
    if (!enModification) setSectionFormateur('cours')
    retourCreationCours()
  }

  if (ecran === 'creation-cours') {
    return (
      <CreationCours
        authUser={authUser}
        coursId={coursSelectionneIdFormateur}
        libelleRetour={enModification ? 'Détail du cours' : sectionFormateur === 'dashboard' ? 'Dashboard' : 'Mes cours'}
        onTermine={finCreationCours}
        onRetour={retourCreationCours}
        // « Voir comme un élève » (cours déjà enregistré) : l'aperçu ramène à la modification
        onApercu={() => {
          setRetourApercu('creation-cours')
          setEcran('apercu-cours')
        }}
        onCreerGroupe={() => {
          setSectionFormateur('groupes')
          setEcran('dashboard-formateur')
        }}
      />
    )
  }

  // Pages de détail formateur : barre de navigation (desktop) / tab bar (mobile), onglet parent actif
  const allerSectionFormateur = (s) => {
    setSectionFormateur(s)
    setEcran('dashboard-formateur')
  }

  if (ecran === 'detail-cours-formateur') {
    return (
      <EspaceFormateur authUser={authUser} section="cours" onChangerSection={allerSectionFormateur}>
        <DetailCoursFormateur
          authUser={authUser}
          coursId={coursSelectionneIdFormateur}
          onApercu={() => {
            setRetourApercu('detail-cours-formateur')
            setEcran('apercu-cours')
          }}
          onModifier={() => setEcran('creation-cours')}
          onRetour={() => {
            setCoursSelectionneIdFormateur(null)
            allerSectionFormateur('cours')
          }}
        />
      </EspaceFormateur>
    )
  }

  // « Voir comme un élève » : la vraie fiche apprenant, sans aucune écriture (mode aperçu)
  if (ecran === 'apercu-cours') {
    return (
      <FicheCours
        key={`apercu-${coursSelectionneIdFormateur}`}
        apercu
        authUser={authUser}
        coursId={coursSelectionneIdFormateur}
        sectionInitiale="lecon"
        libelleRetour={retourApercu === 'creation-cours' ? 'Modifier le cours' : 'Détail du cours'}
        onRetour={() => setEcran(retourApercu)}
        onOuvrirCours={() => {}}
      />
    )
  }

  if (ecran === 'detail-groupe') {
    // Origine : la section ouverte au moment du clic (Dashboard ou Mes groupes), que le Détail
    // groupe ne change pas ; Retour et suppression du groupe y reviennent, son entrée reste active.
    const origineGroupe = sectionFormateur === 'dashboard' ? 'dashboard' : 'groupes'
    return (
      <EspaceFormateur authUser={authUser} section={origineGroupe} onChangerSection={allerSectionFormateur}>
        <DetailGroupe
          authUser={authUser}
          groupeId={groupeSelectionneId}
          libelleRetour={origineGroupe === 'dashboard' ? 'Dashboard' : 'Mes groupes'}
          onRetour={() => {
            setGroupeSelectionneId(null)
            allerSectionFormateur(origineGroupe)
          }}
        />
      </EspaceFormateur>
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
