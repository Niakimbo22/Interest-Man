import { useId, useMemo } from 'react'
import { price as fmtPrice } from '@/lib/format'

/** Périodes proposées sur la fiche d'un actif. */
export const RANGES = [
  { id: '7j', days: 7 },
  { id: '1M', days: 30 },
  { id: '3M', days: 90 },
  { id: 'Max', days: Infinity },
] as const

export type RangeId = (typeof RANGES)[number]['id']

/** Découpe la série sur la période demandée. */
export function sliceRange(series: number[], days: number): number[] {
  if (!series?.length) return []
  if (!Number.isFinite(days)) return series
  return series.slice(Math.max(0, series.length - days - 1))
}

/**
 * Graphique de prix : grille, axe de prix, ligne + dégradé.
 * Volontairement fait main en SVG (léger, aucune dépendance, net sur mobile).
 */
export function PriceChart({ data, height = 170 }: { data: number[]; height?: number }) {
  const gid = useId()
  const { pts, area, min, max, up } = useMemo(() => {
    if (!data || data.length < 2) {
      return { pts: '', area: '', min: 0, max: 0, up: true }
    }
    const lo = Math.min(...data)
    const hi = Math.max(...data)
    const range = hi - lo || 1
    const w = 100
    const h = 100
    const stepX = w / (data.length - 1)
    const coords = data.map(
      (v, i) => `${(i * stepX).toFixed(2)},${(h - ((v - lo) / range) * h).toFixed(2)}`,
    )
    return {
      pts: coords.join(' '),
      area: `0,${h} ${coords.join(' ')} ${w},${h}`,
      min: lo,
      max: hi,
      up: data[data.length - 1] >= data[0],
    }
  }, [data])

  if (!data || data.length < 2) {
    return <div style={{ height }} className="flex items-center justify-center text-xs text-slate-500">Pas de données</div>
  }

  const color = up ? '#22c55e' : '#ef4444'

  return (
    <div className="relative" style={{ height }}>
      {/* Repères de prix */}
      <div className="absolute inset-y-0 right-0 flex flex-col justify-between text-[10px] text-slate-500 pointer-events-none">
        <span>{fmtPrice(max)}</span>
        <span>{fmtPrice(min)}</span>
      </div>

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id={`pc${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grille horizontale */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#1e293b" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        ))}

        <polygon points={area} fill={`url(#pc${gid})`} />
        <polyline
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
