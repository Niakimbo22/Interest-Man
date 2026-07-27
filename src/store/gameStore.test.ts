import { beforeEach, describe, expect, it } from 'vitest'
import { useGame } from './gameStore'
import { levelForXp, levelProgress } from './leveling'
import { applyEventImpact, simulateTick } from '@/services/marketTick'
import { ASSET_BY_ID } from '@/data/assets'

function reset(cash = 10000) {
  useGame.setState({
    cash,
    xp: 0,
    positions: {},
    prices: { gold: 2000, btc: 50000, aapl: 200 },
    prevPrices: { gold: 2000, btc: 50000, aapl: 200 },
    netWorthHistory: [cash],
    missionStatus: {},
    eventLog: [],
    activeEvent: null,
    liveIds: [],
  })
}

describe('achat / vente', () => {
  beforeEach(() => reset())

  it('débite le cash et crée la position au bon prix moyen', () => {
    const res = useGame.getState().buy('gold', 2) // 2 × 2000 €
    expect(res.ok).toBe(true)
    expect(useGame.getState().cash).toBe(6000)
    expect(useGame.getState().positions.gold).toMatchObject({ quantity: 2, avgPrice: 2000 })
  })

  it('calcule un prix moyen pondéré sur plusieurs achats', () => {
    useGame.getState().buy('gold', 1) // à 2000
    useGame.setState({ prices: { ...useGame.getState().prices, gold: 4000 } })
    useGame.getState().buy('gold', 1) // à 4000
    // PRU = (2000 + 4000) / 2 = 3000
    expect(useGame.getState().positions.gold.avgPrice).toBe(3000)
  })

  it('refuse un achat au-dessus du cash disponible', () => {
    const res = useGame.getState().buy('gold', 100) // 200 000 €
    expect(res.ok).toBe(false)
    expect(res.error).toBe('Fonds insuffisants')
    expect(useGame.getState().cash).toBe(10000)
  })

  it('refuse un actif verrouillé par le niveau', () => {
    // BTC est unlockLevel 1, on teste un actif de niveau supérieur.
    const locked = Object.values(ASSET_BY_ID).find((a) => a.unlockLevel > 1)!
    useGame.setState({ xp: 0, prices: { ...useGame.getState().prices, [locked.id]: 10 } })
    const res = useGame.getState().buy(locked.id, 1)
    expect(res.ok).toBe(false)
    expect(res.error).toContain('niveau')
  })

  it('crédite le cash à la vente et supprime la position vidée', () => {
    useGame.getState().buy('gold', 2)
    const res = useGame.getState().sell('gold', 2)
    expect(res.ok).toBe(true)
    expect(useGame.getState().cash).toBe(10000)
    expect(useGame.getState().positions.gold).toBeUndefined()
  })

  it('ne vend jamais plus que ce qu\'on détient', () => {
    useGame.getState().buy('gold', 1)
    useGame.getState().sell('gold', 999)
    expect(useGame.getState().cash).toBe(10000)
    expect(useGame.getState().positions.gold).toBeUndefined()
  })

  it('refuse une quantité nulle ou négative', () => {
    expect(useGame.getState().buy('gold', 0).ok).toBe(false)
    expect(useGame.getState().buy('gold', -5).ok).toBe(false)
    expect(useGame.getState().cash).toBe(10000)
  })
})

describe('patrimoine net', () => {
  beforeEach(() => reset())

  it('reste stable juste après un achat (cash converti en actif)', () => {
    useGame.getState().buy('gold', 2)
    expect(useGame.getState().netWorth()).toBe(10000)
  })

  it('suit la hausse du prix des actifs détenus', () => {
    useGame.getState().buy('gold', 2) // 4000 € investis
    useGame.setState({ prices: { ...useGame.getState().prices, gold: 3000 } })
    // 6000 cash + 2 × 3000 = 12 000
    expect(useGame.getState().netWorth()).toBe(12000)
  })
})

describe('niveaux', () => {
  it('progresse selon la courbe cumulative', () => {
    expect(levelForXp(0)).toBe(1)
    expect(levelForXp(99)).toBe(1)
    expect(levelForXp(100)).toBe(2)
    expect(levelForXp(300)).toBe(3)
    expect(levelForXp(600)).toBe(4)
  })

  it('donne une progression bornée entre 0 et 1', () => {
    const p = levelProgress(150)
    expect(p.level).toBe(2)
    expect(p.ratio).toBeGreaterThan(0)
    expect(p.ratio).toBeLessThanOrEqual(1)
  })
})

describe('marché', () => {
  it('ne touche jamais aux prix live (crypto)', () => {
    const prices = { btc: 50000, gold: 2000 }
    const next = simulateTick(prices, new Set(['btc']))
    expect(next.btc).toBeUndefined() // non simulé → conserve la valeur live
    expect(next.gold).toBeDefined()
  })

  it('garde les prix simulés dans une fourchette plausible', () => {
    let prices: Record<string, number> = { gold: 2000 }
    for (let i = 0; i < 500; i++) {
      prices = { ...prices, ...simulateTick(prices, new Set()) }
    }
    const base = ASSET_BY_ID.gold.basePrice
    expect(prices.gold).toBeGreaterThan(base * 0.3)
    expect(prices.gold).toBeLessThan(base * 4)
  })

  it('applique un krach à toute une catégorie', () => {
    const prices = { gold: 2000, silver: 30, aapl: 200 }
    const next = applyEventImpact(prices, { kind: 'category', category: 'metal' }, -0.5)
    expect(next.gold).toBe(1000)
    expect(next.silver).toBe(15)
    expect(next.aapl).toBe(200) // actions non touchées
  })

  it('applique un boom à un actif précis', () => {
    const next = applyEventImpact({ gold: 2000, btc: 50000 }, { kind: 'asset', assetId: 'btc' }, 1)
    expect(next.btc).toBe(100000)
    expect(next.gold).toBe(2000)
  })

  it('ne fait jamais tomber un prix à zéro', () => {
    const next = applyEventImpact({ gold: 2000 }, { kind: 'all' }, -0.99)
    expect(next.gold).toBeGreaterThan(0)
  })
})
