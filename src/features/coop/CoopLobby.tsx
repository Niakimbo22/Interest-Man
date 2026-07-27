import { useState } from 'react'
import { ROLE_LIST, type CoopRole } from '@/coop/roles'
import { generateRoomCode, useCoop } from '@/coop/coopStore'
import { joinCoopRoom } from '@/coop/p2p'

/** Lobby coop : créer une boîte ou rejoindre celle d'un ami, et choisir son rôle. */
export function CoopLobby() {
  const [step, setStep] = useState<'intro' | 'create' | 'join'>('intro')
  const [role, setRole] = useState<CoopRole>('trader')
  const [code, setCode] = useState('')
  const [generated] = useState(generateRoomCode)
  const connState = useCoop((s) => s.connState)
  const error = useCoop((s) => s.error)

  const start = (host: boolean) => {
    const roomCode = host ? generated : code.trim().toUpperCase()
    if (roomCode.length < 4) return
    joinCoopRoom(roomCode, role, host)
  }

  const RolePicker = () => (
    <div className="space-y-2 mb-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">Choisis ton rôle</p>
      {ROLE_LIST.map((r) => (
        <button
          key={r.id}
          onClick={() => setRole(r.id)}
          className={`w-full card p-3 text-left transition ${
            role === r.id ? 'border-gold bg-gold/10' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{r.emoji}</span>
            <div className="flex-1">
              <p className="font-bold text-white">{r.name}</p>
              <p className="text-[11px] text-slate-400">{r.title}</p>
            </div>
            {role === r.id && <span className="text-gold">✓</span>}
          </div>
          <p className="text-[11px] text-gain mt-2">✅ {r.power}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">🤝 {r.needs}</p>
        </button>
      ))}
    </div>
  )

  if (connState === 'connecting') {
    return (
      <div className="p-6 text-center">
        <div className="text-5xl mb-3 animate-pulse">📡</div>
        <p className="font-bold text-white">Connexion en cours…</p>
        <p className="text-sm text-slate-400 mt-1">On cherche ton associé.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      {step === 'intro' && (
        <>
          <div className="text-center mb-6 pt-4">
            <div className="text-5xl mb-2">🤝</div>
            <h2 className="text-2xl font-extrabold text-gold">Votre boîte à deux</h2>
            <p className="text-sm text-slate-400 mt-2 leading-snug">
              Un seul portefeuille, deux associés. Chacun a un pouvoir que l'autre n'a pas —
              il va falloir se parler pour réussir.
            </p>
          </div>

          <div className="card p-4 mb-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Comment ça marche</p>
            <ul className="text-sm text-slate-300 space-y-1.5">
              <li>📈 <b className="text-white">Le Trader</b> passe les ordres, mais est aveugle.</li>
              <li>🔍 <b className="text-white">L'Analyste</b> voit les tendances, mais ne peut pas acheter.</li>
              <li>💬 Vous discutez en direct dans l'app pour décider ensemble.</li>
            </ul>
          </div>

          <button onClick={() => setStep('create')} className="btn bg-gold text-base-900 w-full mb-2">
            Créer une boîte
          </button>
          <button onClick={() => setStep('join')} className="btn btn-ghost w-full">
            Rejoindre celle d'un ami
          </button>
        </>
      )}

      {step === 'create' && (
        <>
          <button onClick={() => setStep('intro')} className="text-sm text-slate-400 mb-3">← Retour</button>
          <RolePicker />
          <div className="card p-4 text-center mb-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Code à donner à ton ami</p>
            <p className="text-4xl font-extrabold tracking-[0.3em] text-gold">{generated}</p>
            <button
              onClick={() => navigator.clipboard?.writeText(generated)}
              className="text-xs text-brand underline mt-2"
            >
              Copier le code
            </button>
          </div>
          <button onClick={() => start(true)} className="btn bg-gold text-base-900 w-full">
            Ouvrir la boîte
          </button>
        </>
      )}

      {step === 'join' && (
        <>
          <button onClick={() => setStep('intro')} className="text-sm text-slate-400 mb-3">← Retour</button>
          <RolePicker />
          <div className="card p-4 mb-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Code de ton ami</p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={8}
              className="w-full bg-base-900 border border-base-600 rounded-xl px-4 py-3 text-center text-2xl font-extrabold tracking-[0.25em] text-white outline-none focus:border-gold"
            />
          </div>
          <button
            onClick={() => start(false)}
            disabled={code.trim().length < 4}
            className="btn bg-gold text-base-900 w-full"
          >
            Rejoindre
          </button>
        </>
      )}

      {error && <p className="text-center text-sm text-loss mt-4">{error}</p>}

      <p className="text-center text-[11px] text-slate-500 mt-6 leading-snug">
        Connexion directe entre vos deux téléphones (chiffrée). Aucun compte, aucun serveur.
        <br />
        Si ça ne connecte pas, un réseau d'entreprise/école peut bloquer le P2P — essayez en 4G.
      </p>
    </div>
  )
}
