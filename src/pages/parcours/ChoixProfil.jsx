import Icone from '../../components/Icone'
import iconeChevron from '../../Assets/chevron-right.svg?raw'
import { typo } from '../../lib/typographie'
import GabaritParcours, { BoutonRetour, TitreParcours } from '../../components/GabaritParcours'
import { IMAGE_APPRENDRE, IMAGE_FORMER } from './images'
import './Parcours.css'

const PROFILS = [
  {
    role: 'apprenant',
    titre: 'Apprendre',
    texte: 'Cours, quiz et checklists, seul ou avec ton formateur.',
    image: IMAGE_APPRENDRE,
  },
  {
    role: 'formateur',
    titre: 'Former mes élèves',
    texte: 'Crée tes cours et suis la progression de tes groupes.',
    image: IMAGE_FORMER,
  },
]

// Choix du profil : pas de bouton principal, le choix d'une carte fait avancer.
function ChoixProfil({ onRetour, onChoisir, onSeConnecter }) {
  return (
    <GabaritParcours
      barre={<BoutonRetour onRetour={onRetour} />}
      action={null}
      secondaire={
        <button type="button" className="parcours-lien" onClick={onSeConnecter}>
          Déjà un compte ? <strong>Se connecter</strong>
        </button>
      }
    >
      <TitreParcours titre="Tu viens pour…" sousTitre="Ton espace s'adapte à ce choix." />
      <div className="profil-cartes">
        {PROFILS.map((profil) => (
          <button key={profil.role} type="button" className="profil-carte" onClick={() => onChoisir(profil.role)}>
            <img className="profil-carte-objet" src={profil.image} alt="" />
            <span className="profil-carte-texte">
              <span className="profil-carte-titre">{profil.titre}</span>
              <span className="profil-carte-description">{typo(profil.texte)}</span>
            </span>
            <Icone svg={iconeChevron} className="chevron-ligne" />
          </button>
        ))}
      </div>
    </GabaritParcours>
  )
}

export default ChoixProfil
