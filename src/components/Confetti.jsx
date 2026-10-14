import { useEffect, useRef } from 'react'
import './Confetti.css'

// Intensité des confettis du toast de complétion (une salve « pastilles et anneaux ») :
// - 'checklist' : toujours une salve moyenne, quel que soit le mode de validation ;
// - 'badge' (ou sans type, ex. badge débloqué à l'ouverture d'un cours ou cours terminé) : salve
//   moyenne uniquement si un badge est présent.
// La fin de quiz a sa propre règle, selon le score seul (salvesConfettiScore).
export function calculerIntensiteConfetti(overlay) {
  if (!overlay) return 0
  if (overlay.type === 'checklist') return 45
  return (overlay.badges ?? []).length > 0 ? 45 : 0
}

// --- Confettis « pastilles et anneaux » (fin de quiz de cours et quiz flash) ------------------
// Canvas natif : 60 % de pastilles (disques 5-10 px), 40 % d'arcs à trois quarts d'anneau (rayon
// 4-8 px, trait 2,5 px, extrémités rondes), 5 couleurs à parts égales. Gerbe depuis le centre de
// l'anneau de score, légère poussée vers le haut, gravité, freinage de l'air, rotation propre,
// effacement progressif sur ~2,5 s. Canvas par-dessus l'écran, sans capter les clics.

const COULEURS_PASTILLES = ['#5B3FE0', '#F6A55E', '#1E1A33', '#FFFFFF', '#4630B8']
const DUREE_VIE = 2.5 // s
const GRAVITE = 900 // px/s²
const FREINAGE = 0.35 // part de vitesse conservée après 1 s
const POUSSEE_HAUT = 220 // px/s

// Salves selon le score : 100 % → 2 × 70 (la seconde à 400 ms) ; 60-99 % → 70 ; 50-59 % → 35 ;
// sous 50 % → aucune.
export function salvesConfettiScore(score) {
  if (score >= 100) return [{ nb: 70, delai: 0 }, { nb: 70, delai: 400 }]
  if (score >= 60) return [{ nb: 70, delai: 0 }]
  if (score >= 50) return [{ nb: 35, delai: 0 }]
  return []
}

function creerConfetti(x, y) {
  const angle = Math.random() * Math.PI * 2
  const vitesse = 250 + Math.random() * 450
  const arc = Math.random() < 0.4
  return {
    x,
    y,
    vx: Math.cos(angle) * vitesse,
    vy: Math.sin(angle) * vitesse - POUSSEE_HAUT,
    rotation: Math.random() * Math.PI * 2,
    vitesseRotation: (Math.random() - 0.5) * 12,
    arc,
    taille: arc ? 4 + Math.random() * 4 : 2.5 + Math.random() * 2.5, // rayon de l'arc / du disque
    couleur: COULEURS_PASTILLES[Math.floor(Math.random() * COULEURS_PASTILLES.length)],
    age: 0,
  }
}

function dessinerConfetti(ctx, c) {
  ctx.save()
  ctx.globalAlpha = Math.max(0, 1 - (c.age / DUREE_VIE) ** 2)
  ctx.translate(c.x, c.y)
  ctx.rotate(c.rotation)
  if (c.arc) {
    ctx.strokeStyle = c.couleur
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(0, 0, c.taille, -Math.PI / 2, Math.PI)
    ctx.stroke()
  } else {
    ctx.fillStyle = c.couleur
    ctx.beginPath()
    ctx.arc(0, 0, c.taille, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

// declencheur : nouvelle référence = nouveau lancement ; origineRef : élément dont le centre sert
// de point de départ (centre de l'écran à défaut) ; salves : [{ nb, delai }].
export function ConfettiPastilles({ declencheur, origineRef, salves }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!declencheur || !canvas || !salves?.length) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    // Taille calculée au moment du lancement
    const ratio = window.devicePixelRatio || 1
    const largeur = window.innerWidth
    const hauteur = window.innerHeight
    canvas.width = largeur * ratio
    canvas.height = hauteur * ratio
    canvas.style.width = `${largeur}px`
    canvas.style.height = `${hauteur}px`
    const ctx = canvas.getContext('2d')
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

    const rect = origineRef?.current?.getBoundingClientRect()
    const origine = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: largeur / 2, y: hauteur / 2 }

    let confettis = []
    let salvesRestantes = salves.length
    const minuteurs = salves.map((salve) =>
      setTimeout(() => {
        for (let i = 0; i < salve.nb; i++) confettis.push(creerConfetti(origine.x, origine.y))
        salvesRestantes -= 1
      }, salve.delai)
    )

    let precedent = performance.now()
    let idAnimation
    const animer = (maintenant) => {
      const dt = Math.min(0.05, (maintenant - precedent) / 1000)
      precedent = maintenant
      const conservation = FREINAGE ** dt
      confettis = confettis.filter((c) => c.age < DUREE_VIE)
      for (const c of confettis) {
        c.vx *= conservation
        c.vy = c.vy * conservation + GRAVITE * dt
        c.x += c.vx * dt
        c.y += c.vy * dt
        c.rotation += c.vitesseRotation * dt
        c.age += dt
      }
      ctx.clearRect(0, 0, largeur, hauteur)
      confettis.forEach((c) => dessinerConfetti(ctx, c))
      if (confettis.length > 0 || salvesRestantes > 0) idAnimation = requestAnimationFrame(animer)
    }
    idAnimation = requestAnimationFrame(animer)

    return () => {
      minuteurs.forEach(clearTimeout)
      cancelAnimationFrame(idAnimation)
      ctx.clearRect(0, 0, largeur, hauteur)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [declencheur])

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />
}

