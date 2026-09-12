import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
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

function ContenuMarkdown({ texte, className = '' }) {
  const [imageAgrandie, setImageAgrandie] = useState(null)

  if (!texte) return null

  return (
    <div className={`contenu-markdown ${className}`.trim()}>
      <ReactMarkdown
        components={{
          a: LienMarkdown,
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
        {texte}
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
