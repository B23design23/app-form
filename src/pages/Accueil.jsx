import '../styles/shared.css'
import './Accueil.css'

function Accueil({ onCommencer, onSeConnecter }) {
  return (
    <div className="flow-page">
      <div className="accueil-wrapper">
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

        <button type="button" className="lien-secondaire" onClick={onSeConnecter}>
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  )
}

export default Accueil
