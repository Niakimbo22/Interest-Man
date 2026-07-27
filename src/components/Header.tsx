import { useGame } from '@/store/gameStore'
import { money } from '@/lib/format'
import { levelProgress } from '@/store/leveling'
import { Sparkline } from './Sparkline'

export function Header() {
  const cash = useGame((s) => s.cash)
  const xp = useGame((s) => s.xp)
  const history = useGame((s) => s.netWorthHistory)
  const netWorth = useGame((s) => s.netWorth())

  const { level, ratio, nextFloor } = levelProgress(xp)
  const start = history[0] ?? netWorth
  const dayChange = netWorth - start

  return (
    <header className="safe-top px-4 pt-3 pb-4 bg-gradient-to-b from-base-800 to-base-900 border-b border-base-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Patrimoine net</p>
          <p className="text-3xl font-extrabold text-white tabular-nums">{money(netWorth)}</p>
          <p className={`text-sm font-semibold ${dayChange >= 0 ? 'text-gain' : 'text-loss'}`}>
            {dayChange >= 0 ? '▲' : '▼'} {money(Math.abs(dayChange))}
          </p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 bg-base-700 rounded-full px-3 py-1 mb-1">
            <span className="text-gold">★</span>
            <span className="font-bold text-white">Niv. {level}</span>
          </div>
          <Sparkline data={history} width={90} height={34} positive={dayChange >= 0} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="h-2 rounded-full bg-base-700 overflow-hidden">
            <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${ratio * 100}%` }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {Math.round(xp)} / {nextFloor} XP → niv. {level + 1}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] uppercase text-slate-400">Cash dispo</p>
          <p className="font-bold text-brand-soft tabular-nums">{money(cash)}</p>
        </div>
      </div>
    </header>
  )
}
