import { memo, useId } from 'react'

/**
 * Mini-courbe SVG (pas de lib) : ligne + dégradé sous la courbe.
 * `positive` doit venir de la MÊME fenêtre que les données affichées, sinon
 * la couleur de la courbe contredit le pourcentage affiché à côté.
 */
export const Sparkline = memo(function Sparkline({
  data,
  width = 72,
  height = 30,
  positive,
}: {
  data: number[]
  width?: number
  height?: number
  positive?: boolean
}) {
  const gid = useId()
  if (!data || data.length < 2) return <svg width={width} height={height} />

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  // Marge verticale pour que la courbe ne colle pas aux bords.
  const pad = height * 0.12
  const usable = height - pad * 2
  const stepX = width / (data.length - 1)

  const pts = data.map(
    (v, i) => `${(i * stepX).toFixed(2)},${(pad + usable - ((v - min) / range) * usable).toFixed(2)}`,
  )
  const up = positive ?? data[data.length - 1] >= data[0]
  const color = up ? '#22c55e' : '#ef4444'

  return (
    <svg width={width} height={height} className="shrink-0">
      <defs>
        <linearGradient id={`sp${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${pts.join(' ')} ${width},${height}`} fill={`url(#sp${gid})`} />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
})
