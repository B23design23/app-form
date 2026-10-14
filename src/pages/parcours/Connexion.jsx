import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import GabaritParcours, { BoutonRetour, ChampParcours, TitreParcours } from '../../components/GabaritParcours'
import Logo from '../../components/Logo'
import { messageErreurAuth } from './erreursAuth'
import './Parcours.css'

function Connexion({ messageConfirmation, onRetour, onCreerCompte, onMotDePasseOublie }) {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState(null)

  async function seConnecter(e) {
    e.preventDefault()
    setErreur(null)
    setEnvoi(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse })
    setEnvoi(false)
    if (error) setErreur(messageErreurAuth(error))
  }

  return (
    <GabaritParcours
      // Point d'entrée direct d'un utilisateur qui revient : petit logo centré dans la ligne du retour
      barre={
        <div className="connexion-barre">
          <BoutonRetour onRetour={onRetour} />
          <Logo className="connexion-barre-logo" />
        </div>
      }
      action={
        <button
          type="submit"
          form="form-connexion"
          className="bouton-primaire parcours-bouton"
          disabled={envoi || !email.trim() || !motDePasse}
        >
          {envoi ? 'Connexion…' : 'Se connecter'}
        </button>
      }
      secondaire={
        <button type="button" className="parcours-lien" onClick={onCreerCompte}>
          Pas encore de compte ? <strong>Créer mon compte</strong>
        </button>
      }
    >
      <TitreParcours titre="Content de te revoir" sousTitre="Reprends là où tu t'étais arrêté." />

      {messageConfirmation && <p className="message message-info">{messageConfirmation}</p>}

      <form id="form-connexion" className="parcours-formulaire" onSubmit={seConnecter}>
        <ChampParcours label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        <ChampParcours
          label="Mot de passe"
          type="password"
          required
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          autoComplete="current-password"
        />
        {erreur && <p className="parcours-message-erreur">{erreur}</p>}
        <button type="button" className="parcours-lien parcours-lien-droite" onClick={onMotDePasseOublie}>
          <strong>Mot de passe oublié ?</strong>
        </button>
      </form>
    </GabaritParcours>
  )
}

export default Connexion
