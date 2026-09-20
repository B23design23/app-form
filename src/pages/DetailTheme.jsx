import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { COULEUR_ANNEAU_THEME, numeroTheme } from '../lib/thematiques'
import AnneauProgression from '../components/AnneauProgression'
import CarteCours from '../components/CarteCours'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import './DetailTheme.css'

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
        if (error) setErreur(error.message)
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
  const ratio = total > 0 ? termines / total : 0

  return (
    <div className="espace-page espace-page-etroit">
      <button type="button" className="lien-retour" onClick={onRetour}>
        ← Retour
      </button>

      <div className="theme-detail-entete">
        <AnneauProgression
          radius={29}
          strokeWidth={6}
          ratio={ratio}
          afficherTrait={total > 0}
          trackColor="#F4F4F6"
          progressColor={COULEUR_ANNEAU_THEME}
          wrapperClassName="theme-detail-anneau"
        >
          <span className="theme-detail-numero" style={{ color: COULEUR_ANNEAU_THEME }}>
            {numeroTheme(index)}
          </span>
        </AnneauProgression>

        <div>
          <h1 className="theme-detail-titre">{nom}</h1>
          <p className="theme-detail-compte">
            {termines}/{total} cours terminés
          </p>
        </div>
      </div>

      {erreur ? (
        <p className="message message-erreur">Impossible de charger les cours ({erreur}).</p>
      ) : coursListe === null ? (
        <p>Chargement…</p>
      ) : coursListe.length === 0 ? (
        <p className="dashboard-etat-vide">Aucun cours pour le moment dans ce thème.</p>
      ) : (
        <div className="carte-cours-grille">
          {coursListe.map((cours) => (
            <CarteCours
              key={cours.id}
              cours={cours}
              statut={statutParCoursId.get(cours.id) ?? 'non_commence'}
              onClick={() => onOuvrirCours(cours.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default DetailTheme
