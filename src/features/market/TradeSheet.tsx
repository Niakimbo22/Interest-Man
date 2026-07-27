import { useMemo, useState } from 'react'
import { useGame } from '@/store/gameStore'
import { ASSET_BY_ID } from '@/data/assets'
import { money, price as fmtPrice, qty as fmtQty, pct } from '@/lib/format'
import { useCoop } from '@/coop/coopStore'
import { requestTrade, sendCoopMessage } from '@/coop/p2p'
import { AssetLogo } from '@/components/AssetLogo'
import { PriceChart, RANGES, sliceRange, type RangeId } from '@/components/PriceChart'
import { changeOverWindow } from '@/services/history'

type Mode = 'buy' | 'sell'

export function TradeSheet({ assetId, onClose }: { assetId: string; onClose: () => void }) {
  const def = ASSET_BY_ID[assetId]
  const cash = useGame((s) => s.cash)
  const priceNow = useGame((s) => s.prices[assetId] ?? def.basePrice)
  const history = useGame((s) => s.priceHistory[assetId])
  const position = useGame((s) => s.positions[assetId])
  const buy = useGame((s) => s.buy)
  const sell = useGame((s) => s.sell)

  const [mode, setMode] = useState<Mode>('buy')
  const [amount, setAmount] = useState(0) // montant en euros
  const [flash, setFlash] = useState<{ ok: boolean; msg: string } | null>(null)
  const [range, setRange] = useState<RangeId>('1M')

  // Mode Coop : seul le Trader passe les ordres. L'Analyste, lui, recommande.
  const coopRole = useCoop((s) => s.role)
  const inCoopRoom = useCoop((s) => s.roomCode !== null)
  const isAnalyst = inCoopRoom && coopRole === 'analyste'

  const holdingsValue = (position?.quantity ?? 0) * priceNow
  const maxAmount = mode === 'buy' ? cash : holdingsValue
  const quantity = priceNow > 0 ? amount / priceNow : 0

  const rangeDays = RANGES.find((r) => r.id === range)!.days
  const chartData = sliceRange(history ?? [], rangeDays)
  // % calculé sur la période affichée → toujours cohérent avec le graphique.
  const chg = changeOverWindow(history, Number.isFinite(rangeDays) ? rangeDays : (history?.length ?? 1))

  const presets = useMemo(() => [0.1, 0.25, 0.5, 1], [])

  /** L'Analyste ne peut pas acheter : il envoie une recommandation à son associé. */
  const recommend = () => {
    const verb = mode === 'buy' ? 'acheter' : 'vendre'
    sendCoopMessage(
      `Je recommande de ${verb} ${def.name}${amount > 0 ? ` pour ${money(amount)}` : ''} — prix actuel ${fmtPrice(priceNow)}.`,
      assetId,
    )
    setFlash({ ok: true, msg: 'Recommandation envoyée à ton associé 📨' })
    setTimeout(onClose, 700)
  }

  const submit = () => {
    if (amount <= 0) return
    // En coop, l'ordre passe par l'hôte de la partie (autorité sur le portefeuille commun).
    const res = inCoopRoom
      ? requestTrade(mode, assetId, quantity)
      : mode === 'buy'
        ? buy(assetId, quantity)
        : sell(assetId, quantity)
    if (res.ok) {
      setFlash({ ok: true, msg: mode === 'buy' ? 'Achat effectué ✅' : 'Vente effectuée ✅' })
      setAmount(0)
      setTimeout(onClose, 550)
    } else {
      setFlash({ ok: false, msg: res.error ?? 'Erreur' })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      {/* Fond opaque : en semi-transparent, la liste du marché se voyait au travers. */}
      <div className="relative w-full max-w-md bg-base-800 border-t border-base-700 rounded-t-3xl p-5 safe-bottom animate-[slideUp_.2s_ease-out] shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-base-600" />

        <div className="flex items-center gap-3 mb-3">
          <AssetLogo assetId={def.id} symbol={def.symbol} size={40} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white leading-tight truncate">{def.name}</p>
            <p className="text-xs text-slate-400">{def.symbol}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-white tabular-nums text-lg">{fmtPrice(priceNow)}</p>
            <p className={`text-xs font-semibold ${chg >= 0 ? 'text-gain' : 'text-loss'}`}>
              {pct(chg)} <span className="text-slate-500">/ {range}</span>
            </p>
          </div>
        </div>

        {/* Graphique + sélecteur de période */}
        <div className="mb-2 pr-10">
          <PriceChart data={chartData} height={150} />
        </div>
        <div className="flex gap-1.5 mb-4">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                range === r.id ? 'bg-base-600 text-white' : 'text-slate-400'
              }`}
            >
              {r.id}
            </button>
          ))}
        </div>

        {/* Toggle Acheter / Vendre */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-base-900 rounded-xl mb-4">
          {(['buy', 'sell'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setAmount(0); setFlash(null) }}
              className={`py-2 rounded-lg font-semibold text-sm transition ${
                mode === m
                  ? m === 'buy' ? 'bg-gain text-white' : 'bg-loss text-white'
                  : 'text-slate-400'
              }`}
            >
              {m === 'buy' ? 'Acheter' : 'Vendre'}
            </button>
          ))}
        </div>

        <div className="text-center mb-3">
          <p className="text-xs text-slate-400 mb-1">Montant à {mode === 'buy' ? 'investir' : 'vendre'}</p>
          <p className="text-3xl font-extrabold text-white tabular-nums">{money(amount)}</p>
          <p className="text-xs text-slate-400 mt-1">≈ {fmtQty(quantity)} {def.unit}</p>
        </div>

        {/* Presets en % du max */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(Math.max(0, maxAmount * p))}
              className="btn btn-ghost py-2 text-sm"
            >
              {p === 1 ? 'Max' : `${p * 100}%`}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mb-3">
          {mode === 'buy'
            ? <>Cash dispo : <span className="text-brand-soft font-semibold">{money(cash)}</span></>
            : <>Tu détiens : <span className="text-brand-soft font-semibold">{money(holdingsValue)}</span></>}
        </p>

        {flash && (
          <p className={`text-center text-sm font-semibold mb-3 ${flash.ok ? 'text-gain' : 'text-loss'}`}>
            {flash.msg}
          </p>
        )}

        {isAnalyst ? (
          <>
            <button onClick={recommend} className="btn bg-gold text-base-900 w-full">
              🔍 Recommander à mon associé
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              En tant qu'Analyste tu ne passes pas les ordres — c'est ton Trader qui décide.
            </p>
          </>
        ) : (
          <button
            onClick={submit}
            disabled={amount <= 0 || amount > maxAmount + 1e-6}
            className={`btn w-full ${mode === 'buy' ? 'btn-buy' : 'btn-sell'}`}
          >
            {mode === 'buy' ? 'Confirmer l\'achat' : 'Confirmer la vente'}
          </button>
        )}
      </div>

      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  )
}
