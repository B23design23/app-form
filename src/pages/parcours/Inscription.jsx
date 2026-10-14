import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { typo } from '../../lib/typographie'
import GabaritParcours, { BarreEtapes, ChampParcours, ChoixParcours, TitreParcours } from '../../components/GabaritParcours'
import { useParcours } from './ParcoursContext'
import { messageErreurAuth } from './erreursAuth'
import { IMAGE_CREATION_COMPTE } from './images'
import './Parcours.css'

// Questions d'inscription puis création du compte (les questions viennent avant l'email et le
// mot de passe). Apprenant : prénom, statut, âge, motivation, compte (5 étapes) ; formateur :
// prénom, organisme, spécialité, compte (4 étapes). Valeurs stockées = enums existants.
const STATUTS = [
  { value: 'apprenti', label: 'Apprenti ou en formation' },
  { value: 'en_poste', label: 'Technicien en poste' },
  { value: 'reconversion', label: 'En reconversion' },
  { value: 'autre', label: 'Autre' },
]

const TRANCHES_AGE = [
  { value: '-18', label: 'Moins de 18 ans' },
  { value: '18-25', label: '18 à 25 ans' },
  { value: '26-35', label: '26 à 35 ans' },
  { value: '36-50', label: '36 à 50 ans' },
  { value: '50+', label: 'Plus de 50 ans' },
]

const MOTIVATIONS = [
  { value: 'trouver_emploi', label: 'Trouver un emploi dans le secteur' },
  { value: 'monter_competences', label: 'Monter en compétences sur mon poste' },
  { value: 'preparation_examen', label: 'Préparer un examen' },
  { value: 'curiosite', label: 'Par curiosité' },
  { value: 'autre', label: 'Autre' },
]

// Longueur minimale du mot de passe : réglage Supabase Auth (6 par défaut, non exposé par l'API
// publique) ; à aligner si le projet impose davantage.
const LONGUEUR_MIN_MOT_DE_PASSE = 6

// Champs de la ligne profiles selon le rôle (aussi passés en métadonnées au signUp, voir App.jsx)
export function champsProfil(role, reponses) {
  const base = { role, prenom: reponses.prenom.trim() }
  return role === 'formateur'
    ? { ...base, organisme: reponses.organisme.trim(), specialite: reponses.specialite.trim() }
    : { ...base, profession: reponses.profession, tranche_age: reponses.trancheAge, motivation: reponses.motivation }
}

// authUser : compte déjà connecté sans profil (inscription antérieure inachevée) → la dernière
// étape enregistre le profil au lieu de créer un compte.
function Inscription({ authUser, onRetourChoixProfil, onSeConnecter, onProfilCree }) {
  const { role, etape, reponses, allerEtape, majReponse, reinitialiser } = useParcours()
  const formateur = role === 'formateur'
  const etapesQuestions = formateur ? ['prenom', 'organisme', 'specialite'] : ['prenom', 'profession', 'trancheAge', 'motivation']
  const etapes = authUser ? etapesQuestions : [...etapesQuestions, 'compte']
  const total = etapes.length
  const cle = etapes[Math.min(etape, total) - 1]
  const prenom = reponses.prenom.trim()

  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [info, setInfo] = useState(null)

  const valide =
    cle === 'compte'
      ? email.trim().length > 0 && motDePasse.length >= LONGUEUR_MIN_MOT_DE_PASSE
      : String(reponses[cle] ?? '').trim().length > 0
  const derniere = etape >= total

  function retour() {
    setErreur(null)
    if (etape > 1) allerEtape(etape - 1)
    else onRetourChoixProfil()
  }

  async function creerCompte() {
    setEnvoi(true)
    // Email de confirmation désactivé sur le projet (mailer_autoconfirm) : signUp ouvre une session.
    // Les réponses partent aussi en métadonnées : App.jsx écrit la ligne profiles à partir d'elles
    // (fonctionne aussi si la confirmation d'email est activée un jour).
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: motDePasse,
      options: { data: champsProfil(role, reponses) },
    })
    setEnvoi(false)
    if (error) {
      setErreur(messageErreurAuth(error))
      return
    }
    reinitialiser()
    if (!data.session) setInfo('Compte créé : confirme ton adresse depuis l\'email reçu, puis connecte-toi.')
  }

  async function enregistrerProfil() {
    setEnvoi(true)
    const { error } = await supabase.from('profiles').insert({ id: authUser.id, email: authUser.email, ...champsProfil(role, reponses) })
    setEnvoi(false)
    if (error) {
      setErreur(`Ton profil n'a pas pu être enregistré (${error.message}).`)
      return
    }
    reinitialiser()
    onProfilCree()
  }

  function continuer(e) {
    e?.preventDefault()
    if (!valide || envoi) return
    setErreur(null)
    if (!derniere) allerEtape(etape + 1)
    else if (cle === 'compte') creerCompte()
    else enregistrerProfil()
  }

  return (
    <GabaritParcours
      formateur={formateur}
      barre={<BarreEtapes courante={Math.min(etape, total)} total={total} onRetour={retour} />}
      action={
        <button type="submit" form="form-inscription" className="bouton-primaire parcours-bouton" disabled={!valide || envoi}>
          {envoi ? 'Un instant…' : cle === 'compte' ? 'Créer mon compte' : derniere ? 'Terminer' : 'Continuer'}
        </button>
      }
      secondaire={
        cle === 'compte' ? (
          <button type="button" className="parcours-lien" onClick={onSeConnecter}>
            Déjà un compte ? <strong>Se connecter</strong>
          </button>
        ) : null
      }
    >
      <form id="form-inscription" className="parcours-formulaire" onSubmit={continuer}>
        {cle === 'prenom' && (
          <>
            <TitreParcours titre="Comment tu t'appelles ?" sousTitre="C'est le nom qu'on utilisera pour te saluer." />
            <ChampParcours
              grand
              label="Prénom"
              placeholder="Prénom"
              autoFocus
              value={reponses.prenom}
              onChange={(e) => majReponse('prenom', e.target.value)}
              autoComplete="given-name"
            />
          </>
        )}

        {cle === 'profession' && (
          <>
            <TitreParcours titre={`Enchanté ${prenom}. Tu es plutôt…`} />
            <ChoixParcours libelle="Statut" options={STATUTS} valeur={reponses.profession} onChange={(v) => majReponse('profession', v)} />
          </>
        )}

        {cle === 'trancheAge' && (
          <>
            <TitreParcours titre="Tu as quel âge ?" sousTitre="Une tranche suffit." />
            <ChoixParcours
              libelle="Tranche d'âge"
              options={TRANCHES_AGE}
              valeur={reponses.trancheAge}
              onChange={(v) => majReponse('trancheAge', v)}
              colonnes={2}
            />
          </>
        )}

        {cle === 'motivation' && (
          <>
            <TitreParcours titre="Qu'est-ce qui t'amène ?" />
            <ChoixParcours libelle="Motivation" options={MOTIVATIONS} valeur={reponses.motivation} onChange={(v) => majReponse('motivation', v)} />
          </>
        )}

        {cle === 'organisme' && (
          <>
            <TitreParcours
              titre={`Où enseignes-tu, ${prenom} ?`}
              sousTitre="Ton CFA, ton entreprise, ou ton nom si tu formes en indépendant."
            />
            <ChampParcours
              grand
              label="Organisme de formation"
              placeholder="Organisme de formation"
              autoFocus
              value={reponses.organisme}
              onChange={(e) => majReponse('organisme', e.target.value)}
              autoComplete="organization"
            />
          </>
        )}

        {cle === 'specialite' && (
          <>
            <TitreParcours titre="Quelle est ta spécialité ?" />
            <ChampParcours
              grand
              label="Spécialité"
              placeholder="Spécialité"
              autoFocus
              value={reponses.specialite}
              onChange={(e) => majReponse('specialite', e.target.value)}
            />
          </>
        )}

        {cle === 'compte' && (
          <>
            <div className="compte-bloc">
              <img className="compte-bloc-objet" src={IMAGE_CREATION_COMPTE} alt="" />
              <h1 className="compte-bloc-titre">{typo(`Plus qu'une étape, ${prenom}`)}</h1>
              <p className="compte-bloc-texte">Ton compte garde ta progression, tes XP et tes badges.</p>
            </div>
            <ChampParcours label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            <div className="parcours-champ-groupe">
              <ChampParcours
                label="Mot de passe"
                type="password"
                required
                minLength={LONGUEUR_MIN_MOT_DE_PASSE}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                autoComplete="new-password"
              />
              <span className="parcours-aide">{LONGUEUR_MIN_MOT_DE_PASSE} caractères minimum.</span>
            </div>
            {info && <p className="message message-info">{info}</p>}
          </>
        )}

        {erreur && <p className="parcours-message-erreur">{erreur}</p>}
      </form>
    </GabaritParcours>
  )
}

export default Inscription
