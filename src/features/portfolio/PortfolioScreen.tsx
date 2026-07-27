import { useState } from 'react'
import { useGame } from '@/store/gameStore'
import { ASSET_BY_ID, CATEGORY_LABELS } from '@/data/assets'
import { money, price as fmtPrice, qty as fmtQty, pct } from '@/lib/format'
import { AssetLogo } from '@/components/AssetLogo'
import { TradeSheet } from '../market/TradeSheet'

function NetWorthChart({ data }: { data: number[] }) {
  if (data.length < 2) {
    return (
      <div className="h-28 flex items-center justify-center text-sm text-slate-500">
        Ta courbe apparaîtra dès que le marché bouge…
      </div>
    )
  }
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 100
  const h = 100
  const stepX = w / (data.length - 1)
  const pts = data.map((v, i) => `${i * stepX},${h - ((v - min) / range) * h}`)
  const up = data[data.length - 1] >= data[0]
  const color = up ? '#22c55e' : '#ef4444'

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-28">
      <defs>
        <linearGradient id="nwFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts.join(' ')} ${w},${h}`} fill="url(#nwFill)" />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PortfolioScreen() {
  const positions = useGame((s) => s.positionsList())
  const prices = useGame((s) => s.prices)
  const cash = useGame((s) => s.cash)
  const history = useGame((s) => s.netWorthHistory)
  const netWorth = useGame((s) => s.netWorth())
  const [tradingId, setTradingId] = useState<string | null>(null)

  const invested = positions.reduce((sum, p) => sum + p.quantity * (prices[p.assetId] ?? 0), 0)
  const costBasis = positions.reduce((sum, p) => sum + p.quantity * p.avgPrice, 0)
  const pnl = invested - costBasis
  const pnlPct = costBasis > 0 ? pnl / costBasis : 0

  return (
    <div className="p-3 space-y-3">
      <section className="card p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">Évolution du patrimoine</p>
        <p className="text-2xl font-extrabold text-white tabular-nums mb-1">{money(netWorth)}</p>
        <NetWorthChart data={history} />
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div>
            <p className="text-[10px] uppercase text-slate-400">Cash</p>
            <p className="font-bold text-brand-soft text-sm tabular-nums">{money(cash)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-400">Investi</p>
            <p className="font-bold text-white text-sm tabular-nums">{money(invested)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-400">+/- value</p>
            <p className={`font-bold text-sm tabular-nums ${pnl >= 0 ? 'text-gain' : 'text-loss'}`}>
              {money(pnl)}
            </p>
          </div>
        </div>
      </section>

      {positions.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-4xl mb-2">💼</p>
          <p className="font-bold text-white">Portefeuille vide</p>
          <p className="text-sm text-slate-400 mt-1">
            Va dans l'onglet Marché pour réaliser ton premier investissement.
          </p>
        </div>
      ) : (
        <section className="space-y-2">
          <div className="flex items-baseline justify-between px-1">
            <h2 className="font-bold text-white">Mes positions</h2>
            <span className={`text-sm font-semibold ${pnl >= 0 ? 'text-gain' : 'text-loss'}`}>
              {pct(pnlPct)}
            </span>
          </div>

          {positions.map((p) => {
            const def = ASSET_BY_ID[p.assetId]
            const priceNow = prices[p.assetId] ?? def.basePrice
            const value = p.quantity * priceNow
            const gain = value - p.quantity * p.avgPrice
            const gainPct = p.avgPrice > 0 ? (priceNow - p.avgPrice) / p.avgPrice : 0

            return (
              <button
                key={p.assetId}
                onClick={() => setTradingId(p.assetId)}
                className="w-full card px-3 py-3 flex items-center gap-3 text-left active:scale-[0.99] transition"
              >
                <AssetLogo assetId={def.id} symbol={def.symbol} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{def.name}</p>
                  <p className="text-xs text-slate-400">
                    {fmtQty(p.quantity)} {def.unit} · PRU {fmtPrice(p.avgPrice)}
                  </p>
                  <p className="text-[10px] text-slate-500">{CATEGORY_LABELS[def.category]}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-white tabular-nums text-sm">{money(value)}</p>
                  <p className={`text-xs font-semibold tabular-nums ${gain >= 0 ? 'text-gain' : 'text-loss'}`}>
                    {gain >= 0 ? '+' : ''}{money(gain)}
                  </p>
                  <p className={`text-[10px] tabular-nums ${gain >= 0 ? 'text-gain' : 'text-loss'}`}>
                    {pct(gainPct)}
                  </p>
                </div>
              </button>
            )
          })}
        </section>
      )}

      {tradingId && <TradeSheet assetId={tradingId} onClose={() => setTradingId(null)} />}
    </div>
  )
}
