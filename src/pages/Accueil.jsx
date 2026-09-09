import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import skilloLogo from '../Assets/Skillogo.svg'
import '../styles/shared.css'
import './Accueil.css'

function Accueil({ onCommencer }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(null)

  async function handleSubmit(e) {
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
      <div className="page-logo-wrapper">
        <img src={skilloLogo} alt="Skillo" className="page-logo" />

        <form className="accueil-carte" onSubmit={handleSubmit}>
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
        </form>

        <div className="accueil-carte accueil-roles-carte">
          <h2 className="accueil-roles-titre">Nouveau sur skillo? vous êtes :</h2>

          <div className="accueil-role-carte">
            <span className="accueil-role-icone" aria-hidden="true">
              📖
            </span>
            <h2>Apprenant</h2>
            <p>Suis des cours, passe des quiz, progresse à ton rythme.</p>
            <button type="button" className="bouton-primaire" onClick={() => onCommencer('apprenant')}>
              Je suis apprenant
            </button>
          </div>

          <div className="accueil-role-carte">
            <span className="accueil-role-icone" aria-hidden="true">
              🧑‍🏫
            </span>
            <h2>Formateur</h2>
            <p>Crée du contenu et suis la progression de tes élèves.</p>
            <button type="button" className="bouton-secondaire" onClick={() => onCommencer('formateur')}>
              Je suis formateur
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Accueil
