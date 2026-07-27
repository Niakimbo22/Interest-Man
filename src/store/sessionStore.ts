import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GAME_MODES, type GameMode } from '@/data/gameModes'

// État de SESSION (hors partie) : quel mode est sélectionné, a-t-on déjà choisi.
// Volontairement séparé de gameStore : chaque mode a sa propre sauvegarde de partie,
// mais le mode courant, lui, est global.

interface SessionState {
  mode: GameMode | null
  setMode: (m: GameMode | null) => void
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      mode: null,
      setMode: (m) => set({ mode: m }),
    }),
    { name: 'interest-man-session-v1' },
  ),
)

/** Définition du mode courant (fallback sur Réaliste si aucun mode choisi). */
export function currentModeDef() {
  return GAME_MODES[useSession.getState().mode ?? 'realiste']
}
