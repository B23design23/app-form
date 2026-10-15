import { typo } from './typographie'

// « Relancer par email » (Détail groupe, dashboard formateur). L'automatisation Make n°3 n'existe
// pas encore : en attendant, ouvre un mailto: vers l'élève. Fonction unique, pour pouvoir la
// brancher plus tard sur un webhook sans toucher l'interface.
export function relancerParEmail({ email, prenom, coursNonCommences = [] }) {
  if (!email) return
  const liste = coursNonCommences.filter(Boolean)
  const cours =
    liste.length === 0
      ? 'tes cours'
      : liste.length === 1
        ? `le cours « ${liste[0]} »`
        : `les cours ${liste.map((t) => `« ${t} »`).join(', ')}`
  const corps = typo(
    `Bonjour ${prenom ?? ''},\n\n${cours.charAt(0).toUpperCase()}${cours.slice(1)} t'attend sur Skillo. Dix minutes suffisent pour avancer : connecte-toi quand tu peux !\n\nÀ bientôt`
  )
  const url = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Ton cours t’attend sur Skillo')}&body=${encodeURIComponent(corps)}`
  window.location.href = url
}
