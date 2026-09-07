const ICONES_BADGE = {
  award: '🏅',
  check: '✅',
  flame: '🔥',
  star: '⭐',
  bolt: '⚡',
}

export function iconeBadge(icone) {
  return ICONES_BADGE[icone] ?? '🏆'
}
