import './ReperEtapes.css'

// Repère d'étapes de la fiche de cours (leçon, checklist) : colonnes égales, pastille 28 px +
// libellé, ligne de liaison en arrière-plan : violette de la première étape jusqu'à l'étape en
// cours incluse (ou jusqu'à la dernière étape faite si aucune n'est en cours), neutre au-delà.
// etapes : [{ cle, libelle, etat: 'faite' | 'courante' | 'a-venir', cliquable, onClick }]
function ReperEtapes({ etapes }) {
  const n = etapes.length
  const indexCourante = etapes.findIndex((e) => e.etat === 'courante')
  const limite = indexCourante !== -1 ? indexCourante : etapes.map((e) => e.etat).lastIndexOf('faite')

  return (
    <nav className="reper-etapes" aria-label="Étapes du cours">
      {etapes.slice(0, -1).map((etape, i) => (
        <span
          key={`liaison-${etape.cle}`}
          className={`reper-liaison${i + 1 <= limite ? ' reper-liaison-faite' : ''}`}
          style={{ left: `${((i + 0.5) / n) * 100}%`, width: `${100 / n}%` }}
          aria-hidden="true"
        />
      ))}
      <ol className="reper-liste" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {etapes.map((etape, i) => {
          const contenu = (
            <>
              <span className="reper-pastille" aria-hidden="true">
                {etape.etat === 'faite' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17L4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className="reper-libelle">{etape.libelle}</span>
            </>
          )
          return (
            <li
              key={etape.cle}
              className={`reper-etape reper-etape-${etape.etat}`}
              aria-current={etape.etat === 'courante' ? 'step' : undefined}
            >
              {etape.cliquable ? (
                <button type="button" className="reper-bouton" onClick={etape.onClick}>
                  {contenu}
                </button>
              ) : (
                <span className="reper-bouton">{contenu}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default ReperEtapes
