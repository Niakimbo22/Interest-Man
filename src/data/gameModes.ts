// Les 3 modes de jeu. Chaque mode a sa PROPRE sauvegarde (slot séparé)
// → jouer au mode Chaos ne détruit jamais ta partie Réaliste.

export type GameMode = 'realiste' | 'chaos' | 'business'

export interface GameModeDef {
  id: GameMode
  name: string
  tagline: string
  emoji: string
  /** Clé de sauvegarde localStorage dédiée. */
  storageKey: string
  /** Multiplicateur de volatilité appliqué au marché. */
  volatilityMultiplier: number
  /** Le mode déclenche-t-il les événements délirants ? */
  chaosEvents: boolean
  /** Cash de départ. */
  startingCash: number
  accent: string
}

export const GAME_MODES: Record<GameMode, GameModeDef> = {
  realiste: {
    id: 'realiste',
    name: 'Réaliste',
    tagline: 'Vrais chiffres, vrais marchés. Construis ta fortune pas à pas.',
    emoji: '📊',
    storageKey: 'interest-man-save-v1',
    volatilityMultiplier: 1,
    chaosEvents: false,
    startingCash: 10000,
    accent: 'text-brand',
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos',
    tagline: 'Krachs délirants, hype absurde. Le marché a perdu la tête. 🤯',
    emoji: '🔥',
    storageKey: 'interest-man-save-chaos-v1',
    volatilityMultiplier: 4,
    chaosEvents: true,
    startingCash: 10000,
    accent: 'text-orange-400',
  },
  business: {
    id: 'business',
    name: 'Business Man',
    tagline: 'Montez une boîte à deux. Coop en ligne avec un ami. 🤝',
    emoji: '💼',
    storageKey: 'interest-man-save-business-v1',
    volatilityMultiplier: 1.5,
    chaosEvents: false,
    startingCash: 25000,
    accent: 'text-gold',
  },
}

export const MODE_LIST = Object.values(GAME_MODES)
