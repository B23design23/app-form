import { useState } from 'react'
import skilloLogo from '../Assets/Skillogo.svg'
import '../styles/shared.css'

function MotDePasseOublie({ onRetour, onSimulerLien }) {
  const [email, setEmail] = useState('')
  const [envoye, setEnvoye] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setEnvoye(true)
  }

  if (envoye) {
    return (
      <div className="flow-page">
        <div className="page-logo-wrapper">
          <img src={skilloLogo} alt="Skillo" className="page-logo" />

          <div className="flow-card">
            <button type="button" className="lien-retour" onClick={onRetour}>
              ← Retour
            </button>

            <h1>Mot de passe oublié</h1>

            <p className="message message-info">Si ce compte existe, un email vient d'être envoyé.</p>

            <button type="button" className="lien-secondaire" onClick={onSimulerLien}>
              Simuler l'ouverture du lien reçu par email
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flow-page">
      <div className="page-logo-wrapper">
        <img src={skilloLogo} alt="Skillo" className="page-logo" />

        <form className="flow-card" onSubmit={handleSubmit}>
          <button type="button" className="lien-retour" onClick={onRetour}>
            ← Retour
          </button>

          <h1>Mot de passe oublié</h1>

          <p className="souscription">
            Entre ton email, on t'envoie un lien pour réinitialiser ton mot de passe.
          </p>

          <label className="champ">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <button type="submit" className="bouton-primaire">
            Envoyer le lien
          </button>
        </form>
      </div>
    </div>
  )
}

export default MotDePasseOublie
