import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import ProgressBar from '../../components/ProgressBar'
import '../../styles/shared.css'

const TOTAL_ETAPES = 4

const TRANCHES_AGE = [
  { value: '-18', label: 'Moins de 18 ans' },
  { value: '18-25', label: '18 - 25 ans' },
  { value: '26-35', label: '26 - 35 ans' },
  { value: '36-50', label: '36 - 50 ans' },
  { value: '50+', label: '50 ans et plus' },
]

const PROFESSIONS = [
  { value: 'apprenti', label: 'Apprenti(e)' },
  { value: 'en_poste', label: 'En poste' },
  { value: 'reconversion', label: 'En reconversion' },
  { value: 'autre', label: 'Autre' },
]

const MOTIVATIONS = [
  { value: 'trouver_emploi', label: 'Trouver un emploi dans le secteur' },
  { value: 'monter_competences', label: 'Monter en compétences sur mon poste' },
  { value: 'preparation_examen', label: 'Préparer un examen ou une certification' },
  { value: 'curiosite', label: 'Curiosité personnelle' },
  { value: 'autre', label: 'Autre' },
]

const REPONSES_INITIALES = {
  prenom: '',
  trancheAge: '',
  profession: '',
  motivation: '',
  motivationAutre: '',
}

function OnboardingFlow({ authUser, onTermine }) {
  const [etape, setEtape] = useState(1)
  const [reponses, setReponses] = useState(REPONSES_INITIALES)
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(null)

  const majReponse = (champ) => (e) => {
    setReponses((prev) => ({ ...prev, [champ]: e.target.value }))
  }

  const peutContinuer = () => {
    if (etape === 1) return reponses.prenom.trim().length > 0
    if (etape === 2) return reponses.trancheAge !== ''
    if (etape === 3) return reponses.profession !== ''
    if (etape === 4) {
      if (reponses.motivation === '') return false
      if (reponses.motivation === 'autre') return reponses.motivationAutre.trim().length > 0
      return true
    }
    return false
  }

  const handleRetour = () => {
    setErreur(null)
    setEtape((e) => Math.max(1, e - 1))
  }

  const handleSuivant = async () => {
    if (!peutContinuer()) return

    if (etape < TOTAL_ETAPES) {
      setEtape((e) => e + 1)
      return
    }

    setErreur(null)
    setLoading(true)

    const motivation =
      reponses.motivation === 'autre' ? reponses.motivationAutre.trim() : reponses.motivation

    const { error } = await supabase.from('profiles').insert({
      id: authUser.id,
      email: authUser.email,
      prenom: reponses.prenom.trim(),
      tranche_age: reponses.trancheAge,
      profession: reponses.profession,
      motivation,
    })

    setLoading(false)

    if (error) {
      setErreur(`Ton profil n'a pas pu être enregistré (${error.message}).`)
      return
    }

    onTermine()
  }

  return (
    <div className="flow-page">
      <div className="flow-card">
        {etape > 1 ? (
          <button type="button" className="lien-retour" onClick={handleRetour}>
            ← Retour
          </button>
        ) : null}

        <ProgressBar etapeActuelle={etape} totalEtapes={TOTAL_ETAPES} />

        {etape === 1 && (
          <>
            <h1>Comment tu t'appelles ?</h1>
            <label className="champ">
              <span>Prénom</span>
              <input
                type="text"
                required
                autoFocus
                value={reponses.prenom}
                onChange={majReponse('prenom')}
                autoComplete="given-name"
              />
            </label>
          </>
        )}

        {etape === 2 && (
          <>
            <h1>Quelle est ta tranche d'âge ?</h1>
            <label className="champ">
              <span>Tranche d'âge</span>
              <select required value={reponses.trancheAge} onChange={majReponse('trancheAge')}>
                <option value="" disabled>
                  Sélectionner
                </option>
                {TRANCHES_AGE.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {etape === 3 && (
          <>
            <h1>Quel est ton statut ?</h1>
            <label className="champ">
              <span>Profession / statut</span>
              <select required value={reponses.profession} onChange={majReponse('profession')}>
                <option value="" disabled>
                  Sélectionner
                </option>
                {PROFESSIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {etape === 4 && (
          <>
            <h1>Pourquoi utilises-tu l'app ?</h1>
            <label className="champ">
              <span>Motivation</span>
              <select required value={reponses.motivation} onChange={majReponse('motivation')}>
                <option value="" disabled>
                  Sélectionner
                </option>
                {MOTIVATIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {reponses.motivation === 'autre' && (
              <label className="champ">
                <span>Précise</span>
                <input
                  type="text"
                  required
                  value={reponses.motivationAutre}
                  onChange={majReponse('motivationAutre')}
                />
              </label>
            )}
          </>
        )}

        {erreur && <p className="message message-erreur">{erreur}</p>}

        <button
          type="button"
          className="bouton-primaire"
          disabled={!peutContinuer() || loading}
          onClick={handleSuivant}
        >
          {loading ? 'Enregistrement…' : etape < TOTAL_ETAPES ? 'Suivant' : 'Terminer'}
        </button>
      </div>
    </div>
  )
}

export default OnboardingFlow
