import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { imageTheme } from '../lib/thematiques'
import { contenuCours } from '../lib/cours'
import Icone from '../components/Icone'
import StatutBadge from '../components/StatutBadge'
import iconeChevron from '../Assets/chevron-right.svg?raw'
import iconeRetour from '../Assets/chevron-left.svg?raw'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import './DetailTheme.css'
import { typo } from '../lib/typographie'
import { useStatutSousTitre } from '../components/useStatutSousTitre'

// Ligne de cours du thème : le statut passe sous le titre dès que le titre devrait couper un mot
function LigneTheme({ cours, statut, onOuvrirCours }) {
  const ref = useStatutSousTitre('.theme-ligne-titre', cours.titre)
  return (
    <li>
      <button ref={ref} type="button" className="ligne-liste theme-ligne" onClick={() => onOuvrirCours(cours.id)}>
        <span className="theme-ligne-texte">
          <span className="theme-ligne-titre">{typo(cours.titre)}</span>
          <span className="theme-ligne-contenu">{contenuCours(cours)}</span>
        </span>
        <StatutBadge statut={statut} />
        <Icone svg={iconeChevron} className="chevron-ligne" />
      </button>
    </li>
  )
}

function DetailTheme({ authUser, nom, index, onRetour, onOuvrirCours }) {
  const [coursListe, setCoursListe] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [progression, setProgression] = useState([])

  useEffect(() => {
    let annule = false

    supabase
      .from('cours')
      .select('id, titre, contenu, ordre, created_at, questions(id), etapes_checklist(id)')
      .eq('visibilite', 'public')
      .eq('categorie', nom)
      .order('ordre', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (annule) return
        if (error) {
          console.error('cours du thème', error.message)
          setErreur(true)
        }
        else setCoursListe(data ?? [])
      })

    supabase
      .from('progression')
      .select('cours_id, statut')
      .eq('user_id', authUser.id)
      .then(({ data, error }) => {
        if (annule) return
        if (!error) setProgression(data ?? [])
      })

    return () => {
      annule = true
    }
  }, [nom, authUser.id])

  const statutParCoursId = new Map(progression.map((p) => [p.cours_id, p.statut]))
  const total = coursListe?.length ?? 0
  const termines = (coursListe ?? []).filter(
    (c) => (statutParCoursId.get(c.id) ?? 'non_commence') === 'termine'
  ).length

  return (
    <div className="espace-page espace-page-etroit page-theme">
      <button type="button" className="bouton-retour" onClick={onRetour} aria-label="Retour à Cours">
        <Icone svg={iconeRetour} className="bouton-retour-icone" />
        Cours
      </button>

      <div className="theme-entete">
        <img className="theme-entete-objet" src={imageTheme(nom)} alt="" />
        <span className="theme-entete-numero">Thème {index + 1}</span>
        <h1 className="theme-entete-titre">{nom}</h1>
        {/* Thème sans cours : en-tête sans le compteur */}
        {!(coursListe !== null && total === 0) && (
          <p className="theme-entete-compte">
            {termines} cours terminé{termines > 1 ? 's' : ''} sur {total}
          </p>
        )}
      </div>

      {erreur ? (
        <p className="message message-erreur">Impossible de charger les cours.</p>
      ) : coursListe === null ? (
        <p className="etat-chargement">Chargement…</p>
      ) : coursListe.length === 0 ? (
        <p className="dashboard-etat-vide">Aucun cours dans ce thème.</p>
      ) : (
        // Ordre pédagogique (cours.ordre) : le cours en cours ne remonte pas, sa pastille le signale.
        <ul className="carte carte-liste theme-liste">
          {coursListe.map((cours) => (
            <LigneTheme
              key={cours.id}
              cours={cours}
              statut={statutParCoursId.get(cours.id) ?? 'non_commence'}
              onOuvrirCours={onOuvrirCours}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default DetailTheme
