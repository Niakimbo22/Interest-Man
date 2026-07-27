import { MODE_LIST } from '@/data/gameModes'
import { switchGameMode } from '@/store/gameStore'
import { money } from '@/lib/format'

/** Écran d'accueil : choix du mode de jeu. Chaque mode a sa propre sauvegarde. */
export function ModeSelectScreen() {
  return (
    <div className="min-h-full flex flex-col justify-center p-5 bg-base-900">
      <div className="text-center mb-8">
        <div className="text-5xl mb-2">💰</div>
        <h1 className="text-3xl font-extrabold text-white">Interest-Man</h1>
        <p className="text-sm text-slate-400 mt-1">Choisis ton mode de jeu</p>
      </div>

      <div className="space-y-3">
        {MODE_LIST.map((m) => {
          const saved = typeof localStorage !== 'undefined' && localStorage.getItem(m.storageKey) !== null
          return (
            <button
              key={m.id}
              onClick={() => switchGameMode(m.id)}
              className="w-full card p-4 text-left active:scale-[0.98] transition hover:border-base-600"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-extrabold text-lg ${m.accent}`}>{m.name}</p>
                  <p className="text-xs text-slate-400 leading-snug">{m.tagline}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-[11px]">
                <span className="bg-base-700 rounded-full px-2 py-0.5 text-slate-300">
                  Départ {money(m.startingCash)}
                </span>
                {m.chaosEvents && (
                  <span className="bg-orange-500/20 text-orange-300 rounded-full px-2 py-0.5">
                    Événements délirants
                  </span>
                )}
                {saved && (
                  <span className="bg-gain/20 text-gain rounded-full px-2 py-0.5 ml-auto">
                    Partie sauvegardée
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <p className="text-center text-[11px] text-slate-500 mt-6">
        Chaque mode a sa propre sauvegarde — tu ne perds rien en changeant.
      </p>
    </div>
  )
}
