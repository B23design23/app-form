import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import ProgressBar from '../../components/ProgressBar'
import Dropdown from '../../components/Dropdown'
import skilloLogo from '../../Assets/Skillogo.svg'
import '../../styles/shared.css'
import './OnboardingFlow.css'

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
  organisme: '',
  specialite: '',
}

function OnboardingFlow({ authUser, role = 'apprenant', onTermine, onRetourCompte }) {
  const totalEtapes = role === 'formateur' ? 3 : 4

  const [etape, setEtape] = useState(1)
  const [reponses, setReponses] = useState(REPONSES_INITIALES)
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(null)

  const majReponse = (champ) => (eOuValeur) => {
    const valeur = typeof eOuValeur === 'string' ? eOuValeur : eOuValeur.target.value
    setReponses((prev) => ({ ...prev, [champ]: valeur }))
  }

  const peutContinuer = () => {
    if (etape === 1) return reponses.prenom.trim().length > 0

    if (role === 'formateur') {
      if (etape === 2) return reponses.organisme.trim().length > 0
      if (etape === 3) return reponses.specialite.trim().length > 0
      return false
    }

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

    if (etape < totalEtapes) {
      setEtape((e) => e + 1)
      return
    }

    setErreur(null)
    setLoading(true)

    const payloadBase = {
      id: authUser.id,
      email: authUser.email,
      role,
      prenom: reponses.prenom.trim(),
    }

    const payload =
      role === 'formateur'
        ? {
            ...payloadBase,
            organisme: reponses.organisme.trim(),
            specialite: reponses.specialite.trim(),
          }
        : {
            ...payloadBase,
            tranche_age: reponses.trancheAge,
            profession: reponses.profession,
            motivation:
              reponses.motivation === 'autre' ? reponses.motivationAutre.trim() : reponses.motivation,
          }

    const { error } = await supabase.from('profiles').insert(payload)

    setLoading(false)

    if (error) {
      setErreur(`Ton profil n'a pas pu être enregistré (${error.message}).`)
      return
    }

    onTermine()
  }

  return (
    <div className="flow-page">
      <div className="page-logo-wrapper">
        <img src={skilloLogo} alt="Skillo" className="page-logo" />

        <div className="flow-card">
          <button
            type="button"
            className={`lien-retour${etape === 1 ? '' : ' onboarding-lien-retour-invisible'}`}
            onClick={onRetourCompte}
            tabIndex={etape === 1 ? 0 : -1}
            aria-hidden={etape !== 1}
          >
            ← Retour
          </button>

          <ProgressBar etapeActuelle={etape} totalEtapes={totalEtapes} />

          <div className="onboarding-step">
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

            {role === 'formateur' ? (
              <>
                {etape === 2 && (
                  <>
                    <h1>Dans quel organisme enseignes-tu ?</h1>
                    <label className="champ">
                      <span>Organisme</span>
                      <input
                        type="text"
                        required
                        autoFocus
                        value={reponses.organisme}
                        onChange={majReponse('organisme')}
                      />
                    </label>
                  </>
                )}

                {etape === 3 && (
                  <>
                    <h1>Quelle spécialité enseignes-tu ?</h1>
                    <label className="champ">
                      <span>Spécialité</span>
                      <input
                        type="text"
                        required
                        autoFocus
                        value={reponses.specialite}
                        onChange={majReponse('specialite')}
                      />
                    </label>
                  </>
                )}
              </>
            ) : (
              <>
                {etape === 2 && (
                  <>
                    <h1>Quelle est ta tranche d'âge ?</h1>
                    <label className="champ">
                      <span>Tranche d'âge</span>
                      <Dropdown value={reponses.trancheAge} onChange={majReponse('trancheAge')} options={TRANCHES_AGE} />
                    </label>
                  </>
                )}

                {etape === 3 && (
                  <>
                    <h1>Quel est ton statut ?</h1>
                    <label className="champ">
                      <span>Profession / statut</span>
                      <Dropdown value={reponses.profession} onChange={majReponse('profession')} options={PROFESSIONS} />
                    </label>
                  </>
                )}

                {etape === 4 && (
                  <>
                    <h1>Pourquoi utilises-tu l'app ?</h1>
                    <label className="champ">
                      <span>Motivation</span>
                      <Dropdown value={reponses.motivation} onChange={majReponse('motivation')} options={MOTIVATIONS} />
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
              </>
            )}
          </div>

          {erreur && <p className="message message-erreur">{erreur}</p>}

          <div className="onboarding-actions">
            {etape > 1 && (
              <button type="button" className="bouton-secondaire" onClick={handleRetour} disabled={loading}>
                Précédent
              </button>
            )}
            <button
              type="button"
              className="bouton-primaire"
              disabled={!peutContinuer() || loading}
              onClick={handleSuivant}
            >
              {loading ? 'Enregistrement…' : etape < totalEtapes ? 'Suivant' : 'Terminer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingFlow
