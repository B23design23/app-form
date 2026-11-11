// Données de la page /design-system, lues au build : tokens/ (valeurs, descriptions), la
// documentation du DS (règles reprises telles quelles) et le :root de shared.css pour les valeurs
// pas encore tokenisées. Aucune valeur n'est écrite à la main ici.
import primitifsJson from '../../tokens/primitifs-couleurs.tokens.json'
import espacementsJson from '../../tokens/espacements.tokens.json'
import rayonsJson from '../../tokens/rayons.tokens.json'
import communsJson from '../../tokens/semantiques-communs.tokens.json'
import apprenantJson from '../../tokens/semantiques-apprenant.tokens.json'
import formateurJson from '../../tokens/semantiques-formateur.tokens.json'
import principesMd from '../../docs/design-system/ds-principes-composants.md?raw'
import couleursMd from '../../docs/tokens/couleurs.md?raw'
import notesMd from '../../docs/design-system/notes-de-version.md?raw'
import sharedCss from '../styles/shared.css?raw'

const estToken = (noeud) => noeud && typeof noeud === 'object' && '$value' in noeud
const entrees = (groupe) => Object.entries(groupe ?? {}).filter(([nom, v]) => !nom.startsWith('$') && estToken(v))

// --- Couleurs -------------------------------------------------------------------------------------

export const primitifs = entrees(primitifsJson.couleur).map(([nom, token]) => ({
  nom,
  hex: token.$value.hex,
  description: token.$description,
}))
const hexPrimitif = Object.fromEntries(primitifs.map((p) => [p.nom, p.hex]))

// Primitif visé par un sémantique : alias {couleur.x}, ou composantes en $ref avec un alpha propre
function cible(token) {
  const v = token.$value
  if (typeof v === 'string') {
    const nom = v.replace(/^\{couleur\.|\}$/g, '')
    return { primitif: nom, hex: hexPrimitif[nom], alpha: null }
  }
  const nom = v.components?.[0]?.$ref?.match(/^#\/couleur\/([^/]+)\//)?.[1]
  return { primitif: nom, hex: hexPrimitif[nom], alpha: v.alpha }
}

const ROLES = [
  ['recompense', 'Récompense'],
  ['succes', 'Succès'],
  ['erreur', 'Erreur'],
]
// Rôle d'affichage : récompense, succès, erreur, actions (action et focus), puis la propriété
function role(nom) {
  for (const [motif, libelle] of ROLES) if (nom.includes(motif)) return libelle
  if (/(^|-)action(-|$)|focus/.test(nom)) return 'Actions'
  return { fond: 'Fonds', texte: 'Textes', bordure: 'Bordures' }[nom.split('-')[0]]
}
export const ORDRE_ROLES = ['Fonds', 'Textes', 'Actions', 'Bordures', 'Récompense', 'Succès', 'Erreur']

const semantiques = []
for (const groupe of ['fond', 'texte', 'bordure']) {
  for (const [nom, token] of entrees(communsJson[groupe])) {
    semantiques.push({ nom: `${groupe}-${nom}`, propriete: groupe, description: token.$description, modes: null, valeur: cible(token) })
  }
  for (const [nom, token] of entrees(apprenantJson[groupe])) {
    semantiques.push({
      nom: `${groupe}-${nom}`,
      propriete: groupe,
      description: token.$description,
      modes: { apprenant: cible(token), formateur: cible(formateurJson[groupe][nom]) },
    })
  }
}
export const semantiquesParRole = ORDRE_ROLES.map((r) => ({ role: r, tokens: semantiques.filter((s) => role(s.nom) === r) }))
export const nbSemantiquesAMode = semantiques.filter((s) => s.modes).length

// --- Espacements ----------------------------------------------------------------------------------

export const espacements = {
  description: espacementsJson.espace.$description,
  paliers: entrees(espacementsJson.espace).map(([nom, token]) => ({
    nom: `espace-${nom}`,
    valeur: `${token.$value.value}${token.$value.unit}`,
    description: token.$description,
  })),
}

// --- Rayons ---------------------------------------------------------------------------------------

export const rayons = entrees(rayonsJson.rayon).map(([nom, token]) => ({
  nom: `--rayon-${nom}`,
  valeur: `${token.$value.value}${token.$value.unit}`,
  description: token.$description,
}))

// --- Valeurs pas encore tokenisées (:root de shared.css) -----------------------------------------

function variablesRoot(css, prefixe) {
  const racine = css.match(/:root\s*\{([^}]*)\}/)?.[1] ?? ''
  const desktop = css.match(/@media \(min-width: 768px\)\s*\{\s*:root\s*\{([^}]*)\}/)?.[1] ?? ''
  const lire = (bloc) => Object.fromEntries([...bloc.matchAll(new RegExp(`(--${prefixe}[a-z-]*)\\s*:\\s*([^;]+);`, 'g'))].map((m) => [m[1], m[2].trim()]))
  const base = lire(racine)
  const large = lire(desktop)
  return Object.entries(base).map(([nom, valeur]) => ({ nom, valeur, valeurDesktop: large[nom] ?? null }))
}
export const ombreFlottante = variablesRoot(sharedCss, 'ombre-')[0] ?? null

// --- Documentation ---------------------------------------------------------------------------------

function section(md, titre) {
  const debut = md.indexOf(`\n## ${titre}\n`)
  if (debut === -1) return ''
  const suite = md.indexOf('\n## ', debut + 1)
  return md.slice(debut + titre.length + 5, suite === -1 ? undefined : suite).trim()
}
// Lignes qui suivent un libellé (« DO », « Règle principale »…) jusqu'au libellé suivant
const LIBELLES = ['Rôle', 'Usages', 'Anatomie', 'Variantes', 'Variantes et usage', 'États', 'Accessibilité', 'Règle principale', 'Fond (règle principale)', 'DO', "DON'T", 'Anti-pattern']
const estLibelle = (ligne) => LIBELLES.includes(ligne.trim()) || ligne.startsWith('Voisin')
function bloc(texte, libelle) {
  const lignes = texte.split('\n')
  const i = lignes.findIndex((l) => l.trim() === libelle)
  if (i === -1) return []
  const fin = lignes.findIndex((l, j) => j > i && estLibelle(l))
  return lignes.slice(i + 1, fin === -1 ? undefined : fin).filter((l) => l.trim() !== '')
}
const puces = (texte) => texte.split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2))

export function composant(titre) {
  const texte = section(principesMd, titre)
  return {
    regle: bloc(texte, 'Règle principale'),
    fond: bloc(texte, 'Fond (règle principale)'),
    faire: bloc(texte, 'DO'),
    pasFaire: bloc(texte, "DON'T"),
    voisinAnneau: bloc(texte, "Voisin, l'anneau de progression"),
  }
}
export const typographie = puces(section(principesMd, 'Typographie'))
export const ponctuation = puces(section(principesMd, 'Ponctuation'))
export const principe5 = (() => {
  const lignes = section(principesMd, 'Principes').split('\n')
  const i = lignes.findIndex((l) => l.startsWith('5. '))
  return i === -1 ? [] : [lignes[i], lignes[i + 1]]
})()
export const regleLecturePrimitif = couleursMd.split('\n').find((l) => l.includes('Un composant ne lit jamais un primitif'))?.replace(/^- /, '') ?? ''
export const regleOmbres = notesMd.split('\n').find((l) => l.startsWith('- Règle des ombres'))?.replace(/^- /, '') ?? ''

// Version actuelle : première version de la note qui n'est pas un brouillon
export const versionActuelle = [...notesMd.matchAll(/^## (\d+\.\d+\.\d+) \(([^)]*)\)/gm)].find((m) => !m[2].includes('brouillon'))?.[1] ?? ''
