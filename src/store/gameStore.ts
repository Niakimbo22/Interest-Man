import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ASSETS, ASSET_BY_ID } from '@/data/assets'
import type { Category, Position } from '@/data/types'
import { MISSIONS, type MissionCheckCtx } from '@/data/missions'
import { applyEventImpact, initialPrices, simulateTick } from '@/services/marketTick'
import { randomChaosEvent, type ChaosEvent } from '@/data/chaosEvents'
import { GAME_MODES, type GameMode } from '@/data/gameModes'
import { currentModeDef, useSession } from './sessionStore'
import { levelForXp } from './leveling'

const STARTING_CASH = 10000
/** Probabilité qu'un événement Chaos se déclenche à chaque tick. */
const CHAOS_EVENT_CHANCE = 0.12
const HISTORY_MAX = 120
const PRICE_HISTORY_MAX = 30

function pushPriceHistory(
  hist: Record<string, number[]>,
  prices: Record<string, number>,
): Record<string, number[]> {
  const next: Record<string, number[]> = {}
  for (const a of ASSETS) {
    const series = hist[a.id] ?? [a.basePrice]
    next[a.id] = [...series, prices[a.id] ?? a.basePrice].slice(-PRICE_HISTORY_MAX)
  }
  return next
}

export type MissionStatus = 'active' | 'claimable' | 'done'

interface GameState {
  // --- joueur ---
  cash: number
  xp: number
  netWorthHistory: number[]
  missionStatus: Record<string, MissionStatus>
  positions: Record<string, Position>
  // --- marché ---
  prices: Record<string, number>
  prevPrices: Record<string, number>
  priceHistory: Record<string, number[]> // non persisté (mini-courbes)
  lastTickAt: number
  liveIds: string[]
  // --- mode Chaos ---
  activeEvent: ChaosEvent | null
  eventLog: { id: string; headline: string; emoji: string; tone: string; at: number }[]
  // --- flags ---
  hasHydrated: boolean

  // --- dérivés (helpers, pas persistés) ---
  level: () => number
  netWorth: () => number
  positionsList: () => Position[]
  isUnlocked: (assetId: string) => boolean

  // --- actions ---
  buy: (assetId: string, quantity: number) => { ok: boolean; error?: string }
  sell: (assetId: string, quantity: number) => { ok: boolean; error?: string }
  setLivePrices: (live: Record<string, number>) => void
  marketTick: () => void
  claimMission: (id: string) => void
  resetGame: () => void
  dismissEvent: () => void
  /** Applique un état reçu d'un coéquipier (mode Coop). */
  applyRemoteState: (patch: Partial<GameState>) => void
  _refreshMissions: () => void
}

function distinctCategories(positions: Record<string, Position>): Set<Category> {
  const set = new Set<Category>()
  for (const p of Object.values(positions)) {
    if (p.quantity > 0) set.add(ASSET_BY_ID[p.assetId].category)
  }
  return set
}

function computeNetWorth(cash: number, positions: Record<string, Position>, prices: Record<string, number>): number {
  let total = cash
  for (const p of Object.values(positions)) {
    const price = prices[p.assetId] ?? ASSET_BY_ID[p.assetId]?.basePrice ?? 0
    total += p.quantity * price
  }
  return total
}

const initialMissionStatus: Record<string, MissionStatus> = Object.fromEntries(
  MISSIONS.map((m) => [m.id, 'active' as MissionStatus]),
)

/** État d'une partie neuve, pour un cash de départ donné (varie selon le mode). */
function freshState(startingCash: number) {
  return {
    cash: startingCash,
    xp: 0,
    netWorthHistory: [startingCash],
    missionStatus: { ...initialMissionStatus },
    positions: {},
    prices: initialPrices(),
    prevPrices: initialPrices(),
    priceHistory: pushPriceHistory({}, initialPrices()),
    lastTickAt: 0,
    liveIds: [],
    activeEvent: null,
    eventLog: [],
  }
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      cash: STARTING_CASH,
      xp: 0,
      netWorthHistory: [STARTING_CASH],
      missionStatus: { ...initialMissionStatus },
      positions: {},
      prices: initialPrices(),
      prevPrices: initialPrices(),
      priceHistory: pushPriceHistory({}, initialPrices()),
      lastTickAt: 0,
      liveIds: [],
      activeEvent: null,
      eventLog: [],
      hasHydrated: false,

      level: () => levelForXp(get().xp),
      netWorth: () => computeNetWorth(get().cash, get().positions, get().prices),
      positionsList: () => Object.values(get().positions).filter((p) => p.quantity > 1e-9),
      isUnlocked: (assetId) => {
        const def = ASSET_BY_ID[assetId]
        return def ? levelForXp(get().xp) >= def.unlockLevel : false
      },

      buy: (assetId, quantity) => {
        const def = ASSET_BY_ID[assetId]
        if (!def) return { ok: false, error: 'Actif inconnu' }
        if (quantity <= 0) return { ok: false, error: 'Quantité invalide' }
        const state = get()
        if (levelForXp(state.xp) < def.unlockLevel)
          return { ok: false, error: `Débloqué au niveau ${def.unlockLevel}` }
        const price = state.prices[assetId] ?? def.basePrice
        const cost = price * quantity
        if (cost > state.cash) return { ok: false, error: 'Fonds insuffisants' }

        const existing = state.positions[assetId]
        const newQty = (existing?.quantity ?? 0) + quantity
        const newAvg = existing
          ? (existing.avgPrice * existing.quantity + cost) / newQty
          : price

        set({
          cash: state.cash - cost,
          positions: { ...state.positions, [assetId]: { assetId, quantity: newQty, avgPrice: newAvg } },
        })
        get()._refreshMissions()
        return { ok: true }
      },

      sell: (assetId, quantity) => {
        const state = get()
        const pos = state.positions[assetId]
        if (!pos || pos.quantity <= 0) return { ok: false, error: 'Aucune position' }
        if (quantity <= 0) return { ok: false, error: 'Quantité invalide' }
        const sellQty = Math.min(quantity, pos.quantity)
        const def = ASSET_BY_ID[assetId]
        const price = state.prices[assetId] ?? def.basePrice
        const proceeds = price * sellQty

        const remaining = pos.quantity - sellQty
        const positions = { ...state.positions }
        if (remaining <= 1e-9) delete positions[assetId]
        else positions[assetId] = { ...pos, quantity: remaining }

        set({ cash: state.cash + proceeds, positions })
        get()._refreshMissions()
        return { ok: true }
      },

      setLivePrices: (live) => {
        const state = get()
        if (Object.keys(live).length === 0) return
        set({
          prices: { ...state.prices, ...live },
          liveIds: Array.from(new Set([...state.liveIds, ...Object.keys(live)])),
        })
        get()._refreshMissions()
      },

      marketTick: () => {
        const state = get()
        const mode = currentModeDef()
        const liveSet = new Set(state.liveIds)
        const simulated = simulateTick(state.prices, liveSet, mode.volatilityMultiplier)
        let nextPrices = { ...state.prices, ...simulated }

        // Mode Chaos : un événement délirant peut frapper le marché.
        let firedEvent: ChaosEvent | null = null
        if (mode.chaosEvents && Math.random() < CHAOS_EVENT_CHANCE) {
          firedEvent = randomChaosEvent()
          nextPrices = applyEventImpact(nextPrices, firedEvent.target, firedEvent.impact)
        }

        const nw = computeNetWorth(state.cash, state.positions, nextPrices)
        const history = [...state.netWorthHistory, nw].slice(-HISTORY_MAX)
        set({
          prevPrices: state.prices,
          prices: nextPrices,
          priceHistory: pushPriceHistory(state.priceHistory, nextPrices),
          netWorthHistory: history,
          lastTickAt: Date.now(),
          ...(firedEvent
            ? {
                activeEvent: firedEvent,
                eventLog: [
                  { id: firedEvent.id, headline: firedEvent.headline, emoji: firedEvent.emoji, tone: firedEvent.tone, at: Date.now() },
                  ...state.eventLog,
                ].slice(0, 20),
              }
            : {}),
        })
        get()._refreshMissions()
      },

      dismissEvent: () => set({ activeEvent: null }),

      applyRemoteState: (patch) => {
        set(patch as Partial<GameState>)
        get()._refreshMissions()
      },

      claimMission: (id) => {
        const state = get()
        if (state.missionStatus[id] !== 'claimable') return
        const mission = MISSIONS.find((m) => m.id === id)
        if (!mission) return
        set({
          cash: state.cash + (mission.reward.cash ?? 0),
          xp: state.xp + mission.reward.xp,
          missionStatus: { ...state.missionStatus, [id]: 'done' },
        })
      },

      _refreshMissions: () => {
        const state = get()
        const nw = computeNetWorth(state.cash, state.positions, state.prices)
        const cats = distinctCategories(state.positions)
        const ctx: MissionCheckCtx = {
          netWorth: nw,
          cash: state.cash,
          level: levelForXp(state.xp),
          positionsCount: Object.values(state.positions).filter((p) => p.quantity > 1e-9).length,
          ownsCrypto: [...cats].includes('crypto'),
          ownsRealEstate: [...cats].includes('realestate'),
          distinctCategories: cats.size,
        }
        let changed = false
        const nextStatus = { ...state.missionStatus }
        for (const m of MISSIONS) {
          if (nextStatus[m.id] === undefined) nextStatus[m.id] = 'active'
          if (nextStatus[m.id] === 'active' && m.check(ctx)) {
            nextStatus[m.id] = 'claimable'
            changed = true
          }
        }
        if (changed) set({ missionStatus: nextStatus })
      },

      resetGame: () => set(freshState(currentModeDef().startingCash)),
    }),
    {
      name: GAME_MODES.realiste.storageKey,
      partialize: (s) => ({
        cash: s.cash,
        xp: s.xp,
        netWorthHistory: s.netWorthHistory,
        missionStatus: s.missionStatus,
        positions: s.positions,
        prices: s.prices,
        prevPrices: s.prevPrices,
        lastTickAt: s.lastTickAt,
        liveIds: s.liveIds,
        eventLog: s.eventLog,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true
          // Assure la présence des nouveaux actifs / missions ajoutés depuis la sauvegarde.
          for (const a of ASSETS) {
            if (state.prices[a.id] === undefined) state.prices[a.id] = a.basePrice
            if (state.prevPrices[a.id] === undefined) state.prevPrices[a.id] = a.basePrice
          }
          for (const m of MISSIONS) {
            if (state.missionStatus[m.id] === undefined) state.missionStatus[m.id] = 'active'
          }
          // Les mini-courbes ne sont pas persistées : on les réamorce sur les prix sauvegardés.
          state.priceHistory = pushPriceHistory({}, state.prices)
        }
      },
    },
  ),
)

/**
 * Bascule vers un autre mode de jeu.
 * Chaque mode possède son propre slot localStorage → changer de mode ne détruit
 * jamais la partie en cours d'un autre mode. Si le slot est vide, on démarre une
 * partie neuve avec le cash de départ du mode.
 */
export async function switchGameMode(mode: GameMode) {
  const def = GAME_MODES[mode]
  useSession.getState().setMode(mode)
  useGame.persist.setOptions({ name: def.storageKey })

  const hasSave = typeof localStorage !== 'undefined' && localStorage.getItem(def.storageKey) !== null
  if (hasSave) {
    await useGame.persist.rehydrate()
  } else {
    useGame.setState(freshState(def.startingCash))
  }
}
