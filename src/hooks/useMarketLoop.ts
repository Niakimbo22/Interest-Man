import { useEffect } from 'react'
import { useGame } from '@/store/gameStore'
import { fetchLiveCryptoPrices } from '@/services/prices'

const TICK_MS = 6000 // variation simulée du marché
const LIVE_MS = 60000 // refresh des prix crypto live (respecte les limites CoinGecko)

/**
 * Boucle de marché : fait vivre les prix.
 * - récupère les prix crypto live (au montage + toutes les 60 s),
 * - applique un tick de simulation toutes les 6 s pour les autres actifs.
 * Tolérant au réseau : si CoinGecko échoue, on garde les valeurs figées.
 */
export function useMarketLoop() {
  const setLivePrices = useGame((s) => s.setLivePrices)
  const marketTick = useGame((s) => s.marketTick)

  useEffect(() => {
    let alive = true

    const refreshLive = async () => {
      const live = await fetchLiveCryptoPrices()
      if (alive) setLivePrices(live)
    }

    refreshLive()
    marketTick() // premier mouvement immédiat

    const tickTimer = setInterval(marketTick, TICK_MS)
    const liveTimer = setInterval(refreshLive, LIVE_MS)

    return () => {
      alive = false
      clearInterval(tickTimer)
      clearInterval(liveTimer)
    }
  }, [setLivePrices, marketTick])
}
