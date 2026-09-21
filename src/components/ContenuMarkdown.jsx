import { Children, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './ContenuMarkdown.css'

function obtenirUrlEmbedVideo(url) {
  if (!url) return null

  let u
  try {
    u = new URL(url)
  } catch {
    return null
  }

  const host = u.hostname.replace(/^www\./, '')

  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const id = u.searchParams.get('v')
    if (id) return `https://www.youtube.com/embed/${id}`
    const match = u.pathname.match(/^\/embed\/([^/]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  if (host === 'youtu.be') {
    const id = u.pathname.slice(1)
    return id ? `https://www.youtube.com/embed/${id}` : null
  }

  if (host === 'vimeo.com') {
    const match = u.pathname.match(/^\/(\d+)/)
    return match ? `https://player.vimeo.com/video/${match[1]}` : null
  }

  return null
}

function LienMarkdown({ href, children }) {
  const urlEmbed = obtenirUrlEmbedVideo(href)

  if (urlEmbed) {
    return (
      <span className="contenu-markdown-video">
        <iframe
          src={urlEmbed}
          title="Vidéo intégrée"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </span>
    )
  }

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

// Un titre Markdown (##) tient sur une seule ligne : on y autorise <br> comme retour à la ligne.
const SEPARATEUR_TITRE = '\u2028'

function preparerTitres(texte) {
  return texte
    .split('\n')
    .map((ligne) => (/^\s{0,3}#{1,6}\s/.test(ligne) ? ligne.replace(/<br\s*\/?>/gi, SEPARATEUR_TITRE) : ligne))
    .join('\n')
}

function avecRetoursALaLigne(children) {
  return Children.toArray(children).flatMap((enfant, i) =>
    typeof enfant === 'string'
      ? enfant.split(SEPARATEUR_TITRE).flatMap((morceau, j) => (j === 0 ? [morceau] : [<br key={`${i}-${j}`} />, morceau]))
      : [enfant]
  )
}

function titre(Balise) {
  return function Titre({ children }) {
    return <Balise>{avecRetoursALaLigne(children)}</Balise>
  }
}

function ContenuMarkdown({ texte, className = '' }) {
  const [imageAgrandie, setImageAgrandie] = useState(null)

  if (!texte) return null

  return (
    <div className={`contenu-markdown ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: LienMarkdown,
          h1: titre('h1'),
          h2: titre('h2'),
          h3: titre('h3'),
          h4: titre('h4'),
          table: ({ children }) => (
            <div className="contenu-markdown-table-wrap">
              <table>{children}</table>
            </div>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt ?? ''}
              className="contenu-markdown-image"
              onClick={(e) => {
                e.stopPropagation()
                setImageAgrandie(src)
              }}
            />
          ),
        }}
      >
        {preparerTitres(texte)}
      </ReactMarkdown>

      {imageAgrandie && (
        // Un second clic (image ou fond) ferme la superposition : le gestionnaire est volontairement
        // le même pour les deux, sans stopPropagation sur l'image agrandie.
        <div className="contenu-markdown-lightbox" onClick={() => setImageAgrandie(null)}>
          <img src={imageAgrandie} alt="" />
        </div>
      )}
    </div>
  )
}

export default ContenuMarkdown
