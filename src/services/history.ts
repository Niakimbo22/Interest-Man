import { ASSETS } from '@/data/assets'
import type { AssetDef } from '@/data/types'

// Historique de prix PRÉ-GÉNÉRÉ, pour que les courbes aient une vraie forme dès la
// première seconde de jeu (sinon on démarre avec 1 point = aucune courbe).
//
// Chaque actif a une série déterministe (même seed → même historique), calibrée sur
// sa volatilité réelle, et RECALÉE pour que le dernier point tombe pile sur le prix
// de départ réaliste. On obtient une courbe crédible qui finit au bon prix.

export const HISTORY_DAYS = 90

/** PRNG déterministe (mulberry32) : même graine → même suite. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Loi normale approchée (Box-Muller). */
function gauss(rand: () => number): number {
  const u = Math.max(1e-9, rand())
  const v = rand()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/**
 * Part du mouvement d'un actif expliquée par le marché global, puis par son
 * secteur. Sans ça, on obtenait des aberrations du genre « Bitcoin −28 % pendant
 * qu'Ethereum fait +82 % » : dans la réalité, les cryptos montent et descendent
 * ensemble. Le reste est propre à l'actif.
 */
const BETA_MARKET = 0.3
const BETA_SECTOR: Record<string, number> = {
  crypto: 0.78, // les cryptos sont très fortement corrélées entre elles
  stock: 0.62,
  metal: 0.6,
  realestate: 0.45,
}

/** Suite de chocs journaliers partagés (marché ou secteur). */
function factorShocks(key: string, days: number): number[] {
  const rand = mulberry32(hashString(`factor:${key}`))
  return Array.from({ length: days }, () => gauss(rand))
}

/**
 * Historique de tous les actifs, généré ENSEMBLE pour que les corrélations
 * soient crédibles. Chaque série est recalée pour finir sur le prix de base.
 */
export function seedAllHistory(days = HISTORY_DAYS): Record<string, number[]> {
  const market = factorShocks('market', days)
  const sectors: Record<string, number[]> = {}
  for (const cat of Object.keys(BETA_SECTOR)) sectors[cat] = factorShocks(cat, days)

  const out: Record<string, number[]> = {}
  for (const asset of ASSETS) {
    const rand = mulberry32(hashString(asset.id))
    // Tendance de fond très douce : sur 90 jours, une dérive forte donnait des
    // +150 % absurdes en mode Réaliste.
    const drift = (rand() - 0.45) * asset.volatility * 0.06
    const betaSector = BETA_SECTOR[asset.category] ?? 0.3
    // Poids de la part idiosyncratique pour garder une variance totale ~= volatility.
    const idioWeight = Math.sqrt(Math.max(0, 1 - BETA_MARKET ** 2 - betaSector ** 2))

    const raw: number[] = []
    let v = 1
    for (let i = 0; i < days; i++) {
      const shock =
        BETA_MARKET * market[i] + betaSector * sectors[asset.category][i] + idioWeight * gauss(rand)
      v *= 1 + drift + shock * asset.volatility
      v = Math.max(0.15, v) // pas d'effondrement absurde
      raw.push(v)
    }

    const scale = asset.basePrice / raw[raw.length - 1]
    out[asset.id] = raw.map((x) => x * scale)
  }
  return out
}

/** Série d'un seul actif (utilisée en secours si un historique manque). */
export function seedSeries(asset: AssetDef, days = HISTORY_DAYS): number[] {
  return seedAllHistory(days)[asset.id]
}

/**
 * Variation sur une fenêtre donnée de la série (ex: 1 = dernière journée).
 * Sert à afficher un % COHÉRENT avec la courbe montrée à côté.
 */
export function changeOverWindow(series: number[] | undefined, window: number): number {
  if (!series || series.length < 2) return 0
  const last = series[series.length - 1]
  const idx = Math.max(0, series.length - 1 - window)
  const past = series[idx]
  if (!past) return 0
  return (last - past) / past
}
