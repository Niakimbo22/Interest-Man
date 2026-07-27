import { MISSIONS } from '@/data/missions'
import { ASSETS } from '@/data/assets'
import { useGame } from '@/store/gameStore'
import { money } from '@/lib/format'
import { levelProgress } from '@/store/leveling'

export function MissionsScreen() {
  const status = useGame((s) => s.missionStatus)
  const claim = useGame((s) => s.claimMission)
  const xp = useGame((s) => s.xp)
  const resetGame = useGame((s) => s.resetGame)

  const { level, ratio, nextFloor } = levelProgress(xp)
  const nextUnlocks = ASSETS.filter((a) => a.unlockLevel === level + 1)

  const sorted = [...MISSIONS].sort((a, b) => {
    const rank = (id: string) => (status[id] === 'claimable' ? 0 : status[id] === 'active' ? 1 : 2)
    return rank(a.id) - rank(b.id)
  })

  return (
    <div className="p-3 space-y-3">
      {/* Bloc niveau */}
      <section className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Niveau actuel</p>
            <p className="text-2xl font-extrabold text-white">
              <span className="text-gold">★</span> Niveau {level}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">XP</p>
            <p className="font-bold text-brand-soft tabular-nums">{Math.round(xp)} / {nextFloor}</p>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-base-700 overflow-hidden">
          <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${ratio * 100}%` }} />
        </div>
        {nextUnlocks.length > 0 && (
          <p className="text-xs text-slate-400 mt-2">
            🔓 Au niveau {level + 1} :{' '}
            <span className="text-white font-semibold">
              {nextUnlocks.map((a) => `${a.emoji} ${a.name}`).join(', ')}
            </span>
          </p>
        )}
      </section>

      <h2 className="font-bold text-white px-1 pt-1">Missions</h2>

      <div className="space-y-2">
        {sorted.map((m) => {
          const st = status[m.id] ?? 'active'
          const isDone = st === 'done'
          const isClaimable = st === 'claimable'

          return (
            <div
              key={m.id}
              className={`card p-3 flex items-center gap-3 ${isDone ? 'opacity-55' : ''} ${
                isClaimable ? 'border-gold/60 bg-gold/5' : ''
              }`}
            >
              <div className="text-2xl w-9 text-center shrink-0">{isDone ? '✅' : m.icon}</div>

              <div className="flex-1 min-w-0">
                <p className={`font-bold text-white ${isDone ? 'line-through' : ''}`}>{m.title}</p>
                <p className="text-xs text-slate-400">{m.description}</p>
                <p className="text-[11px] text-gold mt-0.5">
                  🎁 {m.reward.cash ? `${money(m.reward.cash)} + ` : ''}{m.reward.xp} XP
                </p>
              </div>

              {isClaimable && (
                <button
                  onClick={() => claim(m.id)}
                  className="btn bg-gold text-base-900 text-sm py-2 px-3 shrink-0 animate-pulse"
                >
                  Récupérer
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="pt-4 pb-2 text-center">
        <button
          onClick={() => {
            if (confirm('Recommencer une nouvelle partie ? Ta progression sera perdue.')) resetGame()
          }}
          className="text-xs text-slate-500 underline"
        >
          Recommencer une partie
        </button>
      </div>
    </div>
  )
}
