import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Modale from './Modale'

// Création d'un groupe (Mes groupes, dashboard formateur) : après création, onCree(id) ouvre
// directement le Détail du nouveau groupe.
function ModaleNouveauGroupe({ authUser, onFermer, onCree }) {
  const [nom, setNom] = useState('')
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState(null)

  const fermer = () => !enCours && onFermer()

  async function creer(e) {
    e?.preventDefault()
    if (nom.trim().length === 0 || enCours) return
    setErreur(null)
    setEnCours(true)
    const { data, error } = await supabase
      .from('groupes')
      .insert({ nom: nom.trim(), formateur_id: authUser.id })
      .select('id')
      .single()
    setEnCours(false)
    if (error) {
      setErreur(error.message)
      return
    }
    onCree(data.id)
  }

  return (
    <Modale
      titre="Nouveau groupe"
      sousTitre="Tu ajouteras les élèves juste après."
      onFermer={fermer}
      etroite
      actions={
        <>
          <button type="button" className="fm-lien-action" onClick={fermer}>
            Annuler
          </button>
          <button
            type="submit"
            form="form-nouveau-groupe"
            className="bouton-primaire"
            disabled={enCours || nom.trim().length === 0}
          >
            {enCours ? 'Création…' : 'Créer le groupe'}
          </button>
        </>
      }
    >
      <form id="form-nouveau-groupe" onSubmit={creer}>
        <label className="champ">
          <span>Nom du groupe</span>
          <input type="text" autoFocus placeholder="Ex. : Promo C" value={nom} onChange={(e) => setNom(e.target.value)} />
        </label>
      </form>
      {erreur && <p className="message message-erreur">{erreur}</p>}
    </Modale>
  )
}

export default ModaleNouveauGroupe
