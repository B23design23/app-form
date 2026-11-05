// Écrit, depuis tokens/, entre deux marqueurs :
// - la liste des tokens utilisables dans docs/design-system/regles-agent.md (noms et descriptions
//   seulement, aucune valeur) ;
// - les tableaux des primitifs et des sémantiques de docs/tokens/couleurs.md (avec les valeurs).
// tokens/ reste la seule source. Appelé par generer-css.mjs.
import { readFile, writeFile } from 'node:fs/promises'

export const FICHIER_REGLES = 'docs/design-system/regles-agent.md'
const DEBUT = '<!-- tokens:debut (généré par npm run tokens depuis tokens/, ne pas modifier à la main) -->'
const FIN = '<!-- tokens:fin -->'

const lire = async (chemin) => JSON.parse(await readFile(chemin, 'utf8'))
const estToken = (noeud) => noeud && typeof noeud === 'object' && '$value' in noeud
const cellule = (texte) => texte.replace(/\|/g, '\\|').replace(/\n/g, ' ')

// { groupe: { description, tokens: { nom: description } } } pour un fichier à un niveau de groupe
function parGroupe(fichier) {
  const groupes = {}
  for (const [groupe, contenu] of Object.entries(fichier)) {
    if (groupe.startsWith('$')) continue
    const tokens = {}
    for (const [nom, token] of Object.entries(contenu)) {
      if (!nom.startsWith('$') && estToken(token)) tokens[nom] = token.$description ?? ''
    }
    groupes[groupe] = { description: contenu.$description ?? '', tokens }
  }
  return groupes
}

async function construireListe() {
  const espacements = parGroupe(await lire('tokens/espacements.tokens.json'))
  const communs = parGroupe(await lire('tokens/semantiques-communs.tokens.json'))
  const apprenant = parGroupe(await lire('tokens/semantiques-apprenant.tokens.json'))
  const formateur = parGroupe(await lire('tokens/semantiques-formateur.tokens.json'))

  const lignes = []
  for (const [groupe, { description, tokens }] of Object.entries(espacements)) {
    lignes.push(`#### Espacements (\`${groupe}\`)`, '', description, '', '| Variable CSS | Description |', '|---|---|')
    for (const [nom, desc] of Object.entries(tokens)) lignes.push(`| \`--${groupe}-${nom}\` | ${cellule(desc)} |`)
    lignes.push('')
  }

  const groupes = [...new Set([...Object.keys(communs), ...Object.keys(apprenant)])]
  for (const groupe of groupes) {
    const description = communs[groupe]?.description || apprenant[groupe]?.description || ''
    lignes.push(`#### Sémantiques \`${groupe}\``, '', description, '', '| Variable CSS | Mode | Description |', '|---|---|---|')
    const entrees = [
      ...Object.entries(communs[groupe]?.tokens ?? {}).map(([nom, desc]) => [nom, 'commun', desc]),
      ...Object.entries(apprenant[groupe]?.tokens ?? {}).map(([nom, desc]) => {
        const descFormateur = formateur[groupe]?.tokens?.[nom]
        const texte = descFormateur === undefined || descFormateur === desc ? desc : `Apprenant : ${desc} Formateur : ${descFormateur}`
        return [nom, 'varie selon le mode', texte]
      }),
    ]
    for (const [nom, mode, desc] of entrees) lignes.push(`| \`--${groupe}-${nom}\` | ${mode} | ${cellule(desc)} |`)
    lignes.push('')
  }
  lignes.push(...(await listeTypographie()))
  return lignes.join('\n').trimEnd()
}

// --- Typographie (tokens/typographie*.tokens.json) ---------------------------------------------
// Deux listes : primitifs, puis rôles composés. Un rôle défini en mobile et en desktop tient sur une
// ligne avec ses deux valeurs. Les valeurs sont lues dans tokens/ (tailles en px, comme la doc).

const virgule = (n) => String(n).replace('.', ',')
const dimension = (v) => `${virgule(v.value)} ${v.unit}`

function valeurPrimitif(token) {
  const v = token.$value
  if (Array.isArray(v)) return v.join(', ')
  if (v && typeof v === 'object') return dimension(v)
  return virgule(v)
}

// {typo.taille.15} → valeur du primitif dans le fichier commun
function valeurCompose(token, primitifs) {
  const lire = (ref) => {
    const chemin = ref.replace(/^\{typo\.|\}$/g, '').split('.')
    return chemin.reduce((noeud, partie) => noeud[partie], primitifs).$value
  }
  const { fontSize, fontWeight, lineHeight } = token.$value
  return `${dimension(lire(fontSize))} · ${lire(fontWeight)} · ${virgule(lire(lineHeight))}`
}

async function listeTypographie() {
  const { typo } = await lire('tokens/typographie.tokens.json')
  const mobile = (await lire('tokens/typographie-mobile.tokens.json')).typo
  const desktop = (await lire('tokens/typographie-desktop.tokens.json')).typo

  const lignes = ['#### Typographie, primitifs (`typo`)', '', typo.$description ?? '', '']
  lignes.push('Un composant ne lit jamais ces primitifs : ils sont listés pour lire les valeurs des rôles.', '')
  lignes.push('| Variable CSS | Valeur | Description |', '|---|---|---|')
  const primitifs = []
  const parcourir = (noeud, chemin) => {
    for (const [cle, enfant] of Object.entries(noeud)) {
      if (cle.startsWith('$') || !enfant || typeof enfant !== 'object') continue
      const ici = [...chemin, cle]
      if (!estToken(enfant)) parcourir(enfant, ici)
      else if (enfant.$type !== 'typography') primitifs.push([ici, enfant])
    }
  }
  parcourir(typo, ['typo'])
  for (const [chemin, token] of primitifs) {
    const nom = chemin.join('-')
    // Le seuil ne sort pas en variable CSS : nom du token, sans --
    const affiche = nom === 'typo-seuil-desktop' ? `\`${nom}\` (pas de variable CSS)` : `\`--${nom}\``
    lignes.push(`| ${affiche} | ${valeurPrimitif(token)} | ${cellule(token.$description ?? '')} |`)
  }

  lignes.push('', '#### Typographie, rôles (`typo`)', '')
  lignes.push('Valeur : taille · graisse · hauteur de ligne. Un élément applique `font: var(--typo-<rôle>)` ou `font: var(--typo-<rôle>-fort)`.', '')
  lignes.push('| Variable CSS | Valeur | Description |', '|---|---|---|')
  const composes = [
    ...Object.entries(typo).filter(([n, t]) => !n.startsWith('$') && t.$type === 'typography').map(([n, t]) => [n, valeurCompose(t, typo), t.$description]),
    ...Object.entries(mobile).filter(([n]) => !n.startsWith('$')).map(([n, t]) => [
      n,
      `${valeurCompose(t, typo)} (sous 768 px) ; ${valeurCompose(desktop[n], typo)} (à partir de 768 px)`,
      t.$description === desktop[n].$description ? t.$description : `Mobile : ${t.$description} Desktop : ${desktop[n].$description}`,
    ]),
  ]
  for (const [nom, valeur, description] of composes) lignes.push(`| \`--typo-${nom}\` | ${valeur} | ${cellule(description ?? '')} |`)
  lignes.push('')
  return lignes
}

// Remplace le contenu entre deux marqueurs d'un fichier ; false si le fichier ou un marqueur manque
async function remplacerEntreMarqueurs(fichier, debutMarqueur, finMarqueur, contenu) {
  let texte
  try {
    texte = await readFile(fichier, 'utf8')
  } catch {
    return false
  }
  const debut = texte.indexOf(debutMarqueur)
  const fin = texte.indexOf(finMarqueur)
  if (debut === -1 || fin === -1 || fin < debut) return false
  await writeFile(fichier, `${texte.slice(0, debut + debutMarqueur.length)}\n\n${contenu}\n\n${texte.slice(fin)}`)
  return true
}

export async function ecrireListeTokens() {
  return remplacerEntreMarqueurs(FICHIER_REGLES, DEBUT, FIN, await construireListe())
}

// --- docs/tokens/couleurs.md -------------------------------------------------------------------

export const FICHIER_COULEURS = 'docs/tokens/couleurs.md'
const DEBUT_COULEURS = '<!-- couleurs:debut (généré par npm run tokens depuis tokens/, ne pas modifier à la main) -->'
const FIN_COULEURS = '<!-- couleurs:fin -->'
const TITRES_GROUPES = { fond: 'Fonds', texte: 'Textes', bordure: 'Bordures' }

// Valeur d'un sémantique exprimée par son primitif : alias {couleur.x}, ou composantes en $ref + alpha
function valeurSemantique(token) {
  const v = token.$value
  if (typeof v === 'string') return `\`${v.replace(/^\{couleur\.|\}$/g, '')}\``
  const primitif = v.components?.[0]?.$ref?.match(/^#\/couleur\/([^/]+)\//)?.[1]
  return `\`${primitif}\` à ${Math.round(v.alpha * 100)} %`
}

async function construireTablesCouleurs() {
  const primitifs = (await lire('tokens/primitifs-couleurs.tokens.json')).couleur
  const communs = await lire('tokens/semantiques-communs.tokens.json')
  const apprenant = await lire('tokens/semantiques-apprenant.tokens.json')
  const formateur = await lire('tokens/semantiques-formateur.tokens.json')

  const nomsPrimitifs = Object.keys(primitifs).filter((n) => !n.startsWith('$'))
  const lignes = ['Section générée depuis `tokens/` : ne pas la modifier à la main, modifier `tokens/` puis lancer `npm run tokens`.', '', `### Primitifs (${nomsPrimitifs.length})`, '', '| Primitif | Hex | L\\* |', '|---|---|---:|']
  for (const nom of nomsPrimitifs) {
    const clarte = primitifs[nom].$description?.match(/L\* ([\d,]+)/)?.[1] ?? ''
    lignes.push(`| \`${nom}\` | ${primitifs[nom].$value.hex} | ${clarte} |`)
  }

  const semantiques = []
  for (const groupe of Object.keys(TITRES_GROUPES)) {
    for (const [nom, token] of Object.entries(communs[groupe] ?? {})) {
      if (!nom.startsWith('$') && estToken(token)) semantiques.push([groupe, nom, valeurSemantique(token), '=', token.$description ?? ''])
    }
    for (const [nom, token] of Object.entries(apprenant[groupe] ?? {})) {
      if (!nom.startsWith('$') && estToken(token)) {
        semantiques.push([groupe, nom, valeurSemantique(token), valeurSemantique(formateur[groupe][nom]), token.$description ?? ''])
      }
    }
  }
  lignes.push('', `### Sémantiques (${semantiques.length})`, '', '« = » signifie que la valeur est la même dans les deux modes.', '', '| Sémantique | Apprenant | Formateur | Rôle |', '|---|---|---|---|')
  let groupeCourant = null
  for (const [groupe, nom, valApprenant, valFormateur, description] of semantiques) {
    if (groupe !== groupeCourant) {
      lignes.push(`| **${TITRES_GROUPES[groupe]}** | | | |`)
      groupeCourant = groupe
    }
    lignes.push(`| \`${groupe}-${nom}\` | ${valApprenant} | ${valFormateur} | ${cellule(description)} |`)
  }
  return lignes.join('\n')
}

export async function ecrireTablesCouleurs() {
  return remplacerEntreMarqueurs(FICHIER_COULEURS, DEBUT_COULEURS, FIN_COULEURS, await construireTablesCouleurs())
}
