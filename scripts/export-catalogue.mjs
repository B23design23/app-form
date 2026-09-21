// Exporte le catalogue des cours (par thème, puis ordre) vers docs/catalogue-cours.md.
// Usage : npm run export-catalogue
// Clé : SUPABASE_SERVICE_ROLE_KEY si définie (tous les cours), sinon VITE_SUPABASE_ANON_KEY
// (seuls les cours visibles sans session, soit en pratique les cours publics).
import { createClient } from '@supabase/supabase-js'
import { mkdir, writeFile } from 'node:fs/promises'
import { THEMATIQUES } from '../src/lib/thematiques.js'

const url = process.env.VITE_SUPABASE_URL
const cle = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
if (!url || !cle) {
  console.error('VITE_SUPABASE_URL et une clé Supabase sont requis (.env).')
  process.exit(1)
}

const supabase = createClient(url, cle)
const { data, error } = await supabase
  .from('cours')
  .select('titre, categorie, ordre, visibilite, questions(id), etapes_checklist(id)')

if (error) {
  console.error('Erreur Supabase :', error.message)
  process.exit(1)
}

const echapper = (t) => String(t ?? '').replace(/\|/g, '\\|')
const parOrdre = (a, b) => (a.ordre ?? Infinity) - (b.ordre ?? Infinity) || a.titre.localeCompare(b.titre, 'fr')

function tableau(cours) {
  const lignes = ['| Ordre | Titre | Checklist | Nb questions |', '|---|---|---|---|']
  for (const c of [...cours].sort(parOrdre)) {
    const nbEtapes = c.etapes_checklist?.length ?? 0
    const checklist = nbEtapes > 0 ? `oui (${nbEtapes} étape${nbEtapes > 1 ? 's' : ''})` : 'non'
    lignes.push(`| ${c.ordre ?? '—'} | ${echapper(c.titre)} | ${checklist} | ${c.questions?.length ?? 0} |`)
  }
  return lignes.join('\n')
}

const sections = []
THEMATIQUES.forEach((theme, i) => {
  const cours = data.filter((c) => c.categorie === theme)
  if (cours.length === 0) return
  sections.push(`## Thème ${i + 1} — ${theme}\n\n${tableau(cours)}`)
})

const autres = data.filter((c) => !THEMATIQUES.includes(c.categorie))
if (autres.length > 0) sections.push(`## Hors thématiques (cours privés)\n\n${tableau(autres)}`)

const md = `# Catalogue des cours

Généré le ${new Date().toISOString().slice(0, 10)} par \`npm run export-catalogue\` — ${data.length} cours. Ne pas éditer à la main.

${sections.join('\n\n')}
`

await mkdir('docs', { recursive: true })
await writeFile('docs/catalogue-cours.md', md)
console.log(`docs/catalogue-cours.md écrit (${data.length} cours).`)
