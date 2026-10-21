// Préprocesseur Style Dictionary : résout les références par composante ($ref JSON Pointer)
// des tokens de couleur, par exemple { "$ref": "#/couleur/ardoise-900/$value/components/0" }.
//
// Cette étape existe seulement parce que Style Dictionary 5 ne prend pas encore en charge cette
// partie de la spécification DTCG 2025.10 : il ignore les $ref, lit le champ hex et perd l'alpha
// (fond-voile sortirait en encre opaque). À supprimer quand l'outil les résoudra lui-même.
//
// Les fichiers de tokens/ ne sont pas modifiés : la résolution se fait en mémoire, sur l'arbre
// fusionné de toutes les sources (les $ref visent le fichier des primitifs).
// Pour que le CSS garde le lien vers le primitif, le chemin du primitif d'origine est noté sur le
// token (CLE_PRIMITIF), quand ses trois composantes viennent du même primitif.

export const NOM_PREPROCESSEUR = 'skillo/resoudre-ref-composantes'
export const CLE_PRIMITIF = 'skillo.composantes-de'

const REF_COMPOSANTE = /^#\/(.+)\/\$value\/components\/\d+$/

function lirePointeur(racine, pointeur) {
  if (!pointeur.startsWith('#/')) throw new Error(`$ref non pris en charge : ${pointeur}`)
  return pointeur
    .slice(2)
    .split('/')
    .map((partie) => partie.replace(/~1/g, '/').replace(/~0/g, '~'))
    .reduce((noeud, partie) => {
      if (noeud == null || !(partie in Object(noeud))) {
        throw new Error(`$ref introuvable : ${pointeur}`)
      }
      return noeud[partie]
    }, racine)
}

function resoudre(racine, valeur, chaine) {
  if (valeur && typeof valeur === 'object' && !Array.isArray(valeur) && '$ref' in valeur) {
    const pointeur = valeur.$ref
    if (chaine.includes(pointeur)) {
      throw new Error(`Référence circulaire : ${[...chaine, pointeur].join(' → ')}`)
    }
    return resoudre(racine, lirePointeur(racine, pointeur), [...chaine, pointeur])
  }
  return valeur
}

function parcourir(racine, noeud) {
  if (!noeud || typeof noeud !== 'object') return
  const valeur = noeud.$value
  if (valeur && typeof valeur === 'object' && Array.isArray(valeur.components)) {
    const refs = valeur.components.map((c) => c?.$ref).filter(Boolean)
    if (refs.length > 0) {
      const primitifs = new Set(refs.map((ref) => ref.match(REF_COMPOSANTE)?.[1]))
      valeur.components = valeur.components.map((c) => resoudre(racine, c, []))
      if (refs.length === valeur.components.length && primitifs.size === 1) {
        const [primitif] = primitifs
        if (primitif) {
          noeud.$extensions = { ...noeud.$extensions, [CLE_PRIMITIF]: primitif.split('/').join('.') }
        }
      }
    }
    return
  }
  for (const [cle, enfant] of Object.entries(noeud)) {
    if (!cle.startsWith('$')) parcourir(racine, enfant)
  }
}

export const resoudreRefComposantes = {
  name: NOM_PREPROCESSEUR,
  preprocessor: (dictionnaire) => {
    // Copie : les $ref doivent rester lisibles pendant tout le parcours.
    const racine = structuredClone(dictionnaire)
    parcourir(racine, dictionnaire)
    return dictionnaire
  },
}
