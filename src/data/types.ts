// Types partagés du domaine de jeu.

export type Category = 'crypto' | 'metal' | 'stock' | 'realestate'

export interface AssetDef {
  id: string
  name: string
  symbol: string
  category: Category
  /** Emoji d'illustration (léger, pas d'assets images à charger). */
  emoji: string
  /** Prix de départ réaliste, en euros. */
  basePrice: number
  /** Volatilité par tour (écart-type relatif du random-walk). */
  volatility: number
  /** Identifiant CoinGecko pour les prix live (crypto uniquement). */
  coingeckoId?: string
  /** Niveau requis pour débloquer l'achat de cet actif. */
  unlockLevel: number
  /** Unité affichée (ex: "once", "action", "bien"). */
  unit: string
}

export interface Position {
  assetId: string
  quantity: number
  /** Prix moyen d'achat pondéré, en euros. */
  avgPrice: number
}

export type MissionStatus = 'active' | 'claimable' | 'done'

export interface MissionDef {
  id: string
  title: string
  description: string
  reward: { cash?: number; xp: number }
  /** Actif requis (facultatif) pour donner un indice visuel. */
  icon: string
}
