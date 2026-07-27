export type Tab = 'market' | 'portfolio' | 'missions'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'market', label: 'Marché', icon: '🛒' },
  { id: 'portfolio', label: 'Portefeuille', icon: '💼' },
  { id: 'missions', label: 'Missions', icon: '🎯' },
]

export function TabBar({ active, onChange, missionBadge }: {
  active: Tab
  onChange: (t: Tab) => void
  missionBadge?: number
}) {
  return (
    <nav className="safe-bottom bg-base-800/95 backdrop-blur border-t border-base-700 flex">
      {TABS.map((t) => {
        const isActive = t.id === active
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`relative flex-1 flex flex-col items-center gap-0.5 py-2 transition ${
              isActive ? 'text-brand' : 'text-slate-400'
            }`}
          >
            <span className="text-xl">{t.icon}</span>
            <span className="text-[11px] font-semibold">{t.label}</span>
            {t.id === 'missions' && missionBadge ? (
              <span className="absolute top-1 right-1/2 translate-x-4 bg-loss text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                {missionBadge}
              </span>
            ) : null}
            {isActive && <span className="absolute -top-px h-0.5 w-8 bg-brand rounded-full" />}
          </button>
        )
      })}
    </nav>
  )
}
