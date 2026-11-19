import { useLayoutEffect, useRef, useState } from 'react'
import StatutBadge from '../components/StatutBadge'
import AnneauProgression from '../components/AnneauProgression'
import ContenuMarkdown from '../components/ContenuMarkdown'
import Icone from '../components/Icone'
import iconeCoche from '../Assets/check.svg?raw'
import iconeCroix from '../Assets/croix.svg?raw'
import iconeTrash from '../Assets/trash.svg?raw'
import iconeRetour from '../Assets/chevron-left.svg?raw'
import {
  composant,
  contrainteAccessibilite,
  espacements,
  nbSemantiquesAMode,
  ombres,
  ponctuation,
  primitifs,
  rayons,
  regleLecturePrimitif,
  regleOmbres,
  rolesTypo,
  semantiquesParRole,
  typographie,
  versionActuelle,
} from '../lib/designSystemDonnees'
import '../styles/shared.css'
import '../styles/espace-layout.css'
import '../components/formateur/Formateur.css'
import './FicheCours.css'
import './DesignSystem.css'

// Extrait du Design System, route /design-system (sans connexion, hors navigation). Valeurs, noms et
// descriptions lus au build (tokens/, docs/, :root de shared.css) ; éléments rendus avec les vrais
// composants et classes de l'app, stylés par tokens.generes.css.

function Section({ numero, surtitre, titre, intention, children }) {
  return (
    <section className="ds-section" aria-labelledby={`ds-${numero}`}>
      <span className="fiche-entete-theme">
        {numero} · {surtitre}
      </span>
      <h2 id={`ds-${numero}`} className="titre-section">{titre}</h2>
      <p className="ds-intention">{intention}</p>
      {children}
    </section>
  )
}

function Regles({ titre, lignes }) {
  if (!lignes?.length) return null
  return (
    <div className="ds-regles">
      <span className="ds-regles-titre">{titre}</span>
      {lignes.map((l) => (
        <ContenuMarkdown key={l} texte={l.replace(/^- /, '')} className="ds-regle" roleTypo="corps-courant" />
      ))}
    </div>
  )
}

function DoDont({ faire, pasFaire }) {
  return (
    <div className="ds-dodont">
      <Regles titre="DO" lignes={faire} />
      <Regles titre="DON'T" lignes={pasFaire} />
    </div>
  )
}

// --- 01 Couleurs ----------------------------------------------------------------------------------

// Fond sur lequel on montre un texte « sur-… » : celui que sa description désigne
const FOND_DU_TEXTE = {
  'texte-sur-accent': 'fond-accent',
  'texte-sur-marque': 'fond-marque',
  'texte-sur-marque-attenue': 'fond-marque',
  'texte-sur-inverse': 'fond-inverse',
  'texte-sur-inverse-attenue': 'fond-inverse',
  'texte-sur-action': 'fond-action',
  'texte-sur-erreur': 'fond-erreur-accentue',
  'texte-sur-succes': 'fond-succes-accentue',
  'texte-recompense': 'fond-inverse',
}

// Échantillon qui respecte la propriété du token : fond en background, texte en color, bordure en border
function Echantillon({ token }) {
  const v = `var(--${token.nom})`
  if (token.propriete === 'fond') return <span className="ds-echantillon" style={{ background: v }} />
  if (token.propriete === 'texte') {
    const fond = FOND_DU_TEXTE[token.nom] ?? 'fond-surface'
    return (
      <span className="titre-ligne ds-echantillon ds-echantillon-texte" style={{ background: `var(--${fond})`, color: v }}>
        Aa
      </span>
    )
  }
  return <span className="ds-echantillon ds-echantillon-bordure" style={{ borderColor: v }} />
}

const valeur = (c) => `${c.primitif} · ${c.hex}${c.alpha !== null ? ` à ${Math.round(c.alpha * 100)} %` : ''}`

function CarteSemantique({ token }) {
  return (
    <article className="espace-carte ds-carte">
      {token.modes ? (
        <div className="ds-modes">
          {['apprenant', 'formateur'].map((m) => (
            <div key={m} className={m === 'apprenant' ? 'mode-apprenant' : 'flow-page-formateur'}>
              <Echantillon token={token} />
              <span className="ds-meta">{m}</span>
              <span className="ds-meta">{valeur(token.modes[m])}</span>
            </div>
          ))}
        </div>
      ) : (
        <>
          <Echantillon token={token} />
          <span className="ds-meta">{valeur(token.valeur)}</span>
        </>
      )}
      <code className="titre-carte ds-nom">{token.nom}</code>
      <p className="ds-description">{token.description}</p>
    </article>
  )
}

function Couleurs() {
  return (
    <Section numero="01" surtitre="COULEURS" titre="Couleurs" intention="Les sémantiques que lisent les composants, regroupés par rôle.">
      <p className="ds-intention">{nbSemantiquesAMode} sémantiques changent de valeur avec le mode : leurs deux valeurs sont côte à côte (apprenant / formateur).</p>
      {semantiquesParRole.map(({ role, tokens }) => (
        <div key={role} className="ds-groupe">
          <h3 className="titre-section">{role}</h3>
          <div className="ds-grille">
            {tokens.map((t) => (
              <CarteSemantique key={t.nom} token={t} />
            ))}
          </div>
        </div>
      ))}
      <div className="ds-groupe">
        <h3 className="titre-section">Fonds de page</h3>
        <div className="espace-carte ds-fonds-page">
          {['apprenant', 'formateur'].map((m) => (
            <div key={m} className={`ds-fond-page ${m === 'apprenant' ? 'mode-apprenant' : 'flow-page-formateur'}`}>
              <code className="titre-ligne ds-nom">fond-page</code>
              <span className="ds-meta">{m}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ds-groupe">
        <h3 className="titre-section">Primitifs</h3>
        <p className="ds-intention">{regleLecturePrimitif}</p>
        <div className="ds-primitifs">
          {primitifs.map((p) => (
            <div key={p.nom} className="ds-primitif">
              {/* Valeur lue dans tokens/ au build : un composant ne lit pas la variable d'un primitif */}
              <span className="ds-primitif-pastille" style={{ background: p.hex }} />
              <code className="titre-ligne ds-nom">{p.nom}</code>
              <span className="ds-meta">{p.hex}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// --- 02 Typographie -------------------------------------------------------------------------------

// Texte d'exemple selon le rôle (les nombres pour les rôles de nombre)
const TEXTE_ECHANTILLON = {
  'typo-chiffre': '80\u202F%',
  'typo-chiffre-grand': '80\u202F%',
  'typo-compteur': '3 / 5',
  'typo-pastille': 'En cours',
  'typo-bouton': 'Continuer le cours',
  'typo-lien-texte': 'Tout voir',
  'typo-navigation': 'Cours',
  'typo-libelle-champ': 'Email',
  'typo-saisie-choix': 'Rechercher un cours',
  'typo-surtitre': 'Thermodynamique',
  'typo-meta': 'Leçon · Quiz · 5 min',
}
const TEXTE_DEFAUT = 'Le split mural, du montage au premier démarrage'

// Un échantillon par rôle (rolesTypo, tiré des tokens typo-…) ; taille et graisse lues sur l'élément rendu
function EchantillonTypo({ token, nom }) {
  const ref = useRef(null)
  const [mesure, setMesure] = useState('')
  useLayoutEffect(() => {
    const cs = getComputedStyle(ref.current)
    setMesure(`${cs.fontSize} · ${cs.fontWeight}`)
  }, [])
  const titre = token.startsWith('typo-titre-')
  const variante = token === 'typo-titre-ligne' ? ' ds-typo-echantillon-ligne' : titre ? ' ds-typo-echantillon-titre' : ''
  return (
    <article className={`espace-carte ds-carte${titre ? ' ds-carte-large' : ''}`}>
      <p ref={ref} className={`ds-typo-echantillon${variante}`} style={{ font: `var(--${token})` }}>
        {TEXTE_ECHANTILLON[token] ?? TEXTE_DEFAUT}
      </p>
      <span className="ds-meta">
        {nom} · <code className="titre-carte ds-nom">--{token}</code> · {mesure}
      </span>
    </article>
  )
}

function Typographie() {
  return (
    <Section numero="02" surtitre="TYPOGRAPHIE" titre="Typographie" intention="Urbanist partout ; une taille par usage.">
      <div className="ds-grille">
        {rolesTypo.map((r) => (
          <EchantillonTypo key={r.token} {...r} />
        ))}
      </div>
      <Regles titre="Typographie" lignes={typographie} />
      <Regles titre="Ponctuation" lignes={ponctuation} />
    </Section>
  )
}

// --- 03 Espacements -------------------------------------------------------------------------------

function Espacements() {
  return (
    <Section numero="03" surtitre="ESPACEMENTS" titre="Espacements" intention="Onze paliers, et seulement eux.">
      <div className="espace-carte ds-carte">
        <ul className="ds-echelle">
          {espacements.paliers.map((p) => (
            <li key={p.nom}>
              <code className="titre-ligne ds-nom">{p.nom}</code>
              <span className="ds-barre" style={{ width: `calc(var(--${p.nom}) * 6)` }} />
              <span className="ds-meta">{p.valeur}</span>
            </li>
          ))}
        </ul>
        <p className="ds-description">{espacements.description}</p>
      </div>
      <div className="espace-carte ds-carte">
        <ul className="ds-echelle">
          {espacements.roles.map((r) => (
            <li key={r.nom}>
              <code className="titre-ligne ds-nom">{r.nom}</code>
              <span className="ds-barre" style={{ width: `calc(var(--${r.nom}) * 6)` }} />
              <span className="ds-meta">{r.primitif} · {r.valeur}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

// --- 04 Formes et ombres --------------------------------------------------------------------------

function Formes() {
  return (
    <Section numero="04" surtitre="FORMES ET OMBRES" titre="Formes et ombres" intention="Des rayons généreux, et deux ombres seulement.">
      <div className="ds-grille">
        {rayons.map((r) => (
          <article key={r.nom} className="espace-carte ds-carte">
            <span className="ds-rayon" style={{ borderRadius: `var(${r.nom})` }} />
            <code className="titre-carte ds-nom">{r.nom}</code>
            <span className="ds-meta">{r.valeur}</span>
          </article>
        ))}
      </div>
      <div className="ds-grille">
        {ombres.map((o) => (
          <article key={o.nom} className={`espace-carte ds-carte ds-ombre ds${o.nom.slice(1)}`}>
            {o.nom === '--ombre-illustration' && <img className="ds-ombre-objet" src="/illustrations/quiz-flash.png" alt="" />}
            <code className="titre-carte ds-nom">{o.nom}</code>
            <span className="ds-meta">{o.valeur}</span>
            <span className="ds-meta">{o.description}</span>
          </article>
        ))}
      </div>
      <Regles titre="Ombres" lignes={[regleOmbres]} />
    </Section>
  )
}

// --- 05 Composants --------------------------------------------------------------------------------

const TABLEAU_SEPARATEUR = '| Élève | Statut |\n|---|---|\n| Nora | Non commencé |\n| Emma | En cours |\n| Lucas | Terminé |'

function Composants() {
  const bouton = composant('Bouton')
  const champ = composant('Champ')
  const pastille = composant('Pastille de statut')
  const separateur = composant('Séparateur')
  const barre = composant('Barre de progression')
  const carte = composant('Carte')
  const ligne = composant('Ligne de liste')
  const pastilleTexte = composant('Pastille')
  const lien = composant('Lien texte')
  const rond = composant('Bouton rond')
  const anneau = composant('Anneau')
  return (
    <Section numero="05" surtitre="COMPOSANTS" titre="Composants" intention="Les vrais composants de l'app, avec leurs règles.">
      <div className="ds-groupe">
        <h3 className="titre-section">Boutons</h3>
        <div className="ds-grille">
          <div className="espace-carte ds-carte ds-centre"><button type="button" className="bouton-primaire">Principal</button></div>
          <div className="espace-carte ds-carte ds-centre"><button type="button" className="bouton-secondaire">Secondaire</button></div>
          <div className="espace-carte ds-carte ds-centre"><button type="button" className="bouton-orange">Lancer le quiz flash</button></div>
          <div className="espace-carte ds-carte ds-centre">
            <button type="button" className="fm-bouton-texte-danger">
              <Icone svg={iconeTrash} className="cta-icone" />
              Supprimer
            </button>
          </div>
          <div className="espace-carte ds-carte ds-centre"><button type="button" className="bouton-ajouter">+ Ajouter une étape</button></div>
          <div className="espace-carte ds-carte ds-centre">
            <button type="button" className="bouton-primaire">Focus clavier</button>
            <span className="ds-meta">Touche Tab jusqu'au bouton</span>
          </div>
        </div>
        <DoDont faire={bouton.faire} pasFaire={bouton.pasFaire} />
      </div>

      <div className="ds-groupe">
        <h3 className="titre-section">Champ</h3>
        <div className="ds-grille">
          <div className="espace-carte ds-carte">
            <label className="champ">
              <span>Sur carte blanche, au repos</span>
              <input type="text" defaultValue="Poser une unité extérieure" />
            </label>
          </div>
          <div className="espace-carte ds-carte">
            <label className="champ">
              <span>Focus : clique dans le champ</span>
              <input type="text" placeholder="Titre du cours" />
            </label>
          </div>
          <div className="espace-page ds-sur-fond">
            <label className="champ">
              <span>Sur le fond de page</span>
              <input type="text" defaultValue="Rechercher un cours" />
            </label>
          </div>
        </div>
        <Regles titre="Fond" lignes={champ.fond} />
        <DoDont faire={champ.faire} pasFaire={champ.pasFaire} />
      </div>

      <div className="ds-groupe">
        <h3 className="titre-section">Pastilles de statut</h3>
        <div className="espace-carte ds-carte ds-pastilles">
          {['non_commence', 'a_faire', 'nouveau', 'en_cours', 'termine'].map((s) => (
            <StatutBadge key={s} statut={s} />
          ))}
        </div>
        <Regles titre="Règle" lignes={pastille.regle} />
        <DoDont faire={pastille.faire} pasFaire={pastille.pasFaire} />
      </div>

      <div className="ds-groupe">
        <h3 className="titre-section">Séparateur</h3>
        <div className="espace-carte ds-carte">
          <ContenuMarkdown texte={TABLEAU_SEPARATEUR} roleTypo="corps-courant" />
        </div>
        <Regles titre="Règle" lignes={separateur.regle} />
      </div>

      <div className="ds-groupe">
        <h3 className="titre-section">Carte</h3>
        <div className="ds-grille">
          <article className="carte ds-carte">
            <span className="titre-carte ds-nom">Carte</span>
            <span className="ds-meta">Fond blanc, rayon et padding Surface</span>
          </article>
        </div>
        <Regles titre="Rôle" lignes={carte.role} />
        <Regles titre="Règle" lignes={carte.regle} />
      </div>

      <div className="ds-groupe">
        <h3 className="titre-section">Ligne de liste</h3>
        <ul className="carte carte-liste ds-liste">
          {['Nettoyage du filtre', 'Le split mural'].map((t) => (
            <li key={t}>
              <button type="button" className="ligne-liste">
                <span className="titre-ligne ds-nom">{t}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="carte ds-carte">
          <div className="ligne-fond">
            <span className="ds-meta">Variante à fond</span>
          </div>
        </div>
        <Regles titre="Rôle" lignes={ligne.role} />
        <Regles titre="Règle" lignes={ligne.regle} />
      </div>

      <div className="ds-groupe">
        <h3 className="titre-section">Pastille</h3>
        <div className="espace-carte ds-carte ds-pastilles">
          <span className="pastille fm-pastille-groupe">Promo A</span>
          <span className="pastille fm-pastille-neutre">Non assigné</span>
          <span className="pastille fm-pastille-erreur">Bloquante</span>
          <span className="pastille fm-pastille-succes">Bon rythme</span>
        </div>
        <Regles titre="Rôle" lignes={pastilleTexte.role} />
        <Regles titre="Règle" lignes={pastilleTexte.regle} />
      </div>

      <div className="ds-groupe">
        <h3 className="titre-section">Lien texte, bouton rond, retour</h3>
        <div className="carte ds-carte ds-pastilles">
          <button type="button" className="lien-texte">Tout voir</button>
          <button type="button" className="bouton-rond" aria-label="Fermer">
            <Icone svg={iconeCroix} className="bouton-rond-icone" />
          </button>
          <button type="button" className="bouton-retour" aria-label="Retour à Cours">
            <Icone svg={iconeRetour} className="bouton-retour-icone" />
            <span className="bouton-retour-libelle">Cours</span>
          </button>
        </div>
        <Regles titre="Lien texte" lignes={lien.regle} />
        <Regles titre="Bouton rond" lignes={rond.role} />
      </div>

      <div className="ds-groupe">
        <h3 className="titre-section">Barre fine</h3>
        <div className="espace-carte ds-carte">
          <span className="fm-barre" aria-hidden="true">
            <span className="fm-barre-remplissage" style={{ width: '62%' }} />
          </span>
          <span className="ds-meta">62 % · 8 px dans une carte, 14 px en tête d'un écran plein</span>
        </div>
        <Regles titre="Voisin" lignes={barre.voisinAnneau} />
      </div>

      <div className="ds-groupe">
        <h3 className="titre-section">Anneau de progression</h3>
        <div className="espace-carte ds-carte ds-centre">
          <AnneauProgression ratio={0.6}>
            <span className="anneau-progression-valeur">60 %</span>
          </AnneauProgression>
        </div>
        <Regles titre="Rôle" lignes={anneau.role} />
      </div>

      <div className="ds-groupe">
        <h3 className="titre-section">Réponse de quiz</h3>
        <div className="fiche-reponses ds-reponses">
          <label className="fiche-reponse fiche-reponse-selectionnee">
            <input className="fiche-reponse-input" type="radio" name="ds-reponse" defaultChecked />
            <span className="fiche-reponse-controle fiche-reponse-controle-rond" aria-hidden="true" />
            <span className="fiche-reponse-texte">Sélectionnée</span>
          </label>
          <label className="fiche-reponse fiche-reponse-correcte">
            <input className="fiche-reponse-input" type="radio" name="ds-reponse-2" disabled />
            <span className="fiche-reponse-texte">Correcte</span>
            <span className="pastille fiche-reponse-pastille fiche-reponse-pastille-correcte">
              <Icone svg={iconeCoche} className="fiche-reponse-pastille-icone" />
              Bonne réponse
            </span>
          </label>
          <label className="fiche-reponse fiche-reponse-fausse">
            <input className="fiche-reponse-input" type="radio" name="ds-reponse-3" disabled />
            <span className="fiche-reponse-texte">Fausse</span>
            <span className="pastille fiche-reponse-pastille fiche-reponse-pastille-fausse">
              <Icone svg={iconeCroix} className="fiche-reponse-pastille-icone" />
              Ta réponse
            </span>
          </label>
        </div>
        <Regles titre="Contrainte d'accessibilité" lignes={contrainteAccessibilite} />
      </div>
    </Section>
  )
}

function DesignSystem() {
  return (
    <div className="ds-page">
      <main className="espace-page espace-page-etroit">
        <header className="ds-entete">
          <h1 className="titre-page">Design System Skillo</h1>
          <p className="ds-intention">
            Version {versionActuelle} · Projet personnel
          </p>
        </header>
        <Couleurs />
        <Typographie />
        <Espacements />
        <Formes />
        <Composants />
      </main>
    </div>
  )
}

export default DesignSystem
