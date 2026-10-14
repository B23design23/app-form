import { createContext, useContext, useEffect, useState } from 'react'

// État partagé du parcours d'inscription (rôle + réponses aux questions), recopié dans le
// sessionStorage pour survivre à un rafraîchissement. Le retour arrière conserve les réponses.
const CLE_STOCKAGE = 'skillo:parcours'

export const REPONSES_VIDES = {
  prenom: '',
  profession: '',
  trancheAge: '',
  motivation: '',
  organisme: '',
  specialite: '',
}

const ETAT_INITIAL = { role: null, etape: 1, reponses: REPONSES_VIDES }

function lireEtat() {
  try {
    const brut = window.sessionStorage.getItem(CLE_STOCKAGE)
    const donnees = brut ? JSON.parse(brut) : null
    if (!donnees) return ETAT_INITIAL
    return { ...ETAT_INITIAL, ...donnees, reponses: { ...REPONSES_VIDES, ...donnees.reponses } }
  } catch {
    return ETAT_INITIAL
  }
}

const ParcoursContext = createContext(null)

export function ParcoursProvider({ children }) {
  const [etat, setEtat] = useState(lireEtat)

  useEffect(() => {
    try {
      window.sessionStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat))
    } catch {
      // stockage indisponible : le parcours fonctionne sans reprise après rafraîchissement
    }
  }, [etat])

  const valeur = {
    ...etat,
    choisirRole: (role) => setEtat((e) => ({ ...e, role, etape: 1 })),
    allerEtape: (etape) => setEtat((e) => ({ ...e, etape })),
    majReponse: (champ, valeurChamp) => setEtat((e) => ({ ...e, reponses: { ...e.reponses, [champ]: valeurChamp } })),
    reinitialiser: () => {
      setEtat(ETAT_INITIAL)
      try {
        window.sessionStorage.removeItem(CLE_STOCKAGE)
      } catch {
        // idem
      }
    },
  }

  return <ParcoursContext.Provider value={valeur}>{children}</ParcoursContext.Provider>
}

export function useParcours() {
  return useContext(ParcoursContext)
}
