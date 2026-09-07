import './ProgressBar.css'

function ProgressBar({ etapeActuelle, totalEtapes, label }) {
  return (
    <div className="progress-bar">
      <span className="progress-bar-label">{label ?? `Étape ${etapeActuelle}/${totalEtapes}`}</span>
      <div className="progress-bar-track">
        {Array.from({ length: totalEtapes }, (_, i) => (
          <div
            key={i}
            className={`progress-bar-segment${i < etapeActuelle ? ' progress-bar-segment-remplie' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ProgressBar
