// Génère src/styles/tokens.generes.css depuis les fichiers DTCG de tokens/.
// Usage : npm run tokens
// :root reçoit les primitifs, les espacements, les sémantiques communs et les valeurs apprenant ;
// les valeurs formateur sont redéfinies sous les classes qui portent l'espace formateur, et
// .mode-apprenant redéclare les valeurs apprenant pour un aperçu élève posé dans l'espace formateur.
// Les sémantiques restent des var(--primitif) (outputReferences), jamais des valeurs brutes.
// Typographie : primitifs et rôles communs dans :root, avec les rôles à deux tailles en version
// mobile ; la version desktop les redéclare dans un bloc @media dont la largeur vient de
// typo.seuil-desktop (une media query ne lit pas un var(), le seuil ne sort donc pas en CSS).
import StyleDictionary from 'style-dictionary'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { CLE_PRIMITIF, NOM_PREPROCESSEUR, resoudreRefComposantes } from './resoudre-ref-composantes.mjs'
import { surveillerTransformations, verifierTokens, verifierTransformations } from './verifier-tokens.mjs'
import { FICHIER_COULEURS, FICHIER_REGLES, ecrireListeTokens, ecrireTablesCouleurs } from './lister-tokens-md.mjs'

const SORTIE = 'src/styles/tokens.generes.css'
const SELECTEUR_FORMATEUR = '.espace-layout-formateur,\n.flow-page-formateur,\n.dropdown-content-formateur'
const SELECTEUR_APPRENANT = '.mode-apprenant'
const ENTETE = 'Fichier généré depuis tokens/. Ne pas modifier à la main.'

const COMMUNS = [
  'tokens/primitifs-couleurs.tokens.json',
  'tokens/espacements.tokens.json',
  'tokens/semantiques-communs.tokens.json',
  'tokens/typographie.tokens.json',
]
const TYPO_MOBILE = 'tokens/typographie-mobile.tokens.json'
const TYPO_DESKTOP = 'tokens/typographie-desktop.tokens.json'

// Le seuil sert seulement à écrire la media query : il ne sort jamais en variable CSS.
const estSeuil = (token) => token.path.join('.') === 'typo.seuil-desktop'

StyleDictionary.registerPreprocessor(resoudreRefComposantes)

StyleDictionary.registerFileHeader({ name: 'skillo/entete', fileHeader: () => [ENTETE] })

// Couleur avec opacité dont les composantes viennent d'un primitif : on garde le lien vers la
// variable du primitif, l'alpha est appliqué par color-mix (équivalent à rgba(…, alpha)).
StyleDictionary.registerTransform({
  name: 'skillo/couleur-alpha-reference',
  type: 'value',
  filter: (token) =>
    Boolean(token.$extensions?.[CLE_PRIMITIF]) && token.original.$value?.alpha !== undefined,
  transform: (token) => {
    const primitif = token.$extensions[CLE_PRIMITIF].split('.').join('-')
    const pourcentage = Math.round(token.original.$value.alpha * 10000) / 100
    return `color-mix(in srgb, var(--${primitif}) ${pourcentage}%, transparent)`
  },
})

// Tailles typographiques en rem (base 16 px) : la transformation size/pxToRem de Style Dictionary,
// limitée aux tokens typo.taille.*. Les autres dimensions (espacements…) restent en px.
const pxToRem = StyleDictionary.hooks.transforms['size/pxToRem']
StyleDictionary.registerTransform({
  name: 'skillo/typo-taille-rem',
  type: 'value',
  filter: (token) => token.path[0] === 'typo' && token.path[1] === 'taille',
  transform: pxToRem.transform,
})

// Le groupe css transforme d'abord la valeur ; les transformations ci-dessus passent en dernier
// pour remplacer la couleur brute par la référence et la taille en px par sa valeur en rem.
const TRANSFORMS = surveillerTransformations(StyleDictionary, [
  ...StyleDictionary.hooks.transformGroups.css,
  'skillo/couleur-alpha-reference',
  'skillo/typo-taille-rem',
])

async function genererBloc({ include, source, selecteur, entete, filtre, avertissements = 'error' }) {
  const sd = new StyleDictionary({
    include,
    source,
    preprocessors: [NOM_PREPROCESSEUR],
    log: { verbosity: 'verbose', warnings: avertissements },
    platforms: {
      css: {
        transforms: TRANSFORMS,
        files: [
          {
            destination: SORTIE,
            format: 'css/variables',
            filter: (token) => !estSeuil(token) && (filtre ? filtre(token) : true),
            options: {
              selector: selecteur,
              outputReferences: true,
              showFileHeader: entete,
              fileHeader: 'skillo/entete',
            },
          },
        ],
      },
    },
  })
  const [fichier] = await sd.formatPlatform('css')
  return fichier.output
}

// Contrôles avant génération (voir verifier-tokens.mjs) : le bloc :root tourne en « warn ».
await verifierTokens({
  communs: COMMUNS,
  paires: [
    ['tokens/semantiques-apprenant.tokens.json', 'tokens/semantiques-formateur.tokens.json'],
    [TYPO_MOBILE, TYPO_DESKTOP],
  ],
  interdits: ['typo.seuil-desktop'],
})

const racine = await genererBloc({
  source: [...COMMUNS, 'tokens/semantiques-apprenant.tokens.json', TYPO_MOBILE],
  selecteur: ':root',
  entete: true,
  // Avertissement attendu, affiché sans arrêter la génération : le raccourci CSS font n'accepte
  // pas letterSpacing (« Unknown CSS Font Shorthand properties… letterSpacing »). La valeur reste
  // écrite dans tokens/ (0 pour tous les rôles) et sort avec le primitif typo-espacement-lettres-0.
  avertissements: 'warn',
})

// Les primitifs sont inclus pour résoudre les alias, mais seuls les tokens du fichier formateur
// sont écrits : ils pointent vers les variables déjà déclarées dans :root. Style Dictionary signale
// ces références vers des tokens filtrés ; c'est voulu, l'avertissement est coupé pour ce bloc seul.
const formateur = await genererBloc({
  include: COMMUNS,
  source: ['tokens/semantiques-formateur.tokens.json'],
  selecteur: SELECTEUR_FORMATEUR,
  entete: false,
  filtre: (token) => token.isSource,
  avertissements: 'disabled',
})

// Retour au mode apprenant à l'intérieur d'un conteneur formateur (aperçu de la leçon dans
// Création de cours). Écrit après le bloc formateur : à élément égal, il l'emporte.
const apprenant = await genererBloc({
  include: COMMUNS,
  source: ['tokens/semantiques-apprenant.tokens.json'],
  selecteur: SELECTEUR_APPRENANT,
  entete: false,
  filtre: (token) => token.isSource,
  avertissements: 'disabled',
})

// Rôles typographiques à deux tailles, valeurs à partir du seuil. Même filtre que les modes :
// seuls les tokens du fichier desktop sont écrits, ils pointent vers les primitifs de :root.
const typoDesktop = await genererBloc({
  include: COMMUNS,
  source: [TYPO_DESKTOP],
  selecteur: ':root',
  entete: false,
  filtre: (token) => token.isSource,
  avertissements: 'disabled',
})
const { typo } = JSON.parse(await readFile('tokens/typographie.tokens.json', 'utf8'))
const seuil = typo['seuil-desktop'].$value
const indenter = (texte) => texte.trim().split('\n').map((ligne) => (ligne ? `  ${ligne}` : ligne)).join('\n')
const media = `@media (min-width: ${seuil.value}${seuil.unit}) {\n${indenter(typoDesktop)}\n}`

verifierTransformations()

await mkdir(dirname(SORTIE), { recursive: true })
await writeFile(SORTIE, `${racine.trimEnd()}\n\n${formateur.trim()}\n\n${apprenant.trim()}\n\n${media}\n`)
console.log(`${SORTIE} généré.`)

// Listes générées dans la documentation (fichier de règles de l'agent, couleurs.md), si elles ont leurs marqueurs
if (await ecrireListeTokens()) console.log(`${FICHIER_REGLES} : liste des tokens mise à jour.`)
if (await ecrireTablesCouleurs()) console.log(`${FICHIER_COULEURS} : tableaux des primitifs et des sémantiques mis à jour.`)
