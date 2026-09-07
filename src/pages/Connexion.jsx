import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/shared.css'

function Connexion({ onRetour, onCreerCompte }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setErreur(error.message)
    }
  }

  return (
    <div className="flow-page">
      <form className="flow-card" onSubmit={handleSubmit}>
        <button type="button" className="lien-retour" onClick={onRetour}>
          ← Retour
        </button>

        <h1>Se connecter</h1>

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

        <label className="champ">
          <span>Mot de passe</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {erreur && <p className="message message-erreur">{erreur}</p>}

        <button type="submit" className="bouton-primaire" disabled={loading}>
          {loading ? 'Connexion en cours…' : 'Se connecter'}
        </button>

        <button type="button" className="lien-secondaire" onClick={onCreerCompte}>
          Pas encore de compte ? Créer un compte
        </button>
      </form>
    </div>
  )
}

export default Connexion
