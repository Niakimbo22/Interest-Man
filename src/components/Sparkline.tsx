import { memo } from 'react'

/**
 * Mini-courbe SVG légère (pas de lib) pour les tendances.
 * `color` s'adapte au sens de la variation.
 */
export const Sparkline = memo(function Sparkline({
  data,
  width = 64,
  height = 24,
  positive,
}: {
  data: number[]
  width?: number
  height?: number
  positive?: boolean
}) {
  if (data.length < 2) return <svg width={width} height={height} />
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)
  const points = data
    .map((v, i) => `${(i * stepX).toFixed(1)},${(height - ((v - min) / range) * height).toFixed(1)}`)
    .join(' ')
  const up = positive ?? data[data.length - 1] >= data[0]
  const color = up ? '#22c55e' : '#ef4444'
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
})
