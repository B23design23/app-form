import { useLayoutEffect, useRef } from 'react'

// Ligne de cours (ds-principes-composants.md, Ligne de liste) : le statut passe sous le titre dès que
// le titre devrait couper un mot, à toutes les largeurs. La ligne est d'abord mesurée statut à côté
// du titre ; si un mot du titre tient sur deux lignes (coupé), la classe CLASSE est posée sur la
// ligne et son CSS met le statut sous le titre. Remesurée quand la largeur de la ligne change et
// quand une police finit de charger.
export const CLASSE_STATUT_SOUS_TITRE = 'statut-sous-titre'

function motCoupe(titre) {
  const parcours = document.createTreeWalker(titre, NodeFilter.SHOW_TEXT)
  let noeud
  while ((noeud = parcours.nextNode())) {
    const mots = /\S+/g
    let m
    while ((m = mots.exec(noeud.data))) {
      const plage = document.createRange()
      plage.setStart(noeud, m.index)
      plage.setEnd(noeud, m.index + m[0].length)
      const hauts = new Set([...plage.getClientRects()].map((r) => Math.round(r.top)))
      if (hauts.size > 1) return true
    }
  }
  return false
}

// selecteurTitre : élément du titre dans la ligne ; texte : titre affiché (remesure s'il change)
export function useStatutSousTitre(selecteurTitre, texte) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const ligne = ref.current
    const titre = ligne?.querySelector(selecteurTitre)
    if (!ligne || !titre) return undefined
    let largeur = null
    let image = 0
    const mesurer = () => {
      largeur = ligne.getBoundingClientRect().width
      ligne.classList.remove(CLASSE_STATUT_SOUS_TITRE)
      if (motCoupe(titre)) ligne.classList.add(CLASSE_STATUT_SOUS_TITRE)
    }
    mesurer()
    // La hauteur de la ligne change avec la classe : seule une nouvelle largeur relance la mesure,
    // à l'image suivante (pas de changement de taille pendant la notification du ResizeObserver)
    const observateur = new ResizeObserver(() => {
      if (ligne.getBoundingClientRect().width === largeur) return
      cancelAnimationFrame(image)
      image = requestAnimationFrame(mesurer)
    })
    observateur.observe(ligne)
    // Police chargée après la première mesure : fonts.ready peut être déjà résolu avant que la police
    // ne soit demandée, d'où aussi l'événement loadingdone
    let actif = true
    const polices = document.fonts
    const apresPolices = () => { if (actif) mesurer() }
    polices?.ready.then(apresPolices)
    polices?.addEventListener?.('loadingdone', apresPolices)
    return () => {
      actif = false
      observateur.disconnect()
      polices?.removeEventListener?.('loadingdone', apresPolices)
      cancelAnimationFrame(image)
    }
  }, [selecteurTitre, texte])
  return ref
}
