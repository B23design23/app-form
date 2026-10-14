import { useEffect, useRef } from 'react'
import Icone from './Icone'
import iconeRetour from '../Assets/chevron-left.svg?raw'
import { typo } from '../lib/typographie'
import './GabaritParcours.css'

// Gabarit unique du parcours d'entrée (Introduction, Connexion, Choix du profil, questions,
// Création du compte), même mise en page sur mobile et sur desktop (colonne de 440 px centrée).
// Zone d'action : bouton principal (58 px) à la même position sur tous les écrans, puis un
// emplacement réservé dessous pour le lien ou le bouton secondaire ; `points` (pagination de
// l'Introduction) se place juste au-dessus du bouton. Mobile : zone fixée en bas ; desktop :
// ancrée en bas d'une colonne de hauteur fixe. Le contenu garde une marge basse égale à la hauteur
// réelle de la zone (mesurée), et défile si besoin sans jamais passer dessous.
// barreSerree : 8 px entre la barre et le contenu (slide 1 : grand logo sous la ligne de « Passer »).
function GabaritParcours({ formateur = false, barre, barreSerree = false, onPasser, points, action, secondaire, children }) {
  const racineRef = useRef(null)
  const actionsRef = useRef(null)

  useEffect(() => {
    const actions = actionsRef.current
    const racine = racineRef.current
    if (!actions || !racine || typeof ResizeObserver === 'undefined') return
    const observateur = new ResizeObserver(() => {
      racine.style.setProperty('--hauteur-actions', `${actions.offsetHeight}px`)
    })
    observateur.observe(actions)
    return () => observateur.disconnect()
  }, [])

  return (
    <div ref={racineRef} className={`parcours${formateur ? ' parcours-formateur flow-page-formateur' : ''}`}>
      <main className={`parcours-colonne${barreSerree ? ' parcours-colonne-barre-serree' : ''}`}>
        <div className="parcours-barre">{barre}</div>
        <div className="parcours-contenu">{children}</div>
        <div ref={actionsRef} className="parcours-actions">
          {points && <div className="parcours-points">{points}</div>}
          <div className="parcours-action-principale">{action}</div>
          <div className="parcours-action-secondaire">{secondaire}</div>
        </div>
        {onPasser && (
          <button type="button" className="parcours-passer" onClick={onPasser}>
            Passer
          </button>
        )}
      </main>
    </div>
  )
}

// Barre du haut des questions, identique à celle du quiz : retour rond 56 px, progression, « 2 / 5 ».
export function BarreEtapes({ courante, total, onRetour }) {
  return (
    <div className="parcours-barre-etapes">
      <BoutonRetour onRetour={onRetour} />
      <span className="parcours-progression" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={courante}>
        <span className="parcours-progression-remplissage" style={{ width: `${(courante / total) * 100}%` }} />
      </span>
      <span className="parcours-compteur">
        {courante} / {total}
      </span>
    </div>
  )
}

export function BoutonRetour({ onRetour }) {
  return (
    <button type="button" className="parcours-bouton-rond" onClick={onRetour} aria-label="Retour">
      <Icone svg={iconeRetour} className="parcours-bouton-rond-icone" />
    </button>
  )
}

export function TitreParcours({ titre, sousTitre }) {
  return (
    <div className="parcours-titres">
      <h1 className="parcours-titre">{typo(titre)}</h1>
      {sousTitre && <p className="parcours-sous-titre">{typo(sousTitre)}</p>}
    </div>
  )
}

// Champ du parcours : libellé au-dessus (14 px, 800), pilule blanche 56 px sans bordure.
// grand : champ de saisie principal d'une question (64 px, rayon 20, texte 20 px 700).
export function ChampParcours({ label, grand = false, ...props }) {
  return (
    <label className={`parcours-champ${grand ? ' parcours-champ-grand' : ''}`}>
      <span className={grand ? 'parcours-champ-libelle-masque' : 'parcours-champ-libelle'}>{label}</span>
      <input className="parcours-input" {...props} />
    </label>
  )
}

// Lignes de choix (remplacent les listes déroulantes) : radiogroup utilisable au clavier
// (flèches pour changer de choix), pas d'avance automatique.
export function ChoixParcours({ libelle, options, valeur, onChange, colonnes = 1 }) {
  const refs = useRef([])
  const indexChoisi = options.findIndex((o) => o.value === valeur)

  function surTouche(e, index) {
    const suivant = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
    if (!suivant) return
    e.preventDefault()
    const cible = (index + suivant + options.length) % options.length
    onChange(options[cible].value)
    refs.current[cible]?.focus()
  }

  return (
    <div
      className={`parcours-choix${colonnes === 2 ? ' parcours-choix-2-colonnes' : ''}`}
      role="radiogroup"
      aria-label={libelle}
    >
      {options.map((option, index) => {
        const choisi = option.value === valeur
        return (
          <button
            key={option.value}
            ref={(el) => (refs.current[index] = el)}
            type="button"
            role="radio"
            aria-checked={choisi}
            tabIndex={choisi || (indexChoisi === -1 && index === 0) ? 0 : -1}
            className={`parcours-choix-ligne${choisi ? ' parcours-choix-ligne-choisie' : ''}`}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => surTouche(e, index)}
          >
            <span className="parcours-choix-texte">{typo(option.label)}</span>
            <span className="parcours-choix-rond" aria-hidden="true">
              {choisi && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17L4 12" />
                </svg>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default GabaritParcours
