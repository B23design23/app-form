import { useEffect, useRef, useState } from 'react'
import GabaritParcours from '../../components/GabaritParcours'
import Logo from '../../components/Logo'
import { IMAGE_COURS, IMAGE_QUIZ_FLASH, imageTheme } from '../../lib/thematiques'
import { typo } from '../../lib/typographie'
import './Parcours.css'

// Introduction (3 slides), affichée à la première visite sur l'appareil seulement (voir App.jsx).
// Aucune mention de la climatisation : le moteur reste valable pour d'autres domaines.
const SLIDES = [
  {
    objet: IMAGE_COURS,
    titre: 'Apprends ton métier, de la leçon au terrain',
    texte: 'Des cours courts, à ton rythme. Une leçon et un quiz, dix minutes suffisent.',
  },
  {
    objet: IMAGE_QUIZ_FLASH,
    titre: "Gagne de l'XP",
    texte: 'Chaque quiz réussi rapporte des points et débloque des badges.',
  },
  {
    objet: imageTheme('Installation & mise en service'), // clé à molette
    titre: 'Passe à la pratique',
    texte: 'Sur le terrain, ta checklist te guide étape par étape.',
  },
]

const CLE_INTRODUCTION_VUE = 'skillo:introduction-vue'
const SEUIL_SWIPE = 40

export function introductionDejaVue() {
  try {
    return window.localStorage.getItem(CLE_INTRODUCTION_VUE) === '1'
  } catch {
    return false
  }
}

function Introduction({ slideInitiale = 0, onCreerCompte, onSeConnecter, onPasser }) {
  const [slideActuelle, setSlideActuelle] = useState(slideInitiale)
  const toucheDebutX = useRef(null)
  const derniere = slideActuelle === SLIDES.length - 1
  const slide = SLIDES[slideActuelle]

  // Première visite : on retient que l'introduction a été vue sur cet appareil
  useEffect(() => {
    try {
      window.localStorage.setItem(CLE_INTRODUCTION_VUE, '1')
    } catch {
      // stockage indisponible : l'introduction se réaffichera, sans autre conséquence
    }
  }, [])

  const allerA = (index) => setSlideActuelle(Math.min(SLIDES.length - 1, Math.max(0, index)))

  return (
    <GabaritParcours
      // Points de pagination : dans la zone d'action fixe, juste au-dessus du bouton
      points={SLIDES.map((_, i) => (
        <button
          key={i}
          type="button"
          className={`introduction-point${i === slideActuelle ? ' introduction-point-actif' : ''}`}
          onClick={() => allerA(i)}
          aria-label={`Aller à la slide ${i + 1}`}
          aria-current={i === slideActuelle ? 'step' : undefined}
        />
      ))}
      // « Passer » (slides 1 et 2) : directement la Connexion ; l'intro est déjà marquée vue au montage
      onPasser={derniere ? undefined : onPasser}
      barreSerree={slideActuelle === 0}
      // Slide 1 : barre vide (même hauteur, « Passer » à droite), grand logo centré dessous
      barre={slideActuelle > 0 ? <Logo className="intro-logo-petit" /> : <span aria-hidden="true" />}
      action={
        derniere ? (
          <button type="button" className="bouton-primaire parcours-bouton" onClick={onCreerCompte}>
            Créer mon compte
          </button>
        ) : (
          <button type="button" className="bouton-primaire parcours-bouton" onClick={() => allerA(slideActuelle + 1)}>
            Suivant
          </button>
        )
      }
      secondaire={
        derniere ? (
          <button type="button" className="bouton-secondaire parcours-bouton" onClick={onSeConnecter}>
            J'ai déjà un compte
          </button>
        ) : null
      }
    >
      <div
        className="intro-slide"
        onTouchStart={(e) => (toucheDebutX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (toucheDebutX.current === null) return
          const delta = e.changedTouches[0].clientX - toucheDebutX.current
          if (delta < -SEUIL_SWIPE) allerA(slideActuelle + 1)
          if (delta > SEUIL_SWIPE) allerA(slideActuelle - 1)
          toucheDebutX.current = null
        }}
      >
        {slideActuelle === 0 && <Logo className="intro-logo-grand" />}
        <div className="intro-bloc">
          <img className="intro-objet" src={slide.objet} alt="" />
        </div>
        <div className="parcours-titres">
          <h1 className="parcours-titre">{typo(slide.titre)}</h1>
          <p className="parcours-sous-titre">{typo(slide.texte)}</p>
        </div>
      </div>
    </GabaritParcours>
  )
}

export default Introduction
