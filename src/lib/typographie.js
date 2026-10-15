// Typographie française à l'affichage : l'espace (ordinaire ou insécable) placée avant « ? », « ! »,
// « : », « ; » et « % » devient une espace fine insécable (U+202F), pour que le signe ne parte jamais
// seul à la ligne ; « 90% » collé à un chiffre devient « 90 % » (espace fine). Appliquée aux textes de contenu (leçons, questions, réponses, explications,
// titres de cours). Les URL ne sont pas touchées (pas d'espace avant leurs « : »).
const ESPACE_AVANT_PONCTUATION = /[  ]+([?!:;])/g

export function typo(texte) {
  if (typeof texte !== 'string') return texte
  return texte.replace(ESPACE_AVANT_PONCTUATION, ' $1')
}
