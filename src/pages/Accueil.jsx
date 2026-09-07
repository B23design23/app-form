import '../styles/shared.css'
import './Accueil.css'

function Accueil({ onCommencer, onSeConnecter }) {
  return (
    <div className="flow-page">
      <div className="flow-card accueil-card">
        <svg
          className="accueil-illustration"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="52" stroke="#e2e6ea" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="52"
            stroke="var(--color-primary)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="326.7"
            strokeDashoffset="110"
            transform="rotate(-90 60 60)"
          />
          <circle cx="60" cy="60" r="14" fill="var(--color-accent-warm)" />
        </svg>

        <h1>Progresse à ton rythme</h1>
        <p className="souscription">
          Des cours courts, des quiz et des checklists terrain pour monter en compétences,
          où que tu sois.
        </p>

        <button type="button" className="bouton-primaire" onClick={onCommencer}>
          Commencer
        </button>

        <button type="button" className="lien-secondaire" onClick={onSeConnecter}>
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  )
}

export default Accueil
