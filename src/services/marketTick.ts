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
): Record<string, number> {
  const next: Record<string, number> = {}
  for (const asset of ASSETS) {
    if (liveIds.has(asset.id)) continue
    const price = current[asset.id] ?? asset.basePrice
    // dérive aléatoire + rappel doux vers le prix de base (mean reversion)
    const shock = gaussian() * asset.volatility
    const reversion = (asset.basePrice - price) / asset.basePrice * 0.05
    const newPrice = price * (1 + shock + reversion)
    // garde le prix dans une fourchette réaliste [40%, 300%] du prix de base
    const min = asset.basePrice * 0.4
    const max = asset.basePrice * 3
    next[asset.id] = Math.min(max, Math.max(min, newPrice))
  }
  return next
}

/** Prix initiaux = prix de base de chaque actif. */
export function initialPrices(): Record<string, number> {
  return Object.fromEntries(ASSETS.map((a) => [a.id, a.basePrice]))
}
