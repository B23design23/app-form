import { useState } from 'react'
import skilloLogo from '../Assets/Skillogo.svg'
import '../styles/shared.css'

function NouveauMotDePasse({ onTermine }) {
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onTermine()
  }

  return (
    <div className="flow-page">
      <div className="page-logo-wrapper">
        <img src={skilloLogo} alt="Skillo" className="page-logo" />

        <form className="flow-card" onSubmit={handleSubmit}>
          <h1>Nouveau mot de passe</h1>

          <label className="champ">
            <span>Nouveau mot de passe</span>
            <input
              type="password"
              required
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              autoComplete="new-password"
            />
          </label>

          <label className="champ">
            <span>Confirmer le mot de passe</span>
            <input
              type="password"
              required
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              autoComplete="new-password"
            />
          </label>

          <button type="submit" className="bouton-primaire">
            Réinitialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  )
}

export default NouveauMotDePasse
