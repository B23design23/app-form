import { useRef, useState } from 'react'
import skilloLogo from '../Assets/Skillogo.svg'
import illustrationSlide1 from '../Assets/badge/onboarding-1.svg'
import illustrationSlide2 from '../Assets/badge/onboarding-2.svg'
import illustrationSlide3 from '../Assets/badge/onboarding-3.svg'
import '../styles/shared.css'
import './Introduction.css'

const SLIDES = [
  {
    illustration: illustrationSlide1,
    titre: 'Progresse à ton rythme',
    texte: 'Des cours courts et pratiques pour monter en compétences, où que tu sois.',
  },
  {
    illustration: illustrationSlide2,
    titre: "Apprends en t'amusant",
    texte: "Des quiz interactifs, de l'XP à gagner et des badges à débloquer.",
  },
  {
    illustration: illustrationSlide3,
    titre: 'Passe à la pratique',
    texte: "Des checklists pratiques pour t'entraîner comme sur le terrain.",
  },
]

const SEUIL_SWIPE = 40

function Introduction({ onTermine }) {
  const [slideActuelle, setSlideActuelle] = useState(0)
  const derniere = slideActuelle === SLIDES.length - 1
  const premiere = slideActuelle === 0
  const slide = SLIDES[slideActuelle]
  const toucheDebutX = useRef(null)

  function allerA(index) {
    setSlideActuelle(Math.min(SLIDES.length - 1, Math.max(0, index)))
  }

  function handleSuivant() {
    if (derniere) {
      onTermine()
      return
    }
    allerA(slideActuelle + 1)
  }

  function handlePrecedente() {
    allerA(slideActuelle - 1)
  }

  function handleTouchStart(e) {
    toucheDebutX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (toucheDebutX.current === null) return
    const delta = e.changedTouches[0].clientX - toucheDebutX.current
    if (delta > SEUIL_SWIPE) {
      handlePrecedente()
    } else if (delta < -SEUIL_SWIPE) {
      handleSuivant()
    }
    toucheDebutX.current = null
  }

  return (
    <div className="flow-page">
      <div className="page-logo-wrapper">
        <img src={skilloLogo} alt="Skillo" className="page-logo" />

        <div
          className="flow-card introduction-card"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="introduction-entete">
            <button
              type="button"
              className="introduction-retour"
              onClick={handlePrecedente}
              aria-label="Slide précédente"
              aria-hidden={premiere}
              tabIndex={premiere ? -1 : 0}
              style={premiere ? { visibility: 'hidden' } : undefined}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>

          <img className="introduction-illustration" src={slide.illustration} alt="" aria-hidden="true" />

          <h1>{slide.titre}</h1>
          <p className="souscription">{slide.texte}</p>

          <div className="introduction-pagination">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`introduction-point${i === slideActuelle ? ' introduction-point-actif' : ''}`}
                onClick={() => allerA(i)}
                aria-label={`Aller à la slide ${i + 1}`}
                aria-current={i === slideActuelle}
              />
            ))}
          </div>

          <button type="button" className="bouton-primaire" onClick={handleSuivant}>
            {derniere ? 'Commencer' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Introduction
