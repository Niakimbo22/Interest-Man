import type { MissionDef } from './types'

// Définitions des missions. Le PRÉDICAT (condition de réussite) vit ici, dans le code,
// car il n'est pas sérialisable. Le store ne persiste que l'ÉTAT (id → statut).

export interface MissionCheckCtx {
  netWorth: number
  cash: number
  level: number
  positionsCount: number
  ownsCrypto: boolean
  ownsRealEstate: boolean
  distinctCategories: number
}

export interface Mission extends MissionDef {
  /** Condition de réussite évaluée à chaque tick. */
  check: (ctx: MissionCheckCtx) => boolean
}

export const MISSIONS: Mission[] = [
  {
    id: 'first_invest',
    title: 'Premier pas',
    description: 'Réalise ton tout premier investissement.',
    icon: '🌱',
    reward: { cash: 500, xp: 50 },
    check: (c) => c.positionsCount >= 1,
  },
  {
    id: 'reach_12k',
    title: 'En route',
    description: 'Atteins 12 000 € de patrimoine net.',
    icon: '📈',
    reward: { cash: 1000, xp: 100 },
    check: (c) => c.netWorth >= 12000,
  },
  {
    id: 'crypto_holder',
    title: 'Bienvenue dans la crypto',
    description: 'Détiens au moins une crypto-monnaie.',
    icon: '🪙',
    reward: { xp: 80 },
    check: (c) => c.ownsCrypto,
  },
  {
    id: 'diversify',
    title: 'Ne mets pas tous tes œufs...',
    description: 'Détiens des actifs dans 3 catégories différentes.',
    icon: '🧺',
    reward: { cash: 2000, xp: 150 },
    check: (c) => c.distinctCategories >= 3,
  },
  {
    id: 'landlord',
    title: 'Pierre & béton',
    description: 'Deviens propriétaire d\'un bien immobilier.',
    icon: '🏠',
    reward: { xp: 120 },
    check: (c) => c.ownsRealEstate,
  },
  {
    id: 'reach_25k',
    title: 'Ça grimpe',
    description: 'Atteins 25 000 € de patrimoine net.',
    icon: '🚀',
    reward: { cash: 3000, xp: 250 },
    check: (c) => c.netWorth >= 25000,
  },
]
