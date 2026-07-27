import { useMemo, useState } from 'react'
import { useGame } from '@/store/gameStore'
import { ASSET_BY_ID } from '@/data/assets'
import { money, price as fmtPrice, qty as fmtQty, change, pct } from '@/lib/format'

type Mode = 'buy' | 'sell'

export function TradeSheet({ assetId, onClose }: { assetId: string; onClose: () => void }) {
  const def = ASSET_BY_ID[assetId]
  const cash = useGame((s) => s.cash)
  const priceNow = useGame((s) => s.prices[assetId] ?? def.basePrice)
  const prevPrice = useGame((s) => s.prevPrices[assetId] ?? def.basePrice)
  const position = useGame((s) => s.positions[assetId])
  const buy = useGame((s) => s.buy)
  const sell = useGame((s) => s.sell)

  const [mode, setMode] = useState<Mode>('buy')
  const [amount, setAmount] = useState(0) // montant en euros
  const [flash, setFlash] = useState<{ ok: boolean; msg: string } | null>(null)

  const holdingsValue = (position?.quantity ?? 0) * priceNow
  const maxAmount = mode === 'buy' ? cash : holdingsValue
  const quantity = priceNow > 0 ? amount / priceNow : 0
  const chg = change(priceNow, prevPrice)

  const presets = useMemo(() => [0.1, 0.25, 0.5, 1], [])

  const submit = () => {
    if (amount <= 0) return
    const res = mode === 'buy' ? buy(assetId, quantity) : sell(assetId, quantity)
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
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md card rounded-b-none rounded-t-3xl p-5 safe-bottom animate-[slideUp_.2s_ease-out]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-base-600" />

        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">{def.emoji}</div>
          <div className="flex-1">
            <p className="font-bold text-white leading-tight">{def.name}</p>
            <p className="text-xs text-slate-400">{def.symbol}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-white tabular-nums">{fmtPrice(priceNow)}</p>
            <p className={`text-xs font-semibold ${chg >= 0 ? 'text-gain' : 'text-loss'}`}>{pct(chg)}</p>
          </div>
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

        <button
          onClick={submit}
          disabled={amount <= 0 || amount > maxAmount + 1e-6}
          className={`btn w-full ${mode === 'buy' ? 'btn-buy' : 'btn-sell'}`}
        >
          {mode === 'buy' ? 'Confirmer l\'achat' : 'Confirmer la vente'}
        </button>
      </div>

      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  )
}
