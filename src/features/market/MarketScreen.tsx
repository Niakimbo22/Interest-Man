import { useState } from 'react'
import { ASSETS, CATEGORY_LABELS } from '@/data/assets'
import type { Category } from '@/data/types'
import { useGame } from '@/store/gameStore'
import { price as fmtPrice, pct } from '@/lib/format'
import { Sparkline } from '@/components/Sparkline'
import { AssetLogo } from '@/components/AssetLogo'
import { changeOverWindow } from '@/services/history'
import { TradeSheet } from './TradeSheet'

/** Fenêtre affichée dans la liste : 30 derniers jours. */
const ROW_WINDOW = 30

const CATEGORIES: Category[] = ['crypto', 'metal', 'stock', 'realestate']

function AssetRow({ assetId, onTrade }: { assetId: string; onTrade: (id: string) => void }) {
  const def = ASSETS.find((a) => a.id === assetId)!
  const priceNow = useGame((s) => s.prices[assetId] ?? def.basePrice)
  const history = useGame((s) => s.priceHistory[assetId])
  const owned = useGame((s) => s.positions[assetId]?.quantity ?? 0)
  const unlocked = useGame((s) => s.isUnlocked(assetId))
  const isLive = useGame((s) => s.liveIds.includes(assetId))

  // La courbe et le % portent sur la MÊME fenêtre : sinon on affichait un
  // pourcentage vert au-dessus d'une courbe rouge.
  const series = (history ?? []).slice(-ROW_WINDOW)
  const chg = changeOverWindow(history, ROW_WINDOW)

  return (
    <button
      onClick={() => unlocked && onTrade(assetId)}
      disabled={!unlocked}
      className={`w-full card px-3 py-3 flex items-center gap-3 text-left transition active:scale-[0.99] ${
        unlocked ? '' : 'opacity-50'
      }`}
    >
      <AssetLogo assetId={def.id} symbol={def.symbol} size={36} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-bold text-white truncate">{def.name}</p>
          {isLive && (
            <span className="text-[9px] font-bold bg-gain/20 text-gain px-1.5 py-0.5 rounded">LIVE</span>
          )}
        </div>
        <p className="text-xs text-slate-400">
          {unlocked ? (
            owned > 0 ? <span className="text-brand-soft">Tu en détiens</span> : def.symbol
          ) : (
            <span className="text-gold">🔒 Niveau {def.unlockLevel}</span>
          )}
        </p>
      </div>

      <Sparkline data={series} width={64} height={30} positive={chg >= 0} />

      <div className="text-right shrink-0 w-[88px]">
        <p className="font-bold text-white tabular-nums text-sm">{fmtPrice(priceNow)}</p>
        <p className={`text-xs font-semibold tabular-nums ${chg >= 0 ? 'text-gain' : 'text-loss'}`}>
          {pct(chg)}
        </p>
        <p className="text-[9px] text-slate-500">30 j</p>
      </div>
    </button>
  )
}

export function MarketScreen() {
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [tradingId, setTradingId] = useState<string | null>(null)

  const visible = ASSETS.filter((a) => filter === 'all' || a.category === filter)

  return (
    <div className="p-3 space-y-3">
      {/* Filtres par catégorie */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => setFilter('all')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold transition ${
            filter === 'all' ? 'bg-brand text-base-900' : 'bg-base-700 text-slate-300'
          }`}
        >
          Tout
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold transition ${
              filter === c ? 'bg-brand text-base-900' : 'bg-base-700 text-slate-300'
            }`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visible.map((a) => (
          <AssetRow key={a.id} assetId={a.id} onTrade={setTradingId} />
        ))}
      </div>

      <p className="text-center text-[11px] text-slate-500 pt-2">
        Crypto en direct via CoinGecko · autres actifs simulés sur des valeurs réelles
      </p>

      {tradingId && <TradeSheet assetId={tradingId} onClose={() => setTradingId(null)} />}
    </div>
  )
}
