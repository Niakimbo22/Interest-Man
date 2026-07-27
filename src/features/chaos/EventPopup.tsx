import { useGame } from '@/store/gameStore'

const TONE_STYLE: Record<string, { ring: string; badge: string; label: string }> = {
  krach: { ring: 'border-loss', badge: 'bg-loss text-white', label: 'KRACH' },
  boom: { ring: 'border-gain', badge: 'bg-gain text-white', label: 'BOOM' },
  weird: { ring: 'border-purple-400', badge: 'bg-purple-500 text-white', label: 'BIZARRE' },
}

/** Popup plein écran quand un événement délirant frappe le marché (mode Chaos). */
export function EventPopup() {
  const event = useGame((s) => s.activeEvent)
  const dismiss = useGame((s) => s.dismissEvent)
  if (!event) return null

  const tone = TONE_STYLE[event.tone] ?? TONE_STYLE.weird
  const pctLabel = `${event.impact >= 0 ? '+' : ''}${Math.round(event.impact * 100)} %`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={dismiss} />
      <div
        className={`relative w-full max-w-sm card border-2 ${tone.ring} p-5 text-center animate-[pop_.25s_ease-out]`}
      >
        <span className={`inline-block text-[10px] font-extrabold tracking-widest px-2 py-1 rounded ${tone.badge}`}>
          {tone.label}
        </span>

        <div className="text-6xl my-3">{event.emoji}</div>

        <h2 className="text-lg font-extrabold text-white leading-tight">{event.headline}</h2>
        <p className="text-sm text-slate-300 mt-2 leading-snug">{event.detail}</p>

        <p className={`text-3xl font-extrabold mt-4 ${event.impact >= 0 ? 'text-gain' : 'text-loss'}`}>
          {pctLabel}
        </p>

        <button onClick={dismiss} className="btn btn-ghost w-full mt-5">
          Encaisser le choc
        </button>
      </div>

      <style>{`@keyframes pop{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  )
}
