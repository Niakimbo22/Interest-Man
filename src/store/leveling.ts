// Courbe de niveaux : chaque niveau L→L+1 coûte 100*L XP (cumulatif).
// Niveau 1 = 0 XP, niveau 2 = 100, niveau 3 = 300, niveau 4 = 600, niveau 5 = 1000...

export function xpToReachLevel(level: number): number {
  // XP cumulé requis pour ATTEINDRE ce niveau.
  let total = 0
  for (let l = 1; l < level; l++) total += 100 * l
  return total
}

export function levelForXp(xp: number): number {
  let level = 1
  while (xp >= xpToReachLevel(level + 1)) level++
  return level
}

/** Progression [0..1] dans le niveau courant + bornes XP. */
export function levelProgress(xp: number): {
  level: number
  currentFloor: number
  nextFloor: number
  ratio: number
} {
  const level = levelForXp(xp)
  const currentFloor = xpToReachLevel(level)
  const nextFloor = xpToReachLevel(level + 1)
  const ratio = (xp - currentFloor) / (nextFloor - currentFloor)
  return { level, currentFloor, nextFloor, ratio: Math.min(1, Math.max(0, ratio)) }
}
