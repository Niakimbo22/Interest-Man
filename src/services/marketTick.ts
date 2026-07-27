import { ASSETS } from '@/data/assets'

// Simulation de variation des prix pour les actifs NON-live (et pour "faire bouger" le jeu).
// Random-walk borné, calibré par la volatilité de chaque actif. Simple et crédible :
// un léger retour à la moyenne évite que les prix dérivent trop loin des ordres de grandeur réels.

/** Approximation d'une loi normale (somme de 3 uniformes → centré, borné). */
function gaussian(): number {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5
}

/**
 * Applique un tick de marché : renvoie les nouveaux prix pour les actifs simulés.
 * @param current  prix courants { assetId: prix }
 * @param liveIds  ids gérés en live (crypto) → on NE les simule PAS ici.
 */
export function simulateTick(
  current: Record<string, number>,
  liveIds: Set<string>,
  volatilityMultiplier = 1,
): Record<string, number> {
  const next: Record<string, number> = {}
  // En mode Chaos les prix peuvent partir bien plus loin qu'en Réaliste.
  const spread = Math.max(1, volatilityMultiplier)
  for (const asset of ASSETS) {
    if (liveIds.has(asset.id)) continue
    const price = current[asset.id] ?? asset.basePrice
    // dérive aléatoire + rappel doux vers le prix de base (mean reversion)
    const shock = gaussian() * asset.volatility * volatilityMultiplier
    const reversion = ((asset.basePrice - price) / asset.basePrice) * 0.05
    const newPrice = price * (1 + shock + reversion)
    // garde le prix dans une fourchette plausible autour du prix de base
    const min = asset.basePrice * (0.4 / spread)
    const max = asset.basePrice * 3 * spread
    next[asset.id] = Math.min(max, Math.max(min, newPrice))
  }
  return next
}

/** Applique l'impact d'un événement Chaos aux prix concernés. */
export function applyEventImpact(
  prices: Record<string, number>,
  target: { kind: 'category'; category: string } | { kind: 'asset'; assetId: string } | { kind: 'all' },
  impact: number,
): Record<string, number> {
  const next = { ...prices }
  for (const asset of ASSETS) {
    const hit =
      target.kind === 'all' ||
      (target.kind === 'category' && asset.category === target.category) ||
      (target.kind === 'asset' && asset.id === target.assetId)
    if (!hit) continue
    const price = next[asset.id] ?? asset.basePrice
    next[asset.id] = Math.max(asset.basePrice * 0.02, price * (1 + impact))
  }
  return next
}

/** Prix initiaux = prix de base de chaque actif. */
export function initialPrices(): Record<string, number> {
  return Object.fromEntries(ASSETS.map((a) => [a.id, a.basePrice]))
}
