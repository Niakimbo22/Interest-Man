import type { AssetDef } from './types'

// Prix de départ = ordres de grandeur RÉELS (en euros), calibrés fin 2025 / début 2026.
// Les crypto ont un coingeckoId → prix live via CoinGecko, avec ces valeurs en fallback.
// Le reste utilise ces valeurs + une variation simulée réaliste (voir services/marketTick.ts).

export const ASSETS: AssetDef[] = [
  // ---- CRYPTO (live) ----
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', category: 'crypto', emoji: '₿',
    basePrice: 92000, volatility: 0.04, coingeckoId: 'bitcoin', unlockLevel: 1, unit: 'BTC' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', category: 'crypto', emoji: '⟠',
    basePrice: 3100, volatility: 0.05, coingeckoId: 'ethereum', unlockLevel: 1, unit: 'ETH' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', category: 'crypto', emoji: '◎',
    basePrice: 180, volatility: 0.07, coingeckoId: 'solana', unlockLevel: 2, unit: 'SOL' },
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', category: 'crypto', emoji: '🐕',
    basePrice: 0.32, volatility: 0.09, coingeckoId: 'dogecoin', unlockLevel: 3, unit: 'DOGE' },

  // ---- MÉTAUX (réaliste figé + tick) ----
  { id: 'gold', name: 'Or', symbol: 'XAU', category: 'metal', emoji: '🥇',
    basePrice: 2050, volatility: 0.008, unlockLevel: 1, unit: 'once' },
  { id: 'silver', name: 'Argent', symbol: 'XAG', category: 'metal', emoji: '🥈',
    basePrice: 27, volatility: 0.015, unlockLevel: 2, unit: 'once' },

  // ---- ACTIONS (réaliste figé + tick) ----
  { id: 'aapl', name: 'Apple', symbol: 'AAPL', category: 'stock', emoji: '🍎',
    basePrice: 205, volatility: 0.02, unlockLevel: 1, unit: 'action' },
  { id: 'tsla', name: 'Tesla', symbol: 'TSLA', category: 'stock', emoji: '🚗',
    basePrice: 340, volatility: 0.035, unlockLevel: 2, unit: 'action' },
  { id: 'nvda', name: 'Nvidia', symbol: 'NVDA', category: 'stock', emoji: '🎮',
    basePrice: 135, volatility: 0.03, unlockLevel: 2, unit: 'action' },
  { id: 'mc', name: 'LVMH', symbol: 'MC', category: 'stock', emoji: '👜',
    basePrice: 640, volatility: 0.018, unlockLevel: 3, unit: 'action' },

  // ---- IMMOBILIER (réaliste figé + tick très bas) ----
  { id: 'studio', name: 'Studio', symbol: 'STD', category: 'realestate', emoji: '🏠',
    basePrice: 145000, volatility: 0.004, unlockLevel: 2, unit: 'bien' },
  { id: 'appart', name: 'Appartement', symbol: 'APT', category: 'realestate', emoji: '🏢',
    basePrice: 320000, volatility: 0.004, unlockLevel: 3, unit: 'bien' },
  { id: 'immeuble', name: 'Immeuble', symbol: 'IMB', category: 'realestate', emoji: '🏙️',
    basePrice: 1250000, volatility: 0.005, unlockLevel: 4, unit: 'bien' },
]

export const ASSET_BY_ID: Record<string, AssetDef> = Object.fromEntries(
  ASSETS.map((a) => [a.id, a]),
)

export const CATEGORY_LABELS: Record<string, string> = {
  crypto: 'Crypto',
  metal: 'Métaux',
  stock: 'Actions',
  realestate: 'Immobilier',
}

export const CATEGORY_EMOJI: Record<string, string> = {
  crypto: '🪙',
  metal: '🥇',
  stock: '📈',
  realestate: '🏠',
}
