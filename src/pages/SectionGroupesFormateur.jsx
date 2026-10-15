import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Icone from '../components/Icone'
import iconeChevron from '../Assets/chevron-right.svg?raw'
import iconePlus from '../Assets/plus.svg?raw'
import ModaleNouveauGroupe from '../components/formateur/ModaleNouveauGroupe'
import { BarreFine } from '../components/formateur/Elements'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import '../components/formateur/Formateur.css'
import './FormateurListes.css'
import { typo } from '../lib/typographie'
import { statsGroupe } from '../lib/groupes'

const SEUIL_BON_RYTHME = 0.7

// Une seule pastille d'état, par priorité : aucun cours, élèves à relancer, bon rythme.
function pastilleEtat(stats) {
  if (stats.nbCours === 0) return { classe: 'fm-pastille-neutre', texte: 'Assigne un premier cours' }
  if (stats.aRelancer > 0) {
    return { classe: 'fm-pastille-erreur', texte: `${stats.aRelancer} élève${stats.aRelancer > 1 ? 's' : ''} à relancer` }
  }
  if (stats.ratio !== null && stats.ratio >= SEUIL_BON_RYTHME) return { classe: 'fm-pastille-succes', texte: 'Bon rythme' }
  return null
}

function SectionGroupesFormateur({ authUser, onOuvrirGroupe }) {
  const [donnees, setDonnees] = useState(null)
  const [erreur, setErreur] = useState(null)

  const [modalOuverte, setModalOuverte] = useState(false)

  useEffect(() => {
    let annule = false

    async function charger() {
      const { data: groupes, error } = await supabase.from('groupes').select('id, nom').eq('formateur_id', authUser.id).order('nom')
      if (annule) return
      if (error) {
        setErreur(error.message)
        return
      }
      const ids = (groupes ?? []).map((g) => g.id)
      if (ids.length === 0) {
        setDonnees({ groupes: [], membres: [], coursGroupes: [], progression: [] })
        return
      }
      const [membresRes, coursGroupesRes] = await Promise.all([
        supabase.from('groupe_membres').select('groupe_id, apprenant_id').in('groupe_id', ids),
        supabase.from('cours_groupes').select('groupe_id, cours_id').in('groupe_id', ids),
      ])
      if (annule) return
      const membres = membresRes.data ?? []
      const coursGroupes = coursGroupesRes.data ?? []
      const idsEleves = [...new Set(membres.map((m) => m.apprenant_id))]
      const idsCours = [...new Set(coursGroupes.map((cg) => cg.cours_id))]
      const { data: progression } =
        idsEleves.length && idsCours.length
          ? await supabase.from('progression').select('user_id, cours_id, statut, updated_at').in('user_id', idsEleves).in('cours_id', idsCours)
          : { data: [] }
      if (annule) return
      setDonnees({ groupes: groupes ?? [], membres, coursGroupes, progression: progression ?? [] })
    }

    charger()
    return () => {
      annule = true
    }
  }, [authUser.id])

  const nbEleves = donnees ? new Set(donnees.membres.map((m) => m.apprenant_id)).size : 0

  return (
    <div className="espace-page espace-page-etroit fm-page">
      <div className="fm-entete">
        <div className="fm-titres">
          <h1>Mes groupes</h1>
          {donnees && (
            <p className="fm-sous-titre">
              {donnees.groupes.length} groupe{donnees.groupes.length > 1 ? 's' : ''} · {nbEleves} élève{nbEleves > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button type="button" className="bouton-primaire fm-bouton-principal" onClick={() => setModalOuverte(true)} aria-label="Créer un groupe">
          <Icone svg={iconePlus} className="fm-bouton-principal-icone" />
          <span className="fm-bouton-principal-libelle">+ Créer un groupe</span>
        </button>
      </div>

      {erreur ? (
        <p className="message message-erreur">Impossible de charger tes groupes ({erreur}).</p>
      ) : donnees === null ? (
        <p>Chargement…</p>
      ) : donnees.groupes.length === 0 ? (
        <p className="dashboard-etat-vide dashboard-etat-vide-centre">Aucun groupe pour le moment.</p>
      ) : (
        <ul className="fl-grille fl-grille-groupes">
          {donnees.groupes.map((groupe) => {
            const stats = statsGroupe(groupe, donnees.membres, donnees.coursGroupes, donnees.progression)
            const etat = pastilleEtat(stats)
            return (
              <li key={groupe.id}>
                <button type="button" className="fl-carte fl-carte-groupe" onClick={() => onOuvrirGroupe(groupe.id)}>
                  <span className="fl-carte-groupe-haut">
                    <span className="fl-carte-titre fl-carte-titre-groupe">{typo(groupe.nom)}</span>
                    <Icone svg={iconeChevron} className="chevron-ligne" />
                  </span>
                  <span className="fl-carte-meta">
                    {stats.nbEleves} élève{stats.nbEleves > 1 ? 's' : ''} ·{' '}
                    {stats.nbCours === 0 ? 'aucun cours' : `${stats.nbCours} cours`}
                  </span>
                  <span className="fl-progression">
                    <span className="fl-progression-ligne">
                      <span>Cours terminés</span>
                      <strong>{stats.ratio === null ? '-' : `${Math.round(stats.ratio * 100)} %`}</strong>
                    </span>
                    <BarreFine ratio={stats.ratio ?? 0} />
                  </span>
                  {etat && <span className={`fm-pastille ${etat.classe}`}>{etat.texte}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {modalOuverte && (
        <ModaleNouveauGroupe
          authUser={authUser}
          onFermer={() => setModalOuverte(false)}
          onCree={(id) => {
            setModalOuverte(false)
            onOuvrirGroupe(id)
          }}
        />
      )}
    </div>
  )
}

export default SectionGroupesFormateur
