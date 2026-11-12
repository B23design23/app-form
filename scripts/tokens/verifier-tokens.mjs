// Contrôles lancés par generer-css.mjs avant la génération. Le bloc :root tourne en
// log.warnings « warn » (l'avertissement letterSpacing du raccourci font est attendu) : Style
// Dictionary ne s'arrête alors plus sur les collisions de valeurs entre fichiers, les collisions de
// noms CSS ni les erreurs de transformation. Ce fichier rétablit l'arrêt pour ces cas, plus deux que
// Style Dictionary n'a jamais vus (doublon de même valeur, token présent d'un seul côté d'une paire).
// Les références cassées ne sont pas contrôlées ici : Style Dictionary les arrête quel que soit le
// niveau d'avertissement (log.errors.brokenReferences, « throw » par défaut).
import { readFile } from 'node:fs/promises'

const lire = async (chemin) => JSON.parse(await readFile(chemin, 'utf8'))

// Chemins (a.b.c) de tous les tokens d'un fichier, avec leur valeur
function tokens(noeud, chemin = [], acc = new Map()) {
  if (noeud && typeof noeud === 'object' && '$value' in noeud) {
    acc.set(chemin.join('.'), noeud.$value)
    return acc
  }
  for (const [cle, enfant] of Object.entries(noeud ?? {})) {
    if (!cle.startsWith('$') && enfant && typeof enfant === 'object') tokens(enfant, [...chemin, cle], acc)
  }
  return acc
}

// Descriptions ($description) des groupes d'un fichier, à toutes les profondeurs : chemin → texte
function descriptionsGroupes(noeud, chemin = [], acc = new Map()) {
  if (!noeud || typeof noeud !== 'object' || '$value' in noeud) return acc
  if (chemin.length > 0 && typeof noeud.$description === 'string') acc.set(chemin.join('.'), noeud.$description)
  for (const [cle, enfant] of Object.entries(noeud)) {
    if (!cle.startsWith('$')) descriptionsGroupes(enfant, [...chemin, cle], acc)
  }
  return acc
}

// Références {a.b.c} contenues dans une valeur (chaîne, objet composé, tableau)
function references(valeur) {
  if (typeof valeur === 'string') return [...valeur.matchAll(/\{([^}]+)\}/g)].map((m) => m[1])
  if (valeur && typeof valeur === 'object') return Object.values(valeur).flatMap(references)
  return []
}

/**
 * @param {{ communs: string[], paires: [string, string][], interdits: string[] }} config
 *   communs : fichiers écrits une seule fois ; paires : fichiers qui redéfinissent les mêmes tokens
 *   (modes, largeurs) ; interdits : tokens qui ne sortent pas en CSS et ne peuvent pas être référencés.
 */
export async function verifierTokens({ communs, paires, interdits }) {
  const fichiers = [...communs, ...paires.flat()]
  const parFichier = new Map()
  const groupesParFichier = new Map()
  for (const f of fichiers) {
    const contenu = await lire(f)
    parFichier.set(f, tokens(contenu))
    groupesParFichier.set(f, descriptionsGroupes(contenu))
  }

  const erreurs = []
  const ou = new Map() // chemin → fichiers qui le définissent
  for (const [f, toks] of parFichier) for (const chemin of toks.keys()) ou.set(chemin, [...(ou.get(chemin) ?? []), f])

  // 1. Un token est soit dans un seul fichier commun, soit dans les deux fichiers d'une seule paire.
  for (const [chemin, liste] of ou) {
    const enCommun = liste.filter((f) => communs.includes(f))
    const enPaire = liste.filter((f) => !communs.includes(f))
    if (enCommun.length > 0 && enPaire.length > 0) {
      erreurs.push(`Token « ${chemin} » défini dans un fichier commun et dans un fichier de mode ou de largeur : ${liste.join(', ')}. Il doit être dans l'un ou dans l'autre, jamais aux deux.`)
    } else if (enCommun.length > 1) {
      erreurs.push(`Token « ${chemin} » défini dans plusieurs fichiers communs : ${enCommun.join(', ')}.`)
    } else if (enPaire.length > 0) {
      const pairesTouchees = paires.filter((p) => p.some((f) => enPaire.includes(f)))
      if (pairesTouchees.length > 1) {
        erreurs.push(`Token « ${chemin} » défini dans plusieurs paires de fichiers : ${enPaire.join(', ')}.`)
      }
    }
  }

  // 2. Dans une paire, chaque token existe des deux côtés.
  for (const [a, b] of paires) {
    for (const [ici, la] of [[a, b], [b, a]]) {
      for (const chemin of parFichier.get(ici).keys()) {
        if (!parFichier.get(la).has(chemin)) {
          erreurs.push(`Token « ${chemin} » défini dans ${ici} mais absent de ${la}.`)
        }
      }
    }
  }

  // 3. Deux chemins différents ne donnent jamais le même nom de variable CSS (a.b-c et a-b.c).
  const parNom = new Map()
  for (const chemin of ou.keys()) {
    const nom = `--${chemin.split('.').join('-')}`
    parNom.set(nom, [...(parNom.get(nom) ?? []), chemin])
  }
  for (const [nom, chemins] of parNom) {
    if (chemins.length > 1) {
      const detail = chemins.map((c) => `« ${c} » (${ou.get(c).join(', ')})`).join(' et ')
      erreurs.push(`Variable CSS ${nom} produite par deux tokens : ${detail}.`)
    }
  }

  // 4. Aucun token ne fait référence à un token qui ne sort pas en CSS (le var() serait vide).
  for (const [f, toks] of parFichier) {
    for (const [chemin, valeur] of toks) {
      for (const ref of references(valeur)) {
        if (interdits.includes(ref)) {
          erreurs.push(`Token « ${chemin} » (${f}) fait référence à « ${ref} », qui ne sort pas en CSS.`)
        }
      }
    }
  }

  // 5. Un groupe présent dans plusieurs fichiers a la même $description partout (sinon Style
  // Dictionary signale une collision, que le mode « warn » laisse passer). Un groupe sans
  // $description dans un fichier n'entre pas en conflit : il prend celle des autres.
  const descriptions = new Map() // groupe → [[fichier, texte]]
  for (const [f, groupes] of groupesParFichier) {
    for (const [groupe, texte] of groupes) descriptions.set(groupe, [...(descriptions.get(groupe) ?? []), [f, texte]])
  }
  for (const [groupe, liste] of descriptions) {
    const [fichierRef, texteRef] = liste[0]
    for (const [f, texte] of liste.slice(1)) {
      if (texte !== texteRef) {
        erreurs.push(`Groupe « ${groupe} » : $description différente entre ${fichierRef} et ${f}.\n    ${fichierRef} : « ${texteRef} »\n    ${f} : « ${texte} »`)
      }
    }
  }

  if (erreurs.length > 0) {
    throw new Error(`Tokens incohérents, rien n'a été généré (${erreurs.length}) :\n- ${erreurs.join('\n- ')}`)
  }
}

// Erreurs de transformation : en « warn », Style Dictionary garde la valeur brute et continue.
// Chaque transformation passe par cette enveloppe, qui note l'erreur avant de la relancer ;
// generer-css.mjs vérifie la liste après les blocs et avant d'écrire le fichier. Un Set : les
// fichiers communs passent dans chaque bloc, la même erreur reviendrait une fois par bloc.
export const erreursTransformation = new Set()

export function surveillerTransformations(StyleDictionary, noms) {
  return noms.map((nom) => {
    const origine = StyleDictionary.hooks.transforms[nom]
    const nomSurveille = `skillo/surveille/${nom}`
    StyleDictionary.registerTransform({
      ...origine,
      name: nomSurveille,
      transform: async (token, ...reste) => {
        try {
          return await origine.transform(token, ...reste)
        } catch (e) {
          erreursTransformation.add(`Token « ${token.path.join('.')} » (${token.filePath}) : transformation « ${nom} » impossible. ${e instanceof Error ? e.message : e}`)
          throw e
        }
      },
    })
    return nomSurveille
  })
}

export function verifierTransformations() {
  if (erreursTransformation.size > 0) {
    const liste = [...erreursTransformation]
    throw new Error(`Transformations impossibles, rien n'a été écrit (${liste.length}) :\n- ${liste.join('\n- ')}`)
  }
}

// Contrôle anti-primitif (fin des lots d'espacements) : un composant lit toujours un token de rôle
// (var(--espace-<rôle>)), jamais un primitif d'échelle (var(--espace-<nombre>)). Seul le CSS généré
// définit les primitifs et les rôles qui les référencent.
export async function verifierPrimitifsEspacement(dossier = 'src', exclus = ['src/styles/tokens.generes.css']) {
  const { readdir } = await import('node:fs/promises')
  const path = await import('node:path')
  const entrees = await readdir(dossier, { recursive: true, withFileTypes: true })
  const erreurs = []
  for (const e of entrees) {
    if (!e.isFile() || !/\.(css|jsx?|tsx?)$/.test(e.name)) continue
    const chemin = path.join(e.parentPath ?? e.path, e.name)
    if (exclus.includes(chemin)) continue
    const lignes = (await readFile(chemin, 'utf8')).split('\n')
    lignes.forEach((ligne, i) => {
      if (/var\(\s*--espace-\d/.test(ligne)) erreurs.push(`${chemin}:${i + 1} lit un primitif d'espacement : ${ligne.trim()}`)
    })
  }
  if (erreurs.length > 0) {
    throw new Error(`Primitifs d'espacement lus hors du CSS généré (${erreurs.length}) ; utiliser le token de rôle (espacements.md, section 11) :\n- ${erreurs.join('\n- ')}`)
  }
}
