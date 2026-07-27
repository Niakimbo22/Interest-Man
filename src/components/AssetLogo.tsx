// Vrais logos des actifs, dessinés en SVG (aucune image à charger, net à toute taille).
// Remplace les emojis, qui donnaient un rendu "jeu pour enfants" au lieu d'une app finance.

interface LogoProps {
  size?: number
}

const wrap = (bg: string, children: React.ReactNode, size: number) => (
  <span
    className="inline-flex items-center justify-center rounded-full shrink-0"
    style={{ width: size, height: size, background: bg }}
  >
    {children}
  </span>
)

function Bitcoin({ size = 32 }: LogoProps) {
  return wrap(
    '#f7931a',
    <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="#fff">
      <path d="M16.4 10.6c.23-1.5-.92-2.3-2.5-2.84l.51-2.05-1.25-.31-.5 2c-.33-.08-.67-.16-1-.23l.5-2.01-1.24-.31-.51 2.04-.8-.19v-.01l-1.72-.43-.33 1.33s.92.21.9.22c.5.13.6.46.58.73l-.58 2.33c.04.01.08.02.13.04l-.13-.03-.82 3.26c-.06.15-.22.38-.57.3.01.02-.9-.23-.9-.23L4.6 16.4l1.62.4c.3.08.6.16.89.23l-.51 2.07 1.24.31.51-2.05c.34.09.67.18 1 .26l-.51 2.03 1.25.31.51-2.06c2.12.4 3.72.24 4.39-1.68.54-1.55-.03-2.44-1.14-3.02.81-.19 1.42-.72 1.58-1.82zm-2.83 4c-.39 1.55-3 .71-3.85.5l.68-2.74c.85.21 3.57.63 3.17 2.24zm.39-4.03c-.35 1.41-2.53.69-3.23.52l.62-2.48c.7.17 2.98.5 2.61 1.96z" />
    </svg>,
    size,
  )
}

function Ethereum({ size = 32 }: LogoProps) {
  return wrap(
    '#627eea',
    <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6}>
      <path fill="#fff" fillOpacity=".7" d="M12 2v7.4l6.2 2.8z" />
      <path fill="#fff" d="M12 2 5.8 12.2 12 9.4z" />
      <path fill="#fff" fillOpacity=".7" d="M12 16.9V22l6.2-8.6z" />
      <path fill="#fff" d="M12 22v-5.1l-6.2-3.5z" />
      <path fill="#fff" fillOpacity=".4" d="m12 15.7 6.2-3.5L12 9.4z" />
      <path fill="#fff" fillOpacity=".55" d="m5.8 12.2 6.2 3.5V9.4z" />
    </svg>,
    size,
  )
}

function Solana({ size = 32 }: LogoProps) {
  return wrap(
    '#101010',
    <svg viewBox="0 0 24 20" width={size * 0.58} height={size * 0.48}>
      <defs>
        <linearGradient id="solg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#9945ff" />
          <stop offset="100%" stopColor="#14f195" />
        </linearGradient>
      </defs>
      <g fill="url(#solg)">
        <path d="M4.3 14.7a.8.8 0 0 1 .57-.24h17.4c.36 0 .54.43.28.68l-3.44 3.4a.8.8 0 0 1-.56.23H1.15a.4.4 0 0 1-.28-.68z" />
        <path d="M4.3 1.23A.83.83 0 0 1 4.87 1h17.4c.36 0 .54.44.28.69l-3.44 3.4a.8.8 0 0 1-.56.23H1.15a.4.4 0 0 1-.28-.69z" />
        <path d="M18.55 7.92a.8.8 0 0 0-.56-.23H.59a.4.4 0 0 0-.28.68l3.44 3.4a.8.8 0 0 0 .56.24h17.4c.36 0 .54-.44.28-.69z" />
      </g>
    </svg>,
    size,
  )
}

function Dogecoin({ size = 32 }: LogoProps) {
  return wrap(
    '#c2a633',
    <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6}>
      <text
        x="12" y="12" textAnchor="middle" dominantBaseline="central"
        fontFamily="Georgia, serif" fontSize="17" fontWeight="700" fill="#fff"
      >
        Ð
      </text>
    </svg>,
    size,
  )
}

function Gold({ size = 32 }: LogoProps) {
  return (
    <span className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <defs>
          <linearGradient id="goldg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
        {/* Lingot vu de trois-quarts */}
        <path d="M7 20h18l2 6H5z" fill="url(#goldg)" stroke="#92400e" strokeWidth="1" />
        <path d="M10 13h12l1.6 6H8.4z" fill="url(#goldg)" stroke="#92400e" strokeWidth="1" />
        <path d="M13 7h6l1.2 5h-8.4z" fill="url(#goldg)" stroke="#92400e" strokeWidth="1" />
      </svg>
    </span>
  )
}

function Silver({ size = 32 }: LogoProps) {
  return (
    <span className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <defs>
          <linearGradient id="silverg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
        <path d="M7 20h18l2 6H5z" fill="url(#silverg)" stroke="#475569" strokeWidth="1" />
        <path d="M10 13h12l1.6 6H8.4z" fill="url(#silverg)" stroke="#475569" strokeWidth="1" />
        <path d="M13 7h6l1.2 5h-8.4z" fill="url(#silverg)" stroke="#475569" strokeWidth="1" />
      </svg>
    </span>
  )
}

function Apple({ size = 32 }: LogoProps) {
  return wrap(
    '#f1f5f9',
    <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="#0f172a">
      <path d="M17.05 12.54c-.03-2.7 2.2-4 2.3-4.06-1.25-1.83-3.2-2.08-3.9-2.11-1.66-.17-3.24.98-4.08.98-.84 0-2.14-.96-3.52-.93-1.81.03-3.48 1.05-4.4 2.67-1.88 3.26-.48 8.08 1.35 10.72.9 1.29 1.96 2.74 3.36 2.69 1.35-.06 1.86-.87 3.49-.87 1.63 0 2.09.87 3.51.84 1.45-.03 2.37-1.32 3.26-2.62 1.03-1.5 1.45-2.95 1.47-3.03-.03-.01-2.82-1.08-2.85-4.28M14.4 4.6c.74-.9 1.24-2.15 1.1-3.4-1.07.05-2.36.71-3.13 1.61-.69.8-1.29 2.07-1.13 3.29 1.19.09 2.41-.6 3.16-1.5" />
    </svg>,
    size,
  )
}

function Tesla({ size = 32 }: LogoProps) {
  return wrap(
    '#e31937',
    <svg viewBox="0 0 24 24" width={size * 0.66} height={size * 0.66} fill="#fff">
      <path d="M12 6.3c1.6 0 3-.15 3.9-.4l.9-1.5c-1.5.35-3.1.5-4.8.5s-3.3-.15-4.8-.5l.9 1.5c.9.25 2.3.4 3.9.4M12 8.1 10.6 20h2.8z" />
      <path d="M4 3.6C6.4 3.1 9.1 2.8 12 2.8s5.6.3 8 .8l.9-1.6C18.1 1.35 15.1 1 12 1S5.9 1.35 3.1 2z" />
    </svg>,
    size,
  )
}

function Nvidia({ size = 32 }: LogoProps) {
  return wrap(
    '#76b900',
    <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="#fff">
      <path d="M9.2 9.3v-1.6c.16-.01.32-.02.48-.02 4.4-.14 7.29 3.79 7.29 3.79s-3.12 4.33-6.46 4.33c-.45 0-.89-.07-1.31-.21v-4.9c1.71.21 2.06.97 3.09 2.68l2.29-1.93s-1.67-2.19-4.49-2.19c-.3 0-.6.02-.89.05m0-5.3v2.4l.48-.03c6.12-.21 10.11 5.02 10.11 5.02s-4.59 5.58-9.36 5.58c-.41 0-.82-.04-1.23-.11v1.48c.34.04.68.07 1.03.07 4.44 0 7.65-2.27 10.76-4.95.52.41 2.62 1.41 3.05 1.85-2.96 2.48-9.86 4.48-13.74 4.48-.37 0-.73-.02-1.1-.06v2.08H24V4zM9.2 16.32v1.27C5.1 16.86 3.96 12.6 3.96 12.6s1.97-2.18 5.24-2.53v1.39h-.01c-1.71-.21-3.05 1.39-3.05 1.39s.76 2.7 3.06 3.47M2.04 12.42s2.43-3.59 7.17-3.95V7.2C3.96 7.62 0 12.06 0 12.06s2.24 6.48 9.2 7.13v-1.34c-5.11-.63-7.16-5.43-7.16-5.43" />
    </svg>,
    size,
  )
}

function Lvmh({ size = 32 }: LogoProps) {
  return wrap(
    '#0f172a',
    <svg viewBox="0 0 32 32" width={size} height={size}>
      <text
        x="16" y="17" textAnchor="middle" dominantBaseline="central"
        fontFamily="Georgia, serif" fontSize="9.5" fontWeight="700" fill="#d4af37" letterSpacing="0.5"
      >
        LVMH
      </text>
    </svg>,
    size,
  )
}

function Building({ size = 32, floors = 3, color = '#38bdf8' }: LogoProps & { floors?: number; color?: string }) {
  const rows = Array.from({ length: floors })
  return wrap(
    '#1e293b',
    <svg viewBox="0 0 24 24" width={size * 0.66} height={size * 0.66}>
      <rect x="5" y={20 - floors * 4} width="14" height={floors * 4 + 1} rx="1" fill={color} opacity="0.25" />
      <rect x="5" y={20 - floors * 4} width="14" height={floors * 4 + 1} rx="1" fill="none" stroke={color} strokeWidth="1.4" />
      {rows.map((_, r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={7 + c * 4} y={20 - floors * 4 + 2 + r * 4}
            width="2.4" height="2.4" rx="0.4" fill={color}
          />
        )),
      )}
    </svg>,
    size,
  )
}

const LOGOS: Record<string, (p: LogoProps) => JSX.Element> = {
  btc: Bitcoin,
  eth: Ethereum,
  sol: Solana,
  doge: Dogecoin,
  gold: Gold,
  silver: Silver,
  aapl: Apple,
  tsla: Tesla,
  nvda: Nvidia,
  mc: Lvmh,
  studio: (p) => <Building {...p} floors={1} color="#38bdf8" />,
  appart: (p) => <Building {...p} floors={3} color="#a78bfa" />,
  immeuble: (p) => <Building {...p} floors={4} color="#fbbf24" />,
}

/** Logo d'un actif. Retombe sur un badge avec le symbole si aucun logo n'est défini. */
export function AssetLogo({ assetId, symbol, size = 32 }: { assetId: string; symbol?: string; size?: number }) {
  const Logo = LOGOS[assetId]
  if (Logo) return <Logo size={size} />
  return wrap(
    '#334155',
    <span className="font-bold text-slate-200" style={{ fontSize: size * 0.34 }}>
      {(symbol ?? '?').slice(0, 3)}
    </span>,
    size,
  )
}
