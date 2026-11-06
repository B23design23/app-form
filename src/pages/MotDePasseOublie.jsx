import { useState } from 'react'
import Logo from '../components/Logo'
import Icone from '../components/Icone'
import iconeRetour from '../Assets/chevron-left.svg?raw'
import '../styles/shared.css'

// Variante Retour du Bouton : remonte à la Connexion. Sur mobile, chevron seul ; le nom accessible
// contient le libellé visible (« Connexion »).
function BoutonRetourConnexion({ onRetour }) {
  return (
    <button type="button" className="lien-retour" onClick={onRetour} aria-label="Retour à la connexion">
      <Icone svg={iconeRetour} className="lien-retour-icone" />
      <span className="lien-retour-libelle">Connexion</span>
    </button>
  )
}

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
          <BoutonRetourConnexion onRetour={onRetour} />
          <Logo className="page-logo" />

          <div className="flow-card">
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
        <BoutonRetourConnexion onRetour={onRetour} />
        <Logo className="page-logo" />

        <form className="flow-card" onSubmit={handleSubmit}>
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
