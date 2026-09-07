import { useState } from 'react'
import '../styles/shared.css'
import './Introduction.css'

const SLIDES = [
  {
    icone: '🎯',
    titre: 'Progresse à ton rythme',
    texte: 'Des cours courts et pratiques pour monter en compétences, où que tu sois.',
  },
  {
    icone: '🏅',
    titre: "Apprends en t'amusant",
    texte: "Des quiz interactifs, de l'XP à gagner et des badges à débloquer.",
  },
  {
    icone: '🧰',
    titre: 'Passe à la pratique',
    texte: "Des checklists terrain pour t'entraîner comme sur le terrain.",
  },
]

function Introduction({ onTermine }) {
  const [slideActuelle, setSlideActuelle] = useState(0)
  const derniere = slideActuelle === SLIDES.length - 1
  const slide = SLIDES[slideActuelle]

  function handleSuivant() {
    if (derniere) {
      onTermine()
      return
    }
    setSlideActuelle((i) => i + 1)
  }

  return (
    <div className="flow-page">
      <div className="flow-card introduction-card">
        <div className="introduction-illustration-wrapper">
          <svg viewBox="0 0 120 120" className="introduction-illustration" aria-hidden="true">
            <circle cx="60" cy="60" r="52" stroke="var(--color-anneau-fond)" strokeWidth="10" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="52"
              stroke="var(--color-primary)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="326.7"
              strokeDashoffset="110"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <span className="introduction-icone" aria-hidden="true">
            {slide.icone}
          </span>
        </div>

        <h1>{slide.titre}</h1>
        <p className="souscription">{slide.texte}</p>

        <div className="introduction-pagination" aria-hidden="true">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`introduction-point${i === slideActuelle ? ' introduction-point-actif' : ''}`}
            />
          ))}
        </div>

        <button type="button" className="bouton-primaire" onClick={handleSuivant}>
          {derniere ? 'Commencer' : 'Suivant'}
        </button>
      </div>
    </div>
  )
}

export default Introduction
