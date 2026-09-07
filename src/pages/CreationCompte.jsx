import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/shared.css'

function CreationCompte({ onRetour, onSeConnecter }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [info, setInfo] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur(null)
    setInfo(null)
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({ email, password })

    setLoading(false)

    if (error) {
      setErreur(error.message)
      return
    }

    if (!data.session) {
      setInfo("Compte créé, mais aucune session n'a été ouverte. Vérifie la configuration Supabase Auth.")
    }
  }

  return (
    <div className="flow-page">
      <form className="flow-card" onSubmit={handleSubmit}>
        <button type="button" className="lien-retour" onClick={onRetour}>
          ← Retour
        </button>

        <h1>Créer mon compte</h1>

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {erreur && <p className="message message-erreur">{erreur}</p>}
        {info && <p className="message message-info">{info}</p>}

        <button type="submit" className="bouton-primaire" disabled={loading}>
          {loading ? 'Création en cours…' : 'Continuer'}
        </button>

        <button type="button" className="lien-secondaire" onClick={onSeConnecter}>
          Déjà un compte ? Se connecter
        </button>
      </form>
    </div>
  )
}

export default CreationCompte
