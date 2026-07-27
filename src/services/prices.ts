import { ASSETS } from '@/data/assets'

// Récupération des prix live pour les crypto via CoinGecko (gratuit, sans clé).
// Toujours tolérant : en cas d'échec réseau / limite de requêtes, on renvoie un objet vide
// et l'appelant garde les valeurs figées. Le jeu ne crashe jamais.

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price'

/** Renvoie un map { assetId: prixEuro } pour les crypto récupérées avec succès. */
export async function fetchLiveCryptoPrices(): Promise<Record<string, number>> {
  const cryptos = ASSETS.filter((a) => a.coingeckoId)
  if (cryptos.length === 0) return {}

  const ids = cryptos.map((a) => a.coingeckoId).join(',')
  const url = `${COINGECKO_URL}?ids=${ids}&vs_currencies=eur`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) return {}
    const data = (await res.json()) as Record<string, { eur?: number }>

    const out: Record<string, number> = {}
    for (const asset of cryptos) {
      const eur = data[asset.coingeckoId!]?.eur
      if (typeof eur === 'number' && eur > 0) out[asset.id] = eur
    }
    return out
  } catch {
    // réseau coupé / timeout / limite CoinGecko → fallback géré par l'appelant
    return {}
  }
}
