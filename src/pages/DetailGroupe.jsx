import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Dropdown from '../components/Dropdown'
import Icone from '../components/Icone'
import StatutBadge from '../components/StatutBadge'
import Modale, { ModaleConfirmation } from '../components/formateur/Modale'
import MenuActions from '../components/formateur/MenuActions'
import { BarreFine, ListeCases, RetourFormateur } from '../components/formateur/Elements'
import { notifierMakeNouveauCours, notifierMakeNouvelEleve } from '../lib/notificationsMake'
import { relancerParEmail } from '../lib/relance'
import { typo } from '../lib/typographie'
import iconeTrash from '../Assets/trash.svg?raw'
import iconeEnveloppe from '../Assets/enveloppe.svg?raw'
import '../styles/shared.css'
import '../components/formateur/Formateur.css'
import './DetailGroupe.css'

const OPTIONS_FILTRE_STATUT = [
  { value: 'tous', label: 'Tous les statuts' },
  { value: 'non_commence', label: 'Non commencé' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'termine', label: 'Terminé' },
]

const LIMITE_ELEVES_AFFICHES = 8

function correspondRecherche(membre, terme) {
  const t = terme.trim().toLowerCase()
  if (!t) return true
  return [membre.prenom, membre.nom, membre.email].some((v) => (v ?? '').toLowerCase().includes(t))
}

const nomComplet = (m) => `${m.prenom ?? ''} ${m.nom ?? ''}`.trim()

// Détail d'un groupe : en-tête (ajout d'élève), cours assignés, une seule carte « Élèves » qui
// fusionne la liste et le suivi, suppression du groupe tout en bas (menu « … » sur mobile).
function DetailGroupe({ authUser, groupeId, onRetour }) {
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  const [groupe, setGroupe] = useState(null)
  const [membres, setMembres] = useState([])
  const [coursDuGroupe, setCoursDuGroupe] = useState([])
  const [progressionParCle, setProgressionParCle] = useState(new Map())
  const [badgesParApprenant, setBadgesParApprenant] = useState(new Map())
  const [erreurSuivi, setErreurSuivi] = useState(null)

  const [emailAjout, setEmailAjout] = useState('')
  const [ajoutEnCours, setAjoutEnCours] = useState(false)
  const [erreurAjout, setErreurAjout] = useState(null)

  const [rechercheEleve, setRechercheEleve] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('tous')
  const [tri, setTri] = useState({ colonne: null, direction: 'desc' })
  const [tousLesEleves, setTousLesEleves] = useState(false)

  const [eleveARetirer, setEleveARetirer] = useState(null)
  const [retraitEnCours, setRetraitEnCours] = useState(false)
  const [confirmationSuppression, setConfirmationSuppression] = useState(false)
  const [suppression, setSuppression] = useState(false)
  const [erreurSuppression, setErreurSuppression] = useState(null)

  const [assignationOuverte, setAssignationOuverte] = useState(false)
  const [mesCours, setMesCours] = useState([])
  const [coursChoisis, setCoursChoisis] = useState([])
  const [assignationEnCours, setAssignationEnCours] = useState(false)

  function handleTriColonne(colonne) {
    setTri((prev) => (prev.colonne !== colonne ? { colonne, direction: 'desc' } : { colonne, direction: prev.direction === 'desc' ? 'asc' : 'desc' }))
  }

  async function rechargerMembres() {
    const { data, error } = await supabase.rpc('get_membres_groupe', { p_groupe_id: groupeId })
    if (error) {
      setErreurSuivi(error.message)
      return []
    }
    setMembres(data ?? [])
    return data ?? []
  }

  async function rechargerSuivi(membresActuels) {
    const { data: coursGroupesData, error: erreurCours } = await supabase
      .from('cours_groupes')
      .select('cours(id, titre, visibilite)')
      .eq('groupe_id', groupeId)
    if (erreurCours) {
      setErreurSuivi(erreurCours.message)
      return
    }
    const coursData = (coursGroupesData ?? []).map((cg) => cg.cours).filter(Boolean)
    setCoursDuGroupe(coursData)

    if (membresActuels.length === 0) return
    const apprenantIds = membresActuels.map((m) => m.id)

    if (coursData.length > 0) {
      const { data: progressionData, error: erreurProgression } = await supabase
        .from('progression')
        .select('user_id, cours_id, statut')
        .in('user_id', apprenantIds)
        .in('cours_id', coursData.map((c) => c.id))
      if (erreurProgression) setErreurSuivi(erreurProgression.message)
      else setProgressionParCle(new Map((progressionData ?? []).map((p) => [`${p.user_id}_${p.cours_id}`, p.statut])))
    }

    const { data: badgesData, error: erreurBadges } = await supabase.from('user_badges').select('user_id').in('user_id', apprenantIds)
    if (erreurBadges) {
      setErreurSuivi(erreurBadges.message)
    } else {
      const compteur = new Map()
      for (const row of badgesData ?? []) compteur.set(row.user_id, (compteur.get(row.user_id) ?? 0) + 1)
      setBadgesParApprenant(compteur)
    }
  }

  useEffect(() => {
    let annule = false

    async function charger() {
      const { data, error } = await supabase.from('groupes').select('id, nom, formateur_id').eq('id', groupeId).maybeSingle()
      if (annule) return
      if (error || !data || data.formateur_id !== authUser.id) {
        setErreur(error?.message ?? "Ce groupe est introuvable ou ne t'appartient pas.")
        setChargement(false)
        return
      }
      setGroupe(data)
      const membresCharges = await rechargerMembres()
      if (annule) return
      await rechargerSuivi(membresCharges)
      if (!annule) setChargement(false)
    }

    charger()
    return () => {
      annule = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser.id, groupeId])

  async function handleAjouterEleve(e) {
    e.preventDefault()
    setErreurAjout(null)
    setAjoutEnCours(true)

    const { data: apprenantId, error: erreurRpc } = await supabase.rpc('find_apprenant_id_by_email', { p_email: emailAjout.trim() })
    if (erreurRpc) {
      setAjoutEnCours(false)
      setErreurAjout(`La recherche a échoué (${erreurRpc.message}).`)
      return
    }
    if (!apprenantId) {
      setAjoutEnCours(false)
      setErreurAjout("Aucun compte apprenant trouvé avec cet email — l'élève doit d'abord créer son compte.")
      return
    }

    const { error: erreurInsert } = await supabase.from('groupe_membres').insert({ groupe_id: groupeId, apprenant_id: apprenantId })
    setAjoutEnCours(false)
    if (erreurInsert) {
      setErreurAjout(`L'élève n'a pas pu être ajouté (${erreurInsert.message}).`)
      return
    }

    setEmailAjout('')
    notifierMakeNouvelEleve(apprenantId, groupeId)
    const membresActuels = await rechargerMembres()
    await rechargerSuivi(membresActuels)
  }

  async function confirmerRetrait() {
    setRetraitEnCours(true)
    await supabase.from('groupe_membres').delete().eq('groupe_id', groupeId).eq('apprenant_id', eleveARetirer.id)
    setRetraitEnCours(false)
    setEleveARetirer(null)
    const membresActuels = await rechargerMembres()
    await rechargerSuivi(membresActuels)
  }

  async function confirmerSuppressionGroupe() {
    setErreurSuppression(null)
    setSuppression(true)
    const { error } = await supabase.from('groupes').delete().eq('id', groupeId)
    if (error) {
      setSuppression(false)
      setConfirmationSuppression(false)
      setErreurSuppression(`Le groupe n'a pas pu être supprimé (${error.message}).`)
      return
    }
    onRetour()
  }

  // Assignation : liste des cours du formateur, cases cochées = cours déjà assignés au groupe.
  async function ouvrirAssignation() {
    const { data } = await supabase.from('cours').select('id, titre, categorie').eq('formateur_id', authUser.id).order('titre')
    setMesCours(data ?? [])
    setCoursChoisis(coursDuGroupe.map((c) => c.id))
    setAssignationOuverte(true)
  }

  async function validerAssignation() {
    setAssignationEnCours(true)
    const actuels = coursDuGroupe.map((c) => c.id)
    const ajouts = coursChoisis.filter((id) => !actuels.includes(id))
    const retraits = actuels.filter((id) => !coursChoisis.includes(id))
    if (ajouts.length) await supabase.from('cours_groupes').insert(ajouts.map((cours_id) => ({ cours_id, groupe_id: groupeId })))
    if (retraits.length) await supabase.from('cours_groupes').delete().eq('groupe_id', groupeId).in('cours_id', retraits)
    // Même notification que la création d'un cours assigné (Make n°2), pour chaque cours ajouté
    for (const id of ajouts) {
      const cours = mesCours.find((c) => c.id === id)
      if (cours) notifierMakeNouveauCours(cours.titre, [groupeId])
    }
    setAssignationEnCours(false)
    setAssignationOuverte(false)
    await rechargerSuivi(membres)
  }

  const statutDe = (membre, cours) => progressionParCle.get(`${membre.id}_${cours.id}`) ?? 'non_commence'

  function relancer(membre) {
    relancerParEmail({
      email: membre.email,
      prenom: membre.prenom,
      coursNonCommences: coursDuGroupe.filter((c) => statutDe(membre, c) === 'non_commence').map((c) => c.titre),
    })
  }

  const membresFiltres = membres
    .filter((m) => correspondRecherche(m, rechercheEleve))
    .filter((m) => filtreStatut === 'tous' || coursDuGroupe.some((c) => statutDe(m, c) === filtreStatut))
  const membresTries = tri.colonne
    ? [...membresFiltres].sort((a, b) => {
        const valeur = (m) => (tri.colonne === 'xp' ? m.xp_total : badgesParApprenant.get(m.id) ?? 0)
        return tri.direction === 'asc' ? valeur(a) - valeur(b) : valeur(b) - valeur(a)
      })
    : membresFiltres
  const membresAffiches = tousLesEleves ? membresTries : membresTries.slice(0, LIMITE_ELEVES_AFFICHES)
  const nbMasques = membresTries.length - membresAffiches.length

  if (chargement) {
    return (
      <div className="espace-page espace-page-etroit fm-page">
        <p>Chargement…</p>
      </div>
    )
  }

  if (erreur) {
    return (
      <div className="fm-detail">
        <div className="espace-page espace-page-etroit fm-page">
          <RetourFormateur libelle="Mes groupes" onRetour={onRetour} />
          <p className="message message-erreur">{erreur}</p>
        </div>
      </div>
    )
  }

  const enteteTri = (colonne, libelle) => (
    <button type="button" className="dg-tri" onClick={() => handleTriColonne(colonne)}>
      {libelle}
      {tri.colonne === colonne && <span aria-hidden="true">{tri.direction === 'desc' ? '▼' : '▲'}</span>}
    </button>
  )

  const menuEleve = (membre) => (
    <MenuActions
      titre={nomComplet(membre)}
      label={`Actions pour ${nomComplet(membre)}`}
      actions={[
        { libelle: 'Relancer par email', onClick: () => relancer(membre) },
        { libelle: 'Retirer du groupe', danger: true, onClick: () => setEleveARetirer(membre) },
      ]}
    />
  )

  return (
    <div className="fm-detail">
      <div className="espace-page espace-page-etroit fm-page">
        <div className="dg-barre-haut">
          <RetourFormateur libelle="Mes groupes" onRetour={onRetour} />
          <div className="dg-menu-mobile">
            <MenuActions
              titre={groupe.nom}
              actions={[{ libelle: 'Supprimer ce groupe', danger: true, onClick: () => setConfirmationSuppression(true) }]}
            />
          </div>
        </div>

        <div className="fm-entete dg-entete">
          <div className="fm-titres">
            <h1>{typo(groupe.nom)}</h1>
            <p className="fm-sous-titre">
              {membres.length} élève{membres.length > 1 ? 's' : ''} · {coursDuGroupe.length} cours assigné
              {coursDuGroupe.length > 1 ? 's' : ''}
            </p>
          </div>
          <form className="dg-ajout" onSubmit={handleAjouterEleve}>
            <label className="dg-ajout-champ">
              <Icone svg={iconeEnveloppe} className="dg-ajout-icone" />
              <input
                type="email"
                required
                placeholder="Email de l'élève"
                aria-label="Email de l'élève"
                value={emailAjout}
                onChange={(e) => setEmailAjout(e.target.value)}
              />
            </label>
            <button type="submit" className="bouton-primaire dg-ajout-bouton" disabled={ajoutEnCours || !emailAjout.trim()}>
              {ajoutEnCours ? 'Recherche…' : 'Ajouter'}
            </button>
          </form>
        </div>
        {erreurAjout && <p className="message message-erreur">{erreurAjout}</p>}
        {erreurSuppression && <p className="message message-erreur">{erreurSuppression}</p>}

        {/* Cours assignés */}
        <section className="dg-cours">
          <div className="dg-cours-entete">
            <h2>Cours assignés</h2>
            <button type="button" className="dg-lien-assigner" onClick={ouvrirAssignation}>
              + Assigner
            </button>
          </div>
          <ul className="dg-cours-liste">
            {coursDuGroupe.map((cours) => {
              const termines = membres.filter((m) => statutDe(m, cours) === 'termine').length
              return (
                <li key={cours.id} className="dg-cours-carte">
                  <span className="dg-cours-titre">{typo(cours.titre)}</span>
                  <BarreFine ratio={membres.length ? termines / membres.length : 0} />
                  <span className="fm-meta">
                    {termines} terminé{termines > 1 ? 's' : ''} sur {membres.length}
                  </span>
                </li>
              )
            })}
            <li className="dg-cours-ajout-element">
              <button type="button" className="dg-cours-ajout" onClick={ouvrirAssignation}>
                + Assigner un cours
              </button>
            </li>
          </ul>
        </section>

        {/* Élèves : liste et suivi fusionnés */}
        <section className="fm-carte dg-eleves">
          <div className="dg-eleves-entete">
            <h2>Élèves</h2>
            {membres.length > 0 && (
              <div className="dg-eleves-filtres">
                <label className="champ dg-recherche">
                  <span className="fm-libelle-masque">Rechercher un élève</span>
                  <input type="search" placeholder="Nom, prénom ou email" value={rechercheEleve} onChange={(e) => setRechercheEleve(e.target.value)} />
                </label>
                <label className="champ dg-filtre">
                  <span className="fm-libelle-masque">Statut</span>
                  <Dropdown value={filtreStatut} onChange={setFiltreStatut} options={OPTIONS_FILTRE_STATUT} />
                </label>
              </div>
            )}
          </div>

          {erreurSuivi ? (
            <p className="message message-erreur">Impossible de charger le suivi ({erreurSuivi}).</p>
          ) : membres.length === 0 ? (
            <p className="dashboard-etat-vide">Aucun élève dans ce groupe. Ajoute le premier avec son email.</p>
          ) : membresTries.length === 0 ? (
            <p className="dashboard-etat-vide">Aucun élève ne correspond à ta recherche.</p>
          ) : (
            <>
              <table className="dg-table">
                <thead>
                  <tr>
                    <th>Élève</th>
                    {coursDuGroupe.map((cours) => (
                      <th key={cours.id} title={cours.titre}>
                        {typo(cours.titre)}
                      </th>
                    ))}
                    <th>{enteteTri('xp', 'XP')}</th>
                    <th>{enteteTri('badges', 'Badges')}</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {membresAffiches.map((membre) => (
                    <tr key={membre.id}>
                      <td>
                        <span className="dg-eleve-nom">{nomComplet(membre)}</span>
                        <span className="dg-eleve-email">{membre.email}</span>
                      </td>
                      {coursDuGroupe.map((cours) => (
                        <td key={cours.id}>
                          <StatutBadge statut={statutDe(membre, cours)} />
                        </td>
                      ))}
                      <td>{membre.xp_total}</td>
                      <td>{badgesParApprenant.get(membre.id) ?? 0}</td>
                      <td className="dg-cellule-menu">{menuEleve(membre)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile : une carte par élève */}
              <ul className="dg-eleves-cartes">
                {membresAffiches.map((membre) => (
                  <li key={membre.id} className="dg-eleve-carte">
                    <div className="dg-eleve-carte-haut">
                      <span className="dg-eleve-carte-texte">
                        <span className="dg-eleve-nom">{nomComplet(membre)}</span>
                        <span className="dg-eleve-email">
                          {membre.email} · {membre.xp_total} XP · {badgesParApprenant.get(membre.id) ?? 0} badge
                          {(badgesParApprenant.get(membre.id) ?? 0) > 1 ? 's' : ''}
                        </span>
                      </span>
                      {menuEleve(membre)}
                    </div>
                    {coursDuGroupe.length > 0 && (
                      <ul className="dg-eleve-cours">
                        {coursDuGroupe.map((cours) => (
                          <li key={cours.id}>
                            <span>{typo(cours.titre)}</span>
                            <StatutBadge statut={statutDe(membre, cours)} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>

              {nbMasques > 0 && (
                <button type="button" className="dg-voir-plus" onClick={() => setTousLesEleves(true)}>
                  Voir les {nbMasques} autres élèves
                </button>
              )}
            </>
          )}
        </section>

        <div className="dg-suppression">
          <button type="button" className="fm-bouton-texte-danger" onClick={() => setConfirmationSuppression(true)}>
            <Icone svg={iconeTrash} className="cta-icone" />
            Supprimer ce groupe
          </button>
        </div>
      </div>

      {assignationOuverte && (
        <Modale
          titre="Assigner des cours"
          sousTitre={`Les élèves de ${groupe.nom} verront les cours choisis.`}
          onFermer={() => !assignationEnCours && setAssignationOuverte(false)}
          actions={
            <>
              <button type="button" className="fm-lien-action" onClick={() => setAssignationOuverte(false)} disabled={assignationEnCours}>
                Annuler
              </button>
              <button type="button" className="bouton-primaire" onClick={validerAssignation} disabled={assignationEnCours}>
                {assignationEnCours ? 'Enregistrement…' : 'Valider'}
              </button>
            </>
          }
        >
          {mesCours.length === 0 ? (
            <p className="fm-texte">Tu n'as pas encore créé de cours.</p>
          ) : (
            <ListeCases
              elements={mesCours.map((c) => ({ id: c.id, libelle: c.titre, detail: c.categorie }))}
              choisis={coursChoisis}
              onBasculer={(id) => setCoursChoisis((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]))}
            />
          )}
        </Modale>
      )}

      {eleveARetirer && (
        <ModaleConfirmation
          titre={`Retirer ${nomComplet(eleveARetirer)} ?`}
          texte={`L'élève quittera ${groupe.nom} et n'aura plus accès aux cours privés du groupe.`}
          libelleConfirmer="Retirer"
          enCours={retraitEnCours}
          onConfirmer={confirmerRetrait}
          onFermer={() => !retraitEnCours && setEleveARetirer(null)}
        />
      )}

      {confirmationSuppression && (
        <ModaleConfirmation
          titre="Supprimer ce groupe ?"
          texte="Les élèves ne seront plus rattachés et perdront l'accès aux cours privés associés. Cette action est irréversible."
          libelleConfirmer="Supprimer"
          enCours={suppression}
          onConfirmer={confirmerSuppressionGroupe}
          onFermer={() => !suppression && setConfirmationSuppression(false)}
        />
      )}
    </div>
  )
}

export default DetailGroupe
