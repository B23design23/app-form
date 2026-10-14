import { useEffect, useRef, useState } from 'react'
import AnneauProgression from '../../components/AnneauProgression'
import { ConfettiPastilles, salvesConfettiScore } from '../../components/Confetti'
import ContenuMarkdown from '../../components/ContenuMarkdown'
import { iconeBadge, conditionCourteBadge } from '../../lib/badges'
import { IMAGE_QUIZ_FLASH } from '../../lib/thematiques'
import Icone from '../../components/Icone'
import iconeRetour from '../../Assets/chevron-left.svg?raw'
import { typo } from '../../lib/typographie'

// Fin de quiz (quiz de cours et quiz flash) : écran complet. Animation ~1,5 s :
// anneau + compteur (0,7 s), confettis, pastille XP (rebond), cartes badge (glissement).
// prefers-reduced-motion : tout s'affiche directement, sans confettis.
const DUREE_ANNEAU = 700
export const SEUIL_REUSSITE = 50

function mouvementReduit() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

function titreScore(score) {
  if (score === 100) return 'Sans faute !'
  if (score >= 60) return 'Belle maîtrise !'
  return 'Tu y es presque'
}

function sousTitreErreurs(nbErreurs) {
  if (nbErreurs === 0) return 'Aucune erreur, bravo.'
  if (nbErreurs === 1) return 'Une seule erreur à revoir.'
  return `${nbErreurs} erreurs à revoir.`
}

// titreBarre : texte de la barre du haut (titre du cours, une ligne) ; onRetour : bouton retour
// rond de la barre (thème du cours / dashboard) ; libelle : petit libellé au-dessus de l'anneau ;
// titre / sousTitre : remplacent les textes par défaut ;
// actionPrincipale : { bouton, onClick } ; liens : liens secondaires ({ bouton, onClick }), affichés
// avec « Revoir mes erreurs » sur une seule ligne.
// Questions ratées avec ta réponse, la bonne réponse et l'explication (« Revoir mes erreurs »).
function ListeErreurs({ erreurs }) {
  return (
    <ul className="fin-quiz-erreurs">
      {erreurs.map(({ question, selection }) => {
        const choisies = question.reponses.filter((r) => selection.includes(r.id))
        const bonnesReponses = question.reponses.filter((r) => r.est_correcte)
        const explications = choisies.filter((r) => !r.est_correcte && r.explication).map((r) => typo(r.explication))
        return (
          <li key={question.id} className="fiche-carte fin-quiz-erreur">
            <ContenuMarkdown texte={question.enonce} className="fin-quiz-erreur-question" />
            <p className="fin-quiz-erreur-ligne fin-quiz-erreur-fausse">
              Ta réponse : {typo(choisies.map((r) => r.texte).join(', ')) || '—'}
            </p>
            <p className="fin-quiz-erreur-ligne fin-quiz-erreur-bonne">
              Bonne réponse : {typo(bonnesReponses.map((r) => r.texte).join(', '))}
            </p>
            {explications.map((texte) => (
              <p key={texte} className="fin-quiz-erreur-explication">
                {texte}
              </p>
            ))}
          </li>
        )
      })}
    </ul>
  )
}

function EcranFinQuiz({ titreBarre, onRetour, libelle = 'Quiz terminé', resultat, titre, sousTitre, actionPrincipale, liens = [] }) {
  const { bonnes, total, score, xpGagne, badges, historique } = resultat
  const reduit = mouvementReduit()
  const [compteur, setCompteur] = useState(reduit ? bonnes : 0)
  const [ratioAffiche, setRatioAffiche] = useState(reduit ? score / 100 : 0)
  const [declencheurConfetti, setDeclencheurConfetti] = useState(null)
  const [erreursOuvertes, setErreursOuvertes] = useState(false)
  const anneauRef = useRef(null)

  const erreurs = historique.filter((h) => !h.correcte)

  useEffect(() => {
    if (reduit) return
    // Anneau : la transition CSS du trait suit ce ratio ; le chiffre central compte en parallèle.
    const raf = requestAnimationFrame(() => setRatioAffiche(score / 100))
    const debut = performance.now()
    let idAnimation
    const compter = (maintenant) => {
      const avancement = Math.min(1, (maintenant - debut) / DUREE_ANNEAU)
      setCompteur(Math.round(avancement * bonnes))
      if (avancement < 1) idAnimation = requestAnimationFrame(compter)
    }
    idAnimation = requestAnimationFrame(compter)
    const minuteurConfetti = setTimeout(() => setDeclencheurConfetti({}), DUREE_ANNEAU)
    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(idAnimation)
      clearTimeout(minuteurConfetti)
    }
  }, [reduit, score, bonnes])

  // Confettis « pastilles et anneaux » selon le score (aucun sous 50 %), depuis le centre de l'anneau
  const salves = salvesConfettiScore(score)

  return (
    <div className="fin-quiz">
      <ConfettiPastilles declencheur={declencheurConfetti} origineRef={anneauRef} salves={salves} />

      {/* Même barre du haut que pendant le quiz : retour à gauche, titre du cours à la place de la barre */}
      <div className="fiche-quiz-haut fin-quiz-haut">
        <button type="button" className="fiche-bouton-rond" onClick={onRetour} aria-label="Retour">
          <Icone svg={iconeRetour} className="fiche-bouton-rond-icone" />
        </button>
        <span className="fin-quiz-haut-titre">{typo(titreBarre)}</span>
      </div>

      <div className="fin-quiz-colonne">
        {/* Groupe du score : centré verticalement au-dessus des actions sur mobile */}
        <div className="fin-quiz-contenu">
          <span className="fin-quiz-libelle">{libelle}</span>

          <span ref={anneauRef} className="fin-quiz-anneau-repere">
            <AnneauProgression
              radius={76}
              strokeWidth={16}
              ratio={ratioAffiche}
              trackColor="var(--color-surface)"
              progressColor="var(--color-primary)"
              wrapperClassName="fin-quiz-anneau"
            >
              <span className="fin-quiz-anneau-centre" aria-label={`${bonnes} sur ${total}, ${score} %`}>
                <span className="fin-quiz-anneau-score">
                  {compteur}/{total}
                </span>
                <span className="fin-quiz-anneau-pourcent">{score} %</span>
              </span>
            </AnneauProgression>
          </span>

          <h1 className="fin-quiz-titre">{titre ?? titreScore(score)}</h1>
          <p className="fin-quiz-sous-titre">{sousTitre ?? sousTitreErreurs(erreurs.length)}</p>

          {xpGagne > 0 && (
            <span className="fin-quiz-xp">
              <img src={IMAGE_QUIZ_FLASH} alt="" />+{xpGagne} XP
            </span>
          )}

          {badges.map((badge) => (
            <div key={badge.id} className="fin-quiz-badge">
              <img className="fin-quiz-badge-objet" src={iconeBadge(badge)} alt="" />
              <div className="fin-quiz-badge-texte">
                <span className="fin-quiz-badge-pastille">Nouveau badge</span>
                <span className="fin-quiz-badge-nom">{badge.nom}</span>
                <span className="fin-quiz-badge-condition">{conditionCourteBadge(badge.condition_deblocage)}</span>
              </div>
            </div>
          ))}
        </div>

        {erreursOuvertes && <ListeErreurs erreurs={erreurs} />}

        {/* Actions : barre fixe en bas sur mobile (fond lavande), sous le contenu sur desktop */}
        <div className="fiche-barre-action fin-quiz-actions">
          <div className="fiche-barre-action-contenu">
            <button type="button" className="bouton-primaire fin-quiz-bouton" onClick={actionPrincipale.onClick}>
              {actionPrincipale.bouton}
            </button>

            {(erreurs.length > 0 || liens.length > 0) && (
              <div className="fin-quiz-liens">
                {erreurs.length > 0 && (
                  <button
                    type="button"
                    className="fin-quiz-lien"
                    aria-expanded={erreursOuvertes}
                    onClick={() => setErreursOuvertes((v) => !v)}
                  >
                    {erreursOuvertes ? 'Masquer mes erreurs' : 'Revoir mes erreurs'}
                  </button>
                )}
                {liens.map((lien) => (
                  <button key={lien.bouton} type="button" className="fin-quiz-lien" onClick={lien.onClick}>
                    {lien.bouton}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EcranFinQuiz
