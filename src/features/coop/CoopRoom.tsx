import { useEffect, useRef, useState } from 'react'
import { useCoop } from '@/coop/coopStore'
import { COOP_ROLES, otherRole } from '@/coop/roles'
import { leaveCoopRoom, sendCoopMessage } from '@/coop/p2p'
import { ASSET_BY_ID } from '@/data/assets'
import { useGame } from '@/store/gameStore'
import { money } from '@/lib/format'

/** Panneau de la boîte partagée : associé, statut de connexion, chat, recommandations. */
export function CoopRoom() {
  const { roomCode, role, connState, partnerPresent, messages } = useCoop()
  const netWorth = useGame((s) => s.netWorth())
  const cash = useGame((s) => s.cash)
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  if (!role || !roomCode) return null
  const me = COOP_ROLES[role]
  const partner = COOP_ROLES[otherRole(role)]

  const send = () => {
    const text = draft.trim()
    if (!text) return
    sendCoopMessage(text)
    setDraft('')
  }

  return (
    <div className="p-3 space-y-3">
      {/* Bandeau boîte */}
      <section className="card p-4 border-gold/40 bg-gradient-to-br from-gold/10 to-transparent">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Trésorerie commune</p>
            <p className="text-2xl font-extrabold text-white tabular-nums">{money(netWorth)}</p>
            <p className="text-xs text-gold">Cash dispo {money(cash)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-slate-400">Code</p>
            <p className="font-extrabold tracking-[0.2em] text-gold">{roomCode}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-base-900/60 rounded-xl p-2.5">
            <p className="text-[10px] uppercase text-slate-400">Toi</p>
            <p className="font-bold text-white text-sm">{me.emoji} {me.name}</p>
          </div>
          <div className="bg-base-900/60 rounded-xl p-2.5">
            <p className="text-[10px] uppercase text-slate-400">Ton associé</p>
            <p className="font-bold text-white text-sm">
              {partner.emoji} {partner.name}
              <span className={`ml-1.5 inline-block w-2 h-2 rounded-full align-middle ${
                partnerPresent ? 'bg-gain' : 'bg-slate-500'
              }`} />
            </p>
          </div>
        </div>

        {!partnerPresent && (
          <p className="text-xs text-slate-400 mt-3 text-center">
            {connState === 'lost'
              ? '⚠️ Ton associé s\'est déconnecté.'
              : `En attente de ton associé… donne-lui le code ${roomCode}`}
          </p>
        )}
      </section>

      {/* Rappel du rôle : ce que je peux / ce dont j'ai besoin */}
      <section className="card p-3">
        <p className="text-xs text-gain">✅ {me.power}</p>
        <p className="text-xs text-slate-400 mt-1">🤝 {me.needs}</p>
      </section>

      {/* Chat */}
      <section className="card flex flex-col" style={{ height: 320 }}>
        <p className="px-3 py-2 text-xs uppercase tracking-wide text-slate-400 border-b border-base-700">
          Discussion d'associés
        </p>

        <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.length === 0 && (
            <p className="text-center text-xs text-slate-500 py-8">
              Parlez-vous ! C'est tout l'intérêt du mode : décider ensemble.
            </p>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  m.from === 'me' ? 'bg-brand text-base-900 font-medium' : 'bg-base-700 text-slate-100'
                }`}
              >
                {m.assetId && ASSET_BY_ID[m.assetId] && (
                  <span className="mr-1">{ASSET_BY_ID[m.assetId].emoji}</span>
                )}
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-2 border-t border-base-700 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={partnerPresent ? 'Écris à ton associé…' : 'En attente de ton associé…'}
            className="flex-1 bg-base-900 border border-base-600 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-brand"
          />
          <button onClick={send} disabled={!draft.trim()} className="btn btn-ghost px-3 py-2">
            ➤
          </button>
        </div>
      </section>

      <button onClick={() => leaveCoopRoom()} className="text-xs text-slate-500 underline w-full text-center py-2">
        Quitter la boîte
      </button>
    </div>
  )
}
