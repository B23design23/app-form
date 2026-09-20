// Les 12 thématiques de la bibliothèque publique, dans l'ordre canonique (numéro affiché =
// position + 1). Cohérent avec la contrainte cours_categorie_publique_valide (migration 0002).
export const THEMATIQUES = [
  'Thermodynamique',
  'Fluides frigorigènes & environnement',
  'Cycle frigorifique & composants',
  'Psychrométrie & confort',
  'Technologies & systèmes clim',
  'Dimensionnement',
  'Installation & mise en service',
  'Brasage & dudgeon',
  'Entretien & maintenance',
  'Diagnostic & dépannage',
  'Réglementation & sécurité',
  'Efficacité énergétique',
]

// Couleur unique (marque) pour le trait et le numéro de tous les anneaux de thème.
export const COULEUR_ANNEAU_THEME = '#6C4FF6'

export function numeroTheme(index) {
  return String(index + 1).padStart(2, '0')
}
