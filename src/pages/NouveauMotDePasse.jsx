import { useState } from 'react'
import GabaritParcours, { ChampParcours, TitreParcours } from '../components/GabaritParcours'
import Logo from '../components/Logo'
import './parcours/Parcours.css'

// Même gabarit que la Connexion (ds-principes-composants.md, Conteneur de page) : emplacement du
// Retour vide (le logo ne bouge pas), titre, champs posés sur la page, bouton dans la zone d'action.
function NouveauMotDePasse({ onTermine }) {
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onTermine()
  }

  return (
    <GabaritParcours
      barre={
        <div className="connexion-barre">
          <span className="bouton-rond parcours-bouton-rond connexion-retour-vide" aria-hidden="true" />
          <Logo className="connexion-barre-logo" />
        </div>
      }
      action={
        <button type="submit" form="form-nouveau-mdp" className="bouton-primaire parcours-bouton">
          Réinitialiser le mot de passe
        </button>
      }
    >
      <TitreParcours titre="Nouveau mot de passe" />
      <form id="form-nouveau-mdp" className="parcours-formulaire" onSubmit={handleSubmit}>
        <ChampParcours
          label="Nouveau mot de passe"
          type="password"
          required
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          autoComplete="new-password"
        />
        <ChampParcours
          label="Confirmer le mot de passe"
          type="password"
          required
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          autoComplete="new-password"
        />
      </form>
    </GabaritParcours>
  )
}

export default NouveauMotDePasse
