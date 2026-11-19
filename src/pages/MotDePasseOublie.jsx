import { useState } from 'react'
import GabaritParcours, { BoutonRetour, ChampParcours, TitreParcours } from '../components/GabaritParcours'
import Logo from '../components/Logo'
import './parcours/Parcours.css'

// Même gabarit que la Connexion (ds-principes-composants.md, Conteneur de page) : Retour rond et
// logo en rangée, titres, champ posé sur la page, bouton dans la zone d'action. Le Retour remonte à
// la Connexion : son nom accessible la nomme.
function BarreRetourConnexion({ onRetour }) {
  return (
    <div className="connexion-barre">
      <BoutonRetour libelle="Connexion" onRetour={onRetour} />
      <Logo className="connexion-barre-logo" />
    </div>
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
      <GabaritParcours
        barre={<BarreRetourConnexion onRetour={onRetour} />}
        secondaire={
          <button type="button" className="lien-texte" onClick={onSimulerLien}>
            Simuler l'ouverture du lien reçu par email
          </button>
        }
      >
        <TitreParcours titre="Mot de passe oublié" />
        <p className="message message-info">Si ce compte existe, un email vient d'être envoyé.</p>
      </GabaritParcours>
    )
  }

  return (
    <GabaritParcours
      barre={<BarreRetourConnexion onRetour={onRetour} />}
      action={
        <button type="submit" form="form-mdp-oublie" className="bouton-primaire parcours-bouton">
          Envoyer le lien
        </button>
      }
    >
      <TitreParcours
        titre="Mot de passe oublié"
        sousTitre="Entre ton email, on t'envoie un lien pour réinitialiser ton mot de passe."
      />
      <form id="form-mdp-oublie" className="parcours-formulaire" onSubmit={handleSubmit}>
        <ChampParcours
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </form>
    </GabaritParcours>
  )
}

export default MotDePasseOublie
