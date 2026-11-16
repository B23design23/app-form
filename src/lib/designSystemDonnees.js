// Données de la page /design-system, lues au build : tokens/ (valeurs, descriptions) et la
// documentation du DS (règles reprises telles quelles). Aucune valeur n'est écrite à la main ici.
import primitifsJson from '../../tokens/primitifs-couleurs.tokens.json'
import espacementsJson from '../../tokens/espacements.tokens.json'
import rayonsJson from '../../tokens/rayons.tokens.json'
import ombresJson from '../../tokens/ombres.tokens.json'
import communsJson from '../../tokens/semantiques-communs.tokens.json'
import apprenantJson from '../../tokens/semantiques-apprenant.tokens.json'
import formateurJson from '../../tokens/semantiques-formateur.tokens.json'
import typoJson from '../../tokens/typographie.tokens.json'
import typoMobileJson from '../../tokens/typographie-mobile.tokens.json'
import typographieMd from '../../docs/tokens/typographie.md?raw'
import principesMd from '../../docs/design-system/ds-principes-composants.md?raw'
import couleursMd from '../../docs/tokens/couleurs.md?raw'
import notesMd from '../../docs/design-system/notes-de-version.md?raw'

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

// Paliers = primitifs (clés numériques) ; rôles = alias {espace.N} (clés en mots), listés à part
const estPalier = ([nom]) => /^\d+$/.test(nom)
const paliersEspace = entrees(espacementsJson.espace).filter(estPalier)
export const espacements = {
  description: espacementsJson.espace.$description,
  paliers: paliersEspace.map(([nom, token]) => ({
    nom: `espace-${nom}`,
    valeur: `${token.$value.value}${token.$value.unit}`,
    description: token.$description,
  })),
  roles: entrees(espacementsJson.espace)
    .filter((e) => !estPalier(e))
    .map(([nom, token]) => {
      const palier = token.$value.replace(/^\{espace\.|\}$/g, '')
      const cible = espacementsJson.espace[palier].$value
      return { nom: `espace-${nom}`, primitif: `espace-${palier}`, valeur: `${cible.value}${cible.unit}`, description: token.$description }
    }),
}

// --- Rayons ---------------------------------------------------------------------------------------

export const rayons = entrees(rayonsJson.rayon).map(([nom, token]) => ({
  nom: `--rayon-${nom}`,
  valeur: `${token.$value.value}${token.$value.unit}`,
  description: token.$description,
}))

// --- Ombres (tokens/ombres.tokens.json) -----------------------------------------------------------

const px = (d) => `${d.value}${d.value ? d.unit : ''}`
export const ombres = entrees(ombresJson.ombre).map(([nom, token]) => ({
  nom: `--ombre-${nom}`,
  valeur: `${px(token.$value.offsetX)} ${px(token.$value.offsetY)} ${px(token.$value.blur)} · ardoise-900 à ${Math.round(token.$value.color.alpha * 100)} %`,
  description: token.$description,
}))

// --- Typographie ----------------------------------------------------------------------------------

// Un échantillon par rôle : les tokens composés typo-<rôle> (hors variante -fort) des fichiers commun et
// mobile (les rôles qui changent au seuil ont le même nom dans le fichier desktop), nom du rôle lu dans la
// table « Rôles » de docs/tokens/typographie.md, section 11, dans l'ordre de cette table.
const nomsRoles = [...typographieMd.matchAll(/^\| `(typo-[a-z-]+)` \| ([^|]+?) \|/gm)].map((m) => [m[1], m[2].trim()])
const tokensRoles = new Set(
  [...entrees(typoJson.typo), ...entrees(typoMobileJson.typo)]
    .filter(([nom, token]) => token.$type === 'typography' && !nom.endsWith('-fort'))
    .map(([nom]) => `typo-${nom}`)
)
export const rolesTypo = nomsRoles.filter(([token]) => tokensRoles.has(token)).map(([token, nom]) => ({ token, nom }))

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
    role: bloc(texte, 'Rôle'),
    regle: bloc(texte, 'Règle principale'),
    fond: bloc(texte, 'Fond (règle principale)'),
    faire: bloc(texte, 'DO'),
    pasFaire: bloc(texte, "DON'T"),
    voisinAnneau: bloc(texte, "Voisin, l'anneau de progression"),
  }
}
export const typographie = puces(section(principesMd, 'Typographie'))
export const ponctuation = puces(section(principesMd, 'Ponctuation'))
// Contrainte d'accessibilité (statut jamais porté par la couleur seule), lue dans la doc
export const contrainteAccessibilite = section(principesMd, "Contrainte d'accessibilité")
  .split('\n')
  .filter((l) => l.trim() !== '')
export const regleLecturePrimitif = couleursMd.split('\n').find((l) => l.includes('Un composant ne lit jamais un primitif'))?.replace(/^- /, '') ?? ''
export const regleOmbres = notesMd.split('\n').find((l) => l.startsWith('- Règle des ombres'))?.replace(/^- /, '') ?? ''

// Version actuelle : première version de la note qui n'est pas un brouillon
export const versionActuelle = [...notesMd.matchAll(/^## (\d+\.\d+\.\d+) \(([^)]*)\)/gm)].find((m) => !m[2].includes('brouillon'))?.[1] ?? ''
